/**
 * Seitenbreite (Standard 1152 px, Breit 1536 px, 100 % Vollbild) als Klasse an <html> (LCP breite Ansicht,
 * 02.11.2026, docs/pruefung/lcp-breite-2026-11-02.md).
 *
 * Wie beim Darstellungsschalter (Klasse dark) schaltet das Markup die Breiten-Varianten per CSS um, nicht über den
 * React-Zustand: Die vorgerenderte Seite ist dann in allen drei Breiten dieselbe und entspricht dem ersten Bild von
 * React. Das Boot-Skript scripts/startschale-boot.js setzt die Klasse vor dem ersten Bild (gleiche Leseregel wie
 * leseSeitenbreite); die App hält sie danach aktuell. Ohne Klasse gilt „Breit“ (Voreinstellung) – so auch im
 * Entwicklungsserver bis zum ersten Effekt und beim Vorrendern in Node.
 * Tailwind-Varianten breite-standard: und breite-full: in src/index.css.
 */
export type Bildschirmbreite = 'standard' | 'wide' | 'full';

export const BREITEN_KLASSE: Readonly<Record<Bildschirmbreite, string>> = {
  standard: 'bb-breite-standard',
  wide: 'bb-breite-wide',
  full: 'bb-breite-full',
};

const istBreite = (s: unknown): s is Bildschirmbreite => s === 'standard' || s === 'wide' || s === 'full';

/** gespeicherte Breite (ältere Einstellung baustoffboard_fluid_width wird übernommen), sonst „Breit“ */
export function leseSeitenbreite(): Bildschirmbreite {
  try {
    const saved = localStorage.getItem('baustoffboard_screen_width');
    if (istBreite(saved)) return saved;
    const legacyFluid = localStorage.getItem('baustoffboard_fluid_width');
    if (legacyFluid !== null) return legacyFluid === 'true' ? 'full' : 'standard';
  } catch { /* gesperrter Speicher */ }
  return 'wide';
}

/** Klasse an <html> setzen (genau eine der drei) */
export function setzeBreitenKlasse(breite: Bildschirmbreite): void {
  if (typeof document === 'undefined') return;
  const cl = document.documentElement.classList;
  for (const [b, k] of Object.entries(BREITEN_KLASSE)) cl.toggle(k, b === breite);
}

/** Breite wählen: speichern, Klasse setzen, andere Komponenten benachrichtigen */
export function waehleSeitenbreite(breite: Bildschirmbreite): void {
  setzeBreitenKlasse(breite);
  try {
    localStorage.setItem('baustoffboard_screen_width', breite);
    localStorage.setItem('baustoffboard_fluid_width', breite === 'full' ? 'true' : 'false');
  } catch { /* gesperrter Speicher: gilt nur bis zum Neuladen */ }
  try {
    window.dispatchEvent(new CustomEvent('baustoffboard_width_change', { detail: breite }));
  } catch { /* ohne Ereignis */ }
}

/** Ereignis-Nutzlast prüfen */
export const alsSeitenbreite = (e: Event): Bildschirmbreite | null => {
  const d = (e as CustomEvent<unknown>).detail;
  return istBreite(d) ? d : null;
};
