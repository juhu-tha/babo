import { useState, useMemo } from 'react';
import {
  Wrench,
  Layers,
  CheckCircle2,
  FileText,
  BookOpen,
  Calculator,
  GitCommit
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { erf } from './stahlbetoninstandhaltung/hilfen';
import TrTab from './stahlbetoninstandhaltung/TrTab';
import OsTab from './stahlbetoninstandhaltung/OsTab';
import En1504Tab from './stahlbetoninstandhaltung/En1504Tab';
import ProdukteTab from './stahlbetoninstandhaltung/ProdukteTab';
import FortbildungTab from './stahlbetoninstandhaltung/FortbildungTab';
import RegelwerkeTab from './stahlbetoninstandhaltung/RegelwerkeTab';
import RissinjektionTab from './stahlbetoninstandhaltung/RissinjektionTab';
import ChloridrechnerTab from './stahlbetoninstandhaltung/ChloridrechnerTab';

type InstandhaltungTab = 'tr' | 'os' | 'en1504' | 'fortbildung' | 'regelwerke' | 'produkte' | 'rissinjektion' | 'chloridrechner';

const instandhaltungGruppen: readonly ModulTabGruppe<InstandhaltungTab>[] = [
  { id: 'regelwerke_gruppe', label: 'Regelwerke & Prinzipien', icon: BookOpen, mitglieder: [
    { id: 'regelwerke', label: 'Regelwerke im Vergleich', icon: BookOpen },
    { id: 'tr', label: 'TR Instandhaltung (Prinzipien)', icon: FileText },
    { id: 'en1504', label: 'DIN EN 1504 (Prinzipien)', icon: BookOpen },
  ] },
  { id: 'os_gruppe', label: 'Oberflächenschutzsysteme (OS)', icon: Layers, mitglieder: [{ id: 'os', label: 'Oberflächenschutzsysteme (OS)' }] },
  { id: 'produkte_gruppe', label: 'Instandsetzungsprodukte (RM/PCC)', icon: Wrench, mitglieder: [{ id: 'produkte', label: 'Instandsetzungsprodukte (RM/PCC)' }] },
  { id: 'riss_gruppe', label: 'Rissinjektion (DIN EN 1504-5)', icon: GitCommit, mitglieder: [{ id: 'rissinjektion', label: 'Rissinjektion (DIN EN 1504-5)' }] },
  { id: 'chlorid_gruppe', label: 'Chloriddiffusion & KKS', icon: Calculator, mitglieder: [{ id: 'chloridrechner', label: 'Chloriddiffusion & KKS' }] },
  { id: 'fortbildung_gruppe', label: 'Qualifikation & Zertifikate', icon: CheckCircle2, mitglieder: [{ id: 'fortbildung', label: 'Qualifikation & Zertifikate' }] },
];

export function Stahlbetoninstandhaltung() {
  const [activeTab, setActiveTab] = useState<InstandhaltungTab>('regelwerke');
  const [selectedScenario, setSelectedScenario] = useState<string>('standsicherheit');

  // Instandsetzungsprodukte Finder states
  const [productApp, setProductApp] = useState<'wall' | 'deck' | 'balcony' | 'sewage'>('wall');
  const [statikRequired, setStatikRequired] = useState<boolean>(true);

  // Rissinjektions-Rechner states
  const [crackActivity, setCrackActivity] = useState<'ruhend' | 'dynamisch'>('ruhend');
  const [crackMoisture, setCrackMoisture] = useState<'trocken' | 'feucht' | 'drueckend'>('trocken');
  const [crackWidth, setCrackWidth] = useState<number>(0.3); // mm
  const [bauteilDicke, setBauteilDicke] = useState<number>(300); // mm
  const [injektionsZiel, setInjektionsZiel] = useState<'kraftschluessig' | 'dehnfaehig' | 'abdichtend'>('kraftschluessig');

  // Chlorid-Diffusions-Simulator states
  const [chloridCs, setChloridCs] = useState<number>(2.5); // M.-% bezogen auf Zementmasse
  const [diffD, setDiffD] = useState<number>(2.0); // * 10^-12 m²/s
  const [bauteilAlter, setBauteilAlter] = useState<number>(25); // Jahre
  const [betondeckung, setBetondeckung] = useState<number>(35); // mm

  // Computed results for Chloriddiffusion
  const chloridStats = useMemo(() => {
    const tSeconds = bauteilAlter * 365.25 * 86400;
    const Dsi = diffD * 1e-12;
    const denom = 2 * Math.sqrt(Dsi * tSeconds);

    // Profile curve points: x in mm from 0 to 65 mm
    const points: { x: number; c: number }[] = [];
    let depassivatedDepth = 0;
    const critLimit = 0.50; // M.-% / Zement

    for (let x = 0; x <= 65; x += 2.5) {
      const xMeters = x * 1e-3;
      const arg = xMeters / denom;
      const cVal = chloridCs * (1 - erf(arg));
      points.push({ x, c: Math.max(0, cVal) });
      if (cVal >= critLimit) {
        depassivatedDepth = x;
      }
    }

    // Concentration at rebar position
    const cRebarMeters = betondeckung * 1e-3;
    const argRebar = cRebarMeters / denom;
    const cAtRebar = Math.max(0, chloridCs * (1 - erf(argRebar)));

    // Status: ok (< 0.40), warning (0.40 - 0.50), critical (>= 0.50)
    let rebarStatus: 'ok' | 'warning' | 'critical' = 'ok';
    if (cAtRebar >= 0.50) rebarStatus = 'critical';
    else if (cAtRebar >= 0.40) rebarStatus = 'warning';

    // Required removal depth for Principle R: depassivated depth + 15 mm Hinterstemmung
    const erfAbtrag = depassivatedDepth > 0 ? depassivatedDepth + 15 : 0;

    return {
      points,
      cAtRebar,
      rebarStatus,
      depassivatedDepth,
      erfAbtrag,
      critLimit
    };
  }, [chloridCs, diffD, bauteilAlter, betondeckung]);

  // Computed recommendation for Rissinjektion
  const rissStats = useMemo(() => {
    let harzTyp = '';
    let harzKlasse = '';
    let detailVerfahren = '';
    let maxPressureBar = 0;
    const packerSpacingMm = Math.round(bauteilDicke / 2);

    // Max zulässiger Verpressdruck nach ZTV-ING (Faustregel: p_max <= 0.5 * fctm * 10 bar, ca. 15-30 bar)
    // Bei dünnen Bauteilen oder oberflächennahen Rissen Begrenzung auf 10-20 bar zur Vermeidung von Betonabplatzungen
    maxPressureBar = Math.min(35, Math.max(12, Math.round(bauteilDicke * 0.08)));

    if (crackMoisture === 'drueckend') {
      harzTyp = '2-Stufen-Verpressung: 2K-PUR-Schnellschaum + nachfolgendes PUR-Harz';
      harzKlasse = 'D 1.1 / W-Stopp nach DIN EN 1504-5';
      detailVerfahren = '1. Stufe: Hochreaktiver PUR-Injektionsschaum stoppt den aktiven Wassereinbruch durch extreme Volumenexpansion (~20- bis 30-fach). 2. Stufe: Nachinjektion mit elastischem, volumenbeständigem Polyurethanharz zur dauerhaften Rissabdichtung.';
    } else if (crackActivity === 'dynamisch' || injektionsZiel === 'dehnfaehig') {
      harzTyp = 'Polyurethanharz (PUR)';
      harzKlasse = 'Klasse D (Dehnfähig) nach DIN EN 1504-5';
      detailVerfahren = 'Elastomerer Verschluss für temperatur- oder lastbedingte Rissweitenänderungen. Hohe Dehnbarkeit (> 10 %) gewährleistet dauerhafte Dichtigkeit ohne Rissabriss an den Flanken.';
    } else if (injektionsZiel === 'kraftschluessig') {
      if (crackWidth < 0.20) {
        harzTyp = 'Niedrigviskoses Epoxidharz (EP)';
        harzKlasse = 'Klasse F (Kraftübertragend) nach DIN EN 1504-5';
        detailVerfahren = 'Sehr niedrige Viskosität (< 150 mPa·s) ermöglicht vollständige Penetration selbst in feinste Mikrorisse (w < 0,2 mm). Stellt Zug- und Druckfestigkeit voll wieder her (fh > 3,0 MPa). Untergrund muss trocken oder mattfeucht sein.';
      } else {
        harzTyp = 'Epoxidharz (EP) oder Feinzementsuspension (ZS)';
        harzKlasse = 'Klasse F (Kraftübertragend) nach DIN EN 1504-5 / DIN V 18028';
        detailVerfahren = 'Bei Rissbreiten w >= 0,2 mm kann neben EP auch hochfließfähige Feinzementsuspension (w/z-Wert ~0.4) wirtschaftlich verpresst werden. ZS ist unempfindlich gegenüber Feuchte und bietet natürlichen Passivierungsschutz.';
      }
    } else {
      harzTyp = 'Polyacrylatgel (PC) / Schleierinjektion';
      harzKlasse = 'Klasse S (Quellfähig) nach DIN EN 1504-5';
      detailVerfahren = 'Hydrostrukturgel mit wasserähnlicher Viskosität (~2-5 mPa·s). Reversibel quellfähig, ideal zur rückwärtigen Baugrund- oder Fugenabdichtung.';
    }

    return {
      harzTyp,
      harzKlasse,
      detailVerfahren,
      maxPressureBar,
      packerSpacingMm
    };
  }, [crackActivity, crackMoisture, crackWidth, bauteilDicke, injektionsZiel]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-shiraz/10 rounded-xl flex items-center justify-center text-shiraz shrink-0">
            <Wrench size={24} />
          </div>
          <div className="space-y-2 flex-1">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">Instandhaltung im Massivbau</h2>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Dieses Modul bietet eine Übersicht über die Instandsetzungsprinzipien und Schutzsysteme für Massivbau- und Stahlbetonbauwerke nach der 
                <strong> Technischen Richtlinie (TR) Instandhaltung</strong> (ehemals DAfStb-Richtlinie) und der europäischen Norm <strong>DIN EN 1504</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reiter: 6 thematische Hauptbereiche, Regelwerke mit zweiter Ebene (AP 3.8) */}
      <GruppierteModuleTabs
        label="Bereiche der Instandhaltung"
        gruppen={instandhaltungGruppen}
        aktiv={activeTab}
        onWechsel={setActiveTab}
        className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20"
      >

      {/* Content Area */}
      <div className="mt-6">
        
        {/* TR Instandhaltung */}
        {activeTab === 'tr' && <TrTab />}

        {/* OS Systeme */}
        {activeTab === 'os' && <OsTab />}

        {/* DIN EN 1504 */}
        {activeTab === 'en1504' && <En1504Tab />}

        {/* Instandsetzungsprodukte (Mörtelsysteme) */}
        {activeTab === 'produkte' && <ProdukteTab productApp={productApp} setProductApp={setProductApp} setStatikRequired={setStatikRequired} statikRequired={statikRequired} />}

        {/* Fortbildungen / Qualifikationen */}
        {activeTab === 'fortbildung' && <FortbildungTab />}

        {/* Regelwerke im Vergleich (TR vs SIB vs EN 1504) */}
        {activeTab === 'regelwerke' && <RegelwerkeTab selectedScenario={selectedScenario} setSelectedScenario={setSelectedScenario} />}

        {/* --- Tab: Rissinjektion (DIN EN 1504-5 / ZTV-ING) --- */}
        {activeTab === 'rissinjektion' && <RissinjektionTab bauteilDicke={bauteilDicke} crackActivity={crackActivity} crackMoisture={crackMoisture} crackWidth={crackWidth} injektionsZiel={injektionsZiel} rissStats={rissStats} setBauteilDicke={setBauteilDicke} setCrackActivity={setCrackActivity} setCrackMoisture={setCrackMoisture} setCrackWidth={setCrackWidth} setInjektionsZiel={setInjektionsZiel} />}

        {/* --- Tab: Chloriddiffusion & KKS (DIN EN ISO 12696) --- */}
        {activeTab === 'chloridrechner' && <ChloridrechnerTab bauteilAlter={bauteilAlter} betondeckung={betondeckung} chloridCs={chloridCs} chloridStats={chloridStats} diffD={diffD} setBauteilAlter={setBauteilAlter} setBetondeckung={setBetondeckung} setChloridCs={setChloridCs} setDiffD={setDiffD} />}

      </div>
      </GruppierteModuleTabs>
    
      <CalculatorDisclaimerBanner className="my-2" />
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Schutzstrombedarf einer KKS-Anlage"
        zielGleichung="I = A_s \cdot i_{Schutz}"
        schritte={[
          { titel: 'Stahloberfläche', erklaerung: 'Parkdeck 600 m², Bewehrungsoberfläche je m² Bauteilfläche ca. 0,7 m²:', formel: 'A_s = 600 \\cdot 0{,}7 = 420\\,\\text{m}^2' },
          { titel: 'Schutzstromdichte', erklaerung: 'Für chloridbelasteten Beton ist ein Bereich von etwa 2 bis 20 mA/m² Stahloberfläche üblich; gewählt 10 mA/m²:', formel: 'i_{Schutz} = 10\\,\\text{mA/m}^2' },
          { titel: 'Gesamtstrom', erklaerung: 'Auslegung der Gleichrichter:', formel: 'I = 420 \\cdot 0{,}010 = 4{,}2\\,\\text{A}' }
        ]}
        ergebnisHinweis="Der tatsächliche Strom wird über die Schutzkriterien eingestellt (Ausschaltpotential bzw. Depolarisation ≥ 100 mV in 24 h). Planung und Inbetriebnahme durch KKS-Fachpersonal nach DIN EN ISO 12696:2022-09."
        normQuelle="DIN EN ISO 12696:2022-09"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Füllgutbedarf für eine Rissinjektion"
        zielGleichung="V = L \cdot w \cdot t \cdot f_V"
        schritte={[
          { titel: 'Rissgeometrie', erklaerung: 'Trennriss in einer 250 mm dicken Wand, Länge 4,0 m, mittlere Breite 0,30 mm:', formel: 'V_{Riss} = 4{,}0 \\cdot 0{,}00030 \\cdot 0{,}25 = 0{,}30 \\cdot 10^{-3}\\,\\text{m}^3' },
          { titel: 'Zuschlag', erklaerung: 'Füllgutverluste in Packern, Schläuchen und Hohlräumen (Faktor 1,5):', formel: 'V = 0{,}30\\,\\text{l} \\cdot 1{,}5 = 0{,}45\\,\\text{l}' },
          { titel: 'Füllgutwahl', erklaerung: 'Trockener, ruhender Riss mit kraftschlüssiger Anforderung:', formel: '\\text{EP-Injektion (DIN EN 1504-5)}' }
        ]}
        ergebnisHinweis="Bei wasserführenden Rissen oder Rissbewegung sind PUR- bzw. dehnfähige Füllgüter und ggf. eine Fuge erforderlich; der sachkundige Planer legt das Füllgut nach TR Instandhaltung fest."
        normQuelle="DIN EN 1504-5; TR Instandhaltung (DIBt)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="instandhaltung" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 12 Schutz & Instandsetzung: TR Instandhaltung, OS-Systeme, KKS und Rissfüllung geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        weblinks={[
          { title: 'Beton.wiki: Instandhaltung von Betonbauwerken', url: 'https://beton.wiki/index.php?title=Instandsetzung' },
          { title: 'Deutscher Beton- und Bautechnik-Verein (DBV): Instandhaltungsleitfäden', url: 'https://www.betonverein.de/' },
          { title: 'DIBt: Technische Regeln Instandhaltung von Betonbauwerken (MVV TB)', url: 'https://www.dibt.de' }
        ]}
        wikipedia={[
          { title: 'Betoninstandsetzung', url: 'https://de.wikipedia.org/wiki/Betoninstandsetzung' },
          { title: 'Oberflächenschutzsystem', url: 'https://de.wikipedia.org/wiki/Oberfl%C3%A4chenschutzsystem' },
          { title: 'Kathodischer Korrosionsschutz', url: 'https://de.wikipedia.org/wiki/Kathodischer_Korrosionsschutz' },
          { title: 'Rissinjektion' }
        ]}
        regelwerke={[
          { title: 'DIBt Technische Regel Instandhaltung von Betonbauwerken (TR Instandhaltung Teile 1 und 2; Teil 1 Stand Mai 2020)', url: 'https://www.dibt.de/' },
          { title: 'DIN EN 1504 (Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken - Teile 1 bis 10)' },
          { title: 'DIN EN ISO 12696:2022-09 (Kathodischer Korrosionsschutz von Stahl in Beton)' },
          { title: 'ZTV-ING Teil 3: Massivbau (Bundesanstalt für Straßenwesen / BMVI)', url: 'https://www.bast.de/' },
          { title: 'DIN EN 1504-5 (Füllen von Rissen, Hohlräumen und Fehlstellen)' }
        ]}
        literatur={[
          'Raupach, M.; Orlowsky, J.: Erhaltung von Betonbauwerken. Wiesbaden: Vieweg+Teubner 2008',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Zilch, K.; Diederichs, C. J. et al.: Handbuch für Bauingenieure (Springer Vieweg)',
          'Gieler, R. P.; Dimmig-Osburg, A.: Kunststoffe für den Bautenschutz und die Betoninstandsetzung. Basel: Birkhäuser 2006'
        ]}
        formeln={[
          {
            formel: 'x_c(t) = k_c \\cdot \\sqrt{t}',
            erklaerung: 'Quadratisches Wurzel-Zeit-Gesetz der Carbonatisierungsfront nach Fickschen Diffusionsgesetzen: xc = Carbonatisierungstiefe [mm], kc = Progressionsbeiwert, t = Bauteilalter [Jahre]. Wenn xc die Bewehrungstiefe c erreicht, entfällt die Passivierung.',
            quelle: 'TR Instandhaltung / DAfStb'
          },
          {
            formel: 'C(x, t) = C_s \\cdot \\left[ 1 - \\text{erf}\\left( \\frac{x}{2\\sqrt{D_{app} \\cdot t}} \\right) \\right]',
            erklaerung: 'Chloriddiffusion in die Randzone nach Fick II: C(x,t) = Chloridgehalt in Tiefe x nach Zeit t, Cs = Oberflächenchloridgehalt, Dapp = scheinbarer Diffusionskoeffizient, erf = Gaußsche Fehlerfunktion. Kritischer Grenzwert: ca. 0,40 - 0,50 M.-% bezogen auf Zementmasse.',
            quelle: 'Ficksches Gesetz / DAfStb-Heft 510'
          },
          {
            formel: 'E_{\\text{off}} \\le -720\\,\\text{mV}_{\\text{Ag/AgCl/0{,}5M KCl}} \\quad \\text{oder} \\quad \\Delta E_{\\text{depol}} \\ge 100\\,\\text{mV}',
            erklaerung: 'KKS-Schutzkriterien nach DIN EN ISO 12696: Ausschaltpotential negativer als −720 mV gegen Ag/AgCl/0,5 M KCl ODER Depolarisation ≥ 100 mV innerhalb von 24 h bis 72 h.',
            quelle: 'DIN EN ISO 12696'
          }
        ]}
      />
    </div>
  );
}
