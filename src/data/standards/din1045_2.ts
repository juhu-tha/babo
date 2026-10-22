/**
 * Zentrale Normen-Datenbank: DIN 1045-2:2023-08 & DIN EN 206:2021-06
 * Single Source of Truth für Expositionsklassen, Grenzwerte (w/z, Festigkeit, Zement, Luftgehalt)
 * und k-Wert-Regeln für Betonzusatzstoffe nach deutschem Regelwerk.
 * 
 * Quelle: DIN 1045-2:2023-08, Tabellen F.2.1, F.2.2 sowie DIN EN 206:2021-06
 */

export interface ExpositionsklassenAnforderung {
  code: string;
  name: string;
  beschreibung: string;
  beispiele: string;
  maxWz: number | null;
  minDruckfestigkeit: string;
  minZementgehalt: number; // kg/m³
  minLuftporengehalt?: number; // % bei Dmax = 32mm
  anmerkung?: string;
  dinMediaSuchUrl: string;
}

export const DIN1045_2_EXPOSITIONSKLASSEN: Record<string, ExpositionsklassenAnforderung> = {
  // Kein Korrosions- oder Angriffsrisiko
  'X0': {
    code: 'X0',
    name: 'Kein Angriffsrisiko',
    beschreibung: 'Beton ohne Bewehrung oder eingebettetes Metall in nicht betonangreifender Umgebung; unbewehrter Innenbeton.',
    beispiele: 'Fundamente unbewehrt, Innenwände unbewehrt.',
    maxWz: null,
    minDruckfestigkeit: 'C8/10',
    minZementgehalt: 180,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },

  // Bewehrungskorrosion ausgelöst durch Karbonatisierung
  'XC1': {
    code: 'XC1',
    name: 'Trocken oder ständig nass',
    beschreibung: 'Teile von Bauwerken im Inneren von Gebäuden mit normaler Luftfeuchte; ständig unter Wasser.',
    beispiele: 'Innenbauteile von Wohn- und Bürobereichen; Gründungsbauteile unterhalb des Grundwasserspiegels.',
    maxWz: 0.75,
    minDruckfestigkeit: 'C16/20',
    minZementgehalt: 240,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XC2': {
    code: 'XC2',
    name: 'Nass, selten trocken',
    beschreibung: 'Teile von Wasserbehältern; Gründungsbauteile bei hohem Wasserstand.',
    beispiele: 'Wand- und Bodenplatten in Gründungen, Schächte, Kläranlagenbereiche ständig im Wasser.',
    maxWz: 0.65,
    minDruckfestigkeit: 'C20/25',
    minZementgehalt: 260,
    anmerkung: 'Nach DIN 1045-2:2023-08 Tab. F.2.1: max w/z = 0,65, C20/25, Z >= 260 kg/m³.',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XC3': {
    code: 'XC3',
    name: 'Mäßige Feuchte',
    beschreibung: 'Bauteile im Freien unter Überdachung oder Innenbauteile mit mäßiger bis hoher Luftfeuchtigkeit.',
    beispiele: 'Offene Hallen, Küchen, Brauereien, Viehställe, überdachte Parkdecks.',
    maxWz: 0.65,
    minDruckfestigkeit: 'C20/25',
    minZementgehalt: 260,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XC4': {
    code: 'XC4',
    name: 'Wechselnd nass und trocken',
    beschreibung: 'Außenbauteile mit direkter Beregnung.',
    beispiele: 'Fassaden, unüberdachte Außenstützen, Balkonplatten, Klärbeckenaußenwände.',
    maxWz: 0.60,
    minDruckfestigkeit: 'C25/30',
    minZementgehalt: 280,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },

  // Bewehrungskorrosion durch Chloride (außer Meerwasser)
  'XD1': {
    code: 'XD1',
    name: 'Mäßige Feuchte (Chloride)',
    beschreibung: 'Bauteiloberflächen, die chloridhaltigem Sprühnebel ausgesetzt sind.',
    beispiele: 'Garagenwände, Brückenpfeiler und Widerlager in mehr als 10 m Abstand zur Fahrbahn.',
    maxWz: 0.55,
    minDruckfestigkeit: 'C30/37',
    minZementgehalt: 300,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XD2': {
    code: 'XD2',
    name: 'Nass, selten trocken (Chloride)',
    beschreibung: 'Bauteile, die chloridhaltigen Industrieabwässern oder Sole ausgesetzt sind.',
    beispiele: 'Schwimmbecken mit chloriertem Wasser; Teile von Soletanks; Rohrleitungen.',
    maxWz: 0.50,
    minDruckfestigkeit: 'C35/45',
    minZementgehalt: 320,
    anmerkung: 'Mit Luftporen (>= 4,0 %) max w/z = 0,55 und C30/37 zulässig.',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XD3': {
    code: 'XD3',
    name: 'Wechselnd nass und trocken (Chloride)',
    beschreibung: 'Teile von Brücken und Parkdecks, die direkt mit Taumitteln beaufschlagt werden.',
    beispiele: 'Fahrbahnbeläge, Parkhaus-Zwischendecken ohne Abdichtung, Spritzwasserbereiche bis 10 m neben Straßen.',
    maxWz: 0.45,
    minDruckfestigkeit: 'C35/45',
    minZementgehalt: 320,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },

  // Bewehrungskorrosion durch Meerwasser
  'XS1': {
    code: 'XS1',
    name: 'Salzhaltige Luft',
    beschreibung: 'Bauteile in Küstennähe (salzhaltige Meeresluft), aber nicht in direktem Kontakt mit Meerwasser.',
    beispiele: 'Küstengebäude, Uferpromenadenbauwerke in Meeresnähe.',
    maxWz: 0.55,
    minDruckfestigkeit: 'C30/37',
    minZementgehalt: 300,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XS2': {
    code: 'XS2',
    name: 'Ständig unter Meerwasser',
    beschreibung: 'Bauteile, die ständig vollständig in Meerwasser getaucht sind.',
    beispiele: 'Kaimauern unterhalb Niedrigwasser, Fundamente von Offshore-Windkraftanlagen.',
    maxWz: 0.50,
    minDruckfestigkeit: 'C35/45',
    minZementgehalt: 320,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XS3': {
    code: 'XS3',
    name: 'Gezeiten- und Spritzzone',
    beschreibung: 'Bauteile in der Gezeitenzone oder im Spritzwasserbereich der Brandung.',
    beispiele: 'Wellenbrecher, Hafenmolen, Buhnen, Pfeiler im Tidengebiet.',
    maxWz: 0.45,
    minDruckfestigkeit: 'C35/45',
    minZementgehalt: 320,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },

  // Frost- und Frost-Taumittel-Angriff
  'XF1': {
    code: 'XF1',
    name: 'Mäßige Wassersättigung ohne Taumittel',
    beschreibung: 'Vertikale Außenbauteile unter Frost, die Regen ausgesetzt sind.',
    beispiele: 'Außenwände von Gebäuden, Stützmauern ohne Taumitteleinfluss.',
    maxWz: 0.60,
    minDruckfestigkeit: 'C25/30',
    minZementgehalt: 280,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XF2': {
    code: 'XF2',
    name: 'Mäßige Wassersättigung mit Taumittel',
    beschreibung: 'Vertikale Bauteile im Sprühnebelbereich taumittelbehandelter Verkehrsflächen.',
    beispiele: 'Brückenpfeiler und Widerlager in 3 bis 10 m Abstand zur Fahrbahn, Lärmschutzwände.',
    maxWz: 0.55,
    minDruckfestigkeit: 'C25/30',
    minZementgehalt: 300,
    minLuftporengehalt: 4.0,
    anmerkung: 'Alternativ ohne Luftporen: max w/z = 0,50, C35/45, Z >= 320 kg/m³.',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XF3': {
    code: 'XF3',
    name: 'Hohe Wassersättigung ohne Taumittel',
    beschreibung: 'Horizontale Bauteile, auf denen Wasser steht und die Frost ausgesetzt sind.',
    beispiele: 'Wasserbauteile im Freien, Wehre, Klärbeckenkronen, unüberdachte Freiflächen ohne Salz.',
    maxWz: 0.55,
    minDruckfestigkeit: 'C25/30',
    minZementgehalt: 300,
    minLuftporengehalt: 4.0,
    anmerkung: 'Alternativ ohne Luftporen: max w/z = 0,50, C35/45, Z >= 320 kg/m³.',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XF4': {
    code: 'XF4',
    name: 'Hohe Wassersättigung mit Taumittel',
    beschreibung: 'Horizontale Außenbauteile unter Taumitteleinfluss; Spritzwasserbereiche von Straßen.',
    beispiele: 'Betonfahrbahnen (Autobahn, Flugplatz), Brückenkappen, Parkdecks ohne Abdichtung, Bordsteine.',
    maxWz: 0.50,
    minDruckfestigkeit: 'C30/37',
    minZementgehalt: 320,
    minLuftporengehalt: 4.0,
    anmerkung: 'Nach DIN 1045-2:2023-08 Tab. F.2.2 zwingend Luftporenbeton: min. 4,0 % LP bei Dmax = 32 mm, Z >= 320 kg/m³.',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },

  // Chemischer Angriff
  'XA1': {
    code: 'XA1',
    name: 'Chemisch schwach angreifend',
    beschreibung: 'Böden und Grundwässer mit leicht saurem Milieu oder mäßigem Sulfatgehalt.',
    beispiele: 'Fundamente in schwach sauren Böden (pH 5,5 bis 6,5) oder Grundwasser mit 200 bis 600 mg/l Sulfat.',
    maxWz: 0.60,
    minDruckfestigkeit: 'C25/30',
    minZementgehalt: 280,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XA2': {
    code: 'XA2',
    name: 'Chemisch mäßig angreifend',
    beschreibung: 'Böden und Grundwässer mit mittlerem Säure- oder hohem Sulfatgehalt (600 bis 3000 mg/l).',
    beispiele: 'Kläranlagen, Güllebehälter, Gründungen in sulfathaltigen Böden (Gipskeuper).',
    maxWz: 0.50,
    minDruckfestigkeit: 'C35/45',
    minZementgehalt: 320,
    anmerkung: 'Bei Sulfatgehalt > 600 mg/l Zement mit hohem Sulfatwiderstand (SR-Zement) zwingend.',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XA3': {
    code: 'XA3',
    name: 'Chemisch stark angreifend',
    beschreibung: 'Industrieböden, stark saure Gewässer (pH 4,0 bis 4,5) oder extreme Sulfatkonzentration (3000 bis 6000 mg/l).',
    beispiele: 'Industrieabwasserkanäle, Kühltürme mit Rauchgaseinleitung, Silos.',
    maxWz: 0.45,
    minDruckfestigkeit: 'C35/45',
    minZementgehalt: 320,
    anmerkung: 'SR-Zement erforderlich; zusätzlich ggf. Schutzanstriche oder Auskleidungen nötig.',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },

  // Mechanischer Verschleiß
  'XM1': {
    code: 'XM1',
    name: 'Mäßiger Verschleiß',
    beschreibung: 'Flächen mit luftbereifter Fahrzeugbeanspruchung.',
    beispiele: 'Industriefußböden mit gelegentlichem Staplerverkehr (Luftbereifung).',
    maxWz: 0.55,
    minDruckfestigkeit: 'C30/37',
    minZementgehalt: 300,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XM2': {
    code: 'XM2',
    name: 'Schwerer Verschleiß',
    beschreibung: 'Flächen mit Beanspruchung durch Vollgummireifen oder häufige Staplerbewegungen.',
    beispiele: 'Industriehallen mit intensivem Gabelstaplerverkehr, Umschlaghallen.',
    maxWz: 0.45,
    minDruckfestigkeit: 'C35/45',
    minZementgehalt: 320,
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  },
  'XM3': {
    code: 'XM3',
    name: 'Extrem schwerer Verschleiß',
    beschreibung: 'Flächen mit Kettenfahrzeugen, Stahlrollen oder starker Schleifbeanspruchung.',
    beispiele: 'Panzerabstellplätze, Schrottplätze, Entladetrichter, Wehre mit Geschiebetransport.',
    maxWz: 0.45,
    minDruckfestigkeit: 'C35/45',
    minZementgehalt: 320,
    anmerkung: 'Zusätzliche Hartstoffeinstreuung nach DIN 1100 erforderlich.',
    dinMediaSuchUrl: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2:2023-08'
  }
};

/**
 * k-Wert-Regeln für reaktive Betonzusatzstoffe nach DIN 1045-2:2023-08 Abs. 5.2.5
 */
export const DIN1045_2_K_WERTE = {
  norm: 'DIN 1045-2:2023-08',
  flugasche: {
    k: 0.40,
    maxAnrechnungVerhaeltnis: 0.33, // f / z <= 0,33
    normQuelle: 'DIN EN 450-1'
  },
  silikastaub: {
    k: 1.00,
    maxAnrechnungVerhaeltnis: 0.11, // s / z <= 0,11
    normQuelle: 'DIN EN 13263-1'
  },
  huettensand: {
    k: null, // In Deutschland nach DIN 1045-2 nicht für k-Wert angerechnet (nur als CEM III oder bauaufsichtlich zugelassen)
    anmerkung: 'Hüttensandmehl wird in Deutschland über k-Wert nicht angerechnet; Verwendung als Bestandteil von Hochofenzement CEM III geregelt.'
  }
};

/**
 * Mindestluftporengehalte für XF2 und XF4 in Abhängigkeit vom Größtkorn Dmax
 * nach DIN 1045-2:2023-08 Tab. F.2.2
 */
export const DIN1045_2_MINDEST_LUFTPOREN: Record<number, number> = {
  8: 5.5,
  16: 4.5,
  22: 4.0,
  32: 4.0,
  63: 3.5
};

/**
 * Berechnet die maßgebenden Anforderungen bei Kombination mehrerer Expositionsklassen.
 * Liefert den strengsten Grenzwert (kleinstes maxWz, höchste Festigkeitsklasse, größter minZementgehalt).
 */
export function getMassgebendeAnforderung(klassen: string[]): {
  maxWz: number | null;
  minDruckfestigkeit: string;
  minZementgehalt: number;
  minLuftporengehalt: number;
} {
  let minWz: number | null = null;
  let maxZement = 0;
  let maxLp = 0;
  let hoechsteFestigkeitNum = 0;
  let hoechsteFestigkeitStr = 'C8/10';

  const FESTIGKEIT_STUFEN: Record<string, number> = {
    'C8/10': 1,
    'C12/15': 2,
    'C16/20': 3,
    'C20/25': 4,
    'C25/30': 5,
    'C30/37': 6,
    'C35/45': 7,
    'C40/50': 8,
    'C45/55': 9,
    'C50/60': 10
  };

  for (const k of klassen) {
    const anford = DIN1045_2_EXPOSITIONSKLASSEN[k];
    if (!anford) continue;

    if (anford.maxWz !== null) {
      if (minWz === null || anford.maxWz < minWz) {
        minWz = anford.maxWz;
      }
    }
    if (anford.minZementgehalt > maxZement) {
      maxZement = anford.minZementgehalt;
    }
    if (anford.minLuftporengehalt && anford.minLuftporengehalt > maxLp) {
      maxLp = anford.minLuftporengehalt;
    }

    const rank = FESTIGKEIT_STUFEN[anford.minDruckfestigkeit] || 0;
    if (rank > hoechsteFestigkeitNum) {
      hoechsteFestigkeitNum = rank;
      hoechsteFestigkeitStr = anford.minDruckfestigkeit;
    }
  }

  return {
    maxWz: minWz,
    minDruckfestigkeit: hoechsteFestigkeitStr,
    minZementgehalt: maxZement,
    minLuftporengehalt: maxLp
  };
}
