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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

  const results = useMemo(() => {
    // Druckgefälle I = h_w / h
    const hMeter = h / 1000;
    const druckgefaelle = hMeter > 0 ? hw / hMeter : 0;

    // Mindestbauteildicken nach DAfStb-WU-Richtlinie 2017-12, Tab. 1 (Ortbeton / Elementwand / Fertigteil)
    // Kernbetondicke der Elementwand: manuell prüfen
    let mindestDicke = 200;
    if (bk === '1') {
      mindestDicke = bauteil === 'Wand' ? 240 : 250;
    } else {
      mindestDicke = bauteil === 'Wand' ? (bauart === 'ortbeton' ? 200 : 240) : 150;
    }
    const dickeOk = h >= mindestDicke;

    // Rechnerische Trennrissbreite für Selbstheilung (Entwurfsgrundsatz b), abhängig von h_w/h
    // Stufen ≤ 10 / ≤ 15 / ≤ 25 → 0,20 / 0,15 / 0,10 mm (WU-Richtlinie – manuell prüfen)
    // BK 2: keine Selbstheilungsanforderung; Orientierungswert w_max = 0,3 mm nach EC2/NA
    let zulRissbreite = 0.30;
    let selbstheilungMoeglich = true;
    if (bk === '1') {
      if (druckgefaelle <= 10) zulRissbreite = 0.20;
      else if (druckgefaelle <= 15) zulRissbreite = 0.15;
      else if (druckgefaelle <= 25) zulRissbreite = 0.10;
      else { zulRissbreite = 0.10; selbstheilungMoeglich = false; }
    }
    const rissbreiteOk = rissbreite <= zulRissbreite + 0.001;

    return {
      druckgefaelle,
      dickeOk,
      mindestDicke,
      rissbreiteOk,
      zulRissbreite,
      selbstheilungMoeglich,
    };
  }, [hw, h, rissbreite, bk, nk, bauteil, bauart]);

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
          label: (context: any) => `Druckgefälle: ${formatDeZahl(context.parsed.y, 2)} [-]`
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Bauteildicke h (mm)', font: { size: 11, weight: 'bold' as const } },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      y: {
        title: { display: true, text: 'Druckgefälle I = h_w / h [-]', font: { size: 11, weight: 'bold' as const } },
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
              <Droplets className="text-shiraz" /> Wasserundurchlässige Bauwerke (WU-Richtlinie &amp; Weiße Wanne)
            </h2>
            <p className="text-xs text-text-main/70 mt-1">
              Bemessung, Entwurfsgrundsätze (a/b/c), Fugenabdichtungen, Betontechnologie und autogene Rissheilung nach DAfStb-Richtlinie (2017-12) &amp; DIN EN 1992-1-1
            </p>
          </div>
          <div className="flex items-center gap-2 bg-rose-50 border border-shiraz/20 px-3 py-1.5 rounded-xl text-xs font-semibold text-shiraz shrink-0">
            <ShieldCheck size={16} /> DIN EN 1992-1-1 / DAfStb WU
          </div>
        </div>

        {/* Kurzbeschreibung */}
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 leading-relaxed">
          <p>
            Wasserundurchlässige Baukörper aus Beton (<strong>Weiße Wanne</strong>) übernehmen in einem Arbeitsgang sowohl die <strong>tragende statische Funktion</strong> als auch die <strong>wasserundurchlässige Barrierefunktion</strong> ohne zusätzliche Außenhautabdichtung. Die Dichtigkeit wird durch einen Verbund aus rissminimierendem Tragwerksentwurf, normativer Mindestbauteildicke, Begrenzung der Trennrissbreiten (<InlineMath math="w_k" />), hochdichtem Beton (<InlineMath math="w/z \le 0{,}55" />) und lückenlosen Fugenabdichtungssystemen garantiert.
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-2xs cursor-pointer ${
              activeTab === 'rechner'
                ? 'bg-shiraz text-white border-shiraz shadow-xs'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('rechner')}
          >
            <Gauge size={16} /> 1. Rechner &amp; Nachweise
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-2xs cursor-pointer ${
              activeTab === 'entwurf'
                ? 'bg-shiraz text-white border-shiraz shadow-xs'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('entwurf')}
          >
            <Compass size={16} /> 2. Entwurfsgrundsätze (a, b, c)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-2xs cursor-pointer ${
              activeTab === 'fugen'
                ? 'bg-shiraz text-white border-shiraz shadow-xs'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('fugen')}
          >
            <Layers size={16} /> 3. Fugenplanung &amp; Dichtsysteme
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-2xs cursor-pointer ${
              activeTab === 'beton'
                ? 'bg-shiraz text-white border-shiraz shadow-xs'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('beton')}
          >
            <Cpu size={16} /> 4. Betontechnologie &amp; Selbstheilung
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-2xs cursor-pointer ${
              activeTab === 'typen'
                ? 'bg-shiraz text-white border-shiraz shadow-xs'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('typen')}
          >
            <BookOpen size={16} /> 5. Wannen-Typen im Vergleich
          </button>
        </div>

        {/* TAB 1: RECHNER & NACHWEISE */}
        {activeTab === 'rechner' && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Eingaben */}
              <div className="flex flex-col gap-6">
                <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-shiraz"></span> 1. Klassifizierung (DAfStb WU-Richtlinie)
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-text-main">Beanspruchungsklasse (BK)</label>
                        <InfoTooltip text="BK 1: Drückendes und aufstauendes Sickerwasser (Grundwasser, Hochwasser). BK 2: Bodenfeuchte und nichtstauendes Sickerwasser." />
                      </div>
                      <select aria-label="Beanspruchungsklasse (BK)"
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
                        <label className="text-sm font-semibold text-text-main">Nutzungsklasse (NK)</label>
                        <InfoTooltip text="NK A: Standard (Wohnräume, Archive, Technikzentralen). Feuchtetransport über den Querschnitt nicht zulässig. NK B: Tiefgaragen, Lagerräume einfacher Art. Feuchtstellen an Fugen/Rissen zulässig." />
                      </div>
                      <select aria-label="Nutzungsklasse (NK)"
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
                    <span className="w-2 h-2 rounded-full bg-shiraz"></span> 2. Bauteilgeometrie &amp; Wasserdruck
                  </h3>

                  <div className="space-y-4">
                    <Slider
                      label="Wasserdruckhöhe h_w"
                      info="Höhe des Bemessungswasserstands ab Unterkante Bauteil (aus dem Bodengutachten; Sicherheitszuschlag als Lehrannahme)."
                      min={0}
                      max={12}
                      step={0.5}
                      value={hw}
                      unit="m"
                      onChange={(e) => setHw(Number(e.target.value))}
                    />

                    <Slider
                      label="Vorhandene Bauteildicke h"
                      info="Gesamtbauteildicke. Kernbetondicke bei Elementwänden: manuell prüfen."
                      min={180}
                      max={600}
                      step={10}
                      value={h}
                      unit="mm"
                      onChange={(e) => setH(Number(e.target.value))}
                    />

                    <Slider
                      label="Rechnerische Rissbreite w_cal"
                      info="Aus dem Nachweis der Rissbreitenbegrenzung nach DIN EN 1992-1-1 ermittelte Rissbreite w_k."
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
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-200">
                        Nachweisergebnis (DAfStb WU-Richtlinie)
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        results.dickeOk && results.rissbreiteOk ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'
                      }`}>
                        {results.dickeOk && results.rissbreiteOk ? 'Konform' : 'Anpassung erforderlich'}
                      </span>
                    </div>

                    <div className="space-y-3.5 text-sm">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-white/80">Druckgefälle <InlineMath math="I = h_w / h" />:</span>
                        <span className="font-extrabold text-base">{formatDeZahl(results.druckgefaelle, 2)} [-]</span>
                      </div>

                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <div>
                          <span className="text-white/80 block">Mindestbauteildicke <InlineMath math="h_{\min}" />:</span>
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
                          <span className="text-white/80 block">Zulässige Rissbreite <InlineMath math="w_k" />:</span>
                          <span className="text-xs text-rose-200">
                            Für Druckgefälle <InlineMath math={`I = ${formatDeZahl(results.druckgefaelle, 1)}`} />
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`font-extrabold text-base ${results.rissbreiteOk ? 'text-emerald-300' : 'text-amber-300'}`}>
                            {formatDeZahl(rissbreite, 2)} mm
                          </span>
                          <span className="text-xs block text-white/70">Zul ≤ {formatDeZahl(results.zulRissbreite, 2)} mm</span>
                          <span className="text-[10px] block text-white/60">
                            {bk === '2' ? 'BK 2: Orientierungswert nach EC2/NA' : results.selbstheilungMoeglich ? 'Selbstheilung (Grundsatz b)' : 'I > 25: Grundsatz a oder c wählen'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/20 text-xs text-rose-100 flex items-center gap-2">
                    {results.dickeOk && results.rissbreiteOk ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
                        <span>Alle Mindestanforderungen an Dichtigkeit und Querschnittsabmessungen sind rechnerisch erfüllt.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} className="text-amber-300 shrink-0" />
                        <span>Achtung: Bauteildicke erhöhen oder rechnerische Rissbreite durch verstärkte Zwangsbewehrung reduzieren!</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Grafische Schnittansicht */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-2xs">
                  <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-text-main flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-shiraz"></span>
                    Schnittmodell: Wasserdruck &amp; Ungerissener Dichtkern
                  </h3>
                  <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                    <svg width="100%" height="170" viewBox="0 0 320 170">
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
                        {nk === 'A' ? 'Kein Feuchtedurchtritt' : 'Feuchteflecken toleriert'}
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
                <span className="w-2 h-2 rounded-full bg-shiraz"></span>
                Druckgefälle <InlineMath math="I = h_w / h" /> in Abhängigkeit von der Wanddicke
              </h3>
              <p className="text-xs text-text-main/70 mb-4">
                Nach DAfStb WU-Richtlinie bestimmt das Druckgefälle <InlineMath math="I" /> maßgeblich die Anforderung an die Rissbreitenbegrenzung. Für die Selbstheilung (Entwurfsgrundsatz b) gilt: <InlineMath math="I \le 10" /> → <InlineMath math="w_k \le 0{,}20\,\text{mm}" />, <InlineMath math="I \le 15" /> → 0,15 mm, <InlineMath math="I \le 25" /> → 0,10 mm (Werte manuell prüfen). Darüber ist Selbstheilung nicht planbar – Entwurfsgrundsatz a oder c wählen.
              </p>
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
                <Compass className="text-shiraz" /> Die 3 grundlegenden Entwurfskonzepte nach DAfStb-Richtlinie
              </h3>
              <p>
                Der Tragwerksplaner muss vor Beginn der Detailplanung in Abstimmung mit dem Bauherrn und dem Betonhersteller eines der drei normierten Entwurfskonzepte für wasserundurchlässige Baukörper festlegen:
              </p>
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
                  <h4 className="text-base font-bold text-text-main mb-2">Vermeidung von Trennrissen</h4>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-4">
                    Durch konstruktive und betontechnologische Maßnahmen wird das Entstehen von Trennrissen von vornherein vollständig verhindert.
                  </p>
                  <ul className="text-xs space-y-2 text-text-main/70">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Kurze Blocklängen:</strong> Wandabschnitte etwa 6 bis 8 m zwischen Scheinfugen / Dehnfugen (Faustwert).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Niedrigwärmezement:</strong> Zemente CEM III mit LH/VLH zur Senkung der Hydratationswärme (<InlineMath math="\Delta T \le 15\,\text{K}" />).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Gleitlagerung:</strong> Entkopplung der Bodenplatte durch doppellagige PE-Folien auf Sauberkeitsschicht.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60">
                  <strong>Bewertung:</strong> Extrem hohe Ausführungsdisziplin erforderlich; Rissfreiheit auf der Baustelle nie 100%ig garantierbar.
                </div>
              </div>

              {/* Entwurfsgrundsatz b */}
              <div className="bg-white p-5 rounded-2xl border-2 border-shiraz shadow-xs flex flex-col justify-between relative">
                <div className="absolute -top-3 right-4 px-2 py-0.5 bg-shiraz text-white text-[10px] font-bold rounded-full uppercase">
                  Praxis-Standard (Regelfall)
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-shiraz/10 text-shiraz text-xs font-black uppercase">
                      Konzept b
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Planmäßige Risse</span>
                  </div>
                  <h4 className="text-base font-bold text-text-main mb-2">Begrenzung der Rissbreite</h4>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-4">
                    Trennrisse werden planmäßig zugelassen, jedoch durch gezielte Mindestbewehrung auf Breiten beschränkt (je nach Druckgefälle <InlineMath math="w_k \le 0{,}10 \dots 0{,}20\,\text{mm}" />), die eine <strong>autogene Selbstheilung</strong> ermöglichen.
                  </p>
                  <ul className="text-xs space-y-2 text-text-main/70">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Mindestbewehrung:</strong> Auslegung auf frühen Zwang (Hydratationswärme) nach DIN EN 1992-1-1.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Enge Stababstände:</strong> Viele dünne Stäbe (z. B. <InlineMath math="\varnothing 10" /> oder <InlineMath math="\varnothing 12" />) statt weniger dicker Stäbe.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Selbstheilung:</strong> Risse dichten sich durch Calciumcarbonat-Ausfällung bei Wasserdruck <InlineMath math="I \le 10" /> eigenständig ab.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60">
                  <strong>Bewertung:</strong> Robuster und häufig gewählter Ansatz. Erfordert genaue Bemessung.
                </div>
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
                  <h4 className="text-base font-bold text-text-main mb-2">Planmäßige Rissinjektion</h4>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-4">
                    Breitere Trennrisse werden bewusst in Kauf genommen (geringere Zwangsbewehrung), um Baukosten zu senken. Alle auftretenden Risse werden planmäßig nachträglich injiziert.
                  </p>
                  <ul className="text-xs space-y-2 text-text-main/70">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Geringere Bewehrung:</strong> Bemessung nur auf Tragfähigkeit, Rissbreiten bis <InlineMath math="0{,}30\,\text{mm}" /> akzeptiert.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Freie Zugänglichkeit:</strong> Wände müssen beidseitig inspizierbar und frei von Vorwandinstallationen bleiben.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Dichtinjektion:</strong> Verpressung mit Polyurethanharzen (PU) oder Epoxidharzen nach DIN EN 1504-5.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60">
                  <strong>Bewertung:</strong> Sanierungs- und Prüfplan vertraglich zwingend festzulegen; Nachfolgekosten für Injektionen einplanen.
                </div>
              </div>
            </div>

            {/* Matrix-Tabelle */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-2xs overflow-x-auto">
              <h4 className="font-bold text-sm text-text-main mb-3 uppercase tracking-wider">
                Vergleichsmatrix der Entwurfsgrundsätze
              </h4>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/30 bg-off-white text-text-main font-bold">
                    <th className="p-2.5">Kriterium</th>
                    <th className="p-2.5">Konzept a (Rissvermeidung)</th>
                    <th className="p-2.5 text-shiraz font-black">Konzept b (Begrenzung wk)</th>
                    <th className="p-2.5">Konzept c (Injektion)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr>
                    <td className="p-2.5 font-bold">Bewehrungsaufwand</td>
                    <td className="p-2.5 text-emerald-700 font-semibold">Gering bis mittel</td>
                    <td className="p-2.5 text-amber-700 font-semibold">Hoch (enge Stababstände)</td>
                    <td className="p-2.5 text-emerald-700 font-semibold">Sehr gering</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Bauablauf &amp; Schalung</td>
                    <td className="p-2.5">Aufwendig (Pilgerschritt, viele Fugen)</td>
                    <td className="p-2.5">Sehr zügig (große Taktabschnitte)</td>
                    <td className="p-2.5">Zügig</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Abdichtungsmechanismus</td>
                    <td className="p-2.5">Monolithischer ungerissener Beton</td>
                    <td className="p-2.5 font-semibold text-shiraz">Autogene Selbstheilung</td>
                    <td className="p-2.5">Kunstharz-Injektion (DIN EN 1504-5)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Kostenrisiko / Nacharbeit</td>
                    <td className="p-2.5 text-amber-700">Hoch (falls doch Risse entstehen)</td>
                    <td className="p-2.5 text-emerald-700">Sehr gering (kalkulierbar)</td>
                    <td className="p-2.5 text-amber-700">Mittel (Injektionskosten sicher)</td>
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
                <Layers className="text-shiraz" /> Fugen- und Abdichtungssysteme im WU-Bauwerk
              </h3>
              <p>
                Undichtigkeiten bei Weißen Wannen entstehen überwiegend an <strong>Fugen und Durchdringungen</strong>, nicht im ungestörten Betonquerschnitt. Ein lückenloses, in sich geschlossenes Fugenkonzept nach <strong>DIN 18197</strong> und der DAfStb-Richtlinie ist für den Dichtigkeitserfolg unerlässlich.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Arbeitsfugen */}
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-2xs">
                <h4 className="font-bold text-text-main text-base mb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-shiraz"></span> 1. Arbeitsfugen (Boden-Wand / Wand-Wand)
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Entstehen unvermeidbar zwischen zwei Betonierabschnitten. Der Verbund muss mechanisch rau ausgeführt und druckwasserdicht abgedichtet werden.
                </p>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                    <span className="font-bold text-text-main block mb-1">Beschichtete Fugenbleche (Kombibleche)</span>
                    <span className="text-text-main/70">
                      Verzinkte oder blanke Stahlbleche mit mineralischer, quellfähiger oder bitumenfreier Polymer-Spezialbeschichtung. Verbinden sich chemisch und mikromechanisch mit dem Frischbeton. Prüfdruck bis zu 5 bar (50 m Wassersäule).
                    </span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                    <span className="font-bold text-text-main block mb-1">Injektionsschläuche (Sekundärsicherung)</span>
                    <span className="text-text-main/70">
                      Perforierte oder geschlitzte Schläuche im Fugenbereich. Ermöglichen bei eventuellen Hohlstellen ein nachträgliches Verpressen mit PU-Harzen oder Polyacrylatgel ohne Bohrarbeiten.
                    </span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                    <span className="font-bold text-text-main block mb-1">Quellbänder (Bentonit / Polymer)</span>
                    <span className="text-text-main/70">
                      Quellen bei Wasserkontakt stark auf (Herstellerangaben beachten). Nur bei allseitiger Betonüberdeckung von mind. 80–100 mm zulässig, um Abplatzungen durch Quelldruck zu verhindern.
                    </span>
                  </div>
                </div>
              </div>

              {/* Bewegungsfugen & Sollrisse */}
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-2xs">
                <h4 className="font-bold text-text-main text-base mb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-shiraz"></span> 2. Dehnfugen, Sollrisse &amp; Durchdringungen
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Konstruktive Trennungen zur Aufnahme thermischer Dehnungen und Setzungsdifferenzen sowie gezielte Risslenkung.
                </p>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                    <span className="font-bold text-text-main block mb-1">Dehnfugenbänder nach DIN 7865 / DIN 18197</span>
                    <span className="text-text-main/70">
                      Innen- oder außenliegende Elastomer- bzw. PVC-P-Bänder mit mittigem Dehnschlauch (Hohlkörper). Nehmen 3D-Verformungen (Scherung, Dehnung, Stauchung) schadlos auf.
                    </span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                    <span className="font-bold text-text-main block mb-1">Sollrisselemente (Scheinfugen)</span>
                    <span className="text-text-main/70">
                      Fugenelemente mit Querschnittsschwächung (mind. 1/3 der Bauteildicke) und integriertem Abdichtungsblech. Lenken unvermeidliche Zwangrisse an definierte, abgedichtete Stellen.
                    </span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                    <span className="font-bold text-text-main block mb-1">Druckwasserdichte Rohrdurchführungen</span>
                    <span className="text-text-main/70">
                      Futterrohre mit Flansch oder integrierter Außenabdichtung; medienführende Leitungen werden über elastomere Ringraumdichtungen (Pressringdichtungen) gas- und wasserdicht eingebunden.
                    </span>
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
                <Cpu className="text-shiraz" /> Betontechnologie und autogene Selbstheilung von Trennrissen
              </h3>
              <p>
                Der Beton für WU-Bauwerke muss nach <strong>DIN EN 206 / DIN 1045-2</strong> ein dichtes Zementsteingefüge mit minimalem Kapillarporenvolumen aufweisen. Die Begrenzung der Hydratationswärmeentwicklung steht dabei im Zentrum, um thermische Frühzwangspannungen zu minimieren.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Betonrezeptur */}
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-2xs">
                <h4 className="font-bold text-text-main text-base mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-shiraz"></span> Betontechnologische Kennwerte (DIN EN 206 / DIN 1045-2)
                </h4>
                <div className="space-y-3 text-xs text-text-main/80">
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center">
                    <span className="font-bold text-text-main">Maximaler w/z-Wert:</span>
                    <span className="font-mono font-bold text-shiraz">
                      <InlineMath math="w/z \le 0{,}55" /> (BK 1) bzw. <InlineMath math="0{,}60" /> (BK 2)
                    </span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center">
                    <span className="font-bold text-text-main">Mindestdruckfestigkeitsklasse:</span>
                    <span className="font-mono font-bold text-text-main">C25/30 (oft C30/37)</span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center">
                    <span className="font-bold text-text-main">Wassereindringtiefe (DIN EN 12390-8):</span>
                    <span className="font-mono font-bold text-text-main">
                      <InlineMath math="e_{\max} \le 50\,\text{mm}" /> (Soll: <InlineMath math="\le 30\,\text{mm}" />)
                    </span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center">
                    <span className="font-bold text-text-main">Zementart &amp; Hydratationswärme:</span>
                    <span className="font-bold text-emerald-800">z. B. CEM III/A LH (niedrige Hydratationswärme)</span>
                  </div>
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center">
                    <span className="font-bold text-text-main">Konsistenzklasse / Einbau:</span>
                    <span className="font-mono font-bold text-text-main">F3 bis F4 (weich bis fließfähig)</span>
                  </div>
                </div>
              </div>

              {/* Autogene Selbstheilung */}
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-2xs flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-text-main text-base mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Autogene Selbstheilung (Chemischer Mechanismus)
                  </h4>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                    Unter dauerhaftem Wasserkontakt und bei begrenzter Rissbreite (je nach Druckgefälle <InlineMath math="w_k \le 0{,}10 \dots 0{,}20\,\text{mm}" />) verschließen sich wasserführende Trennrisse durch chemische Reaktionen und physikalische Prozesse selbsttätig.
                  </p>

                  <div className="bg-off-white p-3 rounded-xl border border-home-grau/30 mb-3">
                    <span className="text-xs font-bold text-text-main block mb-1">Hauptreaktion: Calciumcarbonat-Ausfällung</span>
                    <BlockMath math="Ca(OH)_2 + CO_2 \longrightarrow CaCO_3 \downarrow + H_2O" />
                    <p className="text-[11px] text-text-main/70 mt-1">
                      Im Porenwasser gelöstes Calciumhydroxid (<InlineMath math="Ca(OH)_2" /> aus dem Zementstein) reagiert mit im Wasser gelöstem Kohlendioxid (<InlineMath math="CO_2" />) zu schwerlöslichem Calcit (<InlineMath math="CaCO_3" />), der den Rissquerschnitt von innen heraus auskristallisiert und abdichtet.
                    </p>
                  </div>

                  <ul className="text-xs space-y-1.5 text-text-main/70">
                    <li>• <strong>Sekundäreffekte:</strong> Weiterschreitende Hydratation unhydratisierter Zementklinker an den Rissufern.</li>
                    <li>• <strong>Filterwirkung:</strong> Mechanisches Festsetzen feinster Schwebstoffe im Risskanal.</li>
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 text-xs text-text-main/70 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                  <strong>Grenzen der Selbstheilung:</strong> Risse breiter als der zulässige Wert (0,10–0,20 mm je nach Druckgefälle), zu hohes Fließgefälle (Auswaschung statt Kristallisation) oder aggressives, kalklösendes Wasser verhindern die Selbstheilung.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WANNEN-TYPEN IM VERGLEICH */}
        {activeTab === 'typen' && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-6">
            <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
              <h3 className="font-bold text-text-main text-base mb-2 flex items-center gap-2">
                <BookOpen className="text-shiraz" /> Bauweisen im Tiefbau: Weiße, Schwarze, Braune &amp; Gelbe Wanne
              </h3>
              <p>
                Je nach Baugrundverhältnissen, Wasserbeanspruchung, Radon-Schutzanforderungen und geplanter Nutzung stehen im modernen Tief- und Ingenieurbau verschiedene Wannen-Bauarten zur Verfügung:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Weiße Wanne */}
              <div className="p-4 rounded-xl border-2 border-shiraz bg-white flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-400"></span>
                    <h4 className="font-bold text-sm text-text-main">Weiße Wanne</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-shiraz uppercase tracking-wider block mb-2">
                    WU-Beton (Monolithisch)
                  </span>
                  <p className="text-xs text-text-main/75 leading-relaxed">
                    Beton übernimmt Tragwerk und Abdichtung gleichzeitig. Keine außenliegende Abdichtungshaut nötig.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60">
                  <strong>Vorteil:</strong> Geringer Wartungsaufwand, schnelle Bauzeit, Schäden von innen ortbar und sanierbar.
                </div>
              </div>

              {/* Schwarze Wanne */}
              <div className="p-4 rounded-xl border border-home-grau/30 bg-white flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-800"></span>
                    <h4 className="font-bold text-sm text-text-main">Schwarze Wanne</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                    Bitumen / PMBC (DIN 18533)
                  </span>
                  <p className="text-xs text-text-main/75 leading-relaxed">
                    Außenliegende, nahtlose Dichtungshaut aus Bitumenbahnen oder kunststoffmodifizierten Bitumendickbeschichtungen.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60">
                  <strong>Vorteil:</strong> Höchste Sicherheit gegen Dampfdiffusion; <strong>Nachteil:</strong> Mechanisch verletzlich bei Verfüllung.
                </div>
              </div>

              {/* Braune Wanne */}
              <div className="p-4 rounded-xl border border-home-grau/30 bg-white flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-800"></span>
                    <h4 className="font-bold text-sm text-text-main">Braune Wanne</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block mb-2">
                    Bentonit-Geotextil
                  </span>
                  <p className="text-xs text-text-main/75 leading-relaxed">
                    Außenliegende Matten aus quellfähigem Natriumbentonit, eingebettet in reißfeste Geotextilvliese.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60">
                  <strong>Vorteil:</strong> Selbstquellend bei Beschädigung; <strong>Voraussetzung:</strong> Kontinuierlicher Auflagedruck.
                </div>
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
                  <p className="text-xs text-text-main/75 leading-relaxed">
                    Frischbetonverbundfolien (FBV), die vor dem Betonieren in die Schalung eingelegt werden und sich vollflächig mit dem Beton verzahnen.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-text-main/60">
                  <strong>Vorteil:</strong> Hinterlaufschutz verhindert Unterwanderung von Wasser bei Punktperforationen; radonresistent.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Kellerwand in Beanspruchungsklasse 1 (Standardwerte)"
        zielGleichung="I = \frac{h_w}{h}"
        normQuelle="DAfStb-WU-Richtlinie 2017-12 (Werte manuell prüfen)"
        schritte={[
          { titel: '1. Gegeben', formel: 'h_w = 3{,}0\\,\\text{m},\\; h = 300\\,\\text{mm},\\; \\text{BK 1, Ortbetonwand}', erklaerung: 'Drückendes Wasser.' },
          { titel: '2. Mindestdicke', formel: 'h = 300\\,\\text{mm} \\ge 240\\,\\text{mm}', erklaerung: 'Tab. 1 der WU-Richtlinie eingehalten.' },
          { titel: '3. Druckgefälle', formel: 'I = 3{,}0 / 0{,}30 = 10', erklaerung: 'Grenze der ersten Stufe.' },
          { titel: '4. Zulässige Rissbreite', formel: 'w_k \\le 0{,}20\\,\\text{mm}', erklaerung: 'Selbstheilung planbar (Entwurfsgrundsatz b).' },
        ]}
        ergebnisHinweis="Mit h = 300 mm und w_k ≤ 0,20 mm ist die Selbstheilung nach Entwurfsgrundsatz b planbar."
      />

      <ModulTest moduleId="wu-bauwerke" />

      {/* Standardisierter Footer */}
      <ModuleFooter
        weblinks={[
          { title: 'Zement-Merkblatt H10: Wasserundurchlässige Betonbauwerke (beton.org)', url: 'https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/' },
          { title: 'Deutscher Ausschuss für Stahlbeton e.V. (DAfStb)', url: 'https://www.dafstb.de/' }
        ]}
        wikipedia={[
          { title: 'Weiße Wanne', url: 'https://de.wikipedia.org/wiki/Wei%C3%9Fe_Wanne' },
          { title: 'Schwarze Wanne', url: 'https://de.wikipedia.org/wiki/Schwarze_Wanne' }
        ]}
        regelwerke={[
          { title: 'DAfStb-Richtlinie: Wasserundurchlässige Bauwerke aus Beton (WU-Richtlinie:2017-12)', url: 'https://www.dafstb.de/' },
          { title: 'DIN EN 1992-1-1:2011-01 + NA:2013-04 (Eurocode 2, Abschnitt 7.3 Rissbreitenbegrenzung)' },
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN 18197:2018-01 (Abdichten von Fugen in Beton mit Fugenbändern)' },
          { title: 'DIN 18533-1:2017-07 (Abdichtung von erdberührten Bauteilen)' },
          { title: 'DIN EN 1504-5:2013-05 (Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken - Teil 5: Injektion von Beton)' }
        ]}
        literatur={[
          'Lohmeyer, G.; Ebeling, K.: Weiße Wannen – einfach und sicher. Planung und Konstruktion wasserundurchlässiger Bauwerke aus Beton. Düsseldorf: Verlag Bau+Technik 2018',
          'DAfStb-Heft 555: Erläuterungen zur DAfStb-Richtlinie Wasserundurchlässige Bauwerke aus Beton. Berlin: Beuth (Ausgabe passend zur Richtlinie 2017 manuell prüfen)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024'
        ]}
        formeln={
          activeTab === 'rechner'
            ? [
                {
                  formel: 'I = \\frac{h_w}{h}',
                  erklaerung: 'Druckgefälle I [-]: Wassersäule h_w [m] bezogen auf die Bauteildicke h [m]. Für die Selbstheilung: I ≤ 10 → w_k ≤ 0,20 mm; I ≤ 15 → 0,15 mm; I ≤ 25 → 0,10 mm (manuell prüfen).',
                  quelle: 'DAfStb-WU-Richtlinie 2017-12'
                },
                {
                  formel: 'h_{\\min} \\ge 240\\,\\text{mm} \\; (\\text{Wand, BK 1}) \\quad \\text{bzw.} \\quad h_{\\min} \\ge 250\\,\\text{mm} \\; (\\text{Bodenplatte, BK 1})',
                  erklaerung: 'Mindestbauteildicken in Beanspruchungsklasse 1 (Ortbeton und Elementwand 240 mm, Fertigteilwand 200 mm). In BK 2: Wand 200 mm (Ortbeton), Bodenplatte 150 mm.',
                  quelle: 'DAfStb-WU-Richtlinie 2017-12, Tabelle 1'
                }
              ]
            : activeTab === 'beton'
            ? [
                {
                  formel: 'Ca(OH)_2 + CO_2 \\xrightarrow{H_2O} CaCO_3 \\downarrow + H_2O',
                  erklaerung: 'Kristalline Carbonatisierungsreaktion der autogenen Selbstheilung: Im Porenwasser gelöstes Portlandit reagiert mit Kohlensäure zu schwerlöslichem Calcit, wodurch Trennrisse bis wk ≤ 0,15-0,20 mm dauerhaft zuwachsen.',
                  quelle: 'DAfStb Heft 555'
                },
                {
                  formel: '\\Delta T = T_{\\max} - T_{\\text{Rand}} \\le 15\\,\\text{K} \\dots 20\\,\\text{K}',
                  erklaerung: 'Zulässige Temperaturdifferenz im abfließenden Hydratationswärme-Zustand zur Vermeidung von oberflächennahen und durchgehenden Zwangs-Frührissen bei massigen WU-Querschnitten.',
                  quelle: 'Lehrwert (Praxis)'
                }
              ]
            : []
        }
      />
    </div>
  );
}
