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
import inhalt from '@/content/bpverkehrswegebau/BpVerkehrswegebau.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { asphaltHohlraum } from '@/src/calc/verkehrswegebau';

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

  // Tiefbau-Zustände (Versickerungsrechner, vereinfacht in Anlehnung an DWA-A 138-1)
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
    // Rechenkern src/calc/verkehrswegebau.ts: Rohdichte ohne Hohlräume ρ_m = 100/(Σ Mᵢ/ρᵢ), Hohlraumgehalt V = (1 − ρ_A/ρ_m)·100
    const e = asphaltHohlraum(asphaltMischung);
    return {
      maxDichte: formatDeZahl(e.maxDichte, 3),
      luftporen: formatDeZahl(e.hohlraum, 2),
      // Zahl für Anzeige, Bewertung und Ansage (vorher Number("4,50") = NaN → Anzeige „–“; Kurzzeilen 04.11.2026)
      hohlraum: e.hohlraum,
      isOk: e.ok
    };
  }, [asphaltMischung]);

  // Reiter (AP 3.8): 6 Hauptbereiche; Asphalt (Sorten, Bitumen/Gesteine, Prüfmethoden) als zweite Ebene.
  // Zustand bleibt die bisherige Reiter-ID, damit die Routen bp_verkehr_* (initialTab) weiter passen.
  const gruppen: readonly ModulTabGruppe<VerkehrReiter>[] = [
    { id: 'rsto_g', label: inhalt.werte.oberbauRechnerRsto12, icon: Calculator, mitglieder: [{ id: 'rsto_rechner', label: inhalt.werte.oberbauRechnerRsto122 }] },
    { id: 'asphalt_g', label: inhalt.werte.asphaltBitumenPrüfung, icon: Layers, mitglieder: [
      { id: 'vergleich', label: inhalt.werte.asphaltsortenTragschichten, icon: Layers },
      { id: 'bindemittel', label: inhalt.werte.bitumenPsvGesteine, icon: FileText },
      { id: 'prueftechnik', label: 'Labor-Prüfmethoden', icon: BookOpen },
    ] },
    { id: 'betondecken_g', label: 'Betondecken', icon: Layers, mitglieder: [{ id: 'betondecken', label: 'Betondecken' }] },
    { id: 'tiefbau_g', label: inhalt.werte.tiefbauEntwässerung, icon: Droplets, mitglieder: [{ id: 'tiefbau', label: inhalt.werte.tiefbauEntwässerung2 }] },
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
              <Milestone className="text-shiraz" /><MdText text={inhalt.texte.verkehrUndTiefbau} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.akademischeAufbereitungZuStraßenbau} /></p>
        </div>
          <button 
            onClick={handleLinkToAsphaltBase}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-shiraz bg-shiraz/5 border border-shiraz/35 rounded-lg hover:bg-shiraz/10 transition-all self-start md:self-auto"
          >
            <Route size={14} /><MdText text={inhalt.texte.zumAsphaltWerkstoffmodul} /></button>
        </div>

        {/* Reiter: 6 Hauptbereiche, Asphalt mit zweiter Ebene (AP 3.8) */}
        <GruppierteModuleTabs
          label={inhalt.werte.verkehrUndTiefbauBereiche}
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
          title={inhalt.werte.anwendungsbeispielTemperaturkraftImLücke}
          zielGleichung="\sigma_T = E \cdot \alpha_T \cdot \Delta T, \quad N_T = \sigma_T \cdot A"
          normQuelle={inhalt.werte.grundgleichungDerZwangsspannungLehrbeisp}
          schritte={inhalt.daten["BpVerkehrswegebau.schritte"]}
          ergebnisHinweis={inhalt.werte.rund680KnDruck}
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
        literatur={inhalt.daten["BpVerkehrswegebau.literatur"]}
        regelwerke={inhalt.daten["BpVerkehrswegebau.regelwerke"]}
        formeln={inhalt.daten["BpVerkehrswegebau.formeln"]}
      />
    </div>
  );
}
