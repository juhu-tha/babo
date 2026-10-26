import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  Layers, 
  ThermometerSun, 
  BookOpen, 
  ShieldAlert, 
  Gauge, 
  TrendingDown, 
  Wind, 
  Flame, 
  Trash2,
  CheckCircle2, 
  AlertTriangle,
  FileText,
  HardHat,
  Clock,
  Sparkles
} from 'lucide-react';
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
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import inhalt from '@/content/asphalt/Asphalt.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type AsphaltReiter = 'steckbrief' | 'grundlagen' | 'arten' | 'eigenschaften' | 'nta';
const REITER: readonly ModulTab<AsphaltReiter>[] = [
  { id: 'steckbrief', label: 'Baustoff-Steckbrief', icon: BookOpen },
  { id: 'grundlagen', label: inhalt.texte.grundlagenZusammensetzung.trim(), icon: Layers },
  { id: 'arten', label: 'Asphaltarten', icon: Layers },
  { id: 'eigenschaften', label: inhalt.texte.materialProdukteigenschaften.trim(), icon: Layers },
  { id: 'nta', label: inhalt.texte.niedrigtemperaturasphalteNta.trim(), icon: ThermometerSun },
];

export default function Asphalt() {
  const [activeTab, setActiveTab] = useState<AsphaltReiter>('steckbrief');
  const [bitumen, setBitumen] = useState(5.0); // M.-%
  const [hohlraum, setHohlraum] = useState(3.0); // Vol.-%
  const [rhoG, setRhoG] = useState(2.65); // g/cm³
  const [rhoB, setRhoB] = useState(1.03); // g/cm³

  // Niedrigtemperaturasphalt (LTA/NTA) states
  const [ltaMethod, setLtaMethod] = useState<'organic' | 'zeolite' | 'foamed' | 'standard'>('organic');
  const [ltaTemp, setLtaTemp] = useState<number>(125); // Celsius
  const [ltaRecyclingShare, setLtaRecyclingShare] = useState<number>(30); // %

  const results = useMemo(() => {
    // Raumdichte (Bulk density)
    // 100g Asphalt = bitumen g Bitumen + (100-bitumen) g Gestein
    const volGestein = (100 - bitumen) / rhoG;
    const volBitumen = bitumen / rhoB;
    const volFest = volGestein + volBitumen;
    
    // Hohlraum = V_Luft / V_Gesamt * 100
    // V_Gesamt = V_Fest / (1 - hohlraum/100)
    const volGesamt = volFest / (1 - hohlraum / 100);
    const raumdichte = 100 / volGesamt; // g/cm³
    
    // Lehrmodell: schematische Marshall-Kurve mit Optimum bei 5,5 M.-% (keine Prüfwerte)
    // Optimaler Bitumengehalt oft bei ~5-6%
    const optimalBitumen = 5.5;
    const diff = Math.abs(bitumen - optimalBitumen);
    const marshall = Math.max(2, 12 - diff * 2); // kN

    const labels = [];
    const marshallData = [];
    const currentPointData = [];

    for (let b = 2; b <= 10; b += 0.5) {
      labels.push(b.toFixed(1));
      const currentDiff = Math.abs(b - optimalBitumen);
      const currentMarshall = Math.max(2, 12 - currentDiff * 2);
      marshallData.push(currentMarshall);
      if (Math.abs(b - bitumen) < 0.25) {
        currentPointData.push(marshall);
      } else {
        currentPointData.push(null);
      }
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: inhalt.werte.marshallStabilitätKnLehrmodell,
          data: marshallData,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.4,
        },
        {
          label: inhalt.werte.aktuellerWert,
          data: currentPointData,
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        }
      ]
    };

    return { raumdichte, marshall, chartData };
  }, [bitumen, hohlraum, rhoG, rhoB]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        title: { display: true, text: inhalt.werte.bitumengehaltM, font: { weight: 'bold' as const } }
      },
      y: {
        title: { display: true, text: inhalt.werte.marshallStabilitätKn, font: { weight: 'bold' as const } },
        min: 0,
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.asphaltBitumen} /></h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.asphaltIstEinViskoelastisches} /></p>
        </div>

        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">
        <div className="flex flex-col gap-6">

        {activeTab === 'grundlagen' && (
          <>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
              <p><MdText text={inhalt.texte.asphaltIstEinGemisch} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                  <Slider label="Bitumengehalt" info={inhalt.werte.massenanteilDesBitumensIm} min={2} max={10} step={0.1} value={bitumen} unit="M.-%" onChange={(e) => setBitumen(Number(e.target.value))} />
                  <div className="mt-4"><Slider label="Hohlraumgehalt"  min={1} max={10} step={0.5} value={hohlraum} unit="Vol.-%" onChange={(e) => setHohlraum(Number(e.target.value))} /></div>
                  <div className="mt-4"><Slider label={inhalt.werte.dichteGestein} info={inhalt.werte.rohdichteDerVerwendetenGesteinskörnung} min={2.5} max={3.0} step={0.05} value={rhoG} unit="g/cm³" onChange={(e) => setRhoG(Number(e.target.value))} /></div>
                  <div className="mt-4"><Slider label={inhalt.werte.dichteBitumen}  min={1.0} max={1.1} step={0.01} value={rhoB} unit="g/cm³" onChange={(e) => setRhoB(Number(e.target.value))} /></div>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="bg-shiraz text-white p-6 rounded-xl shadow-md">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Ergebnisse</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><div className="text-white/70 text-sm">Raumdichte</div><div className="text-3xl font-bold">{formatDeZahl(results.raumdichte, 3)} g/cm³</div></div>
                    <div><div className="text-white/70 text-sm"><MdText text={inhalt.texte.marshallStabilitätLehrmodell} /></div><div className="text-3xl font-bold">{formatDeZahl(results.marshall, 1)} kN</div></div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-home-grau/30 h-[300px] flex flex-col">
                  <h3 className="text-sm font-bold text-center mb-2"><MdText text={inhalt.texte.marshallStabilitätVsBitumengehalt} /></h3>
                  <div className="flex-1 relative">
                    <Line data={results.chartData} options={chartOptions} />
                  </div>
                </div>

                {/* Schematische Darstellung */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
                  <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungAsphaltzusammense} /></h3>
                  <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                    <svg width="100%" height="160" viewBox="0 0 350 160">
                      {/* Gesteinskörnung */}
                      <path d="M 100 80 Q 110 60 130 70 T 150 90 T 120 110 Z" fill="#94a3b8" />
                      <path d="M 160 50 Q 180 40 200 60 T 180 80 T 150 70 Z" fill="#64748b" />
                      <path d="M 210 70 Q 230 60 250 80 T 230 110 T 200 90 Z" fill="#94a3b8" />
                      <path d="M 140 100 Q 160 90 180 110 T 160 130 T 130 120 Z" fill="#475569" />
                      <path d="M 180 110 Q 200 100 220 120 T 200 140 T 170 130 Z" fill="#64748b" />
                      
                      {/* Bitumen (Bindemittel) */}
                      <path d="M 130 70 Q 150 80 160 50 Q 150 60 130 70 Z" fill="#1e293b" />
                      <path d="M 150 90 Q 180 80 200 60 Q 180 70 150 90 Z" fill="#1e293b" />
                      <path d="M 180 110 Q 200 90 210 70 Q 200 80 180 110 Z" fill="#1e293b" />
                      <path d="M 120 110 Q 140 100 150 90 Q 140 110 120 110 Z" fill="#1e293b" />
                      <path d="M 160 130 Q 180 110 200 120 Q 180 130 160 130 Z" fill="#1e293b" />

                      {/* Hohlräume */}
                      <circle cx="145" cy="80" r="4" fill="#ffffff" />
                      <circle cx="190" cy="70" r="5" fill="#ffffff" />
                      <circle cx="170" cy="100" r="3" fill="#ffffff" />
                      <circle cx="210" cy="95" r="4" fill="#ffffff" />

                      {/* Legende */}
                      <rect x="20" y="20" width="15" height="15" fill="#64748b" />
                      <text x="45" y="32" fontSize="10" fill="#1e293b">Gestein</text>
                      
                      <rect x="20" y="45" width="15" height="15" fill="#1e293b" />
                      <text x="45" y="57" fontSize="10" fill="#1e293b">Bitumen</text>
                      
                      <rect x="20" y="70" width="15" height="15" fill="#ffffff" stroke="#cbd5e1" />
                      <text x="45" y="82" fontSize="10" fill="#1e293b">Hohlraum</text>
                    </svg>
                    <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.asphaltIstEin3} /></div>
                  </div>
                </div>
              </div>
            </div>
            <FormulaDerivationBox
              title={inhalt.werte.anwendungsbeispielRaumdichteAusZusammens}
              zielGleichung="\rho_b = \rho_m \cdot \left(1 - \frac{V_m}{100}\right), \quad \rho_m = \frac{100}{\frac{100 - B}{\rho_G} + \frac{B}{\rho_B}}"
              normQuelle={inhalt.werte.vglDinEn12697}
              schritte={inhalt.daten["Asphalt.schritte"]}
              ergebnisHinweis={inhalt.werte.b238G}
            />
          </>
        )}

        {activeTab === 'arten' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <p><MdText text={inhalt.texte.asphaltartenAsphaltmischgüterImStraßenba} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asphaltbeton */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-stone-500 flex flex-col h-full">
                <div className="mb-3">
                  <h3 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.asphaltbetonAc} /></h3>
                  <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.asphaltConcrete} /></p>
                </div>
                <p className="text-sm text-gray-700 mb-4 flex-1"><MdText text={inhalt.texte.derStandardAsphaltEr} /></p>
                <div className="text-xs text-gray-600 bg-stone-50 p-3 rounded-lg border border-home-grau/30"><MdText text={inhalt.texte.einsatzFürTragBinder} /></div>
              </div>

              {/* Splittmastixasphalt */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-shiraz flex flex-col h-full">
                <div className="mb-3">
                  <h3 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.splittmastixasphaltSma} /></h3>
                  <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.stoneMasticAsphalt} /></p>
                </div>
                <p className="text-sm text-gray-700 mb-4 flex-1"><MdText text={inhalt.texte.besitztEinGrobesHohlraumreiches} /></p>
                <div className="text-xs text-gray-600 bg-stone-50 p-3 rounded-lg border border-home-grau/30"><MdText text={inhalt.texte.einsatzDeckschichtenBeiHoher} /></div>
              </div>

              {/* Gussasphalt */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-amber-600 flex flex-col h-full">
                <div className="mb-3">
                  <h3 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.gussasphaltMa} /></h3>
                  <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.masticAsphalt} /></p>
                </div>
                <p className="text-sm text-gray-700 mb-4 flex-1"><MdText text={inhalt.texte.einHohlraumfreierUndWasserdichter} /></p>
                <div className="text-xs text-gray-600 bg-stone-50 p-3 rounded-lg border border-home-grau/30"><MdText text={inhalt.texte.einsatzBrückenbelägeParkdecksHochbelaste} /></div>
              </div>

              {/* Offenporiger Asphalt */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-blue-500 flex flex-col h-full">
                <div className="mb-3">
                  <h3 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.offenporigerAsphaltOpa} /></h3>
                  <p className="text-xs text-text-main/70">Flüsterasphalt</p>
                </div>
                <p className="text-sm text-gray-700 mb-4 flex-1"><MdText text={inhalt.texte.einAsphaltMitSehr} /></p>
                <div className="text-xs text-gray-600 bg-stone-50 p-3 rounded-lg border border-home-grau/30"><MdText text={inhalt.texte.einsatzLärmminderungAufSchnell} /></div>
              </div>
            </div>
            
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 mt-2">
               <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.schichtaufbauKlassisch} /></h3>
               <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-home-grau/30">
                 <div className="relative pl-10">
                   <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold border-4 border-off-white z-10">1</div>
                   <div className="bg-white p-3 rounded-lg border border-home-grau/30 shadow-sm">
                     <div className="font-bold text-sm"><MdText text={inhalt.texte.deckschichtZBSma} /></div>
                     <div className="text-xs text-gray-600"><MdText text={inhalt.texte.ca25Cm} /></div>
                   </div>
                 </div>
                 <div className="relative pl-10">
                   <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center text-white text-xs font-bold border-4 border-off-white z-10">2</div>
                   <div className="bg-white p-3 rounded-lg border border-home-grau/30 shadow-sm">
                     <div className="font-bold text-sm"><MdText text={inhalt.texte.binderschichtZBAc} /></div>
                     <div className="text-xs text-gray-600"><MdText text={inhalt.texte.ca410Cm} /></div>
                   </div>
                 </div>
                 <div className="relative pl-10">
                   <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-800 text-xs font-bold border-4 border-off-white z-10">3</div>
                   <div className="bg-white p-3 rounded-lg border border-home-grau/30 shadow-sm">
                     <div className="font-bold text-sm"><MdText text={inhalt.texte.tragschichtZBAc} /></div>
                     <div className="text-xs text-gray-600"><MdText text={inhalt.texte.ca820Cm} /></div>
                   </div>
                 </div>
               </div>
            </div>
            
          </div>
        )}

        {activeTab === 'eigenschaften' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.materialUndProdukteigenschaftenAsphalt} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Viskoelastizität</h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.dasVerformungsverhaltenVonAsphalt} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li><MdText text={inhalt.texte.hoheTemperaturenLangeBelastung} /></li>
                  <li><MdText text={inhalt.texte.tiefeTemperaturenKurzeBelastung} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Ermüdungswiderstand</h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.unterWiederholterVerkehrsbelastungEntste} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li><MdText text={inhalt.texte.abhängigVomBindemittelgehaltUnd} /></li>
                  <li><MdText text={inhalt.texte.polymermodifizierteBitumenPmbVerbessern} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Verformungswiderstand</h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.derWiderstandGegenBleibende} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li><MdText text={inhalt.texte.wirdDurchEineStandfeste} /></li>
                  <li><MdText text={inhalt.texte.harteBitumensortenOderPmb} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.griffigkeitLärmminderung} /></h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.oberflächeneigenschaftenDerDeckschichtDi} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li><MdText text={inhalt.texte.griffigkeitHängtVonDer} /></li>
                  <li><MdText text={inhalt.texte.lärmminderungOffenporigeAsphalteOpa} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nta' && (() => {
          // Dynamic calculation model for LTA/NTA
          // Viscosity curve calculation (Pa·s)
          let viscosity = 0.4 * Math.pow(1.06, 165 - ltaTemp);
          if (ltaMethod === 'organic') {
            if (ltaTemp >= 110) {
              viscosity *= 0.38; // Wax melting lubrication effect
            }
          } else if (ltaMethod === 'zeolite') {
            if (ltaTemp >= 105) {
              viscosity *= 0.52; // Synthetic steam foaming effect
            }
          } else if (ltaMethod === 'foamed') {
            if (ltaTemp >= 105) {
              viscosity *= 0.48; // Micro-foaming expansion effect
            }
          }

          // Workability & Compactor rating
          let ratingColor = "bg-green-50 text-green-800 border-green-200";
          let ratingBadge = inhalt.werte.optimalVerarbeitbar;
          let ratingText = inhalt.werte.viskositätImIdealenBereich;
          
          if (viscosity > 4.5) {
            ratingColor = "bg-red-50 text-red-800 border-red-200";
            ratingBadge = inhalt.werte.ungenügendKritischerGrenzstopp;
            ratingText = inhalt.werte.bindemittelIstVielZu;
          } else if (viscosity > 1.8) {
            ratingColor = "bg-amber-50 text-amber-800 border-amber-200";
            ratingBadge = inhalt.werte.erschwertVerdichtbarGrenzbereich;
            ratingText = inhalt.werte.erhöhterScherwiderstandErfordertSofortig;
          }

          // Fumes & Aerosols calculation of bitumen (Exponential Arrhenius-like scale)
          // Threshold of 1.5 mg/m³ is new German legal limit (TRGS 900 AGW-Grenzwert)
          const fumesValue = 0.045 * Math.exp(0.029 * ltaTemp);
          const fumesPctOfLimit = Math.round((fumesValue / 1.5) * 100);
          const fumesReduction = ltaTemp >= 165 ? 0 : Math.round((1 - (fumesValue / (0.045 * Math.exp(0.029 * 165)))) * 100);

          // Energy Savings Calc
          const baseEnergy = 88; // kWh per ton of asphalt mixed at 165°C (approx 9L fuel oil)
          const energyConsumed = baseEnergy * (1 + (ltaTemp - 165) * 0.0102); // ~1% change per degree
          const energySavedPercent = Math.max(0, Math.round(((baseEnergy - energyConsumed) / baseEnergy) * 100));
          const fuelSavedLiters = Math.max(0, (baseEnergy - energyConsumed) / 10); // 1L ~ 10kWh

          // CO2 emissions calculation with recycling benefits
          const baseCo2 = 22.0; // kg CO2-equivalent per ton of standard hot mix asphalt
          const co2FromEnergy = baseCo2 * (energyConsumed / baseEnergy);
          // Recycling share substitution offsets (gravel and primary bitumen raw extraction, approx 0.14 kg CO2 per % share)
          const totalCo2 = Math.max(3.5, co2FromEnergy - (ltaRecyclingShare * 0.13));
          const co2SavedPercent = Math.max(0, Math.round(((baseCo2 - totalCo2) / baseCo2) * 100));

          // Compaction Time Window Calculation (minutes)
          // Standard Newton-cooling model from initial temp down to method's limit temp
          let limitTemp = 130; // standard cold compaction limit
          if (ltaMethod === 'organic') limitTemp = 85; // wax lowers the plasticity point
          else if (ltaMethod === 'zeolite') limitTemp = 95;
          else if (ltaMethod === 'foamed') limitTemp = 90;

          let coolingWindow = 0;
          if (ltaTemp > limitTemp) {
            // Ambient temperature of 15°C
            const logRatio = Math.log((ltaTemp - 15) / (limitTemp - 15));
            // Layer thickness of 4cm assumed (factor ~38)
            coolingWindow = Math.round(38 * logRatio);
          }

          return (
            <div className="flex flex-col gap-8 animate-in fade-in duration-300">
              
              {/* Introduction Banner */}
              <div className="bg-gradient-to-r from-stone-900 to-slate-800 text-white p-6 rounded-2xl border border-stone-800 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1 max-w-2xl">
                  <span className="text-shiraz font-mono text-xs tracking-wider uppercase font-semibold">Technologie-Fokus</span>
                  <h3 className="text-xl font-bold tracking-tight"><MdText text={inhalt.texte.nachhaltigerVerkehrswegebauNiedrigtemper} /></h3>
                  <p className="text-xs text-stone-300 leading-relaxed"><MdText text={inhalt.texte.niedrigtemperaturasphaltAuchTemperaturab} /></p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg border border-white/20 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-mono tracking-wide text-stone-300">TRGS 900</span>
                  <span className="text-lg font-bold text-white font-mono">1,5 mg/m³</span>
                  <span className="text-[9px] text-stone-400"><MdText text={inhalt.texte.arbeitsplatzgrenzwertAgw} /></span>
                </div>
              </div>

              {/* TWO COLUMN INTERACTIVE SIMULATOR CARD */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* COLUMN 1: CONTROL PANEL (5 Cols) */}
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-5">
                  <div className="border-b border-home-grau/20 pb-3">
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-text-main flex items-center gap-1.5 font-mono">
                      <Flame size={16} className="text-shiraz" /><MdText text={inhalt.texte.t1ParameterSteuerung} /></h4>
                    <p className="text-[11px] text-text-main/60 mt-0.5"><MdText text={inhalt.texte.wählenSieVerfahrenUnd} /></p>
                  </div>

                  {/* Method Selection Cards */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.absenkungsVerfahrenZusatzmittel} /></label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setLtaMethod('standard'); setLtaTemp(160); }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                          ltaMethod === 'standard' 
                            ? 'bg-stone-50 border-stone-800 ring-1 ring-stone-800' 
                            : 'bg-white border-home-grau/20 hover:bg-stone-50'
                        }`}
                      >
                        <span className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.aStandardHeißmix} /></span>
                        <span className="text-[10px] text-text-main/50 font-mono"><MdText text={inhalt.texte.ohneAdditive145180} /></span>
                      </button>

                      <button
                        onClick={() => { setLtaMethod('organic'); setLtaTemp(125); }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                          ltaMethod === 'organic' 
                            ? 'bg-shiraz/5 border-shiraz ring-1 ring-shiraz' 
                            : 'bg-white border-home-grau/20 hover:bg-shiraz/5'
                        }`}
                      >
                        <span className="font-bold text-xs text-shiraz flex items-center gap-1"><MdText text={inhalt.texte.bOrganischeWachse} /><Sparkles size={11} />
                        </span>
                        <span className="text-[10px] text-text-main/50 font-mono"><MdText text={inhalt.texte.fischerTropschMontan} /></span>
                      </button>

                      <button
                        onClick={() => { setLtaMethod('zeolite'); setLtaTemp(130); }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                          ltaMethod === 'zeolite' 
                            ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600' 
                            : 'bg-white border-home-grau/20 hover:bg-blue-50'
                        }`}
                      >
                        <span className="font-bold text-xs text-blue-800"><MdText text={inhalt.texte.cMineralischeZeolithe} /></span>
                        <span className="text-[10px] text-text-main/50 font-mono">Mikro-Siede-Aufschäumung</span>
                      </button>

                      <button
                        onClick={() => { setLtaMethod('foamed'); setLtaTemp(120); }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                          ltaMethod === 'foamed' 
                            ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600' 
                            : 'bg-white border-home-grau/20 hover:bg-amber-50'
                        }`}
                      >
                        <span className="font-bold text-xs text-amber-800"><MdText text={inhalt.texte.dSchaumbitumen} /></span>
                        <span className="text-[10px] text-text-main/50 font-mono"><MdText text={inhalt.texte.wasserinjektionImWerk} /></span>
                      </button>
                    </div>
                  </div>

                  {/* Temperature Slider */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30">
                    <Slider 
                      label={inhalt.werte.verarbeitungstemperaturC} 
                      info={inhalt.werte.dieIstMischguttemperaturBeim} 
                      min={100} 
                      max={180} 
                      step={5} 
                      value={ltaTemp} 
                      unit="°C" 
                      onChange={(e) => setLtaTemp(Number(e.target.value))} 
                    />
                    
                    <div className="mt-3 flex justify-between items-center text-[10px] font-mono text-text-main/60 border-t border-home-grau/20 pt-2">
                      <span className={ltaTemp < 115 ? "text-red-600 font-bold" : ""}><MdText text={inhalt.texte.t110CNtaUntergrenze} /></span>
                      <span className="text-stone-400">|</span>
                      <span><MdText text={inhalt.texte.t140CNtaObergrenze} /></span>
                      <span className="text-stone-400">|</span>
                      <span className={ltaTemp >= 150 ? "text-amber-700 font-semibold" : ""}><MdText text={inhalt.texte.t160CStandardHeißmix} /></span>
                    </div>
                  </div>

                  {/* Recycling Share Slider */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30">
                    <Slider 
                      label={inhalt.werte.asphaltgranulatAnteilRc} 
                      info={inhalt.werte.prozentualerGewichtsanteilVonRecyceltem} 
                      min={0} 
                      max={60} 
                      step={5} 
                      value={ltaRecyclingShare} 
                      unit="%" 
                      onChange={(e) => setLtaRecyclingShare(Number(e.target.value))} 
                    />
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-text-main/60">
                      <Trash2 size={11} className="text-shiraz" />
                      <span>{ltaRecyclingShare > 40 ? inhalt.werte.hoherRecyclinganteilDieNiedrigere : inhalt.werte.mittelgroßerRecyclinganteilImRegelkreis}</span>
                    </div>
                  </div>

                  {/* Ecological Footprint Equivalent Estimate */}
                  <div className="bg-emerald-50 text-emerald-800 p-4.5 rounded-xl border border-emerald-200">
                    <h5 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-900 mb-1">
                      <TrendingDown size={14} /><MdText text={inhalt.texte.ressourcenEinsparungPro1} /></h5>
                    <p className="text-[11px] text-emerald-800/90 leading-relaxed mb-3"><MdText text={inhalt.texte.durchDieAbsenkungDer} /></p>
                    <div className="grid grid-cols-2 gap-3 mt-1.5">
                      <div className="bg-white/80 p-2.5 rounded-lg text-center border border-emerald-200">
                        <div className="text-[9px] uppercase font-mono text-emerald-900/60">Heizöleinsparung</div>
                        <div className="text-sm font-extrabold text-emerald-950">{formatDeZahl((fuelSavedLiters * 100), 0)} L</div>
                        <div className="text-[9px] text-emerald-700 font-medium">Brennerbrennstoff</div>
                      </div>
                      <div className="bg-white/80 p-2.5 rounded-lg text-center border border-emerald-200">
                        <div className="text-[9px] uppercase font-mono text-emerald-900/60"><MdText text={inhalt.texte.coVermieden} /></div>
                        <div className="text-sm font-extrabold text-emerald-950">{((baseCo2 - totalCo2) * 1000).toLocaleString('de-DE')} kg</div>
                        <div className="text-[9px] text-emerald-700 font-medium">CO₂-Äquivalente</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: COCKPIT / METRICS / REAL-TIME LAB (7 Cols) */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-5">
                  <div className="border-b border-home-grau/20 pb-3">
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-text-main flex items-center gap-1.5 font-mono">
                      <Gauge size={16} className="text-shiraz" /><MdText text={inhalt.texte.t2ModellauswertungLehrmodell} /></h4>
                    <p className="text-[11px] text-text-main/60 mt-0.5"><MdText text={inhalt.texte.vereinfachteModelleMitLehrannahmen} /></p>
                  </div>

                  {/* Indicator A: Viscosity / Compactability */}
                  <div className="bg-off-white p-4.5 rounded-xl border border-home-grau/30 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <Gauge size={14} className="text-text-main/60" />
                        <span className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.viskositätDesBindemittelsRheologie} /></span>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-home-grau/30 text-text-main">
                        {formatDeZahl(viscosity, 2)} Pa·s
                      </span>
                    </div>

                    {/* Simple Custom Color Gauge bar */}
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-blue-400 h-full" style={{ width: '15%' }} title={inhalt.werte.niedrigviskos02Pa}></div>
                      <div className="bg-green-500 h-full" style={{ width: '35%' }} title={inhalt.werte.idealbereich021}></div>
                      <div className="bg-amber-500 h-full" style={{ width: '25%' }} title={inhalt.werte.erschwertVerdichtbar18}></div>
                      <div className="bg-red-500 h-full" style={{ width: '25%' }} title={inhalt.werte.verarbeitbarkeitBlockiert45}></div>
                    </div>

                    {/* Indicator pin overlay position based on viscosity */}
                    <div className="relative w-full h-1">
                      {/* Calculate percentage location on scale */}
                      {(() => {
                        let pct = (viscosity / 6) * 100;
                        if (pct > 99) pct = 99;
                        if (pct < 1) pct = 1;
                        return (
                          <div 
                            className="absolute -top-3.5 -translate-x-1/2 flex flex-col items-center transition-all duration-300" 
                            style={{ left: `${pct}%` }}
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-text-main border-2 border-white shadow-sm"></div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Feasibility Alert Box */}
                    <div className={`p-3 rounded-lg border text-xs leading-relaxed flex gap-2 items-start transition-colors duration-300 ${ratingColor}`}>
                      <div className="mt-0.5">
                        {viscosity > 4.5 ? (
                          <ShieldAlert size={14} className="text-red-700 animate-pulse" />
                        ) : viscosity > 1.8 ? (
                          <AlertTriangle size={14} className="text-amber-700" />
                        ) : (
                          <CheckCircle2 size={14} className="text-green-700" />
                        )}
                      </div>
                      <div>
                        <div className="font-extrabold uppercase tracking-wide text-[10px] mb-0.5">{ratingBadge}</div>
                        <div>{ratingText}</div>
                      </div>
                    </div>
                  </div>

                  {/* Indicator B: Workplace Exposure / Aerosols vs TRGS 900 Grenzwert */}
                  <div className="bg-off-white p-4.5 rounded-xl border border-home-grau/30 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <Wind size={14} className="text-text-main/60" />
                        <span className="text-xs font-bold text-text-main flex items-center gap-1"><MdText text={inhalt.texte.aerosolDampfkonzentrationArbeitsplatzluf} /></span>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        fumesValue > 1.5 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {formatDeZahl(fumesValue, 2)} mg/m³
                      </span>
                    </div>

                    {/* Progress indicator representing exposure compared to law limit (1.5 mg/m³) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-text-main/60">
                        <span><MdText text={inhalt.texte.minimaleFreisetzung} /></span>
                        <span className="text-red-600 font-bold flex items-center gap-0.5">
                          <AlertTriangle size={10} /><MdText text={inhalt.texte.agwLimit15} /></span>
                      </div>
                      <div className="relative w-full bg-stone-200 h-4 rounded overflow-hidden">
                        {/* 100% boundary of the element is 3.0 mg/m³ for visual scale */}
                        <div 
                          className={`h-full transition-all duration-500 ${fumesValue > 1.5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, (fumesValue / 3.0) * 100)}%` }}
                        ></div>
                        {/* Red divider indicating the 1.5 limit at 50% */}
                        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-red-600 z-10"></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] leading-relaxed">
                      <span className="text-text-main/70">
                        {fumesValue > 1.5 ? (
                          <span className="text-red-700 font-semibold"><MdText text={inhalt.texte.modellwertÜberAgwSchutzmaßnahmen} /></span>
                        ) : (
                          <span className="text-green-700 font-semibold"><MdText text={inhalt.texte.modellwertUnterAgwReale} /></span>
                        )}
                      </span>
                      {fumesReduction > 0 && (
                        <span className="text-xs font-extrabold text-emerald-800 shrink-0 font-mono">
                          -{formatDeWert(fumesReduction)}% Aerosole
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Indicator C & D Grid: Energy saving vs CO2 reduction */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Energy Progress panel */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between gap-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-text-main">
                        <Flame size={13} className="text-text-main/50" />
                        <span>Mischwerk-Energieverbrauch</span>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-text-main font-mono">
                          {formatDeZahl(energyConsumed, 1)} <span className="text-xs text-text-main/50">kWh/t</span>
                        </div>
                        <div className="text-[10px] text-text-main/60"><MdText text={inhalt.texte.standard880Kwh} /></div>
                      </div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-shiraz h-full" style={{ width: `${(energyConsumed / baseEnergy) * 100}%` }}></div>
                      </div>
                      <div className="text-[11px] text-emerald-800 font-extrabold flex items-center gap-1">
                        <CheckCircle2 size={11} /> {formatDeWert(energySavedPercent)}<MdText text={inhalt.texte.wenigerEnergieModell} /></div>
                    </div>

                    {/* CO2 Progress panel */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between gap-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-text-main">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>CO₂-Emissionsbilanz</span>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-text-main font-mono">
                          {formatDeZahl(totalCo2, 1)} <span className="text-xs text-text-main/50">kg/t</span>
                        </div>
                        <div className="text-[10px] text-text-main/60"><MdText text={inhalt.texte.standard220Kg} /></div>
                      </div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full" style={{ width: `${(totalCo2 / baseCo2) * 100}%` }}></div>
                      </div>
                      <div className="text-[11px] text-emerald-800 font-extrabold flex items-center gap-1">
                        <CheckCircle2 size={11} /> {formatDeWert(co2SavedPercent)}<MdText text={inhalt.texte.wenigerCoModell} /></div>
                    </div>
                  </div>

                  {/* Cool down compaction window */}
                  <div className="bg-amber-50/40 border border-amber-200/60 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500/10 p-2 rounded-lg text-amber-700">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h5 className="text-xs font-extrabold text-amber-800 uppercase tracking-wide"><MdText text={inhalt.texte.berechnetesZeitfensterFürWalzverdichtung} /></h5>
                        <p className="text-[11px] text-text-main/70"><MdText text={inhalt.texte.dauerAbAbkippenAuf} /></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-amber-900 font-mono">{formatDeWert(coolingWindow)} Min.</span>
                      <div className="text-[9px] text-amber-700/80 uppercase font-mono tracking-wider"><MdText text={inhalt.texte.verdichtungsfensterModell} /></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* DETAILED ACADEMIC CORE KNOWLEDGE SECTIONS ( Herstellung, Einbau, MAK, Herausforderungen ) */}
              <div className="flex flex-col gap-6">
                
                <h3 className="text-base font-black text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2 mt-4 uppercase tracking-wider font-mono">
                  <BookOpen size={18} className="text-shiraz" /><MdText text={inhalt.texte.systemanalyseVertiefungswissen} /></h3>

                {/* Grid for 4 Core Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Section 1: Herstellung */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-3">
                      <div className="bg-shiraz/10 text-shiraz p-2 rounded-xl">
                        <Flame size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.t1MischanlagentechnikHerstellungIm} /></h4>
                        <p className="text-[10px] text-text-main/50 uppercase tracking-widest font-mono"><MdText text={inhalt.texte.werksprozessDosierung} /></p>
                      </div>
                    </div>

                    <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
                      <p><MdText text={inhalt.texte.dieAbsenkungDerMassetemperatur} /></p>
                      <ul className="list-disc list-inside space-y-2 text-text-main/70 pl-1">
                        <li><MdText text={inhalt.texte.brennersteuerungTrockentrommelDaDie} /></li>
                        <li><MdText text={inhalt.texte.dosierungVonAdditiven} /><ul className="list-circle list-inside pl-4 mt-1 space-y-1">
                            <li><MdText text={inhalt.texte.wachseZBSasobit} /></li>
                            <li><MdText text={inhalt.texte.eindüsungVonSchaumbitumenWasser} /></li>
                          </ul>
                        </li>
                        <li><MdText text={inhalt.texte.kreislaufmaterialAsphaltgranulatZugabeBe} /></li>
                      </ul>
                    </div>
                  </div>

                  {/* Section 2: Einbau */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-3">
                      <div className="bg-blue-600/10 text-blue-700 p-2 rounded-xl">
                        <Layers size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.t2EinbauverfahrenWalzverdichtung} /></h4>
                        <p className="text-[10px] text-text-main/50 uppercase tracking-widest font-mono"><MdText text={inhalt.texte.baustellenpraxisKinetik} /></p>
                      </div>
                    </div>

                    <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
                      <p><MdText text={inhalt.texte.aufDerBaustelleVerhält} /></p>
                      <ul className="list-disc list-inside space-y-2 text-text-main/70 pl-1">
                        <li><MdText text={inhalt.texte.transportlogistikThermomuldenUndAbdeckpl} /></li>
                        <li><MdText text={inhalt.texte.kritischesVerdichtungszeitfensterWachsmo} /></li>
                        <li><MdText text={inhalt.texte.walzenstrategieDerSchwerpunktDer} /></li>
                      </ul>
                    </div>
                  </div>

                  {/* Section 3: MAK / AGW */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-3">
                      <div className="bg-emerald-600/10 text-emerald-700 p-2 rounded-xl">
                        <HardHat size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.t3ArbeitsschutzGesundheitMak} /></h4>
                        <p className="text-[10px] text-text-main/50 uppercase tracking-widest font-mono"><MdText text={inhalt.texte.trgs900GrenzwertToxikologie} /></p>
                      </div>
                    </div>

                    <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
                      <p><MdText text={inhalt.texte.bitumenSetztBeiErhitzung} /></p>
                      <div className="bg-emerald-50 text-emerald-950 p-3 rounded-lg border border-emerald-200 text-[11px] font-medium leading-relaxed"><MdText text={inhalt.texte.derNeueAgwWert} /></div>
                      <ul className="list-disc list-inside space-y-2 text-text-main/70 pl-1">
                        <li><MdText text={inhalt.texte.exponentielleAbsenkungDieDampf} /></li>
                        <li><MdText text={inhalt.texte.arbeitsplatzvorteileGeringereHitzeUnd} /></li>
                      </ul>
                    </div>
                  </div>

                  {/* Section 4: Challenges */}
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-3">
                      <div className="bg-amber-600/10 text-amber-700 p-2 rounded-xl">
                        <ShieldAlert size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.t4TechnischeHerausforderungenSchadensbild} /></h4>
                        <p className="text-[10px] text-text-main/50 uppercase tracking-widest font-mono"><MdText text={inhalt.texte.schadensbilderRisikominderung} /></p>
                      </div>
                    </div>

                    <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
                      <p><MdText text={inhalt.texte.trotzAllerÖkologischenUnd} /></p>
                      <ul className="list-disc list-inside space-y-2 text-text-main/70 pl-1">
                        <li><MdText text={inhalt.texte.restfeuchteUndStrippingHaftungsverlust} /></li>
                        <li><MdText text={inhalt.texte.verzögerteAnfangsstärkeRuttingGefahr} /></li>
                        <li><MdText text={inhalt.texte.zusatzkostenAmortisationAdditiveVerteuer} /></li>
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Comparative Overview Card */}
                <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30 mt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#A3113E] mb-3 flex items-center gap-1">
                    <FileText size={14} /><MdText text={inhalt.texte.vergleichStandardUndTemperaturabgesenkte} /></h4>
                  <div className="overflow-x-auto text-[11px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-home-grau/30 text-text-main/70">
                          <th className="py-2 pr-4 font-bold">Kenngröße</th>
                          <th className="py-2 pr-4 font-bold"><MdText text={inhalt.texte.standardAsphaltAcDeck} /></th>
                          <th className="py-2 pr-4 font-bold"><MdText text={inhalt.texte.niedrigtemperaturasphaltNta} /></th>
                          <th className="py-2 font-bold"><MdText text={inhalt.texte.verfahrenstechnischerVorteil} /></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-home-grau/10 text-text-main/80">
                        <tr>
                          <td className="py-2.5 pr-4 font-semibold text-text-main">Herstelltemperatur</td>
                          <td className="py-2.5 pr-4"><MdText text={inhalt.texte.t160CBis180} /></td>
                          <td className="py-2.5 pr-4 text-emerald-800 font-medium"><MdText text={inhalt.texte.t115CBis135} /></td>
                          <td className="py-2.5"><MdText text={inhalt.texte.sparsamererBrennerbetriebVerringertesTre} /></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-4 font-semibold text-text-main"><MdText text={inhalt.texte.viskositätBeiEinbau} /></td>
                          <td className="py-2.5 pr-4"><MdText text={inhalt.texte.t0408} /></td>
                          <td className="py-2.5 pr-4 text-emerald-800 font-medium"><MdText text={inhalt.texte.vergleichbarDurchAdditiveLehrwert} /></td>
                          <td className="py-2.5"><MdText text={inhalt.texte.gleichwertigeVerarbeitbarkeitTrotzVerrin} /></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-4 font-semibold text-text-main"><MdText text={inhalt.texte.mindestLufttemperaturBeimEinbau} /></td>
                          <td className="py-2.5 pr-4"><MdText text={inhalt.texte.deckschicht3Cm5} /></td>
                          <td className="py-2.5 pr-4 text-amber-700 font-medium"><MdText text={inhalt.texte.eherHöherWählenSchnellere} /></td>
                          <td className="py-2.5"><MdText text={inhalt.texte.ltaIstWindUnd} /></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-4 font-semibold text-text-main"><MdText text={inhalt.texte.haftverhaltenZumGestein} /></td>
                          <td className="py-2.5 pr-4"><MdText text={inhalt.texte.gutGesteinVollständigGetrocknet} /></td>
                          <td className="py-2.5 pr-4 text-amber-700 font-medium"><MdText text={inhalt.texte.adhäsionsrisikenDurchRestfeuchte} /></td>
                          <td className="py-2.5"><MdText text={inhalt.texte.haftmittelSpezialSilaneAmine} /></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-4 font-semibold text-text-main"><MdText text={inhalt.texte.bitumenalterungOxidation} /></td>
                          <td className="py-2.5 pr-4"><MdText text={inhalt.texte.hochStarkeKurzzeitAlterung} /></td>
                          <td className="py-2.5 pr-4 text-emerald-800 font-medium"><MdText text={inhalt.texte.geringerWenigerKurzzeitalterung} /></td>
                          <td className="py-2.5"><MdText text={inhalt.texte.günstigFürErmüdungsUnd} /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          );
        })()}
        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="asphalt" />
          </div>
        )}
        </div>
        </ModuleTabs>
      </div>

    
      <ModulTest moduleId="asphalt" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Asphalt', url: 'https://de.wikipedia.org/wiki/Asphalt' },
          { title: 'Niedrigtemperaturasphalt', url: 'https://de.wikipedia.org/wiki/Niedrigtemperaturasphalt' }
        ]}
        literatur={inhalt.daten["Asphalt.literatur"]}
        regelwerke={inhalt.daten["Asphalt.regelwerke"]}
        formeln={inhalt.daten["Asphalt.formeln"]}
      />

</div>
  );
}
