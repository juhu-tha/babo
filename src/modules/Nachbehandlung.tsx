import { formatDeZahl } from '@/src/utils/numberFormat';
import { Droplets } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { DIN1045_3_NACHBEHANDLUNG } from '@/src/data/normParams';
import inhalt from '@/content/nachbehandlung/Nachbehandlung.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Nachbehandlung() {
  const [tempAir, setTempAir] = useState(25); // °C
  const [tempConcrete, setTempConcrete] = useState(25); // °C
  const [rh, setRh] = useState(50); // %
  const [windSpeed, setWindSpeed] = useState(15); // km/h

  // States für Nachbehandlungsdauer
  const [festigkeitsEntwicklung, setFestigkeitsEntwicklung] = useState<'schnell'|'mittel'|'langsam'|'sehr_langsam'>('mittel');
  const [expositionsklasse, setExpositionsklasse] = useState<'x0_xc1'|'andere'|'xm'>('andere');
  const [oberflaechentemp, setOberflaechentemp] = useState<'ge25'|'15_25'|'10_15'|'5_10'|'<5'>('10_15');

  // Evaporation rate formula (ACI 305R metric)
  // E = 5 * ([Tc + 18]^2.5 - r * [Ta + 18]^2.5) * (V + 4) * 10^-6
  const evaporationRate = useMemo(() => {
    const r = rh / 100;
    const Tc = tempConcrete;
    const Ta = tempAir;
    const V = windSpeed;
    
    const term1 = Math.pow(Tc + 18, 2.5);
    const term2 = r * Math.pow(Ta + 18, 2.5);
    const E = 5 * (term1 - term2) * (V + 4) * Math.pow(10, -6);
    
    return Math.max(0, E);
  }, [tempAir, tempConcrete, rh, windSpeed]);

  const isCritical = evaporationRate > 1.0;

  // Mindestdauer nach DIN 1045-3:2023-08, Abschn. 9.6 (Nachbehandlungsklasse 3)
  const curingTime = useMemo(() => {
    if (oberflaechentemp === '<5') return -1; // Sondermaßnahmen erforderlich
    if (expositionsklasse === 'x0_xc1') return DIN1045_3_NACHBEHANDLUNG.x0_xc1_tage;
    const tage = DIN1045_3_NACHBEHANDLUNG.mindestdauerTage[oberflaechentemp][festigkeitsEntwicklung];
    return expositionsklasse === 'xm' ? tage * 2 : tage;
  }, [festigkeitsEntwicklung, expositionsklasse, oberflaechentemp]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Droplets className="text-shiraz" /><MdText text={inhalt.texte.nachbehandlungVerdunstung} /></h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300"><MdText text={inhalt.texte.berechnetNachDinEn} /></span>
        </div>
      

        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieNachbehandlungSchütztDen} /></p>
            <p className="mt-2 text-xs"><MdText text={inhalt.texte.lernpfad1VerdunstungAbschätzen} /></p>
        </div>

        <Slider
          label={inhalt.werte.lufttemperaturTA}
          min={5} max={40} step={1}
          value={tempAir} unit="°C"
          info={inhalt.werte.temperaturDerUmgebungsluft}
          onChange={(e) => setTempAir(Number(e.target.value))}
        />
        
        <Slider
          label={inhalt.werte.betontemperaturTC}
          min={5} max={40} step={1}
          value={tempConcrete} unit="°C"
          
          onChange={(e) => setTempConcrete(Number(e.target.value))}
        />

        <Slider
          label={inhalt.werte.relativeLuftfeuchteR}
          min={10} max={100} step={1}
          value={rh} unit="%"
          info={inhalt.werte.relativeLuftfeuchtigkeitDerUmgebung}
          onChange={(e) => setRh(Number(e.target.value))}
        />

        <Slider
          label={inhalt.werte.windgeschwindigkeitV}
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
              ? inhalt.werte.achtungSehrHohesRisiko 
              : inhalt.werte.geringesBisMittleresRisiko}
          </p>
        </div>
      </div>

      <div className="lg:col-span-6 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main"><MdText text={inhalt.texte.mindestdauerDerNachbehandlung} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.nachDinEn13670} /></p>
        </div>

          <div className="grid grid-cols-1 gap-4 mt-2">
            <div>
              <label className="block text-sm font-semibold text-text-main mb-1"><MdText text={inhalt.texte.festigkeitsentwicklungR} /></label>
              <select aria-label={inhalt.werte.festigkeitsentwicklungR} 
                className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-off-white focus:outline-none focus:ring-1 focus:ring-middle-blue/50"
                value={festigkeitsEntwicklung}
                onChange={(e) => setFestigkeitsEntwicklung(e.target.value as typeof festigkeitsEntwicklung)}
              >
                <option value="schnell">Schnell (r ≥ 0,50)</option>
                <option value="mittel">Mittel (r ≥ 0,30)</option>
                <option value="langsam">Langsam (r ≥ 0,15)</option>
                <option value="sehr_langsam">Sehr langsam (r &lt; 0,15)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1">Expositionsklasse</label>
              <select aria-label="Expositionsklasse" 
                className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-off-white focus:outline-none focus:ring-1 focus:ring-middle-blue/50"
                value={expositionsklasse}
                onChange={(e) => setExpositionsklasse(e.target.value as typeof expositionsklasse)}
              >
                <option value="x0_xc1">X0, XC1</option>
                <option value="andere">Andere (XC2–XC4, XD, XS, XF, XA)</option>
                <option value="xm">XM (Verschleiß: doppelte Dauer)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1">Oberflächentemperatur</label>
              <select aria-label="Oberflächentemperatur" 
                className="w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-off-white focus:outline-none focus:ring-1 focus:ring-middle-blue/50"
                value={oberflaechentemp}
                onChange={(e) => setOberflaechentemp(e.target.value as typeof oberflaechentemp)}
              >
                <option value="ge25">T ≥ 25 °C</option>
                <option value="15_25">15 °C ≤ T &lt; 25 °C</option>
                <option value="10_15">10 °C ≤ T &lt; 15 °C</option>
                <option value="5_10">5 °C ≤ T &lt; 10 °C</option>
                <option value="<5">T &lt; 5 °C (Winterbau)</option>
              </select>
            </div>
          </div>

          <div className={`mt-2 p-4 rounded-xl border ${curingTime === -1 ? 'bg-torch-red/10 border-torch-red/30' : 'bg-off-white border-shiraz/20'}`}>
            <h3 className="text-sm font-bold text-text-main mb-2"><MdText text={inhalt.texte.ergebnisNachbehandlungsdauer} /></h3>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-text-main/80"><MdText text={inhalt.texte.erforderlicheMindestdauer} /></span>
              <span className={`text-xl font-bold ${curingTime === -1 ? 'text-torch-red' : 'text-shiraz'}`}>
                {curingTime === -1 ? 'Sondermaßnahmen!' : `${formatDeZahl(curingTime, curingTime % 1 ? 1 : 0)} ${curingTime === 1 ? 'Tag' : 'Tage'}`}
              </span>
            </div>
            {curingTime === -1 ? (
              <p className="text-xs text-torch-red mt-2 leading-relaxed"><MdText text={inhalt.texte.beiOberflächentemperaturenUnter5} /></p>
            ) : expositionsklasse === 'x0_xc1' ? (
              <p className="text-xs text-text-main/70 mt-2 leading-relaxed"><MdText text={inhalt.texte.x0UndXc10} /></p>
            ) : null}
          </div>

          <details className="mt-2 group cursor-pointer border border-home-grau/30 rounded-lg bg-off-white">
            <summary className="p-3 font-semibold text-sm text-text-main"><MdText text={inhalt.texte.normtabelleAnzeigenDin1045} /></summary>
            <div className="p-3 pt-0 overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/30">
                    <th className="py-2 px-2">Oberflächentemperatur</th>
                    <th className="py-2 px-2">r ≥ 0,50</th>
                    <th className="py-2 px-2">r ≥ 0,30</th>
                    <th className="py-2 px-2">r ≥ 0,15</th>
                    <th className="py-2 px-2">r &lt; 0,15</th>
                  </tr>
                </thead>
                <tbody>
                  {([['ge25', 'T ≥ 25 °C'], ['15_25', inhalt.werte.t15T25C], ['10_15', inhalt.werte.t10T15C], ['5_10', inhalt.werte.t5T10C]] as const).map(([k, label]) => (
                    <tr key={k} className="border-b border-home-grau/10">
                      <td className="py-2 px-2">{label}</td>
                      {(['schnell', 'mittel', 'langsam', 'sehr_langsam'] as const).map(e => (
                        <td key={e} className="py-2 px-2 font-mono">{formatDeZahl(DIN1045_3_NACHBEHANDLUNG.mindestdauerTage[k][e], 0)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-text-main/60 mt-2"><MdText text={inhalt.texte.werteNachDin1045} /></p>
            </div>
          </details>
        </div>

        {/* Schematische Darstellung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungVerdunstung} /></h3>
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

        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielVerdunstungsrateAnEine}
          zielGleichung="E = 5 \cdot \left[(T_c + 18)^{2{,}5} - r\,(T_a + 18)^{2{,}5}\right] \cdot (V + 4) \cdot 10^{-6}"
          normQuelle={inhalt.werte.aci305rVerdunstungsformelMetrisch}
          schritte={inhalt.daten["Nachbehandlung.schritte"]}
          ergebnisHinweis={inhalt.werte.e123Kg}
        />

        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielMindestdauerDerNachbeh}
          zielGleichung="t_{NB} = f(r,\; T_{\text{Oberfläche}},\; \text{Expositionsklasse})"
          normQuelle={inhalt.werte.din104532023}
          schritte={inhalt.daten["Nachbehandlung.schritte_2"]}
          ergebnisHinweis={inhalt.werte.t7TageNachbehandlung}
        />

        <ModulTest moduleId="nachbehandlung" />

        <ModuleFooter 
          weblinks={[
            { title: inhalt.werte.betonWikiNachbehandlung, url: "https://beton.wiki/index.php?title=Nachbehandlung" }, 
            { title: inhalt.werte.zementMerkblattB8, url: "https://www.baunetzwissen.de/beton/tipps/planungshilfen/b--8--nachbehandlung-und-schutz-des-jungen-betons-1588977" }
          ]} 
          wikipedia={[
            { title: 'Frühschwinden', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' }
          ]}
          regelwerke={inhalt.daten["Nachbehandlung.regelwerke"]}
          literatur={inhalt.daten["Nachbehandlung.literatur"]}
          formeln={inhalt.daten["Nachbehandlung.formeln"]}
        />
      </div>
    </div>
  );
}
