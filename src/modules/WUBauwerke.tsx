import React, { useState, useMemo } from 'react';
import { Droplets, ShieldCheck, Layers, Cpu, Compass, BookOpen, AlertCircle, CheckCircle2, ChevronRight, Gauge } from 'lucide-react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl } from '@/src/utils/numberFormat';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem
} from 'chart.js';
import inhalt from '@/content/wubauwerke/WUBauwerke.json';
import { wuNachweis } from '@/src/calc/schutzInstandsetzung';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const REITER = [
  { id: 'rechner', label: inhalt.texte.t1RechnerNachweise, icon: Gauge },
  { id: 'entwurf', label: inhalt.texte.t2EntwurfsgrundsätzeAB, icon: Compass },
  { id: 'fugen', label: inhalt.texte.t3FugenplanungDichtsysteme, icon: Layers },
  { id: 'beton', label: inhalt.texte.t4BetontechnologieSelbstheilung, icon: Cpu },
  { id: 'typen', label: inhalt.texte.t5WannenTypenIm, icon: BookOpen },
] as const;

export default function WUBauwerke() {
  const [activeTab, setActiveTab] = useState<'rechner' | 'entwurf' | 'fugen' | 'beton' | 'typen'>('rechner');

  // Simulator-Zustände
  const [hw, setHw] = useState(3.0); // Wasserdruckhöhe in m
  const [h, setH] = useState(300); // Bauteildicke in mm
  const [rissbreite, setRissbreite] = useState(0.15); // geplante Rissbreite in mm
  const [bk, setBk] = useState<'1' | '2'>('1'); // Beanspruchungsklasse
  const [nk, setNk] = useState<'A' | 'B'>('A'); // Nutzungsklasse
  const [bauteil, setBauteil] = useState<'Wand' | 'Bodenplatte'>('Wand');
  const [bauart, setBauart] = useState<'ortbeton' | 'elementwand'>('ortbeton');

  // Nachweis nach DAfStb-WU-Richtlinie 2017-12 (Kern: src/calc/schutzInstandsetzung.ts)
  const results = useMemo(() => wuNachweis(hw, h, rissbreite, bk, bauteil, bauart), [hw, h, rissbreite, bk, bauteil, bauart]);

  const chartData = useMemo(() => {
    const labels = [];
    const dataI = [];

    for (let dicke = 150; dicke <= 600; dicke += 50) {
      labels.push(`${dicke}`);
      dataI.push((hw * 1000) / dicke);
    }

    return {
      labels,
      datasets: [
        {
          label: `Druckgefälle I [-] bei h_w = ${formatDeZahl(hw, 1)} m`,
          data: dataI,
          borderColor: '#800020',
          backgroundColor: '#800020',
          tension: 0.2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [hw]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { font: { size: 11, weight: 'bold' as const } }
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => `Druckgefälle: ${formatDeZahl(context.parsed.y, 2)} [-]`
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: inhalt.werte.bauteildickeHMm, font: { size: 11, weight: 'bold' as const } },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      y: {
        title: { display: true, text: inhalt.werte.druckgefälleIHW, font: { size: 11, weight: 'bold' as const } },
        grid: { color: 'rgba(0,0,0,0.05)' },
        beginAtZero: true
      },
    },
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Kopfbereich */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Droplets className="text-shiraz" /><MdText text={inhalt.texte.wasserundurchlässigeBauwerkeWuRichtlinie} /></h2>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.bemessungEntwurfsgrundsätzeAB} /></p>
          </div>
          <div className="flex items-center gap-2 bg-rose-50 border border-shiraz/20 px-3 py-1.5 rounded-xl text-xs font-semibold text-shiraz shrink-0">
            <ShieldCheck size={16} /><MdText text={inhalt.texte.dinEn19921} /></div>
        </div>

        {/* Kurzbeschreibung */}
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 leading-relaxed">
          <p><MdText text={inhalt.texte.wasserundurchlässigeBaukörperAusBeton} /></p>
        </div>

        {/* Tab-Navigation */}
        <ModuleTabs label="Bereiche WU-Bauwerke" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6">

        {/* TAB 1: RECHNER & NACHWEISE */}
        {activeTab === 'rechner' && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Eingaben */}
              <div className="flex flex-col gap-6">
                <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t1KlassifizierungDafstbWu} /></h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-text-main"><MdText text={inhalt.texte.beanspruchungsklasseBk} /></label>
                        <InfoTooltip text={inhalt.werte.bk1DrückendesUnd} />
                      </div>
                      <select aria-label={inhalt.werte.beanspruchungsklasseBk}
                        className="p-2.5 border border-home-grau/40 rounded-xl bg-white text-sm focus:outline-none focus:border-shiraz"
                        value={bk}
                        onChange={(e) => setBk(e.target.value as '1' | '2')}
                      >
                        <option value="1">Beanspruchungsklasse 1: Drückendes Wasser / Aufstauendes Sickerwasser</option>
                        <option value="2">Beanspruchungsklasse 2: Bodenfeuchte / Nichtstauendes Sickerwasser</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-text-main"><MdText text={inhalt.texte.nutzungsklasseNk} /></label>
                        <InfoTooltip text={inhalt.werte.nkAStandardWohnräume} />
                      </div>
                      <select aria-label={inhalt.werte.nutzungsklasseNk}
                        className="p-2.5 border border-home-grau/40 rounded-xl bg-white text-sm focus:outline-none focus:border-shiraz"
                        value={nk}
                        onChange={(e) => setNk(e.target.value as 'A' | 'B')}
                      >
                        <option value="A">Nutzungsklasse A: Trocken (z. B. Wohnraum, Büro, Archiv - keine Feuchtstellen)</option>
                        <option value="B">Nutzungsklasse B: Geringe Anforderungen (z. B. Tiefgarage, Rohrlager - Feuchtstellen zulässig)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-text-main">Bauteilart</label>
                        <select aria-label="Bauteilart"
                          className="p-2.5 border border-home-grau/40 rounded-xl bg-white text-sm focus:outline-none focus:border-shiraz"
                          value={bauteil}
                          onChange={(e) => setBauteil(e.target.value as 'Wand' | 'Bodenplatte')}
                        >
                          <option value="Wand">Kelleraußenwand</option>
                          <option value="Bodenplatte">Bodenplatte (Sohle)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-text-main">Ausführungsart</label>
                        <select aria-label="Ausführungsart"
                          className="p-2.5 border border-home-grau/40 rounded-xl bg-white text-sm focus:outline-none focus:border-shiraz"
                          value={bauart}
                          onChange={(e) => setBauart(e.target.value as 'ortbeton' | 'elementwand')}
                          disabled={bauteil === 'Bodenplatte'}
                        >
                          <option value="ortbeton">Monolithischer Ortbeton</option>
                          <option value="elementwand">Dreifachwand (Elementwand)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t2BauteilgeometrieWasserdruck} /></h3>

                  <div className="space-y-4">
                    <Slider
                      label={inhalt.werte.wasserdruckhöheHW}
                      info={inhalt.werte.höheDesBemessungswasserstandsAb}
                      min={0}
                      max={12}
                      step={0.5}
                      value={hw}
                      unit="m"
                      onChange={(e) => setHw(Number(e.target.value))}
                    />

                    <Slider
                      label={inhalt.werte.vorhandeneBauteildickeH}
                      info={inhalt.werte.gesamtbauteildickeElementwändeKernbetonM}
                      min={180}
                      max={600}
                      step={10}
                      value={h}
                      unit="mm"
                      onChange={(e) => setH(Number(e.target.value))}
                    />

                    <Slider
                      label={inhalt.werte.rechnerischeRissbreiteWCal}
                      info={inhalt.werte.ausDemNachweisDer}
                      min={0.05}
                      max={0.35}
                      step={0.01}
                      value={rissbreite}
                      unit="mm"
                      onChange={(e) => setRissbreite(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Ergebnisse & Nachweise */}
              <div className="flex flex-col gap-6">
                <div className="bg-gradient-to-br from-[#800020] to-[#5a0016] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-200"><MdText text={inhalt.texte.nachweisergebnisDafstbWuRichtlinie} /></span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        results.dickeOk && results.rissbreiteOk ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'
                      }`}>
                        {results.dickeOk && results.rissbreiteOk ? 'Konform' : inhalt.werte.anpassungErforderlich}
                      </span>
                    </div>

                    <div className="space-y-3.5 text-sm">
                      <ErgebnisAnsage text={kurzzeile(ansageWert('Druckgefälle', results.druckgefaelle, 2), ansageWert('Mindestdicke', results.mindestDicke, 0, 'mm'), results.dickeOk ? 'Dicke eingehalten' : 'Dicke unterschritten', ansageWert('zulässige Rissbreite', results.zulRissbreite, 2, 'mm'), results.rissbreiteOk ? 'Rissbreite eingehalten' : 'Rissbreite überschritten')} />
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-white/80"><MdText text={inhalt.texte.druckgefälleIHW} /></span>
                        <span className="font-extrabold text-base">{formatDeZahl(results.druckgefaelle, 2)} [-]</span>
                      </div>

                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <div>
                          <span className="text-white/80 block"><MdText text={inhalt.texte.mindestbauteildickeHMin} /></span>
                          <span className="text-xs text-rose-200">
                            {bauteil} ({bk === '1' ? 'BK 1' : 'BK 2'}, {bauart === 'ortbeton' ? 'Ortbeton' : 'Elementwand'})
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`font-extrabold text-base ${results.dickeOk ? 'text-emerald-300' : 'text-amber-300'}`}>
                            {formatDeZahl(h, 0)} mm
                          </span>
                          <span className="text-xs block text-white/70">Soll ≥ {formatDeZahl(results.mindestDicke, 0)} mm</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <div>
                          <span className="text-white/80 block"><MdText text={inhalt.texte.zulässigeRissbreiteWK} /></span>
                          <span className="text-xs text-rose-200"><MdText text={inhalt.texte.fürDruckgefälle} /><InlineMath math={`I = ${formatDeZahl(results.druckgefaelle, 1)}`} />
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`font-extrabold text-base ${results.rissbreiteOk ? 'text-emerald-300' : 'text-amber-300'}`}>
                            {formatDeZahl(rissbreite, 2)} mm
                          </span>
                          <span className="text-xs block text-white/70">Zul ≤ {formatDeZahl(results.zulRissbreite, 2)} mm</span>
                          <span className="text-[10px] block text-white/60">
                            {bk === '2' ? inhalt.werte.bk2OrientierungswertNach : results.selbstheilungMoeglich ? inhalt.werte.selbstheilungGrundsatzB : inhalt.werte.i25GrundsatzA}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/20 text-xs text-rose-100 flex items-center gap-2">
                    {results.dickeOk && results.rissbreiteOk ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
                        <span><MdText text={inhalt.texte.alleMindestanforderungenAnDichtigkeit} /></span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} className="text-amber-300 shrink-0" />
                        <span><MdText text={inhalt.texte.achtungBauteildickeErhöhenOder} /></span>
                      </>
                    )}
                  </div>
                </div>

                {/* Grafische Schnittansicht */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-2xs">
                  <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-text-main flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.schnittmodellWasserdruckUngerissenerDich} /></h3>
                  <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                    <svg role="img" aria-label="Schnittmodell: Wasserdruck und ungerissener Dichtkern" width="100%" height="170" viewBox="0 0 320 170">
                      {/* Wasserstand links */}
                      <rect x="20" y="30" width="70" height="110" fill="#0284c7" opacity="0.25" />
                      <path d="M 20 30 Q 37 25 55 30 T 90 30" fill="none" stroke="#0284c7" strokeWidth="2" />
                      <text x="55" y="50" fontSize="10" fill="#0369a1" fontWeight="bold" textAnchor="middle">Anstehendes</text>
                      <text x="55" y="63" fontSize="10" fill="#0369a1" fontWeight="bold" textAnchor="middle">Wasser</text>
                      <line x1="80" y1="30" x2="80" y2="140" stroke="#0369a1" strokeWidth="1.5" markerStart="url(#arrow-blue-wu)" markerEnd="url(#arrow-blue-wu)" />
                      <text x="70" y="90" fontSize="10" fill="#0369a1" fontWeight="bold" transform="rotate(-90, 70, 90)">
                        hw = {formatDeZahl(hw, 1)} m
                      </text>

                      {/* WU-Betonquerschnitt */}
                      <rect x="90" y="15" width="100" height="135" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
                      <text x="140" y="30" fontSize="10" fill="#1e293b" fontWeight="bold" textAnchor="middle">WU-Betonwand</text>
                      <line x1="90" y1="158" x2="190" y2="158" stroke="#1e293b" strokeWidth="1.5" markerStart="url(#arrow-black-wu)" markerEnd="url(#arrow-black-wu)" />
                      <text x="140" y="166" fontSize="10" fill="#1e293b" fontWeight="bold" textAnchor="middle">
                        h = {formatDeZahl(h, 0)} mm
                      </text>

                      {/* Kapillare Wasser-Eindringzone (ca. 30-50 mm) */}
                      <rect x="90" y="15" width="30" height="135" fill="#38bdf8" opacity="0.35" />
                      <line x1="120" y1="15" x2="120" y2="150" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="105" y="85" fontSize="8" fill="#0369a1" textAnchor="middle" transform="rotate(-90, 105, 85)">Eindringzone</text>

                      {/* Ungerissener Dichtkern */}
                      <rect x="120" y="15" width="40" height="135" fill="#22c55e" opacity="0.15" />
                      <text x="140" y="85" fontSize="8" fill="#15803d" fontWeight="bold" textAnchor="middle" transform="rotate(-90, 140, 85)">Trockener Dichtkern</text>

                      {/* Innenraum rechts */}
                      <rect x="190" y="15" width="110" height="135" fill="#f8fafc" />
                      <text x="245" y="75" fontSize="11" fill="#1e293b" fontWeight="bold" textAnchor="middle">Nutzungsbereich</text>
                      <text x="245" y="90" fontSize="10" fill="#64748b" textAnchor="middle">Nutzungsklasse {nk}</text>
                      <text x="245" y="105" fontSize="9" fill={nk === 'A' ? '#15803d' : '#d97706'} textAnchor="middle">
                        {nk === 'A' ? inhalt.werte.keinFeuchtedurchtritt : inhalt.werte.feuchtefleckenToleriert}
                      </text>

                      <defs>
                        <marker id="arrow-blue-wu" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0369a1" />
                        </marker>
                        <marker id="arrow-black-wu" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagramm über gesamte Breite */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-2xs">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.druckgefälleIHW2} /></h3>
              <p className="text-xs text-text-main/70 mb-4"><MdText text={inhalt.texte.nachDafstbWuRichtlinie} /></p>
              <div className="h-[260px] w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ENTWURFSGRUNDSÄTZE */}
        {activeTab === 'entwurf' && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-6">
            <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
              <h3 className="font-bold text-text-main text-base mb-2 flex items-center gap-2">
                <Compass className="text-shiraz" /><MdText text={inhalt.texte.die3GrundlegendenEntwurfskonzepte} /></h3>
              <p><MdText text={inhalt.texte.derTragwerksplanerMussVor} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Entwurfsgrundsatz a */}
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black uppercase">
                      Konzept a
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Rissfrei</span>
                  </div>
                  <h4 className="text-base font-bold text-text-main mb-2"><MdText text={inhalt.texte.vermeidungVonTrennrissen} /></h4>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.durchKonstruktiveUndBetontechnologische} /></p>
                  <ul className="text-xs space-y-2 text-text-main/70">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.kurzeBlocklängenWandabschnitteEtwa} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.niedrigwärmezementZementeCemIii} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.gleitlagerungEntkopplungDerBodenplatte} /></span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60"><MdText text={inhalt.texte.bewertungExtremHoheAusführungsdisziplin} /></div>
              </div>

              {/* Entwurfsgrundsatz b */}
              <div className="bg-white p-5 rounded-2xl border-2 border-shiraz shadow-xs flex flex-col justify-between relative">
                <div className="absolute -top-3 right-4 px-2 py-0.5 bg-shiraz text-white text-[10px] font-bold rounded-full uppercase"><MdText text={inhalt.texte.praxisStandardRegelfall} /></div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-shiraz/10 text-shiraz text-xs font-black uppercase">
                      Konzept b
                    </span>
                    <span className="text-xs font-semibold text-slate-500"><MdText text={inhalt.texte.planmäßigeRisse} /></span>
                  </div>
                  <h4 className="text-base font-bold text-text-main mb-2"><MdText text={inhalt.texte.begrenzungDerRissbreite} /></h4>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.trennrisseWerdenPlanmäßigZugelassen} /></p>
                  <ul className="text-xs space-y-2 text-text-main/70">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.mindestbewehrungAuslegungAufFrühen} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.engeStababständeVieleDünne} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.selbstheilungRisseDichtenSich} /></span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60"><MdText text={inhalt.texte.bewertungRobusterUndHäufig} /></div>
              </div>

              {/* Entwurfsgrundsatz c */}
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-black uppercase">
                      Konzept c
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Injektion</span>
                  </div>
                  <h4 className="text-base font-bold text-text-main mb-2"><MdText text={inhalt.texte.planmäßigeRissinjektion} /></h4>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.breitereTrennrisseWerdenBewusst} /></p>
                  <ul className="text-xs space-y-2 text-text-main/70">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.geringereBewehrungBemessungNur} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.freieZugänglichkeitWändeMüssen} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.dichtinjektionVerpressungMitPolyurethanh} /></span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60"><MdText text={inhalt.texte.bewertungSanierungsUndPrüfplan} /></div>
              </div>
            </div>

            {/* Matrix-Tabelle */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-2xs overflow-x-auto">
              <h4 className="font-bold text-sm text-text-main mb-3 uppercase tracking-wider"><MdText text={inhalt.texte.vergleichsmatrixDerEntwurfsgrundsätze} /></h4>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/30 bg-off-white text-text-main font-bold">
                    <th className="p-2.5">Kriterium</th>
                    <th className="p-2.5"><MdText text={inhalt.texte.konzeptARissvermeidung} /></th>
                    <th className="p-2.5 text-shiraz font-black"><MdText text={inhalt.texte.konzeptBBegrenzungWk} /></th>
                    <th className="p-2.5"><MdText text={inhalt.texte.konzeptCInjektion} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr>
                    <td className="p-2.5 font-bold">Bewehrungsaufwand</td>
                    <td className="p-2.5 text-emerald-700 font-semibold"><MdText text={inhalt.texte.geringBisMittel} /></td>
                    <td className="p-2.5 text-amber-700 font-semibold"><MdText text={inhalt.texte.hochEngeStababstände} /></td>
                    <td className="p-2.5 text-emerald-700 font-semibold">Sehr gering</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold"><MdText text={inhalt.texte.bauablaufSchalung} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.aufwendigPilgerschrittVieleFugen} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.sehrZügigGroßeTaktabschnitte} /></td>
                    <td className="p-2.5">Zügig</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Abdichtungsmechanismus</td>
                    <td className="p-2.5"><MdText text={inhalt.texte.monolithischerUngerissenerBeton} /></td>
                    <td className="p-2.5 font-semibold text-shiraz"><MdText text={inhalt.texte.autogeneSelbstheilung} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.kunstharzInjektionDinEn} /></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold"><MdText text={inhalt.texte.kostenrisikoNacharbeit} /></td>
                    <td className="p-2.5 text-amber-700"><MdText text={inhalt.texte.hochFallsDochRisse} /></td>
                    <td className="p-2.5 text-emerald-700"><MdText text={inhalt.texte.sehrGeringKalkulierbar} /></td>
                    <td className="p-2.5 text-amber-700"><MdText text={inhalt.texte.mittelInjektionskostenSicher} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FUGENPLANUNG */}
        {activeTab === 'fugen' && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-6">
            <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
              <h3 className="font-bold text-text-main text-base mb-2 flex items-center gap-2">
                <Layers className="text-shiraz" /><MdText text={inhalt.texte.fugenUndAbdichtungssystemeIm} /></h3>
              <p><MdText text={inhalt.texte.undichtigkeitenBeiWeißenWannen} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Arbeitsfugen */}
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-2xs">
                <h4 className="font-bold text-text-main text-base mb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t1ArbeitsfugenBodenWand} /></h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.entstehenUnvermeidbarZwischenZwei} /></p>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                    <span className="font-bold text-text-main block mb-1"><MdText text={inhalt.texte.beschichteteFugenblecheKombibleche} /></span>
                    <span className="text-text-main/70"><MdText text={inhalt.texte.verzinkteOderBlankeStahlbleche} /></span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                    <span className="font-bold text-text-main block mb-1"><MdText text={inhalt.texte.injektionsschläucheSekundärsicherung} /></span>
                    <span className="text-text-main/70"><MdText text={inhalt.texte.perforierteOderGeschlitzteSchläuche} /></span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                    <span className="font-bold text-text-main block mb-1"><MdText text={inhalt.texte.quellbänderBentonitPolymer} /></span>
                    <span className="text-text-main/70"><MdText text={inhalt.texte.quellenBeiWasserkontaktStark} /></span>
                  </div>
                </div>
              </div>

              {/* Bewegungsfugen & Sollrisse */}
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-2xs">
                <h4 className="font-bold text-text-main text-base mb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.t2DehnfugenSollrisseDurchdringungen} /></h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.konstruktiveTrennungenZurAufnahme} /></p>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                    <span className="font-bold text-text-main block mb-1"><MdText text={inhalt.texte.dehnfugenbänderNachDin7865} /></span>
                    <span className="text-text-main/70"><MdText text={inhalt.texte.innenOderAußenliegendeElastomer} /></span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                    <span className="font-bold text-text-main block mb-1"><MdText text={inhalt.texte.sollrisselementeScheinfugen} /></span>
                    <span className="text-text-main/70"><MdText text={inhalt.texte.fugenelementeMitQuerschnittsschwächungMi} /></span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                    <span className="font-bold text-text-main block mb-1"><MdText text={inhalt.texte.druckwasserdichteRohrdurchführungen} /></span>
                    <span className="text-text-main/70"><MdText text={inhalt.texte.futterrohreMitFlanschOder} /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BETONTECHNOLOGIE & SELBSTHEILUNG */}
        {activeTab === 'beton' && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-6">
            <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
              <h3 className="font-bold text-text-main text-base mb-2 flex items-center gap-2">
                <Cpu className="text-shiraz" /><MdText text={inhalt.texte.betontechnologieUndAutogeneSelbstheilung} /></h3>
              <p><MdText text={inhalt.texte.derBetonFürWu} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Betonrezeptur */}
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-2xs">
                <h4 className="font-bold text-text-main text-base mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.betontechnologischeKennwerteDinEn} /></h4>
                <div className="space-y-3 text-xs text-text-main/80">
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center">
                    <span className="font-bold text-text-main"><MdText text={inhalt.texte.maximalerWZWert} /></span>
                    <span className="font-mono font-bold text-shiraz"><MdText text={inhalt.texte.wZLe0} /></span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center">
                    <span className="font-bold text-text-main">Mindestdruckfestigkeitsklasse:</span>
                    <span className="font-mono font-bold text-text-main"><MdText text={inhalt.texte.c2530OftC30} /></span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center">
                    <span className="font-bold text-text-main"><MdText text={inhalt.texte.wassereindringtiefeDinEn12390} /></span>
                    <span className="font-mono font-bold text-text-main">
                      <InlineMath math="e_{\max} \le 50\,\text{mm}" /> (Soll: <InlineMath math="\le 30\,\text{mm}" />)
                    </span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center">
                    <span className="font-bold text-text-main"><MdText text={inhalt.texte.zementartHydratationswärme} /></span>
                    <span className="font-bold text-emerald-800"><MdText text={inhalt.texte.zBCemIii} /></span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center">
                    <span className="font-bold text-text-main"><MdText text={inhalt.texte.konsistenzklasseEinbau} /></span>
                    <span className="font-mono font-bold text-text-main"><MdText text={inhalt.texte.f3BisF4Weich} /></span>
                  </div>
                </div>
              </div>

              {/* Autogene Selbstheilung */}
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-2xs flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-text-main text-base mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span><MdText text={inhalt.texte.autogeneSelbstheilungChemischerMechanism} /></h4>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.unterDauerhaftemWasserkontaktUnd} /></p>

                  <div className="bg-off-white p-3 rounded-xl border border-home-grau/30 mb-3">
                    <span className="text-xs font-bold text-text-main block mb-1"><MdText text={inhalt.texte.hauptreaktionCalciumcarbonatAusfällung} /></span>
                    <BlockMath math="Ca(OH)_2 + CO_2 \longrightarrow CaCO_3 \downarrow + H_2O" />
                    <p className="text-[11px] text-text-main/70 mt-1"><MdText text={inhalt.texte.imPorenwasserGelöstesCalciumhydroxid} /></p>
                  </div>

                  <ul className="text-xs space-y-1.5 text-text-main/70">
                    <li><MdText text={inhalt.texte.sekundäreffekteWeiterschreitendeHydratat} /></li>
                    <li><MdText text={inhalt.texte.filterwirkungMechanischesFestsetzenFeins} /></li>
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 text-xs text-text-main/70 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60"><MdText text={inhalt.texte.grenzenDerSelbstheilungRisse} /></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WANNEN-TYPEN IM VERGLEICH */}
        {activeTab === 'typen' && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-6">
            <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
              <h3 className="font-bold text-text-main text-base mb-2 flex items-center gap-2">
                <BookOpen className="text-shiraz" /><MdText text={inhalt.texte.bauweisenImTiefbauWeiße} /></h3>
              <p><MdText text={inhalt.texte.jeNachBaugrundverhältnissenWasserbeanspr} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Weiße Wanne */}
              <div className="p-4 rounded-xl border-2 border-shiraz bg-white flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-400"></span>
                    <h4 className="font-bold text-sm text-text-main">Weiße Wanne</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-shiraz uppercase tracking-wider block mb-2"><MdText text={inhalt.texte.wuBetonMonolithisch} /></span>
                  <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.betonÜbernimmtTragwerkUnd} /></p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60"><MdText text={inhalt.texte.vorteilGeringerWartungsaufwandSchnelle} /></div>
              </div>

              {/* Schwarze Wanne */}
              <div className="p-4 rounded-xl border border-home-grau/30 bg-white flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-800"></span>
                    <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.schwarzeWanne} /></h4>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block mb-2"><MdText text={inhalt.texte.bitumenPmbcDin18533} /></span>
                  <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.außenliegendeNahtloseDichtungshautAus} /></p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60"><MdText text={inhalt.texte.vorteilHöchsteSicherheitGegen} /></div>
              </div>

              {/* Braune Wanne */}
              <div className="p-4 rounded-xl border border-home-grau/30 bg-white flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-800"></span>
                    <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.brauneWanne} /></h4>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block mb-2">
                    Bentonit-Geotextil
                  </span>
                  <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.außenliegendeMattenAusQuellfähigem} /></p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60"><MdText text={inhalt.texte.vorteilSelbstquellendBeiBeschädigung} /></div>
              </div>

              {/* Gelbe Wanne */}
              <div className="p-4 rounded-xl border border-home-grau/30 bg-white flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-600"></span>
                    <h4 className="font-bold text-sm text-text-main">Gelbe Wanne</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block mb-2">
                    FBV-Verbundbahnen
                  </span>
                  <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.frischbetonverbundfolienFbvDieVor} /></p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60"><MdText text={inhalt.texte.vorteilHinterlaufschutzVerhindertUnterwa} /></div>
              </div>
            </div>
          </div>
        )}
        </ModuleTabs>
      </div>

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielKellerwandInBeanspruch}
        zielGleichung="I = \frac{h_w}{h}"
        normQuelle={inhalt.werte.dafstbWuRichtlinie2017}
        schritte={inhalt.daten["WUBauwerke.schritte"]}
        ergebnisHinweis={inhalt.werte.mitH300Mm}
      />

      <ModulTest moduleId="wu-bauwerke" />

      {/* Standardisierter Footer */}
      <ModuleFooter
        weblinks={inhalt.daten["WUBauwerke.weblinks"]}
        wikipedia={[
          { title: 'Weiße Wanne', url: 'https://de.wikipedia.org/wiki/Wei%C3%9Fe_Wanne' },
          { title: inhalt.werte.schwarzeWanne, url: 'https://de.wikipedia.org/wiki/Schwarze_Wanne' }
        ]}
        regelwerke={inhalt.daten["WUBauwerke.regelwerke"]}
        literatur={inhalt.daten["WUBauwerke.literatur"]}
        formeln={
          activeTab === 'rechner'
            ? inhalt.daten.WUBauwerke
            : activeTab === 'beton'
            ? inhalt.daten.WUBauwerke_2
            : []
        }
      />
    </div>
  );
}
