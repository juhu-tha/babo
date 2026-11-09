import { useEffect, useRef, type RefObject } from 'react';

/**
 * Fokusführung für Dialoge, Ausklappmenüs und Schubladen (WCAG 2.1.1, 2.1.2, 2.4.3; WAI-ARIA APG „Dialog“):
 *   – beim Öffnen Fokus auf das erste bedienbare Element im Behälter (oder auf `erstesZiel`)
 *   – Escape schließt und gibt den Fokus an den Auslöser zurück
 *   – beim Schließen (auch per Maus oder Auswahl im Menü) kehrt der Fokus zum Auslöser zurück, wenn er im Behälter war
 *   – `modal`: Tab/Umschalt+Tab bleiben im Behälter (kein Fokus hinter einer Abdeckung)
 *
 *   const ausloeser = useRef<HTMLButtonElement>(null); const box = useRef<HTMLDivElement>(null);
 *   useDialogFokus(offen, () => setOffen(false), ausloeser, box);
 */
export const FOKUSSIERBAR = 'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** bedienbare Elemente in Dokumentreihenfolge, ohne ausgeblendete. Exportiert für Tests. */
export function bedienbare(behaelter: ParentNode): HTMLElement[] {
  return Array.from(behaelter.querySelectorAll<HTMLElement>(FOKUSSIERBAR)).filter(el =>
    !el.closest('[hidden],[inert],[aria-hidden="true"]') && (typeof el.checkVisibility !== 'function' || el.checkVisibility()));
}

/** Ziel für Tab im modalen Dialog: am Ende zum Anfang, am Anfang (Umschalt) zum Ende; −1 = Browser entscheidet. Exportiert für Tests. */
export function tabZiel(index: number, anzahl: number, rueckwaerts: boolean): number {
  if (anzahl === 0) return -1;
  if (index < 0) return rueckwaerts ? anzahl - 1 : 0;
  if (!rueckwaerts && index === anzahl - 1) return 0;
  if (rueckwaerts && index === 0) return anzahl - 1;
  return -1;
}

interface Optionen {
  modal?: boolean;
  /** Element, das beim Öffnen den Fokus erhält (sonst das erste bedienbare) */
  erstesZiel?: RefObject<HTMLElement | null>;
}

export function useDialogFokus(offen: boolean, schliessen: () => void, ausloeser: RefObject<HTMLElement | null>, behaelter: RefObject<HTMLElement | null>, { modal = false, erstesZiel }: Optionen = {}) {
  const schliessenRef = useRef(schliessen);
  schliessenRef.current = schliessen;

  useEffect(() => {
    if (!offen) return;
    // Behälter wird ggf. erst nachgeladen (React.lazy): kurz warten, bis er da ist
    let versuch = 0;
    let zeit = 0;
    const setzeFokus = () => {
      const box = behaelter.current;
      if (!box) { if (versuch++ < 20) zeit = window.setTimeout(setzeFokus, 50); return; }
      if (box.contains(document.activeElement)) return;
      const ziel = erstesZiel?.current ?? bedienbare(box)[0] ?? box;
      if (ziel === box && !box.hasAttribute('tabindex')) box.tabIndex = -1;
      ziel.focus({ preventScroll: true });
    };
    zeit = window.setTimeout(setzeFokus, 0);

    const taste = (e: KeyboardEvent) => {
      const box = behaelter.current;
      if (e.key === 'Escape') {
        e.stopPropagation();
        schliessenRef.current();
        ausloeser.current?.focus({ preventScroll: true });
        return;
      }
      if (modal && e.key === 'Tab' && box) {
        const els = bedienbare(box);
        const ziel = tabZiel(els.indexOf(document.activeElement as HTMLElement), els.length, e.shiftKey);
        if (ziel >= 0) { e.preventDefault(); els[ziel].focus(); }
      }
    };
    document.addEventListener('keydown', taste, true);
    const box = behaelter.current;
    return () => {
      window.clearTimeout(zeit);
      document.removeEventListener('keydown', taste, true);
      // Schließen per Klick/Auswahl: Fokus nicht im Nichts lassen
      const fokus = document.activeElement;
      if (!fokus || fokus === document.body || (box && box.contains(fokus))) {
        window.setTimeout(() => {
          const jetzt = document.activeElement;
          if (!jetzt || jetzt === document.body || !jetzt.isConnected) ausloeser.current?.focus({ preventScroll: true });
        }, 0);
      }
    };
  }, [offen, modal, ausloeser, behaelter, erstesZiel]);
}
