import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { Thermometer } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function Frischbetontemperatur() {
  // Massen in kg/m³
  const [mZement, setMZement] = useState(350);
  const [mWasser, setMWasser] = useState(160); // Zugabewasser (flüssig)
  const [mEis, setMEis] = useState(0); // Scherbeneis
  const [mGestein, setMGestein] = useState(1850); // Trockene Gesteinskörnung
  const [feuchteGestein, setFeuchteGestein] = useState(3.0); // Eigenfeuchte in %

  // Temperaturen in °C
  const [tZement, setTZement] = useState(60);
  const [tWasser, setTWasser] = useState(15);
  const [tGestein, setTGestein] = useState(20);

  // Spezifische Wärmekapazitäten in kJ/(kg*K)
  const cZement = 0.84;
  const cWasser = 4.18;
  const cGestein = 0.84;
  const lEis = 334; // Schmelzenthalpie Eis in kJ/kg (bei 0°C)

  const results = useMemo(() => {
    // Wasser in der Gesteinskörnung
    const mEigenfeuchte = mGestein * (feuchteGestein / 100);
    
    // Wärmekapazitäten * Massen
    const wZement = cZement * mZement;
    const wWasser = cWasser * mWasser;
    const wGestein = cGestein * mGestein;
    const wEigenfeuchte = cWasser * mEigenfeuchte;
    
    // Wärmekapazität des geschmolzenen Eises (wird zu Wasser)
    const wEisWasser = cWasser * mEis;

    const sumW = wZement + wWasser + wGestein + wEigenfeuchte + wEisWasser;

    // Energiebilanz (Eis wird bei 0°C zugegeben, entzieht Schmelzenergie)
    // Die Eigenfeuchte hat die gleiche Temperatur wie das Gestein
    const energieEintrag = wZement * tZement + wWasser * tWasser + wGestein * tGestein + wEigenfeuchte * tGestein;
    const schmelzEnergie = mEis * lEis;

    // Frischbetontemperatur
    let tFrischbeton = (energieEintrag - schmelzEnergie) / sumW;
    
    // Wenn die Temperatur unter 0 fällt, reicht die Energie nicht um alles Eis zu schmelzen
    if (tFrischbeton < 0) tFrischbeton = 0;

    // Anteile an der thermischen Masse (für Visualisierung)
    const totalThermalMass = sumW;

    return {
      tFrischbeton,
      mEigenfeuchte,
      anteilZement: (wZement / totalThermalMass) * 100,
      anteilWasser: ((wWasser + wEisWasser + wEigenfeuchte) / totalThermalMass) * 100,
      anteilGestein: (wGestein / totalThermalMass) * 100,
      kuehlleistungEis: schmelzEnergie,
    };
  }, [mZement, mWasser, mEis, mGestein, feuchteGestein, tZement, tWasser, tGestein]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><Thermometer className="text-shiraz" />
          Frischbetontemperatur
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Frischbetontemperatur ergibt sich aus der Mischung der Ausgangsstoffe unter Berücksichtigung ihrer Massen, 
          Temperaturen und spezifischen Wärmekapazitäten. Besonders im Sommer ist die Steuerung der 
          Frischbetontemperatur wichtig. Die Zugabe von Scherbeneis ist dabei extrem effektiv, da die Schmelzenthalpie 
          des Eises dem Gemisch massiv Wärmeenergie entzieht.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Zement</h3>
              <div className="space-y-4">
                <Slider
                  label="Masse (m_z)" info="Masse des Zements."
                  value={mZement}
                  min={200}
                  max={500}
                  step={10}
                  onChange={(e) => setMZement(Number(e.target.value))}
                  unit="kg/m³"
                />
                <Slider  label="Temperatur (T_z)"
                  value={tZement}
                  min={10}
                  max={80}
                  step={1}
                  onChange={(e) => setTZement(Number(e.target.value))}
                  unit="°C"
                  info="Zement kann durch den Mahlprozess im Silo sehr warm sein (oft 50-70°C)."
                />
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Wasser & Eis</h3>
              <div className="space-y-4">
                <Slider
                  label="Zugabewasser flüssig (m_w)" info="Masse des flüssig zugegebenen Wassers."
                  value={mWasser}
                  min={50}
                  max={250}
                  step={5}
                  onChange={(e) => setMWasser(Number(e.target.value))}
                  unit="kg/m³"
                />
                <Slider
                  label="Temperatur Wasser (T_w)" 
                  value={tWasser}
                  min={2}
                  max={40}
                  step={1}
                  onChange={(e) => setTWasser(Number(e.target.value))}
                  unit="°C"
                />
                <div className="pt-4 border-t border-home-grau/30">
                  <Slider info="Masse des zugegebenen Eises zur Kühlung." label="Scherbeneis (m_eis)"
                    value={mEis}
                    min={0}
                    max={100}
                    step={5}
                    onChange={(e) => setMEis(Number(e.target.value))}
                    unit="kg/m³"
                    
                  />
                  <div className="flex justify-between text-sm mt-2 font-medium text-text-main/80">
                    <span>Gesamtwasser (Zugabe + Eis + Eigenfeuchte):</span>
                    <span>{formatDeZahl((mWasser + mEis + results.mEigenfeuchte), 1)} kg/m³</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Gesteinskörnung</h3>
              <div className="space-y-4">
                <Slider
                  label="Masse trocken (m_g)" info="Masse der trockenen Gesteinskörnung."
                  value={mGestein}
                  min={1500}
                  max={2200}
                  step={50}
                  onChange={(e) => setMGestein(Number(e.target.value))}
                  unit="kg/m³"
                />
                <Slider
                  label="Eigenfeuchte" info="Wassergehalt der Gesteinskörnung. Dieses Wasser hat die gleiche Temperatur wie das Gestein."
                  value={feuchteGestein}
                  min={0}
                  max={10}
                  step={0.5}
                  onChange={(e) => setFeuchteGestein(Number(e.target.value))}
                  unit="%"
                />
                <Slider  label="Temperatur (T_g)"
                  value={tGestein}
                  min={-5}
                  max={40}
                  step={1}
                  onChange={(e) => setTGestein(Number(e.target.value))}
                  unit="°C"
                  info="Entspricht meist der Umgebungstemperatur bei Außenlagerung."
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col items-center justify-center h-48 relative overflow-hidden">
              {mEis > 0 && (
                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Eiskühlung aktiv (-{formatDeZahl((results.kuehlleistungEis / 1000), 1)} MJ)
                </div>
              )}
              <h3 className="text-sm font-bold text-text-main/70 mb-2">Erwartete Frischbetontemperatur</h3>
              <div className={`text-5xl font-bold ${results.tFrischbeton > 30 ? 'text-torch-red' : results.tFrischbeton < 5 ? 'text-blue-600' : 'text-emerald-600'}`}>
                {formatDeZahl(results.tFrischbeton, 1)} °C
              </div>
              <p className="text-sm text-text-main/60 mt-4 text-center max-w-xs">
                {results.tFrischbeton > 30 && 'Achtung: Temperatur > 30°C. Gefahr von zu schnellem Ansteifen und Festigkeitseinbußen.'}
                {results.tFrischbeton < 5 && 'Achtung: Temperatur < 5°C. Hydratation kommt nahezu zum Erliegen. Frostgefahr!'}
                {results.tFrischbeton >= 5 && results.tFrischbeton <= 30 && 'Temperatur im normalen Verarbeitungsbereich (optimal 15-25°C).'}
              </p>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Einfluss der Ausgangsstoffe auf die Temperatur</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Dieser Balken zeigt, wie stark die einzelnen Stoffe die thermische Masse dominieren (Produkt aus Masse und Wärmekapazität).
          </p>
        </div>
              <div className="w-full h-8 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${results.anteilZement}%` }} 
                  className="bg-slate-400 flex items-center justify-center text-xs text-white font-medium"
                  title={`Zement: ${formatDeZahl(results.anteilZement, 1)}%`}
                >
                  {results.anteilZement > 10 && 'Zement'}
                </div>
                <div 
                  style={{ width: `${results.anteilWasser}%` }} 
                  className="bg-blue-400 flex items-center justify-center text-xs text-white font-medium"
                  title={`Wasser (+Eis): ${formatDeZahl(results.anteilWasser, 1)}%`}
                >
                  {results.anteilWasser > 10 && 'Wasser'}
                </div>
                <div 
                  style={{ width: `${results.anteilGestein}%` }} 
                  className="bg-stone-500 flex items-center justify-center text-xs text-white font-medium"
                  title={`Gestein: ${formatDeZahl(results.anteilGestein, 1)}%`}
                >
                  {results.anteilGestein > 10 && 'Gestein'}
                </div>
              </div>
              <div className="flex justify-between text-xs text-text-main/60 mt-2">
                <span>c_z = 0,84 kJ/(kg·K)</span>
                <span>c_w = 4,18 kJ/(kg·K)</span>
                <span>c_g = 0,84 kJ/(kg·K)</span>
              </div>
            </div>

            {/* Visualisierung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Energiebilanz</h3>
              <div className="relative w-full h-40 bg-off-white rounded-lg border border-home-grau/30 overflow-hidden flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid meet">
                  {/* Mischer */}
                  <path d="M 150 120 L 250 120 L 270 60 L 130 60 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                  <path d="M 130 60 Q 200 80 270 60" fill="#94a3b8" />
                  <text x="200" y="100" fontSize="14" fill="#334155" textAnchor="middle" fontWeight="bold">Mischer</text>
                  
                  {/* Zement Input */}
                  <path d="M 100 20 L 140 50" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow)" />
                  <circle cx="90" cy="15" r="12" fill="#slate-400" />
                  <text x="90" y="19" fontSize="10" fill="white" textAnchor="middle">Z</text>
                  <text x="60" y="20" fontSize="10" fill="#A3113E" textAnchor="end">{formatDeWert(tZement)}°C</text>

                  {/* Gestein Input */}
                  <path d="M 200 15 L 200 50" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrow)" />
                  <circle cx="200" cy="10" r="12" fill="#stone-500" />
                  <text x="200" y="14" fontSize="10" fill="white" textAnchor="middle">G</text>
                  <text x="220" y="15" fontSize="10" fill="#64748b">{formatDeWert(tGestein)}°C</text>

                  {/* Wasser/Eis Input */}
                  <path d="M 300 20 L 260 50" stroke="#475569" strokeWidth="3" markerEnd="url(#arrow)" />
                  <circle cx="310" cy="15" r="12" fill="#475569" />
                  <text x="310" y="19" fontSize="10" fill="white" textAnchor="middle">W</text>
                  <text x="330" y="20" fontSize="10" fill="#475569">{formatDeWert(tWasser)}°C</text>
                  
                  {mEis > 0 && (
                    <>
                      <path d="M 330 40 L 270 60" stroke="#64748b" strokeWidth="3" strokeDasharray="4 2" markerEnd="url(#arrow)" />
                      <rect x="330" y="30" width="16" height="16" fill="#cbd5e1" stroke="#475569" />
                      <text x="338" y="42" fontSize="10" fill="#475569" textAnchor="middle">E</text>
                      <text x="355" y="42" fontSize="10" fill="#475569">0°C</text>
                    </>
                  )}

                  {/* Output */}
                  <path d="M 200 120 L 200 150" stroke={results.tFrischbeton > 30 ? "#A3113E" : results.tFrischbeton < 5 ? "#475569" : "#475569"} strokeWidth="4" markerEnd="url(#arrow)" />
                  <text x="220" y="145" fontSize="14" fill={results.tFrischbeton > 30 ? "#A3113E" : results.tFrischbeton < 5 ? "#475569" : "#475569"} fontWeight="bold">{formatDeZahl(results.tFrischbeton, 1)}°C</text>

                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter 
        weblinks={[
          { title: "Beton.wiki: Frischbetontemperatur", url: "https://beton.wiki/index.php?title=Frischbetontemperatur" }, 
          { title: "Zement-Merkblätter Beton.org", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }
        ]}
        wikipedia={[
          { title: 'Frischbeton', url: 'https://de.wikipedia.org/wiki/Frischbeton' },
          { title: 'Richmannsche Mischungsregel', url: 'https://de.wikipedia.org/wiki/Richmannsche_Mischungsregel' }
        ]}
        regelwerke={[
          { title: 'DIN EN 206 / DIN 1045-2 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität: Grenztemperaturen +5°C bis +30°C)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+206' },
          { title: 'DIN EN 13670 / DIN 1045-3 (Ausführung von Tragwerken aus Beton - Betonieren bei kühler und heißer Witterung)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+13670' },
          { title: 'ZTV-ING (Grenztemperaturen für Ingenieurbauwerke)', url: 'https://www.bast.de/' }
        ]}
        literatur={[
          'Grübl, P.; Weigler, H.; Karl, S. (2001): Beton - Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
          'Verein Deutscher Zementwerke (VDZ): Zement-Taschenbuch (52. Ausgabe, Verlag Bau+Technik)',
          'Springenschmid, R. (1998): Betonieren bei extremer Witterung (Bauverlag)'
        ]}
        formeln={[
          {
            formel: 'T_{FB} = \\frac{c_z m_z T_z + c_w m_w T_w + c_g m_g T_g + c_w m_{feuchte} T_g - m_{eis} \\cdot L_{eis}}{c_z m_z + c_w (m_w + m_{feuchte} + m_{eis}) + c_g m_g}',
            erklaerung: 'Erweiterte Richmannsche Mischungsregel unter Einbeziehung der Gesteinseigenfeuchte und der Schmelzenthalpie von Scherbeneis (Leis = 334 kJ/kg). Normative Richtgrenzen: mind. +5 °C (Winter) bis max. +30 °C (Sommer).',
            quelle: 'DIN EN 206 / VDZ-Zement-Taschenbuch'
          }
        ]}
      />
    </div>
  );
}
