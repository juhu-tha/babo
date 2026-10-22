import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Layers, BookOpen, CheckCircle2, Lightbulb, ShieldAlert, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';

interface FastenerProduct {
  name: string;
  category: string;
  standard: string;
  loadCapacity: string;
  edgeDistance: string;
  installTemp: string;
  substrate: string;
  failureMode: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
}

const anchorProducts: FastenerProduct[] = [
  {
    name: 'M4 - M16 Nylon-Spreizdübel',
    category: 'Einfacher Kunststoffdübel',
    standard: 'DIN EN 1992-4 / ETA',
    loadCapacity: '0,1 kN - 1,5 kN (Gering bis mittel)',
    edgeDistance: 'Große Randabstände erforderlich',
    installTemp: '-40 °C bis +80 °C (Nutzung)',
    substrate: 'Vollmauerwerk, Kalksandstein, Standard-Beton',
    failureMode: 'Herausziehen (Schlupf), Kunststoffschandlung',
    description: 'Universeller Spreizdübel aus Polyamid (Nylon). Dehnt sich beim Eindrehen der Schraube kraftschlüssig an die Flanken der Bohrlochwandung aus. In Hochlochziegeln nur bedingt mit Siebhülsen einsetzbar.',
    advantages: ['Sehr kostengünstiges Bauteil', 'Einfache visuelle Kontrolle', 'Unempfindlich gegen leichte Bohrlochtoleranzen'],
    disadvantages: ['Nicht für sicherheitsrelevante Anschlüsse zugelassen (kein Personenschutz)', 'Hohe Alterungssensibilität', 'Kriecht unter dauerhafter Zuglast']
  },
  {
    name: 'M8 - M24 Bolzenanker (Spreizanker)',
    category: 'Mechanischer Lastanker',
    standard: 'DIN EN 1992-4 (ehem. ETAG 001)',
    loadCapacity: '5,0 kN - 45,0 kN (Sehr hoch)',
    edgeDistance: 'Mäßig (hohe Spreizkräfte im Untergrund)',
    installTemp: 'Temperaturunabhängig',
    substrate: 'Gerissener & ungerissener Beton (min. C20/25)',
    failureMode: 'Betonausbruch (Konus), Stahlversagen des Bolzens',
    description: 'Mechanisches Befestigungssystem mit Kraftkontrolle. Beim Anziehen der Mutter wird der Konusbolzen in den Spreizclip gezogen, der sich gegen das Bohrloch verpresst.',
    advantages: ['Sofort voll belastbar nach fachgerechtem Drehmomentanzug', 'Zulassung für gerissenen Beton und Erdbebenzonen (C1/C2)', 'Hohe Querlastübertragung'],
    disadvantages: ['Große Spreizdrücke erfordern hohe Rand-/Achsabstände', 'Kein Spielraum für Bohrtiefenunterschreitungen', 'Nicht im Mauerwerk einsetzbar']
  },
  {
    name: 'M8 - M30 Verbundmörtel (Injektionskleber)',
    category: 'Chemischer Verbunddübel',
    standard: 'DIN EN 1992-4 / EAD 330499',
    loadCapacity: '10,0 kN - 120,0 kN (Extrem hoch)',
    edgeDistance: 'Minimal (vollständig spreizdruckfrei)',
    installTemp: 'Min. +5 °C bis +40 °C (beim Verarbeiten)',
    substrate: 'Beton, hochporöses Mauerwerk, Naturwerkstein',
    failureMode: 'Verbundversagen (Herausziehen zwischen Mörtel/Beton)',
    description: 'Hocheffektives Befestigungssystem auf duroplastischer Reaktionsharzbasis (Epoxidharz EP, Vinylester VES oder Polyester). Bohrloch wird mit Mörtel befüllt und die Ankerstange eingedreht. Klebt fugenlos.',
    advantages: ['Absolut spreizdruckfreie Lastverteilung', 'Minimalster Rand- und Achsabstand möglich', 'Wasser- und dampfdichter Bohrlochverschluss'],
    disadvantages: ['Chemische Aushärtezeit muss strikt beachtet werden', 'Penible Bohrlochreinigung (Ausblasen/Bürsten) zwingend erforderlich', 'Temperaturabhängiger Einbau']
  },
  {
    name: 'Hinterschnittanker (z. B. Zykon-System als Beispiel)',
    category: 'Dauerwechsel-Schwerlastanker',
    standard: 'DIN EN 1992-4 (Zulassung)',
    loadCapacity: '15,0 kN - 80,0 kN (Extrem sicher)',
    edgeDistance: 'Gering',
    installTemp: 'Temperaturunabhängig',
    substrate: 'Gerissener Beton (selbst unter nuklearen Lasten)',
    failureMode: 'Reiner Stahlbruch (höchste Formschlusswirkung)',
    description: 'Formgeschlossener Anker. Erfordert einen Spezialbohrer, der am Bohrlochgrund eine asymmetrische Hinterschnittkaverne ausfräst. Die Ankerhülse wird formschlüssig aufgeweitet.',
    advantages: ['Sicherste Formschlussverankerung (kein Schlupf)', 'Optimal für dynamisch beanspruchte/vibrierende Großmaschinen', 'Minimale Randabstände'],
    disadvantages: ['Sehr teure Spezialwerkzeuge erforderlich', 'Hoher Arbeits- und Kontrollaufwand beim Bohren']
  }
];

export default function BpBefestigung() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation'>('allgemein');
  const [selectedFastener, setSelectedFastener] = useState<FastenerProduct>(anchorProducts[1]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Befestigungstechnik &amp; Verankerung (Bauprodukte)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 animate-in fade-in">
          <p>
            Anforderungen nach DIN EN 1992-4 (Eurocode 2 - Teil 4). Lastübertragung in feste Untergründe mittels mechanischer Spreizwirkung, formschlüssigem Hinterschnitt und stoffschlüssigem Polyester- oder Epoxidharzverbund.
          </p>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Basiswissen &amp; Verankerungs-Katalog
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

        {activeTab === 'allgemein' ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* INTERACTIVE COMPONENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Selector List */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Befestigungssysteme herstellerneutral:</span>
                <div className="flex flex-col gap-2">
                  {anchorProducts.map((prod) => (
                    <button
                      key={prod.name}
                      onClick={() => setSelectedFastener(prod)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                        selectedFastener.name === prod.name
                          ? 'bg-shiraz text-white border-shiraz shadow-md'
                          : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider block ${selectedFastener.name === prod.name ? 'text-white/60' : 'text-text-main/40'}`}>
                          {prod.category}
                        </span>
                        <span className="font-extrabold text-xs lg:text-sm">{prod.name}</span>
                      </div>
                      <ArrowRight size={16} className={`opacity-70 ${selectedFastener.name === prod.name ? 'translate-x-1' : ''} transition-transform`} />
                    </button>
                  ))}
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-2 mt-4 text-xs text-red-950 leading-relaxed">
                  <div className="flex gap-1.5 items-center font-bold">
                    <ShieldAlert size={14} className="text-red-800" />
                    <span>KRITISCH: Drehmoment-Überprüfung</span>
                  </div>
                  <p className="font-normal text-[11px] text-red-900">
                    Mechanische Bolzenanker müssen zwingend mit einem kalibrierten <strong>Drehmomentschlüssel</strong> geschraubt werden (T_inst). Ein zu geringes Moment führt zu gefährlichem Schlupf und reduzierter Tragfähigkeit; ein zu hohes Moment verdreht den Stahlbolzen oder sprengt das minerale Betongefüge lokal auf!
                  </p>
                </div>
              </div>

              {/* Right Factsheet Display Card */}
              <div className="lg:col-span-7 bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="border-b border-home-grau/20 pb-3 mb-4 flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Normatives Befestigungsdatenblatt</span>
                      <h3 className="text-base font-bold text-slate-800 mt-1">{selectedFastener.name}</h3>
                    </div>
                    <div className="bg-white px-2 py-1 rounded border border-slate-200 text-right font-mono">
                      <span className="text-[9px] text-slate-400 block font-bold leading-none">BEMESSUNGSREGEL</span>
                      <span className="text-xs font-bold text-slate-800">{selectedFastener.standard}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal mb-5">
                    {selectedFastener.description}
                  </p>

                  {/* Scientific Anchor Properties Block */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Bemessungszuglast</span>
                      <span className="text-xxs font-bold text-slate-700 font-mono block leading-snug">{selectedFastener.loadCapacity}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Randabstand min.</span>
                      <span className="text-xxs font-bold text-slate-700 leading-snug block">{selectedFastener.edgeDistance}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Untergrund-Freigabe</span>
                      <span className="text-[9px] font-bold text-slate-705 leading-snug block truncate" title={selectedFastener.substrate}>{selectedFastener.substrate}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Versagensmodus</span>
                      <span className="text-[9px] font-bold text-slate-700 leading-tight block truncate" title={selectedFastener.failureMode}>{selectedFastener.failureMode}</span>
                    </div>
                  </div>

                  {/* Advantages vs Disadvantages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-s600" /> Systemvorteile:
                      </span>
                      <ul className="space-y-1">
                        {selectedFastener.advantages.map((adv, i) => (
                          <li key={i} className="text-xxs text-text-main/70 flex gap-1.5 items-start">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle size={12} className="text-amber-600" /> Einschränkungen/Risiken:
                      </span>
                      <ul className="space-y-1">
                        {selectedFastener.disadvantages.map((dis, i) => (
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
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Zulässige Temperaturbeständigkeit:</div>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold font-mono">
                    {selectedFastener.installTemp}
                  </span>
                </div>
              </div>
            </div>

            {/* FAILURE MODES EXPLAINED (SCIENTIFIC BACKGROUND ACCENTS) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-4">
              <h3 className="font-extrabold text-sm text-text-main mb-3 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <Sparkles className="text-shiraz" size={18} /> Versagensmodi von Betonverankerungen nach DIN EN 1992-4
              </h3>
              <p className="text-xs text-text-main/75 leading-relaxed mb-4">
                Bei der Bemessung einer Befestigung in Beton müssen fünf physische Versagensgrenzen unter Zuglast rechnerisch überprüft werden:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center font-medium">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold block mb-1">1. Stahlversagen</span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal">Der Zugbolzen reißt mechanisch ab, weil seine Zugstreckgrenze überschritten wurde (N_Rk,s = A_s * f_uk).</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold block mb-1">2. Herausziehen</span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal">Der Anker rutscht mitsamt dem Spreizkeil schlupfartig aus dem Bohrloch (Herausziehwiderstand N_Rk,p).</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold block mb-1">3. Betonausbruch</span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal">Unter Zuglast platzt ein trichterförmiger Betonkegel aus (35° Winkel). Begrenzt durch Verankerungstiefe h_ef.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold block mb-1">4. Gespaltenes Beton</span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal">Der Spreizdruck oder die äußere Last schneidet den Betonquerschnitt vollständig entzwei (Splitting-Versagen).</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold block mb-1">5. Pry-out Versagen</span>
                  <p className="text-[10px] text-slate-500 font-normal leading-normal">Bei Querkraftpressungen bricht die dem Vektor entgegengesetzte Betonkante mitsamt dem Dübelfuß aus.</p>
                </div>
              </div>
            </div>

            {/* SYSTEM OVERVIEW */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-4 bg-slate-50/50">
              <h3 className="font-bold text-home-prim text-base mb-2 flex items-center gap-2">Marktübersicht typischer Systemlösungen (Herstellerneutral)</h3>
              <p className="text-xs text-text-main/60 mb-4 italic">
                Hinweis zur Herstellerneutralität: Die nachfolgende Auflistung dient als unverbindliche Übersicht marktrelevanter Befestigungs- und Verbindungssysteme zur Erleichterung der baupraktischen Orientierung und Normenrecherche im Rahmen der akademischen Lehre.
              </p>
              <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2 pl-2">
                <li><span className="font-bold text-slate-800">Injektionssysteme:</span> Zementäre Hinterschnittsysteme und Zweikomponenten-Injektionsmörtelsysteme mit allgemein bauaufsichtlichen ETA-Zulassungen für gerissenen Beton.</li>
                <li><span className="font-bold text-slate-800">Bolzenanker &amp; Verbundanker:</span> Schwere mechanische Bolzenankersysteme und Epoxidharz-Injektionsklebstoffe zur Brückensanierung und Verankerung schwerer Stahlkonstruktionen.</li>
                <li><span className="font-bold text-slate-800">Holzbauschraubensysteme:</span> Vollgewinde-Holzbauschrauben zur statisch wirksamen Bemessung und Lastabtragung von Holzständerwerken nach Eurocode 5.</li>
                <li><span className="font-bold text-slate-800">Ankerschienensysteme:</span> System-Ankerschienen zum rüttelfreien Einbetonieren in die Bewehrungslage vor dem Einbringen von Frischbeton.</li>
              </ul>
            </div>
          </div>
        ) : activeTab === 'praxis' ? (
          <PraxisTabContent moduleKey="bp_befestigung" />
        ) : (
          <InnovationTabContent moduleKey="bp_befestigung" />
        )}
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Dübel', url: 'https://de.wikipedia.org/wiki/D%C3%BCbel' },
          { title: 'Befestigungstechnik', url: 'https://de.wikipedia.org/wiki/Befestigungstechnik' }
        ]} 
        literatur={[ 
          'Eligehausen, R. et al.: Anchors in Concrete and Masonry Structures.',
          'Mahrenholtz, C.: Tragverhalten von Befestigungen unter Erdbebeneinwirkungen.', 
          'Wendehorst Bautechnische Zahlentafeln, 38. Auflage, Springer Vieweg 2026' 
        ]} 
        regelwerke={[ 
          { title: 'DIN EN 1992-4 (Eurocode 2 - Bemessung der Verankerung von Befestigungen in Beton)' }, 
          { title: 'EAD 330499 (Post-installed Fasteners in Concrete - Europäische Bewertungsdokumente EOTA)', url: 'https://www.eota.eu/' },
          { title: 'EOTA TR 069 (Design Method for Anchorages with Post-installed Fasteners)', url: 'https://www.eota.eu/' }
        ]} 
        formeln={[
          { 
            formel: 'N_{Rk,c} = N_{Rk,c}^0 \\cdot \\frac{A_{c,N}}{A_{c,N}^0} \\cdot \\psi_{s,N} \\cdot \\psi_{re,N} \\cdot \\psi_{ec,N} \\cdot \\psi_{M,N}', 
            erklaerung: 'Charakteristischer Widerstand gegen Betonausbruch (Betonkonus) nach Eurocode 2 (DIN EN 1992-4) unter Berücksichtigung von Randabständen und Gruppenwirkungen.',
            quelle: 'DIN EN 1992-4 Abs. 7.2.1.4'
          },
          { 
            formel: '\\beta_N = \\frac{N_{Ed}}{N_{Rd}} \\le 1{,}0', 
            erklaerung: 'Auslastungsgrad des Befestigungsmittels unter einwirkender Zugbeanspruchung NEd gegenüber dem Bemessungswiderstand NRd.',
            quelle: 'DIN EN 1992-4'
          }
        ]} 
      />
    </div>
  );
}
