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
import { MATERIAL_DATABASE, CustomRow, ScenarioPreset, PRESETS, alsLcaBaustoff } from './interactivelcacalc/daten';
import {
  lcaBilanz, A4_FAKTOR_GEBAEUDE, B6_FAKTOREN, BNB_NUTZUNGSDAUER, QNG_WG, QNG_STAND, SORTENREINHEIT_REFERENZ, ersatzzyklen,
  type LcaEingabe, type LcaErgebnis, type LcaZeile, type Energietraeger, type TgaSockel,
} from '@/src/calc/lca';
import { CalculationDashboard } from './interactivelcacalc/CalculationDashboard';
import { ModulDLabor } from './interactivelcacalc/ModulDLabor';
import inhalt from '@/content/interactivelcacalc/InteractiveLCACalc.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

/** Anzeigenamen für den Rechenweg (deklarierte Einheit → Bezugsgröße) */
const MATERIAL_NAMEN: Record<string, string> = Object.fromEntries(MATERIAL_DATABASE.map(m => [m.id, m.name]));

export default function InteractiveLCACalc() {
  const [calcView, setCalcView] = useState<'konfigurator' | 'modul_d_labor' | 'vergleich'>('konfigurator');
  const [buildingType, setBuildingType] = useState<"wohnbau" | "nichtwohnbau">("wohnbau");
  const [rows, setRows] = useState<CustomRow[]>([
    { id: "1", materialId: "beton-cem1", quantity: 24, circularQuota: 65, sortingRate: 85, recoveryType: "downcycling" },
    { id: "2", materialId: "ziegel", quantity: 38, circularQuota: 55, sortingRate: 75, recoveryType: "downcycling" },
    { id: "3", materialId: "betonstahl", quantity: 1.8, circularQuota: 95, sortingRate: 95, recoveryType: "high_grade" },
    { id: "4", materialId: "eps-daemmung", quantity: 12, circularQuota: 25, sortingRate: 60, recoveryType: "thermal" }
  ]);
  
  const [transportDistance, setTransportDistance] = useState<number>(120);
  const [transportType, setTransportType] = useState<"lkw" | "bahn">("lkw");
  const [buildingArea, setBuildingArea] = useState<number>(140);
  const [studyPeriod, setStudyPeriod] = useState<number>(50); // Betrachtungszeitraum 50 Jahre nach QNG
  // Nutzungsphase: Ersatz B4 und Betrieb B6 (Standard: EH-40-Wohngebäude mit Wärmepumpe und PV-Eigennutzung, Lehrwerte)
  const [mitB4, setMitB4] = useState(true);
  const [mitB6, setMitB6] = useState(true);
  const [stromGeg, setStromGeg] = useState<number>(2400);
  const [pvEigennutzung, setPvEigennutzung] = useState<number>(900);
  const [waermeTraeger, setWaermeTraeger] = useState<Energietraeger | 'wp'>('wp');
  const [waerme, setWaerme] = useState<number>(0);
  const [nutzerstrom, setNutzerstrom] = useState(true);
  const [nrfBeheizt, setNrfBeheizt] = useState<number | null>(null);
  const [tgaSockel, setTgaSockel] = useState<TgaSockel>('ep_bis40');
  // QNG-Anforderungswerte: Wohngebäude WG23 (QNG-Handbuch Anlage 3, v1.4, 19.07.2024):
  // QNG-PLUS <= 24, QNG-PREMIUM <= 20 kg CO2-Äq./(m² NRF·a) über 50 Jahre.
  // Nichtwohngebäude: projektspezifischer Anforderungswert – hier nur didaktischer Lehrwert.
  const qngThresholds = useMemo(() => {
    if (buildingType === "wohnbau") {
      return {
        plus: QNG_WG.plus,
        premium: QNG_WG.premium,
        label: inhalt.werte.wohngebäudeWg23,
        areaUnit: "m² NRF"
      };
    } else {
      return inhalt.daten.InteractiveLCACalc;
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

  // Rechenkern src/calc/lca.ts: A1–A3, B4 (BNB-Nutzungsdauern), C3/C4, Sockel TGA, B6 (QNG-Rechenwerte), D und A4 getrennt
  const transportFaktor = A4_FAKTOR_GEBAEUDE[transportType];
  const eingabeFuer = (zeilen: LcaZeile[]): LcaEingabe => ({
    zeilen,
    nrfR: buildingArea,
    nrfBeheizt: nrfBeheizt ?? undefined,
    betrachtungszeitraum: studyPeriod,
    transportDistanz: transportDistance,
    transportFaktor,
    mitB4,
    energie: mitB6 ? { stromGeg, pvEigennutzung, waerme: waermeTraeger === 'wp' ? 0 : waerme, waermeTraeger: waermeTraeger === 'wp' ? 'netzstrom' : waermeTraeger, nutzerstrom } : null,
    tgaSockel,
    gebaeudeart: buildingType,
  });
  const zeileZuKern = (row: CustomRow): LcaZeile | null => {
    const mat = MATERIAL_DATABASE.find(m => m.id === row.materialId);
    if (!mat) return null;
    return { baustoff: alsLcaBaustoff(mat), menge: row.quantity, kreislaufquote: row.circularQuota, sortenreinheit: row.sortingRate, verwertung: row.recoveryType, nutzungsdauer: row.nutzungsdauer };
  };

  const ergebnis = useMemo(
    () => lcaBilanz(eingabeFuer(rows.map(zeileZuKern).filter((z): z is LcaZeile => z !== null))),
    [rows, transportDistance, transportType, buildingArea, nrfBeheizt, studyPeriod, mitB4, mitB6, stromGeg, pvEigennutzung, waerme, waermeTraeger, nutzerstrom, tgaSockel, buildingType]
  );

  // Kenngrößen für die Modul-D-Eingabemaske (Anzeige)
  const results = useMemo(() => {
    const konstruktion = ergebnis.a1a3 + ergebnis.b4 + ergebnis.c3c4 + ergebnis.sockelTga;
    const rowModulDDetails = rows.flatMap((row, i) => {
      const mat = MATERIAL_DATABASE.find(m => m.id === row.materialId);
      const z = ergebnis.zeilen[i];
      if (!mat || !z) return [];
      return [{
        rowId: row.id, matName: mat.name, category: mat.category, unit: mat.unit, qty: row.quantity, weightTons: z.masse,
        circularQuota: row.circularQuota, sortingRate: row.sortingRate, recoveryType: row.recoveryType,
        circularMassTons: z.kreislaufMasse, effectiveRecoveredMassTons: z.rueckgewonnen, rowGwpD: z.d, substitutesPrimary: mat.substitutesPrimary,
      }];
    });
    return {
      totalWeightTons: ergebnis.masse,
      totalCircularWeightTons: ergebnis.rueckgewonnen,
      overallCircularityRate: ergebnis.kreislaufquoteGebaeude,
      gwpA1A3: ergebnis.a1a3,
      gwpBioStorageInstalled: ergebnis.biogenGespeichert,
      gwpA4: ergebnis.a4,
      gwpC: ergebnis.c3c4,
      gwpD: ergebnis.d,
      gwpAC: konstruktion,
      gwpPerSqmYearAC: ergebnis.spez.konstruktion,
      totalGwpNet: konstruktion + ergebnis.d,
      gwpPerSqmYearNet: ergebnis.spez.netto,
      gwpPerSqmYearD: ergebnis.spez.d,
      weightedUmi: ergebnis.umi,
      totalPenrtMj: ergebnis.penrtMJ,
      penrtKwhPerSqmYear: ergebnis.penrtKwhJeM2a,
      rowModulDDetails,
    };
  }, [ergebnis, rows]);

  // Ergebnisaussage: „eingehalten“ nur mit B4 und B6 (vollständiger QNG-Bilanzrahmen, vereinfacht), sonst neutral
  const benchmarkStatus = useMemo(() => {
    const wert = `${formatDeZahl(ergebnis.spez.qng, 2)} kg CO₂-eq/(m²·a)`;
    if (!ergebnis.gueltig) {
      return { label: inhalt.werte.ohneVergleich, color: 'text-slate-700 border-slate-300 bg-slate-50/70', badge: 'bg-slate-500 text-white', desc: '' };
    }
    if (ergebnis.aussage === 'premium') {
      return { label: inhalt.werte.unterQngPremiumAnforderungswert, color: 'text-emerald-700 border-emerald-300 bg-emerald-50/70', badge: 'bg-emerald-600 text-white', desc: `${inhalt.werte.descPremium}${wert} ≤ ${formatDeZahl(qngThresholds.premium, 0)}.` };
    }
    if (ergebnis.aussage === 'plus') {
      return { label: inhalt.werte.unterQngPlusAnforderungswert, color: 'text-teal-700 border-teal-300 bg-teal-50/70', badge: 'bg-teal-600 text-white', desc: `${inhalt.werte.descPlus}${wert} ≤ ${formatDeZahl(qngThresholds.plus, 0)}.` };
    }
    if (ergebnis.aussage === 'ueberschritten') {
      return { label: inhalt.werte.standardNeubau, color: 'text-amber-700 border-amber-300 bg-amber-50/70', badge: 'bg-amber-600 text-white', desc: `${inhalt.werte.descUeber}${wert} > ${formatDeZahl(qngThresholds.plus, 0)}.` };
    }
    if (buildingType === 'nichtwohnbau' && ergebnis.enthaeltB4 && ergebnis.enthaeltB6) {
      return { label: inhalt.werte.nwgNeutral, color: 'text-slate-700 border-slate-300 bg-slate-50/70', badge: 'bg-slate-600 text-white', desc: `${inhalt.werte.descNwg}${wert} (Lehrwert PLUS ${formatDeZahl(qngThresholds.plus, 0)}).` };
    }
    return { label: inhalt.werte.teilbilanzNeutral, color: 'text-slate-700 border-slate-300 bg-slate-50/70', badge: 'bg-slate-600 text-white', desc: `${inhalt.werte.descTeil}${wert}.` };
  }, [ergebnis, qngThresholds, buildingType]);

  // Vergleichsvarianten mit denselben Einstellungen für B4, B6, TGA und Fläche (Standardwerte für Kreislauf und Nutzungsdauer)
  const variants = useMemo(() => {
    const bilanz = (liste: { id: string; qty: number }[]) => {
      const zeilen = liste.flatMap(r => {
        const m = MATERIAL_DATABASE.find(mat => mat.id === r.id);
        return m ? [{ baustoff: alsLcaBaustoff(m), menge: r.qty, kreislaufquote: m.defaultCircularQuota, sortenreinheit: SORTENREINHEIT_REFERENZ, verwertung: m.defaultRecoveryType }] : [];
      });
      return lcaBilanz(eingabeFuer(zeilen));
    };
    const rate = (e: LcaErgebnis) => {
      if (e.aussage === 'premium') return inhalt.werte.premiumWertOrientierend;
      if (e.aussage === 'plus') return inhalt.werte.plusWertOrientierend;
      if (e.aussage === 'ueberschritten') return inhalt.werte.ueberPlus;
      return inhalt.werte.ohneVergleich;
    };
    const v1 = bilanz([{ id: "beton-cem1", qty: 36 }, { id: "ziegel", qty: 45 }, { id: "betonstahl", qty: 2.5 }, { id: "eps-daemmung", qty: 16 }]);
    const v2 = bilanz([{ id: "beton-cem3", qty: 22 }, { id: "rc-beton", qty: 16 }, { id: "ziegel", qty: 40 }, { id: "betonstahl", qty: 2.2 }, { id: "zellulose", qty: 20 }]);
    const v3 = bilanz([{ id: "beton-cem3", qty: 10 }, { id: "hbv-decke", qty: 18 }, { id: "clt", qty: 22 }, { id: "kvh", qty: 6 }, { id: "baustahl", qty: 0.8 }, { id: "holzfaser-daemmung", qty: 18 }]);
    const v4 = bilanz([{ id: "schaumglas", qty: 25 }, { id: "kvh", qty: 14 }, { id: "lehm-bauplatte", qty: 15 }, { id: "hanfkalk", qty: 24 }, { id: "strohballen", qty: 20 }, { id: "baustahl", qty: 0.3 }]);
    const ref = v1.spez.qng;
    const minderung = (e: LcaErgebnis) => (ref > 0 && e.gueltig ? Math.round(((ref - e.spez.qng) / ref) * 100) : 0);
    return [
      { id: "var1", name: inhalt.werte.varianteIKonventionellerMassivbau, description: inhalt.werte.cemINormalbetonHintermauerziegel, e: v1, colorClass: "bg-rose-600" },
      { id: "var2", name: inhalt.werte.varianteIiKlinkeroptimierterMassivbau, description: inhalt.werte.cemIiiAHüttensandzement, e: v2, colorClass: "bg-amber-600" },
      { id: "var3", name: inhalt.werte.varianteIiiModernerHolz, description: inhalt.werte.cltWändeHbvDecken, e: v3, colorClass: "bg-emerald-600" },
      { id: "var4", name: inhalt.werte.varianteIvZirkulärerLehm, description: inhalt.werte.lehmbauplattenHanfkalkStrohUnd, e: v4, colorClass: "bg-teal-600" },
      { id: "active", name: inhalt.werte.ihrAktuellerEntwurfBenutzerdefiniert, description: inhalt.werte.dynamischAusIhrerBaustofftabelle, e: ergebnis, colorClass: "bg-shiraz" },
    ].map(v => ({ ...v, gwp: v.e.spez.qng, rating: rate(v.e), reductionPct: v.id === 'var1' ? 0 : minderung(v.e) }));
  }, [ergebnis]);

  return (
    <div className="space-y-6 font-normal">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Calculator className="text-shiraz shrink-0" /><MdText text={inhalt.texte.interaktiverÖkobilanzRechnerLca} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-2">
            <p><MdText text={inhalt.texte.ganzheitlicheLebenszyklusanalyseNachDin} /></p>
          </div>
        </div>
        <div className="flex md:flex-col gap-2 shrink-0">
          <button 
            onClick={() => {
              setBuildingType("wohnbau");
              setRows([
                { id: "1", materialId: "beton-cem1", quantity: 24, circularQuota: 65, sortingRate: 85, recoveryType: "downcycling" },
                { id: "2", materialId: "ziegel", quantity: 38, circularQuota: 55, sortingRate: 75, recoveryType: "downcycling" },
                { id: "3", materialId: "betonstahl", quantity: 1.8, circularQuota: 95, sortingRate: 95, recoveryType: "high_grade" },
                { id: "4", materialId: "eps-daemmung", quantity: 12, circularQuota: 25, sortingRate: 60, recoveryType: "thermal" }
              ]);
              setTransportDistance(120);
              setTransportType("lkw");
              setBuildingArea(140);
              setStudyPeriod(50);
              setMitB4(true);
              setMitB6(true);
              setStromGeg(2400);
              setPvEigennutzung(900);
              setWaermeTraeger('wp');
              setWaerme(0);
              setNutzerstrom(true);
              setNrfBeheizt(null);
              setTgaSockel('ep_bis40');
            }}
            className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-50 border border-home-grau/30 hover:border-slate-400 py-2 px-3.5 rounded-xl text-slate-700 transition cursor-pointer font-bold"
            title={inhalt.werte.werteAufInitialzustandZurücksetzen}
          >
            <RotateCcw size={14} /><MdText text={inhalt.texte.rechnerReset} /></button>
        </div>
      </div>

      {/* Hauptansichten (gemeinsame Reiter-Komponente, ARIA-Tabs; Gutachten 27.10.2026) */}
      <ModuleTabs
        label="Ansicht des Ökobilanz-Rechners"
        tabs={[
          { id: 'konfigurator' as const, label: inhalt.werte.t1BaustoffeMassenLogistik, icon: Layers, zusatz: `${rows.length} Baustoffe` },
          { id: 'modul_d_labor' as const, label: inhalt.werte.t2EingabemaskeModulD, icon: Recycle, zusatz: `${formatDeZahl(results.overallCircularityRate, 0)}% Zirkulär` },
          { id: 'vergleich' as const, label: inhalt.werte.t3QngBenchmarkSzenarienvergleich, icon: Activity, zusatz: benchmarkStatus.label.split(' ')[0] }
        ]}
        aktiv={calcView}
        onWechsel={setCalcView}
        className="space-y-6 [&>[role=tablist]]:bg-white [&>[role=tablist]]:p-2 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:border [&>[role=tablist]]:border-home-grau/30"
        panelKlasse="space-y-6"
      >

      {/* Building Type Switch & QNG Benchmark Selection */}
      <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
            <Building2 size={15} className="text-shiraz" /><MdText text={inhalt.texte.gebäudekategorieQng2026} /></span>
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setBuildingType("wohnbau")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                buildingType === "wohnbau"
                  ? "bg-shiraz text-white shadow-xs"
                  : "text-text-main/70 hover:text-shiraz"
              }`}
            ><MdText text={inhalt.texte.wohngebäudeWg} /></button>
            <button
              onClick={() => setBuildingType("nichtwohnbau")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                buildingType === "nichtwohnbau"
                  ? "bg-shiraz text-white shadow-xs"
                  : "text-text-main/70 hover:text-shiraz"
              }`}
            ><MdText text={inhalt.texte.nichtwohngebäudeNwg} /></button>
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
        {buildingType === "wohnbau" && (
          <p className="text-[11px] text-text-main/70" data-testid="qng-stand">{inhalt.werte.qngStandHinweis}{QNG_STAND}{inhalt.werte.qngAbsenkungHinweis}</p>
        )}
      </div>

      {/* Quick Presets / Click-Scenarios */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block"><MdText text={inhalt.texte.lernSzenarienLadenVergleich} /></span>
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
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono"><MdText text={inhalt.texte.t1VerbauteBaustoffmassenDirekte} /></span>
                  <span className="text-xs text-slate-500"><MdText text={inhalt.texte.wählenSieBaustoffeMengen} /></span>
                </div>
                <button 
                  onClick={addRow}
                  className="flex items-center gap-1 text-xs bg-shiraz text-white font-bold px-3 py-1.5 rounded-lg hover:bg-shiraz/90 shadow transition cursor-pointer"
                >
                  <Plus size={14} /><MdText text={inhalt.texte.baustoffHinzufügen} /></button>
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
                            aria-label="Baustoff"
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
                              aria-label={`Menge in ${currentMat?.unit ?? 'Einheiten'}`}
                              value={Number.isFinite(row.quantity) ? row.quantity : ''}
                              onChange={(e) => updateRow(row.id, { quantity: e.target.valueAsNumber })}
                              className="w-16 text-xs font-bold text-right font-mono focus:outline-none"
                            />
                            <span className="text-xs text-slate-500 font-mono font-semibold">{currentMat?.unit}</span>
                          </div>

                          <button 
                            onClick={() => removeRow(row.id)}
                            disabled={rows.length <= 1}
                            className="p-2 border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg transition disabled:opacity-30 cursor-pointer"
                            title={inhalt.werte.zeileEntfernen}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Quick Inline Slider for kreislauffähiger Stoffanteil */}
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <Recycle size={13} className="text-teal-600" /><MdText text={inhalt.texte.kreislauffähigerStoffanteil} /><InfoTooltip text={inhalt.werte.anteilDesBaustoffsDer} />
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

                      {currentMat && mitB4 && (() => {
                        const bnb = BNB_NUTZUNGSDAUER[currentMat.id];
                        const nd = row.nutzungsdauer ?? bnb?.nd ?? 50;
                        const n = ersatzzyklen(nd, studyPeriod);
                        return (
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-600 font-mono">
                            <label className="flex items-center gap-1.5">
                              <span className="font-bold">{inhalt.werte.ndLabel}:</span>
                              <select
                                value={String(nd)}
                                onChange={(e) => {
                                  const wert = Number(e.target.value);
                                  updateRow(row.id, { nutzungsdauer: bnb && wert === bnb.nd ? undefined : wert });
                                }}
                                className="text-[10px] font-bold p-1 bg-white border border-home-grau/30 rounded cursor-pointer"
                              >
                                {[10, 15, 20, 25, 30, 40, 50].map(x => (
                                  <option key={x} value={String(x)}>{x === 50 ? '≥ 50' : String(x)} a{bnb && bnb.nd === x ? ' (BNB)' : ''}</option>
                                ))}
                              </select>
                            </label>
                            <span>{inhalt.werte.ersatzKurz}: <strong>{formatDeZahl(n, 0)}×</strong></span>
                            {bnb && <span className="text-slate-400 font-sans" title={bnb.quelle}>{bnb.quelle}{bnb.vorlaeufig ? ` – ${inhalt.werte.ndVorlaeufig}` : ''}</span>}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transport & Building Area Setup */}
            <div className="bg-white border border-home-grau/30 rounded-2xl p-4 md:p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phase A4: Transport */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono border-b pb-1"><MdText text={inhalt.texte.t2PhaseA4Logistik} /></span>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Truck size={13} className="text-amber-500" /><MdText text={inhalt.texte.distanzZurBaustelle} /></span>
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
                    <span><MdText text={inhalt.texte.t10KmRegional} /></span>
                    <span><MdText text={inhalt.texte.t800KmÜberregional} /></span>
                  </div>

                  <AuswahlGruppe label="Transportmittel" className="grid grid-cols-2 gap-2 text-center text-[10px] pt-1">
                    {[
                      { id: "lkw" as const, label: inhalt.werte.lkwDiesel, desc: inhalt.werte.t015KgCo },
                      { id: "bahn" as const, label: "🚊 Güterzug", desc: inhalt.werte.t003KgCo }
                    ].map((trans) => (
                      <button {...alsOption(transportType === trans.id)}
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
                  </AuswahlGruppe>
                </div>
              </div>

              {/* Building Area (BGF) & Study Period */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono border-b pb-1"><MdText text={inhalt.texte.t3BezugsflächeNormzeitraum} /></span>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Building2 size={13} className="text-indigo-600" /><MdText text={inhalt.texte.nettoRaumflächeNrf} /></span>
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
                    <span>1200 m²</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[10px] text-slate-600 leading-relaxed space-y-1">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Info size={12} className="text-indigo-600" />
                      <span><MdText text={inhalt.texte.normativeBerechnungNachDin} /></span>
                    </div>
                    <p>
                      Betrachtungszeitraum: <strong>{formatDeZahl(studyPeriod, 0)} Jahre</strong><MdText text={inhalt.texte.dieUmweltlastenWerdenAuf} /><strong className="font-mono text-slate-800"><MdText text={inhalt.texte.kgCoEqM} /></strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nutzungsphase: Ersatz B4 und Betrieb B6 */}
            <div className="bg-white border border-home-grau/30 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono border-b pb-1"><MdText text={inhalt.texte.t4NutzungB4B6} /></span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={mitB4} onChange={(e) => setMitB4(e.target.checked)} className="accent-shiraz" />
                    {inhalt.werte.mitB4Label}
                  </label>
                  <p className="text-[10.5px] text-slate-500 leading-snug"><MdText text={inhalt.texte.ersatzB4Erlaeuterung} /></p>
                  <label className="block space-y-1 pt-1">
                    <span className="font-bold text-slate-700 block">{inhalt.werte.tgaLabel}</span>
                    <select value={tgaSockel} onChange={(e) => setTgaSockel(e.target.value as TgaSockel)} className="w-full p-2 bg-white border border-home-grau/30 rounded-lg cursor-pointer">
                      <option value="ep_bis40">{inhalt.werte.tgaBis40}</option>
                      <option value="ep_ueber40">{inhalt.werte.tgaUeber40}</option>
                      <option value="keiner">{inhalt.werte.tgaKeiner}</option>
                    </select>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={mitB6} onChange={(e) => setMitB6(e.target.checked)} className="accent-shiraz" />
                    {inhalt.werte.mitB6Label}
                  </label>
                  <p className="text-[10.5px] text-slate-500 leading-snug"><MdText text={inhalt.texte.betriebB6Erlaeuterung} /></p>
                  {mitB6 && (
                    <div className="space-y-2">
                      {([
                        { label: inhalt.werte.stromGegLabel, wert: stromGeg, setze: setStromGeg },
                        { label: inhalt.werte.pvLabel, wert: pvEigennutzung, setze: setPvEigennutzung },
                      ] as const).map(f => (
                        <label key={f.label} className="block space-y-0.5">
                          <span className="text-[10.5px] text-slate-600 block">{f.label}</span>
                          <input type="number" min="0" step="100" value={Number.isFinite(f.wert) ? f.wert : ''} onChange={(e) => f.setze(e.target.valueAsNumber)} className="w-full p-1.5 font-mono text-right bg-white border border-home-grau/30 rounded-lg" />
                        </label>
                      ))}
                      <label className="block space-y-0.5">
                        <span className="text-[10.5px] text-slate-600 block">{inhalt.werte.waermeLabel}</span>
                        <select value={waermeTraeger} onChange={(e) => setWaermeTraeger(e.target.value as Energietraeger | 'wp')} className="w-full p-1.5 bg-white border border-home-grau/30 rounded-lg cursor-pointer">
                          <option value="wp">{inhalt.werte.waermeWp}</option>
                          {(Object.keys(B6_FAKTOREN) as Energietraeger[]).filter(k => k !== 'netzstrom').map(k => (
                            <option key={k} value={k}>{B6_FAKTOREN[k].name} ({formatDeZahl(B6_FAKTOREN[k].gwp, 3)} kg/kWh)</option>
                          ))}
                        </select>
                      </label>
                      {waermeTraeger !== 'wp' && (
                        <label className="block space-y-0.5">
                          <span className="text-[10.5px] text-slate-600 block">{inhalt.werte.waermeMengeLabel}</span>
                          <input type="number" min="0" step="100" value={Number.isFinite(waerme) ? waerme : ''} onChange={(e) => setWaerme(e.target.valueAsNumber)} className="w-full p-1.5 font-mono text-right bg-white border border-home-grau/30 rounded-lg" />
                        </label>
                      )}
                      <label className="flex items-center gap-2 text-[10.5px] text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={nutzerstrom} onChange={(e) => setNutzerstrom(e.target.checked)} className="accent-shiraz" />
                        {inhalt.werte.nutzerstromLabel}
                      </label>
                      {nutzerstrom && (
                        <label className="block space-y-0.5">
                          <span className="text-[10.5px] text-slate-600 block">{inhalt.werte.nrfBeheiztLabel}</span>
                          <input type="number" min="0" step="10" value={nrfBeheizt === null ? buildingArea : Number.isFinite(nrfBeheizt) ? nrfBeheizt : ''} onChange={(e) => setNrfBeheizt(e.target.valueAsNumber)} className="w-full p-1.5 font-mono text-right bg-white border border-home-grau/30 rounded-lg" />
                        </label>
                      )}
                      <p className="text-[10px] text-slate-500 font-mono">
                        Netzstrom {formatDeZahl(B6_FAKTOREN.netzstrom.gwp, 3)} kg/kWh: B6 = {formatDeZahl(ergebnis.spez.b6, 2)} kg/(m²·a)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Dashboard / Results (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <CalculationDashboard ergebnis={ergebnis} qngThresholds={qngThresholds} benchmarkStatus={benchmarkStatus} nrfR={buildingArea} betrachtungszeitraum={studyPeriod} namen={MATERIAL_NAMEN} />
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
                <Activity size={15} className="text-shiraz" /><MdText text={inhalt.texte.szenarienVergleichNachQng} />{qngThresholds.label})
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal"><MdText text={inhalt.texte.normierterLebenszyklusVergleichModule} />{formatDeZahl(qngThresholds.plus, 1)}<MdText text={inhalt.texte.undQngPremium} />{formatDeZahl(qngThresholds.premium, 1)}).
              </p>
            </div>
          </div>

          {/* Visual Chart Bars */}
          <div className="space-y-4 bg-slate-50/50 border border-slate-200 p-5 rounded-2xl">
            {variants.map((v) => {
              const maxRef = Math.max(45, ...variants.filter(x => Number.isFinite(x.gwp)).map(x => x.gwp));
              const barPct = Number.isFinite(v.gwp) ? Math.min(100, Math.max(5, (v.gwp / maxRef) * 100)) : 0;

              return (
                <div key={v.id} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <div>
                      <strong className="font-bold text-slate-900">{v.name}</strong>
                      <span className="text-[10px] text-slate-500 block">{v.description}</span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-mono">
                      <span className="font-bold text-sm text-slate-800">{Number.isFinite(v.gwp) ? `${formatDeZahl(v.gwp, 2)} kg/(m²·a)` : '–'}</span>
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
      </ModuleTabs>

      <ModuleFooter
        wikipedia={[
          { title: "Ökobilanz", url: "https://de.wikipedia.org/wiki/%C3%96kobilanz" },
          { title: "Treibhauspotenzial", url: "https://de.wikipedia.org/wiki/Treibhauspotenzial" },
          { title: "Umweltproduktdeklaration" }
        ]}
        literatur={inhalt.daten["InteractiveLCACalc.literatur"]}
        normIds={['DIN_EN_15804', 'DIN_EN_15978', 'DIN_EN_17472']}
        regelwerke={inhalt.daten["InteractiveLCACalc.regelwerke"]}
        formeln={inhalt.daten["InteractiveLCACalc.formeln"]}
      />
    </div>
  );
}
