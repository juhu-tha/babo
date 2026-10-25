import React from 'react';
import { 
  Calculator, 
  Layers, 
  Droplets, 
  Compass, 
  GraduationCap,
  Monitor
} from 'lucide-react';

export interface MetaCluster {
  id: string;
  number: string;
  name: string;
  shortDesc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  groupNames: string[];
}

export const META_CLUSTERS: MetaCluster[] = [
  {
    id: 'grundlagen',
    number: 'I',
    name: 'Grundlagen & Labor',
    shortDesc: 'Physik, Bauchemie, Laborversuche, Statik, Akustik & Brandschutz',
    icon: Calculator,
    accentColor: 'text-shiraz dark:text-rose-400',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    badgeText: 'text-slate-800 dark:text-slate-200',
    groupNames: [
      'Grundlagen',
      'Labor & Auswertung',
      'Mechanik',
      'Bauphysik'
    ]
  },
  {
    id: 'baustoffe',
    number: 'II',
    name: 'Materialien & Produkte',
    shortDesc: 'Mineralische, metallische & organische Werkstoffe, CE & Normen',
    icon: Layers,
    accentColor: 'text-shiraz dark:text-rose-400',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    badgeText: 'text-slate-800 dark:text-slate-200',
    groupNames: [
      'Baustoffe',
      'Bauprodukte'
    ]
  },
  {
    id: 'beton',
    number: 'III',
    name: 'Entwurf & Bemessung',
    shortDesc: 'Beton, Massivbau, Holzbau, Innenausbau, Eurocodes (EC 2 / EC 5), Tragwerke & Bemessung',
    icon: Droplets,
    accentColor: 'text-shiraz dark:text-rose-400',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    badgeText: 'text-slate-800 dark:text-slate-200',
    groupNames: [
      'Betontechnologie',
      'Massivbau',
      'Holzbau',
      'Innenausbau'
    ]
  },
  {
    id: 'bestand',
    number: 'IV',
    name: 'Bestand & Nachhaltigkeit',
    shortDesc: 'Bauwerksdiagnostik, Schadensatlas, Dauerhaftigkeit, WTA, Rückbau, Umwelt & Nachhaltigkeit',
    icon: Compass,
    accentColor: 'text-shiraz dark:text-rose-400',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    badgeText: 'text-slate-800 dark:text-slate-200',
    groupNames: [
      'Bauen im Bestand',
      'Mängel & Schäden',
      'Dauerhaftigkeit',
      'Schutz & Instandsetzung',
      'Rückbau & Schadstoffe',
      'Nachhaltigkeit'
    ]
  },
  {
    id: 'praxis',
    number: 'V',
    name: 'Digitales & Infos',
    shortDesc: 'BIM, KI im Bauwesen, Bauleitung, Bautagebuch, Software, Quellen & Kuriositäten',
    icon: Monitor,
    accentColor: 'text-shiraz dark:text-rose-400',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    badgeText: 'text-slate-800 dark:text-slate-200',
    groupNames: [
      'Digitales',
      'KI im Bauwesen',
      'Praxiswissen',
      'Infos & Quellen',
      'Kuriositäten'
    ]
  },
  {
    id: 'studium',
    number: 'VI',
    name: 'Studium & Lehre',
    shortDesc: 'Studienorganisation THA, Vorlesungsportal, Lernpfade je Lehrveranstaltung, Baustofflabor (Gebäude G2), Thesen & Projekte, Weiter@THA, Übungsaufgaben & Beispielrechnungen',
    icon: GraduationCap,
    accentColor: 'text-shiraz dark:text-rose-400',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    badgeText: 'text-slate-800 dark:text-slate-200',
    groupNames: [
      'Studium THA',
      'Baustofflabor',
      'Übersicht & Zugang',
      'Bauen im Bestand (VL)',
      'Nachhaltiges Bauen (VL)',
      'Bauschäden (VL)',
      'Baustoffkunde (VL)',
      'Instandhaltung (VL)',
      'Lehrveranstaltungen',
      'Weiter@THA',
      'Thesen & Projekte',
      'Übungsaufgaben',
      'Beispielrechnungen'
    ]
  }
];

// Quick lookup from original group name to MetaCluster
export const GROUP_TO_CLUSTER: Record<string, MetaCluster> = {};
META_CLUSTERS.forEach(cluster => {
  cluster.groupNames.forEach(groupName => {
    GROUP_TO_CLUSTER[groupName] = cluster;
  });
});
