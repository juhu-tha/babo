import { LucideIcon } from 'lucide-react';

export type AbfallGruppe = 'wegweiser' | 'recht' | 'verwertung' | 'deponie' | 'altlasten' | 'rueckbau' | 'checklisten';

export type AbfallTab = 'schema' | 'hierarchie' | 'avv' | 'ebv' | 'deponie' | 'altlasten' | 'rueckbau' | 'eanv' | 'pn98' | 'altholz' | 'checklisten';

export interface SchemaCard {
  id: AbfallTab;
  title: string;
  category: string;
  colorClass: string;
  borderColorClass: string;
  badgeColorClass: string;
  labelColorClass: string;
  icon: LucideIcon;
  wann: string;
  was: string;
  wie: string;
  wozu: string;
}
