import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { daemmBerater, FX_KELLERDECKE } from '@/src/calc/bauprodukte';
import { 
  Calculator, 
  Info, 
  AlertTriangle, 
  Check, 
  ShieldAlert, 
  BookmarkCheck,
  Zap
} from 'lucide-react';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

// Definitions matching the exact scientific building physics standards
interface ApplicationType {
  id: string;
  name: string;
  gegTarget: number; // U-value in W/(m²K)
  defaultThickness: number; // in cm
  r_se: number; // external heat transition resistance
  r_si: number; // internal heat transition resistance
  description: string;
}

interface ExistingStructure {
  id: string;
  name: string;
  thickness: number; // in m
  lambda: number; // W/(mK)
  r_value: number; // m²K/W
  description: string;
}

interface DämmstoffBeraterMaterial {
  name: string;
  abbreviation: string;
  lambda: number; // W/(mK)
  vaporResistance: number; // µ-value
  fireClass: string;
  ecological: boolean;
  color: string; // for physical layer graphics
  warningText?: string;
}

const APPLICATIONS: ApplicationType[] = [
  { id: 'wall', name: 'Außenwand (Vollwärmeschutz/Innendämmung)', gegTarget: 0.24, defaultThickness: 14, r_si: 0.13, r_se: 0.04, description: 'Außenwandflächen von beheizten Räumen gegen Außenluft nach Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, vormals GEG Anlage 7, jetzt zu § 36 GModG).' },
  { id: 'roof_flat', name: 'Flachdach (Warmdach/Umkehrdach)', gegTarget: 0.20, defaultThickness: 18, r_si: 0.10, r_se: 0.04, description: 'Flache oder flachgeneigte Dächer gegen die Außenluft mit Abdichtungen.' },
  { id: 'roof_steep', name: 'Steildach / Dachschräge (Zwischen-/Aufsparren)', gegTarget: 0.24, defaultThickness: 16, r_si: 0.10, r_se: 0.04, description: 'Dächer von beheizten Räumen mit Steildachneigung (Gefachdämmung).' },
  { id: 'basement_ceiling', name: 'Kellerdecke (unbeheizter Kellerabgang)', gegTarget: 0.30, defaultThickness: 10, r_si: 0.17, r_se: 0.17, description: 'Decken nach unten gegen unbeheizte Räume oder Erdreich.' },
  { id: 'basement_wall', name: 'Kelleraußenwand (Perimeter unter Erdreich)', gegTarget: 0.30, defaultThickness: 12, r_si: 0.13, r_se: 0.00, description: 'Erdberührte Wandflächen von beheizten Kellerräumen gegen das Erdreich.' }
];

const EXISTING_LAYERS: ExistingStructure[] = [
  { id: 'brick_thick', name: 'Altbau Vollziegelmauerwerk (38 cm)', thickness: 0.38, lambda: 0.81, r_value: 0.47, description: 'Klassisches ungedämmtes Ziegelmauerwerk vor 1970.' },
  { id: 'brick_thin', name: 'Altbau Mauerwerk (24 cm)', thickness: 0.24, lambda: 0.81, r_value: 0.30, description: 'Klassisches ungedämmtes einschaliges Mauerwerk.' },
  { id: 'concrete', name: 'Stahlbetonwand (20 cm)', thickness: 0.20, lambda: 2.30, r_value: 0.09, description: 'Tragende Betonkonstruktion, leitet Wärme extrem stark ab.' },
  { id: 'hollow_brick', name: 'Hochlochziegel-Mauerwerk (24 cm)', thickness: 0.24, lambda: 0.28, r_value: 0.86, description: 'Modernerer Lochziegel mit leicht verbesserter Wärmedämmung.' },
  { id: 'none', name: 'Kein Altbestand (Reiner Neubauaufbau)', thickness: 0.00, lambda: 1.00, r_value: 0.00, description: 'Wiederkehrende Dämmstärke im Neubaurahmen.' }
];

const MATERIALS: DämmstoffBeraterMaterial[] = [
  { name: 'Glaswolle', abbreviation: 'GW', lambda: 0.035, vaporResistance: 1, fireClass: 'A1 (Nicht brennbar)', ecological: false, color: '#f1f5f9' },
  { name: 'Steinwolle', abbreviation: 'SW', lambda: 0.035, vaporResistance: 1, fireClass: 'A1 (Nicht brennbar)', ecological: false, color: '#E2E8F0' },
  { name: 'Polystyrol Hartschaum (EPS)', abbreviation: 'EPS', lambda: 0.032, vaporResistance: 40, fireClass: 'B1 (Schwer entflammbar)', ecological: false, color: '#F1F5F9' },
  { name: 'Extrudiertes Polystyrol (XPS)', abbreviation: 'XPS', lambda: 0.035, vaporResistance: 100, fireClass: 'B1 (Schwer entflammbar)', ecological: false, color: '#cbd5e1', warningText: 'Achtung: XPS ist extrem diffusionsdicht. Im Steildach oder Holzrahmenbau nur mit präziser bauphysikalischer Dampfbremsberechnung einsetzen!' },
  { name: 'Polyurethan (PUR/PIR)', abbreviation: 'PUR', lambda: 0.024, vaporResistance: 60, fireClass: 'B1 (Schwer entflammbar)', ecological: false, color: '#f8fafc' },
  { name: 'Phenolharz-Hartschaum', abbreviation: 'PF', lambda: 0.021, vaporResistance: 35, fireClass: 'B1 (Schwer entflammbar)', ecological: false, color: '#f8fafc' },
  { name: 'Holzfaser-Dämmplatte', abbreviation: 'WF', lambda: 0.040, vaporResistance: 5, fireClass: 'B2 (Normal entflammbar)', ecological: true, color: '#cbd5e1' },
  { name: 'Zellulosedämmung', abbreviation: 'CI', lambda: 0.038, vaporResistance: 2, fireClass: 'B1 (Schwer entflammbar)', ecological: true, color: '#CBD5E1' },
  { name: 'Hanffaser-Dämmmatte', abbreviation: 'HF', lambda: 0.040, vaporResistance: 2, fireClass: 'B2 (Normal entflammbar)', ecological: true, color: '#475569' },
  { name: 'Baustroh-Ballen', abbreviation: 'ST', lambda: 0.045, vaporResistance: 2, fireClass: 'B2 (Normal entflammbar)', ecological: true, color: '#f1f5f9' },
  { name: 'Schaumglas-Platte', abbreviation: 'CG', lambda: 0.040, vaporResistance: 99999, fireClass: 'A1 (Absolut dampfdicht)', ecological: false, color: '#475569', warningText: 'Zellstruktur aus Glas ist absolut diffusionsdicht. Ideal für Kelleraußenwände und Flachdächer, verhindert jeglichen Feuchteeintrag.' },
  { name: 'Vakuum-Panel (VIP)', abbreviation: 'VIP', lambda: 0.007, vaporResistance: 99999, fireClass: 'B2 (Normal entflammbar)', ecological: false, color: '#94A3B8', warningText: 'Extrem dünn, darf aber unter keinen Umständen geschnitten oder durchbohrt werden!' }
];

export function DaemmungBerater() {
  const [selectedApp, setSelectedApp] = useState<string>(APPLICATIONS[0].id);
  const [selectedExisting, setSelectedExisting] = useState<string>(EXISTING_LAYERS[0].id);
  const [selectedMaterial, setSelectedMaterial] = useState<string>(MATERIALS[2].name);
  const [thickness, setThickness] = useState<number>(14); // in cm

  const app = useMemo(() => APPLICATIONS.find(a => a.id === selectedApp)!, [selectedApp]);
  const existing = useMemo(() => EXISTING_LAYERS.find(e => e.id === selectedExisting)!, [selectedExisting]);
  const material = useMemo(() => MATERIALS.find(m => m.name === selectedMaterial)!, [selectedMaterial]);

  // Rechenkern src/calc/bauprodukte.ts: U nach DIN EN ISO 6946, Einsparung ΔU · F_x · 84 kKh/a (≈ 3 500 Kd), CO₂ 0,24 kg/kWh (Erdgas, Anlage 9)
  const r_existing = existing.r_value;
  const berechnung = useMemo(() => daemmBerater({ rBestand: r_existing, dickeCm: thickness, lambda: material.lambda, rsi: app.r_si, rse: app.r_se, uZiel: app.gegTarget, ohneBestand: existing.id === 'none', fx: selectedApp === 'basement_ceiling' ? FX_KELLERDECKE : 1.0 }),
    [r_existing, thickness, material.lambda, app, existing.id, selectedApp]);
  const u_value = berechnung.uNeu;
  const u_existing = berechnung.uAlt;
  const meetsGeg = berechnung.erfuellt;
  const energySavingsKwh = berechnung.einsparung;
  const co2SavingsKg = berechnung.co2;

  // Dynamic hygrothermal behavior assessment (Bauphysikalische Risikoanalyse)
  const hydroThermalAssessment = useMemo(() => {
    if (selectedApp === 'basement_ceiling' && material.vaporResistance >= 100) {
      return {
        class: 'warning',
        title: 'Erhöhter Feuchtestau bei Holzbalkendecken möglich',
        text: 'Wird eine ungedämmte Kellerdecke aus Holzträgern mit diffusionsdichtem Material (wie XPS) unterseitig gedämmt, kann Raumfeuchte am kalten Tragwerk kondensieren. Bevorzuge diffusionsoffene Mineralwolle.',
        icon: ShieldAlert
      };
    }
    if (selectedApp === 'basement_wall' && !['XPS', 'CG'].includes(material.abbreviation)) {
      return {
        class: 'danger',
        title: 'Risiko durch kapillaren Feuchteeintrag',
        text: 'Für erdberührte Perimeterdämmung sind nur wasserbeständige, verrottungsfeste Dämmstoffe mit Verwendbarkeitsnachweis zulässig, z. B. XPS oder Schaumglas; EPS nur als Perimeterdämmplatte mit Bauartgenehmigung und meist nur bei Bodenfeuchte (W1-E). Faserdämmstoffe nehmen Feuchtigkeit auf und verlieren einen Großteil ihrer Dämmwirkung.',
        icon: AlertTriangle
      };
    }
    if (material.vaporResistance > 500) {
      return {
        class: 'info',
        title: 'Diffusionsdichter Schichtaufbau',
        text: 'Dieses Material blockiert Dampfdiffusion vollständig. Ein Feuchteausgleich nach außen wird unterbunden. Stellen Sie sicher, dass keine feuchte Luft im Innenraum hinter die Dämmschicht wandern kann.',
        icon: Info
      };
    }
    if (material.ecological) {
      return {
        class: 'success',
        title: 'Hervorragender ökologischer Feuchtespeicher',
        text: 'Das gewählte biobasierte Produkt ist kapillaraktiv und diffusionsoffen. Es kann Raumfeuchte puffern und schadlos wieder abgeben. Perfekt für ein wohngesundes Raumklima!',
        icon: Check
      };
    }
    return {
      class: 'success',
      title: 'Bauphysikalisch gutmütiger Standardaufbau',
      text: 'Der gewählte Aufbau entspricht anerkannten Regeln der Technik. Auf einwandfreie Luftdichtigkeit der Dampfbremsfolie an Anschlüssen und Durchdringungen ist strikt zu achten.',
      icon: Check
    };
  }, [selectedApp, material]);

  // Mindestdicke für den Höchstwert nach Anlage 7 GModG (vormals GEG)
  const recThickness = berechnung.empfDickeCm;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-shiraz/5 to-amber-500/5 p-5 rounded-2xl border border-shiraz/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-bold text-text-main text-base flex items-center gap-2">
            <Calculator className="text-shiraz" size={18} /> Interaktiver Dämmstoff-Berater &amp; U-Wert-Kalkulator
          </h3>
          <p className="text-xs text-text-main/70 mt-1">
            Simulieren Sie den Wärmeschutz und das hygrothermische Verhalten verschiedener Dämmstoffe nach dem Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, vormals GEG) und physikalischen Standardformeln.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-200">
          <Zap size={14} /> DIN 4108 &amp; GModG konform
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column (left) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Step 1: Application Area Selection */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              1. Bauteil / Anwendungsbereich auswählen
            </label>
            <select aria-label="1. Bauteil / Anwendungsbereich auswählen"
              value={selectedApp}
              onChange={(e) => {
                setSelectedApp(e.target.value);
                // Adjust default thickness dynamically to fit app context
                const selected = APPLICATIONS.find(a => a.id === e.target.value);
                if (selected) setThickness(selected.defaultThickness);
              }}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
            >
              {APPLICATIONS.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 italic leading-normal">
              {app.description} (GModG Ziel-U-Wert: <strong className="font-bold text-slate-700">{formatDeWert(app.gegTarget)} W/m²K</strong>)
            </p>
          </div>

          {/* Step 2: Existing wall thickness */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              2. Vorhandener Bauteil-Altbestand
            </label>
            <select aria-label="2. Vorhandener Bauteil-Altbestand"
              value={selectedExisting}
              onChange={(e) => setSelectedExisting(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
            >
              {EXISTING_LAYERS.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
            {existing.id !== 'none' && (
              <p className="text-[11px] text-slate-500 leading-normal">
                {existing.description} (Wärmeleitfähigkeit λ: <strong className="font-bold text-slate-700">{formatDeWert(existing.lambda)} W/mK</strong>, Altwert U: <strong className="font-bold text-red-700">{formatDeZahl(u_existing, 2)} W/m²K</strong>)
              </p>
            )}
          </div>

          {/* Step 3: Material selection */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                3. Dämmstoffklasse wählen
              </label>
              {material.ecological && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md">
                  Ökologisch
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {MATERIALS.map(m => (
                <button
                  key={m.name}
                  onClick={() => setSelectedMaterial(m.name)}
                  className={`p-2.5 border text-left rounded-xl transition-all flex flex-col gap-1 cursor-pointer ${
                    m.name === selectedMaterial 
                      ? 'bg-shiraz/5 border-shiraz shadow-sm ring-1 ring-shiraz'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-800">{m.name}</span>
                  <div className="flex justify-between items-center text-[9px] w-full text-slate-500 font-mono">
                    <span>{m.abbreviation}</span>
                    <span>λ: {formatDeZahl(m.lambda, 3)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Slider Thickness */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                4. Dämmstoff-Dicke (cm)
              </label>
              <div className="text-sm font-mono font-black text-shiraz">
                {formatDeWert(thickness)} cm
              </div>
            </div>
            
            <div className="space-y-2">
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={thickness}
                onChange={(e) => setThickness(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
                <span>2 cm</span>
                <span>15 cm</span>
                <span>30 cm</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 flex items-center justify-between text-xs">
              <span className="text-slate-600">Empfehlung für GModG (vormals GEG):</span>
              <button 
                onClick={() => setThickness(recThickness)} 
                className="font-bold text-shiraz hover:underline cursor-pointer flex items-center gap-1 font-mono text-[11px]"
              >
                Auf {formatDeWert(recThickness)} cm setzen &rarr;
              </button>
            </div>
          </div>

        </div>

        {/* Calculations / Output Column (right) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Visual Layer Structure Graphic Block */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/20 shadow-sm flex flex-col justify-between h-[230px]">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Visueller Schichtenaufbau (Bauphysikmodell)
              </span>
              <p className="text-[11px] text-slate-500 leading-tight">
                Einfallender Wärmestrom q strömt von innen (warm, links) nach außen (kalt, rechts).
              </p>
            </div>

            {/* Simulated layers */}
            <div className="relative flex items-stretch h-[110px] bg-slate-100/50 rounded-xl overflow-hidden border border-slate-200">
              
              {/* Internal transition label */}
              <div className="absolute left-1 top-1 bg-slate-800/10 dark:bg-slate-900 text-slate-700 text-[8px] font-mono font-bold px-1 rounded uppercase tracking-wider">
                R_si
              </div>

              {/* Layer 1: Existing Brick/Concrete */}
              {existing.id !== 'none' && (
                <div 
                  className="flex flex-col items-center justify-center border-r border-dashed border-slate-400 px-2 transition-all duration-300"
                  style={{ 
                    width: `${Math.max(20, Math.min(50, existing.thickness * 100))}%`, 
                    backgroundColor: existing.id.includes('brick') ? '#fbe5e9' : '#fbe5e9',
                    borderRight: '2px solid rgba(185, 28, 28, 0.2)'
                  }}
                >
                  <span className="text-[10px] font-black text-red-900 text-center leading-tight truncate px-1">{existing.name}</span>
                  <span className="text-[9px] font-mono text-red-800 mt-0.5">{formatDeWert((existing.thickness * 100))} cm</span>
                </div>
              )}

              {/* Layer 2: Selected Insulation */}
              <div 
                className="flex flex-col items-center justify-center px-4 transition-all duration-300 flex-1 relative"
                style={{ 
                  backgroundColor: material.color,
                  borderRight: '3px solid rgba(12, 74, 96, 0.15)'
                }}
              >
                {/* Visual insulation pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />
                <span className="text-xs font-black text-slate-900 text-center leading-tight relative">{material.name} ({material.abbreviation})</span>
                <span className="text-[9.5px] font-mono font-bold text-slate-800 mt-1 relative bg-white/65 px-1 py-0.5 rounded shadow-sm">{formatDeWert(thickness)} cm</span>
              </div>

              {/* External transition label */}
              <div className="absolute right-1 top-1 bg-slate-800/10 text-slate-700 text-[8px] font-mono font-bold px-1 rounded uppercase tracking-wider">
                R_se
              </div>

              {/* Interactive Heat arrow */}
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-center pointer-events-none h-6">
                <div className="w-4/5 flex items-center relative gap-0.5">
                  <div className="h-2 bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-300 rounded" style={{ width: '45%', height: '8px' }} />
                  <div className="h-1 bg-gradient-to-r from-amber-500 to-blue-400 transition-all duration-300 rounded" style={{ width: '51%', height: `${Math.max(1.5, 8 * (u_value / u_existing))}px` }} />
                  <div className="border-[4px] border-l-blue-400 border-t-transparent border-b-transparent border-r-transparent ml-[-2px]" />
                </div>
              </div>

            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-bold">
              <span>R_si: {formatDeZahl(app.r_si, 2)} m²K/W (Innen)</span>
              <span>Dämmwiderstand R: {formatDeZahl(berechnung.rDaemm, 3)} m²K/W</span>
              <span>R_se: {formatDeZahl(app.r_se, 2)} m²K/W (Außen)</span>
            </div>
          </div>

          {/* Metric Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <ErgebnisAnsage text={kurzzeile(ansageWert('U-Wert', u_value, 3, 'W/(m²K)'), meetsGeg ? 'GModG erfüllt' : 'GModG unterschritten', existing.id !== 'none' && ansageWert('Heizenergie-Ersparnis etwa', energySavingsKwh, 'frei', 'kWh/(m²a)'), existing.id !== 'none' && ansageWert('CO₂-Ersparnis etwa', co2SavingsKg, 'frei', 'kg/(m²a)'))} />
            {/* U-Wert Component Result */}
            <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">U-WERT (BERECHNET)</span>
              <div className="my-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-mono font-black text-slate-900">{formatDeZahl(u_value, 3)}</span>
                <span className="text-[10px] text-slate-500 font-bold font-mono">W/(m²K)</span>
              </div>
              <div className="flex items-center gap-1">
                {meetsGeg ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <Check size={10} strokeWidth={3} /> GModG ERFÜLLT
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-800 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">
                    <AlertTriangle size={10} /> GModG UNTERSCHRITTEN
                  </span>
                )}
              </div>
            </div>

            {/* Energy Savings Estimation */}
            <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">HEIZENERGIE-ERSPARNIS</span>
              <div className="my-2">
                {existing.id === 'none' ? (
                  <span className="text-xs text-slate-400 italic font-mono block">Kein Altbestand ausgewertet</span>
                ) : (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-mono font-black text-amber-600">~{formatDeWert(energySavingsKwh)}</span>
                    <span className="text-[10px] text-slate-500 font-bold font-mono">kWh/m²a</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-normal leading-normal">
                Verringerung der Transmissionswärmeverluste pro m² Bauteilfläche (ΔU · F_x · 84 kKh/a{selectedApp === 'basement_ceiling' ? ', F_x = 0,5 gegen unbeheizten Keller, vorläufig' : ''}; ohne Anlagenaufwand).
              </span>
            </div>

            {/* CO2 Savings Potential */}
            <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CO2-REDUKTION</span>
              <div className="my-2">
                {existing.id === 'none' ? (
                  <span className="text-xs text-slate-400 italic font-mono block">Kein Altbestand</span>
                ) : (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-mono font-black text-emerald-600">~{formatDeWert(co2SavingsKg)}</span>
                    <span className="text-[10px] text-slate-500 font-bold font-mono">kg / m²a</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-normal leading-normal">
                Emissionsfaktor Erdgas 0,24 kg CO₂/kWh (Anlage 9 GModG), bezogen auf die eingesparte Wärme.
              </span>
            </div>

          </div>

          {/* Bauphysikalische Risikoanalyse - Feuchteschutz & Tauwasser */}
          <div className={`p-5 rounded-2xl border flex gap-4 ${
            hydroThermalAssessment.class === 'danger' 
              ? 'bg-red-50/50 border-red-200 text-red-900' 
              : hydroThermalAssessment.class === 'warning'
              ? 'bg-amber-50/50 border-amber-200 text-amber-950'
              : hydroThermalAssessment.class === 'info'
              ? 'bg-blue-50/50 border-blue-200 text-blue-900'
              : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
          }`}>
            <div className="shrink-0 mt-0.5">
              <hydroThermalAssessment.icon className={`h-5 w-5 ${
                hydroThermalAssessment.class === 'danger'
                  ? 'text-red-700'
                  : hydroThermalAssessment.class === 'warning'
                  ? 'text-amber-700'
                  : hydroThermalAssessment.class === 'info'
                  ? 'text-blue-700'
                  : 'text-emerald-700'
              }`} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider">{hydroThermalAssessment.title}</h4>
              <p className="text-xs leading-relaxed font-normal text-slate-700">
                {hydroThermalAssessment.text}
              </p>
            </div>
          </div>

          {/* Material Warnings & Details */}
          {material.warningText && (
            <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-xl flex gap-3 text-amber-800">
              <Info className="shrink-0 h-4 w-4 mt-0.5 text-amber-700" />
              <p className="text-[11px] leading-relaxed font-normal">
                {material.warningText}
              </p>
            </div>
          )}

          {/* Dynamic Technical Advice Summary list */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3.5">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <BookmarkCheck className="text-shiraz" size={14} /> Technische Zusammenfassung der Bauteilphysik
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-700">
              <div className="flex justify-between border-b border-dashed border-slate-200 py-1 font-normal">
                <span>Wärmedurchgangswiderstand R_T:</span>
                <span className="font-mono font-bold text-slate-800">{formatDeZahl(1 / u_value, 3)} m²K/W</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 py-1 font-normal">
                <span>Dampfdiffusions-Äquivalent d_s:</span>
                <span className="font-mono font-bold text-slate-800">{formatDeZahl(((thickness / 100) * material.vaporResistance), 2)} m (s_d-Wert)</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 py-1 font-normal">
                <span>Brandklasse nach DIN 4102:</span>
                <span className="font-mono font-bold text-slate-800">{material.fireClass}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 py-1 font-normal">
                <span>Normativer Dämmstofftyp (GModG):</span>
                <span className="font-mono font-bold text-slate-800">DIN EN 13162 ff.</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal font-normal">
              *Haftungsausschluss: Die Ergebnisse dieses Kalkulators dienen Zwecken der akademischen Vorauswahl und Orientierung. Sie ersetzen keine offizielle Wärmeschutzberechnung nach DIN V 18599 durch zertifizierte Energieberater.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
