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

type Reiter = 'einfuehrung' | 'werkstoffe' | 'tragverhalten' | 'kennwerte' | 'rechner' | 'regelwerke';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Einführung', icon: Tent },
  { id: 'werkstoffe', label: 'Gewebe & ETFE', icon: Layers },
  { id: 'tragverhalten', label: 'Tragverhalten', icon: Wind },
  { id: 'kennwerte', label: 'Kennwerte & Bauphysik', icon: Table },
  { id: 'rechner', label: 'Rechner Kesselformel', icon: Calculator },
  { id: 'regelwerke', label: 'Regelwerke & Bauten', icon: Scale },
];

/** Werkstoffvorgaben des Rechners (Lehrwerte nach Herstellerdatenblättern, keine Bemessungswerte) */
const VORGABEN = {
  etfe200: { name: 'ETFE-Folie 200 µm', werkstoff: 'folie', dickeUm: 200, festigkeit: MEMBRAN_LEHRWERTE.etfeSigma10, gamma: MEMBRAN_LEHRWERTE.gammaFolie },
  etfe250: { name: 'ETFE-Folie 250 µm', werkstoff: 'folie', dickeUm: 250, festigkeit: MEMBRAN_LEHRWERTE.etfeSigma10, gamma: MEMBRAN_LEHRWERTE.gammaFolie },
  pvc2: { name: 'PVC/PES Typ II (4.000 N/5 cm)', werkstoff: 'gewebe', dickeUm: 0, festigkeit: MEMBRAN_LEHRWERTE.pvcPesTyp2, gamma: MEMBRAN_LEHRWERTE.gammaGewebe },
  ptfe: { name: 'PTFE/Glas (4.500 N/5 cm)', werkstoff: 'gewebe', dickeUm: 0, festigkeit: MEMBRAN_LEHRWERTE.ptfeGlas, gamma: MEMBRAN_LEHRWERTE.gammaGewebe },
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
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Schnitt durch einen gewölbten Membranstreifen mit Innendruck">
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
    <svg viewBox="0 0 340 140" className="w-full h-auto" role="img" aria-label="Sattelfläche mit gegensinniger Krümmung und Kissen mit gleichsinniger Krümmung">
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
      ? { titel: 'Krümmungsradius aus Spannweite und Stich', erklaerung: `Kreisbogen über L = ${formatDeZahl(L, 2)} m mit Stich f = ${formatDeZahl(f, 2)} m:`, formel: `r = \\frac{L^2}{8 f} + \\frac{f}{2} = \\frac{${tex(L)}^2}{8 \\cdot ${tex(f)}} + \\frac{${tex(f)}}{2} = ${tex(erg.r)}\\,\\text{m}` }
      : { titel: 'Krümmungsradius', erklaerung: 'Der Radius wird direkt vorgegeben:', formel: `r = ${tex(erg.r)}\\,\\text{m}` },
    {
      titel: geometrie === 'zylinder' ? 'Membrankraft (Zylinder)' : 'Membrankraft (Kugel)',
      erklaerung: geometrie === 'zylinder'
        ? 'Einfach gekrümmter Streifen: Gleichgewicht am Halbzylinder, die Kraft wirkt quer zur Zylinderachse.'
        : 'Gleichsinnig doppelt gekrümmt mit gleichen Radien: Der Druck verteilt sich auf zwei Richtungen.',
      formel: geometrie === 'zylinder'
        ? `n = p \\cdot r = ${formatDeTeX(p, 0)}\\,\\tfrac{\\text{N}}{\\text{m}^2} \\cdot ${tex(erg.r)}\\,\\text{m} = ${formatDeTeX(erg.n, 0)}\\,\\tfrac{\\text{N}}{\\text{m}} = ${tex(erg.nKN)}\\,\\tfrac{\\text{kN}}{\\text{m}}`
        : `n = \\frac{p \\cdot r}{2} = \\frac{${formatDeTeX(p, 0)} \\cdot ${tex(erg.r)}}{2} = ${formatDeTeX(erg.n, 0)}\\,\\tfrac{\\text{N}}{\\text{m}} = ${tex(erg.nKN)}\\,\\tfrac{\\text{kN}}{\\text{m}}`,
    },
    ...(werkstoff === 'folie' ? [{
      titel: 'Spannung in der Folie',
      erklaerung: `Membrankraft je Meter geteilt durch die Foliendicke t = ${formatDeZahl(dicke, 0)} µm:`,
      formel: `\\sigma = \\frac{n}{t} = \\frac{${tex(erg.n / 1000, 3)}\\,\\text{N/mm}}{${tex(dicke / 1000, 3)}\\,\\text{mm}} = ${tex(erg.sigma)}\\,\\text{N/mm}^2`,
    }] : []),
    werkstoff === 'folie'
      ? { titel: 'Zulässige Membrankraft (Lehrwert)', erklaerung: `Bezugsfestigkeit ${formatDeZahl(festigkeit, 1)} N/mm² mal Dicke, geteilt durch γ = ${formatDeZahl(gamma, 1)}:`, formel: `n_{zul} = \\frac{f \\cdot t}{\\gamma} = \\frac{${tex(festigkeit, 1)} \\cdot ${tex(dicke / 1000, 3)}}{${tex(gamma, 1)}} \\cdot 1000 = ${formatDeTeX(erg.nZul, 0)}\\,\\tfrac{\\text{N}}{\\text{m}}` }
      : { titel: 'Zulässige Membrankraft (Lehrwert)', erklaerung: `Kurzzeitzugfestigkeit ${formatDeZahl(festigkeit, 0)} N/5 cm auf 1 m umgerechnet, geteilt durch γ = ${formatDeZahl(gamma, 1)}:`, formel: `n_{zul} = \\frac{f_t / 0{,}05\\,\\text{m}}{\\gamma} = \\frac{${formatDeTeX(festigkeit / 0.05, 0)}}{${tex(gamma, 1)}} = ${formatDeTeX(erg.nZul, 0)}\\,\\tfrac{\\text{N}}{\\text{m}}` },
    { titel: 'Ausnutzung', erklaerung: erg.ok ? 'Die vorhandene Membrankraft liegt unter dem Lehrwert der zulässigen Membrankraft.' : 'Die vorhandene Membrankraft überschreitet den Lehrwert: Stich vergrößern, Spannweite verkleinern, Druck begrenzen oder festeren Werkstoff wählen.', formel: `\\eta = \\frac{n}{n_{zul}} = \\frac{${formatDeTeX(erg.n, 0)}}{${formatDeTeX(erg.nZul, 0)}} = ${tex(erg.eta)} ${erg.ok ? '\\le' : '>'} 1` },
  ] : [{ titel: 'Keine Berechnung', erklaerung: 'Die Eingaben sind unzulässig – siehe Hinweise im Rechner.' }];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Tent className="text-shiraz" aria-hidden="true" /> Membranen und ETFE-Folien
        </h2>
        <p className={box}>
          Textile Membranen und ETFE-Folien sind biegeweiche Flächentragwerke: Sie tragen Lasten ausschließlich über Zugkräfte in ihrer Ebene. Tragfähig werden sie erst durch Vorspannung und Krümmung – mechanisch über Ränder und Seile oder pneumatisch über Luftdruck. Das Modul führt von den Werkstoffen über das Tragverhalten und die Kennwerte zur Kesselformel, mit der Sie Membrankräfte gewölbter Kissen und Streifen abschätzen.
        </p>

        <ModuleTabs label="Bereiche des Moduls Membranen und ETFE-Folien" tabs={REITER} aktiv={tab} onWechsel={setTab}>
          {tab === 'einfuehrung' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Was ist Membranbau?</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>Biegeweich:</strong> Eine Membran hat praktisch keine Biege- und keine Drucksteifigkeit. Druckspannungen führen zu Falten, nicht zu Tragwirkung.</li>
                  <li><strong>Leicht:</strong> Beschichtete Gewebe wiegen rund 0,5 bis 1,7 kg/m², ein dreilagiges ETFE-Kissen meist unter 1 kg/m². Das Eigengewicht spielt gegenüber Wind und Schnee kaum eine Rolle.</li>
                  <li><strong>Form folgt Kraft:</strong> Die Geometrie ist nicht frei wählbar, sondern ergibt sich aus Vorspannung, Rändern und Lasten (Formfindung).</li>
                  <li><strong>Licht:</strong> Gewebe sind transluzent (Tageslicht, diffuses Licht), ETFE-Folien sind nahezu klar und auch für UV-A-Strahlung durchlässig.</li>
                </ul>
              </div>
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Zwei Bauweisen</h3>
                <div className="flex flex-col gap-3 text-sm text-text-main/85">
                  <div className={box}>
                    <strong>Mechanisch vorgespannt:</strong> Die Membran wird über Masten, Bögen, Rand- und Gratseile in eine Sattelform gezogen. Typisch sind Hoch- und Tiefpunktflächen, Sattelflächen und Bogenhallen aus PVC/PES- oder PTFE/Glas-Gewebe.
                  </div>
                  <div className={box}>
                    <strong>Pneumatisch vorgespannt:</strong> Ein Überdruck spannt die Membran. Bei <em>Traglufthallen</em> steht der ganze Innenraum unter leichtem Überdruck, bei <em>Luftkissen</em> nur der Raum zwischen den Lagen. ETFE-Kissen sind die bekannteste Form.
                  </div>
                </div>
                <Querverweis ziel="kunststoffe" titel="Polymere als Grundlage" linkText="Zum Modul Kunststoffe" className="mt-4">
                  Aufbau und Eigenschaften der Polymere PVC, PTFE, Polyester und ETFE werden im Modul Kunststoffe behandelt.
                </Querverweis>
              </div>
            </div>
          )}

          {tab === 'werkstoffe' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Beschichtete technische Gewebe</h3>
                <p className="text-sm text-text-main/85 mb-3">Ein Grundgewebe aus Kett- und Schussfäden übernimmt die Zugkräfte, die Beschichtung dichtet, schützt das Gewebe vor UV-Strahlung und Feuchte und macht die Bahnen fügbar (Schweißen, Kleben).</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>PVC-beschichtetes Polyestergewebe (PVC/PES):</strong> wirtschaftlich, gut faltbar und hochfrequenzschweißbar; für temporäre und dauerhafte Bauten. Ein Decklack (Acryl, PVDF) schützt den Weichmacher-haltigen PVC-Strich und bestimmt maßgeblich die Lebensdauer. Polyester kriecht merklich – Nachspannmöglichkeiten sind vorzusehen.</li>
                  <li><strong>PTFE-beschichtetes Glasfasergewebe (PTFE/Glas):</strong> sehr dauerhaft, schmutzabweisend, chemisch beständig und nach Datenblatt bis nichtbrennbar (A2 nach DIN 4102). Glasfasern sind knick- und faltempfindlich; Transport und Montage erfordern Sorgfalt. Das Glasgewebe kriecht kaum.</li>
                  <li><strong>Silikonbeschichtetes Glasfasergewebe (Silikon/Glas):</strong> Glasgewebe mit einer Silikonelastomer-Beschichtung als Alternative zu PTFE/Glas, mit hoher Transluzenz möglich.</li>
                </ul>
                <p className="text-xs text-text-main/70 mt-3">Gewebe sind <strong>anisotrop</strong>: Kette und Schuss haben unterschiedliche Festigkeit und vor allem unterschiedliche Dehnsteifigkeit. Die Fäden der Kette liegen gestreckter, die Schussfäden sind stärker onduliert (Fadenwelligkeit) und dehnen sich zunächst mehr. Die Steifigkeiten werden im biaxialen Zugversuch ermittelt.</p>
              </div>
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">ETFE-Folien</h3>
                <p className="text-sm text-text-main/85 mb-3">ETFE (Ethylen-Tetrafluorethylen) ist ein teilfluorierter Thermoplast. Er wird zu Folien extrudiert, die im Bauwesen meist 100 bis 300 µm dick sind. Folien sind – anders als Gewebe – nahezu isotrop und hoch dehnfähig.</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>Einlagig:</strong> mechanisch vorgespannte Folien, meist mit Seilunterstützung, für Überdachungen ohne Wärmeschutzanforderung.</li>
                  <li><strong>Mehrlagige pneumatische Kissen:</strong> zwei bis fünf Lagen werden am Rand in Klemmprofilen gefasst; ein Gebläse hält einen kleinen Überdruck. Im Normalbetrieb liegt er bei rund 250 bis 300 Pa; bei Schnee oder Sturm wird er angehoben (Beispiel Tropical Islands: 300 Pa dauerhaft, bis 800 Pa bei Schnee).</li>
                  <li><strong>Bedruckung:</strong> Punkt- oder Linienraster (z. B. silbern oder weiß) verringern den Gesamtenergiedurchlassgrad. Sind zwei Lagen gegeneinander versetzt bedruckt, lässt sich die Verschattung schalten, indem die bewegliche Mittellage pneumatisch an die obere oder die untere Lage gelegt wird.</li>
                  <li><strong>Licht und UV:</strong> Eine klare Folie lässt rund 90 bis 95 % des sichtbaren Lichts durch und ist – anders als Floatglas – in hohem Maß UV-A-durchlässig. Das ist für Pflanzenhäuser ein Vorteil, für UV-empfindliche Nutzungen ein Planungspunkt.</li>
                  <li><strong>Brand:</strong> ETFE schmilzt um 265 °C; im Brandfall öffnen sich die Kissen und wirken als Rauchabzug. Das Material tropft nach Herstellerangaben nicht brennend ab.</li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'tragverhalten' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Vorspannung und Krümmung</h3>
                <p className="text-sm text-text-main/85 mb-3">Eine ebene Membran kann eine Last senkrecht zu ihrer Fläche nur mit großer Durchbiegung abtragen. Erst eine Krümmung lenkt die Zugkräfte so um, dass sie der Flächenlast das Gleichgewicht halten. Für ein Flächenelement mit den Hauptkrümmungsradien <FormulaText text="$R_1$" /> und <FormulaText text="$R_2$" /> gilt die Membrangleichung:</p>
                <div className="bg-off-white rounded-xl border border-home-grau/30 p-3 overflow-x-auto"><BlockMath math="\frac{n_1}{R_1} + \frac{n_2}{R_2} = p" /></div>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85 mt-3">
                  <li><strong>Mechanisch vorgespannt (p = 0):</strong> Es folgt <FormulaText text="$n_1/R_1 = -n_2/R_2$" />. Die Fläche muss <em>antiklastisch</em> (gegensinnig, sattelförmig) gekrümmt sein: Eine Fadenschar trägt nach oben, die andere hält nach unten.</li>
                  <li><strong>Pneumatisch vorgespannt (p &gt; 0):</strong> Beide Krümmungen sind gleichsinnig – die Fläche ist <em>synklastisch</em> (Kissen, Kuppel).</li>
                  <li><strong>Sonderfälle:</strong> Zylinder (<FormulaText text="$R_2 \to \infty$" />) liefert die Kesselformel <FormulaText text="$n = p \cdot r$" />, die Kugel (<FormulaText text="$n_1 = n_2$" />, <FormulaText text="$R_1 = R_2$" />) liefert <FormulaText text="$n = p \cdot r/2$" />.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Gegen- und gleichsinnige Krümmung</h3>
                  <div className="bg-off-white rounded-xl border border-home-grau/30 p-3"><KruemmungSkizze /></div>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Formfindung und Zuschnitt</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><strong>Formfindung:</strong> Gesucht ist die Gleichgewichtsform für eine vorgegebene Vorspannung und Randgeometrie. Bei gleicher Vorspannung in alle Richtungen entsteht eine Minimalfläche (mittlere Krümmung null) – das Prinzip der Seifenhautmodelle von Frei Otto. Numerisch dienen die Kraftdichtemethode oder die dynamische Relaxation.</li>
                    <li><strong>Statische Analyse:</strong> Die Berechnung ist geometrisch nichtlinear (große Verformungen). Faltenbildung zeigt an, dass eine Richtung spannungslos geworden ist.</li>
                    <li><strong>Zuschnitt:</strong> Die doppelt gekrümmte Fläche wird in ebene Bahnen zerlegt. Die Bahnen werden um die Vorspanndehnung kleiner zugeschnitten (Kompensation), damit sich nach dem Einbau die geplante Vorspannung einstellt.</li>
                    <li><strong>Kriechen:</strong> Unter Dauerlast und erhöhter Temperatur lässt die Vorspannung nach. Bei PVC/PES und ETFE ist das ausgeprägter als bei Glasgewebe; Nachspannen oder Druckregelung gleichen das aus.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'kennwerte' && (
            <div className="flex flex-col gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-1">Werkstoffkennwerte im Vergleich</h3>
                <p className="text-xs text-text-main/70 mb-3">Größenordnungen aus Herstellerdatenblättern (Lehrwerte, Nennwerte ohne Toleranz). Maßgebend sind die Werte der jeweiligen Zulassung bzw. Leistungserklärung.</p>
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
                      <tr><td className="p-2 border border-home-grau/30 font-semibold">Zugfestigkeit Kette/Schuss (Streifenzugversuch)</td><td className="p-2 border border-home-grau/30">rund 3.000 bis 10.000 N/5 cm je nach Typ; z. B. 4.400/4.000 N/5 cm bei 900 g/m²</td><td className="p-2 border border-home-grau/30">rund 2.000 bis 5.000 N/5 cm; z. B. 5.000/4.500 N/5 cm bei 700 g/m²</td><td className="p-2 border border-home-grau/30">Bruchspannung um 50 N/mm², Spannung bei 10 % Dehnung um 23 N/mm² (nahezu isotrop)</td></tr>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold">Weiterreißfestigkeit</td><td className="p-2 border border-home-grau/30">z. B. 580/520 N (900 g/m²)</td><td className="p-2 border border-home-grau/30">z. B. 450 N (700 g/m²)</td><td className="p-2 border border-home-grau/30">hoch; Datenblattangabe je Foliendicke</td></tr>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold">Bruchdehnung</td><td className="p-2 border border-home-grau/30">gering bis mäßig (Gewebe)</td><td className="p-2 border border-home-grau/30">sehr gering (Glasfaser)</td><td className="p-2 border border-home-grau/30">sehr hoch, bis rund 500 %</td></tr>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold">Kriechen</td><td className="p-2 border border-home-grau/30">merklich (Polyester)</td><td className="p-2 border border-home-grau/30">gering</td><td className="p-2 border border-home-grau/30">merklich, stark temperaturabhängig</td></tr>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold">Lichttransmission</td><td className="p-2 border border-home-grau/30">gering, z. B. 5 % (weiß, 900 g/m²); Netzgewebe höher</td><td className="p-2 border border-home-grau/30">rund 15 bis 50 % je nach Sorte (gebleicht)</td><td className="p-2 border border-home-grau/30">rund 90 bis 95 % (klar); UV-A weitgehend durchlässig</td></tr>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold">Brandverhalten (typische Angabe)</td><td className="p-2 border border-home-grau/30">B-s2,d0 nach DIN EN 13501-1 bzw. B1 nach DIN 4102</td><td className="p-2 border border-home-grau/30">A2 nach DIN 4102 in Datenblättern; Euroklasse produktabhängig (z. B. B-s1,d0)</td><td className="p-2 border border-home-grau/30">B-s1,d0 nach DIN EN 13501-1</td></tr>
                      <tr><td className="p-2 border border-home-grau/30 font-semibold">Lebensdauer (Größenordnung)</td><td className="p-2 border border-home-grau/30">rund 10 bis 30 Jahre, je nach Decklack (Acryl kürzer, PVDF länger)</td><td className="p-2 border border-home-grau/30">rund 25 bis 35 Jahre und mehr</td><td className="p-2 border border-home-grau/30">über 30 Jahre</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-text-main/70 mt-3">Die Zugfestigkeit von Geweben wird in N/5 cm (Streifenbreite 50 mm) angegeben: 4.000 N/5 cm entsprechen 80 kN/m. ETFE: Dichte 1,75 g/cm³, Schmelzbereich um 265 °C.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-1 flex items-center gap-2"><Sun size={16} className="text-shiraz" aria-hidden="true" /> Wärmeschutz mehrlagiger ETFE-Kissen</h3>
                  <p className="text-xs text-text-main/70 mb-3">Herstellerangaben (Richtwerte, ohne Randverbund); jede zusätzliche Luftschicht senkt den U-Wert, aber mit abnehmender Wirkung.</p>
                  <table className="w-full text-xs border-collapse">
                    <thead><tr className="bg-off-white text-left"><th className="p-2 border border-home-grau/30">Aufbau</th><th className="p-2 border border-home-grau/30">U-Wert in W/(m²K)</th></tr></thead>
                    <tbody>
                      <tr><td className="p-2 border border-home-grau/30">einlagige Folie</td><td className="p-2 border border-home-grau/30">rund 5,6</td></tr>
                      <tr><td className="p-2 border border-home-grau/30">2-lagiges Kissen (1 Luftkammer)</td><td className="p-2 border border-home-grau/30">rund 2,9</td></tr>
                      <tr><td className="p-2 border border-home-grau/30">3-lagiges Kissen (2 Luftkammern)</td><td className="p-2 border border-home-grau/30">rund 1,8 bis 2,0</td></tr>
                      <tr><td className="p-2 border border-home-grau/30">4-lagiges Kissen (3 Luftkammern)</td><td className="p-2 border border-home-grau/30">rund 1,4 bis 1,5</td></tr>
                      <tr><td className="p-2 border border-home-grau/30">5-lagiges Kissen (4 Luftkammern)</td><td className="p-2 border border-home-grau/30">rund 1,2</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Bauphysikalische Besonderheiten</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><strong>Geringe Speichermasse:</strong> Membranhüllen reagieren schnell auf Sonne und Außentemperatur; sommerlicher Wärmeschutz über Bedruckung, Lüftung und Verschattung.</li>
                    <li><strong>Tauwasser:</strong> An der kalten Innenseite kann Tauwasser ausfallen; Rinnen und Tropfkanten sind einzuplanen. Die Stützluft wird getrocknet, damit die Kissenkammern beschlagfrei bleiben.</li>
                    <li><strong>Schall:</strong> Leichte Hüllen dämmen Luftschall wenig, Regen auf ETFE-Kissen ist hörbar; dagegen helfen z. B. Regendämpfungsnetze.</li>
                    <li><strong>Energie:</strong> Die Gebläse der Kissen und Traglufthallen benötigen dauerhaft Strom und eine Notversorgung.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'rechner' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className="flex flex-col gap-4">
                <CalculatorDisclaimerBanner className="my-1" customText="Lehrrechner: Festigkeiten und Sicherheitsbeiwerte sind Lehrwerte. Die Bemessung erfolgt nach Zulassung bzw. Bauartgenehmigung (abZ/aBG, vBG) und künftig nach EN 19102." />
                <div className={box}>
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">Geometrie und Druck</h3>
                  <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Krümmungsform">
                    {(['zylinder', 'kugel'] as const).map(g => (
                      <button key={g} type="button" aria-pressed={geometrie === g} onClick={() => setGeometrie(g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${geometrie === g ? 'bg-shiraz text-white border-shiraz' : 'bg-white border-home-grau/30'}`}>
                        {g === 'zylinder' ? 'Zylinder: n = p · r' : 'Kugel: n = p · r/2'}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Eingabe der Krümmung">
                    {(['stich', 'radius'] as const).map(m => (
                      <button key={m} type="button" aria-pressed={modus === m} onClick={() => setModus(m)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${modus === m ? 'bg-shiraz text-white border-shiraz' : 'bg-white border-home-grau/30'}`}>
                        {m === 'stich' ? 'Spannweite und Stich' : 'Radius direkt'}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    <Slider label="Innendruck p" info="Überdruck bzw. Druckdifferenz an der betrachteten Lage." min={100} max={1000} step={10} value={p} unit="Pa" onChange={e => setP(Number(e.target.value))} />
                    {modus === 'stich' ? (
                      <>
                        <Slider label="Spannweite L" min={1} max={30} step={0.5} value={L} unit="m" onChange={e => setL(Number(e.target.value))} />
                        <Slider label="Stich f" info="Höhe der Wölbung in Feldmitte; höchstens L/2." min={0.05} max={5} step={0.05} value={f} unit="m" onChange={e => setF(Number(e.target.value))} />
                      </>
                    ) : (
                      <Slider label="Krümmungsradius r" min={1} max={40} step={0.5} value={radius} unit="m" onChange={e => setRadius(Number(e.target.value))} />
                    )}
                  </div>
                </div>
                <div className={box}>
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">Werkstoff (Lehrwerte)</h3>
                  <label className="text-sm font-medium text-text-main" htmlFor="membran-vorgabe">Vorgabe</label>
                  <select id="membran-vorgabe" className="w-full mt-1 mb-4 p-2 border border-home-grau rounded-md bg-white" value={vorgabe} onChange={e => waehleVorgabe(e.target.value as VorgabeId)}>
                    {Object.entries(VORGABEN).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                  </select>
                  <div className="flex flex-col gap-4">
                    {werkstoff === 'folie' ? (
                      <>
                        <Slider label="Foliendicke t" min={50} max={400} step={10} value={dicke} unit="µm" onChange={e => setDicke(Number(e.target.value))} />
                        <Slider label="Bezugsfestigkeit f" info="Lehrwert: Spannung bei 10 % Dehnung nach Datenblatt (um 23 N/mm²); Bruchspannung um 50 N/mm²." min={5} max={60} step={1} value={festigkeit} unit="N/mm²" onChange={e => setFestigkeit(Number(e.target.value))} />
                      </>
                    ) : (
                      <Slider label="Kurzzeitzugfestigkeit f_t" info="Streifenzugfestigkeit der maßgebenden Richtung (Kette oder Schuss)." min={1000} max={12000} step={100} value={festigkeit} unit="N/5 cm" onChange={e => setFestigkeit(Number(e.target.value))} />
                    )}
                    <Slider label="Gesamtsicherheitsbeiwert γ" info="Lehrwert; deckt Langzeit-, Temperatur-, Alterungs- und Fügungseinflüsse pauschal ab." min={1} max={8} step={0.1} value={gamma} unit="–" onChange={e => setGamma(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {modus === 'stich' && gueltig && (
                  <div className={karte}>
                    <h3 className="font-bold text-text-main mb-2">Schnitt durch die Membran</h3>
                    <SchnittSkizze L={L} f={f} r={erg.r} />
                  </div>
                )}
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Ergebnis</h3>
                  {gueltig ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70">Radius r</div><div className="text-lg font-bold">{formatDeZahl(erg.r, 2)} m</div></div>
                      <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70">Membrankraft n</div><div className="text-lg font-bold text-shiraz">{formatDeZahl(erg.nKN, 2)} kN/m</div></div>
                      {werkstoff === 'folie' && <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70">Folienspannung σ</div><div className="text-lg font-bold">{formatDeZahl(erg.sigma, 2)} N/mm²</div></div>}
                      <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70">zulässig n_zul (Lehrwert)</div><div className="text-lg font-bold">{formatDeZahl(erg.nZul / 1000, 2)} kN/m</div></div>
                      <div className={`p-3 rounded-xl border col-span-2 ${erg.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                        <div className="text-xs flex items-center gap-1"><ShieldCheck size={14} aria-hidden="true" /> Ausnutzung η = n / n_zul</div>
                        <div className="text-lg font-bold">{formatDeZahl(erg.eta * 100, 0)} % – {erg.ok ? 'Lehrwert eingehalten' : 'Lehrwert überschritten'}</div>
                      </div>
                    </div>
                  ) : <p className="text-sm text-text-main/80">Keine Berechnung möglich.</p>}
                  <EingabeHinweise hinweise={erg.hinweise} />
                </div>
                <FormulaDerivationBox
                  live
                  title={`Ihr Rechenweg: Kesselformel und Ausnutzung (p = ${formatDeZahl(p, 0)} Pa)`}
                  zielGleichung={kessel}
                  schritte={liveSchritte}
                  ergebnisHinweis="Großer Radius bedeutet große Membrankraft: Flache Wölbungen und große Spannweiten sind ungünstig."
                  normQuelle="Gleichgewicht am Kreiszylinder bzw. an der Kugel (Kesselformel); Festigkeit und γ als Lehrwerte"
                />
              </div>
            </div>
          )}

          {tab === 'regelwerke' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Regelwerke in Deutschland</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>Verwendbarkeit:</strong> Für Membranwerkstoffe und ihre Fügungen gibt es keine harmonisierte Produktnorm mit vollständiger Tragwerksbemessung. Der Nachweis erfolgt daher über eine allgemeine bauaufsichtliche Zulassung bzw. allgemeine Bauartgenehmigung (abZ/aBG) oder im Einzelfall über eine vorhabenbezogene Bauartgenehmigung (vBG) bzw. Zustimmung im Einzelfall.</li>
                  <li><strong>Traglufthallen:</strong> DIN 4134-1:2026-03 regelt Berechnung, Ausführung und Betrieb von Tragluftbauten (ersetzt DIN 4134:1983-02); DIN 4134-101 regelt den Konformitätsnachweis. Hüllen aus Luftkissen sind ausdrücklich nicht erfasst.</li>
                  <li><strong>Bemessung:</strong> CEN/TS 19102:2023 (deutsch DIN CEN/TS 19102:2024-08) beschreibt die Bemessung vorgespannter Membrantragwerke nach dem Teilsicherheitskonzept der EN 1990, für mechanisch und pneumatisch vorgespannte Membranen. Sie soll von der Eurocode-Norm EN 19102 („Eurocode 12“) abgelöst werden, die als Entwurf prEN 19102-1-1 vorliegt.</li>
                  <li><strong>Zelte:</strong> Fliegende Bauten aus Zeltkonstruktionen behandelt DIN EN 13782:2015-06.</li>
                  <li><strong>Brandverhalten:</strong> Klassifizierung nach DIN EN 13501-1:2019-05; die Anforderungen ergeben sich aus Bauordnung und Sonderbauvorschriften.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-2">Allianz Arena, München (2005)</h3>
                  <p className="text-sm text-text-main/85">Entwurf Herzog &amp; de Meuron. Fassade und Dach bestehen aus rund 2.800 rautenförmigen ETFE-Luftkissen. Die Kissen der Fassade lassen sich farbig hinterleuchten – das Stadion leuchtet je nach Anlass rot, blau oder weiß. Das Projekt zeigt, wie ETFE eine Gebäudehülle zugleich leicht, transluzent und gestaltbar macht.</p>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-2">Eden Project, Cornwall (2001)</h3>
                  <p className="text-sm text-text-main/85">Entwurf Nicholas Grimshaw &amp; Partners. Die Gewächshäuser („Biome“) sind geodätische Kuppeln, deren Felder mit sechseckigen, mehrlagigen ETFE-Kissen geschlossen sind. Ausschlaggebend waren das geringe Gewicht gegenüber Glas und die hohe Durchlässigkeit für Licht und UV-Strahlung, die den Pflanzen zugutekommt.</p>
                </div>
              </div>
            </div>
          )}
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIELE */}
      <FormulaDerivationBox
        title="Beispiel 1: Membrankraft einer Traglufthalle aus PVC/PES"
        zielGleichung="n = p \cdot r"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Tonnenförmige Traglufthalle (Querschnitt näherungsweise Halbkreis), Radius 18 m, Betriebsdruck 300 Pa (angenommen). Gewebe PVC/PES Typ II mit 4.000 N/5 cm in Schussrichtung.', formel: 'r = 18\\,\\text{m}, \\quad p = 300\\,\\text{Pa}, \\quad f_t = 4\\,000\\,\\text{N/5 cm}' },
          { titel: 'Membrankraft im Betrieb', erklaerung: 'Zylinder, Kraft in Umfangsrichtung:', formel: 'n = 300 \\cdot 18 = 5\\,400\\,\\text{N/m} = 5{,}4\\,\\text{kN/m}' },
          { titel: 'Zulässige Membrankraft (Lehrwert)', erklaerung: 'Kurzzeitfestigkeit auf 1 m umgerechnet, Gesamtsicherheitsbeiwert 5 (Lehrwert):', formel: 'n_{zul} = \\frac{4\\,000 / 0{,}05}{5} = \\frac{80\\,000}{5} = 16\\,000\\,\\text{N/m} = 16\\,\\text{kN/m}' },
          { titel: 'Ausnutzung und Sturmbetrieb', erklaerung: 'Bei Sturm wird der Innendruck erhöht, z. B. auf 550 Pa:', formel: '\\eta = \\frac{5{,}4}{16} = 0{,}34; \\quad n_{Sturm} = 550 \\cdot 18 = 9\\,900\\,\\text{N/m} \\Rightarrow \\eta = 0{,}62' },
        ]}
        ergebnisHinweis="Die Membrankraft wächst linear mit Druck und Radius. Große Hallen brauchen daher Seilnetze, die den wirksamen Radius verkleinern."
        normQuelle="Kesselformel; Bemessung nach DIN 4134-1:2026-03 und Zulassung (Festigkeit und γ hier Lehrwerte)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: ETFE-Kissenlage unter erhöhtem Innendruck"
        zielGleichung="r = \frac{L^2}{8 f} + \frac{f}{2}, \quad \sigma = \frac{p \cdot r}{t}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Langes Kissen (näherungsweise zylindrisch) mit 3,5 m Spannweite, Stich der Lage 0,35 m (10 % der Spannweite), Folie 250 µm. Betriebsdruck 300 Pa, bei Schnee 600 Pa.', formel: 'L = 3{,}5\\,\\text{m}, \\quad f = 0{,}35\\,\\text{m}, \\quad t = 0{,}25\\,\\text{mm}' },
          { titel: 'Krümmungsradius', erklaerung: 'Kreisbogen aus Spannweite und Stich:', formel: 'r = \\frac{3{,}5^2}{8 \\cdot 0{,}35} + \\frac{0{,}35}{2} = 4{,}375 + 0{,}175 = 4{,}55\\,\\text{m}' },
          { titel: 'Betrieb (300 Pa)', erklaerung: 'Membrankraft und Folienspannung:', formel: 'n = 300 \\cdot 4{,}55 = 1\\,365\\,\\text{N/m}; \\quad \\sigma = \\frac{1{,}365\\,\\text{N/mm}}{0{,}25\\,\\text{mm}} = 5{,}46\\,\\text{N/mm}^2' },
          { titel: 'Schnee (600 Pa)', erklaerung: 'Doppelter Druck, doppelte Spannung – Vergleich mit dem Lehrwert 23 N/mm² / 2 = 11,5 N/mm²:', formel: '\\sigma = 10{,}92\\,\\text{N/mm}^2 \\Rightarrow \\eta = \\frac{10{,}92}{11{,}5} = 0{,}95' },
        ]}
        ergebnisHinweis="Bei Schnee wird die Folie hoch ausgenutzt. Abhilfe: größerer Stich (kleinerer Radius), kleinere Kissen oder Seilverstärkungen."
        normQuelle="Kesselformel; Bezugsfestigkeit (Spannung bei 10 % Dehnung) und γ als Lehrwerte nach Datenblatt"
      />

      <ModulTest moduleId="membranen_etfe" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (neu erstellt, AP 3.13; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Ethylen-Tetrafluorethylen', url: 'https://de.wikipedia.org/wiki/Ethylen-Tetrafluorethylen' },
          { title: 'Allianz Arena', url: 'https://de.wikipedia.org/wiki/Allianz_Arena' },
          { title: 'Eden Project', url: 'https://de.wikipedia.org/wiki/Eden_Project' },
        ]}
        literatur={[
          'Knippers, J.; Cremers, J.; Gabler, M.; Lienhard, J.: Atlas Kunststoffe + Membranen. München: Institut für internationale Architektur-Dokumentation (Edition Detail) 2010',
          'Seidel, M.: Textile Hüllen – Bauen mit biegeweichen Tragelementen. Berlin: Ernst & Sohn 2008',
          'Forster, B.; Mollaert, M. (Hrsg.): European Design Guide for Tensile Surface Structures. Brüssel: TensiNet 2004',
          'LeCuyer, A.: ETFE – Technology and Design. Basel: Birkhäuser 2008',
        ]}
        regelwerke={[
          { title: 'DIN CEN/TS 19102:2024-08 (Bemessung von vorgespannten Membrantragwerken; Deutsche Fassung CEN/TS 19102:2023)' },
          { title: 'prEN 19102-1-1 (Entwurf: Eurocode 12 – Design of tensioned membrane structures – Part 1-1: General rules; soll CEN/TS 19102 ablösen)' },
          { title: 'DIN 4134-1:2026-03 (Tragluftbauten – Teil 1: Berechnung, Ausführung und Betrieb; ersetzt DIN 4134:1983-02)' },
          { title: 'DIN 4134-101:2026-03 (Tragluftbauten – Teil 101: Konformitätsnachweis für Tragluftbauten nach DIN 4134-1)' },
          { title: 'DIN EN 13782:2015-06 (Fliegende Bauten – Zelte – Sicherheit)' },
          { title: 'DIN EN 13501-1:2019-05 (Klassifizierung von Bauprodukten und Bauarten zu ihrem Brandverhalten – Teil 1)' },
        ]}
        formeln={[
          { formel: '\\frac{n_1}{R_1} + \\frac{n_2}{R_2} = p', erklaerung: 'Gleichgewicht eines gekrümmten Membranelements mit den Membrankräften n_1, n_2 [N/m], den Hauptkrümmungsradien R_1, R_2 [m] und der Flächenlast p [N/m²]. Für p = 0 folgt die antiklastische Form.', quelle: 'Membrantheorie' },
          { formel: 'n = p \\cdot r \\;(\\text{Zylinder}), \\quad n = \\frac{p \\cdot r}{2} \\;(\\text{Kugel})', erklaerung: 'Kesselformel für unter Innendruck stehende, einfach bzw. gleichsinnig doppelt gekrümmte Membranen.', quelle: 'Membrantheorie' },
          { formel: 'r = \\frac{L^2}{8 f} + \\frac{f}{2}', erklaerung: 'Radius eines Kreisbogens mit Spannweite L und Stich f.', quelle: 'Geometrie' },
        ]}
      />
    </div>
  );
}
