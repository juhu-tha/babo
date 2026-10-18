import { GoogleGenAI } from "@google/genai";
import express, { type Request, type Response, type NextFunction } from "express";
import compression from "compression";
import crypto from "crypto";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

// ---------------------------------------------------------------------------
// Konfiguration über Umgebungsvariablen (in AI Studio: Settings → Secrets)
//   GEMINI_API_KEY        Schlüssel für die Gemini-Analysen (optional)
//   ADMIN_PASSWORD        Kennwort für Admin-Bereich und Zurücksetzen der Live-Abstimmung
//   POLL_ADMIN_PASSWORD   optional eigenes Kennwort nur für die Live-Abstimmung
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

// --- Einfache Anfragebegrenzung im Arbeitsspeicher ---------------------------

function rateLimit(opts: { windowMs: number; max: number; name: string }) {
  const hits = new Map<string, { count: number; reset: number }>();
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

function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000");
    // Zunächst nur berichtend, damit die Einbettung in AI Studio und Google Translate
    // nicht blockiert werden. Nach Prüfung der Konsole auf "Content-Security-Policy" umstellen.
    res.setHeader(
      "Content-Security-Policy-Report-Only",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com https://www.gstatic.com",
        "img-src 'self' data: blob: https:",
        "font-src 'self' data: https://fonts.gstatic.com",
        "connect-src 'self' https://translate.googleapis.com https://translate-pa.googleapis.com",
        "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
        "frame-ancestors 'self' https://aistudio.google.com https://*.aistudio.google.com https://ai.studio https://*.ai.studio",
        "object-src 'none'",
        "base-uri 'self'",
      ].join("; ")
    );
  }
  next();
}

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
    rateLimit({ name: "gemini", windowMs: 60 * 60 * 1000, max: 30 }),
    async (req, res) => {
      try {
        const { prompt, systemInstruction } = req.body ?? {};
        if (typeof prompt !== "string" || prompt.trim().length === 0) {
          return res.status(400).json({ error: "Kein Prompt übermittelt." });
        }
        if (prompt.length > 12_000 || (systemInstruction && String(systemInstruction).length > 4_000)) {
          return res.status(413).json({ error: "Anfrage zu lang." });
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

        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            systemInstruction:
              typeof systemInstruction === "string" && systemInstruction
                ? systemInstruction
                : "Du bist ein erfahrener Professor und Dr.-Ing. für Baustoffkunde und Bauchemie an der TH Augsburg.",
            temperature: 0.7,
          },
        });

        res.json({
          status: "live",
          text: response.text || "Keine Antwort von Gemini erhalten.",
          isDemo: false,
        });
      } catch (error: any) {
        console.error("Gemini-API Fehler:", error);
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

  // Unbekannte API-Pfade
  app.use("/api", (_req, res) => res.status(404).json({ error: "Nicht gefunden." }));

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== "production") {
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
    // Fehlende Dateien (z. B. alte Asset-Namen) nicht mit der Startseite beantworten.
    app.get(/\.[a-z0-9]{2,5}$/i, (_req, res) => res.status(404).send("Not found"));
    app.get("*", (_req, res) => {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
