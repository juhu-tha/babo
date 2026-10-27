// Rechenkern Eisen-Kohlenstoff-Diagramm (Z24, Modul „Stahl“): Phasenfelder, Hebelgesetz, CEV
import { feCZustand, gefuegeAnteile, liquidus, solidus, cev, cevBewertung, schweisseignung, FE_C_PUNKTE, FE_C_KENNWERTE, FE_C_LINIEN, CEV_GRENZEN } from '../src/calc/eisenKohlenstoff';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.max(1e-9, Math.abs(soll));
console.log('--- Test: Eisen-Kohlenstoff ---');

// 1. Literaturbeispiel Hebelgesetz: Callister, Materials Science and Engineering (MSE 170, Univ. Washington, Folie 12–14):
//    Stahl mit 0,40 % C knapp unter der eutektoiden Temperatur: Perlit 51,2 %, voreutektoider Ferrit 48,8 %
const cal = gefuegeAnteile(0.4, 'international');
pruefe(nahe(cal.perlit, 0.512, 1e-3) && nahe(cal.ferrit, 0.488, 2e-3), `Callister 0,40 % C: Perlit ${cal.perlit}`);
pruefe(nahe(cal.zementitGesamt, (0.4 - 0.022) / (6.7 - 0.022), 1e-12), 'Callister Fe₃C gesamt');
// Lehrbuchwerte (0,02 / 0,8 / 6,67 %): 0,4 % C → Perlit = 0,38/0,78 = 48,7 %
const lb = gefuegeAnteile(0.4);
pruefe(nahe(lb.perlit, 0.38 / 0.78, 1e-12) && nahe(lb.ferrit + lb.perlit, 1, 1e-12), `Lehrbuch 0,4 % C ${lb.perlit}`);
// Baustahl S235JR mit C_max = 0,17 %: Perlit = 0,15/0,78 = 19,2 %
pruefe(nahe(gefuegeAnteile(CEV_GRENZEN.S235JR.cMax).perlit, 0.15 / 0.78, 1e-12), 'S235 Perlitanteil');
// eutektoid, übereutektoid, Grenzen
pruefe(gefuegeAnteile(0.8).perlit === 1 && gefuegeAnteile(0.02).ferrit === 1 && gefuegeAnteile(0).ferrit === 1, 'eutektoid / Ferrit');
const ue = gefuegeAnteile(1.2);
pruefe(nahe(ue.sekundaerzementit, 0.4 / 5.87, 1e-12) && nahe(ue.perlit, 1 - 0.4 / 5.87, 1e-12) && ue.ferrit === 0, `1,2 % C ${ue.sekundaerzementit}`);
// Gusseisen: 4,3 % → 100 % Ledeburit; 3,0 % → Ledeburit (3 − 2,06)/(4,3 − 2,06) = 42,0 %; 5,0 % → Primärzementit 0,7/2,37
pruefe(gefuegeAnteile(4.3).ledeburit === 1, 'eutektisch');
const g3 = gefuegeAnteile(3);
pruefe(nahe(g3.ledeburit, 0.94 / 2.24, 1e-12) && nahe(g3.ledeburit + g3.perlit + g3.sekundaerzementit, 1, 1e-12) && g3.hinweise.some(h => /Gusseisen/.test(h.text)), 'untereutektisch');
pruefe(nahe(gefuegeAnteile(5).primaerzementit, 0.7 / 2.37, 1e-12), 'übereutektisch');
// Massenbilanz: Summe der C-Anteile = C-Gehalt (Perlit c_S, Ferrit c_P, Zementit c_Z) für Stahl
for (const c of [0.1, 0.35, 0.6, 1.0, 1.8]) {
  const a = gefuegeAnteile(c), k = FE_C_KENNWERTE.lehrbuch;
  pruefe(nahe(a.ferrit * k.cP + a.perlit * k.cS + a.sekundaerzementit * k.cZ, c, 1e-12), `C-Bilanz ${c}`);
}

// 2. Phasenfelder (Lehrbuchgeometrie, Linien geradlinig)
const feld = (c: number, t: number) => feCZustand(c, t).feld;
pruefe(feld(0.4, 900) === 'γ' && feld(0.4, 800) === 'α + γ' && feld(0.4, 600) === 'α + Fe₃C', `0,4 % C: ${feld(0.4, 900)}/${feld(0.4, 800)}/${feld(0.4, 600)}`);
pruefe(feld(1.0, 800) === 'γ' && feld(1.2, 800) === 'γ + Fe₃C', `1,0/1,2 % bei 800 °C: ${feld(1.0, 800)}/${feld(1.2, 800)}`);
pruefe(feld(3, 1300) === 'S' && feld(3, 1200) === 'S + γ' && feld(5, 1200) === 'S' && feld(5, 1170) === 'S + Fe₃C', 'Gusseisen oberhalb ECF');
pruefe(feld(0.05, 1450) === 'δ' && feld(0.07, 1450) === 'δ + γ' && feld(0.05, 1510) === 'δ' && feld(0.3, 1510) === 'S + δ', 'δ-Bereich');
pruefe(feld(0, 1000) === 'γ' && feld(0, 800) === 'α' && feld(3, 900) === 'γ + Fe₃C' && feld(0.005, 300) === 'α' && feld(0.015, 300) === 'α + Fe₃C', 'Randfelder');
// Konode im α+γ-Feld bei 800 °C: c_α = 0,02·(911 − 800)/188, c_γ = 0,8·(911 − 800)/188
const k = feCZustand(0.4, 800).konode!;
const ca = 0.02 * 111 / 188, cg = 0.8 * 111 / 188;
pruefe(nahe(k.cLinks, ca, 1e-12) && nahe(k.cRechts, cg, 1e-12) && nahe(k.anteilRechts, (0.4 - ca) / (cg - ca), 1e-12), `Konode ${JSON.stringify(k)}`);
// Eckpunkte: eutektoid 0,8 %/723 °C, eutektisch 4,3 %/1147 °C; Liquidus und Solidus treffen sich in C
pruefe(FE_C_PUNKTE.S.c === 0.8 && FE_C_PUNKTE.S.t === 723 && FE_C_PUNKTE.C.c === 4.3 && FE_C_PUNKTE.C.t === 1147 && FE_C_PUNKTE.K.c === 6.67, 'Eckpunkte');
pruefe(liquidus(4.3) === 1147 && solidus(4.3) === 1147 && liquidus(0) === 1536 && nahe(liquidus(6.67), 1320, 1e-12), 'Liquidus/Solidus');
pruefe(FE_C_LINIEN.some(l => l.id === 'gos') && FE_C_LINIEN.some(l => l.id === 'psk') && FE_C_LINIEN.some(l => l.id === 'ecf'), 'Linien GSK/PSK/ECF');
// Gefüge bei Raumtemperatur
pruefe(/untereutektoid/.test(feCZustand(0.17, 20).gefuege) && /Perlit \(eutektoid\)/.test(feCZustand(0.8, 20).gefuege) && /Ledeburit II \(eutektisch\)/.test(feCZustand(4.3, 20).gefuege), 'Gefügebezeichnungen');
pruefe(feCZustand(1.5, 20).werkstoff === 'Stahl' && feCZustand(2.5, 20).werkstoff === 'Gusseisen', 'Stahl/Gusseisen');

// 3. Schweißeignung: CEV = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 (EN 10025-2)
//    Handrechnung S355: C 0,18, Mn 1,40, Cr 0,05, Mo 0,02, V 0, Ni 0,10, Cu 0,20 → 0,18 + 0,2333 + 0,014 + 0,02 = 0,4473
pruefe(nahe(cev({ C: 0.18, Mn: 1.4, Cr: 0.05, Mo: 0.02, V: 0, Ni: 0.1, Cu: 0.2 }), 0.18 + 1.4 / 6 + 0.07 / 5 + 0.3 / 15, 1e-12), 'CEV Handrechnung');
pruefe(schweisseignung(0.35).stufe === 'ausgezeichnet' && schweisseignung(0.43).stufe === 'gut' && schweisseignung(0.55).stufe === 'schlecht', 'Einstufung');
pruefe(/ohne Vorwärmen/.test(schweisseignung(0.38).vorwaermen) && /kann/.test(schweisseignung(0.5).vorwaermen) && /erforderlich, ggf/.test(schweisseignung(0.65).vorwaermen), 'Vorwärmen');
pruefe(cevBewertung({ C: -0.1, Mn: 1 }).hinweise.some(h => h.stufe === 'fehler'), 'negativer Gehalt → Fehler');
pruefe(cevBewertung({ C: 0.3, Mn: 1 }).hinweise.some(h => h.feld === 'C'), 'C > 0,25 → Warnung');

// 4. Fehler
pruefe(feCZustand(7, 500).hinweise.some(h => h.stufe === 'fehler') && feCZustand(0.4, NaN).hinweise.some(h => h.stufe === 'fehler'), 'Eingabefehler');
pruefe(gefuegeAnteile(6.8).hinweise.some(h => h.stufe === 'fehler') && !gefuegeAnteile(6.7, 'international').hinweise.some(h => h.stufe === 'fehler'), 'Grenze 6,67/6,70 %');

// 5. Fuzz: 1000 Zufallseingaben → Fehler oder gültige Anteile/Felder
let zufall = 1147;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
let gueltig = 0;
for (let i = 0; i < 1000; i++) {
  const c = rnd() * 7.2 - 0.2, t = rnd() * 1800 - 50;
  const z = feCZustand(c, t);
  const a = gefuegeAnteile(c, rnd() < 0.5 ? 'lehrbuch' : 'international');
  const l = cevBewertung({ C: rnd() * 0.4, Mn: rnd() * 2, Cr: rnd(), Mo: rnd() * 0.3, V: rnd() * 0.1, Ni: rnd(), Cu: rnd() * 0.5 });
  pruefe(Number.isFinite(l.cev), `Fuzz CEV ${i}`);
  if (z.hinweise.some(h => h.stufe === 'fehler')) continue;
  gueltig++;
  pruefe(z.phasen.length >= 1 && z.phasen.length <= 2 && z.feld !== '–', `Fuzz Feld ${i}: c=${c}, t=${t}`);
  if (z.konode) pruefe([z.konode.cLinks, z.konode.cRechts, z.konode.anteilLinks, z.konode.anteilRechts].every(Number.isFinite) && z.konode.anteilRechts >= 0 && z.konode.anteilRechts <= 1, `Fuzz Konode ${i}: c=${c}, t=${t}`);
  if (!a.hinweise.some(h => h.stufe === 'fehler')) {
    const s = a.ferrit + a.perlit + a.sekundaerzementit + a.ledeburit + a.primaerzementit;
    pruefe(nahe(s, 1, 1e-9) && [a.ferrit, a.perlit, a.sekundaerzementit, a.ledeburit, a.primaerzementit].every(x => x >= -1e-12), `Fuzz Anteile ${i}: c=${c}`);
  }
}
pruefe(gueltig > 500, `Fuzz: nur ${gueltig} gültige Fälle`);

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Eisen-Kohlenstoff (${gueltig} gültige Fuzz-Fälle)`);
