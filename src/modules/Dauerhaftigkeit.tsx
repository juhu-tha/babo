import React, { useState } from 'react';
import {
  ShieldAlert,
  Sun,
  Bug,
  Box,
  Mountain,
  Maximize,
  Layers,
  Activity,
  Zap,
  LucideIcon
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { ExpositionsKurzkarte } from '@/src/components/ui/ExpositionsKurzkarte';
import { WoodThematicLinks, PlasticsThematicLinks, MauerwerkThematicLinks, ConcreteThematicLinks, MetalThematicLinks } from './dauerhaftigkeit/ThematischeLinks';
import { BetonDauerhaftigkeitsSimulator } from './dauerhaftigkeit/BetonDauerhaftigkeitsSimulator';
import { MetalDurabilitySimulator } from './dauerhaftigkeit/MetalDurabilitySimulator';
import { TimberDurabilitySimulator } from './dauerhaftigkeit/TimberDurabilitySimulator';

type MaterialTab = 'prinzipien' | 'beton' | 'asphalte' | 'metalle' | 'holz' | 'kunststoffe' | 'naturstein' | 'glas' | 'unvertraeglichkeiten';

export default function Dauerhaftigkeit() {
  const [activeTab, setActiveTab] = useState<MaterialTab>('prinzipien');

  React.useEffect(() => {
    const savedSubtab = localStorage.getItem('dauerhaftigkeit_subtab');
    if (savedSubtab) {
      setActiveTab(savedSubtab as MaterialTab);
      localStorage.removeItem('dauerhaftigkeit_subtab');
    }
  }, []);

  const tab = (id: MaterialTab, label: string, icon: LucideIcon) => ({ id, label, icon });
  const gruppen: readonly ModulTabGruppe<MaterialTab>[] = [
    { id: 'prinzipien_g', label: 'Prinzipien & Konzepte', icon: Layers, mitglieder: [tab('prinzipien', 'Prinzipien & Konzepte', Layers)] },
    { id: 'beton_g', label: 'Beton & Stahlbeton', icon: Box, mitglieder: [tab('beton', 'Beton & Stahlbeton', Box)] },
    { id: 'metalle_g', label: 'Metalle', icon: Activity, mitglieder: [tab('metalle', 'Metalle', Activity)] },
    { id: 'mineralisch_g', label: 'Naturstein, Mauerwerk & Glas', icon: Mountain, mitglieder: [
      tab('naturstein', 'Naturstein & Mauerwerk', Mountain),
      tab('glas', 'Glas', Maximize),
    ] },
    { id: 'organisch_g', label: 'Holz, Kunststoffe & Asphalte', icon: Bug, mitglieder: [
      tab('holz', 'Holz', Bug),
      tab('kunststoffe', 'Kunststoffe', Sun),
      tab('asphalte', 'Asphalte', Box),
    ] },
    { id: 'unvertraeglich_g', label: 'Materialunverträglichkeiten', icon: Zap, mitglieder: [tab('unvertraeglichkeiten', 'Materialunverträglichkeiten', Zap)] },
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

        {/* Reiter: 6 Hauptbereiche, mineralische und organische Baustoffe mit zweiter Ebene (AP 3.8) */}
        <GruppierteModuleTabs
          label="Baustoffe und Prinzipien der Dauerhaftigkeit"
          gruppen={gruppen}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20"
        >

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
                  Beton & Stahlbeton (DIN 1045-Reihe 2023 & Expositionsklassen)
                </h3>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-2">
                  <p>
                    Die Dauerhaftigkeit von Stahlbeton basiert auf dem Zusammenwirken von dichtem Zementstein (erzeugt durch niedrige w/z-Werte) und dem stark alkalischen Milieu des Porenwassers (pH &gt; 12,5), welches den Bewehrungsstahl passiviert. Das klassische System nach <strong>DIN EN 206 / DIN 1045-2</strong> gliedert Umwelteinflüsse in Expositionsklassen.
                  </p>
                  <p className="border-t border-home-grau/25 pt-2 text-xs text-slate-700">
                    <strong>Normen-Update (DIN 1045-Reihe, Ausgabe 2023-08):</strong> Die neue Reihe umfasst u. a. DIN 1045-1000 (Grundlagen mit Betonbauqualitätsklassen BBQ-N, BBQ-E, BBQ-S), DIN 1045-2 (Beton), DIN 1045-3 (Bauausführung) und DIN 1045-40 (Fertigteile). Sie ist über die MVV TB 2024/1 in den meisten Ländern eingeführt; die BBQ-Klassen sind baurechtlich nicht verbindlich. Die Expositionsklassen nach DIN EN 206 bleiben die Grundlage; die Anwendungsregeln für klinkereffiziente Zemente und rezyklierte Gesteinskörnungen wurden erweitert.
                  </p>
                </div>
              </div>

              {/* Expositionsklassen: eine Quelle (AP 3.9) – hier nur die Kurzkarte */}
              <ExpositionsKurzkarte hinweis="Die Expositionsklassen beschreiben die Umgebungsbedingungen, gegen die Beton und Bewehrung dauerhaft geschützt werden müssen. Grenzwerte, Beispiele und die zugehörige Betondeckung stehen im Modul Expositionsklassen." />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Tragwerksausführung & Schutzgrenzwerte</h4>
                  <p className="text-sm text-gray-700 mb-3">Die planmäßige Dauerhaftigkeit des Stahlbetons gliedert sich in folgende bautechnische Maßnahmen:</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Zementstein-Kapillarität (w/z-Wert):</strong> Der Wasserzementwert beschreibt das Massenverhältnis von freiem Wasser zu Zement. Ein optimaler w/z-Wert (≤ 0,45–0,50) garantiert, dass die kapillaren Transportkanäle während der Zementhydratation weitgehend abgebunden und segmentiert werden. Dies minimiert die Diffusionsgeschwindigkeit von CO₂ und Chloriden.</li>
                    <li><strong>Betondeckung (<FormulaText text="$c_{\text{nom}}$" />):</strong> Berechnet sich aus dem Mindestwert (<FormulaText text="$c_{\text{min}}$" />) zur Gewährleistung der dauerhaften Verbundfestigkeit und des Korrosionsschutzes plus einem Sicherheits-Vorhaltemaß (<FormulaText text="$\Delta c_{\text{dev}}$" />, nach NA 15 mm, für XC1 10 mm; bei überwachter Herstellung, z. B. im Fertigteilwerk, um 5 mm reduzierbar). Sie fungiert als zeitliche physikalische Barriere gegen die Karbonatisierungsfront.</li>
                    <li><strong>Rissbreitenbeschränkung (<FormulaText text="$w_k$" />):</strong> Durch gezielte Bewehrungsaufteilung gegen Eigen- und Formzwang wird die kalkulatorische Rissbreite unter Gebrauchslast auf <FormulaText text="$w_k \le 0{,}3 \text{ mm}$" /> (oder <FormulaText text="$0{,}2 \text{ mm}$" /> bei XC/XD-Beaufschlagung) begrenzt, um das ungehinderte Einströmen korrosionsauslösender Medien direkt auf den blanken Stahl zu unterbinden.</li>
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
                  <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-1">
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
        </GruppierteModuleTabs>
      </div>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Nennmaß der Betondeckung für eine Parkhausdecke (XD3, XC3)"
        zielGleichung="c_{nom} = c_{min} + \Delta c_{dev}, \quad c_{min} = \max\{c_{min,b};\; c_{min,dur};\; 10\,\text{mm}\}"
        schritte={[
          { titel: 'Verbund', erklaerung: 'Stabdurchmesser der Längsbewehrung 16 mm:', formel: 'c_{min,b} = \\varnothing = 16\\,\\text{mm}' },
          { titel: 'Dauerhaftigkeit', erklaerung: 'Maßgebend ist die Klasse mit der größten Anforderung: XD3 verlangt c_min,dur = 40 mm (XC3 nur 20 mm).', formel: 'c_{min} = \\max\\{16;\\; 40;\\; 10\\} = 40\\,\\text{mm}' },
          { titel: 'Vorhaltemaß', erklaerung: 'Nach NA: Δc_dev = 15 mm (nur XC1: 10 mm).', formel: 'c_{nom} = 40 + 15 = 55\\,\\text{mm}' }
        ]}
        ergebnisHinweis="Zusätzlich gilt für XD3 nach DIN 1045-2: max. w/z = 0,45, Mindestfestigkeitsklasse C35/45, Mindestzementgehalt 320 kg/m³. Bei befahrenen Parkdecks ist ein rissüberbrückendes Oberflächenschutzsystem vorzusehen."
        normQuelle="DIN EN 1992-1-1:2011-01 + NA, 4.4.1; DIN 1045-2:2023-08"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Wie wichtig ist das Vorhaltemaß? Karbonatisierung einer Außenwand (XC4, poröser Beton)"
        zielGleichung="t_{krit} = \left(\frac{c}{k}\right)^2"
        schritte={[
          { titel: 'Annahmen', erklaerung: 'Karbonatisierungsbeiwert k = 4,0 mm/√a (ungünstiger Lehrwert für einen porösen Beton; das Rechner-Preset XC4 setzt für dichten Beton k = 1,5 mm/√a an), Nennmaß c_nom = 40 mm, Mindestmaß c_min = 25 mm.', formel: 'x_c(t) = 4{,}0 \\cdot \\sqrt{t}' },
          { titel: 'Planmäßige Deckung', erklaerung: 'Mit dem Nennmaß:', formel: 't_{krit} = (40 / 4{,}0)^2 = 100\\,\\text{a}' },
          { titel: 'Ungünstig verlegte Bewehrung', erklaerung: 'Nur das Mindestmaß erreicht:', formel: 't_{krit} = (25 / 4{,}0)^2 = 39\\,\\text{a}' }
        ]}
        ergebnisHinweis="Die Zeit bis zur Depassivierung steigt mit dem Quadrat der Betondeckung: 15 mm weniger Deckung verkürzen sie hier um rund 60 %. Deshalb sind Abstandhalter und Kontrolle der Deckung vor dem Betonieren entscheidend."
        normQuelle="√t-Gesetz; fib Bulletin 34 (2006)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="dauerhaftigkeit" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 10 Dauerhaftigkeit: Expositionsklassen nach DIN 1045-2:2023-08, Betondeckung, XA-Grenzen, Korrosivitätskategorien und Holzschutz geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Dauerhaftigkeit', url: 'https://de.wikipedia.org/wiki/Dauerhaftigkeit' },
          { title: 'Expositionsklasse', url: 'https://de.wikipedia.org/wiki/Expositionsklasse' },
          { title: 'Betondeckung', url: 'https://de.wikipedia.org/wiki/Betondeckung' }
        ]}
        literatur={[
          'Gehlen, C.: Probabilistische Lebensdauerbemessung von Stahlbetonbauwerken. DAfStb-Heft 510, Berlin: Beuth 2000',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'fib Bulletin 34: Model Code for Service Life Design. Lausanne: fib 2006'
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton – Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2); neue Generation DIN EN 1992-1-1:2025-09 (Deutsche Fassung EN 1992-1-1:2023; bauaufsichtlich noch nicht eingeführt, Stand MVV TB 2025/1)' },
          { title: 'DAfStb Heft 600: Erläuterungen zu DIN EN 1992-1-1 und DIN EN 1992-1-1/NA' }
        ]}
        formeln={[
          {
            formel: 'x_c(t) = \\sqrt{2 \\cdot k_{\\text{nac}} \\cdot \\Delta C \\cdot t} = k_c \\cdot \\sqrt{t}',
            erklaerung: 'Karbonatisierungsfortschritt xc(t) [mm] nach dem Diffusionsgesetz (Wurzel-Zeit-Gesetz): Der Karbonatisierungsbeiwert kc hängt maßgeblich vom w/z-Wert, der Zementart und der Umgebungsfeuchte ab.',
            quelle: 'fib Model Code / DAfStb'
          },
          {
            formel: 'c_{\\text{nom}} = c_{\\text{min}} + \\Delta c_{\\text{dev}}, \\quad c_{\\text{min}} = \\max\\{c_{\\text{min,b}}; c_{\\text{min,dur}}; 10\\,\\text{mm}\\}',
            erklaerung: 'Nennmaß der Betondeckung cnom nach EC2: Summe aus Mindestbetondeckung cmin (Verbund cmin,b + Dauerhaftigkeit cmin,dur) und Vorhaltemaß Δcdev (nach NA: 10 mm für XC1, 15 mm für XC2 bis XS3).',
            quelle: 'DIN EN 1992-1-1 + NA, 4.4.1'
          }
        ]}
      />
</div>
  );
}
