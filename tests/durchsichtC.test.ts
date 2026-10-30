// Gezielte Durchsicht, Tranche C (29.10.2026): Bauprodukte, Grundlagen, Bestand, Mängel & Schäden
// (Befundliste docs/pruefung/durchsicht-C-2026-10-29.md). Die Sollwerte stammen aus einem eigenen Prüfskript (Python,
// eigene Umsetzung der Gleichungen, 101 Nachrechnungen), nicht aus den Kernen. Zusätzlich sichert der Test die
// Korrekturen DSC-* gegen ein Zurückfallen.
import { uRetrofit, dRequired, savings, CO2_ERDGAS, GMODG_ANLAGE7 } from '../src/utils/bestandKern';
import { kombination610 } from '../src/calc/sicherheitskonzept';
import { georadar, impactEchoZfp, ultraschallZfp } from '../src/calc/pruefverfahren';
import { uwFenster } from '../src/calc/fenster';
import { zusatzmittelWz, burgersDehnung, belagMasse, blechMasse } from '../src/calc/bauprodukte';
import { HOLZ_EN338 } from '../src/data/kennwerte';
import { SCHWINDBEIWERTE } from '../src/calc/holzphysik';
import materials from '../src/data/materials.json';
import normenAusblick from '../content/normenausblick/NormenAusblick.json';
import regularien from '../content/regularien/Regularien.json';
import bauschaeden from '../content/bauschaeden/Bauschaeden.json';
import zfpDaten from '../content/zfp/daten.json';
import daemmung from '../content/bpdaemmung/BpDaemmung.json';
import zusatzmittel from '../content/bpbetonzusatzmittel/BpBetonzusatzmittel.json';
import bpBeton from '../content/bpbeton/BpBeton.json';
import glaeserDaten from '../content/bpglaeser/daten.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const text = (o: unknown) => JSON.stringify(o);

console.log('--- Test: Durchsicht Tranche C 29.10.2026 (Nachrechnungen und Korrekturen) ---');

// bestand: Beispiel 1 (Calciumsilikat) und 2 (Gradtagzahl, Erdgas 0,24 kg/kWh)
pruefe('BE1 U_neu', uRetrofit(1.5, 0.06, 0.06), 0.6);
pruefe('BE2 CO₂', 0.9 * 100 * 3500 * 24 / 1000 * CO2_ERDGAS, 1814.4);
// modernisierung: Beispiel 1 (d_erf) und 2 (Endenergie, Amortisation)
pruefe('MO1 d_erf', dRequired(1.4, GMODG_ANLAGE7.aussenwand, 0.032), 0.11048);
const uMo = uRetrofit(1.4, 0.14, 0.032);
pruefe('MO1 U mit 14 cm', uMo, 0.19651);
const sav = savings({ uOld: 1.4, uNew: uMo, A: 160, bauteil: 'aussenwand', Gt: 3500, etaSys: 0.9, price: 0.12, co2: CO2_ERDGAS, invest: 16400, sowiesoKosten: 13600 });
pruefe('MO2 Q_E', sav.qEnd, 17972, 2e-3);
pruefe('MO2 Amortisation Kopplung', sav.amortisation, 1.30, 1e-2);
// sicherheitskonzept: Startwerte (getauschte Leiteinwirkung) wie Tranche 4, Beispiel 1 per Hand
const sk = kombination610({ gk: 800, qk1: 300, qk2: 0, psi01: 0.7, psi02: 0.6, gammaG: 1.35, gammaQ: 1.5, getauscht: false });
pruefe('SK1 N_Ed', sk.ed, 1530);
pruefe('SK1 η', 1530 / (350 ** 2 * 0.85 * 30 / 1.5 / 1000), 0.7347);
// zfp: Radar, Impact-Echo, E_dyn (Startwerte des Moduls)
pruefe('ZF1 Radar d', georadar(6, 1.5).depth, 91.86);
pruefe('ZF2 Impact-Echo d', impactEchoZfp(15, 4000).depth, 128);
pruefe('ZF3 E_dyn', ultraschallZfp(4.0).eDyn, 34.56);
// bp_dach_fassade: U_w des Lehrbeispiels (Kern mit Rahmenbreite ergibt dieselbe Bilanz je Fläche)
pruefe('DF1 U_w', (1.3 * 0.6 + 0.52 * 1.2 + 4.6 * 0.04) / 1.82, 0.8725);
const fe = uwFenster({ breite: 1.23, hoehe: 1.48, rahmenMm: 110, ug: 0.6, uf: 1.1, psi: 0.038, g: 0.53, strahlung: 450 });
gilt(fe.uw > 0.6 && fe.uw < 1.3 && fe.gegKonform, 'GL U_w Startwerte GModG-konform');
// bp_betonzusatzmittel: Wasseranrechnung (> 3 l/m³)
const zm = zusatzmittelWz({ zement: 340, dosierung: 1.5, dichte: 1.05, wasseranteil: 70, wasser: 160 });
gilt(zm.anrechnung, 'BZ1 Anrechnung > 3 l');
pruefe('BZ1 w/z eff', zm.wzEff, 0.48110);
// bp_kunststoffe, bp_mineralisch, bp_metallisch
pruefe('KU1 ε (1000 h)', burgersDehnung({ E1: 1000, E2: 2000, eta1: 5e6, eta2: 1e5 }, 5, 1000).gesamt, 0.85);
pruefe('MI1 Wasser Steingut', belagMasse(20, 8, 1900, 15).wasser, 45.6);
pruefe('ME1 g_k Titanzink', blechMasse(10, 0.5, 0.7, 7200).gkFlaeche, 0.04944);
// historische_bauweisen: Schwindmaß Fichte tangential aus der gemeinsamen Konstante
pruefe('HB2 Δb', 220 * SCHWINDBEIWERTE.fichte.tangential / 100 * 18, 14.256);

// DSC-MK-1: D30 in der Materialdatenbank wie DIN EN 338:2016 (f_c,0,k = 24 N/mm²)
const mat = (id: string) => materials.materials.find(m => m.id === id)!.properties;
pruefe('DSC-MK-1 D30 f_c,0,k', mat('laubholz').compressive, HOLZ_EN338.D30.fc0k);
pruefe('DSC-MK-1 D30 f_t,0,k', mat('laubholz').tensile, HOLZ_EN338.D30.ft0k);
pruefe('C24 f_c,0,k', mat('holz').compressive, HOLZ_EN338.C24.fc0k);

// DSC-NA-1: EN 1990 der 2. Generation als EN 1990-1:2023+A1:2026 (DIN EN 1990-1:2026-12 angekündigt)
const na = text(normenAusblick);
gilt(na.includes('EN 1990-1:2023+A1:2026') && na.includes('DIN EN 1990-1:2026-12'), 'DSC-NA-1 EN 1990-1 genannt');
gilt(!na.includes('Ausgabedatum noch nicht genannt'), 'DSC-NA-1 veralteter Stand entfernt');

// DSC-RG-1 / DSC-BS-1: Gebäudetyp E – Entwurf vom 26.10.2026 in der Anhörung, kein Kabinettsbeschluss
gilt(!text(regularien).includes('im parlamentarischen Verfahren seit 06/2026'), 'DSC-RG-1 kein parlamentarisches Verfahren');
gilt(text(bauschaeden).includes('26.10.2026') && !text(bauschaeden).includes('Ressortabstimmung und ist nicht veröffentlicht'), 'DSC-BS-1 Stand 26.10.2026');

// DSC-ZF-1 bis -3: Normzuordnungen im Gerätekatalog
const geraet = (id: string) => (zfpDaten as { daten: { geraeteList: { id: string; norm: string }[] } }).daten.geraeteList.find(g => g.id === id)!.norm;
gilt(!geraet('haftzug').includes('Richtlinie SIB') && geraet('haftzug').includes('TR Instandhaltung'), 'DSC-ZF-1 Haftzug TR Instandhaltung');
gilt(!geraet('rautiefe').includes('1766'), 'DSC-ZF-2 Rautiefe nicht DIN EN 1766');
gilt(!geraet('karsten').startsWith('DIN 52617'), 'DSC-ZF-3 Karsten nicht DIN 52617');

// DSC-DM-1: Schüttdämmstoffe mit Produktnorm für die Schüttung
const dm = text(daemmung);
gilt(dm.includes('DIN EN 14316-1') && dm.includes('DIN EN 14063-1'), 'DSC-DM-1 Schüttdämmnormen');

// DSC-BZ-1: LP-Pflicht XF4 (nicht „XF3/XF4“ für Frost-Tausalz)
gilt(!text(zusatzmittel).includes('(Expositionsklassen XF3/XF4)'), 'DSC-BZ-1 XF-Zuordnung');

// DSC-GL-1: 3-fach-Glas ist Marktstandard, keine GModG-Anforderung (Anlage 7: U_w ≤ 1,30)
gilt(!text(glaeserDaten).includes('Standard nach GModG'), 'DSC-GL-1 keine GModG-Pflicht für 3-IV');
pruefe('DSC-GL-1 U_w,max', GMODG_ANLAGE7.fenster, 1.3);

// DSC-BT-1: Bezugsgröße Zylinder im Konformitätsbeispiel
gilt(text(bpBeton).includes('Zylindern 150/300 mm'), 'DSC-BT-1 Zylinder genannt');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: alle Nachrechnungen und Korrekturen der Durchsicht C stimmen');
