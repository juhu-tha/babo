// Runde 7: Übergabe der Einzelrechner an die Lebensdauerbemessung (URL-Parameter) und Gleichheit der Rechenkerne
import {
  uebergabeSuche, uebergabeAdresse, leseUebergabe, vorgabeAusUebergabe, bindemittelAusAlterung, UEBERGABE_SCHLUESSEL,
  type LebensdauerUebergabe,
} from '../src/calc/lebensdauerUebergabe';
import {
  chloridgehalt, alterungsfaktor, karbonatisierungsrate, rInvAusKac, R_EINHEIT_MM2_A, D_EINHEIT_MM2_A, RHO_CO2, T0_JAHRE,
} from '../src/calc/lebensdauer';
import { chloridGehalt, chloridProfil, dAppAlterung, T0_CHLORID, schnellUmrechnung, karbonatisierungsFront } from '../src/calc/korrosion';
import { umrechnungsfaktor, tiefeNach, zeitBisTiefe, koeffizientAusTiefe, schnellkarbonatisierung } from '../src/calc/schnellkarbonatisierung';
import { karbonatisierung as bauwerkKarbonatisierung } from '../src/calc/bauwerksuntersuchung';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Lebensdauer-Übergabe und gemeinsame Kerne ---');

// 1. Gleichheit der Kerne: Chloridprofil im Modul Bewehrungskorrosion = lebensdauer.chloridgehalt (C₀ = 0, Δx = 0)
pruefe(T0_CHLORID === T0_JAHRE, 't₀ gemeinsam');
{
  let s = 12345;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  for (let i = 0; i < 500; i++) {
    const x = rnd() * 100, t = 0.01 + rnd() * 120, d = 0.1 + rnd() * 30, cS = rnd() * 6, a = rnd() * 0.95;
    const korr = chloridGehalt(x, t, d, cS, a);
    const ld = chloridgehalt(x, t, 0, cS, 0, d * D_EINHEIT_MM2_A * alterungsfaktor(t, a));
    pruefe(korr === ld, `Chlorid-Kern ungleich bei x=${x}, t=${t}: ${korr} vs ${ld}`);
    pruefe(dAppAlterung(d, t, a) === d * alterungsfaktor(t, a), 'Alterung gemeinsam');
  }
  // Rechenbeispiel Korrosion.json (fib 34): C_s = 3,0; D = 0,3·10⁻¹² m²/s; x = 45 mm; t = 50 a → 0,43 M.-% (unverändert)
  pruefe(nahe(chloridGehalt(45, 50, 0.3, 3.0, 0), 0.43, 0.01), 'Beispiel 1 unverändert');
  // Standardeingaben des Reiters Chlorid-Eindringen (t = 50 a, c = 35 mm, D = 5, C_s = 3, a = 0,2): Abweichung zur
  // früheren Rechnung (erf nach A&S 7.1.26, t₀ = 28/365 a) kleiner 10⁻⁴ M.-%
  const alt = (() => {
    const t0 = 28 / 365, D = 5e-12 * Math.pow(t0 / 50, 0.2), z = 0.035 / (2 * Math.sqrt(D * 50 * 365 * 86400));
    const tt = 1 / (1 + 0.3275911 * z);
    const erf = 1 - (((((1.061405429 * tt - 1.453152027) * tt + 1.421413741) * tt - 0.284496736) * tt + 0.254829592) * tt * Math.exp(-z * z));
    return 3 * (1 - erf);
  })();
  const neu = chloridProfil({ t: 50, cNom: 35, dApp: 5, cS: 3, a: 0.2 }).cBewehrung;
  pruefe(nahe(neu, alt, 1e-4), `Chlorid Standardeingabe ${neu} vs früher ${alt}`);
}

// 2. Karbonatisierung: K_AC → R⁻¹ → fib-Rate unter Referenzbedingungen (k_e = k_c = k_t = 1, ε_t = 0, W = 1)
//    ist identisch mit K_nat = K_AC · √(c_nat/c_acc) · √365 der Schnellkarbonatisierung (beide aus x = √(2·C·t·R⁻¹))
for (const [kac, cAcc, cNat] of [[1.0, 3, 0.04], [2.5, 3, 0.042], [0.6, 2, 0.04]] as const) {
  const cS = cNat / 100 * RHO_CO2;
  const rate = karbonatisierungsrate(1, 1, 1, rInvAusKac(kac, cAcc) * R_EINHEIT_MM2_A, 0, cS);
  const kNat = kac * umrechnungsfaktor(cAcc, cNat);
  pruefe(nahe(rate, kNat, 1e-9 * kNat), `K_AC ${kac}: fib ${rate} vs K_nat ${kNat}`);
  pruefe(nahe(schnellUmrechnung(kac, cAcc, cNat).kNat, kNat, 1e-12), 'Korrosion-Schnellreiter = Schnellkarbonatisierung');
}
// Wurzel-t-Gesetz: Bauwerksuntersuchung, Korrosion und Schnellkarbonatisierung rechnen mit denselben Funktionen
{
  const b = bauwerkKarbonatisierung(24, 45, 30);
  pruefe(b.k === koeffizientAusTiefe(24, 45) && b.tDepass === zeitBisTiefe(30, b.k), 'Bauwerk: K und t_depass aus dem Kern');
  pruefe(nahe(b.k, 3.578, 0.001) && nahe(b.tDepass, 70.3, 0.1), `Bauwerk Standardwerte K = ${b.k}, t = ${b.tDepass}`);
  const f = karbonatisierungsFront(3, 50, 25);
  pruefe(f.xc === tiefeNach(3, 50) && f.tDeckung === zeitBisTiefe(25, 3), 'Korrosion: Front aus dem Kern');
}

// 3. Übergabe: Hin- und Rückweg
{
  const u: LebensdauerUebergabe = { quelle: 'schnellkarbonatisierung', mech: 'karbonatisierung', kac: 1.2345678, cAcc: 3, deckM: 25, tSL: 50 };
  const adr = uebergabeAdresse(u);
  pruefe(adr.startsWith('/modul/lebensdauerbemessung?von=schnellkarbonatisierung&'), `Adresse ${adr}`);
  const r = leseUebergabe(uebergabeSuche(u));
  pruefe(!!r.daten && r.hinweise.length === 0, 'gültige Übergabe ohne Hinweise');
  pruefe(r.daten?.kac === 1.23457 && r.daten.cAcc === 3 && r.daten.deckM === 25 && r.daten.tSL === 50 && r.daten.mech === 'karbonatisierung', `Rückweg ${JSON.stringify(r.daten)}`);
  const v = vorgabeAusUebergabe(r.daten!);
  pruefe(v.vorgabe.rArt === 'kac' && v.vorgabe.kac === 1.23457 && v.vorgabe.kacC === 3 && v.vorgabe.deckM === 25, `Vorgabe K_AC ${JSON.stringify(v.vorgabe)}`);
}
// Chlorid aus dem Korrosionsmodul: a = 0,2 → CEM I (a = 0,30) mit Hinweis; D_app,0 → D_RCM,0
{
  const r = leseUebergabe(uebergabeSuche({ quelle: 'korrosion', mech: 'chlorid', deckM: 35, tSL: 50, drcm: 5, cS: 3, a: 0.2 }));
  const v = vorgabeAusUebergabe(r.daten!);
  pruefe(v.vorgabe.mech === 'chlorid' && v.vorgabe.drcm === 5 && v.vorgabe.cS === 3 && v.vorgabe.binder === 'cemI', `Chlorid ${JSON.stringify(v.vorgabe)}`);
  pruefe(v.hinweise.some(h => h.feld === 'a'), 'Hinweis zum Alterungsexponenten');
  pruefe(bindemittelAusAlterung(0.45) === 'huettensand' && bindemittelAusAlterung(0.7) === 'flugasche' && bindemittelAusAlterung(0) === 'cemI', 'Bindemittel aus a');
}
// Expositionsklassen: XD3 → Chlorid mit Spritzwasser; XC4 → beregnet (RH 75 ± 16 % nach Carević/Ignjatović 2022)
{
  const v1 = vorgabeAusUebergabe(leseUebergabe('?von=expositionsklassen&deck=55&expo=XC4,XD3,XF2').daten!);
  pruefe(v1.vorgabe.mech === 'chlorid' && v1.vorgabe.zone === 'spritz' && v1.vorgabe.deckM === 55, `XD3 ${JSON.stringify(v1.vorgabe)}`);
  const v2 = vorgabeAusUebergabe(leseUebergabe('?von=expositionsklassen&deck=40&expo=XC4,XF1').daten!);
  pruefe(v2.vorgabe.mech === 'karbonatisierung' && v2.vorgabe.rhM === 75 && v2.vorgabe.rhS === 16 && v2.vorgabe.pSR === 1 && v2.vorgabe.tow === 0.3, `XC4 ${JSON.stringify(v2.vorgabe)}`);
  const v3 = vorgabeAusUebergabe(leseUebergabe('?von=expositionsklassen&deck=35&expo=XC3').daten!);
  pruefe(v3.vorgabe.rhM === 65 && v3.vorgabe.pSR === 0, 'XC3 geschützt');
  const v4 = vorgabeAusUebergabe(leseUebergabe('?von=expositionsklassen&deck=20&expo=XC1').daten!);
  pruefe(v4.vorgabe.rhM === undefined && v4.hinweise.some(h => h.feld === 'expo'), 'XC1: Feuchte nicht gesetzt, Hinweis');
  const v5 = vorgabeAusUebergabe(leseUebergabe('?von=expositionsklassen&deck=55&expo=XS1').daten!);
  pruefe(v5.vorgabe.zone === 'nebel', 'XS1 ohne Konvektionszone');
}
// K nach dem Wurzel-t-Gesetz: nur Vergleich, keine R⁻¹-Vorgabe
{
  const v = vorgabeAusUebergabe(leseUebergabe('?von=dauerhaftigkeit&mech=karbonatisierung&deck=30&tsl=50&knat=2.5').daten!);
  pruefe(v.kNat === 2.5 && v.vorgabe.rArt === undefined && v.hinweise.some(h => h.feld === 'kNat'), `K-Vergleich ${JSON.stringify(v)}`);
}

// 4. Prüfung (Plausibilitätsschicht): ungültige Werte werden nicht übernommen
{
  pruefe(leseUebergabe('').daten === null && leseUebergabe('?poll=abc').daten === null, 'ohne von keine Übergabe');
  const fremd = leseUebergabe('?von=startseite&deck=40');
  pruefe(fremd.daten === null && fremd.hinweise.length === 1, 'unbekannte Quelle');
  const r = leseUebergabe('?von=korrosion&deck=-5&tsl=abc&drcm=0&cs=3&a=1&mech=frost&bm=cemX&expo=XC4,XY9&deck_s=');
  pruefe(!!r.daten && r.daten.deckM === undefined && r.daten.tSL === undefined && r.daten.drcm === undefined && r.daten.a === undefined && r.daten.cS === 3, `ungültige Werte ${JSON.stringify(r.daten)}`);
  pruefe(r.daten?.mech === undefined && r.daten?.binder === undefined && r.daten?.expo?.join() === 'XC4' && r.daten?.deckS === undefined, 'Texte geprüft');
  pruefe(r.hinweise.length === 8 && r.hinweise.every(h => h.stufe === 'warnung'), `Hinweise ${r.hinweise.length}`);
  pruefe(leseUebergabe('?von=schnellkarbonatisierung&cacc=3').daten?.cAcc === undefined, 'c_acc nur mit K_AC');
  pruefe(leseUebergabe('?von=korrosion&deck=42,5').daten?.deckM === 42.5, 'Dezimalkomma wird gelesen');
  pruefe(UEBERGABE_SCHLUESSEL.includes('von') && UEBERGABE_SCHLUESSEL.includes('deck') && !UEBERGABE_SCHLUESSEL.includes('poll'), 'Schlüsselliste');
}

// 5. Fuzz: 1 000 zufällige Übergaben – keine Ausnahme, alle übernommenen Zahlen endlich und im Bereich
{
  let s = 99;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const quellen = ['schnellkarbonatisierung', 'korrosion', 'dauerhaftigkeit', 'bauwerksuntersuchung', 'expositionsklassen'] as const;
  const zahl = () => { const r = rnd(); return r < 0.1 ? NaN : r < 0.2 ? -rnd() * 10 : r < 0.25 ? 1e6 : rnd() * 120; };
  for (let i = 0; i < 1000; i++) {
    const u: LebensdauerUebergabe = {
      quelle: quellen[Math.floor(rnd() * quellen.length)],
      mech: rnd() < 0.5 ? 'karbonatisierung' : 'chlorid',
      tSL: zahl(), deckM: zahl(), deckS: zahl(), kac: zahl(), cAcc: zahl(), xcAcc: zahl(), rInv: zahl(), kNat: zahl(),
      drcm: zahl(), cS: zahl(), a: rnd() * 1.2, expo: rnd() < 0.5 ? ['XC4', 'XD3'] : ['XC2'],
    };
    try {
      const r = leseUebergabe(uebergabeSuche(u));
      const v = vorgabeAusUebergabe(r.daten!);
      const werte = Object.values(v.vorgabe).filter((x): x is number => typeof x === 'number');
      pruefe(werte.every(Number.isFinite) && werte.every(x => x >= 0 && x <= 1000), `Fuzz ${i}: ${JSON.stringify(v.vorgabe)}`);
      if (v.vorgabe.deckM !== undefined) pruefe(v.vorgabe.deckM > 0 && v.vorgabe.deckM <= 150, `Fuzz ${i}: Deckung`);
    } catch (e) { pruefe(false, `Fuzz ${i}: Ausnahme ${String(e)}`); }
  }
}

// 6. schnellkarbonatisierung-Kern unverändert (Beispiel A des Moduls)
{
  const e = schnellkarbonatisierung({ punkte: [{ tTage: 0, xMm: 0.5 }, { tTage: 7, xMm: 2.6 }, { tTage: 28, xMm: 5.1 }, { tTage: 70, xMm: 8.0 }], mitAchsenabschnitt: true, cAcc: 3, cNat: 0.04, deckung: 25, nutzungsdauer: 50 });
  pruefe(e.gueltig && nahe(e.kNat, e.kAC * umrechnungsfaktor(3, 0.04), 1e-12), 'Schnellkarbonatisierung');
}

if (fehler.length) { console.error('FAIL:\n' + fehler.slice(0, 20).join('\n')); process.exit(1); }
console.log('OK: Lebensdauer-Übergabe (Kerne gleich, Hin- und Rückweg, Prüfung, Fuzz)');
