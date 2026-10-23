import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Layers, BookOpen, CheckCircle2, Lightbulb, AlertTriangle, ShieldCheck, Sparkles, ArrowRight, Calculator } from 'lucide-react';
import { InnovationPraxisSection, PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import { KlebstoffBerater } from '@/src/components/KlebstoffBerater';

interface AdhesiveProduct {
  name: string;
  category: string;
  standard: string;
  chemicalBase: string;
  curingType: string;
  durabilityClass: string;
  maxElongation: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
}

const adhesiveProducts: AdhesiveProduct[] = [
  {
    name: 'Zementärer Flexmörtel (Fliesenkleber)',
    category: 'Fliesenkleber nach DIN EN 12004',
    standard: 'DIN EN 12004 (Klasse C2 TE S1)',
    chemicalBase: 'Portlandzement mit redispergierbaren Kunststoffen',
    curingType: 'Hydraulische Erhärtung + Polymerfilmbildung',
    durabilityClass: 'C2 (Haftfestigkeit ≥ 1,0 N/mm²)',
    maxElongation: 'Verformung S1 (≥ 2,5 mm und < 5,0 mm)',
    description: 'Kunststoffmodifizierter hydraulischer Dünnbettmörtel. Die Polymerzusätze verbessern die Scherfestigkeit und Flexibilität, sodass thermische Längenänderungen (z.B. bei Fußbodenheizungen) schadensfrei aufgenommen werden.',
    advantages: ['Frostsicher und wasserbeständig (für außen geeignet)', 'Verformbar (Klasse S1)', 'Verlängerte Offenzeit und verringertes Abrutschen'],
    disadvantages: ['Zementallergie-Risiko bei Verarbeitung', 'Feuchtigkeitsempfindliche Lagerung des Werktrockenpulvers']
  },
  {
    name: 'D3 / D4 PVAc-Holzleim (Weißleim)',
    category: 'Holzklebemörtel nach DIN EN 204',
    standard: 'DIN EN 204 / 205 (Klasse D3/D4)',
    chemicalBase: 'Polyvinylacetat (PVAc-Dispersion)',
    curingType: 'Physikalische Trocknung (Wasserverdunstung)',
    durabilityClass: 'D3 (Innen Nassbereich / Außen geschützt)',
    maxElongation: 'Gering (starr härtende Fuge)',
    description: 'Klassischer Holzleim für den konstruktiven Innenausbau. D3-Leime sind widerstandsfähig gegen kurzfristige Feuchtigkeitsbelastungen. Durch Beigabe eines Isocyanat-Härters wird die wasserfeste Klasse D4 erreicht.',
    advantages: ['Lösemittelfrei', 'Transparente, unauffällige Fuge nach Trocknung', 'Klebfuge oft fester als das Holz selbst'],
    disadvantages: ['D3-Klebung ist nicht dauerhaft witterungsbeständig im Außenbereich', 'Erfordert zwingend Pressdruck beim Abbinden']
  },
  {
    name: 'Neutralvernetzendes Sanitärsilikon',
    category: 'Fugendichtstoff nach DIN EN 15651-3',
    standard: 'DIN EN 15651-3 (Klasse XS1)',
    chemicalBase: 'Polydimethylsiloxan (Alkoxy- / Oxim-System)',
    curingType: 'Chemisch vernetzend durch Luftfeuchtigkeit (Kondensation)',
    durabilityClass: 'XS1 (Höchste Schimmelresistenz)',
    maxElongation: 'Zulässige Gesamtverformung 25 %',
    description: 'Dauerelastischer Dichtstoff für Dehnfugen in Bädern und Fliesenbelägen. Neutralvernetzende Silikone setzen beim Abbinden unbedenkliche Alkohole frei und greifen im Gegensatz zu essigsäurehaltigen Systemen Metalle und Beton nicht an.',
    advantages: ['Sehr gute Pilzbeständigkeit (fungizid ausgerüstet)', 'Sehr hohe Rückstellfähigkeit und UV-Resistenz', 'Haftet ohne Primer auf Glas, Keramik und Emaille'],
    disadvantages: ['Kann Natursteine (Marmor, Granit) durch Weichmacherwanderung verfärben', 'Befallene Fugen müssen mechanisch saniert werden']
  },
  {
    name: 'Plastisch-elastisches Fugenacryl',
    category: 'Dichtstoff nach DIN EN 15651-1',
    standard: 'DIN EN 15651-1 (Klasse F-EXT-INT 12.5P)',
    chemicalBase: 'Polyacrylsäure-Ester-Dispersion',
    curingType: 'Physikalische Trocknung (Wasserverdunstung)',
    durabilityClass: 'Haftung ohne Rissbildung bei mäßiger Dehnung',
    maxElongation: 'Zulässige Gesamtverformung 7,5 % - 12,5 %',
    description: 'Plastisch erhärtender Fugendichtstoff primär für den trockenen Innenausbau. Acrylate zeichnen sich durch ihre direkte Überstreichbarkeit aus. Durch die Wasserverdampfung kommt es zu einem messbaren Volumenschwund.',
    advantages: ['Hervorragend überstreichbar und lückenlos überputzbar', 'Nahezu geruchlos und umweltfreundlich', 'Haftet hervorragend auf Putz, Holz und Trockenbaugips'],
    disadvantages: ['Nicht für Dauernassbereiche geeignet (quillt wieder auf)', 'Geringe Dehnfähigkeit im Vergleich zu Silikon']
  },
  {
    name: 'MS-Hybrid-Polymer Kleber',
    category: 'Kombinierter Montageklebstoff',
    standard: 'DIN EN 15651-1 / ISO 11600',
    chemicalBase: 'Silanterminiertes Polymer (STP / MS-Polymer)',
    curingType: 'Chemisch vernetzend durch Feuchtigkeit',
    durabilityClass: 'Sehr hohe dynamische Zugbelastbarkeit',
    maxElongation: 'Zulässige Gesamtverformung ca. 20 %',
    description: 'Hochelastischer Hybrid-Kleb- und Dichtstoff, der die besten Eigenschaften von Silikonen (Elastizität) und Polyurethanen (Zähigkeit, lackierbar) kombiniert. Hohe Anfangshaftung.',
    advantages: ['Hohe Anfangshaftung (oft ohne Fixierung)', 'Haftet auch auf feuchten und unebenen Untergründen', 'Völlig frei von Isocyanaten, Silikonen und Lösemitteln'],
    disadvantages: ['Höherer Preis im Vergleich zu PUR oder Acryl', 'Härterückstand lässt sich mechanisch nur mühsam entfernen']
  }
];

export default function BpKlebstoffe() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'berater' | 'praxis' | 'innovation'>('allgemein');
  const [selectedItem, setSelectedItem] = useState<AdhesiveProduct>(adhesiveProducts[0]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Kleb- &amp; Dichtstoffsysteme (Bauprodukte)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
          <p>
            Anforderungen nach DIN EN 12004 und DIN EN 15651. Bauchemische Differenzierung zwischen Adhäsion und Kohäsion, anwendungsspezifischen Beanspruchungsklassen und dem werkstofflichen Korrosionsschutz.
          </p>
        </div>

        {/* Primary Tabs Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Basiswissen &amp; Produktkatalog
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'berater' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('berater')}
          >
            <Calculator size={16} /> Fugen- &amp; Klebetechnik-Rechner
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
            
            {/* COMPONENT INTERACTIVE LIST GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Selector List */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Verfügbare Kleb- und Dichtstoffe:</span>
                
                <div className="flex flex-col gap-2">
                  {adhesiveProducts.map((prod) => (
                    <button
                      key={prod.name}
                      onClick={() => setSelectedItem(prod)}
                      className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex justify-between items-center cursor-pointer ${
                        selectedItem.name === prod.name
                          ? 'bg-shiraz text-white border-shiraz shadow-md scale-[1.01]'
                          : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider block ${selectedItem.name === prod.name ? 'text-white/60' : 'text-text-main/40'}`}>
                          {prod.category}
                        </span>
                        <span className="font-extrabold text-xs lg:text-sm">{prod.name}</span>
                      </div>
                      <ArrowRight size={16} className={`opacity-70 ${selectedItem.name === prod.name ? 'translate-x-1' : ''} transition-transform`} />
                    </button>
                  ))}
                </div>

                <div className="bg-amber-50/45 p-4 border border-amber-200/50 rounded-xl space-y-1.5 text-xs text-amber-950 leading-relaxed">
                  <div className="flex gap-1.5 items-center font-bold">
                    <AlertTriangle size={14} className="text-amber-800" />
                    <span>Silikon-Dreipunfthaftung verhindern!</span>
                  </div>
                  <p className="font-normal text-[11px] text-amber-950/80">
                    Bei Bau-Dehnungsfugen darf das Silikon zwingend <strong>nur an zwei Fugenflanken</strong> anhaften. Kommt es zu einer Haftung am Fugenboden (Dreipunkthaftung), reißt der Dichtstoff bei Fugenbewegungen, weil er sich nicht frei dehnen kann. Abhilfe schaffen **Fugenfüllprofile/Rundschnüre** aus PE.
                  </p>
                </div>
              </div>

              {/* Right Technical Sheet */}
              <div className="lg:col-span-7 bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="border-b border-home-grau/20 pb-3 mb-4 flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Werkstoffdatenblatt Bauchemie</span>
                      <h3 className="text-base font-bold text-slate-800 mt-1">{selectedItem.name}</h3>
                    </div>
                    <div className="bg-white px-2 py-1 rounded border border-slate-200 text-right font-mono">
                      <span className="text-[9px] text-slate-400 block font-bold leading-none">PRÜFNORM</span>
                      <span className="text-xs font-bold text-slate-800">{selectedItem.standard}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal mb-5">
                    {selectedItem.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Chemische Basis</span>
                      <span className="text-xxs font-bold text-slate-700 leading-snug block">{selectedItem.chemicalBase.split(' (')[0]}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Abbinde-Prinzip</span>
                      <span className="text-xxs font-bold text-slate-700 leading-snug block">{selectedItem.curingType.split(' (')[0]}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Beanspruchungsklasse</span>
                      <span className="text-xxs font-bold text-slate-700 leading-snug block truncate" title={selectedItem.durabilityClass}>{selectedItem.durabilityClass}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Dehnfähigkeit</span>
                      <span className="text-xxs font-bold text-slate-700 leading-snug block">{selectedItem.maxElongation}</span>
                    </div>
                  </div>

                  {/* Advantages vs Disadvantages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-s600" /> Stärken:
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
                        <AlertTriangle size={12} className="text-amber-600" /> Einschränkungen:
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
              </div>
            </div>

            {/* ADHESION VS COHESION SCIENTIFIC BACKGROUND CARD */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block flex items-center gap-1">
                  <Sparkles size={14} /> Adhäsion (Grenzflächenhaftung)
                </span>
                <p className="font-normal leading-relaxed text-slate-600">
                  Die physikalischen Wechselwirkungen an der Grenzfläche zwischen dem flüssigen Klebstofffilm und dem festen Untergrund. Sie basiert primär auf elektromagnetischen Kräften (Van-der-Waals-Kräfte, Wasserstoffbrückenbindungen) und mikromechanischer Verzahnung in den Poren des Werkstoffs. **Untergrundreinheit** ist hierfür die absolute Lebensader!
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block flex items-center gap-1">
                  <ShieldCheck size={14} /> Kohäsion (Innere Festigkeit)
                </span>
                <p className="font-normal leading-relaxed text-slate-600">
                  Beschreibt die inneren molekularen Bindungskräfte innerhalb der ausgehärteten Kleb- oder Dichtstoffschicht. Sie bestimmt, wie stark der ausgehärtete Klebstoff selbst mechanisch beansprucht werden kann. Nach dem Molekularaufbau fließen hier kovalente Hauptvalenzbindungen (Reaktionsharze wie Epoxid) oder mechanische Festkörperverfilmungen (Weißleim) ein.
                </p>
              </div>
            </div>

            {/* HERSTELLERNEUTRALE SYSTEMKLASSEN */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-4 bg-slate-50/50 space-y-3">
              <h3 className="font-bold text-home-prim text-base mb-1 flex items-center gap-2">Übersicht normgerechter Systemanwendungen im Hochbau (Herstellerneutral)</h3>
              <p className="text-xs text-text-main/60 leading-normal font-normal">
                Die chemische Zusammensetzung und Applikationstechnik von Kleb- und Dichtsystemen orientiert sich an streng normativen Leistungsklassen nach DIN EN 15651 (Teile 1-4) und anwendungsbezogenen Spezifikationen (z.B. IVD-Merkblätter).
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-normal pt-2">
                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1">
                  <span className="font-bold text-slate-800 block">Hochbau-Fassadendichtstoffe (DIN EN 15651-1 - Typ F)</span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed">
                    Systeme zur Abdichtung von Außenwandfugen (z.B. Betonfertigteilplatten nach DIN 18540). Typisch sind hochverformbare Polyurethane (PU) oder silanterminierte Polymere (STP) mit einer zulässigen Gesamtverformung (ZGV) von ≥ 25%, die thermische Dehnbelastungen dauerhaft abfedern.
                  </p>
                </div>

                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1">
                  <span className="font-bold text-slate-800 block">Sanitär- &amp; Feuchtraumdichtstoffe (DIN EN 15651-3 - Typ S)</span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed">
                    Spezialsysteme für Dehnungsfugen im Nassbereich (Sanitäreinrichtungen, Fliesenanschlüsse). Zum Schutz vor mikrobiellem Befall sind diese Silicondichtstoffe fungizid ausgerüstet (Sanitärdichtstoffe nach DIN EN 15651-3, Klassen XS1/XS2).
                  </p>
                </div>

                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1">
                  <span className="font-bold text-slate-800 block">Bodenfugensysteme (DIN EN 15651-4 - Typ PW)</span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed">
                    Hochelastische Systeme für befahrbare oder mechanisch beanspruchte Bodenflächen (Logistikhallen, Parkdecks). Sie erfordern Dichtstoffe mit höherer Shore-A-Härte, hoher Weiterreißfestigkeit und Beständigkeit gegen Treib- und Schmierstoffe (Hinweise in IVD-Merkblättern).
                  </p>
                </div>

                <div className="p-3 bg-white border border-home-grau/10 rounded-lg shadow-sm space-y-1">
                  <span className="font-bold text-slate-800 block">Konstruktive Bausystemverklebungen (DIN EN 1504-4)</span>
                  <p className="text-text-main/70 text-[11px] leading-relaxed">
                    Strukturelle Epoxidharz-Klebemittel zur hochfesten Verklebung von Betonbauteilen, Stahllaschen oder Carbonfaserlamellen (CFK) zur statischen Tragwerkssanierung. Sie haben hohe Haft- und Scherfestigkeiten (starre Klebefuge).
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'berater' ? (
          <KlebstoffBerater />
        ) : activeTab === 'praxis' ? (
          <PraxisTabContent moduleKey="bp_klebstoffe" />
        ) : (
          <InnovationTabContent moduleKey="bp_klebstoffe" />
        )}
      </div>

      <InnovationPraxisSection moduleKey="bp_klebstoffe" />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Mindestfugenbreite einer Außenwandfuge"
          zielGleichung="b_{min} = \frac{\Delta l}{ZGV}"
          normQuelle="DIN 18540 (Fugen im Außenwandbereich); α_T und ZGV als Lehrwerte"
          schritte={[
            { titel: '1. Längenänderung der Elemente', formel: '\\Delta l = l \\cdot \\alpha_T \\cdot \\Delta T = 6000 \\cdot 10 \\cdot 10^{-6} \\cdot 80 = 4{,}8\\,\\text{mm}', erklaerung: 'Betonfertigteil 6 m, Temperaturspanne der Oberfläche 80 K.' },
            { titel: '2. Zulässige Gesamtverformung', formel: 'ZGV = 25\\,\\%', erklaerung: 'Für elastische Dichtstoffe (PU, STP).' },
            { titel: '3. Erforderliche Fugenbreite', formel: 'b_{min} = 4{,}8 / 0{,}25 = 19\\,\\text{mm}', erklaerung: 'Zuzüglich Maßtoleranzen; in der Regel auf 20 mm gerundet.' },
          ]}
          ergebnisHinweis="Ist die Fuge zu schmal, wird der Dichtstoff überdehnt und reißt – Fugenbreiten werden aus der Bewegung, nicht nach Gefühl festgelegt."
        />
      </div>

      <ModulTest moduleId="bp_klebstoffe" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Klebstoff', url: 'https://de.wikipedia.org/wiki/Klebstoff' },
          { title: 'Dichtstoff', url: 'https://de.wikipedia.org/wiki/Dichtstoff' }
        ]} 
        literatur={[ 
          'Habenicht, G.: Kleben – Grundlagen, Technologien, Anwendungen. 6. Aufl., Berlin: Springer 2009',
          'Industrieverband Dichtstoffe e. V. (IVD): IVD-Merkblätter zu Fugenabdichtungen, jeweils aktuelle Ausgabe (z. B. Nr. 27 Fassadenfugen, Nr. 30 Montageklebstoffe, Nr. 35 Dichten und Kleben am Bau; www.abdichten.de)' 
        ]} 
        regelwerke={[ 
          { title: 'DIN EN 12004 (Mörtel und Klebstoffe für Fliesen und Platten)' },
          { title: 'DIN EN 15651 (Fugendichtstoffe für nicht tragende Anwendungen in Gebäuden)' },
          { title: 'DIN EN 204 (Beurteilung von Klebstoffen für nicht tragende Bauteile zur Holzverbindung)' }
        ]} 
        formeln={[
          { formel: '\\tau = \\frac{F}{A_G} \\quad \\text{[N/mm²]}', erklaerung: 'Mittlere Scherfestigkeit der Klebfuge (Bruchkraft F je Klebfläche A_G).', quelle: 'z. B. DIN EN 205 (Holzklebstoffe)' },
          { formel: 'ZGV = \\frac{b_{max} - b_{min}}{b_m} \\cdot 100\\,\\%', erklaerung: 'Zulässige Gesamtverformung des Fugendichtstoffs: Bewegung der Fugenbreite bezogen auf die mittlere Fugenbreite b_m (Bemessung von Fugenbreiten).', quelle: 'DIN 18540 / IVD-Merkblätter' }
        ]} 
      />
    </div>
  );
}
