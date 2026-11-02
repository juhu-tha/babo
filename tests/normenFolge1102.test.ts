// Folge der Normausgaben-Prüfung 11/2026 (docs/pruefung/normausgaben-2026-11.md, Abschnitt 3), umgesetzt 02.11.2026
// (docs/pruefung/normen-fristen-folge-2026-11-02.md): Ausgaben über die Registry, Normenausblick Stand November 2026,
// Status DIN 4109-1 / DIN EN 197-1 bleibt „gueltig“ (Entwürfe ändern die Gültigkeit nicht).
import fs from 'fs';
import { CENTRAL_NORMEN_REGISTRY as R, getNormById } from '../src/data/centralNormenRegistry';
import ausblick from '../content/normenausblick/NormenAusblick.json';
import lebensdauer from '../content/lebensdauerbemessung/Lebensdauerbemessung.json';
import schnell from '../content/schnellkarbonatisierung/Schnellkarbonatisierung.json';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: Normen-Folge 02.11.2026 ---');

// 1. Registry: aktuelle Ausgaben
const ausgabe = (id: string) => R[id] && `${R[id].code}|${R[id].ausgabeStand}|${R[id].status}`;
pruefe(ausgabe('DIN_EN_12390_10') === 'DIN EN 12390-10:2019-08|2019-08|gueltig', `DIN EN 12390-10: ${ausgabe('DIN_EN_12390_10')}`);
pruefe(ausgabe('DIN_EN_12390_12') === 'DIN EN 12390-12:2020-04|2020-04|gueltig' && /Entwurf DIN EN 12390-12:2025-11/.test(R.DIN_EN_12390_12.beschreibung), 'DIN EN 12390-12 mit Entwurfshinweis 2025-11');
pruefe(ausgabe('DIN_EN_12390_18') === 'DIN EN 12390-18:2025-02|2025-02|gueltig' && /ersetzt DIN EN 12390-18:2021-09/.test(R.DIN_EN_12390_18.beschreibung), 'DIN EN 12390-18:2025-02');
pruefe(ausgabe('DIN_4226_101') === 'DIN 4226-101:2025-11|2025-11|gueltig' && ausgabe('DIN_4226_102') === 'DIN 4226-102:2025-11|2025-11|gueltig', 'DIN 4226-101/-102:2025-11');
// 3. Status: Entwürfe ändern die Gültigkeit nicht
pruefe(R.DIN_4109_1?.status === 'gueltig' && R.DIN_EN_197_1?.status === 'gueltig', 'DIN 4109-1 und DIN EN 197-1 bleiben „gueltig“');

// 2. keine veralteten fest verdrahteten Ausgaben mehr in content/
const alt = /DIN EN 12390-10:2019-02|DIN EN 12390-18:2021-09(?![^"]{0,40}ersetzt)|DIN 4226-10[12](?:\/-102)?:2017-08/;
for (const d of fs.readdirSync('content', { recursive: true }) as string[]) {
  if (!d.endsWith('.json')) continue;
  const s = fs.readFileSync(`content/${d}`, 'utf8');
  pruefe(!alt.test(s), `content/${d}: veraltete Ausgabe (${(s.match(alt) || [])[0]})`);
  // Registry-IDs in Fußzeilen müssen auflösbar sein
  const j = JSON.parse(s);
  for (const [k, v] of Object.entries(j.daten ?? {})) {
    if (!/(^|\.)regelwerke(_\d+)?$/.test(k) || !Array.isArray(v)) continue;
    for (const e of v) if (typeof e === 'string' && /^[A-Z][A-Z0-9_]+$/.test(e)) pruefe(!!getNormById(e), `content/${d} ${k}: Registry-ID ${e} unbekannt`);
  }
}
pruefe(/DIN EN 12390-18:2025-02/.test(lebensdauer.texte.cEinleitung) && /Gleichung \(5\)/.test(lebensdauer.texte.cEinleitung), 'Lebensdauerbemessung: Einleitung 2025-02 mit Hinweis Gleichung (5)');
pruefe(/Entwurf DIN EN 12390-12:2025-11/.test(schnell.texte.dinEn1239012) && /vorläufig, Normprüfung ausstehend/.test(schnell.texte.dinEn1239012), 'Schnellkarbonatisierung: Entwurfshinweis');

// 2. Normenausblick Stand November 2026
pruefe(ausblick.texte.standNovember2026Für.startsWith('**Stand November 2026:**'), 'Normenausblick: Stand November 2026');
pruefe(!JSON.stringify(ausblick).includes('Stand Oktober 2026'), 'Normenausblick: kein „Stand Oktober 2026“ mehr');
const entw = (ausblick.daten.ENTWUERFE as { was: string }[]).map(e => e.was);
for (const s of ['DIN 1045-2/A1', 'E DIN EN 1992-1-1/NA1:2025-08', 'E DIN EN 1992-1-1/A1:2026-05', 'MVV TB 2026/1', 'E DIN EN 197-1:2026-08', 'E DIN 4109-1:2026-09', 'E DIN EN 12390-12:2025-11'])
  pruefe(entw.includes(s), `Normenausblick: Entwurf/Projekt ${s} fehlt`);
pruefe(/DIN 1045-2\/A1/.test(ausblick.texte.setztEineAbgestimmteNeufassung) && /TRIS 2026\/0349\/DE/.test(ausblick.texte.dieDinFassungenErscheinen), 'Normenausblick: Projekt 1045-2/A1 und MVV TB 2026/1 im Text');
pruefe(/vorläufig, Normprüfung ausstehend/.test(ausblick.texte.dieDinFassungenErscheinen), 'MVV TB 2026/1: Inhalt zu Eurocodes als vorläufig gekennzeichnet');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Normen-Folge 02.11.2026');
