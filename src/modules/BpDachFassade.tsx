import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Layers, BookOpen, CheckCircle2, Lightbulb, Calculator, Sparkles, ShieldCheck, AlertTriangle, BadgeCheck } from 'lucide-react';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InlineMath } from 'react-katex';

export default function BpDachFassade() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation' | 'fenster_rechner'>('allgemein');

  // Calculator states
  const [fensterBreite, setFensterBreite] = useState<number>(1.23); // m
  const [fensterHoehe, setFensterHoehe] = useState<number>(1.48); // m
  const [rahmenBreite, setRahmenBreite] = useState<number>(8); // cm
  const [u_g_wert, setUgWert] = useState<number>(0.7); // W/m²K
  const [u_f_wert, setUfWert] = useState<number>(1.2); // W/m²K
  const [psi_g_wert, setPsiWert] = useState<number>(0.045); // W/mK
  const [g_wert, setGWert] = useState<number>(0.60); // g-Wert
  const [einstrahlung, setEinstrahlung] = useState<number>(500); // W/m²

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white dark:bg-slate-900 text-text-main dark:text-slate-100 p-6 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-800">
        <h2 className="text-xl font-bold text-text-main dark:text-slate-100 flex items-center gap-2">
          <Layers className="text-shiraz" /> Dach, Fassade &amp; Fenster (Bauprodukte)
        </h2>
        <div className="text-sm text-text-main/80 dark:text-slate-350 bg-off-white dark:bg-slate-950/40 p-4 rounded-xl border border-home-grau/30 dark:border-slate-800 mt-3 animate-in fade-in">
          <p>
            Dach- und Fassadensysteme sowie anspruchsvolle Fenstertechnik bilden die schützende Gebäudehülle. Sie müssen bauphysikalische Anforderungen an Wärmeschutz (DIN EN ISO 10077), Feuchteschutz und Witterungsschutz dauerhaft erfüllen.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 dark:border-slate-800 my-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white dark:bg-slate-800 text-text-main dark:text-slate-200 border-home-grau/30 dark:border-slate-700 hover:bg-off-white dark:hover:bg-slate-750 hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Basiswissen
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'fenster_rechner' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white dark:bg-slate-800 text-text-main dark:text-slate-200 border-home-grau/30 dark:border-slate-700 hover:bg-off-white dark:hover:bg-slate-750 hover:text-text-main'
            }`}
            onClick={() => setActiveTab('fenster_rechner')}
          >
            <Calculator size={16} /> Fenster-U-Wert (Uw)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white dark:bg-slate-800 text-text-main dark:text-slate-200 border-home-grau/30 dark:border-slate-700 hover:bg-off-white dark:hover:bg-slate-750 hover:text-text-main'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={16} /> Praxisbeispiele
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'innovation' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white dark:bg-slate-800 text-text-main dark:text-slate-200 border-home-grau/30 dark:border-slate-700 hover:bg-off-white dark:hover:bg-slate-750 hover:text-text-main'
            }`}
            onClick={() => setActiveTab('innovation')}
          >
            <Lightbulb size={16} /> Zukunftstrends
          </button>
        </div>

        {activeTab === 'allgemein' ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300 font-sans">
            <div className="text-sm text-text-main/80 dark:text-slate-300 bg-off-white dark:bg-slate-950/40 p-4 rounded-xl border border-home-grau/30 dark:border-slate-800">
              <p>Produkte zur Herstellung der wind- und wetterfesten sowie wärmeschützenden Gebäudehülle.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white dark:bg-slate-950/30 p-5 rounded-xl border border-home-grau/30 dark:border-slate-800">
                <h3 className="font-bold text-shiraz text-lg mb-2">Geneigtes Dach &amp; Beläge</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 dark:text-slate-300 space-y-2">
                  <li><strong>Tondachziegel:</strong> Gebrannter Ton (DIN EN 1304). Beständig gegen Frost, chemische Angriffe und UV-Strahlung.</li>
                  <li><strong>Betondachsteine:</strong> Aus Zement, Sand, Pigmenten (DIN EN 490). Maßgenauer, bruchfester und schwerer als Tonziegel (hoher Schallschutz).</li>
                  <li><strong>Schiefer:</strong> Natürliches metamorphes Gestein für traditionelle, langlebige Deckungen (über 100 Jahre Standzeit).</li>
                  <li><strong>Metallbedachungen:</strong> Titanzink (DIN EN 988), Kupfer oder Aluminium-Stehfalz. Ideal für flach geneigte Steildächer.</li>
                </ul>
              </div>
              <div className="bg-off-white dark:bg-slate-950/30 p-5 rounded-xl border border-home-grau/30 dark:border-slate-800">
                <h3 className="font-bold text-shiraz text-lg mb-2">Vorgehängte hinterlüftete Fassade (VHF)</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 dark:text-slate-300 space-y-2">
                  <li><strong>Faserzementplatten:</strong> Faserarmierte Zementsteinplatten nach DIN EN 12467, extrem witterungsbeständig und nicht brennbar (Baustoffklasse A2).</li>
                  <li><strong>HPL-Platten (High Pressure Laminate):</strong> Hochdruck-Schichtstoffplatten nach DIN EN 438 aus harzimprägnierten Zellulosefasern für langlebige Vorhangfassaden.</li>
                  <li><strong>Aluminium-Verbundplatten:</strong> Zwei dünne Deckbleche mit mineralisch gefülltem oder flammgeschütztem Kunststoffkern (z. B. Alucobond).</li>
                  <li><strong>Hinterlüfteter Raum:</strong> Min. 2 cm Lüftungsspalt transportiert anfallende Feuchtigkeit und sommerliche Hitze verlässlich nach oben ab.</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-off-white dark:bg-slate-950/30 p-5 rounded-xl border border-home-grau/30 dark:border-slate-800">
                <h3 className="font-bold text-shiraz text-lg mb-2">Moderne Fenster &amp; Funktionsglas</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 dark:text-slate-300 space-y-2">
                  <li><strong>Mehrscheiben-Isolierglas (MIG):</strong> Besteht aus 2 oder 3 Floatglas-Scheiben, getrennt durch hermetische Scheibenzwischenräume (SZR) mit Edelgasfüllung (Argon oder Krypton).</li>
                  <li><strong>Low-E-Beschichtung:</strong> Hauchdünne, fast unsichtbare Silberschichten reflektieren langwellige Infrarot-Wärmestrahlung zurück in den Raum, lassen aber das sichtbare Licht passieren.</li>
                  <li><strong>Randverbund (Warme Kante):</strong> Hochisolierende Edelstahl- oder Kunststoff-Abstandshalter, die den linearen Wärmebrückenkoeffizienten (<InlineMath math="\Psi_g" />) am Glasrand im Vergleich zu Aluminium drastisch senken.</li>
                  <li><strong>Sonnenschutzgläser:</strong> Spezielle Metalloxidschichten mindern den solaren Energieeintrag (geringerer g-Wert) zur Begrenzung sommerlicher Aufheizung.</li>
                </ul>
              </div>
              <div className="bg-off-white dark:bg-slate-950/30 p-5 rounded-xl border border-home-grau/30 dark:border-slate-800">
                <h3 className="font-bold text-shiraz text-lg mb-2">Fassaden-Befestigungs- &amp; Sondersysteme</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 dark:text-slate-300 space-y-2">
                  <li><strong>Pfosten-Riegel-Fassade:</strong> Skelettbauweise aus tragenden Vertikalpfosten und Horizontalriegeln. Ermöglicht geschossübergreifende, komplett verglaste Hochhausfassaden.</li>
                  <li><strong>Vakuum-Isolations-Paneele (VIP):</strong> Luftdicht verschweißte Hülle mit pyrogener Kieselsäure als Stützkern. Bietet extrem niedrige Leitfähigkeiten (<InlineMath math="\lambda \approx 0{,}007\text{ W/(m}\cdot\text{K)}" />), dämmt 5-mal besser als EPS.</li>
                  <li><strong>Vorsicht bei VIP:</strong> Platten dürfen auf der Baustelle niemals geschnitten oder durchbohrt werden, andernfalls bricht das Vakuum zusammen und der U-Wert verschlechtert sich stark.</li>
                  <li><strong>Befestigungskonsolen:</strong> Thermisch getrennte Wandhalterungen aus Edelstahl, Aluminium oder GFK-Kunststoffen zur Minimierung punktueller Wärmebrücken im WDVS oder in der VHF.</li>
                </ul>
              </div>
            </div>
          
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-home-grau/30 dark:border-slate-800 shadow-sm mt-8 bg-slate-50/50 dark:bg-slate-950/20">
              <h3 className="font-bold text-home-prim text-lg mb-2 flex items-center gap-2">Marktübersicht typischer Systemlösungen für Steildächer und Fassaden</h3>
              <p className="text-xs text-text-main/60 dark:text-slate-400 mb-4 italic">
                Hinweis zur Herstellerneutralität: Die nachfolgende Auflistung dient als unverbindliche Übersicht marktrelevanter Systemtechnologien zur Erleichterung der baupraktischen Orientierung und Normenrecherche im Rahmen der akademischen Lehre.
              </p>
              <ul className="list-disc list-inside text-sm text-text-main/70 dark:text-slate-350 space-y-2.5 font-normal">
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Dachsteine und Ziegel (DIN EN 490 / EN 1304):</span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1">Hochverdichtete Beton-Dachsteine und gebrannte Tonziegel inklusive Systemzubehör zur wind- und regensicheren Steildacheindeckung.</span>
                  </li>
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Hinterlüftete Fassadensysteme:</span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1">Systemlösungen für die vorgehängte hinterlüftete Fassade (VHF) zur exakten thermischen Trennung und langlebigen Außenwandgestaltung.</span>
                  </li>
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Faserzementplatten:</span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1">Universell einsetzbare Verbundplatten aus Faserzement für robuste Dachdeckungen, schlagfeste Fassadenbekleidungen und Paneele.</span>
                  </li>
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Titanzinkdeckung (DIN EN 988):</span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1">Langlebige Walzzink-Bedachung und Stehfalzbekleidungen für witterungsbeständige Steildächer sowie korrosionsfreie Dachentwässerungen.</span>
                  </li>
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Aluminium-Stehfalzsysteme:</span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1">Hohl- und Stehfalzprofilbahnen aus Aluminium für großflächige, segmentierte Dächer und geschwungene Industriefassaden.</span>
                  </li>
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">HPL-Verbundplatten:</span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1">Unter Hochdruck gepresste Duroplast-Laminatplatten zur witterungs- und UV-beständigen Bekleidung moderner Gebäudefassaden.</span>
                  </li>
                  <li className="pl-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Aluminium-Pfosten-Riegel-Systeme:</span>
                    <span className="text-xs text-text-main/80 dark:text-slate-300 ml-1">Schnittstellen-Profilkonstruktionen aus stranggepresstem Aluminium für hochwärmegedämmte Glasfassaden, Vorhangwände und Lichtdächer.</span>
                  </li>
              </ul>
            </div>
          </div>
        ) : activeTab === 'fenster_rechner' ? (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300 font-sans">
            {/* INSTRUCTION */}
            <div className="text-sm text-text-main/80 dark:text-slate-300 bg-teal-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-teal-100 dark:border-emerald-850/30">
              <h4 className="font-bold text-teal-900 dark:text-emerald-300 flex items-center gap-1.5 mb-1 text-sm">
                <Calculator size={16} /> Fenster-Wärmedurchgangskoeffizient (Uw) nach DIN EN ISO 10077-1
              </h4>
              <p className="text-xs leading-relaxed text-teal-955 dark:text-slate-300 font-normal">
                Das Gebäudeenergie- bzw. Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, vormals GEG) bewertet Fenster immer als Gesamtsystem. Der Gesamtwert Uw vereint den Wärmestrom durch die Verglasung (Ug), den Fensterrahmen (Uf) und den Wärmeverlust durch den Abstandhalter am Glasrand (Ψg).
              </p>
            </div>

            {/* TWO COLUMN INTERACTIVE INTERFACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-normal">
              
              {/* Slider Controls (left side) */}
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Geometrische &amp; thermische Kenngrößen:</span>
                
                {/* Geometrie */}
                <div className="bg-slate-50 dark:bg-slate-950/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="font-semibold text-text-main dark:text-slate-200 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-805 pb-1.5">Fenster-Geometrie</h4>
                  
                  {/* Breite */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Fensterbreite (B):</span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeZahl(fensterBreite, 2)} m</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.50" 
                      max="3.00" 
                      step="0.05"
                      value={fensterBreite}
                      onChange={(e) => setFensterBreite(parseFloat(e.target.value))}
                      className="w-full h-1.5 rounded bg-zinc-200 dark:bg-slate-800 accent-shiraz cursor-pointer"
                    />
                  </div>

                  {/* Höhe */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Fensterhöhe (H):</span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeZahl(fensterHoehe, 2)} m</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.50" 
                      max="3.00" 
                      step="0.05"
                      value={fensterHoehe}
                      onChange={(e) => setFensterHoehe(parseFloat(e.target.value))}
                      className="w-full h-1.5 rounded bg-zinc-200 dark:bg-slate-800 accent-shiraz cursor-pointer"
                    />
                  </div>

                  {/* Rahmenbreite */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Ansichtsbreite Rahmen (<InlineMath math="b_f" />):</span>
                      <span className="font-mono text-xs font-bold text-shiraz">{formatDeWert(rahmenBreite)} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max="15" 
                      step="1"
                      value={rahmenBreite}
                      onChange={(e) => setRahmenBreite(parseInt(e.target.value))}
                      className="w-full h-1.5 rounded bg-zinc-200 dark:bg-slate-800 accent-shiraz cursor-pointer"
                    />
                  </div>
                </div>

                {/* Thermische Kennwerte */}
                <div className="bg-slate-50 dark:bg-slate-950/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="font-semibold text-text-main dark:text-slate-200 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-805 pb-1.5">Wärmeschutzkennwerte der Komponenten</h4>
                  
                  {/* U_g Glas */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Verglasungs-U-Wert (<InlineMath math="U_g" />):</span>
                      <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-450">{formatDeZahl(u_g_wert, 1)} W/m²K</span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="range" 
                        min="0.4" 
                        max="3.0" 
                        step="0.1"
                        value={u_g_wert}
                        onChange={(e) => setUgWert(parseFloat(e.target.value))}
                        className="w-full h-1.5 rounded bg-zinc-200 dark:bg-slate-800 accent-shiraz cursor-pointer my-auto"
                      />
                      <select 
                        className="text-[10px] p-1 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-705 font-bold"
                        onChange={(e) => setUgWert(parseFloat(e.target.value))}
                        value={u_g_wert}
                      >
                        <option value="0.5">3-Scheiben-Krypton (0.5)</option>
                        <option value="0.7">3-Scheiben-Argon (0.7)</option>
                        <option value="1.1">2-Scheiben-Argon (1.1)</option>
                        <option value="2.8">Altes Einfachglas (2.8)</option>
                      </select>
                    </div>
                  </div>

                  {/* U_f Rahmen */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Rahmen-U-Wert (<InlineMath math="U_f" />):</span>
                      <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">{formatDeZahl(u_f_wert, 1)} W/m²K</span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="range" 
                        min="0.7" 
                        max="2.5" 
                        step="0.1"
                        value={u_f_wert}
                        onChange={(e) => setUfWert(parseFloat(e.target.value))}
                        className="w-full h-1.5 rounded bg-zinc-200 dark:bg-slate-800 accent-shiraz cursor-pointer my-auto"
                      />
                      <select 
                        className="text-[10px] p-1 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-705 font-bold"
                        onChange={(e) => setUfWert(parseFloat(e.target.value))}
                        value={u_f_wert}
                      >
                        <option value="0.8">Passivholz / PU (0.8)</option>
                        <option value="1.2">Kunststoff-Mehrkammer (1.2)</option>
                        <option value="1.5">Standard-Holzrahmen (1.5)</option>
                        <option value="2.1">Alurahmen ungedämmt (2.1)</option>
                      </select>
                    </div>
                  </div>

                  {/* Psi */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Abstandshalter Randverbund (<InlineMath math="\Psi_g" />):</span>
                      <span className="font-mono text-xs font-bold text-violet-700 dark:text-violet-400">{formatDeZahl(psi_g_wert, 3)} W/mK</span>
                    </div>
                    <select 
                      value={psi_g_wert}
                      onChange={(e) => setPsiWert(parseFloat(e.target.value))}
                      className="w-full text-xs p-1.5 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono"
                    >
                      <option value="0.035">Warme Kante Premium (Kunststoff-Spezial) - 0,035 W/mK</option>
                      <option value="0.045">Warme Kante Standard (Edelstahl/Kunststoff) - 0,045 W/mK</option>
                      <option value="0.060">Edelstahlabstandshalter - 0,060 W/mK</option>
                      <option value="0.080">Aluminium Abstandshalter (Konventionell) - 0,080 W/mK</option>
                    </select>
                  </div>
                </div>

                {/* Solare Gewinne */}
                <div className="bg-slate-50 dark:bg-slate-950/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="font-semibold text-text-main dark:text-slate-200 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-805 pb-1.5">Solare Bilanzierung</h4>
                  
                  {/* g-Wert */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Energiedurchlassgrad (<InlineMath math="g" />-Wert):</span>
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-450">{formatDeZahl((g_wert * 100), 0)} %</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.20" 
                      max="0.85" 
                      step="0.05"
                      value={g_wert}
                      onChange={(e) => setGWert(parseFloat(e.target.value))}
                      className="w-full h-1.5 rounded bg-zinc-200 dark:bg-slate-800 accent-shiraz cursor-pointer"
                    />
                  </div>

                  {/* Sonneneinstrahlung */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Solarstrahlung (<InlineMath math="I_{\text{solar}}" />):</span>
                      <span className="font-mono text-xs font-bold text-emerald-850">{formatDeWert(einstrahlung)} W/m²</span>
                    </div>
                    <input 
                      type="range" 
                      min="100" 
                      max="1000" 
                      step="50"
                      value={einstrahlung}
                      onChange={(e) => setEinstrahlung(parseInt(e.target.value))}
                      className="w-full h-1.5 rounded bg-zinc-200 dark:bg-slate-800 accent-shiraz cursor-pointer"
                    />
                    <div className="text-[10px] text-zinc-400">Mäßige Bewölkung ≈ 300 W/m² | Klarer Wintersonntag ≈ 600 W/m²</div>
                  </div>
                </div>
              </div>

              {/* Computations Display (right side) */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Berechnungsergebnisse nach Norm:</span>

                {(() => {
                  const b_f_m = rahmenBreite / 100; // cm to m
                  
                  // Safe geometry limit
                  const limitBreite = Math.max(fensterBreite, 2 * b_f_m + 0.1);
                  const limitHoehe = Math.max(fensterHoehe, 2 * b_f_m + 0.1);
                  
                  const f_area = limitBreite * limitHoehe;
                  const g_width = limitBreite - 2 * b_f_m;
                  const g_height = limitHoehe - 2 * b_f_m;
                  const g_area = g_width * g_height;
                  const r_area = f_area - g_area;
                  const l_g = 2 * (g_width + g_height);

                  // Heat flows & U_w
                  const q_glass = g_area * u_g_wert;
                  const q_frame = r_area * u_f_wert;
                  const q_psi = l_g * psi_g_wert;
                  const u_w = (q_glass + q_frame + q_psi) / f_area;

                  // Solar energy transmission
                  const q_solar = g_area * g_wert * einstrahlung; // in W

                  let textStatus = '';
                  let bgStatus = '';
                  let alertIcon = null;

                  if (u_w <= 0.8) {
                    textStatus = 'Passivhaus-Tauglichkeit (Exzellent): Entspricht dem absoluten Spitzenwert für CO2-neutrale Gebäude.';
                    bgStatus = 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-300 border-emerald-250 dark:border-emerald-800/40 border';
                    alertIcon = <ShieldCheck className="text-emerald-705 dark:text-emerald-450 flex-shrink-0" size={16} />;
                  } else if (u_w <= 1.3) {
                    textStatus = 'GModG-konform (Bestandssanierung, vormals GEG): Weist einen soliden Standard nach und ist baurechtlich vollzulässig.';
                    bgStatus = 'bg-teal-50 dark:bg-slate-950/30 text-teal-950 dark:text-slate-350 border-teal-200 dark:border-slate-805 border';
                    alertIcon = <BadgeCheck className="text-teal-700 dark:text-teal-450 flex-shrink-0" size={16} />;
                  } else {
                    textStatus = 'NICHT GMODG-KONFORM: Für den Fensteraustausch im Bestand schreibt das GModG (vormals GEG) einen maximalen Uw-Wert von 1,30 W/m²K vor!';
                    bgStatus = 'bg-rose-50 dark:bg-red-950/20 text-rose-955 dark:text-red-300 border-rose-200 dark:border-red-900/40 border';
                    alertIcon = <AlertTriangle className="text-rose-750 dark:text-rose-455 flex-shrink-0" size={16} />;
                  }

                  return (
                    <div className="bg-slate-50 dark:bg-slate-950/30 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5">
                      
                      {/* Big U_w Value representation */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1 uppercase tracking-wider">Gesamt-U-Wert des Fensters (Uw):</span>
                          <span className="text-4xl font-black font-mono text-zinc-900 dark:text-white mt-1 block">{formatDeZahl(u_w, 3)} <span className="text-sm font-normal text-slate-500 text-xs">W/m²K</span></span>
                        </div>
                        <div className="p-3 bg-shiraz/10 text-shiraz rounded-xl">
                          <Layers className="w-8 h-8" />
                        </div>
                      </div>

                      {/* AREA SUBDIVS */}
                      <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                        <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                          <span className="text-[9px] text-zinc-400 block">TotalAw</span>
                          <span className="font-extrabold text-zinc-800 dark:text-slate-200">{formatDeZahl(f_area, 2)} m²</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                          <span className="text-[9px] text-zinc-405 block">GlasAg ({formatDeZahl((g_area / f_area * 100), 0)}%)</span>
                          <span className="font-extrabold text-sky-700 dark:text-sky-455">{formatDeZahl(g_area, 2)} m²</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                          <span className="text-[9px] text-zinc-405 block">RahmenAf</span>
                          <span className="font-extrabold text-amber-700 dark:text-amber-455">{formatDeZahl(r_area, 2)} m²</span>
                        </div>
                      </div>

                      {/* THERM FLOW DISTRIBUTION */}
                      <div className="space-y-2 text-xs">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Wärmestromanteile je Kelvin Temperaturdifferenz:</span>
                        <div className="space-y-1.5 font-mono text-[11px] font-normal">
                          <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-0.5">
                            <span className="text-sky-750">Glasfläche (<InlineMath math="A_g \cdot U_g" />):</span>
                            <span className="font-bold">{formatDeZahl(q_glass, 2)} W/K</span>
                          </div>
                          <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-0.5">
                            <span className="text-amber-750">Rahmenfläche (<InlineMath math="A_f \cdot U_f" />):</span>
                            <span className="font-bold">{formatDeZahl(q_frame, 2)} W/K</span>
                          </div>
                          <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-805 pb-0.5">
                            <span className="text-violet-750">Randverbund-Verlust (<InlineMath math="l_g \cdot \Psi_g" />):</span>
                            <span className="font-bold">{formatDeZahl(q_psi, 2)} W/K</span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold pt-1 text-zinc-900 dark:text-white border-t border-slate-200 dark:border-slate-800 mt-1">
                            <span>Summenwärmestrom (<InlineMath math="\Phi_{\text{tot}}" />):</span>
                            <span>{formatDeZahl((q_glass + q_frame + q_psi), 2)} W/K</span>
                          </div>
                        </div>
                      </div>

                      {/* SOLAR GAINS */}
                      <div className="bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/10 text-xs">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-850 dark:text-emerald-355 font-bold">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span>Sonneneintrag (Vorteil):</span>
                          </div>
                          <span className="font-mono font-extrabold text-emerald-800 dark:text-emerald-400 text-sm">+{formatDeZahl(q_solar, 0)} W</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 dark:text-slate-400 mt-1 leading-normal font-normal">
                          Bei klarer Einstrahlung gewinnt das Fenster durch die verglaste Fläche <InlineMath math="A_g" /> solare Energie im Wert von ca. {formatDeZahl(q_solar, 0)} Watt. Im Winter stützt dieser solare Wärmebetrag die Raumheizung direkt.
                        </p>
                      </div>

                      {/* Formula verification */}
                      <div className="p-3 bg-zinc-150 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-lg text-center">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1 uppercase tracking-wider">Normberechnungsgleichung (ISO 10077-1):</span>
                        <FormulaText text="U_{w} = \frac{A_g \cdot U_g + A_f \cdot U_f + l_g \cdot \Psi_g}{A_g + A_f}" />
                      </div>

                      {/* STATUS BOX */}
                      <div className={`p-3.5 rounded-xl flex gap-2.5 items-start text-xs leading-relaxed ${bgStatus}`}>
                        {alertIcon}
                        <div>{textStatus}</div>
                      </div>
                    </div>
                  );
                })()}

              </div>

            </div>

          </div>
        ) : activeTab === 'praxis' ? (
          <PraxisTabContent moduleKey="bp_dach_fassade" />
        ) : (
          <InnovationTabContent moduleKey="bp_dach_fassade" />
        )}
      </div>

      <ModuleFooter 
        wikipedia={[ 
          { title: "Mehrscheiben-Isolierglas", url: "https://de.wikipedia.org/wiki/Mehrscheiben-Isolierglas" }, 
          { title: "Vorgehängte hinterlüftete Fassade", url: "https://de.wikipedia.org/wiki/Vorgeh%C3%A4ngte_hinterl%C3%BCftete_Fassade" },
          { title: "Wärmedurchgangskoeffizient", url: "https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient" }
        ]} 
        literatur={[ 
          'Schirmbeck, E. et al. (2019): Architektur der Fassade (Detail Verlag)', 
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Willems, W. M. (2018): Lehrbuch der Bauphysik (8. Auflage, Springer Vieweg)'
        ]} 
        regelwerke={[ 
          { title: 'DIN EN ISO 10077-1 (Wärmetechnisches Verhalten von Fenstern, Türen und Abschlüssen - Berechnung des Wärmedurchgangskoeffizienten)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+10077-1' }, 
          { title: 'GEG (Gebäudeenergiegesetz - Anforderungen an opake und transparente Außenbauteile)', url: 'https://www.gesetze-im-internet.de/geg/' }, 
          { title: 'ZVDH (Zentralverband des Deutschen Dachdeckerhandwerks) - Fachregeln für Abdichtungen und Dachdeckungen', url: 'https://www.dachdecker.org/' } 
        ]} 
        formeln={[
          {
            formel: 'U_w = \\frac{A_g \\cdot U_g + A_f \\cdot U_f + l_g \\cdot \\Psi_g}{A_g + A_f}',
            erklaerung: 'Gesamtwärmedurchgangskoeffizient Uw eines Fensters nach DIN EN ISO 10077-1 unter Berücksichtigung von Verglasung (g), Rahmen (f) und linearem Wärmebrückenverlust Psi_g des Glasrandverbunds.',
            quelle: 'DIN EN ISO 10077-1'
          },
          {
            formel: 'q = U \\cdot \\Delta T = \\frac{\\Delta T}{R_{si} + \\sum \\frac{d_i}{\\lambda_i} + R_{se}}',
            erklaerung: 'Stationärer Wärmestrom q [W/m²] durch ein mehrschichtiges opakes Fassadenbauteil bei gegebener Temperaturdifferenz.',
            quelle: 'DIN EN ISO 6946'
          }
        ]} 
      />
    </div>
  );
}

