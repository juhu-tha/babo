import { useEffect } from 'react';

/**
 * Ergänzt fehlende zugängliche Namen von Formularfeldern und macht scrollbare Bereiche per Tastatur
 * erreichbar (Umsetzungsplan Phase 2, AP 2.3/2.6).
 *
 * Viele Rechner stellen die Beschriftung als Text neben das Feld, ohne <label for> oder aria-label.
 * Dieser Hook verknüpft solche Felder zur Laufzeit mit dem sichtbaren Beschriftungstext davor
 * (aria-label), damit Screenreader den Namen ansagen. Neue Module sollen Felder direkt beschriften;
 * der Hook ist ein Sicherheitsnetz, kein Ersatz.
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
      // Tabellen behalten ihre Tabellensemantik, auch wenn sie mobil als Block scrollen (AP 2.6)
      wurzel.querySelectorAll<HTMLTableElement>('table:not([role])').forEach(t => t.setAttribute('role', 'table'));
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
    bearbeiten();
    return () => { beobachter.disconnect(); if (geplant) window.clearTimeout(geplant); };
  }, [wurzelId, abhaengigkeit]);
}
