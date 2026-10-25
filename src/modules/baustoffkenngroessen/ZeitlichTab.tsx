// Ausgelagert aus src/modules/Baustoffkenngroessen.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Clock } from 'lucide-react';
import { Slider } from '@/src/components/ui/Slider';
import { BlockMath, InlineMath } from 'react-katex';
import { Line } from 'react-chartjs-2';

export interface ZeitlichTabProps {
  currentTimed: { eps_el: number; phi_t: number; eps_cr: number; eps_cs: number; eps_total: number; sigma_t: number; };
  dehnungenChartData: { labels: string[]; datasets: ({ label: string; data: number[]; borderColor: string; backgroundColor: string; borderDash: number[]; borderWidth: number; tension: number; pointRadius: number; } | { label: string; data: number[]; borderColor: string; backgroundColor: string; borderWidth: number; tension: number; pointRadius: number; borderDash?: undefined; })[]; };
  relaxationChartData: { labels: string[]; datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; borderWidth: number; tension: number; pointRadius: number; }[]; };
  setZeitlichE: React.Dispatch<React.SetStateAction<number>>;
  setZeitlichPhi: React.Dispatch<React.SetStateAction<number>>;
  setZeitlichRelaxationInf: React.Dispatch<React.SetStateAction<number>>;
  setZeitlichSchwindenInf: React.Dispatch<React.SetStateAction<number>>;
  setZeitlichSigma0: React.Dispatch<React.SetStateAction<number>>;
  setZeitlichT: React.Dispatch<React.SetStateAction<number>>;
  zeitlichE: number;
  zeitlichPhi: number;
  zeitlichRelaxationInf: number;
  zeitlichSchwindenInf: number;
  zeitlichSigma0: number;
  zeitlichT: number;
}

export default function ZeitlichTab({ currentTimed, dehnungenChartData, relaxationChartData, setZeitlichE, setZeitlichPhi, setZeitlichRelaxationInf, setZeitlichSchwindenInf, setZeitlichSigma0, setZeitlichT, zeitlichE, zeitlichPhi, zeitlichRelaxationInf, zeitlichSchwindenInf, zeitlichSigma0, zeitlichT }: ZeitlichTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-fade-in">
      {/* Spalte 1: Theorie & Parameter */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
            <Clock className="text-shiraz" size={18} /> Zeitabhängiges Werkstoffverhalten
          </h3>
          <p className="text-sm text-text-main/80 leading-relaxed">
            Viele Baustoffe – allen voran <strong>Beton, Holz und Kunststoffe</strong> (viskoelastische Materialien) – zeigen signifikante Verformungsänderungen über die Zeit, selbst wenn die Last absolut konstant bleibt. Man unterscheidet drei wesentliche physikalische Phänomene:
          </p>

          <div className="space-y-4 pt-2">
            {/* Kriechen Card */}
            <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px] uppercase tracking-wider">1. Kriechen (Creep)</span>
              <p className="text-xs text-text-main/80 mt-1.5 leading-relaxed">
                Kontinuierliche Zunahme der viskosen Dehnung unter einer <strong>konstanten langanhaltenden mechanischen Spannung (<InlineMath math="\sigma_0" />)</strong>.
              </p>
              <div className="mt-2 bg-white px-3 py-1.5 rounded border border-home-grau/30 text-center">
                <BlockMath math="\varepsilon_{cr}(t) = \varepsilon_{el} \cdot \phi(t) = \frac{\sigma_0}{E} \cdot \phi(t)" />
              </div>
              <div className="mt-2 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100/40 text-[10px] text-slate-700 leading-relaxed text-left">
                <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                Dauerlastspannung <InlineMath math="\sigma_0 = 10 \text{ MPa}" />, E-Modul <InlineMath math="E = 30.000 \text{ MPa}" /> (elastische Dehnung <InlineMath math="\varepsilon_{el} = 0{,}33 \ \text{‰}" />) und Endkriechbeiwert <InlineMath math="\phi = 2{,}0" />.
                <div className="font-mono mt-1 bg-white/80 p-1 rounded border border-indigo-100/30 text-slate-900">
                  &epsilon;_cr = (10 / 30.000) · 2,0 = 0,000333 · 2,0 = 0,000667 (0,67 &permil;)
                </div>
              </div>
            </div>

            {/* Schwinden Card */}
            <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px] uppercase tracking-wider">2. Schwinden (Shrinkage)</span>
              <p className="text-xs text-text-main/80 mt-1.5 leading-relaxed">
                Volumenminderung über die Zeit <strong>ohne jegliche äußere Krafteinwirkung</strong> (rein hygrisch durch Wasserabgabe aus Kapillaren und Poren).
              </p>
              <div className="mt-2 bg-white px-3 py-1.5 rounded border border-home-grau/30 text-center">
                <BlockMath math="\varepsilon_{cs}(t) = \varepsilon_{cs,\infty} \cdot \beta_{ds}(t)" />
              </div>
              <div className="mt-2 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100/40 text-[10px] text-slate-700 leading-relaxed text-left">
                <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                Endschwindmaß <InlineMath math="\varepsilon_{cs,\infty} = -0{,}5 \ \text{‰}" /> und zeitabhängiger Beiwert <InlineMath math="\beta_{ds}(t) = 0{,}6" /> (nach ca. 100 Tagen).
                <div className="font-mono mt-1 bg-white/80 p-1 rounded border border-indigo-100/30 text-slate-900">
                  &epsilon;_cs = -0,5 &permil; · 0,6 = -0,30 &permil;
                </div>
              </div>
            </div>

            {/* Relaxation Card */}
            <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold text-[10px] uppercase tracking-wider">3. Relaxation</span>
              <p className="text-xs text-text-main/80 mt-1.5 leading-relaxed">
                Kontinuierlicher <strong>Spannungsabfall</strong> über die Zeit bei einer <strong>erzwungenen, absolut konstanten Dehnung</strong> (ein Teil der elastischen Dehnung wird durch Kriechvorgänge in bleibende Verformung umgewandelt).
              </p>
              <div className="mt-2 bg-white px-3 py-1.5 rounded border border-home-grau/30 text-center">
                <BlockMath math="\sigma(t) = \sigma_0 \cdot [1 - \psi(t)]" />
              </div>
              <div className="mt-2 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100/40 text-[10px] text-slate-700 leading-relaxed text-left">
                <span className="font-bold text-indigo-950 block">🔢 Einfache Beispielrechnung:</span>
                Anfangsspannung <InlineMath math="\sigma_0 = 20 \text{ MPa}" /> und Spannungsabfallbeiwert (Relaxationsgrad) <InlineMath math="\psi = 0{,}15" /> (15 %).
                <div className="font-mono mt-1 bg-white/80 p-1 rounded border border-indigo-100/30 text-slate-900">
                  σ(t) = 20 MPa · (1 - 0,15) = 20 · 0,85 = 17,0 MPa
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interaktive Parameterregelungen */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-md font-bold text-text-main border-b border-home-grau/30 pb-2">Interaktives Simulationslabor</h3>
          <p className="text-[11px] text-slate-500">Lehrmodell mit vereinfachten Zeitfunktionen β(t) = t/(t + 30) für Kriechen und Relaxation sowie t/(t + 150) für Schwinden. Die genauen Funktionen nach DIN EN 1992-1-1, Anhang B, hängen zusätzlich von wirksamer Bauteildicke, Luftfeuchte, Zementart und Belastungsalter ab.</p>
          
          <div className="space-y-4">
            <Slider 
              label="Dauerlastspannung (σ₀)" 
              min={1} 
              max={30} 
              step={0.5} 
              value={zeitlichSigma0} 
              unit="MPa" 
              onChange={(e) => setZeitlichSigma0(Number(e.target.value))} 
            />
            <Slider 
              label="Elastizitätsmodul (E-Modul)" 
              min={5000} 
              max={210000} 
              step={1000} 
              value={zeitlichE} 
              unit="MPa" 
              onChange={(e) => setZeitlichE(Number(e.target.value))} 
            />
            <Slider 
              label="Endkriechbeiwert (φ_inf)" 
              min={0.5} 
              max={4.5} 
              step={0.1} 
              value={zeitlichPhi} 
              unit="" 
              onChange={(e) => setZeitlichPhi(Number(e.target.value))} 
            />
            <Slider 
              label="Endschwindmaß (ε_cs,inf)" 
              min={-1.5} 
              max={0.0} 
              step={0.05} 
              value={zeitlichSchwindenInf} 
              unit="‰" 
              onChange={(e) => setZeitlichSchwindenInf(Number(e.target.value))} 
            />
            <Slider 
              label="Endrelaxation (ψ_inf)" 
              min={0} 
              max={30} 
              step={1} 
              value={zeitlichRelaxationInf} 
              unit="%" 
              onChange={(e) => setZeitlichRelaxationInf(Number(e.target.value))} 
            />
            <Slider 
              label="Beobachtungszeitpunkt (t)" 
              min={0} 
              max={1080} 
              step={5} 
              value={zeitlichT} 
              unit="Tage (d)" 
              onChange={(e) => setZeitlichT(Number(e.target.value))} 
            />
          </div>
        </div>
      </div>

      {/* Spalte 2: Echtzeit-Diagramme & Kennwerte */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Echtzeit-Berechnungsprotokoll für t = {formatDeWert(zeitlichT)} d</h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-home-grau/30">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Elastische Erstdehnung</span>
              <span className="text-md font-extrabold text-slate-700 block mt-1">{formatDeZahl(currentTimed.eps_el, 3)} ‰</span>
              <span className="text-[9px] text-slate-400 mt-0.5 block">(elastischer Initialwert bei Belastung)</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] text-amber-600 font-bold block uppercase">Kriechbeiwert φ(t)</span>
              <span className="text-md font-extrabold text-amber-700 block mt-1">{formatDeZahl(currentTimed.phi_t, 2)}</span>
              <span className="text-[9px] text-amber-500 mt-0.5 block">(Endwert war: {formatDeZahl(zeitlichPhi, 1)})</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] text-amber-600 font-bold block uppercase">Kriechdehnung ε_cr(t)</span>
              <span className="text-md font-extrabold text-amber-700 block mt-1">{formatDeZahl(currentTimed.eps_cr, 3)} ‰</span>
              <span className="text-[9px] text-amber-500 mt-0.5 block">({formatDeZahl((currentTimed.phi_t * 100), 0)}% der Erstdehnung)</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] text-blue-600 font-bold block uppercase">Schwinddehnung ε_cs(t)</span>
              <span className="text-md font-extrabold text-blue-700 block mt-1">{formatDeZahl(currentTimed.eps_cs, 3)} ‰</span>
              <span className="text-[9px] text-blue-500 mt-0.5 block">(Schrumpfung ohne Last)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-rose-600 font-bold block uppercase">Summenverformung ε_total(t)</span>
              <span className="text-[9px] text-rose-500 mt-0.5 block">|ε_gesamt| = ε_el + ε_cr + |ε_cs| (alle Anteile verkürzen)</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-shiraz">{formatDeZahl(currentTimed.eps_total, 3)} ‰</span>
              <span className="text-[10px] text-rose-600 font-bold block">Gesamtstauchung (Betrag)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-indigo-600 font-bold block uppercase">Spannungsabfall durch Relaxation σ(t)</span>
              <span className="text-[9px] text-indigo-500 mt-0.5 block">ausgehend von σ₀ = {formatDeWert(zeitlichSigma0)} MPa</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-indigo-700">{formatDeZahl(currentTimed.sigma_t, 2)} MPa</span>
              <span className="text-[10px] text-indigo-600 font-bold block">Restspannung</span>
            </div>
          </div>
        </div>

        {/* Diagrams section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <div>
            <h4 className="font-bold text-sm text-text-main mb-1">Dehnungsentwicklung (Kriechen &amp; Schwinden)</h4>
            <p className="text-[11px] text-slate-400">Zeigt das zeitliche Dehnungsverhalten unter Last sowie das reine lastfreie Schwinden (Schrumpfung).</p>
            <div className="h-48 w-full mt-3">
              <Line 
                data={dehnungenChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { title: { display: true, text: 'Dehnung (‰)', font: { size: 10 } } },
                    x: { title: { display: true, text: 'Beobachtungszeit d', font: { size: 10 } } }
                  },
                  plugins: { legend: { display: true, labels: { boxWidth: 12, font: { size: 9 } } } }
                }} 
              />
            </div>
          </div>

          <hr className="border-home-grau/30" />

          <div>
            <h4 className="font-bold text-sm text-text-main mb-1">Spannungsabbau durch Relaxation im Zwangzustand</h4>
            <p className="text-[11px] text-slate-400">Zeigt den kontinuierlichen Abbau einer mechanischen Spannung über die Zeit bei festgehaltener Länge.</p>
            <div className="h-44 w-full mt-3">
              <Line 
                data={relaxationChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { title: { display: true, text: 'Restspannung (MPa)', font: { size: 10 } } },
                    x: { title: { display: true, text: 'Beobachtungszeit d', font: { size: 10 } } }
                  },
                  plugins: { legend: { display: false } }
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
