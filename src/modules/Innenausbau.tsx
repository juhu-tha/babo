import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  LayoutGrid, 
  Layers, 
  Box, 
  Shield, 
  Flame, 
  Activity, 
  BookOpen, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Calculator, 
  Thermometer,
  Volume2,
  Droplets,
  HardHat,
  Filter,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { useTabContext, TabType } from '../contexts/TabContext';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';

interface AusbauToolItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'trockenbau' | 'estrich_putz' | 'physik_labor' | 'normen_aufgaben';
  targetTab: TabType;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  features: string[];
  keyStandard: string;
  quickFact: string;
}

export default function Innenausbau() {
  const { setActiveTab } = useTabContext();
  const [mainTab, setMainTab] = useState<'uebersicht' | 'estriche' | 'trockenbau' | 'abdichtung' | 'rechner'>('uebersicht');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trockenbau' | 'estrich_putz' | 'physik_labor' | 'normen_aufgaben'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // CM-Rechner State
  const [estrichArt, setEstrichArt] = useState<'CT' | 'CA'>('CT');
  const [mitFussbodenheizung, setMitFussbodenheizung] = useState<boolean>(true);
  const [belagArt, setBelagArt] = useState<'fliesen' | 'parkett' | 'elastisch'>('parkett');
  const [gemessenerCM, setGemessenerCM] = useState<number>(1.8);

  // CM Grenzwerte nach DIN 18560-1 / DIN 18560-2
  const cmGrenzwert = useMemo(() => {
    if (estrichArt === 'CT') {
      return mitFussbodenheizung ? 1.8 : 2.0;
    } else {
      // CA / CAF
      return mitFussbodenheizung ? 0.3 : 0.5;
    }
  }, [estrichArt, mitFussbodenheizung]);

  const istBelegreif = gemessenerCM <= cmGrenzwert;

  const tools: AusbauToolItem[] = [
    {
      id: 'bp_trockenbau',
      title: 'Trockenbausysteme & Ständerwerke',
      subtitle: 'Metallunterkonstruktionen, Beplankungen & Systemwände',
      category: 'trockenbau',
      targetTab: 'bp_trockenbau',
      badge: 'Bauprodukt-Modul',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Box,
      description: 'Detaillierte Übersicht über CW/UW-Metallprofile, Holzständerwerke sowie Gipsplatten nach DIN EN 520 (GKB, GKBI, GKF). Berechnungen zu Schalldämmmaßen und Brandschutzwänden (F30–F90).',
      features: [
        'Einfach- und Doppelständerwerke (CW 50/75/100)',
        'Schraubabstände & Beplankungsregeln nach DIN 18181',
        'Akustik- und Brandschutzwand-Konstruktionen',
        'Fugenverspachtelung (Qualitätsstufen Q1 bis Q4)'
      ],
      keyStandard: 'DIN 18181 / DIN EN 520',
      quickFact: 'Zweischalige Trockenbauwände erreichen trotz geringer Masse durch biegeweiche Schalen hohe Schalldämmmaße (je nach Aufbau R_w über 55 dB).'
    },
    {
      id: 'bp_putz_estrich',
      title: 'Putz- & Estrichsysteme',
      subtitle: 'Innenputze, Heizestriche & Calciumsulfat',
      category: 'estrich_putz',
      targetTab: 'bp_putz_estrich',
      badge: 'Bauprodukt-Modul',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Layers,
      description: 'Gegenüberstellung aller mineralischen Ausbausysteme: Zementestriche (CT), Calciumsulfat-Fließestriche (CAF), Gussasphalt (AS) sowie Innenputze von Gipsmörtel (GP) bis Kalkputz (CS I).',
      features: [
        'Heizestrich auf Dämmschicht (Konstruktionsart A)',
        'Belegreife-Grenzwerte & CM-Feuchtemessung',
        'Verformungs- & Schwindrissrisiken (Aufschüsseln)',
        'Gips- vs. Kalkputze zur Raumklimaregulierung'
      ],
      keyStandard: 'DIN 18560 / DIN EN 13813',
      quickFact: 'Calciumsulfat-Fließestriche (CAF) schwinden gering; ohne Fußbodenheizung sind große fugenlose Felder möglich (Feldgröße nach Herstellerangabe).'
    },
    {
      id: 'ausbau',
      title: 'Ausbau, Abdichtung & Beläge',
      subtitle: 'Bodenaufbauten, Fliesen, Parkett & DIN 18534',
      category: 'estrich_putz',
      targetTab: 'ausbau',
      badge: 'Praxismodul',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: LayoutGrid,
      description: 'Umfassendes Fachmodul zu Ausbaumaterialien, Bodenbelägen (Echtholzparkett, Laminat, Linoleum) und normgerechten Innenraumabdichtungen im Verbund (AIV) unter Fliesen und Platten.',
      features: [
        'Wassereinwirkungsklassen W0-I bis W3-I nach DIN 18534',
        'Fliesenklassifizierung nach Wasseraufnahme (E ≤ 0,5 %)',
        'Schwimmende vs. vollflächige Parkettverklebung',
        'Dispersions-, Silikat- und Reaktionsharzanstriche'
      ],
      keyStandard: 'DIN 18534 / DIN 18157',
      quickFact: 'Bodengleiche Duschen fallen nach DIN 18534-1 in W2-I; Rohrdurchführungen und Abläufe sind in allen Klassen mit Dichtmanschetten bzw. Flanschen einzubinden.'
    },
    {
      id: 'gips',
      title: 'Bindemittel Gips & Calciumsulfat',
      subtitle: 'Materialwissenschaft, Hydratation & Brandschutzwirkung',
      category: 'trockenbau',
      targetTab: 'gips',
      badge: 'Baustoff-Modul',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: BookOpen,
      description: 'Tiefgehendes materialwissenschaftliches Profil von Baugips, Anhydrit und Stuckgips. Chemischer Kreislauf, Kristallwasser im Brandschutz sowie Treibreaktionen (Ettringit) bei feuchtem Kontakt von Gips und Zement.',
      features: [
        'Hydratation: CaSO₄ · ½ H₂O + 1½ H₂O → CaSO₄ · 2 H₂O',
        'Physikalischer W/G-Wert und Porenbildung',
        'Kristallwasser als Brandschutzschild (~20 M.-% H₂O)',
        'Verbot des Zement-Gips-Direktkontakts im Feuchten'
      ],
      keyStandard: 'DIN EN 13279-1',
      quickFact: 'Im Brandfall verdampfen aus einer 15 mm GKF-Platte rund 2–3 Liter chemisch gebundenes Wasser je Quadratmeter und verzögern die Erwärmung (Größenordnung).'
    },
    {
      id: 'bp_daemmung',
      title: 'Dämmstoffe im Innenausbau',
      subtitle: 'Trittschall, Hohlraumdämpfung & Innendämmung',
      category: 'physik_labor',
      targetTab: 'bp_daemmung',
      badge: 'Dämmungs-Modul',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Thermometer,
      description: 'Auswahl und Bemessung von Dämmstoffen im Innenausbau: Mineralwolle-Matten zur Vermeidung von Hohlraumresonanzen, elastifizierte EPS-T Trittschalldämmung und Kalziumsilikat-Innendämmung.',
      features: [
        'Strömungswiderstand r ≥ 5 kPa·s/m² für Wanddämmung',
        'Dynamische Steifigkeit s\' von Trittschalldämmplatten',
        'Schimmelhemmende Calciumsilikatplatten (pH ~ 10)',
        'Nichtbrennbarkeit A1 für Installationsschächte'
      ],
      keyStandard: 'DIN EN 13162 / DIN 4108',
      quickFact: 'Ein schwimmender Estrich auf Trittschalldämmung mit niedriger dynamischer Steifigkeit s\' kann den Trittschall einer Massivdecke um rund 25–30 dB mindern (ΔL_w).'
    },
    {
      id: 'labor',
      title: 'Laborprüfstand: Haftzugprüfung',
      subtitle: 'Virtuelle Abreißprüfung an Estrich & Fliesenkleber',
      category: 'physik_labor',
      targetTab: 'labor',
      badge: 'Labor-Simulator',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: Activity,
      description: 'Interaktiver Laborversuch nach DIN EN 1542 / DIN EN 12004: Prüfen Sie die Haftzugfestigkeit von Verbundestrich auf Beton mit Haftschlämme oder Flexkleber auf Calciumsulfatestrich.',
      features: [
        'Prüfstempeldurchmesser 50 mm & Ringnutbohrung',
        'Simulierte Bruchbilder (Adhäsions- vs. Kohäsionsbruch)',
        'Anforderung Verbundestrich: fh ≥ 1,0 N/mm²',
        'Einfluss von Estrichanschleifen & Voranstrich'
      ],
      keyStandard: 'DIN EN 12004 / DIN EN 1542',
      quickFact: 'Calciumsulfat-Fließestriche werden vor der Belagsverlegung in der Regel angeschliffen, abgesaugt und grundiert (Herstellerangaben beachten).'
    },
    {
      id: 'schallschutz',
      title: 'Bauakustik & Schallschutz',
      subtitle: 'Biegeweiche Wandschalen & Trittschallminderung',
      category: 'physik_labor',
      targetTab: 'schallschutz',
      badge: 'Bauphysik-Modul',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Volume2,
      description: 'Berechnung und Optimierung der Luft- und Trittschalldämmung im Trockenbau: Masse-Feder-Masse-Prinzip, Koinzidenzfrequenz, elastische Randanschlüsse und Vermeidung von Schallbrücken.',
      features: [
        'Zweischalige Trennwände: Resonanzfrequenz f₀ < 100 Hz, möglichst ≤ 80 Hz',
        'Trittschallverbesserung ΔLw durch schwimmende Estriche',
        'Entkopplung von Boden- & Deckenanschlussprofilen',
        'Flankenübertragung über Decken und Vorwandelemente'
      ],
      keyStandard: 'DIN 4109 / VDI 4100',
      quickFact: 'Schon eine einzelne Schallbrücke (z. B. Mörtelreste am Randdämmstreifen) kann den Trittschallschutz um 10 dB und mehr verschlechtern.'
    },
    {
      id: 'feuchteschutz',
      title: 'Feuchteschutz & Dampfdiffusion',
      subtitle: 'Tauwasserausfall, Dampfbremsen & Baufeuchte',
      category: 'physik_labor',
      targetTab: 'feuchteschutz',
      badge: 'Bauphysik-Modul',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: Droplets,
      description: 'Nachweis der Tauwasserfreiheit und Dampfdiffusion bei Innenausbau- und Dämmkonstruktionen: Glaser-Diagramm, sd-Werte von Dampfbremsen und Austrocknungsverhalten von Nassbaustoffen.',
      features: [
        'Diffusionswiderstandszahl µ und Sperrwert sd',
        'Feuchtepufferung durch Lehm- und Gipsputz',
        'Austrocknung von Zement- vs. Calciumsulfatestrich',
        'Vermeidung von Feuchteschäden hinter Wandbekleidungen'
      ],
      keyStandard: 'DIN 4108-3',
      quickFact: 'Gipsplatten puffern Feuchtespitzen; dauerhaft hohe Luftfeuchte ist zu vermeiden (Grenzen nach DIN 18181 und Herstellerangaben).'
    },
    {
      id: 'brandschutz',
      title: 'Vorbeugender Brandschutz',
      subtitle: 'Feuerwiderstandsklassen, Bekleidungen & Abschottungen',
      category: 'physik_labor',
      targetTab: 'brandschutz',
      badge: 'Bauphysik-Modul',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: Flame,
      description: 'Nachweis von F30- bis F90-Konstruktionen im Trockenbau: Plattendicken, zweilagige Beplankungen, Brandschutzkappen für Einbauleuchten und Kabelabschottungen in Brandwänden.',
      features: [
        'Klassifizierung nach DIN EN 13501 (EI 30 bis EI 90)',
        'Brandschutz-Gipsplatten GKF (DIN EN 520 Typ DF)',
        'Schmelzpunkt von Mineralwolle > 1000 °C (Steinwolle)',
        'Kompensationsmaßnahmen bei Holzbau-Innenausbau'
      ],
      keyStandard: 'DIN 4102-4 / DIN EN 13501',
      quickFact: 'In notwendigen Treppenräumen und Fluren müssen Bekleidungen, Putze und Dämmstoffe in der Regel nichtbrennbar sein (MBO §§ 35, 36; Landesrecht beachten).'
    },
    {
      id: 'aufgaben_bauprodukte',
      title: 'Prüfungsaufgaben: Ausbau & Bauprodukte',
      subtitle: 'Klausurrelevante Fragen & Berechnungen',
      category: 'normen_aufgaben',
      targetTab: 'aufgaben_bauprodukte',
      badge: 'Klausurtraining',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      description: 'Interaktive Übungs- und Klausuraufgaben zu Trockenbausystemen, Estrichbemessung, Fugenausbildung, Feuchtemessung mit der CM-Methode und Haftzugnachweisen.',
      features: [
        'Multiple-Choice & Berechnungsschritte mit KaTeX',
        'Detaillierte Musterlösungen & Normenverweise',
        'Typische Fallstricke in Prüfungen der Baustoffkunde',
        'Bewertung von Schadensfällen (z.B. Estrichschüsseln)'
      ],
      keyStandard: 'Prüfungsordnung THA',
      quickFact: 'Typische Prüfungsfrage: Warum sind zementgebundene Stoffe und Calciumsulfat bei Feuchteeinwirkung zu trennen? (Ettringitbildung)'
    },
    {
      id: 'wta',
      title: 'WTA-Merkblätter: Innensanierung',
      subtitle: 'Nachträgliche Abdichtung & Schimmelsanierung',
      category: 'normen_aufgaben',
      targetTab: 'wta',
      badge: 'Regelwerk-Modul',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: Shield,
      description: 'Leitfäden der Wissenschaftlich-Technischen Arbeitsgemeinschaft für Bauwerkserhaltung: WTA-Merkblatt 6-4 (Innendämmung), Sanierputzsysteme und mikrobieller Befall im Innenausbau.',
      features: [
        'Sanierputzsysteme WTA (Porenvolumen > 45 Vol.-%)',
        'Kondensationsrisiko bei fehlerhafter Innendämmung',
        'Rücktrocknungspotenzial von Außenwänden',
        'Messtechnische Erfassung von Schimmelpilzbefall'
      ],
      keyStandard: 'WTA Merkblatt 6-4 / 2-9',
      quickFact: 'Sanierputze lagern Salze für begrenzte Zeit im Porensystem ein und verringern Ausblühungen an der Oberfläche (WTA-Merkblatt 2-9).'
    },
    {
      id: 'rechnung_u_wert',
      title: 'Rechner: U-Wert von Schichtaufbauten',
      subtitle: 'Berechnung von Trockenbau- & Dachaufbauten',
      category: 'normen_aufgaben',
      targetTab: 'rechnung_u_wert',
      badge: 'Interaktiver Rechner',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      icon: Calculator,
      description: 'Berechnen Sie den Wärmedurchgangskoeffizienten U für mehrschichtige Wand-, Decken- und Fußbodenaufbauten nach DIN EN ISO 6946 inklusive Übergangswiderständen.',
      features: [
        'Berechnung von Wärmedurchlasswiderständen R = d / λ',
        'Einfluss von Luftschichten & Dämmstoffstärken',
        'Nachweis der Grenzwerte nach Gebäudeenergiegesetz (GEG)',
        'Temperaturverlauf im Querschnitt grafisch visualisiert'
      ],
      keyStandard: 'DIN EN ISO 6946',
      quickFact: 'Der Wärmeübergangswiderstand Rsi beträgt für Decken bei Wärmestrom nach oben 0,10 m²K/W, nach unten (z.B. Kellerdecke) 0,17 m²K/W.'
    }
  ];

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesQuery = 
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.keyStandard.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [tools, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
          <div>
            <span className="text-[11px] font-bold text-shiraz tracking-widest uppercase font-mono">
              Cluster III: Entwurf &amp; Bemessung • Fachbereich Ausbau
            </span>
            <h2 className="text-2xl font-bold text-text-main flex items-center gap-2 mt-1">
              <LayoutGrid className="text-shiraz" size={26} /> Innenausbau &amp; Ausbausysteme
            </h2>
            <p className="text-xs text-text-main/70 mt-1">
              Trockenbausysteme, mineralische Estriche, Verbundabdichtungen, Bauakustik und Belegreifeprüfung nach DIN 18560, DIN EN 520 &amp; DIN 18534.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-shiraz/10 text-shiraz border border-shiraz/20 flex items-center gap-1.5">
              <HardHat size={14} /> Fachingenieur Ausbau (ibi)
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-4 pb-1">
          <button aria-pressed={mainTab === 'uebersicht'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              mainTab === 'uebersicht' 
                ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('uebersicht')}
          >
            <LayoutGrid size={15} /> Modul-Navigator
          </button>
          <button aria-pressed={mainTab === 'estriche'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              mainTab === 'estriche' 
                ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('estriche')}
          >
            <Layers size={15} /> Estriche (CT/CA/AS) &amp; Belegreife
          </button>
          <button aria-pressed={mainTab === 'trockenbau'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              mainTab === 'trockenbau' 
                ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('trockenbau')}
          >
            <Box size={15} /> Trockenbau &amp; Gipsplatten
          </button>
          <button aria-pressed={mainTab === 'abdichtung'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              mainTab === 'abdichtung' 
                ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('abdichtung')}
          >
            <Droplets size={15} /> Verbundabdichtung (DIN 18534)
          </button>
          <button aria-pressed={mainTab === 'rechner'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              mainTab === 'rechner' 
                ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setMainTab('rechner')}
          >
            <Calculator size={15} /> CM-Restfeuchte-Rechner
          </button>
        </div>
      </div>

      {/* TAB 1: UEBERSICHT / MODUL-NAVIGATOR */}
      {mainTab === 'uebersicht' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {[
                { id: 'all', label: 'Alle Ausbau-Tools (12)', icon: Filter },
                { id: 'trockenbau', label: 'Trockenbausysteme', icon: Box },
                { id: 'estrich_putz', label: 'Estrich, Putz & Belag', icon: Layers },
                { id: 'physik_labor', label: 'Physik & Laborversuche', icon: Activity },
                { id: 'normen_aufgaben', label: 'Normen & Übungen', icon: BookOpen }
              ].map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-2xs cursor-pointer ${
                      isActive
                        ? 'bg-shiraz text-white border-shiraz shadow-sm'
                        : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                    }`}
                  >
                    <Icon size={13} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 text-text-main/40" size={15} />
              <input
                type="text"
                placeholder="Thema, Norm oder Baustoff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-home-grau/30 bg-off-white/50 focus:bg-white focus:border-shiraz focus:outline-hidden transition-all text-text-main"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-[10px] text-text-main/50 hover:text-text-main"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Grid of Tool Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="bg-white rounded-2xl border border-home-grau/30 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-home-grau/60"
                >
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${tool.badgeColor}`}>
                        {tool.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-off-white px-2 py-0.5 rounded border border-home-grau/20">
                        {tool.keyStandard}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mt-1">
                      <div className="p-2.5 rounded-xl bg-off-white border border-home-grau/25 text-shiraz group-hover:scale-105 transition-transform shrink-0">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-text-main group-hover:text-shiraz transition-colors leading-tight">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-text-main/60 mt-0.5 leading-snug">
                          {tool.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-text-main/80 leading-relaxed mt-1">
                      {tool.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-home-grau/15 space-y-1">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-text-main/75">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 p-2.5 rounded-lg bg-off-white/80 border border-home-grau/20 text-[11px] text-text-main/70 italic">
                      💡 {tool.quickFact}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/70 border-t border-home-grau/20 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-medium text-slate-500">
                      Tab: <code className="text-text-main font-bold">#{tool.targetTab}</code>
                    </span>
                    <button
                      onClick={() => setActiveTab(tool.targetTab)}
                      className="px-3 py-1.5 rounded-lg bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group/btn"
                    >
                      <span>Modul öffnen</span>
                      <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ESTRICHE & BELEGREIFE (DEEP DIVE) */}
      {mainTab === 'estriche' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Layers className="text-shiraz" size={20} /> Baustoffkunde der Estriche nach DIN EN 13813 &amp; DIN 18560
              </h3>
              <p className="text-xs text-text-main/75 mt-1 leading-relaxed">
                Estriche erfüllen im Innenausbau tragende, wärmeverteilende und lastverteilende Aufgaben. Bindemittelart und Trocknungsverhalten bestimmen maßgeblich die Belegreife.
              </p>
            </div>

            {/* Matrix of Estrich Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-text-main">Zementestrich (CT)</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Hydraulisch</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Bestehend aus Zement (CEM I/II), Gesteinskörnung 0/8 mm und Wasser. Unempfindlich gegen Dauernässe, universell im Innen- und Außenbereich einsetzbar.
                </p>
                <div className="mt-2 pt-2 border-t border-home-grau/20 text-[11px] space-y-1">
                  <div><strong>Schwindmaß:</strong> ca. 0,4 – 0,6 mm/m (Schwindrissgefahr!)</div>
                  <div><strong>Belegreife unbeheizt:</strong> ≤ 2,0 CM-%</div>
                  <div><strong>Belegreife beheizt:</strong> ≤ 1,8 CM-%</div>
                  <div className="text-amber-800 text-[10px] mt-1 font-semibold">⚠️ Neigt bei schneller Austrocknung zum Aufschüsseln der Randbereiche.</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-text-main">Calciumsulfatestrich (CA/CAF)</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Calciumsulfat</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Bestehend aus Anhydrit oder Alphahalbhydrat. Nahezu schwind- und spannungsfrei, hervorragend als Fließestrich (CAF) für Fußbodenheizungen geeignet.
                </p>
                <div className="mt-2 pt-2 border-t border-home-grau/20 text-[11px] space-y-1">
                  <div><strong>Schwindmaß:</strong> minimal (&lt; 0,1 mm/m)</div>
                  <div><strong>Belegreife unbeheizt:</strong> ≤ 0,5 CM-%</div>
                  <div><strong>Belegreife beheizt:</strong> ≤ 0,3 CM-% (Richtwert nach Merkblatt „Schnittstellenkoordination bei beheizten Fußbodenkonstruktionen“)</div>
                  <div className="text-rose-800 text-[10px] mt-1 font-semibold">🚫 Streng feuchteempfindlich – kein Einsatz in Nassräumen (W2-I/W3-I) oder im Freien.</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-text-main">Gussasphalt (AS)</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">Thermoplastisch</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Gemisch aus Bitumen, Füller, Sand und Splitt, heiß eingebaut bei ca. 220–250 °C. Bringt kein Wasser in den Bau ein und ist nach dem Erkalten sofort belegreif.
                </p>
                <div className="mt-2 pt-2 border-t border-home-grau/20 text-[11px] space-y-1">
                  <div><strong>Wassergehalt:</strong> 0,0 % (keine Trocknungszeit)</div>
                  <div><strong>Belegreife:</strong> Sobald erkaltet (nach ca. 2–4 Stunden)</div>
                  <div><strong>Brandschutz:</strong> Schwer entflammbar, raucharm</div>
                  <div className="text-slate-600 text-[10px] mt-1 font-semibold">ℹ️ Idealer Schnellbauestrich; erfordert temperaturbeständige Dämmschichten.</div>
                </div>
              </div>
            </div>

            {/* CM-Messung Detailbox */}
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2">
                <Activity size={15} className="text-shiraz" /> Das Calciumcarbid-Verfahren (CM-Methode) nach DIN 18560
              </h4>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Die CM-Messung ist in Deutschland das übliche Verfahren zur Prüfung der Belegreife (DIN 18560-1). Estrichgut aus dem gesamten Querschnitt wird mit Calciumcarbid in einer Druckflasche zerkleinert. Das freie Wasser reagiert unter Acetylen-Gasentwicklung:
              </p>
              <div className="my-2 p-3 bg-white rounded-lg border border-home-grau/20 text-center font-mono text-xs">
                <InlineMath math="CaC_2 + 2\,H_2O \rightarrow Ca(OH)_2 + C_2H_2 \uparrow" />
              </div>
              <p className="text-[11px] text-text-main/70 leading-relaxed">
                Der entstehende Gasdruck im Druckbehälter verhält sich proportional zum Wassergehalt der Probe. Elektronische Feuchtemessgeräte eignen sich nur zur Vorprüfung und ersetzen die CM-Messung nicht.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TROCKENBAU & GIPSPLATTEN (DEEP DIVE) */}
      {mainTab === 'trockenbau' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Box className="text-shiraz" size={20} /> Plattenwerkstoffe im Trockenbau nach DIN EN 520 &amp; DIN 18180
              </h3>
              <p className="text-xs text-text-main/75 mt-1 leading-relaxed">
                Trockenbausysteme basieren auf werkseitig vorgefertigten Plattenwerkstoffen, die auf schlanken CW/UW-Metallständerwerken oder Holzrippen montiert werden.
              </p>
            </div>

            {/* Plattenarten */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Typ A (GKB)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Standard</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Klassische Bauplatte mit Kartonummantelung. Für Standard-Trennwände und Deckenbekleidungen ohne besondere Brand- oder Feuchteschutzanforderungen.
                </p>
                <div className="text-[11px] text-slate-500 font-mono mt-auto">Karton: Elfenbein/Grau</div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Typ DF (GKF)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">Feuerschutz</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Plattenkern mit Glasfasern armiert, die das Gefüge bei Brandeinwirkung auch nach Verdampfen des Kristallwassers mechanisch zusammenhalten.
                </p>
                <div className="text-[11px] text-rose-700 font-mono mt-auto">Karton: Roter Stempel</div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Typ H2 (GKBI)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Imprägniert</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Kern und Karton silikonisiert zur Verringerung der kapillaren Wasseraufnahme (≤ 10 %). Üblich in häuslichen Bädern; eine Abdichtung nach DIN 18534 bleibt bei Spritzwasser erforderlich.
                </p>
                <div className="text-[11px] text-emerald-700 font-mono mt-auto">Karton: Grün</div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Gipsfaserplatte</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Gipsfaserplatte</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Homogene Mischung aus Gips und recycelten Zellulosefasern ohne Kartonmantel. Stoßfest, je nach Produkt nichtbrennbar und als aussteifende Beplankung nach Zulassung einsetzbar.
                </p>
                <div className="text-[11px] text-indigo-700 font-mono mt-auto">Struktur: Faserverbund</div>
              </div>
            </div>

            {/* Verspachtelung Q1 bis Q4 */}
            <div className="border border-home-grau/30 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-shiraz" /> Verspachtelungsstufen (Qualitätsstufen Q1 bis Q4 nach IGG-Merkblatt 2)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-800 block mb-1">Stufe Q1: Grundverspachtelung</strong>
                  <p className="text-text-main/75">Füllen der Fugen und Überziehen der Schraubenköpfe mit Fugenband (Bewehrungsstreifen). Nur als Untergrund für Fliesenbeläge geeignet.</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-800 block mb-1">Stufe Q2: Standardverspachtelung</strong>
                  <p className="text-text-main/75">Nachspachteln bis zum stufenlosen Übergang. Geeignet für Raufasertapeten, mittel und grob strukturierte Wandbekleidungen sowie matte, füllende Anstriche.</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-800 block mb-1">Stufe Q3: Sonderverspachtelung</strong>
                  <p className="text-text-main/75">Breites Ausspachteln der Fugen und scharfes Abziehen der gesamten Plattenoberfläche mit Finish-Paste. Für feine Tapeten und matte Anstriche.</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-800 block mb-1">Stufe Q4: Vollflächenspachtelung</strong>
                  <p className="text-text-main/75">Vollflächiger Spachtelauftrag (&gt; 1 mm) über die gesamte Wand. Erforderlich bei Streiflicht, glänzenden Lacken, Metalltapeten und Stucco-Techniken.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VERBUNDABDICHTUNG DIN 18534 */}
      {mainTab === 'abdichtung' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Droplets className="text-shiraz" size={20} /> Innenraumabdichtung im Verbund (AIV) nach DIN 18534
              </h3>
              <p className="text-xs text-text-main/75 mt-1 leading-relaxed">
                Fliesen- und Plattenbeläge sind durch ihre Zementfugen nicht wasserdicht. Darunterliegende feuchteempfindliche Ausbaustoffe (Gipsplatten, Calciumsulfatestriche) müssen durch normgerechte Verbundabdichtungen geschützt werden.
              </p>
            </div>

            {/* Wassereinwirkungsklassen W0-I bis W3-I */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Klasse W0-I</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Gering</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Flächen mit seltenem Spritzwasserkontakt (z. B. Wandflächen über Waschbecken in Wohnungen und Gäste-WCs).
                </p>
                <div className="text-[11px] text-slate-600 mt-auto font-semibold">Keine Abdichtung auf feuchteunempfindlichen Untergründen zwingend gefordert.</div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Klasse W1-I</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">Mäßig</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Wandflächen über Badewannen und in Duschen im häuslichen Bereich; Bodenflächen im Bad ohne Ablauf.
                </p>
                <div className="text-[11px] text-blue-800 mt-auto font-semibold">Verbundabdichtung flüssig (Polymerdispersion) zulässig.</div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Klasse W2-I</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Hoch</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Wand- und Bodenflächen in bodengleichen Duschen, gewerblichen Küchen und Sanitärräumen mit Bodenablauf.
                </p>
                <div className="text-[11px] text-amber-800 mt-auto font-semibold">Bahnenförmige Abdichtung (AIV-B) oder MDS vorgeschrieben; Dichtmanschetten Pflicht!</div>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">Klasse W3-I</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">Sehr hoch</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Flächen mit sehr häufiger oder langanhaltender Einwirkung von Spritz- und Brauchwasser (z. B. Hallenbäder, gewerbliche Großküchen).
                </p>
                <div className="text-[11px] text-rose-800 mt-auto font-semibold">Reaktionsharzabdichtungen (Epoxid / Polyurethan) oder mineralische Dichtschlämmen.</div>
              </div>
            </div>

            {/* Baustellendetails & Fehlerquellen */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 text-xs text-text-main/80 space-y-2">
              <strong className="text-amber-900 font-bold flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-amber-600" /> Häufige Schadensursachen im Ausbau:
              </strong>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-text-main/75">
                <li>Fehlende oder mangelhaft eingearbeitete Dichtmanschetten an Sanitär-Rohrdurchführungen und Bodenabläufen.</li>
                <li>Verwendung ungeeigneter Silikone an Dehnungsfugen (Silikonfugen sind reine Wartungsfugen, keine Abdichtung!).</li>
                <li>Verlegung von Fliesenbelägen auf zu feuchten Zement- oder Calciumsulfatestrichen vor Erreichen der Belegreife.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CM-RESTFEUCHTE-RECHNER */}
      {mainTab === 'rechner' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Calculator className="text-shiraz" size={20} /> Interaktiver Belegreife- &amp; CM-Restfeuchterechner
              </h3>
              <p className="text-xs text-text-main/75 mt-1 leading-relaxed">
                Prüfen Sie die Belegreife anhand üblicher Richtwerte nach Merkblatt „Schnittstellenkoordination bei beheizten Fußbodenkonstruktionen“ (Zementestrich ≤ 2,0 bzw. beheizt ≤ 1,8 CM-%, Calciumsulfatestrich ≤ 0,5 bzw. beheizt ≤ 0,3 CM-%).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parameters */}
              <div className="space-y-4 p-5 rounded-xl border border-home-grau/25 bg-slate-50/40">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  1. Estrich- &amp; Belagsparameter
                </span>

                <div>
                  <label className="text-xs font-bold text-text-main block mb-1.5">Estrich-Bindemittel:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button aria-pressed={estrichArt === 'CT'}
                      type="button"
                      onClick={() => setEstrichArt('CT')}
                      className={`p-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                        estrichArt === 'CT' 
                          ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      Zementestrich (CT)
                    </button>
                    <button aria-pressed={estrichArt === 'CA'}
                      type="button"
                      onClick={() => setEstrichArt('CA')}
                      className={`p-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                        estrichArt === 'CA' 
                          ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      Calciumsulfat (CA/CAF)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-main block mb-1.5">Fußbodenheizung (Heizestrich):</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMitFussbodenheizung(true)}
                      className={`p-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                        mitFussbodenheizung 
                          ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      Ja (mit Heizung)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMitFussbodenheizung(false)}
                      className={`p-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                        !mitFussbodenheizung 
                          ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                      }`}
                    >
                      Nein (unbeheizt)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-main block mb-1.5">Geplanter Oberbodenbelag:</label>
                  <select aria-label="Geplanter Oberbodenbelag"
                    value={belagArt}
                    onChange={(e) => setBelagArt(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-home-grau/30 bg-white text-xs font-medium text-text-main focus:border-shiraz focus:outline-hidden"
                  >
                    <option value="parkett">Parkett / Massivholz / Laminat (feuchteempfindlich)</option>
                    <option value="fliesen">Keramische Fliesen / Naturstein</option>
                    <option value="elastisch">Elastische Beläge (Vinyl / Linoleum / Kautschuk)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-text-main">Gemessener CM-Wert:</label>
                    <span className="text-sm font-mono font-bold text-shiraz">{formatDeZahl(gemessenerCM, 1)} CM-%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="4.0"
                    step="0.1"
                    value={gemessenerCM}
                    onChange={(e) => setGemessenerCM(parseFloat(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>0,1 %</span>
                    <span>1,0 %</span>
                    <span>2,0 %</span>
                    <span>3,0 %</span>
                    <span>4,0 %</span>
                  </div>
                </div>
              </div>

              {/* Live Result Evaluation */}
              <div className="flex flex-col justify-between p-5 rounded-xl border border-home-grau/25 bg-slate-50/40">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    2. Normative Beurteilung der Belegreife
                  </span>

                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    istBelegreif 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}>
                    {istBelegreif ? (
                      <CheckCircle2 size={24} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={24} className="text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-bold text-base">
                        {istBelegreif ? 'ESTRICH IST BELEGREIF' : 'ACHTUNG: NOCH NICHT BELEGREIF!'}
                      </h4>
                      <p className="text-xs mt-1 leading-relaxed">
                        {istBelegreif 
                          ? `Der gemessene Feuchtigkeitsgehalt von ${formatDeZahl(gemessenerCM, 1)} CM-% liegt unter dem Richtwert von ${formatDeZahl(cmGrenzwert, 1)} CM-%. Belegreife für ${belagArt} im Sinne dieses Richtwerts erreicht; Herstellerangaben des Belags beachten.`
                          : `Der gemessene Wert (${formatDeZahl(gemessenerCM, 1)} CM-%) liegt über dem Richtwert von ${formatDeZahl(cmGrenzwert, 1)} CM-%. Eine Verlegung führt zu schweren Folgeschäden (Parkettaufwölbung, Schimmelbildung, Hohllagen)!`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                      <span className="text-slate-500 text-[10px] block">Zulässiger Grenzwert:</span>
                      <strong className="text-text-main text-sm">≤ {formatDeZahl(cmGrenzwert, 1)} CM-%</strong>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                      <span className="text-slate-500 text-[10px] block">Differenz / Überschreitung:</span>
                      <strong className={`text-sm ${istBelegreif ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {(gemessenerCM - cmGrenzwert > 0 ? '+' : '') + formatDeZahl((gemessenerCM - cmGrenzwert), 1)} CM-%
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/70">
                  <strong>Rechtlicher Hinweis:</strong> Nach VOB/C DIN 18365 gehört die Prüfung des Untergrunds einschließlich Feuchtemessung zu den Nebenleistungen des Bodenlegers; das Ergebnis sollte protokolliert werden (keine Rechtsberatung).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Resonanzfrequenz einer Metallständerwand"
          zielGleichung="f_0 = \frac{1}{2\pi}\sqrt{s' \cdot \left(\frac{1}{m'_1} + \frac{1}{m'_2}\right)}"
          normQuelle="Masse-Feder-Masse-Modell (vgl. DIN EN 12354-1); Plattenmassen als Lehrannahme"
          schritte={[
            { titel: '1. Gegeben', formel: '\\text{je Seite } 2 \\times 12{,}5\\,\\text{mm GKB: } m\'_1 = m\'_2 \\approx 17\\,\\text{kg/m}^2;\\; d = 75\\,\\text{mm, Hohlraum gedämmt}', erklaerung: 'Flächenmasse je Platte rund 8,5 kg/m² (Lehrannahme).' },
            { titel: '2. Steifigkeit des Hohlraums', formel: 's\' \\approx \\frac{0{,}111}{d} = \\frac{0{,}111}{0{,}075} = 1{,}48\\,\\text{MN/m}^3', erklaerung: 'Näherung für einen mit Faserdämmstoff gefüllten Hohlraum (d in m).' },
            { titel: '3. Resonanzfrequenz', formel: 'f_0 = \\frac{1}{2\\pi}\\sqrt{1{,}48 \\cdot 10^6 \\cdot \\frac{2}{17}} \\approx 66\\,\\text{Hz}', erklaerung: 'Liegt unter 80 Hz – die Resonanz stört den bauakustisch relevanten Bereich ab 100 Hz kaum.' },
          ]}
          ergebnisHinweis="Einfache Beplankung (m' ≈ 8,5 kg/m²) ergäbe rund 94 Hz; die Doppelbeplankung senkt f₀ also deutlich."
        />
      </div>

      <ModulTest moduleId="innenausbau" />

      {/* Footer mit Modul-Spezifikation (RULE[GEMINI_md]) */}
      <ModuleFooter
        wikipedia={[
          { title: 'Trockenbau', url: 'https://de.wikipedia.org/wiki/Trockenbau' },
          { title: 'Gipskarton', url: 'https://de.wikipedia.org/wiki/Gipskarton' },
          { title: 'Estrich', url: 'https://de.wikipedia.org/wiki/Estrich' },
          { title: 'Trittschall', url: 'https://de.wikipedia.org/wiki/Trittschall' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Unger, A.: Fußboden-Atlas – Fußböden richtig planen und ausführen. 7., in Teilen neu bearb. Aufl., 2 Bde., Donauwörth: QUO-VADO 2011',
          'Bundesverband der Gipsindustrie e. V. (Industriegruppe Baugipsplatten): Merkblätter zum Trockenbau',
          'Bundesverband Estrich und Belag e. V. (BEB): Hinweisblätter und Arbeitsblätter'
        ]}
        regelwerke={[
          { title: 'DIN 18181:2019-04 (Gipsplatten im Hochbau - Verarbeitung)' },
          { title: 'DIN EN 520:2009-12 (Gipsplatten - Begriffe, Anforderungen und Prüfverfahren)' },
          { title: 'DIN 18560-1:2021-02, -2:2022-08, -3:2006-03, -4:2012-06 und -7:2004-04 (Estriche im Bauwesen)' },
          { title: 'DIN EN 1264-4 (Flächenheizung – Installation; Belegreife beheizter Estriche)' },
          { title: 'DIN 18534-1 bis -6:2017-07 (Abdichtung von Innenräumen)' },
          { title: 'DIN 4103-1:2015-06 (Nichttragende innere Trennwände - Anforderungen und Nachweise)' }
        ]}
        formeln={[
          {
            formel: 'CaC_2 + 2\\,H_2O \\rightarrow Ca(OH)_2 + C_2H_2 \\uparrow',
            erklaerung: 'Reaktionsgleichung der Calciumcarbid-Methode (CM-Messung) zur Feuchtebestimmung an Estrichproben vor Ort.',
            quelle: 'DIN 18560-1'
          },
          {
            formel: 'R\'_w = R_w - 10 \\cdot \\lg\\left(1 + \\sum 10^{\\frac{R_w - R_{ij,w}}{10}}\\right) \\quad [\\text{dB}]',
            erklaerung: 'Bau-Schalldämmmaß unter Berücksichtigung der flankierenden Bauteile (Flankenübertragung über Decken und Vorwandelemente) nach DIN 4109-2.',
            quelle: 'DIN 4109-2:2018-01'
          },
          {
            formel: 'f_0 = \\frac{1}{2\\pi} \\cdot \\sqrt{s\' \\cdot \\left(\\frac{1}{m\'_1} + \\frac{1}{m\'_2}\\right)} \\quad [\\text{Hz}]',
            erklaerung: 'Resonanzfrequenz f₀ einer zweischaligen Trockenbauwand mit Schalenmassen m\'₁, m\'₂ und dynamischer Steifigkeit s\' des Luft-/Dämmstoffpolsters. Für guten Schallschutz muss f₀ < 100 Hz, möglichst ≤ 80 Hz liegen.',
            quelle: 'DIN EN 12354-1'
          }
        ]}
      />
    </div>
  );
}
