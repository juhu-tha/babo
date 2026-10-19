import { formatDeZahl, formatDeTeX, formatDeTeXWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, AlertTriangle, CheckCircle2, Calculator, Shield, Activity, BarChart2 } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

export default function Sicherheitskonzept() {
  const [activeTab, setActiveTab ] = useState<'eurocodes' | 'prinzip' | 'lastermittlung'>('eurocodes');
  const [gk, setGk] = useState(10);
  const [qk1, setQk1] = useState(5);
  const [qk2, setQk2] = useState(3);
  const [psi0_1, setPsi0_1] = useState(0.7); // e.g. gathering areas
  const [psi0_2, setPsi0_2] = useState(0.6); // e.g. wind
  
  const [gammaG, setGammaG] = useState(1.35);
  const [gammaQ, setGammaQ] = useState(1.50);

  const ed = gammaG * gk + gammaQ * qk1 + gammaQ * psi0_2 * qk2;

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER CARD ACCORDING TO SPECS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ShieldAlert className="text-shiraz" /> Grundlagen der Tragwerksplanung (EC 0)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Das semiprobabilistische Sicherheitskonzept der Eurocodes stellt sicher, dass Tragwerke während ihrer geplanten Nutzungsdauer eine ausreichende Zuverlässigkeit aufweisen. Es basiert auf der Trennung von Einwirkungen (Lasten) und Widerständen (Tragfähigkeit) durch Teilsicherheitsbeiwerte sowie der Definition von Grenzzuständen.
          </p>
        </div>

        {/* Dynamic Nav-Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'eurocodes' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('eurocodes')}
          >
            <Shield size={16} /> Die Eurocodes (Übersicht)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'prinzip' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('prinzip')}
          >
            <Activity size={16} /> Prinzip &amp; Teilsicherheitsbeiwerte
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'lastermittlung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('lastermittlung')}
          >
            <Calculator size={16} /> Interaktive Lastermittlung (Gl. 6.10)
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'eurocodes' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Die Teile der Eurocodes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Eurocode 0 (DIN EN 1990)</h4>
              <p className="text-sm text-text-main/80">Grundlagen der Tragwerksplanung (Sicherheitskonzept, Grenzzustände)</p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Eurocode 1 (DIN EN 1991)</h4>
              <p className="text-sm text-text-main/80">Einwirkungen auf Tragwerke (Eigengewicht, Nutzlast, Schneelast, Windlast, etc.)</p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Eurocode 2 (DIN EN 1992)</h4>
              <p className="text-sm text-text-main/80">Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken</p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Eurocode 3 (DIN EN 1993)</h4>
              <p className="text-sm text-text-main/80">Bemessung und Konstruktion von Stahlbauten</p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Eurocode 4 (DIN EN 1994)</h4>
              <p className="text-sm text-text-main/80">Bemessung und Konstruktion von Verbundtragwerken aus Stahl und Beton</p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Eurocode 5 (DIN EN 1995)</h4>
              <p className="text-sm text-text-main/80">Bemessung und Konstruktion von Holzbauten</p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Eurocode 6 (DIN EN 1996)</h4>
              <p className="text-sm text-text-main/80">Bemessung und Konstruktion von Mauerwerksbauten</p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Eurocode 7 (DIN EN 1997)</h4>
              <p className="text-sm text-text-main/80">Entwurf, Berechnung und Bemessung in der Geotechnik (Bodenmechanik, Grundbau)</p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Eurocode 8 (DIN EN 1998)</h4>
              <p className="text-sm text-text-main/80">Auslegung von Bauwerken gegen Erdbeben</p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Eurocode 9 (DIN EN 1999)</h4>
              <p className="text-sm text-text-main/80">Bemessung und Konstruktion von Aluminiumtragwerken</p>
            </div>
          </div>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col gap-2">
            <p><strong>Geltende Fassung in Deutschland:</strong> DIN EN 1990:2010-12 mit Nationalem Anhang DIN EN 1990/NA:2010-12 und Änderung /NA/A1:2012-08. Jeder Eurocode-Teil gilt nur zusammen mit seinem Nationalen Anhang (NA), der die national festzulegenden Parameter (NDP) – etwa Teilsicherheits- und Kombinationsbeiwerte – bestimmt. Bauaufsichtlich verbindlich werden die Normen über die Verwaltungsvorschrift Technische Baubestimmungen (MVV TB / VV TB der Länder).</p>
            <p><strong>Zweite Eurocode-Generation:</strong> CEN hat die überarbeiteten Eurocodes (u. a. EN 1990:2023, EN 1992-1-1:2023) veröffentlicht; die ersten deutschen Fassungen sind erschienen (z. B. DIN EN 1993-1-1:2025-04, DIN EN 1992-1-1:2025-09). Bauaufsichtlich anwendbar werden sie erst mit Nationalem Anhang und Einführung in die MVV TB bzw. VV TB der Länder – bis dahin bleiben die oben genannten Fassungen maßgebend. Neu hinzu kommen Regeln für Glas (CEN/TS 19100) und Faserverbundkunststoffe (CEN/TS 19101).</p>
          </div>
        </div>
      )}

      {activeTab === 'prinzip' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-lg font-bold text-text-main mb-4 border-b border-home-grau/30 pb-2">Sicherheitskonzept (EC 0)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Einwirkungen (E) */}
              <div className="bg-white p-6 rounded-xl border-t-4 border-t-red-500 border-x border-b border-home-grau/25 shadow-xs">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2 text-red-700">
                  <AlertTriangle size={20} /> Einwirkungen (E)
                </h3>
                <p className="text-sm text-red-800/90 mb-4">
                  Kräfte oder Verformungen, die auf das Tragwerk einwirken (z.B. Eigengewicht, Nutzlast, Wind).
                </p>
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded border border-red-100">
                    <div className="font-semibold text-red-900 text-sm mb-1">Charakteristischer Wert (<FormulaText text="E_k" />)</div>
                    <div className="text-xs text-red-850">
                      Ständige Einwirkungen: in der Regel Mittelwert (z. B. Eigengewicht aus Wichte × Volumen). Veränderliche Einwirkungen: Wert mit 2 % Überschreitungswahrscheinlichkeit je Jahr (≈ 50 Jahre Wiederkehrperiode, z. B. Schnee, Wind).
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="text-red-300 rotate-90 md:rotate-0" />
                  </div>
                  <div className="bg-white p-3 rounded border border-red-200 shadow-sm">
                    <div className="font-semibold text-red-900 text-sm mb-1">Bemessungswert (<FormulaText text="E_d" />)</div>
                    <div className="text-xs text-red-850 mb-2">
                      <FormulaText text="F_d = \gamma_F \cdot \psi \cdot F_k" /> (vereinfacht; Teilsicherheitsbeiwert <FormulaText text="\gamma_F" />, bei Begleiteinwirkungen Kombinationsbeiwert <FormulaText text="\psi" />)
                    </div>
                  </div>
                </div>
              </div>

              {/* Widerstand (R) */}
              <div className="bg-white p-6 rounded-xl border-t-4 border-t-emerald-500 border-x border-b border-home-grau/25 shadow-xs">
                <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 size={20} /> Widerstand (R)
                </h3>
                <p className="text-sm text-green-800/90 mb-4">
                  Fähigkeit des Bauteils, den Einwirkungen standzuhalten (Materialfestigkeit, Querschnitt).
                </p>
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded border border-green-100">
                    <div className="font-semibold text-green-900 text-sm mb-1">Charakteristischer Wert (<FormulaText text="R_k" />)</div>
                    <div className="text-xs text-green-850">
                      5%-Fraktilwert der Grundgesamtheit der Festigkeit (z.B. <FormulaText text="f_{ck}" />).
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="text-green-300 rotate-90 md:rotate-0" />
                  </div>
                  <div className="bg-white p-3 rounded border border-green-200 shadow-sm">
                    <div className="font-semibold text-green-900 text-sm mb-1">Bemessungswert (<FormulaText text="R_d" />)</div>
                    <div className="text-xs text-green-850 mb-2">
                      <FormulaText text="R_d = R_k / \gamma_M" /> (Teilsicherheitsbeiwert <FormulaText text="\gamma_M" /> für Material- und Modellunsicherheiten)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fcf8f2] p-6 rounded-2xl shadow-sm border border-home-grau/30 text-center">
            <h3 className="text-lg font-bold text-shiraz mb-2">Fundamentale Nachweisbedingung</h3>
            <p className="text-sm text-text-main/80 mb-4">
              Der Bemessungswert der Einwirkungen muss stets kleiner oder gleich dem Bemessungswert des Widerstands sein.
            </p>
            <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-sm border border-shiraz/30 font-mono text-xl text-shiraz">
              <FormulaText text="E_d \le R_d" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 overflow-x-auto">
            <h3 className="text-lg font-bold text-text-main mb-4 border-b border-home-grau/30 pb-2">Teilsicherheitsbeiwerte im Überblick (ständige und vorübergehende Bemessungssituation, Deutschland)</h3>
            <table className="w-full text-sm text-left min-w-[560px]">
              <thead className="bg-home-grau/10 text-text-main">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Seite</th>
                  <th className="px-4 py-2">Größe</th>
                  <th className="px-4 py-2">Beiwert</th>
                  <th className="px-4 py-2 rounded-tr-lg">Regelwerk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20">
                <tr className="hover:bg-home-grau/5"><td className="px-4 py-2 font-bold">Einwirkung</td><td className="px-4 py-2">ständig, ungünstig / günstig</td><td className="px-4 py-2"><FormulaText text="\gamma_G = 1{,}35 \;/\; 1{,}00" /></td><td className="px-4 py-2">DIN EN 1990/NA, Tab. NA.A.1.2(B)</td></tr>
                <tr className="hover:bg-home-grau/5"><td className="px-4 py-2 font-bold">Einwirkung</td><td className="px-4 py-2">veränderlich, ungünstig / günstig</td><td className="px-4 py-2"><FormulaText text="\gamma_Q = 1{,}50 \;/\; 0" /></td><td className="px-4 py-2">DIN EN 1990/NA, Tab. NA.A.1.2(B)</td></tr>
                <tr className="hover:bg-home-grau/5"><td className="px-4 py-2 font-bold">Widerstand</td><td className="px-4 py-2">Beton / Betonstahl</td><td className="px-4 py-2"><FormulaText text="\gamma_C = 1{,}50 \;/\; \gamma_S = 1{,}15" /></td><td className="px-4 py-2">DIN EN 1992-1-1/NA, Tab. 2.1DE</td></tr>
                <tr className="hover:bg-home-grau/5"><td className="px-4 py-2 font-bold">Widerstand</td><td className="px-4 py-2">Baustahl (Querschnitt)</td><td className="px-4 py-2"><FormulaText text="\gamma_{M0} = 1{,}00" /></td><td className="px-4 py-2">DIN EN 1993-1-1/NA</td></tr>
                <tr className="hover:bg-home-grau/5"><td className="px-4 py-2 font-bold">Widerstand</td><td className="px-4 py-2">Vollholz, Brettschichtholz</td><td className="px-4 py-2"><FormulaText text="\gamma_M = 1{,}30" /></td><td className="px-4 py-2">DIN EN 1995-1-1/NA</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-text-main/70 mt-3">Kombinationsbeiwerte <FormulaText text="\psi_0" /> nach DIN EN 1990/NA, Tab. NA.A.1.1: Nutzlasten Kategorie A–D 0,7, Lagerflächen (E) 1,0; Schnee bis NN + 1000 m 0,5, darüber 0,7; Wind 0,6; Temperatur (nicht Brand) 0,6.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="border border-home-grau/25 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-text-main mb-2">Grenzzustände (Limit States)</h4>
              <ul className="text-xs text-text-main/80 space-y-2 list-disc pl-4">
                <li><strong>Tragfähigkeit (ULS):</strong> EQU (Lagesicherheit), STR (Bauteilversagen), GEO (Bodenversagen), FAT (Ermüdung); in der Geotechnik zusätzlich UPL (Aufschwimmen) und HYD (hydraulischer Grundbruch). Versagen führt zum Einsturz oder gefährdet Personen.</li>
                <li><strong>Gebrauchstauglichkeit (SLS):</strong> Begrenzung von Verformungen, Rissbreiten und Schwingungen. Versagen beeinträchtigt die normale Nutzung oder Ästhetik.</li>
              </ul>
            </div>
            <div className="border border-home-grau/25 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-text-main mb-2">Bemessungssituationen</h4>
              <ul className="text-xs text-text-main/80 space-y-2 list-disc pl-4">
                <li><strong>Ständig:</strong> Normaler Nutzungszustand über die geplante Nutzungsdauer (Hochbau: 50 Jahre, Brücken und Ingenieurbauwerke: 100 Jahre).</li>
                <li><strong>Vorübergehend:</strong> Befristete Umstände (z.B. Bauzustände, Montage, Umbau).</li>
                <li><strong>Außergewöhnlich:</strong> Seltene Gefährdungsbedingungen (z.B. Brand, Anprall, Explosion).</li>
                <li><strong>Erdbeben:</strong> Seismische Extrembeanspruchung.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lastermittlung' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Interaktive Lastermittlung (Gl. 6.10, ULS STR/GEO)</h3>
          <p className="text-sm text-text-main/80 mb-2">
            Berechnung des Bemessungswertes der Einwirkungen <FormulaText text="E_d" /> für eine ständige Situation nach der Grundkombination (ohne <FormulaText text="K_{FI}" />). Die Leit-Einwirkung wird voll angesetzt (<FormulaText text="\gamma_Q \cdot Q_{k,1}" />), weitere veränderliche Einwirkungen werden mit <FormulaText text="\psi_0" /> abgemindert.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Slider
                label="Ständige Einwirkung (G_k)" min={0} max={50} step={1}
                value={gk} unit=" kN"
                onChange={(e) => setGk(Number(e.target.value))}
              />
              <Slider
                label="Veränderliche Leit-Einw. (Q_k,1)" min={0} max={50} step={1}
                value={qk1} unit=" kN"
                onChange={(e) => setQk1(Number(e.target.value))}
              />
              <Slider
                label="Weitere veränderliche Einw. (Q_k,2)" min={0} max={50} step={1}
                value={qk2} unit=" kN"
                onChange={(e) => setQk2(Number(e.target.value))}
              />
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-xs font-bold text-text-main">γ_G (ständige Einwirkung)</label>
                  <select 
                    className="p-2 border border-home-grau rounded-md bg-off-white text-sm focus:outline-none focus:border-shiraz"
                    value={gammaG}
                    onChange={(e) => setGammaG(Number(e.target.value))}
                  >
                    <option value={1.35}>1,35 (ungünstig wirkend)</option>
                    <option value={1.0}>1,00 (günstig wirkend, z. B. gegen Abheben)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-xs font-bold text-text-main">ψ₀ Beiwert (für Q_k,2)</label>
                  <select 
                    className="p-2 border border-home-grau rounded-md bg-off-white text-sm focus:outline-none focus:border-shiraz"
                    value={psi0_2}
                    onChange={(e) => setPsi0_2(Number(e.target.value))}
                  >
                    <option value={0.7}>0,7 (Nutzlast Kat. A–D; Schnee über NN + 1000 m)</option>
                    <option value={0.6}>0,6 (Wind; Temperatur)</option>
                    <option value={0.5}>0,5 (Schnee bis NN + 1000 m)</option>
                    <option value={1.0}>1,0 (Nutzlast Kat. E – Lagerflächen)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-off-white border border-home-grau/50 rounded-xl p-6">
              <h4 className="font-bold text-text-main mb-4 flex items-center gap-2">
                <Calculator size={18} /> Berechnung <FormulaText text="E_d" />
              </h4>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-text-main/70">Ständig: <FormulaText text={`\\gamma_G \\cdot G_k = ${formatDeTeX(gammaG, 2)} \\cdot ${formatDeTeXWert(gk)}`} /></span>
                  <span>{formatDeZahl((gammaG * gk), 2)} kN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/70">Leit-Einw: <FormulaText text={`\\gamma_Q \\cdot Q_{k,1} = ${formatDeTeX(gammaQ, 2)} \\cdot ${formatDeTeXWert(qk1)}`} /></span>
                  <span>{formatDeZahl((gammaQ * qk1), 2)} kN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/70">Weitere: <FormulaText text={`\\gamma_Q \\cdot \\psi_0 \\cdot Q_{k,2} = ${formatDeTeX(gammaQ, 2)} \\cdot ${formatDeTeXWert(psi0_2)} \\cdot ${formatDeTeXWert(qk2)}`} /></span>
                  <span>{formatDeZahl((gammaQ * psi0_2 * qk2), 2)} kN</span>
                </div>
                <hr className="border-home-grau/50" />
                <div className="flex justify-between text-shiraz font-bold text-lg pt-2">
                  <span><FormulaText text="E_d" /> =</span>
                  <span>{formatDeZahl(ed, 2)} kN</span>
                </div>
              </div>
              
              <div className="mt-6 bg-white p-3 rounded-lg border border-home-grau/25">
                <div className="text-[10px] text-text-main/70 mb-1">Gleichung 6.10:</div>
                <div className="text-xs font-mono overflow-x-auto text-center p-2 text-shiraz leading-normal">
                  <FormulaText text="E_d = \sum_{j \ge 1} \gamma_{G,j} G_{k,j} + \gamma_{Q,1} Q_{k,1} + \sum_{i > 1} \gamma_{Q,i} \psi_{0,i} Q_{k,i}" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANWENDUNG (Stufe 3 des Lehrpfads) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Anwendung: Vollständiger Nachweis E_d ≤ R_d</h3>
        <FormulaDerivationBox
          title="Beispiel 1: Innenstütze im Bürogebäude (Druck, ungünstige Einwirkungen)"
          zielGleichung="N_{Ed} \le N_{Rd}"
          schritte={[
            { titel: 'Einwirkungen', erklaerung: 'Charakteristische Normalkräfte aus Eigengewicht G_k = 800 kN und Nutzlast Büro (Kategorie B) Q_k = 300 kN; die Nutzlast ist Leiteinwirkung.', formel: 'G_k = 800\,\text{kN},\quad Q_{k,1} = 300\,\text{kN}' },
            { titel: 'Bemessungswert der Einwirkung (Gl. 6.10)', erklaerung: 'Beide Einwirkungen wirken ungünstig:', formel: 'N_{Ed} = 1{,}35 \cdot 800 + 1{,}50 \cdot 300 = 1080 + 450 = 1530\,\text{kN}' },
            { titel: 'Widerstand (vereinfacht, nur Beton)', erklaerung: 'Stütze 35 × 35 cm aus C30/37; Bemessungswert der Betondruckfestigkeit nach DIN EN 1992-1-1/NA mit α_cc = 0,85 und γ_C = 1,5:', formel: 'f_{cd} = \frac{0{,}85 \cdot 30}{1{,}5} = 17{,}0\,\tfrac{\text{N}}{\text{mm}^2},\quad N_{Rd} = 350^2 \cdot 17{,}0 = 2\,082\,500\,\text{N} \approx 2083\,\text{kN}' },
            { titel: 'Nachweis', erklaerung: 'Ausnutzungsgrad η = N_Ed / N_Rd:', formel: '\eta = \frac{1530}{2083} = 0{,}73 \le 1{,}0 \quad \checkmark' }
          ]}
          ergebnisHinweis="Vereinfachtes Lehrbeispiel ohne Bewehrung, Mindestausmitte und Knicken – für einen vollständigen Stützennachweis siehe Modul Stahlbeton."
          normQuelle="DIN EN 1990/NA (Gl. 6.10), DIN EN 1992-1-1/NA (3.1.6, Tab. 2.1DE)"
        />
        <FormulaDerivationBox
          title="Beispiel 2: Leichtdach unter Windsog – wann das Eigengewicht günstig wirkt"
          zielGleichung="E_d = \gamma_{G,inf} \cdot G_k + \gamma_Q \cdot W_k"
          schritte={[
            { titel: 'Einwirkungen', erklaerung: 'Trapezblechdach: Eigengewicht g_k = 0,30 kN/m² (nach unten), Windsog w_k = −1,20 kN/m² (nach oben).', formel: 'g_k = +0{,}30\,\tfrac{\text{kN}}{\text{m}^2},\quad w_k = -1{,}20\,\tfrac{\text{kN}}{\text{m}^2}' },
            { titel: 'Falsch: γ_G = 1,35', erklaerung: 'Mit dem ungünstigen Beiwert würde das Eigengewicht die Abhebekraft künstlich verkleinern – das liegt auf der unsicheren Seite.', formel: '1{,}35 \cdot 0{,}30 - 1{,}50 \cdot 1{,}20 = -1{,}40\,\tfrac{\text{kN}}{\text{m}^2}' },
            { titel: 'Richtig: γ_G,inf = 1,00', erklaerung: 'Das Eigengewicht wirkt der maßgebenden Einwirkung entgegen, also günstig:', formel: 'e_d = 1{,}00 \cdot 0{,}30 - 1{,}50 \cdot 1{,}20 = -1{,}50\,\tfrac{\text{kN}}{\text{m}^2}' }
          ]}
          ergebnisHinweis="Die Befestigung muss 1,50 kN/m² Abhebekraft aufnehmen. Stellen Sie im Rechner oben γ_G = 1,00 ein, um den Effekt nachzuvollziehen."
          normQuelle="DIN EN 1990/NA, Tab. NA.A.1.2(B); DIN EN 1991-1-4 (Wind)"
        />
      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="sicherheitskonzept" />

      {/* FOOTER */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Eurocode', url: 'https://de.wikipedia.org/wiki/Eurocode' },
          { title: 'Teilsicherheitskonzept', url: 'https://de.wikipedia.org/wiki/Teilsicherheitskonzept' },
          { title: 'Grenzzustand', url: 'https://de.wikipedia.org/wiki/Grenzzustand' }
        ]}
        literatur={[
          'Zilch, K.; Zehetmaier, G.: Bemessung im konstruktiven Betonbau. 2. Aufl., Berlin: Springer 2010',
          'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024'
        ]}
        regelwerke={[
          { title: 'DIN EN 1990:2010-12 (Eurocode 0: Grundlagen der Tragwerksplanung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1990' },
          { title: 'DIN EN 1990/NA:2010-12 und DIN EN 1990/NA/A1:2012-08 (Nationaler Anhang)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1990%2FNA' },
          { title: 'DIN EN 1991 (Eurocode 1: Einwirkungen auf Tragwerke) mit Nationalen Anhängen', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1991' }
        ]}
        formeln={[
          {
            formel: 'E_d \\le R_d \\quad \\text{z. B.} \\quad \\gamma_G \\cdot G_k + \\gamma_Q \\cdot Q_k \\le \\frac{R_k}{\\gamma_M}',
            erklaerung: 'Grundlegende Bemessungsbedingung im Grenzzustand der Tragfähigkeit (GZT / ULS) nach dem semi-probabilistischen Teilsicherheitskonzept des Eurocode 0.',
            quelle: 'DIN EN 1990, Gl. (6.8)'
          },
          {
            formel: 'E_d = \\sum_{j \\ge 1} \\gamma_{G,j} G_{k,j} + \\gamma_{Q,1} Q_{k,1} + \\sum_{i > 1} \\gamma_{Q,i} \\psi_{0,i} Q_{k,i}',
            erklaerung: 'Kombinationsregel nach Gl. (6.10) für ständige und veränderliche Einwirkungen mit Leiteinwirkung Q_k,1 und Kombinationsbeiwert psi_0.',
            quelle: 'DIN EN 1990, Gl. (6.10)'
          }
        ]}
        lastReviewed="Oktober 2026 (AP 3 Grundlagen: DIN EN 1990/NA Tab. NA.A.1.1 und NA.A.1.2(B) geprüft; fachliche Freigabe durch den Autor ausstehend)"
      />
    </div>
  );
}
