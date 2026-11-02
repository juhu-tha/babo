// Nachstichprobe 5c (02.11.2026): die 16 freigegebenen Fachmodule, die nach Nachstichprobe 5a/5b offen blieben
// (Positionen 51 bis 66 der alphabetischen Restliste; Befundliste docs/pruefung/nachstichprobe5c-2026-11-02.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (Python, eigene Umsetzung der Gleichungen), nicht aus den Kernen.
// Zusätzlich sichert der Test die Korrekturen NS5C-* gegen ein Zurückfallen.
import { readFileSync } from 'node:fs';
import { pfasSummenbewertung, istKurzkettig, PFAS20, type PfasId } from '../src/calc/pfas';
import { bemesseZugstab, biegewiderstandY, bemesseDruckstab, profil, klassifiziere } from '../src/calc/stahlbau';
import { kombination610 } from '../src/calc/sicherheitskonzept';
import { zinkSchutzdauer } from '../src/calc/korrosionsschutz';
import { putzbedarf } from '../src/calc/moertelbedarf';
import pfasInhalt from '../content/pfasbaustoffe/PfasBaustoffe.json';
import aktualitaet from '../content/rueckbau/AktualitaetTab.json';
import ndr from '../content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json';
import definitionen from '../content/nachhaltigkeitdatenregeln/DefinitionenTab.json';
import metallkorrosion from '../content/metallkorrosion/Metallkorrosion.json';
import quiz from '../src/data/quiz.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Nachstichprobe 5c (02.11.2026, Nachrechnungen und Korrekturen) ---');

// stahlbau_ec3: Beispiel 1 (Flachstahl 120 × 10, ein Loch 22 mm), Beispiel 2 (IPE 300, S235), Beispiel 3 (HEB 200, L_cr = 4 m)
const zug = bemesseZugstab({ A: 12.0, Anet: 9.8, guete: 'S235', nEd: 200 });
pruefe('ST N_pl,Rd', zug.NplRd, 282.0); pruefe('ST N_u,Rd', zug.NuRd, 254.016); gilt(zug.nettoMassgebend, 'ST Nettoquerschnitt maßgebend');
pruefe('ST Quiz qn_stahlbau_ec3_3 N_u,Rd', bemesseZugstab({ A: 10.0, Anet: 8.2, guete: 'S235', nEd: 100 }).NuRd, 212.544);
const ipe = profil('IPE 300');
gilt(!!ipe, 'ST IPE 300 vorhanden');
if (ipe) {
  const b = biegewiderstandY(ipe, 'S235');
  pruefe('ST M_pl,Rd IPE 300', b.MplRd, 147.674); pruefe('ST M_el,Rd IPE 300', b.MelRd, 130.919);
  gilt(b.klasse.klasse === 1, 'ST IPE 300 Biegung Klasse 1');
  gilt(klassifiziere(ipe, 235, 'druck').steg.klasse === 2 && klassifiziere(ipe, 355, 'druck').steg.klasse === 4, 'ST Steg unter Druck S235 Kl. 2, S355 Kl. 4 (qn_stahlbau_ec3_6)');
}
const heb = bemesseDruckstab({ profil: 'HEB 200', guete: 'S235', LcrY: 4.0, LcrZ: 4.0, nEd: 800 });
pruefe('ST λ̄_z', heb.z.lambdaQuer, 0.8401); pruefe('ST χ_z', heb.z.chi, 0.6369); pruefe('ST N_b,z,Rd', heb.z.NbRd, 1062.8);
pruefe('ST λ̄_y', heb.y.lambdaQuer, 0.4988); pruefe('ST χ_y', heb.y.chi, 0.8848); pruefe('ST N_b,y,Rd', heb.y.NbRd, 1476.3);
pruefe('ST N_c,Rd', heb.NcRd, 1835.35); gilt(heb.massgebend === 'z', 'ST HEB 200 maßgebend z');
pruefe('ST Quiz qn_stahlbau_ec3_7 L = 3 m', bemesseDruckstab({ profil: 'HEB 200', guete: 'S235', LcrY: 3, LcrZ: 3, nEd: 0 }).z.NbRd, 1280.0, 3e-3);
pruefe('ST Quiz qn_stahlbau_ec3_7 L = 6 m', bemesseDruckstab({ profil: 'HEB 200', guete: 'S235', LcrY: 6, LcrZ: 6, nEd: 0 }).z.NbRd, 677.6, 3e-3);

// sicherheitskonzept: Beispiel 1 (Innenstütze) und Standardeingabe des Rechners
pruefe('SK Beispiel 1 N_Ed', kombination610({ gk: 800, qk1: 300, qk2: 0, psi01: 0.7, psi02: 0.6, gammaG: 1.35, gammaQ: 1.5 }).ed, 1530);
pruefe('SK Rechner Standard', kombination610({ gk: 10, qk1: 5, qk2: 3, psi01: 0.7, psi02: 0.6, gammaG: 1.35, gammaQ: 1.5 }).edMax, 23.7);

// metallkorrosion: Beispiel 1 (85 µm in C3) und Quiz qn_metallkorrosion_2 (120 µm in C4) mit dem oberen Abtragswert
pruefe('MK Schutzdauer 85 µm C3', zinkSchutzdauer({ dZn: 85, kategorie: 'C3', ziel: 'H', duplex: false, tBeschichtung: 0, synergie: 1 }).tMin, 40.476);
pruefe('MK Schutzdauer 120 µm C4', zinkSchutzdauer({ dZn: 120, kategorie: 'C4', ziel: 'H', duplex: false, tBeschichtung: 0, synergie: 1 }).tMin, 28.571);

// putzemoertel: Beispiel Gipsputz und Quiz qn_putzemoertel_1
const gips = putzbedarf({ flaeche: 50, dickeMm: 15, art: 'gips' });
pruefe('PM Gipsputz Masse', gips.masse, 825); gilt(gips.saecke === 33, 'PM 33 Säcke');
gilt(putzbedarf({ flaeche: 80, dickeMm: 20, art: 'kalkzement' }).saecke === 80, 'PM Quiz qn_putzemoertel_1: 80 Säcke');

// pfas_baustoffe: Rechnerbeispiel (BG = 1 ng/l, Ansatz BG/2) und Korrektur NS5C-PF-1
const gemessen: Partial<Record<PfasId, number>> = { PFBA: 12, PFPeA: 8, PFHxA: 15, PFHpA: 4, PFOA: 9, PFNA: 2, PFBS: 10, PFHxS: 6, PFOS: 11 };
const pf = pfasSummenbewertung({ werte: Object.fromEntries(PFAS20.map(s => [s.id, gemessen[s.id] ?? null])), bg: 1, ansatz: 'halb' });
pruefe('PF Σ PFAS-20', pf.pfas20.summe, 82.5); pruefe('PF Σ PFAS-4', pf.pfas4.summe, 28);
pruefe('NS5C-PF-1 Anteil kurzkettig 49,5/82,5', pf.anteilKurzkettig, 0.6, 1e-9);
const kurz = PFAS20.filter(istKurzkettig).map(s => s.id).sort().join(',');
gilt(kurz === ['PFBA', 'PFPeA', 'PFHxA', 'PFHpA', 'PFBS', 'PFPeS'].sort().join(','), `NS5C-PF-1: kurzkettig nur PFCA C4–C7 und PFSA C4–C5 (ist ${kurz})`);
gilt(!istKurzkettig({ c: 6, gruppe: 'Sulfonsäure' }) && istKurzkettig({ c: 7, gruppe: 'Carbonsäure' }), 'NS5C-PF-1: PFHxS langkettig, PFHpA kurzkettig');
gilt(/Sulfonsäuren C4–C5/.test(pfasInhalt.texte.mobilitätKurzkettigePfasC4) && /Sulfonsäuren C4–C5/.test(pfasInhalt.texte.anteilKurzkettigerPfasC4), 'NS5C-PF-1: Modultext nennt Sulfonsäuren C4–C5');
pruefe('PF Beispiel 1 Mischungsanteil', (28 - 20) / (28 - 6), 0.3636);

// Korrekturen NS5C-* gegen ein Zurückfallen
const laga = aktualitaet.texte.föderalismusFührteZuUneinheitlichen;
gilt(!/deponierungsbedürftig \(Z2\)/.test(laga) && /Z 2 \(eingeschränkter Einbau mit definierten technischen Sicherungsmaßnahmen\)/.test(laga), 'NS5C-RB-1: LAGA Z 2 = eingeschränkter Einbau mit technischen Sicherungsmaßnahmen');
const zeb = ndr.texte.alleNeuenGebäudeIm;
gilt(!/oder in der Nutzung/.test(zeb) && /im Eigentum öffentlicher Einrichtungen/.test(zeb) && /streben sie dies an/.test(zeb), 'NS5C-NDR-1: ZEB ab 2028 für Gebäude im Eigentum öffentlicher Einrichtungen (Art. 7 Abs. 1 EPBD)');
gilt(/über 1000 m² Nutzfläche/.test(zeb) && !/Ausnahmslos/.test(ndr.texte.ausnahmslosAlleNeuenGebäude), 'NS5C-NDR-1: Lebenszyklus-GWP ab 2028 für Neubauten über 1000 m²');
gilt(/Planetary Health Check 2025/.test(definitionen.texte.nachhaltigkeitBedeutetZwingendDas) && !/sind aktuell 6 überschritten/.test(definitionen.texte.nachhaltigkeitBedeutetZwingendDas), 'NS5C-NDR-2: 7 von 9 Grenzen (Planetary Health Check 2025)');
gilt(/Korrosivitätskategorien einordnen \(C1 bis CX\)/.test(metallkorrosion.texte.derPlanerMussDie), 'NS5C-MK-1: Korrosivitätskategorie und Schutzdauer getrennt');
const qsi4 = (quiz as { id: string; verified?: boolean; gapAnalysis?: { coreRule?: string } }[]).find(q => q.id === 'q_qsi_4');
gilt(!!qsi4 && qsi4.verified === false && !/ÜK 1–3/.test(qsi4.gapAnalysis?.coreRule ?? '') && /ÜK 1 und ÜK 2/.test(qsi4.gapAnalysis?.coreRule ?? ''), 'NS5C-QS-1: Merksatz q_qsi_4 ÜK 1 und ÜK 2, Frage zur Freigabe zurückgestellt');
gilt(/\(mind\. 3,0\)/.test(readFileSync('src/modules/Konformitaetskontrolle.tsx', 'utf8')), 'NS5C-QS-2: Dezimalkomma bei der Mindest-Standardabweichung');

// Umgesetzte Empfehlungen (Grundregel 02.11.2026)
gilt(/Referentenentwurf von BMJV und BMWSB/.test(ndr.texte.sollFachkundigenBaupartnernDas) && !/noch nicht veröffentlicht/.test(ndr.texte.sollFachkundigenBaupartnernDas), 'NS5C-NDR-3: Gebäudetyp E Referentenentwurf 26.10.2026');
gilt(!/BMWSB Leitfaden|Berlin, 2021/.test(JSON.stringify(definitionen)), 'NS5C-NDR-4: Leitfaden Nachhaltiges Bauen BMI 2019');
const baustoffrecycling = readFileSync('content/rueckbau/BaustoffrecyclingTab.json', 'utf8');
gilt(!/Einbauerstatter/.test(baustoffrecycling) && /bestimmter Materialklassen/.test(baustoffrecycling), 'NS5C-RB-2: § 22 EBV nur für bestimmte Materialklassen');
for (const datei of ['content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json', 'content/nawaro/Nawaro.json', 'content/putzemoertel/PutzeMoertel.json',
  'content/csczertifizierung/CscZertifizierung.json', 'content/beispielrechnungen/RechnungUWert.json']) {
  gilt(!/manuell (prüfen|abgleichen)/.test(readFileSync(datei, 'utf8')), `NS5C-X-1: kein Vermerk „manuell prüfen“ in ${datei}`);
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Nachstichprobe 5c (02.11.2026)');
