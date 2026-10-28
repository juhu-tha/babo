// Reiter „Atterberg-Grenzen“ im Modul Bodenmechanik (Z24): Casagrande-Auswertung, Ausrollgrenze, Plastizitätsdiagramm
import React, { useMemo, useState } from 'react';
import { TestTube } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import inhalt from '@/content/bodenmechanik/AtterbergTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Slider } from '@/src/components/ui/Slider';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { BloomLernziele, type BloomGoalItem } from '@/src/components/ui/BloomLernziele';
import { DiagrammAngaben } from '@/src/lib/diagrammAlternative';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { atterberg, aLinie, type FliessVersuch } from '@/src/calc/boden';

const START: FliessVersuch[] = [{ schlaege: 17, w: 44.1 }, { schlaege: 22, w: 42.6 }, { schlaege: 28, w: 41.2 }, { schlaege: 34, w: 40.0 }];
const feld = 'w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-shiraz outline-none bg-white';
const leseWerte = (text: string) => text.split(/[\s;]+/).filter(Boolean).map(s => Number(s.replace(',', '.')));

export default function AtterbergTab() {
  const [versuche, setVersuche] = useState<FliessVersuch[]>(START);
  const [ausrollText, setAusrollText] = useState('21,8 22,6');
  const [w, setW] = useState(30);
  const [organisch, setOrganisch] = useState(false);

  const r = useMemo(() => atterberg({ w, versuche, ausroll: leseWerte(ausrollText), organisch }), [w, versuche, ausrollText, organisch]);
  const fl = r.fliess;

  const aendere = (i: number, feldName: keyof FliessVersuch, wert: number) => setVersuche(v => v.map((x, j) => (j === i ? { ...x, [feldName]: wert } : x)));

  const fliessDaten = useMemo(() => {
    const ns = Array.from({ length: 36 }, (_, i) => 10 + i);
    return {
      datasets: [
        { label: inhalt.werte.messpunkte, data: versuche.map(v => ({ x: v.schlaege, y: v.w })), borderColor: '#A3113E', backgroundColor: '#A3113E', pointRadius: 5, showLine: false },
        { label: inhalt.werte.ausgleich, data: Number.isFinite(fl.wL) ? ns.map(n => ({ x: n, y: fl.a + fl.b * Math.log10(n) })) : [], borderColor: '#475569', pointRadius: 0, borderWidth: 2 },
      ],
    };
  }, [versuche, fl]);

  const plastDaten = useMemo(() => ({
    datasets: [
      { label: inhalt.werte.aLinie, data: [{ x: 20, y: 0 }, { x: 100, y: aLinie(100) }], borderColor: '#1e293b', borderWidth: 2, pointRadius: 0 },
      { label: inhalt.werte.grenzen, data: [{ x: 35, y: 0 }, { x: 35, y: 60 }, { x: NaN, y: NaN }, { x: 50, y: 0 }, { x: 50, y: 60 }], borderColor: '#94a3b8', borderDash: [6, 4], borderWidth: 1, pointRadius: 0, spanGaps: false },
      { label: inhalt.werte.zwischen, data: [{ x: 0, y: 4 }, { x: 30, y: 4 }, { x: NaN, y: NaN }, { x: 0, y: 7 }, { x: 30, y: 7 }], borderColor: '#cbd5e1', borderDash: [2, 3], borderWidth: 1, pointRadius: 0, spanGaps: false },
      { label: inhalt.werte.probe, data: r.gueltig ? [{ x: r.wL, y: r.iP }] : [], borderColor: '#A3113E', backgroundColor: '#A3113E', pointRadius: 7, showLine: false },
    ],
  }), [r]);

  const lernziele = inhalt.daten.lernziele as BloomGoalItem[];

  return (
    <div className="flex flex-col gap-6">
      <BloomLernziele moduleId="bodenmechanik_atterberg" moduleTitle={inhalt.werte.lernzielTitel} timeMinutes={60} goals={lernziele} />

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-3 text-sm text-text-main/90 leading-relaxed">
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2"><TestTube className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.ueberschrift} /></h3>
        <p><MdText text={inhalt.texte.einleitung} /></p>
        <p><MdText text={inhalt.texte.casagrande} /></p>
        <p><MdText text={inhalt.texte.einpunkt} /></p>
        <p><MdText text={inhalt.texte.ausroll} /></p>
        <p><MdText text={inhalt.texte.kennzahlen} /></p>
        <p><MdText text={inhalt.texte.diagramm} /></p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.rechnerTitel} /></h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-home-grau/30 text-left">
                <th scope="col" className="py-1 pr-2">{inhalt.werte.versuch}</th>
                <th scope="col" className="py-1 pr-2">{inhalt.werte.schlaege}</th>
                <th scope="col" className="py-1 pr-2">{inhalt.werte.wassergehalt}</th>
                <th scope="col" className="py-1"><span className="sr-only">{inhalt.werte.entfernen}</span></th>
              </tr>
            </thead>
            <tbody>
              {versuche.map((v, i) => (
                <tr key={i} className="border-b border-home-grau/10">
                  <th scope="row" className="py-1 pr-2 font-normal">{formatDeZahl(i + 1, 0)}</th>
                  <td className="py-1 pr-2"><input type="number" min={1} step={1} aria-label={`${inhalt.werte.schlaege}, ${inhalt.werte.versuch} ${i + 1}`} className={feld} value={v.schlaege} onChange={e => aendere(i, 'schlaege', Number(e.target.value))} /></td>
                  <td className="py-1 pr-2"><input type="number" min={0} step={0.1} aria-label={`${inhalt.werte.wassergehalt}, ${inhalt.werte.versuch} ${i + 1}`} className={feld} value={v.w} onChange={e => aendere(i, 'w', Number(e.target.value))} /></td>
                  <td className="py-1"><button type="button" aria-label={`${inhalt.werte.entfernen} ${i + 1}`} disabled={versuche.length <= 1} onClick={() => setVersuche(x => x.filter((_, j) => j !== i))} className="px-2 py-1 text-text-main/70 hover:text-shiraz disabled:opacity-30">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" disabled={versuche.length >= 8} onClick={() => setVersuche(x => [...x, { schlaege: 25, w: 40 }])} className="self-start text-xs bg-shiraz text-white px-3 py-1.5 rounded-lg hover:bg-torch-red disabled:opacity-40">{inhalt.werte.hinzufuegen}</button>
          <div>
            <label htmlFor="atterberg-ausroll" className="text-sm font-medium text-text-main block mb-1">{inhalt.werte.ausroll}</label>
            <input id="atterberg-ausroll" type="text" inputMode="decimal" className={feld} value={ausrollText} onChange={e => setAusrollText(e.target.value)} />
          </div>
          <Slider id="atterberg-w" label={<FormulaText text={inhalt.werte.wNat} />} min={0} max={100} step={0.5} value={w} unit="%" onChange={e => setW(Number(e.target.value))} />
          <label className="flex items-center gap-2 text-sm text-text-main">
            <input type="checkbox" checked={organisch} onChange={e => setOrganisch(e.target.checked)} />
            {inhalt.werte.organisch}
          </label>
        </section>

        <section className="bg-off-white border border-home-grau/30 text-text-main p-5 rounded-2xl shadow-md flex flex-col gap-3" aria-live="polite">
          <h3 className="text-sm font-bold uppercase tracking-wider opacity-90"><MdText text={inhalt.texte.ergebnisTitel} /></h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-slate-600"><FormulaText text="Fließgrenze $w_L$" /></dt><dd className="text-xl font-bold">{formatDeZahl(r.wL, 1)} % <span className="text-xs font-normal">({fl.verfahren === 'einpunkt' ? 'Einpunkt' : 'Mehrpunkt'})</span></dd>
            {fl.verfahren === 'mehrpunkt' && <><dt className="text-slate-600"><FormulaText text="$R^2$ der Fließkurve" /></dt><dd className="font-semibold">{formatDeZahl(fl.r2, 3)}</dd></>}
            <dt className="text-slate-600"><FormulaText text="Ausrollgrenze $w_P$" /></dt><dd className="font-semibold">{formatDeZahl(r.wP, 1)} %</dd>
            <dt className="text-slate-600"><FormulaText text="Plastizitätszahl $I_P$" /></dt><dd className="font-semibold">{formatDeZahl(r.iP, 1)} %</dd>
            <dt className="text-slate-600"><FormulaText text="Konsistenzzahl $I_C$" /></dt><dd className="font-semibold">{formatDeZahl(r.iC, 2)} ({r.zustand})</dd>
            <dt className="text-slate-600"><FormulaText text="A-Linie bei $w_L$" /></dt><dd className="font-semibold">{formatDeZahl(r.gruppe?.aLinie, 1)} %</dd>
            <dt className="text-slate-600">Bodengruppe (DIN 18196)</dt><dd className="text-xl font-bold">{r.gruppe?.text ?? '–'}</dd>
          </dl>
          <EingabeHinweise hinweise={r.hinweise} />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[360px]">
          <h3 className="text-sm font-bold text-text-main mb-2"><MdText text={inhalt.texte.fliessTitel} /></h3>
          <div className="flex-1 relative">
            <DiagrammAngaben zusammenfassung={inhalt.werte.zusFliess} einheiten={{ x: '–', y: '%' }}>
              <Line data={fliessDaten} options={{ responsive: true, maintainAspectRatio: false, animation: false, scales: { x: { type: 'linear', min: 10, max: 45, title: { display: true, text: inhalt.werte.achseN } }, y: { title: { display: true, text: inhalt.werte.achseW } } } }} />
            </DiagrammAngaben>
          </div>
        </section>
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[360px]">
          <h3 className="text-sm font-bold text-text-main mb-2"><MdText text={inhalt.texte.plastTitel} /></h3>
          <div className="flex-1 relative">
            <DiagrammAngaben zusammenfassung={inhalt.werte.zusPlast} einheiten={{ x: '%', y: '%' }}>
              <Line data={plastDaten} options={{ responsive: true, maintainAspectRatio: false, animation: false, scales: { x: { type: 'linear', min: 0, max: 100, title: { display: true, text: inhalt.werte.achseWL } }, y: { min: 0, max: 60, title: { display: true, text: inhalt.werte.achseIP } } } }} />
            </DiagrammAngaben>
          </div>
        </section>
      </div>

      {r.gueltig && (
        <FormulaDerivationBox
          live
          title={inhalt.werte.rechenwegTitel}
          zielGleichung="I_P = w_L - w_P, \quad I_C = \frac{w_L - w}{I_P}"
          schritte={[
            fl.verfahren === 'einpunkt'
              ? { titel: 'Fließgrenze (Einpunktverfahren)', erklaerung: 'Ein Versuch, Neigung der Fließkurve als Erfahrungswert:', formel: `w_L = ${formatDeTeX(versuche[0].w, 1)} \\cdot (${formatDeTeX(versuche[0].schlaege, 0)}/25)^{0{,}121} = ${formatDeTeX(r.wL, 2)}\\,\\%` }
              : { titel: 'Fließgrenze (Mehrpunktverfahren)', erklaerung: 'Ausgleichsgerade durch die Messpunkte, abgelesen bei N = 25:', formel: `w = ${formatDeTeX(fl.a, 3)} ${fl.b < 0 ? '-' : '+'} ${formatDeTeX(Math.abs(fl.b), 3)} \\cdot \\lg N \\;\\Rightarrow\\; w_L = w(25) = ${formatDeTeX(r.wL, 2)}\\,\\%` },
            { titel: 'Ausrollgrenze und Plastizitätszahl', erklaerung: 'Mittelwert der Ausrollversuche:', formel: `w_P = ${formatDeTeX(r.wP, 2)}\\,\\%;\\; I_P = ${formatDeTeX(r.wL, 2)} - ${formatDeTeX(r.wP, 2)} = ${formatDeTeX(r.iP, 2)}\\,\\%` },
            { titel: 'Konsistenzzahl', erklaerung: `Zustandsform: ${r.zustand}`, formel: `I_C = \\frac{${formatDeTeX(r.wL, 2)} - ${formatDeTeX(w, 1)}}{${formatDeTeX(r.iP, 2)}} = ${formatDeTeX(r.iC, 3)}` },
            { titel: 'Plastizitätsdiagramm', erklaerung: `Lage zur A-Linie → ${r.gruppe?.text ?? '–'}`, formel: `0{,}73 \\cdot (${formatDeTeX(r.wL, 2)} - 20) = ${formatDeTeX(r.gruppe?.aLinie, 2)}\\,\\% ${r.gruppe?.oberhalbALinie ? '\\le' : '>'} I_P = ${formatDeTeX(r.iP, 2)}\\,\\%` },
          ]}
          ergebnisHinweis={inhalt.werte.ergebnisHinweis}
          normQuelle={inhalt.werte.normQuelle}
        />
      )}
    </div>
  );
}
