// Modulprüfung Tranche 16 (02.11.2026): Module ohne Eintrag in src/data/pruefvermerke.ts (Befundliste
// docs/pruefung/module-tranche-16.md). Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der Gleichungen
// in Python), nicht aus den Kernen oder vorhandenen Tests. Neu sind die Kerne src/calc/zwang.ts und src/calc/eigenspannungen.ts
// (vorher inline in src/modules/Zwang.tsx bzw. Eigenspannungen.tsx, Werte unverändert); dazu Prüfungen der Textkorrekturen.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { zwangSpannung, ALPHA_T_BETON } from '../src/calc/zwang';
import { eigenspannungsVerlauf } from '../src/calc/eigenspannungen';
import { kriechSchwindModell, kriechzahl, trocknungsschwinden, stuetzenVerformung, spannstahlRelaxation, betaT0 } from '../src/calc/kriechenSchwinden';
import { RECHNER_GRENZEN, grenzenFuer } from '../src/data/rechnerGrenzen';
import { MODULE_HISTORY_DATA } from '../src/data/moduleHistoryData';
import { PRUEFVERMERKE } from '../src/data/pruefvermerke';
import kriechen from '../content/kriechenschwinden/KriechenSchwinden.json';
import zwangInhalt from '../content/zwang/Zwang.json';
import eigen from '../content/eigenspannungen/Eigenspannungen.json';
import nachhaltigkeitCl from '../content/nachhaltigkeitchecklisten/NachhaltigkeitChecklisten.json';
import dauerhaftigkeitCl from '../content/dauerhaftigkeitchecklisten/DauerhaftigkeitChecklisten.json';
import instandsetzungCl from '../content/instandsetzungchecklisten/InstandsetzungChecklisten.json';
import kiHistorie from '../content/ki/ueberblick/HistorieTab.json';
import kiStand from '../content/ki/ueberblick/StandTab.json';
import kiKurse from '../content/ki/KiOnlinekurse.json';
import moduleinfo from '../content/moduleinfo/daten.json';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const text = (o: unknown) => JSON.stringify(o);

console.log('--- Test: Modulprüfung Tranche 16 ---');

// 1. kriechen – Anwendungsbeispiel C30/37, RH 50 %, h₀ 200 mm, t₀ 28 d, Zement N, t_s 7 d
const m = kriechSchwindModell({ fck: 30, rh: 50, h0: 200, t0: 28, ts: 7, zement: 'N' });
pruefe('KS φ_RH', m.phiRH, 1.77768); pruefe('KS β(f_cm)', m.betaFcm, 2.72532); pruefe('KS β(t₀)', m.betaT0, 0.48845);
pruefe('KS φ₀ (Beispiel 2,37)', m.phi0, 2.36641); pruefe('KS β_H', m.betaH, 539.959); pruefe('KS ε_cd,0 µm/m', m.epsCd0 * 1e6, 482.241);
pruefe('KS ε_cs,∞ µm/m (Beispiel 460)', (m.kh * m.epsCd0 + m.epsCaInf) * 1e6, 459.905); pruefe('KS E_cm', m.Ecm, 32836.6);
pruefe('KS φ(10 000 d)', kriechzahl(m, 10000), 2.32927); pruefe('KS ε_cd(10 000 d) µm/m', trocknungsschwinden(m, 10000) * 1e6, 405.316);
pruefe('KS Stütze ΔL nach 50 a (σ_c 8,5, L 3 m)', stuetzenVerformung(m, 18250).dL_tot, 3.88363);
const eel = 8.5 / m.Ecm;
pruefe('KS Ergebnishinweis ≈ 1,3 ‰', (eel * (1 + m.phi0 / 1.05) + m.kh * m.epsCd0 + m.epsCaInf) * 1e3, 1.30216);
pruefe('KS „rund das Fünffache“', (eel * (1 + m.phi0 / 1.05) + m.kh * m.epsCd0 + m.epsCaInf) / eel, 5.0304);
pruefe('KS Relaxation Kl. 2, μ 0,7, 1000 h', spannstahlRelaxation('2', 0.7, 1000), 0.963695);
pruefe('KS Relaxation Kl. 2, μ 0,7, 500 000 h', spannstahlRelaxation('2', 0.7, 500000), 3.90129);
pruefe('KS Relaxation Kl. 1, μ 0,75, 500 000 h', spannstahlRelaxation('1', 0.75, 500000), 21.041);
pruefe('KS Relaxation Kl. 3, μ 0,6, 100 000 h', spannstahlRelaxation('3', 0.6, 100000), 3.83123);
gilt(spannstahlRelaxation('2', 0.5, 1000) === 0, 'KS Relaxation μ ≤ 0,5 vernachlässigt');
pruefe('KS Quiz q_ksx_1 β(7 d)', betaT0(7), 0.634609);
// T16-KS-1: Grenzen beschreiben das Stützenbeispiel wie der Kern (Kriechanteil mit 1,05·E_cm)
gilt(RECHNER_GRENZEN.kriechen.grenzen.some(g => g.includes('φ·σ_c/(1,05·E_cm)')), 'KS-1 Grenzen mit E_c = 1,05·E_cm');
gilt(kriechen.werte.modulRMpa.startsWith('E-Modul'), 'KS-2 Achsbeschriftung E-Modul statt „Modul R“');

// 2. zwang – Kern src/calc/zwang.ts (Werte wie die frühere Inline-Rechnung)
pruefe('ZW α_T', ALPHA_T_BETON, 1e-5);
const zv = zwangSpannung({ deltaT: 20, epsCsPromille: 0.3, eModul: 30000, festhaltungProzent: 100, fct: 3.0 });
pruefe('ZW Vorgabe σ_z', zv.sigma, 15); gilt(zv.gerissen && zv.gueltig, 'ZW Vorgabe gerissen');
pruefe('ZW ε_frei ‰', zv.epsFrei * 1000, 0.5); gilt(zv.verlauf.length === 11 && nahe(zv.verlauf[5].sigma, 7.5), 'ZW Verlauf 0 … 100 %');
pruefe('ZW Quiz qn_zwang_1', zwangSpannung({ deltaT: 20, epsCsPromille: 0, eModul: 30000, festhaltungProzent: 50, fct: 3 }).sigma, 3);
pruefe('ZW Quiz qn_zwang_5', zwangSpannung({ deltaT: 0, epsCsPromille: 0.3, eModul: 15000, festhaltungProzent: 100, fct: 3 }).sigma, 4.5);
const z0 = zwangSpannung({ deltaT: 20, epsCsPromille: 0.3, eModul: 30000, festhaltungProzent: 0, fct: 3 });
gilt(z0.sigma === 0 && !z0.gerissen, 'ZW Grenzfall R = 0 → keine Spannung (Quiz qn_zwang_2)');
gilt(zwangSpannung({ deltaT: 10, epsCsPromille: 0.1, eModul: 10000, festhaltungProzent: 100, fct: 2.0 }).gerissen, 'ZW Grenzfall σ_z = f_ct → gerissen');
gilt(!zwangSpannung({ deltaT: 20, epsCsPromille: 0, eModul: 0, festhaltungProzent: 100, fct: 3 }).gueltig, 'ZW E = 0 → Fehler');
gilt(!zwangSpannung({ deltaT: 20, epsCsPromille: 0, eModul: 30000, festhaltungProzent: 120, fct: 3 }).gueltig, 'ZW R > 100 % → Fehler');
gilt(zwangSpannung({ deltaT: -10, epsCsPromille: 0, eModul: 30000, festhaltungProzent: 100, fct: 3 }).hinweise.some(h => h.stufe === 'warnung'), 'ZW Erwärmung → Warnung');
const zwangTsx = fs.readFileSync(path.join(ROOT, 'src/modules/Zwang.tsx'), 'utf8');
gilt(!zwangTsx.includes('Ungerrissen') && !zwangTsx.includes('Temperaturabfluss'), 'ZW-1 Schreibfehler „Ungerrissen“/„Temperaturabfluss“');
gilt(zwangTsx.includes("from '@/src/calc/zwang'") && !/alphaT\s*=/.test(zwangTsx), 'ZW Modul rechnet über den Kern');
gilt(text(zwangInhalt).includes('Rißbreitenbeschränkung') && !text(zwangInhalt).includes('Bemessungshilfen zu Eurocode 2'), 'ZW-2 Titel DAfStb-Heft 466');
gilt(!!grenzenFuer('zwang') && grenzenFuer('zwang')!.grenzen.length >= 2, 'ZW Rechnergrenzen');

// 3. eigenspannungen – Kern src/calc/eigenspannungen.ts
const eb = eigenspannungsVerlauf({ tInnen: 20, tMitte: 45, tAussen: 15, eModul: 15000, dicke: 1.0, epsCsPromille: 0 });
pruefe('ES Beispiel σ_V,Rand', eb.maxZug, 2.75); pruefe('ES Beispiel σ_V,Kern', eb.maxDruck, -1.375); pruefe('ES Beispiel T_N', eb.tMittel, 35.8333);
pruefe('ES Beispiel ΔT_par', eb.deltaTPar, 27.5); pruefe('ES Beispiel σ_N', eb.punkte[0].sigmaN, -2.375); gilt(eb.zugLage === 'rand', 'ES Beispiel Zug am Rand');
gilt(eb.punkte.length === 51, 'ES 50 Abschnitte');
// Gleichgewicht N = 0 und M = 0 (Trapezregel über 51 Punkte, Toleranz der Diskretisierung)
const h = 1.0 / 50;
const integral = (f: (p: (typeof eb.punkte)[number]) => number) => eb.punkte.reduce((s, p, i) => s + f(p) * (i === 0 || i === 50 ? 0.5 : 1) * h, 0);
gilt(Math.abs(integral(p => p.sigmaV)) < 2e-3 && Math.abs(integral(p => p.sigmaV * p.x)) < 1e-4, 'ES N = 0 und M = 0');
pruefe('ES Quiz q_esx_4 (20/40/20)', eigenspannungsVerlauf({ tInnen: 20, tMitte: 40, tAussen: 20, eModul: 15000, dicke: 1, epsCsPromille: 0 }).maxZug, 2.0);
const es = eigenspannungsVerlauf({ tInnen: 20, tMitte: 20, tAussen: 20, eModul: 15000, dicke: 1, epsCsPromille: 0.3 });
pruefe('ES Schwinden Rand (q_esx_5)', es.maxZug, 3.0); pruefe('ES Schwinden Kern', es.maxDruck, -1.5); gilt(es.zugLage === 'rand', 'ES Schwinden Zug am Rand');
const ek = eigenspannungsVerlauf({ tInnen: 20, tMitte: 10, tAussen: 20, eModul: 15000, dicke: 1, epsCsPromille: 0 });
pruefe('ES Kern kühler (Abkühlphase) Zug', ek.maxZug, 0.5); pruefe('ES Kern kühler Druck', ek.maxDruck, -1.0);
gilt(ek.zugLage === 'kern' && ek.hinweise.some(x => x.stufe === 'warnung'), 'ES-1 Grenzfall: Zug im Kern wird als „Kern“ gemeldet (q_esx_6)');
const em = eigenspannungsVerlauf({ tInnen: 30, tMitte: 60, tAussen: 10, eModul: 10000, dicke: 2, epsCsPromille: 0.2 });
pruefe('ES unsymmetrisch + Schwinden Zug', em.maxZug, 4.0); pruefe('ES unsymmetrisch + Schwinden Druck', em.maxDruck, -2.0);
gilt(eigenspannungsVerlauf({ tInnen: 20, tMitte: 20, tAussen: 20, eModul: 15000, dicke: 1, epsCsPromille: 0 }).zugLage === 'keine', 'ES gleichmäßig → keine Eigenspannung');
gilt(!eigenspannungsVerlauf({ tInnen: 20, tMitte: 45, tAussen: 15, eModul: 15000, dicke: 0, epsCsPromille: 0 }).gueltig, 'ES d = 0 → Fehler');
const eigTsx = fs.readFileSync(path.join(ROOT, 'src/modules/Eigenspannungen.tsx'), 'utf8');
gilt(eigTsx.includes("from '@/src/calc/eigenspannungen'") && eigTsx.includes('maxZugeigenspannungKern') && !!eigen.texte.maxZugeigenspannungKern, 'ES-1 Modul über Kern, Beschriftung je Lage');
gilt(!!grenzenFuer('eigenspannungen'), 'ES Rechnergrenzen');

// 4. Checklisten – Beispiele und Textkorrekturen
pruefe('DC 5-%-Quantil Betondeckung', 47 - 1.645 * 4.5, 39.5975);
gilt(dauerhaftigkeitCl.werte.gesetzlichVerpflichtend !== 'Gesetzlich verpflichtend', 'DC-1 Normpunkte nicht als „gesetzlich verpflichtend“');
const nc = text(nachhaltigkeitCl);
gilt(!/hergestellt werden\? hergestellt werden\?|eingesetzt\? eingesetzt\?|vorgegeben\?\) vorgegeben\?|anstelle nasser Putze\)|\(EBV, seit 01\.08\.2023\) gemäß der Ersatzbaustoffverordnung/.test(nc), 'NC-1 doppelte/zerbrochene Satzteile');
gilt(!nc.includes('0.05 ppm') && nc.includes('0,05 ppm'), 'NC-1 Dezimalkomma');
gilt(!nc.includes('Typ 2 nach DAfStb-Richtlinie') && nc.includes('DIN 1045-2:2023-08, Anhang E'), 'NC-1 R-Beton nach DIN 1045-2, Anhang E');
gilt(!text(instandsetzungCl).includes('Filmverfilmung'), 'IC-1 Schreibfehler „Filmverfilmung“');
const gamma = Math.log(0.8) + (17.62 * 15) / (243.12 + 15);
pruefe('IC Beispiel Taupunkt', (243.12 * gamma) / (17.62 - gamma), 11.5755);
pruefe('IC Beispiel Haftzug-Mittel', (1.8 + 1.6 + 1.2 + 1.9 + 1.7) / 5, 1.64);
pruefe('SC Beispiel Rissrate', 0.06 / 0.5, 0.12); pruefe('SC Beispiel u_m', ((85.0 - 80.2) / 80.2) * 100, 5.98504);

// 5. KI-Überblick und Onlinekurse
const P = 45 / 50, R = 45 / 60;
pruefe('KU F1', (2 * P * R) / (P + R), 0.818182); pruefe('KU GSD mm/px', 1200 / 4000, 0.3); pruefe('KU B_max mm', (4000 * 0.2) / 2, 400);
gilt(!text(kiHistorie).includes('lösen das Problem der Halluzination'), 'KU-1 RAG verringert Halluzinationen (wie Quiz q_ki_ub_4)');
gilt(!text(kiStand).includes('bauvorlageberechtigten') && !text(kiStand).includes('nach BGB/HOAI'), 'KU-3 Standsicherheitsnachweis');
const ko = text(kiKurse);
gilt(!ko.includes('100% Deutsch') && !ko.includes('Kopiere ') && !ko.includes('Vergabeunterlagen nach HOAI') && !ko.includes('einzige datenschutzkonforme'), 'KO-1 Texte Onlinekurse');
gilt(!ko.includes('Offiziell akkreditierte Plattform der deutschen Bundesregierung') && !ko.includes('Empfehlung: Florian Dahlitz') && !ko.includes('Empfehlung: Jens Polomski'), 'KO-1 KI-Campus/Empfehlungen');

// 6. Modulinfos (Historie, Texte)
const hist = text(MODULE_HISTORY_DATA);
gilt(!hist.includes('Bestandsreserven rechtlich belastbar') && !hist.includes('unstrittige Schadensursachenzuordnung'), 'MI-1/-3 Historie Grundlagen/Schäden');
gilt(!hist.includes('Reaktionsharze (SPCC)') && hist.includes('im Spritzverfahren SPCC') && !hist.includes('SIVV-Qualifikation gesetzlich gefordert'), 'MI-4 Historie Instandsetzung');
gilt(!text(moduleinfo).includes('baustoffspezifischen Sanierungsverfahren'), 'MI-4 Grammatik');

// 7. Keine Prüfvermerke gesetzt: die Module dieser Tranche bleiben ohne Eintrag
for (const id of ['kriechen', 'zwang', 'eigenspannungen', 'nachhaltigkeit_checklisten', 'dauerhaftigkeit_checklisten', 'schaeden_checklisten',
  'instandsetzung_checklisten', 'ki_ueberblick', 'ki_onlinekurse', 'grundlagen_info', 'labor_info', 'baustoffe_info', 'schaeden_info',
  'instandsetzung_info', 'digitales_info', 'praxiswissen_info']) gilt(!(id in PRUEFVERMERKE), `kein Prüfvermerk für ${id}`);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 16');
