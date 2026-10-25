import { Settings, Sliders, CheckCircle2, AlertTriangle } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import React from 'react';

interface RechnungMauerwerkProps {
  f_d: number;
  f_k: 5.6 | 3.2;
  masonryType: "KS" | "HLZ";
  n_Rd: number;
  phi_final: number;
  setMasonryType: React.Dispatch<React.SetStateAction<"KS" | "HLZ">>;
  setVerticalLoad: React.Dispatch<React.SetStateAction<number>>;
  setWallHeight: React.Dispatch<React.SetStateAction<number>>;
  setWallThick: React.Dispatch<React.SetStateAction<number>>;
  slenderness_mauer: number;
  t_m: number;
  utilizationMauer: number;
  verticalLoad: number;
  wallHeight: number;
  wallThick: number;
}

export default function RechnungMauerwerk({ f_d, f_k, masonryType, n_Rd, phi_final, setMasonryType, setVerticalLoad, setWallHeight, setWallThick, slenderness_mauer, t_m, utilizationMauer, verticalLoad, wallHeight, wallThick }: RechnungMauerwerkProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Settings className="text-shiraz" size={18} />
            <span>Tragfähigkeitsnachweis einer unbewehrten Mauerwerkswand unter Vertikallast</span>
          </h3>
          <p className="text-xs text-text-main/80 leading-relaxed font-normal">
            <strong>Was?</strong> Berechnet wird die maximale aufnehmbare Vertikalkraft <InlineMath math="N_{Rd}" /> in <InlineMath math="\text{kN/m}" /> einer tragenden Innen- oder Außenwand. <br />
            <strong>Warum?</strong> Mauerwerk besitzt durch das Fugenbild und Steinmaterial ein ausgeprägtes anisotropes Tragverhalten und reagiert hochsensibel auf außermittige Lasteintragungen sowie Knickgefahren. <br />
            <strong>Wie?</strong> Mit dem vereinfachten Nachweisverfahren nach <strong>Eurocode 6 (DIN EN 1996-3)</strong>.
          </p>
        </div>

        {/* INTERACTIVE CONTROLS */}
        <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
          <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Sliders size={14} className="text-shiraz" /> Wandparameter einstellen
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Wall Height */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block">Wandhöhe <InlineMath math="h" /> (m):</label>
              <input aria-label="Wandhöhe (m)" 
                type="range" min="2.50" max="3.50" step="0.25"
                value={wallHeight}
                onChange={(e) => setWallHeight(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeZahl(wallHeight, 2)} m</div>
            </div>

            {/* Wall Thickness */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block">Dicke <InlineMath math="t" /> (cm):</label>
              <select aria-label="Dicke (cm)" 
                value={wallThick} 
                onChange={(e) => setWallThick(Number(e.target.value))}
                className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
              >
                <option value={11.5}>11,5 cm</option>
                <option value={17.5}>17,5 cm</option>
                <option value={24.0}>24,0 cm</option>
                <option value={30.0}>30,0 cm</option>
              </select>
            </div>

            {/* Vertical Load */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block">Druckkraft <InlineMath math="N_{Ed}" /> (kN/m):</label>
              <input aria-label="Druckkraft (kN/m)" 
                type="range" min="30" max="250" step="10"
                value={verticalLoad}
                onChange={(e) => setVerticalLoad(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeWert(verticalLoad)} kN/m</div>
            </div>

            {/* Masonry Compressive strength */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block">Steinfestigkeit / Art:</label>
              <select aria-label="Steinfestigkeit / Art" 
                value={masonryType} 
                onChange={(e) => setMasonryType(e.target.value as 'KS' | 'HLZ')}
                className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
              >
                <option value="KS">Kalksandstein (f_k = 5,6 MPa)</option>
                <option value="HLZ">Hochlochziegel (f_k = 3,2 MPa)</option>
              </select>
            </div>

          </div>
        </div>

        {/* STEP-BY-STEP CALCULATION */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
            Vereinfachter Tragfähigkeitsnachweis (Eurocode 6) Schritt für Schritt
          </h4>

          <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
            <div>
              <strong>Schritt 1: Rechnerische Mauerwerksfestigkeit f_d</strong>
              <p className="mt-1">
                Der Bemessungswert der Druckfestigkeit <InlineMath math="f_d" /> berechnet sich aus der charakteristischen Festigkeit <InlineMath math="f_k" /> und dem materialspezifischen Sicherheitsbeiwert <InlineMath math="\gamma_M = 1{,}5" /> (unter vereinfachten Verfahren):
              </p>
              <BlockMath math={`f_d = \\frac{f_k}{\\gamma_M} = \\frac{\\color{#A3113E}{${formatDeTeX(f_k, 1)}}}{1{,}5} = \\color{#A3113E}{${formatDeTeX(f_d, 2)}} \\, \\text{N/mm}^2 \\, (\\text{MPa})`} />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 2: Wirksame Schlankheit bestimmen</strong>
              <p className="mt-1">
                Bei zweiseitiger Halterung am Wandkopf und Wandfuß durch ausreichend steife Deckenplatten entspricht die effektive Knicklänge der lichten Wandhöhe <InlineMath math="h_{ef} = h" />:
              </p>
              <BlockMath math={`\\bar{\\lambda} = \\frac{h_{ef}}{t} = \\frac{\\color{#A3113E}{${formatDeTeX(wallHeight, 2)}} \\, \\text{m}}{\\color{#A3113E}{${formatDeTeX(t_m, 3)}} \\, \\text{m}} = \\color{#A3113E}{${formatDeTeX(slenderness_mauer, 2)}}`} />
              <p className="mt-1">
                Nach DIN EN 1996-3 darf die Slenderness bei tragenden Wänden im vereinfachten Verfahren den Grenzwert <strong>25</strong> nicht überschreiten. <br />
                Die Schlankheit beträgt: <strong className="text-shiraz">{formatDeZahl(slenderness_mauer, 2)}</strong>. 
                {slenderness_mauer > 25 ? (
                  <span className="text-red-600 font-bold block mt-1">Achtung: Wand ist zu schlank! Erhöhen Sie die Dicke t.</span>
                ) : (
                  <span className="text-green-600 block mt-1">Grenzbedingung erfüllt (Slenderness ≤ 25).</span>
                )}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 3: Abminderungsfaktor \Phi bestimmen</strong>
              <p className="mt-1">
                Der Abminderungsfaktor <InlineMath math="\Phi" /> berücksichtigt Tragfähigkeitseinbußen durch Exzentrizitäten und Verformungen in Wandmitte nach dem vereinfachten Verfahren:
              </p>
              <BlockMath math={`\\Phi = 0{,}85 - 0{,}0011 \\cdot \\left(\\frac{h_{ef}}{t}\\right)^2`} />
              <BlockMath math={`\\Phi = 0{,}85 - 0{,}0011 \\cdot (\\color{#A3113E}{${formatDeTeX(slenderness_mauer, 2)}})^2 = \\color{#A3113E}{${formatDeTeX(phi_final, 4)}}`} />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 4: Vertikaler Traglastwiderstand N_Rd</strong>
              <p className="mt-1">
                Der Bemessungswert der aufnehmbaren Vertikallast pro Meter Wandlänge ergibt sich aus:
              </p>
              <BlockMath math={`N_{Rd} = \\Phi \\cdot t \\cdot f_d`} />
              <BlockMath math={`N_{Rd} = \\color{#A3113E}{${formatDeTeX(phi_final, 3)}} \\cdot \\color{#A3113E}{${formatDeTeX(t_m, 3)}} \\, \\text{m} \\cdot \\color{#A3113E}{${formatDeTeX(f_d, 2)}} \\, \\text{MN/m}^2 \\cdot 1000 = \\color{#A3113E}{${formatDeTeX(n_Rd, 1)}} \\, \\text{kN/m}`} />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 5: Auslastungsvergleich</strong>
              <BlockMath math={`\\eta = \\frac{N_{Ed}}{N_{Rd}} = \\frac{\\color{#A3113E}{${verticalLoad}} \\, \\text{kN/m}}{\\color{#A3113E}{${formatDeTeX(n_Rd, 1)}} \\, \\text{kN/m}} = \\color{#A3113E}{${formatDeTeX(utilizationMauer, 3)}} \\le 1{,}0`} />
            </div>
          </div>
        </div>

        {/* RESULTS EVALUATION */}
        <div className={`p-5 rounded-2xl border text-xs leading-relaxed flex flex-col md:flex-row gap-4 items-start md:items-center ${
              utilizationMauer <= 1.0 && slenderness_mauer <= 25
                ? 'bg-green-50 border-green-200 text-green-900' 
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
          <div className="p-3 rounded-xl bg-white border self-start md:self-center">
            {utilizationMauer <= 1.0 && slenderness_mauer <= 25 ? (
              <CheckCircle2 className="text-green-600 animate-bounce" size={32} />
            ) : (
              <AlertTriangle className="text-red-600 animate-pulse" size={32} />
            )}
          </div>
          <div className="space-y-1 flex-1 font-normal">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm">Ausnutzungsgrad (Eurocode 6):</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-xxs tracking-wider uppercase ${
                    utilizationMauer <= 1.0 && slenderness_mauer <= 25 ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                  }`}>
                {utilizationMauer <= 1.0 && slenderness_mauer <= 25 ? 'Bestanden' : 'Nicht erfüllt'}
              </span>
            </div>
            <p>
              Die Mauerwerkswand ist zu <strong>{formatDeZahl((utilizationMauer * 100), 1)}%</strong> ausgelastet.
            </p>
            <p className="text-xxs opacity-90 mt-1">
              {utilizationMauer <= 1.0 && slenderness_mauer <= 25
                ? 'Der Standsicherheitsnachweis für unbewehrtes Mauerwerk unter vertikalen Lasten ist erfolgreich erfüllt. Die Wandstärke reicht aus, um Knickerscheinungen und Quetschversagen zu verhindern.'
                : 'Die Wand ist überlastet oder überschreitet die zulässige Grenzschlankheit. Erhöhen Sie die Wandstärke t oder wechseln Sie zu einem Steinmaterial mit höherer Steinfestigkeitsklasse (z.B. Kalksandstein).'}
            </p>
          </div>
        </div>
      </div>
    );
}
