import type { LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import { 
  Info, 
  Layers, 
  Factory, 
  Calculator, 
  Waves, 
  Network, 
  Droplets, 
  Box, 
  ClipboardCheck, 
  BookOpen,
  FileText,
  UserCheck,
  Compass,
  Globe,
  GraduationCap,
  ShieldAlert,
  Activity,
  BarChart3,
  History,
  Sliders,
  Grid
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import ModuleHistoryView from '@/src/components/ui/ModuleHistoryView';
import ModuleOverviewView from '@/src/components/ui/ModuleOverviewView';
import { MODULE_HISTORY_DATA } from '@/src/data/moduleHistoryData';
import inhalt from '@/content/betoninfo/BetonInfo.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

interface SubmoduleCard {
  title: string;
  icon: LucideIcon;
  purpose: string;
  standards: string;
  useCase: string;
}

export default function BetonInfo() {
  const [activeSection, setActiveSection] = useState<'grundlagen' | 'ueberblick' | 'inhalte' | 'anwendung' | 'weiterfuehrend' | 'historie'>('grundlagen');

  const submodules: SubmoduleCard[] = [
    {
      title: 'Beton A-Z',
      icon: BookOpen,
      purpose: inhalt.werte.integriertesNachschlagewerkFürFachbegrif,
      standards: inhalt.werte.dinEn206Allgemeines,
      useCase: inhalt.werte.schnellesKlärenVonBegriffsdefinitionen
    },
    {
      title: 'Ausgangsstoffe',
      icon: Layers,
      purpose: inhalt.werte.ausgangsstoffeDesBetonsZementarten,
      standards: inhalt.werte.dinEn1971,
      useCase: inhalt.werte.auswahlDerAusgangsstoffeFür
    },
    {
      title: 'Bindemittel',
      icon: Factory,
      purpose: inhalt.werte.chemischerAufbauHydratationskinetikUnd,
      standards: inhalt.werte.dinEn19712,
      useCase: inhalt.werte.bewertungDerPuzzolanischenReaktion
    },
    {
      title: 'Mischungsberechnung',
      icon: Calculator,
      purpose: inhalt.werte.interaktiverEntwurfsUndOptimierungsrechn,
      standards: inhalt.werte.deutscheBauchemieEV,
      useCase: inhalt.werte.berechnungVonZementbedarfWasserverbrauch
    },
    {
      title: inhalt.werte.herstellungEinbau,
      icon: Factory,
      purpose: inhalt.werte.baustellennahesPraxiswissenÜberDie,
      standards: inhalt.werte.dinEn206Ztv,
      useCase: inhalt.werte.richtigeFestlegungDerEinbau
    },
    {
      title: 'Frischbeton',
      icon: Waves,
      purpose: inhalt.werte.prüfverfahrenZurCharakterisierungDer,
      standards: inhalt.werte.dinEn123502,
      useCase: inhalt.werte.normgerechteQualitätskontrolleAufDer
    },
    {
      title: inhalt.werte.hydratationFolgen,
      icon: Network,
      purpose: inhalt.werte.visualisierungExothermerHydratationswärm,
      standards: inhalt.werte.dafstbRichtlinienFürMassige,
      useCase: inhalt.werte.ermittlungDesRissrisikosInfolge
    },
    {
      title: 'Nachbehandlung',
      icon: Droplets,
      purpose: inhalt.werte.auswahlDerNachbehandlungsmethodenUnd,
      standards: inhalt.werte.din10453Bauausführung,
      useCase: inhalt.werte.ermittlungDerNotwendigenTage
    },
    {
      title: 'Festbeton',
      icon: Box,
      purpose: inhalt.werte.physikalischMechanischeEigenschaftenDes,
      standards: inhalt.werte.dinEn123903,
      useCase: inhalt.werte.berechnungDesZeitlichenFestigkeitszuwach
    },
    {
      title: inhalt.werte.betonkennwerteEc2,
      icon: Sliders,
      purpose: inhalt.werte.vollständigeBerechnungAllerBetonkennwert,
      standards: inhalt.werte.dinEn19921,
      useCase: inhalt.werte.ermittlungVonEndkriechzahlPhi
    },
    {
      title: 'Sonderbetone',
      icon: Layers,
      purpose: inhalt.werte.kompakteDarstellungenVonSpezialbaustoffe,
      standards: inhalt.werte.dinEn206Anhang,
      useCase: inhalt.werte.materialauswahlFürInnovativeTragwerke
    },
    {
      title: 'Entwicklungen',
      icon: Network,
      purpose: inhalt.werte.technologischeMeilensteineWieCarbon,
      standards: inhalt.werte.allgBauaufsichtlicheZulassungenAbz,
      useCase: inhalt.werte.einarbeitungInCo2Reduzierten
    },
    {
      title: 'Qualitätssicherung',
      icon: ClipboardCheck,
      purpose: inhalt.werte.konformitätsbewertungenÜbereinstimmungsn,
      standards: inhalt.werte.dinEn206Konformitätskontrolle,
      useCase: inhalt.werte.festlegungVonPrüfbeauftragtenProbenanzah
    },
    {
      title: inhalt.werte.expositionsklassenDinEn206,
      icon: Grid,
      purpose: inhalt.werte.normativeGrenzwerteFürAlle,
      standards: inhalt.werte.dinEn206Din,
      useCase: inhalt.werte.sichereDauerhaftigkeitsbemessungHüllwert
    },
    {
      title: 'Betonpraxis',
      icon: ClipboardCheck,
      purpose: inhalt.werte.interaktiveRechentoolsBeständigkeitenVon,
      standards: inhalt.werte.praxisleitfädenVonDbvUnd,
      useCase: inhalt.werte.schnellcheckDerChemischenBeständigkeit
    },
    {
      title: 'Sicherheitskonzept',
      icon: Activity,
      purpose: inhalt.werte.semiprobabilistischesSicherheitskonzeptT,
      standards: inhalt.werte.dinEn1990Din,
      useCase: inhalt.werte.bestimmungDerBemessungswerteVon
    },
    {
      title: inhalt.werte.schadreaktionenImBeton,
      icon: ShieldAlert,
      purpose: inhalt.werte.detaillierteAnalyseBetoninternerSchadens,
      standards: inhalt.werte.dafstbAlkaliRichtlinieDin,
      useCase: inhalt.werte.vermeidungVonAkrGefahren
    },
    {
      title: inhalt.werte.festbetonStatistik,
      icon: BarChart3,
      purpose: inhalt.werte.statistischeQualitätsUndKonformitätsüber,
      standards: inhalt.werte.dinEn206Iso,
      useCase: inhalt.werte.konformitätsnachweisDerCharakteristische
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-shiraz/10 rounded-xl text-shiraz">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.modulBetontechnologie} /></h2>
              <p className="text-sm text-text-main/70"><MdText text={inhalt.texte.wissenschaftlicheLeitgrundlageDidaktikUn} /></p>
            </div>
          </div>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
            <p><MdText text={inhalt.texte.wissenschaftlicheLeitgrundlageDidaktikUn2} /></p>
          </div>
        </div>

        {/* SECTION TABS */}
        <div className="border-b border-home-grau/30 bg-slate-50/30 p-4">
          <ReiterLeiste label="Bereiche Beton" className="flex flex-wrap gap-2">
            <button {...alsReiter(activeSection === 'grundlagen', 'beton-info-bereich', 'grundlagen')}
              onClick={() => setActiveSection('grundlagen')}
              className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'grundlagen'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white border border-home-grau/30 hover:border-shiraz text-text-main'
              }`}
            >
              <Info size={15} />
              Grundlagen
            </button>
            <button {...alsReiter(activeSection === 'ueberblick', 'beton-info-bereich', 'ueberblick')}
              onClick={() => setActiveSection('ueberblick')}
              className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'ueberblick'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white border border-home-grau/30 hover:border-shiraz text-text-main'
              }`}
            >
              <Compass size={15} />
              Überblick
            </button>
            <button {...alsReiter(activeSection === 'inhalte', 'beton-info-bereich', 'inhalte')}
              onClick={() => setActiveSection('inhalte')}
              className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'inhalte'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white border border-home-grau/30 hover:border-shiraz text-text-main'
              }`}
            >
              <BookOpen size={15} />
              Inhalte
            </button>
            <button {...alsReiter(activeSection === 'anwendung', 'beton-info-bereich', 'anwendung')}
              onClick={() => setActiveSection('anwendung')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                activeSection === 'anwendung'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white border border-home-grau/30 hover:border-shiraz text-text-main'
              }`}
            >
              <UserCheck size={16} />
              Anwendung
            </button>
            <button {...alsReiter(activeSection === 'weiterfuehrend', 'beton-info-bereich', 'weiterfuehrend')}
              onClick={() => setActiveSection('weiterfuehrend')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                activeSection === 'weiterfuehrend'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white border border-home-grau/30 hover:border-shiraz text-text-main'
              }`}
            >
              <Compass size={16} />
              Weiterführend
            </button>
            <button {...alsReiter(activeSection === 'historie', 'beton-info-bereich', 'historie')}
              onClick={() => setActiveSection('historie')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                activeSection === 'historie'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white border border-home-grau/30 hover:border-shiraz text-text-main'
              }`}
            >
              <History size={16} />
              Historie
            </button>
          </ReiterLeiste>
        </div>

        {/* CONTENT PANEL */}
        <div className="p-6">
          {activeSection === 'grundlagen' && (
            <div {...reiterPanel('beton-info-bereich', activeSection)} className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <FileText className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.wissenschaftlicheGrundlagenDerBetontechn} /></h3>
                <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.betontechnologieBefasstSichMit} /></p>
                <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.zielIstEsDen} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-home-grau/20 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.hydratationsUndGefügechemie} /></h4>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.erhärtungsreaktionenCSH} /></p>
                </div>
                <div className="p-4 bg-slate-50 border border-home-grau/20 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.normativesRegelwertKonzept} /></h4>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.expositionsklassenGrenzwerteFürWasser} /></p>
                </div>
              </div>

              {/* Normative Aktualisierung Stand 2026: DIN 1045-1000 & BBQ-Systematik */}
              <div className="bg-white border border-shiraz/30 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-home-grau/20 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                      BBQ
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.neueBetonbauqualitätsklassenNachDin} /></h4>
                      <p className="text-[11px] text-text-main/60"><MdText text={inhalt.texte.ganzheitlicheQualitätssicherungDurchDas} /></p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-shiraz text-white"><MdText text={inhalt.texte.gültigeNormengeneration} /></span>
                </div>

                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.mitDerNeuausgabeDer} /></p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-text-main px-2 py-0.5 bg-white rounded border border-home-grau/20">
                        BBQ-N
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Normal</span>
                    </div>
                    <p className="text-xs text-text-main/80 font-medium"><MdText text={inhalt.texte.regelbauteileDesÜblichenHochbaus} /></p>
                    <p className="text-[11px] text-text-main/60 leading-relaxed"><MdText text={inhalt.texte.keineBesonderenAnforderungenÜber} /></p>
                    <div className="text-[10px] text-text-main/70 pt-1 border-t border-home-grau/15 font-mono"><MdText text={inhalt.texte.überwachungÜk1Eigenüberwachung} /></div>
                  </div>

                  <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-amber-900 px-2 py-0.5 bg-white rounded border border-amber-200">
                        BBQ-E
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">Erhöht</span>
                    </div>
                    <p className="text-xs text-amber-950 font-medium"><MdText text={inhalt.texte.anspruchsvolleBauteileWuWannen} /></p>
                    <p className="text-[11px] text-amber-900/80 leading-relaxed"><MdText text={inhalt.texte.erhöhteAusführungsüberwachungBetoneMit} /></p>
                    <div className="text-[10px] text-amber-800 pt-1 border-t border-amber-200/60 font-mono"><MdText text={inhalt.texte.überwachungÜk2Konzeptionsgespräch} /></div>
                  </div>

                  <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-red-900 px-2 py-0.5 bg-white rounded border border-red-200">
                        BBQ-S
                      </span>
                      <span className="text-[10px] font-bold text-red-800 bg-red-100/70 px-2 py-0.5 rounded">Speziell</span>
                    </div>
                    <p className="text-xs text-red-950 font-medium"><MdText text={inhalt.texte.höchsteAnforderungenGroßinfrastruktur} /></p>
                    <p className="text-[11px] text-red-900/80 leading-relaxed"><MdText text={inhalt.texte.brückenüberbautenHochleistungsbetoneMass} /></p>
                    <div className="text-[10px] text-red-800 pt-1 border-t border-red-200/60 font-mono"><MdText text={inhalt.texte.überwachungÜk3Fremdüberwachung} /></div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-home-grau/20 text-xs text-text-main/80 space-y-2">
                  <div className="font-bold text-text-main flex items-center gap-1.5">
                    <Layers size={14} className="text-shiraz" /><MdText text={inhalt.texte.kWertAnsätzeZusatzstoffregelungen} /></div>
                  <p className="text-[11px] leading-relaxed text-text-main/70"><MdText text={inhalt.texte.zurDekarbonisierungErlaubtDin} /><span className="font-mono font-bold text-shiraz ml-1"><MdText text={inhalt.texte.wZEqW} /></span><MdText text={inhalt.texte.mindestzementgehalteDürfenBeiNachgewiese} /></p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'inhalte' && (
            <div {...reiterPanel('beton-info-bereich', activeSection)} className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <BookOpen className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.inhalteUntermoduleImÜberblick} /></h3>
                <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.dieBetontechnologieInDiesem} /></p>
              </div>

              {/* ITERATING SUBMODULE DESCRIPTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submodules.map((m, idx) => {
                  const Icon = m.icon;
                  return (
                    <div key={idx} className="p-4 bg-off-white border border-home-grau/30 rounded-xl space-y-2 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-2 border-b border-home-grau/20 pb-1.5">
                        <Icon size={16} className="text-shiraz" />
                        <h4 className="font-bold text-sm text-text-main">{m.title}</h4>
                      </div>
                      <div className="space-y-1 text-xs text-text-main/80">
                        <p><strong>Zweck:</strong> {m.purpose}</p>
                        <p><strong>Normen/Regelwerke:</strong> <span className="text-shiraz font-mono">{m.standards}</span></p>
                        <p className="text-text-main/60 italic"><strong>Praxisbeispiel:</strong> {m.useCase}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'ueberblick' && (
            <div {...reiterPanel('beton-info-bereich', activeSection)}><ModuleOverviewView groupKey="beton" /></div>
          )}

          {activeSection === 'anwendung' && (
            <div {...reiterPanel('beton-info-bereich', activeSection)} className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <UserCheck className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.anwendungInLehreUnd} /></h3>
                <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dasBetonologieModulSpricht} /></p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white border-l-4 border-l-shiraz border-y border-r border-home-grau/20 rounded-r-xl">
                  <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.akademischeLehreImBauingenieurwesen} /></h4>
                  <p className="text-xs text-text-main/70 leading-relaxed mt-1"><MdText text={inhalt.texte.idealAlsInteraktiveErgänzung} /></p>
                </div>

                <div className="p-4 bg-white border-l-4 border-l-emerald-600 border-y border-r border-home-grau/20 rounded-r-xl">
                  <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.fürBauleiterPlanerUnd} /></h4>
                  <p className="text-xs text-text-main/70 leading-relaxed mt-1"><MdText text={inhalt.texte.schnelleVerlässlicheÜberprüfungDer} /></p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'weiterfuehrend' && (
            <div {...reiterPanel('beton-info-bereich', activeSection)} className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <Compass className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.umfangreicheWissenschaftlicheRessourcenF} /></h3>
                <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.diesesFachmodulGreiftAuf} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WEBSITES */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                       <Globe className="text-rose-600 w-4 h-4 shrink-0" /><MdText text={inhalt.texte.unabhängigeVerbändeFachportale} /></h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3"><MdText text={inhalt.texte.direktZugänglicheNeutraleFachinhalte} /></p>
                    <ul className="space-y-2.5">
                      <li className="text-xs">
                        <a href="https://www.beton.org" target="_blank" rel="noopener noreferrer" className="font-bold text-shiraz hover:underline flex items-center gap-1">
                          beton.org <span className="text-[10px]">↗</span>
                        </a>
                        <span className="text-text-main/70 block mt-0.5"><MdText text={inhalt.texte.informationsportalDerDeutschenZement} /></span>
                      </li>
                      <li className="text-xs">
                        <a href="https://www.vdz-online.de" target="_blank" rel="noopener noreferrer" className="font-bold text-shiraz hover:underline flex items-center gap-1"><MdText text={inhalt.texte.vereinDeutscherZementwerkeE} /><span className="text-[10px]">↗</span>
                        </a>
                        <span className="text-text-main/70 block mt-0.5"><MdText text={inhalt.texte.wissenschaftlicheUntersuchungenTechnisch} /></span>
                      </li>
                      <li className="text-xs">
                        <a href="https://www.dafstb.de" target="_blank" rel="noopener noreferrer" className="font-bold text-shiraz hover:underline flex items-center gap-1"><MdText text={inhalt.texte.deutscherAusschussFürStahlbeton} /><span className="text-[10px]">↗</span>
                        </a>
                        <span className="text-text-main/70 block mt-0.5"><MdText text={inhalt.texte.herausgeberWegweisenderDafstbRichtlinien} /></span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* TEXTBOOKS */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <BookOpen className="text-indigo-600 w-4 h-4 shrink-0" /><MdText text={inhalt.texte.wissenschaftlicheMonografienLehrbücher} /></h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3"><MdText text={inhalt.texte.inBibliothekenEtablierteStandardwerke} /></p>
                    <ul className="space-y-3 text-xs leading-relaxed text-text-main/80">
                      <li><MdText text={inhalt.texte.betonHerstellungUndEigenschaften} /><span className="block text-[11px] text-text-main/60 mt-0.5"><MdText text={inhalt.texte.pGrüblHWeigler} /></span>
                      </li>
                      <li><MdText text={inhalt.texte.zementChemieUndTechnologie} /><span className="block text-[11px] text-text-main/60 mt-0.5"><MdText text={inhalt.texte.hFWTaylor} /></span>
                      </li>
                      <li><MdText text={inhalt.texte.dauerhaftigkeitVonBeton} /><span className="block text-[11px] text-text-main/60 mt-0.5"><MdText text={inhalt.texte.jStarkBWicht} /></span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* SCIENTIFIC PUBLICATIONS */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <FileText className="text-emerald-600 w-4 h-4 shrink-0" /><MdText text={inhalt.texte.wissenschaftlicheFachaufsätzePeerReviewe} /></h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3"><MdText text={inhalt.texte.internationaleWissenschaftlichePublikati} /></p>
                    <ul className="space-y-2.5">
                      <li className="text-xs">
                        <span className="font-bold text-emerald-800 block"><MdText text={inhalt.texte.cementAndConcreteResearch} /></span>
                        <span className="text-[11px] leading-relaxed text-text-main/70 mt-0.5"><MdText text={inhalt.texte.hydrationKineticsAndMicrostructural} /></span>
                      </li>
                      <li className="text-xs">
                        <span className="font-bold text-emerald-800 block"><MdText text={inhalt.texte.materialsAndStructuresRilem} /></span>
                        <span className="text-[11px] leading-relaxed text-text-main/70 mt-0.5"><MdText text={inhalt.texte.aComprehensiveReviewOn} /></span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* DISSERTATIONS */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <GraduationCap className="text-amber-600 w-4 h-4 shrink-0" /><MdText text={inhalt.texte.dissertationenForschungsberichte} /></h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3"><MdText text={inhalt.texte.überDeutscheUniversitätsbibliothekenOffe} /></p>
                    <ul className="space-y-3 text-xs leading-relaxed text-text-main/80">
                      <li><MdText text={inhalt.texte.untersuchungenZurGefügeoptimierungUltrah} /><span className="block text-[11px] text-text-main/60 mt-0.5"><MdText text={inhalt.texte.dissertationTechnischeUniversitätMünchen} /></span>
                      </li>
                      <li><MdText text={inhalt.texte.zurHydratationskinetikKlinkerreduzierter} /><span className="block text-[11px] text-text-main/60 mt-0.5"><MdText text={inhalt.texte.dissertationKarlsruherInstitutFür} /></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'historie' && (
            <div {...reiterPanel('beton-info-bereich', activeSection)} className="animate-in fade-in duration-300">
              <ModuleHistoryView history={MODULE_HISTORY_DATA.beton} />
            </div>
          )}
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' },
          { title: 'Frischbeton', url: 'https://de.wikipedia.org/wiki/Frischbeton' }
        ]}
        literatur={inhalt.daten["BetonInfo.literatur"]}
        regelwerke={inhalt.daten["BetonInfo.regelwerke"]}
        formeln={inhalt.daten["BetonInfo.formeln"]}
      />
    </div>
  );
}
