import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InlineMath } from 'react-katex';
import { 
  Layers, BookOpen, CheckCircle2, Lightbulb, Calculator, Percent, Sparkles, 
  AlertCircle, FileText, CheckCircle, Flame, Volume2, Shield, Activity, 
  Compass, ChevronRight, Droplets, Wrench, Info
} from 'lucide-react';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';

interface ProductSpec {
  id: string;
  name: string;
  category: string;
  dinNorm: string;
  colorCodeName: string;
  colorCodeBg: string; // Background class for visualization
  colorBorder: string; // Border class
  density: number; // in kg/m³
  lambda: number; // in W/mK
  muValue: number; // dampfdiffusionswiderstand
  fireClass: string;
  weightPerM2: number; // kg per m²
  advantages: string[];
  description: string;
  systemIntegration: string;
}

interface SystemSpec {
  id: string;
  code: string;
  name: string;
  structure: string;
  thickness: string;
  fireRating: string;
  soundRating: string;
  description: string;
  application: string;
  profileType: string;
  spacing: string;
}

const DRY_PRODUCTS_DB: ProductSpec[] = [
  {
    id: 'standard_gkb',
    name: 'Standard-Gipsplatte (GKB)',
    category: 'Gipsplatten nach DIN EN 520',
    dinNorm: 'DIN EN 520 / Typ A',
    colorCodeName: 'Graue Papierkartonage, blaue Kennzeichnung',
    colorCodeBg: 'bg-slate-100',
    colorBorder: 'border-slate-300',
    density: 680,
    lambda: 0.25,
    muValue: 10,
    fireClass: 'A2-s1, d0 (nicht brennbar)',
    weightPerM2: 8.5,
    advantages: [
      'Äußerst materialsparend & kostengünstig',
      'Leicht zuschneidbar (Anritzen und Brechen)',
      'Einfaches Verschrauben auf Holz und Metall',
      'Reguliert das Raumklima geringfügig durch Gips-Porosität'
    ],
    description: 'Das bewährte Standard-Ausbauelement für raumbegrenzende Baustrukturen. Die Platte besteht aus einem erstklassigen Gipskern, der schubfest mit einer extrem zähen Papierdeckenkartonage verklebt ist (kraftschlüssiges Stützplattenprinzip). Ideal für Wände und Decken ohne Brandschutz- oder Feuchtigkeitsauflagen.',
    systemIntegration: 'Standard-Wandsysteme (einfach oder doppelt beplankt), abgehängte Innendecken und gerade Trockenputzflächen.'
  },
  {
    id: 'impregnated_gkbi',
    name: 'Imprägnierte Feuchtraumplatte (GKBI)',
    category: 'Gipsplatten nach DIN EN 520',
    dinNorm: 'DIN EN 520 / Typ H2',
    colorCodeName: 'Grüne Papierkartonage, blaue Kennzeichnung',
    colorCodeBg: 'bg-emerald-50',
    colorBorder: 'border-emerald-300',
    density: 720,
    lambda: 0.25,
    muValue: 10,
    fireClass: 'A2-s1, d0 (nicht brennbar)',
    weightPerM2: 9.3,
    advantages: [
      'Stark hydrophobierter Kern & Karton (Wasseraufnahme < 10%)',
      'Zusatz pilzhemmender Wirkstoffe zur Schimmelphobie',
      'Optimaler Untergrund für Fliesenkleber und Spachtelschichten',
      'Ausgezeichnete Formstabilität auch bei Dampfspitzen'
    ],
    description: 'Speziell hydrophobierte Gipsplatte für häusliche Feuchtgebiete. Sowohl der Gipskern als auch die Kartonage sind durch den gezielten Zusatz von flüssigen Silikonen wasserabweisend eingestellt. Dadurch wird das kapillare Saugen von Feuchtigkeit effektiv unterbunden.',
    systemIntegration: 'Unterkonstruktion für Wandfliesen in Bädern, Gäste-WCs, Küchendecken und Duschbereichen.'
  },
  {
    id: 'fire_gkf',
    name: 'Feuerschutz-Gipsplatte (GKF)',
    category: 'Gipsplatten nach DIN EN 520',
    dinNorm: 'DIN EN 520 / Typ DF',
    colorCodeName: 'Graue/Rosa Papierkartonage, rote Kennzeichnung',
    colorCodeBg: 'bg-red-50',
    colorBorder: 'border-red-300',
    density: 820,
    lambda: 0.25,
    muValue: 10,
    fireClass: 'A2-s1, d0 (Systeme F30 bis F180)',
    weightPerM2: 10.5,
    advantages: [
      'Erhöhter Zusammenhalt durch eingebettete Glasfaserrovings',
      'Chemisch gebundenes Kristallwasser kühlt im Brandfall aktiv',
      'Besonders verformungsstabil unter Temperatureinfluss',
      'Erhöhte Festigkeit allgemein'
    ],
    description: 'Spezialplatte für den baulichen Brandschutz. Bei extremer Hitzeeinwirkung setzt der Gips sein zweifach chemisch gebundenes Kristallwasser (ca. 2 Liter pro m²) frei, welches verdampft und so das Bauteil aktiv vor Überhitzung schützt. Glasfasern im Kern stützen das Bauteil, wenn die Kartonage verbrannt ist.',
    systemIntegration: 'Tragende Brandschutzwände, Fluchtwegschächte (F90), Deckenkonstruktionen unter Massivdecken.'
  },
  {
    id: 'premium_dfir',
    name: 'Spezial-Hartgipsplatte (Typ DFIR)',
    category: 'Gipsplatten nach DIN EN 520',
    dinNorm: 'DIN EN 520 / Typ DFIR',
    colorCodeName: 'Blaue Papierkartonage, rote Kennzeichnung',
    colorCodeBg: 'bg-blue-50',
    colorBorder: 'border-blue-300',
    density: 1020,
    lambda: 0.25,
    muValue: 10,
    fireClass: 'A2-s1, d0 (Schnittbester Schall- & Brandschutz)',
    weightPerM2: 12.8,
    advantages: [
      'Herausragender Schallschutz durch gesteigerte flächenbezogene Masse',
      'Extreme Oberflächenhärte schützt vor Stößen und Kratzern',
      'Sehr hohe Dübelbelastbarkeit (bis zu 45 kg je Hohlraumdübel)',
      'Werksseitig imprägniert für universelle Einsetzbarkeit'
    ],
    description: 'Die absolute Spitzenklasse unter den Gipsplatten. Vereint eine enorm verdichtete Gipskristallstruktur mit Glasfaser-Gefüge und Hydrophobierung. Entwickelt für Bereiche mit höchsten Anforderungen an Robustheit, Schallschutz und sicheren Halt von Lasten wie Hängeschränken.',
    systemIntegration: 'Hochleistungsschallschutzwände, Krankenhäuser, Schulgänge, Sporthallen, Einbruchschutz-Systeme.'
  },
  {
    id: 'gipsfaser_gf',
    name: 'Gipsfaser-Zelluloseplatte (GF)',
    category: 'Gipsfaserplatten nach DIN EN 15283-2',
    dinNorm: 'DIN EN 15283-2 / Typ GF',
    colorCodeName: 'Hellgraue homogene Optik, keine Kartonumhüllung',
    colorCodeBg: 'bg-stone-100',
    colorBorder: 'border-stone-400',
    density: 1150,
    lambda: 0.32,
    muValue: 13,
    fireClass: 'A2-s1, d0 (nicht brennbar)',
    weightPerM2: 15.0,
    advantages: [
      'Vollkommen homogene Struktur (Gips + Zellulose)',
      'Extrem schlagfest und aussteifend (tragendes Element)',
      'Bis zu 50 kg direkt verschraubbar ohne Dübel (grobes Gewinde)',
      'Diffusionsfähig und Feuchte regulierend'
    ],
    description: 'Ein hochfester Faserverbundwerkstoff aus Gips und Papierfasern (Zellulose aus Altpapier), die ohne Klebstoffe unter starkem Pressdruck innig verzahnt werden. Die Platte ist durch und durch bewehrt, extrem stabil und eignet sich ideal für statisch tragende oder anspruchsvolle Zwecke.',
    systemIntegration: 'Holzrahmenbau / Fertighäuser (aussteifende Beplankung), Trockenestrich-Elemente, öffentliche Fluchtbereiche.'
  },
  {
    id: 'clay_board',
    name: 'Ökologische Lehmbauplatte',
    category: 'Lehmbauplatten nach DIN 18948',
    dinNorm: 'DIN 18948 / Klasse WS III',
    colorCodeName: 'Erdig braun, Schilf- oder Glasgittergewebe',
    colorCodeBg: 'bg-amber-100/50',
    colorBorder: 'border-amber-300',
    density: 1250,
    lambda: 0.44,
    muValue: 7,
    fireClass: 'B-s1, d0 (schwer entflammbar)',
    weightPerM2: 18.0,
    advantages: [
      'Unschlagbare Feuchtigkeitsabsorption (> 15g/m² in 24h)',
      'Filtert Schadstoffe und Tabakrauch aktiv aus der Raumluft',
      'Große thermische Masse speichert Heizungswärme exzellent',
      'Schnittstelle für baubiologisch reine Wohnräume'
    ],
    description: 'Hochökologisches Lehmausbauelement. Hergestellt aus Natursanden, reinem Lehm und organischen Fasern wie Schilfrohr oder Strohhäckseln. Lehm wirkt hochgradig feuchteregulierend und adsorbiert aktiv Gerüche sowie flüchtige Schadstoffe. Beste Wahl für wohngesunden Holzinnenausbau.',
    systemIntegration: 'Verkleidung von Innenwänden auf Holzständern, Deckenbekleidungen unter Wandheizungssystemen.'
  },
  {
    id: 'acoustic_perforated',
    name: 'Helmholtz-Akustiklochplatte',
    category: 'Spezialgipsplatten nach DIN EN 14190',
    dinNorm: 'DIN EN 14190 (Spezialgipsprodukte)',
    colorCodeName: 'Lochungsaufbau, rückseitiges Vlies (Schwarz/Weiß)',
    colorCodeBg: 'bg-teal-50',
    colorBorder: 'border-teal-300',
    density: 760,
    lambda: 0.23,
    muValue: 8,
    fireClass: 'A2-s1, d0 (Schallabsorbierend)',
    weightPerM2: 9.2,
    advantages: [
      'Exzellente Absorptionsklasse (Schallabsorptionsgrad α_w bis 0.90)',
      'Präzises Lochraster (z.B. 8/18R oder Streulochung)',
      'Hinterlegtes Akustik-Vlies mindert Flatterechos',
      'Optional mit schadstoffabbauendem Zeolith-Gips (Zeh-Effekt)'
    ],
    description: 'Eine technologische Meisterleistung für die Raumakustik. Durch präzise kreisrunde, quadratische oder gestreute Perforationen wirken die Löcher im Zusammenspiel mit dem rückseitigen Spezialvlies als Helmholtz-Resonatoren. Sie "schlucken" Schallwellen und verkürzen die störende Nachhallzeit.',
    systemIntegration: 'Akustikdecken in Foyers, Konferenzräumen, Klassenzimmern, Kinos und schallschluckenden Wandpaneelen.'
  },
  {
    id: 'cement_bound',
    name: 'Zementgebundene Bauplatte',
    category: 'Zementgebundene Bauplatten nach DIN EN 12467',
    dinNorm: 'DIN EN 12467 / Typ NT',
    colorCodeName: 'Zementgrauer Kern, Gittervliesumhüllung',
    colorCodeBg: 'bg-cyan-50/75',
    colorBorder: 'border-cyan-300',
    density: 1080,
    lambda: 0.35,
    muValue: 50,
    fireClass: 'A1 (nicht brennbar, brandsichernd)',
    weightPerM2: 15.0,
    advantages: [
      '100% resistent gegen flüssiges Wasser & Feuchtigkeit (quilltfrei)',
      'Absolut schimmel- und fäulnisresistent',
      'Hohe mechanische Bruch- und Knickfestigkeit',
      'Zulassung für dauerhaften Außenbereich (wetterfest)'
    ],
    description: 'Hochfeste Bauplatte auf Portlandzementbasis, die beidseitig mit einem alkaliresistenten Glasgittergewebe armiert ist. Im Gegensatz zu Gipswerkstoffen zersetzt sich Zement auch unter andauernder Nässeeinwirkung nicht und bietet Sporen keinen organischen Nährboden.',
    systemIntegration: 'Dauernassbereiche (Schwimmbäder, Wellnesslandschaften, Wellnessduschen), Großküchen und Außenfassaden.'
  },
  {
    id: 'calcium_silicate',
    name: 'Calciumsilikat-Klimaplatte',
    category: 'Dämm- und Sickerplatten',
    dinNorm: 'DIN EN 14306',
    colorCodeName: 'Schneeweiß, offenporig kreidig',
    colorCodeBg: 'bg-amber-50/30',
    colorBorder: 'border-amber-200',
    density: 230,
    lambda: 0.057,
    muValue: 5,
    fireClass: 'A1 (vollkommen brandsicher)',
    weightPerM2: 5.8,
    advantages: [
      'Extrem diffusionsoffen und kapillaraktiv (Entfeuchtungs-Ass)',
      'Sehr hoher pH-Wert (&gt; 10) entzieht Schimmel pilzbiologische Grundlagen',
      'Wärmedämmende Wirkungsweise zur behaglichen Innensanierung',
      'Einfache Sanierungsverarbeitung ohne Dampfsperrfolie'
    ],
    description: 'Eine mineralische Spezialplatte aus Siliziumdioxid, Kalk und Zellulosefasern. Sie zeichnet sich durch ein extremes Porenvolumen aus. Feuchtigkeit wird kapillar aufgesaugt, großflächig gepuffert und bei sinkender Raumfeuchte wieder abgegeben, was die Wände dauerhaft trocken hält.',
    systemIntegration: 'Innendämmung von Altbaufassaden ohne Dampfbremse, aktive Sanierung schimmelbehafteter Wärmebrücken.'
  }
];

const DRY_SYSTEMS_DB: SystemSpec[] = [
  {
    id: 'w111',
    code: 'Standard-Wandsystem M50A (Typ W111)',
    name: 'Einfachständerwerk, 1-lagig beplankt',
    structure: '1x 12,5 mm Gipsplatte + CW 50 Stehprofile + 1x 12,5 mm Gipsplatte',
    thickness: '75 mm',
    fireRating: 'Kein Brandschutz (bzw. max. F30 bei GKF-Ausführung)',
    soundRating: 'ca. 42 - 45 dB',
    description: 'Das einfachste Metallständerwandsystem. Besteht aus einer Unterkonstruktion aus verzinkten Stahlblechprofilen, die beidseitig einfach beplankt wird. Gut geeignet als kosteneffizientes Raumtrennelement ohne nennenswerte Brandschutz- oder Schallschutzanforderungen.',
    application: 'Abstellkammern, einfache Flurgestaltungen, Raumaufteilungen ohne Schallschutz.',
    profileType: 'CW 50 / UW 50',
    spacing: '62,5 cm'
  },
  {
    id: 'w112',
    code: 'Standard-Wandsystem M50B (Typ W112)',
    name: 'Einfachständerwerk, 2-lagig beplankt',
    structure: '2x 12,5 mm Gipsplatte + CW 50/75 Stehprofile + 2x 12,5 mm Gipsplatte',
    thickness: '100 mm',
    fireRating: 'F 90-A (bei Feuerschutzplatten-Beplankung)',
    soundRating: 'ca. 52 - 56 dB',
    description: 'Das klassische Standard-Trennwandsystem des modernen Innenausbaus. Durch die zweilagige Beplankung wird die Stabilität der Wand enorm gesteigert und Kreuzfugenrisse werden drastisch minimiert. Mit GKF-Platten wird ein ausgezeichneter Brandschutz nach DIN 4102-4 erreicht.',
    application: 'Zimmertrennwände im Wohnungsbau, Bürobereiche, Brandschutzwände.',
    profileType: 'CW 75 / UW 75',
    spacing: '62,5 cm'
  },
  {
    id: 'w115',
    code: 'Akustik-Doppelständerwand (Typ W115)',
    name: 'Doppelständerwerk, entkoppelt, 2-lagig',
    structure: '2x 12,5 mm High-Schall-Gipsplatte + doppeltes, entkoppeltes Metallständerwerk + 2x 12,5 mm',
    thickness: '155 mm',
    fireRating: 'F 90-A',
    soundRating: 'ca. 62 - 68 dB',
    description: 'Hochleistungsschallschutzwand. Zwei von sich getrennt stehende Metallständerwerke werden nebeneinander aufgestellt. Zwischen den Profilen wird ein Entkopplungs-Dichtstreifen verlegt. Schallschwingungen können somit nicht mechanisch von einer Seite zur anderen fließen (Biegesteifer Feder-Masse-Effekt).',
    application: 'Wohnungstrennwände, Hotelzimmer-Trennwände, Aufnahmeräume, Arztpraxen.',
    profileType: '2x CW 50, getrennt mit Schaumstofftape',
    spacing: '62,5 cm'
  },
  {
    id: 'd112',
    code: 'Decken-Hängesystem (Typ D112)',
    name: 'Abgehängte Deckenunterkonstruktion',
    structure: 'Trag- und Grundprofilraster (CD 60/27) an Direktabhängern oder Noniusabhängern',
    thickness: 'Abhänghöhe flexibel (ab 40 mm)',
    fireRating: 'F 30 bis F 90 (von unten oder oben)',
    soundRating: 'Minderung übertragener Deckenwellen um ΔR_w ≥ 10 dB',
    description: 'Klassisches abgehängtes Deckensystem mit Doppelschiene. Ein Grundraster wird mit der tragenden Rohdecke verdübelt, darunter kreuzweise die Tragprofile gekoppelt. Anschließend erfolgt das plane Beplanken mit Gips- oder Akustikelementen. Ideal für Installationen im Hohlraum.',
    application: 'Kabelrinnen-Führungen in Bürogebäuden, Wohnraum-Deckenabhängung, Akustikdecken.',
    profileType: 'CD 60/27 und UD 28',
    spacing: 'Grundprofil ≤ 100 cm, Tragprofil ≤ 50 cm'
  },
  {
    id: 'd131',
    code: 'Freitragende Flurdecke (Typ D131)',
    name: 'Freitragendes Deckensystem (Wand-zu-Wand)',
    structure: 'Verstärkte Doppel-CW- oder UA-Träger quer gespannt, Wandanschlüsse tragend verschraubt',
    thickness: 'Profilhöhe je nach Spannweite (75 bis 150 mm)',
    fireRating: 'F 30-A bis F 90-A',
    soundRating: 'Dämpft Flur-Körperschallbrücken effektiv',
    description: 'Ein geniales Deckensystem, welches gänzlich ohne Abhänger an der Rohdecke auskommt. Es spannt sich statisch tragend ausschließlich von Wand zu Wand. Hervorragend geeignet für enge Flure, bei denen eine Unmenge an Kabelpritschen und Lüftungsrohren unter der Decke das Bohren behindert.',
    application: 'Sanierungsflure, Hotel-Kabelleitkanäle, Fluchtwege ohne Deckenanker-Zulassung.',
    profileType: 'UA-Profile oder Doppel-CW-Profile wandgebunden',
    spacing: 'Breitenabhängige Profilbemessung bis zu ca. 5,5 m Spannweite'
  },
  {
    id: 'f141',
    code: 'Trockenunterboden (Typ F141-Trockenestrich)',
    name: 'Trockenunterboden mit Falzplatten',
    structure: '20 mm oder 25 mm massive, schubfest geklebte Falz-Gipsfaserplatten',
    thickness: '20 - 50 mm (zzgl. Schüttung)',
    fireRating: 'F 30 bis F 60 (Fußböden)',
    soundRating: 'Trittschallminderung um ca. 18 - 24 dB',
    description: 'Ein extrem rationeller Fußbodenaufbau aus hochdichten Gipsfaserstücken. Die Platten verfügen über einen umlaufenden Stufenfalz, der verklebt und verschraubt/geklammert wird. Bietet sofortige Begehbarkeit, Null Baufeuchte im Gebäude und ist ideal für Fußbodenheizungen geeignet.',
    application: 'Dachgeschoss-Ausbau, Altbausanierung auf Holzbalkendecken, schnelle Estrichreparaturen.',
    profileType: 'Verlegung auf Trittschalldämmung oder Ausgleichsschüttung',
    spacing: 'Umlaufender Klebefalz'
  }
];

export default function BpTrockenbau() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'klassen' | 'rechner' | 'praxis' | 'innovation'>('allgemein');
  const [selectedSubCategory, setSelectedSubCategory] = useState<'produkte' | 'systeme'>('produkte');
  const [selectedProductId, setSelectedProductId] = useState<string>('standard_gkb');
  const [selectedSystemId, setSelectedSystemId] = useState<string>('w111');

  // Calculator State
  const [wallArea, setWallArea] = useState<number>(20);
  const [layerCount, setLayerCount] = useState<1 | 2>(2); // 1 = einfach, 2 = doppelt beplankt
  const [profileSpacing, setProfileSpacing] = useState<62.5 | 31.25>(62.5); // standard Ständerabstand in cm
  const [includeInsulation, setIncludeInsulation] = useState<boolean>(true);

  // Calculation coefficients
  const plasterboardArea = parseFloat((wallArea * layerCount * 2 * 1.05).toFixed(1)); // both sides + 5% waste
  const cwProfilesMeter = parseFloat((wallArea * (profileSpacing === 62.5 ? 2.0 : 3.8) * 1.05).toFixed(1));
  const uwProfilesMeter = parseFloat((wallArea * 0.7 * 1.05).toFixed(1));
  const screwsCount = Math.ceil(wallArea * (layerCount === 1 ? 30 : 55) * 1.05);
  const jointFillerKg = parseFloat((wallArea * layerCount * 2 * 0.45).toFixed(1)); // 0.45 kg per m² per layer per side
  const sealTapeMeter = parseFloat((wallArea * 0.8).toFixed(1));
  const insulationArea = includeInsulation ? parseFloat((wallArea * 1.02).toFixed(1)) : 0;

  // Selected details
  const activeProduct = DRY_PRODUCTS_DB.find(p => p.id === selectedProductId) || DRY_PRODUCTS_DB[0];
  const activeSystem = DRY_SYSTEMS_DB.find(s => s.id === selectedSystemId) || DRY_SYSTEMS_DB[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Trockenbau (Bauprodukte)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Im modernen Trockenbau werden raumbegrenzende, nicht-tragende Bauteile in trockener Montageweise für Decke, Wand und Boden erstellt.
          </p>
        </div>

        {/* Dynamic sub navigation tabs */}
        <div className="flex border-b border-home-grau/30 overflow-x-auto mb-6">
          <button
            className={`px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'allgemein' ? 'border-shiraz text-shiraz' : 'border-transparent text-home-grau hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Basiswissen
          </button>
          <button
            className={`px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'klassen' ? 'border-shiraz text-shiraz' : 'border-transparent text-home-grau hover:text-text-main'
            }`}
            onClick={() => setActiveTab('klassen')}
          >
            <Percent size={16} /> Spachtelklassen &amp; Akustik
          </button>
          <button
            className={`px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'rechner' ? 'border-shiraz text-shiraz' : 'border-transparent text-home-grau hover:text-text-main'
            }`}
            onClick={() => setActiveTab('rechner')}
          >
            <Calculator size={16} /> Bedarfsrechner
          </button>
          <button
            className={`px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'praxis' ? 'border-shiraz text-shiraz' : 'border-transparent text-home-grau hover:text-text-main'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={16} /> Praxisbeispiele
          </button>
          <button
            className={`px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'innovation' ? 'border-shiraz text-shiraz' : 'border-transparent text-home-grau hover:text-text-main'
            }`}
            onClick={() => setActiveTab('innovation')}
          >
            <Lightbulb size={16} /> Zukunftstrends
          </button>
        </div>

        {/* Tab 1: Allgemeines Basiswissen */}
        {activeTab === 'allgemein' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Der moderne <strong>Trockenbau</strong> ist ein hochentwickeltes Montageverfahren des raumbegrenzenden Ausbaus. Er verzichtet vollständig auf nasse Bindemittel und verkürzt dadurch Bauzeiten drastisch. Entscheidend für den Erfolg ist das exakte Zusammenspiel von genormten Plattenbaustoffen und aufeinander abgestimmten System-Profilen nach anerkannten Regeln der Technik (aRdT).
              </p>
            </div>

            {/* Toggle Subcategory switcher */}
            <div className="bg-slate-50 border border-slate-200 p-1.5 rounded-xl flex gap-2">
              <button
                onClick={() => setSelectedSubCategory('produkte')}
                className={`flex-1 py-2 text-center text-xs font-extrabold flex items-center justify-center gap-2 rounded-lg transition-all border cursor-pointer ${
                  selectedSubCategory === 'produkte'
                    ? 'bg-white border-slate-200 text-shiraz shadow-sm'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText size={14} /> 1. Bauprodukte &amp; Spezialplatten (DIN EN 520 / 18948)
              </button>
              <button
                onClick={() => setSelectedSubCategory('systeme')}
                className={`flex-1 py-2 text-center text-xs font-extrabold flex items-center justify-center gap-2 rounded-lg transition-all border cursor-pointer ${
                  selectedSubCategory === 'systeme'
                    ? 'bg-white border-slate-200 text-shiraz shadow-sm'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers size={14} /> 2. Systemaufbauten &amp; Montagestandards (DIN / EN)
              </button>
            </div>

            {/* Sub-Tab 1.1: Interactive Products Database */}
            {selectedSubCategory === 'produkte' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Product List Sidebar */}
                <div className="lg:col-span-5 flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 select-none">
                    Verfügbare Ausbauprodukte &amp; Platten
                  </h4>
                  {DRY_PRODUCTS_DB.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => setSelectedProductId(prod.id)}
                      className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        selectedProductId === prod.id
                          ? 'bg-shiraz/5 border-shiraz text-shiraz ring-1 ring-shiraz'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-355'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-3.5 h-3.5 rounded-full border ${prod.colorCodeBg} ${prod.colorBorder} shrink-0`} />
                        <div>
                          <p className="text-xs font-bold leading-tight">{prod.name}</p>
                          <p className="text-[10px] text-slate-450 font-mono mt-0.5">{prod.dinNorm}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-405" />
                    </button>
                  ))}
                </div>

                {/* Selected Product Specifications Detail Panel */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
                  {/* Visual Header */}
                  <div className={`p-5 border-b border-slate-100 flex items-start gap-4 ${activeProduct.colorCodeBg}`}>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">{activeProduct.category}</div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{activeProduct.name}</h3>
                      <p className="text-[11px] font-semibold text-slate-600 mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-400" /> Farbcodierung: {activeProduct.colorCodeName}
                      </p>
                    </div>
                    <span className="bg-white border border-slate-200 text-slate-800 text-[10px] px-2.5 py-1 rounded-md font-mono font-bold shrink-0">
                      {activeProduct.dinNorm}
                    </span>
                  </div>

                  {/* Physical Parameters Bento Grid */}
                  <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50/50">
                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Flächengewicht</span>
                      <span className="text-sm font-mono font-black text-slate-800">{formatDeZahl(activeProduct.weightPerM2, 1)} kg/m²</span>
                      <span className="text-[8px] text-slate-450 block font-bold leading-none mt-0.5">(Stärke d=12,5mm)</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Rohdichte α</span>
                      <span className="text-sm font-mono font-black text-slate-800">{formatDeWert(activeProduct.density)} kg/m³</span>
                      <span className="text-[8px] text-slate-450 block font-bold leading-none mt-0.5">(Verdichtungsfaktor)</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Wasserdampf µ</span>
                      <span className="text-sm font-mono font-black text-slate-800">µ = {formatDeWert(activeProduct.muValue)}</span>
                      <span className="text-[8px] text-slate-450 block font-bold leading-none mt-0.5">(Diffusionswiderstand)</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Thermische Leitf. λ</span>
                      <span className="text-sm font-mono font-black text-slate-800">{formatDeZahl(activeProduct.lambda, 3)} W/mK</span>
                      <span className="text-[8px] text-slate-450 block font-bold leading-none mt-0.5">(Wärmeübertrag)</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl col-span-2">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Brandschutzklasse (EN 13501)</span>
                      <span className="text-xs font-mono font-black text-slate-800 flex items-center gap-1 mt-0.5 uppercase tracking-tight">
                        <Flame size={12} className="text-red-500 shrink-0" /> {activeProduct.fireClass}
                      </span>
                    </div>
                  </div>

                  {/* Text descriptions */}
                  <div className="p-5 space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                        <Info size={12} className="text-slate-400" /> Bauphysikalische Wirkungsweise
                      </h4>
                      <p className="text-slate-600 leading-relaxed">{activeProduct.description}</p>
                    </div>

                    {/* Checkbox list of advantages */}
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                        <CheckCircle2 size={12} className="text-shiraz" /> Vorteile &amp; Eigenschaften im Ausbau
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-650">
                        {activeProduct.advantages.map((adv, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <CheckCircle size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span className="text-[11px] leading-tight font-medium text-slate-750">{adv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                      <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <Wrench size={12} className="text-shiraz" /> Typische Einbindung in Systeme
                      </h4>
                      <p className="text-slate-600 text-[11px] font-medium leading-relaxed">{activeProduct.systemIntegration}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 1.2: Interactive Systems Database */}
            {selectedSubCategory === 'systeme' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* System List Sidebar */}
                <div className="lg:col-span-5 flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 select-none">
                    Ausgewählte Trockenbau-Montagesysteme
                  </h4>
                  {DRY_SYSTEMS_DB.map((sys) => (
                    <button
                      key={sys.id}
                      onClick={() => setSelectedSystemId(sys.id)}
                      className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        selectedSystemId === sys.id
                          ? 'bg-shiraz/5 border-shiraz text-shiraz ring-1 ring-shiraz'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-350'
                      }`}
                    >
                      <div>
                        <p className="text-[9px] font-semibold text-slate-400 font-mono">{sys.code}</p>
                        <p className="text-xs font-bold leading-tight mt-0.5">{sys.name}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  ))}
                </div>

                {/* Selected System Specification Detail Panel */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
                  {/* Header */}
                  <div className="p-5 border-b border-slate-100 bg-slate-50">
                    <div className="text-[9px] font-bold text-slate-400 font-mono mb-1">{activeSystem.code}</div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">{activeSystem.name}</h3>
                  </div>

                  {/* Parameters Grid */}
                  <div className="p-5 grid grid-cols-2 gap-3 bg-slate-50/50">
                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Konstruktionsaufbau</span>
                      <span className="text-xs font-bold text-slate-800 leading-tight block mt-1">{activeSystem.structure}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Gesamtdicke ca.</span>
                      <span className="text-sm font-mono font-black text-slate-800 block mt-1">{activeSystem.thickness}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase flex items-center gap-1">
                        <Flame size={10} className="text-red-500" /> Brandschutzklasse
                      </span>
                      <span className="text-xs font-bold text-slate-800 block mt-1">{activeSystem.fireRating}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase flex items-center gap-1">
                        <Volume2 size={10} className="text-blue-500" /> Schalldämm-Mass R_w
                      </span>
                      <span className="text-xs font-bold text-slate-800 block mt-1">{activeSystem.soundRating}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Profil-Typ</span>
                      <span className="text-xs font-mono font-bold text-slate-800 block mt-1">{activeSystem.profileType}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Profilabstand Standard</span>
                      <span className="text-xs font-mono font-bold text-slate-800 block mt-1">{activeSystem.spacing}</span>
                    </div>
                  </div>

                  {/* Description & Application */}
                  <div className="p-5 space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                        <Compass size={12} className="text-slate-400" /> Systembeschreibung
                      </h4>
                      <p className="text-slate-600 leading-relaxed">{activeSystem.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                      <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-shiraz" /> Primäres Einsatzgebiet
                      </h4>
                      <p className="text-slate-600 text-[11px] font-medium leading-relaxed">{activeSystem.application}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General Profile Specs Banner (Metal Profiles DIN EN 14195) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <Layers size={14} className="text-shiraz" /> Systemkomponenten &amp; Metall-Profiltechnik (DIN EN 14195)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="font-semibold text-slate-900 border-b border-slate-200 pb-1.5 mb-1.5">Wand-Ständerwerke (Stahlstärke 0,6 mm verzinkt)</p>
                  <ul className="list-inside list-disc space-y-1 leading-relaxed">
                    <li><strong>UW-Rahmenprofil:</strong> Horizontale Befestigung an Boden und Decke zur formschlüssigen Fixierung des Wandverlaufs. Unterlegt mit elastischem Anschlussdichtband zur akustischen Trennung.</li>
                    <li><strong>CW-Ständerprofil:</strong> Vertikale Steh-Profile, werden lose eingestellt zur Aufnahme von Temperaturänderungen und Kriechbewegungen des Baukörpers. Ausstanzungen für Kabeldurchführungen.</li>
                    <li><strong>UA-Aussteifungsprofil:</strong> 2,0 mm starke massive Spezial-Profile zur Lastaufnahme von schweren Türen und Sanitäreinbaugestellen.</li>
                  </ul>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="font-semibold text-slate-900 border-b border-slate-200 pb-1.5 mb-1.5">Deckenraster &amp; Korrosionsschutz</p>
                  <ul className="list-inside list-disc space-y-1 leading-relaxed">
                    <li><strong>UD-Wandprofil &amp; CD-Tragprofil:</strong> Horizontale Wandrahmen (UD) gekoppelt mit flächig justierbaren Tragprofilen (CD 60/27) an Schwingungshängern zur hocheffektiven Körperschallminderung.</li>
                    <li><strong>Schnellbauschrauben (DIN 18182):</strong> Phosphatbeschichtet (mattschwarz) gegen aggressive Säurekorrosion im feuchten Gipsbett. Feingewinde für Stahlbleche, Grobgewinde für Holzständerwerke.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Spachtelklassen & Bauphysik */}
        {activeTab === 'klassen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm">
              <h3 className="font-bold text-text-main mb-2">Oberflächenqualitäten nach Bundesverband der Gipsindustrie</h3>
              <p className="text-text-main/80 text-xs">
                Die Spachtelklassen regeln die optischen und ebenheitstechnischen Abnahmekriterien für Gipsplatten-Oberflächen vor Maler- oder Tapezierarbeiten. Bei fehlender Vereinbarung gilt stets die Standardspachtelung Q2 als vereinbart.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-home-grau/30 rounded-xl p-4 bg-white relative overflow-hidden">
                <span className="absolute top-2 right-2 text-3xl font-black text-home-grau/10">Q 1</span>
                <h4 className="font-bold text-text-main text-lg mb-2">Klasse Q1</h4>
                <p className="text-xs text-text-main/70 mb-3"><strong>Grundverspachtelung:</strong> Nur Stoßfugen füllen und sichtbare Teile der Schnellbauschrauben überspachteln.</p>
                <div className="bg-slate-50 p-2 rounded text-xxs text-slate-700 font-medium">
                  <strong>Eignung:</strong> Unter Fliesen, Platten, Bekleidungen, Putzen sowie dicken Bahnenwaren.
                </div>
              </div>

              <div className="border border-home-grau/30 rounded-xl p-4 bg-white relative overflow-hidden">
                <span className="absolute top-2 right-2 text-3xl font-black text-home-grau/10">Q 2</span>
                <h4 className="font-bold text-text-main text-lg mb-2">Klasse Q2</h4>
                <p className="text-xs text-text-main/70 mb-3"><strong>Standardspachtelung:</strong> Q1 mit Nachspachteln/Anspachteln für einen stufenlosen Übergang zur Plattenoberfläche.</p>
                <div className="bg-slate-50 p-2 rounded text-xxs text-slate-700 font-medium">
                  <strong>Eignung:</strong> Raufasertapeten, matte füllende Wandfarben (mit Walze appliziert), gröbere Oberputze.
                </div>
              </div>

              <div className="border border-home-grau/30 rounded-xl p-4 bg-white relative overflow-hidden">
                <span className="absolute top-2 right-2 text-3xl font-black text-home-grau/10">Q 3</span>
                <h4 className="font-bold text-text-main text-lg mb-2">Klasse Q3</h4>
                <p className="text-xs text-text-main/70 mb-3"><strong>Sonderverspachtelung:</strong> Q2 mit einer breiteren Spachtelung der Fugen sowie einem vollflächigen Porenverschluss.</p>
                <div className="bg-amber-50 text-amber-900 p-2 rounded text-xxs font-medium">
                  <strong>Eignung:</strong> Feinstrukturierte Tapeten, matte Anstriche, feine Oberputze. Abzeichnung bei Streiflicht möglich.
                </div>
              </div>

              <div className="border border-home-grau/30 rounded-xl p-4 bg-white relative overflow-hidden">
                <span className="absolute top-2 right-2 text-3xl font-black text-home-grau/10">Q 4</span>
                <h4 className="font-bold text-text-main text-lg mb-2">Klasse Q4</h4>
                <p className="text-xs text-text-main/70 mb-3"><strong>Vollflächige Spachtelung:</strong> Vollflächige Überzugsschicht (Schichtdicke &gt; 1 mm) und feinstes Schleifen der Oberfläche.</p>
                <div className="bg-emerald-50 text-emerald-900 p-2 rounded text-xxs font-medium">
                  <strong>Eignung:</strong> Glänzende Beschichtungen, Metall- oder Lacktapeten, Spachtel-/Glätttechniken. Minimale Schattenfreiheit bei Streiflicht.
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-bold text-home-prim text-lg mb-3">Bauphysikalische Kennwerte von Metallständerwänden</h3>
              <div className="overflow-x-auto text-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-off-white border-b border-home-grau/30">
                      <th className="p-3 font-bold">Wandaufbau</th>
                      <th className="p-3 font-bold">Profilbreite (mm)</th>
                      <th className="p-3 font-bold">Wanddicke (mm)</th>
                      <th className="p-3 font-bold">Beplankung (je Seite)</th>
                      <th className="p-3 font-bold">Schallschutz <InlineMath math="R_w" /> (dB)</th>
                      <th className="p-3 font-bold">Brandschutzklasse</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/10">
                    <tr>
                      <td className="p-3">CW 50 - einfach beplankt</td>
                      <td className="p-3">50</td>
                      <td className="p-3">75</td>
                      <td className="p-3">1x 12,5 mm GKB</td>
                      <td className="p-3">ca. 45 dB</td>
                      <td className="p-3">F 30-A (mit GKF)</td>
                    </tr>
                    <tr>
                      <td className="p-3">CW 75 - einfach beplankt</td>
                      <td className="p-3">75</td>
                      <td className="p-3">100</td>
                      <td className="p-3">1x 12,5 mm GKB</td>
                      <td className="p-3">ca. 48 dB</td>
                      <td className="p-3">F 30-A</td>
                    </tr>
                    <tr className="bg-emerald-50/20">
                      <td className="p-3 font-semibold">CW 50 - doppelt beplankt (Standard)</td>
                      <td className="p-3">50</td>
                      <td className="p-3">100</td>
                      <td className="p-3">2x 12,5 mm GKB</td>
                      <td className="p-3">ca. 52 dB</td>
                      <td className="p-3">F 90-A (mit GKF)</td>
                    </tr>
                    <tr className="bg-emerald-50/20">
                      <td className="p-3 font-semibold">CW 75 - doppelt beplankt</td>
                      <td className="p-3">75</td>
                      <td className="p-3">125</td>
                      <td className="p-3">2x 12,5 mm GKB</td>
                      <td className="p-3">ca. 56 dB</td>
                      <td className="p-3">F 90-A</td>
                    </tr>
                    <tr>
                      <td className="p-3">Doppelständerwerk CW 50+50</td>
                      <td className="p-3">2x 50 (entkoppelt)</td>
                      <td className="p-3">155</td>
                      <td className="p-3">2x 12,5 mm GKB</td>
                      <td className="p-3">ca. 62 dB (hervorragend)</td>
                      <td className="p-3">F 90-A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-text-main/60 mt-3 italic">
                * Die angegebenen Schalldämm-Maße <InlineMath math="R_w" /> setzen eine lückenlose Mineralfaserdämmung der Hohlräume von mindestens 80% Dicke und ein beidseitig elastisch angeschlossenes Dichtungsband unter allen Randprofilen voraus.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Material Estimator */}
        {activeTab === 'rechner' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main text-lg mb-2 flex items-center gap-2">
                <Calculator className="text-shiraz" size={20} />
                Trockenbau Materialbedarfs-Rechner (Wände)
              </h3>
              <p className="text-xs text-text-main/80 mb-4">
                Errechnen Sie den materialtechnischen Richtbedarf für die Erstellung einer einfachen Metallständerwand auf der Baustelle basierend auf standardisierten Kalkulationsrichtwerten (Herstellerneutral). Einberechnet sind Verschnitte und branchenübliche Sicherheitsaufschläge (ca. 5%).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end mt-4">
                {/* Wall area */}
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">
                    Wandfläche (m²):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="20"
                    value={wallArea}
                    onChange={(e) => setWallArea(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-white border border-home-grau/30 rounded-lg p-2.5 text-sm text-text-main focus:ring-1 focus:ring-shiraz focus:outline-none"
                  />
                </div>

                {/* Beplankung */}
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">
                    Beplankung (je Wandseite):
                  </label>
                  <select
                    value={layerCount}
                    onChange={(e) => setLayerCount(parseInt(e.target.value) as 1 | 2)}
                    className="w-full bg-white border border-home-grau/30 rounded-lg p-2.5 text-sm text-text-main focus:ring-1 focus:ring-shiraz focus:outline-none"
                  >
                    <option value={1}>1-lagig (Einfach - 12,5mm)</option>
                    <option value={2}>2-lagig (Doppelt - 25,0mm)</option>
                  </select>
                </div>

                {/* Profilabstand */}
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">
                    Ständerachsabstand (cm):
                  </label>
                  <select
                    value={profileSpacing}
                    onChange={(e) => setProfileSpacing(parseFloat(e.target.value) as 62.5 | 31.25)}
                    className="w-full bg-white border border-home-grau/30 rounded-lg p-2.5 text-sm text-text-main focus:ring-1 focus:ring-shiraz focus:outline-none"
                  >
                    <option value={62.5}>62,5 cm (Standard)</option>
                    <option value={31.25}>31,25 cm (Erhöhter Schall/Fliesen)</option>
                  </select>
                </div>

                {/* Insulation */}
                <div className="flex items-center h-[42px]">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-main select-none">
                    <input
                      type="checkbox"
                      checked={includeInsulation}
                      onChange={(e) => setIncludeInsulation(e.target.checked)}
                      className="accent-shiraz size-4"
                    />
                    Inklusive Hohlraumdämmung
                  </label>
                </div>
              </div>
            </div>

            {/* Results Output */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 border border-home-grau/30 rounded-xl p-5 bg-white">
                <h4 className="font-bold text-home-prim text-md mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-shiraz" /> Errechnete Materialmengen
                </h4>
                <div className="space-y-4 divide-y divide-home-grau/10">
                  <div className="flex items-center justify-between pb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-main">Gipsbauplatten</p>
                      <p className="text-xs text-text-main/50">Beidseitig beplankt (inkl. 5% Puffer)</p>
                    </div>
                    <p className="text-base font-bold text-shiraz">{formatDeWert(plasterboardArea)} m²</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 pb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-main">CW-Ständerprofile</p>
                      <p className="text-xs text-text-main/50">Vertikales Ständerwerk (Schnittgrößen z.B. CW 50 / CW 75)</p>
                    </div>
                    <p className="text-base font-bold text-text-main">{formatDeWert(cwProfilesMeter)} lfm</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 pb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-main">UW-Boden/Deckenprofile</p>
                      <p className="text-xs text-text-main/50">Oberer und unterer Wandanschluss</p>
                    </div>
                    <p className="text-base font-bold text-text-main">{formatDeWert(uwProfilesMeter)} lfm</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 pb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-main">Schnellbauschrauben (25 / 35 / 45 mm)</p>
                      <p className="text-xs text-text-main/50">Phosphatiert mit Feingewinde für Ständerwerk</p>
                    </div>
                    <p className="text-base font-bold text-text-main">{screwsCount} Stk</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 pb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-main">Fugen- und Spachtelmasse (Kunststoff- o. Gips-Fugenspachtel)</p>
                      <p className="text-xs text-text-main/50">Für Fugen und Schraubenköpfe</p>
                    </div>
                    <p className="text-base font-bold text-text-main">{formatDeWert(jointFillerKg)} kg</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 pb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-main">Anschluss-Dichtungsband</p>
                      <p className="text-xs text-text-main/50">Elastisches Schaumstoffband für Entkopplung zur aRdT</p>
                    </div>
                    <p className="text-base font-bold text-text-main">{formatDeWert(sealTapeMeter)} lfm</p>
                  </div>

                  {includeInsulation && (
                    <div className="flex items-center justify-between pt-2 pb-2 text-emerald-800 bg-emerald-50/40 p-1.5 rounded">
                      <div>
                        <p className="text-sm font-semibold">Trennwand-Dämmung (Mineralwolle)</p>
                        <p className="text-xs text-emerald-700">Dicke angepasst an CW-Profil (40 / 60 / 80 mm)</p>
                      </div>
                      <p className="text-base font-bold">{formatDeWert(insulationArea)} m²</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-off-white flex flex-col gap-4">
                <h4 className="font-bold text-text-main text-sm flex items-center gap-1.5">
                  <AlertCircle size={16} className="text-home-grau" />
                  Kalkulations-Insidertips
                </h4>
                <div className="text-xs text-text-main/80 space-y-3">
                  <p>
                    <strong>1. Zweitlagige Verschraubung:</strong> Bei einer doppelten Beplankung muss die erste Lage nur mit ca. einem Drittel der Schrauben (Ständerachsabstand 75 cm) fixiert werden. Die zweite Lage wird voll verschraubt (Achsabstand 25 cm).
                  </p>
                  <p>
                    <strong>2. Fugenversatz:</strong> Vermeiden Sie unbedingt Kreuzfugen! Die Stoßfugen der Gipsplatten müssen zur Statiksicherheit und Rissvermeidung um mindestens <strong>400 mm</strong> zueinander horizontal versetzt werden. Bei doppelter Beplankung sind auch die Fugen der 1. und 2. Lage zueinander zu versetzen.
                  </p>
                  <p>
                    <strong>3. Schallentkopplung:</strong> Ohne das untergelegte Schaumstoff-Dichtungsband leitet die Trockenbauwand Körperschall ungehindert in Decke, Flur und Wände. Das ist einer der häufigsten Baumängel (Schallbrücke!).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Praxisbeispiele */}
        {activeTab === 'praxis' && <PraxisTabContent moduleKey="bp_trockenbau" />}

        {/* Tab 5: Zukunftstrends */}
        {activeTab === 'innovation' && <InnovationTabContent moduleKey="bp_trockenbau" />}
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Trockenbau', url: 'https://de.wikipedia.org/wiki/Trockenbau' },
          { title: 'Gipskarton', url: 'https://de.wikipedia.org/wiki/Gipskarton' },
          { title: 'Schallschutz', url: 'https://de.wikipedia.org/wiki/Schallschutz' }
        ]} 
        literatur={[ 
          'Karsten, W. (2021): Handbuch Trockenbau: Planung, Konstruktion, Ausführung (Rudolf Müller Verlag)',
          'Bundesverband der Gipsindustrie e.V.: Handbuch Trockenbau - Grundlagen und Details',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]} 
        regelwerke={[ 
          { title: 'DIN 18181 (Gipsplatten im Hochbau - Verarbeitung)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+18181' }, 
          { title: 'DIN 18180 (Gipsplatten - Arten und Anforderungen)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+18180' },
          { title: 'DIN EN 520 (Gipsplatten - Definitionen, Anforderungen und Prüfverfahren)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+520' },
          { title: 'DIN EN 14195 (Metallprofile für Unterkonstruktionen von Gipsplattensystemen)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+14195' },
          { title: 'DIN 4109 (Schallschutz im Hochbau - Mindestanforderungen und Berechnungsverfahren)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+4109' },
          { title: 'DIN 4102-4 (Brandverhalten von Baustoffen und Bauteilen - Katalog normativer Bauteile)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+4102-4' }
        ]} 
        formeln={[
          {
            formel: 'f_0 = \\frac{1}{2\\pi} \\cdot \\sqrt{s\' \\cdot \\left(\\frac{1}{m\'_1} + \\frac{1}{m\'_2}\\right)} \\approx 160 \\cdot \\sqrt{\\frac{1}{d} \\cdot \\left(\\frac{1}{m\'_1} + \\frac{1}{m\'_2}\\right)}',
            erklaerung: 'Resonanzfrequenz f_0 des Masse-Feder-Masse-Systems einer zweischaligen Trockenbauwand: Je niedriger f_0 (f₀ < 100 Hz, möglichst ≤ 80 Hz), desto besser die Schalldämmung Rw im bauakustisch relevanten Bereich (100-3150 Hz).',
            quelle: 'DIN 4109-2 / Gösele'
          },
          {
            formel: '\\text{CaSO}_4 \\cdot 2\\,\\text{H}_2\\text{O} \\xrightarrow{\\approx 100-140^{\\circ}\\text{C}} \\text{CaSO}_4 \\cdot \\frac{1}{2}\\,\\text{H}_2\\text{O} + 1{,}5\\,\\text{H}_2\\text{O} \\uparrow',
            erklaerung: 'Endotherme Dehydratationsreaktion im Brandfall: Kristallwasser (~21 Gew.-%) verdampft und kühlt den Raum hinter der Platte wirksam ab (Brandschutzwirkung F30 bis F120).',
            quelle: 'DIN EN 520 / DIN 4102'
          }
        ]} 
      />
    </div>
  );
}
