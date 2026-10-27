// Reiter „Trittschall“ im Modul Schallschutz (Z24): L'_n,w nach DIN 4109-2 mit Rechenkern src/calc/schall.ts
import React, { useMemo, useState } from 'react';
import { Footprints } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import inhalt from '@/content/schallschutz/TrittschallTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Slider } from '@/src/components/ui/Slider';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { BloomLernziele, type BloomGoalItem } from '@/src/components/ui/BloomLernziele';
import { DiagrammAngaben } from '@/src/lib/diagrammAlternative';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { trittschall, deltaLFrequenz, ANFORDERUNGEN_TRITTSCHALL } from '@/src/calc/schall';

/** Terzmittenfrequenzen 50 … 3150 Hz */
const TERZEN = [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150];

export default function TrittschallTab() {
  const [dDecke, setDDecke] = useState(0.18);
  const [rhoDecke, setRhoDecke] = useState(2400);
  const [mZusatz, setMZusatz] = useState(10);
  const [dEstrich, setDEstrich] = useState(0.05);
  const [rhoEstrich, setRhoEstrich] = useState(2000);
  const [sStrich, setSStrich] = useState(20);
  const [mFlanke, setMFlanke] = useState(250);
  const [anfId, setAnfId] = useState<string>(ANFORDERUNGEN_TRITTSCHALL[0].id);
  const anf = ANFORDERUNGEN_TRITTSCHALL.find(a => a.id === anfId) ?? ANFORDERUNGEN_TRITTSCHALL[0];

  const r = useMemo(() => trittschall({ dDecke, rhoDecke, mZusatz, dEstrich, rhoEstrich, sStrich, mFlanke, zulLnw: anf.wert }),
    [dDecke, rhoDecke, mZusatz, dEstrich, rhoEstrich, sStrich, mFlanke, anf.wert]);

  const chartData = useMemo(() => ({
    labels: TERZEN.map(f => formatDeZahl(f, 0)),
    datasets: [{ label: inhalt.werte.kurve, data: TERZEN.map(f => (r.gueltig ? deltaLFrequenz(f, r.f0) : NaN)), borderColor: '#A3113E', backgroundColor: 'rgba(163, 17, 62, 0.15)', fill: true, pointRadius: 3 }],
  }), [r]);

  const lernziele = inhalt.daten.lernziele as BloomGoalItem[];

  return (
    <div className="flex flex-col gap-6">
      <BloomLernziele moduleId="schallschutz_trittschall" moduleTitle={inhalt.werte.lernzielTitel} timeMinutes={45} goals={lernziele} />

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-3 text-sm text-text-main/90 leading-relaxed">
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2"><Footprints className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.ueberschrift} /></h3>
        <p><MdText text={inhalt.texte.einleitung} /></p>
        <p><MdText text={inhalt.texte.verfahren} /></p>
        <p><MdText text={inhalt.texte.masseFeder} /></p>
        <p><MdText text={inhalt.texte.anforderung} /></p>
        <p className="bg-amber-50 p-3 rounded-xl border border-amber-300 text-amber-950"><MdText text={inhalt.texte.vorlaeufig} /></p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.rechnerTitel} /></h3>
          <Slider id="tritt-ddecke" label={<FormulaText text={inhalt.werte.dDecke} />} min={0.1} max={0.35} step={0.01} value={dDecke} unit="m" onChange={e => setDDecke(Number(e.target.value))} />
          <Slider id="tritt-rhodecke" label={<FormulaText text={inhalt.werte.rhoDecke} />} min={1200} max={2600} step={50} value={rhoDecke} unit="kg/m³" onChange={e => setRhoDecke(Number(e.target.value))} />
          <Slider id="tritt-mzusatz" label={<FormulaText text={inhalt.werte.mZusatz} />} min={0} max={100} step={5} value={mZusatz} unit="kg/m²" onChange={e => setMZusatz(Number(e.target.value))} />
          <Slider id="tritt-destrich" label={<FormulaText text={inhalt.werte.dEstrich} />} min={0.03} max={0.08} step={0.005} value={dEstrich} unit="m" onChange={e => setDEstrich(Number(e.target.value))} />
          <Slider id="tritt-rhoestrich" label={<FormulaText text={inhalt.werte.rhoEstrich} />} min={1800} max={2300} step={50} value={rhoEstrich} unit="kg/m³" onChange={e => setRhoEstrich(Number(e.target.value))} />
          <Slider id="tritt-s" label={<FormulaText text={inhalt.werte.sStrich} />} min={5} max={60} step={1} value={sStrich} unit="MN/m³" onChange={e => setSStrich(Number(e.target.value))} />
          <Slider id="tritt-mflanke" label={<FormulaText text={inhalt.werte.mFlanke} />} min={100} max={600} step={10} value={mFlanke} unit="kg/m²" onChange={e => setMFlanke(Number(e.target.value))} />
          <div>
            <label htmlFor="tritt-anf" className="text-sm font-medium text-text-main block mb-1">{inhalt.werte.anforderung}</label>
            <select id="tritt-anf" value={anfId} onChange={e => setAnfId(e.target.value)} className="w-full p-2 text-sm border border-home-grau/30 rounded-lg focus:ring-2 focus:ring-shiraz outline-none bg-white">
              {ANFORDERUNGEN_TRITTSCHALL.map(a => <option key={a.id} value={a.id}>{a.label}: {formatDeZahl(a.wert, 0)} dB</option>)}
            </select>
            <p className="text-xs text-text-main/70 mt-1">{inhalt.werte.quelle}: {anf.quelle}</p>
          </div>
        </section>

        <section className="bg-orange-800 text-white p-5 rounded-2xl shadow-md flex flex-col gap-3" aria-live="polite">
          <h3 className="text-sm font-bold uppercase tracking-wider opacity-90"><MdText text={inhalt.texte.ergebnisTitel} /></h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-white/80"><FormulaText text="$m'_s$ Rohdecke" /></dt><dd className="font-semibold">{formatDeZahl(r.mDecke, 0)} kg/m²</dd>
            <dt className="text-white/80"><FormulaText text="$L_{n,eq,0,w}$" /></dt><dd className="font-semibold">{formatDeZahl(r.lnEq0w, 1)} dB</dd>
            <dt className="text-white/80"><FormulaText text="$m'$ Estrich, $f_0$" /></dt><dd className="font-semibold">{formatDeZahl(r.mEstrich, 0)} kg/m², {formatDeZahl(r.f0, 0)} Hz</dd>
            <dt className="text-white/80"><FormulaText text="$\Delta L_w$ (vorläufig)" /></dt><dd className="font-semibold">{formatDeZahl(r.deltaLw, 1)} dB</dd>
            <dt className="text-white/80"><FormulaText text="$K$ (vorläufig)" /></dt><dd className="font-semibold">{formatDeZahl(r.k, 1)} dB</dd>
            <dt className="text-white/80"><FormulaText text="$L'_{n,w}$" /></dt><dd className="text-2xl font-bold">{formatDeZahl(r.lnwStrich, 1)} dB</dd>
            <dt className="text-white/80"><FormulaText text="$L'_{n,w} + u_{prog}$" /></dt><dd className="font-semibold">{formatDeZahl(r.nachweis, 1)} dB ≤ {formatDeZahl(anf.wert, 0)} dB?</dd>
          </dl>
          {r.gueltig && (
            <p className={`text-sm font-bold p-3 rounded-lg border ${r.erfuellt ? 'bg-white/10 border-white/30' : 'bg-red-950/40 border-red-200/60'}`}>
              {r.erfuellt ? inhalt.werte.erfuellt : inhalt.werte.nichtErfuellt} – {inhalt.werte.reserve} {formatDeZahl(r.reserve, 1)} dB
            </p>
          )}
          <EingabeHinweise hinweise={r.hinweise} />
        </section>
      </div>

      <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[340px]">
        <h3 className="text-sm font-bold text-text-main mb-2"><MdText text={inhalt.texte.diagrammTitel} /></h3>
        <div className="flex-1 relative">
          <DiagrammAngaben zusammenfassung={inhalt.werte.zusammenfassung} einheiten={{ x: 'Hz', y: 'dB' }}>
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, animation: false, scales: { x: { title: { display: true, text: inhalt.werte.achseF } }, y: { min: 0, title: { display: true, text: inhalt.werte.achseDL } } } }} />
          </DiagrammAngaben>
        </div>
      </section>

      {r.gueltig && (
        <FormulaDerivationBox
          live
          title={inhalt.werte.rechenwegTitel}
          zielGleichung="L'_{n,w} = L_{n,eq,0,w} - \Delta L_w + K"
          schritte={[
            { titel: 'Rohdecke', erklaerung: 'Flächenbezogene Masse mit Putz/Verbundestrich, dann L_n,eq,0,w (DIN 4109-32):', formel: `m'_s = ${formatDeTeX(dDecke, 2)} \\cdot ${formatDeTeX(rhoDecke, 0)} + ${formatDeTeX(mZusatz, 0)} = ${formatDeTeX(r.mDecke, 0)}\\,\\text{kg/m}^2;\\; L_{n,eq,0,w} = 164 - 35 \\cdot \\lg ${formatDeTeX(r.mDecke, 0)} = ${formatDeTeX(r.lnEq0w, 1)}\\,\\text{dB}` },
            { titel: 'Schwimmender Estrich', erklaerung: 'Resonanzfrequenz und Trittschallminderung (Näherung, vorläufig):', formel: `f_0 = 160\\sqrt{${formatDeTeX(sStrich, 0)}/${formatDeTeX(r.mEstrich, 0)}} = ${formatDeTeX(r.f0, 0)}\\,\\text{Hz};\\; \\Delta L_w = 13\\lg ${formatDeTeX(r.mEstrich, 0)} - 14{,}2\\lg ${formatDeTeX(sStrich, 0)} + 20{,}8 = ${formatDeTeX(r.deltaLw, 1)}\\,\\text{dB}` },
            { titel: 'Flankenübertragung', erklaerung: 'Korrekturwert aus dem Massenverhältnis Decke/Flanken (vorläufig):', formel: `K = 0{,}6 + 5{,}5 \\cdot \\lg\\frac{${formatDeTeX(r.mDecke, 0)}}{${formatDeTeX(mFlanke, 0)}} = ${formatDeTeX(r.k, 1)}\\,\\text{dB}` },
            { titel: 'Nachweis', erklaerung: 'Pegel im Bau und Sicherheitsbeiwert u_prog = 3 dB:', formel: `L'_{n,w} = ${formatDeTeX(r.lnEq0w, 1)} - ${formatDeTeX(r.deltaLw, 1)} + ${formatDeTeX(r.k, 1)} = ${formatDeTeX(r.lnwStrich, 1)};\\; ${formatDeTeX(r.lnwStrich, 1)} + 3 = ${formatDeTeX(r.nachweis, 1)} ${r.erfuellt ? '\\le' : '>'} ${formatDeTeX(anf.wert, 0)}\\,\\text{dB}` },
          ]}
          ergebnisHinweis={inhalt.werte.ergebnisHinweis}
          normQuelle={inhalt.werte.normQuelle}
        />
      )}
    </div>
  );
}
