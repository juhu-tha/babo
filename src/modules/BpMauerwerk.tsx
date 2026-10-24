import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Layers, BookOpen, ShieldAlert, ArrowRight, CheckCircle2, Lightbulb, Settings, Settings as ToolIcon, Sparkles, AlertTriangle } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';

interface MauerwerkProduct {
  name: string;
  code: string;
  standard: string;
  lambdaRange: string;
  densityRange: string;
  strengthClass: string;
  mortarType: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  applications: string[];
}

const masonryProducts: MauerwerkProduct[] = [
  {
    name: 'Mauerziegel (Ton)',
    code: 'HLz / Planziegel',
    standard: 'DIN EN 771-1',
    lambdaRange: '0,07 - 0,14 W/(m·K)',
    densityRange: '600 - 1000 kg/m³',
    strengthClass: 'Druckfestigkeitsklasse 6 bis 20',
    mortarType: 'Dünnbettmörtel / Leichtmauermörtel',
    description: 'Gebranntes Tonprodukt mit hohem Lochanteil. Moderne Hintermauerziegel weisen feine Mikroporen im Gefüge auf und sind oft mit Mineralwolle- oder Perlitfüllungen versehen.',
    advantages: ['Ausgezeichnete kapillare Feuchteregulation', 'Sehr gute bauphysikalische Allround-Eigenschaften', 'Kein nennenswertes Schwindverhalten'],
    disadvantages: ['Erschwerte Verdübelung durch Lochstruktur', 'Empfindlich gegen Frost während der Rohbauphase'],
    applications: ['Tragende Außenwände im mehrgeschossigen Wohnungsbau', 'Monolithische Wandkonstruktionen ohne WDVS', 'Vormauerziegel (Klinker) für Sichtfassaden']
  },
  {
    name: 'Klinker (Vormauerziegel)',
    code: 'KMz (Hochtemperaturklinker)',
    standard: 'DIN EN 771-1 / DIN 105',
    lambdaRange: '0,90 - 1,20 W/(m·K)',
    densityRange: '1800 - 2200 kg/m³',
    strengthClass: 'Druckfestigkeitsklasse 28 bis 60',
    mortarType: 'Zementmörtel / Trassmörtel',
    description: 'Bis zur beginnenden Sinterung gebrannte Ziegel mit geringer Wasseraufnahme (≤ 6 M.-%). Sie sind frostbeständig, widerstandsfähig gegen Säuren und mechanisch hoch belastbar.',
    advantages: ['Witterungs- und frostbeständig', 'Schmutzunempfindliche, wartungsarme Fassaden', 'Hohe mechanische Widerstandsfähigkeit'],
    disadvantages: ['Geringe Wärmedämmung', 'Meist als Vormauerschale im zweischaligen Mauerwerk – aufwendig'],
    applications: ['Sichtmauerwerk und Verblendschalen im Außenbereich', 'Gewölbekonstruktionen, Pflasterungen und Sockelbereiche', 'Historische Industriebauten']
  },
  {
    name: 'Kalksandstein',
    code: 'KS / KS-L / KS-XL',
    standard: 'DIN EN 771-2',
    lambdaRange: '0,70 - 1,30 W/(m·K)',
    densityRange: '1400 - 2200 kg/m³',
    strengthClass: 'Druckfestigkeitsklasse 12 bis 36',
    mortarType: 'Dünnbettmörtel / Normalmauermörtel',
    description: 'Aus Kalk und Quarzsand gepresster, unter Dampfdruck gehärteter Stein. Hohe Rohdichte und Festigkeit – sehr gut für Lastabtrag und Schallschutz.',
    advantages: ['Hervorragender Schallschutz durch hohes Raumgewicht', 'Hohe Druckfestigkeit (günstig bei Lastkonzentrationen)', 'Sehr hohe Maßhaltigkeit'],
    disadvantages: ['Sehr schlechte Wärmedämmeigenschaften', 'Hohes physikalisches Eigengewicht (erfordert Kranhilfen bei XL-Formaten)'],
    applications: ['Wohnungstrennwände (Schallschutz)', 'Tragende Innenwände mit geringer Wanddicke', 'Kellerwände']
  },
  {
    name: 'Porenbetonstein',
    code: 'PP / PPE',
    standard: 'DIN EN 771-4',
    lambdaRange: '0,07 - 0,16 W/(m·K)',
    densityRange: '300 - 650 kg/m³',
    strengthClass: 'Druckfestigkeitsklasse 2 bis 8',
    mortarType: 'Dünnbettmörtel (1 mm Fuge)',
    description: 'Aus Quarzsand, Kalk, Zement und Wasser; Aluminiumpulver treibt die Masse auf, danach Härtung unter Dampfdruck. Der hohe Porenanteil sorgt für gute Wärmedämmung.',
    advantages: ['Sehr geringe Wärmeleitfähigkeit (λ ab ca. 0,07 W/(mK))', 'Leicht und einfach zuzuschneiden', 'Maßgenau für Dünnbettmörtel'],
    disadvantages: ['Geringere Druckfestigkeiten (Vorsicht bei Einzellasten)', 'Stark saugend und hydrophil (erfordert schützende Putzlagen)'],
    applications: ['KfW-Effizienzhäuser monolithisch', 'Nachträgliche Umbauten (geringe Deckenauflast)', 'Brandwände']
  },
  {
    name: 'Leichtbeton und Bimsstein',
    code: 'Vbl / Hbl (Liapor / Bims)',
    standard: 'DIN EN 771-3',
    lambdaRange: '0,10 - 0,21 W/(m·K)',
    densityRange: '500 - 1200 kg/m³',
    strengthClass: 'Druckfestigkeitsklasse 2 bis 12',
    mortarType: 'Leichtmauermörtel / Normalmauermörtel',
    description: 'Zementgebundene Leichtzuschlagstoffe wie Naturbims oder Blähton. Verbindet gute Feuchtebeständigkeit mit mäßiger Wärmedämmung und gutem Schallschutz.',
    advantages: ['Ausgezeichnete Putzhaftung mineralischer Mörtelsysteme', 'Sehr gute Brandwiderstandseigenschaften', 'Gute ökologische Einordnung (Naturbims)'],
    disadvantages: ['Rohstoffvorkommen (Naturbims) regional begrenzt', 'Staubentwicklung bei mechanischer Bearbeitung'],
    applications: ['Skelettausfachungen im Hochbau', 'Schallschutz- und Trennwände', 'Ökologische monolithische Außenwandaufbauten']
  },
  {
    name: 'Naturstein (Granit & Basalt)',
    code: 'Naturwerkstein (Hartgestein)',
    standard: 'DIN EN 771-6',
    lambdaRange: '2,80 - 3,50 W/(m·K)',
    densityRange: '2600 - 3000 kg/m³',
    strengthClass: 'Druckfestigkeitsklasse 150 bis 350',
    mortarType: 'Trass-Zementmörtel',
    description: 'Magmatisches Tiefengestein (Granit) bzw. Ergussgestein (Basalt). Sehr dicht, porenarm und hoch druckfest.',
    advantages: ['Sehr hohe Druck- und Abriebfestigkeit', 'In der Regel frost- und tausalzbeständig', 'Hochwertige, dauerhafte Optik'],
    disadvantages: ['Sehr schwer zu bearbeiten (Diamantsägewerkzeuge nötig)', 'Hohe Wärmeleitfähigkeit (Wärmebrücke)'],
    applications: ['Historischer Brücken- und Hafenbau, Geländestützwände', 'Wasserexponierte Sockel- und Pflasterflächen im Außenbereich', 'Verblendfassaden']
  },
  {
    name: 'Naturstein (Sandstein)',
    code: 'Naturwerkstein (Sediment)',
    standard: 'DIN EN 771-6',
    lambdaRange: '1,30 - 2,10 W/(m·K)',
    densityRange: '1900 - 2400 kg/m³',
    strengthClass: 'Druckfestigkeitsklasse 30 bis 120',
    mortarType: 'Trass-Kalkmörtel (salzfrei)',
    description: 'Klastisches Sedimentgestein aus verfestigten Sandkörnern. Gut formbar und weich zu behauen, jedoch empfindlich gegen saure Umweltbelastungen und Salzkristallisation.',
    advantages: ['Hervorragend handwerklich bildhauerisch zu bearbeiten', 'Ausgezeichnete Ökobilanz durch lokale Gewinnung', 'Historisch authentisches Denkmalmaterial'],
    disadvantages: ['Nicht tausalzbeständig, Gefahr von Schalenbildungen', 'Sehr hohe kapillare Saugfähigkeit'],
    applications: ['Denkmalpflege und Sanierung gotischer/barocker Kirchen', 'Ufermauern und historische Innenstädte', 'Ziermauerwerke']
  },
  {
    name: 'Lehmbaustein',
    code: 'LH (Anwendungsklasse Ia / Ib)',
    standard: 'DIN 18945',
    lambdaRange: '0,47 - 0,81 W/(m·K)',
    densityRange: '1200 - 1800 kg/m³',
    strengthClass: 'Druckfestigkeitsklasse 2 bis 4',
    mortarType: 'Lehmmörtel / Dünnbettlehmkleber',
    description: 'Aus Lehm (Ton, Schluff, Sand) geformte, luftgetrocknete, ungebrannte Steine. Seit Jahrtausenden bewährt; günstig für das Raumklima.',
    advantages: ['Gute Pufferung von Schwankungen der Raumluftfeuchte', 'Ohne Brennen hergestellt, wiederverwendbar', 'Gut kombinierbar mit Flächenheizungen'],
    disadvantages: ['Nicht wasserbeständig (Schutz vor Spritzwasser und Witterung nötig)', 'Geringere Festigkeiten; tragend nur nach DIN 18940 (Lehmsteinmauerwerk)'],
    applications: ['Wärmespeichernde Innenwände im Massivholzrahmen- und Strohballenbau', 'Sanierung und Ausfachung schützenswerter historischer Fachwerksbauten', 'Ausgleichs- und Putzträgerplatten im anspruchsvollen, wohngesunden Innenausbau']
  },
  {
    name: 'Holzfaserdämmplatte (WF)',
    code: 'WF (Bio-Dämmstoff)',
    standard: 'DIN EN 13171',
    lambdaRange: '0,038 - 0,048 W/(m·K)',
    densityRange: '100 - 180 kg/m³',
    strengthClass: 'Zugsicher durch Harzverklebung',
    mortarType: 'Mineralischer Klebemörtel (diffusionsoffen)',
    description: 'Aus Nadelholz-Resthölzern hergestellte, sorptionsfähige Dämmung. Gut für den sommerlichen Wärmeschutz durch hohe Wärmespeicherfähigkeit.',
    advantages: ['Hervorragender sommerlicher Hitzeschutz (sehr hohe Wärmekapazität)', 'Feuchtepuffernd und kapillar leitfähig (kein Tauwasserstau)', 'Ausgezeichneter Schallschutz'],
    disadvantages: ['Deutlich teurer als klassische EPS/Styroporplatten', 'Erhöhte Brandanfälligkeit bei unfertigem Wandaufbau (Klasse E)'],
    applications: ['Ökologische Holzrahmenbau-Außenwände d. KfW-Bauten', 'Diffusionsstabile WDVS-Systeme auf Massivziegeln', 'Dachdämmungen']
  },
  {
    name: 'Vakuumisolationspaneel (VIP)',
    code: 'VIP (Vakuumkern)',
    standard: 'Zulassung (abZ)',
    lambdaRange: '0,007 - 0,008 W/(m·K)',
    densityRange: '180 - 220 kg/m³',
    strengthClass: 'Nicht mechanisch beanspruchbar',
    mortarType: 'Spezialkleber / Rahmenaufhängung',
    description: 'Hocheffizienter Dämmstoff aus gepresstem Kieselsäurepulver, evakuiert und in eine gasdichte, metallisierte Verbundfolie eingeschweißt. Bei gleichem Dämmwert etwa fünfmal dünner als EPS.',
    advantages: ['Sehr hohe Dämmwirkung (schlanke Aufbauten möglich)', 'Perfekt für Sanierungen bei beengten Platzverhältnissen', 'Nicht brennbarer Kern'],
    disadvantages: ['Darf NIEMALS zugeschnitten, gebohrt oder beschädigt werden (Vakuumverlust!)', 'Hoher Preis'],
    applications: ['Wohnungsbauten mit Innenstadtbebauungsgrenzen', 'Laubengänge und Balkonplatten-Grenzbereiche', 'Nachträgliche hocheffiziente Innendämmungen']
  }
];

function MauerwerkThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'naturstein');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Mauerwerk &amp; Stein im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Weiter zu den anderen Teilen des Lehrpfads Mauerwerk:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('mauerwerk')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Baustoff-Eigenschaften</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Steinarten (Ziegel, KS, Porenbeton), Festigkeitsbemessung &amp; Mauerwerksverbände im 3D-Modell.
          </span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_mauerwerk')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Mauerwerksprodukte &amp; Praxis</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Hintermauer- und Vormauerziegel, Planblöcke, Mauermörtelarten &amp; Herstellerlisten nach BauPVO.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={handleDauerhaftigkeitClick}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Alterung &amp; Denkmalschutz</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Salzkristallisation, Frostsprengung, chemischer Verwitterungsschutz &amp; Sanierputze.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function BpMauerwerk() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation'>('allgemein');
  const [selectedProduct, setSelectedProduct] = useState<MauerwerkProduct>(masonryProducts[0]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Mauerwerksprodukte &amp; Werkstoffe (Bauprodukte)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 animate-in fade-in">
          <p>
            Werkstofftechnische Eigenschaften unbewehrter Mauerwerke. Dünnbettmörtel vs. Normalmauermörtel nach DIN EN 998-2 sowie tragende Bemessung nach Eurocode 6 (DIN EN 1996).
          </p>
        </div>

        {/* Primary Tab Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button aria-pressed={activeTab === 'allgemein'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Basiswissen &amp; Stein-Datenblätter
          </button>
          <button aria-pressed={activeTab === 'praxis'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={16} /> Praxisbeispiele &amp; Mauerverbände
          </button>
          <button aria-pressed={activeTab === 'innovation'}
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
            
            {/* INTERACTIVE DATA SHEET SELECTOR GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Product Buttons Left */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Verfügbare Mauersteinprodukte:</span>
                <div className="flex flex-col gap-2.5">
                  {masonryProducts.map((prod) => (
                    <button
                      key={prod.name}
                      onClick={() => setSelectedProduct(prod)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                        selectedProduct.name === prod.name
                          ? 'bg-shiraz text-white border-shiraz shadow-md scale-[1.01]'
                          : 'bg-white text-text-main border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider block ${selectedProduct.name === prod.name ? 'text-white/60' : 'text-text-main/40'}`}>
                          {prod.code}
                        </span>
                        <span className="font-extrabold text-xs lg:text-sm">{prod.name}</span>
                      </div>
                      <ArrowRight size={16} className={`opacity-70 ${selectedProduct.name === prod.name ? 'translate-x-1' : ''} transition-transform`} />
                    </button>
                  ))}
                </div>

                <div className="bg-amber-50/40 p-4 border border-amber-200/50 rounded-xl space-y-2 mt-4 text-xs text-amber-900 leading-relaxed">
                  <div className="flex gap-1.5 items-center font-bold">
                    <ShieldAlert size={14} className="text-amber-800" />
                    <span>Lagerungs- und Feuchtigkeitsrisiko</span>
                  </div>
                  <p className="font-normal text-[11px] text-amber-950/80">
                    Porenbetonsteine (PP) und Leichtbetonwaren müssen auf der Baustelle zwingend vor durchnässender Witterung geschützt werden. Nass eingemauertes Porenbetonmauerwerk trocknet sehr langsam aus, wodurch hergestellte Innenputze später abplatzen oder Schimmelpilzbefall entsteht.
                  </p>
                </div>
              </div>

              {/* Factsheet Data Display Right */}
              <div className="lg:col-span-7 bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="border-b border-home-grau/20 pb-3 mb-4 flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Normatives Mauersteindatenblatt</span>
                      <h3 className="text-base font-bold text-slate-800 mt-1">{selectedProduct.name} - Typ {selectedProduct.code.split(' ')[0]}</h3>
                    </div>
                    <div className="bg-white px-2 py-1 rounded border border-slate-200 text-right font-mono">
                      <span className="text-[9px] text-slate-400 block font-bold leading-none">PRODUKTNORM</span>
                      <span className="text-xs font-bold text-slate-800">{selectedProduct.standard}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal mb-5">
                    {selectedProduct.description}
                  </p>

                  {/* Mechanical Fact Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Wärmeleit (λ)</span>
                      <span className="text-xs font-black text-slate-700 font-mono block truncate">{selectedProduct.lambdaRange}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Rohdichteklasse</span>
                      <span className="text-xs font-bold text-slate-700 font-mono block truncate">{selectedProduct.densityRange}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Mindestfestigkeit</span>
                      <span className="text-[9px] font-bold text-slate-700 leading-tight block truncate" title={selectedProduct.strengthClass}>{selectedProduct.strengthClass}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Mörtelzuweisung</span>
                      <span className="text-[9px] font-bold text-slate-700 leading-tight block truncate" title={selectedProduct.mortarType}>{selectedProduct.mortarType.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Advantages vs Disadvantages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-s600" /> Baustoffstärken:
                      </span>
                      <ul className="space-y-1">
                        {selectedProduct.advantages.map((adv, i) => (
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
                        {selectedProduct.disadvantages.map((dis, i) => (
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
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Typisches Regel-Detailgebiet:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.applications.map((app, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* MORTARS SUB-SECTION */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-4">
              <h3 className="font-extrabold text-sm text-text-main mb-3 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <Settings className="text-shiraz" size={18} /> Mauermörtelarten nach DIN EN 998-2 &amp; DIN 20000-412
              </h3>
              <p className="text-xs text-text-main/75 leading-relaxed mb-4">
                Mauermörtel verteilt die Lasten gleichmäßig zwischen den Steinlagen. Je nach Steinart und Wärmeschutz unterscheidet man:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-slate-200 p-4 rounded-xl space-y-2 bg-slate-50/50">
                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded block w-max uppercase">NM / Fuge: 12 mm</span>
                  <h4 className="font-bold text-slate-800 text-xs">Normalmauermörtel (NM)</h4>
                  <p className="text-xxs text-slate-600 leading-normal">
                    Der handwerkliche Klassiker für unregelmäßige Steinformate (Ziegel, Kalksandsteine, Natursteine). Festigkeitsgruppen M 2,5 bis M 20.
                  </p>
                </div>

                <div className="border border-slate-200 p-4 rounded-xl space-y-2 bg-slate-50/50">
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded block w-max uppercase">LM / λ ≤ 0,21 W/mK</span>
                  <h4 className="font-bold text-slate-800 text-xs">Leichtmauermörtel (LM)</h4>
                  <p className="text-xxs text-slate-600 leading-normal">
                    Versetzt mit wärmedämmenden Zuschlagstoffen (Bims, Blähton, Perlit). Verhindert die Entstehung von linienförmigen Wärmebrücken an den Lagerfugen hochdämmender Hintermauerziegel.
                  </p>
                </div>

                <div className="border border-slate-200 p-4 rounded-xl space-y-2 bg-slate-50/50">
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded block w-max uppercase">DM / Fuge: 1-3 mm</span>
                  <h4 className="font-bold text-slate-800 text-xs">Dünnbettmörtel (DM)</h4>
                  <p className="text-xxs text-slate-600 leading-normal">
                    Werkmörtel mit Größtkorn ≤ 2 mm, mit Mörtelschlitten oder Walze auf Planziegel, KS-Plansteine und Porenbeton aufgetragen (Lagerfuge ca. 1–3 mm). Erhöht die Mauerwerksfestigkeit und reduziert Wärmebrücken.
                  </p>
                </div>
              </div>
            </div>

            {/* INSULATION SYSTEMS SUB-SECTION */}
            <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-4">
              <h3 className="font-extrabold text-sm text-text-main mb-1.5 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <Layers className="text-shiraz" size={18} /> Systemische Mauerwerks-Dämmungen &amp; Wandaufbauten
              </h3>
              <p className="text-xs text-text-main/75 leading-relaxed mb-4">
                Je nach Steinart und Anforderungen des GModG (vormals GEG) kommen unterschiedliche bauphysikalische Dämmmethoden zum Einsatz. Jedes System regelt den Feuchtigkeitstransport, den Schallschutz und die Kältebrückenminimierung individuell:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. WDVS */}
                <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded block w-max uppercase">WDVS / Außendämmung</span>
                      <span className="text-xxs font-mono text-slate-500 font-bold">DIN EN 13499 / 13500</span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-xs">Wärmedämmverbundsystem (Einschalig)</h4>
                    <p className="text-xxs text-slate-600 leading-relaxed">
                      Der Dämmstoff (EPS, Mineralfaser, Resolharz oder Holzfaser) wird auf das tragende, ungedämmte Mauerwerk (meist Kalksandstein KS oder Beton) geklebt, gedübelt und verputzt.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-lg border border-slate-100 font-medium">
                      <div>🌡️ λ-Wert: <span className="font-mono font-bold text-indigo-700">0,022 - 0,040</span></div>
                      <div>🔥 Brandschutz: <span className="font-bold text-slate-700">A1 bis B1</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xxs">
                    <div className="text-emerald-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span><strong>Vorteil:</strong> Hochgradig wirtschaftlich, wärmebrückenfreie lückenlose Gebäudehülle.</span>
                    </div>
                    <div className="text-amber-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span><strong>Risiko:</strong> Schlechteres Recycling (Verbund), Algenbildung an kühlen nassen Putzflächen.</span>
                    </div>
                  </div>
                </div>

                {/* 2. Kerndämmung */}
                <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded block w-max uppercase">Kerndämmung (Zweischalig)</span>
                      <span className="text-xxs font-mono text-slate-500 font-bold">DIN EN 1996</span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-xs">Zweischaliges Verblendmauerwerk</h4>
                    <p className="text-xxs text-slate-600 leading-relaxed">
                      Dämmplatten (wasserabweisende Steinwolle/EPS oder Polyurethan) liegen geschützt im Hohlraum zwischen tragender Innenschale und schützender Sicht- bzw. Klinker-Vorsatzschale.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-lg border border-slate-100 font-medium">
                      <div>🌡️ λ-Wert: <span className="font-mono font-bold text-emerald-800">0,030 - 0,038</span></div>
                      <div>🔥 Brandschutz: <span className="font-bold text-slate-700">Klasse A1 bis A2</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xxs">
                    <div className="text-emerald-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span><strong>Vorteil:</strong> Sehr guter Witterungsschutz durch die massive Außenschale.</span>
                    </div>
                    <div className="text-amber-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span><strong>Risiko:</strong> Erhebliche Wandstärken (&gt; 45 cm Segment), höherer Herstellungs- und Baustellenpreis.</span>
                    </div>
                  </div>
                </div>

                {/* 3. Innendämmung */}
                <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded block w-max uppercase">Innendämmung / WTA</span>
                      <span className="text-xxs font-mono text-slate-500 font-bold">WTA Merkblatt 6-4</span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-xs">Kapillaraktive Innendämmung</h4>
                    <p className="text-xxs text-slate-600 leading-relaxed">
                      Dämmplatten (wie schimmelpilzverhütendes Calciumsilikat oder Mineralschaum) werden raumseitig vollflächig mit Systemmörtel auf die Außenwand geklebt.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-lg border border-slate-100 font-medium">
                      <div>🌡️ λ-Wert: <span className="font-mono font-bold text-amber-700">0,038 - 0,048</span></div>
                      <div>🔥 Brandschutz: <span className="font-bold text-slate-700">Klasse A1 (unbrennbar)</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xxs">
                    <div className="text-emerald-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span><strong>Vorteil:</strong> Oft die einzige Option bei denkmalgeschützten Sichtfassaden.</span>
                    </div>
                    <div className="text-amber-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span><strong>Risiko:</strong> Verlust von Innenraum-Nutzfläche. Reduziert die wärmespeichernde Mauerwerksmasse.</span>
                    </div>
                  </div>
                </div>

                {/* 4. Integrierte Füllung */}
                <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded block w-max uppercase">Integrierte Kernfüllung</span>
                      <span className="text-xxs font-mono text-slate-500 font-bold">Herstellerzulassung</span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-xs">Werkseitig gefüllte Stein-Hohlräume</h4>
                    <p className="text-xxs text-slate-600 leading-relaxed">
                      Der Dämmstoff befindet sich sicher eingeschlossen direkt in den Kammern von Planziegeln (Mineralwolle- oder Perlitfüllung).
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-lg border border-slate-100 font-medium">
                      <div>🌡️ λ-Wert: <span className="font-mono font-bold text-rose-700">0,060 - 0,080</span></div>
                      <div>🔥 Brandschutz: <span className="font-bold text-slate-700">Klasse A1 bis A2</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xxs">
                    <div className="text-emerald-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span><strong>Vorteil:</strong> Diffusionsoffene Einstofflichkeit, hervorragende raumklimatische Feuchtepufferung.</span>
                    </div>
                    <div className="text-amber-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span><strong>Risiko:</strong> Vorsicht bei Wandaussparungen und Frässchlitzen (Herausrieseln von Dämmkügelchen).</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MASONRY ACCESSORIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-4">
              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block flex items-center gap-1">
                  <Sparkles size={14} /> Kimmelemente &amp; Sockel-Kältebrücken
                </span>
                <p className="font-normal leading-relaxed">
                  Gerade am erdberührten Sockelanlauf leitet Kalksandstein- oder Ziegelmauerwerk viel Wärme ins Erdreich ab. So-genannte *<em>Kimmsteine</em>* (mechanisch druckfeste Sonderschichten mit integrierten Dämmkernen oder Porenbetonsockeln) sperren diesen vertikalen Wärmeabfluss ab und verhindern Kondensatschäden an den Innenecken.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block flex items-center gap-1">
                  <ToolIcon size={14} /> Stumpfstoßtechnik &amp; Ankersysteme
                </span>
                <p className="font-normal leading-relaxed">
                  Moderne Innenwände werden heute selten traditionell eingezahnt gemauert. Die kraftschlüssige Verbindung erfolgt durch **Stumpfstoßanker** aus rostfreiem Edelstahl, die flach in die Lagerfugen der tragenden Außenwand eingelegt und beim Aufziehen der Trennwand eingebaut werden. Das ermöglicht einen flexiblen Arbeitsablauf ohne Blockaden.
                </p>
              </div>
            </div>

            {/* MANUFACTURERS */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-4 bg-slate-50/50">
              <h3 className="font-bold text-home-prim text-base mb-2 flex items-center gap-2">Marktübersicht typischer Systemanbieter (Herstellerneutral)</h3>
              <p className="text-xs text-text-main/60 mb-4 italic">
                Hinweis zur Herstellerneutralität: Die nachfolgende Auflistung dient als unverbindliche Übersicht marktrelevanter Systemhersteller zur Erleichterung der baupraktischen Orientierung und Normenrecherche im Rahmen der akademischen Lehre. Sie stellt keine Empfehlung dar.
              </p>
              <div className="overflow-x-auto rounded-xl border border-home-grau/15 bg-white">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-home-grau/15 text-slate-700 font-bold font-sans">
                      <th className="p-3">Werkstoffgruppe</th>
                      <th className="p-3">Systemgruppen &amp; Lieferformen (Herstellerneutral)</th>
                      <th className="p-3">Norm / Zulassung</th>
                      <th className="p-3">Beispiel-Systemprodukte</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 text-xxs font-normal">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold">Ton &amp; Ziegel</td>
                      <td className="p-3 font-semibold text-shiraz">Ziegelwerke &amp; Herstellerkooperationen (Sonder- und Planziegel nach DIN)</td>
                      <td className="p-3 font-mono">DIN EN 771-1, abZ Perlitplanziegel</td>
                      <td className="p-3">Perlit- oder mineralwollegefüllte Hintermauer-Planziegel T7/T8</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold">Kalksandstein</td>
                      <td className="p-3 font-semibold text-shiraz">Kalksandstein-Werksverbünde (XL-Großformate &amp; Plansteinsysteme)</td>
                      <td className="p-3 font-mono">DIN EN 771-2, DIN 20000-402</td>
                      <td className="p-3">Großformatige KS-XL Planelemente mit Mörtelschlitten</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold">Porenbeton</td>
                      <td className="p-3 font-semibold text-shiraz">Porenbeton-Werke (dampfgehärtete Plansteinsysteme)</td>
                      <td className="p-3 font-mono">DIN EN 771-4, DIN 20000-404</td>
                      <td className="p-3">Monolithische Plansteine PP2 / PP4 mit Dünnbettkleber</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold">Leichtbeton &amp; Bims</td>
                      <td className="p-3 font-semibold text-shiraz">Leichtbeton- und Bimsstein-Herstellerwerke (Hohlblocksteine)</td>
                      <td className="p-3 font-mono">DIN EN 771-3, DIN 20000-403</td>
                      <td className="p-3">Leichtbeton-Vollblöcke aus Naturbims für Außenwände</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'praxis' ? (
          <PraxisTabContent moduleKey="bp_mauerwerk" />
        ) : (
          <InnovationTabContent moduleKey="bp_mauerwerk" />
        )}
      </div>

      <MauerwerkThematicLinks current="bauprodukt" />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Tragfähigkeit einer KS-Innenwand"
          zielGleichung="f_k = K \cdot f_b^{0{,}7} \cdot f_m^{0{,}3}, \quad N_{Rd} = \Phi \cdot t \cdot \zeta \cdot f_k / \gamma_M"
          normQuelle="DIN EN 1996-1-1, Gl. (3.1) und 6.1.2 (Lehrbeispiel mit Empfehlungswerten; in Deutschland f_k nach DIN EN 1996-1-1/NA)"
          schritte={[
            { titel: '1. Gegeben', formel: 'K = 0{,}55,\\; f_b = 20,\\; f_m = 10\\,\\text{N/mm}^2,\\; t = 175\\,\\text{mm},\\; \\Phi = 0{,}8', erklaerung: 'KS-Vollstein (Gruppe 1), Normalmauermörtel M10.' },
            { titel: '2. Charakteristische Druckfestigkeit', formel: 'f_k = 0{,}55 \\cdot 20^{0{,}7} \\cdot 10^{0{,}3} = 0{,}55 \\cdot 8{,}14 \\cdot 2{,}00 = 8{,}9\\,\\text{N/mm}^2', erklaerung: 'Gl. (3.1) mit α = 0,7 und β = 0,3.' },
            { titel: '3. Bemessungswert', formel: 'f_d = 0{,}85 \\cdot 8{,}9 / 1{,}5 = 5{,}1\\,\\text{N/mm}^2', erklaerung: 'ζ = 0,85, γ_M = 1,5.' },
            { titel: '4. Wandtragfähigkeit', formel: 'n_{Rd} = 0{,}8 \\cdot 175 \\cdot 5{,}1 = 714\\,\\text{N/mm} \\approx 710\\,\\text{kN/m}', erklaerung: 'Je Meter Wandlänge.' },
          ]}
          ergebnisHinweis="Rund 710 kN/m – genug für die Lasten mehrerer Geschosse im Wohnungsbau."
        />
      </div>

      <ModulTest moduleId="bp_mauerwerk" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Mauerwerk', url: 'https://de.wikipedia.org/wiki/Mauerwerk' },
          { title: 'Kalksandstein', url: 'https://de.wikipedia.org/wiki/Kalksandstein' },
          { title: 'Porenbeton', url: 'https://de.wikipedia.org/wiki/Porenbeton' }
        ]} 
        literatur={[ 
          'Jäger, W. (Hrsg.): Mauerwerk-Kalender. Berlin: Ernst & Sohn (jährlich)', 
          'Wendehorst Bautechnische Zahlentafeln. Wiesbaden: Springer Vieweg (aktuelle Auflage)' 
        ]} 
        regelwerke={[ 
          { title: 'DIN EN 1996-1-1 / NA (Eurocode 6: Bemessung und Konstruktion von Mauerwerksbauten)' }, 
          { title: 'DIN EN 771-Reihe (Festlegungen für Mauersteine: Ziegel, Kalksandstein, Beton- und Porenbetonsteine)' },
          { title: 'DIN EN 998-2 (Festlegungen für Mörtel im Mauerwerksbau - Teil 2: Mauermörtel)' },
          { title: 'DIN 18533 (Abdichtung von erdberührten Bauteilen)' }
        ]} 
        formeln={[
          { 
            formel: 'f_k = K \\cdot f_b^{\\alpha} \\cdot f_m^{\\beta}', 
            erklaerung: 'Charakteristische Mauerwerksdruckfestigkeit fk nach Eurocode 6: K = Beiwert nach Stein-/Mörtelgruppe, fb = normierte Steindruckfestigkeit, fm = Mörteldruckfestigkeit (Normalmauermörtel: α = 0,70, β = 0,30; Dünnbettmörtel: α = 0,85, β = 0).',
            quelle: 'DIN EN 1996-1-1 Gl. (3.1)'
          },
          { 
            formel: 'N_{Ed} \\le N_{Rd} = \\Phi_i \\cdot t \\cdot f_d \\quad \\text{mit} \\quad f_d = \\zeta \\cdot \\frac{f_k}{\\gamma_M}', 
            erklaerung: 'Tragfähigkeitsnachweis (ULS) einer Mauerwerkswand unter Längskraftbeanspruchung: Phi_i = Abminderungsbeiwert (Schlankheit und Exzentrizität), t = Wanddicke, fd = Bemessungswert der Druckfestigkeit, f_d = 0,85 · f_k / γ_M mit γ_M = 1,5 nach NA (0,85 = Dauerstandsfaktor ζ).',
            quelle: 'DIN EN 1996-1-1'
          }
        ]} 
      />
    </div>
  );
}
