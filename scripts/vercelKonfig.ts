/**
 * vercel.json für den statischen Betrieb auf Vercel (Entscheidung 02.11.2026, docs/betrieb-vercel.md):
 * Content-Security-Policy, Weiterleitungen der Modul-Aliase und die noindex-Regeln (abgeschaltete Seiten,
 * *.vercel.app) werden hier erzeugt, damit sie mit dem Quelltext übereinstimmen (Inline-Skripte, Registry).
 * Der Rest von vercel.json wird von Hand gepflegt.
 *
 *   npx tsx scripts/vercelKonfig.ts            prüft, ob vercel.json aktuell ist (Exit 1 sonst)
 *   npx tsx scripts/vercelKonfig.ts --schreiben schreibt CSP und Weiterleitungen in vercel.json
 *
 * tests/statikModus.test.ts ruft die Prüfung auf.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AKTIVE_ALIASE, INAKTIVE_ADRESSEN } from '../src/registry/modules';
import { modulPfad } from '../src/routing/pfad';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const VERCEL_DATEI = path.join(wurzel, 'vercel.json');

const sha = (s: string) => `'sha256-${crypto.createHash('sha256').update(s).digest('base64')}'`;

/**
 * SHA-256 der beiden Inline-Skripte, so wie die Vite-Plugins sie einsetzen (in dist/index.html und in jeder
 * vorgerenderten dist/modul/<id>.html identisch): scripts/startSchale.ts unverändert, scripts/modulVorladen.ts
 * mit trim(). Die Modul-Zuordnung steht in einem JSON-Datenblock und braucht keinen Hash.
 */
export function inlineSkriptHashes(): string[] {
  const schale = fs.readFileSync(path.join(wurzel, 'scripts/startschale-boot.js'), 'utf8');
  const vorladen = fs.readFileSync(path.join(wurzel, 'scripts/vorladen-boot.js'), 'utf8').trim();
  return [sha(schale), sha(vorladen)];
}

// Google Translate (Seitenübersetzung im Browser) wie in server.ts (securityHeaders) zugelassen
const TRANSLATE = 'https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com';

/**
 * Erzwungene Richtlinie für die statische Fassung (geprüft mit scripts/qa/vercel-vorschau.mjs über alle
 * Modulseiten: keine Verstöße). Gegenüber server.ts (dort noch Report-Only):
 *  - script-src ohne 'unsafe-inline'/'unsafe-eval', nur eigene Dateien und die zwei Inline-Skripte per Hash;
 *  - style-src mit 'unsafe-inline' (style-Attribute von React, KaTeX, Diagrammen);
 *  - img-src https: (Abbildungen von Wikimedia u. a.), data:/blob: (Diagramm- und PDF-Export);
 *  - connect-src nur eigene Adresse (Suchindex, Quizpool, Inhalte), keine /api-Aufrufe im Statik-Modus;
 *  - worker-src 'self' blob: vorsorglich (derzeit keine Worker), frame-src YouTube;
 *  - frame-ancestors statt X-Frame-Options: erlaubt die Einbettung über baustoffboard.de (Rahmenweiterleitung),
 *    was X-Frame-Options (nur DENY/SAMEORIGIN) nicht ausdrücken kann.
 */
export function csp(): string {
  return [
    "default-src 'self'",
    ["script-src 'self'", ...inlineSkriptHashes(), TRANSLATE].join(' '),
    "style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://www.gstatic.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' data: blob: https://translate.googleapis.com https://translate-pa.googleapis.com",
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
    "frame-ancestors 'self' https://baustoffboard.de https://www.baustoffboard.de",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ');
}

export interface Weiterleitung { source: string; destination: string; permanent: true }

/** Aliase und /modul/start → kanonische Adresse (wie server.ts, Route /modul/:id: 301) */
export function weiterleitungen(): Weiterleitung[] {
  const liste: Weiterleitung[] = [{ source: '/modul/start', destination: '/', permanent: true }];
  for (const [alias, ziel] of Object.entries(AKTIVE_ALIASE).sort(([a], [b]) => a.localeCompare(b))) {
    if (alias === ziel || alias === 'start') continue;
    liste.push({ source: modulPfad(alias), destination: modulPfad(ziel), permanent: true });
  }
  return liste;
}

type Kopfregel = { source: string; has?: { type: string; value: string }[]; headers: { key: string; value: string }[] };

/** Host-Muster der Vercel-Adressen (babo-zeta.vercel.app, Vorschau-Deployments) */
export const VERCEL_HOST = '(?<vercel>.+)\\.vercel\\.app';

/**
 * noindex-Regeln: abgeschaltete Seiten (INAKTIVE_ADRESSEN, wie die Hinweisseite in server.ts) und alle Seiten unter
 * *.vercel.app, solange baustoffboard.de die kanonische Adresse ist (canonical und Sitemap bleiben unverändert).
 */
export function noindexRegeln(): Kopfregel[] {
  const noindex = [{ key: 'X-Robots-Tag', value: 'noindex' }];
  return [
    { source: `/modul/(${[...INAKTIVE_ADRESSEN].sort().join('|')})`, headers: noindex },
    { source: '/(.*)', has: [{ type: 'host', value: VERCEL_HOST }], headers: noindex },
  ];
}
const istNoindex = (h: Kopfregel) => h.headers.length === 1 && h.headers[0].key === 'X-Robots-Tag';

type Konfig = { redirects?: Weiterleitung[]; headers?: Kopfregel[] } & Record<string, unknown>;

export function leseKonfig(): Konfig {
  return JSON.parse(fs.readFileSync(VERCEL_DATEI, 'utf8')) as Konfig;
}

/** Konfiguration mit aktueller CSP und aktuellen Weiterleitungen */
export function aktualisiert(k: Konfig): Konfig {
  const neu: Konfig = { ...k, redirects: weiterleitungen() };
  neu.headers = [...(k.headers ?? []).filter(h => !istNoindex(h)).map(h => h.source !== '/(.*)' || h.has ? h : {
    ...h,
    headers: h.headers.map(e => e.key === 'Content-Security-Policy' ? { ...e, value: csp() } : e),
  }), ...noindexRegeln()];
  return neu;
}

/** Abweichungen von vercel.json gegenüber dem Quelltext (leer = aktuell) */
export function abweichungen(): string[] {
  const k = leseKonfig();
  const soll = aktualisiert(k);
  const fehler: string[] = [];
  if (JSON.stringify(k.redirects) !== JSON.stringify(soll.redirects)) fehler.push('redirects (Modul-Aliase) nicht aktuell');
  const ist = k.headers?.find(h => h.source === '/(.*)' && !h.has)?.headers.find(e => e.key === 'Content-Security-Policy')?.value;
  if (ist !== csp()) fehler.push('Content-Security-Policy nicht aktuell (Inline-Skripte geändert?)');
  if (JSON.stringify((k.headers ?? []).filter(istNoindex)) !== JSON.stringify(noindexRegeln())) fehler.push('noindex-Regeln nicht aktuell (abgeschaltete Seiten geändert?)');
  return fehler;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--schreiben')) {
    // kompakt je Eintrag eine Zeile, damit Änderungen im Diff lesbar bleiben
    const k = aktualisiert(leseKonfig());
    const text = JSON.stringify(k, null, 2)
      .replace(/\{\n\s+("source": [^\n]+)\n\s+("destination": [^\n]+)\n\s+("permanent": true)\n\s+\}/g, '{ $1 $2 $3 }')
      .replace(/\{\n\s+("source": [^\n]+)\n\s+("destination": [^\n]+)\n\s+\}/g, '{ $1 $2 }')
      .replace(/\{\n\s+("key": [^\n]+)\n\s+("value": [^\n]+)\n\s+\}/g, '{ $1 $2 }');
    fs.writeFileSync(VERCEL_DATEI, text + '\n');
    console.log(`vercel.json geschrieben: ${k.redirects?.length ?? 0} Weiterleitungen, CSP aktualisiert`);
  } else {
    const f = abweichungen();
    if (f.length) { f.forEach(x => console.error('FEHLER', x)); console.error('→ npx tsx scripts/vercelKonfig.ts --schreiben'); process.exit(1); }
    console.log('vercel.json aktuell');
  }
}
