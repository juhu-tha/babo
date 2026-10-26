/**
 * Speicher des anonymen Kurzfragebogens (Umsetzungsplan Phase 6, AP 6.9).
 *
 * Gespeichert werden ausschließlich
 *   - je Semester die Anzahl der Teilnahmen,
 *   - je Semester und Aussage die Häufigkeit der Werte 1–5 (Zählwerte, keine Einzelantworten),
 *   - Freitexte als bloße Zeichenketten ohne Metadaten (kein Zeitpunkt, keine IP, kein Browser,
 *     keine Zuordnung zu den Bewertungen); neue Freitexte werden an zufälliger Stelle eingefügt,
 *     damit die Reihenfolge keinen Rückschluss auf den Eingangszeitpunkt erlaubt.
 * Persistenz wie beim Besuchszähler: JSON-Datei im Container (Standard laufzeitdaten/kurzfragebogen.json,
 * per FEEDBACK_DATEI änderbar, nicht im Repository). Auf Cloud Run geht sie bei Neustart oder neuer Revision
 * verloren und gilt je Instanz – es sei denn, an das Verzeichnis ist ein Cloud-Storage-Volume eingehängt
 * (docs/betrieb-cloud-run.md, Schritt 7).
 */
import fs from 'fs';
import path from 'path';
import { KF_ITEMS, KF_FREITEXT_MAX, type KfAntwort } from '../src/data/kurzfragebogen.ts';

export interface KfSemester {
  teilnahmen: number;
  /** Aussage → Häufigkeiten der Werte 1–5 (Index 0 = Wert 1) */
  items: Record<string, number[]>;
  freitexte: string[];
}

export interface KfSpeicher {
  format: 1;
  semester: Record<string, KfSemester>;
}

export const KF_GRENZEN = { semester: 40, freitexteJeSemester: 3_000, teilnahmenJeSemester: 200_000 };
const SEMESTER_RE = /^(SS|WS)\d{4}$/;

export function leererSpeicher(): KfSpeicher {
  return { format: 1, semester: {} };
}

function leeresSemester(): KfSemester {
  return { teilnahmen: 0, items: Object.fromEntries(KF_ITEMS.map(i => [i.id, [0, 0, 0, 0, 0]])), freitexte: [] };
}

/**
 * Nimmt eine (bereits mit pruefeAntwort geprüfte) Antwort in die Zählwerte auf.
 * Rückgabe false, wenn eine Speichergrenze erreicht ist (dann bleibt der Speicher unverändert).
 */
export function nimmAuf(s: KfSpeicher, antwort: KfAntwort, semester: string, zufall: () => number = Math.random): boolean {
  if (!SEMESTER_RE.test(semester)) return false;
  let sem = s.semester[semester];
  if (!sem) {
    if (Object.keys(s.semester).length >= KF_GRENZEN.semester) return false;
    sem = leeresSemester();
    s.semester[semester] = sem;
  }
  if (sem.teilnahmen >= KF_GRENZEN.teilnahmenJeSemester) return false;
  if (antwort.freitext && sem.freitexte.length >= KF_GRENZEN.freitexteJeSemester) return false;
  sem.teilnahmen += 1;
  for (const [id, wert] of Object.entries(antwort.werte)) {
    if (!wert) continue;
    const zeile = sem.items[id] ?? (sem.items[id] = [0, 0, 0, 0, 0]);
    zeile[wert - 1] += 1;
  }
  if (antwort.freitext) {
    const pos = Math.floor(zufall() * (sem.freitexte.length + 1));
    sem.freitexte.splice(Math.min(Math.max(pos, 0), sem.freitexte.length), 0, antwort.freitext.slice(0, KF_FREITEXT_MAX * 2));
  }
  return true;
}

export interface KfItemStatistik { verteilung: number[]; n: number; mittelwert: number | null }
export interface KfStatistik {
  semester: Record<string, { teilnahmen: number; items: Record<string, KfItemStatistik>; freitexte: string[] }>;
}

/** Auswertung für den Admin-Bereich: Verteilung, Anzahl und Mittelwert je Aussage */
export function statistik(s: KfSpeicher): KfStatistik {
  const out: KfStatistik = { semester: {} };
  for (const [k, sem] of Object.entries(s.semester)) {
    const items: Record<string, KfItemStatistik> = {};
    for (const [id, v] of Object.entries(sem.items)) {
      const n = v.reduce((a, b) => a + b, 0);
      const summe = v.reduce((a, b, i) => a + b * (i + 1), 0);
      items[id] = { verteilung: [...v], n, mittelwert: n ? Math.round((summe / n) * 100) / 100 : null };
    }
    out.semester[k] = { teilnahmen: sem.teilnahmen, items, freitexte: [...sem.freitexte] };
  }
  return out;
}

const istZaehler = (x: unknown): x is number => typeof x === 'number' && Number.isInteger(x) && x >= 0;

/** Liest einen gespeicherten Stand tolerant ein; Unbekanntes wird verworfen. */
export function bereinigeSpeicher(roh: unknown): KfSpeicher {
  const s = leererSpeicher();
  if (typeof roh !== 'object' || roh === null) return s;
  const sems = (roh as { semester?: unknown }).semester;
  if (typeof sems !== 'object' || sems === null) return s;
  for (const [k, v] of Object.entries(sems as Record<string, unknown>)) {
    if (!SEMESTER_RE.test(k) || typeof v !== 'object' || v === null) continue;
    const r = v as { teilnahmen?: unknown; items?: unknown; freitexte?: unknown };
    const sem = leeresSemester();
    sem.teilnahmen = istZaehler(r.teilnahmen) ? r.teilnahmen : 0;
    if (typeof r.items === 'object' && r.items !== null) {
      for (const i of KF_ITEMS) {
        const z = (r.items as Record<string, unknown>)[i.id];
        if (Array.isArray(z) && z.length === 5 && z.every(istZaehler)) sem.items[i.id] = [...z];
      }
    }
    if (Array.isArray(r.freitexte)) sem.freitexte = r.freitexte.filter((t): t is string => typeof t === 'string').slice(0, KF_GRENZEN.freitexteJeSemester);
    s.semester[k] = sem;
    if (Object.keys(s.semester).length >= KF_GRENZEN.semester) break;
  }
  return s;
}

export function ladeSpeicher(datei: string): KfSpeicher {
  try {
    return bereinigeSpeicher(JSON.parse(fs.readFileSync(datei, 'utf-8')));
  } catch {
    return leererSpeicher();
  }
}

/** Schreibt atomar (temporäre Datei + Umbenennen), legt das Verzeichnis bei Bedarf an. */
export function speichereSpeicher(datei: string, s: KfSpeicher): void {
  fs.mkdirSync(path.dirname(datei), { recursive: true });
  const tmp = `${datei}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(s), 'utf-8');
  fs.renameSync(tmp, datei);
}
