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
import inhalt from '@/content/expositionsklassen/Expositionsklassen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { LebensdauerUebernehmen } from '@/src/components/ui/LebensdauerUebernehmen';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { huellwerte, kWertAnsatz } from '@/src/calc/expositionsklassen';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';
export { NORMATIVE_EXPOSURE_CLASSES, CHEMICAL_LIMITS_XA, MOISTURE_CLASSES_AKR } from './expositionsklassen/daten';
export type { NormExposureClass } from './expositionsklassen/daten';
export { ExpositionsklassenSkizze } from './expositionsklassen/ExpositionsklassenSkizze';

// Rangfolge der Festigkeitsklassen für den Hüllwert-Vergleich: FESTIGKEITS_RANG in src/calc/expositionsklassen.ts

const REITER = [
  { id: 'grundlagen', label: inhalt.texte.t1GrundlagenKlassenkatalog, icon: BookOpen },
  { id: 'pruefungen', label: inhalt.texte.t2LaborBaustellenprüfungen, icon: Beaker },
  { id: 'rechner', label: inhalt.texte.t3InteraktiverHüllwertK, icon: Calculator },
] as const;

export default function Expositionsklassen() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'pruefungen' | 'rechner'>('grundlagen');

  // Filter-State für Grundlagen-Tabelle
  const [filterFamily, setFilterFamily] = useState<string>('ALLE');

  // Selektor-State für Interaktiven Hüllwert-Rechner
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['XC4', 'XF1']);
  const [selectedDmax, setSelectedDmax] = useState<32 | 16 | 8>(16);
  const [deltaCdev, setDeltaCdev] = useState<number>(15); // DIN EN 1992-1-1/NA: 15 mm, bei XC1 10 mm
  const [xfOhneLp, setXfOhneLp] = useState<boolean>(false); // T3-EX-1: XF2/XF3 alternativ ohne LP (DIN 1045-2, Tab. F.2.1)

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

    // Rechenkern src/calc/expositionsklassen.ts: strengste Einzelwerte der gewählten Klassen (DIN 1045-2, Tab. F.2.1/F.2.2;
    // DIN EN 1992-1-1/NA, Tab. 4.4DE); die Texte der Sonderanforderungen bleiben in content/
    const h = huellwerte(NORMATIVE_EXPOSURE_CLASSES, selectedClasses, selectedDmax, deltaCdev, xfOhneLp);
    if (!h) return null;
    const { minWzEq, highestClass, maxCement, requiresLP, minAirVal, maxCoverDur, cNom } = h;

    // Sonderanforderungen (SR-Zement, Hartstoffe, Beschichtung)
    const specialReqs: string[] = [];
    if (selectedClasses.includes('XA2') || selectedClasses.includes('XA3')) {
      specialReqs.push(inhalt.werte.beiSulfatangriff600Mg);
    }
    if (selectedClasses.includes('XA3')) {
      specialReqs.push(inhalt.werte.xa3ZusätzlichSchutzDes);
    }
    if (selectedClasses.includes('XM2')) {
      specialReqs.push(inhalt.werte.xm2OberflächenbehandlungDesBetons);
    }
    if (selectedClasses.includes('XM3')) {
      specialReqs.push(inhalt.werte.xm3HartstoffeNachDin);
    }
    if (selectedClasses.includes('XF4')) {
      specialReqs.push(inhalt.werte.xf4NurLuftporenbeton);
    }
    if (xfOhneLp && (selectedClasses.includes('XF2') || selectedClasses.includes('XF3'))) {
      specialReqs.push(selectedClasses.includes('XF4') ? inhalt.werte.xfOhneLpMitXf4 : inhalt.werte.xfOhneLpGewaehlt);
    }
    if (selectedClasses.includes('XC1') && maxCoverDur <= 10) {
      specialReqs.push(inhalt.werte.nurXc1CDev);
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
  }, [selectedClasses, selectedDmax, deltaCdev, xfOhneLp]);

  // Berechnung k-Wert-Ansatz
  // Berechnung k-Wert-Ansatz (Rechenkern): Flugasche k_f = 0,40 mit f ≤ 0,33·z; Silikastaub k_s = 1,0 nach DIN 1045-2
  // (DIN EN 206 nennt bis 2,0; in Deutschland nicht anwendbar) mit s ≤ 0,11·z; z_eq = z + k_f·f + k_s·s
  const kValueCalc = useMemo(() => {
    const k = kWertAnsatz({ zement: zementGehalt, wasser: wasserGehalt, flugasche: flugascheGehalt, silika: silikaGehalt });
    const { rawWz, maxF, effectiveF, kF, maxS, effectiveS, kS, beq, wzEq } = k;
    return { rawWz, maxF, effectiveF, kF, maxS, effectiveS, kS, beq, wzEq };
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
              <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.expositionsklassenNachDinEn} /></h2>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.normativeGrenzwerteFürUmweltbeanspruchun} /></p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-off-white text-shiraz border border-home-grau/20 rounded-lg hidden sm:inline-block"><MdText text={inhalt.texte.din104522023} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p><MdText text={inhalt.texte.dieBemessungDauerhafterBetonbauteile} /></p>
        </div>

      </div>

      <ModuleTabs label="Lehrpfad Expositionsklassen" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:mb-8">
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
              <ShieldAlert className="text-shiraz" size={20} /><MdText text={inhalt.texte.normativesSchutzkonzeptBetonUnd} /></h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Bewehrungskorrosion</span>
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.karbonatisierungXcChlorideXd} /></h4>
                <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.zementsteinSchütztStahlbewehrungDurch} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block"><MdText text={inhalt.texte.gefügezerstörungFrost} /></span>
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.frostFrostTausalzAngriff} /></h4>
                <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.gefrierendesPorenwasserExpandiertUm} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block"><MdText text={inhalt.texte.chemischerBetonangriff} /></span>
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.säurenSulfateXaAkr} /></h4>
                <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.säurenLösenCalciumhydroxidAus} /></p>
              </div>
            </div>
          </div>

          {/* Filter-Bar für Klassenkatalog */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-home-grau/20">
              <div>
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <Filter size={18} className="text-shiraz" /><MdText text={inhalt.texte.klassenkatalogDinEn206} /></h3>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.wählenSieEineExpositionsgruppen} /></p>
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
                    <th className="p-3"><MdText text={inhalt.texte.bezeichnungUmgebungsbedingungen} /></th>
                    <th className="p-3 text-center"><MdText text={inhalt.texte.maxWZEq} /></th>
                    <th className="p-3 text-center">Min.-Festigkeit</th>
                    <th className="p-3 text-center"><MdText text={inhalt.texte.zMinKgM} /></th>
                    <th className="p-3 text-center"><MdText text={inhalt.texte.cMinDurMm} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.besondereAnforderungen} /></th>
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
              <Beaker className="text-shiraz" size={18} /><MdText text={inhalt.texte.chemischeGrenzwerteNachDin} /></h3>
            <p className="text-xs text-text-main/75"><MdText text={inhalt.texte.fürDieEinstufungIn} /></p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-2.5"><MdText text={inhalt.texte.chemischerParameter} /></th>
                    <th className="p-2.5">Einheit</th>
                    <th className="p-2.5 bg-emerald-50 text-emerald-900 text-center"><MdText text={inhalt.texte.xa1Schwach} /></th>
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
              <Droplets className="text-shiraz" size={18} /><MdText text={inhalt.texte.feuchtigkeitsklassenGegenAlkaliKieselsäu} /></h3>

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
                <Beaker className="text-shiraz" size={20} /><MdText text={inhalt.texte.prüfverfahrenZurVerifikationVon} /></h3>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.forensischeNachweiseUndGenormte} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Karbonatisierung */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
                <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                  <CheckCircle2 size={16} /><MdText text={inhalt.texte.karbonatisierungstiefeMitPhenolphthalein} /></div>
                <div className="text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                  <p><MdText text={inhalt.texte.normDinEn14630} /></p>
                  <p><MdText text={inhalt.texte.prinzip1IgeEthanolische} /></p>
                  <p><MdText text={inhalt.texte.farbumschlagUnkarbonatisierterBetonText} /></p>
                  <div className="text-[11px] text-text-main bg-white p-2 rounded border border-home-grau/15">
                    <strong>Zeit-Diffusionsgesetz:</strong> <InlineMath math="d_k(t) = k_{\text{carb}} \cdot \sqrt{t}" />
                  </div>
                </div>
              </div>

              {/* 2. Frost-Tausalz-Prüfung CDF/CIF */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
                <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
                  <Snowflake size={16} /><MdText text={inhalt.texte.frostTausalzPrüfungCdf} /></div>
                <div className="text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                  <p><MdText text={inhalt.texte.normDinCenTs} /></p>
                  <p><MdText text={inhalt.texte.cdfTestPrüfungMit} /></p>
                  <p><MdText text={inhalt.texte.kriteriumXf4MittlereAbwitterung} /></p>
                  <p><MdText text={inhalt.texte.cifTestZusätzlicheMessung} /></p>
                </div>
              </div>

              {/* 3. Schnellchloridmigration RCM */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Waves size={16} /><MdText text={inhalt.texte.chloridMigrationsversuchRcmTest} /></div>
                <div className="text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                  <p><MdText text={inhalt.texte.normRichtlinieBawMerkblatt} /></p>
                  <p><MdText text={inhalt.texte.prinzipAnlegenEinerElektrischen} /></p>
                  <p><MdText text={inhalt.texte.auswertungSpaltenDesPrüfkörpers} /></p>
                  <div className="text-[11px] text-text-main bg-white p-2 rounded border border-home-grau/15 overflow-x-auto">
                    <InlineMath math="D_{RCM} = \frac{287{,}3 \cdot T \cdot L}{(U - 2) \cdot t} \left(x_d - 3{,}338 \sqrt{\frac{T \cdot L \cdot x_d}{U - 2}}\right) \cdot 10^{-12} \text{ m}^2/\text{s}" />
                  </div>
                </div>
              </div>

              {/* 4. Luftporenprüfung im Frischbeton */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Layers size={16} /><MdText text={inhalt.texte.frischbetonLuftporenprüfungDruckausgleic} /></div>
                <div className="text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                  <p><MdText text={inhalt.texte.normDinEn12350} /></p>
                  <p><MdText text={inhalt.texte.gerät8LiterLuftporentopf} /></p>
                  <p><MdText text={inhalt.texte.grenzwerteXfMindestluftgehaltJe} /></p>
                  <p><MdText text={inhalt.texte.festbetonprüfungBestimmungVonLuftporengr} /></p>
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
                <Calculator className="text-shiraz" size={20} /><MdText text={inhalt.texte.aInteraktiverExpositionsklassenSelektor} /></h3>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.wählenSieAlleFür} /></p>
            </div>

            {/* Checkboxen für alle Klassen */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.t1ExpositionsklassenAnwählenMehrfachauswa} /></span>
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
                <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.größtkornDMaxNur} /></label>
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
                <label className="text-xs font-bold text-text-main block"><MdText text={inhalt.texte.vorhaltemaßDerBetondeckungDelta} /></label>
                <div className="flex gap-2">
                  {inhalt.daten.Expositionsklassen.map(item => (
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

              <label className="flex items-start gap-2 text-xs text-text-main cursor-pointer">
                <input type="checkbox" checked={xfOhneLp} onChange={(e) => setXfOhneLp(e.target.checked)} className="mt-0.5 accent-shiraz" />
                <span><MdText text={inhalt.texte.xfOhneLpSchalter} /></span>
              </label>
            </div>

            {/* Ausgabe der Hüllwerte */}
            <ErgebnisAnsage text={calculatedEnvelopes ? kurzzeile(`Klassen ${selectedClasses.join(', ')}`, `höchste Festigkeitsklasse ${calculatedEnvelopes.highestClass}`, calculatedEnvelopes.minWzEq !== null ? ansageWert('w/z höchstens', calculatedEnvelopes.minWzEq, 2) : 'w/z keine Begrenzung', calculatedEnvelopes.requiresLP && calculatedEnvelopes.minAirVal !== null && ansageWert('Luftgehalt mindestens', calculatedEnvelopes.minAirVal, 1, '%'), ansageWert('c_nom', calculatedEnvelopes.cNom, 'frei', 'mm')) : ''} />
            {calculatedEnvelopes && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-text-main uppercase tracking-wider block"><MdText text={inhalt.texte.t2MaßgebendeHüllwerteGrenzwerte} /></span>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold"><MdText text={inhalt.texte.maxWZEq2} /></span>
                    <span className="text-lg font-mono font-black text-shiraz">
                      {calculatedEnvelopes.minWzEq !== null ? formatDeZahl(calculatedEnvelopes.minWzEq, 2) : 'keine Begr.'}
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5"><MdText text={inhalt.texte.strengsterEinzelwert} /></span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Min.-Festigkeitsklasse</span>
                    <span className="text-lg font-mono font-black text-shiraz">
                      {calculatedEnvelopes.highestClass}
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5"><MdText text={inhalt.texte.höchsteAnforderung} /></span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold"><MdText text={inhalt.texte.minZementgehaltZMin} /></span>
                    <span className="text-lg font-mono font-black text-shiraz">
                      {calculatedEnvelopes.maxCement > 0 ? `${calculatedEnvelopes.maxCement} kg/m³` : '—'}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold"><MdText text={inhalt.texte.luftporengehaltLp} /></span>
                    <span className="text-lg font-mono font-black text-cyan-800">
                      {calculatedEnvelopes.requiresLP && calculatedEnvelopes.minAirVal !== null
                        ? `≥ ${formatDeZahl(calculatedEnvelopes.minAirVal, 1)} %`
                        : inhalt.werte.nichtGefordert}
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5">Frischbetonwert</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center col-span-2 md:col-span-1">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold"><MdText text={inhalt.texte.nennmaßBetondeckung} /></span>
                    <span className="text-lg font-mono font-black text-emerald-800">
                      {formatDeWert(calculatedEnvelopes.cNom)} mm
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5">c_min = {formatDeWert(calculatedEnvelopes.maxCoverDur)} + Δc = {formatDeWert(deltaCdev)} mm</span>
                  </div>
                </div>

                {calculatedEnvelopes.specialReqs.length > 0 && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                      <AlertTriangle size={14} className="text-amber-700" /><MdText text={inhalt.texte.wichtigeBauchemischeKonstruktiveSonderan} /></div>
                    <ul className="list-disc pl-4 text-xs text-amber-900/90 space-y-0.5">
                      {calculatedEnvelopes.specialReqs.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <LebensdauerUebernehmen art="exposition"
                  aktiv={selectedClasses.some(c => /^X[CDS]/.test(c)) && Number.isFinite(calculatedEnvelopes.cNom)}
                  daten={{ quelle: 'expositionsklassen', deckM: calculatedEnvelopes.cNom, expo: selectedClasses }} />
              </div>
            )}
          </div>

          {/* TEIL B: K-WERT-RECHNER NACH DIN EN 206 / DIN 1045-2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Scale className="text-shiraz" size={20} /><MdText text={inhalt.texte.bKWertRechner} /></h3>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.berechnungDesÄquivalentenWasserzementwer} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-off-white rounded-xl border border-home-grau/20">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.zementgehaltZKgM} /></label>
                <input aria-label={inhalt.werte.zementgehaltZKgM}
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
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.wassergehaltWKgM} /></label>
                <input aria-label={inhalt.werte.wassergehaltWKgM}
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
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.flugascheFKgM} /></label>
                <input aria-label={inhalt.werte.flugascheFKgM}
                  type="number"
                  min={0}
                  max={150}
                  step={5}
                  value={flugascheGehalt}
                  onChange={(e) => setFlugascheGehalt(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-home-grau/30 font-mono text-sm"
                />
                <span className="text-[10px] text-text-main/60 block"><MdText text={inhalt.texte.k040Max} /></span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.silikastaubSKgM} /></label>
                <input aria-label={inhalt.werte.silikastaubSKgM}
                  type="number"
                  min={0}
                  max={50}
                  step={2}
                  value={silikaGehalt}
                  onChange={(e) => setSilikaGehalt(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-home-grau/30 font-mono text-sm"
                />
                <span className="text-[10px] text-text-main/60 block">k = {formatDeZahl(kValueCalc.kS, 1)}<MdText text={inhalt.texte.maxSZ0} /></span>
              </div>
            </div>

            {/* Rechenergebnisse k-Wert */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 bg-white rounded-xl border border-home-grau/30 shadow-xs">
                <span className="text-xs text-text-main/70 block"><MdText text={inhalt.texte.klassischerWasserzementwertWZ} /></span>
                <span className="text-xl font-mono font-bold text-text-main">
                  {formatDeZahl(kValueCalc.rawWz, 3)}
                </span>
                <span className="text-[10px] text-text-main/60 block mt-0.5"><MdText text={inhalt.texte.ohneZusatzstoffanrechnung} /></span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-home-grau/30 shadow-xs">
                <span className="text-xs text-text-main/70 block"><MdText text={inhalt.texte.äquivalenterBindemittelgehaltBEq} /></span>
                <span className="text-xl font-mono font-bold text-text-main">
                  {formatDeZahl(kValueCalc.beq, 1)} kg/m³
                </span>
                <span className="text-[10px] text-text-main/60 block mt-0.5">
                  z ({formatDeWert(zementGehalt)}) + 0,4·{formatDeZahl(kValueCalc.effectiveF, 0)} + {formatDeZahl(kValueCalc.kS, 1)}·{formatDeZahl(kValueCalc.effectiveS, 0)}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border-2 border-shiraz shadow-xs">
                <span className="text-xs text-shiraz font-bold block"><MdText text={inhalt.texte.äquivalenterWZEq} /></span>
                <span className="text-2xl font-mono font-black text-shiraz">
                  {formatDeZahl(kValueCalc.wzEq, 3)}
                </span>
                <ErgebnisAnsage text={kurzzeile(ansageWert('w/z', kValueCalc.rawWz, 3), ansageWert('äquivalenter w/z', kValueCalc.wzEq, 3))} />
                <span className="text-[10px] text-text-main/70 block mt-0.5">
                  {calculatedEnvelopes && calculatedEnvelopes.minWzEq !== null ? (
                    kValueCalc.wzEq <= calculatedEnvelopes.minWzEq ? (
                      <span className="text-emerald-700 font-bold"><MdText text={inhalt.texte.eingehaltenGrenzwert} />{formatDeZahl(calculatedEnvelopes.minWzEq, 2)})</span>
                    ) : (
                      <span className="text-rose-700 font-bold"><MdText text={inhalt.texte.überschrittenGrenzwert} />{formatDeZahl(calculatedEnvelopes.minWzEq, 2)})</span>
                    )
                  ) : inhalt.werte.maßgeblicherPrüfwert}
                </span>
              </div>
            </div>

            {/* Normative Herleitungsbox */}
            <FormulaDerivationBox
              title={inhalt.werte.normativeHerleitungDasK}
              zielGleichung="(w/z)_{\text{eq}} = \frac{w}{z + k_f \cdot f + k_s \cdot s}"
              normQuelle={inhalt.werte.dinEn2062021}
              schritte={inhalt.daten["Expositionsklassen.schritte"]}
            />
          </div>

        </div>
      )}
      </ModuleTabs>

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielBetondeckungEinerAußen}
        zielGleichung="c_{nom} = \max\{c_{min,b};\, c_{min,dur};\, 10\,\text{mm}\} + \Delta c_{dev}"
        normQuelle={inhalt.werte.dinEn19921}
        schritte={inhalt.daten["Expositionsklassen.schritte_2"]}
        ergebnisHinweis={inhalt.werte.cNom40Mm}
      />

      <ModulTest moduleId="expositionsklassen" />

      <ModuleFooter
        wikipedia={[
          { title: inhalt.werte.betonAbschnittDauerhaftigkeit, url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: inhalt.werte.karbonatisierungBeton, url: 'https://de.wikipedia.org/wiki/Carbonatisierung_(Beton)' },
          { title: 'Betondeckung', url: 'https://de.wikipedia.org/wiki/Betondeckung' }
        ]}
        literatur={inhalt.daten["Expositionsklassen.literatur"]}
        regelwerke={inhalt.daten["Expositionsklassen.regelwerke"]}
        formeln={
          activeTab === 'grundlagen'
            ? inhalt.daten.Expositionsklassen_2
            : []
        }
      />
    </div>
  );
}
