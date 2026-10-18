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
  Info,
  BookOpen,
  Scale,
  Search,
  Check,
  Building,
  Flame,
  FileText,
  Activity,
  Radio,
  Eye
} from 'lucide-react';

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
    let delta_dur_100 = structureType === 'bruecke' ? 5 : 0;

    // Normativer Erhöhungszuschlag für Spannstahl nach DIN EN 1992-1-1 Abs. 4.4.1.2(5):
    // Bei Spanngliedern im Verbund: Delta c_dur,gamma = +10 mm
    let delta_dur_gamma = prestressSystem === 'unbonded' ? 0 : 10;

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
              <ShieldCheck className="text-shiraz h-5 w-5" />
              Dauerhaftigkeit, Korrosionsschutz &amp; Dekompression
            </h3>
            <p className="text-xs text-text-main/70 mt-1">
              Normative Anforderungen nach DIN EN 1992-1-1 (EC2) Kap. 4 &amp; 7, DIN EN 1992-2 (Brücken), DIN EN 445/447 (Einpressmörtel)
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap">
            Sicherheitskritisches Tragverhalten
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed mb-6">
          <p>
            Im Spannbetonbau ist der Korrosionsschutz von existentieller Bedeutung: Weil der hochfeste Spannstahl unter 
            extremer Zugspannung (<InlineMath math="\sigma_{p0} \approx 1200 \dots 1500\text{ N/mm²}" />) steht, kündigt sich ein 
            Korrosionsangriff <strong>nicht</strong> durch harmlose Rostfahnen und Betonabplatzungen an. Stattdessen droht 
            <strong>Spannungsrisskorrosion (SpRK) oder Wasserstoffversprödung</strong>, die zum 
            schlagartigen, spröden Abriss des Spannglieds ohne jegliche Vorwarnung führt.
          </p>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-home-grau/20">
          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeTab === 'uebersicht'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('uebersicht')}
          >
            <ShieldAlert size={15} /> 1. Spannungsrisskorrosion &amp; Gefahren
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeTab === 'betondeckung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('betondeckung')}
          >
            <Scale size={15} /> 2. Betondeckung &amp; Rechner (c_nom)
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeTab === 'injektion'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('injektion')}
          >
            <Droplets size={15} /> 3. Einpressmörtel (DIN EN 447)
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeTab === 'risse_dekompression'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('risse_dekompression')}
          >
            <Layers size={15} /> 4. Dekompression &amp; Rissbreiten
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeTab === 'zfp'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('zfp')}
          >
            <Search size={15} /> 5. ZfP-Prüfverfahren (Ultraschall, MFL, Radar, EIT)
          </button>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
              activeTab === 'schadensfaelle'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('schadensfaelle')}
          >
            <Flame size={15} /> 6. Historische Havarien &amp; Lehren
          </button>
        </div>
      </div>

      {/* 1. REITER: SPANNUNGSRISSKORROSION & GEFAHREN */}
      {activeTab === 'uebersicht' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-3">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <ShieldAlert className="text-shiraz h-5 w-5" />
                Spannungsrisskorrosion (SpRK) &amp; Wasserstoffversprödung
              </h4>
              <span className="text-xs font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-md">
                Sprödbruch ohne Vorwarnung
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3 text-sm text-text-main/80 leading-relaxed">
                <p>
                  <strong>Was unterscheidet Spannstahlkorrosion von normalem Rost?</strong><br />
                  Bei schlaffem Betonstahl (B500B) führt Korrosion zu voluminösen Eisenoxiden (<InlineMath math="\text{Fe}_2\text{O}_3 \cdot x\text{H}_2\text{O}" />), 
                  die den Beton absprengen und sichtbare Rostfahnen bilden. Der Träger kündigt sein Versagen durch große Risse und Durchbiegungen an.
                </p>
                <p>
                  Bei Spannstahl (z. B. Y1860) reichen mikroskopisch kleine Korrosionsnarben oder der Eintritt von 
                  <strong> atomarem Wasserstoff (<InlineMath math="\text{H}^0" />)</strong> in das Kristallgitter aus. An Fehlstellen und Korngrenzen 
                  entstehen extrem hohe mikroskopische Spannungsspitzen, die bei Erreichen der Spaltfestigkeit zu einem 
                  <strong> schlagartigen Trennbruch</strong> des Stahls führen – ohne Querschnittsverengung und ohne sichtbare Vorwarnung!
                </p>
                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-950 text-xs space-y-1">
                  <strong>Zwei Hauptmechanismen der Spannungsrisskorrosion:</strong>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>
                      <strong>Anodische Spannungsrisskorrosion:</strong> Lokaler anodischer Metallabtrag in winzigen Rissen unter Anwesenheit aggressiver Ionen (insb. Chloride <InlineMath math="\text{Cl}^-" />).
                    </li>
                    <li>
                      <strong>Kathodische Wasserstoffversprödung:</strong> Freigesetzte Wasserstoff-Protonen (<InlineMath math="\text{H}^+" />) nehmen Elektronen auf und diffundieren atomar in das Gefüge. Atomarer Wasserstoff reichert sich in Zonen hoher Zugspannung (Rissspitzen, Gitterdefekte) an und setzt die Kohäsion bzw. Bruchzähigkeit herab (wasserstoffinduzierte SpRK).
                    </li>
                  </ul>
                </div>
              </div>

              {/* Gefahrenquellen & Verbote */}
              <div className="space-y-4">
                <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-2">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Strikte Verbote &amp; Regeln im Spannbetonbau
                  </h5>
                  <div className="space-y-2 text-xs text-rose-950">
                    <div className="p-2.5 bg-white rounded-lg border border-rose-200">
                      <strong>1. Absolutes Schweißverbot:</strong>
                      <p className="mt-0.5">
                        Lichtbogen-Funken oder Schweißen in der Nähe von Spanngliedern erzeugen martensitische Härtegefüge mit Mikrorissen. Spannglieder reißen an solchen Stellen sofort ab.
                      </p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-rose-200">
                      <strong>2. Verbot von Feuerverzinkung bei hochfestem Spannstahl:</strong>
                      <p className="mt-0.5">
                        Zink reagiert im alkalischen Nassbeton mit Zementleim unter starker Wasserstoffentwicklung (<InlineMath math="\text{Zn} + 2\text{OH}^- + 2\text{H}_2\text{O} \to [\text{Zn(OH)}_4]^{2-} + \text{H}_2 \uparrow" />). Dies führt zur sofortigen Wasserstoffversprödung!
                      </p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-rose-200">
                      <strong>3. Verbot von vergütetem Spannstahl &amp; Zulassungsregeln:</strong>
                      <p className="mt-0.5">
                        Früher verwendete vergütete Stähle zeigten interkristalline SpRK. Heute werden kaltgezogene Drähte und Litzen sowie warmgewalzte Stäbe mit abZ des DIBt verwendet; vergütete Spannstähle (z. B. Neptun, Sigma oval, Hennigsdorfer Spannstahl) gelten als SpRK-gefährdet.
                      </p>
                      <p className="mt-1 text-slate-700 font-medium">
                        Für Bestandsbrücken mit SpRK-gefährdetem Spannstahl: BMVI-Handlungsanweisung (Ankündigungsverhalten, Riss-vor-Bruch-Nachweis).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">Die 3 Barrieren des Korrosionsschutzes:</span>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <strong className="text-shiraz block">1. Barriere</strong>
                      Ausreichende dichte Betondeckung (<InlineMath math="c_{nom}" />)
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <strong className="text-shiraz block">2. Barriere</strong>
                      Dichtes Hüllrohr (Stahl/Kunststoff)
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <strong className="text-shiraz block">3. Barriere</strong>
                      Alkalische Verpressung (<InlineMath math="pH \ge 12.5" />)
                    </div>
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
                <Scale className="text-shiraz h-5 w-5" />
                Normative Mindestbetondeckung für Spannglieder (DIN EN 1992-1-1 / DIN EN 1992-2)
              </h4>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-md">
                EC2 Kap. 4.4 &amp; NA
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-home-grau/25 space-y-2">
              <div className="text-xs font-mono text-text-main/70 uppercase tracking-wider font-semibold">
                Normative Bemessungsformel nach DIN EN 1992-1-1 Gl. (4.1):
              </div>
              <div className="py-2.5 px-4 bg-off-white/70 rounded-xl border border-home-grau/20 text-center overflow-x-auto">
                <BlockMath math="c_{nom} = c_{min} + \Delta c_{dev} \quad \text{mit} \quad c_{min} = \max\left\{c_{min,b}; \; c_{min,dur} + \Delta c_{dur,\gamma} - \Delta c_{dur,fck}; \; 10\text{ mm}\right\}" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-text-main/80 pt-1">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <strong>Verbundmaß <InlineMath math="c_{min,b}" />:</strong> Bei runden Hüllrohren gleich dem Hüllrohrdurchmesser <InlineMath math="\phi" />, jedoch maximal 80 mm (EC2 Tab. 4.2)! Bei sofortigem Verbund 2,0·Ø (Litzen/glatte Drähte) bzw. 3,0·Ø (gerippte Drähte).
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <strong>Dauerhaftigkeit <InlineMath math="c_{min,dur}" />:</strong> Erhöhungszuschlag <InlineMath math="\Delta c_{dur,\gamma} = +10\text{ mm}" /> für Spannglieder im Verbund!
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <strong>Vorhaltemaß <InlineMath math="\Delta c_{dev}" />:</strong> Nach NA(DE) 10 mm bei XC1, sonst 15 mm (im Brückenbau nach ZTV-ING 15 mm).
                </div>
              </div>
            </div>

            {/* Interaktiver Betondeckungs-Konfigurator */}
            <div className="p-5 bg-off-white/80 rounded-2xl border border-home-grau/30 space-y-5">
              <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Building className="text-shiraz h-4 w-4" />
                Interaktiver Betondeckungs-Rechner für Spannglieder
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* 1. Bauwerksart */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Bauwerksart &amp; Regelwerk:</label>
                  <select
                    value={structureType}
                    onChange={(e) => setStructureType(e.target.value as any)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium"
                  >
                    <option value="bruecke">Brückenbau (DIN EN 1992-2 / ZTV-ING, 100 a)</option>
                    <option value="hochbau">Hochbau / Hallenbau (DIN EN 1992-1-1, 50 a)</option>
                  </select>
                </div>

                {/* 2. Vorspannsystem */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Vorspannsystem:</label>
                  <select
                    value={prestressSystem}
                    onChange={(e) => setPrestressSystem(e.target.value as any)}
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
                    <select
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
                    <select
                      value={strandDiameter}
                      onChange={(e) => setStrandDiameter(Number(e.target.value))}
                      className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium font-mono"
                    >
                      <option value={12.5}>Ø 12.5 mm (Y1860 S7-12.5)</option>
                      <option value={15.2}>Ø 15.2 mm (Y1860 S7-15.2)</option>
                      <option value={15.7}>Ø 15.7 mm (Y1860 S7-15.7, Standard)</option>
                    </select>
                  </div>
                )}

                {/* 4. Betonklasse */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Betonklasse:</label>
                  <select
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
                  <label className="font-bold text-slate-700 block">Karbonatisierung (XC):</label>
                  <select
                    value={carbonationClass}
                    onChange={(e) => setCarbonationClass(e.target.value as any)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium"
                  >
                    <option value="XC1">XC1: Trocken / ständige Feuchte (Innen)</option>
                    <option value="XC2">XC2: Nass, selten trocken (Fundamente)</option>
                    <option value="XC3">XC3: Mäßige Feuchte (Innenräume / geschützt)</option>
                    <option value="XC4">XC4: Wechselnd nass und trocken (Außen)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Chloride aus Taumitteln (XD):</label>
                  <select
                    value={chlorideClass}
                    onChange={(e) => setChlorideClass(e.target.value as any)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium"
                  >
                    <option value="XD0">XD0: Keine Chloride</option>
                    <option value="XD1">XD1: Mäßige Feuchte mit Chloriden</option>
                    <option value="XD2">XD2: Nass, selten trocken (Solebäder)</option>
                    <option value="XD3">XD3: Wechselnd nass &amp; trocken (Spritzbereich Brücken)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Frost-Tau-Angriff (XF):</label>
                  <select
                    value={frostClass}
                    onChange={(e) => setFrostClass(e.target.value as any)}
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
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    Berechnungsergebnis Betondeckung nach Eurocode 2:
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Normkonform nach DIN EN 1992-1-1 / DIN EN 1992-2
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Verbundmaß c_min,b</span>
                    <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">{coverCalculation.c_min_b} mm</span>
                    <span className="text-[10px] text-slate-500">Hüllrohr-Kriterium</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Dauerhaftigkeit c_min,dur</span>
                    <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">{coverCalculation.c_min_dur} mm</span>
                    <span className="text-[10px] text-slate-500">inkl. +{coverCalculation.delta_dur_gamma} mm Spannstahlschutz</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Vorhaltemaß Δc_dev</span>
                    <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">+{coverCalculation.delta_c_dev} mm</span>
                    <span className="text-[10px] text-slate-500">{structureType === 'bruecke' ? 'ZTV-ING Brückenbau' : 'Hochbau-Toleranz'}</span>
                  </div>

                  <div className="p-3 bg-shiraz/10 rounded-xl border border-shiraz/30">
                    <span className="text-[10px] uppercase font-bold text-shiraz block">Nennmaß c_nom</span>
                    <span className="text-2xl font-black text-shiraz font-mono mt-0.5 block">{coverCalculation.c_nom} mm</span>
                    <span className="text-[10px] text-shiraz/80 font-bold">In den Plänen anzugeben!</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-lg text-xs text-text-main/80 space-y-1">
                  <strong>Erklärung des maßgebenden Werts:</strong>
                  <p>
                    {coverCalculation.c_min_b >= coverCalculation.c_min_dur ? (
                      <span>
                        Das Verbundmaß <InlineMath math="c_{min,b} = \phi_{Hüllrohr} = " /> <strong>{coverCalculation.c_min_b} mm</strong> ist 
                        maßgebend gegenüber der Umweltanforderung (<InlineMath math="c_{min,dur} = " /> {coverCalculation.c_min_dur} mm). 
                        Mit dem Vorhaltemaß <InlineMath math="\Delta c_{dev} = " /> {coverCalculation.delta_c_dev} mm muss das Nennmaß 
                        mindestens <strong>{coverCalculation.c_nom} mm</strong> betragen.
                      </span>
                    ) : (
                      <span>
                        Die Dauerhaftigkeitsanforderung <InlineMath math="c_{min,dur} = " /> <strong>{coverCalculation.c_min_dur} mm</strong> 
                        (Basis {coverCalculation.baseDur} mm + {coverCalculation.delta_dur_gamma} mm Spanngliedzuschlag 
                        {coverCalculation.delta_dur_100 > 0 ? ` + ${coverCalculation.delta_dur_100} mm für 100a Nutzungsdauer` : ''} 
                        {coverCalculation.delta_dur_fck > 0 ? ` - ${coverCalculation.delta_dur_fck} mm Festigkeitsabzug` : ''}) ist maßgebend. 
                        Das erforderliche Nennmaß beträgt <strong>{coverCalculation.c_nom} mm</strong>.
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
                <Droplets className="text-shiraz h-5 w-5" />
                Verpressung von Spanngliedern (DIN EN 445 / 447) &amp; ZfP-Integritätsprüfung
              </h4>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md">
                Zementeinpressmörtel
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 text-sm text-text-main/80 leading-relaxed">
                <p>
                  <strong>Warum ist die Injektion so entscheidend?</strong><br />
                  Bei Spanngliedern im nachträglichen Verbund liegen die hochfesten Litzen in einem gewellten Blech- 
                  oder Kunststoffhüllrohr. Nach dem Spannen müssen die Hohlräume vollständig mit Zementeinpressmörtel verfüllt werden. 
                  Der Einpressmörtel erfüllt zwei unverzichtbare Aufgaben:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-xs pl-1">
                  <li><strong>Mechanischer Verbund:</strong> Kraftübertragung zwischen Spannglied und Betonquerschnitt.</li>
                  <li><strong>Dauerhafter Korrosionsschutz:</strong> Das hochalkalische Porenwasser (<InlineMath math="\text{pH} \ge 12.5" />) bildet eine mikroskopische Passivschicht auf dem Spannstahl.</li>
                </ol>
                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-rose-950 text-xs">
                  <strong>Die Gefahr unvollständiger Verpressung:</strong> Verbleiben im Hüllrohr Lufteinschlüsse oder bildet 
                  sich durch Wasserabsondern (Bluten) freies Wasser an Rohrhochpunkten, bricht die Passivierung zusammen. 
                  Sauerstoff und Kondenswasser führen an diesen Stellen zu extrem schneller Lochfraß- und Spannungsrisskorrosion.
                </div>
              </div>

              {/* Anforderungen nach DIN EN 447 */}
              <div className="space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Qualitätskriterien nach DIN EN 447 &amp; DIN EN 445:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-shiraz block">Wasser-Zement-Wert:</strong>
                    <span className="font-mono font-bold text-sm block">w/z ≤ 0.35 … 0.40</span>
                    <span className="text-[11px] text-slate-500">Geringer Wassergehalt mindert Porosität.</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-shiraz block">Fließzeit (Marsh-Trichter):</strong>
                    <span className="font-mono font-bold text-sm block">10 … 25 Sekunden</span>
                    <span className="text-[11px] text-slate-500">Hohe Fließfähigkeit auch nach 30 min.</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-shiraz block">Wasserabsondern (Bluten):</strong>
                    <span className="font-mono font-bold text-sm block">≤ 0.3 % Volumen</span>
                    <span className="text-[11px] text-slate-500">Nach 24h kein freies Wasser an Hochpunkten!</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-shiraz block">Volumenänderung (Quellen):</strong>
                    <span className="font-mono font-bold text-sm block">+1 % … +5 %</span>
                    <span className="text-[11px] text-slate-500">Leichtes Quellen kompensiert Schwinden.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ZfP Methoden zur Hohlraumerkennung */}
            <div className="pt-2 border-t border-home-grau/15 space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Search className="h-4 w-4 text-shiraz" />
                Zerstörungsfreie Prüfverfahren (ZfP) zur Erkennung von Verpressfehlern
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block">1. Impact-Echo (Schall)</strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Mechanischer Impuls regt Resonanzschwingungen an. Fehlstellen zeigen Frequenzverschiebungen (oft Erstindikation).
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block">2. Ultraschall-Echo (Phased Array)</strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Hochauflösende Schnittbilder der Spanngliedlage und Reflexion an Luft-Hohlräumen (Impedanzsprung).
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block">3. Radiometrie (Röntgen)</strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Durchstrahlung liefert zweifelsfreien photographischen Nachweis von Hohlräumen in Hüllrohren (aufwendig).
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block">4. Video-Endoskopie</strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Minimalinvasive optische Inspektion über angebohrte Entlüftungsventile bei Verdachtsfällen.
                  </p>
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
                <Layers className="text-shiraz h-5 w-5" />
                Dekompressionsnachweis &amp; Rissbreitenbegrenzung nach EC2 Tab. 7.1N
              </h4>
              <span className="text-xs font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-md">
                Gebrauchstauglichkeit (SLS)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-text-main/80 leading-relaxed">
              <div className="space-y-3">
                <p>
                  <strong>Was bedeutet „Dekompression“?</strong><br />
                  Der Dekompressionsnachweis verlangt, dass unter der maßgebenden Einwirkungskombination (meist der 
                  <strong> quasi-ständigen Kombination</strong>) an keinem Punkt im Abstand von mindestens 
                  <strong> 25 mm</strong> um das Hüllrohr oder die Spanngliedlitze Zugspannungen im Beton auftreten dürfen!
                </p>
                <div className="p-3 bg-white rounded-xl border border-home-grau/30 text-center font-mono">
                  <BlockMath math="\sigma_{c,\text{Spannglied}} \le 0 \quad (\text{nur Betondruckspannung zulässig!})" />
                </div>
                <p className="text-xs">
                  Dies stellt sicher, dass eventuelle Mikrorisse im Beton niemals bis an die Spannglieder heranreichen. 
                  Chloride und Feuchtigkeit können so nicht kapillar an den Spannstahl vordringen.
                </p>
              </div>

              {/* Rissbreitenbegrenzung im Vergleich */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Grenzwerte der Rissbreite im Vergleich (EC2 Tab. 7.1N):
                </h5>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-800">Schlaffer Stahlbeton (XC2–XC4):</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      w_max ≤ 0.3 … 0.4 mm
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-amber-900">Spannbeton im Verbund (XC2–XC4):</span>
                    <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      w_max ≤ 0.2 mm
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="font-bold text-rose-900">Spannbeton bei Taumitteln (XD1–XD3):</span>
                    <span className="font-mono font-bold text-rose-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Dekompressionsnachweis!
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  * Bei Einwirkung von Tausalzen (XD3 / Brückenkappen und Fahrbahnplatten) fordert die DIN EN 1992-2 
                  strikte Dekompression unter der quasi-ständigen Lastkombination.
                </p>
                <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200 text-[11px] text-amber-950 space-y-1 mt-2">
                  <strong>Verschärfung an Koppelstellen (DIN EN 1992-1-1 Abs. 8.10.4):</strong>
                  <p>
                    An Koppelankern und Arbeitsfugen muss die Dekompression (<InlineMath math="\sigma_c \le 0" />) bereits 
                    unter der <strong>häufigen Einwirkungskombination</strong> eingehalten werden (nicht erst unter quasi-ständig).
                  </p>
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
                  <Search className="text-shiraz h-5 w-5" />
                  5. Zerstörungsfreie Prüfverfahren (ZfP) im Spannbetonbau
                </h4>
                <p className="text-xs text-text-main/70 mt-1">
                  Hohlraumortung in Hüllrohren, Spanndrahtbruchdetektion (MFL), Georadar, Ultraschall-Echo (Phased Array) &amp; Dauermonitoring nach DGZfP / BASt / ZTV-ING
                </p>
              </div>
              <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap">
                DGZfP B 01–B 11 &amp; BASt-Leitfaden
              </span>
            </div>

            {/* Didaktische Einleitung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
              <div>
                <strong className="text-text-main block mb-1">Warum stoßen Standard-Prüfmethoden an ihre Grenzen?</strong>
                <p>
                  Im normalen Stahlbetonbau kündigt sich Korrosion durch Abplatzungen und Rostspuren an. 
                  Im <strong>Spannbetonbau</strong> liegen die Spannglieder in 50–150 mm Tiefe im Inneren von Hüllrohren. 
                  Spanndrahtbrüche infolge Spannungsrisskorrosion verlaufen <strong>ohne visuelle Vorwarnung</strong> 
                  an der Bauteiloberfläche. ZfP-Verfahren müssen Hüllrohrwand und dichte schlaffe Bewehrungslagen 
                  durchdringen, um Fehlstellen und Brüche zerstörungsfrei aufzudecken.
                </p>
              </div>
              <div>
                <strong className="text-text-main block mb-1">Die 3 Kern-Fragestellungen der Bauwerksdiagnostik:</strong>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Wo liegt das Spannglied exakt?</strong> (Georadar &amp; elektromagnetische Ortung vor Bohrarbeiten).</li>
                  <li><strong>Ist das Hüllrohr hohlraumfrei verpresst?</strong> (Ultraschall-Echo &amp; Impact-Echo).</li>
                  <li><strong>Sind Drähte bereits gerissen oder korrodiert?</strong> (Magnetischer Streufluss MFL &amp; Schallemission).</li>
                </ul>
              </div>
            </div>

            {/* 1. INTERAKTIVER ZFP-METHODENWÄHLER NACH PRÜFAUFGABE */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-shiraz" />
                  ZfP-Methoden-Konfigurator: Prüfaufgabe wählen
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Empfehlungen nach DGZfP &amp; BASt
                </span>
              </div>

              {/* 5 Aufgaben-Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {[
                  { id: 'hohlraum', label: 'Hohlraumerkennung', desc: 'Verpressqualität Hüllrohr' },
                  { id: 'drahtbruch', label: 'Drahtbruchprüfung', desc: 'Gerissene Litzen / Drähte' },
                  { id: 'korrosion', label: 'Aktive Korrosionsortung', desc: 'Depassivierung & Chloride' },
                  { id: 'geometrie', label: 'Spanngliedortung', desc: 'Lage & Betondeckung' },
                  { id: 'monitoring', label: 'Dauermonitoring', desc: 'Echtzeit-Überwachung' }
                ].map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => setSelectedZfpTask(task.id as any)}
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
                const zfpDetails = {
                  hohlraum: {
                    title: 'Hohlraumerkennung & Verpressqualität in Hüllrohren',
                    primary: 'Ultraschall-Echo mit Phased-Array-Technik (A1040 MIRA / Pundit Array)',
                    secondary: 'Impact-Echo (Schallresonanz) + Endoskopische Verifikation',
                    principle: 'Akustischer Impedanzsprung: Zementmörtel (Z ≈ 8.5·10⁶ kg/(m²s)) vs. Luftporen (Z ≈ 400). An Luft entsteht Totalreflexion (R ≈ -1.0) mit starkem Phasensprung.',
                    limits: 'Detektiert Hohlräume ab ca. 15–20 mm Ausdehnung bei Betondeckungen bis 50–100 cm. Schlaffe Querbewehrung kann Streuechos erzeugen.',
                    standards: 'DGZfP Merkblatt B 04 & BASt-Leitfaden ZfP'
                  },
                  drahtbruch: {
                    title: 'Detektion gerissener Spannstahldrähte im Hüllrohr',
                    primary: 'Magnetische Streuflussprüfung (MFL - Magnetic Flux Leakage)',
                    secondary: 'Remanenzmagnetismus-Verfahren (Restfeldmessung)',
                    principle: 'Ein starker Elektromagnet magnetisiert das Spannglied bis zur magnetischen Sättigung. Ein Drahtbruch erzeugt magnetische Gegenpole und einen Streufluss an der Betonoberfläche.',
                    limits: 'Erkennt Einzel- und Mehrfachdrahtbrüche ab 1 gerissenem Draht bei Betondeckungen bis ca. 120–150 mm. Bei dicken Bauteilen oder sehr dichter Querbewehrung abnehmende Empfindlichkeit.',
                    standards: 'DGZfP Merkblatt B 11 & BASt Leitfaden MFL'
                  },
                  korrosion: {
                    title: 'Lokalisierung aktiver Korrosionsherde (Lochfraß / Chloridangriff)',
                    primary: 'Potenzialfeldmessung (Half-Cell Potential / Referenzelektrode Cu/CuSO₄)',
                    secondary: 'Polarisationswiderstandsmessung (Rp / galvanostatische Puls-Methode)',
                    principle: 'Elektrochemische Potenzialdifferenz zwischen intaktem passiviertem Stahl (-100 bis -200 mV) und aktiv korrodierendem Stahl (< -350 mV) an der Betonoberfläche.',
                    limits: 'Zeigt aktive Korrosion zuverlässig an, erfordert jedoch leitfähigen Kontakt zum Beton. Bei Hüllrohren aus Kunststoff (fib PL2/PL3) nur außerhalb des Rohrs messbar.',
                    standards: 'DIN EN ISO 12696 & DGZfP Merkblatt B 03'
                  },
                  geometrie: {
                    title: 'Spanngliedachslage & Kollisionsprüfung vor Bohrarbeiten',
                    primary: 'BKS-Georadar (GPR - Ground Penetrating Radar, 1.5–2.6 GHz)',
                    secondary: 'Niederfrequente elektromagnetische Wirbelstromsonden (Profometer)',
                    principle: 'Emission hochfrequenter elektromagnetischer Radarwellen. An metallischen Hüllrohren erfolgt Totalreflexion (Dielektrizitätskonstante ε_r Beton ≈ 6–9 vs. Metall ∞).',
                    limits: 'Lagegenauigkeit ±5 mm bis 40 cm Tiefe. Bei feuchtem oder stark salzbelastetem Beton hohe Signaldämpfung.',
                    standards: 'DGZfP Merkblatt B 10'
                  },
                  monitoring: {
                    title: 'Permanentes Echtzeit-Monitoring gefährdeter Spannbetonbrücken',
                    primary: 'Schallemissionsanalyse (Acoustic Emission - AE)',
                    secondary: 'Elektrisch isolierte Spannglieder (EIT - Widerstandsüberwachung)',
                    principle: 'Piezosensoren erfassen die transiente Ultraschall-Schockwelle (50–200 kHz) im exakten Moment des Reißens eines Spannstahldrahts. 3D-Laufzeittriangulation ortet die Bruchstelle.',
                    limits: 'Reines Aktiv-Monitoring (erfasst nur neue Drahtbrüche ab Montage, keine Altschäden). Hoher Aufwand bei Signalfilterung gegen Verkehrsrauschen.',
                    standards: 'DGZfP Merkblatt B 07 & fib Bulletin 33'
                  }
                }[selectedZfpTask];

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
                        <strong className="text-slate-900 block font-semibold">1. Primäres Prüfverfahren (Goldstandard):</strong>
                        <p className="text-shiraz font-bold">{zfpDetails.primary}</p>
                        <strong className="text-slate-900 block font-semibold pt-1">2. Sekundäres / Bestätigungsverfahren:</strong>
                        <p className="text-slate-600">{zfpDetails.secondary}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <strong className="text-slate-900 block font-semibold">Physikalisches Wirkprinzip:</strong>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{zfpDetails.principle}</p>
                        <strong className="text-slate-900 block font-semibold pt-1">Praktische Nachweisgrenzen &amp; Störungen:</strong>
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
                    <Radio className="text-shiraz h-4 w-4" />
                    Ultraschall-Echo (Phased Array) &amp; Rekonstruktions-Simulator
                  </h5>
                  <p className="text-[11px] text-text-main/70">
                    Simulation des A-Scan (Laufzeit-Amplitude) und B-Scan (SAFT-Tiefenschnitt) für verschiedene Hüllrohrzustände
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-text-main mr-1">Verpresszustand:</span>
                  {[
                    { id: 'voll_verpresst', label: 'Voll verpresst' },
                    { id: 'lufteinschluss', label: 'Lufteinschluss (Hohlraum)' },
                    { id: 'wasserblase', label: 'Wasserblase (Bluten)' }
                  ].map((cond) => (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => setSelectedDuctCondition(cond.id as any)}
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
                            Totalreflexion Luft (R ≈ -1.0)
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

              <div className="p-3 bg-slate-50/80 rounded-lg text-xs text-text-main/80 space-y-1">
                <strong>Erklärung des akustischen Phänomens (Impedanzgrenze):</strong>
                <p>
                  Trifft die Ultraschall-Transversalwelle auf ein <strong>voll verpresstes Hüllrohr</strong>, 
                  besitzt der Einpressmörtel eine ähnliche akustische Impedanz wie der umgebende Beton (<InlineMath math="Z \approx 8.5 \times 10^6\text{ kg/(m}^2\text{s)}" />). 
                  Die Welle dringt durch das Rohr hindurch; das Rückwandecho des Bauteils bleibt klar erkennbar. 
                  Trifft sie dagegen auf einen <strong>Lufteinschluss (<InlineMath math="Z_{Luft} \approx 400" />)</strong>, 
                  wird die Schallenergie zu fast <strong>100 % reflektiert</strong>. Dahinterliegende Litzen und die 
                  Bauteilrückwand verschwinden vollständig im <strong>akustischen Schatten</strong>.
                </p>
              </div>
            </div>

            {/* 3. GROSSE ZFP-METHODENMATRIX IM VERGLEICH */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
                <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <BookOpen className="text-shiraz h-4 w-4" />
                  Vergleichende Übersicht aller 6 ZfP-Verfahren im Spannbetonbau
                </h5>
                <span className="text-[11px] text-slate-500">DGZfP &amp; BASt Leitfaden</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-text-main border-b border-home-grau/30 font-semibold">
                      <th className="p-2.5">ZfP-Verfahren</th>
                      <th className="p-2.5">Zielgröße</th>
                      <th className="p-2.5 font-mono">Messtiefe</th>
                      <th className="p-2.5">Nachweisgrenze</th>
                      <th className="p-2.5">Einfluss Querbewehrung</th>
                      <th className="p-2.5">Richtlinie / Norm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        <Radio size={13} className="text-shiraz" /> Ultraschall Phased Array
                      </td>
                      <td className="p-2.5">Hohlräume, Verpressfehler, Dicke</td>
                      <td className="p-2.5 font-mono">bis 100 cm</td>
                      <td className="p-2.5">Hohlraum ≥ 15 mm</td>
                      <td className="p-2.5 text-amber-700">Mäßig (Streuechos möglich)</td>
                      <td className="p-2.5 font-mono text-[11px]">DGZfP B 04</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        <Activity size={13} className="text-shiraz" /> Magnetischer Streufluss (MFL)
                      </td>
                      <td className="p-2.5 font-semibold text-shiraz">Spanndrahtbrüche im Hüllrohr</td>
                      <td className="p-2.5 font-mono">bis 15 cm</td>
                      <td className="p-2.5 font-bold text-shiraz">ab 1 Einzeldrahtbruch</td>
                      <td className="p-2.5 text-rose-700">Stark (Bügel überlagern Streufluss)</td>
                      <td className="p-2.5 font-mono text-[11px]">DGZfP B 11 / BASt</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        <Search size={13} className="text-shiraz" /> Impact-Echo (Schallresonanz)
                      </td>
                      <td className="p-2.5">Großflächige Fehlstellen, Dicke</td>
                      <td className="p-2.5 font-mono">bis 150 cm</td>
                      <td className="p-2.5">Fehlstellen ≥ 50 mm</td>
                      <td className="p-2.5 text-emerald-700">Sehr gering (P-Wellen unempfindlich)</td>
                      <td className="p-2.5 font-mono text-[11px]">ASTM C1383 / DGZfP B 06</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        <Layers size={13} className="text-shiraz" /> Georadar (BKS-Radar 2 GHz)
                      </td>
                      <td className="p-2.5">Spanngliedachse, Betondeckung</td>
                      <td className="p-2.5 font-mono">bis 50 cm</td>
                      <td className="p-2.5">Lage ± 5 mm</td>
                      <td className="p-2.5 text-amber-700">Dichte Lagen schirmen tiefere Rohre ab</td>
                      <td className="p-2.5 font-mono text-[11px]">DGZfP B 10</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        <Zap size={13} className="text-shiraz" /> Schallemissionsanalyse (AE)
                      </td>
                      <td className="p-2.5">Dauermonitoring (Drahtrisserkennung)</td>
                      <td className="p-2.5 font-mono">Gesamtes Feld</td>
                      <td className="p-2.5 font-bold text-shiraz">Sofortige Riss-Detektion</td>
                      <td className="p-2.5 text-emerald-700">Kein Einfluss auf Schallleitung</td>
                      <td className="p-2.5 font-mono text-[11px]">DGZfP B 07</td>
                    </tr>
                    <tr className="hover:bg-off-white">
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-shiraz" /> Elektrisch isoliertes Spannglied (EIT)
                      </td>
                      <td className="p-2.5">Hüllrohrdichtigkeit, Feuchte/Salz</td>
                      <td className="p-2.5 font-mono">Gesamtlänge</td>
                      <td className="p-2.5 text-emerald-700">R ≥ 1 MΩ·m (Intakt)</td>
                      <td className="p-2.5 text-emerald-700">Kein Einfluss (vollständig entkoppelt)</td>
                      <td className="p-2.5 font-mono text-[11px]">fib Bulletin 33 &amp; 75</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. PRAXIS-LEITFADEN BESTANDSPRÜFUNG NACH BAST */}
            <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-shiraz" />
                4-Stufen-Untersuchungskonzept bei Bestandsbrücken (DIN 1076 / BASt)
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <span className="font-bold text-slate-900 block">Stufe 1: Vorerkundung</span>
                  <p className="text-[11px] text-slate-600">
                    Sichtung der Bestandsstatik, Identifikation gefährdeter Spannstähle (z. B. Neptun 145/160) und flächiges Georadar-Screening.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <span className="font-bold text-slate-900 block">Stufe 2: ZfP-Hohlraumanalyse</span>
                  <p className="text-[11px] text-slate-600">
                    Ultraschall-Echo (MIRA) und Impact-Echo an Rohrhochpunkten und Koppelstellen zur Lokalisierung von Verpressdefiziten.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <span className="font-bold text-slate-900 block">Stufe 3: Streufluss &amp; Endoskopie</span>
                  <p className="text-[11px] text-slate-600">
                    MFL-Prüfung bei Verdacht auf Drahtbrüche sowie 8 mm Minimal-Bohrung zur optischen Video-Endoskopie.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-home-grau/20 space-y-1">
                  <span className="font-bold text-slate-900 block">Stufe 4: Nachrechnung &amp; Monitoring</span>
                  <p className="text-[11px] text-slate-600">
                    Tragfähigkeitsnachweis nach Nachrechnungsrichtlinie unter Ausfallannahme einzelner Spannglieder und Schallemissionsüberwachung.
                  </p>
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
                <Flame className="text-shiraz h-5 w-5" />
                Historische Schadensfälle &amp; Folgerungen für den Spannbetonbau
              </h4>
              <span className="text-xs font-mono font-bold bg-rose-100 text-rose-900 border border-rose-200 px-2.5 py-1 rounded-md">
                Forensische Werkstoffkunde
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-text-main/80">
              {/* Fall 1: Kongresshalle Berlin */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 text-sm">Kongresshalle Berlin (1980)</strong>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">Dacheinsturz</span>
                </div>
                <p className="leading-relaxed">
                  <strong>Ursache:</strong> Reißende Spannglieder im Vordachbereich. Verwendet wurde warmvergüteter 
                  Stahl (Neptun St 145/160). An den Betonierfugen des Bogendaches drang Feuchtigkeit durch unzureichend verpresste 
                  Hüllrohre ein. Es kam zur interkristallinen Spannungsrisskorrosion.
                </p>
                <div className="p-2 bg-white rounded border border-slate-200 font-semibold text-rose-950">
                  Konsequenz: Vollständiges Verbot warmvergüteter Spannstähle in Deutschland! Einführung patentiert kaltgezogener Litzen.
                </div>
              </div>

              {/* Fall 2: Carolabrücke Dresden */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 text-sm">Carolabrücke Dresden (2024)</strong>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">Trägerversagen</span>
                </div>
                <p className="leading-relaxed">
                  <strong>Ursache:</strong> Einsturz des Brückenzugs C über der Elbe. Über Jahrzehnte hinweg 
                  drang chloridhaltiges Tausalzwasser durch defekte Fahrbahnübergänge und Entwässerungsstellen in den Hohlkasten 
                  und erreichte Spannglieder mit Fehlstellen in der Mörtelverpressung.
                </p>
                <div className="p-2 bg-white rounded border border-slate-200 font-semibold text-rose-950">
                  Konsequenz: Massive Verschärfung der Prüfpflichten, ZfP-Sondierungen und Nachrechnungen älterer Spannbetonbrücken.
                </div>
              </div>

              {/* Fall 3: Brücke von Ninove */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 text-sm">Brücke von Ninove (Belgien)</strong>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">Sprödbruch</span>
                </div>
                <p className="leading-relaxed">
                  <strong>Ursache:</strong> Spanngliedversagen durch Wasserstoffversprödung. Wasser hatte sich in 
                  den Hohlräumen an Rohrhochpunkten gesammelt, da der Einpressmörtel eine zu hohe Wasserabsonderung (Bleeding) aufwies.
                </p>
                <div className="p-2 bg-white rounded border border-slate-200 font-semibold text-amber-950">
                  Konsequenz: Strikte Obergrenze von 0.3 % Wasserabsondern in der europäischen Mörtelnorm DIN EN 447.
                </div>
              </div>

              {/* Fall 4: Schweißschäden */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 text-sm">Baustellenschäden durch Schweißfunken</strong>
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">Gefügefehler</span>
                </div>
                <p className="leading-relaxed">
                  <strong>Ursache:</strong> Unbeabsichtigtes Berühren von Spannstählen mit Schweißelektroden beim 
                  Anheften von Einbauteilen oder Schließen von Fugen. Die lokale thermische Selbstabschreckung erzeugt Martensit.
                </p>
                <div className="p-2 bg-white rounded border border-slate-200 font-semibold text-slate-900">
                  Konsequenz: Striktes bauaufsichtliches Verbot jeglicher Schweiß- und Trennarbeiten nahe Spanngliedern.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
