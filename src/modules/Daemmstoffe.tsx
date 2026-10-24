import React, { useState } from 'react';
import { Box, Layers, BookOpen } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

export default function Daemmstoffe() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'info'>('steckbrief');

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="w-5 h-5 text-shiraz" />
          Dämmstoffe
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Materialien zur Wärmedämmung, deren Wärmeleitfähigkeiten und bauphysikalische Eigenschaften.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-2">
          <button aria-pressed={activeTab === 'steckbrief'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Baustoff-Steckbrief
          </button>
          <button aria-pressed={activeTab === 'info'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
              activeTab === 'info' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('info')}
          >
            <Layers size={16} /> Materialien & Dämmung
          </button>
        </div>

        {activeTab === 'info' && (
          <div className="p-6 space-y-8 animate-in fade-in duration-300">
            
            {/* Mineralische Dämmstoffe */}
            <section>
              <h3 className="text-xl font-bold text-home-prim mb-4">Anorganisch-Mineralische Dämmstoffe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2">Mineralwolle (Glaswolle & Steinwolle)</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Rohstoffe:</strong> Altglas (Glaswolle) bzw. Basalt/Diabas (Steinwolle), gebunden mit Kunstharzen.</li>
                    <li><strong>Wärmeleitfähigkeit (λ):</strong> 0,032 - 0,040 W/(m·K)</li>
                    <li><strong>Brandschutz:</strong> Nicht brennbar (A1 oder A2-s1, d0). Ideal für Brandschutzbarrieren im WDVS.</li>
                    <li><strong>Eigenschaften:</strong> Hoch dampfdiffusionsoffen (μ ≈ 1). Neigt zur Wasseraufnahme, daher vor Feuchtigkeit zu schützen.</li>
                  </ul>
                </div>
                
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2">Schaumglas (Cellular Glass)</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Rohstoffe:</strong> Aufgeschäumtes Altglas (mit Kohlenstoff versetzt).</li>
                    <li><strong>Wärmeleitfähigkeit (λ):</strong> 0,036 - 0,050 W/(m·K)</li>
                    <li><strong>Brandschutz:</strong> Nicht brennbar (A1).</li>
                    <li><strong>Eigenschaften:</strong> Absolut wasser- und dampfdicht (μ = ∞). Extrem druckfest und unverrottbar.</li>
                    <li><strong>Einsatz:</strong> Perimeterdämmung unter lastabtragenden Bodenplatten, Flachdächer.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Synthetische Dämmstoffe */}
            <section>
              <h3 className="text-xl font-bold text-home-prim mb-4">Organisch-Synthetische Dämmstoffe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2">EPS (Expandiertes Polystyrol / "Styropor")</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Struktur:</strong> Aufgeschäumtes Granulat, besteht zu 98% aus Luft.</li>
                    <li><strong>Wärmeleitfähigkeit (λ):</strong> 0,031 - 0,040 W/(m·K)</li>
                    <li><strong>Brandschutz:</strong> Mit Flammschutzmitteln Euroklasse E nach DIN EN 13501-1 (früher B1 nach DIN 4102-1). Im Brandfall schmelzend/tropfend.</li>
                    <li><strong>Einsatz:</strong> Standard im WDVS, günstige Trittschalldämmung.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2">XPS (Extrudiertes Polystyrol / "Styrodur")</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Struktur:</strong> Geschlossenzellige Schaumstruktur durch Extrusion.</li>
                    <li><strong>Wärmeleitfähigkeit (λ):</strong> 0,032 - 0,039 W/(m·K)</li>
                    <li><strong>Eigenschaften:</strong> Hohe Druckfestigkeit, wasserabweisend, feuchtigkeitsunempfindlich.</li>
                    <li><strong>Einsatz:</strong> Perimeterdämmung, Umkehrdächer, Frostschürzen.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2">PUR / PIR (Polyurethan-Hartschaum)</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Wärmeleitfähigkeit (λ):</strong> 0,022 - 0,028 W/(m·K) (Sehr hohe Dämmwirkung!)</li>
                    <li><strong>Brandschutz:</strong> Brennbar, aber nicht schmelzend (Duroplast).</li>
                    <li><strong>Vorteil:</strong> Sehr schlanke Aufbauten möglich, wird oft mit Alubeplankung (Dampfsperre) kaschiert.</li>
                    <li><strong>Einsatz:</strong> Aufsparrendämmung, Flachdach.</li>
                  </ul>
                </div>
                
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2">Vakuumisolationspaneele (VIP)</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Prinzip:</strong> Evakuierter Kern aus Kieselsäure in luftdichter Hochbarrierefolie.</li>
                    <li><strong>Wärmeleitfähigkeit (λ):</strong> 0,004 - 0,007 W/(m·K) (Die höchste Dämmwirkung).</li>
                    <li><strong>Nachteil:</strong> Darf nicht beschädigt (angebohrt) werden, sonst steigt λ durch Belüftung auf ca. 0,020 W/(m·K), also etwa um den Faktor 3–5. Teuer.</li>
                    <li><strong>Einsatz:</strong> Wenn extrem wenig Platz vorhanden ist (z.B. Terrassentüren, Gauben).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Naturdämmstoffe */}
            <section>
              <h3 className="text-xl font-bold text-home-prim mb-4">Nachwachsende Naturdämmstoffe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2">Holzfaser & Zellulose</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Wärmeleitfähigkeit (λ):</strong> 0,038 - 0,050 W/(m·K)</li>
                    <li><strong>Sommerlicher Wärmeschutz:</strong> Sehr gut! Hohe Wärmespeicherkapazität (c ≈ 2100 J/kgK) verzögert die Aufheizung von Dachräumen (hohe Phasenverschiebung).</li>
                    <li><strong>Verarbeitung:</strong> Als Platten oder Einblasdämmung (Zelluloseflocken aus Altpapier).</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2">Hanf, Jute & Schafwolle</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Besonderheit Schafwolle:</strong> Kann viel Feuchtigkeit sorbieren (bis ca. 1/3 des Eigengewichts), ohne sich nass anzufühlen; die Wärmeleitfähigkeit steigt dabei moderat an. Sie kann Formaldehyd aus der Raumluft binden (Herstellerangabe).</li>
                    <li><strong>Umwelt:</strong> Sehr gute CO₂-Bilanz. Brandschutz oft durch Zusätze (z.B. Soda oder Borsalz) erreicht.</li>
                  </ul>
                </div>
              </div>
            </section>

          </div>
        )}

        {activeTab === 'steckbrief' && (
          <div className="p-6 animate-in fade-in duration-300">
            <BaustoffProfil materialKey="daemmstoffe" />
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Erforderliche Dämmstoffdicke für einen Ziel-U-Wert"
          zielGleichung="d_D = \lambda_D \cdot \left(\frac{1}{U_{Ziel}} - R_{si} - R_{se} - \sum \frac{d_i}{\lambda_i}\right)"
          normQuelle="DIN EN ISO 6946; Bemessungswerte λ nach DIN 4108-4 bzw. Produktangabe"
          schritte={[
            { titel: '1. Bestandswand', formel: '15\\,\\text{mm Innenputz } (\\lambda = 0{,}70) + 240\\,\\text{mm KS } (\\lambda = 0{,}99)', erklaerung: 'Kalksandstein-Mauerwerk, Lehrwerte.' },
            { titel: '2. Widerstände ohne Dämmung', formel: 'R = 0{,}13 + 0{,}04 + \\frac{0{,}015}{0{,}70} + \\frac{0{,}24}{0{,}99} = 0{,}43\\,\\text{m}^2\\text{K/W}', erklaerung: 'R_si = 0,13 und R_se = 0,04 m²K/W.' },
            { titel: '3. Erforderlicher Dämmwiderstand', formel: 'R_D = \\frac{1}{0{,}20} - 0{,}43 = 4{,}57\\,\\text{m}^2\\text{K/W}', erklaerung: 'Ziel U = 0,20 W/(m²K).' },
            { titel: '4. Dicken je Dämmstoff', formel: '\\text{EPS 035: } 160\\,\\text{mm};\\; \\text{MW 032: } 146\\,\\text{mm};\\; \\text{Holzfaser 040: } 183\\,\\text{mm}', erklaerung: 'd = λ · R_D; gewählt wird die nächste lieferbare Dicke.' },
          ]}
          ergebnisHinweis="Die Wärmeleitfähigkeit bestimmt die Dicke direkt: 20 % höheres λ bedeutet 20 % mehr Dämmstoffdicke. Dübel und Befestigungen (ΔU) sind hier nicht berücksichtigt."
        />
      </div>

      <ModulTest moduleId="daemmstoffe" />

      <ModuleFooter
        wikipedia={[
          { title: 'Wärmedämmung', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmed%C3%A4mmung' },
          { title: 'Dämmstoff', url: 'https://de.wikipedia.org/wiki/D%C3%A4mmstoff' }
        ]}
        literatur={[
          'Willems, W. M. (2018): Lehrbuch der Bauphysik - Schall, Wärme, Feuchte, Brand (8. Auflage, Springer Vieweg)',
          'FNR (Hrsg.): Marktübersicht Dämmstoffe aus nachwachsenden Rohstoffen (Fachagentur Nachwachsende Rohstoffe, aktuelle Ausgabe)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN 4108-10 (Wärmeschutz und Energie-Einsparung in Gebäuden - Teil 10: Anwendungsbezogene Anforderungen an Wärmedämmstoffe)' },
          { title: 'GModG (Gebäudemodernisierungsgesetz (GModG), bis 28.07.2026 Gebäudeenergiegesetz (GEG) - Anforderungen an den Wärmeschutz von Bauteilen)', url: 'https://www.gesetze-im-internet.de/geg/' },
          { title: 'DIN EN 13162 (Wärmedämmstoffe für Gebäude - Werkmäßig hergestellte Produkte aus Mineralwolle (MW))' }
        ]}
        weblinks={[
          { title: 'Ubakus.de – U-Wert- & Glaser-Tauwassernachweis', url: 'https://www.ubakus.de/' },
          { title: 'ÖKOBAUDAT – EPD-Datenbank für Dämmstoffe', url: 'https://www.oekobaudat.de/' },
          { title: 'WECOBIS – Ökologisches Baustoffinformationssystem des Bundes', url: 'https://www.wecobis.de/' }
        ]}
        formeln={[
          {
            formel: 'R = \\frac{d}{\\lambda}',
            erklaerung: 'Wärmedurchlasswiderstand R in (m²·K)/W. Bestimmt den Widerstand eines homogenen Bauteils der Dicke d (in m) mit der Wärmeleitfähigkeit \\lambda (in W/(m·K)) gegenüber einem Wärmestrom.',
            quelle: 'DIN 4108 / DIN EN ISO 6946'
          },
          {
            formel: 'U = \\frac{1}{R_{si} + \\sum_{i=1}^{n} \\frac{d_i}{\\lambda_i} + R_{se}}',
            erklaerung: 'Wärmedurchgangskoeffizient (U-Wert) in W/(m²·K). Beschreibt den transmittierenden Wärmestrom durch ein mehrschichtiges Bauteil unter Berücksichtigung der inneren (R_{si}) und äußeren (R_{se}) Wärmeübergangswiderstände.',
            quelle: 'DIN EN ISO 6946'
          }
        ]}
      />
    </div>
  );
}
