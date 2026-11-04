import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import { Waves } from 'lucide-react';
import { Slider } from '@/src/components/ui/Slider';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { BloomLernziele, type BloomGoalItem } from '@/src/components/ui/BloomLernziele';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { DiagrammAngaben } from '@/src/lib/diagrammAlternative';
import { MdText } from '@/src/components/inhalt/MdText';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { biegelinie, werkstoffVergleich, traegheitRechteck, BIEGE_WERKSTOFFE, BIEGE_PROFILE, type Lagerung, type BiegeWerkstoffId } from '@/src/calc/biegelinie';
import inhalt from '@/content/formaenderungen/Biegelinie.json';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

/** Formeln und Quellen des Reiters für den Modulfuß */
export const BIEGELINIE_FUSS = { formeln: inhalt.daten.formeln, literatur: inhalt.daten.literatur };

const karte = 'bg-off-white p-5 rounded-xl border border-home-grau/30';
const auswahl = 'w-full p-2 border border-home-grau/30 rounded-lg bg-white text-sm';

export default function Biegelinie() {
  const [lagerung, setLagerung] = useState<Lagerung>('einfeldtraeger');
  const [L, setL] = useState(5);
  const [q, setQ] = useState(5);
  const [F, setF] = useState(0);
  const [aRel, setARel] = useState(50); // Lage der Einzellast in % von L
  const [werkstoff, setWerkstoff] = useState<BiegeWerkstoffId>('bshGL24h');
  const [art, setArt] = useState<'rechteck' | 'profil'>('rechteck');
  const [b, setB] = useState(120);
  const [h, setH] = useState(300);
  const [profil, setProfil] = useState('IPE 200');

  const I = art === 'rechteck' ? traegheitRechteck(b, h) : (BIEGE_PROFILE.find(p => p.name === profil)?.Iy ?? NaN);
  const E = BIEGE_WERKSTOFFE[werkstoff].E;
  const a = (L * aRel) / 100;
  const eingabe = useMemo(() => ({ lagerung, L, F, a, q, I }), [lagerung, L, F, a, q, I]);
  const r = useMemo(() => biegelinie({ ...eingabe, E }), [eingabe, E]);
  const vergleich = useMemo(() => werkstoffVergleich(eingabe), [eingabe]);
  const ok = !r.hinweise.some(x => x.stufe === 'fehler');

  const datenW = { datasets: [{ label: inhalt.werte.diagrammW, data: r.verlauf.map(p => ({ x: p.x, y: p.w })), borderColor: '#A3113E', backgroundColor: 'rgba(163,17,62,0.08)', fill: true, pointRadius: 0, borderWidth: 2.5 }] };
  const optW = {
    responsive: true, maintainAspectRatio: false, animation: false as const,
    scales: { x: { type: 'linear' as const, min: 0, max: L, title: { display: true, text: inhalt.werte.achseX } }, y: { reverse: true, title: { display: true, text: inhalt.werte.achseW } } },
    plugins: { legend: { display: false }, title: { display: false, text: inhalt.werte.diagrammW } },
  };
  const datenPhi = { datasets: [{ label: inhalt.werte.diagrammPhi, data: r.verlauf.map(p => ({ x: p.x, y: p.phi })), borderColor: '#2563eb', pointRadius: 0, borderWidth: 2 }] };
  const optPhi = {
    responsive: true, maintainAspectRatio: false, animation: false as const,
    scales: { x: { type: 'linear' as const, min: 0, max: L, title: { display: true, text: inhalt.werte.achseX } }, y: { title: { display: true, text: inhalt.werte.achsePhi } } },
    plugins: { legend: { display: false }, title: { display: false, text: inhalt.werte.diagrammPhi } },
  };
  const kenn = lagerung === 'einfeldtraeger' ? inhalt.werte.kennEinfeld : inhalt.werte.kennKrag;
  const grundformel = lagerung === 'einfeldtraeger'
    ? `w = \\frac{5 q L^4}{384 E I} + w_F = \\frac{5 \\cdot ${formatDeTeX(q, 1)} \\cdot ${formatDeTeX(L, 2)}^4}{384 \\cdot ${formatDeTeX(r.EI, 0)}} + w_F`
    : `w = \\frac{q L^4}{8 E I} + w_F = \\frac{${formatDeTeX(q, 1)} \\cdot ${formatDeTeX(L, 2)}^4}{8 \\cdot ${formatDeTeX(r.EI, 0)}} + w_F`;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <BloomLernziele moduleId="formaenderungen_biegelinie" moduleTitle={inhalt.werte.lernzielTitel} timeMinutes={45} goals={inhalt.daten.lernziele as BloomGoalItem[]} />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2 border-b border-home-grau/30 pb-2"><Waves className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.titel} /></h3>
        <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.einleitung} /></p>
        <p className="text-sm text-text-main/85 leading-relaxed bg-off-white p-4 rounded-xl border border-home-grau/30"><MdText text={inhalt.texte.steifigkeit} /></p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${karte} flex flex-col gap-4`}>
            <h4 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.eingaben} /></h4>
            <label className="text-sm font-medium text-text-main flex flex-col gap-1"><MdText text={inhalt.texte.lagerung} />
              <select value={lagerung} onChange={e => setLagerung(e.target.value as Lagerung)} className={auswahl}>
                <option value="einfeldtraeger">{inhalt.texte.einfeld}</option>
                <option value="kragarm">{inhalt.texte.krag}</option>
              </select>
            </label>
            <Slider id="bl-L" label="Länge L" info={inhalt.werte.infoL} min={1} max={12} step={0.25} value={L} unit="m" onChange={e => setL(Number(e.target.value))} />
            <Slider id="bl-q" label="Streckenlast q" info={inhalt.werte.infoQ} min={0} max={30} step={0.5} value={q} unit="kN/m" onChange={e => setQ(Number(e.target.value))} />
            <Slider id="bl-F" label="Einzellast F" info={inhalt.werte.infoF} min={0} max={100} step={1} value={F} unit="kN" onChange={e => setF(Number(e.target.value))} />
            <Slider id="bl-a" label="Lage der Einzellast a/L" info={inhalt.werte.infoA} min={0} max={100} step={5} value={aRel} unit={`% (a = ${formatDeZahl(a, 2)} m)`} onChange={e => setARel(Number(e.target.value))} />
          </div>
          <div className={`${karte} flex flex-col gap-4`}>
            <h4 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.querschnitt} /></h4>
            <label className="text-sm font-medium text-text-main flex flex-col gap-1"><MdText text={inhalt.texte.werkstoff} />
              <select value={werkstoff} onChange={e => setWerkstoff(e.target.value as BiegeWerkstoffId)} className={auswahl}>
                {(Object.keys(BIEGE_WERKSTOFFE) as BiegeWerkstoffId[]).map(id => <option key={id} value={id}>{BIEGE_WERKSTOFFE[id].name} – E = {formatDeZahl(BIEGE_WERKSTOFFE[id].E, 0)} N/mm²</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-text-main flex flex-col gap-1"><MdText text={inhalt.texte.querschnittsart} />
              <select value={art} onChange={e => setArt(e.target.value as 'rechteck' | 'profil')} className={auswahl}>
                <option value="rechteck">{inhalt.texte.rechteck}</option>
                <option value="profil">{inhalt.texte.profil}</option>
              </select>
            </label>
            {art === 'rechteck' ? (<>
              <Slider id="bl-b" label="Breite b" info={inhalt.werte.infoB} min={40} max={400} step={10} value={b} unit="mm" onChange={e => setB(Number(e.target.value))} />
              <Slider id="bl-h" label="Höhe h" info={inhalt.werte.infoH} min={60} max={800} step={10} value={h} unit="mm" onChange={e => setH(Number(e.target.value))} />
            </>) : (
              <label className="text-sm font-medium text-text-main flex flex-col gap-1">Profil
                <select value={profil} onChange={e => setProfil(e.target.value)} className={auswahl}>
                  {BIEGE_PROFILE.map(p => <option key={p.name} value={p.name}>{p.name} – I_y = {formatDeZahl(p.Iy, 0)} cm⁴</option>)}
                </select>
              </label>
            )}
            <p className="text-sm text-text-main"><FormulaText text="I" /> = {formatDeZahl(I, 0)} cm⁴, <FormulaText text="E·I" /> = {formatDeZahl(r.EI, 0)} kN·m²</p>
            <p className="text-xs text-text-main/75">{BIEGE_WERKSTOFFE[werkstoff].quelle}</p>
          </div>
        </div>

        <EingabeHinweise hinweise={r.hinweise} />
        <ErgebnisAnsage text={ok ? kurzzeile(ansageWert('größte Durchbiegung w_max', r.wMax, 2, 'mm'), ansageWert('bei x =', r.xWMax, 2, 'm'), Number.isFinite(r.lDurchW) && ansageWert('L/w_max', r.lDurchW, 0)) : 'Durchbiegung –'} />
        {ok && (<>
          <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/20">
            <h4 className="text-sm font-bold text-shiraz uppercase tracking-wider mb-3"><MdText text={inhalt.texte.ergebnisse} /></h4>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><dt className="text-text-main/75"><FormulaText text="w_max" /> (bei x = {formatDeZahl(r.xWMax, 2)} m)</dt><dd className="text-lg font-bold tabular-nums">{formatDeZahl(r.wMax, 2)} mm</dd></div>
              <div><dt className="text-text-main/75">{kenn}</dt><dd className="text-lg font-bold tabular-nums">{formatDeZahl(r.wKenn, 2)} mm</dd></div>
              <div><dt className="text-text-main/75">{inhalt.werte.phiLinks}</dt><dd className="text-lg font-bold tabular-nums">{formatDeZahl(r.phiA, 2)} mrad</dd></div>
              <div><dt className="text-text-main/75">{inhalt.werte.phiRechts}</dt><dd className="text-lg font-bold tabular-nums">{formatDeZahl(r.phiB, 2)} mrad</dd></div>
              <div><dt className="text-text-main/75"><FormulaText text="L/w_max" /></dt><dd className="text-lg font-bold tabular-nums">{Number.isFinite(r.lDurchW) ? formatDeZahl(r.lDurchW, 0) : '–'}</dd></div>
            </dl>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <DiagrammAngaben titel={inhalt.werte.diagrammW} einheiten={{ x: 'm', y: 'mm' }}><Line data={datenW} options={optW} /></DiagrammAngaben>
            </div>
            <div className="h-64">
              <DiagrammAngaben titel={inhalt.werte.diagrammPhi} einheiten={{ x: 'm', y: 'mrad' }}><Line data={datenPhi} options={optPhi} /></DiagrammAngaben>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <caption className="text-left text-sm font-bold text-text-main mb-2"><MdText text={inhalt.texte.vergleich} /></caption>
              <thead className="bg-off-white">
                <tr>
                  <th scope="col" className="border border-home-grau/30 px-3 py-2"><MdText text={inhalt.texte.spalteWerkstoff} /></th>
                  <th scope="col" className="border border-home-grau/30 px-3 py-2 text-right"><MdText text={inhalt.texte.spalteE} /></th>
                  <th scope="col" className="border border-home-grau/30 px-3 py-2 text-right"><MdText text={inhalt.texte.spalteW} /></th>
                  <th scope="col" className="border border-home-grau/30 px-3 py-2 text-right"><MdText text={inhalt.texte.spalteL} /></th>
                </tr>
              </thead>
              <tbody>
                {vergleich.map(v => (
                  <tr key={v.id} className={v.id === werkstoff ? 'bg-shiraz/5 font-bold' : ''}>
                    <th scope="row" className="border border-home-grau/30 px-3 py-2 font-normal">{v.name}</th>
                    <td className="border border-home-grau/30 px-3 py-2 text-right tabular-nums">{formatDeZahl(v.E, 0)}</td>
                    <td className="border border-home-grau/30 px-3 py-2 text-right tabular-nums">{formatDeZahl(v.wMax, 2)}</td>
                    <td className="border border-home-grau/30 px-3 py-2 text-right tabular-nums">{Number.isFinite(v.lDurchW) ? formatDeZahl(v.lDurchW, 0) : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>)}
        <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.grenzen} /></p>
      </div>

      {ok && (
        <FormulaDerivationBox
          live
          title={inhalt.werte.rechenwegTitel}
          zielGleichung="E I \, w''(x) = -M(x)"
          schritte={[
            { titel: inhalt.werte.schrittEI, erklaerung: inhalt.werte.schrittEIText, formel: `E I = ${formatDeTeX(E, 0)} \\cdot ${formatDeTeX(I, 0)} \\cdot 10^{-5} = ${formatDeTeX(r.EI, 0)}\\,\\text{kN}\\,\\text{m}^2` },
            { titel: inhalt.werte.schrittW, erklaerung: inhalt.werte.schrittWText, formel: `${grundformel} = ${formatDeTeX(r.wKenn, 2)}\\,\\text{mm}` },
            { titel: inhalt.werte.schrittMax, erklaerung: inhalt.werte.schrittMaxText, formel: `w_{\\max} = ${formatDeTeX(r.wMax, 2)}\\,\\text{mm},\\quad L/w_{\\max} = ${Number.isFinite(r.lDurchW) ? formatDeTeX(r.lDurchW, 0) : '\\infty'}` },
          ]}
          ergebnisHinweis={inhalt.werte.rechenwegHinweis}
          normQuelle={inhalt.werte.rechenwegQuelle}
        />
      )}
    </div>
  );
}
