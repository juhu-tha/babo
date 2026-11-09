import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo, useEffect } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  RadarController,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Activity, Droplets, Timer, Info, ShieldAlert, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { BlockMath } from 'react-katex';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/holz/Holz.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { gleichgewichtsfeuchte, feuchteNachLagerung, schwinden, schwindmass, HOLZWERKSTOFF_SCHWINDMASSE, SCHWINDBEIWERTE } from '@/src/calc/holzphysik';
import { festigkeitswerte, kdefFuer, KLED_NAME, GAMMA_M_HOLZ, type Nutzungsklasse } from '@/src/calc/holzbau';
import { BSH_EN14080, HOLZ_EN338, type HolzKennwerte } from '@/src/data/kennwerte';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  RadarController
);

// Quell- und Schwindmaße Fichte/Kiefer/Eiche aus dem Kern (SCHWINDBEIWERTE, T10-HW-1; Konsistenzprüfung 29.10.2026,
// vorher Fichte 0,16/0,33 und Kiefer 0,17/0,31); BSH aus Fichte wie Fichte. Buche ebenfalls aus dem Kern
// (Durchsicht D 29.10.2026, DSD-HO-1; vorher Modulkopie 0,22/0,45 ohne Quelle, Holzbau-Modul 0,20/0,40).
const schwindQ = (s: { radial: number; tangential: number; longitudinal: number }) => ({ qr: s.radial, qt: s.tangential, ql: s.longitudinal });
const holzArten = {
  'Fichte (Vollholz)': { ...schwindQ(SCHWINDBEIWERTE.fichte), lambda: 0.13, rho: 450, beta0: 0.8 },
  'Kiefer (Vollholz)': { ...schwindQ(SCHWINDBEIWERTE.kiefer), lambda: 0.13, rho: 520, beta0: 0.8 },
  'Buche (Vollholz)': { ...schwindQ(SCHWINDBEIWERTE.buche), lambda: 0.17, rho: 720, beta0: 0.55 },
  'Eiche (Vollholz)': { ...schwindQ(SCHWINDBEIWERTE.eiche), lambda: 0.17, rho: 690, beta0: 0.55 },
  'Brettschichtholz (BSH)': { ...schwindQ(SCHWINDBEIWERTE.fichte), lambda: 0.13, rho: 450, beta0: 0.7 },
  // Holzwerkstoffe: qt/ql in Plattenebene, qr = Dickenrichtung (T6-HO-1, Kern src/calc/holzphysik.ts)
  'Furnierschichtholz (FSH)': { ...HOLZWERKSTOFF_SCHWINDMASSE.FSH, lambda: 0.15, rho: 500, beta0: 0.7 },
  'OSB': { ...HOLZWERKSTOFF_SCHWINDMASSE.OSB, lambda: 0.13, rho: 600, beta0: 0.9 },
};

const crossSections = [
  { id: 'brett', name: inhalt.werte.brettFlach },
  { id: 'kantholz', name: inhalt.werte.kantholzQuadratisch },
  { id: 'bohle', name: inhalt.werte.bohleDick },
  { id: 'rund', name: 'Rundholz' },
];

// Kennwerte zentral nach DIN EN 338:2016 und DIN EN 14080:2013 (src/data/kennwerte.ts), γ_M = 1,3 nach NA (DE)
const ausNorm = (k: HolzKennwerte) => ({ fm: k.fmk, ft0: k.ft0k, ft90: k.ft90k, fc0: k.fc0k, fc90: k.fc90k, fv: k.fvk, E0mean: k.E0mean, gammaM: GAMMA_M_HOLZ });
const festigkeitsklassen = {
  'C16 (Vollholz)': ausNorm(HOLZ_EN338.C16),
  'C24 (Vollholz)': ausNorm(HOLZ_EN338.C24),
  'C30 (Vollholz)': ausNorm(HOLZ_EN338.C30),
  'GL24h (BSH)': ausNorm(BSH_EN14080.GL24h),
  'GL30h (BSH)': ausNorm(BSH_EN14080.GL30h),
};

type NklName = 'NKL 1' | 'NKL 2' | 'NKL 3';
const nklNummer = (n: NklName) => Number(n.slice(4)) as Nutzungsklasse;

function WoodThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadHolzIm} /></h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5"><MdText text={inhalt.texte.wechsleNahtlosZwischenDen} /></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('holz')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t1BaustoffKennwerte} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.anisotropesQuellenSchwinden3d} /></span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_holzprodukte')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t2HolzproduktePraxis} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.konstruktionsvollholzCltVorUnd} /></span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={() => setActiveTab('holzkorrosion')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t3Dauerhaftigkeit} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.holzzerstörendePilzeInsektenWitterung} /></span>
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

// three.js nur für den Reiter „Schwinden“ nachladen (Phase 5, AP 5.4)
const HolzSchwinden3D = React.lazy(() => import('./holz/HolzSchwinden3D'));

type HolzReiter = 'steckbrief' | 'grundlagen' | 'schwinden' | 'festigkeit' | 'kriechen';
const REITER: readonly ModulTab<HolzReiter>[] = [
  { id: 'steckbrief', label: 'Baustoff-Steckbrief', icon: BookOpen },
  { id: 'grundlagen', label: inhalt.texte.grundlagenTheorie.trim(), icon: Info },
  { id: 'schwinden', label: inhalt.texte.schwindenQuellen.trim(), icon: Droplets },
  { id: 'festigkeit', label: inhalt.texte.festigkeitEc5.trim(), icon: Activity },
  { id: 'kriechen', label: inhalt.texte.kriechenVerformung.trim(), icon: Timer },
];

export default function Holz() {
  const [activeTab, setActiveTab] = useState<HolzReiter>('steckbrief');

  const [holz, setHolz] = useState<keyof typeof holzArten>('Fichte (Vollholz)');
  const [querschnitt, setQuerschnitt] = useState(crossSections[0].id);
  const [uStart, setUStart] = useState(30);
  
  // Dimensions
  const [breite, setBreite] = useState(120);
  const [dicke, setDicke] = useState(24);
  const [laenge, setLaenge] = useState(350);
  
  // Environment
  const [temp, setTemp] = useState(20);
  const [rh, setRh] = useState(65);
  const [lagerDauer, setLagerDauer] = useState(30);
  
  // Eccentricity
  const [exzentrizitaetX, setExzentrizitaetX] = useState(0);
  const [exzentrizitaetY, setExzentrizitaetY] = useState(50);

  // Scaling factor for deformations
  const [skalierungsfaktor, setSkalierungsfaktor] = useState(10);

  // Strength Parameters
  const [festigkeitsklasse, setFestigkeitsklasse] = useState<keyof typeof festigkeitsklassen>('C24 (Vollholz)');
  const [nkl, setNkl] = useState<NklName>('NKL 1');
  const [kled, setKled] = useState('mittel');
  const [winkel, setWinkel] = useState(0);
  const [kc90, setKc90] = useState(1.0);

  // Handle cross-section presets
  useEffect(() => {
    if (querschnitt === 'brett') { setBreite(120); setDicke(24); }
    else if (querschnitt === 'kantholz') { setBreite(100); setDicke(100); }
    else if (querschnitt === 'bohle') { setBreite(200); setDicke(60); }
    else if (querschnitt === 'rund') { setBreite(150); setDicke(150); }
  }, [querschnitt]);

  // Rechenkern src/calc/holzphysik.ts: Gleichgewichtsfeuchte, Feuchteangleich und anisotropes Schwinden
  const feuchteGl = useMemo(() => gleichgewichtsfeuchte(rh, temp), [temp, rh]);
  const uGleichgewicht = feuchteGl.u;
  // Beim Rundholz ist die maßgebende Dicke der Durchmesser (Regler „Dicke“ ist dort ausgeblendet)
  const dickeWirksam = querschnitt === 'rund' ? breite : dicke;
  const lagerung = useMemo(() => feuchteNachLagerung(uStart, uGleichgewicht, lagerDauer, dickeWirksam), [uStart, uGleichgewicht, lagerDauer, dickeWirksam]);
  const uEnde = lagerung.u;

  const { qr, qt, ql } = holzArten[holz];
  const sw = schwinden({ uStart, uEnde, qt, qr, ql, breite, dicke: dickeWirksam, laenge });
  const deltaU = sw.deltaU;
  const shrinkT = sw.epsT, shrinkR = sw.epsR;

  const visualShrinkT = shrinkT * skalierungsfaktor;
  const visualShrinkR = shrinkR * skalierungsfaktor;
  const visualShrinkL = sw.epsL * skalierungsfaktor;

  const visualScaleX = 1 - visualShrinkT;
  const visualScaleY = 1 - visualShrinkR;
  const visualScaleZ = 1 - visualShrinkL;

  const newBreite = sw.neueBreite;
  const newDicke = sw.neueDicke;
  const newLaenge = sw.neueLaenge;
  const feuchteHinweise = [...feuchteGl.hinweise, ...lagerung.hinweise, ...sw.hinweise];

  // Rechenkern src/calc/holzbau.ts: Bemessungswerte und Druck unter Winkel (6.16)
  const { fm, ft0, ft90, fc0, fc90, fv, E0mean, gammaM } = festigkeitsklassen[festigkeitsklasse];
  const fw = useMemo(() => festigkeitswerte({ fm, ft0, ft90, fc0, fc90, fv, gammaM, nkl: nklNummer(nkl), kled: KLED_NAME[kled], kc90, winkel }), [fm, ft0, ft90, fc0, fc90, fv, gammaM, nkl, kled, kc90, winkel]);
  const { kmod, fmd, ft0d, ft90d, fc0d, fc90d, fvd, fcad } = fw;
  const kdef = kdefFuer(holz, nklNummer(nkl));

  const hankinsonData = useMemo(() => {
    const labels = [];
    const data = [];
    const currentPoint = [];

    for (const { winkel: w, fcad: wert } of fw.kurve) {
      labels.push(`${formatDeWert(w)}°`);
      data.push(wert);
      currentPoint.push(Math.abs(w - winkel) < 2.5 ? fcad : null);
    }

    return {
      labels,
      datasets: [
        {
          label: inhalt.werte.druckfestigkeitFCD,
          data: data,
          borderColor: '#A3113E',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.4,
        },
        {
          label: inhalt.werte.aktuellerWinkel,
          data: currentPoint,
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          pointRadius: 6,
          pointStyle: 'circle',
          borderWidth: 2,
        }
      ]
    };
  }, [fw.kurve, winkel, fcad]);

  const hankinsonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: {
        title: { display: true, text: inhalt.werte.faserwinkel, font: { weight: 'bold' as const } }
      },
      y: {
        title: { display: true, text: inhalt.werte.druckfestigkeitMpa, font: { weight: 'bold' as const } },
        min: 0,
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.holzbauHolztechnologie} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.holzIstEinNatürlicher} /></p>
        </div>

        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">
        <div className="flex flex-col gap-6">

        {activeTab !== 'steckbrief' && (
        <div className="animate-in fade-in duration-300 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-main"><MdText text={inhalt.texte.holzartWerkstoff} /></label>
            <InfoTooltip text={inhalt.werte.auswahlDerHolzartOder} />
          </div>
          <select aria-label={inhalt.werte.holzartWerkstoff} 
            className="w-full p-3 border border-home-grau/30 rounded-xl focus:outline-none focus:border-shiraz bg-off-white"
            value={holz} 
          onChange={(e) => setHolz(e.target.value as keyof typeof holzArten)}
        >
          {Object.keys(holzArten).map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      )}

      {activeTab === 'grundlagen' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* Dynamischer Theorie-Bezug zur ausgewählten Holzart */}
          <div className="bg-shiraz/5 p-6 rounded-2xl border border-shiraz/35 space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-shiraz animate-pulse"></span><MdText text={inhalt.texte.spezifischeQuellSchwindtheorieFür} />{holz}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed"><MdText text={inhalt.texte.fürDieGewählteHolzart} /><strong>{holz}</strong><MdText text={inhalt.texte.geltenImFasersättigungsbereichFolgende} /></p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] text-home-grau font-bold uppercase tracking-wider"><MdText text={inhalt.texte.tangentialRingrichtungQT} /></span>
                <span className="text-xl font-mono font-black text-shiraz mt-1">{formatDeZahl(holzArten[holz].qt, 2)} %</span>
                <p className="text-[10px] text-slate-500 mt-1"><MdText text={inhalt.texte.breitenänderungSenkrechtZurRadialen} /></p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] text-home-grau font-bold uppercase tracking-wider"><MdText text={inhalt.texte.radialStrahlenrichtungQR} /></span>
                <span className="text-xl font-mono font-black text-slate-800 mt-1">{formatDeZahl(holzArten[holz].qr, 2)} %</span>
                <p className="text-[10px] text-slate-500 mt-1"><MdText text={inhalt.texte.dickenänderungParallelZuDen} /></p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] text-home-grau font-bold uppercase tracking-wider"><MdText text={inhalt.texte.longitudinalFaserrichtungQL} /></span>
                <span className="text-xl font-mono font-black text-slate-800 mt-1">{formatDeZahl(holzArten[holz].ql, 2)} %</span>
                <p className="text-[10px] text-slate-500 mt-1"><MdText text={inhalt.texte.äußerstGeringeMaßänderungLängs} /></p>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-home-grau/25 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-800"><MdText text={inhalt.texte.schwindSzenarioFür} />{holz}:</div>
              <p className="leading-relaxed"><MdText text={inhalt.texte.wirdDasMaterialVon} /><FormulaText text="\Delta u = 18\%" /><MdText text={inhalt.texte.verringernSichDieAbmessungen} /></p>
              <ul className="list-disc pl-5 space-y-1 text-slate-650">
                <li>Tangential: <strong className="font-mono text-shiraz">{formatDeZahl(schwindmass(18, holzArten[holz].qt), 2)}%</strong><MdText text={inhalt.texte.spürbareBreitenreduktion} /></li>
                <li>Radial: <strong className="font-mono text-slate-800">{formatDeZahl(schwindmass(18, holzArten[holz].qr), 2)}%</strong><MdText text={inhalt.texte.moderateDickenreduktion} /></li>
                <li>Longitudinal: <strong className="font-mono text-slate-800">{formatDeZahl(schwindmass(18, holzArten[holz].ql), 2)}%</strong><MdText text={inhalt.texte.längenänderungVernachlässigbar} /></li>
              </ul>
              <div className="text-[10px] text-slate-550 border-t border-home-grau/10 pt-1.5 mt-1.5 italic">
                {holz.includes('Brettschichtholz')
                  ? inhalt.werte.bshDieLamellenSind
                  : holz.includes('OSB') || holz.includes('Furnier')
                  ? inhalt.werte.holzwerkstoffEffektAbsperrungOsb
                  : inhalt.werte.naturwerkstoffVerhaltenDasHohe}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.quellenUndSchwindenAnhand} /></h2>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.holzIstEinHygroskopisches} /></p>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/80">
              <li><MdText text={inhalt.texte.freiesWasserKapillarwasserBefindet} /></li>
              <li><MdText text={inhalt.texte.gebundenesWasserBefindetSich} /></li>
              <li><MdText text={inhalt.texte.fasersättigungspunktFspEinZustand} /></li>
              <li><MdText text={inhalt.texte.quellenUndSchwindenEine} /></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h2 className="text-xl font-bold text-text-main mb-4"><MdText text={inhalt.texte.holzVsHolzwerkstoffe} /></h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400"></div><MdText text={inhalt.texte.vollholzMassivholz} /></h3>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
                  <p className="mb-3 font-medium"><MdText text={inhalt.texte.natürlichGewachsenesHolzDas} /></p>
                  <div className="text-sm grid grid-cols-1 gap-2">
                    <div className="bg-green-50 text-green-800 p-3 rounded-xl border border-green-200"><MdText text={inhalt.texte.hoheNatürlicheFestigkeitParallel} /></div>
                    <div className="bg-green-50 text-green-800 p-3 rounded-xl border border-green-200"><MdText text={inhalt.texte.geringerEnergieaufwandInDer} /></div>
                    <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-200"><MdText text={inhalt.texte.starkesAnisotropesQuellenUnd} /></div>
                    <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-200"><MdText text={inhalt.texte.inhomogenFehlstellenZB} /></div>
                    <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-200"><MdText text={inhalt.texte.abmessungenSindStriktDurch} /></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-shiraz text-xl mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-shiraz animate-pulse"></div><MdText text={inhalt.texte.holzwerkstoffeZBBsh} /></h3>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
                  <p className="mb-3 font-medium"><MdText text={inhalt.texte.ausZerkleinertemHolzBretter} /></p>
                  <div className="text-sm grid grid-cols-1 gap-2">
                    <div className="bg-green-50 text-green-800 p-3 rounded-xl border border-green-200"><MdText text={inhalt.texte.deutlichReduziertesUndHomogeneres} /></div>
                    <div className="bg-green-50 text-green-800 p-3 rounded-xl border border-green-200"><MdText text={inhalt.texte.höhereUndVerlässlichereFestigkeiten} /></div>
                    <div className="bg-green-50 text-green-800 p-3 rounded-xl border border-green-200"><MdText text={inhalt.texte.großeQuerschnitteLängenUnd} /></div>
                    <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-200"><MdText text={inhalt.texte.höhererPrimärenergieeinsatzBeiDer} /></div>
                    <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-200"><MdText text={inhalt.texte.verwendungVonSynthetischenKlebstoffen} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schwinden' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.anisotropesSchwinden3d} /></h2>
          
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.holzIstEinStark} /></p>
        </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main"><MdText text={inhalt.texte.holzproduktHolzart} /></label><InfoTooltip text={inhalt.werte.artDesVerwendetenHolzes} /></div>
            <select aria-label={inhalt.werte.holzproduktHolzart} 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={holz}
              onChange={(e) => setHolz(e.target.value as keyof typeof holzArten)}
            >
              {Object.keys(holzArten).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            
            <div className="mt-2 p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-main/60">Rohdichte <FormulaText text="\rho" />:</span>
                  <span className="font-bold">{formatDeWert(holzArten[holz].rho)} kg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/60">Wärmeleitf. <FormulaText text="\lambda" />:</span>
                  <span className="font-bold">{formatDeWert(holzArten[holz].lambda)} W/(mK)</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-text-main/60">{holz === 'OSB' ? <>Abbrandrate <FormulaText text="\beta_0" /><MdText text={inhalt.texte.platteDinEn1995} /></> : <><MdText text={inhalt.texte.ideelleAbbrandrate} /><FormulaText text="\beta_n" /><MdText text={inhalt.texte.dinEn19951} /></>}</span>
                  <span className="font-bold">{formatDeWert(holzArten[holz].beta0)} mm/min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Querschnitt</label><InfoTooltip text={inhalt.werte.abmessungenDesBauteilquerschnitts} /></div>
            <select aria-label="Querschnitt" 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={querschnitt}
              onChange={(e) => setQuerschnitt(e.target.value)}
            >
              {crossSections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <Slider
            label={inhalt.werte.einbaufeuchteUStart} info={inhalt.werte.holzfeuchteZumZeitpunktDes}
            min={5} max={40} step={1}
            value={uStart} unit="%"
            onChange={(e) => setUStart(Number(e.target.value))}
          />
          
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.lagerungUmgebung} /></h3>
            <Slider
              label="Temperatur" 
              min={-10} max={40} step={1}
              value={temp} unit="°C"
              onChange={(e) => setTemp(Number(e.target.value))}
            />
            <Slider
              label={inhalt.werte.relativeLuftfeuchte} info={inhalt.werte.relativeFeuchtigkeitDerUmgebungsluft}
              min={20} max={100} step={1}
              value={rh} unit="%"
              onChange={(e) => setRh(Number(e.target.value))}
            />
            <Slider
              label="Lagerdauer" 
              min={1} max={365} step={1}
              value={lagerDauer} unit=" Tage"
              onChange={(e) => setLagerDauer(Number(e.target.value))}
            />
            <div className="flex justify-between text-sm mt-2 pt-2 border-t border-home-grau/30">
              <span className="text-text-main/70">Gleichgewichtsfeuchte:</span>
              <span className="font-bold text-shiraz">{formatDeZahl(uGleichgewicht, 1)} %</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-main/70"><MdText text={inhalt.texte.erreichteEndfeuchte} /></span>
              <span className="font-bold text-shiraz">{formatDeZahl(uEnde, 1)} %</span>
            </div>
            <EingabeHinweise hinweise={feuchteHinweise} />
            <ErgebnisAnsage text={kurzzeile(ansageWert('Gleichgewichtsfeuchte', uGleichgewicht, 1, '%'), ansageWert('Endfeuchte', uEnde, 1, '%'))} />
          </div>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.abmessungenLage} /></h3>
            <Slider
              label={querschnitt === 'rund' ? inhalt.werte.durchmesserTR : 'Breite (T)'} info={inhalt.werte.breiteDesQuerschnittsIn}
              min={10} max={500} step={1}
              value={breite} unit=" mm"
              onChange={(e) => setBreite(Number(e.target.value))}
            />
            {querschnitt !== 'rund' && (
              <Slider
                label="Dicke (R)" info={inhalt.werte.dickeDesQuerschnittsIn}
                min={10} max={300} step={1}
                value={dicke} unit=" mm"
                onChange={(e) => setDicke(Number(e.target.value))}
              />
            )}
            <Slider
              label="Länge (L)" info={inhalt.werte.längeDesBauteils}
              min={100} max={5000} step={10}
              value={laenge} unit=" mm"
              onChange={(e) => setLaenge(Number(e.target.value))}
            />
            {querschnitt !== 'rund' && (
              <div className="flex flex-col gap-4">
                <Slider
                  label={inhalt.werte.exzentrizitätXAbstandMarkröhre} 
                  min={0} max={200} step={5}
                  value={exzentrizitaetX} unit=" mm"
                  onChange={(e) => setExzentrizitaetX(Number(e.target.value))}
                />
                <Slider
                  label={inhalt.werte.exzentrizitätYAbstandMarkröhre} 
                  min={0} max={200} step={5}
                  value={exzentrizitaetY} unit=" mm"
                  onChange={(e) => setExzentrizitaetY(Number(e.target.value))}
                />
              </div>
            )}
            <Slider
              label={inhalt.werte.skalierungsfaktorDarstellung}
              min={1} max={50} step={1}
              value={skalierungsfaktor} unit="x"
              info={inhalt.werte.überhöhungDerVerformungFür}
              onChange={(e) => setSkalierungsfaktor(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[700px]">
          <h2 className="text-xl font-bold text-text-main mb-4"><MdText text={inhalt.texte.t3dVerformung} /></h2>
          
          <div className="flex-1 relative w-full h-full bg-off-white rounded-xl overflow-hidden border border-home-grau/30">
            <React.Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-sm text-text-main/60"><MdText text={inhalt.texte.t3dAnsichtWirdGeladen} /></div>}>
              <HolzSchwinden3D
                querschnitt={querschnitt} breite={breite} dicke={dicke} laenge={laenge}
                exzentrizitaetX={exzentrizitaetX} exzentrizitaetY={exzentrizitaetY}
                visualShrinkT={visualShrinkT} visualShrinkR={visualShrinkR}
                visualScaleX={visualScaleX} visualScaleY={visualScaleY} visualScaleZ={visualScaleZ}
              />
            </React.Suspense>
            
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm text-xs border border-home-grau/30">
              <div className="font-bold text-text-main mb-1"><MdText text={inhalt.texte.achsenLegende} /></div>
              <div className="text-red-500"><MdText text={inhalt.texte.xRotTangentialBreite} /></div>
              <div className="text-green-500"><MdText text={inhalt.texte.yGrünRadialDicke} /></div>
              <div className="text-blue-500"><MdText text={inhalt.texte.zBlauLongitudinalLänge} /></div>
              <div className="text-[#A3113E] mt-2 font-bold"><MdText text={inhalt.texte.rotesGitterAusgangszustand} /></div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-4 text-center">
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
              <div className="text-xs text-text-main/60 uppercase tracking-wider">
                {querschnitt === 'rund' ? inhalt.werte.durchmesserT : 'Breite (T)'}
              </div>
              <div className="text-lg font-bold text-shiraz">{formatDeZahl(newBreite, 1)} mm</div>
              <div className="text-xs text-torch-red">Δ {formatDeZahl((newBreite - breite), 1)} mm</div>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
              <div className="text-xs text-text-main/60 uppercase tracking-wider">
                {querschnitt === 'rund' ? inhalt.werte.durchmesserR : 'Dicke (R)'}
              </div>
              <div className="text-lg font-bold text-shiraz">
                {formatDeZahl(newDicke, 1)} mm
              </div>
              <div className="text-xs text-torch-red">
                Δ {formatDeZahl(newDicke - dickeWirksam, 1)} mm
              </div>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
              <div className="text-xs text-text-main/60 uppercase tracking-wider">Länge (L)</div>
              <div className="text-lg font-bold text-shiraz">{formatDeZahl(newLaenge, 1)} mm</div>
              <div className="text-xs text-torch-red">Δ {formatDeZahl((newLaenge - laenge), 1)} mm</div>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
              <div className="text-xs text-text-main/60 uppercase tracking-wider">Volumenschwindmaß</div>
              <div className="text-lg font-bold text-shiraz">{formatDeZahl(sw.epsV * 100, 1)} %</div>
              <div className="text-xs text-text-main/60">ΔV / V</div>
            </div>
            <div className="bg-off-white p-3 rounded-xl border border-home-grau/30">
              <div className="text-xs text-text-main/60 uppercase tracking-wider"><MdText text={inhalt.texte.verhältnisTR} /></div>
              <div className="text-lg font-bold text-shiraz">{formatDeZahl((shrinkT / shrinkR || 0), 2)}</div>
              <div className="text-xs text-text-main/60">Anisotropie</div>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'festigkeit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.holzfestigkeitEc5} /></h2>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main"><MdText text={inhalt.texte.sortierklasseFestigkeitsklasse} /></label><InfoTooltip text={inhalt.werte.klassifizierungDesHolzesNach} /></div>
            <select aria-label={inhalt.werte.sortierklasseFestigkeitsklasse} 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={festigkeitsklasse}
              onChange={(e) => setFestigkeitsklasse(e.target.value as keyof typeof festigkeitsklassen)}
            >
              {Object.keys(festigkeitsklassen).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main"><MdText text={inhalt.texte.nutzungsklasseNkl} /></label><InfoTooltip text={inhalt.werte.einteilungNachDenKlimatischen} /></div>
            <select aria-label={inhalt.werte.nutzungsklasseNkl} 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={nkl}
              onChange={(e) => setNkl(e.target.value as NklName)}
            >
              <option value="NKL 1">NKL 1 (Innenraum, trocken)</option>
              <option value="NKL 2">NKL 2 (Überdacht, außen)</option>
              <option value="NKL 3">NKL 3 (Frei bewittert)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main"><MdText text={inhalt.texte.klasseDerLasteinwirkungsdauerKled} /></label><InfoTooltip text={inhalt.werte.einteilungDerLastenNach} /></div>
            <select aria-label={inhalt.werte.klasseDerLasteinwirkungsdauerKled} 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={kled}
              onChange={(e) => setKled(e.target.value)}
            >
              <option value="ständig">Ständig (z.B. Eigengewicht)</option>
              <option value="lang">Lang (z.B. Lagerstoffe)</option>
              <option value="mittel">Mittel (z.B. Nutzlast)</option>
              <option value="kurz">Kurz (z.B. Schnee, Wind)</option>
              <option value="sehr kurz">Sehr kurz (z.B. Anprall)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main"><MdText text={inhalt.texte.auflagerbedingungKC90} /></label><InfoTooltip text={inhalt.werte.beiwertZurBerücksichtigungDer} /></div>
            <select aria-label={inhalt.werte.auflagerbedingungKC90} 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
              value={kc90}
              onChange={(e) => setKc90(Number(e.target.value))}
            >
              <option value={1.0}>1,00 (Standard, keine Erhöhung)</option>
              <option value={1.25}>1,25 (Nadelvollholz, kontinuierliche Auflagerung, l₁ ≥ 2h)</option>
              <option value={1.50}>1,50 (Nadelvollholz Einzelauflager bzw. BSH kontinuierlich, l₁ ≥ 2h)</option>
              <option value={1.75}>1,75 (BSH Einzelauflager, l₁ ≥ 2h, Aufstandslänge l ≤ 400 mm)</option>
            </select>
          </div>

          <Slider
            label={inhalt.werte.faserwinkelDruck}
            min={0} max={90} step={1}
            value={winkel} unit="°"
            
            onChange={(e) => setWinkel(Number(e.target.value))}
          />
        </div>

        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col">
          <h2 className="text-xl font-bold text-text-main mb-4"><MdText text={inhalt.texte.bemessungswerteDerFestigkeitF} /></h2>
          <EingabeHinweise hinweise={fw.hinweise} />
          <ErgebnisAnsage text={kurzzeile(`${festigkeitsklasse}: ${ansageWert('k_mod', kmod, 2)}`, ansageWert('f_m,d', fmd, 2, 'MPa'), ansageWert(`f_c,α,d bei ${formatDeZahl(winkel, 0)}°`, fcad, 2, 'MPa'))} />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="text-xs font-bold text-home-grau mb-1"><MdText text={inhalt.texte.modifikationsbeiwertKMod} /></h3>
              <div className="text-2xl font-bold text-text-main">{formatDeZahl(kmod, 2)}</div>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="text-xs font-bold text-home-grau mb-1"><MdText text={inhalt.texte.teilsicherheitsbeiwertM} /></h3>
              <div className="text-2xl font-bold text-text-main">{formatDeZahl(gammaM, 2)}</div>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h3 className="text-xs font-bold text-home-grau mb-1"><MdText text={inhalt.texte.eModulE0} /></h3>
              <div className="text-2xl font-bold text-text-main">{formatDeWert(E0mean)} <span className="text-sm font-normal">MPa</span></div>
            </div>
            <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/20">
              <h3 className="text-xs font-bold text-shiraz mb-1"><MdText text={inhalt.texte.druckfestigkeitFCD} />{formatDeWert(winkel)}°)</h3>
              <div className="text-2xl font-bold text-shiraz">{formatDeZahl(fcad, 2)} <span className="text-sm font-normal">MPa</span></div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-home-grau/30">
                  <th className="py-3 px-4 font-bold text-text-main">Beanspruchung</th>
                  <th className="py-3 px-4 font-bold text-text-main"><MdText text={inhalt.texte.charakteristischFK} /></th>
                  <th className="py-3 px-4 font-bold text-shiraz"><MdText text={inhalt.texte.bemessungswertFD} /></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-home-grau/10">
                  <td className="py-3 px-4 font-medium text-text-main"><MdText text={inhalt.texte.biegungFM} /></td>
                  <td className="py-3 px-4">{formatDeZahl(fm, 1)} MPa</td>
                  <td className="py-3 px-4 font-bold text-shiraz">{formatDeZahl(fmd, 2)} MPa</td>
                </tr>
                <tr className="border-b border-home-grau/10 bg-off-white/50">
                  <td className="py-3 px-4 font-medium text-text-main"><MdText text={inhalt.texte.zugParallelFT} /></td>
                  <td className="py-3 px-4">{formatDeZahl(ft0, 1)} MPa</td>
                  <td className="py-3 px-4 font-bold text-shiraz">{formatDeZahl(ft0d, 2)} MPa</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-3 px-4 font-medium text-text-main"><MdText text={inhalt.texte.zugRechtwinkligFT} /></td>
                  <td className="py-3 px-4">{formatDeZahl(ft90, 1)} MPa</td>
                  <td className="py-3 px-4 font-bold text-shiraz">{formatDeZahl(ft90d, 2)} MPa</td>
                </tr>
                <tr className="border-b border-home-grau/10 bg-off-white/50">
                  <td className="py-3 px-4 font-medium text-text-main"><MdText text={inhalt.texte.druckParallelFC} /></td>
                  <td className="py-3 px-4">{formatDeZahl(fc0, 1)} MPa</td>
                  <td className="py-3 px-4 font-bold text-shiraz">{formatDeZahl(fc0d, 2)} MPa</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-3 px-4 font-medium text-text-main"><MdText text={inhalt.texte.druckRechtwinkligFC} /></td>
                  <td className="py-3 px-4">{formatDeZahl(fc90, 1)} MPa</td>
                  <td className="py-3 px-4 font-bold text-shiraz">{formatDeZahl(fc90d, 2)} MPa</td>
                </tr>
                <tr className="border-b border-home-grau/10 bg-off-white/50">
                  <td className="py-3 px-4 font-medium text-text-main"><MdText text={inhalt.texte.schubScherungFV} /></td>
                  <td className="py-3 px-4">{formatDeZahl(fv, 1)} MPa</td>
                  <td className="py-3 px-4 font-bold text-shiraz">{formatDeZahl(fvd, 2)} MPa</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-text-main/70 mt-2"><MdText text={inhalt.texte.kennwerteNachDinEn} /><FormulaText text="\gamma_M = 1{,}3" /><MdText text={inhalt.texte.nachDinEn1995} /><FormulaText text="k_{cr}" /><MdText text={inhalt.texte.anzusetzenNa} /><FormulaText text="2{,}0/f_{v,k}" /><MdText text={inhalt.texte.fürVollholz} /><FormulaText text="2{,}5/f_{v,k}" /><MdText text={inhalt.texte.fürBshDerHöhenbeiwert} /><FormulaText text="k_h" /><MdText text={inhalt.texte.istHierNichtBerücksichtigt} /></p>
          </div>

          <div className="mt-6">
            <FormulaDerivationBox
              title={inhalt.werte.anwendungsbeispielBiegetragfähigkeitEine}
              zielGleichung="M_{Rd} = k_{mod} \cdot \frac{f_{m,k}}{\gamma_M} \cdot W"
              normQuelle={inhalt.werte.dinEn19951}
              schritte={inhalt.daten["Holz.schritte"]}
              ergebnisHinweis={inhalt.werte.ausnutzung71KippenSchub}
            />
          </div>

          <div className="mt-6 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <h3 className="text-sm font-bold text-text-main mb-2"><MdText text={inhalt.texte.hankinsonGleichungDruckUnter} /></h3>
            <p className="text-sm text-home-grau mb-4"><MdText text={inhalt.texte.dieDruckfestigkeitVonHolz} /></p>
            <div className="bg-white p-3 rounded border border-home-grau/30 mb-4 overflow-x-auto">
              <BlockMath math={String.raw`f_{c,\alpha,d} = \frac{f_{c,0,d}}{\dfrac{f_{c,0,d}}{k_{c,90}\cdot f_{c,90,d}}\,\sin^2\alpha + \cos^2\alpha}`} />
            </div>
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 h-[300px] flex flex-col">
              <h4 className="text-sm font-bold text-center mb-2"><MdText text={inhalt.texte.druckfestigkeitVsFaserwinkel} /></h4>
              <div className="flex-1 relative">
                <Line data={hankinsonData} options={hankinsonOptions} />
              </div>
            </div>
          </div>

          {/* Schematische Darstellung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
            <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungFaserrichtungUnd} /></h3>
            <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
              <svg width="100%" height="160" viewBox="0 0 350 160">
                {/* Holzbalken */}
                <rect x="100" y="40" width="150" height="80" fill="#cbd5e1" stroke="#A3113E" strokeWidth="2" />
                
                {/* Holzfasern (parallel zur x-Achse) */}
                <path d="M 100 50 L 250 50 M 100 60 L 250 60 M 100 70 L 250 70 M 100 80 L 250 80 M 100 90 L 250 90 M 100 100 L 250 100 M 100 110 L 250 110" stroke="#A3113E" strokeWidth="1" strokeDasharray="10 5" opacity="0.5" />

                {/* Druck parallel (f_c,0) */}
                <path d="M 60 80 L 90 80" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow-red-holz)" />
                <path d="M 290 80 L 260 80" stroke="#A3113E" strokeWidth="3" markerEnd="url(#arrow-red-holz)" />
                <text x="75" y="70" fontSize="10" fill="#A3113E" textAnchor="middle" fontWeight="bold">f_c,0</text>
                <text x="275" y="70" fontSize="10" fill="#A3113E" textAnchor="middle" fontWeight="bold">f_c,0</text>

                {/* Druck rechtwinklig (f_c,90) */}
                <path d="M 175 10 L 175 30" stroke="#475569" strokeWidth="3" markerEnd="url(#arrow-blue-holz)" />
                <path d="M 175 150 L 175 130" stroke="#475569" strokeWidth="3" markerEnd="url(#arrow-blue-holz)" />
                <text x="195" y="25" fontSize="10" fill="#475569" textAnchor="start" fontWeight="bold">f_c,90</text>
                <text x="195" y="145" fontSize="10" fill="#475569" textAnchor="start" fontWeight="bold">f_c,90</text>

                {/* Faserwinkel α */}
                {(() => {
                  if (winkel > 0 && winkel < 90) {
                    const angleRad = (winkel * Math.PI) / 180;
                    const dx = 40 * Math.cos(angleRad);
                    const dy = 40 * Math.sin(angleRad);
                    return (
                      <g>
                        <path d={`M ${175 - dx} ${80 - dy} L ${175} 80`} stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-orange-holz)" />
                        <text x={175 - dx - 10} y={80 - dy - 10} fontSize="10" fill="#64748b" textAnchor="middle" fontWeight="bold">F_α</text>
                        <path d="M 135 80 A 40 40 0 0 1 150 55" fill="none" stroke="#1e293b" strokeWidth="1" />
                        <text x="140" y="75" fontSize="10" fill="#1e293b">α</text>
                      </g>
                    );
                  }
                  return null;
                })()}

                <defs>
                  <marker id="arrow-red-holz" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#A3113E" />
                  </marker>
                  <marker id="arrow-blue-holz" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                  </marker>
                  <marker id="arrow-orange-holz" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                  </marker>
                </defs>
              </svg>
              <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.holzIstEinAnisotropes} /></div>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'kriechen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.kriechenVerformungEc5} /></h2>
          
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.dieKriechverformungVonHolz} /><FormulaText text="k_{def}" /><MdText text={inhalt.texte.berücksichtigtDieserHängtVon} /></p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-text-main"><MdText text={inhalt.texte.holzartWerkstoff2} /></label>
              <InfoTooltip text={inhalt.werte.auswahlDerHolzartOder2} />
            </div>
            <select aria-label={inhalt.werte.holzartWerkstoff2} 
              className="w-full p-2.5 border border-home-grau/30 rounded-xl bg-off-white text-text-main focus:outline-none focus:border-shiraz"
              value={holz} 
              onChange={(e) => setHolz(e.target.value as keyof typeof holzArten)}
            >
              {Object.keys(holzArten).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-text-main"><MdText text={inhalt.texte.nutzungsklasseNkl2} /></label>
              <InfoTooltip text={inhalt.werte.einflussDerDauerfeuchteDer} />
            </div>
            <select aria-label={inhalt.werte.nutzungsklasseNkl2} 
              className="w-full p-2.5 border border-home-grau/30 rounded-xl bg-off-white text-text-main focus:outline-none focus:border-shiraz"
              value={nkl} 
              onChange={(e) => setNkl(e.target.value as NklName)}
            >
              <option value="NKL 1">NKL 1 (Innenraum, trocken)</option>
              <option value="NKL 2">NKL 2 (Überdacht, außen)</option>
              <option value="NKL 3">NKL 3 (Frei bewittert)</option>
            </select>
          </div>

          <div className="border-t border-home-grau/20 pt-4 space-y-4">
            <h3 className="text-xs font-bold text-home-grau uppercase tracking-wider">Feuchtesimulation</h3>
            
            <Slider
              label={inhalt.werte.einbaufeuchteUStart2} info={inhalt.werte.feuchtegehaltBeimEinbau}
              min={5} max={40} step={1}
              value={uStart} unit="%"
              onChange={(e) => setUStart(Number(e.target.value))}
            />
            
            <Slider
              label={inhalt.werte.relLuftfeuchteUmgebung} info={inhalt.werte.beeinflusstDieAusgleichsfeuchte}
              min={20} max={100} step={1}
              value={rh} unit="%"
              onChange={(e) => setRh(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-bold text-text-main mb-2"><FormulaText text={inhalt.werte.verformungsbeiwertKDef} /></h3>
              <div className="text-5xl font-bold text-shiraz my-4">
                {kdef !== null ? formatDeZahl(kdef, 2) : 'N/A'}
              </div>
              <p className="text-sm text-text-main/80">
                {kdef === null ? inhalt.werte.fürDieseKombinationNicht : inhalt.werte.berücksichtigtDieKriechverformungÜber}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <h3 className="text-lg font-bold text-text-main text-center mb-1"><MdText text={inhalt.texte.differentiellesQuellSchwindmaß} /></h3>
              
              <div className="space-y-4 my-2">
                <div className="flex justify-between items-center pb-2 border-b border-home-grau/10">
                  <span className="text-xs font-semibold text-slate-500"><MdText text={inhalt.texte.tangentialQuerZurFaser} /></span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#A3113E]">
                      {formatDeZahl(sw.mikroT, 0)}
                    </span>
                    <span className="text-xs font-bold text-slate-500 ml-1">μm/m</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-home-grau/10">
                  <span className="text-xs font-semibold text-slate-500"><MdText text={inhalt.texte.radialQuerZurFaser} /></span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#A3113E]">
                      {formatDeZahl(sw.mikroR, 0)}
                    </span>
                    <span className="text-xs font-bold text-slate-500 ml-1">μm/m</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500"><MdText text={inhalt.texte.longitudinalFaserparallel} /></span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-400">
                      {formatDeZahl(sw.mikroL, 0)}
                    </span>
                    <span className="text-xs font-bold text-slate-400 ml-1">μm/m</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-text-main/70 text-center leading-relaxed"><MdText text={inhalt.texte.rechnerischeHübeBeiFeuchteänderung} /><span className="font-bold text-shiraz">{formatDeZahl(deltaU, 1)}%</span> (Einbau {formatDeWert(uStart)}<MdText text={inhalt.texte.vsEndfeuchte} />{formatDeZahl(uEnde, 1)}<MdText text={inhalt.texte.basierendAufDenMaterialspezifischen} /><strong>{holz}</strong>.
              </p>
            </div>
          </div>
          
          <div className="bg-off-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-lg font-bold text-text-main mb-2"><MdText text={inhalt.texte.relaxationBeiHolz} /></h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.beiHolzWirdDie} /><code className="bg-white px-2 py-1 rounded border border-home-grau/50"><FormulaText text={inhalt.werte.eMeanFinE} /></code><MdText text={inhalt.texte.brBrDiesIst} /></p>
          </div>
        </div>
      </div>
      )}
    
      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300">
          <BaustoffProfil materialKey="holz" />
        </div>
      )}
        </div>
        </ModuleTabs>
      </div>
    
      <WoodThematicLinks current="baustoff" />

      <ModulTest moduleId="holz" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Holz', url: 'https://de.wikipedia.org/wiki/Holz' },
          { title: 'Holzfeuchte', url: 'https://de.wikipedia.org/wiki/Holzfeuchte' },
          { title: inhalt.werte.schwindmaßHolz, url: 'https://de.wikipedia.org/wiki/Schwindma%C3%9F_(Holz)' },
          inhalt.daten["Holz.wikipedia.3"]
        ]}
        literatur={inhalt.daten["Holz.literatur"]}
        regelwerke={inhalt.daten["Holz.regelwerke"]}
        weblinks={inhalt.daten["Holz.weblinks"]}
        formeln={inhalt.daten["Holz.formeln"]}
      />
    </div>
  );
}
