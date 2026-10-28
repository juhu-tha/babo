// Modulprüfung Tranche 7 (28.10.2026): unabhängige Nachrechnungen der Bauprodukte- und Verkehrswegebau-Module
// (Befundliste docs/pruefung/module-tranche-7.md). Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung
// der Gleichungen in Python), nicht aus den Kernen oder vorhandenen Tests übernommen.
import { asphaltHohlraum, westergaardRand, betondeckenFugen, rigole, schienenTemperatur, spritzbetonRing } from '../src/calc/verkehrswegebau';
import { fkEmpfehlungEN, fdAusFk } from '../src/calc/mauerwerk';
import verkehr from '../content/bpverkehrswegebau/BpVerkehrswegebau.json';
import rsto from '../content/bpverkehrswegebau/RstoRechnerTab.json';
import recht from '../content/bprechtliches/BpRechtliches.json';
import innovationen from '../content/bpinnovationen/BpInnovationen.json';
import fertigteile from '../content/bpbetonfertigteile/BpBetonfertigteile.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 7 (Nachrechnungen) ---');

// 1. Labor-Prüfmethoden: Rohdichte und Hohlraumgehalt (ρ_m = 100/(Σ M_i/ρ_i), V = (1 − ρ_A/ρ_m)·100)
const pr1 = asphaltHohlraum({ gesteinAnteil: 94.5, bitumenAnteil: 5.5, rhoGestein: 2.68, rhoBitumen: 1.02, raumdichteMischung: 2.41 });
pruefe('PR1 ρ_m', pr1.maxDichte, 2.45982); pruefe('PR1 V', pr1.hohlraum, 2.02542); gilt(pr1.ok, 'PR1 im Lehrbereich');
const pr2 = asphaltHohlraum({ gesteinAnteil: 95, bitumenAnteil: 5, rhoGestein: 2.70, rhoBitumen: 1.02, raumdichteMischung: 2.40 });
pruefe('PR2 ρ_m', pr2.maxDichte, 2.49457); pruefe('PR2 V', pr2.hohlraum, 3.79085);
const pr3 = asphaltHohlraum({ gesteinAnteil: 93, bitumenAnteil: 7, rhoGestein: 2.65, rhoBitumen: 1.03, raumdichteMischung: 2.39 });
pruefe('PR3 ρ_m', pr3.maxDichte, 2.38718); gilt(!pr3.gueltig && pr3.hohlraum < 0, 'PR3 Raumdichte > Rohdichte → Fehler');

// 2. Betondecken: Westergaard-Randspannung mit Ersatzradius b (ν = 0,15, E = 34 000 N/mm², p = 0,8 N/mm²)
const wg1 = westergaardRand({ dickeCm: 26, achslastKn: 120, bettungMNm3: 80 });
pruefe('WG1 l', wg1.lMm, 893.311); pruefe('WG1 a', wg1.rMm, 154.51); pruefe('WG1 b', wg1.bMm, 149.765);
pruefe('WG1 σ_e', wg1.sigmaE, 1.75731); pruefe('WG1 σ_i', wg1.sigmaInnen, 1.16996); pruefe('WG1 σ_c', wg1.sigmaEcke, 1.51877); gilt(wg1.ok, 'WG1 ≤ 2,25');
const wg2 = westergaardRand({ dickeCm: 18, achslastKn: 100, bettungMNm3: 30 });
pruefe('WG2 σ_e', wg2.sigmaE, 3.20284); gilt(!wg2.ok, 'WG2 > 2,25 N/mm²');
const wg3 = westergaardRand({ dickeCm: 30, achslastKn: 180, bettungMNm3: 120 });
pruefe('WG3 l', wg3.lMm, 898.651); pruefe('WG3 σ_e', wg3.sigmaE, 1.796);
pruefe('FU1 L_max h = 18 cm', betondeckenFugen(5.0, 18).maxAbstandM, 4.5); gilt(!betondeckenFugen(5.0, 18).ok, 'FU1 5,0 m > 4,5 m');
pruefe('FU2 L_max h = 26 cm', betondeckenFugen(5.0, 26).maxAbstandM, 5.0);

// 3. Tiefbau: Rigole – seit 28.10. (Entscheidung DWA-A 138-1) vereinfachtes Verfahren DWA-A 138-1:2024-10:
//    k_i = f_Ort·f_Methode·k_f = 0,5·0,8·10⁻⁵ = 4·10⁻⁶ m/s, L = (A_u·10⁻⁷·r − 2·b·h_w·k_i)/(b·h·s_R/(D·60·f_Z) + (b + 2h_w)·k_i),
//    b × h = 1,2 × 0,6 m, h_w = 0,3 m, f_Z = 1,2 (vorher Ansatz 2005: k_f/2 über eine geschätzte Sohle, f_Z = 1,1; RI1 7,98 m³)
//    RI1: Zähler 7,668·10⁻³ − 2,88·10⁻⁶; Nenner 6,33333·10⁻⁴ + 7,2·10⁻⁶ → L = 11,9668 m; V_R = 8,6161 m³; 35 Boxen
const ri1 = rigole({ flaecheM2: 355, psi: 0.9, regenspende: 240, dauerMin: 15, speicherKoeff: 0.95 });
pruefe('RI1 Q_zu', ri1.qZu, 7.668); pruefe('RI1 V_zu', ri1.vZu, 6.9012);
pruefe('RI1 V_R', ri1.vRigole, 8.6161); pruefe('RI1 L', ri1.laengeM, 11.9668); gilt(ri1.boxen === 35, 'RI1 35 Boxen');
//    RI2: A_u = 350 m², r = 150, D = 30 min, Kies s_R = 0,3: Zähler 5,25·10⁻³ − 2,88·10⁻⁶ = 5,24712·10⁻³; Nenner 1,0·10⁻⁴ + 7,2·10⁻⁶
//         → L = 48,947 m; V_R = 35,242 m³; V_nutz = 10,573 m³; 45 Boxen
const ri2 = rigole({ flaecheM2: 500, psi: 0.7, regenspende: 150, dauerMin: 30, speicherKoeff: 0.3 });
pruefe('RI2 L', ri2.laengeM, 48.947); pruefe('RI2 V_R', ri2.vRigole, 35.242); pruefe('RI2 V_nutz', ri2.vNutz, 10.573); gilt(ri2.boxen === 45, 'RI2 45 Boxen');
//    RI3 (Randfall): A_u = 3 m², r = 50, 5 min: Zähler 1,5·10⁻⁵ − 2,88·10⁻⁶ = 1,212·10⁻⁵; Nenner 1,9·10⁻³ + 7,2·10⁻⁶ → L = 0,006355 m
const ri3 = rigole({ flaecheM2: 10, psi: 0.3, regenspende: 50, dauerMin: 5, speicherKoeff: 0.95 });
pruefe('RI3 L (Randfall)', ri3.laengeM, 0.0063549);

// 4. Bahnbau: σ_T = E·α_T·ΔT, F = σ_T·A (A = 7686 mm², UIC 60)
const gl1 = schienenTemperatur(55, 20, 'schotter_gut');
pruefe('GL1 σ_T', gl1.sigmaT, 88.2); pruefe('GL1 F', gl1.kraftSchieneKn, 677.905); gilt(gl1.status === 'unkritisch', 'GL1 unkritisch (88,2 < 0,7 · 135 = 94,5)');
const gl2 = schienenTemperatur(-20, 20, 'schotter_gut');
pruefe('GL2 σ_T', gl2.sigmaT, -100.8); gilt(gl2.status === 'zug', 'GL2 Zug');
const gl3 = schienenTemperatur(45, 20, 'schotter_mager');
pruefe('GL3 F', gl3.kraftSchieneKn, 484.218); gilt(gl3.status === 'erhoeht', 'GL3 63 ≥ 0,7 · 90');

// 5. Tunnelbau: Kesselformel σ = p·R/d, f_cd = 0,85·f_ck/1,5
const tu1 = spritzbetonRing(4.5, 0.15, 15, 25);
pruefe('TU1 σ', tu1.sigmaRing, 4.5); pruefe('TU1 f_cd', tu1.fcd, 14.1667); pruefe('TU1 η', tu1.ausnutzung, 31.7647);
pruefe('TU2 η', spritzbetonRing(6.0, 0.30, 20, 30).ausnutzung, 52.9412);
gilt(spritzbetonRing(3.0, 0.05, 5, 20).hinweise.length >= 1, 'TU3 Lehrmodell-Hinweis');

// 6. Mauerwerk (Bauprodukte): Anwendungsbeispiel KS-Innenwand, EC6 Gl. (3.1)
const fk = fkEmpfehlungEN(0.55, 20, 10, 'NM', false);
pruefe('MW1 f_k', fk, 8.93478); pruefe('MW1 f_d', fdAusFk(fk), 5.06304); pruefe('MW1 n_Rd', 0.8 * 175 * fdAusFk(fk), 708.826);
pruefe('MW2 f_k KS DM', fkEmpfehlungEN(0.80, 20, 0, 'DM', false), 10.2086);

// 7. Inhaltskorrekturen dieser Prüfung (T7-RS-1, T7-RG-1, T7-AV-1, T7-IN-1, T7-BF-1)
const formelB = verkehr.daten['BpVerkehrswegebau.formeln'][0].formel;
gilt(formelB.includes('DTA^{(SV)}') && formelB.includes('q_{Bm}') && formelB.includes('f_z') && formelB.startsWith('B = N'), 'T7-RS-1 B-Formel nach RStO 12/24');
gilt(!rsto.texte.nMittlereTäglicheLkw.includes('Spurbreitenfaktor'), 'T7-RS-1 Faktorenerläuterung');
gilt(recht.texte.rechtsstandSeit0801.includes('08.01.2040') && recht.texte.rechtsstandSeit0801.includes('09.01.2031'), 'T7-RG-1 Übergangsfristen');
gilt(recht.texte.bewertungDerUmweltUnd.includes('Validierung'), 'T7-AV-1 System 3+ validiert');
gilt(!JSON.stringify(innovationen).includes('DIN 1045-100'), 'T7-IN-1 kein „DIN 1045-100“');
gilt(JSON.stringify(fertigteile).includes('DIN 1045-40:2023-08'), 'T7-BF-1 DIN 1045-40');

// 8. Übungsaufgabe RStO (eigene Rechnung): B = 30 · 7200 · 0,33 · f_z · 365 mit f_z(1 %, 30 a) = 1,1595 → 30,2 Mio. → Bk32
const fz = (Math.pow(1.01, 30) - 1) / (0.01 * 30);
pruefe('RS2 f_z', fz, 1.1595); pruefe('RS2 B', 30 * 7200 * 0.33 * fz * 365, 30166800, 1e-3);
const fz2 = (Math.pow(1.02, 30) - 1) / (0.02 * 30);
pruefe('RS1 B (Mittelfranken St 2245)', 30 * 1300 * 4 * 0.25 * 0.45 * 1.10 * 1.05 * fz2 * 365, 1.0005e7, 1e-3);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 7');
