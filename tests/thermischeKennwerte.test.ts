// Rechenkern Wärmeschutz, Ergänzung AP 4.2 (Runde 3): ρc, Temperaturleitfähigkeit, Wärmeeindringkoeffizient,
// Kontakttemperatur und erforderliche Dämmdicke (Modul Waermeeigenschaften)
import {
  HAUT, erforderlicheDaemmdicke, kontakttemperatur, temperaturleitfaehigkeit, thermischeKennwerte, waermeeindringkoeffizient, waermespeicherVolumen,
} from '../src/calc/waermeschutz';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Thermische Kennwerte ---');

// 1. Normalbeton λ = 2,0 W/(mK), ρ = 2400 kg/m³, c = 1000 J/(kgK) (Bemessungswerte DIN EN ISO 10456, Tab. 3, Beton hoher Dichte)
//    ρc = 2,4 MJ/(m³K); a = 2,0/2,4·10⁶ = 0,833 mm²/s; b = √(4,8·10⁶) = 2191 J/(m²K√s)
//    Kontakttemperatur Haut 33 °C (b = 1100) auf Beton 20 °C: (1100 · 33 + 2191 · 20)/(1100 + 2191) = 24,35 °C
const beton = thermischeKennwerte(2.0, 2400, 1000);
pruefe(nahe(beton.C_MJ, 2.4, 1e-12) && nahe(beton.a_mm2s, 0.8333, 1e-4) && nahe(beton.b, 2190.89, 1e-5), `Beton ${JSON.stringify(beton)}`);
pruefe(nahe(beton.thetaKontakt, 24.35, 1e-3), `θ_K Beton ${beton.thetaKontakt}`);
// Fichte λ = 0,13, ρ = 500, c = 1600: b = √104 000 = 322,5 → θ_K = 30,05 °C (Holz fühlt sich warm an)
const fichte = thermischeKennwerte(0.13, 500, 1600);
pruefe(nahe(fichte.b, 322.49, 1e-4) && nahe(fichte.thetaKontakt, 30.05, 1e-3), `Fichte ${fichte.thetaKontakt}`);
// Einzelfunktionen und Grenzfälle der Kontakttemperatur
pruefe(waermespeicherVolumen(1000, 4180) === 4.18e6 && nahe(temperaturleitfaehigkeit(0.6, 1000, 4180), 1.435e-7, 1e-3), 'Wasser');
pruefe(nahe(waermeeindringkoeffizient(50, 7850, 450), 13290, 1e-4), 'Stahl b');
pruefe(kontakttemperatur(HAUT.b, 33, HAUT.b, 20) === 26.5, 'gleiche b → Mittelwert');
pruefe(thermischeKennwerte(0, 2400, 1000).hinweise.some(h => h.stufe === 'fehler'), 'λ = 0 → Fehler');
pruefe(thermischeKennwerte(2, 2400, NaN).hinweise.some(h => h.stufe === 'fehler'), 'NaN → Fehler');

// 2. Erforderliche Dämmdicke: U_Ziel = 0,20, Bestand 24 cm mit λ = 1,0 (Standardwerte des Moduls)
//    R_erf = 5,0; R_D = 5,0 − 0,17 − 0,24 = 4,59 m²K/W → λ_D = 0,035: 16,07 cm; λ_D = 0,040: 18,36 cm
const d = erforderlicheDaemmdicke(0.2, 0.24, 1.0, [0.035, 0.040]);
pruefe(nahe(d.RsiRse, 0.17, 1e-12) && nahe(d.rDaemmErf, 4.59, 1e-12) && nahe(d.dickenCm[0], 16.065, 1e-9) && nahe(d.dickenCm[1], 18.36, 1e-9) && !d.erreicht, 'Dämmdicke');
// Gegenprobe: mit 16,065 cm EPS ergibt sich wieder U = 0,20
pruefe(nahe(1 / (0.17 + 0.24 + 0.16065 / 0.035), 0.2, 1e-9), 'Gegenprobe U');
// Randfall: Bestandswand erreicht das Ziel bereits
const ok = erforderlicheDaemmdicke(1.5, 0.5, 0.8, [0.035]);
pruefe(ok.erreicht && ok.dickenCm[0] === 0, 'Ziel erreicht');
// Grenze: U_Ziel = 0 unzulässig
pruefe(erforderlicheDaemmdicke(0, 0.24, 1, [0.035]).hinweise.some(h => h.stufe === 'fehler'), 'U = 0 → Fehler');

// 3. Fuzz
let seed = 31;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const k = thermischeKennwerte(z(-1, 60), z(-10, 8000), z(-100, 5000));
  const e = erforderlicheDaemmdicke(z(-0.1, 3), z(-0.1, 1), z(-0.1, 3), [z(-0.01, 0.1), z(0.01, 0.1)]);
  const werte = [k.C, k.a, k.b, k.thetaKontakt, e.rDaemmErf, ...e.dickenCm];
  if (!werte.every(Number.isFinite)) { pruefe(false, `Fuzz ${i}: ${JSON.stringify(werte)}`); break; }
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Thermische Kennwerte');
