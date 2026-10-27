import React, { useMemo, useState } from 'react';
import { Thermometer } from 'lucide-react';
import { Slider } from '@/src/components/ui/Slider';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { BloomLernziele, type BloomGoalItem } from '@/src/components/ui/BloomLernziele';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { DiagrammHuelle } from '@/src/lib/diagrammAlternative';
import { MdText } from '@/src/components/inhalt/MdText';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import {
  feCZustand, gefuegeAnteile, cevBewertung, FE_C_PUNKTE, FE_C_LINIEN, FE_C_KENNWERTE, CEV_GRENZEN,
  type FeCDatensatz, type Legierung,
} from '@/src/calc/eisenKohlenstoff';
import inhalt from '@/content/stahl/EisenKohlenstoff.json';

/** Formeln und Quellen des Reiters für den Modulfuß */
export const EISEN_KOHLENSTOFF_FUSS = { formeln: inhalt.daten.formeln, literatur: inhalt.daten.literatur, weblinks: inhalt.daten.weblinks };

const karte = 'bg-off-white p-5 rounded-xl border border-home-grau/30';
type Ausschnitt = 'gesamt' | 'stahl';
const AUSSCHNITTE: Record<Ausschnitt, { c0: number; c1: number; t0: number; t1: number }> = {
  gesamt: { c0: 0, c1: 6.67, t0: 0, t1: 1600 },
  stahl: { c0: 0, c1: 2.2, t0: 0, t1: 1200 },
};

/** Beschriftungen der Phasenfelder (Lage in % C / °C) */
const FELDER: { text: string; c: number; t: number; nur?: Ausschnitt }[] = [
  { text: 'Schmelze', c: 3.2, t: 1450 },
  { text: 'S + γ', c: 1.6, t: 1330 },
  { text: 'S + Fe₃C', c: 5.6, t: 1210, nur: 'gesamt' },
  { text: 'γ (Austenit)', c: 0.9, t: 1020 },
  { text: 'α + γ', c: 0.22, t: 770, nur: 'stahl' },
  { text: 'γ + Fe₃C', c: 1.7, t: 900 },
  { text: 'Ledeburit I + Fe₃C', c: 4.4, t: 950, nur: 'gesamt' },
  { text: 'α + Fe₃C (Ferrit + Perlit)', c: 0.4, t: 350, nur: 'stahl' },
  { text: 'Perlit + Fe₃C II', c: 1.5, t: 350, nur: 'stahl' },
  { text: 'α + Fe₃C', c: 2.2, t: 420, nur: 'gesamt' },
  { text: 'Ledeburit II', c: 4.6, t: 420, nur: 'gesamt' },
];

function FeCDiagramm({ c, t, ausschnitt, konode, beschreibung }: { c: number; t: number; ausschnitt: Ausschnitt; konode?: { cLinks: number; cRechts: number }; beschreibung: string }) {
  const W = 520, H = 360, ml = 52, mr = 14, mt = 14, mb = 40;
  const a = AUSSCHNITTE[ausschnitt];
  const X = (x: number) => ml + ((x - a.c0) / (a.c1 - a.c0)) * (W - ml - mr);
  const Y = (y: number) => mt + ((a.t1 - y) / (a.t1 - a.t0)) * (H - mt - mb);
  const xTicks = ausschnitt === 'gesamt' ? [0, 1, 2, 3, 4, 5, 6, 6.67] : [0, 0.4, 0.8, 1.2, 1.6, 2.0];
  const yTicks = ausschnitt === 'gesamt' ? [0, 200, 400, 600, 800, 1000, 1200, 1400, 1600] : [0, 200, 400, 600, 800, 1000, 1200];
  const clipId = `fec-clip-${ausschnitt}`;
  const markiert = ['P', 'S', 'E', 'C', 'G', 'K', 'F'] as const;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto text-text-main" role="img" aria-label={beschreibung}>
      <defs><clipPath id={clipId}><rect x={ml} y={mt} width={W - ml - mr} height={H - mt - mb} /></clipPath></defs>
      <rect x={ml} y={mt} width={W - ml - mr} height={H - mt - mb} fill="none" stroke="currentColor" opacity={0.5} />
      {xTicks.map(v => (
        <g key={`x${v}`}>
          <line x1={X(v)} y1={H - mb} x2={X(v)} y2={H - mb + 4} stroke="currentColor" />
          <text x={X(v)} y={H - mb + 16} fontSize={10} textAnchor="middle" fill="currentColor">{formatDeZahl(v, v === 6.67 ? 2 : ausschnitt === 'gesamt' ? 0 : 1)}</text>
        </g>
      ))}
      {yTicks.map(v => (
        <g key={`y${v}`}>
          <line x1={ml - 4} y1={Y(v)} x2={ml} y2={Y(v)} stroke="currentColor" />
          <text x={ml - 6} y={Y(v) + 3} fontSize={10} textAnchor="end" fill="currentColor">{formatDeZahl(v, 0)}</text>
        </g>
      ))}
      <text x={(ml + W - mr) / 2} y={H - 6} fontSize={11} textAnchor="middle" fill="currentColor">{inhalt.werte.achseC}</text>
      <text x={14} y={(mt + H - mb) / 2} fontSize={11} textAnchor="middle" fill="currentColor" transform={`rotate(-90 14 ${(mt + H - mb) / 2})`}>{inhalt.werte.achseT}</text>
      <g clipPath={`url(#${clipId})`}>
        {/* Stahl/Gusseisen-Grenze */}
        <line x1={X(FE_C_PUNKTE.E.c)} y1={Y(a.t0)} x2={X(FE_C_PUNKTE.E.c)} y2={Y(FE_C_PUNKTE.E.t)} stroke="currentColor" strokeDasharray="2 4" opacity={0.5} />
        {FE_C_LINIEN.map(l => (
          <polyline key={l.id} points={l.punkte.map(p => `${X(FE_C_PUNKTE[p].c)},${Y(FE_C_PUNKTE[p].t)}`).join(' ')} fill="none"
            stroke={l.id === 'psk' || l.id === 'ecf' ? '#A3113E' : '#334155'} strokeWidth={l.id === 'psk' || l.id === 'ecf' || l.id === 'gos' ? 2.2 : 1.6} />
        ))}
        {FELDER.filter(f => !f.nur || f.nur === ausschnitt).map(f => (
          <text key={f.text} x={X(f.c)} y={Y(f.t)} fontSize={11} textAnchor="middle" fill="currentColor" opacity={0.85}>{f.text}</text>
        ))}
        {markiert.map(p => (
          <g key={p}>
            <circle cx={X(FE_C_PUNKTE[p].c)} cy={Y(FE_C_PUNKTE[p].t)} r={2.5} fill="#A3113E" />
            <text x={X(FE_C_PUNKTE[p].c) + 4} y={Y(FE_C_PUNKTE[p].t) - 4} fontSize={10} fontWeight={700} fill="#A3113E">{p}</text>
          </g>
        ))}
        {konode && <line x1={X(konode.cLinks)} y1={Y(t)} x2={X(konode.cRechts)} y2={Y(t)} stroke="#2563eb" strokeWidth={2} strokeDasharray="6 3" />}
        <circle cx={X(c)} cy={Y(t)} r={6} fill="#2563eb" stroke="white" strokeWidth={2} />
      </g>
    </svg>
  );
}

const PROZENT = (x: number) => `${formatDeZahl(x * 100, 1)} %`;

export default function EisenKohlenstoff() {
  const [c, setC] = useState(0.17);
  const [t, setT] = useState(20);
  const [ausschnitt, setAusschnitt] = useState<Ausschnitt>('stahl');
  const [datensatz, setDatensatz] = useState<FeCDatensatz>('lehrbuch');
  const [leg, setLeg] = useState<Required<Legierung>>({ C: 0.18, Mn: 1.4, Cr: 0.05, Mo: 0.02, V: 0, Ni: 0.1, Cu: 0.2 });

  const zustand = useMemo(() => feCZustand(c, t), [c, t]);
  const anteile = useMemo(() => gefuegeAnteile(c, datensatz), [c, datensatz]);
  const cevErg = useMemo(() => cevBewertung(leg), [leg]);
  const k = FE_C_KENNWERTE[datensatz];
  const ok = !zustand.hinweise.some(h => h.stufe === 'fehler');
  const anteilOk = !anteile.hinweise.some(h => h.stufe === 'fehler');
  const cevOk = !cevErg.hinweise.some(h => h.stufe === 'fehler');

  const beschreibung = `${inhalt.werte.diagrammTitel}: Linien ${FE_C_LINIEN.map(l => l.name).join(', ')}; eutektoider Punkt S bei ${formatDeZahl(FE_C_PUNKTE.S.c, 1)} % C und ${formatDeZahl(FE_C_PUNKTE.S.t, 0)} °C, eutektischer Punkt C bei ${formatDeZahl(FE_C_PUNKTE.C.c, 1)} % C und ${formatDeZahl(FE_C_PUNKTE.C.t, 0)} °C. `
    + `${inhalt.werte.beschreibungZusatz}: ${formatDeZahl(c, 2)} % C bei ${formatDeZahl(t, 0)} °C im Feld ${zustand.feld} (${zustand.gefuege}).`;
  const daten = { datasets: FE_C_LINIEN.map(l => ({ label: l.name, data: l.punkte.map(p => ({ x: FE_C_PUNKTE[p].c, y: FE_C_PUNKTE[p].t })) })) };
  const optionen = { scales: { x: { title: { text: inhalt.werte.achseC } }, y: { title: { text: inhalt.werte.achseT } } }, plugins: { title: { text: inhalt.werte.diagrammTitel } } };

  const zeilen = ([
    ['ferrit', anteile.ferrit], ['perlit', anteile.perlit], ['sekundaer', anteile.sekundaerzementit], ['ledeburit', anteile.ledeburit], ['primaer', anteile.primaerzementit],
  ] as const).filter(([, v]) => v > 0);
  const NAMEN: Record<string, string> = { ferrit: inhalt.texte.ferrit, perlit: inhalt.texte.perlit, sekundaer: inhalt.texte.sekundaer, ledeburit: inhalt.texte.ledeburit, primaer: inhalt.texte.primaer };
  const FARBEN: Record<string, string> = { ferrit: '#cbd5e1', perlit: '#64748b', sekundaer: '#A3113E', ledeburit: '#92400e', primaer: '#450a0a' };
  const schnell: [string, number][] = [[inhalt.werte.s235, CEV_GRENZEN.S235JR.cMax], [inhalt.werte.s355, CEV_GRENZEN.S355J2.cMax], [inhalt.werte.c45, 0.45], [inhalt.werte.eutektoid, 0.8], [inhalt.werte.eutektisch, 4.3]];
  const setzeLeg = (el: keyof Legierung) => (e: React.ChangeEvent<HTMLInputElement>) => setLeg(l => ({ ...l, [el]: e.target.value === '' ? NaN : Number(e.target.value) }));
  const hebelFormel = c <= k.cS
    ? `m_{\\mathrm{Perlit}} = \\frac{${formatDeTeX(c, 2)} - ${formatDeTeX(k.cP, 3)}}{${formatDeTeX(k.cS, 2)} - ${formatDeTeX(k.cP, 3)}} = ${formatDeTeX(anteile.perlit * 100, 1)}\\,\\%`
    : c <= k.cE
      ? `m_{\\mathrm{Fe_3C\\,II}} = \\frac{${formatDeTeX(c, 2)} - ${formatDeTeX(k.cS, 2)}}{${formatDeTeX(k.cZ, 2)} - ${formatDeTeX(k.cS, 2)}} = ${formatDeTeX(anteile.sekundaerzementit * 100, 1)}\\,\\%`
      : `m_{\\mathrm{Ledeburit}} = ${formatDeTeX(anteile.ledeburit * 100, 1)}\\,\\%`;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <BloomLernziele moduleId="stahl_eisen_kohlenstoff" moduleTitle={inhalt.werte.lernzielTitel} timeMinutes={60} goals={inhalt.daten.lernziele as BloomGoalItem[]} />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2 border-b border-home-grau/30 pb-2"><Thermometer className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.titel} /></h3>
        <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.einleitung} /></p>
        <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.linien} /></p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${karte} flex flex-col gap-4`}>
            <h4 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.eingaben} /></h4>
            <Slider id="fec-c" label="Kohlenstoffgehalt C" info={inhalt.werte.infoC} min={0} max={6.67} step={0.01} value={c} unit="%" onChange={e => setC(Number(e.target.value))} />
            <Slider id="fec-t" label="Temperatur T" info={inhalt.werte.infoT} min={20} max={1600} step={5} value={t} unit="°C" onChange={e => setT(Number(e.target.value))} />
            <div>
              <p className="text-sm font-medium text-text-main mb-1"><MdText text={inhalt.texte.schnellwahl} /></p>
              <div className="flex flex-wrap gap-2">
                {schnell.map(([n, w]) => (
                  <button key={n} type="button" aria-pressed={c === w} onClick={() => { setC(w); if (w > 2.2) setAusschnitt('gesamt'); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${c === w ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/40'}`}>{n}</button>
                ))}
              </div>
            </div>
            <label className="text-sm font-medium text-text-main flex flex-col gap-1"><MdText text={inhalt.texte.ausschnitt} />
              <select value={ausschnitt} onChange={e => setAusschnitt(e.target.value as Ausschnitt)} className="p-2 border border-home-grau/30 rounded-lg bg-white">
                <option value="stahl">{inhalt.texte.ausschnittStahl}</option>
                <option value="gesamt">{inhalt.texte.ausschnittGesamt}</option>
              </select>
            </label>
            <label className="text-sm font-medium text-text-main flex flex-col gap-1"><MdText text={inhalt.texte.datensatz} />
              <select value={datensatz} onChange={e => setDatensatz(e.target.value as FeCDatensatz)} className="p-2 border border-home-grau/30 rounded-lg bg-white">
                <option value="lehrbuch">{inhalt.texte.lehrbuch}</option>
                <option value="international">{inhalt.texte.international}</option>
              </select>
            </label>
          </div>
          <div className={`${karte} lg:col-span-2`}>
            {ok && (
              <DiagrammHuelle art="line" daten={daten} optionen={optionen} ariaLabel={beschreibung} modus="verhaeltnis">
                {(b) => <FeCDiagramm c={c} t={t} ausschnitt={ausschnitt} konode={zustand.konode} beschreibung={b} />}
              </DiagrammHuelle>
            )}
          </div>
        </div>

        <EingabeHinweise hinweise={[...zustand.hinweise, ...anteile.hinweise]} />
        {ok && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/20 text-sm">
              <h4 className="text-sm font-bold text-shiraz uppercase tracking-wider mb-3"><MdText text={inhalt.texte.zustand} /></h4>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt className="text-text-main/75"><MdText text={inhalt.texte.phase} /></dt><dd className="font-bold">{zustand.feld} ({zustand.werkstoff})</dd>
                <dt className="text-text-main/75"><MdText text={inhalt.texte.phasen} /></dt><dd className="font-bold">{zustand.phasen.join(' + ')}</dd>
                <dt className="text-text-main/75"><MdText text={inhalt.texte.gefuegeName} /></dt><dd className="font-bold">{zustand.gefuege}</dd>
              </dl>
              {zustand.konode && zustand.phasen.length === 2 && (
                <p className="mt-3"><strong><MdText text={inhalt.texte.konode} />:</strong> {zustand.phasen[0]} mit {formatDeZahl(zustand.konode.cLinks, 3)} % C: {PROZENT(zustand.konode.anteilLinks)}; {zustand.phasen[1]} mit {formatDeZahl(zustand.konode.cRechts, 2)} % C: {PROZENT(zustand.konode.anteilRechts)}</p>
              )}
            </div>
            {anteilOk && (
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 text-sm">
                <h4 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3"><MdText text={inhalt.texte.gefuege} /> ({formatDeZahl(c, 2)} % C)</h4>
                <div className="flex h-6 w-full rounded overflow-hidden border border-home-grau/40 mb-3" aria-hidden="true">
                  {zeilen.map(([id, v]) => <div key={id} style={{ width: `${v * 100}%`, background: FARBEN[id] }} />)}
                </div>
                <table className="w-full border-collapse">
                  <thead><tr><th scope="col" className="text-left border-b border-home-grau/40 py-1"><MdText text={inhalt.texte.spalteGefuege} /></th><th scope="col" className="text-right border-b border-home-grau/40 py-1"><MdText text={inhalt.texte.spalteAnteil} /></th></tr></thead>
                  <tbody>
                    {zeilen.map(([id, v]) => (
                      <tr key={id}><th scope="row" className="text-left font-normal py-1"><span className="inline-block w-3 h-3 rounded-sm mr-2 align-middle" style={{ background: FARBEN[id] }} aria-hidden="true" /><MdText text={NAMEN[id]} /></th><td className="text-right tabular-nums py-1">{formatDeZahl(v * 100, 1)}</td></tr>
                    ))}
                    <tr><th scope="row" className="text-left font-normal py-1 border-t border-home-grau/40">Phase Zementit gesamt (Fe₃C)</th><td className="text-right tabular-nums py-1 border-t border-home-grau/40">{formatDeZahl(anteile.zementitGesamt * 100, 1)}</td></tr>
                  </tbody>
                </table>
                <p className="text-xs text-text-main/70 mt-2">{k.quelle}</p>
              </div>
            )}
          </div>
        )}
        <p className="text-sm text-text-main/85 leading-relaxed bg-off-white p-4 rounded-xl border border-home-grau/30"><MdText text={inhalt.texte.hebel} /></p>
        <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.quellenwerte} /></p>
        <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.baustahl} /></p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.cevTitel} /></h3>
        <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.schweissen} /></p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(['C', 'Mn', 'Cr', 'Mo', 'V', 'Ni', 'Cu'] as const).map(el => (
            <label key={el} className="text-sm font-medium text-text-main flex flex-col gap-1">{el} [%]
              <input type="number" min={0} max={el === 'Mn' ? 2 : 1} step={0.01} value={Number.isFinite(leg[el]) ? leg[el] : ''} onChange={setzeLeg(el)} className="p-2 border border-home-grau/30 rounded-lg bg-white tabular-nums" />
            </label>
          ))}
        </div>
        <EingabeHinweise hinweise={cevErg.hinweise} />
        {cevOk && (
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-shiraz/5 p-4 rounded-xl border border-shiraz/20">
            <div><dt className="text-text-main/75"><MdText text={inhalt.texte.cevErgebnis} /></dt><dd className="text-lg font-bold tabular-nums">{formatDeZahl(cevErg.cev, 3)} %</dd></div>
            <div><dt className="text-text-main/75"><MdText text={inhalt.texte.eignung} /></dt><dd className="font-bold">{cevErg.stufe} – {cevErg.vorwaermen}</dd></div>
            <div><dt className="text-text-main/75"><MdText text={inhalt.texte.grenzwert} /></dt><dd className="font-bold">S235JR ≤ {formatDeZahl(CEV_GRENZEN.S235JR.cevBis30, 2)}: {cevErg.cev <= CEV_GRENZEN.S235JR.cevBis30 ? 'eingehalten' : 'überschritten'}; S355J2 ≤ {formatDeZahl(CEV_GRENZEN.S355J2.cevBis30, 2)}: {cevErg.cev <= CEV_GRENZEN.S355J2.cevBis30 ? 'eingehalten' : 'überschritten'}</dd></div>
          </dl>
        )}
      </div>

      {ok && anteilOk && (
        <FormulaDerivationBox
          live
          title={inhalt.werte.rechenwegTitel}
          zielGleichung="m_{\alpha} = \frac{c_{\beta} - c_0}{c_{\beta} - c_{\alpha}}"
          schritte={[
            { titel: inhalt.werte.schrittPhasen, erklaerung: inhalt.werte.schrittPhasenText, formel: `c_P = ${formatDeTeX(k.cP, 3)}\\,\\%,\\quad c_S = ${formatDeTeX(k.cS, 2)}\\,\\%,\\quad c_Z = ${formatDeTeX(k.cZ, 2)}\\,\\%,\\quad c_0 = ${formatDeTeX(c, 2)}\\,\\%` },
            { titel: inhalt.werte.schrittHebel, erklaerung: inhalt.werte.schrittHebelText, formel: hebelFormel },
            ...(cevOk ? [{ titel: inhalt.werte.schrittCev, erklaerung: inhalt.werte.schrittCevText, formel: `CEV = ${formatDeTeX(leg.C, 2)} + \\frac{${formatDeTeX(leg.Mn, 2)}}{6} + \\frac{${formatDeTeX(leg.Cr + leg.Mo + leg.V, 2)}}{5} + \\frac{${formatDeTeX(leg.Ni + leg.Cu, 2)}}{15} = ${formatDeTeX(cevErg.cev, 3)}\\,\\%` }] : []),
          ]}
          ergebnisHinweis={inhalt.werte.rechenwegHinweis}
          normQuelle={inhalt.werte.rechenwegQuelle}
        />
      )}
    </div>
  );
}
