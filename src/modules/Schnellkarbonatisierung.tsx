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
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

type Reiter = 'grundlagen' | 'pruefung' | 'auswertung' | 'rechner' | 'grenzen';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'grundlagen', label: 'Grundlagen', icon: BookOpen },
  { id: 'pruefung', label: 'Prüfverfahren', icon: FlaskConical },
  { id: 'auswertung', label: 'Auswertung & Umrechnung', icon: TrendingUp },
  { id: 'rechner', label: 'Rechner K_AC & Prognose', icon: Calculator },
  { id: 'grenzen', label: 'Grenzen', icon: ShieldAlert },
];

const karte = 'bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30';
const kasten = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const th = 'p-2.5 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2.5 text-xs text-text-main/85 border-b border-home-grau/15 align-top';

const ZEITEN = [0, 7, 28, 70];

/** Beispiel-Messreihen (Lehrwerte, keine Prüfergebnisse realer Betone) */
const REIHEN: { id: string; name: string; x: number[] }[] = [
  { id: 'a', name: 'Beispiel A: dichter Beton, CEM I (Lehrwerte)', x: [0.5, 2.5, 4.8, 7.5] },
  { id: 'b', name: 'Beispiel B: Beton mit hohem Hüttensandanteil (Lehrwerte)', x: [1.0, 4.5, 8.5, 13.4] },
  { id: 'c', name: 'Beispiel C: Messreihe mit Ausreißer (Lehrwerte)', x: [0.5, 5.5, 4.0, 7.8] },
];

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
  const sMax = Math.max(1, ...punkte.map(p => Math.sqrt(Math.max(p.tTage, 0)))) * 1.08;
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
            <FlaskConical className="w-5 h-5 text-shiraz" /> Schnellkarbonatisierung nach DIN EN 12390-12
          </h2>
          <p className="text-xs text-text-main/50 font-mono mt-1">
            Beschleunigte Prüfung des Karbonatisierungswiderstands: Prüfablauf, Karbonatisierungskoeffizient K_AC, Umrechnung und Prognose gegenüber der Betondeckung
          </p>
        </div>

        <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed flex items-start gap-2.5">
          <GraduationCap size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Projekthinweis:</strong> Der Karbonatisierungswiderstand neuer Betonrezepturen ist ein Forschungsthema an der TH Augsburg und im TTZ Aichach.
            Das Modul stützt sich ausschließlich auf veröffentlichte Normen und Fachliteratur; die Messreihen im Rechner sind Lehrwerte.
          </p>
        </div>

        <ModuleTabs label="Bereiche des Moduls Schnellkarbonatisierung" tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
          <div className="pt-5 animate-in fade-in duration-300">
            {/* ───────────── 1. GRUNDLAGEN ───────────── */}
            {reiter === 'grundlagen' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <p>
                    CO₂ aus der Luft dringt durch die Poren in den Beton ein, löst sich im Porenwasser und reagiert mit dem Calciumhydroxid des Zementsteins.
                    Der pH-Wert der Porenlösung sinkt dabei von etwa 12,5 bis 13,5 auf Werte unter 9. Erreicht diese <strong>Karbonatisierungsfront</strong> die Bewehrung, geht die schützende Passivschicht des Stahls verloren – bei ausreichender Feuchte beginnt die Korrosion.
                  </p>
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
                    <p className="text-xs text-text-main/80 leading-relaxed">Mehr Klinker bedeutet mehr Calciumhydroxid, das CO₂ bindet. Zemente mit hohem Anteil an Hüttensand, Flugasche oder Kalksteinmehl karbonatisieren bei gleichem w/z-Wert in der Regel schneller.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Dichtheit</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed">Niedriger w/z-Wert und gute Nachbehandlung verringern die Diffusion. Die oberflächennahe Randzone ist dabei maßgebend.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Feuchte</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed">Am schnellsten verläuft die Karbonatisierung bei mittlerer Luftfeuchte (etwa 50 bis 70 %). In wassergesättigtem Beton ist die Diffusion behindert, in sehr trockenem fehlt das Reaktionswasser.</p>
                  </div>
                </div>
                <Querverweis ziel="korrosion" titel="Was nach der Depassivierung geschieht" linkText="Zum Modul Bewehrungskorrosion">
                  <p>Elektrochemie der Bewehrungskorrosion, Einleitungs- und Schädigungsphase (Tuutti-Modell) sowie den Vergleich mit chloridinduzierter Korrosion behandelt das Modul Bewehrungskorrosion.</p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 2. PRÜFVERFAHREN ───────────── */}
            {reiter === 'pruefung' && (
              <div className="flex flex-col gap-6">
                <p className="text-sm text-text-main/80 leading-relaxed">
                  DIN EN 12390-12 beschleunigt die Karbonatisierung durch eine erhöhte, aber noch moderate CO₂-Konzentration. Bei sehr hohen Konzentrationen entstehen andere Reaktionsprodukte und Gefüge als unter natürlichen Bedingungen; 3 % gelten als Kompromiss zwischen Prüfdauer und Übertragbarkeit. Die Übersicht nennt die Kernpunkte – maßgebend ist der Normtext.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[620px]">
                    <thead><tr><th className={th}>Schritt</th><th className={th}>Festlegung (Kernpunkte)</th><th className={th}>Zweck</th></tr></thead>
                    <tbody>
                      <tr><td className={td}><strong>Probekörper</strong></td><td className={td}>Prismen, z. B. 100 mm × 100 mm × 400 mm; Ausschalen nach etwa einem Tag</td><td className={td}>mehrere Spaltflächen aus einem Probekörper</td></tr>
                      <tr><td className={td}><strong>Vorlagerung</strong></td><td className={td}>Wasserlagerung bis zum Alter von 28 Tagen, anschließend mindestens 14 Tage im Laborklima</td><td className={td}>definierte Hydratation; Feuchte im Porensystem auf ein prüfgerechtes Niveau absenken</td></tr>
                      <tr><td className={td}><strong>Lagerung im Prüfschrank</strong></td><td className={td}>(3,0 ± 0,5) Vol.-% CO₂, (57 ± 3) % relative Luftfeuchte, (20 ± 2) °C; Abstand zu den Wänden für freie Umströmung</td><td className={td}>gleichmäßige, beschleunigte Karbonatisierung</td></tr>
                      <tr><td className={td}><strong>Messzeitpunkte</strong></td><td className={td}>mehrere Zeitpunkte während der Lagerung, z. B. nach 7, 28 und 70 Tagen; optional eine Nullmessung vor Beginn</td><td className={td}>Regression über √t statt Einzelwert</td></tr>
                      <tr><td className={td}><strong>Messung</strong></td><td className={td}>Scheibe abspalten, frische Bruchfläche mit Phenolphthaleinlösung besprühen, Tiefe des farblosen Bereichs an mehreren Stellen je Seite messen und mitteln</td><td className={td}>mittlere Karbonatisierungstiefe d_k je Zeitpunkt</td></tr>
                      <tr><td className={td}><strong>Auswertung</strong></td><td className={td}>lineare Regression der Tiefen über √t; die Steigung ist der Karbonatisierungskoeffizient K_AC in mm/√d</td><td className={td}>vergleichbarer Kennwert des Karbonatisierungswiderstands</td></tr>
                    </tbody>
                  </table>
                </div>
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Phenolphthalein-Test</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Phenolphthalein färbt sich oberhalb von etwa pH 9 rotviolett und bleibt darunter farblos. Der farblose Saum markiert den karbonatisierten Bereich. Das Verfahren ist auch für Bauwerksuntersuchungen in DIN EN 14630 beschrieben. Zu beachten: Der Umschlag zeigt einen pH-Bereich, nicht die vollständige Karbonatisierung – eine Teilkarbonatisierung reicht über die sichtbare Front hinaus. Die Messung erfolgt an frischen Bruchflächen, nicht an gesägten Flächen, weil Sägeschlamm die Grenze verschmiert.
                  </p>
                </section>
                <Querverweis ziel="biokohlebeton" titel="Anwendungsfall: neue Betonrezepturen" linkText="Zum Modul Biokohlebeton">
                  <p>Bei dunkel gefärbten Betonen, etwa mit Pflanzenkohle, ist der Farbumschlag schwer abzulesen. Warum der Karbonatisierungswiderstand solcher Rezepturen geprüft werden sollte, erläutert das Modul Biokohlebeton.</p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 3. AUSWERTUNG & UMRECHNUNG ───────────── */}
            {reiter === 'auswertung' && (
              <div className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Regression über √t</h3>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                    <BlockMath math="d_k = a + K_{AC} \cdot \sqrt{t}, \qquad K_{AC} = \frac{\sum (s_i - \bar{s})(d_i - \bar{d})}{\sum (s_i - \bar{s})^2}, \quad s_i = \sqrt{t_i}" />
                    <p className="text-[11px] text-text-main/70 text-center">
                      <FormulaText text="$t$ in Tagen Lagerung bei 3 % CO₂, $d_k$ in mm, $K_{AC}$ in mm/√d. Der Achsenabschnitt $a$ erfasst eine Anfangskarbonatisierung aus der Vorlagerung; ohne Nullmessung wird oft durch den Ursprung gerechnet: $K = \sum s_i d_i / \sum s_i^2$." />
                    </p>
                  </div>
                </section>
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Umrechnung auf natürliche Bedingungen – Näherung</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Nach dem Fickschen Gesetz wächst K mit der Wurzel der CO₂-Konzentration. Mit der Umrechnung der Zeiteinheit von Tagen auf Jahre ergibt sich ein Faktor in der Größenordnung von 2:
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                    <BlockMath math="K_{nat} \approx K_{AC} \cdot \sqrt{\frac{c_{nat}}{c_{acc}}} \cdot \sqrt{365} = K_{AC} \cdot \sqrt{\frac{0{,}04}{3{,}0}} \cdot 19{,}1 \approx 2{,}2 \cdot K_{AC}" />
                    <p className="text-[11px] text-text-main/70 text-center">
                      <FormulaText text="$K_{nat}$ in mm/√a, $K_{AC}$ in mm/√d; $c_{nat} \approx 0{,}04$ Vol.-% (400 ppm)." />
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed flex items-start gap-2">
                    <Info size={14} className="text-amber-700 shrink-0 mt-0.5" />
                    <p>
                      <strong>Nur eine Größenordnung:</strong> Die Umrechnung erfasst allein die CO₂-Konzentration. Im Bauwerk wirken zusätzlich die Luftfeuchte (Prüfung bei 57 %, außen meist höher), Beregnung und Austrocknung, Temperatur, die Nachbehandlung auf der Baustelle und die Streuung der Betondeckung. Vor Regen geschützte Außenbauteile karbonatisieren meist schneller als beregnete, Innenbauteile mit trockener Luft je nach Feuchte ebenfalls schneller. Probabilistische Modelle (fib Model Code for Service Life Design, DAfStb Heft 510) verwenden den Prüfwert deshalb nur als Materialkennwert und ergänzen Faktoren für Umwelt, Ausführung und Prüfverfahren.
                    </p>
                  </div>
                </section>
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Prognose gegenüber der Betondeckung</h3>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                    <BlockMath math="x_c(t) = K_{nat} \cdot \sqrt{t}, \qquad t_c = \left(\frac{c}{K_{nat}}\right)^2" />
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Doppelte Deckung bedeutet die vierfache Zeit bis zur Depassivierung – der wirksamste Hebel neben einem dichten Beton. Nach der eingeführten Fassung des Eurocode 2 wird die Dauerhaftigkeit deskriptiv über Expositionsklasse, Mindestbetondeckung c_min,dur und Betonzusammensetzung nach DIN 1045-2 sichergestellt, nicht über eine solche Prognose. Die 2. Generation (DIN EN 1992-1-1:2025-09) führt Expositionswiderstandsklassen ein, die sich auf Prüfwerte des Karbonatisierungswiderstands stützen.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[420px]">
                      <thead><tr><th className={th}>Expositionsklasse</th><th className={th}>c_min,dur Betonstahl (NA DE)</th></tr></thead>
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
                      <span className="text-xs font-bold text-text-main">Beispielreihe laden</span>
                      <select
                        aria-label="Beispielreihe laden"
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
                      <input type="checkbox" checked={mitA} onChange={e => setMitA(e.target.checked)} className="accent-shiraz w-4 h-4" />
                      Regression mit Achsenabschnitt a
                    </label>
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider pt-2">Umrechnung und Bauteil</h3>
                    {eingabe('CO₂ im Prüfschrank c_acc', cAcc, setCAcc, 'Vol.-%', '0.1')}
                    {eingabe('CO₂ natürlich c_nat', cNat, setCNat, 'Vol.-%', '0.01')}
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-main">Betondeckung c (Vorgabe c_min,dur nach NA DE)</span>
                      <select
                        aria-label="Vorgabe Betondeckung"
                        value=""
                        onChange={e => { const d = DECKUNGEN.find(q => q.id === e.target.value); if (d) setDeckung(d.c); }}
                        className="p-2 border border-home-grau/50 rounded-lg bg-white text-sm focus:outline-none focus:border-shiraz"
                      >
                        <option value="" disabled>Expositionsklasse wählen …</option>
                        {DECKUNGEN.map(d => <option key={d.id} value={d.id}>{d.id}: {formatDeZahl(d.c, 0)} mm</option>)}
                      </select>
                    </label>
                    {eingabe('Betondeckung c', deckung, setDeckung, 'mm', '1')}
                    {eingabe('Nutzungsdauer t_N', nutzung, setNutzung, 'Jahre', '5')}
                  </div>
                  <EingabeHinweise hinweise={erg.hinweise} />
                </div>

                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { l: 'K_AC (Prüfung)', w: formatDeZahl(erg.kAC, 3), e: 'mm/√d' },
                        { l: 'Bestimmtheitsmaß R²', w: formatDeZahl(erg.reg.r2, 3), e: '' },
                        { l: 'K_nat (Näherung)', w: formatDeZahl(erg.kNat, 2), e: 'mm/√a' },
                        { l: 'Achsenabschnitt a', w: formatDeZahl(erg.reg.a, 2), e: 'mm' },
                      ].map(k => (
                        <div key={k.l} className="p-3 rounded-lg border border-home-grau/30 bg-off-white">
                          <div className="text-[10px] text-text-main/60 font-bold">{k.l}</div>
                          <div className="font-mono font-bold text-text-main text-sm">{k.w} <span className="text-[10px] text-text-main/60">{k.e}</span></div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <figure className="flex flex-col gap-1">
                        <svg viewBox={`0 0 ${B} ${H}`} className="w-full h-auto bg-off-white rounded-lg" role="img" aria-label="Karbonatisierungstiefe über Wurzel der Zeit mit Regressionsgerade">
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
                        <figcaption className="text-[10px] text-text-main/60">Messwerte und Regressionsgerade; die Steigung ist K_AC.</figcaption>
                      </figure>
                      <figure className="flex flex-col gap-1">
                        <svg viewBox={`0 0 ${B} ${H}`} className="w-full h-auto bg-off-white rounded-lg" role="img" aria-label="Prognose der Karbonatisierungstiefe über die Jahre im Vergleich zur Betondeckung">
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
                        <figcaption className="text-[10px] text-text-main/60">Prognose x_c = K_nat · √t (Näherung) gegenüber der Betondeckung.</figcaption>
                      </figure>
                    </div>

                    <div className={`p-4 rounded-xl border text-sm leading-relaxed ${!erg.gueltig ? 'border-home-grau/30 bg-off-white' : erg.ausreichend ? 'border-emerald-300 bg-emerald-50' : 'border-rose-300 bg-rose-50'}`}>
                      {erg.gueltig ? (
                        <p>
                          Nach <strong>{formatDeZahl(nutzung, 0)} Jahren</strong> erreicht die Front rechnerisch <strong>{formatDeZahl(erg.xNutzung, 1)} mm</strong>; die Deckung von {formatDeZahl(deckung, 0)} mm wäre nach etwa <strong>{formatDeZahl(erg.tDeckung, 0)} Jahren</strong> durchkarbonatisiert.
                          {' '}{erg.ausreichend ? 'Die Deckung reicht in dieser Näherung für die Nutzungsdauer.' : 'Die Deckung reicht in dieser Näherung nicht für die Nutzungsdauer.'}
                        </p>
                      ) : <p>Keine Auswertung – Eingaben prüfen.</p>}
                      <p className="text-[11px] text-text-main/60 mt-1.5">Näherung ohne Feuchte-, Beregnungs- und Ausführungseinflüsse; kein Dauerhaftigkeitsnachweis.</p>
                    </div>
                  </div>

                  <FormulaDerivationBox
                    live
                    title="Ihr Rechenweg: K_AC, Umrechnung und Prognose"
                    zielGleichung="d_k = a + K_{AC} \cdot \sqrt{t} \;\Rightarrow\; K_{nat} = K_{AC} \cdot \sqrt{c_{nat}/c_{acc}} \cdot \sqrt{365}"
                    schritte={[
                      {
                        titel: 'Messwerte über √t',
                        erklaerung: `${erg.reg.n} Messpunkte; die Zeit wird als Wurzel aufgetragen:`,
                        formel: punkte.map(p => `\\sqrt{${tex(p.tTage, 0)}} = ${tex(Math.sqrt(Math.max(p.tTage, 0)), 3)} \\to ${tex(p.xMm, 1)}\\,\\text{mm}`).join(', \\quad ') || '\\text{–}',
                      },
                      {
                        titel: 'Regression',
                        erklaerung: mitA ? 'Kleinste Quadrate mit Achsenabschnitt:' : 'Kleinste Quadrate durch den Ursprung:',
                        formel: `K_{AC} = ${tex(erg.kAC, 4)}\\,\\tfrac{\\text{mm}}{\\sqrt{\\text{d}}}, \\quad a = ${tex(erg.reg.a, 2)}\\,\\text{mm}, \\quad R^2 = ${tex(erg.reg.r2, 3)}`,
                      },
                      {
                        titel: 'Umrechnung (Näherung)',
                        erklaerung: 'CO₂-Konzentration und Zeiteinheit (Tage → Jahre):',
                        formel: `K_{nat} = ${tex(erg.kAC, 4)} \\cdot \\sqrt{\\tfrac{${tex(cNat, 3)}}{${tex(cAcc, 1)}}} \\cdot \\sqrt{365} = ${tex(erg.kAC, 4)} \\cdot ${tex(erg.faktor, 3)} = ${tex(erg.kNat, 2)}\\,\\tfrac{\\text{mm}}{\\sqrt{\\text{a}}}`,
                      },
                      {
                        titel: 'Prognose für die Nutzungsdauer',
                        erklaerung: 'Wurzel-t-Gesetz mit dem umgerechneten Koeffizienten:',
                        formel: `x_c = ${tex(erg.kNat, 2)} \\cdot \\sqrt{${tex(nutzung, 0)}} = ${tex(erg.xNutzung, 1)}\\,\\text{mm} \\;${erg.ausreichend ? '\\le' : '>'}\\; c = ${tex(deckung, 0)}\\,\\text{mm}`,
                      },
                      {
                        titel: 'Zeit bis zur Bewehrung',
                        erklaerung: 'Umgestellt nach der Zeit:',
                        formel: `t_c = \\left(\\frac{${tex(deckung, 0)}}{${tex(erg.kNat, 2)}}\\right)^2 = ${tex(erg.tDeckung, 0)}\\,\\text{a}`,
                      },
                    ]}
                    ergebnisHinweis="Der Achsenabschnitt a stammt aus der Vorlagerung und wird in der Prognose nicht fortgeschrieben; maßgebend ist die Steigung."
                    normQuelle="DIN EN 12390-12:2020-04 (Prüfung, Regression); Umrechnung nach dem 1. Fickschen Gesetz (Näherung)"
                  />
                </div>
              </div>
            )}

            {/* ───────────── 5. GRENZEN ───────────── */}
            {reiter === 'grenzen' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5">Was die Prüfung leistet</h3>
                  Sie liefert unter festgelegten Laborbedingungen einen vergleichbaren Kennwert für den Karbonatisierungswiderstand verschiedener Betone – etwa um neue Bindemittel oder Zusatzstoffe gegenüber einem Referenzbeton einzuordnen.
                </div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5">Was sie nicht leistet</h3>
                  Sie ist kein Verfahren zur Bestimmung der Karbonatisierungstiefe bestehender Bauwerke und kein Nachweis der Dauerhaftigkeit. Die Übertragung auf das Bauwerk erfordert Annahmen zu Feuchte, Beregnung, Nachbehandlung und Deckungsstreuung.
                </div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5">Natürliche Lagerung als Gegenprobe</h3>
                  DIN EN 12390-10 beschreibt die Prüfung bei atmosphärischer CO₂-Konzentration. Sie dauert deutlich länger, vermeidet aber die Umrechnung von der erhöhten Konzentration.
                </div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                  <h3 className="font-bold text-text-main text-sm mb-1.5">Typische Fehlerquellen</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>gesägte statt gespaltene Messflächen, zu spät besprühte Flächen</li>
                    <li>Messung an Ecken und groben Gesteinskörnern statt im Mittelbereich der Seiten</li>
                    <li>zu feuchte Probekörper nach verkürzter Vorlagerung (langsame Karbonatisierung)</li>
                    <li>Einheiten verwechselt: K_AC in mm/√d, K_nat in mm/√a</li>
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
          title="Beispiel: Reicht die Deckung von 25 mm für 50 Jahre?"
          zielGleichung="K_{AC} = \frac{\sum s_i d_i}{\sum s_i^2}, \quad x_c(50\,\text{a}) = K_{nat} \cdot \sqrt{50}"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Messwerte nach 7, 28 und 70 Tagen bei 3 % CO₂ (Lehrwerte), Regression durch den Ursprung:', formel: 'd_7 = 2{,}5\\,\\text{mm}, \\quad d_{28} = 4{,}8\\,\\text{mm}, \\quad d_{70} = 7{,}5\\,\\text{mm}' },
            { titel: 'Steigung', erklaerung: 'Mit s = √t: Σ s·d = 2,646 · 2,5 + 5,292 · 4,8 + 8,367 · 7,5 = 94,76 und Σ s² = 7 + 28 + 70 = 105:', formel: 'K_{AC} = \\frac{94{,}76}{105} = 0{,}903\\,\\tfrac{\\text{mm}}{\\sqrt{\\text{d}}}' },
            { titel: 'Umrechnung', erklaerung: 'Auf 0,04 % CO₂ und Jahre (Näherung):', formel: 'K_{nat} = 0{,}903 \\cdot \\sqrt{\\tfrac{0{,}04}{3}} \\cdot \\sqrt{365} = 0{,}903 \\cdot 2{,}206 = 1{,}99\\,\\tfrac{\\text{mm}}{\\sqrt{\\text{a}}}' },
            { titel: 'Prognose', erklaerung: 'Tiefe nach 50 Jahren und Zeit bis 25 mm:', formel: 'x_c = 1{,}99 \\cdot \\sqrt{50} = 14{,}1\\,\\text{mm} < 25\\,\\text{mm}, \\qquad t_c = \\left(\\tfrac{25}{1{,}99}\\right)^2 = 158\\,\\text{a}' },
          ]}
          ergebnisHinweis="Rechnerisch ausreichend – aber nur als Größenordnung. Eine um 10 mm geringere Deckung (15 mm) würde schon nach rund 57 Jahren erreicht."
          normQuelle="Lehrbeispiel; Prüfung nach DIN EN 12390-12:2020-04"
        />
      </div>

      <Querverweis ziel="normen_ausblick" titel="Ausblick: Karbonatisierungswiderstand als Klasse (XRC)" linkText="Zum Modul Ausblick: neue Normengeneration">
        <p>EN 1992-1-1:2023 ordnet Betone Expositionswiderstandsklassen zu; die XRC-Klassenzahl ist wie K_nat eine Rate in mm/√a. Stand der Einführung und Rolle von DIN EN 12390-12 fasst das Ausblick-Modul zusammen.</p>
      </Querverweis>

      <ModulTest moduleId="schnellkarbonatisierung" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 6.2: Modul neu erstellt; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Carbonatisierung', url: 'https://de.wikipedia.org/wiki/Carbonatisierung' },
          { title: 'Phenolphthalein', url: 'https://de.wikipedia.org/wiki/Phenolphthalein' },
        ]}
        literatur={[
          'von Greve-Dierfeld, S.; Lothenbach, B.; Vollpracht, A. et al.: Understanding the carbonation of concrete with supplementary cementitious materials: a critical review by RILEM TC 281-CCC. Materials and Structures 53 (2020), Art. 136',
          'Gehlen, C.: Probabilistische Lebensdauerbemessung von Stahlbetonbauwerken – Zuverlässigkeitsbetrachtungen zur wirksamen Vermeidung von Bewehrungskorrosion. DAfStb Heft 510. Berlin: Beuth 2000',
          'fib – International Federation for Structural Concrete: Model Code for Service Life Design. fib Bulletin 34. Lausanne: fib 2006',
          'Tuutti, K.: Corrosion of steel in concrete. CBI Research Report 4:82. Stockholm: Swedish Cement and Concrete Research Institute 1982',
        ]}
        regelwerke={[
          { title: 'DIN EN 12390-12:2020-04 (Prüfung von Festbeton - Teil 12: Bestimmung des Karbonatisierungswiderstandes von Beton - Beschleunigtes Karbonatisierungsverfahren)' },
          { title: 'DIN EN 12390-10:2019-02 (Prüfung von Festbeton - Teil 10: Bestimmung des Karbonatisierungswiderstandes von Beton bei atmosphärischer Konzentration von Kohlenstoffdioxid)' },
          { title: 'DIN EN 14630:2007-01 (Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken - Prüfverfahren - Bestimmung der Karbonatisierungstiefe im Festbeton mit der Phenolphthalein-Prüfung)' },
          'DIN_EN_206',
          'DIN_EN_1992_1_1',
        ]}
        formeln={[
          { formel: 'd_k = a + K_{AC} \\cdot \\sqrt{t}', erklaerung: 'Karbonatisierungstiefe über der Wurzel der Lagerungsdauer; K_AC in mm/√d aus linearer Regression.', quelle: 'DIN EN 12390-12:2020-04' },
          { formel: 'K_{nat} \\approx K_{AC} \\cdot \\sqrt{c_{nat}/c_{acc}} \\cdot \\sqrt{365}', erklaerung: 'Näherungsweise Umrechnung auf natürliche CO₂-Konzentration und Jahre (nur Konzentrationseinfluss).' },
          { formel: 't_c = \\left(c / K_{nat}\\right)^2', erklaerung: 'Zeit, bis die Karbonatisierungsfront die Betondeckung c erreicht.' },
        ]}
      />
    </div>
  );
}
