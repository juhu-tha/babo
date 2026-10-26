import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { useState, useMemo } from 'react';
import { Activity, Scale, Sliders, BookOpen, Layers, TrendingUp, Sparkles, Clock, MoveHorizontal } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath, BlockMath } from 'react-katex';
import { MATERIALIEN } from './mechanischekenngroessen/daten';
import Grundlagen from './mechanischekenngroessen/Grundlagen';
import Steifigkeiten from './mechanischekenngroessen/Steifigkeiten';
import KriechenSchwinden from './mechanischekenngroessen/KriechenSchwinden';
import Zugversuchsimulator from './mechanischekenngroessen/Zugversuchsimulator';
import Beispiele from './mechanischekenngroessen/Beispiele';
import inhalt from '@/content/mechanischekenngroessen/MechanischeKenngroessen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { stabKenngroessen } from '@/src/calc/mechanischeKenngroessen';

const REITER = [
  { id: 'grundlagen', label: inhalt.texte.t1SpannungDehnung, icon: Activity },
  { id: 'hooke_emodul', label: inhalt.texte.t2EModulHooke, icon: Sparkles },
  { id: 'steifigkeiten', label: inhalt.texte.t3DehnBiegesteifigkeitEa, icon: MoveHorizontal },
  { id: 'kriechen_schwinden', label: inhalt.texte.t4KriechenSchwindenRelaxation, icon: Clock },
  { id: 'simulator', label: inhalt.texte.t5InteraktiverSimulator, icon: Sliders },
  { id: 'matrix', label: inhalt.texte.t6WerkstoffMatrix, icon: Layers },
  { id: 'beispiele', label: inhalt.texte.t7PraxisBeispiele, icon: BookOpen },
] as const;

export default function MechanischeKenngroessen() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'hooke_emodul' | 'steifigkeiten' | 'kriechen_schwinden' | 'simulator' | 'matrix' | 'beispiele'>('grundlagen');

  // Simulator State
  const [materialKey, setMaterialKey] = useState<string>('s235');
  const [lastArt, setLastArt] = useState<'zug' | 'druck'>('zug');
  const [kraftKn, setKraftKn] = useState<number>(80);
  const [stabLaengeM, setStabLaengeM] = useState<number>(3.0);
  const [querschnittTyp, setQuerschnittTyp] = useState<'rund' | 'rechteck'>('rund');
  const [durchmesserMm, setDurchmesserMm] = useState<number>(25);
  const [breiteMm, setBreiteMm] = useState<number>(30);
  const [hoeheMm, setHoeheMm] = useState<number>(30);

  // Kriech-Simulator State
  const [kriechZahl, setKriechZahl] = useState<number>(0.0);
  const [schwindMassPromille, setSchwindMassPromille] = useState<number>(0.0);

  // Rheologie-Labor State (Tab 4: Kriechen vs. Relaxieren)
  const [rheoModus, setRheoModus] = useState<'relaxieren' | 'kriechen'>('relaxieren');
  const [rheoTauSec, setRheoTauSec] = useState<number>(2.5);
  const [rheoWert0, setRheoWert0] = useState<number>(10); // MPa bzw. Promille

  const mat = MATERIALIEN[materialKey] || MATERIALIEN['s235'];

  // Material-Auswahl mit automatischer Synchronisation typischer Kriech- & Schwindbeiwerte
  const handleSelectMaterial = (key: string) => {
    setMaterialKey(key);
    const m = MATERIALIEN[key];
    if (m) {
      setKriechZahl(m.phiKriechen ?? 0);
      setSchwindMassPromille(Math.abs(m.epsSchwinden ?? 0));
    }
  };

  // Berechnungen für den Simulator, Steifigkeiten & Stabilität
  // Rechenkern src/calc/mechanischeKenngroessen.ts (Querschnitt, Steifigkeiten, Hooke, Euler-Knicklast, Kriechen/Schwinden)
  const sim = useMemo(() => stabKenngroessen({
    werkstoff: mat,
    lastArt,
    kraftKn,
    laengeM: stabLaengeM,
    querschnitt: querschnittTyp,
    durchmesserMm,
    breiteMm,
    hoeheMm,
    kriechZahl,
    schwindPromille: schwindMassPromille,
  }), [mat, lastArt, kraftKn, stabLaengeM, querschnittTyp, durchmesserMm, breiteMm, hoeheMm, kriechZahl, schwindMassPromille]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Scale className="text-shiraz" /><MdText text={inhalt.texte.mechanischeKenngrößenSpannungDehnung} /></h2>
          <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-3 py-1 rounded-full border border-shiraz/20"><MdText text={inhalt.texte.elastostatikRheologieWerkstoffmechanik} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 leading-relaxed">
          <p>
            Mechanische Kenngrößen bilden das Fundament der Baustatik und Tragwerkslehre. 
            Neben den Kurzzeit-Größen <strong>Spannung (<InlineMath math="\sigma, \tau" />)</strong>, 
            <strong> Dehnung (<InlineMath math="\varepsilon" />)</strong>, <strong>E-Modul (<InlineMath math="E" />)</strong>, 
            <strong><MdText text={inhalt.texte.dehnsteifigkeitEa} /></strong> und <strong><MdText text={inhalt.texte.biegesteifigkeitEi} /></strong> 
            prägen zeitabhängige rheologische Prozesse wie <strong>Kriechen</strong>, <strong>Schwinden</strong> und 
            <strong> Relaxation</strong> die Dauerhaftigkeit und Gebrauchstauglichkeit moderner Tragwerke.
          </p>
        </div>

      </div>

      <ModuleTabs label="Lehrpfad Mechanische Kenngrößen" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:mb-8">
      {/* TAB 1: GRUNDLAGEN (Spannung & Dehnung) */}
      {activeTab === 'grundlagen' && <Grundlagen />}

      {/* TAB 2: E-MODUL & HOOKE */}
      {activeTab === 'hooke_emodul' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Das Hooke'sche Gesetz */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                  <TrendingUp className="text-shiraz" size={18} /><MdText text={inhalt.texte.t1DasHookeSche} /></h3>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.imJahr1678Formulierte} /></p>

                <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4">
                  <div className="text-xs font-bold text-text-main mb-1"><MdText text={inhalt.texte.eindimensionalerFallStab} /></div>
                  <BlockMath math="\sigma = E \cdot \varepsilon \iff \varepsilon = \frac{\sigma}{E}" />
                  <div className="text-[11px] text-slate-500 text-center"><MdText text={inhalt.texte.steigungDerHookeSchen} /></div>
                </div>

                <div className="space-y-2 text-xs text-text-main/80">
                  <div><MdText text={inhalt.texte.dreidimensionalesVerallgemeinertesHookeS} /></div>
                  <p className="text-[11px] text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.spannungenInEinerRaumrichtung} /></p>
                  <BlockMath math="\varepsilon_x = \frac{1}{E} \left[ \sigma_x - \nu (\sigma_y + \sigma_z) \right]" />
                  <BlockMath math="\gamma_{xy} = \frac{\tau_{xy}}{G}, \quad \gamma_{yz} = \frac{\tau_{yz}}{G}, \quad \gamma_{zx} = \frac{\tau_{zx}}{G}" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.gültigkeitsgrenzeBisZurProportionalitäts} /></div>
            </div>

            {/* Box 2: Moduln-Beziehungen (E, G, K) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                  <Layers className="text-shiraz" size={18} /><MdText text={inhalt.texte.t2SchubmodulGKompressionsmodul} /></h3>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.fürIsotropeMaterialienReichen} /></p>

                <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4 space-y-3">
                  <div>
                    <div className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.schubmodulGWiderstandGegen} /></div>
                    <BlockMath math="G = \frac{E}{2 \cdot (1 + \nu)}" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.kompressionsmodulKWiderstandGegen} /></div>
                    <BlockMath math="K = \frac{E}{3 \cdot (1 - 2\nu)}" />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-text-main/80">
                  <div><MdText text={inhalt.texte.berechnungsbeispielBaustahl} /></div>
                  <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 text-[11px] font-mono"><MdText text={inhalt.texte.e210000Mpa} /></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.hinweisGehtGegen0} /></div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: DEHNSTEIFIGKEIT & BIEGESTEIFIGKEIT (EA & EI) */}
      {activeTab === 'steifigkeiten' && <Steifigkeiten />}

      {/* TAB 4: KRIECHEN, SCHWINDEN & RELAXATION */}
      {activeTab === 'kriechen_schwinden' && <KriechenSchwinden rheoModus={rheoModus} rheoTauSec={rheoTauSec} rheoWert0={rheoWert0} setRheoModus={setRheoModus} setRheoTauSec={setRheoTauSec} setRheoWert0={setRheoWert0} />}

      {/* TAB 5: INTERAKTIVER SIMULATOR */}
      {activeTab === 'simulator' && <Zugversuchsimulator breiteMm={breiteMm} durchmesserMm={durchmesserMm} handleSelectMaterial={handleSelectMaterial} hoeheMm={hoeheMm} kraftKn={kraftKn} kriechZahl={kriechZahl} lastArt={lastArt} mat={mat} materialKey={materialKey} querschnittTyp={querschnittTyp} schwindMassPromille={schwindMassPromille} setBreiteMm={setBreiteMm} setDurchmesserMm={setDurchmesserMm} setHoeheMm={setHoeheMm} setKraftKn={setKraftKn} setKriechZahl={setKriechZahl} setLastArt={setLastArt} setQuerschnittTyp={setQuerschnittTyp} setSchwindMassPromille={setSchwindMassPromille} setStabLaengeM={setStabLaengeM} sim={sim} stabLaengeM={stabLaengeM} />}

      {/* TAB 6: WERKSTOFF-MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-home-grau/20">
            <div>
              <h3 className="font-bold text-base text-text-main flex items-center gap-2">
                <Layers className="text-shiraz" size={18} /><MdText text={inhalt.texte.vergleichendeWerkstoffkennwerteImBauwese} /></h3>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.gegenüberstellungTypischerElastischerRhe} /></p>
            </div>
            <span className="text-xs font-mono font-semibold bg-off-white px-2.5 py-1 rounded border border-home-grau/30"><MdText text={inhalt.texte.t7Baustoffgruppen} /></span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/30">
                <tr>
                  <th className="p-3">Werkstoff</th>
                  <th className="p-3">Kategorie</th>
                  <th className="p-3 text-right"><MdText text={inhalt.texte.eModulMpa} /></th>
                  <th className="p-3 text-right"><MdText text={inhalt.texte.querdehnzahl} /></th>
                  <th className="p-3 text-right"><MdText text={inhalt.texte.schubmodulGMpa} /></th>
                  <th className="p-3 text-right"><MdText text={inhalt.texte.kriechzahl} /></th>
                  <th className="p-3 text-right"><MdText text={inhalt.texte.streckgrenzeFyMpa} /></th>
                  <th className="p-3 text-right"><MdText text={inhalt.texte.dichteKgM} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20">
                {Object.values(MATERIALIEN).map((m) => {
                  const G = m.E / (2 * (1 + m.nu));
                  return (
                    <tr key={m.id} className="hover:bg-off-white/60 transition-colors">
                      <td className="p-3 font-bold text-text-main">{m.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {m.kategorie}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-shiraz">{formatDeWert(m.E)}</td>
                      <td className="p-3 text-right font-mono">{formatDeZahl(m.nu, 2)}</td>
                      <td className="p-3 text-right font-mono text-slate-600">{formatDeZahl(G, 0)}</td>
                      <td className="p-3 text-right font-mono font-semibold text-blue-800">{m.phiKriechen !== undefined ? formatDeZahl(m.phiKriechen, 1) : '-'}</td>
                      <td className="p-3 text-right font-mono font-semibold">{formatDeWert(m.fy)}</td>
                      <td className="p-3 text-right font-mono">{formatDeWert(m.dichte)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs text-text-main/80 space-y-2 mt-4">
            <div className="font-bold text-text-main"><MdText text={inhalt.texte.wichtigeBaustofflicheFaustregeln} /></div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-text-main/75 pl-1">
              <li><MdText text={inhalt.texte.baustahlS235S355Der} /></li>
              <li><MdText text={inhalt.texte.dehnsteifigkeitVsBiegesteifigkeitBei} /></li>
              <li><MdText text={inhalt.texte.betonkriechenBeiDauerbelastetenBauteilen} /></li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 7: GERECHNETE BEISPIELE */}
      {activeTab === 'beispiele' && <Beispiele />}
      </ModuleTabs>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <Querverweis ziel="normen_ausblick" titel={inhalt.werte.neueEurocodeGenerationErschienen} linkText={inhalt.werte.zumModulAusblickNeue}>
        <p><MdText text={inhalt.texte.maßgebendBleibenDieBauaufsichtlich} /></p>
      </Querverweis>

      <ModulTest moduleId="mechanische_kenngroessen" />

      {/* FOOTER */}
      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap5}
        wikipedia={[
          { title: inhalt.werte.mechanischeSpannung, url: 'https://de.wikipedia.org/wiki/Mechanische_Spannung' },
          { title: 'Dehnung', url: 'https://de.wikipedia.org/wiki/Dehnung' },
          { title: 'Elastizitätsmodul', url: 'https://de.wikipedia.org/wiki/Elastizit%C3%A4tsmodul' },
          { title: inhalt.werte.kriechenWerkstoffe, url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
          { title: 'Schwinden', url: 'https://de.wikipedia.org/wiki/Schwinden' },
          { title: 'Spannungsrelaxation', url: 'https://de.wikipedia.org/wiki/Spannungsrelaxation' },
          { title: 'Biegesteifigkeit', url: 'https://de.wikipedia.org/wiki/Biegesteifigkeit' }
        ]}
        regelwerke={inhalt.daten["MechanischeKenngroessen.regelwerke"]}
        literatur={inhalt.daten["MechanischeKenngroessen.literatur"]}
        formeln={
          activeTab === 'grundlagen'
            ? inhalt.daten.MechanischeKenngroessen
            : activeTab === 'hooke_emodul'
            ? inhalt.daten.MechanischeKenngroessen_2
            : activeTab === 'steifigkeiten'
            ? inhalt.daten.MechanischeKenngroessen_3
            : activeTab === 'kriechen_schwinden'
            ? inhalt.daten.MechanischeKenngroessen_4
            : inhalt.daten.MechanischeKenngroessen_5
        }
      />

    </div>
  );
}
