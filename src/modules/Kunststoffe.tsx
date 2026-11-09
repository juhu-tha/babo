import type { Scale } from 'chart.js';
import { formatDeZahl, formatDeWert, formatDeIntl } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { Layers, Thermometer, List, ShieldAlert, ArrowRight, BookOpen, Maximize } from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';
import inhalt from '@/content/kunststoffe/Kunststoffe.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { kunststoffTemperatur } from '@/src/calc/werkstoffmodelle';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { ErgebnisAnsage } from '@/src/components/ui/ErgebnisAnsage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PlasticsThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'kunststoffe');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadKunststoffeIm} /></h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5"><MdText text={inhalt.texte.weiterZuDenAnderen} /></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('kunststoffe')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t1BaustoffEigenschaften} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.thermoplastenVsDuroplastenE} /></span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_kunststoffe')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t2MechanikRechner} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.peHdFolienPvc} /></span>
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
            <span><MdText text={inhalt.texte.t3AlterungDauerhaftigkeit} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.uvVersprödungWeichmacherAuswaschung} /></span>
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

type KunststoffReiter = 'arten' | 'eigenschaften' | 'steckbrief' | 'geosynthetics' | 'etfe';
const REITER: readonly ModulTab<KunststoffReiter>[] = [
  { id: 'steckbrief', label: 'Baustoff-Steckbrief', icon: BookOpen },
  { id: 'arten', label: inhalt.werte.artenEinsatzbereiche, icon: List },
  { id: 'eigenschaften', label: 'Temperaturabhängigkeit', icon: Thermometer },
  { id: 'geosynthetics', label: inhalt.werte.geokunststoffe, icon: Layers },
  { id: 'etfe', label: inhalt.werte.etfeFolien, icon: Maximize },
];

export default function Kunststoffe() {
  const [activeTab, setActiveTab] = useState<KunststoffReiter>('steckbrief');
  const [plasticType, setPlasticType] = useState<'amorphous' | 'semicrystalline' | 'elastomer' | 'duroplast'>('amorphous');
  const [temperature, setTemperature] = useState(20);

  // E-Modul über der Temperatur (Lehrmodell, Rechenkern src/calc/werkstoffmodelle.ts)
  const modell = useMemo(() => kunststoffTemperatur(plasticType, temperature), [plasticType, temperature]);

  const chartData = useMemo(() => {
    const labels = modell.kurve.map(p => p.T);
    const data = modell.kurve.map(p => p.E);
    const currentE = modell.E;
    const pointData = labels.map((_, i) => i === modell.index ? currentE : null);

    return {
      labels,
      datasets: [
        {
          label: inhalt.werte.eModulMpa,
          data: data,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(163, 17, 62, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: inhalt.werte.aktuelleTemperatur,
          data: pointData,
          borderColor: '#0e558c',
          backgroundColor: '#0e558c',
          pointRadius: 6,
          pointHoverRadius: 8,
          showLine: false,
        }
      ],
      currentE
    };
  }, [modell]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'logarithmic' as const,
        title: { display: true, text: inhalt.werte.eModulMpaLog },
        min: 0.1,
        max: 10000,
        ticks: {
          callback: function(value: string | number) {
            if (value === 0.1 || value === 1 || value === 10 || value === 100 || value === 1000 || value === 10000) {
              return formatDeIntl(Number(value));
            }
            return null;
          }
        }
      },
      x: {
        title: { display: true, text: inhalt.werte.temperaturC },
        ticks: {
          callback: function(this: Scale, val: string | number, index: number) {
            return index % 10 === 0 ? this.getLabelForValue(val as number) : '';
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            if (context.raw === null) return '';
            return `E-Modul: ${formatDeZahl(Number(context.raw), 1)} MPa`;
          }
        }
      }
    }
  };

  const getPlasticDescription = () => {
    switch(plasticType) {
      case 'amorphous':
        return inhalt.werte.amorpheThermoplasteZB;
      case 'semicrystalline':
        return inhalt.werte.teilkristallineThermoplasteZB;
      case 'elastomer':
        return inhalt.werte.elastomereZBGummi;
      case 'duroplast':
        return inhalt.werte.duroplasteZBEpoxidharz;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">

      {activeTab === 'eigenschaften' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-2">
        
        {/* Parameter Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                <Layers size={24} />
              </div>
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">Kunststoffarten</h2>
            </div>
            
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.dasMechanischeVerhaltenVon} /></p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Kunststoff-Struktur</label><InfoTooltip text={inhalt.werte.molekularerAufbauDesKunststoffs} /></div>
                <InfoTooltip text={inhalt.werte.wählenSieDieMolekulare} />
              </div>
              <select aria-label="Kunststoff-Struktur" 
                className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                value={plasticType}
                onChange={(e) => setPlasticType(e.target.value as typeof plasticType)}
              >
                <option value="amorphous">Amorpher Thermoplast (z.B. PVC, PMMA)</option>
                <option value="semicrystalline">Teilkristalliner Thermoplast (z.B. PE, PP)</option>
                <option value="elastomer">Elastomer (z.B. Gummi, EPDM)</option>
                <option value="duroplast">Duroplast (z.B. Epoxidharz)</option>
              </select>
            </div>

            <div className="p-4 bg-home-grau/10 rounded-xl border border-home-grau/30 text-sm text-text-main/80">
              {getPlasticDescription()}
            </div>

            <Slider
              label="Temperatur"
              min={-100} max={300} step={1}
              value={temperature} unit="°C"
              info={inhalt.werte.aktuelleBauteiltemperatur}
              onChange={(e) => setTemperature(Number(e.target.value))}
            />
            <EingabeHinweise hinweise={modell.hinweise} />
            <ErgebnisAnsage text={`${plasticType}: E-Modul bei ${formatDeWert(temperature)} °C ${Number.isFinite(modell.E) ? (modell.E < 1 ? 'unter 1 MPa' : `${formatDeZahl(modell.E, 0)} MPa`) : '–'}`} />

            <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md">
              <div className="text-sm opacity-90 mb-1"><MdText text={inhalt.texte.aktuellerEModul} /></div>
              <div className="text-3xl font-bold">
                {chartData.currentE < 1 ? '< 1' : formatDeZahl(chartData.currentE, 0)} MPa
              </div>
              <div className="text-xs opacity-75 mt-2">
                Bei {formatDeWert(temperature)} °C
              </div>
            </div>
          </div>
        </div>

        {/* Chart Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[500px]">
            <h2 className="text-xl font-bold text-text-main mb-2"><MdText text={inhalt.texte.temperaturabhängigkeitDesEModuls} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.zustandsbereicheGlaszustandHartSpröde} /></p>
        </div>
            
            <div className="flex-1 relative w-full h-full">
              <Line data={chartData} options={options} />
            </div>
          </div>

          {/* Schematische Darstellung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
            <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungPolymerstrukturen} /></h3>
            <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
              <svg width="100%" height="160" viewBox="0 0 350 160">
                {/* Amorph */}
                <text x="50" y="20" fontSize="10" fill="#1e293b" textAnchor="middle" fontWeight="bold">Amorph</text>
                <path d="M 20 50 Q 40 30 60 70 T 80 50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                <path d="M 30 80 Q 50 100 70 60 T 90 90" fill="none" stroke="#ef4444" strokeWidth="2" />
                <path d="M 10 60 Q 30 90 50 40 T 70 80" fill="none" stroke="#10b981" strokeWidth="2" />
                <text x="50" y="130" fontSize="8" fill="#64748b" textAnchor="middle">Ungeordnetes</text>
                <text x="50" y="140" fontSize="8" fill="#64748b" textAnchor="middle">Knäuel</text>

                {/* Teilkristallin */}
                <text x="130" y="20" fontSize="10" fill="#1e293b" textAnchor="middle" fontWeight="bold">Teilkristallin</text>
                <path d="M 100 50 L 120 50 L 120 70 L 100 70 Z" fill="none" stroke="#3b82f6" strokeWidth="2" />
                <path d="M 105 55 L 115 55 M 105 60 L 115 60 M 105 65 L 115 65" stroke="#3b82f6" strokeWidth="1" />
                <path d="M 140 60 L 160 60 L 160 80 L 140 80 Z" fill="none" stroke="#ef4444" strokeWidth="2" />
                <path d="M 145 65 L 155 65 M 145 70 L 155 70 M 145 75 L 155 75" stroke="#ef4444" strokeWidth="1" />
                <path d="M 120 60 Q 130 40 140 70" fill="none" stroke="#10b981" strokeWidth="2" />
                <text x="130" y="130" fontSize="8" fill="#64748b" textAnchor="middle">Kristalline +</text>
                <text x="130" y="140" fontSize="8" fill="#64748b" textAnchor="middle">Amorphe Bereiche</text>

                {/* Elastomer */}
                <text x="210" y="20" fontSize="10" fill="#1e293b" textAnchor="middle" fontWeight="bold">Elastomer</text>
                <path d="M 180 50 Q 200 30 220 70 T 240 50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                <path d="M 190 80 Q 210 100 230 60 T 250 90" fill="none" stroke="#ef4444" strokeWidth="2" />
                <circle cx="205" cy="60" r="3" fill="#1e293b" />
                <circle cx="225" cy="75" r="3" fill="#1e293b" />
                <text x="210" y="130" fontSize="8" fill="#64748b" textAnchor="middle">Weitmaschig</text>
                <text x="210" y="140" fontSize="8" fill="#64748b" textAnchor="middle">vernetzt</text>

                {/* Duroplast */}
                <text x="290" y="20" fontSize="10" fill="#1e293b" textAnchor="middle" fontWeight="bold">Duroplast</text>
                <path d="M 260 40 L 320 40 M 260 60 L 320 60 M 260 80 L 320 80 M 260 100 L 320 100" stroke="#3b82f6" strokeWidth="2" />
                <path d="M 280 40 L 280 100 M 300 40 L 300 100" stroke="#ef4444" strokeWidth="2" />
                <circle cx="280" cy="40" r="2" fill="#1e293b" />
                <circle cx="300" cy="40" r="2" fill="#1e293b" />
                <circle cx="280" cy="60" r="2" fill="#1e293b" />
                <circle cx="300" cy="60" r="2" fill="#1e293b" />
                <circle cx="280" cy="80" r="2" fill="#1e293b" />
                <circle cx="300" cy="80" r="2" fill="#1e293b" />
                <circle cx="280" cy="100" r="2" fill="#1e293b" />
                <circle cx="300" cy="100" r="2" fill="#1e293b" />
                <text x="290" y="130" fontSize="8" fill="#64748b" textAnchor="middle">Engmaschig</text>
                <text x="290" y="140" fontSize="8" fill="#64748b" textAnchor="middle">vernetzt</text>
              </svg>
              <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.dieMakromolekulareStrukturBestimmt} /></div>
            </div>
          </div>
        </div>

        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielWärmedehnungEinerPvc}
          zielGleichung="\Delta L = L_0 \cdot \alpha_T \cdot \Delta T"
          normQuelle={inhalt.werte.tAlsRichtwertProduktdatenblatt}
          schritte={inhalt.daten["Kunststoffe.schritte"]}
          ergebnisHinweis={inhalt.werte.t32MmAuf10}
        />

      </div>
      )}

      {/* Arten und Einsatzbereiche */}
      {activeTab === 'arten' && (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 animate-in fade-in slide-in-from-bottom-2">
        <h2 className="text-xl font-bold text-text-main mb-6"><MdText text={inhalt.texte.wichtigeKunststoffeUndIhre} /></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30">
            <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.pvcPolyvinylchlorid} /></h3>
            <div className="text-xs font-semibold text-home-grau uppercase tracking-wider mb-2"><MdText text={inhalt.texte.amorpherThermoplast} /></div>
            <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.sehrVielseitigHartPvc} /></p>
            <div className="text-sm">
              <strong>Einsatzbereiche:</strong>
              <ul className="list-disc list-inside text-text-main/70 mt-1">
                <li><MdText text={inhalt.texte.fensterprofileHartPvc} /></li>
                <li><MdText text={inhalt.texte.rohreFürAbwasserHart} /></li>
                <li><MdText text={inhalt.texte.bodenbelägeWeichPvc} /></li>
                <li><MdText text={inhalt.texte.dachUndDichtungsbahnen} /></li>
              </ul>
            </div>
          </div>

          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30">
            <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.pmmaPolymethylmethacrylat} /></h3>
            <div className="text-xs font-semibold text-home-grau uppercase tracking-wider mb-2"><MdText text={inhalt.texte.amorpherThermoplast2} /></div>
            <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.auchBekanntAlsAcrylglas} /></p>
            <div className="text-sm">
              <strong>Einsatzbereiche:</strong>
              <ul className="list-disc list-inside text-text-main/70 mt-1">
                <li><MdText text={inhalt.texte.transparenteÜberdachungen} /></li>
                <li>Lichtkuppeln</li>
                <li><MdText text={inhalt.texte.lärmschutzwändeTransparent} /></li>
                <li><MdText text={inhalt.texte.sanitärobjekteBadewannen} /></li>
              </ul>
            </div>
          </div>

          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30">
            <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.pePolyethylen} /></h3>
            <div className="text-xs font-semibold text-home-grau uppercase tracking-wider mb-2"><MdText text={inhalt.texte.teilkristallinerThermoplast} /></div>
            <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.sehrBeständigGegenSäuren} /></p>
            <div className="text-sm">
              <strong>Einsatzbereiche:</strong>
              <ul className="list-disc list-inside text-text-main/70 mt-1">
                <li><MdText text={inhalt.texte.trinkwasserUndGasrohrePe} /></li>
                <li><MdText text={inhalt.texte.dampfbremsfolienPeLd} /></li>
                <li>Kabelisolierungen</li>
                <li><MdText text={inhalt.texte.geomembranenDeponiebau} /></li>
              </ul>
            </div>
          </div>

          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30">
            <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.epsXpsPolystyrol} /></h3>
            <div className="text-xs font-semibold text-home-grau uppercase tracking-wider mb-2"><MdText text={inhalt.texte.amorpherThermoplastGeschäumt} /></div>
            <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.expandiertesEpsStyroporOder} /></p>
            <div className="text-sm">
              <strong>Einsatzbereiche:</strong>
              <ul className="list-disc list-inside text-text-main/70 mt-1">
                <li><MdText text={inhalt.texte.wärmedämmverbundsystemeEps} /></li>
                <li><MdText text={inhalt.texte.trittschalldämmungEps} /></li>
                <li><MdText text={inhalt.texte.perimeterdämmungImErdreichXps} /></li>
                <li><MdText text={inhalt.texte.umkehrdächerXps} /></li>
              </ul>
            </div>
          </div>

          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30">
            <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.purPirPolyurethan} /></h3>
            <div className="text-xs font-semibold text-home-grau uppercase tracking-wider mb-2"><MdText text={inhalt.texte.duroplastElastomer} /></div>
            <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.jeNachVernetzungsgradAls} /></p>
            <div className="text-sm">
              <strong>Einsatzbereiche:</strong>
              <ul className="list-disc list-inside text-text-main/70 mt-1">
                <li><MdText text={inhalt.texte.hochleistungsWärmedämmungPurHartschaum} /></li>
                <li>Montageschäume</li>
                <li><MdText text={inhalt.texte.dichtstoffeFugen} /></li>
                <li>Flüssigkunststoff-Abdichtungen</li>
              </ul>
            </div>
          </div>

          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30">
            <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.epdmEthylenPropylenDien} /></h3>
            <div className="text-xs font-semibold text-home-grau uppercase tracking-wider mb-2">Elastomer</div>
            <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.einSynthetischerKautschukSehr} /></p>
            <div className="text-sm">
              <strong>Einsatzbereiche:</strong>
              <ul className="list-disc list-inside text-text-main/70 mt-1">
                <li><MdText text={inhalt.texte.flachdachabdichtungenFolien} /></li>
                <li><MdText text={inhalt.texte.fassadenUndFensterdichtungen} /></li>
                <li>Teichfolien</li>
                <li>Fugenbänder</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300">
          <BaustoffProfil materialKey="kunststoffe" />
        </div>
      )}

      {activeTab === 'geosynthetics' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.geokunststoffeGeosyntheticsSindPolymere} /></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.artenVonGeokunststoffen} /></h3>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2 font-medium">
                <li><MdText text={inhalt.texte.geotextilienDurchlässigeFlächenhafteText} /></li>
                <li><MdText text={inhalt.texte.geogitterGeogridsGitterartigeStrukturen} /></li>
                <li><MdText text={inhalt.texte.geomembranenNahezuWasserundurchlässigeKu} /></li>
                <li><MdText text={inhalt.texte.geoverbundstoffeKombinationenAusVerschie} /></li>
              </ul>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2">Hauptfunktionen</h3>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2 font-medium">
                <li><MdText text={inhalt.texte.trennenVerhindertDieVermischung} /></li>
                <li><MdText text={inhalt.texte.filternHältBodenpartikelZurück} /></li>
                <li><MdText text={inhalt.texte.bewehrungAufnahmeVonZugkräften} /></li>
                <li><MdText text={inhalt.texte.abdichtenVerhindertDenDurchtritt} /></li>
                <li><MdText text={inhalt.texte.schützenSchütztEmpfindlicheBauteile} /></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'etfe' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.etfeEthylenTetrafluorethylenIst} /></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.herausragendeEigenschaften} /></h3>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2 font-medium">
                <li><MdText text={inhalt.texte.geringesEigengewichtEinFolienkissen} /></li>
                <li><MdText text={inhalt.texte.hoheLichtdurchlässigkeitLässtBis} /></li>
                <li><MdText text={inhalt.texte.schmutzabweisendDieGlatteAntiadhäsive} /></li>
                <li><MdText text={inhalt.texte.langlebigkeitReißfestChemikalienbeständi} /></li>
              </ul>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.konstruktionKissenaufbau} /></h3>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2 font-medium">
                <li><MdText text={inhalt.texte.pneumatischeKissenZweiBis} /></li>
                <li><MdText text={inhalt.texte.druckluftsteuerungDerDruckIn} /></li>
                <li><MdText text={inhalt.texte.verschattungDurchBedruckungEinzelner} /></li>
              </ul>
            </div>
          </div>
        </div>
      )}
      </ModuleTabs>

      <PlasticsThematicLinks current="baustoff" />

      <ModulTest moduleId="kunststoffe" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Kunststoff', url: 'https://de.wikipedia.org/wiki/Kunststoff' },
          { title: 'Thermoplaste', url: 'https://de.wikipedia.org/wiki/Thermoplaste' },
          { title: 'Duroplaste', url: 'https://de.wikipedia.org/wiki/Duroplaste' },
          { title: 'Elastomere', url: 'https://de.wikipedia.org/wiki/Elastomere' },
          { title: inhalt.werte.ethylenTetrafluorethylenEtfe, url: 'https://de.wikipedia.org/wiki/Ethylen-Tetrafluorethylen' }
        ]}
        regelwerke={inhalt.daten["Kunststoffe.regelwerke"]}
        literatur={inhalt.daten["Kunststoffe.literatur"]}
        formeln={inhalt.daten["Kunststoffe.formeln"]}
      />
    </div>
  );
}
