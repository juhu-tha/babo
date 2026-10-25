import { Scale, Sliders, CheckCircle2, AlertTriangle } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert, formatDeTeX, formatDeTeXWert } from '@/src/utils/numberFormat';
import React from 'react';

interface RechnungHolzbauProps {
  A_wood: number;
  E_005: 7400 | 8000;
  colHeight: number;
  colLength: number;
  colWidth: number;
  designForce: number;
  f_c0d: number;
  f_c0k: 21 | 24;
  i_radius: number;
  k_c_final: number;
  k_factor_wood: number;
  lambda_rel: number;
  setColHeight: React.Dispatch<React.SetStateAction<number>>;
  setColLength: React.Dispatch<React.SetStateAction<number>>;
  setColWidth: React.Dispatch<React.SetStateAction<number>>;
  setDesignForce: React.Dispatch<React.SetStateAction<number>>;
  setTimberGrade: React.Dispatch<React.SetStateAction<"C24" | "C30">>;
  sigma_c0d: number;
  slenderness: number;
  timberGrade: "C24" | "C30";
  utilizationWood: number;
}

export default function RechnungHolzbau({ A_wood, E_005, colHeight, colLength, colWidth, designForce, f_c0d, f_c0k, i_radius, k_c_final, k_factor_wood, lambda_rel, setColHeight, setColLength, setColWidth, setDesignForce, setTimberGrade, sigma_c0d, slenderness, timberGrade, utilizationWood }: RechnungHolzbauProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Scale className="text-shiraz" size={18} />
            <span>Stabilitätsnachweis (Biegeknicken) einer pendelnd gelagerten Holzstütze</span>
          </h3>
          <p className="text-xs text-text-main/80 leading-relaxed font-normal">
            <strong>Was?</strong> Berechnet wird der Standsicherheitsnachweis einer druckbeanspruchten Holzstütze mit quadratischem/rechteckigem Querschnitt. <br />
            <strong>Warum?</strong> Schlanke Bauteile versagen unter zentrischer Druckkraft oft nicht durch direktes Brechen (Materialstauchung), sondern weichen schlagartig seitlich aus (instabiles Biegeknicken). <br />
            <strong>Wie?</strong> Mit dem Ersatzstabverfahren nach dem Abminderungsbeiwert <InlineMath math="k_c" /> gemäß <strong>Eurocode 5 (DIN EN 1995-1-1)</strong>.
          </p>
        </div>

        {/* INTERACTIVE CONTROLS */}
        <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
          <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Sliders size={14} className="text-shiraz" /> Abmessungen &amp; Einwirkungen
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Column Length */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block">Knicklänge <InlineMath math="s_k = L" /> (m):</label>
              <input aria-label="Knicklänge (m)" 
                type="range" min="1.5" max="6.0" step="0.5"
                value={colLength}
                onChange={(e) => setColLength(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeZahl(colLength, 1)} m</div>
            </div>

            {/* Section b x h */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block">Querschnitt <InlineMath math="b = h" /> (cm):</label>
              <input aria-label="Querschnitt (cm)" 
                type="range" min="8" max="24" step="2"
                value={colHeight}
                onChange={(e) => {
                  setColHeight(Number(e.target.value));
                  setColWidth(Number(e.target.value));
                }}
                className="w-full accent-shiraz"
              />
              <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeWert(colHeight)} x {formatDeWert(colHeight)} cm</div>
            </div>

            {/* Axial Force */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block">Normalkraft <InlineMath math="N_d" /> (kN):</label>
              <input aria-label="Normalkraft (kN)" 
                type="range" min="10" max="150" step="5"
                value={designForce}
                onChange={(e) => setDesignForce(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeWert(designForce)} kN</div>
            </div>

            {/* Timber Grade */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block">Holzart:</label>
              <select aria-label="Holzart" 
                value={timberGrade} 
                onChange={(e) => setTimberGrade(e.target.value as 'C24' | 'C30')}
                className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
              >
                <option value="C24">Nadelholz C24</option>
                <option value="C30">Nadelholz C30</option>
              </select>
            </div>

          </div>
        </div>

        {/* STEP-BY-STEP DETAILS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
            Knicknachweis nach Eurocode 5 Schritt für Schritt
          </h4>

          <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
            <div>
              <strong>Schritt 1: Festigkeiten bestimmen</strong>
              <p className="mt-1">
                Für die Holzgüte <span className="text-shiraz font-bold">{timberGrade}</span> beträgt der Festigkeitswert <InlineMath math={`f_{c,0,k} = ${f_c0k} \\, \\text{N/mm}^2`} />. <br />
                Für Nutzungsklasse 1 oder 2 und die Klasse der Lasteinwirkungsdauer (KLED) „kurz“ – angenommen ist, dass eine kurzzeitige Einwirkung (z. B. Schnee unter 1000 m ü. NN) die maßgebende Kombination bestimmt – gilt <InlineMath math="k_{mod} = 0{,}9" /> (DIN EN 1995-1-1, Tab. 3.1). Bei ständiger bzw. langer Lasteinwirkung wäre k_mod = 0,6 bzw. 0,7 anzusetzen. Der Bemessungswert lautet:
              </p>
              <BlockMath math={`f_{c,0,d} = k_{mod} \\cdot \\frac{f_{c,0,k}}{\\gamma_M} = 0{,}9 \\cdot \\frac{\\color{#A3113E}{${f_c0k}}}{1{,}3} = \\color{#A3113E}{${formatDeTeX(f_c0d, 2)}} \\, \\text{N/mm}^2`} />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 2: Geometrische Kennwerte &amp; Schlankheit ermitteln</strong>
              <p className="mt-1">Fläche <InlineMath math="A" /> und Trägheitsradius <InlineMath math="i" /> des quadratischen Querschnitts:</p>
              <BlockMath math={`A = b \\cdot h = \\color{#A3113E}{${colWidth}} \\cdot \\color{#A3113E}{${colHeight}} = \\color{#A3113E}{${formatDeTeXWert(A_wood)}} \\, \\text{cm}^2`} />
              <BlockMath math={`i = \\frac{h}{\\sqrt{12}} = \\frac{\\color{#A3113E}{${colHeight}}}{3{,}464} = \\color{#A3113E}{${formatDeTeX(i_radius, 2)}} \\, \\text{cm}`} />
              <p className="mt-1">Daraus folgt der dimensionslose Schlankheitsgrad <InlineMath math="\lambda" />:</p>
              <BlockMath math={`\\lambda = \\frac{s_k}{i} = \\frac{\\color{#A3113E}{${formatDeTeX((colLength * 100), 0)}} \\, \\text{cm}}{\\color{#A3113E}{${formatDeTeX(i_radius, 2)}} \\, \\text{cm}} = \\color{#A3113E}{${formatDeTeX(slenderness, 2)}}`} />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 3: Relativen Schlankheitsgrad berechnen</strong>
              <p className="mt-1">Mit dem E-Modul-Quantilswert <InlineMath math={`E_{0{,}05} = ${E_005} \\, \\text{N/mm}^2`} />:</p>
              <BlockMath math={`\\lambda_{rel} = \\frac{\\lambda}{\\pi} \\cdot \\sqrt{\\frac{f_{c,0,k}}{E_{0{,}05}}} = \\frac{\\color{#A3113E}{${formatDeTeX(slenderness, 2)}}}{\\pi} \\cdot \\sqrt{\\frac{\\color{#A3113E}{${f_c0k}}}{${E_005}}} = \\color{#A3113E}{${formatDeTeX(lambda_rel, 4)}}`} />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 4: Knickbeiwert k_c bestimmen</strong>
              <p className="mt-1">Mit dem Grad der Systemunvollkommenheit <InlineMath math="\beta_c = 0{,}2" /> für Vollholz:</p>
              <BlockMath math={`k = 0{,}5 \\cdot [1 + \\beta_c \\cdot (\\lambda_{rel} - 0{,}3) + \\lambda_{rel}^2]`} />
              <BlockMath math={`k = 0{,}5 \\cdot [1 + 0{,}2 \\cdot (\\color{#A3113E}{${formatDeTeX(lambda_rel, 4)}} - 0{,}3) + \\color{#A3113E}{${formatDeTeX(Math.pow(lambda_rel, 2), 4)}}] = \\color{#A3113E}{${formatDeTeX(k_factor_wood, 4)}}`} />
              <p className="mt-1">Daraus ergibt sich der Abminderungsbeiwert <InlineMath math="k_c" />:</p>
              <BlockMath math={`k_c = \\frac{1}{k + \\sqrt{k^2 - \\lambda_{rel}^2}} = \\frac{1}{\\color{#A3113E}{${formatDeTeX(k_factor_wood, 4)}} + \\sqrt{\\color{#A3113E}{${formatDeTeX(k_factor_wood, 4)}}^2 - \\color{#A3113E}{${formatDeTeX(lambda_rel, 4)}}^2}} = \\color{#A3113E}{${formatDeTeX(k_c_final, 4)}}`} />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <strong>Schritt 5: Spannungsnachweis durchführen</strong>
              <p className="mt-1">Einwirkende Druckspannung <InlineMath math="\sigma_{c,0,d}" />:</p>
              <BlockMath math={`\\sigma_{c,0,d} = \\frac{N_d \\cdot 10}{A} = \\frac{\\color{#A3113E}{${designForce}} \\cdot 10}{\\color{#A3113E}{${A_wood}}} = \\color{#A3113E}{${formatDeTeX(sigma_c0d, 3)}} \\, \\text{N/mm}^2`} />
              <p className="mt-1">Knicknachweis-Bedingung:</p>
              <BlockMath math={`\\eta = \\frac{\\sigma_{c,0,d}}{k_c \\cdot f_{c,0,d}} = \\frac{\\color{#A3113E}{${formatDeTeX(sigma_c0d, 3)}}}{\\color{#A3113E}{${formatDeTeX(k_c_final, 3)}} \\cdot \\color{#A3113E}{${formatDeTeX(f_c0d, 2)}}} = \\color{#A3113E}{${formatDeTeX(utilizationWood, 3)}} \\le 1{,}0`} />
            </div>
          </div>
        </div>

        {/* RESULTS EVALUATION */}
        <div className={`p-5 rounded-2xl border text-xs leading-relaxed flex flex-col md:flex-row gap-4 items-start md:items-center ${
              utilizationWood <= 1.0 
                ? 'bg-green-50 border-green-200 text-green-900' 
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
          <div className="p-3 rounded-xl bg-white border self-start md:self-center">
            {utilizationWood <= 1.0 ? (
              <CheckCircle2 className="text-green-600 animate-bounce" size={32} />
            ) : (
              <AlertTriangle className="text-red-600 animate-pulse" size={32} />
            )}
          </div>
          <div className="space-y-1 flex-1 font-normal">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm">Ausnutzungsgrad (Knicknachweis):</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-xxs tracking-wider uppercase ${
                    utilizationWood <= 1.0 ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                  }`}>
                {formatDeZahl((utilizationWood * 100), 0)}% Ausnutzung
              </span>
            </div>
            <p>
              Die Stütze ist zu <strong>{formatDeZahl((utilizationWood * 100), 1)}%</strong> ausgelastet.
            </p>
            <p className="text-xxs opacity-90 mt-1">
              {utilizationWood <= 1.0 
                ? 'Der Nachweis gegen Stabilitätsversagen im Grenzzustand der Tragfähigkeit (GZT) ist erfüllt. Die Stütze besitzt ausreichenden Widerstand gegen seitliches Ausknicken unter der vorgegebenen Einwirkung.'
                : 'Achtung! Die Tragfähigkeit ist überschritten. Erhöhen Sie den Holzquerschnitt (z.B. auf 16x16 cm) oder verringern Sie die Knicklänge der Stütze mittels konstruktiver Zwischenhalterungen.'}
            </p>
          </div>
        </div>
      </div>
    );
}
