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
import inhalt from '@/content/lca/IngenieurbauLCA.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../../components/ui/Auswahlgruppe';

/**
 * Lehrwerte des Brücken-Simulators je m² Brückendeckfläche [kg CO₂-Äq./m²] bzw. je Zyklus (Durchsicht B 29.10.2026,
 * DSB-LI-1): gerundete Größenordnungen für den Variantenvergleich, keine Projekt- oder Datenbankwerte und ohne abgerufene
 * Quelle (Lehrwerte). Werte unverändert aus der Prüfung T11 (Quiz qn_lca_ingenieurbau_* rechnet damit). Für Nachweise gelten
 * die Mengen des Bauwerks und EPD bzw. ÖKOBAUDAT-Datensätze; Stauemissionen (B8) als Modellansatz, vorläufig.
 */
const BRUECKE_LEHRWERTE = {
  /** Austauschintervalle [a]; gezählt werden volle Intervalle (abgerundet) */
  intervall: { belag: 15, lager: 30, korrosionsschutz: 25 },
  spannbeton: { a1a3: 266.4, a4a5: 25.0, c: 32.0, d: -38.0, betonsanierungJe100a: 12.0 },
  stahlverbund: { a1a3: 211.3, a4a5: 18.0, c: 24.0, d: -85.0, korrosionsschutzJeZyklus: 9.5 },
  /** für beide Varianten */
  belagJeZyklus: 12.35, kappenJe100a: 28.0, lagerJeZyklus: 5.0,
  /** B8: Sperrtage je Belagswechsel bzw. je Korrosionsschutz-Erneuerung, Anteil betroffener Lkw, Mehremission je Lkw [kg] */
  sperrtageBelag: 18, sperrtageKorrosionsschutz: 4, anteilLkwImStau: 0.4, co2JeLkw: 0.95, faktorSchnellbau: 0.35,
} as const;

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
    const L = BRUECKE_LEHRWERTE;
    // Zählweise ⌊T/ND⌋ (Entscheidung 30.10.2026, DSB-LI-2: belassen und im Simulatortext benannt; Gebäuderechner ⌈T/ND⌉ − 1)
    const asphaltCycles = Math.floor(studyPeriod / L.intervall.belag);
    const bearingCycles = Math.floor(studyPeriod / L.intervall.lager);
    const coatingCycles = Math.floor(studyPeriod / L.intervall.korrosionsschutz);

    // Stautage-Faktor abhängig von der Baustellenstrategie
    const stauTageFactor = constructionStrategy === 'accelerated' ? L.faktorSchnellbau : 1.0;
    // Zusätzlicher CO2-Ausstoß pro im Stau stehendem LKW/Tag (ca. 0,95 kg CO2e / Fahrzeug durch Stop-and-Go und Umwege)
    const co2PerDelayedVehicle = L.co2JeLkw; // kg CO2e / Fahrzeug

    // --- VARIANTE A: Spannbeton-Hohlkastenbrücke ---
    // A1-A3: Massiver Beton C35/45 (klinkerreduziert) + Betonstahl + Spannstahl
    const gwpA1A3_Beton = deckArea * L.spannbeton.a1a3; // kg CO2e
    // A4-A5: Schalung, Gerüst, Transport
    const gwpA4A5_Beton = deckArea * L.spannbeton.a4a5;
    // B2-B5: Instandhaltung & Austauschzyklen
    const gwpB_Asphalt_Beton = deckArea * (asphaltCycles * L.belagJeZyklus);
    const gwpB_Kappen_Beton = deckArea * L.kappenJe100a * (studyPeriod / 100);
    const gwpB_Lager_Beton = deckArea * (bearingCycles * L.lagerJeZyklus);
    const gwpB_Betonsanierung = deckArea * L.spannbeton.betonsanierungJe100a * (studyPeriod / 100);
    const gwpB2B5_Beton = gwpB_Asphalt_Beton + gwpB_Kappen_Beton + gwpB_Lager_Beton + gwpB_Betonsanierung;

    // Modul B8: Nutzer-Stauemissionen während Instandsetzungen
    // Bei Spannbeton: je Belagswechsel 18 Tage Teilsperrung (Fugen- und Lagerwechsel im Modell nicht gesondert erfasst)
    const stautage_Beton = asphaltCycles * L.sperrtageBelag * stauTageFactor;
    const gwpB8_Beton = stautage_Beton * (dtvSchwerverkehr * L.anteilLkwImStau) * co2PerDelayedVehicle;

    // C1-C4: Abbruch & Entsorgung
    const gwpC_Beton = deckArea * L.spannbeton.c;
    // Modul D: Gutschrift für Stahlschrott & RC-Korn
    const gwpD_Beton = deckArea * L.spannbeton.d;

    const totalGwp_Beton = gwpA1A3_Beton + gwpA4A5_Beton + gwpB2B5_Beton + gwpB8_Beton + gwpC_Beton;
    const netGwp_Beton = totalGwp_Beton + gwpD_Beton;
    const gwpPerM2Year_Beton = totalGwp_Beton / (deckArea * studyPeriod);

    // --- VARIANTE B: Stahlverbundbrücke (S355/S460 + Ortbeton-Fahrbahnplatte) ---
    // A1-A3: Schlankere Betonplatte + vorgefertigte Baustahlträger
    const gwpA1A3_Stahl = deckArea * L.stahlverbund.a1a3;
    // A4-A5: Vormontage, Einhub, schnellere Baustelleneinrichtung
    const gwpA4A5_Stahl = deckArea * L.stahlverbund.a4a5;
    // B2-B5: Instandhaltung & Austauschzyklen
    const gwpB_Asphalt_Stahl = deckArea * (asphaltCycles * L.belagJeZyklus);
    const gwpB_Kappen_Stahl = deckArea * L.kappenJe100a * (studyPeriod / 100);
    const gwpB_Lager_Stahl = deckArea * (bearingCycles * L.lagerJeZyklus);
    // Erneuerung des Korrosionsschutzes (DIN EN ISO 12944) alle 25 Jahre
    const gwpB_Coating_Stahl = deckArea * (coatingCycles * L.stahlverbund.korrosionsschutzJeZyklus);
    const gwpB2B5_Stahl = gwpB_Asphalt_Stahl + gwpB_Kappen_Stahl + gwpB_Lager_Stahl + gwpB_Coating_Stahl;

    // Modul B8: Nutzer-Stauemissionen während Instandsetzungen
    // Stahlverbundbrücke: Belagswechsel wie Beton, zusätzlich 4 Sperrtage je Korrosionsschutz-Erneuerung (Lagerwechsel im Modell nicht gesondert erfasst)
    const stautage_Stahl = (asphaltCycles * L.sperrtageBelag + coatingCycles * L.sperrtageKorrosionsschutz) * stauTageFactor;
    const gwpB8_Stahl = stautage_Stahl * (dtvSchwerverkehr * L.anteilLkwImStau) * co2PerDelayedVehicle;

    // C1-C4: Schnellerer Rückbau per Autokran
    const gwpC_Stahl = deckArea * L.stahlverbund.c;
    // Modul D: Hohe Gutschrift durch 100% sortenreines Einschmelzen des Baustahls im EAF
    const gwpD_Stahl = deckArea * L.stahlverbund.d;

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
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-shiraz text-white font-mono"><MdText text={inhalt.texte.dinEn174722024} /></span>
                <span className="text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.cenTc350Infrastruktur} /></span>
              </div>
              <h3 className="text-lg font-bold text-text-main mt-0.5"><MdText text={inhalt.texte.nachhaltigkeitVonBauwerkenÖkobilanzierun} /></h3>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500"><MdText text={inhalt.texte.pendantZuDinEn} /></div>
        </div>

        <div className="text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed space-y-2">
          <p><MdText text={inhalt.texte.währendDieKlassischeDin} /></p>
          <p><MdText text={inhalt.texte.sieDefiniertEigeneFunktionelle} /></p>
        </div>

        {/* Sub-Navigation */}
        <ReiterLeiste label="Bereiche Ingenieurbau-LCA" className="flex flex-wrap gap-2 mt-5 pt-3 border-t border-home-grau/20">
          {[
            { id: 'uebersicht' as const, label: inhalt.werte.normenArchitekturPrinzipien, icon: Layers },
            { id: 'vergleich' as const, label: inhalt.werte.differenzierungsmatrixHochbauVsTiefbau, icon: Scale },
            { id: 'stau_b8' as const, label: inhalt.werte.dasModulB8Baustellen, icon: Car },
            { id: 'simulator' as const, label: inhalt.werte.interaktiverBrückenLcaSimulator, icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button {...alsReiter(isActive, 'ing-lca-bereich', tab.id)}
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
        </ReiterLeiste>
      </div>

      {/* Sub-Tab 1: Übersicht & Normenarchitektur */}
      {activeSubTab === 'uebersicht' && (
        <div {...reiterPanel('ing-lca-bereich', activeSubTab)} className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main border-b border-home-grau/20 pb-2">
              <span className="w-6 h-6 rounded-lg bg-shiraz/10 text-shiraz font-mono text-xs flex items-center justify-center font-bold">1</span>
              <span><MdText text={inhalt.texte.dachnormCenTc350} /></span>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieNormenfamilieDesTechnischen} /></p>
            <ul className="text-xs space-y-2 text-text-main/80 list-disc pl-4">
              <li><MdText text={inhalt.texte.dinEn15643Allgemeine} /></li>
              <li><MdText text={inhalt.texte.dinEn15804A2} /></li>
              <li><MdText text={inhalt.texte.dinEn15978Berechnungsmethode} /></li>
              <li><MdText text={inhalt.texte.dinEn17472Berechnungsmethode} /></li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main border-b border-home-grau/20 pb-2">
              <span className="w-6 h-6 rounded-lg bg-shiraz/10 text-shiraz font-mono text-xs flex items-center justify-center font-bold">2</span>
              <span>Drei-Säulen-Integration</span>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dinEn17472Verlangt} /></p>
            <ul className="text-xs space-y-2 text-text-main/80">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><MdText text={inhalt.texte.umweltqualitätLca13Kernindikatoren} /></span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><MdText text={inhalt.texte.wirtschaftsqualitätLccLebenszykluskosten} /></span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><MdText text={inhalt.texte.sozialeFunktionaleLeistungVerkehrssicher} /></span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main border-b border-home-grau/20 pb-2">
              <span className="w-6 h-6 rounded-lg bg-shiraz/10 text-shiraz font-mono text-xs flex items-center justify-center font-bold">3</span>
              <span><MdText text={inhalt.texte.regulativeNormformel} /></span>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieSpezifischeUmweltwirkungNach} /></p>
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
        <div {...reiterPanel('ing-lca-bereich', activeSubTab)} className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-home-grau/20 pb-3">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <Scale size={16} className="text-shiraz" /><MdText text={inhalt.texte.gegenüberstellungDinEn15978} /></h4>
            <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.wesentlicheMethodischeUndBaupraktische} /></p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-home-grau/25 rounded-xl overflow-hidden">
              <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/25">
                <tr>
                  <th className="p-3 w-1/4">Kriterium</th>
                  <th className="p-3 w-3/8 text-slate-700"><MdText text={inhalt.texte.gebäudeDinEn15978} /></th>
                  <th className="p-3 w-3/8 text-shiraz font-bold"><MdText text={inhalt.texte.ingenieurbauwerkeDinEn17472} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/15 text-slate-700">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main"><MdText text={inhalt.texte.typischeAnwendungsbereiche} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.wohngebäudeBürogebäudeSchulenHallen} /></td>
                  <td className="p-3 font-medium text-slate-900"><MdText text={inhalt.texte.brückenTunnelStraßenEisenbahnstrecken} /></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main"><MdText text={inhalt.texte.referenzBetrachtungszeitraumRsp} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.typisch50JahreGemäß} /></td>
                  <td className="p-3 font-medium text-slate-900"><MdText text={inhalt.texte.typisch80Bis100} /></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main"><MdText text={inhalt.texte.funktionelleEinheitBezugsgröße} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.t1textM2Nettoraumfläche} /></td>
                  <td className="p-3 font-medium text-slate-900"><MdText text={inhalt.texte.t1textM2Brückendeckfläche} /></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main"><MdText text={inhalt.texte.dominierendeLebenszyklusphase} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.oftBetriebsphaseB6Heizung} /></td>
                  <td className="p-3 font-medium text-slate-900"><MdText text={inhalt.texte.herstellungA1A3Austauschzyklen} /></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main"><MdText text={inhalt.texte.austauschzyklenInDerNutzung} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.bodenbeläge1520A} /></td>
                  <td className="p-3 font-medium text-slate-900"><MdText text={inhalt.texte.fahrbahnbelag1215A} /></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main"><MdText text={inhalt.texte.berücksichtigungVonNutzeraktivitäten} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.imHochbauMeistNicht} /></td>
                  <td className="p-3 font-medium text-slate-900"><MdText text={inhalt.texte.modulB8VerpflichtendDarstellbar} /></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-text-main"><MdText text={inhalt.texte.kreislaufwirtschaftEndOfLife} /></td>
                  <td className="p-3"><MdText text={inhalt.texte.selektiverRückbauVonAusbau} /></td>
                  <td className="p-3 font-medium text-slate-900"><MdText text={inhalt.texte.massenverwertungAusbauasphaltHeißmischgu} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Modul B8 Stauemissionen */}
      {activeSubTab === 'stau_b8' && (
        <div {...reiterPanel('ing-lca-bereich', activeSubTab)} className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="border-b border-home-grau/20 pb-3">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <Car size={16} className="text-shiraz" /><MdText text={inhalt.texte.modulB8NachDin} /></h4>
            <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.warumDieBauzeitUnd} /></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-xs text-text-main/80 leading-relaxed">
              <p><MdText text={inhalt.texte.einWesentlichesAlleinstellungsmerkmalDer} /></p>
              <p><MdText text={inhalt.texte.wirdEineBrückeSaniert} /></p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                <li><MdText text={inhalt.texte.geschwindigkeitsreduzierungenZBVon} /></li>
                <li><MdText text={inhalt.texte.stoppAndGoVerkehr} /></li>
                <li><MdText text={inhalt.texte.umwegfahrtenDesSchwerlastverkehrsÜber} /></li>
              </ul>
              <div className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-xl text-amber-950 text-xs"><MdText text={inhalt.texte.verblüffendesPraxisfaktumAufEiner} /></div>
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/25 space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-home-grau/20 pb-2"><MdText text={inhalt.texte.ingenieurtechnischeOptimierungshebelNach} /></h5>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t1ModulareVorfertigungSchnellbaumethoden} /></strong><MdText text={inhalt.texte.vorgefertigteVerbundträgerOderFertigteil} /></div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t2WartungsfreieOderExtrem} /></strong><MdText text={inhalt.texte.fugenloseOderLagerloseBrücken} /></div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t3HochleistungsAsphaltbelägeSma} /></strong><MdText text={inhalt.texte.einsatzVonPolymermodifiziertenBitumen} /></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Interaktiver Brücken-LCA-Simulator */}
      {activeSubTab === 'simulator' && (
        <div {...reiterPanel('ing-lca-bereich', activeSubTab)} className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-home-grau/20 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                <Activity size={16} className="text-shiraz" /><MdText text={inhalt.texte.interaktiverBrückenLcaSimulator} /></h4>
              <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.vergleichSpannbetonHohlkastenVs} /></p>
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
                <label><MdText text={inhalt.texte.brückendeckflächeATextDeck} /></label>
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
                <label><MdText text={inhalt.texte.betrachtungszeitraumTTextRef} /></label>
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
              <span className="text-[10px] text-slate-400 block text-right font-mono"><MdText text={inhalt.texte.dinEn1990100} /></span>
            </div>

            {/* Control 3: Schwerverkehr DTV-SV */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700">
                <label><MdText text={inhalt.texte.schwerverkehrDtvTextSv} /></label>
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
              <span className="text-[10px] text-slate-400 block text-right font-mono"><MdText text={inhalt.texte.fürStauModulB8} /></span>
            </div>

            {/* Control 4: Baustellen-Strategie */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.baustellenführungB8} /></label>
              <AuswahlGruppe label="Baustellenführung" className="grid grid-cols-2 gap-1.5">
                <button {...alsOption(constructionStrategy === 'standard')}
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
                <button {...alsOption(constructionStrategy === 'accelerated')}
                  type="button"
                  onClick={() => setConstructionStrategy('accelerated')}
                  className={`p-2 rounded-lg border text-[11px] font-bold transition-all text-center cursor-pointer ${
                    constructionStrategy === 'accelerated'
                      ? 'bg-shiraz text-white border-shiraz'
                      : 'bg-white text-slate-600 border-home-grau/25 hover:bg-slate-50'
                  }`}
                ><MdText text={inhalt.texte.schnellbau} /></button>
              </AuswahlGruppe>
              <span className="text-[10px] text-slate-400 block text-center">
                {constructionStrategy === 'accelerated' ? inhalt.werte.t65Sperrzeit : inhalt.werte.volleTeilsperrung}
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
                  <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.kgCoEM} /></span>
                </div>
              </div>

              {/* Lifecycle Phase Breakdown Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600"><MdText text={inhalt.texte.herstellungA1A3Beton} /></span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.beton.a1a3, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600"><MdText text={inhalt.texte.transportErrichtungA4A5} /></span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.beton.a4a5, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600"><MdText text={inhalt.texte.instandhaltungB2B5} />{formatDeWert(results.asphaltCycles)}x Belag, {formatDeWert(results.bearingCycles)}x Lager]:
                  </span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.beton.b2b5, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15 bg-amber-50/50 px-2 rounded">
                  <span className="text-amber-900 font-semibold flex items-center gap-1">
                    <Car size={13} /><MdText text={inhalt.texte.modulB8Stauemissionen} />{formatDeZahl(results.beton.stautage, 0)} d):
                  </span>
                  <strong className="font-mono text-amber-950 font-bold">{formatDeZahl(results.beton.b8, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600"><MdText text={inhalt.texte.rückbauEntsorgungC1C4} /></span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.beton.c, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15 text-emerald-700">
                  <span><MdText text={inhalt.texte.modulDRcKorn} /></span>
                  <strong className="font-mono">{formatDeZahl(results.beton.d, 1)} t CO₂e</strong>
                </div>
              </div>

              {/* Total Footprint Summary */}
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block"><MdText text={inhalt.texte.lebenszyklusBilanzNetto} /></span>
                  <strong className="text-sm font-bold text-slate-900 font-mono">
                    {formatDeZahl(results.beton.net, 1)}<MdText text={inhalt.texte.tCoÄquivalent} /></strong>
                </div>
                <span className="text-[10px] text-slate-500 max-w-[140px] text-right">
                  Über {formatDeWert(studyPeriod)}<MdText text={inhalt.texte.jahreBetriebszeit} /></span>
              </div>
            </div>

            {/* Card Variante B: Stahlverbund */}
            <div className="p-5 bg-white rounded-2xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Variante B</span>
                  <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.stahlverbundbrückeS355Beton} /></h5>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-shiraz font-mono">
                    {formatDeZahl(results.stahl.perM2Year, 2)}
                  </span>
                  <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.kgCoEM2} /></span>
                </div>
              </div>

              {/* Lifecycle Phase Breakdown Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600"><MdText text={inhalt.texte.herstellungA1A3Stahl} /></span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.stahl.a1a3, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600"><MdText text={inhalt.texte.transportMontageA4A5} /></span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.stahl.a4a5, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600"><MdText text={inhalt.texte.instandhaltungB2B52} />{formatDeWert(results.coatingCycles)}x Anstrich, {formatDeWert(results.asphaltCycles)}x Belag]:
                  </span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.stahl.b2b5, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15 bg-amber-50/50 px-2 rounded">
                  <span className="text-amber-900 font-semibold flex items-center gap-1">
                    <Car size={13} /><MdText text={inhalt.texte.modulB8Stauemissionen2} />{formatDeZahl(results.stahl.stautage, 0)} d):
                  </span>
                  <strong className="font-mono text-amber-950 font-bold">{formatDeZahl(results.stahl.b8, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15">
                  <span className="text-slate-600"><MdText text={inhalt.texte.rückbauDemontageC1C4} /></span>
                  <strong className="font-mono text-slate-900">{formatDeZahl(results.stahl.c, 1)} t CO₂e</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-home-grau/15 text-emerald-700">
                  <span><MdText text={inhalt.texte.modulD100Stahlschrott} /></span>
                  <strong className="font-mono">{formatDeZahl(results.stahl.d, 1)} t CO₂e</strong>
                </div>
              </div>

              {/* Total Footprint Summary */}
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block"><MdText text={inhalt.texte.lebenszyklusBilanzNetto2} /></span>
                  <strong className="text-sm font-bold text-slate-900 font-mono">
                    {formatDeZahl(results.stahl.net, 1)}<MdText text={inhalt.texte.tCoÄquivalent2} /></strong>
                </div>
                <span className="text-[10px] text-slate-500 max-w-[140px] text-right"><MdText text={inhalt.texte.sehrHohesModulD} /></span>
              </div>
            </div>

          </div>

          {/* Key Insights & Didactic Takeaways */}
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2 text-xs">
            <h5 className="font-bold text-shiraz flex items-center gap-1.5">
              <Info size={14} /><MdText text={inhalt.texte.didaktischeAuswertungNachDin} /></h5>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-relaxed">
              <li><MdText text={inhalt.texte.derStauImpactIm} />{formatDeZahl(results.beton.b8, 0)}<MdText text={inhalt.texte.tCoEEinen} /></li>
              <li><MdText text={inhalt.texte.materialspezifischeLebenszyklusEigenscha} /></li>
              <li><MdText text={inhalt.texte.vergleichsmaßstabNachEn17472} /></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
