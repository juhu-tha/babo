import React, { useMemo, useState } from 'react';
import { BookOpen, FlaskConical, TrendingUp, Calculator, ShieldAlert, Info, GraduationCap } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { schnellkarbonatisierung, tiefeNach, type Messpunkt } from '@/src/calc/schnellkarbonatisierung';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { LebensdauerUebernehmen } from '@/src/components/ui/LebensdauerUebernehmen';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/schnellkarbonatisierung/Schnellkarbonatisierung.json';
import { MdText } from '@/src/components/inhalt/MdText';

type Reiter = 'grundlagen' | 'pruefung' | 'auswertung' | 'rechner' | 'grenzen';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'grundlagen', label: 'Grundlagen', icon: BookOpen },
  { id: 'pruefung', label: 'Prüfverfahren', icon: FlaskConical },
  { id: 'auswertung', label: inhalt.werte.auswertungUmrechnung, icon: TrendingUp },
  { id: 'rechner', label: inhalt.werte.rechnerKAcPrognose, icon: Calculator },
  { id: 'grenzen', label: 'Grenzen', icon: ShieldAlert },
];

const karte = 'bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30';
const kasten = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const th = 'p-2.5 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2.5 text-xs text-text-main/85 border-b border-home-grau/15 align-top';

const ZEITEN = [0, 7, 28, 70];

/** Beispiel-Messreihen (Lehrwerte, keine Prüfergebnisse realer Betone) */
const REIHEN: { id: string; name: string; x: number[] }[] = inhalt.daten.REIHEN;

/** Mindestbetondeckung c_min,dur für Betonstahl nach DIN EN 1992-1-1/NA, Tab. 4.4DE (Auszug) */
const DECKUNGEN = [
  { id: 'XC1', c: 10 }, { id: 'XC2', c: 20 }, { id: 'XC3', c: 20 }, { id: 'XC4', c: 25 },
] as const;

export default function Schnellkarbonatisierung() {
  const [reiter, setReiter] = useState<Reiter>('grundlagen');
  const [x, setX] = useState<number[]>(REIHEN[0].x);
  const [t, setT] = useState<number[]>(ZEITEN);
  const [aktiv, setAktiv] = useState<boolean[]>([true, true, true, true]);
  const [mitA, setMitA] = useState(true);
  const [cAcc, setCAcc] = useState(3);
  const [cNat, setCNat] = useState(0.04);
  const [deckung, setDeckung] = useState(25);
  const [nutzung, setNutzung] = useState(50);

  const punkte: Messpunkt[] = useMemo(() => t.map((ti, i) => ({ tTage: ti, xMm: x[i] })).filter((_, i) => aktiv[i]), [t, x, aktiv]);
  const erg = useMemo(
    () => schnellkarbonatisierung({ punkte, mitAchsenabschnitt: mitA, cAcc, cNat, deckung, nutzungsdauer: nutzung }),
    [punkte, mitA, cAcc, cNat, deckung, nutzung]
  );

  const zahl = (v: string) => { const z = parseFloat(v); return Number.isFinite(z) ? z : NaN; };
  const tex = (v: number, n: number) => formatDeTeX(v, n);
  const setzeIn = (arr: number[], i: number, v: number) => arr.map((a, j) => (j === i ? v : a));

  // Diagramm 1: x über √t mit Regressionsgerade
  const B = 320, H = 190, L = 40, U = 28, O = 10, R = 10;
  const sMax = Math.max(1, ...punkte.map(p => Math.sqrt(Math.max(p.tTage, 0)))) * 1.08; // Darstellungsfaktor (Achsenreserve)
  const xMax = Math.max(1, ...punkte.map(p => (Number.isFinite(p.xMm) ? p.xMm : 0))) * 1.2;
  const px = (s: number) => L + s / sMax * (B - L - R);
  const py = (v: number) => H - U - v / xMax * (H - U - O);
  // Diagramm 2: Prognose über Jahre
  const tPlot = Math.max(100, nutzung * 1.3);
  const yMax2 = Math.max(deckung * 1.4, erg.gueltig ? tiefeNach(erg.kNat, tPlot) * 1.05 : 1);
  const qx = (j: number) => L + j / tPlot * (B - L - R);
  const qy = (v: number) => H - U - Math.min(v, yMax2) / yMax2 * (H - U - O);
  const kurve = erg.gueltig
    ? Array.from({ length: 41 }, (_, i) => i / 40 * tPlot).map((j, i) => `${i === 0 ? 'M' : 'L'} ${qx(j)} ${qy(tiefeNach(erg.kNat, j))}`).join(' ')
    : '';

  const feld = (wert: number, setze: (v: number) => void, label: string, schritt: string, aus?: boolean) => (
    <input
      type="number"
      step={schritt}
      aria-label={label}
      disabled={aus}
      value={Number.isFinite(wert) ? wert : ''}
      onChange={e => setze(zahl(e.target.value))}
      className={`w-full p-1.5 border border-home-grau/50 rounded-lg bg-white text-sm font-mono focus:outline-none focus:border-shiraz ${aus ? 'opacity-40' : ''}`}
    />
  );
  const eingabe = (label: string, wert: number, setze: (v: number) => void, einheit: string, schritt: string) => (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold text-text-main">{label}</span>
      <span className="flex items-center gap-2">{feld(wert, setze, label, schritt)}<span className="text-xs text-text-main/60 w-14 shrink-0">{einheit}</span></span>
    </label>
  );

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className={`${karte} flex flex-col gap-5`}>
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.schnellkarbonatisierungNachDinEn} /></h2>
          <p className="text-xs text-text-main/50 font-mono mt-1"><MdText text={inhalt.texte.beschleunigtePrüfungDesKarbonatisierungs} /></p>
        </div>

        <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed flex items-start gap-2.5">
          <GraduationCap size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <p><MdText text={inhalt.texte.projekthinweisDerKarbonatisierungswiders} /></p>
        </div>

        <ModuleTabs label={inhalt.werte.bereicheDesModulsSchnellkarbonatisierung} tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
          <div className="pt-5 animate-in fade-in duration-300">
            {/* ───────────── 1. GRUNDLAGEN ───────────── */}
            {reiter === 'grundlagen' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <p><MdText text={inhalt.texte.coAusDerLuft} /></p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                  <BlockMath math="\mathrm{Ca(OH)_2 + CO_2 \xrightarrow{H_2O} CaCO_3 + H_2O}" />
                  <BlockMath math="x_c = \sqrt{\frac{2\,D_{\mathrm{CO_2}}\,c_s}{a}} \cdot \sqrt{t} = K \cdot \sqrt{t}" />
                  <p className="text-[11px] text-text-main/70 text-center">
                    <FormulaText text="Aus dem 1. Fickschen Gesetz: $D_{\mathrm{CO_2}}$ Diffusionskoeffizient des karbonatisierten Betons, $c_s$ CO₂-Konzentration an der Oberfläche, $a$ CO₂-Bindekapazität des Betons. Daraus folgt das Wurzel-t-Gesetz und $K \propto \sqrt{c_s}$." />
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Bindekapazität</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.mehrKlinkerBedeutetMehr} /></p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Dichtheit</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.niedrigerWZWert} /></p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Feuchte</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.amSchnellstenVerläuftDie} /></p>
                  </div>
                </div>
                <Querverweis ziel="korrosion" titel={inhalt.werte.wasNachDerDepassivierung} linkText={inhalt.werte.zumModulBewehrungskorrosion}>
                  <p><MdText text={inhalt.texte.elektrochemieDerBewehrungskorrosionEinle} /></p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 2. PRÜFVERFAHREN ───────────── */}
            {reiter === 'pruefung' && (
              <div className="flex flex-col gap-6">
                <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dinEn1239012} /></p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[620px]">
                    <thead><tr><th className={th}>Schritt</th><th className={th}><MdText text={inhalt.texte.festlegungKernpunkte} /></th><th className={th}>Zweck</th></tr></thead>
                    <tbody>
                      <tr><td className={td}><strong>Probekörper</strong></td><td className={td}><MdText text={inhalt.texte.prismenZB100} /></td><td className={td}><MdText text={inhalt.texte.mehrereSpaltflächenAusEinem} /></td></tr>
                      <tr><td className={td}><strong>Vorlagerung</strong></td><td className={td}><MdText text={inhalt.texte.wasserlagerungBisZumAlter} /></td><td className={td}><MdText text={inhalt.texte.definierteHydratationFeuchteIm} /></td></tr>
                      <tr><td className={td}><MdText text={inhalt.texte.lagerungImPrüfschrank} /></td><td className={td}><MdText text={inhalt.texte.t3005} /></td><td className={td}><MdText text={inhalt.texte.gleichmäßigeBeschleunigteKarbonatisierun} /></td></tr>
                      <tr><td className={td}><strong>Messzeitpunkte</strong></td><td className={td}><MdText text={inhalt.texte.mehrereZeitpunkteWährendDer} /></td><td className={td}><MdText text={inhalt.texte.regressionÜberTStatt} /></td></tr>
                      <tr><td className={td}><strong>Messung</strong></td><td className={td}><MdText text={inhalt.texte.scheibeAbspaltenFrischeBruchfläche} /></td><td className={td}><MdText text={inhalt.texte.mittlereKarbonatisierungstiefeDK} /></td></tr>
                      <tr><td className={td}><strong>Auswertung</strong></td><td className={td}><MdText text={inhalt.texte.lineareRegressionDerTiefen} /></td><td className={td}><MdText text={inhalt.texte.vergleichbarerKennwertDesKarbonatisierun} /></td></tr>
                    </tbody>
                  </table>
                </div>
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Phenolphthalein-Test</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.phenolphthaleinFärbtSichOberhalb} /></p>
                </section>
                <Querverweis ziel="biokohlebeton" titel={inhalt.werte.anwendungsfallNeueBetonrezepturen} linkText={inhalt.werte.zumModulBiokohlebeton}>
                  <p><MdText text={inhalt.texte.beiDunkelGefärbtenBetonen} /></p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 3. AUSWERTUNG & UMRECHNUNG ───────────── */}
            {reiter === 'auswertung' && (
              <div className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.regressionÜberT} /></h3>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                    <BlockMath math="d_k = a + K_{AC} \cdot \sqrt{t}, \qquad K_{AC} = \frac{\sum (s_i - \bar{s})(d_i - \bar{d})}{\sum (s_i - \bar{s})^2}, \quad s_i = \sqrt{t_i}" />
                    <p className="text-[11px] text-text-main/70 text-center">
                      <FormulaText text="$t$ in Tagen Lagerung bei 3 % CO₂, $d_k$ in mm, $K_{AC}$ in mm/√d. Der Achsenabschnitt $a$ erfasst eine Anfangskarbonatisierung aus der Vorlagerung; ohne Nullmessung wird oft durch den Ursprung gerechnet: $K = \sum s_i d_i / \sum s_i^2$." />
                    </p>
                  </div>
                </section>
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.umrechnungAufNatürlicheBedingungen} /></h3>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.nachDemFickschenGesetz} /></p>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                    <BlockMath math="K_{nat} \approx K_{AC} \cdot \sqrt{\frac{c_{nat}}{c_{acc}}} \cdot \sqrt{365} = K_{AC} \cdot \sqrt{\frac{0{,}04}{3{,}0}} \cdot 19{,}1 \approx 2{,}2 \cdot K_{AC}" />
                    <p className="text-[11px] text-text-main/70 text-center">
                      <FormulaText text="$K_{nat}$ in mm/√a, $K_{AC}$ in mm/√d; $c_{nat} \approx 0{,}04$ Vol.-% (400 ppm)." />
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed flex items-start gap-2">
                    <Info size={14} className="text-amber-700 shrink-0 mt-0.5" />
                    <p><MdText text={inhalt.texte.nurEineGrößenordnungDie} /></p>
                  </div>
                </section>
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.prognoseGegenüberDerBetondeckung} /></h3>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                    <BlockMath math="x_c(t) = K_{nat} \cdot \sqrt{t}, \qquad t_c = \left(\frac{c}{K_{nat}}\right)^2" />
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.doppelteDeckungBedeutetDie} /></p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[420px]">
                      <thead><tr><th className={th}>Expositionsklasse</th><th className={th}><MdText text={inhalt.texte.cMinDurBetonstahl} /></th></tr></thead>
                      <tbody>{DECKUNGEN.map(d => <tr key={d.id}><td className={td}>{d.id}</td><td className={td}>{formatDeZahl(d.c, 0)} mm</td></tr>)}</tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {/* ───────────── 4. RECHNER ───────────── */}
            {reiter === 'rechner' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Messwerte</h3>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.beispielreiheLaden} /></span>
                      <select
                        aria-label={inhalt.werte.beispielreiheLaden}
                        defaultValue="a"
                        onChange={e => { const r = REIHEN.find(q => q.id === e.target.value); if (r) { setX(r.x); setT(ZEITEN); setAktiv([true, true, true, true]); } }}
                        className="p-2 border border-home-grau/50 rounded-lg bg-white text-sm focus:outline-none focus:border-shiraz"
                      >
                        {REIHEN.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </label>
                    <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-text-main/70">
                      <span className="col-span-2">nutzen</span><span className="col-span-5">t in Tagen</span><span className="col-span-5">d_k in mm</span>
                    </div>
                    {t.map((ti, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center">
                        <input type="checkbox" aria-label={`Messpunkt ${i + 1} verwenden`} checked={aktiv[i]} onChange={e => setAktiv(aktiv.map((a, j) => (j === i ? e.target.checked : a)))} className="col-span-2 accent-shiraz w-4 h-4" />
                        <span className="col-span-5">{feld(ti, v => setT(setzeIn(t, i, v)), `Lagerungsdauer Messpunkt ${i + 1}`, '1', !aktiv[i])}</span>
                        <span className="col-span-5">{feld(x[i], v => setX(setzeIn(x, i, v)), `Karbonatisierungstiefe Messpunkt ${i + 1}`, '0.1', !aktiv[i])}</span>
                      </div>
                    ))}
                    <label className="flex items-center gap-2 text-xs font-bold text-text-main">
                      <input type="checkbox" checked={mitA} onChange={e => setMitA(e.target.checked)} className="accent-shiraz w-4 h-4" /><MdText text={inhalt.texte.regressionMitAchsenabschnittA} /></label>
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider pt-2"><MdText text={inhalt.texte.umrechnungUndBauteil} /></h3>
                    {eingabe(inhalt.werte.coImPrüfschrankC, cAcc, setCAcc, 'Vol.-%', '0.1')}
                    {eingabe(inhalt.werte.coNatürlichCNat, cNat, setCNat, 'Vol.-%', '0.01')}
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.betondeckungCVorgabeC} /></span>
                      <select
                        aria-label={inhalt.werte.vorgabeBetondeckung}
                        value=""
                        onChange={e => { const d = DECKUNGEN.find(q => q.id === e.target.value); if (d) setDeckung(d.c); }}
                        className="p-2 border border-home-grau/50 rounded-lg bg-white text-sm focus:outline-none focus:border-shiraz"
                      >
                        <option value="" disabled>Expositionsklasse wählen …</option>
                        {DECKUNGEN.map(d => <option key={d.id} value={d.id}>{d.id}: {formatDeZahl(d.c, 0)} mm</option>)}
                      </select>
                    </label>
                    {eingabe(inhalt.werte.betondeckungC, deckung, setDeckung, 'mm', '1')}
                    {eingabe(inhalt.werte.nutzungsdauerTN, nutzung, setNutzung, 'Jahre', '5')}
                  </div>
                  <EingabeHinweise hinweise={erg.hinweise} />
                </div>

                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { l: inhalt.werte.kAcPrüfung, w: formatDeZahl(erg.kAC, 3), e: 'mm/√d' },
                        { l: inhalt.werte.bestimmtheitsmaßR, w: formatDeZahl(erg.reg.r2, 3), e: '' },
                        { l: inhalt.werte.kNatNäherung, w: formatDeZahl(erg.kNat, 2), e: 'mm/√a' },
                        { l: inhalt.werte.achsenabschnittA, w: formatDeZahl(erg.reg.a, 2), e: 'mm' },
                      ].map(k => (
                        <div key={k.l} className="p-3 rounded-lg border border-home-grau/30 bg-off-white">
                          <div className="text-[10px] text-text-main/60 font-bold">{k.l}</div>
                          <div className="font-mono font-bold text-text-main text-sm">{k.w} <span className="text-[10px] text-text-main/60">{k.e}</span></div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <figure className="flex flex-col gap-1">
                        <svg viewBox={`0 0 ${B} ${H}`} className="w-full h-auto bg-off-white rounded-lg" role="img" aria-label={inhalt.werte.karbonatisierungstiefeÜberWurzelDer}>
                          <line x1={L} y1={H - U} x2={B - R} y2={H - U} stroke="#64748b" strokeWidth="1" />
                          <line x1={L} y1={O} x2={L} y2={H - U} stroke="#64748b" strokeWidth="1" />
                          {erg.gueltig && <line x1={px(0)} y1={py(Math.max(erg.reg.a, 0))} x2={px(sMax)} y2={py(Math.min(xMax, erg.reg.a + erg.kAC * sMax))} stroke="#9b1b30" strokeWidth="2" />}
                          {punkte.filter(p => Number.isFinite(p.xMm) && p.tTage >= 0).map((p, i) => (
                            <circle key={i} cx={px(Math.sqrt(p.tTage))} cy={py(p.xMm)} r="4" fill="#0f172a" />
                          ))}
                          <text x={B - R} y={H - 8} textAnchor="end" fontSize="10" fill="#334155">√t in √d (max. {formatDeZahl(sMax, 1)})</text>
                          <text x={4} y={12} fontSize="10" fill="#334155">d_k in mm</text>
                          <text x={L - 4} y={O + 8} textAnchor="end" fontSize="9" fill="#334155">{formatDeZahl(xMax, 0)}</text>
                        </svg>
                        <figcaption className="text-[10px] text-text-main/60"><MdText text={inhalt.texte.messwerteUndRegressionsgeradeDie} /></figcaption>
                      </figure>
                      <figure className="flex flex-col gap-1">
                        <svg viewBox={`0 0 ${B} ${H}`} className="w-full h-auto bg-off-white rounded-lg" role="img" aria-label={inhalt.werte.prognoseDerKarbonatisierungstiefeÜber}>
                          <line x1={L} y1={H - U} x2={B - R} y2={H - U} stroke="#64748b" strokeWidth="1" />
                          <line x1={L} y1={O} x2={L} y2={H - U} stroke="#64748b" strokeWidth="1" />
                          <line x1={L} y1={qy(deckung)} x2={B - R} y2={qy(deckung)} stroke="#059669" strokeWidth="1.5" strokeDasharray="5 3" />
                          <line x1={qx(nutzung)} y1={O} x2={qx(nutzung)} y2={H - U} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                          {erg.gueltig && <path d={kurve} fill="none" stroke="#9b1b30" strokeWidth="2" />}
                          <text x={B - R - 2} y={qy(deckung) - 4} textAnchor="end" fontSize="9" fill="#059669">c = {formatDeZahl(deckung, 0)} mm</text>
                          <text x={qx(nutzung) + 3} y={O + 10} fontSize="9" fill="#475569">t_N = {formatDeZahl(nutzung, 0)} a</text>
                          <text x={B - R} y={H - 8} textAnchor="end" fontSize="10" fill="#334155">t in Jahren (bis {formatDeZahl(tPlot, 0)})</text>
                          <text x={4} y={12} fontSize="10" fill="#334155">x_c in mm</text>
                        </svg>
                        <figcaption className="text-[10px] text-text-main/60"><MdText text={inhalt.texte.prognoseXCK} /></figcaption>
                      </figure>
                    </div>

                    <div className={`p-4 rounded-xl border text-sm leading-relaxed ${!erg.gueltig ? 'border-home-grau/30 bg-off-white' : erg.ausreichend ? 'border-emerald-300 bg-emerald-50' : 'border-rose-300 bg-rose-50'}`}>
                      {erg.gueltig ? (
                        <p>
                          Nach <strong>{formatDeZahl(nutzung, 0)} Jahren</strong><MdText text={inhalt.texte.erreichtDieFrontRechnerisch} /><strong>{formatDeZahl(erg.xNutzung, 1)} mm</strong><MdText text={inhalt.texte.dieDeckungVon} />{formatDeZahl(deckung, 0)}<MdText text={inhalt.texte.mmWäreNachEtwa} /><strong>{formatDeZahl(erg.tDeckung, 0)} Jahren</strong> durchkarbonatisiert.
                          {' '}{erg.ausreichend ? inhalt.werte.dieDeckungReichtIn : inhalt.werte.dieDeckungReichtIn2}
                        </p>
                      ) : <p><MdText text={inhalt.texte.keineAuswertungEingabenPrüfen} /></p>}
                      <p className="text-[11px] text-text-main/60 mt-1.5"><MdText text={inhalt.texte.näherungOhneFeuchteBeregnungs} /></p>
                    </div>
                    <LebensdauerUebernehmen
                      aktiv={erg.gueltig}
                      daten={{ quelle: 'schnellkarbonatisierung', mech: 'karbonatisierung', kac: erg.kAC, cAcc, deckM: deckung, tSL: nutzung }}
                      art="schnell"
                    />
                  </div>

                  <FormulaDerivationBox
                    live
                    title={inhalt.werte.ihrRechenwegKAc}
                    zielGleichung="d_k = a + K_{AC} \cdot \sqrt{t} \;\Rightarrow\; K_{nat} = K_{AC} \cdot \sqrt{c_{nat}/c_{acc}} \cdot \sqrt{365}"
                    schritte={[
                      {
                        titel: inhalt.werte.messwerteÜberT,
                        erklaerung: `${erg.reg.n} Messpunkte; die Zeit wird als Wurzel aufgetragen:`,
                        formel: punkte.map(p => `\\sqrt{${tex(p.tTage, 0)}} = ${tex(Math.sqrt(Math.max(p.tTage, 0)), 3)} \\to ${tex(p.xMm, 1)}\\,\\text{mm}`).join(', \\quad ') || '\\text{–}',
                      },
                      {
                        titel: 'Regression',
                        erklaerung: mitA ? inhalt.werte.kleinsteQuadrateMitAchsenabschnitt : inhalt.werte.kleinsteQuadrateDurchDen,
                        formel: `K_{AC} = ${tex(erg.kAC, 4)}\\,\\tfrac{\\text{mm}}{\\sqrt{\\text{d}}}, \\quad a = ${tex(erg.reg.a, 2)}\\,\\text{mm}, \\quad R^2 = ${tex(erg.reg.r2, 3)}`,
                      },
                      {
                        titel: inhalt.werte.umrechnungNäherung,
                        erklaerung: inhalt.werte.coKonzentrationUndZeiteinheit,
                        formel: `K_{nat} = ${tex(erg.kAC, 4)} \\cdot \\sqrt{\\tfrac{${tex(cNat, 3)}}{${tex(cAcc, 1)}}} \\cdot \\sqrt{365} = ${tex(erg.kAC, 4)} \\cdot ${tex(erg.faktor, 3)} = ${tex(erg.kNat, 2)}\\,\\tfrac{\\text{mm}}{\\sqrt{\\text{a}}}`,
                      },
                      {
                        titel: inhalt.werte.prognoseFürDieNutzungsdauer,
                        erklaerung: inhalt.werte.wurzelTGesetzMit,
                        formel: `x_c = ${tex(erg.kNat, 2)} \\cdot \\sqrt{${tex(nutzung, 0)}} = ${tex(erg.xNutzung, 1)}\\,\\text{mm} \\;${erg.ausreichend ? '\\le' : '>'}\\; c = ${tex(deckung, 0)}\\,\\text{mm}`,
                      },
                      {
                        titel: inhalt.werte.zeitBisZurBewehrung,
                        erklaerung: inhalt.werte.umgestelltNachDerZeit,
                        formel: `t_c = \\left(\\frac{${tex(deckung, 0)}}{${tex(erg.kNat, 2)}}\\right)^2 = ${tex(erg.tDeckung, 0)}\\,\\text{a}`,
                      },
                    ]}
                    ergebnisHinweis={inhalt.werte.derAchsenabschnittAStammt}
                    normQuelle={inhalt.werte.dinEn1239012}
                  />
                </div>
              </div>
            )}

            {/* ───────────── 5. GRENZEN ───────────── */}
            {reiter === 'grenzen' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.wasDiePrüfungLeistet} /></h3><MdText text={inhalt.texte.sieLiefertUnterFestgelegten} /></div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.wasSieNichtLeistet} /></h3><MdText text={inhalt.texte.sieIstKeinVerfahren} /></div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.natürlicheLagerungAlsGegenprobe} /></h3><MdText text={inhalt.texte.dinEn1239010} /></div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.typischeFehlerquellen} /></h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><MdText text={inhalt.texte.gesägteStattGespalteneMessflächen} /></li>
                    <li><MdText text={inhalt.texte.messungAnEckenUnd} /></li>
                    <li><MdText text={inhalt.texte.zuFeuchteProbekörperNach} /></li>
                    <li><MdText text={inhalt.texte.einheitenVerwechseltKAc} /></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIEL */}
      <div className={karte}>
        <h3 className="text-base font-bold text-text-main mb-1">Beispiel</h3>
        <FormulaDerivationBox
          title={inhalt.werte.beispielReichtDieDeckung}
          zielGleichung="K_{AC} = \frac{\sum s_i d_i}{\sum s_i^2}, \quad x_c(50\,\text{a}) = K_{nat} \cdot \sqrt{50}"
          schritte={inhalt.daten["Schnellkarbonatisierung.schritte"]}
          ergebnisHinweis={inhalt.werte.rechnerischAusreichendAberNur}
          normQuelle={inhalt.werte.lehrbeispielPrüfungNachDin}
        />
      </div>

      <Querverweis ziel="normen_ausblick" titel={inhalt.werte.ausblickKarbonatisierungswiderstandAlsKl} linkText={inhalt.werte.zumModulAusblickNeue}>
        <p><MdText text={inhalt.texte.en199211} /></p>
      </Querverweis>

      <Querverweis ziel="lebensdauerbemessung" titel={inhalt.werte.querLebensdauerTitel} linkText={inhalt.werte.querLebensdauerLink}>
        <p><MdText text={inhalt.texte.querLebensdauerText} /></p>
      </Querverweis>

      <ModulTest moduleId="schnellkarbonatisierung" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap6}
        wikipedia={[
          { title: 'Carbonatisierung', url: 'https://de.wikipedia.org/wiki/Carbonatisierung' },
          { title: 'Phenolphthalein', url: 'https://de.wikipedia.org/wiki/Phenolphthalein' },
        ]}
        literatur={inhalt.daten["Schnellkarbonatisierung.literatur"]}
        regelwerke={inhalt.daten["Schnellkarbonatisierung.regelwerke"]}
        formeln={inhalt.daten["Schnellkarbonatisierung.formeln"]}
      />
    </div>
  );
}
