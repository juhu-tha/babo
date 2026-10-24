import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { Mountain, Layers, Pickaxe, Activity, Grip, BookOpen } from 'lucide-react';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

export default function Gesteine() {
  const [activeTab, setActiveTab] = useState<'arten' | 'eigenschaften' | 'kennwerte' | 'koernungen' | 'steckbrief'>('steckbrief');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Mountain className="text-shiraz" /> Gesteine
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Gesteinskörnungen bilden das tragende Gerüst von Beton und Asphalt. Dieses Modul vermittelt Grundlagen über Entstehung, Gewinnung, Sieblinien und bautechnische Prüfungen.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button aria-pressed={activeTab === 'steckbrief'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Baustoff-Steckbrief
          </button>
          <button aria-pressed={activeTab === 'arten'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'arten' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('arten')}
          >
            <Layers size={16} /> Gesteinsarten &amp; Entstehung
          </button>
          <button aria-pressed={activeTab === 'eigenschaften'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'eigenschaften' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('eigenschaften')}
          >
            <Pickaxe size={16} /> Eigenschaften &amp; Anwendung
          </button>
          <button aria-pressed={activeTab === 'kennwerte'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'kennwerte' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('kennwerte')}
          >
            <Activity size={16} /> Technische Kennwerte &amp; Prüfung
          </button>
          <button aria-pressed={activeTab === 'koernungen'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'koernungen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('koernungen')}
          >
            <Grip size={16} /> Gesteinskörnungen
          </button>
        </div>

        {activeTab === 'arten' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Gesteine werden nach ihrer Entstehung (Genese) in drei Hauptgruppen unterteilt: Magmatite, Sedimentite und Metamorphite. Dieser Kreislauf der Gesteine ist ein ständiger geologischer Prozess.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Magmatite (Erstarrungsgesteine)</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Entstehen durch Abkühlung und Erstarrung von Magma (unterirdisch) oder Lava (oberirdisch).
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li><strong>Tiefengesteine (Plutonite):</strong> Langsame Abkühlung, große Kristalle. Bsp: Granit, Diorit.</li>
                  <li><strong>Ergussgesteine (Vulkanite):</strong> Schnelle Abkühlung an der Oberfläche, feinkörnig. Bsp: Basalt, Bims.</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Sedimentite (Ablagerungsgesteine)</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Entstehen durch Verwitterung, Transport, Ablagerung und anschließende Verfestigung (Diagenese).
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li><strong>Klastisch:</strong> Aus Gesteinstrümmern (Sandstein, Konglomerat).</li>
                  <li><strong>Chemisch:</strong> Durch Ausfällung (Kalkstein, Gips, Steinsalz).</li>
                  <li><strong>Biogen:</strong> Aus organischen Resten (Kreide, Kohle).</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Metamorphite (Umwandlungsgesteine)</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Entstehen aus älteren Gesteinen durch hohen Druck und/oder hohe Temperaturen tief in der Erdkruste, ohne aufzuschmelzen.
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                  <li><strong>Aus Kalkstein:</strong> Marmor.</li>
                  <li><strong>Aus Sandstein:</strong> Quarzit.</li>
                  <li><strong>Aus Tonstein:</strong> Tonschiefer, bei stärkerer Metamorphose Glimmerschiefer bzw. Paragneis.</li>
                  <li><strong>Aus Granit:</strong> Orthogneis.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'eigenschaften' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Die physikalischen und mechanischen Eigenschaften von Gesteinen bestimmen deren Eignung als Baustoff, sei es als Naturwerkstein (Fassaden, Böden) oder als Gesteinskörnung für Beton und Asphalt.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Wichtige Eigenschaften</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Druckfestigkeit:</strong> Sehr hoch bei Granit und Basalt, geringer bei weichen Kalksteinen oder Tuffen.</li>
                  <li><strong>Rohdichte / Porosität:</strong> Bestimmt das Gewicht und die Wasseraufnahme. Hohe Porosität (z.B. Sandstein) bedeutet oft geringere Frostbeständigkeit.</li>
                  <li><strong>Verschleißwiderstand:</strong> Wichtig für Bodenbeläge und Straßenbau (z.B. Polierwiderstand bei Asphalt).</li>
                  <li><strong>Witterungsbeständigkeit:</strong> Widerstand gegen Frost-Tau-Wechsel, UV-Strahlung und chemische Angriffe (z.B. saurer Regen greift Kalkstein an).</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Anwendungsbereiche</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Granit:</strong> Pflastersteine, Bordsteine, hochbelastete Bodenbeläge, Fassaden (sehr witterungsbeständig).</li>
                  <li><strong>Basalt:</strong> Schotter für Gleisbau, Edelsplitt für Asphaltdeckschichten (hoher Verschleißwiderstand).</li>
                  <li><strong>Kalkstein / Marmor:</strong> Innenraumgestaltung (Böden, Treppen), Fassaden (nicht säurebeständig!). Rohstoff für Zementherstellung.</li>
                  <li><strong>Sandstein:</strong> Historische Bauten, Fassaden, Bildhauerarbeiten (gut bearbeitbar, aber oft porös).</li>
                  <li><strong>Schiefer:</strong> Dacheindeckungen, Fassadenbekleidungen (gute Spaltbarkeit).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kennwerte' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Für die Verwendung von Gesteinskörnungen in Beton oder Asphalt müssen spezifische technische Kennwerte durch genormte Prüfverfahren nachgewiesen werden.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Korngröße & Kornform</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Korngrößenverteilung (Sieblinie):</strong> Bestimmt durch Siebversuch (DIN EN 933-1). Wichtig für die Packungsdichte und den Hohlraumgehalt des Baustoffs.</li>
                  <li><strong>Kornformkennzahl (SI):</strong> Massenanteil der Körner mit einem Verhältnis Länge/Dicke &gt; 3 (DIN EN 933-4). Kubische Körner sind bevorzugt, da plattige Körner (hoher SI-Wert) die Verarbeitbarkeit verschlechtern und leichter brechen.</li>
                  <li><strong>Plattigkeitskennzahl (FI):</strong> Alternativer Kennwert für den Anteil flacher Körner, bestimmt mit Stabsieben (DIN EN 933-3).</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Festigkeit & Verschleiß</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Los-Angeles-Koeffizient (LA):</strong> Maß für den Widerstand gegen Zertrümmerung (DIN EN 1097-2). Gestein wird mit Stahlkugeln in einer Trommel rotiert; der Abrieb wird gemessen.</li>
                  <li><strong>Micro-Deval-Wert (MDE):</strong> Maß für den Verschleißwiderstand unter Zugabe von Wasser (DIN EN 1097-1). Simuliert die Beanspruchung im feuchten Zustand.</li>
                  <li><strong>Polierwiderstand (PSV):</strong> Polished Stone Value (DIN EN 1097-8). Wichtig für Deckschichten im Straßenbau, um dauerhafte Griffigkeit zu gewährleisten.</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Dauerhaftigkeit</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Frostwiderstand:</strong> Prüfung durch Frost-Tau-Wechsel an wassergesättigten Körnern (DIN EN 1367-1). Gemessen wird der Masseverlust durch Absplitterungen.</li>
                  <li><strong>Frost-Tausalz-Widerstand:</strong> Verschärfte Prüfung unter Zugabe von Tausalzlösung (z.B. NaCl), da Salze den osmotischen Druck in den Poren erhöhen.</li>
                  <li><strong>Alkali-Kieselsäure-Reaktivität (AKR):</strong> Prüfung, ob amorphe Kieselsäure im Gestein mit den Alkalien des Zements reagiert und ein quellfähiges Gel bildet (Betontreiben).</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Dichte & Wasseraufnahme</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Rohdichte (Scheinbare Dichte):</strong> Dichte des Gesteinskorns inklusive der geschlossenen und offenen Poren (DIN EN 1097-6).</li>
                  <li><strong>Wasseraufnahme (WA):</strong> Masse des aufgenommenen Wassers im Verhältnis zur Trockenmasse (DIN EN 1097-6). Ein Indikator für die offene Porosität und oft korrelierend mit dem Frostwiderstand.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'koernungen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Gesteinskörnungen (früher Zuschlag) bilden das Gerüst in Baustoffen wie Beton, Mörtel und Asphalt. Ihre Eigenschaften wie Kornzusammensetzung, Festigkeit und Dauerhaftigkeit sind maßgeblich für die Qualität des Endprodukts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Kornklassen & Bezeichnungen</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Gesteinsmehl (Füller):</strong> Korngröße d ≤ 0,063 mm. Dient zum Verschließen von Hohlräumen, besonders wichtig bei Asphalt.</li>
                  <li><strong>Feine Gesteinskörnung (Sand):</strong> Obere Siebgröße D ≤ 4 mm (DIN EN 12620). Unterteilt in Fein-, Mittel- und Grobsand.</li>
                  <li><strong>Kies / Splitt (grobe Gesteinskörnung):</strong> Obere Siebgröße D ≥ 4 mm, untere d ≥ 2 mm (DIN EN 12620). Kies (rund) entsteht natürlich, Splitt (kantig) durch Brechen.</li>
                  <li><strong>Korngemisch:</strong> Eine Mischung verschiedener Kornklassen, angegeben als untere (d) und obere (D) Siebgröße, z.B. 0/32 für Beton.</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Sieblinien (Kornzusammensetzung)</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Idealsieblinien (Fuller, EMPA):</strong> Mathematische Kurven für das theoretische Dichteste Gefüge (minimaler Hohlraumgehalt).</li>
                  <li><strong>Regelsieblinien (DIN 1045-2):</strong> Grenzsieblinien A, B, C (und U für Ausfallkörnung) für Beton; Anhang manuell prüfen.
                    <br />- <strong>A-Linie:</strong> gröberes Gemisch, wenig Feinkorn. Der günstige Bereich liegt zwischen A und B.
                    <br />- <strong>B-Linie:</strong> mittleres Gemisch (Standard).
                    <br />- <strong>C-Linie:</strong> feineres Gemisch, gut pumpbar, aber höherer Zementleim- und Wasserbedarf.
                  </li>
                  <li><strong>Ausfallkörnung:</strong> Fehlen bestimmter mittlerer Kornklassen zur gezielten Verbesserung der Verarbeitbarkeit (Gap-Grading).</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Herstellungsarten</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Natürliche Gesteinskörnung (Kies/Sand):</strong> Rundkorn, gefördert aus Gruben oder Flussbetten. Bessere Verarbeitbarkeit im Beton.</li>
                  <li><strong>Gebrochene Gesteinskörnung (Splitt/Brechsand):</strong> Durch Zerkleinern im Brecher (z.B. aus Granit, Basalt, Kalkstein). Hohe innere Reibung, wichtig für den Straßen- und Asphaltbau.</li>
                  <li><strong>Rezyklierte Gesteinskörnung (RC):</strong> Aus aufbereitetem Bauschutt (Beton, Mauerwerk).</li>
                  <li><strong>Künstliche Gesteinskörnung:</strong> Z.B. Blähton, Blähglas (für Leichtbeton) oder industrielle Nebenprodukte (Hochofenschlacke).</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Spezifische Anforderungen</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><strong>Beton:</strong> Geringer Hohlraumgehalt (gute Sieblinie), keine abschlämmbaren oder organischen Bestandteile (behindern Hydratation), frostbeständig, keine reaktive Kieselsäure (AKR).</li>
                  <li><strong>Asphalt:</strong> Hoher PSV-Wert (Polierwiderstand) in Deckschichten für Griffigkeit, kantige Form (Splitt) für stabile Hohlraumstruktur und Standfestigkeit, Affinität zu Bitumen.</li>
                  <li><strong>Eisenbahnschotter:</strong> Höchste Zähigkeit (LA-Wert) und kantige Form (Korngemisch 31,5/63).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="gesteine" />
          </div>
        )}
      </div>

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Körnungsziffer der Regelsieblinie B16"
        zielGleichung="k = \frac{1}{100} \sum R_i"
        normQuelle="Sieblinie B16 nach DIN 1045-2 (Werte manuell prüfen); Siebsatz 0,25 bis 63 mm"
        schritte={[
          { titel: '1. Durchgänge B16', formel: '0{,}25: 8\\,\\%;\\; 0{,}5: 20\\,\\%;\\; 1: 32\\,\\%;\\; 2: 42\\,\\%;\\; 4: 56\\,\\%;\\; 8: 76\\,\\%;\\; 16: 100\\,\\%', erklaerung: 'Siebdurchgänge in M.-%.' },
          { titel: '2. Rückstände', formel: 'R_i = 100 - D_i:\\; 92 + 80 + 68 + 58 + 44 + 24 + 0 + 0 + 0 = 366', erklaerung: 'Neun Prüfsiebe von 0,25 bis 63 mm.' },
          { titel: '3. Körnungsziffer', formel: 'k = 366/100 = 3{,}66', erklaerung: 'Je kleiner k, desto feiner das Gemisch und desto höher der Wasseranspruch.' },
        ]}
        ergebnisHinweis="k(B16) ≈ 3,66 – zum Vergleich: A16 gröber (k größer), C16 feiner (k kleiner)."
      />

      <ModulTest moduleId="gesteine" />

      <ModuleFooter wikipedia={[
        { title: 'Gestein', url: 'https://de.wikipedia.org/wiki/Gestein' },
        { title: 'Gesteinskörnung', url: 'https://de.wikipedia.org/wiki/Gesteinsk%C3%B6rnung' }
      ]}
        literatur={[
          'Deutscher Naturwerkstein-Verband (DNV): Bautechnische Informationen Naturwerkstein (BTI), Einzelhefte in der jeweils aktuellen Ausgabe (Bezug: dnv.online/shop)',
          'Wendehorst Baustoffkunde, 27. Auflage, Vieweg+Teubner 2011',
          'Scholz, W. (Begr.); Möhring, R. (Hrsg.): Baustoffkenntnis. Köln: Bundesanzeiger 2016'
        ]}
        regelwerke={[
          { title: 'DIN EN 12620:2008-07 (Gesteinskörnungen für Beton)' },
          { title: 'DIN EN 13139:2002-08 (Gesteinskörnungen für Mörtel)' },
          { title: 'DIN EN 13043:2002-12 (Gesteinskörnungen für Asphalt und Oberflächenbehandlungen)' },
          { title: 'DIN EN 1097-2:2020-09 (Prüfverfahren für mechanische und physikalische Eigenschaften von Gesteinskörnungen - Teil 2: Widerstand gegen Zertrümmerung / Los-Angeles-Prüfung)' },
          { title: 'DIN EN 933-1:2012-03 (Prüfverfahren für geometrische Eigenschaften von Gesteinskörnungen - Teil 1: Korngrößenverteilung - Siebverfahren)' },
          { title: 'DIN 4226-101:2017-08 (Rezyklierte Gesteinskörnungen für Beton nach DIN EN 12620)' },
          { title: 'DIN EN 771-6:2015-11 (Festlegungen für Mauersteine - Teil 6: Natursteinmauersteine)' },
          { title: 'DIN EN 12440 (Naturstein – Kriterien für die Bezeichnung)' }
        ]}
        formeln={[
          {
            formel: 'W_a = \\frac{m_{\\text{ges}} - m_d}{m_d} \\cdot 100\\%',
            erklaerung: 'Wasseraufnahme in Massenprozent. Spiegelt die Kapillarität und Offenporigkeit des Natursteins wider, was direkt mit seiner Frost-Tau-Beständigkeit korreliert.',
            quelle: 'DIN EN 13755:2008-08'
          },
          {
            formel: 'P = \\left(1 - \\frac{\\rho_d}{\\rho_s}\\right) \\cdot 100\\%',
            erklaerung: 'Gesamtporosität P in Vol.-%: Verhältnis der Rohdichte ρ_d (trockenes Probenvolumen inkl. Poren) zur Reindichte ρ_s (reines Feststoffvolumen ohne Poren).',
            quelle: 'DIN EN 1936:2007-02'
          },
          {
            formel: 'LA = \\frac{m_0 - m_1}{m_0} \\cdot 100\\%',
            erklaerung: 'Los-Angeles-Koeffizient (Widerstand gegen Zertrümmerung): m0 = Einwaage (5.000 g), m1 = Rückstand auf dem 1,6-mm-Sieb nach der Trommelprüfung.',
            quelle: 'DIN EN 1097-2:2020-09'
          },
          {
            formel: 'P(d) = 100 \\cdot \\left(\\frac{d}{D}\\right)^n',
            erklaerung: 'Fuller-Kurve bzw. modifizierte Körnungsformel nach Fuller-Thompson (ideale Packungsdichte mit minimalem Zementleimbedarf bei n ≈ 0,45 bis 0,50).',
            quelle: 'Fuller und Thompson (1907); Regelsieblinien nach DIN 1045-2:2023-08'
          },
          {
            formel: 'k = \\frac{1}{100} \\sum_{i=1}^{m} R_i',
            erklaerung: 'Körnungsziffer / Feinheitsmodul k nach Hummel bzw. Abrams: Summe der Siebrückstände Ri auf den Prüfsieben geteilt durch 100.',
            quelle: 'Hummel: Das Beton-ABC'
          }
        ]}
      />
    </div>
  );
} 