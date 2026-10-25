import { Compass, BookOpen, FileSpreadsheet, Layers, Factory, Percent, ClipboardCheck, Building, AlertTriangle, HelpCircle, Globe, Sparkles, Recycle } from 'lucide-react';
import LeitfadenEpdKonzepte from './LeitfadenEpdKonzepte';
import { FormulaText } from '@/src/components/ui/FormulaText';
import LeitfadenLcaBerechnung from './LeitfadenLcaBerechnung';
import LeitfadenDgnbQng from './LeitfadenDgnbQng';
import AnhangPraxisbeispiele from './AnhangPraxisbeispiele';
import AnhangChecklisten from './AnhangChecklisten';
import AnhangUebungen from './AnhangUebungen';
import AnhangDatenbanken from './AnhangDatenbanken';
import AnhangGlossarSoftware from './AnhangGlossarSoftware';
import type { Dispatch, SetStateAction } from 'react';

interface LeitfadenProps {
  activeEcoDb: "oekobaudat" | "dgnb" | "ibu" | "wecobis";
  activeStep: number;
  checklistState: Record<string, boolean>;
  setActiveEcoDb: Dispatch<SetStateAction<"oekobaudat" | "dgnb" | "ibu" | "wecobis">>;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setChecklistState: Dispatch<SetStateAction<Record<string, boolean>>>;
}

export default function Leitfaden({ activeEcoDb, activeStep, checklistState, setActiveEcoDb, setActiveStep, setChecklistState }: LeitfadenProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">

        {/* Header Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-shiraz/10 border border-shiraz/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-shiraz self-start">
            <Compass size={12} className="text-shiraz" />
            Akademischer Wegweiser
          </span>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <BookOpen className="text-shiraz" size={24} /> EPD- &amp; QNG-Leitfaden für Studierende
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p>
              Eine praxisbezogene, schrittweise Anleitung zur fachgerechten Erstellung einer Gebäude-Ökobilanz (LCA), dem wissenschaftlichen Umgang mit Umweltproduktdeklarationen (EPDs) sowie dem Konformitätsnachweis nach DGNB- und QNG-Kriterien.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

          {/* Steps Left Interactive Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-2">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest pl-2 mb-1">
              Leitfaden-Schritte
            </span>
            {[
              { label: 'Schritt 1: EPD-Konzepte', sub: 'Datenquellen & EPD-Typen', icon: FileSpreadsheet },
              { label: 'Schritt 2: Mengen & Dichten', sub: 'Massenbilanz & BIM', icon: Layers },
              { label: 'Schritt 3: Lebenszyklus', sub: 'DIN EN 15978 Phasen', icon: Factory },
              { label: 'Schritt 4: LCA-Berechnung', sub: 'Formeln & Faktoren', icon: Percent },
              { label: 'Schritt 5: DGNB & QNG', sub: 'Förderung & Auditierung', icon: ClipboardCheck },
              { label: 'Anhang 1: Praxisbeispiele', sub: 'Außenwand & Gebäude', icon: Building },
              { label: 'Anhang 2: Checklisten & Fehler', sub: 'Prävention & Kontrollen', icon: AlertTriangle },
              { label: 'Anhang 3: Übungsaufgaben', sub: 'Klausuren & Lösungen', icon: HelpCircle },
              { label: 'Anhang 4: Öko-Datenbanken', sub: 'QNG, DGNB, IBU & Co.', icon: Globe },
              { label: 'Anhang 5: Glossar & Software', sub: 'Wichtige Begriffe & Tools', icon: Compass }
            ].map((step, idx) => {
              const IconComp = step.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer select-none ${
                      activeStep === idx
                        ? 'border-shiraz bg-shiraz/5 shadow-xs'
                        : 'border-home-grau/30 bg-white hover:bg-slate-50'
                    }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                      activeStep === idx ? 'bg-shiraz text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                    <IconComp size={15} />
                  </div>
                  <div className="min-w-0">
                    <strong className={`text-[11px] block font-bold leading-tight ${activeStep === idx ? 'text-shiraz' : 'text-slate-800'}`}>
                      {step.label}
                    </strong>
                    <span className="text-[9px] text-slate-400 truncate block mt-0.5">{step.sub}</span>
                  </div>
                </button>
              )
            })}

            <div className="bg-emerald-50/30 p-4 border border-emerald-100/80 rounded-xl mt-4">
              <h4 className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-emerald-700" />
                Prüfungsrelevant:
              </h4>
              <p className="text-[10px] text-emerald-800/80 mt-1.5 leading-relaxed">
                Ökobilanzierungen sind Kernbestandteil moderner Bauingenieurs- und Projektmanagement-Thesis-Ausarbeitungen. Verwenden Sie diesen Leitfaden als strukturelles Grundgerüst.
              </p>
            </div>
          </div>

          {/* Stepper Details Right Panel (3-cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {activeStep === 0 && <LeitfadenEpdKonzepte />}

            {activeStep === 1 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
                <div className="border-b border-home-grau/25 pb-3">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Schritt 2 von 5</span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    Mengenermittlung, Dichteabgleich &amp; BIM-Kopplung
                  </h3>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  EPD-Werte sind in der Regel auf eine funktionelle Einheit (<strong>Functional Unit</strong>) normiert, meist auf <strong>1 kg</strong> eines Stoffs oder <strong>1 m³</strong> eines Bauprodukts. Um eine vollständige Bauteil- oder Gebäude-Ökobilanzierung zu berechnen, müssen Sie die Volumina akkurat ermitteln und mittels Rohdichten in Massen konvertieren.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/25 flex flex-col gap-2">
                    <strong className="text-xs font-bold text-slate-900 block uppercase tracking-wider">Massenermittlungs-Formel</strong>
                    <div className="bg-white p-3 rounded-lg border border-stone-200/60 flex justify-center items-center">
                      <FormulaText text="m = V \cdot \rho \quad \text{mit} \quad \mathrm{[kg] = [m^3] \cdot [kg/m^3]}" className="text-xs font-semibold text-shiraz" />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                      Rohdichten variieren stark je nach Gesteinskörnung, Feuchte und Porenanteil. Nutzen Sie die baustoffkundigen Standardwerte der Board-Module.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/25 flex flex-col gap-2">
                    <strong className="text-xs font-bold text-slate-900 block uppercase tracking-wider">Kopplung mit der BIM-Methodik</strong>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      In modernen Planungsbüros und bei Studienprojekten werden Volumina direkt aus 3D-BIM-Modellen (z.B. Autodesk Revit, Allplan) über Bauteillisten oder den IFC-Datenstandard exportiert.
                    </p>
                  </div>
                </div>

                {/* References table to other modules */}
                <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
                    <Compass size={14} className="text-emerald-700" />
                    Interdisziplinärer Bezug zu anderen Board-Modulen:
                  </h4>

                  <div className="space-y-2.5 text-[11px]">
                    <div className="p-2.5 bg-white border border-stone-150 rounded-lg flex items-start gap-2.5">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded shrink-0">BIM &amp; Baustoffe</span>
                      <div>
                        <strong>Attribute &amp; Schichtdaten:</strong> Schaue in dieses Modul, um zu sehen, wie IFC-Schnittstellen Schichtdicken und Material-UUIDs halten, um automatisierte Ökobilanzen direkt im CAD-Kern anzustoßen.
                      </div>
                    </div>

                    <div className="p-2.5 bg-white border border-stone-150 rounded-lg flex items-start gap-2.5">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded shrink-0">Materialdatenbanken</span>
                      <div>
                        <strong>ÖKOBAUDAT Mapping:</strong> Bietet direkten Zugang zu den Datenbankportalen und Suchregistern, um LCA-Charakterisierungsfaktoren verifiziert abzugreifen.
                      </div>
                    </div>

                    <div className="p-2.5 bg-white border border-stone-150 rounded-lg flex items-start gap-2.5">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded shrink-0">Baustoffkenngrößen</span>
                      <div>
                        <strong>Dichtewerte &amp; Porosität:</strong> Finde dort exakte physikalische Kenngrößen von mineralischen und metallischen Rohstoffen für genaue Massenabbildungen.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
                <div className="border-b border-home-grau/25 pb-3">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Schritt 3 von 5</span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    Systemgrenzen &amp; Lebenszyklusmodule (DIN EN 15978)
                  </h3>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  Lebenszyklusberechnungen erfassen nicht nur die unmittelbare Produktion eines Baustoffs, sondern bewerten die ökologischen Einflüsse in streng abgegrenzten Modulen von der Wiege bis zur Bahre (<strong>Cradle to Grave</strong>) sowie darüber hinaus (Wiederverwertbarkeit):
                </p>

                <div className="space-y-3 mt-1">
                  {[
                    { code: 'A1 - A3', phase: 'Herstellungsphase (Cradle-to-Gate)', desc: 'Rohstoffbereitstellung (A1), Transport zum Werk (A2), tatsächliche Herstellung im Werk (A3). Dies ist die fossil-intensivste Phase mineralischer Baustoffe.' },
                    { code: 'A4 - A5', phase: 'Errichtungsphase', desc: 'Transporte zur Baustelle (A4), Einbautätigkeiten und Baustellenabfälle (A5).' },
                    { code: 'B1 - B7', phase: 'Nutzungsphase', desc: 'Nutzung (B1), Instandhaltung/Wartung (B2), Reparatur (B3), Ersatz (B4) sowie der operative Energie- (B6) und Wasserverbrauch (B7).' },
                    { code: 'C1 - C4', phase: 'Entsorgungsphase (End-of-Life)', desc: 'Rückbau/Abbruch (C1), Transport zum Recycling (C2), Abfallaufbereitung (C3) und finale Beseitigung/Deponierung (C4). Bei Biomassen wird hier das CO₂ wieder freigesetzt.' },
                    { code: 'Modul D', phase: 'Gutschriften und Lasten außerhalb der Systemgrenzen', desc: 'Recyclingpotenziale, thermische Verwertung mit Gutschriften für verdrängte fossile Kraftwerke und Wiederverwendungsnutzen. Enorm wichtig für nachwachsende Werkstoffe.' }
                  ].map((mod, m_idx) => (
                    <div key={m_idx} className="flex gap-4 p-3.5 bg-slate-50 border border-stone-150 rounded-xl hover:shadow-2xs transition-all">
                      <div className="w-16 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-inner overflow-hidden">
                        {mod.code}
                      </div>
                      <div>
                        <strong className="text-xs text-slate-900 block font-bold leading-tight">{mod.phase}</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{mod.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-indigo-50/50 p-4 border border-indigo-150 rounded-xl">
                  <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 uppercase">
                    <Recycle size={14} className="text-indigo-700" />
                    Schnittstelle zur Kreislaufwirtschaft &amp; Rückbaufähigkeit:
                  </h4>
                  <p className="text-[11px] text-indigo-950 mt-1.5 leading-relaxed">
                    Spezielle Berechnungen für das <strong>Modul D</strong> setzen vertieftes Wissen über Sortenreinheit, Trennbarkeit und Recyclingquoten voraus. Verweise hierzu finden Sie im Modul <strong>Kreislaufwirtschaft &amp; Altlasten</strong> sowie im Modul <strong>Rückbau</strong>. Geringe Verbundstoffanteile begünstigen ein hohes Entsorgungs- und Substitutionsergebnis in Modul D!
                  </p>
                </div>
              </div>
            )}

            {activeStep === 3 && <LeitfadenLcaBerechnung />}

            {activeStep === 4 && <LeitfadenDgnbQng />}

            {activeStep === 5 && <AnhangPraxisbeispiele />}

            {activeStep === 6 && <AnhangChecklisten checklistState={checklistState} setChecklistState={setChecklistState} />}

            {activeStep === 7 && <AnhangUebungen />}

            {activeStep === 8 && <AnhangDatenbanken activeEcoDb={activeEcoDb} setActiveEcoDb={setActiveEcoDb} />}

            {activeStep === 9 && <AnhangGlossarSoftware />}

          </div>

        </div>

      </div>
    );
}
