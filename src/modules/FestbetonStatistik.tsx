import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Querverweis } from '@/src/components/ui/Querverweis';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { normalPDF } from '@/src/lib/math';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { BarChart3 } from 'lucide-react';
import { formatDeZahl } from '@/src/utils/numberFormat';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/festbetonstatistik/FestbetonStatistik.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { festbetonStatistik } from '@/src/calc/festbetonStatistik';
import { EcKennwerteVerweis } from '@/src/components/ui/EcKennwerteVerweis';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function FestbetonStatistik() {
  const [fcm, setFcm] = useState(45); // Mittlere Festigkeit
  const [sigma, setSigma] = useState(4.0); // Standardabweichung
  const [format, setFormat] = useState<'zylinder' | 'wuerfel'>('zylinder');
  const [alphaCc, setAlphaCc] = useState(0.85);
  const [gammaC, setGammaC] = useState(1.5);
  const [pruefArt, setPruefArt] = useState<'erst' | 'stetig'>('stetig');

  const chartData = useMemo(() => {
    // 5-%-Fraktil und Würfel/Zylinder über f_ck,cube/f_ck der Festigkeitsklasse (Tab. 3.1, z. B. C30/37: 37/30 = 1,23) aus dem Rechenkern
    const k = festbetonStatistik({ fcm, sigma, format, alphaCc: 0.85, gammaC: 1.5, pruefArt: 'stetig' });
    const scaledFcm = k.anzeigeFcm;
    const scaledSigma = k.anzeigeSigma;
    const scaledFck = k.anzeigeFck;

    const minX = Math.floor(Math.max(0, scaledFcm - 4 * scaledSigma));
    const maxX = Math.ceil(scaledFcm + 4 * scaledSigma);
    
    // Generate x values: fine steps for a smooth curve + the exact scaledFck point for a sharp vertical cutoff
    const rawXValues = [];
    const step = (maxX - minX) / 100;
    for (let i = 0; i <= 100; i++) {
      rawXValues.push(minX + i * step);
    }
    rawXValues.push(scaledFck);
    // Sort and remove duplicates
    const xValues = Array.from(new Set(rawXValues)).sort((a, b) => a - b);
    
    const yValues = xValues.map(x => normalPDF(x, scaledFcm, scaledSigma));
    
    // Create a dataset for the red shaded area (x <= fck)
    const redAreaX: number[] = [];
    const redAreaY: number[] = [];
    
    xValues.forEach(x => {
      if (x <= scaledFck) {
        redAreaX.push(x);
        redAreaY.push(normalPDF(x, scaledFcm, scaledSigma));
      }
    });
    // Add the vertical drop
    redAreaX.push(scaledFck);
    redAreaY.push(0);

    return {
      datasets: [
        {
          label: inhalt.werte.t5FraktilAusschuss,
          data: redAreaX.map((x, i) => ({ x: x, y: redAreaY[i] })),
          backgroundColor: 'rgba(255, 3, 80, 0.6)', // Torch Red
          borderColor: 'transparent',
          fill: true,
          pointRadius: 0,
          tension: 0, // No tension for the red area to keep the drop vertical
        },
        {
          label: 'Wahrscheinlichkeitsdichte',
          data: xValues.map((x, i) => ({ x: x, y: yValues[i] })),
          borderColor: '#A3113E', // Shiraz
          backgroundColor: 'rgba(210, 210, 210, 0.3)', // Home Grau
          borderWidth: 2,
          fill: true,
          pointRadius: 0,
          tension: 0.4,
        },
        {
          label: `f_ck (${formatDeZahl(scaledFck, 1)})`,
          data: [{ x: scaledFck, y: 0 }, { x: scaledFck, y: Math.max(...yValues) }],
          borderColor: '#1e293b',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }
      ]
    };
  }, [fcm, sigma, format]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false, // Hide Y axis as density values aren't intuitive
        beginAtZero: true,
      },
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: `Druckfestigkeit (N/mm²) - ${format === 'zylinder' ? 'Zylinder' : 'Würfel'}`,
          font: { family: 'Work Sans', weight: 'bold' as const }
        },
        ticks: {
          stepSize: 1,
          callback: function(value: string | number) {
            if (Number.isInteger(value)) {
              return value;
            }
            return null;
          }
        }
      }
    },
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          title: (context: TooltipItem<'line'>[]) => `Festigkeit: ${formatDeZahl(Number(context[0].parsed.x), 1)} N/mm²`,
          label: () => '' // Simplify tooltip
        }
      }
    }
  };

  // Rechenkern src/calc/festbetonStatistik.ts: f_ck = f_cm − 1,645·σ und f_cd immer aus der Zylinderfestigkeit,
  // Anzeigewerte im gewählten Probenformat (Würfel über die Festigkeitsklasse), Konformitätskriterien nach DIN EN 206, 8.2.1.3 (σ ≥ 3 N/mm²)
  const kern = festbetonStatistik({ fcm, sigma, format, alphaCc, gammaC, pruefArt });
  const { fckCyl, fcd } = kern;
  const displayFcm = kern.anzeigeFcm;
  const displaySigma = kern.anzeigeSigma;
  const displayFck = kern.anzeigeFck;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <BarChart3 className="text-shiraz" /><MdText text={inhalt.texte.festbetonStatistikKonformität} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            <FormulaText text={inhalt.werte.betonIstEinNaturprodukt} />
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Konfiguration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <Slider info={inhalt.werte.derStatistischeMittelwertAller}
                label={<FormulaText text={inhalt.werte.mittlereFestigkeitFCm} />}
                min={20} max={100} step={1}
                value={fcm} unit="N/mm²"
                onChange={(e) => setFcm(Number(e.target.value))}
              />
              
              <Slider info={inhalt.werte.maßFürDieStreuung}
                label={<FormulaText text={inhalt.werte.standardabweichungCyl} />}
                min={1.0} max={10.0} step={0.1}
                value={sigma} unit="N/mm²"
                onChange={(e) => setSigma(Number(e.target.value))}
              />

              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Anzeigeformat</label></div>
                  <InfoTooltip text={inhalt.werte.wählenSieDasGeometrische} />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="format" 
                      value="zylinder" 
                      checked={format === 'zylinder'}
                      onChange={() => setFormat('zylinder')}
                      className="accent-shiraz"
                    />
                    Zylinder
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="format" 
                      value="wuerfel" 
                      checked={format === 'wuerfel'}
                      onChange={() => setFormat('wuerfel')}
                      className="accent-shiraz"
                    />
                    Würfel
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-text-main mb-2"><MdText text={inhalt.texte.bemessungswerteDesign} /></h3>
              
              <Slider info={inhalt.werte.beiwertZurBerücksichtigungVon}
                label={<FormulaText text={inhalt.werte.beiwertCc} />}
                min={0.8} max={1.0} step={0.05}
                value={alphaCc} unit=""
                onChange={(e) => setAlphaCc(Number(e.target.value))}
              />
              
              <Slider info={inhalt.werte.teilsicherheitsbeiwertFürBetonDin}
                label={<FormulaText text={inhalt.werte.teilsicherheitsbeiwertC} />}
                min={1.2} max={1.5} step={0.1}
                value={gammaC} unit=""
                onChange={(e) => setGammaC(Number(e.target.value))}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.konformitätskriterienDinEn206} /></h3>
                <InfoTooltip text={inhalt.werte.wählenSieDieHerstellungsart} />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="radio" 
                    name="pruefArt" 
                    value="erst" 
                    checked={pruefArt === 'erst'}
                    onChange={() => setPruefArt('erst')}
                    className="accent-shiraz"
                  /><MdText text={inhalt.texte.erstherstellungN3} /></label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="radio" 
                    name="pruefArt" 
                    value="stetig" 
                    checked={pruefArt === 'stetig'}
                    onChange={() => setPruefArt('stetig')}
                    className="accent-shiraz"
                  /><MdText text={inhalt.texte.stetigeHerstellungN15} /></label>
              </div>
              
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/50 text-sm">
                {pruefArt === 'stetig' ? (
                  <>
                    <p className="text-text-main/80 mb-2"><MdText text={inhalt.texte.fürDieStetigeHerstellung} /></p>
                    <div className="bg-white p-2 rounded border border-home-grau text-center font-mono text-shiraz mb-2">
                      <FormulaText text="f_{cm} \ge f_{ck} + 1{,}48 \cdot \sigma" /><br/>
                      <FormulaText text="f_{ci} \ge f_{ck} - 4" />
                    </div>
                    <p className="text-text-main/80"><MdText text={inhalt.texte.beiEinemAngestrebten5} /><strong>{formatDeZahl(displayFck, 1)} N/mm²</strong><MdText text={inhalt.texte.mussDerMittelwertVon} /><strong>{formatDeZahl(kern.mindestMittelwert, 1)} N/mm²</strong><MdText text={inhalt.texte.betragenUndKeinEinzelwert} /><strong>{formatDeZahl(kern.mindestEinzelwert, 1)} N/mm²</strong> unterschreiten.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-text-main/80 mb-2"><MdText text={inhalt.texte.fürDieErstherstellungGruppen} /></p>
                    <div className="bg-white p-2 rounded border border-home-grau text-center font-mono text-shiraz mb-2">
                      <FormulaText text="Kriterium 1: f_{cm} \ge f_{ck} + 4" /><br/>
                      <FormulaText text="Kriterium 2: f_{ci} \ge f_{ck} - 4" />
                    </div>
                    <p className="text-text-main/80"><MdText text={inhalt.texte.beiEinemAngestrebten52} /><strong>{formatDeZahl(displayFck, 1)} N/mm²</strong><MdText text={inhalt.texte.mussDerMittelwertAus} /><strong>{formatDeZahl(kern.mindestMittelwert, 1)} N/mm²</strong><MdText text={inhalt.texte.betragenUndKeinEinzelwert2} /><strong>{formatDeZahl(kern.mindestEinzelwert, 1)} N/mm²</strong> unterschreiten.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col">
              <h3 className="text-sm font-bold text-text-main mb-3"><MdText text={inhalt.texte.charakteristischerWert5Fraktile} /></h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-text-main/80"><FormulaText text={inhalt.werte.mittelwertFCm} /></span>
                  <span className="text-text-main font-bold">{formatDeZahl(displayFcm, 1)} MPa</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-main/80"><FormulaText text={inhalt.werte.standardabweichung} /></span>
                  <span className="text-text-main font-bold">{formatDeZahl(displaySigma, 1)} MPa</span>
                </div>
                <div className="flex justify-between items-center border-t border-home-grau/30 pt-2 mt-1">
                  <span className="text-text-main font-bold"><FormulaText text={inhalt.werte.charakteristischeFestigkeitFCk} /></span>
                  <span className="text-shiraz font-bold text-lg">{formatDeZahl(displayFck, 1)} MPa</span>
                </div>
                <div className="mt-2 text-xs text-shiraz font-medium bg-shiraz/10 p-2 rounded"><MdText text={inhalt.texte.beiNormalverteilungUnterschreiten5} /></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col">
              <h3 className="text-sm font-bold text-text-main mb-3"><MdText text={inhalt.texte.bemessungswertDesign} /></h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-text-main/80"><FormulaText text={inhalt.werte.charakteristischerWertFCk} /></span>
                  <span className="text-text-main font-bold">{formatDeZahl(fckCyl, 1)} MPa</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-main/80"><FormulaText text={inhalt.werte.faktorenCcC} /></span>
                  <span className="text-text-main font-bold">{formatDeZahl(alphaCc, 2)} / {formatDeZahl(gammaC, 2)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-home-grau/30 pt-2 mt-1">
                  <span className="text-text-main font-bold"><FormulaText text={inhalt.werte.bemessungswertFCd} /></span>
                  <span className="text-emerald-600 font-bold text-lg">{formatDeZahl(fcd, 1)} MPa</span>
                </div>
                <div className="mt-2 text-xs text-emerald-600 font-medium bg-emerald-50 p-2 rounded"><MdText text={inhalt.texte.dieserWertWirdFür} /></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[500px]">
            <h2 className="text-xl font-bold text-text-main mb-2"><MdText text={inhalt.texte.gaußscheNormalverteilungDerFestigkeit} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            <FormulaText text={inhalt.werte.das5FraktilF} />
          </p>
        </div>
            
            <div className="flex justify-between items-center mb-4 text-sm bg-off-white p-3 rounded-lg border border-home-grau/30">
              <div><span className="font-bold text-text-main"><MdText text={inhalt.texte.mittelwert} /></span> {formatDeZahl(displayFcm, 1)} N/mm²</div>
              <div><span className="font-bold text-text-main"><MdText text={inhalt.texte.standardabweichung} /></span> {formatDeZahl(displaySigma, 1)} N/mm²</div>
              <div><span className="font-bold text-shiraz"><MdText text={inhalt.texte.t5FraktilFCk} /></span> {formatDeZahl(displayFck, 1)} N/mm²</div>
            </div>

            <div className="flex-1 relative w-full h-full">
              <Line data={chartData} options={options} />
            </div>
          </div>

          {/* Schematische Darstellung Zylinder vs Würfel */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungZylinderVs} /></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Zylinder */}
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <div className="text-sm font-bold mb-2"><MdText text={inhalt.texte.zylinder150X300} /></div>
                <svg width="100%" height="150" viewBox="0 0 200 150">
                  {/* Druckplatten */}
                  <rect x="60" y="10" width="80" height="10" fill="#64748b" />
                  <rect x="60" y="130" width="80" height="10" fill="#64748b" />
                  
                  {/* Zylinder */}
                  <rect x="70" y="20" width="60" height="110" fill="#cbd5e1" stroke="#94a3b8" />
                  
                  {/* Kraftpfeile */}
                  <path d="M 100 0 L 100 10" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  <path d="M 100 150 L 100 140" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  
                  {/* Querdehnung (ungestört in der Mitte) */}
                  <path d="M 70 75 L 50 75" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow-blue)" />
                  <path d="M 130 75 L 150 75" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow-blue)" />
                  
                  {/* Reibungskegel (klein im Verhältnis) */}
                  <path d="M 70 20 L 130 20 L 100 50 Z" fill="#94a3b8" opacity="0.5" />
                  <path d="M 70 130 L 130 130 L 100 100 Z" fill="#94a3b8" opacity="0.5" />
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.derMittlereBereichBleibt} /></div>
              </div>

              {/* Würfel */}
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <div className="text-sm font-bold mb-2"><MdText text={inhalt.texte.würfel150X150} /></div>
                <svg width="100%" height="150" viewBox="0 0 200 150">
                  {/* Druckplatten */}
                  <rect x="50" y="25" width="100" height="10" fill="#64748b" />
                  <rect x="50" y="115" width="100" height="10" fill="#64748b" />
                  
                  {/* Würfel */}
                  <rect x="60" y="35" width="80" height="80" fill="#cbd5e1" stroke="#94a3b8" />
                  
                  {/* Kraftpfeile */}
                  <path d="M 100 15 L 100 25" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  <path d="M 100 135 L 100 125" stroke="#A3113E" strokeWidth="2" markerEnd="url(#arrow-red)" />
                  
                  {/* Querdehnung (behindert) */}
                  <path d="M 60 75 L 40 75" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow-blue)" />
                  <path d="M 140 75 L 160 75" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow-blue)" />
                  
                  {/* Reibungskegel (überschneiden sich) */}
                  <path d="M 60 35 L 140 35 L 100 75 Z" fill="#94a3b8" opacity="0.5" />
                  <path d="M 60 115 L 140 115 L 100 75 Z" fill="#94a3b8" opacity="0.5" />
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.dieReibungskegelDerDruckplatten} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
        <FormulaDerivationBox
          title={inhalt.werte.beispiel1KonformitätBei}
          zielGleichung="f_{cm} \ge f_{ck} + 4,\qquad f_{ci} \ge f_{ck} - 4"
          schritte={inhalt.daten["FestbetonStatistik.schritte"]}
          ergebnisHinweis={inhalt.werte.beideKriterienSindErfüllt}
          normQuelle={inhalt.werte.dinEn2062021}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel2KonformitätBei}
          zielGleichung="f_{cm} \ge f_{ck} + 1{,}48\,\sigma,\qquad f_{cd} = \alpha_{cc} \cdot \frac{f_{ck}}{\gamma_c}"
          schritte={inhalt.daten["FestbetonStatistik.schritte_2"]}
          ergebnisHinweis={inhalt.werte.dieKonformitätWirdIm}
          normQuelle={inhalt.werte.dinEn20620212}
        />

        {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
        <Querverweis ziel="normen_ausblick" titel={inhalt.werte.neueAusgabenErschienenDin} linkText={inhalt.werte.zumModulAusblickNeue}>
          <p><MdText text={inhalt.texte.maßgebendBleibenDinEn} /></p>
        </Querverweis>

        <EcKennwerteVerweis />

        <ModulTest moduleId="festbeton_statistik" />

        <ModuleFooter 
          lastReviewed={inhalt.werte.oktober2026Ap4}
          wikipedia={[
            { title: 'Druckfestigkeit', url: 'https://de.wikipedia.org/wiki/Druckfestigkeit' },
            { title: 'Normalverteilung', url: 'https://de.wikipedia.org/wiki/Normalverteilung' },
            { title: 'Teilsicherheitskonzept', url: 'https://de.wikipedia.org/wiki/Teilsicherheitskonzept' }
          ]}
          regelwerke={inhalt.daten["FestbetonStatistik.regelwerke"]}
          literatur={inhalt.daten["FestbetonStatistik.literatur"]}
          formeln={inhalt.daten["FestbetonStatistik.formeln"]}
        />
      </div>
    </div>
  );
}
