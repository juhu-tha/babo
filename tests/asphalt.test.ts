// Rechenkern Asphalt & Bitumen: Roh-/Raumdichte, Marshall-Lehrkurve, Niedrigtemperaturasphalt (AP 4.2)
import { asphaltRohdichte, asphaltRaumdichte, marshallLehrmodell, marshallKurve, ntaModell, NTA, type NtaVerfahren } from '../src/calc/asphalt';
import { asphaltHohlraum } from '../src/calc/verkehrswegebau';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Asphalt ---');

// 1. Handbeispiel des Moduls (content/asphalt/Asphalt.json, „Asphalt.schritte“; Definitionen DIN EN 12697-5/-6/-8):
//    B = 5,0 M.-%, V_m = 3,0 Vol.-%, ρ_G = 2,65, ρ_B = 1,03 g/cm³
//    V_fest = 95/2,65 + 5/1,03 = 35,849 + 4,854 = 40,704 cm³; ρ_m = 100/40,704 = 2,4568; ρ_b = 2,4568·0,97 = 2,3831 g/cm³
const r = asphaltRaumdichte({ bitumen: 5, hohlraum: 3, rhoGestein: 2.65, rhoBitumen: 1.03 });
pruefe(r.gueltig && r.hinweise.length === 0, 'Startwerte gültig ohne Hinweis');
pruefe(nahe(r.feststoffVolumen, 40.7034, 1e-4) && nahe(r.rohdichte, 2.45680, 1e-5) && nahe(r.raumdichte, 2.38310, 1e-5), `Raumdichte ${JSON.stringify(r)}`);
pruefe(nahe(r.raumdichte, r.rohdichte * 0.97, 1e-12), 'ρ_b = ρ_m·(1 − V_m/100)');
//    Rundreise mit dem Kern Verkehrswegebau: aus ρ_b zurück auf V_m = 3,0 Vol.-%
const zur = asphaltHohlraum({ gesteinAnteil: 95, bitumenAnteil: 5, rhoGestein: 2.65, rhoBitumen: 1.03, raumdichteMischung: r.raumdichte });
pruefe(nahe(zur.hohlraum, 3, 1e-10) && nahe(zur.maxDichte, r.rohdichte, 1e-12), `Rundreise V_m ${zur.hohlraum}`);
//    Literaturwert Verkehrswegebau-Test (94,5/5,5; 2,68/1,02): ρ_m = 2,4598 g/cm³
pruefe(nahe(asphaltRohdichte(94.5, 5.5, 2.68, 1.02), 2.45982, 1e-5), 'Rohdichte wie verkehrswegebau.test.ts');

// 2. Randfälle und Grenzen
pruefe(nahe(asphaltRaumdichte({ bitumen: 0, hohlraum: 0, rhoGestein: 2.65, rhoBitumen: 1.03 }).raumdichte, 2.65, 1e-12), 'B = 0, V = 0 → Gesteinsdichte');
pruefe(nahe(asphaltRaumdichte({ bitumen: 100, hohlraum: 0, rhoGestein: 2.65, rhoBitumen: 1.03 }).raumdichte, 1.03, 1e-12), 'B = 100 → Bitumendichte');
pruefe(!asphaltRaumdichte({ bitumen: 5, hohlraum: 100, rhoGestein: 2.65, rhoBitumen: 1.03 }).gueltig, 'V = 100 % → Fehler');
pruefe(!asphaltRaumdichte({ bitumen: 5, hohlraum: 3, rhoGestein: 0, rhoBitumen: 1.03 }).gueltig, 'ρ_G = 0 → Fehler');
pruefe(!asphaltRaumdichte({ bitumen: -1, hohlraum: 3, rhoGestein: 2.65, rhoBitumen: 1.03 }).gueltig && !asphaltRaumdichte({ bitumen: NaN, hohlraum: 3, rhoGestein: 2.65, rhoBitumen: 1.03 }).gueltig, 'B < 0 / NaN → Fehler');

// 3. Marshall-Lehrkurve: Optimum 12 kN bei 5,5 M.-%, je M.-% Abstand −2 kN, Untergrenze 2 kN
pruefe(marshallLehrmodell(5.5) === 12 && marshallLehrmodell(5) === 11 && marshallLehrmodell(2) === 5 && marshallLehrmodell(10) === 3 && marshallLehrmodell(20) === 2, 'Marshall-Werte');
const k = marshallKurve(5);
pruefe(k.length === 17 && k[0].bitumen === 2 && k[16].bitumen === 10, 'Kurve 2 … 10 M.-% in 0,5er-Schritten');
pruefe(k.filter(p => p.aktuell).length === 1 && k.find(p => p.aktuell)?.bitumen === 5, 'genau ein markierter Punkt');
pruefe(marshallKurve(5.25).filter(p => p.aktuell).length === 0, 'B genau zwischen zwei Stützstellen: keine Markierung (wie bisher)');

// 4. NTA-Lehrmodell, Startwerte (organische Wachse, 125 °C, 30 % RC) – Handrechnung:
//    η = 0,4·1,06^40·0,38 = 1,5639 Pa·s → optimal; c = 0,045·e^(0,029·125) = 1,6889 mg/m³ (113 % AGW)
//    Minderung 1 − e^(−0,029·40) = 68,7 % → 69 %; E = 88·(1 − 40·0,0102) = 52,096 kWh/t → 41 %
//    Heizöl (88 − 52,096)/10 = 3,5904 l/t = 3 590 l je 1 000 t; CO₂ = 22·0,592 − 30·0,13 = 9,124 kg/t → 59 %
//    Zeitfenster 38·ln(110/70) = 17,18 → 17 min
const n = ntaModell({ verfahren: 'organic', temperatur: 125, rcAnteil: 30 });
pruefe(n.gueltig && nahe(n.viskositaet, 0.4 * Math.pow(1.06, 40) * 0.38, 1e-12) && nahe(n.viskositaet, 1.5634, 1e-3) && n.bewertung === 'optimal', `NTA η ${n.viskositaet}`);
pruefe(nahe(n.aerosol, 1.6889, 1e-3) && n.aerosolAnteilAgw === 113 && n.aerosolMinderung === 69, `Aerosol ${n.aerosol} ${n.aerosolMinderung}`);
pruefe(nahe(n.energie, 52.096, 1e-9) && n.energieEinsparung === 41 && nahe(n.heizoelJeT, 3.5904, 1e-9) && nahe(n.heizoelJe1000t, 3590.4, 1e-6), 'Energie/Heizöl');
pruefe(nahe(n.co2, 9.124, 1e-9) && n.co2Einsparung === 59 && nahe(n.co2VermiedenJe1000t, 12876, 1e-6), 'CO₂');
pruefe(n.grenzTemperatur === 85 && n.verdichtungsfenster === 17, `Zeitfenster ${n.verdichtungsfenster}`);
//    Referenz Heißasphalt 165 °C: keine Einsparung, Viskosität 0,4 Pa·s
const ref = ntaModell({ verfahren: 'standard', temperatur: 165, rcAnteil: 0 });
pruefe(ref.viskositaet === 0.4 && ref.energieEinsparung === 0 && ref.heizoelJeT === 0 && ref.co2 === 22 && ref.aerosolMinderung === 0, 'Referenz 165 °C');
//    Standard bei 125 °C: zu zäh (0,4·1,06^40 = 4,11 Pa·s → erschwert), unter Grenztemperatur 130 °C kein Fenster
const st = ntaModell({ verfahren: 'standard', temperatur: 125, rcAnteil: 0 });
pruefe(st.bewertung === 'erschwert' && st.verdichtungsfenster === 0, 'Standard 125 °C');
pruefe(ntaModell({ verfahren: 'standard', temperatur: 100, rcAnteil: 0 }).bewertung === 'blockiert', '100 °C ohne Zusatz → blockiert');
//    Zusatzmittel wirkt erst ab Mindesttemperatur (Zeolith 105 °C)
pruefe(nahe(ntaModell({ verfahren: 'zeolite', temperatur: 100, rcAnteil: 0 }).viskositaet, 0.4 * Math.pow(1.06, 65), 1e-12), 'Zeolith unter 105 °C ohne Minderung');
//    Modelluntergrenze CO₂ 3,5 kg/t mit Hinweis
const co2min = ntaModell({ verfahren: 'organic', temperatur: 110, rcAnteil: 100 });
pruefe(co2min.co2 === NTA.co2Min && co2min.hinweise.some(x => x.feld === 'rcAnteil'), 'CO₂-Untergrenze');
pruefe(!ntaModell({ verfahren: 'organic', temperatur: NaN, rcAnteil: 30 }).gueltig && !ntaModell({ verfahren: 'organic', temperatur: 125, rcAnteil: -5 }).gueltig, 'NTA unzulässig');
pruefe(ntaModell({ verfahren: 'organic', temperatur: 190, rcAnteil: 30 }).hinweise.some(x => x.feld === 'temperatur'), 'Temperatur außerhalb Modellbereich → Hinweis');

// 5. Fuzz: 1 000 Zufallseingaben ohne NaN/∞ bei gültigem Ergebnis
let seed = 4711;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
const verfahren: NtaVerfahren[] = ['standard', 'organic', 'zeolite', 'foamed'];
for (let i = 0; i < 1000; i++) {
  const rd = asphaltRaumdichte({ bitumen: z(-5, 105), hohlraum: z(-5, 105), rhoGestein: z(-0.5, 3.2), rhoBitumen: z(-0.5, 1.2) });
  const nt = ntaModell({ verfahren: verfahren[i % 4], temperatur: z(60, 220), rcAnteil: z(-10, 110) });
  const mk = marshallKurve(z(0, 12));
  const zahlen = [
    ...(rd.gueltig ? [rd.feststoffVolumen, rd.rohdichte, rd.raumdichte] : []),
    ...(nt.gueltig ? [nt.viskositaet, nt.aerosol, nt.aerosolMinderung, nt.energie, nt.heizoelJe1000t, nt.co2, nt.co2VermiedenJe1000t, nt.verdichtungsfenster] : []),
    ...mk.map(p => p.stabilitaet),
  ];
  if (!zahlen.every(Number.isFinite) || (rd.gueltig && rd.raumdichte <= 0) || (nt.gueltig && nt.co2 < NTA.co2Min)) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Asphalt');
