import React, { useEffect, useRef } from 'react';
import { reiterZiel } from './ModuleTabs';

/**
 * Gemeinsame Gruppen für Ansichtsumschalter und Segment-Schalter (WAI-ARIA APG), ohne eigene Optik:
 * Klassen, Abstände und Schaltflächen bleiben an der Fundstelle, die Gruppe ergänzt nur Rollen,
 * „roving tabindex“ und Pfeiltasten (←/→/↑/↓ zyklisch, Pos1/Ende; deaktivierte Einträge werden übersprungen).
 *
 * Einfachauswahl eines Werts (Einheit, Modus, Filter …) → Optionsgruppe:
 *   <AuswahlGruppe label="Einheit" className="flex gap-2">
 *     {EINHEITEN.map(e => <button key={e} type="button" {...alsOption(e === einheit)} onClick={() => setEinheit(e)}>…</button>)}
 *   </AuswahlGruppe>
 *
 * Wechsel eines Inhaltsbereichs → Reiter mit zugehörigem Inhaltsbereich:
 *   <ReiterLeiste label="Ansicht" className="flex gap-2">
 *     {ANSICHTEN.map(a => <button key={a} type="button" {...alsReiter(a === ansicht, 'xy-ansicht', a)} onClick={() => setAnsicht(a)}>…</button>)}
 *   </ReiterLeiste>
 *   <div {...reiterPanel('xy-ansicht', ansicht)}>…</div>
 *
 * Einzeltoggles (an/aus) und Mehrfachauswahl behalten aria-pressed.
 */
type Rolle = 'radio' | 'tab';
const GRUPPENROLLE: Record<Rolle, 'radiogroup' | 'tablist'> = { radio: 'radiogroup', tab: 'tablist' };
const ZUSTAND: Record<Rolle, 'aria-checked' | 'aria-selected'> = { radio: 'aria-checked', tab: 'aria-selected' };

export interface EintragZustand { gewaehlt: boolean; aus: boolean }

/** Index des Eintrags mit tabindex 0: der gewählte (falls bedienbar), sonst der erste bedienbare; −1 = keiner. */
export function fokusIndex(eintraege: readonly EintragZustand[]): number {
  const gewaehlt = eintraege.findIndex(e => e.gewaehlt && !e.aus);
  return gewaehlt >= 0 ? gewaehlt : eintraege.findIndex(e => !e.aus);
}

/** Zielindex für eine Taste unter Überspringen deaktivierter Einträge; −1 = Taste nicht belegt bzw. kein Ziel. */
export function pfeilZiel(taste: string, index: number, aus: readonly boolean[]): number {
  const bedienbar = aus.map((a, i) => (a ? -1 : i)).filter(i => i >= 0);
  const pos = bedienbar.indexOf(index);
  if (pos < 0) return -1;
  const ziel = reiterZiel(taste, pos, bedienbar.length);
  return ziel < 0 ? -1 : bedienbar[ziel];
}

const istAus = (el: HTMLElement) => el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';

function eigeneEintraege(gruppe: HTMLElement, rolle: Rolle): HTMLElement[] {
  return Array.from(gruppe.querySelectorAll<HTMLElement>(`[role="${rolle}"]`))
    .filter(el => el.closest(`[role="${GRUPPENROLLE[rolle]}"]`) === gruppe);
}

interface GruppeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** zugänglicher Name der Gruppe (alternativ aria-labelledby) */
  label?: string;
}

function RovingGruppe({ rolle, label, onKeyDown, children, ...rest }: GruppeProps & { rolle: Rolle }) {
  const ref = useRef<HTMLDivElement>(null);

  // Genau ein Eintrag bleibt per Tab erreichbar – auch wenn (noch) keiner gewählt ist.
  useEffect(() => {
    const gruppe = ref.current;
    if (!gruppe) return;
    const els = eigeneEintraege(gruppe, rolle);
    const i = fokusIndex(els.map(el => ({ gewaehlt: el.getAttribute(ZUSTAND[rolle]) === 'true', aus: istAus(el) })));
    els.forEach((el, k) => { el.tabIndex = k === i ? 0 : -1; });
  });

  const taste = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    const gruppe = ref.current;
    if (e.defaultPrevented || !gruppe || e.altKey || e.ctrlKey || e.metaKey) return;
    const els = eigeneEintraege(gruppe, rolle);
    const ziel = pfeilZiel(e.key, els.indexOf(e.target as HTMLElement), els.map(istAus));
    if (ziel < 0) return;
    e.preventDefault();
    const el = els[ziel];
    el.focus();
    // Auswahl folgt dem Fokus (APG: Optionsgruppe; Reiter mit automatischer Aktivierung)
    if (el.getAttribute(ZUSTAND[rolle]) !== 'true') el.click();
  };

  return (
    <div ref={ref} role={GRUPPENROLLE[rolle]} aria-label={label} {...rest} onKeyDown={taste}>
      {children}
    </div>
  );
}

/** Optionsgruppe (role="radiogroup") für die Einfachauswahl eines Werts. */
export function AuswahlGruppe(props: GruppeProps) {
  return <RovingGruppe rolle="radio" {...props} />;
}

/** Reiterleiste (role="tablist") für den Wechsel eines Inhaltsbereichs. */
export function ReiterLeiste(props: GruppeProps) {
  return <RovingGruppe rolle="tab" {...props} />;
}

/** Eigenschaften einer Option in einer AuswahlGruppe (ersetzt aria-pressed). */
export function alsOption(gewaehlt: boolean) {
  return { role: 'radio' as const, 'aria-checked': gewaehlt, tabIndex: gewaehlt ? 0 : -1 };
}

/** stabile, gültige ID eines Reiters aus Panel-ID und Schlüssel */
export function reiterId(panelId: string, schluessel: string | number): string {
  const teil = String(schluessel).normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9_-]+/g, '_');
  return `${panelId}-reiter-${teil}`;
}

/** Eigenschaften eines Reiters in einer ReiterLeiste (ersetzt aria-pressed). */
export function alsReiter(gewaehlt: boolean, panelId: string, schluessel: string | number) {
  return {
    role: 'tab' as const,
    id: reiterId(panelId, schluessel),
    'aria-selected': gewaehlt,
    'aria-controls': panelId,
    tabIndex: gewaehlt ? 0 : -1,
  };
}

/** Eigenschaften des Inhaltsbereichs zu einer ReiterLeiste (an ein vorhandenes Element oder einen neuen Wrapper). */
export function reiterPanel(panelId: string, aktiv: string | number) {
  return { role: 'tabpanel' as const, id: panelId, 'aria-labelledby': reiterId(panelId, aktiv) };
}
