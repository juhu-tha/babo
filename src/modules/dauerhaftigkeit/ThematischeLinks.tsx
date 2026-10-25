// Ausgelagert aus src/modules/Dauerhaftigkeit.tsx (AP 5.2)
import { ShieldAlert, Layers, BookOpen, ArrowRight } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';

export function WoodThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
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

export function PlasticsThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
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

export function MauerwerkThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
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

export function ConcreteThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
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

export function MetalThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
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
