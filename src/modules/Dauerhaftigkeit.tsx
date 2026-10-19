import React, { useState } from 'react';
import { ShieldAlert, Sun, Droplets, Bug, Box, Mountain, Maximize, Layers, Activity, Zap, LucideIcon, Snowflake, Wind, Waves, FlaskConical, Hammer, AlertTriangle, BookOpen, ArrowRight, Check, X, AlertCircle } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { useTabContext } from '@/src/contexts/TabContext';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { formatDeZahl } from '@/src/utils/numberFormat';

type MaterialTab = 'prinzipien' | 'beton' | 'asphalte' | 'metalle' | 'holz' | 'kunststoffe' | 'naturstein' | 'glas' | 'unvertraeglichkeiten';

function WoodThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 mt-6">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Holz im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den drei Säulen der Holz-Baustofflehre:
        </p>
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
            <span>1. Baustoff-Kennwerte</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Anisotropes Quellen/Schwinden (3D-Modell), Holzfestigkeiten (EC5) & Kennwerte.
          </span>
          {current !== 'baustoff' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
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
            <span>2. Holzprodukte & Praxis</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Konstruktionsvollholz, CLT, Vor- und Nachteile & Vorbemessungsrechner.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
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
            <span>3. Dauerhaftigkeit</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Holzzerstörende Pilze/Insekten, Witterung & baulicher Holzschutz nach DIN 68800.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function PlasticsThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'kunststoffe');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 mt-6">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Kunststoffe im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den drei Säulen der Kunststoff-Werkstoffkunde:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('kunststoffe')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Baustoff-Eigenschaften</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Thermoplasten vs. Duroplasten, E-Modul-Temperatur-Scherkurven & Arten.
          </span>
          {current !== 'baustoff' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_kunststoffe')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Mechanik & Rechner</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            PE-HD Folien, PVC-U Rohre, Flachdachbahnen (EPDM) & Dehnungsrechner.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={handleDauerhaftigkeitClick}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Alterung & Dauerhaftigkeit</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            UV-Versprödung, Weichmacher-Auswaschung, Spannungsrisse & thermische Alterung.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function MauerwerkThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'naturstein');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 mt-6">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Mauerwerk & Stein im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den drei Säulen der Mauerwerkskunde:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('mauerwerk')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Baustoff-Eigenschaften</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Steinarten (Ziegel, KS, Porenbeton), Festigkeitsbemessung & Mauerwerksverbände im 3D-Modell.
          </span>
          {current !== 'baustoff' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_mauerwerk')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Mauerwerksprodukte & Praxis</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Hintermauer- und Vormauerziegel, Planblöcke, Mauermörtelarten & Herstellerlisten nach BauPVO.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={handleDauerhaftigkeitClick}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Alterung & Denkmalschutz</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Salzkristallisation, Frostsprengung, chemischer Verwitterungsschutz & Sanierputze.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function ConcreteThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  const handleDauerhaftigkeitClick = () => {
    localStorage.setItem('dauerhaftigkeit_subtab', 'beton');
    setActiveTab('dauerhaftigkeit');
  };

  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 mt-6">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Beton im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den verschiedenen Beton-Lehrbereichen:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe / Betonpraxis */}
        <button
          onClick={() => setActiveTab('betonpraxis')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Betontechnologie & Praxis</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Expositionsklassen-Konfigurator, Nachbehandlungsrechner & Betondeckung.
          </span>
          {current !== 'baustoff' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_beton')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Betonzulassung (Bauprodukt)</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Transport- vs. Baustellenbeton, WPK-Überwachung, Ü-Zeichen & Abnahme.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={handleDauerhaftigkeitClick}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Dauerhaftung & Schäden</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Karbonatisierung, Frost-Tausalz-Angriff, AKR-Treiben & Bewehrungskorrosion.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function MetalThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 mt-6">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Metalle im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den drei Säulen der Baustofflehre (Basis, Anwendung und Alterung):
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('metalle')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Baustoff-Kennwerte</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Physikalische Eigenschaften, Schmelzpunkt & Legierungen der Metalle.
          </span>
          {current !== 'baustoff' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_metallisch')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Mechanik & Praxis</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Plattenrechner, Kontaktkorrosions-Prüfung & Lieferantenlisten der BauPVO.
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={() => setActiveTab('metallkorrosion')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Dauerhaftigkeit</span>
          </div>
          <span className="text-xs text-slate-500 font-normal leading-relaxed">
            Galvanische Zellen, Korrosionsarten & Schutz nach DIN EN ISO 12944.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-xs font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function BetonDauerhaftigkeitsSimulator() {
  const [k, setK] = useState<number>(2.5); // Karbonatisierungsbeiwert in mm/Wurzel(a)
  const [t, setT] = useState<number>(50);  // Zeit in Jahren
  const [cnom, setCnom] = useState<number>(30); // Betondeckung in mm
  const [showPath, setShowPath] = useState<boolean>(false);
  
  const presets = [
    { label: 'XC1 (Innenraum trocken, z.B. C20/25)', kValue: 4.5, cnomDefault: 15 },
    { label: 'XC2 (nass, selten trocken): c_nom = 35 mm', kValue: 1.0, cnomDefault: 25 },
    { label: 'XC3 (Mäßig feucht, z.B. C25/30)', kValue: 2.5, cnomDefault: 25 },
    { label: 'XC4 (Feucht/Trocken-Wechsel, z.B. C30/37)', kValue: 1.5, cnomDefault: 35 },
  ];

  const handlePreset = (pK: number, pC: number) => {
    setK(pK);
    setCnom(pC);
  };

  const xCarb = k * Math.sqrt(t);
  const isDepassivated = xCarb >= cnom;
  
  const tCrit = k > 0 ? Math.round(Math.pow(cnom / k, 2)) : 999;
  const safeYearsRemaining = tCrit - t;

  return (
    <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-6">
      <div className="flex items-center gap-2.5 mb-2">
        <Activity className="text-shiraz w-5 h-5 animate-pulse" />
        <h4 className="font-bold text-slate-800 text-sm sm:text-base">
          Stahlbeton-Lebensdauersimulator: Karbonatisierungs-Prüfung
        </h4>
      </div>
      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        Nach dem Wurzel-Zeit-Gesetz dringt die Karbonatisierungsfront ein: s(t) = k·√t. stetig ein: <FormulaText text="$s(t) = k \cdot \sqrt{t}$" />. 
        Sinkt der pH-Wert des Betons von anfänglich &gt; 12.5 auf unter 9.0 (Depassivierung), entfällt der Rostschutz des Stahls.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">Schnell-Konfiguration (DIN EN 206)</span>
            <div className="flex flex-col gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePreset(p.kValue, p.cnomDefault)}
                  className="bg-slate-50 hover:bg-shiraz/5 border border-home-grau/30 hover:border-shiraz/35 py-1.5 px-2.5 rounded-lg text-left text-xs transition-all flex justify-between items-center text-slate-700 cursor-pointer"
                >
                  <span className="font-medium">{p.label}</span>
                  <span className="text-xs font-mono bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-600 whitespace-nowrap">
                    k = {p.kValue} / c = {p.cnomDefault}mm
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Karbonatisierungsbeiwert <FormulaText text="$k$" /></span>
                <span className="font-mono text-shiraz font-bold">{k} mm/√a</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={k}
                onChange={(e) => setK(parseFloat(e.target.value))}
                className="w-full accent-shiraz"
              />
              <span className="text-xs text-slate-400 block mt-0.5">Dichte Zemente (C35/45) weisen k ~ 1.0 auf; magere k &gt; 4.0.</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Betondeckung <FormulaText text="$c_{\text{nom}}$" /> (Soll)</span>
                <span className="font-mono text-slate-900 font-bold">{cnom} mm</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={cnom}
                onChange={(e) => setCnom(parseInt(e.target.value))}
                className="w-full accent-slate-700"
              />
              <span className="text-xs text-slate-400 block mt-0.5">Vorgeschrieben sind i.d.R. c_min (z.B. 25-35mm) + 10mm Vorhaltemaß.</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Bauteilalter <FormulaText text="$t$" /></span>
                <span className="font-mono text-slate-900 font-bold">{t} Jahre</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={t}
                onChange={(e) => setT(parseInt(e.target.value))}
                className="w-full accent-shiraz"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Graphic and Verdict */}
        <div className="lg:col-span-7 bg-slate-50 border border-home-grau/30 p-4.5 rounded-xl flex flex-col gap-4">
          <div className="text-center bg-white p-2 text-xs rounded-lg border border-home-grau/30">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Rechnerische Karbonatisierungstiefe</span>
            <div className="text-sm font-bold text-slate-800 mt-1 flex justify-center items-center gap-1">
              <span>s(t) = {k} · √{t} = </span>
              <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded font-mono text-lg font-black">{xCarb} mm</span>
            </div>
          </div>

          {/* SVG cross-section */}
          <div className="w-full h-32 bg-stone-300 rounded-lg relative overflow-hidden border border-home-grau/30 shadow-inner flex items-center justify-center">
            {/* Concrete solid texturing */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '12px 12px' }} />

            {/* Uncarbonated Alkaline Concrete (Safe, Passive Zone pH >12.5) */}
            <div className="absolute inset-y-0 right-0 h-full bg-slate-400/20 flex items-center justify-end pr-3 select-none pointer-events-none transition-all duration-300" style={{ left: `${Math.min(100, (xCarb / 70) * 100)}%` }}>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block rotate-90 sm:rotate-0">
                Alkalisch (pH &gt; 12.5)
              </span>
            </div>

            {/* Carbonated Depassivated Zone (Acidified, pH < 9.0) */}
            <div className="absolute inset-y-0 left-0 bg-red-500/15 border-r border-dashed border-red-500 flex items-center pl-3 select-none pointer-events-none transition-all duration-300" style={{ width: `${Math.min(100, (xCarb / 70) * 100)}%` }}>
              {xCarb > 8 && (
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider block whitespace-nowrap">
                  CO₂-Einfluss (pH &lt; 9)
                </span>
              )}
            </div>

            {/* Concrete Surface Marker */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800">
              <span className="absolute left-1.5 top-1.5 text-[8px] font-bold text-slate-800 uppercase tracking-widest select-none pointer-events-none whitespace-nowrap">Oberfläche</span>
            </div>

            {/* Steel Reinforcement Rebar */}
            <div className="absolute inset-y-0 flex flex-col justify-around transition-all duration-300" style={{ left: `${(cnom / 70) * 100}%` }}>
              <div className={`w-6 h-6 rounded-full -translate-x-3 border-2 shadow flex items-center justify-center transition-all duration-300 ${
                isDepassivated ? 'bg-red-600 border-red-800 animate-pulse text-white' : 'bg-slate-500 border-home-grau/30 text-slate-100'
              }`}>
                <div className="absolute -top-4 font-mono text-xs font-bold text-slate-800 whitespace-nowrap">
                  Bewehrung (c = {cnom}mm)
                </div>
                <div className="text-xs font-black">Ø</div>
              </div>
            </div>

            {/* Scale lines */}
            <div className="absolute bottom-1 right-2 bg-white/70 px-1 rounded text-[8px] font-bold text-slate-500 select-none">
              Skalierung: 0 - 70 mm
            </div>
          </div>

          {/* Verdict Alert */}
          <div className={`p-3 rounded-xl border flex gap-3 ${
            isDepassivated 
              ? 'bg-rose-50 border-shiraz/20 text-slate-900' 
              : 'bg-slate-50 border-home-grau/30 text-slate-800'
          }`}>
            <div className="shrink-0 pt-0.5">
              {isDepassivated ? <AlertTriangle className="w-4 h-4 text-shiraz" /> : <Check className="w-4 h-4 text-slate-500" />}
            </div>
            <div>
              <p className="text-xs font-bold leading-normal">
                {isDepassivated 
                  ? 'Gefahr: Depassivierung eingetreten!' 
                  : 'Sicherer Bereich: Stahloberfläche passiviert.'}
              </p>
              <p className="text-xs text-slate-700 leading-normal mt-1">
                {isDepassivated ? (
                  <>
                    Nach ca. <strong>{tCrit} Jahren</strong> hat die saure Front die Bewehrung erreicht. 
                    Ohne korrosions-inhibierende Alkalität droht bei Feuchtezugriff <strong>Bewehrungsrost</strong> (Rostsprengung).
                  </>
                ) : (
                  <>
                    Die Alkalität schützt die Bewehrungsmatten verlässlich. 
                    Rechnerisch verbleibende Restschutzdauer vor Depassivierung: <strong>{safeYearsRemaining > 200 ? '>200' : safeYearsRemaining} Jahre</strong> (Schwelle bei t = {tCrit} Jahren).
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible calculation path */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <button
          onClick={() => setShowPath(!showPath)}
          className="text-xs font-bold text-shiraz hover:text-shiraz/80 flex items-center gap-1.5 cursor-pointer transition-all focus:outline-none"
        >
          <span>{showPath ? '▲ Formeln & Berechnungsschritte ausblenden' : '▼ Formeln & interaktiver Berechnungsweg (Schritt für Schritt)'}</span>
        </button>
        {showPath && (
          <div className="mt-3 bg-stone-50 border border-slate-205 rounded-xl p-4 space-y-4 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2">
            <h5 className="font-bold text-slate-900 border-b border-slate-205 pb-1.5">
              Schritt-für-Schritt Herleitung der Stahlbeton-Lebensdauer
            </h5>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Schritt 1: Bestimmung des Karbonatisierungsbeiwerts k ({k} mm/√a)</p>
                <p className="text-slate-600 leading-relaxed">
                  Der Widerstand des Zementsteins gegen neutralisierendes Kohlendioxid (CO₂) hängt maßgeblich von der Betondichte (niedriger w/z-Wert) und der Erhärtungszeit ab. Ihre aktuelle Auswahl simuliert einen Beiwert von <strong className="font-mono text-xs">{k} mm/√a</strong>.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Schritt 2: Das quadratische Zeitgesetz</p>
                <p className="text-slate-600 leading-relaxed">
                  Die Gasdiffusion im Porensystem verläuft nicht-linear. Die Lage der Carbonatisierungsfront s(t) nach {t} Jahren berechnet sich aus:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-slate-800 font-bold my-1 text-xs">
                  s({t}) = {formatDeZahl(k, 1)} · √{t} = {formatDeZahl(k, 1)} · {formatDeZahl(Math.sqrt(t), 3)} = {formatDeZahl(xCarb, 1)} mm
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Schritt 3: Abgleich mit der installierten Betondeckung c_nom ({cnom} mm)</p>
                <p className="text-slate-600 leading-relaxed">
                  Damit der Korrosionsschutz aktiv bleibt, muss die carbonatisierte Schichtdicke kleiner sein als die Deckungstiefe (s(t) &lt; c_nom).
                  {isDepassivated ? (
                    <span className="text-red-700 block font-semibold mt-1">
                      ➔ Die Carbonatisierungsfront ({formatDeZahl(xCarb, 1)} mm) hat den schützenden Betonbereich um {formatDeZahl(xCarb - cnom, 1)} mm überschritten. Die Bewehrung ist depassiviert und rostgefährdet!
                    </span>
                  ) : (
                    <span className="text-emerald-700 block font-semibold mt-1">
                      ➔ Die hochalkalische Restpufferzone vor dem reinen Stahl beträgt noch {formatDeZahl(cnom - xCarb, 1)} mm. Der passive Rostschutz steht sicher.
                    </span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Schritt 4: Bestimmung des rechnerischen Depassivierungszeitpunkts t_crit</p>
                <p className="text-slate-600 leading-relaxed">
                  Der genaue Zeitpunkt, an dem die Carbonatisierungsfront exakt die Tiefe der Bewehrung berührt (s(t) = c_nom), berechnet sich durch Umstellen der Formel nach t:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-slate-800 font-bold my-1 text-xs">
                  t_crit = (c_nom / k)² = ({cnom} / {k})² = {tCrit} Jahre
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Rechnerisch verbleibende Restlebensdauer vor Depassivierung: {safeYearsRemaining > 0 ? (
                    <span><strong>{safeYearsRemaining} Jahre</strong>.</span>
                  ) : (
                    <span>Das Bauteil befindet sich bereits seit <strong>{Math.abs(safeYearsRemaining)} Jahren</strong> im ungeschützten Zustand.</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Schritt 5: Konstruktive und betontechnologische Stellschrauben</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                  <li><strong>Geringerer w/z-Wert (Zementleimdiag):</strong> Reduziert das kapillare Porenvolumen und senkt den k-Wert drastisch (z.B. von 4.5 auf 1.5).</li>
                  <li><strong>Erhöhter Vorhaltemaß dc:</strong> Ein Erhöhen der Schalungspräzision ermöglicht dickere Bauteildeckungen (z.B. 35mm anstelle von 15mm), was die t_crit-Schutzdauer quadratisch vergrößert.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetalDurabilitySimulator() {
  const [targetClass, setTargetClass] = useState<string>('C3');
  const [years, setYears] = useState<number>(15);
  const [showMetalPath, setShowMetalPath] = useState<boolean>(false);
  
  // Bimetall State
  const [metalA, setMetalA] = useState<string>('verzinkt'); // großflächige Platte
  const [metalB, setMetalB] = useState<string>('edelstahl'); // Schraube
  const [environment, setEnvironment] = useState<string>('moist'); // Feuchtespeicher

  // ISO 12944 corrosion category values inside unalloyed steel & zinc (micro-meter layer loss in year 1)
  const isoData: Record<string, { label: string; steelLoss: number; zincLoss: number; desc: string }> = {
    C1: { label: 'C1 (Kleinstes Risiko / Innen beheizt)', steelLoss: 0.1, zincLoss: 0.02, desc: 'Trockene Büros, Schulen, geringe Kondensation.' },
    C2: { label: 'C2 (Gering / Unbeheizte Depots, ländlich)', steelLoss: 10, zincLoss: 0.5, desc: 'Geringe Verschmutzung, offene Garagen.' },
    C3: { label: 'C3 (Mäßig / Stadtgase, mäßige Küste)', steelLoss: 35, zincLoss: 1.2, desc: 'Urbane u. industrielle Bereiche, mäßiges Chlorid.' },
    C4: { label: 'C4 (Stark / Chemieparks, Küstenregion)', steelLoss: 65, zincLoss: 2.8, desc: 'Industrieanlagen, Chemiebetriebe, Schiffsrümpfe.' },
    C5: { label: 'C5 (Sehr stark / Extremkondensation)', steelLoss: 140, zincLoss: 5.5, desc: 'Aggressive Offshore-Plattformen, Hafenkräne.' },
    CX: { label: 'CX (Extrem / Tropische u. marine Bereiche)', steelLoss: 450, zincLoss: 15, desc: 'Extreme Salzbelastung und andauernd hohe Luftfeuchte.' },
  };

  const chosen = isoData[targetClass] || isoData.C3;
  const totalSteelLoss = chosen.steelLoss * years;
  const totalZincLoss = chosen.zincLoss * years;

  // Galvanic connections ratings matrix
  const getBimetalRating = () => {
    if (environment === 'dry') {
      return {
        label: 'Unbedenklich',
        color: 'bg-slate-50 border-home-grau/30 text-slate-800',
        icon: Check,
        desc: 'In trockenen Innenbereichen findet kein nennenswerter Elektrolytfluss statt. Korrosionsrisiko vernachlässigbar.'
      };
    }

    if (metalA === metalB) {
      return {
        label: 'Unbedenklich',
        color: 'bg-slate-50 border-home-grau/30 text-slate-800',
        icon: Check,
        desc: 'Homogene Verbindung aus identischen Metallen besitzt keine Potentialdifferenz.'
      };
    }

    // Small screw/fastener is Metal B, large plate/component is Metal A.
    // RULE 1: Stainless steel fastener (Edelstahl B) in large Zinc, Aluminium, or Baustahl
    if (metalB === 'edelstahl') {
      return {
        label: 'Geringes bis mäßiges Risiko',
        color: 'bg-slate-100/50 border-home-grau/30 text-slate-800',
        icon: AlertCircle,
        desc: 'Klassische Montageausnahme! Das edle Schraubenmetall (Edelstahl) besitzt ein mäßiges Risiko, führt aber wegen der winzigen Kathodenfläche (Schraube) im Vergleich zur großen Anode (Platte) meist zu keinem katastrophalen Versagen der Platte.'
      };
    }

    // RULE 2: Copper fastener (Kupfer B) in anything unnoble
    if (metalB === 'kupfer') {
      return {
        label: 'Kritisches Risiko / Absolutes No-Go!',
        color: 'bg-rose-50 border-shiraz/20 text-slate-900',
        icon: AlertTriangle,
        desc: 'Schraubverbindung verboten! Das edle Kupfer wird die unedle Platte (Alu, Verzinkt, Stahl) lokal zerstören. Durch abgewaschene Kupferionen droht verheerender Lochfraß (Fließregel!).'
      };
    }

    // RULE 3: Unnoble fastener in stainless steel components (Large stainless plate, small regular iron screw)
    if (metalA === 'edelstahl' && (metalB === 'baustahl' || metalB === 'verzinkt')) {
      return {
        label: 'Extremes Versagensrisiko! (Sicherer Bruch)',
        color: 'bg-rose-50 border-shiraz/35 text-shiraz font-bold',
        icon: AlertTriangle,
        desc: 'Gefährliche Konstellation! Die unedle Schraube fungiert als winzige Opferanode für die riesige Inox-Platte. Das Verbindungsmittel wird extrem schnell unter Spannung korrodieren und abscheren!'
      };
    }

    // Aluminum fastener on copper
    if (metalA === 'kupfer' && metalB === 'aluminium') {
      return {
        label: 'Kritisches Risiko / No-Go',
        color: 'bg-rose-50 border-shiraz/30 text-slate-950',
        icon: AlertTriangle,
        desc: 'Aluminium-Niete oder Schrauben werden in direktem Kupferkontakt rasend schnell elektrolytisch aufgelöst.'
      };
    }

    // Baustahl fastener in Verzinkt / Aluminium
    return {
      label: 'Mäßiges Risiko',
      color: 'bg-slate-100/70 border-home-grau/30 text-slate-800',
      icon: AlertCircle,
      desc: 'Mäßige Potentialdifferenz. Unverzinkte Stahlbauteile rosten beschleunigt, falls sie von Feuchtigkeit umgeben sind.'
    };
  };

  const rating = getBimetalRating();
  const RatingIcon = rating.icon;

  return (
    <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-6 space-y-6">
      
      {/* Teil 1: Abtragsraten nach ISO 12944 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Layers className="text-shiraz w-5 h-5" />
          <h4 className="font-bold text-slate-850 text-sm sm:text-base">
            DIN EN ISO 12944-2: Werkstoffabtragungs-Projektion
          </h4>
        </div>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Stahl und Zink korrodieren abhängig von der Schadstoffbelastung in unterschiedlichen Millimeterraten. 
          Wählen Sie die Korrosivitätskategorie und simulieren Sie den Schichtabtrag über Jahre:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          <div className="space-y-3.5">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">Luftreinheits-Klasse (ISO 12944)</span>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-800"
              >
                {Object.keys(isoData).map((k) => (
                  <option key={k} value={k}>{isoData[k].label}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Betrachtungszeitraum</span>
                <span className="font-mono text-slate-900 font-bold">{years} Jahre</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="w-full accent-shiraz"
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-50 border border-home-grau/30 p-4 rounded-xl flex flex-col gap-3">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Gerechneter Substanzverlust</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-2.5 rounded border border-home-grau/30 text-center">
                <span className="text-xs block text-slate-500 font-semibold mb-0.5">Baustahl unlegiert</span>
                <span className="text-base font-black text-shiraz font-mono">
                  {formatDeZahl(totalSteelLoss / 1000, 3)} mm
                </span>
                <span className="text-xs text-slate-400 block mt-0.5 font-mono">({totalSteelLoss} μm Verlust)</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-home-grau/30 text-center">
                <span className="text-xs block text-slate-500 font-semibold mb-0.5">Zinkbeschichtung</span>
                <span className="text-base font-black text-slate-700 font-mono">
                  {formatDeZahl(totalZincLoss, 1)} μm
                </span>
                <span className="text-xs text-slate-400 block mt-0.5 font-mono">({formatDeZahl(totalZincLoss / 1.4, 1)} a Schutzzeit bei Z80)</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-normal italic">
              * {chosen.desc}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-home-grau/30" />

      {/* Teil 2: Bimetall / Galvanischer Prüfer */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="text-shiraz w-5 h-5" />
          <h4 className="font-bold text-slate-850 text-sm sm:text-base">
            Bimetall-Verträglichkeits-Prüfer (DIN EN ISO 14713)
          </h4>
        </div>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Wird ein edleres Metall leitend mit einem unedleren Metall verbunden, opfert sich das unedlere Metall als Anode auf. 
          Prüfen Sie Metallunverträglichkeiten im Baubetrieb:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">Großteil (z.B. Blech/Fassade)</span>
              <select
                value={metalA}
                onChange={(e) => setMetalA(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-800"
              >
                <option value="baustahl">Unlegierter Baustahl</option>
                <option value="verzinkt">Feuerverzinkter Stahl</option>
                <option value="aluminium">Aluminium</option>
                <option value="kupfer">Kupfer</option>
                <option value="edelstahl">Edelstahl</option>
              </select>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">Verbindungsmittel (Schraube/Niet)</span>
              <select
                value={metalB}
                onChange={(e) => setMetalB(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-800"
              >
                <option value="baustahl">Baustahlschraube</option>
                <option value="verzinkt">Verzinkte Schraube</option>
                <option value="aluminium">Aluminiumschraube</option>
                <option value="kupfer">Kupfernagel / Kupferschraube</option>
                <option value="edelstahl">Edelstahlschraube (A2/A4)</option>
              </select>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">Feuchtigkeit / Umgebung</span>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-800"
              >
                <option value="dry">Trockener Innenraum (C1)</option>
                <option value="moist">Standard-Aussenbereich (C3)</option>
                <option value="marine">Nassraum / Salznebel (C4/C5)</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Montage-Freigabebewertung</span>
            <div className={`p-4 rounded-xl border flex gap-3 ${rating.color}`}>
              <div className="shrink-0 pt-0.5">
                <RatingIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wide">
                  {rating.label}
                </p>
                <p className="text-xs leading-relaxed">
                  {rating.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible calculation path */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <button
          onClick={() => setShowMetalPath(!showMetalPath)}
          className="text-xs font-bold text-shiraz hover:text-shiraz/80 flex items-center gap-1.5 cursor-pointer transition-all focus:outline-none"
        >
          <span>{showMetalPath ? '▲ Formeln & Korrosionsschritte ausblenden' : '▼ Formeln & interaktiver Korrosionsweg (Schritt für Schritt)'}</span>
        </button>
        {showMetalPath && (
          <div className="mt-3 bg-stone-50 border border-slate-200 rounded-xl p-4 space-y-4 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2">
            <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <span>Korrosionsschritte & Galvanischer Leitfaden</span>
            </h5>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <p className="font-semibold text-slate-850">Schritt 1: Rechnerischer Abtrag unlegierter Baustahl ({totalSteelLoss} μm)</p>
                <p className="text-slate-650 leading-relaxed">
                  Nach DIN EN ISO 12944-2 wird der jährliche Korrosionsverlust für unlegierten Stahl als konstanter Wert angenommen. Für die ausgewählte Klasse <strong>{targetClass}</strong> beträgt dieser im ersten Jahr {chosen.steelLoss} μm/a. Über {years} Jahre rechnet man linear:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-slate-800 font-bold my-1 text-xs">
                  d_loss = {chosen.steelLoss} μm/a · {years} Jahre = {totalSteelLoss} μm ({formatDeZahl(totalSteelLoss / 1000, 3)} mm)
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-850">Schritt 2: Rechnerischer Zinkabtrag und theoretische Schutzdauer ({totalZincLoss} μm)</p>
                <p className="text-slate-500 leading-relaxed">
                  Zink besitzt eine erheblich niedrigere elektrochemische Abtragsrate von {chosen.zincLoss} μm/a. Bei einer handelsüblichen Standardfeuerverzinkung mit z.B. 80 μm (Z80) berechnet sich die rechnerische Schutzzeit bis zur vollkommenen Aufzehrung des Zinks durch:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-slate-800 font-bold my-1 text-xs">
                  t_Schutz = 80 μm / {formatDeZahl(chosen.zincLoss, 1)} μm/a = {formatDeZahl(80 / chosen.zincLoss, 1)} Jahre Schutzdauer
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-855">Schritt 3: Bimetall-Verbindung & Anoden-/Kathodenverhältnis</p>
                <p className="text-slate-655 leading-relaxed text-xs">
                  Das Risiko aus Kontaktkorrosion beruht auf dem elektrochemischen Potenzialunterschied und dem Flächenverhältnis.
                  Ein verhängnisvoller Fehler im Stahlbau ist das Platzieren eines unedlen Fasteners (z.B. Schraube aus Baustahl/Zink) in einem riesigen edlen Bauteil (z.B. Edelstahl-Träger). Die Schraube wirkt als punktuelle, winzige Opferanode und korrodiert extrem schnell, was zum standsicherheits-gefährdenden Abscheren führt.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-855">Schritt 4: Korrosionsmindernde Vorkehrungen</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                  <li><strong>Galvanische Entkopplung:</strong> Verwendung nicht-leitender EPDM- bzw. Polyamid-Unterlegscheiben zur Unterbrechung des elektrischen Feststoffkontakts.</li>
                  <li><strong>Katodische Opferbarrieren:</strong> Einsatz opferbereiter galvanischer Schutzschichten (z.B. Zink-Staub-Grundierung oder Sherardisieren).</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

function TimberDurabilitySimulator() {
  const [inHeated, setInHeated] = useState<boolean>(true);
  const [humidityRisk, setHumidityRisk] = useState<boolean>(false);
  const [directWeather, setDirectWeather] = useState<boolean>(false);
  const [groundContact, setGroundContact] = useState<boolean>(false);
  const [freshwater, setFreshwater] = useState<boolean>(false);
  const [showTimberPath, setShowTimberPath] = useState<boolean>(false);

  // Derive Gebrauchsklasse (GK) based on DIN 68800-1
  const getGK = () => {
    if (groundContact || freshwater) {
      return {
        gk: 'GK 4',
        name: 'Erd- oder Süßwasserkontakt',
        risks: 'Fäulnispilze (Weichfäule), holzzerstörende Moderfäule, Larven.',
        recos: 'Einsatz von Kiefer kesseldruckimprägniert (KD) oder extrem dauerhaften Harthölzern wie Robinie (Resistenzklasse 1).'
      };
    }
    if (directWeather) {
      return {
        gk: 'GK 3.2',
        name: 'Außenbereich, voll bewittert mit Wasserspeicherung',
        risks: 'Regenüberfeuchtung, Pilzbefall (Weiß-/Braunfäule), Rissbildung.',
        recos: 'Konstruktiver Holzschutz unerlässlich (Hirnholzversiegelung, Ablaufschlitze), Douglasie / Lärche (Klasse 3) Kernholz nur für mäßige Beanspruchung.'
      };
    }
    if (!inHeated && humidityRisk) {
      return {
        gk: 'GK 2',
        name: 'Unter Dach, vor Regen geschützt, aber zeitweise feucht',
        risks: 'Pilze (Bluringe/Hausfäulnis) sowie Hausbock/Nagekäfer.',
        recos: 'Bauteile kontrollierbar halten, feuchtesteuernde Lasuren, Nadelholz Kernholzart ohne Imprägnierung möglich.'
      };
    }
    if (!inHeated) {
      return {
        gk: 'GK 1',
        name: 'Innenbereich, trocken, aber ohne kontrollierte Heizung',
        risks: 'Insektenbefall (Hausbocklarven), keine Pilzgefahr (da u < 20%).',
        recos: 'Wahl von Kiefer/Fichte Kernholz ist vollkommen ausreichend. Keine chemische Behandlung nötig.'
      };
    }
    return {
      gk: 'GK 0',
      name: 'Innenbereich, ständig trocken (beheiztes Gebäude)',
      risks: 'Keine Gefährdung durch Pilze oder Insekten.',
      recos: 'Chemischer Holzschutz ist laut DIN 68800-1 gesetzlich VERBOTEN. Konstruktiver Standard genügt.'
    };
  };

  const gkInfo = getGK();

  const woodSuitability = [
    { name: 'Robinie (Scheinakazie)', classification: 'Dauerhaftigkeitsklasse 1-2 (Dauerhaft)', gk4: 'Sehr gut geeignet', gk3: 'Exzellente Wahl' },
    { name: 'Eiche (Kernholz)', classification: 'Dauerhaftigkeitsklasse 2 (Dauerhaft)', gk4: 'Eingeschränkt geeignet', gk3: 'Sehr gut geeignet' },
    { name: 'Lärche / Douglasie', classification: 'Dauerhaftigkeitsklasse 3-4 (Mäßig dauerhaft)', gk4: 'Nicht geeignet', gk3: 'Geeignet bei freiem Wasserablass' },
    { name: 'Fichte', classification: 'Dauerhaftigkeitsklasse 4 (Wenig dauerhaft)', gk4: 'Ungenügend', gk3: 'Nur mit tiefem Chemie-Holzschutz' },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-2">
        <Bug className="text-shiraz w-5 h-5" />
        <h4 className="font-bold text-slate-800 text-sm sm:text-base">
          DIN 68800 Bestimmer: Holz-Gebrauchsklasse & Resistenz-Abgleich
        </h4>
      </div>
      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        Gebrauchsklassen (GK) bestimmen das Gefährdungsspektrum für Holzbauteile. 
        Klicken Sie die Einsatzkonditionen an, um die Gebrauchsklasse und die zulässigen natürlichen Holzarten (DIN EN 350 i. V. m. DIN 68800-1) zu bestimmen:
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Checkbox Inputs */}
        <div className="lg:col-span-5 bg-slate-50 border border-home-grau/30 p-4 rounded-xl space-y-3">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Umgebungskriterien</span>
          
          <label className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-slate-100/60 border border-home-grau/30 rounded-lg cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={inHeated}
              onChange={(e) => {
                setInHeated(e.target.checked);
                if (e.target.checked) {
                  setDirectWeather(false);
                  setGroundContact(false);
                  setFreshwater(false);
                }
              }}
              className="accent-shiraz shrink-0"
            />
            <span className="text-slate-700 font-medium">Beheizter, ständig geschlossener Innenraum?</span>
          </label>

          <label className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-slate-100/60 border border-home-grau/30 rounded-lg cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={humidityRisk}
              onChange={(e) => setHumidityRisk(e.target.checked)}
              disabled={inHeated}
              className="accent-shiraz shrink-0"
            />
            <span className={`text-slate-700 ${inHeated ? 'opacity-40' : 'font-medium'}`}>
              Gefahr zeitweiser Befeuchtung (Nassraum/Kondensation)?
            </span>
          </label>

          <label className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-slate-100/60 border border-home-grau/30 rounded-lg cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={directWeather}
              onChange={(e) => {
                setDirectWeather(e.target.checked);
                if (e.target.checked) setInHeated(false);
              }}
              className="accent-shiraz shrink-0"
            />
            <span className="text-slate-700 font-medium">Außenbereich bewittert (Direktregen)?</span>
          </label>

          <label className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-slate-100/60 border border-home-grau/30 rounded-lg cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={groundContact}
              onChange={(e) => {
                setGroundContact(e.target.checked);
                if (e.target.checked) setInHeated(false);
              }}
              className="accent-shiraz shrink-0"
            />
            <span className="text-slate-700 font-medium">Direkter Erdkontakt?</span>
          </label>

          <label className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-slate-100/60 border border-home-grau/30 rounded-lg cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={freshwater}
              onChange={(e) => {
                setFreshwater(e.target.checked);
                if (e.target.checked) setInHeated(false);
              }}
              className="accent-shiraz shrink-0"
            />
            <span className="text-slate-700 font-medium">Ständiger Kontakt mit Süßwasser?</span>
          </label>
        </div>

        {/* Dynamic Result Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-100 border border-home-grau/30 p-4 rounded-xl space-y-1.5 text-slate-900 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="bg-slate-800 text-white text-xs px-2.5 py-0.5 rounded-full font-black font-mono">
                {gkInfo.gk}
              </span>
              <span className="text-xs font-bold">{gkInfo.name}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700 font-normal">
              <strong>Gefahrenpotenzial:</strong> {gkInfo.risks}
            </p>
            <p className="text-xs leading-relaxed text-slate-700 font-normal">
              <strong>Soll-Maßnahme:</strong> {gkInfo.recos}
            </p>
          </div>

          <div className="border border-home-grau/30 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="p-2 border-b border-home-grau/30">Holzart (Kernholz)</th>
                  <th className="p-2 border-b border-home-grau/30">Resistenzklasse</th>
                  <th className="p-2 border-b border-home-grau/30">Eignung Bewittert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {woodSuitability.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-800">{row.name}</td>
                    <td className="p-2 text-xs text-slate-600">{row.classification}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        row.name.includes('Robinie') || row.name.includes('Eiche')
                          ? 'bg-slate-100 text-slate-700 border border-home-grau/30'
                          : 'bg-rose-50 text-shiraz border border-shiraz/20'
                      }`}>
                        {directWeather || groundContact ? row.gk4 : row.gk3}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Collapsible calculation path */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <button
          onClick={() => setShowTimberPath(!showTimberPath)}
          className="text-xs font-bold text-shiraz hover:text-shiraz/80 flex items-center gap-1.5 cursor-pointer transition-all focus:outline-none"
        >
          <span>{showTimberPath ? '▲ Holzschutz-Kriterien ausblenden' : '▼ Formeln & interaktive Einstufungsschritte (Schritt für Schritt)'}</span>
        </button>
        {showTimberPath && (
          <div className="mt-3 bg-stone-50 border border-slate-205 rounded-xl p-4 space-y-4 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2">
            <h5 className="font-bold text-slate-900 border-b border-slate-205 pb-1.5">
              Normative Bestimmungskette nach DIN 68800-1 / DIN EN 350-2
            </h5>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">Schritt 1: Umgebungsdiagnostik (Feuchteeinwirkung)</p>
                <p className="text-slate-600 leading-relaxed">
                  Wasser ist der biologische Katalysator. Pilze können pflanzliche Masse nur abbauen, wenn die Fasersättigungsfeuchte dauerhaft u ≥ 20% erreicht.
                  Unter beheizten Innenbedingungen bleibt u bei ca. 8–12 %, weshalb kein Pilzrisiko besteht. Sobald Erdkontakt oder Bewitterung einsetzen, stellt sich freies Wasser im Holzgefüge ein.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">Schritt 2: Klassifizierung der Gebrauchsklasse (GK)</p>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Ihre gewählten Parameter klassifizieren das Tragwerk in die Klasse <strong className="font-mono bg-slate-250 px-1.5 py-0.5 rounded text-slate-850 text-xs">{gkInfo.gk}</strong> ({gkInfo.name}). 
                  Dies bestimmt rechtlich bindend das maximale Schutzspektrum (Insektengefahr ab GK 1, Pilzgefahr ab GK 2, Moderfäulerisiko ab GK 4).
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">Schritt 3: Abgleich der natürliche Dauerhaftigkeit (Resistenzklasse nach DIN EN 350-2)</p>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Hölzer lagern in ihren inneren Kernzellen schützende Tannine, Terpene oder Harze ein. Je niedriger die Dauerhaftigkeitsklasse (1 = sehr dauerhaft bis 5 = nicht dauerhaft), desto widerstandsfähiger ist das Holz:
                </p>
                <ul className="text-slate-600 list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Klasse 1-2 (Robinie, Eiche):</strong> Dürfen ohne zusätzliche chemische Imprägnierung im bewitterten Außenbereich oder direktem Erdkontakt (GK 3.2 oder GK 4) eingesetzt werden.</li>
                  <li><strong>Klasse 3-4 (Douglasie, Lärche):</strong> Nur baulich optimal geschützt (ohne Staunässe, freier Ablauf) einsatzfähig.</li>
                  <li><strong>Klasse 4-5 (Fichte, Tanne):</strong> Absolut ungeeignet für feuchte Bewitterungsklassen, es sei denn, sie erfährt eine massive Kesseldruckimprägnierung (KDI).</li>
                </ul>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">Schritt 4: Das biologische Dogma des Holzschutzes</p>
                <p className="text-slate-650 leading-relaxed font-medium">
                  Baulich-konstruktive Vorsorge hat ausnahmslos Vorrang vor chemischem Holzschutz!
                </p>
                <p className="text-slate-500 leading-relaxed mt-1">
                  Chemische Holzschutzmittel dürfen im Wohnbereich wegen gesundheitlicher Restrisiken nur in begründeten, gesetzlich geregelten Ausnahmen eingesetzt werden. In GK 0 ist jeglicher chemische Holzschutz gesetzlich verboten.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default function Dauerhaftigkeit() {
  const [activeTab, setActiveTab] = useState<MaterialTab>('prinzipien');

  React.useEffect(() => {
    const savedSubtab = localStorage.getItem('dauerhaftigkeit_subtab');
    if (savedSubtab) {
      setActiveTab(savedSubtab as MaterialTab);
      localStorage.removeItem('dauerhaftigkeit_subtab');
    }
  }, []);

  const tabs: { id: MaterialTab; label: string; icon: LucideIcon }[] = [
    { id: 'prinzipien', label: 'Prinzipien & Konzepte', icon: Layers },
    { id: 'beton', label: 'Beton & Stahlbeton', icon: Box },
    { id: 'asphalte', label: 'Asphalte', icon: Box },
    { id: 'metalle', label: 'Metalle', icon: Activity },
    { id: 'holz', label: 'Holz', icon: Bug },
    { id: 'kunststoffe', label: 'Kunststoffe', icon: Sun },
    { id: 'naturstein', label: 'Naturstein & Mauerwerk', icon: Mountain },
    { id: 'glas', label: 'Glas', icon: Maximize },
    { id: 'unvertraeglichkeiten', label: 'Materialunverträglichkeiten', icon: Zap },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ShieldAlert className="text-shiraz" /> Dauerhaftigkeitseigenschaften & Korrosionsschutz
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Übersicht der typischen Schädigungsmechanismen verschiedener Baustoffe und entsprechender Schutzmaßnahmen.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                  isActive 
                    ? 'bg-shiraz text-white border-shiraz shadow-md' 
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          
          {/* Prinzipien */}
          {activeTab === 'prinzipien' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-home-prim flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-500" />
                Übergreifende Prinzipien der Dauerhaftigkeit
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Dauerhaftigkeit eines Bauteils wird durch drei zentrale Ebenen des Schutzes sichergestellt. Diese Prinzipien gelten werkstoffübergreifend und sollten stets in Kombination betrachtet werden, um eine hohe Restnutzungsdauer bei minimalen Lebenszykluskosten zu erreichen.
          </p>
        </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Konstruktiv */}
                <div className="bg-white p-5 rounded-xl border-l-4 border-shiraz shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz"><Mountain size={20} /></div>
                    <h4 className="font-bold text-text-main">1. Konstruktiver Schutz</h4>
                  </div>
                  <p className="text-sm text-text-main/80 mb-4">
                    Die effektivste und wirtschaftlichste Maßnahme. Ziel ist es, den potenziellen Schädigungseinfluss (z.B. Nässe, chemische Angriffe) durch intelligente Planung gar nicht erst ans Bauteil gelangen zu lassen.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Wasserableitung:</strong> Gefälle (&gt; 2%), Tropfkanten, ausreichende Dachüberstände.</li>
                    <li><strong>Vermeidung von Schmutznestern:</strong> Glatte Flächen, keine horizontalen Fugen oder Unterschnitte (z.B. Profilstahl-Ausrichtung).</li>
                    <li><strong>Belüftung:</strong> Hinterlüftete Fassaden, Trocknungsmöglichkeit für feuchtes Holz (kein Erdkontakt).</li>
                    <li><strong>Spannungsminimierung:</strong> Dehnfugen gegen thermischen Zwang, Abrunden von Kanten (Kerbwirkung reduzieren).</li>
                  </ul>
                </div>

                {/* Material */}
                <div className="bg-white p-5 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600"><Box size={20} /></div>
                    <h4 className="font-bold text-text-main">2. Materialanpassung</h4>
                  </div>
                  <p className="text-sm text-text-main/80 mb-4">
                    Wenn Umwelteinflüsse nicht konstruktiv vermieden werden können, muss der Baustoff selbst einen ausreichend strukturellen Widerstand bieten.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Betontechnologie:</strong> Ein niedriger w/z-Wert erhöht das Porengefüge-Dichtmaß (Widerstand gegen Chloride, Karbonatisierung, chemische Angriffe). Ein hoher Sulfatwiderstand (SR-Zement) bei sulfathaltigen Böden.</li>
                    <li><strong>Legierungen & Metalle:</strong> Chrom und Nickel in nichtrostendem Stahl bilden eine stabile Passivschicht. Cortenstahl bildet eine schützende Patina.</li>
                    <li><strong>Natürliche Dauerhaftigkeit (Holz):</strong> Robuste Kernhölzer (z.B. Eiche, Lärche) statt anfälligem Splintholz für bewitterte Bereiche (Dauerhaftigkeitsklassen nach DIN EN 350).</li>
                  </ul>
                </div>

                {/* Schutzsysteme */}
                <div className="bg-white p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600"><ShieldAlert size={20} /></div>
                    <h4 className="font-bold text-text-main">3. Aktive & Passive Schutzsysteme</h4>
                  </div>
                  <p className="text-sm text-text-main/80 mb-4">
                    Nachträgliche Applikationen oder Systeme, die den Baustoff von der Umwelt isolieren oder den Korrosionsmechanismus umkehren.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Passive Schutzschichten:</strong> Lacke, Anstriche, Epoxidharz-Beschichtungen (OS-Systeme im Betonbau), Feuerverzinken. Diese wirken rein als Barriere.</li>
                    <li><strong>Hydrophobierung:</strong> Silane/Siloxane machen mineralische Oberflächen wasserabweisend, ohne die Diffusionsfähigkeit zu blockieren.</li>
                    <li><strong>Aktiver (Kathodischer) Korrosionsschutz:</strong> Opferanoden (Zink/Magnesium) oder Fremdstromanlagen erzwingen, dass das Bauteil als Kathode fungiert und nicht oxidiert.</li>
                    <li><strong>Biozider Holzschutz:</strong> Chemische Behandlung als letztes Mittel, wenn konstruktiver Schutz nach GK 3/4 nicht realisierbar ist.</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* Beton */}
          {activeTab === 'beton' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Box className="w-5 h-5 text-gray-500" />
                  Beton & Stahlbeton (DIN 1045:2023 & Expositionsklassen)
                </h3>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-2">
                  <p>
                    Die Dauerhaftigkeit von Stahlbeton basiert auf dem Zusammenwirken von dichtem Zementstein (erzeugt durch niedrige w/z-Werte) und dem stark alkalischen Milieu des Porenwassers (pH &gt; 12,5), welches den Bewehrungsstahl passiviert. Das klassische System nach <strong>DIN EN 206 / DIN 1045-2</strong> gliedert Umwelteinflüsse in Expositionsklassen.
                  </p>
                  <p className="border-t border-home-grau/25 pt-2 text-xs text-slate-700">
                    <strong>Normen-Update (DIN 1045:2023):</strong> Die Neuausgabe der DIN 1045-Reihe (Teile 1 bis 1000) reformiert die Planung nachhaltiger, dauerhafter Tragwerke. Neben der klassischen, präskriptiven Einteilung in Expositionsklassen wird der Übergang zu performance-basierten Bemessungsansätzen (z.B. nachfolgende Betonbauqualitätsklassen (BBQ N, E, S)) und die Freigabe CO₂-reduzierter Mehrstoffzemente (wie CEM II/C und CEM III) forciert, um ökologischen Fußabdruck und mechanische Langlebigkeit baustofflich in Einklang zu bringen.
                  </p>
                </div>
              </div>

              {/* Expositionsklassen */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">
                  Übersicht der Expositionsklassen (inklusive X0)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  
                  {/* X0 - Keine Gefährdung */}
                  <div className="bg-white rounded-xl shadow-sm border border-l-4 border-l-slate-300 p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 text-slate-500 rounded-lg animate-pulse"><Box size={20} /></div>
                      <div>
                        <h5 className="font-bold text-text-main text-sm">X0 (No Risk)</h5>
                        <p className="text-xs text-text-main/70">Kein Angriffs- oder Korrosionsrisiko</p>
                      </div>
                    </div>
                    <ul className="text-xs space-y-1 text-gray-700">
                      <li>• Unbewehrter Beton im trockenen Innenbereich</li>
                      <li>• Unbewehrte Gründungen ohne Frostangriff</li>
                      <li>• Keine Korrosionsgefahr, da keine Bewehrung vorhanden und keine Frost-Tau-Zyklen vorliegen.</li>
                    </ul>
                    <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-600">
                      <span className="font-bold text-text-main">Anforderungen:</span>
                      <span>Anforderungen: Mindestdruckfestigkeitsklasse C8/10 nach DIN 1045-2; keine Begrenzung von w/z-Wert und Zementgehalt. X0 gilt nur für Beton ohne Bewehrung oder eingebettetes Metall. oder w/z-Grenzen aus Dauerhaftigkeitsgründen.</span>
                    </div>
                  </div>

                  {/* XC - Karbonatisierung */}
                  <div className="bg-white rounded-xl shadow-sm border border-l-4 border-l-stone-400 p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-stone-100 text-stone-600 rounded-lg"><Wind size={20} /></div>
                      <div>
                        <h5 className="font-bold text-text-main text-sm">XC (Carbonation)</h5>
                        <p className="text-xs text-text-main/70">Bewehrungskorrosion durch Karbonatisierung</p>
                      </div>
                    </div>
                    <ul className="text-xs space-y-1 text-gray-700">
                      <li><span className="font-semibold">XC1:</span> Trocken / Ständig nass (Innenräume bzw. Wasserbehälter)</li>
                      <li><span className="font-semibold">XC2:</span> Nass, selten trocken (Fundamente)</li>
                      <li><span className="font-semibold">XC3:</span> Mäßige Feuchte (Flugdächer, offene Hallen)</li>
                      <li><span className="font-semibold">XC4:</span> Wechselnd nass/trocken (Außenwände im Schlagwind)</li>
                    </ul>
                    <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-600">
                      <span className="font-bold text-text-main">Umsetzung (z.B. XC4):</span>
                      <span>max. w/z = 0,60, min. C25/30, min. z = 280 kg/m³, c_min,dur = 25 mm (+15 mm Vorhaltemaß, c_nom = 40 mm), min. c_min = 25mm (+15 mm Vorhaltemaß (c_nom = 40 mm))</span>
                    </div>
                  </div>

                  {/* XD - Chloride (kein Meerwasser) */}
                  <div className="bg-white rounded-xl shadow-sm border border-l-4 border-l-shiraz p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-shiraz/10 text-shiraz rounded-lg"><AlertTriangle size={20} /></div>
                      <div>
                        <h5 className="font-bold text-text-main text-sm">XD (De-icing Salt)</h5>
                        <p className="text-xs text-text-main/70">Korrosion durch Chloride (außer Meerwasser)</p>
                      </div>
                    </div>
                    <ul className="text-xs space-y-1 text-gray-700">
                      <li><span className="font-semibold">XD1:</span> Mäßige Feuchte (Sprühnebelbereich Straßen)</li>
                      <li><span className="font-semibold">XD2:</span> Nass, selten trocken (Industriebäder, Solebecken)</li>
                      <li><span className="font-semibold">XD3:</span> Wechselnd nass/trocken (Parkdecks, Brückenkappen)</li>
                    </ul>
                    <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-600">
                      <span className="font-bold text-text-main">Umsetzung (z.B. XD3):</span>
                      <span>max. w/z = 0.45, min. f_ck = C35/45, zusätzlicher Deckschichtschutz (OS-Systeme) oft obligatorisch</span>
                    </div>
                  </div>

                  {/* XS - Meerwasser */}
                  <div className="bg-white rounded-xl shadow-sm border border-l-4 border-l-blue-500 p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Waves size={20} /></div>
                      <div>
                        <h5 className="font-bold text-text-main text-sm">XS (Seawater)</h5>
                        <p className="text-xs text-text-main/70">Korrosion durch Chloride aus Meerwasser</p>
                      </div>
                    </div>
                    <ul className="text-xs space-y-1 text-gray-700">
                      <li><span className="font-semibold">XS1:</span> Salzhaltige Luft (Küstengebiete ohne Direktkontakt)</li>
                      <li><span className="font-semibold">XS2:</span> Unter Wasser (ständig getaucht)</li>
                      <li><span className="font-semibold">XS3:</span> Gezeiten- / Spritzwasserbereiche (höchstes Risiko)</li>
                    </ul>
                    <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-600">
                      <span className="font-bold text-text-main">Umsetzung (z.B. XS3):</span>
                      <span>Extrem dichtes Gefüge (max. w/z = 0.45) und Umsetzung XS3: max. w/z = 0,45, Mindestbetondeckung c_min,dur = 40 mm zzgl. Vorhaltemaß Δc_dev = 15 mm (c_nom = 55 mm)..</span>
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* XF - Frost */}
                  <div className="bg-white rounded-xl shadow-sm border border-l-4 border-l-cyan-300 p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-50 text-cyan-500 rounded-lg"><Snowflake size={20} /></div>
                      <div>
                        <h5 className="font-bold text-text-main text-sm">XF (Freeze/Thaw)</h5>
                        <p className="text-xs text-text-main/70">Frostangriff mit/ohne Taumittel</p>
                      </div>
                    </div>
                    <ul className="text-xs space-y-1 text-gray-700">
                      <li><span className="font-semibold">XF1:</span> Mäßige Wassersättigung ohne Taumittel (Außenbauteile)</li>
                      <li><span className="font-semibold">XF2:</span> Mäßige Wassersättigung mit Taumittel (Kläranlagenbereiche)</li>
                      <li><span className="font-semibold">XF3:</span> Hohe Wassersättigung ohne Taumittel (Stützwände, Becken)</li>
                      <li><span className="font-semibold">XF4:</span> Hohe Wassersättigung mit Taumittel (Straßenoberflächen)</li>
                    </ul>
                    <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-600">
                      <span className="font-bold text-text-main">Umsetzung (z.B. XF4):</span>
                      <span>Künstliche Mikroluftporen (LP-Beton) zur Druckentlastung (Soll-Gehalt &gt; 4,0–5,0 Vol.-%) oder sehr niedrige w/z-Werte.</span>
                    </div>
                  </div>

                  {/* XA - Chemischer Angriff */}
                  <div className="bg-white rounded-xl shadow-sm border border-l-4 border-l-green-600 p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 text-green-600 rounded-lg"><FlaskConical size={20} /></div>
                      <div>
                        <h5 className="font-bold text-text-main text-sm">XA (Chemical Attack)</h5>
                        <p className="text-xs text-text-main/70">Chemischer Angriff (Boden, Grundwasser, saure Abwässer)</p>
                      </div>
                    </div>
                    <ul className="text-xs space-y-1 text-gray-700">
                      <li><span className="font-semibold">XA1:</span> Schwach aggressiv (pH-Wert 6,5–5,5; CO₂-lösend 15–40 mg/l)</li>
                      <li><span className="font-semibold">XA2:</span> Mäßig aggressiv (pH-Wert 5,5–4,5; Sulfat 200–600 mg/l)</li>
                      <li><span className="font-semibold">XA3:</span> Stark aggressiv (pH-Wert 4,5–4,0; Sulfat 600–3000 mg/l)</li>
                    </ul>
                    <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-600">
                      <span className="font-bold text-text-main">Umsetzung:</span>
                      <span>Bei aggressivem Sulfatangriff: Verwendung sulfatbeständiger Spezialzemente (SR-Zemente). Bei XA3 ist eine dichte Schutzbarriere (Beschichtung) Pflicht.</span>
                    </div>
                  </div>

                  {/* XM - Verschleiß */}
                  <div className="bg-white rounded-xl shadow-sm border border-l-4 border-l-amber-600 p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Hammer size={20} /></div>
                      <div>
                        <h5 className="font-bold text-text-main text-sm">XM (Mechanical Abrasion)</h5>
                        <p className="text-xs text-text-main/70">Mechanischer Verschleiß durch Abrieb (Stellplätze, Kettenfahrzeuge)</p>
                      </div>
                    </div>
                    <ul className="text-xs space-y-1 text-gray-700">
                      <li><span className="font-semibold">XM1:</span> Mäßige Abriebbeanspruchung (normale Gummianpressung)</li>
                      <li><span className="font-semibold">XM2:</span> Schwere Beanspruchung (Gabelstaplerverkehr, Luft-/Vollgummireifen)</li>
                      <li><span className="font-semibold">XM3:</span> Extreme Beanspruchung (Kettenfahrzeuge, Stahlrollenaufprall)</li>
                    </ul>
                    <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-600">
                      <span className="font-bold text-text-main">Umsetzung (z.B. XM2):</span>
                      <span>Hartstoffeinstreuungen (z.B. Siliciumcarbid, Quarz), Oberflächenveredelungen, Vakuumbetonierung, max. w/z = 0.45.</span>
                    </div>
                  </div>

                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Tragwerksausführung & Schutzgrenzwerte</h4>
                  <p className="text-sm text-gray-700 mb-3">Die planmäßige Dauerhaftigkeit des Stahlbetons gliedert sich in folgende bautechnische Maßnahmen:</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Zementstein-Kapillarität (w/z-Wert):</strong> Der Wasserzementwert beschreibt das Massenverhältnis von freiem Wasser zu Zement. Ein optimaler w/z-Wert (≤ 0,45–0,50) garantiert, dass die kapillaren Transportkanäle während der Zementhydratation weitgehend abgebunden und segmentiert werden. Dies minimiert die Diffusionsgeschwindigkeit von CO₂ und Chloriden.</li>
                    <li><strong>Betondeckung (<FormulaText text="$c_{\text{nom}}$" />):</strong> Berechnet sich aus dem Mindestwert (<FormulaText text="$c_{\text{min}}$" />) zur Gewährleistung der dauerhaften Verbundfestigkeit und des Korrosionsschutzes plus einem Sicherheits-Vorhaltemaß (<FormulaText text="$\Delta c_{\text{dev}}$" />, i.d.R. 10 mm, im Fertigteilwerk reduzierbar auf 5 mm). Sie fungiert als zeitliche physikalische Barriere gegen die Karbonatisierungsfront.</li>
                    <li><strong>Rissbreitenbeschränkung (<FormulaText text="$w_k$" />):</strong> Durch gezielte Bewehrungsaufteilung gegen Eigen- und Formzwang wird die kalkulatorische Rissbreite unter Gebrauchslast auf <FormulaText text="$w_k \le 0,3 \text{ mm}$" /> (oder <FormulaText text="$0,2 \text{ mm}$" /> bei XC/XD-Beaufschlagung) begrenzt, um das ungehinderte Einströmen korrosionsauslösender Medien direkt auf den blanken Stahl zu unterbinden.</li>
                    <li><strong>Sorgfältige Nachbehandlung:</strong> Schutz des Frischbetons vor Austrocknung (z.B. durch Abdecken, Folien oder chemische Curing-Filme) sichert das Wasser für die Hydratation der oberflächennahen Randschicht. Nur so entsteht dort ein porenarmes, widerstandsfähiges Gefüge.</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                   <h4 className="font-semibold mb-3 text-shiraz">Detailanalyse: Schädigungsmechanismen im Zementstein</h4>
                   <ul className="list-disc pl-5 space-y-3.5 text-sm text-gray-700">
                     <li><strong>Karbonatisierung (Bewehrungskorrosion):</strong> Kohlendioxid (CO₂) aus der Luft diffundiert gasförmig in die Betonporen und reagiert mit gelöstem Calciumhydroxid (Ca(OH)₂, Portlandit) zu Calciumcarbonat (CaCO₃):
                       <div className="my-1.5 p-2 bg-white/70 rounded border border-home-grau/20 font-mono text-xs text-center">
                         CO₂ + Ca(OH)₂ → CaCO₃ + H₂O
                       </div>
                       Durch diesen Verbrauch des alkalischen Puffers bricht der pH-Wert von ca. 12,5 auf unter 9,0 zusammen. Die dünne Passivierungsschicht des Stahls (Oxidschicht) löst sich auf (Depassivierung). Bei Anwesenheit von Feuchtigkeit und Sauerstoff beginnt der Stahl zu rosten (Eisenhydroxid-Bildung unter starkem Volumenzuwachs), was zu Betonsprüngen und Schalenabplatzungen führt.
                     </li>
                     <li><strong>Chloridinduzierter Lochfraß (Catastrophic Pitting):</strong> Chloride (Cl⁻) dringen über Tausalze (XD) oder Küsten-Gischt (XS) in den Beton ein. Erreichen sie an der Bewehrungsoberfläche eine kritische Konzentration (ca. 0,40 Gew.-% bezogen auf das Zementgewicht), durchbrechen sie die Passivschicht lokal selbst bei hohem alkalischem pH-Wert. Es entsteht eine sehr kleine Anode (Loch) und eine riesige Kathode (restliche Bewehrung). Dies führt zu rasantem, von außen nicht sichtbarem Stahlabtrag ohne sichtbare Vorwarnzeichen.
                     </li>
                     <li><strong>Alkali-Kieselsäure-Reaktion (AKR / "Betonkrebs"):</strong> Alkalien (Na⁺, K⁺) aus dem Zement reagieren mit amorpher Kieselsäure (SiO₂, z.B. in reaktiven Gesteinskörnungen wie opalisierendem Sandstein, Flint oder Grauwacke) bei Feuchtigkeitseinfluss. Es bildet sich ein quellfähiges Alkali-Silikatgel, das enormes Hydratationswasser aufsaugt und expandiert. Übersteigt der Schwellendruck die Zugfestigkeit des Zementsteins, zersprengt die Reaktion das Gefüge von innen heraus (netzartiges Rissbild).
                     </li>
                     <li><strong>Treibender Sulfatangriff:</strong> Aus dem Boden oder Grundwasser eindringende Sulfat-Ionen (SO₄²⁻) reagieren mit aluminathaltigen Phasen des Zementsteins (Monosulfat, Calciumaluminathydrate sowie unhydratisiertes C₃A) zu Ettringit des Zementsteins zu stark quellfähigem Ettringit (Tricalciumaluminat-trisulfat-hydrat). Die resultierende Volumenzunahme zerstört das verhärtete Kristallgefüge mechanisch. Dagegen helfen Zemente mit sehr niedrigem reaktiven Aluminatgehalt (SR-Zemente).
                     </li>
                   </ul>
                </div>
              </div>
              <BetonDauerhaftigkeitsSimulator />
              <ConcreteThematicLinks current="dauerhaftigkeit" />
            </div>
          )}

          {/* Asphalte */}
          {activeTab === 'asphalte' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Box className="w-5 h-5 text-gray-500" />
                  Asphalte im Straßen- und Wegebau (Viskoelastisches Verhalten)
                </h3>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-2">
                  <p>
                    Die Dauerhaftigkeit von Asphaltbefestigungen wird maßgeblich durch die thermo-mechanischen Alterungseigenschaften des viskoelastischen Bindemittels (Bitumen) sowie das mechanische Gesteinsgerüst bestimmt. Das maßgebliche Regelwerk in Deutschland bilden die <strong>ZTV Asphalt-StB</strong> (Zusätzliche Technische Vertragsbedingungen) und die <strong>TL Asphalt-StB</strong> (Technische Lieferbedingungen).
                  </p>
                  <p className="border-t border-home-grau/25 pt-2 text-xs text-slate-700">
                    <strong>Modernes Bindemittel-Testing (AL Sp-Asphalt):</strong> Neben den klassischen empirischen Versuchen (Nadelpenetration, Erweichungspunkt RuK) erfolgt die zeitgemäße, performance-orientierte Bewertung der Bitumenalterung und Gebrauchsverhalten mittels **DSR (Dynamisches Scherrheometer)** zur Bestimmung des Schermoduls $G^*$ und des Phasenwinkels $\delta$, sowie mittels **BBR (Biegebalkenrheometer)** zur Prüfung der Kälteflexibilität.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Schädigungsmechanismen & Alterung</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Bitumenalterung (Oxidation):</strong> Sauerstoff- und UV-Einwirkung führen zu einer chemischen Umwandlung von leichtflüchtigen Maltenen in hochmolekulare Asphaltene. Bitumen verhärtet (Abfall der Nadelpenetration, Anstieg des Erweichungspunktes RuK), verliert seine Elastizität und versprödet.</li>
                    <li><strong>Adhäsionsversagen (&quot;Stripping&quot;):</strong> Unter Feuchtigkeitseinfluss kommt es zur Verdrängung des Bitumenfilms von der Gesteinsoberfläche (Ablösung). Gemessen wird diese Affinität im Spaltzugversuch nach Frost-Tau-Wechsel-Lagerung gemäß DIN EN 12697-12 / -23.</li>
                    <li><strong>Thermische Rissbildung (Kälterisse):</strong> Bei extremem Frost zieht sich der Asphalt zusammen. Überschreiten die kryogenen Zugspannungen die Zugfestigkeit des verhärteten Asphalts, entstehen temperaturinduzierte Quer- und Blockrisse.</li>
                    <li><strong>Plastische Verformung (Spurrinnen bei Hitze):</strong> Bei hohen Temperaturen (&gt; 50°C) sinkt die Viskosität des Bitumens. Hohe Achslasten führen zu bleibenden Verformungen und Spurrinnen im ungenügend scherstabilen Gesteinsgerüst.</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Regelwerke & Schutzmaßnahmen</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Bitumenmodifikation:</strong> Verwendung polymermodifizierter Bitumen (PmB mit SBS- oder APP-Polymeren) zur Erweiterung der plastischen Spanne (höhere Viskosität bei Hitze, hohe Dehnfähigkeit bei Kälte).</li>
                    <li><strong>Schnittstellenoptimierung (Haftbrücken):</strong> Aufsprühen von kationischen Bitumenemulsionen (C60B1-S oder C40B5-S) zur Erzielung eines absolut dichten und schubfesten Schichtenverbundes nach ZTV BEA-StB.</li>
                    <li><strong>Mischgut-Zielporengehalt:</strong> Enge Einhaltung des Soll-Hohlraumgehaltes (typisch 2,0–4,5 Vol.-% für Asphaltdeckschichten). Zu hohe Hohlräume beschleunigen die Zutrittsalterung durch Wasser/Sauerstoff; zu niedrige bergen Verformungsrisiken.</li>
                    <li><strong>Flüssige Haftverbesserer:</strong> Zugabe aminischer oder metallorganischer Additive zum Bitumen bei kritischen, sauren Gesteinen (z.B. Granit, Quarzit), um polare Bindungen zu sichern und Stripping zu unterbinden.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Metalle */}
          {activeTab === 'metalle' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Metalle (Elektrochemische Korrosion & Schutz)
                </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Metallkorrosion ist ein elektrochemischer Prozess, bei dem das Metall oxidiert und in seinen energetisch stabileren oxidischen Zustand übergeht. Der Korrosionsschutz im Stahlbau ist in der Normenreihe <strong>DIN EN ISO 12944</strong> (Teile 1-9) und für Zinküberzüge in <strong>DIN EN ISO 14713</strong> geregelt.
          </p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Schädigungsmechanismen & Chemie</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Elektrochemische Grundlagen:</strong> An der Anode oxidiert Eisen zu zweiwertigen Ionen (<FormulaText text="Fe \rightarrow Fe^{2+} + 2e^-" />). An der Kathode wird Sauerstoff unter Wasserverbrauch reduziert (<FormulaText text="O_2 + 2H_2O + 4e^- \rightarrow 4OH^-" />). Es bildet sich schwerlösliches Eisenhydroxid (Rost).</li>
                    <li><strong>Lochfraßkorrosion (Pitting):</strong> Durchschlagen der dünnen schützenden Oxidschicht (Passivschicht) von Edelstahl oder Aluminium durch aggressive Halogenidionen (Chloride). Besonders kritisch in Schwimmbädern (Spannungsrisskorrosion durch Chlorid-Akkumulation bei Bauteilen aus z.B. 1.4401 oder 1.4571; hier sind hochlegierte Werkstoffe wie 1.4529 erforderlich).</li>
                    <li><strong>Kontaktkorrosion (Galvanisch):</strong> Bei direktem Kontakt zweier Metalle mit unterschiedlichem Standardpotenzial in einem Elektrolyten. Das unedlere Metall fungiert als Opferanode und korrodiert beschleunigt. <em>Einhalten der Fließregel:</em> Wasser darf nie von edleren Metallen (z. B. Kupfer) auf unedlere Metalle (z. B. Zink, Stahl) fließen.</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">DIN EN ISO 12944 Korrosionskategorien</h4>
                  <p className="text-xs text-slate-600 mb-2 font-medium">Die Atmosphäre wird nach Aggressivität in Kategorien eingeteilt:</p>
                  <ul className="text-xs space-y-1.5 text-gray-700 mb-3">
                    <li><span className="font-bold">C1 (Unbedeutend):</span> Beheizte Innenräume mit sauberer Luft (Büros).</li>
                    <li><span className="font-bold">C2 (Gering):</span> Unbeheizte Gebäude mit Kondensationsrisiko (Lagerhallen, ländlicher Raum).</li>
                    <li><span className="font-bold">C3 (Mäßig):</span> Stadt- und Industrieatmosphäre mit mäßiger SO₂-Belastung, Produktionsräume mit hoher Feuchte.</li>
                    <li><span className="font-bold">C4 (Stark):</span> Industrie- und Küstenbereiche mit mäßiger Salzbelastung, Chemieanlagen, Hallenbäder.</li>
                    <li><span className="font-bold">C5 (Sehr stark):</span> Küsten- und Offshorebereiche mit hoher Salzbelastung, extreme Feuchte.</li>
                    <li><span className="font-bold">CX (Extrem):</span> Offshorebereiche mit extremer Salzbelastung, industrielle Extrembedingungen.</li>
                  </ul>
                  <p className="text-xs text-slate-700">
                    Schutzdauern bei Beschichtungen werden in <strong>Low (L: 2-7 Jahre)</strong>, <strong>Medium (M: 7-15 Jahre)</strong>, <strong>High (H: 15-25 Jahre)</strong> und <strong>Very High (VH: &gt; 25 Jahre)</strong> klassifiziert.
                  </p>
                </div>
              </div>
              <MetalDurabilitySimulator />
              <MetalThematicLinks current="dauerhaftigkeit" />
            </div>
          )}

          {/* Holz */}
          {activeTab === 'holz' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Bug className="w-5 h-5 text-green-600" />
                  Holz und Holzwerkstoffe (Biologischer Abbau & DIN 68800)
                </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Holzschutz ist im deutschen Regelwerk nach <strong>DIN 68800</strong> geregelt. Die Norm gliedert sich in bauliche Maßnahmen (Teil 2), chemischen Holzschutz (Teil 3) und Bekämpfung (Teil 4). Der konstruktive Holzschutz (Teil 2) mit dem Ziel, die Holzfeuchte dauerhaft unter 20 % zu halten, hat stets Vorrang vor chemischen Maßnahmen.
          </p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Schädigungsmechanismen & Physiologie</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Pilzbefall (Holzfeuchte u ≥ 20%):</strong> 
                      <ul className="list-circle pl-4 mt-1 space-y-1 text-xs">
                        <li><em>Braunfäule:</em> Abbau der Cellulose. Holz schrumpft, wird braun und bricht würfelförmig (Würfelbruch; z.B. Echter Hausschwamm, Kellerschwamm).</li>
                        <li><em>Weißfäule:</em> Abbau von Lignin und Cellulose. Holz fasert weißlich aus, verliert an Masse, bleibt aber zäh (z.B. Trameten).</li>
                        <li><em>Moderfäule:</em> Abbau unter dauernd extrem nassen Verhältnissen (z.B. Erdkontakt). Rohdichteverlust der äußeren Millimeter.</li>
                      </ul>
                    </li>
                    <li><strong>Insektenbefall:</strong> Larven fressen Gänge durch Splintholz (Hausbocklarve bevorzugt Nadelholz, Gewöhnlicher Nagekäfer, d.h. &quot;Holzwurm&quot;, befällt Laub- und Nadelholz bei geringer Restfeuchte; Splintholzkäfer bevorzugt stärkereiche Laubhölzer wie Eiche).</li>
                    <li><strong>Photochemischer Abbau (UV-Strahlung):</strong> Sonnenlicht baut das Bindeglied Lignin in den Holzaußenzellen ab. Es verfärbt sich bräunlich, wird wasserlöslich, wäscht aus und vergraut.</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold mb-3 text-shiraz">Gebrauchsklassen (GK) nach DIN 68800-1</h4>
                    <ul className="text-xs space-y-1 px-1 text-gray-700">
                      <li><span className="font-bold">GK 0:</span> Innen verbaut, ständig trocken (beheizt). Befall durch holzzerstörende Pilze und Insekten ausgeschlossen. <em>Vorbeugender chemischer Holzschutz ist nach DIN 68800 nicht erforderlich und soll unterbleiben; baulicher Holzschutz genügt..</em></li>
                      <li><span className="font-bold">GK 1:</span> Innen verbaut, trocken. Insektenbefall möglich, keine Pilzgefahr (z.B. Dachstühle). Schwellen- und Balkenaußenbereiche kontrollierbar ausführen.</li>
                      <li><span className="font-bold">GK 2:</span> Unter Dach, keine direkte Bewitterung, aber zeitweise erhöhte Luftfeuchte mit möglicher Kondensation (Pilzbefall möglich).</li>
                      <li><span className="font-semibold text-shiraz">GK 3.1:</span> Außen, bewittert, ohne Wasseranlagerung (z.B. Holzfassaden).</li>
                      <li><span className="font-semibold text-shiraz">GK 3.2:</span> Außen, bewittert, mit Wasseranlagerung (z.B. waagerechte Terrassendielen).</li>
                      <li><span className="font-bold">GK 4:</span> Ständiger Erdkontakt oder direkter Süßwassereinfluss (z.B. Pfähle, Spielgeräte).</li>
                      <li><span className="font-bold text-blue-600">GK 5:</span> Ständiger Meerwasserkontakt (z.B. Hafenbauten, Buhnen). Erfordert extrem widerstandsfähige Hölzer oder massiven Schutz vor Schiffsbohrwurmbefall.</li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-205 flex flex-col gap-1">
                    <span className="font-bold text-xs text-text-main">Wichtige Holzveredelungen (Eco-Holzschutz):</span>
                    <span className="text-xs text-gray-600 leading-relaxed">
                      <strong>Thermowood (TMT):</strong> Durch Kochen des Holzes unter Ausschluss von Sauerstoff bei 160–220 °C reagiert die Hemicellulose ab, wodurch Pilzen der Nährboden entzogen wird. Die Feuchteaufnahme sinkt um ca. 50%.
                    </span>
                    <span className="text-xs text-gray-600 leading-relaxed mt-1">
                      <strong>Acetylierung (Accoya):</strong> Chemische Pfropfung mit Essigsäureanhydrid ersetzt hydrophile Hydroxylgruppen (-OH) durch hydrophobe Acetylgruppen. Dauerhaftigkeitsklasse springt von 4/5 (Kiefer) auf Klasse 1 (sehr dauerhaft) bei überragender Dimensionsstabilität.
                    </span>
                  </div>
                </div>
              </div>
              <TimberDurabilitySimulator />
              <WoodThematicLinks current="dauerhaftigkeit" />
            </div>
          )}

          {/* Kunststoffe */}
          {activeTab === 'kunststoffe' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  Kunststoffe (Baupolymere & Alterung)
                </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Dauerhaftigkeit von Kunststoffen (z.B. PMMA, PVC, PE, PP) hängt eng mit ihrer molekularen Struktur (Amorpher/Kristalliner Anteil) zusammen. Alterungsprozesse sind meist irreversibel und werden durch physiko-chemische Wechselwirkungen mit der Umwelt ausgelöst.
          </p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Schädigungsmechanismen & Physik</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Photooxidation (UV-Degradation):</strong> Hochenergetische UV-Strahlung initiiert Radikalreaktionen. Unter Sauerstoffzutritt brechen die Polymerhauptketten auf (Schnittstellen-Schwächung). Visualisiert durch Vergilbung, Mikrorissbildung und drastischen Verlust der Schlagzähigkeit.</li>
                    <li><strong>Weichmacherwanderung (Migration):</strong> In Weich-PVC (z.B. Dachbahnen) sind Weichmacher (Phthalate) physikalisch eingelagert. Bei Kontakt mit anderen Polymeren (z.B. Polystyrol-Hartschaum EPS/XPS) diffundieren die Weichmacher ab. Folge: Das PVC versprödet und bricht, das EPS schrumpft bzw. schmilzt.</li>
                    <li><strong>Umgebungsbedingte Spannungsrissbildung (ESC):</strong> Kombinierte Wirkung mechanischer Zugspannungen und oberflächenaktiver Medien (z.B. Tenside, Öle). Es kommt zu lokalen Entflechtungen der amorphen Polymerketten ohne direkte chemische Zersetzung, was zu plötzlichen Sprödbrüchen führt (äußerst kritisch bei Rohrleitungen aus PE/PP).</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Schutzmaßnahmen & Bauteildesign</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>UV-Stabilisierung:</strong> Zumischung von Absorbern (z.B. Rußpartikel für Erdkabel/Geogitter) oder Radikalfängern (HALS - Hindered Amine Light Stabilizers) im Rohstoff, welche die oxidative Kettenreaktion abfangen.</li>
                    <li><strong>Oberflächenbeschichtungen (Koextrusion):</strong> Schutz empfindlicher Trägerwerkstoffe (wie PVC) durch koextrudierte dünne Deckschichten aus hoch UV-resistentem PMMA (z.B. bei farbigen Fensterprofilen).</li>
                    <li><strong>Einbau mechanischer Trennlagen:</strong> Verlegung von widerstandsfähigen Trennvliesen (z.B. Glasvlies oder Polyestervlies) zwischen unverträglichen Stoffen (wie Weich-PVC-Dachbahnen und Polystyrol-Dämmplatten) zur physikalischen Blockade der Weichmacherwanderung.</li>
                    <li><strong>Sorgfältiges Bauteildesign:</strong> Konsequente Vermeidung scharfer Kanten und plötzlicher Querschnittssprünge, da Kerbspannungen die umgebungsbedingte Spannungsrissbildung (ESC) massiv beschleunigen.</li>
                  </ul>
                </div>
              </div>
              <PlasticsThematicLinks current="dauerhaftigkeit" />
            </div>
          )}

          {/* Naturstein & Mauerwerk */}
          {activeTab === 'naturstein' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-stone-600" />
                  Naturstein & Mauerwerk (Verwitterung & WTA)
                </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Naturstein und Ziegelmauerwerk sind mineralisch-poröse Gefüge. Die Dauerhaftigkeit wird primär durch den Feuchtegehalt reguliert, da Wasser als Transportmittel für Schadsalze dient und Voraussetzung für Frost-Tau-Schäden ist.
          </p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Schädigungsmechanismen & Salze</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Salzkristallisationssprengung:</strong> Eindringendes Wasser transportiert gelöste Salze (Sulfat, Nitrat, Chlorid). Bei Verdunstung des Wassers kristallisieren diese. Findet dies unterhalb der Oberfläche statt (<span className="font-bold">Kryptofloreszenz</span>), übersteigt der entstehende übersteigt der Kristallisationsdruck (theoretisch bis in den Bereich mehrerer 10 MPa) die Zugfestigkeit die Zugfestigkeit des Baustoffs, was zu Absanden und Abschuppen führt.</li>
                    <li><strong>Gips-Schalenbildung:</strong> Schwefeldioxid in säuerlicher Luft reagiert mit Calciumcarbonat kalkhaltiger Natursteine (z.B. Kalkstein, Sandstein mit kalkigem Bindemittel) zu Gips (<FormulaText text="CaCO_3 \rightarrow CaSO_4 \cdot 2H_2O" />). Dieser Gips lagert sich ab und bildet dichte Ruß-Gips-Krusten, die wasserundurchlässig sind und bei Frost-Tau-Beanspruchung großflächig abplatzen.</li>
                    <li><strong>Frostsprengung:</strong> Freies Wasser dehnt sich beim Gefrieren im Kapillarporenraum schlagartig um ca. 9 % aus. Übersteigt der Sättigungsgrad den kritischen Wert (Eisfreien Raum unterschritten), kommt es zu Gefügesprengungen.</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Schutz- & Instandsetzungsmaßnahmen</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Sanierputzsysteme nach WTA-Merkblatt 2-9:</strong> Spezielle lufthaltige, stark hydrophobe Putze mit extrem hohem Gesamtporenvolumen (&gt; 40 Vol.-%) und hoher Wasserdampfdiffusionsoffenheit. Die Salz-Kristallisation wird schadlos in die makroporöse Putzzone verlagert, schützt somit das dahinterliegende Mauerwerk und verhindert Ausblühungen auf der Oberfläche.</li>
                    <li><strong>Hydrophobierung (Silane/Siloxane):</strong> Chemische Oberflächenbehandlung, die den Kontaktwinkel des flüssigen Wassers erhöht (Abperleffekt), die Wasserdampfdiffusion (Atmung) jedoch nicht blockiert.</li>
                    <li><strong>Kompressen-Entsalzung:</strong> Aufbringen feuchter Zellulose- oder Bentonit-Kompressen auf das Mauerwerk. Beim Austrocknen wandern die Salze kapillar aktiv in die Kompresse, die anschließend mechanisch entfernt wird.</li>
                    <li><strong>Konstruktiver Schutz:</strong> Einbau mechanischer feuchtesperrender Horizontalsperren im Sockelbereich (z.B. Bitumenbahnen oder Injektionsverfahren) gegen aufsteigende Kapillarfeuchtigkeit.</li>
                  </ul>
                </div>
              </div>
              <MauerwerkThematicLinks current="dauerhaftigkeit" />
            </div>
          )}

          {/* Glas */}
          {activeTab === 'glas' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Maximize className="w-5 h-5 text-cyan-500" />
                  Glas (Glaskorrosion, ESG-Spontanbruch & HST)
                </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Silicatglas gilt als äußerst dauerhaft, reagiert jedoch empfindlich auf stagnierende Feuchteoberflächen (pH-Wert-Anstieg) sowie auf mikroskopische Einschlüsse im Gefüge vorgespannter Scheiben.
          </p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Schädigungsmechanismen & Chemie</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Glaskorrosion (Hydrolyse):</strong> Stehendes Wasser (Kondensfeuchte in Stapeln) führt zu einem Ionenaustausch. Natrium- und Kalium-Ionen des Glases werden gegen Protonen des Wassers ausgetauscht. Der pH-Wert im Wasserfilm steigt über 9 an, was das schützende Si-O-Si-Netzwerk direkt auflöst. Es bilden sich irreversible, matte, weißliche Flecken (&quot;Blindwerden&quot;).</li>
                    <li><strong>NiS-Spontanbruch bei ESG:</strong> Bei Einscheiben-Sicherheitsglas (ESG) können fertigungsbedingt winzige Nickelsulfid-Einschlüsse (NiS) verbleiben. NiS verändert über Jahre hinweg seine Kristallstruktur (Verzögerte Phasenumwandlung von Hochtemperatur-<FormulaText text="\alpha" />-NiS in Tieftemperatur-<FormulaText text="\beta" />-NiS) unter einer Volumenzunahme von ca. 2,4 %. Dies führt in der Zugspannungszone zu plötzlichem Spontanbruch.</li>
                    <li><strong>Thermischer Bruch (Thermobruch):</strong> Schneller Temperaturwechsel (Teilverschattung durch Bäume oder Bauteile bei starker Sonneneinstrahlung) führt zu differentiellem Dehnungsverhalten und Rissfortschritt von den Mikrorissen der Schnittkante aus.</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Prüfverfahren & Schutzmaßnahmen</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Heißlagerungsprüfung / Heat-Soak-Test (HST):</strong> Zur Vermeidung von in-situ Spontanbrüchen wird ESG im Werk einer Heißlagerungsprüfung nach <strong>DIN EN 14179</strong> unterzogen. Scheiben mit gefährlichen NiS-Einschlüssen werden kontrolliert im Ofen zerstört, bevor sie auf die Baustelle gelangen.</li>
                    <li><strong>Kantenbearbeitung (Säumen & Polieren):</strong> Professionelles K-Schleifen der Scheibenränder entfernt gefährliche Mikrorisse der Schnittkante vollständig und erhöht die mechanische und thermische Belastbarkeit um bis zu 400 %.</li>
                    <li><strong>Thermische Vorspannung (ESG/TVG):</strong> Gezieltes Erhitzen und schnelles Abkühlen erzeugt dauerhafte Druckspannungen in den Glas-Außenseiten. Erhöht die Biegezugfestigkeit massiv und macht das Glas widerstandsfähig gegen Temperaturgradienten bis 200 K.</li>
                    <li><strong>Kondensatvermeidung:</strong> Ausreichende Hinterlüftung und Vermeidung von Hitzestaus (z.B. durch dunkle Werbeaufkleber oder zu nahe Vorhänge), um thermische Spannungsbrüche konstruktiv auszuschließen.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Unverträglichkeiten */}
          {activeTab === 'unvertraeglichkeiten' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-home-prim flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Materialunverträglichkeiten
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Metalle & Holz / Mineralik</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Metalle untereinander (Bimetallkorrosion):</strong> Direkter Kontakt von edlen (z.B. Kupfer, Edelstahl) und unedlen Metallen (z.B. Zink, Aluminium) in Verbindung mit Feuchtigkeit führt zur Zerstörung des unedleren Metalls. <em>Fließregel:</em> Wasser darf nicht von Kupferbauteilen auf Zinkbauteile fließen (Kupferionen zerstören Zink).</li>
                    <li><strong>Stahl in gerbstoffreichem Holz:</strong> Hölzer wie Eiche, Edelkastanie oder Robinie enthalten viel Gerbsäure (Tannin). Unverzinkter oder verzinkter Stahl korrodiert hier extrem schnell, das Holz verfärbt sich blauschwarz. <em>Lösung:</em> Edelstahl-Verbindungsmittel (A2/A4) verwenden.</li>
                    <li><strong>Aluminium/Zink & frischer Beton:</strong> Die hohe Alkalität (pH &gt; 12) von frischem Zementmörtel oder Beton greift amphotere Metalle wie Aluminium, Zink oder Blei stark an (Alkalikorrosion).</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Kunststoffe, Dichtstoffe & Bitumen</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Weichmacherwanderung (PVC & EPS/XPS):</strong> Weich-PVC (z.B. Dachbahnen, Kabelummantelungen) darf nicht direkt auf Polystyrol-Dämmung (EPS/XPS) verlegt werden. Die Weichmacher wandern in die Dämmung, das PVC versprödet, die Dämmung schrumpft/zersetzt sich. <em>Lösung:</em> Trennlage (z.B. Glasvlies) einbauen.</li>
                    <li><strong>Bitumen & EPS/XPS:</strong> Lösungsmittelhaltige Bitumenanstriche oder -kleber lösen Polystyrol-Dämmstoffe auf. Nur lösungsmittelfreie (z.B. KMB/PMBC) Produkte verwenden.</li>
                    <li><strong>Dichtstoffe (Silikon):</strong> Essigvernetzendes Silikon spaltet Essigsäure ab und führt auf ungeschützten Metallen (Kupfer, Zink, Messing) zu Korrosion. Bei Naturstein führt falsches Silikon zu irreversibler Randzonenverschmutzung (Verfärbung durch Weichmacher).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    
      <ModuleFooter 
        wikipedia={[
          { title: 'Dauerhaftigkeit', url: 'https://de.wikipedia.org/wiki/Dauerhaftigkeit' },
          { title: 'Expositionsklasse', url: 'https://de.wikipedia.org/wiki/Expositionsklasse' },
          { title: 'Betondeckung', url: 'https://de.wikipedia.org/wiki/Betondeckung' }
        ]}
        literatur={[
          'Gehlen, C.; Kapteina, G. (2012): Dauerhaftigkeitsbemessung von Stahlbetonbauteilen (Ernst & Sohn)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'fib Bulletin 34: Model Code for Service Life Design (International Federation for Structural Concrete)'
        ]}
        regelwerke={[
          { title: 'DIN EN 206 / DIN 1045-2 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+206' },
          { title: 'DIN EN 1992-1-1 / NA (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' },
          { title: 'DAfStb Heft 600: Erläuterungen zu DIN EN 1992-1-1 und DIN EN 1992-1-1/NA', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' }
        ]}
        formeln={[
          {
            formel: 'x_c(t) = \\sqrt{2 \\cdot k_{\\text{nac}} \\cdot \\Delta C \\cdot t} = k_c \\cdot \\sqrt{t}',
            erklaerung: 'Karbonatisierungsfortschritt xc(t) [mm] nach dem Diffusionsgesetz (Wurzel-Zeit-Gesetz): Der Karbonatisierungsbeiwert kc hängt maßgeblich vom w/z-Wert, der Zementart und der Umgebungsfeuchte ab.',
            quelle: 'fib Model Code / DAfStb'
          },
          {
            formel: 'c_{\\text{nom}} = c_{\\text{min}} + \\Delta c_{\\text{dev}} \\ge \\max\\{c_{\\text{min,b}}; c_{\\text{min,dur}}; 10\\,\\text{mm}\\} + 10\\,\\text{mm}',
            erklaerung: 'Nennmaß der Betondeckung cnom nach EC2: Summe aus Mindestbetondeckung cmin (Verbund cmin,b + Dauerhaftigkeit cmin,dur) und Vorhaltemaß Δcdev (in der Regel 10 mm bzw. 15 mm bei erhöhten Toleranzen).',
            quelle: 'DIN EN 1992-1-1 Abs. 4.4.1'
          }
        ]}
      />
</div>
  );
}
