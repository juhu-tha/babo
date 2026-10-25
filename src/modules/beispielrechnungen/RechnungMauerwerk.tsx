import { Settings, Sliders, CheckCircle2, AlertTriangle } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import React from 'react';
import inhalt from '@/content/beispielrechnungen/RechnungMauerwerk.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
            <span><MdText text={inhalt.texte.tragfähigkeitsnachweisEinerUnbewehrtenMa} /></span>
          </h3>
          <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.wasBerechnetWirdDie} /></p>
        </div>

        {/* INTERACTIVE CONTROLS */}
        <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
          <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Sliders size={14} className="text-shiraz" /><MdText text={inhalt.texte.wandparameterEinstellen} /></h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Wall Height */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.wandhöheHM} /></label>
              <input aria-label={inhalt.werte.wandhöheM} 
                type="range" min="2.50" max="3.50" step="0.25"
                value={wallHeight}
                onChange={(e) => setWallHeight(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeZahl(wallHeight, 2)} m</div>
            </div>

            {/* Wall Thickness */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.dickeTCm} /></label>
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
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.druckkraftNEdKn} /></label>
              <input aria-label={inhalt.werte.druckkraftKnM} 
                type="range" min="30" max="250" step="10"
                value={verticalLoad}
                onChange={(e) => setVerticalLoad(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeWert(verticalLoad)} kN/m</div>
            </div>

            {/* Masonry Compressive strength */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.steinfestigkeitArt} /></label>
              <select aria-label={inhalt.werte.steinfestigkeitArt} 
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
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.vereinfachterTragfähigkeitsnachweisEuroc} /></h4>

          <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
            <div><MdText text={inhalt.texte.schritt1RechnerischeMauerwerksfestigkeit} /><p className="mt-1"><MdText text={inhalt.texte.derBemessungswertDerDruckfestigkeit} /></p>
              <BlockMath math={`f_d = \\frac{f_k}{\\gamma_M} = \\frac{\\color{#A3113E}{${formatDeTeX(f_k, 1)}}}{1{,}5} = \\color{#A3113E}{${formatDeTeX(f_d, 2)}} \\, \\text{N/mm}^2 \\, (\\text{MPa})`} />
            </div>

            <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt2WirksameSchlankheit} /><p className="mt-1"><MdText text={inhalt.texte.beiZweiseitigerHalterungAm} /></p>
              <BlockMath math={`\\bar{\\lambda} = \\frac{h_{ef}}{t} = \\frac{\\color{#A3113E}{${formatDeTeX(wallHeight, 2)}} \\, \\text{m}}{\\color{#A3113E}{${formatDeTeX(t_m, 3)}} \\, \\text{m}} = \\color{#A3113E}{${formatDeTeX(slenderness_mauer, 2)}}`} />
              <p className="mt-1"><MdText text={inhalt.texte.nachDinEn1996} /><strong className="text-shiraz">{formatDeZahl(slenderness_mauer, 2)}</strong>. 
                {slenderness_mauer > 25 ? (
                  <span className="text-red-600 font-bold block mt-1"><MdText text={inhalt.texte.achtungWandIstZu} /></span>
                ) : (
                  <span className="text-green-600 block mt-1"><MdText text={inhalt.texte.grenzbedingungErfülltSlenderness25} /></span>
                )}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt3AbminderungsfaktorPhi} /><p className="mt-1"><MdText text={inhalt.texte.derAbminderungsfaktorPhiBerücksichtigt} /></p>
              <BlockMath math={`\\Phi = 0{,}85 - 0{,}0011 \\cdot \\left(\\frac{h_{ef}}{t}\\right)^2`} />
              <BlockMath math={`\\Phi = 0{,}85 - 0{,}0011 \\cdot (\\color{#A3113E}{${formatDeTeX(slenderness_mauer, 2)}})^2 = \\color{#A3113E}{${formatDeTeX(phi_final, 4)}}`} />
            </div>

            <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt4VertikalerTraglastwiderstand} /><p className="mt-1"><MdText text={inhalt.texte.derBemessungswertDerAufnehmbaren} /></p>
              <BlockMath math={`N_{Rd} = \\Phi \\cdot t \\cdot f_d`} />
              <BlockMath math={`N_{Rd} = \\color{#A3113E}{${formatDeTeX(phi_final, 3)}} \\cdot \\color{#A3113E}{${formatDeTeX(t_m, 3)}} \\, \\text{m} \\cdot \\color{#A3113E}{${formatDeTeX(f_d, 2)}} \\, \\text{MN/m}^2 \\cdot 1000 = \\color{#A3113E}{${formatDeTeX(n_Rd, 1)}} \\, \\text{kN/m}`} />
            </div>

            <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt5Auslastungsvergleich} /><BlockMath math={`\\eta = \\frac{N_{Ed}}{N_{Rd}} = \\frac{\\color{#A3113E}{${verticalLoad}} \\, \\text{kN/m}}{\\color{#A3113E}{${formatDeTeX(n_Rd, 1)}} \\, \\text{kN/m}} = \\color{#A3113E}{${formatDeTeX(utilizationMauer, 3)}} \\le 1{,}0`} />
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
              <span className="font-bold text-sm"><MdText text={inhalt.texte.ausnutzungsgradEurocode6} /></span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-xxs tracking-wider uppercase ${
                    utilizationMauer <= 1.0 && slenderness_mauer <= 25 ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                  }`}>
                {utilizationMauer <= 1.0 && slenderness_mauer <= 25 ? 'Bestanden' : inhalt.werte.nichtErfüllt}
              </span>
            </div>
            <p><MdText text={inhalt.texte.dieMauerwerkswandIstZu} /><strong>{formatDeZahl((utilizationMauer * 100), 1)}%</strong> ausgelastet.
            </p>
            <p className="text-xxs opacity-90 mt-1">
              {utilizationMauer <= 1.0 && slenderness_mauer <= 25
                ? inhalt.werte.derStandsicherheitsnachweisFürUnbewehrte
                : inhalt.werte.dieWandIstÜberlastet}
            </p>
          </div>
        </div>
      </div>
    );
}
