/**
 * Hilfsfunktionen der Versuchs-Handouts (AP 6.4): Zahleneingabe, leeres Protokoll, Speichern im Browser,
 * CSV-Tabelle und druckfertiges HTML (Druck/PDF über openPrintableReport aus labExportUtils).
 * Reine Funktionen bis auf ladeProtokoll/speichereProtokoll – geprüft in tests/handoutExport.test.ts.
 */
import type { HandoutErgebnis, ProtokollStand, VersuchsHandoutDaten } from '@/src/components/handout/handoutTypen';
import { LABOR_ANPASSEN } from '@/src/components/handout/handoutTypen';

/** Eingabetext → Zahl; Dezimalkomma oder -punkt, Leerzeichen und Einheitenreste werden toleriert; leer → NaN */
export function zahlAus(text: string | undefined): number {
  if (text === undefined) return NaN;
  const t = text.trim().replace(/\s+/g, '').replace(',', '.').replace(/[−–]/g, '-');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.test(t)) return NaN;
  return parseFloat(t);
}

export function leeresProtokoll(d: VersuchsHandoutDaten): ProtokollStand {
  return {
    kopf: Object.fromEntries(d.protokoll.kopf.map(k => [k.id, k.standard ?? ''])),
    zeilen: Array.from({ length: d.protokoll.zeilen }, () => Object.fromEntries(d.protokoll.spalten.map(s => [s.id, '']))),
  };
}

export function kopie(p: ProtokollStand): ProtokollStand {
  return { kopf: { ...p.kopf }, zeilen: p.zeilen.map(z => ({ ...z })) };
}

export function istGleich(a: ProtokollStand, b: ProtokollStand): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Zeile enthält mindestens einen Eintrag */
export const zeileBelegt = (z: Record<string, string>) => Object.values(z).some(v => v.trim() !== '');

// ── Speichern im Browser (nur auf diesem Gerät) ──────────────────────────────
const SPEICHER_SCHLUESSEL = 'bb_labor_protokolle';

function alleGespeicherten(): Record<string, ProtokollStand> {
  try {
    const roh = typeof localStorage !== 'undefined' ? localStorage.getItem(SPEICHER_SCHLUESSEL) : null;
    const obj: unknown = roh ? JSON.parse(roh) : {};
    return obj && typeof obj === 'object' ? (obj as Record<string, ProtokollStand>) : {};
  } catch {
    return {};
  }
}

export function ladeProtokoll(d: VersuchsHandoutDaten): ProtokollStand | null {
  const p = alleGespeicherten()[d.id];
  if (!p || typeof p !== 'object' || !Array.isArray(p.zeilen) || typeof p.kopf !== 'object') return null;
  // gegen geänderte Spalten absichern: nur bekannte Felder übernehmen
  const leer = leeresProtokoll(d);
  return {
    kopf: Object.fromEntries(Object.keys(leer.kopf).map(k => [k, String(p.kopf[k] ?? leer.kopf[k])])),
    zeilen: p.zeilen.map(z => Object.fromEntries(d.protokoll.spalten.map(s => [s.id, String(z?.[s.id] ?? '')]))),
  };
}

export function speichereProtokoll(id: string, p: ProtokollStand | null): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const alle = alleGespeicherten();
    if (p) alle[id] = p; else delete alle[id];
    localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(alle));
  } catch {
    /* Speicher voll oder gesperrt – Protokoll bleibt nur in der Sitzung */
  }
}

// ── CSV ──────────────────────────────────────────────────────────────────────
const spaltenKopf = (label: string, einheit?: string) => (einheit ? `${label} [${einheit}]` : label);
/** Zahlen im CSV mit Dezimalkomma (Trennzeichen Semikolon, deutsches Excel) */
const csvWert = (v: string) => v.trim().replace(/^([+-]?\d+)\.(\d+)$/, '$1,$2');

export function protokollCsv(d: VersuchsHandoutDaten, p: ProtokollStand, ergebnisse: readonly HandoutErgebnis[]): { headers: string[]; rows: string[][] } {
  const headers = ['Nr.', ...d.protokoll.spalten.map(s => spaltenKopf(s.label, s.einheit))];
  const rows: string[][] = p.zeilen
    .filter(zeileBelegt)
    .map((z, i) => [String(i + 1), ...d.protokoll.spalten.map(s => csvWert(z[s.id] ?? ''))]);
  rows.push([]);
  rows.push(['Kopfdaten']);
  for (const k of d.protokoll.kopf) {
    const roh = p.kopf[k.id] ?? '';
    const wert = k.typ === 'auswahl' ? (k.optionen?.find(o => o.wert === roh)?.label ?? roh) : csvWert(roh);
    rows.push([spaltenKopf(k.label, k.einheit), wert]);
  }
  if (ergebnisse.length) {
    rows.push([]);
    rows.push(['Auswertung']);
    for (const e of ergebnisse) rows.push([e.label, e.wert]);
  }
  rows.push([]);
  rows.push(['Versuch', d.titel]);
  rows.push(['Regelwerke', d.normen.join(', ')]);
  return { headers, rows };
}

export function dateiname(d: VersuchsHandoutDaten, datum = new Date()): string {
  const iso = datum.toISOString().slice(0, 10);
  return `Messprotokoll_${d.id}_${iso}`;
}

// ── Druck / PDF ──────────────────────────────────────────────────────────────
export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const anpassen = (x: { laborAnpassen?: boolean }) => (x.laborAnpassen ? ` <span class="badge badge-warning">${LABOR_ANPASSEN}</span>` : '');

/**
 * Druckfertiges HTML des Handouts. stand = null → leeres Protokoll zum Ausfüllen von Hand
 * (Zeilenzahl aus dem Schema), sonst die eingegebenen Werte und die Auswertung.
 */
export function handoutHtml(d: VersuchsHandoutDaten, stand: ProtokollStand | null, ergebnisse: readonly HandoutErgebnis[]): string {
  const e = escapeHtml;
  const liste = (xs: readonly string[]) => `<ul>${xs.map(x => `<li>${e(x)}</li>`).join('')}</ul>`;
  const posten = (xs: VersuchsHandoutDaten['geraete']) =>
    `<ul>${xs.map(x => `<li>${e(x.name)}${x.hinweis ? ` – ${e(x.hinweis)}` : ''}${anpassen(x)}</li>`).join('')}</ul>`;
  const zeilen = stand ? stand.zeilen.filter(zeileBelegt) : [];
  const leereZeilen = stand ? Math.max(0, 2 - zeilen.length) : d.protokoll.zeilen;
  const kopfWert = (id: string) => {
    if (!stand) return '';
    const k = d.protokoll.kopf.find(x => x.id === id);
    const roh = stand.kopf[id] ?? '';
    return k?.typ === 'auswahl' ? (k.optionen?.find(o => o.wert === roh)?.label ?? roh) : roh;
  };
  return `
    <div class="header-bar">
      <div>
        <h1 class="header-title">${e(d.titel)}</h1>
        <div class="header-sub">Versuchs-Handout · ${e(d.normen.join(' · '))} · Dauer ${e(d.dauer)} · ${e(d.gruppe)}</div>
      </div>
      <span class="badge">BaustoffBoard · Baustofflabor</span>
    </div>
    <h2>Ziel</h2>${liste(d.ziel)}
    <h2>Geräte</h2>${posten(d.geraete)}
    <h2>Material</h2>${posten(d.material)}
    <h2>Sicherheit</h2>
    <table><thead><tr><th scope="col">Gefährdung</th><th scope="col">Maßnahme</th></tr></thead><tbody>
      ${d.sicherheit.map(s => `<tr><td>${e(s.gefahr)}</td><td>${e(s.massnahme)}</td></tr>`).join('')}
    </tbody></table>
    <h2>Ablauf</h2>
    <ol>${d.ablauf.map(a => `<li><strong>${e(a.titel)}</strong>${a.dauer ? ` (${e(a.dauer)})` : ''}: ${e(a.text)}${anpassen(a)}</li>`).join('')}</ol>
    <h2>${e(d.protokoll.titel)}</h2>
    <table><tbody>
      ${d.protokoll.kopf.map(k => `<tr><th scope="row">${e(spaltenKopf(k.label, k.einheit))}</th><td>${e(kopfWert(k.id))}&nbsp;</td></tr>`).join('')}
    </tbody></table>
    <table><thead><tr><th scope="col">Nr.</th>${d.protokoll.spalten.map(s => `<th scope="col">${e(spaltenKopf(s.label, s.einheit))}</th>`).join('')}</tr></thead><tbody>
      ${zeilen.map((z, i) => `<tr><td>${i + 1}</td>${d.protokoll.spalten.map(s => `<td>${e(z[s.id] ?? '')}</td>`).join('')}</tr>`).join('')}
      ${Array.from({ length: leereZeilen }, (_, i) => `<tr><td>${zeilen.length + i + 1}</td>${d.protokoll.spalten.map(() => '<td>&nbsp;</td>').join('')}</tr>`).join('')}
    </tbody></table>
    ${ergebnisse.length ? `<h2>Auswertung</h2><div class="metric-box"><table><tbody>${ergebnisse.map(r => `<tr><th scope="row">${e(r.label)}</th><td>${e(r.wert)}</td></tr>`).join('')}</tbody></table></div>` : ''}
    <h2>Fehlerquellen</h2>
    <table><thead><tr><th scope="col">Fehlerquelle</th><th scope="col">Wirkung</th><th scope="col">Abhilfe</th></tr></thead><tbody>
      ${d.fehlerquellen.map(f => `<tr><td>${e(f.quelle)}</td><td>${e(f.wirkung)}</td><td>${e(f.abhilfe)}</td></tr>`).join('')}
    </tbody></table>
    <h2>Fragen zur Nachbereitung</h2>
    <ol>${d.fragen.map(f => `<li>${e(f)}</li>`).join('')}</ol>
    <p class="header-sub">Lehrhandout: Kernpunkte der Regelwerke, maßgebend ist der Normtext. Geräte, Probenzahl und Mengen sind ${LABOR_ANPASSEN}.</p>
    <table><tbody><tr><th scope="row">Datum, Unterschrift Gruppe</th><td>&nbsp;</td><th scope="row">Testat Betreuung</th><td>&nbsp;</td></tr></tbody></table>
  `;
}
