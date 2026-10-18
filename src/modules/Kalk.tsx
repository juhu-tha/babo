import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Box, Layers, Activity, ArrowRight, ArrowDown, ArrowLeft, ArrowUp, BookOpen } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import { ConceptTooltip } from '@/src/components/ui/ConceptTooltip';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';

export default function Kalk() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'festigkeit' | 'bestaendigkeit' | 'steckbrief'>('steckbrief');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="text-shiraz" /> Kalk
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Baukalk ist eines der ältesten mineralischen Bindemittel. Er härtet durch Karbonatisierung an der Luft aus und verleiht Putz- und Mauermörteln eine hervorragende Verarbeitbarkeit.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
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
              activeTab === 'grundlagen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('grundlagen')}
          >
            <Layers size={16} /> Technischer Kalkkreislauf
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'festigkeit' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('festigkeit')}
          >
            <Activity size={16} /> Festigkeitsbildung &amp; Erhärtung
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'bestaendigkeit' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('bestaendigkeit')}
          >
            <Box size={16} /> Eigenschaften &amp; Normen
          </button>
        </div>

        {activeTab === 'grundlagen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                <strong>Baukalk</strong> (Calciumcarbonat / Calciumhydroxid) gehört zu den ältesten Bindemitteln. Man unterscheidet den reinen <strong>Luftkalk</strong>, der nur an der Luft durch Aufnahme von CO₂ erhärtet, vom <strong>hydraulischen Kalk</strong>, der aufgrund begleitender Silikate/Aluminate auch unter Wasser aushärtet.
              </p>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-bold text-shiraz text-lg mb-4">Der technische Kalkkreislauf</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white rounded-xl border border-home-grau/25 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main mb-2">1. Brennen (<ConceptTooltip termKey="kalzinieren" fallbackText="Kalzinieren" />)</h4>
                    <p className="text-sm text-text-main/70 mb-3">
                      Natürlicher Kalkstein wird bei ca. 900–1100 °C im Kalkofen gebrannt. Das CO₂ entweicht, es entsteht poröser <strong>Branntkalk</strong> (endotherme Kalzinierung).
                    </p>
                  </div>
                  <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 text-center overflow-x-auto">
                    <BlockMath math="\mathrm{CaCO}_3 \xrightarrow{\approx 900-1100^{\circ}\text{C}} \mathrm{CaO} + \mathrm{CO}_2 \uparrow" />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-home-grau/25 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main mb-2">2. Löschen (Hydratisieren)</h4>
                    <p className="text-sm text-text-main/70 mb-3">
                      Zugabe von Wasser führt zu einer stark exothermen Reaktion (Hitzeentwicklung!). Es entsteht pulvriger oder breiiger <strong>Löschkalk</strong> (Calciumhydroxid).
                    </p>
                  </div>
                  <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 text-center overflow-x-auto">
                    <BlockMath math="\mathrm{CaO} + \mathrm{H}_2\mathrm{O} \longrightarrow \mathrm{Ca(OH)}_2 + \text{Wärme} \quad (\Delta H < 0)" />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-home-grau/25 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main mb-2">3. Abbinden (Karbonatisierung)</h4>
                    <p className="text-sm text-text-main/70 mb-3">
                      Erhärtung erfolgt nur, wenn dem angemachten Löschkalk ermöglicht wird, CO₂ aus der Luft aufzunehmen. Das Porenwasser wirkt als zwingender Katalysator.
                    </p>
                  </div>
                  <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 text-center overflow-x-auto">
                    <BlockMath math="\mathrm{Ca(OH)}_2 + \mathrm{CO}_2 \xrightarrow{\text{Porenfeuchte}} \mathrm{CaCO}_3 + \mathrm{H}_2\mathrm{O}" />
                  </div>
                </div>
              </div>

              {/* Formel-Herleitungs-Box für den thermodynamischen Kalkkreislauf */}
              <div className="mt-6">
                <FormulaDerivationBox
                  title="Thermodynamische Herleitung: Energie- &amp; Enthalpiebilanz des Kalkkreislaufs"
                  zielGleichung="\\Delta H_R^0 = +178{,}2\\text{ kJ/mol} \\quad (\\text{Brennen}) \\;\\longleftrightarrow\\; \\Delta H_R^0 = -65{,}2\\text{ kJ/mol} \\quad (\\text{Löschen})"
                  normQuelle="DIN EN 459-1 (Baukalk) &amp; DIN 1333"
                  ergebnisHinweis="Vollständiger chemisch-energetischer Zyklus: Kalzinieren ist stark endotherm; Löschen ist stark exotherm mit Volumenzunahme."
                  schritte={[
                    {
                      titel: "1. Brennstufe (Kalzinierung / Dissoziation)",
                      erklaerung: "Zersetzung von Calciumcarbonat bei T > 898 °C (Dissoziationsdruck p(CO₂) = 1 bar). Pro Mol CaO werden stöchiometrisch 44 g CO₂ abgespalten.",
                      formel: "CaCO_3(s) \\xrightarrow{\\approx 900-1100^{\\circ}\\text{C}} CaO(s) + CO_2(g) \\uparrow \\quad (\\Delta H = +178{,}2\\text{ kJ/mol})",
                      einheit: "kJ/mol"
                    },
                    {
                      titel: "2. Löschstufe (Hydratation zu Calciumhydroxid)",
                      erklaerung: "Stark exotherme Reaktion von Branntkalk mit flüssigem Wasser. Die freiwerdende Hydratationswärme bringt überschüssiges Wasser zum Kochen (Kalkmilch/Kalkteig).",
                      formel: "CaO(s) + H_2O(l) \\longrightarrow Ca(OH)_2(s) \\quad (\\Delta H = -65{,}2\\text{ kJ/mol})",
                      einheit: "kJ/mol"
                    },
                    {
                      titel: "3. Erhärtungsstufe (Karbonatisierung an Umgebungsluft)",
                      erklaerung: "Bindung von atmosphärischem Kohlendioxid im Porenwasser unter Rekristallisation von Calcit. Schließt den chemischen Kreislauf vollständig.",
                      formel: "Ca(OH)_2(s) + CO_2(g) \\xrightarrow{\\text{Porenfeuchte}} CaCO_3(s) + H_2O(l) \\quad (\\Delta H = -113\\text{ kJ/mol})",
                      einheit: "kJ/mol"
                    }
                  ]}
                />
              </div>
            </div>
            
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
               <h3 className="font-bold text-shiraz text-lg mb-2">Arten von Baukalk</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Luftkalke (Weißkalk, Dolomitkalk):</strong> Erhärten nur durch Aufnahme von Kohlendioxid aus der Luft (Karbonatisierung). Sie sind im erhärteten Zustand nicht wasserbeständig und eignen sich primär für Innenputze oder Denkmalschutz.</li>
                  <li><strong>Wasserkalk / Hydraulischer Kalk (HL / NHL):</strong> Enthalten "Verunreinigungen" des Ursprungsgesteins (z.B. reaktionsfähige Kieselsäure/Tonerde). Er erhärtet sowohl durch CO₂ (Karbonatisierung) als auch durch Wasser (Hydratation). Wird im Außenputz und für feuchte Bereiche genutzt.</li>
                </ul>
            </div>
          </div>
        )}

        {activeTab === 'festigkeit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Die Festigkeitsbildung von <strong>Luftkalk</strong> basiert nicht auf der Hydratation einer Gel-Phase wie beim Zement, sondern auf einer langsamen chemischen Kristallbildung durch die Aufnahme von atmosphärischem Kohlendioxid.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Mechanismus der Erhärtung</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Karbonatisierung:</strong> Die gelösten Calciumhydroxid-Ionen (Ca²⁺) reagieren mit dem gelösten Kohlendioxid (Carbonat-Ionen, CO₃²⁻) aus der Luft zu festen, wasserunlöslichen Calcit-Kristallen (CaCO₃).</li>
                  <li><strong>Wasser als Katalysator:</strong> Dieser Vorgang erfordert das Vorhandensein von Feuchtigkeit. CO₂ muss sich im Porenwasser lösen (Bildung von Kohlensäure), um reagieren zu können.
                    Deshalb trocknet Kalkmörtel nicht nur, sondern benötigt eine regulierte, feuchte Nachbehandlung oder ein luftiges Umfeld, um zu karbonatisieren, bevor das gesamte Anmachwasser verschwunden ist.</li>
                  <li>Diese Kristalle verfilzen beim Ausfallen und verbinden die Sandkörner (Zuschlag).</li>
                </ul>
              </div>

               <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Festigkeitsentwicklung</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Langsamer Prozess:</strong> Die CO₂-Diffusionsgeschwindigkeit von außen in den Mörtel bestimmt das Tempo. Je dichter die Struktur oder je dicker die Schicht, desto langsamer die Festigkeitsbildung. Ein vollständiges Aushärten im Kern dicker Mauern kann Jahrzehnte dauern.</li>
                  <li><strong>Geringere Endfestigkeit:</strong> Reine Luftkalkmörtel erreichen meist nur Druckfestigkeiten im Bereich von 1 bis 3 MPa (zum Vergleich: normaler Beton 30 MPa).</li>
                  <li><strong>Plastizität & Verformbarkeit:</strong> Wegen der geringen Steifigkeit können Kalkmörtel geringe Verformungen des Mauerwerks durch Kriechen, Schwinden oder thermische Längenänderungen besser rissfrei "mitmachen" als starre Zementmörtel (deshalb wichtig in der Denkmalpflege).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bestaendigkeit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Kalk zeichnet sich durch hohe kapillare Leitfähigkeit, Alkalität und spannungsarme Verformung aus. Er unterliegt jedoch Er ist jedoch empfindlich gegen Säuren (chemisch) sowie gegen Frost bei Durchfeuchtung (physikalisch).. Relevante Normen zur Kalkklassifizierung sind insbesondere die <strong>DIN EN 459-1</strong> (Baukalk).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Hygienische und Bauphysikalische Funktion</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Alkalität & Desinfektion:</strong> Baukalk ist stark alkalisch (pH-Wert um 12-13 im ungehärteten Zustand). Dies macht traditionellen Kalkputz oder Kalkfarbe hochwirksam desinfizierend und zur natürlichsten Methode zur Schimmelprävention im Innenraum.</li>
                  <li><strong>Feuchtemanagement:</strong> Kalkputze (ohne Kunstharzzusätze) sind extrem kapillaroffen und diffusionsoffen. Überschüssige Luftfeuchtigkeit wird sehr schnell aufgenommen und bei Trockenheit wieder abgegeben, was das Raumklima reguliert.</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Chemische Beständigkeit</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Frostgefahr beim Abbinden:</strong> Wenn während der Karbonatisierungsphase, in der Feuchtigkeit zwingend notwendig ist, Frost auftritt, friert das Porenwasser und sprengt den Mörtel. ("Kalkmörtel ist nicht frostbeständig").</li>
                  <li><strong>Saurer Regen (SO₂):</strong> Die Umweltverschmutzung schädigt alte Kalksteinfassaden: Schwefeldioxid (SO₂) wandelt zusammen mit Wasser das unlösliche Calciumcarbonat (Kalk) an der Fassadenoberfläche in wasserlösliches Calciumsulfat (Gips) um. Der Gips kristallisiert voluminös, die oberste Schicht sprengt ab (Gipskruste) und wäscht sich im Regen aus (Verwitterung).</li>
                </ul>
              </div>

               <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 md:col-span-2">
                <h3 className="font-bold text-shiraz text-lg mb-2">Sicherheit & Arbeitsschutz</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Ätzende Wirkung:</strong> Ungelöschter Branntkalk (CaO) und angemachter Löschkalk (Ca(OH)₂) sind aufgrund ihrer starken Alkalität <strong>stark ätzend</strong> (Gefahr schwerer Augenschäden / Erblindung). Reaktionen mit Haut und Schleimhäuten müssen durch strenge PSA (Schutzbrille, Handschuhe) vermieden werden.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="kalk" />
          </div>
        )}
      </div>

      <ModuleFooter wikipedia={[
        { title: 'Kalk', url: 'https://de.wikipedia.org/wiki/Kalk' },
        { title: 'Kalkmörtel', url: 'https://de.wikipedia.org/wiki/Kalkm%C3%B6rtel' },
        { title: 'Baukalk', url: 'https://de.wikipedia.org/wiki/Baukalk' }
      ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Scholz - Baustoffkenntnis (19. Auflage, Werner Verlag)',
        ]}
        normIds={['DIN_EN_459_1', 'DIN_EN_998', 'DIN_EN_13914']}
        regelwerke={[
          { title: 'DIN EN 459-1:2015-07 (Baukalk - Teil 1: Begriffe, Anforderungen und Konformitätskriterien)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 459-2:2021-09 (Baukalk - Teil 2: Prüfverfahren)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 998-1:2017-02 (Festlegungen für Mörtel im Mauerwerksbau - Teil 1: Putzmörtel)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 13914-1:2016-09 (Planung, Zubereitung und Ausführung von Außenputzen)', url: 'https://www.dinmedia.de/' }
        ]}
        formeln={[
          {
            formel: 'CaCO_3 \\xrightarrow{\\approx 900\\text{ bis }1.100^{\\circ}\\text{C}} CaO + CO_2 \\uparrow',
            erklaerung: 'Thermische Zersetzung (Kalzinieren) von Calciumcarbonat (Kalkstein) zu Calciumoxid (Branntkalk) unter Abspaltung von Kohlendioxid. Die Reaktion ist stark endotherm.',
            quelle: 'DIN EN 459-1:2015-07'
          },
          {
            formel: 'CaO + H_2O \\rightarrow Ca(OH)_2 + \\Delta H \\quad (\\Delta H = -65{,}2\\text{ kJ/mol})',
            erklaerung: 'Exothermes Trocken- oder Nasslöschen von Calciumoxid mit Wasser zu Calciumhydroxid (Löschkalk). Die freigesetzte Wärmeenergie führt zu starkem Erhitzen des Gemischs.',
            quelle: 'Molkentin: Bauchemie'
          },
          {
            formel: 'Ca(OH)_2 + CO_2 \\xrightarrow{\\text{Porenwasser}} CaCO_3 + H_2O',
            erklaerung: 'Karbonatisierung (Abbindeprozess) des Löschkalks durch Aufnahme von CO2 aus der Luft. Das Porenwasser wirkt als zwingender Elektrolyt/Katalysator, weshalb staubtrockener Kalkmörtel nicht erhärten kann (Gefahr des Aufbrennens).',
            quelle: 'Scholz - Baustoffkenntnis'
          }
        ]}
      />
    </div>
  );
}
