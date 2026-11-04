/**
 * Schreibvarianten und Synonyme für Menü- und Volltextsuche (Gesamtgutachten 03.11.2026, Abschnitt 3.3 / 5.1:
 * „w/z-Wert“ fand nur „Expositionsklassen“, nicht die Mischungsberechnung).
 *
 * Normalisierung (gilt für Suchanfrage, Titel, Überschriften, Suchbegriffe und Indexwörter gleichermaßen):
 *  - Kleinschreibung, Unicode NFC; ä/ö/ü/ß ↔ ae/oe/ue/ss (beide Schreibweisen treffen dasselbe),
 *    weitere Akzente entfernt (é → e);
 *  - Formelzeichen und Trennzeichen: „w/z“, „W/Z“, „w_z“, „f_ck“, „f ck“ → ohne Trenner („wz“, „fck“); Bindestrich-
 *    und Leerzeichenvarianten („Glaser-Verfahren“, „Glaser Verfahren“, „Glaserverfahren“) treffen einander;
 *  - Plural und Beugung: einfache Endungen (-en, -n, -e, -s, -er) werden bei Wörtern ab 6 Zeichen abgetrennt.
 * Synonyme: zentrale Fachbegriffe mit ihren Schreibvarianten und den Modulen, in denen sie behandelt werden. Ein
 * Synonymtreffer zählt in den Zielmodulen wie ein Titeltreffer.
 * Reine Funktionen ohne Registry-Import (Einstiegs-Chunk, Tests).
 */

/** Kleinschreibung, NFC, Umlaute als ae/oe/ue/ss, ohne sonstige Akzente */
export function falte(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFC')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .normalize('NFC');
}

/** Trennzeichen (Leerzeichen, Bindestrich, Schräg- und Unterstrich, Punkt, Mittelpunkt) entfernt */
export function kompakt(s: string): string {
  return falte(s).replace(/[\s\-‐‑–—_/·.,;:()'’"]+/g, '');
}

const ENDUNGEN = ['ern', 'en', 'er', 'e', 'n', 's'];
/** Wortstamm für Plural/Beugung (nur Wörter ab 6 Zeichen; höchstens eine Endung) */
export function stamm(wort: string): string {
  if (wort.length < 6) return wort;
  for (const e of ENDUNGEN) if (wort.endsWith(e) && wort.length - e.length >= 5) return wort.slice(0, -e.length);
  return wort;
}

export interface Synonym {
  /** Schreibvarianten (erste = Leitform) */
  formen: readonly string[];
  /** Module, in denen der Begriff zentral behandelt wird */
  ziele: readonly string[];
}

/**
 * Zentrale Fachbegriffe. Formen werden über kompakt() verglichen, also ohne Rücksicht auf Groß-/Kleinschreibung,
 * Umlautschreibung, Bindestrich, Leer-, Schräg- und Unterstrich.
 */
export const SYNONYME: readonly Synonym[] = [
  { formen: ['Wasserzementwert', 'w/z-Wert', 'w/z', 'wz-Wert', 'Wasserzementverhältnis'], ziele: ['mischungsberechnung', 'expositionsklassen', 'festbeton'] },
  { formen: ['Wasserbindemittelwert', 'w/b-Wert', 'w/b', '(w/z)eq', 'äquivalenter Wasserzementwert'], ziele: ['mischungsberechnung', 'expositionsklassen'] },
  { formen: ['fck', 'f_ck', 'f ck', 'charakteristische Druckfestigkeit', 'Zylinderdruckfestigkeit'], ziele: ['betonkennwerte', 'festbeton', 'stahlbeton_bemessung'] },
  { formen: ['fcm', 'f_cm', 'mittlere Druckfestigkeit'], ziele: ['betonkennwerte', 'festbeton_statistik'] },
  { formen: ['fyk', 'f_yk', 'Streckgrenze Betonstahl'], ziele: ['stahlbeton_bemessung', 'stahl'] },
  { formen: ['E-Modul', 'Elastizitätsmodul', 'Emodul', 'E_cm', 'Ecm'], ziele: ['emodul', 'betonkennwerte', 'mechanische_kenngroessen'] },
  { formen: ['U-Wert', 'Wärmedurchgangskoeffizient', 'Uwert'], ziele: ['bauphysik', 'rechnung_u_wert', 'waermeeigenschaften'] },
  { formen: ['Glaser-Verfahren', 'Glaserverfahren', 'Tauwassernachweis', 'Tauwasser', 'Kondensat', 'Taupunkt'], ziele: ['feuchteschutz'] },
  { formen: ['Lambda-Wert', 'λ-Wert', 'Wärmeleitfähigkeit', 'Lambda'], ziele: ['waermeeigenschaften', 'daemmstoffe', 'materialkennwerte'] },
  { formen: ['Karbonatisierung', 'Carbonatisierung', 'Karbonatisierungstiefe'], ziele: ['dauerhaftigkeit', 'lebensdauerbemessung', 'schnellkarbonatisierung'] },
  { formen: ['Ökobilanz', 'LCA', 'Life Cycle Assessment', 'Lebenszyklusanalyse'], ziele: ['oekobilanz_lca', 'lca_rechner'] },
  { formen: ['GWP', 'Treibhauspotenzial', 'Treibhauspotential', 'CO2-Äquivalent', 'CO₂-Äquivalent'], ziele: ['oekobilanz_lca', 'lca_rechner'] },
  { formen: ['PFAS', 'per- und polyfluorierte Alkylsubstanzen', 'PFOS', 'PFOA'], ziele: ['pfas_baustoffe'] },
  { formen: ['EBV', 'Ersatzbaustoffverordnung', 'ErsatzbaustoffV', 'Mantelverordnung'], ziele: ['abfaelle', 'boden_materialaufbereitung', 'rueckbau'] },
  { formen: ['Expositionsklasse', 'XC', 'XD', 'XS', 'XF', 'XA', 'XM'], ziele: ['expositionsklassen'] },
  { formen: ['Sieblinie', 'Korngrößenverteilung', 'Kornzusammensetzung', 'Körnungslinie'], ziele: ['mischungsberechnung', 'grundlagen'] },
  { formen: ['Ausbreitmaß', 'Konsistenz', 'Setzmaß', 'Slump'], ziele: ['frischbeton', 'labor_frischbeton'] },
  { formen: ['Schalldämmmaß', "R'w", 'Rw', 'Bauschalldämmmaß', 'Schallschutz'], ziele: ['schallschutz', 'rechnung_schallschutz'] },
  { formen: ['Asbest', 'Asbestsanierung', 'TRGS 519'], ziele: ['schadstoffe', 'rueckbau'] },
  { formen: ['Hydratationswärme', 'Hydratation', 'Abbindewärme'], ziele: ['hydratation_folgen', 'bindemittel'] },
  { formen: ['Kriechen', 'Schwinden', 'Kriechzahl', 'Schwindmaß'], ziele: ['kriechen', 'formaenderungen'] },
];

interface SynonymKompakt { formen: string[]; staemme: string[]; ziele: readonly string[] }
const SYN_K: SynonymKompakt[] = SYNONYME.map(s => {
  const formen = s.formen.map(kompakt).filter(f => f.length >= 2);
  return { formen, staemme: formen.filter(f => f.length >= 6).map(stamm), ziele: s.ziele };
});

/** Synonymgruppen, deren Form der Begriff (kompakt, auch im Plural bzw. gebeugt) entspricht */
export function synonymeFuer(begriff: string): SynonymKompakt[] {
  const k = kompakt(begriff);
  if (k.length < 2) return [];
  const st = stamm(k);
  return SYN_K.filter(s => s.formen.includes(k) || (k.length >= 6 && s.staemme.includes(st)));
}

export interface Suchbegriff {
  /** eingegebene Form, gefaltet */
  roh: string;
  /** Vergleichsformen als Teilwort (kompakt und Stamm, dazu Synonymformen ab 4 Zeichen) */
  formen: string[];
  /** kurze Synonymformen (unter 4 Zeichen, z. B. „wz“, „xc“, „rw“): nur als ganzes Wort, ggf. mit Ziffern dahinter */
  woerter: string[];
  /** Zielmodule der Synonymgruppen */
  ziele: Set<string>;
}

/**
 * Anfrage in Suchbegriffe zerlegen. Mehrwortbegriffe, die als Ganzes ein Synonym sind („Glaser Verfahren“,
 * „w z Wert“), bleiben ein Begriff; sonst je Wort ein Begriff (alle müssen vorkommen).
 */
export function zerlege(anfrage: string): Suchbegriff[] {
  const roh = falte(anfrage).trim();
  if (!roh) return [];
  const bau = (t: string): Suchbegriff => {
    const syn = synonymeFuer(t);
    const k = kompakt(t);
    const formen = new Set<string>([k, stamm(k)]);
    const woerter = new Set<string>();
    for (const s of syn) for (const f of s.formen) (f.length >= 4 ? formen : woerter).add(f);
    // kurze Eingabe, die ein Synonym ist („w/z“ → „wz“): nur als ganzes Wort
    if (syn.length && k.length < 4) { formen.delete(k); woerter.add(k); }
    return { roh: t, formen: [...formen].filter(f => f.length >= 2), woerter: [...woerter].filter(f => !formen.has(f)), ziele: new Set(syn.flatMap(s => s.ziele)) };
  };
  if (synonymeFuer(roh).length) return [bau(roh)];
  const woerter = roh.split(/\s+/).filter(w => kompakt(w).length >= 2);
  // Zwei benachbarte Wörter, die zusammen ein Synonym sind („w/z Wert“), zusammenziehen
  const aus: Suchbegriff[] = [];
  for (let i = 0; i < woerter.length; i++) {
    const paar = i + 1 < woerter.length ? `${woerter[i]} ${woerter[i + 1]}` : '';
    if (paar && synonymeFuer(paar).length) { aus.push(bau(paar)); i++; } else aus.push(bau(woerter[i]));
  }
  return aus;
}

/** Text für den Vergleich vorbereiten: gefaltet mit und ohne Trenner */
export interface Vergleichstext { gefaltet: string; kompakt: string; woerter: readonly string[] }
export const vergleichstext = (s: string): Vergleichstext => {
  const gefaltet = falte(s);
  return { gefaltet, kompakt: kompakt(gefaltet), woerter: gefaltet.split(/[\s,;:()]+/).map(kompakt).filter(Boolean) };
};

/** Kurzform als ganzes Wort („xc“ trifft „xc4“, „xc“; nicht „exc…“) */
const wortTrifft = (w: string, f: string) => w === f || (w.startsWith(f) && /^\d/.test(w.slice(f.length)));

/** Kommt der Begriff im Text vor (Teilwort, in jeder Schreibvariante)? */
export function enthaelt(t: Vergleichstext, b: Suchbegriff): boolean {
  return b.formen.some(f => t.kompakt.includes(f)) || (b.woerter.length > 0 && t.woerter.some(w => b.woerter.some(f => wortTrifft(w, f))));
}

/** Menüsuche: passt das Modul (Beschriftungen und Suchbegriffe) zur Anfrage? Alle Begriffe müssen vorkommen. */
export function modulPasst(anfrage: string, id: string, texte: readonly (string | undefined)[]): boolean {
  const begriffe = zerlege(anfrage);
  if (!begriffe.length) return true;
  const v = texte.filter((x): x is string => !!x).map(vergleichstext);
  return begriffe.every(b => b.ziele.has(id) || v.some(t => enthaelt(t, b)));
}
