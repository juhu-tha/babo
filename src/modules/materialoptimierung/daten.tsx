import React from 'react';
import { Sparkles, Trash2, Settings, Recycle } from 'lucide-react';
import inhalt from '@/content/materialoptimierung/daten.json';

export interface Seaeule {
  id: 'effizienz' | 'suffizienz' | 'konsistenz' | 'resilienz';
  title: string;
  tagline: string;
  mitigationPotential: string; // e.g. "Hoch"
  description: string;
  strategies: string[];
  example: string;
}

export const SAEULEN_DATA: Seaeule[] = [
  {
    id: 'effizienz',
    title: inhalt.werte.effizienzBesserMachen,
    tagline: inhalt.werte.gleicherNutzenMitWeniger,
    mitigationPotential: inhalt.werte.t3050CoEinsparung,
    description: inhalt.werte.erhöhungDerMaterialausnutzungDurch,
    strategies: [
      inhalt.werte.einsatzVonUltrahochfestemBeton,
      inhalt.werte.topologieoptimierungUndBionischeBauteilg,
      inhalt.werte.verwendungVonCarbonTextil,
      inhalt.werte.bauteilgradierungHohlräumeImInneren
    ],
    example: inhalt.werte.ersatzEinerStandardmäßig30
  },
  {
    id: 'suffizienz',
    title: inhalt.werte.suffizienzWenigerMachen,
    tagline: inhalt.werte.reduktionDesAbsolutenBedarfs,
    mitigationPotential: inhalt.werte.t5080CoEinsparung,
    description: inhalt.werte.hinterfragenDesRealenBauteilbedarfs,
    strategies: [
      inhalt.werte.reduktionVonKomfortUnd,
      inhalt.werte.erhöhungDerGrundrissentwurfsFlexibilität,
      inhalt.werte.bewussterVerzichtAufTiefgehende,
      inhalt.werte.nutzungsgerechteLastannahmenStattPauscha
    ],
    example: inhalt.werte.modulareTrennwandsystemeImHolzständerbau
  },
  {
    id: 'konsistenz',
    title: inhalt.werte.konsistenzInKreisläufenDenken,
    tagline: inhalt.werte.nutzungUmweltverträglicherStoffströmeUnd,
    mitigationPotential: inhalt.werte.t4070CoEinsparung,
    description: inhalt.werte.einsatzKreislauffähigerCradleTo,
    strategies: [
      inhalt.werte.einsatzVonRcBeton,
      inhalt.werte.verstärkterEinsatzNachwachsenderRohstoff,
      inhalt.werte.verwendungVonRückbaubarenMechanisch,
      inhalt.werte.aufbauDigitalerMaterialpässeDpp
    ],
    example: inhalt.werte.schraubbareHolzBetonVerbunddecken
  },
  {
    id: 'resilienz',
    title: inhalt.werte.resilienzLanglebigMachen,
    tagline: inhalt.werte.verlängerungDerNutzungsdauerDurch,
    mitigationPotential: inhalt.werte.langfristigExtremHoch,
    description: inhalt.werte.dieUmweltfreundlichsteTonneZement,
    strategies: [
      inhalt.werte.erhöhungDerDauerhaftigkeitDurch,
      inhalt.werte.leichtAustauschbareHaustechniksystemeEnt,
      inhalt.werte.schlagregensichereDiffusionsoffeneAußenw,
      inhalt.werte.erhöhterMechanischerSchutzGefährdeter
    ],
    example: inhalt.werte.ersatzEinerHinterlüftetenHolzfassade
  }
];

export interface ConcretePrincipleItem {
  title: string;
  desc: string;
  tags: string[];
}

export interface ConcreteCategory {
  name: string;
  items: ConcretePrincipleItem[];
}

export interface ConcretePrincipleGroup {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  colorBorder: string;
  colorBg: string;
  colorText: string;
  colorIcon: string;
  intro: string;
  categories: ConcreteCategory[];
}

export const BETON_PRINZIPIEN: ConcretePrincipleGroup[] = [
  {
    id: 'vermeidung',
    title: inhalt.werte.t1VermeidungSubstitution,
    subtitle: inhalt.werte.strategischerMaterialersatzTragwerkseffi,
    icon: <Trash2 size={18} />,
    colorBorder: 'border-rose-100 focus-within:border-rose-300',
    colorBg: 'bg-rose-50/10',
    colorText: 'text-rose-950',
    colorIcon: 'bg-rose-100/70 text-rose-700 border-rose-200/50',
    intro: inhalt.werte.derEffektivsteHebelZur,
    categories: inhalt.daten["BETON_PRINZIPIEN.vermeidung.categories"]
  },
  {
    id: 'optimierung',
    title: inhalt.werte.t2RezepturHerstelloptimierung,
    subtitle: inhalt.werte.chemischeGefügePräzisionThermische,
    icon: <Settings size={18} />,
    colorBorder: 'border-amber-100 focus-within:border-amber-300',
    colorBg: 'bg-amber-50/10',
    colorText: 'text-amber-950',
    colorIcon: 'bg-amber-100/70 text-amber-700 border-amber-200/50',
    intro: inhalt.werte.effizienzsprüngeAufMaterialUnd,
    categories: inhalt.daten["BETON_PRINZIPIEN.optimierung.categories"]
  },
  {
    id: 'recycling',
    title: inhalt.werte.t3RecyclingKreislaufführung,
    subtitle: inhalt.werte.ressourcenschonungDurchMineralischeSekun,
    icon: <Recycle size={18} />,
    colorBorder: 'border-blue-100 focus-within:border-blue-300',
    colorBg: 'bg-blue-50/10',
    colorText: 'text-blue-950',
    colorIcon: 'bg-blue-100/70 text-blue-700 border-blue-200/50',
    intro: inhalt.werte.vermeidungPrimärerRohstoffentnahmenDurch,
    categories: inhalt.daten["BETON_PRINZIPIEN.recycling.categories"]
  },
  {
    id: 'sonstiges',
    title: inhalt.werte.t4TechnischeCarbonSenken,
    subtitle: inhalt.werte.chemischeBindungZirkuläresNet,
    icon: <Sparkles size={18} />,
    colorBorder: 'border-indigo-100 focus-within:border-indigo-300',
    colorBg: 'bg-indigo-50/10',
    colorText: 'text-indigo-950',
    colorIcon: 'bg-indigo-100/70 text-indigo-700 border-indigo-200/50',
    intro: inhalt.werte.klimapositiveEffekteUndTechnische,
    categories: inhalt.daten["BETON_PRINZIPIEN.sonstiges.categories"]
  }
];
