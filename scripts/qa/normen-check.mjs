#!/usr/bin/env node
/**
 * Halbjährlicher Normen- und Rechtsstand-Check (Umsetzungsplan Phase 6, AP 6.7)
 *
 * Gleicht die zentrale Normen-Registry (src/data/centralNormenRegistry.ts, Phase 0 AP 0.5) mit den
 * aktuellen Ausgaben bei DIN Media ab und den Rechtsstand der zitierten Gesetze/Verordnungen
 * (scripts/qa/normen-check-gesetze.json) mit gesetze-im-internet.de. Ergebnis:
 *   docs/normen-check/<JJJJ-MM>.md    Bericht mit betroffenen Modulen und Fundstellen
 *   docs/normen-check/<JJJJ-MM>.json  maschinenlesbar; Basis für den nächsten Lauf (Rechtsstand)
 *   docs/quiz-pruefhinweise.md        Abschnitt „Normen- und Rechtsstand“ zwischen den Markierungen
 *
 *   node scripts/qa/normen-check.mjs [--datum JJJJ-MM] [--out docs/normen-check]
 *        [--pruefliste docs/quiz-pruefhinweise.md] [--ohne-dinmedia] [--ohne-gii]
 *        [--verzoegerung 3000] [--cache .cache/normen-check] [--cache-tage 7] [--max 0]
 *        [--pr-body datei.md]
 *
 * Regeln für den Abruf (Details: docs/normen-check/README.md):
 * - robots.txt jeder Quelle wird vor dem ersten Abruf gelesen und befolgt (inkl. Crawl-delay);
 *   ist robots.txt nicht abrufbar, wird die Quelle NICHT abgefragt (→ manuelle Prüfliste).
 * - DIN Media: nur Produktseiten, die DIN Media selbst in der Sitemap veröffentlicht; keine Suche.
 * - eindeutiger User-Agent, höchstens ein Abruf je Host alle 3 s, Datei-Cache.
 * - keine Zusatzpakete (global fetch, Node ≥ 18).
 * Exit-Code 2, wenn keine einzige Quelle erreichbar war (Workflow legt dann ein Issue an).
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const AGENT = 'babo-normen-check';
export const USER_AGENT = `${AGENT}/1.0 (+https://github.com/juhu-tha/babo; Lehrplattform BaustoffBoard, halbjaehrlicher Normenstand-Abgleich)`;
export const DINMEDIA = 'https://www.dinmedia.de';
export const GII = 'https://www.gesetze-im-internet.de';
const DINMEDIA_SITEMAP_FALLBACK = `${DINMEDIA}/service-sitemap-dinmedia-de-sitemap_index.xml`;
export const MARKE_START = '<!-- normen-check:start -->';
export const MARKE_ENDE = '<!-- normen-check:end -->';

// ---------------------------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------------------------

/** Liest die Einträge der Normen-Registry aus dem TS-Quelltext (ohne TS-Import, wie check-normen.mjs). */
export function leseRegistry(text) {
  const eintraege = [];
  for (const m of text.matchAll(/^\s*'(\w+)':\s*\{([\s\S]*?)\n\s*\},?\s*$/gm)) {
    const b = m[2];
    const feld = k => (b.match(new RegExp(`\\b${k}:\\s*'((?:[^'\\\\]|\\\\.)*)'`)) || [])[1];
    const module = (b.match(/relevanteModule:\s*\[([^\]]*)\]/) || [])[1] || '';
    eintraege.push({
      id: m[1],
      code: feld('code') ?? '',
      title: feld('title') ?? '',
      ausgabeStand: feld('ausgabeStand') ?? '',
      status: feld('status') ?? '',
      relevanteModule: [...module.matchAll(/'([^']+)'/g)].map(x => x[1]),
    });
  }
  return eintraege;
}

const PRAEFIX = /^(DIN(?:\s+(?:EN|ISO|IEC|SPEC|VDE))*|EN(?:\s+ISO)?|ISO)\s+/;
const DATUM = /((?:19|20)\d{2}(?:-\d{2})?)/;

/**
 * Zerlegt einen Registry-Code in einzelne Normnummern mit Soll-Ausgabe.
 * „DIN 18945 / 18946 / 18947:2024-03“, „DIN EN 998-1 / -2:2017-02“, „DIN 18040-1:2010-10, -2:2011-09“,
 * „DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA / DIN EN 1992-1-1:2025-09 (2. Generation)“.
 * Ohne Datum: Datum des nächsten Teils derselben Angabe, sonst ausgabeStand (nur bei einer Nummer).
 */
export function normZiele(code, ausgabeStand = '') {
  const bereinigt = code
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s*\+\s*A\d+(?::\s*(?:19|20)\d{2}(?:-\d{2})?)?/g, ' ')
    .replace(/\bmit NA\b/g, ' ')
    .replace(/–/g, '-');
  const teile = [];
  let vorPraefix = null;
  let vorNummer = null;
  for (const roh of bereinigt.split(/\s*(?:\/(?!NA)|&|,|;|\bund\b)\s*/)) {
    const seg = roh.trim();
    if (!seg) continue;
    const p = seg.match(PRAEFIX);
    const rest = p ? seg.slice(p[0].length) : seg;
    const n = rest.match(/^(-\d+|\d+(?:-\d+)*)(?!\w)/);
    if (!n) continue;
    let praefix = p ? p[1].replace(/\s+/g, ' ') : vorPraefix;
    let nummer = n[1];
    if (!praefix) continue; // z. B. „DBV-Merkblatt“
    if (nummer.startsWith('-')) {
      if (!vorNummer) continue;
      nummer = vorNummer.replace(/-\d+$/, '') + nummer;
    }
    const nachNummer = rest.slice(n[0].length).replace(/^\s+bis\s+-\d+/, '');
    const d = nachNummer.match(new RegExp(`^\\s*:\\s*${DATUM.source}`));
    teile.push({ nummer: `${praefix} ${nummer}`, datum: d ? d[1] : null });
    vorPraefix = praefix;
    vorNummer = nummer;
  }
  for (let i = teile.length - 1, naechstes = null; i >= 0; i--) {
    if (teile[i].datum) naechstes = teile[i].datum;
    else teile[i].datum = naechstes;
  }
  const map = new Map();
  for (const t of teile) {
    if (!map.has(t.nummer)) map.set(t.nummer, []);
    if (t.datum && !map.get(t.nummer).includes(t.datum)) map.get(t.nummer).push(t.datum);
  }
  if (map.size === 1 && ausgabeStand) {
    const [a] = map.values();
    if (!a.length) a.push(ausgabeStand);
  }
  return [...map].map(([nummer, ausgaben]) => ({
    nummer,
    ausgaben: ausgaben.sort(vergleicheAusgabe),
    soll: ausgaben.length ? [...ausgaben].sort(vergleicheAusgabe).at(-1) : null,
  }));
}

/** Vergleich „JJJJ-MM“/„JJJJ“; eine reine Jahresangabe gilt als gleich mit jeder Ausgabe desselben Jahres. */
export function vergleicheAusgabe(a, b) {
  if (a === b) return 0;
  const [ja, ma] = String(a).split('-');
  const [jb, mb] = String(b).split('-');
  if (ja !== jb) return ja < jb ? -1 : 1;
  if (!ma || !mb) return 0;
  return ma < mb ? -1 : ma > mb ? 1 : 0;
}

/** „DIN EN ISO 12944-1“ → „din-en-iso-12944-1“ (Pfadsegment der DIN-Media-Produktseiten) */
export function slugVon(nummer) {
  return nummer.toLowerCase().replace(/[\s/]+/g, '-');
}

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Normzitate mit Ausgabe in Freitext (z. B. Prüfliste): [{nummer, ausgabe, index}] */
export function normZitate(text) {
  const re = /\b((?:DIN(?:\s+(?:EN|ISO|IEC|SPEC))*|EN(?:\s+ISO)?|ISO)\s+\d+(?:-\d+)*)\s*:\s*((?:19|20)\d{2}(?:-\d{2})?)/g;
  return [...text.matchAll(re)].map(m => ({ nummer: m[1].replace(/\s+/g, ' '), ausgabe: m[2], index: m.index }));
}

/** Fundstellen einer Normnummer mit Ausgabe in Quelldateien: Map(Ausgabe → Set(Pfad)) */
export function fundstellen(nummer, dateien) {
  const re = new RegExp(`(?<![\\w-])${esc(nummer).replace(/ /g, '\\s+')}(?![\\w-])\\s*:\\s*((?:19|20)\\d{2}(?:-\\d{2})?)`, 'g');
  const map = new Map();
  for (const { pfad, text } of dateien) {
    for (const m of text.matchAll(re)) {
      if (!map.has(m[1])) map.set(m[1], new Set());
      map.get(m[1]).add(pfad);
    }
  }
  return map;
}

// ---------------------------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------------------------

/** Minimaler robots.txt-Parser (RFC 9309): Gruppe für unseren Agent, sonst „*“. */
export function parseRobots(text, agent = AGENT) {
  const gruppen = [];
  const sitemaps = [];
  let aktuelle = null;
  let letzteWarAgent = false;
  for (const zeile of text.split(/\r?\n/)) {
    const z = zeile.replace(/#.*$/, '').trim();
    const m = z.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const wert = m[2].trim();
    if (key === 'sitemap') { sitemaps.push(wert); continue; }
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
      // „Disallow:“ ohne Wert = alles erlaubt → keine Regel
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
    sitemaps,
  };
}

function robotsMuster(pfad) {
  const ende = pfad.endsWith('$');
  const kern = (ende ? pfad.slice(0, -1) : pfad).split('*').map(esc).join('.*');
  return new RegExp('^' + kern + (ende ? '$' : ''));
}

/** Längste passende Regel gewinnt, bei Gleichstand Allow. */
export function robotsErlaubt(robots, pfadMitQuery) {
  let best = null;
  for (const r of robots.regeln) {
    if (!robotsMuster(r.pfad).test(pfadMitQuery)) continue;
    if (!best || r.pfad.length > best.pfad.length || (r.pfad.length === best.pfad.length && r.erlaubt)) best = r;
  }
  return best ? best.erlaubt : true;
}

// ---------------------------------------------------------------------------------------------
// DIN Media
// ---------------------------------------------------------------------------------------------

export function parseSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
}

/** Produktseiten nach Slug: Map(slug → [url]); Normen vor Vornormen/Technischen Regeln */
export function indexiereDinMedia(locs) {
  const map = new Map();
  const rang = { norm: 0, vornorm: 1, 'technische-regel': 2 };
  for (const loc of locs) {
    const m = loc.match(/^https:\/\/www\.dinmedia\.de\/de\/(norm|vornorm|technische-regel)\/([^/]+)\/(\d+)$/);
    if (!m) continue;
    if (!map.has(m[2])) map.set(m[2], []);
    map.get(m[2]).push({ url: loc, rang: rang[m[1]] });
  }
  for (const [k, v] of map) map.set(k, v.sort((a, b) => a.rang - b.rang).map(x => x.url));
  return map;
}

const ohneTags = s => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

/** Teilt „DIN 4108-2:2026-05“ in Nummer und Ausgabe. */
export function teileCode(code) {
  const m = code.replace(/\s+/g, ' ').trim().match(/^(.*?)\s*:\s*((?:19|20)\d{2}(?:-\d{2})?)$/);
  return m ? { nummer: m[1], ausgabe: m[2] } : { nummer: code.trim(), ausgabe: null };
}

/**
 * Liest eine DIN-Media-Produktseite: Dokumentnummer, Ausgabedatum, Rückzug, Ersatzvermerk.
 * Erwartete Struktur (Stand 10/2026): <title>DIN 1045-3 - 2023-08 - DIN Media</title>,
 * <dt>Ausgabedatum</dt><dd>2023-08</dd>, Abschnitt id="ersatzvermerk" mit „Dokument wurde
 * (teilweise) ersetzt durch <a href=…>DIN …:JJJJ-MM</a>“, Fußnote „Achtung: Dokument zurückgezogen!“.
 */
export function parseDinMediaSeite(html) {
  const titel = html.match(/<title>\s*([^<]*?)\s+-\s+((?:19|20)\d{2}-\d{2})\s+-\s+DIN Media\s*<\/title>/);
  const dd = html.match(/<dt>\s*Ausgabedatum\s*<\/dt>\s*<dd>\s*([^<]*?)\s*<\/dd>/);
  const ausgabe = (dd && dd[1].match(DATUM)?.[1]) || titel?.[2] || null;
  const nummer = titel ? titel[1].replace(/\s+/g, ' ').trim() : null;
  const zurueckgezogen = /Dokument zurückgezogen!/.test(html);
  const ersetztDurch = [];
  let teilweise = false;
  const i = html.indexOf('id="ersatzvermerk"');
  if (i >= 0) {
    let j = html.indexOf('data-anker="true"', i + 20);
    if (j < 0) j = i + 6000;
    const abschnitt = html.slice(i, j);
    for (const p of abschnitt.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
      const absatz = p[1];
      const text = ohneTags(absatz);
      if (!/ersetzt durch/.test(text)) continue;
      if (/teilweise ersetzt/.test(text)) teilweise = true;
      const nach = absatz.slice(absatz.indexOf('ersetzt durch'));
      for (const a of nach.matchAll(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
        ersetztDurch.push({ ...teileCode(ohneTags(a[2])), code: ohneTags(a[2]), href: new URL(a[1], DINMEDIA).href });
      }
    }
  }
  return { nummer, ausgabe, zurueckgezogen, teilweise, ersetztDurch, lesbar: !!(nummer && ausgabe) };
}

/**
 * Bewertet ein Registry-Ziel gegen die abgerufene Ersatzkette (letztes Glied = aktueller Stand).
 * befund: aktuell | neuere_ausgabe | registry_neuer | zurueckgezogen | ersetzt_durch_andere |
 *         teilweise_ersetzt | ohne_registry_ausgabe
 */
export function bewerteNorm(ziel, kette, registryStatus = 'gueltig') {
  const ende = kette.at(-1);
  const aktuell = { nummer: ende.nummer, ausgabe: ende.ausgabe };
  const gleicheNummer = (ende.nummer || '').toLowerCase() === ziel.nummer.toLowerCase();
  if (ende.teilweise) return { befund: 'teilweise_ersetzt', aktuell };
  if (!gleicheNummer) return { befund: 'ersetzt_durch_andere', aktuell };
  if (ende.zurueckgezogen && !ende.ersetztDurch.length) {
    return { befund: registryStatus === 'ersetzt' ? 'aktuell' : 'zurueckgezogen', aktuell };
  }
  if (!ziel.soll) return { befund: 'ohne_registry_ausgabe', aktuell };
  if (ziel.ausgaben.some(a => vergleicheAusgabe(a, ende.ausgabe) === 0)) return { befund: 'aktuell', aktuell };
  const c = vergleicheAusgabe(ende.ausgabe, ziel.soll);
  return { befund: c > 0 ? 'neuere_ausgabe' : c < 0 ? 'registry_neuer' : 'aktuell', aktuell };
}

// ---------------------------------------------------------------------------------------------
// gesetze-im-internet.de
// ---------------------------------------------------------------------------------------------

const MONATE = { januar: 1, februar: 2, märz: 3, maerz: 3, april: 4, mai: 5, juni: 6, juli: 7, august: 8, september: 9, oktober: 10, november: 11, dezember: 12 };
const iso = (j, m, t) => `${j}-${String(m).padStart(2, '0')}-${String(t).padStart(2, '0')}`;

/** Alle Datumsangaben „2.12.2024“ und „2. Dezember 2024“ als ISO, aufsteigend */
export function deDaten(text) {
  const d = [];
  for (const m of text.matchAll(/\b(\d{1,2})\.(\d{1,2})\.((?:19|20)\d{2})\b/g)) d.push(iso(m[3], m[2], m[1]));
  for (const m of text.matchAll(/\b(\d{1,2})\.\s*([A-Za-zäÄ]+)\s+((?:19|20)\d{2})\b/g)) {
    const mo = MONATE[m[2].toLowerCase()];
    if (mo) d.push(iso(m[3], mo, m[1]));
  }
  return d.sort();
}

/**
 * Liest Titel und Stand einer Seite von gesetze-im-internet.de (Inhaltsübersicht oder Gesamtausgabe).
 * „Stand: Zuletzt geändert durch Art. 2 V v. 2.12.2024 I Nr. 384“ → standDatum 2024-12-02.
 * Liefert volltextHref (BJNR…html), falls die Seite selbst keinen Stand enthält.
 */
export function parseGiiSeite(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const titel = h1 ? ohneTags(h1[1]) : null;
  // Nur der Kopf bis zur ersten Einzelvorschrift (§-Überschrift), damit „Stand:“ im Normtext nicht zählt
  const ende = html.search(/<span class="jnenbez">|<h3[\s>]/);
  const kopf = ende > 0 ? html.slice(0, ende) : html;
  // Text unmittelbar nach „Stand:“ (gleiche oder nächste Tabellenzelle), höchstens bis zum nächsten Tag
  const nachMarke = marke => [...kopf.matchAll(new RegExp(`${marke}:?\\s*(?:<\\/[a-z0-9]+>\\s*|<[a-z0-9]+[^>]*>\\s*)*([^<]{4,400})`, 'g'))]
    .map(m => ohneTags(m[1]));
  const standTexte = nachMarke('Stand').filter(t => /\d{4}/.test(t));
  // „Hinweis: Änderung durch … textlich nachgewiesen“ = bereits verkündete, eingearbeitete Änderung → zählt mit
  const hinweis = nachMarke('Hinweis').find(t => /Änderung|textlich/.test(t)) ?? null;
  const daten = [...standTexte, hinweis ?? ''].flatMap(deDaten).sort();
  const standDatum = daten.length ? daten.at(-1) : null;
  const ausf = ohneTags(html).match(/Ausfertigungsdatum:?\s*(\d{1,2}\.\d{1,2}\.\d{4})/);
  const volltext = html.match(/href="([^"]*BJNR[0-9A-Z]+\.html)"/);
  const bgbl = standTexte.join(' ').match(/\bI\s+(?:Nr\.\s*\d+|S\.\s*\d+|\d+)/g) || [];
  return {
    titel,
    standText: standTexte.join(' · ') || null,
    standDatum,
    hinweis,
    ausfertigung: ausf ? deDaten(ausf[1])[0] : null,
    bgbl: bgbl.at(-1) ?? null,
    volltextHref: volltext ? volltext[1] : null,
  };
}

export function bewerteGesetz(alt, neu) {
  if (!neu?.standDatum) return 'nicht_lesbar';
  if (!alt) return 'basis_erfasst';
  return neu.standDatum > alt ? 'geaendert' : neu.standDatum < alt ? 'aelter_als_basis' : 'unveraendert';
}

// ---------------------------------------------------------------------------------------------
// Abruf: robots.txt, Rate-Limit, Cache
// ---------------------------------------------------------------------------------------------

export async function standardHolen(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'de', Accept: 'text/html,application/xml;q=0.9,*/*;q=0.5' },
    redirect: 'follow',
    signal: AbortSignal.timeout(45_000),
  });
  return { status: r.status, body: Buffer.from(await r.arrayBuffer()) };
}

const schlafen = ms => new Promise(r => setTimeout(r, ms));

export class Abrufer {
  constructor({ holen = standardHolen, verzoegerungMs = 3000, cacheDir = null, ttlTage = 7, log = () => {} } = {}) {
    Object.assign(this, { holen, verzoegerungMs, cacheDir, ttlTage, log });
    this.robots = new Map(); // host → Promise<robots|null>
    this.letzter = new Map(); // host → ms
    this.statistik = { abrufe: 0, cache: 0, fehler: 0, gesperrt: 0 };
  }

  async warte(host, crawlDelay) {
    const abstand = Math.max(this.verzoegerungMs, (crawlDelay ?? 0) * 1000);
    const seit = Date.now() - (this.letzter.get(host) ?? 0);
    if (seit < abstand) await schlafen(abstand - seit);
    this.letzter.set(host, Date.now());
  }

  async roh(url, crawlDelay) {
    const host = new URL(url).host;
    for (let versuch = 0; versuch < 2; versuch++) {
      await this.warte(host, crawlDelay);
      try {
        this.statistik.abrufe++;
        const r = await this.holen(url);
        if (r.status >= 500 && versuch === 0) continue;
        return r;
      } catch (e) {
        if (versuch === 1) return { status: 0, body: Buffer.alloc(0), fehler: String(e?.cause?.code || e?.message || e) };
      }
    }
    return { status: 0, body: Buffer.alloc(0), fehler: 'kein Ergebnis' };
  }

  /** robots.txt der Quelle; null = nicht abrufbar (Quelle wird dann nicht abgefragt) */
  robotsFuer(origin) {
    if (!this.robots.has(origin)) {
      this.robots.set(origin, (async () => {
        const r = await this.roh(`${origin}/robots.txt`);
        if (r.status === 200) return parseRobots(r.body.toString('utf8'));
        if (r.status >= 400 && r.status < 500) return { regeln: [], crawlDelay: null, sitemaps: [] }; // RFC 9309: keine Einschränkung
        this.log(`robots.txt von ${origin} nicht abrufbar (${r.status || r.fehler}) – Quelle wird übersprungen`);
        return null;
      })());
    }
    return this.robots.get(origin);
  }

  cachePfad(url) {
    return this.cacheDir ? path.join(this.cacheDir, crypto.createHash('sha1').update(url).digest('hex')) : null;
  }

  /** {ok, status, text, grund} */
  async text(url) {
    const u = new URL(url);
    const robots = await this.robotsFuer(u.origin);
    if (!robots) { this.statistik.gesperrt++; return { ok: false, status: 0, text: '', grund: 'robots.txt nicht abrufbar' }; }
    if (!robotsErlaubt(robots, u.pathname + u.search)) { this.statistik.gesperrt++; return { ok: false, status: 0, text: '', grund: 'durch robots.txt ausgeschlossen' }; }
    const cp = this.cachePfad(url);
    if (cp && fs.existsSync(cp) && Date.now() - fs.statSync(cp).mtimeMs < this.ttlTage * 864e5) {
      this.statistik.cache++;
      return { ok: true, status: 200, text: fs.readFileSync(cp, 'utf8'), grund: 'cache' };
    }
    const r = await this.roh(url, robots.crawlDelay);
    if (r.status !== 200) { this.statistik.fehler++; return { ok: false, status: r.status, text: '', grund: r.fehler || `HTTP ${r.status}` }; }
    let body = r.body;
    if (body[0] === 0x1f && body[1] === 0x8b) body = zlib.gunzipSync(body);
    const text = body.toString('utf8');
    if (cp) { fs.mkdirSync(path.dirname(cp), { recursive: true }); fs.writeFileSync(cp, text); }
    return { ok: true, status: 200, text, grund: 'abgerufen' };
  }
}

// ---------------------------------------------------------------------------------------------
// Ablauf
// ---------------------------------------------------------------------------------------------

const HANDLUNG_NORM = new Set(['neuere_ausgabe', 'zurueckgezogen', 'ersetzt_durch_andere', 'registry_neuer']);
const MANUELL_NORM = new Set(['nicht_gefunden', 'nicht_abrufbar', 'nicht_lesbar', 'teilweise_ersetzt', 'ohne_registry_ausgabe', 'uebersprungen']);

export const BEFUND_TEXT = {
  aktuell: 'aktuell',
  neuere_ausgabe: 'neuere Ausgabe erschienen',
  registry_neuer: 'Registry nennt neuere Ausgabe als DIN Media – Angabe prüfen',
  zurueckgezogen: 'zurückgezogen (ohne Nachfolger)',
  ersetzt_durch_andere: 'ersetzt durch anderes Dokument',
  teilweise_ersetzt: 'teilweise ersetzt – manuell prüfen',
  ohne_registry_ausgabe: 'Registry ohne Ausgabe – nachtragen',
  nicht_gefunden: 'nicht in der DIN-Media-Sitemap – manuell prüfen',
  nicht_abrufbar: 'nicht abrufbar – manuell prüfen',
  nicht_lesbar: 'Seite nicht auswertbar – manuell prüfen',
  uebersprungen: 'nicht abgefragt – manuell prüfen',
  basis_erfasst: 'Stand erstmals erfasst',
  geaendert: 'geändert seit letztem Lauf',
  unveraendert: 'unverändert',
  aelter_als_basis: 'älter als letzter Lauf – prüfen',
};

async function dinMediaIndex(abrufer, log) {
  const robots = await abrufer.robotsFuer(DINMEDIA);
  if (!robots) return { index: null, grund: 'robots.txt nicht abrufbar' };
  const start = robots.sitemaps.find(s => /-de-sitemap_index\.xml$/.test(s)) || DINMEDIA_SITEMAP_FALLBACK;
  const idx = await abrufer.text(start);
  if (!idx.ok) return { index: null, grund: `Sitemap: ${idx.grund}` };
  const locs = [];
  for (const sm of parseSitemapLocs(idx.text)) {
    const r = await abrufer.text(sm);
    if (r.ok) locs.push(...parseSitemapLocs(r.text));
    else log(`Sitemap ${sm}: ${r.grund}`);
  }
  return { index: indexiereDinMedia(locs), grund: `${locs.length} Sitemap-Einträge` };
}

async function pruefeNormDinMedia(ziel, index, abrufer, registryStatus) {
  const slug = slugVon(ziel.nummer);
  // Ohne Teilnummer (z. B. „DIN 18531“) auch Teil 1 versuchen
  const urls = index.get(slug) ?? (/\d-\d+$/.test(slug) ? undefined : index.get(`${slug}-1`)) ?? [];
  if (!urls.length) return { befund: 'nicht_gefunden', kette: [] };
  let beste = null;
  let letzterGrund = null;
  for (const start of urls.slice(0, 4)) {
    const kette = [];
    let url = start;
    let offen = null; // Nachfolger laut Ersatzvermerk, dessen Seite (noch) nicht gelesen ist
    for (let hop = 0; hop < 4 && url; hop++) {
      const r = await abrufer.text(url);
      if (!r.ok) { letzterGrund = r.grund; break; }
      const s = { ...parseDinMediaSeite(r.text), url };
      if (!s.lesbar) { letzterGrund = 'Seite nicht auswertbar'; break; }
      kette.push(s);
      offen = null;
      const nf = s.ersetztDurch.length === 1 && !s.teilweise ? s.ersetztDurch[0] : null;
      if (!nf || kette.some(k => k.url === nf.href)) { url = null; break; }
      url = nf.href;
      offen = nf;
    }
    if (!kette.length) continue;
    // Nachfolgeseite nicht lesbar oder Kette zu lang: Angabe aus dem Ersatzvermerk übernehmen
    if (offen) kette.push({ nummer: offen.nummer, ausgabe: offen.ausgabe, zurueckgezogen: false, teilweise: false, ersetztDurch: [], url: offen.href, ausVermerk: true });
    const e = kette.at(-1);
    if (!beste || (e.ausgabe && vergleicheAusgabe(e.ausgabe, beste.at(-1).ausgabe || '0000') > 0)) beste = kette;
  }
  if (!beste) return { befund: letzterGrund === 'Seite nicht auswertbar' ? 'nicht_lesbar' : 'nicht_abrufbar', grund: letzterGrund, kette: [] };
  return { ...bewerteNorm(ziel, beste, registryStatus), kette: beste.map(k => ({ code: `${k.nummer}:${k.ausgabe}`, url: k.url, zurueckgezogen: k.zurueckgezogen, ausVermerk: !!k.ausVermerk })) };
}

async function pruefeGesetz(g, abrufer) {
  if (!g.gii) return { befund: 'uebersprungen', grund: 'keine Fundstelle bei gesetze-im-internet.de hinterlegt' };
  const basis = `${GII}/${g.gii}/`;
  const r = await abrufer.text(`${basis}index.html`);
  if (!r.ok) return { befund: 'nicht_abrufbar', grund: r.grund, url: `${basis}index.html` };
  let s = parseGiiSeite(r.text);
  let url = `${basis}index.html`;
  if (!s.standDatum && s.volltextHref) {
    url = new URL(s.volltextHref, basis).href;
    const v = await abrufer.text(url);
    if (v.ok) s = { ...parseGiiSeite(v.text), titel: s.titel || parseGiiSeite(v.text).titel };
  }
  return { ...s, url, befund: s.standDatum ? 'ok' : 'nicht_lesbar' };
}

/**
 * Führt den Check aus. Alle Ein-/Ausgaben werden übergeben (testbar ohne Netz).
 * @param {object} o
 * @param {string} o.registryText  Quelltext centralNormenRegistry.ts
 * @param {{gesetze: object[], eu?: object[]}} o.gesetze  Inhalt normen-check-gesetze.json
 * @param {string} [o.pruefliste]  Text der Prüfliste (für Zusatzziele)
 * @param {{pfad:string,text:string}[]} o.srcDateien
 * @param {Abrufer} o.abrufer
 * @param {string} o.datum  JJJJ-MM-TT
 * @param {object} [o.vorher]  JSON des letzten Laufs
 */
export async function fuehreCheckAus({ registryText, gesetze, pruefliste = '', srcDateien = [], abrufer, datum, vorher = null, mitDinMedia = true, mitGii = true, max = 0, log = () => {} }) {
  const registry = leseRegistry(registryText);
  const ziele = [];
  const manuell = [];
  const alsGesetz = new Set((gesetze.gesetze ?? []).map(g => g.registryId).filter(Boolean));
  for (const e of registry) {
    const z = normZiele(e.code, e.ausgabeStand);
    if (!z.length && !alsGesetz.has(e.id)) manuell.push({ art: 'Regelwerk', code: e.code, id: e.id, grund: 'kein DIN/EN/ISO-Dokument – beim Herausgeber prüfen', module: e.relevanteModule });
    for (const zi of z) ziele.push({ ...zi, registryId: e.id, registryCode: e.code, registryStatus: e.status, module: e.relevanteModule, herkunft: 'registry' });
  }
  // Zusatzziele: Normzitate mit Ausgabe aus der Prüfliste, die nicht in der Registry stehen
  const bekannte = new Set(ziele.map(z => z.nummer.toLowerCase()));
  const prueflisteZitate = [];
  for (const zeile of pruefliste.split('\n')) {
    if (zeile.includes(MARKE_START)) break;
    const fragen = [...zeile.matchAll(/\b(q_[a-z0-9_]+)/g)].map(m => m[1]);
    for (const z of normZitate(zeile)) {
      prueflisteZitate.push({ ...z, fragen });
      if (!bekannte.has(z.nummer.toLowerCase())) {
        bekannte.add(z.nummer.toLowerCase());
        ziele.push({ nummer: z.nummer, ausgaben: [z.ausgabe], soll: z.ausgabe, registryId: null, registryCode: null, registryStatus: 'gueltig', module: [], herkunft: 'pruefliste', fragen });
      }
    }
  }
  const zuPruefen = max > 0 ? ziele.slice(0, max) : ziele;

  // DIN Media
  let dinIndex = null;
  let dinGrund = 'nicht abgefragt (--ohne-dinmedia)';
  if (mitDinMedia) {
    const r = await dinMediaIndex(abrufer, log);
    dinIndex = r.index;
    dinGrund = r.grund;
    log(`DIN Media: ${dinGrund}`);
  }
  const normen = [];
  for (const z of zuPruefen) {
    let erg;
    if (!dinIndex) erg = { befund: 'uebersprungen', grund: dinGrund, kette: [] };
    else {
      try { erg = await pruefeNormDinMedia(z, dinIndex, abrufer, z.registryStatus); } catch (e) { erg = { befund: 'nicht_lesbar', grund: String(e?.message || e), kette: [] }; }
    }
    const fs_ = fundstellen(z.nummer, srcDateien);
    normen.push({
      nummer: z.nummer, soll: z.soll, ausgaben: z.ausgaben, registryId: z.registryId, registryCode: z.registryCode, herkunft: z.herkunft,
      fragen: z.fragen, module: z.module, ...erg,
      fundstellen: Object.fromEntries([...fs_].sort(([a], [b]) => vergleicheAusgabe(a, b)).map(([a, s]) => [a, [...s].sort()])),
      dinMediaSuche: `${DINMEDIA}/de/suche?q=${encodeURIComponent(z.nummer).replace(/%20/g, '+')}`,
    });
    log(`${z.nummer}: ${erg.befund}${erg.aktuell ? ` (${erg.aktuell.nummer}:${erg.aktuell.ausgabe})` : ''}`);
  }

  // Gesetze
  const alt = new Map((vorher?.gesetze ?? []).filter(g => g.standDatum).map(g => [g.kurz, g.standDatum]));
  const gesetzErg = [];
  for (const g of gesetze.gesetze ?? []) {
    const muster = new RegExp(g.suchmuster || `\\b${esc(g.kurz)}\\b`);
    const dateien = srcDateien.filter(d => muster.test(d.text)).map(d => d.pfad).sort();
    let r;
    if (!mitGii) r = { befund: 'uebersprungen', grund: 'nicht abgefragt (--ohne-gii)' };
    else {
      try { r = await pruefeGesetz(g, abrufer); } catch (e) { r = { befund: 'nicht_lesbar', grund: String(e?.message || e) }; }
    }
    const basis = alt.get(g.kurz) ?? g.bekannterStand ?? null;
    const befund = r.befund === 'ok' ? bewerteGesetz(basis, r) : r.befund;
    gesetzErg.push({ kurz: g.kurz, titel: g.titel, gii: g.gii, ...r, befund, basis, dateien, bgblSuche: `https://www.recht.bund.de/de/suche/suche_node.html?templateQueryString=${encodeURIComponent(g.kurz)}` });
    log(`${g.kurz}: ${befund}${r.standDatum ? ` (${r.standDatum})` : ''}`);
  }
  for (const e of gesetze.eu ?? []) manuell.push({ art: 'EU-Rechtsakt', code: `${e.kurz} – ${e.fundstelle}`, url: e.url, grund: 'konsolidierte Fassung auf EUR-Lex manuell prüfen' });

  const zaehle = (liste, f) => liste.filter(f).length;
  const zusammenfassung = {
    normenGeprueft: normen.length,
    normenAktuell: zaehle(normen, n => n.befund === 'aktuell'),
    normenHandlungsbedarf: zaehle(normen, n => HANDLUNG_NORM.has(n.befund)),
    normenManuell: zaehle(normen, n => MANUELL_NORM.has(n.befund)),
    gesetzeGeprueft: gesetzErg.length,
    gesetzeGeaendert: zaehle(gesetzErg, g => g.befund === 'geaendert' || g.befund === 'aelter_als_basis'),
    gesetzeManuell: zaehle(gesetzErg, g => ['nicht_abrufbar', 'nicht_lesbar', 'uebersprungen'].includes(g.befund)),
    weitereManuell: manuell.length,
  };
  zusammenfassung.handlungsbedarf = zusammenfassung.normenHandlungsbedarf + zusammenfassung.gesetzeGeaendert;
  zusammenfassung.quelleErreicht = normen.some(n => n.kette?.length) || gesetzErg.some(g => g.standDatum);

  return {
    version: 1,
    datum,
    quellen: { dinMedia: mitDinMedia ? dinGrund : 'nicht abgefragt', gii: mitGii ? 'gesetze-im-internet.de' : 'nicht abgefragt' },
    abrufe: { ...abrufer.statistik },
    zusammenfassung,
    normen,
    gesetze: gesetzErg,
    manuell,
    prueflisteZitate,
  };
}

// ---------------------------------------------------------------------------------------------
// Berichte
// ---------------------------------------------------------------------------------------------

const deDatum = isoDatum => (isoDatum ? isoDatum.split('-').reverse().join('.') : '–');
const zelle = s => String(s ?? '–').replace(/\|/g, '\\|').replace(/\n/g, ' ');
function dateiListe(dateien, max = 8) {
  if (!dateien.length) return '–';
  const kurz = dateien.map(d => '`' + d.replace(/^src\//, '') + '`');
  return kurz.length > max ? `${kurz.slice(0, max).join(', ')} … (+${kurz.length - max})` : kurz.join(', ');
}
function veralteteFundstellen(n) {
  const aktuell = n.aktuell?.ausgabe;
  return Object.entries(n.fundstellen || {}).filter(([a]) => !aktuell || vergleicheAusgabe(a, aktuell) !== 0);
}

export function berichtMarkdown(e) {
  const z = e.zusammenfassung;
  const L = [];
  L.push(`# Normen- und Rechtsstand-Check ${e.datum.slice(0, 7)}`, '');
  L.push(`Lauf vom ${deDatum(e.datum)} · erzeugt von \`scripts/qa/normen-check.mjs\` (AP 6.7) · Vorgehen: [README](README.md)`, '');
  L.push('| Bereich | geprüft | aktuell/unverändert | Handlungsbedarf | manuell |', '|---|---|---|---|---|');
  L.push(`| Normen (DIN Media) | ${z.normenGeprueft} | ${z.normenAktuell} | ${z.normenHandlungsbedarf} | ${z.normenManuell} |`);
  L.push(`| Gesetze/Verordnungen (gesetze-im-internet.de) | ${z.gesetzeGeprueft} | ${e.gesetze.filter(g => g.befund === 'unveraendert').length} | ${z.gesetzeGeaendert} | ${z.gesetzeManuell} |`);
  L.push(`| Weitere Regelwerke, EU-Recht | ${z.weitereManuell} | – | – | ${z.weitereManuell} |`, '');
  L.push(`Quellen: DIN Media – ${e.quellen.dinMedia}; Recht – ${e.quellen.gii}. Abrufe: ${e.abrufe.abrufe} (Cache ${e.abrufe.cache}, Fehler ${e.abrufe.fehler}, durch robots.txt ausgeschlossen ${e.abrufe.gesperrt}).`, '');

  const handlung = e.normen.filter(n => HANDLUNG_NORM.has(n.befund));
  L.push('## 1. Normen mit Handlungsbedarf', '');
  if (!handlung.length) L.push('Keine.', '');
  else {
    L.push('| Norm | Registry/Prüfliste | DIN Media aktuell | Befund | betroffene Module | Fundstellen mit abweichender Ausgabe |', '|---|---|---|---|---|---|');
    for (const n of handlung) {
      const alt = veralteteFundstellen(n).map(([a, d]) => `${a}: ${dateiListe(d, 5)}`).join('; ') || '–';
      const herkunft = n.registryId ? `${n.soll ?? '–'} (\`${n.registryId}\`)` : `${n.soll} (Prüfliste ${(n.fragen || []).join(', ')})`;
      const aktuell = n.kette?.length ? `[${zelle(n.aktuell.nummer)}:${n.aktuell.ausgabe}](${n.kette.at(-1).url})` : '–';
      L.push(`| ${zelle(n.nummer)} | ${zelle(herkunft)} | ${aktuell} | ${BEFUND_TEXT[n.befund]} | ${(n.module || []).map(m => '`' + m + '`').join(', ') || '–'} | ${zelle(alt)} |`);
    }
    L.push('');
  }

  const geaendert = e.gesetze.filter(g => g.befund === 'geaendert' || g.befund === 'aelter_als_basis');
  L.push('## 2. Geänderte Gesetze und Verordnungen', '');
  if (!geaendert.length) L.push(e.gesetze.some(g => g.befund === 'basis_erfasst') ? 'Keine Änderung feststellbar (Rechtsstand in diesem Lauf erstmals erfasst, siehe Abschnitt 4).' : 'Keine.', '');
  else {
    L.push('| Vorschrift | Stand letzter Lauf | Stand jetzt | Fundstelle | Module mit Bezug |', '|---|---|---|---|---|');
    for (const g of geaendert) L.push(`| [${g.kurz}](${g.url}) | ${deDatum(g.basis)} | ${deDatum(g.standDatum)} | ${zelle(g.standText)} | ${dateiListe(g.dateien)} |`);
    L.push('');
  }

  const man = e.normen.filter(n => MANUELL_NORM.has(n.befund));
  const gMan = e.gesetze.filter(g => ['nicht_abrufbar', 'nicht_lesbar', 'uebersprungen'].includes(g.befund));
  L.push('## 3. Manuell zu prüfen', '');
  if (!man.length && !gMan.length && !e.manuell.length) L.push('Keine.', '');
  for (const n of man) {
    const info = n.aktuell ? ` – DIN Media: ${n.aktuell.nummer}:${n.aktuell.ausgabe}` : '';
    L.push(`- [ ] **${n.nummer}** (soll ${n.soll ?? '–'}${n.registryId ? `, \`${n.registryId}\`` : ', aus Prüfliste'}): ${BEFUND_TEXT[n.befund]}${n.grund ? ` (${n.grund})` : ''}${info} · [DIN-Media-Suche](${n.dinMediaSuche})`);
  }
  for (const g of gMan) L.push(`- [ ] **${g.kurz}**: ${BEFUND_TEXT[g.befund]}${g.grund ? ` (${g.grund})` : ''} · ${g.gii ? `[gesetze-im-internet.de](${GII}/${g.gii}/) · ` : ''}[Bundesgesetzblatt](${g.bgblSuche}) · ${g.dateien.length} Dateien mit Bezug`);
  for (const m of e.manuell) L.push(`- [ ] **${m.code}**${m.id ? ` (\`${m.id}\`)` : ''}: ${m.grund}${m.url ? ` · [Quelle](${m.url})` : ''}`);
  L.push('');

  const ok = e.normen.filter(n => n.befund === 'aktuell');
  L.push('## 4. Bestätigt', '');
  if (ok.length) {
    L.push('| Norm | Ausgabe | Fundstellen mit anderer Ausgabe |', '|---|---|---|');
    for (const n of ok) L.push(`| ${zelle(n.nummer)} | ${n.aktuell.ausgabe}${n.kette.at(-1)?.zurueckgezogen ? ' (zurückgezogen, Registry: ersetzt)' : ''} | ${zelle(veralteteFundstellen(n).map(([a, d]) => `${a}: ${dateiListe(d, 4)}`).join('; ') || '–')} |`);
    L.push('');
  }
  const gOk = e.gesetze.filter(g => g.befund === 'unveraendert' || g.befund === 'basis_erfasst');
  if (gOk.length) {
    L.push('| Vorschrift | Stand | Befund | Dateien mit Bezug |', '|---|---|---|---|');
    for (const g of gOk) L.push(`| [${g.kurz}](${g.url}) | ${zelle(g.standText)}${g.hinweis ? ` – Hinweis: ${zelle(g.hinweis)}` : ''} | ${BEFUND_TEXT[g.befund]} | ${g.dateien.length} |`);
    L.push('');
  }
  if (!ok.length && !gOk.length) L.push('Keine.', '');
  L.push('Hinweis: „aktuell“ heißt, dass die Registry-Ausgabe der bei DIN Media geführten aktuellen Ausgabe entspricht. Ob ein Regelwerk bauaufsichtlich eingeführt ist (MVV TB), prüft der Check nicht.', '');
  return L.join('\n');
}

/** Ersetzt den automatischen Abschnitt der Prüfliste (zwischen den Markierungen) oder hängt ihn an. */
export function aktualisierePruefliste(text, e, berichtLink) {
  const L = [MARKE_START, '## Normen- und Rechtsstand (automatischer Normen-Check)', ''];
  L.push(`Lauf vom ${deDatum(e.datum)} · [Bericht](${berichtLink}) · Dieser Abschnitt wird bei jedem Lauf von \`scripts/qa/normen-check.mjs\` neu geschrieben. Punkte bitte in Registry bzw. Modul beheben; sie entfallen dann beim nächsten Lauf.`, '');
  const handlung = e.normen.filter(n => HANDLUNG_NORM.has(n.befund));
  for (const n of handlung) {
    const module = (n.module || []).length ? ` – Module: ${n.module.join(', ')}` : '';
    const fragen = (n.fragen || []).length ? ` – Fragen: ${n.fragen.join(', ')}` : '';
    L.push(`- [ ] **${n.nummer}**: ${BEFUND_TEXT[n.befund]} – soll ${n.soll ?? '–'}, DIN Media ${n.aktuell.nummer}:${n.aktuell.ausgabe}${module}${fragen}`);
  }
  for (const g of e.gesetze.filter(x => x.befund === 'geaendert' || x.befund === 'aelter_als_basis')) {
    L.push(`- [ ] **${g.kurz}**: ${BEFUND_TEXT[g.befund]} (${deDatum(g.basis)} → ${deDatum(g.standDatum)}) – ${g.dateien.length} Dateien mit Bezug, siehe Bericht`);
  }
  const nMan = e.normen.filter(n => MANUELL_NORM.has(n.befund)).length;
  const gMan = e.gesetze.filter(g => ['nicht_abrufbar', 'nicht_lesbar', 'uebersprungen'].includes(g.befund)).length;
  if (nMan + gMan + e.manuell.length) L.push(`- [ ] Manuelle Prüfung laut Bericht, Abschnitt 3: ${nMan} Normen, ${gMan} Gesetze/Verordnungen, ${e.manuell.length} weitere Regelwerke/EU-Rechtsakte`);
  if (!handlung.length && L.length === 4 && !(nMan + gMan + e.manuell.length)) L.push('- Kein Handlungsbedarf festgestellt.');
  // Abgleich der Normzitate in den Prüfhinweisen oben
  const proZitat = new Map();
  for (const z of e.prueflisteZitate || []) {
    const n = e.normen.find(x => x.nummer.toLowerCase() === z.nummer.toLowerCase());
    if (!n || !n.aktuell) continue;
    const key = `${z.nummer}:${z.ausgabe}`;
    if (proZitat.has(key)) continue;
    const passt = vergleicheAusgabe(z.ausgabe, n.aktuell.ausgabe) === 0 && n.aktuell.nummer.toLowerCase() === z.nummer.toLowerCase();
    proZitat.set(key, `- ${z.fragen.length ? z.fragen.join(', ') : 'Prüfliste'} – ${key}: DIN Media nennt ${n.aktuell.nummer}:${n.aktuell.ausgabe}${n.kette?.at(-1)?.zurueckgezogen ? ' (zurückgezogen)' : ''} → ${passt ? 'Ausgabe bestätigt' : 'abweichend, Punkt oben prüfen'}`);
  }
  if (proZitat.size) L.push('', 'Abgleich der oben genannten Normausgaben mit DIN Media:', '', ...proZitat.values());
  L.push(MARKE_ENDE);
  const block = L.join('\n');
  const a = text.indexOf(MARKE_START);
  const b = text.indexOf(MARKE_ENDE);
  if (a >= 0 && b > a) return text.slice(0, a) + block + text.slice(b + MARKE_ENDE.length);
  return text.replace(/\s*$/, '') + '\n\n' + block + '\n';
}

export function prBody(e, berichtPfad) {
  const z = e.zusammenfassung;
  return [
    `Automatischer halbjährlicher Normen- und Rechtsstand-Check (AP 6.7), Lauf vom ${deDatum(e.datum)}.`,
    '',
    `- Normen geprüft: ${z.normenGeprueft} – aktuell ${z.normenAktuell}, **Handlungsbedarf ${z.normenHandlungsbedarf}**, manuell ${z.normenManuell}`,
    `- Gesetze/Verordnungen: ${z.gesetzeGeprueft} – **geändert ${z.gesetzeGeaendert}**, manuell ${z.gesetzeManuell}`,
    `- weitere Regelwerke/EU-Rechtsakte zur manuellen Prüfung: ${z.weitereManuell}`,
    '',
    `Bericht: \`${berichtPfad}\` · Prüfliste: \`docs/quiz-pruefhinweise.md\` (Abschnitt „Normen- und Rechtsstand“).`,
    '',
    'Der PR ändert keine Inhalte: Neue Ausgaben müssen fachlich bewertet und in Registry, Modul-Fußzeilen und Texten nachgezogen werden (`npm run check:quellen` prüft danach die Einheitlichkeit).',
    '',
    'Hinweis: Mit `GITHUB_TOKEN` erstellte PRs starten keine weiteren Workflows; QA läuft nach dem ersten manuellen Push auf den Branch.',
  ].join('\n');
}

// ---------------------------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------------------------

function argumente(argv) {
  const a = { out: 'docs/normen-check', pruefliste: 'docs/quiz-pruefhinweise.md', verzoegerung: 3000, cache: '.cache/normen-check', cacheTage: 7, max: 0, dinmedia: true, gii: true };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const v = () => argv[++i];
    if (k === '--datum') a.datum = v();
    else if (k === '--out') a.out = v();
    else if (k === '--pruefliste') a.pruefliste = v();
    else if (k === '--verzoegerung') a.verzoegerung = Number(v());
    else if (k === '--cache') a.cache = v();
    else if (k === '--cache-tage') a.cacheTage = Number(v());
    else if (k === '--max') a.max = Number(v());
    else if (k === '--pr-body') a.prBody = v();
    else if (k === '--ohne-dinmedia') a.dinmedia = false;
    else if (k === '--ohne-gii') a.gii = false;
    else throw new Error(`Unbekannte Option ${k}`);
  }
  return a;
}

function quelldateien(root) {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.tsx?$/.test(e.name) && !p.endsWith('centralNormenRegistry.ts')) out.push({ pfad: path.relative(path.dirname(root), p).split(path.sep).join('/'), text: fs.readFileSync(p, 'utf8') });
    }
  })(root);
  return out;
}

async function main() {
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const a = argumente(process.argv.slice(2));
  const heute = new Date().toISOString().slice(0, 10);
  const datum = a.datum ? (a.datum.length === 7 ? `${a.datum}-01` : a.datum) : heute;
  const monat = datum.slice(0, 7);
  const out = path.resolve(ROOT, a.out);
  fs.mkdirSync(out, { recursive: true });
  const vorherDatei = fs.readdirSync(out).filter(f => /^\d{4}-\d{2}\.json$/.test(f) && f < `${monat}.json`).sort().at(-1);
  const vorher = vorherDatei ? JSON.parse(fs.readFileSync(path.join(out, vorherDatei), 'utf8')) : null;
  const prPfad = path.resolve(ROOT, a.pruefliste);
  const pruefliste = fs.existsSync(prPfad) ? fs.readFileSync(prPfad, 'utf8') : '';
  const abrufer = new Abrufer({ verzoegerungMs: a.verzoegerung, cacheDir: a.cache ? path.resolve(ROOT, a.cache) : null, ttlTage: a.cacheTage, log: m => console.log('  ' + m) });
  const e = await fuehreCheckAus({
    registryText: fs.readFileSync(path.join(ROOT, 'src/data/centralNormenRegistry.ts'), 'utf8'),
    gesetze: JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/qa/normen-check-gesetze.json'), 'utf8')),
    pruefliste,
    srcDateien: quelldateien(path.join(ROOT, 'src')),
    abrufer, datum, vorher, mitDinMedia: a.dinmedia, mitGii: a.gii, max: a.max,
    log: m => console.log('  ' + m),
  });
  const md = path.join(out, `${monat}.md`);
  fs.writeFileSync(md, berichtMarkdown(e));
  fs.writeFileSync(path.join(out, `${monat}.json`), JSON.stringify(e, null, 2) + '\n');
  if (pruefliste) fs.writeFileSync(prPfad, aktualisierePruefliste(pruefliste, e, path.relative(path.dirname(prPfad), md).split(path.sep).join('/')));
  const rel = path.relative(ROOT, md);
  if (a.prBody) fs.writeFileSync(path.resolve(ROOT, a.prBody), prBody(e, rel));
  const z = e.zusammenfassung;
  console.log(`Normen-Check ${monat}: ${z.normenGeprueft} Normen (${z.normenHandlungsbedarf} Handlungsbedarf, ${z.normenManuell} manuell), ${z.gesetzeGeprueft} Vorschriften (${z.gesetzeGeaendert} geändert, ${z.gesetzeManuell} manuell) → ${rel}`);
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `bericht=${rel}\nhandlungsbedarf=${z.handlungsbedarf}\nquelle_erreicht=${z.quelleErreicht}\n`);
  }
  if (!z.quelleErreicht) {
    console.error('Keine Quelle erreichbar – Bericht enthält nur die manuelle Prüfliste.');
    process.exitCode = 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(err => { console.error(err); process.exit(1); });
}
