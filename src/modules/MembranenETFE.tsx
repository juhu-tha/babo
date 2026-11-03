import React, { useMemo, useState } from 'react';
import { BlockMath } from 'react-katex';
import { Tent, Layers, Wind, Table, Calculator, Scale, Sun, ShieldCheck } from 'lucide-react';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Slider } from '@/src/components/ui/Slider';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { membranNachweis, MEMBRAN_LEHRWERTE, type MembranGeometrie } from '@/src/calc/membran';
import inhalt from '@/content/membranenetfe/MembranenETFE.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

type Reiter = 'einfuehrung' | 'werkstoffe' | 'tragverhalten' | 'kennwerte' | 'rechner' | 'regelwerke';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Einführung', icon: Tent },
  { id: 'werkstoffe', label: inhalt.werte.gewebeEtfe, icon: Layers },
  { id: 'tragverhalten', label: 'Tragverhalten', icon: Wind },
  { id: 'kennwerte', label: inhalt.werte.kennwerteBauphysik, icon: Table },
  { id: 'rechner', label: inhalt.werte.rechnerKesselformel, icon: Calculator },
  { id: 'regelwerke', label: inhalt.werte.regelwerkeBauten, icon: Scale },
];

/** Werkstoffvorgaben des Rechners (Lehrwerte nach Herstellerdatenblättern, keine Bemessungswerte) */
const VORGABEN = {
  etfe200: { name: inhalt.werte.etfeFolie200M, werkstoff: 'folie', dickeUm: 200, festigkeit: MEMBRAN_LEHRWERTE.etfeSigma10, gamma: MEMBRAN_LEHRWERTE.gammaFolie },
  etfe250: { name: inhalt.werte.etfeFolie250M, werkstoff: 'folie', dickeUm: 250, festigkeit: MEMBRAN_LEHRWERTE.etfeSigma10, gamma: MEMBRAN_LEHRWERTE.gammaFolie },
  pvc2: { name: inhalt.werte.pvcPesTypIi, werkstoff: 'gewebe', dickeUm: 0, festigkeit: MEMBRAN_LEHRWERTE.pvcPesTyp2, gamma: MEMBRAN_LEHRWERTE.gammaGewebe },
  ptfe: { name: inhalt.werte.ptfeGlas4500, werkstoff: 'gewebe', dickeUm: 0, festigkeit: MEMBRAN_LEHRWERTE.ptfeGlas, gamma: MEMBRAN_LEHRWERTE.gammaGewebe },
} as const;
type VorgabeId = keyof typeof VORGABEN;

const karte = 'bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm';
const box = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';

/** Querschnitt eines gewölbten Membranstreifens mit Innendruck (Schema) */
function SchnittSkizze({ L, f, r }: { L: number; f: number; r: number }) {
  const W = 320, H = 150, x0 = 30, x1 = 290, yB = 120;
  const s = (x1 - x0) / L;
  const fPx = Math.min(f * s, 95);
  const rPx = (Math.pow((x1 - x0) / 2, 2) + fPx * fPx) / (2 * fPx);
  const pfeile = [0.2, 0.35, 0.5, 0.65, 0.8].map(t => {
    const x = x0 + t * (x1 - x0);
    const dx = x - (x0 + x1) / 2;
    const y = yB - (Math.sqrt(Math.max(rPx * rPx - dx * dx, 0)) - (rPx - fPx));
    return { x, y };
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={inhalt.werte.schnittDurchEinenGewölbten}>
      <line x1={x0} y1={yB} x2={x1} y2={yB} stroke="#94a3b8" strokeDasharray="4 4" />
      <path d={`M ${x0} ${yB} A ${rPx} ${rPx} 0 0 1 ${x1} ${yB}`} fill="rgba(163,17,62,0.06)" stroke="#A3113E" strokeWidth="3" />
      {pfeile.map((q, i) => (
        <line key={i} x1={q.x} y1={yB - 8} x2={q.x} y2={q.y + 6} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#pf-membran)" />
      ))}
      <line x1={(x0 + x1) / 2} y1={yB} x2={(x0 + x1) / 2} y2={yB - fPx} stroke="#1e293b" strokeWidth="1" />
      <text x={(x0 + x1) / 2 + 6} y={yB - fPx / 2} fontSize="11" fill="#1e293b">f = {formatDeZahl(f, 2)} m</text>
      <text x={(x0 + x1) / 2} y={yB + 18} fontSize="11" fill="#1e293b" textAnchor="middle">L = {formatDeZahl(L, 2)} m · r = {formatDeZahl(r, 2)} m</text>
      <text x={x0 + 4} y={yB - 6} fontSize="10" fill="#64748b">p</text>
      <defs>
        <marker id="pf-membran" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
        </marker>
      </defs>
    </svg>
  );
}

/** Antiklastische (Sattel) und synklastische (Kissen) Krümmung – Schema */
function KruemmungSkizze() {
  return (
    <svg viewBox="0 0 340 140" className="w-full h-auto" role="img" aria-label={inhalt.werte.sattelflächeMitGegensinnigerKrümmung}>
      <g>
        <path d="M 20 60 Q 85 100 150 60" fill="none" stroke="#A3113E" strokeWidth="2.5" />
        <path d="M 85 20 Q 85 70 85 120" fill="none" stroke="#475569" strokeWidth="0" />
        <path d="M 50 110 Q 85 40 120 110" fill="none" stroke="#1e293b" strokeWidth="2.5" />
        <text x="85" y="135" fontSize="11" textAnchor="middle" fill="#1e293b">antiklastisch (Sattel, K &lt; 0)</text>
        <text x="152" y="58" fontSize="9" fill="#A3113E">Tragrichtung</text>
        <text x="122" y="104" fontSize="9" fill="#1e293b">Spannrichtung</text>
      </g>
      <g>
        <path d="M 200 90 Q 265 30 330 90" fill="none" stroke="#A3113E" strokeWidth="2.5" />
        <path d="M 200 90 Q 265 125 330 90" fill="none" stroke="#1e293b" strokeWidth="2.5" />
        <text x="265" y="135" fontSize="11" textAnchor="middle" fill="#1e293b">synklastisch (Kissen, K &gt; 0)</text>
        <text x="265" y="80" fontSize="10" textAnchor="middle" fill="#64748b">p &gt; 0</text>
      </g>
    </svg>
  );
}

export default function MembranenETFE() {
  const [tab, setTab] = useState<Reiter>('einfuehrung');

  // Rechner
  const [geometrie, setGeometrie] = useState<MembranGeometrie>('zylinder');
  const [modus, setModus] = useState<'stich' | 'radius'>('stich');
  const [p, setP] = useState(300);
  const [L, setL] = useState(3);
  const [f, setF] = useState(0.3);
  const [radius, setRadius] = useState(15);
  const [vorgabe, setVorgabe] = useState<VorgabeId>('etfe200');
  const [festigkeit, setFestigkeit] = useState<number>(VORGABEN.etfe200.festigkeit);
  const [dicke, setDicke] = useState<number>(VORGABEN.etfe200.dickeUm);
  const [gamma, setGamma] = useState<number>(VORGABEN.etfe200.gamma);

  const werkstoff = VORGABEN[vorgabe].werkstoff;
  const waehleVorgabe = (id: VorgabeId) => {
    setVorgabe(id);
    setFestigkeit(VORGABEN[id].festigkeit);
    setGamma(VORGABEN[id].gamma);
    if (VORGABEN[id].werkstoff === 'folie') setDicke(VORGABEN[id].dickeUm);
  };

  const erg = useMemo(() => membranNachweis({
    geometrie, p,
    radius: modus === 'radius' ? radius : undefined,
    spannweite: L, stich: f,
    werkstoff,
    festigkeitGewebe: werkstoff === 'gewebe' ? festigkeit : undefined,
    dickeUm: werkstoff === 'folie' ? dicke : undefined,
    festigkeitFolie: werkstoff === 'folie' ? festigkeit : undefined,
    gamma,
  }), [geometrie, p, modus, radius, L, f, werkstoff, festigkeit, dicke, gamma]);

  const gueltig = Number.isFinite(erg.n);
  const tex = (v: number, d = 2) => formatDeTeX(v, d);
  const kessel = geometrie === 'zylinder' ? 'n = p \\cdot r' : 'n = \\frac{p \\cdot r}{2}';

  const liveSchritte = gueltig ? [
    modus === 'stich'
      ? { titel: inhalt.werte.krümmungsradiusAusSpannweiteUnd, erklaerung: `Kreisbogen über L = ${formatDeZahl(L, 2)} m mit Stich f = ${formatDeZahl(f, 2)} m:`, formel: `r = \\frac{L^2}{8 f} + \\frac{f}{2} = \\frac{${tex(L)}^2}{8 \\cdot ${tex(f)}} + \\frac{${tex(f)}}{2} = ${tex(erg.r)}\\,\\text{m}` }
      : { titel: 'Krümmungsradius', erklaerung: inhalt.werte.derRadiusWirdDirekt, formel: `r = ${tex(erg.r)}\\,\\text{m}` },
    {
      titel: geometrie === 'zylinder' ? inhalt.werte.membrankraftZylinder : inhalt.werte.membrankraftKugel,
      erklaerung: geometrie === 'zylinder'
        ? inhalt.werte.einfachGekrümmterStreifenGleichgewicht
        : inhalt.werte.gleichsinnigDoppeltGekrümmtMit,
      formel: geometrie === 'zylinder'
        ? `n = p \\cdot r = ${formatDeTeX(p, 0)}\\,\\tfrac{\\text{N}}{\\text{m}^2} \\cdot ${tex(erg.r)}\\,\\text{m} = ${formatDeTeX(erg.n, 0)}\\,\\tfrac{\\text{N}}{\\text{m}} = ${tex(erg.nKN)}\\,\\tfrac{\\text{kN}}{\\text{m}}`
        : `n = \\frac{p \\cdot r}{2} = \\frac{${formatDeTeX(p, 0)} \\cdot ${tex(erg.r)}}{2} = ${formatDeTeX(erg.n, 0)}\\,\\tfrac{\\text{N}}{\\text{m}} = ${tex(erg.nKN)}\\,\\tfrac{\\text{kN}}{\\text{m}}`,
    },
    ...(werkstoff === 'folie' ? [{
      titel: inhalt.werte.spannungInDerFolie,
      erklaerung: `Membrankraft je Meter geteilt durch die Foliendicke t = ${formatDeZahl(dicke, 0)} µm:`,
      formel: `\\sigma = \\frac{n}{t} = \\frac{${tex(erg.n / 1000, 3)}\\,\\text{N/mm}}{${tex(dicke / 1000, 3)}\\,\\text{mm}} = ${tex(erg.sigma)}\\,\\text{N/mm}^2`,
    }] : []),
    werkstoff === 'folie'
      ? { titel: inhalt.werte.zulässigeMembrankraftLehrwert, erklaerung: `Bezugsfestigkeit ${formatDeZahl(festigkeit, 1)} N/mm² mal Dicke, geteilt durch γ = ${formatDeZahl(gamma, 1)}:`, formel: `n_{zul} = \\frac{f \\cdot t}{\\gamma} = \\frac{${tex(festigkeit, 1)} \\cdot ${tex(dicke / 1000, 3)}}{${tex(gamma, 1)}} \\cdot 1000 = ${formatDeTeX(erg.nZul, 0)}\\,\\tfrac{\\text{N}}{\\text{m}}` }
      : { titel: inhalt.werte.zulässigeMembrankraftLehrwert2, erklaerung: `Kurzzeitzugfestigkeit ${formatDeZahl(festigkeit, 0)} N/5 cm auf 1 m umgerechnet, geteilt durch γ = ${formatDeZahl(gamma, 1)}:`, formel: `n_{zul} = \\frac{f_t / 0{,}05\\,\\text{m}}{\\gamma} = \\frac{${formatDeTeX(festigkeit / 0.05, 0)}}{${tex(gamma, 1)}} = ${formatDeTeX(erg.nZul, 0)}\\,\\tfrac{\\text{N}}{\\text{m}}` },
    { titel: 'Ausnutzung', erklaerung: erg.ok ? inhalt.werte.dieVorhandeneMembrankraftLiegt : inhalt.werte.dieVorhandeneMembrankraftÜberschreitet, formel: `\\eta = \\frac{n}{n_{zul}} = \\frac{${formatDeTeX(erg.n, 0)}}{${formatDeTeX(erg.nZul, 0)}} = ${tex(erg.eta)} ${erg.ok ? '\\le' : '>'} 1` },
  ] : inhalt.daten.MembranenETFE;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Tent className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.membranenUndEtfeFolien} /></h2>
        <p className={box}><MdText text={inhalt.texte.textileMembranenUndEtfe} /></p>

        <ModuleTabs label={inhalt.werte.bereicheDesModulsMembranen} tabs={REITER} aktiv={tab} onWechsel={setTab}>
          {tab === 'einfuehrung' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.wasIstMembranbau} /></h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.biegeweichEineMembranHat} /></li>
                  <li><MdText text={inhalt.texte.leichtBeschichteteGewebeWiegen} /></li>
                  <li><MdText text={inhalt.texte.formFolgtKraftDie} /></li>
                  <li><MdText text={inhalt.texte.lichtGewebeSindTransluzent} /></li>
                </ul>
              </div>
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.zweiBauweisen} /></h3>
                <div className="flex flex-col gap-3 text-sm text-text-main/85">
                  <div className={box}><MdText text={inhalt.texte.mechanischVorgespanntDieMembran} /></div>
                  <div className={box}><MdText text={inhalt.texte.pneumatischVorgespanntEinÜberdruck} /></div>
                </div>
                <Querverweis ziel="kunststoffe" titel={inhalt.werte.polymereAlsGrundlage} linkText={inhalt.werte.zumModulKunststoffe} className="mt-4">{inhalt.werte.aufbauUndEigenschaftenDer}</Querverweis>
              </div>
            </div>
          )}

          {tab === 'werkstoffe' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.beschichteteTechnischeGewebe} /></h3>
                <p className="text-sm text-text-main/85 mb-3"><MdText text={inhalt.texte.einGrundgewebeAusKett} /></p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.pvcBeschichtetesPolyestergewebePvc} /></li>
                  <li><MdText text={inhalt.texte.ptfeBeschichtetesGlasfasergewebePtfe} /></li>
                  <li><MdText text={inhalt.texte.silikonbeschichtetesGlasfasergewebeSilik} /></li>
                </ul>
                <p className="text-xs text-text-main/70 mt-3"><MdText text={inhalt.texte.gewebeSindAnisotropKette} /></p>
              </div>
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">ETFE-Folien</h3>
                <p className="text-sm text-text-main/85 mb-3"><MdText text={inhalt.texte.etfeEthylenTetrafluorethylenIst} /></p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.einlagigMechanischVorgespannteFolien} /></li>
                  <li><MdText text={inhalt.texte.mehrlagigePneumatischeKissenZwei} /></li>
                  <li><MdText text={inhalt.texte.bedruckungPunktOderLinienraster} /></li>
                  <li><MdText text={inhalt.texte.lichtUndUvEine} /></li>
                  <li><MdText text={inhalt.texte.brandEtfeSchmilztUm} /></li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'tragverhalten' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.vorspannungUndKrümmung} /></h3>
                <p className="text-sm text-text-main/85 mb-3"><MdText text={inhalt.texte.eineEbeneMembranKann} /><FormulaText text="$R_1$" /> und <FormulaText text="$R_2$" /><MdText text={inhalt.texte.giltDieMembrangleichung} /></p>
                <div className="bg-off-white rounded-xl border border-home-grau/30 p-3 overflow-x-auto"><BlockMath math="\frac{n_1}{R_1} + \frac{n_2}{R_2} = p" /></div>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85 mt-3">
                  <li><MdText text={inhalt.texte.mechanischVorgespanntP0} /><FormulaText text={inhalt.werte.n1R1} /><MdText text={inhalt.texte.dieFlächeMussAntiklastisch} /></li>
                  <li><MdText text={inhalt.texte.pneumatischVorgespanntP0} /></li>
                  <li><MdText text={inhalt.texte.sonderfälleZylinder} /><FormulaText text="$R_2 \to \infty$" /><MdText text={inhalt.texte.liefertDieKesselformel} /><FormulaText text="$n = p \cdot r$" /><MdText text={inhalt.texte.dieKugel} /><FormulaText text="$n_1 = n_2$" />, <FormulaText text="$R_1 = R_2$" />) liefert <FormulaText text="$n = p \cdot r/2$" />.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.gegenUndGleichsinnigeKrümmung} /></h3>
                  <div className="bg-off-white rounded-xl border border-home-grau/30 p-3"><KruemmungSkizze /></div>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.formfindungUndZuschnitt} /></h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><MdText text={inhalt.texte.formfindungGesuchtIstDie} /></li>
                    <li><MdText text={inhalt.texte.statischeAnalyseDieBerechnung} /></li>
                    <li><MdText text={inhalt.texte.zuschnittDieDoppeltGekrümmte} /></li>
                    <li><MdText text={inhalt.texte.kriechenUnterDauerlastUnd} /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'kennwerte' && (
            <div className="flex flex-col gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-1"><MdText text={inhalt.texte.werkstoffkennwerteImVergleich} /></h3>
                <p className="text-xs text-text-main/70 mb-3"><MdText text={inhalt.texte.größenordnungenAusHerstellerdatenblätter} /></p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse min-w-[640px]">
                    <thead>
                      <tr className="bg-off-white text-left">
                        <th className="p-2 border border-home-grau/30">Kennwert</th>
                        <th className="p-2 border border-home-grau/30">PVC/PES</th>
                        <th className="p-2 border border-home-grau/30">PTFE/Glas</th>
                        <th className="p-2 border border-home-grau/30">ETFE-Folie</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold"><MdText text={inhalt.texte.zugfestigkeitKetteSchussStreifenzugversu} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.rund3000Bis} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.rund2000Bis} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.bruchspannungUm50N} /></td></tr>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold">Weiterreißfestigkeit</td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.zB580520} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.zB450N} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.hochDatenblattangabeJeFoliendicke} /></td></tr>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold">Bruchdehnung</td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.geringBisMäßigGewebe} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.sehrGeringGlasfaser} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.sehrHochBisRund} /></td></tr>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold">Kriechen</td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.merklichPolyester} /></td><td className="p-2 border border-home-grau/30">gering</td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.merklichStarkTemperaturabhängig} /></td></tr>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold">Lichttransmission</td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.geringZB5} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.rund15Bis50} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.rund90Bis95} /></td></tr>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold"><MdText text={inhalt.texte.brandverhaltenTypischeAngabe} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.bS2D0Nach} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.a2NachDin4102} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.bS1D0Nach} /></td></tr>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold"><MdText text={inhalt.texte.lebensdauerGrößenordnung} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.rund10Bis30} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.rund25Bis35} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.über30Jahre} /></td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-text-main/70 mt-3"><MdText text={inhalt.texte.dieZugfestigkeitVonGeweben} /></p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-1 flex items-center gap-2"><Sun size={16} className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.wärmeschutzMehrlagigerEtfeKissen} /></h3>
                  <p className="text-xs text-text-main/70 mb-3"><MdText text={inhalt.texte.herstellerangabenRichtwerteOhneRandverbu} /></p>
                  <table className="w-full text-xs border-collapse">
                    <thead><tr className="bg-off-white text-left"><th className="p-2 border border-home-grau/30">Aufbau</th><th className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.uWertInW} /></th></tr></thead>
                    <tbody>
                      <tr><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.einlagigeFolie} /></td><td className="p-2 border border-home-grau/30">rund 5,6</td></tr>
                      <tr><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.t2LagigesKissen1} /></td><td className="p-2 border border-home-grau/30">rund 2,9</td></tr>
                      <tr><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.t3LagigesKissen2} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.rund18Bis} /></td></tr>
                      <tr><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.t4LagigesKissen3} /></td><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.rund14Bis} /></td></tr>
                      <tr><td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.t5LagigesKissen4} /></td><td className="p-2 border border-home-grau/30">rund 1,2</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.bauphysikalischeBesonderheiten} /></h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><MdText text={inhalt.texte.geringeSpeichermasseMembranhüllenReagier} /></li>
                    <li><MdText text={inhalt.texte.tauwasserAnDerKalten} /></li>
                    <li><MdText text={inhalt.texte.schallLeichteHüllenDämmen} /></li>
                    <li><MdText text={inhalt.texte.energieDieGebläseDer} /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'rechner' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className="flex flex-col gap-4">
                <CalculatorDisclaimerBanner className="my-1" customText={inhalt.werte.lehrrechnerFestigkeitenUndSicherheitsbei} />
                <div className={box}>
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3"><MdText text={inhalt.texte.geometrieUndDruck} /></h3>
                  <AuswahlGruppe className="flex flex-wrap gap-2 mb-3" aria-label="Krümmungsform">
                    {(['zylinder', 'kugel'] as const).map(g => (
                      <button key={g} type="button" {...alsOption(geometrie === g)} onClick={() => setGeometrie(g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${geometrie === g ? 'bg-shiraz text-white border-shiraz' : 'bg-white border-home-grau/30'}`}>
                        {g === 'zylinder' ? inhalt.werte.zylinderNPR : inhalt.werte.kugelNPR}
                      </button>
                    ))}
                  </AuswahlGruppe>
                  <AuswahlGruppe className="flex flex-wrap gap-2 mb-4" aria-label={inhalt.werte.eingabeDerKrümmung}>
                    {(['stich', 'radius'] as const).map(m => (
                      <button key={m} type="button" {...alsOption(modus === m)} onClick={() => setModus(m)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${modus === m ? 'bg-shiraz text-white border-shiraz' : 'bg-white border-home-grau/30'}`}>
                        {m === 'stich' ? inhalt.werte.spannweiteUndStich : inhalt.werte.radiusDirekt}
                      </button>
                    ))}
                  </AuswahlGruppe>
                  <div className="flex flex-col gap-4">
                    <Slider label={inhalt.werte.innendruckP} info={inhalt.werte.überdruckBzwDruckdifferenzAn} min={100} max={1000} step={10} value={p} unit="Pa" onChange={e => setP(Number(e.target.value))} />
                    {modus === 'stich' ? (
                      <>
                        <Slider label={inhalt.werte.spannweiteL} min={1} max={30} step={0.5} value={L} unit="m" onChange={e => setL(Number(e.target.value))} />
                        <Slider label="Stich f" info={inhalt.werte.höheDerWölbungIn} min={0.05} max={5} step={0.05} value={f} unit="m" onChange={e => setF(Number(e.target.value))} />
                      </>
                    ) : (
                      <Slider label={inhalt.werte.krümmungsradiusR} min={1} max={40} step={0.5} value={radius} unit="m" onChange={e => setRadius(Number(e.target.value))} />
                    )}
                  </div>
                </div>
                <div className={box}>
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3"><MdText text={inhalt.texte.werkstoffLehrwerte} /></h3>
                  <label className="text-sm font-medium text-text-main" htmlFor="membran-vorgabe">Vorgabe</label>
                  <select id="membran-vorgabe" className="w-full mt-1 mb-4 p-2 border border-home-grau rounded-md bg-white" value={vorgabe} onChange={e => waehleVorgabe(e.target.value as VorgabeId)}>
                    {Object.entries(VORGABEN).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                  </select>
                  <div className="flex flex-col gap-4">
                    {werkstoff === 'folie' ? (
                      <>
                        <Slider label={inhalt.werte.foliendickeT} min={50} max={400} step={10} value={dicke} unit="µm" onChange={e => setDicke(Number(e.target.value))} />
                        <Slider label={inhalt.werte.bezugsfestigkeitF} info={inhalt.werte.lehrwertSpannungBei10} min={5} max={60} step={1} value={festigkeit} unit="N/mm²" onChange={e => setFestigkeit(Number(e.target.value))} />
                      </>
                    ) : (
                      <Slider label={inhalt.werte.kurzzeitzugfestigkeitFT} info={inhalt.werte.streifenzugfestigkeitDerMaßgebendenRicht} min={1000} max={12000} step={100} value={festigkeit} unit="N/5 cm" onChange={e => setFestigkeit(Number(e.target.value))} />
                    )}
                    <Slider label={inhalt.werte.gesamtsicherheitsbeiwert} info={inhalt.werte.lehrwertDecktLangzeitTemperatur} min={1} max={8} step={0.1} value={gamma} unit="–" onChange={e => setGamma(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {modus === 'stich' && gueltig && (
                  <div className={karte}>
                    <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.schnittDurchDieMembran} /></h3>
                    <SchnittSkizze L={L} f={f} r={erg.r} />
                  </div>
                )}
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Ergebnis</h3>
                  {gueltig ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70">Radius r</div><div className="text-lg font-bold">{formatDeZahl(erg.r, 2)} m</div></div>
                      <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70"><MdText text={inhalt.texte.membrankraftN} /></div><div className="text-lg font-bold text-shiraz">{formatDeZahl(erg.nKN, 2)} kN/m</div></div>
                      {werkstoff === 'folie' && <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70"><MdText text={inhalt.texte.folienspannung} /></div><div className="text-lg font-bold">{formatDeZahl(erg.sigma, 2)} N/mm²</div></div>}
                      <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70"><MdText text={inhalt.texte.zulässigNZulLehrwert} /></div><div className="text-lg font-bold">{formatDeZahl(erg.nZul / 1000, 2)} kN/m</div></div>
                      <div className={`p-3 rounded-xl border col-span-2 ${erg.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                        <div className="text-xs flex items-center gap-1"><ShieldCheck size={14} aria-hidden="true" /><MdText text={inhalt.texte.ausnutzungNNZul} /></div>
                        <div className="text-lg font-bold">{formatDeZahl(erg.eta * 100, 0)} % – {erg.ok ? inhalt.werte.lehrwertEingehalten : inhalt.werte.lehrwertÜberschritten}</div>
                      </div>
                    </div>
                  ) : <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.keineBerechnungMöglich} /></p>}
                  <EingabeHinweise hinweise={erg.hinweise} />
                </div>
                <FormulaDerivationBox
                  live
                  title={`Ihr Rechenweg: Kesselformel und Ausnutzung (p = ${formatDeZahl(p, 0)} Pa)`}
                  zielGleichung={kessel}
                  schritte={liveSchritte}
                  ergebnisHinweis={inhalt.werte.großerRadiusBedeutetGroße}
                  normQuelle={inhalt.werte.gleichgewichtAmKreiszylinderBzw}
                />
              </div>
            </div>
          )}

          {tab === 'regelwerke' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.regelwerkeInDeutschland} /></h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.verwendbarkeitFürMembranwerkstoffeUnd} /></li>
                  <li><MdText text={inhalt.texte.traglufthallenDin41341} /></li>
                  <li><MdText text={inhalt.texte.bemessungCenTs19102} /></li>
                  <li><MdText text={inhalt.texte.zelteFliegendeBautenAus} /></li>
                  <li><MdText text={inhalt.texte.brandverhaltenKlassifizierungNachDin} /></li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.allianzArenaMünchen2005} /></h3>
                  <p className="text-sm text-text-main/85"><MdText text={inhalt.texte.entwurfHerzogDeMeuron} /></p>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.edenProjectCornwall2001} /></h3>
                  <p className="text-sm text-text-main/85"><MdText text={inhalt.texte.entwurfNicholasGrimshawPartners} /></p>
                </div>
              </div>
            </div>
          )}
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIELE */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1MembrankraftEiner}
        zielGleichung="n = p \cdot r"
        schritte={inhalt.daten["MembranenETFE.schritte"]}
        ergebnisHinweis={inhalt.werte.dieMembrankraftWächstLinear}
        normQuelle={inhalt.werte.kesselformelBemessungNachDin}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2EtfeKissenlage}
        zielGleichung="r = \frac{L^2}{8 f} + \frac{f}{2}, \quad \sigma = \frac{p \cdot r}{t}"
        schritte={inhalt.daten["MembranenETFE.schritte_2"]}
        ergebnisHinweis={inhalt.werte.beiSchneeWirdDie}
        normQuelle={inhalt.werte.kesselformelBezugsfestigkeitSpannungBei}
      />

      <ModulTest moduleId="membranen_etfe" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026NeuErstellt}
        wikipedia={[
          { title: 'Ethylen-Tetrafluorethylen', url: 'https://de.wikipedia.org/wiki/Ethylen-Tetrafluorethylen-Copolymer' },
          { title: inhalt.werte.allianzArena, url: 'https://de.wikipedia.org/wiki/Allianz_Arena' },
          { title: inhalt.werte.edenProject, url: 'https://de.wikipedia.org/wiki/Eden_Project' },
        ]}
        literatur={inhalt.daten["MembranenETFE.literatur"]}
        regelwerke={inhalt.daten["MembranenETFE.regelwerke"]}
        formeln={inhalt.daten["MembranenETFE.formeln"]}
      />
    </div>
  );
}
