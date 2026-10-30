// Umsetzung der Entscheidungen 30.10.2026 zur gezielten Durchsicht A–D (docs/pruefung/durchsicht-{A,B,C,D}-2026-10-29.md,
// Abschnitte „Umsetzung 30.10.2026“). Sollwerte von Hand nachgerechnet (Rechenweg in den Kommentaren).
import fs from 'fs';
import {
  GWP_LEHRWERTE, LEHRBETON_C2530, LEHRBETON_C3037, LEHRBETON_REST, lehrbetonGwp, gwpJeKg, daemmstoffGwpJeM3,
  PROFILSTAHL_EPD_ELEKTROSTAHL, PROFILSTAHL_HINWEIS, BSH_LEHR_ROHDICHTE,
} from '../src/data/gwpLehrwerte';
import { ZEMENT_GWP_KG } from '../src/data/zementGwp';
import { LAMBDA_ALUMINIUM } from '../src/data/kennwerte';
import { biogenesCo2DinEn16449 } from '../src/calc/holzphysik';
import { LP_FESTIGKEITSVERLUST_JE_PROZENT } from '../src/calc/mischung';
import { getMassgebendeAnforderung } from '../src/data/standards/din1045_2';
import { A4_FAKTOR_EINZEL } from '../src/calc/lca';
import { LCA_BENCHMARKS } from '../src/modules/lca/transportbetonKennwerte';
import { EPD_DATABASE } from '../src/modules/nachhaltigkeit/daten';
import { MATERIAL_DATABASE } from '../src/modules/interactivelcacalc/daten';
import materials from '../src/data/materials.json';
import metalle from '../content/metalle/Metalle.json';
import bpMetallisch from '../content/bpmetallisch/BpMetallisch.json';
import zusatzmittel from '../content/bpbetonzusatzmittel/BpBetonzusatzmittel.json';
import modernisierung from '../content/modernisierung/Modernisierung.json';
import bestand from '../content/bestand/Bestand.json';
import histBauprodukte from '../content/historischebauprodukte/HistorischeBauprodukte.json';
import histBauweisen from '../content/historischebauweisen/HistorischeBauweisen.json';
import tbUebung from '../content/lca/TransportbetonLcaUebung.json';
import bezugseinheit from '../content/lca/Bezugseinheit.json';
import lcaJson from '../content/lca/LCA.json';
import dpp from '../content/dppepd/DppEpd.json';
import praxis from '../content/nachhaltigkeit/PraxisInnovationen.json';
import ndr from '../content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json';
import ingenieurbau from '../content/lca/IngenieurbauLCA.json';
import schadstoffe from '../content/schadstoffe/Schadstoffe.json';
import exposition from '../content/expositionsklassen/Expositionsklassen.json';
import betondecken from '../content/bpverkehrswegebau/BetondeckenTab.json';
import statistik from '../content/statistik/Statistik.json';
import baustoffkunde from '../content/baustoffkunde/Baustoffkunde.json';
import anhangPraxis from '../content/nachhaltigkeit/AnhangPraxisbeispiele.json';
import materialdatenbanken from '../content/materialdatenbanken/Materialdatenbanken.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const text = (o: unknown) => JSON.stringify(o);
const VORL = /vorläufig, Normprüfung ausstehend/;

console.log('--- Test: Umsetzung Durchsicht A–D (30.10.2026) ---');

// DSC-BZ-2: LP-Festigkeitsverlust Spanne 4–5 % je Vol.-%, Rechenwert 5 %; 5 % · 40 N/mm² = 2 N/mm²
pruefe('BZ-2 Rechenwert', LP_FESTIGKEITSVERLUST_JE_PROZENT, 5);
gilt(/rund 4–5 %/.test(text(zusatzmittel)) && /2 N\/mm²/.test(text(zusatzmittel)), 'BZ-2 Betonzusatzmittel nennt 4–5 % und 2 N/mm²');
const quiz = JSON.parse(fs.readFileSync('src/data/quiz.json', 'utf8')) as { id: string; explanation: string; distraktorFeedback: string[]; verified: boolean }[];
const fb4 = quiz.find(q => q.id === 'qn_frischbeton_4')!;
gilt(!/3–5 N\/mm²/.test(fb4.explanation + text(fb4.distraktorFeedback)) && /4–5 %/.test(fb4.explanation) && !fb4.verified, 'BZ-2 Quiz qn_frischbeton_4 angeglichen');

// DSC-DM-2: Wand d = 0,035 · (1/0,24 − 1/1,20) = 0,1167 m … 0,035 · (1/0,24 − 1/1,80) = 0,1264 m → 12–14 cm
pruefe('DM-2 Wand U₀ 1,20', 0.035 * (1 / 0.24 - 1 / 1.2), 0.11667);
pruefe('DM-2 Wand U₀ 1,80', 0.035 * (1 / 0.24 - 1 / 1.8), 0.12639);
const tsxMod = fs.readFileSync('src/modules/Modernisierung.tsx', 'utf8');
gilt(tsxMod.indexOf('t1214CmWlg') < tsxMod.indexOf('t1416CmWlg'), 'DM-2 Wand 12–14 vor Dach 14–16 in der Tabelle');
gilt(/zwischen Sparren/.test(modernisierung.texte.t1416CmWlg) && /0,117 m/.test(modernisierung.texte.daemmdickeHerleitung), 'DM-2 Herleitung im Modul');

// DSC-ME-1: λ Aluminium 160 W/(mK) nach DIN EN ISO 10456 in allen Vorkommen
pruefe('ME-1 Konstante', LAMBDA_ALUMINIUM, 160);
pruefe('ME-1 materials.json', materials.materials.find((m: { id: string }) => m.id === 'aluminium')!.properties.thermalCond, LAMBDA_ALUMINIUM);
pruefe('ME-1 Metalle', metalle.daten.METALS_DATA.find(m => m.name === 'Aluminium')!.thermalConductivity, LAMBDA_ALUMINIUM);
gilt(!/220 W/.test(text(bpMetallisch)) && /160 W\/\(m·K\)/.test(text(bpMetallisch)), 'ME-1 Bauprodukte metallisch 160 statt 220');

// DSC-HP-1, DSC-HB-1
gilt(/historische Handels- und Zulassungsbezeichnung/.test(histBauprodukte.werte.erreichtHoheStreckgrenzenVon), 'HP-1 Torstahl historisch');
gilt(/Lehrwert ohne Normbeleg/.test(text(histBauweisen)) && /SIGMA_ZUL_ZUGBAND_LEHRWERT = 120/.test(fs.readFileSync('src/modules/HistorischeBauweisen.tsx', 'utf8')), 'HB-1 σ_zul als Lehrwert');

// DSC-BE-1: Calciumsilikat λ = 0,065 (Baunetz Wissen) in Auswahl und Beispiel; U = 1/(1/1,5 + 0,06/0,065) = 0,629
gilt(/value=\{0\.065\}>λ = 0,065 \(Calciumsilikat/.test(fs.readFileSync('src/modules/Bestand.tsx', 'utf8')), 'BE-1 Auswahl 0,065');
gilt(/0,065 W\/\(mK\) nach Baunetz Wissen/.test(text(bestand)) && /0\{,\}63/.test(text(bestand)), 'BE-1 Beispiel mit 0,065');
pruefe('BE-1 U_neu', 1 / (1 / 1.5 + 0.06 / 0.065), 0.629);

// DSB-LC-9: w/z-Grenze der Fallstudie XC4/XD1/XF1 → XD1 0,55
pruefe('LC-9 maßgebend', getMassgebendeAnforderung(['XC4', 'XD1', 'XF1']).maxWz ?? NaN, 0.55);
gilt(/0,55/.test(tbUebung.werte.normkonform050) && /WZ_GRENZE_FALLSTUDIE/.test(fs.readFileSync('src/modules/lca/TransportbetonLcaUebung.tsx', 'utf8')), 'LC-9 Übung an XD1 gekoppelt');

// DSB-LC-10: EPS 3,25, Mineralwolle 1,20 kg/kg zentral
pruefe('LC-10 EPS je kg', gwpJeKg('eps').fossil, 3.25);
pruefe('LC-10 Mineralwolle je kg', gwpJeKg('mineralwolle').fossil, 1.2);
pruefe('LC-10 Wand EPS', EPD_DATABASE.eps_styropor.gwp_fossil_a1a3, 3.25);
pruefe('LC-10 Wand Glaswolle', EPD_DATABASE.mineral_wool.gwp_fossil_a1a3, 1.2);
pruefe('LC-10 LCA-Rechner EPS (3,25 · 20)', MATERIAL_DATABASE.find(m => m.id === 'eps-daemmung')!.gwpA1A3, 65);
pruefe('LC-10 EPD-Muster Glaswolle (1,2 · 50)', lcaJson.daten.REFERENZEN_EPD.find(e => e.id === 'mineralwolle-glass')!.gwp_total, daemmstoffGwpJeM3('mineralwolle', 50));
pruefe('LC-10 EPD-Muster EPS (3,25 · 20)', lcaJson.daten.REFERENZEN_EPD.find(e => e.id === 'eps-polystyrol')!.gwp_total, daemmstoffGwpJeM3('eps', 20));
gilt(/3,25 \+ 2,5/.test(bezugseinheit.texte.umrechnungBeispiel) && /84,2/.test(bezugseinheit.texte.umrechnungBeispiel), 'LC-10 Bezugseinheit mit 3,25 (84,2 kg/m²)');
gilt(/3\{,\}25 = 9\{,\}10/.test(text(materialdatenbanken)), 'LC-10 Materialdatenbanken EPS 3,25');
pruefe('LC-10 Bezugseinheit Summe', 0.2 * 260 + 0.14 * 20 * (3.25 + 2.5) * 2, 84.2);

// DSB-LI-2, DSB-SS-1
gilt(/lfloor T\/\\\\text\{ND\} \\\\rfloor/.test(text(ingenieurbau.texte.vergleichSpannbetonHohlkastenVs)), 'LI-2 Zählweise im Simulator benannt');
gilt(!('TREATMENT_OPTIONS' in schadstoffe.daten), 'SS-1 Doppelkopie entfernt');
gilt(!/TREATMENT_OPTIONS/.test(fs.readFileSync('src/modules/Schadstoffe.tsx', 'utf8')), 'SS-1 Konstante im Modul entfernt');

// DSB-LR-2: 44/12 · 0,5 · 500 · 1800/1,12 = 1473 t → rund 1500 t, temporär
pruefe('LR-2 DIN EN 16449', biogenesCo2DinEn16449(500, 12, 1800) / 1000, 1473.2);
gilt(/\{co2Speicher\} t CO₂/.test(praxis.texte.erstesHolzHybridBürogebäude) && /temporär/.test(praxis.texte.erstesHolzHybridBürogebäude) && !/dauerhaft/.test(praxis.texte.erstesHolzHybridBürogebäude), 'LR-2 Text temporär, Wert gerechnet');

// DSB-NR-2: 3,5 + 0,101 · 25 = 6,0 kg/t
pruefe('NR-2 vermieden je t', LCA_BENCHMARKS.gwp_aggregate_natural * 1000 + A4_FAKTOR_EINZEL['lkw-heavy'] * 25, 6.025);
gilt(!/45 kg/.test(ndr.texte.vermiedeneTransporteAbbau) && /\{summe\}/.test(ndr.texte.vermiedeneTransporteAbbau), 'NR-2 Herleitung statt 45 kg/t');

// DSB-RU-1: BSH biogen nach DIN EN 16449: 44/12 · 0,5 · 480/1,12 = 785,7 → −790; GWP −790 + 110 = −680; DPP 0,8 · −680 = −544
pruefe('RU-1 Formel 480', biogenesCo2DinEn16449(BSH_LEHR_ROHDICHTE), 785.71);
pruefe('RU-1 Formel KVH 500', biogenesCo2DinEn16449(500), 818.45);
pruefe('RU-1 BSH biogen', GWP_LEHRWERTE.bsh.biogen, -790);
pruefe('RU-1 BSH gesamt', GWP_LEHRWERTE.bsh.gwp, -680);
pruefe('RU-1 KVH unverändert', GWP_LEHRWERTE.kvh.biogen, -820);
const holzDpp = (dpp.daten.DPP_MOCK_DATA as Record<string, { carbonFootprint: string }>)['uid-5678-holz'];
gilt(holzDpp.carbonFootprint.startsWith('−544 kg'), 'RU-1 DPP −544 (0,8 · −680)');
gilt(dpp.daten.EPD_DATA.find((e: { id: string }) => e.id === 'holz')!.phasen.c3.gwp === -GWP_LEHRWERTE.bsh.biogen + 10, 'RU-1 Muster-EPD C3 = biogen + 10');

// DSA-X-1: k_s = 1,0 nach NA DE
gilt(!/k_s = 2\{,\}0 \\\\text\{ \(für/.test(text(exposition)) && /k_s = 1,0 unabhängig vom w\/z-Wert/.test(text(exposition)), 'X-1 k_s = 1,0 (NA DE), EN-Wert als Hinweis');

// Lehrbeton-Rest einheitlich 45: C30/37 CEM I 320 · 0,665 + 45 = 257,8 → 258; CEM III/A 128 + 45 = 173
pruefe('Lehrbeton Rest', LEHRBETON_REST, 45);
gilt(LEHRBETON_C2530.rest === LEHRBETON_C3037.rest, 'Lehrbeton gleicher Rest');
pruefe('Lehrbeton C30/37 CEM I', lehrbetonGwp(LEHRBETON_C3037, 'CEM I'), Math.round(320 * ZEMENT_GWP_KG['CEM I'] + 45));
pruefe('Lehrbeton C30/37 CEM III/A', GWP_LEHRWERTE.betonC3037CemIII.gwp, 173);
pruefe('Lehrbeton C25/30 CEM I unverändert', GWP_LEHRWERTE.betonC2530CemI.gwp, 245);

// Hinweise: Betondecken 27 cm nach RStO, statistik DIN EN 1990-1:2026-12
gilt(/27 cm \(RStO/.test(betondecken.texte.autobahnBk1002830), 'Hinweis Betondecken 27 cm');
gilt(/DIN EN 1990-1:2026-12/.test(text(statistik)), 'Hinweis statistik DIN EN 1990-1');

// Profilstahl: Vergleichswert 0,56 überall neben dem Lehrwert
pruefe('Profilstahl EPD-Vergleichswert', PROFILSTAHL_EPD_ELEKTROSTAHL, 0.56);
gilt(/0,56 kg CO₂e\/kg als Vergleichswert/.test(PROFILSTAHL_HINWEIS), 'Profilstahl Hinweistext');
for (const f of ['src/modules/stahl/Stahlsorten.tsx', 'src/modules/BimBaustoffe.tsx', 'src/modules/InteractiveLCACalc.tsx', 'src/modules/interactivelcacalc/daten.ts']) {
  gilt(fs.readFileSync(f, 'utf8').includes('PROFILSTAHL_HINWEIS'), `Profilstahl-Hinweis in ${f}`);
}

// Normtext-Kennzeichnungen
gilt(VORL.test(text(baustoffkunde)), 'DSC-BK-1 gekennzeichnet');
gilt(VORL.test(text(anhangPraxis.texte.endenergieStromHeizungWarmwasser)), 'DSB-LC-12 gekennzeichnet');

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log('OK: Umsetzung Durchsicht A–D');
