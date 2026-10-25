import { type ModulTab } from '@/src/components/ui/ModuleTabs';
import { Building, Clock, Zap, Layers, Droplets, Calculator, Scale } from 'lucide-react';

export type KennwertBereich = 'beiwerte' | 'beton' | 'einpressmoertel' | 'kriechen' | 'schwinden' | 'relaxation' | 'elastisch' | 'kopplung' | 'mechanisch' | 'beispielrechnung' | 'rechner';

export type KennwertReiter = 'beton_r' | 'kriechen_schwinden_r' | 'relaxation_r' | 'sofortverluste_r' | 'einpressmoertel_r' | 'kopplung_r' | 'beiwerte_r';

// Reiter (AP 3.8): Diese Leiste liegt bereits unter dem Spannbeton-Reiter „Baustoffkennwerte“ (2. Ebene),
// daher flach mit 7 Reitern statt 11; verwandte Bereiche stehen untereinander auf einem Reiter.
export const KENNWERT_REITER: readonly (ModulTab<KennwertReiter> & { bereiche: readonly KennwertBereich[] })[] = [
  { id: 'beton_r', label: 'Beton-Materialeigenschaften (fck, Ecm)', icon: Building, bereiche: ['beton'] },
  { id: 'kriechen_schwinden_r', label: 'Kriechen (φ) & Schwinden (εcs)', icon: Clock, bereiche: ['kriechen', 'schwinden'] },
  { id: 'relaxation_r', label: 'Stahlrelaxation (Δσpr)', icon: Zap, bereiche: ['relaxation'] },
  { id: 'sofortverluste_r', label: 'Elastische Stauchung, Reibung & Keilschlupf', icon: Layers, bereiche: ['elastisch', 'mechanisch'] },
  { id: 'einpressmoertel_r', label: 'Einpressmörtel & Systembaustoffe (DIN EN 447)', icon: Droplets, bereiche: ['einpressmoertel'] },
  { id: 'kopplung_r', label: 'EC2-Kopplung (c+s+r) & Beispielrechnung', icon: Calculator, bereiche: ['kopplung', 'beispielrechnung'] },
  { id: 'beiwerte_r', label: 'Beiwerte-Katalog & Schnellrechner', icon: Scale, bereiche: ['beiwerte', 'rechner'] },
];
