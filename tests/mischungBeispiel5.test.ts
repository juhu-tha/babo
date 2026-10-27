// Z9 – Unabhängige Nachrechnung „Beispiel 5“ der Mischungsberechnung (C30/37, XC4/XF1, CEM II/A 32,5 R) mit
// Eigenfeuchte (Kernfeuchte) der Gesteinskörnung. Rechenweg von Hand, ohne den Rechenkern; danach Abgleich mit
// stoffraum() und den hinterlegten Beispieldaten.
//
// Quelle des Rechenschemas: InformationsZentrum Beton / VDZ, Zement-Merkblatt Betontechnik B 20 „Zusammensetzung von
// Normalbeton“, Ausgabe 2.2017 (beton.org), Abschn. 4 („Zugabewasser = Gesamtwassermenge − Oberflächenfeuchte −
// wässriger Anteil aus Zusatzmitteln“), Beispiel 4 (Abschn. 6.2) und Anhang Beispiel I; Grenzwerte XC4/XF1 Tafel 2
// (w/z ≤ 0,60, z ≥ 280 kg/m³, C25/30). Abgleich 27.10.2026: Die Zahlen von Beispiel 5 (318 kg Zement, 175 l Wasser,
// Rohdichte 2,60, 1,5 % Luft) stehen NICHT im Merkblatt B 20 – es ist ein eigenes Lehrbeispiel nach dessen Rechenschema.
import { stoffraum, ZEMENT_DATA, maxFaFaktor } from '../src/calc/mischung';
import { BENCHMARK_EXAMPLES } from '../src/data/mischungBeispiele';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const naheAbs = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Mischungsberechnung Beispiel 5 (Z9) ---');

// 1. Handrechnung (je m³ verdichteter Frischbeton)
const z = 318, rhoZ = 3.05, w = 175, luftProzent = 1.5, rhoG = 2.60;
const Vz = z / rhoZ;                       // 104,262 dm³
const Vw = w / 1.0;                        // 175,000 dm³
const Vl = luftProzent * 10;               // 15,000 dm³
const Vg = 1000 - Vz - Vw - Vl;            // 705,738 dm³
const g = Vg * rhoG;                       // 1 834,92 kg
const anteile = [0.40, 0.25, 0.35];        // 0/4, 4/8, 8/16
const gesamtfeuchte = [2.0, 1.0, 0.5];     // M.-% (Gesamtfeuchte im Lager)
const kernfeuchte = [0.5, 0.5, 0.5];       // M.-% (Wasseraufnahme/Eigenfeuchte, nicht wirksam)
const trocken = anteile.map(a => g * a);   // 733,97 / 458,73 / 642,22 kg
// Oberflächenfeuchte = Gesamtfeuchte − Kernfeuchte; nur sie ist wirksames Wasser (B 20, Abschn. 4)
const oberflaeche = trocken.map((m, i) => m * (gesamtfeuchte[i] - kernfeuchte[i]) / 100); // 11,010 / 2,294 / 0,000 l
const wOberflaeche = oberflaeche.reduce((a, b) => a + b, 0);   // 13,30 l
const zugabe = w - wOberflaeche;                               // 161,70 l
const feucht = trocken.map((m, i) => m * (1 + gesamtfeuchte[i] / 100)); // 748,65 / 463,32 / 645,43 kg
const rohdichte = (z + w + g) / 1000;                          // 2,328 kg/dm³
const wz = w / z;                                              // 0,550

pruefe(naheAbs(Vz, 104.262, 0.001) && naheAbs(Vg, 705.738, 0.001), `Stoffraum: V_z ${Vz.toFixed(3)}, V_g ${Vg.toFixed(3)}`);
pruefe(naheAbs(g, 1834.92, 0.01), `Gesteinsmasse ${g.toFixed(2)}`);
pruefe(naheAbs(trocken[0], 733.97, 0.01) && naheAbs(trocken[1], 458.73, 0.01) && naheAbs(trocken[2], 642.22, 0.01), `Fraktionen trocken ${trocken.map(x => x.toFixed(2))}`);
pruefe(naheAbs(wOberflaeche, 13.30, 0.01), `Oberflächenwasser ${wOberflaeche.toFixed(3)}`);
pruefe(naheAbs(zugabe, 161.70, 0.01), `Zugabewasser ${zugabe.toFixed(3)} statt 161,7`);
pruefe(naheAbs(feucht[0], 748.65, 0.01) && naheAbs(feucht[1], 463.32, 0.01) && naheAbs(feucht[2], 645.43, 0.01), `Fraktionen feucht ${feucht.map(x => x.toFixed(2))}`);
pruefe(naheAbs(rohdichte, 2.328, 0.0005) && naheAbs(wz, 0.550, 0.0005), `ρ ${rohdichte.toFixed(4)}, w/z ${wz.toFixed(4)}`);
// Massenbilanz: Zugabewasser + gesamtes Wasser in der feuchten Körnung − nicht wirksame Kernfeuchte = wirksames Wasser
const wasserImFeuchten = feucht.reduce((a, b) => a + b, 0) - g;
const kern = trocken.reduce((a, m, i) => a + m * kernfeuchte[i] / 100, 0);
pruefe(naheAbs(zugabe + wasserImFeuchten - kern, w, 1e-9), 'Wasserbilanz geschlossen');
// Grenzwerte XC4/XF1 nach B 20, Tafel 2: w/z ≤ 0,60, z ≥ 280 kg/m³
pruefe(wz <= 0.60 && z >= 280, 'Grenzwerte XC4/XF1 eingehalten');

// 2. Rechenkern und hinterlegte Daten gegen die Handrechnung
const b5 = BENCHMARK_EXAMPLES.find(b => b.id === 'bsp_vdz_b20_erstpruefung');
pruefe(!!b5, 'Beispiel 5 vorhanden');
if (b5) {
  pruefe(ZEMENT_DATA[b5.zementArt].rho === rhoZ && b5.rhoGestein === rhoG && b5.zement === z && b5.wasser === w && b5.luft === luftProzent, 'Eingangsdaten Beispiel 5');
  const r = stoffraum({
    zement: b5.zement, rhoZement: ZEMENT_DATA[b5.zementArt].rho, wasser: b5.wasser, fa: 0, sf: 0, hues: 0, biochar: 0, zusatzmittel: 0,
    luft: b5.luft, stahlfaser: 0, ppFaser: 0, rhoGestein: b5.rhoGestein ?? NaN,
    fraktionen: [[b5.f04, b5.feuchte04, b5.wa04], [b5.f48, b5.feuchte48, b5.wa48], [b5.f816, b5.feuchte816, b5.wa816], [b5.f1632, b5.feuchte1632, b5.wa1632]].map(([anteil, feuchte, wa]) => ({ anteil, feuchte, wa })),
    biocharFeuchte: 0, biocharWa: 0, k: { fa: 0.4, sf: 1.0, hues: 0.4, biochar: 0 }, maxFaFaktor: maxFaFaktor(b5.zementArt),
  });
  pruefe(naheAbs(r.zugabewasser, zugabe, 1e-9) && naheAbs(r.wasserAusGestein, wOberflaeche, 1e-9), `Kern: Zugabewasser ${r.zugabewasser}`);
  pruefe(naheAbs(r.masseGestein, g, 1e-9) && naheAbs(r.rohdichte, rohdichte, 1e-12), 'Kern: Gesteinsmasse und Rohdichte');
  // Hinterlegte (gerundete) Werte auf 0,1 genau
  pruefe(naheAbs(b5.feuchteRechnung.zugabewasser, zugabe, 0.05) && naheAbs(b5.feuchteRechnung.wasserAusGestein, wOberflaeche, 0.05), 'Daten: 161,7 / 13,3 l');
  pruefe(naheAbs(b5.massenTrocken.gesteinGesamt, g, 0.05) && naheAbs(b5.stoffraum.gesteinVol, Vg, 0.05), 'Daten: 1 834,9 kg / 705,7 dm³');
  pruefe(naheAbs(b5.feuchteRechnung.m04Feucht, feucht[0], 0.06) && naheAbs(b5.feuchteRechnung.m48Feucht, feucht[1], 0.06) && naheAbs(b5.feuchteRechnung.m816Feucht, feucht[2], 0.06), 'Daten: Feuchtmassen');
  pruefe(b5.normVorgaben.maxWz === 0.60, 'Daten: max. w/z 0,60');
  // Quellenangabe: kein Zitat als „offizielle Musteraufgabe“ aus B 20 (dort nicht enthalten)
  pruefe(!/Offizielle Musteraufgabe/.test(b5.beschreibung) && !b5.didaktischeHinweise.some(t => /Original-Referenz/.test(t)), 'Quellenangabe korrigiert');
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Beispiel 5 unabhängig nachgerechnet (Zugabewasser 161,7 l/m³)');
