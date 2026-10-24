import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import { Layers, BookOpen, CheckCircle2, Lightbulb, BadgeCheck, AlertTriangle, ShieldCheck, Settings, Compass, Calculator } from 'lucide-react';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import { DaemmungBerater } from '@/src/components/DaemmungBerater';

interface InsulationProduct {
  name: string;
  abbreviation: string;
  standard: string;
  lambdaRange: string;
  density: string;
  vaporResistance: string;
  fireClass: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  applications: string[];
}

const mineralInsulation: InsulationProduct[] = [
  {
    name: 'Glaswolle (Mineralwolle)',
    abbreviation: 'GW',
    standard: 'DIN EN 13162',
    lambdaRange: '0,032 - 0,045',
    density: '15 - 30 kg/m³',
    vaporResistance: 'μ = 1',
    fireClass: 'A1 / A2 (nicht brennbar)',
    description: 'Weiches, elastisches Vlies aus recyceltem Glas, Sand und Bindemitteln. Bietet hervorragende akustische Dämpfung, thermischen Schutz und optimalen Einbau durch Kompression.',
    advantages: ['Sehr leicht und hochkomprimierbar', 'Gute Schallabsorption, nichtbrennbar (A1/A2)', 'Kosteneffizienter Standardbaustoff'],
    disadvantages: ['Geringe Eigensteifigkeit und Druckfestigkeit', 'Empfindlich gegen Feuchtigkeitseintrag', 'Staubentwicklung bei Zuschnitt (Haut- und Atemschutz erforderlich)'],
    applications: ['Zwischensparrendämmung im Steildach', 'Holzrahmenbau-Gefachdämmung', 'Trennwände im Trockenbau']
  },
  {
    name: 'Steinwolle (Mineralwolle)',
    abbreviation: 'SW',
    standard: 'DIN EN 13162',
    lambdaRange: '0,034 - 0,045',
    density: '30 - 180 kg/m³',
    vaporResistance: 'μ = 1',
    fireClass: 'A1 (nicht brennbar, Schmelzpunkt > 1000°C)',
    description: 'Robuste Mineralfaser aus vulkanischem Gestein. Wegen des hohen Schmelzpunkts (> 1000 °C) wichtig für den baulichen Brandschutz.',
    advantages: ['Höchstzulässiger Brandschutz (Schmelzpunkt > 1000 °C)', 'Formbeständig, alterungs- und verrottungsresistent', 'Hohe Druckfestigkeit als Plattenware verfügbar'],
    disadvantages: ['Höheres Eigengewicht als Glaswolle', 'Etwas höhere Materialkosten als Glaswolle', 'Erhöhter Energieaufwand bei der Herstellung (Kuppelofenschmelze)'],
    applications: ['Flachdachdämmung', 'Wärmedämmverbundsysteme (WDVS)', 'Brandsperren in Fassaden', 'Haustechnik / Rohrschalen']
  },
  {
    name: 'Schaumglas (Kompaktdach-Dämmung)',
    abbreviation: 'CG',
    standard: 'DIN EN 13167',
    lambdaRange: '0,036 - 0,050',
    density: '100 - 165 kg/m³',
    vaporResistance: 'μ = ∞ (absolut dampf- und diffusionsdicht)',
    fireClass: 'A1 (nicht brennbar)',
    description: 'Geschlossenzelliger Dämmstoff aus aufgeschäumtem (Recycling-)Glas. Wasser- und dampfdicht, dauerhaft formstabil.',
    advantages: ['Sehr druckfest, praktisch ohne Kriechverformung', 'Wasser- und dampfdicht', 'Resistent gegen Nagetiere, Säuren, Radon und Lösungsmittel'],
    disadvantages: ['Spröde (Bruchgefahr bei mangelhaftem Transport)', 'Kaltverklebung mit Bitumensystemen erforderlich', 'Sehr hohes Preisniveau'],
    applications: ['Perimeterdämmung im Grundwasserbereich', 'Flachdächer (Kompaktdach-Systeme)', 'Lastabtragende Gründungsplatten', 'Industrie- und Kälteanlagen']
  },
  {
    name: 'Calciumsilikat (Klimaplatte)',
    abbreviation: 'CS',
    standard: 'DIN EN 14306 / ETA',
    lambdaRange: '0,055 - 0,070',
    density: '200 - 300 kg/m³',
    vaporResistance: 'μ = 3 - 6 (extrem atmungsaktiv)',
    fireClass: 'A1 (nicht brennbar)',
    description: 'Mineralische Platte aus Calciumsilikat (Kalk, Quarz, Zellulosefasern) mit sehr hohem Porenvolumen. Kapillaraktiv – Grundlage für Innendämmung ohne Dampfbremse.',
    advantages: ['Hohe Kapillaraktivität (verteilt Feuchte)', 'Schimmelpilzinhibierend durch hohe Alkalität (pH-Wert ~10)', 'Innendämmung ohne zusätzliche Dampfbremse möglich'],
    disadvantages: ['Mäßige Wärmeleitfähigkeit (erfordert größere Schichtdicken)', 'Stoßempfindlich und mechanisch gering belastbar', 'Flankendämmung und Spezialkleber zwingend erforderlich'],
    applications: ['Innendämmung historischer Fassaden', 'Schimmelsanierung und Feuchtigkeitspflege', 'Laibungsdämmung']
  },
  {
    name: 'Blähperlit (Vulkanisches Granulat)',
    abbreviation: 'EP',
    standard: 'DIN EN 13169',
    lambdaRange: '0,040 - 0,050',
    density: '70 - 150 kg/m³',
    vaporResistance: 'μ = 2 - 5',
    fireClass: 'A1 (nicht brennbar)',
    description: 'Perlitgestein (vulkanisches Glas mit gebundenem Wasser), durch kurzes Erhitzen auf das 15- bis 20-fache Volumen gebläht. Mineralischer, poröser Schütt- und Dämmstoff.',
    advantages: ['Reiner Naturbaustoff ohne Bindemittel', 'Fäulnis-, ungeziefer- und temperaturbeständig', 'Ausgezeichnete Hohlraumfüllung (schüttfähig)'],
    disadvantages: ['Setzungsneigung bei ungenügender Verdichtung', 'Wasseraufnahmekapazität erhöht (Trockenhaltung nötig)', 'Geringe Eigenfestigkeit'],
    applications: ['Kerndämmung im zweischaligen Mauerwerk', 'Estrichtrockenschüttung', 'Schornstein-Hinterfüllungen']
  },
  {
    name: 'Blähton (Leca-Schüttgut)',
    abbreviation: 'LE',
    standard: 'DIN EN 13055',
    lambdaRange: '0,080 - 0,160',
    density: '200 - 800 kg/m³',
    vaporResistance: 'μ = 2',
    fireClass: 'A1 (nicht brennbar)',
    description: 'Blähende Tone, die im Drehrohrofen bei ca. 1200 °C gebrannt werden. Die Kugelkörner besitzen ein hochporisiertes Inneres und eine feste Außenhaut.',
    advantages: ['Druckstabil', 'Verrottungsfest und frostbeständig', 'Leicht hydraulisch stabilisierbar'],
    disadvantages: ['Mäßige Wärmedämmwirkung (hohe Lambda-Werte)', 'Hohe Schüttdicken für Norm-U-Werte erforderlich'],
    applications: ['Lastabtragende Dämmschüttungen unter Bodenplatten', 'Ausgleichsschüttungen auf Massivdecken', 'Leichtbetonzuschlag']
  }
];

const syntheticInsulation: InsulationProduct[] = [
  {
    name: 'Expandiertes Polystyrol (EPS)',
    abbreviation: 'EPS',
    standard: 'DIN EN 13163',
    lambdaRange: '0,031 - 0,040',
    density: '15 - 35 kg/m³',
    vaporResistance: 'μ = 20 - 100',
    fireClass: 'Schwerentflammbar (B1 / Euroklasse E)',
    description: 'Leichter, geschlossenzelliger Partikelschaum aus vorgeschäumten Polystyrolperlen. Der wirtschaftliche Klassiker in der Außenwand-WDVS-Dämmung.',
    advantages: ['Kostengünstig und einfach zuzuschneiden', 'Sehr geringes Eigengewicht', 'Form- und maßstabil bei sachgerechter Anwendung'],
    disadvantages: ['Thermoplastisches Brandverhalten (schmilzt brennend ab)', 'UV-empfindlich (Zersetzung der Oberfläche bei Sonneneinstrahlung)', 'Nicht für den dauerhaften Erdreich- oder Wasserkontakt geeignet'],
    applications: ['Wärmedämmverbundsysteme (WDVS)', 'Estrich- und Trittschalldämmung', 'Zweischaliges Mauerwerk (Kerndämmung)']
  },
  {
    name: 'Extrudiertes Polystyrol (Styrodur)',
    abbreviation: 'XPS',
    standard: 'DIN EN 13164',
    lambdaRange: '0,032 - 0,040',
    density: '30 - 45 kg/m³',
    vaporResistance: 'μ = 80 - 250',
    fireClass: 'Schwerentflammbar (B1 / Euroklasse E)',
    description: 'Geschlossenzelliger, stranggepresster Schaumstoff. Glatte Schäumhaut, sehr geringe Wasseraufnahme.',
    advantages: ['Hohe Druckfestigkeit (je nach Typ bis ca. 700 kPa bei 10 % Stauchung)', 'Wasserunempfindlich und verrottungsfest', 'Frost-Tau-Wechsel-beständig im direkten Erdreichkontakt'],
    disadvantages: ['Recycling erschwert (Altbestände mit HBCD-Flammschutz)', 'Geringer Beitrag zum Schallschutz', 'Hochempfindlich gegenüber organischen Lösungsmitteln'],
    applications: ['Perimeterdämmung (erdberührte Kellerwände)', 'Umkehrdach (über der Dachabdichtungsbahn)', 'Lastabtragende Bodendämmung unter Fundamentplatten']
  },
  {
    name: 'Polyurethan / Polyisocyanurat',
    abbreviation: 'PU / PIR',
    standard: 'DIN EN 13165',
    lambdaRange: '0,022 - 0,028',
    density: '30 - 40 kg/m³',
    vaporResistance: 'μ = 40 - 200 (Alukaschiert = ∞)',
    fireClass: 'Normal- bis schwerentflammbar (B2 / Euroklasse E-C)',
    description: 'Duroplastischer Hartschaum mit sehr niedriger Wärmeleitfähigkeit – geringe Dämmdicken möglich.',
    advantages: ['Sehr niedrige Wärmeleitfähigkeit', 'Temperaturbeständig (verträgt heißen Bitumenaufrag)', 'Sehr druckfest und dimensionsstabil'],
    disadvantages: ['Hoher Primärenergieaufwand bei der Synthese', 'Keine elastische Schallabsorption', 'Recycling schwierig (Verbund mit Deckschichten)'],
    applications: ['Aufsparrendämmung am Steildach (Vollflächendämmung)', 'Flachdächer', 'Sandwichplatten für Industriefassaden', 'Fußbodenheizungsträger']
  },
  {
    name: 'Phenolharzschaum (Resolharz-Dämmplatte)',
    abbreviation: 'PF',
    standard: 'DIN EN 13166',
    lambdaRange: '0,020 - 0,024',
    density: '35 - 50 kg/m³',
    vaporResistance: 'μ = 25 - 50',
    fireClass: 'Schwerentflammbar (Euroklasse C-s1, d0 / B1)',
    description: 'Geschlossenzelliger Duroplast aus Resol-Phenolharz mit sehr niedriger Wärmeleitfähigkeit und günstigem Brandverhalten.',
    advantages: ['Sehr niedrige Wärmeleitfähigkeit (λ ab ca. 0,021 W/(mK))', 'Hervorragendes Brandverhalten (geringe Glimmgefahr, kein brennendes Abtropfen)', 'Schlanke WDVS-Aufbauten möglich'],
    disadvantages: ['Sehr spröde und empfindlich gegen Stöße', 'Darf keiner dauerhaften Nässeeinwirkung ausgesetzt werden', 'Hoher Marktpreis'],
    applications: ['Superschlanke Hochleistungs-WDVS-Fassaden', 'Laibungs- und Fassadennischendämmungen', 'Balkondecken- und Loggienelemente']
  },
  {
    name: 'Polyethylen-Schaumstoff (Rohrisolierung)',
    abbreviation: 'PE',
    standard: 'DIN EN 14313',
    lambdaRange: '0,035 - 0,045',
    density: '25 - 45 kg/m³',
    vaporResistance: 'μ = 1000 - 4000 (sehr dampfdicht)',
    fireClass: 'Normal-/Schwerentflammbar (Euroklasse E / B2)',
    description: 'Flexibler, geschlossenzelliger Schaumstoff zur Rohrleitungsdämmung, Schallwellenentkopplung und Verhinderung von Tauwasserausfall an kalten Oberflächen.',
    advantages: ['Hochelastisch und einfach über Rohrkrümmungen ziehbar', 'Ausgezeichnet dampfdicht (schützt vor Kondensatkorrosion)', 'Kostengünstig und zähelastisch'],
    disadvantages: ['Geringe Temperaturbeständigkeit (maximal 95-100 °C)', 'Brandverhalten ungeeignet für Hochtemperatureinsätze'],
    applications: ['Wärme- und Kältedämmung von Heizungs- und Trinkwasserrohren', 'Randdämmstreifen bei der Estrichverlegung']
  }
];

const ecologicalInsulation: InsulationProduct[] = [
  {
    name: 'Holzfaser-Dämmplatten',
    abbreviation: 'WF',
    standard: 'DIN EN 13171',
    lambdaRange: '0,038 - 0,050',
    density: '40 - 270 kg/m³',
    vaporResistance: 'μ = 3 - 10 (äußerst diffusionsoffen)',
    fireClass: 'Normalentflammbar (B2 / Euroklasse E)',
    description: 'Nachwachsender Dämmstoff aus zerkleinerten Nadelhölzern, im Nass- oder Trockenverfahren verpresst. Verbreiteter nachwachsender Dämmstoff mit gutem sommerlichem Wärmeschutz.',
    advantages: ['Überragende spezifische Wärmekapazität (c ≈ 2100 J/kgK)', 'Hervorragender sommerlicher Hitzeschutz durch Phasenverschiebung', 'Hygroskopisch wirksam (speichert Feuchte schadensfrei)', 'Hohe CO2-Speicherleistung im Bauteil'],
    disadvantages: ['Erhöhte Wärmeleitfähigkeit erfordert größere Bauteildicken', 'Hohes spezifisches Eigengewicht beansprucht Tragwerk stärker', 'Spürbarer Preisaufschlag gegenüber Mineralwolle oder EPS'],
    applications: ['Unterdeckung und Aufsparrendämmung am Steildach', 'Putzträgerplatten ökologischer Massivholz-WDVS', 'Gefachdämmung (als flexible Matten)']
  },
  {
    name: 'Zellulosefaser (Einblasdämmstoff)',
    abbreviation: 'CI',
    standard: 'DIN EN 15101-1',
    lambdaRange: '0,037 - 0,045',
    density: '30 - 65 kg/m³',
    vaporResistance: 'μ = 1 - 2',
    fireClass: 'Schwerentflammbar (B1 / Euroklasse B-d0 / D)',
    description: 'Gewonnen durch mechanische Zerfaserung von Altpapier (Zeitungspapier), versetzt mit Zusätzen (z. B. Borsalze, Ammoniumphosphat/-sulfat) für Brandschutz und Schutz gegen Schimmel und Schädlinge.',
    advantages: ['Fugenlose und hohlraumfreie Ausflockung komplexer Geometrien', 'Gute Wärmespeicherfähigkeit für den sommerlichen Wärmeschutz', 'Hervorragende Schallschutzeigenschaften', 'Herausragend niedrige Primärenergiebilanz'],
    disadvantages: ['Setzungsgefahr bei unzureichendem Einblasdruck (Fachbetriebspflicht)', 'Nicht für direkte Nässe geeignet', 'Staubentwicklung beim Einblasprozess'],
    applications: ['Dachschrägen-Gefachdämmung', 'Einblasdämmung in Holztafelkonstruktionen und Holzbalkendecken', 'Frei liegende Deckenschüttung']
  },
  {
    name: 'Hanffaser (Klemmdämmstoff)',
    abbreviation: 'HF',
    standard: 'DIN EN 13171',
    lambdaRange: '0,039 - 0,045',
    density: '30 - 45 kg/m³',
    vaporResistance: 'μ = 1 - 2',
    fireClass: 'Normalentflammbar (B2 / Euroklasse E)',
    description: 'Biegsame Platten aus zähen Bastfasern der Hanfpflanze. Im Trockenverfahren unter Einmischung hitzeaktivierter Stützfasern (Copolyester) zu elastischen Dämmmatten verarbeitet.',
    advantages: ['Sehr hohe Reißfestigkeit und elastischer Klemmeffekt', 'Geringe Anfälligkeit für Schimmel und Schädlinge (Herstellerangabe)', 'Ausgezeichnete Feuchteregulation ohne Strukturverlust'],
    disadvantages: ['Schwerer zuzuschneiden als Mineralwollen (Spezialsägen nötig)', 'Nur in trocken bleibenden Bauteilbereichen einsetzen'],
    applications: ['Zwischensparrendämmung im Steildach', 'Gefachdämmung im Holzrahmenbau', 'Schallentkopplung unter Dielen']
  },
  {
    name: 'Baustroh / Strohballen (Stroh)',
    abbreviation: 'ST',
    standard: 'ETA-17/0559 / Allgemeingültige Zulassung',
    lambdaRange: '0,042 - 0,048',
    density: '85 - 110 kg/m³',
    vaporResistance: 'μ = 1 - 2',
    fireClass: 'Normalentflammbar (Euroklasse E / B2; verputzt F30-F90)',
    description: 'Unbehandeltes Weizen-, Roggen- oder Dinkelstroh, das zu quaderförmigen Ballen gepresst wird. Speichert biogenen Kohlenstoff, sehr geringer Herstellungsaufwand.',
    advantages: ['Sensationelle Ökobilanz und CO2-Speicherung', 'Schnittfester, dichter Gefacheinbau', 'Hervorragender sommerlicher Überhitzungsschutz'],
    disadvantages: ['Sehr hohe Einbaustärke erforderlich', 'Feuchtigkeitsüberwachung während der Bauphase zwingend', 'Einsatz nach Verwendbarkeitsnachweis, meist im Holzbau'],
    applications: ['Ausfachung und Dämmung im Strohballen-Holzbau', 'Wand- und Deckenfüllungen']
  },
  {
    name: 'Expandierter Kork (Korkplatten)',
    abbreviation: 'ICB',
    standard: 'DIN EN 13170',
    lambdaRange: '0,037 - 0,045',
    density: '100 - 150 kg/m³',
    vaporResistance: 'μ = 5 - 15',
    fireClass: 'Normalentflammbar (B2 / Euroklasse E)',
    description: 'Granulierte Rinde der Korkeiche. Wird unter Heißdampf expandiert; korkeigene Harze binden die Körner ohne Zusatzbindemittel.',
    advantages: ['Wenig feuchteempfindlich und fäulnisresistent', 'Sehr gut alterungsbeständig und druckbelastbar', 'Ohne Zusatzbindemittel'],
    disadvantages: ['Begrenzte Marktkapazitäten und weite Lieferwege', 'Sehr hochpreisiger ökologischer Baustoff'],
    applications: ['Perimeterdämmung im Erdbodenbereich (ökologisch)', 'Aufsparren- und Flachdachdämmung', 'Trittschallschutz unter Estrich']
  },
  {
    name: 'Schafschurwolle (Tierischer Dämmstoff)',
    abbreviation: 'AL',
    standard: 'ETA Zulassung / Konformität',
    lambdaRange: '0,035 - 0,042',
    density: '20 - 45 kg/m³',
    vaporResistance: 'μ = 1 - 2',
    fireClass: 'Normalentflammbar (B2 / Euroklasse E, entzündet sich schwer)',
    description: 'Gewaschene Schafschurwolle, die mithilfe von textilen Stützfasern vernadelt wird. Kann Formaldehyd aus der Raumluft binden (Untersuchungen/Herstellerangaben).',
    advantages: ['Bindet Formaldehyd an das Keratin der Faser', 'Kann bis zu 33% des Eigengewichts an Feuchte binden ohne Dämmungsverlust', 'Nachwachsender Rohstoff'],
    disadvantages: ['Mottenschutz erforderlich (Mittel produktabhängig)', 'Teure Beschaffung'],
    applications: ['Gefachdämmung in Decken und Wänden', 'Sanierung kontaminierter Innenräume (Raumluftfilter)', 'Fugenbeidämmung']
  },
  {
    name: 'Seegras (Zostera / Marine Dämmfaser)',
    abbreviation: 'SG',
    standard: 'Zulassung (abZ) / ETA',
    lambdaRange: '0,039 - 0,043',
    density: '60 - 85 kg/m³',
    vaporResistance: 'μ = 1 - 2',
    fireClass: 'Normalentflammbar (Euroklasse E / B2)',
    description: 'Naturbelassene Meeresfasern des Seegrases (Zostera marina), am Strand getrocknet und mechanisch von Sandresten gereinigt. Keine Zusätze nötig.',
    advantages: ['Salzhaltig, dadurch wenig anfällig für Schimmel und Schädlinge (Herstellerangabe)', 'Schwer entflammbar ohne Brandschutzchemikalien', 'Wenig feuchteempfindlich'],
    disadvantages: ['Kann nur als Schüttgut oder Einblasfaser eingebracht werden', 'Verarbeitung erfordert Erfahrung und Spezialgeräte'],
    applications: ['Dachschrägengefeche', 'Hohlraumschüttung in Balkenlagen und Decken', 'Einblasdämmung']
  }
];

const highPerformanceInsulation: InsulationProduct[] = [
  {
    name: 'Vakuum-Isolations-Paneele',
    abbreviation: 'VIP',
    standard: 'Allgemeine bauaufsichtliche Zulassung (abZ)',
    lambdaRange: '0,004 - 0,008',
    density: '180 - 250 kg/m³',
    vaporResistance: 'μ = ∞ (versiegelter Aluminiumfolienmantel)',
    fireClass: 'Schwerentflammbar (Euroklasse B oder E)',
    description: 'Evakuierter Kern aus pyrogener Kieselsäure, umhüllt und gasdicht verschweißt in einer Hochbarrierefolie. Verhindert Gaskonvektion fast gänzlich.',
    advantages: ['Sehr hohe Dämmwirkung (λ im Kern ca. 0,004–0,005, Bemessungswert nach Zulassung ca. 0,007–0,008 W/(mK))', 'Sehr geringe Aufbaudicken (Sanierung, Platznot)', 'Etwa fünfmal schlanker als EPS'],
    disadvantages: ['Darf nicht durchbohrt, geschnitten oder beschädigt werden', 'Vakuumverlust bei Perforation führt zu sofortigem Lambda-Anstieg auf ca. 0,020 W/mK', 'Aufwendige Maß- und Vorplanung zwingend erforderlich'],
    applications: ['Balkone und barrierefreie Dachterrassenübergänge', 'Laibungsdämmung bei Minimalabständen', 'Kältebrücken-Sondersanierung']
  },
  {
    name: 'Aerogel-Vliesmatten',
    abbreviation: 'AG',
    standard: 'ETA Zulassung / Konformität',
    lambdaRange: '0,013 - 0,018',
    density: '120 - 150 kg/m³',
    vaporResistance: 'μ = 5 (hoch diffusionsoffen)',
    fireClass: 'A2 (nicht brennbar, raucharm)',
    description: 'Amorphes Silika-Nanogel, das in stabile Textilfaser- oder Glasfaservliesmatten eingeschmolzen wird. Die Nanoporen unterdrücken die Wärmeleitung des Gases (Knudsen-Effekt).',
    advantages: ['Höchster Dämmwert aller diffusionsoffenen und flexiblen Matten', 'Hydrophober Charakter bei gleichzeitiger Atmungsaktivität', 'Biegbar und formbar für Rundungen'],
    disadvantages: ['Sehr starke Feinstaubentwicklung beim manuellen Zuschnitt', 'Hoher Preis', 'Aufwändige Befestigungssysteme'],
    applications: ['Innendämmung bei denkmalgeschützten Fassaden', 'Heizkörpernischenbehebung', 'Laibungen und dekorative Rundbögen']
  }
];

export default function BpDaemmung() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation' | 'berater'>('allgemein');
  const [selectedProduct, setSelectedProduct] = useState<InsulationProduct>(mineralInsulation[0]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Wärmedämmstoffe im Hochbau (Bauprodukte)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
          <p>
            Systematische Gegenüberstellung, physikalische Kennwerte und bauaufsichtliche Klassifikationen mineralischer, synthetischer und biobasierter Dämmelemente zur Vermeidung von Wärmebrücken und Tauwasserausfall.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button aria-pressed={activeTab === 'allgemein'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Basiswissen &amp; Kennwerte
          </button>
          <button aria-pressed={activeTab === 'praxis'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={16} /> Praxisbeispiele &amp; Schadensbilder
          </button>
          <button aria-pressed={activeTab === 'innovation'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'innovation' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('innovation')}
          >
            <Lightbulb size={16} /> Zukunftstrends &amp; Zirkularität
          </button>
          <button aria-pressed={activeTab === 'berater'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'berater' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('berater')}
          >
            <Calculator size={16} /> Interaktiver Dämmstoff-Berater
          </button>
        </div>

        {activeTab === 'allgemein' ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* IN-DEPTH PHYSICAL PARAMETERS & PRODUCT SELECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Product Selector Left Column */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Katalog herstellerneutraler Dämmstoffe:</span>
                
                {/* Mineral Section */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider flex items-center gap-1">
                    <Compass size={11} className="text-slate-400" /> 1. Anorganisch / Mineralisch
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {mineralInsulation.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => setSelectedProduct(prod)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                          selectedProduct.name === prod.name
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{prod.name} (<strong>{prod.abbreviation}</strong>)</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedProduct.name === prod.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{prod.lambdaRange}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Synthetic Section */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider flex items-center gap-1">
                    <Settings size={11} className="text-slate-400" /> 2. Petrochemisch / Synthetisch
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {syntheticInsulation.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => setSelectedProduct(prod)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                          selectedProduct.name === prod.name
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{prod.name} (<strong>{prod.abbreviation}</strong>)</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedProduct.name === prod.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{prod.lambdaRange}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ecological Section */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider flex items-center gap-1">
                    <BadgeCheck size={11} className="text-slate-400" /> 3. Nachwachsende Rohstoffe (Biobasiert)
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {ecologicalInsulation.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => setSelectedProduct(prod)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                          selectedProduct.name === prod.name
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{prod.name} (<strong>{prod.abbreviation}</strong>)</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedProduct.name === prod.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{prod.lambdaRange}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* High Performance Section */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={11} className="text-slate-400" /> 4. Hochleistungs- &amp; Sondermaterialien
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {highPerformanceInsulation.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => setSelectedProduct(prod)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                          selectedProduct.name === prod.name
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{prod.name} (<strong>{prod.abbreviation}</strong>)</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedProduct.name === prod.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{prod.lambdaRange}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical Factsheet Display Right Column */}
              <div className="lg:col-span-7 bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="border-b border-home-grau/20 pb-3 mb-4 flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Normatives Stoffdatenblatt</span>
                      <h3 className="text-lg font-bold text-text-main mt-1">{selectedProduct.name} - Typ {selectedProduct.abbreviation}</h3>
                    </div>
                    <div className="bg-white px-2.5 py-1 rounded border border-slate-200 text-right">
                      <span className="text-[9px] text-slate-400 block font-bold font-mono">PRODUKTNORM</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{selectedProduct.standard}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal mb-5">
                    {selectedProduct.description}
                  </p>

                  {/* Scientific Properties Block */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">λ_D [W/(m·K)]</span>
                      <span className="text-sm font-black text-slate-700 font-mono">{selectedProduct.lambdaRange}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Rohdichte (ρ)</span>
                      <span className="text-xs font-bold text-slate-700 font-mono">{selectedProduct.density}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Dampf (μ)</span>
                      <span className="text-xs font-bold text-slate-700 font-mono">{selectedProduct.vaporResistance}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Brandschutz</span>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight block truncate" title={selectedProduct.fireClass}>
                        {selectedProduct.fireClass.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Advantages, Risks & Installation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <BadgeCheck size={12} className="text-emerald-600" /> Materialstärken:
                      </span>
                      <ul className="space-y-1">
                        {selectedProduct.advantages.map((adv, i) => (
                          <li key={i} className="text-xxs text-text-main/70 flex gap-1.5 items-start">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle size={12} className="text-amber-600" /> Schwachstellen &amp; Gefahren:
                      </span>
                      <ul className="space-y-1">
                        {selectedProduct.disadvantages.map((dis, i) => (
                          <li key={i} className="text-xxs text-text-main/70 flex gap-1.5 items-start">
                            <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                            <span>{dis}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Typical Installation Use Cases */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 mt-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Standardisierte Einsatzgebiete (Baupraxis):</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.applications.map((app, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* LEGISLATIVE CONTEXT - GEG REQUIREMENTS (GEBÄUDEENERGIEGESETZ) */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-4">
              <h3 className="font-extrabold text-sm text-text-main mb-3 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <ShieldCheck className="text-shiraz" size={18} /> Gesetzliche Anforderungen &amp; Maximale U-Werte (GModG, vormals GEG)
              </h3>
              <p className="text-xs text-text-main/70 leading-relaxed mb-4">
                Das GModG (bis Juli 2026: Gebäudeenergiegesetz, GEG) regelt die energetischen Anforderungen an Neubauten und an Änderungen im Bestand. Die folgenden Höchstwerte stammen aus Anlage 7 GModG (inhaltlich unverändert aus dem GEG übernommen; Anforderung nach § 36). Wird ein Bauteil um mehr als 10% flächenmäßig verändert (z. B. Neuer Putz bei Fassadendämmung), gelten folgende Grenzwerte für den maximal zulässigen Wärmedurchgangskoeffizienten (<InlineMath math="U" />):
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-medium">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Außenwände (Sanierung)</span>
                  <span className="text-sm font-mono font-black text-slate-800">U_max = 0,24 W/(m²K)</span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal mt-1">Dicke bei WLG 035: ca. 12-14 cm</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Steildach / Sparren</span>
                  <span className="text-sm font-mono font-black text-slate-800">U_max = 0,24 W/(m²K)</span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal mt-1">Anlage 7 Nr. 5a/5b; Dicke bei WLG 035: ca. 14–16 cm</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Flachdach (Erneuerung der Abdichtung)</span>
                  <span className="text-sm font-mono font-black text-slate-800">U_max = 0,20 W/(m²K)</span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal mt-1">Wegen Gefälle oft asymmetrisch aufgebaut</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Kellerdecke (unbeheizt/erd)</span>
                  <span className="text-sm font-mono font-black text-slate-800">U_max = 0,30 W/(m²K)</span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal mt-1">Dicke bei WLG 035: ca. 10 cm</p>
                </div>
              </div>
            </div>

            {/* INHERENT COMPONENT ACCENTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="space-y-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">WÄRMEBRÜCKEN (DETAILPUNKTE)</span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  Wärmebrücken sind lokale thermische Störstellen (z.B. Deckenauflager, Balkonplatten ohne Entkopplung, Rollladenkästen), an denen Wärme schneller austritt als durch angrenzende gedämmte Bauteile. Das Absenken der raumseitigen Oberflächentemperatur führt unweigerlich zu Kondensationsfeuchte und in Folge zu Schimmelpilzbefall.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">LUFTDICHTIGKEIT &amp; DIFFUSION</span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  Nach DIN 4108-7 ist die Gebäudehülle dauerhaft luftundurchlässig auszuführen. Warme Innenraumluft trägt enorme m³ Feuchtmengen in sich. Tritt diese unkontrolliert durch Undichtigkeiten in Dämmschichten (z.B. gerissene Dampfbremse), kühlt sie ab. Das ausfallende flüssige Kondensat zersetzt Holzkonstruktionen und zerstört die Wärmedämmwirkung völlig.
                </p>
              </div>
            </div>

            {/* Normative Anwendungstypen & Systemklassen (Herstellerneutral) */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm bg-slate-50/50">
              <h3 className="font-bold text-home-prim text-base mb-2 flex items-center gap-2">Normative Anwendungstypen nach DIN 4108-10 &amp; Systemklassen</h3>
              <p className="text-xs text-text-main/60 mb-4 italic">
                Die nachfolgende Systematisierung erörtert normgerechte Kurzzeichen für Dämmstoffe im Hochbau nach DIN 4108-10 zur herstellerneutralen Spezifikation und Ausschreibung.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-normal">
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1.5">
                  <span className="font-bold text-slate-800 block">Dachdämmungen (Typen DAD, DAA, DZ, DI)</span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed">
                    <strong>DAD:</strong> Außendämmung unter Deckung (z.B. Aufsparrendämmung). <br />
                    <strong>DAA:</strong> Außendämmung unter Abdichtung (z.B. klassisches Flachdach). <br />
                    <strong>DZ:</strong> Zwischensparrendämmung (Gefachdämmung ohne Druckbelastung). <br />
                    <strong>DI:</strong> Innendämmung unter der Decke/Dachkonstruktion.
                  </p>
                </div>
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1.5">
                  <span className="font-bold text-slate-800 block">Wand- &amp; Fassadendämmungen (Typen WAP, WAB, WZ, WI)</span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed">
                    <strong>WAP:</strong> Außendämmung der Wand unter Putz (klassische WDVS-Fassade). <br />
                    <strong>WAB:</strong> Außendämmung hinter Bekleidung (z.B. vorgehängte hinterlüftete Fassade - VHF). <br />
                    <strong>WZ:</strong> Dämmung von zweischaligen Wänden (Kerndämmung). <br />
                    <strong>WI:</strong> Innendämmung der Wand.
                  </p>
                </div>
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1.5">
                  <span className="font-bold text-slate-800 block">Decken- &amp; Estrichdämmungen (Typen DEO, DES)</span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed">
                    <strong>DEO:</strong> Innendämmung der Decke oder Bodenplatte (oberseitig) unter Estrich ohne zusätzliche Schallschutzanforderung. <br />
                    <strong>DES:</strong> Dämmung unter Estrich mit Schallschutzanforderung (Trittschalldämmung, Kennwert dynamische Steifigkeit s′).
                  </p>
                </div>
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1.5">
                  <span className="font-bold text-slate-800 block">Erdberührte Bauwerksdämmungen (Typen PW, PB)</span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed">
                    <strong>PW:</strong> Perimeterdämmung an der Außenseite erdberührter Kellerwände (Druckwasser- oder Erddruckbelastung). <br />
                    <strong>PB:</strong> Außendämmung unter lastabtragenden Bodenplatten (Perimeterdämmung unter der Gründung, hohe Druckfestigkeit erforderlich).
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'praxis' ? (
          <PraxisTabContent moduleKey="bp_daemmung" />
        ) : activeTab === 'innovation' ? (
          <InnovationTabContent moduleKey="bp_daemmung" />
        ) : (
          <DaemmungBerater />
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: U-Wert einer gedämmten Außenwand (WDVS)"
          zielGleichung="U = \frac{1}{R_{si} + \sum d_i/\lambda_i + R_{se}}"
          normQuelle="DIN EN ISO 6946 (R_si = 0,13, R_se = 0,04 m²K/W)"
          schritte={[
            { titel: '1. Schichten', formel: '\\text{Putz } 0{,}015/0{,}51 + \\text{KS } 0{,}175/0{,}99 + \\text{EPS } 0{,}16/0{,}035 + \\text{Putz } 0{,}01/0{,}70', erklaerung: 'Innenputz, Kalksandstein, EPS-Dämmung (WLS 035), Außenputz; λ als Lehrwerte.' },
            { titel: '2. Widerstände', formel: '0{,}029 + 0{,}177 + 4{,}571 + 0{,}014 = 4{,}79\\,\\text{m}^2\\text{K/W}', erklaerung: 'Summe der Schichtwiderstände d/λ.' },
            { titel: '3. Gesamtwiderstand', formel: 'R_T = 0{,}13 + 4{,}79 + 0{,}04 = 4{,}96\\,\\text{m}^2\\text{K/W}', erklaerung: 'Mit Wärmeübergangswiderständen innen und außen.' },
            { titel: '4. U-Wert', formel: 'U = 1/4{,}96 = 0{,}20\\,\\text{W/(m}^2\\text{K)}', erklaerung: 'Anforderung Bestand (GEG Anlage 7): U ≤ 0,24 – erfüllt.' },
          ]}
          ergebnisHinweis="Die Dämmschicht liefert über 90 % des Widerstands; Dübel und Anschlüsse (Wärmebrücken) sind gesondert zu berücksichtigen."
        />
      </div>

      <ModulTest moduleId="bp_daemmung" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Dämmstoff', url: 'https://de.wikipedia.org/wiki/D%C3%A4mmstoff' },
          { title: 'Wärmedämmung', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmed%C3%A4mmung' }
        ]} 
        literatur={[ 
          'Willems, W. M. (Hrsg.): Lehrbuch der Bauphysik – Wärme, Feuchte, Klima, Schall, Licht, Brand. 9. Aufl., Wiesbaden: Springer Vieweg 2022', 
          'Fachagentur Nachwachsende Rohstoffe e. V. (FNR) (Hrsg.): Marktübersicht Dämmstoffe aus nachwachsenden Rohstoffen. 13., überarb. Aufl., Gülzow-Prüzen: FNR 2024' 
        ]} 
        regelwerke={[ 
          { title: 'DIN 4108-2 (Mindestanforderungen an den Wärmeschutz von Gebäuden)' }, 
          { title: 'DIN 4108-3 (Klimabedingter Feuchteschutz - Tauwasservermeidung nach Glaser)' },
          { title: 'GModG (vormals GEG) – Anforderungen an den baulichen Wärmeschutz', url: 'https://www.gesetze-im-internet.de/geg/' },
          { title: 'DIN 4108-10 (Anwendungsbezogene Anforderungen an Wärmedämmstoffe)' },
          { title: 'DIN EN 13162 (Dämmstoffe für Gebäude - Werkmäßig hergestellte Mineralwolle MW)' },
          { title: 'DIN EN 13164 (Dämmstoffe für Gebäude - Extrudierte Polystyrolschaumstoffe XPS)' },
          { title: 'DIN EN 13171 (Dämmstoffe für Gebäude - Werkmäßig hergestellte Holzfaserstoffe WF)' }
        ]} 
        formeln={[
          { 
            formel: 'R_T = R_{si} + \\sum_{i=1}^{n} \\frac{d_i}{\\lambda_i} + R_{se}', 
            erklaerung: 'Gesamtwärmedurchgangswiderstand RT (m²·K/W) eines mehrschichtigen Bauteils inklusive innerer (Rsi) und äußerer (Rse) Wärmeübergangswiderstände.',
            quelle: 'DIN EN ISO 6946 Gl. (3)'
          },
          { 
            formel: 'U = \\frac{1}{R_T} = \\frac{1}{R_{si} + \\sum \\frac{d_i}{\\lambda_i} + R_{se}}', 
            erklaerung: 'Wärmedurchgangskoeffizient U [W/(m²·K)]: Spezifischer Wärmestrom pro Kelvin Temperaturdifferenz zwischen Innen- und Außenluft.',
            quelle: 'DIN EN ISO 6946 Gl. (1)'
          }
        ]} 
      />
    </div>
  );
}
