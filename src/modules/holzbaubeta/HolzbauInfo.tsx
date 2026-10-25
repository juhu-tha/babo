import { Info, History, ArrowRight, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';
import ModuleHistoryView from '@/src/components/ui/ModuleHistoryView';
import { MODULE_HISTORY_DATA } from '@/src/data/moduleHistoryData';
import type { Dispatch, SetStateAction } from 'react';

interface HolzbauInfoProps {
  infoView: "uebersicht" | "historie";
  setInfoView: Dispatch<SetStateAction<"uebersicht" | "historie">>;
}

export default function HolzbauInfo({ infoView, setInfoView }: HolzbauInfoProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_info">

        {/* Sub-Navigation between Übersicht and Historie */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 border border-home-grau/25 rounded-xl w-fit">
          <button aria-pressed={infoView === 'uebersicht'}
            onClick={() => setInfoView('uebersicht')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                infoView === 'uebersicht'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'text-text-main/80 hover:text-text-main hover:bg-white/60'
              }`}
          >
            <Info size={14} />
            Fachportale &amp; Systemvorteile
          </button>
          <button aria-pressed={infoView === 'historie'}
            onClick={() => setInfoView('historie')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                infoView === 'historie'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'text-text-main/80 hover:text-text-main hover:bg-white/60'
              }`}
          >
            <History size={14} />
            Historie &amp; Normenwandel
          </button>
        </div>

        {infoView === 'uebersicht' ? (
          <>
            {/* Reference sources grids */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-shiraz/50 transition-all flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-black text-shiraz tracking-widest block mb-1">Netzwerk Deutschland</span>
                  <h3 className="font-extrabold text-text-main text-base mb-2">Informationsdienst Holz</h3>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    Fachinformationen des Informationsvereins Holz (Reihe „holzbau handbuch“) zu Konstruktion, Bemessung, Brand-, Schall- und Feuchteschutz.
                  </p>
                </div>
                <a 
                  href="https://informationsdienst-holz.de/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-shiraz hover:underline font-bold text-xs flex items-center gap-1 mt-2 group"
                >
                  Zur Plattform <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-black text-amber-800 tracking-widest block mb-1">Prüfzeugnisse &amp; Details</span>
                  <h3 className="font-extrabold text-text-main text-base mb-2">dataholz.eu</h3>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    Frei zugänglicher Bauteilkatalog der Holzforschung Austria mit herstellerneutralen Wand-, Decken- und Dachaufbauten und deren bauphysikalischen und brandschutztechnischen Kennwerten (in Österreich von den Baubehörden als Nachweis anerkannt; in Deutschland kein bauaufsichtlicher Verwendbarkeitsnachweis, nur Planungshilfe).
                  </p>
                </div>
                <a 
                  href="https://www.dataholz.eu/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-amber-800 hover:text-amber-950 font-bold text-xs flex items-center gap-1 mt-2 group"
                >
                  Zur Plattform <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-black text-amber-800 tracking-widest block mb-1">Wissenschaft &amp; Praxis</span>
                  <h3 className="font-extrabold text-text-main text-base mb-2">Institut für Holzbau</h3>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    Die Leitinstitution für Fortbildung und Standardisierung im zukunftsfähigen Massivholzbau. Vermittelt komprimiertes Fachwissen zu konstruktiven Regeln, Normenentwicklungen der Landesbauordnungen (LBO) und Holzbaurichtlinien (HBrR).
                  </p>
                </div>
                <a 
                  href="https://www.institut-holzbau.de/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-amber-800 hover:text-amber-950 font-bold text-xs flex items-center gap-1 mt-2 group"
                >
                  Zur Plattform <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>

            {/* Interactive Core Knowledge Cards */}
            <div className="border border-home-grau/30 rounded-xl p-5 bg-off-white flex flex-col gap-4">
              <h3 className="font-black text-text-main text-base flex items-center gap-2">
                <Layers size={18} className="text-amber-800" /> Planungsrelevante Systemvorteile im modernen Hochbau
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex gap-3">
                  <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm text-text-main">Vorkonditionierung &amp; Vorfertigung (Just-in-Time)</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                      Wand- und Deckensysteme werden witterungsgeschützt im Werk CNC-gesteuert abgebunden und inklusive Installationsebene vorbereitet. Das verkürzt die Montagezeit vor Ort und verringert das Risiko von Baufeuchte.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex gap-3">
                  <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm text-text-main">Leichtgewicht mit hoher spezifischer Festigkeit</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                      Holz hat im Verhältnis zu seiner Dichte eine hohe Festigkeit parallel zur Faser. Das ist z. B. bei Aufstockungen günstig, wenn der Bestand nur geringe Zusatzlasten aufnehmen kann.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex gap-3">
                  <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm text-text-main">Zirkularität und Schadstofffreiheit</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                      Lösbar verbundene (geschraubte, gesteckte) Bauteile lassen sich zerstörungsarm rückbauen und wiederverwenden; danach folgen stoffliche und zuletzt energetische Verwertung (Kaskadennutzung).
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex gap-3">
                  <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm text-text-main">Integrierter sommerlicher Hitzeschutz</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                      Holzwände kombiniert mit zellulosischer oder faserbasierter Einblasdämmung können wegen der hohen Wärmespeicherfähigkeit der Dämmstoffe große Phasenverschiebungen erreichen (Größenordnung 10 h, aufbauabhängig) und dämpfen die Temperaturamplitude – günstig für den sommerlichen Wärmeschutz.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 flex gap-3 leading-relaxed">
              <AlertTriangle size={18} className="text-amber-700 flex-shrink-0" />
              <div>
                <strong>Hinweis:</strong> Die Landesbauordnungen wurden für den mehrgeschossigen Holzbau schrittweise geöffnet. Die Muster-Holzbaurichtlinie (MHolzBauRL 2024, veröffentlicht in den Amtlichen Mitteilungen des DIBt 2025/2) regelt Bauteile in Holzbauweise für die Gebäudeklassen 4 und 5. Maßgebend ist die jeweilige Landesfassung (Einführung über die Landes-VV TB).
              </div>
            </div>
          </>
        ) : (
          <ModuleHistoryView history={MODULE_HISTORY_DATA.holzbau} accentColor="text-amber-800" />
        )}

      </div>
    );
}
