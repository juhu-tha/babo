import React, { useState, useMemo } from 'react';
import { 
  Milestone, 
  Scale, 
  Activity, 
  Car, 
  CheckCircle2, 
  Info, 
  Layers
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';

export default function IngenieurbauLCA() {
  // Simulator State
  const [deckArea, setDeckArea] = useState<number>(1500); // m²
  const [studyPeriod, setStudyPeriod] = useState<number>(100); // Jahre nach DIN EN 1990
  const [dtvSchwerverkehr, setDtvSchwerverkehr] = useState<number>(4500); // LKW/Tag
  const [constructionStrategy, setConstructionStrategy] = useState<'standard' | 'accelerated'>('standard');
  const [activeSubTab, setActiveSubTab] = useState<'uebersicht' | 'vergleich' | 'simulator' | 'stau_b8'>('uebersicht');

  // Simulation Calculations
  const results = useMemo(() => {
    // Cycles in reference study period
    const asphaltCycles = Math.floor(studyPeriod / 15);
    const bearingCycles = Math.floor(studyPeriod / 30);
    const coatingCycles = Math.floor(studyPeriod / 25);

    // Stautage-Faktor abhängig von der Baustellenstrategie
    const stauTageFactor = constructionStrategy === 'accelerated' ? 0.35 : 1.0;
    // Zusätzlicher CO2-Ausstoß pro im Stau stehendem LKW/Tag (ca. 0,95 kg CO2e / Fahrzeug durch Stop-and-Go und Umwege)
    const co2PerDelayedVehicle = 0.95; // kg CO2e / Fahrzeug

    // --- VARIANTE A: Spannbeton-Hohlkastenbrücke ---
    // A1-A3: Massiver Beton C35/45 (klinkerreduziert) + Betonstahl + Spannstahl
    const gwpA1A3_Beton = deckArea * 266.4; // kg CO2e
    // A4-A5: Schalung, Gerüst, Transport
    const gwpA4A5_Beton = deckArea * 25.0;
    // B2-B5: Instandhaltung & Austauschzyklen
    const gwpB_Asphalt_Beton = deckArea * (asphaltCycles * 12.35);
    const gwpB_Kappen_Beton = deckArea * 28.0 * (studyPeriod / 100);
    const gwpB_Lager_Beton = deckArea * (bearingCycles * 5.0);
    const gwpB_Betonsanierung = deckArea * 12.0 * (studyPeriod / 100);
    const gwpB2B5_Beton = gwpB_Asphalt_Beton + gwpB_Kappen_Beton + gwpB_Lager_Beton + gwpB_Betonsanierung;

    // Modul B8: Nutzer-Stauemissionen während Instandsetzungen
    // Bei Spannbeton: Belagswechsel + Fugenersatz erfordern je 18 Tage Teilsperrung
    const stautage_Beton = asphaltCycles * 18 * stauTageFactor;
    const gwpB8_Beton = stautage_Beton * (dtvSchwerverkehr * 0.4) * co2PerDelayedVehicle;

    // C1-C4: Abbruch & Entsorgung
    const gwpC_Beton = deckArea * 32.0;
    // Modul D: Gutschrift für Stahlschrott & RC-Korn
    const gwpD_Beton = -deckArea * 38.0;

    const totalGwp_Beton = gwpA1A3_Beton + gwpA4A5_Beton + gwpB2B5_Beton + gwpB8_Beton + gwpC_Beton;
    const netGwp_Beton = totalGwp_Beton + gwpD_Beton;
    const gwpPerM2Year_Beton = totalGwp_Beton / (deckArea * studyPeriod);

    // --- VARIANTE B: Stahlverbundbrücke (S355/S460 + Ortbeton-Fahrbahnplatte) ---
    // A1-A3: Schlankere Betonplatte + vorgefertigte Baustahlträger
    const gwpA1A3_Stahl = deckArea * 211.3;
    // A4-A5: Vormontage, Einhub, schnellere Baustelleneinrichtung
    const gwpA4A5_Stahl = deckArea * 18.0;
    // B2-B5: Instandhaltung & Austauschzyklen
    const gwpB_Asphalt_Stahl = deckArea * (asphaltCycles * 12.35);
    const gwpB_Kappen_Stahl = deckArea * 28.0 * (studyPeriod / 100);
    const gwpB_Lager_Stahl = deckArea * (bearingCycles * 5.0);
    // Erneuerung des Korrosionsschutzes (DIN EN ISO 12944) alle 25 Jahre
    const gwpB_Coating_Stahl = deckArea * (coatingCycles * 9.5);
    const gwpB2B5_Stahl = gwpB_Asphalt_Stahl + gwpB_Kappen_Stahl + gwpB_Lager_Stahl + gwpB_Coating_Stahl;

    // Modul B8: Nutzer-Stauemissionen während Instandsetzungen
    // Stahlverbundbrücke: Belagswechsel wie Beton; Korrosionsschutz erfolgt meist von unten (Einhausung), jedoch Vollsperrung bei Lagerwechsel
    const stautage_Stahl = (asphaltCycles * 18 + coatingCycles * 4) * stauTageFactor;
    const gwpB8_Stahl = stautage_Stahl * (dtvSchwerverkehr * 0.4) * co2PerDelayedVehicle;

    // C1-C4: Schnellerer Rückbau per Autokran
    const gwpC_Stahl = deckArea * 24.0;
    // Modul D: Hohe Gutschrift durch 100% sortenreines Einschmelzen des Baustahls im EAF
    const gwpD_Stahl = -deckArea * 85.0;

    const totalGwp_Stahl = gwpA1A3_Stahl + gwpA4A5_Stahl + gwpB2B5_Stahl + gwpB8_Stahl + gwpC_Stahl;
    const netGwp_Stahl = totalGwp_Stahl + gwpD_Stahl;
    const gwpPerM2Year_Stahl = totalGwp_Stahl / (deckArea * studyPeriod);

    return {
      asphaltCycles,
      bearingCycles,
      coatingCycles,
      beton: {
        a1a3: gwpA1A3_Beton / 1000,
        a4a5: gwpA4A5_Beton / 1000,
        b2b5: gwpB2B5_Beton / 1000,
        b8: gwpB8_Beton / 1000,
        c: gwpC_Beton / 1000,
        d: gwpD_Beton / 1000,
        total: totalGwp_Beton / 1000,
        net: netGwp_Beton / 1000,
        perM2Year: gwpPerM2Year_Beton,
        stautage: stautage_Beton
      },
      stahl: {
        a1a3: gwpA1A3_Stahl / 1000,
        a4a5: gwpA4A5_Stahl / 1000,
        b2b5: gwpB2B5_Stahl / 1000,
        b8: gwpB8_Stahl / 1000,
        c: gwpC_Stahl / 1000,
        d: gwpD_Stahl / 1000,
        total: totalGwp_Stahl / 1000,
        net: netGwp_Stahl / 1000,
        perM2Year: gwpPerM2Year_Stahl,
        stautage: stautage_Stahl
      }
    };
  }, [deckArea, studyPeriod, dtvSchwerverkehr, constructionStrategy]);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-shiraz/10 text-shiraz rounded-xl border border-shiraz/20">
              <Milestone size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-shiraz text-white font-mono">
                  DIN EN 17472:2022-09
                </span>
                <span className="text-[10px] text-slate-500 font-mono">CEN/TC 350 Infrastruktur</span>
              </div>
              <h3 className="text-lg font-bold text-text-main mt-0.5">
                Nachhaltigkeit von Bauwerken – Ökobilanzierung von Ingenieurbauwerken
              </h3>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            Pendant zu <strong>DIN EN 15978</strong> (Hochbau)
          </div>
        </div>

        <div className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed space-y-2">
          <p>
            Während die klassische <strong>DIN EN 15978</strong> ausschließlich die Ökobilanzierung von Hochbauten (Wohn- und Nichtwohngebäude) über typischerweise 50 Jahre Betrachtungszeitraum regelt, schließt die europäische Norm <strong>DIN EN 17472:2022-09</strong> die Lücke für die gesamte Verkehrsinfrastruktur und den Tiefbau: <strong>Brücken, Tunnel, Straßen, Eisenbahntrassen, Wasserbauwerke, Staudämme und Leitungsnetze</strong>.
          </p>
          <p>
            Sie definiert eigene funktionelle Einheiten, verankert <strong>Nutzungsdauern von 80 bis 100+ Jahren</strong> (nach DIN EN 1990 Auslegungskategorie 5) und quantifiziert als bahnbrechendes Novum die <strong>baustellenbedingten Nutzer- und Stauemissionen im Modul B8</strong>.
          </p>
        </div>

        {/* Sub-Navigation */}
        <div className="flex flex-wrap gap-2 mt-5 pt-3 border-t border-home-grau/20">
          {[
            { id: 'uebersicht' as const, label: 'Normen-Architektur & Prinzipien', icon: Layers },
            { id: 'vergleich' as const, label: 'Differenzierungsmatrix: Hochbau vs. Tiefbau', icon: Scale },
            { id: 'stau_b8' as const, label: 'Das Modul B8: Baustellen-Stauemissionen', icon: Car },
            { id: 'simulator' as const, label: 'Interaktiver Brücken-LCA-Simulator (100 Jahre)', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                  isActive
                    ? 'bg-shiraz text-white border-shiraz shadow-xs'
                    : 'bg-white text-slate-700 border-home-grau/30 hover:bg-off-white'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : 'text-shiraz'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab 1: Übersicht & Normenarchitektur */}
      {activeSubTab === 'uebersicht' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main border-b border-home-grau/20 pb-2">
              <span className="w-6 h-6 rounded-lg bg-shiraz/10 text-shiraz font-mono text-xs flex items-center justify-center font-bold">1</span>
              <span>Dachnorm &amp; CEN/TC 350</span>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Die Normenfamilie des Technischen Komitees <strong>CEN/TC 350</strong> teilt sich auf zwei Ebenen auf:
            </p>
            <ul className="text-xs space-y-2 text-text-main/80 list-disc pl-4">
              <li><strong>DIN EN 15643:</strong> Allgemeine Dachnorm mit den Grundsätzen für die Nachhaltigkeitsbewertung aller baulichen Anlagen.</li>
              <li><strong>DIN EN 15804+A2:</strong> Produktkategorieregeln (Core-PCR) für Typ-III-EPDs auf Materialebene.</li>
              <li><strong>DIN EN 15978:</strong> Berechnungsmethode für Gebäude (Hochbau).</li>
              <li><strong>DIN EN 17472:</strong> Berechnungsmethode für Ingenieurbauwerke (Tiefbau &amp; Infrastruktur).</li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main border-b border-home-grau/20 pb-2">
              <span className="w-6 h-6 rounded-lg bg-shiraz/10 text-shiraz font-mono text-xs flex items-center justify-center font-bold">2</span>
              <span>Drei-Säulen-Integration</span>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed">
              DIN EN 17472 verlangt ausdrücklich die ganzheitliche Betrachtung über drei Hauptdimensionen:
            </p>
            <ul className="text-xs space-y-2 text-text-main/80">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Umweltqualität (LCA):</strong> 13 Kernindikatoren nach EN 15804 (GWP-total, ODP, AP, EP, POCP, PENRT, etc.).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Wirtschaftsqualität (LCC):</strong> Lebenszykluskosten nach ISO 15686-5 (Herstellung, Instandhaltung, Rückbau).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Soziale &amp; funktionale Leistung:</strong> Verkehrssicherheit, Zugänglichkeit, Lärmemissionen und Verkehrsbehinderungen.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main border-b border-home-grau/20 pb-2">
              <span className="w-6 h-6 rounded-lg bg-shiraz/10 text-shiraz font-mono text-xs flex items-center justify-center font-bold">3</span>
              <span>Regulative Normformel</span>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Die spezifische Umweltwirkung nach DIN EN 17472 bezieht alle Phasen auf die funktionelle Bauwerksfläche und den Betrachtungszeitraum:
            </p>
            <div className="p-2.5 bg-off-white rounded-xl border border-home-grau/20 text-center font-mono text-xs overflow-x-auto">
              <BlockMath math="\text{GWP}_{\text{Ing}} = \frac{\text{GWP}_{\text{A}} + \sum \text{GWP}_{\text{B2-B5}} + \text{GWP}_{\text{B8}} + \text{GWP}_{\text{C}}}{A_{\text{Deck}} \cdot t_{\text{ref}}}" />
            </div>
            <span className="text-[10.5px] text-slate-500 block leading-tight text-center">
              Einheit: <InlineMath math="\left[\text{kg CO}_2\text{-eq}/(\text{m}^2\cdot\text{a})\right]" />
            </span>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Differenzierungsmatrix Hochbau vs. Tiefbau */}
      {activeSubTab === 'vergleich' && (
        <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-home-grau/20 pb-3">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <Scale size={16} className="text-shiraz" />
              Gegenüberstellung: DIN EN 15978 (Hochbau) vs. DIN EN 17472 (Ingenieurbauwerke)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Wesentliche methodische und baupraktische Unterschiede der beiden europäischen Ökobilanz-Normen.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-home-grau/25 rounded-xl overflow-hidden">
              <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/25">
                <tr>
                  <th className="p-3 w-1/4">Kriterium</th>
                  <th className="p-3 w-3/8 text-slate-700">Gebäude (DIN EN 15978)</th>
                  <th className="p-3 w-3/8 text-shiraz font-bold">Ingenieurbauwerke (DIN EN 17472)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/15 text-slate-700">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main">Typische Anwendungsbereiche</td>
                  <td className="p-3">Wohngebäude, Bürogebäude, Schulen, Hallen</td>
                  <td className="p-3 font-medium text-slate-900">Brücken, Tunnel, Straßen, Eisenbahnstrecken, Schleusen, Staudämme</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main">Referenz-Betrachtungszeitraum (RSP)</td>
                  <td className="p-3">Typisch <strong>50 Jahre</strong> (gemäß QNG / DGNB / BNB)</td>
                  <td className="p-3 font-medium text-slate-900">
                    Typisch <strong>80 bis 100+ Jahre</strong> (DIN EN 1990 Auslegungskategorie 5 für Brücken)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main">Funktionelle Einheit (Bezugsgröße)</td>
                  <td className="p-3">
                    <InlineMath math="1\text{ m}^2" /> Nettoraumfläche (NRF) oder Brutto-Grundfläche (BGF)
                  </td>
                  <td className="p-3 font-medium text-slate-900">
                    <InlineMath math="1\text{ m}^2" /> Brückendeckfläche, 1 km Trassenlänge, Durchflussmenge (<InlineMath math="\text{m}^3/\text{h}" />), Verkehrsleistung (<InlineMath math="\text{tkm}" />)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main">Dominierende Lebenszyklusphase</td>
                  <td className="p-3">
                    Oft Betriebsphase <strong>B6</strong> (Heizung, Kühlung) + Herstellung <strong>A1–A3</strong>
                  </td>
                  <td className="p-3 font-medium text-slate-900">
                    Herstellung <strong>A1–A3</strong> + Austauschzyklen <strong>B2–B5</strong> + Nutzerstau <strong>B8</strong>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main">Austauschzyklen in der Nutzung (B2–B5)</td>
                  <td className="p-3">Bodenbeläge (15–20 a), Fenster (25–30 a), Haustechnik/TGA (20 a)</td>
                  <td className="p-3 font-medium text-slate-900">
                    Fahrbahnbelag (12–15 a), Dichtung (25–30 a), Lager &amp; Übergänge (25–30 a), Korrosionsschutz (20–25 a)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main">Berücksichtigung von Nutzeraktivitäten</td>
                  <td className="p-3">Im Hochbau meist nicht erfasst (kein Modul B8)</td>
                  <td className="p-3 font-medium text-slate-900">
                    <strong>Modul B8 verpflichtend darstellbar:</strong> Zusätzliche Kraftstoffemissionen durch Baustellenstaus und Umleitungen
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main">Kreislaufwirtschaft &amp; End-of-Life</td>
                  <td className="p-3">Selektiver Rückbau von Ausbau- und Dämmschichten</td>
                  <td className="p-3 font-medium text-slate-900">
                    Massenverwertung: Ausbauasphalt (Heißmischgut), RC-Betonkörnung, Stahl-Einschmelzung nach EBV
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Modul B8 Stauemissionen */}
      {activeSubTab === 'stau_b8' && (
        <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="border-b border-home-grau/20 pb-3">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <Car size={16} className="text-shiraz" />
              Modul B8 nach DIN EN 17472: Baustellenbedingte Nutzer- und Stauemissionen
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Warum die Bauzeit und die Baustellenverkehrsführung bei Autobahnbrücken oft wichtiger sind als die Herstellungsmasse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-xs text-text-main/80 leading-relaxed">
              <p>
                Ein wesentliches Alleinstellungsmerkmal der <strong>DIN EN 17472</strong> ist das <strong>Modul B8 (Nutzeraktivitäten während des Betriebs und der Instandhaltung)</strong>.
              </p>
              <p>
                Wird eine Brücke saniert, ein Fahrbahnbelag abgefräst oder ein Fahrbahnübergang getauscht, muss die Fahrbahn ganz oder teilweise gesperrt werden (z. B. 4+0-Verkehrsführung oder Teilsperrung). Dies führt zu:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                <li>Geschwindigkeitsreduzierungen (z. B. von 120 km/h auf 60 km/h oder 80 km/h).</li>
                <li>Stopp-and-Go-Verkehr und Kolonnenbildung mit extrem erhöhtem spezifischen Treibstoffverbrauch.</li>
                <li>Umwegfahrten des Schwerlastverkehrs über das nachgeordnete Landstraßennetz.</li>
              </ul>
              <div className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-xl text-amber-950 text-xs">
                <strong>Verblüffendes Praxisfaktum:</strong> Auf einer Bundesautobahn mit <InlineMath math="5.000" /> Schwerlast-Fahrzeugen pro Tag verursacht eine 30-tägige Baustellen-Verzögerung schnell über <InlineMath math="150\text{ t CO}_2\text{-eq}" /> an reinen Stau-Mehrverbräuchen – oft mehr als die gesamte Herstellungsenergie des eingebauten Asphalts!
              </div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/25 space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-home-grau/20 pb-2">
                Ingenieurtechnische Optimierungshebel nach DIN EN 17472
              </h5>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">1. Modulare Vorfertigung &amp; Schnellbaumethoden:</strong>
                  Vorgefertigte Verbundträger oder Fertigteil-Fahrbahnplatten verkürzen die Sperrzeiten auf wenige Tage (z. B. Brückeneinschub an einem Wochenende).
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">2. Wartungsfreie oder extrem langlebige Komponenten:</strong>
                  Fugenlose oder lagerlose Brücken (integrale / semi-integrale Tragwerke) eliminieren mechanische Fahrbahnübergänge und Elastomerlager komplett – null Wartungsstau über 100 Jahre!
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">3. Hochleistungs-Asphaltbeläge (SMA / Kompaktasphalt):</strong>
                  Einsatz von polymermodifizierten Bitumen (PmB) zur Verlängerung der Liegedauer der Deckschicht von 12 auf 20 Jahre.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Interaktiver Brücken-LCA-Simulator */}
      {activeSubTab === 'simulator' && (
        <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-home-grau/20 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                <Activity size={16} className="text-shiraz" />
                Interaktiver Brücken-LCA-Simulator (100 Jahre nach DIN EN 17472)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Vergleich: <strong>Spannbeton-Hohlkasten</strong> vs. <strong>Stahlverbundbrücke</strong> über den Lebenszyklus.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-shiraz/10 text-shiraz border border-shiraz/20">
              RSP = {formatDeWert(studyPeriod)} Jahre
            </span>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-off-white rounded-xl border border-home-grau/25 text-xs">
            {/* Control 1: Deckfläche */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700">
                <label>Brückendeckfläche (<InlineMath math="A_{\text{Deck}}" />):</label>
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border">{formatDeZahl(deckArea, 0)} m²</span>
              </div>
              <input
                type="range"
                min="500"
                max="4000"
                step="100"
                value={deckArea}
                onChange={(e) => setDeckArea(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block text-right font-mono">z.B. {formatDeZahl(deckArea / 15, 0)} m × 15 m</span>
            </div>

            {/* Control 2: Betrachtungszeitraum */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700">
                <label>Betrachtungszeitraum (<InlineMath math="t_{\text{ref}}" />):</label>
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border">{formatDeWert(studyPeriod)} Jahre</span>
              </div>
              <input
                type="range"
                min="50"
                max="120"
                step="10"
                value={studyPeriod}
                onChange={(e) => setStudyPeriod(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block text-right font-mono">DIN EN 1990: 100 a</span>
            </div>

            {/* Control 3: Schwerverkehr DTV-SV */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700">
                <label>Schwerverkehr (<InlineMath math="DTV_{\text{SV}}" />):</label>
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border">{formatDeZahl(dtvSchwerverkehr, 0)} LKW/d</span>
              </div>
              <input
                type="range"
                min="1000"
                max="12000"
                step="500"
                value={dtvSchwerverkehr}
                onChange={(e) => setDtvSchwerverkehr(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <span className="text-[10px] text-slate-400 block text-right font-mono">Für Stau-Modul B8</span>
            </div>

            {/* Control 4: Baustellen-Strategie */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Baustellenführung (B8):</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setConstructionStrategy('standard')}
                  className={`p-2 rounded-lg border text-[11px] font-bold transition-all text-center cursor-pointer ${
                    constructionStrategy === 'standard'
                      ? 'bg-shiraz text-white border-shiraz'
                      : 'bg-white text-slate-600 border-home-grau/25 hover:bg-slate-50'
                  }`}
                >
                  Konventionell
                </button>
                <button
                  type="button"
                  onClick={() => setConstructionStrategy('accelerated')}
                  className={`p-2 rounded-lg border text-[11px] font-bold transition-all text-center cursor-pointer ${
                    constructionStrategy === 'accelerated'
                      ? 'bg-shiraz text-white border-shiraz'
                      : 'bg-white text-slate-600 border-home-grau/25 hover:bg-slate-50'
                  }`}
                >
                  Schnellbau ⚡
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block text-center">
                {constructionStrategy === 'accelerated' ? '-65% Sperrzeit' : 'Volle Teilsperrung'}
              </span>
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card Variante A: Spannbeton */}
            <div className="p-5 bg-white rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Variante A</span>
                  <h5 className="font-bold text-sm text-text-main">Spannbeton-Hohlkastenbrücke</h5>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-shiraz font-mono">
                    {formatDeZahl(results.beton.perM2Year, 2)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">kg CO₂e / (m²·a)</span>
                </div>
              </div>

              {/* Lifecycle Phase Breakdown Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600">Herstellung (A1–A3) Beton + Spannstahl:</span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.beton.a1a3, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600">Transport &amp; Errichtung (A4–A5):</span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.beton.a4a5, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600">
                    Instandhaltung (B2–B5) [{formatDeWert(results.asphaltCycles)}x Belag, {formatDeWert(results.bearingCycles)}x Lager]:
                  </span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.beton.b2b5, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15 bg-amber-50/50 px-2 rounded">
                  <span className="text-amber-900 font-semibold flex items-center gap-1">
                    <Car size={13} /> Modul B8 (Stauemissionen, {formatDeZahl(results.beton.stautage, 0)} d):
                  </span>
                  <strong className="font-mono text-amber-950 font-bold">{formatDeZahl(results.beton.b8, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600">Rückbau &amp; Entsorgung (C1–C4):</span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.beton.c, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15 text-emerald-700">
                  <span>Modul D (RC-Korn &amp; Stahlschrott):</span>
                  <strong className="font-mono">{formatDeZahl(results.beton.d, 1)} t CO₂e</strong>
                </div>
              </div>

              {/* Total Footprint Summary */}
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Lebenszyklus-Bilanz Netto</span>
                  <strong className="text-sm font-bold text-slate-900 font-mono">
                    {formatDeZahl(results.beton.net, 1)} t CO₂-Äquivalent
                  </strong>
                </div>
                <span className="text-[10px] text-slate-500 max-w-[140px] text-right">
                  Über {formatDeWert(studyPeriod)} Jahre Betriebszeit
                </span>
              </div>
            </div>

            {/* Card Variante B: Stahlverbund */}
            <div className="p-5 bg-white rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Variante B</span>
                  <h5 className="font-bold text-sm text-text-main">Stahlverbundbrücke (S355 + Beton)</h5>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-shiraz font-mono">
                    {formatDeZahl(results.stahl.perM2Year, 2)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">kg CO₂e / (m²·a)</span>
                </div>
              </div>

              {/* Lifecycle Phase Breakdown Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600">Herstellung (A1–A3) Stahl + Platte:</span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.stahl.a1a3, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600">Transport &amp; Montage (A4–A5):</span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.stahl.a4a5, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600">
                    Instandhaltung (B2–B5) [{formatDeWert(results.coatingCycles)}x Anstrich, {formatDeWert(results.asphaltCycles)}x Belag]:
                  </span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.stahl.b2b5, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15 bg-amber-50/50 px-2 rounded">
                  <span className="text-amber-900 font-semibold flex items-center gap-1">
                    <Car size={13} /> Modul B8 (Stauemissionen, {formatDeZahl(results.stahl.stautage, 0)} d):
                  </span>
                  <strong className="font-mono text-amber-950 font-bold">{formatDeZahl(results.stahl.b8, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600">Rückbau &amp; Demontage (C1–C4):</span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.stahl.c, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15 text-emerald-700">
                  <span>Modul D (100% Stahlschrott-Gutschrift):</span>
                  <strong className="font-mono">{formatDeZahl(results.stahl.d, 1)} t CO₂e</strong>
                </div>
              </div>

              {/* Total Footprint Summary */}
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Lebenszyklus-Bilanz Netto</span>
                  <strong className="text-sm font-bold text-slate-900 font-mono">
                    {formatDeZahl(results.stahl.net, 1)} t CO₂-Äquivalent
                  </strong>
                </div>
                <span className="text-[10px] text-slate-500 max-w-[140px] text-right">
                  Sehr hohes Modul-D-Recyclingpotenzial
                </span>
              </div>
            </div>

          </div>

          {/* Key Insights & Didactic Takeaways */}
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2 text-xs">
            <h5 className="font-bold text-shiraz flex items-center gap-1.5">
              <Info size={14} /> Didaktische Auswertung nach DIN EN 17472:
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-relaxed">
              <li>
                <strong>Der Stau-Impact im Modul B8:</strong> Bei hohem LKW-Aufkommen (<InlineMath math="DTV_{\text{SV}} \ge 4.500" />) verursacht der Verkehrsstau während der Sanierungsphasen ({formatDeZahl(results.beton.b8, 0)} t CO₂e) einen maßgeblichen Anteil der Gesamtbilanz. Eine beschleunigte Schnellbau-Strategie spart auf einen Schlag massiv Emissionen ein!
              </li>
              <li>
                <strong>Materialspezifische Lebenszyklus-Eigenschaften:</strong> Die Stahlverbundbrücke startet mit geringerer Anfangsfracht (A1–A3) und punktet beim Rückbau mit einer gigantischen Modul-D-Gutschrift (Stahlschrott im Elektroofen). Dafür erfordert sie in Phase B4 regelmäßige, aufwendige Korrosionsschutz-Erneuerungen.
              </li>
              <li>
                <strong>Vergleichsmaßstab nach EN 17472:</strong> Durch die Normierung auf <InlineMath math="1\text{ m}^2" /> Deckfläche und Jahr (<InlineMath math="\text{kg CO}_2\text{e}/(\text{m}^2\cdot\text{a})" />) können unterschiedliche Brücken-Tragwerke über 100 Jahre objektiv verglichen werden.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
