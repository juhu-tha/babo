import { formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  Recycle, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  BookOpen, 
  Info, 
  Clock, 
  Hammer, 
  FileText,
  ShieldCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { EraData, baustoffRecyclingData } from './rueckbau/daten';
import { AktualitaetTab } from './rueckbau/AktualitaetTab';
import { RechnerTab } from './rueckbau/RechnerTab';
import { BaustoffrecyclingTab } from './rueckbau/BaustoffrecyclingTab';
import inhalt from '@/content/rueckbau/Rueckbau.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Rueckbau() {
  const [activeTab, setActiveTab] = useState<'lfu_leitfaden' | 'schadstoffe' | 'baustoffrecycling' | 'rechner' | 'aktualitaet' | 'praxis'>('lfu_leitfaden');
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [selectedEra, setSelectedEra] = useState<'pre1970' | 'era1970_1990' | 'post1990'>('pre1970');
  const [selectedRecyclingMaterial, setSelectedRecyclingMaterial] = useState<number>(0);
  
  // Rechner states
  const [buildingVolume, setBuildingVolume] = useState<number>(2500); // m³
  const [structureType, setStructureType] = useState<'concrete' | 'masonry' | 'timber' | 'composite'>('masonry');
  const [showCalculations, setShowCalculations] = useState<boolean>(false);

  // LfU 5-Phase selective dismantling process definitions
  const processPhases = inhalt.daten["Rueckbau.processPhases"];

  // Era-based pollutant matrix data (LfU-specific & TRGS rules)
  const eraPollutants: Record<'pre1970' | 'era1970_1990' | 'post1990', EraData> = {
    pre1970: {
      title: inhalt.werte.bis1970HochrisikoEpoche,
      description: inhalt.werte.inDieserPhaseGab,
      dominantMaterials: [inhalt.werte.naturwerksteineZiegelmauerwerk, inhalt.werte.bimsbetonSchlackenbetonAlsFüllstoffe, inhalt.werte.geradeUndGenieteteStahlträger, inhalt.werte.ersteGenerationVonStahlbetonplatten],
      pollutants: [
        {
          name: inhalt.werte.asbestFestSchwachGebunden,
          chemical: inhalt.werte.silikatmineraleChrysotilKrokydolith,
          foundIn: inhalt.werte.faserzementplattenEternitSpritzasbestAn,
          probability: 'Sehr hoch',
          handling: inhalt.werte.staubfreierAusbauUnterUnterdruck,
          rules: inhalt.werte.gefahrstoffverordnungGefstoffvTrgs519
        },
        {
          name: inhalt.werte.teerPechPak,
          chemical: inhalt.werte.polyzyklischeAromatischeKohlenwasserstof,
          foundIn: inhalt.werte.estrichkleberAsphaltkleberDachpappenTeer,
          probability: 'Sehr hoch',
          handling: inhalt.werte.fräsUndStemmarbeitenNur,
          rules: inhalt.werte.dguvRegel101004
        },
        {
          name: inhalt.werte.polychlorierteBiphenylePcb,
          chemical: inhalt.werte.pcbGemischeWeichmacher,
          foundIn: inhalt.werte.dauerelastischeFugendichtungsmassenThiok,
          probability: 'Mittel',
          handling: inhalt.werte.herausschneidenDerFugenflankenUnterdruck,
          rules: inhalt.werte.pcbRichtlinieBayernTrgs
        },
        {
          name: inhalt.werte.bleiSchwermetalle,
          chemical: 'Schwermetalloxide',
          foundIn: inhalt.werte.roteBleimennigeAnstricheRostschutz,
          probability: 'Sehr hoch',
          handling: inhalt.werte.staubarmesAbsaugenKeinMechanisches,
          rules: inhalt.werte.trgs505Blei
        }
      ]
    },
    era1970_1990: {
      title: inhalt.werte.t19701990KonsolidierungsUnd,
      description: inhalt.werte.zunehmendeIndustrialisierungDesBauens,
      dominantMaterials: [inhalt.werte.großtafelbauwerkePlattenbau, inhalt.werte.standardisierteFertigteildecken, inhalt.werte.extremVielGipskartonUnd, inhalt.werte.gegossenerTransportbetonNormiert],
      pollutants: [
        {
          name: inhalt.werte.asbestVAIn,
          chemical: 'Chrysotilasbest',
          foundIn: inhalt.werte.putzträgerSpachtelmassenFliesenkleberDic,
          probability: 'Sehr hoch',
          handling: inhalt.werte.bohrUndSchleifverfahrenNur,
          rules: 'TRGS 519'
        },
        {
          name: inhalt.werte.künstlicheMineralfasernKmfAlt,
          chemical: inhalt.werte.glaswolleSteinwolleKi40,
          foundIn: inhalt.werte.loseDachbodendämmungenTrittschalldämmung,
          probability: 'Sehr hoch',
          handling: inhalt.werte.alteMineralwolleGiltAls,
          rules: 'TRGS 521'
        },
        {
          name: inhalt.werte.holzschutzmittelPcpLindan,
          chemical: inhalt.werte.pentachlorphenolHexachlorcyclohexan,
          foundIn: inhalt.werte.imprägnierteHolzkonstruktionenDachstühle,
          probability: 'Hoch',
          handling: inhalt.werte.belasteteHölzerMüssenSepariert,
          rules: inhalt.werte.altholzverordnungAltholzvPcpRichtlinie
        },
        {
          name: 'Formaldehyd',
          chemical: inhalt.werte.methanalGasförmigGelöst,
          foundIn: inhalt.werte.spanplattenFertighäuserTrennwändeSpanpla,
          probability: 'Hoch',
          handling: inhalt.werte.guteDurchlüftungBeimAbbruch,
          rules: inhalt.werte.gefahrstoffverordnungGrenzwerteFürLuftbe
        }
      ]
    },
    post1990: {
      title: inhalt.werte.ab1990ModerneBauära,
      description: inhalt.werte.asbestverbotAb1993In,
      dominantMaterials: [inhalt.werte.hochfesterStahlbetonC5060, inhalt.werte.wärmedämmverbundsystemeWdvs, inhalt.werte.schnittstellenmauerwerkePorenbetonPlanzi, inhalt.werte.verbundwerkstoffeGfkCarbonbewehrterBeton],
      pollutants: [
        {
          name: inhalt.werte.hbcdDämmstoffe,
          chemical: inhalt.werte.hexabromcyclododecanFlammschutzmittel,
          foundIn: inhalt.werte.polystyrolDämmplattenEpsXps,
          probability: 'Hoch',
          handling: inhalt.werte.giltAlsPopPersistent,
          rules: inhalt.werte.popVerordnungDerEu
        },
        {
          name: inhalt.werte.fluorierteTreibgaseFckwHfkw,
          chemical: 'Chlorfluorkohlenwasserstoffe',
          foundIn: inhalt.werte.puHartschaumdämmstoffeOrtschaumIsolierun,
          probability: 'Mittel',
          handling: inhalt.werte.geordneterAusbauOhneZerstückelung,
          rules: inhalt.werte.fckwHalonVerordnungPop
        },
        {
          name: inhalt.werte.künstlicheMineralfasernKmfNeu,
          chemical: inhalt.werte.glasUndSteinwolleKi,
          foundIn: inhalt.werte.wärmeUndBrandschutzdämmungen,
          probability: 'Sehr hoch',
          handling: inhalt.werte.verschärfterStaubschutzDaFasern,
          rules: inhalt.werte.trgs521SchutzstufeIi
        }
      ]
    }
  };

  // Selective Dismantling Mass Estimator Logic
  // Density constants in t/m³ (approximate bulk/solid values used in deconstruction engineering)
  const densities = {
    concrete: { concrete: 1.5, masonry: 0.1, wood: 0.05, metals: 0.06, plastics: 0.02, gypsum: 0.04, hazardous: 0.015, mixed: 0.08 },
    masonry: { concrete: 0.4, masonry: 1.2, wood: 0.08, metals: 0.04, plastics: 0.02, gypsum: 0.06, hazardous: 0.01, mixed: 0.09 },
    timber: { concrete: 0.2, masonry: 0.1, wood: 0.5, metals: 0.03, plastics: 0.03, gypsum: 0.12, hazardous: 0.025, mixed: 0.12 },
    composite: { concrete: 0.9, masonry: 0.6, wood: 0.08, metals: 0.08, plastics: 0.04, gypsum: 0.08, hazardous: 0.02, mixed: 0.14 }
  };

  const currentDensity = densities[structureType];
  const massConcrete = Math.round(buildingVolume * currentDensity.concrete);
  const massMasonry = Math.round(buildingVolume * currentDensity.masonry);
  const massWood = Math.round(buildingVolume * currentDensity.wood);
  const massMetals = Math.round(buildingVolume * currentDensity.metals);
  const massPlastics = Math.round(buildingVolume * currentDensity.plastics);
  const massGypsum = Math.round(buildingVolume * currentDensity.gypsum);
  const massHazardous = Math.round(buildingVolume * currentDensity.hazardous);
  const massMixed = Math.round(buildingVolume * currentDensity.mixed);

  const totalMass = massConcrete + massMasonry + massWood + massMetals + massPlastics + massGypsum + massHazardous + massMixed;
  const mineralPercentage = Math.round(((massConcrete + massMasonry) / (totalMass || 1)) * 100);

  return (
    <div className="space-y-8" id="rueckbau-modul">
      {/* Module Title Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-shiraz/10 text-shiraz text-xs font-bold uppercase px-2.5 py-1 rounded"><MdText text={inhalt.texte.zirkuläresBauenKreislaufwirtschaft} /></span>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.baukörperRückbauMaterial} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Systematische Entfrachtung, selektiver Abbruch und mineralische Aufbereitung nach den Richtlinien des 
              <strong><MdText text={inhalt.texte.bayerischenLandesamtesFürUmwelt} /></strong>. Aktualisiert mit den strengen Vorgaben der 
              <strong><MdText text={inhalt.texte.ersatzbaustoffverordnungEbv2023} /></strong>.
          </p>
        </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex-shrink-0">
            <ShieldCheck size={28} className="text-emerald-600" />
            <div>
              <div className="text-xs font-bold text-emerald-800"><MdText text={inhalt.texte.gesetzlicherStatus} /></div>
              <div className="text-xs font-medium text-emerald-700"><MdText text={inhalt.texte.bundesweitHarmonisiertEbv} /></div>
            </div>
          </div>
        </div>
        
        {/* Module Sub-navigation */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-home-grau/30 pt-4">
          <button aria-pressed={activeTab === 'lfu_leitfaden'}
            onClick={() => setActiveTab('lfu_leitfaden')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'lfu_leitfaden' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <BookOpen size={14} /><MdText text={inhalt.texte.lfuRückbauLeitfaden} /></button>
          <button aria-pressed={activeTab === 'schadstoffe'}
            onClick={() => setActiveTab('schadstoffe')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'schadstoffe' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <AlertTriangle size={14} /><MdText text={inhalt.texte.schadstoffErkundungVdi} /></button>
          <button aria-pressed={activeTab === 'baustoffrecycling'}
            onClick={() => setActiveTab('baustoffrecycling')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'baustoffrecycling' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <Recycle size={14} /> Baustoffrecycling
          </button>
          <button aria-pressed={activeTab === 'rechner'}
            onClick={() => setActiveTab('rechner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'rechner' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <Hammer size={14} /><MdText text={inhalt.texte.masseAbfallrechner} /></button>
          <button aria-pressed={activeTab === 'aktualitaet'}
            onClick={() => setActiveTab('aktualitaet')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'aktualitaet' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <Recycle size={14} /><MdText text={inhalt.texte.aktualitätsCheckEbv} /></button>
          <button aria-pressed={activeTab === 'praxis'}
            onClick={() => setActiveTab('praxis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <FileText size={14} /><MdText text={inhalt.texte.praxisSzenarienBehörden} /></button>
        </div>
      </div>

      {/* TAB 1: LfU Rückbau-Leitfaden */}
      {activeTab === 'lfu_leitfaden' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Timeline navigation Left (4 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
                <Clock size={16} className="text-shiraz" /><MdText text={inhalt.texte.phasenDesSelektivenRückbaus} /></h3>
              <p className="text-xs text-text-main/70 mb-4"><MdText text={inhalt.texte.derLfuLeitfadenEmpfiehlt} /></p>
              
              <div className="space-y-1">
                {processPhases.map((phase) => (
                  <button
                    key={phase.num}
                    onClick={() => setSelectedPhase(phase.num)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${
                      selectedPhase === phase.num
                        ? 'bg-shiraz/5 border-shiraz/50 shadow-sm'
                        : 'bg-off-white border-transparent hover:bg-home-grau/10'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      selectedPhase === phase.num ? 'bg-shiraz text-white' : 'bg-home-grau/20 text-text-main'
                    }`}>
                      {phase.num}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${selectedPhase === phase.num ? 'text-shiraz' : 'text-text-main'}`}>
                        {phase.title}
                      </h4>
                      <p className="text-xs text-text-main/60 mt-0.5 line-clamp-1">{phase.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <AlertTriangle size={14} className="text-amber-700" /><MdText text={inhalt.texte.getrennthaltungUndSchadstoffentfrachtung} /></h4>
              <p className="text-xs text-amber-800 leading-relaxed"><MdText text={inhalt.texte.bauschuttGiltAbfallrechtlichNach} /></p>
            </div>
          </div>

          {/* Details Right (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-home-grau/10">
                <span className="text-3xl font-extrabold text-shiraz/70">Phase 0{formatDeWert(selectedPhase)}</span>
                <div>
                  <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                    {processPhases[selectedPhase - 1].title}
                  </h3>
                  <span className="text-xs text-text-main/60 font-medium">
                    {processPhases[selectedPhase - 1].subtitle}
                  </span>
                </div>
              </div>

              <div className="space-y-4 my-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/70 mb-1">Beschreibung</h4>
                  <p className="text-xs text-text-main leading-relaxed bg-off-white p-3 rounded-lg border border-home-grau/10">
                    {processPhases[selectedPhase - 1].description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/70 mb-2"><MdText text={inhalt.texte.checklisteZurUmsetzung} /></h4>
                  <ul className="space-y-2">
                    {processPhases[selectedPhase - 1].checklists.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-text-main">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-home-grau/15 bg-slate-50 p-4 rounded-lg">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1 uppercase tracking-wider">
                <Info size={13} className="text-shiraz" /><MdText text={inhalt.texte.originalAnforderungLfuLeitfaden} /></h4>
              <p className="text-xs italic text-slate-700 font-medium leading-relaxed">
                "{processPhases[selectedPhase - 1].lfuStandard}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Schadstoff-Detektor */}
      {activeTab === 'schadstoffe' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/15 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-text-main">Epochen-Schadstoff-Matrix</h3>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
                  <p><MdText text={inhalt.texte.wählenSieDieBauwerksepoche} /></p>
                </div>
              </div>
              
              {/* Era selector tabs */}
              <div className="flex rounded-lg bg-off-white p-1 border border-home-grau/30">
                <button aria-pressed={selectedEra === 'pre1970'}
                  onClick={() => setSelectedEra('pre1970')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedEra === 'pre1970' ? 'bg-white shadow-sm text-shiraz' : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  Bis 1970
                </button>
                <button aria-pressed={selectedEra === 'era1970_1990'}
                  onClick={() => setSelectedEra('era1970_1990')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedEra === 'era1970_1990' ? 'bg-white shadow-sm text-shiraz' : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  1970 - 1990
                </button>
                <button aria-pressed={selectedEra === 'post1990'}
                  onClick={() => setSelectedEra('post1990')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedEra === 'post1990' ? 'bg-white shadow-sm text-shiraz' : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  Nach 1990
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Era summary card */}
              <div className="md:col-span-4 bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-shiraz mb-1">{eraPollutants[selectedEra].title}</h4>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-4">
                    {eraPollutants[selectedEra].description}
                  </p>
                </div>
                
                <div className="border-t border-home-grau/30 pt-3">
                  <h5 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2"><MdText text={inhalt.texte.dominierendeTragwerkstypen} /></h5>
                  <ul className="space-y-1">
                    {eraPollutants[selectedEra].dominantMaterials.map((mat, i) => (
                      <li key={i} className="text-xs text-text-main/70 flex items-center gap-1.5">
                        <ChevronRight size={12} className="text-shiraz" /> {mat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pollutants details view */}
              <div className="md:col-span-8 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/60">Schadstoff-Katasterkarten</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {eraPollutants[selectedEra].pollutants.map((pollutant, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h5 className="text-xs font-bold text-slate-800 leading-tight">{pollutant.name}</h5>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-bold uppercase ${
                            pollutant.probability === 'Sehr hoch' 
                              ? 'bg-red-100 text-red-800' 
                              : pollutant.probability === 'Hoch' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            Präsenz: {pollutant.probability}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">{pollutant.chemical}</p>
                        
                        <div className="mt-3 space-y-2">
                          <div>
                            <span className="text-xs font-bold text-text-main/60 block">Vorkommen:</span>
                            <span className="text-xs text-text-main leading-relaxed">{pollutant.foundIn}</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-text-main/60 block"><MdText text={inhalt.texte.sanierungDemontageschutz} /></span>
                            <span className="text-xs text-text-main leading-relaxed italic">{pollutant.handling}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-2 border-t border-home-grau/10 flex justify-between items-center bg-slate-50 -mx-4 -mb-4 p-2 px-4 rounded-b-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase">Regelwerk:</span>
                        <span className="text-xs font-mono font-bold text-shiraz">{pollutant.rules}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* TRGS Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 block"></span><MdText text={inhalt.texte.trgs519Asbest} /></h4>
              <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.regeltAbbruchSanierungsUnd} /></p>
            </div>
            <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600 block"></span><MdText text={inhalt.texte.trgs521Mineralfasern} /></h4>
              <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.regeltDenSchutzBei} /></p>
            </div>
            <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 block"></span><MdText text={inhalt.texte.trgs524Dguv101} /></h4>
              <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.sicherheitUndGesundheitsschutzBei} /></p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Baustoffrecycling */}
      {activeTab === 'baustoffrecycling' && (
        <BaustoffrecyclingTab setSelectedRecyclingMaterial={setSelectedRecyclingMaterial} selectedRecyclingMaterial={selectedRecyclingMaterial} />
      )}

      {/* TAB 3: Masse- & Abfallrechner */}
      {activeTab === 'rechner' && (
        <RechnerTab setBuildingVolume={setBuildingVolume} setStructureType={setStructureType} buildingVolume={buildingVolume} structureType={structureType} totalMass={totalMass} mineralPercentage={mineralPercentage} massConcrete={massConcrete} massMasonry={massMasonry} massWood={massWood} massMetals={massMetals} massGypsum={massGypsum} massPlastics={massPlastics} massHazardous={massHazardous} massMixed={massMixed} setShowCalculations={setShowCalculations} showCalculations={showCalculations} currentDensity={currentDensity} />
      )}

      {/* TAB 4: Aktualitäts-Check */}
      {activeTab === 'aktualitaet' && (
        <AktualitaetTab />
      )}

      {/* TAB 5: Praxis-Szenarien & Behördenwegweiser */}
      {activeTab === 'praxis' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bavaria specific workflow map */}
          <div className="md:col-span-4 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-1.5 pb-2 border-b border-home-grau/10">
              <FileCheck size={16} className="text-shiraz" /><MdText text={inhalt.texte.behördenwegweiserBayern} /></h3>
            <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.dieBauordnungsUndAbfallrechtliche} /></p>

            <div className="relative border-l border-shiraz pl-4 space-y-4 ml-2">
              <div className="relative">
                <span className="absolute -left-6 bg-shiraz text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.gemeindeBauordnungsamt} /></span>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.beseitigungBaulicherAnlagenNach} /></p>
        </div>
              <div className="relative">
                <span className="absolute -left-6 bg-shiraz text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.untereUmweltschutzbehörde} /></span>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.vorlageDesSchadstoffkatastersVdi} /></p>
              </div>
              <div className="relative">
                <span className="absolute -left-6 bg-shiraz text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.gewerbeaufsichtsamtGaa} /></span>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.anzeigeDerAsbesttätigkeitenMindestens} /></p>
              </div>
              <div className="relative">
                <span className="absolute -left-6 bg-shiraz text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.lfuAbfallregisterEanv} /></span>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.elektronischesNachweisverfahrenBegleitsc} /></p>
              </div>
            </div>
          </div>

          {/* Real-world Scenarios (8 cols) */}
          <div className="md:col-span-8 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
            <h3 className="text-sm font-bold text-text-main mb-4"><MdText text={inhalt.texte.typischeRückbaufehlerPitfallsAus} /></h3>
            
            <div className="space-y-4">
              <div className="border border-red-200 bg-red-50/20 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 block"></span><MdText text={inhalt.texte.schadstoffverschleppungImPutzAsbestfalle} /></h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-2"><MdText text={inhalt.texte.szenarioEinAltesBürogebäude} /></p>
                <div className="text-xs text-red-800 font-semibold bg-red-100/30 p-2 rounded"><MdText text={inhalt.texte.dieLfuKonsequenzOhne} /></div>
              </div>

              <div className="border border-orange-200 bg-orange-50/20 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 block"></span><MdText text={inhalt.texte.mangelhafteDokumentationDerGewabfv} /></h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-2"><MdText text={inhalt.texte.szenarioEinGeneralunternehmerMischt} /></p>
                <div className="text-xs text-orange-900 font-semibold bg-orange-100/30 p-2 rounded"><MdText text={inhalt.texte.dieKontrollreaktionDerDeponiebetreiber} /></div>
              </div>

              <div className="border border-blue-200 bg-blue-50/20 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 block"></span><MdText text={inhalt.texte.verwertungVonAsphaltIm} /></h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-2"><MdText text={inhalt.texte.szenarioAusbauasphaltAusEiner} /></p>
                <div className="text-xs text-indigo-900 font-semibold bg-blue-100/30 p-2 rounded"><MdText text={inhalt.texte.dieGesetzlicheHürdeEbv} /></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer references */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1MassenbilanzFür}
        zielGleichung="m_i = V_i \cdot \rho_i, \quad Q_{min} = \frac{\sum m_{min}}{\sum m_i}"
        schritte={inhalt.daten["Rueckbau.schritte"]}
        ergebnisHinweis={inhalt.werte.dieMineralischenFraktionenBestimmen}
        normQuelle={inhalt.werte.gewabfv8DinSpec}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2KostenvergleichSelektiver}
        zielGleichung="\Delta K = m \cdot (p_{Gemisch} - p_{getrennt}) - K_{Sortierung}"
        schritte={inhalt.daten["Rueckbau.schritte_2"]}
        ergebnisHinweis={inhalt.werte.regionaleAnnahmepreiseSchwankenStark}
        normQuelle={inhalt.werte.gewabfv89Vdi}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="rueckbau" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap9}
        wikipedia={[
          { title: inhalt.werte.rückbauBauwesen, url: 'https://de.wikipedia.org/wiki/R%C3%BCckbau' },
          { title: 'Ersatzbaustoffverordnung', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' },
          { title: 'Asbestsanierung', url: 'https://de.wikipedia.org/wiki/Asbestsanierung' }
        ]}
        literatur={inhalt.daten["Rueckbau.literatur"]}
        regelwerke={inhalt.daten["Rueckbau.regelwerke"]}
        formeln={inhalt.daten["Rueckbau.formeln"]}
      />
    </div>
  );
}
