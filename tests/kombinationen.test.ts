// Rechenkern Werkstoff-Kombinationen (T6-KO-4/-5, Umsetzung 29.10.2026): Sollwerte von Hand bzw. mit eigenem Prüfskript
// (Python) gerechnet, nicht aus dem Kern übernommen.
import { faserverbund, schichtaufbau, type Schicht } from '../src/calc/kombinationen';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 1e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 1e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Werkstoff-Kombinationen (Kern) ---');

// 1. Faserverbund CFK HT/EP, v_f = 40 %: E_∥ = 230·0,4 + 3,2·0,6 = 93,92 GPa; E_⊥ = 5,2843 GPa;
//    σ_∥ = 3 500·0,4 + min(70; 3,2·3 500/230 = 48,70)·0,6 = 1 429,22 MPa; ρ = 1,44 g/cm³
const fvk = faserverbund({ ef: 230, sf: 3500, rhoF: 1.8, em: 3.2, sm: 70, rhoM: 1.2, vf: 40 });
pruefe('FVK E längs', fvk.eLaengs, 93.92); pruefe('FVK E quer', fvk.eQuer, 5.28432); pruefe('FVK σ längs', fvk.festigkeitLaengs, 1429.217); pruefe('FVK ρ', fvk.rho, 1.44);
gilt(fvk.gueltig && fvk.hinweise.length === 0, 'FVK ohne Hinweis');
gilt(!faserverbund({ ef: 230, sf: 3500, rhoF: 1.8, em: 3.2, sm: 70, rhoM: 1.2, vf: 120 }).gueltig, 'FVK v_f > 100 % abgelehnt');
gilt(faserverbund({ ef: 230, sf: 3500, rhoF: 1.8, em: 3.2, sm: 70, rhoM: 1.2, vf: 80 }).hinweise.some(h => h.stufe === 'warnung'), 'FVK v_f 80 % Warnung');

// 2. Standardaufbau WDVS auf Hochlochziegel: R_T = 5,6302 m²K/W, U = 0,17761 W/(m²K), Σs_d = 9,165 m;
//    Teilung an der EPS-Dämmung (Schicht 3, nicht mitgezählt): s_d,i = 0,15 + 2,40 = 2,55 m, s_d,e = 0,125 + 0,09 = 0,215 m
const wdvs: Schicht[] = [
  { dicke: 15, lambda: 0.70, mu: 10, kategorie: 'schuetzend' },
  { dicke: 240, lambda: 0.28, mu: 10, kategorie: 'tragend' },
  { dicke: 160, lambda: 0.035, mu: 40, kategorie: 'daemmend' },
  { dicke: 5, lambda: 0.85, mu: 25, kategorie: 'schuetzend' },
  { dicke: 3, lambda: 0.70, mu: 30, kategorie: 'schuetzend' },
];
const a = schichtaufbau(wdvs);
pruefe('WDVS R_T', a.rT, 5.630168); pruefe('WDVS U', a.u, 0.1776146); pruefe('WDVS Σs_d', a.sdGesamt, 9.165);
gilt(a.iDaemm === 2, 'WDVS Teilung an Schicht 3');
pruefe('WDVS s_d,i', a.sdInnen, 2.55); pruefe('WDVS s_d,e', a.sdAussen, 0.215);
gilt(a.einordnung === 'aussendaemmung' && a.unkritisch, 'WDVS: Außendämmung, nachweisfrei');
gilt(a.sdPruefung?.sdiErforderlich === 2.0 && a.sdPruefung.eingehalten, 'WDVS Dachregel zum Vergleich eingehalten');

// 3. Innendämmung (Putz 10 mm, Dämmplatte 60 mm λ 0,045 μ 5, Mauerwerk 240 mm, Außenputz 20 mm μ 20):
//    R_T = 2,3978 m²K/W, U = 0,41706; Teilung an Schicht 2: s_d,i = 0,10 m, s_d,e = 2,40 + 0,40 = 2,80 m → Nachweis nötig
const innen = schichtaufbau([
  { dicke: 10, lambda: 0.70, mu: 10, kategorie: 'schuetzend' },
  { dicke: 60, lambda: 0.045, mu: 5, kategorie: 'daemmend' },
  { dicke: 240, lambda: 0.28, mu: 10, kategorie: 'tragend' },
  { dicke: 20, lambda: 0.87, mu: 20, kategorie: 'schuetzend' },
]);
pruefe('Innendämmung U', innen.u, 0.4170576); pruefe('Innendämmung s_d,e', innen.sdAussen, 2.8);
gilt(innen.einordnung === 'innendaemmung' && !innen.unkritisch && innen.sdPruefung?.sdiErforderlich === null, 'Innendämmung: Nachweis erforderlich');

// 4. Holzrahmen ohne tragende Massivschicht (OSB 15 mm μ 200, Mineralwolle 200 mm, Holzfaser 60 mm μ 5):
//    Teilung an der Mineralwolle: s_d,i = 3,0 m, s_d,e = 0,3 m → erforderlich ≥ 2,0 m, eingehalten (Orientierung)
const holz = schichtaufbau([
  { dicke: 15, lambda: 0.13, mu: 200, kategorie: 'schuetzend' },
  { dicke: 200, lambda: 0.035, mu: 1, kategorie: 'daemmend' },
  { dicke: 60, lambda: 0.045, mu: 5, kategorie: 'daemmend' },
]);
pruefe('Holzrahmen s_d,i', holz.sdInnen, 3.0); pruefe('Holzrahmen s_d,e', holz.sdAussen, 0.3);
gilt(holz.einordnung === 'orientierung' && holz.unkritisch, 'Holzrahmen: Dachregel als Orientierung eingehalten');

// 5. Plausibilität statt stiller Begrenzung
const fal = schichtaufbau([{ dicke: 0, lambda: 0.035, mu: 0.5, kategorie: 'daemmend' }]);
gilt(!fal.gueltig && fal.hinweise.filter(h => h.stufe === 'fehler').length === 2, 'Dicke 0 und μ < 1 gemeldet');
gilt(!schichtaufbau([{ dicke: Number.NaN, lambda: 0.035, mu: 1, kategorie: 'daemmend' }]).gueltig, 'leere Eingabe gemeldet');
gilt(!schichtaufbau([]).gueltig, 'ohne Schichten ungültig');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Werkstoff-Kombinationen');
