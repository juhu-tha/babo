import React, { useState, useMemo } from 'react';
import { 
  RefreshCw, 
  Leaf, 
  Target, 
  Zap, 
  Layers, 
  Settings, 
  Calculator, 
  AlertTriangle, 
  Info, 
  Scale, 
  CheckCircle2, 
  FileText, 
  Coins 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { GMODG_ANLAGE7, savings, dRequired, type Bauteil } from '@/src/utils/bestandKern';

type TabKey = 'begriffe' | 'nachruestpflichten' | 'bauphysik' | 'gebaeudetechnik' | 'isfp';

interface BuildingComponentLimit {
  id: string;
  name: string;
  limitU: number; // W/(m²K) – aus GMODG_ANLAGE7
  bauteil: Bauteil;
  typicalOldU: number;
  description: string;
}

const GMODG_COMPONENT_LIMITS: BuildingComponentLimit[] = [
  { 
    id: 'wall', 
    name: 'Außenwand (Putz / WDVS / Bekleidung)', 
    bauteil: 'aussenwand',
    limitU: GMODG_ANLAGE7.aussenwand, 
    typicalOldU: 1.40,
    description: 'Außenwände gegen Außenluft (Anlage 7 Nr. 1, § 36 GModG). Innendämmung: keine Höchstwertanforderung, Nachweis Tauwasserfreiheit nach DIN 4108-3 / WTA 6-4/6-5.'
  },
  { 
    id: 'roof_pitched', 
    name: 'Steildach / Oberste Geschossdecke', 
    bauteil: 'steildach_oGD',
    limitU: GMODG_ANLAGE7.steildach_oGD, 
    typicalOldU: 1.20,
    description: 'Steildächer, Gauben, oberste Geschossdecken und Wände zu unbeheiztem Dachraum (Anlage 7 Nr. 5a/5b; § 35 / § 36 GModG).'
  },
  { 
    id: 'roof_flat', 
    name: 'Flachdach', 
    bauteil: 'flachdach',
    limitU: GMODG_ANLAGE7.flachdach, 
    typicalOldU: 1.10,
    description: 'Flachdächer gegen Außenluft inklusive Warm- und Umkehrdächer (§ 36 GModG).'
  },
  { 
    id: 'basement_ceiling', 
    name: 'Kellerdecke (gegen unbeheizt / Erdreich)', 
    bauteil: 'kellerdecke_erdreich',
    limitU: GMODG_ANLAGE7.kellerdecke_erdreich, 
    typicalOldU: 1.50,
    description: 'Decken nach unten gegen Erdreich oder unbeheizte Kellerräume (§ 36 GModG).'
  },
  { 
    id: 'windows', 
    name: 'Fenster & Fenstertüren (Uw)', 
    bauteil: 'fenster',
    limitU: GMODG_ANLAGE7.fenster, 
    typicalOldU: 2.80,
    description: 'Vertikale Fenster im Wohnungsbestand (DIN EN ISO 10077-1, § 36 GModG).'
  }
];

interface InsulationMaterial {
  name: string;
  wlg: number; // W/mK
  costPerM3: number; // Euro/m³
  co2Eq: number; // kg CO2-eq/m³
  ecoclass: string;
}

const INSULATION_MATERIALS: Record<string, InsulationMaterial> = {
  eps_035: { name: 'EPS-Hartschaum WLG 035 (Standard weiß)', wlg: 0.035, costPerM3: 95, co2Eq: 75, ecoclass: 'Synthetisch' },
  eps_032: { name: 'EPS-Grau WLG 032 (Grafit-verstärkt)', wlg: 0.032, costPerM3: 125, co2Eq: 82, ecoclass: 'Synthetisch' },
  mineral_035: { name: 'Mineralwolle / Steinwolle WLG 035 (Nichtbrennbar A1)', wlg: 0.035, costPerM3: 130, co2Eq: 45, ecoclass: 'Mineralisch' },
  pur_024: { name: 'Polyurethan (PUR/PIR) WLG 024 (Hochleistung)', wlg: 0.024, costPerM3: 210, co2Eq: 110, ecoclass: 'Synthetisch' },
  resol_022: { name: 'Phenolharz / Resol WLG 022 (Super-Schlank)', wlg: 0.022, costPerM3: 260, co2Eq: 120, ecoclass: 'Synthetisch' },
  holzfaser_040: { name: 'Holzfaserdämmplatte WLG 040 (Ökologisch)', wlg: 0.040, costPerM3: 180, co2Eq: -60, ecoclass: 'Nachwachsend' }
};

export default function Modernisierung() {
  const [activeTab, setActiveTab] = useState<TabKey>('begriffe');

  // Simulator-State in Tab 3 (Bauphysik)
  const [selectedComponentId, setSelectedComponentId] = useState<string>('wall');
  const [selectedMaterialKey, setSelectedMaterialKey] = useState<string>('eps_032');
  const [originalU, setOriginalU] = useState<number>(1.40); // W/(m²K)
  const [thicknessMm, setThicknessMm] = useState<number>(140); // mm
  const [componentArea, setComponentArea] = useState<number>(160); // m²
  const [energyPriceKwh, setEnergyPriceKwh] = useState<number>(0.12); // €/kWh
  const [hgtVal, setHgtVal] = useState<number>(3500); // Kd/a (Gradtagzahl G_t20/15, standortabhängig)
  const [etaSys, setEtaSys] = useState<number>(0.9); // Anlagennutzungsgrad η_sys
  const [sowiesoAktiv, setSowiesoAktiv] = useState<boolean>(false); // Gerüst/Putz fällt ohnehin an (Kopplungsprinzip)

  const activeComponent = GMODG_COMPONENT_LIMITS.find(c => c.id === selectedComponentId) || GMODG_COMPONENT_LIMITS[0];
  const activeMaterial = INSULATION_MATERIALS[selectedMaterialKey] || INSULATION_MATERIALS.eps_032;

  // Bauphysikalische & ökonomische Berechnungen
  const simResults = useMemo(() => {
    const R_orig = 1 / Math.max(0.1, originalU);
    const d_m = thicknessMm / 1000;
    const R_ins = d_m / activeMaterial.wlg;
    const R_tot = R_orig + R_ins;
    const newU = 1 / R_tot;
    const deltaU = Math.max(0, originalU - newU);

    // Gesetzliche Konformität nach § 36 GModG (Anlage 7)
    const isCompliant = newU <= activeComponent.limitU + 1e-9;
    const dReqMm = isCompliant ? 0 : Math.ceil(dRequired(newU, activeComponent.limitU, activeMaterial.wlg) * 1000);

    // Investitionskosten Dämmstoff + Montageanteil (ca. 85 €/m² für Gerüst/Putz/Unterbau)
    const materialCost = (d_m * activeMaterial.costPerM3) * componentArea;
    const baseLaborCost = 85 * componentArea; // Montage, Gerüst, Armierung, Putz
    const totalInvestEuro = materialCost + baseLaborCost;

    // Einsparung mit Temperatur-Korrekturfaktor Fx (DIN V 4108-6) und Anlagenaufwand η_sys;
    // Amortisation auf energiebedingte Mehrkosten (ohne Sowieso-Kosten)
    const sav = savings({
      uOld: originalU, uNew: newU, A: componentArea, bauteil: activeComponent.bauteil, Gt: hgtVal,
      etaSys, price: energyPriceKwh, co2: 0.22, invest: totalInvestEuro,
      sowiesoKosten: sowiesoAktiv ? baseLaborCost : 0
    });
    const annualKwhSaved = sav.qEnd;
    const annualEuroSaved = sav.euro;
    const amortizationYears = Number.isFinite(sav.amortisation) ? sav.amortisation : 99;
    const annualCo2KgSaved = sav.co2kg;
    const fx = sav.fx;
    const mehrkosten = sav.mehrkosten;

    return {
      R_orig,
      R_ins,
      R_tot,
      newU,
      deltaU,
      isCompliant,
      annualKwhSaved,
      annualEuroSaved,
      totalInvestEuro,
      amortizationYears,
      annualCo2KgSaved,
      dReqMm, fx, mehrkosten
    };
  }, [originalU, thicknessMm, componentArea, activeMaterial, activeComponent, energyPriceKwh, hgtVal, etaSys, sowiesoAktiv]);

  const handleSelectComponent = (comp: BuildingComponentLimit) => {
    setSelectedComponentId(comp.id);
    setOriginalU(comp.typicalOldU);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-6 border-b border-home-grau/30 pb-6" id="modernisierung-header">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <RefreshCw className="text-shiraz" size={24} /> Modernisierung &amp; Gebäudemodernisierungsgesetz (GModG)
            </h2>
            <span className="text-xs font-mono bg-shiraz/10 text-shiraz border border-shiraz/25 px-3 py-1 rounded-full font-bold">
              Rechtsstand: 29.07.2026 (vormals GEG)
            </span>
          </div>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
            <p>
              Wissenschaftliche und baupraktische Grundlagen der energetischen Bestandssanierung (SANREMO), normative Nachrüst- 
              und Sanierungspflichten nach dem <strong>Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, BGBl. 2026 I Nr. 226)</strong>, 
              die neue gestaffelte Bio-Treppe für Heizungsanlagen sowie bauphysikalische Bilanzierungsmodelle (DIN EN ISO 6946 / Gradtagzahlen nach VDI 4710) 
              zur Amortisationsermittlung.
            </p>
          </div>

          {/* GModG Reform-Infobox */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-3">
            <Info className="text-amber-700 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <strong>Kerninhalte der GModG-Novelle (Ablösung GEG 2024 / „Heizungsgesetz“):</strong>
              <p className="leading-relaxed text-amber-900">
                1. <strong>Entfall des starren 65-%-EE-Zwangs:</strong> Beim Heizungstausch entfällt die unmittelbare 65-%-Erneuerbaren-Pflicht sowie die Bindung an kommunale Wärmepläne.
                <br />
                2. <strong>Einführung der verbindlichen Bio-Treppe:</strong> Neue Gas- und Ölheizungen dürfen weiterhin installiert werden, müssen jedoch ab 2029 steigende Anteile klimaneutraler Brennstoffe (Biomethan, biogenes Flüssiggas, Wasserstoff) nutzen (§ 43 Abs. 1 GModG: 2029: 10 %, 2030: 15 %, 2035: 30 %, 2040: 60 %; ein Ziel von 100 % in 2045 ist über eine gesondert angekündigte Grüngas-/Grünheizöl-Quote vorgesehen).
                <br />
                3. <strong>Wegfall des Betriebsverbots 2045:</strong> Das Betriebsverbot fossiler Heizungen ab 2045 (§ 72 Abs. 4 GEG a. F.) ist entfallen, ebenso die Austauschpflicht für über 30 Jahre alte Konstanttemperaturkessel (§ 72 Abs. 1–2 GEG a. F.).
                <br />
                4. <strong>Neuordnung der Hüllanforderungen:</strong> Nachrüstpflicht für oberste Geschossdecken (§ 35 GModG, <InlineMath math="U \le 0{,}24" />) und Bauteilanforderungen bei &gt; 10 % Sanierung (§ 36 GModG).
              </p>
            </div>
          </div>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6" id="modernisierung-tabs">
          <button aria-pressed={activeTab === 'begriffe'}
            id="tab-begriffe-btn"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'begriffe' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('begriffe')}
          >
            <Target size={16} /> SANREMO-Systematik (Merkhilfe)
          </button>
          
          <button aria-pressed={activeTab === 'nachruestpflichten'}
            id="tab-nachruest-btn"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'nachruestpflichten' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('nachruestpflichten')}
          >
            <Scale size={16} /> GModG Pflichten &amp; Grenzwerte
          </button>

          <button aria-pressed={activeTab === 'bauphysik'}
            id="tab-bauphysik-btn"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'bauphysik' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('bauphysik')}
          >
            <Calculator size={16} /> U-Wert- &amp; Amortisations-Rechner
          </button>

          <button aria-pressed={activeTab === 'gebaeudetechnik'}
            id="tab-technik-btn"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'gebaeudetechnik' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('gebaeudetechnik')}
          >
            <Leaf size={16} /> Heizungstechnik &amp; Bio-Treppe
          </button>

          <button aria-pressed={activeTab === 'isfp'}
            id="tab-isfp-btn"
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'isfp' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('isfp')}
          >
            <FileText size={16} /> Sanierungsfahrplan (iSFP)
          </button>
        </div>

        {/* TAB 1: SANREMO-SYSTEMATIK & BEGRIFFE */}
        {activeTab === 'begriffe' && (
          <div className="space-y-6 animate-in fade-in duration-200" id="content-begriffe">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Das Akronym <strong>SANREMO</strong> (Sanierung – Renovierung – Modernisierung) strukturiert bauliche Eingriffe im Bestand 
                nach ihrem Zielsetzungstyp, ihrer Eingriffstiefe sowie den baurechtlichen, mietrechtlichen (§ 555b BGB) und steuerrechtlichen Konsequenzen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-shiraz flex items-center gap-1.5 text-sm uppercase tracking-wider mb-2">
                    <Target size={18} /> 1. Sanierung („Reparatur“)
                  </h3>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                    Systematische Beseitigung erheblicher bautechnischer Mängel, Gefahren oder Substanzschäden, um die 
                    Standsicherheit, Gebrauchstauglichkeit und Lebensdauer der Bausubstanz wiederherzustellen.
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-[11px] font-mono border text-slate-700">
                  <strong>Typische Maßnahmen:</strong> Betoninstandsetzung nach DAfStb-Richtlinie / TR Instandhaltung, Mauerwerks-Rissverpressung, Abdichtungserneuerung gegen drückendes Wasser (DIN 18533).
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-shiraz flex items-center gap-1.5 text-sm uppercase tracking-wider mb-2">
                    <RefreshCw size={18} /> 2. Renovierung („Schönung“)
                  </h3>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                    Optische und oberflächliche Erneuerung von Verschleißerscheinungen ohne gravierende Eingriffe 
                    in das Gefüge der Baustoffe, die Wärmeschutzhülle oder das statische Tragwerk.
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-[11px] font-mono border text-slate-700">
                  <strong>Typische Maßnahmen:</strong> Schönheitsreparaturen, Neuanstrich, Tapezieren, Schleifen und Einölen von Parkettböden, Fugenerneuerung im Sanitärbereich.
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-shiraz flex items-center gap-1.5 text-sm uppercase tracking-wider mb-2">
                    <Layers size={18} /> 3. Modernisierung („Aufwertung“)
                  </h3>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                    Bauliche Maßnahmen zur nachhaltigen Erhöhung des Gebrauchswerts, zur Einsparung von Primärenergie 
                    und Treibhausgasen sowie zur Anpassung an moderne technische Standards (§ 555b BGB).
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-[11px] font-mono border text-slate-700">
                  <strong>Typische Maßnahmen:</strong> Fassadendämmung (WDVS), Fenstertausch auf 3-fach-Verglasung, Einbau einer Wärmepumpe, Installation einer kontrollierten Wohnraumlüftung mit WRG.
                </div>
              </div>

            </div>

            {/* Steuerliche Abgrenzung nach EStG */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/25 space-y-3">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Coins size={16} className="text-shiraz" /> Steuerrechtliche Einstufung: Erhaltungsaufwand vs. Herstellungskosten
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80 leading-relaxed">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">Erhaltungsaufwand (Sofortabzug):</strong>
                  Aufwendungen zur ordnungsgemäßen Instandhaltung des Gebäudes ohne Wesensveränderung. Sie sind im Jahr der Zahlung 
                  in voller Höhe als Werbungskosten oder Betriebsausgaben steuerlich abzugsfähig (wahlweise Verteilung auf 2–5 Jahre nach § 82b EStDV bei Wohngebäuden).
                </div>
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
                  <strong className="text-amber-950 block mb-1">Anschaffungsnahe Herstellungskosten (§ 6 Abs. 1 Nr. 1a EStG):</strong>
                  Instandsetzungs- und Modernisierungsmaßnahmen, die <em>innerhalb von 3 Jahren</em> nach Anschaffung durchgeführt werden und 
                  in Summe <strong>15 % der Anschaffungskosten des Gebäudes (ohne Grundstück)</strong> übersteigen, gelten zwingend als Herstellungskosten 
                  und müssen linear über die Gebäude-AfA (in der Regel 33 bis 50 Jahre) abgeschrieben werden!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GMODG NACHRÜST- & SANIERUNGSPFLICHTEN */}
        {activeTab === 'nachruestpflichten' && (
          <div className="space-y-6 animate-in fade-in duration-200" id="content-nachruestpflichten">
            
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
              <h3 className="font-bold text-text-main flex items-center gap-1.5 text-base">
                <Scale className="text-shiraz" size={20} /> Gesetzliche Nachrüst- und Sanierungspflichten nach GModG
              </h3>
              <p className="text-xs text-text-main/70 mt-1 leading-relaxed">
                Das Gebäudemodernisierungsgesetz (GModG, bis 28.07.2026 GEG) unterscheidet zwischen <em>unbedingten Nachrüstpflichten</em> (die Eigentümer unabhängig von Bauarbeiten erfüllen müssen) 
                und <em>bedingten Sanierungspflichten</em> (die greifen, wenn mehr als 10 % eines Außenbauteils saniert oder erneuert werden – § 36 GModG).
              </p>
            </div>

            {/* Die 3 unbedingten Nachrüstpflichten */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-rose-50 text-shiraz flex items-center justify-center font-bold font-mono text-sm">1</span>
                    <h4 className="font-bold text-text-main text-sm">Dämmung oberste Geschossdecke (§ 35 GModG)</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Begehbare sowie nicht begehbare oberste Geschossdecken, die beheizte Räume gegen einen unbeheizten Dachraum abgrenzen, 
                    müssen so gedämmt sein, dass der Wärmedurchgangskoeffizient den Grenzwert einhält.
                  </p>
                </div>
                <div className="bg-slate-100 p-2.5 rounded text-[11px] font-mono border">
                  <strong>Grenzwert (§ 35 GModG):</strong> <InlineMath math="U \le 0{,}24 \text{ W/(m}^2\text{K)}" /><br />
                  Alternativ kann das darüberliegende Dach wärmetechnisch gleichwertig gedämmt werden.
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-rose-50 text-shiraz flex items-center justify-center font-bold font-mono text-sm">2</span>
                    <h4 className="font-bold text-text-main text-sm">Dämmung wärmeführender Leitungen (§ 69 GModG)</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Ungedämmte, zugängliche Heizungs- und Warmwasserrohrleitungen sowie Armaturen in unbeheizten Räumen (z. B. Keller) 
                    müssen nach Anlage 8 GModG gedämmt werden, um Verteilungsverluste zu minimieren.
                  </p>
                </div>
                <div className="bg-slate-100 p-2.5 rounded text-[11px] font-mono border">
                  <strong>Dämmschichtdicke (bei <InlineMath math="\lambda = 0{,}035" />):</strong><br />
                  Innendurchmesser bis 22 mm: 20 mm; bis 35 mm: 30 mm; bis 100 mm: 100 % des Innendurchmessers; ab 100 mm: 100 mm.
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-rose-50 text-shiraz flex items-center justify-center font-bold font-mono text-sm">3</span>
                    <h4 className="font-bold text-text-main text-sm">Rechtsstand Heizkessel (bisher § 72 GEG)</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Gestrichen wurden das Betriebsverbot fossiler Heizungen ab 2045 (§ 72 Abs. 4 GEG a. F.) und die Austauschpflicht für über 30 Jahre alte Konstanttemperaturkessel (§ 72 Abs. 1–2 GEG a. F.). 
                    Bestehende Anlagen dürfen weiterbetrieben werden; bei Neuerrichtung greift die Bio-Treppe ab 2029.
                  </p>
                </div>
                <div className="bg-slate-100 p-2.5 rounded text-[11px] font-mono border">
                  <strong>GModG Neuregelung:</strong> Kein pauschales 30-Jahre-Betriebsverbot mehr; Übergang über die Bio-Treppe ab 2029 (10 % bis 60 % in 2040).
                </div>
              </div>

            </div>

            {/* Ausnahme für Selbstnutzer & Eigentümerwechsel */}
            <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950 leading-relaxed flex items-start gap-3">
              <Info className="text-emerald-700 shrink-0 mt-0.5" size={18} />
              <div>
                <strong>Befreiung für Alt-Eigentümer &amp; Nachrüstfrist bei Eigentümerwechsel (§ 35 Abs. 3 &amp; § 69 Abs. 3 GModG):</strong>
                <br />
                Eigentümer von Ein- und Zweifamilienhäusern, die ihre Wohnung am <strong>1. Februar 2002 selbst bewohnt</strong> haben, 
                sind von den Nachrüstpflichten (Geschossdeckendämmung und Rohrdämmung) persönlich befreit. 
                Bei einem <strong>Eigentümerwechsel</strong> (Verkauf, Schenkung, Erbe) entfällt dieses Privileg: Der neue Eigentümer muss die 
                gesetzlichen Nachrüstpflichten innerhalb einer Frist von <strong>zwei Jahren ab Eigentumsübergang</strong> (Grundbucheintrag) vollständig erfüllen.
              </div>
            </div>

            {/* Bedingte Pflicht: 10-%-Regel und Bauteil-Grenzwerte nach § 36 GModG */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/25 space-y-4">
              <div>
                <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-shiraz" /> Bedingte Sanierungspflicht: Die 10-%-Regel (§ 36 GModG)
                </h4>
                <p className="text-xs text-text-main/70 mt-1">
                  Werden an einem bestehenden Gebäude bei Außenbauteilen mehr als <strong>10 % der jeweiligen Bauteilfläche</strong> erneuert, 
                  ersetzt oder erstmalig eingebaut (z. B. Neuverputzen einer Fassade, Neueindeckung eines Daches), müssen die betroffenen Bauteile 
                  zwingend die gesetzlichen Höchstwerte des Wärmedurchgangskoeffizienten (<InlineMath math="U_{\text{max}}" />) nach § 36 GModG einhalten:
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 border-b border-home-grau/30">
                      <th className="p-3 font-bold">Bauteil (Außenhülle)</th>
                      <th className="p-3 font-bold">Max. U-Wert nach § 36 GModG</th>
                      <th className="p-3 font-bold">Altbestand (typisch vor 1977)</th>
                      <th className="p-3 font-bold">Erforderliche Dämmstärke (ca.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium">Außenwand (Putz, WDVS, Bekleidung)</td>
                      <td className="p-3 font-mono font-bold text-shiraz">U ≤ 0,24 W/(m²K)</td>
                      <td className="p-3 font-mono">1,20 – 1,80 W/(m²K)</td>
                      <td className="p-3 font-mono">14 – 16 cm (WLG 035)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium">Steildach / oberste Geschossdecke</td>
                      <td className="p-3 font-mono font-bold text-shiraz">U ≤ 0,24 W/(m²K)</td>
                      <td className="p-3 font-mono">1,00 – 1,60 W/(m²K)</td>
                      <td className="p-3 font-mono">12 – 14 cm (WLG 035)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium">Flachdach (Warm-/Umkehrdach)</td>
                      <td className="p-3 font-mono font-bold text-shiraz">U ≤ 0,20 W/(m²K)</td>
                      <td className="p-3 font-mono">0,90 – 1,40 W/(m²K)</td>
                      <td className="p-3 font-mono">16 – 18 cm (WLG 035)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium">Fenster, Balkon- &amp; Fenstertüren</td>
                      <td className="p-3 font-mono font-bold text-shiraz">Uw ≤ 1,30 W/(m²K)</td>
                      <td className="p-3 font-mono">2,70 – 3,20 W/(m²K)</td>
                      <td className="p-3 font-mono">3-fach-Wärmeschutzverglasung</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium">Dachflächenfenster</td>
                      <td className="p-3 font-mono font-bold text-shiraz">Uw ≤ 1,40 W/(m²K)</td>
                      <td className="p-3 font-mono">2,50 – 3,00 W/(m²K)</td>
                      <td className="p-3 font-mono">Moderne Dachfensterelemente</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium">Kellerdecke / Decke gegen Erdreich</td>
                      <td className="p-3 font-mono font-bold text-shiraz">U ≤ 0,30 W/(m²K)</td>
                      <td className="p-3 font-mono">1,30 – 1,70 W/(m²K)</td>
                      <td className="p-3 font-mono">10 – 12 cm (WLG 035)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium">Außentüren / Hauseingangstüren</td>
                      <td className="p-3 font-mono font-bold text-shiraz">Ud ≤ 1,80 W/(m²K)</td>
                      <td className="p-3 font-mono">3,00 – 4,50 W/(m²K)</td>
                      <td className="p-3 font-mono">Gedämmte Türblätter mit Dichtung</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: BAUPHYSIK- & AMORTISATIONS-RECHNER */}
        {activeTab === 'bauphysik' && (
          <div className="space-y-6 animate-in fade-in duration-200" id="content-bauphysik">
            
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl flex flex-col lg:flex-row gap-6 justify-between items-start">
              <div className="max-w-2xl space-y-2">
                <h3 className="font-bold text-text-main flex items-center gap-1.5 text-base">
                  <Calculator className="text-shiraz" size={20} /> Bauphysikalische U-Wert- &amp; Amortisations-Simulation
                </h3>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Berechnung des Wärmedurchgangskoeffizienten (<InlineMath math="U" />) nach DIN EN ISO 6946 und Prüfung 
                  der gesetzlichen Grenzwerte nach <strong>§ 36 GModG</strong>. Simulieren Sie Einsparungen an Heizenergie, 
                  Heizkosten und Treibhausgasen sowie die statische Amortisationsdauer der Maßnahme.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-home-grau/25 shadow-xs font-mono text-[11px] text-text-main space-y-1">
                <div><InlineMath math="R_T = R_{si} + \frac{1}{U_0} + \frac{d}{\lambda} + R_{se}" /></div>
                <div><InlineMath math="U_{\text{neu}} = \frac{1}{R_T} \le U_{\text{max, GModG}}" /></div>
              </div>
            </div>

            {/* Bauteil-Wahl */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-main/70 uppercase tracking-wide block">Zu sanierendes Bauteil wählen:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                {GMODG_COMPONENT_LIMITS.filter(c => c.id !== 'windows').map(comp => (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => handleSelectComponent(comp)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedComponentId === comp.id 
                        ? 'bg-shiraz text-white border-shiraz shadow-sm font-bold' 
                        : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                    }`}
                  >
                    <div className="text-xs truncate">{comp.name.split('(')[0]}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedComponentId === comp.id ? 'text-white/80' : 'text-slate-500'}`}>
                      GModG-Limit: {formatDeWert(comp.limitU)} W/m²K
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Parameter-Eingabe (Links) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-home-grau/30 space-y-4">
                <h4 className="font-bold text-sm text-text-main pb-2 border-b border-home-grau/20 flex items-center gap-1.5">
                  <Settings size={16} className="text-shiraz" /> Sanierungsparameter
                </h4>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span>Ausgangs-U-Wert Bestand (<InlineMath math="U_0" />):</span>
                    <span className="text-shiraz font-mono font-bold">{formatDeZahl(originalU, 2)} W/(m²K)</span>
                  </label>
                  <input
                    type="range"
                    min="0.50"
                    max="2.50"
                    step="0.05"
                    value={originalU}
                    onChange={(e) => setOriginalU(parseFloat(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0,50 (teilsaniert)</span>
                    <span>1,40 (Standard Altbau)</span>
                    <span>2,50 (Vollziegel ungedämmt)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span>Dämmstoff:</span>
                    <span className="text-shiraz font-mono font-bold">WLG {formatDeWert(activeMaterial.wlg * 1000)} ({formatDeZahl(activeMaterial.wlg, 3)})</span>
                  </label>
                  <select
                    className="w-full p-2.5 border border-home-grau/35 rounded-xl text-xs bg-white focus:outline-none"
                    value={selectedMaterialKey}
                    onChange={(e) => setSelectedMaterialKey(e.target.value)}
                  >
                    {Object.entries(INSULATION_MATERIALS).map(([key, mat]) => (
                      <option key={key} value={key}>{mat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main/80 flex justify-between">
                    <span>Dämmstoffdicke (<InlineMath math="d" />):</span>
                    <span className="text-shiraz font-mono font-bold">{formatDeWert(thicknessMm)} mm</span>
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="300"
                    step="10"
                    value={thicknessMm}
                    onChange={(e) => setThicknessMm(parseInt(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>40 mm</span>
                    <span>140 mm (Standard)</span>
                    <span>300 mm (Passivhaus)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-main/80 block">Bauteilfläche (<InlineMath math="A" />):</label>
                    <div className="flex items-center gap-1.5">
                      <input aria-label="Bauteilfläche ()"
                        type="number"
                        min="20"
                        max="1000"
                        value={componentArea}
                        onChange={(e) => setComponentArea(Math.max(1, Number(e.target.value)))}
                        className="w-full p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold"
                      />
                      <span className="text-xs text-slate-500 font-mono">m²</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-main/80 block">Energiepreis:</label>
                    <div className="flex items-center gap-1.5">
                      <input aria-label="Energiepreis"
                        type="number"
                        step="0.01"
                        min="0.05"
                        max="0.50"
                        value={energyPriceKwh}
                        onChange={(e) => setEnergyPriceKwh(Math.max(0.01, Number(e.target.value)))}
                        className="w-full p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold"
                      />
                      <span className="text-xs text-slate-500 font-mono">€/kWh</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-main/80 block">Gradtagzahl <InlineMath math="G_{t20/15}" />:</label>
                    <div className="flex items-center gap-1.5">
                      <input aria-label="Gradtagzahl "
                        type="number"
                        min="2000"
                        max="5500"
                        step="50"
                        value={hgtVal}
                        onChange={(e) => setHgtVal(Math.min(5500, Math.max(2000, Number(e.target.value) || 3500)))}
                        className="w-full p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold"
                      />
                      <span className="text-xs text-slate-500 font-mono">Kd/a</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-main/80 block">Anlagennutzungsgrad <InlineMath math="\eta_{sys}" />:</label>
                    <div className="flex items-center gap-1.5">
                      <input aria-label="Anlagennutzungsgrad "
                        type="number"
                        min="0.5"
                        max="4"
                        step="0.05"
                        value={etaSys}
                        onChange={(e) => setEtaSys(Math.min(4, Math.max(0.5, Number(e.target.value) || 0.9)))}
                        className="w-full p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold"
                      />
                      <span className="text-xs text-slate-500 font-mono">–</span>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-[11px] text-text-main/80 cursor-pointer">
                  <input type="checkbox" checked={sowiesoAktiv} onChange={(e) => setSowiesoAktiv(e.target.checked)} className="mt-0.5 accent-shiraz" />
                  <span>Gerüst/Putz fallen ohnehin an (Sowieso-Kosten, Kopplungsprinzip) – Amortisation nur auf die energiebedingten Mehrkosten beziehen.</span>
                </label>

              </div>

              {/* Ergebnisse & Prüfbericht (Rechts) */}
              <div className="lg:col-span-7 bg-slate-50 border border-home-grau/25 p-5 rounded-xl flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-text-main pb-2 border-b border-home-grau/20 flex items-center justify-between">
                    <span>Berechnungsbericht &amp; Amortisation</span>
                    <span className="text-xs font-mono text-slate-500 font-normal">G_t20/15 = {formatDeWert(hgtVal)} Kd/a · F_x = {formatDeZahl(simResults.fx, 1)} · η = {formatDeZahl(etaSys, 2)}</span>
                  </h4>
                  
                  {/* 4 Kennwerte */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Ausgangs-U</span>
                      <span className="font-mono font-bold text-sm text-text-main mt-0.5 block">{formatDeZahl(originalU, 2)}</span>
                      <span className="text-[9px] text-slate-400">W/(m²K)</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Neuer U-Wert</span>
                      <span className={`font-mono font-bold text-sm mt-0.5 block ${simResults.isCompliant ? 'text-emerald-700' : 'text-red-700'}`}>
                        {formatDeZahl(simResults.newU, 3)}
                      </span>
                      <span className="text-[9px] text-slate-400">W/(m²K)</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Kostenersparnis</span>
                      <span className="font-mono font-bold text-sm text-emerald-700 mt-0.5 block">
                        {formatDeZahl(simResults.annualEuroSaved, 0)} €/a
                      </span>
                      <span className="text-[9px] text-slate-400">~{formatDeZahl(simResults.annualKwhSaved, 0)} kWh/a</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Amortisation</span>
                      <span className="font-mono font-bold text-sm text-shiraz mt-0.5 block">
                        ~{formatDeZahl(simResults.amortizationYears, 1)} a
                      </span>
                      <span className="text-[9px] text-slate-400">auf {formatDeZahl(simResults.mehrkosten, 0)} € Mehrkosten</span>
                    </div>
                  </div>

                  {/* Detaillierte Formel-Zwischenschritte */}
                  <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 mt-4 space-y-1 text-xs">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">Physikalische Zwischenschritte (DIN EN ISO 6946):</span>
                    <div className="text-[11.5px] font-mono text-slate-700 space-y-1 overflow-x-auto py-1">
                      <div>R_Bestand = 1 / {formatDeZahl(originalU, 2)} = {formatDeZahl(simResults.R_orig, 3)} m²K/W</div>
                      <div>R_Dämmung = {formatDeWert(thicknessMm / 1000)} m / {formatDeWert(activeMaterial.wlg)} = {formatDeZahl(simResults.R_ins, 3)} m²K/W</div>
                      <div>R_Gesamt = {formatDeZahl(simResults.R_orig, 3)} + {formatDeZahl(simResults.R_ins, 3)} = {formatDeZahl(simResults.R_tot, 3)} m²K/W</div>
                      <div className="text-shiraz font-bold">U_neu = 1 / {formatDeZahl(simResults.R_tot, 3)} = {formatDeZahl(simResults.newU, 3)} W/(m²K)</div>
                    </div>
                  </div>
                </div>

                {/* Konformitäts-Ampel nach § 36 GModG */}
                <div className={`p-4 rounded-xl border ${
                  simResults.isCompliant 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs' 
                    : 'bg-red-50 border-red-300 text-red-950 shadow-xs'
                }`}>
                  <div className="flex items-start gap-3">
                    {simResults.isCompliant ? (
                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                    ) : (
                      <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
                    )}
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider">
                        {simResults.isCompliant 
                          ? `GMODG-KONFORM (§ 36 GModG eingehalten: U ≤ ${activeComponent.limitU} W/m²K)` 
                          : `GMODG-GRENZWERT ÜBERSCHRITTEN (Zulässig: U ≤ ${activeComponent.limitU} W/m²K)`}
                      </h4>
                      <p className="text-xs mt-1 opacity-90 leading-normal">
                        {simResults.isCompliant 
                          ? `Der berechnete U-Wert von ${formatDeZahl(simResults.newU, 3)} W/(m²K) unterschreitet den gesetzlichen Grenzwert von ${formatDeZahl(activeComponent.limitU, 2)} W/(m²K) für ${activeComponent.name}. Die Sanierung spart ca. ${formatDeZahl(simResults.annualCo2KgSaved, 0)} kg CO₂ pro Jahr ein.`
                          : `Achtung: Der Bauteil-U-Wert von ${formatDeZahl(simResults.newU, 3)} W/(m²K) liegt über dem Höchstwert von ${formatDeZahl(activeComponent.limitU, 2)} W/(m²K) nach § 36 GModG. Erhöhen Sie die Dämmstoffdicke um mindestens ${formatDeWert(simResults.dReqMm)} mm oder wählen Sie einen Dämmstoff mit geringerer Wärmeleitfähigkeit (z. B. WLG 032 oder 024).`
                        }
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 4: HEIZUNGSTECHNIK & BIO-TREPPE (GMODG) */}
        {activeTab === 'gebaeudetechnik' && (
          <div className="space-y-6 animate-in fade-in duration-200" id="content-technik">
            
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
              <h3 className="font-bold text-text-main flex items-center gap-1.5 text-base">
                <Leaf className="text-shiraz" size={20} /> Heizungstechnik, Bio-Treppe &amp; BEG-Förderung nach dem GModG
              </h3>
              <p className="text-xs text-text-main/70 mt-1 leading-relaxed">
                Mit dem Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026) ist die 65-%-EE-Pflicht des GEG 2024 für neue Heizungsanlagen 
                entfallen. Heizungen mit flüssigen oder gasförmigen Brennstoffen dürfen weiter neu eingebaut werden, müssen jedoch schrittweise 
                über die gesetzliche <strong>Bio-Treppe</strong> auf klimaneutrale Brennstoffe umgestellt werden. Wärmepumpen, Biomasse und Fernwärme 
                bleiben die technologisch zukunftssichersten und höchstgeförderten Optionen.
              </p>
            </div>

            {/* Die gesetzliche Bio-Treppe */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-text-main border-b border-home-grau/15 pb-2 flex items-center gap-2">
                <Zap size={16} className="text-shiraz" /> Die gesetzliche Bio-Treppe für Gas- &amp; Öl-Neuanlagen
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Wer nach dem 29.07.2026 eine neue Gas- oder Ölheizung einbaut, muss <strong>ab 2029</strong> sicherstellen, dass die bezogenen Brennstoffe 
                folgende Mindestanteile an erneuerbaren Energien (Biomethan, biogenes Flüssiggas, Wasserstoff) aufweisen:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Ab 2029</span>
                  <strong className="text-sm text-text-main block mt-1">mind. 10 %</strong>
                  <span className="text-[10px] text-slate-500">Erneuerbarer Brennstoff</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Ab 2030</span>
                  <strong className="text-sm text-text-main block mt-1">mind. 15 %</strong>
                  <span className="text-[10px] text-slate-500">Erneuerbarer Brennstoff</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Ab 2035</span>
                  <strong className="text-sm text-text-main block mt-1">mind. 30 %</strong>
                  <span className="text-[10px] text-slate-500">Erneuerbarer Brennstoff</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Ab 2040</span>
                  <strong className="text-sm text-text-main block mt-1">mind. 60 %</strong>
                  <span className="text-[10px] text-slate-500">Erneuerbarer Brennstoff</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">Ziel 2045</span>
                  <strong className="text-sm text-emerald-950 block mt-1">100 %</strong>
                  <span className="text-[10px] text-emerald-700">keine Stufe der Bio-Treppe – geplante Quote (§ 42a)</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-normal flex items-start gap-2">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                <div>
                  <strong>Wirtschaftliche Kostenfalle:</strong> Der Einbau fossiler Heizkessel birgt durch den nationalen CO₂-Preis (BEHG) 
                  und das europäische Emissionshandelssystem für Gebäude (EU-ETS 2, Start auf 2028 verschoben) sowie die knappen und teuren Biomethan-Kontingente 
                  ein hohes Risiko drastisch steigender Betriebskosten.
                </div>
              </div>
            </div>

            {/* Technologievergleich & BEG Förderung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-text-main border-b border-home-grau/15 pb-2">Erfüllungsoptionen im Überblick</h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={16} />
                    <div>
                      <strong>Elektrische Wärmepumpe (Luft/Wasser, Sole/Wasser):</strong> Hohe Jahresarbeitszahl (<InlineMath math="JAZ \ge 3{,}5" />). Optimal in Kombination mit Fußbodenheizung oder Niedertemperatur-Heizkörpern.
                    </div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={16} />
                    <div>
                      <strong>Wärmenetz / Fernwärmeanschluss:</strong> Vollständige Entlastung von eigener Heizanlagentechnik; Primärenergiefaktor abhängig vom Netzbetreiber.
                    </div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={16} />
                    <div>
                      <strong>Biomasse (Holzpellets / Scheitholz):</strong> Hohe Vorlauftemperaturen für ungedämmte Bestandsbauten; erfordert Feinstaubfilter und Pelletlagerraum.
                    </div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="text-shiraz shrink-0 mt-0.5" size={16} />
                    <div>
                      <strong>Hybrid-Heizung:</strong> Wärmepumpe zur Grundlastabdeckung (ca. 70–80 % der Heizstunden) kombiniert mit Spitzenlast-Gaskessel.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-text-main border-b border-home-grau/15 pb-2">BEG-Förderstruktur für Heizungstausch</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Über die Bundesförderung für effiziente Gebäude (KfW-Programm 458) werden Heizungstausche mit bis zu <strong>70 % Zuschuss</strong> gefördert:
                </p>
                <div className="space-y-1.5 text-xs text-text-main/80">
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg border">
                    <span>30 % Grundförderung</span>
                    <strong className="font-mono">für alle Eigentümer</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg border">
                    <span>+ 20 % Klimageschwindigkeitsbonus</span>
                    <strong className="font-mono">nur Selbstnutzer; Tausch von Öl-, Kohle-, Nachtspeicher- oder ≥ 20 Jahre alten Gas-/Biomasseheizungen (Konditionen vor Antragstellung bei KfW/BAFA prüfen)</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg border">
                    <span>+ 30 % Einkommensbonus</span>
                    <strong className="font-mono">Haushaltseinkommen ≤ 40.000 €/a</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg border">
                    <span>+ 5 % Effizienzbonus</span>
                    <strong className="font-mono">für Erdwärme oder natürliches Kältemittel (R290)</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-emerald-50 text-emerald-950 rounded-lg border border-emerald-300 font-bold">
                    <span>Maximaler Fördersatz:</span>
                    <span className="font-mono">70 % (max. 21.000 € Zuschuss auf 30.000 €)</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: SANIERUNGSFAHRPLAN (ISFP) */}
        {activeTab === 'isfp' && (
          <div className="space-y-6 animate-in fade-in duration-200" id="content-isfp">
            
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
              <h3 className="font-bold text-text-main flex items-center gap-1.5 text-base">
                <FileText className="text-shiraz" size={20} /> Der Individuelle Sanierungsfahrplan (iSFP)
              </h3>
              <p className="text-xs text-text-main/70 mt-1 leading-relaxed">
                Der <strong>Individuelle Sanierungsfahrplan (iSFP)</strong> nach BAFA-/DENA-Standard ist das zentrale Instrument für eine schrittweise, 
                wirtschaftlich und bauphysikalisch aufeinander abgestimmte Gesamtsanierung von Wohngebäuden. Er vermeidet Bauschäden durch falsche Sanierungsreihenfolgen 
                (z. B. Schimmelbildung nach dichtem Fenstertausch ohne Wanddämmung) und sichert finanzielle Förderboni.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-text-main border-b border-home-grau/15 pb-2">Die goldene Sanierungsregel: „Hülle vor Technik“</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Wird zuerst die Heizung dimensioniert und erst Jahre später die Gebäudehülle gedämmt, ist der neue Wärmeerzeuger anschließend 
                  massiv überdimensioniert. Dies führt zu taktendem Teillastbetrieb, verringerter Jahresarbeitszahl und vorzeitigem Verschleiß.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border flex items-start gap-2">
                    <span className="font-bold text-shiraz font-mono">1.</span>
                    <div><strong>Schritt 1: Oberste Geschossdecke &amp; Kellerdecke</strong> – Geringe Investition, sofort spürbare Heizkostenminderung.</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border flex items-start gap-2">
                    <span className="font-bold text-shiraz font-mono">2.</span>
                    <div><strong>Schritt 2: Außenwanddämmung &amp; Fenster</strong> – Absenkung der Heizlast um bis zu 50 %, warme Innenwandoberflächen gegen Schimmel.</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border flex items-start gap-2">
                    <span className="font-bold text-shiraz font-mono">3.</span>
                    <div><strong>Schritt 3: Heizungstausch auf Wärmepumpe</strong> – Präzise Auslegung auf die reduzierte Heizlast mit niedrigen Vorlauftemperaturen (<InlineMath math="\le 45^\circ\text{C}" />).</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-text-main border-b border-home-grau/15 pb-2">Der iSFP-Bonus in der Bundesförderung (BEG EM)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Für Maßnahmen an der Gebäudehülle (Dämmung, Fenstertausch, Lüftungsanlagen) bietet ein vorliegender iSFP erhebliche finanzielle Vorteile:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-rose-50/50 rounded-xl border border-shiraz/20">
                    <strong className="text-shiraz block mb-0.5">+ 5 % iSFP-Zuschussbonus</strong>
                    <span className="text-slate-700">Der Regelfördersatz für Hüllmaßnahmen steigt von 15 % auf <strong>20 % direkte Zuschussförderung</strong>.</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
                    <strong className="text-emerald-950 block mb-0.5">Verdopplung des Förderbudgets</strong>
                    <span className="text-emerald-900">Die maximal anrechenbaren Ausgaben pro Kalenderjahr steigen von 30.000 € auf <strong>60.000 € je Wohneinheit</strong> (max. 12.000 € Zuschuss/a statt 4.500 €).</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Structured Footer nach RULE[GEMINI_md] */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Erforderliche Dämmdicke für eine Außenwand nach § 36 GModG"
        zielGleichung="d_{erf} = \lambda \cdot \left(\frac{1}{U_{max}} - \frac{1}{U_{alt}}\right)"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Bestandswand U_alt = 1,40 W/(m²K); WDVS mit EPS 032; Höchstwert Anlage 7 Nr. 1: 0,24 W/(m²K).', formel: 'U_{alt} = 1{,}40,\\; \\lambda = 0{,}032,\\; U_{max} = 0{,}24' },
          { titel: 'Erforderlicher Zusatzwiderstand', erklaerung: 'Differenz der Gesamtwiderstände:', formel: '\\Delta R = \\frac{1}{0{,}24} - \\frac{1}{1{,}40} = 4{,}167 - 0{,}714 = 3{,}45\\,\\text{m}^2\\text{K/W}' },
          { titel: 'Dämmdicke', erklaerung: 'Mindestdicke und gewählte Lieferdicke:', formel: 'd_{erf} = 3{,}45 \\cdot 0{,}032 = 0{,}110\\,\\text{m} \\Rightarrow \\text{gewählt } 14\\,\\text{cm}' },
          { titel: 'Kontrolle', erklaerung: 'U-Wert mit 14 cm:', formel: 'U = \\frac{1}{0{,}714 + 0{,}14/0{,}032} = \\frac{1}{5{,}09} = 0{,}20\\,\\text{W/(m}^2\\text{K)} \\le 0{,}24' }
        ]}
        ergebnisHinweis="Die Pflicht greift nur, wenn mehr als 10 % der Bauteilfläche geändert werden. Die Berechnung berücksichtigt neue und vorhandene Schichten (§ 37 GModG)."
        normQuelle="GModG §§ 36, 37 und Anlage 7 (Lesefassung Stand 29.07.2026); DIN EN ISO 6946"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Energieeinsparung und Amortisation der Fassadendämmung"
        zielGleichung="\Delta Q_E = \frac{\Delta U \cdot A \cdot F_x \cdot G_{t20/15} \cdot 24}{1000 \cdot \eta_{sys}}"
        schritte={[
          { titel: 'Einsparung', erklaerung: 'ΔU = 1,40 − 0,197 = 1,20 W/(m²K), A = 160 m², F_x = 1,0, G = 3 500 Kd/a, η = 0,90:', formel: '\\Delta Q_E = \\frac{1{,}20 \\cdot 160 \\cdot 3\\,500 \\cdot 24}{1\\,000 \\cdot 0{,}90} = 17\\,970\\,\\text{kWh/a}' },
          { titel: 'Kosten', erklaerung: 'Energiepreis 0,12 €/kWh; Vollkosten 16 400 € (Dämmstoff 14 cm EPS 032 und 85 €/m² für Gerüst, Armierung, Putz):', formel: '17\\,970 \\cdot 0{,}12 = 2\\,156\\,\\text{€/a}' },
          { titel: 'Statische Amortisation', erklaerung: 'Vollkosten bzw. nur energiebedingte Mehrkosten, wenn Gerüst und Putz ohnehin anfallen (Kopplungsprinzip):', formel: 't = \\frac{16\\,400}{2\\,156} = 7{,}6\\,\\text{a}, \\qquad t_{Kopplung} = \\frac{2\\,800}{2\\,156} = 1{,}3\\,\\text{a}' }
        ]}
        ergebnisHinweis="Die Kopplung an ohnehin nötige Instandsetzungen macht Dämmung hoch wirtschaftlich. Rebound- und Prebound-Effekte können die reale Einsparung deutlich verändern."
        normQuelle="VDI 4710 / VDI 2067; F_x nach DIN V 4108-6"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="modernisierung" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 8 Bestand: GModG-Paragrafen §§ 35–37, Anlage 7 und Bio-Treppe gegen die Lesefassung geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: "Gebäudeenergiegesetz", url: "https://de.wikipedia.org/wiki/Geb%C3%A4udeenergiegesetz" },
          { title: "Wärmedurchgangskoeffizient", url: "https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient" },
          { title: "Wärmedämmung", url: "https://de.wikipedia.org/wiki/W%C3%A4rmed%C3%A4mmung" },
          { title: "Wärmepumpe", url: "https://de.wikipedia.org/wiki/W%C3%A4rmepumpe" }
        ]} 
        literatur={[
          "Hens, H.: Applied Building Physics – Ambient Conditions, Building Performance and Material Properties. 2. Aufl., Berlin: Ernst & Sohn 2016"
        ]} 
        regelwerke={[
          { title: "Gebäudemodernisierungsgesetz (GModG, vormals GEG; geändert und umbenannt durch Gesetz vom 23.07.2026, BGBl. 2026 I Nr. 226, verkündet 28.07.2026) – Nachrüstung § 35, Änderung § 36, U-Wert-Berechnung § 37, Anlage 7", url: "https://www.gesetze-im-internet.de/geg/" },
          { title: "DIN EN ISO 6946:2018-03 (Wärmedurchlasswiderstand und Wärmedurchgangskoeffizient)" },
          { title: "DIN 4108-2 (Mindestanforderungen an den Wärmeschutz; Neuausgabe 2026-05, bisher 2013-02)" },
          { title: "DIN V 18599:2018-09 (Energetische Bewertung von Gebäuden; im GModG referenziert, Nachfolge DIN/TS 18599 seit 2025-10)" }
        ]} 
        formeln={[
          {
            formel: "R_T = R_{si} + \\sum_{i=1}^{n} \\frac{d_i}{\\lambda_i} + R_{se}",
            erklaerung: "Gesamtwärmedurchgangswiderstand eines mehrschichtigen Außenbauteils (R_si: innerer, R_se: äußerer Wärmeübergangswiderstand).",
            quelle: "DIN EN ISO 6946"
          },
          {
            formel: "U = \\frac{1}{R_T} \\quad \\le U_{\\text{max, GModG}}",
            erklaerung: "Wärmedurchgangskoeffizient des Bauteils und Abgleich mit dem Grenzwert nach § 36 GModG (z.B. 0,24 W/(m²K) für Außenwände).",
            quelle: "DIN EN ISO 6946 / § 36 GModG"
          },
          {
            formel: "\\Delta Q_E = \\frac{\\Delta U \\cdot A \\cdot F_x \\cdot G_{t20/15} \\cdot 24}{1000 \\cdot \\eta_{sys}} \\quad [\\text{kWh/a}]",
            erklaerung: "Endenergieeinsparung über die Gradtagzahl G_t20/15 (Kd/a) mit Temperatur-Korrekturfaktor F_x und Anlagennutzungsgrad η_sys.",
            quelle: "VDI 4710 / DWD-Gradtagzahlen; F_x nach DIN V 4108-6"
          },
          {
            formel: "t_{\\text{Amort}} = \\frac{\\text{Investitionserstkosten [€]}}{\\text{Jährliche Energiekosteneinsparung [€/a]}}",
            erklaerung: "Statische Amortisationsdauer einer energetischen Modernisierungsmaßnahme.",
            quelle: "VDI 2067"
          }
        ]} 
      />
    </div>
  );
}
