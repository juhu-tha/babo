import React, { useId, useState, useMemo } from 'react';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import {
  RotateCcw,
  Activity,
  Compass,
  Layers,
  ArrowUp,
  ArrowDown,
  Gauge,
  Sparkles,
  GitCommit,
  Check
} from 'lucide-react';
import inhalt from '@/content/spannbeton/SpannbetonDehnungsAnimation.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { dehnungsZustand, DEHNUNG_TRAEGER, type Spanngliedlage } from '@/src/calc/spannbeton';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

export type TendonTrajectoryType = Spanngliedlage;

export default function SpannbetonDehnungsAnimation() {
  const vorspannId = useId();
  // Träger- & Systemzustand (Manuelle Schieberegler-Steuerung)
  const [prestressForce, setPrestressForce] = useState<number>(1400); // P in kN
  const [loadQ, setLoadQ] = useState<number>(0); // q in kN/m (beginnt bei 0 kN/m)
  const [eccentricity, setEccentricity] = useState<number>(280); // e_p in mm (maximaler Hebelarm bzw. Parabelstich f)

  // NEU: Wählbare Spanngliedlage nach Nutzeranforderung:
  // a) zentrisch in Schwerachse
  // b) gerade unten mit Abstand Betondeckung
  // c) parabolisch entsprechend Momenteneinwirkung
  const [tendonTrajectory, setTendonTrajectory] = useState<TendonTrajectoryType>('parabolic');

  // Schnittort-Wahl: Feldmitte (x = L/2) vs. Auflager (x = 0)
  const [viewSection, setViewSection] = useState<'midspan' | 'support'>('midspan');

  // UI-Zustände
  const [activeDisplayMode, setActiveDisplayMode] = useState<'dehnung' | 'spannung' | 'superposition'>('dehnung');
  const [showExplanation, setShowExplanation] = useState<boolean>(true);

  // Feste Querschnitts- und Materialparameter (Einfeldträger L = 20 m, C40/50) und Rechnung im Rechenkern
  // Biegerandzug gegen f_ctm,fl = max((1,6 − h/1000)·f_ctm; f_ctm) nach DIN EN 1992-1-1, 3.1.8 (Kern src/calc/spannbeton.ts)
  const { L, h, fctmFl: fctm } = DEHNUNG_TRAEGER;

  const calc = useMemo(() => {
    const z = dehnungsZustand({ P: prestressForce, q: loadQ, ep: eccentricity, lage: tendonTrajectory, schnitt: viewSection });
    const darstellung = {
      support_crack: { phaseTitle: inhalt.werte.gefahrKopfzugrisseAmAuflager, phaseColor: 'text-red-800 bg-red-50 border-red-300', phaseBadge: 'bg-red-700 text-white' },
      camber: { phaseTitle: inhalt.werte.vollÜberdrücktMitÜberhöhung, phaseColor: 'text-blue-900 bg-blue-50 border-blue-200', phaseBadge: 'bg-blue-600 text-white' },
      full: { phaseTitle: inhalt.werte.vollÜberdrücktZustandI, phaseColor: 'text-emerald-800 bg-emerald-50 border-emerald-200', phaseBadge: 'bg-emerald-600 text-white' },
      limited: { phaseTitle: inhalt.werte.zustandIMitZugspannungen, phaseColor: 'text-amber-800 bg-amber-50 border-amber-200', phaseBadge: 'bg-amber-500 text-white' },
      cracked: { phaseTitle: inhalt.werte.rissbildungZustandIiMax, phaseColor: 'text-red-700 bg-red-50 border-red-200', phaseBadge: 'bg-red-600 text-white' },
    }[z.zustand];
    return { ...z, phaseKey: z.zustand, ...darstellung };
  }, [prestressForce, loadQ, eccentricity, tendonTrajectory, viewSection]);

  // Handlers für manuelle Kraftanpassung
  const handleStep = (step: number) => {
    setPrestressForce((prev) => Math.max(0, Math.min(3000, Math.round((prev + step) / 10) * 10)));
  };

  const handleJumpTo = (force: number) => {
    setPrestressForce(Math.round(Math.max(0, Math.min(3000, force))));
  };

  const handleReset = () => {
    setPrestressForce(0);
    setLoadQ(0);
    setEccentricity(280);
    setTendonTrajectory('parabolic');
    setViewSection('midspan');
  };

  // SVG Dimensionen & Skalierungen
  const svgWidth = 460;
  const svgHeight = 260;
  const zeroX = 260; // x-Koordinate für ε = 0 ‰
  const scaleEps = 140; // 1 ‰ entspricht 140 Pixeln

  const topY = 30; // Oberkante des Querschnitts (z = -h/2)
  const botY = 220; // Unterkante des Querschnitts (z = +h/2)
  const midY = (topY + botY) / 2; // Schwerpunkt (z = 0)
  const tendonY = midY + (calc.activeEp / (h / 2)) * ((botY - topY) / 2); // Spanngliedposition im Querschnitt

  const topEpsX = zeroX + calc.eps_top * scaleEps;
  const botEpsX = zeroX + calc.eps_bot * scaleEps;
  const tendonEpsX = zeroX + calc.eps_tendon * scaleEps;

  // Nulldurchgang Y
  const neutralY = topY + (calc.neutralAxisDepth / h) * (botY - topY);

  // Längsschnitt-Verformung (amplifiziert für didaktische Erkennbarkeit)
  const beamDeflectPx = Math.max(-20, Math.min(25, calc.w_net_mm * 0.5));
  const beamCenterY = 55 + beamDeflectPx;

  return (
    <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
      {/* HEADER DER MANUELLEN ANALYSE */}
      <div className="border-b border-home-grau/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-shiraz text-white font-mono"><MdText text={inhalt.texte.interaktiverSpannkraftLagenSimulator} /></span>
              <span className="text-xs text-slate-500 font-mono"><MdText text={inhalt.texte.dinEn19921} /></span>
            </div>
            <h3 className="text-lg font-bold text-text-main mt-1 flex items-center gap-2">
              <Compass className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.spanngliedlageDehnungsüberlagerungSpannu} /></h3>
            <p className="text-xs text-text-main/70 mt-0.5"><MdText text={inhalt.texte.untersuchenSieDenEinfluss} /></p>
          </div>

          {/* Aktueller Tragwerkszustand Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-sans shadow-2xs ${calc.phaseColor}`}>
              {calc.phaseTitle}
            </span>
          </div>
        </div>
        <EingabeHinweise hinweise={calc.hinweise} />
      </div>

      {/* 1. SELEKTOR DER SPANNGLIEDLAGE: a) Zentrisch, b) Gerade unten, c) Parabolisch */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <GitCommit size={15} className="text-shiraz" /><MdText text={inhalt.texte.wahlDerSpanngliedlageSpanngliedführung} /></span>
          <span className="text-[11px] font-mono text-slate-500"><MdText text={inhalt.texte.tragwerkstheorieVormomentenverlauf} /></span>
        </div>

        <AuswahlGruppe label="Spanngliedverlauf" className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* a) Zentrisch */}
          <button {...alsOption(tendonTrajectory === 'centric')}
            type="button"
            onClick={() => setTendonTrajectory('centric')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              tendonTrajectory === 'centric'
                ? 'bg-shiraz text-white border-shiraz shadow-xs font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold"><MdText text={inhalt.texte.aZentrischInSchwerachse} /></span>
              {tendonTrajectory === 'centric' && <Check size={14} className="text-white" />}
            </div>
            <p className={`text-[10.5px] mt-1 leading-snug ${tendonTrajectory === 'centric' ? 'text-white/90' : 'text-slate-500'}`}><MdText text={inhalt.texte.eP0Über} /></p>
          </button>

          {/* b) Gerade unten */}
          <button {...alsOption(tendonTrajectory === 'straight_bottom')}
            type="button"
            onClick={() => setTendonTrajectory('straight_bottom')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              tendonTrajectory === 'straight_bottom'
                ? 'bg-shiraz text-white border-shiraz shadow-xs font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold"><MdText text={inhalt.texte.bGeradeUntenAbstand} /></span>
              {tendonTrajectory === 'straight_bottom' && <Check size={14} className="text-white" />}
            </div>
            <p className={`text-[10.5px] mt-1 leading-snug ${tendonTrajectory === 'straight_bottom' ? 'text-white/90' : 'text-slate-500'}`}><MdText text={inhalt.texte.ePTextKonst} /></p>
          </button>

          {/* c) Parabolisch */}
          <button {...alsOption(tendonTrajectory === 'parabolic')}
            type="button"
            onClick={() => setTendonTrajectory('parabolic')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              tendonTrajectory === 'parabolic'
                ? 'bg-shiraz text-white border-shiraz shadow-xs font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold"><MdText text={inhalt.texte.cParabolischMomenteneinwirkung} /></span>
              {tendonTrajectory === 'parabolic' && <Check size={14} className="text-white" />}
            </div>
            <p className={`text-[10.5px] mt-1 leading-snug ${tendonTrajectory === 'parabolic' ? 'text-white/90' : 'text-slate-500'}`}><MdText text={inhalt.texte.spanngliedFolgtDerBiegelinie} /></p>
          </button>
        </AuswahlGruppe>
      </div>

      {/* HAUPT-STEUERUNG: MANUELLER SCHIEBEREGLER MIT FEINJUSTIERUNG & MEILENSTEINEN */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
        {/* Schieberegler Kopfzeile mit Tastatur/Schritt-Buttons & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-white text-text-main border border-slate-300 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title={inhalt.werte.aufUngespanntenAusgangszustandZurücksetz}
            >
              <RotateCcw size={13} /> Reset
            </button>

            {/* Schrittweise Tasten für präzises Austarieren */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300">
              <span className="text-[10px] text-slate-500 font-bold px-1">Schritte:</span>
              <button
                type="button"
                onClick={() => handleStep(-100)}
                className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
                title="-100 kN"
              >
                −100
              </button>
              <button
                type="button"
                onClick={() => handleStep(-25)}
                className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
                title="-25 kN"
              >
                −25
              </button>
              <button
                type="button"
                onClick={() => handleStep(+25)}
                className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
                title="+25 kN"
              >
                +25
              </button>
              <button
                type="button"
                onClick={() => handleStep(+100)}
                className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
                title="+100 kN"
              >
                +100
              </button>
            </div>
          </div>

          {/* Anzeige-Modus-Umschaltung */}
          <AuswahlGruppe label="Anzeige" className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300">
            <button {...alsOption(activeDisplayMode === 'dehnung')}
              type="button"
              onClick={() => setActiveDisplayMode('dehnung')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDisplayMode === 'dehnung'
                  ? 'bg-shiraz text-white shadow-2xs'
                  : 'text-text-main/70 hover:text-text-main'
              }`}
            >
              <Activity size={13} /> Dehnung <InlineMath math="\varepsilon(z)" />
            </button>
            <button {...alsOption(activeDisplayMode === 'spannung')}
              type="button"
              onClick={() => setActiveDisplayMode('spannung')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDisplayMode === 'spannung'
                  ? 'bg-shiraz text-white shadow-2xs'
                  : 'text-text-main/70 hover:text-text-main'
              }`}
            >
              <Gauge size={13} /> Spannung <InlineMath math="\sigma(z)" />
            </button>
            <button {...alsOption(activeDisplayMode === 'superposition')}
              type="button"
              onClick={() => setActiveDisplayMode('superposition')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDisplayMode === 'superposition'
                  ? 'bg-shiraz text-white shadow-2xs'
                  : 'text-text-main/70 hover:text-text-main'
              }`}
            >
              <Layers size={13} /><MdText text={inhalt.texte.superpositionNMP} /></button>
          </AuswahlGruppe>
        </div>

        {/* DER ZENTRALE MANUELLE SCHIEBEREGLER: VORSPANNKRAFT P */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-shiraz" />
              <span id={vorspannId} className="text-sm font-bold text-slate-900"><MdText text={inhalt.texte.vorspannkraftPManuellEinstellen} /></span>
              <span className="font-mono text-base font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded border border-shiraz/20">
                {formatDeZahl(prestressForce, 0)} kN
              </span>
              <span className="text-xs text-slate-500 font-mono">
                (σ_N = {formatDeZahl(calc.sigma_N, 2)} MPa, ε_N = {formatDeZahl(calc.eps_N, 3)} ‰)
              </span>
            </div>
            <div className="text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200"><MdText text={inhalt.texte.ausnutzungSigmaPSigma} /><strong>{formatDeZahl((prestressForce / 2720) * 100, 0)} %</strong><MdText text={inhalt.texte.bei14LitzenY1860} /></div>
          </div>

          {/* Der interaktive Schieberegler */}
          <div className="space-y-1">
            <input
              type="range"
              aria-labelledby={vorspannId}
              min="0"
              max="3000"
              step="10"
              value={prestressForce}
              onChange={(e) => setPrestressForce(Number(e.target.value))}
              className="w-full accent-shiraz cursor-pointer h-3 bg-slate-200 rounded-lg transition-all"
            />
            {/* Skalen-Ticks */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
              <span>0 kN</span>
              <span>500 kN</span>
              <span>1000 kN</span>
              <span>1500 kN</span>
              <span>2000 kN</span>
              <span>2500 kN</span>
              <span>3000 kN</span>
            </div>
          </div>

          {/* MEILENSTEIN-SCHNELLWAHL-BUTTONS */}
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-bold self-center mr-1"><MdText text={inhalt.texte.grenzzuständeDirektAnspringen} /></span>
            <button
              type="button"
              onClick={() => handleJumpTo(0)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                prestressForce === 0
                  ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            ><MdText text={inhalt.texte.t1P0Kn} /></button>
            <button
              type="button"
              onClick={() => handleJumpTo(calc.P_cr)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                Math.abs(prestressForce - calc.P_cr) < 30
                  ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                  : 'bg-red-50 hover:bg-red-100 text-red-800 border-red-300'
              }`}
            >
              2. P_cr = {formatDeZahl(calc.P_cr, 0)}<MdText text={inhalt.texte.knRissgrenze} /></button>
            <button
              type="button"
              onClick={() => handleJumpTo(calc.P_dek)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                Math.abs(prestressForce - calc.P_dek) < 30
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              3. P_dek = {formatDeZahl(calc.P_dek, 0)}<MdText text={inhalt.texte.knDekompressionspunkt} /></button>
            {tendonTrajectory === 'parabolic' && (
              <button
                type="button"
                onClick={() => handleJumpTo(calc.P_bal)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  Math.abs(prestressForce - calc.P_bal) < 30
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-300'
                }`}
              >
                4. P_bal = {formatDeZahl(calc.P_bal, 0)}<MdText text={inhalt.texte.knLastausgleichW0} /></button>
            )}
            <button
              type="button"
              onClick={() => handleJumpTo(2400)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                prestressForce === 2400
                  ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-300'
              }`}
            ><MdText text={inhalt.texte.t5P2400} /></button>
          </div>
        </div>

        {/* NEBENPARAMETER: MANUELLE SCHIEBEREGLER FÜR LAST q & EXZENTRIZITÄT ep */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between text-slate-700 font-semibold mb-1">
              <span><MdText text={inhalt.texte.zusatzlastQOhneEigengewicht} /></span>
              <span className="font-mono text-slate-900 font-bold">{formatDeZahl(loadQ, 0)} kN/m</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={loadQ}
              onChange={(e) => setLoadQ(Number(e.target.value))}
              className="w-full accent-slate-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span><MdText text={inhalt.texte.t0KnMNur} /></span>
              <span><MdText text={inhalt.texte.gesamtmomentMKG} />{formatDeZahl(calc.Mq_mid, 0)} kNm</span>
              <span>50 kN/m</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between text-slate-700 font-semibold mb-1">
              <span>
                {tendonTrajectory === 'centric' 
                  ? inhalt.werte.exzentrizitätEPZentrisch 
                  : tendonTrajectory === 'parabolic'
                  ? inhalt.werte.parabelstichFTiefpunktFeldmitte
                  : inhalt.werte.spanngliedabstandEPUnten}
              </span>
              <span className="font-mono text-slate-900 font-bold">
                {tendonTrajectory === 'centric' ? '0 mm' : `${formatDeZahl(eccentricity, 0)} mm`}
              </span>
            </div>
            <input
              type="range"
              min="150"
              max="380"
              step="10"
              value={eccentricity}
              disabled={tendonTrajectory === 'centric'}
              onChange={(e) => setEccentricity(Number(e.target.value))}
              className={`w-full cursor-pointer h-1.5 rounded-lg ${
                tendonTrajectory === 'centric' ? 'bg-slate-100 accent-slate-300 opacity-50' : 'bg-slate-200 accent-slate-600'
              }`}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span>150 mm</span>
              <span><MdText text={inhalt.texte.kernweiteKU167} /></span>
              <span><MdText text={inhalt.texte.t380MmMaxBetondeckung} /></span>
            </div>
          </div>
        </div>
      </div>

      {/* HAUPTSTUFE: 2 VISUELLE ANALYSE-FELDER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LINKER BEREICH: EINFELDTRÄGER IM LÄNGSSCHNITT (SPAN 6) */}
        <div className="lg:col-span-6 bg-slate-50 p-4 rounded-xl border border-slate-200/90 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-700" /><MdText text={inhalt.texte.t1LängsschnittSpanngliedführungLastwirkun} /></span>
            <span className="font-mono text-[11px] font-bold text-slate-600">
              L = {formatDeZahl(L, 1)}<MdText text={inhalt.texte.mQuerschnitt5001} /></span>
          </div>

          {/* SVG LÄNGSSCHNITT DES EINFELDTRÄGERS */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <svg viewBox="0 0 620 155" className="w-full h-48">
              <defs>
                <marker id="arrowUpGreen" viewBox="0 0 10 10" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 6 L 5 0 L 10 6 z" fill="#059669" />
                </marker>
                <marker id="arrowDownDark" viewBox="0 0 10 10" refX="5" refY="7" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 0 0 L 5 6 L 10 0 z" fill="#64748b" />
                </marker>
              </defs>

              {/* Äußere Streckenlast q Pfeile oben */}
              {loadQ > 0 ? (
                <>
                  {[60, 120, 180, 240, 310, 380, 440, 500, 560].map((xPos) => (
                    <line
                      key={xPos}
                      x1={xPos}
                      y1={8}
                      x2={xPos}
                      y2={22}
                      stroke="#94a3b8"
                      strokeWidth="1.2"
                      markerEnd="url(#arrowDownDark)"
                    />
                  ))}
                  <text x="310" y="8" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">
                    Gleichlast q = {formatDeZahl(loadQ, 0)} kN/m
                  </text>
                </>
              ) : (
                <text x="310" y="14" textAnchor="middle" fontSize="9.5" fill="#94a3b8" fontStyle="italic">
                  q = 0 kN/m (Keine äußere Last – reine Wirkung der Vorspannung)
                </text>
              )}

              {/* Träger-Ober- und Unterkante (deformiert gemäß Biegelinie) */}
              <path
                d={`M 30,${24 + beamDeflectPx * 0.4} 
                    Q 310,${24 + beamDeflectPx} 590,${24 + beamDeflectPx * 0.4} 
                    L 590,${66 + beamDeflectPx * 0.4} 
                    Q 310,${66 + beamDeflectPx} 30,${66 + beamDeflectPx * 0.4} Z`}
                fill="#f1f5f9"
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Neutrale Schwerpunktachse (gestrichelt) */}
              <path
                d={`M 30,${45 + beamDeflectPx * 0.4} Q 310,${45 + beamDeflectPx} 590,${45 + beamDeflectPx * 0.4}`}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="4 3"
              />

              {/* DYNAMISCHE SPANNGLIEDFÜHRUNG JE NACH TYP */}
              {tendonTrajectory === 'centric' && (
                /* a) Zentrisch: Genau auf Schwerpunktachse */
                <>
                  <path
                    d={`M 30,${45 + beamDeflectPx * 0.4} Q 310,${45 + beamDeflectPx} 590,${45 + beamDeflectPx * 0.4}`}
                    fill="none"
                    stroke="#A3113E"
                    strokeWidth="3.0"
                  />
                  {/* Endanker mittig */}
                  <rect x="23" y={41 + beamDeflectPx * 0.4} width="7" height="9" fill="#1e293b" rx="1" />
                  <rect x="590" y={41 + beamDeflectPx * 0.4} width="7" height="9" fill="#1e293b" rx="1" />
                  <text x="310" y={45 + beamDeflectPx - 6} textAnchor="middle" fontSize="8.5" fill="#A3113E" fontWeight="bold">
                    Zentrisches Spannglied (e_p = 0, u = 0, reine Längskraft)
                  </text>
                </>
              )}

              {tendonTrajectory === 'straight_bottom' && (
                /* b) Gerade unten: Konstant exzentrisch */
                <>
                  {(() => {
                    const offsetPx = (eccentricity / 1000) * 45;
                    const yTendonLeft = 45 + offsetPx + beamDeflectPx * 0.4;
                    const yTendonMid = 45 + offsetPx + beamDeflectPx;
                    const yTendonRight = 45 + offsetPx + beamDeflectPx * 0.4;
                    return (
                      <>
                        <path
                          d={`M 30,${yTendonLeft} Q 310,${yTendonMid} 590,${yTendonRight}`}
                          fill="none"
                          stroke="#A3113E"
                          strokeWidth="3.0"
                        />
                        {/* Endanker unten */}
                        <rect x="23" y={yTendonLeft - 4} width="7" height="9" fill="#1e293b" rx="1" />
                        <rect x="590" y={yTendonRight - 4} width="7" height="9" fill="#1e293b" rx="1" />
                        <text x="310" y={yTendonMid - 6} textAnchor="middle" fontSize="8.5" fill="#A3113E" fontWeight="bold">
                          Gerades Spannglied unten (e_p = {formatDeZahl(eccentricity, 0)} mm = konst.)
                        </text>
                      </>
                    );
                  })()}
                </>
              )}

              {tendonTrajectory === 'parabolic' && (
                /* c) Parabolisch: Folgt der Momentenlinie */
                <>
                  {(() => {
                    const offsetPx = (eccentricity / 1000) * 45;
                    const tendonCenterY = 45 + offsetPx + beamDeflectPx;
                    return (
                      <>
                        <path
                          d={`M 30,${45 + beamDeflectPx * 0.4} Q 310,${tendonCenterY} 590,${45 + beamDeflectPx * 0.4}`}
                          fill="none"
                          stroke="#A3113E"
                          strokeWidth="2.8"
                        />
                        {/* Endanker mittig */}
                        <rect x="23" y={41 + beamDeflectPx * 0.4} width="7" height="9" fill="#1e293b" rx="1" />
                        <rect x="590" y={41 + beamDeflectPx * 0.4} width="7" height="9" fill="#1e293b" rx="1" />

                        {/* Umlenkkräfte u nach oben (grüne Pfeile) */}
                        {prestressForce > 200 && (
                          <>
                            {[170, 240, 310, 380, 450].map((xPos) => {
                              const arrowLen = Math.min(22, (prestressForce / 3000) * 22);
                              const localY = 45 + offsetPx * (1 - Math.pow((xPos - 310) / 280, 2)) + beamDeflectPx;
                              return (
                                <g key={xPos}>
                                  <line
                                    x1={xPos}
                                    y1={localY + 4}
                                    x2={xPos}
                                    y2={localY - arrowLen}
                                    stroke="#059669"
                                    strokeWidth="1.8"
                                    markerEnd="url(#arrowUpGreen)"
                                  />
                                </g>
                              );
                            })}
                            <text x="310" y={beamCenterY - 12} textAnchor="middle" fontSize="9" fill="#059669" fontWeight="bold">
                              Umlenkkräfte u = {formatDeZahl(calc.u_kN_m, 1)} kN/m ↑ (Lastausgleich)
                            </text>
                          </>
                        )}
                      </>
                    );
                  })()}
                </>
              )}

              {/* Auflager links (fest) */}
              <polygon points="30,75 20,95 40,95" fill="#94a3b8" />
              <line x1="15" y1="95" x2="45" y2="95" stroke="#64748b" strokeWidth="2" />

              {/* Auflager rechts (verschiebbar) */}
              <polygon points="590,75 580,95 600,95" fill="#94a3b8" />
              <circle cx="585" cy="99" r="3.5" fill="#64748b" />
              <circle cx="595" cy="99" r="3.5" fill="#64748b" />
              <line x1="575" y1="104" x2="605" y2="104" stroke="#64748b" strokeWidth="2" />

              {/* WARNUNG: Kopfzugrisse am Auflager bei gerader Lage unten */}
              {tendonTrajectory === 'straight_bottom' && calc.hasSupportHeadCracks && (
                <g>
                  {/* Risse oben links */}
                  <line x1="38" y1="24" x2="38" y2="38" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 1" />
                  <line x1="48" y1="24" x2="48" y2="35" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="3 1" />
                  {/* Risse oben rechts */}
                  <line x1="582" y1="24" x2="582" y2="38" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 1" />
                  <line x1="572" y1="24" x2="572" y2="35" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="3 1" />
                  <text x="310" y="140" textAnchor="middle" fontSize="9.5" fill="#dc2626" fontWeight="bold">
                    ⚠️ Unzulässige Kopfzugrisse an den Trägerenden! σ_o(Auflager) = +{formatDeZahl(calc.sigma_top_support, 1)} MPa &gt; {formatDeZahl(fctm, 1)} MPa
                  </text>
                </g>
              )}

              {/* Risse in Feldmitte, wenn sigma_bot > fctm */}
              {calc.sigma_bot > fctm && !calc.hasSupportHeadCracks && (
                <g>
                  {[-40, -20, 0, 20, 40].map((offset) => {
                    const crackHeight = Math.min(22, (calc.sigma_bot - fctm) * 2.5);
                    const crackBaseY = 66 + beamDeflectPx;
                    return (
                      <line
                        key={offset}
                        x1={310 + offset}
                        y1={crackBaseY}
                        x2={310 + offset}
                        y2={crackBaseY - crackHeight}
                        stroke="#dc2626"
                        strokeWidth="1.8"
                        strokeDasharray="2 1"
                      />
                    );
                  })}
                  <text x="310" y="125" textAnchor="middle" fontSize="9" fill="#dc2626" fontWeight="bold">
                    Zugrisse im Beton (Zustand II)! Betonzugfestigkeit überschritten ({formatDeZahl(calc.sigma_bot, 1)} &gt; {formatDeZahl(fctm, 1)} MPa)
                  </text>
                </g>
              )}

              {/* Rissfrei-Anzeige bei voller Überdrückung */}
              {calc.sigma_bot <= 0 && calc.sigma_top <= 0 && !calc.hasSupportHeadCracks && (
                <text x="310" y="125" textAnchor="middle" fontSize="9.5" fill="#059669" fontWeight="bold">
                  ✓ Voll überdrückt (Zustand I): σ_o ≤ 0 und σ_u ≤ 0.
                </text>
              )}
            </svg>
          </div>

          {/* KPI-LEISTE DES TRÄGERS */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.nettoMomentFeld} /></span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {formatDeZahl(calc.Mnet_mid, 0)} kNm
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                (M_q = {formatDeZahl(calc.Mq_mid, 0)}, M_p = {formatDeZahl(calc.Mp_mid, 0)})
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.biegelinieFeldmitte} /></span>
              <span className={`font-mono font-bold text-sm flex items-center justify-center gap-1 ${
                calc.w_net_mm > 0 ? 'text-amber-800' : 'text-purple-800'
              }`}>
                {calc.w_net_mm > 0 ? (
                  <>
                    <ArrowDown size={14} className="text-amber-600" />
                    +{formatDeZahl(calc.w_net_mm, 1)} mm
                  </>
                ) : (
                  <>
                    <ArrowUp size={14} className="text-purple-600" />
                    {formatDeZahl(calc.w_net_mm, 1)}<MdText text={inhalt.texte.mmÜberhöhung} /></>
                )}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {Math.abs(calc.w_net_mm) < 1.0 ? inhalt.werte.exaktHorizontal : calc.w_net_mm > 0 ? inhalt.werte.durchbiegung : inhalt.werte.überhöhung}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                {viewSection === 'midspan' ? inhalt.werte.unterrandUFeld : inhalt.werte.oberrandOAuflager}
              </span>
              <span className={`font-mono font-bold text-sm ${
                (viewSection === 'midspan' ? calc.sigma_bot : calc.sigma_top) > fctm ? 'text-red-600' :
                (viewSection === 'midspan' ? calc.sigma_bot : calc.sigma_top) > 0 ? 'text-amber-600' : 'text-emerald-700'
              }`}>
                {viewSection === 'midspan'
                  ? (calc.sigma_bot > 0 ? `+${formatDeZahl(calc.sigma_bot, 2)}` : formatDeZahl(calc.sigma_bot, 2))
                  : (calc.sigma_top > 0 ? `+${formatDeZahl(calc.sigma_top, 2)}` : formatDeZahl(calc.sigma_top, 2))} MPa
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {(viewSection === 'midspan' ? calc.sigma_bot : calc.sigma_top) > 0 ? 'Zugspannung' : 'Druckspannung'}
              </span>
            </div>
          </div>
        </div>

        {/* RECHTER BEREICH: QUERSCHNITT & DYNAMISCHES DEHNUNGSDIAGRAMM (SPAN 6) */}
        <div className="lg:col-span-6 bg-slate-50 p-4 rounded-xl border border-slate-200/90 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-shiraz" /><MdText text={inhalt.texte.t2QuerschnittsschnittBetrachten} /></span>

            {/* Toggle Feldmitte vs. Auflager */}
            <AuswahlGruppe label="Querschnitt" className="flex items-center bg-white p-0.5 rounded-lg border border-slate-300">
              <button {...alsOption(viewSection === 'midspan')}
                type="button"
                onClick={() => setViewSection('midspan')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  viewSection === 'midspan'
                    ? 'bg-shiraz text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              ><MdText text={inhalt.texte.feldmitteXL2} /></button>
              <button {...alsOption(viewSection === 'support')}
                type="button"
                onClick={() => setViewSection('support')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  viewSection === 'support'
                    ? 'bg-shiraz text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              ><MdText text={inhalt.texte.auflagerX0} /></button>
            </AuswahlGruppe>
          </div>

          {/* SVG DEHNUNGS- UND SPANNUNGSDIAGRAMM */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            {activeDisplayMode === 'dehnung' && (
              <svg viewBox="0 0 470 260" className="w-full h-56">
                {/* 1. Querschnitt-Körper links (Breite b, Höhe h) */}
                <g transform="translate(15, 0)">
                  <rect x="0" y={topY} width="55" height={botY - topY} fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" rx="2" />
                  {/* Schwerachse z = 0 */}
                  <line x1="-5" y1={midY} x2="60" y2={midY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
                  <text x="63" y={midY + 3} fontSize="8" fill="#94a3b8" fontStyle="italic">z = 0</text>
                  {/* Spannglied-Kabel im Querschnitt */}
                  <circle cx="27" cy={tendonY} r="5" fill="#A3113E" stroke="#1e293b" strokeWidth="1.5" />
                  <line x1="-5" y1={tendonY} x2="60" y2={tendonY} stroke="#A3113E" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="63" y={tendonY + 3} fontSize="8" fill="#A3113E" fontWeight="bold">
                    e_p = {formatDeZahl(calc.activeEp, 0)}
                  </text>
                  {/* Maßketten */}
                  <text x="27" y={topY - 8} textAnchor="middle" fontSize="8" fill="#64748b">b = 500</text>
                  <line x1="0" y1={topY - 4} x2="55" y2={topY - 4} stroke="#cbd5e1" strokeWidth="1" />
                  <text x="-4" y={midY} textAnchor="middle" fontSize="8" fill="#64748b" transform={`rotate(-90 -4 ${midY})`}>h = 1000</text>
                </g>

                {/* 2. Dehnungs-Koordinatensystem */}
                <line x1={zeroX} y1={topY - 12} x2={zeroX} y2={botY + 20} stroke="#475569" strokeWidth="1.5" />
                <text x={zeroX} y={topY - 16} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">
                  ε = 0 ‰ (Nulllinie)
                </text>

                <line x1="90" y1={topY} x2="430" y2={topY} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="90" y1={botY} x2="430" y2={botY} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 2" />

                {/* Promille-Gitterlinien vertikal: -1.0‰, -0.5‰, +0.5‰ */}
                {[-1.0, -0.5, 0.5].map((gridVal) => {
                  const gx = zeroX + gridVal * scaleEps;
                  return (
                    <g key={gridVal}>
                      <line x1={gx} y1={topY} x2={gx} y2={botY} stroke="#f1f5f9" strokeWidth="1" />
                      <text x={gx} y={botY + 16} textAnchor="middle" fontSize="8" fill="#94a3b8">
                        {gridVal > 0 ? `+${formatDeWert(gridVal)}` : gridVal} ‰
                      </text>
                    </g>
                  );
                })}

                {/* 3. FLÄCHEN-SCHATTIERUNG DER DEHNUNGSVERTEILUNG */}
                {calc.eps_top < 0 && (
                  <polygon
                    points={
                      calc.eps_bot < 0
                        ? `${zeroX},${topY} ${topEpsX},${topY} ${botEpsX},${botY} ${zeroX},${botY}`
                        : `${zeroX},${topY} ${topEpsX},${topY} ${zeroX},${neutralY}`
                    }
                    fill="rgba(163, 17, 62, 0.18)"
                  />
                )}

                {calc.eps_bot > 0 && (
                  <polygon
                    points={`${zeroX},${neutralY} ${botEpsX},${botY} ${zeroX},${botY}`}
                    fill="rgba(239, 68, 68, 0.25)"
                  />
                )}

                {/* 4. DIE DYNAMISCHE DEHNUNGSGERADE */}
                <line
                  x1={topEpsX}
                  y1={topY}
                  x2={botEpsX}
                  y2={botY}
                  stroke="#A3113E"
                  strokeWidth="2.8"
                />

                {/* Oberrand-Dehnungspunkt */}
                <circle cx={topEpsX} cy={topY} r="4" fill="#A3113E" stroke="#ffffff" strokeWidth="1.5" />
                <line x1={zeroX} y1={topY} x2={topEpsX} y2={topY} stroke="#A3113E" strokeWidth="1.5" />
                <text x={topEpsX - 8} y={topY - 4} textAnchor="end" fontSize="9.5" fontWeight="bold" fill="#A3113E">
                  ε_o = {formatDeZahl(calc.eps_top, 3)} ‰ {calc.eps_top < 0 ? '(Druck)' : '(Zug!)'}
                </text>

                {/* Unterrand-Dehnungspunkt */}
                <circle cx={botEpsX} cy={botY} r="4" fill={calc.eps_bot > 0 ? '#dc2626' : '#059669'} stroke="#ffffff" strokeWidth="1.5" />
                <line x1={zeroX} y1={botY} x2={botEpsX} y2={botY} stroke={calc.eps_bot > 0 ? '#dc2626' : '#059669'} strokeWidth="1.5" />
                <text
                  x={botEpsX + (calc.eps_bot > 0 ? 8 : -8)}
                  y={botY + 5}
                  textAnchor={calc.eps_bot > 0 ? 'start' : 'end'}
                  fontSize="9.5"
                  fontWeight="bold"
                  fill={calc.eps_bot > 0 ? '#dc2626' : '#059669'}
                >
                  ε_u = {calc.eps_bot > 0 ? `+${formatDeZahl(calc.eps_bot, 3)}` : formatDeZahl(calc.eps_bot, 3)} ‰
                  {calc.eps_bot > 0 ? ' (Zug!)' : ' (Druck)'}
                </text>

                {/* Spanngliedebene Dehnungspunkt */}
                <circle cx={tendonEpsX} cy={tendonY} r="3" fill="#1e293b" />
                <text x={tendonEpsX + 8} y={tendonY + 3} fontSize="8" fill="#1e293b" fontStyle="italic">
                  ε_c(z_p) = {formatDeZahl(calc.eps_tendon, 3)} ‰
                </text>

                {/* Nulldurchgang / Neutrale Faser */}
                {calc.eps_top < 0 && calc.eps_bot > 0 && (
                  <g>
                    <line x1="90" y1={neutralY} x2="380" y2={neutralY} stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
                    <circle cx={zeroX} cy={neutralY} r="3.5" fill="#dc2626" />
                    <text x={zeroX + 8} y={neutralY - 3} fontSize="8.5" fill="#dc2626" fontWeight="bold">
                      Nulllinie: x = {formatDeZahl(calc.neutralAxisDepth, 0)} mm von Oberkante
                    </text>
                  </g>
                )}

                {/* Volle Überdrückung Hinweistext */}
                {calc.eps_bot <= 0 && calc.eps_top <= 0 && (
                  <g>
                    <rect x="280" y={midY - 14} width="175" height="28" fill="#f0fdf4" stroke="#86efac" rx="6" />
                    <text x="367" y={midY + 4} textAnchor="middle" fontSize="8.5" fill="#166534" fontWeight="bold">
                      Keine Zugdehnung im Querschnitt!
                    </text>
                  </g>
                )}
              </svg>
            )}

            {/* MODUS 2: SPANNUNGSVERTEILUNG σ(z) */}
            {activeDisplayMode === 'spannung' && (
              <svg viewBox="0 0 470 260" className="w-full h-56">
                <line x1={zeroX} y1={topY - 12} x2={zeroX} y2={botY + 20} stroke="#475569" strokeWidth="1.5" />
                <text x={zeroX} y={topY - 16} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">
                  σ = 0 MPa (Spannungsnulllinie)
                </text>

                {(() => {
                  const scaleSig = 4.5;
                  const topSigX = zeroX + calc.sigma_top * scaleSig;
                  const botSigX = zeroX + calc.sigma_bot * scaleSig;
                  const crSigX = zeroX + fctm * scaleSig;

                  return (
                    <>
                      {/* Betonzugfestigkeitslinie fctm */}
                      <line x1={crSigX} y1={topY} x2={crSigX} y2={botY} stroke="#f87171" strokeWidth="1" strokeDasharray="3 3" />
                      <text x={crSigX + 4} y={topY + 14} fontSize="8" fill="#dc2626">f_ctm,fl = {formatDeZahl(fctm, 1)} MPa</text>

                      {/* Druckflächenfüllung */}
                      <polygon
                        points={`${zeroX},${topY} ${topSigX},${topY} ${botSigX < zeroX ? botSigX : zeroX},${botSigX < zeroX ? botY : neutralY} ${zeroX},${botSigX < zeroX ? botY : neutralY}`}
                        fill="rgba(5, 150, 105, 0.18)"
                      />

                      {/* Zugflächenfüllung */}
                      {calc.sigma_bot > 0 && (
                        <polygon
                          points={`${zeroX},${neutralY} ${botSigX},${botY} ${zeroX},${botY}`}
                          fill="rgba(239, 68, 68, 0.25)"
                        />
                      )}

                      {/* Spannungsgerade */}
                      <line x1={topSigX} y1={topY} x2={botSigX} y2={botY} stroke="#059669" strokeWidth="2.8" />
                      <circle cx={topSigX} cy={topY} r="4" fill="#059669" />
                      <circle cx={botSigX} cy={botY} r="4" fill={calc.sigma_bot > 0 ? '#dc2626' : '#059669'} />

                      <text x={topSigX - 8} y={topY - 4} textAnchor="end" fontSize="9.5" fontWeight="bold" fill={calc.sigma_top > 0 ? '#dc2626' : '#059669'}>
                        σ_o = {calc.sigma_top > 0 ? `+${formatDeZahl(calc.sigma_top, 2)}` : formatDeZahl(calc.sigma_top, 2)} MPa {calc.sigma_top > 0 ? '(Zug!)' : '(Druck)'}
                      </text>
                      <text
                        x={botSigX + (calc.sigma_bot > 0 ? 8 : -8)}
                        y={botY + 5}
                        textAnchor={calc.sigma_bot > 0 ? 'start' : 'end'}
                        fontSize="9.5"
                        fontWeight="bold"
                        fill={calc.sigma_bot > fctm ? '#dc2626' : calc.sigma_bot > 0 ? '#d97706' : '#059669'}
                      >
                        σ_u = {calc.sigma_bot > 0 ? `+${formatDeZahl(calc.sigma_bot, 2)}` : formatDeZahl(calc.sigma_bot, 2)} MPa
                      </text>
                    </>
                  );
                })()}
              </svg>
            )}

            {/* MODUS 3: SUPERPOSITION */}
            {activeDisplayMode === 'superposition' && (
              <div className="grid grid-cols-4 gap-2 text-center text-xs py-2">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 block"><MdText text={inhalt.texte.t1LängskraftP} /></span>
                  <div className="text-xs font-mono font-bold text-shiraz">
                    σ_N = {formatDeZahl(calc.sigma_N, 1)} MPa
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    ε_N = {formatDeZahl(calc.eps_N, 3)} ‰
                  </div>
                  <span className="text-[9px] text-slate-400 block"><MdText text={inhalt.texte.zentrischerDruckÜberGesamten} /></span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 block"><MdText text={inhalt.texte.t2VormomentMP} /></span>
                  <div className="text-xs font-mono font-bold text-purple-700">
                    M_p = {formatDeZahl(calc.Mp, 0)} kNm
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    σ_Mp = {formatDeZahl(calc.sigma_Mp, 1)} MPa
                  </div>
                  <span className="text-[9px] text-slate-400 block">
                    {tendonTrajectory === 'centric' ? inhalt.werte.keinVormomentEp0 : inhalt.werte.gegenkrümmungDurchExzentrizität}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 block"><MdText text={inhalt.texte.t3LastmomentMQ} /></span>
                  <div className="text-xs font-mono font-bold text-slate-800">
                    M_q = +{formatDeZahl(calc.Mq, 0)} kNm
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    σ_Mq = {formatDeZahl(calc.sigma_Mq, 1)} MPa
                  </div>
                  <span className="text-[9px] text-slate-400 block">
                    {viewSection === 'support' ? inhalt.werte.amAuflagerMQ : inhalt.werte.biegemomentAusGleichlastQ}
                  </span>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-300 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-900 block"><MdText text={inhalt.texte.resultierende} /></span>
                  <div className="text-xs font-mono font-bold text-emerald-800">
                    σ_u = {formatDeZahl(calc.sigma_bot, 2)} MPa
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono">
                    ε_u = {formatDeZahl(calc.eps_bot, 3)} ‰
                  </div>
                  <span className="text-[9px] text-emerald-600 font-bold block">
                    {calc.sigma_bot <= 0 ? inhalt.werte.vollÜberdrückt : inhalt.werte.zugAmUnterrand}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* DETAIL-KENNZAHLEN DES QUERSCHNITTS */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.oberrandDehnungO} /></span>
              <span className="font-mono font-bold text-shiraz text-sm">
                {formatDeZahl(calc.eps_top, 3)} ‰
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                (σ_o = {formatDeZahl(calc.sigma_top, 1)} MPa)
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.unterrandDehnungU} /></span>
              <span className={`font-mono font-bold text-sm ${
                calc.eps_bot > 0 ? 'text-red-600' : 'text-emerald-700'
              }`}>
                {calc.eps_bot > 0 ? `+${formatDeZahl(calc.eps_bot, 3)}` : formatDeZahl(calc.eps_bot, 3)} ‰
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {calc.eps_bot <= 0 ? inhalt.werte.vollÜberdrückt2 : 'Zugdehnung'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.nulllinieTiefeX} /></span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                {calc.sigma_top <= 0 && calc.sigma_bot <= 0
                  ? inhalt.werte.außerhalbVollÜberdrückt
                  : calc.sigma_top > 0 && calc.sigma_bot > 0
                  ? inhalt.werte.außerhalbVollzug
                  : `${formatDeZahl(calc.neutralAxisDepth, 0)} mm`}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {calc.sigma_top <= 0 && calc.sigma_bot <= 0
                  ? inhalt.werte.t100Druckzone
                  : calc.sigma_top > 0 && calc.sigma_bot <= 0
                  ? `${formatDeZahl(Math.max(0, Math.min(100, (1 - calc.neutralAxisDepth / h) * 100)), 0)}% Druckzone (unten)`
                  : `${formatDeZahl(Math.max(0, Math.min(100, (calc.neutralAxisDepth / h) * 100)), 0)}% Druckzone (oben)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DIDAKTISCHE SCHLÜSSELERKENNTNISSE NACH DIN EN 1992-1-1 */}
      <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Sparkles className="text-shiraz h-4 w-4" /><MdText text={inhalt.texte.tragwerksmechanischerVergleichDer3} /></h4>
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-[11px] text-shiraz font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            {showExplanation ? inhalt.werte.erläuterungEinklappen : inhalt.werte.erläuterungAusklappen}
          </button>
        </div>

        {showExplanation && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-slate-700 pt-1">
            <div className={`p-3 bg-white rounded-lg border space-y-1.5 ${tendonTrajectory === 'centric' ? 'border-shiraz shadow-xs' : 'border-slate-200'}`}>
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-600" /><MdText text={inhalt.texte.aZentrischInSchwerachse2} /></span>
              <p><MdText text={inhalt.texte.prinzipEP0} /></p>
              <p className="text-[11px] text-slate-500"><MdText text={inhalt.texte.einsatzgebietReineZuggliederZ} /></p>
            </div>

            <div className={`p-3 bg-white rounded-lg border space-y-1.5 ${tendonTrajectory === 'straight_bottom' ? 'border-shiraz shadow-xs' : 'border-slate-200'}`}>
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" /><MdText text={inhalt.texte.bGeradeUntenAbstand2} /></span>
              <p><MdText text={inhalt.texte.prinzipEPText} /></p>
              <p className="text-[11px] text-red-800"><MdText text={inhalt.texte.auflagerproblemDaAmAuflager} /></p>
            </div>

            <div className={`p-3 bg-white rounded-lg border space-y-1.5 ${tendonTrajectory === 'parabolic' ? 'border-shiraz shadow-xs' : 'border-slate-200'}`}>
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" /><MdText text={inhalt.texte.cParabolischMomenteneinwirkung2} /></span>
              <p><MdText text={inhalt.texte.prinzipIdealfallDasKabel} /></p>
              <p className="text-[11px] text-emerald-800"><MdText text={inhalt.texte.lastausgleichDieKontinuierlichenUmlenkkr} /></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
