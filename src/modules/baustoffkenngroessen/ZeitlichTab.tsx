// Ausgelagert aus src/modules/Baustoffkenngroessen.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Clock } from 'lucide-react';
import { Slider } from '@/src/components/ui/Slider';
import { BlockMath, InlineMath } from 'react-katex';
import { Line } from 'react-chartjs-2';
import inhalt from '@/content/baustoffkenngroessen/ZeitlichTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
            <Clock className="text-shiraz" size={18} /><MdText text={inhalt.texte.zeitabhängigesWerkstoffverhalten} /></h3>
          <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.vieleBaustoffeAllenVoran} /></p>

          <div className="space-y-4 pt-2">
            {/* Kriechen Card */}
            <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px] uppercase tracking-wider"><MdText text={inhalt.texte.t1KriechenCreep} /></span>
              <p className="text-xs text-text-main/80 mt-1.5 leading-relaxed"><MdText text={inhalt.texte.kontinuierlicheZunahmeDerViskosen} /></p>
              <div className="mt-2 bg-white px-3 py-1.5 rounded border border-home-grau/30 text-center">
                <BlockMath math="\varepsilon_{cr}(t) = \varepsilon_{el} \cdot \phi(t) = \frac{\sigma_0}{E} \cdot \phi(t)" />
              </div>
              <div className="mt-2 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100/40 text-[10px] text-slate-700 leading-relaxed text-left">
                <span className="font-bold text-indigo-950 block"><MdText text={inhalt.texte.einfacheBeispielrechnung} /></span><MdText text={inhalt.texte.dauerlastspannungSigma010} /><div className="font-mono mt-1 bg-white/80 p-1 rounded border border-indigo-100/30 text-slate-900"><MdText text={inhalt.texte.cr1030000} /></div>
              </div>
            </div>

            {/* Schwinden Card */}
            <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px] uppercase tracking-wider"><MdText text={inhalt.texte.t2SchwindenShrinkage} /></span>
              <p className="text-xs text-text-main/80 mt-1.5 leading-relaxed"><MdText text={inhalt.texte.volumenminderungÜberDieZeit} /></p>
              <div className="mt-2 bg-white px-3 py-1.5 rounded border border-home-grau/30 text-center">
                <BlockMath math="\varepsilon_{cs}(t) = \varepsilon_{cs,\infty} \cdot \beta_{ds}(t)" />
              </div>
              <div className="mt-2 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100/40 text-[10px] text-slate-700 leading-relaxed text-left">
                <span className="font-bold text-indigo-950 block"><MdText text={inhalt.texte.einfacheBeispielrechnung2} /></span><MdText text={inhalt.texte.endschwindmaßVarepsilonCsInfty} /><div className="font-mono mt-1 bg-white/80 p-1 rounded border border-indigo-100/30 text-slate-900"><MdText text={inhalt.texte.cs050} /></div>
              </div>
            </div>

            {/* Relaxation Card */}
            <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold text-[10px] uppercase tracking-wider"><MdText text={inhalt.texte.t3Relaxation} /></span>
              <p className="text-xs text-text-main/80 mt-1.5 leading-relaxed"><MdText text={inhalt.texte.kontinuierlicherSpannungsabfallÜberDie} /></p>
              <div className="mt-2 bg-white px-3 py-1.5 rounded border border-home-grau/30 text-center">
                <BlockMath math="\sigma(t) = \sigma_0 \cdot [1 - \psi(t)]" />
              </div>
              <div className="mt-2 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100/40 text-[10px] text-slate-700 leading-relaxed text-left">
                <span className="font-bold text-indigo-950 block"><MdText text={inhalt.texte.einfacheBeispielrechnung3} /></span><MdText text={inhalt.texte.anfangsspannungSigma020} /><div className="font-mono mt-1 bg-white/80 p-1 rounded border border-indigo-100/30 text-slate-900"><MdText text={inhalt.texte.t20Mpa1} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Interaktive Parameterregelungen */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-md font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.interaktivesSimulationslabor} /></h3>
          <p className="text-[11px] text-slate-500"><MdText text={inhalt.texte.lehrmodellMitVereinfachtenZeitfunktionen} /></p>
          
          <div className="space-y-4">
            <Slider 
              label={inhalt.werte.dauerlastspannung} 
              min={1} 
              max={30} 
              step={0.5} 
              value={zeitlichSigma0} 
              unit="MPa" 
              onChange={(e) => setZeitlichSigma0(Number(e.target.value))} 
            />
            <Slider 
              label={inhalt.werte.elastizitätsmodulEModul} 
              min={5000} 
              max={210000} 
              step={1000} 
              value={zeitlichE} 
              unit="MPa" 
              onChange={(e) => setZeitlichE(Number(e.target.value))} 
            />
            <Slider 
              label={inhalt.werte.endkriechbeiwertInf} 
              min={0.5} 
              max={4.5} 
              step={0.1} 
              value={zeitlichPhi} 
              unit="" 
              onChange={(e) => setZeitlichPhi(Number(e.target.value))} 
            />
            <Slider 
              label={inhalt.werte.endschwindmaßCsInf} 
              min={-1.5} 
              max={0.0} 
              step={0.05} 
              value={zeitlichSchwindenInf} 
              unit="‰" 
              onChange={(e) => setZeitlichSchwindenInf(Number(e.target.value))} 
            />
            <Slider 
              label={inhalt.werte.endrelaxationInf} 
              min={0} 
              max={30} 
              step={1} 
              value={zeitlichRelaxationInf} 
              unit="%" 
              onChange={(e) => setZeitlichRelaxationInf(Number(e.target.value))} 
            />
            <Slider 
              label={inhalt.werte.beobachtungszeitpunktT} 
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
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.echtzeitBerechnungsprotokollFürT} />{formatDeWert(zeitlichT)} d</h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-home-grau/30">
              <span className="text-[10px] text-slate-400 font-bold block uppercase"><MdText text={inhalt.texte.elastischeErstdehnung} /></span>
              <span className="text-md font-extrabold text-slate-700 block mt-1">{formatDeZahl(currentTimed.eps_el, 3)} ‰</span>
              <span className="text-[9px] text-slate-400 mt-0.5 block"><MdText text={inhalt.texte.elastischerInitialwertBeiBelastung} /></span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] text-amber-600 font-bold block uppercase"><MdText text={inhalt.texte.kriechbeiwertT} /></span>
              <span className="text-md font-extrabold text-amber-700 block mt-1">{formatDeZahl(currentTimed.phi_t, 2)}</span>
              <span className="text-[9px] text-amber-500 mt-0.5 block"><MdText text={inhalt.texte.endwertWar} />{formatDeZahl(zeitlichPhi, 1)})</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] text-amber-600 font-bold block uppercase"><MdText text={inhalt.texte.kriechdehnungCrT} /></span>
              <span className="text-md font-extrabold text-amber-700 block mt-1">{formatDeZahl(currentTimed.eps_cr, 3)} ‰</span>
              <span className="text-[9px] text-amber-500 mt-0.5 block">({formatDeZahl((currentTimed.phi_t * 100), 0)}<MdText text={inhalt.texte.derErstdehnung} /></span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] text-blue-600 font-bold block uppercase"><MdText text={inhalt.texte.schwinddehnungCsT} /></span>
              <span className="text-md font-extrabold text-blue-700 block mt-1">{formatDeZahl(currentTimed.eps_cs, 3)} ‰</span>
              <span className="text-[9px] text-blue-500 mt-0.5 block"><MdText text={inhalt.texte.schrumpfungOhneLast} /></span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-rose-600 font-bold block uppercase"><MdText text={inhalt.texte.summenverformungTotalT} /></span>
              <span className="text-[9px] text-rose-500 mt-0.5 block"><MdText text={inhalt.texte.gesamtElCrCs} /></span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-shiraz">{formatDeZahl(currentTimed.eps_total, 3)} ‰</span>
              <span className="text-[10px] text-rose-600 font-bold block"><MdText text={inhalt.texte.gesamtstauchungBetrag} /></span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-indigo-600 font-bold block uppercase"><MdText text={inhalt.texte.spannungsabfallDurchRelaxationT} /></span>
              <span className="text-[9px] text-indigo-500 mt-0.5 block"><MdText text={inhalt.texte.ausgehendVon} />{formatDeWert(zeitlichSigma0)} MPa</span>
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
            <h4 className="font-bold text-sm text-text-main mb-1"><MdText text={inhalt.texte.dehnungsentwicklungKriechenSchwinden} /></h4>
            <p className="text-[11px] text-slate-400"><MdText text={inhalt.texte.zeigtDasZeitlicheDehnungsverhalten} /></p>
            <div className="h-48 w-full mt-3">
              <Line 
                data={dehnungenChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { title: { display: true, text: 'Dehnung (‰)', font: { size: 10 } } },
                    x: { title: { display: true, text: inhalt.werte.beobachtungszeitD, font: { size: 10 } } }
                  },
                  plugins: { legend: { display: true, labels: { boxWidth: 12, font: { size: 9 } } } }
                }} 
              />
            </div>
          </div>

          <hr className="border-home-grau/30" />

          <div>
            <h4 className="font-bold text-sm text-text-main mb-1"><MdText text={inhalt.texte.spannungsabbauDurchRelaxationIm} /></h4>
            <p className="text-[11px] text-slate-400"><MdText text={inhalt.texte.zeigtDenKontinuierlichenAbbau} /></p>
            <div className="h-44 w-full mt-3">
              <Line 
                data={relaxationChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { title: { display: true, text: inhalt.werte.restspannungMpa, font: { size: 10 } } },
                    x: { title: { display: true, text: inhalt.werte.beobachtungszeitD2, font: { size: 10 } } }
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
