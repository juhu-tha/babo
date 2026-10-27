// Rechenkern Gebäude-Ökobilanz (AP 4.10): A1–A3, B4 (BNB-Nutzungsdauern), B6 (QNG-Rechenwerte), C3/C4, D getrennt, je m² NRF(R)·a
import {
  lcaBilanz, ersatzzyklen, einzelbaustoffA1A4, B6_FAKTOREN, BNB_NUTZUNGSDAUER, TGA_SOCKEL, A4_FAKTOR_GEBAEUDE, A4_FAKTOR_EINZEL,
  type LcaBaustoff, type LcaEingabe, type LcaZeile, type Verwertung, type TgaSockel, type Energietraeger,
} from '../src/calc/lca';
import { MATERIAL_DATABASE, alsLcaBaustoff } from '../src/modules/interactivelcacalc/daten';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
const relNahe = (ist: number, soll: number, rel: number) => Math.abs(ist - soll) <= rel * Math.abs(soll);
console.log('--- Test: Gebäude-Ökobilanz (LCA) ---');

// 1. Ersatzzyklen: n = ⌈50/ND⌉ − 1 ≡ QNG-Regel „⌊50/ND⌋, kein Ersatz im 50. Jahr“
const ND: [number, number][] = [[5, 9], [15, 3], [20, 2], [25, 1], [30, 1], [40, 1], [45, 1], [50, 0], [60, 0], [10, 4], [12, 4], [17, 2]];
for (const [nd, n] of ND) pruefe(ersatzzyklen(nd, 50) === n, `Ersatzzyklen ND ${nd}: ${ersatzzyklen(nd, 50)} ≠ ${n}`);
for (let nd = 1; nd <= 60; nd++) {
  const qng = nd >= 50 ? 0 : Math.floor(49 / nd); // Ersatz in den Jahren nd, 2nd, … ≤ 49
  pruefe(ersatzzyklen(nd, 50) === qng, `Ersatzzyklen ND ${nd} ≠ QNG-Zählung ${qng}`);
}
pruefe(Number.isNaN(ersatzzyklen(0, 50)) && Number.isNaN(ersatzzyklen(-5, 50)), 'ND ≤ 0 → NaN');

// 2. Regressionstest gegen einen öffentlich dokumentierten QNG-Beispielbericht:
//    „Ökobilanz WG_EEI, Musterstraße 2, 14480 Potsdam“, Energie Effizienz Institut (W. Schöffel), EVEBI 13.0.6,
//    QNG-Regeln Stand 01.03.2023, Bericht vom 04.05.2023 – https://gebaeudebilanz.de/downloads/Anhang-Beispielbericht-WG2023-05-04.pdf
//    Abschnitt 4.1 (Bauprodukte: GWP A1–A3, B4, C3/C4, D, ND), 4.3 (Energie), 3.2/5 (Ergebnis je m² NRF·a).
//    Jede Bauteilzeile als „1 Stück“ mit den Summenwerten des Berichts; D-Referenz mit Kreislaufquote = Referenz,
//    Sortenreinheit 85 % und „high_grade“ (Faktor 1) → D unverändert. Hinweis: Der Bericht nennt NRF 1 067 m² > BGF 736 m²
//    (wohl Eingabefehler im Muster); maßgebend für den Vergleich ist die im Bericht verwendete NRF.
const BERICHT: [string, number, number, number, number][] = [ // [Bauprodukt, ND, A1–A3, C3/C4, D]
  ['Linoleum', 20, -1954, 2158, -267], ['Zementestrich', 50, 27631, 2259, 0], ['PP-Folie', 30, 206, 169, -83],
  ['EPS', 40, 1357, 1714, -903], ['Transportbeton C20/25', 50, 72115, 5007, -1529], ['Kalkgipsputz', 50, 3129, 315, 0],
  ['Acrylharzfarbe', 15, 1091, 6, -5], ['Bewehrungsstahl', 50, 34639, 0, 0], ['PA-Folie', 40, 1616, 502, -200],
  ['KVH', 50, -24004, 26930, -11687], ['Dachziegel', 50, 5078, 97, -30], ['Kalksandstein', 50, 79706, 3502, -1070],
  ['Mineralwolle Fassade', 40, 6754, 189, 0], ['Leichtputz', 50, 3162, 239, 0], ['Silikatfarbe', 20, 1133, 11, -8],
  ['Edelstahlprofil', 50, 4992, 0, -1119], ['Gipskarton', 50, 1222, 113, 0], ['Mineralwolle Boden', 50, 15041, 407, 0],
  ['Zementmörtel', 50, 455, 39, 0], ['Faserzement', 50, 4406, 123, 0], ['PVC-Plastisol', 5, 478, 538, -109],
  ['Bitumenbahn', 30, 277, 54, 0], ['Holz-Blendrahmen', 40, -98, 1071, -430], ['Holz-Flügelrahmen', 40, -38, 1050, -419],
  ['Dreifachverglasung', 30, 3787, 231, -92], ['Sonnenschutz', 15, 1971, 0, -1241], ['Edelstahlblech', 25, 134, 0, -26],
  ['Treppe Fertigteil', 50, 2503, 112, -31], ['Fliesen', 50, 742, 18, -5], ['Pufferspeicher', 20, 812, 133, -241],
  ['Luft-WP 14 kW', 20, 643, 48, -338], ['Lüftung WRG', 20, 2816, 4, -1717], ['PV-Anlage', 25, 42803, 1751, -5223],
  ['Türglas', 30, 57, 3, -1],
];
const stueck = (id: string, a: number, c: number, dd: number): LcaBaustoff => ({ id, einheit: 't', rohdichte: 0, gwpA1A3: a, gwpC: c, gwpD: dd, biogen: 0, penrt: 0, refKreislaufquote: 100 });
const berichtZeilen: LcaZeile[] = BERICHT.map(([id, nd, a, c, dd]) => ({ baustoff: stueck(id, a, c, dd), menge: 1, kreislaufquote: 100, sortenreinheit: 85, verwertung: 'high_grade', nutzungsdauer: nd }));
const BERICHT_E: LcaEingabe = {
  zeilen: berichtZeilen, nrfR: 1067, nrfBeheizt: 620, betrachtungszeitraum: 50, transportDistanz: 0, transportFaktor: 0, mitB4: true,
  // Abschnitt 4.3: Strom 25 450 kWh/a, Stromeigenerzeugung −15 622 kWh/a, Anwenderstrom 12 400 kWh/a (= 20 kWh/m² · 620 m²)
  energie: { stromGeg: 25450, pvEigennutzung: 15622, waerme: 0, waermeTraeger: 'netzstrom', nutzerstrom: true },
  tgaSockel: 'ep_ueber40', gebaeudeart: 'wohnbau',
};
const R = lcaBilanz(BERICHT_E);
pruefe(R.gueltig, 'Bericht: gültig');
// Summenzeile 4.1: A1–A3 294 659, B4 93 550, C3/C4 48 794 kg (Zeilensummen weichen durch Druckrundung um ±3 kg ab);
// D: Zeilensumme −26 774 kg, die gedruckte Summe −27 115 kg enthält laut Fußnote 7 zusätzlich den Stromexport (D2, −341 kg),
// der im Rechner nicht abgebildet ist. Sockel TGA 64 020 kg (1,20 · 1 067 · 50).
pruefe(relNahe(R.a1a3, 294659, 1e-4) && relNahe(R.c3c4, 48794, 1e-4) && nahe(R.d, -26774, 1e-9), `Bericht: Summen A/C/D ${R.a1a3} ${R.c3c4} ${R.d}`);
pruefe(relNahe(R.b4, 93550, 0.001), `Bericht: B4 ${R.b4} ≠ 93 550 (±0,1 %)`);
pruefe(nahe(R.sockelTga, 64020, 1e-6), `Bericht: Sockel ${R.sockelTga}`);
// Einzelzeilen B4 (Bericht): Linoleum 408, EPS 3 071, Acrylharzfarbe 3 291, PVC-Plastisol 9 150 (Druckrundung), PV 44 554
const b4 = (id: string) => R.zeilen.find(z => z.id === id)?.b4 ?? NaN;
pruefe(b4('Linoleum') === 408 && b4('EPS') === 3071 && b4('Acrylharzfarbe') === 3291 && nahe(b4('PVC-Plastisol'), 9150, 10) && b4('PV-Anlage') === 44554, 'Bericht: B4 je Bauteil');
// Ergebnis 5: Bau 9,39; Betrieb 11,08; Summe 20,47 kg CO₂-Äq./(m² NRF·a); QNG-PLUS erfüllt, PREMIUM nicht.
// D: Bericht −0,51 − 0,52 = −1,03 einschließlich Stromexport; ohne Export (−26 774 − 27 742)/53 350 = −1,022
pruefe(relNahe(R.spez.konstruktion, 9.39, 0.10) && nahe(R.spez.konstruktion, 9.39, 0.01), `Bericht: Konstruktion ${R.spez.konstruktion}`);
pruefe(relNahe(R.spez.b6, 11.08, 0.10) && nahe(R.spez.b6, 11.08, 0.01), `Bericht: B6 ${R.spez.b6}`);
pruefe(relNahe(R.spez.qng, 20.47, 0.10) && nahe(R.spez.qng, 20.47, 0.02), `Bericht: QNG-Wert ${R.spez.qng} ≠ 20,47 (±10 %, tatsächlich ±0,02)`);
pruefe(nahe(R.spez.d, -1.022, 0.001) && relNahe(R.spez.d, -1.03, 0.10), `Bericht: D ${R.spez.d}`);
pruefe(R.vollstaendig && R.aussage === 'plus', `Bericht: Aussage ${R.aussage}`);

// 3. Handbeispiel (nachvollziehbar): 100 m² NRF(R), 50 a, 10 m³ Beton (A1–A3 245, C 15 kg/m³, ND ≥ 50),
//    2 m³ EPS im WDVS (A1–A3 78, C 58 kg/m³, ND 40 → 1 Ersatz), ohne Transport, ohne TGA-Sockel.
//    A1–A3 = 2 450 + 156 = 2 606; C = 150 + 116 = 266; B4 = 1 · (156 + 116) = 272 kg
//    B6 (Netzstrom 0,53203 kg/kWh, QNG-Rechenwerte 2023 v1.3): Strom 2 000 kWh/a, PV 500 → 1 500 · 0,53203 · 50 = 39 902,25;
//    Nutzerstrom 20 · 100 · 0,53203 · 50 = 53 203 kg
//    Konstruktion (2 606 + 272 + 266)/5 000 = 0,6288; B6 93 105,25/5 000 = 18,62105; QNG-Wert 19,24985 → ≤ 20 (PREMIUM-Wert)
const beton = MATERIAL_DATABASE.find(m => m.id === 'beton-cem1')!;
const eps = MATERIAL_DATABASE.find(m => m.id === 'eps-daemmung')!;
const alsBaustoff = alsLcaBaustoff;
const HAND: LcaEingabe = {
  zeilen: [
    { baustoff: alsBaustoff(beton), menge: 10, kreislaufquote: 65, sortenreinheit: 85, verwertung: 'downcycling' },
    { baustoff: alsBaustoff(eps), menge: 2, kreislaufquote: 25, sortenreinheit: 85, verwertung: 'thermal' },
  ],
  nrfR: 100, betrachtungszeitraum: 50, transportDistanz: 0, transportFaktor: 0.15, mitB4: true,
  energie: { stromGeg: 2000, pvEigennutzung: 500, waerme: 0, waermeTraeger: 'netzstrom', nutzerstrom: true },
  tgaSockel: 'keiner', gebaeudeart: 'wohnbau',
};
const H = lcaBilanz(HAND);
pruefe(H.gueltig && nahe(H.a1a3, 2606, 1e-9) && nahe(H.c3c4, 266, 1e-9) && nahe(H.b4, 272, 1e-9), `Hand: A/B4/C ${H.a1a3} ${H.b4} ${H.c3c4}`);
pruefe(nahe(H.b6_1, 39902.25, 1e-6) && nahe(H.b6_3, 53203, 1e-6) && nahe(H.spez.konstruktion, 0.6288, 1e-9) && nahe(H.spez.qng, 19.24985, 1e-9), `Hand: B6/QNG ${H.b6} ${H.spez.qng}`);
pruefe(B6_FAKTOREN.netzstrom.gwp === 0.53203 && !B6_FAKTOREN.netzstrom.vorlaeufig && !H.vorlaeufig.some(v => v.includes('Netzstrom')), 'Netzstrom 0,53203 belegt, nicht mehr vorläufig');
pruefe(H.aussage === 'premium' && H.zeilen[1].ersatz === 1 && H.zeilen[0].ersatz === 0, `Hand: Aussage ${H.aussage}`);
//    D (Lehrmodell, unverändert übernommen): Beton 10 · (−8) · (65/65) · (85/85) · 0,55 = −44; EPS 2 · (−25) · 1 · 1 · 0,85 = −42,5
pruefe(nahe(H.d, -86.5, 1e-9) && nahe(H.spez.qng, H.spez.konstruktion + H.spez.b6, 1e-12), `Hand: D ${H.d}; D nicht im QNG-Wert`);
//    A4 nur informativ: 24 t + 0,04 t, 100 km · 0,15 → 360,6 kg, QNG-Wert unverändert
const H4 = lcaBilanz({ ...HAND, transportDistanz: 100 });
pruefe(nahe(H4.a4, 24.04 * 100 * 0.15, 1e-9) && nahe(H4.spez.qng, H.spez.qng, 1e-12), `Hand: A4 ${H4.a4} außerhalb QNG-Wert`);

// 4. Ergebnisaussage nur mit B4 und B6 (sonst neutral); Nichtwohngebäude und Δt ≠ 50 a neutral
pruefe(lcaBilanz({ ...HAND, energie: null }).aussage === 'neutral', 'ohne B6 → neutral');
pruefe(lcaBilanz({ ...HAND, mitB4: false }).aussage === 'neutral', 'ohne B4 → neutral');
pruefe(lcaBilanz({ ...HAND, gebaeudeart: 'nichtwohnbau' }).aussage === 'neutral', 'NWG → neutral');
const h60 = lcaBilanz({ ...HAND, betrachtungszeitraum: 60 });
pruefe(h60.aussage === 'neutral' && h60.hinweise.some(x => x.feld === 'betrachtungszeitraum'), 'Δt ≠ 50 → neutral mit Hinweis');
pruefe(lcaBilanz({ ...HAND, energie: { ...HAND.energie!, stromGeg: 12000 } }).aussage === 'ueberschritten', 'hoher Strombedarf → überschritten');
pruefe(lcaBilanz({ ...HAND, mitB4: false }).b4 === 0, 'ohne B4 → B4 = 0');
// Grenze: knapp unter/über 24 bzw. 20 kg/(m²·a) (Vergleich mit ≤)
const mitWert = (ziel: number) => { const netz = ((ziel - 0.6288) * 5000 - 53203) / (0.53203 * 50); return lcaBilanz({ ...HAND, energie: { ...HAND.energie!, stromGeg: netz + 500, pvEigennutzung: 500 } }); };
pruefe(nahe(mitWert(24).spez.qng, 24, 1e-9), `Grenze: Rückrechnung ${mitWert(24).spez.qng}`);
pruefe(mitWert(24 - 1e-6).aussage === 'plus' && mitWert(24 + 1e-6).aussage === 'ueberschritten', 'Grenze PLUS 24');
pruefe(mitWert(20 - 1e-6).aussage === 'premium' && mitWert(20 + 1e-6).aussage === 'plus', 'Grenze PREMIUM 20');

// 5. Randfälle und Fehler
pruefe(!lcaBilanz({ ...HAND, nrfR: 0 }).gueltig && !lcaBilanz({ ...HAND, nrfR: NaN }).gueltig, 'NRF ≤ 0 → Fehler');
pruefe(!lcaBilanz({ ...HAND, zeilen: [] }).gueltig, 'keine Baustoffe → Fehler');
pruefe(!lcaBilanz({ ...HAND, zeilen: [{ ...HAND.zeilen[0], menge: 0 }] }).gueltig, 'Menge 0 → Fehler');
pruefe(!lcaBilanz({ ...HAND, zeilen: [{ ...HAND.zeilen[0], nutzungsdauer: 0 }] }).gueltig, 'ND 0 → Fehler');
pruefe(!lcaBilanz({ ...HAND, zeilen: [{ ...HAND.zeilen[0], kreislaufquote: 120 }] }).gueltig, 'Quote > 100 → Fehler');
pruefe(!lcaBilanz({ ...HAND, energie: { ...HAND.energie!, waerme: -1 } }).gueltig, 'negative Endenergie → Fehler');
const pvUeber = lcaBilanz({ ...HAND, energie: { ...HAND.energie!, pvEigennutzung: 5000 } });
pruefe(pvUeber.gueltig && pvUeber.strom === 0 && pvUeber.hinweise.some(x => x.feld === 'pv'), 'PV > Strombedarf → B6.1 Strom 0 mit Hinweis');
const fw = lcaBilanz({ ...HAND, energie: { stromGeg: 0, pvEigennutzung: 0, waerme: 5000, waermeTraeger: 'fw_erdgas_kwk', nutzerstrom: false } });
pruefe(nahe(fw.b6, 5000 * 0.14776562 * 50, 1e-6), `Fernwärme Erdgas KWK ${fw.b6}`);
pruefe(lcaBilanz({ ...HAND, nrfBeheizt: 150 }).hinweise.some(x => x.feld === 'nrfBeheizt'), 'beheizte NRF > NRF(R) → Hinweis');
// Sockel TGA EH40: 1,30 kg/(m²·a)
pruefe(nahe(lcaBilanz({ ...HAND, tgaSockel: 'ep_bis40' }).spez.konstruktion, 0.6288 + 1.30, 1e-9), 'Sockel TGA EH40');

// 6. Datenbank: jede Baustoff-ID hat eine BNB-Nutzungsdauer mit Quelle
for (const m of MATERIAL_DATABASE) {
  const n = BNB_NUTZUNGSDAUER[m.id];
  pruefe(!!n && n.nd > 0 && n.quelle.length > 10, `Nutzungsdauer fehlt: ${m.id}`);
  pruefe(m.defaultCircularQuota > 0, `Referenzquote ${m.id}`);
}
pruefe(Object.values(B6_FAKTOREN).every(f => f.gwp > 0 && f.gwp < 1 && f.quelle.length > 10), 'B6-Faktoren mit Quelle');

// 7. Einzelbaustoff (LCA-Grundlagen): 10 m³ · 2 400 kg/m³ = 24 t; A4 = 24 · 150 · 0,101 = 363,6 kg (UBA 2024, Last-/Sattelzug);
//    A1–A3 = 10 · 245 = 2 450; gesamt 2 813,6 kg
const ez = einzelbaustoffA1A4({ menge: 10, volumenbezogen: true, rohdichte: 2400, gwpA1A3: 245, penrt: 1100, distanz: 150, transport: 'lkw-heavy' });
pruefe(ez.gueltig && nahe(ez.gwpA4, 363.6, 1e-9) && nahe(ez.gesamt, 2813.6, 1e-9) && nahe(ez.anteilA1A3 + ez.anteilA4, 100, 1e-9), `Einzelbaustoff ${ez.gwpA4} ${ez.gesamt}`);
// A4-Faktoren nach UBA, Vergleich der Emissionen im Güterverkehr 2024 (TREMOD 6.71B): Lkw gesamt 118, Last-/Sattelzüge 101,
// Lkw 3,5–7,5 t 561, Güterbahn 14 g CO₂-Äq./tkm
pruefe(A4_FAKTOR_GEBAEUDE.lkw === 0.118 && A4_FAKTOR_GEBAEUDE.bahn === 0.014, 'A4 Gebäuderechner UBA 2024');
pruefe(A4_FAKTOR_EINZEL['lkw-heavy'] === 0.101 && A4_FAKTOR_EINZEL['lkw-light'] === 0.561 && A4_FAKTOR_EINZEL.zug === 0.014, 'A4 Einzelrechner UBA 2024');
const holz = einzelbaustoffA1A4({ menge: 5, volumenbezogen: true, rohdichte: 500, gwpA1A3: -740, penrt: 1650, distanz: 100, transport: 'zug' });
pruefe(holz.anteilA1A3 <= 100 && holz.anteilA1A3 >= 0 && holz.gesamt < 0, 'Einzelbaustoff biogen: Anteile 0–100 %');
pruefe(!einzelbaustoffA1A4({ menge: 0, volumenbezogen: false, rohdichte: 0, gwpA1A3: 1, penrt: 1, distanz: 10, transport: 'zug' }).gueltig, 'Einzelbaustoff Menge 0 → Fehler');

// 8. Fuzz: 1 000 Zufallseingaben – endlich, Monotonie in B6 und B4, D außerhalb des QNG-Werts
let zufall = 4711;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
const VW: Verwertung[] = ['high_grade', 'downcycling', 'reuse', 'thermal'];
const TG: TgaSockel[] = ['keiner', 'ep_ueber40', 'ep_bis40'];
const ET = Object.keys(B6_FAKTOREN) as Energietraeger[];
for (let i = 0; i < 1000; i++) {
  const zeilen: LcaZeile[] = Array.from({ length: 1 + Math.floor(rnd() * 6) }, () => {
    const m = MATERIAL_DATABASE[Math.floor(rnd() * MATERIAL_DATABASE.length)];
    return { baustoff: alsBaustoff(m), menge: 0.1 + rnd() * 200, kreislaufquote: rnd() * 100, sortenreinheit: rnd() * 100, verwertung: VW[Math.floor(rnd() * 4)], nutzungsdauer: rnd() < 0.5 ? undefined : 1 + rnd() * 80 };
  });
  const e: LcaEingabe = {
    zeilen, nrfR: 30 + rnd() * 3000, betrachtungszeitraum: 50, transportDistanz: rnd() * 800, transportFaktor: rnd() < 0.5 ? 0.15 : 0.03, mitB4: rnd() < 0.8,
    energie: rnd() < 0.8 ? { stromGeg: rnd() * 50000, pvEigennutzung: rnd() * 20000, waerme: rnd() * 50000, waermeTraeger: ET[Math.floor(rnd() * ET.length)], nutzerstrom: rnd() < 0.7 } : null,
    tgaSockel: TG[Math.floor(rnd() * 3)], gebaeudeart: rnd() < 0.8 ? 'wohnbau' : 'nichtwohnbau',
  };
  const a = lcaBilanz(e);
  const werte = [a.a1a3, a.a4, a.b4, a.c3c4, a.b6, a.d, ...Object.values(a.spez), a.umi, a.kreislaufquoteGebaeude, a.penrtKwhJeM2a];
  pruefe(a.gueltig && werte.every(Number.isFinite), `Fuzz ${i}: nicht endlich`);
  pruefe(a.b6 >= 0 && a.a4 >= 0 && a.zeilen.every(z => Number.isInteger(z.ersatz) && z.ersatz >= 0), `Fuzz ${i}: Vorzeichen/Ersatz`);
  pruefe(nahe(a.spez.qng, a.spez.konstruktion + a.spez.b6, 1e-9 * Math.max(1, Math.abs(a.spez.qng))), `Fuzz ${i}: QNG = Konstruktion + B6`);
  pruefe(a.aussage === 'neutral' || (a.enthaeltB4 && a.enthaeltB6 && e.gebaeudeart === 'wohnbau'), `Fuzz ${i}: Aussage ohne B4/B6`);
  if (e.energie) {
    const mehr = lcaBilanz({ ...e, energie: { ...e.energie, waerme: e.energie.waerme + 1000 } });
    pruefe(mehr.spez.b6 > a.spez.b6, `Fuzz ${i}: B6 monoton`);
  }
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Gebäude-Ökobilanz');
