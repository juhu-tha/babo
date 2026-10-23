import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Box, Layers, Activity, ArrowRight, ArrowDown, ArrowLeft, BookOpen } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

export default function Gips() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'festigkeit' | 'bestaendigkeit' | 'steckbrief'>('steckbrief');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="text-shiraz" /> Gips
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Gips (Calciumsulfat) ist ein bewährter mineralischer Luftbinder. Seine schnelle Erhärtung, biologische Verträglichkeit und feuchteregulierenden Eigenschaften machen ihn ideal für den Innenausbau.
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
            <Layers size={16} /> Grundlagen &amp; Hydratation
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'festigkeit' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('festigkeit')}
          >
            <Activity size={16} /> Festigkeitsbildung
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'bestaendigkeit' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('bestaendigkeit')}
          >
            <Box size={16} /> Beständigkeit &amp; Normen
          </button>
        </div>

        {activeTab === 'grundlagen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                <strong>Gips</strong> (Calciumsulfat) ist ein nicht-hydraulisches (Luft-) Bindemittel, das nur an der Luft dauerhaft erhärten kann und dort beständig ist. Durch Brennen von natürlich vorkommendem Gipsgestein (CaSO₄·2H₂O) oder REA-Gips wird Kristallwasser ausgetrieben. Bei Zugabe von Wasser findet eine Rückreaktion statt, durch die das Material erhärtet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Herstellung (Brennen)</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Rohstoff:</strong> Calciumsulfat-Dihydrat <InlineMath math="CaSO_4 \cdot 2H_2O" /></li>
                  <li>Beim Erhitzen (ca. 100 - 180°C) entsteht Halbhydrat (Stuckgips): <br/><BlockMath math="CaSO_4 \cdot 2H_2O \rightarrow CaSO_4 \cdot 0{,}5H_2O + 1{,}5H_2O" /></li>
                  <li>Bei höheren Temperaturen (&gt; 180°C) entsteht Anhydrit-Gips (ohne Kristallwasser, <InlineMath math="CaSO_4" />), z.B. für Fließestriche (Anhydritestrich).</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Abbindeprozess (Reaktion)</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Lösen:</strong> Das aus gebranntem Gips und Wasser bestehende Gemisch geht in Lösung. Das Halbhydrat ist in Wasser besser löslich als das Dihydrat.</li>
                  <li><strong>Kristallisation:</strong> Aus der übersättigten Lösung kristallisiert das schwerer lösliche Calciumsulfat-Dihydrat in Form feiner Nadeln aus.</li>
                  <li><strong>Reaktionsgleichung:</strong> <br/><BlockMath math="CaSO_4 \cdot 0{,}5H_2O + 1{,}5H_2O \rightarrow CaSO_4 \cdot 2H_2O" /></li>
                  <li><strong>Volumenänderung:</strong> Das Material dehnt sich beim Abbinden leicht aus (etwa 0,1–1 %, Lehrwert), was ein scharfkantiges und exaktes Ausfüllen von Formen ermöglicht.</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-home-grau/30 mt-6 shadow-sm">
              <h3 className="font-bold text-shiraz text-lg mb-6 text-center">Der Gipskreislauf</h3>
              
              <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-4">
                 {/* Top row */}
                 <div className="flex justify-between items-center w-full relative z-10">
                    <div className="bg-off-white border-2 border-home-grau/30 p-4 rounded-xl w-40 text-center shadow-sm">
                       <div className="font-bold text-text-main mb-1">Gipsstein</div>
                       <div className="text-xs text-text-main/70 font-mono">CaSO₄·2H₂O</div>
                       <div className="text-[10px] text-text-main/50 mt-1">Dihydrat</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                       <div className="text-xs font-bold text-shiraz bg-white px-2 mb-1">Brennen</div>
                       <div className="text-[10px] text-text-main/60">- 1,5 H₂O (ca. 100-180°C)</div>
                       <ArrowRight className="text-home-grau" />
                    </div>
                    
                    <div className="bg-white border-2 border-shiraz/50 p-4 rounded-xl w-40 text-center shadow-md relative">
                       <div className="absolute -top-3 -right-3 bg-shiraz text-white text-[10px] font-bold px-2 py-1 rounded-full">Bindemittel</div>
                       <div className="font-bold text-shiraz mb-1">Stuckgips</div>
                       <div className="text-xs text-text-main/70 font-mono">CaSO₄·0,5H₂O</div>
                       <div className="text-[10px] text-text-main/50 mt-1">Halbhydrat</div>
                    </div>
                 </div>
                 
                 {/* Right vertical arrow */}
                 <div className="flex w-full justify-end pr-16 relative z-0 -my-2">
                    <div className="flex flex-col items-center mr-[16px]">
                       <div className="text-xs font-bold text-shiraz bg-white px-2 mt-2 mb-1">+ Wasser (H₂O)</div>
                       <div className="text-[10px] text-text-main/60">Anmischen</div>
                       <ArrowDown className="text-home-grau mt-2" />
                    </div>
                 </div>
                 
                 {/* Bottom row */}
                 <div className="flex justify-between items-center w-full relative z-10">
                    <div className="flex flex-col items-center invisible w-40">
                       {/* Placeholder for layout */}
                    </div>
                    
                    <div className="flex flex-col items-center w-full">
                       <ArrowLeft className="text-home-grau mb-1" />
                       <div className="text-xs font-bold text-shiraz bg-white px-2 mt-1">Abbinden (Hydratation)</div>
                       <div className="text-[10px] text-text-main/60">Kristallisation (+ Wärme)</div>
                    </div>
                    
                    <div className="bg-off-white border-2 border-home-grau/30 p-4 rounded-xl w-40 text-center shadow-sm">
                       <div className="font-bold text-text-main mb-1">Erhärteter Gips</div>
                       <div className="text-xs text-text-main/70 font-mono">CaSO₄·2H₂O</div>
                       <div className="text-[10px] text-text-main/50 mt-1">Dihydrat-Kristallgefüge</div>
                    </div>
                 </div>
                 
              </div>
            </div>

          </div>
        )}

        {activeTab === 'festigkeit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Die mechanischen Eigenschaften und die <strong>Festigkeitsbildung</strong> von Gipsbaustoffen hängen von verschiedenen Faktoren ab, insbesondere dem Verhältnis von Wasser zu Gips (W/G-Wert) und der Porenstruktur.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Mechanismus der Erhärtung</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Kristallverfilzung:</strong> Die Festigkeit entsteht rein physikalisch durch die Verfilzung und Verwachsung der nadelförmigen Dihydrat-Kristalle beim Auskristallisieren.</li>
                  <li><strong>Keine chemische Vernetzung:</strong> Im Gegensatz zu Zement gibt es keine komplexen, raumfüllenden Gelphasen (C-S-H-Phasen), sondern nur mechanische Verhakung der Kristalle.</li>
                  <li>Die Festigkeit ist sofort nach dem Austrocknen (Verdunsten des Anmachwassers) in voller Höhe erreicht (keine monatelange Nacherhärtung wie beim Beton).</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Einflussfaktoren der Festigkeit</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Porosität:</strong> Für die Verarbeitbarkeit (den Brei) wird weitaus mehr Wasser beigemischt, als für die chemische Hydratation (ca. 18,6 %) nötig ist. Das überschüssige Wasser verdampft und hinterlässt Kapillarporen.</li>
                  <li><strong>W/G-Wert:</strong> Ein höherer W/G-Wert führt zu höherer Porosität (größerem Porenraum) und damit zu einer drastischen Reduzierung der Druck- und Biegezugfestigkeit.</li>
                  <li><strong>Feuchtegehalt:</strong> Gips verliert im durchfeuchteten Zustand mehr als 50 % seiner mechanischen Festigkeit durch die Wasseranlagerung an den Kristallstrukturen. Er erlangt die Festigkeit beim Trocknen jedoch zurück.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bestaendigkeit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Gips ist hervorragend für den Innenausbau (Trockenbau, Putz, Brandschutz) geeignet, unterliegt jedoch bauphysikalischen und chemischen Einschränkungen. Relevante Normen sind unter anderem <strong>DIN EN 13279</strong> (Gipsbinder und Gipsputze) und <strong>DIN 18180 / DIN EN 520</strong> (Gipskartonplatten).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Wasser- und Feuchtebeständigkeit</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Löslichkeit:</strong> Calciumsulfat ist in Wasser teilweise (schwer) löslich (ca. 2 g/l). Bei andauernder Feuchte- oder Wassereinwirkung löst sich der Gips auf (Materialverlust).</li>
                  <li><strong>Trockenbereich:</strong> Gipsbaustoffe eignen sich für Innenräume mit geringer Wassereinwirkung (W0-I) und mit Verbundabdichtung für mäßige Einwirkung (W1-I, z. B. häusliche Bäder) nach DIN 18534; für W2-I und W3-I sind sie nicht geeignet.</li>
                  <li><strong>Feuchträume:</strong> In stark feuchtebelasteten Bereichen darf gewöhnlicher Gips nicht verwendet werden. Hierfür gibt es imprägnierte Platten (Gipskarton-Feuchtraumplatten GKBI, nach DIN EN 520 z. B. Typ H2; Feuerschutzplatten GKF ≙ Typ DF).</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Brandschutz (Baulicher Brandschutz)</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Kristallwasser:</strong> Gips enthält im abgebundenen Zustand ca. 20 M.-% Kristallwasser (Dihydrat).</li>
                  <li><strong>Endotherme Reaktion:</strong> Im Brandfall muss dieses Wasser erst verdampfen, bevor die Temperatur im Bauteil auf über ca. 100–140 °C ansteigt. Das verdampfende Wasser entzieht dem Brand Energie und bildet zudem einen Dampfschleier.</li>
                  <li><strong>Feuerschutzplatten (GKF):</strong> Besitzen eine zusätzliche Glasfaserarmierung, damit das Material nach dem Entwässern (Kalzinieren) nicht sofort Risse bildet und zerfällt.</li>
                </ul>
              </div>

               <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 md:col-span-2">
                <h3 className="font-bold text-shiraz text-lg mb-2">Chemische Unverträglichkeiten</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>"Ettringittreiben":</strong> Gips darf nicht in dauerfeuchtem Kontakt mit zementgebundenen Baustoffen stehen, da die im Gips enthaltenen Sulfate (SO₄²⁻) mit den Aluminaten des Zements unter Wasserzugabe das Ettringit-Mineral bilden, was zu starkem Volumenwachstum und Sprengung (Treiben) führt.</li>
                  <li><strong>Korrosion an Metallen:</strong> Gips ist an sich nicht stark korrosiv, jedoch in Verbindung mit Feuchtigkeit beschleunigen Sulfate die Korrosion an ungeschützten Stahlteilen. Befestigungsmittel im Gipsbau müssen korrosionsgeschützt sein.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="gips" />
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Wasserbedarf und Porosität von Stuckgips"
          zielGleichung="\text{CaSO}_4 \cdot \tfrac{1}{2}\,\text{H}_2\text{O} + 1\tfrac{1}{2}\,\text{H}_2\text{O} \rightarrow \text{CaSO}_4 \cdot 2\,\text{H}_2\text{O}"
          normQuelle="Stöchiometrie; Dichten als Lehrwerte (Halbhydrat 2,63 g/cm³, Dihydrat 2,32 g/cm³)"
          schritte={[
            { titel: '1. Gegeben', formel: 'm_{HH} = 10\\,\\text{kg},\\; W/G = 0{,}70 \\Rightarrow m_W = 7{,}0\\,\\text{kg}', erklaerung: 'β-Halbhydrat (Stuckgips), Lehrbeispiel.' },
            { titel: '2. Chemisch gebundenes Wasser', formel: '\\frac{1{,}5 \\cdot 18{,}0}{145{,}1} = 18{,}6\\,\\% \\Rightarrow 1{,}86\\,\\text{kg}', erklaerung: 'Nur dieser Anteil wird als Kristallwasser eingebaut.' },
            { titel: '3. Überschusswasser', formel: '7{,}0 - 1{,}86 = 5{,}14\\,\\text{kg}', erklaerung: 'Verdunstet beim Trocknen und hinterlässt Poren.' },
            { titel: '4. Porosität (Breivolumen konstant angenommen)', formel: 'V_{Brei} = \\frac{10}{2{,}63} + 7{,}0 = 10{,}8\\,\\text{l};\\; V_{DH} = \\frac{11{,}86}{2{,}32} = 5{,}11\\,\\text{l};\\; n = \\frac{10{,}8 - 5{,}11}{10{,}8} \\approx 53\\,\\%', erklaerung: 'Abbindedehnung vernachlässigt (Lehrannahme).' },
          ]}
          ergebnisHinweis="Rund die Hälfte des erhärteten Gipses ist Porenraum – das erklärt die geringe Festigkeit bei hohem W/G-Wert und die gute Feuchtepufferung."
        />
      </div>

      <ModulTest moduleId="gips" />

      <ModuleFooter wikipedia={[
        { title: 'Gips', url: 'https://de.wikipedia.org/wiki/Gips' },
        { title: 'Gipskarton', url: 'https://de.wikipedia.org/wiki/Gipskarton' },
        { title: 'Calciumsulfat', url: 'https://de.wikipedia.org/wiki/Calciumsulfat' }
      ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Scholz, W. (Begr.); Möhring, R. (Hrsg.): Baustoffkenntnis. Köln: Bundesanzeiger 2016',
          'Bundesverband der Gipsindustrie e. V.: GIPS-Datenbuch'
        ]}
        regelwerke={[
          { title: 'DIN EN 13279-1:2008-11 (Gipsbinder und Gips-Trockenmörtel - Teil 1: Begriffe und Anforderungen)' },
          { title: 'DIN EN 13279-2:2014-03 (Gipsbinder und Gips-Trockenmörtel - Teil 2: Prüfverfahren)' },
          { title: 'DIN EN 520:2009-12 (Gipsplatten - Begriffe, Anforderungen und Prüfverfahren)' },
          { title: 'DIN 18180:2014-09 (Gipsplatten - Arten und Anforderungen)' },
          { title: 'DIN 18181:2019-04 (Gipsplatten im Hochbau - Verarbeitung)' }
        ]}
        formeln={[
          {
            formel: 'CaSO_4 \\cdot 2H_2O \\xrightarrow{120^{\\circ}\\text{C}-180^{\\circ}\\text{C}} CaSO_4 \\cdot \\frac{1}{2}H_2O + 1{,}5 H_2O \\uparrow',
            erklaerung: 'Brennen von Naturgips oder REA-Gips (Dihydrat) zu Stuckgips (Halbhydrat). Dieser Prozess entzieht dem Material 75 % seines Kristallwassers.',
            quelle: 'DIN EN 13279-1:2008-11'
          },
          {
            formel: 'CaSO_4 \\cdot \\frac{1}{2}H_2O + 1{,}5 H_2O \\rightarrow CaSO_4 \\cdot 2H_2O',
            erklaerung: 'Rehydratation (Abbinden) des Gipses. Stuckgips nimmt beim Anmachen wieder Wasser auf, kristallisiert zu ineinander verfilzten Dihydrat-Nadeln aus und dehnt sich dabei leicht aus (etwa 0,1–1 %).',
            quelle: 'Wendehorst Baustoffkunde'
          },
          {
            formel: '3CaO \\cdot Al_2O_3 + 3(CaSO_4 \\cdot 2H_2O) + 26H_2O \\rightarrow 3CaO \\cdot Al_2O_3 \\cdot 3CaSO_4 \\cdot 32H_2O',
            erklaerung: 'Das zerstörende Ettringittreiben ("Zement-Gips-Katastrophe"): Tricalciumaluminat des Zements reagiert mit dem Gips-Sulfat und Wasser unter drastischer Volumenzunahme (Bildung von nadelförmigem Ettringit mit extrem viel Kristallwasser), was zur Sprengung des Gefüges führt.',
            quelle: 'Baustoffkenntnis (2016)'
          }
        ]}
      />
    </div>
  );
}
