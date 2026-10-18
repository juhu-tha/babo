import React, { useState } from 'react';
import { 
  Factory, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  MapPin, 
  Search, 
  Coins, 
  RotateCcw, 
  Building2, 
  Flame, 
  FileText, 
  Layers, 
  HelpCircle,
  TrendingDown,
  Info,
  Database,
  Leaf,
  Calculator
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

// Define the Tabs
type SubTab = 'overview' | 'sources';

export default function BpBaustoffindustrie() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview');

  return (
    <div className="flex flex-col gap-8">
      {/* Tab Navigation header */}
      <div className="flex flex-col gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-home-grau/30 flex flex-wrap justify-center sm:justify-start gap-2">
          <button 
            onClick={() => setActiveSubTab('overview')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'overview' ? 'bg-shiraz text-white shadow-sm' : 'bg-slate-50 border border-home-grau/25 hover:border-shiraz text-text-main'}`}
          >
            <Factory size={16} /> Marktdynamik &amp; Segmente
          </button>
          
          <button 
            onClick={() => setActiveSubTab('sources')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'sources' ? 'bg-shiraz text-white shadow-sm' : 'bg-slate-50 border border-home-grau/25 hover:border-shiraz text-text-main'}`}
          >
            <FileText size={16} /> Fachquellen
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <Factory className="text-shiraz" size={24} />
            <div>
              <h2 className="text-xl font-bold text-text-main">Die deutsche Baustoff- &amp; Steine-Erden-Industrie</h2>
              <p className="text-xs text-text-main/60">Makroökonomische Einordnung, globale Dynamiken und morphologische Gliederung</p>
            </div>
          </div>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed space-y-3">
            <p>
              Die deutsche Baustoff- und Steine-Erden-Industrie bildet das unersetzbare Fundament der Bauwirtschaft und der gesamten materiellen Wertschöpfungskette. Als primärer Lieferant von mineralischen Baurohstoffen, veredelten Bindemitteln (Zement, Kalk, Gips) und werksseitig gefertigten Konstruktionskomponenten speist sie Hoch-, Tief- und Ausbaubauwerke kontinuierlich mit Substanz.
            </p>
            <p className="text-xs italic text-text-main/60 border-t border-home-grau/20 pt-2">
              <strong>Entscheidendes Strukturmerkmal:</strong> Der Sektor ist geprägt von einer markanten strukturellen Morphologie, die durch die physikalischen Gesetzmäßigkeiten der Logistikkosten gegliedert ist (Geringer spezifischer Wert bei extrem hohem Eigengewicht). Dies führt zu einer Zweiteilung des Marktes:
            </p>
          </div>

          {/* Dualistic Anatomy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-200 pb-2">
                  <Globe className="text-slate-600 shrink-0" size={18} />
                  <span>Kategorie A: Kapitalintensive globale Konzerne</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Geprägt durch multinationale Verflechtungen, immense Investitionen in hochdynamische Klinkerdrehöfen oder Gips-Kalzinierungswerkzeuge. Die Transportwege sind überregional bis global, die Produktionsstrukturen zentralisiert.
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-900 block mb-1">Typische Sektoren &amp; Akteure:</span>
                  <p className="text-text-main/70">Zementwerke, Gipsabbau, Bauchemie, Flachglasherstellung. <br /><em>Z.B. Multinationale Bindemittel- &amp; Gips-Konzerne, Bauchemiegiganten, Flachglashersteller.</em></p>
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-4 bg-slate-100 p-1.5 rounded text-center">
                Hoher Investitionsbedarf • Globale ESG-Anforderungen • EU-ETS
              </div>
            </div>

            <div className="bg-amber-50/30 p-5 rounded-xl border border-amber-200/50 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold border-b border-amber-200 pb-2">
                  <MapPin className="text-amber-700 shrink-0" size={18} />
                  <span>Kategorie B: Dezentrale, regionale KMU-Strukturen</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Geprägt durch familiengeführten Mittelstand und dezentrale Sourcing-Konzepte. Das Transportgut hat ein hohes Gewicht bei gleichzeitig geringem relativen Warenwert, wodurch Lieferradien wirtschaftlich stark limitiert sind (Klassisch &lt; 35-50 km).
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-amber-100 text-xs">
                  <span className="font-semibold text-amber-900 block mb-1">Typische Sektoren &amp; Akteure:</span>
                  <p className="text-text-main/70">Kieswerke, Steinbrüche, Ziegelbrennereien, lokale Fertigteilwerke. <br /><em>Z.B. Regionale Kies- und Transportbetonbetriebe, inhabergeführte Steinbrüche, Ziegelbrennereien und regionale Mörtelwerke.</em></p>
                </div>
              </div>
              <div className="text-[11px] font-mono text-amber-700 mt-4 bg-amber-100/40 p-1.5 rounded text-center">
                Regionale Logistik • Rohstoffsicherung vor Ort • Transportkosten-Deckelung
              </div>
            </div>
          </div>

          {/* Macroeconomic indicators and production value table */}
          <div className="space-y-4 shadow-3xs p-4 rounded-xl border border-home-grau/25 bg-white">
            <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
              <TrendingUp className="text-shiraz" size={18} />
              Branchenaufteilung &amp; Jährliche Produktionswerte (Deutschlandweit)
            </h3>
            <p className="text-xs text-text-main/70">
              Ein systematischer Überblick des Produktionsvolumens verdeutlicht, dass die mineralischen Erzeugnisse und Betonbauteile den größten Kernbereich ausmachen.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-text-main">
                <thead className="bg-slate-100 text-[11px] font-bold text-text-main/80 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">Branchensegment / Industriezweig</th>
                    <th className="p-3">Hauptprodukte / Output</th>
                    <th className="p-3 text-right">Wirtschaftlicher Lieferradius (LKW-Transport)</th>
                    <th className="p-3 text-right">Produktionswert (Jahr)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">Sand, Kies &amp; Naturstein</td>
                    <td className="p-3 text-text-main/80">Betonzuschläge, Tragschichten für Straßenbau, Quarzmehle</td>
                    <td className="p-3 text-right text-amber-700 font-medium">Lokal (~35 km)</td>
                    <td className="p-3 text-right font-mono font-bold">~ 3,5 Mrd. €</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">Zement, Kalk &amp; Gips</td>
                    <td className="p-3 text-text-main/80">Hydraulische Bindemittel, REA-Gipsplatten, Bau- und Düngekalke</td>
                    <td className="p-3 text-right text-slate-600 font-medium">Überregional (~150 km)</td>
                    <td className="p-3 text-right font-mono font-bold">~ 4,2 Mrd. €</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">Mörtel, Betonwaren &amp; Fertigteile</td>
                    <td className="p-3 text-text-main/80">Vorgefertigte Deckenelemente, Pflasterklinker, Transportbeton, Klebe-Mörtel</td>
                    <td className="p-3 text-right text-amber-700 font-medium">Regional (~80 km)</td>
                    <td className="p-3 text-right font-mono font-bold">~ 12,8 Mrd. €</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">Ziegel &amp; Grobkeramik</td>
                    <td className="p-3 text-text-main/80">Wandziegel (Poroton), Dachziegel, Sinterziegel, feuerfeste Produkte</td>
                    <td className="p-3 text-right text-slate-600 font-medium">Überregional (~150 km)</td>
                    <td className="p-3 text-right font-mono font-bold">~ 2,1 Mrd. €</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">Naturwerksteine &amp; Schotterkörnungen</td>
                    <td className="p-3 text-text-main/80">Marmorplatten, Granitpflaster, Gleisschotter, frostsichere Packlagen</td>
                    <td className="p-3 text-right text-slate-600 font-medium">Gezielt regional bis national</td>
                    <td className="p-3 text-right font-mono font-bold">~ 1,6 Mrd. €</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">Dämmstoffe &amp; Fasererzeugnisse</td>
                    <td className="p-3 text-text-main/80">Mineralwolle, EPS (Styropor), Holzdämmstoffe, Kalksandsteine</td>
                    <td className="p-3 text-right text-blue-600 font-medium">National / Global</td>
                    <td className="p-3 text-right font-mono font-bold">~ 4,5 Mrd. €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg text-[11.5px] leading-relaxed text-blue-900 mt-2">
              <strong>Zusammenfassende Branchenkennzahlen:</strong> Insgesamt erwirtschaften circa 2.000 Unternehmen mit über 150.000 Mitarbeitern einen konsolidierten Umsatz von über <strong>35 - 38 Milliarden Euro pro Jahr</strong> in Deutschland. Sie beliefern die Bauindustrie mit über 500 Millionen Tonnen mineralischen Rohstoffen pro Jahr.
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: INFORMATION INFRASTRUCTURE / SOURCES */}
      {activeSubTab === 'sources' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 border-b border-home-grau/15 pb-4">
            <FileText className="text-shiraz" size={24} />
            <div>
              <h2 className="text-xl font-bold text-text-main">Digitale Informationsportale &amp; Datenbanken</h2>
              <p className="text-xs text-text-main/60">Verifizierte Recherche-Schnittstellen für exakte Branchenanalysen im Bauwesen</p>
            </div>
          </div>

          <p className="text-sm text-text-main/80 leading-relaxed">
            Für wissenschaftliche Arbeiten, Marktbeobachtungen oder Seminarentwürfe an der Hochschule können Studierende und Ingenieure auf die folgenden realen Recherchedatenbanken und statistischen Register zugreifen:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Database size={16} className="text-slate-700" /> Destatis GENESIS (Statistisches Bundesamt)
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Bietet monatlich aktualisierte Daten zu Inlandsproduktionswerten, Energie- und Personalkosten und Beschäftigtenzahlen der Nichtmetallisch-Mineralischen Baustoffindustrie unter dem WZ-Schlüssel 23.
                </p>
              </div>
              <a 
                href="https://www.destatis.de" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center text-xs font-bold text-shiraz hover:underline"
              >
                Zur GENESIS-Datenbank ↗
              </a>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <TrendingDown size={16} className="text-slate-700" /> ifo Institut für Wirtschaftsforschung
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Veröffentlicht das monatliche "ifo Konjunktur- &amp; Branchenklima" für den Wohnungs- und Tiefbau. Ein anerkannter Seismograf für Stornierungswellen, Zinsüberlastungen und betriebliche Produktionshemmnisse.
                </p>
              </div>
              <a 
                href="https://www.ifo.de" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center text-xs font-bold text-shiraz hover:underline"
              >
                Zu den ifo-Konjunkturindikatoren ↗
              </a>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-slate-700" /> Lobbyregister des Deutschen Bundestages
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Offenes, staatliches Register zur transparenten Offenlegung politischer Interessenvertreter. Hier lassen sich die finanziellen Aufwendungen und inhaltlichen Positionspapiere des Bundesverbands Baustoffe - Steine und Erden (bbs) exakt zurückverfolgen.
                </p>
              </div>
              <a 
                href="https://www.lobbyregister.bundestag.de" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center text-xs font-bold text-shiraz hover:underline"
              >
                Zum Lobbyregister des Bundes ↗
              </a>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Layers size={16} className="text-slate-700" /> ECONIS - Fachdatenbank Wirtschaftswissenschaften
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Betrieben durch die ZBW (Leibniz-Informationszentrum Wirtschaft). Hervorragende Recherchequelle für wissenschaftliche Literatur, Dissertationen und Fachmonografien im Bereich der Energiewende in Baustoffbranchen.
                </p>
              </div>
              <a 
                href="https://www.zbw.eu/de/befrachtung/econis" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center text-xs font-bold text-shiraz hover:underline"
              >
                Zur ZBW ECONIS-Suche ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Module Footer standard integration */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Baustoff', url: 'https://de.wikipedia.org/wiki/Baustoff' },
          { title: 'Klinker', url: 'https://de.wikipedia.org/wiki/Zementklinker' },
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' }
        ]}
        weblinks={[
          { title: 'Bundesverband Baustoffe - Steine und Erden (bbs)', url: 'https://www.baustoffindustrie.de' },
          { title: 'Bayerischer Industrieverband Baustoffe, Steine und Erden e.V. (BIV)', url: 'https://www.biv.de' }
        ]}
        literatur={[
          'Bundesverband Baustoffe - Steine und Erden (bbs): Rohstoffbericht der deutschen Baustoffindustrie (Berlin)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'Bundesberggesetz (BBergG: Gewinnung von Bodenschätzen)', url: 'https://www.gesetze-im-internet.de/bbergg/' },
          { title: 'Bundes-Immissionsschutzgesetz (BImSchG)', url: 'https://www.gesetze-im-internet.de/bimschg/' },
          { title: 'DIN EN 197-1 (Zement: Zusammensetzung und Konformität)', url: 'https://www.dinmedia.de/' }
        ]}
        formeln={[
          {
            formel: 'K_{\\text{trans}} = K_{\\text{fix}} + d_{\\text{dist}} \\cdot k_{\\text{var}} \\quad [\\text{€/t}], \\quad R_{\\text{max}} = \\frac{P_{\\text{Markt}} - K_{\\text{prod}} - K_{\\text{fix}}}{k_{\\text{var}}}',
            erklaerung: 'Transportkostenmodellierung und maximaler wirtschaftlicher Lieferradius Rmax von mineralischen Massenbaustoffen in Abhängigkeit von Marktpreis, Produktionskosten und entfernungsabhängigen Speditionskosten.',
            quelle: 'Baustoff-Ökonomie & Logistik'
          }
        ]}
      />
    </div>
  );
}
