import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Layers, BookOpen, CheckCircle2, Lightbulb, Calculator, Sparkles, ShieldCheck, AlertTriangle, BadgeCheck } from 'lucide-react';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InlineMath } from 'react-katex';
import { Querverweis } from '@/src/components/ui/Querverweis';

export default function BpDachFassade() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'praxis' | 'innovation' | 'fenster_rechner'>('allgemein');

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
          <button aria-pressed={activeTab === 'allgemein'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white dark:bg-slate-800 text-text-main dark:text-slate-200 border-home-grau/30 dark:border-slate-700 hover:bg-off-white dark:hover:bg-slate-750 hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Basiswissen
          </button>
          <button aria-pressed={activeTab === 'fenster_rechner'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'fenster_rechner' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white dark:bg-slate-800 text-text-main dark:text-slate-200 border-home-grau/30 dark:border-slate-700 hover:bg-off-white dark:hover:bg-slate-750 hover:text-text-main'
            }`}
            onClick={() => setActiveTab('fenster_rechner')}
          >
            <Calculator size={16} /> Fenster-U-Wert (Uw)
          </button>
          <button aria-pressed={activeTab === 'praxis'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white dark:bg-slate-800 text-text-main dark:text-slate-200 border-home-grau/30 dark:border-slate-700 hover:bg-off-white dark:hover:bg-slate-750 hover:text-text-main'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={16} /> Praxisbeispiele
          </button>
          <button aria-pressed={activeTab === 'innovation'}
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
                  <li><strong>Faserzementplatten:</strong> Faserarmierte Zementsteinplatten nach DIN EN 12467, sehr witterungsbeständig und nichtbrennbar (Euroklasse A2-s1, d0).</li>
                  <li><strong>HPL-Platten (High Pressure Laminate):</strong> Hochdruck-Schichtstoffplatten nach DIN EN 438 aus harzimprägnierten Zellulosefasern für langlebige Vorhangfassaden.</li>
                  <li><strong>Aluminium-Verbundplatten:</strong> Zwei dünne Deckbleche mit mineralisch gefülltem oder flammgeschütztem Kunststoffkern.</li>
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
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <Querverweis ziel="bp_glaeser" titel="Fenster-U-Wert U_w – Rechner im Modul Gläser & Fenster" linkText="Zum U_w-Rechner (Gläser & Fenster)">
              <p>
                Das Gebäudemodernisierungsgesetz (GModG, vormals GEG) bewertet Fenster als Gesamtsystem. Der Wärmedurchgangskoeffizient U_w nach DIN EN ISO 10077-1 fasst den Wärmestrom durch die Verglasung (U_g), den Rahmen (U_f) und den Glasrandverbund (Ψ_g) flächengewichtet zusammen.
              </p>
              <p>
                Der interaktive Rechner mit Rahmenanteil, Abstandhaltern und solaren Gewinnen wird nur an einer Stelle gepflegt: im Modul Gläser &amp; Fenster (Reiter „Interaktiver Uw-Rechner“). Ein Rechenbeispiel steht unten auf dieser Seite.
              </p>
            </Querverweis>
          </div>
        ) : activeTab === 'praxis' ? (
          <PraxisTabContent moduleKey="bp_dach_fassade" />
        ) : (
          <InnovationTabContent moduleKey="bp_dach_fassade" />
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: U_w eines Fensters"
          zielGleichung="U_w = \frac{A_g U_g + A_f U_f + l_g \Psi_g}{A_g + A_f}"
          normQuelle="DIN EN ISO 10077-1 (Lehrbeispiel)"
          schritte={[
            { titel: '1. Gegeben', formel: 'A_g = 1{,}30\\,\\text{m}^2,\\; U_g = 0{,}6;\\; A_f = 0{,}52\\,\\text{m}^2,\\; U_f = 1{,}2;\\; l_g = 4{,}6\\,\\text{m},\\; \\Psi_g = 0{,}04', erklaerung: 'Dreifachverglasung, Kunststoffrahmen, warme Kante; U in W/(m²K), Ψ in W/(mK).' },
            { titel: '2. Wärmeströme je K', formel: '1{,}30 \\cdot 0{,}6 + 0{,}52 \\cdot 1{,}2 + 4{,}6 \\cdot 0{,}04 = 0{,}78 + 0{,}62 + 0{,}18 = 1{,}59\\,\\text{W/K}', erklaerung: 'Glas, Rahmen, Glasrand.' },
            { titel: '3. Fensterwert', formel: 'U_w = 1{,}59 / 1{,}82 = 0{,}87\\,\\text{W/(m}^2\\text{K)}', erklaerung: 'Gesamtfläche 1,82 m².' },
          ]}
          ergebnisHinweis="U_w = 0,87 W/(m²K): deutlich besser als 1,30, aber knapp über Passivhaus-Niveau (0,80) – Rahmen und Glasrand machen rund die Hälfte der Verluste aus."
        />
      </div>

      <ModulTest moduleId="bp_dach_fassade" />

      <ModuleFooter 
        wikipedia={[ 
          { title: "Mehrscheiben-Isolierglas", url: "https://de.wikipedia.org/wiki/Mehrscheiben-Isolierglas" }, 
          { title: "Vorgehängte hinterlüftete Fassade", url: "https://de.wikipedia.org/wiki/Vorgeh%C3%A4ngte_hinterl%C3%BCftete_Fassade" },
          { title: "Wärmedurchgangskoeffizient", url: "https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient" }
        ]} 
        literatur={[ 
          'Herzog, T.; Krippner, R.; Lang, W.: Fassaden Atlas – Grundlagen, Konzepte, Realisierungen. 2., überarb. u. erw. Aufl., München: Edition Detail 2016', 
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Willems, W. M. (Hrsg.): Lehrbuch der Bauphysik – Wärme, Feuchte, Klima, Schall, Licht, Brand. 9. Aufl., Wiesbaden: Springer Vieweg 2022'
        ]} 
        regelwerke={[ 
          { title: 'DIN EN ISO 10077-1 (Wärmetechnisches Verhalten von Fenstern, Türen und Abschlüssen - Berechnung des Wärmedurchgangskoeffizienten)' }, 
          { title: 'GModG (vormals GEG) – Anforderungen an opake und transparente Außenbauteile', url: 'https://www.gesetze-im-internet.de/geg/' }, 
          { title: 'DIN 18516-1 (Außenwandbekleidungen, hinterlüftet – Anforderungen, Prüfgrundsätze)' }, 
          { title: 'ZVDH (Zentralverband des Deutschen Dachdeckerhandwerks) - Fachregeln für Abdichtungen und Dachdeckungen' } 
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

