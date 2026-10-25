// Ausgelagert aus src/modules/Dauerhaftigkeit.tsx (AP 5.2)
import { useState } from 'react';
import { Activity, AlertTriangle, Check } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';

export function BetonDauerhaftigkeitsSimulator() {
  const [k, setK] = useState<number>(2.5); // Karbonatisierungsbeiwert in mm/Wurzel(a)
  const [t, setT] = useState<number>(50);  // Zeit in Jahren
  const [cnom, setCnom] = useState<number>(30); // Betondeckung in mm
  const [showPath, setShowPath] = useState<boolean>(false);
  
  const presets = [
    { label: 'XC1 (trocken, z. B. Innenraum): c_nom = 20 mm', kValue: 4.5, cnomDefault: 20 },
    { label: 'XC2 (nass, selten trocken): c_nom = 35 mm', kValue: 1.0, cnomDefault: 35 },
    { label: 'XC3 (mäßig feucht): c_nom = 35 mm', kValue: 2.5, cnomDefault: 35 },
    { label: 'XC4 (Wechsel nass/trocken): c_nom = 40 mm', kValue: 1.5, cnomDefault: 40 },
  ];

  const handlePreset = (pK: number, pC: number) => {
    setK(pK);
    setCnom(pC);
  };

  const xCarb = k * Math.sqrt(t);
  const isDepassivated = xCarb >= cnom;
  
  const tCrit = k > 0 ? Math.round(Math.pow(cnom / k, 2)) : 999;
  const safeYearsRemaining = tCrit - t;

  return (
    <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-6">
      <div className="flex items-center gap-2.5 mb-2">
        <Activity className="text-shiraz w-5 h-5 animate-pulse" />
        <h4 className="font-bold text-slate-800 text-sm sm:text-base">
          Stahlbeton-Lebensdauersimulator: Karbonatisierungs-Prüfung
        </h4>
      </div>
      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        Nach dem Wurzel-Zeit-Gesetz dringt die Karbonatisierungsfront ein: s(t) = k·√t. stetig ein: <FormulaText text="$s(t) = k \cdot \sqrt{t}$" />. 
        Sinkt der pH-Wert des Betons von anfänglich &gt; 12,5 auf unter 9.0 (Depassivierung), entfällt der Rostschutz des Stahls.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">Schnell-Konfiguration (DIN EN 206)</span>
            <div className="flex flex-col gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePreset(p.kValue, p.cnomDefault)}
                  className="bg-slate-50 hover:bg-shiraz/5 border border-home-grau/30 hover:border-shiraz/35 py-1.5 px-2.5 rounded-lg text-left text-xs transition-all flex justify-between items-center text-slate-700 cursor-pointer"
                >
                  <span className="font-medium">{p.label}</span>
                  <span className="text-xs font-mono bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-600 whitespace-nowrap">
                    k = {formatDeWert(p.kValue)} / c = {formatDeWert(p.cnomDefault)}mm
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Karbonatisierungsbeiwert <FormulaText text="$k$" /></span>
                <span className="font-mono text-shiraz font-bold">{formatDeWert(k)} mm/√a</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={k}
                onChange={(e) => setK(parseFloat(e.target.value))}
                className="w-full accent-shiraz"
              />
              <span className="text-xs text-slate-400 block mt-0.5">Dichte Zemente (C35/45) weisen k ~ 1,0 auf; magere k &gt; 4.0.</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Betondeckung <FormulaText text="$c_{\text{nom}}$" /> (Soll)</span>
                <span className="font-mono text-slate-900 font-bold">{formatDeWert(cnom)} mm</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={cnom}
                onChange={(e) => setCnom(parseInt(e.target.value))}
                className="w-full accent-slate-700"
              />
              <span className="text-xs text-slate-400 block mt-0.5">Vorgeschrieben ist c_nom = c_min + Δc_dev mit c_min,dur z. B. 20–40 mm und Δc_dev = 15 mm (nur XC1: 10 mm) nach NA.</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Bauteilalter <FormulaText text="$t$" /></span>
                <span className="font-mono text-slate-900 font-bold">{formatDeWert(t)} Jahre</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={t}
                onChange={(e) => setT(parseInt(e.target.value))}
                className="w-full accent-shiraz"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Graphic and Verdict */}
        <div className="lg:col-span-7 bg-slate-50 border border-home-grau/30 p-4.5 rounded-xl flex flex-col gap-4">
          <div className="text-center bg-white p-2 text-xs rounded-lg border border-home-grau/30">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Rechnerische Karbonatisierungstiefe</span>
            <div className="text-sm font-bold text-slate-800 mt-1 flex justify-center items-center gap-1">
              <span>s(t) = {formatDeWert(k)} · √{formatDeWert(t)} = </span>
              <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded font-mono text-lg font-black">{formatDeWert(xCarb)} mm</span>
            </div>
          </div>

          {/* SVG cross-section */}
          <div className="w-full h-32 bg-stone-300 rounded-lg relative overflow-hidden border border-home-grau/30 shadow-inner flex items-center justify-center">
            {/* Concrete solid texturing */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '12px 12px' }} />

            {/* Uncarbonated Alkaline Concrete (Safe, Passive Zone pH >12.5) */}
            <div className="absolute inset-y-0 right-0 h-full bg-slate-400/20 flex items-center justify-end pr-3 select-none pointer-events-none transition-all duration-300" style={{ left: `${Math.min(100, (xCarb / 70) * 100)}%` }}>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block rotate-90 sm:rotate-0">
                Alkalisch (pH &gt; 12,5)
              </span>
            </div>

            {/* Carbonated Depassivated Zone (Acidified, pH < 9.0) */}
            <div className="absolute inset-y-0 left-0 bg-red-500/15 border-r border-dashed border-red-500 flex items-center pl-3 select-none pointer-events-none transition-all duration-300" style={{ width: `${Math.min(100, (xCarb / 70) * 100)}%` }}>
              {xCarb > 8 && (
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider block whitespace-nowrap">
                  CO₂-Einfluss (pH &lt; 9)
                </span>
              )}
            </div>

            {/* Concrete Surface Marker */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800">
              <span className="absolute left-1.5 top-1.5 text-[8px] font-bold text-slate-800 uppercase tracking-widest select-none pointer-events-none whitespace-nowrap">Oberfläche</span>
            </div>

            {/* Steel Reinforcement Rebar */}
            <div className="absolute inset-y-0 flex flex-col justify-around transition-all duration-300" style={{ left: `${(cnom / 70) * 100}%` }}>
              <div className={`w-6 h-6 rounded-full -translate-x-3 border-2 shadow flex items-center justify-center transition-all duration-300 ${
                isDepassivated ? 'bg-red-600 border-red-800 animate-pulse text-white' : 'bg-slate-500 border-home-grau/30 text-slate-100'
              }`}>
                <div className="absolute -top-4 font-mono text-xs font-bold text-slate-800 whitespace-nowrap">
                  Bewehrung (c = {formatDeWert(cnom)}mm)
                </div>
                <div className="text-xs font-black">Ø</div>
              </div>
            </div>

            {/* Scale lines */}
            <div className="absolute bottom-1 right-2 bg-white/70 px-1 rounded text-[8px] font-bold text-slate-500 select-none">
              Skalierung: 0 - 70 mm
            </div>
          </div>

          {/* Verdict Alert */}
          <div className={`p-3 rounded-xl border flex gap-3 ${
            isDepassivated 
              ? 'bg-rose-50 border-shiraz/20 text-slate-900' 
              : 'bg-slate-50 border-home-grau/30 text-slate-800'
          }`}>
            <div className="shrink-0 pt-0.5">
              {isDepassivated ? <AlertTriangle className="w-4 h-4 text-shiraz" /> : <Check className="w-4 h-4 text-slate-500" />}
            </div>
            <div>
              <p className="text-xs font-bold leading-normal">
                {isDepassivated 
                  ? 'Gefahr: Depassivierung eingetreten!' 
                  : 'Sicherer Bereich: Stahloberfläche passiviert.'}
              </p>
              <p className="text-xs text-slate-700 leading-normal mt-1">
                {isDepassivated ? (
                  <>
                    Nach ca. <strong>{formatDeWert(tCrit)} Jahren</strong> hat die saure Front die Bewehrung erreicht. 
                    Ohne korrosions-inhibierende Alkalität droht bei Feuchtezugriff <strong>Bewehrungsrost</strong> (Rostsprengung).
                  </>
                ) : (
                  <>
                    Die Alkalität schützt die Bewehrungsmatten verlässlich. 
                    Rechnerisch verbleibende Restschutzdauer vor Depassivierung: <strong>{safeYearsRemaining > 200 ? '>200' : safeYearsRemaining} Jahre</strong> (Schwelle bei t = {formatDeWert(tCrit)} Jahren).
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible calculation path */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <button
          onClick={() => setShowPath(!showPath)}
          className="text-xs font-bold text-shiraz hover:text-shiraz/80 flex items-center gap-1.5 cursor-pointer transition-all focus:outline-none"
        >
          <span>{showPath ? '▲ Formeln & Berechnungsschritte ausblenden' : '▼ Formeln & interaktiver Berechnungsweg (Schritt für Schritt)'}</span>
        </button>
        {showPath && (
          <div className="mt-3 bg-stone-50 border border-slate-200 rounded-xl p-4 space-y-4 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2">
            <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5">
              Schritt-für-Schritt Herleitung der Stahlbeton-Lebensdauer
            </h5>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Schritt 1: Bestimmung des Karbonatisierungsbeiwerts k ({formatDeWert(k)} mm/√a)</p>
                <p className="text-slate-600 leading-relaxed">
                  Der Widerstand des Zementsteins gegen neutralisierendes Kohlendioxid (CO₂) hängt maßgeblich von der Betondichte (niedriger w/z-Wert) und der Erhärtungszeit ab. Ihre aktuelle Auswahl simuliert einen Beiwert von <strong className="font-mono text-xs">{formatDeWert(k)} mm/√a</strong>.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Schritt 2: Das quadratische Zeitgesetz</p>
                <p className="text-slate-600 leading-relaxed">
                  Die Gasdiffusion im Porensystem verläuft nicht-linear. Die Lage der Carbonatisierungsfront s(t) nach {formatDeWert(t)} Jahren berechnet sich aus:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-slate-800 font-bold my-1 text-xs">
                  s({formatDeWert(t)}) = {formatDeZahl(k, 1)} · √{formatDeWert(t)} = {formatDeZahl(k, 1)} · {formatDeZahl(Math.sqrt(t), 3)} = {formatDeZahl(xCarb, 1)} mm
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Schritt 3: Abgleich mit der installierten Betondeckung c_nom ({formatDeWert(cnom)} mm)</p>
                <p className="text-slate-600 leading-relaxed">
                  Damit der Korrosionsschutz aktiv bleibt, muss die carbonatisierte Schichtdicke kleiner sein als die Deckungstiefe (s(t) &lt; c_nom).
                  {isDepassivated ? (
                    <span className="text-red-700 block font-semibold mt-1">
                      ➔ Die Carbonatisierungsfront ({formatDeZahl(xCarb, 1)} mm) hat den schützenden Betonbereich um {formatDeZahl(xCarb - cnom, 1)} mm überschritten. Die Bewehrung ist depassiviert und rostgefährdet!
                    </span>
                  ) : (
                    <span className="text-emerald-700 block font-semibold mt-1">
                      ➔ Die hochalkalische Restpufferzone vor dem reinen Stahl beträgt noch {formatDeZahl(cnom - xCarb, 1)} mm. Der passive Rostschutz steht sicher.
                    </span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Schritt 4: Bestimmung des rechnerischen Depassivierungszeitpunkts t_crit</p>
                <p className="text-slate-600 leading-relaxed">
                  Der genaue Zeitpunkt, an dem die Carbonatisierungsfront exakt die Tiefe der Bewehrung berührt (s(t) = c_nom), berechnet sich durch Umstellen der Formel nach t:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-slate-800 font-bold my-1 text-xs">
                  t_crit = (c_nom / k)² = ({formatDeWert(cnom)} / {formatDeWert(k)})² = {formatDeWert(tCrit)} Jahre
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Rechnerisch verbleibende Restlebensdauer vor Depassivierung: {safeYearsRemaining > 0 ? (
                    <span><strong>{safeYearsRemaining} Jahre</strong>.</span>
                  ) : (
                    <span>Das Bauteil befindet sich bereits seit <strong>{Math.abs(safeYearsRemaining)} Jahren</strong> im ungeschützten Zustand.</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Schritt 5: Konstruktive und betontechnologische Stellschrauben</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                  <li><strong>Geringerer w/z-Wert (dichterer Zementstein):</strong> Reduziert das kapillare Porenvolumen und senkt den k-Wert drastisch (z. B. von 4,5 auf 1,5 mm/√a).</li>
                  <li><strong>Erhöhter Vorhaltemaß dc:</strong> Ein Erhöhen der Schalungspräzision ermöglicht dickere Bauteildeckungen (z.B. 35mm anstelle von 15mm), was die t_crit-Schutzdauer quadratisch vergrößert.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
