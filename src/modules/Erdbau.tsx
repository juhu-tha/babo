import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Mountain, Layers, AlignVerticalSpaceAround, Activity, LayoutGrid, Calculator, ThermometerSnowflake, BookOpen } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Slider } from '@/src/components/ui/Slider';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import inhalt from '@/content/erdbau/Erdbau.json';
import { bodengruppe as bodengruppeDin18196, frostschutz } from '@/src/calc/erdbau';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

type Tab = 'grundlagen' | 'klassifikation' | 'frostschutz' | 'steckbrief';

const REITER = [
  { id: 'steckbrief', label: 'Baustoff-Steckbrief', icon: BookOpen },
  { id: 'grundlagen', label: inhalt.texte.grundlagenErdbau, icon: Layers },
  { id: 'klassifikation', label: inhalt.texte.bodenklassifikationDin18196, icon: Calculator },
  { id: 'frostschutz', label: inhalt.texte.frostschutzRsto, icon: ThermometerSnowflake },
] as const;

export default function Erdbau() {
  const [activeTab, setActiveTab] = useState<Tab>('steckbrief');

  // DIN 18196 State
  const [feinanteil, setFeinanteil] = useState(10); // Prozent < 0.063mm
  const [kiesanteil, setKiesanteil] = useState(60); // Prozent Kies am Grobkorn
  const [sandanteil, setSandanteil] = useState(40); // Prozent Sand am Grobkorn
  const [organik, setOrganik] = useState<'keine' | 'stark'>('keine');
  const [plastizitaet, setPlastizitaet] = useState<'nicht' | 'mittel' | 'ausgeprägt'>('nicht');

  // Frostschutz State
  const [frostzone, setFrostzone] = useState(2); // Frostzone I, II, III (1, 2, 3)
  const [bauklasse, setBauklasse] = useState<'Bk100' | 'Bk32' | 'Bk10' | 'BK3' | 'BK1' | 'BK03'>('BK3');
  const [ausgangsdicke, setAusgangsdicke] = useState(60); // cm
  const [bodengruppe, setBodengruppe] = useState<'F2' | 'F3'>('F3');
  const [wasserverhaeltnisse, setWasserverhaeltnisse] = useState<'guenstig' | 'unguenstig'>('unguenstig');

  // Klassifikation: Rechenkern src/calc/erdbau.ts bestimmt die Bodengruppe (vereinfacht nach DIN 18196),
  // die angezeigten Texte bleiben in content/erdbau/Erdbau.json
  const bodenKlasse = useMemo(() => {
    const k = bodengruppeDin18196({ feinanteil, kiesanteil, sandanteil, organik, plastizitaet });
    const TEXTE: Record<string, { gruppe: string; name: string; frost: string; tauglich: string }> = {
      'HN / HZ / F': { gruppe: 'HN / HZ / F', name: inhalt.werte.organischeBödenTorfMudde, frost: 'F3', tauglich: inhalt.werte.ungeeignetAlsBaugrund },
      'GW / GI / GE': inhalt.daten.Erdbau,
      'SW / SI / SE': inhalt.daten.Erdbau_2,
      'GU / GT': inhalt.daten.Erdbau_3,
      'SU / ST': inhalt.daten.Erdbau_4,
      'GU* / GT*': inhalt.daten.Erdbau_5,
      'SU* / ST*': inhalt.daten.Erdbau_6,
      'TA': inhalt.daten.Erdbau_7,
      'UL / UM': inhalt.daten.Erdbau_8,
    };
    return TEXTE[k.gruppe];
  }, [feinanteil, kiesanteil, sandanteil, organik, plastizitaet]);

  // Frostschutz (vereinfacht nach RStO 12, Tab. 6/7) aus dem Rechenkern; nicht berücksichtigt sind die Zeilen B
  // (kleinräumige Klimaunterschiede), D (Lage der Gradiente) und E (Entwässerung/Randbereiche) der Tab. 7.
  // Lehrannahme: gebundene Schichten pauschal 15 bzw. 30 cm, Frostschutzschicht mindestens 15 cm
  const frostschutzDicke = useMemo(() => {
    const f = frostschutz({ frostzone, bauklasse, bodengruppe, wasser: wasserverhaeltnisse });
    return {
      gesamtDicke: f.gesamtDicke,
      dickeAsphalt: f.dickeAsphalt,
      dickeFSS: f.dickeFSS,
      regelausfuehrung: `Mindestdicke des frostsicheren Oberbaus nach vereinfachtem RStO-Schema: ${formatDeWert(f.gesamtDicke)} cm (Ausgangswert + Mehrdicken Frostzone und Wasser).`
    };
  }, [frostzone, bauklasse, bodengruppe, wasserverhaeltnisse]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Mountain className="text-shiraz" /><MdText text={inhalt.texte.erdbauBöden} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 mb-6">
          <p><MdText text={inhalt.texte.derErdbauBefasstSich} /></p>
        </div>

        <ModuleTabs label="Bereiche Erdbau" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6">

        {activeTab === 'grundlagen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-off-white p-6 rounded-xl border border-home-grau/30">
                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                  <Layers size={20} className="text-shiraz" /> Bodenarten
                </h3>
                <div className="space-y-4 text-sm text-text-main/80">
                  <p><MdText text={inhalt.texte.bödenWerdenInDer} /></p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><MdText text={inhalt.texte.grobkörnigeBödenNichtBindig} /></li>
                    <li><MdText text={inhalt.texte.feinkörnigeBödenBindigSchluff} /></li>
                    <li><MdText text={inhalt.texte.gemischtkörnigeBödenMischungenAus} /></li>
                    <li><MdText text={inhalt.texte.organischeBödenTorfPt} /></li>
                  </ul>
                </div>
              </div>

              <div className="bg-off-white p-6 rounded-xl border border-home-grau/30">
                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-shiraz" /><MdText text={inhalt.texte.verdichtungProctorversuch} /></h3>
                <div className="space-y-4 text-sm text-text-main/80">
                  <p><MdText text={inhalt.texte.dieTragfähigkeitVonBöden} /></p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><MdText text={inhalt.texte.proctordichtePrMaximaleErreichbare} /></li>
                    <li><MdText text={inhalt.texte.optimalerWassergehaltWPr} /></li>
                    <li><MdText text={inhalt.texte.verdichtungsgradDprVerhältnisDer} /></li>
                  </ul>
                </div>
              </div>

              <div className="bg-off-white p-6 rounded-xl border border-home-grau/30">
                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                  <LayoutGrid size={20} className="text-shiraz" /><MdText text={inhalt.texte.hydraulischGebundeneTragschichtenHgt} /></h3>
                <div className="space-y-4 text-sm text-text-main/80">
                  <p><MdText text={inhalt.texte.zurErhöhungDerTragfähigkeit} /></p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><MdText text={inhalt.texte.hgtHydraulischGebundeneTragschicht} /></li>
                    <li><MdText text={inhalt.texte.zusammensetzungMineralstoffgemischeZB} /></li>
                    <li><MdText text={inhalt.texte.bodenverfestigungEinmischenVonZement} /></li>
                  </ul>
                </div>
              </div>

              <div className="bg-off-white p-6 rounded-xl border border-home-grau/30">
                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                  <AlignVerticalSpaceAround size={20} className="text-shiraz" /> Frostempfindlichkeit
                </h3>
                <div className="space-y-4 text-sm text-text-main/80">
                  <p><MdText text={inhalt.texte.frostschädenZBFrosthebungen} /></p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><MdText text={inhalt.texte.bedingungenFürFrostschädenFrostempfindli} /></li>
                    <li><MdText text={inhalt.texte.frostempfindlichkeitsklassenF1F3} /><ul className="list-disc pl-5 mt-1">
                        <li><MdText text={inhalt.texte.f1NichtFrostempfindlichZ} /></li>
                        <li><MdText text={inhalt.texte.f2GeringBisMittel} /></li>
                        <li><MdText text={inhalt.texte.f3SehrFrostempfindlichSchluff} /></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'klassifikation' && (
          <div className="animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
              <p><MdText text={inhalt.texte.verschneidenSieKornverteilungSieblinie} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-off-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Kornzusammensetzung</h3>
                <Slider label={inhalt.werte.feinanteil0063Mm} min={0} max={100} step={1} value={feinanteil} unit="%" info={inhalt.werte.nachDin18196Grobkörnig} onChange={(e) => setFeinanteil(Number(e.target.value))} />
                {feinanteil < 80 && (
                  <div className="bg-white p-4 rounded border border-home-grau/30 space-y-3">
                    <div className="text-xs font-bold text-home-grau uppercase mb-2"><MdText text={inhalt.texte.aufteilungGrobkornÜber0} /></div>
                    <Slider label="Kiesanteil" min={0} max={100} step={5} value={kiesanteil} unit="" onChange={(e) => {
                      const val = Number(e.target.value);
                      setKiesanteil(val);
                      setSandanteil(100 - val);
                    }} />
                    <Slider label="Sandanteil" min={0} max={100} step={5} value={sandanteil} unit="" onChange={(e) => {
                      const val = Number(e.target.value);
                      setSandanteil(val);
                      setKiesanteil(100 - val);
                    }} />
                  </div>
                )}
                
                <h3 className="font-bold border-b border-home-grau/30 pb-2 mt-2"><MdText text={inhalt.texte.weitereEigenschaften} /></h3>
                <div className="space-y-2">
                  <label className="text-sm font-bold block"><MdText text={inhalt.texte.plastizitätDerFeinanteile} /></label>
                  <select aria-label={inhalt.werte.plastizitätDerFeinanteile} className="w-full p-2 border border-home-grau/30 rounded focus:border-shiraz outline-none" value={plastizitaet} onChange={(e) => setPlastizitaet(e.target.value as 'nicht' | 'mittel' | 'ausgeprägt')}>
                    <option value="nicht">Nicht bis schwach plastisch</option>
                    <option value="mittel">Mittelplastisch</option>
                    <option value="ausgeprägt">Ausgeprägt plastisch (tonig)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold block"><MdText text={inhalt.texte.organischeBeimengungen} /></label>
                  <select aria-label={inhalt.werte.organischeBeimengungen} className="w-full p-2 border border-home-grau/30 rounded focus:border-shiraz outline-none" value={organik} onChange={(e) => setOrganik(e.target.value as 'keine' | 'stark')}>
                    <option value="keine">Keine / gering (mineralischer Boden)</option>
                    <option value="stark">Stark (Torf, Humus)</option>
                  </select>
                </div>
              </div>

              <div className="bg-shiraz p-6 rounded-xl flex flex-col gap-6 text-white shadow-xl">
                <h3 className="font-bold uppercase tracking-widest text-sm text-white/80"><MdText text={inhalt.texte.bodengruppeNachDin18196} /></h3>
                <div>
                  <div className="text-5xl font-black mb-2">{bodenKlasse.gruppe}</div>
                  <div className="text-xl font-medium">{bodenKlasse.name}</div>
                </div>
                
                <div className="mt-auto space-y-4 pt-6 border-t border-white/20">
                  <div>
                    <div className="text-white/60 text-xs font-bold uppercase mb-1">Frostempfindlichkeit</div>
                    <div className={`inline-block px-3 py-1 rounded font-bold ${bodenKlasse.frost === 'F1' ? 'bg-slate-700 text-white' : bodenKlasse.frost === 'F2' ? 'bg-slate-500 text-white' : 'bg-shiraz text-white'}`}>
                      Klasse {bodenKlasse.frost}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs font-bold uppercase mb-1"><MdText text={inhalt.texte.bautechnischeEignung} /></div>
                    <div className="text-sm leading-relaxed">{bodenKlasse.tauglich}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'frostschutz' && (
          <div className="animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 font-medium">
              <p><MdText text={inhalt.texte.straßenbaulicheBemessungErfordertEine} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-off-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold block mb-1"><MdText text={inhalt.texte.belastungsklasseRsto} /></label>
                    <select aria-label={inhalt.werte.belastungsklasseRsto} className="w-full p-2 border border-home-grau/30 rounded focus:border-shiraz outline-none" value={bauklasse} onChange={(e) => setBauklasse(e.target.value as typeof bauklasse)}>
                      <option value="Bk100">Bk100 (z.B. hochbelastete Autobahn)</option>
                      <option value="Bk32">Bk32 (z.B. Bundesstraße, sehr viel Schwerverkehr)</option>
                      <option value="Bk10">Bk10 (z.B. Hauptverkehrsstraße städtisch)</option>
                      <option value="BK3">Bk3,2 (z. B. Sammelstraße)</option>
                      <option value="BK1">Bk1,0 (z. B. Wohnstraße)</option>
                      <option value="BK03">Bk0,3 (z.B. Anliegerstraße, kaum Schwerverkehr)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold block mb-1"><MdText text={inhalt.texte.frostzoneKlimaregionInDe} /></label>
                    <select aria-label={inhalt.werte.frostzoneKlimaregionInDe} className="w-full p-2 border border-home-grau/30 rounded focus:border-shiraz outline-none" value={frostzone} onChange={(e) => setFrostzone(Number(e.target.value))}>
                      <option value={1}>Frostzone I (mild, z.B. Niederrhein)</option>
                      <option value={2}>Frostzone II (mittel, z.B. weite Teile DE)</option>
                      <option value={3}>Frostzone III (strenge Winter, z.B. Mittelgebirge/Alpen)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold block mb-1"><MdText text={inhalt.texte.bodenklasseDesAnstehendenPlanums} /></label>
                    <select aria-label={inhalt.werte.bodenklasseDesAnstehendenPlanums} className="w-full p-2 border border-home-grau/30 rounded focus:border-shiraz outline-none" value={bodengruppe} onChange={(e) => setBodengruppe(e.target.value as typeof bodengruppe)}>
                      <option value="F2">F2 (Gering bis mittel frostempfindlich)</option>
                      <option value="F3">F3 (Sehr frostempfindlich, Schluff/Ton)</option>
                    </select>
                    <div className="text-xs text-home-grau mt-1"><MdText text={inhalt.texte.hinweisF1ErfordertKeine} /></div>
                  </div>

                  <div>
                    <label className="text-sm font-bold block mb-1"><MdText text={inhalt.texte.gestaltungWasserverhältnisse} /></label>
                    <select aria-label={inhalt.werte.gestaltungWasserverhältnisse} className="w-full p-2 border border-home-grau/30 rounded focus:border-shiraz outline-none" value={wasserverhaeltnisse} onChange={(e) => setWasserverhaeltnisse(e.target.value as typeof wasserverhaeltnisse)}>
                      <option value="guenstig">Günstig (Gute Entwässerung, tiefer Grundwasserstand)</option>
                      <option value="unguenstig">Ungünstig (Hoher Grundwasserstand, muldenförmig)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="relative border-2 border-home-grau/30 rounded-xl overflow-hidden bg-white flex flex-col">
                <h3 className="bg-home-grau/10 p-3 text-center font-bold border-b border-home-grau/30 text-sm"><MdText text={inhalt.texte.frostsichererOberbau} /></h3>
                
                <div className="flex-1 flex flex-col p-4 gap-1">
                  {/* Asphalt */}
                  <div 
                    className="bg-zinc-700 text-white flex items-center justify-center p-2 text-sm font-bold relative"
                    style={{ height: `${(frostschutzDicke.dickeAsphalt / frostschutzDicke.gesamtDicke) * 100}%`, minHeight: '60px' }}
                  ><MdText text={inhalt.texte.deckUndTragschichtenAsphalt} /><div className="absolute right-4 text-xs bg-black/30 px-2 py-1 rounded">~ {formatDeWert(frostschutzDicke.dickeAsphalt)} cm</div>
                  </div>
                  
                  {/* Ungebundene FSS */}
                  <div 
                    className="bg-amber-200 text-amber-900 border-x-4 border-amber-300 flex items-center justify-center p-2 text-sm font-bold relative"
                    style={{ height: `${(frostschutzDicke.dickeFSS / frostschutzDicke.gesamtDicke) * 100}%`, minHeight: '80px' }}
                  ><MdText text={inhalt.texte.frostschutzschichtUngebundenKiesSchotter} /><div className="absolute right-4 text-xs bg-amber-900/10 px-2 py-1 rounded">{formatDeWert(frostschutzDicke.dickeFSS)} cm</div>
                  </div>

                  {/* Planum */}
                  <div className="mt-auto pt-4 border-t-2 border-dashed border-home-grau/50 text-center">
                    <div className="font-bold text-shiraz flex items-center justify-center gap-2"><MdText text={inhalt.texte.planumAnstehenderBoden} />{bodengruppe})
                    </div>
                    <div className="text-xs text-text-main/60"><MdText text={inhalt.texte.gesamtdickeFrostsichererAufbau} />{formatDeWert(frostschutzDicke.gesamtDicke)} cm</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-t border-blue-200 p-3 text-xs text-blue-900">
                  <strong>Zusammenfassung:</strong> {frostschutzDicke.regelausfuehrung}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="erdbau" />
          </div>
        )}
        </ModuleTabs>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielVerdichtungsgradAusEin}
          zielGleichung="\rho_d = \frac{\rho}{1 + w}, \quad D_{Pr} = \frac{\rho_d}{\rho_{Pr}}"
          normQuelle={inhalt.werte.din181252Dichte}
          schritte={inhalt.daten["Erdbau.schritte"]}
          ergebnisHinweis={inhalt.werte.häufigerFehlerFeuchtdichteDirekt}
        />
      </div>

      <ModulTest moduleId="erdbau" />

      <ModuleFooter
        wikipedia={[
          { title: 'Erdbau', url: 'https://de.wikipedia.org/wiki/Erdbau' },
          { title: 'Bodenklasse', url: 'https://de.wikipedia.org/wiki/Bodenklasse' },
          { title: 'Proctorversuch', url: 'https://de.wikipedia.org/wiki/Proctorversuch' }
        ]}
        literatur={inhalt.daten["Erdbau.literatur"]}
        regelwerke={inhalt.daten["Erdbau.regelwerke"]}
        formeln={inhalt.daten["Erdbau.formeln"]}
      />
    </div>
  );
}