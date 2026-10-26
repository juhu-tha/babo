// Abschnitte unterhalb des sichtbaren Bereichs erst nach dem ersten Bild rendern (Phase 5, AP 5.5).
// Große Rechnerseiten (Mischungsberechnung, Biegebemessung, Feuchteschutz) erzeugten beim Laden eine lange
// Task, vor allem durch Layout und Stil der ganzen Seite. Liegt der Platzhalter beim Einhängen unterhalb des
// Bildausschnitts, rendert der Abschnitt nach dem ersten Bild – je Abschnitt in einer eigenen Task, der Reihe
// nach. Liegt er im Bild (z. B. breite Ansicht), rendert er sofort vor dem Zeichnen: kein Layoutsprung.
// Verhalten und Inhalt bleiben gleich; vor dem Drucken wird alles sofort gerendert.
import React from 'react';
import { flushSync } from 'react-dom';
import { beimDrucken, STUFE } from '@/src/lib/druckVorbereitung';

type Eintrag = () => void;
const reihe: Eintrag[] = [];
let laeuft = false;

function weiter() {
  const naechster = reihe.shift();
  if (!naechster) { laeuft = false; return; }
  laeuft = true;
  window.setTimeout(naechster, 0);
}
function einreihen(f: Eintrag) {
  reihe.push(f);
  // erster Abschnitt erst nach dem ersten Bild (rAF → nächste Task)
  if (!laeuft) { laeuft = true; requestAnimationFrame(() => { laeuft = false; weiter(); }); }
  return () => { const i = reihe.indexOf(f); if (i >= 0) reihe.splice(i, 1); };
}
const sofort = new Set<() => void>();
// vor Formeln und Diagrammen (src/lib/druckVorbereitung.ts): erscheinende Abschnitte enthalten oft beides
beimDrucken(STUFE.abschnitte, () => { if (sofort.size) flushSync(() => sofort.forEach(f => f())); });

export function NachErstemBild({ children, minHoehe }: { children: React.ReactNode; /** Platzhalterhöhe (≈ spätere Höhe) */ minHoehe?: number | string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [bereit, setBereit] = React.useState(false);
  // aus der Reihe freigegeben → nach dem Einhängen den nächsten Abschnitt anstoßen
  const ausReihe = React.useRef(false);
  React.useLayoutEffect(() => {
    if (bereit) return;
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) { setBereit(true); return; }
    const frei = () => setBereit(true);
    sofort.add(frei);
    let weg = false;
    const austragen = einreihen(() => {
      if (weg) { weiter(); return; } // inzwischen ausgehängt
      ausReihe.current = true;
      React.startTransition(frei);
    });
    return () => {
      weg = true;
      sofort.delete(frei);
      austragen();
      // ausgehängt, bevor der Abschnitt erschien: Reihe nicht anhalten
      if (ausReihe.current) { ausReihe.current = false; weiter(); }
    };
  }, [bereit]);
  React.useEffect(() => {
    if (bereit && ausReihe.current) { ausReihe.current = false; weiter(); }
  }, [bereit]);
  if (bereit) return <>{children}</>;
  return <div ref={ref} aria-busy="true" style={minHoehe !== undefined ? { minHeight: minHoehe } : undefined} />;
}
