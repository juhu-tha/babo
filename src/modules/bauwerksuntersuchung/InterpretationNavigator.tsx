import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Scale, 
  FileCheck
} from 'lucide-react';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/bauwerksuntersuchung/InterpretationNavigator.json';
import { befundSynthese } from '@/src/calc/bauwerksuntersuchung';
import { fcdBeton, FCD_MODUL } from '@/src/data/kennwerte';
import { MdText } from '@/src/components/inhalt/MdText';
import { ErgebnisAnsage, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';
import { reglerName, reglerEinheit } from '@/src/lib/reglerName';

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
    titel: inhalt.werte.tiefgarageAkuterChloridLochfraß,
    objekt: inhalt.werte.stahlbetondeckeFahrgasseBj1988,
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
    schadensmechanismus: inhalt.werte.eintragVonDeicingSalzen
  },
  {
    id: 'balkon_karbonatisierung',
    titel: inhalt.werte.balkonbrüstungVollständigeDepassivierung,
    objekt: inhalt.werte.freiBewitterteFertigteilBalkone,
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
    schadensmechanismus: inhalt.werte.karbonatisierungsfrontHatDieBewehrungseb
  },
  {
    id: 'halle_druckfestigkeit',
    titel: inhalt.werte.industriehalleUnterschreitungDerBetondru,
    objekt: inhalt.werte.stützenreiheEinerKranbahnBj,
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
    schadensmechanismus: inhalt.werte.rechnerischeInSituFestigkeit
  },
  {
    id: 'instandsetzung_haftung',
    titel: inhalt.werte.tiefgaragenbodenMangelhafteVerbundhaftun,
    objekt: inhalt.werte.frischApplizierteOs8,
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
    schadensmechanismus: inhalt.werte.abreißversuchLiefertFestigkeitswerteWeit
  },
  {
    id: 'holz_hausschwamm',
    titel: inhalt.werte.altbaudachstuhlQuerschnittsverlustBalken,
    objekt: inhalt.werte.auflagerknotenHolzbalkendeckeBj1898,
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
    schadensmechanismus: inhalt.werte.bohrwiderstandsmessungZeigtBraunfäuleDur
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
  // Rechenkern (src/calc/bauwerksuntersuchung.ts): Passivierungsreserve, Chlorid ≥ 0,5/0,8 M.-%, Potential < −350 / ≤ −200 mV (ASTM C876, einheitlich mit ZfP),
  // f_ck,is/f_ck ≥ 0,85 (DIN EN 13791), Haftzug ≥ 1,5 N/mm² mit Bruch im Beton, Holz-Restquerschnitt ≥ 70 %;
  // 0 = nicht gemessen (geht nicht als „nicht bestanden“ in die Risikostufe ein)
  const evaluation = useMemo(() => befundSynthese({
    chlorid: chloridVal, deckung: deckungVal, karbonatisierung: karbVal, fckIs: fckIsVal, fckPlan: fckPlanVal,
    potential: potentialVal, haftzug: haftzugVal, bruchTyp, holzRest: holzRestVal,
  }), [chloridVal, deckungVal, karbVal, fckIsVal, fckPlanVal, potentialVal, haftzugVal, bruchTyp, holzRestVal]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Einleitung & Kernbotschaft */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
              <Scale className="text-shiraz" size={20} /><MdText text={inhalt.texte.interpretationIngenieurtechnischeAnwendu} /></h2>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.vomMesswertZurBautechnischen} /></p>
          </div>
        </div>

        <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 text-xs text-slate-750 leading-relaxed">
          <p><MdText text={inhalt.texte.wichtigFürGutachterUnd} /></p>
        </div>
      </div>

      {/* 2. Szenarien-Wähler & Live-Parameter-Labor */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2"><MdText text={inhalt.texte.realeSchadensszenarienAusDer} /></span>
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
              <Activity size={15} className="text-shiraz" /><MdText text={inhalt.texte.messparameterInteraktivAnpassenSystemrea} /></span>
            <span className="text-xs text-slate-500 font-mono italic">
              {activeScenario.schadensmechanismus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* 1. Chlorid */}
            <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-home-grau/20">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700"><MdText text={inhalt.texte.chloridAnBewehrung} /></span>
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
                aria-label={reglerName(inhalt.texte.chloridAnBewehrung)}
                aria-valuetext={`${formatDeZahl(chloridVal, 2)} M.-%`}
                onChange={(e) => setChloridVal(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block"><MdText text={inhalt.texte.grenzwertCKrit0} /></span>
            </div>

            {/* 2. Karbonatisierung vs Betondeckung */}
            <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-home-grau/20">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700"><MdText text={inhalt.texte.deckungCKarbD} /></span>
                <span className={`font-mono ${!evaluation.deckungGemessen ? 'text-slate-500' : evaluation.isCarbDepassivated ? 'text-rose-600' : 'text-emerald-600'}`}>
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
                  aria-label={inhalt.werte.betondeckungCMm}
                  aria-valuetext={`${formatDeZahl(deckungVal, 0)} mm`}
                  title={inhalt.werte.betondeckungCMm}
                  onChange={(e) => setDeckungVal(Number(e.target.value))}
                  className="w-full accent-shiraz"
                />
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={karbVal}
                  aria-label={inhalt.werte.karbonatisierungDKMm}
                  aria-valuetext={`${formatDeZahl(karbVal, 0)} mm`}
                  title={inhalt.werte.karbonatisierungDKMm}
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
                <span className="text-slate-700"><MdText text={inhalt.texte.halbzellenpotentialUCse} /></span>
                <span className={`font-mono ${evaluation.potentialStatus === '–' ? 'text-slate-700' : evaluation.potentialStatus === 'aktiv' ? 'text-rose-600' : evaluation.potentialStatus === 'unsicher' ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {formatDeZahl(potentialVal, 0)} mV
                </span>
              </div>
              <input
                type="range"
                min="-600"
                max="0"
                step="10"
                value={potentialVal}
                aria-label={reglerName(inhalt.texte.halbzellenpotentialUCse)}
                aria-valuetext={`${formatDeZahl(potentialVal, 0)} mV`}
                onChange={(e) => setPotentialVal(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block"><MdText text={inhalt.texte.astmC876350Mv} /></span>
            </div>

            {/* 4. In-situ-Festigkeit */}
            <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-home-grau/20">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700"><MdText text={inhalt.texte.druckfestigkeitFCkIs} /></span>
                <span className={`font-mono ${evaluation.isStrengthDeficient ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatDeZahl(fckIsVal, 1)}<MdText text={inhalt.texte.nMmSoll} />{formatDeZahl(fckPlanVal, 0)})
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={fckIsVal}
                aria-label={reglerName(inhalt.texte.druckfestigkeitFCkIs)}
                aria-valuetext={`${formatDeZahl(fckIsVal, 1)}${reglerEinheit(inhalt.texte.nMmSoll)}${formatDeZahl(fckPlanVal, 0)})`}
                onChange={(e) => setFckIsVal(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block">
                Verhältnis: <strong>{formatDeZahl(evaluation.festigkeitsVerhaeltnis * 100, 0)} %</strong><MdText text={inhalt.texte.desPlanwerts} /></span>
            </div>

            {/* 5. Haftzug & Bruchbild */}
            <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-home-grau/20">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700"><MdText text={inhalt.texte.haftzugFCtBruchbild} /></span>
                <span className={`font-mono ${!evaluation.haftzugGemessen ? 'text-slate-500' : evaluation.isHaftzugFailed ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatDeZahl(haftzugVal, 2)} N/mm² (Typ {bruchTyp})
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0.30"
                  max="3.00"
                  step="0.05"
                  aria-label={inhalt.werte.haftzugfestigkeitFCtNMm}
                  value={haftzugVal}
                  aria-valuetext={`${formatDeZahl(haftzugVal, 2)} N/mm² (Typ ${bruchTyp})`}
                  onChange={(e) => setHaftzugVal(Number(e.target.value))}
                  className="w-full accent-shiraz"
                />
                <select
                  aria-label={inhalt.werte.bruchbildTypNachDinEn}
                  value={bruchTyp}
                  onChange={(e) => setBruchTyp(e.target.value as typeof bruchTyp)}
                  className="text-xs p-1 bg-white border border-slate-300 rounded font-bold"
                >
                  <option value="A">Typ A (Beton)</option>
                  <option value="AB">Typ A/B (Fuge)</option>
                  <option value="B">Typ B (Mörtel)</option>
                  <option value="Y">Typ Y (Kleber)</option>
                </select>
              </div>
              <span className="text-[10px] text-slate-400 block"><MdText text={inhalt.texte.sollHochbauFCt} /></span>
            </div>

            {/* 6. Holz Restquerschnitt */}
            <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-home-grau/20">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700"><MdText text={inhalt.texte.holzRestquerschnitt} /></span>
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
                aria-label={reglerName(inhalt.texte.holzRestquerschnitt)}
                aria-valuetext={`${formatDeZahl(holzRestVal, 0)} %`}
                onChange={(e) => setHolzRestVal(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block"><MdText text={inhalt.texte.biegetragfähigkeitWiderstandsmomentSinkt} /></span>
            </div>
          </div>
        </div>
      </div>

      <ErgebnisAnsage text={kurzzeile(`Gefährdungsstufe ${evaluation.overallRisk}`, evaluation.isCarbDepassivated && 'Karbonatisierung hat die Bewehrung erreicht', evaluation.isChlorideCritical && 'Chloridgehalt kritisch', evaluation.isStrengthDeficient && 'Festigkeit unzureichend', evaluation.isHaftzugFailed && 'Haftzug nicht erreicht')} />
      {/* 3. SYNTHESE & ENTSCHEIDUNGSMATRIX: WAS BEDEUTET DAS INGENIEURTECHNISCH? */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
              evaluation.overallRisk === '–' ? 'bg-slate-500' :
              evaluation.overallRisk === 'akut' ? 'bg-rose-600' :
              evaluation.overallRisk === 'hoch' ? 'bg-amber-600' :
              evaluation.overallRisk === 'mittel' ? 'bg-amber-500' : 'bg-emerald-600'
            }`}>
              {evaluation.overallRisk === '–' ? <span aria-hidden="true">–</span> :
               evaluation.overallRisk === 'akut' ? <ShieldAlert size={20} /> :
               evaluation.overallRisk === 'hoch' ? <AlertTriangle size={20} /> :
               <CheckCircle2 size={20} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-text-main wie-h4"><MdText text={inhalt.texte.syntheseDerBauwerksdiagnostikGefährdungs} />{evaluation.overallRisk.toUpperCase()}
              </h3>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.ganzheitlicheIngenieurtechnischeBeurteil} /></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase font-mono ${
              evaluation.overallRisk === '–' ? 'bg-off-white text-slate-700 border border-home-grau/30' :
              evaluation.overallRisk === 'akut' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
              evaluation.overallRisk === 'hoch' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
              evaluation.overallRisk === 'mittel' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
              'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}><MdText text={inhalt.texte.gutachterlicheDringlichkeitAmpelNicht} />{
                evaluation.overallRisk === '–' ? '–' :
                evaluation.overallRisk === 'akut' ? inhalt.werte.stufe4SofortigerHandlungsbedarf :
                evaluation.overallRisk === 'hoch' ? inhalt.werte.stufe3Erheblich :
                evaluation.overallRisk === 'mittel' ? inhalt.werte.stufe2Beobachtung :
                inhalt.werte.stufe1Gering
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
                <span className="w-2 h-2 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t1WerkstoffGefügebefund} /></span>
              <h4 className="font-bold text-sm text-slate-800 wie-h5"><MdText text={inhalt.texte.physikochemischerZustand} /></h4>
              
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1"><MdText text={inhalt.texte.passivierungKorrosionsschutz} /><p className="text-[11px] text-slate-650">
                    {!evaluation.deckungGemessen ? (
                      <span className="text-slate-500"><MdText text={inhalt.texte.deckungNichtGemessen} /></span>
                    ) : evaluation.isCarbDepassivated ? (
                      <span className="text-rose-700 font-semibold"><MdText text={inhalt.texte.bewehrungVollständigDepassiviertD} /></span>
                    ) : !Number.isFinite(evaluation.passivierungsReserve) ? (
                      <span>–</span>
                    ) : evaluation.passivierungsReserve < 10 ? (
                      <span className="text-amber-700"><MdText text={inhalt.texte.restreserveKnapp10Mm} /></span>
                    ) : (
                      <span className="text-emerald-700"><MdText text={inhalt.texte.alkalischeSchutzhülleIntaktRestreserve} /></span>
                    )}
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1"><MdText text={inhalt.texte.chloridinduzierteLochfraßgefahr} /><p className="text-[11px] text-slate-650">
                    {evaluation.isChlorideSevere ? (
                      <span className="text-rose-700 font-semibold"><MdText text={inhalt.texte.erhöhteKorrosionsgefahrChloridgehaltLieg} />{formatDeZahl(chloridVal / 0.5, 1)}<MdText text={inhalt.texte.fachenDesAnhaltswerts0} /></span>
                    ) : evaluation.isChlorideCritical ? (
                      <span className="text-amber-700"><MdText text={inhalt.texte.anhaltswert05M} /></span>
                    ) : (
                      <span className="text-emerald-700"><MdText text={inhalt.texte.chloridgehaltUnterDemAnhaltswert} /></span>
                    )}
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1"><MdText text={inhalt.texte.elektrochemischeMakroelemente} /><p className="text-[11px] text-slate-650">
                    {evaluation.potentialStatus === 'aktiv' ? (
                      <span className="text-rose-700 font-semibold"><MdText text={inhalt.texte.starkNegativesPotential} />{formatDeWert(potentialVal)}<MdText text={inhalt.texte.mvAktiveGalvanischeElementbildung} /></span>
                    ) : (
                      <span className="text-emerald-700"><MdText text={inhalt.texte.keinHinweisAufAktive} /></span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-200"><MdText text={inhalt.texte.grundlageDinEn14630} /></div>
          </div>

          {/* SÄULE 2: STATISCHE TRAGWERKSAUSWIRKUNG */}
          <div className="p-5 bg-off-white rounded-2xl border border-home-grau/25 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t2StatikStandsicherheit} /></span>
              <h4 className="font-bold text-sm text-slate-800 wie-h5"><MdText text={inhalt.texte.auswirkungAufTragfähigkeit} /></h4>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <strong>In-situ-Bemessungsdruckfestigkeit:</strong>
                  <div className="text-[11px] text-slate-650">
                    <InlineMath math="f_{cd,is} = \frac{0{,}85 \cdot f_{ck,is}}{\gamma_c} =" /> <strong>{formatDeZahl(fcdBeton(fckIsVal, FCD_MODUL.interpretationNavigator), 1)} N/mm²</strong>
                    <p className="mt-1">
                      {evaluation.isStrengthDeficient ? (
                        <span className="text-rose-700 font-medium"><MdText text={inhalt.texte.rechnerischesFestigkeitsdefizitNachweisD} /></span>
                      ) : (
                        <span className="text-emerald-700"><MdText text={inhalt.texte.tragfähigkeitsreserveAusreichendFürGepla} /></span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1"><MdText text={inhalt.texte.bewehrungsquerschnittAS} /><p className="text-[11px] text-slate-650">
                    {evaluation.isChlorideSevere ? (
                      <span className="text-rose-700 font-medium"><MdText text={inhalt.texte.querschnittsverlustDerBewehrungNach} /></span>
                    ) : evaluation.isCarbDepassivated ? (
                      <span className="text-amber-700"><MdText text={inhalt.texte.oberflächlicherQuerschnittsverlustMulden} /></span>
                    ) : (
                      <span className="text-emerald-700"><MdText text={inhalt.texte.vollerNennquerschnittAS} /></span>
                    )}
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1"><MdText text={inhalt.texte.holzWiderstandsmomentWEff} /><p className="text-[11px] text-slate-650">
                    {holzRestVal < 100 ? (
                      <span><MdText text={inhalt.texte.restWiderstandsmomentBeträgtNur} /><strong>{formatDeZahl(evaluation.holzRestWiderstand, 0)} %</strong><MdText text={inhalt.texte.desUrsprungswertes} /></span>
                    ) : (
                      <span className="text-slate-500"><MdText text={inhalt.texte.keineHolzquerschnittsschwächungRelevant} /></span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-200"><MdText text={inhalt.texte.grundlageDinEn1992} /></div>
          </div>

          {/* SÄULE 3: INSTANDSETZUNGSKONZEPT & HANDLUNG */}
          <div className="p-5 bg-off-white rounded-2xl border border-home-grau/25 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t3InstandsetzungNachTr} /></span>
              <h4 className="font-bold text-sm text-slate-800 wie-h5"><MdText text={inhalt.texte.verbindlicheMaßnahmen} /></h4>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1"><MdText text={inhalt.texte.empfohlenesInstandsetzungsprinzip} /><p className="text-[11px] font-semibold text-shiraz">
                    {evaluation.isChlorideSevere ? (
                      inhalt.werte.prinzipRChloridbelastetenBeton
                    ) : evaluation.isCarbDepassivated ? (
                      inhalt.werte.prinzipRReprofilierungMit
                    ) : evaluation.isStrengthDeficient ? (
                      inhalt.werte.baulicheVerstärkungCfkLamellen
                    ) : (
                      inhalt.werte.präventiverSchutzOberflächenschutzsystem
                    )}
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-home-grau/20 space-y-1"><MdText text={inhalt.texte.konkreteAusführungsschritte} /><ul className="text-[11px] text-slate-650 space-y-1 list-disc list-inside leading-snug">
                    {evaluation.isChlorideSevere && (
                      <>
                        <li><MdText text={inhalt.texte.hdwStrahlenMit2} /></li>
                        <li><MdText text={inhalt.texte.entrostenDerBewehrungAuf} /></li>
                        <li><MdText text={inhalt.texte.aufbringenVon2kKorrosionsschutz} /></li>
                      </>
                    )}
                    {evaluation.isCarbDepassivated && !evaluation.isChlorideSevere && (
                      <>
                        <li><MdText text={inhalt.texte.mechanischesFreilegenDerRoststellen} /></li>
                        <li><MdText text={inhalt.texte.reprofilierungMitPccMörtel} /></li>
                        <li><MdText text={inhalt.texte.coBremsendeBeschichtungMit} /></li>
                      </>
                    )}
                    {evaluation.isHaftzugFailed && (
                      <li className="text-rose-700 font-semibold"><MdText text={inhalt.texte.abreißfestigkeitUngenügendVorBeschichtun} /></li>
                    )}
                    {evaluation.isHolzCrit && (
                      <>
                        <li><MdText text={inhalt.texte.beiEchtemHausschwammRückschnitt} /></li>
                        <li><MdText text={inhalt.texte.einbauVonVerzinktenBalkenschuhen} /></li>
                      </>
                    )}
                    {!evaluation.isChlorideSevere && !evaluation.isCarbDepassivated && (
                      <li><MdText text={inhalt.texte.präventiveRissoberflächenabdichtungUndRe} /></li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-200"><MdText text={inhalt.texte.grundlageDibtTrInstandhaltung} /></div>
          </div>
        </div>
      </div>

      {/* 4. Gutachterliche Checkliste zur Ergebnisabnahme */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <h3 className="font-bold text-sm text-text-main flex items-center gap-2 wie-h4">
          <FileCheck className="text-shiraz" size={16} /><MdText text={inhalt.texte.gutachterlichePrüflisteVollständigkeitDe} /></h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800"><MdText text={inhalt.texte.probenahmeprotokollKalibrierzertifikate} /></strong>
              <p className="text-slate-650 text-[11px] mt-0.5 leading-snug"><MdText text={inhalt.texte.sindAlleZfpGeräte} /></p>
            </div>
          </div>

          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800"><MdText text={inhalt.texte.konditionierungsnachweisDerProben} /></strong>
              <p className="text-slate-650 text-[11px] mt-0.5 leading-snug"><MdText text={inhalt.texte.wurdenFeuchtigkeitszustandUPrüftemperatu} /></p>
            </div>
          </div>

          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800"><MdText text={inhalt.texte.statistischeSignifikanzPrüfdimension3} /></strong>
              <p className="text-slate-650 text-[11px] mt-0.5 leading-snug"><MdText text={inhalt.texte.wurdenDieMindeststichprobenumfängeNach} /></p>
            </div>
          </div>

          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800"><MdText text={inhalt.texte.beweissicherndeSchadenskatasterKartierun} /></strong>
              <p className="text-slate-650 text-[11px] mt-0.5 leading-snug"><MdText text={inhalt.texte.sindRisseHohlstellenPotentialfeld} /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
