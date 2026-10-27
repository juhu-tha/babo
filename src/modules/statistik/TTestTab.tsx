// Reiter „t-Test“ im Modul Statistik (Z24): Ein- und Zweistichproben-t-Test mit Rechenkern src/calc/statistik.ts
import React, { useMemo, useState } from 'react';
import { Sigma } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import inhalt from '@/content/statistik/TTestTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { BloomLernziele, type BloomGoalItem } from '@/src/components/ui/BloomLernziele';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { DiagrammAngaben } from '@/src/lib/diagrammAlternative';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { einstichprobenTTest, zweistichprobenTTest, tPDF, type TTestAlternative, type TTestVariante } from '@/src/calc/statistik';

/** Messwerte aus Freitext: Trennung durch Leerzeichen, Semikolon oder Zeilenumbruch, Dezimalkomma erlaubt */
export function leseWerte(text: string): number[] {
  return text.split(/[\s;]+/).filter(Boolean).map(s => Number(s.replace(',', '.')));
}

const START_1 = '38,2 36,5 40,1 39,4 37,8 41,0 35,9 38,8 39,9 37,1';
const START_2 = '36,1 34,8 37,5 35,2 36,9 33,7 35,8 36,4';
const feld = 'w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-shiraz outline-none bg-white';

export default function TTestTab() {
  const [modus, setModus] = useState<'ein' | 'zwei'>('zwei');
  const [text1, setText1] = useState(START_1);
  const [text2, setText2] = useState(START_2);
  const [mu0, setMu0] = useState(38);
  const [variante, setVariante] = useState<TTestVariante>('welch');
  const [alt, setAlt] = useState<TTestAlternative>('zweiseitig');
  const [alpha, setAlpha] = useState(0.05);

  const erg = useMemo(() => {
    const w1 = leseWerte(text1), w2 = leseWerte(text2);
    if (modus === 'ein') {
      const r = einstichprobenTTest(w1, mu0, alpha, alt);
      return { r, k1: r.kennwerte, k2: undefined };
    }
    const r = zweistichprobenTTest(w1, w2, alpha, variante, alt);
    return { r, k1: r.kennwerte1, k2: r.kennwerte2 };
  }, [modus, text1, text2, mu0, variante, alt, alpha]);
  const { r, k1, k2 } = erg;

  const chartData = useMemo(() => {
    if (!r.gueltig) return { datasets: [] };
    const grenze = Math.min(12, Math.max(4.5, Math.abs(r.t) + 1, r.tKrit + 1));
    const punkte = Array.from({ length: 161 }, (_, i) => -grenze + (2 * grenze * i) / 160);
    const imBereich = (x: number) => (alt === 'zweiseitig' ? Math.abs(x) >= r.tKrit : alt === 'groesser' ? x >= r.tKrit : x <= -r.tKrit);
    return {
      datasets: [
        { label: inhalt.werte.kurvenLabel, data: punkte.map(x => ({ x, y: tPDF(x, r.nu) })), borderColor: '#475569', pointRadius: 0, borderWidth: 2 },
        { label: inhalt.werte.ablehnLabel, data: punkte.map(x => ({ x, y: imBereich(x) ? tPDF(x, r.nu) : null })), borderColor: '#A3113E', backgroundColor: 'rgba(163, 17, 62, 0.25)', fill: 'origin', pointRadius: 0, borderWidth: 1, spanGaps: false },
        { label: inhalt.werte.tLabel, data: [{ x: Math.max(-grenze, Math.min(grenze, r.t)), y: tPDF(r.t, r.nu) }], borderColor: '#1e293b', backgroundColor: '#1e293b', pointRadius: 6, showLine: false },
      ],
    };
  }, [r, alt]);

  const lernziele = inhalt.daten.lernziele as BloomGoalItem[];
  const se = formatDeTeX(r.standardfehler, 4);

  return (
    <div className="flex flex-col gap-6">
      <BloomLernziele moduleId="statistik_ttest" moduleTitle={inhalt.werte.lernzielTitel} timeMinutes={45} goals={lernziele} />

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-3 text-sm text-text-main/90 leading-relaxed">
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2"><Sigma className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.ueberschrift} /></h3>
        <p><MdText text={inhalt.texte.einleitung} /></p>
        <p><MdText text={inhalt.texte.hypothesen} /></p>
        <p><MdText text={inhalt.texte.pWert} /></p>
        <p><MdText text={inhalt.texte.welch} /></p>
        <p><MdText text={inhalt.texte.ki} /></p>
        <p className="bg-off-white p-3 rounded-xl border border-home-grau/30"><MdText text={inhalt.texte.praxis} /></p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.rechnerTitel} /></h3>
          <div>
            <label htmlFor="ttest-modus" className="text-xs text-text-main/80 block mb-1">{inhalt.werte.modus}</label>
            <select id="ttest-modus" className={feld} value={modus} onChange={e => setModus(e.target.value as 'ein' | 'zwei')}>
              <option value="ein">{inhalt.werte.modusEin}</option>
              <option value="zwei">{inhalt.werte.modusZwei}</option>
            </select>
          </div>
          <div>
            <label htmlFor="ttest-serie1" className="text-xs text-text-main/80 block mb-1">{inhalt.werte.serie1}</label>
            <textarea id="ttest-serie1" rows={2} className={feld} value={text1} onChange={e => setText1(e.target.value)} />
          </div>
          {modus === 'zwei' ? (
            <>
              <div>
                <label htmlFor="ttest-serie2" className="text-xs text-text-main/80 block mb-1">{inhalt.werte.serie2}</label>
                <textarea id="ttest-serie2" rows={2} className={feld} value={text2} onChange={e => setText2(e.target.value)} />
              </div>
              <div>
                <label htmlFor="ttest-variante" className="text-xs text-text-main/80 block mb-1">{inhalt.werte.variante}</label>
                <select id="ttest-variante" className={feld} value={variante} onChange={e => setVariante(e.target.value as TTestVariante)}>
                  <option value="welch">{inhalt.werte.varianteWelch}</option>
                  <option value="student">{inhalt.werte.varianteStudent}</option>
                </select>
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="ttest-mu0" className="text-xs text-text-main/80 block mb-1">{inhalt.werte.mu0}</label>
              <input id="ttest-mu0" type="number" step="0.1" className={feld} value={mu0} onChange={e => setMu0(Number(e.target.value))} />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="ttest-alt" className="text-xs text-text-main/80 block mb-1">{inhalt.werte.alternative}</label>
              <select id="ttest-alt" className={feld} value={alt} onChange={e => setAlt(e.target.value as TTestAlternative)}>
                <option value="zweiseitig">{inhalt.werte.altZwei}</option>
                <option value="groesser">{inhalt.werte.altGroesser}</option>
                <option value="kleiner">{inhalt.werte.altKleiner}</option>
              </select>
            </div>
            <div>
              <label htmlFor="ttest-alpha" className="text-xs text-text-main/80 block mb-1">{inhalt.werte.alpha}</label>
              <select id="ttest-alpha" className={feld} value={alpha} onChange={e => setAlpha(Number(e.target.value))}>
                {[0.01, 0.05, 0.1].map(a => <option key={a} value={a}>{formatDeZahl(a * 100, 0)} %</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="bg-orange-800 text-white p-5 rounded-2xl shadow-md flex flex-col gap-3" aria-live="polite">
          <h3 className="text-sm font-bold uppercase tracking-wider opacity-90"><MdText text={inhalt.texte.ergebnisTitel} /></h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-white/80"><FormulaText text="$n_1,\ \bar{x}_1,\ s_1$" /></dt>
            <dd className="font-semibold">{formatDeZahl(k1.n, 0)} · {formatDeZahl(k1.mittelwert, 2)} · {formatDeZahl(k1.stdAbw, 2)}</dd>
            {k2 && <><dt className="text-white/80"><FormulaText text="$n_2,\ \bar{x}_2,\ s_2$" /></dt><dd className="font-semibold">{formatDeZahl(k2.n, 0)} · {formatDeZahl(k2.mittelwert, 2)} · {formatDeZahl(k2.stdAbw, 2)}</dd></>}
            <dt className="text-white/80"><FormulaText text="Prüfgröße $t$" /></dt><dd className="text-xl font-bold">{formatDeZahl(r.t, 3)}</dd>
            <dt className="text-white/80"><FormulaText text="Freiheitsgrade $\nu$" /></dt><dd className="font-semibold">{formatDeZahl(r.nu, 2)}</dd>
            <dt className="text-white/80"><FormulaText text="kritischer Wert $t_{krit}$" /></dt><dd className="font-semibold">{formatDeZahl(r.tKrit, 3)}</dd>
            <dt className="text-white/80"><FormulaText text="p-Wert" /></dt><dd className="text-xl font-bold">{r.gueltig ? (r.p < 0.0001 ? '< 0,0001' : formatDeZahl(r.p, 4)) : '–'}</dd>
            <dt className="text-white/80">{modus === 'ein' ? <FormulaText text="Konfidenzintervall für $\mu$" /> : <FormulaText text="Konfidenzintervall für $\mu_1 - \mu_2$" />}</dt>
            <dd className="font-semibold">{Number.isFinite(r.kiUnten) ? formatDeZahl(r.kiUnten, 2) : '−∞'} … {Number.isFinite(r.kiOben) ? formatDeZahl(r.kiOben, 2) : '+∞'}</dd>
          </dl>
          {r.gueltig && <p className="text-sm font-bold bg-white/10 p-3 rounded-lg border border-white/20">{r.verworfen ? inhalt.werte.verworfen : inhalt.werte.beibehalten}</p>}
          <EingabeHinweise hinweise={r.hinweise} />
        </section>
      </div>

      <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[360px]">
        <h3 className="text-sm font-bold text-text-main mb-2"><MdText text={inhalt.texte.diagrammTitel} /></h3>
        <div className="flex-1 relative">
          <DiagrammAngaben zusammenfassung={inhalt.werte.zusammenfassung} einheiten={{ x: '–', y: '–' }}>
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, animation: false, parsing: false, scales: { x: { type: 'linear', title: { display: true, text: inhalt.werte.achseT } }, y: { min: 0, title: { display: true, text: inhalt.werte.achseDichte } } } }} />
          </DiagrammAngaben>
        </div>
      </section>

      {r.gueltig && (
        <FormulaDerivationBox live title={inhalt.werte.rechenwegTitel} zielGleichung={modus === 'ein' ? 't = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}' : 't = \\frac{\\bar{x}_1 - \\bar{x}_2}{SE}'} schritte={!r.gueltig ? [] : modus === 'ein' ? [
    { titel: 'Kennwerte', erklaerung: 'Mittelwert und Standardabweichung der Serie (Nenner n − 1):', formel: `n = ${formatDeTeX(k1.n, 0)},\\; \\bar{x} = ${formatDeTeX(k1.mittelwert, 3)},\\; s = ${formatDeTeX(k1.stdAbw, 4)}` },
    { titel: 'Prüfgröße', erklaerung: 'Abstand zum Sollwert in Einheiten des Standardfehlers:', formel: `t = \\frac{${formatDeTeX(k1.mittelwert, 3)} - ${formatDeTeX(mu0, 3)}}{${formatDeTeX(k1.stdAbw, 4)}/\\sqrt{${formatDeTeX(k1.n, 0)}}} = \\frac{${formatDeTeX(r.differenz, 3)}}{${se}} = ${formatDeTeX(r.t, 3)}` },
    { titel: 'Vergleich', erklaerung: `ν = n − 1; kritischer Wert und p-Wert aus der t-Verteilung (${alt}):`, formel: `\\nu = ${formatDeTeX(r.nu, 0)},\\; t_{krit} = ${formatDeTeX(r.tKrit, 3)},\\; p = ${formatDeTeX(r.p, 4)}` },
  ] : [
    { titel: 'Kennwerte', erklaerung: 'Mittelwerte und Standardabweichungen beider Serien:', formel: `\\bar{x}_1 = ${formatDeTeX(k1.mittelwert, 3)},\\; s_1 = ${formatDeTeX(k1.stdAbw, 4)},\\; n_1 = ${formatDeTeX(k1.n, 0)};\\quad \\bar{x}_2 = ${formatDeTeX(k2?.mittelwert, 3)},\\; s_2 = ${formatDeTeX(k2?.stdAbw, 4)},\\; n_2 = ${formatDeTeX(k2?.n, 0)}` },
    { titel: 'Standardfehler', erklaerung: variante === 'welch' ? 'Welch: Varianzen getrennt, ν nach Welch-Satterthwaite:' : 'Student: gepoolte Varianz, ν = n₁ + n₂ − 2:', formel: variante === 'welch' ? `SE = \\sqrt{s_1^2/n_1 + s_2^2/n_2} = ${se},\\; \\nu = ${formatDeTeX(r.nu, 2)}` : `SE = s_p\\sqrt{1/n_1 + 1/n_2} = ${se},\\; \\nu = ${formatDeTeX(r.nu, 0)}` },
    { titel: 'Prüfgröße und Entscheidung', erklaerung: `Vergleich mit dem kritischen Wert (${alt}):`, formel: `t = \\frac{${formatDeTeX(r.differenz, 3)}}{${se}} = ${formatDeTeX(r.t, 3)};\\; t_{krit} = ${formatDeTeX(r.tKrit, 3)},\\; p = ${formatDeTeX(r.p, 4)}` },
  ]} ergebnisHinweis={inhalt.werte.ergebnisHinweis} normQuelle={inhalt.werte.normQuelle} />
      )}

      <ModuleFooter
        lastReviewed={inhalt.werte.stand}
        wikipedia={[{ title: 'Welch’s t-test (englisch)', url: 'https://en.wikipedia.org/wiki/Welch%27s_t-test' }]}
        literatur={inhalt.daten.literatur}
        regelwerke={inhalt.daten.regelwerke}
        weblinks={inhalt.daten.weblinks}
        formeln={inhalt.daten.formeln}
      />
    </div>
  );
}
