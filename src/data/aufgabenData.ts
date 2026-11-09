import { TabId } from '@/src/contexts/TabContext';
import React from 'react';
import { betonTasks } from './tasks/betonTasks';
import { massivbauTasks } from './tasks/massivbauTasks';
import { holzbauTasks } from './tasks/holzbauTasks';
import { baustoffeTasks } from './tasks/baustoffeTasks';
import { bauprodukteTasks } from './tasks/bauprodukteTasks';
import { mechanikTasks } from './tasks/mechanikTasks';
import { bauphysikTasks } from './tasks/bauphysikTasks';
import { nachhaltigkeitTasks } from './tasks/nachhaltigkeitTasks';
import { bestandTasks } from './tasks/bestandTasks';
import { dauerhaftigkeitTasks } from './tasks/dauerhaftigkeitTasks';
import { rueckbauTasks } from './tasks/rueckbauTasks';
import { laborTasks } from './tasks/laborTasks';
import { digitalesTasks } from './tasks/digitalesTasks';
import { komplexTasks } from './tasks/komplexTasks';

export type Task = {
  id: string;
  title: string;
  question: string | React.ReactNode;
  moduleHint: { id: TabId; name: string } | { id: TabId; name: string }[];
  solution: string | React.ReactNode;
  difficulty: 'Leicht' | 'Mittel' | 'Schwer';
};

export type TaskCategory = {
  id: string;
  name: string;
  tasks: Task[];
};

export const taskCategories: TaskCategory[] = [
  {
    id: 'aufgaben_beton',
    name: 'Betontechnologie',
    tasks: betonTasks
  },
  {
    id: 'aufgaben_stahlbeton',
    name: 'Massivbau & Stahlbeton',
    tasks: massivbauTasks
  },
  {
    id: 'aufgaben_holzbau',
    name: 'Ingenieurholzbau',
    tasks: holzbauTasks
  },
  {
    id: 'aufgaben_weitere',
    name: 'Baustoffe (Kalk, Gips, Stahl, Glas, etc.)',
    tasks: baustoffeTasks
  },
  {
    id: 'aufgaben_bauprodukte',
    name: 'Bauprodukte, Baurecht & Verkehrswegebau',
    tasks: bauprodukteTasks
  },
  {
    id: 'aufgaben_mechanik',
    name: 'Mechanik & Statik',
    tasks: mechanikTasks
  },
  {
    id: 'aufgaben_bauphysik',
    name: 'Bauphysik & Energieausweis',
    tasks: bauphysikTasks
  },
  {
    id: 'aufgaben_nachhaltigkeit',
    name: 'Nachhaltigkeit, Ökobilanz & Zirkularität',
    tasks: nachhaltigkeitTasks
  },
  {
    id: 'aufgaben_bestand',
    name: 'Bauen im Bestand & Denkmalpflege',
    tasks: bestandTasks
  },
  {
    id: 'aufgaben_dauerhaftigkeit',
    name: 'Dauerhaftigkeit, Bauschäden & Instandhaltung',
    tasks: dauerhaftigkeitTasks
  },
  {
    id: 'aufgaben_rueckbau',
    name: 'Rückbau, Schadstoffe & Recycling',
    tasks: rueckbauTasks
  },
  {
    id: 'aufgaben_kennwerte',
    name: 'Labor & Grundlagen: Prüftechnik & Kenngrößen',
    tasks: laborTasks
  },
  {
    id: 'aufgaben_digitales',
    name: 'Digitales, BIM & KI im Bauwesen',
    tasks: digitalesTasks
  },
  {
    id: 'aufgaben_komplex',
    name: 'Komplexe interdisziplinäre Fallstudien',
    tasks: komplexTasks
  }
];
