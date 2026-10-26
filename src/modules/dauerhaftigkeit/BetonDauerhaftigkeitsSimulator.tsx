// Ausgelagert aus src/modules/Dauerhaftigkeit.tsx (AP 5.2)
import { useState } from 'react';
import { Activity, AlertTriangle, Check } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import inhalt from '@/content/dauerhaftigkeit/BetonDauerhaftigkeitsSimulator.json';
import { MdText } from '@/src/components/inhalt/MdText';

export function BetonDauerhaftigkeitsSimulator() {
  const [k, setK] = useState<number>(2.5); // Karbonatisierungsbeiwert in mm/Wurzel(a)
  const [t, setT] = useState<number>(50);  // Zeit in Jahren
  const [cnom, setCnom] = useState<number>(30); // Betondeckung in mm
  const [showPath, setShowPath] = useState<boolean>(false);
  
  const presets = inhalt.daten["BetonDauerhaftigkeitsSimulator.presets"];

  const handlePreset = (pK: number, pC: number) => {
    setK(pK);
    setCnom(pC);
  };

  const xCarb = k * Math.sqrt(t);
  const isDepassivated = xCarb >= cnom;
  
  const tCrit = k > 0 ? Math.round(Math.pow(cnom / k, 2)) : 999;
  const safeYearsRemaining = tCrit - t;

  return (
    <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-6">
      <div className="flex items-center gap-2.5 mb-2">
        <Activity className="text-shiraz w-5 h-5 animate-pulse" />
        <h4 className="font-bold text-slate-800 text-sm sm:text-base"><MdText text={inhalt.texte.stahlbetonLebensdauersimulatorKarbonatis} /></h4>
      </div>
      <p className="text-xs text-slate-600 mb-4 leading-relaxed"><MdText text={inhalt.texte.nachDemWurzelZeit} /><FormulaText text="$s(t) = k \cdot \sqrt{t}$" /><MdText text={inhalt.texte.sinktDerPhWert} /></p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider"><MdText text={inhalt.texte.schnellKonfigurationDinEn} /></span>
            <div className="flex flex-col gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePreset(p.kValue, p.cnomDefault)}
                  className="bg-slate-50 hover:bg-shiraz/5 border border-home-grau/30 hover:border-shiraz/35 py-1.5 px-2.5 rounded-lg text-left text-xs transition-all flex justify-between items-center text-slate-700 cursor-pointer"
                >
                  <span className="font-medium">{p.label}</span>
                  <span className="text-xs font-mono bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-600 whitespace-nowrap">
                    k = {formatDeWert(p.kValue)} / c = {formatDeWert(p.cnomDefault)}mm
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Karbonatisierungsbeiwert <FormulaText text="$k$" /></span>
                <span className="font-mono text-shiraz font-bold">{formatDeWert(k)} mm/√a</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={k}
                onChange={(e) => setK(parseFloat(e.target.value))}
                className="w-full accent-shiraz"
              />
              <span className="text-xs text-slate-400 block mt-0.5"><MdText text={inhalt.texte.dichteZementeC3545} /></span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Betondeckung <FormulaText text="$c_{\text{nom}}$" /> (Soll)</span>
                <span className="font-mono text-slate-900 font-bold">{formatDeWert(cnom)} mm</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={cnom}
                onChange={(e) => setCnom(parseInt(e.target.value))}
                className="w-full accent-slate-700"
              />
              <span className="text-xs text-slate-400 block mt-0.5"><MdText text={inhalt.texte.vorgeschriebenIstCNom} /></span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Bauteilalter <FormulaText text="$t$" /></span>
                <span className="font-mono text-slate-900 font-bold">{formatDeWert(t)} Jahre</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={t}
                onChange={(e) => setT(parseInt(e.target.value))}
                className="w-full accent-shiraz"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Graphic and Verdict */}
        <div className="lg:col-span-7 bg-slate-50 border border-home-grau/30 p-4.5 rounded-xl flex flex-col gap-4">
          <div className="text-center bg-white p-2 text-xs rounded-lg border border-home-grau/30">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block"><MdText text={inhalt.texte.rechnerischeKarbonatisierungstiefe} /></span>
            <div className="text-sm font-bold text-slate-800 mt-1 flex justify-center items-center gap-1">
              <span>s(t) = {formatDeWert(k)} · √{formatDeWert(t)} = </span>
              <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded font-mono text-lg font-black">{formatDeWert(xCarb)} mm</span>
            </div>
          </div>

          {/* SVG cross-section */}
          <div className="w-full h-32 bg-stone-300 rounded-lg relative overflow-hidden border border-home-grau/30 shadow-inner flex items-center justify-center">
            {/* Concrete solid texturing */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '12px 12px' }} />

            {/* Uncarbonated Alkaline Concrete (Safe, Passive Zone pH >12.5) */}
            <div className="absolute inset-y-0 right-0 h-full bg-slate-400/20 flex items-center justify-end pr-3 select-none pointer-events-none transition-all duration-300" style={{ left: `${Math.min(100, (xCarb / 70) * 100)}%` }}>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block rotate-90 sm:rotate-0"><MdText text={inhalt.texte.alkalischPh125} /></span>
            </div>

            {/* Carbonated Depassivated Zone (Acidified, pH < 9.0) */}
            <div className="absolute inset-y-0 left-0 bg-red-500/15 border-r border-dashed border-red-500 flex items-center pl-3 select-none pointer-events-none transition-all duration-300" style={{ width: `${Math.min(100, (xCarb / 70) * 100)}%` }}>
              {xCarb > 8 && (
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider block whitespace-nowrap"><MdText text={inhalt.texte.coEinflussPh9} /></span>
              )}
            </div>

            {/* Concrete Surface Marker */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800">
              <span className="absolute left-1.5 top-1.5 text-[8px] font-bold text-slate-800 uppercase tracking-widest select-none pointer-events-none whitespace-nowrap">Oberfläche</span>
            </div>

            {/* Steel Reinforcement Rebar */}
            <div className="absolute inset-y-0 flex flex-col justify-around transition-all duration-300" style={{ left: `${(cnom / 70) * 100}%` }}>
              <div className={`w-6 h-6 rounded-full -translate-x-3 border-2 shadow flex items-center justify-center transition-all duration-300 ${
                isDepassivated ? 'bg-red-600 border-red-800 animate-pulse text-white' : 'bg-slate-500 border-home-grau/30 text-slate-100'
              }`}>
                <div className="absolute -top-4 font-mono text-xs font-bold text-slate-800 whitespace-nowrap"><MdText text={inhalt.texte.bewehrungC} />{formatDeWert(cnom)}mm)
                </div>
                <div className="text-xs font-black">Ø</div>
              </div>
            </div>

            {/* Scale lines */}
            <div className="absolute bottom-1 right-2 bg-white/70 px-1 rounded text-[8px] font-bold text-slate-500 select-none"><MdText text={inhalt.texte.skalierung070Mm} /></div>
          </div>

          {/* Verdict Alert */}
          <div className={`p-3 rounded-xl border flex gap-3 ${
            isDepassivated 
              ? 'bg-rose-50 border-shiraz/20 text-slate-900' 
              : 'bg-slate-50 border-home-grau/30 text-slate-800'
          }`}>
            <div className="shrink-0 pt-0.5">
              {isDepassivated ? <AlertTriangle className="w-4 h-4 text-shiraz" /> : <Check className="w-4 h-4 text-slate-500" />}
            </div>
            <div>
              <p className="text-xs font-bold leading-normal">
                {isDepassivated 
                  ? inhalt.werte.gefahrDepassivierungEingetreten 
                  : inhalt.werte.sichererBereichStahloberflächePassiviert}
              </p>
              <p className="text-xs text-slate-700 leading-normal mt-1">
                {isDepassivated ? (
                  <>
                    Nach ca. <strong>{formatDeWert(tCrit)} Jahren</strong><MdText text={inhalt.texte.hatDieSaureFront} /></>
                ) : (
                  <><MdText text={inhalt.texte.dieAlkalitätSchütztDie} /><strong>{safeYearsRemaining > 200 ? '>200' : safeYearsRemaining} Jahre</strong><MdText text={inhalt.texte.schwelleBeiT} />{formatDeWert(tCrit)} Jahren).
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible calculation path */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <button
          onClick={() => setShowPath(!showPath)}
          className="text-xs font-bold text-shiraz hover:text-shiraz/80 flex items-center gap-1.5 cursor-pointer transition-all focus:outline-none"
        >
          <span>{showPath ? inhalt.werte.formelnBerechnungsschritteAusblenden : inhalt.werte.formelnInteraktiverBerechnungswegSchritt}</span>
        </button>
        {showPath && (
          <div className="mt-3 bg-stone-50 border border-slate-200 rounded-xl p-4 space-y-4 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2">
            <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5"><MdText text={inhalt.texte.schrittFürSchrittHerleitung} /></h5>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <p className="font-bold text-slate-800"><MdText text={inhalt.texte.schritt1BestimmungDes} />{formatDeWert(k)} mm/√a)</p>
                <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.derWiderstandDesZementsteins} /><strong className="font-mono text-xs">{formatDeWert(k)} mm/√a</strong>.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800"><MdText text={inhalt.texte.schritt2DasQuadratische} /></p>
                <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dieGasdiffusionImPorensystem} />{formatDeWert(t)}<MdText text={inhalt.texte.jahrenBerechnetSichAus} /></p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-slate-800 font-bold my-1 text-xs">
                  s({formatDeWert(t)}) = {formatDeZahl(k, 1)} · √{formatDeWert(t)} = {formatDeZahl(k, 1)} · {formatDeZahl(Math.sqrt(t), 3)} = {formatDeZahl(xCarb, 1)} mm
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800"><MdText text={inhalt.texte.schritt3AbgleichMit} />{formatDeWert(cnom)} mm)</p>
                <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.damitDerKorrosionsschutzAktiv} />{isDepassivated ? (
                    <span className="text-red-700 block font-semibold mt-1"><MdText text={inhalt.texte.dieCarbonatisierungsfront} />{formatDeZahl(xCarb, 1)}<MdText text={inhalt.texte.mmHatDenSchützenden} />{formatDeZahl(xCarb - cnom, 1)}<MdText text={inhalt.texte.mmÜberschrittenDieBewehrung} /></span>
                  ) : (
                    <span className="text-emerald-700 block font-semibold mt-1"><MdText text={inhalt.texte.dieHochalkalischeRestpufferzoneVor} />{formatDeZahl(cnom - xCarb, 1)}<MdText text={inhalt.texte.mmDerPassiveRostschutz} /></span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800"><MdText text={inhalt.texte.schritt4BestimmungDes} /></p>
                <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.derGenaueZeitpunktAn} /></p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-slate-800 font-bold my-1 text-xs"><MdText text={inhalt.texte.tCritCNom} />{formatDeWert(cnom)} / {formatDeWert(k)})² = {formatDeWert(tCrit)} Jahre
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-1"><MdText text={inhalt.texte.rechnerischVerbleibendeRestlebensdauerVo} />{safeYearsRemaining > 0 ? (
                    <span><strong>{safeYearsRemaining} Jahre</strong>.</span>
                  ) : (
                    <span><MdText text={inhalt.texte.dasBauteilBefindetSich} /><strong>{Math.abs(safeYearsRemaining)} Jahren</strong><MdText text={inhalt.texte.imUngeschütztenZustand} /></span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800"><MdText text={inhalt.texte.schritt5KonstruktiveUnd} /></p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                  <li><MdText text={inhalt.texte.geringererWZWert} /></li>
                  <li><MdText text={inhalt.texte.erhöhterVorhaltemaßDcEin} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
