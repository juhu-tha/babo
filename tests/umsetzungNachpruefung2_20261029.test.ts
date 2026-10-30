// Umsetzung der Entscheidungen zur Nachprüfung 2 (29.10.2026, docs/pruefung/nachpruefung2-2026-10-29.md, Abschnitt
// „Umsetzung 29.10.2026“). Sollwerte von Hand nachgerechnet (Rechenweg in den Kommentaren), nicht aus den Kernen übernommen.
import fs from 'fs';
import { GWP_LEHRWERTE, LEHRBETON_C2530, lehrbetonGwp } from '../src/data/gwpLehrwerte';
import { ZEMENT_GWP } from '../src/calc/materialoptimierung';
import { einsparanteilProfil, co2VorteilProfil, GWP_PROFILSTAHL_KG } from '../src/calc/stahlbau';
import { lpFestigkeitsverlust, LP_FESTIGKEITSVERLUST_JE_PROZENT } from '../src/calc/mischung';
import { bspSchwingung, BSP_KENNWERTSAETZE, BSP_AUFBAUTEN } from '../src/calc/bspSchwingung';
import { MATERIAL_DATABASE } from '../src/modules/interactivelcacalc/daten';
import stahlsorten from '../content/stahl/Stahlsorten.json';
import bautagebuch from '../content/bautagebuch/Bautagebuch.json';
import farbenDaten from '../content/bpfarbenlacke/daten.json';
import farben from '../content/bpfarbenlacke/BpFarbenLacke.json';
import onlineTools from '../content/onlinetools/OnlineTools.json';
import mischEingaben from '../content/mischungsberechnung/MischungEingaben.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const lca = (id: string) => MATERIAL_DATABASE.find(m => m.id === id);

console.log('--- Test: Umsetzung Nachprüfung 2 (29.10.2026) ---');

// NP2-ST-2: Profilstahl zentral (1,1 kg CO₂-Äq./kg), Stahl-Modul und LCA-Rechner lesen daraus
pruefe('ST-2 Lehrwert Profilstahl', GWP_LEHRWERTE.profilstahl.gwp, 1100);
gilt(GWP_LEHRWERTE.profilstahl.vorlaeufig, 'ST-2 Profilstahl als vorläufig gekennzeichnet');
pruefe('ST-2 LCA-Rechner Baustahl', lca('baustahl')?.gwpA1A3 ?? NaN, 1100);
pruefe('ST-2 GWP je kg', GWP_PROFILSTAHL_KG, 1.1);
pruefe('ST-2 Einsparanteil IPE 300 → IPE 200', einsparanteilProfil(42.2, 22.4), 1 - 22.4 / 42.2); // 0,4692
pruefe('ST-2 Vorteil IPE 300 je m', co2VorteilProfil(42.2, einsparanteilProfil(42.2, 22.4)), 21.78); // 42,2 · 0,4692 · 1,1 = 21,78
gilt(!/1,8 kg/.test(stahlsorten.texte.vermeideteCoEmissionenDurch), 'ST-2 kein fester Wert 1,8 kg CO₂/kg mehr im Stahl-Modul');
gilt(!/\* 1\.8\)|\* 0\.45\)/.test(fs.readFileSync('src/modules/stahl/Stahlsorten.tsx', 'utf8')), 'ST-2 keine fest verdrahteten Faktoren 1,8 und 0,45');

// NP2-LC-1: zementgebundene Lehrbetone aus Zementgehalt · ZEMENT_GWP_KG + Rest
pruefe('LC-1 C25/30 CEM I', GWP_LEHRWERTE.betonC2530CemI.gwp, 245);         // 300 · 0,665 + 45 = 244,5 → 245
pruefe('LC-1 C25/30 CEM II/C-M', GWP_LEHRWERTE.betonC2530CemIICM.gwp, 165); // 300 · 0,40 + 45
pruefe('LC-1 C25/30 CEM III/A', GWP_LEHRWERTE.betonCemIIIA.gwp, 165);       // 300 · 0,40 + 45
pruefe('LC-1 C30/37 CEM III/A', GWP_LEHRWERTE.betonC3037CemIII.gwp, 173);   // 320 · 0,40 + 45 (Rest einheitlich seit 30.10.2026)
pruefe('LC-1 C30/37 CEM I', GWP_LEHRWERTE.betonC3037CemI.gwp, 258);         // 320 · 0,665 + 45 = 257,8
pruefe('LC-1 C25/30 CEM II/A (Plausibilität ÖKOBAUDAT 221,7)', lehrbetonGwp(LEHRBETON_C2530, 'CEM II/A'), 225);
pruefe('LC-1 Materialoptimierung = QNG-Tabelle', ZEMENT_GWP.cem3_a, GWP_LEHRWERTE.betonC3037CemIII.gwp);
pruefe('LC-1 LCA-Rechner CEM III/A', lca('beton-cem3')?.gwpA1A3 ?? NaN, 165);
gilt(/rund 33 %\.$/.test(lca('beton-cem3')?.description ?? ''), `LC-1 Minderung aus den Werten (rund 33 %): ${lca('beton-cem3')?.description}`);

// Luftporen: einheitlich 5 % je Vol.-% LP
pruefe('LP Faustregel', LP_FESTIGKEITSVERLUST_JE_PROZENT, 5);
pruefe('LP 6 % Luft', lpFestigkeitsverlust(6), 22.5); // (6 − 1,5) · 5 %
pruefe('LP ohne Zusatzluft', lpFestigkeitsverlust(1.5), 0);
gilt(/rund 4–5 %/.test(mischEingaben.texte.jedesVolLuftporenKostet) && /5 %/.test(mischEingaben.texte.jedesVolLuftporenKostet) && !/MPa/.test(mischEingaben.texte.jedesVolLuftporenKostet), 'LP Text in % je % LP');

// BSP-Schwingung: Kennwertsatz wie Quiz wählbar, Standard unverändert
pruefe('BSP Lehrbeispiel Masse', (BSP_KENNWERTSAETZE.lehrbeispiel.wichte * 1000) / 9.81, 450);
pruefe('BSP Lehrbeispiel E', BSP_KENNWERTSAETZE.lehrbeispiel.E0mean, 11000);
const basis = { spannweite: 5, lagen: BSP_AUFBAUTEN.l5_150.lagen, deckenbreite: 5, zusatzmasse: 150, estrichDicke: 0, estrichArt: 'zement' as const, verfahren: 'netto' as const };
const std = bspSchwingung(basis), pro = bspSchwingung({ ...basis, ...BSP_KENNWERTSAETZE.proHolz });
pruefe('BSP Standard = proHolz', pro.f1, std.f1, 1e-9);
const lehr = bspSchwingung({ ...basis, ...BSP_KENNWERTSAETZE.lehrbeispiel });
pruefe('BSP Lehrbeispiel Eigenmasse', lehr.eigenmasse, 450 * 0.15); // 67,5 kg/m²
// f₁ ∝ √(E/m): Verhältnis aus Hand: √(11 000/11 550 · (84,1 + 150)/(67,5 + 150))
pruefe('BSP Verhältnis f₁', lehr.f1 / std.f1, Math.sqrt((11000 / 11550) * ((5.5 * 150 / 9.81 + 150) / (67.5 + 150))));

// Bautagebuch-Lernprojekte ohne reale Orte und Stellen
const projekte = JSON.stringify(bautagebuch.daten.PROJECTS);
gilt(!/Augsburg|Brunnenlech|Staatliches Bauamt|GmbH|An der Hochschule/.test(projekte), 'Bautagebuch: Lernprojekte neutral');

// GISCODE nach Einstufungskatalog 07/2024 (BSL25 nicht mehr enthalten)
gilt(!/BSL25/.test(JSON.stringify(farbenDaten)) && !/\*\*BSL25/.test(JSON.stringify(farben)), "GISCODE: BSL25 nicht mehr als Code geführt");
gilt(/konservierungsmittelarm/.test(JSON.stringify(farbenDaten)), 'GISCODE: BSW10 wie Katalog');

// Zahlformat membranen_etfe, doppelte Fußzeile LCA, Kennzeichnung NP2-OT-1
gilt(!/\d\.\d{3} N\/5 cm/.test(fs.readFileSync('content/membranenetfe/MembranenETFE.json', 'utf8')), 'ETFE: kein Punkt als Tausendertrennung');
gilt(!/<ModuleFooter/.test(fs.readFileSync('src/modules/LCA.tsx', 'utf8')), 'LCA Grundlagen: nur die modulweite Fußzeile');
gilt(/openlca/.test(fs.readFileSync('content/oekobilanzlca/OekobilanzLCA.json', 'utf8')), 'LCA: Inhalte der Teil-Fußzeile übernommen');
gilt(/L\/250 vorläufig, Normprüfung ausstehend/.test(JSON.stringify(onlineTools)), 'OT-1 L/250 gekennzeichnet');

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log('OK: Umsetzung Nachprüfung 2');
