import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Wrench, 
  Droplets, 
  Layers, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  FileText, 
  BookOpen,
  TrendingUp, 
  Zap, 
  Sliders, 
  Calculator, 
  GitCommit, 
  Compass, 
  Sparkles
} from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';

// Analytical approximation of Gauss error function erf(x)
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}

const InfoTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-2">
    <Info size={16} className="text-home-grau cursor-help" />
      <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-xs text-white bg-text-main rounded-lg shadow-lg -left-1/2 transform -translate-x-1/2">
        <FormulaText text={text} />
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-text-main rotate-45"></div>
      </div>
  </div>
);

export function Stahlbetoninstandhaltung() {
  const [activeTab, setActiveTab] = useState<'tr' | 'os' | 'en1504' | 'fortbildung' | 'regelwerke' | 'produkte' | 'rissinjektion' | 'chloridrechner'>('regelwerke');
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
    let packerSpacingMm = Math.round(bauteilDicke / 2);

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

  const szenarien = [
    {
      id: 'standsicherheit',
      title: 'Tragender Stützenfuß in einer Tiefgarage',
      problem: 'Schwere Frost-Tausalz-Schäden (Chloridbelastung) an statisch hoch belasteten Stützenfüßen.',
      regulatoryAnswer: 'Zwingend TR Instandhaltung (DIBt) anzuwenden!',
      details: 'Da die Standsicherheit des Gebäudes berührt ist, gilt die Technische Regel Instandhaltung von Betonbauwerken (TR Instandhaltung, DIBt) bauaufsichtlich verbindlich nach Einführung in der jeweiligen Landes-Verwaltungsvorschrift Technische Baubestimmungen. Ein zertifizierter Sachkundiger Planer (SKP) muss die Instandsetzungsplanung unterzeichnen, und qualifizierte Fachkräfte (z. B. mit SIVV-Schein) müssen die Ausführung überwachen. Die verwendeten Mörtel müssen eine CE-Kennzeichnung mit Leistungserklärung nach DIN EN 1504-x aufweisen.',
      badgeColor: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      id: 'balkon',
      title: 'Oberflächlicher Putzabplatz am privaten Balkon',
      problem: 'Lokale kosmetische Ausbrüche im Randbereich eines freitragenden Balkons (Standsicherheit unberührt).',
      regulatoryAnswer: 'Zivilrechtliche und vertragliche Grundlagen (z.B. DAfStb-Rili SIB / Branchenregeln)',
      details: 'Ist die Standsicherheit nachweislich unberührt, greift das Bauordnungsrecht hier nicht zwingend. Zur mangelfreien Durchführung wird bei privaten Verträgen (BGB/VOB) dennoch die Vereinbarung anerkannter Regeln der Technik dringend empfohlen. Hierbei dient die historische DAfStb-Richtlinie SIB oder anerkannte Fachregeln als hervorragender vertraglicher Standard.',
      badgeColor: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      id: 'produkt',
      title: 'Inverkehrbringen eines neuen Instandsetzungs-Produkts',
      problem: 'Ein Baustoffhersteller möchte einen neu entwickelten, carbonatisierungsbremsenden Anstrich in der EU vertreiben.',
      regulatoryAnswer: 'DIN EN 1504-2 (Harmonisierte europäische Produktnorm)',
      details: 'Das reine Bereitstellen und Verkaufen von Produkten auf dem europäischen Markt unterliegt rein der DIN EN 1504-Reihe (in diesem Fall Teil 2 für Oberflächenschutz). Das Produkt muss die europäische Konformitätsbewertung durchlaufen, ein CE-Zeichen besitzen und die deklarierten Mindestwerte nachweisen. Für den standsicherheitsrelevanten Einbau in DE fordert die TR Instandhaltung (Teil 3) zusätzlich die nationalen Konformitätsnachweise.',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'rissinjektion',
      title: 'Trennrisse im massiven Brückenüberbau',
      problem: 'Wasserführende Risse im Fahrbahnbereich einer Spannbetonbrücke gefährden die Spannstähle.',
      regulatoryAnswer: 'Kombination: Technische Regeln (ZTV-ING / TR Instandhaltung) + DIN EN 1504-5',
      details: 'Bei Bundesfernstraßen und kritischer Infrastruktur greifen die Regelwerke Hand in Hand. Die ZTV-ING (Zusätzliche Technische Vertragsbedingungen) schreibt die TR Instandhaltung für Planer und Firmen zwingend vor. Die Injektion darf ausschließlich von zertifizierten Fachkräften vorgenommen werden, während der Injektionsstoff die harmonisierten Kriterien der DIN EN 1504-5 (und das entsprechende nationale Sicherheitsniveau) erfüllen muss.',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  const riliSibPrinzipien = [
    {
      id: 'W',
      title: 'Prinzip W (Wassergehalt)',
      desc: 'Absenkung des Wassergehalts im Beton zur Reduzierung der elektrolytischen Leitfähigkeit.',
      details: 'Wird oft durch Oberflächenschutzsysteme (OS) erreicht. Ziel ist es, den Beton auszutrocknen, sodass die Korrosion der Bewehrung mangels Feuchtigkeit zum Erliegen kommt.',
      icon: <Droplets className="text-blue-500" size={24} />
    },
    {
      id: 'C',
      title: 'Prinzip C (Coating)',
      desc: 'Beschichtung der Bewehrung (Coating) zum Schutz vor korrosiven Einflüssen.',
      details: 'Verhindert den direkten Kontakt korrosiver Stoffe mit dem Stahl. Hinweis: In der TR Instandhaltung Teil 1 gelten Prinzipien und Verfahren nach DIN EN 1504-9 (Tab. 1 & 2).',
      icon: <Shield className="text-shiraz" size={24} />
    },
    {
      id: 'R',
      title: 'Prinzip R (Repassivierung)',
      desc: 'Repassivierung (Wiederherstellung des alkalischen Milieus) durch vollflächigen oder partiellen Betonersatz mit alkalischem Mörtel.',
      details: 'Der carbonatisierte oder chloridbelastete Beton wird abgetragen und durch einen neuen, hochalkalischen Mörtel (PCC/SPCC) ersetzt, der die Bewehrung wieder passiviert.',
      icon: <Wrench className="text-amber-600" size={24} />
    },
    {
      id: 'K',
      title: 'Prinzip K (Kathodischer Korrosionsschutz)',
      desc: 'Kathodischer Korrosionsschutz durch Anlegen eines elektrischen Gleichstroms oder durch Opferanoden.',
      details: 'Die Bewehrung wird kathodisch polarisiert, wodurch die anodische Teilreaktion (Eisenauflösung) thermodynamisch unterbunden wird.',
      icon: <Activity className="text-emerald-600" size={24} />
    }
  ];

  const osSysteme = [
    {
      id: 'OS 1',
      old: 'OS A',
      name: 'Hydrophobierung',
      use: 'Wasserabweisende Imprägnierung für nicht begehbare Flächen.',
      thickness: 'Keine Schichtdicke',
      crackBridging: 'Nein'
    },
    {
      id: 'OS 2',
      old: 'OS B',
      name: 'Beschichtung (nicht begehbar)',
      use: 'Farbige Beschichtung für Fassaden, Wände und Untersichten.',
      thickness: 'ca. 0,1 - 0,3 mm',
      crackBridging: 'Nein'
    },
    {
      id: 'OS 4',
      old: 'OS C',
      name: 'Beschichtung mit erhöhter Dichtheit, nicht rissüberbrückend',
      use: 'Für nicht begehbare Flächen mit erhöhtem Schutzbedarf.',
      thickness: 'ca. 0,3 - 1,0 mm',
      crackBridging: 'Nein'
    },
    {
      id: 'OS 5',
      old: 'OS D/II',
      name: 'Beschichtung mit erhöhter Rissüberbrückung',
      use: 'Für nicht begehbare Flächen mit höheren Anforderungen an die Rissüberbrückung.',
      thickness: 'ca. 1,0 - 2,0 mm',
      crackBridging: 'Ja (dynamisch)'
    },
    {
      id: 'OS 8',
      old: '-',
      name: 'Starre Beschichtung (befahrbar)',
      use: 'Für mechanisch stark belastete, befahrbare Flächen (z.B. Parkhäuser, Tiefgaragen) ohne Rissgefahr.',
      thickness: 'ca. 2,0 - 3,0 mm',
      crackBridging: 'Nein'
    },
    {
      id: 'OS 10',
      old: '-',
      name: 'Rissüberbrückende Beschichtung (befahrbar)',
      use: 'Für befahrbare Flächen mit Rissgefahr. Besteht aus einer rissüberbrückenden Dichtungsschicht und einer mechanisch belastbaren Nutzschicht.',
      thickness: 'ca. 4,0 - 5,0 mm',
      crackBridging: 'Ja (dynamisch)'
    },
    {
      id: 'OS 11',
      old: 'OS F',
      name: 'Rissüberbrückende Beschichtung (befahrbar)',
      use: 'Für befahrbare Flächen mit hoher dynamischer Rissgefahr (z.B. frei bewitterte Parkdecks). Oft als OS 11a (zwei Schichten) oder OS 11b (eine Schicht) ausgeführt.',
      thickness: 'ca. 3,0 - 5,0 mm',
      crackBridging: 'Ja (hoch dynamisch)'
    }
  ];

  const en1504Prinzipien = [
    { 
      id: 1, 
      code: 'PI', 
      name: 'Schutz gegen das Eindringen von Stoffen', 
      desc: 'Verhindert das Eindringen von flüssigen oder gasförmigen Stoffen (z.B. CO2, Wasser, Chloride).',
      examples: [
        'Applikation einer Hydrophobierung (OS 1) an Fassaden zur dauerhaften Wasserabweisung.',
        'Aufbringen einer carbonatisierungsbremsenden Beschichtung (OS 2/OS 4) auf Sichtbetonwänden.',
        'Füllen und Versiegeln von oberflächennahen Rissen mittels Epoxidharz-Injektion (nach DIN EN 1504-5).'
      ]
    },
    { 
      id: 2, 
      code: 'MC', 
      name: 'Feuchtigkeitsregulierung', 
      desc: 'Reguliert und hält den Feuchtigkeitsgehalt im Beton auf einem bestimmten Niveau.',
      examples: [
        'Aufbringen dampfdiffusionsoffener, aber flüssigkeitsdichter Beschichtungs- oder Imprägniersysteme.',
        'Erhalt der Diffusionsfähigkeit bei gleichzeitig verringertem porensaugenden Wassertransport.',
        'Installation hinterlüfteter Klimaschutzverkleidungen.'
      ]
    },
    { 
      id: 3, 
      code: 'CR', 
      name: 'Betonersatz', 
      desc: 'Wiederherstellung der ursprünglichen Form und Funktion des Betontragwerks durch Mörtel oder Beton.',
      examples: [
        'Händisches Reprofilieren lokaler Abplatzungen und Ausbrüche mit kunststoffmodifiziertem Zementmörtel (PCC).',
        'Vollflächiger Auftrag von Spritzmörtel oder Spritzbeton (SPCC) zur Wiederherstellung der Tragstruktur.',
        'Austausch schadhafter Betonabschnitte durch Gussbeton.'
      ]
    },
    { 
      id: 4, 
      code: 'SS', 
      name: 'Verstärkung', 
      desc: 'Erhöhung oder Wiederherstellung der Tragfähigkeit des Betontragwerks.',
      examples: [
        'Aufkleben hochfester Kohlenstofffaser-Lamellen (CFK) zur Biegungsverstärkung (z.B. an Balkenunterseiten).',
        'Einfräsen und Einkleben schlaffer oder vorgespannter Bewehrung in nachträglich erstellten Schlitzen.',
        'Säulen- oder Stützenumschnürung mittels CFK-Gelegen oder Stahlmänteln.'
      ]
    },
    { 
      id: 5, 
      code: 'PR', 
      name: 'Erhöhung der physikalischen Widerstandsfähigkeit', 
      desc: 'Verbesserung des Widerstands gegen mechanische Angriffe (z.B. Abrieb, Stoß).',
      examples: [
        'Aufbringen mineralischer Verschleißschichten mit Hartstoffzusätzen auf Industrieböden.',
        'Spezifische Dickbeschichtungen auf Epoxidharz- (EP) oder Polyurethanbasis (PU) an Rampen oder Fahrbahnen.'
      ]
    },
    { 
      id: 6, 
      code: 'RC', 
      name: 'Erhöhung der chemischen Widerstandsfähigkeit', 
      desc: 'Verbesserung des Widerstands gegen chemische Angriffe.',
      examples: [
        'Spezialbeschichtungen nach WHG (Wasserhaushaltsgesetz) an Auffangwannen in Tanklagern.',
        'Auskleidung von Abwasseranlagen und Klärschächten mit hochgradig säurefesten Spezialmörteln.'
      ]
    },
    { 
      id: 7, 
      code: 'RP', 
      name: 'Erhalt oder Wiederherstellung der Passivität', 
      desc: 'Schaffung chemischer Bedingungen, bei denen die Oberfläche der Bewehrung im passiven Zustand bleibt oder wieder passiviert wird.',
      examples: [
        'Abtrag des carbonatisierten Betons und Reprofilierung mit hochalkalischem PCC-Mörtel (pH > 12,5).',
        'Elektrochemische Realkalisierung (ER) des carbonatisierten Betonkerns durch zeitweisen Gleichstrom.',
        'Elektrochemische Chloridentfernung (ECE) zur Absenkung des Chloridgehalts.'
      ]
    },
    { 
      id: 8, 
      code: 'IR', 
      name: 'Erhöhung des elektrischen Widerstands', 
      desc: 'Erhöhung des elektrischen Widerstands des Betons zur Reduzierung der Korrosionsgeschwindigkeit.',
      examples: [
        'Applikation hochgradig diffusionsdichter Versiegelungen oder tiefergehender hydrophober Imprägnierungen.',
        'Durch Reduktion des feuchten Elektrolyten steigt der Innenwiderstand, und der Korrosionsstrom bricht zusammen.'
      ]
    },
    { 
      id: 9, 
      code: 'CC', 
      name: 'Kontrolle der kathodischen Bereiche', 
      desc: 'Schaffung von Bedingungen, bei denen kathodische Bereiche der Bewehrung keine Korrosion zulassen.',
      examples: [
        'Vollflächige Sauerstoff-Sperrbeschichtung (z.B. Epoxidharze) über den gesamten, auch unbeschädigten Bereich.',
        'Durch den Sauerstoffentzug wird die kathodische Reduktionsreaktion unterbunden.'
      ]
    },
    { 
      id: 10, 
      code: 'CP', 
      name: 'Kathodischer Korrosionsschutz', 
      desc: 'Anwendung eines elektrischen Potenzials zur Verhinderung der Korrosion.',
      examples: [
        'Installation eines KKS-Fremdstromsystems mittels edelmetallbeschichteter Titananodenbänder oder -netze.',
        'Anbringung und Einbettung galvanischer Opferankergürtel (z.B. Zink-Opferanoden) am Bauteil.'
      ]
    },
    { 
      id: 11, 
      code: 'CA', 
      name: 'Kontrolle der anodischen Bereiche', 
      desc: 'Schaffung von Bedingungen, bei denen anodische Bereiche der Bewehrung keine Korrosion zulassen (z.B. durch Inhibitoren).',
      examples: [
        'Einsatz migrierender Korrosionsinhibitoren (MCI), die aufgesprüht werden und bis zum Stahl wandern.',
        'Direkter Auftrag aktiver, zementgebundener Korrosionsschutzbeschichtungen auf die sandgestrahlte Bewehrung.'
      ]
    }
  ];

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

      {/* Tab Navigation as Buttons */}
      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'regelwerke' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('regelwerke')}>
          <BookOpen size={16} /> Regelwerke im Vergleich (TR vs. SIB vs. EN 1504)
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'tr' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('tr')}>
          <FileText size={16} /> TR Instandhaltung (Prinzipien)
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'os' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('os')}>
          <Layers size={16} /> Oberflächenschutzsysteme (OS)
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'en1504' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('en1504')}>
          <BookOpen size={16} /> DIN EN 1504 (Prinzipien)
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'produkte' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('produkte')}>
          <Wrench size={16} /> Instandsetzungsprodukte (RM/PCC)
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'fortbildung' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('fortbildung')}>
          <CheckCircle2 size={16} /> Qualifikation &amp; Zertifikate
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'rissinjektion' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('rissinjektion')}>
          <GitCommit size={16} /> Rissinjektion (DIN EN 1504-5)
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm ${
            activeTab === 'chloridrechner' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('chloridrechner')}>
          <Calculator size={16} /> Chloriddiffusion &amp; KKS
        </button>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        
        {/* TR Instandhaltung */}
        {activeTab === 'tr' && (
          <div className="space-y-6">
            <div className="bg-white border-y border-r border-l-4 border-blue-500 border-home-grau/20 p-4 rounded-xl">
              <h3 className="font-bold text-blue-800 flex items-center gap-2">
                <Info size={20} />
                Technische Regel Instandhaltung von Betonbauwerken (TR Instandhaltung, DIBt)
              </h3>
              <p className="text-blue-900 mt-2 text-sm">
                <FormulaText text="Die Technische Regel Instandhaltung von Betonbauwerken (TR Instandhaltung, DIBt) regelt die Planung und Ausführung der Instandhaltung von Betonbauwerken in Deutschland. Sie ist bauaufsichtlich verbindlich nach Einführung in der jeweiligen Landes-Verwaltungsvorschrift Technische Baubestimmungen. Prinzipien und Verfahren richten sich nach DIN EN 1504-9 (TR Instandhaltung Teil 1 Tab. 1 & 2)." />
              </p>
            </div>

            {/* Historisch: Instandsetzungsprinzipien der DAfStb-Rili-SIB (2001) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30 flex flex-col items-center justify-center">
              <h3 className="text-sm font-bold text-text-main mb-6 self-start">Historisch: Instandsetzungsprinzipien der DAfStb-Rili-SIB (2001)</h3>
              <svg width="100%" height="250" viewBox="0 0 800 250" className="max-w-3xl">
                <defs>
                  <pattern id="concrete-tr" patternUnits="userSpaceOnUse" width="20" height="20">
                    <circle cx="4" cy="4" r="1.5" fill="#cbd5e1" />
                    <circle cx="14" cy="12" r="2" fill="#cbd5e1" />
                    <circle cx="8" cy="18" r="1" fill="#cbd5e1" />
                  </pattern>
                  <pattern id="carbonated" patternUnits="userSpaceOnUse" width="10" height="10">
                    <path d="M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9" stroke="#f7ced6" strokeWidth="1" opacity="0.5" />
                  </pattern>
                  <pattern id="reprofiled" patternUnits="userSpaceOnUse" width="10" height="10">
                    <path d="M 0 0 L 10 10 M -1 9 L 1 11 M 9 -1 L 11 1" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
                  </pattern>
                </defs>

                {/* Base Concrete */}
                <rect x="50" y="50" width="700" height="150" fill="url(#concrete-tr)" stroke="#475569" strokeWidth="2" />
                
                {/* Rebar */}
                <line x1="50" y1="150" x2="750" y2="150" stroke="#1e293b" strokeWidth="12" />
                
                {/* Principle W: Water restriction */}
                <g transform="translate(100, 0)">
                  <rect x="0" y="45" width="120" height="5" fill="#475569" />
                  <path d="M 60 20 L 60 40 M 55 35 L 60 40 L 65 35" stroke="#475569" strokeWidth="2" fill="none" />
                  <text x="60" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">W</text>
                  <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#475569">Trocken</text>
                  {/* Carbonation front */}
                  <rect x="0" y="50" width="120" height="110" fill="url(#carbonated)" />
                  <line x1="0" y1="160" x2="120" y2="160" stroke="#A3113E" strokeWidth="2" strokeDasharray="4,4" />
                </g>

                {/* Principle C: Carbonation restriction */}
                <g transform="translate(260, 0)">
                  <rect x="0" y="45" width="120" height="5" fill="#A3113E" />
                  <path d="M 60 20 L 60 40 M 55 35 L 60 40 L 65 35" stroke="#A3113E" strokeWidth="2" fill="none" />
                  <text x="60" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#A3113E">C</text>
                  <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#475569">CO₂-dicht</text>
                  {/* Carbonation front stopped */}
                  <rect x="0" y="50" width="120" height="80" fill="url(#carbonated)" />
                  <line x1="0" y1="130" x2="120" y2="130" stroke="#A3113E" strokeWidth="2" strokeDasharray="4,4" />
                </g>

                {/* Principle R: Reprofiling */}
                <g transform="translate(420, 0)">
                  <path d="M 60 20 L 60 40 M 55 35 L 60 40 L 65 35" stroke="#475569" strokeWidth="2" fill="none" />
                  <text x="60" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">R</text>
                  {/* Reprofiled area */}
                  <rect x="0" y="50" width="120" height="120" fill="url(#reprofiled)" />
                  <rect x="0" y="50" width="120" height="120" fill="rgba(252, 211, 77, 0.2)" />
                  <text x="60" y="110" textAnchor="middle" fontSize="10" fill="#334155">Alkalisch</text>
                </g>

                {/* Principle K: Cathodic Protection */}
                <g transform="translate(580, 0)">
                  <path d="M 60 20 L 60 40 M 55 35 L 60 40 L 65 35" stroke="#334155" strokeWidth="2" fill="none" />
                  <text x="60" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#334155">K</text>
                  {/* Anode */}
                  <rect x="20" y="60" width="80" height="10" fill="#475569" />
                  {/* Current flow */}
                  <path d="M 60 70 L 60 140 M 55 135 L 60 140 L 65 135" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" fill="none" />
                  <text x="60" y="100" textAnchor="middle" fontSize="10" fill="#334155">Schutzstrom</text>
                  {/* Carbonation front */}
                  <rect x="0" y="50" width="120" height="110" fill="url(#carbonated)" />
                  <line x1="0" y1="160" x2="120" y2="160" stroke="#A3113E" strokeWidth="2" strokeDasharray="4,4" />
                </g>

                {/* Legend */}
                <g transform="translate(50, 220)">
                  <rect x="0" y="0" width="15" height="15" fill="url(#carbonated)" />
                  <text x="20" y="12" fontSize="12" fill="#475569">Carbonatisiert</text>
                  
                  <line x1="120" y1="7" x2="140" y2="7" stroke="#A3113E" strokeWidth="2" strokeDasharray="4,4" />
                  <text x="145" y="12" fontSize="12" fill="#475569">Carbonatisierungsfront</text>
                  
                  <rect x="300" y="0" width="15" height="15" fill="url(#reprofiled)" />
                  <rect x="300" y="0" width="15" height="15" fill="rgba(252, 211, 77, 0.2)" />
                  <text x="320" y="12" fontSize="12" fill="#475569">Reprofiliert (PCC)</text>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {riliSibPrinzipien.map((prinzip) => (
                <div key={prinzip.id} className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-off-white rounded-lg">
                      {prinzip.icon}
                    </div>
                    <h3 className="text-lg font-bold text-text-main">{prinzip.title}</h3>
                  </div>
                  <p className="text-text-main font-medium mb-3"><FormulaText text={prinzip.desc} /></p>
                  <p className="text-sm text-home-grau leading-relaxed"><FormulaText text={prinzip.details} /></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OS Systeme */}
        {activeTab === 'os' && (
          <div className="space-y-6">
            <div className="bg-white border-y border-r border-l-4 border-shiraz border-home-grau/20 p-4 rounded-xl">
              <h3 className="font-bold text-shiraz flex items-center gap-2">
                <Layers size={20} />
                Oberflächenschutzsysteme (OS-Systeme)
              </h3>
              <p className="text-text-main mt-2 text-sm">
                <FormulaText text="OS-Systeme dienen dem Schutz der Betonoberfläche vor dem Eindringen von Wasser und gelösten Stoffen (z.B. Chloriden) sowie der Begrenzung der Carbonatisierung. Sie sind ein wesentlicher Bestandteil der Prinzipien W und C." />
              </p>
            </div>

            {/* Schematische Darstellung OS */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-semibold mb-4 text-text-main">Schematische Darstellung: Aufbau von OS-Systemen</h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg width="100%" height="200" viewBox="0 0 600 200">
                  <defs>
                    <pattern id="concrete-os" patternUnits="userSpaceOnUse" width="20" height="20">
                      <circle cx="4" cy="4" r="1.5" fill="#cbd5e1" />
                      <circle cx="14" cy="12" r="2" fill="#cbd5e1" />
                      <circle cx="8" cy="18" r="1" fill="#cbd5e1" />
                    </pattern>
                  </defs>

                  {/* Betonuntergrund */}
                  <rect x="50" y="120" width="500" height="60" fill="url(#concrete-os)" stroke="#64748b" strokeWidth="2" />
                  <text x="300" y="155" fontSize="14" fill="#475569" textAnchor="middle" fontWeight="bold">Betonuntergrund</text>

                  {/* OS 1 (Hydrophobierung) */}
                  <g transform="translate(80, 0)">
                    <text x="40" y="30" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">OS 1</text>
                    <text x="40" y="45" fontSize="10" fill="#64748b" textAnchor="middle">Hydrophobierung</text>
                    {/* Eindringtiefe */}
                    <rect x="0" y="120" width="80" height="15" fill="#475569" opacity="0.3" />
                    <path d="M 0 120 Q 40 135 80 120" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="2 2" />
                    <text x="40" y="110" fontSize="10" fill="#475569" textAnchor="middle">Zieht ein</text>
                  </g>

                  {/* OS 4 (Beschichtung) */}
                  <g transform="translate(220, 0)">
                    <text x="40" y="30" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">OS 4</text>
                    <text x="40" y="45" fontSize="10" fill="#64748b" textAnchor="middle">Beschichtung</text>
                    {/* Beschichtung */}
                    <rect x="0" y="110" width="80" height="10" fill="#64748b" />
                    <text x="40" y="100" fontSize="10" fill="#475569" textAnchor="middle">Dünnschichtig</text>
                  </g>

                  {/* OS 8 (Starr, befahrbar) */}
                  <g transform="translate(360, 0)">
                    <text x="40" y="30" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">OS 8</text>
                    <text x="40" y="45" fontSize="10" fill="#64748b" textAnchor="middle">Starr, befahrbar</text>
                    {/* Grundierung */}
                    <rect x="0" y="115" width="80" height="5" fill="#94a3b8" />
                    {/* Nutzschicht */}
                    <rect x="0" y="95" width="80" height="20" fill="#475569" />
                    <text x="40" y="85" fontSize="10" fill="#475569" textAnchor="middle">Dickschichtig</text>
                  </g>

                  {/* OS 11 (Rissüberbrückend, befahrbar) */}
                  <g transform="translate(500, 0)">
                    <text x="40" y="30" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">OS 11</text>
                    <text x="40" y="45" fontSize="10" fill="#64748b" textAnchor="middle">Rissüberbrückend</text>
                    {/* Grundierung */}
                    <rect x="0" y="115" width="80" height="5" fill="#94a3b8" />
                    {/* Dichtungsschicht (elastisch) */}
                    <rect x="0" y="105" width="80" height="10" fill="#475569" />
                    {/* Nutzschicht */}
                    <rect x="0" y="90" width="80" height="15" fill="#475569" />
                    <text x="40" y="80" fontSize="10" fill="#475569" textAnchor="middle">Elastisch + Starr</text>
                  </g>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2">
                  Unterschiedliche OS-Systeme: Hydrophobierungen ziehen in den Beton ein, dünne Beschichtungen liegen auf, dicke Systeme (OS 8) bieten mechanischen Schutz, und mehrschichtige Systeme (OS 11) kombinieren eine elastische Dichtung mit einer harten Nutzschicht.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-home-grau/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-off-white border-b border-home-grau/30">
                    <tr>
                      <th className="p-4 font-semibold text-text-main">OS-System</th>
                      <th className="p-4 font-semibold text-text-main">Altbezeichnung</th>
                      <th className="p-4 font-semibold text-text-main">Art</th>
                      <th className="p-4 font-semibold text-text-main">Anwendungsbereich</th>
                      <th className="p-4 font-semibold text-text-main">Rissüberbrückend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/10">
                    {osSysteme.map((os, idx) => (
                      <tr key={idx} className="hover:bg-off-white/50 transition-colors">
                        <td className="p-4 font-bold text-shiraz whitespace-nowrap">{os.id}</td>
                        <td className="p-4 text-home-grau whitespace-nowrap">{os.old}</td>
                        <td className="p-4 font-medium text-text-main">{os.name}</td>
                        <td className="p-4 text-home-grau">{os.use}</td>
                        <td className="p-4">
                          {os.crackBridging.startsWith('Ja') ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-semibold">
                              <CheckCircle2 size={14} />
                              {os.crackBridging}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-home-grau bg-home-grau/10 px-2 py-1 rounded-md text-xs font-semibold">
                              {os.crackBridging}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DIN EN 1504 */}
        {activeTab === 'en1504' && (
          <div className="space-y-6">
            <div className="bg-white border-y border-r border-l-4 border-emerald-500 border-home-grau/20 p-4 rounded-xl">
              <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                <Shield size={20} />
                DIN EN 1504 (Produkte und Systeme für den Schutz und die Instandsetzung)
              </h3>
              <p className="text-emerald-900 mt-2 text-sm">
                <FormulaText text="Die europäische Normenreihe DIN EN 1504 definiert 11 Prinzipien für den Schutz und die Instandsetzung von Betontragwerken. Prinzipien 1-6 beziehen sich auf Betonschäden, Prinzipien 7-11 auf Bewehrungskorrosion." />
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {en1504Prinzipien.map((prinzip) => (
                <div key={prinzip.id} className="bg-white p-5 rounded-xl shadow-sm border border-home-grau/30 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-shiraz/5 flex items-center justify-center font-bold text-shiraz shrink-0 border border-shiraz/10">
                        {formatDeWert(prinzip.id)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-home-grau uppercase tracking-wider">{prinzip.code}</span>
                        <h4 className="font-bold text-text-main leading-tight">{prinzip.name}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-text-main/90 mb-4 bg-off-white p-3 rounded-lg border border-home-grau/10 min-h-[70px] flex items-center"><FormulaText text={prinzip.desc} /></p>
                  </div>
                  
                  {/* Examples Section */}
                  <div className="mt-2 border-t border-home-grau/30 pt-3">
                    <span className="text-xs font-bold text-shiraz uppercase tracking-wider block mb-2">Instandsetzungsverfahren:</span>
                    <ul className="list-disc pl-4 space-y-1.5">
                      {prinzip.examples.map((ex, exIdx) => (
                        <li key={exIdx} className="text-xs text-text-main leading-relaxed">
                          <FormulaText text={ex} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* DETAILED FOCUS SECTION: RISSINJEKTION & CARBONLAMELLEN */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6 mt-6">
              <h3 className="font-extrabold text-lg text-slate-950 flex items-center gap-2 border-b border-home-grau/20 pb-3">
                <Wrench className="text-shiraz" size={22} />
                Fokus-Sanierungsverfahren: Rissinjektion &amp; Carbonfaser-Ertüchtigung
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. RISSINJEKTION */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/25 space-y-4">
                  <h4 className="font-bold text-sm text-shiraz flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Droplets size={18} /> Rissinjektion &amp; Rissverpressung (DIN EN 1504-5)
                  </h4>
                  <p className="text-xs text-text-main/80 leading-relaxed">
                    Risse im Beton beeinträchtigen entweder die Dauerhaftigkeit (Zutritt von Chloriden und Sauerstoff zur Bewehrung) oder die Standsicherheit. Die Injektion füllt den Risshohlraum dauerhaft aus.
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/15 space-y-1">
                      <span className="font-bold text-xs text-slate-900 block">Klassifizierung der Injektionsstoffe (Füllgüter):</span>
                      <ul className="text-[11px] text-text-main/95 space-y-2 leading-relaxed">
                        <li>
                          <strong>U (Kraftschlüssiges Füllen / Kraftübertragend):</strong> Epoxidharze (EP) besitzen enorme Haft- und Zugfestigkeiten. Sie übertragen Zug- und Druckspannungen und stellen den Bauteilverbund wieder her (f_ct,EP &gt; 15 N/mm²).
                        </li>
                        <li>
                          <strong>D (Dehnfähiges Füllen / Abdichtend):</strong> Polyurethane (PUR). Ideal für bewegte Risse. Sie reagieren bei Wasserkontakt unter leichter Schaumbildung und dichten das Bauteil dauerhaft elastisch ab.
                        </li>
                        <li>
                          <strong>S (Quellfähiges Füllen):</strong> Acrylatgele. Werden vor allem für flächige Mauerwerksabdichtungen (Schleierinjektion) verwendet.
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/15 space-y-1">
                      <span className="font-bold text-xs text-slate-900 block">Mechanische Strömungsbeziehung (Hagen-Poiseuille):</span>
                      <p className="text-[11px] text-text-main/85 leading-relaxed">
                        Die Fließgeschwindigkeit des Injektionsharzes im Riss ist umgekehrt proportional zur dynamischen Viskosität (&eta;) und quadratisch abhängig von der Rissbreite (w). Feine Risse (w &lt; 0,2 mm) erfordern Viskositäten von &eta; &lt; 100 mPa·s und hohe Verpressdrücke.
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <span className="font-semibold text-xs text-slate-950 block mb-1.5">⚙️ Baustellenpraxis &amp; Qualitätssicherung:</span>
                      <ol className="list-decimal pl-4 text-[11px] text-text-main/80 space-y-1">
                        <li><strong>Packersetzung:</strong> Bohrpacker werden abwechselnd links und rechts des Risses unter einem Winkel von 45° gesetzt, um den Riss im Bauteilinneren zu kreuzen.</li>
                        <li><strong>Verdämmung:</strong> Der Rissspalt im Sichtbereich wird zugegipst oder mit Epoxidharz zugespachtelt, damit das Harz beim Verpressen nicht austritt.</li>
                        <li><strong>Verpressung:</strong> Von unten nach oben verpressen, bis das material am nächsten Packer austritt.</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* 2. CARBONLAMELLEN */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/25 space-y-4">
                  <h4 className="font-bold text-sm text-shiraz flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Layers size={18} /> Tragwerksertüchtigung mit Carbonlamellen (CFK)
                  </h4>
                  <p className="text-xs text-text-main/80 leading-relaxed">
                    Einführung höherer Lasten oder Korrosionsschäden verlangen oft eine Erhöhung des Bewehrungsquerschnitts. Kohlenstofffaserverstärkte Kunststoffe (CFK) bieten eine hochfeste, leichte Alternative zur klassischen Stahlbetonverstärkung.
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/15 space-y-1.5">
                      <span className="font-bold text-xs text-slate-900 block">Klassifizierung &amp; Anwendungstechnologien:</span>
                      <ul className="text-[11px] text-text-main/95 space-y-2 leading-relaxed">
                        <li>
                          <strong>Aufgeklebte Lamellen (Aussen):</strong> CFK-Lamellen werden mittels Epoxidharzkleber direkt auf die vorbehandelte Beton-Zugzone geklebt. Typisch bei Deckenbalken zur Biegemomenterhöhung.
                        </li>
                        <li>
                          <strong>In Schlitze eingeklebte Lamellen (Schlitzlamellen):</strong> Schlitze werden ca. 15-25 mm tief in den Beton gefräst. Kohlenstoff-Streifen werden hochkant eingeschlitzt und verklebt. Bietet extrem guten Verbund und ist brandschutztechnisch geschützter.
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/15 space-y-1">
                      <span className="font-bold text-xs text-slate-900 block">Bruchmechanischer Grenznachweis (Verbundbruch):</span>
                      <p className="text-[11px] text-text-main/85 leading-relaxed">
                        Die hohe Zugfestigkeit des CFK (ca. 3.000 N/mm²) kann nur ausgenutzt werden, wenn kein Schälbruch eintritt. Der Verbundversatz wird limitiert durch die maximale Verankerungskraft (F_bd), welche stark von der Betonzugfestigkeit abhängt:
                        <div className="bg-white p-2 rounded border border-home-grau/15 text-center my-1">
                          <BlockMath math="F_{bd} = b_f \cdot \sqrt{2 \cdot E_f \cdot t_f \cdot G_{cbd}}" />
                        </div>
                        Wobei G_cbd die spezifische Verbundenergie und E_f der Elastizitätsmodul des Materials sind. Die Betonoberflächen-Abreißfestigkeit muss zwingend ≥ 1,5 N/mm² betragen.
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <span className="font-semibold text-xs text-slate-950 block mb-1.5">🛡️ Brandschutz &amp; Einschränkung:</span>
                      <p className="text-[11px] text-text-main/80 leading-relaxed">
                        Epoxidharz-Klebstoffe sind hitzeempfindlich. Ab ca. 55-80°C (Glasübergangstemperatur T_g) verliert der Kleber seine Wirksamkeit. Daher müssen CFK-Systeme im Hochbau fast immer mit Brandschutzdecken oder dämmschichtbildenden Beschichtungen geschützt werden.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Didaktische Zusammenfassung */}
              <div className="p-3.5 bg-rose-50/40 border border-shiraz/20 rounded-xl text-xs text-slate-800 leading-relaxed">
                <span className="font-bold text-shiraz block">💡 Zusammenfassung für den Bauingenieur:</span>
                Die Kombination aus <strong>Rissinjektion</strong> (Beseitigung innerer Schwachstellen, Wiederherstellung Korrosionsschutz) und der Applikation von <strong>Carbonlamellen</strong> (Tragfähigkeitsertüchtigung im Zuggurt) ermöglicht ressourcenschonendes Bauen im Bestand ohne nennenswerte Bauwerkshöhenminderungen oder Eigengewichtserhöhung.
              </div>
            </div>
          </div>
        )}

        {/* Instandsetzungsprodukte (Mörtelsysteme) */}
        {activeTab === 'produkte' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border border-home-grau/30 text-text-main p-5 rounded-2xl shadow-sm">
              <h3 className="font-bold text-text-main text-base flex items-center gap-2">
                <Wrench className="text-shiraz" size={20} />
                Systematik der Instandsetzungsprodukte &amp; Betonersatzsysteme
              </h3>
              <p className="text-xs text-text-main/70 mt-1 leading-relaxed border-t border-home-grau/20 pt-2">
                Je nach Schadensbild, statischer Beanspruchung und Umgebungsfeuchte kommen verschiedene Mörtelsysteme nach DIN EN 1504-3 und der TR Instandhaltung (DIBt / ehemals DAfStb) zum Einsatz: CC, PCC, SPCC oder PC.
              </p>
            </div>

            {/* Mörtelsysteme Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'CC-Mörtel (RM)',
                  sub: 'Cementitious Mortar / Reparaturmörtel',
                  desc: 'Reine zementgebundene Mörtelsysteme ohne nennenswerten Polymerzusatz. Nur für statisch ruhende Bauteile geeignet.',
                  binder: 'Zement (starr)',
                  density: 'Sehr hoch (~2,2 kg/dm³)',
                  thickness: '10 - 50 mm (einlagig)',
                  eMod: 'Hoch (~25-35 GPa)',
                  shrink: 'Mittel bis hoch',
                  color: 'border-home-grau/30'
                },
                {
                  title: 'PCC-Mörtel',
                  sub: 'Polymer Cement Concrete',
                  desc: 'Kunststoffmodifizierter zementgebundener Mörtel (zweikomponentig). Standard bei dymamisch / thermisch belasteten Bauwerken.',
                  binder: 'Zement + Dispersionspulver/Acrylat',
                  density: 'Mittel (~2,0 kg/dm³)',
                  thickness: '5 - 40 mm (mehrlagig)',
                  eMod: 'Reduziert (~18-25 GPa)',
                  shrink: 'Sehr gering (durch Polymere)',
                  color: 'border-shiraz/50'
                },
                {
                  title: 'SPCC-Mörtel',
                  sub: 'Sprayed Polymer Cement Concrete',
                  desc: 'Spritzbarer, polymer-zementgebundener Mörtel. Ideal für großflächige Schichtdicken und maschinellen Einbau (z.B. Tunnel, Brücken).',
                  binder: 'Zement + spritzbare polymere Additive',
                  density: 'Hoch (durch Verdichtung)',
                  thickness: '20 - 80 mm (spritztechnisch)',
                  eMod: 'Mittel (~22-28 GPa)',
                  shrink: 'Gering',
                  color: 'border-home-grau/30'
                },
                {
                  title: 'PC-Mörtel',
                  sub: 'Polymer Concrete / Harzmörtel',
                  desc: 'Vollständig reaktionsharzgebundener Mörtel ohne Zementanteil. Extrem widerstandsfähig, chemisch hochresistent und wasserdicht.',
                  binder: 'Epoxidharz (EP) oder PUR + Sand',
                  density: 'Gering (~1,8 kg/dm³)',
                  thickness: '5 - 30 mm',
                  eMod: 'Sehr hoch / variabel (~15-40 GPa)',
                  shrink: 'Extrem gering',
                  color: 'border-amber-500'
                }
              ].map((m, idx) => (
                <div key={idx} className={`bg-white p-5 rounded-2xl border ${m.color} shadow-sm space-y-3 flex flex-col justify-between`}>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-950">{m.title}</h4>
                    <span className="text-xs text-slate-500 block uppercase font-mono font-bold tracking-wide">{m.sub}</span>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed min-h-[55px]">{m.desc}</p>
                  </div>
                  <div className="space-y-1.5 pt-3 border-t border-home-grau/30 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bindemittel:</span>
                      <strong className="font-semibold text-slate-800">{m.binder}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Schichtdicke:</span>
                      <span className="font-mono text-xs text-slate-800">{m.thickness}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">E-Modul:</span>
                      <span className="font-mono text-xs text-slate-800">{m.eMod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Schwindmaß:</span>
                      <span className="text-slate-800">{m.shrink}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Selector & Comparison table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              
              {/* Product Finder Panel */}
              <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-home-grau/25 shadow-sm space-y-4">
                <div className="border-b border-home-grau/30 pb-2">
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-shiraz">Interaktiver System-Finder</h4>
                  <p className="text-xs text-home-grau">Ermitteln Sie das passende Instandsetzungsprodukt für Ihren Anwendungsfall</p>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Select Application area */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">1. Bauteiltyp / Belastungsszenario:</label>
                    <div className="space-y-2">
                      {[
                        { id: 'wall', label: 'Feuchte Vertikalflächen (Wände, Pfeiler)', desc: 'Statischer Lastabtrag, vertikal oder Überkopf' },
                        { id: 'deck', label: 'Befahrbare Horizontalflächen', desc: 'Parkdecks, Rampen, mechanische Abnutzung' },
                        { id: 'balcony', label: 'Kosmetische Bauteile (Balkone, Brüstungen)', desc: 'Geringe statische Einwirkung, Witterung' },
                        { id: 'sewage', label: 'Chemischer Angriff (Kläranlagen, Kanäle)', desc: 'Säuren, Laugen, starke Zersetzungsgefahr' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setProductApp(item.id as any)}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all ${productApp === item.id ? 'bg-shiraz/5 border-shiraz font-bold' : 'bg-slate-50 border-home-grau/30 text-slate-700 hover:bg-slate-100'}`}
                        >
                          <div className="font-bold text-xs">{item.label}</div>
                          <div className="text-xs text-slate-500 font-normal">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Statische Mitwirkung */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">2. Statische Mitwirkung erforderlich? (Lastfortleitung)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setStatikRequired(true)}
                        className={`py-2 px-3 rounded-lg border text-center transition-all ${statikRequired ? 'bg-slate-800 text-white border-home-grau/30 font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                      >
                        Ja (Tragend)
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatikRequired(false)}
                        className={`py-2 px-3 rounded-lg border text-center transition-all ${!statikRequired ? 'bg-slate-800 text-white border-home-grau/30 font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                        style={{ background: !statikRequired ? '#1e293b' : '', color: !statikRequired ? '#ffffff' : '', borderColor: !statikRequired ? '#1e293b' : '' }}
                      >
                        Nein (Nicht tragend)
                      </button>
                    </div>
                  </div>

                  {/* Finder Recommendation Output */}
                  {(() => {
                    let recommendedType = '';
                    let mortarClass = '';
                    let detailDesc = '';
                    let minBond = '';
                    let protectiveMeasure = '';

                    if (productApp === 'wall') {
                      if (statikRequired) {
                        recommendedType = 'PCC II / SPCC';
                        mortarClass = 'R4 (statisch relevant)';
                        detailDesc = 'Verwendung von spritzbarem oder zweikomponentigem kunststoffmodifiziertem Zementmörtel (PCC/SPCC). Gewährleistet exzellenten Verankerungsverbund und Karbonatisierungsschutz.';
                        minBond = '≥ 2,0 MPa (nach Frost-Tausalz-Wechsel)';
                        protectiveMeasure = 'OS-System (z.B. OS 4 oder OS 2/3)';
                      } else {
                        recommendedType = 'CC-Mörtel oder PCC I';
                        mortarClass = 'R3 (statisch relevant oder nicht-statisch)';
                        detailDesc = 'Händischer Einbau eines CC-Reparaturmörtels (Klasse R3) möglich. Geringe Zugkräfte zu erwarten.';
                        minBond = '≥ 1,5 MPa';
                        protectiveMeasure = 'Standard-Acrylatbeschichtung (Prinzip C)';
                      }
                    } else if (productApp === 'deck') {
                      recommendedType = 'PCC I (Fließmörtel) / PC (Epoxid)';
                      mortarClass = 'R4 (Extrem verschleißfest)';
                      detailDesc = 'Hohe Anforderungen an dynamische Raddrucklasten und Tausalzbeständigkeit. Ein herkömmlicher CC-Mörtel bricht hier auf.';
                      minBond = '≥ 2,0 MPa';
                      protectiveMeasure = 'Zwingend OS 8 oder OS 11 (befahrbarer Oberflächenschutz)';
                    } else if (productApp === 'sewage') {
                      recommendedType = 'PC-Mörtel (Epoxidharzmörtel)';
                      mortarClass = 'R4 (Chemisch beständig, pH-Wert < 4)';
                      detailDesc = 'Säuren im Abwasser zerstören das zementöse Zementstein-Gefüge (Säureangriff/Entkalkung). Harzbindung ist absolut resistent.';
                      minBond = '≥ 2,0 MPa (Haftuntergrund meist staub- und ölfrei)';
                      protectiveMeasure = 'Chemische Beschichtung oder GFK-Systemausmauerung';
                    } else {
                      recommendedType = 'PCC / Händischer RM-Mörtel';
                      mortarClass = 'R2 / R3 (nicht statisch)';
                      detailDesc = 'Kosmetische Ausbrüche im Außenbereich können gut händisch mit gebrauchsfertigem PCC-Reparaturmörtel ausgebessert werden.';
                      minBond = '≥ 0,8 bis 1,5 MPa';
                      protectiveMeasure = 'Dünner carbonatisierungsbremsender Schutzanstrich (OS 1/4)';
                    }

                    return (
                      <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl space-y-2 mt-2">
                        <div className="text-xs">
                          <span className="text-slate-500 uppercase block font-bold text-xs">Empfohlene Systematik:</span>
                          <strong className="text-sm font-bold text-slate-900 block mt-0.5">{recommendedType}</strong>
                          <span className="inline-block mt-1 px-1.5 py-0.5 bg-shiraz/10 text-shiraz font-semibold text-xs rounded-md">{mortarClass}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-800 border-t border-home-grau/30 pt-1.5">{detailDesc}</p>
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-home-grau/30 text-xs">
                          <div>
                            <span className="text-slate-500 block">Mindesthaftzugfestigkeit:</span>
                            <strong className="font-semibold text-slate-800 font-mono">{minBond}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Zusatzschutz:</span>
                            <strong className="font-semibold text-slate-800">{protectiveMeasure}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Requirement Matrix Table */}
              <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-home-grau/25 shadow-sm space-y-3">
                <div className="border-b border-home-grau/30 pb-2 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-800">Prüfnachweise &amp; Mindest-Anforderungen</h4>
                    <p className="text-xs text-home-grau">Technische Leistungskriterien nach DIN EN 1504-3 (Tragfähigkeit)</p>
                  </div>
                  <span className="text-xs bg-slate-100 font-mono px-2 py-0.5 rounded font-bold">Instandsetzungs-Zulassung</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-home-grau/30 text-slate-600 font-bold uppercase tracking-wider">
                        <th className="p-2 font-bold">Leistungsmerkmal</th>
                        <th className="p-2 text-center">Klasse R1</th>
                        <th className="p-2 text-center">Klasse R2</th>
                        <th className="p-2 text-center font-bold text-slate-800 bg-slate-100/50">Klasse R3</th>
                        <th className="p-2 text-center font-bold text-shiraz bg-shiraz/5">Klasse R4</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11.5px] text-slate-700">
                      <tr>
                        <td className="p-2 font-bold text-slate-800">Druckfestigkeit (MPa)</td>
                        <td className="p-2 text-center font-mono">≥ 10</td>
                        <td className="p-2 text-center font-mono">≥ 15</td>
                        <td className="p-2 text-center font-mono font-semibold text-slate-800 bg-slate-100/40">≥ 25</td>
                        <td className="p-2 text-center font-mono font-semibold text-shiraz bg-shiraz/5">≥ 45</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-800">Chloridgehalt (%)</td>
                        <td className="p-2 text-center font-mono">≤ 0,05</td>
                        <td className="p-2 text-center font-mono">≤ 0,05</td>
                        <td className="p-2 text-center font-mono font-semibold text-slate-800 bg-slate-100/40">≤ 0,05</td>
                        <td className="p-2 text-center font-mono font-semibold text-shiraz bg-shiraz/5">≤ 0,05</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-800">Adhäsions-Haftzug (MPa)</td>
                        <td className="p-2 text-center font-mono">-</td>
                        <td className="p-2 text-center font-mono">≥ 0,8</td>
                        <td className="p-2 text-center font-mono font-semibold text-slate-800 bg-slate-100/40">≥ 1,5</td>
                        <td className="p-2 text-center font-mono font-semibold text-shiraz bg-shiraz/5">≥ 2,0</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-800">Karbonatisierungswid.</td>
                        <td className="p-2 text-center text-slate-400">Keine Anf.</td>
                        <td className="p-2 text-center text-slate-400">Keine Anf.</td>
                        <td className="p-2 text-center font-semibold text-emerald-700 bg-slate-100/40">Erforderlich</td>
                        <td className="p-2 text-center font-semibold text-emerald-700 bg-shiraz/5">Erforderlich</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-800">Modul Elastizität (GPa)</td>
                        <td className="p-2 text-center">-</td>
                        <td className="p-2 text-center">-</td>
                        <td className="p-2 text-center font-mono font-semibold text-slate-800 bg-slate-100/40">≥ 15</td>
                        <td className="p-2 text-center font-mono font-semibold text-shiraz bg-shiraz/5">≥ 20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-rose-50/50 border border-shiraz/20 p-3 rounded-lg text-slate-850 text-xs leading-relaxed space-y-1 mt-3">
                  <div className="font-bold text-shiraz flex items-center gap-1">
                    <Info size={13} />
                    Regelwerkzusammenhang:
                  </div>
                  <p>
                    Die Klassen <strong>R3</strong> und <strong>R4</strong> stellen statisch relevante Mörtelsysteme dar. Nach der Instandhaltungsrichtlinie (IhR) der DAfStb müssen Mörtelsysteme nicht nur Druckkräfte, sondern auch den Verbundnachweis under dynamischen Einflüssen fehlerfrei bestehen.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Fortbildungen / Qualifikationen */}
        {activeTab === 'fortbildung' && (
          <div className="space-y-6">
            <div className="bg-white border-y border-r border-l-4 border-amber-500 border-home-grau/20 p-4 rounded-xl">
              <h3 className="font-bold text-amber-800 flex items-center gap-2">
                <AlertTriangle size={20} />
                Qualifikationsanforderungen in der Betoninstandsetzung
              </h3>
              <p className="text-amber-900 mt-2 text-sm">
                Die Instandsetzung von Betonbauteilen erfordert spezielles Fachwissen, da Fehler schwerwiegende Folgen für die Standsicherheit und Dauerhaftigkeit haben können. Deshalb schreiben die relevanten Regelwerke besondere Qualifikationen für Planung und Ausführung vor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30">
                <h4 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
                  <BookOpen className="text-shiraz" size={20} />
                  SKP (Sachkundiger Planer)
                </h4>
                <p className="text-sm text-text-main mb-4">
                  <strong>Sachkundiger Planer für Schutz und Instandsetzung von Betonbauteilen</strong>
                  <br /><br />
                  Die Planung und Überwachung von Instandsetzungsmaßnahmen darf nach TR Instandhaltung nur von sachkundigen Planern durchgeführt werden. Der SKP ist verantwortlich für:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-home-grau">
                  <li>Ermittlung des Ist-Zustandes und der Schadensursachen</li>
                  <li>Erstellung des Instandsetzungskonzepts</li>
                  <li>Auswahl geeigneter Stoffe und Systeme (z.B. OS-Systeme, PCC)</li>
                  <li>Bauüberwachung und Qualitätssicherung</li>
                </ul>
                <div className="mt-4 p-3 bg-off-white rounded-lg text-xs text-text-main border border-home-grau/10">
                  <strong>Zugangsvoraussetzungen:</strong> I.d.R. abgeschlossenes Ingenieurstudium (Bauwesen) sowie Nachweis besonderer Kenntnisse durch Prüfung oder Zusatzausbildung.
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30">
                <h4 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
                  <Wrench className="text-shiraz" size={20} />
                  SIVV-Schein
                </h4>
                <p className="text-sm text-text-main mb-4">
                  <strong>Schützen, Instandsetzen, Verbinden und Verstärken von Betonbauteilen</strong>
                  <br /><br />
                  Fachkräfte in den ausführenden Unternehmen müssen nachweislich über die notwendigen verarbeitungstechnischen Kenntnisse verfügen. Der SIVV-Schein richtet sich primär an das Baustellenpersonal:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-home-grau">
                  <li>Untergrundvorbereitung und -prüfung</li>
                  <li>Verarbeitung von Instandsetzungsmörteln (z.B. PCC, SPCC)</li>
                  <li>Applikation von Oberflächenschutzsystemen</li>
                  <li>Risiko- und Fehlerminimierung auf der Baustelle</li>
                </ul>
                <div className="mt-4 p-3 bg-off-white rounded-lg text-xs text-text-main border border-home-grau/10">
                  <strong>Regelwerk:</strong> Nach TR Instandhaltung (bzw. DAfStb) ist der SIVV-Schein für das Aufsichtspersonal (Vorarbeiter, Poliere) auf der Baustelle vorgeschrieben.
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30 md:col-span-2">
                <h4 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
                  <Activity className="text-shiraz" size={20} />
                  Weitere Qualifikationen & Qualitätssicherung
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-off-white p-4 rounded-lg">
                    <strong className="text-text-main block mb-1">E-Schein (Erweiterte betontechnologische Kenntnisse)</strong>
                    <p className="text-home-grau">Berechtigt u.a. zur Überwachung von Beton der Überwachungsklassen 2 und 3. Erforderlich für den verantwortlichen Fachingenieur in Transportbetonwerken und Bauunternehmen.</p>
                  </div>
                  <div className="bg-off-white p-4 rounded-lg">
                    <strong className="text-text-main block mb-1">Düsenführerschein (SPCC / Spritzbeton)</strong>
                    <p className="text-home-grau">Spezieller Nachweis für das Personal, das den Spritzbeton oder Spritzmörtel an der Düse aufträgt (oft zwingend erforderlich bei Verstärkungsmaßnahmen).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regelwerke im Vergleich (TR vs SIB vs EN 1504) */}
        {activeTab === 'regelwerke' && (
          <div className="space-y-6">
            <div className="bg-white border-y border-r border-l-4 border-shiraz border-home-grau/20 p-4 rounded-xl">
              <h3 className="font-bold text-shiraz flex items-center gap-2 text-base">
                <BookOpen size={20} />
                Regelwerke in Deutschland: Wer regelt was und ab wann ist es gültig?
              </h3>
              <p className="text-text-main mt-2 text-sm leading-relaxed">
                Bei der Betoninstandsetzung treffen europäisches Produktrecht, deutsches Bauordnungsrecht (Öffentliches Recht) und Zivilrecht (Verträge) aufeinander. Das Verständnis über Rangordnung und Gültigkeitsbereich schützt Planer und Ausführende vor massiven Haftungsrisiken.
              </p>
            </div>

            {/* Die drei Hauptpfeiler */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TR Instandhaltung */}
              <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase font-extrabold tracking-widest text-[#475569] bg-sky-50 border border-sky-100 rounded-full px-2.5 py-0.5 inline-block mb-3">
                    Staatlich / Gesetzlich (Standsicherheit)
                  </div>
                  <h4 className="text-lg font-bold text-text-main mb-2">TR Instandhaltung</h4>
                  <p className="text-xs text-home-grau mb-3 leading-relaxed">
                    Herausgegeben vom Deutschen Institut für Bautechnik (DIBt). Regelt die statische Planung und standsicherheitsrelevante Ausführung.
                  </p>
                  <div className="border-t border-home-grau/30 pt-3 mt-2 space-y-2">
                    <span className="text-xs font-bold text-shiraz block">Gliederung / Struktur:</span>
                    <ul className="text-xs space-y-1 text-text-main list-disc pl-4">
                      <li><strong>Teil 1:</strong> Anwendungsbereich und Planung der Instandhaltung (Grundsätze, Standsicherheitsrelevanz, Schadensanalyse, Instandsetzungskonzept, Sachkundiger Planer SKP).</li>
                      <li><strong>Teil 2:</strong> Merkmale von Produkten oder Systemen für die Instandsetzung und Regelungen für deren Verwendung (Leistungsanforderungen mit Bezug auf DIN EN 1504-2 bis -7).</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/30">
                  <div className="bg-sky-50 text-sky-950 p-2.5 rounded text-xs">
                    <strong>Gültigkeit:</strong> Bauaufsichtlich verbindlich nach Einführung in der jeweiligen Landes-Verwaltungsvorschrift Technische Baubestimmungen. Jeder Eingriff in die tragende Struktur eines Bauwerks muss dieser Technischen Regel genügen. Löst das bauaufsichtliche Mandat der alten SIB-Richtlinie ab.
                  </div>
                </div>
              </div>

              {/* DAfStb RiLi-SIB */}
              <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 inline-block mb-3">
                    Historisch / Anerkannte Technikregel
                  </div>
                  <h4 className="text-lg font-bold text-text-main mb-2">Historisch: Instandsetzungsprinzipien der DAfStb-Rili-SIB (2001)</h4>
                  <p className="text-xs text-home-grau mb-3 leading-relaxed">
                    Vom Deutschen Ausschuss für Stahlbeton. Jahrzehntelang das Referenzwerk der Instandsetzung für Material, Ausführung und Entwurf.
                  </p>
                  <div className="border-t border-home-grau/30 pt-3 mt-2 space-y-2">
                    <span className="text-xs font-bold text-shiraz block">Gliederung / Struktur:</span>
                    <ul className="text-xs space-y-1 text-text-main list-disc pl-4">
                      <li><strong>Teil 1:</strong> Allgemeine Regelungen und Planungsgrundsätze.</li>
                      <li><strong>Teil 2:</strong> Bauprodukte und Anwendung.</li>
                      <li><strong>Teil 3:</strong> Anforderungen an die Betriebe und Überwachung der Ausführung.</li>
                      <li><strong>Teil 4:</strong> Prüfverfahren.</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/30">
                  <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded text-xs">
                    <strong>Gültigkeit: Nicht mehr bauaufsichtlich</strong>, aber weiterhin privatrechtlich (Anerkannte Regel der Technik für kosmetische/rein gebrauchstaugliche Sanierungen) relevant, solange kein Standsicherheitsrisiko vorliegt (z.B. optische Betonausbesserung ohne Einbezug von bewehrungsrelevanten Tragteilen).
                  </div>
                </div>
              </div>

              {/* DIN EN 1504 */}
              <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase font-extrabold tracking-widest text-purple-700 bg-purple-50 border border-purple-100 rounded-full px-2.5 py-0.5 inline-block mb-3">
                    Europäische Produktnorm
                  </div>
                  <h4 className="text-lg font-bold text-text-main mb-2">DIN EN 1504 Reihe</h4>
                  <p className="text-xs text-home-grau mb-3 leading-relaxed">
                    Harmonisierte europäische Norm. Regelt ausschließlich Eigenschaften, Prüfung und Deklaration der verwendeten Baustoffe/Systeme.
                  </p>
                  <div className="border-t border-home-grau/30 pt-3 mt-2 space-y-2">
                    <span className="text-xs font-bold text-shiraz block">Gliederung / Struktur:</span>
                    <ul className="text-xs space-y-1 text-text-main list-disc pl-4">
                      <li><strong>Teile 1-8:</strong> Definitionen für Oberflächenschutz (-2), Mörtel (-3), Statische Lastübertragung (-4), Rissinjektion (-5), Verankerung (-6).</li>
                      <li><strong>Teil 9:</strong> Allgemeine Prinzipien der Planung einer Instandsetzung (rein informativ).</li>
                      <li><strong>Teil 10:</strong> Baustellenanwendung und Qualitätsbewertung der Produkte.</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/30">
                  <div className="bg-purple-50 text-purple-950 p-2.5 rounded text-xs">
                    <strong>Gültigkeit: Ständig anwendbar für Produkte.</strong> Sie harmonisiert den Handel in der EU (CE-Kennzeichen). Sie regelt jedoch <em>nicht</em> die zulässige Bemessung, den standsicherheitsrelevanten Bauwerksentwurf oder die nationale Bauausführung in Deutschland!
                  </div>
                </div>
              </div>
            </div>

            {/* Interaktiver Szenarien-Check */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-home-grau/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Regelwerks-Kollision: Welches Regelwerk greift wann?</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Wählen Sie ein praxisnahes Beispiel aus, um zu überprüfen, welches Regelwerk vorrangig greift und welche Pflichten entstehen.
          </p>
        </div>
                <div className="shrink-0">
                  <select 
                    value={selectedScenario} 
                    onChange={(e) => setSelectedScenario(e.target.value)}
                    className="p-2 border border-home-grau/30 rounded-lg text-xs font-bold text-text-main bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-shiraz"
                  >
                    {szenarien.map((sz) => (
                      <option key={sz.id} value={sz.id}>{sz.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {szenarien.filter(s => s.id === selectedScenario).map((sz) => (
                <div key={sz.id} className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-sm space-y-4 animate-in fade-in duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/30 pb-3">
                    <span className="font-bold text-sm text-text-main">{sz.title}</span>
                    <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded inline-block border ${sz.badgeColor}`}>
                      {sz.regulatoryAnswer}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-off-white/60 p-3.5 rounded-lg border border-home-grau/10">
                      <span className="font-bold text-shiraz block mb-1">Schadenfall / Aufgabenstellung:</span>
                      <p className="text-text-main leading-relaxed">{sz.problem}</p>
                    </div>
                    <div className="bg-off-white/60 p-3.5 rounded-lg border border-home-grau/10">
                      <span className="font-bold text-emerald-700 block mb-1">Rechtliche & normative Einstufung:</span>
                      <p className="text-text-main leading-relaxed">{sz.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chronologische Übersicht */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="font-bold text-text-main text-base mb-4">Chronologische / Vertragliche Klarstellung</h3>
              <div className="space-y-3.5 text-xs text-text-main">
                <p>
                  Im Falle einer <strong>Abweichung</strong> zwischen den Richtlinien gilt folgende Daumenregel:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="p-3 bg-red-50/40 rounded-lg border border-red-100">
                    <span className="font-bold text-red-800 block mb-1">1. Standsicherheitsrelevante Bauteile (Gesetzliche Pflicht)</span>
                    Die <strong>TR Instandhaltung</strong> steht über allen anderen Regeln. Eine Abminderung oder Abweichung von ihren Vorgaben ohne bauaufsichtliche Zustimmung ist unzulässig.
                  </div>
                  <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100">
                    <span className="font-bold text-emerald-800 block mb-1">2. Vertraglicher Soll-Zustand (Privatwirtschaftlich)</span>
                    Liegt keine statische Relevanz vor, kann die ungeschmälerte <strong>DAfStb SIB</strong> als detaillierte Fachregel vereinbart werden, solange sie das Sicherheitsziel der TR nicht gefährdet.
                  </div>
                  <div className="p-3 bg-purple-50/40 rounded-lg border border-purple-100">
                    <span className="font-bold text-purple-800 block mb-1">3. Produkt-Eigenschaften (CE-Zeichen)</span>
                    Alle eingesetzten Mörtel, Anstriche und Injektionen müssen zwingend nach <strong>DIN EN 1504</strong> geprüft sein. Nationale Sonderanforderungen müssen über entsprechende Zusatzprüfungen deklariert sein.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab: Rissinjektion (DIN EN 1504-5 / ZTV-ING) --- */}
        {activeTab === 'rissinjektion' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border-y border-r border-l-4 border-shiraz border-home-grau/20 p-5 rounded-xl shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-home-grau/20">
                <h3 className="font-bold text-shiraz flex items-center gap-2 text-base">
                  <GitCommit size={20} />
                  Rissinjektion im Stahlbetonbau (DIN EN 1504-5 / DIN V 18028 / ZTV-ING)
                </h3>
                <span className="text-xs font-mono font-bold text-slate-500 bg-off-white px-2.5 py-1 rounded-lg border border-home-grau/20">
                  Prinzip 1 (PI) &bull; Prinzip 4 (SS)
                </span>
              </div>
              <p className="text-text-main/80 text-xs mt-3 leading-relaxed">
                Das Füllen von Rissen dient dem <strong>Schließen gegen das Eindringen korrosionsfördernder Stoffe</strong> (Feuchte, Chloride, CO₂), dem <strong>dauerhaft dehnfähigen Abdichten</strong> oder der <strong>kraftschlüssigen Wiederherstellung des statischen Bauteilverbundes</strong>. 
                Die Wahl des Füllguts (Epoxidharz, Polyurethan, Feinzementsuspension oder Acrylatgel) richtet sich streng nach Rissursache, Rissweitenänderung und Feuchtezustand.
              </p>
            </div>

            {/* Interactive Injection Configurator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Inputs Column */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/25 shadow-xs space-y-4 text-xs font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-home-grau/20">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sliders size={14} className="text-shiraz" /> Rissdiagnostik &amp; Parameter
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Befundaufnahme</span>
                </div>

                {/* Injektionsziel */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">1. Primäres Injektionsziel:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'kraftschluessig', label: 'Kraftschlüssig (F)', desc: 'Zug/Druck' },
                      { id: 'dehnfaehig', label: 'Dehnfähig (D)', desc: 'Bewegt' },
                      { id: 'abdichtend', label: 'Quellfähig (S)', desc: 'Schleier' }
                    ].map((target) => (
                      <button
                        key={target.id}
                        type="button"
                        onClick={() => setInjektionsZiel(target.id as any)}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          injektionsZiel === target.id 
                            ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs' 
                            : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] font-bold">{target.label}</div>
                        <div className={`text-[9px] ${injektionsZiel === target.id ? 'text-white/80' : 'text-slate-400'}`}>{target.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rissdynamik */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">2. Kinetik der Rissbewegung:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCrackActivity('ruhend')}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        crackActivity === 'ruhend' 
                          ? 'bg-slate-800 text-white border-slate-800 font-bold' 
                          : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-100'
                      }`}
                    >
                      Ruhender Riss (&Delta;w ≤ 0,05 mm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCrackActivity('dynamisch')}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        crackActivity === 'dynamisch' 
                          ? 'bg-slate-800 text-white border-slate-800 font-bold' 
                          : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-100'
                      }`}
                    >
                      Dynamisch / Bewegt (&Delta;w &gt; 0,05 mm)
                    </button>
                  </div>
                </div>

                {/* Feuchtezustand */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">3. Feuchtegrad im Rissquerschnitt:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'trocken', label: 'Trocken' },
                      { id: 'feucht', label: 'Mattfeucht' },
                      { id: 'drueckend', label: 'Drückend Wasser' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setCrackMoisture(m.id as any)}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          crackMoisture === m.id 
                            ? 'bg-blue-600 text-white border-blue-600 font-bold' 
                            : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[11px]">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rissbreite w Slider */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-800">4. Rissbreite (w):</label>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                      {formatDeZahl(crackWidth, 2)} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.05"
                    value={crackWidth}
                    onChange={(e) => setCrackWidth(parseFloat(e.target.value))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0,10 mm (Haarriss)</span>
                    <span>0,50 mm (Trennrisse)</span>
                    <span>1,50 mm (Klaffend)</span>
                  </div>
                </div>

                {/* Bauteildicke h Slider */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-800">5. Bauteildicke (h):</label>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                      {formatDeWert(bauteilDicke)} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="800"
                    step="50"
                    value={bauteilDicke}
                    onChange={(e) => setBauteilDicke(parseInt(e.target.value, 10))}
                    className="w-full accent-shiraz cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>150 mm (Wand/Decke)</span>
                    <span>400 mm (Bodenplatte)</span>
                    <span>800 mm (Massivbau)</span>
                  </div>
                </div>
              </div>

              {/* Output & SVG Visualization Column */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* Result Card */}
                <div className="p-5 rounded-2xl bg-white border border-home-grau/30 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-shiraz block">
                        Technologischer Injektionsplan
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">
                        {rissStats.harzTyp}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-800">
                      {rissStats.harzKlasse}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-off-white p-3.5 rounded-xl border border-home-grau/20">
                    {rissStats.detailVerfahren}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Packer-Abstand (&Delta;l)</span>
                      <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                        ≈ {formatDeWert(rissStats.packerSpacingMm)} mm
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Regel: &Delta;l = h / 2</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Zul. Verpressdruck (p_max)</span>
                      <div className="text-lg font-bold font-mono text-blue-700 mt-0.5">
                        ≤ {formatDeWert(rissStats.maxPressureBar)} bar
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Schutz vor Hydrofraktur</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Bohrloch-Winkel</span>
                      <div className="text-lg font-bold font-mono text-emerald-700 mt-0.5">
                        45&deg; zur Rissebene
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Wechselseitig versetzt</span>
                    </div>
                  </div>
                </div>

                {/* SVG Visual of Crack Injection */}
                <div className="bg-white border border-home-grau/30 rounded-2xl p-4 flex flex-col items-center justify-center text-text-main relative overflow-hidden shadow-xs">
                  <div className="w-full flex items-center justify-between pb-2 border-b border-home-grau/20 text-xs font-mono text-slate-700">
                    <span className="font-bold">Prinzipschnitt: Hochdruck-Rissinjektion mit Schraubpackern</span>
                    <span className="text-emerald-700 font-bold">&bull; ZTV-ING / DIN EN 1504-5</span>
                  </div>

                  <svg width="100%" height="220" viewBox="0 0 540 220" className="select-none mt-2">
                    {/* Concrete Cross-Section */}
                    <rect x="20" y="30" width="500" height="150" fill="#f8fafc" stroke="#64748b" strokeWidth="2" rx="4" />
                    <text x="35" y="50" fill="#475569" fontSize="10" fontWeight="bold">Betonbauteil (h = {formatDeWert(bauteilDicke)} mm)</text>

                    {/* Crack Line */}
                    <path
                      d="M 270 30 Q 265 70 273 110 T 268 180"
                      fill="none"
                      stroke={crackMoisture === 'drueckend' ? '#475569' : crackActivity === 'dynamisch' ? '#475569' : '#A3113E'}
                      strokeWidth={Math.max(2, crackWidth * 4)}
                    />

                    {/* Surface Verdämmung (Sealing Spachtel) */}
                    <rect x="250" y="24" width="40" height="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    <text x="270" y="19" fill="#475569" fontSize="9" textAnchor="middle" fontWeight="bold">Oberflächenverdämmung</text>

                    {/* Left Packer (drilled at 45 deg) */}
                    <g transform="translate(195, 105) rotate(-45)">
                      <rect x="-4" y="-30" width="8" height="55" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                      {/* Packer head outside */}
                      <circle cx="0" cy="-30" r="5" fill="#A3113E" />
                      <line x1="0" y1="-30" x2="-35" y2="-40" stroke="#A3113E" strokeWidth="1.5" />
                      <text x="-40" y="-42" fill="#A3113E" fontSize="9" textAnchor="end" fontWeight="bold">Packer 1 (45°)</text>
                    </g>

                    {/* Right Packer (drilled at 45 deg from opposite side) */}
                    <g transform="translate(345, 105) rotate(45)">
                      <rect x="-4" y="-30" width="8" height="55" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                      <circle cx="0" cy="-30" r="5" fill="#475569" />
                      <line x1="0" y1="-30" x2="35" y2="-40" stroke="#475569" strokeWidth="1.5" />
                      <text x="40" y="-42" fill="#334155" fontSize="9" fontWeight="bold">Packer 2 (versetzt)</text>
                    </g>

                    {/* Resin flow aura at crack intersection */}
                    <circle cx="270" cy="110" r="18" fill="rgba(225, 29, 72, 0.15)" className="animate-pulse" />
                    <circle cx="270" cy="110" r="4" fill="#A3113E" />

                    {/* Distance arrow between packers */}
                    <line x1="210" y1="195" x2="330" y2="195" stroke="#64748b" strokeWidth="1.5" />
                    <text x="270" y="210" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                      Abstand &Delta;l ≈ {formatDeWert(rissStats.packerSpacingMm)} mm
                    </text>
                  </svg>

                  <div className="w-full flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
                    <span>• Harzfluss von unten nach oben</span>
                    <span>• Nachinjektion bis blasenfreier Austritt</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* --- Tab: Chloriddiffusion & KKS (DIN EN ISO 12696) --- */}
        {activeTab === 'chloridrechner' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border-y border-r border-l-4 border-amber-600 border-home-grau/20 p-5 rounded-xl shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-home-grau/20">
                <h3 className="font-bold text-amber-800 flex items-center gap-2 text-base">
                  <Calculator size={20} />
                  Chloriddiffusion (Fick II) &amp; Kathodischer Korrosionsschutz (DIN EN ISO 12696)
                </h3>
                <span className="text-xs font-mono font-bold text-slate-500 bg-off-white px-2.5 py-1 rounded-lg border border-home-grau/20">
                  Prinzip R vs. Prinzip K (KKS)
                </span>
              </div>
              <p className="text-text-main/80 text-xs mt-3 leading-relaxed">
                Tausalze und Meerwasser transportieren Chloridionen (<FormulaText text="Cl^-" />) diffusiv durch die Betondeckung. 
                Erreicht die Chloridfront die Bewehrungsebene mit einer Konzentration <FormulaText text="C \ge 0.40 - 0.50\,\text{M.-\%}" /> (bezogen auf Zementmasse), wird die Passivschicht lokal zerstört &ndash; es droht <strong>rapider Lochfraß ohne vorherige Risswarnung</strong>.
              </p>
            </div>

            {/* Simulator Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Controls Column */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/25 shadow-xs space-y-4 text-xs font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-home-grau/20">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sliders size={14} className="text-amber-700" /> Diffusions-Parameter
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Ficksches Gesetz</span>
                </div>

                {/* Cs Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-800">Oberflächenchlorid (<FormulaText text="C_s" />):</label>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                      {formatDeZahl(chloridCs, 2)} M.-% / Zement
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="4.0"
                    step="0.1"
                    value={chloridCs}
                    onChange={(e) => setChloridCs(parseFloat(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block">Tausalz-Sprühnebel in Parkhaus oder Kappe</span>
                </div>

                {/* D_app Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-800">Diffusionskoeffizient (<FormulaText text="D_{\text{app}}" />):</label>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                      {formatDeZahl(diffD, 1)} · 10⁻¹² m²/s
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={diffD}
                    onChange={(e) => setDiffD(parseFloat(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block">Dichter Beton w/z ≤ 0,45: ~1,0; poröser Beton: &gt; 3,0</span>
                </div>

                {/* Alter t Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-800">Bauteilalter / Expositionsdauer (<FormulaText text="t" />):</label>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                      {formatDeWert(bauteilAlter)} Jahre
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={bauteilAlter}
                    onChange={(e) => setBauteilAlter(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>

                {/* Betondeckung c Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-800">Betondeckung (<FormulaText text="c_{\text{nom}}" />):</label>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                      {formatDeWert(betondeckung)} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="65"
                    step="5"
                    value={betondeckung}
                    onChange={(e) => setBetondeckung(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>

                {/* Status Callout */}
                <div className={`p-3.5 rounded-xl border mt-2 leading-relaxed ${
                  chloridStats.rebarStatus === 'critical'
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : chloridStats.rebarStatus === 'warning'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}>
                  <div className="font-bold text-xs flex items-center gap-1.5 mb-1">
                    {chloridStats.rebarStatus === 'critical' ? (
                      <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                    ) : (
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    )}
                    <span>
                      {chloridStats.rebarStatus === 'critical' 
                        ? 'Bewehrungsebene depassiviert!' 
                        : chloridStats.rebarStatus === 'warning'
                          ? 'Kritischer Schwellenbereich!'
                          : 'Bewehrung noch passiv geschützt'}
                    </span>
                  </div>
                  <p className="text-[11px]">
                    Chloridgehalt bei x = {formatDeWert(betondeckung)} mm: <strong>{formatDeZahl(chloridStats.cAtRebar, 2)} M.-%</strong> (Grenzwert: 0,50 M.-%).
                  </p>
                </div>
              </div>

              {/* Visualization & Strategy Column */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* SVG Chloridprofil Graph */}
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-home-grau/20">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 font-sans">
                      <TrendingUp size={15} className="text-amber-600" /> Berechnetes Chlorid-Tiefenprofil C(x)
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Fick II Diffusion
                    </span>
                  </div>

                  <div className="w-full bg-slate-50 border border-home-grau/25 rounded-xl p-3 flex flex-col items-center justify-center">
                    <svg width="100%" height="210" viewBox="0 0 500 210" className="select-none font-mono">
                      {/* Grid lines */}
                      <line x1="50" y1="30" x2="470" y2="30" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="50" y1="80" x2="470" y2="80" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="50" y1="130" x2="470" y2="130" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="50" y1="180" x2="470" y2="180" stroke="#94a3b8" strokeWidth="1.5" />

                      {/* Y-Axis Labels */}
                      <text x="42" y="34" fill="#64748b" fontSize="9" textAnchor="end">3,0%</text>
                      <text x="42" y="84" fill="#64748b" fontSize="9" textAnchor="end">2,0%</text>
                      <text x="42" y="134" fill="#64748b" fontSize="9" textAnchor="end">1,0%</text>
                      <text x="42" y="184" fill="#64748b" fontSize="9" textAnchor="end">0,0%</text>

                      {/* Critical Chlorid Threshold Line (0.50 M.-%) */}
                      {(() => {
                        // 0% at y=180, 3% at y=30 (range 150px for 3% -> 50px per 1%)
                        const yCrit = 180 - (0.50 * 50);
                        return (
                          <g>
                            <line x1="50" y1={yCrit} x2="470" y2={yCrit} stroke="#A3113E" strokeWidth="1.5" strokeDasharray="5,2" />
                            <text x="465" y={yCrit - 4} fill="#A3113E" fontSize="9" textAnchor="end" fontWeight="bold">
                              C_krit = 0,50 M.-% (Lochfraßgrenze)
                            </text>
                          </g>
                        );
                      })()}

                      {/* Rebar Position Vertical Line */}
                      {(() => {
                        // x in 0..65 mm mapped to 50..470 px (420px for 65mm -> 6.46 px/mm)
                        const pxRebar = 50 + betondeckung * (420 / 65);
                        return (
                          <g>
                            <line x1={pxRebar} y1="20" x2={pxRebar} y2="180" stroke="#475569" strokeWidth="2" strokeDasharray="4,3" />
                            <circle cx={pxRebar} cy="180" r="4" fill="#475569" />
                            <text x={pxRebar} y="16" fill="#334155" fontSize="9" textAnchor="middle" fontWeight="bold">
                              Bewehrung (c = {formatDeWert(betondeckung)} mm)
                            </text>
                          </g>
                        );
                      })()}

                      {/* Chloride Curve */}
                      {(() => {
                        const pathData = chloridStats.points.map((pt, idx) => {
                          const px = 50 + pt.x * (420 / 65);
                          const py = Math.max(25, 180 - Math.min(3.2, pt.c) * 50);
                          return `${idx === 0 ? 'M' : 'L'} ${px} ${py}`;
                        }).join(' ');

                        return (
                          <path
                            d={pathData}
                            fill="none"
                            stroke="#475569"
                            strokeWidth="2.5"
                          />
                        );
                      })()}

                      {/* X-Axis ticks */}
                      <text x="50" y="195" fill="#64748b" fontSize="9" textAnchor="middle">0 mm</text>
                      <text x="179" y="195" fill="#64748b" fontSize="9" textAnchor="middle">20 mm</text>
                      <text x="308" y="195" fill="#64748b" fontSize="9" textAnchor="middle">40 mm</text>
                      <text x="438" y="195" fill="#64748b" fontSize="9" textAnchor="middle">60 mm</text>
                      <text x="470" y="172" fill="#475569" fontSize="9" textAnchor="end">Tiefe x &rarr;</text>
                    </svg>
                  </div>
                </div>

                {/* Decision Comparison: Prinzip R (Abtrag) vs. Prinzip K (KKS) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                  
                  {/* Option A: Prinzip R */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/30 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-home-grau/20 pb-1.5">
                      <Wrench size={16} className="text-amber-700" />
                      <span>Option A: Prinzip R (HDW-Betonabtrag)</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      Konventioneller vollständiger Abtrag des Betons mit <FormulaText text="C \ge 0.50\,\text{M.-\%}" />.
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-[11px] space-y-1">
                      <div>
                        Erforderliche Abtragstiefe: <strong className="text-slate-900 font-mono">{formatDeWert(chloridStats.erfAbtrag)} mm</strong>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        (Depassivierungstiefe {formatDeZahl(chloridStats.depassivatedDepth, 0)} mm + 15 mm Hinterstemmung Bewehrung).
                      </div>
                    </div>
                    <span className="text-[10px] text-rose-700 block font-medium">
                      &bull; Hoher Substanzverlust, Sprießungsaufwand, Baulärm &amp; Erschütterung.
                    </span>
                  </div>

                  {/* Option B: Prinzip K (KKS) */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 border-b border-emerald-200 pb-1.5">
                      <Zap size={16} className="text-emerald-700" />
                      <span>Option B: Prinzip K (KKS nach ISO 12696)</span>
                    </div>
                    <p className="text-emerald-900 leading-relaxed text-[11px]">
                      Kathodischer Korrosionsschutz mittels Fremdstrom-Titananoden (MMO-Bänder).
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200 text-[11px] space-y-1">
                      <div>
                        100-mV-Depolarisationskriterium: <strong className="text-emerald-800 font-mono">&Delta;E ≥ 100 mV</strong>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Chloridbelasteter Beton verbleibt im Bauteil; Schutzstrom unterbindet Lochfraß.
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-800 block font-bold">
                      &bull; Ca. 70 % weniger Baustellenlärm &amp; CO₂; kein statischer Festigkeitsverlust.
                    </span>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    
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
          { title: 'Rissinjektion', url: 'https://de.wikipedia.org/wiki/Rissinjektion' }
        ]}
        regelwerke={[
          { title: 'DIBt Technische Regel Instandhaltung von Betonbauwerken (TR Instandhaltung Teile 1 und 2; Teil 1 Stand Mai 2020)', url: 'https://www.dibt.de/' },
          { title: 'DIN EN 1504 (Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken - Teile 1 bis 10)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+1504' },
          { title: 'DIN EN ISO 12696:2022-09 (Kathodischer Korrosionsschutz von Stahl in Beton)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+ISO+12696' },
          { title: 'ZTV-ING Teil 3: Massivbau (Bundesanstalt für Straßenwesen / BMVI)', url: 'https://www.bast.de/' },
          { title: 'DIN EN 1504-5 (Füllen von Rissen, Hohlräumen und Fehlstellen)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+1504-5' }
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
