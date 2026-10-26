import inhalt from '@/content/moduleinfo/ressourcen.json';
// Ausgelagert aus src/modules/ModuleInfo.tsx (AP 5.2)

export interface FurtherResource {
  websites: { name: string; url?: string; desc: string }[];
  books: { title: string; desc: string }[];
  publications: { journal: string; title: string; desc: string }[];
  dissertations: { title: string; desc: string }[];
}

export const COMPREHENSIVE_RESOURCES: Record<string, FurtherResource> = inhalt.daten.COMPREHENSIVE_RESOURCES;
