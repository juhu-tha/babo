import React from 'react';
import { 
  GraduationCap, BookOpen, ExternalLink, Calendar, Clock, Award, CheckCircle2, ChevronRight,
  LayoutGrid, Trees, Sparkles, SlidersHorizontal, Layers
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { useTabContext } from '@/src/contexts/TabContext';

import type { TabId } from '@/src/contexts/TabContext';
import inhalt from '@/content/weitertha/WeiterTHA.json';
import { MdText } from '@/src/components/inhalt/MdText';
interface Program {
  id: 'bauing' | 'pm' | 'ausbau' | 'fassade' | 'holzbau' | 'ttz' | 'mapr';
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBgColor: string;
  bgColor: string;
  borderColor: string;
  badge: string;
  badgeBgColor: string;
  badgeTextColor: string;
  btnBg: string;
  link?: string;
  degree: string;
  duration: string;
  format: string;
  summary: string;
  description: string;
  modulesTitle: string;
  modules: string[];
  benefitsTitle: string;
  benefitsIntro: string;
  benefits: string[];
}

const PROGRAMS: Program[] = [
  {
    id: 'bauing',
    title: inhalt.werte.bauingenieurwesenMaster,
    subtitle: inhalt.werte.fakultätFürArchitekturUnd,
    icon: GraduationCap,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: inhalt.werte.architekturBauwesenTha,
    badgeBgColor: 'bg-shiraz/5',
    badgeTextColor: 'text-shiraz',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/hochschule/fakultaet/ab/studienangebot/bauingenieurwesen-meng/',
    degree: inhalt.werte.masterOfEngineeringM,
    duration: inhalt.werte.t3SemesterVollzeit5,
    format: inhalt.werte.vollzeitTeilzeitOderStudium,
    summary: inhalt.werte.derForschungsUndPraxisorientierte,
    description: inhalt.werte.bereitenSieSichAuf,
    modulesTitle: inhalt.werte.studienschwerpunkteFächer,
    modules: inhalt.daten["PROGRAMS.bauing.modules"],
    benefitsTitle: inhalt.werte.berufsfelderKarriere,
    benefitsIntro: inhalt.werte.absolventenÜbernehmenHochqualifizierteFa,
    benefits: inhalt.daten["PROGRAMS.bauing.benefits"]
  },
  {
    id: 'pm',
    title: inhalt.werte.projektmanagementBauMaster,
    subtitle: inhalt.werte.thaIbiInstitutFür,
    icon: BookOpen,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: inhalt.werte.weiterbildungsstudiengangIbi,
    badgeBgColor: 'bg-slate-100',
    badgeTextColor: 'text-slate-850',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/hochschule/fakultaet/ab/studienangebot/projektmanagement-bau-meng/',
    degree: inhalt.werte.masterOfEngineeringM2,
    duration: inhalt.werte.t5SemesterBerufsbegleitend,
    format: inhalt.werte.freitagSamstagPräsenzPlus,
    summary: inhalt.werte.dieserBerufsbegleitendeWeiterbildungsstu,
    description: inhalt.werte.derMasterstudiengangQualifiziertSie,
    modulesTitle: inhalt.werte.kerninhalteDerPmModule,
    modules: inhalt.daten["PROGRAMS.pm.modules"],
    benefitsTitle: inhalt.werte.nutzenFürIhrePraxis,
    benefitsIntro: inhalt.werte.dieEngeVerknüpfungMit,
    benefits: inhalt.daten["PROGRAMS.pm.benefits"]
  },
  {
    id: 'ausbau',
    title: inhalt.werte.ausbauUndBestandZertifikat,
    subtitle: inhalt.werte.thaIbiInstitutFür2,
    icon: Award,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: inhalt.werte.zertifikatslehrgangIbi,
    badgeBgColor: 'bg-slate-100',
    badgeTextColor: 'text-slate-850',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/hochschule/fakultaet/ab/studienangebot/ausbau-und-bestand-zertifikat/',
    degree: inhalt.werte.zertifikatFachingenieurInFachplaner,
    duration: inhalt.werte.t2SemesterBerufsbegleitend,
    format: inhalt.werte.berufsbegleitendBeginnImWintersemester,
    summary: inhalt.werte.berufsbegleitendesZertifikatsstudiumFürA,
    description: inhalt.werte.bauenImBestandUnd,
    modulesTitle: 'Lehrplanthemen',
    modules: inhalt.daten["PROGRAMS.ausbau.modules"],
    benefitsTitle: inhalt.werte.werProfitiertAmMeisten,
    benefitsIntro: inhalt.werte.diePraxisnaheWeiterbildungVerbindet,
    benefits: inhalt.daten["PROGRAMS.ausbau.benefits"]
  },
  {
    id: 'fassade',
    title: inhalt.werte.fassadeZertifikat,
    subtitle: inhalt.werte.thaIbiInstitutFür3,
    icon: LayoutGrid,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: inhalt.werte.zertifikatslehrgangIbiNeu,
    badgeBgColor: 'bg-slate-100',
    badgeTextColor: 'text-slate-850',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/hochschule/fakultaet/ab/studienangebot/fassade-zertifikat/',
    degree: inhalt.werte.zertifikatFachingenieurInFachplaner2,
    duration: inhalt.werte.t2SemesterBerufsbegleitend2,
    format: inhalt.werte.berufsbegleitendBeginnImWintersemester2,
    summary: inhalt.werte.dieGebäudehülleBzwVorhangfassade,
    description: inhalt.werte.effizientesPlanenModernerSystem,
    modulesTitle: inhalt.werte.lehrplanthemenModule,
    modules: inhalt.daten["PROGRAMS.fassade.modules"],
    benefitsTitle: inhalt.werte.werProfitiertAmMeisten2,
    benefitsIntro: inhalt.werte.dieFortbildungBringtSie,
    benefits: inhalt.daten["PROGRAMS.fassade.benefits"]
  },
  {
    id: 'holzbau',
    title: inhalt.werte.holzbauZertifikat,
    subtitle: inhalt.werte.thaIbiInstitutFür4,
    icon: Trees,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: inhalt.werte.zertifikatslehrgangIbiNeu2,
    badgeBgColor: 'bg-slate-100',
    badgeTextColor: 'text-slate-850',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/hochschule/fakultaet/ab/studienangebot/holzbau-zertifikat/',
    degree: inhalt.werte.zertifikatFachingenieurInFachplaner3,
    duration: inhalt.werte.t2SemesterBerufsbegleitend3,
    format: inhalt.werte.berufsbegleitendBeginnImWintersemester3,
    summary: inhalt.werte.derModerneHolzbauUnd,
    description: inhalt.werte.nachhaltigesSchnellesUndPräzises,
    modulesTitle: inhalt.werte.lehrplanthemenModule2,
    modules: inhalt.daten["PROGRAMS.holzbau.modules"],
    benefitsTitle: inhalt.werte.werProfitiertAmMeisten3,
    benefitsIntro: inhalt.werte.rüstenSieSichFür,
    benefits: inhalt.daten["PROGRAMS.holzbau.benefits"]
  },
  {
    id: 'ttz',
    title: inhalt.werte.ttzAichachTechnologietransferzentrum,
    subtitle: inhalt.werte.technologietransferzentrumFürDigitalesPl,
    icon: Sparkles,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: inhalt.werte.forschungTransferTha,
    badgeBgColor: 'bg-shiraz/5',
    badgeTextColor: 'text-shiraz',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/forschung/technologietransfer/technologietransferzentren/ttz-aichach/',
    degree: inhalt.werte.forschungTransferInnovation,
    duration: inhalt.werte.forschungTransfer,
    format: inhalt.werte.kooperationsprojekteMitBauwirtschaftUnd,
    summary: inhalt.werte.dasTechnologietransferzentrumTtzAichach,
    description: inhalt.werte.inKooperationMitUnternehmen,
    modulesTitle: inhalt.werte.forschungsFokusthemen,
    modules: inhalt.daten["PROGRAMS.ttz.modules"],
    benefitsTitle: inhalt.werte.zusammenarbeitTransfer,
    benefitsIntro: inhalt.werte.dasTtzBietetEin,
    benefits: inhalt.daten["PROGRAMS.ttz.benefits"]
  },
  {
    id: 'mapr',
    title: inhalt.werte.masterOfAppliedResearch,
    subtitle: inhalt.werte.forschungsorientierterMasterDerFakultät,
    icon: GraduationCap,
    iconColor: 'text-shiraz',
    iconBgColor: 'bg-shiraz/5',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200 hover:border-shiraz/40',
    badge: inhalt.werte.masterOfScienceM,
    badgeBgColor: 'bg-shiraz/5',
    badgeTextColor: 'text-shiraz',
    btnBg: 'bg-shiraz hover:bg-shiraz/90',
    link: 'https://www.tha.de/hochschule/fakultaet/elektrotechnik/studienangebot/master-applied-research/',
    degree: inhalt.werte.masterOfScienceM2,
    duration: inhalt.werte.t3SemesterVollzeit,
    format: inhalt.werte.vollzeitBeginnJedesSemester,
    summary: inhalt.werte.derInterdisziplinäreMasterstudiengangAng,
    description: inhalt.werte.dieserStudiengangKombiniertAnspruchsvoll,
    modulesTitle: inhalt.werte.studienForschungsstruktur,
    modules: inhalt.daten["PROGRAMS.mapr.modules"],
    benefitsTitle: inhalt.werte.herausragendePerspektiven,
    benefitsIntro: inhalt.werte.bereitetSieZielgerichtetAuf,
    benefits: inhalt.daten["PROGRAMS.mapr.benefits"]
  }
];

export default function WeiterTHA() {
  const { activeTab, setActiveTab } = useTabContext();

  const activeProgram = activeTab === 'weiter_bauing' ? 'bauing'
    : activeTab === 'weiter_pm' ? 'pm'
    : activeTab === 'weiter_ausbau' ? 'ausbau'
    : activeTab === 'weiter_fassade' ? 'fassade'
    : activeTab === 'weiter_holzbau' ? 'holzbau'
    : activeTab === 'weiter_ttz' ? 'ttz'
    : activeTab === 'weiter_mapr' ? 'mapr'
    : 'all';

  const handleProgramChange = (programId: 'all' | 'bauing' | 'pm' | 'ausbau' | 'fassade' | 'holzbau' | 'ttz' | 'mapr') => {
    if (programId === 'all') {
      setActiveTab('weiter_tha');
    } else {
      setActiveTab(`weiter_${programId}` as TabId);
    }
  };

  const filteredPrograms = activeProgram === 'all' 
    ? PROGRAMS 
    : PROGRAMS.filter(p => p.id === activeProgram);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Intro Banner */}
      <div className="relative bg-white border border-home-grau/30 border-t-4 border-t-shiraz rounded-3xl p-6 md:p-8 text-text-main shadow-xs overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none transform translate-y-12 translate-x-12">
          <GraduationCap size={300} className="text-shiraz" />
        </div>
        <div className="relative z-10 flex flex-col gap-4 max-w-2xl">
          <span className="bg-shiraz/5 text-shiraz border border-shiraz/15 font-semibold text-xs tracking-wider uppercase px-2.5 py-1 rounded-full self-start font-mono"><MdText text={inhalt.texte.fakultätFürArchitekturUnd} /></span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main"><MdText text={inhalt.texte.weiterführendeStudienangeboteThaIbi} /></h2>
          <p className="text-sm md:text-base text-text-main/70 leading-relaxed font-light"><MdText text={inhalt.texte.bereitenSieSichAuf} /></p>
          <div className="flex flex-wrap gap-2.5 mt-2">
            <a 
              href="https://www.tha.de/TTZ-Aichach.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-home-grau/20 rounded-xl text-xs font-semibold text-text-main transition-all shadow-xs"
            >
              <ExternalLink size={12} className="text-shiraz" />
              <span>TTZ Aichach</span>
            </a>
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-home-grau/20 rounded-xl text-xs font-semibold text-text-main/80 shadow-xs"
            >
              <GraduationCap size={12} className="text-shiraz" />
              <span><MdText text={inhalt.texte.maprAppliedResearch} /></span>
            </span>
          </div>
        </div>
      </div>

      {/* Program Selector Dashboard/Buttons */}
      <div className="bg-white p-5 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-4 font-sans">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase font-bold tracking-wider text-text-main/50 flex items-center gap-1 font-mono">
            <SlidersHorizontal size={12} /> Programm-Auswahl
          </span>
          <h3 className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.wählenSieEinAkademisches} /></h3>
        </div>

        {/* Program selection buttons including Master, Fachingenieure, TTZ and MAPR */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <button
            id="btn-all"
            onClick={() => handleProgramChange('all')}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-2 text-center transition-all duration-200 border cursor-pointer ${
              activeProgram === 'all'
                ? 'bg-shiraz text-white shadow-md border-shiraz'
                : 'bg-stone-50 text-text-main hover:bg-stone-100 border-home-grau/20'
            }`}
          >
            <Layers size={18} />
            <div className="flex flex-col items-center">
              <span><MdText text={inhalt.texte.alleAngebote} /></span>
              <span className={`text-xs font-medium block mt-0.5 ${activeProgram === 'all' ? 'text-white/80' : 'text-text-main/55'}`}>Gesamtübersicht</span>
            </div>
          </button>

          {PROGRAMS.map((program) => {
            const Icon = program.icon;
            const isActive = activeProgram === program.id;
            return (
              <button
                key={program.id}
                id={`btn-${program.id}`}
                onClick={() => handleProgramChange(program.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-2 text-center transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-shiraz text-white shadow-md border-shiraz font-bold'
                    : 'bg-stone-50 text-text-main hover:bg-stone-100 border-home-grau/20'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : program.iconColor} />
                <div className="flex flex-col items-center">
                  <span className="line-clamp-1 font-semibold">{program.title.replace(' (Zertifikatslehrgang)', '').replace(inhalt.werte.masterBauImmobilie, '').replace(' (Master)', '')}</span>
                  <span className={`text-xs font-medium block mt-0.5 ${isActive ? 'text-white/80' : 'text-text-main/55'}`}>{program.duration}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Program Grids */}
      <div className="grid grid-cols-1 gap-8">
        {filteredPrograms.map((program) => {
          const Icon = program.icon;
          return (
            <div 
              key={program.id}
              className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col gap-6 transition-all duration-300 ${program.borderColor}`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-home-grau/25 pb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${program.iconBgColor} rounded-2xl flex items-center justify-center ${program.iconColor}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2 flex-wrap">
                      <span>{program.title}</span>
                      {program.badge.includes('NEU') && (
                        <span className="bg-shiraz/10 text-shiraz text-xs px-2 py-0.5 rounded-md font-bold tracking-wider flex items-center gap-0.5">
                          <Sparkles size={10} /> NEU
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-text-main/60">{program.subtitle}</span>
                  </div>
                </div>
                {program.link ? (
                  <a 
                    href={program.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 ${program.btnBg} text-white font-medium text-xs rounded-xl transition-all shadow-sm shrink-0`}
                  >
                    <span><MdText text={inhalt.texte.zurWebseite} /></span>
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 font-medium text-xs rounded-xl border border-slate-200 shrink-0"><MdText text={inhalt.texte.bewerbungInformationAnDer} /></span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <span className={`self-start text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${program.badgeBgColor} ${program.badgeTextColor}`}>
                    {program.badge}
                  </span>
                  {program.id === 'ausbau' && (
                    <span className="self-start text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200"><MdText text={inhalt.texte.studiengangsleiterProfHuber} /></span>
                  )}
                </div>
                <p className="text-sm text-text-main/80 leading-relaxed font-light">
                  {program.summary}
                </p>
                {program.id === 'ausbau' && (
                  <div className="my-1 bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs text-slate-700 font-medium shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="p-1 px-2.5 bg-shiraz/10 text-shiraz border border-shiraz/20 font-bold rounded-lg text-xs uppercase tracking-wider shrink-0">
                        Hinweis
                      </span>
                      <span><MdText text={inhalt.texte.studiengangsleiterProfHuber2} /></span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium font-mono">ibi / THA</span>
                  </div>
                )}
                <p className="text-xs text-text-main/60 leading-relaxed italic">
                  {program.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-stone-50 p-4 border border-home-grau/15 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-xs uppercase font-bold tracking-wider text-text-main/40 flex items-center gap-1 font-mono">
                    <Award size={12} /><MdText text={inhalt.texte.akademischerGradAbschluss} /></span>
                  <strong className="text-sm font-bold text-text-main">{program.degree}</strong>
                </div>
                <div className="bg-stone-50 p-4 border border-home-grau/15 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-xs uppercase font-bold tracking-wider text-text-main/40 flex items-center gap-1 font-mono">
                    <Calendar size={12} /><MdText text={inhalt.texte.regelstudienzeitStruktur} /></span>
                  <strong className="text-sm font-bold text-text-main">{program.duration}</strong>
                </div>
                <div className="bg-stone-50 p-4 border border-home-grau/15 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-xs uppercase font-bold tracking-wider text-text-main/40 flex items-center gap-1 font-mono">
                    <Clock size={12} /><MdText text={inhalt.texte.formatPräsenz} /></span>
                  <strong className="text-sm font-bold text-text-main">{program.format}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 border-t border-home-grau/10 pt-4">
                <div>
                  <h4 className="font-bold text-text-main text-sm mb-3 flex items-center gap-1.5">
                    <ChevronRight size={16} className={program.iconColor} /> {program.modulesTitle}
                  </h4>
                  <ul className="space-y-2">
                    {program.modules.map((item, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-text-main/85">
                        <CheckCircle2 size={13} className="text-shiraz shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-text-main text-sm mb-3 flex items-center gap-1.5">
                    <ChevronRight size={16} className={program.iconColor} /> {program.benefitsTitle}
                  </h4>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3">
                    {program.benefitsIntro}
                  </p>
                  <ul className="space-y-2">
                    {program.benefits.map((item, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-text-main/85">
                        <CheckCircle2 size={13} className="text-shiraz shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap17}
        wikipedia={[
          { title: inhalt.werte.technischeHochschuleAugsburg, url: 'https://de.wikipedia.org/wiki/Technische_Hochschule_Augsburg' },
          { title: 'Bauingenieurwesen', url: 'https://de.wikipedia.org/wiki/Bauingenieurwesen' }
        ]}
        literatur={inhalt.daten["WeiterTHA.literatur"]}
        regelwerke={inhalt.daten["WeiterTHA.regelwerke"]}
        weblinks={[
          inhalt.daten["WeiterTHA.weblinks.0"],
          { title: inhalt.werte.bachelorBauingenieurwesenTha, url: 'https://www.tha.de/hochschule/fakultaet/ab/studienangebot/bauingenieurwesen-beng/' },
          { title: inhalt.werte.ttzAichachTechnologietransferzentrum2, url: 'https://www.tha.de/forschung/technologietransfer/technologietransferzentren/ttz-aichach/' },
          { title: inhalt.werte.maprMasterOfApplied, url: 'https://www.tha.de/hochschule/fakultaet/elektrotechnik/studienangebot/master-applied-research/' }
        ]}
        hideFormeln={true}
      />
    </div>
  );
}
