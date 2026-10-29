// Modulübergreifende Konsistenzprüfung der Kennwerte (29.10.2026, docs/pruefung/konsistenz-2026-10-29.md).
// Prüft die angeglichenen Werte gegen die zentralen Konstanten und sucht die alten Kopien.
import { readFileSync } from 'node:fs';
import { EUROCODE2_TABELLE_3_1 } from '../src/data/standards/eurocode2';
import { CONCRETE } from '../src/utils/ec2Spannbeton';
import { SCHWINDBEIWERTE, schwinden, feuchteNachLagerung, gleichgewichtsfeuchte } from '../src/calc/holzphysik';
import { CO2_FAKTOR_HEIZUNG } from '../src/calc/bauprodukte';
import { FAKTOREN } from '../src/calc/energieausweis';
import { GAMMA_M } from '../src/calc/statistik';
import { GAMMA_C } from '../src/data/kennwerte';
import { GAMMA_M_HOLZ } from '../src/calc/holzbau';

const fehler: string[] = [];
const pruefe = (name: string, ist: number, soll: number, tol = 1e-4) => { if (!(Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll)))) fehler.push(`${name}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, name: string) => { if (!ok) fehler.push(name); };
const lies = (p: string) => readFileSync(new URL('../' + p, import.meta.url), 'utf-8');
console.log('--- Test: Konsistenz der Kennwerte 29.10.2026 ---');

// K-1 EC2 Tab. 3.1: Kopie in src/data/standards/eurocode2.ts stimmt mit CONCRETE überein (ε_c1 vorher 1,6 … 2,3)
for (const [k, r] of Object.entries(EUROCODE2_TABELLE_3_1)) {
  const c = CONCRETE[k];
  if (!c) continue;
  pruefe(`${k} f_cm`, r.f_cm, c.fcm); pruefe(`${k} f_ctm`, r.f_ctm, c.fctm); pruefe(`${k} E_cm`, r.E_cm * 1000, c.Ecm > 1000 ? c.Ecm : c.Ecm * 1000);
  pruefe(`${k} ε_c1`, r.epsilon_c1, c.eps_c1); pruefe(`${k} ε_cu1`, r.epsilon_cu1, c.eps_cu1); pruefe(`${k} ε_c2`, r.epsilon_c2, c.eps_c2);
  pruefe(`${k} ε_cu2`, r.epsilon_cu2, c.eps_cu2); pruefe(`${k} n`, r.n, c.n); pruefe(`${k} ε_c3`, r.epsilon_c3, c.eps_c3);
}
pruefe('C30/37 ε_c1', EUROCODE2_TABELLE_3_1['C30/37'].epsilon_c1, 2.2);
gilt(!lies('src/data/standards/eurocode2.ts').includes("NA:2023-08"), 'EC2-Ausgabe: keine „NA:2023-08“');

// K-2 Holz: Schwindmaße im Modul Holz aus dem Kern (Fichte 0,19/0,36), keine alte Kopie 0,16/0,33
const holz = lies('src/modules/Holz.tsx');
gilt(holz.includes('schwindQ(SCHWINDBEIWERTE.fichte)') && !holz.includes('qr: 0.16, qt: 0.33') && !holz.includes('qr: 0.17, qt: 0.31'), 'Holz: Schwindmaße aus SCHWINDBEIWERTE');
gilt(lies('content/holz/Holz.json').includes('radial ca. 0,19 %, tangential ca. 0,36 %'), 'Holz.json: 0,19/0,36');
// Erkundung Holz: Brett 120 × 24, 30 → u(30 d), 65 % bzw. 85 %; Bohle 200 × 60
const f = SCHWINDBEIWERTE.fichte;
const lauf = (rh: number, tage: number, b: number, d: number) => {
  const u = feuchteNachLagerung(30, gleichgewichtsfeuchte(rh, 20).u, tage, d).u;
  return { u, b: schwinden({ uStart: 30, uEnde: u, qt: f.tangential, qr: f.radial, ql: f.longitudinal, breite: b, dicke: d, laenge: 350 }).neueBreite };
};
pruefe('Brett 65 %', lauf(65, 30, 120, 24).b, 114.16, 1e-3);
pruefe('Brett 85 %', lauf(85, 30, 120, 24).b, 116.11, 1e-3);
pruefe('Bohle 30 d u', lauf(65, 30, 200, 60).u, 26.41, 1e-3);
pruefe('Bohle 30 d Δb', 200 - lauf(65, 30, 200, 60).b, 2.58, 2e-3);
pruefe('Bohle 365 d u', lauf(65, 365, 200, 60).u, 13.20, 1e-3);
pruefe('Bohle 365 d b', lauf(65, 365, 200, 60).b, 187.91, 1e-3);
const erk = lies('src/data/erkundung.ts');
gilt(erk.includes('116,1 mm statt auf 114,2 mm') && erk.includes('26,4 % Holzfeuchte und ist nur 2,6 mm') && erk.includes('13,2 % und 187,9 mm'), 'Erkundung Holz nachgerechnet');

// K-3 Wärmedehnzahl Beton im Klebstoff-/Dichtstoffberater 10 · 10⁻⁶ (wie Rechenbeispiel des Moduls und EC2 3.1.3(5))
gilt(lies('src/components/KlebstoffBerater.tsx').includes("name: 'Normalbeton / Stahlbeton', alpha: 10,"), 'Klebstoff: α Beton 10');

// K-4 CO₂-Faktor Erdgas (Dämmung) aus dem Energieausweis-Kern
pruefe('CO₂ Erdgas', CO2_FAKTOR_HEIZUNG, FAKTOREN.bis_2026.gas_brennwert.co2 / 1000);
pruefe('CO₂ Erdgas 0,24', CO2_FAKTOR_HEIZUNG, 0.24);

// K-5 Teilsicherheitsbeiwerte im Statistikmodul aus den zentralen Konstanten
pruefe('γ_M Beton', GAMMA_M.beton, GAMMA_C.staendig); pruefe('γ_M Stahl', GAMMA_M.stahl, 1.15); pruefe('γ_M Holz', GAMMA_M.holz, GAMMA_M_HOLZ);

// K-6 EPS c = 1450 J/(kg·K) (DIN EN ISO 10456) in Baustoffkenngrößen wie in Wärmeeigenschaften
gilt(lies('src/modules/Baustoffkenngroessen.tsx').includes('setThermischC(1450)') && lies('src/modules/Waermeeigenschaften.tsx').includes("'Dämmstoff (EPS)': { lambda: 0.035, rho: 20, c: 1450 }"), 'EPS c 1450');

// K-7 ETFE: UV-A und UV-B, wie Quizfrage qn_membranen_etfe_3
const etfe = lies('content/membranenetfe/MembranenETFE.json');
gilt(!etfe.includes('UV-A-durchlässig') && !etfe.includes('UV-A weitgehend durchlässig') && (etfe.match(/UV-A und UV-B/g) ?? []).length === 3, 'ETFE UV-Texte');

// K-8 Begriffe: λ = 2,3 im U-Wert-Beispiel als Stahlbeton; GModG statt „GEG-Höchstwert“
gilt(lies('content/beispielrechnungen/RechnungUWert.json').includes('Schicht 1: Stahlbeton'), 'U-Wert-Beispiel Stahlbeton');
gilt(!erk.includes('GEG-Höchstwert') && !erk.includes('GEG-Grenzwert'), 'Erkundung: kein „GEG-Höchstwert“');

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Konsistenz der Kennwerte 29.10.2026');
