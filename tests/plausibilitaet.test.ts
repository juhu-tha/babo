// Plausibilitätsschicht der Rechner (src/calc/plausibilitaet.ts, AP 4.8) – eigene Tests (Zwischen-Review Z4)
import { istEndlich, hatFehler, bereich, muss, type Hinweis } from '../src/calc/plausibilitaet';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Plausibilität ---');

// 1. istEndlich: nur endliche Zahlen; leere Liste ist (wie Array.every) wahr
pruefe(istEndlich(), 'ohne Werte → true');
pruefe(istEndlich(0, -0, -1.5, 1e308, Number.MIN_VALUE), 'endliche Werte → true');
pruefe(!istEndlich(1, NaN), 'NaN → false');
pruefe(!istEndlich(Infinity), '+∞ → false');
pruefe(!istEndlich(2, -Infinity, 3), '−∞ in der Mitte → false');
pruefe(!istEndlich(1 / 0), 'Division durch 0 → false');
pruefe(istEndlich(Number('3,5'.replace(',', '.'))) && !istEndlich(Number('3,5')), 'deutsches Komma ohne Umwandlung ergibt NaN');

// 2. hatFehler: nur Stufe „fehler“ zählt
pruefe(!hatFehler([]), 'leere Liste → false');
pruefe(!hatFehler([{ stufe: 'warnung', text: 'w' }, { stufe: 'warnung', feld: 'x', text: 'w2' }]), 'nur Warnungen → false');
pruefe(hatFehler([{ stufe: 'warnung', text: 'w' }, { stufe: 'fehler', text: 'f' }]), 'Warnung + Fehler → true');

// 3. bereich: Grenzen gehören zum üblichen Bereich (geschlossenes Intervall), außerhalb → genau eine Warnung
{
  const h: Hinweis[] = [];
  bereich(h, 'wz', 0.35, 0.35, 0.75, 'w/z außerhalb');
  bereich(h, 'wz', 0.75, 0.35, 0.75, 'w/z außerhalb');
  bereich(h, 'wz', 0.5, 0.35, 0.75, 'w/z außerhalb');
  pruefe(h.length === 0, `Grenzwerte und Innenwert ohne Warnung (${h.length})`);
  bereich(h, 'wz', 0.3499, 0.35, 0.75, 'unten');
  bereich(h, 'wz', 0.7501, 0.35, 0.75, 'oben');
  pruefe(h.length === 2 && h.every(x => x.stufe === 'warnung' && x.feld === 'wz'), 'knapp außerhalb → je eine Warnung mit Feld');
  pruefe(h[0]?.text === 'unten' && h[1]?.text === 'oben', 'Reihenfolge und Text bleiben erhalten');
  pruefe(!hatFehler(h), 'Warnungen sind keine Fehler');
  // NaN fällt durch keinen Vergleich auf – Rechenkerne prüfen daher zuerst istEndlich/muss
  const n: Hinweis[] = [];
  bereich(n, 'x', NaN, 0, 1, 'nan');
  pruefe(n.length === 0, 'NaN erzeugt keine Bereichswarnung (Endlichkeit gesondert prüfen)');
  bereich(n, 'x', -Infinity, 0, 1, 'unendlich');
  pruefe(n.length === 1, '−∞ liegt unterhalb des Bereichs');
}

// 4. muss: verletzte Bedingung → Fehler, erfüllte → nichts; vorhandene Einträge bleiben stehen
{
  const h: Hinweis[] = [{ stufe: 'warnung', feld: 'a', text: 'alt' }];
  muss(h, true, 'z', 'z > 0');
  pruefe(h.length === 1, 'erfüllte Bedingung fügt nichts hinzu');
  muss(h, false, 'z', 'Zementgehalt muss > 0 sein');
  pruefe(h.length === 2 && h[0].text === 'alt', 'Fehler wird angehängt, Warnung bleibt');
  pruefe(h[1]?.stufe === 'fehler' && h[1].feld === 'z' && h[1].text === 'Zementgehalt muss > 0 sein', 'Fehler mit Feld und Text');
  pruefe(hatFehler(h), 'hatFehler erkennt den Fehler');
}

// 5. Handrechnung im Zusammenspiel wie in einem Rechenkern: w/z = w / z
//    w = 180 kg/m³, z = 300 kg/m³ → w/z = 0,60 (üblich 0,35–0,75, kein Hinweis)
//    w = 180, z = 200 → w/z = 0,90 (rechnerisch gültig, Warnung); z = 0 → Fehler, kein Ergebnis
function wz(w: number, z: number) {
  const h: Hinweis[] = [];
  muss(h, istEndlich(w, z), 'eingabe', 'Eingaben müssen Zahlen sein');
  muss(h, z > 0, 'z', 'Zementgehalt muss größer als 0 sein');
  if (hatFehler(h)) return { wert: undefined, h };
  const wert = w / z;
  bereich(h, 'wz', wert, 0.35, 0.75, 'w/z außerhalb des üblichen Bereichs');
  return { wert, h };
}
{
  const a = wz(180, 300);
  pruefe(Math.abs((a.wert ?? 0) - 0.6) < 1e-12 && a.h.length === 0, `w/z 180/300 = 0,60 ohne Hinweis (${a.wert})`);
  const b = wz(180, 200);
  pruefe(Math.abs((b.wert ?? 0) - 0.9) < 1e-12 && b.h.length === 1 && b.h[0].stufe === 'warnung', 'w/z 0,90 → Ergebnis mit Warnung');
  const c = wz(180, 0);
  pruefe(c.wert === undefined && hatFehler(c.h), 'z = 0 → Fehler, kein Ergebnis');
  const d = wz(NaN, 300);
  pruefe(d.wert === undefined && d.h[0]?.feld === 'eingabe', 'NaN-Eingabe → Fehler vor der Rechnung');
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: istEndlich, hatFehler, bereich, muss');
