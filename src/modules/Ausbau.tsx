import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { PaintRoller, Layers, Droplets, Grid, Hammer, Box } from 'lucide-react';

export default function Ausbau() {
  const [activeTab, setActiveTab] = useState<'trockenbau' | 'anstrich' | 'abdichtung' | 'keramik' | 'estriche' | 'kleben'>('trockenbau');

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'trockenbau' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('trockenbau')}
        >
          <Layers size={16} /> Trockenbau
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'estriche' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('estriche')}
        >
          <Box size={16} /> Estriche &amp; Böden
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'keramik' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('keramik')}
        >
          <Grid size={16} /> Keramik &amp; Fliesen
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'anstrich' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('anstrich')}
        >
          <PaintRoller size={16} /> Anstrichsysteme
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'abdichtung' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('abdichtung')}
        >
          <Droplets size={16} /> Abdichtungen
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'kleben' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('kleben')}
        >
          <Hammer size={16} /> Kleben
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        {activeTab === 'trockenbau' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          Trockenbau
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der Trockenbau umfasst raumbegrenzende, aber meist nicht tragende Bauteile, die in trockener Bauweise montiert werden. Er zeichnet sich durch schnelle Montage, geringes Gewicht und Flexibilität aus.
          </p>
        </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Gipskartonplatten (GKB)</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Bestehen aus einem Gipskern, der beidseitig mit Kartonagen ummantelt ist. Der Karton übernimmt die Zugkräfte, der Gips die Druckkräfte.
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li><strong>Standard (GKB):</strong> Für normale Innenräume.</li>
                  <li><strong>Imprägniert (GKBI):</strong> Für Feuchträume (grüner Karton).</li>
                  <li><strong>Feuerschutz (GKF):</strong> Mit Glasfasern armierter Kern für besseren Brandschutz.</li>
                </ul>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Gipsfaserplatten</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Bestehen aus einem Gemisch aus Gips und Zellulosefasern (Altpapier). Sie benötigen keine Kartonummantelung.
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li>Höhere mechanische Festigkeit als Gipskarton.</li>
                  <li>Besserer Schallschutz durch höhere Rohdichte.</li>
                  <li>Von Natur aus feuchteresistenter und brandhemmender.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'estriche' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text-main">Estriche & Böden</h2>
            <p className="text-text-main/80">
              Estriche dienen als Untergrund für Fußbodenbeläge, zur Lastverteilung, zur Wärmedämmung oder zum Erreichen einer vorgegebenen Höhenlage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Zementestrich (CT)</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Der am häufigsten verwendete Estrich. Besteht aus Zement, Gesteinskörnung und Wasser.
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li>Unempfindlich gegen Feuchtigkeit (auch für außen geeignet).</li>
                  <li>Hohe Festigkeit.</li>
                  <li>Neigt zum Schwinden (Fugen erforderlich).</li>
                  <li>Lange Trocknungszeit (Belegreife).</li>
                </ul>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Calciumsulfatestrich (CA)</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Bindemittel ist Calciumsulfat (Anhydrit). Wird oft als Fließestrich (CAF) eingebracht.
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li>Sehr schwindarm (große fugenlose Flächen möglich).</li>
                  <li>Gute Wärmeleitfähigkeit (ideal für Fußbodenheizungen).</li>
                  <li><strong>Empfindlich gegen Feuchtigkeit</strong> (nicht für Nassräume).</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold text-text-main mt-4 border-t border-home-grau/30 pt-6">Bodenbeläge</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-shiraz text-lg mb-2">Parkett & Laminat</h4>
                <p className="text-sm text-text-main/80 mb-3">
                  Holzbasierte Beläge. Parkett besteht aus Echtholz (massiv oder mehrschichtig), Laminat aus einer HDF-Trägerplatte mit Dekorschicht.
                </p>
                <div className="text-sm text-text-main/70">
                  <strong>Verlegung:</strong> Schwimmend (mit Trittschalldämmung) oder vollflächig verklebt (besser für Fußbodenheizung).
                </div>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-shiraz text-lg mb-2">Elastische Beläge</h4>
                <p className="text-sm text-text-main/80 mb-3">
                  Dazu gehören PVC (Polyvinylchlorid), Linoleum (Naturprodukt aus oxidiertem Leinöl, Harzen, Holz- und/oder Korkmehl und Kalksteinmehl auf Jutegewebe) und Kautschuk.
                </p>
                <div className="text-sm text-text-main/70">
                  <strong>Eigenschaften:</strong> Trittschalldämmend, fußwarm, pflegeleicht. Linoleum ist ökologisch vorteilhaft.
                </div>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-shiraz text-lg mb-2">Textile Beläge</h4>
                <p className="text-sm text-text-main/80 mb-3">
                  Teppichböden aus synthetischen Fasern (Polyamid, Polypropylen) oder Naturfasern (Schurwolle).
                </p>
                <div className="text-sm text-text-main/70">
                  <strong>Eigenschaften:</strong> Sehr gute Schallabsorption, staubbindend, hoher Gehkomfort.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keramik' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text-main">Keramik & Fliesen</h2>
            <p className="text-text-main/80">
              Keramische Fliesen und Platten werden aus tonigen Rohstoffen geformt und gebrannt. Sie unterscheiden sich primär durch ihre Wasseraufnahme.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Steingut</h3>
                <div className="text-xs font-bold text-home-grau uppercase mb-2">Wasseraufnahme &gt; 10%</div>
                <p className="text-sm text-text-main/80">
                  Poröser Scherben. Leicht zu schneiden und zu bohren. Geringe mechanische Festigkeit. <strong>Nicht frostsicher</strong>. Wird ausschließlich als Wandfliese im Innenbereich verwendet.
                </p>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Steinzeug</h3>
                <div className="text-xs font-bold text-home-grau uppercase mb-2">Wasseraufnahme &lt; 3%</div>
                <p className="text-sm text-text-main/80">
                  Dicht gesinterter Scherben. Hohe mechanische Festigkeit und Verschleißfestigkeit. Frostsicher. Als Boden- und Wandfliese im Innen- und Außenbereich einsetzbar.
                </p>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Feinsteinzeug</h3>
                <div className="text-xs font-bold text-home-grau uppercase mb-2">Wasseraufnahme &lt; 0,5%</div>
                <p className="text-sm text-text-main/80">
                  Sehr dicht gesintert. Extrem niedrige Wasseraufnahme, sehr hohe Festigkeit und Abriebfestigkeit. Frostsicher. Für stark beanspruchte Böden (auch gewerblich).
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'anstrich' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text-main">Anstrichsysteme</h2>
            <p className="text-text-main/80">
              Anstriche dienen dem Schutz (z.B. vor Witterung, Korrosion) und der optischen Gestaltung von Oberflächen. Sie bestehen aus Bindemitteln, Pigmenten, Füllstoffen und Löse- bzw. Verdünnungsmitteln.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Dispersionsfarben</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Bindemittel (Kunstharze) sind als feine Tröpfchen in Wasser dispergiert. Trocknen durch Verdunstung des Wassers (Filmbildung).
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li>Meistverwendete Innenwandfarbe.</li>
                  <li>Wasserverdünnbar, geruchsarm.</li>
                  <li>Bildet einen Film auf der Oberfläche.</li>
                </ul>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Silikatfarben (Mineralfarben)</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Bindemittel ist Kaliwasserglas. Trocknen durch chemische Reaktion (Verkieselung) mit mineralischen Untergründen.
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li>Verbinden sich unlösbar mit dem Untergrund.</li>
                  <li>Sehr diffusionsoffen (atmungsaktiv).</li>
                  <li>Natürlich alkalisch (schimmelhemmend).</li>
                  <li>Nur auf mineralischen Untergründen (Putz, Beton) anwendbar.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'abdichtung' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text-main">Abdichtungen</h2>
            <p className="text-text-main/80">
              Bauwerksabdichtungen schützen das Gebäude vor eindringendem Wasser (Bodenfeuchte, Sickerwasser, drückendes Wasser) und Feuchtigkeit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Bituminöse Abdichtungen</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Bitumen wird als Rückstand der Vakuumdestillation von Erdöl gewonnen. Es ist wasserabweisend und thermoplastisch. Es ist wasserabweisend und thermoplastisch.
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li><strong>Bitumenbahnen:</strong> Werden geflämmt oder geklebt (z.B. Flachdach, Keller).</li>
                  <li><strong>PMBC (Polymerbitumendickbeschichtung):</strong> Spachtelbare Masse für erdberührte Bauteile. Nahtlose Abdichtung.</li>
                </ul>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Kunststoff- und Elastomerbahnen</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Hochpolymere Bahnen (z.B. PVC, FPO, EPDM).
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li>Meist einlagige Verlegung (Flachdach).</li>
                  <li>Verbindung durch Heißluftschweißen oder Quellschweißen.</li>
                  <li>Sehr flexibel und witterungsbeständig.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kleben' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-text-main">Kleben & Schäumen im Bauwesen</h2>
            <p className="text-text-main/80">
              Kleben ist ein stoffschlüssiges Fügeverfahren. Es ermöglicht die flächige Kraftübertragung und die Verbindung unterschiedlicher Materialien, ohne diese zu schwächen (wie beim Bohren). Bauschäume dienen zum Füllen, Dämmen und Fixieren.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Dispersionsklebstoffe</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Bindemittel in Wasser dispergiert. Abbinden durch Verdunstung des Wassers.
                </p>
                <div className="text-sm text-text-main/70">
                  <strong>Einsatz:</strong> Bodenbeläge (PVC, Teppich), Holzleim (Weißleim). Mindestens ein Fügeteil muss saugfähig sein.
                </div>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Reaktionsharzklebstoffe</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Abbinden durch chemische Reaktion (Polymerisation, Polyaddition). 1- oder 2-komponentig (z.B. Epoxidharz, Polyurethan).
                </p>
                <div className="text-sm text-text-main/70">
                  <strong>Einsatz:</strong> Hochfeste Verbindungen, strukturelles Kleben (z.B. CFK-Lamellen auf Beton), Metalle, dichte Untergründe.
                </div>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Zementäre Kleber</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Hydraulisch abbindend (Zement + Wasser). Oft kunststoffvergütet (Flexkleber).
                </p>
                <div className="text-sm text-text-main/70">
                  <strong>Einsatz:</strong> Fliesenkleber, Naturstein, WDVS-Platten.
                </div>
              </div>
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Bauschaum (Montageschaum)</h3>
                <p className="text-sm text-text-main/80 mb-3">
                  Meist Polyurethan (PU-Schaum). Expandiert nach dem Austritt und härtet durch Reaktion mit Luftfeuchtigkeit (1-K) oder durch einen Härter (2-K) aus.
                </p>
                <ul className="list-disc list-inside text-sm text-text-main/70">
                  <li><strong>1-K-Schaum:</strong> Benötigt Feuchtigkeit zum Aushärten (Untergrund anfeuchten).</li>
                  <li><strong>2-K-Schaum:</strong> Härtet unabhängig von Feuchtigkeit sehr schnell und fest aus.</li>
                  <li><strong>Einsatz:</strong> Fenster- und Türenmontage (Fixieren, Dämmen), Füllen von Hohlräumen.</li>
                  <li><strong>Achtung:</strong> Nicht UV-beständig, muss abgedeckt werden.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Trockenbau', url: 'https://de.wikipedia.org/wiki/Trockenbau' },
          { title: 'Estrich', url: 'https://de.wikipedia.org/wiki/Estrich' },
          { title: 'Fliese', url: 'https://de.wikipedia.org/wiki/Fliese' },
          { title: 'Bauschäumen', url: 'https://de.wikipedia.org/wiki/Montageschaum' }
        ]}
        literatur={[
          'Frössel, F. (2019): Handbuch Ausbau und Innensanierung (Fraunhofer IRB Verlag)',
          'Sopran, H. (2021): Handbuch Estrichbau: Konstruktion, Beläge und Schäden (Rudolf Müller Verlag)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN 18560 (Estriche im Bauwesen - Teile 1 bis 7)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+18560' },
          { title: 'DIN 18157-1 bis -3 (Ausführung von Bekleidungen und Belägen im Dünnbettverfahren; Teil 1: hydraulisch erhärtende Dünnbettmörtel, Teil 2: Dispersionsklebstoffe, Teil 3: Reaktionsharzklebstoffe)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+18157-1' },
          { title: 'DIN 18202 (Toleranzen im Hochbau - Bauwerke)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+18202' }
        ]}
        formeln={[
          {
            formel: '\\Delta L = L_0 \\cdot \\alpha_T \\cdot \\Delta T + L_0 \\cdot \\varepsilon_{cs}',
            erklaerung: 'Längenänderung eines Estrichfeldes durch Temperatur- und Schwindverformung zur Bestimmung der notwendigen Fugenabstände (z.B. … zur Bestimmung der notwendigen Fugenabstände (Richtwerte für Heizestriche: Felder max. ca. 40 m², Seitenlänge max. 8 m, Seitenverhältnis ≤ 1:2 nach DIN EN 1264-4 bzw. Schnittstellenkoordination; Fugenplan durch den Planer). Quelle: DIN EN 1264-4 / BEB).',
            quelle: 'DIN 18560 / BEB'
          },
          {
            formel: 'f_{\\text{ct,Haft}} = \\frac{F_{\\text{Bruch}}}{A_{\\text{Prüf}}} \\ge 1{,}0\\,\\text{N/mm}^2 \\quad (\\text{Klasse C2})',
            erklaerung: 'Haftzugfestigkeit von zementärem Fliesenkleber nach DIN EN 12004 bei Abreißversuchen auf Betonuntergrund.',
            quelle: 'DIN EN 12004'
          }
        ]}
      />
    </div>
  );
} 