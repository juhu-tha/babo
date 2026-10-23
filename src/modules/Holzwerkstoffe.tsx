import React, { useState } from 'react';
import { Trees, Layers, Wrench, Leaf, BookOpen } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

export default function Holzwerkstoffe() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'arten' | 'herstellung' | 'nachhaltigkeit'>('steckbrief');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Trees className="text-shiraz" /> Holzwerkstoffe
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Holzwerkstoffe entstehen durch das Zerkleinern von Holz (in Bretter, Furniere, Späne oder Fasern) und das anschließende Zusammenfügen (meist durch Verleimen oder Pressen).
            Dadurch werden die natürlichen Schwachstellen von Vollholz (wie Äste oder Risse) minimiert und die richtungsabhängigen Eigenschaften (Anisotropie) homogenisiert.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'steckbrief' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('steckbrief')}
        >
          <BookOpen size={16} /> Baustoff-Steckbrief
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'arten' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('arten')}
        >
          <Layers size={16} /> Arten &amp; Eigenschaften
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'herstellung' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('herstellung')}
        >
          <Wrench size={16} /> Herstellung
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'nachhaltigkeit' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('nachhaltigkeit')}
        >
          <Leaf size={16} /> Umwelt &amp; Nachhaltigkeit
        </button>
      </div>

      {activeTab === 'arten' && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Vollholzwerkstoffe</h3>
          
          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz">Brettschichtholz (BSH / Leimholz)</h4>
            <p className="text-sm text-text-main/80 mb-2">
              Besteht aus faserparallel miteinander verleimten (in der Regel mindestens drei) getrockneten Brettern oder Brettlamellen.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><strong>Eigenschaften:</strong> Sehr hohe Tragfähigkeit, formstabil, große Querschnitte und Längen möglich.</li>
              <li><strong>Verwendung:</strong> Weitgespannte Träger, Stützen, Ingenieurholzbau.</li>
            </ul>
          </div>

          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz">Brettsperrholz (BSP / CLT)</h4>
            <p className="text-sm text-text-main/80 mb-2">
              Besteht aus kreuzweise (meist im 90°-Winkel) verleimten Brettlagen (Cross Laminated Timber).
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><strong>Eigenschaften:</strong> Hohe Formstabilität, Lastabtragung in zwei Richtungen möglich, plattenförmig.</li>
              <li><strong>Verwendung:</strong> Massivholzwände, Decken, Dachelemente im modernen Holzbau.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Furnierwerkstoffe</h3>
          
          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz">Furniersperrholz (FU)</h4>
            <p className="text-sm text-text-main/80 mb-2">
              Besteht aus mehreren kreuzweise verleimten Furnierlagen (Schälfurniere).
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><strong>Eigenschaften:</strong> Hohe Festigkeit bei geringer Dicke, stark reduzierte Quell- und Schwindmaße in Plattenebene.</li>
              <li><strong>Verwendung:</strong> Beplankungen, Möbelbau, Fahrzeugbau.</li>
            </ul>
          </div>

          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz">Furnierschichtholz (FSH / LVL)</h4>
            <p className="text-sm text-text-main/80 mb-2">
              Besteht aus faserparallel verleimten Furnieren (Laminated Veneer Lumber).
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><strong>Eigenschaften:</strong> Extrem hohe Zug- und Biegefestigkeit in Faserrichtung.</li>
              <li><strong>Verwendung:</strong> Hochbelastete Träger, schlanke Bauteile.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Holzspanwerkstoffe</h3>
          
          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz">OSB-Platten (Oriented Strand Board)</h4>
            <p className="text-sm text-text-main/80 mb-2">
              Platten aus langen, schlanken, ausgerichteten Spänen (Strands). In den Deckschichten längs, in der Mittelschicht quer ausgerichtet.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><strong>Eigenschaften:</strong> Hohe Biegefestigkeit, markante Optik, oft feuchtebeständig verleimt (OSB/3, OSB/4).</li>
              <li><strong>Verwendung:</strong> Aussteifende Beplankung im Holzrahmenbau, Fußböden, Verpackungen.</li>
            </ul>
          </div>

          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz">Flachpressplatten (Spanplatten)</h4>
            <p className="text-sm text-text-main/80 mb-2">
              Platten aus kleinen Holzspänen, die mit Bindemitteln unter Druck und Wärme gepresst werden.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><strong>Eigenschaften:</strong> Günstig, isotrope Eigenschaften in der Plattenebene, geringere Festigkeit als OSB oder Sperrholz.</li>
              <li><strong>Verwendung:</strong> Möbelbau und Innenausbau (P2, P3); als P4–P7 nach DIN EN 312 auch tragend, z. B. Verlegeplatten und Beplankungen.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Holzfaserwerkstoffe</h3>
          
          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz">MDF (Mitteldichte Faserplatte)</h4>
            <p className="text-sm text-text-main/80 mb-2">
              Hergestellt aus feinen Holzfasern, die im Trockenverfahren mit Bindemitteln gepresst werden.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><strong>Eigenschaften:</strong> Sehr homogene Struktur, glatte Oberfläche, gut profilierbar.</li>
              <li><strong>Verwendung:</strong> Möbelbau, profilierte Fronten, Innenausbau.</li>
            </ul>
          </div>

          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz">Holzfaserdämmplatten (HFD)</h4>
            <p className="text-sm text-text-main/80 mb-2">
              Poröse Platten aus Holzfasern (Nass- oder Trockenverfahren).
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><strong>Eigenschaften:</strong> Gute Wärmedämmung, hervorragender sommerlicher Hitzeschutz (hohe Wärmespeicherkapazität).</li>
              <li><strong>Verwendung:</strong> Aufsparrendämmung, WDVS im Holzbau, Trittschalldämmung.</li>
            </ul>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'herstellung' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-xl font-bold text-text-main border-b border-home-grau/30 pb-2">Herstellungsprozesse</h3>
          <p className="text-text-main/80">
            Die Herstellungsverfahren bestimmen maßgeblich die Struktur und Leistung der Endprodukte.
          </p>
          <div className="space-y-4">
            <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Verleimung (Klebeprozess)</h4>
              <p className="text-sm text-text-main/80">Für baurelevante Anwendungen werden feuchtebeständige Leime (z. B. Phenol-Resorcin-Formaldehydharz [PRF], Melamin-Urea-Formaldehydharz [MUF] oder Polyurethan [PUR]) verwendet. PUR-Klebstoffe sind formaldehydfrei und setzen sich zunehmend durch.</p>
            </div>
            <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Furnierherstellung</h4>
              <p className="text-sm text-text-main/80">Der Stamm wird erhitzt, um ihn geschmeidiger zu machen. Anschließend wird er meist geschält (Schälfurnier, für Sperrholz) oder gemessert (Messerfurnier, oft für dekorative Zwecke).</p>
            </div>
            <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Faseraufbereitung</h4>
              <p className="text-sm text-text-main/80">Hackschnitzel werden unter hohem Druck und Dampf in Refinern (Mahlwerken) in Fasern zerrissen (Defibratorverfahren). Anschließend erfolgt die Leimzugabe (Blow-Line).</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nachhaltigkeit' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-xl font-bold text-text-main border-b border-home-grau/30 pb-2">Ressourceneinsatz und Umwelt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-lg mb-2">Rohstoffausnutzung</h4>
              <p className="text-sm text-text-main/80 mb-2">Holzwerkstoffe ermöglichen eine deutlich höhere Ausbeute des Baumstamms im Vergleich zu Vollholz. Späne und Fasern stammen oft aus Durchforstungsholz oder Reststoffen der Sägeindustrie.</p>
            </div>
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-lg mb-2">Emissionen (VOCs und Formaldehyd)</h4>
              <p className="text-sm text-text-main/80">Ein kritischer Faktor sind Formaldehydemissionen aus Klebstoffen. Die frühere Klasse E1 (EN 717-1) reicht heute nicht mehr: In Deutschland gilt seit 2020 die ChemVerbotsV mit Prüfung nach DIN EN 16516 (umgangssprachlich E05), seit 06.08.2026 EU-weit REACH Anhang XVII Eintrag 77 mit 0,062 mg/m³. Noch strengere Anforderungen stellen Umweltzeichen wie der Blaue Engel.</p>
            </div>
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-lg mb-2">Kaskadennutzung</h4>
              <p className="text-sm text-text-main/80">Idealerweise: Vollholz → Brettschichtholz → OSB/Spanplatten → Holzfaserplatten → Thermische Verwertung (Energiegewinnung am Ende des Lebenszyklus).</p>
            </div>
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-lg mb-2">Kreislauffähigkeit</h4>
              <p className="text-sm text-text-main/80">Kompliziert durch Bindemittelanteile. Nach KrWG-Abfallhierarchie und AltholzV hat die stoffliche Verwertung (z. B. Spanplattenherstellung aus Altholz A I/A II) Vorrang; belastete Holzwerkstoffe (A III/A IV) werden überwiegend energetisch in zugelassenen Anlagen verwertet.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300">
          <BaustoffProfil materialKey="holzwerkstoffe" />
        </div>
      )}

      <ModulTest moduleId="holzwerkstoffe" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Holzwerkstoff', url: 'https://de.wikipedia.org/wiki/Holzwerkstoff' },
          { title: 'Oriented Strand Board (OSB)', url: 'https://de.wikipedia.org/wiki/Grobspanplatte' },
          { title: 'Sperrholz', url: 'https://de.wikipedia.org/wiki/Sperrholz' },
          { title: 'dataholz.eu - Online-Katalog für Holz- und Holzwerkstoffe, Baustoff- und Bauteildaten', url: 'https://www.dataholz.eu/' }
        ]}
        literatur={[
          'Dunky, M.; Niemz, P. (2002): Holzwerkstoffe und Leime (Springer-Verlag)',
          'Niemz, P.; Sonderegger, W. (2021): Holzphysik - Physik des Holzes und der Holzwerkstoffe (Hanser)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 13986:2015-06 (Holzwerkstoffe zur Verwendung im Bauwesen - Eigenschaften, Bewertung der Konformität und Kennzeichnung)' },
          { title: 'DIN EN 300 (Ausgabe manuell prüfen) (Platten aus langen, flachen, ausgerichteten Spänen (OSB) - Definitionen, Klassifizierung und Anforderungen)' },
          { title: 'DIN EN 312:2010-12 (Spanplatten - Anforderungen)' },
          { title: 'DIN EN 636:2015-05 (Sperrholz - Anforderungen)' },
          { title: 'DIN EN 16351:2021-06 (Holzbauwerke - Brettsperrholz (CLT) - Anforderungen)' }
        ]}
        formeln={[
          {
            formel: 'f_{m,d} = k_{\\text{mod}} \\cdot \\frac{f_{m,k}}{\\gamma_M}',
            erklaerung: 'Bemessungsbiegefestigkeit von Holzwerkstoffplatten nach EC 5: \\gamma_M = 1{,}3 nach DIN EN 1995-1-1/NA (Empfehlungswert Tab. 2.3: 1{,}2 für OSB/Sperrholz, 1{,}3 für Span- und Faserplatten), k_{mod} abhängig von Nutzungsklasse und Lasteinwirkungsdauer.',
            quelle: 'DIN EN 1995-1-1 Tab. 2.3'
          },
          {
            formel: 'E_{\\text{mean,fin}} = \\frac{E_{\\text{mean}}}{1 + k_{\\text{def}}}',
            erklaerung: 'Kriechmodul zur Berechnung der Endverformung von Holzwerkstoffplatten: k_{def} ist bei Span-/Faserplatten höher als bei Vollholz (z.B. OSB NKL 1: k_{def} = 1{,}50).',
            quelle: 'DIN EN 1995-1-1 Tab. 3.2'
          }
        ]}
      />
    </div>
  );
} 