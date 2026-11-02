import React, { useMemo, useState } from 'react';
import { BookOpen, Sigma, Layers, Boxes, ListChecks, Calculator, ShieldAlert, Scale, GraduationCap } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { formatDeZahl, formatDeTeX, parseDeZahl } from '@/src/utils/numberFormat';
import {
  ecKennwerte, charakteristischAusSerie, sigmaAusVorhalt, unterschreitung, fraktilfaktorKnBekannt,
  EC_KLASSEN, GAMMA_WIDERSTAND,
  type EcBaustoff, type Bemessungssituation, type EcZeile, type Verteilung,
} from '@/src/calc/ecKennwerte';
import { fraktilfaktorKn } from '@/src/calc/statistik';
import { pruefwerteAusText } from '@/src/calc/festbetonStatistik';
import { KMOD, KLED_NAME, type KLED, type Nutzungsklasse } from '@/src/calc/holzbau';
import { fkNA } from '@/src/calc/mauerwerk';
import { EC3_NA_DE } from '@/src/calc/stahlbau';
import { BETON_EC2, ALPHA_CC, ALPHA_CC_EN_EMPFEHLUNG, fcdBeton } from '@/src/data/kennwerte';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { AuswahlGruppe, alsOption } from '@/src/components/ui/Auswahlgruppe';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/eckennwerte/EcKennwerte.json';
import { MdText } from '@/src/components/inhalt/MdText';

type Reiter = 'grundlagen' | 'statistik' | 'beton' | 'baustoffe' | 'beispiele' | 'rechner' | 'grenzen';
const T = inhalt.texte, W = inhalt.werte;

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'grundlagen', label: W.reiterGrundlagen, icon: BookOpen },
  { id: 'statistik', label: W.reiterStatistik, icon: Sigma },
  { id: 'beton', label: W.reiterBeton, icon: Layers },
  { id: 'baustoffe', label: W.reiterBaustoffe, icon: Boxes },
  { id: 'beispiele', label: W.reiterBeispiele, icon: ListChecks },
  { id: 'rechner', label: W.reiterRechner, icon: Calculator },
  { id: 'grenzen', label: W.reiterGrenzen, icon: ShieldAlert },
];

const karte = 'bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30';
const kasten = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const formelKasten = 'p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto';
const absatz = 'text-sm text-text-main/85 leading-relaxed';
const th = 'p-2.5 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2.5 text-xs text-text-main/85 border-b border-home-grau/15 align-top';
const auswahlKlasse = 'w-full p-2 border border-home-grau/50 rounded-lg bg-white text-sm focus:outline-none focus:border-shiraz';
const feldKlasse = 'w-full p-2 border border-home-grau/50 rounded-lg bg-white text-sm font-mono focus:outline-none focus:border-shiraz';
const knopf = (an: boolean) => `px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${an ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/40 hover:border-shiraz'}`;

const tex = (x: number, d?: number) => formatDeTeX(x, d);
const zahl = (x: number, d?: number) => formatDeZahl(x, d);

const BAUSTOFFE: readonly { id: EcBaustoff; name: string }[] = [
  { id: 'beton', name: 'Beton' }, { id: 'betonstahl', name: 'Betonstahl' }, { id: 'baustahl', name: 'Baustahl' },
  { id: 'holz', name: 'Holz' }, { id: 'mauerwerk', name: 'Mauerwerk' },
];
const BAUSTOFF_NAME = Object.fromEntries(BAUSTOFFE.map(b => [b.id, b.name])) as Record<EcBaustoff, string>;
const REGEL: Record<EcBaustoff, { zeichen: string; zusatz: string; regel: string }> = {
  beton: { zeichen: '\\gamma_C', zusatz: '\\alpha_{cc} = 0{,}85', regel: 'DIN EN 1992-1-1/NA, Tab. 2.1DE' },
  betonstahl: { zeichen: '\\gamma_S', zusatz: '–', regel: 'DIN EN 1992-1-1/NA, Tab. 2.1DE' },
  baustahl: { zeichen: '\\gamma_{M0}', zusatz: '\\gamma_{M1}, \\gamma_{M2}', regel: 'DIN EN 1993-1-1/NA, 6.1' },
  holz: { zeichen: '\\gamma_M', zusatz: 'k_{mod}', regel: 'DIN EN 1995-1-1/NA, 2.4.1' },
  mauerwerk: { zeichen: '\\gamma_M', zusatz: '\\zeta = 0{,}85', regel: 'DIN EN 1996-1-1/NA, Tab. NA.1' },
};
const KLED_LISTE = Object.entries(KLED_NAME) as [string, KLED][];
const NKL: readonly Nutzungsklasse[] = [1, 2, 3];
const BETON_TABELLE = Object.values(BETON_EC2).sort((a, b) => a.fck - b.fck);
const KN_SPALTEN = [3, 4, 5, 6, 8, 10, 20, 30, Infinity];
const ART_NAME: Record<EcZeile['art'], string> = { mittel: W.artMittel, charakteristisch: W.artChar, bemessung: W.artBem, steifigkeit: W.artSteif, beiwert: W.artBeiwert };
const klassenName = (b: EcBaustoff, k: string) => {
  if (b !== 'mauerwerk') return k;
  if (k === 'frei') return W.freiEingabe;
  const e = fkNA(k);
  return e ? `${e.stein}, ${zahl(e.sfk, 0)}, ${e.moertel} (f_k = ${zahl(e.fk, 1)} N/mm²)` : k;
};

/** Bemessungsformel mit Zahlen (Rechenweg und Beispiele) */
function bemessungsTeX(b: EcBaustoff, xk: number, beiwert: number, gamma: number, xd: number): string {
  const g = `${REGEL[b].zeichen} = ${tex(gamma, 2)}`;
  if (b === 'beton') return `f_{cd} = \\alpha_{cc} \\cdot \\frac{f_{ck}}{\\gamma_C} = ${tex(beiwert, 2)} \\cdot \\frac{${tex(xk)}}{${tex(gamma, 2)}} = ${tex(xd, 2)}\\,\\text{N/mm}^2 \\quad (${g})`;
  if (b === 'betonstahl') return `f_{yd} = \\frac{f_{yk}}{\\gamma_S} = \\frac{${tex(xk)}}{${tex(gamma, 2)}} = ${tex(xd, 1)}\\,\\text{N/mm}^2`;
  if (b === 'baustahl') return `\\frac{f_y}{\\gamma_{M0}} = \\frac{${tex(xk)}}{${tex(gamma, 2)}} = ${tex(xd, 1)}\\,\\text{N/mm}^2`;
  if (b === 'holz') return `f_{m,d} = k_{mod} \\cdot \\frac{f_{m,k}}{\\gamma_M} = ${tex(beiwert, 2)} \\cdot \\frac{${tex(xk)}}{${tex(gamma, 2)}} = ${tex(xd, 2)}\\,\\text{N/mm}^2`;
  return `f_d = \\zeta \\cdot \\frac{f_k}{\\gamma_M} = ${tex(beiwert, 2)} \\cdot \\frac{${tex(xk, 1)}}{${tex(gamma, 2)}} = ${tex(xd, 2)}\\,\\text{N/mm}^2`;
}

function KennwertTabelle({ zeilen, titel }: { zeilen: readonly EcZeile[]; titel: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[520px]">
        <caption className="text-left text-xs font-bold text-text-main pb-2">{titel}</caption>
        <thead><tr><th scope="col" className={th}>{W.spGroesse}</th><th scope="col" className={th}>{W.spBenennung}</th><th scope="col" className={th}>{W.spWert}</th><th scope="col" className={th}>{W.spEinheit}</th></tr></thead>
        <tbody>{zeilen.map(z => (
          <tr key={z.zeichen} className={z.art === 'bemessung' ? 'bg-shiraz/5' : ''}>
            <th scope="row" className={td}><MdText text={`$${z.zeichen}$`} /></th>
            <td className={td}>{z.text} <span className="text-text-main/60">({ART_NAME[z.art]})</span></td>
            <td className={`${td} font-mono font-bold`}>{zahl(z.wert, z.art === 'beiwert' || z.wert < 10 ? 2 : 1)}</td>
            <td className={td}>{z.einheit}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

const SERIE_BEISPIEL = pruefwerteAusText(W.serieVorgabe);

export default function EcKennwerte() {
  const [reiter, setReiter] = useState<Reiter>('grundlagen');
  // Rechner
  const [baustoff, setBaustoff] = useState<EcBaustoff>('beton');
  const [klasse, setKlasse] = useState<string>('C30/37');
  const [situation, setSituation] = useState<Bemessungssituation>('staendig');
  const [alphaCc, setAlphaCc] = useState<number>(ALPHA_CC);
  const [nkl, setNkl] = useState<Nutzungsklasse>(1);
  const [kled, setKled] = useState<KLED>('mtl');
  const [fkText, setFkText] = useState('6,0');
  const [zeta, setZeta] = useState(0.85);
  // Prüfserie
  const [serieText, setSerieText] = useState(W.serieVorgabe);
  const [vxText, setVxText] = useState('');
  const [verteilung, setVerteilung] = useState<Verteilung>('normal');
  const [gammaSerie, setGammaSerie] = useState<number>(GAMMA_WIDERSTAND.beton.staendig);
  const [beiwertSerie, setBeiwertSerie] = useState<number>(ALPHA_CC);

  const wechsleBaustoff = (b: EcBaustoff) => { setBaustoff(b); setKlasse(EC_KLASSEN[b][b === 'beton' ? 4 : 0]); };
  const erg = ecKennwerte({ baustoff, klasse, situation, alphaCc, nkl, kled, fk: parseDeZahl(fkText), zeta });
  const vx = vxText.trim() === '' ? undefined : parseDeZahl(vxText);
  const serie = charakteristischAusSerie({ werte: pruefwerteAusText(serieText), verteilung, vxBekannt: vx, gammaM: gammaSerie, beiwert: beiwertSerie });

  // Beispiele (gleiche Kerne wie der Rechner)
  const bsp = useMemo(() => {
    const c30 = ecKennwerte({ baustoff: 'beton', klasse: 'C30/37', situation: 'staendig' });
    const b500 = ecKennwerte({ baustoff: 'betonstahl', klasse: 'B500B', situation: 'staendig' });
    const s355 = ecKennwerte({ baustoff: 'baustahl', klasse: 'S355', situation: 'staendig' });
    const gl24 = ecKennwerte({ baustoff: 'holz', klasse: 'GL24h', situation: 'staendig', nkl: 1, kled: 'mtl' });
    const mw = ecKennwerte({ baustoff: 'mauerwerk', klasse: 'KS-12-NMIIa', situation: 'staendig' });
    const sNorm = charakteristischAusSerie({ werte: SERIE_BEISPIEL, verteilung: 'normal', gammaM: GAMMA_WIDERSTAND.beton.staendig, beiwert: ALPHA_CC });
    const sLog = charakteristischAusSerie({ werte: SERIE_BEISPIEL, verteilung: 'lognormal', gammaM: GAMMA_WIDERSTAND.beton.staendig, beiwert: ALPHA_CC });
    return { c30, b500, s355, gl24, mw, sNorm, sLog };
  }, []);
  const w = (e: { zeilen: EcZeile[] }, zeichen: string) => e.zeilen.find(z => z.zeichen === zeichen)?.wert ?? NaN;
  const c = BETON_EC2['C30/37'];

  const schritte = erg.gueltig ? [
    { titel: W.charakteristisch, erklaerung: `${BAUSTOFF_NAME[baustoff]} ${klassenName(baustoff, klasse)}`, formel: `X_k = ${tex(erg.xk, 1)}\\,\\text{N/mm}^2` },
    { titel: REGEL[baustoff].regel, erklaerung: situation === 'staendig' ? W.staendig : W.aussergewoehnlich, formel: `${REGEL[baustoff].zeichen} = ${tex(erg.gamma, 2)}, \\quad \\eta = ${tex(erg.beiwert, 2)}` },
    { titel: W.bemessung, erklaerung: W.verhaeltnis, formel: `${bemessungsTeX(baustoff, erg.xk, erg.beiwert, erg.gamma, erg.xd)}, \\quad X_d/X_k = ${tex(erg.verhaeltnis, 3)}` },
  ] : [];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className={`${karte} flex flex-col gap-5`}>
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><Scale className="w-5 h-5 text-shiraz" /><MdText text={T.titel} /></h2>
          <p className="text-xs text-text-main/70 font-mono mt-1"><MdText text={T.untertitel} /></p>
        </div>
        <p className={absatz}><MdText text={T.einleitung} /></p>
        <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed flex items-start gap-2.5">
          <GraduationCap size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <p><MdText text={T.lehrhinweis} /></p>
        </div>

        <ModuleTabs label={W.reiterLabel} tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
          <div className="pt-5 animate-in fade-in duration-300">
            {reiter === 'grundlagen' && (
              <div className="flex flex-col gap-5">
                <p className={absatz}><MdText text={T.kKette} /></p>
                <div className={formelKasten}>
                  <BlockMath math="\underbrace{f_m,\ s}_{\text{Prüfung}} \;\longrightarrow\; \underbrace{X_k = f_m - k_n \cdot s}_{\text{5-\%-Quantil}} \;\longrightarrow\; \underbrace{X_d = \eta \cdot \frac{X_k}{\gamma_M}}_{\text{Bemessungswert}}" />
                </div>
                <p className={absatz}><MdText text={T.kSemi} /></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kasten}><p><MdText text={T.kEinwirkung} /></p></div>
                  <div className={kasten}><p><MdText text={T.kWiderstand} /></p></div>
                </div>
                <div className={formelKasten}>
                  <p className="text-xs text-text-main/70 mb-1"><MdText text={T.kNachweis} /></p>
                  <BlockMath math="E_d = E\{\gamma_G \cdot G_k;\ \gamma_Q \cdot Q_k\} \;\le\; R_d = R\left\{\eta \cdot \frac{X_k}{\gamma_M}\right\}" />
                </div>
                <p className={absatz}><MdText text={T.kSituationen} /></p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[560px]">
                    <caption className="text-left text-xs font-bold text-text-main pb-2">{T.kTabelleTitel}</caption>
                    <thead><tr><th scope="col" className={th}>{W.spBaustoff}</th><th scope="col" className={th}>{W.spBeiwert}</th><th scope="col" className={th}>{W.staendig}</th><th scope="col" className={th}>{W.aussergewoehnlich}</th><th scope="col" className={th}>{W.spBeiwertZusatz}</th><th scope="col" className={th}>{W.spRegel}</th></tr></thead>
                    <tbody>{BAUSTOFFE.map(b => (
                      <tr key={b.id}>
                        <th scope="row" className={td}>{b.name}</th>
                        <td className={td}><MdText text={`$${REGEL[b.id].zeichen}$`} /></td>
                        <td className={`${td} font-mono`}>{zahl(GAMMA_WIDERSTAND[b.id].staendig, 2)}</td>
                        <td className={`${td} font-mono`}>{zahl(GAMMA_WIDERSTAND[b.id].aussergewoehnlich, 2)}{b.id === 'baustahl' || b.id === 'holz' ? ' *' : ''}</td>
                        <td className={td}><MdText text={b.id === 'baustahl' ? `$\\gamma_{M1} = ${tex(EC3_NA_DE.gammaM1, 2)},\\ \\gamma_{M2} = ${tex(EC3_NA_DE.gammaM2, 2)}$` : `$${REGEL[b.id].zusatz}$`} /></td>
                        <td className={td}>{REGEL[b.id].regel}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                  <p className="text-xs text-text-main/70 mt-2">* <MdText text={T.kTabelleHinweis} /></p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kasten}><p><MdText text={T.kAlphaCc} /></p></div>
                  <div className={kasten}><p><MdText text={T.kKmod} /></p></div>
                  <div className={kasten}><p><MdText text={T.kZeta} /></p></div>
                  <div className={kasten}><p><MdText text={T.kStahl} /></p></div>
                </div>
                <Querverweis ziel="sicherheitskonzept" titel={T.querSicherheitTitel} linkText={W.zumModulSicherheit}><p><MdText text={T.querSicherheit} /></p></Querverweis>
              </div>
            )}

            {reiter === 'statistik' && (
              <div className="flex flex-col gap-5">
                <p className={absatz}><MdText text={T.sVerteilung} /></p>
                <div className={formelKasten}>
                  <BlockMath math={`X_k = m_X - 1{,}645 \\cdot \\sigma_X, \\qquad P(X < X_k) = \\Phi(-1{,}645) = ${tex(unterschreitung(1.645) * 100, 1)}\\,\\%`} />
                </div>
                <p className={absatz}><MdText text={T.sLognormal} /></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kasten}><p><MdText text={T.sVariation} /></p></div>
                  <div className={kasten}><p><MdText text={T.sVariationFolge} /></p></div>
                </div>
                <p className={absatz}><MdText text={T.sKn} /></p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[560px]">
                    <caption className="text-left text-xs font-bold text-text-main pb-2">{T.sKnTitel}</caption>
                    <thead><tr><th scope="col" className={th}>n</th>{KN_SPALTEN.map(n => <th scope="col" key={n} className={th}>{Number.isFinite(n) ? n : '∞'}</th>)}</tr></thead>
                    <tbody>
                      <tr><th scope="row" className={td}>{W.vxBekanntZeile}</th>{KN_SPALTEN.map(n => <td key={n} className={`${td} font-mono`}>{zahl(fraktilfaktorKnBekannt(n), 2)}</td>)}</tr>
                      <tr><th scope="row" className={td}>{W.vxUnbekannt}</th>{KN_SPALTEN.map(n => <td key={n} className={`${td} font-mono`}>{zahl(fraktilfaktorKn(n), 2)}</td>)}</tr>
                    </tbody>
                  </table>
                </div>
                <div className={kasten}>
                  <p><MdText text={T.sAcht} /></p>
                  <div className="overflow-x-auto"><BlockMath math={`f_{cm} - f_{ck} = 8\\,\\text{N/mm}^2 = 1{,}645 \\cdot \\sigma \\;\\Rightarrow\\; \\sigma = \\frac{8}{1{,}645} = ${tex(sigmaAusVorhalt(8), 2)}\\,\\text{N/mm}^2`} /></div>
                  <p className="mt-2"><MdText text={T.sAchtFolge} /></p>
                </div>
                <p className={absatz}><MdText text={T.sMittelVsChar} /></p>
                <div className={kasten}>
                  <p><MdText text={T.sKonformitaet} /></p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><MdText text={T.sKrit1} /></li>
                    <li><MdText text={T.sKrit2} /></li>
                  </ul>
                  <p className="mt-2"><MdText text={T.sKonfDeutung} /></p>
                </div>
                <p className={absatz}><MdText text={T.sIs} /></p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Querverweis ziel="statistik" titel={T.querStatistikTitel} linkText={W.zumModulStatistik}><p><MdText text={T.querStatistik} /></p></Querverweis>
                  <Querverweis ziel="festbeton_statistik" titel={T.querFestbetonTitel} linkText={W.zumModulFestbeton}><p><MdText text={T.querFestbeton} /></p></Querverweis>
                  <Querverweis ziel="historisch" titel={T.querHistTitel} linkText={W.zumModulHist}><p><MdText text={T.querHist} /></p></Querverweis>
                </div>
              </div>
            )}

            {reiter === 'beton' && (
              <div className="flex flex-col gap-5">
                <p className={absatz}><MdText text={T.bEinleitung} /></p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[760px]">
                    <caption className="text-left text-xs font-bold text-text-main pb-2">{T.bTabelleTitel}</caption>
                    <thead><tr>
                      {['Klasse', 'f_{ck}', 'f_{ck,cube}', 'f_{cm}', 'f_{ctm}', 'f_{ctk;0,05}', 'f_{ctk;0,95}', 'E_{cm}', '\\varepsilon_{c2}', '\\varepsilon_{cu2}', 'n', 'f_{cd}'].map((s, i) => (
                        <th scope="col" key={s} className={th}>{i === 0 ? W.spKlasse : <MdText text={`$${s}$`} />}</th>
                      ))}
                    </tr></thead>
                    <tbody>{BETON_TABELLE.map(k => (
                      <tr key={k.id}>
                        <th scope="row" className={`${td} font-bold`}>{k.name}</th>
                        <td className={`${td} font-mono`}>{zahl(k.fck, 0)}</td>
                        <td className={`${td} font-mono`}>{zahl(k.fck_cube, 0)}</td>
                        <td className={`${td} font-mono`}>{zahl(k.fcm, 0)}</td>
                        <td className={`${td} font-mono`}>{zahl(k.fctm, 1)}</td>
                        <td className={`${td} font-mono`}>{zahl(k.fctk_005, 1)}</td>
                        <td className={`${td} font-mono`}>{zahl(k.fctk_095, 1)}</td>
                        <td className={`${td} font-mono`}>{zahl(k.Ecm, 0)}</td>
                        <td className={`${td} font-mono`}>{zahl(k.eps_c2, 1)}</td>
                        <td className={`${td} font-mono`}>{zahl(k.eps_cu2, 1)}</td>
                        <td className={`${td} font-mono`}>{zahl(k.n, 2)}</td>
                        <td className={`${td} font-mono font-bold`}>{zahl(fcdBeton(k.fck, { hochfest: false }), 1)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                  <p className="text-xs text-text-main/70 mt-2"><MdText text={T.bTabelleHinweis} /></p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kasten}><p><MdText text={T.bFctm} /></p></div>
                  <div className={kasten}><p><MdText text={T.bEcm} /></p></div>
                  <div className={kasten}><p><MdText text={T.bDehnung} /></p></div>
                  <div className={kasten}><p><MdText text={T.bFcd} /></p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Querverweis ziel="betonkennwerte" titel={T.querBetonTitel} linkText={W.zumModulBeton}><p><MdText text={T.querBeton} /></p></Querverweis>
                  <Querverweis ziel="stahlbeton_bemessung" titel={T.querStbTitel} linkText={W.zumModulStb}><p><MdText text={T.querStb} /></p></Querverweis>
                </div>
              </div>
            )}

            {reiter === 'baustoffe' && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kasten}><p><MdText text={T.wBetonstahl} /></p></div>
                  <div className={kasten}><p><MdText text={T.wBaustahl} /></p></div>
                </div>
                <p className={absatz}><MdText text={T.wHolz} /></p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[520px]">
                    <caption className="text-left text-xs font-bold text-text-main pb-2">{T.wKmodTitel}</caption>
                    <thead><tr><th scope="col" className={th}>{W.nkl}</th>{KLED_LISTE.map(([name]) => <th scope="col" key={name} className={th}>{name}</th>)}</tr></thead>
                    <tbody>{NKL.map(n => (
                      <tr key={n}><th scope="row" className={td}>NKL {n}</th>{KLED_LISTE.map(([name, k]) => <td key={name} className={`${td} font-mono`}>{zahl(KMOD[n][k], 2)}</td>)}</tr>
                    ))}</tbody>
                  </table>
                  <p className="text-xs text-text-main/70 mt-2"><MdText text={T.wNkl} /></p>
                </div>
                <p className={absatz}><MdText text={T.wMauerwerk} /></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Querverweis ziel="stahlbau_ec3" titel={T.querStahlTitel} linkText={W.zumModulStahl}><p><MdText text={T.querStahl} /></p></Querverweis>
                  <Querverweis ziel="holzbau_bemessung" titel={T.querHolzTitel} linkText={W.zumModulHolz}><p><MdText text={T.querHolz} /></p></Querverweis>
                  <Querverweis ziel="mauerwerk" titel={T.querMwTitel} linkText={W.zumModulMw}><p><MdText text={T.querMw} /></p></Querverweis>
                </div>
              </div>
            )}

            {reiter === 'beispiele' && (
              <div className="flex flex-col gap-5">
                <p className={absatz}><MdText text={T.eEinleitung} /></p>
                <section className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{T.e1Titel}</h3>
                  <p><MdText text={T.e1Text} /></p>
                  <div className="overflow-x-auto">
                    <BlockMath math={`f_{cm} = f_{ck} + 8 = ${tex(c.fck)} + 8 = ${tex(w(bsp.c30, 'f_{cm}'))}\\,\\text{N/mm}^2`} />
                    <BlockMath math={`f_{ctm} = 0{,}30 \\cdot f_{ck}^{2/3} = 0{,}30 \\cdot ${tex(c.fck)}^{2/3} = ${tex(0.3 * Math.pow(c.fck, 2 / 3), 2)} \\approx ${tex(w(bsp.c30, 'f_{ctm}'), 1)}\\,\\text{N/mm}^2, \\quad f_{ctk;0,05} = 0{,}7 \\cdot f_{ctm} = ${tex(w(bsp.c30, 'f_{ctk;0,05}'), 1)}\\,\\text{N/mm}^2`} />
                    <BlockMath math={`E_{cm} = 22\\,000 \\cdot \\left(\\frac{${tex(c.fcm)}}{10}\\right)^{0{,}3} = ${tex(22000 * Math.pow(c.fcm / 10, 0.3), 0)} \\approx ${tex(w(bsp.c30, 'E_{cm}'), 0)}\\,\\text{N/mm}^2`} />
                    <BlockMath math={bemessungsTeX('beton', bsp.c30.xk, bsp.c30.beiwert, bsp.c30.gamma, bsp.c30.xd)} />
                    <BlockMath math={`f_{ctd} = \\alpha_{ct} \\cdot \\frac{f_{ctk;0,05}}{\\gamma_C} = 0{,}85 \\cdot \\frac{${tex(w(bsp.c30, 'f_{ctk;0,05}'), 1)}}{${tex(bsp.c30.gamma, 2)}} = ${tex(w(bsp.c30, 'f_{ctd}'), 2)}\\,\\text{N/mm}^2`} />
                  </div>
                  <p className="mt-1"><MdText text={T.e1Fazit} /></p>
                </section>
                <section className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{T.e2Titel}</h3>
                  <p><MdText text={T.e2Text} /></p>
                  <div className="overflow-x-auto">
                    <BlockMath math={bemessungsTeX('betonstahl', bsp.b500.xk, 1, bsp.b500.gamma, bsp.b500.xd)} />
                    <BlockMath math={`\\varepsilon_{yd} = \\frac{f_{yd}}{E_s} = \\frac{${tex(bsp.b500.xd, 1)}}{${tex(w(bsp.b500, 'E_s'), 0)}} = ${tex(w(bsp.b500, '\\varepsilon_{yd}'), 2)}\\,\\text{‰}`} />
                  </div>
                </section>
                <section className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{T.e3Titel}</h3>
                  <p><MdText text={T.e3Text} /></p>
                  <div className="overflow-x-auto">
                    <BlockMath math={`\\frac{f_y}{\\gamma_{M0}} = \\frac{${tex(bsp.s355.xk)}}{${tex(EC3_NA_DE.gammaM0, 1)}} = ${tex(w(bsp.s355, 'f_y/\\gamma_{M0}'), 1)}, \\quad \\frac{f_y}{\\gamma_{M1}} = \\frac{${tex(bsp.s355.xk)}}{${tex(EC3_NA_DE.gammaM1, 1)}} = ${tex(w(bsp.s355, 'f_y/\\gamma_{M1}'), 1)}, \\quad \\frac{0{,}9 \\cdot f_u}{\\gamma_{M2}} = \\frac{0{,}9 \\cdot ${tex(w(bsp.s355, 'f_u'))}}{${tex(EC3_NA_DE.gammaM2, 2)}} = ${tex(w(bsp.s355, '0{,}9\\,f_u/\\gamma_{M2}'), 1)}\\;\\text{N/mm}^2`} />
                  </div>
                </section>
                <section className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{T.e4Titel}</h3>
                  <p><MdText text={T.e4Text} /></p>
                  <div className="overflow-x-auto">
                    <BlockMath math={bemessungsTeX('holz', bsp.gl24.xk, bsp.gl24.beiwert, bsp.gl24.gamma, bsp.gl24.xd)} />
                  </div>
                  <p className="mt-1"><MdText text={T.e4Fazit} /></p>
                </section>
                <section className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{T.e5Titel}</h3>
                  <p><MdText text={T.e5Text} /></p>
                  <div className="overflow-x-auto"><BlockMath math={bemessungsTeX('mauerwerk', bsp.mw.xk, bsp.mw.beiwert, bsp.mw.gamma, bsp.mw.xd)} /></div>
                </section>
                <section className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{T.e6Titel}</h3>
                  <p><MdText text={T.e6Text} /></p>
                  <p className="font-mono text-xs mt-1">{SERIE_BEISPIEL.map(v => zahl(v, 1)).join('; ')}</p>
                  <div className="overflow-x-auto">
                    <BlockMath math={`m_x = ${tex(bsp.sNorm.mittelwert, 2)}, \\quad s_x = ${tex(bsp.sNorm.stdAbw, 2)}, \\quad V_x = ${tex(bsp.sNorm.vx, 3)}\\quad(\\text{N/mm}^2)`} />
                    <BlockMath math={`X_k = m_x - k_n \\cdot s_x = ${tex(bsp.sNorm.mittelwert, 2)} - ${tex(bsp.sNorm.kn, 2)} \\cdot ${tex(bsp.sNorm.stdAbw, 2)} = ${tex(bsp.sNorm.xk, 1)}\\,\\text{N/mm}^2 \\quad (\\text{lognormal: } ${tex(bsp.sLog.xk, 1)})`} />
                    <BlockMath math={`X_d = 0{,}85 \\cdot \\frac{${tex(bsp.sNorm.xk, 1)}}{1{,}5} = ${tex(bsp.sNorm.xd, 1)}\\,\\text{N/mm}^2`} />
                  </div>
                  <p className="mt-1"><MdText text={T.e6Fazit} /></p>
                </section>
              </div>
            )}

            {reiter === 'rechner' && (
              <div className="flex flex-col gap-5">
                <p className={absatz}><MdText text={T.rEinleitung} /></p>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    <div>
                      <p className="text-xs font-bold text-text-main mb-1.5" id="ec-baustoff">{W.baustoff}</p>
                      <AuswahlGruppe label={W.baustoff} className="flex flex-wrap gap-2" aria-labelledby="ec-baustoff">
                        {BAUSTOFFE.map(b => <button key={b.id} type="button" className={knopf(baustoff === b.id)} {...alsOption(baustoff === b.id)} onClick={() => wechsleBaustoff(b.id)}>{b.name}</button>)}
                      </AuswahlGruppe>
                    </div>
                    <label className="flex flex-col gap-1 text-xs font-bold text-text-main">{W.klasse}
                      <select className={auswahlKlasse} value={klasse} onChange={ev => setKlasse(ev.target.value)}>
                        {EC_KLASSEN[baustoff].map(k => <option key={k} value={k}>{klassenName(baustoff, k)}</option>)}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-bold text-text-main">{W.situation}
                      <select className={auswahlKlasse} value={situation} onChange={ev => setSituation(ev.target.value as Bemessungssituation)}>
                        <option value="staendig">{W.staendig}</option>
                        <option value="aussergewoehnlich">{W.aussergewoehnlich}</option>
                      </select>
                    </label>
                    {baustoff === 'beton' && (
                      <label className="flex flex-col gap-1 text-xs font-bold text-text-main">{W.alphaCc}
                        <select className={auswahlKlasse} value={alphaCc} onChange={ev => setAlphaCc(Number(ev.target.value))}>
                          <option value={ALPHA_CC}>{zahl(ALPHA_CC, 2)} (NA DE)</option>
                          <option value={ALPHA_CC_EN_EMPFEHLUNG}>{zahl(ALPHA_CC_EN_EMPFEHLUNG, 2)} (EN-Empfehlung, Vergleich)</option>
                        </select>
                      </label>
                    )}
                    {baustoff === 'holz' && (
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex flex-col gap-1 text-xs font-bold text-text-main">{W.nkl}
                          <select className={auswahlKlasse} value={nkl} onChange={ev => setNkl(Number(ev.target.value) as Nutzungsklasse)}>
                            {NKL.map(n => <option key={n} value={n}>NKL {n}</option>)}
                          </select>
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-bold text-text-main">{W.kled}
                          <select className={auswahlKlasse} value={kled} onChange={ev => setKled(ev.target.value as KLED)}>
                            {KLED_LISTE.map(([name, k]) => <option key={k} value={k}>{name}</option>)}
                          </select>
                        </label>
                      </div>
                    )}
                    {baustoff === 'mauerwerk' && (
                      <div className="grid grid-cols-2 gap-3">
                        {klasse === 'frei' && (
                          <label className="flex flex-col gap-1 text-xs font-bold text-text-main">{W.fkFrei}
                            <input className={feldKlasse} inputMode="decimal" value={fkText} onChange={ev => setFkText(ev.target.value)} />
                          </label>
                        )}
                        <label className="flex flex-col gap-1 text-xs font-bold text-text-main">{W.zeta}
                          <select className={auswahlKlasse} value={zeta} onChange={ev => setZeta(Number(ev.target.value))}>
                            <option value={0.85}>0,85 (Dauerlast)</option>
                            <option value={1}>1,00 (kurzzeitig, vorläufig)</option>
                          </select>
                        </label>
                      </div>
                    )}
                    <EingabeHinweise hinweise={erg.hinweise} />
                  </div>
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-3" aria-live="polite">
                      {[[W.charakteristisch, erg.xk], [W.bemessung, erg.xd], [W.verhaeltnis, erg.verhaeltnis]].map(([name, wert], i) => (
                        <div key={String(name)} className="p-3 rounded-xl border border-home-grau/30 bg-off-white text-center">
                          <div className="text-[11px] text-text-main/70">{name}</div>
                          <div className="font-mono font-bold text-lg text-shiraz">{zahl(Number(wert), i === 2 ? 3 : 1)}{i < 2 ? ' N/mm²' : ''}</div>
                        </div>
                      ))}
                    </div>
                    <KennwertTabelle zeilen={erg.zeilen} titel={`${BAUSTOFF_NAME[baustoff]} ${erg.gueltig ? klassenName(baustoff, klasse) : '–'}`} />
                    <FormulaDerivationBox live title={W.rechenweg} zielGleichung="X_d = \eta \cdot X_k / \gamma_M" schritte={schritte} normQuelle={REGEL[baustoff].regel} />
                  </div>
                </div>

                <div className={`${kasten} flex flex-col gap-3`}>
                  <h3 className="font-bold text-text-main text-sm">{T.rSerieTitel}</h3>
                  <p className="text-xs"><MdText text={T.rSerieText} /></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <label className="flex flex-col gap-1 text-xs font-bold text-text-main md:col-span-2">{W.werte}
                      <input className={feldKlasse} value={serieText} onChange={ev => setSerieText(ev.target.value)} />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-bold text-text-main">{W.vx}
                      <input className={feldKlasse} inputMode="decimal" value={vxText} onChange={ev => setVxText(ev.target.value)} />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-bold text-text-main">{W.verteilung}
                      <select className={auswahlKlasse} value={verteilung} onChange={ev => setVerteilung(ev.target.value as Verteilung)}>
                        <option value="normal">{W.normal}</option>
                        <option value="lognormal">{W.lognormal}</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-bold text-text-main">{W.gammaSerie}
                      <select className={auswahlKlasse} value={gammaSerie} onChange={ev => setGammaSerie(Number(ev.target.value))}>
                        {[...new Set(BAUSTOFFE.map(b => GAMMA_WIDERSTAND[b.id].staendig))].map(g => <option key={g} value={g}>{zahl(g, 2)}</option>)}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-bold text-text-main">{W.beiwertSerie}
                      <select className={auswahlKlasse} value={beiwertSerie} onChange={ev => setBeiwertSerie(Number(ev.target.value))}>
                        {[1, ALPHA_CC, 0.8, 0.6].map(b => <option key={b} value={b}>{zahl(b, 2)}</option>)}
                      </select>
                    </label>
                  </div>
                  <EingabeHinweise hinweise={serie.hinweise} />
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[560px]">
                      <caption className="text-left text-xs font-bold text-text-main pb-2">{T.rKetteTitel}</caption>
                      <thead><tr>{[W.anzahl, W.mittelwert, W.stdAbw, W.variationskoeffizient, W.kn, W.charakteristisch, W.vorhalt, W.bemessung].map(s => <th scope="col" key={s} className={th}>{s}</th>)}</tr></thead>
                      <tbody><tr>
                        <td className={`${td} font-mono`}>{zahl(serie.n, 0)}</td>
                        <td className={`${td} font-mono`}>{zahl(serie.mittelwert, 2)}</td>
                        <td className={`${td} font-mono`}>{zahl(serie.stdAbw, 2)}</td>
                        <td className={`${td} font-mono`}>{zahl(serie.vx, 3)}</td>
                        <td className={`${td} font-mono`}>{zahl(serie.kn, 2)}</td>
                        <td className={`${td} font-mono font-bold`}>{zahl(serie.xk, 1)}</td>
                        <td className={`${td} font-mono`}>{zahl(serie.vorhalt, 1)}</td>
                        <td className={`${td} font-mono font-bold`}>{zahl(serie.xd, 1)}</td>
                      </tr></tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {reiter === 'grenzen' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{W.grLeistetTitel}</h3><MdText text={T.gLeistet} /></div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{W.grNichtTitel}</h3><MdText text={T.gNicht} /></div>
                <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{W.grVorlaeufigTitel}</h3><MdText text={T.gVorlaeufig} /></div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5">{T.gFehler}</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><MdText text={T.gFehler1} /></li>
                    <li><MdText text={T.gFehler2} /></li>
                    <li><MdText text={T.gFehler3} /></li>
                    <li><MdText text={T.gFehler4} /></li>
                    <li><MdText text={T.gFehler5} /></li>
                  </ul>
                </div>
                <div className="md:col-span-2 p-4 rounded-xl border border-home-grau/30 bg-off-white text-xs text-text-main/85 leading-relaxed flex flex-col gap-2">
                  <h3 className="font-bold text-text-main text-sm">{T.gAusblickTitel}</h3>
                  <p><MdText text={T.gAusblick} /></p>
                  <p><MdText text={T.gAusblick2} /></p>
                </div>
                <Querverweis className="md:col-span-2" ziel="normen_ausblick" titel={T.querNormenTitel} linkText={W.zumModulNormen}><p><MdText text={T.querNormen} /></p></Querverweis>
              </div>
            )}
          </div>
        </ModuleTabs>
      </div>

      <ModulTest moduleId="ec_kennwerte" />

      <ModuleFooter
        lastReviewed={W.stand}
        normIds={['DIN_EN_1990', 'DIN_EN_1992_1_1', 'DIN_EN_1993_1_1', 'DIN_EN_1995_1_1', 'DIN_EN_1996_1_1', 'DIN_EN_206', 'DIN_EN_338', 'DIN_EN_10025']}
        literatur={inhalt.daten['ecKennwerte.literatur']}
        formeln={inhalt.daten['ecKennwerte.formeln']}
      />
    </div>
  );
}
