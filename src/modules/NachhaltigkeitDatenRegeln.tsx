import React, { useState } from 'react';
import { 
  Scale, 
  BarChart3, 
  Globe, 
  ShieldCheck, 
  Building2, 
  Layers, 
  QrCode, 
  RefreshCw,
  BookOpen,
  Library,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { useTabContext } from '@/src/contexts/TabContext';
import { ALL_17_SDGS } from './nachhaltigkeitdatenregeln/daten';
import { DefinitionenTab } from './nachhaltigkeitdatenregeln/DefinitionenTab';
import inhalt from '@/content/nachhaltigkeitdatenregeln/NachhaltigkeitDatenRegeln.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { A4_FAKTOR_EINZEL } from '@/src/calc/lca';
import { LCA_BENCHMARKS } from './lca/transportbetonKennwerte';

/**
 * Umsetzung 30.10.2026 (DSB-NR-2): vermiedene Emissionen je t Bauschutt aus zentralen Werten statt 45 kg/t ohne Quelle –
 * Primärkies A1–A3 (Lehrwert der Transportbeton-Übung, 3,5 kg/t) + Lkw-Transport 25 km (A4_FAKTOR_EINZEL, UBA 2024: 0,101 kg/(t·km))
 * = 3,5 + 2,5 ≈ 6,0 kg CO₂-Äq./t. Die Transportstrecke ist eine Lehrannahme.
 */
const KIES_A1A3_KG_JE_T = LCA_BENCHMARKS.gwp_aggregate_natural * 1000;
const STOFFSTROM_LKW_KM = 25;
const VERMIEDEN_KG_JE_T = KIES_A1A3_KG_JE_T + A4_FAKTOR_EINZEL['lkw-heavy'] * STOFFSTROM_LKW_KM;
const VERMIEDEN_HERLEITUNG = inhalt.texte.vermiedeneTransporteAbbau
  .replace('{kies}', formatDeZahl(KIES_A1A3_KG_JE_T, 1))
  .replace('{lkw}', formatDeZahl(A4_FAKTOR_EINZEL['lkw-heavy'], 3))
  .replace('{km}', formatDeZahl(STOFFSTROM_LKW_KM, 0))
  .replace('{summe}', formatDeZahl(VERMIEDEN_KG_JE_T, 1));
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { ErgebnisAnsage } from '@/src/components/ui/ErgebnisAnsage';
import { reglerName, reglerEinheit } from '@/src/lib/reglerName';

export type DatenRegelnTab = 
  | 'definitionen'
  | 'kennzahlen' 
  | 'klimapolitik' 
  | 'regulatorik' 
  | 'deklarationen' 
  | 'national';

export default function NachhaltigkeitDatenRegeln() {
  const { setActiveTab: setGlobalTab } = useTabContext();
  const [activeTab, setActiveTab] = useState<DatenRegelnTab>('kennzahlen');
  const [selectedSdg, setSelectedSdg] = useState<number>(11);
  const [selectedTaxonomyGoal, setSelectedTaxonomyGoal] = useState<number>(1);
  const [interactiveMasse, setInteractiveMasse] = useState<number>(1000); // Tonnen Bauschutt

  // Calculation for waste recycling potential
  // Szenario mit Lehrwerten (Durchsicht B 29.10.2026, DSB-NR-1): 65 % R-Beton-Gesteinskörnung, 25 % Tragschichten, 10 % Deponie,
  // vermiedene Transporte und Rohstoffabbau je t: VERMIEDEN_KG_JE_T (rund 6 kg/t, Herleitung oben; vorher 45 kg/t ohne Quelle)
  const calculatedRcBeton = formatDeZahl(interactiveMasse * 0.65, 0);
  const calculatedUnterbau = formatDeZahl(interactiveMasse * 0.25, 0);
  const calculatedDeponie = formatDeZahl(interactiveMasse * 0.10, 0);
  const savedCo2Tons = formatDeZahl((interactiveMasse * VERMIEDEN_KG_JE_T) / 1000, 1);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 font-normal">
      {/* Central Header & Teaser Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Scale className="text-shiraz h-6 w-6" /><MdText text={inhalt.texte.nachhaltigkeitDatenRegeln} /></h2>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.globaleUmweltkennzahlenUnSdgs} /></p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap"><MdText text={inhalt.texte.stand20252026} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p><MdText text={inhalt.texte.dasBauUndImmobilienwesen} /></p>
        </div>
      </div>

      <ModuleTabs
        label={inhalt.werte.bereicheNachhaltigkeitDatenRegeln}
        tabs={[
          { id: 'definitionen' as const, label: inhalt.texte.t1DefinitionenLeitprinzipien, icon: BookOpen },
          { id: 'kennzahlen' as const, label: inhalt.texte.t2AnteileStoffströme, icon: BarChart3 },
          { id: 'klimapolitik' as const, label: inhalt.texte.t3KlimakonferenzenSdgs, icon: Globe },
          { id: 'regulatorik' as const, label: inhalt.texte.t4EuTaxonomieEpbd, icon: Building2 },
          { id: 'deklarationen' as const, label: inhalt.texte.t5EpdDppMaterialpass, icon: QrCode },
          { id: 'national' as const, label: inhalt.texte.t6DeutschesBaurechtGmodg, icon: ShieldCheck },
        ]}
        aktiv={activeTab}
        onWechsel={setActiveTab}
        className="flex flex-col gap-6"
      >
      {/* ========================================================================= */}
      {/* TAB 1: DEFINITIONEN: NACHHALTIGKEIT (ALLGEMEIN) & NACHHALTIGES BAUEN      */}
      {/* ========================================================================= */}
      {activeTab === 'definitionen' && (
        <DefinitionenTab />
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ANTEILE & STOFFSTRÖME DES BAUWESENS                                */}
      {/* ========================================================================= */}
      {activeTab === 'kennzahlen' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Key Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider"><MdText text={inhalt.texte.treibhausgaseThg} /></span>
                <strong className="text-3xl font-extrabold text-shiraz block mt-1">~40 %</strong>
                <span className="text-xs font-bold text-slate-800 block mt-0.5"><MdText text={inhalt.texte.derGlobalenEnergiebedCo} /></span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100"><MdText text={inhalt.texte.davonCa28Aus} /></p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider"><MdText text={inhalt.texte.ressourcenRohstoffe} /></span>
                <strong className="text-3xl font-extrabold text-slate-900 block mt-1">&gt; 50 %</strong>
                <span className="text-xs font-bold text-slate-800 block mt-0.5"><MdText text={inhalt.texte.desWeltweitenRohstoffverbrauchs} /></span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100"><MdText text={inhalt.texte.massenrohstoffeSandKiesKalkstein} /></p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider"><MdText text={inhalt.texte.abfallaufkommenDeutschland} /></span>
                <strong className="text-3xl font-extrabold text-amber-700 block mt-1">~55 %</strong>
                <span className="text-xs font-bold text-slate-800 block mt-0.5"><MdText text={inhalt.texte.desGesamtenDeutschenAbfalls} /></span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100"><MdText text={inhalt.texte.mitRund220Bis} /></p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Flächeninanspruchnahme</span>
                <strong className="text-3xl font-extrabold text-emerald-700 block mt-1">~52 ha/d</strong>
                <span className="text-xs font-bold text-slate-800 block mt-0.5"><MdText text={inhalt.texte.täglicherFlächenverbrauchDe} /></span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100"><MdText text={inhalt.texte.siedlungsUndVerkehrsflächeWächst} /></p>
            </div>
          </div>

          {/* Deep Dive Section: Der Stoffstrom des Bauens */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900"><MdText text={inhalt.texte.zusammensetzungDer220230} /></h3>
                <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.datenquelleUmweltbundesamtUbaBundesverba} /></p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">
                Kreislaufwirtschafts-Potenzial
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.t1Bodenaushub} /></strong>
                    <span className="text-xs font-mono font-bold text-shiraz">~130 Mio. t</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.größteEinzelfraktionCa58} /></div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2"><MdText text={inhalt.texte.ebvKlasseBm0} /></span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.t2Bauschutt} /></strong>
                    <span className="text-xs font-mono font-bold text-shiraz">~60 Mio. t</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.betonZiegelFliesenKeramik} /></div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2"><MdText text={inhalt.texte.ebvKlasseRc1} /></span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.t3Straßenaufbruch} /></strong>
                    <span className="text-xs font-mono font-bold text-shiraz"><MdText text={inhalt.texte.t1520MioT} /></span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.asphaltUndSchotterHohe} /></div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2"><MdText text={inhalt.texte.ebvKlasseRcAsphalt} /></span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.t4BaustellenabfälleGips} /></strong>
                    <span className="text-xs font-mono font-bold text-shiraz">~15 Mio. t</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.gemischteFraktionenDämmstoffeHolz} /></div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2"><MdText text={inhalt.texte.gewabfvTrennpflicht} /></span>
              </div>
            </div>

            {/* Interactive Recycling Impact Calculator */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 mt-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <RefreshCw size={14} className="text-emerald-700" /><MdText text={inhalt.texte.interaktiverStoffstromRechnerUrban} /></span>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  Eingabe: {formatDeWert(interactiveMasse)}<MdText text={inhalt.texte.tonnenBauschutt} /></span>
              </div>

              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={interactiveMasse}
                aria-label={reglerName(inhalt.texte.interaktiverStoffstromRechnerUrban)}
                aria-valuetext={`Eingabe: ${formatDeWert(interactiveMasse)}${reglerEinheit(inhalt.texte.tonnenBauschutt)}`}
                onChange={(e) => setInteractiveMasse(parseInt(e.target.value))}
                className="w-full h-1 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />

              <ErgebnisAnsage text={`${formatDeWert(interactiveMasse)} t Bauschutt: RC-Beton ${calculatedRcBeton} t, Unterbau ${calculatedUnterbau} t, Deponie ${calculatedDeponie} t, vermiedenes CO₂ ${savedCo2Tons} t`} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg border border-emerald-150 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.hochwertigerRBetonTyp} /></span>
                  <strong className="text-sm font-mono font-bold text-emerald-900">{calculatedRcBeton} t</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5"><MdText text={inhalt.texte.alsGesteinskörnung} /></span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-150 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.tragschichtenUnterbau} /></span>
                  <strong className="text-sm font-mono font-bold text-slate-800">{calculatedUnterbau} t</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5"><MdText text={inhalt.texte.frostschutzWege} /></span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-150 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.restfraktionDeponie} /></span>
                  <strong className="text-sm font-mono font-bold text-amber-700">{calculatedDeponie} t</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5"><MdText text={inhalt.texte.feinanteileStörstoffe} /></span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-150 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.eingespartesPrimärCo} /></span>
                  <strong className="text-sm font-mono font-bold text-emerald-700">~{savedCo2Tons} t CO₂e</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5"><MdText text={VERMIEDEN_HERLEITUNG} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KLIMAKONFERENZEN & UN-SDGS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'klimapolitik' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Timeline of International Milestones */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3">
              <h3 className="text-base font-extrabold text-slate-900"><MdText text={inhalt.texte.dieInternationaleKlimadiplomatieUnd} /></h3>
              <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.vonDerUnKlimarahmenkonvention} /></p>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 py-2">
              {inhalt.daten.NachhaltigkeitDatenRegeln.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-shiraz group-hover:bg-shiraz transition-colors" />
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-mono font-bold text-shiraz">{item.year}</span>
                    <strong className="text-xs font-bold text-slate-900">{item.title}</strong>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive UN Sustainable Development Goals (SDGs) for Construction */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900"><MdText text={inhalt.texte.die17UnNachhaltigkeitsziele} /></h3>
                <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.wählenSieEinSdg} /></p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold"><MdText text={inhalt.texte.unAgenda2030} /></span>
            </div>

            {/* Legend for Construction Relevance */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-home-grau/20">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded border border-red-500 bg-red-50 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                </span>
                <span className="text-slate-800">
                  <strong className="text-red-600 font-bold"><MdText text={inhalt.texte.dünnerRoterRand} /></strong><MdText text={inhalt.texte.direkteKernPraxisrelevanzFür} /></span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <span className="w-4 h-4 rounded border border-slate-200 bg-white shrink-0"></span>
                <span><MdText text={inhalt.texte.grauerRandÜbergreifendeGlobale} /></span>
              </div>
            </div>

            {/* All 17 SDGs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {ALL_17_SDGS.map((sdg) => {
                const isSelected = selectedSdg === sdg.num;
                return (
                  <button
                    key={sdg.num}
                    type="button"
                    onClick={() => setSelectedSdg(sdg.num)}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      sdg.bauRelevant
                        ? 'border border-red-500 shadow-2xs'
                        : 'border border-slate-200 shadow-2xs'
                    } ${
                      isSelected
                        ? sdg.bauRelevant
                          ? 'bg-shiraz text-white border-red-600 ring-2 ring-red-400/40 shadow-xs'
                          : 'bg-shiraz/80 text-white border-shiraz shadow-xs'
                        : sdg.bauRelevant
                          ? 'bg-white hover:bg-red-50/50 text-slate-800'
                          : 'bg-slate-50/70 hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center w-full">
                      <span className={`w-5 h-5 rounded ${sdg.badgeBg} text-white flex items-center justify-center font-mono font-bold text-[10px]`}>
                        {sdg.num}
                      </span>
                    </div>
                    <span className="font-bold text-[11px] leading-tight line-clamp-2">
                      {sdg.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SDG Detail Content Card */}
            {(() => {
              const currentSdg = ALL_17_SDGS.find(s => s.num === selectedSdg) || ALL_17_SDGS[10];
              return (
                <div className={`p-5 rounded-xl border text-xs leading-relaxed transition-all ${
                  currentSdg.bauRelevant 
                    ? 'border-red-400 bg-red-50/20' 
                    : 'border-slate-200 bg-slate-50/70'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3 mb-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md ${currentSdg.badgeBg} text-white flex items-center justify-center font-mono font-bold text-xs`}>
                        {currentSdg.num}
                      </span>
                      <span>{currentSdg.fullName}</span>
                    </h4>
                    {currentSdg.bauRelevant ? (
                      <span className="self-start sm:self-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        {currentSdg.relevanceLabel || inhalt.werte.direkteKernrelevanzFürDas}
                      </span>
                    ) : (
                      <span className="self-start sm:self-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200/80 text-slate-600"><MdText text={inhalt.texte.sektorübergreifendesRahmenziel} /></span>
                    )}
                  </div>

                  <p className="italic text-slate-500 mb-2"><MdText text={inhalt.texte.unLeitsatz} />{currentSdg.englishTitle}&ldquo;
                  </p>

                  <p className="text-slate-800 leading-relaxed mb-3">
                    <strong>Baupraxis-Relevanz:</strong> {currentSdg.baupraxis}
                  </p>

                  {currentSdg.measures.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <strong className="text-[11px] text-slate-700 block mb-1"><MdText text={inhalt.texte.konkreteHandlungsfelderMaßnahmenIm} /></strong>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                        {currentSdg.measures.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EU-TAXONOMIE & EPBD                                                */}
      {/* ========================================================================= */}
      {activeTab === 'regulatorik' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Quick jump to comprehensive Rechtsrahmen-Kompendium */}
          <div className="bg-white border border-home-grau/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <Scale size={15} /><MdText text={inhalt.texte.neuVollständigesRechtsrahmenHierarchie} /></span>
              <p className="text-xs text-text-main/80 leading-relaxed max-w-2xl"><MdText text={inhalt.texte.hierarchische5EbenenSystematik} /></p>
            </div>
            <button
              type="button"
              onClick={() => setGlobalTab('oekobilanz_lca')}
              className="px-4 py-2.5 bg-shiraz text-white rounded-xl text-xs font-bold hover:bg-shiraz/90 transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-sm self-start sm:self-center"
            ><MdText text={inhalt.texte.zumRechtsrahmenKompendium} /><ArrowRight size={14} />
            </button>
          </div>

          {/* EU-Taxonomie Overview */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900"><MdText text={inhalt.texte.euTaxonomieVerordnungEu} /></h3>
                <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.dasEuKlassifikationssystemFür} /></p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold">
                Taxonomie-Konformität
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Damit ein Bau- oder Immobilienprojekt als „taxonomiekonform“ eingestuft wird, muss es einen 
              <strong><MdText text={inhalt.texte.wesentlichenBeitragSubstantialContributi} /></strong> zu mindestens einem der sechs EU-Umweltziele leisten und 
              gleichzeitig das Prinzip <strong><MdText text={inhalt.texte.doNoSignificantHarm} /></strong> (keine wesentliche Beeinträchtigung der übrigen fünf Ziele) strikt einhalten:
            </p>

            {/* 6 Environmental Goals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {inhalt.daten.NachhaltigkeitDatenRegeln_2.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedTaxonomyGoal(goal.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedTaxonomyGoal === goal.id
                      ? 'border-shiraz bg-shiraz/5 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <strong className={`block text-xs font-bold ${selectedTaxonomyGoal === goal.id ? 'text-shiraz' : 'text-slate-900'}`}>
                    {goal.title}
                  </strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{goal.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <span><MdText text={inhalt.texte.bedeutungFürProjektentwicklerBanken} /></span>
              <strong className="font-bold text-shiraz"><MdText text={inhalt.texte.taxonomiequoteCapexOpexBestimmt} /></strong>
            </div>
          </div>

          {/* EPBD Novelle (EU 2024/1275) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900"><MdText text={inhalt.texte.dieNeueEuGebäuderichtlinie} /></h3>
                <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.inkrafttretenImMai2024} /></p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold"><MdText text={inhalt.texte.epbdNovelle2024} /></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 block uppercase"><MdText text={inhalt.texte.stufe1Ab2028} /></span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1"><MdText text={inhalt.texte.öffentlicheNullemissionsgebäude} /></strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.alleNeuenGebäudeIm} /></p>
                </div>
                <span className="text-[10px] font-bold text-blue-900 mt-3 pt-2 border-t border-blue-200"><MdText text={inhalt.texte.vorbildfunktionDerÖffentlichenHand} /></span>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 block uppercase"><MdText text={inhalt.texte.stufe2Ab2030} /></span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1"><MdText text={inhalt.texte.zebWholeLifeCarbon} /></strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.ausnahmslosAlleNeuenGebäude} /></p>
                </div>
                <span className="text-[10px] font-bold text-blue-900 mt-3 pt-2 border-t border-blue-200"><MdText text={inhalt.texte.gwpGrenzenImBauantrag} /></span>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 block uppercase"><MdText text={inhalt.texte.fossilAusstieg20252040} /></span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1">Heizungs-Dekarbonisierung</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.ab2025KeineStaatlichen} /></p>
                </div>
                <span className="text-[10px] font-bold text-blue-900 mt-3 pt-2 border-t border-blue-200"><MdText text={inhalt.texte.verbotVonGasÖlheizungen} /></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EPD, DIGITALER PRODUKTPASS & MATERIALPASS                          */}
      {/* ========================================================================= */}
      {activeTab === 'deklarationen' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900"><MdText text={inhalt.texte.umweltproduktdeklarationenEpdNachDin} /></h3>
                <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.typIiiUmweltdeklarationenNach} /></p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold"><MdText text={inhalt.texte.dinEn15804A2} /></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
                <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.die4NormativenGwp} /></strong>
                <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong className="text-slate-800">GWP-total:</strong><MdText text={inhalt.texte.summenwertAllerTreibhausgasemissionenUnd} /></li>
                  <li><strong className="text-slate-800">GWP-fossil:</strong><MdText text={inhalt.texte.emissionenAusVerbrennungFossiler} /></li>
                  <li><strong className="text-slate-800">GWP-biogenic:</strong><MdText text={inhalt.texte.coAufnahmeImPflanzenwachstum} /></li>
                  <li><strong className="text-slate-800">GWP-luluc:</strong><MdText text={inhalt.texte.treibhauspotenzialInfolgeVonLandnutzung} /></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
                <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.generischeVsSpezifischeEpds} /></strong>
                <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong className="text-slate-800"><MdText text={inhalt.texte.generischÖkobaudat} /></strong><MdText text={inhalt.texte.durchschnittswerteFürFrüheEntwurfsphasen} /></li>
                  <li><strong className="text-slate-800"><MdText text={inhalt.texte.herstellerspezifischZBIbu} /></strong><MdText text={inhalt.texte.geprüftePrimärdatenEinesKonkreten} /></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Digitaler Produktpass (DPP) & Madaster */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900"><MdText text={inhalt.texte.digitalerProduktpassDppGebäude} /></h3>
                <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.rechtsrahmenEuÖkodesignVerordnung} /></p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-50 text-purple-800 rounded font-bold">
                ESPR &amp; CPR
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-purple-150 bg-purple-50/50 flex flex-col justify-between">
                <div>
                  <QrCode size={20} className="text-purple-700 mb-2" />
                  <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.digitalProductPassportDpp} /></strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.jedesBauproduktErhältEinen} /></p>
                </div>
                <span className="text-[10px] font-bold text-purple-900 mt-3 pt-2 border-t border-purple-200"><MdText text={inhalt.texte.rechtspflichtNachEuÖkodesign} /></span>
              </div>

              <div className="p-4 rounded-xl border border-purple-150 bg-purple-50/50 flex flex-col justify-between">
                <div>
                  <Building2 size={20} className="text-purple-700 mb-2" />
                  <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.gebäudeMaterialpassMadaster} /></strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.dokumentiertArtMasseEinbauort} /></p>
                </div>
                <span className="text-[10px] font-bold text-purple-900 mt-3 pt-2 border-t border-purple-200"><MdText text={inhalt.texte.grundlageFürUrbanMining} /></span>
              </div>

              <div className="p-4 rounded-xl border border-purple-150 bg-purple-50/50 flex flex-col justify-between">
                <div>
                  <RefreshCw size={20} className="text-purple-700 mb-2" />
                  <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.designForDisassembly} /></strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.konstruierenMitTrennbarenMechanischen} /></p>
                </div>
                <span className="text-[10px] font-bold text-purple-900 mt-3 pt-2 border-t border-purple-200"><MdText text={inhalt.texte.zirkularitätsgrad80} /></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DEUTSCHES BAURECHT (GModG, QNG, EBV, Gebäudetyp E)                          */}
      {/* ========================================================================= */}
      {activeTab === 'national' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900"><MdText text={inhalt.texte.dieFünfSäulenDes} /></h3>
                <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.vomGebäudemodernisierungsgesetzGmodgVorm} /></p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">
                Bundesrecht
              </span>
            </div>

            <div className="space-y-4">
              {/* GEG */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.t1GebäudemodernisierungsgesetzGmodgVormal} /></strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Energie</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.regeltDenPrimärenergetischenEffizienzhau} /></p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono"><MdText text={inhalt.texte.maxTransmissionswärmeverlust} /></span>
                  <strong className="text-xs font-mono font-bold text-slate-800">H'T-Grenzwerte</strong>
                </div>
              </div>

              {/* QNG */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.t2QualitätssiegelNachhaltigesGebäude} /></strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Förderung</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.staatlichesGütesiegelDesBmwsb} /></p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Nachweis-Zeithorizont</span>
                  <strong className="text-xs font-mono font-bold text-emerald-700">50 Jahre</strong>
                </div>
              </div>

              {/* EBV */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.t3ErsatzbaustoffverordnungEbvSeit} /></strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Kreislauf</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.bundesweitHarmonisierteQualitätsanforder} /></p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono"><MdText text={inhalt.texte.schwellenwertKataster} /></span>
                  <strong className="text-xs font-mono font-bold text-amber-800">&ge; 250 m³</strong>
                </div>
              </div>

              {/* KrWG */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.t4KreislaufwirtschaftsgesetzKrwg} /></strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">Hierarchie</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.verbindliche5StufigeAbfallhierarchie} /></p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Grundsatz</span>
                  <strong className="text-xs font-mono font-bold text-purple-800"><MdText text={inhalt.texte.vermeidungVorBeseitigung} /></strong>
                </div>
              </div>

              {/* Gebäudetyp E */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.t5GebäudetypEGesetzesvorhaben} /></strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">Suffizienz</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><MdText text={inhalt.texte.sollFachkundigenBaupartnernDas} /></p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono"><MdText text={inhalt.texte.kabinettNov2024} /></span>
                  <strong className="text-xs font-mono font-bold text-rose-800"><MdText text={inhalt.texte.einfachesBauen} /></strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      </ModuleTabs>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1EuTaxonomie}
        zielGleichung="Q_{P} \le 0{,}90 \cdot Q_{P,\text{NZEB}}"
        schritte={inhalt.daten["NachhaltigkeitDatenRegeln.schritte"]}
        ergebnisHinweis={inhalt.werte.fürGebäudeÜber5}
        normQuelle={inhalt.werte.delegierteVoEu2021}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2CrremPfad}
        zielGleichung="I_{\text{Ziel}}(t) = I_{2020} - \frac{I_{2020} - I_{2030}}{10} \cdot (t - 2020)"
        schritte={inhalt.daten["NachhaltigkeitDatenRegeln.schritte_2"]}
        ergebnisHinweis={inhalt.werte.crremPfadeSindLänder}
        normQuelle={inhalt.werte.crremMethodikLehrbeispiel}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="nachhaltigkeit_daten_regeln" />

      {/* Standardized ModuleFooter according to Styleguide */}
      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap7}
        wikipedia={[
          { title: inhalt.werte.zieleFürNachhaltigeEntwicklung, url: 'https://de.wikipedia.org/wiki/Ziele_f%C3%BCr_nachhaltige_Entwicklung' },
          { title: 'EU-Taxonomie', url: 'https://de.wikipedia.org/wiki/EU-Taxonomie' },
          inhalt.daten["NachhaltigkeitDatenRegeln.wikipedia.2"],
          { title: inhalt.werte.umweltproduktdeklarationEpd },
          { title: inhalt.werte.ersatzbaustoffverordnungEbv, url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' }
        ]}
        literatur={inhalt.daten["NachhaltigkeitDatenRegeln.literatur"]}
        regelwerke={inhalt.daten["NachhaltigkeitDatenRegeln.regelwerke"]}
        formeln={inhalt.daten["NachhaltigkeitDatenRegeln.formeln"]}
      />
    </div>
  );
}
