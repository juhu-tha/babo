import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { BookOpen, Wind, Droplets, Calculator, ListChecks, Scale, ShieldAlert, Timer, GraduationCap, AlertTriangle, ArrowRight, Undo2, Link2 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { BlockMath } from 'react-katex';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import {
  lebensdauerbemessung, pfAusBeta, rInvAusAcc, rInvAusKac, rInvStreuung,
  FIB_KARBONATISIERUNG, FIB_CHLORID, BETA_ZIEL_FIB,
  type LebensdauerEingabe, type Mechanismus, type Verteilung,
} from '@/src/calc/lebensdauer';
import { leseUebergabe, vorgabeAusUebergabe, UEBERGABE_QUELLEN, UEBERGABE_SCHLUESSEL, type UebergabeQuelle } from '@/src/calc/lebensdauerUebergabe';
import { tiefeNach, zeitBisTiefe } from '@/src/calc/schnellkarbonatisierung';
import type { Hinweis } from '@/src/calc/plausibilitaet';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis, springeZu } from '@/src/components/ui/Querverweis';
import { AuswahlGruppe, alsOption } from '@/src/components/ui/Auswahlgruppe';
import { DiagrammAngaben } from '@/src/lib/diagrammAlternative';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { useTabContext } from '@/src/contexts/TabContext';
import inhalt from '@/content/lebensdauerbemessung/Lebensdauerbemessung.json';
import { MdText } from '@/src/components/inhalt/MdText';

type Reiter = 'grundlagen' | 'karbonatisierung' | 'chlorid' | 'rechner' | 'beispiele' | 'konzepte' | 'grenzen';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'grundlagen', label: inhalt.werte.reiterGrundlagen, icon: BookOpen },
  { id: 'karbonatisierung', label: inhalt.werte.reiterKarbonatisierung, icon: Wind },
  { id: 'chlorid', label: inhalt.werte.reiterChlorid, icon: Droplets },
  { id: 'rechner', label: inhalt.werte.reiterRechner, icon: Calculator },
  { id: 'beispiele', label: inhalt.werte.reiterBeispiele, icon: ListChecks },
  { id: 'konzepte', label: inhalt.werte.reiterKonzepte, icon: Scale },
  { id: 'grenzen', label: inhalt.werte.reiterGrenzen, icon: ShieldAlert },
];

const karte = 'bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30';
const kasten = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const formelKasten = 'p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto';
const th = 'p-2.5 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2.5 text-xs text-text-main/85 border-b border-home-grau/15 align-top';
const feldKlasse = 'w-full p-1.5 border border-home-grau/50 rounded-lg bg-white text-sm font-mono focus:outline-none focus:border-shiraz';
const auswahlKlasse = 'p-2 border border-home-grau/50 rounded-lg bg-white text-sm focus:outline-none focus:border-shiraz';

type Parameterzeile = { groesse: string; verteilung: string; wert: string; quelle: string };
const KARB_PARAMETER: Parameterzeile[] = inhalt.daten.KARB_PARAMETER;
const CHLORID_PARAMETER: Parameterzeile[] = inhalt.daten.CHLORID_PARAMETER;
type Bindemittel = 'cemI' | 'flugasche' | 'huettensand';
const DRCM: { id: Bindemittel; name: string; werte: (number | null)[] }[] = inhalt.daten.DRCM as { id: Bindemittel; name: string; werte: (number | null)[] }[];
const WZ = [0.4, 0.45, 0.5, 0.55, 0.6];
const KONZEPTE: { merkmal: string; deskriptiv: string; leistung: string; erc: string }[] = inhalt.daten.KONZEPTE;
const CMINDUR: { klasse: string; cmin: number; dev: number }[] = inhalt.daten.CMINDUR;
const BETA_STUFEN = [0, 1.0, 1.3, 1.5, 2.0, 3.8];

type RArt = 'acc' | 'direkt' | 'kac';
type Zone = 'spritz' | 'nebel';

interface Zustand {
  mech: Mechanismus;
  tSL: number; betaZiel: number; laeufe: number; startwert: number;
  deckTyp: 'normal' | 'lognormal'; deckM: number; deckS: number;
  rhM: number; rhS: number; tc: number; pSR: number; tow: number;
  rArt: RArt; xcAcc: number; rDirekt: number; kac: number; kacC: number;
  binder: Bindemittel; wz: number; drcm: number; zone: Zone; cS: number; cSs: number; c0: number; tM: number; tS: number;
}

const BASIS: Zustand = {
  mech: 'karbonatisierung', tSL: 50, betaZiel: BETA_ZIEL_FIB, laeufe: 20000, startwert: 1,
  deckTyp: 'normal', deckM: 35, deckS: 8,
  rhM: 65, rhS: 10, tc: 7, pSR: 0, tow: 0,
  rArt: 'acc', xcAcc: 5, rDirekt: 14.17, kac: 1.0, kacC: 3,
  binder: 'huettensand', wz: 1, drcm: 1.9, zone: 'spritz', cS: 3.0, cSs: 1.5, c0: 0.1, tM: 10, tS: 5,
};

const VORGABEN: { id: string; label: string; z: Partial<Zustand> }[] = [
  { id: 'k1', label: inhalt.werte.vorgabeKarbGeschuetzt, z: { mech: 'karbonatisierung', deckM: 35, deckS: 8, rhM: 65, rhS: 10, pSR: 0, tow: 0, tc: 7, rArt: 'acc', xcAcc: 5 } },
  { id: 'k2', label: inhalt.werte.vorgabeKarbBeregnet, z: { mech: 'karbonatisierung', deckM: 40, deckS: 8, rhM: 75, rhS: 16, pSR: 1, tow: 0.3, tc: 7, rArt: 'acc', xcAcc: 5 } },
  { id: 'c1', label: inhalt.werte.vorgabeChloridSpritz, z: { mech: 'chlorid', deckM: 55, deckS: 8, binder: 'huettensand', wz: 1, drcm: 1.9, zone: 'spritz', cS: 3.0, cSs: 1.5, c0: 0.1, tM: 10, tS: 5 } },
  { id: 'c2', label: inhalt.werte.vorgabeChloridSpritzCemI, z: { mech: 'chlorid', deckM: 55, deckS: 8, binder: 'cemI', wz: 1, drcm: 10.0, zone: 'spritz', cS: 3.0, cSs: 1.5, c0: 0.1, tM: 10, tS: 5 } },
  { id: 'c3', label: inhalt.werte.vorgabeChloridNebel, z: { mech: 'chlorid', deckM: 55, deckS: 8, binder: 'huettensand', wz: 1, drcm: 1.9, zone: 'nebel', cS: 3.0, cSs: 1.5, c0: 0.1, tM: 10, tS: 5 } },
];

const normal = (m: number, s: number): Verteilung => ({ typ: 'normal', m, s });

/** Einzelrechner, die Eingaben übergeben können (Rückweg; Ziele sind Registry-IDs) */
const EINZELRECHNER: readonly { ziel: UebergabeQuelle; label: string }[] = [
  { ziel: 'schnellkarbonatisierung', label: inhalt.werte.einzelSchnell },
  { ziel: 'korrosion', label: inhalt.werte.einzelKorrosion },
  { ziel: 'expositionsklassen', label: inhalt.werte.einzelExposition },
  { ziel: 'dauerhaftigkeit', label: inhalt.werte.einzelDauerhaftigkeit },
  { ziel: 'pruefverfahren_katalog', label: inhalt.werte.einzelBauwerk },
];

/** R⁻¹_ACC,0 (10⁻¹¹ (m²/s)/(kg/m³)) aus der gewählten Eingabeart */
function rInvMittel(z: Zustand): number {
  return z.rArt === 'acc' ? rInvAusAcc(z.xcAcc) : z.rArt === 'kac' ? rInvAusKac(z.kac, z.kacC) : z.rDirekt;
}

function eingabeAus(z: Zustand): LebensdauerEingabe {
  const rInv = rInvMittel(z);
  const deckung = { typ: z.deckTyp, m: z.deckM, s: z.deckS } as const;
  return {
    mechanismus: z.mech, nutzungsdauer: z.tSL, betaZiel: z.betaZiel, laeufe: z.laeufe, startwert: z.startwert,
    karbonatisierung: {
      deckung, rh: { typ: 'beta', m: z.rhM, s: z.rhS, a: 40, b: 100 }, tc: z.tc,
      bc: FIB_KARBONATISIERUNG.bc, kt: FIB_KARBONATISIERUNG.kt, rInv: normal(rInv, rInvStreuung(rInv)),
      epsT: FIB_KARBONATISIERUNG.epsT, cS: FIB_KARBONATISIERUNG.cSatm, pSR: z.pSR, tow: z.tow, bw: FIB_KARBONATISIERUNG.bw,
    },
    chlorid: {
      deckung, cCrit: FIB_CHLORID.cCrit, c0: z.c0, cS: { typ: 'lognormal', m: z.cS, s: z.cSs },
      dx: z.zone === 'spritz' ? FIB_CHLORID.dxSpritz : { typ: 'konstant', m: 0 },
      dRcm: normal(z.drcm, FIB_CHLORID.vDrcm * z.drcm), a: FIB_CHLORID.alterung[z.binder],
      be: FIB_CHLORID.be, tReal: normal(z.tM, z.tS), kt: 1,
    },
  };
}

export default function Lebensdauerbemessung() {
  const [reiter, setReiter] = useState<Reiter>('grundlagen');
  const [z, setZ] = useState<Zustand>(BASIS);
  const { theme, setActiveTab } = useTabContext();
  const dunkel = theme === 'dark';
  const setze = <K extends keyof Zustand>(k: K, v: Zustand[K]) => setZ(alt => ({ ...alt, [k]: v }));
  const lade = (id: string) => { const v = VORGABEN.find(x => x.id === id); if (v) setZ(alt => ({ ...alt, ...v.z })); };

  // Übergabe aus den Einzelrechnern (URL-Parameter, src/calc/lebensdauerUebergabe.ts): nach dem Laden einlesen,
  // beim Verlassen des Moduls aus der Adresse entfernen (sonst wanderten sie in andere Module mit)
  const [uebernahme, setUebernahme] = useState<{ quelle: UebergabeQuelle; liste: string[]; kNat: number | null; hinweise: Hinweis[] } | null>(null);
  useEffect(() => {
    try {
      const { daten, hinweise } = leseUebergabe(window.location.search);
      if (daten) {
        const v = vorgabeAusUebergabe(daten);
        setZ(alt => ({ ...alt, ...v.vorgabe }));
        setUebernahme({ quelle: daten.quelle, liste: v.uebernommen, kNat: v.kNat, hinweise: [...hinweise, ...v.hinweise] });
        setReiter('rechner');
      }
    } catch { /* ohne Adresse (Vorrendern) keine Übergabe */ }
    return () => {
      try {
        const p = new URLSearchParams(window.location.search);
        if (!UEBERGABE_SCHLUESSEL.some(k => p.has(k))) return;
        UEBERGABE_SCHLUESSEL.forEach(k => p.delete(k));
        const rest = p.toString();
        window.history.replaceState(window.history.state, '', window.location.pathname + (rest ? `?${rest}` : '') + window.location.hash);
      } catch { /* Adresse unverändert */ }
    };
  }, []);

  const aufgeschoben = useDeferredValue(z);
  const eingabe = useMemo(() => eingabeAus(aufgeschoben), [aufgeschoben]);
  const erg = useMemo(() => lebensdauerbemessung(eingabe), [eingabe]);
  const rInv = rInvMittel(z);
  const tex = (v: number, n: number) => formatDeTeX(v, n);
  const karb = z.mech === 'karbonatisierung';
  const mw = erg.mittelwerte;

  const zahl = (v: string) => { const x = parseFloat(v); return Number.isFinite(x) ? x : NaN; };
  const eingabeFeld = (label: string, k: keyof Zustand, einheit: string, schritt: string) => (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold text-text-main">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="number" step={schritt} aria-label={label}
          value={Number.isFinite(z[k] as number) ? (z[k] as number) : ''}
          onChange={e => setze(k, zahl(e.target.value) as never)}
          className={feldKlasse}
        />
        <span className="text-xs text-text-main/70 w-16 shrink-0">{einheit}</span>
      </span>
    </label>
  );
  const auswahl = <T extends string | number>(label: string, wert: T, optionen: { v: T; l: string }[], setzen: (v: T) => void) => (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold text-text-main">{label}</span>
      <select aria-label={label} value={String(wert)} onChange={e => { const o = optionen.find(x => String(x.v) === e.target.value); if (o) setzen(o.v); }} className={auswahlKlasse}>
        {optionen.map(o => <option key={String(o.v)} value={String(o.v)}>{o.l}</option>)}
      </select>
    </label>
  );
  const waehleBinder = (b: Bindemittel, wz = z.wz) => {
    const w = DRCM.find(d => d.id === b)?.werte[wz];
    setZ(alt => ({ ...alt, binder: b, wz, drcm: w ?? alt.drcm }));
  };

  // Diagramm β(t)
  const BETA_MIN = -3, BETA_MAX = 4;
  const kurve = erg.kurve.filter((_, i) => i % 2 === 1 || erg.kurve.length < 60);
  const textFarbe = dunkel ? '#e2e8f0' : '#334155';
  const gitter = dunkel ? 'rgba(148,163,184,0.25)' : 'rgba(100,116,139,0.18)';
  const diagrammDaten = {
    labels: kurve.map(p => formatDeZahl(p.t, 0)),
    datasets: [
      { label: inhalt.werte.diagrammBeta, data: kurve.map(p => Math.min(Math.max(p.beta, BETA_MIN), BETA_MAX)), borderColor: dunkel ? '#FF3B77' : '#9b1b30', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 0 },
      { label: inhalt.werte.diagrammZiel, data: kurve.map(() => z.betaZiel), borderColor: dunkel ? '#34d399' : '#047857', borderDash: [6, 4], borderWidth: 1.5, pointRadius: 0 },
    ],
  };
  const diagrammOptionen = {
    responsive: true, maintainAspectRatio: false, animation: false as const,
    plugins: { legend: { position: 'top' as const, labels: { color: textFarbe } } },
    scales: {
      x: { title: { display: true, text: inhalt.werte.achseT, color: textFarbe }, ticks: { color: textFarbe, maxTicksLimit: 11 }, grid: { color: gitter } },
      y: { min: BETA_MIN, max: BETA_MAX, title: { display: true, text: inhalt.werte.achseBeta, color: textFarbe }, ticks: { color: textFarbe }, grid: { color: gitter } },
    },
  };
  const zusammenfassung = erg.gueltig
    ? `Liniendiagramm: β über der Zeit von 0 bis ${formatDeZahl(kurve[kurve.length - 1]?.t ?? 0, 0)} Jahren für ${karb ? 'Karbonatisierung' : 'Chlorid'}; β(${formatDeZahl(z.tSL, 0)} a) = ${formatDeZahl(erg.beta, 2)}, Zielwert β₀ = ${formatDeZahl(z.betaZiel, 1)}${erg.lebensdauer !== null ? `, unterschritten ab ${formatDeZahl(erg.lebensdauer, 0)} Jahren` : ', im dargestellten Zeitraum nicht unterschritten'}.`
    : 'Liniendiagramm ohne Daten: Eingaben unvollständig.';

  const betaText = (b: number, unter: boolean) => (unter ? `> ${formatDeZahl(b, 2)}` : Number.isFinite(b) ? formatDeZahl(b, 2) : '–');

  const schritteRechner = karb ? [
    {
      titel: 'Betonwiderstand',
      erklaerung: z.rArt === 'acc' ? `ACC-Test, R⁻¹ = (x_c/τ)² mit τ = 420; Streuung s = 0,69 · m^0,78:` : z.rArt === 'kac' ? 'Näherung aus K_AC nach DIN EN 12390-12 (vorläufig), Streuung s = 0,69 · m^0,78:' : 'Direkte Eingabe; Streuung s = 0,69 · m^0,78:',
      formel: `R^{-1}_{ACC,0} = ${tex(rInv, 2)} \\cdot 10^{-11}\\,\\tfrac{\\text{m}^2/\\text{s}}{\\text{kg/m}^3} = ${tex(mw.faktoren.r, 0)}\\,\\tfrac{\\text{mm}^2/\\text{a}}{\\text{kg/m}^3}, \\quad s = ${tex(rInvStreuung(rInv), 2)} \\cdot 10^{-11}`,
    },
    {
      titel: 'Teilfunktionen (Mittelwerte)',
      erklaerung: `RH = ${formatDeZahl(z.rhM, 0)} %, t_c = ${formatDeZahl(z.tc, 0)} d, p_SR · ToW = ${formatDeZahl(z.pSR * z.tow, 2)}:`,
      formel: `k_e = ${tex(mw.faktoren.ke, 3)}, \\quad k_c = ${tex(mw.faktoren.kc, 3)}, \\quad w = ${tex(mw.faktoren.w, 3)}, \\quad W(${tex(z.tSL, 0)}) = ${tex(mw.faktoren.W, 3)}`,
    },
    {
      titel: 'Mittelwertrechnung',
      erklaerung: inhalt.texte.rDeterministischHinweis,
      formel: `k = \\sqrt{2 \\cdot ${tex(mw.faktoren.ke, 3)} \\cdot ${tex(mw.faktoren.kc, 3)} \\cdot (1{,}25 \\cdot ${tex(mw.faktoren.r, 0)} + ${tex(mw.faktoren.eps, 1)}) \\cdot 8{,}2 \\cdot 10^{-4}} = ${tex(mw.kennwert, 2)}\\,\\tfrac{\\text{mm}}{\\sqrt{\\text{a}}}, \\quad x_c(${tex(z.tSL, 0)}) = ${tex(mw.einwirkung, 1)}\\,\\text{mm}`,
    },
    {
      titel: 'Simulation',
      erklaerung: `${formatDeZahl(z.laeufe, 0)} Läufe, Startwert ${formatDeZahl(z.startwert, 0)}; Grenzzustand g = a − x_c(t):`,
      formel: `p_f = ${tex(erg.pf * 100, 2)}\\,\\%, \\quad \\beta = ${erg.betaUntergrenze ? '>' : ''}${tex(erg.beta, 2)} \\;${erg.nachweis ? '\\ge' : '<'}\\; \\beta_0 = ${tex(z.betaZiel, 1)}`,
    },
  ] : [
    {
      titel: 'Diffusionskoeffizient (Mittelwerte)',
      erklaerung: `T = ${formatDeZahl(z.tM, 0)} °C, b_e = 4800 K, a = ${formatDeZahl(FIB_CHLORID.alterung[z.binder].m, 2)}, k_t = 1:`,
      formel: `D_{app,C} = ${tex(mw.faktoren.ke, 3)} \\cdot ${tex(mw.faktoren.d0, 1)} \\cdot ${tex(mw.faktoren.A, 4)} = ${tex(mw.kennwert, 2)}\\,\\tfrac{\\text{mm}^2}{\\text{a}}`,
    },
    {
      titel: 'Mittelwertrechnung',
      erklaerung: inhalt.texte.rDeterministischHinweis,
      formel: `C(${tex(z.deckM, 0)}, ${tex(z.tSL, 0)}) = ${tex(mw.einwirkung, 3)}\\,\\text{M.-\\%}, \\quad x(C_{crit} = 0{,}6) = ${tex(mw.vergleich, 1)}\\,\\text{mm}`,
    },
    {
      titel: 'Simulation',
      erklaerung: `${formatDeZahl(z.laeufe, 0)} Läufe, Startwert ${formatDeZahl(z.startwert, 0)}; Grenzzustand g = C_crit − C(a, t):`,
      formel: `p_f = ${tex(erg.pf * 100, 2)}\\,\\%, \\quad \\beta = ${erg.betaUntergrenze ? '>' : ''}${tex(erg.beta, 2)} \\;${erg.nachweis ? '\\ge' : '<'}\\; \\beta_0 = ${tex(z.betaZiel, 1)}`,
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className={`${karte} flex flex-col gap-5`}>
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Timer className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.titel} /></h2>
          <p className="text-xs text-text-main/70 font-mono mt-1"><MdText text={inhalt.texte.untertitel} /></p>
        </div>

        <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed flex items-start gap-2.5">
          <GraduationCap size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <p><MdText text={inhalt.texte.lehrhinweis} /></p>
        </div>

        <ModuleTabs label={inhalt.werte.bereiche} tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
          <div className="pt-5 animate-in fade-in duration-300">
            {/* ───────────── 1. GRUNDLAGEN ───────────── */}
            {reiter === 'grundlagen' && (
              <div className="flex flex-col gap-5">
                <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.gEinleitung} /></p>
                <div className={kasten}><p><MdText text={inhalt.texte.gGrenzzustand} /></p></div>
                <div className={formelKasten}>
                  <BlockMath math="g(t) = a - x_c(t) \quad\text{bzw.}\quad g(t) = C_{crit} - C(a,t), \qquad p_f(t) = P\{g(t) < 0\} \le \Phi(-\beta_0)" />
                </div>
                <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.gBasisvariablen} /></p>
                <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.gZiel} /></p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[420px]">
                    <caption className="text-left text-xs font-bold text-text-main pb-2">{inhalt.werte.betaTabelleTitel}</caption>
                    <thead><tr><th scope="col" className={th}>β</th>{BETA_STUFEN.map(b => <th scope="col" key={b} className={th}>{formatDeZahl(b, 1)}</th>)}</tr></thead>
                    <tbody><tr><th scope="row" className={td}>p_f</th>{BETA_STUFEN.map(b => <td key={b} className={td}>{formatDeZahl(pfAusBeta(b) * 100, b > 3 ? 4 : 1)} %</td>)}</tr></tbody>
                  </table>
                </div>
                <div className={kasten}><p><MdText text={inhalt.texte.gMonteCarlo} /></p></div>
                <Querverweis ziel="korrosion" titel={inhalt.texte.querKorrosion} linkText={inhalt.werte.zumModulKorrosion}>
                  <p><MdText text={inhalt.texte.gKorrosionVerweis} /></p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 2. KARBONATISIERUNG ───────────── */}
            {reiter === 'karbonatisierung' && (
              <div className="flex flex-col gap-5">
                <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.kEinleitung} /></p>
                <div className={formelKasten}>
                  <BlockMath math="x_c(t) = \sqrt{2 \cdot k_e \cdot k_c \cdot \left(k_t \cdot R^{-1}_{ACC,0} + \varepsilon_t\right) \cdot C_S} \cdot \sqrt{t} \cdot W(t)" />
                  <BlockMath math="k_e = \left(\frac{1 - (RH_{real}/100)^{f_e}}{1 - (RH_{ref}/100)^{f_e}}\right)^{g_e}, \quad k_c = \left(\frac{t_c}{7}\right)^{b_c}, \quad W(t) = \left(\frac{t_0}{t}\right)^{(p_{SR} \cdot ToW)^{b_w}/2}" />
                </div>
                <ParameterTabelle titel={inhalt.werte.parameterTitelKarb} zeilen={KARB_PARAMETER} />
                <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.kPruefung} /></p>
                <div className={kasten}><p><MdText text={inhalt.texte.kWetter} /></p></div>
                <Querverweis ziel="schnellkarbonatisierung" titel={inhalt.texte.querSchnell} linkText={inhalt.werte.zumModulSchnell}>
                  <p><MdText text={inhalt.texte.kSchnellVerweis} /></p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 3. CHLORID ───────────── */}
            {reiter === 'chlorid' && (
              <div className="flex flex-col gap-5">
                <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.cEinleitung} /></p>
                <div className={formelKasten}>
                  <BlockMath math="C(a,t) = C_0 + (C_{S,\Delta x} - C_0) \cdot \left[1 - \mathrm{erf}\left(\frac{a - \Delta x}{2\sqrt{D_{app,C} \cdot t}}\right)\right]" />
                  <BlockMath math="D_{app,C} = k_e \cdot D_{RCM,0} \cdot k_t \cdot A(t), \quad k_e = \exp\left(b_e\left(\frac{1}{T_{ref}} - \frac{1}{T_{real}}\right)\right), \quad A(t) = \left(\frac{t_0}{t}\right)^{a}" />
                </div>
                <div className={kasten}><p><MdText text={inhalt.texte.cKonvektion} /></p></div>
                <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.cAlterung} /></p>
                <ParameterTabelle titel={inhalt.werte.parameterTitelChlorid} zeilen={CHLORID_PARAMETER} />
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[520px]">
                    <caption className="text-left text-xs font-bold text-text-main pb-2">{inhalt.werte.drcmTitel}</caption>
                    <thead><tr><th scope="col" className={th}>Bindemittel</th>{WZ.map(w => <th scope="col" key={w} className={th}>w/z = {formatDeZahl(w, 2)}</th>)}</tr></thead>
                    <tbody>{DRCM.map(d => (
                      <tr key={d.id}><th scope="row" className={td}>{d.name}</th>{d.werte.map((v, i) => <td key={i} className={td}>{v === null ? '–' : formatDeZahl(v, 1)}</td>)}</tr>
                    ))}</tbody>
                  </table>
                </div>
                <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.cTabellenHinweis} /></p>
                <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.cKritisch} /></p>
              </div>
            )}

            {/* ───────────── 4. RECHNER / SIMULATION ───────────── */}
            {reiter === 'rechner' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {uebernahme && (
                    <div className="p-4 rounded-xl border border-shiraz/25 bg-shiraz/5 text-xs text-text-main/85 leading-relaxed flex flex-col gap-2" role="status">
                      <h3 className="font-bold text-text-main text-sm flex items-center gap-2"><Link2 size={16} className="text-shiraz shrink-0" aria-hidden={true} />{inhalt.werte.uebernahmeTitel} {UEBERGABE_QUELLEN[uebernahme.quelle]}</h3>
                      {uebernahme.liste.length > 0 && <ul className="list-disc pl-4 space-y-0.5">{uebernahme.liste.map(l => <li key={l}>{l}</li>)}</ul>}
                      <p><MdText text={inhalt.texte.uebernahmeText} /></p>
                      <EingabeHinweise hinweise={uebernahme.hinweise} />
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => springeZu(setActiveTab, uebernahme.quelle)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-home-grau/50 text-text-main text-xs font-bold hover:border-shiraz">
                          <Undo2 size={14} aria-hidden={true} /> {inhalt.werte.uebernahmeZurueck}
                        </button>
                        <button type="button" onClick={() => { setZ(BASIS); setUebernahme(null); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-home-grau/50 text-text-main text-xs font-bold hover:border-shiraz">
                          {inhalt.werte.uebernahmeVerwerfen}
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.rEinleitung} /></p>
                  <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-main">{inhalt.werte.vorgabe}</span>
                      <select aria-label={inhalt.werte.vorgabe} value="" onChange={e => lade(e.target.value)} className={auswahlKlasse}>
                        <option value="" disabled>Vorgabe wählen …</option>
                        {VORGABEN.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                      </select>
                    </label>
                    <div className="flex flex-col gap-1">
                      <span id="ld-mechanismus" className="text-xs font-bold text-text-main mb-1">{inhalt.werte.mechanismus}</span>
                      <AuswahlGruppe aria-labelledby="ld-mechanismus" className="flex gap-2">
                        {(['karbonatisierung', 'chlorid'] as const).map(m => (
                          <button key={m} type="button" {...alsOption(z.mech === m)} onClick={() => lade(m === 'karbonatisierung' ? 'k1' : 'c1')}
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold border ${z.mech === m ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/50'}`}>
                            {m === 'karbonatisierung' ? inhalt.werte.karbonatisierung : inhalt.werte.chlorid}
                          </button>
                        ))}
                      </AuswahlGruppe>
                    </div>

                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider pt-1">{inhalt.werte.allgemein}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {eingabeFeld(inhalt.werte.nutzungsdauer, 'tSL', 'Jahre', '5')}
                      {eingabeFeld(inhalt.werte.betaZiel, 'betaZiel', '–', '0.1')}
                      {auswahl(inhalt.werte.laeufe, z.laeufe, [5000, 20000, 50000].map(v => ({ v, l: formatDeZahl(v, 0) })), v => setze('laeufe', v))}
                      {eingabeFeld(inhalt.werte.startwert, 'startwert', '', '1')}
                    </div>
                    {auswahl(inhalt.werte.deckungTyp, z.deckTyp, [{ v: 'normal' as const, l: inhalt.werte.normal }, { v: 'lognormal' as const, l: inhalt.werte.lognormal }], v => setze('deckTyp', v))}
                    <div className="grid grid-cols-2 gap-3">
                      {eingabeFeld(inhalt.werte.deckungM, 'deckM', 'mm', '1')}
                      {eingabeFeld(inhalt.werte.deckungS, 'deckS', 'mm', '1')}
                    </div>

                    {karb ? (
                      <>
                        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider pt-1">{inhalt.werte.umgebung}</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {eingabeFeld(inhalt.werte.rhM, 'rhM', '%', '1')}
                          {eingabeFeld(inhalt.werte.rhS, 'rhS', '%', '1')}
                          {eingabeFeld(inhalt.werte.tc, 'tc', 'd', '1')}
                          {eingabeFeld(inhalt.werte.pSR, 'pSR', '–', '0.1')}
                          {eingabeFeld(inhalt.werte.tow, 'tow', '–', '0.05')}
                        </div>
                        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider pt-1">{inhalt.werte.widerstand}</h3>
                        {auswahl(inhalt.werte.rArt, z.rArt, [{ v: 'acc' as const, l: inhalt.werte.rArtAcc }, { v: 'direkt' as const, l: inhalt.werte.rArtDirekt }, { v: 'kac' as const, l: inhalt.werte.rArtKac }], v => setze('rArt', v))}
                        {z.rArt === 'acc' && eingabeFeld(inhalt.werte.xcAcc, 'xcAcc', 'mm', '0.1')}
                        {z.rArt === 'direkt' && eingabeFeld(inhalt.werte.rInv, 'rDirekt', '10⁻¹¹', '0.5')}
                        {z.rArt === 'kac' && (
                          <>
                            <div className="grid grid-cols-2 gap-3">
                              {eingabeFeld(inhalt.werte.kac, 'kac', 'mm/√d', '0.05')}
                              {eingabeFeld(inhalt.werte.kacC, 'kacC', 'Vol.-%', '0.5')}
                            </div>
                            <p className="p-3 rounded-lg border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed flex items-start gap-2">
                              <AlertTriangle size={14} className="text-amber-700 shrink-0 mt-0.5" aria-hidden={true} /><span><MdText text={inhalt.texte.rKacWarnung} /></span>
                            </p>
                          </>
                        )}
                        <p className="text-xs text-text-main/80">{inhalt.werte.rInvErgebnis}: <strong className="font-mono">{formatDeZahl(rInv, 2)} · 10⁻¹¹ (m²/s)/(kg/m³)</strong>, s = {formatDeZahl(rInvStreuung(rInv), 2)}</p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider pt-1">{inhalt.werte.widerstand}</h3>
                        {auswahl(inhalt.werte.bindemittel, z.binder, [{ v: 'cemI' as const, l: inhalt.werte.cemI }, { v: 'flugasche' as const, l: inhalt.werte.flugasche }, { v: 'huettensand' as const, l: inhalt.werte.huettensand }], v => waehleBinder(v))}
                        {auswahl(inhalt.werte.wz, z.wz, WZ.map((w, i) => ({ v: i, l: formatDeZahl(w, 2) })), v => waehleBinder(z.binder, v))}
                        {eingabeFeld(inhalt.werte.drcm, 'drcm', '10⁻¹² m²/s', '0.1')}
                        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider pt-1">{inhalt.werte.umgebung}</h3>
                        {auswahl(inhalt.werte.zone, z.zone, [{ v: 'spritz' as const, l: inhalt.werte.zoneSpritz }, { v: 'nebel' as const, l: inhalt.werte.zoneNebel }], v => setze('zone', v))}
                        <div className="grid grid-cols-2 gap-3">
                          {eingabeFeld(inhalt.werte.cS, 'cS', 'M.-%', '0.1')}
                          {eingabeFeld(inhalt.werte.cSs, 'cSs', 'M.-%', '0.1')}
                          {eingabeFeld(inhalt.werte.c0, 'c0', 'M.-%', '0.05')}
                          {eingabeFeld(inhalt.werte.tReal, 'tM', '°C', '1')}
                          {eingabeFeld(inhalt.werte.tRealS, 'tS', 'K', '1')}
                        </div>
                      </>
                    )}
                  </div>
                  <EingabeHinweise hinweise={erg.hinweise} />
                </div>

                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-4" aria-live="polite">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { l: inhalt.werte.ergPf, w: erg.gueltig ? formatDeZahl(erg.pf * 100, 2) : '–', e: '%' },
                        { l: inhalt.werte.ergBeta, w: erg.gueltig ? betaText(erg.beta, erg.betaUntergrenze) : '–', e: '' },
                        { l: inhalt.werte.ergDeckung, w: erg.erfDeckung === null ? '> 400' : formatDeZahl(erg.erfDeckung, 1), e: 'mm' },
                        { l: inhalt.werte.ergLebensdauer, w: erg.gueltig ? (erg.lebensdauer === null ? `> ${formatDeZahl(erg.kurve[erg.kurve.length - 1]?.t ?? 0, 0)}` : formatDeZahl(erg.lebensdauer, 0)) : '–', e: 'a' },
                      ].map(k => (
                        <div key={k.l} className="p-3 rounded-lg border border-home-grau/30 bg-off-white">
                          <div className="text-[11px] text-text-main/75 font-bold">{k.l}</div>
                          <div className="font-mono font-bold text-text-main text-sm">{k.w} <span className="text-[11px] text-text-main/75">{k.e}</span></div>
                        </div>
                      ))}
                    </div>
                    {erg.gueltig ? (
                      <p className={`p-3 rounded-xl border text-sm ${erg.nachweis ? 'border-emerald-300 bg-emerald-50' : 'border-rose-300 bg-rose-50'}`}>
                        {erg.nachweis ? inhalt.werte.nachweisOk : inhalt.werte.nachweisNicht} Standardfehler von p_f: ± {formatDeZahl(erg.standardfehler * 100, 2)} Prozentpunkte.
                      </p>
                    ) : <p className="p-3 rounded-xl border border-home-grau/30 bg-off-white text-sm"><MdText text={inhalt.texte.rKeinErgebnis} /></p>}
                    <figure className="flex flex-col gap-1">
                      <figcaption className="text-xs font-bold text-text-main">{inhalt.werte.diagrammTitel}</figcaption>
                      <DiagrammAngaben zusammenfassung={zusammenfassung} einheiten={{ x: 'a', y: '–' }}>
                        <div className="relative h-[260px]">
                          <Line data={diagrammDaten} options={diagrammOptionen} />
                        </div>
                      </DiagrammAngaben>
                    </figure>
                  </div>
                  {karb && uebernahme?.kNat != null && (
                    <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white text-xs text-text-main/85 leading-relaxed">
                      <h3 className="font-bold text-text-main text-sm mb-1">{inhalt.werte.kNatVergleichTitel}</h3>
                      <p className="font-mono">x_c({formatDeZahl(z.tSL, 0)} a) = {formatDeZahl(uebernahme.kNat, 2)} · √{formatDeZahl(z.tSL, 0)} = {formatDeZahl(tiefeNach(uebernahme.kNat, z.tSL), 1)} mm; t bis c = ({formatDeZahl(z.deckM, 0)}/{formatDeZahl(uebernahme.kNat, 2)})² = {formatDeZahl(zeitBisTiefe(z.deckM, uebernahme.kNat), 0)} a</p>
                      <p className="mt-1">fib-Modell (Mittelwerte): x_c({formatDeZahl(z.tSL, 0)} a) = {erg.gueltig ? formatDeZahl(mw.einwirkung, 1) : '–'} mm. <MdText text={inhalt.texte.kNatVergleichText} /></p>
                    </div>
                  )}
                  <FormulaDerivationBox
                    live
                    title={inhalt.werte.rechenwegTitel}
                    zielGleichung={`${karb ? 'g = a - x_c(t_{SL})' : 'g = C_{crit} - C(a, t_{SL})'}, \\quad t_{SL} = ${tex(z.tSL, 0)}\\,\\text{a}, \\quad \\beta(t_{SL}) = -\\Phi^{-1}(p_f) \\ge \\beta_0 = ${tex(z.betaZiel, 1)}`}
                    schritte={erg.gueltig ? schritteRechner : []}
                    normQuelle={inhalt.werte.rechenwegQuelle}
                  />
                </div>
                <nav aria-label={inhalt.werte.einzelrechnerTitel} className="lg:col-span-12 p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/85 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1">{inhalt.werte.einzelrechnerTitel}</h3>
                  <p className="mb-2"><MdText text={inhalt.texte.einzelrechnerText} /></p>
                  <ul className="flex flex-wrap gap-2">
                    {EINZELRECHNER.map(r => (
                      <li key={r.ziel}>
                        <button type="button" onClick={() => springeZu(setActiveTab, r.ziel)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-off-white border border-home-grau/50 text-text-main text-xs font-bold hover:border-shiraz">
                          {r.label} <ArrowRight size={14} aria-hidden={true} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {/* ───────────── 5. BEISPIELE ───────────── */}
            {reiter === 'beispiele' && (
              <div className="flex flex-col gap-5">
                <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.bEinleitung} /></p>
                <FormulaDerivationBox
                  defaultExpanded
                  title={inhalt.werte.beispiel1Titel}
                  zielGleichung="g = a - x_c(50\,\text{a}), \quad p_f = P\{g < 0\}"
                  schritte={inhalt.daten["Lebensdauerbemessung.beispiel1"]}
                  ergebnisHinweis={inhalt.werte.beispiel1Hinweis}
                  normQuelle={inhalt.werte.beispiel1Quelle}
                />
                <FormulaDerivationBox
                  defaultExpanded
                  title={inhalt.werte.beispiel2Titel}
                  zielGleichung="g = C_{crit} - C(a, 50\,\text{a}), \quad p_f = P\{g < 0\}"
                  schritte={inhalt.daten["Lebensdauerbemessung.beispiel2"]}
                  ergebnisHinweis={inhalt.werte.beispiel2Hinweis}
                  normQuelle={inhalt.werte.beispiel2Quelle}
                />
              </div>
            )}

            {/* ───────────── 6. DESKRIPTIV & ERC ───────────── */}
            {reiter === 'konzepte' && (
              <div className="flex flex-col gap-5">
                <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.kzEinleitung} /></p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[640px]">
                    <caption className="text-left text-xs font-bold text-text-main pb-2">{inhalt.werte.konzeptTitel}</caption>
                    <thead><tr><th scope="col" className={th}>Merkmal</th><th scope="col" className={th}>Deskriptiv (DIN 1045-2, EC2/NA)</th><th scope="col" className={th}>Leistungsprinzip (fib 34)</th><th scope="col" className={th}>ERC (EN 1992-1-1:2023)</th></tr></thead>
                    <tbody>{KONZEPTE.map(k => (
                      <tr key={k.merkmal}><th scope="row" className={td}>{k.merkmal}</th><td className={td}>{k.deskriptiv}</td><td className={td}>{k.leistung}</td><td className={td}>{k.erc}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[420px]">
                    <caption className="text-left text-xs font-bold text-text-main pb-2">{inhalt.werte.cminTitel}</caption>
                    <thead><tr><th scope="col" className={th}>Expositionsklasse</th><th scope="col" className={th}>c_min,dur</th><th scope="col" className={th}>Δc_dev</th><th scope="col" className={th}>c_nom</th></tr></thead>
                    <tbody>{CMINDUR.map(c => (
                      <tr key={c.klasse}><th scope="row" className={td}>{c.klasse}</th><td className={td}>{formatDeZahl(c.cmin, 0)} mm</td><td className={td}>{formatDeZahl(c.dev, 0)} mm</td><td className={td}>{formatDeZahl(c.cmin + c.dev, 0)} mm</td></tr>
                    ))}</tbody>
                  </table>
                </div>
                <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.kzDeskriptiv} /></p>
                <div className={kasten}><p><MdText text={inhalt.texte.kzVorhalte} /></p></div>
                <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.kzErc} /></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Querverweis ziel="normen_ausblick" titel={inhalt.texte.querNormen} linkText={inhalt.werte.zumModulNormen}>
                    <p><MdText text={inhalt.texte.querNormenText} /></p>
                  </Querverweis>
                  <Querverweis ziel="expositionsklassen" titel={inhalt.texte.querExposition} linkText={inhalt.werte.zumModulExposition}>
                    <p><MdText text={inhalt.texte.querExpositionText} /></p>
                  </Querverweis>
                </div>
              </div>
            )}

            {/* ───────────── 7. GRENZEN ───────────── */}
            {reiter === 'grenzen' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{inhalt.werte.grLeistetTitel}</h3><MdText text={inhalt.texte.grLeistet} /></div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{inhalt.werte.grNichtTitel}</h3><MdText text={inhalt.texte.grNicht} /></div>
                <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{inhalt.werte.grVorlaeufigTitel}</h3><MdText text={inhalt.texte.grVorlaeufig} /></div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.grFehler} /></h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><MdText text={inhalt.texte.grFehler1} /></li>
                    <li><MdText text={inhalt.texte.grFehler2} /></li>
                    <li><MdText text={inhalt.texte.grFehler3} /></li>
                    <li><MdText text={inhalt.texte.grFehler4} /></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </ModuleTabs>
      </div>

      <ModulTest moduleId="lebensdauerbemessung" />

      <ModuleFooter
        lastReviewed={inhalt.werte.stand}
        wikipedia={[
          { title: 'Monte-Carlo-Simulation', url: 'https://de.wikipedia.org/wiki/Monte-Carlo-Simulation' },
          { title: 'Carbonatisierung', url: 'https://de.wikipedia.org/wiki/Carbonatisierung' },
        ]}
        literatur={inhalt.daten["Lebensdauerbemessung.literatur"]}
        regelwerke={inhalt.daten["Lebensdauerbemessung.regelwerke"]}
        formeln={inhalt.daten["Lebensdauerbemessung.formeln"]}
      />
    </div>
  );
}

function ParameterTabelle({ titel, zeilen }: { titel: string; zeilen: Parameterzeile[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[620px]">
        <caption className="text-left text-xs font-bold text-text-main pb-2">{titel}</caption>
        <thead><tr><th scope="col" className={th}>Größe</th><th scope="col" className={th}>Verteilung</th><th scope="col" className={th}>Mittelwert ± Standardabweichung</th><th scope="col" className={th}>Quelle</th></tr></thead>
        <tbody>{zeilen.map(p => (
          <tr key={p.groesse}><th scope="row" className={`${td} font-mono`}>{p.groesse}</th><td className={td}>{p.verteilung}</td><td className={td}>{p.wert}</td><td className={td}>{p.quelle}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}
