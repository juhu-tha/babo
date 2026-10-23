/**
 * Zentrale Normen-Datenbank: DIN EN 197-1:2011-11 & DIN EN 197-5:2021-07
 * Single Source of Truth für Normalzemente (CEM I bis CEM VI),
 * Hauptbestandteile, Klinkeranteile, Festigkeitsklassen und bauchemische Kennwerte.
 * 
 * Quelle: DIN EN 197-1:2011-11 sowie DIN EN 197-5:2021-07 (klinkerarme Zemente)
 */

export interface ZementTyp {
  bezeichnung: string;
  name: string;
  klinkerGehaltMin: number; // Masse-%
  klinkerGehaltMax: number; // Masse-%
  weitereHauptbestandteile: string;
  anwendungsbereiche: string;
  co2Intensitaet: 'sehr_hoch' | 'hoch' | 'mittel' | 'niedrig' | 'sehr_niedrig';
  dinMediaSuchUrl: string;
}

export const DIN_EN_197_ZEMENTE: Record<string, ZementTyp> = {
  'CEM_I': {
    bezeichnung: 'CEM I',
    name: 'Portlandzement',
    klinkerGehaltMin: 95,
    klinkerGehaltMax: 100,
    weitereHauptbestandteile: 'Nebenbestandteile max. 5 %',
    anwendungsbereiche: 'Hochfester Beton, Fertigteile, Winterbaustellen, Spannbeton; hohe Anfangsfestigkeit, hohe Hydratationswärme.',
    co2Intensitaet: 'sehr_hoch',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1:2011-11'
  },
  'CEM_II_A_S': {
    bezeichnung: 'CEM II/A-S',
    name: 'Portlandschlackenzement',
    klinkerGehaltMin: 80,
    klinkerGehaltMax: 94,
    weitereHauptbestandteile: 'Hüttensand (S) 6–20 %',
    anwendungsbereiche: 'Allgemeiner Hoch- und Tiefbau, gute Nacherhärtung.',
    co2Intensitaet: 'hoch',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1:2011-11'
  },
  'CEM_II_B_S': {
    bezeichnung: 'CEM II/B-S',
    name: 'Portlandschlackenzement',
    klinkerGehaltMin: 65,
    klinkerGehaltMax: 79,
    weitereHauptbestandteile: 'Hüttensand (S) 21–35 %',
    anwendungsbereiche: 'Massige Bauteile, mäßige Hydratationswärme, verbesserter Sulfatwiderstand.',
    co2Intensitaet: 'mittel',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1:2011-11'
  },
  'CEM_II_A_LL': {
    bezeichnung: 'CEM II/A-LL',
    name: 'Portlandkalksteinzement',
    klinkerGehaltMin: 80,
    klinkerGehaltMax: 94,
    weitereHauptbestandteile: 'Kalkstein (LL mit TOC <= 0,20 %) 6–20 %',
    anwendungsbereiche: 'Standard-Hochbauzement im Transportbetonbereich; geschmeidige Verarbeitung, gute Wasserrückhaltung.',
    co2Intensitaet: 'hoch',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1:2011-11'
  },
  'CEM_II_B_LL': {
    bezeichnung: 'CEM II/B-LL',
    name: 'Portlandkalksteinzement',
    klinkerGehaltMin: 65,
    klinkerGehaltMax: 79,
    weitereHauptbestandteile: 'Kalkstein (LL) 21–35 %',
    anwendungsbereiche: 'CO2-reduzierter Hochbauzement, Putz- und Estrichbetone.',
    co2Intensitaet: 'mittel',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1:2011-11'
  },
  'CEM_II_C_M': {
    bezeichnung: 'CEM II/C-M',
    name: 'Portlandkompositzement (DIN EN 197-5:2021-07)',
    klinkerGehaltMin: 50,
    klinkerGehaltMax: 64,
    weitereHauptbestandteile: 'Kombination aus Hüttensand (S), Flugasche (V) und/oder Kalkstein (LL) 36–50 %',
    anwendungsbereiche: 'Klimaschonender Zement der neuen Generation; drastisch verringerter Klinkerfaktor bei normgerechter Festigkeit.',
    co2Intensitaet: 'niedrig',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-5:2021-07'
  },
  'CEM_III_A': {
    bezeichnung: 'CEM III/A',
    name: 'Hochofenzement',
    klinkerGehaltMin: 35,
    klinkerGehaltMax: 64,
    weitereHauptbestandteile: 'Hüttensand (S) 36–65 %',
    anwendungsbereiche: 'Massige Bauteile, WU-Bauwerke, Bohrpfähle, chemisch mäßig angreifende Wässer (XA2). Mäßige bis niedrige Hydratationswärme.',
    co2Intensitaet: 'niedrig',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1:2011-11'
  },
  'CEM_III_B': {
    bezeichnung: 'CEM III/B',
    name: 'Hochofenzement',
    klinkerGehaltMin: 20,
    klinkerGehaltMax: 34,
    weitereHauptbestandteile: 'Hüttensand (S) 66–80 %',
    anwendungsbereiche: 'Sehr massige Bauteile (Talsperren, Sohlplatten), Kläranlagen (XA3), Meerwasserbauwerke. Extrem niedrige Hydratationswärme (LH / VLH).',
    co2Intensitaet: 'sehr_niedrig',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1:2011-11'
  },
  'CEM_III_C': {
    bezeichnung: 'CEM III/C',
    name: 'Hochofenzement',
    klinkerGehaltMin: 5,
    klinkerGehaltMax: 19,
    weitereHauptbestandteile: 'Hüttensand (S) 81–95 %',
    anwendungsbereiche: 'Spezialanwendungen im Tiefbau, Dichtwände; extrem langsame Festigkeitsentwicklung, maximale Sulfatresistenz.',
    co2Intensitaet: 'sehr_niedrig',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1:2011-11'
  },
  'CEM_IV_A': {
    bezeichnung: 'CEM IV/A',
    name: 'Puzzolanzement',
    klinkerGehaltMin: 65,
    klinkerGehaltMax: 89,
    weitereHauptbestandteile: 'Puzzolane (P, Q), Flugasche (V, W) 11–35 %',
    anwendungsbereiche: 'Wasserbau, säureresistente Spezialbauteile.',
    co2Intensitaet: 'mittel',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1:2011-11'
  },
  'CEM_V_A': {
    bezeichnung: 'CEM V/A',
    name: 'Kompositzement',
    klinkerGehaltMin: 40,
    klinkerGehaltMax: 64,
    weitereHauptbestandteile: 'Hüttensand (S) 18–30 % + Flugasche/Puzzolan (V, P) 18–30 %',
    anwendungsbereiche: 'Massige Gründungsbauteile, Bodenverbesserung.',
    co2Intensitaet: 'niedrig',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1:2011-11'
  },
  'CEM_VI': {
    bezeichnung: 'CEM VI',
    name: 'Kompositzement (DIN EN 197-5:2021-07)',
    klinkerGehaltMin: 35,
    klinkerGehaltMax: 49,
    weitereHauptbestandteile: 'Hüttensand (S) 31–59 % + Kalkstein (LL) oder Flugasche (V) 6–20 %',
    anwendungsbereiche: 'Klimaneutraler Betonbau der Zukunft mit Klinkeranteil unter 50 %.',
    co2Intensitaet: 'sehr_niedrig',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-5:2021-07'
  }
};

/**
 * Festigkeitsklassen für Zemente nach DIN EN 197-1:2011-11 Tab. 2
 */
export interface ZementFestigkeitsklasse {
  klasse: string;
  fruehfestigkeitTage: number; // Tage (2 oder 7)
  fruehfestigkeitMin: number; // MPa
  normfestigkeit28dMin: number; // MPa
  normfestigkeit28dMax: number | null; // MPa
  erstarrungsbeginnMin: number; // min
  raumbestaendigkeitMax: number; // mm (Le Chatelier)
}

export const DIN_EN_197_FESTIGKEITSKLASSEN: Record<string, ZementFestigkeitsklasse> = {
  '32.5_N': {
    klasse: '32,5 N',
    fruehfestigkeitTage: 7,
    fruehfestigkeitMin: 16.0,
    normfestigkeit28dMin: 32.5,
    normfestigkeit28dMax: 52.5,
    erstarrungsbeginnMin: 75,
    raumbestaendigkeitMax: 10
  },
  '32.5_R': {
    klasse: '32,5 R',
    fruehfestigkeitTage: 2,
    fruehfestigkeitMin: 10.0,
    normfestigkeit28dMin: 32.5,
    normfestigkeit28dMax: 52.5,
    erstarrungsbeginnMin: 75,
    raumbestaendigkeitMax: 10
  },
  '42.5_N': {
    klasse: '42,5 N',
    fruehfestigkeitTage: 2,
    fruehfestigkeitMin: 10.0,
    normfestigkeit28dMin: 42.5,
    normfestigkeit28dMax: 62.5,
    erstarrungsbeginnMin: 60,
    raumbestaendigkeitMax: 10
  },
  '42.5_R': {
    klasse: '42,5 R',
    fruehfestigkeitTage: 2,
    fruehfestigkeitMin: 20.0,
    normfestigkeit28dMin: 42.5,
    normfestigkeit28dMax: 62.5,
    erstarrungsbeginnMin: 60,
    raumbestaendigkeitMax: 10
  },
  '52.5_N': {
    klasse: '52,5 N',
    fruehfestigkeitTage: 2,
    fruehfestigkeitMin: 20.0,
    normfestigkeit28dMin: 52.5,
    normfestigkeit28dMax: null,
    erstarrungsbeginnMin: 45,
    raumbestaendigkeitMax: 10
  },
  '52.5_R': {
    klasse: '52,5 R',
    fruehfestigkeitTage: 2,
    fruehfestigkeitMin: 30.0,
    normfestigkeit28dMin: 52.5,
    normfestigkeit28dMax: null,
    erstarrungsbeginnMin: 45,
    raumbestaendigkeitMax: 10
  }
};
