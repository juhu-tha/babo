import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Layers, BookOpen, CheckCircle2, Lightbulb, ClipboardList, Flame, Settings, ShieldAlert, Sparkles, FileText } from 'lucide-react';
import { InlineMath } from 'react-katex';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';

interface PutzEstrichProduct {
  name: string;
  code: string;
  standard: string;
  strengthClass: string;
  binder: string;
  density: string;
  shrinkage: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  applications: string[];
}

const plasterProducts: PutzEstrichProduct[] = [
  {
    name: 'Gipsputzmörtel (Innenputz)',
    code: 'GP / B1-B7',
    standard: 'DIN EN 13279-1',
    strengthClass: 'Druckfestigkeit ≥ 2,0 N/mm²',
    binder: 'Baugips (Calciumsulfat-Hemihydrat)',
    density: 'ca. 900 - 1100 kg/m³',
    shrinkage: 'Sehr gering (quillt minimal)',
    description: 'Einschichtiger, rationeller Innenputz für Wände und Decken. Ergibt sehr glatte, streichfertige Oberflächen und trägt hervorragend zur Raumluftfeuchteregulation bei.',
    advantages: ['Sehr glatte Oberflächen erzielbar', 'Hervorragendes Raumklima durch Feuchtespeicherung', 'Schnelle Erhärtung'],
    disadvantages: ['Nicht feuchtigkeitsbeständig (reiner Trockenbereich)', 'Keine Frostbeständigkeit', 'Geringere Stoßfestigkeit'],
    applications: ['Wohnräume und Flure (Innen)', 'Untergrund für Tapezierarbeiten', 'Deckenbeschichtungen']
  },
  {
    name: 'Alkalischer Kalkputzmörtel',
    code: 'GP / CS I',
    standard: 'DIN EN 998-1',
    strengthClass: 'CS I (0,4 - 2,5 N/mm²)',
    binder: 'Luftkalk (Calciumhydroxid) / Hydratkalk',
    density: 'ca. 1200 - 1400 kg/m³',
    shrinkage: 'Mäßig (Carbonatisierung erforderlich)',
    description: 'Hochgradig atmungsaktiver, historisch bewährter Putzmörtel. Durch die extrem hohe Alkalität (pH-Wert ~12) wirkt der Putz auf natürliche Weise schimmelhemmend.',
    advantages: ['Schimmelpilzwidrig ohne biozide Chemie', 'Hochgradig diffusionsoffen (s_d ≤ 0,02 m)', 'Elastischer als zementgebundene Systeme'],
    disadvantages: ['Langsame Erhärtung (benötigt CO2-Zufuhr)', 'Geringere mechanische Belastbarkeit'],
    applications: ['Historischer Altbau & Denkmalpflege', 'Kindergärten & Schlafzimmer (ökologischer Ausbau)', 'Innentrennwände ohne dauerhafte Feuchtebelastung']
  },
  {
    name: 'Universal Kalk-Zement-Putz',
    code: 'GP / CS II - CS III',
    standard: 'DIN EN 998-1',
    strengthClass: 'CS II (1,5 - 5,0 N/mm²)',
    binder: 'Portlandzement & Hydratkalk',
    density: 'ca. 1400 - 1700 kg/m³',
    shrinkage: 'Spürbar (Rissgefahr bei schneller Trocknung)',
    description: 'Der unentbehrliche, widerstandsfähige Allroundputz für außen und innen. Vereinigt die Verarbeitbarkeit von Kalk mit der Robustheit und Feuchtefestigkeit von Zement.',
    advantages: ['Wasserabweisend und frostbeständig', 'Ausgezeichnete Stoßfestigkeit', 'Universell überarbeitbar'],
    disadvantages: ['Rissgefahr durch Schwinden bei Zugluft', 'Höherer mechanischer Widerstand bei Verarbeitung'],
    applications: ['Außenfassaden (Unter- und Oberputz)', 'Häusliche Bäder, Keller und Feuchträume', 'Tragschicht für Fliesenbeläge']
  },
  {
    name: 'Hydraulischer Sanierputzmörtel',
    code: 'R',
    standard: 'DIN EN 998-1 / WTA-Merkblatt 2-9',
    strengthClass: 'CS II (1,5 - 5,0 N/mm²)',
    binder: 'Zement unter Beigabe von Porenbildnern',
    density: 'ca. 1000 - 1300 kg/m³',
    shrinkage: 'Gering',
    description: 'Spezialputz mit extrem hohem, kontrolliertem Luftporenvolumen (>25%). Dient dem schadensfreien Einlagern auskristallisierender Salze bei feuchtem Kellermauerwerk.',
    advantages: ['Verhindert Salzausblühungen an der Oberfläche', 'Hält die Oberfläche trocken trotz feuchter Wand', 'Extrem diffusionsoffen'],
    disadvantages: ['Keine konstruktive Abdichtung (nur Opferputz)', 'Beschränkte Salzaufnahmekapazität (Sättigung nach J.)', 'Nicht im ständigen Spritzwasserbereich einsetzbar'],
    applications: ['Sanierung feuchter Altbaukeller (erdberührt)', 'Historische Denkmäler', 'Mauerwerke nach Havariefällen / Rohrbrüchen']
  }
];

const screedProducts: PutzEstrichProduct[] = [
  {
    name: 'Zementestrich',
    code: 'CT',
    standard: 'DIN EN 13813 / DIN 18560',
    strengthClass: 'z.B. C25 - F4 / C35 - F5',
    binder: 'Portlandzement (CEM I bzw. CEM II)',
    density: 'ca. 2000 - 2200 kg/m³',
    shrinkage: 'Spürbar hoch (ca. 0,5 mm/m)',
    description: 'Der bewährte Klassiker für alle Innen- und Außenanwendungen. Absolut wasserfest, hochbelastbar, erfordert jedoch aufgrund des Abbindeschwindens eine strikte Begrenzung feldweiser Fugen.',
    advantages: ['Absolut feuchtigkeitsunempfindlich', 'Sowohl für innen als auch außen geeignet (frostbeständig)', 'Hohe mechanische Festigkeiten'],
    disadvantages: ['Lange Trocknungszeit (Reifezeit ca. 28 Tage minimum)', 'Schwindet stark bei Erhärtung (Riss- und Schüsselgefahr)', 'Benötigt Dehnfugen bei Flächen > 40 m²'],
    applications: ['Nassbereiche, Balkone und Terrassen', 'Industriehallen und Garagen', 'Unterbau für alle Bodenbeläge']
  },
  {
    name: 'Calciumsulfat-Fließestrich',
    code: 'CA / CAF',
    standard: 'DIN EN 13813 / DIN 18560',
    strengthClass: 'z.B. CA-C25-F5 / CA-C35-F7',
    binder: 'Calciumsulfat-Anhydrit (Gipsbasis)',
    density: 'ca. 2000 - 2100 kg/m³',
    shrinkage: 'Extrem gering (quillt/schwindet kaum)',
    description: 'Fließfähiger Estrich, der sich selbstnivellierend einbaut. Aufgrund des minimalen Schwindverhaltens können riesige Flächen (bis über 300 m²) vollkommen fugenlos hergestellt werden.',
    advantages: ['Selbstnivellierende, arbeitszeitsparende Einbringung', 'Ideal für Fußbodenheizungen (umschließt Rohrleitungen hohlraumfrei)', 'Belegreif bereits bei geringeren Restfeuchten'],
    disadvantages: ['Strikte Feuchteempfindlichkeit (Zerstörung durch Gipsquellen)', 'Nicht für den Außen- oder Dauernassbereich zugelassen', 'Sinterhaut muss oft angeschliffen werden'],
    applications: ['Wohnungsbau mit flächiger Fußbodenheizung', 'Fugenlose Ausbauten im Trockenbereich', 'Bürogebäude']
  },
  {
    name: 'Gussasphaltestrich',
    code: 'AS',
    standard: 'DIN EN 13813 / DIN 18560',
    strengthClass: 'z.B. AS-IC 10 / AS-IC 15',
    binder: 'Bitumen (Straßenbaubitumen)',
    density: 'ca. 2300 - 2400 kg/m³',
    shrinkage: 'Null (rein thermische Kontraktion)',
    description: 'Wird heiß als viskose Masse eingebracht und erhärtet ausschließlich durch Abkühlung. Enthält kein Wasser, wodurch jegliche Baufeuchte entfällt. Sofort begehbar.',
    advantages: ['Völlig wasserfrei (keine Trocknungszeit, sofort belegbar)', 'Ausgezeichneter Trittschall- und Wärmeschutz', 'Absolut wasser- und dampfdicht'],
    disadvantages: ['Sehr hoher Einbaupreis', 'Erfordert spezielle Heißeinbautragschichten (Schutzfolien)', 'Nicht für hohe Dauertemperaturen geeignet'],
    applications: ['Schnellsanierungen (z.B. Hotelbäder)', 'Industrieböden mit Chemikalien- und mechanischer Belastung', 'Estrich auf Trennschicht über schwingungsempfindlichen Holzbalkendecken']
  }
];

export default function BpPutzEstrich() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'allgemein' | 'praxis' | 'innovation'>('steckbrief');
  const [selectedItem, setSelectedItem] = useState<PutzEstrichProduct>(plasterProducts[0]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Putz- &amp; Estrichsysteme (Bauprodukte)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
          <p>
            Anforderungen nach DIN 18550 und DIN 18560. Technische Spezifikation von Werktrockenmörteln, Bindemittelreaktionen sowie die sachgerechte Auswahl von Lastverteilungsschichten.
          </p>
        </div>

        {/* Primary Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Steckbrief
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <FileText size={16} /> Basiswissen &amp; Mörtelarten
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={16} /> Praxisbeispiele
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'innovation' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('innovation')}
          >
            <Lightbulb size={16} /> Zukunftstrends
          </button>
        </div>

        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="putzemoertel" />
          </div>
        )}

        {activeTab === 'allgemein' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* INTERACTIVE SPEC SHEET AND SELECTOR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column Component List Selector */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Verfügbare Putz- und Estricharten:</span>
                
                {/* Plasters subcategory */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ClipboardList size={11} className="text-slate-400" /> 1. Putze (nach DIN EN 998-1)
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {plasterProducts.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => setSelectedItem(prod)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                          selectedItem.name === prod.name
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{prod.name} (<strong>{prod.code.split(' ')[0]}</strong>)</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${selectedItem.name === prod.name ? 'bg-white/20 text-white' : 'bg-slate-150 text-slate-600'}`}>{prod.code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Screeds subcategory */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Settings size={11} className="text-slate-400" /> 2. Estriche (nach DIN EN 13813)
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {screedProducts.map((prod) => (
                      <button
                        key={prod.name}
                        onClick={() => setSelectedItem(prod)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${
                          selectedItem.name === prod.name
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{prod.name} (<strong>{prod.code}</strong>)</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${selectedItem.name === prod.name ? 'bg-white/20 text-white' : 'bg-slate-150 text-slate-600'}`}>{prod.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column Technical Sheet */}
              <div className="lg:col-span-7 bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="border-b border-home-grau/20 pb-3 mb-4 flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Normatives Bauproduktdatenblatt</span>
                      <h3 className="text-base font-bold text-slate-800 mt-1">{selectedItem.name}</h3>
                    </div>
                    <div className="bg-white px-2 py-1 rounded border border-slate-200 text-right">
                      <span className="text-[9px] text-slate-400 block font-bold font-mono">REGELWERK</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{selectedItem.standard}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal mb-4">
                    {selectedItem.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 text-center">
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Druckfestigkeit</span>
                      <span className="text-xxs font-bold text-slate-700 font-mono leading-tight block">{selectedItem.strengthClass}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Hauptbindemittel</span>
                      <span className="text-xxs font-bold text-slate-700 leading-tight block">{selectedItem.binder.split('(')[0]}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Trockenrohdichte</span>
                      <span className="text-xxs font-bold text-slate-700 font-mono">{selectedItem.density}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Schwindverhalten</span>
                      <span className="text-xxs font-bold text-slate-700 leading-tight block">{selectedItem.shrinkage}</span>
                    </div>
                  </div>

                  {/* Advantages vs Disadvantages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600" /> Leistungsvorteile:
                      </span>
                      <ul className="space-y-1">
                        {selectedItem.advantages.map((adv, i) => (
                          <li key={i} className="text-xxs text-text-main/70 flex gap-1.5 items-start">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <ShieldAlert size={12} className="text-amber-600" /> Verarbeitungseinschränkungen:
                      </span>
                      <ul className="space-y-1">
                        {selectedItem.disadvantages.map((dis, i) => (
                          <li key={i} className="text-xxs text-text-main/70 flex gap-1.5 items-start">
                            <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                            <span>{dis}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Applications block at bottom */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 mt-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Standard-Einsatzgebiete (Regelkonform):</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.applications.map((app, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CHEMICAL / PHYSICAL BACKGROUND EXPLAINER */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-shiraz tracking-wider uppercase block flex items-center gap-1">
                  <Sparkles size={14} /> Gips vs. Anhydrit Abbindechemie
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  Gipsmörtel und Calciumsulfatestriche binden durch den Wiedereinbau von Kristallwasser ab. Baugips (Halbhydrat, <InlineMath math="\text{CaSO}_4 \cdot 0{,}5\,\text{H}_2\text{O}" />) reagiert mit Wasser zu Gips (Dihydrat, <InlineMath math="\text{CaSO}_4 \cdot 2\,\text{H}_2\text{O}" />). Diese Kristallisation bildet eine ineinander verfilzte Nadelstruktur, die die Festigkeit begründet. Sie schrumpfen dabei kaum und weisen eine hohe Endebenheit auf, bleiben jedoch wasserlöslich (nicht wasserbeständig!).
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-800 tracking-wider uppercase block flex items-center gap-1">
                  <Flame size={14} /> Karbonatisierung von Kalkputzen
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  Luftkalkputz erhärtet nicht hydraulisch, sondern durch die chemische Aufnahme von Kohlendioxid (<InlineMath math="\text{CO}_2" />) aus der Umgebungsluft (Karbonatisierung). Calciumhydroxid (<InlineMath math="\text{Ca(OH)}_2" />) reagiert langsam zu extrem hartem Kalkstein (<InlineMath math="\text{CaCO}_3" />) unter Freisetzung von Wasser. Dieser Prozess benötigt Wochen. Zugluft unterbindet den Carbonatisierungsstrom und erzeugt sandige, bröckelige Oberflächen.
                </p>
              </div>
            </div>

            {/* WERKSTROMÖRTEL - EXPLAINER */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 md:col-span-2 shadow-sm">
              <h3 className="font-bold text-shiraz text-base mb-2">Werktrockenmörtel (WTM) im Strukturwandel</h3>
              <p className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed mb-3">
                Zement und Kalk wurden historisch roh auf der Baustelle gemischt. Moderne Werktrockenmörtel werden im Werk vollautomatisiert hergestellt und ofengetrocknet geliefert. Das garantiert **Präzision im Bindemittelverhältnis** und schließt weitreichende Handfehler auf der Baustelle aus. Silosysteme in Verbindung mit automatischen Putzmaschinen steigern zudem die Baugeschwindigkeit erheblich.
              </p>
            </div>

            {/* Quality Standard Classifications (Manufacturer Neutral) */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm bg-slate-50/50">
              <h3 className="font-bold text-home-prim text-base mb-2 flex items-center gap-2">Standard-Anwendungskriterien für Systemputze</h3>
              <p className="text-xs text-text-main/60 mb-4 italic font-medium">
                Hinweis zur Herstellerneutralität: Zur Wahrung vollständiger Produktneutralität und den Richtlinien für öffentliche Ausschreibungen nach VOB/A werden hier ausschließlich genormte Leistungsgruppen aufgeführt.
              </p>
              <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2 pl-2">
                <li><span className="font-bold text-slate-800">Oberflächenqualität (Innenputze):</span> Unterteilung in Qualitätsstufen Q1 (abgezogen), Q2 (standardgeqvölbt - tapezierfähig), Q3 (feingeglättet) und Q4 (vollflächig gespachtelt - absolut plan).</li>
                <li><span className="font-bold text-slate-800">Festigkeitsklassen für Estriche:</span> Einteilung nach DIN EN 13813 in Druckfestigkeit (C5 bis C80) und Biegezugfestigkeit (F1 bis F50) zur Dimensionierung von Lastverteilungsschichten.</li>
                <li><span className="font-bold text-slate-800">Kalk-Zementputze (CR/CS III):</span> Universell beanspruchbares Allwettersystem, ideal für den dauerhaft bewitterten Außenbereich und feuchtebelastete Kellerzonen.</li>
                <li><span className="font-bold text-slate-800">Reine Silikat-Spachtelmassen:</span> Hochgradig dampfdiffusionsoffene Systeme, welche für historische Fassadensanierungen und bauphysikalisch anspruchsvolle Innendämmungen eingesetzt werden.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'praxis' && (
          <PraxisTabContent moduleKey="bp_putz_estrich" />
        )}

        {activeTab === 'innovation' && (
          <InnovationTabContent moduleKey="bp_putz_estrich" />
        )}
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Putz (Baustoff)', url: 'https://de.wikipedia.org/wiki/Putz_(Baustoff)' },
          { title: 'Estrich', url: 'https://de.wikipedia.org/wiki/Estrich' },
          { title: 'Mörtel', url: 'https://de.wikipedia.org/wiki/M%C3%B6rtel' }
        ]} 
        literatur={[ 
          'Probst, M.: Handbuch Putz und Estrich (Fraunhofer IRB Verlag).',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'IWM Industrieverband WerkMörtel e.V.: Technische Merkblätter für Werktrockenmörtel.',
          'Wohnungsbau-Ausschuss: Richtlinie für das Verputzen von Mauerwerk.'
        ]} 
        regelwerke={[ 
          { title: 'DIN EN 13914-1 (Planung, Zubereitung und Ausführung von Außen- und Innenputzen)' }, 
          { title: 'DIN 18550-1 (Planung, Zubereitung und Ausführung von Außen- und Innenputzen - Teil 1: Ergänzende Bestimmungen)' },
          { title: 'DIN 18560-1 bis 7 (Estriche im Bauwesen)' },
          { title: 'DIN EN 13813 (Estrichmörtel und Estrichmassen - Eigenschaften und Anforderungen)' },
          { title: 'DIN EN 998-1 (Festlegungen für Mörtel im Mauerwerksbau - Teil 1: Putzmörtel)' }
        ]} 
        formeln={[
          { 
            formel: '\\text{CaSO}_4 \\cdot 0{,}5\\,\\text{H}_2\\text{O} + 1{,}5\\,\\text{H}_2\\text{O} \\rightarrow \\text{CaSO}_4 \\cdot 2\\,\\text{H}_2\\text{O}', 
            erklaerung: 'Kristalline Abbindereaktion von Calciumsulfat-Halbhydrat zu Dihydrat unter leichter Volumenzunahme (ca. 1%).',
            quelle: 'DIN EN 13279'
          },
          { 
            formel: '\\text{Ca(OH)}_2 + \\text{CO}_2 \\rightarrow \\text{CaCO}_3 + \\text{H}_2\\text{O}', 
            erklaerung: 'Karbonatisierungsreaktion von Luftkalkmörtel (Kalksteinbildung an Luft unter Freisetzung von Reaktionswasser).',
            quelle: 'DIN EN 459'
          },
          {
            formel: 's_d = \\mu \\cdot d \\le 0{,}2\\,\\text{m}',
            erklaerung: 'Diffusionsäquivalente Luftschichtdicke sd für hoch diffusionsoffene mineralische Innenputze zur Vermeidung von Feuchteakkumulation.',
            quelle: 'DIN 4108-3'
          }
        ]} 
      />
    </div>
  );
}
