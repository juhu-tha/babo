import { formatDeZahl } from '@/src/utils/numberFormat';
import { Thermometer } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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

  const daemmMaterials = useMemo(() => [
    { name: 'VIP', lambda: 0.007, color: '#64748b', desc: 'Vakuumisolationspaneel, extrem dünn' },
    { name: 'Aerogel', lambda: 0.015, color: '#64748b', desc: 'Hochleistungsdämmstoff, sehr teuer' },
    { name: 'PUR / PIR', lambda: 0.025, color: '#475569', desc: 'Polyurethan, sehr gute Dämmwirkung' },
    { name: 'EPS / XPS', lambda: 0.035, color: '#475569', desc: 'Polystyrol-Hartschaum (expandiert bzw. extrudiert), Standard im Hochbau; XPS auch als Perimeterdämmung' },
    { name: 'Steinwolle', lambda: 0.035, color: '#A3113E', desc: 'Nicht brennbar, guter Schallschutz, formstabil' },
    { name: 'Glaswolle', lambda: 0.035, color: '#94a3b8', desc: 'Nicht brennbar, leicht, flexibel' },
    { name: 'Mineralwolle', lambda: 0.040, color: '#64748b', desc: 'Sammelbegriff für Stein- und Glaswolle; Bemessungswerte je nach Produkt etwa 0,032 bis 0,040' },
    { name: 'Holzfaser', lambda: 0.040, color: '#475569', desc: 'Ökologisch, sehr guter sommerlicher Wärmeschutz' },
    { name: 'Zellulose', lambda: 0.040, color: '#475569', desc: 'Einblasdämmung, Recyclingmaterial, diffusionsoffen' },
    { name: 'Schaumglas', lambda: 0.040, color: '#64748b', desc: 'Druckfest, wasser- und dampfdicht' },
    { name: 'Hanffaser', lambda: 0.040, color: '#64748b', desc: 'Nachwachsend, feuchtigkeitsregulierend' },
    { name: 'Schafwolle', lambda: 0.040, color: '#94a3b8', desc: 'Naturfaser, nachwachsend; Formaldehyd-Bindung laut Herstellern, Mottenschutz erforderlich' }], []);

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
            label: 'Wärmeeindringfähigkeit b [J/(m²K√s)]',
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
            label: 'Erforderliche Dämmdicke (cm)',
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
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2"><Thermometer className="text-shiraz" /> Thermische Materialeigenschaften &amp; Dämmstoffe</h2>
        <p className="text-text-main/80 mb-6">
          Dieses Modul veranschaulicht das Zusammenspiel von <strong>Wärmeleitfähigkeit</strong>, <strong>Dichte</strong> und 
          <strong> spezifischer Wärmekapazität</strong>. Daraus ergeben sich abgeleitete Größen wie die 
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
                <select 
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
                label={<FormulaText text="Spez. Wärmekapazität (c)" />}
                value={c}
                min={100}
                max={4500}
                step={10}
                onChange={(e) => handleSliderChange(setC, Number(e.target.value))}
                unit="J/(kgK)"
              />
              <Slider
                label={<FormulaText text="Ziel-U-Wert (U_{req})" />}
                value={targetU}
                min={0.10}
                max={1.0}
                step={0.01}
                onChange={(e) => setTargetU(Number(e.target.value))}
                unit="W/(m²K)"
              />
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/20">
              <h3 className="font-semibold mb-4 text-text-main">Bestandswand (Tragschicht)</h3>
              <Slider
                label="Dicke der Tragschicht"
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
              <h3 className="font-semibold mb-4 text-text-main">Abgeleitete thermische Eigenschaften</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 shadow-sm">
                  <div className="text-xs text-text-main/70 mb-1">Wärmespeicherfähigkeit (C)</div>
                  <div className="text-lg font-bold text-orange-800">{formatDeZahl(results.capVolMJ, 2)} <span className="text-xs font-normal">MJ/(m³K)</span></div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 shadow-sm">
                  <div className="text-xs text-text-main/70 mb-1">Temperaturleitfähigkeit (a)</div>
                  <div className="text-lg font-bold text-orange-800">{formatDeZahl(results.a_mm2_s, 2)} <span className="text-xs font-normal">mm²/s</span></div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 shadow-sm">
                  <div className="text-xs text-text-main/70 mb-1">Wärmeeindringfähigkeit (b)</div>
                  <div className="text-lg font-bold text-orange-800">{formatDeZahl(results.b, 0)} <span className="text-xs font-normal">J/(m²K√s)</span></div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 shadow-sm">
                  <div className="text-xs text-text-main/70 mb-1">Kontakttemperatur (Haut)</div>
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
                    scales: { y: { title: { display: true, text: 'b [J/(m²K√s)]' } } }
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Erforderliche Dämmdicke</h3>
              
              {daemmResults.rInsReq <= 0 ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                  Die Bestandswand erreicht den Ziel-U-Wert bereits ohne zusätzliche Dämmung!
                </div>
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
        title="Beispiel 1: Warum fühlt sich Beton kälter an als Holz?"
        zielGleichung="\vartheta_K = \frac{b_H \cdot \vartheta_H + b_M \cdot \vartheta_M}{b_H + b_M}"
        schritte={[
          { titel: 'Wärmeeindringfähigkeit Beton', erklaerung: 'λ = 2,0 W/(mK), ρ = 2400 kg/m³, c = 1000 J/(kgK):', formel: 'b_{Beton} = \\sqrt{2{,}0 \\cdot 2\\,400 \\cdot 1\\,000} = 2\\,191\\,\\text{J/(m}^2\\text{K}\\sqrt{\\text{s}})' },
          { titel: 'Wärmeeindringfähigkeit Fichte', erklaerung: 'λ = 0,13 W/(mK), ρ = 500 kg/m³, c = 1600 J/(kgK):', formel: 'b_{Holz} = \\sqrt{0{,}13 \\cdot 500 \\cdot 1\\,600} = 322\\,\\text{J/(m}^2\\text{K}\\sqrt{\\text{s}})' },
          { titel: 'Kontakttemperatur', erklaerung: 'Haut 33 °C (b ≈ 1100), Material 20 °C:', formel: '\\vartheta_{Beton} = \\frac{1\\,100 \\cdot 33 + 2\\,191 \\cdot 20}{3\\,291} = 24{,}3\\,^\\circ\\text{C}, \\quad \\vartheta_{Holz} = \\frac{1\\,100 \\cdot 33 + 322 \\cdot 20}{1\\,422} = 30{,}1\\,^\\circ\\text{C}' }
        ]}
        ergebnisHinweis="Beide Oberflächen haben 20 °C, doch Beton entzieht der Haut schneller Wärme. Für Fußböden ist deshalb neben der Oberflächentemperatur die Wärmeeindringfähigkeit maßgebend (Fußwärme)."
        normQuelle="Bemessungswerte nach DIN EN ISO 10456:2010-05 / DIN 4108-4:2020-11"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Dämmdicke für die nachträgliche Außendämmung einer Bestandswand"
        zielGleichung="d_D = \lambda_D \cdot \left(\frac{1}{U_{Ziel}} - R_{si} - R_{Wand} - R_{se}\right)"
        schritte={[
          { titel: 'Anforderung', erklaerung: 'Außendämmung einer Außenwand im Bestand: Höchstwert nach GModG, Anlage 7, Zeile 1b.', formel: 'U_{Ziel} = 0{,}24\\,\\text{W/(m}^2\\text{K)} \\Rightarrow R_T = \\frac{1}{0{,}24} = 4{,}17\\,\\text{m}^2\\text{K/W}' },
          { titel: 'Bestand', erklaerung: 'Wand 24 cm mit λ = 1,0 W/(mK); Übergangswiderstände 0,13 + 0,04:', formel: 'R_{Wand} = \\frac{0{,}24}{1{,}0} = 0{,}24, \\quad R_{D,erf} = 4{,}17 - 0{,}17 - 0{,}24 = 3{,}76\\,\\text{m}^2\\text{K/W}' },
          { titel: 'Dämmdicken', erklaerung: 'Je nach Bemessungswert der Wärmeleitfähigkeit:', formel: 'd_{EPS\\,035} = 13{,}1\\,\\text{cm}, \\quad d_{Holzfaser\\,040} = 15{,}0\\,\\text{cm}, \\quad d_{PIR\\,025} = 9{,}4\\,\\text{cm}' }
        ]}
        ergebnisHinweis="Gewählt wird die nächste Lieferdicke (z. B. 14 cm EPS bzw. 16 cm Holzfaser). Wärmebrücken, Dübel und Fensteranschlüsse sind gesondert zu bewerten."
        normQuelle="DIN EN ISO 6946:2018-03; GModG Anlage 7 (Lesefassung Stand 29.07.2026)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="waermeeigenschaften" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 6 Bauphysik: Kennwerte, Dämmdicken und Normausgaben geprüft, GEG → GModG; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Wärmeleitfähigkeit', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmeleitf%C3%A4higkeit' },
          { title: 'Wärmedurchgangskoeffizient', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient' },
          { title: 'Spezifische Wärmekapazität', url: 'https://de.wikipedia.org/wiki/Spezifische_W%C3%A4rmekapazit%C3%A4t' },
          { title: 'Temperaturleitfähigkeit', url: 'https://de.wikipedia.org/wiki/Temperaturleitf%C3%A4higkeit' }
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 10456:2010-05 (Baustoffe und Bauprodukte – Wärme- und feuchtetechnische Eigenschaften, tabellierte Bemessungswerte)' },
          { title: 'DIN 4108-4:2020-11 (Wärmeschutz und Energie-Einsparung in Gebäuden – Wärme- und feuchteschutztechnische Bemessungswerte)' },
          { title: 'DIN EN ISO 6946:2018-03 (Wärmedurchlasswiderstand und Wärmedurchgangskoeffizient – Berechnungsverfahren)' },
          { title: 'Gebäudemodernisierungsgesetz (GModG, bis 28.07.2026 Gebäudeenergiegesetz GEG) – Anlage 7: Höchstwerte der U-Werte bei Änderung', url: 'https://www.gesetze-im-internet.de/geg/' }
        ]}
        literatur={[
          'Willems, W. (Hrsg.): Lehrbuch der Bauphysik. 8. Aufl., Wiesbaden: Springer Vieweg 2017',
          'Bauphysik-Kalender. Berlin: Ernst & Sohn (jährlich)'
        ]}
        formeln={[
          {
            erklaerung: "Volumenbezogene Wärmespeicherkapazität",
            formel: "C = \\rho \\cdot c \\quad [\\text{J/(m}^3\\text{K)}]"
          },
          {
            erklaerung: "Temperaturleitfähigkeit",
            formel: "a = \\frac{\\lambda}{\\rho \\cdot c} \\quad [\\text{m}^2\\text{/s}]"
          },
          {
            erklaerung: "Wärmeeindringfähigkeit",
            formel: "b = \\sqrt{\\lambda \\cdot \\rho \\cdot c} \\quad [\\text{J/(m}^2\\text{K}\\sqrt{\\text{s}})]"
          },
          {
            erklaerung: "Kontakttemperatur zweier halbunendlicher Körper (Haut: b ≈ 1100 J/(m²K√s) als Lehrwert)",
            formel: "T_m = \\frac{b_1 \\cdot T_1 + b_2 \\cdot T_2}{b_1 + b_2}"
          },
          {
            erklaerung: "Wärmedurchlasswiderstand",
            formel: "R = \\frac{d}{\\lambda} \\quad [\\text{m}^2\\text{K/W}]"
          },
          {
            erklaerung: "Wärmedurchgangskoeffizient (U-Wert) nach DIN EN ISO 6946; Wand bei horizontalem Wärmestrom: R_si = 0,13, R_se = 0,04 m²K/W",
            formel: "U = \\frac{1}{R_{si} + \\sum R_i + R_{se}} \\quad [\\text{W/(m}^2\\text{K)}]"
          }
        ]}
      />
    </div>
  );
}
