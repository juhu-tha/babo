import React, { useState } from 'react';
import { Layers, HardHat, Info, Truck, BookOpen, ShieldAlert, ArrowRight, CheckCircle2, Lightbulb } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';

function ConcreteThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'beton');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Beton im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Weiter zu den anderen Beton-Lehrbereichen:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe / Betonpraxis */}
        <button
          onClick={() => setActiveTab('betonpraxis')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Betontechnologie & Praxis</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Expositionsklassen-Konfigurator, Nachbehandlungsrechner & Betondeckung.
          </span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_beton')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Betonzulassung (Bauprodukt)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Transport- vs. Baustellenbeton, WPK-Überwachung, Ü-Zeichen & Abnahme.
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
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Dauerhaftung & Schäden</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Karbonatisierung, Frost-Tausalz-Angriff, AKR-Treiben & Bewehrungskorrosion.
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

export default function BpBeton() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation'>('allgemein');

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="bg-home-grau/5 border-b border-home-grau/10 px-6 py-5">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Beton (Bauprodukte)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der Baustoff Beton zeichnet sich durch hohe Druckfestigkeit und Vielseitigkeit aus. Dieses Kapitel behandelt Zusammensetzung, Frischbetoneigenschaften und Festbetonauswertung.
          </p>
        </div>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Basiswissen
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
        
        <div className="p-6 pt-0 space-y-6">
          {activeTab === 'allgemein' ? (
            <div className="prose max-w-none text-gray-700 animate-in fade-in duration-300">
              <p className="lead text-lg font-medium text-home-prim">
                Beton ist der weltweit am häufigsten verwendete Baustoff. Als Bauprodukt wird er meist als Transportbeton (Frischbeton) auf die Baustelle geliefert oder vor Ort gemischt (Baustellenbeton).
              </p>
              <p className="mt-4">
                Gemäß DIN EN 206 / DIN 1045-2 wird Beton u. a. anhand seiner Druckfestigkeitsklasse, Expositionsklassen, Konsistenzklasse, des Größtkorns der Gesteinskörnung und der Chloridklasse definiert.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h3 className="font-bold text-shiraz mb-2 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-stone-600" /> Transportbeton
                  </h3>
                  <p className="text-sm">
                    Wird in einem stationären Betonwerk industriell nach genauen Rezepturen gemischt und im Fahrmischer auf die Baustelle geliefert.
                    Unterliegt einer strengen werkseigenen Produktionskontrolle (WPK) und Fremdüberwachung, was eine hohe und konstante Qualität sicherstellt.
                  </p>
                </div>

                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h3 className="font-bold text-shiraz mb-2 flex items-center gap-2">
                    <HardHat className="w-5 h-5 text-stone-600" /> Baustellenbeton
                  </h3>
                  <p className="text-sm">
                    Wird direkt auf der Baustelle gemischt. Eignet sich für kleinere Mengen oder abgelegene Baustellen.
                    Die Qualitätssicherung (z. B. genaue Verwiegung von Zement und Wasser) ist hier anspruchsvoller als im stationären Werk.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-home-prim mt-8 mb-4">Normative Anforderungen als Bauprodukt</h3>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Eigenschaften:</strong> Die Lieferung erfolgt in der Regel als "Beton nach Eigenschaften". Der Besteller legt bestimmte Eigenschaften (Festigkeit, Konsistenz, Expositionsklassen), fest, und das Betonwerk ist für die Rezeptur verantwortlich.</li>
                <li><strong>Zusammensetzung:</strong> Seltener ist "Beton nach Zusammensetzung", bei dem der Besteller dem Werk die exakte Rezeptur (z. B. Zementgehalt, w/z-Wert) vorgibt.</li>
                <li><strong>Ü-Zeichen:</strong> Beton nach DIN 1045-2 ist ein geregeltes Bauprodukt und wird in Deutschland mit dem Übereinstimmungszeichen (Ü-Zeichen) gekennzeichnet (Lieferschein).</li>
                <li><strong>Nachhaltigkeit (CSC):</strong> Immer öfter wird von Herstellern ein CSC-Zertifikat (Concrete Sustainability Council) gefordert, welches die ökologisch, sozial und ökonomisch verantwortungsvolle Herstellung belegt (relevant für QNG/DGNB).</li>
              </ul>

              <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-blue-500 p-4 rounded-xl mt-6">
                <p className="text-sm text-blue-900 flex items-start gap-2">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  Detaillierte Informationen zu Frischbeton, Festbeton, Dauerhaftigkeit und Mischungsberechnungen finden Sie in den entsprechenden Hauptmodulen zur Baustoffkunde.
                </p>
              </div>
            </div>
          ) : activeTab === 'praxis' ? (
            <PraxisTabContent moduleKey="bp_beton" />
          ) : (
            <InnovationTabContent moduleKey="bp_beton" />
          )}
        </div>
      </div>
      
      <ConcreteThematicLinks current="bauprodukt" />
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Erreicht eine Prüfserie C30/37?"
          zielGleichung="f_{ck} = f_{cm} - 1{,}645 \cdot s"
          normQuelle="Statistische Definition der charakteristischen Festigkeit (Lehrbeispiel, Zylinderwerte)"
          schritte={[
            { titel: '1. Prüfergebnisse', formel: 'f_{cm} = 38{,}5\\,\\text{N/mm}^2,\\; s = 5{,}0\\,\\text{N/mm}^2', erklaerung: 'Mittelwert und Standardabweichung einer Produktionsserie.' },
            { titel: '2. 5-%-Quantil', formel: 'f_{ck} = 38{,}5 - 1{,}645 \\cdot 5{,}0 = 30{,}3\\,\\text{N/mm}^2', erklaerung: 'Nur 5 % der Ergebnisse liegen darunter.' },
            { titel: '3. Bewertung', formel: '30{,}3 \\ge 30\\,\\text{N/mm}^2 \\;\\Rightarrow\\; \\text{C30/37 erreicht}', erklaerung: 'Für die formale Konformität gelten die Kriterien der DIN EN 206 / DIN 1045-2.' },
          ]}
          ergebnisHinweis="Je größer die Streuung s, desto höher muss der Mittelwert liegen – gute Produktionskontrolle spart Zement."
        />
      </div>

      <ModulTest moduleId="bp_beton" />

      <ModuleFooter
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Frischbeton', url: 'https://de.wikipedia.org/wiki/Frischbeton' },
          { title: 'Festbeton', url: 'https://de.wikipedia.org/wiki/Festbeton' }
        ]}
        literatur={[
          'Grübl, P.; Weigler, H.; Karl, S.: Beton – Arten, Herstellung und Eigenschaften. 2. Aufl., Berlin: Ernst & Sohn 2001',
          'Weber, R.: Guter Beton – Ratschläge für die richtige Betonherstellung. 25., überarb. Aufl., Erkrath: Verlag Bau+Technik 2019',
          'Verein Deutscher Zementwerke (VDZ): Zement-Taschenbuch. 51. Ausgabe, Düsseldorf: Verlag Bau+Technik 2008'
        ]}
        regelwerke={[
          { title: 'DIN EN 206 / DIN 1045-2 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN 1045-3 / DIN EN 13670 (Ausführung von Tragwerken aus Beton)' },
          { title: 'Deutscher Ausschuss für Stahlbeton (DAfStb): Richtlinien und Regelwerke', url: 'https://www.dafstb.de/' }
        ]}
        formeln={[
          {
            formel: 'w/z = \\frac{m_w}{m_z} \\le (w/z)_{\\max}',
            erklaerung: 'Wasserzementwert als zentrales Qualitätskriterium für Dauerhaftigkeit und Dichtigkeit des Zementsteins nach Expositionsklassen.',
            quelle: 'DIN EN 206 / DIN 1045-2'
          },
          {
            formel: 'f_{ck} = f_{cm} - 1{,}645 \\cdot s',
            erklaerung: 'Charakteristische Festigkeit als 5-%-Quantil (Normalverteilung, bekannte Standardabweichung s). Die Konformitätskriterien der DIN EN 206 (z. B. f_cm ≥ f_ck + 4 bei n = 3) sind daraus abgeleitet.',
            quelle: 'DIN EN 206'
          }
        ]}
      />
    </div>
  );
}
