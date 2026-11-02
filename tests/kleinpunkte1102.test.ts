// Kleinpunkte 02.11.2026 (docs/pruefung/kleinpunkte-2026-11-02.md): offene Punkte aus Nachstichprobe 3, Quiz-Abgleich,
// Gegenprüfung und Gesamtlauf vom 30.10.2026. Sollwerte als Handrechnung im Test, nicht aus den Kernen übernommen.
import { readFileSync } from 'fs';
import { GWP_LEHRWERTE, gwpJeKg } from '../src/data/gwpLehrwerte';
import { fraktilfaktorKn } from '../src/calc/statistik';
import { gwpRegler, liegtAufRaster } from '../src/modules/bimbaustoffe/gwpRegler';
import datenbanken from '../content/materialdatenbanken/Materialdatenbanken.json';
import materialpaesse from '../content/materialpaesse/Materialpaesse.json';
import organik from '../content/weitereorganik/WeitereOrganik.json';
import statistik from '../content/statistik/Statistik.json';
import excel from '../content/lca/TransportbetonExcelExport.json';
import bim from '../content/bimbaustoffe/BimBaustoffe.json';
import quiz from '../src/data/quiz.json';
import { pruefeKennwerte, ladeReferenzen } from '../scripts/qa/kennwert-abgleich.mjs';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const frage = (id: string) => (quiz as Array<Record<string, unknown>>).find(q => q.id === id) as Record<string, any>;
const lies = (p: string) => readFileSync(p, 'utf-8');

console.log('--- Test: Kleinpunkte 02.11.2026 ---');

// 1. NS3-MDB-2 Kalksandstein: ein zentraler Lehrwert 0,13 kg CO₂-Äq./kg = 130 kg/t
const ks = GWP_LEHRWERTE.kalksandstein;
pruefe('KS Lehrwert je kg', gwpJeKg('kalksandstein').fossil, 0.13, 1e-9);
gilt(ks.einheit === 't' && ks.gwp === 130 && ks.vorlaeufig && /Lehrwert/.test(ks.quelle) && /ÖKOBAUDAT/.test(ks.quelle), 'KS Lehrwert mit Quelle, vorläufig');
const mdbTsx = lies('src/modules/Materialdatenbanken.tsx');
gilt(/kalksandsteinKsPlansteinRohdichte, category: 'Mineralisch', unit: 't', gwp: GWP\.kalksandstein\.gwp,/.test(mdbTsx), 'KS QNG-Tabelle liest den Lehrwert (vorher 110)');
// Beispiel 1: 0,175 m · 1800 kg/m³ · 0,13 = 40,95 kg/m²; Summe mit EPS 0,14 · 20 · 3,25 = 9,10 → 50,05 ≈ 50,1
const flaechenmasse = 0.175 * 1800;
const ksWand = flaechenmasse * ks.gwp / 1000;
pruefe('KS Beispiel Wand', ksWand, 40.95, 1e-9);
pruefe('KS Beispiel Summe', ksWand + 0.14 * 20 * 3.25, 50.05, 1e-9);
const schritt = datenbanken.daten['Materialdatenbanken.schritte'][0];
gilt(schritt.erklaerung.includes('gwp = 0,13 kg CO₂e/kg') && schritt.formel.includes('0{,}13 = 40{,}95'), 'KS Beispiel 1 mit dem Lehrwert');
// Quiz q_dg_db_6: 315 · 0,13 = 40,95 ≈ 41,0; Distraktoren 0,10 m → 23,4; 1,75 m → 409,5; 1,75 cm → 4,1
const q6 = frage('q_dg_db_6');
gilt(q6.question.includes('0,13 kg CO₂-Äq./kg') && q6.options[q6.correctIdx] === 'rund 41,0 kg CO₂-Äq./m²', 'Quiz q_dg_db_6 mit dem Lehrwert');
pruefe('Quiz KS 10 cm', 0.10 * 1800 * 0.13, 23.4, 1e-9);
pruefe('Quiz KS 1,75 m', 1.75 * 1800 * 0.13, 409.5, 1e-9);
pruefe('Quiz KS 1,75 cm', 0.0175 * 1800 * 0.13, 4.095, 1e-9);
gilt(q6.options.includes('rund 23,4 kg CO₂-Äq./m²') && q6.options.includes('rund 410 kg CO₂-Äq./m²') && q6.options.includes('rund 4,1 kg CO₂-Äq./m²'), 'Quiz q_dg_db_6 Distraktoren');
gilt(q6.verified === false && !q6.reviewer && q6.vorpruefung?.ergebnis === 'korrigiert', 'Quiz q_dg_db_6 zur erneuten Freigabe');
// Prüfskript Kennwert-Abgleich kennt den Lehrwert: 0,13 übereinstimmend, 0,12 bzw. 110 kg/t abweichend
const refs = await ladeReferenzen();
const ksTreffer = (t: string) => pruefeKennwerte(t, refs).treffer.filter((x: any) => x.ref.konstante === 'GWP_LEHRWERTE.kalksandstein');
gilt(ksTreffer('Kalksandsteinwand mit 0,13 kg CO₂-Äq./kg').every((x: any) => x.ok) && ksTreffer('Kalksandsteinwand mit 0,13 kg CO₂-Äq./kg').length === 1, 'Abgleich KS 0,13 ok');
gilt(ksTreffer('Kalksandstein 0,12 kg CO₂-Äq./kg').some((x: any) => !x.ok), 'Abgleich KS 0,12 abweichend');
gilt(ksTreffer('Kalksandstein (KS-Planstein) 110 kg CO₂-Äq./t').some((x: any) => !x.ok), 'Abgleich KS 110 kg/t abweichend');

// 2. Biogener Kohlenstoff nach DIN EN 15804+A2: Ausbuchung bei Verlassen des Produktsystems, auch stoffliche Verwertung
const lca1 = frage('q_lca_1');
gilt(!/bei thermischer Verwertung wieder freigesetzt/.test(lca1.explanation) && /Produktsystem verlässt/.test(lca1.explanation)
  && /stofflicher Verwertung/.test(lca1.explanation), 'Quiz q_lca_1 Erklärung nach EN 15804+A2');
gilt(/Produktsystem verlässt/.test(lca1.distraktorFeedback[1]), 'Quiz q_lca_1 Rückmeldung angeglichen');
const mp = materialpaesse.texte.primärrohstoffDominanzSieNutzen;
gilt(!/bei Verbrennung in C3 wieder ausgebucht/.test(mp) && /Produktsystem verlässt/.test(mp) && /stofflicher Verwertung/.test(mp), 'Materialpässe biogener Kohlenstoff');

// 3. WeitereOrganik: Variable ohne chinesisches Schriftzeichen
const wo = lies('src/modules/WeitereOrganik.tsx');
gilt(!/[一-鿿]/.test(wo) && wo.includes('abbauJe10Jahre'), 'WeitereOrganik: Variable umbenannt');

// 4. q_hp_1: AIR-Richtwerte 2025 (RW I 80, RW II 800 ng/m³ PCB gesamt)
const hp1 = frage('q_hp_1');
gilt(/Richtwert II \(Gefahrenwert\) 800 ng\/m³/.test(hp1.explanation) && /Richtwert I 80 ng\/m³/.test(hp1.explanation), 'Quiz q_hp_1 mit AIR-Richtwerten');
gilt(1400 > 800 && hp1.options[hp1.correctIdx].includes('300–3000'), 'Quiz q_hp_1 Antwort nach PCB-Richtlinie unverändert');

// 5. NS3-WO-4: PAV etwa 5 bis 10 Jahre Feldalterung (Literaturangabe)
const pav = organik.texte.pressureAgingVesselSimuliert;
gilt(!/10- bis 15/.test(pav) && /etwa 5 bis 10 Jahre Feldalterung/.test(pav) && /AASHTO R 28/.test(pav), 'PAV 5 bis 10 Jahre mit Quelle');
gilt(organik.daten['WeitereOrganik.literatur'].some((l: string) => l.startsWith('AASHTO R 28')), 'PAV-Quelle in der Literaturliste');

// 6. NS3-ST-1: Beispiel 1 als allgemeine Prüfserie, Verweis auf DIN EN 13791
const st = statistik.daten['Statistik.schritte'][0].erklaerung;
gilt(!/Bohrkern|Bestandsdecke/.test(st) && /Prüfserie/.test(st), 'Statistik Beispiel 1 allgemein');
gilt(/DIN EN 13791/.test(statistik.werte.mitNurN3) && /Bauwerksdiagnose/.test(statistik.werte.mitNurN3), 'Statistik Verweis DIN EN 13791');
gilt(!/Bohrkern/.test(statistik.werte.beispiel1CharakteristischerWert), 'Statistik Titel Beispiel 1');
// Werte unverändert: k_n(10) = 1,92, X_k = 38,2 − 1,92 · 3,1 = 32,25, X_d = 32,2/1,5 = 21,5; n = 3: 38,2 − 3,37 · 3,1 = 27,75
pruefe('ST k_n 10', fraktilfaktorKn(10), 1.92, 1e-9);
pruefe('ST X_k', 38.2 - 1.92 * 3.1, 32.248, 1e-9);
pruefe('ST X_d', 32.2 / 1.5, 21.4667, 1e-4);
pruefe('ST k_n 3', fraktilfaktorKn(3), 3.37, 1e-9);
const qs1 = frage('qn_statistik_1');
gilt(!/Bohrkern|Bestandsdecke/.test(qs1.question) && /aus 10 Prüfwerten/.test(qs1.gapAnalysis.actionableAdvice), 'Quiz qn_statistik_1 nachgezogen');
pruefe('Quiz qn_statistik_1 X_d', (42.0 - 2.33 * 2.5) / 1.5, 24.1167, 1e-4);

// 8a. Excel-Blatt: (w/z)_eq = 155 / (290 + 0,4 · 40) = 0,5065 → 0,51; k-Wert nur für Flugasche
const xl = JSON.stringify(excel);
pruefe('XL (w/z)_eq', 155 / (290 + 0.4 * 40), 0.50654, 1e-4);
gilt(xl.includes('(w/z)_eq = 155 / (290 + 0,4 · 40) = 0,51') && !xl.includes('155 / 290 = 0.53'), 'Excel: (w/z)_eq statt w/z, Dezimalkomma');
gilt(xl.includes('k-Wert 0,4 nur für Flugasche anrechenbar') && !xl.includes('k-Wert = 0.4 anrechenbar'), 'Excel: k-Wert nur Flugasche');

// 8b. BIM-Regler: jede Voreinstellung liegt auf dem Raster; Stahl-Spanne bis 2,9 kg/kg einstellbar
const archetypen = bim.daten.ARCHETYPES as Array<{ id: string; defaultGwp: number; defaultDensity: number }>;
const beton = Math.round(GWP_LEHRWERTE.betonC3037CemI.gwp);
pruefe('BIM Beton C30/37 CEM I', beton, Math.round(320 * 0.665 + 45), 1e-9);
for (const a of archetypen) gilt(liegtAufRaster(a.id, a.defaultGwp), `BIM ${a.id}: ${a.defaultGwp} auf dem Reglerraster`);
gilt(liegtAufRaster('beton', beton) && liegtAufRaster('holz', GWP_LEHRWERTE.bsh.gwp), 'BIM Lehrwerte Beton/BSH auf dem Raster');
const stahl = archetypen.find(a => a.id === 'stahl')!;
gilt(gwpRegler('stahl').max >= 2.9 * stahl.defaultDensity, `BIM Stahl-Regler bis ${2.9 * stahl.defaultDensity}`);
gilt(liegtAufRaster('stahl', Math.round(1.1 * 7850 / 5) * 5) && !liegtAufRaster('beton', 401) && !liegtAufRaster('stahl', 8637), 'BIM Rasterprüfung');
gilt(lies('src/modules/BimBaustoffe.tsx').includes('step={gwpRegler(selectedId).step}'), 'BIM Regler nutzt gwpRegler');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Kleinpunkte 02.11.2026');
