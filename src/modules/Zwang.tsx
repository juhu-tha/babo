import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, type TooltipItem } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Lock, AlertTriangle } from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import inhalt from '@/content/zwang/Zwang.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { zwangSpannung } from '@/src/calc/zwang';

export function ZwangCalculator() {
  const [deltaT, setDeltaT] = useState(20); // Temperaturänderung in K
  const [shrinkage, setShrinkage] = useState(0.3); // Schwindmaß in ‰
  const [eModulus, setEModulus] = useState(30000); // E-Modul in MPa
  const [restraint, setRestraint] = useState(100); // Festhaltungsgrad in %
  const [fct, setFct] = useState(3.0); // Zugfestigkeit in MPa

  // Rechnung: src/calc/zwang.ts (σ_z = (α_T·ΔT + ε_cs)·E·R), geprüft in tests/tranche16.test.ts
  const calcData = useMemo(() => {
    const z = zwangSpannung({ deltaT, epsCsPromille: shrinkage, eModul: eModulus, festhaltungProzent: restraint, fct });
    const stressProfile = z.verlauf.map(p => p.sigma);
    const strengthProfile = z.verlauf.map(() => fct);

    return {
      epsT: z.epsT,
      epsS: z.epsS,
      epsTotal: z.epsFrei,
      sigmaZ: z.sigma,
      isCracked: z.gerissen,
      chartData: {
        labels: z.verlauf.map(p => `${p.festhaltungProzent}%`),
        datasets: [
          {
            label: inhalt.werte.zwangspannungZMpa,
            data: stressProfile,
            borderColor: '#e63946',
            backgroundColor: 'rgba(230, 57, 70, 0.1)',
            fill: true,
            borderWidth: 3,
            pointRadius: 4,
          },
          {
            label: inhalt.werte.zugfestigkeitFCtMpa,
            data: strengthProfile,
            borderColor: '#457b9d',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
          }
        ]
      }
    };
  }, [deltaT, shrinkage, eModulus, restraint, fct]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold text-text-main">Zwangspannungen</h2>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.zwangEntstehtWennEin} /></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
                Verformungsursachen
                <InfoTooltip text={inhalt.werte.ursachenDieZuEiner} />
              </h3>
              
              <Slider label={<FormulaText text="Temperaturabfall \Delta T" />} info={inhalt.werte.temperaturabfallDesBauteilsBspw}
                min={0} max={50} step={1} 
                value={deltaT} unit="K" 
                onChange={(e) => setDeltaT(Number(e.target.value))} 
              />
              <div className="mt-4">
                <Slider info={inhalt.werte.freiesSchwindmaßDesBetons} label={<FormulaText text="Schwindmaß \varepsilon_{cs}" />}
                  min={0} max={1.0} step={0.05} 
                  value={shrinkage} unit="‰" 
                  onChange={(e) => setShrinkage(Number(e.target.value))} 
                />
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2"><MdText text={inhalt.texte.bauteilMaterialeigenschaften} /></h3>
              
              <Slider 
                label={inhalt.werte.festhaltungsgradR} info={inhalt.werte.maßFürDieBehinderung} 
                min={0} max={100} step={10} 
                value={restraint} unit="%" 
                onChange={(e) => setRestraint(Number(e.target.value))} 
              />
              <div className="mt-4">
                <Slider label={<FormulaText text="E-Modul E_c" />} info={inhalt.werte.effektiverElastizitätsmodulDesBetons}
                  min={10000} max={45000} step={1000} 
                  value={eModulus} unit="MPa" 
                  onChange={(e) => setEModulus(Number(e.target.value))} 
                />
              </div>
              <div className="mt-4">
                <Slider info={inhalt.werte.dieWirksameZugfestigkeitDes} label={<FormulaText text={inhalt.werte.zugfestigkeitFCt} />}
                  min={1.0} max={6.0} step={0.1} 
                  value={fct} unit="MPa" 
                  onChange={(e) => setFct(Number(e.target.value))} 
                />
              </div>
            </div>

          </div>

          <div className="flex flex-col gap-6">
            <div className={`p-6 rounded-xl shadow-md transition-colors ${calcData.isCracked ? 'bg-shiraz text-white' : 'bg-teal-600 text-white'}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-90">Ergebnisse</h3>
                {calcData.isCracked && <AlertTriangle size={24} className="animate-pulse" />}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-white/70 text-sm mb-1"><FormulaText text="Zwangspannung \sigma_{z}" /></div>
                  <div className="text-3xl font-bold">{formatDeZahl(calcData.sigmaZ, 2)} MPa</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm mb-1">Zustand</div>
                  <div className="text-xl font-bold mt-2">
                    {calcData.isCracked ? 'Gerissen' : 'Ungerissen'}
                  </div>
                </div>
              </div>

              <div className="text-sm bg-white/10 p-3 rounded-lg">
                <p><MdText text={inhalt.texte.freieDehnungVerhindert} /><strong>{formatDeZahl((calcData.epsTotal * 1000), 2)} ‰</strong></p>
                <p className="mt-1 opacity-90 text-xs">
                  (ΔT: {formatDeZahl((calcData.epsT * 1000), 2)}<MdText text={inhalt.texte.schwinden} />{formatDeZahl((calcData.epsS * 1000), 2)} ‰)
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[300px]">
              <h3 className="text-sm font-bold text-text-main mb-4"><MdText text={inhalt.texte.spannungÜberFesthaltungsgrad} /></h3>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={calcData.chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { title: { display: true, text: inhalt.werte.festhaltungsgradR2 } },
                      y: { 
                        title: { display: true, text: inhalt.werte.spannungMpa },
                        min: 0,
                        max: Math.max(calcData.sigmaZ, fct) * 1.2
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context: TooltipItem<'line'>) => `${context.dataset.label}: ${formatDeZahl(context.raw as number, 2)} MPa`
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungEntstehungVon} /></h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="180" viewBox="0 0 350 180">
                  {/* Fall 1: Frei */}
                  <g transform="translate(20, 20)">
                    <text x="0" y="0" fontSize="10" fill="#1e293b" fontWeight="bold">1. Freie Verformung (R = 0)</text>
                    <rect x="0" y="10" width="100" height="20" fill="#cbd5e1" stroke="#94a3b8" />
                    <rect x="0" y="40" width="80" height="20" fill="#cbd5e1" stroke="#94a3b8" strokeDasharray="2 2" />
                    <path d="M 100 20 L 80 50" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
                    <path d="M 85 50 L 95 50" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow-red-small)" />
                    <text x="105" y="53" fontSize="10" fill="#ef4444">ΔL (Schwinden/Abkühlen)</text>
                    <text x="105" y="65" fontSize="10" fill="#16a34a">σ = 0 (Keine Spannung)</text>
                  </g>

                  {/* Fall 2: Behindert */}
                  <g transform="translate(20, 100)">
                    <text x="0" y="0" fontSize="10" fill="#1e293b" fontWeight="bold">2. Behinderte Verformung (R = 1)</text>
                    {/* Einspannungen */}
                    <rect x="-10" y="10" width="10" height="40" fill="#94a3b8" />
                    <rect x="100" y="10" width="10" height="40" fill="#94a3b8" />
                    
                    {/* Betonbauteil (kann sich nicht zusammenziehen) */}
                    <rect x="0" y="20" width="100" height="20" fill="#cbd5e1" stroke="#94a3b8" />
                    
                    {/* Zugspannungen */}
                    <path d="M 20 30 L 10 30" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow-red-small)" />
                    <path d="M 80 30 L 90 30" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow-red-small)" />
                    <text x="115" y="33" fontSize="10" fill="#ef4444">Zugspannung σ_z baut sich auf</text>
                    
                    {/* Riss */}
                    <path d="M 50 15 L 45 25 L 55 35 L 50 45" stroke="#1e293b" strokeWidth="2" fill="none" />
                    <text x="115" y="45" fontSize="10" fill="#1e293b">Wenn σ_z &gt; f_ct → Riss</text>
                  </g>

                  <defs>
                    <marker id="arrow-red-small" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.zwangEntstehtWennEine} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <ModuleFooter 
        wikipedia={[
          { title: 'Zwangspannung', url: 'https://de.wikipedia.org/wiki/Zwangspannung' },
          { title: 'Eigenspannung', url: 'https://de.wikipedia.org/wiki/Eigenspannung' },
          { title: 'Rissbildung' }
        ]}
        literatur={inhalt.daten["ZwangCalculator.literatur"]}
        regelwerke={inhalt.daten["ZwangCalculator.regelwerke"]}
        formeln={inhalt.daten["ZwangCalculator.formeln"]}
      />
</div>
  );
}
