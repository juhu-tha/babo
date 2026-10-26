import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Droplets,
  Zap,
  BookOpen,
  Scale,
  Search,
  Building,
  Flame,
  FileText,
  Activity,
  Radio
} from 'lucide-react';
import inhalt from '@/content/spannbeton/SpannbetonDauerhaftigkeit.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

const REITER = [
  { id: 'uebersicht', label: inhalt.texte.t1SpannungsrisskorrosionGefahren, icon: ShieldAlert },
  { id: 'betondeckung', label: inhalt.texte.t2BetondeckungRechnerC, icon: Scale },
  { id: 'injektion', label: inhalt.texte.t3EinpressmörtelDinEn, icon: Droplets },
  { id: 'risse_dekompression', label: inhalt.texte.t4DekompressionRissbreiten, icon: Layers },
  { id: 'zfp', label: inhalt.texte.t5ZfpPrüfverfahrenUltraschall, icon: Search },
  { id: 'schadensfaelle', label: inhalt.texte.t6HistorischeHavarienLehren, icon: Flame },
] as const;

export default function SpannbetonDauerhaftigkeit() {
  // Configurator state
  const [structureType, setStructureType] = useState<'hochbau' | 'bruecke'>('bruecke');
  const [prestressSystem, setPrestressSystem] = useState<'post_tensioned' | 'pre_tensioned' | 'unbonded'>('post_tensioned');
  const [ductDiameter, setDuctDiameter] = useState<number>(75); // mm Hüllrohrdurchmesser
  const [strandDiameter, setStrandDiameter] = useState<number>(15.7); // mm Litze
  const [carbonationClass, setCarbonationClass] = useState<'XC1' | 'XC2' | 'XC3' | 'XC4'>('XC4');
  const [chlorideClass, setChlorideClass] = useState<'XD0' | 'XD1' | 'XD2' | 'XD3'>('XD3');
  const [frostClass, setFrostClass] = useState<'XF0' | 'XF1' | 'XF2' | 'XF3' | 'XF4'>('XF2');
  const [concreteGrade, setConcreteGrade] = useState<string>('C45/55');

  // Active sub-tab in Durability module
  const [activeTab, setActiveTab] = useState<
    'uebersicht' | 'betondeckung' | 'injektion' | 'risse_dekompression' | 'zfp' | 'schadensfaelle'
  >('uebersicht');

  // Interactive ZfP states
  const [selectedZfpTask, setSelectedZfpTask] = useState<
    'hohlraum' | 'drahtbruch' | 'korrosion' | 'geometrie' | 'monitoring'
  >('hohlraum');
  const [selectedDuctCondition, setSelectedDuctCondition] = useState<
    'voll_verpresst' | 'lufteinschluss' | 'wasserblase'
  >('lufteinschluss');

  // Calculation of cover according to DIN EN 1992-1-1 + NA & DIN EN 1992-2 (Bridge Standard)
  const coverCalculation = useMemo(() => {
    // 1. Verbundanforderung c_min,b nach DIN EN 1992-1-1 Tab. 4.2:
    let c_min_b = 0;
    if (prestressSystem === 'post_tensioned') {
      // Runde Hüllrohre: c_min,b = Durchmesser des Hüllrohrs, jedoch nicht mehr als 80 mm (EC2 Tab. 4.2)
      c_min_b = Math.min(80, ductDiameter);
    } else if (prestressSystem === 'pre_tensioned') {
      // Sofortiger Verbund: 2.0 * Litzen-/Drahtdurchmesser (3.0 * bei gerippten Drähten)
      c_min_b = Math.round(2.0 * strandDiameter);
    } else {
      // Ohne Verbund / Monolitzen: 1.5 * Außendurchmesser
      c_min_b = Math.round(1.5 * strandDiameter);
    }

    // 2. Dauerhaftigkeitsanforderung c_min,dur (Basiswerte für 50 Jahre Nutzungsdauer)
    // Grundwert für schlaffe Bewehrung:
    let baseDur = 15; // XC1
    if (carbonationClass === 'XC2' || carbonationClass === 'XC3') baseDur = 25;
    if (carbonationClass === 'XC4') baseDur = 30;

    // Chloride erhöhen die Anforderung drastisch:
    if (chlorideClass === 'XD1') baseDur = Math.max(baseDur, 35);
    if (chlorideClass === 'XD2') baseDur = Math.max(baseDur, 40);
    if (chlorideClass === 'XD3') baseDur = Math.max(baseDur, 45);

    // Zuschlag für 100 Jahre Entwurfslebensdauer bei Brücken (DIN EN 1992-2 / ZTV-ING):
    const delta_dur_100 = structureType === 'bruecke' ? 5 : 0;

    // Normativer Erhöhungszuschlag für Spannstahl nach DIN EN 1992-1-1 Abs. 4.4.1.2(5):
    // Bei Spanngliedern im Verbund: Delta c_dur,gamma = +10 mm
    const delta_dur_gamma = prestressSystem === 'unbonded' ? 0 : 10;

    // Abminderung bei hochfestem Beton (Mindestdruckfestigkeitsklassen-Vorteil nach EC2 Tab. 4.3ND)
    let delta_dur_fck = 0;
    if (concreteGrade === 'C45/55' || concreteGrade === 'C50/60') delta_dur_fck = 5;

    const c_min_dur = Math.max(10, baseDur + delta_dur_100 + delta_dur_gamma - delta_dur_fck);

    // c_min = max(c_min,b; c_min,dur; 10 mm)
    const c_min = Math.max(c_min_b, c_min_dur, 10);

    // Vorhaltemaß Delta c_dev nach NA(DE): 10 mm bei XC1 im Hochbau, sonst 15 mm
    const delta_c_dev = structureType === 'bruecke' ? 15 : (carbonationClass === 'XC1' ? 10 : 15);

    const c_nom = c_min + delta_c_dev;

    return {
      c_min_b,
      baseDur,
      delta_dur_gamma,
      delta_dur_100,
      delta_dur_fck,
      c_min_dur,
      c_min,
      delta_c_dev,
      c_nom
    };
  }, [structureType, prestressSystem, ductDiameter, strandDiameter, carbonationClass, chlorideClass, concreteGrade]);

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <ShieldCheck className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.dauerhaftigkeitKorrosionsschutzDekompres} /></h3>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.normativeAnforderungenNachDin} /></p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap"><MdText text={inhalt.texte.sicherheitskritischesTragverhalten} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed mb-6">
          <p><MdText text={inhalt.texte.imSpannbetonbauIstDer} /></p>
        </div>

      </div>

      <ModuleTabs label="Bereiche Dauerhaftigkeit" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:mb-6">
      {/* 1. REITER: SPANNUNGSRISSKORROSION & GEFAHREN */}
      {activeTab === 'uebersicht' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <ShieldAlert className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.spannungsrisskorrosionSprkWasserstoffver} /></h4>
              <span className="text-xs font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.sprödbruchOhneVorwarnung} /></span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3 text-sm text-text-main/80 leading-relaxed">
                <p><MdText text={inhalt.texte.wasUnterscheidetSpannstahlkorrosionVon} /></p>
                <p>
                  Bei Spannstahl (z. B. Y1860) reichen mikroskopisch kleine Korrosionsnarben oder der Eintritt von 
                  <strong><MdText text={inhalt.texte.atomaremWasserstoffTextH} /></strong> in das Kristallgitter aus. An Fehlstellen und Korngrenzen 
                  entstehen extrem hohe mikroskopische Spannungsspitzen, die bei Erreichen der Spaltfestigkeit zu einem 
                  <strong><MdText text={inhalt.texte.schlagartigenTrennbruch} /></strong> des Stahls führen – ohne Querschnittsverengung und ohne sichtbare Vorwarnung!
                </p>
                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-950 text-xs space-y-1"><MdText text={inhalt.texte.zweiHauptmechanismenDerSpannungsrisskorr} /><ul className="list-disc list-inside space-y-1 mt-1">
                    <li><MdText text={inhalt.texte.anodischeSpannungsrisskorrosionLokalerAn} /></li>
                    <li><MdText text={inhalt.texte.kathodischeWasserstoffversprödungFreiges} /></li>
                  </ul>
                </div>
              </div>

              {/* Gefahrenquellen & Verbote */}
              <div className="space-y-4">
                <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-2">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600" /><MdText text={inhalt.texte.strikteVerboteRegelnIm} /></h5>
                  <div className="space-y-2 text-xs text-rose-950">
                    <div className="p-2.5 bg-white rounded-lg border border-rose-200"><MdText text={inhalt.texte.t1AbsolutesSchweißverbot} /><p className="mt-0.5"><MdText text={inhalt.texte.lichtbogenFunkenOderSchweißen} /></p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-rose-200"><MdText text={inhalt.texte.t2VerbotVonFeuerverzinkung} /><p className="mt-0.5"><MdText text={inhalt.texte.zinkReagiertImAlkalischen} /></p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-rose-200"><MdText text={inhalt.texte.t3VerbotVonVergütetem} /><p className="mt-0.5"><MdText text={inhalt.texte.früherVerwendeteVergüteteStähle} /></p>
                      <p className="mt-1 text-slate-700 font-medium"><MdText text={inhalt.texte.fürBestandsbrückenMitSprk} /></p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.die3BarrierenDes} /></span>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <strong className="text-shiraz block">1. Barriere</strong><MdText text={inhalt.texte.ausreichendeDichteBetondeckungC} /></div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <strong className="text-shiraz block">2. Barriere</strong><MdText text={inhalt.texte.dichtesHüllrohrStahlKunststoff} /></div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <strong className="text-shiraz block">3. Barriere</strong><MdText text={inhalt.texte.alkalischeVerpressungPhGe} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. REITER: BETONDECKUNG NACH EC2 & INTERAKTIVER RECHNER */}
      {activeTab === 'betondeckung' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Scale className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.normativeMindestbetondeckungFürSpannglie} /></h4>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.ec2Kap44} /></span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-home-grau/25 space-y-2">
              <div className="text-xs font-mono text-text-main/70 uppercase tracking-wider font-semibold"><MdText text={inhalt.texte.normativeBemessungsformelNachDin} /></div>
              <div className="py-2.5 px-4 bg-off-white/70 rounded-xl border border-home-grau/20 text-center overflow-x-auto">
                <BlockMath math="c_{nom} = c_{min} + \Delta c_{dev} \quad \text{mit} \quad c_{min} = \max\left\{c_{min,b}; \; c_{min,dur} + \Delta c_{dur,\gamma} - \Delta c_{dur,fck}; \; 10\text{ mm}\right\}" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-text-main/80 pt-1">
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><MdText text={inhalt.texte.verbundmaßCMinB} /></div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><MdText text={inhalt.texte.dauerhaftigkeitCMinDur} /></div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><MdText text={inhalt.texte.vorhaltemaßDeltaCDev} /></div>
              </div>
            </div>

            {/* Interaktiver Betondeckungs-Konfigurator */}
            <div className="p-5 bg-off-white/80 rounded-2xl border border-home-grau/30 space-y-5">
              <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Building className="text-shiraz h-4 w-4" /><MdText text={inhalt.texte.interaktiverBetondeckungsRechnerFür} /></h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* 1. Bauwerksart */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.bauwerksartRegelwerk} /></label>
                  <select aria-label={inhalt.werte.bauwerksartRegelwerk}
                    value={structureType}
                    onChange={(e) => setStructureType(e.target.value as typeof structureType)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium"
                  >
                    <option value="bruecke">Brückenbau (DIN EN 1992-2 / ZTV-ING, 100 a)</option>
                    <option value="hochbau">Hochbau / Hallenbau (DIN EN 1992-1-1, 50 a)</option>
                  </select>
                </div>

                {/* 2. Vorspannsystem */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Vorspannsystem:</label>
                  <select aria-label="Vorspannsystem"
                    value={prestressSystem}
                    onChange={(e) => setPrestressSystem(e.target.value as typeof prestressSystem)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium"
                  >
                    <option value="post_tensioned">Nachträglicher Verbund (im Hüllrohr)</option>
                    <option value="pre_tensioned">Sofortiger Verbund (Spannbett / Litzen)</option>
                    <option value="unbonded">Ohne Verbund (Monolitzen mit PE-Hülle)</option>
                  </select>
                </div>

                {/* 3. Hüllrohr- / Litzen-Durchmesser */}
                {prestressSystem === 'post_tensioned' ? (
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">Hüllrohr-Außendurchmesser:</label>
                    <select aria-label="Hüllrohr-Außendurchmesser"
                      value={ductDiameter}
                      onChange={(e) => setDuctDiameter(Number(e.target.value))}
                      className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium font-mono"
                    >
                      <option value={55}>Ø 55 mm (z. B. 4 Litzen)</option>
                      <option value={65}>Ø 65 mm (z. B. 7 Litzen)</option>
                      <option value={75}>Ø 75 mm (z. B. 9–12 Litzen, Standard)</option>
                      <option value={85}>Ø 85 mm (z. B. 15 Litzen)</option>
                      <option value={100}>Ø 100 mm (z. B. 19 Litzen)</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">Litzendurchmesser:</label>
                    <select aria-label="Litzendurchmesser"
                      value={strandDiameter}
                      onChange={(e) => setStrandDiameter(Number(e.target.value))}
                      className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium font-mono"
                    >
                      <option value={12.5}>Ø 12,5 mm (Y1860 S7-12.5)</option>
                      <option value={15.2}>Ø 15,2 mm (Y1860 S7-15.2)</option>
                      <option value={15.7}>Ø 15,7 mm (Y1860 S7-15.7, Standard)</option>
                    </select>
                  </div>
                )}

                {/* 4. Betonklasse */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Betonklasse:</label>
                  <select aria-label="Betonklasse"
                    value={concreteGrade}
                    onChange={(e) => setConcreteGrade(e.target.value)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium font-mono"
                  >
                    <option value="C35/45">C35/45</option>
                    <option value="C40/50">C40/50</option>
                    <option value="C45/55">C45/55 (Standard Brückenbau)</option>
                    <option value="C50/60">C50/60</option>
                  </select>
                </div>
              </div>

              {/* Expositionsklassen Wähler */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1 border-t border-home-grau/15">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.karbonatisierungXc} /></label>
                  <select aria-label={inhalt.werte.karbonatisierungXc}
                    value={carbonationClass}
                    onChange={(e) => setCarbonationClass(e.target.value as typeof carbonationClass)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium"
                  >
                    <option value="XC1">XC1: Trocken / ständige Feuchte (Innen)</option>
                    <option value="XC2">XC2: Nass, selten trocken (Fundamente)</option>
                    <option value="XC3">XC3: Mäßige Feuchte (Innenräume / geschützt)</option>
                    <option value="XC4">XC4: Wechselnd nass und trocken (Außen)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.chlorideAusTaumittelnXd} /></label>
                  <select aria-label={inhalt.werte.chlorideAusTaumittelnXd}
                    value={chlorideClass}
                    onChange={(e) => setChlorideClass(e.target.value as typeof chlorideClass)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium"
                  >
                    <option value="XD0">XD0: Keine Chloride</option>
                    <option value="XD1">XD1: Mäßige Feuchte mit Chloriden</option>
                    <option value="XD2">XD2: Nass, selten trocken (Solebäder)</option>
                    <option value="XD3">XD3: Wechselnd nass &amp; trocken (Spritzbereich Brücken)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.frostTauAngriffXf} /></label>
                  <select aria-label={inhalt.werte.frostTauAngriffXf}
                    value={frostClass}
                    onChange={(e) => setFrostClass(e.target.value as typeof frostClass)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium"
                  >
                    <option value="XF0">XF0: Kein Frostangriff</option>
                    <option value="XF1">XF1: Mäßige Wassersättigung ohne Taumittel</option>
                    <option value="XF2">XF2: Mäßige Sättigung mit Taumittel (Brücken)</option>
                    <option value="XF3">XF3: Hohe Sättigung ohne Taumittel</option>
                    <option value="XF4">XF4: Hohe Sättigung mit Taumittel (Spritzwasser)</option>
                  </select>
                </div>
              </div>

              {/* Ergebnis-Dashboard */}
              <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/15 pb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500"><MdText text={inhalt.texte.berechnungsergebnisBetondeckungNachEuroc} /></span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded"><MdText text={inhalt.texte.normkonformNachDinEn} /></span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block"><MdText text={inhalt.texte.verbundmaßCMinB2} /></span>
                    <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">{formatDeWert(coverCalculation.c_min_b)} mm</span>
                    <span className="text-[10px] text-slate-500">Hüllrohr-Kriterium</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block"><MdText text={inhalt.texte.dauerhaftigkeitCMinDur2} /></span>
                    <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">{formatDeWert(coverCalculation.c_min_dur)} mm</span>
                    <span className="text-[10px] text-slate-500">inkl. +{formatDeWert(coverCalculation.delta_dur_gamma)}<MdText text={inhalt.texte.mmSpannstahlschutz} /></span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block"><MdText text={inhalt.texte.vorhaltemaßCDev} /></span>
                    <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">+{formatDeWert(coverCalculation.delta_c_dev)} mm</span>
                    <span className="text-[10px] text-slate-500">{structureType === 'bruecke' ? inhalt.werte.ztvIngBrückenbau : 'Hochbau-Toleranz'}</span>
                  </div>

                  <div className="p-3 bg-shiraz/10 rounded-xl border border-shiraz/30">
                    <span className="text-[10px] uppercase font-bold text-shiraz block"><MdText text={inhalt.texte.nennmaßCNom} /></span>
                    <span className="text-2xl font-black text-shiraz font-mono mt-0.5 block">{formatDeWert(coverCalculation.c_nom)} mm</span>
                    <span className="text-[10px] text-shiraz/80 font-bold"><MdText text={inhalt.texte.inDenPlänenVerlegemaß} /></span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-lg text-xs text-text-main/80 space-y-1"><MdText text={inhalt.texte.erklärungDesMaßgebendenWerts} /><p>
                    {coverCalculation.c_min_b >= coverCalculation.c_min_dur ? (
                      <span><MdText text={inhalt.texte.dasVerbundmaßCMin} /><strong>{formatDeWert(coverCalculation.c_min_b)} mm</strong><MdText text={inhalt.texte.istMaßgebendGegenüberDer} />{formatDeWert(coverCalculation.c_min_dur)}<MdText text={inhalt.texte.mmMitDemVorhaltemaß} />{formatDeWert(coverCalculation.delta_c_dev)}<MdText text={inhalt.texte.mmMussDasNennmaß} /><strong>{formatDeWert(coverCalculation.c_nom)} mm</strong> betragen.
                      </span>
                    ) : (
                      <span><MdText text={inhalt.texte.dieDauerhaftigkeitsanforderungCMin} /><strong>{formatDeWert(coverCalculation.c_min_dur)} mm</strong> 
                        (Basis {formatDeWert(coverCalculation.baseDur)} mm + {formatDeWert(coverCalculation.delta_dur_gamma)}<MdText text={inhalt.texte.mmSpanngliedzuschlag} />{coverCalculation.delta_dur_100 > 0 ? ` + ${formatDeWert(coverCalculation.delta_dur_100)} mm für 100a Nutzungsdauer` : ''} 
                        {coverCalculation.delta_dur_fck > 0 ? ` - ${formatDeWert(coverCalculation.delta_dur_fck)} mm Festigkeitsabzug` : ''}<MdText text={inhalt.texte.istMaßgebendDasErforderliche} /><strong>{formatDeWert(coverCalculation.c_nom)} mm</strong>.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. REITER: EINPRESSMÖRTEL & ZFP */}
      {activeTab === 'injektion' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Droplets className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.verpressungVonSpanngliedernDin} /></h4>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md">
                Zementeinpressmörtel
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 text-sm text-text-main/80 leading-relaxed">
                <p><MdText text={inhalt.texte.warumIstDieInjektion} /></p>
                <ol className="list-decimal list-inside space-y-1 text-xs pl-1">
                  <li><MdText text={inhalt.texte.mechanischerVerbundKraftübertragungZwisc} /></li>
                  <li><MdText text={inhalt.texte.dauerhafterKorrosionsschutzDasHochalkali} /></li>
                </ol>
                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-rose-950 text-xs"><MdText text={inhalt.texte.dieGefahrUnvollständigerVerpressung} /></div>
              </div>

              {/* Anforderungen nach DIN EN 447 */}
              <div className="space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700"><MdText text={inhalt.texte.qualitätskriterienNachDinEn} /></h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-shiraz block">Wasserzementwert:</strong>
                    <span className="font-mono font-bold text-sm block"><MdText text={inhalt.texte.wZ035} /></span>
                    <span className="text-[11px] text-slate-500"><MdText text={inhalt.texte.geringerWassergehaltMindertPorosität} /></span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-shiraz block"><MdText text={inhalt.texte.fließvermögenTrichterverfahrenDinEn} /></strong>
                    <span className="font-mono font-bold text-sm block"><MdText text={inhalt.texte.tT25S} /></span>
                    <span className="text-[11px] text-slate-500"><MdText text={inhalt.texte.hoheFließfähigkeitAuchNach} /></span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-shiraz block"><MdText text={inhalt.texte.wasserabsondernBluten} /></strong>
                    <span className="font-mono font-bold text-sm block"><MdText text={inhalt.texte.t03Volumen} /></span>
                    <span className="text-[11px] text-slate-500"><MdText text={inhalt.texte.nach24hKeinFreies} /></span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-shiraz block"><MdText text={inhalt.texte.volumenänderungQuellen} /></strong>
                    <span className="font-mono font-bold text-sm block"><MdText text={inhalt.texte.t15DinEn} /></span>
                    <span className="text-[11px] text-slate-500"><MdText text={inhalt.texte.leichtesQuellenKompensiertSchwinden} /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* ZfP Methoden zur Hohlraumerkennung */}
            <div className="pt-2 border-t border-home-grau/15 space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Search className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.zerstörungsfreiePrüfverfahrenZfpZur} /></h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block"><MdText text={inhalt.texte.t1ImpactEchoSchall} /></strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.mechanischerImpulsRegtResonanzschwingung} /></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block"><MdText text={inhalt.texte.t2UltraschallEchoPhased} /></strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.hochauflösendeSchnittbilderDerSpannglied} /></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block"><MdText text={inhalt.texte.t3RadiometrieRöntgen} /></strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.durchstrahlungLiefertZweifelsfreienPhoto} /></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block"><MdText text={inhalt.texte.t4VideoEndoskopie} /></strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed"><MdText text={inhalt.texte.minimalinvasiveOptischeInspektionÜber} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. REITER: DEKOMPRESSION & RISSBREITEN */}
      {activeTab === 'risse_dekompression' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Layers className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.dekompressionsnachweisRissbreitenbegrenz} /></h4>
              <span className="text-xs font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.gebrauchstauglichkeitSls} /></span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-text-main/80 leading-relaxed">
              <div className="space-y-3">
                <p>
                  <strong><MdText text={inhalt.texte.wasBedeutetDekompression} /></strong><br />
                  Der Dekompressionsnachweis verlangt, dass unter der maßgebenden Einwirkungskombination (meist der 
                  <strong><MdText text={inhalt.texte.quasiStändigenKombination} /></strong>) innerhalb eines Bereichs von <strong>25 mm</strong> um das Hüllrohr bzw. die Litze (EN-Empfehlung) keine Zugspannungen auftreten; der NA(DE) fordert stattdessen, dass der Beton um das Spannglied im Bereich von <strong><MdText text={inhalt.texte.t100MmBzwH} /></strong> (der größere Wert ist maßgebend) unter Druckspannungen steht.
                </p>
                <div className="p-3 bg-white rounded-xl border border-home-grau/30 text-center font-mono">
                  <BlockMath math="\sigma_{c,\text{Spannglied}} \le 0 \quad (\text{nur Betondruckspannung zulässig!})" />
                </div>
                <p className="text-xs"><MdText text={inhalt.texte.diesStelltSicherDass} /></p>
              </div>

              {/* Rissbreitenbegrenzung im Vergleich */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700"><MdText text={inhalt.texte.grenzwerteDerRissbreiteIm} /></h5>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-800"><MdText text={inhalt.texte.schlafferStahlbetonXc2Xc4} /></span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200"><MdText text={inhalt.texte.wMax03} /></span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-amber-900"><MdText text={inhalt.texte.spannbetonImVerbundXc2} /></span>
                    <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200"><MdText text={inhalt.texte.wMax02} /></span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="font-bold text-rose-900"><MdText text={inhalt.texte.spannbetonBeiTaumittelnXd1} /></span>
                    <span className="font-mono font-bold text-rose-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Dekompressionsnachweis!
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal"><MdText text={inhalt.texte.beiTausalzeinwirkungXdXs} /></p>
                <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200 text-[11px] text-amber-950 space-y-1 mt-2"><MdText text={inhalt.texte.verschärfungAnKoppelstellenDin} /><p><MdText text={inhalt.texte.anKoppelankernUndArbeitsfugen} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. REITER: ZFP-PRÜFVERFAHREN IM SPANNBETONBAU */}
      {activeTab === 'zfp' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/15 pb-4">
              <div>
                <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Search className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.t5ZerstörungsfreiePrüfverfahrenZfp} /></h4>
                <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.hohlraumortungInHüllrohrenSpanndrahtbruc} /></p>
              </div>
              <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap"><MdText text={inhalt.texte.dgzfpMerkblätterReiheB} /></span>
            </div>

            {/* Didaktische Einleitung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
              <div>
                <strong className="text-text-main block mb-1"><MdText text={inhalt.texte.warumStoßenStandardPrüfmethoden} /></strong>
                <p><MdText text={inhalt.texte.imNormalenStahlbetonbauKündigt} /></p>
              </div>
              <div>
                <strong className="text-text-main block mb-1"><MdText text={inhalt.texte.die3KernFragestellungen} /></strong>
                <ul className="list-disc pl-4 space-y-1">
                  <li><MdText text={inhalt.texte.woLiegtDasSpannglied} /></li>
                  <li><MdText text={inhalt.texte.istDasHüllrohrHohlraumfrei} /></li>
                  <li><MdText text={inhalt.texte.sindDrähteBereitsGerissen} /></li>
                </ul>
              </div>
            </div>

            {/* 1. INTERAKTIVER ZFP-METHODENWÄHLER NACH PRÜFAUFGABE */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-shiraz" /><MdText text={inhalt.texte.zfpMethodenKonfiguratorPrüfaufgabe} /></span>
                <span className="text-[11px] font-mono text-slate-500"><MdText text={inhalt.texte.empfehlungenNachDgzfpBast} /></span>
              </div>

              {/* 5 Aufgaben-Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {[
                  { id: 'hohlraum', label: 'Hohlraumerkennung', desc: inhalt.werte.verpressqualitätHüllrohr },
                  { id: 'drahtbruch', label: 'Drahtbruchprüfung', desc: inhalt.werte.gerisseneLitzenDrähte },
                  { id: 'korrosion', label: inhalt.werte.aktiveKorrosionsortung, desc: inhalt.werte.depassivierungChloride },
                  { id: 'geometrie', label: 'Spanngliedortung', desc: inhalt.werte.lageBetondeckung },
                  { id: 'monitoring', label: 'Dauermonitoring', desc: 'Echtzeit-Überwachung' }
                ].map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => setSelectedZfpTask(task.id as typeof selectedZfpTask)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedZfpTask === task.id
                        ? 'bg-shiraz text-white border-shiraz shadow-sm ring-2 ring-shiraz/30'
                        : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                    }`}
                  >
                    <span className="text-xs font-bold">{task.label}</span>
                    <span className={`text-[10px] mt-0.5 ${selectedZfpTask === task.id ? 'text-white/80' : 'text-slate-500'}`}>
                      {task.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* Dynamische Detail-Karte zur gewählten Prüfaufgabe */}
              {(() => {
                const zfpDetails = inhalt.daten.SpannbetonDauerhaftigkeit[selectedZfpTask];

                return (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                      <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-shiraz" />
                        {zfpDetails.title}
                      </h5>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {zfpDetails.standards}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.t1PrimäresPrüfverfahrenGoldstandard} /></strong>
                        <p className="text-shiraz font-bold">{zfpDetails.primary}</p>
                        <strong className="text-slate-900 block font-semibold pt-1"><MdText text={inhalt.texte.t2SekundäresBestätigungsverfahren} /></strong>
                        <p className="text-slate-600">{zfpDetails.secondary}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <strong className="text-slate-900 block font-semibold"><MdText text={inhalt.texte.physikalischesWirkprinzip} /></strong>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{zfpDetails.principle}</p>
                        <strong className="text-slate-900 block font-semibold pt-1"><MdText text={inhalt.texte.praktischeNachweisgrenzenStörungen} /></strong>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{zfpDetails.limits}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 2. INTERAKTIVER ULTRASCHALL-ECHO & SAFT-SIMULATOR (SVG) */}
            <div className="p-5 rounded-xl bg-white border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/15 pb-2">
                <div>
                  <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                    <Radio className="text-shiraz h-4 w-4" /><MdText text={inhalt.texte.ultraschallEchoPhasedArray} /></h5>
                  <p className="text-[11px] text-text-main/70"><MdText text={inhalt.texte.simulationDesAScan} /></p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-text-main mr-1">Verpresszustand:</span>
                  {[
                    { id: 'voll_verpresst', label: inhalt.werte.vollVerpresst },
                    { id: 'lufteinschluss', label: inhalt.werte.lufteinschlussHohlraum },
                    { id: 'wasserblase', label: inhalt.werte.wasserblaseBluten }
                  ].map((cond) => (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => setSelectedDuctCondition(cond.id as typeof selectedDuctCondition)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedDuctCondition === cond.id
                          ? 'bg-shiraz text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cond.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interaktives SVG: Bauteilquerschnitt + Ultraschall-Echo A-Scan */}
              <div className="w-full overflow-x-auto bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="min-w-[650px]">
                  <svg viewBox="0 0 700 240" className="w-full h-60">
                    <defs>
                      <marker id="arrow-axis-zfp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                      </marker>
                    </defs>

                    {/* Linke Seite: Querschnitt mit Prüfkopf und Hüllrohr */}
                    <g transform="translate(10, 10)">
                      <rect x="0" y="20" width="300" height="190" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" rx="4" />
                      <text x="10" y="38" fontSize="11" fill="#475569" fontWeight="bold">Betonbauteil (c_nom = 75 mm)</text>

                      {/* Prüfkopf oben */}
                      <rect x="110" y="5" width="80" height="15" fill="#334155" rx="3" />
                      <text x="150" y="16" fontSize="9" fill="#ffffff" textAnchor="middle" fontWeight="bold">Phased Array</text>
                      {/* Schallkegel */}
                      <polygon points="120,20 180,20 220,115 80,115" fill="rgba(153, 0, 51, 0.08)" />

                      {/* Schlaffe Bewehrung oben */}
                      <circle cx="60" cy="55" r="5" fill="#64748b" />
                      <circle cx="150" cy="55" r="5" fill="#64748b" />
                      <circle cx="240" cy="55" r="5" fill="#64748b" />
                      <line x1="20" y1="55" x2="280" y2="55" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                      <text x="250" y="52" fontSize="9" fill="#64748b">Bügel Ø 12</text>

                      {/* Hüllrohr bei y=115, R=35 mm */}
                      <circle cx="150" cy="115" r="35" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                      <text x="150" y="90" fontSize="10" fill="#475569" textAnchor="middle" fontWeight="bold">Hüllrohr Ø 85</text>

                      {/* Inhalt des Hüllrohrs je nach Zustand */}
                      {selectedDuctCondition === 'voll_verpresst' && (
                        <g>
                          <circle cx="150" cy="115" r="33" fill="#cbd5e1" />
                          {/* 12 Litzen als dunkle Kreise */}
                          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                            const rad = (angle * Math.PI) / 180;
                            const lx = 150 + 20 * Math.cos(rad);
                            const ly = 115 + 20 * Math.sin(rad);
                            return <circle key={i} cx={lx} cy={ly} r="4" fill="#1e293b" />;
                          })}
                          <circle cx="150" cy="115" r="4" fill="#1e293b" />
                          <text x="150" y="165" fontSize="10" fill="#059669" textAnchor="middle" fontWeight="bold">
                            ✓ Voll mit Zementmörtel verpresst
                          </text>
                        </g>
                      )}

                      {selectedDuctCondition === 'lufteinschluss' && (
                        <g>
                          {/* Unten etwas Mörtel */}
                          <path d="M 120 130 Q 150 135 180 130 A 33 33 0 0 1 120 130 Z" fill="#94a3b8" />
                          {/* Oben weiß = Hohlraum / Luft */}
                          <circle cx="150" cy="115" r="33" fill="#ffffff" />
                          <path d="M 117 115 A 33 33 0 0 0 183 115 Z" fill="#cbd5e1" />
                          {/* Litzen unten im Mörtel, oben freiliegend */}
                          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                            const rad = (angle * Math.PI) / 180;
                            const lx = 150 + 20 * Math.cos(rad);
                            const ly = 115 + 20 * Math.sin(rad);
                            const isExposed = ly < 115;
                            return <circle key={i} cx={lx} cy={ly} r="4" fill={isExposed ? '#dc2626' : '#1e293b'} />;
                          })}
                          <text x="150" y="105" fontSize="10" fill="#dc2626" textAnchor="middle" fontWeight="bold">
                            ⚠ LUFTEINSCHLUSS (Totalreflexion)
                          </text>
                        </g>
                      )}

                      {selectedDuctCondition === 'wasserblase' && (
                        <g>
                          <circle cx="150" cy="115" r="33" fill="#cbd5e1" />
                          {/* Oben Wasserblase blau */}
                          <path d="M 120 100 A 33 33 0 0 1 180 100 Z" fill="#93c5fd" />
                          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                            const rad = (angle * Math.PI) / 180;
                            const lx = 150 + 20 * Math.cos(rad);
                            const ly = 115 + 20 * Math.sin(rad);
                            return <circle key={i} cx={lx} cy={ly} r="4" fill="#1e293b" />;
                          })}
                          <text x="150" y="93" fontSize="9" fill="#1d4ed8" textAnchor="middle" fontWeight="bold">
                            Wasserblase (Bleeding)
                          </text>
                        </g>
                      )}

                      {/* Rückwand unten */}
                      <line x1="0" y1="210" x2="300" y2="210" stroke="#334155" strokeWidth="2" />
                      <text x="150" y="205" fontSize="9" fill="#64748b" textAnchor="middle">Bauteil-Rückwand (d = 300 mm)</text>
                    </g>

                    {/* Rechte Seite: Simulierter A-Scan (Laufzeit-Diagramm) */}
                    <g transform="translate(340, 10)">
                      <rect x="0" y="20" width="340" height="190" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" rx="4" />
                      <text x="15" y="38" fontSize="11" fill="#0f172a" fontWeight="bold">
                        Simulierter A-Scan (Reflexionsamplitude über Tiefe t)
                      </text>

                      {/* Achsen */}
                      <line x1="40" y1="180" x2="320" y2="180" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-axis-zfp)" />
                      <line x1="40" y1="180" x2="40" y2="45" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-axis-zfp)" />
                      <text x="320" y="195" fontSize="9" fill="#475569">Tiefe z [mm]</text>
                      <text x="45" y="45" fontSize="9" fill="#475569">Echo-Amplitude</text>

                      {/* Nulllinie */}
                      <line x1="40" y1="120" x2="310" y2="120" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />

                      {/* Skala Tiefe 0, 55 (Bewehrung), 80 (Hüllrohr-Oberkante), 150 (Hüllrohr-Unterkante), 300 (Rückwand) */}
                      <text x="40" y="193" fontSize="9" fill="#64748b" textAnchor="middle">0</text>
                      <text x="95" y="193" fontSize="9" fill="#64748b" textAnchor="middle">55</text>
                      <text x="140" y="193" fontSize="9" fill="#64748b" textAnchor="middle">80 (Hüllrohr)</text>
                      <text x="290" y="193" fontSize="9" fill="#64748b" textAnchor="middle">300 (Rückwand)</text>

                      {/* Signalverlauf A-Scan */}
                      {selectedDuctCondition === 'voll_verpresst' && (
                        <g>
                          {/* Kleines Echo Bewehrung bei x=95 */}
                          {/* Moderates Echo Hüllrohr bei x=140 */}
                          {/* Deutliches Rückwandecho bei x=290 */}
                          <path
                            d="M 40 120 L 70 120 L 85 110 L 95 135 L 105 120 L 130 120 L 138 95 L 148 145 L 158 120 L 270 120 L 285 60 L 295 175 L 305 120 L 315 120"
                            fill="none"
                            stroke="#059669"
                            strokeWidth="2.5"
                          />
                          <circle cx="143" cy="95" r="4" fill="#059669" />
                          <text x="145" y="85" fontSize="10" fill="#059669" fontWeight="bold">Hüllrohrecho (moderat)</text>
                          <circle cx="290" cy="60" r="4" fill="#059669" />
                          <text x="270" y="55" fontSize="10" fill="#059669" fontWeight="bold">Rückwand klar sichtbar!</text>
                        </g>
                      )}

                      {selectedDuctCondition === 'lufteinschluss' && (
                        <g>
                          {/* RIESIGES Echo bei Hüllrohr (Totalreflexion) */}
                          {/* KEIN Rückwandecho (akustischer Schatten!) */}
                          <path
                            d="M 40 120 L 70 120 L 85 115 L 95 130 L 105 120 L 130 120 L 138 48 L 148 185 L 158 65 L 168 150 L 178 120 L 315 120"
                            fill="none"
                            stroke="#dc2626"
                            strokeWidth="3"
                          />
                          <circle cx="140" cy="48" r="5" fill="#dc2626" />
                          <text x="140" y="42" fontSize="11" fill="#dc2626" fontWeight="bold">
                            Totalreflexion Luft (R ≈ -1,0)
                          </text>
                          <text x="240" y="145" fontSize="10" fill="#dc2626" fontStyle="italic">
                            Akustischer Schatten (Kein Rückwandecho!)
                          </text>
                        </g>
                      )}

                      {selectedDuctCondition === 'wasserblase' && (
                        <g>
                          <path
                            d="M 40 120 L 70 120 L 85 112 L 95 132 L 105 120 L 130 120 L 138 75 L 148 160 L 158 120 L 270 120 L 285 85 L 295 150 L 305 120 L 315 120"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2.5"
                          />
                          <circle cx="140" cy="75" r="4" fill="#2563eb" />
                          <text x="140" y="68" fontSize="10" fill="#2563eb" fontWeight="bold">
                            Phasenverschiebung Wasser
                          </text>
                          <text x="260" y="78" fontSize="10" fill="#2563eb">
                            Rückwand gedämpft
                          </text>
                        </g>
                      )}
                    </g>
                  </svg>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-lg text-xs text-text-main/80 space-y-1"><MdText text={inhalt.texte.erklärungDesAkustischenPhänomens} /><p><MdText text={inhalt.texte.trifftDieUltraschallTransversalwelle} /></p>
              </div>
            </div>

            {/* 3. GROSSE ZFP-METHODENMATRIX IM VERGLEICH */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <BookOpen className="text-shiraz h-4 w-4" /><MdText text={inhalt.texte.vergleichendeÜbersichtAller6} /></h5>
                <span className="text-[11px] text-slate-500"><MdText text={inhalt.texte.dgzfpBastLeitfaden} /></span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-text-main border-b border-home-grau/30 font-semibold">
                      <th className="p-2.5">ZfP-Verfahren</th>
                      <th className="p-2.5">Zielgröße</th>
                      <th className="p-2.5 font-mono">Messtiefe</th>
                      <th className="p-2.5">Nachweisgrenze</th>
                      <th className="p-2.5"><MdText text={inhalt.texte.einflussQuerbewehrung} /></th>
                      <th className="p-2.5"><MdText text={inhalt.texte.richtlinieNorm} /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        <Radio size={13} className="text-shiraz" /><MdText text={inhalt.texte.ultraschallPhasedArray} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.hohlräumeVerpressfehlerDicke} /></td>
                      <td className="p-2.5 font-mono">bis 100 cm</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.hohlraum15Mm} /></td>
                      <td className="p-2.5 text-amber-700"><MdText text={inhalt.texte.mäßigStreuechosMöglich} /></td>
                      <td className="p-2.5 font-mono text-[11px]">DGZfP B 04</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        <Activity size={13} className="text-shiraz" /><MdText text={inhalt.texte.magnetischerStreuflussMfl} /></td>
                      <td className="p-2.5 font-semibold text-shiraz"><MdText text={inhalt.texte.spanndrahtbrücheImHüllrohr} /></td>
                      <td className="p-2.5 font-mono">bis 15 cm</td>
                      <td className="p-2.5 font-bold text-shiraz"><MdText text={inhalt.texte.ab1Einzeldrahtbruch} /></td>
                      <td className="p-2.5 text-rose-700"><MdText text={inhalt.texte.starkBügelÜberlagernStreufluss} /></td>
                      <td className="p-2.5 font-mono text-[11px]"><MdText text={inhalt.texte.dgzfpB11Bast} /></td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        <Search size={13} className="text-shiraz" /><MdText text={inhalt.texte.impactEchoSchallresonanz} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.großflächigeFehlstellenDicke} /></td>
                      <td className="p-2.5 font-mono">bis 150 cm</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.fehlstellen50Mm} /></td>
                      <td className="p-2.5 text-emerald-700"><MdText text={inhalt.texte.sehrGeringPWellen} /></td>
                      <td className="p-2.5 font-mono text-[11px]"><MdText text={inhalt.texte.astmC1383DgzfpB} /></td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        <Layers size={13} className="text-shiraz" /><MdText text={inhalt.texte.georadarBodengekoppelt15} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.spanngliedachseBetondeckung} /></td>
                      <td className="p-2.5 font-mono">bis 50 cm</td>
                      <td className="p-2.5">Lage ± 5 mm</td>
                      <td className="p-2.5 text-amber-700"><MdText text={inhalt.texte.dichteLagenSchirmenTiefere} /></td>
                      <td className="p-2.5 font-mono text-[11px]">DGZfP B 10</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        <Zap size={13} className="text-shiraz" /><MdText text={inhalt.texte.schallemissionsanalyseAe} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.dauermonitoringDrahtrisserkennung} /></td>
                      <td className="p-2.5 font-mono"><MdText text={inhalt.texte.gesamtesFeld} /></td>
                      <td className="p-2.5 font-bold text-shiraz"><MdText text={inhalt.texte.sofortigeRissDetektion} /></td>
                      <td className="p-2.5 text-emerald-700"><MdText text={inhalt.texte.keinEinflussAufSchallleitung} /></td>
                      <td className="p-2.5 font-mono text-[11px]">DGZfP B 07</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-shiraz" /><MdText text={inhalt.texte.elektrischIsoliertesSpanngliedEit} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.hüllrohrdichtigkeitFeuchteSalz} /></td>
                      <td className="p-2.5 font-mono">Gesamtlänge</td>
                      <td className="p-2.5 text-emerald-700"><MdText text={inhalt.texte.r1MM} /></td>
                      <td className="p-2.5 text-emerald-700"><MdText text={inhalt.texte.keinEinflussVollständigEntkoppelt} /></td>
                      <td className="p-2.5 font-mono text-[11px]"><MdText text={inhalt.texte.fibBulletin3375} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. PRAXIS-LEITFADEN BESTANDSPRÜFUNG NACH BAST */}
            <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-shiraz" /><MdText text={inhalt.texte.t4StufenUntersuchungskonzeptBei} /></h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <span className="font-bold text-slate-900 block"><MdText text={inhalt.texte.stufe1Vorerkundung} /></span>
                  <p className="text-[11px] text-slate-600"><MdText text={inhalt.texte.sichtungDerBestandsstatikIdentifikation} /></p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <span className="font-bold text-slate-900 block"><MdText text={inhalt.texte.stufe2ZfpHohlraumanalyse} /></span>
                  <p className="text-[11px] text-slate-600"><MdText text={inhalt.texte.ultraschallEchoMiraUnd} /></p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <span className="font-bold text-slate-900 block"><MdText text={inhalt.texte.stufe3StreuflussEndoskopie} /></span>
                  <p className="text-[11px] text-slate-600"><MdText text={inhalt.texte.mflPrüfungBeiVerdacht} /></p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <span className="font-bold text-slate-900 block"><MdText text={inhalt.texte.stufe4NachrechnungMonitoring} /></span>
                  <p className="text-[11px] text-slate-600"><MdText text={inhalt.texte.nachweisDesAnkündigungsverhaltensRiss} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. REITER: HISTORISCHE HAVARIEN & LEHREN */}
      {activeTab === 'schadensfaelle' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Flame className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.historischeSchadensfälleFolgerungenFür} /></h4>
              <span className="text-xs font-mono font-bold bg-rose-100 text-rose-900 border border-rose-200 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.forensischeWerkstoffkunde} /></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-text-main/80">
              {/* Fall 1: Kongresshalle Berlin */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 text-sm"><MdText text={inhalt.texte.kongresshalleBerlin1980} /></strong>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">Dacheinsturz</span>
                </div>
                <p className="leading-relaxed"><MdText text={inhalt.texte.ursacheUntersuchungenNachDem} /></p>
                <div className="p-2 bg-white rounded border border-slate-200 font-semibold text-rose-950"><MdText text={inhalt.texte.konsequenzSchärfereAnforderungenAn} /></div>
              </div>

              {/* Fall 2: Carolabrücke Dresden */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 text-sm"><MdText text={inhalt.texte.carolabrückeDresden2024} /></strong>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">Trägerversagen</span>
                </div>
                <p className="leading-relaxed"><MdText text={inhalt.texte.ursacheGutachtenMkpGmbh} /></p>
                <div className="p-2 bg-white rounded border border-slate-200 font-semibold text-rose-950"><MdText text={inhalt.texte.konsequenzÜberprüfungAllerBrücken} /></div>
              </div>

              {/* Fall 3: Brücke von Ninove */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 text-sm"><MdText text={inhalt.texte.ynysYGwasBrücke} /></strong>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">Sprödbruch</span>
                </div>
                <p className="leading-relaxed"><MdText text={inhalt.texte.ursachePlötzlicherEinsturzEiner} /></p>
                <div className="p-2 bg-white rounded border border-slate-200 font-semibold text-amber-950"><MdText text={inhalt.texte.konsequenzUkMoratoriumFür} /></div>
              </div>

              {/* Fall 4: Schweißschäden */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 text-sm"><MdText text={inhalt.texte.baustellenschädenDurchSchweißfunken} /></strong>
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">Gefügefehler</span>
                </div>
                <p className="leading-relaxed"><MdText text={inhalt.texte.ursacheUnbeabsichtigtesBerührenVon} /></p>
                <div className="p-2 bg-white rounded border border-slate-200 font-semibold text-slate-900"><MdText text={inhalt.texte.konsequenzSchweißUndTrennarbeiten} /></div>
              </div>
            </div>
          </div>
        </div>
      )}
      </ModuleTabs>
    </div>
  );
}
