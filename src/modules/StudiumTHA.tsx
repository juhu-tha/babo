import React from 'react';
import { 
  GraduationCap, ExternalLink, Globe, Sparkles, Link2
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/studiumtha/StudiumTHA.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface Portal {
  tag: string;
  name: string;
  desc: string;
  url: string;
  colorClass: string;
  badgeBg: string;
}

const THA_PORTALS: Portal[] = inhalt.daten.THA_PORTALS;

export default function StudiumTHA() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Intro Banner */}
      <div className="relative bg-white border border-home-grau/30 border-t-4 border-t-shiraz rounded-3xl p-6 md:p-8 text-text-main shadow-sm overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none transform translate-y-12 translate-x-12">
          <GraduationCap size={300} className="text-shiraz" />
        </div>
        <div className="relative z-10 flex flex-col gap-4 max-w-2xl">
          <span className="bg-shiraz/5 text-shiraz border border-shiraz/15 font-semibold text-xs tracking-wider uppercase px-2.5 py-1 rounded-full self-start font-mono flex items-center gap-1.5">
            <Sparkles size={12} className="text-shiraz animate-pulse" /><MdText text={inhalt.texte.studiumFakultätAB} /></span>
          <h2 id="studium-tha-title" className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main"><MdText text={inhalt.texte.studierendenportalThaAugsburg} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed font-light">
            <p><MdText text={inhalt.texte.willkommenImAkademischenPortal} /></p>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <a 
              href="https://app.tha.de/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer w-fit"
            >
              <Globe size={14} />
              <span><MdText text={inhalt.texte.campusAppAppTha} /></span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white p-6 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
        
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl">
          <h3 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
            <Globe className="text-shiraz" size={16} /><MdText text={inhalt.texte.digitaleThaInfrastrukturAuf} /></h3>
          <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.derStudienalltagAnDer} /><strong className="text-shiraz">app.tha.de</strong><MdText text={inhalt.texte.welchesVieleDieserServices} /></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {THA_PORTALS.map((portal) => (
            <div 
              key={portal.tag} 
              className="bg-white p-5 rounded-2xl border border-home-grau/25 shadow-sm hover:border-shiraz/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-md ${portal.badgeBg}`}>
                    {portal.tag}
                  </span>
                  <Link2 size={14} className="text-slate-300 group-hover:text-shiraz transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-shiraz transition-colors">
                    {portal.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {portal.desc}
                  </p>
                </div>
              </div>
              
              <div className="mt-5 pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
                <a 
                  href={portal.url} 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="text-shiraz hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                ><MdText text={inhalt.texte.portalÖffnen} /><ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Informative Infobox app.tha.de App */}
        <div className="bg-[#fcf8f2] border border-amber-200 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="space-y-1">
            <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
              <Sparkles className="text-amber-700" size={16} /><MdText text={inhalt.texte.appThaDeAls} /></h4>
            <p className="text-xs text-amber-900/80 leading-relaxed max-w-2xl">
              Das Portal <strong className="text-shiraz">app.tha.de</strong><MdText text={inhalt.texte.istAlsProgressiveWeb} /></p>
          </div>
          <a 
            href="https://app.tha.de" 
            target="_blank" 
            referrerPolicy="no-referrer"
            className="px-4 py-2 bg-shiraz hover:bg-shiraz/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap self-stretch md:self-auto text-center justify-center cursor-pointer"
          >
            Zur THA App <ExternalLink size={14} />
          </a>
        </div>

      </div>

      {/* Module Standard Footer */}
      <ModuleFooter 
        wikipedia={[
          { title: inhalt.werte.technischeHochschuleAugsburg, url: 'https://de.wikipedia.org/wiki/Technische_Hochschule_Augsburg' }
        ]}
        weblinks={[
          { title: inhalt.werte.zentralesStudentenportalAppTha, url: 'https://app.tha.de/' },
          inhalt.daten["StudiumTHA.weblinks.1"],
          { title: inhalt.werte.eLearningMoodleTha, url: 'https://moodle.tha.de/' },
          { title: inhalt.werte.stundenpläneWebuntisTha, url: 'https://hektor.webuntis.com/WebUntis/?school=hs-augsburg' },
          { title: inhalt.werte.careerServiceThaPraktika, url: 'https://www.tha.de/studium/berufseinstieg-und-alumni/studium-beruf/career-service/' },
          { title: inhalt.werte.mensaSpeisepläneStudierendenwerkAugsburg, url: 'https://studierendenwerk-augsburg.de/speiseplaene/' },
          { title: inhalt.werte.fakultätFürArchitekturUnd, url: 'https://www.tha.de/hochschule/fakultaet/ab/' }
        ]}
        literatur={inhalt.daten["StudiumTHA.literatur"]}
        regelwerke={inhalt.daten["StudiumTHA.regelwerke"]}
        hideFormeln={true}
      />
    </div>
  );
}
