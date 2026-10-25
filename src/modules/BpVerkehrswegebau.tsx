import { formatDeZahl } from '@/src/utils/numberFormat';
import { useState, useMemo, useEffect } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import {
  Layers,
  BookOpen,
  Calculator,
  Route,
  FileText,
  Milestone,
  Train,
  HardHat,
  Droplets
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { RSTO_ASPHALT_DATA, RSTO_CONCRETE_DATA } from './bpverkehrswegebau/daten';
import RstoRechnerTab from './bpverkehrswegebau/RstoRechnerTab';
import VergleichTab from './bpverkehrswegebau/VergleichTab';
import BindemittelTab from './bpverkehrswegebau/BindemittelTab';
import PrueftechnikTab from './bpverkehrswegebau/PrueftechnikTab';
import TiefbauTab from './bpverkehrswegebau/TiefbauTab';
import BahnbauTab from './bpverkehrswegebau/BahnbauTab';
import TunnelbauTab from './bpverkehrswegebau/TunnelbauTab';
import BetondeckenTab from './bpverkehrswegebau/BetondeckenTab';

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
        {activeTab === 'rsto_rechner' && <RstoRechnerTab activeProfile={activeProfile} bauweise={bauweise} belastungsKlasse={belastungsKlasse} setBauweise={setBauweise} setBelastungsKlasse={setBelastungsKlasse} />}

        {/* TAB 2: Asphaltsorten & Tragschichten */}
        {activeTab === 'vergleich' && <VergleichTab />}

        {/* TAB 3: Bitumen & PSV-Gesteine */}
        {activeTab === 'bindemittel' && <BindemittelTab />}

        {/* TAB 4: Labor-Prüfmethoden & Interaktiver Hohlraumrechner */}
        {activeTab === 'prueftechnik' && <PrueftechnikTab asphaltMischung={asphaltMischung} luftPorenErrechnet={luftPorenErrechnet} setAsphaltMischung={setAsphaltMischung} />}

        {/* TAB: Tiefbau & Entwässerung */}
        {activeTab === 'tiefbau' && <TiefbauTab setTiefbauArea={setTiefbauArea} setTiefbauDuration={setTiefbauDuration} setTiefbauFss={setTiefbauFss} setTiefbauPsi={setTiefbauPsi} setTiefbauRain={setTiefbauRain} tiefbauArea={tiefbauArea} tiefbauDuration={tiefbauDuration} tiefbauFss={tiefbauFss} tiefbauPsi={tiefbauPsi} tiefbauRain={tiefbauRain} />}

        {/* TAB 5: Bahnbau (Gleisthermik & Oberbau) */}
        {activeTab === 'bahnbau' && <BahnbauTab bettungstyp={bettungstyp} neutralTemp={neutralTemp} schieneTemp={schieneTemp} setBettungstyp={setBettungstyp} setNeutralTemp={setNeutralTemp} setSchieneTemp={setSchieneTemp} />}

        {/* TAB 6: Tunnelbau (Vortrieb & Statik) */}
        {activeTab === 'tunnelbau' && <TunnelbauTab betonKlasse={betonKlasse} gebirgsdruck={gebirgsdruck} setBetonKlasse={setBetonKlasse} setGebirgsdruck={setGebirgsdruck} setSpritzbetonDicke={setSpritzbetonDicke} setTunnelRadius={setTunnelRadius} spritzbetonDicke={spritzbetonDicke} tunnelRadius={tunnelRadius} />}

        {/* TAB: Betondecken im Straßenbau (ZTV Beton-StB) */}
        {activeTab === 'betondecken' && <BetondeckenTab betonAchslast={betonAchslast} betonAggregate={betonAggregate} betonBettung={betonBettung} betonCementAlkali={betonCementAlkali} betonFreshAir={betonFreshAir} betonFugenAbstand={betonFugenAbstand} betonMaxAggregateSize={betonMaxAggregateSize} betonShowAKRDetails={betonShowAKRDetails} betonSlabThickness={betonSlabThickness} setBetonAchslast={setBetonAchslast} setBetonAggregate={setBetonAggregate} setBetonBettung={setBetonBettung} setBetonCementAlkali={setBetonCementAlkali} setBetonFreshAir={setBetonFreshAir} setBetonFugenAbstand={setBetonFugenAbstand} setBetonMaxAggregateSize={setBetonMaxAggregateSize} setBetonShowAKRDetails={setBetonShowAKRDetails} setBetonSlabThickness={setBetonSlabThickness} />}
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
