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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { Layers, Thermometer, List, ShieldAlert, ArrowRight, BookOpen, Maximize } from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { useTabContext } from '@/src/contexts/TabContext';

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
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Kunststoffe im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den drei Säulen der Kunststoff-Werkstoffkunde:
        </p>
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
            <span>1. Baustoff-Eigenschaften</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Thermoplasten vs. Duroplasten, E-Modul-Temperatur-Scherkurven & Arten.
          </span>
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
            <span>2. Mechanik & Rechner</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            PE-HD Folien, PVC-U Rohre, Flachdachbahnen (EPDM) & Dehnungsrechner.
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
            <span>3. Alterung & Dauerhaftigkeit</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            UV-Versprödung, Weichmacher-Auswaschung, Spannungsrisse & thermische Alterung.
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

export default function Kunststoffe() {
  const [activeTab, setActiveTab] = useState<'arten' | 'eigenschaften' | 'steckbrief' | 'geosynthetics' | 'etfe'>('steckbrief');
  const [plasticType, setPlasticType] = useState<'amorphous' | 'semicrystalline' | 'elastomer' | 'duroplast'>('amorphous');
  const [temperature, setTemperature] = useState(20);

  const chartData = useMemo(() => {
    const labels = [];
    const data = [];

    let Tg = 100;
    let Tm = 250;
    let Tf = 160;

    for (let T = -100; T <= 300; T += 2) {
      labels.push(T);
      let E = 0.1;

      if (plasticType === 'amorphous') {
        Tg = 100;
        Tf = 150;
        const E_glass = 3000;
        const E_rubber = 10;
        let E_val = E_rubber + (E_glass - E_rubber) / (1 + Math.exp(0.15 * (T - Tg)));
        E_val = E_val / (1 + Math.exp(0.2 * (T - Tf)));
        E = Math.max(0.1, E_val);
      } 
      else if (plasticType === 'semicrystalline') {
        Tg = 20; 
        Tm = 160;
        const E_glass = 3000;
        const E_leathery = 300;
        let E_val = E_leathery + (E_glass - E_leathery) / (1 + Math.exp(0.1 * (T - Tg)));
        E_val = E_val / (1 + Math.exp(0.5 * (T - Tm)));
        E = Math.max(0.1, E_val);
      }
      else if (plasticType === 'elastomer') {
        Tg = -40;
        const E_glass = 3000;
        const E_rubber = 3;
        let E_val = E_rubber + (E_glass - E_rubber) / (1 + Math.exp(0.2 * (T - Tg)));
        E = Math.max(0.1, E_val);
      }
      else if (plasticType === 'duroplast') {
        Tg = 150;
        const E_glass = 4000;
        const E_rubber = 800;
        let E_val = E_rubber + (E_glass - E_rubber) / (1 + Math.exp(0.1 * (T - Tg)));
        E = Math.max(0.1, E_val);
      }

      data.push(E);
    }

    let currentE = 0.1;
    let T = temperature;
    if (plasticType === 'amorphous') {
        Tg = 100;
        Tf = 150;
        const E_glass = 3000;
        const E_rubber = 10;
        let E_val = E_rubber + (E_glass - E_rubber) / (1 + Math.exp(0.15 * (T - Tg)));
        E_val = E_val / (1 + Math.exp(0.2 * (T - Tf)));
        currentE = Math.max(0.1, E_val);
    } 
    else if (plasticType === 'semicrystalline') {
        Tg = 20;
        Tm = 160;
        const E_glass = 3000;
        const E_leathery = 300;
        let E_val = E_leathery + (E_glass - E_leathery) / (1 + Math.exp(0.1 * (T - Tg)));
        E_val = E_val / (1 + Math.exp(0.5 * (T - Tm)));
        currentE = Math.max(0.1, E_val);
    }
    else if (plasticType === 'elastomer') {
        Tg = -40;
        const E_glass = 3000;
        const E_rubber = 3;
        let E_val = E_rubber + (E_glass - E_rubber) / (1 + Math.exp(0.2 * (T - Tg)));
        currentE = Math.max(0.1, E_val);
    }
    else if (plasticType === 'duroplast') {
        Tg = 150;
        const E_glass = 4000;
        const E_rubber = 800;
        let E_val = E_rubber + (E_glass - E_rubber) / (1 + Math.exp(0.1 * (T - Tg)));
        currentE = Math.max(0.1, E_val);
    }

    // Find closest index for the point
    const closestIndex = labels.findIndex(l => l >= temperature);
    const pointData = labels.map((_, i) => i === closestIndex ? currentE : null);

    return {
      labels,
      datasets: [
        {
          label: 'E-Modul [MPa]',
          data: data,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(163, 17, 62, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: 'Aktuelle Temperatur',
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
  }, [plasticType, temperature]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'logarithmic' as const,
        title: { display: true, text: 'E-Modul [MPa] (log)' },
        min: 0.1,
        max: 10000,
        ticks: {
          callback: function(value: any) {
            if (value === 0.1 || value === 1 || value === 10 || value === 100 || value === 1000 || value === 10000) {
              return value;
            }
            return null;
          }
        }
      },
      x: {
        title: { display: true, text: 'Temperatur [°C]' },
        ticks: {
          callback: function(val: any, index: number) {
            return index % 10 === 0 ? this.getLabelForValue(val) : '';
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            if (context.raw === null) return '';
            return `E-Modul: ${Number(context.raw).toFixed(1)} MPa`;
          }
        }
      }
    }
  };

  const getPlasticDescription = () => {
    switch(plasticType) {
      case 'amorphous':
        return "Amorphe Thermoplaste (z.B. PVC, PMMA, PC) bestehen aus ungeordneten Polymerketten. Unterhalb der Glasübergangstemperatur (Tg) sind sie hart und spröde (Glaszustand). Bei Überschreiten von Tg fallen Festigkeit und E-Modul drastisch ab, sie werden gummielastisch und gehen schließlich in den schmelzflüssigen Zustand über.";
      case 'semicrystalline':
        return "Teilkristalline Thermoplaste (z.B. PE, PP, PA) besitzen neben amorphen auch kristalline Bereiche. Beim Überschreiten von Tg sinkt der E-Modul, aber die kristallinen Bereiche halten das Material noch formstabil (lehnartiger Zustand). Erst beim Erreichen der Schmelztemperatur (Tm) der Kristalle wird das Material flüssig.";
      case 'elastomer':
        return "Elastomere (z.B. Gummi, Silikon) sind weitmaschig vernetzt. Ihre Glasübergangstemperatur liegt meist weit unter Raumtemperatur (z.B. -40°C). Bei Raumtemperatur befinden sie sich im gummielastischen Zustand. Sie schmelzen nicht, sondern zersetzen sich bei sehr hohen Temperaturen.";
      case 'duroplast':
        return "Duroplaste (z.B. Epoxidharz, PUR-Gießharz) sind engmaschig vernetzt. Sie weisen einen sehr hohen E-Modul auf, der auch bei höheren Temperaturen nur leicht abfällt. Sie schmelzen nicht und sind nicht plastisch verformbar, sondern zersetzen sich bei thermischer Überlastung.";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        {[
          { id: 'steckbrief', label: 'Baustoff-Steckbrief', icon: BookOpen },
          { id: 'arten', label: 'Arten & Einsatzbereiche', icon: List },
          { id: 'eigenschaften', label: 'Temperaturabhängigkeit', icon: Thermometer },
          { id: 'geosynthetics', label: '🌱 Geokunststoffe', icon: Layers },
          { id: 'etfe', label: '🔍 ETFE-Folien', icon: Maximize }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                isActive 
                  ? 'bg-shiraz text-white border-shiraz shadow-md' 
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

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
              <p>
                Das mechanische Verhalten von Kunststoffen ist extrem temperaturabhängig. Der E-Modul ändert sich je nach Struktur (Thermoplast, Duroplast, Elastomer) über die Temperatur um mehrere Zehnerpotenzen.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Kunststoff-Struktur</label><InfoTooltip text="Molekularer Aufbau des Kunststoffs (z.B. amorph, teilkristallin)." /></div>
                <InfoTooltip text="Wählen Sie die molekulare Struktur des Kunststoffs." />
              </div>
              <select 
                className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                value={plasticType}
                onChange={(e) => setPlasticType(e.target.value as any)}
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
              info="Aktuelle Bauteiltemperatur."
              onChange={(e) => setTemperature(Number(e.target.value))}
            />

            <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md">
              <div className="text-sm opacity-90 mb-1">Aktueller E-Modul</div>
              <div className="text-3xl font-bold">
                {chartData.currentE < 1 ? '< 1' : chartData.currentE.toFixed(0)} MPa
              </div>
              <div className="text-xs opacity-75 mt-2">
                Bei {temperature} °C
              </div>
            </div>
          </div>
        </div>

        {/* Chart Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[500px]">
            <h2 className="text-xl font-bold text-text-main mb-2">Temperaturabhängigkeit des E-Moduls</h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Zustandsbereiche: Glaszustand (hart/spröde), Haupteinfrierbereich (Tg), gummielastischer Zustand, Schmelze (Tm/Tf).
          </p>
        </div>
            
            <div className="flex-1 relative w-full h-full">
              <Line data={chartData} options={options} />
            </div>
          </div>

          {/* Schematische Darstellung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
            <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Polymerstrukturen</h3>
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
              <div className="text-xs text-text-main/70 text-center mt-2">
                Die makromolekulare Struktur bestimmt das thermomechanische Verhalten. Thermoplaste (amorph/teilkristallin) sind schmelzbar. Elastomere und Duroplaste sind durch chemische Bindungen (Punkte) vernetzt und schmelzen nicht.
              </div>
            </div>
          </div>
        </div>

      </div>
      )}

      {/* Arten und Einsatzbereiche */}
      {activeTab === 'arten' && (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 animate-in fade-in slide-in-from-bottom-2">
        <h2 className="text-xl font-bold text-text-main mb-6">Wichtige Kunststoffe und ihre Einsatzbereiche im Bauwesen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30">
            <h3 className="font-bold text-shiraz text-lg mb-2">PVC (Polyvinylchlorid)</h3>
            <div className="text-xs font-semibold text-home-grau uppercase tracking-wider mb-2">Amorpher Thermoplast</div>
            <p className="text-sm text-text-main/80 mb-3">
              Sehr vielseitig. Hart-PVC (PVC-U) ist steif und witterungsbeständig. Weich-PVC (PVC-P) enthält Weichmacher und ist flexibel.
            </p>
            <div className="text-sm">
              <strong>Einsatzbereiche:</strong>
              <ul className="list-disc list-inside text-text-main/70 mt-1">
                <li>Fensterprofile (Hart-PVC)</li>
                <li>Rohre für Abwasser (Hart-PVC)</li>
                <li>Bodenbeläge (Weich-PVC)</li>
                <li>Dach- und Dichtungsbahnen</li>
              </ul>
            </div>
          </div>

          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30">
            <h3 className="font-bold text-shiraz text-lg mb-2">PMMA (Polymethylmethacrylat)</h3>
            <div className="text-xs font-semibold text-home-grau uppercase tracking-wider mb-2">Amorpher Thermoplast</div>
            <p className="text-sm text-text-main/80 mb-3">
              Auch bekannt als Acrylglas oder Plexiglas. Zeichnet sich durch extrem hohe Lichtdurchlässigkeit und Witterungsbeständigkeit aus.
            </p>
            <div className="text-sm">
              <strong>Einsatzbereiche:</strong>
              <ul className="list-disc list-inside text-text-main/70 mt-1">
                <li>Transparente Überdachungen</li>
                <li>Lichtkuppeln</li>
                <li>Lärmschutzwände (transparent)</li>
                <li>Sanitärobjekte (Badewannen)</li>
              </ul>
            </div>
          </div>

          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30">
            <h3 className="font-bold text-shiraz text-lg mb-2">PE (Polyethylen)</h3>
            <div className="text-xs font-semibold text-home-grau uppercase tracking-wider mb-2">Teilkristalliner Thermoplast</div>
            <p className="text-sm text-text-main/80 mb-3">
              Sehr beständig gegen Säuren und Laugen. Unterscheidung in PE-LD (Low Density, weich) und PE-HD (High Density, steifer).
            </p>
            <div className="text-sm">
              <strong>Einsatzbereiche:</strong>
              <ul className="list-disc list-inside text-text-main/70 mt-1">
                <li>Trinkwasser- und Gasrohre (PE-HD)</li>
                <li>Dampfbremsfolien (PE-LD)</li>
                <li>Kabelisolierungen</li>
                <li>Geomembranen (Deponiebau)</li>
              </ul>
            </div>
          </div>

          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30">
            <h3 className="font-bold text-shiraz text-lg mb-2">EPS / XPS (Polystyrol)</h3>
            <div className="text-xs font-semibold text-home-grau uppercase tracking-wider mb-2">Amorpher Thermoplast (geschäumt)</div>
            <p className="text-sm text-text-main/80 mb-3">
              Expandiertes (EPS, "Styropor") oder extrudiertes (XPS) Polystyrol. XPS ist druckfester und unempfindlicher gegen Feuchtigkeit.
            </p>
            <div className="text-sm">
              <strong>Einsatzbereiche:</strong>
              <ul className="list-disc list-inside text-text-main/70 mt-1">
                <li>Wärmedämmverbundsysteme (EPS)</li>
                <li>Trittschalldämmung (EPS)</li>
                <li>Perimeterdämmung im Erdreich (XPS)</li>
                <li>Umkehrdächer (XPS)</li>
              </ul>
            </div>
          </div>

          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30">
            <h3 className="font-bold text-shiraz text-lg mb-2">PUR / PIR (Polyurethan)</h3>
            <div className="text-xs font-semibold text-home-grau uppercase tracking-wider mb-2">Duroplast / Elastomer</div>
            <p className="text-sm text-text-main/80 mb-3">
              Je nach Vernetzungsgrad als harter Schaumstoff (Duroplast) oder als elastische Dichtmasse (Elastomer) herstellbar. Sehr gute Dämmwirkung.
            </p>
            <div className="text-sm">
              <strong>Einsatzbereiche:</strong>
              <ul className="list-disc list-inside text-text-main/70 mt-1">
                <li>Hochleistungs-Wärmedämmung (PUR-Hartschaum)</li>
                <li>Montageschäume</li>
                <li>Dichtstoffe (Fugen)</li>
                <li>Flüssigkunststoff-Abdichtungen</li>
              </ul>
            </div>
          </div>

          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30">
            <h3 className="font-bold text-shiraz text-lg mb-2">EPDM (Ethylen-Propylen-Dien-Kautschuk)</h3>
            <div className="text-xs font-semibold text-home-grau uppercase tracking-wider mb-2">Elastomer</div>
            <p className="text-sm text-text-main/80 mb-3">
              Ein synthetischer Kautschuk. Extrem witterungs-, UV- und ozonbeständig. Bleibt auch bei tiefen Temperaturen elastisch.
            </p>
            <div className="text-sm">
              <strong>Einsatzbereiche:</strong>
              <ul className="list-disc list-inside text-text-main/70 mt-1">
                <li>Flachdachabdichtungen (Folien)</li>
                <li>Fassaden- und Fensterdichtungen</li>
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
            <p>
              <strong>Geokunststoffe</strong> (Geosynthetics) sind polymere Produkte (Kunststoffe), die im Grundbau, Wasserbau und Verkehrswegebau in Kontakt mit Boden oder Gestein eingesetzt werden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2">Arten von Geokunststoffen</h3>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2 font-medium">
                <li><strong>Geotextilien:</strong> Durchlässige, flächenhafte Textilien (Vliesstoffe, Gewebe, Maschenwaren).</li>
                <li><strong>Geogitter (Geogrids):</strong> Gitterartige Strukturen mit großen Öffnungen, primär zur Bewehrung.</li>
                <li><strong>Geomembranen:</strong> Nahezu wasserundurchlässige Kunststoffbahnen (Dichtungsbahnen).</li>
                <li><strong>Geoverbundstoffe:</strong> Kombinationen aus verschiedenen Geokunststoffen (z.B. Drainagematten aus Kern und Filtervlies).</li>
              </ul>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2">Hauptfunktionen</h3>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2 font-medium">
                <li><strong>Trennen:</strong> Verhindert die Vermischung von feinkörnigem Untergrund und grobkörniger Tragschicht.</li>
                <li><strong>Filtern:</strong> Hält Bodenpartikel zurück, lässt aber Wasser passieren (Ersatz für mineralische Filter).</li>
                <li><strong>Bewehrung:</strong> Aufnahme von Zugkräften zur Stabilisierung von Erdkörpern (z.B. steile Böschungen, Stützwände).</li>
                <li><strong>Abdichten:</strong> Verhindert den Durchtritt von Flüssigkeiten oder Gasen (z.B. Deponiebau, Tunnelbau).</li>
                <li><strong>Schützen:</strong> Schützt empfindliche Bauteile (z.B. Geomembranen) vor mechanischer Beschädigung.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'etfe' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p>
              <strong>ETFE (Ethylen-Tetrafluorethylen)</strong> ist ein fluoriertes Polymer (Spezialkunststoff), das in der modernen Architektur häufig als Folie für leichte, transparente Dach- und Fassadenkonstruktionen (Membranbau) eingesetzt wird.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2">Herausragende Eigenschaften</h3>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2 font-medium">
                <li><strong>Extrem geringes Eigengewicht:</strong> Wiegt nur einen Bruchteil von Glas, was immense Einsparungen beim Tragwerk ermöglicht.</li>
                <li><strong>Hohe Lichtdurchlässigkeit:</strong> Lässt bis zu 95 % des Lichts (einschließlich UV-Strahlung, wichtig für Pflanzen) passieren.</li>
                <li><strong>Selbstreinigend:</strong> Aufgrund der extrem glatten Antihaft-Oberfläche wäscht Regen Schmutz einfach ab.</li>
                <li><strong>Langlebigkeit:</strong> Reißfest, chemikalienbeständig und alterungsbeständig über mehrere Jahrzehnte.</li>
              </ul>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-2">Konstruktion & Kissenaufbau</h3>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2 font-medium">
                <li><strong>Pneumatische Kissen:</strong> Zwei bis fünf Lagen ETFE-Folie werden am Rand in Aluminiumprofilen eingespannt und permanent mit Stützluft aufgeblasen. Dies sorgt für Stabilität und Wärmedämmung.</li>
                <li><strong>Druckluftsteuerung:</strong> Der Druck in den Kissen wird computergesteuert an Wind- und Schneelasten angepasst.</li>
                <li><strong>Verschattung:</strong> Durch Bedruckung einzelner Lagen und Verschieben über den Kisseninnendruck lässt sich die Lichtdurchlässigkeit aktiv regulieren.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <PlasticsThematicLinks current="baustoff" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Kunststoff', url: 'https://de.wikipedia.org/wiki/Kunststoff' },
          { title: 'Thermoplaste', url: 'https://de.wikipedia.org/wiki/Thermoplaste' },
          { title: 'Duroplaste', url: 'https://de.wikipedia.org/wiki/Duroplaste' },
          { title: 'Elastomere', url: 'https://de.wikipedia.org/wiki/Elastomere' },
          { title: 'Ethylen-Tetrafluorethylen (ETFE)', url: 'https://de.wikipedia.org/wiki/Ethylen-Tetrafluorethylen' }
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 527-1:2019-12 (Kunststoffe - Bestimmung der Zugeigenschaften - Teil 1: Allgemeine Grundsätze)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN ISO 6721-1:2019-09 (Kunststoffe - Bestimmung dynamisch-mechanischer Eigenschaften - Teil 1: Allgemeine Grundlagen)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN ISO 11357-1:2023-08 (Kunststoffe - Dynamische Differenz-Thermoanalyse (DSC) - Teil 1: Allgemeine Grundlagen)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN ISO 11359-2:2022-03 (Kunststoffe - Thermomechanische Analyse (TMA) - Teil 2: Bestimmung des linearen thermischen Längenausdehnungskoeffizienten)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN ISO 178:2019-08 (Kunststoffe - Bestimmung der Biegeeigenschaften)', url: 'https://www.dinmedia.de/' }
        ]}
        literatur={[
          'Domininghaus, H. (2012): Die Kunststoffe und ihre Eigenschaften (Springer Vieweg)',
          'Ehrenstein, G. W. (2011): Polymer-Werkstoffe: Struktur - Eigenschaften - Anwendung, 3. Aufl. (Hanser Verlag)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
            formel: 'E(T) = f(T_g, T_m, \\text{Vernetzungsgrad})',
            erklaerung: 'Temperaturabhängigkeit des Elastizitätsmoduls: Am Glasübergang Tg (Gleichgewichtszustand zwischen eingefrorenem und beweglichem Zustand der Hauptvalenzketten) fällt der Modul drastisch ab.',
            quelle: 'Domininghaus: Kunststoffe'
          },
          {
            formel: '\\sigma(t) = E_c(t, T) \\cdot \\varepsilon_0',
            erklaerung: 'Viskoelastisches Spannungsrelaxationsverhalten: Der Kriechmodul Ec sinkt mit zunehmender Lastdauer t und Temperatur T infolge mikrostruktureller Gleitprozesse.',
            quelle: 'Ehrenstein: Polymerwerkstoffe'
          },
          {
            formel: '\\Delta L = L_0 \\cdot \\alpha_T \\cdot \\Delta T',
            erklaerung: 'Thermische Längendehnung von Kunststoffen (mit linearem Ausdehnungskoeffizienten \\alpha_T ca. 7-20 mal höher als bei Beton/Stahl).',
            quelle: 'DIN EN ISO 11359-2:2022-03'
          }
        ]}
      />
    </div>
  );
}
