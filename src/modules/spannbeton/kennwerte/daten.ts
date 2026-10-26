import { type ModulTab } from '@/src/components/ui/ModuleTabs';
import { Building, Clock, Zap, Layers, Droplets, Calculator, Scale } from 'lucide-react';
import inhalt from '@/content/spannbeton/kennwerte/daten.json';

export type KennwertBereich = 'beiwerte' | 'beton' | 'einpressmoertel' | 'kriechen' | 'schwinden' | 'relaxation' | 'elastisch' | 'kopplung' | 'mechanisch' | 'beispielrechnung' | 'rechner';

export type KennwertReiter = 'beton_r' | 'kriechen_schwinden_r' | 'relaxation_r' | 'sofortverluste_r' | 'einpressmoertel_r' | 'kopplung_r' | 'beiwerte_r';

// Reiter (AP 3.8): Diese Leiste liegt bereits unter dem Spannbeton-Reiter „Baustoffkennwerte“ (2. Ebene),
// daher flach mit 7 Reitern statt 11; verwandte Bereiche stehen untereinander auf einem Reiter.
export const KENNWERT_REITER: readonly (ModulTab<KennwertReiter> & { bereiche: readonly KennwertBereich[] })[] = [
  { id: 'beton_r', label: inhalt.werte.betonMaterialeigenschaftenFckEcm, icon: Building, bereiche: ['beton'] },
  { id: 'kriechen_schwinden_r', label: inhalt.werte.kriechenSchwindenCs, icon: Clock, bereiche: ['kriechen', 'schwinden'] },
  { id: 'relaxation_r', label: inhalt.werte.stahlrelaxationPr, icon: Zap, bereiche: ['relaxation'] },
  { id: 'sofortverluste_r', label: inhalt.werte.elastischeStauchungReibungKeilschlupf, icon: Layers, bereiche: ['elastisch', 'mechanisch'] },
  { id: 'einpressmoertel_r', label: inhalt.werte.einpressmörtelSystembaustoffeDinEn, icon: Droplets, bereiche: ['einpressmoertel'] },
  { id: 'kopplung_r', label: inhalt.werte.ec2KopplungCS, icon: Calculator, bereiche: ['kopplung', 'beispielrechnung'] },
  { id: 'beiwerte_r', label: inhalt.werte.beiwerteKatalogSchnellrechner, icon: Scale, bereiche: ['beiwerte', 'rechner'] },
];
