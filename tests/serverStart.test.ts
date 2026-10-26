// Startet den Server so, wie Google AI Studio / Cloud Run es tut („npm start“ = node server.ts,
// ohne Build-Schritt für den Server). Fängt Importe ab, die Node ohne Bundler nicht auflösen kann
// (z. B. relative Importe ohne .ts-Endung) – Ursache des Startfehlers vom 26.10.2026.
import { spawn } from 'child_process';

const port = String(18000 + Math.floor(Math.random() * 1000));
const kind = spawn(process.execPath, ['server.ts'], { env: { ...process.env, PORT: port, NODE_ENV: 'production' }, stdio: ['ignore', 'pipe', 'pipe'] });
let log = '';
kind.stdout.on('data', d => { log += d; });
kind.stderr.on('data', d => { log += d; });

const ende = (ok: boolean, msg: string) => { kind.kill(); if (!ok) { console.error(`FAIL: ${msg}\n${log.slice(0, 2000)}`); process.exit(1); } console.log(`OK: ${msg}`); process.exit(0); };
kind.on('exit', code => ende(false, `Server beendet sich beim Start (Code ${code})`));

const start = Date.now();
const versuch = async (): Promise<void> => {
  try {
    const r = await fetch(`http://127.0.0.1:${port}/api/health`);
    if (r.ok) return ende(true, 'node server.ts startet und /api/health antwortet');
  } catch { /* noch nicht bereit */ }
  if (Date.now() - start > 20_000) return ende(false, 'Server antwortet nicht innerhalb von 20 s');
  setTimeout(versuch, 300);
};
void versuch();
