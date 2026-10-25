import { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import {
  Grid,
  BookOpen,
  Beaker,
  Calculator,
  ShieldAlert,
  Droplets,
  Snowflake,
  Waves,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Check,
  Scale
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { NORMATIVE_EXPOSURE_CLASSES, CHEMICAL_LIMITS_XA, MOISTURE_CLASSES_AKR } from './expositionsklassen/daten';
import { ExpositionsklassenSkizze } from './expositionsklassen/ExpositionsklassenSkizze';
export { NORMATIVE_EXPOSURE_CLASSES, CHEMICAL_LIMITS_XA, MOISTURE_CLASSES_AKR } from './expositionsklassen/daten';
export type { NormExposureClass } from './expositionsklassen/daten';
export { ExpositionsklassenSkizze } from './expositionsklassen/ExpositionsklassenSkizze';

// Rangfolge der Festigkeitsklassen für den Hüllwert-Vergleich
const STRENGTH_RANKS: Record<string, number> = {
  'C8/10': 1,
  'C12/15': 2,
  'C16/20': 3,
  'C20/25': 4,
  'C25/30': 5,
  'C30/37': 6,
  'C35/45': 7,
  'C40/50': 8,
  'C45/55': 9,
  'C50/60': 10
};

export default function Expositionsklassen() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'pruefungen' | 'rechner'>('grundlagen');

  // Filter-State für Grundlagen-Tabelle
  const [filterFamily, setFilterFamily] = useState<string>('ALLE');

  // Selektor-State für Interaktiven Hüllwert-Rechner
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['XC4', 'XF1']);
  const [selectedDmax, setSelectedDmax] = useState<32 | 16 | 8>(16);
  const [deltaCdev, setDeltaCdev] = useState<number>(15); // DIN EN 1992-1-1/NA: 15 mm, bei XC1 10 mm

  // k-Wert-Rechner States
  const [zementGehalt, setZementGehalt] = useState<number>(310);
  const [wasserGehalt, setWasserGehalt] = useState<number>(165);
  const [flugascheGehalt, setFlugascheGehalt] = useState<number>(50);
  const [silikaGehalt, setSilikaGehalt] = useState<number>(0);

  // Toggle class selection for calculator
  const toggleClassSelection = (code: string) => {
    setSelectedClasses(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  // Berechnung der maßgebenden Hüllwerte
  const calculatedEnvelopes = useMemo(() => {
    if (selectedClasses.length === 0) {
      return null;
    }

    const matched = NORMATIVE_EXPOSURE_CLASSES.filter(c => selectedClasses.includes(c.code));
    
    // Strengster (niedrigster) max (w/z)_eq
    let minWzEq: number | null = null;
    matched.forEach(c => {
      if (c.maxWzEq !== null) {
        if (minWzEq === null || c.maxWzEq < minWzEq) {
          minWzEq = c.maxWzEq;
        }
      }
    });

    // Höchste Mindestdruckfestigkeitsklasse
    let highestClass = 'C8/10';
    let highestRank = 1;
    matched.forEach(c => {
      const rank = STRENGTH_RANKS[c.minStrengthClass] || 0;
      if (rank > highestRank) {
        highestRank = rank;
        highestClass = c.minStrengthClass;
      }
    });

    // Höchster Mindestzementgehalt z_min
    let maxCement = 0;
    matched.forEach(c => {
      if (c.minCement !== null && c.minCement > maxCement) {
        maxCement = c.minCement;
      }
    });

    // Erforderlicher Mindestluftporengehalt (wenn mindestens eine Klasse LP fordert)
    const requiresLP = matched.some(c => c.requiresAirEntrainment);
    let minAirVal: number | null = null;
    if (requiresLP) {
      matched.forEach(c => {
        if (c.minAirContent) {
          const air = selectedDmax === 32 ? c.minAirContent.dmax32 :
                      selectedDmax === 16 ? c.minAirContent.dmax16 : c.minAirContent.dmax8;
          if (minAirVal === null || air > minAirVal) {
            minAirVal = air;
          }
        }
      });
    }

    // Größte Mindestbetondeckung c_min,dur
    let maxCoverDur = 10;
    matched.forEach(c => {
      if (c.minCoverDurMm !== null && c.minCoverDurMm > maxCoverDur) {
        maxCoverDur = c.minCoverDurMm;
      }
    });

    const cNom = maxCoverDur + deltaCdev;

    // Sonderanforderungen (SR-Zement, Hartstoffe, Beschichtung)
    const specialReqs: string[] = [];
    if (selectedClasses.includes('XA2') || selectedClasses.includes('XA3')) {
      specialReqs.push('Bei Sulfatangriff (> 600 mg/l SO₄²⁻ im Wasser) SR-Zement; bis 1 500 mg/l alternativ Zement-Flugasche-Gemisch.');
    }
    if (selectedClasses.includes('XA3')) {
      specialReqs.push('XA3: zusätzlich Schutz des Betons oder Gutachten (DIN 1045-2).');
    }
    if (selectedClasses.includes('XM2')) {
      specialReqs.push('XM2: Oberflächenbehandlung des Betons – sonst w/z ≤ 0,45 und C35/45.');
    }
    if (selectedClasses.includes('XM3')) {
      specialReqs.push('XM3: Hartstoffe nach DIN 1100.');
    }
    if (selectedClasses.includes('XF4')) {
      specialReqs.push('XF4: nur Luftporenbeton.');
    }
    if (selectedClasses.includes('XC1') && maxCoverDur <= 10) {
      specialReqs.push('Nur XC1: Δc_dev darf auf 10 mm verringert werden.');
    }

    return {
      minWzEq,
      highestClass,
      maxCement,
      requiresLP,
      minAirVal,
      maxCoverDur,
      cNom,
      specialReqs
    };
  }, [selectedClasses, selectedDmax, deltaCdev]);

  // Berechnung k-Wert-Ansatz
  const kValueCalc = useMemo(() => {
    // Flugasche: k = 0,40 bei CEM I; max f/z = 0,33
    const maxF = zementGehalt * 0.33;
    const effectiveF = Math.min(flugascheGehalt, maxF);
    const kF = 0.40;

    // Silikastaub: k = 1,0 nach DIN 1045-2 (DIN EN 206 nennt bis 2,0; in Deutschland nicht anwendbar); max s/z = 0,11
    const rawWz = zementGehalt > 0 ? wasserGehalt / zementGehalt : 0;
    const kS = 1.0;
    const maxS = zementGehalt * 0.11;
    const effectiveS = Math.min(silikaGehalt, maxS);

    // Äquivalenter Bindemittelgehalt
    const beq = zementGehalt + kF * effectiveF + kS * effectiveS;
    const wzEq = beq > 0 ? wasserGehalt / beq : 0;

    // Mindestzementgehalt-Check (in D nach DIN 1045-2: bei Anrechnung von Flugasche darf Zementgehalt z_min um max. kf * f abgesenkt werden, aber i.d.R. mind. 240 bzw. 270 kg/m³)
    return {
      rawWz,
      maxF,
      effectiveF,
      kF,
      maxS,
      effectiveS,
      kS,
      beq,
      wzEq
    };
  }, [zementGehalt, wasserGehalt, flugascheGehalt, silikaGehalt]);

  return (
    <div className="flex flex-col gap-8">
      {/* 1. HEADER & INTRO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between pb-4 border-b border-home-grau/20 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
              <Grid size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">
                Expositionsklassen nach DIN EN 206 / DIN 1045-2
              </h2>
              <p className="text-xs text-text-main/70">
                Normative Grenzwerte für Umweltbeanspruchung, Zementgehalte, w/z-Werte, Luftporen und Betondeckung
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-off-white text-shiraz border border-home-grau/20 rounded-lg hidden sm:inline-block">
            DIN 1045-2:2023-08 (Tab. F.2.1/F.2.2)
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p>
            Die Bemessung dauerhafter Betonbauteile basiert nach <strong>DIN EN 206</strong> und den nationalen Anwendungsregeln der <strong>DIN 1045-2</strong> auf 
            der Zuordnung aller planmäßig auftretenden Umwelteinflüsse zu standardisierten <strong>Expositionsklassen</strong> (X0, XC, XD, XS, XF, XA, XM) sowie{' '}
            <strong>Feuchtigkeitsklassen</strong> (WO, WF, WA, WS nach Alkali-Richtlinie). Jede Klasse definiert verbindliche Mindestanforderungen an den maximalen 
            äquivalenten Wasserzementwert <InlineMath math="(w/z)_{\text{eq}}" />, die Mindestdruckfestigkeitsklasse, den Mindestzementgehalt <InlineMath math="z_{\min}" /> und 
            die erforderliche Betondeckung nach Eurocode 2.
          </p>
        </div>

        {/* TAB-NAVIGATION (4-Stufen-Lehrpfad) */}
        <div className="flex flex-wrap gap-2 pt-5 border-t border-home-grau/20 mt-4">
          <button aria-pressed={activeTab === 'grundlagen'}
            onClick={() => setActiveTab('grundlagen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'grundlagen'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <BookOpen size={16} /> 1. Grundlagen &amp; Klassenkatalog
          </button>
          <button aria-pressed={activeTab === 'pruefungen'}
            onClick={() => setActiveTab('pruefungen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'pruefungen'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Beaker size={16} /> 2. Labor- &amp; Baustellenprüfungen
          </button>
          <button aria-pressed={activeTab === 'rechner'}
            onClick={() => setActiveTab('rechner')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'rechner'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Calculator size={16} /> 3. Interaktiver Hüllwert- &amp; k-Wert-Rechner
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: GRUNDLAGEN & NORMATIVER KLASSENKATALOG                          */}
      {/* ===================================================================== */}
      {activeTab === 'grundlagen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Interaktive grafische Bauteil- & Expositionszonierung */}
          <ExpositionsklassenSkizze
            selectedClasses={selectedClasses}
            onApplyClasses={(cls) => {
              setSelectedClasses(cls);
            }}
            onToggleClass={toggleClassSelection}
          />

          {/* Einordnung und Schädigungsmechanismen */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <ShieldAlert className="text-shiraz" size={20} />
              Normatives Schutzkonzept: Beton- und Bewehrungsschutz
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Bewehrungskorrosion</span>
                <h4 className="font-bold text-sm text-text-main">Karbonatisierung (XC) &amp; Chloride (XD / XS)</h4>
                <p className="text-xs text-text-main/75 leading-relaxed">
                  Zementstein schützt Stahlbewehrung durch hochalkalisches Porenwasser (<InlineMath math="\text{pH} \approx 12{,}5 - 13{,}5" />) 
                  passivierend. Dringt <InlineMath math="\text{CO}_2" /> ein, sinkt der pH-Wert unter 9 (Depassivierung). Chloride zerstören 
                  den Passivfilm punktuell (Lochfraßkorrosion ohne vorherige pH-Wert-Absenkung).
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block">Gefügezerstörung Frost</span>
                <h4 className="font-bold text-sm text-text-main">Frost- &amp; Frost-Tausalz-Angriff (XF)</h4>
                <p className="text-xs text-text-main/75 leading-relaxed">
                  Gefrierendes Porenwasser expandiert um ca. 9 Vol.-%. Bei hoher Wassersättigung (<InlineMath math="S_r > 91\,\%" />) 
                  entsteht hydrostatischer Sprengdruck. Tausalze verschärfen den Angriff drastisch durch osmotischen Druck und Kälteschock 
                  (oberflächliche Skalierung / Abplatzungen).
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Chemischer Betonangriff</span>
                <h4 className="font-bold text-sm text-text-main">Säuren, Sulfate (XA) &amp; AKR (WO–WS)</h4>
                <p className="text-xs text-text-main/75 leading-relaxed">
                  Säuren lösen Calciumhydroxid aus dem Gefüge auf. Sulfate reagieren mit Aluminationen zu Ettringit oder Thaumasit unter 
                  massiver Volumenzunahme (Sulfattreiben). Alkaliempfindliche Kieselsäure bildet mit Porenalkalien quellfähiges Gel (AKR).
                </p>
              </div>
            </div>
          </div>

          {/* Filter-Bar für Klassenkatalog */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-home-grau/20">
              <div>
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <Filter size={18} className="text-shiraz" />
                  Klassenkatalog DIN EN 206 / DIN 1045-2 (Tabelle F.2.1 &amp; F.2.2)
                </h3>
                <p className="text-xs text-text-main/70">Wählen Sie eine Expositionsgruppen-Kategorie zur Detailansicht:</p>
              </div>

              <div className="flex flex-wrap gap-1 p-1 bg-off-white rounded-xl border border-home-grau/20 text-xs">
                {['ALLE', 'XC', 'XD', 'XS', 'XF', 'XA', 'XM', 'X0'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterFamily(f)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      filterFamily === f
                        ? 'bg-shiraz text-white shadow-xs'
                        : 'text-text-main/70 hover:text-text-main hover:bg-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix-Tabelle */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-3">Klasse</th>
                    <th className="p-3">Bezeichnung &amp; Umgebungsbedingungen</th>
                    <th className="p-3 text-center">max. (w/z)eq</th>
                    <th className="p-3 text-center">Min.-Festigkeit</th>
                    <th className="p-3 text-center">z_min (kg/m³)</th>
                    <th className="p-3 text-center">c_min,dur (mm)</th>
                    <th className="p-3">Besondere Anforderungen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/15">
                  {NORMATIVE_EXPOSURE_CLASSES
                    .filter(c => filterFamily === 'ALLE' || c.family === filterFamily)
                    .map(c => (
                      <tr key={c.code} className="hover:bg-off-white/60 transition-colors">
                        <td className="p-3 font-mono font-bold text-shiraz text-sm whitespace-nowrap">
                          {c.code}
                        </td>
                        <td className="p-3 space-y-0.5 max-w-xs sm:max-w-md">
                          <div className="font-bold text-text-main">{c.title}</div>
                          <div className="text-[11px] text-text-main/70 leading-relaxed">{c.description}</div>
                          <div className="text-[10px] text-text-main/60 italic">Bsp.: {c.examples}</div>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-text-main whitespace-nowrap">
                          {c.maxWzEq !== null ? formatDeZahl(c.maxWzEq, 2) : '—'}
                        </td>
                        <td className="p-3 text-center font-mono font-semibold text-text-main whitespace-nowrap">
                          {c.minStrengthClass}
                        </td>
                        <td className="p-3 text-center font-mono text-text-main/80 whitespace-nowrap">
                          {c.minCement !== null ? formatDeWert(c.minCement) : '—'}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-shiraz whitespace-nowrap">
                          {c.minCoverDurMm !== null ? `${formatDeWert(c.minCoverDurMm)} mm` : '—'}
                        </td>
                        <td className="p-3 text-[11px] text-text-main/80">
                          {c.requiresAirEntrainment && (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold mr-1 mb-1">
                              LP-Beton: &ge; {formatDeWert(c.minAirContent?.dmax16)}% (16 mm)
                            </span>
                          )}
                          {c.specialNotes || 'Standard-Betonzusammensetzung'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chemische Grenzwerte für XA */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <Beaker className="text-shiraz" size={18} />
              Chemische Grenzwerte nach DIN EN 206:2021-06 Tabelle 2 (Klassen XA1, XA2, XA3)
            </h3>
            <p className="text-xs text-text-main/75">
              Für die Einstufung in XA1 bis XA3 ist der jeweils strengste Einzelwert aller untersuchten Wasser- bzw. Bodenparameter maßgebend:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-2.5">Chemischer Parameter</th>
                    <th className="p-2.5">Einheit</th>
                    <th className="p-2.5 bg-emerald-50 text-emerald-900 text-center">XA1 (schwach)</th>
                    <th className="p-2.5 bg-amber-50 text-amber-900 text-center">XA2 (mäßig)</th>
                    <th className="p-2.5 bg-rose-50 text-rose-900 text-center">XA3 (stark)</th>
                    <th className="p-2.5">Prüfverfahren</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/15">
                  {CHEMICAL_LIMITS_XA.map((item, idx) => (
                    <tr key={idx} className="hover:bg-off-white/40">
                      <td className="p-2.5 font-medium text-text-main">{item.stoff}</td>
                      <td className="p-2.5 font-mono text-text-main/70">{item.einheit}</td>
                      <td className="p-2.5 text-center font-mono bg-emerald-50/40 text-emerald-900">{item.xa1}</td>
                      <td className="p-2.5 text-center font-mono bg-amber-50/40 text-amber-900 font-semibold">{item.xa2}</td>
                      <td className="p-2.5 text-center font-mono bg-rose-50/40 text-rose-900 font-bold">{item.xa3}</td>
                      <td className="p-2.5 text-[11px] text-text-main/60 font-mono">{item.pruefnorm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feuchtigkeitsklassen für AKR */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <Droplets className="text-shiraz" size={18} />
              Feuchtigkeitsklassen gegen Alkali-Kieselsäure-Reaktion (AKR) nach DIN 1045-2 Anhang D
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOISTURE_CLASSES_AKR.map(m => (
                <div key={m.code} className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded bg-white border border-home-grau/20 text-shiraz">
                      {m.code} – {m.title}
                    </span>
                    <span className="text-[10px] text-text-main/60 font-mono">Alkali-Richtlinie</span>
                  </div>
                  <p className="text-xs text-text-main/80 leading-relaxed">{m.description}</p>
                  <p className="text-[11px] text-text-main/60 italic">Typisch: {m.examples}</p>
                  <div className="text-[11px] font-semibold text-text-main pt-1.5 border-t border-home-grau/15">
                    Anforderung: <span className="text-shiraz">{m.anforderung}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: LABOR- & BAUSTELLENPRÜFUNGEN                                   */}
      {/* ===================================================================== */}
      {activeTab === 'pruefungen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div className="border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Beaker className="text-shiraz" size={20} />
                Prüfverfahren zur Verifikation von Dauerhaftigkeit &amp; Expositionskonformität
              </h3>
              <p className="text-xs text-text-main/70 mt-1">
                Forensische Nachweise und genormte Prüfungen für Karbonatisierung, Frost, Chloride und Abrieb:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Karbonatisierung */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
                <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                  <CheckCircle2 size={16} /> Karbonatisierungstiefe mit Phenolphthalein
                </div>
                <div className="text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                  <p><strong>Norm:</strong> DIN EN 14630 (Bestimmung der Karbonatisierungstiefe an frischen Bruchflächen)</p>
                  <p><strong>Prinzip:</strong> 1%ige ethanolische Phenolphthaleinlösung wird auf die frisch gebrochene Betonfläche gesprüht.</p>
                  <p><strong>Farbumschlag:</strong> Unkarbonatisierter Beton (<InlineMath math="\text{pH} > 9{,}0" />) verfärbt sich kräftig violett/magenta; karbonatisierter Beton bleibt farblos.</p>
                  <div className="text-[11px] text-text-main bg-white p-2 rounded border border-home-grau/15">
                    <strong>Zeit-Diffusionsgesetz:</strong> <InlineMath math="d_k(t) = k_{\text{carb}} \cdot \sqrt{t}" />
                  </div>
                </div>
              </div>

              {/* 2. Frost-Tausalz-Prüfung CDF/CIF */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
                <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
                  <Snowflake size={16} /> Frost-Tausalz-Prüfung (CDF / CIF-Verfahren)
                </div>
                <div className="text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                  <p><strong>Norm:</strong> DIN CEN/TS 12390-9 / BAW-Merkblatt Frostprüfung</p>
                  <p><strong>CDF-Test:</strong> Prüfung mit 3%iger NaCl-Lösung und 28 Frost-Tau-Wechseln (-20 °C bis +20 °C).</p>
                  <p><strong>Kriterium XF4:</strong> Mittlere Abwitterung <InlineMath math="m_{28} \le 1.500\text{ g/m}^2" /> (für ZTV-ING oft <InlineMath math="\le 1.000\text{ g/m}^2" />).</p>
                  <p><strong>CIF-Test:</strong> Zusätzliche Messung des relativen dynamischen E-Moduls (RDM) zur Detektion innerer Gefügeschädigung (<InlineMath math="RDM \ge 75\,\%" />).</p>
                </div>
              </div>

              {/* 3. Schnellchloridmigration RCM */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Waves size={16} /> Chlorid-Migrationsversuch (RCM-Test)
                </div>
                <div className="text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                  <p><strong>Norm / Richtlinie:</strong> BAW-Merkblatt MDCC / NT BUILD 492</p>
                  <p><strong>Prinzip:</strong> Anlegen einer elektrischen Gleichspannung (10–60 V) an einen Betonbohrkern zur Beschleunigung der Chloridionenwanderung.</p>
                  <p><strong>Auswertung:</strong> Spalten des Prüfkörpers und Besprühen mit <InlineMath math="0{,}1\text{ M } \text{AgNO}_3" />-Lösung. Weißer Silbersalz-Niederschlag markiert die Eindringfront <InlineMath math="x_d" />.</p>
                  <div className="text-[11px] text-text-main bg-white p-2 rounded border border-home-grau/15 overflow-x-auto">
                    <InlineMath math="D_{RCM} = \frac{287{,}3 \cdot T \cdot L}{(U - 2) \cdot t} \left(x_d - 3{,}338 \sqrt{\frac{T \cdot L \cdot x_d}{U - 2}}\right) \cdot 10^{-12} \text{ m}^2/\text{s}" />
                  </div>
                </div>
              </div>

              {/* 4. Luftporenprüfung im Frischbeton */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Layers size={16} /> Frischbeton-Luftporenprüfung (Druckausgleich)
                </div>
                <div className="text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                  <p><strong>Norm:</strong> DIN EN 12350-7 (Prüfung von Frischbeton – Luftgehalt – Druckverfahren)</p>
                  <p><strong>Gerät:</strong> 8-Liter-Luftporentopf mit Druckkammer und Manometer.</p>
                  <p><strong>Grenzwerte XF:</strong> Mindestluftgehalt je nach Größtkorn: 4,0 Vol.-% (<InlineMath math="d_{\max}=32\text{ mm}" />), 4,5 Vol.-% (16 mm), 5,5 Vol.-% (8 mm).</p>
                  <p><strong>Festbetonprüfung:</strong> Bestimmung von Luftporengrößenverteilung und Abstandsfaktor <InlineMath math="L \le 0{,}20\text{ mm}" /> nach DIN EN 480-11 am Dünnschliff.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: INTERAKTIVER HÜLLWERT- & K-WERT-RECHNER                         */}
      {/* ===================================================================== */}
      {activeTab === 'rechner' && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* Interaktive grafische Bauteil- & Betondeckungs-Skizze */}
          <ExpositionsklassenSkizze
            selectedClasses={selectedClasses}
            onApplyClasses={(cls) => {
              setSelectedClasses(cls);
            }}
            onToggleClass={toggleClassSelection}
          />

          {/* TEIL A: MEHRFACH-SELEKTOR & HÜLLWERTBILDUNG */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Calculator className="text-shiraz" size={20} />
                A. Interaktiver Expositionsklassen-Selektor &amp; Hüllwert-Ermittler
              </h3>
              <p className="text-xs text-text-main/70 mt-1">
                Wählen Sie alle für das Bauteil gleichzeitig zutreffenden Expositionsklassen. Das Tool ermittelt automatisch die strengsten Grenzwert-Hüllwerte nach DIN 1045-2:
              </p>
            </div>

            {/* Checkboxen für alle Klassen */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-text-main block">1. Expositionsklassen anwählen (Mehrfachauswahl):</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {NORMATIVE_EXPOSURE_CLASSES.map(c => {
                  const isSelected = selectedClasses.includes(c.code);
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => toggleClassSelection(c.code)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-shiraz text-white border-shiraz shadow-sm font-bold'
                          : 'bg-off-white text-text-main/80 border-home-grau/30 hover:border-text-main/60'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {isSelected && <Check size={14} />}
                        <span className="font-mono text-sm">{c.code}</span>
                      </div>
                      <span className="text-[10px] opacity-80 truncate max-w-full">{c.family}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Randbedingungen: dmax & Vorhaltemaß */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-off-white rounded-xl border border-home-grau/20">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main block">
                  Größtkorn <InlineMath math="d_{\max}" /> (nur für den LP-Gehalt):
                </label>
                <div className="flex gap-2">
                  {[32, 16, 8].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDmax(d as 32 | 16 | 8)}
                      className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                        selectedDmax === d
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
                      }`}
                    >
                      {formatDeWert(d)} mm
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main block">
                  Vorhaltemaß der Betondeckung <InlineMath math="\Delta c_{\text{dev}}" />:
                </label>
                <div className="flex gap-2">
                  {[
                    { val: 15, label: '15 mm (Regelfall)' },
                    { val: 10, label: '10 mm (XC1 bzw. mit Qualitätskontrolle)' }
                  ].map(item => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setDeltaCdev(item.val)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                        deltaCdev === item.val
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ausgabe der Hüllwerte */}
            {calculatedEnvelopes && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-text-main uppercase tracking-wider block">
                  2. Maßgebende Hüllwerte (Grenzwerte nach DIN 1045-2):
                </span>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold">max. (w/z)eq</span>
                    <span className="text-lg font-mono font-black text-shiraz">
                      {calculatedEnvelopes.minWzEq !== null ? formatDeZahl(calculatedEnvelopes.minWzEq, 2) : 'keine Begr.'}
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5">Strengster Einzelwert</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Min.-Festigkeitsklasse</span>
                    <span className="text-lg font-mono font-black text-shiraz">
                      {calculatedEnvelopes.highestClass}
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5">Höchste Anforderung</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Min.-Zementgehalt z_min</span>
                    <span className="text-lg font-mono font-black text-shiraz">
                      {calculatedEnvelopes.maxCement > 0 ? `${calculatedEnvelopes.maxCement} kg/m³` : '—'}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Luftporengehalt (LP)</span>
                    <span className="text-lg font-mono font-black text-cyan-800">
                      {calculatedEnvelopes.requiresLP && calculatedEnvelopes.minAirVal !== null
                        ? `≥ ${formatDeZahl(calculatedEnvelopes.minAirVal, 1)} %`
                        : 'Nicht gefordert'}
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5">Frischbetonwert</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center col-span-2 md:col-span-1">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Nennmaß Betondeckung</span>
                    <span className="text-lg font-mono font-black text-emerald-800">
                      {formatDeWert(calculatedEnvelopes.cNom)} mm
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5">c_min = {formatDeWert(calculatedEnvelopes.maxCoverDur)} + Δc = {formatDeWert(deltaCdev)} mm</span>
                  </div>
                </div>

                {calculatedEnvelopes.specialReqs.length > 0 && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                      <AlertTriangle size={14} className="text-amber-700" />
                      Wichtige bauchemische &amp; konstruktive Sonderanforderungen:
                    </div>
                    <ul className="list-disc pl-4 text-xs text-amber-900/90 space-y-0.5">
                      {calculatedEnvelopes.specialReqs.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TEIL B: K-WERT-RECHNER NACH DIN EN 206 / DIN 1045-2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Scale className="text-shiraz" size={20} />
                B. k-Wert-Rechner für Zusatzstoffe (Flugasche &amp; Silikastaub)
              </h3>
              <p className="text-xs text-text-main/70 mt-1">
                Berechnung des äquivalenten Wasserzementwerts nach der Formel: <InlineMath math="(w/z)_{\text{eq}} = \frac{w}{z + k_f \cdot f + k_s \cdot s}" />
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-off-white rounded-xl border border-home-grau/20">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main">Zementgehalt z (kg/m³):</label>
                <input aria-label="Zementgehalt z (kg/m³)"
                  type="number"
                  min={150}
                  max={550}
                  step={5}
                  value={zementGehalt}
                  onChange={(e) => setZementGehalt(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-home-grau/30 font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main">Wassergehalt w (kg/m³):</label>
                <input aria-label="Wassergehalt w (kg/m³)"
                  type="number"
                  min={100}
                  max={250}
                  step={1}
                  value={wasserGehalt}
                  onChange={(e) => setWasserGehalt(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-home-grau/30 font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main">Flugasche f (kg/m³):</label>
                <input aria-label="Flugasche f (kg/m³)"
                  type="number"
                  min={0}
                  max={150}
                  step={5}
                  value={flugascheGehalt}
                  onChange={(e) => setFlugascheGehalt(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-home-grau/30 font-mono text-sm"
                />
                <span className="text-[10px] text-text-main/60 block">k = 0,40 (max. f/z = 0,33)</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main">Silikastaub s (kg/m³):</label>
                <input aria-label="Silikastaub s (kg/m³)"
                  type="number"
                  min={0}
                  max={50}
                  step={2}
                  value={silikaGehalt}
                  onChange={(e) => setSilikaGehalt(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-home-grau/30 font-mono text-sm"
                />
                <span className="text-[10px] text-text-main/60 block">k = {formatDeZahl(kValueCalc.kS, 1)} (max. s/z = 0,11)</span>
              </div>
            </div>

            {/* Rechenergebnisse k-Wert */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 bg-white rounded-xl border border-home-grau/30 shadow-xs">
                <span className="text-xs text-text-main/70 block">Klassischer Wasserzementwert w/z:</span>
                <span className="text-xl font-mono font-bold text-text-main">
                  {formatDeZahl(kValueCalc.rawWz, 3)}
                </span>
                <span className="text-[10px] text-text-main/60 block mt-0.5">Ohne Zusatzstoffanrechnung</span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-home-grau/30 shadow-xs">
                <span className="text-xs text-text-main/70 block">Äquivalenter Bindemittelgehalt b_eq:</span>
                <span className="text-xl font-mono font-bold text-text-main">
                  {formatDeZahl(kValueCalc.beq, 1)} kg/m³
                </span>
                <span className="text-[10px] text-text-main/60 block mt-0.5">
                  z ({formatDeWert(zementGehalt)}) + 0,4·{formatDeZahl(kValueCalc.effectiveF, 0)} + {formatDeZahl(kValueCalc.kS, 1)}·{formatDeZahl(kValueCalc.effectiveS, 0)}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border-2 border-shiraz shadow-xs">
                <span className="text-xs text-shiraz font-bold block">Äquivalenter (w/z)eq:</span>
                <span className="text-2xl font-mono font-black text-shiraz">
                  {formatDeZahl(kValueCalc.wzEq, 3)}
                </span>
                <span className="text-[10px] text-text-main/70 block mt-0.5">
                  {calculatedEnvelopes && calculatedEnvelopes.minWzEq !== null ? (
                    kValueCalc.wzEq <= calculatedEnvelopes.minWzEq ? (
                      <span className="text-emerald-700 font-bold">✓ Eingehalten (Grenzwert: {formatDeZahl(calculatedEnvelopes.minWzEq, 2)})</span>
                    ) : (
                      <span className="text-rose-700 font-bold">✕ Überschritten (Grenzwert: {formatDeZahl(calculatedEnvelopes.minWzEq, 2)})</span>
                    )
                  ) : 'Maßgeblicher Prüfwert'}
                </span>
              </div>
            </div>

            {/* Normative Herleitungsbox */}
            <FormulaDerivationBox
              title="Normative Herleitung: Das k-Wert-Konzept nach DIN EN 206 & DIN 1045-2"
              zielGleichung="(w/z)_{\text{eq}} = \frac{w}{z + k_f \cdot f + k_s \cdot s}"
              normQuelle="DIN EN 206:2021-06 (Abschnitt 5.2.5.2) & DIN 1045-2:2023-08"
              schritte={[
                {
                  titel: "1. Wirkungsfaktor für Flugasche (k_f)",
                  formel: "k_f = 0{,}40, \\quad f / z \\le 0{,}33",
                  erklaerung: "Flugasche nach DIN EN 450-1 reagiert puzzolanisch mit Ca(OH)2. Bei Verwendung von CEM I darf Flugasche mit k = 0,40 angerechnet werden, jedoch nur bis zu maximal 33 % des Zementgehalts."
                },
                {
                  titel: "2. Wirkungsfaktor für Silikastaub (k_s)",
                  formel: "k_s = 1{,}0 \\text{ (für } w/z \\le 0{,}45\\text{)} \\quad \\text{bzw.} \\quad k_s = 2{,}0 \\text{ (für } w/z > 0{,}45\\text{)}, \\quad s / z \\le 0{,}11",
                  erklaerung: "Hochfeiner Silikastaub nach DIN EN 13263-1 weist eine extrem hohe puzzolanische Reaktivität auf. Die anrechenbare Menge ist auf 11 % des Zementgewichts begrenzt."
                },
                {
                  titel: "3. Mindestzementgehalt-Prüfung",
                  formel: "z \\ge z_{\\min} - k_f \\cdot f \\quad \\text{bzw.} \\quad z \\ge 240 \\text{ kg/m}^3",
                  erklaerung: "Trotz Flugascheanrechnung darf der tatsächliche Zementgehalt aus Gründen des Korrosionsschutzes und der Karbonatisierungsbremse die normativen Mindestwerte nicht unzulässig unterschreiten."
                }
              ]}
            />
          </div>

        </div>
      )}

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Betondeckung einer Außenwand (XC4 + XF1)"
        zielGleichung="c_{nom} = \max\{c_{min,b};\, c_{min,dur};\, 10\,\text{mm}\} + \Delta c_{dev}"
        normQuelle="DIN EN 1992-1-1 mit NA:2013-04, Tab. 4.4DE"
        schritte={[
          { titel: '1. Gegeben', formel: '\\text{XC4 + XF1},\\; \\varnothing = 12\\,\\text{mm}', erklaerung: 'XF1 stellt keine eigene Anforderung an die Betondeckung.' },
          { titel: '2. Mindestbetondeckung', formel: 'c_{min} = \\max\\{12;\\, 25;\\, 10\\} = 25\\,\\text{mm}', erklaerung: 'c_min,b = Stabdurchmesser; c_min,dur für XC4 = 25 mm.' },
          { titel: '3. Nennmaß', formel: 'c_{nom} = 25 + 15 = 40\\,\\text{mm}', erklaerung: 'Vorhaltemaß Δc_dev = 15 mm (Regelfall).' },
          { titel: '4. Beton', formel: '(w/z)_{eq} \\le 0{,}60;\\; \\ge \\text{C25/30};\\; z \\ge 280\\,\\text{kg/m}^3', erklaerung: 'XC4 und XF1 fordern dieselben Grenzwerte.' },
        ]}
        ergebnisHinweis="c_nom = 40 mm; Beton mindestens C25/30 mit (w/z)eq ≤ 0,60 und z ≥ 280 kg/m³."
      />

      <ModulTest moduleId="expositionsklassen" />

      <ModuleFooter
        wikipedia={[
          { title: 'Beton (Abschnitt Dauerhaftigkeit)', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Karbonatisierung (Beton)', url: 'https://de.wikipedia.org/wiki/Karbonatisierung_(Beton)' },
          { title: 'Betondeckung', url: 'https://de.wikipedia.org/wiki/Betondeckung' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Grübl, P.; Weigler, H.; Karl, S.: Beton – Arten, Herstellung und Eigenschaften. Berlin: Ernst & Sohn 2001',
          'DAfStb-Heft 600: Erläuterungen zu DIN EN 1992-1-1 und DIN EN 1992-1-1/NA (Eurocode 2), 2. überarbeitete Auflage 2020',
          'DBV-Merkblatt Betondeckung und Bewehrung nach Eurocode 2 (Fassung Dezember 2015)'
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 (Beton – Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Spannbeton – Teil 2: Beton; Anwendungsregeln zu DIN EN 206)' },
          { title: 'DIN EN 1992-1-1:2011-01 + NA:2013-04 (Eurocode 2); Neuausgabe DIN EN 1992-1-1:2025-09 – Übergangsregeln beachten' },
          { title: 'DAfStb Alkali-Richtlinie (Ausgabe 2013-10)' }
        ]}
        formeln={
          activeTab === 'grundlagen'
            ? [
                {
                  formel: '(w/z)_{\\text{eq}} = \\frac{w}{z + k_f \\cdot f + k_s \\cdot s}',
                  erklaerung: 'Äquivalenter w/z-Wert mit Anrechnung von Flugasche (k_f = 0,4; f/z ≤ 0,33) und Silikastaub (k_s = 1,0; s/z ≤ 0,11) nach DIN 1045-2.',
                  quelle: 'DIN EN 206'
                },
                {
                  formel: 'c_{\\text{nom}} = c_{\\text{min}} + \\Delta c_{\\text{dev}} = \\max\\{c_{\\text{min},b}; c_{\\text{min},\\text{dur}}; 10\\text{ mm}\\} + \\Delta c_{\\text{dev}}',
                  erklaerung: 'Nennmaß der Betondeckung nach Eurocode 2 (DIN EN 1992-1-1) aus Mindestbetondeckung zur Verbundsicherung, Dauerhaftigkeitsmindestmaß c_min,dur und dem Vorhaltemaß Delta c_dev.',
                  quelle: 'DIN EN 1992-1-1'
                }
              ]
            : []
        }
      />
    </div>
  );
}
