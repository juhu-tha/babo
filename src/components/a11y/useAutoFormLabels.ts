import { useEffect } from 'react';
import { formatDeWert } from '@/src/utils/numberFormat';

/**
 * Ergänzt fehlende zugängliche Namen von Formularfeldern und macht scrollbare Bereiche per Tastatur
 * erreichbar (Umsetzungsplan Phase 2, AP 2.3/2.6).
 *
 * Viele Rechner stellen die Beschriftung als Text neben das Feld, ohne <label for> oder aria-label.
 * Dieser Hook verknüpft solche Felder zur Laufzeit mit dem sichtbaren Beschriftungstext davor
 * (aria-label), damit Screenreader den Namen ansagen. Neue Module sollen Felder direkt beschriften;
 * der Hook ist ein Sicherheitsnetz, kein Ersatz.
 *
 * Ebenso (Prüfung 03.11.2026): Schieberegler ohne aria-valuetext erhalten den angezeigten Wert mit Einheit
 * (sonst den deutsch formatierten Wert, ggf. mit Einheit aus der Beschriftung), Tabellen ohne Beschriftung
 * den Text der Überschrift davor (WCAG 4.1.2, 1.3.1).
 */
const FELDER = 'input:not([type=hidden]):not([type=button]):not([type=submit]), select, textarea';

function hatNamen(el: HTMLElement): boolean {
  if (el.getAttribute('aria-label')?.trim() || el.getAttribute('aria-labelledby') || el.getAttribute('title')?.trim()) return true;
  if (el.closest('label')) return true;
  const id = el.id;
  if (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) return true;
  const typ = (el as HTMLInputElement).type;
  if ((typ === 'checkbox' || typ === 'radio') && el.parentElement?.textContent?.trim()) return false;
  return false;
}

function textOhneFelder(node: Element): string {
  const kopie = node.cloneNode(true) as Element;
  kopie.querySelectorAll('input, select, textarea, button, option, svg').forEach(n => n.remove());
  return (kopie.textContent ?? '').replace(/\s+/g, ' ').trim();
}

function findeBeschriftung(el: HTMLElement): string | null {
  // Kontrollkästchen/Optionsfelder: Beschriftung steht meist danach
  const typ = (el as HTMLInputElement).type;
  if (typ === 'checkbox' || typ === 'radio') {
    let nach = el.nextElementSibling;
    while (nach) { const t = textOhneFelder(nach); if (t.length >= 2) return t.slice(0, 100); nach = nach.nextElementSibling; }
  }
  // Felder in Tabellen: Spaltenkopf + erste Zelle der Zeile
  const zelle = el.closest('td, th') as HTMLTableCellElement | null;
  const tabelle = zelle?.closest('table');
  if (zelle && tabelle) {
    const kopf = tabelle.querySelector('thead tr')?.children.item(zelle.cellIndex);
    const zeile = zelle.parentElement as HTMLTableRowElement | null;
    const ersteZelle = zeile?.cells.item(0);
    const spalte = kopf ? textOhneFelder(kopf) : '';
    const reihe = ersteZelle && ersteZelle !== zelle ? textOhneFelder(ersteZelle) : (zeile ? `Zeile ${zeile.rowIndex}` : '');
    const t = [spalte, reihe].filter(Boolean).join(', ');
    if (t) return t.slice(0, 100);
  }
  let knoten: Element | null = el;
  for (let ebene = 0; ebene < 3 && knoten; ebene++) {
    let vor = knoten.previousElementSibling;
    while (vor) {
      if (!vor.querySelector(FELDER)) {
        const t = textOhneFelder(vor);
        if (t.length >= 2) return t.slice(0, 100);
      }
      vor = vor.previousElementSibling;
    }
    knoten = knoten.parentElement;
    if (knoten && knoten.querySelectorAll(FELDER).length > 1) break; // nicht über mehrere Felder hinweg raten
  }
  const ph = el.getAttribute('placeholder');
  return ph?.trim() ? ph.trim() : null;
}

/** Einheiten, die in Beschriftungen in Klammern oder nach „in“ stehen (keine Formelzeichen wie „(fck)“) */
const EINHEIT = /^(?:mm|cm|dm|m|km|m²|m³|cm²|mm²|kg|t|g|kN|N|MN|kNm|MPa|N\/mm²|GPa|kPa|Pa|bar|°C|K|%|‰|M\.-%|Vol\.-%|W\/\(m·K\)|W\/\(m²K\)|W\/\(m²·K\)|kg\/m³|kg\/dm³|g\/cm³|kWh\/\(m²a\)|kWh|dB|Hz|h|d|a|s|min|Jahre|Tage|Monate|Stunden|mm\/a|µm|‰\/K|1\/K|l\/m²|m\/s)$/;

/** Einheit aus einer Beschriftung: „Dicke (cm)“, „Ti in °C“, „Last [kN]“; null = keine erkennbar. Exportiert für Tests. */
export function einheitAusBeschriftung(name: string): string | null {
  const t = name.trim();
  const m = t.match(/\(([^()]+)\)\s*$/) ?? t.match(/\[([^\]]+)\]\s*$/) ?? t.match(/\sin\s+(\S+)\s*$/);
  const e = m?.[1]?.trim();
  return e && EINHEIT.test(e) ? e : null;
}

/** angezeigter Wert neben einem Regler: letzte Teilangabe der Zeile davor (z. B. „934,8 kN (65 % FK)“). Exportiert für Tests. */
export function anzeigeNebenRegler(zeileVorher: { kinder: number; letzterText: string } | null): string | null {
  if (!zeileVorher || zeileVorher.kinder < 2) return null;
  const t = zeileVorher.letzterText.replace(/\s+/g, ' ').trim();
  return /\d/.test(t) && t.length <= 60 ? t : null;
}

/** aria-valuetext eines Reglers ohne eigene Angabe. Exportiert für Tests. */
export function reglerWertText(wert: string, anzeige: string | null, name: string): string {
  if (anzeige) return anzeige;
  const zahl = Number(wert);
  const formatiert = Number.isFinite(zahl) ? formatDeWert(zahl) : wert;
  const einheit = einheitAusBeschriftung(name);
  return einheit ? `${formatiert} ${einheit}` : formatiert;
}

function setzeReglerText(el: HTMLInputElement) {
  if (el.hasAttribute('aria-valuetext') && el.dataset.autoWert !== '1') return;
  const vor = el.previousElementSibling;
  const anzeige = anzeigeNebenRegler(vor ? { kinder: vor.children.length, letzterText: vor.lastElementChild ? textOhneFelder(vor.lastElementChild) : '' } : null);
  const name = el.getAttribute('aria-label') ?? el.labels?.[0]?.textContent ?? '';
  const text = reglerWertText(el.value, anzeige, name);
  if (el.getAttribute('aria-valuetext') !== text) el.setAttribute('aria-valuetext', text);
  el.dataset.autoWert = '1';
}

/** Überschrift vor einer Tabelle (bis drei Ebenen nach oben), für den zugänglichen Namen */
function ueberschriftVor(t: HTMLElement): string | null {
  let knoten: Element | null = t;
  for (let ebene = 0; ebene < 4 && knoten; ebene++) {
    let vor = knoten.previousElementSibling;
    while (vor) {
      const h = vor.matches('h2,h3,h4,h5,h6') ? vor : vor.querySelector('h2,h3,h4,h5,h6');
      if (h && !vor.querySelector('table')) { const txt = (h.textContent ?? '').replace(/\s+/g, ' ').trim(); if (txt) return txt.slice(0, 100); }
      if (vor.querySelector('table')) return null; // nicht über eine andere Tabelle hinweg
      vor = vor.previousElementSibling;
    }
    knoten = knoten.parentElement;
  }
  return null;
}

export function useAutoFormLabels(wurzelId: string, abhaengigkeit: unknown) {
  useEffect(() => {
    const wurzel = document.getElementById(wurzelId);
    if (!wurzel) return;
    let geplant = 0;
    const bearbeiten = () => {
      geplant = 0;
      wurzel.querySelectorAll<HTMLElement>(FELDER).forEach(el => {
        if (el.dataset.autoLabel === '1' || hatNamen(el)) return;
        const name = findeBeschriftung(el);
        if (name) { el.setAttribute('aria-label', name); el.dataset.autoLabel = '1'; }
      });
      // Regler: Wert mit Einheit für Screenreader (WCAG 4.1.2)
      wurzel.querySelectorAll<HTMLInputElement>('input[type=range]').forEach(setzeReglerText);
      // Tabellen behalten ihre Tabellensemantik, auch wenn sie mobil als Block scrollen (AP 2.6)
      wurzel.querySelectorAll<HTMLTableElement>('table:not([role])').forEach(t => t.setAttribute('role', 'table'));
      // Tabellen ohne Beschriftung: Text der Überschrift davor (WCAG 1.3.1)
      wurzel.querySelectorAll<HTMLTableElement>('table:not([aria-label]):not([aria-labelledby])').forEach(t => {
        if (t.caption || t.dataset.autoLabel === '0') return;
        const name = ueberschriftVor(t);
        if (name) { t.setAttribute('aria-label', name); t.dataset.autoLabel = '1'; } else t.dataset.autoLabel = '0';
      });
      // Scrollbare Bereiche ohne fokussierbaren Inhalt per Tastatur erreichbar machen (WCAG 2.1.1)
      wurzel.querySelectorAll<HTMLElement>('[class*="overflow-x-auto"], [class*="overflow-auto"], [class*="overflow-y-auto"], [class*="overflow-x-scroll"], .katex-display, table').forEach(el => {
        if (el.hasAttribute('tabindex')) return;
        const scrollt = el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
        if (!scrollt || el.querySelector('a[href], button, input, select, textarea, [tabindex]')) return;
        el.tabIndex = 0;
        if (!el.getAttribute('role')) el.setAttribute('role', 'region');
        if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'Scrollbarer Bereich');
      });
    };
    const beobachter = new MutationObserver(() => { if (!geplant) geplant = window.setTimeout(bearbeiten, 150); });
    beobachter.observe(wurzel, { childList: true, subtree: true });
    // Textänderungen (angezeigte Werte) führen nur die Reglertexte nach – günstig, ohne Layout-Abfragen
    let reglerGeplant = 0;
    const regler = () => { reglerGeplant = 0; wurzel.querySelectorAll<HTMLInputElement>('input[type=range]').forEach(setzeReglerText); };
    const textBeobachter = new MutationObserver(() => { if (!reglerGeplant) reglerGeplant = window.setTimeout(regler, 100); });
    textBeobachter.observe(wurzel, { characterData: true, subtree: true });
    // Regler sofort nach der Eingabe nachführen (nach dem Neuzeichnen durch React), nicht erst nach 150 ms
    const eingabe = (e: Event) => {
      const el = e.target as HTMLInputElement | null;
      if (el?.type === 'range') window.setTimeout(() => setzeReglerText(el), 0);
    };
    wurzel.addEventListener('input', eingabe, true);
    bearbeiten();
    return () => {
      beobachter.disconnect(); textBeobachter.disconnect(); wurzel.removeEventListener('input', eingabe, true);
      if (geplant) window.clearTimeout(geplant);
      if (reglerGeplant) window.clearTimeout(reglerGeplant);
    };
  }, [wurzelId, abhaengigkeit]);
}
