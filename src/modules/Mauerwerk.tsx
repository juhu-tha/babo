import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { FormulaText } from '@/src/components/ui/FormulaText';
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
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Layers, Ruler, Calculator, BookOpen, ArrowRight, ShieldAlert, RotateCcw, RotateCw, Undo2 } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import inhalt from '@/content/mauerwerk/Mauerwerk.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '@/src/components/ui/Auswahlgruppe';
import { fkEmpfehlungENGenormt, fdAusFk, fvk0NA, phiAusmitte } from '@/src/calc/mauerwerk';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// K-Werte: Empfehlungswerte nach EN 1996-1-1, Tab. 3.3 (Mauerziegel Gruppe 1 bzw. Hochlochziegel Gruppe 2);
// in Deutschland gelten nach DIN EN 1996-1-1/NA eigene Parameter (f_k = K · f_st^α · f_m^β bzw. Tabellenwerte f_k). Lehmsteine (DIN 18940) und KS + LM: kein genormter K-Wert, Rechner gesperrt (MW-2, 28.10.2026).
const stoneTypes = inhalt.daten.stoneTypes;

const bonds = [
  inhalt.daten["bonds.laeufer"],
  { id: 'block', name: 'Blockverband' },
  { id: 'kreuz', name: 'Kreuzverband' },
];

function MauerwerkThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'naturstein');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 mt-6">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadMauerwerkStein} /></h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5"><MdText text={inhalt.texte.wechselnSieNahtlosZwischen} /></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('mauerwerk')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t1BaustoffEigenschaften} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.steinartenZiegelKsPorenbeton} /></span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_mauerwerk')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t2MauerwerksproduktePraxis} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.hintermauerUndVormauerziegelPlanblöcke} /></span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={handleDauerhaftigkeitClick}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t3AlterungDenkmalschutz} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.salzkristallisationFrostsprengungChemisc} /></span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

// three.js nur für die 3D-Verbandsansicht nachladen (Phase 5, AP 5.4)
const MauerwerkVerband3D = React.lazy(() => import('./mauerwerk/MauerwerkVerband3D'));

type MauerwerkReiter = 'material' | 'verband' | 'bemessung' | 'ziegellexikon' | 'steckbrief';
const REITER: readonly ModulTab<MauerwerkReiter>[] = [
  { id: 'steckbrief', label: 'Baustoff-Steckbrief', icon: BookOpen },
  { id: 'material', label: inhalt.texte.steineMörtel.trim(), icon: Layers },
  { id: 'verband', label: 'Mauerwerksverband', icon: Ruler },
  { id: 'bemessung', label: inhalt.texte.festigkeitBemessung.trim(), icon: Calculator },
  { id: 'ziegellexikon', label: 'Ziegel-Lexikon', icon: BookOpen },
];

export default function Mauerwerk() {
  const [activeTab, setActiveTab] = useState<MauerwerkReiter>('steckbrief');
  const [steckbriefMaterial, setSteckbriefMaterial] = useState<'mauerziegel' | 'kalksandstein' | 'porenbeton' | 'leichtbeton' | 'lehmstein'>('mauerziegel');

  const [stone, setStone] = useState<keyof typeof stoneTypes>('MZ');
  const [mortar, setMortar] = useState<'NM' | 'LM' | 'DM'>('NM');
  const [fb, setFb] = useState(12); // Steinfestigkeit
  const [fm, setFm] = useState(5); // Mörtelfestigkeit
  const [height, setHeight] = useState(2.75); // Wandhöhe in m
  const [thickness, setThickness] = useState(0.24); // Wanddicke in m
  const [eccentricity, setEccentricity] = useState(0.05); // Exzentrizität in m
  const [sigmaD, setSigmaD] = useState(1.0); // Vorhandene Druckspannung in N/mm² für Schub
  
  // Verband
  const [bond, setBond] = useState(bonds[0].id);
  // 3D-Ansicht per Tastatur drehbar (Schaltflächen bzw. Pfeiltasten, WCAG 2.1.1); Zurücksetzen lädt die Kamera neu
  const [drehung, setDrehung] = useState(0);
  const [ansicht, setAnsicht] = useState(0);
  const drehe = (grad: number) => setDrehung(d => ((d + grad) % 360 + 360) % 360);
  const [stoneLength, setStoneLength] = useState(240); // mm
  const [stoneHeight, setStoneHeight] = useState(113); // mm

  const results = useMemo(() => {
    // 1. Mauerwerksdruckfestigkeit fk – EN-Empfehlung K (Vergleich); NA-Ansatz und vereinfachtes Verfahren
    //    nach DIN EN 1996-3/NA in der Beispielrechnung „Mauerwerk: Tragfähigkeit“ (src/calc/mauerwerk.ts)
    //    MW-2 (28.10.2026): ohne genormten K-Wert (Lehmstein, KS + Leichtmörtel) ist der f_k-Rechner gesperrt (fk = null)
    const K: number | null = stoneTypes[stone].K[mortar];
    const fkGenormt = fkEmpfehlungENGenormt(K, fb, fm, mortar, stone === 'HLZ');
    const gesperrt = fkGenormt === null;
    const fk = fkGenormt ?? NaN;
    const fd = fdAusFk(fk); // NA DE: f_d = ζ · f_k / γ_M mit ζ = 0,85, γ_M = 1,5

    // 2. Lastausmitte am Wandkopf/-fuß: Φ_i = 1 − 2e/t (Slider begrenzt e ≤ t/2)
    const slenderness = height / thickness;
    const phi = phiAusmitte(eccentricity, thickness);

    // Tragfähigkeit N_Rd = Phi * A * fd
    const A = thickness * 1.0; // pro lfm
    const NRd = phi * A * fd * 1000; // in kN/m

    // 3. Schubfestigkeit fvk
    // MW-1 (28.10.2026): f_vk0 nach DIN EN 1996-1-1/NA aus der Mörtelgruppe (src/calc/mauerwerk.ts, FVK0_NA)
    const fvk0Info = fvk0NA(mortar, fm);
    const fvk0 = fvk0Info.fvk0;
    // fvk = fvk0 + 0.4 * sigma_d (vereinfacht nach EC6)
    // Begrenzung auf max Werte je nach Stein/Mörtel (hier vereinfacht)
    const fvk_calc = fvk0 + 0.4 * sigmaD;
    const fvk_max = 0.065 * fb; // Lehrmodell: Obergrenze 0,065·f_b = Empfehlungswert EN 1996-1-1; nach DIN EN 1996-1-1/NA stattdessen Steinzugversagen f_vlt2 = 0,45·f_bt,cal·√(1 + σ_D/f_bt,cal)
    const fvk = Math.min(fvk_calc, fvk_max);
    const fvd = fvk / 1.5; // γ_M = 1,5

    // 4. Überbindemaß
    const minOverlap = Math.max(0.4 * stoneHeight, 45); // mm
    const actualOverlap = bond === 'laeufer' ? stoneLength / 2 : stoneLength / 4; // Vereinfachte Annahme für Block/Kreuz
    const overlapValid = actualOverlap >= minOverlap;

    const labels = [];
    const fvkData = [];
    const currentPointData = [];

    for (let s = 0; s <= 5; s += 0.25) {
      labels.push(s.toFixed(2));
      const current_fvk_calc = fvk0 + 0.4 * s;
      const current_fvk = Math.min(current_fvk_calc, fvk_max);
      fvkData.push(current_fvk);
      
      if (Math.abs(s - sigmaD) < 0.125) {
        currentPointData.push(fvk);
      } else {
        currentPointData.push(null);
      }
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: inhalt.werte.schubfestigkeitFVkMpa,
          data: fvkData,
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

    return { fk, fd, slenderness, phi, NRd, K, gesperrt, fvk0, fvk0Gruppe: fvk0Info.gruppe, fvk0Vorlaeufig: fvk0Info.vorlaeufig, fvk, fvd, minOverlap, actualOverlap, overlapValid, chartData };
  }, [stone, mortar, fb, fm, height, thickness, eccentricity, sigmaD, stoneLength, stoneHeight, bond]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        title: { display: true, text: inhalt.werte.vorhandeneDruckspannungDN, font: { weight: 'bold' as const } }
      },
      y: {
        title: { display: true, text: inhalt.werte.schubfestigkeitFVkMpa2, font: { weight: 'bold' as const } },
        min: 0,
      }
    }
  };


  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.mauerwerksbauNaturstein} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.mauerwerkIstEinExtrem} /></p>
        </div>
        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">
        <div className="flex flex-col gap-6">

        {activeTab === 'material' && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-6">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Materialwahl</h3>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.dieMauerwerksdruckfestigkeit} /><span className="font-mono"><FormulaText text="f_k" /></span><MdText text={inhalt.texte.setztSichAusDer} /><span className="font-mono"><FormulaText text="f_b" /></span><MdText text={inhalt.texte.undDerMörtelfestigkeit} /><span className="font-mono"><FormulaText text="f_m" /></span>) zusammen.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Material</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Steinart</label><InfoTooltip text={inhalt.werte.artDesMauersteins} /></div>
                  <select aria-label="Steinart" 
                    className="p-2 border border-home-grau rounded-md bg-white"
                    value={stone}
                    onChange={(e) => {
                      const val = e.target.value as keyof typeof stoneTypes;
                      setStone(val);
                      if (val === 'MZ') { setFb(12); setFm(5); }
                      else if (val === 'KSV') { setFb(20); setFm(5); }
                      else if (val === 'PB') { setFb(4); setFm(2); }
                      else if (val === 'HLZ') { setFb(8); setFm(5); }
                      else if (val === 'LH') { setFb(2); setFm(2); }
                      else if (val === 'LB') { setFb(6); setFm(5); }
                    }}
                  >
                    {Object.entries(stoneTypes).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Mörtelart</label><InfoTooltip text={inhalt.werte.artDesVerwendetenMauermörtels} /></div>
                  <select aria-label="Mörtelart" 
                    className="p-2 border border-home-grau rounded-md bg-white"
                    value={mortar}
                    onChange={(e) => setMortar(e.target.value as typeof mortar)}
                  >
                    <option value="NM">Normalmörtel (NM)</option>
                    <option value="LM">Leichtmörtel (LM)</option>
                    <option value="DM">Dünnbettmörtel (DM)</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6 p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
                <p className="text-text-main/80 mb-2 font-medium">{stoneTypes[stone].desc}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-main/60">Rohdichte <FormulaText text="\rho" />:</span>
                    <span className="font-bold">{formatDeWert(stoneTypes[stone].rho)} kg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-main/60">Wärmeleitf. <FormulaText text="\lambda" />:</span>
                    <span className="font-bold">{formatDeWert(stoneTypes[stone].lambda)} W/(mK)</span>
                  </div>
                </div>
              </div>

              <Slider info={inhalt.werte.druckfestigkeitDesMauersteins} label={<FormulaText text={inhalt.werte.steinfestigkeitFB} />} min={2} max={40} step={1} value={fb} unit="MPa" onChange={(e) => setFb(Number(e.target.value))} />
              <div className="mt-4">
                <Slider  label={<FormulaText text={inhalt.werte.mörtelfestigkeitFM} />} min={1} max={20} step={1} value={fm} unit="MPa" onChange={(e) => setFm(Number(e.target.value))} />
              </div>
            </div>
          </div>
          
          {/* Spalte 2: Detaillierte Baustoff-Steckbriefe & Vergleiche der 4 Hauptsteinarten */}
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-text-main/80" /> Baustoff-Gegenüberstellung
              </h3>
              
              <div className="space-y-4">
                {/* Ton-Ziegel */}
                <div className={`p-3.5 rounded-lg border transition-all ${stone === 'MZ' || stone === 'HLZ' ? 'bg-white border-home-grau shadow-sm ring-1 ring-home-grau/10' : 'bg-white/50 border-home-grau/30 hover:border-home-grau/40'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                      <span><MdText text={inhalt.texte.tonZiegelMzHlz} /></span>
                    </h4>
                    <span className="text-[10px] bg-home-grau/20 text-text-main px-2 py-0.5 rounded font-bold uppercase">Keramisch</span>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.herstellungTonLehmUnd} /></p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-text-main/60 border-t border-home-grau/10 pt-2 font-mono">
                    <div><MdText text={inhalt.texte.schallschutz} /><span className="text-text-main font-semibold"><MdText text={inhalt.texte.sehrGutMz} /></span></div>
                    <div><MdText text={inhalt.texte.brandschutz} /><span className="text-text-main font-semibold">Klasse A1</span></div>
                    <div><MdText text={inhalt.texte.leitf} /><span className="text-text-main font-semibold"><MdText text={inhalt.texte.t007045} /></span></div>
                    <div>Tragfähigkeit: <span className="text-text-main font-semibold">Sehr hoch</span></div>
                  </div>
                  <div className="mt-2 text-[10.5px] text-text-main/60 bg-off-white p-2 rounded border border-home-grau/10"><MdText text={inhalt.texte.vorteilExtremeWetterdauerhaftigkeitKlink} /><span className="text-rose-700">Nachteil:</span><MdText text={inhalt.texte.energieintensivesBrennenHoheCo} /></div>
                </div>

                {/* Kalksandstein */}
                <div className={`p-3.5 rounded-lg border transition-all ${stone === 'KSV' ? 'bg-white border-home-grau shadow-sm ring-1 ring-home-grau/10' : 'bg-white/50 border-home-grau/30 hover:border-home-grau/40'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                      <span><MdText text={inhalt.texte.kalksandsteinKs} /></span>
                    </h4>
                    <span className="text-[10px] bg-home-grau/20 text-text-main px-2 py-0.5 rounded font-bold uppercase">Autoklaviert</span>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.herstellungQuarzsandKalkUnd} /></p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-text-main/60 border-t border-home-grau/10 pt-2 font-mono">
                    <div><MdText text={inhalt.texte.schallschutz2} /><span className="text-text-main font-semibold"><MdText text={inhalt.texte.exzellentMasse} /></span></div>
                    <div><MdText text={inhalt.texte.brandschutz2} /><span className="text-text-main font-semibold">Klasse A1</span></div>
                    <div><MdText text={inhalt.texte.leitf2} /><span className="text-text-main font-semibold"><MdText text={inhalt.texte.ca051} /></span></div>
                    <div>Tragfähigkeit: <span className="text-text-main font-semibold">Extrem hoch</span></div>
                  </div>
                  <div className="mt-2 text-[10.5px] text-text-main/60 bg-off-white p-2 rounded border border-home-grau/10"><MdText text={inhalt.texte.vorteilUnerreichteTragfähigkeitUnd} /><span className="text-rose-700">Nachteil:</span><MdText text={inhalt.texte.keinerleiEigeneDämmendeWirkung} /></div>
                </div>

                {/* Porenbeton */}
                <div className={`p-3.5 rounded-lg border transition-all ${stone === 'PB' ? 'bg-white border-home-grau shadow-sm ring-1 ring-home-grau/10' : 'bg-white/50 border-home-grau/30 hover:border-home-grau/40'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                      <span><MdText text={inhalt.texte.porenbetonPb} /></span>
                    </h4>
                    <span className="text-[10px] bg-home-grau/20 text-text-main px-2 py-0.5 rounded font-bold uppercase">Poren-Blähstein</span>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.herstellungQuarzmehlKalkZement} /></p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-text-main/60 border-t border-home-grau/10 pt-2 font-mono">
                    <div><MdText text={inhalt.texte.schallschutz3} /><span className="text-text-main font-semibold">Gering</span></div>
                    <div><MdText text={inhalt.texte.brandschutz3} /><span className="text-text-main font-semibold">Klasse A1</span></div>
                    <div><MdText text={inhalt.texte.leitf3} /><span className="text-text-main font-semibold"><MdText text={inhalt.texte.t007016} /></span></div>
                    <div>Tragfähigkeit: <span className="text-text-main font-semibold">Mäßig</span></div>
                  </div>
                  <div className="mt-2 text-[10.5px] text-text-main/60 bg-off-white p-2 rounded border border-home-grau/10"><MdText text={inhalt.texte.vorteilSpitzenreiterDerEigendämmung} /><span className="text-rose-700">Nachteil:</span><MdText text={inhalt.texte.schallempfindlichGeringereFestigkeit} /></div>
                </div>

                {/* Lehmbausteine */}
                <div className={`p-3.5 rounded-lg border transition-all ${stone === 'LH' ? 'bg-white border-home-grau shadow-sm ring-1 ring-home-grau/10' : 'bg-white/50 border-home-grau/30 hover:border-home-grau/40'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                      <span><MdText text={inhalt.texte.lehmbausteineLh} /></span>
                    </h4>
                    <span className="text-[10px] bg-home-grau/20 text-text-main px-2 py-0.5 rounded font-bold uppercase">Luftgetrocknet</span>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.herstellungAusUngebranntemTon} /></p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-text-main/60 border-t border-home-grau/10 pt-2 font-mono">
                    <div><MdText text={inhalt.texte.schallschutz4} /><span className="text-text-main font-semibold"><MdText text={inhalt.texte.sehrGutMasse} /></span></div>
                    <div><MdText text={inhalt.texte.brandschutz4} /><span className="text-text-main font-semibold">Klasse A1</span></div>
                    <div><MdText text={inhalt.texte.leitf4} /><span className="text-text-main font-semibold"><MdText text={inhalt.texte.t047073} /></span></div>
                    <div>Tragfähigkeit: <span className="text-text-main font-semibold"><MdText text={inhalt.texte.gering25Mpa} /></span></div>
                  </div>
                  <div className="mt-2 text-[10.5px] text-text-main/60 bg-off-white p-2 rounded border border-home-grau/10"><MdText text={inhalt.texte.vorteilUnschlagbareRaumklimaRegulierung} /><span className="text-rose-700">Nachteil:</span><MdText text={inhalt.texte.nichtWasserbeständigErweichtBei} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'bemessung' && (
        <div className="animate-in fade-in duration-300 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.festigkeitBemessung2} /></h3>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.zudemIstUnbewehrtesMauerwerk} /><span className="font-mono"><FormulaText text="Φ" /></span><MdText text={inhalt.texte.berücksichtigtWirdDieSchubfestigkeit} /></p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.geometrieKnickenDruck} /></h3>
              <Slider info={inhalt.werte.effektiveWandhöhe} label={<FormulaText text={inhalt.werte.wandhöheHEf} />} min={2.0} max={4.0} step={0.05} value={height} unit="m" onChange={(e) => setHeight(Number(e.target.value))} />
              <div className="mt-4">
                <Slider  label={<FormulaText text="Wanddicke t" />} min={0.115} max={0.49} step={0.01} value={thickness} unit="m" onChange={(e) => setThickness(Number(e.target.value))} />
              </div>
              <div className="mt-4">
                <Slider info={inhalt.werte.exzentrizitätDerLasteinleitung} label={<FormulaText text={inhalt.werte.exzentrizitätE} />} min={0} max={thickness/2} step={0.01} value={eccentricity} unit="m" onChange={(e) => setEccentricity(Number(e.target.value))} />
              </div>
            </div>

          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Schubbeanspruchung</h3>
              <Slider  
                label={<FormulaText text={inhalt.werte.vorhandeneDruckspannungD} />} 
                min={0} max={5.0} step={0.1} 
                value={sigmaD} unit="N/mm²" 
                info={inhalt.werte.eineHöhereAuflastDruckspannung}
                onChange={(e) => setSigmaD(Number(e.target.value))} 
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-shiraz text-white p-6 rounded-xl shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90"><MdText text={inhalt.texte.ergebnisseDruckfestigkeit} /></h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-white/70 text-sm mb-1"><FormulaText text={inhalt.werte.charaktFestigkeitFK} /></div>
                  <div className="text-3xl font-bold">{results.gesperrt ? '–' : `${formatDeZahl(results.fk, 2)} MPa`}</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm mb-1"><FormulaText text={inhalt.werte.bemessungswertFD} /></div>
                  <div className="text-3xl font-bold">{results.gesperrt ? '–' : `${formatDeZahl(results.fd, 2)} MPa`}</div>
                </div>
              </div>
              {results.gesperrt && <p className="text-sm text-white border-t border-white/20 pt-4 mb-2" role="status"><MdText text={inhalt.texte.fkGesperrtOhneKWert} /></p>}
              <div className="text-sm text-white/80 border-t border-white/20 pt-4">
                Formel: <FormulaText text={mortar === 'DM' ? (stone === 'HLZ' ? 'f_k = K \\cdot f_b^{0{,}7}' : 'f_k = K \\cdot f_b^{0{,}85}') : mortar === 'LM' ? 'f_k = K \\cdot f_b^{0{,}7}' : 'f_k = K \\cdot f_b^{0{,}7} \\cdot f_m^{0{,}3}'} /> (K = {results.K === null ? '–' : formatDeWert(results.K)}<MdText text={inhalt.texte.empfehlungEn} /><FormulaText text="f_d = 0{,}85 \cdot f_k / 1{,}5" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.tragfähigkeitDruckProLfm} /></h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-home-grau text-sm mb-1"><FormulaText text={inhalt.werte.schlankheitHEfT} /></div>
                  <div className="text-xl font-bold text-text-main">{formatDeZahl(results.slenderness, 1)}</div>
                </div>
                <div>
                  <div className="text-home-grau text-sm mb-1 flex items-center gap-1">
                    <FormulaText text={inhalt.werte.knickbeiwert} />
                    <InfoTooltip text={inhalt.werte.vereinfacht12eT} />
                  </div>
                  <div className={`text-xl font-bold ${results.phi < 0.2 ? 'text-shiraz' : 'text-text-main'}`}>
                    {formatDeZahl(results.phi, 2)}
                  </div>
                </div>
              </div>
              <div className="bg-shiraz/5 p-4 rounded-lg border border-shiraz/20">
                <div className="text-shiraz text-sm font-bold mb-1"><FormulaText text={inhalt.werte.maxNormalkraftNRd} /></div>
                <div className="text-3xl font-bold text-shiraz">{results.gesperrt ? '–' : `${formatDeZahl(results.NRd, 0)} kN/m`}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Schubfestigkeit</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-home-grau text-sm mb-1"><FormulaText text={inhalt.werte.haftscherfestigkeitFVk0} /></div>
                  <div className="text-xl font-bold text-text-main">{formatDeZahl(results.fvk0, 2)} MPa</div>
                  <div className="text-xs text-home-grau">{results.fvk0Gruppe}{inhalt.texte.fvk0NachNa}{results.fvk0Vorlaeufig ? inhalt.texte.fvk0Vorlaeufig : ''}</div>
                </div>
                <div>
                  <div className="text-home-grau text-sm mb-1"><FormulaText text={inhalt.werte.charaktSchubfestigkeitFVk} /></div>
                  <div className="text-xl font-bold text-text-main">{formatDeZahl(results.fvk, 2)} MPa</div>
                </div>
              </div>
              <div className="bg-shiraz/5 p-4 rounded-lg border border-shiraz/20">
                <div className="text-shiraz text-sm font-bold mb-1"><FormulaText text={inhalt.werte.bemessungswertFVd} /></div>
                <div className="text-3xl font-bold text-shiraz">{formatDeZahl(results.fvd, 2)} MPa</div>
              </div>
              <div className="text-xs text-home-grau mt-4 mb-4">
                Formel: <FormulaText text={inhalt.werte.fVkFVk0} /> (vereinfacht)
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/30 h-[250px] flex flex-col">
                <h4 className="text-sm font-bold text-center mb-2"><MdText text={inhalt.texte.schubfestigkeitVsDruckspannung} /></h4>
                <div className="flex-1 relative">
                  <Line data={results.chartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungSchubfestigkeitRe} /></h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="160" viewBox="0 0 350 160">
                  {/* Mauersteine */}
                  <rect x="125" y="40" width="100" height="40" fill="#94a3b8" stroke="#A3113E" strokeWidth="2" />
                  <rect x="125" y="90" width="100" height="40" fill="#94a3b8" stroke="#A3113E" strokeWidth="2" />
                  
                  {/* Mörtelfuge */}
                  <rect x="125" y="80" width="100" height="10" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                  <text x="175" y="88" fontSize="8" fill="#1e293b" textAnchor="middle">Mörtel</text>

                  {/* Druckkraft (Auflast) */}
                  <path d="M 175 10 L 175 35" stroke="#475569" strokeWidth="3" markerEnd="url(#arrow-blue-mauer)" />
                  <text x="185" y="25" fontSize="12" fill="#475569" textAnchor="start" fontWeight="bold">σ_d (Druck)</text>

                  {/* Schubkraft */}
                  <path d="M 60 60 L 115 60" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow-red-mauer)" />
                  <text x="85" y="50" fontSize="12" fill="#A3113E" textAnchor="middle" fontWeight="bold">τ (Schub)</text>

                  {/* Reibungswiderstand */}
                  <path d="M 235 85 L 180 85" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrow-orange-mauer)" />
                  <text x="260" y="90" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">Reibung</text>

                  <defs>
                    <marker id="arrow-blue-mauer" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                    <marker id="arrow-red-mauer" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                    </marker>
                    <marker id="arrow-orange-mauer" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.dieSchubfestigkeitVonMauerwerk} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'verband' && (
        <div className="animate-in fade-in duration-300 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Mauerwerksverband</h3>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-2">Mauerwerksverband</h3>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Verbandsart</label><InfoTooltip text={inhalt.werte.artDesMauerwerksverbands} /></div>
              <select aria-label="Verbandsart" 
                className="p-2 border border-home-grau rounded-md bg-white"
                value={bond}
                onChange={(e) => setBond(e.target.value)}
              >
                {bonds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <Slider info={inhalt.werte.längeDesMauersteins} label={<FormulaText text={inhalt.werte.steinlängeLU} />} min={115} max={490} step={5} value={stoneLength} unit="mm" onChange={(e) => setStoneLength(Number(e.target.value))} />
            <Slider  label={<FormulaText text={inhalt.werte.steinhöheHU} />} min={52} max={249} step={1} value={stoneHeight} unit="mm" onChange={(e) => setStoneHeight(Number(e.target.value))} />

            <div className={`mt-4 p-4 rounded-lg border ${results.overlapValid ? 'bg-slate-100 border-slate-200' : 'bg-shiraz/10 border-shiraz/30'}`}>
              <h4 className={`text-sm font-bold mb-2 ${results.overlapValid ? 'text-slate-800' : 'text-shiraz'}`}>
                Überbindemaß-Kontrolle
              </h4>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-main/70"><MdText text={inhalt.texte.erforderlichMin} /></span>
                <span className="font-bold">{formatDeZahl(results.minOverlap, 0)} mm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-main/70"><MdText text={inhalt.texte.vorhandenCa} /></span>
                <span className="font-bold">{formatDeZahl(results.actualOverlap, 0)} mm</span>
              </div>
              {!results.overlapValid && (
                <div className="text-xs text-shiraz mt-2 font-medium"><MdText text={inhalt.texte.warnungDasÜberbindemaßIst} /></div>
              )}
            </div>
            <div className="text-xs text-home-grau mt-2">
              Regel: <FormulaText text="l_{ol} \ge 0{,}4 \cdot h_u" /> und <FormulaText text="l_{ol} \ge 45\text{ mm}" />
            </div>
            
            <div className="mt-2 flex flex-col gap-2">
              {bond === 'laeufer' && (
                <div className="text-xs text-text-main/75 leading-relaxed bg-white border border-home-grau/15 rounded-lg p-3 shadow-2xs">
                  <span className="font-bold text-shiraz block mb-1">Läuferverband</span><MdText text={inhalt.texte.alleSteineSindAls} /><FormulaText text="l_{ol} = 0{,}5 \cdot l_u" /><MdText text={inhalt.texte.diesIstDerHeutzutage} /></div>
              )}
              {bond === 'block' && (
                <div className="text-xs text-text-main/75 leading-relaxed bg-white border border-home-grau/15 rounded-lg p-3 shadow-2xs">
                  <span className="font-bold text-shiraz block mb-1">Blockverband</span><MdText text={inhalt.texte.esWechselnSichEine} /><FormulaText text="l_{ol} = 0{,}25 \cdot l_u" />).
                </div>
              )}
              {bond === 'kreuz' && (
                <div className="text-xs text-text-main/75 leading-relaxed bg-white border border-home-grau/15 rounded-lg p-3 shadow-2xs">
                  <span className="font-bold text-shiraz block mb-1">Kreuzverband</span><MdText text={inhalt.texte.ähnlichAufgebautWieDer} /><FormulaText text="0{,}5 \cdot l_u" /><MdText text={inhalt.texte.statischSehrRobustUnd} /></div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col h-[400px]">
             <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4"><MdText text={inhalt.texte.t3dVisualisierungVerband} /></h3>
             <div className="flex-1 relative w-full h-full bg-slate-100/50 rounded-lg overflow-hidden border border-home-grau/30">
              {/* Textalternative der 3D-Ansicht (WCAG 1.1.1); die Werte stehen auch in den Eingaben links */}
              <div role="img" className="absolute inset-0"
                aria-label={`3D-Ansicht ${bonds.find(b => b.id === bond)?.name ?? ''}: Steinlänge ${formatDeZahl(stoneLength, 0)} mm, Steinhöhe ${formatDeZahl(stoneHeight, 0)} mm, Wanddicke ${formatDeZahl(thickness * 1000, 0)} mm, Überbindemaß ca. ${formatDeZahl(results.actualOverlap, 0)} mm${drehung ? `, um ${formatDeZahl(drehung, 0)}° gedreht` : ''}`}>
              <React.Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-sm text-text-main/60"><MdText text={inhalt.texte.t3dAnsichtWirdGeladen} /></div>}>
                <MauerwerkVerband3D key={ansicht} bond={bond} stoneLength={stoneLength} stoneHeight={stoneHeight} thickness={thickness} drehung={drehung} />
              </React.Suspense>
              </div>
              <div role="group" aria-label="3D-Ansicht drehen" className="absolute bottom-2 right-2 flex gap-1"
                onKeyDown={e => { if (e.key === 'ArrowLeft') { e.preventDefault(); drehe(-15); } else if (e.key === 'ArrowRight') { e.preventDefault(); drehe(15); } }}>
                <button type="button" onClick={() => drehe(-15)} aria-label="Nach links drehen (15°)" title="Nach links drehen (Pfeil links)"
                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-white/90 border border-home-grau/40 text-text-main hover:bg-white cursor-pointer">
                  <RotateCcw size={15} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => drehe(15)} aria-label="Nach rechts drehen (15°)" title="Nach rechts drehen (Pfeil rechts)"
                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-white/90 border border-home-grau/40 text-text-main hover:bg-white cursor-pointer">
                  <RotateCw size={15} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => { setDrehung(0); setAnsicht(a => a + 1); }} aria-label="Ansicht zurücksetzen" title="Ansicht zurücksetzen"
                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-white/90 border border-home-grau/40 text-text-main hover:bg-white cursor-pointer">
                  <Undo2 size={15} aria-hidden="true" />
                </button>
              </div>
             </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ziegellexikon' && (
        <div className="animate-in fade-in duration-300 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.wissenKompaktZiegelLexikon} /></h3>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 flex flex-col gap-2">
            <p><MdText text={inhalt.texte.ziegelGehörenZuDen} /></p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3"><MdText text={inhalt.texte.klassifizierungKennwerte} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
                  <li><MdText text={inhalt.texte.festigkeitsklasseSfkGibtDie} /></li>
                  <li><MdText text={inhalt.texte.rohdichteklasseRdkGibtDas} /></li>
                  <li><MdText text={inhalt.texte.wärmeleitfähigkeitHochwärmedämmendeZiege} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">Ziegelformate</h3>
                <p className="text-sm text-text-main/80 mb-3"><MdText text={inhalt.texte.ziegelWerdenTraditionellIm} /></p>
                <div className="grid grid-cols-1 gap-2 text-sm text-text-main/80">
                  <div className="flex justify-between border-b border-home-grau/30 pb-1"><span><MdText text={inhalt.texte.dünnformatDf} /></span><span className="font-mono text-xs"><MdText text={inhalt.texte.t24011552Mm} /></span></div>
                  <div className="flex justify-between border-b border-home-grau/30 pb-1"><span><MdText text={inhalt.texte.normalformatNf} /></span><span className="font-mono text-xs"><MdText text={inhalt.texte.t24011571Mm} /></span></div>
                  <div className="flex justify-between border-b border-home-grau/30 pb-1"><span><MdText text={inhalt.texte.t2FachesDf2} /></span><span className="font-mono text-xs"><MdText text={inhalt.texte.t240115113Mm} /></span></div>
                  <div className="flex justify-between"><span><MdText text={inhalt.texte.großformateBlocks} /></span><span className="font-mono text-xs text-right"><MdText text={inhalt.texte.zB248365} /></span></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3"><MdText text={inhalt.texte.wichtigeZiegelarten} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
                  <li><MdText text={inhalt.texte.planziegelZiegelDerenLagerflächen} /></li>
                  <li><MdText text={inhalt.texte.blockziegelWerdenImKlassischen} /></li>
                  <li><MdText text={inhalt.texte.hintermauerziegelWerdenVerputztOder} /></li>
                  <li><MdText text={inhalt.texte.vormauerziegelKlinkerSichtbaresMauerwerk} /></li>
                  <li><MdText text={inhalt.texte.wärmedämmziegelOftMitHohlkammern} /></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300 space-y-6">
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/20 shadow-inner">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3"><MdText text={inhalt.texte.wählenSieDenGewünschten} /></h3>
            <AuswahlGruppe label="Baustoff für den Steckbrief" className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'mauerziegel', label: 'Mauerziegel' },
                { id: 'kalksandstein', label: 'Kalksandstein' },
                { id: 'porenbeton', label: 'Porenbeton' },
                { id: 'leichtbeton', label: 'Leichtbeton' },
                { id: 'lehmstein', label: 'Lehmbaustein' }
              ].map((item) => {
                const isActive = steckbriefMaterial === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    {...alsOption(isActive)}
                    onClick={() => setSteckbriefMaterial(item.id as typeof steckbriefMaterial)}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer min-h-[50px] ${
                      isActive
                        ? 'bg-shiraz border-shiraz text-white shadow-md font-extrabold translate-y-[-1px]'
                        : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </AuswahlGruppe>
          </div>
          <BaustoffProfil materialKey={steckbriefMaterial} />
        </div>
      )}
        </div>
        </ModuleTabs>
      </div>
    
      <MauerwerkThematicLinks current="baustoff" />

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielDruckfestigkeitUndTrag}
        zielGleichung="f_k = K \cdot f_b^{0{,}7} \cdot f_m^{0{,}3}, \quad N_{Rd} = \Phi \cdot t \cdot f_d"
        normQuelle={inhalt.werte.en199611}
        schritte={inhalt.daten["Mauerwerk.schritte"]}
        ergebnisHinweis={inhalt.werte.nRd400Kn}
      />

      <ModulTest moduleId="mauerwerk" />

      <ModuleFooter 
        wikipedia={[
        { title: 'Mauerwerk', url: 'https://de.wikipedia.org/wiki/Mauerwerk' },
        { title: 'Mauerwerksverband', url: 'https://de.wikipedia.org/wiki/Mauerwerksverband' },
        { title: 'Mauerziegel', url: 'https://de.wikipedia.org/wiki/Mauerziegel' },
        inhalt.daten["Mauerwerk.wikipedia.3"]
      ]}
        literatur={inhalt.daten["Mauerwerk.literatur"]}
        regelwerke={inhalt.daten["Mauerwerk.regelwerke"]}
        formeln={inhalt.daten["Mauerwerk.formeln"]}
      />
    </div>
  );
}

