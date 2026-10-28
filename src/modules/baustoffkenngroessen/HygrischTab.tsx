// Ausgelagert aus src/modules/Baustoffkenngroessen.tsx (AP 5.2)
import { formatDeZahl, formatDeIntl } from '@/src/utils/numberFormat';
import React from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { BlockMath, InlineMath } from 'react-katex';
import inhalt from '@/content/baustoffkenngroessen/HygrischTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';

export interface HygrischTabProps {
  masseFeucht: number;
  masseTrocken: number;
  sdDicke: number;
  sdMuWert: number;
  setMasseFeucht: React.Dispatch<React.SetStateAction<number>>;
  setMasseTrocken: React.Dispatch<React.SetStateAction<number>>;
  setSdDicke: React.Dispatch<React.SetStateAction<number>>;
  setSdMuWert: React.Dispatch<React.SetStateAction<number>>;
  setWSaugzeit: React.Dispatch<React.SetStateAction<number>>;
  setWWasseraufnahme: React.Dispatch<React.SetStateAction<number>>;
  wassergehalt: number;
  wSaugzeit: number;
  wWasseraufnahme: number;
}

export default function HygrischTab({ masseFeucht, masseTrocken, sdDicke, sdMuWert, setMasseFeucht, setMasseTrocken, setSdDicke, setSdMuWert, setWSaugzeit, setWWasseraufnahme, wassergehalt, wSaugzeit, wWasseraufnahme }: HygrischTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-fade-in">
      {/* Card 1: Feuchtegehalt */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="p-1 bg-rose-50 text-shiraz rounded-md text-xs">u</span> Feuchtegehalt
          </h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p><MdText text={inhalt.texte.derFeuchtegehaltBeschreibtDie} /></p>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
            <BlockMath math="u_m = \frac{m_w - m_d}{m_d} \cdot 100" />
            <p className="text-[10px] text-slate-500 mt-2 font-mono"><MdText text={inhalt.texte.uMMassenbezogenerFeuchtegehalt} /></p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
            <span className="font-bold text-indigo-950 block mb-0.5"><MdText text={inhalt.texte.einfacheBeispielrechnung} /></span><MdText text={inhalt.texte.eineFeuchteSteinprobeWiegt} /><div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]"><MdText text={inhalt.texte.uM1050G} /></div>
          </div>

          <div className="space-y-4">
            <Slider label={inhalt.werte.feuchtmasseMW} min={100} max={2500} step={10} value={masseFeucht} unit="g" onChange={(e) => setMasseFeucht(Number(e.target.value))} />
            <Slider label={inhalt.werte.trockenmasseMD} min={100} max={2000} step={10} value={masseTrocken} unit="g" onChange={(e) => setMasseTrocken(Number(e.target.value))} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="p-3 bg-shiraz/10 rounded-lg text-shiraz font-bold text-center text-sm"><MdText text={inhalt.texte.massenbezogenerFeuchtegehalt} />{formatDeZahl(Math.max(0, wassergehalt), 2)} M.-%
          </div>
          
          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-2 text-slate-600">
            <p><MdText text={inhalt.texte.normPrüfverfahrenGravimetrischeBestimmun} /></p>
            <p><MdText text={inhalt.texte.praxisanwendungQualitätskontrolleBeimEin} /></p>
          </div>
        </div>
      </div>

      {/* Card 2: sd-Wert & mu-Wert */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="p-1 bg-sky-50 text-sky-600 rounded-md text-xs">s_d</span><MdText text={inhalt.texte.diffusionsäquivalenteLuftschichtdicke} /></h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p><MdText text={inhalt.texte.derSDWert} /></p>
          
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
            <BlockMath math="s_d = \mu \cdot d" />
            <p className="text-[10px] text-slate-500 mt-2 font-mono"><MdText text={inhalt.texte.sDDiffusionsäquivalenteLuftschichtdicke} /></p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
            <span className="font-bold text-indigo-950 block mb-0.5"><MdText text={inhalt.texte.einfacheBeispielrechnung2} /></span><MdText text={inhalt.texte.einBauteilAusBeton} /><span className="block mt-1 text-[11px] text-slate-500"><MdText text={inhalt.texte.hinweisFürNormalbetonGibt} /></span>
            <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]"><MdText text={inhalt.texte.sD1300} /></div>
          </div>

          <div className="space-y-4">
            <Slider label={inhalt.werte.bauteildickeD} min={0.001} max={1.0} step={0.001} value={sdDicke} unit="m" onChange={(e) => setSdDicke(Number(e.target.value))} />
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <label><MdText text={inhalt.texte.diffusionswiderstandszahl} /></label>
                <span className="text-indigo-600">{formatDeIntl(sdMuWert)} [-]</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="120000" 
                step="100" 
                value={sdMuWert} 
                onChange={(e) => setSdMuWert(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="flex gap-1.5 flex-wrap mt-1">
                <button onClick={() => { setSdMuWert(1); setSdDicke(0.14); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700"><MdText text={inhalt.texte.mineralwolle1} /></button>
                <button onClick={() => { setSdMuWert(10); setSdDicke(0.0125); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Gips (μ=10)</button>
                <button onClick={() => { setSdMuWert(130); setSdDicke(0.20); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700"><MdText text={inhalt.texte.beton130} /></button>
                <button onClick={() => { setSdMuWert(100000); setSdDicke(0.0002); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700"><MdText text={inhalt.texte.peFolie10} /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {(() => {
            const sdCalculated = sdMuWert * sdDicke;
            let classification = "diffusionsoffen";
            let colorClass = "bg-emerald-50 border-emerald-200 text-emerald-800";
            if (sdCalculated > 0.5 && sdCalculated < 1500) {
              classification = "diffusionshemmend";
              colorClass = "bg-amber-50 border-amber-200 text-amber-800";
            } else if (sdCalculated >= 1500) {
              classification = inhalt.werte.diffusionsdichtDampfsperre;
              colorClass = "bg-rose-50 border-rose-200 text-rose-800";
            }
            return (
              <div className={`p-3 rounded-xl border text-center font-bold text-xs space-y-1 ${colorClass}`}>
                <div><MdText text={inhalt.texte.errechneterSDWert} />{formatDeZahl(sdCalculated, 3)} m</div>
                <div className="uppercase text-[10px] tracking-wider"><MdText text={inhalt.texte.klassifizierungNachDin4108} />{classification}</div>
              </div>
            );
          })()}

          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-2 text-slate-600">
            <p><MdText text={inhalt.texte.prüfverfahrenNachDinEn} /></p>
            <p><MdText text={inhalt.texte.praxisrelevanzPlanungDesFeuchteschutzes} /></p>
          </div>
        </div>
      </div>

      {/* Card 3: Wasseraufnahmekoeffizient (w-Wert / B-Wert) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between lg:col-span-2">
        <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <span className="p-1 bg-teal-50 text-teal-600 rounded-md text-xs">w</span><MdText text={inhalt.texte.wasseraufnahmekoeffizientKapillaritätWWe} /></h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.derWasseraufnahmekoeffizientWWert} /><span className="font-bold font-mono">B-Wert</span><MdText text={inhalt.texte.bezeichnetBeschreibtDasKapillare} /></p>
            
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
              <BlockMath math="w = \frac{W_w}{\sqrt{t}}" />
              <p className="text-[10px] text-slate-500 mt-2 font-mono"><MdText text={inhalt.texte.wWasseraufnahmekoeffizientKgM} /></p>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left">
              <span className="font-bold text-indigo-950 block mb-0.5"><MdText text={inhalt.texte.einfacheBeispielrechnung3} /></span><MdText text={inhalt.texte.einBacksteinHatNach} /><div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]"><MdText text={inhalt.texte.w14Kg} /></div>
            </div>

            <div className="space-y-4 pt-2">
              <Slider label={inhalt.werte.wasseraufnahmeJeMFläche} min={0.01} max={15.0} step={0.05} value={wWasseraufnahme} unit="kg/m²" onChange={(e) => setWWasseraufnahme(Number(e.target.value))} />
              <Slider label={inhalt.werte.saugdauerEinwirkzeitT} min={1} max={120} step={1} value={wSaugzeit} unit="Stunden" onChange={(e) => setWSaugzeit(Number(e.target.value))} />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4">
            {(() => {
              const wCurrentValue = wWasseraufnahme / Math.sqrt(wSaugzeit);
              let rating = inhalt.werte.kapillarSaugend;
              let ratingDetail = inhalt.werte.erhöhteKapillareWasseraufnahmeTypisch;
              let styleClass = "bg-rose-50 border-rose-200 text-rose-800";
              
              if (wCurrentValue <= 0.5) {
                rating = inhalt.werte.wasserabweisendW05;
                ratingDetail = inhalt.werte.hervorragenderSchlagregenschutzWasserPer;
                styleClass = "bg-emerald-50 border-emerald-200 text-emerald-800";
              } else if (wCurrentValue <= 2.0) {
                rating = inhalt.werte.wasserhemmend05W;
                ratingDetail = inhalt.werte.eingeschränkteKapillareLeitfähigkeitEin;
                styleClass = "bg-amber-50 border-amber-200 text-amber-800";
              }

              return (
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border text-center ${styleClass}`}>
                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-85"><MdText text={inhalt.texte.berechneterWWertB} /></div>
                    <div className="text-2xl font-black my-1">{formatDeZahl(wCurrentValue, 4)} <span className="text-xs font-normal"><MdText text={inhalt.texte.kgMHSup} /></span></div>
                    <div className="text-xs font-bold mt-1 uppercase tracking-wider">{rating}</div>
                    <p className="text-[11px] font-normal leading-relaxed mt-1">{ratingDetail}</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-2 text-slate-600">
                    <p className="font-bold text-slate-800"><MdText text={inhalt.texte.prüfverfahrenUndNormenbezug} /></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><MdText text={inhalt.texte.dinEnIso15148} /></li>
                      <li><MdText text={inhalt.texte.din41083Festlegung} /></li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      {/* Z12: Rechenweg zur Formel */}
      <div className="lg:col-span-2">
        <FormulaDerivationBox
          title={inhalt.werte.herleitungDiffusionsäquivalenteLuftschichtdicke}
          zielGleichung="s_d = \mu \cdot d"
          normQuelle={inhalt.werte.normSd}
          schritte={inhalt.daten["HygrischTab.schritte"]}
          ergebnisHinweis={inhalt.werte.hinweisSd}
        />
      </div>
    </div>
  );
}
