import React, { useState } from 'react';
import { 
  Factory, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  MapPin, 
  FileText, 
  Layers,
  TrendingDown,
  Database
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

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
              <p className="text-xs text-text-main/60">Wirtschaftliche Einordnung und Gliederung der Branche</p>
            </div>
          </div>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed space-y-3">
            <p>
              Die deutsche Baustoff- und Steine-Erden-Industrie ist die Basis der Bauwirtschaft. Sie liefert mineralische Rohstoffe, Bindemittel (Zement, Kalk, Gips) und vorgefertigte Bauteile für Hoch-, Tief- und Ausbau.
            </p>
            <p className="text-xs italic text-text-main/60 border-t border-home-grau/20 pt-2">
              <strong>Entscheidendes Strukturmerkmal:</strong> Massenbaustoffe haben einen geringen Wert je Tonne bei hohem Gewicht. Die Transportkosten begrenzen daher den Lieferradius. Daraus ergibt sich eine Zweiteilung des Marktes:
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
                  Geprägt durch internationale Konzerne und hohe Investitionen, z. B. in Drehrohröfen für Zementklinker oder Anlagen zur Gipskalzinierung. Die Transportwege sind überregional bis global, die Produktionsstrukturen zentralisiert.
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-900 block mb-1">Typische Sektoren &amp; Akteure:</span>
                  <p className="text-text-main/70">Zementwerke, Gipsabbau, Bauchemie, Flachglasherstellung. <br /><em>Z.B. Multinationale Bindemittel- &amp; Gips-Konzerne, große Bauchemieunternehmen, Flachglashersteller.</em></p>
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
                    <th className="p-3 text-right">Produktionswert (Größenordnung, Lehrwert)</th>
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
                    <td className="p-3 text-text-main/80">Hydraulische Bindemittel, Gipsplatten, Bau- und Düngekalke</td>
                    <td className="p-3 text-right text-slate-600 font-medium">Überregional (~150 km)</td>
                    <td className="p-3 text-right font-mono font-bold">~ 4,2 Mrd. €</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">Mörtel, Betonwaren &amp; Fertigteile</td>
                    <td className="p-3 text-text-main/80">Vorgefertigte Deckenelemente, Betonpflaster, Transportbeton, Werkmörtel</td>
                    <td className="p-3 text-right text-amber-700 font-medium">Regional (~80 km)</td>
                    <td className="p-3 text-right font-mono font-bold">~ 12,8 Mrd. €</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">Ziegel &amp; Grobkeramik</td>
                    <td className="p-3 text-text-main/80">Hochlochziegel, Dachziegel, Klinker, feuerfeste Produkte</td>
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
                    <td className="p-3 text-text-main/80">Mineralwolle, EPS, Holzfaserdämmstoffe</td>
                    <td className="p-3 text-right text-blue-600 font-medium">National / Global</td>
                    <td className="p-3 text-right font-mono font-bold">~ 4,5 Mrd. €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg text-[11.5px] leading-relaxed text-blue-900 mt-2">
              <strong>Zusammenfassende Branchenkennzahlen:</strong> Die Branche beschäftigt in Deutschland rund 150.000 Menschen, setzt jährlich einen mittleren zweistelligen Milliardenbetrag um und liefert über 500 Millionen Tonnen mineralische Rohstoffe pro Jahr (Größenordnungen; aktuelle Zahlen im bbs-Jahresbericht bzw. bei Destatis manuell prüfen).
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
                  <Layers size={16} className="text-slate-700" /> EconBiz – Fachportal Wirtschaftswissenschaften
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Betrieben von der ZBW (Leibniz-Informationszentrum Wirtschaft). Recherche nach wirtschaftswissenschaftlicher Literatur, z. B. zur Dekarbonisierung der Baustoffindustrie.
                </p>
              </div>
              <a href="https://www.econbiz.de" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-xs font-medium text-shiraz hover:underline">
                econbiz.de öffnen
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Wirtschaftlicher Lieferradius für Kies"
          zielGleichung="R_{max} = \frac{P_{Markt} - K_{prod} - K_{fix}}{k_{var}}"
          normQuelle="Lehrmodell mit angenommenen Kostenwerten"
          schritte={[
            { titel: '1. Gegeben', formel: 'P_{Markt} = 30\\,\\text{€/t},\\; K_{prod} = 12\\,\\text{€/t},\\; K_{fix} = 3\\,\\text{€/t},\\; k_{var} = 0{,}30\\,\\text{€/(t·km)}', erklaerung: 'Lehrannahmen: Preis frei Baustelle, Gewinnungskosten, Laden/Entladen, Fahrtkosten je km.' },
            { titel: '2. Verfügbare Marge für Transport', formel: '30 - 12 - 3 = 15\\,\\text{€/t}', erklaerung: 'Was für die Fahrt bleibt.' },
            { titel: '3. Lieferradius', formel: 'R_{max} = 15 / 0{,}30 = 50\\,\\text{km}', erklaerung: 'Weiter entfernte Kunden sind unwirtschaftlich.' },
          ]}
          ergebnisHinweis="Rund 50 km – deshalb sind Kieswerke und Transportbetonwerke regional verteilt, Zementwerke dagegen beliefern größere Gebiete."
        />
      </div>

      <ModulTest moduleId="bp_baustoffindustrie" />

      {/* Module Footer standard integration */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Baustoff', url: 'https://de.wikipedia.org/wiki/Baustoff' },
          { title: 'Klinker', url: 'https://de.wikipedia.org/wiki/Zementklinker' },
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' }
        ]}
        weblinks={[
          { title: 'Bundesverband Baustoffe – Steine und Erden (bbs)', url: 'https://www.baustoffindustrie.de' }
        ]}
        literatur={[
          'Bundesverband Baustoffe – Steine und Erden (bbs) / RWI (Dehio, J. et al.): Rohstoffnachfrage 2045: Ressourcen sichern, Zukunft bauen – Perspektiven für mineralische Primär- und Sekundärrohstoffe. Essen/Berlin 2025',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'Bundesberggesetz (BBergG: Gewinnung von Bodenschätzen)', url: 'https://www.gesetze-im-internet.de/bbergg/' },
          { title: 'Bundes-Immissionsschutzgesetz (BImSchG)', url: 'https://www.gesetze-im-internet.de/bimschg/' },
          { title: 'DIN EN 197-1 (Zement: Zusammensetzung und Konformität)' }
        ]}
        formeln={[
          {
            formel: 'K_{\\text{trans}} = K_{\\text{fix}} + d_{\\text{dist}} \\cdot k_{\\text{var}} \\quad [\\text{€/t}], \\quad R_{\\text{max}} = \\frac{P_{\\text{Markt}} - K_{\\text{prod}} - K_{\\text{fix}}}{k_{\\text{var}}}',
            erklaerung: 'Transportkostenmodellierung und maximaler wirtschaftlicher Lieferradius Rmax von mineralischen Massenbaustoffen in Abhängigkeit von Marktpreis, Produktionskosten und entfernungsabhängigen Speditionskosten.',
            quelle: 'Lehrmodell (Transportkosten)'
          }
        ]}
      />
    </div>
  );
}
