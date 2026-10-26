import { formatDeZahl } from '@/src/utils/numberFormat';
import { Thermometer } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Bar } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import inhalt from '@/content/waermeeigenschaften/Waermeeigenschaften.json';
import { MdText } from '@/src/components/inhalt/MdText';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PRESET_MATERIALS = {
  'Beton': { lambda: 2.0, rho: 2400, c: 1000 },
  'Stahl': { lambda: 50.0, rho: 7850, c: 450 },
  'Holz (Fichte)': { lambda: 0.13, rho: 500, c: 1600 },
  'Ziegelmauerwerk': { lambda: 0.8, rho: 1600, c: 1000 },
  'Dämmstoff (EPS)': { lambda: 0.035, rho: 20, c: 1450 },
  'Steinwolle': { lambda: 0.035, rho: 100, c: 840 },
  'Holzfaser': { lambda: 0.040, rho: 160, c: 2100 },
  'Zellulose': { lambda: 0.040, rho: 50, c: 2100 },
  'Wasser': { lambda: 0.6, rho: 1000, c: 4180 },
  'Luft': { lambda: 0.026, rho: 1.2, c: 1005 },
};

export default function Waermeeigenschaften() {
  const [selectedPreset, setSelectedPreset] = useState('Beton');
  const [lambda, setLambda] = useState(2.0); // W/(mK)
  const [rho, setRho] = useState(2400); // kg/m³
  const [c, setC] = useState(1000); // J/(kgK)

  // Dämmstoffe states
  const [targetU, setTargetU] = useState(0.20); // W/(m²K)
  const [baseThickness, setBaseThickness] = useState(24); // cm
  const [baseLambda, setBaseLambda] = useState(1.0); // W/(mK)

  const daemmMaterials = useMemo(() => inhalt.daten.Waermeeigenschaften, []);

  // Update sliders when preset changes
  useEffect(() => {
    if (selectedPreset !== 'Benutzerdefiniert') {
      const mat = PRESET_MATERIALS[selectedPreset as keyof typeof PRESET_MATERIALS];
      if (mat) {
        setLambda(mat.lambda);
        setRho(mat.rho);
        setC(mat.c);
      }
    }
  }, [selectedPreset]);

  // If sliders change manually, set preset to custom
  const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    setter(value);
    setSelectedPreset('Benutzerdefiniert');
  };

  const results = useMemo(() => {
    // Wärmespeicherkapazität (volumenbezogen) C = rho * c [J/(m³K)]
    const capVol = rho * c; 
    const capVolMJ = capVol / 1e6; // MJ/(m³K)

    // Temperaturleitfähigkeit a = lambda / (rho * c) [m²/s]
    const a = lambda / capVol;
    const a_mm2_s = a * 1e6; // mm²/s

    // Wärmeeindringfähigkeit b = sqrt(lambda * rho * c) [J/(m²K*sqrt(s))]
    const b = Math.sqrt(lambda * rho * c);

    // Kontakttemperatur (Haut berührt Material)
    // T_m = (b_skin * T_skin + b_mat * T_mat) / (b_skin + b_mat)
    const b_skin = 1100; // J/(m²K*sqrt(s))
    const T_skin = 33; // °C
    const T_mat = 20; // °C
    const T_contact = (b_skin * T_skin + b * T_mat) / (b_skin + b);

    // Chart Data: Vergleich der Wärmeeindringfähigkeit (b)
    const chartLabels = Object.keys(PRESET_MATERIALS);
    const chartDataB = chartLabels.map(key => {
      const mat = PRESET_MATERIALS[key as keyof typeof PRESET_MATERIALS];
      return Math.sqrt(mat.lambda * mat.rho * mat.c);
    });

    // Füge aktuelles Material hinzu, falls benutzerdefiniert
    if (selectedPreset === 'Benutzerdefiniert') {
      chartLabels.push('Aktuell');
      chartDataB.push(b);
    }

    return {
      capVolMJ,
      a_mm2_s,
      b,
      T_contact,
      chartData: {
        labels: chartLabels,
        datasets: [
          {
            label: inhalt.werte.wärmeeindringfähigkeitBJM,
            data: chartDataB,
            backgroundColor: chartLabels.map(l => l === selectedPreset || (l === 'Aktuell' && selectedPreset === 'Benutzerdefiniert') ? '#A3113E' : '#475569'),
            borderRadius: 4,
          }
        ]
      }
    };
  }, [lambda, rho, c, selectedPreset]);

  const daemmResults = useMemo(() => {
    const rSiSe = 0.17; 
    const rBase = (baseThickness / 100) / baseLambda;
    const rTotalReq = 1 / targetU;
    const rInsReq = rTotalReq - rSiSe - rBase;

    const thicknesses = daemmMaterials.map(mat => {
      if (rInsReq <= 0) return 0;
      return (rInsReq * mat.lambda) * 100;
    });

    return {
      rBase,
      rTotalReq,
      rInsReq,
      thicknesses,
      chartData: {
        labels: daemmMaterials.map(m => m.name),
        datasets: [
          {
            label: inhalt.werte.erforderlicheDämmdickeCm,
            data: thicknesses,
            backgroundColor: daemmMaterials.map(m => m.color),
            borderRadius: 4,
          }
        ]
      }
    };
  }, [targetU, baseThickness, baseLambda, daemmMaterials]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><Thermometer className="text-shiraz" /><MdText text={inhalt.texte.thermischeMaterialeigenschaftenDämmstoff} /></h2>
        <p className="text-text-main/80 mb-6">
          Dieses Modul veranschaulicht das Zusammenspiel von <strong>Wärmeleitfähigkeit</strong>, <strong>Dichte</strong> und 
          <strong><MdText text={inhalt.texte.spezifischerWärmekapazität} /></strong>. Daraus ergeben sich abgeleitete Größen wie die 
          <strong> Wärmespeicherkapazität</strong> (wichtig für den sommerlichen Wärmeschutz), die 
          <strong> Temperaturleitfähigkeit</strong> (wie schnell ändert sich die Temperatur im Bauteil?) und die 
          <strong> Wärmeeindringfähigkeit</strong> (wie fühlt sich das Material bei Berührung an?). 
          Zusätzlich können Sie die erforderliche <strong>Dämmdicke</strong> für verschiedene Materialien berechnen.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-text-main">Materialparameter</h3>
                <select aria-label="Materialparameter" 
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  className="p-1.5 text-sm border border-home-grau/30 rounded-lg focus:outline-none focus:border-shiraz bg-white"
                >
                  {Object.keys(PRESET_MATERIALS).map(mat => (
                    <option key={mat} value={mat}>{mat}</option>
                  ))}
                  <option value="Benutzerdefiniert">Benutzerdefiniert</option>
                </select>
              </div>

              <Slider
                label={<FormulaText text="Wärmeleitfähigkeit (\lambda)" />}
                value={lambda}
                min={0.01}
                max={60.0}
                step={0.01}
                onChange={(e) => handleSliderChange(setLambda, Number(e.target.value))}
                unit="W/(mK)"
              />
              <Slider
                label={<FormulaText text="Rohdichte (\rho)" />}
                value={rho}
                min={10}
                max={8000}
                step={10}
                onChange={(e) => handleSliderChange(setRho, Number(e.target.value))}
                unit="kg/m³"
              />
              <Slider
                label={<FormulaText text={inhalt.werte.spezWärmekapazitätC} />}
                value={c}
                min={100}
                max={4500}
                step={10}
                onChange={(e) => handleSliderChange(setC, Number(e.target.value))}
                unit="J/(kgK)"
              />
              <Slider
                label={<FormulaText text={inhalt.werte.zielUWertU} />}
                value={targetU}
                min={0.10}
                max={1.0}
                step={0.01}
                onChange={(e) => setTargetU(Number(e.target.value))}
                unit="W/(m²K)"
              />
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/20">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.bestandswandTragschicht} /></h3>
              <Slider
                label={inhalt.werte.dickeDerTragschicht}
                value={baseThickness}
                min={10}max={50}step={1}
                onChange={(e) => setBaseThickness(Number(e.target.value))}
                unit="cm"
              />
              <Slider
                label={<FormulaText text="Wärmeleitfähigkeit Tragschicht (\lambda)" />}
                value={baseLambda}
                min={0.1}max={2.5}step={0.1}
                onChange={(e) => setBaseLambda(Number(e.target.value))}
                unit="W/(mK)"
              />
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/20">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.abgeleiteteThermischeEigenschaften} /></h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 shadow-sm">
                  <div className="text-xs text-text-main/70 mb-1"><MdText text={inhalt.texte.wärmespeicherfähigkeitC} /></div>
                  <div className="text-lg font-bold text-orange-800">{formatDeZahl(results.capVolMJ, 2)} <span className="text-xs font-normal">MJ/(m³K)</span></div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 shadow-sm">
                  <div className="text-xs text-text-main/70 mb-1"><MdText text={inhalt.texte.temperaturleitfähigkeitA} /></div>
                  <div className="text-lg font-bold text-orange-800">{formatDeZahl(results.a_mm2_s, 2)} <span className="text-xs font-normal">mm²/s</span></div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 shadow-sm">
                  <div className="text-xs text-text-main/70 mb-1"><MdText text={inhalt.texte.wärmeeindringfähigkeitB} /></div>
                  <div className="text-lg font-bold text-orange-800">{formatDeZahl(results.b, 0)} <span className="text-xs font-normal">J/(m²K√s)</span></div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 shadow-sm">
                  <div className="text-xs text-text-main/70 mb-1"><MdText text={inhalt.texte.kontakttemperaturHaut} /></div>
                  <div className="text-lg font-bold text-orange-800">{formatDeZahl(results.T_contact, 1)} <span className="text-xs font-normal">°C</span></div>
                </div>
              </div>
              <div className="h-48">
                <Bar 
                  data={results.chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { title: { display: true, text: inhalt.werte.bJMK } } }
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.erforderlicheDämmdicke} /></h3>
              
              {daemmResults.rInsReq <= 0 ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200"><MdText text={inhalt.texte.dieBestandswandErreichtDen} /></div>
              ) : (
                <div className="h-72">
                  <Bar 
                    data={daemmResults.chartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${formatDeZahl(context.parsed.y, 1)} cm`
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: 'Dicke (cm)' }
                        }
                      }
                    }} 
                  />
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Materialeigenschaften</h3>
              <div className="space-y-3">
                {daemmMaterials.map((mat, idx) => (
                  <div key={mat.name} className="flex items-start gap-3 text-sm">
                    <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: mat.color }}></div>
                    <div>
                      <div className="font-semibold text-text-main">
                        {mat.name} <span className="text-home-grau font-normal">(λ = {formatDeZahl(mat.lambda, 3)} W/mK)</span>
                      </div>
                      <div className="text-text-main/70">{mat.desc}</div>
                      {daemmResults.rInsReq > 0 && (
                        <div className="font-medium mt-0.5 text-orange-800">
                          Erforderlich: {formatDeZahl(daemmResults.thicknesses[idx], 1)} cm
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1WarumFühlt}
        zielGleichung="\vartheta_K = \frac{b_H \cdot \vartheta_H + b_M \cdot \vartheta_M}{b_H + b_M}"
        schritte={inhalt.daten["Waermeeigenschaften.schritte"]}
        ergebnisHinweis={inhalt.werte.beideOberflächenHaben20}
        normQuelle={inhalt.werte.bemessungswerteNachDinEn}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2DämmdickeFür}
        zielGleichung="d_D = \lambda_D \cdot \left(\frac{1}{U_{Ziel}} - R_{si} - R_{Wand} - R_{se}\right)"
        schritte={inhalt.daten["Waermeeigenschaften.schritte_2"]}
        ergebnisHinweis={inhalt.werte.gewähltWirdDieNächste}
        normQuelle={inhalt.werte.dinEnIso6946}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="waermeeigenschaften" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap6}
        wikipedia={[
          { title: 'Wärmeleitfähigkeit', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmeleitf%C3%A4higkeit' },
          { title: 'Wärmedurchgangskoeffizient', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient' },
          { title: inhalt.werte.spezifischeWärmekapazität, url: 'https://de.wikipedia.org/wiki/Spezifische_W%C3%A4rmekapazit%C3%A4t' },
          { title: 'Temperaturleitfähigkeit', url: 'https://de.wikipedia.org/wiki/Temperaturleitf%C3%A4higkeit' }
        ]}
        regelwerke={inhalt.daten["Waermeeigenschaften.regelwerke"]}
        literatur={inhalt.daten["Waermeeigenschaften.literatur"]}
        formeln={inhalt.daten["Waermeeigenschaften.formeln"]}
      />
    </div>
  );
}
