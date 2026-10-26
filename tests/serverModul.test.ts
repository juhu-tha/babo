// Modulseiten im Server (Z52): /modul/<id> liefert die vorgerenderte Datei aus dist/modul/, Aliase und
// Großschreibung leiten auf die kanonische Adresse um, unbekannte IDs bekommen index.html mit 404, /api bleibt.
// Läuft wie tests/serverStart.test.ts mit `node server.ts` (NODE_ENV=production) – einmal gegen ein kleines
// Test-dist im Temp-Verzeichnis und, falls gebaut, gegen das echte dist/ (npm run build).
import { spawn, type ChildProcess } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const SERVER = path.resolve('server.ts');

console.log('--- Test: Server /modul/<id> ---');

function starte(cwd: string): Promise<{ basis: string; kind: ChildProcess }> {
  const port = String(19000 + Math.floor(Math.random() * 1000));
  const kind = spawn(process.execPath, [SERVER], { cwd, env: { ...process.env, PORT: port, NODE_ENV: 'production' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  kind.stdout!.on('data', d => { log += d; });
  kind.stderr!.on('data', d => { log += d; });
  const basis = `http://127.0.0.1:${port}`;
  const start = Date.now();
  return new Promise((ok, nein) => {
    kind.on('exit', code => nein(new Error(`Server beendet (Code ${code})\n${log.slice(0, 1500)}`)));
    const versuch = async (): Promise<void> => {
      try { if ((await fetch(`${basis}/api/health`)).ok) return ok({ basis, kind }); } catch { /* noch nicht bereit */ }
      if (Date.now() - start > 20_000) return nein(new Error(`Server antwortet nicht\n${log.slice(0, 1500)}`));
      setTimeout(versuch, 300);
    };
    void versuch();
  });
}

const holen = (url: string) => fetch(url, { redirect: 'manual' });

// 1. Test-dist
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bb-modul-'));
fs.mkdirSync(path.join(tmp, 'dist', 'modul'), { recursive: true });
fs.writeFileSync(path.join(tmp, 'dist', 'index.html'), '<!doctype html><title>Start</title><div id="root">START-SCHALE</div>');
fs.writeFileSync(path.join(tmp, 'dist', 'modul', 'glas.html'), '<!doctype html><title>Glas</title><div id="root"><div data-schale inert>VORGERENDERT-GLAS</div></div>');
fs.writeFileSync(path.join(tmp, 'dist', 'modul', 'routen.json'), JSON.stringify({ ids: ['glas'], bekannt: ['start', 'admin', 'glas'], aliase: { glaeser: 'glas' } }));

const { basis, kind } = await starte(tmp);
try {
  const r = await holen(`${basis}/modul/glas`);
  const text = await r.text();
  pruefe(r.status === 200 && text.includes('VORGERENDERT-GLAS'), `/modul/glas: ${r.status}, ${text.slice(0, 80)}`);
  pruefe(/text\/html/.test(r.headers.get('content-type') ?? '') && r.headers.get('cache-control') === 'no-cache', `/modul/glas Kopfzeilen: ${r.headers.get('content-type')}, ${r.headers.get('cache-control')}`);
  pruefe((await (await holen(`${basis}/modul/glas/?poll=x`)).text()).includes('VORGERENDERT-GLAS'), '/modul/glas/?poll=x');
  const gross = await holen(`${basis}/modul/Glas?x=1`);
  pruefe(gross.status === 301 && gross.headers.get('location') === '/modul/glas?x=1', `/modul/Glas: ${gross.status} → ${gross.headers.get('location')}`);
  const alias = await holen(`${basis}/modul/glaeser`);
  pruefe(alias.status === 301 && alias.headers.get('location') === '/modul/glas', `Alias: ${alias.status} → ${alias.headers.get('location')}`);
  const start = await holen(`${basis}/modul/start`);
  pruefe(start.status === 301 && start.headers.get('location') === '/', `/modul/start: ${start.status} → ${start.headers.get('location')}`);
  const admin = await holen(`${basis}/modul/admin`);
  pruefe(admin.status === 200 && (await admin.text()).includes('START-SCHALE'), `/modul/admin (bekannt, nicht vorgerendert): ${admin.status}`);
  const unbekannt = await holen(`${basis}/modul/gibt_es_nicht`);
  pruefe(unbekannt.status === 404 && (await unbekannt.text()).includes('START-SCHALE'), `/modul/gibt_es_nicht: ${unbekannt.status}`);
  const startseite = await holen(`${basis}/`);
  pruefe(startseite.status === 200 && (await startseite.text()).includes('START-SCHALE'), `/: ${startseite.status}`);
  const api = await holen(`${basis}/api/gibt-es-nicht`);
  pruefe(api.status === 404 && /json/.test(api.headers.get('content-type') ?? ''), `/api/* verändert: ${api.status}`);
  const health = await holen(`${basis}/api/health`);
  pruefe(health.ok && health.headers.get('cache-control') === 'no-store', `/api/health: ${health.status}, ${health.headers.get('cache-control')}`);
} finally {
  kind.kill();
  fs.rmSync(tmp, { recursive: true, force: true });
}

// 2. echtes dist/ (nur wenn gebaut)
if (fs.existsSync('dist/modul/routen.json') && fs.existsSync('dist/modul/glas.html')) {
  const echt = await starte(process.cwd());
  try {
    const r = await holen(`${echt.basis}/modul/glas`);
    const html = await r.text();
    pruefe(r.status === 200, `dist: /modul/glas ${r.status}`);
    pruefe(html.includes('<meta name="bb-vorgerendert" content="glas" />') && html.includes('<link rel="canonical" href="https://baustoffboard.de/modul/glas"'), 'dist: Kennung bzw. kanonische Adresse fehlt');
    pruefe(/id="module-content"[\s\S]*Lernziele/.test(html), 'dist: Modulkopf (Lernziele) nicht vorgerendert');
    // genau eine h1 außerhalb von <noscript> (Modulname, wie App.tsx)
    pruefe((html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '').match(/<h1[ >]/g) ?? []).length === 1, 'dist: nicht genau eine h1');
    console.log('  (auch gegen dist/ geprüft)');
  } finally {
    echt.kind.kill();
  }
}

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log('OK: /modul/<id> vorgerendert, Umleitungen, 404, /api unverändert');
process.exit(0);
