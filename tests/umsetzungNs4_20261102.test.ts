// Umsetzung 02.11.2026: Entscheidungen zu den offenen Fragen der Nachstichprobe 4 (docs/pruefung/nachstichprobe4-2026-11-02.md,
// Abschnitt „Umsetzung 02.11.2026“) und BIM-Holz-Voreinstellung 480 kg/m³.
// Der Steildach-U-Wert wird hier unabhängig vom Modul nach DIN EN ISO 6946 (oberer/unterer Grenzwert) nachgerechnet.
import quiz from '../src/data/quiz.json';
import { dataholzConstructions } from '../src/modules/holzbaubeta/daten';
import { LAMBDA_ALUMINIUM } from '../src/data/kennwerte';
import { GWP_LEHRWERTE, BSH_LEHR_ROHDICHTE, gwpJeKg } from '../src/data/gwpLehrwerte';
import { gwpRegler, liegtAufRaster } from '../src/modules/bimbaustoffe/gwpRegler';
import metallisch from '../content/bpmetallisch/BpMetallisch.json';
import bim from '../content/bimbaustoffe/BimBaustoffe.json';
import { readFileSync } from 'node:fs';

const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;

console.log('--- Test: Umsetzung NS4 (02.11.2026) ---');

type Frage = { id: string; question: string; explanation: string; verified: boolean; reviewer?: string; gapAnalysis?: { coreRule?: string };
  vorpruefung?: { am: string; ergebnis: string; hinweis?: string } };
const fragen = quiz as unknown as Frage[];
const frage = (id: string) => fragen.find(q => q.id === id)!;
const korrigiert = (q: Frage, kennung: string) => !q.verified && !q.reviewer && q.vorpruefung?.ergebnis === 'korrigiert'
  && /Umsetzung 02\.11\.: .*– korrigiert/.test(q.vorpruefung.hinweis ?? '') && q.vorpruefung.hinweis!.includes(kennung);

// NS4-VDI-2: CC3 nach Modultext, keine „Hallen mit großen Stützweiten“ als CC3
const vdi = frage('q_vdi_1');
gilt(korrigiert(vdi, 'NS4-VDI-2'), 'NS4-VDI-2: q_vdi_1 nicht als korrigiert vermerkt');
gilt(/mehr als 5000 Personen/.test(vdi.explanation) && /besonders fachkundige Person/.test(vdi.explanation) && !/Stützweiten \(CC3\)/.test(vdi.explanation),
  'NS4-VDI-2: Erklärung nicht nach Modultext');
gilt(!/Hallen > 12/.test(vdi.gapAnalysis?.coreRule ?? '') && /Sporthallen/.test(vdi.gapAnalysis?.coreRule ?? ''), 'NS4-VDI-2: Lernhilfe ordnet Hallen noch CC3 zu');

// NS4-BP-2: K = 0,276 → normales Zusammenhaltevermögen (0,27 < K ≤ 0,31)
const bp = frage('q_bpx_5');
gilt(korrigiert(bp, 'NS4-BP-2'), 'NS4-BP-2: q_bpx_5 nicht als korrigiert vermerkt');
gilt(/normales Zusammenhaltevermögen/.test(bp.explanation) && !/geringes Bluten/.test(bp.explanation), 'NS4-BP-2: Einordnung K = 0,276');
gilt(nahe((175 - 70) / 380, 0.276, 5e-4) && (175 - 70) / 380 > 0.27 && (175 - 70) / 380 <= 0.31, 'NS4-BP-2: K liegt nicht im Bereich „normal“');

// NS4-RS-1: μ_lim = 0,8 · 0,45 · (1 − 0,4 · 0,45) = 0,2952
const rs = frage('qn_rechnung_stahlbeton_4');
const muLim = 0.8 * 0.45 * (1 - 0.4 * 0.45);
gilt(nahe(muLim, 0.2952, 1e-4), 'NS4-RS-1: μ_lim nachgerechnet');
gilt(korrigiert(rs, 'NS4-RS-1') && /0,295\b/.test(rs.question) && /0,295\b/.test(rs.explanation) && !/0,296/.test(rs.question + rs.explanation),
  'NS4-RS-1: μ_lim 0,295 in Frage und Erklärung');

// NS4-HW-1: Steildach mit Sparrenanteil nach DIN EN ISO 6946
const Rsi = 0.10, Rse = 0.10;
const Rhom = Rsi + 0.015 / 0.25 + 0.040 / 0.040 + 0.035 / 0.045 + Rse; // GKF, Hanf, Unterdeckplatte
const fs = 80 / 750;
const RGefach = 0.200 / 0.038, RSparren = 0.200 / 0.13;
const Roben = 1 / ((1 - fs) / (Rhom + RGefach) + fs / (Rhom + RSparren));
const Runten = Rhom + 1 / ((1 - fs) / RGefach + fs / RSparren);
const U = 1 / ((Roben + Runten) / 2);
gilt(nahe(U, 0.156, 2e-3), `NS4-HW-1: U nachgerechnet ${U.toFixed(4)}`);
const dach = dataholzConstructions.find(k => k.id === 'da_sd_01');
gilt(!!dach && dach.uValue === Math.round(U * 100) / 100 && dach.uValue === 0.16, 'NS4-HW-1: Steildach-U-Wert 0,16');
gilt(nahe(1 / (Rhom + RGefach), 0.137, 2e-3), 'NS4-HW-1: alter Wert 0,14 entspricht der Rechnung ohne Sparren');
gilt(/Lehrbeispiel, nicht klassifiziert;.*Sparrenanteil 80\/750/.test(readFileSync('src/modules/holzbaubeta/daten.ts', 'utf8')), 'NS4-HW-1: Quellkommentar fehlt');

// NS4-ME-1: Aluminium-Kennwertkarte zentral 160 W/(mK) mit Zusatz Reinaluminium
const alu = metallisch.daten['metalsDb.aluminum'] as { lambda: number; lambdaHinweis?: string };
gilt(LAMBDA_ALUMINIUM === 160 && alu.lambda === LAMBDA_ALUMINIUM, 'NS4-ME-1: λ Aluminium in der Kennwertkarte');
gilt(/10456/.test(alu.lambdaHinweis ?? '') && /Reinaluminium etwa 220–237/.test(alu.lambdaHinweis ?? ''), 'NS4-ME-1: Zusatz Reinaluminium');
gilt(/lambda: LAMBDA_ALUMINIUM/.test(readFileSync('src/modules/BpMetallisch.tsx', 'utf8')), 'NS4-ME-1: Modul liest λ nicht zentral');

// NS4-RU-1: KVH-Spanne oben = zentraler Lehrwert 80/500 = 0,16 kg/kg
gilt(nahe(gwpJeKg('kvh').fossil, 0.16, 1e-9), 'NS4-RU-1: fossiler KVH-Lehrwert je kg');
const ru = readFileSync('src/modules/RessourcenEmissionen.tsx', 'utf8');
gilt(/gwpJeKg\('kvh'\)\.fossil/.test(ru) && !/0,10 - 0,15/.test(ru), 'NS4-RU-1: KVH-Spanne liest den zentralen Lehrwert');

// BIM: Holz-Voreinstellung 480 kg/m³ passend zum BSH-Lehrwert −680
const holz = (bim.daten.ARCHETYPES as { id: string; defaultDensity: number; defaultGwp: number }[]).find(a => a.id === 'holz')!;
gilt(holz.defaultDensity === 480 && BSH_LEHR_ROHDICHTE === 480 && GWP_LEHRWERTE.bsh.rohdichte === 480, 'BIM: Holz-Rohdichte 480 kg/m³');
gilt(GWP_LEHRWERTE.bsh.gwp === -680 && liegtAufRaster('holz', GWP_LEHRWERTE.bsh.gwp), 'BIM: GWP-Voreinstellung −680 auf dem Regler');
const r = gwpRegler('holz');
gilt(r.min <= -680 && r.max >= -680, 'BIM: Holz-Regler umfasst −680');
gilt((480 - 300) % 10 === 0, 'BIM: 480 liegt auf dem Rohdichte-Regler (300 … 900, Schritt 10)');
gilt(/s === 'bsh' \? w\.rohdichte/.test(readFileSync('src/modules/BimBaustoffe.tsx', 'utf8')), 'BIM: Voreinstellung liest Rohdichte des BSH-Lehrwerts');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Umsetzung NS4 (02.11.2026)');
