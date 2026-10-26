import { type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { Layers, Volume2, BookOpen, Sliders, Scale, Settings, Leaf, History, Flame } from 'lucide-react';
import inhalt from '@/content/beispielrechnungen/daten.json';

export type RechnungReiter = 'u_wert' | 'beton' | 'stahlbeton' | 'holzbau' | 'mauerwerk' | 'nachhaltigkeit' | 'bestand' | 'schallschutz' | 'brandschutz';

// Reiter (AP 3.8): 6 Hauptreiter statt 9 (nur ohne festen Einsprung sichtbar; die Routen rechnung_*
// setzen forceTab und zeigen genau eine Rechnung). Rechnungen mit eigener Reiterleiste (Beton,
// Nachhaltigkeit, Bestand, Brandschutz) bleiben Hauptreiter, damit höchstens 2 Ebenen entstehen.
export const RECHNUNG_GRUPPEN: readonly ModulTabGruppe<RechnungReiter>[] = [
  { id: 'bauphysik_g', label: inhalt.werte.aHBauphysikBauakustik, icon: Layers, mitglieder: [
    { id: 'u_wert', label: inhalt.werte.aBauphysikUWert, icon: Layers },
    { id: 'schallschutz', label: inhalt.werte.hBauakustikSchallschutz, icon: Volume2 },
  ] },
  { id: 'beton_g', label: inhalt.werte.bBetonMischungsentwurf, icon: BookOpen, mitglieder: [{ id: 'beton', label: inhalt.werte.bBetonMischungsentwurf2 }] },
  { id: 'tragwerk_g', label: inhalt.werte.cETragwerksnachweise, icon: Sliders, mitglieder: [
    { id: 'stahlbeton', label: inhalt.werte.cMassivbauBiegungIm, icon: Sliders },
    { id: 'holzbau', label: inhalt.werte.dHolzbauStützenknicken, icon: Scale },
    { id: 'mauerwerk', label: inhalt.werte.eMauerwerkTragfähigkeit, icon: Settings },
  ] },
  { id: 'nachhaltigkeit_g', label: inhalt.werte.fNachhaltigkeitÖkobilanz, icon: Leaf, mitglieder: [{ id: 'nachhaltigkeit', label: inhalt.werte.fNachhaltigkeitÖkobilanz2 }] },
  { id: 'bestand_g', label: inhalt.werte.gBauenImBestand, icon: History, mitglieder: [{ id: 'bestand', label: inhalt.werte.gBauenImBestand2 }] },
  { id: 'brandschutz_g', label: inhalt.werte.iBrandschutzHeißbemessung, icon: Flame, mitglieder: [{ id: 'brandschutz', label: inhalt.werte.iBrandschutzHeißbemessung2 }] },
];
