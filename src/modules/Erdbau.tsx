import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Mountain, Layers, AlignVerticalSpaceAround, Activity, LayoutGrid, Calculator, ThermometerSnowflake, BookOpen } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Slider } from '@/src/components/ui/Slider';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

type Tab = 'grundlagen' | 'klassifikation' | 'frostschutz' | 'steckbrief';

export default function Erdbau() {
  const [activeTab, setActiveTab] = useState<Tab>('steckbrief');

  // DIN 18196 State
  const [feinanteil, setFeinanteil] = useState(10); // Prozent < 0.063mm
  const [kiesanteil, setKiesanteil] = useState(60); // Prozent Kies am Grobkorn
  const [sandanteil, setSandanteil] = useState(40); // Prozent Sand am Grobkorn
  const [organik, setOrganik] = useState<'keine' | 'gering' | 'stark'>('keine');
  const [plastizitaet, setPlastizitaet] = useState<'nicht' | 'gering' | 'mittel' | 'ausgeprägt'>('nicht');

  // Frostschutz State
  const [frostzone, setFrostzone] = useState(2); // Frostzone I, II, III (1, 2, 3)
  const [bauklasse, setBauklasse] = useState<'Bk100' | 'Bk32' | 'Bk10' | 'BK3' | 'BK1' | 'BK03'>('BK3');
  const [ausgangsdicke, setAusgangsdicke] = useState(60); // cm
  const [bodengruppe, setBodengruppe] = useState<'F2' | 'F3'>('F3');
  const [wasserverhaeltnisse, setWasserverhaeltnisse] = useState<'guenstig' | 'unguenstig'>('unguenstig');

  // Klassifikation Logic
  const bodenKlasse = useMemo(() => {
    // Normalisieren Grobkorn
    const gesamtGrob = kiesanteil + sandanteil;
    const relativKies = gesamtGrob > 0 ? (kiesanteil / gesamtGrob) * 100 : 0;
    
    if (organik === 'stark') return { gruppe: 'HN / HZ / F', name: 'Organische Böden (Torf/Mudde)', frost: 'F3', tauglich: 'Ungeeignet als Baugrund.' };
    
    if (feinanteil <= 5) {
      if (relativKies > 50) return { gruppe: 'GW / GI / GE', name: 'Kies, weitgestuft bis enggestuft', frost: 'F1', tauglich: 'Sehr gut tragfähig, frostsicher.' };
      return { gruppe: 'SW / SI / SE', name: 'Sand, weitgestuft bis enggestuft', frost: 'F1', tauglich: 'Gut tragfähig, frostsicher.' };
    } else if (feinanteil > 5 && feinanteil <= 15) {
      if (relativKies > 50) return { gruppe: 'GU / GT', name: 'Kies-Schluff- / Kies-Ton-Gemisch', frost: 'F2', tauglich: 'Tragfähig, aber bedingt frostempfindlich.' };
      return { gruppe: 'SU / ST', name: 'Sand-Schluff- / Sand-Ton-Gemisch', frost: 'F2', tauglich: 'Tragfähig, aber bedingt frostempfindlich.' };
    } else if (feinanteil > 15 && feinanteil <= 40) {
      // Bindig oder gemischtkörnig
      if (plastizitaet === 'ausgeprägt') return { gruppe: 'TA / TM', name: 'Ton, ausgeprägt bis mittelplastisch', frost: 'F3', tauglich: 'Setzungsempfindlich, sehr frostempfindlich.' };
      return { gruppe: 'TL / UM / UL', name: 'Leichtplastischer Ton / Schluff', frost: 'F3', tauglich: 'Witterungsempfindlich, sehr frostempfindlich.' };
    } else {
      if (plastizitaet === 'ausgeprägt') return { gruppe: 'TA', name: 'Ausgeprägt plastischer Ton', frost: 'F3', tauglich: 'Stark setzungsempfindlich, sehr frostempfindlich.' };
      return { gruppe: 'UL / UM', name: 'Feinkörniger Schluff', frost: 'F3', tauglich: 'Extrem witterungsempfindlich (fließt bei Wasserzutritt), frostempfindlich.' };
    }
  }, [feinanteil, kiesanteil, sandanteil, organik, plastizitaet]);

  // Frostschutz Logic (vereinfacht nach RStO)
  const frostschutzDicke = useMemo(() => {
    // Vereinfacht nach RStO 12, Tab. 6/7 (weitere Zeilen der Tab. 7 manuell prüfen):
    // Ausgangswert je Frostempfindlichkeitsklasse und Belastungsklasse
    const hoch = bauklasse === 'Bk100' || bauklasse === 'Bk32' || bauklasse === 'Bk10';
    const mittel = bauklasse === 'BK3' || bauklasse === 'BK1';
    let d = bodengruppe === 'F3' ? (hoch ? 65 : mittel ? 60 : 50) : (hoch ? 55 : mittel ? 50 : 40);
    // Mehrdicke Frosteinwirkungszone: I ±0, II +5, III +15 cm
    d += frostzone === 2 ? 5 : frostzone === 3 ? 15 : 0;
    // Mehrdicke Wasserverhältnisse (Grund-/Schichtwasser höher als 1,5 m unter Planum): +5 cm
    if (wasserverhaeltnisse === 'unguenstig') d += 5;

    // Lehrannahme: gebundene Schichten pauschal 15 bzw. 30 cm (tatsächlich nach RStO-Tafel der gewählten Bauweise)
    const dickeAsphalt = (bauklasse === 'Bk100' || bauklasse === 'Bk32') ? 30 : 15;
    const dickeFSS = d - dickeAsphalt; // Notwendige Dicke der ungebundenen Frostschutzschicht (Mindestens 15cm)

    return { 
      gesamtDicke: d, 
      dickeAsphalt, 
      dickeFSS: Math.max(15, dickeFSS),
      regelausfuehrung: `Mindestdicke des frostsicheren Oberbaus nach vereinfachtem RStO-Schema: ${formatDeWert(d)} cm (Ausgangswert + Mehrdicken Frostzone und Wasser).`
    };
  }, [frostzone, bauklasse, bodengruppe, wasserverhaeltnisse]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Mountain className="text-shiraz" /> Erdbau & Böden
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 mb-6">
          <p>
            Der Erdbau befasst sich mit allen Baumaßnahmen, bei denen Bodenveränderungen vorgenommen werden.
            Hierzu gehören Erdarbeiten wie Lösen, Laden, Fördern, Einbauen und Verdichten von Boden und Fels
            sowie die Herstellung von Tragschichten.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}>
            <BookOpen size={16} /> Baustoff-Steckbrief
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'grundlagen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('grundlagen')}>
            <Layers size={16} /> Grundlagen Erdbau
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'klassifikation' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('klassifikation')}>
            <Calculator size={16} /> Bodenklassifikation (DIN 18196)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'frostschutz' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('frostschutz')}>
            <ThermometerSnowflake size={16} /> Frostschutz (RStO)
          </button>
        </div>

        {activeTab === 'grundlagen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-off-white p-6 rounded-xl border border-home-grau/30">
                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                  <Layers size={20} className="text-shiraz" /> Bodenarten
                </h3>
                <div className="space-y-4 text-sm text-text-main/80">
                  <p>
                    Böden werden in der Geotechnik nach DIN EN ISO 14688 in Hauptfraktionen eingeteilt:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Grobkörnige Böden (nicht bindig):</strong> Kies (Gr), Sand (Sa). Gute Tragfähigkeit, geringe Setzungen, gut wasserdurchlässig.</li>
                    <li><strong>Feinkörnige Böden (bindig):</strong> Schluff (Si), Ton (Cl). Geringe und witterungsabhängige Tragfähigkeit, setzungsempfindlich, schwach bis sehr schwach wasserdurchlässig, frostempfindlich.</li>
                    <li><strong>Gemischtkörnige Böden:</strong> Mischungen aus grob- und feinkörnigen Anteilen (z.B. kiesiger Schluff, toniger Sand).</li>
                    <li><strong>Organische Böden:</strong> Torf (Pt), Mudde. Sehr geringe Tragfähigkeit, stark setzungsanfällig (als Baugrund meist ungeeignet).</li>
                  </ul>
                </div>
              </div>

              <div className="bg-off-white p-6 rounded-xl border border-home-grau/30">
                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-shiraz" /> Verdichtung (Proctorversuch)
                </h3>
                <div className="space-y-4 text-sm text-text-main/80">
                  <p>
                    Die Tragfähigkeit von Böden wird durch mechanische Verdichtung (z.B. Walzen, Rüttelplatten) erhöht.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Proctordichte (ρPr):</strong> Maximale erreichbare Trockendichte bei einem bestimmten (optimalen) Wassergehalt unter definierter Verdichtungsarbeit.</li>
                    <li><strong>Optimaler Wassergehalt (w_pr):</strong> Bei diesem Wassergehalt wirkt das Wasser wie ein Schmiermittel, wodurch die Reibung zwischen den Körnern reduziert und die Packungsdichte maximiert wird.</li>
                    <li><strong>Verdichtungsgrad (DPr):</strong> Verhältnis der erreichten Trockendichte auf der Baustelle zur Proctordichte (üblich: 97 - 100%).</li>
                  </ul>
                </div>
              </div>

              <div className="bg-off-white p-6 rounded-xl border border-home-grau/30">
                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                  <LayoutGrid size={20} className="text-shiraz" /> Hydraulisch gebundene Tragschichten (HGT)
                </h3>
                <div className="space-y-4 text-sm text-text-main/80">
                  <p>
                    Zur Erhöhung der Tragfähigkeit im Straßen- und Wegebau werden mineralische Stoffgemische mit hydraulischen Bindemitteln (meist Zement) gemischt.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>HGT (Hydraulisch gebundene Tragschicht) bildet einen tragfähigen und frostsicheren Unterbau unter der Asphalt- oder Betondeckschicht.</li>
                    <li><strong>Zusammensetzung:</strong> Mineralstoffgemische (z.B. Frostschutzschicht) + Zement (meist 3 - 5 M.-%) + Wasser.</li>
                    <li><strong>Bodenverfestigung:</strong> Einmischen von Zement oder Kalk in den anstehenden Boden (z.B. mittels Bodenfräse), um Tragfähigkeit und Frostbeständigkeit zu erhöhen (Mixed-in-Place Verfahren).</li>
                  </ul>
                </div>
              </div>

              <div className="bg-off-white p-6 rounded-xl border border-home-grau/30">
                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                  <AlignVerticalSpaceAround size={20} className="text-shiraz" /> Frostempfindlichkeit
                </h3>
                <div className="space-y-4 text-sm text-text-main/80">
                  <p>
                    Frostschäden (z.B. Frosthebungen im Winter und Tragfähigkeitsverlust beim Auftauen) entstehen durch Eislinsenbildung im Boden.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Bedingungen für Frostschäden: Frostempfindlicher Boden + Wasserangebot + Frosttemperaturen.</li>
                    <li><strong>Frostempfindlichkeitsklassen (F1 - F3):</strong>
                      <ul className="list-disc pl-5 mt-1">
                        <li>F1: Nicht frostempfindlich (z.B. reiner Kies/Sand)</li>
                        <li>F2: Gering bis mittel frostempfindlich (gemischtkörnige Böden mit 5-15% Feinanteil &lt; 0,063mm)</li>
                        <li>F3: Sehr frostempfindlich (Schluff, Ton, Böden mit hohem Feinanteil &gt; 15%)</li>
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
              <p>
                Verschneiden Sie Kornverteilung (Sieblinie) und Plastizität, um den Boden in Bodengruppen (z.B. GW, SU, TL) einzuteilen. Dies bestimmt die Eignung als Baugrundstoff.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-off-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Kornzusammensetzung</h3>
                <Slider label="Feinanteil < 0,063 mm" min={0} max={100} step={1} value={feinanteil} unit="%" info="Entscheidet, ob der Boden rollig (< 5%), gemischtkörnig (5-15%) oder bindig (> 15-40%) is." onChange={(e) => setFeinanteil(Number(e.target.value))} />
                {feinanteil < 80 && (
                  <div className="bg-white p-4 rounded border border-home-grau/30 space-y-3">
                    <div className="text-xs font-bold text-home-grau uppercase mb-2">Aufteilung Grobkorn (über 0,063 mm)</div>
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
                
                <h3 className="font-bold border-b border-home-grau/30 pb-2 mt-2">Weitere Eigenschaften</h3>
                <div className="space-y-2">
                  <label className="text-sm font-bold block">Plastizität der Feinanteile</label>
                  <select aria-label="Plastizität der Feinanteile" className="w-full p-2 border border-home-grau/30 rounded focus:border-shiraz outline-none" value={plastizitaet} onChange={(e) => setPlastizitaet(e.target.value as any)}>
                    <option value="nicht">Nicht bis schwach plastisch</option>
                    <option value="mittel">Lediglich leicht plastisch</option>
                    <option value="ausgeprägt">Ausgeprägt plastisch (tonig)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold block">Organische Beimengungen</label>
                  <select aria-label="Organische Beimengungen" className="w-full p-2 border border-home-grau/30 rounded focus:border-shiraz outline-none" value={organik} onChange={(e) => setOrganik(e.target.value as any)}>
                    <option value="none">Keine / gering (mineralischer Boden)</option>
                    <option value="stark">Stark (Torf, Humus)</option>
                  </select>
                </div>
              </div>

              <div className="bg-shiraz p-6 rounded-xl flex flex-col gap-6 text-white shadow-xl">
                <h3 className="font-bold uppercase tracking-widest text-sm text-white/80">Bodengruppe nach DIN 18196 (vereinfachte Zuordnung)</h3>
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
                    <div className="text-white/60 text-xs font-bold uppercase mb-1">Bautechnische Eignung</div>
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
              <p>
                Straßenbauliche Bemessung erfordert eine ausreichende Dicke des frostsicheren Oberbaus, um ein Auffrieren des Planums zu verhindern. Sie ist abhängig von Frostzone, Belastung (Belastungsklasse Bk nach RStO 12/24/24) und anstehendem Boden (Frostempfindlichkeitsklasse F1 bis F3) und anstehendem Boden.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-off-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold block mb-1">Belastungsklasse (RStO)</label>
                    <select aria-label="Belastungsklasse (RStO)" className="w-full p-2 border border-home-grau/30 rounded focus:border-shiraz outline-none" value={bauklasse} onChange={(e) => setBauklasse(e.target.value as any)}>
                      <option value="Bk100">Bk100 (z.B. hochbelastete Autobahn)</option>
                      <option value="Bk32">Bk32 (z.B. Bundesstraße, sehr viel Schwerverkehr)</option>
                      <option value="Bk10">Bk10 (z.B. Hauptverkehrsstraße städtisch)</option>
                      <option value="BK3">Bk3,2 (z. B. Sammelstraße)</option>
                      <option value="BK1">Bk1,0 (z. B. Wohnstraße)</option>
                      <option value="BK03">Bk0,3 (z.B. Anliegerstraße, kaum Schwerverkehr)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold block mb-1">Frostzone (Klimaregion in DE)</label>
                    <select aria-label="Frostzone (Klimaregion in DE)" className="w-full p-2 border border-home-grau/30 rounded focus:border-shiraz outline-none" value={frostzone} onChange={(e) => setFrostzone(Number(e.target.value))}>
                      <option value={1}>Frostzone I (mild, z.B. Niederrhein)</option>
                      <option value={2}>Frostzone II (mittel, z.B. weite Teile DE)</option>
                      <option value={3}>Frostzone III (strenge Winter, z.B. Mittelgebirge/Alpen)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold block mb-1">Bodenklasse des anstehenden Planums</label>
                    <select aria-label="Bodenklasse des anstehenden Planums" className="w-full p-2 border border-home-grau/30 rounded focus:border-shiraz outline-none" value={bodengruppe} onChange={(e) => setBodengruppe(e.target.value as any)}>
                      <option value="F2">F2 (Gering bis mittel frostempfindlich)</option>
                      <option value="F3">F3 (Sehr frostempfindlich, Schluff/Ton)</option>
                    </select>
                    <div className="text-xs text-home-grau mt-1">Hinweis: F1 erfordert keine Frostschutzmaßnahmen.</div>
                  </div>

                  <div>
                    <label className="text-sm font-bold block mb-1">Gestaltung / Wasserverhältnisse</label>
                    <select aria-label="Gestaltung / Wasserverhältnisse" className="w-full p-2 border border-home-grau/30 rounded focus:border-shiraz outline-none" value={wasserverhaeltnisse} onChange={(e) => setWasserverhaeltnisse(e.target.value as any)}>
                      <option value="guenstig">Günstig (Gute Entwässerung, tiefer Grundwasserstand)</option>
                      <option value="unguenstig">Ungünstig (Hoher Grundwasserstand, muldenförmig)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="relative border-2 border-home-grau/30 rounded-xl overflow-hidden bg-white flex flex-col">
                <h3 className="bg-home-grau/10 p-3 text-center font-bold border-b border-home-grau/30 text-sm">Frostsicherer Oberbau</h3>
                
                <div className="flex-1 flex flex-col p-4 gap-1">
                  {/* Asphalt */}
                  <div 
                    className="bg-zinc-700 text-white flex items-center justify-center p-2 text-sm font-bold relative"
                    style={{ height: `${(frostschutzDicke.dickeAsphalt / frostschutzDicke.gesamtDicke) * 100}%`, minHeight: '60px' }}
                  >
                    Deck- und Tragschichten (Asphalt)
                    <div className="absolute right-4 text-xs bg-black/30 px-2 py-1 rounded">~ {formatDeWert(frostschutzDicke.dickeAsphalt)} cm</div>
                  </div>
                  
                  {/* Ungebundene FSS */}
                  <div 
                    className="bg-amber-200 text-amber-900 border-x-4 border-amber-300 flex items-center justify-center p-2 text-sm font-bold relative"
                    style={{ height: `${(frostschutzDicke.dickeFSS / frostschutzDicke.gesamtDicke) * 100}%`, minHeight: '80px' }}
                  >
                    Frostschutzschicht (ungebunden, Kies/Schotter)
                    <div className="absolute right-4 text-xs bg-amber-900/10 px-2 py-1 rounded">{formatDeWert(frostschutzDicke.dickeFSS)} cm</div>
                  </div>

                  {/* Planum */}
                  <div className="mt-auto pt-4 border-t-2 border-dashed border-home-grau/50 text-center">
                    <div className="font-bold text-shiraz flex items-center justify-center gap-2">
                      Planum (Anstehender Boden {bodengruppe})
                    </div>
                    <div className="text-xs text-text-main/60">Gesamtdicke Frostsicherer Aufbau: {formatDeWert(frostschutzDicke.gesamtDicke)} cm</div>
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
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Verdichtungsgrad aus einer Ersatzmessung"
          zielGleichung="\rho_d = \frac{\rho}{1 + w}, \quad D_{Pr} = \frac{\rho_d}{\rho_{Pr}}"
          normQuelle="DIN 18125-2 (Dichte), DIN 18127 (Proctorversuch); Anforderungswert projektbezogen nach ZTV E-StB"
          schritte={[
            { titel: '1. Messwerte vor Ort', formel: '\\rho = 2{,}05\\,\\text{t/m}^3,\\; w = 8{,}0\\,\\%', erklaerung: 'Feuchtdichte (z. B. Ballon- oder Sandersatzverfahren) und Wassergehalt (Ofentrocknung).' },
            { titel: '2. Trockendichte', formel: '\\rho_d = \\frac{2{,}05}{1{,}08} = 1{,}90\\,\\text{t/m}^3', erklaerung: 'Der Wassergehalt ist auf die Trockenmasse bezogen.' },
            { titel: '3. Verdichtungsgrad', formel: 'D_{Pr} = \\frac{1{,}898}{1{,}95} = 97{,}3\\,\\%', erklaerung: 'Laborwert ρ_Pr = 1,95 t/m³ (Proctorversuch am selben Boden).' },
            { titel: '4. Bewertung', formel: 'D_{Pr} = 97{,}3\\,\\% \\ge 97\\,\\%', erklaerung: 'Erfüllt eine Anforderung von 97 %; für 100 % (z. B. Planum bei grobkörnigen Böden) müsste nachverdichtet werden.' },
          ]}
          ergebnisHinweis="Häufiger Fehler: Feuchtdichte direkt mit ρ_Pr verglichen – das täuscht einen zu hohen Verdichtungsgrad vor (hier 105 %)."
        />
      </div>

      <ModulTest moduleId="erdbau" />

      <ModuleFooter
        wikipedia={[
          { title: 'Erdbau', url: 'https://de.wikipedia.org/wiki/Erdbau' },
          { title: 'Bodenklasse', url: 'https://de.wikipedia.org/wiki/Bodenklasse' },
          { title: 'Proctorversuch', url: 'https://de.wikipedia.org/wiki/Proctorversuch' }
        ]}
        literatur={[
          'Wendehorst Baustoffkunde, 27. Auflage, Vieweg+Teubner 2011',
          'Scholz, W. (Begr.); Möhring, R. (Hrsg.): Baustoffkenntnis. Köln: Bundesanzeiger 2016',
          'FGSV: RStO 12 – Richtlinien für die Standardisierung des Oberbaues von Verkehrsflächen (aktuelle Fassung und Einführungserlass manuell prüfen)'
        ]}
        regelwerke={[
          { title: 'DIN 18196:2023-07 (Erd- und Grundbau - Bodenklassifikation für bautechnische Zwecke)' },
          { title: 'DIN 18127:2012-09 (Baugrund - Versuche und Versuchsgeräte - Proctorversuch)' },
          { title: 'DIN 18134:2012-04 (Baugrund - Versuche und Versuchsgeräte - Plattendruckversuch)' },
          { title: 'DIN EN ISO 14688-1:2020-11 / DIN EN ISO 14688-2:2020-11 (Geotechnische Erkundung - Benennung und Klassifizierung von Boden)' },
          { title: 'ZTV E-StB 17:2017 (Zusätzliche Technische Vertragsbedingungen und Richtlinien für Erdarbeiten im Straßenbau)', url: 'https://www.fgsv-verlag.de/' },
          { title: 'RStO 12 (Richtlinien für die Standardisierung des Oberbaues von Verkehrsflächen; aktuelle Fassung manuell prüfen)', url: 'https://www.fgsv-verlag.de/' }
        ]}
        formeln={[
          {
            formel: 'D_{Pr} = \\frac{\\rho_d}{\\rho_{Pr}} \\cdot 100\\%',
            erklaerung: 'Verdichtungsgrad D_Pr. Verhältnis der trockenen Rohdichte des vor Ort eingebauten Bodens zur im Labor ermittelten optimalen Proctor-Trockendichte.',
            quelle: 'DIN 18127:2012-09'
          },
          {
            formel: '\\frac{E_{v2}}{E_{v1}} \\le 2{,}2 \\quad (\\text{bei } D_{Pr} \\ge 100\\,\\%)',
            erklaerung: 'Verhältniswert der Verformungsmoduln aus Erst- und Zweitbelastung beim statischen Plattendruckversuch als Kriterium für ausreichende Verdichtung ohne Überverdichtung.',
            quelle: 'DIN 18134:2012-04 / ZTV E-StB 17'
          }
        ]}
      />
    </div>
  );
}