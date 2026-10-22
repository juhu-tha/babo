import { formatDeZahl } from '@/src/utils/numberFormat';
import { Droplets } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { DIN1045_3_NACHBEHANDLUNG } from '@/src/data/normParams';

export default function Nachbehandlung() {
  const [tempAir, setTempAir] = useState(25); // °C
  const [tempConcrete, setTempConcrete] = useState(25); // °C
  const [rh, setRh] = useState(50); // %
  const [windSpeed, setWindSpeed] = useState(15); // km/h

  // States für Nachbehandlungsdauer
  const [festigkeitsEntwicklung, setFestigkeitsEntwicklung] = useState<'schnell'|'mittel'|'langsam'|'sehr_langsam'>('mittel');
  const [expositionsklasse, setExpositionsklasse] = useState<'x0_xc1'|'andere'>('andere');
  const [oberflaechentemp, setOberflaechentemp] = useState<'>=10'|'5-10'|'<5'>('>=10');

  // Evaporation rate formula (ACI 305R metric)
  // E = 5 * ([Tc + 18]^2.5 - r * [Ta + 18]^2.5) * (V + 4) * 10^-6
  const evaporationRate = useMemo(() => {
    const r = rh / 100;
    const Tc = tempConcrete;
    const Ta = tempAir;
    const V = windSpeed;
    
    const term1 = Math.pow(Tc + 18, 2.5);
    const term2 = r * Math.pow(Ta + 18, 2.5);
    let E = 5 * (term1 - term2) * (V + 4) * Math.pow(10, -6);
    
    return Math.max(0, E);
  }, [tempAir, tempConcrete, rh, windSpeed]);

  const isCritical = evaporationRate > 1.0;

  const curingTime = useMemo(() => {
    if (oberflaechentemp === '<5') return -1; // Sondermaßnahmen erforderlich

    let baseTime = 0;
    if (festigkeitsEntwicklung === 'schnell') {
      baseTime = expositionsklasse === 'x0_xc1' ? 1 : 2;
    } else if (festigkeitsEntwicklung === 'mittel') {
      baseTime = expositionsklasse === 'x0_xc1' ? 1 : 3;
    } else if (festigkeitsEntwicklung === 'langsam') {
      baseTime = expositionsklasse === 'x0_xc1' ? 2 : 5;
    } else if (festigkeitsEntwicklung === 'sehr_langsam') {
      baseTime = expositionsklasse === 'x0_xc1' ? 3 : 10;
    }

    if (oberflaechentemp === '5-10') {
      return baseTime * 2;
    }
    return baseTime;
  }, [festigkeitsEntwicklung, expositionsklasse, oberflaechentemp]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Droplets className="text-shiraz" /> Nachbehandlung &amp; Verdunstung
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300">
            Berechnet nach DIN EN 1992-1-1 + NA (DE)
          </span>
        </div>
      

        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Nachbehandlung schützt den jungen Beton vor zu schnellem Austrocknen. 
            Wenn Wasser schneller von der Oberfläche verdunstet, als es aus dem Inneren nachgeliefert wird (Bluten), 
            entstehen kapillare Zugspannungen und es kommt zu <strong>Frühschwindrissen</strong> (plastisches Schwinden).
            Eine Verdunstungsrate &gt; 1,0 kg/m²h gilt als kritisch.
          </p>
        </div>

        <Slider
          label="Lufttemperatur (T_a)"
          min={5} max={40} step={1}
          value={tempAir} unit="°C"
          info="Temperatur der Umgebungsluft."
          onChange={(e) => setTempAir(Number(e.target.value))}
        />
        
        <Slider
          label="Betontemperatur (T_c)"
          min={5} max={40} step={1}
          value={tempConcrete} unit="°C"
          
          onChange={(e) => setTempConcrete(Number(e.target.value))}
        />

        <Slider
          label="Relative Luftfeuchte (r)"
          min={10} max={100} step={1}
          value={rh} unit="%"
          info="Relative Luftfeuchtigkeit der Umgebung. Trockene Luft (niedriger Wert) erhöht die Verdunstung."
          onChange={(e) => setRh(Number(e.target.value))}
        />

        <Slider
          label="Windgeschwindigkeit (V)"
          min={0} max={40} step={1}
          value={windSpeed} unit="km/h"
          
          onChange={(e) => setWindSpeed(Number(e.target.value))}
        />

        <div className={`mt-4 p-4 rounded-xl border ${isCritical ? 'bg-torch-red/10 border-torch-red/30' : 'bg-emerald-50 border-emerald-200'}`}>
          <h3 className="text-sm font-bold text-text-main mb-2">Ergebnis</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-main/80">Verdunstungsrate:</span>
            <span className={`text-xl font-bold ${isCritical ? 'text-torch-red' : 'text-emerald-600'}`}>
              {formatDeZahl(evaporationRate, 2)} kg/m²h
            </span>
          </div>
          <p className="text-xs text-text-main/70">
            {isCritical 
              ? 'Achtung: Sehr hohes Risiko für Frühschwindrisse! Sofortige Nachbehandlung (z.B. Folie, Nachbehandlungsmittel) erforderlich.' 
              : 'Geringes bis mittleres Risiko. Normgerechte Nachbehandlung ist dennoch erforderlich.'}
          </p>
        </div>
      </div>

      <div className="lg:col-span-6 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main">Mindestdauer der Nachbehandlung</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Nach DIN EN 13670 / DIN 1045-3 in Abhängigkeit der Festigkeitsentwicklung (r = f<sub>cm,2</sub> / f<sub>cm,28</sub>).
          </p>
        </div>

          <div className="grid grid-cols-1 gap-4 mt-2">
            <div>
              <label className="block text-sm font-semibold text-text-main mb-1">Festigkeitsentwicklung (r)</label>
              <select 
                className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-off-white focus:outline-none focus:ring-1 focus:ring-middle-blue/50"
                value={festigkeitsEntwicklung}
                onChange={(e) => setFestigkeitsEntwicklung(e.target.value as any)}
              >
                <option value="schnell">Schnell (r ≥ 0,50)</option>
                <option value="mittel">Mittel (r ≥ 0,30)</option>
                <option value="langsam">Langsam (r ≥ 0,15)</option>
                <option value="sehr_langsam">Sehr langsam (r &lt; 0,15)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1">Expositionsklasse</label>
              <select 
                className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-off-white focus:outline-none focus:ring-1 focus:ring-middle-blue/50"
                value={expositionsklasse}
                onChange={(e) => setExpositionsklasse(e.target.value as any)}
              >
                <option value="x0_xc1">X0, XC1</option>
                <option value="andere">Andere (XC2-XC4, XD, XS, XF, XA)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1">Oberflächentemperatur</label>
              <select 
                className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-off-white focus:outline-none focus:ring-1 focus:ring-middle-blue/50"
                value={oberflaechentemp}
                onChange={(e) => setOberflaechentemp(e.target.value as any)}
              >
                <option value=">=10">T ≥ 10 °C</option>
                <option value="5-10">5 °C ≤ T &lt; 10 °C</option>
                <option value="<5">T &lt; 5 °C (Winterbau)</option>
              </select>
            </div>
          </div>

          <div className={`mt-2 p-4 rounded-xl border ${curingTime === -1 ? 'bg-torch-red/10 border-torch-red/30' : 'bg-off-white border-shiraz/20'}`}>
            <h3 className="text-sm font-bold text-text-main mb-2">Ergebnis (Nachbehandlungsdauer)</h3>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-text-main/80">Erforderliche Mindestdauer:</span>
              <span className={`text-xl font-bold ${curingTime === -1 ? 'text-torch-red' : 'text-shiraz'}`}>
                {curingTime === -1 ? 'Sondermaßnahmen!' : `${curingTime} ${curingTime === 1 ? 'Tag' : 'Tage'}`}
              </span>
            </div>
            {curingTime === -1 ? (
              <p className="text-xs text-torch-red mt-2 leading-relaxed">
                Bei Oberflächentemperaturen unter 5°C kommt die Festigkeitsentwicklung nahezu zum Erliegen. Beton darf nicht gefrieren! Es sind <strong>Winterbaumaßnahmen</strong> (Wärmedämmung, Beheizung) erforderlich.
              </p>
            ) : oberflaechentemp === '5-10' ? (
              <p className="text-xs text-text-main/70 mt-2 leading-relaxed">
                Aufgrund der niedrigen Oberflächentemperatur (5-10 °C) wurde die Nachbehandlungsdauer gemäß Norm <strong>verdoppelt</strong>.
              </p>
            ) : null}
          </div>

          <details className="mt-2 group cursor-pointer border border-home-grau/30 rounded-lg bg-off-white">
            <summary className="p-3 font-semibold text-sm text-text-main">
              Normtabelle anzeigen (T ≥ 10 °C)
            </summary>
            <div className="p-3 pt-0 overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/30">
                    <th className="py-2 pr-1 font-bold text-text-main">Entwicklung</th>
                    <th className="py-2 px-1 font-bold text-text-main text-center">X0, XC1</th>
                    <th className="py-2 pl-1 font-bold text-text-main text-center">Andere Klassen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-home-grau/10">
                    <td className="py-2 pr-1">Schnell (r ≥ 0,5)</td>
                    <td className="py-2 px-1 text-center">1 Tag</td>
                    <td className="py-2 pl-1 text-center font-bold text-shiraz">2 Tage</td>
                  </tr>
                  <tr className="border-b border-home-grau/10">
                    <td className="py-2 pr-1">Mittel (r ≥ 0,3)</td>
                    <td className="py-2 px-1 text-center">1 Tag</td>
                    <td className="py-2 pl-1 text-center font-bold text-shiraz">3 Tage</td>
                  </tr>
                  <tr className="border-b border-home-grau/10">
                    <td className="py-2 pr-1">Langsam (r ≥ 0,15)</td>
                    <td className="py-2 px-1 text-center">2 Tage</td>
                    <td className="py-2 pl-1 text-center font-bold text-shiraz">5 Tage</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-1">Sehr langsam (r &lt; 0,15)</td>
                    <td className="py-2 px-1 text-center">3 Tage</td>
                    <td className="py-2 pl-1 text-center font-bold text-shiraz">10 Tage</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
        </div>

        {/* Schematische Darstellung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Verdunstung</h3>
          <div className="relative w-full h-48 bg-off-white rounded-lg border border-home-grau/30 overflow-hidden flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
              {/* Beton */}
              <rect x="50" y="120" width="300" height="80" fill="#cbd5e1" />
              <text x="200" y="160" fontSize="14" fill="#334155" textAnchor="middle" fontWeight="bold">Frischbeton (T_c)</text>

              {/* Sonne / Wärme */}
              <circle cx="80" cy="40" r="20" fill="#cbd5e1" />
              <path d="M 80 10 L 80 0 M 80 70 L 80 80 M 50 40 L 40 40 M 110 40 L 120 40 M 58 18 L 50 10 M 102 62 L 110 70 M 58 62 L 50 70 M 102 18 L 110 10" stroke="#cbd5e1" strokeWidth="2" />
              <text x="120" y="45" fontSize="12" fill="#475569" fontWeight="bold">T_a</text>

              {/* Wind */}
              <path d="M 250 40 Q 280 30 320 40" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" markerEnd="url(#arrow-wind)" />
              <path d="M 230 60 Q 270 50 340 60" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" markerEnd="url(#arrow-wind)" />
              <path d="M 260 80 Q 290 70 330 80" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" markerEnd="url(#arrow-wind)" />
              <text x="350" y="65" fontSize="12" fill="#64748b" fontWeight="bold">Wind (V)</text>

              {/* Verdunstung (Wasserdampf) */}
              <path d="M 150 120 Q 140 90 160 60" fill="none" stroke="#475569" strokeWidth="3" opacity="0.6" markerEnd="url(#arrow-water)" />
              <path d="M 200 120 Q 210 80 190 50" fill="none" stroke="#475569" strokeWidth="3" opacity="0.6" markerEnd="url(#arrow-water)" />
              <path d="M 250 120 Q 240 90 260 60" fill="none" stroke="#475569" strokeWidth="3" opacity="0.6" markerEnd="url(#arrow-water)" />
              
              <text x="200" y="30" fontSize="12" fill="#334155" textAnchor="middle" fontWeight="bold">Verdunstung (E)</text>
              <text x="200" y="110" fontSize="10" fill="#334155" textAnchor="middle">Luftfeuchte (r)</text>

              {/* Rissgefahr */}
              <path d="M 180 120 L 185 135 L 175 145 L 180 160" fill="none" stroke="#A3113E" strokeWidth="2" />
              <path d="M 220 120 L 215 130 L 225 140 L 220 150" fill="none" stroke="#A3113E" strokeWidth="2" />

              <defs>
                <marker id="arrow-wind" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                </marker>
                <marker id="arrow-water" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" opacity="0.6" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>

        <ModuleFooter 
          weblinks={[
            { title: "Beton.wiki: Nachbehandlung", url: "https://beton.wiki/index.php?title=Nachbehandlung" }, 
            { title: "Zement-Merkblatt B8: Nachbehandlung von Beton", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }
          ]} 
          wikipedia={[
            { title: 'Nachbehandlung (Beton)', url: 'https://de.wikipedia.org/wiki/Nachbehandlung' },
            { title: 'Frühschwinden', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' }
          ]}
          regelwerke={[
            { title: 'DIN EN 13670 / DIN 1045-3 (Ausführung von Tragwerken aus Beton - Nachbehandlungsklassen)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+13670' },
            { title: 'DIN EN 206 / DIN 1045-2 (Beton: Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+206' },
            { title: 'ACI 305R: Guide to Hot Weather Concreting (Verdunstungsnomogramm)', url: 'https://www.concrete.org/' },
            { title: 'DBV-Merkblatt: Nachbehandlung von Beton (Deutscher Beton- und Bautechnik-Verein)', url: 'https://www.betonverein.de/' }
          ]}
          literatur={[
            'Grübl, P.; Weigler, H.; Karl, S. (2001): Beton - Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
            'Neville, A. M. (2011): Properties of Concrete (5. Auflage, Pearson Education)',
            'Springenschmid, R. (1998): Vermeidung von Rissen in jungen Betonbauteilen (Bauverlag)'
          ]}
          formeln={[
            {
              formel: 'E = 5 \\cdot \\left[ (T_c + 18)^{2{,}5} - r \\cdot (T_a + 18)^{2{,}5} \\right] \\cdot (V + 4) \\cdot 10^{-6}',
              erklaerung: 'Verdunstungsrate E [kg/(m²·h)] nach ACI 305R: Tc = Betontemperatur [°C], Ta = Lufttemperatur [°C], r = relative Feuchte [-], V = Windgeschwindigkeit [km/h]. Bei E > 1,0 kg/(m²·h) droht akute Frühschwindrissgefahr.',
              quelle: 'ACI 305R-10'
            },
            {
              formel: 'r = \\frac{f_{cm,2}}{f_{cm,28}}',
              erklaerung: 'Festigkeitsentwicklungsverhältnis r nach DIN EN 13670: schnell (r >= 0.50), mittel (0.30 <= r < 0.50), langsam (0.15 <= r < 0.30), sehr langsam (r < 0.15).',
              quelle: 'DIN EN 13670 Tab. 4'
            },
            {
              formel: 'f_{ck,t} \\ge 0{,}50 \\cdot f_{ck}',
              erklaerung: 'Ziel-Kriterium der Nachbehandlung: Die Betonrandzone muss mindestens 50 % der charakteristischen Zylinderdruckfestigkeit erreicht haben, um ausreichende Dauerhaftigkeit und Dichtigkeit zu gewährleisten.',
              quelle: 'DIN EN 13670 / DIN 1045-3'
            }
          ]}
        />
      </div>
    </div>
  );
}
