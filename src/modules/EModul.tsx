import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Activity } from 'lucide-react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import inhalt from '@/content/emodul/EModul.json';
import { emodul } from '@/src/calc/emodul';
import { ALPHA_E } from '@/src/calc/betonkennwerte';
import { MdText } from '@/src/components/inhalt/MdText';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function EModul() {
  const [material, setMaterial] = useState('Beton');
  const [fck, setFck] = useState(30); // Für Beton
  const [alphaE, setAlphaE] = useState(1.0); // Gesteinsart-Beiwert nach EC2
  const [eModulGestein, setEModulGestein] = useState(60); // GPa
  const [volGestein, setVolGestein] = useState(70); // %
  const [eModulMatrix, setEModulMatrix] = useState(20); // GPa

  // Rechenkern src/calc/emodul.ts: E_cm nach EC2, Voigt/Reuss- und Hashin-Shtrikman-Schranken (ν = 0,2)
  const results = useMemo(() => {
    const r = emodul({ fck, alphaE, eGestein: eModulGestein, eMatrix: eModulMatrix, volGestein });
    return {
      ecm: r.ecm,
      eVoigt: r.voigt,
      eReuss: r.reuss,
      eHSMinus: r.hsUnten,
      eHSPlus: r.hsOben,
      chartLabels: r.kurve.map(k => k.vG),
      voigtData: r.kurve.map(k => k.voigt),
      reussData: r.kurve.map(k => k.reuss),
      hsMinusData: r.kurve.map(k => k.hsUnten),
      hsPlusData: r.kurve.map(k => k.hsOben),
    };
  }, [fck, alphaE, eModulGestein, volGestein, eModulMatrix]);

  const chartData = {
    labels: results.chartLabels,
    datasets: [
      {
        label: inhalt.werte.voigtObereSchranke,
        data: results.voigtData,
        borderColor: '#A3113E',
        borderDash: [5, 5],
        fill: false,
        tension: 0.1
      },
      {
        label: inhalt.werte.reussUntereSchranke,
        data: results.reussData,
        borderColor: '#475569',
        borderDash: [5, 5],
        fill: false,
        tension: 0.1
      },
      {
        label: inhalt.werte.hashinShtrikmanOben,
        data: results.hsPlusData,
        borderColor: '#64748b',
        fill: false,
        tension: 0.1
      },
      {
        label: inhalt.werte.hashinShtrikmanUnten,
        data: results.hsMinusData,
        borderColor: '#475569',
        fill: false,
        tension: 0.1
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Activity className="text-shiraz" /><MdText text={inhalt.texte.eModulMehrphasenmodelle} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.derElastizitätsmodulEModul} /></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.normativerEModulDin} /></h3>
              <Slider
                label={inhalt.werte.charaktDruckfestigkeitFck} info={inhalt.werte.charakteristischeZylinderdruckfestigkeit}
                value={fck}
                min={12}
                max={90}
                step={1}
                onChange={(e) => setFck(Number(e.target.value))}
                unit="MPa"
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-text-main mb-1"><MdText text={inhalt.texte.gesteinsartBeiwert} /><FormulaText text="\alpha_E" />)
                </label>
                <select aria-label={inhalt.werte.gesteinsartBeiwert}
                  value={alphaE}
                  onChange={(e) => setAlphaE(Number(e.target.value))}
                  className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  {/* α_E zentral aus src/calc/betonkennwerte.ts (DIN EN 1992-1-1, 3.1.3(2); Durchsicht D 29.10.2026, DSD-EM-1) */}
                  <option value={ALPHA_E.basalt}>Basalt (α_E = {formatDeZahl(ALPHA_E.basalt, 2)})</option>
                  <option value={ALPHA_E.quarzit}>Quarzit (α_E = {formatDeZahl(ALPHA_E.quarzit, 2)} – Bezugswert)</option>
                  <option value={ALPHA_E.kalkstein}>Kalkstein (α_E = {formatDeZahl(ALPHA_E.kalkstein, 2)})</option>
                  <option value={ALPHA_E.sandstein}>Sandstein (α_E = {formatDeZahl(ALPHA_E.sandstein, 2)})</option>
                </select>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg border border-home-grau/30">
                <div className="text-sm text-text-main/70"><MdText text={inhalt.texte.mittlererEModulE} /></div>
                <div className="text-2xl font-bold text-text-main">{formatDeZahl(results.ecm, 1)} GPa</div>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.mehrphasenmodelleMikromechanik} /></h3>
              <Slider
                label={inhalt.werte.eModulGesteinskörnungE} 
                value={eModulGestein}
                min={20}
                max={100}
                step={5}
                onChange={(e) => setEModulGestein(Number(e.target.value))}
                unit="GPa"
              />
              <Slider
                label={inhalt.werte.eModulZementsteinE} info={inhalt.werte.elastizitätsmodulDerZementsteinmatrix}
                value={eModulMatrix}
                min={5}
                max={40}
                step={1}
                onChange={(e) => setEModulMatrix(Number(e.target.value))}
                unit="GPa"
              />
              <Slider
                label={inhalt.werte.volumenanteilGesteinVG} 
                value={volGestein}
                min={0}
                max={100}
                step={1}
                onChange={(e) => setVolGestein(Number(e.target.value))}
                unit="%"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.ergebnisseDerModelle} /></h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30">
                  <div className="text-xs text-text-main/70 mb-1"><MdText text={inhalt.texte.voigtParallelschaltung} /></div>
                  <div className="text-lg font-bold text-shiraz">{formatDeZahl(results.eVoigt, 1)} GPa</div>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30">
                  <div className="text-xs text-text-main/70 mb-1"><MdText text={inhalt.texte.reussReihenschaltung} /></div>
                  <div className="text-lg font-bold text-blue-600">{formatDeZahl(results.eReuss, 1)} GPa</div>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30">
                  <div className="text-xs text-text-main/70 mb-1"><MdText text={inhalt.texte.hashinShtrikmanOben} /></div>
                  <div className="text-lg font-bold text-amber-500">{formatDeZahl(results.eHSPlus, 1)} GPa</div>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/30">
                  <div className="text-xs text-text-main/70 mb-1"><MdText text={inhalt.texte.hashinShtrikmanUnten} /></div>
                  <div className="text-lg font-bold text-emerald-500">{formatDeZahl(results.eHSMinus, 1)} GPa</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-text-main/80"><MdText text={inhalt.texte.beiNormalbetonGesteinSteifer} /></div>
            </div>

            {/* Live-Rechenweg (AP 3.7) mit den aktuellen Eingaben */}
            <FormulaDerivationBox
              live
              title={inhalt.werte.ihrRechenwegEModul}
              zielGleichung="E_{cm} = \alpha_E \cdot 22 \cdot (f_{cm}/10)^{0{,}3};\quad E_{\text{Voigt}} = v_G E_G + v_M E_M"
              schritte={[
                {
                  titel: inhalt.werte.mittlereDruckfestigkeit,
                  erklaerung: inhalt.werte.nachDinEn1992,
                  formel: `f_{cm} = f_{ck} + 8 = ${formatDeTeX(fck, 0)} + 8 = ${formatDeTeX(fck + 8, 0)}\\,\\text{MPa}`
                },
                {
                  titel: inhalt.werte.normativerEModul,
                  erklaerung: `Mit dem Gesteinsbeiwert α_E = ${formatDeZahl(alphaE, 2)} ergibt sich der Sekantenmodul:`,
                  formel: `E_{cm} = ${formatDeTeX(alphaE, 2)} \\cdot 22 \\cdot \\left(\\frac{${formatDeTeX(fck + 8, 0)}}{10}\\right)^{0{,}3} = ${formatDeTeX(results.ecm, 1)}\\,\\text{GPa}`
                },
                {
                  titel: 'Volumenanteile',
                  erklaerung: inhalt.werte.gesteinUndZementsteinFüllen,
                  formel: `v_G = ${formatDeTeX(volGestein / 100, 2)},\\quad v_M = 1 - v_G = ${formatDeTeX(1 - volGestein / 100, 2)}`
                },
                {
                  titel: inhalt.werte.obereSchrankeVoigtParallelschaltung,
                  erklaerung: inhalt.werte.beidePhasenErfahrenDieselbe,
                  formel: `E_{\\text{Voigt}} = ${formatDeTeX(volGestein / 100, 2)} \\cdot ${formatDeTeX(eModulGestein, 0)} + ${formatDeTeX(1 - volGestein / 100, 2)} \\cdot ${formatDeTeX(eModulMatrix, 0)} = ${formatDeTeX(results.eVoigt, 1)}\\,\\text{GPa}`
                },
                {
                  titel: inhalt.werte.untereSchrankeReussReihenschaltung,
                  erklaerung: inhalt.werte.beidePhasenErfahrenDieselbe2,
                  formel: `E_{\\text{Reuss}} = \\frac{1}{\\frac{${formatDeTeX(volGestein / 100, 2)}}{${formatDeTeX(eModulGestein, 0)}} + \\frac{${formatDeTeX(1 - volGestein / 100, 2)}}{${formatDeTeX(eModulMatrix, 0)}}} = ${formatDeTeX(results.eReuss, 1)}\\,\\text{GPa}`
                }
              ]}
              ergebnisHinweis={`Der tatsächliche E-Modul des Zweiphasenmaterials liegt zwischen ${formatDeZahl(results.eReuss, 1)} und ${formatDeZahl(results.eVoigt, 1)} GPa; die Hashin-Shtrikman-Schranken (${formatDeZahl(results.eHSMinus, 1)} bis ${formatDeZahl(results.eHSPlus, 1)} GPa) engen diesen Bereich ein.`}
              normQuelle={inhalt.werte.dinEn19921}
            />

            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.eModulInAbhängigkeit} /></h3>
              <div className="h-64">
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        title: { display: true, text: inhalt.werte.eModulGpa }
                      },
                      x: {
                        title: { display: true, text: inhalt.werte.volumenanteilGestein }
                      }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeModelle} /></h3>
              <div className="flex justify-between items-center h-40 bg-off-white rounded-lg border border-home-grau/30 p-4">
                
                {/* SVG Defs for Arrows */}
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                    </marker>
                    <marker id="arrow-red-start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                      <path d="M 10 0 L 0 5 L 10 10 z" fill="#A3113E" />
                    </marker>
                  </defs>
                </svg>

                {/* Voigt */}
                <div className="flex flex-col items-center w-1/3">
                  <div className="text-xs font-bold mb-2"><MdText text={inhalt.texte.voigtParallel} /></div>
                  <div className="text-[10px] text-text-main/70 mb-2">Dehnung <FormulaText text="\varepsilon" /> gleich</div>
                  <svg width="60" height="70" viewBox="0 0 60 70" className="overflow-visible">
                    <rect x="10" y="15" width="20" height="40" fill="#cbd5e1" stroke="#94a3b8" />
                    <rect x="30" y="15" width="20" height="40" fill="#94a3b8" stroke="#64748b" />
                    <path d="M 30 15 L 30 2" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                    <path d="M 30 55 L 30 68" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  </svg>
                </div>
                
                {/* Reuss */}
                <div className="flex flex-col items-center w-1/3 border-l border-r border-home-grau/30">
                  <div className="text-xs font-bold mb-2"><MdText text={inhalt.texte.reussReihe} /></div>
                  <div className="text-[10px] text-text-main/70 mb-2">Spannung <FormulaText text="\sigma" /> gleich</div>
                  <svg width="60" height="70" viewBox="0 0 60 70" className="overflow-visible">
                    <rect x="10" y="15" width="40" height="20" fill="#cbd5e1" stroke="#94a3b8" />
                    <rect x="10" y="35" width="40" height="20" fill="#94a3b8" stroke="#64748b" />
                    <path d="M 30 15 L 30 2" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                    <path d="M 30 55 L 30 68" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  </svg>
                </div>

                {/* Hashin-Shtrikman */}
                <div className="flex flex-col items-center w-1/3">
                  <div className="text-xs font-bold mb-2"><MdText text={inhalt.texte.hsEinschluss} /></div>
                  <div className="text-[10px] text-text-main/70 mb-2"><MdText text={inhalt.texte.exaktereSchranke} /></div>
                  <svg width="60" height="70" viewBox="0 0 60 70" className="overflow-visible">
                    <rect x="10" y="15" width="40" height="40" fill="#cbd5e1" stroke="#94a3b8" />
                    <circle cx="30" cy="35" r="12" fill="#94a3b8" stroke="#64748b" />
                    <path d="M 30 15 L 30 2" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                    <path d="M 30 55 L 30 68" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1EModul}
        zielGleichung="E_{cm} = \alpha_E \cdot 22 \cdot \left(\frac{f_{cm}}{10}\right)^{0{,}3}"
        schritte={inhalt.daten["EModul.schritte"]}
        ergebnisHinweis={inhalt.werte.beiSandstein30Wären}
        normQuelle={inhalt.werte.dinEn199212}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2SchrankenFür}
        zielGleichung="E_{Reuss} \le E \le E_{Voigt}"
        schritte={inhalt.daten["EModul.schritte_2"]}
        ergebnisHinweis={inhalt.werte.derWahreWertLiegt}
        normQuelle={inhalt.werte.mikromechanikVoigt1889Reuss}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="emodul" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap5}
        wikipedia={[
          { title: 'Elastizitätsmodul', url: 'https://de.wikipedia.org/wiki/Elastizit%C3%A4tsmodul' }
        ]}
        regelwerke={inhalt.daten["EModul.regelwerke"]}
        literatur={inhalt.daten["EModul.literatur"]}
        formeln={inhalt.daten["EModul.formeln"]}
      />
    </div>
  );
}
