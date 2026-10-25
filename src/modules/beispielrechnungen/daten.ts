import { type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { Layers, Volume2, BookOpen, Sliders, Scale, Settings, Leaf, History, Flame } from 'lucide-react';

export type RechnungReiter = 'u_wert' | 'beton' | 'stahlbeton' | 'holzbau' | 'mauerwerk' | 'nachhaltigkeit' | 'bestand' | 'schallschutz' | 'brandschutz';

// Reiter (AP 3.8): 6 Hauptreiter statt 9 (nur ohne festen Einsprung sichtbar; die Routen rechnung_*
// setzen forceTab und zeigen genau eine Rechnung). Rechnungen mit eigener Reiterleiste (Beton,
// Nachhaltigkeit, Bestand, Brandschutz) bleiben Hauptreiter, damit höchstens 2 Ebenen entstehen.
export const RECHNUNG_GRUPPEN: readonly ModulTabGruppe<RechnungReiter>[] = [
  { id: 'bauphysik_g', label: 'a) + h) Bauphysik & Bauakustik', icon: Layers, mitglieder: [
    { id: 'u_wert', label: 'a) Bauphysik: U-Wert', icon: Layers },
    { id: 'schallschutz', label: 'h) Bauakustik: Schallschutz', icon: Volume2 },
  ] },
  { id: 'beton_g', label: 'b) Beton: Mischungsentwurf', icon: BookOpen, mitglieder: [{ id: 'beton', label: 'b) Beton: Mischungsentwurf' }] },
  { id: 'tragwerk_g', label: 'c)–e) Tragwerksnachweise', icon: Sliders, mitglieder: [
    { id: 'stahlbeton', label: 'c) Massivbau: Biegung im GZT', icon: Sliders },
    { id: 'holzbau', label: 'd) Holzbau: Stützenknicken', icon: Scale },
    { id: 'mauerwerk', label: 'e) Mauerwerk: Tragfähigkeit', icon: Settings },
  ] },
  { id: 'nachhaltigkeit_g', label: 'f) Nachhaltigkeit & Ökobilanz', icon: Leaf, mitglieder: [{ id: 'nachhaltigkeit', label: 'f) Nachhaltigkeit & Ökobilanz' }] },
  { id: 'bestand_g', label: 'g) Bauen im Bestand', icon: History, mitglieder: [{ id: 'bestand', label: 'g) Bauen im Bestand' }] },
  { id: 'brandschutz_g', label: 'i) Brandschutz: Heißbemessung', icon: Flame, mitglieder: [{ id: 'brandschutz', label: 'i) Brandschutz: Heißbemessung' }] },
];
