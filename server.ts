import { GoogleGenAI } from "@google/genai";
import express, { type Request, type Response, type NextFunction } from "express";
import compression from "compression";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { pruefeAntwort, semesterSchluessel } from "./src/data/kurzfragebogen.ts";
import { ladeSpeicher, nimmAuf, speichereSpeicher, statistik } from "./server/kurzfragebogen.ts";
import { KI_FUNKTION_AKTIV, KI_HINWEIS_AUS } from "./src/data/kiSchalter.ts";
import { tabAusPfad } from "./src/routing/pfad.ts";

// ---------------------------------------------------------------------------
// Konfiguration über Umgebungsvariablen (in AI Studio: Settings → Secrets)
//   GEMINI_API_KEY        Schlüssel für die Gemini-Analysen (optional)
//   ADMIN_PASSWORD        Kennwort für Admin-Bereich und Zurücksetzen der Live-Abstimmung
//   POLL_ADMIN_PASSWORD   optional eigenes Kennwort nur für die Live-Abstimmung
//   GEMINI_DAILY_LIMIT    optional, KI-Anfragen pro Tag insgesamt (Standard 300)
//   GEMINI_MODEL          optional, Gemini-Modell-ID (Standard gemini-3.8-flash, laut Google-Modellliste
//                         ai.google.dev/models am 26.10.2026 aktuelles stabiles Flash-Modell)
//   ALLOWED_ORIGINS       optional, weitere erlaubte Herkunft(en) für KI-Anfragen und Kurzfragebogen, kommagetrennt
//   FEEDBACK_DATEI        optional, Datei für den Kurzfragebogen (Standard laufzeitdaten/kurzfragebogen.json)
// Ist kein Kennwort gesetzt, bleiben Admin-Bereich und Zurücksetzen gesperrt.
// ---------------------------------------------------------------------------

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY_MISSING");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// --- Kennwortprüfung und signierte Sitzungs-Tokens --------------------------

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 Stunden

function adminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.length > 0 ? pw : null;
}

function pollPassword(): string | null {
  const pw = process.env.POLL_ADMIN_PASSWORD;
  return pw && pw.length > 0 ? pw : adminPassword();
}

/** Zeitkonstanter Vergleich, damit die Antwortzeit nichts über das Kennwort verrät. */
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a, "utf8").digest();
  const hb = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(ha, hb);
}

function signingKey(secret: string): Buffer {
  // Ändert sich das Kennwort, werden alle bisherigen Tokens ungültig.
  return crypto.createHash("sha256").update(`baustoffboard-admin:${secret}`, "utf8").digest();
}

function issueToken(secret: string): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = String(expiresAt);
  const sig = crypto.createHmac("sha256", signingKey(secret)).update(payload).digest("base64url");
  return { token: `${payload}.${sig}`, expiresAt };
}

function verifyToken(token: string | undefined, secret: string | null): boolean {
  if (!token || !secret) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !/^\d+$/.test(payload)) return false;
  if (Number(payload) < Date.now()) return false;
  const expected = crypto.createHmac("sha256", signingKey(secret)).update(payload).digest("base64url");
  return safeEqual(sig, expected);
}

function bearer(req: Request): string | undefined {
  const h = req.headers.authorization;
  return h && h.startsWith("Bearer ") ? h.slice(7) : undefined;
}

/** Berechtigt für Admin-Aktionen: gültiges Token oder korrektes Kennwort im Body. */
function isAuthorized(req: Request, secret: string | null): boolean {
  if (!secret) return false;
  if (verifyToken(bearer(req), secret)) return true;
  const pw = typeof req.body?.password === "string" ? req.body.password : "";
  return pw.length > 0 && safeEqual(pw, secret);
}

// --- Version für /api/health (package.json liegt im Container neben dist/) -------

const APP_VERSION: string = (() => {
  try {
    const v = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8")).version;
    return typeof v === "string" ? v : "unbekannt";
  } catch {
    return "unbekannt";
  }
})();

// --- Einfache Anfragebegrenzung im Arbeitsspeicher ---------------------------

function rateLimit(opts: { windowMs: number; max: number; name: string }) {
  // Schlüssel enthält die Client-IP; nur im Arbeitsspeicher, nie geloggt oder gespeichert.
  // Abgelaufene Einträge werden regelmäßig entfernt, damit IPs nicht über das Zeitfenster hinaus verbleiben.
  const hits = new Map<string, { count: number; reset: number }>();
  const aufraeumen = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  }, Math.max(opts.windowMs, 60_000));
  aufraeumen.unref();
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${opts.name}:${req.ip}`;
    const entry = hits.get(key);
    if (!entry || entry.reset < now) {
      hits.set(key, { count: 1, reset: now + opts.windowMs });
      if (hits.size > 50_000) {
        for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
      }
      return next();
    }
    entry.count += 1;
    if (entry.count > opts.max) {
      res.setHeader("Retry-After", Math.ceil((entry.reset - now) / 1000));
      return res.status(429).json({ error: "Zu viele Anfragen. Bitte später erneut versuchen." });
    }
    return next();
  };
}

// --- Cookie-Hilfen (ohne zusätzliche Abhängigkeit) ---------------------------

function readCookie(req: Request, name: string): string | undefined {
  const raw = req.headers.cookie;
  if (!raw) return undefined;
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

/** Anonyme Teilnehmer-ID für die Live-Abstimmung (verhindert Mehrfachabstimmung je Gerät). */
function voterId(req: Request, res: Response): string {
  let id = readCookie(req, "bb_voter");
  if (!id || !/^[A-Za-z0-9_-]{16,64}$/.test(id)) {
    id = crypto.randomBytes(16).toString("base64url");
    res.cookie("bb_voter", id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000,
      path: "/api/polls",
    });
  }
  return id;
}

// --- Sicherheits-Header -------------------------------------------------------

// Inline-Skripte in dist/index.html (Vorladen der Modul-Chunks, AP 5.5) per SHA-256 in der CSP erlauben;
// Datenblöcke (application/json, application/ld+json) werden nicht ausgeführt und brauchen keinen Hash.
let skriptHashes: string[] | undefined;
export function inlineSkriptHashes(html: string): string[] {
  return [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attrs, inhalt]) => inhalt.trim() && !/type="application\/(ld\+)?json"/.test(attrs))
    .map(([, , inhalt]) => `'sha256-${crypto.createHash("sha256").update(inhalt).digest("base64")}'`);
}
function distSkriptHashes(): string[] {
  if (!skriptHashes) {
    try { skriptHashes = inlineSkriptHashes(fs.readFileSync(path.join(process.cwd(), "dist", "index.html"), "utf8")); }
    catch { skriptHashes = []; }
  }
  return skriptHashes;
}

function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000");
    // baustoffboard.de kann die App per Rahmenweiterleitung einbetten → muss erlaubt bleiben
    const frameAncestors = "frame-ancestors 'self' https://baustoffboard.de https://www.baustoffboard.de https://aistudio.google.com https://*.aistudio.google.com https://ai.studio https://*.ai.studio";
    // Erzwungen: risikoarme Direktiven (Phase 1, AP 1.9); Einbettung (frame-ancestors) bleibt vorerst nur berichtend
    res.setHeader(
      "Content-Security-Policy",
      ["object-src 'none'", "base-uri 'self'", "form-action 'self'"].join("; ")
    );
    // Vollständige Richtlinie zunächst berichtend: Skripte ohne 'unsafe-inline' (Inline-Skripte sind
    // nach public/boot/ ausgelagert; Ausnahme: das Vorlade-Skript, per SHA-256 erlaubt, s. inlineSkriptHashes).
    // Nach Prüfung der Browser-Konsole im Betrieb (Google Translate!) auf "Content-Security-Policy" umstellen.
    res.setHeader(
      "Content-Security-Policy-Report-Only",
      [
        "default-src 'self'",
        ["script-src 'self'", ...distSkriptHashes(), "https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com"].join(" "),
        "style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://www.gstatic.com",
        "img-src 'self' data: blob: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://translate.googleapis.com https://translate-pa.googleapis.com",
        "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
        frameAncestors,
        "object-src 'none'",
        "base-uri 'self'",
      ].join("; ")
    );
  }
  next();
}

// --- KI-Proxy: Schutz vor Missbrauch (Umsetzungsplan Phase 1, AP 1.1) -----------

/** Feste Systemanweisung – wird nicht vom Browser übernommen (KI-Transparenz, AI Act Art. 50). */
const KI_SYSTEMANWEISUNG = [
  "Sie sind ein KI-Assistent im Lernportal BaustoffBoard (Lehrangebot der TH Augsburg).",
  "Sie sind keine reale Person und geben sich nicht als Lehrende der Hochschule aus.",
  "Beantworten Sie ausschließlich Fragen zu Baustoffen, Bauchemie, Bauphysik, Tragwerken, Normen,",
  "Bauen im Bestand, Nachhaltigkeit und Kreislaufwirtschaft im Bauwesen. Andere Anfragen lehnen Sie",
  "in einem Satz höflich ab. Nennen Sie Normen mit Ausgabe, kennzeichnen Sie Unsicherheiten ausdrücklich",
  "und weisen Sie darauf hin, dass Ihre Antwort fachlich zu prüfen ist und keinen Nachweis ersetzt.",
  "Antworten Sie auf Deutsch in der Sie-Form.",
].join(" ");

/** Tageskontingent für alle Nutzer zusammen (Kostendeckel), Standard 300 Anfragen. */
const KI_TAGESLIMIT = Math.max(0, Number(process.env.GEMINI_DAILY_LIMIT) || 300);
/** Modell-ID für /api/gemini/analyze; Wechsel ohne Codeänderung über GEMINI_MODEL (Kopfkommentar). */
const KI_MODELL = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
const kiTag = { datum: "", anzahl: 0 };
function kiKontingentFrei(): boolean {
  const heute = new Date().toISOString().slice(0, 10);
  if (kiTag.datum !== heute) { kiTag.datum = heute; kiTag.anzahl = 0; }
  if (kiTag.anzahl >= KI_TAGESLIMIT) return false;
  kiTag.anzahl += 1;
  return true;
}

/** Nur Anfragen aus der eigenen Seite (Origin = eigener Host oder in ALLOWED_ORIGINS). */
function gleicheHerkunft(req: Request): boolean {
  const origin = req.headers.origin;
  if (!origin) return false;
  let host: string;
  try { host = new URL(origin).host; } catch { return false; }
  const eigene = [req.headers.host, req.headers["x-forwarded-host"]]
    .flatMap(h => (Array.isArray(h) ? h : String(h ?? "").split(",")))
    .map(h => h.trim())
    .filter(Boolean);
  const erlaubt = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",").map(o => o.trim()).filter(Boolean)
    .map(o => { try { return new URL(o).host; } catch { return o; } });
  return eigene.includes(host) || erlaubt.includes(host);
}

// --- Vorgerenderte Modulseiten (Z52) ---------------------------------------------
// dist/modul/routen.json: { ids: vorgerenderte Module, bekannt: alle Modul-IDs, aliase: Alias → ID,
//   inaktiv: abgeschaltete Seiten samt Aliasen (INAKTIVE_GRUPPEN in src/registry/modules.ts) }
interface VorgerenderteRouten { ids: Set<string>; bekannt: Set<string>; aliase: Record<string, string>; inaktiv: Set<string> }
let routenCache: VorgerenderteRouten | null | undefined;
function vorgerenderteRouten(distPath: string): VorgerenderteRouten | null {
  if (routenCache === undefined) {
    try {
      const j = JSON.parse(fs.readFileSync(path.join(distPath, "modul", "routen.json"), "utf8")) as { ids?: string[]; bekannt?: string[]; aliase?: Record<string, string>; inaktiv?: string[] };
      const ids = new Set(j.ids ?? []);
      routenCache = { ids, bekannt: new Set([...(j.bekannt ?? []), ...ids]), aliase: { ...(j.aliase ?? {}) }, inaktiv: new Set(j.inaktiv ?? []) };
    } catch {
      routenCache = null; // ohne Vorrendern gebaut: jede /modul/<id> bekommt index.html
    }
  }
  return routenCache;
}

// Hinweisseite für abgeschaltete Seiten (z. B. Lernpfade nach Lehrveranstaltung, 27.10.2026): Status 404 statt 410,
// weil die Abschaltung vorübergehend ist (410 = endgültig entfernt); noindex nimmt die Adresse aus dem Suchindex,
// nach dem Wiedereinschalten führt die Sitemap sie wieder. Ohne Skript, ohne Weiterleitung – keine Ladeschleife.
const INAKTIV_SEITE = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Derzeit nicht verfügbar – BaustoffBoard THA</title>
<style>body{font-family:system-ui,sans-serif;margin:0;padding:3rem 1rem;background:#f8f7f5;color:#1f2937}main{max-width:36rem;margin:0 auto}h1{font-size:1.5rem}a{color:#8b1a2b;font-weight:700}@media (prefers-color-scheme:dark){body{background:#111827;color:#f3f4f6}a{color:#fda4af}}</style>
</head>
<body>
<main>
<h1>Lernpfade derzeit nicht verfügbar</h1>
<p>Die Lernpfade nach Lehrveranstaltung sind vorübergehend abgeschaltet. Alle Fachmodule bleiben erreichbar.</p>
<p><a href="/">Zur Startseite</a> · <a href="/modul/modulstruktur">Zur Modulübersicht</a></p>
</main>
</body>
</html>
`;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.disable("x-powered-by");
  // Cloud Run steht hinter genau einem Google-Frontend-Proxy: echte Client-IP für die Begrenzung.
  app.set("trust proxy", 1);
  app.use(compression());
  app.use(securityHeaders);
  app.use(express.json({ limit: "64kb" }));

  // Einfacher Besuchszähler (Datei im Container; geht bei Neustart verloren)
  const analyticsFile = path.join(process.cwd(), "analytics.json");
  if (!fs.existsSync(analyticsFile)) {
    fs.writeFileSync(analyticsFile, JSON.stringify({ visits: 0 }), "utf-8");
  }

  // --- API Routes ---

  // Gemini-Analysen (begrenzt, damit der Schlüssel nicht für fremde Zwecke verbraucht wird)
  app.post(
    "/api/gemini/analyze",
    rateLimit({ name: "gemini", windowMs: 60 * 60 * 1000, max: 10 }),
    async (req, res) => {
      try {
        // KI-Funktion zentral abgeschaltet (src/data/kiSchalter.ts, Entscheidung 27.10.2026): keine Übermittlung an Google
        if (!KI_FUNKTION_AKTIV) {
          return res.status(503).json({ error: KI_HINWEIS_AUS });
        }
        if (!gleicheHerkunft(req)) {
          return res.status(403).json({ error: "Anfragen sind nur aus dem BaustoffBoard möglich." });
        }
        const { prompt, hinweisBestaetigt } = req.body ?? {};
        if (hinweisBestaetigt !== true) {
          return res.status(400).json({ error: "Bitte bestätigen Sie den Hinweis zur Datenübermittlung." });
        }
        if (typeof prompt !== "string" || prompt.trim().length === 0) {
          return res.status(400).json({ error: "Kein Prompt übermittelt." });
        }
        if (prompt.length > 4_000) {
          return res.status(413).json({ error: "Anfrage zu lang (höchstens 4 000 Zeichen)." });
        }

        if (!process.env.GEMINI_API_KEY) {
          return res.json({
            status: "simulated",
            text: `### ⚠️ Keine Live-Verbindung zum KI-Dienst (GEMINI_API_KEY fehlt)

Dieses BaustoffBoard-Modul besitzt regulär eine **Live-Anbindung an Google Gemini**. Da derzeit kein **GEMINI_API_KEY** hinterlegt ist, läuft die Bereitstellung im **simulierten Übungsmodus**.

---

### Generierter Prompt für Copy-Paste (bereit für Ihr LLM):
\`\`\`text
${prompt}
\`\`\``,
            isDemo: true,
          });
        }

        if (!kiKontingentFrei()) {
          return res.status(429).json({ error: "Das Tageskontingent für KI-Anfragen ist ausgeschöpft. Bitte morgen erneut versuchen oder den Prompt in einen eigenen KI-Assistenten kopieren." });
        }

        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: KI_MODELL,
          contents: prompt,
          config: {
            systemInstruction: KI_SYSTEMANWEISUNG,
            temperature: 0.4,
            maxOutputTokens: 2048,
          },
        });

        res.json({
          status: "live",
          text: response.text || "Keine Antwort von Gemini erhalten.",
          isDemo: false,
        });
      } catch (error: any) {
        console.error(`Gemini-API Fehler (Modell ${KI_MODELL}):`, error);
        res.status(500).json({ error: "Fehler bei der Kommunikation mit dem KI-Dienst." });
      }
    }
  );

  // Besuchszähler lesen (nur für Admins)
  app.get("/api/analytics", (req, res) => {
    if (!verifyToken(bearer(req), adminPassword())) {
      return res.status(401).json({ error: "Nicht angemeldet." });
    }
    try {
      res.json(JSON.parse(fs.readFileSync(analyticsFile, "utf-8")));
    } catch {
      res.json({ visits: 0 });
    }
  });

  // Seitenaufruf zählen (ohne Speicherung personenbezogener Daten)
  app.post("/api/analytics/visit", rateLimit({ name: "visit", windowMs: 60 * 1000, max: 30 }), (_req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(analyticsFile, "utf-8"));
      data.visits += 1;
      fs.writeFileSync(analyticsFile, JSON.stringify(data), "utf-8");
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Could not track visit" });
    }
  });

  // --- Admin-Anmeldung --------------------------------------------------------

  app.post("/api/admin/login", rateLimit({ name: "login", windowMs: 15 * 60 * 1000, max: 10 }), (req, res) => {
    const secret = adminPassword();
    if (!secret) {
      return res.status(503).json({
        error: "Admin-Zugang ist nicht eingerichtet (Secret ADMIN_PASSWORD fehlt).",
      });
    }
    const pw = typeof req.body?.password === "string" ? req.body.password : "";
    if (!pw || !safeEqual(pw, secret)) {
      return res.status(401).json({ error: "Ungültiges Kennwort. Zugriff verweigert." });
    }
    res.json(issueToken(secret));
  });

  app.get("/api/admin/session", (req, res) => {
    res.json({ valid: verifyToken(bearer(req), adminPassword()) });
  });

  // --- Live-Abstimmung in der Vorlesung -------------------------------------

  type PollEntry = { counts: number[]; voters: Map<string, number> };
  const pollStore = new Map<string, Map<string, PollEntry>>();
  const ID_RE = /^[A-Za-z0-9_.:-]{1,80}$/;
  const MAX_LECTURES = 500;
  const MAX_QUESTIONS = 300;
  const MAX_VOTERS = 2_000;

  const serialize = (lectureId: string) => {
    const out: Record<string, number[]> = {};
    const lecture = pollStore.get(lectureId);
    if (lecture) for (const [q, e] of lecture) out[q] = e.counts;
    return out;
  };

  const getEntry = (lectureId: string, questionId: string): PollEntry | null => {
    let lecture = pollStore.get(lectureId);
    if (!lecture) {
      if (pollStore.size >= MAX_LECTURES) return null;
      lecture = new Map();
      pollStore.set(lectureId, lecture);
    }
    let entry = lecture.get(questionId);
    if (!entry) {
      if (lecture.size >= MAX_QUESTIONS) return null;
      entry = { counts: [0, 0, 0, 0], voters: new Map() };
      lecture.set(questionId, entry);
    }
    return entry;
  };

  const validIds = (req: Request, res: Response): boolean => {
    if (!ID_RE.test(req.params.lectureId)) {
      res.status(400).json({ error: "Ungültige Vorlesungs-ID." });
      return false;
    }
    return true;
  };

  app.get("/api/polls/:lectureId", rateLimit({ name: "poll-read", windowMs: 60 * 1000, max: 120 }), (req, res) => {
    if (!validIds(req, res)) return;
    res.setHeader("Cache-Control", "no-store");
    res.json({ lectureId: req.params.lectureId, votes: serialize(req.params.lectureId) });
  });

  app.post("/api/polls/:lectureId/vote", rateLimit({ name: "poll-vote", windowMs: 60 * 1000, max: 60 }), (req, res) => {
    if (!validIds(req, res)) return;
    const { lectureId } = req.params;
    const { questionId, optionIndex } = req.body ?? {};
    if (typeof questionId !== "string" || !ID_RE.test(questionId) || !Number.isInteger(optionIndex)) {
      return res.status(400).json({ error: "questionId und optionIndex erforderlich." });
    }
    const entry = getEntry(lectureId, questionId);
    if (!entry) return res.status(507).json({ error: "Speichergrenze der Abstimmung erreicht." });
    if (optionIndex < 0 || optionIndex >= entry.counts.length) {
      return res.status(400).json({ error: "Ungültige Antwortoption." });
    }

    const voter = voterId(req, res);
    const previous = entry.voters.get(voter);
    if (previous === undefined) {
      if (entry.voters.size >= MAX_VOTERS) return res.status(507).json({ error: "Teilnehmergrenze erreicht." });
      entry.counts[optionIndex] += 1;
      entry.voters.set(voter, optionIndex);
    } else if (previous !== optionIndex) {
      // Antwort ändern statt doppelt zählen
      entry.counts[previous] = Math.max(0, entry.counts[previous] - 1);
      entry.counts[optionIndex] += 1;
      entry.voters.set(voter, optionIndex);
    }
    res.json({ success: true, votes: serialize(lectureId) });
  });

  // Simulierte Stimmen für Demos – nur für Dozierende
  app.post("/api/polls/:lectureId/simulate", rateLimit({ name: "poll-admin", windowMs: 60 * 1000, max: 30 }), (req, res) => {
    if (!validIds(req, res)) return;
    if (!pollPassword()) return res.status(503).json({ error: "Zugang für Dozierende ist nicht eingerichtet." });
    if (!isAuthorized(req, pollPassword())) return res.status(403).json({ error: "Nur für Dozierende." });

    const { lectureId } = req.params;
    const { questionId, count = 10, correctIndex = 1 } = req.body ?? {};
    if (typeof questionId !== "string" || !ID_RE.test(questionId)) {
      return res.status(400).json({ error: "questionId erforderlich." });
    }
    const entry = getEntry(lectureId, questionId);
    if (!entry) return res.status(507).json({ error: "Speichergrenze der Abstimmung erreicht." });
    const n = Math.min(Math.max(1, Number(count) || 1), 50);
    for (let i = 0; i < n; i++) {
      const idx = Math.random() < 0.55 && correctIndex < entry.counts.length
        ? correctIndex
        : Math.floor(Math.random() * entry.counts.length);
      entry.counts[idx] += 1;
    }
    res.json({ success: true, votes: serialize(lectureId) });
  });

  // Zurücksetzen – nur für Dozierende
  app.post("/api/polls/:lectureId/reset", rateLimit({ name: "poll-admin", windowMs: 60 * 1000, max: 30 }), (req, res) => {
    if (!validIds(req, res)) return;
    if (!pollPassword()) {
      return res.status(503).json({ error: "Zurücksetzen ist nicht eingerichtet (Secret ADMIN_PASSWORD fehlt)." });
    }
    if (!isAuthorized(req, pollPassword())) {
      return res.status(403).json({ error: "Ungültiges Kennwort. Zurücksetzen nur für Dozierende." });
    }
    const { lectureId } = req.params;
    const { questionId } = req.body ?? {};
    const lecture = pollStore.get(lectureId);
    if (typeof questionId === "string" && questionId) {
      lecture?.delete(questionId);
    } else {
      pollStore.delete(lectureId);
    }
    res.json({ success: true, votes: serialize(lectureId) });
  });

  // --- Anonymer Kurzfragebogen (Phase 6, AP 6.9) -------------------------------
  // Gespeichert werden nur Zählwerte je Semester und Aussage sowie Freitexte ohne Metadaten
  // (keine IP, kein User-Agent, kein Zeitpunkt, keine Cookies). Die Anfragebegrenzung hält die IP
  // nur kurzzeitig im Arbeitsspeicher. Datei wie beim Besuchszähler im Container (nicht im Repository).
  const kfDatei = process.env.FEEDBACK_DATEI || path.join(process.cwd(), "laufzeitdaten", "kurzfragebogen.json");
  const kfSpeicher = ladeSpeicher(kfDatei);

  app.post("/api/feedback", rateLimit({ name: "feedback", windowMs: 60 * 60 * 1000, max: 5 }), (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    if (!gleicheHerkunft(req)) {
      return res.status(403).json({ error: "Anfragen sind nur aus dem BaustoffBoard möglich." });
    }
    const pruefung = pruefeAntwort(req.body);
    if (!pruefung.ok) return res.status(400).json({ error: pruefung.fehler });
    if (!nimmAuf(kfSpeicher, pruefung.antwort, semesterSchluessel())) {
      return res.status(507).json({ error: "Speichergrenze des Fragebogens erreicht." });
    }
    try {
      speichereSpeicher(kfDatei, kfSpeicher);
    } catch {
      // Inhalt bewusst nicht protokollieren; Zählwerte bleiben bis zum Neustart im Arbeitsspeicher
      console.error("Kurzfragebogen: Speichern fehlgeschlagen.");
    }
    res.json({ success: true });
  });

  // Auswertung – nur für Admins
  app.get("/api/feedback/stats", (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    if (!verifyToken(bearer(req), adminPassword())) {
      return res.status(401).json({ error: "Nicht angemeldet." });
    }
    res.json({ aktuell: semesterSchluessel(), ...statistik(kfSpeicher) });
  });

  // Betriebs-Check für Cloud Run / Monitoring (Phase 5, AP 5.8): keine personenbezogenen Daten,
  // keine Anfragebegrenzung (kein IP-Bezug), nicht cachen
  app.get("/api/health", (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.json({ status: "ok", version: APP_VERSION, uptime: Math.round(process.uptime()) });
  });

  // Unbekannte API-Pfade
  app.use("/api", (_req, res) => res.status(404).json({ error: "Nicht gefunden." }));

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== "production") {
    // Vite nur in der Entwicklung laden: Ein statischer Import würde im Produktions-Bundle
    // (dist/server.cjs) mitgebündelt und beim Start mit "Invalid URL" abbrechen.
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: process.cwd(),
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Dateien mit Hash im Namen ändern sich nie: ein Jahr im Browser zwischenspeichern.
    app.use(
      "/assets",
      express.static(path.join(distPath, "assets"), { immutable: true, maxAge: "1y", index: false })
    );
    app.use(
      express.static(distPath, {
        index: false,
        setHeaders: (res, filePath) => {
          if (/\.(woff2?|ttf|otf|svg|png|jpe?g|webp|ico)$/i.test(filePath)) {
            res.setHeader("Cache-Control", "public, max-age=604800");
          } else {
            res.setHeader("Cache-Control", "no-cache");
          }
        },
      })
    );
    // Modulseiten /modul/<id> (Z52): vorgerenderte Datei aus dist/modul/ (scripts/vorrendern.ts), sonst index.html.
    // Alias und Großschreibung → 301 auf die kanonische Adresse; unbekannte ID → 404 mit index.html (App zeigt den
    // Hinweis „Seite nicht gefunden“, Gesamtgutachten 03.11.2026).
    app.get("/modul/:id", (req, res) => {
      const roh = String(req.params.id);
      const id = roh.trim().toLowerCase();
      const r = vorgerenderteRouten(distPath);
      if (r?.inaktiv.has(id)) {
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("X-Robots-Tag", "noindex");
        return res.status(404).type("html").send(INAKTIV_SEITE);
      }
      const suche = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
      const ziel = id === "start" ? "/" : r?.aliase[id] ? `/modul/${encodeURIComponent(r.aliase[id])}` : id !== roh ? `/modul/${encodeURIComponent(id)}` : undefined;
      if (ziel) return res.redirect(301, ziel + suche);
      res.setHeader("Cache-Control", "no-cache");
      if (r?.ids.has(id)) return res.sendFile(path.join(distPath, "modul", `${id}.html`));
      res.status(r && !r.bekannt.has(id) ? 404 : 200).sendFile(path.join(distPath, "index.html"));
    });
    // Fehlende Dateien (z. B. alte Asset-Namen) nicht mit der Startseite beantworten.
    app.get(/\.[a-z0-9]{2,5}$/i, (_req, res) => res.status(404).send("Not found"));
    // Übrige Pfade: Startseite unter „/“ (und /index.html), sonst 404 mit index.html – die App zeigt dort den Hinweis
    // „Seite nicht gefunden“ (wie Vercel mit dist/404.html)
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-cache");
      res.status(tabAusPfad(req.path) === null ? 404 : 200).sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
