// Nachstichprobe 5a (02.11.2026): 25 freigegebene Fachmodule, die in keiner bisherigen Nachstichprobe und nicht in der
// Gegenprüfung waren (alphabetisch nach Modul-ID, ungerade Positionen; Befundliste docs/pruefung/nachstichprobe5a-2026-11-02.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (Python, eigene Umsetzung der Gleichungen), nicht aus den Kernen.
// Zusätzlich sichert der Test die Korrekturen NS5A-* gegen ein Zurückfallen.
import { traeger, dreigelenkrahmen } from '../src/calc/statik';
import { bemesseDruckstab, bemesseQuerdruck } from '../src/calc/holzbau';
import { abtragsrateFaraday, querschnittsverlust, chloridGehalt, schnellUmrechnung } from '../src/calc/korrosion';
import { auslagerung, moertelprismen } from '../src/calc/laborversuche';
import { effektiveDickeW } from '../src/calc/glas';
import { rentenbarwertfaktor } from '../src/calc/lcc';
import { trockenbauBedarf, belagMasse } from '../src/calc/bauprodukte';
import { festigkeitsentwicklung } from '../src/calc/pruefverfahren';
import daemmung from '../content/daemmungvergleich/DaemmungVergleich.json';
import altlasten from '../content/abfaelle/Altlasten.json';
import dpp from '../content/dppepd/DppEpd.json';
import recht from '../content/bprechtliches/BpRechtliches.json';
import trockenbau from '../content/bptrockenbau/BpTrockenbau.json';
import innovativ from '../content/innovativewerkstoffe/InnovativeWerkstoffe.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Nachstichprobe 5a (02.11.2026, Nachrechnungen und Korrekturen) ---');

// baustatik: Beispiel 1 (Einfeldträger mit Gleich- und Einzellast), Beispiel 2 (Zweifeldträger, Dreigelenkrahmen), Quizfälle
const ef = traeger({ system: 'einfeld', l: 6, l1: 3, q: 10, f: 50, a: 2, m0: 0, am: 0 });
pruefe('BS Bsp1 A', ef.A, 63.3333); pruefe('BS Bsp1 B', ef.B, 46.6667); pruefe('BS Bsp1 M(2)', ef.M(2), 106.667);
const zf = traeger({ system: 'zweifeld', l: 10, l1: 5, q: 20, f: 0, a: 0, m0: 0, am: 0 });
pruefe('BS Bsp2 M_B', zf.MB, -62.5); pruefe('BS Bsp2 A', zf.A, 37.5); pruefe('BS Bsp2 B', zf.B, 125); pruefe('BS Bsp2 C', zf.C, 37.5);
const dg = dreigelenkrahmen(4, 8, 10, 0);
pruefe('BS Bsp2 Horizontalschub', Math.abs(dg.Bh), 20); pruefe('BS Bsp2 Eckmoment', Math.abs(dg.M_Ecke_Rechts), 80);
const kr = traeger({ system: 'kragarm', l: 3, l1: 1.5, q: 8, f: 10, a: 3, m0: 0, am: 0 });
pruefe('BS Quiz Kragarm A', kr.A, 34); pruefe('BS Quiz Kragarm |M_A|', Math.abs(kr.MA), 66);
pruefe('BS Quiz Einzellast A', traeger({ system: 'einfeld', l: 6, l1: 3, q: 0, f: 60, a: 2, m0: 0, am: 0 }).A, 40);

// holzbau_bemessung: Anwendungsbeispiel C24 120/160, l = 3,0 m, N_Ed = 50 kN, NKL 1, mittel; Quiz l_ef = 2,6 m und Querdruck
const ds = bemesseDruckstab({ b: 120, h: 160, laenge: 3.0, eulerFall: 2, nEd: 50, fc0k: 21, E005: 7400, brettschichtholz: false, nkl: 1, kled: 'mtl' });
pruefe('HO λ_z', ds.lambda_z, 86.6025); pruefe('HO λ_rel', ds.lambda_rel_z, 1.46850); pruefe('HO k_c', ds.k_cz, 0.393426);
pruefe('HO N_Rd', ds.F_c_R_d_kN, 97.618); pruefe('HO Ausnutzung', ds.utilization, 51.220);
pruefe('HO Quiz λ_rel 2,6 m', bemesseDruckstab({ b: 120, h: 160, laenge: 2.6, eulerFall: 2, nEd: 50, fc0k: 21, E005: 7400, brettschichtholz: false, nkl: 1, kled: 'mtl' }).lambda_rel_z, 1.27270);
pruefe('HO Quiz l_ef Kragstütze', bemesseDruckstab({ b: 120, h: 160, laenge: 2.8, eulerFall: 1, nEd: 10, fc0k: 21, E005: 7400, brettschichtholz: false, nkl: 1, kled: 'mtl' }).l_ef, 5600);
const qd = bemesseQuerdruck({ F: 30, b: 100, l: 120, fall: 'schwelle', ueberstand: true, fc90k: 2.5, art: 'nadelvollholz', nkl: 1, kled: 'mtl' });
pruefe('HO Quiz F_c,90,Rd', qd.F_c90Rd_kN, 34.6154);

// korrosion: Faraday (Beispiel 2 und Quiz), 2. Ficksches Gesetz mit konstantem D (Beispiel 1, Quiz), Schnellkarbonatisierung
pruefe('KO v_corr 1 µA/cm²', abtragsrateFaraday(1), 11.6, 5e-3);
pruefe('KO Bsp2 ΔA/A', querschnittsverlust(12, abtragsrateFaraday(1), 10).verlust, 0.0383, 1e-2);
pruefe('KO Quiz ΔA/A Ø16', querschnittsverlust(16, 2 * 11.6, 15).verlust, 0.085108);
pruefe('KO Bsp1 C(45 mm, 50 a)', chloridGehalt(45, 50, 0.3, 3.0, 0), 0.430802, 2e-3);
pruefe('KO Bsp1 C(35 mm, 50 a)', chloridGehalt(35, 50, 0.3, 3.0, 0), 0.765975, 2e-3);
pruefe('KO Quiz C(40 mm)', chloridGehalt(40, 50, 0.5, 2.5, 0), 0.784855, 2e-3);
// K_nat in mm/√a = K_schnell · √(c_nat/c_schnell) · √365 (Kern); Quiz rechnet in mm/√d
pruefe('KO Quiz K_nat', schnellUmrechnung(2.0, 2.0, 0.04).kNat / Math.sqrt(365), 0.282843);

// labor_auslagerung / labor_moertelprismen: Lehrbeispiele des Handouts
const au = auslagerung({ proben: [{ medium: 'Ca(OH)₂ + 3 % NaCl', d: 12, l: 100, m0: 88.512, m1: 88.262 }], tage: 28, rho: 7.85, blind: 0.010 } as Parameters<typeof auslagerung>[0]);
pruefe('LA P1 Fläche', au.werte[0].flaeche, 39.9611); pruefe('LA P1 v_korr', au.werte[0].vKorr, 99.733);
const mp = moertelprismen([{ Ff: 2.9, Fc1: 79.2, Fc2: 81.0 }, { Ff: 3.1, Fc1: 80.1, Fc2: 78.5 }, { Ff: 3.0, Fc1: 82.3, Fc2: 79.6 }] as Parameters<typeof moertelprismen>[0], 28);
pruefe('LM R_f A', mp.rf[0], 6.796875); pruefe('LM R_c Mittel', mp.druck.mittel, 50.0729); gilt(mp.klasse === '42,5', `LM Klasse 42,5 (ist ${mp.klasse})`);

// glas, lebenszyklus_kosten, bp_trockenbau, bp_mineralisch, festbeton
pruefe('GL Quiz h_ef ohne Schubverbund', effektiveDickeW(8, 8, 1.52, 0), 10.0794);
pruefe('LK Rentenbarwertfaktor 2 %/30 a', rentenbarwertfaktor(0.02, 30), 22.3965);
const tb = trockenbauBedarf({ flaeche: 30, lagen: 2, achsabstand: 62.5, daemmung: false });
pruefe('TB Quiz Platten', tb.platten, 126); pruefe('TB Quiz Spachtel', tb.spachtel, 54);
pruefe('BM Bsp Steingut nass', belagMasse(20, 8, 1900, 15).nass, 349.6); pruefe('BM Quiz Steinzeug nass', belagMasse(25, 10, 2300, 2.5).nass, 589.375);
pruefe('FB Bsp f_cm(7 d)', festigkeitsentwicklung({ fck: 30, alterTage: 7, zement: 'N', geometrie: 'zyl_150', lagerung: 'norm' }).fcmT, 29.5952);

// Korrekturen NS5A-* gegen ein Zurückfallen
gilt(!/0,25\/0,71/.test(daemmung.werte.dieBestandswandAusBeispiel) && /0,25\/0,83 = 0,698/.test(daemmung.werte.dieBestandswandAusBeispiel)
  && /0,25\/2,33 = 0,89/.test(daemmung.werte.dieBestandswandAusBeispiel), 'NS5A-DV-1: f_Rsi mit R_T aus R_si = 0,25 (0,698 bzw. 0,89)');
pruefe('NS5A-DV-1 f_Rsi ungedämmt (eigene Rechnung)', 1 - 0.25 / (0.25 + 0.365 / 0.68 + 0.04), 0.697617, 1e-4);
gilt(!/3000 m³/.test(altlasten.texte.gesetzlichEmpfohlenUndOft) && /3000 m²/.test(altlasten.texte.gesetzlichEmpfohlenUndOft) && /§ 4 Abs\. 5 BBodSchV/.test(altlasten.texte.gesetzlichEmpfohlenUndOft),
  'NS5A-AB-1: Schwelle der bodenkundlichen Baubegleitung als Fläche (> 3000 m², § 4 Abs. 5 BBodSchV)');
gilt(!/Pflicht/.test(altlasten.texte.t2BodenkundlicheBaubegleitungBbb), 'NS5A-AB-1: BBB nicht als pauschale Pflicht überschrieben');
gilt(/EAD bis 09\.01\.2031/.test(dpp.texte.schrittweiserÜbergangAllerProduktfamilie) && /ETA bis 09\.01\.2036/.test(dpp.texte.schrittweiserÜbergangAllerProduktfamilie),
  'NS5A-DPP-1: Übergangsfristen EAD/ETA 09.01.2031/09.01.2036');
gilt(!/Verkaufsregal/.test(recht.texte.abSystem3Wird) && /in Verkehr gebracht/.test(recht.texte.abSystem3Wird), 'NS5A-RA-1: Audit-Testing vor dem Inverkehrbringen, nicht aus dem Handel');
gilt(JSON.stringify(trockenbau).includes('α_w bis 0,90') && !JSON.stringify(trockenbau).includes('α_w bis 0.90'), 'NS5A-TB-1: Dezimalkomma');
gilt(innovativ.texte.minimaleBautechnischeSicherheit1.endsWith('1,3') && innovativ.werte.extremNiedrig015.includes('0,15 bis 0,18'), 'NS5A-IW-1: Dezimalkomma');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Nachstichprobe 5a (02.11.2026)');
