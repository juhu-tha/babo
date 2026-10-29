// Entscheidungen vom 29.10.2026: Lehrwert-Kennzeichnungen (betonkennwerte, mischungsberechnung, lca_rechner,
// lebensdauerbemessung) und c·ρ im Anwendungsbeispiel hydratation_folgen. Handwerte aus eigener Nachrechnung.
import { stoffraum, maxFaFaktor, fzLehrannahme, REGELSIEBLINIEN, type MischungEingabe } from '../src/calc/mischung';
import { adiabatischeErwaermung, WAERMEKAPAZITAET_VOL } from '../src/calc/hydratation';
import { QNG_WG, QNG_STAND, QUELLE_VERWERTUNGSFAKTOR, VERWERTUNGSFAKTOR, A4_FAKTOR_EINZEL } from '../src/calc/lca';
import { FCD_HOCHFEST_AKTIV, fcdBeton, FCD_MODUL } from '../src/data/kennwerte';
import { EC2_CONCRETE_CLASSES } from '../src/modules/betonkennwerte/daten';
import { RECHNER_GRENZEN } from '../src/data/rechnerGrenzen';
import { KURZFASSUNG } from '../src/data/kurzfassung';
import rechnerTab from '../content/betonkennwerte/RechnerTab.json';
import tabelleTab from '../content/betonkennwerte/TabelleTab.json';
import mischEingaben from '../content/mischungsberechnung/MischungEingaben.json';
import mischErgebnisse from '../content/mischungsberechnung/MischungErgebnisse.json';
import lcaCalc from '../content/interactivelcacalc/InteractiveLCACalc.json';
import modulD from '../content/interactivelcacalc/ModulDLabor.json';
import lcaGrundlagen from '../content/lca/LCA.json';
import lebensdauer from '../content/lebensdauerbemessung/Lebensdauerbemessung.json';
import hydr from '../content/hydratationfolgen/HydratationFolgen.json';

const fehler: string[] = [];
const pruefe = (name: string, ist: number, soll: number, tol = 1e-4) => { if (!(Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll)))) fehler.push(`${name}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, name: string) => { if (!ok) fehler.push(name); };
console.log('--- Test: Entscheidungen 29.10.2026 ---');

// 1. betonkennwerte / F-1: Schalter aus; C55/67 ohne Zusatzabminderung f_cd = 0,85·55/1,5 = 31,1667; C100/115 = 56,6667
gilt(FCD_HOCHFEST_AKTIV === false, 'F-1: Schalter f_cd-Abminderung standardmäßig aus');
pruefe('F-1: f_cd C55/67 Tabelle', fcdBeton(55, FCD_MODUL.betonkennwerteTabelle), 0.85 * 55 / 1.5);
pruefe('F-1: f_cd C55/67 Standard', fcdBeton(55), 31.1667);
pruefe('F-1: f_cd C100/115', fcdBeton(100), 56.6667);
const c100 = EC2_CONCRETE_CLASSES.find(c => c.name === 'C100/115');
const c90 = EC2_CONCRETE_CLASSES.find(c => c.name === 'C90/105');
gilt(!!c100 && !!c90 && c100.epsC2 === c90.epsC2 && c100.epsCu2 === c90.epsCu2 && c100.n === c90.n, 'F-1: C100/115 Dehnungswerte wie C90/105');
gilt(rechnerTab.werte.hochfesterBetonC5060.includes('C55/67') && rechnerTab.werte.hochfesterBetonC5060.includes('vorläufig, Normprüfung ausstehend'), 'F-1: Kennzeichnung ab C55/67');
gilt(rechnerTab.werte.lehrwertC100115.includes('Lehrwert'), 'F-1: C100/115 als Lehrwert');
gilt(tabelleTab.texte.hinweisZuHochleistungsbetonenC50.includes('C100/115 ist ein Lehrwert') && tabelleTab.texte.hinweisZuHochleistungsbetonenC50.includes('vorläufig, Normprüfung ausstehend'), 'F-1: Tabellenhinweis');

// 2. mischungsberechnung: f/z-Lehrannahme 0,25 ohne Kennbuchstaben (CEM II/A, CEM II/B)
pruefe('f/z CEM II/A', maxFaFaktor('CEM II/A'), 0.25);
pruefe('f/z CEM II/B', maxFaFaktor('CEM II/B'), 0.25);
pruefe('f/z CEM I', maxFaFaktor('CEM I'), 0.33);
pruefe('f/z CEM III/A', maxFaFaktor('CEM III/A'), 0.33);
gilt(fzLehrannahme('CEM II/A') && fzLehrannahme('CEM II/B') && !fzLehrannahme('CEM I') && !fzLehrannahme('CEM III/B'), 'fzLehrannahme');
//    Handrechnung z = 300, f = 100, w = 165, k_f = 0,4: CEM II/A anrechenbar 0,25·300 = 75 → (w/z)_eq = 165/(300 + 30) = 0,5000;
//    CEM I anrechenbar 0,33·300 = 99 → 165/339,6 = 0,48587
const basis: MischungEingabe = {
  zement: 300, rhoZement: 3.0, wasser: 165, fa: 100, sf: 0, hues: 0, biochar: 0, zusatzmittel: 0, luft: 1.5, stahlfaser: 0, ppFaser: 0, rhoGestein: 2.65,
  fraktionen: [{ anteil: 100, feuchte: 0, wa: 0 }], biocharFeuchte: 0, biocharWa: 0, k: { fa: 0.4, sf: 1.0, hues: 0, biochar: 0 }, maxFaFaktor: maxFaFaktor('CEM II/A'), zementArt: 'CEM II/A',
};
pruefe('(w/z)_eq CEM II/A', stoffraum(basis).wzEq, 0.5);
pruefe('(w/z)_eq CEM I', stoffraum({ ...basis, zementArt: 'CEM I', maxFaFaktor: maxFaFaktor('CEM I') }).wzEq, 165 / 339.6);
gilt(REGELSIEBLINIEN[16].A[4] === 36 && REGELSIEBLINIEN[16].B[5] === 76, 'Regelsieblinien unverändert');
gilt(mischErgebnisse.texte.sieblinienQuelle.includes('Lehrbuchwerte (DIN 1045-2, Anhang L)'), 'Regelsieblinien als Lehrbuchwerte');
gilt(mischEingaben.werte.kWertHuesLehrannahme.includes('Anrechnung nur nach abZ/aBG'), 'k-Wert HüS Hinweis');
gilt(mischEingaben.werte.fzLehrannahme.includes('0,25'), 'f/z-Hinweis');
const gMisch = RECHNER_GRENZEN.mischungsberechnung.grenzen.join(' ');
gilt(gMisch.includes('Lehrannahme mit der Grenze f/z ≤ 0,25') && gMisch.includes('Anrechnung nur nach abZ/aBG') && !/F-Freigabe|Normprüfung ausstehend/.test(gMisch), 'Grenzen Mischung');

// 3. lca_rechner: Lehrwerte, Stand QNG, BBSR 2017
gilt(QNG_WG.plus === 24 && QNG_WG.premium === 20 && QNG_STAND.includes('Anlage 3'), 'QNG-Grenzen mit Stand');
gilt(lcaCalc.werte.qngAbsenkungHinweis.includes('vorübergehende Absenkung') && lcaCalc.werte.qngAbsenkungHinweis.includes('nicht abgebildet'), 'QNG-Absenkung nicht abgebildet');
gilt(lcaCalc.texte.ersatzB4Erlaeuterung.includes('BBSR') && lcaCalc.texte.ersatzB4Erlaeuterung.includes('Stand 2017'), 'BBSR-Nutzungsdauern Stand 2017');
gilt(VERWERTUNGSFAKTOR.reuse === 1.45 && VERWERTUNGSFAKTOR.thermal === 0.4 && QUELLE_VERWERTUNGSFAKTOR.includes('Lehrwerte') && modulD.texte.verwertungsfaktorBegruendung.includes('**Lehrwerte**'), 'Modul D Lehrwerte');
gilt(A4_FAKTOR_EINZEL['strom-lkw'] === 0.004 && A4_FAKTOR_EINZEL['h2-lkw'] === 0.003 && lcaGrundlagen.werte.ökostromLaden0004.includes('Lehrwert') && lcaGrundlagen.werte.h2Brennstoffzelle0003.includes('Lehrwert'), 'Lkw E/H₂ Lehrwerte');

// 4. lebensdauerbemessung
const lw = 'Lehrwerte nach fib Bulletin 34 (Sekundärquellen), vorläufig';
gilt(lebensdauer.texte.lehrhinweis.includes(lw) && lebensdauer.werte.parameterTitelKarb.includes(lw) && lebensdauer.werte.parameterTitelChlorid.includes(lw), 'Lebensdauer: Kennzeichnung');

// 5. hydratation_folgen / T3-HY-2: z = 320, Q = 350 → ΔT = 112 000/2400 = 46,67 K; T_Kern = 15 + 46,67 = 61,7 °C
pruefe('HY-2 c·ρ', WAERMEKAPAZITAET_VOL, 2400);
pruefe('HY-2 ΔT', adiabatischeErwaermung(320, 350), 46.6667);
gilt(KURZFASSUNG.hydratation_folgen.some(s => s.includes('rund 47 K')) && !KURZFASSUNG.hydratation_folgen.some(s => s.includes('45 K')), 'HY-2 Kurzfassung 47 K');
gilt(hydr.werte.rund47KBei.startsWith('Rund 47 K') && hydr.werte.rund47KBei.includes('rund 62 °C') && !JSON.stringify(hydr).includes('2500'), 'HY-2 Ergebnishinweis 47 K / 62 °C');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Entscheidungen 29.10.2026');
