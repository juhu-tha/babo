import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo, useEffect } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InlineMath } from 'react-katex';
import { Layers, BookOpen, Calculator, Route, FileText, CheckCircle2, TrendingUp, AlertTriangle, Milestone, Train, HardHat, Droplets } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';

// Standardized RStO 12/24 Profiles for different Belastungsklassen (Bk)
interface LayerInfo {
  name: string;
  thickness: number; // in cm
  material: string;
  normRequirement: string;
  bgClass: string;
  borderColor: string;
}

interface RstoProfile {
  title: string;
  description: string;
  totalThickness: number; // in cm
  layers: LayerInfo[];
}

const RSTO_ASPHALT_DATA: Record<string, RstoProfile> = {
  'Bk100': {
    title: 'Autobahn / Schwerstverkehr (Bk100)',
    description: 'Für hochbelastete Autobahnen mit hohem Schwerverkehr (> 32 Mio. äquivalente 10-t-Achsübergänge nach RStO 12/24). Fokus auf Spurbildungswiderstand und Verformungsstabilität.',
    totalThickness: 85,
    layers: [
      { name: 'Asphaltdeckschicht (SMA 8 S oder PA)', thickness: 4, material: 'Splittmastixasphalt / Offenporig mit PmB 25/55-55 A', normRequirement: 'PSV-Wert ≥ 51 (hohe Griffigkeit), Hohlraumgehalt 3,0-4,5 Vol.-%', bgClass: 'bg-zinc-800 text-white', borderColor: 'border-zinc-900' },
      { name: 'Asphaltbinderschicht (AC 16 BS)', thickness: 6, material: 'Asphaltbinder mit PmB 25/55-55 A', normRequirement: 'Dicke 6 cm, hohe Standfestigkeit gegen Schubverformungen im Sommer', bgClass: 'bg-zinc-700 text-zinc-100', borderColor: 'border-zinc-800' },
      { name: 'Asphalttragschicht (AC 32 TS)', thickness: 24, material: 'Straßenbaubitumen 50/70 oder PmB', normRequirement: 'Dicke 24 cm in mehreren Lagen, Bindergehalt ≥ 4,2 M.-%', bgClass: 'bg-zinc-600 text-zinc-200', borderColor: 'border-zinc-700' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 51, material: 'Kies/Splitt-Gemisch (GW/GI, FSS 0/45)', normRequirement: 'Ev2 ≥ 120 MPa auf der Frostschutzschicht, frostunempfindliches Material nach TL SoB-StB', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  },
  'Bk32': {
    title: 'Hauptverkehrsstraße / Fernstraße (Bk32)',
    description: 'Bundesstraßen und stark befahrene Landesstraßen (10 bis 32 Mio. äquivalente 10-t-Achsübergänge). Hohe statische und dynamische Belastbarkeit erforderlich.',
    totalThickness: 75,
    layers: [
      { name: 'Asphaltdeckschicht (SMA 11 S oder AC 11 D S)', thickness: 4, material: 'Splittmastix- / Beton-Asphalt mit PmB oder 50/70', normRequirement: 'PSV-Wert ≥ 51, Einbaudicke ca. 4 cm nach ZTV Asphalt-StB', bgClass: 'bg-zinc-800 text-white', borderColor: 'border-zinc-900' },
      { name: 'Asphaltbinderschicht (AC 16 BS)', thickness: 6, material: 'Asphaltbinder mit 50/70 oder PmB', normRequirement: 'Hohlraumgehalt des Marshall-Probekörpers 4,0-6,0 Vol.-%', bgClass: 'bg-zinc-700 text-zinc-100', borderColor: 'border-zinc-800' },
      { name: 'Asphalttragschicht (AC 22 TS)', thickness: 16, material: 'Straßenbaubitumen 50/70', normRequirement: 'Bindergehalt ≥ 4,3 M.-%, Verdichtungsgrad ≥ 98,0%', bgClass: 'bg-zinc-600 text-zinc-200', borderColor: 'border-zinc-700' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 49, material: 'Frostschutzsand / Kiessand-Gemisch (0/32 od. 0/45)', normRequirement: 'Statischer Verformungsmodul EV2 ≥ 120 MPa', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  },
  'Bk10': {
    title: 'Hauptsammelstraße / Industrie (Bk10)',
    description: 'Verbindungsstraßen, Hauptdurchgangsstraßen und Industriegebiets-Erschließungen (3,2 bis 10 Mio. äquivalente 10-t-Achsübergänge). Ausgelegt auf hohe Radlasten.',
    totalThickness: 65,
    layers: [
      { name: 'Asphaltdeckschicht (AC 11 D S / SMA 8)', thickness: 4, material: 'Asphaltbeton / SMA mit 50/70', normRequirement: 'Gute Verschleißfestigkeit, PSV-Wert ≥ 48', bgClass: 'bg-zinc-800 text-white', borderColor: 'border-zinc-900' },
      { name: 'Asphaltbinderschicht (AC 16 BS)', thickness: 5, material: 'Binder mit Straßenbaubitumen 50/70', normRequirement: 'Hohlraumfüllungsgrad mind. 70%', bgClass: 'bg-zinc-700 text-zinc-100', borderColor: 'border-zinc-800' },
      { name: 'Asphalttragschicht (AC 22 TS)', thickness: 13, material: 'Bitumen 50/70 oder 70/100', normRequirement: 'Dicke 13 cm, Bindergehalt ≥ 4,3 M.-%', bgClass: 'bg-zinc-600 text-zinc-200', borderColor: 'border-zinc-700' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 43, material: 'Sand-Kies-Schottergemisch FSS', normRequirement: 'Ev2 ≥ 120 MPa auf der FSS (Bk100–Bk1,8; RStO 12, Tafel 1, Zeile 1)', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  },
  'Bk3.2': {
    title: 'Sammelstraße / Landstraße (Bk3.2)',
    description: 'Ortsverbindungsstraßen und Sammelstraßen (1,8 bis 3,2 Mio. äquivalente 10-t-Achsübergänge). Geringerer Lkw-Anteil.',
    totalThickness: 60,
    layers: [
      { name: 'Asphaltdeckschicht (AC 11 D / SMA 8)', thickness: 4, material: 'Asphaltbeton mit 70/100', normRequirement: 'Hohlraumgehalt am fertigen Bauteil 1,5-4,5 Vol.-%', bgClass: 'bg-zinc-800 text-white', borderColor: 'border-zinc-900' },
      { name: 'Asphalttragschicht (AC 22 TS)', thickness: 14, material: 'Straßenbaubitumen 70/100', normRequirement: 'Verdichtungsgrad ≥ 97,0%', bgClass: 'bg-zinc-600 text-zinc-200', borderColor: 'border-zinc-700' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 42, material: 'Sand/Schotter-Recycling-Gemisch', normRequirement: 'Ev2 ≥ 120 MPa auf der FSS (Bk100–Bk1,8; RStO 12, Tafel 1, Zeile 1)', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  },
  'Bk1.0': {
    title: 'Wohnstraße / Ortskanal (Bk1.0)',
    description: 'Anlieger- und Wohnstraßen (0,3 bis 1,0 Mio. äquivalente 10-t-Achsübergänge), wenig Schwerverkehr.',
    totalThickness: 55,
    layers: [
      { name: 'Asphaltdeckschicht (AC 8 N oder AC 11 N)', thickness: 4, material: 'Asphaltbeton mit weicherem Bitumen 70/100', normRequirement: 'Dichtheit gegen Sauerstoff/Wasser, PSV ≥ 45 ausreichend', bgClass: 'bg-zinc-800 text-white', borderColor: 'border-zinc-900' },
      { name: 'Asphalttragschicht (AC 22 TN)', thickness: 10, material: 'Straßenbaubitumen 70/100', normRequirement: 'Verdichtungsgrad ≥ 97,0%, Bindergehalt ≥ 4,3 M.-%', bgClass: 'bg-zinc-600 text-zinc-200', borderColor: 'border-zinc-700' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 41, material: 'Sand-Kies FSS', normRequirement: 'Ev2 ≥ 100 MPa auf der FSS (Bk1,0–Bk0,3; RStO 12, Tafel 1, Zeile 1)', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  },
  'Bk0.3': {
    title: 'Anliegerweg / Parkplatz (Bk0.3)',
    description: 'Gering belastete Erschließungsflächen (≤ 0,3 Mio. äquivalente 10-t-Achsübergänge).',
    totalThickness: 50,
    layers: [
      { name: 'Asphaltdeckschicht (AC 8 N / AC 5 N)', thickness: 4, material: 'Asphaltbeton mit Bitumen 70/100 oder 160/220', normRequirement: 'Dichte Deckschicht, gute Verdichtung', bgClass: 'bg-zinc-800 text-white', borderColor: 'border-zinc-900' },
      { name: 'Asphalttragschicht (AC 22 TN)', thickness: 8, material: 'Bitumen 70/100', bgClass: 'bg-zinc-600 text-zinc-200', normRequirement: 'Anforderungen nach TL/ZTV Asphalt-StB', borderColor: 'border-zinc-700' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 38, material: 'Kies/Schotter-Gemisch 0/45', normRequirement: 'Ev2 ≥ 100 MPa auf der FSS (Bk1,0–Bk0,3; RStO 12, Tafel 1, Zeile 1)', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  }
};

const RSTO_CONCRETE_DATA: Record<string, RstoProfile> = {
  'Bk100': {
    title: 'Autobahn - Betonbauweise (Bk100)',
    description: 'Starre Befestigung mit hoher Dauerhaftigkeit (Bemessungszeitraum nach RStO in der Regel 30 Jahre; tatsächliche Nutzungsdauer oft länger). Keine Spurrinnen durch plastische Verformung.',
    totalThickness: 85,
    layers: [
      { name: 'Betondecke (ZTV Beton-StB) mit Dübeln', thickness: 30, material: 'Beton C30/37 mit hohem Frost-Tausalz-Widerstand (XM2/XF4)', normRequirement: 'Verschleißwiderstand, Gestein mit hohem PSV-Wert, Dübel in Quer- und Anker in Längsscheinfugen', bgClass: 'bg-slate-300 text-slate-800', borderColor: 'border-home-grau/30' },
      { name: 'Vliesstoff / Trennlage', thickness: 0.5, material: 'Geotextil (Georaster / Vlies)', normRequirement: 'Entkopplung zwischen Betondecke und Tragschicht gegen Rissfortleitung', bgClass: 'bg-slate-200 text-slate-600', borderColor: 'border-home-grau/30' },
      { name: 'Hydraulisch gebundene Tragschicht (HGT)', thickness: 15, material: 'Zementgebundenes Gesteinsgemisch', normRequirement: 'Druckfestigkeit nach TL Beton-StB (Lehrwert ca. 7–12 MPa, manuell prüfen)', bgClass: 'bg-slate-400 text-slate-800', borderColor: 'border-home-grau/30' },
      { name: 'Frostschutzschicht (ungebunden)', thickness: 39.5, material: 'Schottertragschicht / Frostschutzsand', normRequirement: 'Ev2 ≥ 120 MPa auf der FSS', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  },
  'Bk32': {
    title: 'Verkehrskreisel / Bushaltestelle - Betonbauweise (Bk32)',
    description: 'Starre Bauweise für Bereiche mit Brems-, Anfahr- und Schubkräften sowie langsamem Schwerverkehr.',
    totalThickness: 75,
    layers: [
      { name: 'Betondecke (bewehrt / verdübelt)', thickness: 26, material: 'Fahrbahndeckenbeton C30/37 (Kornklasse 0/22)', normRequirement: 'Festigkeitsklasse und Oberfläche nach ZTV Beton-StB (z. B. Waschbeton für Griffigkeit und Lärmminderung)', bgClass: 'bg-slate-300 text-slate-800', borderColor: 'border-home-grau/30' },
      { name: 'Vliesstoff / Trennlage', thickness: 0.5, material: 'Geotextil', normRequirement: 'Trenn- und Entwässerungselement', bgClass: 'bg-slate-200 text-slate-600', borderColor: 'border-home-grau/30' },
      { name: 'Hydraulisch gebundene Tragschicht (HGT)', thickness: 15, material: 'HGT nach ZTV Beton-StB', normRequirement: 'Ev2 ≥ 120 MPa auf der FSS unter der HGT', bgClass: 'bg-slate-400 text-slate-800', borderColor: 'border-home-grau/30' },
      { name: 'Frostschutzschicht', thickness: 33.5, material: 'Frostunempfindliches Gestein 0/45', normRequirement: 'Verdichtungsgrad DPr ≥ 103%', bgClass: 'bg-zinc-400 text-zinc-800', borderColor: 'border-zinc-500' }
    ]
  }
};

type VerkehrReiter = 'rsto_rechner' | 'vergleich' | 'bindemittel' | 'prueftechnik' | 'bahnbau' | 'tunnelbau' | 'tiefbau' | 'betondecken';

interface BpVerkehrswegebauProps {
  initialTab?: 'rsto_rechner' | 'vergleich' | 'bindemittel' | 'prueftechnik' | 'bahnbau' | 'tunnelbau' | 'tiefbau' | 'betondecken';
}

export default function BpVerkehrswegebau({ initialTab }: BpVerkehrswegebauProps = {}) {
  const [activeTab, setActiveTab2] = useState<'rsto_rechner' | 'vergleich' | 'bindemittel' | 'prueftechnik' | 'bahnbau' | 'tunnelbau' | 'tiefbau' | 'betondecken'>(initialTab || 'rsto_rechner');

  useEffect(() => {
    if (initialTab) {
      setActiveTab2(initialTab);
    }
  }, [initialTab]);

  const [belastungsKlasse, setBelastungsKlasse] = useState<string>('Bk32');
  const [bauweise, setBauweise] = useState<'asphalt' | 'beton'>('asphalt');
  const { setActiveTab } = useTabContext();

  // Bahnbau-Messergebnisse und Berechnungszustände (Studierenden-Labor)
  const [schieneTemp, setSchieneTemp] = useState<number>(45); // in °C (-20 bis 60)
  const [neutralTemp, setNeutralTemp] = useState<number>(20); // in °C (typische Neutralisation)
  const [bettungstyp, setBettungstyp] = useState<'schotter_mager' | 'schotter_gut' | 'feste_fahrbahn'>('schotter_gut');

  // Tunnelbau-Messergebnisse (Spritzbetonbemessung)
  const [tunnelRadius, setTunnelRadius] = useState<number>(4.5); // in m
  const [gebirgsdruck, setGebirgsdruck] = useState<number>(0.15); // in MPa
  const [spritzbetonDicke, setSpritzbetonDicke] = useState<number>(15); // in cm
  const [betonKlasse, setBetonKlasse] = useState<'C20/25' | 'C25/30' | 'C30/37'>('C25/30');

  // Tiefbau-Zustände (Versickerungsrechner nach DWA-A 138 / simplified)
  const [tiefbauArea, setTiefbauArea] = useState<number>(355); // m²
  const [tiefbauPsi, setTiefbauPsi] = useState<number>(0.9); // abflussbeiwert (Asphalt = 0.9, Pflaster = 0.7, Gründach = 0.3)
  const [tiefbauRain, setTiefbauRain] = useState<number>(240); // l/(s*ha) Bemessungsregen
  const [tiefbauDuration, setTiefbauDuration] = useState<number>(15); // min Regendauer (t_d)
  const [tiefbauFss, setTiefbauFss] = useState<number>(0.95); // Speicherkoeffizient s_R (Sickerbox PP = 0.95, Kiesrigole = 0.3)

  // Betondecken-Zustände (ZTV Beton-StB / RLaO Bemessung)
  const [betonSlabThickness, setBetonSlabThickness] = useState<number>(26); // in cm (15 bis 40)
  const [betonFugenAbstand, setBetonFugenAbstand] = useState<number>(5.0); // in m (3.0 bis 7.0)
  const [betonAchslast, setBetonAchslast] = useState<number>(120); // in kN (80 bis 180)
  const [betonBettung, setBetonBettung] = useState<number>(80); // MN/m³ / MPa/m (k-Wert / Bettungsmodul)
  const [betonAggregate, setBetonAggregate] = useState<'quarz' | 'kalk' | 'basalt'>('quarz');
  const [betonCementAlkali, setBetonCementAlkali] = useState<'low' | 'high'>('low');
  const [betonFreshAir, setBetonFreshAir] = useState<number>(5.5); // gemessener Luftporengehalt in %
  const [betonMaxAggregateSize, setBetonMaxAggregateSize] = useState<22 | 32>(32); // GK 22 oder GK 32 mm
  const [betonShowAKRDetails, setBetonShowAKRDetails] = useState<boolean>(false);

  const activeProfile = useMemo(() => {
    if (bauweise === 'asphalt') {
      return RSTO_ASPHALT_DATA[belastungsKlasse] || RSTO_ASPHALT_DATA['Bk32'];
    } else {
      // Für Beton haben wir nur Bk100 und Bk32 zur Demo
      return RSTO_CONCRETE_DATA[belastungsKlasse] || RSTO_CONCRETE_DATA['Bk32'];
    }
  }, [bauweise, belastungsKlasse]);

  // Asphalt-Stauchung berechnen (Studien-Kalkulation für Luftporen)
  const [asphaltMischung, setAsphaltMischung] = useState({
    gesteinAnteil: 94.5, // M.-%
    bitumenAnteil: 5.5,  // M.-%
    rhoGestein: 2.68,   // g/cm³
    rhoBitumen: 1.02,   // g/cm³
    raumdichteMischung: 2.41, // g/cm³ (gemessene Raumdichte des Probekörpers)
  });

  const luftPorenErrechnet = useMemo(() => {
    // Theorie-Maximaldichte (Hohlraumfreie Dichte / Rice-Dichte)
    // 100 / (Gestein/rhoG + Bitumen/rhoB)
    const maxDichte = 100 / ((asphaltMischung.gesteinAnteil / asphaltMischung.rhoGestein) + (asphaltMischung.bitumenAnteil / asphaltMischung.rhoBitumen));
    // Luftporengehalt (V_u) in Vol.-% = (1 - Raumdichte/Maximaldichte) * 100
    const luftporen = (1 - (asphaltMischung.raumdichteMischung / maxDichte)) * 100;
    return {
      maxDichte: formatDeZahl(maxDichte, 3),
      luftporen: luftporen.toFixed(2),
      isOk: luftporen >= 1.5 && luftporen <= 4.5
    };
  }, [asphaltMischung]);

  // Reiter (AP 3.8): 6 Hauptbereiche; Asphalt (Sorten, Bitumen/Gesteine, Prüfmethoden) als zweite Ebene.
  // Zustand bleibt die bisherige Reiter-ID, damit die Routen bp_verkehr_* (initialTab) weiter passen.
  const gruppen: readonly ModulTabGruppe<VerkehrReiter>[] = [
    { id: 'rsto_g', label: 'Oberbau-Rechner (RStO 12/24)', icon: Calculator, mitglieder: [{ id: 'rsto_rechner', label: 'Oberbau-Rechner (RStO 12/24)' }] },
    { id: 'asphalt_g', label: 'Asphalt, Bitumen & Prüfung', icon: Layers, mitglieder: [
      { id: 'vergleich', label: 'Asphaltsorten & Tragschichten', icon: Layers },
      { id: 'bindemittel', label: 'Bitumen & PSV-Gesteine', icon: FileText },
      { id: 'prueftechnik', label: 'Labor-Prüfmethoden', icon: BookOpen },
    ] },
    { id: 'betondecken_g', label: 'Betondecken', icon: Layers, mitglieder: [{ id: 'betondecken', label: 'Betondecken' }] },
    { id: 'tiefbau_g', label: 'Tiefbau & Entwässerung', icon: Droplets, mitglieder: [{ id: 'tiefbau', label: 'Tiefbau & Entwässerung' }] },
    { id: 'bahnbau_g', label: 'Bahnbau', icon: Train, mitglieder: [{ id: 'bahnbau', label: 'Bahnbau' }] },
    { id: 'tunnelbau_g', label: 'Tunnelbau', icon: HardHat, mitglieder: [{ id: 'tunnelbau', label: 'Tunnelbau' }] },
  ];

  const handleLinkToAsphaltBase = () => {
    setActiveTab('asphalt');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-home-grau/10 pb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Milestone className="text-shiraz" /> Verkehr und Tiefbau
            </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Akademische Aufbereitung zu Straßenbau (RStO 12/24), Tiefbau &amp; Entwässerung (Kanalisation, Versickerung, Rigolen), Bahnbau (Gleisköper) und Tunnelbau (Sprengvortrieb, NÖT &amp; Spritzbetonsicherung).
          </p>
        </div>
          <button 
            onClick={handleLinkToAsphaltBase}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-shiraz bg-shiraz/5 border border-shiraz/35 rounded-lg hover:bg-shiraz/10 transition-all self-start md:self-auto"
          >
            <Route size={14} /> Zum Asphalt-Werkstoffmodul
          </button>
        </div>

        {/* Reiter: 6 Hauptbereiche, Asphalt mit zweiter Ebene (AP 3.8) */}
        <GruppierteModuleTabs
          label="Verkehr und Tiefbau: Bereiche"
          gruppen={gruppen}
          aktiv={activeTab}
          onWechsel={setActiveTab2}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20"
        >
        <div className="mt-6">
        {/* TAB 1: RStO Oberbau-Rechner */}
        {activeTab === 'rsto_rechner' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                <Milestone size={16} className="text-shiraz" /> Grundlagen der Bemessung nach RStO 12/24
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Die <strong>Richtlinien für die Standardisierung des Oberbaues von Verkehrsflächen (RStO 12/24, Ausgabe 2012, Fassung 2024)</strong> regeln den Aufbau von Straßenquerschnitten in Deutschland. Die Schichtdicken im Rechner sind vereinfachte Lehrwerte – maßgebend sind die Tafeln der RStO 12/24 und die ZTV SoB-StB. Ziel ist die Festlegung der wirtschaftlichsten Dicke der einzelnen Schichten unter Berücksichtigung von <strong>Schwerverkehr</strong> (charakterisiert durch die Belastungsklasse <InlineMath math="B_k" />), Frostempfindlichkeit des Untergrundes und klimatischen Randbedingungen.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Column */}
              <div className="lg:col-span-5 flex flex-col gap-5 bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h4 className="font-extrabold text-sm text-text-main">Dimensionierungs-Parameter</h4>
                
                {/* Bauweise */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-text-main/70">1. Überbaubauweise</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setBauweise('asphalt'); setBelastungsKlasse('Bk32'); }}
                      className={`py-2 px-3 text-xs rounded-lg font-bold border transition-all ${
                        bauweise === 'asphalt'
                          ? 'bg-zinc-800 text-white border-zinc-900 shadow-sm'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      Asphaltbauweise
                    </button>
                    <button
                      onClick={() => { setBauweise('beton'); setBelastungsKlasse('Bk32'); }}
                      className={`py-2 px-3 text-xs rounded-lg font-bold border transition-all ${
                        bauweise === 'beton'
                          ? 'bg-slate-300 text-slate-800 border-home-grau/30 shadow-sm'
                          : 'bg-white text-slate-700 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      Betonbauweise
                    </button>
                  </div>
                </div>

                {/* Belastungsklasse Selector */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-text-main/70">2. Belastungsklasse (<InlineMath math="B_k" />)</span>
                  <select aria-label="2. Belastungsklasse ()"
                    value={belastungsKlasse}
                    onChange={(e) => setBelastungsKlasse(e.target.value)}
                    className="p-2 text-xs border border-zinc-300 rounded-md bg-white text-text-main font-semibold"
                  >
                    <option value="Bk100">Bk100 (z.B. Fernbahnen, Autobahnen, extreme Belastung)</option>
                    <option value="Bk32">Bk32 (z.B. Bundesstraßen, vierspurige Straßen)</option>
                    {bauweise === 'asphalt' && (
                      <>
                        <option value="Bk10">Bk10 (z.B. Landstraßen, stark befahren)</option>
                        <option value="Bk3.2">Bk3.2 (z.B. Kreisstraßen, Busstrecken)</option>
                        <option value="Bk1.0">Bk1.0 (z.B. Erschließung, Gewerbestraßen)</option>
                        <option value="Bk0.3">Bk0.3 (z.B. Wohnstraßen, Nebenstraßen)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Info block based on class */}
                <div className="text-xs bg-white p-4 rounded-lg border border-home-grau/10 space-y-2">
                  <div className="flex items-start gap-2 text-amber-800">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-[11px] text-amber-900">ZTV Asphalt-StB Hinweis:</p>
                      <p className="text-[10px] text-text-main/70 leading-relaxed mt-0.5">
                        {bauweise === 'asphalt' 
                          ? 'Erhöhte Anforderungen an die Kornform (z. B. Kategorie SI15 bzw. FI15) und verformungsstabilere PmB-Bitumensorten bei schwerer Lastklasse (≥ Bk32).'
                          : 'Querscheinfugen mit Dübeln (Ø 25 mm, kunststoffbeschichtet), Längsfugen mit Ankern – gegen Stufenbildung und Auseinanderwandern der Platten.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Dimensioning Formula Context */}
                <div className="p-3 text-[11px] font-mono text-text-main/60 bg-white border border-home-grau/15 rounded-lg">
                  <span className="font-bold text-text-main block mb-1">Dimensionierungsformel (Äquivalenz):</span>
                  <FormulaText text="B = N \cdot  f_A \cdot  f_G \cdot  f_B \cdot  t_{N}" />
                  <span className="text-[10px] text-text-main/70 block mt-1">
                    <InlineMath math="N" />: Mittlere tägliche Lkw-Stärke, <InlineMath math="f_A" />: Achszahlfaktor, <InlineMath math="f_G" />: Spurbreitenfaktor, <InlineMath math="f_B" />: Achslastfaktor.
                  </span>
                </div>
              </div>

              {/* Graphical representation Column */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-bold text-sm text-text-main">
                      Soll-Aufbau nach RStO {bauweise === 'asphalt' ? 'Tafel 1 (Asphalt)' : 'Tafel 2 (Beton)'}
                    </h5>
                    <span className="text-xs bg-zinc-100 border border-zinc-200 px-2 py-1 rounded font-mono font-bold text-zinc-700">
                      Gesamtdicke: {formatDeWert(activeProfile.totalThickness)} cm
                    </span>
                  </div>

                  <p className="text-xs text-text-main/70 leading-relaxed mb-4 italic">
                    {activeProfile.description}
                  </p>

                  {/* Profil-Stapel */}
                  <div className="flex flex-col gap-1.5 border border-zinc-200/50 p-3 rounded-lg bg-zinc-50 shadow-inner">
                    {activeProfile.layers.map((layer, index) => {
                      // Proportionale Höhe berechnen (min 45px für Textlesbarkeit, max 120px)
                      const computedHeight = Math.max(45, Math.min(120, layer.thickness * 2.8));
                      return (
                        <div 
                          key={index} 
                          style={{ height: `${computedHeight}px` }}
                          className={`flex flex-col justify-center px-4 rounded border ${layer.bgClass} ${layer.borderColor} relative overflow-hidden transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer group`}
                        >
                          <div className="flex items-center justify-between z-10">
                            <span className="font-extrabold text-xs sm:text-sm tracking-wide">
                              {layer.name}
                            </span>
                            <span className="font-mono text-xs font-bold bg-black/40 text-white px-2 py-0.5 rounded">
                              h = {formatDeWert(layer.thickness)} cm
                            </span>
                          </div>
                          <span className="text-[10px] text-white/80 font-mono mt-1 opacity-90 leading-tight group-hover:opacity-100 transition-all z-10">
                            Werkstoff: {layer.material}
                          </span>
                          
                          {/* Rich-Tooltip on hover showing requirements */}
                          <div className="absolute inset-0 bg-black/95 text-white p-3 hidden group-hover:flex flex-col justify-center text-[10.5px] leading-normal transition-all duration-300">
                            <span className="font-bold text-zinc-300">Normative Anforderung (ZTV Asphalt-StB / EN 13043):</span>
                            <p className="mt-1">{layer.normRequirement}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Unterbau */}
                  <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-950 flex gap-2.5">
                    <TrendingUp className="text-amber-700 mt-1 shrink-0" size={16} />
                    <div className="text-xs">
                      <p className="font-bold">Untergrund / Unterbau (Planum):</p>
                      <p className="text-[11px] leading-relaxed mt-0.5">
                        Tragfähigkeitsnachweis gemäß ZTV E-StB mittels Statischem Plattendruckversuch nach DIN 18134. <strong className="font-mono text-slate-800">Sollwert: EV2 ≥ 45 MPa</strong>. Ist dieser Wert nicht erreichbar, muss eine Bodenverbesserung mit Kalk/Zement oder Bodenaustausch erfolgen.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Asphaltsorten & Tragschichten */}
        {activeTab === 'vergleich' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2">
                Asphaltmischgut & Betonoberbau im Vergleich
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Asphalt im Straßenbau ist ein heiß gemischtes Verbundmaterial aus <strong>Füller</strong> (Gesteinsmehl &lt; 0,063 mm), <strong>Feiner/Grober Gesteinskörnung</strong> und <strong>Bitumen</strong>. Die Struktur unterscheidet sich fundamental nach Traggerüst und Beanspruchung:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Asphaltbeton */}
              <div className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase font-mono">EN 13108-1</span>
                    <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-extrabold font-sans">Klassiker</span>
                  </div>
                  <h4 className="font-bold text-base text-zinc-800 mb-1">Asphaltbeton (AC)</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed explanation-box">
                    Gestuftes Korngerüst mit kontinuierlicher Sieblinie. Die Hohlräume sind fast komplett mit Bitumen gefüllt. Universell einsetzbar in allen Schichten (Deck-, Binder-, Tragschicht). Hoher Verformungswiderstand durch Korn-Scherfestigkeit.
                  </p>
                </div>
                <div className="border-t border-zinc-100 pt-3 mt-3 text-[11px] text-zinc-600 font-mono">
                  <div>Hohlraum: <span className="text-zinc-900 font-semibold">1,5 - 4,5 %</span></div>
                  <div>Bitumen: <span className="text-zinc-900 font-semibold">ca. 5 - 6 M.-%</span></div>
                </div>
              </div>

              {/* Splittmastixasphalt */}
              <div className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase font-mono">EN 13108-5</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-extrabold font-sans">High-Quality</span>
                  </div>
                  <h4 className="font-bold text-base text-zinc-800 mb-1">Splittmastix (SMA)</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed explanation-box">
                    Ausfallkörnung mit Splittgerüst (Splitt-an-Splitt-Abstützung). Der Hohlraum ist mit reichlich Mastix (Füller + Bitumen + <strong>Zellulosefasern als Stabilisator</strong> gegen Ablaufen von Bitumen) gefüllt. Sehr widerstandsfähig gegen Verformung unter Schwerverkehr.
                  </p>
                </div>
                <div className="border-t border-zinc-100 pt-3 mt-3 text-[11px] text-zinc-600 font-mono">
                  <div>Hohlraum: <span className="text-zinc-900 font-semibold">3,0 - 4,0 %</span></div>
                  <div>Bitumen: <span className="text-zinc-900 font-semibold">ca. 6,5 - 7,5 M.-%</span></div>
                </div>
              </div>

              {/* Gussasphalt */}
              <div className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase font-mono">EN 13108-6</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold font-sans">Walzfrei</span>
                  </div>
                  <h4 className="font-bold text-base text-zinc-800 mb-1">Gussasphalt (MA)</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed explanation-box">
                    Hohlraumfreies Mischgut. Bitumenmengen sind so ausgelegt, dass sie alle Hohlräume vollkommen überfüllen. Heiß fließbar einbaubar und <strong>benötigt kein Walzen</strong>. Nach dem Gießen wird Splitt zur Erreichung der Griffigkeit aufgestreut.
                  </p>
                </div>
                <div className="border-t border-zinc-100 pt-3 mt-3 text-[11px] text-zinc-600 font-mono">
                  <div>Hohlraum: <span className="text-zinc-900 font-semibold">völlig dicht (~0%)</span></div>
                  <div>Bitumen: <span className="text-zinc-900 font-semibold">ca. 7,5 - 8,5 M.-%</span></div>
                </div>
              </div>

              {/* Offenporiger Asphalt */}
              <div className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase font-mono">EN 13108-7</span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-extrabold font-sans">Akustik</span>
                  </div>
                  <h4 className="font-bold text-base text-zinc-800 mb-1">Flüsterasphalt (PA)</h4>
                  <p className="text-xs text-text-main/70 leading-relaxed explanation-box">
                    Sehr hoher, zusammenhängender Hohlraumgehalt. Wasser läuft durch die Struktur direkt nach unten ab (kein Aquaplaning). Das schallabsorbierende System verringert Reifen-Fahrbahn-Geräusche um bis zu 5 dB(A). Neigt jedoch zu schnellerer Alterung.
                  </p>
                </div>
                <div className="border-t border-zinc-100 pt-3 mt-3 text-[11px] text-zinc-600 font-mono">
                  <div>Hohlraum: <span className="text-zinc-900 font-semibold">≥ 22,0 Vol.-%</span></div>
                  <div>Bitumen: <span className="text-zinc-900 font-semibold">ca. 5,5 - 6,5 M.-%</span></div>
                </div>
              </div>
            </div>

            {/* Tragschichten ungebunden vs. gebunden */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs">
              <h4 className="font-extrabold text-sm text-text-main mb-3 uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} /> Untere Tragschichten & Ungebundene Bauweisen
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80 leading-relaxed">
                <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <h5 className="font-bold text-zinc-800 mb-1 flex items-center gap-1">
                    <span>🪨 Schottertragschicht (STS) / Frostschutz (FSS)</span>
                  </h5>
                  <p className="mt-1">
                    Trägt Lasten rein über granulare Verzahnung ab. Wichtigste Kriterien nach TL Gestein-StB: <strong>Widerstand gegen Zertrümmerung / Schlagfestigkeit</strong> (SZ/LA-Index) und Frostbeständigkeit. 
                    Korngrößengemische meist 0/32 oder 0/45 mm. Einbau muss optimal feucht erfolgen, um Entmischung zu vermeiden.
                  </p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <span>🧱 Zementstabilisierung / HGT & Verfestigung</span>
                  </h5>
                  <p className="mt-1">
                    <strong>Hydraulisch gebundene Tragschichten (HGT)</strong>: Gemisch aus Gesteinskörnungen, Zement und Wasser. Geringe Zugfestigkeit, Neigung zu Schwind- und Temperaturrissen. Unter Asphalt wird die HGT gekerbt, damit sich Risse nicht unkontrolliert in den Asphalt durchpausen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Bitumen & PSV-Gesteine */}
        {activeTab === 'bindemittel' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Bitumenprüfung & Kenngrößen */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-3">
                  Straßenbaubitumen & Viskositätsklassen
                </h3>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4">
                  Das Bindemittel Bitumen ist thermoplastisch: Bei Kälte spröde, bei Hitze zähviskos/flüssig. Für die Eignung im Asphalt wird es nach den Labortests charakterisiert:
                </p>

                <div className="space-y-4">
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
                    <p className="font-bold text-zinc-800">1. Nadelpenetration (DIN EN 1426)</p>
                    <p className="text-text-main/75 mt-1">
                      Eine standardisierte Stahlnadel (100g) dringt 5 Sekunden bei 25 °C in das Bitumen ein. Ein Eindringtiefe-Wert von 50 Zehntelmillimeter (0,1 mm) entspricht der Klassifizierung "50". 
                      Standard-Straßenbitumen: <strong>50/70</strong> oder <strong>70/100</strong>. Je höher die Zahl, desto weicher das Bitumen.
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
                    <p className="font-bold text-zinc-800">2. Erweichungspunkt Ring und Kugel (RuK, DIN EN 1427)</p>
                    <p className="text-text-main/75 mt-1">
                      Temperatur, bei der eine Stahlkugel eine erhitzte Bitumenscheibe um eine definierte Distanz nach unten durchbiegt. 
                      Straßenbaubitumen 50/70 bzw. 70/100 hat einen Erweichungspunkt RuK von ca. <strong>43 °C bis 54 °C</strong> (DIN EN 12591). Polymermodifizierte Bitumen (PmB, z. B. mit SBS) erreichen höhere Erweichungspunkte und bleiben bei Kälte elastischer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Gesteinsprüfung: PSV-Wert */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                    Polishing Stone Value (PSV-Wert, DIN EN 1097-8)
                  </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der wichtigste Material-Parameter für die Griffigkeit und Fahrsicherheit der Asphaltdeckschichten (Vermeidung von Rutschen bei Regen).
                  </p>

                  <div className="bg-zinc-50 p-3.5 border border-zinc-200 rounded-lg text-xs space-y-2 mb-4">
                    <p className="font-bold text-zinc-800">Verfahrensablauf:</p>
                    <p className="text-[11px] leading-relaxed text-text-main/70">
                      Gesteinssplitt-Körner werden auf einem Probekörper-Rad fixiert und unter permanentem Schleifsand-Wasserstrom unter Andruck eines Reifens künstlich poliert. Anschließend wird die <strong>Reibung (Gleitkoeffizient)</strong> mittels Pendelprüfgerät (SRT) gemessen.
                    </p>
                    <p className="font-bold text-[11px] text-zinc-900 border-t border-zinc-200 pt-2 font-mono">
                      Autobahndeckschichten zwingend: PSV-Wert ≥ 51 oder ≥ 54
          </p>
        </div>

                  <p className="text-xs text-text-main/75 leading-relaxed mb-2">
                    Geeignete Naturgesteine für extremen Abrieb:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <span className="p-2 bg-zinc-100 text-zinc-700 rounded text-center">Basalt, Andesit, Diabas</span>
                    <span className="p-2 bg-red-50 text-red-900 border border-red-350 rounded text-center">Kein weicher Kalkstein!</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: Labor-Prüfmethoden & Interaktiver Hohlraumrechner */}
        {activeTab === 'prueftechnik' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Marshall-Verfahren */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-700" /> Prüftechnik im Labor
                </h3>
                
                <div className="space-y-4 text-xs text-text-main/75 leading-relaxed">
                  <div>
                    <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1">Marshall-Stabilität und -Fließwert (DIN EN 12697-34)</h5>
                    <p>
                      Mischproben werden mit dem Standard-Marshall-Hammer typischerweise mit 2x50 Schlägen im Zylinder verdichtet. 
                      Anschließend wird der Probekörper bei 60 °C (kritische Sommertemperatur) bis zum Bruch beansprucht. Die Maximalkraft ist die <strong>Marshall-Stabilität</strong>, die Verformung der <strong>Fließwert (in mm)</strong>. In Deutschland dienen Marshall-Probekörper vor allem zur Bestimmung von Raumdichte und Hohlraumgehalt.
                    </p>
                  </div>

                  <div className="border-t border-zinc-100 pt-3">
                    <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1">Spurbildungsversuch / Wheel-Tracking (DIN EN 12697-22)</h5>
                    <p>
                      Simuliert die Spurinnenbildung unter schweren Radlasten. Ein Prüfrad überrollt eine Asphaltplatte (DIN EN 12697-22, z. B. 20.000 Überrollungen bei 50 °C oder 60 °C). Die gemessene Profiltiefe (Spurrinne in %) ist das Maß für die hochtemperierte Standfestigkeit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interaktive Berechnungen (Hohlraum / Dichte) */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calculator size={16} className="text-shiraz" /> Interaktiver Hohlraumrechner & Rice-Maximaldichte
                </h3>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4">
                  Studentische Übungsrechnung: Bestimmen Sie den Hohlraumgehalt eines Asphaltprobekörpers. Zu viel Hohlraum fördert Alterung und Wassereintritt, zu wenig führt zu Spurrinnen und Bindemittelanreicherung an der Oberfläche (Grenzwerte im Rechner: Lehrwerte).
                </p>

                <div className="space-y-4">
                  
                  {/* Gesteinsanteil */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-text-main">
                      <span>Bitumengehalt (<InlineMath math="B" />):</span>
                      <span className="font-mono text-xs">{formatDeZahl(asphaltMischung.bitumenAnteil, 1)} M.-% (Gestein: {formatDeZahl(asphaltMischung.gesteinAnteil, 1)} M.-%)</span>
                    </div>
                    <input 
                      type="range" 
                      min="3.0" 
                      max="9.0" 
                      step="0.1"
                      value={asphaltMischung.bitumenAnteil}
                      onChange={(e) => {
                        const bit = parseFloat(e.target.value);
                        setAsphaltMischung(prev => ({
                          ...prev,
                          bitumenAnteil: bit,
                          gesteinAnteil: 100 - bit
                        }));
                      }}
                      className="w-full accent-shiraz" 
                    />
                  </div>

                  {/* Raumdichte */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-text-main">
                      <span>Gemessene Raumdichte (<InlineMath math="\rho_r" /> / Bulk Density):</span>
                      <span className="font-mono text-xs">{formatDeZahl(asphaltMischung.raumdichteMischung, 2)} g/cm³</span>
                    </div>
                    <input 
                      type="range" 
                      min="2.20" 
                      max="2.55" 
                      step="0.01"
                      value={asphaltMischung.raumdichteMischung}
                      onChange={(e) => {
                        const rd = parseFloat(e.target.value);
                        setAsphaltMischung(prev => ({
                          ...prev,
                          raumdichteMischung: rd
                        }));
                      }}
                      className="w-full accent-shiraz" 
                    />
                  </div>

                  {/* Ergebnisse Rechner */}
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2 mt-4">
                    <div className="grid grid-cols-2 text-xs font-mono">
                      <div>Theor. Hohlraumfreie Dichte:</div>
                      <div className="text-right font-extrabold text-zinc-800">{luftPorenErrechnet.maxDichte} g/cm³</div>
                    </div>
                    <div className="grid grid-cols-2 text-xs font-mono border-t border-zinc-200/50 pt-2">
                      <div className="font-bold">Errechneter Luftporengehalt (<InlineMath math="V_u" />):</div>
                      <div className="text-right font-extrabold text-lg text-zinc-900">{formatDeZahl(Number(luftPorenErrechnet.luftporen), 2)} Vol.-%</div>
                    </div>

                    <div className="mt-2 text-[10.5px] border-t border-zinc-250 pt-2">
                      {luftPorenErrechnet.isOk ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          ✓ Konform (ZTV Asphalt-StB Zielbereich 1,5 - 4,5% für Deckschichten eingehalten!)
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          ✗ Nicht konform für Deckschichten ({parseFloat(luftPorenErrechnet.luftporen) < 1.5 ? 'zu dicht – Gefahr von Bindemittelanreicherung und Spurrinnen' : 'zu offen – Gefahr von Wassereintritt und Frostschäden'})
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: Tiefbau & Entwässerung */}
        {activeTab === 'tiefbau' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Intro */}
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Droplets className="text-shiraz" size={18} /> Tiefbau-Systemtechnik &amp; Urban Drainage (DWA &amp; DIN)
              </h3>
              <p className="text-xs text-slate-800 leading-relaxed">
                Der moderne Tiefbau umfasst sämtliche baulichen Maßnahmen unterhalb der Erdoberfläche. Neben der Bodenstabilisierung bildet das <strong>Wassermanagement (Abflusstransport, Rückhaltung, Versickerung und Reinigung)</strong> nach <strong>DIN EN 752</strong> und den relevanten <strong>DWA-Regelwerken (z.B. DWA-A 138)</strong> das schützende Rückgrat urbaner Infrastrukturen. Die hier dargelegten Systeme decken die gesamte Palette modernen Tiefbaumaterials ab.
              </p>
            </div>

            {/* SECTION 1: Die 10 Produktwelten des Tief- & Straßenbaus */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-main mb-4 border-b border-zinc-200 pb-1.5">
                I. Produktbereiche &amp; Technische Systeme im Tief- und Straßenbau
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Anschlusssysteme */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                      <span>1. Anschlusssysteme &amp; Formteile</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">DIN EN 1401-1</span>
                    </h4>
                    <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                      Gas- und wasserdichte Einbindungen und Übergänge in bestehende Rohr- und Kanalsysteme für dauerhafte Dichtigkeit bei Druckbeaufschlagung und Erdbewegungen.
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-text-main/80">
                      <li>• <strong>Übergangskupplungen:</strong> Manschetten mit Edelstahlbändern zur radial kraftschlüssigen und dichten Verbindung unterschiedlicher Rohrmaterialien (z.B. Steinzeug auf PVC).</li>
                      <li>• <strong>Sattelstücke &amp; Anschlussmuffen:</strong> Nachträgliche 90°- oder 45°-Anschlüsse an bestehende Hauptkanäle ohne Rohraustausch.</li>
                      <li>• <strong>Abzweig-Elemente:</strong> 45°- und 87°-Formstücke mit montagefreundlicher Steckmuffensystematik und eingelegten EPDM-Lippendichtungen.</li>
                    </ul>
                  </div>
                </div>

                {/* 2. Drainage & Sickerleitung */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                      <span>2. Drainage &amp; Baugrunddränung</span>
                      <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">DIN 4095 / DIN 4262-1</span>
                    </h4>
                    <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                      Sicheres Abführen von Schichten- und Sickerwasser zur Vermeidung von hydrostatischem Druck auf Kellerwände, Fundamente und Verkehrsträger.
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-text-main/80">
                      <li>• <strong>Sickerrohre und Dränleitungen:</strong> Vollsickerrohre (TP), Teilsickerrohre (LP) mit profilierten Wassereintrittsschlitzen zur effektiven Wasseraufnahme im Straßenbau.</li>
                      <li>• <strong>Dränageschächte / Spülschächte:</strong> Kontrollschächte DN 315 / 400 mit Sandfang zur Reinigung der Dränstränge durch Spülung.</li>
                      <li>• <strong>Geoverbundstoffe:</strong> Dränmatten mit Noppenbahn und aufkaschiertem Filtervlies zur direkten Wanddränung an Kellergeschossen.</li>
                    </ul>
                  </div>
                </div>

                {/* 3. Regen- & Abwassersysteme */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                      <span>3. Regen- &amp; Abwasser-Kanalisation</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">DIN EN 1852 / DIN EN 476</span>
                    </h4>
                    <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                      Freispiegelleitungen zur gesicherten hydraulischen Ableitung großer Wassermassen mit hohen Ringsteifigkeiten (S_N ≥ 8 kN/m²).
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-text-main/80">
                      <li>• <strong>Vollwand-Kanalrohre (PP/PVC):</strong> Strukturstabile Rohre (KG / KG2000) für Schwerlastbereiche (SLW 60). Extrem glatte Innenfläche zur Minimierung von Inkrustationen.</li>
                      <li>• <strong>Stahlbetonrohre:</strong> Für sehr große Nennweiten (DN &gt; 1200) bei maximaler Erdauflast und statischer Beanspruchung.</li>
                      <li>• <strong>Rückstauverschlüsse:</strong> Klappensysteme (DIN EN 13564) zum Schutz tiefliegender Ablaufstellen vor drückendem Abwasser aus dem Sammelkanal.</li>
                    </ul>
                  </div>
                </div>

                {/* 4. Funktionspflaster */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                      <span>4. Ökoprofile &amp; Funktionspflaster</span>
                      <span className="text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-mono font-bold">FGSV M-VV</span>
                    </h4>
                    <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                      Hydraulisch optimierte Betonwaren und Beläge zur gezielten dezentralen Versickerung auf Verkehrsflächen (Flächenentsiegelung).
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-text-main/80">
                      <li>• <strong>Haufwerksporige Sickersteine:</strong> Gefügedichte Baustoffe mit definiertem Porenvolumen, durch welche das Niederschlagswasser vertikal direkt absickert.</li>
                      <li>• <strong>Pflaster mit Sickerfuge:</strong> Steinkonstruktionen mit verbreiterten Abstandshaltern (z.B. Fugenbreite ≥ 10 mm), verfüllt mit filterndem Splitt-Substrat.</li>
                      <li>• <strong>Rasengittersteine:</strong> Hoher Grünflächenanteil für landwirtschaftlichen Wegebau und Parkplätze bei hoher PKW-Tragfähigkeit.</li>
                    </ul>
                  </div>
                </div>

                {/* 5. Geotextilien */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                      <span>5. Geomembranen &amp; Geotextilien</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">DIN EN 13249</span>
                    </h4>
                    <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                      Polymere Planstoffe (Vliese, Gewebe, Gitter) zur Stabilisierung, Trennung und mechanischen Filtration im Bodenaufbau.
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-text-main/80">
                      <li>• <strong>Filtervliese:</strong> Mechanisch vernadelte Endlosfasern (Polypropylen) mit hoher Reißdehnbarkeit. Sie verhindern den Eintrag von Feinkorn in Sickerschichten (Filterstabilität).</li>
                      <li>• <strong>Bewehrungs-Geogitter:</strong> Monofile Zugkonstruktionen (PET/PP) zur Erhöhung der Tragfähigkeit von ungebundenen Schotterschichten.</li>
                      <li>• <strong>Bändchengewebe:</strong> Extrem zugfeste Gewebebahnen zur Trennung minderwertigen Baugrundes von der Frostschutzschicht.</li>
                    </ul>
                  </div>
                </div>

                {/* 6. Hangbefestigung */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                      <span>6. Hangbefestigung &amp; Abstützungen</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">Eurocode 7</span>
                    </h4>
                    <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                      Konstruktionen zum Abfangen von Erddruck bei Geländesprüngen, Böschungsflächen und im gestalterischen Landschaftsbau.
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-text-main/80">
                      <li>• <strong>Mauerscheiben &amp; L-Steine:</strong> Monolithische Stahlbetonbauteile nach statischer Bemessung für Lastfälle mit und ohne PKW-Auffahrgeschwindigkeiten.</li>
                      <li>• <strong>Gabionen (Steinkörbe):</strong> Hochwertig verzinkte Stahlgitterkörbe zur flexiblen, wasserdurchlässigen Schwerkraft-Stützmauer-Konstruktion.</li>
                      <li>• <strong>Böschungs- &amp; Florgitter:</strong> Hohlsteine zur mechanischen Sicherung von Steilhängen mit der Option zur anschließenden Begrünung.</li>
                    </ul>
                  </div>
                </div>

                {/* 7. Kabelschutz */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                      <span>7. Kabelschutz- &amp; Leitungsrohre</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">DIN EN 61386-24</span>
                    </h4>
                    <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                      Sichere Verlegung von Strom-, Telekommunikations- und Glasfasertrassen im Erdreich mit mechanischem Schutz.
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-text-main/80">
                      <li>• <strong>Verbund-Kabelschutzrohre (PE-HD):</strong> Gewellter Außenmantel für Biegsamkeit und hohe Ringsteifigkeit, innen glatte Gleitschicht für reibungsfreien Kabeleinzug.</li>
                      <li>• <strong>Kabelabdeckplatten &amp; Hauben:</strong> Warnende Kunststoffplatten zum Schutz erdverlegter Starkstromkabel vor Baggerzähnen bei späteren Tiefbauarbeiten.</li>
                      <li>• <strong>Mehrsparten-Hauseinführungen:</strong> Gas- und druckwasserdichte Bündeldurchführungen durch Bodenplatten und Außenwände.</li>
                    </ul>
                  </div>
                </div>

                {/* 8. Linien- & Punktentwässerung */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                      <span>8. Linien- &amp; Punktentwässerung</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">DIN EN 1433 / DIN 4052</span>
                    </h4>
                    <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                      Schnelle Entwässerung versiegelter und geneigter Verkehrsflächen zur Vermeidung von Aquaplaning und Überflutung.
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-text-main/80">
                      <li>• <strong>Entwässerungsrinnen:</strong> Rinnenkörper aus verschleißfestem Polymerbeton oder faserarmierter Polyethylen-Verbindung. Rostaufsätze aus Sphäroguss oder Edelstahl bis Klasse F900.</li>
                      <li>• <strong>Hofabläufe &amp; Straßenabläufe:</strong> Standardisierte Punktentwässerungen (Gully DN 450) mit integriertem Schlammeimer zur mechanischen Feststoff-Vorreinigung.</li>
                      <li>• <strong>Schlitzrinnen:</strong> Extrem unauffällige, flächenbündige Schlitzsysteme für repräsentative Fußgänger- und Marktplatzflächen.</li>
                    </ul>
                  </div>
                </div>

                {/* 9. Regenwasser-Bewirtschaftung */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                      <span>9. Regenwasser-Bewirtschaftung</span>
                      <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">DWA-A 138 / DWA-M 153</span>
                    </h4>
                    <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                      Moderne Regenrückhaltung, Versickerung und kontrollierte Einleitung zur Entlastung des urbanen Mischwassernetzes.
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-text-main/80">
                      <li>• <strong>Füllkörperrigolen (PP Sickerboxen):</strong> Kubische Netzwerkkörper mit bis zu 95% freiem Hohlvolumen. Spül- und kamerabefahrbar zur Funktionsüberwachung.</li>
                      <li>• <strong>Regenwasserrückhaltebecken &amp; Zisternen:</strong> Unterirdische Staukanäle und Betongroßbehälter zur Sammlung und gedrosselten Abgabe.</li>
                      <li>• <strong>Koaleszenzabscheider:</strong> Abscheideanlagen für mineralische Leichtflüssigkeiten (Öl/Benzin) zur Vorbehandlung kritischer Straßenabwässer vor Versickerung.</li>
                    </ul>
                  </div>
                </div>

                {/* 10. Sanierungsprodukte */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                      <span>10. Sanierungsprodukte im Straßenbau</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">ZTV Fug-StB</span>
                    </h4>
                    <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                      Spezialwerkstoffe zur dauerhaften Instandsetzung von Rissen, Schlaglöchern und Schachtabdeckungen im Asphalt- und Betonstraßenbau.
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-text-main/80">
                      <li>• <strong>Bitumen-Schmelzbänder (Rissbänder):</strong> Heiß oder kalt verlegbare Anschlussbänder zur dichten Verbindung von neuem Asphalt an Ränder und Schächte (Nahtausbildung).</li>
                      <li>• <strong>Reparaturmörtel &amp; Verguss:</strong> Schachtrahmen-Reguliermörtel mit sehr hoher Frühfestigkeit (frühe Verkehrsfreigabe nach Herstellerangabe).</li>
                      <li>• <strong>Kaltasphalt (Reaktiv-Mischgut):</strong> Gesteinsmischung mit polymerem Bindemittel, härtet unter Feuchtigkeitseinwirkung für eilige Schadstellenbeseitigungen aus.</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 2: Interactive Rigolen-Rechner & Schachtkomparator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-zinc-200 pt-6">
              
              {/* Rigolenberechnung (Left: Controls, Right: Result) */}
              <div className="lg:col-span-12 bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs">
                <h4 className="font-extrabold text-sm text-text-main mb-2 flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                  <Calculator size={16} className="text-shiraz" /> II. Interaktives Planungs-Muster: Rigolenbemessung nach DWA-A 138
                </h4>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4">
                  Die Bemessung eines unterirdischen Sickerelements (Rigole) basiert auf der Niederschlagsfläche A_E, dem spezifischen Spitzenregen r_D und der Infiltration in das umgebende Erdreich. Der vereinfachte Rechner schätzt das erforderliche Speichervolumen ab (Lehrmodell; Bemessung nach DWA-A 138).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Controls */}
                  <div className="md:col-span-5 bg-off-white p-4 rounded-xl border border-home-grau/20 space-y-4">
                    {/* Area */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-text-main">
                        <span>Angeschlossene Auffangfläche (A_E):</span>
                        <span className="font-mono text-zinc-900 font-bold">{formatDeWert(tiefbauArea)} m²</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="2000" 
                        step="10"
                        value={tiefbauArea}
                        onChange={(e) => setTiefbauArea(parseInt(e.target.value))}
                        className="w-full accent-shiraz" 
                      />
                    </div>

                    {/* Runoff coeff */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-text-main">
                        <span>Abflussbeiwert (ψ):</span>
                        <span className="font-mono text-zinc-900 font-bold">{formatDeZahl(tiefbauPsi, 2)}</span>
                      </div>
                      <select 
                        value={tiefbauPsi}
                        onChange={(e) => setTiefbauPsi(parseFloat(e.target.value))}
                        className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white"
                      >
                        <option value="0.9">0,90 (Asphalt, fugenloser Beton, Metalldach)</option>
                        <option value="0.75">0,75 (Betonpflaster mit dichten Fugen)</option>
                        <option value="0.5">0,50 (Kiesbelag, Kiesdach)</option>
                        <option value="0.3">0,30 (Gründach, unbefestigter Boden)</option>
                      </select>
                    </div>

                    {/* Rain intensity */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-text-main">
                        <span>Bemessungsregen-Intensität (r_D):</span>
                        <span className="font-mono text-zinc-900 font-bold">{formatDeWert(tiefbauRain)} l/(s·ha)</span>
                      </div>
                      <input 
                        type="range" 
                        min="80" 
                        max="500" 
                        step="10"
                        value={tiefbauRain}
                        onChange={(e) => setTiefbauRain(parseInt(e.target.value))}
                        className="w-full accent-shiraz" 
                      />
                    </div>

                    {/* Duration */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-text-main border-none">
                        <span>Regendauer (t_d):</span>
                        <span className="font-mono text-zinc-900 font-bold">{formatDeWert(tiefbauDuration)} min</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="60" 
                        step="5"
                        value={tiefbauDuration}
                        onChange={(e) => setTiefbauDuration(parseInt(e.target.value))}
                        className="w-full accent-shiraz" 
                      />
                    </div>

                    {/* Storage Type Coefficient */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-text-main border-none">
                        <span>Sickerelement Typ (Speichereffizienz):</span>
                        <span className="font-mono text-zinc-900 font-bold">{formatDeZahl((tiefbauFss * 100), 0)}% Hohlraum</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={() => setTiefbauFss(0.95)}
                          className={`py-1.5 px-2 text-[11px] rounded-md font-bold border transition-all ${
                            tiefbauFss === 0.95
                              ? 'bg-shiraz text-white border-shiraz shadow-md'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          Kunststoff-Sickerbox
                        </button>
                        <button
                          onClick={() => setTiefbauFss(0.30)}
                          className={`py-1.5 px-2 text-[11px] rounded-md font-bold border transition-all ${
                            tiefbauFss === 0.30
                              ? 'bg-shiraz text-white border-shiraz shadow-md'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          Kies-/Schotterbett
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Calculations and visualization */}
                  {(() => {
                    const a_red = (tiefbauArea * tiefbauPsi);
                    const q_in = a_red * (tiefbauRain / 10000); // l/s
                    const v_zu_liters = q_in * (tiefbauDuration * 60); // Liters
                    const v_zu_m3 = v_zu_liters / 1000; // m³

                    const k_f = 1.0e-5; // m/s (Sandiger Lehm / Feinsand)
                    const a_sohle = Math.max(1.5, v_zu_m3 * 0.35); // m²
                    const q_sicker_l_s = k_f * a_sohle * 1000; // l/s
                    const v_sicker_liters = q_sicker_l_s * (tiefbauDuration * 60);
                    const v_sicker_m3 = v_sicker_liters / 1000;

                    const f_S = 1.1; // Sicherheitsbeiwert (DWA-A 138)
                    // Bruttovolumen der Rigole (Füllkörper bzw. Kies inkl. Feststoff): V_R = f_S · (V_zu − V_s) / s_R
                    const v_speicher_m3 = Math.max(0.1, f_S * (v_zu_m3 - v_sicker_m3) / tiefbauFss);
                    const v_nutz_m3 = v_speicher_m3 * tiefbauFss; // speicherwirksames Porenvolumen
                    const h_rig = 0.6;
                    const b_rig = 1.2;
                    const l_rig = v_speicher_m3 / (h_rig * b_rig);
                    const num_boxes = Math.ceil(v_nutz_m3 / 0.24);

                    return (
                      <div className="md:col-span-7 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          {/* Zufluss-Details */}
                          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                            <span className="text-[10px] uppercase font-mono font-bold text-zinc-500">Hydraulischer Zufluss</span>
                            <div className="text-xl font-bold text-zinc-900 font-mono mt-1">{formatDeZahl(v_zu_m3, 2)} m³</div>
                            <p className="text-[10px] text-zinc-500 leading-normal mt-1 w-full">
                              Spitzenzuflussrate Q_in beträgt <strong className="font-mono">{formatDeZahl(q_in, 1)} l/s</strong> über die reduzierte Auffangfläche A_red = {formatDeZahl(a_red, 0)} m².
                            </p>
                          </div>

                          {/* Sicker-Details */}
                          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                            <span className="text-[10px] uppercase font-mono font-bold text-zinc-500">Boden-Infiltration</span>
                            <div className="text-xl font-bold text-zinc-900 font-mono mt-1">{formatDeZahl(v_sicker_m3, 3)} m³</div>
                            <p className="text-[10px] text-zinc-500 leading-normal mt-1 w-full">
                              Infiltration über Sohle (A_soh ≈ {formatDeZahl(a_sohle, 1)} m²) bei Sand/Schluff-Boden (k_f = 10⁻⁵ m/s): <strong className="font-mono">{formatDeZahl(q_sicker_l_s, 3)} l/s</strong>.
                            </p>
                          </div>

                        </div>

                        {/* Speicher-Ergebnis */}
                        <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] uppercase font-mono font-bold text-shiraz">Erforderliches Rigolen-Bruttovolumen (V_rig)</span>
                              <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">{formatDeZahl(v_speicher_m3, 2)} m³</div>
                            </div>
                            <div className="text-right text-[10px] text-slate-800 font-mono">
                              <div>DWA-A 138 Planungsentwurf</div>
                              <div>Sicherheitsbeiwert f_S = 1,1 integriert</div>
                            </div>
                          </div>

                          {/* Statisches Resultat / Empfehlung */}
                          <div className="border-t border-home-grau/30 pt-3 mt-3 text-xs leading-relaxed text-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <p className="font-bold">Konstruktive Empfehlung:</p>
                              {tiefbauFss === 0.95 ? (
                                <p className="text-[11px] mt-0.5 text-slate-900 font-medium">
                                  Verwendung von PP-Sickerboxen (Rigolenfüllkörper): <span className="font-mono font-bold text-slate-800">{num_boxes} Standard-Sickerboxen</span> (0,24m³ Nutzkapazität je Box) mit umhüllendem Filtervlies (Geotextil) erforderlich.
                                </p>
                              ) : (
                                <p className="text-[11px] mt-0.5 text-slate-900 font-medium">
                                  Verwendung eines Kiesgrabens (Körnung 16/32, Hohlraumfaktor s_R = 0,3): Der Kieskörper benötigt ein Bruttovolumen von ca. <span className="font-mono font-bold text-slate-800">{formatDeZahl(v_speicher_m3, 1)} m³</span>, davon speicherwirksam (Porenraum) ca. <span className="font-mono font-bold text-slate-800">{formatDeZahl(v_nutz_m3, 1)} m³</span>.
                                </p>
                              )}
                            </div>
                            <div className="font-mono text-[11px] bg-white/60 p-2.5 rounded border border-home-grau/30 flex flex-col justify-center">
                              <div>Sohlentiefe: <span className="font-bold">0,60 m</span></div>
                              <div>Breite: <span className="font-bold">1,20 m</span></div>
                              <div>Erforderliche Länge: <span className="font-bold text-slate-800">{formatDeZahl(l_rig, 2)} m</span></div>
                            </div>
                          </div>
                        </div>

                        {/* Formel-Herleitung */}
                        <div className="p-3 text-[10.5px] text-text-main/60 bg-zinc-50 border border-zinc-200 rounded-lg">
                          <span className="font-bold text-text-main block mb-1">DWA-A 138 Speicherbemessungsgleichung:</span>
                          <FormulaText text="V_{rig} = \frac{A_{red} \cdot 10^{-7} \cdot r_D \cdot t_d \cdot 60 - A_{sohle} \cdot k_f \cdot t_d \cdot 60}{s_R}" />
                          <span className="text-[10px] block mt-1 leading-normal">
                            Hierbei steht s_R für den systembedingten Hohlraumgehalt, der bei synthetischen Füllkörperblöcken (Hohlraumboxen) bis zu 95% beträgt, wohingegen Kiesträgerbetten nur etwa 30% Hohlvolumen einbringen können.
                          </span>
                        </div>

                      </div>
                    );
                  })()}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: Bahnbau (Gleisthermik & Oberbau) */}
        {activeTab === 'bahnbau' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Fachwissen Schienenoberbau */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 space-y-4">
                <h3 className="font-bold text-text-main text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                  <Train size={16} className="text-shiraz" /> Systemkomponenten & Trassierung im Bahnbau
                </h3>
                
                <div className="space-y-4 text-xs text-text-main/75 leading-relaxed">
                  <div>
                    <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1">Gleisschotter (DIN EN 13450)</h5>
                    <p>
                      Der klassische Schotteroberbau verteilt die hohen Lasten der Achsen elastisch auf das Planum. Eisenbahnschotter muss aus zähelastischem Hartgestein (z. B. Basalt oder Granit) bestehen, um den hohen Schlag- und Abriebbeanspruchungen standzuhalten. Wichtigste Kriterien: 
                      Flachheitskennzahl (≤ 20 %) und Widerstand gegen Schlagzertrümmerung (SZ ≤ 20 %).
                    </p>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1">Feste Fahrbahn (Slab Track)</h5>
                    <p>
                      Auf Hochgeschwindigkeitsstrecken wird häufig die Feste Fahrbahn eingesetzt (z. B. System Rheda 2000 oder ÖBB-PORR). Dabei entfällt der elastische Schotter; die Schwellen bzw. Stützpunkte werden in eine Betontragplatte eingebunden. 
                    </p>
                    <ul className="list-disc pl-4 mt-1.5 space-y-1 text-[11px]">
                      <li><strong>Vorteil:</strong> Hohe Lagestabilität und geringer Instandhaltungsaufwand.</li>
                      <li><strong>Nachteil:</strong> Hohe Investitionskosten, schwierige Körperschallisolation, extrem aufwendiger Rückbau bei Setzungen.</li>
                    </ul>
                  </div>

                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                    <h5 className="font-bold text-zinc-800 text-xs mb-1">UIC 60 Schienenprofil</h5>
                    <p className="text-[11px]">
                      Das Schienenprofil UIC 60 hat ein Metergewicht von 60,34 kg/m und eine Querschnittsfläche von A = 76,86 cm² (heutiges Profil 60E1: ca. 60,2 kg/m). Schienenstahl R260 hat eine Zugfestigkeit von mind. 880 N/mm²; die Schienen sind lückenlos verschweißt.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interaktiver Gleissicherungs-Rechner */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calculator size={16} className="text-shiraz" /> Interaktives Labor: Thermische Eigenspannung & Verwerfungsrisiko
                </h3>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4">
                  Das kontinuierlich verschweißte Gleis (lückenloses Gleis) verhindert Stoßlücken, erzwingt jedoch bei Erwärmung Schienenlängskräfte. Berechnen Sie die statischen Zwangsspannungen und evaluieren Sie das Risiko elastischer Ausknickungen (Gleisverwerfungen).
                </p>

                <div className="space-y-4">
                  {/* Schienentemperatur */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-text-main">
                      <span>Aktuelle Schienentemperatur (T_Schiene):</span>
                      <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(schieneTemp)} °C</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mb-1">Im Sommer können absorbierende Stahlschienen bis zu 25°C über der Lufttemperatur liegen!</div>
                    <input 
                      type="range" 
                      min="-20" 
                      max="60" 
                      step="1"
                      value={schieneTemp}
                      onChange={(e) => setSchieneTemp(parseInt(e.target.value))}
                      className="w-full accent-shiraz" 
                    />
                  </div>

                  {/* Neutralisationstemperatur */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-text-main border-none">
                      <span>Herstellungs- / Neutralisationstemperatur (T_Neutral):</span>
                      <span className="font-mono text-xs">{formatDeWert(neutralTemp)} °C</span>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="25" 
                      step="1"
                      value={neutralTemp}
                      onChange={(e) => setNeutralTemp(parseInt(e.target.value))}
                      className="w-full accent-shiraz" 
                    />
                  </div>

                  {/* Bettungstyp */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-text-main">Oberbaubettung & Querverschiebewiderstand (Q_vw):</label>
                    <select aria-label="Oberbaubettung & Querverschiebewiderstand (Q_vw)" 
                      value={bettungstyp}
                      onChange={(e) => setBettungstyp(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white"
                    >
                      <option value="schotter_mager">Schotterbett (mangelhaft verdichtet / kein Schotterkopf): Knickgrenze σ = 90 MPa</option>
                      <option value="schotter_gut">Schotterbett (solide nach ZTV, voller Schotterkopf): Knickgrenze σ = 135 MPa</option>
                      <option value="feste_fahrbahn">Feste Fahrbahn (Betonplattenbauweise): Knickfest gegen Verwerfung</option>
                    </select>
                  </div>

                  {/* Berechnungsausgabe */}
                  {(() => {
                    const deltaT = schieneTemp - neutralTemp;
                    const E_steel = 210000; // MPa
                    const alpha_T = 1.2e-5; // 1/K
                    const sigma_T = E_steel * alpha_T * deltaT; // in MPa
                    const area_uic60 = 7686; // mm²
                    const force_per_rail_kN = (sigma_T * area_uic60) / 1000; // in kN
                    const force_total_track_kN = force_per_rail_kN * 2; // Gelasierte Gleislängskraft (2 Schienen)

                    let statusMsg = "";
                    let statusColorClass = "";
                    let knickLimit = 135;
                    if (bettungstyp === 'schotter_mager') knickLimit = 90;
                    else if (bettungstyp === 'feste_fahrbahn') knickLimit = 999;

                    if (sigma_T < -120) {
                      statusMsg = "Kritische Zugspannung! Erhöhte Gefahr von spröden Schienenbrüchen im Schweißnahtbereich bei Frost.";
                      statusColorClass = "text-rose-700 bg-rose-50 border-rose-200";
                    } else if (sigma_T < 0) {
                      statusMsg = "Zugspannungsbereich (Winterbetrieb). Schienenkontraktion ist weitgehend stabil.";
                      statusColorClass = "text-emerald-700 bg-emerald-50 border-emerald-100";
                    } else if (bettungstyp === 'feste_fahrbahn') {
                      statusMsg = "Formstabile Verankerung. Feste Fahrbahn verhindert elastisches Verwerfen mechanisch.";
                      statusColorClass = "text-emerald-700 bg-emerald-50 border-emerald-100";
                    } else if (sigma_T >= knickLimit) {
                      statusMsg = "AKUTE GEFAHR VON GLEISVERWERFUNG! Die thermische Druckspannung übersteigt den Querverschiebewiderstand des Schotters. Geschwindigkeitsreduzierung bzw. Gleisüberwachung dringend erforderlich!";
                      statusColorClass = "text-rose-700 bg-rose-50 border-rose-200";
                    } else if (sigma_T >= knickLimit * 0.7) {
                      statusMsg = "Erhöhtes Risiko. Geringer Querverschiebesicherheitsbeiwert. Schotterbettfeuchtigkeit & Flanke penibel prüfen.";
                      statusColorClass = "text-amber-700 bg-amber-50 border-amber-200";
                    } else {
                      statusMsg = "Thermische Eigenspannung unkritisch. Ausreichend elastische Rückhaltekraft im Gleiskörper vorhanden.";
                      statusColorClass = "text-emerald-700 bg-emerald-50 border-emerald-100";
                    }

                    return (
                      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3 mt-4 text-xs">
                        <div className="grid grid-cols-2 font-mono gap-y-1">
                          <div className="text-zinc-500 font-bold">Temperaturdifferenz (ΔT):</div>
                          <div className="text-right font-extrabold text-zinc-900">{deltaT > 0 ? `+${formatDeWert(deltaT)}` : deltaT} K</div>
                          
                          <div className="text-zinc-500 font-bold">Eigenspannung (σ_T):</div>
                          <div className={`text-right font-extrabold ${sigma_T >= 0 ? 'text-rose-800' : 'text-blue-800'}`}>
                            {formatDeZahl(sigma_T, 2)} MPa {(sigma_T >= 0 ? '(Druck)' : '(Zug)')}
                          </div>

                          <div className="text-zinc-500 font-bold">Längskraft pro Schiene:</div>
                          <div className="text-right font-bold text-zinc-700">{formatDeZahl(force_per_rail_kN, 1)} kN</div>

                          <div className="text-zinc-500 font-bold">Gleislängskraft (2 Schienen):</div>
                          <div className="text-right font-extrabold text-zinc-950">{formatDeZahl(force_total_track_kN, 1)} kN</div>
                        </div>

                        {/* Formel-Dokumentation */}
                        <div className="text-[10px] text-zinc-400 bg-white p-2 rounded border border-zinc-150 font-mono">
                          Berechnungsformel: σ_T = E · α_T · (T_Schiene - T_Neutral)
                          mit E = 210.000 N/mm² und α_T = 1,2 · 10⁻⁵ / K.
                        </div>

                        {/* Status Alert */}
                        <div className={`p-2.5 rounded-lg border text-[11px] font-semibold leading-relaxed ${statusColorClass}`}>
                          {statusMsg}
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: Tunnelbau (Vortrieb & Statik) */}
        {activeTab === 'tunnelbau' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Tunnelbau Fachwissen */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 space-y-4">
                <h3 className="font-bold text-text-main text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                  <HardHat size={16} className="text-shiraz" /> Zyklischer Vortrieb & Die Neue Österreichische Tunnelbauweise
                </h3>
                
                <div className="space-y-4 text-xs text-text-main/75 leading-relaxed">
                  <div>
                    <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1">Das Prinzip der NÖT (NATM)</h5>
                    <p>
                      Die <strong>Neue Österreichische Tunnelbauweise (NÖT)</strong> prägte maßgebend die Entwicklung des modernen Tunnelbaus. Das Hauptprinzip besagt, dass das umgebende Gebirge nicht nur als belastende Masse betrachtet werden darf, sondern selbst als <strong>tragendes Bauteil (Gewölbe)</strong> herangezogen werden muss.
                    </p>
                    <p className="mt-1.5">
                      Direkt nach dem mechanischen Abschlag oder der Sprengung werden kontrollierte radiale Verformungen des Gebirges zugelassen, um die Spannungsspitzen abzubauen. Anschliessend wird die Tunneldecke durch eine spritzbare Betonschale, Felsanker und Gitterträger sekundenschnell abgedichtet und verbaut.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1">Frühfestigkeitsklassen bei Spritzbeton</h5>
                    <p>
                      Nach der Richtlinie Spritzbeton werden zur Gewährleistung des Arbeitsschutzes direkt nach dem Aufspritzen Einstufungen vorgenommen:
                    </p>
                    <ul className="list-disc pl-4 mt-1.5 space-y-1 text-[11px]">
                      <li><strong>Klasse J1:</strong> Geringe Frühfestigkeit – für dünne Lagen auf trockenem Untergrund ohne besondere Anforderungen.</li>
                      <li><strong>Klasse J2:</strong> Höhere Frühfestigkeit – für dickere Lagen, auch über Kopf, und bei Wasserandrang.</li>
                      <li><strong>Klasse J3:</strong> Sehr hohe Frühfestigkeit – bei stark wasserführendem oder nachbrüchigem Gebirge (mehr Staub und Rückprall).</li>
                    </ul>
                  </div>

                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                    <h5 className="font-bold text-zinc-800 text-xs mb-1">Vortriebsverfahren im Vergleich</h5>
                    <p className="text-[11px]">
                      Während die NÖT flexibel auf wechselnde Geologien (Felswechsel, Störungszonen) reagieren kann, eignet sich der <strong>Schildvortrieb mit Tunnelbohrmaschinen (TBM)</strong> vor allem bei langen Tunnelstrecken in gleichartigem Baugrund aufgrund der vollautomatisierten Einbringung von Betonfertigteil-Tübbingen.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interaktiver Spritzbeton Rechner */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calculator size={16} className="text-shiraz" /> Statische Vordimensionierung der Spritzbetonsicherung
                </h3>
                <p className="text-xs text-text-main/70 leading-relaxed mb-4">
                  Lehrmodell: Mit der Kesselformel (σ = p · r / d) lässt sich die Ringdruckspannung einer Spritzbetonschale unter angenommenem radialem Gebirgsdruck abschätzen. Eine echte Bemessung erfordert gebirgsmechanische Nachweise.
                </p>

                <div className="space-y-4">
                  {/* Tunnelradius */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-text-main">
                      <span>Vortriebs-Aussenradius (R):</span>
                      <span className="font-mono text-xs text-shiraz font-bold">{formatDeZahl(tunnelRadius, 1)} m</span>
                    </div>
                    <input 
                      type="range" 
                      min="3.0" 
                      max="8.0" 
                      step="0.1"
                      value={tunnelRadius}
                      onChange={(e) => setTunnelRadius(parseFloat(e.target.value))}
                      className="w-full accent-shiraz" 
                    />
                  </div>

                  {/* Radialer Gebirgsdruck */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-text-main">
                      <span>Gebirgsdruck (p_g / Radialspannung):</span>
                      <span className="font-mono text-xs text-shiraz font-bold">{formatDeZahl(gebirgsdruck, 2)} MPa</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mb-1">Hinweis: 0,10 MPa ≈ 10 t/m² vertikale Auflast.</div>
                    <input aria-label="Hinweis: 0,10 MPa ≈ 10 t/m² vertikale Auflast." 
                      type="range" 
                      min="0.05" 
                      max="0.50" 
                      step="0.01"
                      value={gebirgsdruck}
                      onChange={(e) => setGebirgsdruck(parseFloat(e.target.value))}
                      className="w-full accent-shiraz" 
                    />
                  </div>

                  {/* Spritzbetondicke */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-text-main">
                      <span>Sicherungsdicke (d):</span>
                      <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(spritzbetonDicke)} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="35" 
                      step="1"
                      value={spritzbetonDicke}
                      onChange={(e) => setSpritzbetonDicke(parseInt(e.target.value))}
                      className="w-full accent-shiraz" 
                    />
                  </div>

                  {/* Betonfestigkeitsklasse */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-text-main">Betonfestigkeitsklasse (Spritzbeton):</label>
                    <select aria-label="Betonfestigkeitsklasse (Spritzbeton)" 
                      value={betonKlasse}
                      onChange={(e) => setBetonKlasse(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white"
                    >
                      <option value="C20/25">C20/25 (zylindrische Festigkeit f_ck = 20 MPa)</option>
                      <option value="C25/30">C25/30 (zylindrische Festigkeit f_ck = 25 MPa)</option>
                      <option value="C30/37">C30/37 (zylindrische Festigkeit f_ck = 30 MPa)</option>
                    </select>
                  </div>

                  {/* Ergebnisse Statik */}
                  {(() => {
                    const d_meters = spritzbetonDicke / 100; // cm -> m
                    const sigma_ring = (gebirgsdruck * tunnelRadius) / d_meters; // in MPa
                    
                    let f_ck = 25;
                    if (betonKlasse === 'C20/25') f_ck = 20;
                    else if (betonKlasse === 'C30/37') f_ck = 30;

                    // Temporärer Bemessungswert f_cd nach EC2 (vereinfacht für Bauzustand): f_cd = α_cc * f_ck / γ_c
                    const gamma_c = 1.3; // Temporärer Zustand im Tunnelbau
                    const alpha_cc = 0.85; 
                    const f_cd = (alpha_cc * f_ck) / gamma_c; // in MPa
                    const utilization = (sigma_ring / f_cd) * 100;
                    const isSafe = utilization <= 100;

                    return (
                      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3 mt-4 text-xs font-sans">
                        <div className="grid grid-cols-2 font-mono gap-y-1">
                          <div className="text-zinc-500 font-bold">Ringdruckkraft (N_ring):</div>
                          <div className="text-right font-bold text-zinc-950">{formatDeZahl((gebirgsdruck * tunnelRadius * 1000), 1)} kN/m</div>

                          <div className="text-zinc-500 font-bold">Ringdruckspannung (σ_Ring):</div>
                          <div className="text-right font-extrabold text-shiraz">{formatDeZahl(sigma_ring, 2)} MPa</div>

                          <div className="text-zinc-500 font-bold">Bemessungsfestigkeit (f_cd,temp):</div>
                          <div className="text-right font-bold text-emerald-800">{formatDeZahl(f_cd, 2)} MPa</div>

                          <div className="text-zinc-500 font-bold">Auslastungsgrad (η):</div>
                          <div className={`text-right font-extrabold ${isSafe ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {formatDeZahl(utilization, 1)} %
                          </div>
                        </div>

                        {/* Formel-Dokumentation */}
                        <div className="text-[10px] text-zinc-400 bg-white p-2 rounded border border-zinc-150 font-mono leading-relaxed">
                          Ringnormalspannungsformel: σ_Ring = (p_g · R) / d
                          Teilsicherheitsbeiwert Bauzustand: γ_c = 1,3 (Lehrannahme)
                        </div>

                        {/* Status Alert */}
                        <div className={`p-2.5 rounded-lg border text-[11px] font-semibold leading-relaxed ${
                          isSafe ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-rose-700 bg-rose-50 border-rose-200'
                        }`}>
                          {isSafe ? (
                            <span>✓ Im Lehrmodell ausreichend: Die Ringdruckspannung liegt unter dem Bemessungswert der Spritzbetonfestigkeit.</span>
                          ) : (
                            <span>✗ Im Lehrmodell nicht ausreichend: Die Ringdruckspannung übersteigt den Bemessungswert. Erhöhen Sie die Dicke oder die Festigkeitsklasse.</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: Betondecken im Straßenbau (ZTV Beton-StB) */}
        {activeTab === 'betondecken' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Academic Briefing banner */}
            <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-shiraz" />
                Fahrbahndecken aus Beton nach ZTV Beton-StB &amp; RLaO
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Fahrbahndecken aus Beton (starre Befestigungen) haben eine hohe Tragfähigkeit und bilden <strong>keine Spurrinnen durch plastische Verformung</strong>. Sie erreichen oft Nutzungsdauern von <span className="font-bold">mehr als 30 Jahren</span>. 
                Die konstruktiven Kriterien für Autobahnen und Bundesstraßen sind in den <strong>Zusätzlichen Technischen Vertragsbedingungen für Fahrbahndecken aus Beton (ZTV Beton-StB)</strong> sowie in den <strong>RDO Beton</strong> (Richtlinien für die rechnerische Dimensionierung von Betondecken) verankert.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1 text-[11px]">
                <div className="bg-white p-2.5 rounded border border-zinc-200">
                  <span className="font-bold text-shiraz block">Betonfestigkeit</span>
                  Standardmäßig <strong>C30/37</strong> (Biegezugprüfung m_fct,sp ≥ 4,5 MPa).
                </div>
                <div className="bg-white p-2.5 rounded border border-zinc-200">
                  <span className="font-bold text-shiraz block">Expositionsklassen</span>
                  <strong>XF4 &amp; XM2</strong> (sehr hoher Frost-Tausalz- &amp; mechanischer Verschleiß-Widerstand).
                </div>
                <div className="bg-white p-2.5 rounded border border-zinc-200">
                  <span className="font-bold text-shiraz block">Oberflächentextur</span>
                  Waschbeton-Struktur (Erzeugung eines rauen Freilegens des Edelsplitts zur Lärmreduktion).
                </div>
                <div className="bg-white p-2.5 rounded border border-zinc-200">
                  <span className="font-bold text-shiraz block">Wassereinfluss</span>
                  Gefährdung durch <strong>Alkali-Kieselsäure-Reaktion (AKR)</strong> bei reaktivem Quarz und Tausalz.
                </div>
              </div>
            </div>

            {/* Main Interactive Screen layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Interaktive Bemessung */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Panel 1: Plattendicken-Dimensionierer (Westergaard) */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
                  <h4 className="font-extrabold text-sm text-text-main flex items-center gap-1 border-b border-zinc-100 pb-2">
                    <Calculator size={15} className="text-shiraz" />
                    1. Plattenstärken-Prüfer (elastischer Halbraum nach Westergaard)
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Berechnet die kritische Biegezugspannung am unbelasteten Plattenrand (kritischster Lastfall im Fugenkantenbereich) nach der klassischen Westergaard-Gleichung für den Plattenrand (Lehrmodell).
                  </p>

                  <div className="space-y-4">
                    {/* Plattendicke h */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-text-main">
                        <span>Deckendicke (h):</span>
                        <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(betonSlabThickness)} cm</span>
                      </div>
                      <input 
                        type="range" 
                        min="18" 
                        max="35" 
                        step="1"
                        value={betonSlabThickness}
                        onChange={(e) => setBetonSlabThickness(parseInt(e.target.value))}
                        className="w-full accent-shiraz" 
                      />
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>Typisch Bk0.3: 18-20 cm</span>
                        <span>Autobahn Bk100: 28-30 cm/WASH-Beton</span>
                      </div>
                    </div>

                    {/* Belastungsklasse & Achslast P */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-text-main">
                        <span>Bemessungs-Achsübergang (P_achse):</span>
                        <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(betonAchslast)} kN</span>
                      </div>
                      <input 
                        type="range" 
                        min="100" 
                        max="180" 
                        step="5"
                        value={betonAchslast}
                        onChange={(e) => setBetonAchslast(parseInt(e.target.value))}
                        className="w-full accent-shiraz" 
                      />
                      <div className="text-[10px] text-zinc-500">
                        Radlast (P_rad) = P_achse / 2 = {formatDeZahl((betonAchslast / 2), 0)} kN. Typisches Lkw-Rad für Dimensionierungen.
                      </div>
                    </div>

                    {/* Bettungsmodul k */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-text-main">
                        <span>Bettungsmodul des Unterbaus (k-Wert):</span>
                        <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(betonBettung)} MN/m³</span>
                      </div>
                      <input 
                        type="range" 
                        min="30" 
                        max="150" 
                        step="5"
                        value={betonBettung}
                        onChange={(e) => setBetonBettung(parseInt(e.target.value))}
                        className="w-full accent-shiraz" 
                      />
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>Erdbau (weich): 30 MN/m³</span>
                        <span>Stabile HGT/Zement: 100-120 MN/m³</span>
                      </div>
                    </div>

                    {/* Berechnung output */}
                    {(() => {
                      const E_conc = 34000; // MPa or N/mm²
                      const nu_conc = 0.2; // Poisson ratio
                      const h_mm = betonSlabThickness * 10;
                      const P_wheel_N = (betonAchslast / 2) * 1000; // in Newtons
                      const k_N_mm3 = betonBettung * 1e-3; // MN/m³ to N/mm³

                      // Radius of relative stiffness l [mm]
                      const l_mm = Math.pow((E_conc * Math.pow(h_mm, 3)) / (12 * (1 - Math.pow(nu_conc, 2)) * k_N_mm3), 0.25);
                      
                      // Equivalent contact radius r [mm] assuming tire pressure of 0.8 MPa
                      const r_mm = Math.sqrt(P_wheel_N / (0.8 * Math.PI));

                      // Westergaard Randbiegespannung sigma_e [MPa]
                      // sigma_e = 0.572 * (P / h^2) * [4 * log10(l / r) + 0.359]
                      const log_val = Math.log10(l_mm / r_mm);
                      const sigma_e = (0.572 * P_wheel_N / Math.pow(h_mm, 2)) * (4 * log_val + 0.359);

                      // Grenzspannungsprüfung
                      // C30/37 Biegezug-Charakteristik = 4.5 MPa. Dauerfestigkeitsfaktor unter zyklischer Autobahnbelastung = 2.0 -> zulässig ca. 2.25 MPa
                      const allowed_sigma = 2.25; 
                      const isThicknessOK = sigma_e <= allowed_sigma;
                      const ratio = (sigma_e / allowed_sigma) * 100;

                      return (
                        <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-lg space-y-3 mt-3 text-xs">
                          <h5 className="font-bold text-zinc-800">Spannungsermittlung nach Westergaard-Theorie:</h5>
                          <div className="grid grid-cols-2 font-mono gap-y-1 text-[11px]">
                            <div className="text-zinc-500">Radaufstandsfläche (r_t):</div>
                            <div className="text-right text-zinc-800">ø {formatDeZahl((r_mm * 2 / 10), 1)} cm (r = {formatDeZahl(r_mm, 0)} mm)</div>
                            
                            <div className="text-zinc-500">Elastische Steifigkeitslänge (l):</div>
                            <div className="text-right text-zinc-800">{formatDeZahl((l_mm / 10), 1)} cm (l = {formatDeZahl(l_mm, 0)} mm)</div>

                            <div className="text-zinc-500">Berechnete Dehnspannung (σ_e):</div>
                            <div className="text-right text-shiraz font-black">{formatDeZahl(sigma_e, 2)} N/mm² (MPa)</div>

                            <div className="text-zinc-500">Zul. Dehnspannung (Dauerlast):</div>
                            <div className="text-right text-emerald-800 font-bold">{formatDeZahl(allowed_sigma, 2)} N/mm²</div>

                            <div className="text-zinc-500">Ausnutzungsgrad (η_Biege):</div>
                            <div className={`text-right font-black ${isThicknessOK ? 'text-emerald-700' : 'text-red-700'}`}>{formatDeZahl(ratio, 1)} %</div>
                          </div>

                          <div className={`p-2 rounded border text-[11px] leading-relaxed ${
                            isThicknessOK ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-200'
                          }`}>
                            {isThicknessOK ? (
                              <span>✓ <strong>Dimensionierung ausreichend!</strong> Die Betondecke mit d = {formatDeWert(betonSlabThickness)} cm hält den Dauer-Biegezugspannungen der Lkw-Verkehrslast stand.</span>
                            ) : (
                              <span>✗ <strong>MANGELHAFT (Bruchgefahr):</strong> Die Randspannung übersteigt die angesetzte Biegezugfestigkeit – Rissgefahr. Erhöhen Sie d oder verbessern Sie die Bettung (k-Wert).</span>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Panel 2: LP-Frischbetongehalts-Rechner */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
                  <h4 className="font-extrabold text-sm text-text-main flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                    <Droplets size={15} className="text-shiraz" />
                    2. Frost-Tausalz-LP-Prüfer (ZTV Beton-StB)
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Fahrbahndecken erhalten künstliche Mikroluftporen (LP-Mittel), die den Druck gefrierenden Wassers abbauen. Die Mindest-LP-Gehälter hängen vom Größtkorn ab (Grenzwerte im Rechner: Lehrwerte, maßgebend ZTV Beton-StB).
                  </p>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-main mb-1">Maximales Größtkorn:</label>
                        <select aria-label="Maximales Größtkorn" 
                          value={betonMaxAggregateSize}
                          onChange={(e) => setBetonMaxAggregateSize(parseInt(e.target.value) as any)}
                          className="w-full text-xs p-2 rounded-lg border border-zinc-200 font-sans"
                        >
                          <option value="32">GK 32 mm (Max. Korn 32)</option>
                          <option value="22">GK 22 mm (Max. Korn 22)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-text-main mb-1">Gemessener Luftporenhintergrund:</label>
                        <div className="flex items-center gap-2">
                          <input aria-label="Gemessener Luftporenhintergrund" 
                            type="number" 
                            step="0.1"
                            min="2"
                            max="10"
                            value={betonFreshAir}
                            onChange={(e) => setBetonFreshAir(parseFloat(e.target.value) || 2)}
                            className="w-20 text-xs p-1.5 border rounded"
                          />
                          <span className="text-xs font-mono font-bold">% Vol.</span>
                        </div>
                      </div>
                    </div>

                    {/* LP Analysis output */}
                    {(() => {
                      const reqMin = betonMaxAggregateSize === 32 ? 4.0 : 4.5;
                      const reqMax = betonMaxAggregateSize === 32 ? 6.5 : 7.0;
                      const isLpOK = betonFreshAir >= reqMin && betonFreshAir <= reqMax;
                      
                      let lpMsg = "";
                      let lpColor = "";
                      let strengthLoss = 0;

                      if (betonFreshAir > reqMax) {
                        strengthLoss = (betonFreshAir - reqMin) * 4.5; // assume 4.5% loss per 1% extra air
                        lpMsg = `⚠ Luftporengehalt über ${formatDeWert(reqMax)} %: Die Festigkeit sinkt (Faustregel ca. 4–5 % je 1 % Luft über dem Mindestwert von ${formatDeWert(reqMin)} %; hier rund ${formatDeZahl(strengthLoss, 0)} %).`;
                        lpColor = "bg-amber-50 text-amber-800 border-amber-200";
                      } else if (betonFreshAir < reqMin) {
                        lpMsg = `✗ Luftporengehalt zu niedrig (${formatDeWert(betonFreshAir)} % < ${formatDeWert(reqMin)} %): unzureichender Frost-Tausalz-Widerstand, Abwitterung möglich.`;
                        lpColor = "bg-red-50 text-red-800 border-red-200";
                      } else {
                        lpMsg = `✓ Im Sollbereich (${formatDeWert(reqMin)}–${formatDeWert(reqMax)} %, Lehrwerte).`;
                        lpColor = "bg-emerald-50 text-emerald-800 border-emerald-100";
                      }

                      return (
                        <div className={`p-3 rounded-lg border space-y-1.5 text-xs ${lpColor}`}>
                          <div className="font-bold flex justify-between items-center">
                            <span>Soll-LP-Bereich für GK {betonMaxAggregateSize}:</span>
                            <span className="font-mono">{formatDeWert(reqMin)}% bis {formatDeWert(reqMax)}%</span>
                          </div>
                          <p className="leading-relaxed text-[11px] font-sans">
                            {lpMsg}
                          </p>
                        </div>
                      );
                    })()}

                  </div>
                </div>

              </div>

              {/* Right Column: Fugen & AKR-Screening */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Panel 3: Fugen-Dimensionierung (Joint Config) */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
                  <h4 className="font-extrabold text-sm text-text-main flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                    <Milestone size={15} className="text-shiraz" />
                    3. Fugengeometrie &amp; Bewehrungsbedarf
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Fahrstreifendecken im Straßenbau werden thermisch bedingt segmentiert. Zu lange unbewehrte Platten reißen unkontrolliert.
                  </p>

                  <div className="space-y-4">
                    {/* Fugenabstand L */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-text-main">
                        <span>Längsabstand der Scheinfugen (Plattenlänge L):</span>
                        <span className="font-mono text-xs text-shiraz font-bold">{formatDeZahl(betonFugenAbstand, 1)} m</span>
                      </div>
                      <input 
                        type="range" 
                        min="3.0" 
                        max="7.0" 
                        step="0.1"
                        value={betonFugenAbstand}
                        onChange={(e) => setBetonFugenAbstand(parseFloat(e.target.value))}
                        className="w-full accent-shiraz" 
                      />
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>ZTV Standard: ≤ 5,0 m</span>
                        <span>Kritischer Baufehler: &gt; 5,0 m</span>
                      </div>
                    </div>

                    {/* Fugen und Beiwert Checks */}
                    {(() => {
                      const maxAllowedL = Math.min(25 * (betonSlabThickness / 100), 5.0);
                      const isFugenOK = betonFugenAbstand <= maxAllowedL;
                      
                      // Calculate requirements (Dowels and tie bars) for joint
                      // Transverse Joint (Querfuge): Spacing of dowels ø 25 is 25 cm. For typical 3.75m lanes:
                      const dowelCount = Math.floor(3.75 / 0.25);
                      // Longitudinal Joint (Längsfuge): spacing 1.5m -> Tie bars per slab length
                      const tieBarCount = Math.max(3, Math.floor(betonFugenAbstand / 1.5) + 1);

                      return (
                        <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-lg space-y-3 text-xs">
                          <div className={`p-2.5 rounded border text-[11px] leading-relaxed ${
                            isFugenOK ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-red-200'
                          }`}>
                            {isFugenOK ? (
                              <span>✓ <strong>Fugenabstand konform:</strong> L = {formatDeZahl(betonFugenAbstand, 1)} m ist kleiner als das Maximum von {formatDeZahl(maxAllowedL, 2)} m (Lehrannahme: ≤ 25·h und ≤ 5,0 m).</span>
                            ) : (
                              <span>✗ <strong>Rissgefahr:</strong> L = {formatDeZahl(betonFugenAbstand, 1)} m übersteigt den rechnerischen Grenzwert ({formatDeZahl(maxAllowedL, 2)} m) für unbewehrte Platten – unkontrollierte Querrisse sind zu erwarten.</span>
                            )}
                          </div>

                          <div className="border-t border-zinc-200 pt-2.5 space-y-1.5 font-sans">
                            <span className="font-bold text-zinc-700 block text-xs">Konstruktive Fugenausführung pro Platte (ZTV):</span>
                            <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-650 font-sans">
                              <li>Querscheinfugen: <strong>{dowelCount}x Runddübel (ø 25 mm, l = 500 mm)</strong> auf Dübelkörben. Sie übertragen Querkräfte und verhindern Stufenbildung an den Fugen.</li>
                              <li>Längsscheinfugen: <strong>{tieBarCount}x profilierte Anker (ø 20 mm, l = 800 mm)</strong> zur Verhinderung von Längskampf-Auseinanderdriften der Spurplatten.</li>
                            </ul>
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                </div>

                {/* Panel 4: Alkali-Kieselsäure-Reaktion (AKR) / Betonkrebs */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
                  <h4 className="font-extrabold text-sm text-[#A3113E] flex items-center gap-1.5 border-b border-zinc-100 pb-2 font-sans">
                    <AlertTriangle size={15} />
                    4. Alkali-Kieselsäure-Reaktion (AKR) Screening
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Die zerstörerische AKR ("Betonkrebs") tritt auf, wenn amorphe Kieselsäuren in der Gesteinskörnung mit Alkalien aus dem Zement unter Wassereinfluss (Sprühnebel + Tausalz) ein quellfähiges Alkalisilikatgel bilden. Dies zersprengt den Beton von innen.
                  </p>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-text-main mb-1">Gesteinskörnung (Edelsplitt):</label>
                        <select aria-label="Gesteinskörnung (Edelsplitt)" 
                          value={betonAggregate}
                          onChange={(e) => setBetonAggregate(e.target.value as any)}
                          className="w-full text-xs p-2 rounded border border-zinc-200 bg-white"
                        >
                          <option value="quarz">Quarzhaltiger Kies / Opalsand (hochreaktiv)</option>
                          <option value="kalk">Reiner Kalkstein (E1 - unbedenklich)</option>
                          <option value="basalt">Geprüfter Basalt / Granit (reaktionsarm)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-text-main mb-1">Alkaligehalt des Zements:</label>
                        <select aria-label="Alkaligehalt des Zements" 
                          value={betonCementAlkali}
                          onChange={(e) => setBetonCementAlkali(e.target.value as any)}
                          className="w-full text-xs p-1.5 rounded border border-zinc-200 bg-white"
                        >
                          <option value="high">Standard CEM I (Na2O_eq ≥ 0,60%)</option>
                          <option value="low">NA-Zement (Na2O_eq &lt; 0,60% / Low Alkali)</option>
                        </select>
                      </div>
                    </div>

                    {/* Screening Analysis */}
                    {(() => {
                      let riskTitle = "";
                      let riskColor = "";
                      let riskAdvice = "";

                      if (betonAggregate === 'quarz') {
                        if (betonCementAlkali === 'high') {
                          riskTitle = "AKUTES SCHADENSRISIKO (Betonkrebs-Gefahr EXTREM HOCH!)";
                          riskColor = "bg-red-50 text-red-800 border-red-200";
                          riskAdvice = "Alkaliempfindliche Gesteinskörnung mit üblichem Zement und Tausalzzufuhr (Feuchtigkeitsklasse WS): hohes AKR-Risiko, Schäden können nach einigen Jahren auftreten. Unzulässig ohne Gutachten bzw. Maßnahmen nach Alkali-Richtlinie, TL Beton-StB und den jeweils aktuellen ARS (WS ist nicht Teil der DIN 1045-2).";
                        } else {
                          riskTitle = "Mäßiges Risiko (Beherrscht durch NA-Zement)";
                          riskColor = "bg-amber-50 text-amber-800 border-amber-200";
                          riskAdvice = "Ein Zement mit niedrigem wirksamen Alkaligehalt (NA-Zement, Na2O-Äquivalent ≤ 0,60 %) senkt den Alkalieintrag aus dem Zement. Bei Feuchtigkeitsklasse WS bleibt äußere Alkalizufuhr durch Tausalz – Gesteinskörnung muss geprüft sein.";
                        }
                      } else {
                        riskTitle = "Geringes AKR-Risiko";
                        riskColor = "bg-emerald-50 text-emerald-800 border-emerald-100";
                        riskAdvice = "Gesteinskörnungen der Alkaliempfindlichkeitsklasse E I (z. B. viele Kalksteine) gelten als unbedenklich. Fahrbahndecken gehören stets zur Feuchtigkeitsklasse WS.";
                      }

                      return (
                        <div className={`p-3 rounded-lg border space-y-1.5 font-sans ${riskColor}`}>
                          <div className="font-bold uppercase tracking-wider text-[10px] block">AKR-Evaluierungsstufe:</div>
                          <div className="font-extrabold text-[12px]">{riskTitle}</div>
                          <p className="text-[11px] leading-relaxed">
                            {riskAdvice}
                          </p>
                          <div className="pt-1.5">
                            <button 
                              type="button" 
                              onClick={() => setBetonShowAKRDetails(!betonShowAKRDetails)}
                              className="text-[10px] font-bold underline hover:opacity-80 cursor-pointer"
                            >
                              {betonShowAKRDetails ? 'Zusammenfassung ausblenden' : 'Technische Erläuterungen einblenden...'}
                            </button>
                            {betonShowAKRDetails && (
                              <div className="mt-2 text-[10px] bg-white/60 p-2 rounded border border-current leading-relaxed space-y-1 leading-normal">
                                <div><strong>Chemismus der AKR:</strong></div>
                                <div>1. Gelbildungsverfahren: SiO_2 (Gesteinskörnung) + 2 NaOH (Zement) + H_2O → Na_2SiO_3·H_2O (Alkaligel)</div>
                                <div>2. Volumendehnung: Das Gel zieht im Frost-Tausalz-Zyklus kapillares Wasser an und quillt massiv auf.</div>
                                <div>3. Zerrüttung: Überschreitet der Spaltdruck die Zugfestigkeit des Betons (ca. 3,0 MPa), zerreißt das monolithische Aggregatgefüge netzartig.</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                </div>

              </div>

            </div>
          </div>
        )}
        </div>
        </GruppierteModuleTabs>

      </div>

      {activeTab === 'bahnbau' && (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Temperaturkraft im lückenlos verschweißten Gleis"
          zielGleichung="\sigma_T = E \cdot \alpha_T \cdot \Delta T, \quad N_T = \sigma_T \cdot A"
          normQuelle="Grundgleichung der Zwangsspannung (Lehrbeispiel UIC 60)"
          schritte={[
            { titel: '1. Gegeben', formel: 'E = 210\\,000\\,\\text{N/mm}^2,\\; \\alpha_T = 1{,}2 \\cdot 10^{-5}\\,\\text{K}^{-1},\\; \\Delta T = 35\\,\\text{K},\\; A = 7686\\,\\text{mm}^2', erklaerung: 'Schiene im Sommer 35 K über der Verlegetemperatur.' },
            { titel: '2. Spannung', formel: '\\sigma_T = 210\\,000 \\cdot 1{,}2 \\cdot 10^{-5} \\cdot 35 = 88\\,\\text{N/mm}^2', erklaerung: 'Druckspannung, weil die Dehnung behindert ist.' },
            { titel: '3. Längskraft je Schiene', formel: 'N_T = 88 \\cdot 7686 = 676\\,000\\,\\text{N} \\approx 680\\,\\text{kN}', erklaerung: 'Diese Kraft muss der Querverschiebewiderstand des Schotters sicher aufnehmen.' },
          ]}
          ergebnisHinweis="Rund 680 kN Druck je Schiene – deshalb wird bei einer neutralen Temperatur verschweißt und das Schotterbett sorgfältig verdichtet."
        />
      </div>
      )}

      <ModulTest moduleId="bp_verkehrswegebau" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Straßenbau', url: 'https://de.wikipedia.org/wiki/Stra%C3%9Fenbau' },
          { title: 'Asphalt', url: 'https://de.wikipedia.org/wiki/Asphalt' },
          { title: 'Bitumen', url: 'https://de.wikipedia.org/wiki/Bitumen' },
          { title: 'Betondecke', url: 'https://de.wikipedia.org/wiki/Betondecke' }
        ]}
        literatur={[
          'Mentlein, H.; Lorenzl, H.: Straßenbau, Straßenbautechnik. 8., aktual. Aufl., Köln: Reguvis 2021',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'RStO 12/24 (Richtlinien für die Standardisierung des Oberbaus von Verkehrsflächen, Ausgabe 2012, Fassung 2024)', url: 'https://www.fgsv-verlag.de/' },
          { title: 'ZTV SoB-StB (Schichten ohne Bindemittel)', url: 'https://www.fgsv-verlag.de/' },
          { title: 'DIN EN 14487-1 / DIN 18551 (Spritzbeton)' },
          { title: 'DAfStb-Alkali-Richtlinie' },
          { title: 'ZTV Asphalt-StB (Zusätzliche Technische Vertragsbedingungen für Asphalt)', url: 'https://www.fgsv-verlag.de/' },
          { title: 'TL Asphalt-StB (Technische Lieferbedingungen für Asphaltmischgut)', url: 'https://www.fgsv-verlag.de/' },
          { title: 'ZTV Beton-StB (Zusätzliche Technische Vertragsbedingungen für Betonfahrbahnen)', url: 'https://www.fgsv-verlag.de/' }
        ]}
        formeln={[
          {
            formel: 'B = \\sum_{i=1}^m DTV^{(SV)}_i \\cdot q_i \\cdot f_1 \\cdot f_2 \\cdot f_3 \\cdot f_z \\cdot 365 \\quad [\\text{Äquivalente 10-t-Achsübergänge}]',
            erklaerung: 'Dimensionierungsrelevante Beanspruchung B für die Ermittlung der Belastungsklasse (Bk100 bis Bk0,3) nach RStO 12/24 aus dem Schwerverkehrsaufkommen.',
            quelle: 'RStO 12/24 Gl. 1'
          },
          {
            formel: 'E_{v2} \\ge 120\\,\\text{MN/m}^2, \\quad \\frac{E_{v2}}{E_{v1}} \\le 2{,}2',
            erklaerung: 'Verformungsmodul Ev2 und Verdichtungsverhältnis Ev2/Ev1 beim statischen Plattendruckversuch auf ungebundenen Frostschutz- und Schottertragschichten.',
            quelle: 'ZTV SoB-StB / DIN 18134 (Ev2 ≥ 120 MPa bzw. 100 MPa je Belastungsklasse; Ev2/Ev1 ≤ 2,2, höher zulässig bei Ev1 ≥ 0,6·Ev2,erf)'
          }
        ]}
      />
    </div>
  );
}
