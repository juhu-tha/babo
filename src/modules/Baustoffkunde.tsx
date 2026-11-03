import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Clock, Layers, AlertCircle, 
  ArrowRight, Landmark, Zap, ShieldCheck, TreePine, Construction, Hammer,
  User, Users
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/baustoffkunde/Baustoffkunde.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

interface HistoricalPeriod {
  era: string;
  century: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  materials: string[];
  milestone: string;
  details: string;
}

interface MaterialClass {
  id: string;
  name: string;
  icon: React.ReactNode;
  bgClass: string;
  borderClass: string;
  textClass: string;
  description: string;
  subclasses: string[];
  keyAttributes: { name: string; value: string }[];
  appLinkTab: string;
  appLinkName: string;
}

interface Pioneer {
  id: string;
  name: string;
  lifespan: string;
  role: string;
  field: string;
  origin: string;
  contribution: string;
  achievements: string[];
  quote: string;
}

const REITER = [
  { id: 'systematik', label: inhalt.texte.systematikFachordnung, icon: Layers },
  { id: 'historie', label: inhalt.texte.historischeEntwicklung, icon: Clock },
  { id: 'pioniere', label: inhalt.texte.bedeutendePioniere, icon: Users },
] as const;

export default function Baustoffkunde() {
  const [activeTab, setActiveTab] = useState<'systematik' | 'historie' | 'pioniere'>('systematik');
  const [selectedClass, setSelectedClass] = useState<string>('mineralisch');
  const [timelineEra, setTimelineEra] = useState<number>(0);
  const [selectedPioneer, setSelectedPioneer] = useState<string>('vitruv');

  // Pioneers mapping
  const pioneers: Pioneer[] = inhalt.daten["Baustoffkunde.pioneers"];

  // Material classification data
  const materialClasses: MaterialClass[] = [
    {
      id: 'mineralisch',
      name: inhalt.werte.anorganischMineralischeBaustoffe,
      icon: <Layers size={18} />,
      bgClass: 'bg-emerald-50/55 hover:bg-emerald-50/80',
      borderClass: 'border-emerald-200',
      textClass: 'text-emerald-800',
      description: inhalt.werte.gekennzeichnetDurchIonischeOder,
      subclasses: [
        inhalt.werte.natursteineGranitKalksteinSandstein,
        inhalt.werte.natürlicheUndKünstlicheGesteinskörnungen,
        inhalt.werte.anorganischeBindemittelZementBaukalk,
        inhalt.werte.mörtelMineralischerPutzUnd,
        inhalt.werte.gebrannteTonkeramikZiegelKlinker,
        inhalt.werte.betonNormalbetonPorenbetonLeichtbeton
      ],
      keyAttributes: inhalt.daten["Baustoffkunde.materialClasses.mineralisch.keyAttributes"],
      appLinkTab: 'gesteine',
      appLinkName: inhalt.werte.gesteineMauerwerkBeton
    },
    {
      id: 'metallisch',
      name: inhalt.werte.anorganischMetallischeBaustoffe,
      icon: <Construction size={18} />,
      bgClass: 'bg-blue-50/55 hover:bg-blue-50/80',
      borderClass: 'border-blue-200',
      textClass: 'text-blue-800',
      description: inhalt.werte.aufgebautAusMetallischenBindungen,
      subclasses: [
        inhalt.werte.baustähleZBS235,
        inhalt.werte.betonstahlRippenstahlB500bZur,
        inhalt.werte.edelstahlNichtrostendeLegierungenIm,
        inhalt.werte.gusseisenHistorischeTrägerAbwasserrohre,
        inhalt.werte.nichteisenmetalleAluminiumKupferZink
      ],
      keyAttributes: inhalt.daten["Baustoffkunde.materialClasses.metallisch.keyAttributes"],
      appLinkTab: 'metalle',
      appLinkName: inhalt.werte.metalleTragverhalten
    },
    {
      id: 'organisch',
      name: inhalt.werte.organischeBiogeneBaustoffe,
      icon: <TreePine size={18} />,
      bgClass: 'bg-amber-50/55 hover:bg-amber-50/80',
      borderClass: 'border-amber-200',
      textClass: 'text-amber-800',
      description: inhalt.werte.nachwachsendeOrganischeWerkstoffeAus,
      subclasses: [
        inhalt.werte.vollholzNadelUndLaubholz,
        inhalt.werte.holzwerkstoffeBrettschichtholzBshBrettsp,
        inhalt.werte.natürlicheDämmstoffeHolzfaserZellulose,
        inhalt.werte.lehmHolzVerbundeHistorischer,
        inhalt.werte.biokunststoffeUndBioBasierte
      ],
      keyAttributes: inhalt.daten["Baustoffkunde.materialClasses.organisch.keyAttributes"],
      appLinkTab: 'holz_werkstoffe',
      appLinkName: inhalt.werte.holzNachwachsendeRohstoffe
    },
    {
      id: 'polymere',
      name: inhalt.werte.synthetischePolymereBitumen,
      icon: <Zap size={18} />,
      bgClass: 'bg-indigo-50/55 hover:bg-indigo-50/80',
      borderClass: 'border-indigo-200',
      textClass: 'text-indigo-800',
      description: inhalt.werte.riesenmoleküleMakromoleküleAusKovalent,
      subclasses: [
        inhalt.werte.kunststoffDämmstoffeExpandiertesPolystyr,
        inhalt.werte.folienDampfbremsenKunststoffAbdichtungsb,
        inhalt.werte.fassadenbekleidungenUndRohrleitungssyste,
        inhalt.werte.bautenklebstoffeKunstharzeUndVersiegelun,
        inhalt.werte.bitumenUndPolymerModifiziertes
      ],
      keyAttributes: inhalt.daten["Baustoffkunde.materialClasses.polymere.keyAttributes"],
      appLinkTab: 'daemmstoffe',
      appLinkName: inhalt.werte.dämmstoffeBaupolymere
    },
    {
      id: 'verbund',
      name: inhalt.werte.moderneVerbundwerkstoffe,
      icon: <Hammer size={18} />,
      bgClass: 'bg-rose-50/55 hover:bg-rose-50/80',
      borderClass: 'border-rose-200',
      textClass: 'text-rose-800',
      description: inhalt.werte.makroskopischerVerbundVonMindestens,
      subclasses: [
        inhalt.werte.klassischerStahlbetonBetonTrägt,
        inhalt.werte.stahlfaserbetonUndMakrosynthetischeFaser,
        inhalt.werte.zukunftsweisenderCarbonbetonKorrosionsfr,
        inhalt.werte.glasfaserverstärkteKunststoffeGfkFür,
        inhalt.werte.faserzementplattenBisZumVerbot
      ],
      keyAttributes: inhalt.daten["Baustoffkunde.materialClasses.verbund.keyAttributes"],
      appLinkTab: 'faserverbund',
      appLinkName: inhalt.werte.faserCarbonverbund
    }
  ];

  // History periods timelines
  const historicalPeriods: HistoricalPeriod[] = [
    {
      era: inhalt.werte.prähistorieBis3000V,
      century: inhalt.werte.steinBronzezeit,
      title: inhalt.werte.dieÄraDerNaturstoffe,
      description: inhalt.werte.konstruktionenErfolgtenReinMit,
      icon: <TreePine className="text-amber-700 font-bold" size={20} />,
      materials: [inhalt.werte.lehmStampflehm, inhalt.werte.natursteinTrocken, inhalt.werte.schilfStroh, 'Rundholz'],
      milestone: inhalt.werte.luftgetrockneteLehmziegelAbDem,
      details: inhalt.werte.dieErstenBehausungenNutzten
    },
    {
      era: inhalt.werte.antike300VChr,
      century: inhalt.werte.römischesReich,
      title: inhalt.werte.dieErfindungDesOpus,
      description: inhalt.werte.dieRömerPrägtenDie,
      icon: <Landmark className="text-indigo-700" size={20} />,
      materials: inhalt.daten["Baustoffkunde.historicalPeriods.1.materials"],
      milestone: inhalt.werte.kuppelDesPantheonsIn,
      details: inhalt.werte.dasOpusCaementiciumBestand
    },
    {
      era: inhalt.werte.mittelalterRenaissanceCa500,
      century: inhalt.werte.t518Jahrhundert,
      title: inhalt.werte.zunftwesenUndHandwerklichesErfahrungswis,
      description: inhalt.werte.nachDemFallRoms,
      icon: <Hammer className="text-slate-600" size={20} />,
      materials: [inhalt.werte.sanfteLuftkalke, 'Gipsmörtel', inhalt.werte.eichenUndTannenholz, inhalt.werte.handgestricheneZiegel],
      milestone: inhalt.werte.konstruktionGotischerKathedralenMit,
      details: inhalt.werte.fachwerkbautenDominiertenDieMitteleuropä
    },
    {
      era: inhalt.werte.industrielleRevolution19Jahrhundert,
      century: '1800 - 1899',
      title: inhalt.werte.dasPatentVonPortlandzement,
      description: inhalt.werte.mitDemBeginnDer,
      icon: <Zap className="text-amber-500" size={20} />,
      materials: inhalt.daten["Baustoffkunde.historicalPeriods.3.materials"],
      milestone: inhalt.werte.t1824PatentiertJosephAspdin,
      details: inhalt.werte.durchExtremHohesBrennen
    },
    {
      era: inhalt.werte.moderne20Jahrhundert,
      century: '1900 - 1999',
      title: inhalt.werte.hochleistungsbaustoffeUndNormierung,
      description: inhalt.werte.dasJahrhundertDesUneingeschränkten,
      icon: <GraduationCap className="text-blue-600" size={20} />,
      materials: inhalt.daten["Baustoffkunde.historicalPeriods.4.materials"],
      milestone: inhalt.werte.bauWeitgespannterSpannbetonbrückenUnd,
      details: inhalt.werte.mitFließmittelnPolycarboxylatetherPce
    },
    {
      era: inhalt.werte.anthropozänZukunft21Jahrhundert,
      century: 'Seit 2000',
      title: inhalt.werte.dekarbonisierungZirkuläresBauen,
      description: inhalt.werte.bauUndBetriebVon,
      icon: <ShieldCheck className="text-emerald-600 font-bold" size={20} />,
      materials: inhalt.daten["Baustoffkunde.historicalPeriods.5.materials"],
      milestone: inhalt.werte.erstesCarbonbetongebäudeCubeTu,
      details: inhalt.werte.dieCoNeutraleBaustoffkunde
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* 1. MODULE MAIN CARD IN ACCORDANCE WITH THE STYLEGUIDE */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <BookOpen className="text-shiraz" /> Baustoffkunde
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 mt-4">
          <p><MdText text={inhalt.texte.dieWissenschaftlicheLehreVon} /></p>
        </div>

        {/* Pure styling tab navigation to match Kalk.tsx */}
        <ModuleTabs label="Bereiche Baustoffkunde" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6">

        {/* 2. DYNAMIC CONTENT AREA BASED ON TAB */}
        
        {activeTab === 'systematik' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Big Concept Intro Card */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-text-main flex items-center gap-2 mb-2 font-mono">
                <GraduationCap className="text-shiraz" size={16} /><MdText text={inhalt.texte.wasUntersuchtDieBaustoffkunde} /></h2>
              <p className="text-xs text-text-main/80 leading-relaxed max-w-4xl"><MdText text={inhalt.texte.dasFachgebietVerknüpftDie} /></p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                <div className="p-3.5 bg-off-white border border-home-grau/20 rounded-xl space-y-1">
                  <span className="text-[10px] font-extrabold text-[#A3113E] uppercase tracking-wider block font-mono"><MdText text={inhalt.texte.t1PhysikalischeKriterien} /></span>
                  <p className="text-[10.5px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.porengrößenverteilungRohUndReindichte} /></p>
                </div>
                <div className="p-3.5 bg-off-white border border-home-grau/20 rounded-xl space-y-1">
                  <span className="text-[10px] font-extrabold text-[#A3113E] uppercase tracking-wider block font-mono"><MdText text={inhalt.texte.t2MechanischeParameter} /></span>
                  <p className="text-[10.5px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.zusammenhangZwischenBelastungsrichtungSp} /></p>
                </div>
                <div className="p-3.5 bg-off-white border border-home-grau/20 rounded-xl space-y-1">
                  <span className="text-[10px] font-extrabold text-[#A3113E] uppercase tracking-wider block font-mono"><MdText text={inhalt.texte.t3ChemischeEinflüsse} /></span>
                  <p className="text-[10.5px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.hydratationsreaktionenVonAnorganischenBi} /></p>
                </div>
                <div className="p-3.5 bg-off-white border border-home-grau/20 rounded-xl space-y-1">
                  <span className="text-[10px] font-extrabold text-[#A3113E] uppercase tracking-wider block font-mono"><MdText text={inhalt.texte.t4ÖkologischeBilanz} /></span>
                  <p className="text-[10.5px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.epdsPrimärenergiegehaltKlinkerZusatzstof} /></p>
                </div>
              </div>
            </div>

            {/* Interactive Classes Explorer layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Left Column: List of Classes selector */}
              <AuswahlGruppe label="Stoffgruppe" className="lg:col-span-5 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#A3113E] font-mono mb-1 ml-1 block">
                  Stoffgruppen-Systematik
                </span>
                {materialClasses.map((item) => {
                  const isActive = selectedClass === item.id;
                  return (
                    <button {...alsOption(isActive)}
                      key={item.id}
                      onClick={() => setSelectedClass(item.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                        isActive 
                          ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/10'
                          : 'border-home-grau/30 bg-white hover:border-home-grau/50 hover:bg-off-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border transition-transform group-hover:scale-105 ${
                          isActive
                            ? 'bg-shiraz text-white border-shiraz'
                            : 'bg-off-white text-text-main border-home-grau/30'
                        }`}>
                          {item.icon}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-text-main block leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[9px] text-text-main/70 block mt-0.5 font-sans font-normal leading-tight">
                            {item.subclasses.length}<MdText text={inhalt.texte.bedeutendeUntergruppen} /></span>
                        </div>
                      </div>
                      <ArrowRight size={14} className={`text-text-main/50 transition-transform ${
                        isActive ? 'translate-x-1 text-shiraz' : 'group-hover:translate-x-0.5'
                      }`} />
                    </button>
                  );
                })}
              </AuswahlGruppe>

              {/* Right Column: Deep-Dive View */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                {(() => {
                  const item = materialClasses.find(c => c.id === selectedClass)!;
                  return (
                    <div className="space-y-4 h-full flex flex-col justify-between">
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-home-grau/20">
                          <div className="p-2 rounded-xl bg-off-white text-text-main border border-home-grau/30">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-text-main leading-none">{item.name}</h3>
                            <span className="text-[9.5px] font-mono text-shiraz font-bold block mt-1">Stoffklasse-DeepDive</span>
                          </div>
                        </div>

                        <p className="text-xs text-text-main/80 bg-off-white p-3 rounded-lg border border-home-grau/20 italic">
                          "{item.description}"
                        </p>

                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-text-main/50 block font-mono"><MdText text={inhalt.texte.wichtigsteUnterklassenBeispiele} /></span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {item.subclasses.map((sub, sIdx) => (
                              <div key={sIdx} className="text-xs text-text-main/80 flex items-center gap-2 bg-off-white p-2 rounded-lg hover:bg-slate-100/40 border border-home-grau/20 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-shiraz shrink-0"></span>
                                <span className="truncate">{sub}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-text-main/50 block font-mono"><MdText text={inhalt.texte.typischeMaterialEigenschaften} /></span>
                          <div className="grid grid-cols-2 gap-2">
                            {item.keyAttributes.map((attr, aIdx) => (
                              <div key={aIdx} className="bg-[#fcf8f2] p-2.5 rounded-lg border border-home-grau/25 space-y-0.5">
                                <span className="text-[9.5px] text-text-main/60 font-extrabold uppercase tracking-tight block font-mono leading-none">{attr.name}</span>
                                <span className="text-xs text-text-main block font-bold mt-1 font-sans">{attr.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-home-grau/20 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] bg-off-white/50 -mx-5 -mb-5 p-4 rounded-b-2xl border-t border-home-grau/20">
                        <div className="flex items-center gap-1.5 text-text-main/70">
                          <AlertCircle size={13} className="text-text-main/50 shrink-0" />
                          <span><MdText text={inhalt.texte.verfügbarInDenRechnern} /></span>
                        </div>
                        <span className="text-shiraz font-bold font-mono tracking-wide bg-shiraz/5 px-2 py-1 rounded inline-flex items-center gap-1 border border-shiraz/10">
                          Sektion: {item.appLinkName}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Hierarchy of Materials Science Diagram (Bento Element) */}
            <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#A3113E] font-mono mb-2"><MdText text={inhalt.texte.dasSkalenPrinzipIn} /></h3>
              <p className="text-xs text-text-main/80 mb-4 max-w-3xl leading-relaxed"><MdText text={inhalt.texte.dieEigenschaftenDieWir} /></p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 hover:shadow-sm transition-shadow">
                  <span className="text-[9px] font-extrabold text-[#A3113E] font-mono tracking-widest uppercase block mb-1"><MdText text={inhalt.texte.t1MakrokosmosBauteil} /></span>
                  <span className="text-xs font-bold text-text-main block mt-1"><MdText text={inhalt.texte.trägerWandBrücke} /></span>
                  <span className="text-[10px] text-text-main/70 block mt-1 font-sans"><MdText text={inhalt.texte.abmessungenInMeternSichtbare} /></span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 hover:shadow-sm transition-shadow">
                  <span className="text-[9px] font-extrabold text-[#A3113E] font-mono tracking-widest uppercase block mb-1"><MdText text={inhalt.texte.t2MesokosmosGefüge} /></span>
                  <span className="text-xs font-bold text-text-main block mt-1"><MdText text={inhalt.texte.gesteinskörnungZementstein} /></span>
                  <span className="text-[10px] text-text-main/70 block mt-1 font-sans"><MdText text={inhalt.texte.millimeterBisMikrometerHaftverbundzone} /></span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 hover:shadow-sm transition-shadow">
                  <span className="text-[9px] font-extrabold text-[#A3113E] font-mono tracking-widest uppercase block mb-1"><MdText text={inhalt.texte.t3MikrokosmosKristall} /></span>
                  <span className="text-xs font-bold text-text-main block mt-1"><MdText text={inhalt.texte.cshGeleEttringit} /></span>
                  <span className="text-[10px] text-text-main/70 block mt-1 font-sans"><MdText text={inhalt.texte.nanometerBereichKristallinePlatten} /></span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-home-grau/30 hover:shadow-sm transition-shadow">
                  <span className="text-[9px] font-extrabold text-[#A3113E] font-mono tracking-widest uppercase block mb-1"><MdText text={inhalt.texte.t4SubMikroAtomar} /></span>
                  <span className="text-xs font-bold text-text-main block mt-1"><MdText text={inhalt.texte.ionenAtombindung} /></span>
                  <span className="text-[10px] text-text-main/70 block mt-1 font-sans"><MdText text={inhalt.texte.angströmBereichKovalenteMetallische} /></span>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'historie' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* History Intro */}
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2 flex items-center gap-2">
                <Clock size={18} /><MdText text={inhalt.texte.geschichtlicherAufrissDerWerkstoffevolut} /></h3>
              <p className="text-xs text-text-main/80 leading-relaxed max-w-4xl"><MdText text={inhalt.texte.dieGeschichteDesBauens} /></p>
            </div>

            {/* Interactive Timeline layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left selector - Era names */}
              <div className="lg:col-span-4 space-y-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#A3113E] font-mono mb-1 ml-1 block">
                  Epochenauswahl
                </span>
                {historicalPeriods.map((p, idx) => {
                  const isActive = timelineEra === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setTimelineEra(idx)}
                      className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col ${
                        isActive
                          ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/10'
                          : 'border-home-grau/30 bg-white hover:border-home-grau/55 hover:bg-off-white'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[9px] font-black uppercase tracking-wider font-mono text-shiraz">
                          {p.century}
                        </span>
                        {isActive && <span className="text-[9px] bg-shiraz text-white rounded px-1 font-extrabold">Aktiv</span>}
                      </div>
                      <span className="text-xs font-extrabold text-text-main mt-1 block">
                        {p.era}
                      </span>
                      <span className="text-[10px] text-text-main/70 block truncate mt-0.5 leading-tight">
                        {p.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Display area - selected Period Details */}
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm space-y-5">
                {(() => {
                  const p = historicalPeriods[timelineEra];
                  return (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-start justify-between border-b border-home-grau/20 pb-3 gap-2">
                        <div className="space-y-1">
                          <span className="text-[9.5px] uppercase font-black tracking-widest text-shiraz font-mono block">
                            {p.century}
                          </span>
                          <h3 className="text-base font-extrabold text-text-main mt-1 leading-tight">{p.era}</h3>
                          <span className="text-xs text-text-main/70 font-medium block italic">{p.title}</span>
                        </div>
                        <div className="p-3 bg-off-white border border-home-grau/30 rounded-2xl shrink-0 text-text-main shadow-xs">
                          {p.icon}
                        </div>
                      </div>

                      <p className="text-xs text-text-main/80 leading-relaxed font-sans mt-2">
                        {p.details}
                      </p>

                      {/* Timeline Materials Chips */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-text-main/55 block font-mono"><MdText text={inhalt.texte.prägendeMaterialienDieserEpoche} /></span>
                        <div className="flex flex-wrap gap-1.5">
                          {p.materials.map((mat, mIdx) => (
                            <span key={mIdx} className="bg-off-white border border-home-grau/30 text-text-main text-[10.5px] font-bold px-2.5 py-1 rounded-lg shadow-xxs">
                              🧱 {mat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Milestone Highlights banner */}
                      <div className="bg-shiraz/5 border border-shiraz/20 p-4 rounded-xl flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-shiraz/10 border border-shiraz/30 text-shiraz mt-0.5">
                          <ShieldCheck size={14} />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black uppercase text-shiraz block font-mono"><MdText text={inhalt.texte.schlüsselMeilenstein} /></span>
                          <p className="text-xs text-text-main font-semibold leading-relaxed font-sans">{p.milestone}</p>
                        </div>
                      </div>

                      <div className="bg-[#fcf8f2] p-3.5 rounded-xl border border-home-grau/35">
                        <span className="text-[9.5px] font-bold uppercase tracking-wide text-text-main/70 block font-mono"><MdText text={inhalt.texte.bedeutungFürDieBaustoffkunde} /></span>
                        <p className="text-[11px] text-text-main/80 leading-relaxed mt-1 font-sans font-normal">{p.description}</p>
                      </div>

                    </div>
                  );
                })()}
              </div>

            </div>

          </div>
        )}

        {activeTab === 'pioniere' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Pioniere Intro */}
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2 flex items-center gap-2">
                <Users size={18} /><MdText text={inhalt.texte.wegbereiterVäterDerWerkstoffwissenschaft} /></h3>
              <p className="text-xs text-text-main/80 leading-relaxed max-w-4xl"><MdText text={inhalt.texte.hinterJedemModernenHochleistungsbaustoff} /></p>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Left side: List of Pioneers */}
              <div className="lg:col-span-5 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#A3113E] font-mono mb-1 ml-1 block">
                  Pionier-Verzeichnis
                </span>
                <AuswahlGruppe label="Pionier" className="space-y-2">
                  {pioneers.map((p) => {
                    const isActive = selectedPioneer === p.id;
                    return (
                      <button {...alsOption(isActive)}
                        key={p.id}
                        onClick={() => setSelectedPioneer(p.id)}
                        className={`w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                          isActive
                            ? 'border-shiraz bg-shiraz/5 ring-2 ring-shiraz/10'
                            : 'border-home-grau/30 bg-white hover:border-home-grau/50 hover:bg-off-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border transition-transform group-hover:scale-105 ${
                            isActive
                              ? 'bg-shiraz text-white border-shiraz'
                              : 'bg-off-white text-text-main border-home-grau/30'
                          }`}>
                            <User size={16} />
                          </div>
                          <div>
                            <span className="text-xs font-black text-text-main block leading-tight">
                              {p.name}
                            </span>
                            <span className="text-[9.5px] text-text-main/70 block mt-0.5 leading-tight">
                              {p.lifespan} • {p.origin}
                            </span>
                          </div>
                        </div>
                        <ArrowRight size={13} className={`text-text-main/50 transition-transform ${
                          isActive ? 'translate-x-1 text-shiraz' : 'group-hover:translate-x-0.5'
                        }`} />
                      </button>
                    );
                  })}
                </AuswahlGruppe>
              </div>

              {/* Right side: Detailed Showcase */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                {(() => {
                  const p = pioneers.find(item => item.id === selectedPioneer)!;
                  return (
                    <div className="space-y-4 h-full flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between border-b border-home-grau/20 pb-3 gap-2">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-wider font-mono text-shiraz bg-shiraz/5 border border-shiraz/20 px-2.5 py-0.5 rounded-full inline-block">
                              {p.role}
                            </span>
                            <h3 className="text-base font-extrabold text-text-main leading-tight mt-1.5">{p.name}</h3>
                            <span className="text-[11px] text-text-main/70 block font-medium">
                              🌍 {p.origin} ({p.lifespan})
                            </span>
                          </div>
                          <div className="p-3 bg-off-white border border-home-grau/30 rounded-2xl shrink-0 text-shiraz shadow-xs font-mono text-xs font-bold">
                            💡
                          </div>
                        </div>

                        {/* Breakthrough box */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-text-main/50 block font-mono"><MdText text={inhalt.texte.forschungsgebietBeitrag} /></span>
                          <p className="text-xs text-text-main font-semibold leading-relaxed bg-off-white p-3.5 rounded-xl border border-home-grau/20 font-sans">
                            {p.field}
                          </p>
                        </div>

                        {/* Core contribution */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-text-main/50 block font-mono"><MdText text={inhalt.texte.wissenschaftlicherDurchbruch} /></span>
                          <p className="text-xs text-text-main/80 leading-relaxed font-sans font-normal">
                            {p.contribution}
                          </p>
                        </div>

                        {/* Achievements */}
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] uppercase font-bold text-text-main/50 block font-mono"><MdText text={inhalt.texte.spezifischeMeilensteineErrungenschaften} /></span>
                          <div className="space-y-2">
                            {p.achievements.map((ach, aIdx) => (
                              <div key={aIdx} className="text-xs text-text-main/80 flex items-start gap-2.5 bg-[#fcf8f2] p-3 rounded-xl border border-home-grau/20">
                                <span className="w-5 h-5 rounded-full bg-white border border-home-grau/30 text-text-main flex items-center justify-center text-[9.5px] font-mono shrink-0 font-bold">
                                  {formatDeWert(aIdx + 1)}
                                </span>
                                <span className="leading-relaxed">{ach}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Famous quote */}
                      <div className="bg-[#fcf8f2] text-text-main/90 p-4 rounded-xl border border-home-grau/30 italic text-[11px] leading-relaxed relative overflow-hidden mt-4 shadow-sm">
                        <div className="absolute -right-2 -bottom-4 text-shiraz/10 font-serif text-5xl select-none font-bold">“</div>
                        <p className="relative z-10 text-text-main/80">
                          {p.quote}
                        </p>
                      </div>

                    </div>
                  );
                })()}
              </div>

            </div>

          </div>
        )}
        </ModuleTabs>

      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="baustoffkunde" />

      {/* 3. CORE VALUE MODULE FOOTER */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Werkstoffkunde', url: 'https://de.wikipedia.org/wiki/Materialwissenschaft_und_Werkstofftechnik' },
          { title: 'Baustoff', url: 'https://de.wikipedia.org/wiki/Baustoff' },
          { title: inhalt.werte.opusCaementicium, url: 'https://de.wikipedia.org/wiki/Opus_caementicium' },
          { title: 'Portlandzement', url: 'https://de.wikipedia.org/wiki/Portlandzement' }
        ]}
        literatur={inhalt.daten["Baustoffkunde.literatur"]}
        regelwerke={inhalt.daten["Baustoffkunde.regelwerke"]}
        formeln={inhalt.daten["Baustoffkunde.formeln"]}
        lastReviewed={inhalt.werte.oktober2026Ap3}
      />

    </div>
  );
}
