// Rechenkern Frischbeton: Bewertung des Luftgehalts von LP-Beton (Modulprüfung Tranche 3, Befund T3-FB-1)
// Quellen: DIN 1045-2, Tab. F.2.2, Fußnote (Mindestluftgehalt je Größtkorn, Einzelwerte −0,5 %);
// DIN EN 206, 5.4.3 (obere Grenze = Mindestwert + 4 % absolut; Glinicki, BTA 2/2004);
// DIN EN 206-1:2001, Tab. 17 (Grenzabweichung der Einzelwerte −0,5 / +1,0 %, umwelt-online).
import { bewerteLuftgehalt, mindestLuftgehalt, type GroesstkornLp, type LpKlasse } from '../src/calc/frischbeton';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol = 1e-9) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Frischbeton (Luftgehalt) ---');

// 1. Rechenbeispiel des Moduls (content/frischbeton/Frischbeton.json): XF4, D_max = 32 mm, Ablesung 4,8 %, G = 0,2 %
//    L = 4,6 %; Mindestwert 4,0 %, Einzelwert ≥ 3,5 %, obere Grenze 8,0 %, oberer Einzelwert 9,0 % → erfüllt
const b1 = bewerteLuftgehalt({ ablesung: 4.8, gesteinskorrektur: 0.2, klasse: 'XF4', dmax: 32 });
pruefe(b1.gueltig && nahe(b1.luftgehalt, 4.6) && b1.mindestwert === 4.0 && nahe(b1.einzelwertMin, 3.5), `Beispiel 1 ${JSON.stringify(b1)}`);
pruefe(nahe(b1.obergrenze, 8.0) && nahe(b1.einzelwertMax, 9.0) && b1.bewertung === 'erfuellt' && b1.einzelwertKonform, 'Beispiel 1: erfüllt');

// 2. Fall der Quizfrage qn_frischbeton_4: XF4, D_max = 16 mm, L = 9,0 % → über der oberen Grenze 8,5 %,
//    aber innerhalb der Grenzabweichung (≤ 9,5 %); vorher fälschlich „Mindestluftporengehalt unterschritten“
const b2 = bewerteLuftgehalt({ ablesung: 9.0, gesteinskorrektur: 0, klasse: 'XF4', dmax: 16 });
pruefe(b2.bewertung === 'ueberObergrenze' && b2.einzelwertKonform && nahe(b2.obergrenze, 8.5) && nahe(b2.einzelwertMax, 9.5), `L = 9,0 % ${JSON.stringify(b2)}`);
pruefe(bewerteLuftgehalt({ ablesung: 9.6, gesteinskorrektur: 0, klasse: 'XF4', dmax: 16 }).bewertung === 'ueberschritten', 'L = 9,6 % > 9,5 % → überschritten');

// 3. Grenzen der Einzelwerte: XF2, D_max = 8 mm (Mindestwert 5,5 %)
pruefe(bewerteLuftgehalt({ ablesung: 5.2, gesteinskorrektur: 0, klasse: 'XF2', dmax: 8 }).bewertung === 'unterMindestwert', '5,2 % → unter Mindestwert, Einzelwert zulässig');
pruefe(bewerteLuftgehalt({ ablesung: 5.0, gesteinskorrektur: 0, klasse: 'XF2', dmax: 8 }).bewertung === 'unterMindestwert', '5,0 % = Grenze Einzelwert');
pruefe(bewerteLuftgehalt({ ablesung: 4.9, gesteinskorrektur: 0, klasse: 'XF2', dmax: 8 }).bewertung === 'unterschritten', '4,9 % → unterschritten');
pruefe(bewerteLuftgehalt({ ablesung: 9.5, gesteinskorrektur: 0, klasse: 'XF2', dmax: 8 }).bewertung === 'erfuellt', '9,5 % = obere Grenze');
pruefe(mindestLuftgehalt('XF4', 63) === 3.5 && mindestLuftgehalt('XF2', 16) === 4.5 && mindestLuftgehalt('X0_XF1_XF3', 32) === 0, 'Mindestwerte Tab. F.2.2');

// 4. Ohne LP-Anforderung und Eingabefehler
const b4 = bewerteLuftgehalt({ ablesung: 2.0, gesteinskorrektur: 0.1, klasse: 'X0_XF1_XF3', dmax: 32 });
pruefe(b4.bewertung === 'keineAnforderung' && b4.einzelwertKonform && nahe(b4.luftgehalt, 1.9), 'ohne LP-Anforderung');
pruefe(!bewerteLuftgehalt({ ablesung: 3, gesteinskorrektur: 4, klasse: 'XF4', dmax: 32 }).gueltig, 'G > Ablesung → Fehler');
pruefe(!bewerteLuftgehalt({ ablesung: NaN, gesteinskorrektur: 0, klasse: 'XF4', dmax: 32 }).gueltig, 'NaN → Fehler');

// 5. Fuzz: 1 000 Zufallseingaben ohne NaN/∞ bei gültigen Ergebnissen
const z = (a: number, b: number) => a + Math.random() * (b - a);
const klassen: LpKlasse[] = ['XF2', 'XF4', 'X0_XF1_XF3'];
const dmaxe: GroesstkornLp[] = [8, 16, 32, 63];
for (let i = 0; i < 1000; i++) {
  const r = bewerteLuftgehalt({ ablesung: z(-2, 22), gesteinskorrektur: z(-1, 3), klasse: klassen[i % 3], dmax: dmaxe[i % 4] });
  if (r.gueltig && !(Number.isFinite(r.luftgehalt) && Number.isFinite(r.mindestwert) && Number.isFinite(r.einzelwertMin))) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Frischbeton (Luftgehalt)');
