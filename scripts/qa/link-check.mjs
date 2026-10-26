#!/usr/bin/env node
/**
 * Monatliche Prüfung der externen Links (Zwischenreview 10/2026, Paket Z16)
 *
 * Sammelt alle externen URLs aus src/ und content/ (falls vorhanden), prüft jede Adresse einmal und
 * schreibt einen Bericht statt abzubrechen:
 *   docs/linkcheck/<JJJJ-MM>.md    Bericht mit Fundstellen (Datei:Zeile)
 *   docs/linkcheck/<JJJJ-MM>.json  maschinenlesbar
 *
 *   node scripts/qa/link-check.mjs [--datum JJJJ-MM] [--out docs/linkcheck] [--verzoegerung 2000]
 *        [--parallel 6] [--cache .cache/link-check] [--cache-tage 7] [--max 0] [--nur-host <host>]
 *        [--ohne-wikipedia-api] [--ersetzen] [--issue-body datei.md] [--pr-body datei.md]
 *
 * Klassen: ok · weiterleitung (dauerhaft → Vorschlag für neue URL) · kaputt (4xx/5xx/DNS/Netz)
 *          · gesperrt (robots.txt, 401/403/429/Bot-Schutz → manuell prüfen)
 *
 * Regeln für den Abruf (Details: docs/linkcheck/README.md):
 * - robots.txt jedes Hosts wird vor dem ersten Abruf gelesen und befolgt (Gruppe „babo-link-check“,
 *   sonst „*“; Crawl-delay). Nicht abrufbar (5xx/Netz) → Host wird nicht abgefragt (gesperrt).
 * - HEAD, nur bei Fehlstatus GET; Antwortkörper werden nie gelesen oder gespeichert (TDM: es findet
 *   kein Text- und Data-Mining statt; ein „tdm-reservation“-Header wird nur protokolliert).
 * - eindeutiger User-Agent, höchstens ein Abruf je Host alle 2 s, Hosts begrenzt parallel.
 * - Wikipedia: Action-API (50 Titel je Anfrage, seriell, maxlag) statt Einzelabrufe der Artikel.
 * - Cache nur der Prüfergebnisse (Status, Ziel), keine Inhalte.
 * - keine Zusatzpakete (global fetch, Node ≥ 18).
 * Exit-Code 2, wenn kein einziger Abruf eine Antwort lieferte (Workflow legt trotzdem ein Issue an).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const AGENT = 'babo-link-check';
export const USER_AGENT = `${AGENT}/1.0 (+https://github.com/juhu-tha/babo; Lehrplattform BaustoffBoard, monatliche Linkpruefung)`;
export const MAX_HOPS = 10;
export const WIKI_BATCH = 50;
/** Crawl-delay über dieser Grenze (s): Host nicht abfragen, sondern manuell prüfen */
export const MAX_CRAWL_DELAY = 60;

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const schlafen = ms => new Promise(r => setTimeout(r, ms));

// ---------------------------------------------------------------------------------------------
// Extraktion
// ---------------------------------------------------------------------------------------------

export const TEXT_ENDUNGEN = /\.(tsx?|jsx?|mjs|cjs|json|md|mdx|css|html?|ya?ml|txt|csv)$/i;
const URL_RE = /https?:\/\/[^\s"'`<>\\{}|^]+/g;
/** Zeilen mit dieser Markierung werden übersprungen (z. B. Beispiel-URLs in Texten) */
export const IGNORIER_MARKE = 'linkcheck-ignore';

/** Kürzt Satzzeichen und nicht ausgeglichene Klammern am Ende einer gefundenen URL. */
export function bereinigeUrl(roh) {
  let u = roh;
  u = u.replace(/&(?:quot|apos|lt|gt|#\d+);.*$/, '');
  for (;;) {
    const vorher = u;
    u = u.replace(/[.,;:!?*_~]+$/, '');
    for (const [auf, zu] of [['(', ')'], ['[', ']']]) {
      if (u.endsWith(zu) && u.split(auf).length < u.split(zu).length) u = u.slice(0, -1);
    }
    if (u === vorher) break;
  }
  return u;
}

/** Nicht prüfbare oder nicht gemeinte Adressen (lokal, Beispiel, XML-Namensräume) */
export function istAusgeschlossen(url) {
  let u;
  try { u = new URL(url); } catch { return 'ungültig'; }
  const h = u.hostname.toLowerCase();
  if (!h.includes('.') || h === 'localhost' || /^(127\.|0\.0\.0\.0|10\.|192\.168\.|\[)/.test(h) || h.endsWith('.local') || h.endsWith('.localhost')) return 'lokal';
  if (/(^|\.)example\.(com|org|net)$/.test(h) || h.endsWith('.example') || h.endsWith('.test') || h.endsWith('.invalid')) return 'Beispiel';
  if (h === 'www.w3.org' && /^\/(19|20)\d\d\//.test(u.pathname)) return 'XML-Namensraum';
  if (u.username || u.password) return 'mit Zugangsdaten';
  return null;
}

/**
 * Alle externen URLs eines Textes mit Zeile und Position.
 * @returns {{url:string, zeile:number, index:number}[]}
 */
export function extrahiereUrls(text) {
  const out = [];
  const zeilenStarts = [0];
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) zeilenStarts.push(i + 1);
  const zeileVon = idx => {
    let lo = 0, hi = zeilenStarts.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (zeilenStarts[m] <= idx) lo = m; else hi = m - 1; }
    return lo;
  };
  for (const m of text.matchAll(URL_RE)) {
    // Vorlage (Template-String `…/${x}`) – Ziel erst zur Laufzeit bekannt
    if (m[0].endsWith('$') && text[m.index + m[0].length] === '{') continue;
    const url = bereinigeUrl(m[0]);
    if (url.length < 12 || !/^https?:\/\/[^/]+\.[^/]/.test(url)) continue;
    const z = zeileVon(m.index);
    const zeilenText = text.slice(zeilenStarts[z], zeilenStarts[z + 1] ?? text.length);
    if (zeilenText.includes(IGNORIER_MARKE)) continue;
    if (istAusgeschlossen(url)) continue;
    out.push({ url, zeile: z + 1, index: m.index });
  }
  return out;
}

/**
 * Fasst Fundstellen mehrerer Dateien zusammen: Map(url → [{datei, zeile}]) in stabiler Reihenfolge.
 * @param {{pfad:string,text:string}[]} dateien
 */
export function sammleUrls(dateien) {
  const map = new Map();
  for (const { pfad, text } of dateien) {
    for (const f of extrahiereUrls(text)) {
      if (!map.has(f.url)) map.set(f.url, []);
      const liste = map.get(f.url);
      if (!liste.some(x => x.datei === pfad && x.zeile === f.zeile)) liste.push({ datei: pfad, zeile: f.zeile });
    }
  }
  return new Map([...map].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

/** Liest alle Textdateien unter den Wurzeln (fehlende Wurzeln, z. B. content/, werden übersprungen). */
export function leseQuellen(repo, wurzeln = ['src', 'content']) {
  const out = [];
  for (const w of wurzeln) {
    const abs = path.join(repo, w);
    if (!fs.existsSync(abs)) continue;
    (function walk(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) { if (e.name !== 'node_modules' && !e.name.startsWith('.')) walk(p); }
        else if (TEXT_ENDUNGEN.test(e.name)) out.push({ pfad: path.relative(repo, p).split(path.sep).join('/'), text: fs.readFileSync(p, 'utf8') });
      }
    })(abs);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// robots.txt (wie normen-check.mjs, eigener Agent-Name)
// ---------------------------------------------------------------------------------------------

export function parseRobots(text, agent = AGENT) {
  const gruppen = [];
  let aktuelle = null;
  let letzteWarAgent = false;
  for (const zeile of text.split(/\r?\n/)) {
    const z = zeile.replace(/#.*$/, '').trim();
    const m = z.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const wert = m[2].trim();
    if (key === 'user-agent') {
      if (!letzteWarAgent) { aktuelle = { agents: [], regeln: [], crawlDelay: null }; gruppen.push(aktuelle); }
      aktuelle.agents.push(wert.toLowerCase());
      letzteWarAgent = true;
      continue;
    }
    letzteWarAgent = false;
    if (!aktuelle) continue;
    if (key === 'allow' || key === 'disallow') {
      if (wert) aktuelle.regeln.push({ erlaubt: key === 'allow', pfad: wert });
    } else if (key === 'crawl-delay') {
      const d = Number(wert);
      if (Number.isFinite(d)) aktuelle.crawlDelay = d;
    }
  }
  const a = agent.toLowerCase();
  const passend = gruppen.filter(g => g.agents.some(x => x !== '*' && a.startsWith(x)));
  const wahl = passend.length ? passend : gruppen.filter(g => g.agents.includes('*'));
  return {
    regeln: wahl.flatMap(g => g.regeln),
    crawlDelay: wahl.reduce((d, g) => (g.crawlDelay != null ? Math.max(d ?? 0, g.crawlDelay) : d), null),
  };
}

function robotsMuster(pfad) {
  const ende = pfad.endsWith('$');
  const kern = (ende ? pfad.slice(0, -1) : pfad).split('*').map(esc).join('.*');
  return new RegExp('^' + kern + (ende ? '$' : ''));
}

export function robotsErlaubt(robots, pfadMitQuery) {
  let best = null;
  for (const r of robots.regeln) {
    if (!robotsMuster(r.pfad).test(pfadMitQuery)) continue;
    if (!best || r.pfad.length > best.pfad.length || (r.pfad.length === best.pfad.length && r.erlaubt)) best = r;
  }
  return best ? best.erlaubt : true;
}

// ---------------------------------------------------------------------------------------------
// Klassifikation
// ---------------------------------------------------------------------------------------------

export const DAUERHAFT = new Set([301, 308]);
export const VORUEBERGEHEND = new Set([302, 303, 307]);
const NETZ_KAPUTT = new Set(['ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED', 'ECONNRESET', 'EHOSTUNREACH', 'ENETUNREACH', 'CERT_HAS_EXPIRED', 'ERR_TLS_CERT_ALTNAME_INVALID', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'SELF_SIGNED_CERT_IN_CHAIN']);

/** Bot-Schutz/Zugriffssperre statt echtem Fehler (→ manuell prüfen) */
export function istBotSchutz(status, headers = {}) {
  if (status === 401 || status === 403 || status === 429) return true;
  if (headers['cf-mitigated']) return true;
  if (status === 503 && /cloudflare|akamai|ddos-guard|sucuri/i.test(headers.server || '')) return true;
  return false;
}

const ohneWww = h => h.toLowerCase().replace(/^www\./, '');

/** Weiterleitung von einer Unterseite auf die Startseite oder eine Anmeldeseite: vermutlich entfernt. */
export function istWeicheWeiterleitung(von, nach) {
  try {
    const a = new URL(von), b = new URL(nach);
    const tief = a.pathname.replace(/\/+$/, '') !== '';
    const start = b.pathname.replace(/\/+$/, '') === '' || /^\/(de|en|index\.\w+|home|startseite)\/?$/i.test(b.pathname);
    if (tief && start && !b.search) return true;
    if (/\/(login|signin|sign-in|anmelden|auth|sso)\b/i.test(b.pathname)) return true;
  } catch { /* ungültig */ }
  return false;
}

/** Darf die URL automatisch ersetzt werden? (nur dauerhafte Weiterleitung innerhalb derselben Site) */
export function istSichereErsetzung(von, nach) {
  if (!nach || von === nach) return false;
  let a, b;
  try { a = new URL(von); b = new URL(nach); } catch { return false; }
  if (ohneWww(a.hostname) !== ohneWww(b.hostname)) return false;
  if (a.protocol === 'https:' && b.protocol === 'http:') return false;
  if (istWeicheWeiterleitung(von, nach)) return false;
  // Startseite bleibt Startseite (Weiterleitungen auf /de/, /index.php?title=Hauptseite … sind weniger stabil)
  if (a.pathname.replace(/\/+$/, '') === '' && (b.pathname.replace(/\/+$/, '') !== '' || b.search)) return false;
  if (/[;?&](jsessionid|sid|phpsessid|session|token|utm_[a-z]+|fbclid|gclid)=/i.test(b.search + ';' + b.pathname)) return false;
  if (/;jsessionid=/i.test(b.pathname)) return false;
  return true;
}

/**
 * Bewertet eine Abrufkette. hops: [{url, status, location?, headers?, fehler?, gesperrt?}]
 * Liefert {klasse, status, grund, endUrl, dauerhaft, vorschlag, sicher, hinweise}
 */
export function klassifiziere(url, hops) {
  const letzter = hops.at(-1);
  const kette = hops.map(h => ({ url: h.url, status: h.status }));
  const basis = { url, kette, status: letzter?.status ?? 0, endUrl: letzter?.url ?? url, hinweise: [] };
  if (!letzter) return { ...basis, klasse: 'kaputt', grund: 'kein Abruf' };
  if (letzter.gesperrt) return { ...basis, klasse: 'gesperrt', grund: letzter.gesperrt };
  if (letzter.fehler) {
    const code = letzter.fehler;
    if (code === 'Weiterleitungsschleife') return { ...basis, klasse: 'kaputt', grund: code };
    if (NETZ_KAPUTT.has(code)) return { ...basis, klasse: 'kaputt', grund: code === 'ENOTFOUND' ? 'DNS: Host nicht gefunden' : `Netz: ${code}` };
    return { ...basis, klasse: 'kaputt', grund: `Netz: ${code}` };
  }
  if (letzter.status >= 300 && letzter.status < 400) {
    return { ...basis, klasse: 'kaputt', grund: hops.length > MAX_HOPS ? `mehr als ${MAX_HOPS} Weiterleitungen` : 'Weiterleitung ohne gültiges Ziel' };
  }
  if (istBotSchutz(letzter.status, letzter.headers)) {
    return { ...basis, klasse: 'gesperrt', grund: `HTTP ${letzter.status}${letzter.headers?.['cf-mitigated'] ? ' (Bot-Schutz)' : letzter.status === 429 ? ' (Rate-Limit)' : ' (Zugriff verweigert, evtl. Bot-Schutz)'}` };
  }
  if (letzter.status >= 400 || letzter.status < 200) return { ...basis, klasse: 'kaputt', grund: `HTTP ${letzter.status}` };
  // 2xx
  const weiter = hops.slice(0, -1);
  if (!weiter.length) return { ...basis, klasse: 'ok', grund: `HTTP ${letzter.status}` };
  let n = 0;
  while (n < weiter.length && DAUERHAFT.has(weiter[n].status)) n++;
  const dauerhaft = n > 0;
  const vorschlag = dauerhaft ? hops[n].url : null;
  const ganzDauerhaft = n === weiter.length;
  const weich = istWeicheWeiterleitung(url, letzter.url);
  const hinweise = [];
  if (weich) hinweise.push('Weiterleitung auf Start-/Anmeldeseite – Ziel vermutlich entfernt');
  const sicher = dauerhaft && ganzDauerhaft && !weich && istSichereErsetzung(url, vorschlag);
  return {
    ...basis,
    klasse: 'weiterleitung',
    grund: weiter.map(h => h.status).join(' → ') + ` → ${letzter.status}`,
    dauerhaft,
    vorschlag,
    sicher,
    hinweise,
  };
}

/**
 * Bekannte Adressen, die serverseitig nicht prüfbar sind und deshalb nicht abgerufen werden.
 * DIN Media: Die Suche (/de/suche?q=…) wird clientseitig erzeugt und liefert serverseitig 404
 * (siehe docs/normen-check/README.md); im Browser funktioniert sie.
 */
export const SONDERFAELLE = [
  { muster: /^https:\/\/www\.dinmedia\.de\/de\/suche\?/, klasse: 'ok', grund: 'DIN-Media-Suche (clientseitig, serverseitig nicht prüfbar) – nicht abgerufen' },
];

export function sonderfall(url) {
  return SONDERFAELLE.find(s => s.muster.test(url)) ?? null;
}

/** Zusätzliche inhaltliche Hinweise, unabhängig vom Abruf */
export function urlHinweise(url) {
  const h = [];
  try {
    const u = new URL(url);
    if (/(^|\.)youtube\.com$/.test(u.hostname) && u.pathname === '/results') h.push('YouTube-Suchergebnis statt konkretem Video – keine stabile Quelle');
    if (/(^|\.)google\.[a-z.]+$/.test(u.hostname) && u.pathname === '/search') h.push('Suchmaschinen-Link – keine stabile Quelle');
    if (u.protocol === 'http:') h.push('unverschlüsselt (http)');
  } catch { /* ungültig */ }
  return h;
}

// ---------------------------------------------------------------------------------------------
// Abruf
// ---------------------------------------------------------------------------------------------

/**
 * Standard-Abruf eines einzelnen Hops ohne Weiterleitungen zu folgen. Der Körper wird verworfen,
 * außer bei methode 'ROBOTS' (GET, Text der robots.txt, höchstens 512 KB).
 */
export async function standardHolen(url, methode = 'HEAD') {
  const r = await fetch(url, {
    method: methode === 'ROBOTS' ? 'GET' : methode,
    headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'de', Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.5' },
    redirect: 'manual',
    signal: AbortSignal.timeout(20_000),
  });
  let text;
  if (methode === 'ROBOTS' && r.status === 200) text = (await r.text()).slice(0, 512 * 1024);
  else { try { await r.body?.cancel(); } catch { /* egal */ } }
  const headers = {};
  for (const k of ['location', 'server', 'cf-mitigated', 'retry-after', 'tdm-reservation', 'content-type']) {
    const v = r.headers.get(k);
    if (v != null) headers[k] = v;
  }
  return { status: r.status, headers, text };
}

/** Standard-Abruf eines JSON-Dokuments (Wikipedia-API) */
export async function standardJson(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Api-User-Agent': USER_AGENT, Accept: 'application/json' },
    signal: AbortSignal.timeout(30_000),
  });
  const text = await r.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* kein JSON */ }
  return { status: r.status, json, retryAfter: r.headers.get('retry-after') };
}

function fehlerCode(e) {
  // vor e.code prüfen: DOMException „TimeoutError“ trägt den numerischen Code 23
  if (e?.name === 'TimeoutError' || e?.name === 'AbortError' || e?.cause?.name === 'TimeoutError') return 'Zeitüberschreitung';
  const c = e?.cause?.code || (typeof e?.code === 'string' ? e.code : null);
  if (c) return c;
  return String(e?.cause?.message || e?.message || e).slice(0, 80);
}

export class LinkPruefer {
  constructor({ holen = standardHolen, holenJson = standardJson, verzoegerungMs = 2000, parallel = 6, log = () => {}, jetzt = () => Date.now() } = {}) {
    Object.assign(this, { holen, holenJson, verzoegerungMs, parallel, log, jetzt });
    this.robots = new Map();
    this.warteschlange = new Map(); // host → Promise (serialisiert Abrufe je Host)
    this.letzter = new Map();
    this.statistik = { abrufe: 0, head: 0, get: 0, antworten: 0, netzfehler: 0, robotsGesperrt: 0, wikiApi: 0, tdmVorbehalt: [] };
  }

  /** Führt fn für den Host seriell und mit Mindestabstand aus. */
  proHost(host, crawlDelay, fn) {
    const vorher = this.warteschlange.get(host) ?? Promise.resolve();
    const lauf = vorher.then(async () => {
      const abstand = Math.max(this.verzoegerungMs, (crawlDelay ?? 0) * 1000);
      const seit = this.jetzt() - (this.letzter.get(host) ?? -Infinity);
      if (seit < abstand) await schlafen(abstand - seit);
      try { return await fn(); } finally { this.letzter.set(host, this.jetzt()); }
    });
    this.warteschlange.set(host, lauf.catch(() => {}));
    return lauf;
  }

  async einHop(url, methode, crawlDelay) {
    const host = new URL(url).host;
    return this.proHost(host, crawlDelay, async () => {
      this.statistik.abrufe++;
      this.statistik[methode === 'HEAD' ? 'head' : 'get']++;
      try {
        const r = await this.holen(url, methode);
        this.statistik.antworten++;
        if (r.headers?.['tdm-reservation'] === '1' && !this.statistik.tdmVorbehalt.includes(host)) this.statistik.tdmVorbehalt.push(host);
        return r;
      } catch (e) {
        this.statistik.netzfehler++;
        return { status: 0, headers: {}, fehler: fehlerCode(e) };
      }
    });
  }

  /** robots.txt des Origins: {regeln, crawlDelay} | {gesperrt: grund} | {kaputt: code} */
  robotsFuer(origin) {
    if (!this.robots.has(origin)) {
      this.robots.set(origin, (async () => {
        let url = `${origin}/robots.txt`;
        for (let i = 0; i < 5; i++) {
          const host = new URL(url).host;
          const r = await this.proHost(host, null, async () => {
            this.statistik.abrufe++;
            try { return await this.holen(url, 'ROBOTS'); } catch (e) { return { status: 0, headers: {}, fehler: fehlerCode(e) }; }
          });
          if (r.fehler) {
            if (NETZ_KAPUTT.has(r.fehler)) return { kaputt: r.fehler };
            return { gesperrt: `robots.txt nicht abrufbar (${r.fehler})` };
          }
          if (r.status >= 300 && r.status < 400 && r.headers?.location) { url = new URL(r.headers.location, url).href; continue; }
          if (r.status === 200) {
            const p = parseRobots(r.text ?? '');
            if (p.crawlDelay != null && p.crawlDelay > MAX_CRAWL_DELAY) return { gesperrt: `Crawl-delay ${p.crawlDelay} s` };
            return p;
          }
          if (r.status >= 400 && r.status < 500) return { regeln: [], crawlDelay: null }; // RFC 9309: keine Einschränkung
          if (r.status >= 200 && r.status < 300) return { gesperrt: `robots.txt nicht abrufbar (HTTP ${r.status}, vermutlich Bot-Schutz)` };
          return { gesperrt: `robots.txt nicht abrufbar (HTTP ${r.status})` };
        }
        return { regeln: [], crawlDelay: null };
      })());
    }
    return this.robots.get(origin);
  }

  /** Prüft eine URL (ohne Fragment) inkl. Weiterleitungskette. */
  /**
   * Prüft eine URL. Endet eine HEAD-Kette mit einem Fehler, wird die Kette einmal nur mit GET
   * wiederholt (manche Server leiten HEAD auf Fehlerseiten um).
   */
  async pruefe(url) {
    const sonder = sonderfall(url);
    if (sonder) return { url, kette: [], status: 0, endUrl: url, hinweise: [], klasse: sonder.klasse, grund: sonder.grund, quelle: 'sonderfall' };
    let erg = await this.pruefeKette(url, false);
    if (erg.klasse === 'kaputt' && erg.kette.length > 1 && erg.status >= 400) {
      const nochmal = await this.pruefeKette(url, true);
      if (nochmal.klasse !== 'kaputt') erg = nochmal;
    }
    return erg;
  }

  async pruefeKette(url, nurGet) {
    const hops = [];
    let aktuell = url.replace(/#.*$/, '');
    const gesehen = new Set();
    for (let i = 0; i <= MAX_HOPS; i++) {
      const u = new URL(aktuell);
      const robots = await this.robotsFuer(u.origin);
      if (robots.kaputt) { hops.push({ url: aktuell, status: 0, fehler: robots.kaputt }); break; }
      if (robots.gesperrt) { hops.push({ url: aktuell, status: 0, gesperrt: robots.gesperrt }); break; }
      if (!robotsErlaubt(robots, u.pathname + u.search)) {
        this.statistik.robotsGesperrt++;
        hops.push({ url: aktuell, status: 0, gesperrt: 'durch robots.txt ausgeschlossen' });
        break;
      }
      let r = await this.einHop(aktuell, nurGet ? 'GET' : 'HEAD', robots.crawlDelay);
      // HEAD wird oft nicht (richtig) unterstützt → GET (Körper wird verworfen); bei DNS-/Zertifikatsfehler zwecklos
      const endgueltig = r.fehler && NETZ_KAPUTT.has(r.fehler) && !['ECONNRESET', 'ECONNREFUSED'].includes(r.fehler);
      if (!nurGet && !endgueltig && (r.fehler || (r.status >= 400 && r.status !== 429) || r.status < 200)) {
        r = await this.einHop(aktuell, 'GET', robots.crawlDelay);
      }
      // ein Wiederholungsversuch bei Serverfehler/Zeitüberschreitung
      if ((r.status >= 500 && !istBotSchutz(r.status, r.headers)) || r.fehler === 'Zeitüberschreitung') {
        r = await this.einHop(aktuell, 'GET', robots.crawlDelay);
      }
      hops.push({ url: aktuell, ...r });
      if (r.status >= 300 && r.status < 400 && r.headers?.location) {
        let naechste;
        try { naechste = new URL(r.headers.location, aktuell).href; } catch { break; }
        gesehen.add(aktuell);
        if (gesehen.has(naechste)) { hops.push({ url: naechste, status: 0, fehler: 'Weiterleitungsschleife' }); break; }
        aktuell = naechste;
        continue;
      }
      break;
    }
    // Fragment der Ausgangs-URL am Vorschlag erhalten
    const erg = klassifiziere(url.replace(/#.*$/, ''), hops);
    const frag = url.includes('#') ? url.slice(url.indexOf('#')) : '';
    if (frag && erg.vorschlag && !erg.vorschlag.includes('#')) erg.vorschlag += frag;
    erg.url = url;
    return erg;
  }

  // -------------------------------------------------------------------------------------------
  // Wikipedia
  // -------------------------------------------------------------------------------------------

  /**
   * Prüft Wikipedia-Artikel über die Action-API eines Wiki-Hosts.
   * @param {string} host z. B. de.wikipedia.org
   * @param {{url:string,titel:string}[]} eintraege
   * @returns {Promise<Map<string, object>>} url → Ergebnis (fehlende = API nicht erreichbar)
   */
  async pruefeWikipedia(host, eintraege) {
    const out = new Map();
    const titel = [...new Set(eintraege.map(e => e.titel))];
    for (let i = 0; i < titel.length; i += WIKI_BATCH) {
      const teil = titel.slice(i, i + WIKI_BATCH);
      const api = `https://${host}/w/api.php?` + new URLSearchParams({
        action: 'query', format: 'json', formatversion: '2', redirects: '1', prop: 'pageprops', ppprop: 'disambiguation', maxlag: '5', titles: teil.join('|'),
      });
      let antwort = null;
      for (let versuch = 0; versuch < 3; versuch++) {
        const r = await this.proHost(`${host}#api`, null, async () => {
          this.statistik.wikiApi++;
          this.statistik.abrufe++;
          try { return await this.holenJson(api); } catch (e) { return { status: 0, json: null, fehler: fehlerCode(e) }; }
        });
        const maxlag = r.json?.error?.code === 'maxlag';
        if (r.status === 200 && r.json?.query && !maxlag) { antwort = r.json; break; }
        if (r.status === 429 || r.status === 503 || maxlag) {
          const s = Math.min(Number(r.retryAfter) || 5, 60);
          this.log(`Wikipedia-API ${host}: ${maxlag ? 'maxlag' : `HTTP ${r.status}`} – warte ${s} s`);
          await schlafen(s * 1000);
          continue;
        }
        this.log(`Wikipedia-API ${host}: ${r.fehler || `HTTP ${r.status}`}`);
        break;
      }
      if (!antwort) continue;
      const bew = bewerteWikiAntwort(antwort, teil);
      for (const e of eintraege) {
        if (!bew.has(e.titel)) continue;
        out.set(e.url, wikiErgebnis(e.url, host, bew.get(e.titel)));
      }
    }
    return out;
  }
}

// ---------------------------------------------------------------------------------------------
// Wikipedia
// ---------------------------------------------------------------------------------------------

/** Artikel-URL → {host, titel} oder null (Spezialseiten, index.php usw. laufen über den normalen Abruf) */
export function wikiTitel(url) {
  let u;
  try { u = new URL(url); } catch { return null; }
  if (!/^[a-z-]+(\.m)?\.wikipedia\.org$/.test(u.hostname) || !u.pathname.startsWith('/wiki/') || u.search) return null;
  let t;
  try { t = decodeURIComponent(u.pathname.slice(6)); } catch { return null; }
  t = t.replace(/_/g, ' ').trim();
  if (!t || /^(Spezial|Special):/i.test(t)) return null;
  return { host: u.hostname.replace('.m.', '.'), titel: t, fragment: u.hash ? decodeURIComponent(u.hash.slice(1)) : '' };
}

/** Titel → URL im üblichen Format (Leerzeichen → _, Umlaute kodiert, Klammern/Doppelpunkt lesbar) */
export function wikiUrl(host, titel, fragment = '') {
  const pfad = encodeURIComponent(titel.replace(/ /g, '_')).replace(/%3A/g, ':').replace(/%2F/g, '/').replace(/%2C/g, ',');
  return `https://${host}/wiki/${pfad}${fragment ? '#' + encodeURIComponent(fragment.replace(/ /g, '_')).replace(/%3A/g, ':') : ''}`;
}

/**
 * Wertet eine API-Antwort (formatversion=2) aus: Map(angefragter Titel → {status, ziel, fragment, begriffsklaerung})
 * status: ok | weiterleitung | fehlt | ungueltig
 */
export function bewerteWikiAntwort(json, angefragt) {
  const q = json.query || {};
  const norm = new Map((q.normalized || []).map(n => [n.from, n.to]));
  const weiter = new Map((q.redirects || []).map(r => [r.from, r]));
  const seiten = new Map((q.pages || []).map(p => [p.title, p]));
  const out = new Map();
  for (const t of angefragt) {
    const n = norm.get(t) ?? t;
    const w = weiter.get(n);
    const ziel = w ? w.to : n;
    const p = seiten.get(ziel);
    if (!p) { out.set(t, { status: 'ungueltig' }); continue; }
    if (p.invalid) { out.set(t, { status: 'ungueltig', grund: p.invalidreason }); continue; }
    if (p.missing) { out.set(t, { status: 'fehlt', ziel }); continue; }
    out.set(t, {
      status: w ? 'weiterleitung' : 'ok',
      ziel,
      fragment: w?.tofragment ?? '',
      begriffsklaerung: !!(p.pageprops && 'disambiguation' in p.pageprops),
    });
  }
  return out;
}

function wikiErgebnis(url, host, b) {
  const basis = { url, kette: [], status: 0, endUrl: url, hinweise: [], quelle: 'wikipedia-api' };
  if (b.status === 'fehlt') return { ...basis, klasse: 'kaputt', status: 404, grund: 'Artikel existiert nicht (Wikipedia-API)' };
  if (b.status === 'ungueltig') return { ...basis, klasse: 'kaputt', status: 400, grund: `ungültiger Titel${b.grund ? ` (${b.grund})` : ''}` };
  const hinweise = b.begriffsklaerung ? ['Begriffsklärungsseite – auf den gemeinten Artikel verlinken'] : [];
  if (b.status === 'ok') return { ...basis, klasse: 'ok', status: 200, grund: 'Artikel vorhanden', hinweise };
  const urFragment = wikiTitel(url)?.fragment ?? '';
  const vorschlag = wikiUrl(host, b.ziel, b.fragment || urFragment);
  return {
    ...basis,
    klasse: 'weiterleitung',
    status: 200,
    grund: `Wikipedia-Weiterleitung auf „${b.ziel}${b.fragment ? '#' + b.fragment : ''}“`,
    dauerhaft: true,
    vorschlag,
    endUrl: vorschlag,
    // Weiterleitung auf einen Abschnitt oder eine Begriffsklärung: Bedeutung kann sich ändern → manuell
    sicher: !b.fragment && !b.begriffsklaerung,
    hinweise,
  };
}

// ---------------------------------------------------------------------------------------------
// Cache (nur Ergebnisse, keine Inhalte)
// ---------------------------------------------------------------------------------------------

export function cacheFaehig(e) {
  if (e.klasse === 'gesperrt') return false;
  if (e.klasse === 'kaputt' && (!e.status || e.status >= 500)) return false;
  return true;
}

export function ladeCache(datei, ttlTage, jetzt = Date.now()) {
  if (!datei || !(ttlTage > 0) || !fs.existsSync(datei)) return new Map();
  try {
    const roh = JSON.parse(fs.readFileSync(datei, 'utf8'));
    return new Map(Object.entries(roh).filter(([, v]) => jetzt - v.zeit < ttlTage * 864e5));
  } catch { return new Map(); }
}

export function speichereCache(datei, cache) {
  if (!datei) return;
  fs.mkdirSync(path.dirname(datei), { recursive: true });
  fs.writeFileSync(datei, JSON.stringify(Object.fromEntries(cache)) + '\n');
}

// ---------------------------------------------------------------------------------------------
// Ablauf
// ---------------------------------------------------------------------------------------------

/** Führt Aufgaben mit begrenzter Parallelität aus (Reihenfolge der Ergebnisse bleibt erhalten). */
async function begrenzt(aufgaben, n) {
  const erg = new Array(aufgaben.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.max(1, Math.min(n, aufgaben.length)) }, async () => {
    while (i < aufgaben.length) { const k = i++; erg[k] = await aufgaben[k](); }
  }));
  return erg;
}

/**
 * Führt die Linkprüfung aus. Alle Ein-/Ausgaben werden übergeben (testbar ohne Netz).
 * @param {object} o
 * @param {{pfad:string,text:string}[]} o.dateien
 * @param {LinkPruefer} o.pruefer
 * @param {string} o.datum JJJJ-MM-TT
 */
export async function fuehreLinkCheckAus({ dateien, pruefer, datum, cache = new Map(), mitWikiApi = true, max = 0, nurHost = null, log = () => {}, jetzt = Date.now() }) {
  const fund = sammleUrls(dateien);
  let urls = [...fund.keys()];
  if (nurHost) urls = urls.filter(u => new URL(u).host === nurHost);
  if (max > 0) urls = urls.slice(0, max);
  const ergebnisse = new Map();
  let ausCache = 0;
  for (const u of urls) {
    const c = cache.get(u);
    if (c) { ergebnisse.set(u, { ...c.ergebnis, ausCache: true }); ausCache++; }
  }
  const offen = urls.filter(u => !ergebnisse.has(u));

  // Wikipedia-Artikel gebündelt über die API
  const wiki = new Map();
  if (mitWikiApi) {
    for (const u of offen) {
      const w = wikiTitel(u);
      if (!w) continue;
      if (!wiki.has(w.host)) wiki.set(w.host, []);
      wiki.get(w.host).push({ url: u, titel: w.titel });
    }
  }
  for (const [host, eintraege] of wiki) {
    log(`Wikipedia ${host}: ${eintraege.length} Artikel in ${Math.ceil(new Set(eintraege.map(e => e.titel)).size / WIKI_BATCH)} API-Anfragen`);
    const r = await pruefer.pruefeWikipedia(host, eintraege);
    for (const [u, e] of r) ergebnisse.set(u, e);
    const rest = eintraege.length - r.size;
    if (rest) log(`Wikipedia ${host}: ${rest} Artikel ohne API-Antwort → Einzelabruf`);
  }

  // übrige URLs: je Host seriell, Hosts begrenzt parallel; gleiche URL ohne Fragment nur einmal
  const rest = offen.filter(u => !ergebnisse.has(u));
  const proHost = new Map();
  for (const u of rest) {
    const h = new URL(u).host;
    if (!proHost.has(h)) proHost.set(h, []);
    proHost.get(h).push(u);
  }
  const ohneFragment = new Map();
  await begrenzt([...proHost].map(([host, liste]) => async () => {
    for (const u of liste) {
      const key = new URL(u.replace(/#.*$/, '')).href; // „https://x.de“ und „https://x.de/“ einmal
      let e;
      if (ohneFragment.has(key)) {
        const b = ohneFragment.get(key);
        e = { ...b, url: u, vorschlag: b.vorschlag && u.includes('#') && !b.vorschlag.includes('#') ? b.vorschlag + u.slice(u.indexOf('#')) : b.vorschlag };
      } else {
        e = await pruefer.pruefe(u);
        ohneFragment.set(key, e);
      }
      ergebnisse.set(u, e);
      if (e.klasse !== 'ok') log(`${e.klasse.padEnd(13)} ${u} (${e.grund})`);
    }
    log(`Host ${host}: ${liste.length} geprüft`);
  }), pruefer.parallel);

  for (const u of urls) {
    const e = ergebnisse.get(u);
    if (!e.ausCache && cacheFaehig(e)) cache.set(u, { zeit: jetzt, ergebnis: e });
  }

  const liste = urls.map(u => {
    const e = ergebnisse.get(u);
    const hinweise = [...new Set([...(e.hinweise || []), ...urlHinweise(u)])];
    return { ...e, url: u, hinweise, fundstellen: fund.get(u) };
  });
  const zaehle = k => liste.filter(e => e.klasse === k).length;
  const hosts = new Map();
  for (const e of liste) {
    const h = new URL(e.url).host;
    if (!hosts.has(h)) hosts.set(h, { host: h, gesamt: 0, ok: 0, weiterleitung: 0, kaputt: 0, gesperrt: 0 });
    const x = hosts.get(h);
    x.gesamt++;
    x[e.klasse]++;
  }
  const zusammenfassung = {
    urls: liste.length,
    dateien: new Set(liste.flatMap(e => e.fundstellen.map(f => f.datei))).size,
    ok: zaehle('ok'),
    weiterleitung: zaehle('weiterleitung'),
    dauerhaft: liste.filter(e => e.klasse === 'weiterleitung' && e.dauerhaft).length,
    sicherErsetzbar: liste.filter(e => e.klasse === 'weiterleitung' && e.sicher).length,
    kaputt: zaehle('kaputt'),
    gesperrt: zaehle('gesperrt'),
    hinweise: liste.filter(e => e.hinweise.length).length,
    ausCache,
  };
  zusammenfassung.netzErreicht = ausCache > 0 || pruefer.statistik.antworten > 0 || liste.some(e => e.quelle === 'wikipedia-api');
  return {
    version: 1,
    datum,
    agent: USER_AGENT,
    abrufe: { ...pruefer.statistik },
    zusammenfassung,
    hosts: [...hosts.values()].sort((a, b) => b.gesamt - a.gesamt || a.host.localeCompare(b.host)),
    ergebnisse: liste,
  };
}

// ---------------------------------------------------------------------------------------------
// Ersetzen (nur sichere dauerhafte Weiterleitungen)
// ---------------------------------------------------------------------------------------------

/**
 * Ersetzt in den Dateien jede Fundstelle einer sicher ersetzbaren URL durch den Vorschlag.
 * Nutzt die Positionen der Extraktion, damit z. B. „…/x“ nicht in „…/x.html“ ersetzt wird.
 * @returns {{pfad:string,text:string,anzahl:number}[]} nur geänderte Dateien
 */
export function ersetzeUrls(dateien, ersetzungen) {
  const out = [];
  for (const d of dateien) {
    const treffer = extrahiereUrls(d.text).filter(f => ersetzungen.has(f.url)).sort((a, b) => b.index - a.index);
    if (!treffer.length) continue;
    let text = d.text;
    for (const f of treffer) text = text.slice(0, f.index) + ersetzungen.get(f.url) + text.slice(f.index + f.url.length);
    out.push({ pfad: d.pfad, text, anzahl: treffer.length });
  }
  return out;
}

export function sichereErsetzungen(e) {
  return new Map(e.ergebnisse.filter(x => x.klasse === 'weiterleitung' && x.sicher && x.vorschlag && x.vorschlag !== x.url).map(x => [x.url, x.vorschlag]));
}

// ---------------------------------------------------------------------------------------------
// Berichte
// ---------------------------------------------------------------------------------------------

const deDatum = isoDatum => (isoDatum ? isoDatum.split('-').reverse().join('.') : '–');
const zelle = s => String(s ?? '–').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const code = s => '`' + String(s).replace(/`/g, "'") + '`';

export function fundstellenText(f, max = 4) {
  const t = f.map(x => `${x.datei.replace(/^src\//, '')}:${x.zeile}`);
  return t.length > max ? `${t.slice(0, max).map(code).join(', ')} … (+${t.length - max})` : t.map(code).join(', ');
}

export const KLASSE_TEXT = { ok: 'erreichbar', weiterleitung: 'Weiterleitung', kaputt: 'nicht erreichbar', gesperrt: 'manuell prüfen' };

/**
 * Markdown-Bericht. Mit `maxZeichen` wird für das Issue gekürzt (GitHub: höchstens 65 536 Zeichen).
 */
export function berichtMarkdown(e, { maxZeichen = Infinity, ersetzt = null, verweis = '' } = {}) {
  const z = e.zusammenfassung;
  const L = [];
  L.push(`# Linkprüfung ${e.datum.slice(0, 7)}`, '');
  L.push(`Lauf vom ${deDatum(e.datum)} · erzeugt von \`scripts/qa/link-check.mjs\` (Z16) · Vorgehen: [docs/linkcheck/README.md](README.md)`, '');
  L.push('| Ergebnis | Anzahl |', '|---|---|');
  L.push(`| externe URLs (verschieden) | ${z.urls} in ${z.dateien} Dateien |`);
  L.push(`| erreichbar | ${z.ok} |`);
  L.push(`| Weiterleitung (davon dauerhaft / sicher ersetzbar) | ${z.weiterleitung} (${z.dauerhaft} / ${z.sicherErsetzbar}) |`);
  L.push(`| **nicht erreichbar** | **${z.kaputt}** |`);
  L.push(`| manuell prüfen (robots.txt, Bot-Schutz, Rate-Limit) | ${z.gesperrt} |`);
  L.push(`| inhaltliche Hinweise | ${z.hinweise} |`, '');
  const a = e.abrufe;
  L.push(`Abrufe: ${a.abrufe} (HEAD ${a.head}, GET ${a.get}, Wikipedia-API ${a.wikiApi}, Netzfehler ${a.netzfehler}, durch robots.txt ausgeschlossen ${a.robotsGesperrt}); aus Cache: ${z.ausCache}.${a.tdmVorbehalt?.length ? ` TDM-Vorbehalt erklärt (nur protokolliert, es werden keine Inhalte gelesen): ${a.tdmVorbehalt.join(', ')}.` : ''}`, '');
  if (ersetzt) L.push(`Automatisch ersetzt (sichere dauerhafte Weiterleitungen): ${ersetzt.urls} URLs an ${ersetzt.stellen} Stellen in ${ersetzt.dateien} Dateien – siehe PR.`, '');
  if (verweis) L.push(verweis, '');

  const abschnitt = (titel, liste, kopf, zeile) => {
    L.push(`## ${titel}`, '');
    if (!liste.length) { L.push('Keine.', ''); return; }
    L.push(kopf[0], kopf[1]);
    for (const x of liste) L.push(zeile(x));
    L.push('');
  };
  const nachUrl = (p, q) => (p.url < q.url ? -1 : 1);
  const kaputt = e.ergebnisse.filter(x => x.klasse === 'kaputt').sort(nachUrl);
  abschnitt('1. Nicht erreichbar', kaputt, ['| URL | Befund | Fundstellen |', '|---|---|---|'],
    x => `| ${zelle(x.url)} | ${zelle(x.grund)} | ${fundstellenText(x.fundstellen)} |`);
  const dauer = e.ergebnisse.filter(x => x.klasse === 'weiterleitung' && x.dauerhaft).sort((p, q) => Number(q.sicher) - Number(p.sicher) || nachUrl(p, q));
  abschnitt('2. Dauerhafte Weiterleitungen (neue URL vorgeschlagen)', dauer, ['| URL | neue URL | sicher ersetzbar | Fundstellen |', '|---|---|---|---|'],
    x => `| ${zelle(x.url)} | ${zelle(x.vorschlag)} | ${x.sicher ? 'ja' : `nein${x.hinweise.length ? ` – ${zelle(x.hinweise[0])}` : ''}`} | ${fundstellenText(x.fundstellen)} |`);
  const gesperrt = e.ergebnisse.filter(x => x.klasse === 'gesperrt').sort(nachUrl);
  L.push('## 3. Manuell prüfen', '');
  if (!gesperrt.length) L.push('Keine gesperrten Abrufe.', '');
  else {
    L.push('Automatisch nicht prüfbar (robots.txt, Bot-Schutz, Rate-Limit). Bitte im Browser öffnen und bei Bedarf korrigieren.', '');
    for (const x of gesperrt) L.push(`- [ ] ${x.url} – ${x.grund} · ${fundstellenText(x.fundstellen, 3)}`);
    L.push('');
  }
  const hin = e.ergebnisse.filter(x => x.hinweise.length && !(x.klasse === 'weiterleitung' && x.dauerhaft)).sort(nachUrl);
  abschnitt('4. Inhaltliche Hinweise', hin, ['| URL | Hinweis | Fundstellen |', '|---|---|---|'],
    x => `| ${zelle(x.url)} | ${zelle(x.hinweise.join('; '))} | ${fundstellenText(x.fundstellen, 3)} |`);
  const temp = e.ergebnisse.filter(x => x.klasse === 'weiterleitung' && !x.dauerhaft).length;
  L.push('## 5. Hosts', '');
  if (temp) L.push(`Vorübergehende Weiterleitungen (302/303/307, kein Handlungsbedarf): ${temp}.`, '');
  L.push('| Host | URLs | ok | Weiterleitung | nicht erreichbar | manuell |', '|---|---|---|---|---|---|');
  for (const h of e.hosts.filter(h => h.gesamt >= 3 || h.kaputt || h.gesperrt).slice(0, 40)) {
    L.push(`| ${h.host} | ${h.gesamt} | ${h.ok} | ${h.weiterleitung} | ${h.kaputt} | ${h.gesperrt} |`);
  }
  L.push('', 'Hinweis: „erreichbar“ heißt nur, dass die Adresse antwortet; ob der Inhalt noch passt, prüft der Lauf nicht. Zeilen mit `linkcheck-ignore` werden übersprungen.', '');
  let md = L.join('\n');
  if (md.length > maxZeichen) {
    const hinweis = '\n\n… (gekürzt – vollständiger Bericht als Workflow-Artefakt bzw. im PR unter `docs/linkcheck/`)\n';
    md = md.slice(0, maxZeichen - hinweis.length);
    md = md.slice(0, md.lastIndexOf('\n')) + hinweis;
  }
  return md;
}

/**
 * JSON-Bericht: Kopf eingerückt, je Ergebnis eine Zeile; bei unauffälligen Links ohne Kette/leere Felder.
 */
export function berichtJson(e) {
  const kompakt = x => {
    const o = { ...x };
    if (o.klasse === 'ok' && (o.kette?.length ?? 0) <= 1) { delete o.kette; delete o.endUrl; }
    if (!o.hinweise?.length) delete o.hinweise;
    for (const k of Object.keys(o)) if (o[k] === undefined || o[k] === null) delete o[k];
    return o;
  };
  const { ergebnisse, ...kopf } = e;
  const k = JSON.stringify(kopf, null, 2);
  return k.slice(0, -2) + ',\n  "ergebnisse": [\n' + ergebnisse.map(x => '    ' + JSON.stringify(kompakt(x))).join(',\n') + '\n  ]\n}\n';
}

export function prBody(e, berichtPfad, ersetzt) {
  return [
    `Automatische monatliche Linkprüfung (Z16), Lauf vom ${deDatum(e.datum)}.`,
    '',
    `Ersetzt **${ersetzt.urls} URLs** an ${ersetzt.stellen} Stellen in ${ersetzt.dateien} Dateien, jeweils dauerhafte Weiterleitung (301/308 bzw. Wikipedia-Weiterleitung) innerhalb derselben Website auf eine erreichbare Seite. Nicht ersetzt werden Weiterleitungen auf andere Domains, auf Start- oder Anmeldeseiten, auf Abschnitte oder Begriffsklärungen.`,
    '',
    `Bericht: \`${berichtPfad}\` (alle Befunde inkl. nicht erreichbarer Links stehen zusätzlich im Issue).`,
    '',
    'Bitte Stichproben im Browser prüfen, insbesondere ob der Linktext noch zum neuen Ziel passt.',
    '',
    'Hinweis: Mit `GITHUB_TOKEN` erstellte PRs starten keine weiteren Workflows; QA läuft nach dem ersten manuellen Push auf den Branch.',
  ].join('\n');
}

// ---------------------------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------------------------

function argumente(argv) {
  const a = { out: 'docs/linkcheck', verzoegerung: 2000, parallel: 6, cache: '.cache/link-check', cacheTage: 7, max: 0, wikiApi: true, ersetzen: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const v = () => argv[++i];
    if (k === '--datum') a.datum = v();
    else if (k === '--out') a.out = v();
    else if (k === '--verzoegerung') a.verzoegerung = Number(v());
    else if (k === '--parallel') a.parallel = Number(v());
    else if (k === '--cache') a.cache = v();
    else if (k === '--cache-tage') a.cacheTage = Number(v());
    else if (k === '--max') a.max = Number(v());
    else if (k === '--nur-host') a.nurHost = v();
    else if (k === '--ohne-wikipedia-api') a.wikiApi = false;
    else if (k === '--ersetzen') a.ersetzen = true;
    else if (k === '--issue-body') a.issueBody = v();
    else if (k === '--pr-body') a.prBody = v();
    else throw new Error(`Unbekannte Option ${k}`);
  }
  if (a.verzoegerung < 1000) throw new Error('--verzoegerung unter 1000 ms ist nicht zulässig (Rücksicht auf die Quellen)');
  return a;
}

async function main() {
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const a = argumente(process.argv.slice(2));
  const heute = new Date().toISOString().slice(0, 10);
  const datum = a.datum ? (a.datum.length === 7 ? `${a.datum}-01` : a.datum) : heute;
  const monat = datum.slice(0, 7);
  const out = path.resolve(ROOT, a.out);
  fs.mkdirSync(out, { recursive: true });
  const cacheDatei = a.cache ? path.resolve(ROOT, a.cache, 'ergebnisse.json') : null;
  const cache = ladeCache(cacheDatei, a.cacheTage);
  const dateien = leseQuellen(ROOT);
  const log = m => console.log('  ' + m);
  const pruefer = new LinkPruefer({ verzoegerungMs: a.verzoegerung, parallel: a.parallel, log });
  const t0 = Date.now();
  const e = await fuehreLinkCheckAus({ dateien, pruefer, datum, cache, mitWikiApi: a.wikiApi, max: a.max, nurHost: a.nurHost, log });
  speichereCache(cacheDatei, cache);

  let ersetzt = null;
  if (a.ersetzen) {
    const ers = sichereErsetzungen(e);
    const geaendert = ersetzeUrls(dateien, ers);
    for (const d of geaendert) fs.writeFileSync(path.join(ROOT, d.pfad), d.text);
    ersetzt = { urls: ers.size, stellen: geaendert.reduce((s, d) => s + d.anzahl, 0), dateien: geaendert.length };
    e.ersetzt = ersetzt;
  }
  const md = path.join(out, `${monat}.md`);
  fs.writeFileSync(md, berichtMarkdown(e, { ersetzt }));
  fs.writeFileSync(path.join(out, `${monat}.json`), berichtJson(e));
  const rel = path.relative(ROOT, md).split(path.sep).join('/');
  if (a.issueBody) {
    const lauf = process.env.GITHUB_RUN_ID ? `Workflow-Lauf: ${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID} (Bericht als Artefakt „linkcheck-${monat}“)` : '';
    fs.writeFileSync(path.resolve(ROOT, a.issueBody), berichtMarkdown(e, { maxZeichen: 60_000, ersetzt, verweis: lauf }).replace('[docs/linkcheck/README.md](README.md)', '`docs/linkcheck/README.md`'));
  }
  if (a.prBody && ersetzt?.urls) fs.writeFileSync(path.resolve(ROOT, a.prBody), prBody(e, rel, ersetzt));
  const z = e.zusammenfassung;
  console.log(`Linkprüfung ${monat}: ${z.urls} URLs – ok ${z.ok}, Weiterleitung ${z.weiterleitung} (sicher ersetzbar ${z.sicherErsetzbar}), nicht erreichbar ${z.kaputt}, manuell ${z.gesperrt} → ${rel} (${Math.round((Date.now() - t0) / 1000)} s)`);
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `bericht=${rel}\nkaputt=${z.kaputt}\ngesperrt=${z.gesperrt}\nersetzt=${ersetzt?.urls ?? 0}\nnetz_erreicht=${z.netzErreicht}\n`);
  }
  if (!z.netzErreicht && z.urls) {
    console.error('Keine Quelle erreichbar – Bericht ohne Aussagekraft.');
    process.exitCode = 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(err => { console.error(err); process.exit(1); });
}
