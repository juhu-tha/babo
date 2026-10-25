import inhalt from '@/content/bpverkehrswegebau/daten.json';
// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)

// Standardized RStO 12/24 Profiles for different Belastungsklassen (Bk)
export interface LayerInfo {
  name: string;
  thickness: number; // in cm
  material: string;
  normRequirement: string;
  bgClass: string;
  borderColor: string;
}

export interface RstoProfile {
  title: string;
  description: string;
  totalThickness: number; // in cm
  layers: LayerInfo[];
}

export const RSTO_ASPHALT_DATA: Record<string, RstoProfile> = inhalt.daten.RSTO_ASPHALT_DATA;

export const RSTO_CONCRETE_DATA: Record<string, RstoProfile> = inhalt.daten.RSTO_CONCRETE_DATA;
