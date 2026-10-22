import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InlineMath } from 'react-katex';
import { Layers, BookOpen, CheckCircle2, Lightbulb, BadgeCheck, AlertTriangle, ShieldCheck, Settings, Droplet, Flame, Compass, Calculator } from 'lucide-react';
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
    advantages: ['Sehr leicht und hochkomprimierbar', 'Exzellenter Schall- und Brandschutz', 'Kosteneffizienter Standardbaustoff'],
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
    description: 'Robuste Mineralfaser aus vulkanischem Gestein. Aufgrund des extrem hohen Schmelzpunktes unverzichtbar für den vorbeugenden baulichen Brandschutz im Geschossbau.',
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
    description: 'Zellulärer Dämmstoff aus hermetisch geschlossenzellig aufgeschäumtem Recyclingglas. Gewährleistet absolute Wasser- und Dampfdichtigkeit über Jahrzehnte hinweg.',
    advantages: ['Extrem druckfest ohne Verformung (stauchungsfrei)', '100% wasserdicht, dampf- und diffusionsdicht', 'Resistent gegen Nagetiere, Säuren, Radon und Lösungsmittel'],
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
    description: 'Mineralisches Silikathartgestein mit hohem Porenvolumen. Weist eine enorme kapillare Aktivität auf und reguliert Raumluftfeuchten im Innenraum selbstständig.',
    advantages: ['Enorme Kapillaraktivität (absorbiert und verteilt Feuchtigkeit)', 'Schimmelpilzinhibierend durch hohe Alkalität (pH-Wert ~10)', 'Innendämmung ohne zusätzliche Dampfbremse möglich'],
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
    description: 'Durch Hitzeeinwirkung auf das zwanzigfache Volumen expandiertes vulkanisches Glasgestein (Obsidian). Absolut mineralischer, poröser Schütt- und Dämmstoff.',
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
    advantages: ['Hervorragender statischer Lastabtrag (sehr druckstabil)', 'Absolut verrottungsfest und frostsicher', 'Leicht hydraulisch stabilisierbar'],
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
    description: 'Leichter, offenzelliger Partikel-Hartschaumstoff aus polymerisierten Styrolkügelchen. Der wirtschaftliche Klassiker in der Außenwand-WDVS-Dämmung.',
    advantages: ['Äußerst kostengünstig und einfach zuzuschneiden', 'Sehr geringes Eigengewicht', 'Form- und maßstabil bei sachgerechter Anwendung'],
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
    description: 'Geschlossenzelliger, stranggepresster Schaumstoff. Bietet extrem glatte, verdichtete Schäumhäute und ist absolut unempfindlich gegenüber Feuchtigkeitsbeanspruchungen.',
    advantages: ['Extrem druckfest (Belastungen bis zu 700 kPa schadensfrei)', 'Vollständig wasserunempfindlich und verrottungsfest', 'Frost-Tau-Wechsel-beständig im direkten Erdreichkontakt'],
    disadvantages: ['Umweltrelevanz durch problematische Treibmittel/Flammschutzmittel beim Recycling', 'Geringer Beitrag zum Schallschutz', 'Hochempfindlich gegenüber organischen Lösungsmitteln'],
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
    description: 'Duroplastischer Hartschaumstoff mit herausragender Dämmleistung. Ermöglicht minimalste Bauteildicken bei maximalem Wärmeschutz.',
    advantages: ['Exzellent niedrige Wärmeleitfähigkeit', 'Temperaturbeständig (verträgt heißen Bitumenaufrag)', 'Sehr druckfest und dimensionsstabil'],
    disadvantages: ['Hoher Primärenergieaufwand bei der Synthese', 'Keine elastische Schallabsorption', 'Zuschnittabfälle müssen sonderentsorgt werden'],
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
    description: 'Geschlossenzelliger Hightech-Duroplast aus Resol-Phenolharzen. Bietet die stärkste Dämmung unter den massengekoppelten Polymerplatten bei exzellentem Brandverhalten.',
    advantages: ['Beste Dämmwirkung aller gängigen Hartschaumplatten', 'Hervorragendes Brandverhalten (geringe Glimmgefahr, kein brennendes Abtropfen)', 'Ermöglicht filigranste WDVS-Aufbauten'],
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
    description: 'Nachwachsender Dämmstoff aus zerkleinerten Nadelhölzern, im Nass- oder Trockenverfahren verpresst. Gilt als unschlagbarer Marktstandard für natürlichen Hitzeschutz.',
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
    description: 'Gewonnen durch mechanische Zerfaserung von Altpapier (Zeitungspapier), versetzt mit mineralischen Additiven (Borsalzen oder Ammoniumphosphaten) als Brandschutz und Erregerabwehr.',
    advantages: ['Fugenlose und hohlraumfreie Ausflockung komplexer Geometrien', 'Sehr hohes Raumgewicht schützt ideal vor sommerlicher Hitze', 'Hervorragende Schallschutzeigenschaften', 'Herausragend niedrige Primärenergiebilanz'],
    disadvantages: ['Setzungsgefahr bei unzureichendem Einblasdruck (Fachbetriebspflicht)', 'Vollkommen ungeeignet bei direkter Nässeeinwirkung', 'Staubentwicklung beim Einblasprozess'],
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
    advantages: ['Sehr hohe Reißfestigkeit und elastischer Klemmeffekt', 'Von Natur aus resistent gegen Schimmelpilze und Schädlinge (bitterstofffrei)', 'Ausgezeichnete Feuchteregulation ohne Strukturverlust'],
    disadvantages: ['Schwerer zuzuschneiden als Mineralwollen (Spezialsägen nötig)', 'Einsatz auf absolut trocken gehaltene Kernbereiche begrenzt'],
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
    description: 'Unbehandeltes Weizen-, Roggen- oder Dinkelstroh, das unter extrem hohem Druck zu quaderförmigen Ballen gepresst wird. Ein unschlagbarer CO2-Senker direkt vom Acker.',
    advantages: ['Sensationelle Ökobilanz und CO2-Speicherung', 'Schnittfester, dichter Gefacheinbau', 'Hervorragender sommerlicher Überhitzungsschutz'],
    disadvantages: ['Sehr hohe Einbaustärke erforderlich', 'Feuchtigkeitsüberwachung während der Bauphase zwingend', 'Ausschließlich im zertifizierten Holzständergefecht einsetzbar'],
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
    description: 'Granulierte Rinde der Korkeiche. Wird unter Heißdampf ohne künstliche Klebstoffe expandiert. Das pflanzeneigene Harz Suberin fungiert als Bindemittel.',
    advantages: ['Absolut wasserunempfindlich und fäulnisresistent', 'Sehr gut alterungsbeständig und druckbelastbar', '100% chemiefrei (reines Naturprodukt)'],
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
    description: 'Gewaschene Schafschurwolle, die mithilfe von textilen Stützfasern vernadelt wird. Weist die einzigartige Eigenschaft auf, gesundheitsschädliche Gase aufzunehmen.',
    advantages: ['Baut Formaldehyd und Raumgifte chemisch irreversibel ab', 'Kann bis zu 33% des Eigengewichts an Feuchte binden ohne Dämmungsverlust', 'Nachwachsend ohne Pestizidbelastung'],
    disadvantages: ['Erfordert vorbeugenden Mottenschutz (Ausstattung mit mineralhaltigen Salzen)', 'Teure Beschaffung'],
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
    advantages: ['Von Natur aus salzhaltig, dadurch absolut schimmel- und ungezieferresistent', 'Schwer entflammbar ohne Brandschutzchemikalien', 'Unbegrenzt feuchteunempfindlich und fäulnissicher'],
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
    advantages: ['Weltbestes physikalisches Dämmvermögen (Lambda bis zu 0,004 W/mK)', 'Minimalste Aufbaustärken (perfekt bei Sanierungen und Platznot)', 'Extreme Platzersparnis (5-mal schlanker als EPS)'],
    disadvantages: ['Absolutes Beschädigungsverbot (darf niemals durchbohrt, zerschnitten oder geraspelt werden)', 'Vakuumverlust bei Perforation führt zu sofortigem Lambda-Anstieg auf ca. 0,020 W/mK', 'Aufwendige Maß- und Vorplanung zwingend erforderlich'],
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
    description: 'Amorphes Silika-Nanogel, das in stabile Textilfaser- oder Glasfaservliesmatten eingeschmolzen wird. Nutzt extrem kleine Nanoporen zur Ausschaltung von Gaskonvektion.',
    advantages: ['Höchster Dämmwert aller diffusionsoffenen und flexiblen Matten', 'Hydrophober Charakter bei gleichzeitiger Atmungsaktivität', 'Biegbar und formbar für Rundungen'],
    disadvantages: ['Sehr starke Feinstaubentwicklung beim manuellen Zuschnitt', 'Extrem hoher Kostenfaktor', 'Aufwändige Befestigungssysteme'],
    applications: ['Innendämmung denkmalgeschützter Prachtfassaden', 'Heizkörpernischenbehebung', 'Laibungen und dekorative Rundbögen']
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
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Basiswissen &amp; Kennwerte
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={16} /> Praxisbeispiele &amp; Schadensbilder
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'innovation' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('innovation')}
          >
            <Lightbulb size={16} /> Zukunftstrends &amp; Zirkularität
          </button>
          <button
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
                Das Gebäudeenergiegesetz (GEG) regelt die energetischen Mindestanforderungen für Neubauten sowie für anstehende Sanierungen im Bestand (Anlage 7 GEG). Wird ein Bauteil um mehr als 10% flächenmäßig verändert (z. B. Neuer Putz bei Fassadendämmung), gelten folgende Grenzwerte für den maximal zulässigen Wärmedurchgangskoeffizienten (<InlineMath math="U" />):
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-medium">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Außenwände (Sanierung)</span>
                  <span className="text-sm font-mono font-black text-slate-800">U_max = 0,24 W/(m²K)</span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal mt-1">Dicke bei WLG 035: ca. 12-14 cm</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Steildach / Sparren</span>
                  <span className="text-sm font-mono font-black text-slate-800">U_max = 0,20 W/(m²K)</span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal mt-1">Dicke bei WLG 035: ca. 16-18 cm</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Flachdächer (Gesamt)</span>
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
                  <span className="font-bold text-slate-800 block">Dachdämmungen (Typen DAA, DAD, DZ, DI)</span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed">
                    <strong>DAD:</strong> Außendämmung unter Deckung (z.B. Aufsparrendämmung). <br />
                    <strong>DAA:</strong> Außendämmung unter Abdichtung (z.B. klassisches Flachdach). <br />
                    <strong>DZ:</strong> Zwischensparrendämmung (Gefachdämmung ohne Druckbelastung). <br />
                    <strong>DI:</strong> Innendämmung unter der Decke/Dachkonstruktion.
                  </p>
                </div>
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1.5">
                  <span className="font-bold text-slate-800 block">Wand- &amp; Fassadendämmungen (Typen WAP, WAB, WAS, WBL)</span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed">
                    <strong>WAP:</strong> Außendämmung der Wand unter Putz (klassische WDVS-Fassade). <br />
                    <strong>WAB:</strong> Außendämmung hinter Bekleidung (z.B. vorgehängte hinterlüftete Fassade - VHF). <br />
                    <strong>WAS:</strong> Kerndämmung bei zweischaligem Mauerwerk (Vollfugenfüllung). <br />
                    <strong>WBL:</strong> Innendämmung der Wand unter Bekleidung (z.B. historische Fassadensanierung).
                  </p>
                </div>
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1.5">
                  <span className="font-bold text-slate-800 block">Decken- &amp; Estrichdämmungen (Typen DEO, DES)</span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed">
                    <strong>DEO:</strong> Innendämmung der Decke oder Bodenplatte (oberseitig) unter Estrich ohne zusätzliche Schallschutzanforderung. <br />
                    <strong>DES:</strong> Trittschalldämmung unter schwimmendem Estrich mit elastischen Eigenschaften (sd-Wert-beschränkt).
                  </p>
                </div>
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1.5">
                  <span className="font-bold text-slate-800 block">Erdberührte Bauwerksdämmungen (Typen PW, PB)</span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed">
                    <strong>PW:</strong> Perimeterdämmung an der Außenseite erdberührter Kellerwände (Druckwasser- oder Erddruckbelastung). <br />
                    <strong>PB:</strong> Außendämmung unter Fundamentplatten und Gründungssohlen mit extrem hohem statischem Lastabtrag (stauchungsfrei).
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

      <ModuleFooter 
        wikipedia={[
          { title: 'Dämmstoff', url: 'https://de.wikipedia.org/wiki/D%C3%A4mmstoff' },
          { title: 'Wärmedämmung', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmed%C3%A4mmung' }
        ]} 
        literatur={[ 
          'Willems, W. et al.: Handbuch Bauphysik - Schall, Wärme, Feuchte.', 
          'Pistohl, W.: Handbuch der Gebäudetechnik.', 
          'Minke, G.: Handbuch Naturbaustoffe - Ökologische Dämmung.' 
        ]} 
        regelwerke={[ 
          { title: 'DIN 4108-2 (Mindestanforderungen an den Wärmeschutz von Gebäuden)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+4108-2' }, 
          { title: 'DIN 4108-3 (Klimabedingter Feuchteschutz - Tauwasservermeidung nach Glaser)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+4108-3' },
          { title: 'GEG (Gebäudeenergiegesetz - Anforderungen an baulichen Wärmeschutz)', url: 'https://www.gesetze-im-internet.de/geg/' },
          { title: 'DIN EN 13162 (Dämmstoffe für Gebäude - Werkmäßig hergestellte Mineralwolle MW)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+13162' },
          { title: 'DIN EN 13164 (Dämmstoffe für Gebäude - Extrudierte Polystyrolschaumstoffe XPS)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+13164' },
          { title: 'DIN EN 13171 (Dämmstoffe für Gebäude - Werkmäßig hergestellte Holzfaserstoffe WF)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+13171' }
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
