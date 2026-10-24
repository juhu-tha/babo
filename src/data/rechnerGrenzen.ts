/**
 * Annahmen und Grenzen der Rechner (Umsetzungsplan Phase 4, AP 4.11).
 * Der Haftungshinweis über jedem Rechner zeigt diese Liste aufklappbar an.
 * tests/rechnerGrenzen.test.ts prüft, dass jedes Modul vom Typ „calculator“ einen Eintrag hat.
 */
export interface RechnerGrenzen {
  /** Was der Rechner berechnet (ein Satz) */
  kurz: string;
  /** Vereinfachungen und Anwendungsgrenzen; leer, wenn das Modul nichts berechnet */
  grenzen: string[];
  /** false: Modul ist als Rechner einsortiert, berechnet aber keine Bemessungsgrößen */
  rechnet?: boolean;
}

const STAHLBETON: RechnerGrenzen = {
  kurz: 'Bemessung von Stahlbetonquerschnitten nach DIN EN 1992-1-1 mit NA (DE) für Biegung, Querkraft, Stützen, Durchstanzen, Verankerung und Rissbreite.',
  grenzen: [
    'Rechteckquerschnitte, Normalbeton bis C50/60 (Spannungsblock λ = 0,8, η = 1,0); darüber erscheint ein Hinweis.',
    'Biegung: eine Zug- und eine Druckbewehrungslage, ξ_lim = 0,45; nichtmetallische Bewehrung vereinfacht linear-elastisch, maßgebend ist die Zulassung.',
    'Querkraft: z = 0,9·d, senkrechte Bügel, ohne Normalkraft (σ_cp = 0).',
    'Stütze: Theorie I. Ordnung mit e_i = l₀/400 und Mindestausmitte; bei λ > λ_lim nur Hinweis, kein Nachweis nach Theorie II. Ordnung.',
    'Durchstanzen: konstantes β, keine Öffnungen, keine Abminderung durch Bodenpressung; erhöhte Faktoren κ_sw der ersten Bewehrungsreihen nicht berücksichtigt.',
    'Rissbreite: direkte Berechnung mit einer Bewehrungslage; bei Stababständen > 5·(c + φ/2) gilt 7.3.4(4) (nur Hinweis).',
  ],
};

export const RECHNER_GRENZEN: Readonly<Record<string, RechnerGrenzen>> = {
  stahlbeton_bemessung: STAHLBETON,
  spannbeton: {
    kurz: 'Spannkraftverluste (Reibung, Keilschlupf, elastische Verkürzung, Kriechen, Schwinden, Relaxation) und Spannungsnachweise eines Rechteckquerschnitts.',
    grenzen: [
      'Einfeldträger mit Nachweisschnitt in Feldmitte, Rechteckquerschnitt ohne Spannglied-Hüllrohrabzug.',
      'Zeitabhängige Verluste nach Gl. (5.46) mit φ(∞,t₀) und ε_cs(∞) nach Anhang B; Relaxation für 500 000 h.',
      'Dekompression vereinfacht als Betonspannung in e_p + 25 mm (genaue Abgrenzung nach NA DE offen).',
    ],
  },
  holzbau_bemessung: {
    kurz: 'Knicknachweis von Druckstäben und Querdrucknachweis nach DIN EN 1995-1-1 mit NA (DE).',
    grenzen: [
      'Zentrischer Druck um die schwache Achse; Biegung, Exzentrizitäten und Kippen sind nicht enthalten.',
      'Vollholz nach EN 338 und Brettschichtholz nach EN 14080, γ_M = 1,3; k_mod nach Tab. 3.1.',
      'Querdruck: wirksame Kontaktlänge mit pauschal 30 mm Überstand je Seite.',
    ],
  },
  bauphysik: {
    kurz: 'U-Wert nach DIN EN ISO 6946, Temperatur- und Dampfdruckverlauf, vereinfachtes Glaser-Verfahren, sommerlicher Wärmeschutz und Raumakustik.',
    grenzen: [
      'Homogene Schichten ohne Wärmebrücken, Befestigungsmittel und Luftschichtkorrekturen.',
      'Glaser-Verfahren vereinfacht: eine Tauwasserebene an einer Schichtgrenze, Verdunstungsklima 12 °C / 70 %; die Randbedingungen der DIN 4108-3:2024 weichen ab.',
      'GEG-Höchstwerte für die Änderung bestehender Gebäude (Anlage 7).',
    ],
  },
  feuchteschutz: {
    kurz: 'Taupunkt, Schimmeltemperatur und Feuchtezustand von Raumluft und Bauteiloberflächen nach DIN 4108-3.',
    grenzen: [
      'Sättigungsdampfdruck nach der Magnus-Formel der DIN 4108-3 (über Eis unter 0 °C).',
      'Stationäre Betrachtung ohne Feuchtespeicherung und kapillaren Transport.',
    ],
  },
  schallschutz: {
    kurz: 'Bewertetes Schalldämm-Maß einschaliger massiver Bauteile über die Massekurve nach DIN 4109-32.',
    grenzen: [
      'R_w = 30,9·lg(m′) − 22,2 dB, gültig für 65 ≤ m′ ≤ 720 kg/m².',
      'Nur einschalige, biegesteife Bauteile; Vorsatzschalen, WDVS und Holzbau (Masse-Feder-Masse) werden nicht abgebildet.',
      'Ohne Flankenübertragung, also kein Nachweis von R′_w zwischen Räumen.',
    ],
  },
  bp_glaeser: {
    kurz: 'Wärmedurchgangskoeffizient U_w von Fenstern nach DIN EN ISO 10077-1 und solare Gewinne.',
    grenzen: [
      'Einflügeliges Fenster mit umlaufend gleicher Rahmenbreite.',
      'Ψ-Werte der Abstandhalter als Lehrwerte; maßgebend sind die Herstellerangaben.',
      'Kein Standsicherheitsnachweis der Verglasung nach DIN 18008.',
    ],
  },
  mischungsberechnung: {
    kurz: 'Stoffraumrechnung für 1 m³ Beton mit Feuchtekorrektur, (w/z)_eq, Expositionsanforderungen und CO₂-Abschätzung.',
    grenzen: [
      'Rohdichten der Zusatzstoffe, Zusatzmittel und Fasern als feste Lehrwerte.',
      'Anrechenbarkeit von Flugasche vereinfacht nach Zementart; Präzisierung nach DIN 1045-2 offen.',
      'CO₂-Werte sind Lehrwerte und ersetzen keine EPD.',
    ],
  },
  bodenmechanik: {
    kurz: 'Zustandsgrenzen und Klassifikation nach DIN 18196, Mohr-Coulomb, Erddruck nach Rankine und Konsolidierung nach Terzaghi.',
    grenzen: [
      'Erddruck: glatte, lotrechte Wand, waagerechtes Gelände, kohäsionsloser Boden ohne Wasser.',
      'Konsolidierung eindimensional mit konstantem c_v und E_s, Näherungsformel für U(T_v).',
      'Klassifikation nur über das Plastizitätsdiagramm, ohne Korngrößen- und organische Anteile.',
    ],
  },
  baustatik: {
    kurz: 'Schnittgrößen von Einfeldträger, Kragarm und Zweifeldträger sowie Auflagerkräfte eines Dreigelenkrahmens.',
    grenzen: [
      'Linear-elastisch, Theorie I. Ordnung, Biegesteifigkeit EI über die Länge konstant.',
      'Je eine Gleichlast, Einzellast und ein Einzelmoment; keine Lastfallkombinationen.',
    ],
  },
};

/** Grenzen für ein Modul; Unterreiter der Stahlbetonbemessung erben den Eintrag */
const STAHLBETON_REITER = ['spannung', 'biegebemessung', 'querkraftbemessung', 'stuetzenbemessung', 'durchstanzen', 'verankerungslaenge', 'rissbreite'];
export function grenzenFuer(id: string): RechnerGrenzen | undefined {
  return RECHNER_GRENZEN[id] ?? (STAHLBETON_REITER.includes(id) ? STAHLBETON : undefined);
}
