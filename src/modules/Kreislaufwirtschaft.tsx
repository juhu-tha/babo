import React, { useState, useMemo } from 'react';
import { 
  Recycle, RotateCcw, Box, ArrowRight, ArrowDown, 
  Calculator, Building2, AlertTriangle, Layers, ClipboardCheck, 
  Building, Globe, FileSpreadsheet, Plus, Trash2, Activity 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';

export interface DeconstructionComponent {
  id: string;
  name: string;
  quantity: number;
  unit: 'Stk' | 'm²' | 't';
  category: 'Metall' | 'Holz' | 'Mineralisch' | 'Technik' | 'Sonstiges';
  connectionType: 'geschraubt' | 'gesteckt' | 'genagelt_geklemmt' | 'geklebt_vergossen';
  hazardousSubstance: 'none' | 'asbest' | 'kMF' | 'pCB_pCP' | 'unclear';
  targetChannel: 'reuse' | 'recycle' | 'disposal';
  weightKgPerUnit: number;
}

export default function Kreislaufwirtschaft() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'abfaelle' | 'probleme' | 'rueckbauplanung' | 'zirkularitaet'>('grundlagen');
  const [activeStrategy, setActiveStrategy] = useState<number>(1);

  // Urban Mining Index (UMI) & Circularity Index (MCI) Calculator State Variables
  const [umiReuseIn, setUmiReuseIn] = useState<number>(10);
  const [umiRecyclingIn, setUmiRecyclingIn] = useState<number>(30);
  const [umiRenewableIn, setUmiRenewableIn] = useState<number>(20);
  const [umiReuseOut, setUmiReuseOut] = useState<number>(40);
  const [umiRecyclingOut, setUmiRecyclingOut] = useState<number>(35);

  const [mciRecycledIn, setMciRecycledIn] = useState<number>(25);
  const [mciReusedIn, setMciReusedIn] = useState<number>(15);
  const [mciRecycledOut, setMciRecycledOut] = useState<number>(30);
  const [mciReusedOut, setMciReusedOut] = useState<number>(12);
  const [lifespan, setLifespan] = useState<number>(60);
  const [avgLifespan, setAvgLifespan] = useState<number>(50);
  const [intensity, setIntensity] = useState<number>(1.2);
  const [avgIntensity, setAvgIntensity] = useState<number>(1.0);

  // Derived calculations for UMI & MCI
  const umiInputRate = Math.min(100, umiReuseIn + umiRecyclingIn + umiRenewableIn);
  const umiOutputRate = Math.min(100, umiReuseOut + umiRecyclingOut);
  const umiTotal = (umiInputRate * 0.5) + (umiOutputRate * 0.5);

  const V = 1 - (mciRecycledIn + mciReusedIn) / 100;
  const W = 1 - (mciRecycledOut + mciReusedOut) / 100;
  const lfi = Math.max(0, Math.min(1, (V + W) / 2));
  const utility = (lifespan / (avgLifespan || 1)) * (intensity / (avgIntensity || 1));
  const f_u = utility > 0 ? (0.9 / utility) : 0.9;
  const circularityIndex = Math.max(0, Math.min(100, (1 - lfi * f_u) * 100));

  // Rückbauplanung & Re-Use (DIN SPEC 91484 & DIN SPEC 91525) States
  const [auditComponents, setAuditComponents] = useState<DeconstructionComponent[]>([
    {
      id: 'item-1',
      name: 'Aluminium-Glas-Fassadenelemente (Pfosten-Riegel)',
      quantity: 120,
      unit: 'Stk',
      category: 'Metall',
      connectionType: 'geschraubt',
      hazardousSubstance: 'none',
      targetChannel: 'reuse',
      weightKgPerUnit: 180
    },
    {
      id: 'item-2',
      name: 'Innentüren Holz massiv (Kiefer / Fichte), m. Zargen',
      quantity: 45,
      unit: 'Stk',
      category: 'Holz',
      connectionType: 'geschraubt',
      hazardousSubstance: 'none',
      targetChannel: 'reuse',
      weightKgPerUnit: 35
    },
    {
      id: 'item-3',
      name: 'Historische Gussgliederheizkörper (Retro-Stil)',
      quantity: 30,
      unit: 'Stk',
      category: 'Technik',
      connectionType: 'geschraubt',
      hazardousSubstance: 'none',
      targetChannel: 'reuse',
      weightKgPerUnit: 80
    },
    {
      id: 'item-4',
      name: 'Teppichfliesen (Faserstoff, Bitumenschicht)',
      quantity: 450,
      unit: 'm²',
      category: 'Sonstiges',
      connectionType: 'geklebt_vergossen',
      hazardousSubstance: 'none',
      targetChannel: 'recycle',
      weightKgPerUnit: 4.5
    },
    {
      id: 'item-5',
      name: 'BSH-Unterzüge und Deckenbalken',
      quantity: 12,
      unit: 'Stk',
      category: 'Holz',
      connectionType: 'gesteckt',
      hazardousSubstance: 'none',
      targetChannel: 'reuse',
      weightKgPerUnit: 750
    },
    {
      id: 'item-6',
      name: 'Asbestzement-Balkonbrüstungsplatten',
      quantity: 80,
      unit: 'm²',
      category: 'Mineralisch',
      connectionType: 'geschraubt',
      hazardousSubstance: 'asbest',
      targetChannel: 'disposal',
      weightKgPerUnit: 18
    }
  ]);

  // Form states for adding new components
  const [newCompName, setNewCompName] = useState('');
  const [newCompQty, setNewCompQty] = useState(10);
  const [newCompUnit, setNewCompUnit] = useState<'Stk' | 'm²' | 't'>('Stk');
  const [newCompCat, setNewCompCat] = useState<'Metall' | 'Holz' | 'Mineralisch' | 'Technik' | 'Sonstiges'>('Metall');
  const [newCompConn, setNewCompConn] = useState<'geschraubt' | 'gesteckt' | 'genagelt_geklemmt' | 'geklebt_vergossen'>('geschraubt');
  const [newCompHaz, setNewCompHaz] = useState<'none' | 'asbest' | 'kMF' | 'pCB_pCP' | 'unclear'>('none');
  const [newCompWeight, setNewCompWeight] = useState(50);

  // DIN SPEC 91484 Pre-Demolition Audit Checklist
  const [dinPreDemChecklist, setDinPreDemChecklist] = useState({
    researchDone: true,
    inspectionDone: true,
    substancesSampled: true,
    reuseInventoryCreated: true,
    reportingAccepted: false
  });

  // Concular integration states
  const [concularConnected, setConcularConnected] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingMatchedCount, setMatchingMatchedCount] = useState(0);
  const [showPayloadSchema, setShowPayloadSchema] = useState(false);

  // Helper functions for Rückbauplanung
  const addAuditComponent = () => {
    if (!newCompName.trim()) return;
    const newComp: DeconstructionComponent = {
      id: `item-${Date.now()}`,
      name: newCompName,
      quantity: newCompQty,
      unit: newCompUnit,
      category: newCompCat,
      connectionType: newCompConn,
      hazardousSubstance: newCompHaz,
      targetChannel: newCompHaz !== 'none' ? 'disposal' : 'reuse',
      weightKgPerUnit: newCompWeight
    };
    setAuditComponents([...auditComponents, newComp]);
    setNewCompName('');
    if (concularConnected) {
      setMatchingMatchedCount(prev => prev + 1);
    }
  };

  const removeAuditComponent = (id: string) => {
    setAuditComponents(auditComponents.filter(c => c.id !== id));
  };

  const updateAuditComponent = (id: string, field: keyof DeconstructionComponent, value: DeconstructionComponent[keyof DeconstructionComponent]) => {
    setAuditComponents(auditComponents.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        if (field === 'hazardousSubstance' && value !== 'none') {
          updated.targetChannel = 'disposal';
        } else if (field === 'hazardousSubstance' && value === 'none' && updated.targetChannel === 'disposal') {
          updated.targetChannel = 'reuse';
        }
        return updated;
      }
      return c;
    }));
  };

  const runConcularMatching = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      setConcularConnected(true);
      const reusables = auditComponents.filter(c => c.hazardousSubstance === 'none' && c.targetChannel === 'reuse').length;
      setMatchingMatchedCount(reusables);
    }, 1250);
  };

  const auditStats = useMemo(() => {
    let totalWeightTons = 0;
    let totalReusableWeightTons = 0;
    let totalAvoidedCo2Kg = 0;
    let estimatedRevenueEur = 0;
    let hazardCount = 0;

    auditComponents.forEach((comp) => {
      const weightKg = comp.quantity * comp.weightKgPerUnit;
      const weightTons = weightKg / 1000;
      totalWeightTons += weightTons;

      const isHazardous = comp.hazardousSubstance !== 'none';
      if (isHazardous) {
        hazardCount += 1;
      }

      let connectionRatingFactor = 0;
      if (comp.connectionType === 'geschraubt') connectionRatingFactor = 0.95;
      else if (comp.connectionType === 'gesteckt') connectionRatingFactor = 0.90;
      else if (comp.connectionType === 'genagelt_geklemmt') connectionRatingFactor = 0.50;
      else connectionRatingFactor = 0.05;

      if (!isHazardous && comp.targetChannel === 'reuse') {
        totalReusableWeightTons += weightTons * connectionRatingFactor;

        let embodiedCarbonFactor = 0.8;
        if (comp.category === 'Metall') embodiedCarbonFactor = 4.3;
        else if (comp.category === 'Holz') embodiedCarbonFactor = 1.45;
        else if (comp.category === 'Technik') embodiedCarbonFactor = 3.5;
        else if (comp.category === 'Mineralisch') embodiedCarbonFactor = 0.15;
        
        totalAvoidedCo2Kg += weightKg * embodiedCarbonFactor * connectionRatingFactor;

        let estimatedValuePerUnit = 25;
        if (comp.category === 'Metall') estimatedValuePerUnit = 110;
        else if (comp.category === 'Holz') estimatedValuePerUnit = 48;
        else if (comp.category === 'Technik') estimatedValuePerUnit = 65;
        else if (comp.category === 'Mineralisch') estimatedValuePerUnit = 15;

        estimatedRevenueEur += comp.quantity * estimatedValuePerUnit * connectionRatingFactor;
      } else if (!isHazardous && comp.targetChannel === 'recycle') {
        const recycleCarbonFactor = comp.category === 'Metall' ? 1.0 : 0.08;
        totalAvoidedCo2Kg += weightKg * recycleCarbonFactor;
        estimatedRevenueEur += comp.quantity * 1.5;
      } else if (isHazardous) {
        estimatedRevenueEur -= comp.quantity * 12;
      }
    });

    const averageReuseQuota = totalWeightTons > 0 
      ? (totalReusableWeightTons / totalWeightTons) * 100 
      : 0;

    return {
      totalWeightTons,
      totalReusableWeightTons,
      totalAvoidedCo2Kg,
      estimatedRevenueEur: Math.round(estimatedRevenueEur),
      hazardCount,
      averageReuseQuota,
      totalComponentsCount: auditComponents.length
    };
  }, [auditComponents]);

  const strategies = [
    {
      id: 1,
      name: 'Refuse & Reduce',
      label: 'Verzichten & Reduzieren',
      bgColor: 'bg-emerald-500 hover:bg-emerald-600',
      activeColor: 'bg-emerald-600 ring-4 ring-emerald-200',
      textColor: 'text-emerald-900',
      panelBg: 'bg-emerald-50 border-emerald-200',
      description: 'Höchste Priorität. Vermeidung von Neubau durch Umnutzung von Bestandsgebäuden. Materialsparende Konstruktionen (z.B. Leichtbau, Topologieoptimierung).',
      examples: ['Bau im Bestand statt Abriss und Neubau', 'Leichtbauweisen zur Materialeinsparung', 'Erhöhung der Nutzungsintensität (Sharing)']
    },
    {
      id: 2,
      name: 'Reuse',
      label: 'Wiederverwenden',
      bgColor: 'bg-blue-500 hover:bg-blue-600',
      activeColor: 'bg-blue-600 ring-4 ring-blue-200',
      textColor: 'text-blue-900',
      panelBg: 'bg-blue-50 border-blue-200',
      description: 'Bauteile (z.B. Stahlträger, Ziegel, Fenster) werden nach dem Rückbau direkt oder mit minimaler Aufbereitung in neuen Projekten wiederverwendet. Erfordert zerstörungsfreien Rückbau (Design for Disassembly).',
      examples: ['Wiederverwendung von Stahlträgern ohne Umschmelzen', 'Einsatz gebrauchter Dachziegel', 'Wiedereinbau von intakten Fenstern/Türen']
    },
    {
      id: 3,
      name: 'Repair & Refurbish',
      label: 'Reparieren & Aufarbeiten',
      bgColor: 'bg-amber-500 hover:bg-amber-600',
      activeColor: 'bg-amber-600 ring-4 ring-amber-200',
      textColor: 'text-amber-900',
      panelBg: 'bg-amber-50 border-amber-200',
      description: 'Verlängerung der Lebensdauer von Bauteilen und Gebäuden durch Instandhaltung, Sanierung und Modernisierung.',
      examples: ['Fassadensanierung und Nachdämmung', 'Reparatur von TGA-Anlagen statt komplettem Austausch', 'Aufbereitung alter Holzböden']
    },
    {
      id: 4,
      name: 'Recycle',
      label: 'Recyceln',
      bgColor: 'bg-orange-500 hover:bg-orange-600',
      activeColor: 'bg-orange-600 ring-4 ring-orange-200',
      textColor: 'text-orange-900',
      panelBg: 'bg-orange-50 border-orange-200',
      description: 'Stoffliche Verwertung von Materialien. Das Material wird eingeschmolzen oder gebrochen (z.B. Recyclingbeton, Stahlschrott). Benötigt oft viel Energie und führt häufig zu "Downcycling" (Qualitätsverlust).',
      examples: ['Einsatz von Recyclingbeton (RC-Beton)', 'Einschmelzen von Bewehrungsstahl im Lichtbogenofen', 'Asphaltrecycling für neue Tragschichten']
    },
    {
      id: 5,
      name: 'Recover & Dispose',
      label: 'Verwerten & Deponieren',
      bgColor: 'bg-torch-red hover:bg-red-700',
      activeColor: 'bg-red-700 ring-4 ring-red-200',
      textColor: 'text-red-900',
      panelBg: 'bg-red-50 border-red-200',
      description: 'Letzte Option. Verbrennung von Holz/Kunststoffen zur Energiegewinnung oder Ablagerung auf Deponien (z.B. asbesthaltige Stoffe, Bauschutt ohne Recyclingpotenzial).',
      examples: ['Thermische Verwertung von behandeltem Altholz (A IV)', 'Deponierung von asbesthaltigen Faserzementplatten', 'Müllverbrennung von nicht trennbaren Verbundstoffen']
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <RotateCcw className="text-shiraz animate-spin-slow" /> Kreislaufwirtschaft (Circular Economy)
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Kreislaufwirtschaft im Bauwesen zielt darauf ab, den Ressourcenverbrauch zu minimieren, Abfälle zu vermeiden und Materialien so lange wie möglich in geschlossenen Kreisläufen zu halten. 
            Der Bausektor ist für über 50% des weltweiten Ressourcenverbrauchs und Abfallaufkommens verantwortlich, weshalb ein Umdenken vom linearen Modell ("Take-Make-Dispose") zwingend erforderlich ist.
          </p>
        </div>

        <div className="p-4 bg-slate-50/50 rounded-2xl border border-rose-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { id: 'grundlagen' as const, label: 'R-Strategien & Urban Mining', icon: RotateCcw },
              { id: 'abfaelle' as const, label: 'Massen & Aufbereitung', icon: Building2 },
              { id: 'probleme' as const, label: 'Stoffverbünde & Schadstoffe', icon: AlertTriangle },
              { id: 'rueckbauplanung' as const, label: 'Rückbauplanung & Re-Use', icon: ClipboardCheck },
              { id: 'zirkularitaet' as const, label: 'Zirkularitäts-Indizes', icon: Calculator }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button aria-pressed={isActive}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center h-full cursor-pointer ${
                    isActive 
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm' 
                      : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-shiraz' : 'text-slate-500'} />
                  <span className="text-xs font-bold leading-tight">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'grundlagen' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            {/* R-Strategien */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw size={20} className="text-shiraz" /> Die R-Strategien (Hierarchie)
              </h3>
              
              <div className="flex flex-col items-center w-full gap-2 mt-2">
                {strategies.map((s, index) => (
                  <React.Fragment key={s.id}>
                    <button aria-pressed={activeStrategy === s.id}
                      onClick={() => setActiveStrategy(s.id)}
                      className={`relative py-3 px-4 rounded-xl flex items-center justify-between text-white font-bold transition-all duration-300 w-full hover:-translate-y-0.5 shadow-sm ${activeStrategy === s.id ? s.activeColor : s.bgColor}`}
                      style={{ maxWidth: `${100 - index * 6}%` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-sm">{formatDeWert(s.id)}</div>
                        <span className="text-left text-sm sm:text-base">{s.name}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium hidden sm:block truncate ml-2">{s.label}</span>
                    </button>
                    {activeStrategy === s.id && (
                      <div className={`w-full my-2 p-5 rounded-2xl border shadow-inner animate-in fade-in slide-in-from-top-2 duration-300 ${s.panelBg}`}>
                        <h4 className={`font-bold text-lg mb-2 flex items-center gap-2 ${s.textColor}`}>
                          {s.name} <span className="text-sm font-normal opacity-70">({s.label})</span>
                        </h4>
                        <p className={`text-sm mb-4 leading-relaxed ${s.textColor}/80`}>{s.description}</p>
                        <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                          <strong className={`block text-xs uppercase tracking-wider mb-2 font-bold ${s.textColor}`}>Typische Anwendungsbeispiele:</strong>
                          <ul className={`list-disc list-inside text-sm space-y-1.5 ${s.textColor}/90`}>
                            {s.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Urban Mining & Design */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <Recycle size={20} className="text-shiraz" /> Qualitäten des Recyclings
                </h3>
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-home-grau/30 p-3 rounded-lg text-sm">
                    <strong className="text-slate-800">Downcycling (Wertminderung):</strong>
                    <p className="text-slate-600 mt-1">
                      Das Material wird verwertet, aber die Qualität oder Funktionalität sinkt. Es entsteht ein minderwertigeres Produkt.
                      <br/><span className="text-shiraz font-medium">Beispiel:</span> Hochwertiger Bauschutt aus Betonmauerwerk wird gebrochen und lediglich als Schotter-Tragschicht im Straßenbau verwendet.
                    </p>
                  </div>
                  <div className="bg-sky-50 border border-sky-200 p-3 rounded-lg text-sm">
                    <strong className="text-sky-800">Recycling (Gleichwertig):</strong>
                    <p className="text-sky-600 mt-1">
                      Das Material wird aufbereitet und behält seine ursprüngliche Qualität und Funktion.
                      <br/><span className="text-shiraz font-medium">Beispiel:</span> Stahlschrott wird ohne Qualitätsverlust im Elektrolichtbogenofen eingeschmolzen und zu neuem Betonstahl verarbeitet.
                    </p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-sm">
                    <strong className="text-emerald-800">Upcycling (Wertsteigerung):</strong>
                    <p className="text-emerald-600 mt-1">
                      Das abfallende Material wird aufgewertet und für ein höheres oder wertigeres Endprodukt verwendet.
                      <br/><span className="text-shiraz font-medium">Beispiel:</span> Alte Gerüstbohlen oder abgerissene Holzstrukturen werden zu hochwertigen Möbeln verarbeitet.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <Box size={20} className="text-shiraz" /> Urban Mining &amp; Gebäuderessourcenpässe
                </h3>
                <p className="text-sm text-slate-700 mb-3">
                  Betrachtet die gebaute Umwelt (Städte) als Rohstofflager der Zukunft. Das Gebäude wird als Materialdatenbank verstanden.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 list-disc list-inside">
                  <li><strong>Gebäudepass / Materialpass (z.B. Madaster):</strong> Digitale Zwillinge, die exakt dokumentieren, welche Materialien in welchen Mengen und Qualitäten wo im Gebäude verbaut sind.</li>
                  <li><strong>Rückbaukataster:</strong> Erfassung von Gebäuden, die abgerissen werden, um Materialien gezielt zu bergen und in die Lieferkette zurückzuführen.</li>
                  <li><strong>Sekundärrohstoffe:</strong> Aktive Nutzung von umgearbeiteten Rohstoffen (z.B. RC-Gesteinskörnung, Altholz, recycelter Baustahl) statt Primärmaterialausbeutung.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'abfaelle' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="text-shiraz" /> Anfallende Baustoffmassen & Verwertungswege
              </h2>
              <p className="text-sm text-slate-700">
                Bau- und Abbruchabfälle stellen mit über 50 % des Bruttoabfallaufkommens (über 200 Mio. Tonnen jährlich) in Deutschland den größten Abfallstrom dar.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-slate-900 mb-2">Bodenaushub (Boden / Steine)</h4>
                  <div className="text-lg font-bold text-slate-900 mb-1">ca. 130 Mio. t / Jahr</div>
                  <p className="text-sm text-slate-700"><strong>Verwertungswege:</strong> Vorrangig Verfüllung von Abgrabungen, Deponiebau, Landschaftsbau.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-slate-900 mb-2">Bauschutt (Mineralisch)</h4>
                  <div className="text-lg font-bold text-slate-900 mb-1">ca. 60 Mio. t / Jahr</div>
                  <p className="text-sm text-slate-700"><strong>Verwertungswege:</strong> Recyclingbaustoffe (Straßenbauunterbau), Anteilig für R-Beton. Viel Downcycling.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-slate-900 mb-2">Straßenaufbruch (Asphalt)</h4>
                  <div className="text-lg font-bold text-slate-900 mb-1">ca. 20 Mio. t / Jahr</div>
                  <p className="text-sm text-slate-700"><strong>Verwertungswege:</strong> Asphaltrecycling (sehr hohe Quote an direkter Wiederverwertung im Mischgut).</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 lg:col-span-3">
                  <h4 className="font-bold text-slate-900 mb-2">Sonstige Bauabfälle (Gips, Holz, Kunststoffe, Metalle)</h4>
                  <div className="text-lg font-bold text-slate-900 mb-1">ca. 15 Mio. t / Jahr</div>
                  <p className="text-sm text-slate-700"><strong>Verwertungswege:</strong> Metalle (vollständiges Recycling), Holz/Kunststoffe (oft energetische Verwertung bzgl. Verunreinigungen), Gips (teilweise Gipsrecycling-Anlagen).</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="text-shiraz" /> Aufbereitungsverfahren nach Materialien
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-stone-500 p-4 rounded-xl">
                  <h4 className="font-bold text-stone-800 mb-2 border-b border-stone-200 pb-2">Mineralische Baustoffe (Beton, Mauerwerk)</h4>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li><strong>Verfahren:</strong> Brechen (Backenbrecher, Prallmühle), Sieben, Sichten (Trennen durch Luftstrom), sensorgestützte Sortierung, ggf. Waschen.</li>
                    <li><strong>Verwertungsquote:</strong> Sehr hoch (&gt; 90 %), jedoch findet überwiegend <em>Downcycling</em> statt (Schottertragschichten im Straßenbau). Zirkulär wäre hochwertiges Recycling als Gesteinskörnung für R-Beton (Hochbau).</li>
                  </ul>
                </div>
                <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-indigo-500 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-800 mb-2 border-b border-home-grau/30 pb-2">Metalle (Stahlbeton, Alu, Profilbahnen)</h4>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li><strong>Verfahren:</strong> Magnetabscheidung (Eisenmetalle), Wirbelstromabscheidung (NE-Metalle wie Aluminium/Kupfer), Shreddern, anschließendes Umschmelzen im Elektrolichtbogenofen (Elektrostahl).</li>
                    <li><strong>Verwertungsquote:</strong> Nahe 100 %. Metalle lassen sich praktisch ohne Qualitätsverlust unendlich oft recyceln.</li>
                  </ul>
                </div>
                <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 p-4 rounded-xl">
                  <h4 className="font-bold text-amber-900 mb-2 border-b border-amber-200 pb-2">Bauholz & Holzwerkstoffe</h4>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li><strong>Verfahren:</strong> Schreddern, Altholzverordnung (Klassifizierung A I bis A IV je nach Schadstoffbelastung).</li>
                    <li><strong>Verwertungsquote:</strong> Hohe Erfassung, aber stark limitiertes stoffliches Recycling (z.B. Nutzung für Spanplatten nur bei A I / A II). Behandeltes Holz (A III / A IV) wird fast ausschließlich <em>energetisch verwertet</em> (Biomasseheizkraftwerke).</li>
                  </ul>
                </div>
                <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-blue-500 p-4 rounded-xl">
                  <h4 className="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-2">Kunststoffe & Dämmstoffe</h4>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li><strong>Verfahren:</strong> Zerkleinerung, Extrusion (werkstofflich), Auflösung (z.B. CreaSolv für EPS), oder Müllverbrennung (thermisch).</li>
                    <li><strong>Verwertungsquote:</strong> Im Baubereich oft gering bzgl. werkstofflichem Recycling, da Kunststoffe oft als Verbundmaterialien (z.B. WDVS, geklebte Bodenbeläge) vorliegen oder mit Brandschutzmitteln kontaminiert sind. Meist noch energetische Verwertung.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'probleme' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            
            <div className="bg-white rounded-2xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="text-shiraz" /> Problematische Stoffverbünde & Bauweisen
              </h2>
              <p className="text-sm text-slate-700">
                Die moderne Bauweise hat die bauphysikalischen und statischen Eigenschaften von Bauteilen optimiert, oft auf Kosten der Kreislauffähigkeit. Materialien werden stark miteinander verbunden, was das Trennen beim Rückbau erschwert.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <div className="flex items-center gap-2 text-torch-red font-bold mb-2">
                    <ArrowDown size={18} /> Verbundbauweise (hemmt Zirkularität)
                  </div>
                  <p className="text-sm text-slate-500 mb-3">
                    Stoffe werden nass in nass, geklebt oder untrennbar mechanisch verbunden. Ein materialreines Trennen ist am "End of Life" unwirtschaftlich oder unmöglich.
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    <li><strong>Wärmedämmverbundsysteme (WDVS):</strong> Verklebter EPS-Dämmstoff mit Putz und Armierungsgewebe. Wird oft komplett verbrannt oder auf Deponien entsorgt.</li>
                    <li><strong>Ortbeton & Nassestriche:</strong> Monolithische Verbindungen verschiedener Lagen (z.B. Verbundestrich auf Beton). Trennung nur durch aufwendiges Fräsen/Abspitzen.</li>
                    <li><strong>Verklebte Bodenbeläge:</strong> Teppiche, PVC oder Parkett vollflächig mit starken Dispersionsklebern fixiert.</li>
                    <li><strong>Verbundwerkstoffe (GFK, CFK):</strong> Faserverstärkte Kunststoffe können aufgrund der Verklebung der Matrix fast nicht vollständig sortenrein recycelt werden.</li>
                  </ul>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                    <ArrowRight size={18} /> Design for Disassembly (DfD)
                  </div>
                  <p className="text-sm text-emerald-800/80 mb-3">
                    Konstruieren für den Rückbau: Gebäude so planen, dass sie am Ende der Nutzung sortenrein und zerstörungsfrei demontiert (dekonstruiert) werden können.
                  </p>
                  <ul className="list-disc list-inside text-xs text-emerald-800/80 space-y-1">
                    <li><strong>Trockene Verbindungen:</strong> Verschraubungen, Verbolzen oder Stecken statt Kleben oder Gießen (Betonieren).</li>
                    <li><strong>Modulares Bauen:</strong> Vorfertigung im Holz- oder Stahlbau, wo ganze Module oder Wandelemente umgenutzt werden können.</li>
                    <li><strong>Trennschichten:</strong> Einbau von definierten Gleit- oder Trennschichten zwischen Schichten unterschiedlicher Lebensdauer (Rohbau vs. Ausbau).</li>
                    <li><strong>Sichtbare Leitungsführung:</strong> Installationen ("TGA") werden nicht eingeputzt, sondern bleiben zugänglich für leichte Wartung und Austausch.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-shiraz" /> Stör- und Schadstoffe
              </h2>
              <p className="text-sm text-slate-700">
                Die Präsenz von Schadstoffen in Bestandsgebäuden verhindert oft eine direkte Wiederverwendung oder ein hochwertiges Recycling (Kontamination von Sekundärrohstoffen).
              </p>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-900 mb-1">Historische Bauschadstoffe (Asbest, PCB, PAK)</h4>
                  <p className="text-sm text-slate-500 mb-2">
                    In Gebäuden, die vor 1993/95 gebaut wurden, sind häufig starke Toxine verbaut. Solche Materialien müssen aufwendig ausgebaut und auf Sondermülldeponien (Deponieklasse DK III) abgelagert oder bei Hochtemperatur verbrannt werden. Ein Recycling ist verboten (Gefahr der "Re-Toxifizierung" der geschlossenen Kreisläufe).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-2 rounded border border-home-grau/30 text-xs">
                      <strong className="text-shiraz">Asbest:</strong> In Faserzementplatten, Brandschutzklappen, Floor-Flex-Platten.
                    </div>
                    <div className="bg-white p-2 rounded border border-home-grau/30 text-xs">
                      <strong className="text-shiraz">PAK:</strong> Teerhaltige Klebstoffe unter Parkett, Dachpappen. Gefährden das Asphaltrecycling, wenn ausgebaut.
                    </div>
                    <div className="bg-white p-2 rounded border border-home-grau/30 text-xs">
                      <strong className="text-shiraz">PCB / PCP:</strong> Fugenmassen, elastische Dichtstoffe, alte Holzschutzmittel (AIV Altholz).
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-900 mb-1">Additive und Störstoffe in modernen Baustoffen</h4>
                  <p className="text-sm text-slate-500 mb-2">
                    Auch neuere Materialien können problematische Zuschläge enthalten, die das spätere Recycling erschweren:
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    <li><strong>HBCD (Hexabromcyclododecan):</strong> Flammschutzmittel in alten EPS/XPS-Dämmstoffen. Dämmstoffe mit HBCD gelten als Problemabfall und müssen zerstört (verbrannt) werden (POP-Verordnung).</li>
                    <li><strong>Gips im Betonrecycling:</strong> Schon geringste Anteile an Gips (Sulfat) aus Putzanhaftungen können recycelten Sand oder Kies kontaminieren und spätere Ettringit-Treibreaktionen im Frischbeton hervorrufen.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'rueckbauplanung' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* Info Banner on Concular and Standards */}
            <div className="bg-white p-6 rounded-2xl border border-home-grau/30">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-3">
                <Recycle className="text-shiraz animate-spin" size={20} />
                Rückbauplanung &amp; Kreislaufwirtschaft im Bauwesen
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Um den Rohstoffverbrauch und Abfälle im Baubereich drastisch zu reduzieren, schreibt die moderne Kreislaufwirtschaft vor, Bestandsgebäude vor einem Teil- oder Vollrückbau nach technischen Standards systematisch zu auditieren. Durch die Verknüpfung mit Akteuren wie <strong>Concular</strong> (Deutschlands führender Marktplatz für zirkuläres Bauen) werden Bauteile im urbanen Bestand erfasst und vermittelt, statt deponiert zu werden.
              </p>

              {/* Standards Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
                  <h4 className="font-bold text-xs text-shiraz mb-1.5 flex items-center gap-1">
                    <ClipboardCheck size={14} /> DIN SPEC 91484 (Erkundung)
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Beschreibt das standardisierte <strong>Verfahren zur Bauwerkserkundung</strong> vor Abbruch- und Renovierungsarbeiten. Bestimmt Schadstoffbehaftung, Separierbarkeit und katalogisiert Re-Use taugliche Bauteile. Schafft Rechtssicherheit für Planer und Abbruchunternehmen.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
                  <h4 className="font-bold text-xs text-purple-700 mb-1.5 flex items-center gap-1">
                    <Building size={14} /> DIN SPEC 91525 (Materialpass)
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Definiert Kriterien zur <strong>Bewertung der Rezyklierbarkeit &amp; Wiederverwendbarkeit</strong> von Tragwerkselementen und Ausbaukomponenten. Bildet das normative Fundament des digitalen Gebäuderessourcenpasses und zirkulären Restwertermittlung.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/40 border border-shiraz/10 rounded-xl">
                  <h4 className="font-bold text-xs text-shiraz mb-1.5 flex items-center gap-1">
                    <Globe size={14} /> Concular Vermittlung
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Ermöglicht durch <strong>digitale Bestandserfassung</strong> per Scan-App, mobile Schadstoffabgleiche und automatisiertes Matching das Einstellen gebrauchter Baukomponenten in den B2B-Kreislaufmarkt. Verringert die Scope-3 Emissionen von Anschlussprojekten nachhaltig.
                  </p>
                </div>
              </div>
            </div>

            {/* Catalog & Simulation Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Hand: Audited Items Catalog (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* DIN Audit Checklist progress indicator */}
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <ClipboardCheck size={14} className="text-shiraz" />
                    Prüfphasen nach DIN SPEC 91484 Checkliste
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { key: 'researchDone', label: '1. Hist. Recherche', desc: 'Archiv & Bauakte prüfen' },
                      { key: 'inspectionDone', label: '2. Begehung vor Ort', desc: 'Visuelle Bestandsaufnahme' },
                      { key: 'substancesSampled', label: '3. Schadstoffanalyse', desc: 'Gefahrgut & Probenahme' },
                      { key: 'reuseInventoryCreated', label: '4. Re-Use Inventar', desc: 'Verbindungstyp erfassen' },
                      { key: 'reportingAccepted', label: '5. Erkundungsbericht', desc: 'Offizielle Freigabe' }
                    ].map((phase) => (
                      <button
                        key={phase.key}
                        onClick={() => {
                          setDinPreDemChecklist({
                            ...dinPreDemChecklist,
                            [phase.key]: !dinPreDemChecklist[phase.key as keyof typeof dinPreDemChecklist]
                          });
                        }}
                        className={`p-2.5 rounded-lg border text-left transition-all/150 flex flex-col justify-between cursor-pointer ${
                          dinPreDemChecklist[phase.key as keyof typeof dinPreDemChecklist]
                            ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900 shadow-sm'
                            : 'border-home-grau/30 bg-white hover:bg-slate-50 text-slate-400'
                        }`}
                      >
                        <span className="text-[14px] leading-none shrink-0 block font-bold mb-1.5">
                          {dinPreDemChecklist[phase.key as keyof typeof dinPreDemChecklist] ? '✓' : '○'}
                        </span>
                        <div>
                          <div className="text-[10px] font-bold leading-tight">{phase.label}</div>
                          <div className="text-[8px] opacity-75 mt-0.5 leading-normal">{phase.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Material Assessment Component Table */}
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-home-grau/30 pb-2 flex-wrap gap-2">
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <FileSpreadsheet size={16} className="text-shiraz animate-pulse" />
                        Erkunder-Datenblatt: Bauteil-Inventar (Auditierung)
                      </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Erfassen und bewerten Sie Bauteile für den Rückbauprozess.
          </p>
        </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                      Erfasste Gattungen: {auditComponents.length}
                    </span>
                  </div>

                  {/* Grid Header */}
                  <div className="hidden md:grid grid-cols-12 gap-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <div className="col-span-4">Bauteilname &amp; Kategorie</div>
                    <div className="col-span-2 text-center">Wege/Kanal</div>
                    <div className="col-span-2 text-center">Fügungsart (DIN 91525)</div>
                    <div className="col-span-2 text-center">Schadstoffstatus</div>
                    <div className="col-span-1 text-right">Menge</div>
                    <div className="col-span-1 text-center">Aktion</div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2.5">
                    {auditComponents.map((comp) => {
                      const isHazardous = comp.hazardousSubstance !== 'none';
                      return (
                        <div
                          key={comp.id}
                          className={`p-3 border rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center transition-all ${
                            isHazardous
                              ? 'bg-rose-50/30 border-rose-200 text-rose-900'
                              : comp.connectionType === 'geklebt_vergossen'
                              ? 'bg-slate-50/60 border-home-grau/30 text-slate-600'
                              : 'bg-white border-home-grau/30 hover:border-home-grau/30 shadow-sm'
                          }`}
                        >
                          {/* Title & Category Info */}
                          <div className="col-span-12 md:col-span-4 flex flex-col gap-0.5">
                            <strong className="text-xs text-slate-900 font-bold leading-snug">{comp.name}</strong>
                            <span className="text-[9px] font-mono uppercase font-bold text-slate-400">
                              {comp.category} &bull; {formatDeWert(comp.weightKgPerUnit)} kg/{comp.unit}
                            </span>
                          </div>

                          {/* Lifecycle/Recycling channel */}
                          <div className="col-span-6 md:col-span-2">
                            <label className="block md:hidden text-[9px] font-bold text-slate-400 uppercase mb-0.5 font-mono">Materielles Zielverfahren</label>
                            <select aria-label="Materielles Zielverfahren"
                              disabled={isHazardous}
                              value={comp.targetChannel}
                              onChange={(e) => updateAuditComponent(comp.id, 'targetChannel', e.target.value)}
                              className="w-full text-xs font-medium p-1 border border-home-grau/30 rounded-md bg-white text-slate-800 disabled:opacity-50"
                            >
                              <option value="reuse">Re-Use (Wiederverwendung)</option>
                              <option value="recycle">Recycling (Verwertung)</option>
                              <option value="disposal">Disposal (Sonderdeponie)</option>
                            </select>
                          </div>

                          {/* Connection separability (Dry-joint / modularity assessment) */}
                          <div className="col-span-6 md:col-span-2">
                            <label className="block md:hidden text-[9px] font-bold text-slate-400 uppercase mb-0.5 font-mono">Verbindungsklasse</label>
                            <select aria-label="Verbindungsklasse"
                              value={comp.connectionType}
                              onChange={(e) => updateAuditComponent(comp.id, 'connectionType', e.target.value)}
                              className="w-full text-xs font-semibold p-1 border border-home-grau/30 rounded-md bg-white text-slate-800"
                            >
                              <option value="geschraubt">Geschraubt (Klasse A)</option>
                              <option value="gesteckt">Gesteckt / Bolzen (Klasse B)</option>
                              <option value="genagelt_geklemmt">Genagelt / Geklemmt (Klasse C)</option>
                              <option value="geklebt_vergossen">Geklebt / Vergossen (Klasse D)</option>
                            </select>
                          </div>

                          {/* Pre-scrutinized hazards */}
                          <div className="col-span-6 md:col-span-2">
                            <label className="block md:hidden text-[9px] font-bold text-slate-400 uppercase mb-0.5 font-mono">Schadstoffe</label>
                            <select aria-label="Schadstoffe"
                              value={comp.hazardousSubstance}
                              onChange={(e) => updateAuditComponent(comp.id, 'hazardousSubstance', e.target.value)}
                              className={`w-full text-xs font-bold p-1 border rounded-md bg-white ${
                                isHazardous ? 'text-shiraz border-rose-300' : 'text-slate-800 border-home-grau/30'
                              }`}
                            >
                              <option value="none">Schadstofffrei</option>
                              <option value="asbest">Asbest-behaftet</option>
                              <option value="kMF">Künstliche Mineralfaser (KMF)</option>
                              <option value="pCB_pCP">PCB- / PCP-behaftet</option>
                              <option value="unclear">Klärungsbedarf (Labor)</option>
                            </select>
                          </div>

                          {/* Quantity */}
                          <div className="col-span-4 md:col-span-1 md:text-right">
                            <label className="block md:hidden text-[9px] font-bold text-slate-400 uppercase mb-0.5">Menge</label>
                            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {formatDeWert(comp.quantity)} {comp.unit}
                            </span>
                          </div>

                          {/* Removal button */}
                          <div className="col-span-2 md:col-span-1 text-center">
                            <button
                              onClick={() => removeAuditComponent(comp.id)}
                              className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 cursor-pointer"
                              title="Bauteil löschen"
                            >
                              <Trash2 size={14} className="mx-auto" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add New Component Manual Audit Form (DIN SPEC Standard) */}
                  <div className="mt-4 pt-4 border-t border-home-grau/30 bg-slate-50/40 p-4 rounded-2xl border border-home-grau/30 flex flex-col gap-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Neues Bauteil manuell auditieren (DIN SPEC 91484 standardgerecht)
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                      <div className="lg:col-span-4">
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Bauteilname / Bezeichnung</label>
                        <input
                          type="text"
                          placeholder="z.B. Stahlträger HEB 240, Innentür, etc."
                          value={newCompName}
                          onChange={(e) => setNewCompName(e.target.value)}
                          className="w-full text-xs p-2 border border-home-grau/30 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-shiraz"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Kategorie</label>
                        <select aria-label="Kategorie"
                          value={newCompCat}
                          onChange={(e) => setNewCompCat(e.target.value as typeof newCompCat)}
                          className="w-full text-xs p-2 border border-home-grau/30 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-shiraz"
                        >
                          <option value="Metall">Metall (Aluminium/Stahl)</option>
                          <option value="Holz">Nachwachsend (Holz)</option>
                          <option value="Mineralisch">Mineralisch (Beton/Ziegel)</option>
                          <option value="Technik">Haustechnik (TGA)</option>
                          <option value="Sonstiges">Sonstige Baustoffe</option>
                        </select>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Fügungsart</label>
                        <select aria-label="Fügungsart"
                          value={newCompConn}
                          onChange={(e) => setNewCompConn(e.target.value as typeof newCompConn)}
                          className="w-full text-xs p-2 border border-home-grau/30 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-shiraz"
                        >
                          <option value="geschraubt">Geschraubt (demontabel)</option>
                          <option value="gesteckt">Gesteckt (leicht trennbar)</option>
                          <option value="genagelt_geklemmt">Genagelt / Geklemmt</option>
                          <option value="geklebt_vergossen">Geklebt / Vergossen</option>
                        </select>
                      </div>

                      <div className="lg:col-span-1">
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Menge</label>
                        <input aria-label="Menge"
                          type="number"
                          min="1"
                          value={newCompQty}
                          onChange={(e) => setNewCompQty(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full text-xs p-1.5 border border-home-grau/30 rounded-lg text-center bg-white font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-shiraz"
                        />
                      </div>

                      <div className="lg:col-span-1">
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Einheit</label>
                        <select aria-label="Einheit"
                          value={newCompUnit}
                          onChange={(e) => setNewCompUnit(e.target.value as typeof newCompUnit)}
                          className="w-full text-xs p-1.5 border border-home-grau/30 rounded-lg bg-white text-slate-900 focus:outline-none"
                        >
                          <option value="Stk">Stk</option>
                          <option value="m²">m²</option>
                          <option value="t">t</option>
                        </select>
                      </div>

                      <div className="lg:col-span-2 flex items-end">
                        <button
                          onClick={addAuditComponent}
                          className="bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs p-2.5 rounded-lg flex items-center gap-1.5 w-full justify-center shrink-0 cursor-pointer select-none transition-all"
                        >
                          <Plus size={14} /> Auditieren
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Hand: Concular API sync & matching metrics */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Concular matching core dashboard */}
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-home-grau/30 pb-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1">
                      <Globe className="text-shiraz" size={14} />
                      Concular API Integrations-Hub
                    </h4>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase ${
                      concularConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {concularConnected ? 'API Connected' : 'Disconnected'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-normal leading-relaxed">
                    Übertragen Sie den Bauteilkatalog direkt per Schnittstelle an die Concular-Matching-Datenbank. Dort werden Ihre Komponenten vollautomatisiert mit Baustellen abgeglichen, die nach gebrauchten Materialien suchen.
                  </p>

                  {concularConnected ? (
                    /* Connected State Screen */
                    <div className="bg-emerald-50/50 p-4 border border-emerald-200 rounded-xl space-y-3.5 animate-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-emerald-100 rounded text-emerald-700 font-bold text-xs select-none">
                          ✓
                        </div>
                        <div>
                          <strong className="text-xs text-emerald-900 block font-bold leading-none">Abgleich mit Marktplatz active</strong>
                          <span className="text-[9px] text-emerald-500 font-mono mt-0.5 block">Endpoint: api.concular.de/v1/sync</span>
                        </div>
                      </div>

                      {/* API Stats Matches */}
                      <div className="grid grid-cols-2 gap-2 text-center text-xs font-normal">
                        <div className="bg-white p-2 border border-home-grau/30 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase font-mono">Nachfrage Matches</span>
                          <strong className="text-sm font-bold text-emerald-700 block mt-0.5">{matchingMatchedCount} Bauteile</strong>
                        </div>
                        <div className="bg-white p-2 border border-home-grau/30 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase font-mono">Emissionszertifikat</span>
                          <strong className="text-sm font-bold text-emerald-700 block mt-0.5">Scope 3 Ready</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => setConcularConnected(false)}
                        className="text-[10px] font-bold text-slate-400 block mx-auto hover:text-red-500 transition-colors cursor-pointer"
                      >
                        Kopplung trennen
                      </button>
                    </div>
                  ) : (
                    /* Disconnected State Screen */
                    <div className="bg-slate-50 p-4 border border-home-grau/30 rounded-xl flex flex-col gap-3">
                      <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 text-center text-xs text-slate-500 flex flex-col gap-1 items-center justify-center">
                        <AlertTriangle size={18} className="text-shiraz" />
                        <span>Keine aktive Bauteilvermittlung verknüpft</span>
                      </div>

                      <button
                        disabled={isMatching}
                        onClick={runConcularMatching}
                        className="bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs p-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm select-none cursor-pointer disabled:opacity-50"
                      >
                        {isMatching ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                            <span>Matching läuft...</span>
                          </>
                        ) : (
                          <>
                            <Globe size={14} />
                            <span>Vermittlung aktivieren (Concular Sync)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Show simulated JSON API Request payloads */}
                  <div className="border-t border-home-grau/30 pt-3">
                    <button
                      onClick={() => setShowPayloadSchema(!showPayloadSchema)}
                      className="text-xs text-shiraz font-bold flex items-center justify-between w-full hover:underline cursor-pointer select-none"
                    >
                      <span>{showPayloadSchema ? '▼' : '►'} Entwickler: API JSON-Schema einsehen</span>
                      <span className="text-[9px] uppercase tracking-wider font-mono font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-home-grau/30">JSON-Payload</span>
                    </button>

                    {showPayloadSchema && (
                      <div className="mt-3 space-y-2 animate-in slide-in-from-top-1 duration-200">
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Dieses strukturierte JSON-Payload wird per REST POST Request an den Concular-Datenendpunkt übertragen. Entwickler binden dies im ERP, BIM (REVIT) oder IFC-Dateimanager ein:
                        </p>
                        <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-[9px] overflow-x-auto select-all font-mono leading-normal shadow-inner max-h-56">
{`{
  "api_version": "2026.1",
  "auth_header": "Bearer cnc_live_84b39a...",
  "audit_standard": "DIN_SPEC_91484",
  "valuation_standard": "DIN_SPEC_91525",
  "project_reference": "praxis-abbruch-dgnb2026",
  "total_components": ${auditComponents.length},
  "export_date": "2026-05-27T18:30Z",
  "components": [
${auditComponents.slice(0, 2).map(c => `    {
      "component_id": "${c.id}",
      "label": "${c.name}",
      "quantity": ${c.quantity},
      "unit": "${c.unit === 'Stk' ? 'pcs' : c.unit}",
      "material_class": "${c.category.toLowerCase()}",
      "connection_separability_grade": "${c.connectionType === 'geschraubt' ? 'Grade A (screwed)' : c.connectionType === 'gesteckt' ? 'Grade B (unmated)' : 'Grade D (glued)'}",
      "hazardous_status": "${c.hazardousSubstance === 'none' ? 'free_of_hazards' : 'contaminated'}",
      "calculated_carbon_offset_kg": ${Math.round(c.quantity * c.weightKgPerUnit * (c.category === 'Metall' ? 4.3 : 1.45))}
    }`).join(',\n')}
    ...
  ]
}`}
                        </pre>
                      </div>
                    )}
                  </div>

                </div>

                {/* Dynamic Scorecard for Rückbauplanung */}
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-home-grau/30 pb-1 flex items-center gap-1">
                    <Activity size={12} className="text-shiraz" />
                    Ressourcen- und Vermittlungsbilanz
                  </h4>

                  <div className="space-y-3">
                    
                    {/* Total Weight Audited */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/30 flex justify-between items-center">
                      <div>
                        <strong className="text-xs text-slate-900 block leading-tight">Masse im Baubestand</strong>
                        <span className="text-[10px] text-slate-400">Kumuliertes Gewicht des Inventars</span>
                      </div>
                      <strong className="text-[15px] font-mono text-slate-900 font-bold">
                        {formatDeZahl(auditStats.totalWeightTons, 2)} t
                      </strong>
                    </div>

                    {/* Re-Use Quote */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/30 flex justify-between items-center">
                      <div>
                        <strong className="text-xs text-slate-900 block leading-tight">Re-Use Quote nach Fügungsart</strong>
                        <span className="text-[10px] text-slate-400">Gezielte Zirkularität (DIN 91525)</span>
                      </div>
                      <strong className="text-[15px] font-mono text-shiraz font-bold">
                        {formatDeZahl(auditStats.averageReuseQuota, 1)} %
                      </strong>
                    </div>

                    {/* Carbon Offset Certification */}
                    <div className="bg-indigo-50/50 p-3 border border-indigo-200 rounded-xl flex justify-between items-center">
                      <div>
                        <strong className="text-xs text-indigo-900 block leading-tight">Vermeidbare Scope-3 CO₂-Emissionen</strong>
                        <span className="text-[10px] text-indigo-500">Durch vermittelten Re-Use Kreislauf</span>
                      </div>
                      <strong className="text-[15px] font-mono text-indigo-700 font-bold">
                        ~ {formatDeZahl(auditStats.totalAvoidedCo2Kg / 1000, 2)} t CO₂-eq
                      </strong>
                    </div>

                    {/* Financial Salvage Valuation (Ertragspotenzial) */}
                    <div className="bg-emerald-50/50 p-3 border border-emerald-200 rounded-xl flex justify-between items-center">
                      <div>
                        <strong className="text-xs text-emerald-950 block leading-tight">Geschätztes Marktwert-Potenzial</strong>
                        <span className="text-[10px] text-emerald-500">Restwert-Erlös auf Concular</span>
                      </div>
                      <strong className={`text-[15px] font-mono font-bold ${
                        auditStats.estimatedRevenueEur >= 0 ? 'text-emerald-700' : 'text-shiraz'
                      }`}>
                        {auditStats.estimatedRevenueEur >= 0 ? '+' : ''}{auditStats.estimatedRevenueEur.toLocaleString('de-DE')} €
                      </strong>
                    </div>

                  </div>

                  {/* Audit hazard alerts block */}
                  {auditStats.hazardCount > 0 && (
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex gap-1.5 items-start mt-1">
                      <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-rose-800 leading-normal font-normal">
                        <strong>Achtung:</strong> Es wurden/sind {auditStats.hazardCount} komponentenspezifische Schadstoffe (z.B. Asbest) markiert. Diese Bauteile fallen automatisch aus der Re-Use Kette und müssen kostenpflichtig fachgerecht demontiert und entsorgt werden.
                      </p>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        )}

        {activeTab === 'zirkularitaet' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {/* Urban Mining Index (UMI) Calculator */}
            <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-4">
              <div className="border-b border-home-grau/25 pb-3">
                <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
                  <Building2 size={20} className="text-shiraz" /> Urban Mining Index (UMI)
                </h3>
                <p className="text-xs text-text-main/70 mt-1 leading-relaxed">
                  Bewertet die Kreislauffähigkeit eines Gesamtgebäudes. Er vergleicht den Anteil an zirkulären Materialien in der Bauphase (Input) mit der Recycelbarkeit am Ende des Lebenswegs (Output). Entwickelt an der Bergischen Universität Wuppertal.
                </p>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/20">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-main/60 block mb-2 font-bold">Pre-Use Qualität (Input)</span>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 font-medium text-text-main">
                          <span>Wiederverwendete Bauteile (Reuse)</span>
                          <InfoTooltip text="Bauteile, die eins-zu-eins aus Abbruchobjekten ohne stoffliche Umwandlung übernommen wurden (z.B. historische KS-Ziegel, gusseiserne Säulen)." />
                        </div>
                        <span className="font-mono font-bold text-xs">{formatDeWert(umiReuseIn)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={umiReuseIn} 
                        onChange={(e) => setUmiReuseIn(Number(e.target.value))}
                        className="w-full accent-shiraz h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 font-medium text-text-main">
                          <span>Recyclingmaterialien (Sekundär)</span>
                          <InfoTooltip text="Baustoffe mit echtem Post-Consumer Recyclinganteil (z.B. RC-Beton mit gebrochener Gesteinskörnung, Holzwerkstoffe aus Altholzklasse A I/A II)." />
                        </div>
                        <span className="font-mono font-bold text-xs">{formatDeWert(umiRecyclingIn)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={umiRecyclingIn} 
                        onChange={(e) => setUmiRecyclingIn(Number(e.target.value))}
                        className="w-full accent-shiraz h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 font-medium text-text-main">
                          <span>Erneuerbare Rohstoffe (Nawaro)</span>
                          <InfoTooltip text="Biogene, nachwachsende Rohstoffe aus nachhaltigem Anbau (z.B. Konstruktionsvollholz (PEFC), Einblasdämmung aus Zellulose, Flachsfaserplatten)." />
                        </div>
                        <span className="font-mono font-bold text-xs">{formatDeWert(umiRenewableIn)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={umiRenewableIn} 
                        onChange={(e) => setUmiRenewableIn(Number(e.target.value))}
                        className="w-full accent-shiraz h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div className="text-[10px] text-text-main/50 text-right font-medium">Zirkuläre Input-Rate: <span className="font-bold text-text-main">{formatDeWert(umiInputRate)}%</span> (max. 100%)</div>
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/20">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-main/60 block mb-2 font-bold font-bold">Post-Use Qualität (Output)</span>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 font-medium text-text-main">
                          <span>Demontierbarkeit &amp; Re-Use Potential</span>
                          <InfoTooltip text="Bauteile, die zerstörungsfrei demontiert und an anderer Stelle wiederverwendet werden können (abhängig von Fügungsart)." />
                        </div>
                        <span className="font-mono font-bold text-xs">{formatDeWert(umiReuseOut)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={umiReuseOut} 
                        onChange={(e) => setUmiReuseOut(Number(e.target.value))}
                        className="w-full accent-shiraz h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 font-medium text-text-main">
                          <span>Kreislauf-Recyclingfähigkeit</span>
                          <InfoTooltip text="Werkstoffe, die durch sortenreine Trennung gleichwertig stofflich recycelt werden können (z.B. Kupferrohre, reiner Gips, PE-Noppenbahnen)." />
                        </div>
                        <span className="font-mono font-bold text-xs">{formatDeWert(umiRecyclingOut)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={umiRecyclingOut} 
                        onChange={(e) => setUmiRecyclingOut(Number(e.target.value))}
                        className="w-full accent-shiraz h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div className="text-[10px] text-text-main/50 text-right font-medium">Zirkuläre Output-Rate: <span className="font-bold text-text-main">{formatDeWert(umiOutputRate)}%</span> (max. 100%)</div>
                  </div>
                </div>

                <div className="p-4 bg-shiraz/5 rounded-xl border border-shiraz/20">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-text-main text-sm font-bold">Gewichteter Urban Mining Index</span>
                      <span className="text-[10px] text-text-main/60">Mittelwert aus (Input-Quote + Output-Quote)</span>
                    </div>
                    <span className={`text-2xl font-mono font-bold ${umiTotal >= 50 ? 'text-green-600' : 'text-amber-500'}`}>
                      {formatDeZahl(umiTotal, 1)} %
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${umiTotal >= 65 ? 'bg-green-600' : umiTotal >= 35 ? 'bg-amber-500' : 'bg-red-500'}`} 
                      style={{ width: `${umiTotal}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-text-main/70 bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                <strong className="block text-text-main mb-1 text-xs font-bold">Hintergrund &amp; DGNB-Nachweis</strong>
                Der UMI ist ein hocheffektives Werkzeug für das zirkuläre Planen von Neubauten. Die DGNB honoriert im Kriterium "ENV1.3 - Verantwortungsbewusste Ressourchengewinnung / Circular Economy" hohe UMI-Ergebnisse von Gebäuden prozentual im Gesamtaudit.
              </div>
            </div>

            {/* Circularity Index (MCI) Calculator */}
            <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-4">
              <div className="border-b border-home-grau/25 pb-3">
                <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
                  <Calculator size={20} className="text-purple-700" /> Zirkularitätsindex (MCI)
                </h3>
                <p className="text-xs text-text-main/70 mt-1 leading-relaxed">
                  Der Material Circularity Indicator (MCI) der Ellen MacArthur Foundation misst das lineare Strömen von Materialien im Produkt- oder Bauprozess. Ein Wert von 100% (1.0) bedeutet perfekte Zirkularität.
                </p>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/20 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-text-main/50 block font-bold">Zustrom (Input)</span>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-text-main">RC-Anteil</span>
                        <span className="font-mono font-bold text-xs">{formatDeWert(mciRecycledIn)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={mciRecycledIn} 
                        onChange={(e) => setMciRecycledIn(Number(e.target.value))}
                        className="w-full accent-purple-700 h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-text-main">Re-Use Bauteile</span>
                        <span className="font-mono font-bold text-xs">{formatDeWert(mciReusedIn)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={mciReusedIn} 
                        onChange={(e) => setMciReusedIn(Number(e.target.value))}
                        className="w-full accent-purple-700 h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-text-main/50 block font-bold">Rückstrom (Output)</span>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-text-main">Recyclingquote</span>
                        <span className="font-mono font-bold text-xs">{formatDeWert(mciRecycledOut)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={mciRecycledOut} 
                        onChange={(e) => setMciRecycledOut(Number(e.target.value))}
                        className="w-full accent-purple-700 h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-text-main">Wiederverwendung</span>
                        <span className="font-mono font-bold text-xs">{formatDeWert(mciReusedOut)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={mciReusedOut} 
                        onChange={(e) => setMciReusedOut(Number(e.target.value))}
                        className="w-full accent-purple-700 h-1.5 rounded-lg bg-stone-200 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/20">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-main/60 block mb-2 flex items-center gap-1 font-bold">
                    Nutzungskoeffizient (Utility) <InfoTooltip text="Setzt die geplante Lebensdauer und Nutzungsintensität des Gebäudes in Bezug zum Marktdurchschnitt." />
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-text-main mb-1">Gebäude-Lebensdauer</label>
                      <div className="flex items-center gap-1.5">
                        <input aria-label="Gebäude-Lebensdauer" 
                          type="number" min="0" 
                          value={lifespan} 
                          onChange={(e) => setLifespan(Number(e.target.value))}
                          className="w-full p-1.5 border border-home-grau/30 rounded-lg text-xs font-bold"
                        />
                        <span className="text-xs text-text-main/60 font-medium">a</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text-main mb-1 font-bold">Ø Branchen-Schnitt</label>
                      <div className="flex items-center gap-1.5">
                        <input aria-label="Ø Branchen-Schnitt" 
                          type="number" min="0" 
                          value={avgLifespan} 
                          onChange={(e) => setAvgLifespan(Number(e.target.value))}
                          className="w-full p-1.5 border border-home-grau/30 rounded-lg text-xs"
                        />
                        <span className="text-xs text-text-main/60 font-medium">a</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-text-main mb-1 font-bold">Nutzungshäufigkeit</label>
                      <input aria-label="Nutzungshäufigkeit" 
                        type="number" min="0" 
                        step="0.1"
                        value={intensity} 
                        onChange={(e) => setIntensity(Number(e.target.value))}
                        className="w-full p-1.5 border border-home-grau/30 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text-main mb-1 font-bold">Ø Branchen-Intensität</label>
                      <input aria-label="Ø Branchen-Intensität" 
                        type="number" min="0" 
                        step="0.1"
                        value={avgIntensity} 
                        onChange={(e) => setAvgIntensity(Number(e.target.value))}
                        className="w-full p-1.5 border border-home-grau/30 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-text-main text-sm font-bold">Material Circularity Indicator (MCI)</span>
                      <span className="text-[10px] text-text-main/60">Formel: 1 - LFI * F(U) </span>
                    </div>
                    <span className={`text-2xl font-mono font-bold ${circularityIndex >= 50 ? 'text-green-600' : 'text-amber-500'}`}>
                      {formatDeZahl(circularityIndex, 1)} %
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${circularityIndex >= 65 ? 'bg-green-600' : circularityIndex >= 35 ? 'bg-amber-500' : 'bg-red-500'}`} 
                      style={{ width: `${circularityIndex}%` }}
                    ></div>
                  </div>
                  <div className="mt-2.5 text-[10px] text-text-main/60 grid grid-cols-2 gap-2 border-t border-purple-100 pt-2 font-medium">
                    <div>Linearer Fluss-Faktor (LFI): <span className="font-mono text-xs font-bold text-text-main">{formatDeZahl(lfi * 100, 1)} %</span></div>
                    <div>Nutzungsfaktor (X): <span className="font-mono text-xs font-bold text-text-main">{formatDeZahl(utility, 2)}</span></div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-text-main/70 bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                <strong className="block text-text-main mb-1 text-xs font-bold">MCI-Bedeutung in der Wissenschaft</strong>
                Der MCI wurde 2015 von der Ellen MacArthur Foundation gemeinsam mit Granta Design entwickelt, um lineares Verschwenden quantifizierbar zu machen. Je höher der Koeffizient, desto resilienter ist ein zirkuläres System gegenüber unberechenbaren Primärrohstoffpreisen.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Material Circularity Indicator eines Fassadenelements"
        zielGleichung="\text{MCI} = 1 - \text{LFI} \cdot \frac{0{,}9}{X}"
        schritte={[
          { titel: 'Linear Flow Index', erklaerung: '40 % Rezyklatanteil im Input, 80 % stoffliche Verwertung am Lebensende; der lineare Anteil beträgt im Mittel (60 % + 20 %)/2:', formel: '\\text{LFI} = \\frac{0{,}60 + 0{,}20}{2} = 0{,}40' },
          { titel: 'Nutzungsfaktor', erklaerung: 'Lebensdauer doppelt so lang wie der Branchendurchschnitt, gleiche Nutzungsintensität:', formel: 'X = 2{,}0 \\cdot 1{,}0 = 2{,}0 \\Rightarrow F(X) = \\frac{0{,}9}{2{,}0} = 0{,}45' },
          { titel: 'MCI', erklaerung: 'Einsetzen:', formel: '\\text{MCI} = 1 - 0{,}40 \\cdot 0{,}45 = 0{,}82' }
        ]}
        ergebnisHinweis="Lange Nutzung wirkt so stark wie Rezyklat: Bei durchschnittlicher Lebensdauer (X = 1) läge der MCI nur bei 0,64. Die vollständige Methode berücksichtigt zusätzlich Ausbeuteverluste der Recyclingprozesse."
        normQuelle="Ellen MacArthur Foundation / Granta Design: Material Circularity Indicator (vereinfachte Lehrdarstellung)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Verwertungsquote eines Rückbauprojekts"
        zielGleichung="Q_{\text{stofflich}} = \frac{m_{\text{Recycling}} + m_{\text{Verfüllung}}}{m_{\text{gesamt}}}"
        schritte={[
          { titel: 'Massenbilanz', erklaerung: '1 200 t nicht gefährliche Bau- und Abbruchabfälle: 950 t Recycling (RC-Baustoffe), 120 t Verfüllung, 50 t energetische Verwertung, 80 t Deponie.', formel: '950 + 120 + 50 + 80 = 1\\,200\\,\\text{t}' },
          { titel: 'Stoffliche Verwertung', erklaerung: 'Recycling und Verfüllung zählen, energetische Verwertung nicht:', formel: 'Q = \\frac{950 + 120}{1\\,200} = 89\\,\\%' },
          { titel: 'Zielvorgabe', erklaerung: 'Mindestens 70 Gew.-% stoffliche Verwertung für nicht gefährliche Bau- und Abbruchabfälle:', formel: '89\\,\\% \\ge 70\\,\\%' }
        ]}
        ergebnisHinweis="Hochwertig ist erst die Rückführung in den Hochbau (z. B. RC-Beton); Verfüllung und Straßenunterbau sind Downcycling. Für mineralische Ersatzbaustoffe im technischen Bauwerk gilt die EBV."
        normQuelle="KrWG § 14; Abfallrahmenrichtlinie 2008/98/EG Art. 11 Abs. 2; EBV"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="kreislauf_dpp" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 7 Nachhaltigkeit: MCI- und UMI-Formeln, Rechtsgrundlagen und Literatur geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Kreislaufwirtschaft', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaft' },
          { title: 'Urban Mining', url: 'https://de.wikipedia.org/wiki/Urban_Mining' }
        ]}
        regelwerke={[
          { title: 'Kreislaufwirtschaftsgesetz (KrWG), u. a. § 14 (70 % Verwertung von Bau- und Abbruchabfällen)', url: 'https://www.gesetze-im-internet.de/krwg/' },
          { title: 'Ersatzbaustoffverordnung (EBV, in Kraft seit 01.08.2023; Novelle in Vorbereitung)', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' },
          { title: 'Ökodesign-Verordnung (EU) 2024/1781 (ESPR, Digitaler Produktpass) und Bauproduktenverordnung (EU) 2024/3110', url: 'https://eur-lex.europa.eu/' },
          { title: 'Gütegemeinschaft Kreislaufwirtschaft im Hochbau e.V.' }
        ]}
        literatur={[
          'Hebel, D. E.; Wisniewska, M. H.; Heisel, F.: Building from Waste – Recovered Materials in Architecture and Construction. Basel: Birkhäuser 2014',
          'Rosen, A.: Urban Mining Index – Entwicklung einer Systematik zur quantitativen Bewertung der Kreislaufkonsistenz von Baukonstruktionen in der Neubauplanung. Stuttgart: Fraunhofer IRB 2021',
          'Ellen MacArthur Foundation; Granta Design: Circularity Indicators – An Approach to Measuring Circularity. Methodology (2015, aktualisiert 2019)'
        ]}
        formeln={[
          {
            formel: "\\text{UMI}_{\\text{Gesamt}} = \\frac{\\text{Rate}_{\\text{Input}} + \\text{Rate}_{\\text{Output}}}{2} \\quad [\\%]",
            erklaerung: "Vereinfachte Lehrdarstellung des Urban Mining Index (UMI): Mittelung von Rezyklat-Input und stofflicher Verwertbarkeit nach der Nutzung (Output). Die Originalmethode gewichtet nach Verwertungsqualität (Wiederverwendung, Recycling, Downcycling).",
            quelle: "Rosen (2021), vereinfacht"
          },
          {
            formel: "\\text{MCI} = 1 - \\text{LFI} \\cdot F_u \\quad [-]",
            erklaerung: "Material Circularity Indicator (MCI): linearer Fluss (LFI) gewichtet mit dem Nutzungsfaktor F(X) = 0,9/X; X aus Lebensdauer und Nutzungsintensität relativ zum Branchendurchschnitt.",
            quelle: "Ellen MacArthur Foundation / Granta Design (2015)"
          }
        ]}
      />
    </div>
  );
}
