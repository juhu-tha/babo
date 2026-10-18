import React from 'react';
import { 
  GraduationCap, ExternalLink, Globe, Sparkles, Link2, Download
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

interface Portal {
  tag: string;
  name: string;
  desc: string;
  url: string;
  colorClass: string;
  badgeBg: string;
}

const THA_PORTALS: Portal[] = [
  {
    tag: 'app.tha.de',
    name: 'Campus App & Studentenportal',
    desc: 'Offizielle Campus-Webapp der THA: Bündelt Ihren Vorlesungsplan (Stundenplan), Mensamenüs der Woche, Moodle-Shortcuts sowie aktuelle Campus-News an einer Stelle.',
    url: 'https://app.tha.de/',
    colorClass: 'text-shiraz',
    badgeBg: 'bg-shiraz/10 text-shiraz'
  },
  {
    tag: 'Moodle',
    name: 'E-Learning & Kursunterlagen',
    desc: 'Das offizielle Lernmanagementsystem. Dozenten hinterlegen hier Skripte, Vorlesungsfolien, Aufgabenblätter sowie Upload-Schnittstellen für Hausarbeiten.',
    url: 'https://moodle.tha.de/',
    colorClass: 'text-amber-600',
    badgeBg: 'bg-amber-50 text-amber-700'
  },
  {
    tag: 'WebUntis',
    name: 'Stundenpläne & Raumbelegung',
    desc: 'Bietet tagesaktuelle, stundengenaue Stundenpläne. Zeigt Raumänderungen, Verschiebungen oder Ausfälle für alle Lehrveranstaltungen der Fakultät A+B.',
    url: 'https://hektor.webuntis.com/WebUntis/?school=hs-augsburg',
    colorClass: 'text-green-600',
    badgeBg: 'bg-green-50 text-green-700'
  },
  {
    tag: 'OPAC / InfoGuide',
    name: 'Bibliothek & Literaturrecherche',
    desc: 'Onlinekatalog (InfoGuide) der THA-Bibliothek: Suche nach Fachbüchern, Zeitschriften, E-Books und Normen (wie DIN-Vorschriften) sowie Bibliothekskonto-Verwaltung.',
    url: 'https://infoguide.hs-augsburg.de/opacTHA.html',
    colorClass: 'text-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700'
  },
  {
    tag: 'RZ-Portal',
    name: 'Zentrale IT & Rechenzentrum',
    desc: 'Anlaufstelle für Ihre IT-Infrastruktur: Studentische E-Mail-Adresse, WLAN-Einrichtung (eduroam), VPN-Zugänge für Zuhause und Druckkonten-Verwaltung.',
    url: 'https://www.tha.de/hochschule/organisation/einrichtungen/zentrale-it/',
    colorClass: 'text-teal-600',
    badgeBg: 'bg-teal-50 text-teal-700'
  },
  {
    tag: 'Career Service',
    name: 'Karriere, Praktika & Jobs',
    desc: 'Der Career Service der THA: Vermittlung von Praktikumsplätzen im 5. Semester, Werkstudierendentätigkeiten, Einstiegsjobs und Firmenkontaktmessen.',
    url: 'https://www.tha.de/studium/berufseinstieg-und-alumni/studium-beruf/career-service/',
    colorClass: 'text-rose-600',
    badgeBg: 'bg-rose-50 text-rose-700'
  },
  {
    tag: 'Mensa-Plan',
    name: 'Speiseplan Campus Augsburg',
    desc: 'Tagesaktuelle Menüs, Preise und Angebote der Mensen und Cafeterien des Studierendenwerks Augsburg am Campus Brunnenlech und Campus Rotes Tor.',
    url: 'https://studierendenwerk-augsburg.de/speiseplaene/',
    colorClass: 'text-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-700'
  }
];

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
            <Sparkles size={12} className="text-shiraz animate-pulse" /> Studium @ Fakultät A+B
          </span>
          <h2 id="studium-tha-title" className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main">
            Studierendenportal THA (Augsburg)
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed font-light">
            <p>
              Willkommen im akademischen Portal für das Bauwesen- &amp; Architekturstudium an der <strong>Technischen Hochschule Augsburg (THA)</strong>. Hier finden Sie einen schnellen Zugang zur wichtigsten digitalen Infrastruktur und Direktlinks zum Studierendenportal <strong>app.tha.de</strong>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <a 
              href="https://app.tha.de/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer w-fit"
            >
              <Globe size={14} />
              <span>Campus-App app.tha.de direkt öffnen</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white p-6 rounded-3xl border border-home-grau/30 shadow-sm flex flex-col gap-6">
        
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl">
          <h3 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
            <Globe className="text-shiraz" size={16} /> Digitale THA-Infrastruktur auf einen Blick
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Der Studienalltag an der THA wird über verschiedene Systeme verwaltet. Die wichtigste Anlaufstelle ist das personalisierte Portal <strong className="text-shiraz">app.tha.de</strong>, welches viele dieser Services komfortabel aggregiert. Nutzen Sie Ihren zentralen RZ-Account (Single-Sign-On) für den Zugriff.
          </p>
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
                >
                  Portal öffnen <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Informative Infobox app.tha.de App */}
        <div className="bg-[#fcf8f2] border border-amber-200 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="space-y-1">
            <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
              <Sparkles className="text-amber-700" size={16} /> app.tha.de als native Web-App installieren
            </h4>
            <p className="text-xs text-amber-900/80 leading-relaxed max-w-2xl">
              Das Portal <strong className="text-shiraz">app.tha.de</strong> ist als Progressive Web App (PWA) optimiert. Sie können es direkt über die Browserleiste auf Ihrem Smartphone oder Desktop als eigenständige App installieren, um noch schnelleren Zugriff auf Ihren Stundenplan und Mensaspeiseplan zu erhalten.
            </p>
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
          { title: 'Technische Hochschule Augsburg', url: 'https://de.wikipedia.org/wiki/Technische_Hochschule_Augsburg' }
        ]}
        weblinks={[
          { title: 'Zentrales Studentenportal app.tha.de', url: 'https://app.tha.de/' },
          { title: 'Onlinekatalog OPAC / InfoGuide Bibliothek THA', url: 'https://infoguide.hs-augsburg.de/opacTHA.html' },
          { title: 'E-Learning Moodle THA', url: 'https://moodle.tha.de/' },
          { title: 'Stundenpläne (WebUntis) THA', url: 'https://hektor.webuntis.com/WebUntis/?school=hs-augsburg' },
          { title: 'Career Service THA (Praktika & Jobs)', url: 'https://www.tha.de/studium/berufseinstieg-und-alumni/studium-beruf/career-service/' },
          { title: 'Mensa-Speisepläne Studierendenwerk Augsburg', url: 'https://studierendenwerk-augsburg.de/speiseplaene/' },
          { title: 'Fakultät für Architektur und Bauwesen', url: 'https://www.tha.de/hochschule/fakultaet/ab/' }
        ]}
        literatur={[
          'Modulhandbuch Bachelor Bauingenieurwesen (Fakultät für Architektur und Bauwesen, THA)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'Allgemeine Prüfungsordnung (APO) der Technischen Hochschule Augsburg (THA)', url: 'https://www.tha.de/' },
          { title: 'Studien- und Prüfungsordnung (SPO) Bauingenieurwesen B.Eng.', url: 'https://www.tha.de/' }
        ]}
        hideFormeln={true}
      />
    </div>
  );
}
