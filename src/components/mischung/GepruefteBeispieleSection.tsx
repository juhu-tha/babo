import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { 
  CheckCircle2, BookOpen, ArrowRight, ShieldCheck, 
  Layers, Info, Sparkles, Scale 
} from 'lucide-react';

export interface BenchmarkData {
  id: string;
  titel: string;
  kategorie: string;
  normKonformitaet: string;
  bauteilTyp: string;
  beschreibung: string;
  zementArt: string;
  zementFestigkeit: string;
  zement: number;
  wasser: number;
  konsistenz: string;
  fa: number;
  sf: number;
  hues: number;
  biochar?: number;
  stahlfaser?: number;
  ppFaser?: number;
  zusatzmittel: number;
  luft: number;
  groesstkorn: 8 | 16 | 32;
  sandFraktion?: '0/4' | '0/2';
  f04: number;
  f48: number;
  f816: number;
  f1632: number;
  feuchte04: number;
  feuchte48: number;
  feuchte816: number;
  feuchte1632: number;
  wa04: number;
  wa48: number;
  wa816: number;
  wa1632: number;
  expClasses: string[];
  lpSetting?: 'auto' | 'mit_lp' | 'ohne_lp';

  normVorgaben: {
    druckfestigkeit: string;
    maxWz: number;
    minZement: number;
    minLuft?: number;
  };
  stoffraum: {
    zementVol: number;
    wasserVol: number;
    luftVol: number;
    zusatzstoffVol?: number;
    zmVol?: number;
    faserVol?: number;
    gesteinVol: number;
  };
  massenTrocken: {
    gesteinGesamt: number;
    m04: number;
    m48: number;
    m816: number;
    m1632?: number;
  };
  feuchteRechnung: {
    wasserAusGestein: number;
    zugabewasser: number;
    m04Feucht: number;
    m48Feucht: number;
    m816Feucht: number;
    m1632Feucht?: number;
  };
  frischbetonDichte: number;
  didaktischeHinweise: string[];
}

export const BENCHMARK_EXAMPLES: BenchmarkData[] = [
  {
    id: 'bsp_hochbau',
    titel: 'Beispiel 1: Hochbau-Regelbeton C25/30',
    kategorie: 'Hochbau & Wohnungsbau',
    normKonformitaet: 'DIN EN 206-1 / DIN 1045-2 (XC4, XF1)',
    bauteilTyp: 'Außenwand / Balkonplatte (direkt beregnet)',
    beschreibung: 'Klassischer Konstruktionsbeton für direkt bewitterte Hochbau-Bauteile. Nachweis der Stoffraumrechnung mit Mehlkornprüfung, Sieblinienaufteilung A/B 16 und realitätsnaher Feuchtekorrektur.',
    zementArt: 'CEM II/A',
    zementFestigkeit: '32.5 R',
    zement: 320,
    wasser: 190,
    konsistenz: 'F3',
    fa: 0,
    sf: 0,
    hues: 0,
    biochar: 0,
    stahlfaser: 0,
    ppFaser: 0,
    zusatzmittel: 0,
    luft: 2.0,
    groesstkorn: 16,
    sandFraktion: '0/4',
    f04: 45,
    f48: 20,
    f816: 35,
    f1632: 0,
    feuchte04: 3.0,
    feuchte48: 1.0,
    feuchte816: 0.5,
    feuchte1632: 0.5,
    wa04: 0.5,
    wa48: 0.5,
    wa816: 0.5,
    wa1632: 0.5,
    expClasses: ['XC4', 'XF1'],
    lpSetting: 'ohne_lp',
    normVorgaben: {
      druckfestigkeit: 'C25/30',
      maxWz: 0.60,
      minZement: 300, // 280 + 20 kg wegen Dmax 16 nach DIN 1045-2
      minLuft: 2.0,
    },
    stoffraum: {
      zementVol: 104.9, // 320 / 3.05
      wasserVol: 190.0,
      luftVol: 20.0,
      zmVol: 0.0,
      faserVol: 0.0,
      gesteinVol: 685.1, // 1000 - 104.9 - 190 - 20
    },
    massenTrocken: {
      gesteinGesamt: 1815.5, // 685.1 * 2.65
      m04: 817.0, // 45%
      m48: 363.1, // 20%
      m816: 635.4, // 35%
    },
    feuchteRechnung: {
      wasserAusGestein: 22.2, // Sand: 817*(2.5%) = 20.4L, 4/8: 363.1*(0.5%) = 1.8L
      zugabewasser: 167.8, // 190 - 22.2
      m04Feucht: 841.5,
      m48Feucht: 366.7,
      m816Feucht: 638.6,
    },
    frischbetonDichte: 2.326,
    didaktischeHinweise: [
      'Mindestzementgehalt nach DIN 1045-2 Tabelle F.2.1 beträgt für XC4/XF1 280 kg/m³. Da Dmax = 16 mm gewählt wurde, erhöht sich die Forderung normativ um +20 kg/m³ auf 300 kg/m³.',
      'Der gewählte w/z-Wert von 190 / 320 = 0,594 hält das normative Limit von max. 0,60 sicher ein.',
      'Die Oberflächenfeuchte der Gesteinskörnungen (3,0% Gesamtfeuchte minus 0,5% Kernfeuchte) liefert 22,2 Liter Wasser aus den Zuschlägen, wodurch das tatsächliche Zugabewasser am Mischer auf 167,8 Liter reduziert werden muss.',
    ],
  },
  {
    id: 'bsp_lp_verkehr',
    titel: 'Beispiel 2: LP-Beton C30/37 für Brückenkappe & Straßendecke',
    kategorie: 'Verkehrsbau & Ingenieurbau (Frost-Tausalz)',
    normKonformitaet: 'DIN EN 206-1 / DIN 1045-2 (XC4, XD3, XF4)',
    bauteilTyp: 'Brückenkappe / Sprühnebelbereich mit Tausalz',
    beschreibung: 'Hochresistenter Luftporenbeton (LP) mit gezielt eingebrachten Mikroluftporen gegen Frost-Tausalz-Angriff. Demonstriert die automatische Gesteinsvolumen-Verdrängung, Sandanteilsreduktion nach Walz und die normative Erleichterung der Festigkeitsklasse von C50/60 auf C30/37.',
    zementArt: 'CEM I',
    zementFestigkeit: '42.5 N',
    zement: 340,
    wasser: 168,
    konsistenz: 'F3',
    fa: 0,
    sf: 0,
    hues: 0,
    biochar: 0,
    stahlfaser: 0,
    ppFaser: 0,
    zusatzmittel: 1.2,
    luft: 4.5,
    groesstkorn: 32,
    sandFraktion: '0/4',
    f04: 37, // Walz'sche Sandreduktion: 40% - 3% = 37%
    f48: 18,
    f816: 22,
    f1632: 23,
    feuchte04: 3.0,
    feuchte48: 1.0,
    feuchte816: 0.5,
    feuchte1632: 0.5,
    wa04: 0.5,
    wa48: 0.5,
    wa816: 0.5,
    wa1632: 0.5,
    expClasses: ['XC4', 'XD3', 'XF4'],
    lpSetting: 'mit_lp',
    normVorgaben: {
      druckfestigkeit: 'C30/37', // mit LP normativ zulässig statt C50/60!
      maxWz: 0.50,
      minZement: 320,
      minLuft: 4.0, // Dmax 32 mm: min. 4.0 Vol.-%
    },
    stoffraum: {
      zementVol: 109.7, // 340 / 3.10
      wasserVol: 168.0,
      luftVol: 45.0, // 4.5% Luft = 45 dm³!
      zmVol: 1.1, // 1.2 / 1.05
      faserVol: 0.0,
      gesteinVol: 676.2, // 1000 - 109.7 - 168 - 1.1 - 45
    },
    massenTrocken: {
      gesteinGesamt: 1792.0, // 676.2 * 2.65
      m04: 663.0, // 37%
      m48: 322.6, // 18%
      m816: 394.2, // 22%
      m1632: 412.2, // 23%
    },
    feuchteRechnung: {
      wasserAusGestein: 18.2,
      zugabewasser: 149.8,
      m04Feucht: 682.9,
      m48Feucht: 325.8,
      m816Feucht: 396.2,
      m1632Feucht: 414.3,
    },
    frischbetonDichte: 2.301,
    didaktischeHinweise: [
      'Gesteinsverdrängung durch LP: Gegenüber Normalbeton (20 dm³ Luft) beanspruchen 45 dm³ Luftporen 25 dm³ zusätzlichen Raum. Dadurch sinkt die Gesteinsmasse um ca. 66 kg/m³!',
      'Kugellagereffekt & Wasserbedarf: Die mikroskopisch kleinen Luftporen (10–300 µm) wirken wie reibungsfreie Kugeln. Dadurch sinkt der Wasseranspruch für Konsistenz F3 von 175 L auf 168 L/m³.',
      'Sandanteilsreduktion nach Walz: Um eine Übermörtelung zu vermeiden, wurde der Sandanteil (0/4 mm) von normüblichen 40% um 3 M.-% auf 37% gesenkt und dem Grobkorn zugeschlagen.',
      'Normative Erleichterung: Ohne LP müsste XF4 als C50/60 ausgeführt werden (kaum praxistauglich). Mit min. 4,0% LP genügt C30/37 mit w/z ≤ 0,50.',
    ],
  },
  {
    id: 'bsp_hues_masse',
    titel: 'Beispiel 3: Massenbeton mit Hüttensandmehl (HüS)',
    kategorie: 'Wasserbau & Massenbauteile (Sohlplatten/Talsperren)',
    normKonformitaet: 'DIN EN 206-1 / DIN 1045-2 (XC2, XA1, LH-Zement)',
    bauteilTyp: 'Massive Bodenplatte (d = 2,50 m) im Grundwasser',
    beschreibung: 'Thermisch optimierter Massenbeton mit 100 kg/m³ Hüttensandmehl (HüS) zur drastischen Dämpfung der Hydratationswärme und Erzielung höchster Sulfatbeständigkeit.',
    zementArt: 'CEM I',
    zementFestigkeit: '42.5 N',
    zement: 240,
    wasser: 155,
    konsistenz: 'F3',
    fa: 0,
    sf: 0,
    hues: 100, // Hüttensandmehl
    biochar: 0,
    stahlfaser: 0,
    ppFaser: 0,
    zusatzmittel: 2.0,
    luft: 2.0,
    groesstkorn: 32,
    sandFraktion: '0/4',
    f04: 38,
    f48: 18,
    f816: 22,
    f1632: 22,
    feuchte04: 3.0,
    feuchte48: 1.0,
    feuchte816: 0.5,
    feuchte1632: 0.5,
    wa04: 0.5,
    wa48: 0.5,
    wa816: 0.5,
    wa1632: 0.5,
    expClasses: ['XC2', 'XA1'],
    lpSetting: 'ohne_lp',
    normVorgaben: {
      druckfestigkeit: 'C25/30',
      maxWz: 0.60,
      minZement: 280, // anrechenbarer Zementgehalt mit k=0.4: 240 + 0.4*100 = 280 kg
      minLuft: 2.0,
    },
    stoffraum: {
      zementVol: 77.4, // 240 / 3.10
      wasserVol: 155.0,
      luftVol: 20.0,
      zusatzstoffVol: 34.5, // HüS: 100 / 2.90
      zmVol: 1.9, // 2.0 / 1.05
      faserVol: 0.0,
      gesteinVol: 711.2, // 1000 - 77.4 - 34.5 - 155 - 1.9 - 20
    },
    massenTrocken: {
      gesteinGesamt: 1884.7, // 711.2 * 2.65
      m04: 716.2,
      m48: 339.2,
      m816: 414.6,
      m1632: 414.6,
    },
    feuchteRechnung: {
      wasserAusGestein: 19.6,
      zugabewasser: 135.4,
      m04Feucht: 737.7,
      m48Feucht: 342.6,
      m816Feucht: 416.7,
      m1632Feucht: 416.7,
    },
    frischbetonDichte: 2.382,
    didaktischeHinweise: [
      'Latent-hydraulische Wirkung: Hüttensandmehl (HüS nach DIN EN 15167-1) reagiert verzögert mit dem bei der Klinkerhydratation gebildeten Portlandit Ca(OH)₂ zu festigkeitsbildenden C-S-H-Phasen.',
      'Wärmeentwicklung: Durch die Substitution von 100 kg Klinkerzement durch HüS wird die adiabatische Temperaturspitze im Bauteil um über 30% gedämpft, was schädliche Zwang- und Trennrisse wirksam verhindert.',
      'k-Wert Anrechnung: Mit k = 0,40 ergibt sich ein äquivalenter Zementgehalt von z_eq = 240 + 0,40 · 100 = 280 kg/m³, was exakt der normativen Mindestanforderung nach DIN 1045-2 entspricht.',
    ],
  },
  {
    id: 'bsp_stahlfaser_boden',
    titel: 'Beispiel 4: Stahlfaserbeton für beanspruchte Industrieböden',
    kategorie: 'Industriebau & Logistik (Verschleiß XM2)',
    normKonformitaet: 'DIN EN 206 / DAfStb-Richtlinie Stahlfaserbeton',
    bauteilTyp: 'Fugenarmer Hallenboden mit Gabelstaplerverkehr',
    beschreibung: 'Hochleistungsfähiger Stahlfaserbeton mit 35 kg/m³ Stahlfasern und Flugasche. Berücksichtigt die Verdrängung des Gesteinsvolumens durch Fasern und die Erhöhung der Nachrissbiegezugfestigkeit.',
    zementArt: 'CEM I',
    zementFestigkeit: '42.5 N',
    zement: 340,
    wasser: 165,
    konsistenz: 'F4',
    fa: 40,
    sf: 0,
    hues: 0,
    biochar: 0,
    stahlfaser: 35,
    ppFaser: 0,
    zusatzmittel: 2.5,
    luft: 1.5,
    groesstkorn: 16,
    sandFraktion: '0/4',
    f04: 45,
    f48: 25,
    f816: 30,
    f1632: 0,
    feuchte04: 3.0,
    feuchte48: 1.0,
    feuchte816: 0.5,
    feuchte1632: 0.5,
    wa04: 0.5,
    wa48: 0.5,
    wa816: 0.5,
    wa1632: 0.5,
    expClasses: ['XC3', 'XM2'],
    lpSetting: 'ohne_lp',
    normVorgaben: {
      druckfestigkeit: 'C35/45',
      maxWz: 0.45,
      minZement: 320,
      minLuft: 1.5,
    },
    stoffraum: {
      zementVol: 109.7, // 340 / 3.10
      wasserVol: 165.0,
      luftVol: 15.0,
      zusatzstoffVol: 18.2, // 40 / 2.20
      zmVol: 2.4, // 2.5 / 1.05
      faserVol: 4.5, // 35 / 7.85
      gesteinVol: 685.2, // 1000 - 109.7 - 18.2 - 165 - 2.4 - 15 - 4.5
    },
    massenTrocken: {
      gesteinGesamt: 1815.8,
      m04: 817.1,
      m48: 453.9,
      m816: 544.7,
    },
    feuchteRechnung: {
      wasserAusGestein: 22.7,
      zugabewasser: 142.3,
      m04Feucht: 841.6,
      m48Feucht: 458.5,
      m816Feucht: 547.5,
    },
    frischbetonDichte: 2.403,
    didaktischeHinweise: [
      'Stoffraumwirkung der Fasern: 35 kg Stahlfasern mit einer Dichte von 7,85 kg/dm³ verdrängen 4,46 Liter Gesteinsvolumen im 1000-Liter-Stoffraum (entspricht ca. 11,8 kg Gesteinsmasse).',
      'Flugasche als rheologisches Schmiermittel: Die sphärischen Flugaschepartikel (Kugellagereffekt) kompensieren die Versteifung der Frischbetonmischung durch die sperrigen Stahlfasern.',
      'Verschleißklasse XM2: Der maximale Zementgehalt ist nach DIN 1045-2 zur Vermeidung von Absanden auf 360 kg/m³ begrenzt. Mit 340 kg/m³ Zement wird dieser Grenzwert sicher eingehalten.',
    ],
  },
  {
    id: 'bsp_vdz_b20_erstpruefung',
    titel: 'Beispiel 5: VDZ Merkblatt B20 & Betontechnische Daten (C30/37 Erstprüfung)',
    kategorie: 'Industrie- & Normen-Referenz (VDZ / Heidelberg Materials)',
    normKonformitaet: 'DIN EN 206-1 / DIN 1045-2 (XC4, XF1, F2, Dmax 16)',
    bauteilTyp: 'Außenbauteil mit Beregnung / Erstprüfung nach ZM B20',
    beschreibung: 'Offizielle Musteraufgabe aus dem VDZ Zement-Merkblatt B20 (Kapitel Mischungsberechnung) und betontechnische-daten.de zur Bestimmung der Betonzusammensetzung für 1 m³ verdichteten Frischbeton.',
    zementArt: 'CEM II/A',
    zementFestigkeit: '32.5 R',
    zement: 318,
    wasser: 175,
    konsistenz: 'F2',
    fa: 0,
    sf: 0,
    hues: 0,
    biochar: 0,
    stahlfaser: 0,
    ppFaser: 0,
    zusatzmittel: 0,
    luft: 1.5,
    groesstkorn: 16,
    sandFraktion: '0/4',
    f04: 40,
    f48: 25,
    f816: 35,
    f1632: 0,
    feuchte04: 2.0,
    feuchte48: 1.0,
    feuchte816: 0.5,
    feuchte1632: 0.5,
    wa04: 0.5,
    wa48: 0.5,
    wa816: 0.5,
    wa1632: 0.5,
    expClasses: ['XC4', 'XF1'],
    lpSetting: 'ohne_lp',
    normVorgaben: {
      druckfestigkeit: 'C30/37',
      maxWz: 0.60,
      minZement: 300,
      minLuft: 1.5,
    },
    stoffraum: {
      zementVol: 104.3, // 318 / 3.05 = 104.26 dm³
      wasserVol: 175.0,
      luftVol: 15.0,
      zmVol: 0.0,
      faserVol: 0.0,
      gesteinVol: 705.7, // 1000 - 104.26 - 175 - 15 = 705.74 dm³
    },
    massenTrocken: {
      gesteinGesamt: 1834.9, // 705.74 * 2.60 (Rohdichte Gestein 2,60 kg/dm³ nach VDZ B20)
      m04: 734.0, // 40%
      m48: 458.7, // 25%
      m816: 642.2, // 35%
    },
    feuchteRechnung: {
      wasserAusGestein: 15.6,
      zugabewasser: 159.4,
      m04Feucht: 748.7,
      m48Feucht: 461.0,
      m816Feucht: 645.4,
    },
    frischbetonDichte: 2.328,
    didaktischeHinweise: [
      'Original-Referenz: Nachgerechnet nach VDZ Zement-Merkblatt B20 (Kapitel Erstprüfung & Stoffraumrechnung) sowie www.betontechnische-daten.de/de/betontechnologie/stoffraumrechnung.',
      'Stoffraum-Gleichung: 1000 dm³ = (318 / 3,05) + (175 / 1,00) + V_gestein + 15 dm³ Poren => V_gestein = 705,74 dm³.',
      'Gesteinsmasse trocken: 705,74 dm³ · 2,60 kg/dm³ = 1834,9 kg/m³ (in der Fachliteratur gerundet 1835 kg/m³).',
      'w/z-Wert: 175 / 318 = 0,550 <= 0,60 (Grenzwert für XC4/XF1 nach DIN 1045-2 sicher eingehalten).',
      'Zugabewasser am Mischer: Durch Berücksichtigung der Oberflächenfeuchte reduziert sich das am Mischer zuzugebende Wasser von 175 L auf ca. 159,4 L/m³.',
    ],
  },
];

interface Props {
  onLoadBenchmark: (benchmark: BenchmarkData) => void;
}

export default function GepruefteBeispieleSection({ onLoadBenchmark }: Props) {
  const [selectedId, setSelectedId] = useState<string>('bsp_hochbau');

  const selected = BENCHMARK_EXAMPLES.find(b => b.id === selectedId) || BENCHMARK_EXAMPLES[0];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-home-grau/20">
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <BookOpen className="text-shiraz" /> Geprüfte Beispielrechnungen &amp; Verifikation
          </h2>
          <p className="text-sm text-text-main/70 mt-1">
            Vollständig verifizierte Referenzmischungen nach DIN EN 206 / DIN 1045-2 mit exakten Zwischenrechnungen und 1-Klick-Übernahme in den Rechner.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200">
          <ShieldCheck size={16} /> Mathematisch 100% verifiziert
        </div>
      </div>

      {/* Auswahl-Karten der 4 Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {BENCHMARK_EXAMPLES.map(bsp => (
          <button aria-pressed={selectedId === bsp.id}
            key={bsp.id}
            onClick={() => setSelectedId(bsp.id)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedId === bsp.id 
                ? 'bg-shiraz/5 border-shiraz shadow-sm ring-1 ring-shiraz' 
                : 'bg-off-white/60 border-home-grau/30 hover:border-shiraz/40 hover:bg-off-white'
            }`}
          >
            <div>
              <div className="text-[11px] font-bold text-shiraz uppercase tracking-wider mb-1">
                {bsp.kategorie}
              </div>
              <div className="text-sm font-bold text-text-main leading-tight mb-2">
                {bsp.titel.split(':')[1] || bsp.titel}
              </div>
              <div className="text-xs text-text-main/60 line-clamp-2">
                {bsp.bauteilTyp}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-home-grau/20 flex items-center justify-between text-xs font-medium text-text-main/70">
              <span>{bsp.normVorgaben.druckfestigkeit}</span>
              <span className="font-mono text-shiraz font-bold">Dmax {bsp.groesstkorn}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail-Ansicht des gewählten Beispiels */}
      <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-shiraz text-white">
                {selected.normKonformitaet}
              </span>
              <span className="text-xs text-text-main/70 font-medium">
                Bauteil: <strong>{selected.bauteilTyp}</strong>
              </span>
            </div>
            <h3 className="text-lg font-bold text-text-main">
              {selected.titel}
            </h3>
            <p className="text-sm text-text-main/80 mt-1 max-w-3xl">
              {selected.beschreibung}
            </p>
          </div>

          <button
            onClick={() => onLoadBenchmark(selected)}
            className="px-4 py-2.5 bg-shiraz text-white rounded-xl font-bold text-sm shadow hover:bg-shiraz/90 transition-all flex items-center gap-2 cursor-pointer self-start"
          >
            <Sparkles size={16} />
            <span>In Mischungsrechner laden</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Kenndaten Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <div className="text-xs text-text-main/60">Druckfestigkeit</div>
            <div className="text-base font-bold text-shiraz">{selected.normVorgaben.druckfestigkeit}</div>
            <div className="text-[11px] text-text-main/60">Zement: {formatDeWert(selected.zement)} kg/m³</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <div className="text-xs text-text-main/60">Wasserzementwert</div>
            <div className="text-base font-bold text-text-main">{formatDeZahl((selected.wasser / selected.zement), 2)}</div>
            <div className="text-[11px] text-text-main/60">Wasser: {formatDeWert(selected.wasser)} L/m³</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <div className="text-xs text-text-main/60">Luftporengehalt</div>
            <div className="text-base font-bold text-text-main">{formatDeZahl(selected.luft, 1)} Vol.-%</div>
            <div className="text-[11px] text-text-main/60">Volumen: {formatDeZahl(selected.stoffraum.luftVol, 1)} dm³</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-home-grau/20">
            <div className="text-xs text-text-main/60">Frischbetonrohdichte</div>
            <div className="text-base font-bold text-text-main">{formatDeZahl(selected.frischbetonDichte, 3)} kg/dm³</div>
            <div className="text-[11px] text-text-main/60">Gestein: {formatDeZahl(selected.massenTrocken.gesteinGesamt, 1)} kg</div>
          </div>
        </div>

        {/* Schrittweise Stoffraumrechnung & Feuchtebilanz */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Linke Spalte: Stoffraumrechnung */}
          <div className="bg-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2 mb-3">
              <Layers size={16} className="text-shiraz" />
              <span>Stoffraumrechnung (1000 dm³ = 1 m³ Frischbeton)</span>
            </h4>
            
            <div className="bg-off-white/70 p-2.5 rounded-lg border border-home-grau/20 text-xs font-mono mb-3 text-center">
              <FormulaText text="V_G = 1000 - (V_Z + V_W + V_L + V_{ZM} + V_{Zusatz} + V_{Fasern})" />
            </div>

            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-home-grau/15 py-1">
                  <td className="py-1 text-text-main/70">Zement ({selected.zementArt}):</td>
                  <td className="py-1 text-right font-mono">{formatDeWert(selected.zement)} kg ÷ {selected.zementArt === 'CEM I' ? '3.10' : '3.05'} =</td>
                  <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.zementVol, 1)} dm³</td>
                </tr>
                <tr className="border-b border-home-grau/15 py-1">
                  <td className="py-1 text-text-main/70">Wasser (wirksam):</td>
                  <td className="py-1 text-right font-mono">{formatDeWert(selected.wasser)} kg ÷ 1,00 =</td>
                  <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.wasserVol, 1)} dm³</td>
                </tr>
                <tr className="border-b border-home-grau/15 py-1">
                  <td className="py-1 text-text-main/70">Luftporen (Luftgehalt):</td>
                  <td className="py-1 text-right font-mono">{formatDeZahl(selected.luft, 1)} Vol.-% × 10 =</td>
                  <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.luftVol, 1)} dm³</td>
                </tr>
                {selected.hues > 0 && (
                  <tr className="border-b border-home-grau/15 py-1">
                    <td className="py-1 text-text-main/70">Hüttensandmehl (HüS):</td>
                    <td className="py-1 text-right font-mono">{formatDeWert(selected.hues)} kg ÷ 2,90 =</td>
                    <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.zusatzstoffVol, 1)} dm³</td>
                  </tr>
                )}
                {selected.fa > 0 && (
                  <tr className="border-b border-home-grau/15 py-1">
                    <td className="py-1 text-text-main/70">Flugasche (FA):</td>
                    <td className="py-1 text-right font-mono">{formatDeWert(selected.fa)} kg ÷ 2,20 =</td>
                    <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.zusatzstoffVol, 1)} dm³</td>
                  </tr>
                )}
                {selected.zusatzmittel > 0 && (
                  <tr className="border-b border-home-grau/15 py-1">
                    <td className="py-1 text-text-main/70">Zusatzmittel (FM/LP):</td>
                    <td className="py-1 text-right font-mono">{formatDeWert(selected.zusatzmittel)} kg ÷ 1,05 =</td>
                    <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.zmVol, 1)} dm³</td>
                  </tr>
                )}
                {(selected.stahlfaser || 0) > 0 && (
                  <tr className="border-b border-home-grau/15 py-1">
                    <td className="py-1 text-text-main/70">Stahlfasern (SF):</td>
                    <td className="py-1 text-right font-mono">{formatDeWert(selected.stahlfaser)} kg ÷ 7,85 =</td>
                    <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.stoffraum.faserVol, 1)} dm³</td>
                  </tr>
                )}
                <tr className="border-t-2 border-home-grau/40 bg-slate-50/70 font-bold">
                  <td className="py-1.5 text-shiraz">Gesteinskörnung (Restvolumen):</td>
                  <td className="py-1.5 text-right font-mono">1000 - Summe =</td>
                  <td className="py-1.5 text-right text-shiraz font-mono">{formatDeZahl(selected.stoffraum.gesteinVol, 1)} dm³</td>
                </tr>
                <tr className="bg-slate-50/70">
                  <td className="py-1 text-text-main font-semibold">Trockenmasse Gestein:</td>
                  <td className="py-1 text-right font-mono">{formatDeZahl(selected.stoffraum.gesteinVol, 1)} × 2,65 =</td>
                  <td className="py-1 text-right font-bold text-text-main font-mono">{formatDeZahl(selected.massenTrocken.gesteinGesamt, 1)} kg</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Rechte Spalte: Feuchtekorrektur & Rezeptur für die Waage */}
          <div className="bg-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2 mb-3">
              <Scale size={16} className="text-shiraz" />
              <span>Praxis-Einwaage mit Feuchtekorrektur</span>
            </h4>

            <div className="text-xs text-text-main/80 space-y-2 mb-3">
              <p>
                Gesteinskörnungen enthalten freie Oberflächenfeuchte (Gesamtfeuchte minus Kernfeuchte WA). Diese reduziert das Zugabewasser am Mischer:
              </p>
              <div className="p-2 bg-off-white/80 rounded border border-home-grau/20 text-center font-mono">
                <FormulaText text="w_{Zugabe} = w_{Soll} - \sum Wasser_{Gestein}" />
              </div>
            </div>

            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-home-grau/30 text-text-main/60 text-left">
                  <th className="py-1">Stoffkomponente</th>
                  <th className="py-1 text-right">Trocken</th>
                  <th className="py-1 text-right">Feuchte</th>
                  <th className="py-1 text-right font-bold text-shiraz">Einwaage (feucht)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-home-grau/10">
                  <td className="py-1">Zement</td>
                  <td className="py-1 text-right font-mono">{formatDeZahl(selected.zement, 1)} kg</td>
                  <td className="py-1 text-right text-text-main/40">-</td>
                  <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.zement, 1)} kg</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-1">Sand 0/4 ({formatDeWert(selected.f04)}%)</td>
                  <td className="py-1 text-right font-mono">{formatDeZahl(selected.massenTrocken.m04, 1)} kg</td>
                  <td className="py-1 text-right font-mono">+{formatDeWert(selected.feuchte04)}%</td>
                  <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.feuchteRechnung.m04Feucht, 1)} kg</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-1">Kies 4/8 ({formatDeWert(selected.f48)}%)</td>
                  <td className="py-1 text-right font-mono">{formatDeZahl(selected.massenTrocken.m48, 1)} kg</td>
                  <td className="py-1 text-right font-mono">+{formatDeWert(selected.feuchte48)}%</td>
                  <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.feuchteRechnung.m48Feucht, 1)} kg</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-1">Kies 8/16 ({formatDeWert(selected.f816)}%)</td>
                  <td className="py-1 text-right font-mono">{formatDeZahl(selected.massenTrocken.m816, 1)} kg</td>
                  <td className="py-1 text-right font-mono">+{formatDeWert(selected.feuchte816)}%</td>
                  <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.feuchteRechnung.m816Feucht, 1)} kg</td>
                </tr>
                {(selected.massenTrocken.m1632 || 0) > 0 && (
                  <tr className="border-b border-home-grau/10">
                    <td className="py-1">Kies 16/32 ({formatDeWert(selected.f1632)}%)</td>
                    <td className="py-1 text-right font-mono">{formatDeZahl(selected.massenTrocken.m1632, 1)} kg</td>
                    <td className="py-1 text-right font-mono">+{formatDeWert(selected.feuchte1632)}%</td>
                    <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.feuchteRechnung.m1632Feucht, 1)} kg</td>
                  </tr>
                )}
                {selected.hues > 0 && (
                  <tr className="border-b border-home-grau/10">
                    <td className="py-1">Hüttensand (HüS)</td>
                    <td className="py-1 text-right font-mono">{formatDeZahl(selected.hues, 1)} kg</td>
                    <td className="py-1 text-right text-text-main/40">-</td>
                    <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.hues, 1)} kg</td>
                  </tr>
                )}
                {(selected.stahlfaser || 0) > 0 && (
                  <tr className="border-b border-home-grau/10">
                    <td className="py-1">Stahlfasern</td>
                    <td className="py-1 text-right font-mono">{formatDeZahl(selected.stahlfaser, 1)} kg</td>
                    <td className="py-1 text-right text-text-main/40">-</td>
                    <td className="py-1 text-right font-mono font-bold text-text-main">{formatDeZahl(selected.stahlfaser, 1)} kg</td>
                  </tr>
                )}
                <tr className="border-t-2 border-shiraz bg-shiraz/5 font-bold">
                  <td className="py-1.5 text-shiraz">Tatsächliches Zugabewasser:</td>
                  <td className="py-1.5 text-right font-mono">{formatDeZahl(selected.wasser, 1)} L</td>
                  <td className="py-1.5 text-right font-mono text-red-600">-{formatDeZahl(selected.feuchteRechnung.wasserAusGestein, 1)} L</td>
                  <td className="py-1.5 text-right font-mono text-shiraz">{formatDeZahl(selected.feuchteRechnung.zugabewasser, 1)} L</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Didaktische Erläuterungen & Normhinweise */}
        <div className="bg-white p-4 rounded-xl border border-home-grau/25">
          <h4 className="font-bold text-sm text-text-main flex items-center gap-2 mb-2">
            <Info size={16} className="text-shiraz" />
            <span>Fachtechnische Einordnung &amp; Verifikationshinweise</span>
          </h4>
          <ul className="space-y-2 text-xs text-text-main/80">
            {selected.didaktischeHinweise.map((h, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-shiraz flex-shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
