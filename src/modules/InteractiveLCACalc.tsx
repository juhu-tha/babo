import React, { useState, useMemo } from "react";
import { ModuleFooter } from "@/src/components/ui/ModuleFooter";
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { InlineMath, BlockMath } from "react-katex";
import { InfoTooltip } from "@/src/components/ui/InfoTooltip";
import { 
  Calculator, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Info, 
  Building2, 
  Truck, 
  Activity, 
  ArrowRight, 
  Recycle,
  SlidersHorizontal,
  Layers
} from "lucide-react";
import { MATERIAL_DATABASE, CustomRow, ScenarioPreset, PRESETS } from './interactivelcacalc/daten';
import { CalculationDashboard } from './interactivelcacalc/CalculationDashboard';
import { ModulDLabor } from './interactivelcacalc/ModulDLabor';

export default function InteractiveLCACalc() {
  const [calcView, setCalcView] = useState<'konfigurator' | 'modul_d_labor' | 'vergleich'>('konfigurator');
  const [buildingType, setBuildingType] = useState<"wohnbau" | "nichtwohnbau">("wohnbau");
  const [rows, setRows] = useState<CustomRow[]>([
    { id: "1", materialId: "beton-cem1", quantity: 24, circularQuota: 65, sortingRate: 85, recoveryType: "downcycling" },
    { id: "2", materialId: "ziegel", quantity: 38, circularQuota: 55, sortingRate: 75, recoveryType: "downcycling" },
    { id: "3", materialId: "baustahl", quantity: 1.8, circularQuota: 95, sortingRate: 95, recoveryType: "high_grade" },
    { id: "4", materialId: "eps-daemmung", quantity: 12, circularQuota: 25, sortingRate: 60, recoveryType: "thermal" }
  ]);
  
  const [transportDistance, setTransportDistance] = useState<number>(120);
  const [transportType, setTransportType] = useState<"lkw" | "bahn">("lkw");
  const [buildingArea, setBuildingArea] = useState<number>(140);
  const [studyPeriod, setStudyPeriod] = useState<number>(50); // 50 Jahre nach DIN EN 15978 / QNG  // QNG-Anforderungswerte: Wohngebäude WG23 (QNG-Handbuch Anlage 3, v1.4, 19.07.2024):
  // QNG-PLUS <= 24, QNG-PREMIUM <= 20 kg CO2-Äq./(m² NRF·a) über 50 Jahre.
  // Nichtwohngebäude: projektspezifischer Anforderungswert – hier nur didaktischer Lehrwert.
  const qngThresholds = useMemo(() => {
    if (buildingType === "wohnbau") {
      return {
        plus: 24.0,
        premium: 20.0,
        label: "Wohngebäude (WG23)",
        areaUnit: "m² NRF"
      };
    } else {
      return {
        plus: 32.0,
        premium: 26.0,
        label: "Nichtwohngebäude (Lehrwert; QNG: projektspezifisch)",
        areaUnit: "m² NRF"
      };
    }
  }, [buildingType]);

  // Load a preset
  const loadPreset = (preset: ScenarioPreset) => {
    const newRows: CustomRow[] = preset.rows.map((row, idx) => {
      const mat = MATERIAL_DATABASE.find(m => m.id === row.materialId);
      return {
        id: String(idx + 1),
        materialId: row.materialId,
        quantity: row.quantity,
        circularQuota: row.circularQuota ?? mat?.defaultCircularQuota ?? 70,
        sortingRate: row.sortingRate ?? 85,
        recoveryType: row.recoveryType ?? mat?.defaultRecoveryType ?? "high_grade"
      };
    });
    setRows(newRows);
    setBuildingArea(preset.bgf);
    setBuildingType(preset.buildingType);
  };

  // Add material row
  const addRow = () => {
    const newId = String(Date.now());
    const defaultMat = MATERIAL_DATABASE.find(m => m.id === "beton-cem3") || MATERIAL_DATABASE[0];
    setRows([...rows, { 
      id: newId, 
      materialId: defaultMat.id, 
      quantity: 10,
      circularQuota: defaultMat.defaultCircularQuota,
      sortingRate: 85,
      recoveryType: defaultMat.defaultRecoveryType
    }]);
  };

  // Remove material row
  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows(rows.filter(row => row.id !== id));
  };

  // Update row
  const updateRow = (id: string, updates: Partial<Omit<CustomRow, "id">>) => {
    setRows(rows.map(row => {
      if (row.id !== id) return row;
      const updated = { ...row, ...updates };
      // If materialId changed, adapt defaults if not explicitly customized
      if (updates.materialId && updates.materialId !== row.materialId) {
        const newMat = MATERIAL_DATABASE.find(m => m.id === updates.materialId);
        if (newMat) {
          updated.circularQuota = newMat.defaultCircularQuota;
          updated.recoveryType = newMat.defaultRecoveryType;
        }
      }
      return updated;
    }));
  };

  // Set global circular quota preset for all rows
  const setGlobalModulDStrategy = (strategy: 'linear' | 'standard' | 'selective' | 'pioneer') => {
    setRows(rows.map(row => {
      const mat = MATERIAL_DATABASE.find(m => m.id === row.materialId);
      if (!mat) return row;

      if (strategy === 'linear') {
        return {
          ...row,
          circularQuota: Math.min(25, mat.defaultCircularQuota * 0.4),
          sortingRate: 50,
          recoveryType: 'downcycling'
        };
      } else if (strategy === 'standard') {
        return {
          ...row,
          circularQuota: mat.defaultCircularQuota,
          sortingRate: 85,
          recoveryType: mat.defaultRecoveryType
        };
      } else if (strategy === 'selective') {
        return {
          ...row,
          circularQuota: Math.min(100, Math.round(mat.defaultCircularQuota * 1.15)),
          sortingRate: 95,
          recoveryType: mat.defaultRecoveryType === 'downcycling' ? 'high_grade' : mat.defaultRecoveryType
        };
      } else {
        // pioneer
        return {
          ...row,
          circularQuota: Math.min(100, Math.max(90, mat.defaultCircularQuota * 1.3)),
          sortingRate: 98,
          recoveryType: (mat.category.includes('Holz') || mat.category.includes('Natur')) ? 'reuse' : 'high_grade'
        };
      }
    }));
  };

  // Main Calculation Engine with Dynamic Modul D
  const results = useMemo(() => {
    let totalWeightTons = 0;
    let totalCircularWeightTons = 0;
    let gwpA1A3 = 0;
    let gwpBioStorageInstalled = 0;
    let gwpC = 0;
    let gwpD = 0;
    let weightedUmiSum = 0;
    let totalPenrtMj = 0;

    const factorTransport = transportType === "lkw" ? 0.15 : 0.03;

    // Detailed per-row breakdown for Modul D mask
    const rowModulDDetails: {
      rowId: string;
      matName: string;
      category: string;
      unit: string;
      qty: number;
      weightTons: number;
      circularQuota: number;
      sortingRate: number;
      recoveryType: string;
      circularMassTons: number;
      effectiveRecoveredMassTons: number;
      rowGwpD: number;
      substitutesPrimary: string;
    }[] = [];

    rows.forEach(row => {
      const mat = MATERIAL_DATABASE.find(m => m.id === row.materialId);
      if (!mat) return;
      const qty = row.quantity;

      // Weight calculation
      let weightTons = 0;
      if (mat.unit === "m³") {
        weightTons = (qty * mat.densityKg) / 1000;
      } else {
        weightTons = qty;
      }
      totalWeightTons += weightTons;

      // Manufacturing (A1-A3)
      gwpA1A3 += qty * mat.gwpA1A3;

      // Biogenic carbon storage
      if (mat.biogenicContent > 0) {
        gwpBioStorageInstalled += qty * mat.biogenicContent;
      }

      // End of life (C3/C4)
      gwpC += qty * mat.gwpC;

      // --- DYNAMISCHE MODUL-D-BERECHNUNG ---
      const circularFraction = (row.circularQuota ?? mat.defaultCircularQuota) / 100;
      const sortingFraction = (row.sortingRate ?? 85) / 100;
      const circularMassTons = weightTons * circularFraction;
      const effectiveRecoveredMassTons = circularMassTons * sortingFraction;
      totalCircularWeightTons += effectiveRecoveredMassTons;

      // Recovery factor depending on pathway
      let recoveryFactor = 1.0;
      if (row.recoveryType === 'reuse') {
        recoveryFactor = 1.45; // 1:1 Wiederverwendung spart praktisch den gesamten Neubaustoff ein
      } else if (row.recoveryType === 'high_grade') {
        recoveryFactor = 1.0; // Hochwertiges Recycling (EPD Standard)
      } else if (row.recoveryType === 'downcycling') {
        recoveryFactor = 0.55; // Kaskade / Schotterersatz
      } else if (row.recoveryType === 'thermal') {
        recoveryFactor = 0.85; // Energetische Verwertung
      }

      // Scale reference EPD Modul D by user's circular quota & sorting rate
      const refQuota = Math.max(10, mat.defaultCircularQuota);
      const rowGwpD = (qty * mat.gwpD * (row.circularQuota / refQuota) * (row.sortingRate / 85)) * recoveryFactor;
      gwpD += rowGwpD;

      rowModulDDetails.push({
        rowId: row.id,
        matName: mat.name,
        category: mat.category,
        unit: mat.unit,
        qty,
        weightTons,
        circularQuota: row.circularQuota,
        sortingRate: row.sortingRate,
        recoveryType: row.recoveryType,
        circularMassTons,
        effectiveRecoveredMassTons,
        rowGwpD,
        substitutesPrimary: mat.substitutesPrimary
      });

      // Urban Mining Index weighting
      const dynamicUmi = Math.min(100, Math.round((row.circularQuota * 0.7) + (row.sortingRate * 0.3)));
      weightedUmiSum += weightTons * dynamicUmi;

      // Primary Energy Non-Renewable (PENRT)
      totalPenrtMj += qty * mat.penrt;
    });

    // Transport A4
    const gwpA4 = totalWeightTons * transportDistance * factorTransport;

    // Normative compliance value (Modules A-C according to DIN EN 15978 / QNG)
    const gwpAC = gwpA1A3 + gwpA4 + gwpC;
    const gwpPerSqmYearAC = gwpAC / (buildingArea * studyPeriod);

    // Net value including Modul D recycling credits
    const totalGwpNet = gwpAC + gwpD;
    const gwpPerSqmYearNet = totalGwpNet / (buildingArea * studyPeriod);

    // Specific Modul D impact per m2*year
    const gwpPerSqmYearD = gwpD / (buildingArea * studyPeriod);

    // Weighted Urban Mining Index (%)
    const weightedUmi = totalWeightTons > 0 ? Math.round(weightedUmiSum / totalWeightTons) : 0;

    // Overall circularity rate of the building (%)
    const overallCircularityRate = totalWeightTons > 0 ? (totalCircularWeightTons / totalWeightTons) * 100 : 0;

    // Primary energy per m2*year in kWh (1 kWh = 3.6 MJ)
    const penrtKwhPerSqmYear = (totalPenrtMj / (buildingArea * studyPeriod)) / 3.6;

    return {
      totalWeightTons,
      totalCircularWeightTons,
      overallCircularityRate,
      gwpA1A3,
      gwpBioStorageInstalled,
      gwpA4,
      gwpC,
      gwpD,
      gwpAC,
      gwpPerSqmYearAC,
      totalGwpNet,
      gwpPerSqmYearNet,
      gwpPerSqmYearD,
      weightedUmi,
      totalPenrtMj,
      penrtKwhPerSqmYear,
      rowModulDDetails
    };
  }, [rows, transportDistance, transportType, buildingArea, studyPeriod]);

  // QNG Benchmark Status Evaluation
  const benchmarkStatus = useMemo(() => {
    const valAC = results.gwpPerSqmYearAC;
    const { plus, premium } = qngThresholds;

    if (valAC <= premium) {
      return {
        label: "unter QNG-PREMIUM-Anforderungswert (orientierend)",
        color: "text-emerald-700 border-emerald-300 bg-emerald-50/70",
        badge: "bg-emerald-600 text-white",
        desc: `Orientierend sehr gut. Der vereinfachte Wert von ${formatDeZahl(valAC, 2)} kg CO₂-eq/(m²a) unterschreitet den Schwellenwert von ${formatDeZahl(premium, 1)} kg CO₂-eq/(m²a) deutlich. Für einen QNG-Nachweis ist eine vollständige Bilanz nach QNG-Bilanzierungsregeln (inkl. B4 und B6) nötig.`
      };
    } else if (valAC <= plus) {
      return {
        label: "unter QNG-PLUS-Anforderungswert (orientierend)",
        color: "text-teal-700 border-teal-300 bg-teal-50/70",
        badge: "bg-teal-600 text-white",
        desc: `Orientierend gut. Der vereinfachte Wert von ${formatDeZahl(valAC, 2)} kg CO₂-eq/(m²a) liegt unter dem Anforderungswert von ${formatDeZahl(plus, 1)} kg CO₂-eq/(m²a). Eine Förderberechtigung ergibt sich erst aus einem vollständigen QNG-Nachweis.`
      };
    } else {
      return {
        label: "Standard-Neubau ⚙️",
        color: "text-amber-700 border-amber-300 bg-amber-50/70",
        badge: "bg-amber-600 text-white",
        desc: `Der berechnete Treibhausgaswert von ${formatDeZahl(valAC, 2)} kg CO₂-eq/(m²a) liegt über dem QNG-PLUS Grenzwert (${formatDeZahl(plus, 1)} kg CO₂-eq/(m²a)). Ersetzen Sie CEM I-Beton und EPS durch CEM III/A, RC-Beton, Lehm oder Holzbau, um Förderniveau zu erreichen.`
      };
    }
  }, [results.gwpPerSqmYearAC, qngThresholds]);

  // Dynamic Comparison Variants
  const variants = useMemo(() => {
    const factorTransport = transportType === "lkw" ? 0.15 : 0.03;

    const calcGwpAC = (rowList: { id: string; qty: number }[]) => {
      let weightTons = 0;
      let a1a3 = 0;
      let eol = 0;

      rowList.forEach(r => {
        const m = MATERIAL_DATABASE.find(mat => mat.id === r.id);
        if (!m) return;
        const w = m.unit === "m³" ? (r.qty * m.densityKg) / 1000 : r.qty;
        weightTons += w;
        a1a3 += r.qty * m.gwpA1A3;
        eol += r.qty * m.gwpC;
      });

      const a4 = weightTons * transportDistance * factorTransport;
      return (a1a3 + a4 + eol) / (buildingArea * studyPeriod);
    };

    const gwpVar1 = calcGwpAC([
      { id: "beton-cem1", qty: 36 },
      { id: "ziegel", qty: 45 },
      { id: "baustahl", qty: 2.5 },
      { id: "eps-daemmung", qty: 16 }
    ]);

    const gwpVar2 = calcGwpAC([
      { id: "beton-cem3", qty: 22 },
      { id: "rc-beton", qty: 16 },
      { id: "ziegel", qty: 40 },
      { id: "baustahl", qty: 2.2 },
      { id: "zellulose", qty: 20 }
    ]);

    const gwpVar3 = calcGwpAC([
      { id: "beton-cem3", qty: 10 },
      { id: "hbv-decke", qty: 18 },
      { id: "clt", qty: 22 },
      { id: "kvh", qty: 6 },
      { id: "baustahl", qty: 0.8 },
      { id: "holzfaser-daemmung", qty: 18 }
    ]);

    const gwpVar4 = calcGwpAC([
      { id: "schaumglas", qty: 25 },
      { id: "kvh", qty: 14 },
      { id: "lehm-bauplatte", qty: 15 },
      { id: "hanfkalk", qty: 24 },
      { id: "strohballen", qty: 20 },
      { id: "baustahl", qty: 0.3 }
    ]);

    const rate = (v: number) => {
      if (v <= qngThresholds.premium) return "≤ PREMIUM-Wert (orientierend)";
      if (v <= qngThresholds.plus) return "≤ PLUS-Wert (orientierend)";
      return "Standard ⚙️";
    };

    return [
      {
        id: "var1",
        name: "Variante I: Konventioneller Massivbau",
        description: "CEM I Normalbeton, Hintermauerziegel, EPS-Dämmung.",
        gwp: gwpVar1,
        colorClass: "bg-rose-600",
        rating: rate(gwpVar1),
        reductionPct: 0
      },
      {
        id: "var2",
        name: "Variante II: Klinkeroptimierter Massivbau",
        description: "CEM III/A Hüttensandzement, RC-Beton, Zellulosedämmung.",
        gwp: gwpVar2,
        colorClass: "bg-amber-600",
        rating: rate(gwpVar2),
        reductionPct: gwpVar1 > 0 ? Math.round(((gwpVar1 - gwpVar2) / gwpVar1) * 100) : 0
      },
      {
        id: "var3",
        name: "Variante III: Moderner Holz-Hybridbau",
        description: "CLT-Wände, HBV-Decken, druckfeste Holzfaserdämmung.",
        gwp: gwpVar3,
        colorClass: "bg-emerald-600",
        rating: rate(gwpVar3),
        reductionPct: gwpVar1 > 0 ? Math.round(((gwpVar1 - gwpVar3) / gwpVar1) * 100) : 0
      },
      {
        id: "var4",
        name: "Variante IV: Zirkulärer Lehm- & Naturbaustoffbau",
        description: "Lehmbauplatten, Hanfkalk, Stroh und Schaumglasschotter.",
        gwp: gwpVar4,
        colorClass: "bg-teal-600",
        rating: rate(gwpVar4),
        reductionPct: gwpVar1 > 0 ? Math.round(((gwpVar1 - gwpVar4) / gwpVar1) * 100) : 0
      },
      {
        id: "active",
        name: "Ihr aktueller Entwurf (Benutzerdefiniert)",
        description: "Dynamisch aus Ihrer Baustofftabelle berechneter QNG-Nachweiswert (Module A-C).",
        gwp: results.gwpPerSqmYearAC,
        colorClass: "bg-shiraz",
        rating: rate(results.gwpPerSqmYearAC),
        reductionPct: gwpVar1 > 0 ? Math.round(((gwpVar1 - results.gwpPerSqmYearAC) / gwpVar1) * 100) : 0
      }
    ];
  }, [results.gwpPerSqmYearAC, transportDistance, transportType, buildingArea, studyPeriod, qngThresholds]);

  return (
    <div className="space-y-6 font-normal">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Calculator className="text-shiraz shrink-0" /> 
            Interaktiver Ökobilanz-Rechner (LCA, QNG 2026 &amp; Modul D)
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-2">
            <p>
              Ganzheitliche Lebenszyklusanalyse nach <strong>DIN EN 15978</strong> (Gebäude), <strong>DIN EN 17472</strong> (Infrastruktur) und <strong>DIN EN 15804+A2</strong>. Berechnen Sie das Treibhauspotenzial (Module A1–C), prüfen Sie die <strong>QNG-2026-Grenzwerte</strong> und analysieren Sie in der <strong>Modul-D-Eingabemaske</strong> dynamisch alle Zirkularitäts-Gutschriften und kreislauffähigen Stoffanteile nach <strong>VDI 6210 / DIN SPEC 91484</strong>.
            </p>
          </div>
        </div>
        <div className="flex md:flex-col gap-2 shrink-0">
          <button 
            onClick={() => {
              setBuildingType("wohnbau");
              setRows([
                { id: "1", materialId: "beton-cem1", quantity: 24, circularQuota: 65, sortingRate: 85, recoveryType: "downcycling" },
                { id: "2", materialId: "ziegel", quantity: 38, circularQuota: 55, sortingRate: 75, recoveryType: "downcycling" },
                { id: "3", materialId: "baustahl", quantity: 1.8, circularQuota: 95, sortingRate: 95, recoveryType: "high_grade" },
                { id: "4", materialId: "eps-daemmung", quantity: 12, circularQuota: 25, sortingRate: 60, recoveryType: "thermal" }
              ]);
              setTransportDistance(120);
              setTransportType("lkw");
              setBuildingArea(140);
              setStudyPeriod(50);
            }} 
            className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-50 border border-home-grau/30 hover:border-slate-400 py-2 px-3.5 rounded-xl text-slate-700 transition cursor-pointer font-bold"
            title="Werte auf Initialzustand zurücksetzen"
          >
            <RotateCcw size={14} /> Rechner Reset
          </button>
        </div>
      </div>

      {/* Main View Mode Selector (Konfigurator vs. Modul D Eingabemaske vs. Szenarien-Vergleich) */}
      <div className="bg-white p-2 rounded-2xl border border-home-grau/30 shadow-xs flex flex-wrap gap-2">
        {[
          { id: 'konfigurator' as const, label: '1. Baustoffe, Massen & Logistik (A1–C4)', icon: Layers, badge: `${rows.length} Baustoffe` },
          { id: 'modul_d_labor' as const, label: '2. Eingabemaske Modul D: Kreislauf & Gutschriften', icon: Recycle, badge: `${formatDeZahl(results.overallCircularityRate, 0)}% Zirkulär` },
          { id: 'vergleich' as const, label: '3. QNG-Benchmark & Szenarienvergleich', icon: Activity, badge: benchmarkStatus.label.split(' ')[0] }
        ].map((v) => {
          const Icon = v.icon;
          const isActive = calcView === v.id;
          return (
            <button aria-pressed={isActive}
              key={v.id}
              onClick={() => setCalcView(v.id)}
              className={`flex-1 min-w-[200px] p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                isActive
                  ? 'bg-shiraz text-white border-shiraz shadow-xs'
                  : 'bg-white text-slate-700 border-home-grau/30 hover:bg-off-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className={isActive ? 'text-white' : 'text-shiraz'} />
                <span>{v.label}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {v.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Building Type Switch & QNG Benchmark Selection */}
      <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
            <Building2 size={15} className="text-shiraz" />
            Gebäudekategorie (QNG 2026):
          </span>
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setBuildingType("wohnbau")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                buildingType === "wohnbau"
                  ? "bg-shiraz text-white shadow-xs"
                  : "text-text-main/70 hover:text-shiraz"
              }`}
            >
              Wohngebäude (WG)
            </button>
            <button
              onClick={() => setBuildingType("nichtwohnbau")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                buildingType === "nichtwohnbau"
                  ? "bg-shiraz text-white shadow-xs"
                  : "text-text-main/70 hover:text-shiraz"
              }`}
            >
              Nichtwohngebäude (NWG)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-text-main/70">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            PREMIUM &le; {formatDeZahl(qngThresholds.premium, 1)} kg/(m²·a)
          </span>
          <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold border border-teal-200">
            PLUS &le; {formatDeZahl(qngThresholds.plus, 1)} kg/(m²·a)
          </span>
        </div>
      </div>

      {/* Quick Presets / Click-Scenarios */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block">
          Lern-Szenarien laden (Vergleich konventionell vs. zirkulär):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((p, idx) => (
            <div 
              key={idx}
              onClick={() => loadPreset(p)}
              className={`p-3.5 rounded-xl border ${p.bgClass} ${p.bgDarkClass} flex flex-col justify-between cursor-pointer hover:shadow-md transition duration-200`}
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-start gap-1">
                  <strong className="text-xs font-bold text-slate-900 block leading-tight">{p.name}</strong>
                </div>
                <span className="inline-block text-[9px] font-bold font-mono bg-white rounded border px-1.5 py-0.5 shadow-2xs text-slate-600">
                  {p.badge}
                </span>
                <p className="text-[10.5px] text-slate-500 leading-snug line-clamp-2">{p.description}</p>
              </div>
              <div className="mt-2.5 flex items-center gap-1 text-[10px] text-shiraz font-bold">
                <span>Simulieren</span> <ArrowRight size={11} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN VIEW 1: MATERIAL MASSES & LOGISTICS */}
      {calcView === 'konfigurator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
          {/* Left Inputs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Material Rows Setup */}
            <div className="bg-white border border-home-grau/30 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">
                    1. Verbaute Baustoffmassen &amp; direkte Zirkularität
                  </span>
                  <span className="text-xs text-slate-500">
                    Wählen Sie Baustoffe, Mengen und passen Sie den kreislauffähigen Stoffanteil direkt an.
                  </span>
                </div>
                <button 
                  onClick={addRow}
                  className="flex items-center gap-1 text-xs bg-shiraz text-white font-bold px-3 py-1.5 rounded-lg hover:bg-shiraz/90 shadow transition cursor-pointer"
                >
                  <Plus size={14} /> Baustoff hinzufügen
                </button>
              </div>

              {/* Material Rows Table */}
              <div className="space-y-3">
                {rows.map((row) => {
                  const currentMat = MATERIAL_DATABASE.find(m => m.id === row.materialId);
                  return (
                    <div key={row.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex-1 w-full">
                          <select
                            value={row.materialId}
                            onChange={(e) => updateRow(row.id, { materialId: e.target.value })}
                            className="w-full text-xs font-semibold p-2 bg-white border border-home-grau/30 rounded-lg focus:ring-1 focus:ring-shiraz focus:outline-none cursor-pointer"
                          >
                            {MATERIAL_DATABASE.map(m => (
                              <option key={m.id} value={m.id}>
                                {m.name} [{m.category}] ({m.unit})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <div className="flex items-center gap-1.5 bg-white border border-home-grau/30 px-2 py-1.5 rounded-lg">
                            <input 
                              type="number"
                              min="0.1"
                              step="0.5"
                              value={row.quantity}
                              onChange={(e) => updateRow(row.id, { quantity: Math.max(0.1, parseFloat(e.target.value) || 0) })}
                              className="w-16 text-xs font-bold text-right font-mono focus:outline-none"
                            />
                            <span className="text-xs text-slate-500 font-mono font-semibold">{currentMat?.unit}</span>
                          </div>

                          <button 
                            onClick={() => removeRow(row.id)}
                            disabled={rows.length <= 1}
                            className="p-2 border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg transition disabled:opacity-30 cursor-pointer"
                            title="Zeile entfernen"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Quick Inline Slider for kreislauffähiger Stoffanteil */}
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <Recycle size={13} className="text-teal-600" />
                            Kreislauffähiger Stoffanteil:
                            <InfoTooltip text="Anteil des Baustoffs, der am Lebensende stofflich oder hochwertig im Sinne der Zirkularität (Modul D) wiederverwertet oder rezykliert werden kann." />
                          </span>
                          <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {formatDeZahl(row.circularQuota, 0)} %
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={row.circularQuota}
                            onChange={(e) => updateRow(row.id, { circularQuota: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                          />
                          <button
                            type="button"
                            onClick={() => setCalcView('modul_d_labor')}
                            className="shrink-0 text-[10px] text-shiraz hover:underline font-bold flex items-center gap-0.5"
                          >
                            <span>Details</span> <ArrowRight size={10} />
                          </button>
                        </div>
                      </div>

                      {currentMat && (
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 border-t border-slate-200/60 pt-1.5 font-mono">
                          <div className="flex items-center gap-2">
                            <span>A1-A3: <strong className={currentMat.gwpA1A3 < 0 ? "text-emerald-700" : "text-slate-800"}>{formatDeZahl(currentMat.gwpA1A3, 0)} kg CO₂</strong></span>
                            <span>·</span>
                            <span>EoL C: <strong className="text-slate-800">+{formatDeZahl(currentMat.gwpC, 0)} kg</strong></span>
                            <span>·</span>
                            <span>Modul D: <strong className="text-teal-700">{formatDeZahl(currentMat.gwpD, 0)} kg</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-bold">UMI: {formatDeZahl(currentMat.umiScore, 0)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transport & Building Area Setup */}
            <div className="bg-white border border-home-grau/30 rounded-2xl p-4 md:p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phase A4: Transport */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono border-b pb-1">
                  2. Phase A4: Logistik-Transport
                </span>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Truck size={13} className="text-amber-500" /> Distanz zur Baustelle:
                    </span>
                    <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border">{formatDeZahl(transportDistance, 0)} km</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="800"
                    step="10"
                    value={transportDistance}
                    onChange={(e) => setTransportDistance(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>10 km (Regional)</span>
                    <span>800 km (Überregional)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] pt-1">
                    {[
                      { id: "lkw" as const, label: "🚛 LKW Diesel", desc: "0,15 kg CO₂/t·km" },
                      { id: "bahn" as const, label: "🚊 Güterzug", desc: "0,03 kg CO₂/t·km" }
                    ].map((trans) => (
                      <button aria-pressed={transportType === trans.id}
                        key={trans.id}
                        onClick={() => setTransportType(trans.id)}
                        className={`p-2 rounded-lg border transition-all cursor-pointer ${
                          transportType === trans.id
                            ? "bg-shiraz/10 border-shiraz text-shiraz font-bold"
                            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <span className="block font-bold">{trans.label}</span>
                        <span className="text-[9px] text-slate-400">{trans.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Building Area (BGF) & Study Period */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono border-b pb-1">
                  3. Bezugsfläche &amp; Normzeitraum
                </span>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Building2 size={13} className="text-indigo-600" /> Netto-Raumfläche (NRF):
                    </span>
                    <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border">{formatDeZahl(buildingArea, 0)} m²</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="1200"
                    step="10"
                    value={buildingArea}
                    onChange={(e) => setBuildingArea(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>30 m²</span>
                    <span>1.200 m²</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[10px] text-slate-600 leading-relaxed space-y-1">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Info size={12} className="text-indigo-600" />
                      <span>Normative Berechnung nach DIN EN 15978 / DIN EN 17472</span>
                    </div>
                    <p>
                      Betrachtungszeitraum: <strong>{formatDeZahl(studyPeriod, 0)} Jahre</strong>. Die Umweltlasten werden auf 1 Jahr und 1 m² Netto-Raumfläche (NRF nach DIN 277) normiert: <strong className="font-mono text-slate-800">kg CO₂-eq / (m²·a)</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Dashboard / Results (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <CalculationDashboard results={results} qngThresholds={qngThresholds} benchmarkStatus={benchmarkStatus} />
          </div>
        </div>
      )}

      {/* MAIN VIEW 2: DEDICATED MODUL D & CIRCULARITY LAB */}
      {calcView === 'modul_d_labor' && (
        <ModulDLabor results={results} setGlobalModulDStrategy={setGlobalModulDStrategy} rows={rows} updateRow={updateRow} />
      )}

      {/* MAIN VIEW 3: SCENARIOS & BENCHMARK */}
      {calcView === 'vergleich' && (
        <div className="bg-white border border-home-grau/30 rounded-2xl p-5 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="border-b pb-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="space-y-1">
              <h4 className="text-xs font-bold font-sans text-slate-900 uppercase flex items-center gap-1.5">
                <Activity size={15} className="text-shiraz" />
                Szenarien-Vergleich nach QNG 2026 ({qngThresholds.label})
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Normierter Lebenszyklus-Vergleich (Module A-C) mit festen Schwellenwerten für QNG-PLUS (&le; {formatDeZahl(qngThresholds.plus, 1)}) und QNG-PREMIUM (&le; {formatDeZahl(qngThresholds.premium, 1)}).
              </p>
            </div>
          </div>

          {/* Visual Chart Bars */}
          <div className="space-y-4 bg-slate-50/50 border border-slate-200 p-5 rounded-2xl">
            {variants.map((v) => {
              const maxRef = Math.max(45, ...variants.map(x => x.gwp));
              const barPct = Math.min(100, Math.max(5, (v.gwp / maxRef) * 100));

              return (
                <div key={v.id} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <div>
                      <strong className="font-bold text-slate-900">{v.name}</strong>
                      <span className="text-[10px] text-slate-500 block">{v.description}</span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-mono">
                      <span className="font-bold text-sm text-slate-800">{formatDeZahl(v.gwp, 2)} kg/(m²·a)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-white border border-slate-200 shadow-2xs">
                        {v.rating}
                      </span>
                      {v.reductionPct > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                          -{formatDeWert(v.reductionPct)}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="h-4 bg-slate-200 rounded-full overflow-hidden relative border border-slate-250">
                    <div 
                      className={`h-full ${v.colorClass} transition-all duration-500 rounded-full`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ModuleFooter
        wikipedia={[
          { title: "Ökobilanz", url: "https://de.wikipedia.org/wiki/%C3%96kobilanz" },
          { title: "Treibhauspotenzial", url: "https://de.wikipedia.org/wiki/Treibhauspotenzial" },
          { title: "Umweltproduktdeklaration" }
        ]}
        literatur={[
          "König, H. et al. (2012): Lebenszyklusanalyse von Gebäuden (Detail Green Books)",
          "Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen (BMWSB): Leitfaden Nachhaltiges Bauen",
          "Wendehorst Baustoffkunde (37. Auflage, Springer Vieweg)"
        ]}
        normIds={['DIN_EN_15804', 'DIN_EN_15978', 'DIN_EN_17472']}
        regelwerke={[
          { title: "DIN EN 15804:2022-03+A2:2019 (Nachhaltigkeit von Bauwerken - EPD-Grundregeln)" },
          { title: "DIN EN 15978:2026-09 (Bewertung der Umweltqualität von Gebäuden – Methodik; ersetzt DIN EN 15978:2012-10)" },
          { title: "DIN EN 17472:2024-06 (Nachhaltigkeit von Ingenieurbauwerken - Berechnungsmethoden)" },
          { title: "Qualitätssiegel Nachhaltiges Gebäude (QNG Anhangdokument 3.1.1, Stand 2026)", url: "https://www.qng.info/" },
          { title: "VDI 6210 / DIN SPEC 91484 (Rückbau- und Zirkularitätsbewertung)" },
          { title: "ÖKOBAUDAT Plattform (BMWSB EPD-Datenbank)", url: "https://www.oekobaudat.de/" }
        ]}
        formeln={[
          {
            formel: "\\text{GWP}_{\\text{Bauwerk}} = \\frac{\\sum_{i} m_i \\cdot \\text{GWP}_{\\text{spez},i}}{A_{\\text{NRF}} \\cdot t_{\\text{Studie}}} \\quad [\\text{kg CO}_2\\text{-eq}/(\\text{m}^2\\cdot\\text{a})]",
            erklaerung: "Normativer Jahres-Treibhausgasbezugswert der Errichtungs- und Entsorgungsphasen (Module A1-C) über die Standardlebensdauer von t = 50 Jahren.",
            quelle: "DIN EN 15978 / QNG 2026"
          },
          {
            formel: "\\text{GWP}_{D,i} = - \\left( m_i \\cdot \\frac{r_{\\text{circ},i}}{100} \\cdot \\frac{s_{\\text{sort},i}}{100} \\cdot \\eta_{\\text{subst}} \\cdot \\text{GWP}_{\\text{primär,verdrängt}} \\right) \\quad [\\text{kg CO}_2\\text{-eq}]",
            erklaerung: "Gutschrift für Vermeidungs- und Recyclingpotenziale außerhalb der Systemgrenze (Modul D) basierend auf kreislauffähigem Stoffanteil und Sortenreinheit.",
            quelle: "DIN EN 15804+A2 / DIN EN 17472"
          },
          {
            formel: "\\text{UMI} = \\frac{\\sum (m_i \\cdot \\text{UMI}_i)}{\\sum m_i} \\quad [\\%]",
            erklaerung: "Gewichteter Urban Mining Index des Bauwerks zur Erfassung der stofflichen Rezyklierbarkeit und Zirkularität im Sinne der VDI 6210.",
            quelle: "VDI 6210 / DIN SPEC 91484"
          }
        ]}
      />
    </div>
  );
}
