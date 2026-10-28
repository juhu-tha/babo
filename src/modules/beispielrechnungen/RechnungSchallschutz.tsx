import { Volume2, Sliders, CheckCircle2, AlertTriangle } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeWert, formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import React from 'react';
import inhalt from '@/content/beispielrechnungen/RechnungSchallschutz.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import type { Hinweis } from '@/src/calc/plausibilitaet';

interface RechnungSchallschutzProps {
  schallDicke: number;
  schallFlanke: "entkoppelt" | "massiv" | "leicht";
  schallPutz: boolean;
  schallRohdichte: number;
  schallSollTyp: "wohnungstrenn" | "treppenhaus" | "behandlung" | "doppelhaus";
  schallWandTyp: "beton" | "ks" | "hlz" | "porenbeton";
  schall_KF: 0 | 4 | 2;
  schall_R_prime_w: number;
  schall_Rw: number;
  schall_erf: number;
  schall_m0: number;
  schall_m_total: number;
  schall_passed: boolean;
  schall_hinweise: Hinweis[];
  schall_soll_werte: { wohnungstrenn: { erf: number; label: string; }; treppenhaus: { erf: number; label: string; }; behandlung: { erf: number; label: string; }; doppelhaus: { erf: number; label: string; }; };
  setSchallDicke: React.Dispatch<React.SetStateAction<number>>;
  setSchallFlanke: React.Dispatch<React.SetStateAction<"entkoppelt" | "massiv" | "leicht">>;
  setSchallPutz: React.Dispatch<React.SetStateAction<boolean>>;
  setSchallRohdichte: React.Dispatch<React.SetStateAction<number>>;
  setSchallSollTyp: React.Dispatch<React.SetStateAction<"wohnungstrenn" | "treppenhaus" | "behandlung" | "doppelhaus">>;
  setSchallWandTyp: React.Dispatch<React.SetStateAction<"beton" | "ks" | "hlz" | "porenbeton">>;
}

export default function RechnungSchallschutz({ schallDicke, schallFlanke, schallPutz, schallRohdichte, schallSollTyp, schallWandTyp, schall_KF, schall_R_prime_w, schall_Rw, schall_erf, schall_m0, schall_m_total, schall_passed, schall_hinweise, schall_soll_werte, setSchallDicke, setSchallFlanke, setSchallPutz, setSchallRohdichte, setSchallSollTyp, setSchallWandTyp }: RechnungSchallschutzProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Volume2 className="text-shiraz" size={18} />
            <span><MdText text={inhalt.texte.bauakustikLuftschalldämmungMassiverBaute} /></span>
          </h3>
          <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.wasBerechnetWirdDie} /></p>
        </div>

        <EingabeHinweise hinweise={schall_hinweise} />

        {/* INTERACTIVE CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-5">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2 flex items-center justify-between">
              <span><MdText text={inhalt.texte.wandparameterFlankensituation} /></span>
              <Sliders size={16} className="text-shiraz" />
            </h3>

            {/* Preset-Wandbaustoff */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Wandbaustoff-Vorauswahl:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'ks', name: inhalt.werte.kalksandsteinKs, rho: 2000, defD: 17.5 },
                  { id: 'beton', name: inhalt.werte.stahlbetonC2530, rho: 2400, defD: 20.0 },
                  { id: 'hlz', name: inhalt.werte.hochlochziegelHlz, rho: 1200, defD: 24.0 },
                  { id: 'porenbeton', name: inhalt.werte.porenbetonPb, rho: 500, defD: 24.0 }
                ].map(mat => (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => {
                      setSchallWandTyp(mat.id as "porenbeton" | "beton" | "ks" | "hlz");
                      setSchallRohdichte(mat.rho);
                      setSchallDicke(mat.defD);
                    }}
                    className={`p-2 rounded-lg border text-left font-sans cursor-pointer transition-all ${
                          schallWandTyp === mat.id 
                            ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                  >
                    <div className="text-[11px] leading-tight">{mat.name}</div>
                    <div className={`text-[9.5px] font-mono ${schallWandTyp === mat.id ? 'text-white/80' : 'text-slate-400'}`}>
                      {formatDeWert(mat.rho)} kg/m³
                    </div>
                  </button>
                ))}
              </div>
              {schallWandTyp === 'hlz' && <p className="text-[10.5px] text-slate-700 leading-snug"><MdText text={inhalt.texte.hinweisMassekurveHochlochziegel} /></p>}
            </div>

            {/* Wanddicke Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span><MdText text={inhalt.texte.wanddickeRohbauteilD} /></span>
                <span className="text-shiraz font-mono">{formatDeZahl(schallDicke, 1)} cm</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="36.5" 
                step="0.5" 
                value={schallDicke} 
                onChange={(e) => setSchallDicke(parseFloat(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10,0 cm</span>
                <span><MdText text={inhalt.texte.t175CmStandard} /></span>
                <span>24,0 cm</span>
                <span>36,5 cm</span>
              </div>
            </div>

            {/* Rohdichte Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span><MdText text={inhalt.texte.trockenrohdichte} /></span>
                <span className="text-shiraz font-mono">{formatDeWert(schallRohdichte)} kg/m³</span>
              </div>
              <input 
                type="range" 
                min="400" 
                max="2600" 
                step="50" 
                value={schallRohdichte} 
                onChange={(e) => setSchallRohdichte(parseInt(e.target.value))}
                className="w-full accent-shiraz"
              />
            </div>

            {/* Beidseitiger Putz Checkbox */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block"><MdText text={inhalt.texte.beidseitigerPutzauftrag} /></span>
                <span className="text-[11px] text-slate-500"><MdText text={inhalt.texte.t215MmGips} /></span>
              </div>
              <input 
                type="checkbox"
                checked={schallPutz}
                onChange={(e) => setSchallPutz(e.target.checked)}
                className="w-4 h-4 accent-shiraz cursor-pointer"
              />
            </div>

            {/* Flankensituation */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block"><MdText text={inhalt.texte.flankenübertragungKF} /></label>
              <select aria-label={inhalt.werte.flankenübertragungKF} 
                value={schallFlanke}
                onChange={(e) => setSchallFlanke(e.target.value as "massiv" | "entkoppelt" | "leicht")}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-800"
              >
                <option value="entkoppelt">Akustisch entkoppelt / Vorsatzschale (KF = 0 dB)</option>
                <option value="massiv">Schwere Massivflanken &gt; 300 kg/m² (KF = 2 dB)</option>
                <option value="leicht">Leichte Flankenbauteile / Porenbeton (KF = 4 dB)</option>
              </select>
            </div>

            {/* Schutzziel */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block"><MdText text={inhalt.texte.gefordertesSchutzzielDin4109} /></label>
              <select aria-label={inhalt.werte.gefordertesSchutzzielDin4109} 
                value={schallSollTyp}
                onChange={(e) => setSchallSollTyp(e.target.value as "wohnungstrenn" | "treppenhaus" | "behandlung" | "doppelhaus")}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-800"
              >
                <option value="wohnungstrenn">Wohnungstrennwand (erf. R&apos;w ≥ 53 dB)</option>
                <option value="treppenhaus">Treppenraumwand zu Aufenthaltsräumen (erf. R&apos;w ≥ 52 dB)</option>
                <option value="behandlung">Arztpraxis / Untersuchungsräume (erf. R&apos;w ≥ 47 dB)</option>
                <option value="doppelhaus">Doppel-/Reihenhaustrennwand zweischalig (erf. R&apos;w ≥ 59 dB)</option>
              </select>
            </div>
          </div>

          {/* CALCULATION BREAKDOWN */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.schrittweiseAkustischeBerechnungDin} /></h3>

              <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal font-sans">
                {/* Step 1: Flächenbezogene Masse */}
                <div><MdText text={inhalt.texte.schritt1FlächenbezogeneBauteilmasse} /><p className="mt-1 text-xxs text-slate-500"><MdText text={inhalt.texte.produktAusWanddickeD} /></p>
                  <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                    <BlockMath math={`m'_0 = \\frac{${formatDeTeX(schallDicke, 1)}}{100} \\, \\text{m} \\times ${schallRohdichte} \\, \\text{kg/m}^3 = ${formatDeTeX(schall_m0, 1)} \\, \\text{kg/m}^2`} />
                    <BlockMath math={`m' = ${formatDeTeX(schall_m0, 1)} + ${schallPutz ? 40 : 0} = \\color{#A3113E}{\\mathbf{${formatDeTeX(schall_m_total, 1)}}} \\, \\text{kg/m}^2`} />
                  </div>
                </div>

                {/* Step 2: Direktes Schalldämmmaß */}
                <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt2DirektesSchalldämm} /><p className="mt-1 text-xxs text-slate-500"><MdText text={inhalt.texte.fürMassiveBiegesteifeSchalen} /></p>
                  <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                    <BlockMath math={`R_w = 30{,}9 \\cdot \\lg(m'/m'_0) - 22{,}2 = 30{,}9 \\cdot \\lg(${formatDeTeX(schall_m_total, 1)}) - 22{,}2 = \\color{#A3113E}{\\mathbf{${formatDeTeX(schall_Rw, 1)}}} \\, \\text{dB}`} />
                  </div>
                  <p className="mt-1 text-xxs text-slate-500"><MdText text={inhalt.texte.hinweisZurGültigkeitDie} /></p>
                  <p className="mt-1 text-xxs text-slate-500"><MdText text={inhalt.texte.frühererStandBeiblatt1} /></p>
                </div>

                {/* Step 3: Bauschalldämmmaß */}
                <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt3BauschalldämmMaß} /><div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                    <BlockMath math={`R'_w = R_w - K_F = ${formatDeTeX(schall_Rw, 1)} - ${schall_KF} = \\color{#A3113E}{\\mathbf{${formatDeTeX(schall_R_prime_w, 1)}}} \\, \\text{dB}`} />
                  </div>
                </div>

                {/* Step 4: Soll-Ist-Vergleich */}
                <div className="border-t border-slate-100 pt-3">
                  <div className={`p-4 rounded-xl border ${
                        schall_passed 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                          : 'bg-rose-50 border-rose-300 text-rose-900'
                      }`}>
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {schall_passed ? <CheckCircle2 size={18} className="text-emerald-700" /> : <AlertTriangle size={18} className="text-rose-700" />}
                      <span>{schall_passed ? inhalt.werte.normnachweisErfüllt : inhalt.werte.normnachweisNichtErfüllt}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed"><MdText text={inhalt.texte.vorhandenesBauschalldämmMaß} /><strong>R&apos;_w = {formatDeZahl(schall_R_prime_w, 1)} dB</strong><MdText text={inhalt.texte.vsNormativeMindestanforderung} /><strong>R&apos;_w,erf = {formatDeWert(schall_erf)} dB</strong> für {schall_soll_werte[schallSollTyp].label}.
                    </p>
                    {!schall_passed && (
                      <p className="mt-2 text-xxs font-medium text-rose-800"><MdText text={inhalt.texte.empfohleneGegenmaßnahmenWanddickeVergröß} /></p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
