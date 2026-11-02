// Nachstichprobe 5b (02.11.2026): freigegebene Fachmodule ohne bisherige Nachstichprobe und ohne Gegenprüfung,
// alphabetisch nach Modul-ID, gerade Positionen 2 bis 50 (25 Module; Befundliste docs/pruefung/nachstichprobe5b-2026-11-02.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (Python, eigene Umsetzung der Gleichungen), nicht aus den Kernen.
// Zusätzlich sichert der Test die Korrekturen NS5B-* gegen ein Zurückfallen.
import { readFileSync } from 'node:fs';
import { sortierbilanz } from '../src/calc/altholz';
import { uRetrofit } from '../src/utils/bestandKern';
import { burgersDehnung, laengenaenderungMm, randspannung } from '../src/calc/bauprodukte';
import { grenzhoehen, wuerfelstapel } from '../src/calc/festigkeitsvergleich';
import { hauptspannungen } from '../src/calc/spannungszustand';
import { keramikKennwerte, formmass, fliesenGruppe } from '../src/calc/keramik';
import { druckpruefung } from '../src/calc/laborversuche';
import { cbamKosten } from '../src/calc/cbam';
import { eModulLaengs, eModulQuer } from '../src/calc/kombinationen';
import { biogenesCo2DinEn16449 } from '../src/calc/holzphysik';
import holzwerkstoffe from '../content/holzwerkstoffe/Holzwerkstoffe.json';
import denkmal from '../content/denkmalpflege/Denkmalpflege.json';
import praxis from '../content/nachhaltigkeit/PraxisInnovationen.json';
import quiz from '../src/data/quiz.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Nachstichprobe 5b (02.11.2026, Nachrechnungen und Korrekturen) ---');

// altholz_urban_mining: Standardeingabe des Rechners (Beispiel 1, Ausgangszustand) und Quiz 6
const ah = sortierbilanz({ masse: { AI: 15, AII: 45, AIII: 15, AIV: 25 }, ausbringen: { AI: 0.95, AII: 0.9, AIII: 0.85, AIV: 0.95 } });
pruefe('AU M_st', ah.mSt, 58.25); pruefe('AU q_F', ah.qFehl, 0.0875); pruefe('AU w_A IV', ah.anteilAIVSt, 0.0214592);

// bestand: Beispiel 1 (Calciumsilikat 6 cm) und Quiz q_bst_3
pruefe('BE U_neu Beispiel 1', uRetrofit(1.5, 0.06, 0.065), 0.629032);
pruefe('BE Quiz q_bst_3', uRetrofit(1.4, 0.12, 0.035), 0.241379);

// bp_kunststoffe: Burgers-Beispiel und Quiz, Längenänderung PVC-U
pruefe('KU Burgers Beispiel', burgersDehnung({ E1: 1000, E2: 2000, eta1: 5e6, eta2: 1e5 }, 5, 1000).gesamt, 0.85);
pruefe('KU Burgers Quiz', burgersDehnung({ E1: 2000, E2: 1000, eta1: 4e6, eta2: 5e4 }, 4, 500).gesamt, 0.649982);
pruefe('KU Quiz PVC-U', laengenaenderungMm(80, 8, 60), 38.4);

// bp_stahlbauprofile: Beispiel IPE 300 (S235) und Standardeingabe (N = 150 kN, M = 45 kNm, S355, γ_M0 = 1,0)
pruefe('SP σ Beispiel', randspannung(0, 45, 53.8, 557, 235, 1.0).sigma, 80.7899);
pruefe('SP η Standard', randspannung(150, 45, 53.8, 557, 355, 1.0).eta, 30.6119);

// festigkeit: Grenzhöhe C20/25, Reißlänge S235, Würfelstapel, Mohr-Kreis
const c20 = { rho: 2400, fc: 20, ft: 2.2, E: 30000 };
pruefe('FE H_max C20/25', grenzhoehen(c20).H_max, 849.474);
pruefe('FE L_max S235', grenzhoehen({ rho: 7850, fc: 235, ft: 360, E: 210000 }).L_max, 4674.78);
gilt(wuerfelstapel(c20, 10).N_max === 8494, 'FE Quiz qn_festigkeit_3: N_max = 8494');
const hs = hauptspannungen({ sx: 120, sy: -40, txy: 60 });
pruefe('FE Mohr σ₁', hs.sigma1, 140); pruefe('FE Mohr σ₂', hs.sigma2, -60);

// keramik_ziegel: Beispiel 1 (Fliese BIa) und Beispiel 2 (Formmaß NF)
const kz = keramikKennwerte({ mt: 1250, mn: 1253.5, ma: 717, formgebung: 'B' });
pruefe('KZ E_b', kz.eb, 0.28); pruefe('KZ ρ_roh', kz.rhoRoh, 2.32992); pruefe('KZ P_offen', kz.pOffen, 0.652377);
gilt(kz.gruppe === 'BIa' && fliesenGruppe(0.6, 'B') === 'BIb' && fliesenGruppe(2.5, 'B') === 'BIb', 'KZ Gruppen BIa / BIb (Beispiel, Quiz qn_keramik_ziegel_2)');
pruefe('KZ Formmaß', formmass(240, 0.06, 0.02), 260.530);

// labor_druckfestigkeit: Beispielprotokoll C30/37 (drei Würfel, Wasserlagerung)
const dp = druckpruefung({
  wuerfel: [
    { a: 150.2, b: 149.8, h: 150.1, m: 8.12, F: 955 },
    { a: 149.9, b: 150.1, h: 150.0, m: 8.085, F: 980 },
    { a: 150.0, b: 150.3, h: 149.8, m: 8.15, F: 935 },
  ],
  trocken: false, zielklasse: 'C30/37',
});
pruefe('LD f_cm', dp.fcm, 42.5); pruefe('LD f_min', dp.fmin, 41.5);
gilt(dp.erreicht === 'C30/37' && !!dp.ziel?.krit1 && !!dp.ziel?.krit2, 'LD Beispiel: C30/37 erreicht, C35/45 nicht');

// lca_regulatorik: CBAM-Quiz (Endzustand 2034) und biogener Speicher des Leuchtturmprojekts
pruefe('LR CBAM 2034', cbamKosten({ jahr: 2034, mengeT: 1000, emissionen: 0.8, benchmark: 0.666, preisCbam: 80, preisHerkunft: 20 }).kosten, 48000);
pruefe('LR biogenes CO₂ 1800 m³', biogenesCo2DinEn16449(500, 12, 1800) / 1000, 1473.21);

// kombinationen: Voigt/Reuss (Quiz q_fvb_1)
pruefe('KO E_∥', eModulLaengs(230, 3.2, 0.6), 139.28); pruefe('KO E_⊥', eModulQuer(230, 3.2, 0.6), 7.83652);

// Korrekturen NS5B-* gegen ein Zurückfallen
const stahl = readFileSync('src/modules/BpStahlbauprofile.tsx', 'utf8');
gilt(!/1,10 \(Nationaler Anhang\)/.test(stahl) && /γ_M1 nach NA/.test(stahl), 'NS5B-SP-1: γ_M0 = 1,10 nicht mehr als Wert des Nationalen Anhangs bezeichnet');
const hw = holzwerkstoffe.texte.kompliziertDurchBindemittelanteileNach;
gilt(!/und AltholzV hat/.test(hw) && /gleichrangig/.test(hw), 'NS5B-HW-1: AltholzV stellt stoffliche und energetische Verwertung gleichrangig');
gilt(/Referentenentwurf vom 26\.10\.2026, u\. a\. § 650o BGB-E, noch kein Gesetz/.test(praxis.texte.überregulierungAbbauenMaterialkreisläufe) && !/das neue Gebäudetyp-E-Gesetz/.test(praxis.texte.überregulierungAbbauenMaterialkreisläufe),
  'NS5B-LR-1: Gebäudetyp-E-Gesetz als Entwurf bezeichnet');
gilt(denkmal.texte.art6BaydschgUmgebung === 'Art. 6 Abs. 1 Satz 2 BayDSchG', 'NS5B-DP-1: Fundstelle Umgebungsschutz vollständig');
const ld1 = (quiz as { id: string; verified?: boolean; distraktorFeedback?: string[] }[]).find(q => q.id === 'qn_labor_druckfestigkeit_1');
gilt(!!ld1 && ld1.verified === false && /Kantenlänge 150 mm/.test(ld1.distraktorFeedback?.[0] ?? ''), 'NS5B-LD-1: Rückmeldung zu 6,0 MPa berichtigt, Frage zur Freigabe zurückgestellt');
pruefe('NS5B-LD-1 Distraktor 6,0 = 900/150', 900 / 150, 6.0);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Nachstichprobe 5b (02.11.2026)');
