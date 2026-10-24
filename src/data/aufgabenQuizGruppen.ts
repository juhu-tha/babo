// Zuordnung Aufgaben-Reiter → Menügruppen des Quizpools (Gruppen aus src/registry/modules.ts).
// Die Cluster-Angabe wird aus den Fragen abgeleitet, nicht mehr von Hand gepflegt.
export const AUFGABEN_QUIZ_GRUPPEN: Record<string, { gruppen?: string[]; label: string }> = {
  aufgaben_beton: { gruppen: ['Betontechnologie'], label: 'Betontechnologie' },
  aufgaben_stahlbeton: { gruppen: ['Massivbau'], label: 'Massivbau' },
  aufgaben_holzbau: { gruppen: ['Holzbau'], label: 'Holzbau' },
  aufgaben_weitere: { gruppen: ['Baustoffe', 'Innenausbau'], label: 'Baustoffe' },
  aufgaben_bauprodukte: { gruppen: ['Bauprodukte'], label: 'Bauprodukte & Baurecht' },
  aufgaben_mechanik: { gruppen: ['Mechanik'], label: 'Mechanik' },
  aufgaben_bauphysik: { gruppen: ['Bauphysik'], label: 'Bauphysik' },
  aufgaben_nachhaltigkeit: { gruppen: ['Nachhaltigkeit'], label: 'Nachhaltigkeit' },
  aufgaben_bestand: { gruppen: ['Bauen im Bestand', 'Schutz & Instandsetzung'], label: 'Bauen im Bestand' },
  aufgaben_dauerhaftigkeit: { gruppen: ['Dauerhaftigkeit', 'Mängel & Schäden'], label: 'Dauerhaftigkeit & Schäden' },
  aufgaben_rueckbau: { gruppen: ['Rückbau & Schadstoffe'], label: 'Rückbau & Schadstoffe' },
  aufgaben_kennwerte: { gruppen: ['Labor & Auswertung', 'Grundlagen'], label: 'Labor & Grundlagen' },
  aufgaben_digitales: { gruppen: ['Digitales', 'KI im Bauwesen'], label: 'Digitales, BIM & KI' },
  aufgaben_komplex: { gruppen: ['Praxiswissen', 'Mängel & Schäden', 'Bauen im Bestand'], label: 'Komplexe Fallstudien' },
  aufgaben_quiz: { label: 'Wissenscheck & Wissenslücken' }
};
