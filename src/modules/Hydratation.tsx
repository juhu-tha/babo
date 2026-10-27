import type { ChartDataset, ChartOptions } from 'chart.js';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { Flame, Activity, Info } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { InlineMath } from 'react-katex';
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
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import inhalt from '@/content/hydratation/Hydratation.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { hydratation, GEWOGENE_REIFE_C, REIFEVERFAHREN, type Zementart, type ZementFestigkeitsklasse, type Erhaertung, type Zusatzstoff, type Reifeverfahren } from '@/src/calc/hydratation';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

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

export default function Hydratation() {
  const [zement, setZement] = useState(350);
  const [tempC, setTempC] = useState(15); // Umgebungstemperatur
  const [frischbetonTemp, setFrischbetonTemp] = useState(20); // Frischbetontemperatur
  
  const [zementArt, setZementArt] = useState('CEM I');
  const [festigkeitsklasse, setFestigkeitsklasse] = useState('42.5');
  const [erhaertungsgeschwindigkeit, setErhaertungsgeschwindigkeit] = useState('N');
  const [zusatzstoff, setZusatzstoff] = useState('Ohne');
  const [zusatzstoffMenge, setZusatzstoffMenge] = useState(0);
  const [bauteildicke, setBauteildicke] = useState(0.5); // meters
  const [ausschalFestigkeit, setAusschalFestigkeit] = useState(50); // % of fck
  const [reifeVerfahren, setReifeVerfahren] = useState('Arrhenius');
  const [aktivierungsEnergie, setAktivierungsEnergie] = useState(38); // kJ/mol (for Arrhenius)
  const [cGewogen, setCGewogen] = useState<number>(GEWOGENE_REIFE_C.standard); // gewogene Reife NEN 5970 (vorläufig, F-Freigabe)
  const [festigkeitsModus, setFestigkeitsModus] = useState<'relativ' | 'druck' | 'zug' | 'emodul' | 'alle_absolut'>('relativ');

  const ergebnis = useMemo(() => hydratation({
    zement, tempUmgebung: tempC, tempFrischbeton: frischbetonTemp,
    zementArt: zementArt as Zementart, festigkeitsklasse: festigkeitsklasse as ZementFestigkeitsklasse,
    erhaertung: erhaertungsgeschwindigkeit as Erhaertung, zusatzstoff: zusatzstoff as Zusatzstoff, zusatzstoffMenge,
    bauteildicke, ausschalAnteil: ausschalFestigkeit, reifeVerfahren: reifeVerfahren as Reifeverfahren, aktivierungsEnergie, cGewogen,
  }), [zement, tempC, frischbetonTemp, zementArt, festigkeitsklasse, erhaertungsgeschwindigkeit, zusatzstoff, zusatzstoffMenge, bauteildicke, ausschalFestigkeit, reifeVerfahren, aktivierungsEnergie, cGewogen]);

  const {
    strength,
    temperature,
    te28,
    te2d,
    beta2d,
    sBeiwert,
    fckRechen,
    maxTempDiff,
    rissgefahr,
    ausschalTage,
    fcm28,
    fctm28,
    Ecm28,
    fc_2d_val,
    fct_2d_val,
    E_2d_val,
    fc_2d_rel,
    fct_2d_rel,
    E_2d_rel
  } = useMemo(() => {
    const r = ergebnis;
    const timeSteps = r.zeit;
    const { fReq, fcm28, fctm28, Ecm28 } = r;
    const fcActRel = r.fcAktRel, fcRefRel = r.fcRefRel, fctActRel = r.fctAktRel, EActRel = r.EAktRel;
    const fcActMpa = r.fcAkt, fcRefMpa = r.fcRef, fctActMpa = r.fctAkt, fctRefMpa = r.fctRef, EActGpa = r.EAkt, ERefGpa = r.ERef;
    const tempCore = r.tempKern, tempRand = r.tempRand, tempAdiabatic = r.tempAdiabat;

    // Dynamischer Aufbau des Datasets je nach gewähltem Festigkeitsmodus
    let strengthDatasets: ChartDataset<'line'>[] = [];
    if (festigkeitsModus === 'relativ') {
      strengthDatasets = [
        {
          label: inhalt.werte.druckfestigkeitFCmKern,
          data: fcActRel,
          borderColor: '#A3113E', // Shiraz
          backgroundColor: 'rgba(163, 17, 62, 0.08)',
          fill: false,
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: inhalt.werte.zugfestigkeitFCtmKern,
          data: fctActRel,
          borderColor: '#2563eb', // Blau
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: inhalt.werte.eModulECm,
          data: EActRel,
          borderColor: '#059669', // Grün
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: inhalt.werte.t20CReferenzF,
          data: fcRefRel,
          borderColor: '#94a3b8',
          borderDash: [5, 5],
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 0,
        }
      ];
    } else if (festigkeitsModus === 'druck') {
      strengthDatasets = [
        {
          label: inhalt.werte.druckfestigkeitFCmKern2,
          data: fcActMpa,
          borderColor: '#A3113E',
          backgroundColor: 'rgba(163, 17, 62, 0.12)',
          fill: true,
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: inhalt.werte.referenzFCmBei,
          data: fcRefMpa,
          borderColor: '#94a3b8',
          borderDash: [5, 5],
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: `Ausschalzielwert (${formatDeZahl(fReq, 1)} MPa)`,
          data: new Array(timeSteps.length).fill(Number(fReq.toFixed(1))),
          borderColor: '#d97706',
          borderDash: [3, 3],
          borderWidth: 2,
          pointRadius: 0,
        }
      ];
    } else if (festigkeitsModus === 'zug') {
      strengthDatasets = [
        {
          label: inhalt.werte.zugfestigkeitFCtmKern2,
          data: fctActMpa,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.12)',
          fill: true,
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: inhalt.werte.referenzFCtmBei,
          data: fctRefMpa,
          borderColor: '#94a3b8',
          borderDash: [5, 5],
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 0,
        }
      ];
    } else if (festigkeitsModus === 'emodul') {
      strengthDatasets = [
        {
          label: inhalt.werte.eModulECm2,
          data: EActGpa,
          borderColor: '#059669',
          backgroundColor: 'rgba(5, 150, 105, 0.12)',
          fill: true,
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: inhalt.werte.referenzECmBei,
          data: ERefGpa,
          borderColor: '#94a3b8',
          borderDash: [5, 5],
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 0,
        }
      ];
    } else { // 'alle_absolut'
      strengthDatasets = [
        {
          label: inhalt.werte.druckfestigkeitFCmMpa,
          data: fcActMpa,
          borderColor: '#A3113E',
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 0,
          yAxisID: 'y',
        },
        {
          label: inhalt.werte.zugfestigkeitFCtmMpa,
          data: fctActMpa,
          borderColor: '#2563eb',
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 0,
          yAxisID: 'y',
        },
        {
          label: inhalt.werte.eModulECm3,
          data: EActGpa,
          borderColor: '#059669',
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 0,
          yAxisID: 'yE',
        }
      ];
    }

    return {
      te28: r.te28,
      te2d: r.te2d,
      beta2d: r.beta2d,
      sBeiwert: r.s,
      fckRechen: r.fck,
      maxTempDiff: r.maxTempDiff,
      rissgefahr: r.rissgefahr,
      ausschalTage: r.ausschalTage,
      fcm28,
      fctm28,
      Ecm28,
      fc_2d_val: r.fc2d,
      fct_2d_val: r.fct2d,
      E_2d_val: r.E2d,
      fc_2d_rel: r.fc2dRel,
      fct_2d_rel: r.fct2dRel,
      E_2d_rel: r.E2dRel,
      strength: {
        labels: timeSteps,
        datasets: strengthDatasets
      },
      temperature: {
        labels: timeSteps,
        datasets: [
          {
            label: inhalt.werte.adiabatischeTemperaturC,
            data: tempAdiabatic,
            borderColor: '#cbd5e1',
            borderDash: [5, 5],
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0,
          },
          {
            label: inhalt.werte.kerntemperaturBauteilC,
            data: tempCore,
            borderColor: '#A3113E',
            backgroundColor: 'rgba(255, 3, 80, 0.1)',
            fill: true,
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 0,
          },
          {
            label: inhalt.werte.randtemperaturBauteilC,
            data: tempRand,
            borderColor: '#475569',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0,
          }
        ]
      }
    };
  }, [ergebnis, festigkeitsModus]);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: inhalt.werte.zeitTTage, font: { family: 'Work Sans', weight: 'bold' as const } },
        ticks: { maxTicksLimit: 15 } // Verhindert überlappende Labels bei 280 Messpunkten
      }
    },
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => `${context.dataset.label}: ${formatDeZahl((context.raw as number), 1)}`
        }
      }
    }
  };

  const strengthOptions = useMemo(() => {
    let yScales: NonNullable<ChartOptions<'line'>['scales']> = {
      y: {
        min: 0,
        max: 120,
        title: { display: true, text: inhalt.werte.relativerKennwert, font: { family: 'Work Sans', weight: 'bold' as const } },
        ticks: { callback: (val: string | number) => `${val} %` }
      }
    };

    if (festigkeitsModus === 'druck') {
      yScales = {
        y: {
          min: 0,
          suggestedMax: Math.ceil(fcm28 * 1.15),
          title: { display: true, text: inhalt.werte.druckfestigkeitFCmMpa2, font: { family: 'Work Sans', weight: 'bold' as const } },
          ticks: { callback: (val: string | number) => `${val} MPa` }
        }
      };
    } else if (festigkeitsModus === 'zug') {
      yScales = {
        y: {
          min: 0,
          suggestedMax: Number((fctm28 * 1.25).toFixed(1)),
          title: { display: true, text: inhalt.werte.zugfestigkeitFCtmMpa2, font: { family: 'Work Sans', weight: 'bold' as const } },
          ticks: { callback: (val: string | number) => `${val} MPa` }
        }
      };
    } else if (festigkeitsModus === 'emodul') {
      yScales = {
        y: {
          min: 0,
          suggestedMax: Math.ceil(Ecm28 * 1.15),
          title: { display: true, text: inhalt.werte.elastizitätsmodulECmGpa, font: { family: 'Work Sans', weight: 'bold' as const } },
          ticks: { callback: (val: string | number) => `${val} GPa` }
        }
      };
    } else if (festigkeitsModus === 'alle_absolut') {
      yScales = {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          min: 0,
          suggestedMax: Math.ceil(fcm28 * 1.15),
          title: { display: true, text: inhalt.werte.druckZugfestigkeitMpa, font: { family: 'Work Sans', weight: 'bold' as const } },
          ticks: { callback: (val: string | number) => `${val} MPa` }
        },
        yE: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 0,
          suggestedMax: Math.ceil(Ecm28 * 1.15),
          title: { display: true, text: inhalt.werte.eModulGpa, font: { family: 'Work Sans', weight: 'bold' as const } },
          grid: { drawOnChartArea: false },
          ticks: { callback: (val: string | number) => `${val} GPa` }
        }
      };
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: inhalt.werte.reifealterTTage, font: { family: 'Work Sans', weight: 'bold' as const } },
          ticks: { maxTicksLimit: 15 }
        },
        ...yScales
      },
      plugins: {
        legend: { position: 'top' as const },
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<'line'>) => {
              const val = context.raw as number;
              const lbl = context.dataset.label || '';
              if (lbl.includes('(%)')) {
                return `${lbl}: ${formatDeZahl(val, 1)} %`;
              }
              if (lbl.includes('(MPa)')) {
                return `${lbl}: ${formatDeZahl(val, 2)} MPa`;
              }
              if (lbl.includes('(GPa)')) {
                return `${lbl}: ${formatDeZahl(val, 2)} GPa`;
              }
              return `${lbl}: ${formatDeZahl(val, 1)}`;
            }
          }
        }
      }
    };
  }, [festigkeitsModus, fcm28, fctm28, Ecm28]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><Flame className="text-shiraz" /><MdText text={inhalt.texte.hydratationReifegradKinetik} /></h2>
      

        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieHydratationIstEine} /></p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Zementart</label><InfoTooltip text={inhalt.werte.artDesVerwendetenZements} /></div>
            <select aria-label="Zementart" 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-middle-blue"
              value={zementArt}
              onChange={(e) => setZementArt(e.target.value)}
            >
              {['CEM I', 'CEM II', 'CEM III', 'CEM IV', 'CEM V'].map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Festigkeitsklasse</label><InfoTooltip text={inhalt.werte.normfestigkeitDesMaterials} /></div>
            <select aria-label="Festigkeitsklasse" 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-middle-blue"
              value={festigkeitsklasse}
              onChange={(e) => setFestigkeitsklasse(e.target.value)}
            >
              {['32.5', '42.5', '52.5'].map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Erhärtung</label><InfoTooltip text={inhalt.werte.geschwindigkeitDerFestigkeitsentwicklung} /></div>
            <select aria-label="Erhärtung" 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-middle-blue"
              value={erhaertungsgeschwindigkeit}
              onChange={(e) => setErhaertungsgeschwindigkeit(e.target.value)}
            >
              <option value="L">L (Langsam)</option>
              <option value="N">N (Normal)</option>
              <option value="R">R (Schnell)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Zusatzstoff</label><InfoTooltip text={inhalt.werte.artDesVerwendetenBetonzusatzstoffs} /></div>
            <div className="flex gap-2">
              <select aria-label="Zusatzstoff" 
                className="flex-1 p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-middle-blue"
                value={zusatzstoff}
                onChange={(e) => {
                  setZusatzstoff(e.target.value);
                  if (e.target.value === 'Ohne') setZusatzstoffMenge(0);
                }}
              >
                <option value="Ohne">Ohne</option>
                <option value="FA">Flugasche (FA)</option>
                <option value="SF">Silikastaub (SF)</option>
              </select>
            </div>
          </div>
        </div>

        {zusatzstoff !== 'Ohne' && (
          <Slider
            label={inhalt.werte.zusatzstoffMenge}
            min={0} max={150} step={5}
            value={zusatzstoffMenge} unit="kg/m³"
            info={inhalt.werte.mengeDesZusatzstoffsBeeinflusst}
            onChange={(e) => setZusatzstoffMenge(Number(e.target.value))}
          />
        )}

        <Slider
          label={inhalt.werte.zementgehaltZ}
          min={250} max={450} step={10}
          value={zement} unit="kg/m³"
          
          onChange={(e) => setZement(Number(e.target.value))}
        />
        
        <Slider
          label={inhalt.werte.umgebungstemperaturTC}
          min={0} max={40} step={1}
          value={tempC} unit="°C"
          info={inhalt.werte.temperaturDerUmgebungBeeinflusst}
          onChange={(e) => setTempC(Number(e.target.value))}
        />

        <Slider
          label="Frischbetontemperatur"
          min={10} max={35} step={1}
          value={frischbetonTemp} unit="°C"
          info={inhalt.werte.temperaturDesBetonsBeim}
          onChange={(e) => setFrischbetonTemp(Number(e.target.value))}
        />

        <Slider
          label={inhalt.werte.bauteildickeMassigkeit}
          min={0.1} max={3.0} step={0.1}
          value={bauteildicke} unit="m"
          
          onChange={(e) => setBauteildicke(Number(e.target.value))}
        />

        <Slider
          label={inhalt.werte.erforderlicheAusschalfestigkeit}
          min={30} max={80} step={5}
          value={ausschalFestigkeit} unit="% von f_ck"
          info={inhalt.werte.prozentsatzDerCharakteristischenDruckfes}
          onChange={(e) => setAusschalFestigkeit(Number(e.target.value))}
        />

        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Reifeverfahren</label><InfoTooltip text={inhalt.werte.berechnungsmodellFürDasÄquivalentalter} /></div>
          <select aria-label="Reifeverfahren" 
            className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-middle-blue text-sm"
            value={reifeVerfahren}
            onChange={(e) => setReifeVerfahren(e.target.value)}
          >
            {['Arrhenius', inhalt.werte.fibModelCode2010, 'Saul', inhalt.werte.din10453Rastrup, REIFEVERFAHREN[4]].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {reifeVerfahren === 'Arrhenius' && (
          <Slider
            label={inhalt.werte.aktivierungsenergieEA}
            min={30} max={60} step={1}
            value={aktivierungsEnergie} unit="kJ/mol"
            info={inhalt.werte.scheinbareAktivierungsenergieBeschreibtD}
            onChange={(e) => setAktivierungsEnergie(Number(e.target.value))}
          />
        )}

        {reifeVerfahren === 'gewogene Reife nach NEN 5970' && (
          <>
            <Slider
              label={inhalt.werte.gewogeneReifeC}
              min={GEWOGENE_REIFE_C.min} max={GEWOGENE_REIFE_C.max} step={0.05}
              value={cGewogen} unit="–"
              info={inhalt.werte.gewogeneReifeCInfo}
              onChange={(e) => setCGewogen(Number(e.target.value))}
            />
            <p className="text-[11px] text-text-main/70 leading-relaxed"><MdText text={inhalt.werte.gewogeneReifeHinweis} /></p>
          </>
        )}

        <EingabeHinweise hinweise={ergebnis.hinweise} />

        <div className="mt-4 p-4 bg-off-white rounded-xl border border-home-grau/50 text-sm">
          <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.reifefunktionÄquivalentalter} /></h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-main/80"><MdText text={inhalt.texte.nach28TagenReal} /></span>
            <span className="text-middle-blue font-bold text-lg">{formatDeZahl(te28, 1)} Tage</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-main/80"><MdText text={inhalt.texte.ausschalfristCa} /></span>
            <span className="text-middle-blue font-bold text-lg">{ausschalTage !== null ? `${formatDeWert(ausschalTage)} Tage` : '> 28 Tage'}</span>
          </div>
          <p className="text-text-main/80 text-xs mt-2"><MdText text={inhalt.texte.dasÄquivalentalterBeschreibtDie} /></p>
        </div>

        <div className="mt-4 p-4 bg-off-white rounded-xl border border-home-grau/50 text-sm">
          <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.thermischeRissgefahr} /></h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-main/80"><MdText text={inhalt.texte.maxTKernRand} /></span>
            <span className="font-bold">{formatDeZahl(maxTempDiff, 1)} K</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-main/80">Rissgefahr:</span>
            <span className={`font-bold ${rissgefahr === 'Hoch' ? 'text-red-500' : rissgefahr === 'Mittel' ? 'text-yellow-500' : 'text-green-500'}`}>{rissgefahr}</span>
          </div>
          <p className="text-text-main/80 text-xs mt-2"><MdText text={inhalt.texte.einTemperaturunterschiedVonMehr} /></p>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FESTIGKEITS- & STEIFIGKEITSENTWICKLUNG (DRUCK, ZUG, E-MODUL) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="text-shiraz" size={20} />
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.festigkeitsSteifigkeitsentwicklung} /></h3>
                </div>
              </div>

              {/* Modus-Umschalter */}
              <AuswahlGruppe label="Festigkeitsdarstellung" className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-home-grau/25 mb-3 text-xs font-semibold">
                <button {...alsOption(festigkeitsModus === 'relativ')}
                  type="button"
                  onClick={() => setFestigkeitsModus('relativ')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    festigkeitsModus === 'relativ'
                      ? 'bg-shiraz text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  title={inhalt.werte.vergleichtDruckZugfestigkeitUnd}
                >
                  [%] Relativ
                </button>
                <button {...alsOption(festigkeitsModus === 'druck')}
                  type="button"
                  onClick={() => setFestigkeitsModus('druck')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    festigkeitsModus === 'druck'
                      ? 'bg-shiraz text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  title={inhalt.werte.druckfestigkeitsverlaufFCmT}
                >
                  [MPa] Druck
                </button>
                <button {...alsOption(festigkeitsModus === 'zug')}
                  type="button"
                  onClick={() => setFestigkeitsModus('zug')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    festigkeitsModus === 'zug'
                      ? 'bg-shiraz text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  title={inhalt.werte.zugfestigkeitsverlaufFCtmT}
                >
                  [MPa] Zug
                </button>
                <button {...alsOption(festigkeitsModus === 'emodul')}
                  type="button"
                  onClick={() => setFestigkeitsModus('emodul')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    festigkeitsModus === 'emodul'
                      ? 'bg-shiraz text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  title={inhalt.werte.elastizitätsmodulECmT}
                ><MdText text={inhalt.texte.gpaEModul} /></button>
                <button {...alsOption(festigkeitsModus === 'alle_absolut')}
                  type="button"
                  onClick={() => setFestigkeitsModus('alle_absolut')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    festigkeitsModus === 'alle_absolut'
                      ? 'bg-shiraz text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  title={inhalt.werte.kombinierteDarstellungAllerAbsoluten}
                ><MdText text={inhalt.texte.kombiAbsolut} /></button>
              </AuswahlGruppe>

              {/* KPI Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px] font-mono">
                <span className="bg-red-50 text-red-900 border border-red-200 px-2 py-0.5 rounded-md font-bold" title={inhalt.werte.t28TageMittelwertDruckfestigkeit}>
                  f_cm,28 = {formatDeZahl(fcm28, 1)} MPa
                </span>
                <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-md font-bold" title={inhalt.werte.t28TageMittelwertZentrische}>
                  f_ctm,28 = {formatDeZahl(fctm28, 2)} MPa
                </span>
                <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md font-bold" title={inhalt.werte.t28TageMittelwertElastizitätsmodul}>
                  E_cm,28 = {formatDeZahl(Ecm28, 1)} GPa
                </span>
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-semibold" title={inhalt.werte.erreichteAusschalfrist}>
                  Ausschalzeit: {ausschalTage !== null ? `${formatDeZahl(ausschalTage, 1)} d` : '> 28 d'}
                </span>
              </div>
            </div>

            <div className="h-[260px] relative w-full">
              <Line 
                data={strength} 
                options={strengthOptions} 
              />
            </div>

            {/* Fachtechnischer Didaktik-Hinweis */}
            <div className="mt-3 pt-2.5 border-t border-home-grau/20 text-[11px] text-text-main/80 flex items-start gap-1.5 leading-relaxed bg-off-white/80 p-2.5 rounded-xl border border-home-grau/30">
              <Info className="text-shiraz shrink-0 mt-0.5" size={14} />
              <span><MdText text={inhalt.texte.kinetikNachEc2Din} /><strong>{formatDeZahl(E_2d_rel, 0)} % ({formatDeZahl(E_2d_val, 1)} GPa)</strong><MdText text={inhalt.texte.währendDieDruckfestigkeitErst} /><strong>{formatDeZahl(fc_2d_rel, 0)} % ({formatDeZahl(fc_2d_val, 1)} MPa)</strong><MdText text={inhalt.texte.liegtDieZugfestigkeitF} />{formatDeZahl(fct_2d_val, 2)}<MdText text={inhalt.texte.mpaBei2d} /></span>
            </div>

            <FormulaDerivationBox
              live
              title={inhalt.werte.ihrRechenwegFestigkeitNach}
              zielGleichung={`f_{cm}(2\\,\\text{d}) = \\beta_{cc}(t_e) \\cdot f_{cm} = ${formatDeTeX(fc_2d_val, 1)}\\,\\text{N/mm}^2`}
              normQuelle={inhalt.werte.dinEn19921}
              schritte={[
                {
                  titel: '28-Tage-Kennwerte',
                  erklaerung: `Rechenwert f_ck = ${formatDeZahl(fckRechen, 1)} N/mm² aus der gewählten Zementfestigkeitsklasse (Lehrvereinfachung: die Normfestigkeit des Zements nach DIN EN 196-1 wird als Beton-f_ck angesetzt; die tatsächliche Betonfestigkeit hängt vor allem vom w/z-Wert ab).`,
                  formel: `f_{cm} = ${formatDeTeX(fckRechen, 1)} + 8 = ${formatDeTeX(fcm28, 1)};\\quad f_{ctm} = 0{,}30 \\cdot ${formatDeTeX(fckRechen, 1)}^{2/3} = ${formatDeTeX(fctm28, 2)}\\,\\text{N/mm}^2;\\quad E_{cm} = 22 \\cdot \\left(\\tfrac{${formatDeTeX(fcm28, 1)}}{10}\\right)^{0{,}3} = ${formatDeTeX(Ecm28, 1)}\\,\\text{GPa}`,
                },
                {
                  titel: inhalt.werte.wirksamesBetonalter,
                  erklaerung: `Reifeverfahren „${reifeVerfahren}“: Die Kerntemperatur wird in Zeitschritten von 0,1 d über einen Temperaturfaktor k_T aufsummiert.`,
                  formel: `t_e(2\\,\\text{d}) = \\sum k_T(T_{Kern}) \\cdot \\Delta t = ${formatDeTeX(te2d, 2)}\\,\\text{d}`,
                },
                {
                  titel: inhalt.werte.zeitbeiwertDerFestigkeit,
                  erklaerung: `Zementbeiwert s = ${formatDeZahl(sBeiwert, 2)} (Festigkeitsklasse und Erhärtungsgeschwindigkeit).`,
                  formel: `\\beta_{cc}(t_e) = \\exp\\left[${formatDeTeX(sBeiwert, 2)} \\cdot \\left(1 - \\sqrt{\\tfrac{28}{${formatDeTeX(te2d, 2)}}}\\right)\\right] = ${formatDeTeX(beta2d, 3)}`,
                },
                {
                  titel: inhalt.werte.kennwerteNach2Tagen,
                  erklaerung: inhalt.werte.zugfestigkeitMitCc1,
                  formel: `f_{cm} = ${formatDeTeX(beta2d, 3)} \\cdot ${formatDeTeX(fcm28, 1)} = ${formatDeTeX(fc_2d_val, 1)};\\quad f_{ctm} = ${formatDeTeX(beta2d, 3)} \\cdot ${formatDeTeX(fctm28, 2)} = ${formatDeTeX(fct_2d_val, 2)}\\,\\text{N/mm}^2;\\quad E_{cm} = ${formatDeTeX(beta2d, 3)}^{0{,}3} \\cdot ${formatDeTeX(Ecm28, 1)} = ${formatDeTeX(E_2d_val, 1)}\\,\\text{GPa}`,
                },
                {
                  titel: 'Ausschalfrist',
                  erklaerung: `Ausgeschalt werden darf, sobald f_ck(t_e) = β_cc(t_e)·f_cm − 8 (DIN EN 1992-1-1, 3.1.2(5); ab t_e = 28 d gilt f_ck) den gewählten Anteil von ${formatDeZahl(ausschalFestigkeit, 0)} % von f_ck erreicht.`,
                  formel: ausschalTage !== null
                    ? `f_{ck}(t_e) = \\beta_{cc}(t_e) \\cdot f_{cm} - 8 \\ge ${formatDeTeX(ausschalFestigkeit / 100, 2)} \\cdot f_{ck} \\;\\Rightarrow\\; t = ${formatDeTeX(ausschalTage, 1)}\\,\\text{d}`
                    : `f_{ck}(t_e) < ${formatDeTeX(ausschalFestigkeit / 100, 2)} \\cdot f_{ck} \\;\\text{bis}\\; t = 28\\,\\text{d}`,
                },
              ]}
              ergebnisHinweis={`Nach 2 Tagen: f_cm = ${formatDeZahl(fc_2d_val, 1)} MPa, f_ctm = ${formatDeZahl(fct_2d_val, 2)} MPa, E_cm = ${formatDeZahl(E_2d_val, 1)} GPa`}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[460px]">
            <h3 className="text-lg font-bold text-text-main mb-4">Temperaturentwicklung</h3>
            <div className="flex-1 relative w-full h-full">
              <Line 
                data={temperature} 
                options={{
                  ...commonOptions,
                  scales: {
                    ...commonOptions.scales,
                    y: {
                      min: 0,
                      max: 100,
                      title: { display: true, text: inhalt.werte.temperaturC, font: { family: 'Work Sans', weight: 'bold' as const } }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Schematische Darstellung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungTemperaturverteil} /></h3>
          <div className="relative w-full h-48 bg-off-white rounded-lg border border-home-grau/30 overflow-hidden flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
              {/* Bauteil (Querschnitt) */}
              <rect x="100" y="40" width="200" height="120" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
              
              {/* Temperatur-Farbverlauf (Kern heiß, Rand kühler) */}
              <defs>
                <radialGradient id="tempGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="rgba(239, 68, 68, 0.6)" /> {/* Rot (Heiß) */}
                  <stop offset="70%" stopColor="rgba(250, 204, 21, 0.3)" /> {/* Gelb (Mittel) */}
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" /> {/* Blau (Kühl) */}
                </radialGradient>
              </defs>
              <rect x="100" y="40" width="200" height="120" fill="url(#tempGrad)" />

              {/* Temperaturkurve (Parabel) */}
              <path d="M 100 120 Q 200 40 300 120" fill="none" stroke="#A3113E" strokeWidth="3" strokeDasharray="5 5" />
              
              {/* Beschriftungen */}
              <text x="200" y="90" fontSize="12" fill="#A3113E" textAnchor="middle" fontWeight="bold">T_Kern</text>
              <text x="110" y="110" fontSize="12" fill="#475569" textAnchor="start" fontWeight="bold">T_Rand</text>
              <text x="290" y="110" fontSize="12" fill="#475569" textAnchor="end" fontWeight="bold">T_Rand</text>

              {/* ΔT Pfeil */}
              <path d="M 200 95 L 200 120" stroke="#334155" strokeWidth="1" markerStart="url(#arrow-dark)" markerEnd="url(#arrow-dark)" />
              <text x="205" y="110" fontSize="10" fill="#334155">ΔT</text>

              {/* Umgebungstemperatur */}
              <text x="50" y="100" fontSize="12" fill="#64748b" textAnchor="middle">T_Umgebung</text>
              <path d="M 70 100 L 90 100" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-gray)" />
              <path d="M 330 100 L 310 100" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-gray)" />

              <defs>
                <marker id="arrow-dark" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
                </marker>
                <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
