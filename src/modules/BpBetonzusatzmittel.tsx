import React, { useState } from 'react';
import { 
  Layers, 
  Droplet, 
  BookOpen, 
  CheckCircle2, 
  Lightbulb, 
  ClipboardList, 
  Info, 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  Activity, 
  ChevronRight, 
  Scale, 
  Percent, 
  FileText, 
  Atom, 
  Gauge, 
  Check, 
  X, 
  Settings 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InlineMath } from 'react-katex';
import { PraxisTabContent, InnovationTabContent } from '@/src/components/ui/InnovationPraxisSection';

export interface AdmixtureProduct {
  name: string;
  abbreviation: string;
  standard: string;
  chemicalBase: string;
  dosageCode: string;
  primaryEffect: string;
  secondaryEffect: string;
  mechanism: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  classificationCode: string;
}

const admixtureProducts: AdmixtureProduct[] = [
  {
    name: 'Betonverflüssiger',
    abbreviation: 'BV',
    standard: 'DIN EN 934-2 (Tabelle 2)',
    chemicalBase: 'Ligninsulfonate (LSA), Melaminsulfonate (MFS), Naphthalinsulfonate (NFS)',
    dosageCode: '0,2 - 0,5 M.-% vom Zementgewicht',
    primaryEffect: 'Wasserreduktion um ca. 5 bis 12 % bei konstantem Ausbreitmaß.',
    secondaryEffect: 'Verbesserte Frischbetonkonsistenz und glattere Sichtbetonoberflächen.',
    mechanism: 'Reine elektrostatische Abstoßung durch Adsorption negativ geladener Tensidgruppen auf den Klinkeroberflächen (Zeta-Potenzial-Verschiebung).',
    description: 'Klassische Zusatzmittel der ersten und zweiten Generation. Durch die Ladungsabstoßung werden Zementagglomerate mechanisch aufgebrochen, wodurch eingeschlossenes Trennwasser mobilisiert wird. Ideal für normale Festigkeitsklassen im Transportbetonwerk.',
    advantages: [
      'Günstige Rohstoffbasis',
      'Breite bewährte Kompatibilität mit Standard-Portlandzementen',
      'Leichte Dosierbarkeit im Transportbeton'
    ],
    disadvantages: [
      'Geringes Verflüssigungspotenzial bei niedrigen w/z-Werten (< 0,45)',
      'Neigung zu verzögerter Anfangshydratation bei Überdosierung (speziell LSA)'
    ],
    classificationCode: 'Wirkungsgruppe BV - DIN EN 934-2 Tab. 2'
  },
  {
    name: 'Fließmittel',
    abbreviation: 'FM',
    standard: 'DIN EN 934-2 (Tabelle 3.1 & 3.2)',
    chemicalBase: 'Polycarboxylatether (PCE), modifizierte Polycarboxylate',
    dosageCode: '0,2 - 2,5 M.-% vom Zementgewicht',
    primaryEffect: 'Wasserreduktion um bis zu 30 % bei extrem gesteigerter Fließfähigkeit.',
    secondaryEffect: 'Realisierung extrem dichter Zementsteinmatrizen mit Höchstfestigkeit.',
    mechanism: 'Kombinierter Wirkmechanismus: Elektrostatische Abstoßung gepaart mit raumgreifender, sterischer Hinderung durch weitreichende flexible Polyether-Seitenketten (PEG).',
    description: 'Hochleistungspolymere der neuesten Generation (3. Generation). Während das negativ geladene Acrylsäure-Rückgrat am positiv geladenen Klinker adsorbiert, schieben die neutralen Polyether-Seitenketten die Zementkörner physisch auf Distanz. Ermöglicht SVB (selbstverdichtenden Beton), UHPC und HPC.',
    advantages: [
      'Enormes Wasserreduktionsvermögen (bis 30 %)',
      'Steuerung der Offenzeit (Consistence Retention) durch molekulare Architekturanpassungen',
      'Feinstporiger, makelloser Sichtbeton (Klassen SB 3 / SB 4) ohne Schwindrisse'
    ],
    disadvantages: [
      'Hohe Labilität gegenüber tonigen und schluffigen Feinstanteilen in der Gesteinskörnung',
      'Hoher Erstellungsaufwand der Erstprüfung aufgrund ausgeprägter Zementspezifität'
    ],
    classificationCode: 'Wirkungsgruppe FM - DIN EN 934-2 Tab. 3.1'
  },
  {
    name: 'Betonverzögerer',
    abbreviation: 'VZ',
    standard: 'DIN EN 934-2 (Tabelle 8)',
    chemicalBase: 'Phosphate, Saccharoseborate, Gluconate, Hydroxycarbonsäuren',
    dosageCode: '0,2 - 1,0 M.-% vom Zementgewicht',
    primaryEffect: 'Künstliche Verschiebung und Dehnung der Zeitspanne zwischen Erstarrungsbeginn und -ende.',
    secondaryEffect: 'Verminderung der adiabatischen Hydratations-Wärmespitze im Bauteilkern.',
    mechanism: 'Temporäre Blockade der Kristallkeimbildung durch Fällung schwerlöslicher Calciumverbindungen auf den reaktiven Aluminatphasen (C3A).',
    description: 'Wird zur Steuerung der Einbau- und Transportzeit zugesetzt. Verhindert das vorzeitige Versteifen während langer Fahrzeiten, bei komplexen ununterbrochenen Bauteilgossen (Massenbeton, Schleusenwände) oder extrem heißen Witterungen über +30 °C.',
    advantages: [
      'Fehlstellenfreie Betonagen ohne kalte Arbeitsfugen',
      'Gut steuerbare Wärmeentwicklung bei massigen Bauteilen zur Vermeidung von Thermorissen'
    ],
    disadvantages: [
      'Gefahr der Hydratationssperre bei Überdosierung (Beton bleibt tagelang flüssig)',
      'Erhöhte Plastscher-Schwindrissgefahr durch verlängerte Expositionsdauer im weichen Zustand'
    ],
    classificationCode: 'Wirkungsgruppe VZ - DIN EN 934-2 Tab. 8'
  },
  {
    name: 'Erhärtungsbeschleuniger',
    abbreviation: 'BE / SBE',
    standard: 'DIN EN 934-2 (Tabelle 6)',
    chemicalBase: 'Calciumnitrat, Triethanolamine, nanostrukturierte C-S-H Keimsuspensionen',
    dosageCode: '1,0 - 3,5 M.-% vom Zementgewicht',
    primaryEffect: 'Beschleunigung der Festigkeitsentwicklung im frühen Stadium (0 bis 24 Stunden).',
    secondaryEffect: 'Drastische Absenkung der erforderlichen Ausschalfristen vor allem im Fertigteilwerk.',
    mechanism: 'Physikalische und chemische Erhöhung der Keimbildungsgeschwindigkeit von Calcium-Silicat-Hydraten; nanostrukturierte Suspensionen dienen als Direktsaat-Kristallisationskeime.',
    description: 'Wirkt primär als Katalysator der CSH-Phasen-Trocknung. Ideal für Betonagen bei unvorhergesehenem Kälteeinbruch, Winterbaustellen, zur Einsparung von Dampfhärtungsenergie im Fertigteilwerk oder bei Schnellreparaturbetonen.',
    advantages: [
      'Sicherer Frostschutz und Tragfähigkeit bereits nach wenigen Stunden',
      'Effizienzsteigerung im Schalungsumlauf der Fertigteilproduktion'
    ],
    disadvantages: [
      'Minderung der 28-Tage-Enddruckfestigkeit um ca. 5 bis 10 %',
      'Mögliche Verschlechterung der rheologischen Verarbeitbarkeit im Frischbeton (Slump-Loss)'
    ],
    classificationCode: 'Wirkungsgruppe BE - DIN EN 934-2 Tab. 7'
  },
  {
    name: 'Erstarrungsbeschleuniger',
    abbreviation: 'SB',
    standard: 'DIN EN 934-2 (Tabelle 5)',
    chemicalBase: 'Aluminiumhydroxid, Alkalicarbonate, Alkalisilicate (Wasserglas)',
    dosageCode: '3,0 - 6,0 M.-% vom Zementgewicht',
    primaryEffect: 'Ungenügende Erhärtung, aber blitzschneller Übergang vom flüssigen in den steifen Zustand (Sekundenschnelle)',
    secondaryEffect: 'Frühe Standfestigkeit am anstehenden Fels im Tunnelbau.',
    mechanism: 'Flutartige Ausfällung von nadelförmigem Ettringit und Aluminiumkomplexen im Porenwasser unter totalem Entzug freien Wassers.',
    description: 'Spezialzusatzmittel für Spritzbetonarbeiten (Tunnelvortrieb nach Neuer Österreichischer Tunnelbaumethode - NÖT, Baugrubensicherungen). Ermöglicht das Anhaften und Überkopfspritzen des flüssigen Nassgemischs an Felswänden.',
    advantages: [
      'Ausspritzen extrem dicker Lagen in einem Arbeitsgang möglich',
      'Sofortiger statischer Verbund zur Firstensicherung'
    ],
    disadvantages: [
      'Erhöhte Staubentwicklung und signifikanter Spritzrückprall (Rebound)',
      'Teils massive Einbußen der strukturellen Endfestigkeiten und Dauerhaftigkeitsparameter'
    ],
    classificationCode: 'Wirkungsgruppe SB - DIN EN 934-2 Tab. 11.1'
  },
  {
    name: 'Luftporenbildner',
    abbreviation: 'LP',
    standard: 'DIN EN 934-2 (Tabelle 5)',
    chemicalBase: 'Synthetische Tenside, sulfonierte Kohlenwasserstoffe, Wurzelharzseifen',
    dosageCode: '0,05 - 0,15 M.-% vom Zementgewicht',
    primaryEffect: 'Einführung von gleichmäßig verteilten, kugelrunden, stabilen Luftbläschen.',
    secondaryEffect: 'Verminderung des Schwindens und signifikant erhöhter Gleiteffekt (Kugelgel-Effekt).',
    mechanism: 'Tensid-Grenzflächenspannungssenkung stabilisiert beim Mischvorgang eingezogene Luftblasen im Schlämmemantel.',
    description: 'Essentielles Werkzeug zur Erreichung des Frost-Tausalz-Widerstandes im Verkehrsflächenbau, Brückenkappen und Flugbetriebsflächen (Expositionsklassen XF3/XF4). Die Poren weisen exakt definierte Kugeldurchmesser von 10 µm bis 300 µm auf. Der Abstand der Bläschen (Abstandsfaktor L) muss im erhärteten Zementstein unter 0,20 mm liegen.',
    advantages: [
      'Abbruch des kapillaren Saugvermögens gefrierbaren Wassers',
      'Effektive Dehnungsräume für volumenerweiternde Eiskristalle',
      'Drastisch herabgesetzter Rheologiedruck und verbessertes Gleiten beim Pumpvorgang'
    ],
    disadvantages: [
      'Druckfestigkeitsreduktion: Jedes zusätzliche Vol.-% Luftporen mindert die Festigkeit um ca. 5 %',
      'Sehr reaktive Störanfälligkeit bei Änderungen der Temperatur, der Mischzeit oder feinsten Flugaschen'
    ],
    classificationCode: 'Wirkungsgruppe LP - DIN EN 934-2 Tab. 5'
  },
  {
    name: 'Dichtungsmittel',
    abbreviation: 'DM',
    standard: 'DIN EN 934-2 (Tabelle 9)',
    chemicalBase: 'Metallsalze von Speisefettsäuren (z.B. Calciumstearat), Alkylsiliconate, Emulsionen',
    dosageCode: '0,5 - 2,0 M.-% vom Zementgewicht',
    primaryEffect: 'Erhebliche Verringerung der kapillaren Wasseraufnahme des Festbetons.',
    secondaryEffect: 'Vermeidung unschöner weißer Ausblühungen sowie Salzsprengungen im Bauteilquerschnitt.',
    mechanism: 'Physikalische Porenauskleidung und chemische Hydrophobierung der kapillaren Innenwandflächen.',
    description: 'Typisches Einsatzgebiet sind wasser- und feuchtigkeitsbeanspruchte Bauteile wie im Tunnelbau, Keller-Außenwände (WU-Beton-Schnittstellen) oder hoch beanspruchte Betonpflastersteine und Betonwaren.',
    advantages: [
      'Sicherer Feuchteschutz auch unter hydrostatischem Überdruck',
      'Deutliche Farbbeständigkeit bei Sichtbetonwaren im Außenbereich'
    ],
    disadvantages: [
      'Absolut ungeeignet bei makroskopischen Rissen oder porigen Umlagerungsstellen',
      'Mögliche Minderung des Fließverhaltens im Frischbeton'
    ],
    classificationCode: 'Wirkungsgruppe DM - DIN EN 934-2 Tab. 9'
  },
  {
    name: 'Stabilisierer',
    abbreviation: 'ST',
    standard: 'DIN EN 934-2 (Tabelle 13)',
    chemicalBase: 'Modifizierte Celluloseether, natürliche Biopolymere (Welan-Gum), Polyacrylamide',
    dosageCode: '0,1 - 1,0 M.-% vom Zementgewicht',
    primaryEffect: 'Vermeidung von Entmischung (Sedimentation der Gesteinskörnung) und unruhigem Bluten.',
    secondaryEffect: 'Erhöhung des inneren Zusammenhalts (Kohäsion) von hochflüssigen Suspensionen.',
    mechanism: 'Physikalische Molekülknäuelbindungen erzeugen ein stabiles viskoses Gelgerüst im freien Anmachwasser.',
    description: 'Verwendet bei selbstverdichtenden Betonen (SVB), um Trennungserscheinungen der groben Gesteine im Fließstrom zu verhindern, sowie im Unterwasserbeton (Auswaschschutz im strömenden Gewässer).',
    advantages: [
      'Gewährleistet absolut homogenes Korngefüge über extreme Fließlängen',
      'Ermöglicht rüttelfreien Einbau auch in dicht bewehrten Schalungszonen'
    ],
    disadvantages: [
      'Verringert die Entlüftungswilligkeit (Luftblasen können schlechter aufsteigen)',
      'Unerwünschte Viskositätserhöhung bei fehlerhafter Feineinstellung'
    ],
    classificationCode: 'Wirkungsgruppe ST - DIN EN 934-2 Tab. 4'
  },
  {
    name: 'Einpresshilfen',
    abbreviation: 'EH',
    standard: 'DIN EN 934-4 (Zusatzmittel für Einpressmörtel)',
    chemicalBase: 'Alkylsulfonate, organische Geliermittel, Quellstoffe',
    dosageCode: '0,5 - 1,5 M.-% vom Zementgewicht',
    primaryEffect: 'Inhibierung der schädlichen Wasserabsonderung (Hohlraumbildung) in engen Spannkanälen.',
    secondaryEffect: 'Gezieltes, kontrolliertes, minimales Volumenschwellen (Quellen) vor Erhärtungsbeginn.',
    mechanism: 'Wasserretentive Wirkung gekoppelt mit kontrollierter Gasfreisetzung (meist Mikro-Wasserstoffbläschen) zur Porenschließung.',
    description: 'Spezielle Zusatzmittel für den Korrosionsschutz von Spanngliedern im Spannbetonbau. Der Einpressmörtel muss die engen Hüllrohre hohlraumfrei ausfüllen. Die Einpresshilfe verhindert das schwerkraftbedingte Absetzen.',
    advantages: [
      'Lückenloser aktiver Korrosionsschutz der Spannstähle',
      'Ausgleich des plastischen Volumenschwindens im Bauteilkern'
    ],
    disadvantages: [
      'Striktest einzuhaltende Mischzeiten, ansonsten droht instabiles Überquellen des Hüllrohrs'
    ],
    classificationCode: 'Wirkungsgruppe EH - DIN EN 934-2 Tab. 12'
  }
];

// System kategorien herstellerneutral dargelegt
interface SystemCategory {
  category: string;
  fmName: string;
  lpName: string;
  vzName: string;
  beName: string;
  specialties: string;
}

const systemCategories: SystemCategory[] = [
  {
    category: 'Systemklasse A: Standard-Transportbeton',
    fmName: 'Standard-Fließmittel (PCE-Kombinationen)',
    lpName: 'Mikro-Luftporenbildner (Tensid- oder Wurzelharzbasis)',
    vzName: 'Standard-Verzögerer (Phosphate / Gluconate)',
    beName: 'Standard-Beschleuniger (Calciumnitrat)',
    specialties: 'Optimiert für Standard-Festigkeitsklassen, universelle Kompatibilität mit Standard-Zementen.'
  },
  {
    category: 'Systemklasse B: Fertigteilwerke',
    fmName: 'Schnellansprechende Hochleistungs-Fließmittel (Kurzketten-PCE)',
    lpName: 'Hochstabile Luftschaum-Tensidsysteme',
    vzName: 'Milde Erstarrungsregler zur Konsistenzhaltung',
    beName: 'Wärmesparende Nanokristall-Beschleuniger (CSH-Suspensionen)',
    specialties: 'Maximale Frühfestigkeiten zur Reduktion von Ofenheizenergie und Schalungsumlaufzeiten.'
  },
  {
    category: 'Systemklasse C: Massenbeton & Großbaustellen',
    fmName: 'Konsistenzhaltende Fließmittel (Long-Retention-PCE)',
    lpName: 'Kombinierte mikrobläschenbildende Additive',
    vzName: 'Hochpräzise Langzeitverzögerer (Zuckersäuren)',
    beName: 'Keine (i.d.R. Kontraproduktiv)',
    specialties: 'Steuerung extrem niedriger Hydratationswärme-Entwicklung bei langen Transportzeiten.'
  },
  {
    category: 'Systemklasse D: Spezialtief- & Spritzbeton',
    fmName: 'Viskositätsmodifizierte Fließmittel',
    lpName: 'Einschlägige Entschäumer bzw. Bläschenstabilisatoren',
    vzName: 'Spezielle Ansteifungsregler',
    beName: 'Flüssige Erstarrungsbeschleuniger (SBE / Aluminiumsalze)',
    specialties: 'Für Spritzbeton nach NÖT, sofortige Haftung und rasches Ansteifen über Kopf.'
  }
];

export default function BpBetonzusatzmittel() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'wirkstoffe' | 'dosierung' | 'praxis' | 'innovation'>('allgemein');
  const [selectedAdmixture, setSelectedAdmixture] = useState<AdmixtureProduct>(admixtureProducts[1]); // Pre-select PCE
  const [activeRepulsionType, setActiveRepulsionType] = useState<'electrostatic' | 'steric'>('steric');

  // Interactive Dosing & w/z Accounting calculator states (E-Schein requirements)
  const [cementContent, setCementContent] = useState<number>(320); // kg/m³
  const [dosagePercent, setDosagePercent] = useState<number>(1.2); // M.-%
  const [admixtureDensity, setAdmixtureDensity] = useState<number>(1.12); // kg/l
  const [admixtureWaterContent, setAdmixtureWaterContent] = useState<number>(65); // %
  const [freshWaterAdd, setFreshWaterAdd] = useState<number>(145); // l/m³
  const [targetWcValue, setTargetWcValue] = useState<number>(0.45);
  const [concreteApplication, setConcreteApplication] = useState<'spann' | 'stahl' | 'unbewehrt'>('stahl');
  const [admixtureChlorideContent, setAdmixtureChlorideContent] = useState<number>(0.04); // M.-%

  // Calculation results
  const admixtureMass = cementContent * (dosagePercent / 100); // kg/m³
  const admixtureVolume = admixtureMass / admixtureDensity; // l/m³
  const admixtureWaterMass = admixtureMass * (admixtureWaterContent / 100); // kg/m³ (approx. l/m³)

  // The 3-liter / 3-kg rule of German E-Schein
  const isWaterAnrechnungMandatory = admixtureVolume >= 3.0;
  const effectiveWater = isWaterAnrechnungMandatory ? (freshWaterAdd + admixtureWaterMass) : freshWaterAdd;
  const rawWcRatio = freshWaterAdd / cementContent;
  const effectiveWcRatio = effectiveWater / cementContent;

  const isDosingTooLow = dosagePercent < 0.2;
  const isDosingTooHigh = dosagePercent > 5.0;
  const isChlorideExcessive = concreteApplication === 'spann' && admixtureChlorideContent > 0.10;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 font-sans">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Droplet className="text-shiraz animate-pulse" /> Betonzusatzmittel &amp; Bauchemie
            </h2>
            <p className="text-xs text-text-main/60 mt-1">
              Normung nach DIN EN 934-2, bauchemische Steuerung und Bemessungsregeln des E-Schein-Lehrgangs (DBC-Lehrmaterialien)
            </p>
          </div>
          <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-3 py-1 rounded border border-stone-200 self-start lg:self-center">
            DBC-Lehrvortrag E-Schein (rev. 2021)
          </span>
        </div>

        {/* Primary Tabs Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'allgemein' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('allgemein')}
          >
            <BookOpen size={16} /> Einführung &amp; Wirkprinzipien
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'wirkstoffe' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('wirkstoffe')}
          >
            <Atom size={16} /> Wirkstoff-Katalog DIN 934-2
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'dosierung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('dosierung')}
          >
            <Gauge size={16} /> E-Schein w/z-Anrechner
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <CheckCircle2 size={16} /> Praxisbeispiele
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'innovation' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('innovation')}
          >
            <Lightbulb size={16} /> Zukunftstrends
          </button>
        </div>

        {/* TAB 1: EINFÜHRUNG & WIRKPRINZIPIEN */}
        {activeTab === 'allgemein' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed text-sm">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-extrabold text-slate-800 text-lg">Zusatzmittel vs. Zusatzstoffe (Klarer E-Schein-Fokus)</h3>
                <p className="text-text-main/80">
                  Die betontechnologische Steuerung stützt sich auf zwei unterschiedliche Säulen. Nach den DBC-Lehrmaterialien der Deutschen Bauchemie e.V. ist die folgende Einteilung für jeden Betonprüfer elementar:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100 flex flex-col justify-between">
                    <div>
                      <span className="text-sky-800 font-extrabold text-xs uppercase tracking-wider block mb-1">Betonzusatzstoffe BZS</span>
                      <p className="text-xs text-slate-700 leading-normal">
                        Pulverfoermige Gesteinsmehle oder Reaktorstaeuber wie Flugasche nach DIN EN 450, Silicastaub nach DIN EN 13263 oder inertes Kalksteinmehl. Sie werden dem Mischrezept in groesseren Mengen, oft 10 bis 100 kg/m³, zugegeben und beeinflussen das Mehlkorngefuege der Packungsdichte physikalisch oder puzzolanisch.
                      </p>
                    </div>
                  </div>

                  <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/10 flex flex-col justify-between">
                    <div>
                      <span className="text-shiraz font-extrabold text-xs uppercase tracking-wider block mb-1">Betonzusatzmittel BZM</span>
                      <p className="text-xs text-slate-705 leading-normal">
                        Fluessige Emulsionen oder selten pulverfoermige organische und anorganische Wirksubstanzen mit Massenanteilen meist im Promille- bis niedrigen Prozentbereich, hoechstens 5.0 M.-% vom Zementgewicht. Sie greifen chemisch und physikalisch in die Hydratation und das Oberflächenladungsprofil der Zementteilchen ein.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/20 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800">Grundlegende Ziele der BZM-Nutzung:</h4>
                  <ul className="list-disc list-inside text-text-main/80 space-y-1 pl-1">
                    <li><strong>Frischbeton:</strong> Einstellen der Verarbeitbarkeit, langanhaltende Fliessfaehigkeit, Minimierung der inneren Reibung.</li>
                    <li><strong>Hydratation:</strong> Steuerung des Erstarrungsverlaufs wie Verzoegerung fuer Transport, Beschleunigung fuer rasches Ausschalen.</li>
                    <li><strong>Festbeton:</strong> Erhoehung der Dichte durch extreme w/z-Wert-Absenkung, Erzielung hoher Dauerhaftigkeitsklassen wie Frost-Tausalz-Resistenz via Mikrohohlraeumen.</li>
                  </ul>
                </div>
              </div>

              {/* Sidebar Info: Regulatory Compliance */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="text-emerald-600" size={16} /> Konformitaet und Normenbezug
                  </h4>
                  <ul className="space-y-3.5 text-xs text-text-main/90">
                    <li className="flex gap-2 items-start">
                      <ChevronRight size={14} className="text-shiraz mt-0.5 flex-none" />
                      <div>
                        <strong>Harmonisierung DIN EN 934-2:</strong> Alle Zusatzmittel benoetigen die europaeische CE-Kennzeichnung und Leistungserklaerung DoP.
                      </div>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ChevronRight size={14} className="text-shiraz mt-0.5 flex-none" />
                      <div>
                        <strong>Zusatzmittelrichtlinie des DIBt:</strong> Fuer Sonderprodukte ohne EN-Normierung gelten allgemeine bauaufsichtliche Zulassungen abZ oder Genehmigungen im Einzelfall aBG.
                      </div>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ChevronRight size={14} className="text-shiraz mt-0.5 flex-none" />
                      <div>
                        <strong>Vertraeglichkeitsnachweis Erstpruefung:</strong> Werden in einem Beton mehrere Zusatzmittel kombiniert wie FM und LP, muss deren chemische Unbedenklichkeit und gegenseitige Wirkungsneutralitaet separat in Laborversuchen nachgewiesen werden. Spenderleitungen am Mischer duerfen niemals zusammengefuehrt werden!
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 text-xs text-amber-950 p-4 rounded-xl leading-relaxed space-y-1">
                  <div className="flex gap-1.5 items-center font-bold text-amber-900">
                    <AlertTriangle size={14} className="text-amber-800" />
                    <span>Lagerungsvorschriften &amp; Qualitätspflege</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-normal">
                    Zusatzmittel muessen am Betonwerk zwingend frostfrei lagern. Hitzewarnung im Sommer, Flockungsgefahr im Winter bei Temperaturen unter 0 Grad. Chemisch instabile Separation fuehrt zur dauerhaften Fehlfunktion der Dosiereinrichtungen.
                  </p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE COMPONENT: ELECTROSTATIC VS STERIC REPULSION */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200 space-y-6">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-sm uppercase tracking-wider block w-fit mb-2">
                  Mikroskopischer Wirkmechanismus
                </span>
                <h3 className="text-base font-extrabold text-slate-800">
                  Die physikalischen Kräfte der Verflüssigung
                </h3>
                <p className="text-xs text-text-main/70 leading-relaxed mt-1">
                  Fein gemahlene Zementkörner weisen im Anmachwasser elektrostatisch unterschiedlich geladene Bereiche auf. Ohne Dispergierung ballen sie sich spontan zusammen (Flockungsgerüst), wodurch wertvolles Wasser ungenutzt eingeschlossen wird. Zusatzmittel brechen diese Flocken auf.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Repulsion Selector Buttons */}
                <div className="lg:col-span-4 flex flex-col gap-2.5">
                  <button
                    onClick={() => setActiveRepulsionType('electrostatic')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      activeRepulsionType === 'electrostatic'
                        ? 'bg-shiraz/5 border-shiraz text-slate-900 shadow-sm ring-1 ring-shiraz/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-sm flex items-center gap-1.5">
                      <Atom size={16} className={activeRepulsionType === 'electrostatic' ? 'text-shiraz' : 'text-slate-400'} />
                      1. Elektrostatische Abstoßung
                    </div>
                    <span className="text-xxs text-text-main/50 block mt-1">Typisch bei klassischen BV (LSA, Melamin- / Naphthalinsulfonat)</span>
                  </button>

                  <button
                    onClick={() => setActiveRepulsionType('steric')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      activeRepulsionType === 'steric'
                        ? 'bg-shiraz/5 border-shiraz text-slate-900 shadow-sm ring-1 ring-shiraz/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-sm flex items-center gap-1.5">
                      <Sparkles size={16} className={activeRepulsionType === 'steric' ? 'text-shiraz' : 'text-slate-400'} />
                      2. Sterische Abstoßung
                    </div>
                    <span className="text-xxs text-text-main/50 block mt-1">Die Revolution durch PCE-Hochleistungs-Fließmittel (3. Generation)</span>
                  </button>
                </div>

                {/* Simulation Canvas / Description */}
                <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
                  {activeRepulsionType === 'electrostatic' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2">
                        <span className="text-xs font-bold text-indigo-850">Mechanik: Polare Ladungsreaktion</span>
                        <span className="text-[10px] font-mono bg-indigo-100 text-indigo-850 px-2 py-0.5 rounded">Zeta-Potenzial-Verschiebung</span>
                      </div>
                      
                      {/* Diagram representation */}
                      <div className="h-28 bg-indigo-50/45 rounded-lg border border-indigo-100 flex items-center justify-center gap-8 p-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-slate-400 border border-slate-500 flex items-center justify-center text-xs font-bold text-white relative shadow-sm">
                            Zement
                            <span className="absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold font-mono">-</span>
                            <span className="absolute -bottom-1 -left-1 bg-indigo-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold font-mono">-</span>
                          </div>
                          <span className="text-[9px] font-bold text-indigo-800 mt-1 uppercase">Negativ geladen</span>
                        </div>
                        <span className="text-lg font-mono text-indigo-500 animate-pulse font-extrabold">&lt;— ( ⚡ Abstoßung ⚡ ) —&gt;</span>
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-slate-400 border border-slate-500 flex items-center justify-center text-xs font-bold text-white relative shadow-sm">
                            Zement
                            <span className="absolute -top-1 -left-1 bg-indigo-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold font-mono">-</span>
                            <span className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold font-mono">-</span>
                          </div>
                          <span className="text-[9px] font-bold text-indigo-800 mt-1 uppercase">Negativ geladen</span>
                        </div>
                      </div>

                      <p className="text-xs text-text-main/80 leading-normal">
                        <strong>Wie es funktioniert:</strong> Die Sulfonat-Monomere (Ligninsulfonat, MFS) lagern sich flächig auf der Zementrohmasse an. Dadurch wird die Oberfläche einheitlich negativ aufgeladen. Gleichnamige Ladungen stoßen einander kräftig ab (gemessen als Zeta-Potenzial). Das Zementgerüst bricht auf und das ungenutzte Füllwasser quillt hervor. 
                      </p>
                      <div className="text-[10px] bg-indigo-50 border border-indigo-250 p-2.5 rounded-lg text-indigo-900 leading-tight">
                        <strong>E-Schein Prüfregel:</strong> Elektrostatische Abstoßungskräfte wirken zwar unmittelbar, klingen jedoch durch fortschreitende Kristallisation (Hydratationsprodukte überwuchern das Additiv) meist rascher ab. Slump-Loss tritt nach circa 30 bis 60 Minuten ein.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2">
                        <span className="text-xs font-bold text-emerald-850">Mechanik: Molekularer Stoßdämpfer</span>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-850 px-2 py-0.5 rounded">PCE-Copolymer mit PEG-Seitenketten</span>
                      </div>

                      {/* Diagram representation */}
                      <div className="h-28 bg-emerald-50/45 rounded-lg border border-emerald-100 flex items-center justify-center gap-12 p-4">
                        <div className="flex flex-col items-center">
                          <div className="w-11 h-11 rounded-full bg-slate-400 border border-slate-500 flex items-center justify-center text-xs font-bold text-white relative shadow-sm">
                            Zement
                            {/* Comb-like representation */}
                            <span className="absolute -top-1.5 inset-x-0 mx-auto text-emerald-600 font-extrabold text-[15px] animate-pulse">〰️</span>
                            <span className="absolute -bottom-1.5 inset-x-0 mx-auto text-emerald-600 font-extrabold text-[15px] animate-pulse">〰️</span>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-800 mt-1 uppercase">Adsorbiertes Rückgrat</span>
                        </div>
                        <span className="text-lg font-mono text-emerald-600 animate-pulse font-extrabold">|| ( Schutzzone ) ||</span>
                        <div className="flex flex-col items-center">
                          <div className="w-11 h-11 rounded-full bg-slate-400 border border-slate-500 flex items-center justify-center text-xs font-bold text-white relative shadow-sm">
                            Zement
                            <span className="absolute -top-1.5 inset-x-0 mx-auto text-emerald-600 font-extrabold text-[15px] animate-pulse">〰️</span>
                            <span className="absolute -bottom-1.5 inset-x-0 mx-auto text-emerald-600 font-extrabold text-[15px] animate-pulse">〰️</span>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-800 mt-1 uppercase">Sterischer Puffer</span>
                        </div>
                      </div>

                      <p className="text-xs text-text-main/80 leading-normal">
                        <strong>Wie es funktioniert:</strong> Polycarboxylatether (PCE) ähneln einem winzigen Kamm. Der anionische Polyelektrolytrücken verankert sich fest auf dem Klinkermehl. Die langen neutralen Seitenglieder (Polyethylenglycol-Ketten) ragen in die wässrige Porenlösung hinein. Stoßen zwei Zementpartikel aneinander, kollidieren die Ketten und bewirken bei minimalem Kraftaufwand mechanischen Pufferraum.
                      </p>
                      <div className="text-[10px] bg-emerald-50 border border-emerald-250 p-2.5 rounded-lg text-emerald-900 leading-tight">
                        <strong>Baukasten-Steuerung:</strong> Durch gezielte Abstimmung der Seitenketten-Anzahl und -Länge im Herstellungsverfahren (DBC-Lehrkapitel 3) können Fließmittel entweder auf blitzschnelle Anfangsverflüssigung (Fertigbeton) oder langanhaltende Konsistenzhaltung (transportierte Fernmischungen) modelliert werden.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WIRKSTOFF-KATALOG DIN 934-2 */}
        {activeTab === 'wirkstoffe' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
              <h3 className="font-bold text-shiraz text-base mb-2">Die 9 grundlegenden Wirkungsgruppen nach DIN EN 934-2 / DIN EN 934-4</h3>
              <p>
                In der europäischen Bauprodukt-Regulierung sind die zulässigen Zusatzmittel penibel klassifiziert. Die jeweiligen Tabellen- Anhänge der DIN EN 934-2 regeln die verbindlichen Anforderungen sowie die herstellerneutralen Testzemente für den Konformitätsnachweis.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column Selector */}
              <div className="lg:col-span-5 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block pl-1">Auswahl Wirkungsgruppe (EN 934-2):</span>
                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {admixtureProducts.map((prod) => (
                    <button
                      key={prod.name}
                      onClick={() => setSelectedAdmixture(prod)}
                      className={`text-left p-3 rounded-xl border transition-all duration-150 flex items-start gap-3 w-full cursor-pointer ${
                        selectedAdmixture.name === prod.name
                          ? 'bg-shiraz/5 border-shiraz text-text-main shadow-xs'
                          : 'bg-white border-home-grau/25 text-text-main/75 hover:bg-stone-50 hover:border-home-grau/40'
                      }`}
                    >
                      <Atom className={`mt-0.5 flex-none ${selectedAdmixture.name === prod.name ? 'text-shiraz' : 'text-text-main/40'}`} size={16} />
                      <div className="w-full">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs lg:text-sm">{prod.name}</span>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.25 rounded ${selectedAdmixture.name === prod.name ? 'bg-shiraz text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {prod.abbreviation}
                          </span>
                        </div>
                        <div className="text-[10px] text-text-main/50 mt-0.5 block truncate max-w-[250px]">{prod.chemicalBase}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
                  <h5 className="font-bold flex items-center gap-1.5">
                    <FileText size={14} className="text-indigo-800" /> 
                    Gleichmäßigkeitsprüfung (Chargenkontrolle)
                  </h5>
                  <p className="leading-relaxed text-[11px] text-indigo-900">
                    Jede hergestellte Charge eines Betonzusatzmittels unterliegt einer ununterbrochenen werkseigenen Produktionskontrolle (WPK). Gemessen werden im Labor der **Infrarotspektralbereich (IR-Fingerabdruck)**, der **Trockenrückstand**, der **pH-Wert** sowie die **Dichte** mit dem hydrostatischen Messverfahren.
                  </p>
                </div>
              </div>

              {/* Right Column details */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-home-grau/30 shadow-xs p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest bg-shiraz/10 px-2.5 py-1 rounded">
                      Tabelle: {selectedAdmixture.standard.split(' (')[1]?.replace(')', '') || 'DIN EN 934-2'}
                    </span>
                    <h4 className="text-lg font-bold text-text-main mt-2">{selectedAdmixture.name} ({selectedAdmixture.abbreviation})</h4>
                  </div>
                  <span className="text-xxs bg-stone-100 text-stone-700 font-mono px-2 py-1 rounded border">
                    {selectedAdmixture.classificationCode}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                    <span className="text-[10px] font-bold text-text-main/50 uppercase block mb-1">Chemische Hauptwirkstoffe:</span>
                    <span className="text-xs font-semibold text-text-main/90 leading-tight block">{selectedAdmixture.chemicalBase}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                    <span className="text-[10px] font-bold text-text-main/50 uppercase block mb-1">Normative Richtdosierung:</span>
                    <span className="text-xs font-semibold text-text-main/90 leading-tight block font-mono">{selectedAdmixture.dosageCode}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block">Funktion &amp; Prozessbeschreibung:</span>
                  <p className="text-xs text-text-main/80 leading-relaxed bg-off-white/40 p-3 rounded-lg border border-home-grau/10">
                    {selectedAdmixture.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-stone-100 py-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Hauptwirkung:</span>
                    <span className="text-xs text-text-main/80 leading-tight block">{selectedAdmixture.primaryEffect}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Sekundär- &amp; Nebeneffekte:</span>
                    <span className="text-xs text-text-main/80 leading-tight block">{selectedAdmixture.secondaryEffect}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-2">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-emerald-700" /> Vorteile:
                    </span>
                    <ul className="space-y-1.5">
                      {selectedAdmixture.advantages.map((adv, idx) => (
                        <li key={idx} className="text-xxs text-emerald-950 flex gap-1.5 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-2">
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                      <AlertTriangle size={14} className="text-amber-700" /> Anwendungsrisiken &amp; Limitierungen:
                    </span>
                    <ul className="space-y-1.5">
                      {selectedAdmixture.disadvantages.map((dis, idx) => (
                        <li key={idx} className="text-xxs text-amber-950 flex gap-1.5 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                          <span>{dis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* NEUTRAL SYSTEM MATRIX SECTION */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                  Systemklassen &amp; Wirkstoffkombinationen
                </h3>
                <p className="text-xs text-text-main/60 mt-1">
                  Typische, bewährte Kombinationskonzepte nach DIN EN 934-2 zur herstellerneutralen Orientierung bei Planungsaufgaben und Mischungsentwürfen:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemCategories.map((sys, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 hover:border-shiraz/40 transition-colors">
                     <div className="font-extrabold text-xs text-shiraz border-b border-stone-100 pb-1.5 flex justify-between items-center">
                      <span>{sys.category}</span>
                      <span className="text-[9px] font-mono bg-stone-100 text-stone-600 px-1.5 rounded">Genormt</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-xxs text-text-main/85 leading-tight">
                      <p><strong>Konsistenz / Verflüssigung (FM/BV):</strong> {sys.fmName}</p>
                      <p><strong>Sonderporen (LP):</strong> {sys.lpName}</p>
                      <p><strong>Kinetiksteuerung (VZ/BE):</strong> {sys.vzName} / {sys.beName}</p>
                      <p className="text-[10px] text-text-main/50 italic mt-1 pt-1 border-t border-dashed border-stone-100">
                        {sys.specialties}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: E-SCHEIN BEMESSUNGS- & w/z-ANRECHNER */}
        {activeTab === 'dosierung' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/10 text-sm leading-relaxed text-text-main/80">
              <h3 className="font-extrabold text-shiraz text-base mb-1.5">E-Schein Prüfungsrelevanz: Die Wasser- &amp; Mengenschranken</h3>
              <p className="mb-2">
                Bei der Bemessung hochpräziser Betonschlämmen greifen strikte normative Schranken aus <strong>DIN EN 206 / DIN 1045-2</strong> sowie der **Zusatzmittelrichtlinie**. Verwende den nachfolgenden Simulator, um die Grenzbereiche zu prüfen. Er prüft Dosiergrenzen und berechnet das anrechenbare Wasser von verflüssigendem Additivwasser auf den korrigierten w/z-Wert.
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs bg-white p-4 rounded-lg border border-shiraz/10 text-slate-800">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full block"></span>
                  <strong>Mindestlimit: &lt; 0,2 M.-%</strong> (Vorwaschung erforderlich für homogene Schlämme)
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full block"></span>
                  <strong>Höchstlimit: &gt; 5,0 M.-%</strong> (Normgrenze überschritten, abZ o. Eignungsprüfung)
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full block"></span>
                  <strong>DBC-Regel: Wasseranrechnung</strong> (Pflichtige Anrechnung ab 3 Liter Aditivvolumen je m³)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column - Inputs Form */}
              <div className="lg:col-span-5 bg-stone-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block border-b pb-1.5 mb-3">Rezeptur-Eckdaten eingeben</span>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Zementgehalt (<InlineMath math="Z" />):</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="5"
                      min="100"
                      max="600"
                      value={cementContent}
                      onChange={(e) => setCementContent(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                    />
                    <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">kg/m³</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-705 block">Zusatzmittel Menge:</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={dosagePercent}
                        onChange={(e) => setDosagePercent(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">M.-%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-705 block">Zusatzmittel Dichte (<InlineMath math="\rho" />):</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0.9"
                        max="1.5"
                        value={admixtureDensity}
                        onChange={(e) => setAdmixtureDensity(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold font-mono">kg/l</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Wassergehalt im Additiv:</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="1"
                        min="20"
                        max="95"
                        value={admixtureWaterContent}
                        onChange={(e) => setAdmixtureWaterContent(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Gewünschter Ziel-w/z:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.30"
                      max="0.65"
                      value={targetWcValue}
                      onChange={(e) => setTargetWcValue(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Abgemessene Frischwasser-Zugabe:</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="5"
                      min="50"
                      max="250"
                      value={freshWaterAdd}
                      onChange={(e) => setFreshWaterAdd(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                    />
                    <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">l/m³</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Bewehrungskategorie &amp; Chloridschranke</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConcreteApplication('spann')}
                      className={`flex-1 p-2 border rounded-lg text-xxs font-bold text-center cursor-pointer transition-all ${
                        concreteApplication === 'spann'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Spannbeton
                    </button>
                    <button
                      onClick={() => setConcreteApplication('stahl')}
                      className={`flex-1 p-2 border rounded-lg text-xxs font-bold text-center cursor-pointer transition-all ${
                        concreteApplication === 'stahl'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Stahlbeton
                    </button>
                    <button
                      onClick={() => setConcreteApplication('unbewehrt')}
                      className={`flex-1 p-2 border rounded-lg text-xxs font-bold text-center cursor-pointer transition-all ${
                        concreteApplication === 'unbewehrt'
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Unbewehrt
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-slate-600 block">Chloridgehalt im Additiv (<InlineMath math="\text{Cl}^-" />):</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="2"
                        value={admixtureChlorideContent}
                        onChange={(e) => setAdmixtureChlorideContent(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xxs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold font-mono">M.-%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Results Display */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm border-b pb-1.5 mb-4 flex items-center gap-1.5">
                    <Activity size={16} className="text-shiraz animate-pulse" />
                    Technischer Prüfbericht für Betonprüfer
                  </h4>

                  {/* Warning Flags */}
                  <div className="space-y-3 mb-6">
                    {/* Minimum Check */}
                    {isDosingTooLow ? (
                      <div className="bg-yellow-50 border border-yellow-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-yellow-950">
                        <AlertTriangle className="text-yellow-700 mt-0.5 flex-none" size={16} />
                        <div>
                          <span className="font-bold block">Achtung: Sehr geringe Rezeptdosierung ({dosagePercent} M.-%)</span>
                          Unter **0,2 M.-%** Zementgewicht ist eine gleichmäßige Verteilung des Zusatzmittels im Standard-Mischprozess gefährdet. Das Zusatzmittel sollte zwingend in einem Teil des Zugabewassers vorverdünnt eingedüst werden.
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl flex items-center gap-2 text-xxs text-emerald-950">
                        <Check className="text-emerald-600" size={14} />
                        <span>Soll-Mindestdosierung eingehalten (≥ 0,2 M.-%). Homogene Dispersion im Zementleim gesichert.</span>
                      </div>
                    )}

                    {/* Maximum Check */}
                    {isDosingTooHigh ? (
                      <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-red-950 animate-bounce">
                        <ShieldAlert className="text-red-700 mt-0.5 flex-none" size={16} />
                        <div>
                          <span className="font-bold block">Fehler: Höchstdosierung nach DIN EN 206 verletzt!</span>
                          Die Dosierung von **{dosagePercent} M.-%** ist extrem kritisch. Zusatzmittel dürfen nach Norm grundsätzlich **nicht über 5,0 M.-%** bezogen auf den Zementgehalt dosiert werden. Ein genehmigter Sonder-Eignungsnachweis (abZ vom DIBt) ist zwingend bereitzuhalten.
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl flex items-center gap-2 text-xxs text-emerald-950">
                        <Check className="text-emerald-600" size={14} />
                        <span>Maximaldosierung nach DIN EN 206 unbedenklich (≤ 5,0 M.-%).</span>
                      </div>
                    )}

                    {/* Chloride Check */}
                    {isChlorideExcessive ? (
                      <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-red-950">
                        <ShieldAlert className="text-red-700 mt-0.5 flex-none" size={16} />
                        <div>
                          <span className="font-bold block">Fehler: Unzulässige Korrosionsgefährdung (Spannbeton)</span>
                          Für Spannbeton (vorgespannte Glieder) muss der Chloridgehalt von Zusatzmitteln **≤ 0,10 M.-%** betragen. Der eingegebene Wert von **{admixtureChlorideContent} M.-%** birgt akute Gefahren von katalytischem Lochfraß unter Zugspannung.
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl flex items-center gap-2 text-xxs text-emerald-950">
                        <Check className="text-emerald-600" size={14} />
                        <span>Chlorid-Grenzwert ({concreteApplication === 'spann' ? '≤ 0,10 % für Spannbeton' : 'Keine kritischen Schranken'}) eingehalten.</span>
                      </div>
                    )}
                  </div>

                  {/* Calculations Sheet */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-stone-50 p-4 rounded-xl border border-slate-200 text-center space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Zusatzmittel-Gewicht</span>
                      <span className="text-base font-extrabold text-slate-800 block">{admixtureMass.toFixed(2)} kg/m³</span>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-xl border border-slate-200 text-center space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Zubehörtes Volumen</span>
                      <span className="text-base font-extrabold text-slate-800 block">{admixtureVolume.toFixed(2)} l/m³</span>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-xl border border-slate-200 text-center space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Anteiliges Wasser (W_Eigenwasser)</span>
                      <span className="text-base font-extrabold text-slate-800 block">{admixtureWaterMass.toFixed(2)} Liter</span>
                    </div>
                  </div>

                  {/* The 3-Liter Rule Box */}
                  <div className={`p-5 rounded-2xl border ${isWaterAnrechnungMandatory ? 'bg-sky-50 border-sky-200 text-sky-950' : 'bg-stone-50 border-stone-200 text-slate-700'} space-y-3`}>
                    <div className="flex items-center gap-2 font-extrabold">
                      <Scale className={isWaterAnrechnungMandatory ? 'text-sky-700' : 'text-slate-500'} size={18} />
                      <h5>Die 3-Liter-Wasseranrechnungsregel (E-Schein)</h5>
                    </div>
                    {isWaterAnrechnungMandatory ? (
                      <p className="text-xs leading-relaxed font-normal">
                        <strong>Pflichtiges Prüfungskriterium!</strong> Da das zugegebene flüssige Zusatzmittelvolumen mit **{admixtureVolume.toFixed(2)} Litern** die kritische Schranke von **≥ 3,0 Litern je m³** erreicht bzw. überschreitet, muss das in der Emulsion enthaltene Eigenwasser (W_Eigenwasser = {admixtureWaterMass.toFixed(1)} l) **zwingend** als Mischwasser angerechnet werden!
                      </p>
                    ) : (
                      <p className="text-xs leading-relaxed font-normal">
                        Da das zugegebene Volumen mit **{admixtureVolume.toFixed(2)} Litern** unter der Grenze von **&lt; 3,0 Litern je m³** liegt, ist eine rechnerische Wasseranrechnung nach deutscher Norm nicht explizit verpflichtend (für Standardbeton). Für anspruchsvolle HPC/UHPC-Rezepturen wird die Anrechnung dennoch dringend unaufgefordert durchgeführt.
                      </p>
                    )}

                    {/* Compare W/C Ratio */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Wasserzementwert ohne Anrechnung (rechnerisch)</span>
                        <span className="text-sm font-extrabold text-slate-800 block font-mono">{rawWcRatio.toFixed(3)}</span>
                        <span className="text-[10px] text-slate-400 italic block mt-0.5">Frischwasser / Zement</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-semibold block flex items-center gap-1">
                          Tatsächlicher (effektiver) w/z-Wert {isWaterAnrechnungMandatory && <span className="bg-sky-500 text-white font-mono font-bold text-[8px] px-1 py-0.2 px-1 rounded">VORSCHRIFT</span>}
                        </span>
                        <span className={`text-sm font-extrabold block font-mono ${effectiveWcRatio > targetWcValue ? 'text-red-600' : 'text-emerald-700'}`}>
                          {effectiveWcRatio.toFixed(3)}
                        </span>
                        <span className="text-[10px] text-slate-400 italic block mt-0.5">Effektives Wasser ({effectiveWater.toFixed(1)} l) / Zement</span>
                      </div>
                    </div>

                    {effectiveWcRatio > targetWcValue ? (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-950 font-semibold rounded-lg text-xxs leading-relaxed mt-2 flex gap-1.5 items-start">
                        <AlertTriangle size={14} className="text-red-700 flex-none mt-0.5" />
                        <div>
                          <strong>Gefahr: Ziel-w/z-Wert überschritten!</strong> Der tatsächliche w/z-Wert ({effectiveWcRatio.toFixed(3)}) übersteigt den Grenzwert von {targetWcValue.toFixed(2)} durch das Eigenwasser des Zusatzmittels. 
                          Reduziere die Frischwasserzugabe im Mischer auf maximal <strong>{(targetWcValue * cementContent - (isWaterAnrechnungMandatory ? admixtureWaterMass : 0)).toFixed(0)} l/m³</strong>, um die Rezeptvorgabe zu halten.
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-950 font-semibold rounded-lg text-xxs leading-relaxed mt-2 flex gap-1.5 items-center">
                        <Check size={14} className="text-emerald-700" />
                        <span>Der tatsächliche w/z-Wert ({effectiveWcRatio.toFixed(3)}) hält den geforderten Grenzwert von ≤ {targetWcValue.toFixed(2)} sicher ein.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRAXISBEISPIELE */}
        {activeTab === 'praxis' && (
          <div className="p-1 animate-in fade-in duration-300">
            <PraxisTabContent moduleKey="bp_betonzusatzmittel" />
          </div>
        )}

        {/* TAB 5: ZUKUNFTSTRENDS */}
        {activeTab === 'innovation' && (
          <div className="p-1 animate-in fade-in duration-300">
            <InnovationTabContent moduleKey="bp_betonzusatzmittel" />
          </div>
        )}
      </div>

      <ModuleFooter
        weblinks={[
          { title: "Deutsche Bauchemie e.V. (Portal für Betonzusatzmittel & Vortragsreihen)", url: "https://www.deutsche-bauchemie.de" },
          { title: "Verein Deutscher Zementwerke (VDZ): Zement-Taschenbuch.", url: "https://www.vdz-online.de/publikationen/zement-taschenbuch" }
        ]}
        wikipedia={[
          { title: 'Betonzusatzmittel', url: 'https://de.wikipedia.org/wiki/Betonzusatzmittel' },
          { title: 'Wasser-Zement-Wert', url: 'https://de.wikipedia.org/wiki/Wasser-Zement-Wert' },
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' }
        ]}
        literatur={[
          'Stark, J., Wicht, B.: Dauerhaftigkeit von Beton. Springer-Verlag.',
          'Zahnentafeln Betontechnologie: Mischungsberechnung und Zusatzmitteleinflüsse, DIN Media.',
          'Basisvortrag Betonzusatzmittel für E-Schein-Lehrgänge, Deutsche Bauchemie e.V., Düsseldorf.'
        ]}
        regelwerke={[
          { title: 'DIN EN 934-2:2012-11 (Zusatzmittel für Beton, Mörtel und Einpressmörtel - Teil 2: Betonzusatzmittel)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 206 / DIN 1045-2 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 480-Reihe (Prüfverfahren für Betonzusatzmittel)', url: 'https://www.dinmedia.de/' }
        ]}
        formeln={[
          { 
            formel: '(w/z)_{\\text{eff}} = \\frac{w_{\\text{Wasser}} + w_{\\text{ZM}}}{z} \\le (w/z)_{\\max}', 
            erklaerung: 'Wasseraufrechnungsregel nach DIN EN 206 / DIN 1045-2: Bei flüssigen Betonzusatzmitteln mit einer Dosierung über 3 l/m³ ist der Wasseranteil des Zusatzmittels zwingend dem wirksamen Wassergehalt zuzuschlagen.',
            quelle: 'DIN 1045-2 Abs. 5.2.5.3'
          },
          { 
            formel: 'L_{300} \\ge 1.5\\,\\% \\quad \\text{und} \\quad a \\le 0.20\\,\\text{mm}', 
            erklaerung: 'Mikroluftporengehalt L300 (Porendurchmesser <= 0.30 mm) und Abstandsfaktor a im Festbetongefüge zur Erzielung hoher Frost-Tausalz-Widerstandsfähigkeit (XF4).',
            quelle: 'DIN EN 480-11'
          }
        ]}
      />
    </div>
  );
}
