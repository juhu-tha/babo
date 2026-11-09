import React, { useMemo, useState } from 'react';
import { Compass } from 'lucide-react';
import { Slider } from '@/src/components/ui/Slider';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { BloomLernziele, type BloomGoalItem } from '@/src/components/ui/BloomLernziele';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { DiagrammHuelle } from '@/src/lib/diagrammAlternative';
import { MdText } from '@/src/components/inhalt/MdText';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { hauptspannungen, transformiere, type EbenerSpannungszustand } from '@/src/calc/spannungszustand';
import { BAUSTAHL_EC3 } from '@/src/data/kennwerte';
import inhalt from '@/content/festigkeitsberechnungen/Spannungszustand.json';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

/** Formeln und Quellen des Reiters für den Modulfuß */
export const SPANNUNGSZUSTAND_FUSS = { formeln: inhalt.daten.formeln, literatur: inhalt.daten.literatur, weblinks: inhalt.daten.weblinks };

const karte = 'bg-off-white p-5 rounded-xl border border-home-grau/30';
type Vergleich = 'keiner' | 'S235' | 'S355';

/** Mohr'scher Kreis als SVG (τ nach unten positiv) mit Bildpunkten X, Y und dem gedrehten Schnitt ξ/η */
function MohrKreisSvg({ z, theta, beschreibung }: { z: EbenerSpannungszustand; theta: number; beschreibung: string }) {
  const r = hauptspannungen(z);
  const g = transformiere(z, theta);
  const W = 420, H = 320, m = 34;
  const sMin = Math.min(r.sigma2, 0), sMax = Math.max(r.sigma1, 0);
  const tMax = Math.max(r.R, 1e-9);
  const breite = Math.max(sMax - sMin, 1e-9);
  const s = Math.min((W - 2 * m) / breite, (H - 2 * m) / (2 * tMax));
  const x0 = m + ((W - 2 * m) - breite * s) / 2 - sMin * s;
  const y0 = H / 2;
  const X = (sigma: number) => x0 + sigma * s;
  const Y = (tau: number) => y0 + tau * s; // τ nach unten positiv
  const punkt = (sig: number, tau: number, name: string, farbe: string, dx = 6, dy = -6) => (
    <g>
      <circle cx={X(sig)} cy={Y(tau)} r={4.5} fill={farbe} />
      <text x={X(sig) + dx} y={Y(tau) + dy} fontSize={12} fontWeight={700} fill={farbe}>{name}</text>
    </g>
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto text-text-main" role="img" aria-label={beschreibung}>
      {/* Achsen */}
      <line x1={8} y1={y0} x2={W - 8} y2={y0} stroke="currentColor" strokeWidth={1} opacity={0.6} />
      <text x={W - 10} y={y0 - 6} fontSize={12} textAnchor="end" fill="currentColor">σ</text>
      <line x1={X(0)} y1={8} x2={X(0)} y2={H - 8} stroke="currentColor" strokeWidth={1} opacity={0.6} />
      <text x={X(0) + 6} y={H - 12} fontSize={12} fill="currentColor">τ (+)</text>
      {/* Kreis */}
      <circle cx={X(r.sigmaM)} cy={y0} r={r.R * s} fill="rgba(163,17,62,0.06)" stroke="#A3113E" strokeWidth={2} />
      <circle cx={X(r.sigmaM)} cy={y0} r={2.5} fill="currentColor" />
      <text x={X(r.sigmaM)} y={y0 + 16} fontSize={11} textAnchor="middle" fill="currentColor">M</text>
      {/* Durchmesser X–Y und ξ–η */}
      <line x1={X(z.sx)} y1={Y(z.txy)} x2={X(z.sy)} y2={Y(-z.txy)} stroke="#475569" strokeWidth={1.5} strokeDasharray="5 4" />
      <line x1={X(g.sXi)} y1={Y(g.tXiEta)} x2={X(g.sEta)} y2={Y(-g.tXiEta)} stroke="#2563eb" strokeWidth={2} />
      {punkt(r.sigma1, 0, 'σ₁', '#A3113E', 4, 16)}
      {punkt(r.sigma2, 0, 'σ₂', '#A3113E', -22, 16)}
      {punkt(z.sx, z.txy, 'X', '#475569')}
      {punkt(z.sy, -z.txy, 'Y', '#475569')}
      {theta !== 0 && punkt(g.sXi, g.tXiEta, 'ξ', '#2563eb', 6, 14)}
      {theta !== 0 && punkt(g.sEta, -g.tXiEta, 'η', '#2563eb', 6, 14)}
    </svg>
  );
}

/** Skizze des um θ gedrehten Elements (gegen den Uhrzeigersinn) */
function ElementSkizze({ theta }: { theta: number }) {
  return (
    <svg viewBox="0 0 160 160" className="w-40 h-40 text-text-main" role="img" aria-label={`${inhalt.werte.elementBeschreibung} θ = ${formatDeZahl(theta, 0)}°.`}>
      <line x1={10} y1={80} x2={150} y2={80} stroke="currentColor" opacity={0.4} />
      <line x1={80} y1={150} x2={80} y2={10} stroke="currentColor" opacity={0.4} />
      <text x={148} y={94} fontSize={11} textAnchor="end" fill="currentColor">x</text>
      <text x={86} y={18} fontSize={11} fill="currentColor">y</text>
      <g transform={`rotate(${-theta} 80 80)`}>
        <rect x={52} y={52} width={56} height={56} fill="rgba(37,99,235,0.12)" stroke="#2563eb" strokeWidth={2} />
        <line x1={108} y1={80} x2={140} y2={80} stroke="#2563eb" strokeWidth={2} />
        <polygon points="140,80 132,76 132,84" fill="#2563eb" />
        <text x={140} y={74} fontSize={12} fontWeight={700} fill="#2563eb">ξ</text>
        <line x1={80} y1={52} x2={80} y2={20} stroke="#2563eb" strokeWidth={2} />
        <polygon points="80,20 76,28 84,28" fill="#2563eb" />
        <text x={86} y={24} fontSize={12} fontWeight={700} fill="#2563eb">η</text>
      </g>
    </svg>
  );
}

export default function Spannungszustand() {
  const [sx, setSx] = useState(200);
  const [sy, setSy] = useState(40);
  const [txy, setTxy] = useState(60);
  const [theta, setTheta] = useState(0);
  const [vergleich, setVergleich] = useState<Vergleich>('keiner');
  const z = useMemo(() => ({ sx, sy, txy }), [sx, sy, txy]);
  const fy = vergleich === 'keiner' ? undefined : BAUSTAHL_EC3[vergleich].fy;
  const r = useMemo(() => hauptspannungen(z, fy), [z, fy]);
  const g = useMemo(() => transformiere(z, theta), [z, theta]);
  const ok = !r.hinweise.some(h => h.stufe === 'fehler');

  const beschreibung = `${inhalt.werte.diagrammTitel}: Mittelpunkt σ_M = ${formatDeZahl(r.sigmaM, 1)} N/mm², Radius R = ${formatDeZahl(r.R, 1)} N/mm², `
    + `Hauptspannungen σ₁ = ${formatDeZahl(r.sigma1, 1)} und σ₂ = ${formatDeZahl(r.sigma2, 1)} N/mm². Bildpunkt X (${formatDeZahl(sx, 0)}; ${formatDeZahl(txy, 0)}), Y (${formatDeZahl(sy, 0)}; ${formatDeZahl(-txy, 0)}); `
    + `gedrehter Schnitt θ = ${formatDeZahl(theta, 0)}°: σ_ξ = ${formatDeZahl(g.sXi, 1)}, τ_ξη = ${formatDeZahl(g.tXiEta, 1)} N/mm².`;
  const daten = {
    datasets: [
      { label: 'Bildpunkte X und Y', data: [{ x: sx, y: txy }, { x: sy, y: -txy }] },
      { label: 'Hauptspannungen σ₁ und σ₂', data: [{ x: r.sigma1, y: 0 }, { x: r.sigma2, y: 0 }] },
      { label: `Gedrehter Schnitt ξ und η (θ = ${formatDeZahl(theta, 0)}°)`, data: [{ x: g.sXi, y: g.tXiEta }, { x: g.sEta, y: -g.tXiEta }] },
    ],
  };
  const optionen = { scales: { x: { title: { text: inhalt.werte.achseSigma } }, y: { title: { text: inhalt.werte.achseTau } } }, plugins: { title: { text: inhalt.werte.diagrammTitel } } };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <BloomLernziele titelElement="p" titelKlasse="wie-h4" moduleId="festigkeit_spannungszustand" moduleTitle={inhalt.werte.lernzielTitel} timeMinutes={45} goals={inhalt.daten.lernziele as BloomGoalItem[]} />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><Compass className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.titel} /></h2>
        <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.einleitung} /></p>
        <p className="text-sm text-text-main/85 leading-relaxed bg-off-white p-4 rounded-xl border border-home-grau/30"><MdText text={inhalt.texte.kreisErklaerung} /></p>
        <p className="text-xs text-text-main/75"><MdText text={inhalt.texte.vorzeichen} /></p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${karte} flex flex-col gap-4`}>
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.eingaben} /></h3>
            <Slider id="mohr-sx" label={<FormulaText text="σ_x" />} info={inhalt.werte.infoSx} min={-400} max={400} step={5} value={sx} unit="N/mm²" onChange={e => setSx(Number(e.target.value))} />
            <Slider id="mohr-sy" label={<FormulaText text="σ_y" />} info={inhalt.werte.infoSy} min={-400} max={400} step={5} value={sy} unit="N/mm²" onChange={e => setSy(Number(e.target.value))} />
            <Slider id="mohr-txy" label={<FormulaText text="τ_xy" />} info={inhalt.werte.infoTxy} min={-300} max={300} step={5} value={txy} unit="N/mm²" onChange={e => setTxy(Number(e.target.value))} />
            <Slider id="mohr-theta" label={<FormulaText text="Drehwinkel θ" />} info={inhalt.werte.infoTheta} min={-90} max={90} step={1} value={theta} unit="°" onChange={e => setTheta(Number(e.target.value))} />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setTheta(Math.round(r.phi1Grad))} disabled={!ok} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-shiraz text-white disabled:opacity-50"><MdText text={inhalt.texte.zurHauptrichtung} /></button>
              <button type="button" onClick={() => setTheta(Math.round(r.phiTauGrad))} disabled={!ok} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-shiraz text-shiraz bg-white"><MdText text={inhalt.texte.zuTauMax} /></button>
              <button type="button" onClick={() => setTheta(0)} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-home-grau/40 bg-white text-text-main"><MdText text={inhalt.texte.zuruecksetzen} /></button>
            </div>
            <label className="text-sm font-medium text-text-main flex flex-col gap-1">
              <MdText text={inhalt.texte.vergleich} />
              <select value={vergleich} onChange={e => setVergleich(e.target.value as Vergleich)} className="p-2 border border-home-grau/30 rounded-lg bg-white">
                <option value="keiner">{inhalt.texte.vergleichKeiner}</option>
                <option value="S235">S235 (f_y = {formatDeZahl(BAUSTAHL_EC3.S235.fy, 0)} N/mm²)</option>
                <option value="S355">S355 (f_y = {formatDeZahl(BAUSTAHL_EC3.S355.fy, 0)} N/mm²)</option>
              </select>
            </label>
          </div>

          <div className={`${karte} lg:col-span-2 flex flex-col gap-3`}>
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.kreis} /></h3>
            {ok && (
              <DiagrammHuelle art="scatter" daten={daten} optionen={optionen} ariaLabel={beschreibung} modus="verhaeltnis">
                {(b) => <MohrKreisSvg z={z} theta={theta} beschreibung={b} />}
              </DiagrammHuelle>
            )}
            <h4 className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.element} /></h4>
            <div className="flex flex-wrap items-center gap-4">
              <ElementSkizze theta={theta} />
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt className="text-text-main/75">σ<sub>ξ</sub></dt><dd className="font-bold tabular-nums">{formatDeZahl(g.sXi, 1)} N/mm²</dd>
                <dt className="text-text-main/75">σ<sub>η</sub></dt><dd className="font-bold tabular-nums">{formatDeZahl(g.sEta, 1)} N/mm²</dd>
                <dt className="text-text-main/75">τ<sub>ξη</sub></dt><dd className="font-bold tabular-nums">{formatDeZahl(g.tXiEta, 1)} N/mm²</dd>
              </dl>
            </div>
          </div>
        </div>

        <EingabeHinweise hinweise={r.hinweise} />
        <ErgebnisAnsage text={ok ? kurzzeile(ansageWert('σ₁', r.sigma1, 1, 'N/mm²'), ansageWert('σ₂', r.sigma2, 1, 'N/mm²'), ansageWert('Hauptrichtung', r.phi1Grad, 1, '°'), ansageWert('Vergleichsspannung nach Mises', r.sigmaVMises, 1, 'N/mm²'), fy !== undefined && ansageWert('Ausnutzung', r.eta, 2)) : 'Hauptspannungen –'} />
        {ok && (
          <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/20">
            <h3 className="text-sm font-bold text-shiraz uppercase tracking-wider mb-3"><MdText text={inhalt.texte.ergebnisse} /></h3>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><dt className="text-text-main/75"><FormulaText text="σ₁ / σ₂" /></dt><dd className="text-lg font-bold tabular-nums">{formatDeZahl(r.sigma1, 1)} / {formatDeZahl(r.sigma2, 1)} N/mm²</dd></div>
              <div><dt className="text-text-main/75"><FormulaText text="Hauptrichtung φ₁" /></dt><dd className="text-lg font-bold tabular-nums">{formatDeZahl(r.phi1Grad, 1)}°</dd></div>
              <div><dt className="text-text-main/75"><FormulaText text="τ_max (Ebene) / räumlich" /></dt><dd className="text-lg font-bold tabular-nums">{formatDeZahl(r.tauMax, 1)} / {formatDeZahl(r.tauMaxRaeumlich, 1)} N/mm²</dd></div>
              <div><dt className="text-text-main/75"><FormulaText text="σ_v (Mises / Tresca)" /></dt><dd className="text-lg font-bold tabular-nums">{formatDeZahl(r.sigmaVMises, 1)} / {formatDeZahl(r.sigmaVTresca, 1)} N/mm²</dd></div>
              {fy !== undefined && <div><dt className="text-text-main/75"><FormulaText text="Ausnutzung σ_v/f_y" /></dt><dd className="text-lg font-bold tabular-nums">{formatDeZahl(r.eta, 2)}</dd></div>}
            </dl>
          </div>
        )}
        <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.anwendung} /></p>
      </div>

      {ok && (
        <FormulaDerivationBox
          live
          title={inhalt.werte.rechenwegTitel}
          zielGleichung="\sigma_{1,2} = \sigma_M \pm R"
          schritte={[
            { titel: inhalt.werte.schrittMitte, erklaerung: inhalt.werte.schrittMitteText, formel: `\\sigma_M = \\frac{${formatDeTeX(sx, 0)} + (${formatDeTeX(sy, 0)})}{2} = ${formatDeTeX(r.sigmaM, 1)}\\,\\text{N/mm}^2,\\quad R = \\sqrt{${formatDeTeX((sx - sy) / 2, 1)}^2 + (${formatDeTeX(txy, 0)})^2} = ${formatDeTeX(r.R, 1)}\\,\\text{N/mm}^2` },
            { titel: inhalt.werte.schrittHaupt, erklaerung: inhalt.werte.schrittHauptText, formel: `\\sigma_1 = ${formatDeTeX(r.sigma1, 1)}\\,\\text{N/mm}^2,\\quad \\sigma_2 = ${formatDeTeX(r.sigma2, 1)}\\,\\text{N/mm}^2` },
            { titel: inhalt.werte.schrittRichtung, erklaerung: inhalt.werte.schrittRichtungText, formel: `\\varphi_1 = \\tfrac{1}{2}\\,\\operatorname{atan2}(2 \\cdot ${formatDeTeX(txy, 0)};\\ ${formatDeTeX(sx - sy, 0)}) = ${formatDeTeX(r.phi1Grad, 1)}^\\circ` },
            { titel: inhalt.werte.schrittVergleich, erklaerung: inhalt.werte.schrittVergleichText, formel: `\\sigma_v = \\sqrt{${formatDeTeX(r.sigma1, 1)}^2 - ${formatDeTeX(r.sigma1, 1)} \\cdot (${formatDeTeX(r.sigma2, 1)}) + (${formatDeTeX(r.sigma2, 1)})^2} = ${formatDeTeX(r.sigmaVMises, 1)}\\,\\text{N/mm}^2` },
          ]}
          ergebnisHinweis={inhalt.werte.rechenwegHinweis}
          normQuelle={inhalt.werte.rechenwegQuelle}
        />
      )}
    </div>
  );
}
