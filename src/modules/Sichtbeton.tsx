import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { useTabContext } from '@/src/contexts/TabContext';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Eye, Layers, Grid, Droplets } from 'lucide-react';

export default function Sichtbeton() {
  // Eingebettet in Sonderbetone: Quellenblock dort zentral
  const { activeTab: aktiverReiter } = useTabContext();
  const eingebettet = aktiverReiter === 'sonderbetone';
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Eye className="text-shiraz" /> Sichtbeton
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Als Sichtbeton bezeichnet man Betonbauteile, deren Ansichtsflächen Teil der architektonischen Gestaltung sind und an die besondere optische Anforderungen gestellt werden. 
            Die Herstellung erfordert eine präzise Abstimmung von Schalung, Trennmittel, Betonzusammensetzung und Verarbeitung.
            <span className="block mt-2 text-xs"><strong>Lernpfad:</strong> 1. Sichtbetonklassen → 2. Einflussfaktoren (Schalung, Trennmittel, Rezeptur) → 3. typische Mängel → 4. Mischung und Betondeckung.</span>
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        {/* Sichtbetonklassen */}
        <div>
          <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Layers className="text-shiraz" size={20} />
            Sichtbetonklassen (nach DBV/VDZ-Merkblatt Sichtbeton, 2015)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
              <div className="font-bold text-lg text-shiraz mb-1">SB 1</div>
              <div className="text-xs font-bold text-home-grau uppercase mb-2">Geringe Anforderungen</div>
              <p className="text-xs text-text-main/80">
                z.B. Kellerwände, gewerbliche Bereiche mit geringer optischer Bedeutung. Textur der Schalungshaut darf sich abzeichnen. Poren und Farbunterschiede sind weitgehend zulässig.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
              <div className="font-bold text-lg text-shiraz mb-1">SB 2</div>
              <div className="text-xs font-bold text-home-grau uppercase mb-2">Normale Anforderungen</div>
              <p className="text-xs text-text-main/80">
                z.B. Treppenhäuser, Stützmauern. Standardklasse im Hochbau. Begrenzte Anforderungen an Poren und Farbtongleichmäßigkeit.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm ring-1 ring-shiraz/30">
              <div className="font-bold text-lg text-shiraz mb-1">SB 3</div>
              <div className="text-xs font-bold text-home-grau uppercase mb-2">Hohe Anforderungen</div>
              <p className="text-xs text-text-main/80">
                z.B. Fassaden, repräsentative Innenräume. Hohe Anforderungen an die Schalungshaut, Fugenbild, Porenarmut und gleichmäßige Farbgebung. Erfordert Erprobungsflächen.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
              <div className="font-bold text-lg text-shiraz mb-1">SB 4</div>
              <div className="text-xs font-bold text-home-grau uppercase mb-2">Besonders hohe Anford.</div>
              <p className="text-xs text-text-main/80">
                Repräsentative Bauteile mit extremen architektonischen Ansprüchen. Sehr hohe Anforderungen an Porigkeit, Farbtongleichmäßigkeit und Fugenbild; die Kriterien werden über Erprobungsflächen vereinbart. Sehr aufwendig und teuer.
              </p>
            </div>
          </div>
        </div>

        {/* Einflussfaktoren */}
        <div className="mt-2">
          <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Grid className="text-shiraz" size={20} />
            Entscheidende Einflussfaktoren
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-home-grau/30 rounded-xl p-5 bg-off-white">
              <h4 className="font-bold text-text-main text-md mb-2">1. Schalungshaut</h4>
              <p className="text-sm text-text-main/80 mb-3">
                Die Schalung ist der "Stempel", der die Betonoberfläche prägt.
              </p>
              <ul className="list-disc list-inside text-xs text-text-main/70 space-y-1">
                <li><strong>Saugend (z.B. sägeraues Holz):</strong> Dunklere, porenärmere Oberfläche, Holzmaserung sichtbar.</li>
                <li><strong>Nicht saugend (z.B. kunststoffbeschichtet, Stahl):</strong> Sehr glatte, helle Oberfläche, aber höhere Neigung zu Lunkern (Poren) und Marmorierungen.</li>
                <li>Fugenbild und Ankerlöcher müssen architektonisch geplant werden.</li>
              </ul>
            </div>

            <div className="border border-home-grau/30 rounded-xl p-5 bg-off-white">
              <h4 className="font-bold text-text-main text-md mb-2">2. Trennmittel</h4>
              <p className="text-sm text-text-main/80 mb-3">
                Verhindert das Anhaften des Betons an der Schalung.
              </p>
              <ul className="list-disc list-inside text-xs text-text-main/70 space-y-1">
                <li>Muss extrem dünn und gleichmäßig aufgetragen werden (meist gesprüht und nachgewischt).</li>
                <li>Zu viel Trennmittel führt zu Flecken, Verfärbungen und Staubbildung auf der Betonoberfläche.</li>
                <li>Muss auf die Schalungshaut abgestimmt sein.</li>
              </ul>
            </div>

            <div className="border border-home-grau/30 rounded-xl p-5 bg-off-white">
              <h4 className="font-bold text-text-main text-md mb-2">3. Betonzusammensetzung</h4>
              <p className="text-sm text-text-main/80 mb-3">
                Die Rezeptur muss ein gleichmäßiges Erscheinungsbild gewährleisten.
              </p>
              <ul className="list-disc list-inside text-xs text-text-main/70 space-y-1">
                <li>Ausreichend Mehlkorn (Zement + Zusatzstoffe) für eine geschlossene Oberfläche.</li>
                <li>Gleichbleibende Zementsorte und Gesteinskörnung (aus demselben Werk/Abbaugebiet) zur Vermeidung von Farbschwankungen.</li>
                <li>Konsistenz muss das Entweichen von Luftblasen beim Verdichten ermöglichen (meist F3-F4).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Typische Mängel */}
        <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
          <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
            <Droplets className="text-shiraz" size={20} />
            Typische optische Beeinträchtigungen
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <strong className="text-sm text-text-main">Lunker (Poren):</strong>
              <p className="text-xs text-text-main/70 mt-1">Lufteinschlüsse an der Oberfläche. Entstehen oft durch unzureichendes Verdichten oder bei sehr glatten, nicht saugenden Schalungen, an denen die Luftblasen nicht aufsteigen können.</p>
            </div>
            <div>
              <strong className="text-sm text-text-main">Marmorierungen / Wolkenbildung:</strong>
              <p className="text-xs text-text-main/70 mt-1">Helligkeitsunterschiede. Entstehen durch unterschiedliche Wasser-Zement-Werte an der Oberfläche (z.B. durch ungleichmäßiges Saugen der Schalung oder Trennmittelpfützen).</p>
            </div>
            <div>
              <strong className="text-sm text-text-main">Kiesnester:</strong>
              <p className="text-xs text-text-main/70 mt-1">Stellen, an denen der Zementleim fehlt und nur grobe Gesteinskörnung sichtbar ist. Ursache: Entmischung beim Einbau oder undichte Schalungsfugen (Ausbluten des Leims).</p>
            </div>
            <div>
              <strong className="text-sm text-text-main">Rostfahnen:</strong>
              <p className="text-xs text-text-main/70 mt-1">Verfärbungen durch korrodierende Bewehrung oder Bindedraht, der zu nah an der Schalungshaut lag (unzureichende Betondeckung).</p>
            </div>
          </div>
        </div>

      </div>

            
      <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
        <h3 className="font-semibold text-text-main mb-3">Typische Mischungszusammensetzung (pro m³, Lehrbeispiel)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[300px]">
            <thead>
              <tr className="border-b-2 border-home-grau/30 bg-home-grau/5">
                <th className="py-2 px-3 text-sm font-semibold text-text-main">Komponente</th>
                <th className="py-2 px-3 text-sm font-semibold text-text-main text-right">Menge</th>
              </tr>
            </thead>
            <tbody>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-home-grau/5 transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zement (z.B. CEM I oder CEM II)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 350 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-home-grau/5 transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Wasser (w/z ~0,50)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 175 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-home-grau/5 transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Gesteinskörnung (hoher Mehlkorngehalt für geschlossenes Gefüge)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1850 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-home-grau/5 transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zusatzmittel (Fließmittel)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">nach Bedarf</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
      <FormulaDerivationBox
        title="Anwendungsbeispiel: Betondeckung einer Sichtbetonfassade"
        zielGleichung="c_{nom} = c_{min} + \Delta c_{dev}, \quad c_{min} = \max(c_{min,b};\; c_{min,dur};\; 10\,\text{mm})"
        normQuelle="DIN EN 1992-1-1 mit NA (XC4: c_min,dur = 25 mm; Δc_dev = 15 mm)"
        schritte={[
          { titel: '1. Gegeben', formel: '\\text{XC4},\\; \\varnothing = 12\\,\\text{mm}', erklaerung: 'Bewitterte Fassade mit Betonstahl Ø 12.' },
          { titel: '2. Mindestbetondeckung', formel: 'c_{min} = \\max(12;\\; 25;\\; 10) = 25\\,\\text{mm}', erklaerung: 'Maßgebend ist die Dauerhaftigkeit.' },
          { titel: '3. Nennmaß', formel: 'c_{nom} = 25 + 15 = 40\\,\\text{mm}', erklaerung: 'Abstandhalter und Bindedraht dürfen das Nennmaß nicht unterschreiten – sonst Rostfahnen.' },
        ]}
        ergebnisHinweis="c_nom = 40 mm; Abstandhalter mit Sichtbetoneignung verwenden."
      />

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Porenflächenanteil einer Prüffläche"
        zielGleichung="A_{Poren} = \frac{\sum A_{Pore,i}}{A_{Messfeld}} \cdot 100\,\%"
        normQuelle="Auswertung an Erprobungsflächen (Lehrwerte; Klassengrenzen nach Merkblatt manuell prüfen)"
        schritte={[
          { titel: '1. Messfeld', formel: 'A_{Messfeld} = 500 \\cdot 500 = 250\\,000\\,\\text{mm}^2', erklaerung: 'Quadratisches Messfeld auf der Ansichtsfläche.' },
          { titel: '2. Porenfläche', formel: '\\sum A_{Pore,i} = 600\\,\\text{mm}^2', erklaerung: 'Summe aller Poren über der Erfassungsgrenze.' },
          { titel: '3. Anteil', formel: 'A_{Poren} = \\frac{600}{250\\,000} \\cdot 100 = 0{,}24\\,\\%', erklaerung: 'Vergleich mit der vereinbarten Porigkeitsklasse.' },
        ]}
        ergebnisHinweis="Porenflächenanteil 0,24 % (Lehrwerte)."
      />

      <ModulTest moduleId="sichtbeton" />

      {!eingebettet && (
      <ModuleFooter
        weblinks={[
          { title: 'Beton.wiki: Sichtbeton', url: 'https://beton.wiki/index.php?title=Sichtbeton' },
          { title: "Zement-Merkblatt H 8: Sichtbeton – Techniken der Flächengestaltung (BauNetz Wissen)", url: "https://www.baunetzwissen.de/beton/tipps/planungshilfen/h-8--sichtbeton-techniken-der-flaechengestaltung-741365" }
        ]}
        wikipedia={[
          { title: 'Sichtbeton', url: 'https://de.wikipedia.org/wiki/Sichtbeton' },
          { title: 'Schalung (Beton)', url: 'https://de.wikipedia.org/wiki/Schalung_(Beton)' }
        ]}
        regelwerke={[
          { title: 'DBV/VDZ-Merkblatt Sichtbeton (Fassung 2015; Klassen SB 1 bis SB 4)' },
          { title: 'DIN 18217 (Betonflächen und Schalungshaut)' },
          { title: 'DIN 18218 (Frischbetondruck auf Schalungen)' },
          { title: 'DIN EN 13670 (Ausführung von Tragwerken aus Beton)' }
        ]}
        literatur={[
          'Peck, M.; Bose, T.; Bosold, D.: Technik des Sichtbetons – Planung und Ausführung von Sichtbetonflächen. 2., überarb. Aufl., Erkrath: Verlag Bau+Technik 2014',
          'Deutscher Beton- und Bautechnik-Verein (Hrsg.): Sichtbeton planen, ausschreiben und ausführen – Hintergründe und Erläuterungen zum DBV/VDZ-Merkblatt Sichtbeton. Berlin 2022',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
            formel: 'A_{\\text{Poren}} = \\frac{\\sum A_{\\text{Pore,i}}}{A_{\\text{Messfeld}}} \\cdot 100\\,\\%',
            erklaerung: 'Porenflächenanteil auf der Schalungsfläche zur Einstufung nach DBV-Porenschablone (z. B. P1 bis P4).',
            quelle: 'DBV/VDZ-Merkblatt Sichtbeton (Fassung Juni 2015; Porigkeitsklassen P1 ≤ 3000 mm², P2 ≤ 2250 mm², P3 ≤ 1500 mm², P4 ≤ 750 mm² je Prüffläche 500 × 500 mm)'
          },
          {
            formel: 'c_{\\text{nom}} = c_{\\text{min}} + \\Delta c_{\\text{dev}} \\quad (\\text{Farb- und Rostschutz})',
            erklaerung: 'Ausreichende Betondeckung nach DIN EN 1992-1-1 zur sicheren Vermeidung von Rostfahnen an der Sichtfläche.',
            quelle: 'DIN EN 1992-1-1 / DBV-Merkblatt'
          }
        ]}
      />
      )}
    </div>
  );
}
