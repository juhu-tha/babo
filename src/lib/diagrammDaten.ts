import { formatDeIntl } from '../utils/numberFormat';
// Textalternative für Diagramme (Paket Z8, WCAG 1.1.1 / 1.3.1): Kurzbeschreibung und Datentabelle
// werden aus der Chart.js-Datenkonfiguration (labels/datasets) und den Achsentiteln der Optionen erzeugt.
// Reine Funktionen ohne React und ohne Chart.js – genutzt von src/lib/diagrammAlternative.tsx.

/** Angaben, die ein Modul zusätzlich machen kann (über <DiagrammAngaben> oder aria-label am Diagramm) */
export type DiagrammAngabenWerte = {
  /** eigene Kurzbeschreibung (ersetzt die erzeugte) */
  zusammenfassung?: string;
  /** Titel, falls das Diagramm keinen Chart.js-Titel hat (sonst options.plugins.title.text) */
  titel?: string;
  /** Einheiten je Achse (Achsen-ID wie in options.scales, z. B. { x: 'mm', y: 'N/mm²' }) */
  einheiten?: Record<string, string>;
  /** false: keine Tabelle anbieten (z. B. wenn die Daten schon als Tabelle daneben stehen) */
  tabelle?: boolean;
};

type Wert = unknown;
type Datensatz = { label?: unknown; data?: unknown; hidden?: unknown; type?: unknown; xAxisID?: unknown; yAxisID?: unknown; rAxisID?: unknown };
export type DiagrammDaten = { labels?: unknown; datasets?: unknown };
type Achse = { title?: { text?: unknown } };
export type DiagrammOptionen = {
  indexAxis?: unknown;
  plugins?: { title?: { text?: unknown } };
  scales?: Record<string, Achse | undefined>;
};

export type Tabelle = {
  beschriftung: string;
  kopf: string;
  spalten: string[];
  zeilen: { kopf: string; zellen: string[] }[];
  /** Anzahl der Zeilen vor dem Ausdünnen */
  gesamt: number;
  /** > 1: nur jede n-te Zeile (und die letzte) gezeigt */
  schritt: number;
};

export const MAX_ZEILEN = 50;

const ARTEN: Record<string, string> = {
  line: 'Liniendiagramm', bar: 'Balkendiagramm', radar: 'Netzdiagramm', doughnut: 'Ringdiagramm', pie: 'Kreisdiagramm',
  polarArea: 'Polarflächendiagramm', bubble: 'Blasendiagramm', scatter: 'Streudiagramm',
};
const KREIS = new Set(['doughnut', 'pie', 'polarArea']);

const istObjekt = (w: Wert): w is Record<string, unknown> => typeof w === 'object' && w !== null && !Array.isArray(w);
const istZahl = (w: Wert): w is number => typeof w === 'number' && Number.isFinite(w);

/** Text aus Chart.js-Texten (string | string[] | number) */
export function alsText(w: Wert): string {
  if (Array.isArray(w)) return w.map(alsText).filter(Boolean).join(' ');
  if (typeof w === 'string') return w.trim();
  if (typeof w === 'number') return Number.isFinite(w) ? zahl(w) : '';
  if (w instanceof Date) return w.toLocaleDateString('de-DE');
  return '';
}

/** Zahl in deutscher Schreibweise, 4 signifikante Stellen (Tausendertrennung ab 5 Stellen) */
export function zahl(w: number): string {
  if (!Number.isFinite(w)) return '–';
  const g = Math.abs(w);
  const opt: Intl.NumberFormatOptions = g >= 1000 || g === 0 || Number.isInteger(w)
    ? { maximumFractionDigits: g >= 1000 ? 0 : 3 }
    : { maximumSignificantDigits: 4 };
  return formatDeIntl(w, opt);
}

function zelle(w: Wert, feld: 'x' | 'y' = 'y'): string {
  if (w === null || w === undefined) return '–';
  if (istZahl(w)) return zahl(w);
  if (Array.isArray(w) && w.length === 2 && w.every(istZahl)) return `${zahl(w[0])} bis ${zahl(w[1])}`;
  if (istObjekt(w)) {
    const basis = zelle(w[feld] ?? w.r ?? w.v);
    return istZahl(w.r) && w[feld] !== undefined ? `${basis} (Größe ${zahl(w.r)})` : basis;
  }
  return alsText(w) || '–';
}

function datensaetze(daten: DiagrammDaten | undefined): Datensatz[] {
  const ds = daten?.datasets;
  return Array.isArray(ds) ? ds.filter((d): d is Datensatz => istObjekt(d) && Array.isArray(d.data) && d.data.length > 0) : [];
}

function achsenTitel(optionen: DiagrammOptionen | undefined, id: string): string {
  return alsText(optionen?.scales?.[id]?.title?.text);
}

/** Kategorie-/x-Achse und Werte-/y-Achse (indexAxis 'y': liegende Balken) */
function achsen(optionen: DiagrammOptionen | undefined): { index: 'x' | 'y'; wert: 'x' | 'y' } {
  return optionen?.indexAxis === 'y' ? { index: 'y', wert: 'x' } : { index: 'x', wert: 'y' };
}

function einheitZu(text: string, einheit: string | undefined): string {
  return einheit ? `${text} [${einheit}]` : text;
}

type Punkt = { schluessel: string; sortier: number | undefined; wert: string };

/** Datensatz als Liste (x-Schlüssel, Zellwert): Zahlenreihen über labels, Punkte über x */
function punkte(d: Datensatz, labels: unknown[], indexAchse: 'x' | 'y'): Punkt[] {
  const wertFeld = indexAchse === 'y' ? 'x' : 'y';
  return (d.data as unknown[]).map((w, i) => {
    const x: Wert = istObjekt(w) && w[indexAchse] !== undefined ? w[indexAchse] : labels[i] ?? i + 1;
    return { schluessel: alsText(x) || String(i + 1), sortier: istZahl(x) ? x : undefined, wert: zelle(w, wertFeld) };
  });
}

function ausduennen<T>(zeilen: T[]): { zeilen: T[]; schritt: number } {
  if (zeilen.length <= MAX_ZEILEN) return { zeilen, schritt: 1 };
  const schritt = Math.ceil(zeilen.length / MAX_ZEILEN);
  return { zeilen: zeilen.filter((_, i) => i % schritt === 0 || i === zeilen.length - 1), schritt };
}

/** Datentabellen zum Diagramm (meist eine; mehrere, wenn die Reihen ganz verschiedene x-Werte haben) */
export function tabellen(art: string, daten: DiagrammDaten | undefined, optionen?: DiagrammOptionen, angaben: DiagrammAngabenWerte = {}): Tabelle[] {
  const ds = datensaetze(daten);
  if (!ds.length) return [];
  const labels = Array.isArray(daten?.labels) ? (daten.labels as unknown[]) : [];
  const { index, wert } = achsen(optionen);
  const titel = angaben.titel || alsText(optionen?.plugins?.title?.text);
  const kreis = KREIS.has(art) || art === 'radar';
  const einheiten = angaben.einheiten ?? {};
  const indexKopf = kreis ? 'Kategorie' : einheitZu(achsenTitel(optionen, index) || (labels.length ? 'Kategorie' : index), einheiten[index]);
  const name = (d: Datensatz, i: number) => alsText(d.label) || (ds.length === 1 ? 'Wert' : `Reihe ${i + 1}`);
  const wertAchse = (d: Datensatz) => alsText(index === 'x' ? d.yAxisID : d.xAxisID) || (art === 'radar' || art === 'polarArea' ? 'r' : wert);
  const spalte = (d: Datensatz, i: number) => {
    return einheitZu(name(d, i), einheiten[wertAchse(d)]);
  };
  // Wertachsen-Titel in die Beschriftung (nicht in jede Spalte)
  const wertTitel = [...new Set(ds.map(d => achsenTitel(optionen, wertAchse(d))).filter(Boolean))];
  const beschriftung = [`Daten${titel ? `: ${titel}` : ' des Diagramms'}`, wertTitel.length ? `Werte: ${wertTitel.join('; ')}` : ''].filter(Boolean).join(' – ');

  const reihen = ds.map(d => punkte(d, labels, index));
  const gleich = reihen.every(r => r.length === reihen[0].length && r.every((p, i) => p.schluessel === reihen[0][i].schluessel));
  const mitZeilen = (zeilen: Tabelle['zeilen'], spalten: string[], kopf: string, b: string): Tabelle => {
    const { zeilen: z, schritt } = ausduennen(zeilen);
    return { beschriftung: b, kopf, spalten, zeilen: z, gesamt: zeilen.length, schritt };
  };
  if (gleich) {
    return [mitZeilen(reihen[0].map((p, i) => ({ kopf: p.schluessel, zellen: reihen.map(r => r[i].wert) })), ds.map(spalte), indexKopf, beschriftung)];
  }
  // verschiedene x-Werte: Vereinigung, wenn sie nicht viel größer wird als die längste Reihe
  const alle = new Map<string, number | undefined>();
  for (const r of reihen) for (const p of r) if (!alle.has(p.schluessel)) alle.set(p.schluessel, p.sortier);
  const laengste = Math.max(...reihen.map(r => r.length));
  if (alle.size <= Math.max(laengste * 1.5, laengste + 5)) {
    let schluessel = [...alle.keys()];
    if ([...alle.values()].every(istZahl)) schluessel = schluessel.sort((a, b) => (alle.get(a) as number) - (alle.get(b) as number));
    const nachSchluessel = reihen.map(r => new Map(r.map(p => [p.schluessel, p.wert])));
    return [mitZeilen(schluessel.map(s => ({ kopf: s, zellen: nachSchluessel.map(m => m.get(s) ?? '–') })), ds.map(spalte), indexKopf, beschriftung)];
  }
  return reihen.map((r, i) => mitZeilen(r.map(p => ({ kopf: p.schluessel, zellen: [p.wert] })), [spalte(ds[i], i)], indexKopf, `${beschriftung} – ${name(ds[i], i)}`));
}

function bereich(werte: number[]): [number, number] | undefined {
  if (!werte.length) return undefined;
  let min = Infinity, max = -Infinity;
  for (const w of werte) { if (w < min) min = w; if (w > max) max = w; }
  return [min, max];
}

/** Zahlen eines Datenpunkts auf einer Achse; reine Zahlen und [von, bis] gehören zur Wertachse */
function zahlenAus(w: Wert, feld: 'x' | 'y', wertAchse: boolean): number[] {
  if (istZahl(w)) return wertAchse ? [w] : [];
  if (Array.isArray(w)) return wertAchse ? w.filter(istZahl) : [];
  if (istObjekt(w) && istZahl(w[feld])) return [w[feld] as number];
  return [];
}

/** Kurzbeschreibung für aria-label: Art, Titel, Reihen, Achsen mit Wertebereichen */
export function zusammenfassung(art: string, daten: DiagrammDaten | undefined, optionen?: DiagrammOptionen, angaben: DiagrammAngabenWerte = {}): string {
  if (angaben.zusammenfassung) return angaben.zusammenfassung;
  const ds = datensaetze(daten);
  const artName = ARTEN[art] ?? 'Diagramm';
  const titel = angaben.titel || alsText(optionen?.plugins?.title?.text);
  const teile = [titel ? `${artName}: ${titel}` : artName];
  if (!ds.length) return `${teile[0]} (keine Daten).`;
  const labels = Array.isArray(daten?.labels) ? (daten.labels as unknown[]) : [];
  const namen = ds.map(d => alsText(d.label)).filter(Boolean);
  const einheiten = angaben.einheiten ?? {};
  if (KREIS.has(art)) {
    const d = ds[0].data as unknown[];
    const summe = d.reduce<number>((s, w) => s + (istZahl(w) ? w : 0), 0);
    const anteile = labels.slice(0, 6).map((l, i) => {
      const w = d[i];
      return istZahl(w) ? `${alsText(l)} ${summe > 0 ? zahl((100 * w) / summe) : zahl(w)} %` : alsText(l);
    }).filter(Boolean);
    teile.push(anteile.length ? `Anteile: ${anteile.join(', ')}${labels.length > 6 ? ` und ${labels.length - 6} weitere` : ''}` : `${labels.length} Kategorien`);
    return teile.join('. ') + '.';
  }
  teile.push(`${ds.length} ${ds.length === 1 ? 'Datenreihe' : 'Datenreihen'}${namen.length ? ` (${namen.slice(0, 5).join(', ')}${namen.length > 5 ? ` und ${namen.length - 5} weitere` : ''})` : ''}`);
  const { index, wert } = achsen(optionen);
  if (art !== 'radar') {
    const iTitel = achsenTitel(optionen, index);
    const iWerte = labels.length && labels.every(istZahl) ? (labels as number[]) : ds.flatMap(d => (d.data as unknown[]).flatMap(w => zahlenAus(w, index, false)));
    const ib = bereich(iWerte);
    const ie = einheiten[index] ? ` ${einheiten[index]}` : '';
    if (ib && ib[0] !== ib[1]) teile.push(`${iTitel || `${index}-Achse`} von ${zahl(ib[0])} bis ${zahl(ib[1])}${ie}`);
    else if (labels.length) teile.push(`${iTitel || 'Kategorien'}: ${labels.length > 4 ? `${alsText(labels[0])} bis ${alsText(labels[labels.length - 1])}` : labels.map(alsText).join(', ')}`);
    else if (iTitel) teile.push(iTitel);
  } else if (labels.length) teile.push(`Achsen: ${labels.map(alsText).slice(0, 8).join(', ')}`);
  const wTitel = art === 'radar' ? '' : achsenTitel(optionen, wert);
  const wWerte = ds.flatMap(d => (d.data as unknown[]).flatMap(w => zahlenAus(w, wert, true)));
  const wb = bereich(wWerte);
  const we = einheiten[wert] ?? einheiten.r;
  if (wb) teile.push(`${wTitel || 'Werte'} ${wb[0] === wb[1] ? zahl(wb[0]) : `von ${zahl(wb[0])} bis ${zahl(wb[1])}`}${we ? ` ${we}` : ''}`);
  return teile.join('. ') + '.';
}
