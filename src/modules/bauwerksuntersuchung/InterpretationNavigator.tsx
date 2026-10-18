import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  TrendingDown, 
  Wrench, 
  Scale, 
  Building2, 
  FileCheck, 
  Lightbulb, 
  Layers,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { formatDeZahl } from '@/src/utils/numberFormat';
import { InlineMath, BlockMath } from 'react-katex';

interface DiagnosticScenario {
  id: string;
  titel: string;
  objekt: string;
  defaultValues: {
    chlorid: number; // M.-% bzgl. Zement
    deckung: number; // mm
    karbonatisierung: number; // mm
    fck_is: number; // N/mm²
    fck_plan: number; // N/mm²
    potential: number; // mV CSE
    haftzug: number; // N/mm²
    bruchTyp: 'A' | 'AB' | 'B' | 'Y';
    holzRest: number; // %
  };
  schadensmechanismus: string;
}

const PRESET_SCENARIOS: DiagnosticScenario[] = [
  {
    id: 'tiefgarage_chlorid',
    titel: 'Tiefgarage: Akuter Chlorid-Lochfraß (XD3)',
    objekt: 'Stahlbetondecke / Fahrgasse BJ 1988',
    defaultValues: {
      chlorid: 1.25,
      deckung: 28,
      karbonatisierung: 15,
      fck_is: 32,
      fck_plan: 35,
      potential: -420,
      haftzug: 1.6,
      bruchTyp: 'A',
      holzRest: 100
    },
    schadensmechanismus: 'Eintrag von Deicing-Salzen (Tausalz). Chloridionen haben die Passivschicht durchdrungen. Lochfraßkorrosion aktiv ohne Oberflächenrisse!'
  },
  {
    id: 'balkon_karbonatisierung',
    titel: 'Balkonbrüstung: Vollständige Depassivierung (XC4)',
    objekt: 'Frei bewitterte Fertigteil-Balkone BJ 1976',
    defaultValues: {
      chlorid: 0.15,
      deckung: 18,
      karbonatisierung: 24,
      fck_is: 22,
      fck_plan: 25,
      potential: -280,
      haftzug: 1.2,
      bruchTyp: 'A',
      holzRest: 100
    },
    schadensmechanismus: 'Karbonatisierungsfront hat die Bewehrungsebene um 6 mm überrannt. Rostbildung mit 4-facher Volumenzunahme sprengt Betondeckung ab.'
  },
  {
    id: 'halle_druckfestigkeit',
    titel: 'Industriehalle: Unterschreitung der Betondruckfestigkeit',
    objekt: 'Stützenreihe einer Kranbahn BJ 1965',
    defaultValues: {
      chlorid: 0.20,
      deckung: 35,
      karbonatisierung: 20,
      fck_is: 16.5,
      fck_plan: 30,
      potential: -150,
      haftzug: 1.8,
      bruchTyp: 'A',
      holzRest: 100
    },
    schadensmechanismus: 'Rechnerische In-situ-Festigkeit erreicht nur 55 % des Planwerts. Schwerwiegendes Defizit bei beabsichtigter Erhöhung der Kranlast.'
  },
  {
    id: 'instandsetzung_haftung',
    titel: 'Tiefgaragenboden: Mangelhafte Verbundhaftung',
    objekt: 'Frisch applizierte OS 8 Beschichtung',
    defaultValues: {
      chlorid: 0.30,
      deckung: 30,
      karbonatisierung: 10,
      fck_is: 35,
      fck_plan: 35,
      potential: -180,
      haftzug: 0.75,
      bruchTyp: 'AB',
      holzRest: 100
    },
    schadensmechanismus: 'Abreißversuch liefert Festigkeitswerte weit unter 1,5 N/mm² mit Bruch in der Grenzfläche (Typ A/B). Mangelhafte Untergrundvorbereitung!'
  },
  {
    id: 'holz_hausschwamm',
    titel: 'Altbaudachstuhl: Querschnittsverlust Balkenkopf',
    objekt: 'Auflagerknoten Holzbalkendecke BJ 1898',
    defaultValues: {
      chlorid: 0.05,
      deckung: 0,
      karbonatisierung: 0,
      fck_is: 0,
      fck_plan: 0,
      potential: 0,
      haftzug: 0,
      bruchTyp: 'A',
      holzRest: 55
    },
    schadensmechanismus: 'Bohrwiderstands-Resistographie zeigt Kernfäule durch Echten Hausschwamm. Tragfähiger Restquerschnitt um 45 % reduziert.'
  }
];

export default function InterpretationNavigator() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('tiefgarage_chlorid');

  // Interactive Live Values
  const [chloridVal, setChloridVal] = useState<number>(1.25);
  const [deckungVal, setDeckungVal] = useState<number>(28);
  const [karbVal, setKarbVal] = useState<number>(15);
  const [fckIsVal, setFckIsVal] = useState<number>(32);
  const [fckPlanVal, setFckPlanVal] = useState<number>(35);
  const [potentialVal, setPotentialVal] = useState<number>(-420);
  const [haftzugVal, setHaftzugVal] = useState<number>(1.6);
  const [bruchTyp, setBruchTyp] = useState<'A' | 'AB' | 'B' | 'Y'>('A');
  const [holzRestVal, setHolzRestVal] = useState<number>(100);

  const activeScenario = useMemo(() => {
    return PRESET_SCENARIOS.find(s => s.id === selectedScenarioId) || PRESET_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Load preset values on scenario switch
  const loadScenario = (s: DiagnosticScenario) => {
    setSelectedScenarioId(s.id);
    setChloridVal(s.defaultValues.chlorid);
    setDeckungVal(s.defaultValues.deckung);
    setKarbVal(s.defaultValues.karbonatisierung);
    setFckIsVal(s.defaultValues.fck_is);
    setFckPlanVal(s.defaultValues.fck_plan);
    setPotentialVal(s.defaultValues.potential);
    setHaftzugVal(s.defaultValues.haftzug);
    setBruchTyp(s.defaultValues.bruchTyp);
    setHolzRestVal(s.defaultValues.holzRest);
  };

  // ---------------------------------------------------------
  // Ingenieurtechnische Auswertung & Befundsynthese
  // ---------------------------------------------------------
  const evaluation = useMemo(() => {
    // 1. Passivierungsreserve (Karbonatisierung vs Betondeckung)
    const passivierungsReserve = deckungVal - karbVal;
    const isCarbDepassivated = passivierungsReserve <= 0;

    // 2. Chlorid-Status
    const isChlorideCritical = chloridVal >= 0.50; // M.-% bzgl. Zement
    const isChlorideSevere = chloridVal >= 0.80;

    // 3. Potentialfeld-Korrosionsrisiko
    let potentialStatus: 'passiv' | 'unsicher' | 'aktiv' = 'passiv';
    if (potentialVal <= -350) potentialStatus = 'aktiv';
    else if (potentialVal <= -200) potentialStatus = 'unsicher';

    // 4. In-situ-Festigkeitseinstufung (Eurocode 2 Dauerlastfaktor 0.85)
    const festigkeitsVerhaeltnis = fckPlanVal > 0 ? (fckIsVal / fckPlanVal) : 1;
    const isStrengthDeficient = festigkeitsVerhaeltnis < 0.80;

    // 5. Haftzugstatus
    const isHaftzugOk = haftzugVal >= 1.5 && bruchTyp === 'A';

    // 6. Holzstatus
    const isHolzCrit = holzRestVal < 70;

    // Gesamte Risikostufe
    let overallRisk: 'gering' | 'mittel' | 'hoch' | 'akut' = 'gering';
    if (isChlorideSevere || isCarbDepassivated && potentialStatus === 'aktiv' || isHolzCrit || festigkeitsVerhaeltnis < 0.65) {
      overallRisk = 'akut';
    } else if (isChlorideCritical || isCarbDepassivated || isStrengthDeficient || !isHaftzugOk) {
      overallRisk = 'hoch';
    } else if (potentialStatus === 'unsicher' || passivierungsReserve < 10) {
      overallRisk = 'mittel';
    }

    return {
      passivierungsReserve,
      isCarbDepassivated,
      isChlorideCritical,
      isChlorideSevere,
      potentialStatus,
      festigkeitsVerhaeltnis,
      isStrengthDeficient,
      isHaftzugOk,
      isHolzCrit,
      overallRisk
    };
  }, [chloridVal, deckungVal, karbVal, fckIsVal, fckPlanVal, potentialVal, haftzugVal, bruchTyp, holzRestVal]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Einleitung & Kernbotschaft */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <Scale className="text-shiraz" size={20} />
              Interpretation &amp; Ingenieurtechnische Anwendung der Diagnoseergebnisse
            </h3>
            <p className="text-xs text-text-main/70 mt-1">
              Vom Messwert zur bautechnischen Entscheidung: Statische Traglastauswirkung, Restlebensdauerprognose und Instandsetzungskonzepte nach DIBt TR Instandhaltung
            </p>
          </div>
        </div>

        <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 text-xs text-slate-750 leading-relaxed">
          <p>
            <strong>Wichtig für Gutachter und Tragwerksplaner:</strong> Reine Messzahlen (z.B. „1,2 % Chlorid“ oder „f_ck,is = 22 MPa“) haben für sich allein genommen keinen baurechtlichen Wert. Erst ihre <em>differenzierte Korrelation</em> (z. B. Chloridgehalt im Verhältnis zur Betondeckung, Potentialfeldgradient zur Rissgeometrie, In-situ-Festigkeit zum EC2-Sicherheitsbeiwert <InlineMath math="\gamma_c" />) ermöglicht die rechtssichere Festlegung, ob ein <strong>sofortiger Höchstdruckwasserstrahl-Abtrag (HDW)</strong>, ein <strong>Kathodischer Korrosionsschutz (KKS)</strong>, eine <strong>Traglastminderung</strong> oder lediglich eine <strong>präventive Oberflächenbeschichtung (OS 4 / OS 11)</strong> erforderlich ist.
          </p>
        </div>
      </div>

      {/* 2. Szenarien-Wähler & Live-Parameter-Labor */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Reale Schadensszenarien aus der Ingenieurpraxis laden:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {PRESET_SCENARIOS.map((s) => {
              const isSelected = s.id === selectedScenarioId;
              return (
                <button
                  key={s.id}
                  onClick={() => loadScenario(s)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-shiraz text-white border-shiraz shadow-sm ring-2 ring-shiraz/20'
                      : 'bg-off-white hover:bg-slate-100 border-home-grau/30 text-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold leading-snug line-clamp-2">
                    {s.titel.split(':')[0]}
                  </span>
                  <span className={`text-[10px] mt-1.5 line-clamp-1 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                    {s.objekt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Parameters Interactive Sliders */}
        <div className="p-5 bg-off-white rounded-2xl border border-home-grau/25 space-y-5">
          <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Activity size={15} className="text-shiraz" />
              Messparameter interaktiv anpassen &amp; Systemreaktion testen:
            </span>
            <span className="text-xs text-slate-500 font-mono italic">
              {activeScenario.schadensmechanismus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* 1. Chlorid */}
            <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-home-grau/20">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700">Chlorid an Bewehrung:</span>
                <span className={`font-mono ${chloridVal >= 0.5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatDeZahl(chloridVal, 2)} M.-%
                </span>
              </div>
              <input
                type="range"
                min="0.00"
                max="2.50"
                step="0.05"
                value={chloridVal}
                onChange={(e) => setChloridVal(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block">
                Grenzwert <InlineMath math="C_{krit} = 0{,}50\,\text{M.-\%}" /> (Spannstahl: 0,20 %)
              </span>
            </div>

            {/* 2. Karbonatisierung vs Betondeckung */}
            <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-home-grau/20">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700">Deckung c / Karb. d_k:</span>
                <span className={`font-mono ${evaluation.passivierungsReserve <= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatDeZahl(deckungVal, 0)} mm / {formatDeZahl(karbVal, 0)} mm
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={deckungVal}
                  title="Betondeckung c [mm]"
                  onChange={(e) => setDeckungVal(Number(e.target.value))}
                  className="w-full accent-shiraz"
                />
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={karbVal}
                  title="Karbonatisierung d_k [mm]"
                  onChange={(e) => setKarbVal(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>
              <span className="text-[10px] text-slate-400 block">
                Restreserve <InlineMath math="\Delta c = c - d_k =" /> <strong>{formatDeZahl(evaluation.passivierungsReserve, 0)} mm</strong>
              </span>
            </div>

            {/* 3. Potentialfeld */}
            <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-home-grau/20">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700">Halbzellenpotential U_CSE:</span>
                <span className={`font-mono ${potentialVal <= -350 ? 'text-rose-600' : potentialVal <= -200 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {formatDeZahl(potentialVal, 0)} mV
                </span>
              </div>
              <input
                type="range"
                min="-600"
                max="0"
                step="10"
                value={potentialVal}
                onChange={(e) => setPotentialVal(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block">
                ASTM C876: &lt; -350 mV = Korrosionswahrsch. &gt; 90 %
              </span>
            </div>

            {/* 4. In-situ-Festigkeit */}
            <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-home-grau/20">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700">Druckfestigkeit f_ck,is:</span>
                <span className={`font-mono ${evaluation.isStrengthDeficient ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatDeZahl(fckIsVal, 1)} N/mm² (Soll: {formatDeZahl(fckPlanVal, 0)})
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={fckIsVal}
                onChange={(e) => setFckIsVal(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block">
                Verhältnis: <strong>{formatDeZahl(evaluation.festigkeitsVerhaeltnis * 100, 0)} %</strong> des Planwerts
              </span>
            </div>

            {/* 5. Haftzug & Bruchbild */}
            <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-home-grau/20">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700">Haftzug f_ct &amp; Bruchbild:</span>
                <span className={`font-mono ${haftzugVal < 1.5 || bruchTyp !== 'A' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatDeZahl(haftzugVal, 2)} N/mm² (Typ {bruchTyp})
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0.30"
                  max="3.00"
                  step="0.05"
                  value={haftzugVal}
                  onChange={(e) => setHaftzugVal(Number(e.target.value))}
                  className="w-full accent-shiraz"
                />
                <select
                  value={bruchTyp}
                  onChange={(e) => setBruchTyp(e.target.value as any)}
                  className="text-xs p-1 bg-white border border-slate-300 rounded font-bold"
                >
                  <option value="A">Typ A (Beton)</option>
                  <option value="AB">Typ A/B (Fuge)</option>
                  <option value="B">Typ B (Mörtel)</option>
                  <option value="Y">Typ Y (Kleber)</option>
                </select>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Soll Hochbau: <InlineMath math="f_{ct} \ge 1{,}5\,\text{N/mm}^2" /> (Bruch im Altbeton A)
              </span>
            </div>

            {/* 6. Holz Restquerschnitt */}
            <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-home-grau/20">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700">Holz Restquerschnitt:</span>
                <span className={`font-mono ${holzRestVal < 70 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatDeZahl(holzRestVal, 0)} %
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={holzRestVal}
                onChange={(e) => setHolzRestVal(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block">
                WTA 8-15: Widerstandsmoment sinkt mit <InlineMath math="W \sim h_{eff}^2" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SYNTHESE & ENTSCHEIDUNGSMATRIX: WAS BEDEUTET DAS INGENIEURTECHNISCH? */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
              evaluation.overallRisk === 'akut' ? 'bg-rose-600' :
              evaluation.overallRisk === 'hoch' ? 'bg-amber-600' :
              evaluation.overallRisk === 'mittel' ? 'bg-amber-500' : 'bg-emerald-600'
            }`}>
              {evaluation.overallRisk === 'akut' ? <ShieldAlert size={20} /> :
               evaluation.overallRisk === 'hoch' ? <AlertTriangle size={20} /> :
               <CheckCircle2 size={20} />}
            </div>
            <div>
              <h4 className="text-base font-bold text-text-main">
                Synthese der Bauwerksdiagnostik: Gefährdungsstufe {evaluation.overallRisk.toUpperCase()}
              </h4>
              <p className="text-xs text-text-main/70">
                Ganzheitliche ingenieurtechnische Beurteilung für Statik &amp; Instandsetzungsplanung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase font-mono ${
              evaluation.overallRisk === 'akut' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
              evaluation.overallRisk === 'hoch' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
              evaluation.overallRisk === 'mittel' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
              'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              VDI 6200 Schadensstufe: {
                evaluation.overallRisk === 'akut' ? 'Stufe 4 (Gefahr in Verzug)' :
                evaluation.overallRisk === 'hoch' ? 'Stufe 3 (Erheblich)' :
                evaluation.overallRisk === 'mittel' ? 'Stufe 2 (Beobachtung)' :
                'Stufe 1 (Gering)'
              }
            </span>
          </div>
        </div>

        {/* 3 Säulen der Konsequenz */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SÄULE 1: BAUDIAGNOSTISCHER BEFUND */}
          <div className="p-5 bg-off-white rounded-2xl border border-home-grau/25 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span>
                1. Werkstoff- &amp; Gefügebefund
              </span>
              <h5 className="font-bold text-sm text-slate-800">Physikochemischer Zustand</h5>
              
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <strong>Passivierung &amp; Korrosionsschutz:</strong>
                  <p className="text-[11px] text-slate-650">
                    {evaluation.isCarbDepassivated ? (
                      <span className="text-rose-700 font-semibold">Bewehrung vollständig depassiviert (d_k ≥ c). pH-Wert im Zementstein unter 9,0 abgesunken.</span>
                    ) : evaluation.passivierungsReserve < 10 ? (
                      <span className="text-amber-700">Restreserve knapp (&lt; 10 mm). Depassivierungsfront erreicht in wenigen Jahren den Bewehrungsstahl.</span>
                    ) : (
                      <span className="text-emerald-700">Alkalische Schutzhülle intakt (Restreserve &gt; 10 mm).</span>
                    )}
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <strong>Chloridinduzierte Lochfraßgefahr:</strong>
                  <p className="text-[11px] text-slate-650">
                    {evaluation.isChlorideSevere ? (
                      <span className="text-rose-700 font-semibold">Akute Lochfraßgefahr! Chloridgehalt liegt beim {formatDeZahl(chloridVal / 0.5, 1)}-fachen des kritischen Schwellenwerts. Gefahr spröder Stababbrüche!</span>
                    ) : evaluation.isChlorideCritical ? (
                      <span className="text-amber-700">Kritischer Chloridgehalt überschritten (&gt; 0,50 M.-%). Lochfraßaktivität wahrscheinlich.</span>
                    ) : (
                      <span className="text-emerald-700">Chloridgehalt unterkritisch (&lt; 0,50 M.-%). Kein Lochfraßrisiko.</span>
                    )}
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <strong>Elektrochemische Makroelemente:</strong>
                  <p className="text-[11px] text-slate-650">
                    {evaluation.potentialStatus === 'aktiv' ? (
                      <span className="text-rose-700 font-semibold">Stark negatives Potential ({potentialVal} mV). Aktive galvanische Elementbildung mit benachbarten Kathoden nachgewiesen.</span>
                    ) : (
                      <span className="text-emerald-700">Stabiles Passivpotential. Keine aktiven Korrosionsströme.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-200">
              Grundlage: DIN EN 14630, DIN EN 14629, DGZfP B1
            </div>
          </div>

          {/* SÄULE 2: STATISCHE TRAGWERKSAUSWIRKUNG */}
          <div className="p-5 bg-off-white rounded-2xl border border-home-grau/25 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span>
                2. Statik &amp; Standsicherheit
              </span>
              <h5 className="font-bold text-sm text-slate-800">Auswirkung auf Tragfähigkeit</h5>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <strong>In-situ-Bemessungsdruckfestigkeit:</strong>
                  <div className="text-[11px] text-slate-650">
                    <InlineMath math="f_{cd,is} = \frac{0{,}85 \cdot f_{ck,is}}{\gamma_c} =" /> <strong>{formatDeZahl((0.85 * fckIsVal) / 1.5, 1)} N/mm²</strong>
                    <p className="mt-1">
                      {evaluation.isStrengthDeficient ? (
                        <span className="text-rose-700 font-medium">Rechnerisches Festigkeitsdefizit! Nachweis der Grenzzustände GZT nach DIN EN 1992-1-1 nicht erfüllt.</span>
                      ) : (
                        <span className="text-emerald-700">Tragfähigkeitsreserve ausreichend für geplante Lasten.</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <strong>Bewehrungsquerschnitt A_s:</strong>
                  <p className="text-[11px] text-slate-650">
                    {evaluation.isChlorideSevere ? (
                      <span className="text-rose-700 font-medium">Rechnerischer Querschnittsabzug von mind. 25–40 % der Zugbewehrung bei statischer Nachrechnung zwingend anzusetzen!</span>
                    ) : evaluation.isCarbDepassivated ? (
                      <span className="text-amber-700">Oberflächlicher Querschnittsverlust (Muldenkorrosion) von ca. 5–10 % zu berücksichtigen.</span>
                    ) : (
                      <span className="text-emerald-700">Voller Nennquerschnitt A_s,nom ansetzbar.</span>
                    )}
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <strong>Holz-Widerstandsmoment W_eff:</strong>
                  <p className="text-[11px] text-slate-650">
                    {holzRestVal < 100 ? (
                      <span>Rest-Widerstandsmoment beträgt nur noch <strong>{formatDeZahl(Math.pow(holzRestVal / 100, 2) * 100, 0)} %</strong> des Ursprungswertes!</span>
                    ) : (
                      <span className="text-slate-500">Keine Holzquerschnittsschwächung relevant.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-200">
              Grundlage: DIN EN 1992-1-1 (EC 2), DIN EN 1995-1-1 (EC 5)
            </div>
          </div>

          {/* SÄULE 3: INSTANDSETZUNGSKONZEPT & HANDLUNG */}
          <div className="p-5 bg-off-white rounded-2xl border border-home-grau/25 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span>
                3. Instandsetzung nach TR Instandhaltung
              </span>
              <h5 className="font-bold text-sm text-slate-800">Verbindliche Maßnahmen</h5>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <strong>Empfohlenes Instandsetzungsprinzip:</strong>
                  <p className="text-[11px] font-semibold text-shiraz">
                    {evaluation.isChlorideSevere ? (
                      'Prinzip C (Chloridabtrag via HDW) ODER Prinzip KKS (Kathodischer Korrosionsschutz DIN EN ISO 12696)'
                    ) : evaluation.isCarbDepassivated ? (
                      'Prinzip R (Reprofilierung mit PCC/SPCC) + Prinzip W (Trockenhalten mit OS 4/OS 5a)'
                    ) : evaluation.isStrengthDeficient ? (
                      'Bauliche Verstärkung: CFK-Lamellen, Aufbeton oder Stahllaschen'
                    ) : (
                      'Präventiver Schutz: Oberflächenschutzsystem OS 8 oder OS 11a'
                    )}
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <strong>Konkrete Ausführungsschritte:</strong>
                  <ul className="text-[11px] text-slate-650 space-y-1 list-disc list-inside leading-snug">
                    {evaluation.isChlorideSevere && (
                      <>
                        <li>HDW-Strahlen mit ≥ 2.000 bar mind. 20 mm hinter den korrodierten Bewehrungsstahl.</li>
                        <li>Entrosten der Bewehrung auf Reinheitsgrad Sa 2½ (DIN EN ISO 8501-1).</li>
                        <li>Aufbringen von 2K-Korrosionsschutz und SPCC-Spritzmörtel.</li>
                      </>
                    )}
                    {evaluation.isCarbDepassivated && !evaluation.isChlorideSevere && (
                      <>
                        <li>Mechanisches Freilegen der Roststellen und Bürstenentrosten (St 3).</li>
                        <li>Reprofilierung mit PCC-Mörtel (DIN EN 1504-3 Klasse R3/R4).</li>
                        <li>CO₂-bremsende Beschichtung mit <InlineMath math="s_{d,\text{CO2}} \ge 50\,\text{m}" /> (OS 4).</li>
                      </>
                    )}
                    {!evaluation.isHaftzugOk && (
                      <li className="text-rose-700 font-semibold">
                        Abreißfestigkeit ungenügend! Vor Beschichtung zwingend Kugelstrahlen oder Feinfräsen zur Entfernung der mürben Zementschlämme.
                      </li>
                    )}
                    {evaluation.isHolzCrit && (
                      <>
                        <li>Gesundschnitt mind. 30 cm über die sichtbare Fäulniszone hinaus (WTA 8-15).</li>
                        <li>Einbau von verzinkten Balkenschuhen oder beidseitigen Stahl-U-Profilen.</li>
                      </>
                    )}
                    {!evaluation.isChlorideSevere && !evaluation.isCarbDepassivated && (
                      <li>Präventive Rissoberflächenabdichtung und regelmäßige Begehung nach VDI 6200.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-200">
              Grundlage: DIBt TR Instandhaltung (2020), DIN EN 1504
            </div>
          </div>
        </div>
      </div>

      {/* 4. Gutachterliche Checkliste zur Ergebnisabnahme */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
          <FileCheck className="text-shiraz" size={16} />
          Gutachterliche Prüfliste: Vollständigkeit der Diagnoseunterlagen für die Genehmigungsplanung
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Probenahmeprotokoll &amp; Kalibrierzertifikate:</strong>
              <p className="text-slate-650 text-[11px] mt-0.5 leading-snug">
                Sind alle ZfP-Geräte vor Messbeginn an Prüfamboss (Schmidt-Hammer), Nullpunktplatte (Covermeter) oder Prüfstab (Ultraschall) kalibriert und dokumentiert worden?
              </p>
            </div>
          </div>

          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Konditionierungsnachweis der Proben:</strong>
              <p className="text-slate-650 text-[11px] mt-0.5 leading-snug">
                Wurden Feuchtigkeitszustand (u), Prüftemperatur und Probenlagerung (Luft- vs. Wasserlagerung bei Bohrkernen) normgerecht festgehalten?
              </p>
            </div>
          </div>

          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Statistische Signifikanz (Prüfdimension 3):</strong>
              <p className="text-slate-650 text-[11px] mt-0.5 leading-snug">
                Wurden die Mindeststichprobenumfänge nach DIN EN 13791 (mind. 14 Kerne für Verfahren A) oder DBV (mind. 20–30 Covermeter-Punkte für 5 %-Quantil) vollständig eingehalten?
              </p>
            </div>
          </div>

          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Rechtssichere Schadenskataster-Kartierung:</strong>
              <p className="text-slate-650 text-[11px] mt-0.5 leading-snug">
                Sind Risse, Hohlstellen, Potentialfeld-Gradienten und Bohrmehl-Chloridprofile maßstäblich in CAD-Bestandspläne übertragen und mit dem Tragwerksplaner abgestimmt?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
