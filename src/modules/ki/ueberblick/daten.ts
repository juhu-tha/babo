// Ausgelagert aus src/modules/ki/KiUeberblick.tsx (AP 5.2)
import { Workflow, Boxes } from 'lucide-react';
import inhalt from '@/content/ki/ueberblick/daten.json';

export interface ConstructionExample {
  title: string;
  category: string;
  scenario: string;
  input: string;
  process: string;
  output: string;
  benefit: string;
  normRef: string;
}

export interface TermData {
  title: string;
  badge: string;
  analogy: string;
  summary: string;
  simpleExpl: string;
  constructionExample: string;
  technicalMechanism: { step: string; title: string; desc: string }[];
  keyCharacteristics: string[];
  examples: ConstructionExample[];
  classicVsAi: {
    classicTitle: string;
    classicSteps: string[];
    classicDisadvantage: string;
    aiTitle: string;
    aiSteps: string[];
    aiAdvantage: string;
    roiSummary: string;
  };
  math: {
    formula: string;
    formulaName: string;
    formulaText: string;
    explanation: string;
    variables: { sym: string; name: string; desc: string }[];
  };
  pitfalls: {
    mainRisk: string;
    engineerDuty: string;
    standards: string;
  };
}

export const termsData: Record<'ki' | 'ml' | 'dl' | 'llm' | 'rag' | 'vision' | 'agenten', TermData> = inhalt.daten.termsData;

export const ragDemonstrations = inhalt.daten.ragDemonstrations;
