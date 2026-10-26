import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import {
  Sparkles,
  Rocket,
  Compass,
  FileCheck,
  FlaskConical,
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  BarChart3,
  Scale
} from 'lucide-react';
import inhalt from '@/content/bpinnovationen/BpInnovationen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

interface InnovationPreset {
  id: string;
  name: string;
  category: string;
  trlCurrent: number;
  description: string;
  advantages: string[];
  bottlenecks: string[];
  regulationPath: string;
  foerderung: string;
}

const PRESETS: InnovationPreset[] = inhalt.daten.PRESETS;

export default function BpInnovationen() {
  const [activeTab, setActiveTab] = useState<'ueberblick' | 'trl' | 'forschung' | 'werkstoffe' | 'zulassung' | 'rechner'>('ueberblick');
  const [selectedTrlLevel, setSelectedTrlLevel] = useState<number>(4);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('carbonbeton');

  // Interactive Rechner State
  const [userConceptValid, setUserConceptValid] = useState<boolean>(true);
  const [userLabVerified, setUserLabVerified] = useState<boolean>(true);
  const [userScaleUp, setUserScaleUp] = useState<boolean>(false);
  const [userPilotField, setUserPilotField] = useState<boolean>(false);
  const [userZulassung, setUserZulassung] = useState<boolean>(false);
  const [userSerialProduction, setUserSerialProduction] = useState<boolean>(false);

  const calculateUserTrl = (): number => {
    if (userSerialProduction && userZulassung) return 9;
    if (userZulassung) return 8;
    if (userPilotField) return 7;
    if (userScaleUp) return 6;
    if (userLabVerified) return 4;
    if (userConceptValid) return 2;
    return 1;
  };

  const currentTrl = calculateUserTrl();

  const selectedPreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* 1. HEADER CONTAINER gemäß Styleguide */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Sparkles className="text-shiraz" size={24} />
              <span><MdText text={inhalt.texte.bauproduktInnovationenFE} /></span>
            </h2>
            <p className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.forschungEntwicklungFE} /></p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1.5 bg-shiraz/10 text-shiraz rounded-xl text-xs font-bold border border-shiraz/20 flex items-center gap-1.5">
              <Rocket size={14} /> F&amp;E Roadmap
            </span>
          </div>
        </div>

        {/* Teaser Box */}
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.dieTransformationDerBauwirtschaft} /></p>
        </div>

        {/* Tab Navigation */}
        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'ueberblick' as const, label: inhalt.texte.aInnovationTransformation, icon: Compass },
            { id: 'trl' as const, label: inhalt.texte.bTrlSkala1, icon: BarChart3 },
            { id: 'forschung' as const, label: inhalt.texte.cFELandschaft, icon: FlaskConical },
            { id: 'werkstoffe' as const, label: inhalt.texte.dZukunftswerkstoffeImPortrait, icon: Layers },
            { id: 'zulassung' as const, label: inhalt.texte.eZulassungswegeDibtEta, icon: FileCheck },
            { id: 'rechner' as const, label: inhalt.texte.fInteraktiverTrlRechner, icon: Target },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:my-6"
        >

        {/* ---------------- TAB 1: UEBERBLICK ---------------- */}
        {activeTab === 'ueberblick' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-text-main text-base"><MdText text={inhalt.texte.derDekarbonisierungsdruck} /></h3>
                <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.dieZementUndBetonindustrie} /></p>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-text-main text-base"><MdText text={inhalt.texte.dasTalDesTodes} /></h3>
                <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.vieleVielversprechendeBaustoffeScheitern} /></p>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-text-main text-base"><MdText text={inhalt.texte.dieZirkularitätsWende} /></h3>
                <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.mitDemInkrafttretenDer} /></p>
              </div>
            </div>

            {/* Strukturierte Tabelle: Barrieren vs. Enabler */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Scale className="text-shiraz" size={18} />
                <span><MdText text={inhalt.texte.spannungsfeldImBauproduktMarkt} /></span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <th className="p-3">Kategorie</th>
                      <th className="p-3 text-red-700"><MdText text={inhalt.texte.hemmnisseBarrieren} /></th>
                      <th className="p-3 text-green-700"><MdText text={inhalt.texte.treiberInnovationsEnabler} /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.baurechtNormung} /></td>
                      <td className="p-3 text-slate-600"><MdText text={inhalt.texte.konservativeDinEnNormen} /></td>
                      <td className="p-3 text-slate-600"><MdText text={inhalt.texte.reallaborGesetzeExperimentierklauselnIn} /></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.haftungVersicherung} /></td>
                      <td className="p-3 text-slate-600"><MdText text={inhalt.texte.mängelansprücheBeiBauwerkenVerjähren} /></td>
                      <td className="p-3 text-slate-600"><MdText text={inhalt.texte.vorhabenbezogeneBauartgenehmigungenVbgHe} /></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800">Wirtschaftlichkeit</td>
                      <td className="p-3 text-slate-600"><MdText text={inhalt.texte.hoheErstinvestitionenFürSkalierung} /></td>
                      <td className="p-3 text-slate-600"><MdText text={inhalt.texte.steigendeCoPreiseIm} /></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.lieferketteHandwerk} /></td>
                      <td className="p-3 text-slate-600"><MdText text={inhalt.texte.mangelndeErfahrungAufDer} /></td>
                      <td className="p-3 text-slate-600"><MdText text={inhalt.texte.plugAndPlayFertigteile} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: TRL-SKALA ---------------- */}
        {activeTab === 'trl' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <BarChart3 className="text-shiraz" size={18} />
                <span><MdText text={inhalt.texte.die9TechnologyReadiness} /></span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.dieTrlSkalaUrsprünglich} /></p>
            </div>

            {/* Interaktiver TRL-Wähler */}
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
                const isSelected = selectedTrlLevel === lvl;
                const phaseColor = lvl <= 3 ? 'border-amber-400' : lvl <= 6 ? 'border-blue-400' : 'border-green-500';
                return (
                  <button
                    key={lvl}
                    onClick={() => setSelectedTrlLevel(lvl)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-shiraz text-white border-shiraz shadow-md scale-105 ring-2 ring-shiraz/20'
                        : `bg-white hover:bg-slate-50 text-text-main border-slate-200 ${phaseColor}`
                    }`}
                  >
                    <span className="text-xs uppercase font-mono tracking-wider opacity-70">Level</span>
                    <span className="text-lg font-black">{formatDeWert(lvl)}</span>
                  </button>
                );
              })}
            </div>

            {/* Detaillierte Box für den ausgewählten TRL */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-shiraz text-white rounded-lg font-black text-sm">
                    TRL {formatDeWert(selectedTrlLevel)}
                  </span>
                  <h4 className="font-bold text-base text-slate-800">
                    {selectedTrlLevel === 1 && inhalt.werte.grundlegendePrinzipienBeobachtetUnd}
                    {selectedTrlLevel === 2 && inhalt.werte.technologiekonzeptUndOderAnwendung}
                    {selectedTrlLevel === 3 && inhalt.werte.experimentellerNachweisDesKonzepts}
                    {selectedTrlLevel === 4 && inhalt.werte.technologieImLaboratoriumValidiert}
                    {selectedTrlLevel === 5 && inhalt.werte.technologieInRelevanterUmgebung}
                    {selectedTrlLevel === 6 && inhalt.werte.technologieInRelevanterUmgebung2}
                    {selectedTrlLevel === 7 && inhalt.werte.demonstrationDesSystemsIm}
                    {selectedTrlLevel === 8 && inhalt.werte.systemKomplettGeprüftUnd}
                    {selectedTrlLevel === 9 && inhalt.werte.tatsächlichesSystemImPraxiseinsatz}
                  </h4>
                </div>
                <span className={`text-xxs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  selectedTrlLevel <= 3 
                    ? 'bg-amber-100 text-amber-900' 
                    : selectedTrlLevel <= 6 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-green-100 text-green-900'
                }`}>
                  {selectedTrlLevel <= 3 ? inhalt.werte.phaseIGrundlagenforschung : selectedTrlLevel <= 6 ? inhalt.werte.phaseIiAngewandteF : inhalt.werte.phaseIiiMarktreifeNormung}
                </span>
              </div>

              {/* Bauspezifische Übersetzung */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 bg-off-white p-4 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block uppercase tracking-wide text-xxs"><MdText text={inhalt.texte.wasBedeutetDasKonkret} /></span>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedTrlLevel === 1 && inhalt.werte.literaturrecherchenTheoretischeThermodyn}
                    {selectedTrlLevel === 2 && inhalt.werte.formulierungKonkreterBaustoffRezepturen}
                    {selectedTrlLevel === 3 && inhalt.werte.herstellungErsterKleinerMörtelprismen}
                    {selectedTrlLevel === 4 && inhalt.werte.systematischePrüfreihenNachNorm}
                    {selectedTrlLevel === 5 && inhalt.werte.hochskalierungVomLaborrührwerkAuf}
                    {selectedTrlLevel === 6 && inhalt.werte.herstellungRealerBauteileIm}
                    {selectedTrlLevel === 7 && inhalt.werte.einbauDesBaustoffsIn}
                    {selectedTrlLevel === 8 && inhalt.werte.erteilungDerAllgemeinenBauaufsichtlichen}
                    {selectedTrlLevel === 9 && inhalt.werte.dasBauproduktIstRegulär}
                  </p>
                </div>

                <div className="space-y-2 bg-off-white p-4 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block uppercase tracking-wide text-xxs"><MdText text={inhalt.texte.typischeFörderprogrammeAkteure} /></span>
                  <div className="text-slate-600 leading-relaxed space-y-1">
                    {selectedTrlLevel <= 3 && (
                      <>
                        <p><MdText text={inhalt.texte.fördererDfgDeutscheForschungsgemeinschaf} /></p>
                        <p><MdText text={inhalt.texte.akteureUniversitätenMaxPlanck} /></p>
                        <p><MdText text={inhalt.texte.kostenrahmen50000300} /></p>
                      </>
                    )}
                    {selectedTrlLevel >= 4 && selectedTrlLevel <= 6 && (
                      <>
                        <p><MdText text={inhalt.texte.fördererZukunftBauBbsr} /></p>
                        <p><MdText text={inhalt.texte.akteureFraunhoferInstituteIbp} /></p>
                        <p><MdText text={inhalt.texte.kostenrahmen3000002} /></p>
                      </>
                    )}
                    {selectedTrlLevel >= 7 && (
                      <>
                        <p><MdText text={inhalt.texte.fördererEuInnovationFund} /></p>
                        <p><MdText text={inhalt.texte.akteureDibtMpaMaterialprüfanstalten} /></p>
                        <p><MdText text={inhalt.texte.kostenrahmen1000000} /></p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: FORSCHUNG & ENTWICKLUNG ---------------- */}
        {activeTab === 'forschung' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box 1: Die F&E-Phasen im Bauwesen */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <FlaskConical className="text-shiraz" size={18} />
                  <span><MdText text={inhalt.texte.phasenmodellEinesBaustoffF} /></span>
                </h4>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.phase1SyntheseRezepturoptimierung} /></strong><MdText text={inhalt.texte.reaktionskinetikPartikelgrößenverteilung} /></div>
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.phase2DauerhaftigkeitsAlterungsprüfungen} /></strong><MdText text={inhalt.texte.klimakammernFrostTauWechsel} /></div>
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.phase3BrandschutzToxikologieprüfung} /></strong><MdText text={inhalt.texte.brandprüfungImGroßofenDin} /></div>
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.phase4ÖkobilanzierungLca} /></strong><MdText text={inhalt.texte.berechnungVonGwpGlobal} /></div>
                </div>
              </div>

              {/* Box 2: Fördermittellandschaft */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Award className="text-shiraz" size={18} />
                  <span><MdText text={inhalt.texte.zentraleFördermittelgeberFürBau} /></span>
                </h4>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-slate-800"><MdText text={inhalt.texte.zukunftBauBbsrBmwsb} /></strong>
                      <span className="text-xxs px-2 py-0.5 bg-shiraz/10 text-shiraz rounded-full font-bold">Bundesforschung</span>
                    </div><MdText text={inhalt.texte.förderungVonAngewandterForschung} /></div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-slate-800"><MdText text={inhalt.texte.zimZentralesInnovationsprogrammMittelsta} /></strong>
                      <span className="text-xxs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold">BMWE</span>
                    </div><MdText text={inhalt.texte.förderungMarktnaherFueKooperationsprojek} /></div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-slate-800"><MdText text={inhalt.texte.horizonEuropeBuilt4peoplePartnership} /></strong>
                      <span className="text-xxs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">EU-Leitinitiative</span>
                    </div><MdText text={inhalt.texte.multinationaleKonsortienZurDekarbonisier} /></div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-slate-800"><MdText text={inhalt.texte.deutscheBundesstiftungUmweltDbu} /></strong>
                      <span className="text-xxs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-bold"><MdText text={inhalt.texte.umweltNatur} /></span>
                    </div><MdText text={inhalt.texte.modellprojekteZumSchutzVon} /></div>
                </div>
              </div>

            </div>

            {/* Patentierung vs. Normung */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb size={16} className="text-shiraz" />
                <span><MdText text={inhalt.texte.strategischesDilemmaPatentrechtVs} /></span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal"><MdText text={inhalt.texte.währendInDerElektronik} /></p>
            </div>
          </div>
        )}

        {/* ---------------- TAB 4: ZUKUNFTSWERKSTOFFE ---------------- */}
        {activeTab === 'werkstoffe' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Preset Selector */}
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button aria-pressed={selectedPresetId === preset.id}
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    selectedPresetId === preset.id
                      ? 'bg-shiraz text-white border-shiraz shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles size={14} />
                  <span>{preset.name}</span>
                  <span className={`ml-1 px-1.5 py-0.2 rounded-full text-xxs font-mono ${
                    selectedPresetId === preset.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    TRL {formatDeWert(preset.trlCurrent)}
                  </span>
                </button>
              ))}
            </div>

            {/* Detailkarte des ausgewählten Werkstoffs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-slate-900">{selectedPreset.name}</h3>
                    <span className="px-2.5 py-0.5 bg-shiraz/10 text-shiraz rounded-full text-xs font-bold">
                      TRL {formatDeWert(selectedPreset.trlCurrent)} / 9
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{selectedPreset.category}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-off-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <Award size={14} className="text-shiraz" />
                  <span>Förderung: {selectedPreset.foerderung}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-normal bg-off-white p-4 rounded-xl border border-slate-200">
                {selectedPreset.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vorteile */}
                <div className="p-4 bg-green-50/70 border border-green-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-xs text-green-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <CheckCircle2 size={16} className="text-green-600" /><MdText text={inhalt.texte.bautechnischeVorteileImpact} /></h4>
                  <ul className="text-xs text-green-800 space-y-1.5 font-normal">
                    {selectedPreset.advantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-green-600 font-bold">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hemmnisse / Bottlenecks */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertTriangle size={16} className="text-amber-600" /><MdText text={inhalt.texte.kritischeFlaschenhälseFE} /></h4>
                  <ul className="text-xs text-amber-800 space-y-1.5 font-normal">
                    {selectedPreset.bottlenecks.map((bot, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{bot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Zulassungspfad */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileCheck size={16} className="text-shiraz" /><MdText text={inhalt.texte.aktuellerBauaufsichtlicherZulassungsstat} /></span>
                <p className="text-slate-600 leading-relaxed font-normal">
                  {selectedPreset.regulationPath}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 5: ZULASSUNG (DIBt / ETA) ---------------- */}
        {activeTab === 'zulassung' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <Building2 className="text-shiraz" size={18} />
                <span><MdText text={inhalt.texte.vomLaborversuchZurBaustelle} /></span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.imDeutschenBauordnungsrechtMusterbauordn} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box: Nationale Nachweise (DIBt) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">DE</span>
                  <h4 className="font-bold text-sm text-slate-800"><MdText text={inhalt.texte.nationaleNachweiseÜberDas} /></h4>
                </div>
                
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.abzAllgemeineBauaufsichtlicheZulassung} /></strong><MdText text={inhalt.texte.beziehtSichAufDas} /></div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.abgAllgemeineBauartgenehmigung} /></strong><MdText text={inhalt.texte.beziehtSichAufDas2} /></div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.zieVbgZustimmungIm} /></strong><MdText text={inhalt.texte.fürEinKonkretesBauvorhaben} /></div>
                </div>
              </div>

              {/* Box: Europäische Nachweise (EOTA / CPR) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg font-bold text-xs">EU</span>
                  <h4 className="font-bold text-sm text-slate-800"><MdText text={inhalt.texte.europäischeSchieneEotaCpr} /></h4>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.eadEuropeanAssessmentDocument} /></strong><MdText text={inhalt.texte.dieHarmonisierteEuropäischeBewertungsric} /></div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.etaEuropeanTechnicalAssessment} /></strong><MdText text={inhalt.texte.europäischeTechnischeBewertungAuf} /></div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.avcpSysteme11} /></strong><MdText text={inhalt.texte.festlegungObEineNotifizierte} /></div>
                </div>
              </div>

            </div>

            {/* Typischer Zeit- und Kostenplan */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={16} className="text-shiraz" />
                <span><MdText text={inhalt.texte.typischerZulassungsFahrplanFür} /></span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                  <span className="font-bold text-shiraz block">Monat 1–6</span><MdText text={inhalt.texte.antragstellungBeimDibtFestlegung} /></div>
                <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                  <span className="font-bold text-shiraz block">Monat 7–24</span><MdText text={inhalt.texte.durchführungAllerStatischenDynamischen} /></div>
                <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                  <span className="font-bold text-shiraz block">Monat 25–30</span><MdText text={inhalt.texte.begutachtungDerPrüfberichteIm} /></div>
                <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                  <span className="font-bold text-green-700 block">Monat 31+</span><MdText text={inhalt.texte.erteilungDerAbzAbg} /></div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 6: INTERAKTIVER TRL-RECHNER ---------------- */}
        {activeTab === 'rechner' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <Target className="text-shiraz" size={18} />
                <span><MdText text={inhalt.texte.interaktiverReifegradCheckErmitteln} /></span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.beantwortenSieDieFolgenden} /></p>
            </div>

            {/* Checkbox-Grid */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider"><MdText text={inhalt.texte.projektkriterienZutreffendesAnkreuzen} /></h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-off-white cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={userConceptValid}
                    onChange={(e) => setUserConceptValid(e.target.checked)}
                    className="mt-0.5 accent-shiraz w-4 h-4 rounded"
                  />
                  <div>
                    <strong className="text-slate-800 block"><MdText text={inhalt.texte.t1KonzeptRezepturFormuliert} /></strong>
                    <span className="text-slate-500"><MdText text={inhalt.texte.dasTheoretischeWirkprinzipUnd} /></span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-off-white cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={userLabVerified}
                    onChange={(e) => setUserLabVerified(e.target.checked)}
                    className="mt-0.5 accent-shiraz w-4 h-4 rounded"
                  />
                  <div>
                    <strong className="text-slate-800 block"><MdText text={inhalt.texte.t2ImLaboratoriumValidiert} /></strong>
                    <span className="text-slate-500"><MdText text={inhalt.texte.standardisiertePrüfkörperZB} /></span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-off-white cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={userScaleUp}
                    onChange={(e) => setUserScaleUp(e.target.checked)}
                    className="mt-0.5 accent-shiraz w-4 h-4 rounded"
                  />
                  <div>
                    <strong className="text-slate-800 block"><MdText text={inhalt.texte.t3TechnischerScaleUp} /></strong>
                    <span className="text-slate-500"><MdText text={inhalt.texte.dasMaterialWurdeIn} /></span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-off-white cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={userPilotField}
                    onChange={(e) => setUserPilotField(e.target.checked)}
                    className="mt-0.5 accent-shiraz w-4 h-4 rounded"
                  />
                  <div>
                    <strong className="text-slate-800 block"><MdText text={inhalt.texte.t4PrototypPilotbauwerkErrichtet} /></strong>
                    <span className="text-slate-500"><MdText text={inhalt.texte.derBaustoffWurdeIn} /></span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-off-white cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={userZulassung}
                    onChange={(e) => setUserZulassung(e.target.checked)}
                    className="mt-0.5 accent-shiraz w-4 h-4 rounded"
                  />
                  <div>
                    <strong className="text-slate-800 block"><MdText text={inhalt.texte.t5BauaufsichtlicheZulassungLiegt} /></strong>
                    <span className="text-slate-500"><MdText text={inhalt.texte.eineGültigeAbzAbg} /></span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-off-white cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={userSerialProduction}
                    onChange={(e) => setUserSerialProduction(e.target.checked)}
                    className="mt-0.5 accent-shiraz w-4 h-4 rounded"
                  />
                  <div>
                    <strong className="text-slate-800 block"><MdText text={inhalt.texte.t6SerienproduktionMarkteinsatzTrl} /></strong>
                    <span className="text-slate-500"><MdText text={inhalt.texte.dasProduktIstRegulär} /></span>
                  </div>
                </label>

              </div>
            </div>

            {/* Auswertung & Cockpit */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-shiraz text-white flex items-center justify-center font-black text-2xl shadow-sm">
                    {formatDeWert(currentTrl)}
                  </div>
                  <div>
                    <span className="text-xxs uppercase tracking-wider font-bold text-slate-400"><MdText text={inhalt.texte.errechneterReifegrad} /></span>
                    <h4 className="font-extrabold text-lg text-slate-900"><MdText text={inhalt.texte.technologyReadinessLevel} />{formatDeWert(currentTrl)} von 9
                    </h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    currentTrl <= 3 ? 'bg-amber-100 text-amber-900' : currentTrl <= 6 ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'
                  }`}>
                    {currentTrl <= 3 ? 'Grundlagenforschung' : currentTrl <= 6 ? inhalt.werte.angewandtePrototypenPhase : inhalt.werte.zulassungVermarktung}
                  </span>
                </div>
              </div>

              {/* Analyse & Handlungsempfehlungen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-off-white rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 block uppercase tracking-wide text-xxs flex items-center gap-1.5">
                    <ArrowRight size={14} className="text-shiraz" /><MdText text={inhalt.texte.nächsterTechnologischerFlaschenhals} /></span>
                  <p className="text-slate-600 leading-relaxed">
                    {currentTrl < 4 && inhalt.werte.führenSieGenormteReihenprüfungen}
                    {currentTrl >= 4 && currentTrl < 6 && inhalt.werte.verlassenSieDieLabormischung}
                    {currentTrl >= 6 && currentTrl < 8 && inhalt.werte.bauenSieEinPilotprojekt}
                    {currentTrl >= 8 && inhalt.werte.skalierenSieDasVertriebsnetzwerk}
                  </p>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 block uppercase tracking-wide text-xxs flex items-center gap-1.5">
                    <Award size={14} className="text-shiraz" /><MdText text={inhalt.texte.empfohleneFörderschiene} /></span>
                  <p className="text-slate-600 leading-relaxed">
                    {currentTrl <= 3 && inhalt.werte.dfgSachbeihilfeExistForschungstransfer}
                    {currentTrl >= 4 && currentTrl <= 6 && inhalt.werte.zukunftBauBbsrForschungsförderung}
                    {currentTrl >= 7 && inhalt.werte.euInnovationFundBmwe}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        </ModuleTabs>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielBewehrungsquerschnittS}
          zielGleichung="A_{erf} = \frac{F_{Ed}}{f_d}"
          normQuelle={inhalt.werte.lehrwerteFYdNach}
          schritte={inhalt.daten["BpInnovationen.schritte"]}
          ergebnisHinweis={inhalt.werte.carbonSpartQuerschnittUnd}
        />
      </div>

      <ModulTest moduleId="bp_innovationen" />

      {/* 2. STANDARDISIERTER FOOTER GEMÄSS STYLEGUIDE */}
      <ModuleFooter
        wikipedia={[
          { title: inhalt.werte.technologyReadinessLevel, url: 'https://de.wikipedia.org/wiki/Technology_Readiness_Level' },
          { title: 'Carbonbeton', url: 'https://de.wikipedia.org/wiki/Carbonbeton' },
          { title: 'Geopolymer', url: 'https://de.wikipedia.org/wiki/Geopolymer' },
          { title: inhalt.werte.deutschesInstitutFürBautechnik, url: 'https://de.wikipedia.org/wiki/Deutsches_Institut_f%C3%BCr_Bautechnik' },
          { title: 'Bauprodukteverordnung', url: 'https://de.wikipedia.org/wiki/Bauprodukteverordnung' }
        ]}
        literatur={inhalt.daten["BpInnovationen.literatur"]}
        regelwerke={inhalt.daten["BpInnovationen.regelwerke"]}
        formeln={inhalt.daten["BpInnovationen.formeln"]}
      />
    </div>
  );
}
