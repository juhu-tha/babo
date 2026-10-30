// Gezielte Durchsicht Tranche B (29.10.2026): Nachhaltigkeit, Rückbau & Schadstoffe, Digitales, KI, Beispielrechnungen,
// Praxiswissen, Bauphysik (Befundliste docs/pruefung/durchsicht-B-2026-10-29.md). Die Sollwerte stammen aus einem eigenen
// Prüfskript (Python, eigene Umsetzung der Rechenwege); der Test sichert die Korrekturen DSB-* gegen ein Zurückfallen und
// rechnet das Excel-Arbeitsblatt der Transportbeton-Übung mit einer eigenen kleinen Formelauswertung nach.
import { A4_FAKTOR_EINZEL, A4_FAKTOR_GEBAEUDE } from '../src/calc/lca';
import { GWP_LEHRWERTE } from '../src/data/gwpLehrwerte';
import { ZEMENT_GWP_KG } from '../src/data/zementGwp';
import { LCA_BENCHMARKS, LKW_FAKTOR_UEBUNG, LKW_FAKTOR_ZENTRAL } from '../src/modules/lca/transportbetonKennwerte';
import excel from '../content/lca/TransportbetonExcelExport.json';
import uebung from '../content/lca/TransportbetonLcaUebung.json';
import ingenieurbau from '../content/lca/IngenieurbauLCA.json';
import lcaGrundlagen from '../content/lca/LCA.json';
import lcaRechner from '../content/interactivelcacalc/InteractiveLCACalc.json';
import praxisbeispiele from '../content/nachhaltigkeit/AnhangPraxisbeispiele.json';
import anhangUebungen from '../content/nachhaltigkeit/AnhangUebungen.json';
import innovationen from '../content/nachhaltigkeit/PraxisInnovationen.json';
import boden from '../content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json';
import schadstoffe from '../content/schadstoffe/Schadstoffe.json';
import bim from '../content/bimbaustoffe/BimBaustoffe.json';
import dpp from '../content/dppepd/DppEpd.json';
import praxis from '../content/praxiswissen/Praxiswissen.json';
import uWert from '../content/beispielrechnungen/RechnungUWert.json';
import rechnungNh from '../content/beispielrechnungen/RechnungNachhaltigkeit.json';
import rueckbauDaten from '../content/rueckbau/daten.json';
import abfaelle from '../content/abfaelle/Abfaelle.json';
import datenRegeln from '../content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json';
import kreislauf from '../content/kreislaufwirtschaft/Kreislaufwirtschaft.json';
import materialpaesse from '../content/materialpaesse/Materialpaesse.json';
import rueckbau from '../content/rueckbau/Rueckbau.json';
import quiz from '../src/data/quiz.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const zeigt = (fall: string, quelle: unknown, ...werte: string[]) => {
  const s = JSON.stringify(quelle);
  for (const w of werte) gilt(s.includes(w), `${fall}: „${w}“ fehlt`);
};

console.log('--- Test: Durchsicht Tranche B 29.10.2026 ---');

// ------------------------------------------------------------------------------------------------ Excel-Arbeitsblatt
// Kleine Formelauswertung (nur +, −, ·, /, Klammern, SUM über Spalten­bereiche), Zellbezüge A1-Schreibweise
type Zelle = string | number | { f: string } | null | undefined;
function blatt(daten: Zelle[][]) {
  const wert = (ref: string, tiefe = 0): number => {
    const m = /^([A-Z])(\d+)$/.exec(ref);
    if (!m) throw new Error(ref);
    const z = daten[Number(m[2]) - 1]?.[m[1].charCodeAt(0) - 65];
    if (typeof z === 'number') return z;
    if (z && typeof z === 'object' && 'f' in z) return rechne(z.f, tiefe + 1);
    if (z === '' || z === undefined || z === null) return 0;
    throw new Error(`Bezug ${ref} zeigt auf Text „${String(z)}“`);
  };
  const rechne = (f: string, tiefe = 0): number => {
    if (tiefe > 20) throw new Error('Zirkelbezug');
    const ausdruck = f
      .replace(/SUM\(([A-Z])(\d+):([A-Z])(\d+)\)/g, (_, c1: string, r1: string, _c2: string, r2: string) => {
        let summe = 0;
        for (let r = Number(r1); r <= Number(r2); r++) {
          const z = daten[r - 1]?.[c1.charCodeAt(0) - 65];
          if (typeof z === 'number') summe += z;
          else if (z && typeof z === 'object') summe += rechne(z.f, tiefe + 1);
        }
        return String(summe);
      })
      .replace(/[A-Z]\d+/g, ref => `(${wert(ref, tiefe)})`);
    if (!/^[\d.()+\-*/ e]+$/.test(ausdruck)) throw new Error(`Formel nicht auswertbar: ${f}`);
    return Function(`return (${ausdruck});`)() as number;
  };
  return { wert, rechne };
}
const d = excel.daten as Record<string, Zelle[][]>;
const ws2 = d['generateTransportbetonExcel.ws2_data'];
const ws3 = d['generateTransportbetonExcel.ws3_data'];
const ws4 = d['generateTransportbetonExcel.ws4_data'];
try {
  const b2 = blatt(ws2);
  // Blatt 2: Summe A1–A5 der drei Rezepturen (Sollwerte aus eigener Nachrechnung)
  pruefe('LC-XL Blatt 2 Rezeptur 1', b2.wert('E34'), 239.9173);
  pruefe('LC-XL Blatt 2 Rezeptur 2', b2.wert('G34'), 148.7605);
  pruefe('LC-XL Blatt 2 Rezeptur 3', b2.wert('I34'), 100.7962);
} catch (e) { fehler.push(`LC-XL Blatt 2: ${(e as Error).message}`); }
try {
  // DSB-LC-1: Blatt 3 – vorher um zwei Zeilen versetzte Bezüge (#WERT!)
  const b3 = blatt(ws3);
  pruefe('DSB-LC-1 Blatt 3 Referenz', b3.wert('E32'), 247.921);
  pruefe('DSB-LC-1 Blatt 3 Entwurf', b3.wert('G32'), 139.5965);
  pruefe('DSB-LC-1 Blatt 3 Minderung %', b3.wert('G33'), 43.6932);
  pruefe('DSB-LC-1 Blatt 3 Ersparnis t', b3.wert('G38'), 92.0758);
  gilt(String(ws3[18][0]).startsWith('Zement: CEM I') && (ws3[18][4] as { f: string }).f === 'C19*D19', 'DSB-LC-1: Formel der Zeile 19 bezieht sich auf Zeile 19');
} catch (e) { fehler.push(`DSB-LC-1 Blatt 3: ${(e as Error).message}`); }
// DSB-LC-2: Anforderungen der maßgebenden Klasse XD1 (DIN 1045-2: w/z ≤ 0,55, Zement ≥ 300 kg/m³)
zeigt('DSB-LC-2', ws3, 'XD1: 300 kg/m³', '(w/z)_eq <= 0,55', 'Zelle G33', 'F19 bis F21', 'F27');
gilt(!JSON.stringify(ws3).includes('<= 0.50') && !JSON.stringify(ws3).includes('mindestens 280 kg/m³'), 'DSB-LC-2: alte Grenzwerte 0,50/280 entfernt');
const wzEntwurf = 155 / (290 + 0.4 * 40);
gilt(wzEntwurf <= 0.55 && 290 >= 270, `DSB-LC-2: Muster-Entwurf erfüllt die Anforderungen (w/z_eq = ${wzEntwurf.toFixed(3)})`);
// DSB-LC-3: Lkw-Faktor der Übung belassen (NP2-LC-2), Unterschied ausgewiesen; Bahn zentral
gilt(LKW_FAKTOR_UEBUNG === 0.068 && LCA_BENCHMARKS.transport_truck_40t === 0.068, 'DSB-LC-3: Lkw-Faktor der Übung 0,068 unverändert');
gilt(LKW_FAKTOR_ZENTRAL === A4_FAKTOR_EINZEL['lkw-heavy'] && LKW_FAKTOR_ZENTRAL !== LKW_FAKTOR_UEBUNG, 'DSB-LC-3: zentraler Vergleichswert');
gilt(LCA_BENCHMARKS.transport_train === A4_FAKTOR_EINZEL.zug, 'DSB-LC-3: Bahnfaktor aus A4_FAKTOR_EINZEL');
const hinweis = uebung.texte.hinweisLkwFaktor;
gilt(['{uebung}', '{zentral}', '{a2}', '{a2zentral}'].every(p => hinweis.includes(p)), 'DSB-LC-3: Platzhalter im Hinweistext');
const zeileBahn = ws4.find(z => String(z[0]).startsWith('Transport Güterzug'));
gilt(!!zeileBahn && zeileBahn[3] === A4_FAKTOR_EINZEL.zug, 'DSB-LC-3: Stammdaten Bahn = zentraler UBA-Wert');
const zeileLkw = ws4.find(z => String(z[0]).startsWith('Transport Lkw'));
gilt(!!zeileLkw && zeileLkw[3] === 0.068 && String(zeileLkw[7]).includes('0,101'), 'DSB-LC-3: Stammdaten Lkw mit Hinweis auf den zentralen Wert');
gilt(!JSON.stringify(excel).includes('Amtliche') && !uebung.texte.amtlicheÖkobaudatEmissionsfaktorenFür.includes('Amtliche'), 'DSB-LC-3: keine „amtlichen“ Faktoren');
// A2 der Standardrezeptur mit Übungs- und zentralem Faktor (Quiz qn_lca_rechner_x_1: rund 4,9)
const a2 = (f: number) => 0.32 * 80 * f + 1.87 * 25 * f;
pruefe('DSB-LC-3 A2 Übung', a2(LKW_FAKTOR_UEBUNG), 4.9198);
pruefe('DSB-LC-3 A2 zentral', a2(LKW_FAKTOR_ZENTRAL), 7.3074);
// DSB-LC-4: Bezugsgröße Würfeldruckfestigkeit
zeigt('DSB-LC-4', ws2, 'f_ck,cube = 30 N/mm²');
// DSB-LC-5: Preset 2 – Minderung A1 gegenüber Preset 1
const a1 = (zement: number, z: number, fa: number, s: number, k: number, rc: number, w: number, fm: number) =>
  zement * z + fa * 0.015 + (s + k) * 0.0035 + rc * 0.0018 + w * 0.0003 + fm * 1.65;
const minderungA1 = 1 - a1(290, ZEMENT_GWP_KG['CEM III/A'], 40, 710, 1160, 0, 160, 3.2) / a1(320, ZEMENT_GWP_KG['CEM I'], 0, 720, 1150, 0, 175, 2.5);
pruefe('DSB-LC-5 Minderung A1 Preset 2', minderungA1, 0.4252);
zeigt('DSB-LC-5', uebung.werte, 'um rund 43 %');
// DSB-LC-6: Praxisbeispiel QNG – Summe 11,75 + 3,00 + 7,74
pruefe('DSB-LC-6 Summe', 705000 / (1200 * 50) + 180000 / (1200 * 50) + 18 * 0.43, 22.49);
zeigt('DSB-LC-6', praxisbeispiele.texte, '22,49 kg');
gilt(!JSON.stringify(praxisbeispiele).includes('22,50'), 'DSB-LC-6: 22,50 entfernt');
// DSB-LC-7: Betonstahl statt Baustahl
gilt(!/Baustahl B500B|kg Baustahl pro/.test(JSON.stringify(anhangUebungen)), 'DSB-LC-7: Bewehrung als Betonstahl bezeichnet');
// Transportfaktoren in Texten = zentrale Konstanten
gilt(lcaRechner.werte.t015KgCo.startsWith(String(A4_FAKTOR_GEBAEUDE.lkw).replace('.', ',')), 'LC: Lkw-Faktor Gebäuderechner im Text');
gilt(lcaRechner.werte.t003KgCo.startsWith(String(A4_FAKTOR_GEBAEUDE.bahn).replace('.', ',')), 'LC: Bahnfaktor Gebäuderechner im Text');
gilt(lcaGrundlagen.texte.kmIstEinUmstieg.includes(`${String(A4_FAKTOR_EINZEL.zug).replace('.', ',')} statt ${String(A4_FAKTOR_EINZEL['lkw-heavy']).replace('.', ',')}`), 'LC: Bahn/Lkw im Tutor-Text');

// ------------------------------------------------------------------------------------------------ lca_ingenieurbau
// Simulator mit den Lehrwerten (unverändert): 1500 m², 100 a, DTV-SV 4500 → Summen A–C wie im Quiz
const brueckeSumme = (stahl: boolean, T = 100, A = 1500, dtv = 4500, f = 1) => {
  const nb = Math.floor(T / 15), nl = Math.floor(T / 30), nk = Math.floor(T / 25);
  const b8 = (nb * 18 + (stahl ? nk * 4 : 0)) * f * dtv * 0.4 * 0.95;
  const b = A * (nb * 12.35 + 28 * T / 100 + nl * 5 + (stahl ? nk * 9.5 : 12 * T / 100));
  return (A * (stahl ? 211.3 + 18 + 24 : 266.4 + 25 + 32) + b + b8) / 1000;
};
pruefe('LI Spannbeton A–C', brueckeSumme(false), 863.43);
pruefe('LI Stahlverbund A–C', brueckeSumme(true), 825.15, 1e-3);
const ibQuiz = JSON.stringify((quiz as { moduleId: string }[]).filter(q => q.moduleId === 'lca_ingenieurbau'));
gilt(ibQuiz.includes('863 t') && ibQuiz.includes('825 t'), 'LI: Quizwerte 863/825 t passen zum Simulator');
zeigt('DSB-LI-1', ingenieurbau.texte, 'gerundete Lehrwerte');

// ------------------------------------------------------------------------------------------------ lca_regulatorik
gilt(!JSON.stringify(innovationen).includes('2018-12'), 'DSB-LR-1: DIN 18945–18948 nicht mehr mit Ausgabe 2018-12');
zeigt('DSB-LR-1', innovationen.texte, 'DIN 18945:2024-03', 'DIN 18946:2024-03', 'DIN 18947:2024-03', 'DIN 18948:2024-03');
gilt(/vorläufig, Normprüfung ausstehend/.test(innovationen.texte.fürTragendesMauerwerkSind), 'DSB-LR-1: SFK-3-Aussage gekennzeichnet');

// ------------------------------------------------------------------------------------------------ Rückbau & Schadstoffe
// Umsetzung 30.10.2026 (DSB-SS-1): ungenutzte Doppelkopie in content/schadstoffe entfernt; einzige Quelle ist das Modul Bodenmaterial
gilt(!('TREATMENT_OPTIONS' in schadstoffe.daten) && !!boden.daten.TREATMENT_OPTIONS, 'DSB-SS-1: Behandlungsoptionen nur noch in boden_materialaufbereitung');
gilt(!JSON.stringify(boden).includes('ausnahmslos ILLEGAL'), 'DSB-BM-1: berichtigte Rechtsgrundlage Asbest');
zeigt('DSB-BM-2', boden.texte, 'Lehrwerte');
zeigt('DSB-RB-1', rueckbauDaten, 'DIN 1045-2:2023-08, Anhang E');
zeigt('DSB-AB-1', abfaelle.texte, 'DIN 1045-2:2023-08, Anhang E');
// Nachrechnungen
pruefe('RB Mindestquote', 3360 / (1200 * 2.4 + 300 * 1.6 + 60 * 0.5 + 40), 0.98, 1e-2);
pruefe('RB Mehrkosten', 3360 * (35 - 12) - 40000, 37280);
zeigt('RB', rueckbau.daten, '3430', '37\\\\,280');
pruefe('KD Verwertungsquote', (950 + 120) / 1200, 0.8917);
pruefe('KD MCI', 1 - ((0.6 + 0.2) / 2) * (0.9 / 2), 0.82);
zeigt('KD', kreislauf.daten, '0{,}82', '89\\\\,\\\\%');
pruefe('MP Recyclingquote', (300 * 0.9 + 20 * 0.95 + 5 * 0.6) / 327, 0.893, 1e-3);
zeigt('MP', materialpaesse.daten, '89{,}3', '0{,}55');

// ------------------------------------------------------------------------------------------------ Digitales
const bimStahl = (bim.daten.ARCHETYPES as { id: string; defaultGwp: number; defaultDensity: number }[]).find(a => a.id === 'stahl');
pruefe('DSB-BIM-1 Stahl-GWP je m³', bimStahl?.defaultGwp ?? NaN, (GWP_LEHRWERTE.profilstahl.gwp / 1000) * 7850);
const holz = (dpp.daten.DPP_MOCK_DATA as Record<string, { carbonFootprint: string }>)['uid-5678-holz'];
gilt(holz.carbonFootprint.startsWith(`−${Math.round(-0.8 * GWP_LEHRWERTE.bsh.gwp)} kg`), `DSB-DPP-1: DPP-BSH aus Lehrwert (${holz.carbonFootprint})`);

// ------------------------------------------------------------------------------------------------ Praxiswissen, Beispielrechnungen
gilt(!JSON.stringify(praxis).includes('1045-2:2008'), 'DSB-PP-1/DSB-PB-1: DIN 1045-2 in der Ausgabe 2023-08');
pruefe('PX w/z neu', 175 / 300, 0.5833);
pruefe('PX l_b,rqd', (12 / 4) * (435 / 2.7), 483.33);
gilt(/Neuausgabe 2026-05/.test(uWert.werte.dieDämmwirkungIstUnzureichend), 'DSB-UW-1: Hinweis auf DIN 4108-2:2026-05');
const uBei = (dEps: number) => 1 / (0.13 + 0.2 / 2.3 + dEps / 0.035 + 0.015 / 0.7 + 0.04);
gilt(uBei(0.14) <= 0.24 && uBei(0.13) > 0.24, 'UW: „mindestens 14 cm“ für U ≤ 0,24');

// rechnung_nachhaltigkeit: Bezugsgröße CaO = Zementmasse (DSB-RN-1); Voreinstellung 4 mm/√a, 50 a, 300 kg/m³, 65 %, 60 %
gilt(/bezogen auf den Zement/.test(rechnungNh.texte.anteilReaktivesCalciumoxidIm) && !/im Zementstein \(/.test(rechnungNh.texte.anteilReaktivesCalciumoxidIm), 'DSB-RN-1: CaO-Anteil auf den Zement bezogen');
pruefe('RN CO₂-Aufnahme je m²', 4 * Math.sqrt(50) / 1000 * 300 * 0.65 * 0.6 * (44.01 / 56.08), 2.5974);
pruefe('RN GWP-Vergleich Δ', 450 * 340 / 1000 * ZEMENT_GWP_KG['CEM I'] - 450 * 350 / 1000 * ZEMENT_GWP_KG['CEM III/B'], 60.795);

// ------------------------------------------------------------------------------------------------ Nachhaltigkeit Daten & Regeln
pruefe('NR CRREM 2026', 52 - 3.4 * 6, 31.6);
pruefe('NR Schnittjahr', 2020 + (52 - 20) / 3.4, 2029.41, 1e-4);
zeigt('DSB-NR-1', datenRegeln.texte, 'Lehrwerte', 'Primärkies'); // Umsetzung 30.10.2026 (DSB-NR-2): Herleitung statt 45 kg je t

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Durchsicht Tranche B 29.10.2026');
