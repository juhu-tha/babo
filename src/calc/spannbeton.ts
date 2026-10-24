/**
 * Spannbeton nach DIN EN 1992-1-1 + NA (DE). Die Rechenfunktionen (Festigkeitsentwicklung, Kriechen, Schwinden,
 * Relaxation, Reibung/Keilschlupf, elastische Verkürzung, Gl. 5.46) liegen in src/utils/ec2Spannbeton.ts und sind
 * hier für die einheitliche Rechenkern-Struktur gebündelt; dazu kommt die Plausibilitätsprüfung der Eingaben.
 * Geprüft in tests/ec2Spannbeton.test.ts und tests/spannbeton.test.ts.
 */
export * from '../utils/ec2Spannbeton';
import { type Hinweis, istEndlich, muss, hatFehler } from './plausibilitaet';

export interface SpannbetonEingabe {
  p0: number; b: number; h: number; ep: number;    // kN, mm
  mG1: number; mPerm: number; mChar: number;       // kNm
  concreteAge: number; spanLength: number;         // d, m
  frictionCoeff: number; wobbleCoeff: number; totalCurvature: number; anchorSlip: number; nTendons: number;
}

export function pruefeSpannbeton(e: SpannbetonEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, istEndlich(...Object.values(e)), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (hatFehler(h)) return h;
  muss(h, e.p0 > 0, 'p0', 'Die Vorspannkraft P₀ muss größer als 0 sein.');
  muss(h, e.b > 0 && e.h > 0, 'b', 'Breite und Höhe müssen größer als 0 sein.');
  muss(h, Math.abs(e.ep) < e.h / 2, 'ep', 'Die Exzentrizität e_p muss innerhalb des Querschnitts liegen (|e_p| < h/2).');
  muss(h, e.concreteAge >= 1, 'concreteAge', 'Das Betonalter beim Spannen muss mindestens 1 Tag betragen.');
  muss(h, e.spanLength > 0, 'spanLength', 'Die Spannweite muss größer als 0 sein.');
  muss(h, [e.frictionCoeff, e.wobbleCoeff, e.totalCurvature, e.anchorSlip].every(x => x >= 0) && e.nTendons >= 1, 'reibung', 'Reibungsbeiwerte, Umlenkwinkel und Schlupf dürfen nicht negativ sein; mindestens ein Spannglied.');
  if (hatFehler(h)) return h;
  if (Math.abs(e.ep) > e.h / 2 - 50) h.push({ stufe: 'warnung', feld: 'ep', text: 'Weniger als 50 mm zwischen Spanngliedachse und Rand – Betondeckung und Hüllrohrdurchmesser prüfen.' });
  if (e.mPerm > e.mChar) h.push({ stufe: 'warnung', feld: 'mPerm', text: 'Das quasi-ständige Moment ist größer als das charakteristische – Einwirkungskombinationen prüfen.' });
  if (e.mG1 > e.mPerm) h.push({ stufe: 'warnung', feld: 'mG1', text: 'M_g1 ist größer als das quasi-ständige Moment – das Eigengewicht ist in M_perm enthalten.' });
  h.push({ stufe: 'warnung', feld: 'dekompression', text: 'Dekompression vereinfacht: Betonspannung in e_p + 25 mm. Die genaue Abgrenzung der Dekompressionszone nach NA DE ist ein offener Prüfpunkt (AP 4.4).' });
  return h;
}
