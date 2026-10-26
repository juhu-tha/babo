import inhalt from '@/content/bpfarbenlacke/daten.json';
export interface BinderType {
  name: string;
  category: string;
  advantages: string[];
  disadvantages: string[];
  sdValue: string; // Wasserdampfdurchlässigkeit (sd-Wert)
  typicalUse: string;
  pufCode?: string; // GISCODE
}

export const BINDERS: BinderType[] = inhalt.daten.BINDERS;

export interface OSSystem {
  id: string;
  name: string;
  title: string;
  description: string;
  flexible: boolean;
  thickness: string;
  bridging: string;
  trafficable: boolean;
  layers: string[];
  mainBinders: string;
  consumption: string;
}

export const OS_SYSTEMS: OSSystem[] = inhalt.daten.OS_SYSTEMS;

export interface ReactionMechanism {
  name: string;
  type: string;
  reactants: string;
  catalysts: string;
  molecularReaction: string;
  description: string;
  processingRules: string[];
  neutralProducts: { title: string; desc: string; norms: string }[];
}

export const REACTION_MECHANISMS: Record<string, ReactionMechanism> = inhalt.daten.REACTION_MECHANISMS;
