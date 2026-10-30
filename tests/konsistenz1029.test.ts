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
import { ZEMENT_GWP_KG } from '../src/data/zementGwp';
import { GWP_LEHRWERTE } from '../src/data/gwpLehrwerte';
import { LEHRWERTE_A2 } from '../src/data/oekobaudatLehrwerteA2';
import { STAHL_GWP } from '../src/calc/materialoptimierung';
import { BNB_NUTZUNGSDAUER, lcaBilanz, A4_FAKTOR_GEBAEUDE } from '../src/calc/lca';
import { MATERIAL_DATABASE, PRESETS, alsLcaBaustoff } from '../src/modules/interactivelcacalc/daten';
import { EPD_DATABASE } from '../src/modules/nachhaltigkeit/daten';

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

// ---------------------------------------------------------------- Umsetzung der Entscheidungen 29.10.2026
type Quizfrage = { id: string; question: string; options: string[]; correctIdx: number; explanation: string; verified: boolean; reviewer?: string; reviewedAt?: string; vorpruefung?: { hinweis?: string }; quelle?: string };
const quiz = JSON.parse(lies('src/data/quiz.json')) as Quizfrage[];
const frage = (id: string) => quiz.find(q => q.id === id)!;
const zahl = (s: string) => Number((s.match(/-?\d+(?:,\d+)?/) ?? ['NaN'])[0].replace(',', '.'));
const offenKorrigiert = (q: Quizfrage) => !q.verified && !q.reviewer && !q.reviewedAt && (q.vorpruefung?.hinweis ?? '').startsWith('Konsistenz 29.10.:') && (q.vorpruefung?.hinweis ?? '').endsWith('– korrigiert');

// F-1: Begriff passend zu λ (2,0 unbewehrt, 2,3 Stahlbeton), Rechnung unverändert
gilt(frage('qn_bauphysik_1').question.includes('Normalbeton, unbewehrt (λ = 2,0') && !frage('qn_bauphysik_1').question.includes('Stahlbeton'), 'F-1 qn_bauphysik_1 Begriff');
gilt(frage('qn_rechnung_u_wert_2').question.includes('Stahlbeton (λ = 2,3') && !frage('qn_rechnung_u_wert_2').question.includes('Normalbeton'), 'F-1 qn_rechnung_u_wert_2 Begriff');
pruefe('F-1 U bauphysik_1', 1 / (0.13 + 0.20 / 2.0 + 0.12 / 0.035 + 0.04), 0.27, 0.01);
pruefe('F-1 U u_wert_2', 1 / (0.13 + 0.015 / 0.70 + 0.20 / 2.3 + 0.14 / 0.035 + 0.04), 0.234, 0.002);

// F-2: q_t Fichte 0,36 (SCHWINDBEIWERTE); Δb = 200 · 0,0036 · 8 = 5,76 mm, Distraktoren aus denselben Größen
pruefe('F-2 q_t Kern', f.tangential, 0.36);
for (const id of ['qn_holz_1', 'q_hw_4']) {
  const q = frage(id);
  gilt(q.question.includes('0,36 %') && !q.question.includes('0,33'), `F-2 ${id} q_t 0,36`);
  pruefe(`F-2 ${id} richtig`, zahl(q.options[q.correctIdx]), Math.round(200 * f.tangential / 100 * 8 * 10) / 10);
}
const h1 = frage('qn_holz_1').options.map(zahl), h4 = frage('q_hw_4').options.map(zahl);
pruefe('F-2 holz_1 Δu 16', h1[1], Math.round(200 * 0.0036 * 16 * 10) / 10);
pruefe('F-2 holz_1 radial', h1[2], Math.round(200 * f.radial / 100 * 8 * 10) / 10);
pruefe('F-2 holz_1 Faktor 10', h1[3], Math.round(200 * 0.00036 * 8 * 10) / 10);
pruefe('F-2 hw_4 längs', h4[0], Math.round(200 * f.longitudinal / 100 * 8 * 10) / 10);
pruefe('F-2 hw_4 radial', h4[2], Math.round(200 * f.radial / 100 * 8 * 10) / 10);
pruefe('F-2 hw_4 Δu 20', h4[3], Math.round(200 * 0.0036 * 20 * 10) / 10);

// F-8: Zement-GWP 0,665 (zementGwp.ts); 2,0/0,665 = 3,0 kg; Distraktoren 2,0 · 0,665 und 0,665/2,0
const bk = frage('qn_biokohlebeton_3'), gz = ZEMENT_GWP_KG['CEM I'];
gilt(bk.question.includes('0,665') && !bk.question.includes('0,80'), 'F-8 Zement-GWP 0,665');
pruefe('F-8 richtig', zahl(bk.options[bk.correctIdx]), Math.round(2.0 / gz * 10) / 10);
pruefe('F-8 multipliziert', zahl(bk.options[0]), Math.round(2.0 * gz * 10) / 10);
pruefe('F-8 Kehrwert', zahl(bk.options[3]), Math.round(gz / 2.0 * 100) / 100);
for (const id of ['qn_bauphysik_1', 'qn_rechnung_u_wert_2', 'qn_holz_1', 'q_hw_4', 'qn_biokohlebeton_3']) gilt(offenKorrigiert(frage(id)), `${id}: verified false, ohne Freigabe, Hinweis „Konsistenz 29.10.: … – korrigiert“`);

// F-3: Betonstahl 640 kg/t (ÖKOBAUDAT „Bewehrungsstahl (de)“) in Konsole, LCA-Rechner und Materialoptimierung; Profilstahl getrennt
pruefe('F-3 Betonstahl', GWP_LEHRWERTE.betonstahl.gwp, 640);
pruefe('F-3 Materialoptimierung', STAHL_GWP.eaf_de, 0.64);
const lcaMat = (id: string) => MATERIAL_DATABASE.find(m => m.id === id);
pruefe('F-3 LCA Betonstahl', lcaMat('betonstahl')?.gwpA1A3 ?? NaN, 640);
pruefe('F-3 LCA Profilstahl', lcaMat('baustahl')?.gwpA1A3 ?? NaN, 1100);
gilt(!!BNB_NUTZUNGSDAUER.betonstahl, 'F-3 Nutzungsdauer Betonstahl');
gilt(PRESETS.slice(0, 2).every(p => p.rows.some(r => r.materialId === 'betonstahl') && !p.rows.some(r => r.materialId === 'baustahl')), 'F-3 Massivbau-Szenarien mit Betonstahl');
const mdbTsx = lies('src/modules/Materialdatenbanken.tsx'), lcaTsx = lies('src/modules/InteractiveLCACalc.tsx');
gilt(mdbTsx.includes('gwp: GWP.betonstahl.gwp') && !mdbTsx.includes('gwp: 1120'), 'F-3 Konsole B500B 640');
gilt(!lcaTsx.includes('materialId: "baustahl", quantity: 1.8'), 'F-3 Standardaufbau mit Betonstahl');
// A2-Lehrwerte o-3 mit 640/598,8 neu skaliert (Quell-EPD Feralpi: AP 1,711; EP-Süßwasser 25,03 g PO₄ · 30,97/94,97; EP-Meer 0,4093; EP-terr. 4,687)
const o3 = LEHRWERTE_A2['o-3'], fa = 640 / 598.8;
pruefe('F-3 o-3 Faktor', o3.faktor, fa, 0.01); pruefe('F-3 o-3 AP', o3.ap, 1.711 * fa, 0.05); pruefe('F-3 o-3 EP-Meer', o3.epMeer, 0.4093 * fa, 0.05);
// Erkundung LCA-Rechner nachgerechnet (Standardaufbau mit 1,8 t Betonstahl; EPS seit 30.10.2026 mit 65 kg/m³ = 3,25 · 20): A1–A3 + C + A4 je m² und Jahr 2,40 / 2,24 / 4,80
{
  const zeile = (id: string, menge: number, q: number, s: number, v: 'downcycling' | 'high_grade' | 'thermal') => ({ baustoff: alsLcaBaustoff(lcaMat(id)!), menge, kreislaufquote: q, sortenreinheit: s, verwertung: v });
  const std = (z2 = 'ziegel') => [zeile('beton-cem1', 24, 65, 85, 'downcycling'), zeile(z2, 38, 55, 75, 'downcycling'), zeile('betonstahl', 1.8, 95, 95, 'high_grade'), zeile('eps-daemmung', 12, 25, 60, 'thermal')];
  const b = (zeilen: ReturnType<typeof std>, tf = A4_FAKTOR_GEBAEUDE.lkw, nrf = 140) => lcaBilanz({ zeilen, nrfR: nrf, betrachtungszeitraum: 50, transportDistanz: 120, transportFaktor: tf, mitB4: true, energie: { stromGeg: 2400, pvEigennutzung: 900, waerme: 0, waermeTraeger: 'netzstrom', nutzerstrom: true }, tgaSockel: 'ep_bis40', gebaeudeart: 'wohnbau' });
  const s = b(std()), bahn = b(std(), A4_FAKTOR_GEBAEUDE.bahn), kvh = b(std('kvh'));
  pruefe('Erk. A–C+A4 Lkw', (s.a1a3 + s.c3c4 + s.a4) / 7000, 2.40, 0.003);
  pruefe('Erk. A–C+A4 Bahn', (s.a1a3 + s.c3c4 + bahn.a4) / 7000, 2.24, 0.003);
  pruefe('Erk. NRF 70', (s.a1a3 + s.c3c4 + s.a4) / 3500, 4.80, 0.003);
  pruefe('Erk. Konstruktion', s.spez.konstruktion, 3.73, 0.003);
  pruefe('Erk. KVH Konstruktion', kvh.spez.konstruktion, 3.22, 0.003);
  pruefe('Erk. KVH mit D', kvh.spez.konstruktion + kvh.spez.d, 1.75, 0.003);
  gilt(erk.includes('von etwa 2,40 auf 2,24') && erk.includes('von etwa 2,40 auf 4,80') && erk.includes('von etwa 3,73 auf 3,22') && erk.includes('etwa 1,75'), 'Erkundung LCA-Rechner nachgerechnet');
}

// F-4: gemeinsame Lehrwerttabelle; alle Module lesen daraus
pruefe('F-4 C25/30', GWP_LEHRWERTE.betonC2530CemI.gwp, 245);
pruefe('F-4 C30/37', GWP_LEHRWERTE.betonC3037CemI.gwp, Math.round(320 * gz + 45)); // Rest einheitlich 45 seit 30.10.2026
pruefe('F-4 BSH', GWP_LEHRWERTE.bsh.gwp, -680); // DIN EN 16449, 480 kg/m³ (Umsetzung 30.10.2026, DSB-RU-1) pruefe('F-4 KVH', GWP_LEHRWERTE.kvh.gwp, -740);
for (const [k, w] of Object.entries(GWP_LEHRWERTE)) gilt(w.biogen <= 0 && w.gwp >= w.biogen && w.quelle.length > 10, `F-4 ${k} plausibel`);
pruefe('F-4 LCA-Rechner C25/30', lcaMat('beton-cem1')?.gwpA1A3 ?? NaN, GWP_LEHRWERTE.betonC2530CemI.gwp);
pruefe('F-4 LCA-Rechner RC', lcaMat('rc-beton')?.gwpA1A3 ?? NaN, GWP_LEHRWERTE.betonRcC2530.gwp);
pruefe('F-4 LCA-Rechner KVH', lcaMat('kvh')?.gwpA1A3 ?? NaN, GWP_LEHRWERTE.kvh.gwp);
// QNG-Tabelle und Konsole (Modul mit Bildimporten, daher Textprüfung)
gilt(['gwp: GWP.betonC2530CemI.gwp,', 'gwp: GWP.betonC3037CemIII.gwp,', 'gwp: GWP.kvh.gwp, penrt: 1950, biogenicC: GWP.kvh.biogen,', 'gwp: GWP.bsh.gwp, penrt: 2400, biogenicC: GWP.bsh.biogen,', 'gwp: GWP.bsh.gwp, // inkl. biogenem CO₂'].every(t => mdbTsx.includes(t))
  && !/gwp: (235|-620|-580|-482\.0),/.test(mdbTsx), 'F-4 Materialdatenbanken aus der Lehrwerttabelle');
pruefe('F-4 Wand C25/30 je kg', EPD_DATABASE.concrete_cem1.gwp_fossil_a1a3 * EPD_DATABASE.concrete_cem1.density, 245);
pruefe('F-4 Wand BSH je kg', (EPD_DATABASE.bsh_softwood.gwp_fossil_a1a3 + EPD_DATABASE.bsh_softwood.gwp_biogenic_a1a3) * EPD_DATABASE.bsh_softwood.density, -680);
for (const datei of ['src/modules/LCA.tsx', 'src/modules/DppEpd.tsx', 'src/modules/BimBaustoffe.tsx', 'src/modules/Materialdatenbanken.tsx', 'src/modules/nachhaltigkeit/daten.ts', 'src/modules/interactivelcacalc/daten.ts']) gilt(lies(datei).includes("@/src/data/gwpLehrwerte'"), `F-4 ${datei} importiert die Lehrwerttabelle`);
// Inhaltskopien stimmen mit der Tabelle überein (keine verdeckten Altwerte)
const lcaJson = JSON.parse(lies('content/lca/LCA.json')).daten.REFERENZEN_EPD as { id: string; gwp_total: number }[];
pruefe('F-4 LCA.json BSH', lcaJson.find(e => e.id === 'bsh-softwood')!.gwp_total, GWP_LEHRWERTE.bsh.gwp);
const bimJson = JSON.parse(lies('content/bimbaustoffe/BimBaustoffe.json')).daten.ARCHETYPES as { id: string; defaultGwp: number }[];
pruefe('F-4 BIM Beton', bimJson.find(a => a.id === 'beton')!.defaultGwp, GWP_LEHRWERTE.betonC3037CemI.gwp);
pruefe('F-4 BIM BSH', bimJson.find(a => a.id === 'holz')!.defaultGwp, GWP_LEHRWERTE.bsh.gwp);

// F-5: Lebensdauern – Außenputz und WDVS getrennt, WDVS 40 a (BNB 2017, 335.641)
const ld = lies('src/modules/Lebensdauern.tsx');
gilt(ld.includes("{ id: 'fassade_wdvs', category: inhalt.werte.fassadeWdvs, group: 'Fassade', min: 30, max: 50, avg: 40 }") && ld.includes("id: 'fassade_putz', category: inhalt.werte.fassadeAussenputz") && !lies('content/lebensdauern/Lebensdauern.json').includes('Putz/WDVS'), 'F-5 Zeile geteilt, WDVS 40 a');
gilt(BNB_NUTZUNGSDAUER['eps-daemmung'].nd === 40, 'F-5 WDVS 40 a wie LCA-Rechner');

// F-6: Normausgabe DIN EN 1504-5 nur gekennzeichnet
gilt((frage('q_is_cl_4').quelle ?? '').includes('DIN EN 1504-5:2005-03 (Ausgabe vorläufig, Normprüfung ausstehend)'), 'F-6 Quiz-Quelle gekennzeichnet');
gilt(lies('content/wubauwerke/WUBauwerke.json').includes('DIN EN 1504-5:2013-05 (Ausgabe vorläufig, Normprüfung ausstehend)'), 'F-6 WU-Bauwerke gekennzeichnet');

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Konsistenz der Kennwerte 29.10.2026');
