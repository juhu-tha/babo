import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Paintbrush, Calculator, ShieldCheck, HelpCircle, Info, Sparkles, Droplets, Trash2, Check, AlertTriangle, FlaskConical, Workflow, Atom, Layers } from 'lucide-react';
import { InnovationPraxisSection } from '@/src/components/ui/InnovationPraxisSection';

interface BinderType {
  name: string;
  category: string;
  advantages: string[];
  disadvantages: string[];
  sdValue: string; // Wasserdampfdurchlässigkeit (sd-Wert)
  typicalUse: string;
  pufCode?: string; // GISCODE
}

const BINDERS: BinderType[] = [
  {
    name: 'Dispersionsfarbe (Kunststoffdispersion)',
    category: 'Wassermischbar / Physikalisch trocknend',
    advantages: [
      'Sehr leicht zu verarbeiten',
      'Schnelltrocknend und geruchsarm',
      'In fast allen Farbtönen mischbar',
      'Gute Reinigungseigenschaften'
    ],
    disadvantages: [
      'Bildet oft dampfdichten Kunststofffilm (höherer sd-Wert)',
      'Kann Konservierungsstoffe enthalten (Allergiepotenzial)',
      'Nicht rein mineralisch'
    ],
    sdValue: 'Mittel bis hoch (ca. 0,1 - 0,5 m)',
    typicalUse: 'Standard-Wandfarbe im Innenbereich, Gipsfaserplatten, Raufasertapeten.',
    pufCode: 'BSW10 (Konservierungsmittelfrei)'
  },
  {
    name: 'Silikatfarbe (Reine Silikatfarbe / Dispersions-Silikat)',
    category: 'Mineralisch / Chemisch härtend (Verkieselung)',
    advantages: [
      'Extrem diffusionsoffen (atmungsaktiv)',
      'Verkieselt unlösbar mit mineralischem Untergrund (kein Abblättern)',
      'Natürlich schimmelpilzhemmend durch hohe Alkalität (pH ~ 11)',
      'Frei von Konservierungsstoffen und Weichmachern'
    ],
    disadvantages: [
      'Erfordert mineralischen Untergrund (nicht auf Gips oder Altkunststoff)',
      'Ätzend bei ungeschütztem Haut-/Augenkontakt während der Verarbeitung',
      'Begrenzte Farbtonvielfalt'
    ],
    sdValue: 'Sehr gering (sd < 0,01 m - exzellent)',
    typicalUse: 'Kalk- oder Zementputze, historische Fassaden, feuchtebelastete Innenräume mit Schimmelrisiko.',
    pufCode: 'BSW40 (Silikatfarben)'
  },
  {
    name: 'Kalkfarbe (Sumpfkalkfarbe)',
    category: 'Mineralisch / Karbonatisierung (Lufthärtend)',
    advantages: [
      'Höchste biologische Verträglichkeit',
      'Sehr hoch schimmelhemmend (hygienisierend, pH ~ 12)',
      'Hervorragend feuchtigkeitsregulierend',
      'Vollkommen frei von synthetischen Stoffen'
    ],
    disadvantages: [
      'Geringe Abriebfestigkeit (kreidet leicht beim Wischen)',
      'Deckt oft erst nach 2–3 Anstrichen vollständig',
      'Nur auf saugfähigen rein mineralischen Untergründen einsetzbar'
    ],
    sdValue: 'Extrem gering (sd < 0,01 m - hervorragend)',
    typicalUse: 'Ökologischer Lehm- oder Kalkputz, Denkmalschutz, Kellerbereiche.',
    pufCode: 'BSW60 (Kalkfarben)'
  },
  {
    name: 'Acryllack (Alkyd-Acryl / Dispersion)',
    category: 'Wassermischbar / Physikalisch & chemisch antrocknend',
    advantages: [
      'Geringe VOC-Emissionen (wasserbasiert)',
      'Sehr gute UV- und Vergilbungsbeständigkeit',
      'Dauerelastisch, reißt seltener',
      'Werkzeugreinigung unkompliziert mit Wasser'
    ],
    disadvantages: [
      'Etwas geringerer Verlauf ("Pinselstriche sichtbar") als Kunstharz',
      'Geringere Anfangshärte als Alkydharzlacke'
    ],
    sdValue: 'Hoch (Sperrschicht)',
    typicalUse: 'Holzbauteile im Innen- und Außenbereich (Fenster, Türen), Kinderspielzeug, Heizkörper.',
    pufCode: 'BSW20 (Wasserlacke)'
  },
  {
    name: 'Alkydharzlack (Kunstharzlack)',
    category: 'Lösemittelbasiert / Oxidativ trocknend',
    advantages: [
      'Hervorragender, glatter Oberflächenverlauf',
      'Sehr hohe mechanische Belastbarkeit & Abriebfestigkeit',
      'Ausgezeichneter Feuchtigkeitsschutz'
    ],
    disadvantages: [
      'Hoher Lösemittelgehalt (VOC)',
      'Geruchsbelästigung beim Trocknen (Trocknungsdauer 12-24h)',
      'Neigt bei UV-Mangel im Innenbereich zur Vergilbung'
    ],
    sdValue: 'Sehr hoch (Dampfsperrend)',
    typicalUse: 'Metallbeschichtungen, stark beanspruchter Holzschutz im Außenbereich, Maschinenbau.',
    pufCode: 'BSL20 (Lösemittellacke)'
  },
  {
    name: 'Epoxidharzlack (2-Komponenten-EP)',
    category: 'Reaktionsharz / Chemisch vernetzend',
    advantages: [
      'Extreme Verschleiß- und Stoßfestigkeit',
      'Hervorragende Chemikalien- und Ölbeständigkeit',
      'Flüssigkeitsdicht und nahtlos aufzutragen'
    ],
    disadvantages: [
      'Muss exakt im Mischungsverhältnis (A+B) angerührt werden',
      'Kurze Verarbeitungszeit (Topfzeit, meist 30-90 min)',
      'Neigt unter starker UV-Strahlung im Außenbereich zum Kreiden'
    ],
    sdValue: 'Absolut dampfdicht',
    typicalUse: 'Industrieböden, Garagenbeschichtungen, Tankinnenwände, hochbeanspruchte Schutzanstriche.',
    pufCode: 'RE30 (Epoxidharzprodukte, lösungsmittelfrei)'
  }
];

interface OSSystem {
  id: string;
  name: string;
  title: string;
  description: string;
  flexible: boolean;
  thickness: string;
  bridging: string;
  trafficable: boolean;
  layers: string[];
  mainBinders: string;
  consumption: string;
}

const OS_SYSTEMS: OSSystem[] = [
  {
    id: 'os1',
    name: 'OS 1 (OS-A)',
    title: 'Hydrophobierung',
    description: 'Wasserabweisende Imprägnierung der Betonoberfläche ohne Filmbildung. Die Kapillarporen werden chemisch ausgekleidet, bleiben aber offen für Wasserdampf-Diffusion.',
    flexible: false,
    thickness: 'Eindringtiefe meist > 1 mm (keine Schichtdicke)',
    bridging: 'Keine Rissüberbrückung',
    trafficable: false,
    mainBinders: 'Silane, Siloxane (lösemittelbasiert oder wässrig/cremeförmig)',
    consumption: '0,15 - 0,40 kg/m²',
    layers: [
      'Untergrundvorbereitung (Sandelstrahlen, HDW-Strahlen)',
      '1 bis 2 flutende, herstellerneutrale Applikationen mit Silan/Siloxan-Wirkstoff'
    ]
  },
  {
    id: 'os2',
    name: 'OS 2 (OS-B)',
    title: 'Imprägnierung',
    description: 'Poren- und kapillarverstopfende Imprägnierung, die einen hauchdünnen, nicht zusammenhängenden Film (10 - 50 µm) auf der Oberfläche bildet. Reduziert die kapillare Wasseraufnahme maßgeblich.',
    flexible: false,
    thickness: '10 - 50 µm Schichtstärke',
    bridging: 'Keine Rissüberbrückung',
    trafficable: false,
    mainBinders: 'Niedrigviskoses Epoxidharz (EP) oder Polyurethan (PU)',
    consumption: '0,10 - 0,25 kg/m²',
    layers: [
      'Untergrundvorbereitung (Feinstrahlen)',
      'Saugende Grundierung mit niedrigviskosem Reaktionsharz',
      'Optionale dünne Kopfversiegelung'
    ]
  },
  {
    id: 'os4',
    name: 'OS 4 (OS-C)',
    title: 'Beschichtung für vertikale Betonflächen',
    description: 'Standardbeschichtung für vertikale Betonbauteile wie Brückenpfeiler, Tunnelwände, Stützmauern und Fassaden. Wirkt als hocheffektive Kohlendioxid-Bremse (CO₂-Diffusionssperre) zur Verhinderung der Karbonatisierung, bleibt aber diffusionsoffen für Wasserdampf.',
    flexible: false,
    thickness: 'Mindesttrockenschichtdicke ≥ 80 µm',
    bridging: 'Keine Rissüberbrückung (starr)',
    trafficable: false,
    mainBinders: 'Acrylat-Mischpolymere, Polymerdispersionen (wasserbasiert)',
    consumption: '0,35 - 0,50 kg/m²',
    layers: [
      'Untergrundvorbereitung (Schnitt / Porenschluss)',
      'Feinspachtelung (Porenfüller) mit PCC-Mörtel oder Epoxid-Zement-Spachtel',
      'Grundierung (Haftbrücke, meist verdünntes Systemmaterial)',
      '1. und 2. Deckbeschichtung mit elastischem Reinacrylat'
    ]
  },
  {
    id: 'os5a',
    name: 'OS 5a (OS-D.1)',
    title: 'Beschichtung mit geringer Rissüberbrückung (statisch)',
    description: 'Dickschichtigere, starre bis minimal flexible Beschichtung für nicht befahrbare Betonbauteile zur Abdeckung bereits vorhandener, ruhender (statischer) Risse.',
    flexible: true,
    thickness: 'Trockenschichtdicke ≥ 150 µm',
    bridging: 'Statische Rissüberbrückung (Klasse A1/A2)',
    trafficable: false,
    mainBinders: 'Modifizierte Acrylat-Kopolymer-Dispersionen',
    consumption: '0,50 - 0,80 kg/m²',
    layers: [
      'Untergrundvorbereitung & Egalisierungsspachtel',
      'Systemgrundierung',
      '2-facher, satter Schichtaufbau mit elastischem Acrylat-Überzug'
    ]
  },
  {
    id: 'os5b',
    name: 'OS 5b (OS-D.2)',
    title: 'Beschichtung mit mäßiger Rissüberbrückung (dynamisch)',
    description: 'Hochelastische Beschichtung für nicht befahrbare Flächen im Außenbereich (z.B. Fassaden mit thermisch-dynamischen Rissrisiken). Muss auch bei tiefen Temperaturen (-20 °C) dehnfähig bleiben.',
    flexible: true,
    thickness: 'Trockenschichtdicke ≥ 300 µm',
    bridging: 'Dynamische Rissüberbrückung (Klasse B1 bis B2 bei -20 °C)',
    trafficable: false,
    mainBinders: 'Spezial-Polyurethane/Acrylate (lösemittelhaltig oder wässrig)',
    consumption: '0,80 - 1,25 kg/m²',
    layers: [
      'Untergrundprüfung & herstellerneutrale Grundierung',
      'Satte Applikation der hochelastischen Zwischenschicht',
      'Farbtonstabile, UV-resistente Kopfversiegelung'
    ]
  },
  {
    id: 'os8',
    name: 'OS 8 (OS-H)',
    title: 'Starr befahrbares Parkhaussystem',
    description: 'Der Klassiker für extrem beanspruchte mechanische Verkehrsflächen. Optimal für Tiefgaragen-Bodenplatten, geschützte Zwischendecks, Rampen und Spindeln sowie Industrie- und Werkstattböden. Extrem verschleißfest, raue Oberfläche für hohen Rutschwiderstand (R11/R12).',
    flexible: false,
    thickness: 'Ca. 1,5 - 3,0 mm Systemdicke',
    bridging: 'Keine Rissüberbrückung (starr)',
    trafficable: true,
    mainBinders: '2K-Epoxidharz (EP), lösungsmittelfrei',
    consumption: 'Primer: 0,4 kg/m² | Basisschicht: 1,6 kg/m² | Quarzsand (0,4-0,8mm): 4,0 kg/m² | Kopfversiegelung: 0,7 kg/m²',
    layers: [
      'Untergrundvorbereitung (Kugelstrahlen verpflichtend, Haftzugfestigkeit ≥ 1,5 N/mm²)',
      'Porenfüllende Grundierung mit lösungsmittelfreiem 2K-Epoxidharz (EP)',
      'Ausgleichs- und Kratzspachtelung (Reaktionsharzmischung)',
      'Einstreuschicht aus Epoxidharz, im Überschuss mit Quarzsand (0,4-0,8 mm) abgestreut',
      'Fegen und Absaugen des ungebundenen Überschuss-Sandes',
      'Pigmentierte Kopfversiegelung mit Epoxidharz zur Festlegung des Sands'
    ]
  },
  {
    id: 'os11a',
    name: 'OS 11a (OS-F1)',
    title: 'Hochelastisches, befahrbares System (2-schichtig)',
    description: 'Hochelastisches, hoch-rissüberbrückendes Beschichtungssystem für freibewitterte Parkdeck-Flächen (Oberdecks, Brückenkappen, Parkdächer im Freien) mit thermischen Dehnungen und aktiven Rissbewegungen. Verwendet getrennte Dichtungsmembranen und Verschleißschichten.',
    flexible: true,
    thickness: 'Systemstärke ≥ 4,5 mm',
    bridging: 'Exzellente dynamische Rissüberbrückung (Klasse B3.2 bei -20 °C)',
    trafficable: true,
    mainBinders: '2K-Polyurethan (PU) oder PU-Polyurea-Hybride',
    consumption: 'Grundierung: 0,4 kg/m² | Dichtungsschicht (Membran): 2,0 kg/m² | Verschleißschicht: 1,6 kg/m² | Quarzsandabstreuung: 4,5 kg/m² | Kopfversiegelung: 0,8 kg/m²',
    layers: [
      'Untergrundvorbereitung (Kugelstrahlen, Haftzugfestigkeit ≥ 1,5 N/mm²)',
      'Systemgrundierung mit EP-Harz, leicht abgesandet',
      'Hochelastische 2K-Polyurethan-Dichtungsschicht (Membran) unbesandet',
      'Abplatzungssichere Verschleißschicht aus zähelastischem 2K-PU, im Überschuss mit Quarzsand (0,4-0,8 mm) abgestreut',
      'Absaugen des losen Sandes',
      'UV- und tausalzbeständige PU-Kopfversiegelung'
    ]
  },
  {
    id: 'os11b',
    name: 'OS 11b (OS-F2)',
    title: 'Elastisches, befahrbares System (1-schichtig/kombiniert)',
    description: 'Günstigere Alternative zu OS 11a für Parkgaragen-Zwischendecks. Die elastische Dichtungsmembran und die mechanische Verschleißschicht sind in einer einzigen, elastischen Kombischicht vereint.',
    flexible: true,
    thickness: 'Systemstärke ≥ 3,5 mm',
    bridging: 'Mäßige dynamische Rissüberbrückung (Klasse B3.1 bei -20 °C)',
    trafficable: true,
    mainBinders: 'Hochelastisch eingestelltes 2K-Polyurethan (PU)',
    consumption: 'Grundierung: 0,4 kg/m² | Kombi-Verschleißschicht: 2,2 kg/m² | Quarzsandabstreuung: 4,5 kg/m² | Kopfversiegelung: 0,8 kg/m²',
    layers: [
      'Untergrundvorbereitung (Kugelstrahlen)',
      'EP-Grundierung mit Haftbrücke',
      'Dicke Kombinationsschicht aus robustem PU-Verschleißharz, im Überschuss mit Quarzsand (0,4-0,8 mm) abgesandet',
      'Fegen und gründliches Absaugen',
      'Robuste PU-Kopfversiegelung'
    ]
  }
];

interface ReactionMechanism {
  name: string;
  type: string;
  reactants: string;
  catalysts: string;
  molecularReaction: string;
  description: string;
  processingRules: string[];
  neutralProducts: { title: string; desc: string; norms: string }[];
}

const REACTION_MECHANISMS: Record<string, ReactionMechanism> = {
  oxidative: {
    name: 'Oxidative Härtung (Autoxidation)',
    type: 'Chemisch vernetzend (Sauerstoff-Reaktion)',
    reactants: 'Ungesättigte Fettsäuren (Triglyceride mit Linol- / Linolensäureketten)',
    catalysts: 'Sikkative (herstellerneutral: Cobalt-, Mangan-, Calcium-, Zirkonium-Octoate)',
    molecularReaction: `R-CH=CH-CH2-CH=CH-R'  +  O2   --[Cobalt-Sikkativ]-->   R-CH=CH-CH(OOH)-CH=CH-R'  (Hydroperoxid)
Zerfall: R-CH=CH-CH(O·)-CH=CH-R'   --->   Direkte unlösliche Vernetzung über Ether- (-O-) oder Peroxid-Brücken (-O-O-)`,
    description: 'Der Luftsauerstoff dringt in den nassen Film ein und reagiert chemisch mit den Doppelbindungen der Fettsäuren. Es bilden sich Hydroperoxidaddukte, die mittels metallorganischer Beschleuniger (Sikkative) in Radikale zerfallen. Diese Radikale leiten eine Kettenreaktion ein, die zu einer dreidimensionalen elastischen Verklebung führt. Typisch für Alkydharze und Naturöle.',
    processingRules: [
      'Erfordert ausreichende Luftzirkulation (Sauerstoffzufuhr). In geschlossenen Behältern oder dicken Schichten bleibt der Lack unbegrenzt flüssig.',
      'Maximale Schichtdicken strikt einhalten. Zu dicke Schichten führen zu "Runzelbildung" (Hautbildung oben blockiert Sauerstoffdiffusion nach unten).',
      'UV-Anteile im Tageslicht beschleunigen den Radikalstart signifikant.'
    ],
    neutralProducts: [
      {
        title: 'Alkydharz-Bautenlack (Lösemittelbasiert)',
        desc: 'Hochwertiger Decklack für Holzbauteile und herstellerneutrale Metallfassaden im Außenbereich.',
        norms: 'DIN EN ISO 12944 (Korrosionsschutz), VOB/C ATV DIN 18363'
      },
      {
        title: 'Leinölfirnis / Naturöllasuren',
        desc: 'Tiefenwirksamer, vollkommen diffusionsoffener Holzschutz für Nadel- und Harthölzer im ökologischen Bauen.',
        norms: 'DIN EN 927 Typ F'
      }
    ]
  },
  epoxy: {
    name: 'Polyaddition (2K-Epoxidharze)',
    type: 'Chemisch vernetzend (Duromer-Reaktionsharz)',
    reactants: 'Komponente A (Epoxidharz-Prepolymer, z. B. Bisphenol-A-Diglycidylether) + Komponente B (Amin-Härter, z. B. Polyamine oder Polyamidoamine)',
    catalysts: 'Säurehaltige Härtungsbeschleuniger (herstellerneutral: tertiäre Amine, Salicylsäure)',
    molecularReaction: `          O
         / \\
R - CH - CH2   +   H2N - R' (Amin)   ---->   R - CH(OH) - CH2 - NH - R' (Alkohol + sekundäres Amin)
(Freie Aminogruppen greifen nucleophil an den polarisierten Sauerstoffring unter Ringöffnung an. Keine Spaltprodukte!)`,
    description: 'Die reaktiven Oxiranringe (Epoxidgruppen) der Stammkomponente reagieren ohne Abspaltung von Nebenprodukten mit den aktiven Wasserstoffatomen der Aminogruppen. Durch progressive Polyaddition entsteht ein hochfestes, chemikalienbeständiges und enorm steifes, duroplastisches Epoxidnetzwerk.',
    processingRules: [
      'Stöchiometrisches Mischungsverhältnis (A+B) exakt auswiegen. Abweichungen führen zu unvollständiger Härtung, Klebrigkeit und dramatischem Festigkeitsverlust.',
      'Sorgfältig mechanisch anmischen (mindestens 3 Minuten rühren), danach zwingend in ein neues Mischgefäß umtopfen und erneut kurz rühren, um ungemischte Randzonen auszuschließen.',
      'Die Härtungsreaktion ist stark temperaturabhängig. Unter +8°C bis +10°C friert die chemische Reaktion fast vollständig ein.',
      'Die Topfzeit (Potlife) begrenzt das Zeitfenster der Verarbeitung. Achtung: Exotherme Reaktion (Mischung im Eimer wird extrem heiß und geliert schlagartig).'
    ],
    neutralProducts: [
      {
        title: '2K-Epoxidharz-Bodenbeschichtung (Lösemittelfrei)',
        desc: 'Hochextrem belastbarer, flüssigkeitsdichter Schutzbelag für Lagerhallen, Industrieböden und Parkdecks.',
        norms: 'DIN EN 1504-2 (Oberflächenschutz für Beton)'
      },
      {
        title: '2K-Zinkstaub-Grundierung / EP-Grundbeschichtung',
        desc: 'Kathodisch wirksamer, ununterbrechbarer Epoxidharz-Rostschutzprimer für Stahlkonstruktionen im schweren Korrosionsschutz.',
        norms: 'DIN EN ISO 12944-5'
      }
    ]
  },
  polyurethane: {
    name: 'Polyaddition (2K-Polyurethane)',
    type: 'Chemisch vernetzend (Hydrophobe Polyisocyanat-Reaktion)',
    reactants: 'Komponente A (Polyol, z. B. verzweigte Polyester, Acrylate oder Polyether) + Komponente B (Polyisocyanate, z. B. ungeladene cycloaliphatische Diisocyanate wie HDI oder IPDI)',
    catalysts: 'Metallorganische Katalysatoren (herstellerneutral: Dibutylzinndilaurat - DBTDL) oder tertiäre Aminverbindungen',
    molecularReaction: `R - N=C=O (Isocyanatgruppe)   +   HO - R' (Hydroxylgruppe, Polyol)   ---->   R - NH - CO - O - R' (Urethangruppe)
Gravotrope Störreaktion (Gefahr!):
R - N=C=O (Isocyanat)  +  H2O (Wasser/Feuchte)   ---->   R - NH2 (Amin)  +  CO2↑ (Kohlendioxid-Blasengas!)`,
    description: 'Die Hydroxylgruppen der Bindemittelmatrix addieren sich an die hochreaktiven Isocyanatgruppen der Härterkomponente. Es entstehen hochfeste, zäh-elastische Urethanverknüpfungen. 2K-Polyurethan-Verbindungen auf aliphatischer Isocyanatbasis (HDI/IPDI) bieten die weltweit beste Licht-, UV- und Kreidungsbeständigkeit im Bautenschutz.',
    processingRules: [
      'Vorzeitiger Kontakt mit Wasser oder Substratfeuchtigkeit führt zur Zersetzung des Härters unter Freisetzung von CO2-Gasen. Die Folge sind sichtbare Mikroporen, Krater und Bläschen im gehärteten Lackfilm.',
      'Aerosole und Isocyanatdämpfe sind stark atemwegssensibilisierend. Bei Spritz-Applikationen sind Atemschutzmasken (A2P3-Aktivkohlefilter) und dichte Schutzmasken zwingend vorgeschrieben.'
    ],
    neutralProducts: [
      {
        title: '2K-Acryl-Polyurethan-Decklack (Lösemittel- oder wasserbasiert)',
        desc: 'Hochglänzender, extrem witterungsstabiler Anti-Graffiti- und Farbton-Schutzdecklack für Fassaden und Brückenbauwerke.',
        norms: 'DIN EN ISO 12944-5, Klasse C5'
      },
      {
        title: 'Flüssig aufzubringende PUR-Dachabdichtung',
        desc: 'Hochelastische, nahtlose, rissüberbrückende elastomere Beschichtung für Flachdächer und Logistikbauten.',
        norms: 'ETAG 005 (Europäische Leitlinie für flüssig aufzubringende Abdichtungen)'
      }
    ]
  },
  silicate: {
    name: 'Reine Silikat-Verkieselung',
    type: 'Mineralisch / Chemisch vernetzend',
    reactants: 'Wasserlösliches Kaliwasserglas (Kaliumsilikat, K2O · n SiO2) + Reaktionspartner (saures Kohlendioxid CO2 und freies Calciumhydroxid Ca(OH)2 des Zement-/Kalkputzes)',
    catalysts: 'Keine (Selbsttätige hydrothermale Reaktion im Carbonatpuffer)',
    molecularReaction: `K2O·n SiO2   +   CO2   +   Ca(OH)2   ---->   CaSiO3·x H2O (Calcium-Silikat-Hydrat-Kristalle)  +  K2CO3
(Chemische Verschmelzung und Verankerung im kristallinen Molekülgitter des Putzuntergrundes)`,
    description: 'Im Gegensatz zu Kunstharzlacken bilden reine Silikatfarben keinen geschlossenen Kunststofffilm. Das flüssige Wasserglas dringt tief in die Poren des Putzes ein und reagiert sauer mit den Kalkbestandteilen und Kohlendioxid. Dabei entstehen wasserunlösliche, gesteinsähnliche Calciumsilikate. Dieser mineralische Prozess wird als "Verkieselung" bezeichnet.',
    processingRules: [
      'Ausschließlich auf karbonatisch oder mineralisch gebundenen, tragfähigen Untergründen (Kalkputz, Zementputz, Beton) anwendbar. Absolut ungeeignet auf Gips, Holz, Metall oder Altkunststoffen.',
      'Kaliwasserglas ist hochalkalisch (pH-Wert ~11-12) und reagiert stark ätzend! Alle Glasflächen, Aluminium-Fassadenelemente, Fliesen und Natursteine müssen hermetisch abgeklebt werden, da ein Farbspritzer das Silikatgitter von Glas sofort ätzt und nachhaltig trübt.',
      'Die relative Feuchtigkeit während der Erstverkieselung darf nicht zu hoch sein, da sonst Löseeffekte auftreten.'
    ],
    neutralProducts: [
      {
        title: 'Zwei-Komponenten-Reinsilikatfarbe (Wasserglas + Pigmentpulver)',
        desc: 'Absolut biozidfreie, mineralisch-matte Fassadenbeschichtung mit extrem hoher Lebensdauer (> 50 Jahre) für historische Denkmäler.',
        norms: 'DIN 18363, Abs. 2.4.1 (Frei von organischen Kunstharzdispersionen)'
      },
      {
        title: 'Kieselsäureester-Steinfestiger',
        desc: 'Herstellerneutraler, extrem kapillaraktiver Tiefenfestiger zur Festigung von porösem, labilem Sandstein oder Denkmalskulpturen.',
        norms: 'DIN EN 1504-2 Oberflächenschutz'
      }
    ]
  },
  radiation: {
    name: 'UV / Strahlenhärtung (Radikalische Polymerisation)',
    type: 'Chemisch vernetzend (Strahleninitiiert)',
    reactants: 'Ungesättigte Polyester- oder Polyacrylat-Oligomere und herstellerneutrale Reaktivverdünner (Monomere)',
    catalysts: 'Photoinitiatoren (z. B. Benzophenone oder Acylphosphinoxide), die unter UV-Strahlung homolytisch spalten',
    molecularReaction: `Photoinitiator   --[h·ν (UV-Licht, λ = 365-405 nm)]-->   2 R· (Starter-Radikale)
R·  +  CH2 = CH - COOR' (Acrylatester)   ---->   R - CH2 - C·H - COOR' (Kettenstart)
(Ultra-schneller Schichtaufbau durch radikalische Additions-Kettenpolymerisation der Doppelbindungen)`,
    description: 'Die flüssig applizierte Formulierung wird einer intensiven UV-Dosis (z.B. Quecksilbermitteldruckstrahler oder moderne Gallium-dotierte UV-LEDs) ausgesetzt. Die Photoinitiatoren zerfallen in Millisekunden in hochreaktive Radikale, welche die Polymerbildung der Acrylat-Oligomere starten. Der Lack schließt sich sofort zu einer hochfesten, glasharten Kunststoffschicht.',
    processingRules: [
      'Härtung setzt direkten Sichtkontakt des Bauteils zur UV-Quelle voraus. In "Schattenzonen" komplexer 3D-Baukörper härtet der Lack nicht aus (Hierfür sind Hybrid- oder Dual-Cure-Lacke mit zusätzlicher thermischer Vernetzung erforderlich).',
      'Die Sauerstoffinhibierung blockiert die oberste Molekülschicht vor vollständiger Kettenverknüpfung (Abhilfe: Inertgas-Flutung mit Stickstoff oder dickere Sperrschichten).'
    ],
    neutralProducts: [
      {
        title: 'UV-Härtender Acryllack / UV-Siegellack (Flüssig)',
        desc: 'Kratzfester Kratzschutzüberzug für herstellerneutrales Fertigparkett, Paneele, Arbeitsplatten und industrielle Holzfußböden.',
        norms: 'DIN 68861 (Verhalten von Möbeloberflächen), DIN EN 14342 (Holzböden)'
      },
      {
        title: 'UV-beschleunigtes Rohrsanierungs-Inlinerharz',
        desc: 'Synthetische, nahtlose Schlauchliner-Methode zur strukturellen Innensanierung erdverlegter Abwasserleitungen mittels mobiler UV-Lichtzüge.',
        norms: 'DIN EN ISO 11296-4'
      }
    ]
  }
};

export default function BpFarbenLacke() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'komponenten' | 'filmchemie' | 'bindemittel' | 'rechner' | 'voc' | 'oberflaechenschutz'>('allgemein');
  const [selectedMech, setSelectedMech] = useState<string>('oxidative');

  // OS-System selector state
  const [osArea, setOsArea] = useState<number>(300); // m²
  const [osEinsatzbereich, setOsEinsatzbereich] = useState<string>('tiefgarage_boden');
  const [osCrackBridging, setOsCrackBridging] = useState<string>('nein');
  const [osBelastung, setOsBelastung] = useState<string>('leicht_pkw');
  const [selectedOsId, setSelectedOsId] = useState<string>('os8');

  // Input states for calculation
  const [targetDft, setTargetDft] = useState<number>(40); // µm (Desired dry thickness)
  const [solidsVol, setSolidsVol] = useState<number>(45); // % (Volume Solids)
  const [thinning, setThinning] = useState<number>(5); // % (Add dilution)
  const [lossFactor, setLossFactor] = useState<number>(20); // % (Overspray, roller loss, etc.)
  const [areaSquareMeters, setAreaSquareMeters] = useState<number>(120); // m²
  const [numCoats, setNumCoats] = useState<number>(2); // Number of coats

  // Calculations
  // 1. Wet Film Thickness without dilution: WFT = (DFT * 100) / Solids_Vol
  const baseWft = useMemo(() => {
    if (solidsVol <= 0) return 0;
    return (targetDft * 100) / solidsVol;
  }, [targetDft, solidsVol]);

  // 2. Wet Film Thickness including thinning: WFT_thinned = WFT * (1 + thin/100)
  const thinnedWft = useMemo(() => {
    return baseWft * (1 + thinning / 100);
  }, [baseWft, thinning]);

  // 3. Spreading Rate (theoretisch) in m²/Liter: 10 * VolumeSolids[%] / DFT[µm]
  const theoreticalSpreadingRate = useMemo(() => {
    if (targetDft <= 0) return 0;
    return (10 * solidsVol) / targetDft;
  }, [solidsVol, targetDft]);

  // 4. Consumption rate:
  // Theoretical Consumption (ml/m² per coat) = WFT (without dilution, because dilution evaporates)
  // Effective Consumption with loss factor = Theoretical Consumption / (1 - loss/100)
  const theoreticalConsumption = useMemo(() => {
    return baseWft; // µm is equal to ml/m² for liquids without loss and before thinning evaporation
  }, [baseWft]);

  const effectiveConsumption = useMemo(() => {
    if (lossFactor >= 100) return 0;
    return theoreticalConsumption / (1 - lossFactor / 100);
  }, [theoreticalConsumption, lossFactor]);

  // Total required quantity in liters = (effectiveConsumption * area * coats) / 1000
  const totalLitersRequired = useMemo(() => {
    return (effectiveConsumption * areaSquareMeters * numCoats) / 1000;
  }, [effectiveConsumption, areaSquareMeters, numCoats]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-6">
          <Paintbrush className="text-shiraz" size={28} />
          <h2 id="modul-titel" className="text-xl font-bold text-text-main flex items-center gap-2">
              Farben &amp; Lacke im Bauwesen
            </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Umfassendes Kompendium über Beschichtungssysteme, Bindemittel-Chemie, Schichtdicken-Berechnung und VOC-Regularien
          </p>
        </div>
        </div>

        {/* Local Tab Navigation */}
        <div className="flex border-b border-home-grau/30 mb-6 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('allgemein')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 ${
              activeTab === 'allgemein'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            Allgemeine Übersicht
          </button>
          <button
            onClick={() => setActiveTab('komponenten')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 ${
              activeTab === 'komponenten'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            Die 4 Hauptbestandteile
          </button>
          <button
            onClick={() => setActiveTab('filmchemie')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 ${
              activeTab === 'filmchemie'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            <span className="flex items-center gap-1">
              <FlaskConical size={14} /> Chemie &amp; Filmbildung
            </span>
          </button>
          <button
            onClick={() => setActiveTab('bindemittel')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 ${
              activeTab === 'bindemittel'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            Bindemittel-Matrix
          </button>
          <button
            onClick={() => setActiveTab('rechner')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 ${
              activeTab === 'rechner'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            <span className="flex items-center gap-1">
              <Calculator size={14} /> Schichtdicken- &amp; Mengenschätzer
            </span>
          </button>
          <button
            onClick={() => setActiveTab('voc')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 whitespace-nowrap ${
              activeTab === 'voc'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            Schadstoffe &amp; VOC-Grenzwerte
          </button>
          <button
            onClick={() => setActiveTab('oberflaechenschutz')}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 whitespace-nowrap ${
              activeTab === 'oberflaechenschutz'
                ? 'border-shiraz text-shiraz'
                : 'border-transparent text-text-main/60 hover:text-text-main hover:border-home-grau/40'
            }`}
          >
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} /> Oberflächenschutzsysteme (OS)
            </span>
          </button>
        </div>

        {/* TAB CONTENST */}
        <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-300">
          
          {/* TAB 1: ALLGEMEIN */}
          {activeTab === 'allgemein' && (
            <div className="space-y-6">
              <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
                <h3 className="font-bold text-shiraz text-base mb-2">Bedeutung von Beschichtungen im Hoch- und Tiefbau</h3>
                <p className="mb-3">
                  Farben, Lacke und Lasuren sind im Bauwesen weit mehr als reine Gestaltungselemente. Sie bilden die erste Abwehrschicht eines Bauteils gegen aggressive Umwelteinflüsse, Chloride, Feuchtigkeit, UV-Strahlung und sauren Regen. 
                </p>
                <p>
                  Ein optimal gewähltes Beschichtungssystem entscheidet maßgeblich über die <strong>Instandhaltungszyklen und Nutzungsdauer</strong> von Betonfassaden, Holzkonstruktionen und Stahltragwerken (Korrosionsschutzschichten).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold mb-3">1</div>
                  <h4 className="font-bold text-text-main text-sm">Schutzfunktion</h4>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Verhinderung von Feuchtigkeitseintritt (Regenschutz), Abwehr von gasförmigen Schadstoffen (z.B. CO₂-Bremse zur Vermeidung von Betonkarbonatisierung) und Schutz vor UV-Degradation von organischen Baustoffen (Holz, Kunststoffe).
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/10 text-orange-600 flex items-center justify-center font-bold mb-3">2</div>
                  <h4 className="font-bold text-text-main text-sm">Hygiene &amp; Raumklima</h4>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Einstellung der Raumfeuchte durch diffusionsoffene Innenanstriche (Zweiwege-Feuchteregulierung). Mineralische Farben (Kalk- und Silikatfarben) verhindern die Ansiedlung von Schimmelpilzen auf vollkommen natürliche, biozidfreie Weise dank ihres exzellenten pH-Wertes.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold mb-3">3</div>
                  <h4 className="font-bold text-text-main text-sm">Ästhetik &amp; Lichtausbeute</h4>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Glanzgrad und Helligkeitskoeffizienten beeinflussen die Tageslichtnutzung im Gebäudeinneren und können Wärmeabsorptionen an Außenfassaden steuern (Stichwort: Reflektion von Infrarotlicht zur Vermeidung städtischer Wärmeinseln).
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-950 flex gap-3">
                <Info size={20} className="text-amber-700 mt-0.5 flex-none" />
                <div>
                  <strong className="font-bold">Praktischer Bau-Tipp:</strong> Untergründe müssen vor der Ausführung stets fest, sauber, trocken und tragfähig sein. Die häufigste Fehlerursache bei Abplatzungen ist eine mangelhafte Vorbereitung (Zementleierschichten auf Beton, kriechende Holzfeuchte oder ungeeignete Altanstriche als Trennlagen). Ein einfacher Gitterschnitt-Test nach DIN EN ISO 2409 offenbart die Haftfestigkeit von Bestandsschichten!
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KOMPONENTEN */}
          {activeTab === 'komponenten' && (
            <div className="space-y-6">
              <h3 className="font-bold text-text-main text-xl">Woraus besteht ein Beschichtungsstoff?</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Nahezu alle Farben und Lacke setzen sich aus vier funktionalen Komponentengruppen zusammen:
          </p>
        </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-stone-50 rounded-xl border border-home-grau/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-shiraz text-white font-mono font-black text-xs flex items-center justify-center">1</span>
                    <h4 className="font-bold text-text-main text-sm sm:text-base">Das Bindemittel (Die Basis)</h4>
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Die primäre Trägerkomponente des Beschichtungsstoffs. Sie verbindet die Pigmentpartikel untereinander und verklebt sie dauerhaft mit dem Untergrund. Nach der Trocknung bildet das Bindemittel den eigentlichen Schutzfilm.
                  </p>
                  <p className="text-xs text-text-main/70 bg-white p-2.5 rounded border border-home-grau/10">
                    <strong>Beispiele:</strong> Acrylharze, Alkydharze, Epoxidharze, Silikate (Kaliwasserglas), Sumpfkalk, Polyurethane.
                  </p>
                </div>

                <div className="p-5 bg-stone-50 rounded-xl border border-home-grau/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-shiraz text-white font-mono font-black text-xs flex items-center justify-center">2</span>
                    <h4 className="font-bold text-text-main text-sm sm:text-base">Lösemittel / Wasser (Trägermaterial)</h4>
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Ermöglicht das flüssige Aufbringen und Einstellen der optimalen Viskosität für Rollen, Streichen oder Spritzen. Nach dem Auftrag verdunstet es vollständig und ist somit an der endgültigen Schutzwirkung nicht direkt beteiligt.
                  </p>
                  <p className="text-xs text-text-main/70 bg-white p-2.5 rounded border border-home-grau/10">
                    <strong>Beispiele:</strong> Wasser (bei Dispersions- und Acrylfarben), Benzine (Kunstharzlacke), Alkohole, Ester.
                  </p>
                </div>

                <div className="p-5 bg-stone-50 rounded-xl border border-home-grau/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-shiraz text-white font-mono font-black text-xs flex items-center justify-center">3</span>
                    <h4 className="font-bold text-text-main text-sm sm:text-base">Pigmente &amp; Füllstoffe (Farbaufbau)</h4>
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Pigmente liefern den Farbton und sorgen für Deckkraft und UV-Schutz. Füllstoffe (Kreide, Talkum, Schwerspat) regulieren den Glanzgrad, die Dichte, die Viskosität und erhöhen den mechanischen Festkörperanteil.
                  </p>
                  <p className="text-xs text-text-main/70 bg-white p-2.5 rounded border border-home-grau/10">
                    <strong>Beispiele:</strong> Titandioxid (Weißpigment), Eisenoxide (Rot/Gelb), Kreidemehl, Siliziumdioxid.
                  </p>
                </div>

                <div className="p-5 bg-stone-50 rounded-xl border border-home-grau/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-shiraz text-white font-mono font-black text-xs flex items-center justify-center">4</span>
                    <h4 className="font-bold text-text-main text-sm sm:text-base">Additive (Spezialhelfer)</h4>
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    In Kleinstmengen (0,1 – 2 %) zugesetzt, um gezielte Verarbeitungseigenschaften einzustellen. Sie steuern das Fließverhalten, verhindern Schimmelbildung im Gebinde oder beschleunigen die Trocknung.
                  </p>
                  <p className="text-xs text-text-main/70 bg-white p-2.5 rounded border border-home-grau/10">
                    <strong>Beispiele:</strong> Entschäumer, Verlaufshilfsmittel, Topfkonservierer (Biozide), Trockenstoffe (Sikkative für Öle).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHEMIE & FILMBILDUNG */}
          {activeTab === 'filmchemie' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
                <h3 className="font-bold text-shiraz text-base mb-2">Makromolekulare Lackchemie &amp; Filmbildung</h3>
                <p className="mb-3">
                  Lacke bestehen nicht nur aus farbgebenden Pigmenten; ihre tatsächliche Funktion beruht auf der Verknüpfung winziger Monomere und Oligomere zu riesigen Polymernetzwerken. Dieser Übergang vom flüssigen in den festen Zustand bestimmt die mechanischen und chemischen Resistenzen des Baustoffs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-white p-4 rounded-lg border border-home-grau/20">
                  <div>
                    <h5 className="font-bold text-text-main text-xs uppercase tracking-wider mb-1">Physikalische Filmbildung</h5>
                    <p className="text-xs text-text-main/70">
                      Reines Trocknen durch das Verdunsten flüchtiger organischer Lösemittel oder Wasser. Die Polymerketten liegen bereits voll funktional vor und "verknäueln" sich lediglich mechanisch. Reversibel löslich (z.B. Dispersionsfarben, Chlorkautschuksysteme).
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-shiraz text-xs uppercase tracking-wider mb-1">Chemische Filmbildung</h5>
                    <p className="text-xs text-text-main/70">
                      Irreversible chemische Reaktion während der Verarbeitungsphase. Durch Autoxidation, Polyaddition oder lichtinitiierte Polymerisation vernetzen sich Moleküle dreidimensional über kovalente Hauptvalenzbindungen. Absolut resistent gegen Rücklösung (z.B. Polyurethane, Epoxide, Silikate).
                    </p>
                  </div>
                </div>
              </div>

              {/* Interaktiver Selektor für Härtungsmechanismen */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Linke Leiste (Navigation der Mechanismen) */}
                <div className="lg:col-span-4 flex flex-col gap-2">
                  <div className="text-xs font-bold text-text-main/50 uppercase tracking-widest pl-2 mb-1">Mechanismen der Lehre (VCI)</div>
                  {Object.entries(REACTION_MECHANISMS).map(([key, mech]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedMech(key)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 w-full ${
                        selectedMech === key
                          ? 'bg-shiraz/5 border-shiraz text-text-main shadow-xs'
                          : 'bg-white border-home-grau/25 text-text-main/75 hover:bg-stone-50 hover:border-home-grau/40'
                      }`}
                    >
                      <Atom className={`mt-0.5 flex-none ${selectedMech === key ? 'text-shiraz' : 'text-text-main/40'}`} size={18} />
                      <div>
                        <div className="font-bold text-sm">{mech.name}</div>
                        <div className="text-xs text-text-main/50 mt-0.5">{mech.type}</div>
                      </div>
                    </button>
                  ))}
                  
                  {/* Physikalische Erklärung der Lichtstreuung */}
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
                    <h5 className="font-bold flex items-center gap-1.5"><Layers size={14} className="text-amber-800" /> Streukraft-Exkurs (Brechzahl)</h5>
                    <p className="leading-relaxed">
                      Die Deckkraft weißer Pigmente beruht auf dem Unterschied ihrer Brechzahl zum Bindemittel (<span className="font-mono">n ≈ 1,5</span>). 
                      <strong>Titandioxid (Rutil)</strong> besitzt mit <span className="font-mono">n = 2,7</span> das größte Deckvermögen. 
                      Füllstoffe wie <strong>Kreide</strong> (<span className="font-mono">n = 1,6</span>) erscheinen im Bindemittel fast transparent und dienen primär der Füllvolumen-Erhöhung.
                    </p>
                  </div>
                </div>

                {/* Rechte Detailanzeige */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-home-grau/30 shadow-xs p-6 space-y-6">
                  {(() => {
                    const mech = REACTION_MECHANISMS[selectedMech];
                    return (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
                          <div>
                            <span className="text-xs font-bold text-shiraz uppercase tracking-widest bg-shiraz/10 px-2 py-0.5 rounded-sm">
                              {mech.type}
                            </span>
                            <h4 className="text-xl font-bold text-text-main mt-1.5">{mech.name}</h4>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-xs bg-stone-100 text-stone-700 font-mono px-2.5 py-1 rounded">
                              VCI-Lehrfolie {selectedMech === 'oxidative' ? '03/04' : selectedMech === 'epoxy' ? '06/07' : selectedMech === 'polyurethane' ? '08' : selectedMech === 'silicate' ? '12' : '15'}
                            </span>
                          </div>
                        </div>

                        {/* Chemische Partner */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                            <span className="text-[10px] font-bold text-text-main/50 uppercase block mb-1">Reaktive Edukte (Bindungspartner)</span>
                            <span className="text-xs font-medium text-text-main/90 leading-relaxed">{mech.reactants}</span>
                          </div>
                          <div className="bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                            <span className="text-[10px] font-bold text-text-main/50 uppercase block mb-1">Katalysatoren / Reaktions-Initiatoren</span>
                            <span className="text-xs font-medium text-text-main/90 leading-relaxed">{mech.catalysts}</span>
                          </div>
                        </div>

                        {/* Molekülgleichung */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block">Chemische Struktur- und Vernetzungs-Gleichung</span>
                          <pre className="font-mono text-xs p-4 bg-stone-900 text-stone-200 rounded-xl overflow-x-auto whitespace-pre leading-relaxed border border-stone-850 shadow-inner">
                            {mech.molecularReaction}
                          </pre>
                        </div>

                        {/* Beschreibung */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block">Prozessbeschreibung (Mikroskopische Ebene)</span>
                          <p className="text-sm text-text-main/80 leading-relaxed bg-off-white/40 p-3 rounded-lg border border-home-grau/10">
                            {mech.description}
                          </p>
                        </div>

                        {/* Verarbeitungsvorschriften */}
                        <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200/60 space-y-3">
                          <h5 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                            <AlertTriangle className="text-amber-700" size={18} />
                            Kritische Ausführungs- &amp; Verarbeitungsregeln für Bauproﬁs:
                          </h5>
                          <ul className="list-disc list-inside text-xs text-amber-900 space-y-1.5 pl-1 leading-relaxed">
                            {mech.processingRules.map((rule, idx) => (
                              <li key={idx} className="align-top">
                                <span className="font-medium">{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Herstellerneutrale Bausysteme */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block">Herstellerneutrale Systeme &amp; Erzeugnisse im Hoch- &amp; Tiefbau</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mech.neutralProducts.map((p, pIdx) => (
                              <div key={pIdx} className="p-4 rounded-xl border border-home-grau/20 bg-white shadow-3xs space-y-1 hover:border-shiraz/40 transition-colors">
                                <div className="font-bold text-shiraz text-xs">{p.title}</div>
                                <p className="text-xs text-text-main/70 leading-normal">{p.desc}</p>
                                <div className="text-[10px] text-text-main/40 mt-1 font-mono">{p.norms}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interaktiver Phasen-Visualisierer */}
                        <div className="border-t border-home-grau/20 pt-5">
                          <div className="text-[10px] font-bold text-text-main/50 uppercase tracking-wider block mb-3">Phasen der Trocknung und Filmbildung (Schematisch)</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-stone-50 p-3.5 rounded-lg border border-home-grau/15 flex flex-col justify-between">
                              <div>
                                <span className="text-xs font-bold text-shiraz">Phase 1: Nassauftrag</span>
                                <p className="text-[11px] text-text-main/70 mt-1 leading-normal">Bindemittel, Pigmente und Lösemittelmoleküle sind homogen verteilt und frei gleitend.</p>
                              </div>
                              <div className="h-10 bg-white rounded border border-home-grau/20 mt-3 relative overflow-hidden flex items-center justify-around px-2">
                                <div className="absolute top-0 inset-x-0 h-1 bg-sky-300 animate-pulse"></div>
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-shiraz"></div>
                                <div className="w-2 h-2 rounded-full bg-stone-400"></div>
                                <div className="w-3 h-3 rounded-full bg-sky-400"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                              </div>
                            </div>

                            <div className="bg-stone-50 p-3.5 rounded-lg border border-home-grau/15 flex flex-col justify-between">
                              <div>
                                <span className="text-xs font-bold text-shiraz">Phase 2: Verdampfung &amp; Start</span>
                                <p className="text-[11px] text-text-main/70 mt-1 leading-normal">Trägerstoff entweicht. Erste Vernetzungspunkte oder Kettenverhakungen entstehen.</p>
                              </div>
                              <div className="h-10 bg-white rounded border border-home-grau/20 mt-3 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute -top-3 text-[10px] text-sky-400 animate-bounce">↑ ↑ ↑</div>
                                <div className="flex gap-1.5 items-center">
                                  <div className="w-2 h-2 rounded-full bg-shiraz animate-ping"></div>
                                  <span className="text-[9px] font-mono text-stone-400">⚡</span>
                                  <div className="w-2.5 h-2.5 rounded-full bg-shiraz"></div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-stone-50 p-3.5 rounded-lg border border-home-grau/15 flex flex-col justify-between">
                              <div>
                                <span className="text-xs font-bold text-shiraz">Phase 3: Ausgehärtet</span>
                                <p className="text-[11px] text-text-main/70 mt-1 leading-normal">Ein räumlich vermaschter, absolut unlöslicher Farbfilm haftet untrennbar auf dem Untergrund.</p>
                              </div>
                              <div className="h-10 bg-shiraz/10 rounded border border-shiraz/30 mt-3 relative overflow-hidden flex items-center justify-center">
                                <div className="w-11/12 h-0.5 bg-shiraz absolute"></div>
                                <div className="w-11/12 h-0.5 bg-shiraz absolute rotate-12"></div>
                                <div className="w-11/12 h-0.5 bg-shiraz absolute -rotate-12"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-shiraz border border-white z-10"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-shiraz border border-white z-10 ml-6"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-shiraz border border-white z-10 mr-6"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BINDEMITTELMATRIX */}
          {activeTab === 'bindemittel' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Die Bindemittel-Bibliothek</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Vergleichende Analyse aller baurelevanten Bindemittelarten und ihrer GISCODE-Einstufungen
          </p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BINDERS.map((binder, idx) => (
                  <div key={idx} className="bg-white border border-home-grau/25 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-shiraz/40 transition-colors">
                    <div className="space-y-3">
                      <div className="border-b border-home-grau/10 pb-2">
                        <span className="text-xs uppercase tracking-wider font-bold text-shiraz">{binder.category}</span>
                        <h4 className="font-black text-text-main text-base mt-0.5 leading-tight">{binder.name}</h4>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-text-main/40 font-bold block">Vorteile:</span>
                        <ul className="text-sm text-text-main/80 space-y-0.5 pl-2">
                          {binder.advantages.map((adv, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-1">
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                              <span>{adv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-text-main/40 font-bold block">Einschränkungen:</span>
                        <ul className="text-sm text-text-main/80 space-y-0.5 pl-2">
                          {binder.disadvantages.map((dis, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-1">
                              <span className="text-red-600 font-bold shrink-0">✕</span>
                              <span>{dis}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-home-grau/10 mt-4 space-y-2">
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] leading-tight">
                        <div className="bg-stone-50 p-2 rounded text-center border border-home-grau/10">
                          <span className="text-text-main/40 block font-semibold uppercase text-[8px]">Diffusionsfähigkeit</span>
                          <span className="font-bold text-text-main mt-0.5 block">{binder.sdValue}</span>
                        </div>
                        <div className="bg-stone-50 p-2 rounded text-center border border-home-grau/10">
                          <span className="text-text-main/40 block font-semibold uppercase text-[8px]">GISCODE / PUF-Code</span>
                          <span className="font-bold text-indigo-700 mt-0.5 block">{binder.pufCode || 'N/A'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-text-main/70 leading-normal italic mt-1">
                        <strong>Einsatz:</strong> {binder.typicalUse}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CALCULATOR */}
          {activeTab === 'rechner' && (
            <div className="space-y-6">
              <div className="p-5 bg-stone-50 border border-home-grau/25 rounded-xl">
                <div className="flex items-center gap-2 mb-4 border-b border-home-grau/15 pb-2">
                  <Calculator className="text-shiraz" size={20} />
                  <span className="text-sm font-bold text-text-main">
                    Interaktiver Schichtdicken-, Verbrauch- &amp; Mengenschätzer
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* SLIDERS & PARAMETERS */}
                  <div className="lg:col-span-6 space-y-5 bg-white p-5 rounded-xl border border-home-grau/15">
                    
                    {/* Desired Dry Film Thickness (DFT) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-text-main flex items-center gap-1.5">
                          Trockenschichtdicke (DFT / <span className="italic">dry film thickness</span>)
                          <InfoTooltip text="Die Enddicke der getrockneten Beschichtung. Standardwandfarbe liegt bei ca. 30-50 µm pro Schicht, schwerer Korrosionsschutz bei über 150-250 µm." />
                        </label>
                        <span className="font-mono text-xs font-bold text-shiraz bg-shiraz/5 px-2 py-0.5 rounded border border-shiraz/10">
                          {formatDeWert(targetDft)} µm
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="300"
                        step="5"
                        value={targetDft}
                        onChange={(e) => setTargetDft(Number(e.target.value))}
                        className="w-full accent-shiraz h-2 bg-home-grau/20 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Festkörper-Volumenanteil (Volume Solids) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-text-main flex items-center gap-1.5">
                          Festkörper-Volumenanteil (Vol-% Solids)
                          <InfoTooltip text="Prozentsatz der flüssigen Farbe, der nach Verdunstung des Lösemittels/Wassers dauerhaft auf der Fläche verbleibt." />
                        </label>
                        <span className="font-mono text-xs font-bold text-shiraz bg-shiraz/5 px-2 py-0.5 rounded border border-shiraz/10">
                          {formatDeWert(solidsVol)} %
                        </span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="100"
                        step="1"
                        value={solidsVol}
                        onChange={(e) => setSolidsVol(Number(e.target.value))}
                        className="w-full accent-shiraz h-2 bg-home-grau/20 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-text-main/50 font-bold px-0.5">
                        <span>Lösemittelreich (25%)</span>
                        <span>Mittelklasse (45%)</span>
                        <span>High-Solid / Lösemittelfrei (80-100%)</span>
                      </div>
                    </div>

                    {/* Dilution add (Verdünnungszugabe) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-text-main flex items-center gap-1.5">
                          Verdünnungszugabe
                          <InfoTooltip text="Wasser- oder Lösemittelmenge, die zur Erleichterung des Farbauftrags hinzugefügt wird (erhöht die temporäre Nassdicke, entweicht vollständig)." />
                        </label>
                        <span className="font-mono text-xs font-bold text-shiraz bg-shiraz/5 px-2 py-0.5 rounded border border-shiraz/10">
                          {formatDeWert(thinning)} %
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        step="1"
                        value={thinning}
                        onChange={(e) => setThinning(Number(e.target.value))}
                        className="w-full accent-shiraz h-2 bg-home-grau/20 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Loss factor (%) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-text-main flex items-center gap-1.5">
                          Verlustfaktor (Prozessverlust)
                          <InfoTooltip text="Farbverluste durch Spraynebel (Overspray), im Gebinde verbleibende Restmengen oder Verlust in Rollen/Pinseln." />
                        </label>
                        <span className="font-mono text-xs font-bold text-shiraz bg-shiraz/5 px-2 py-0.5 rounded border border-shiraz/10">
                          {formatDeWert(lossFactor)} %
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="5"
                        value={lossFactor}
                        onChange={(e) => setLossFactor(Number(e.target.value))}
                        className="w-full accent-shiraz h-2 bg-home-grau/20 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-text-main/50 font-bold px-0.5">
                        <span>Rolle (10-15%)</span>
                        <span>Spritzen / Airless (30-45%)</span>
                        <span>Extrem stürmischer Außenwind (50%+)</span>
                      </div>
                    </div>

                    {/* Area & Coats fields */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-home-grau/10">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-main/50 uppercase">Fläche (m²)</label>
                        <input
                          type="number"
                          value={areaSquareMeters}
                          min="1"
                          onChange={(e) => setAreaSquareMeters(Math.max(1, Number(e.target.value)))}
                          className="w-full p-2 text-xs border border-home-grau rounded-md bg-white font-mono font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-main/50 uppercase">Anzahl Arbeitsgänge</label>
                        <select
                          value={numCoats}
                          onChange={(e) => setNumCoats(Number(e.target.value))}
                          className="w-full p-2 text-xs border border-home-grau rounded-md bg-white font-bold"
                        >
                          <option value={1}>1 Anstrich</option>
                          <option value={2}>2 Anstriche (Standard)</option>
                          <option value={3}>3 Anstriche (Hoher Schutz)</option>
                        </select>
                      </div>
                    </div>

                  </div>

                  {/* RESULTS ENGINE PANEL */}
                  <div className="lg:col-span-6 flex flex-col justify-between bg-shiraz/5 border border-shiraz/15 p-5 rounded-xl space-y-6">
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block font-bold">
                        Ermittelte Applikations- &amp; Mengenergebnisse
                      </span>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="bg-white p-3.5 rounded-lg border border-home-grau/10 shadow-xs">
                          <span className="text-[9px] text-text-main/40 block font-bold uppercase">Erforderliche Nassdicke (WFT)</span>
                          <span className="text-base font-black text-text-main font-mono block mt-1">{formatDeZahl(baseWft, 1)} µm</span>
                          <span className="text-[9px] text-text-main/50 block leading-tight mt-1">Nassfilm-Auftragsdicke vor Verdunstung</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-lg border border-home-grau/10 shadow-xs">
                          <span className="text-[9px] text-text-main/40 block font-bold uppercase">WFT (inkl. Verdünnung)</span>
                          <span className="text-base font-black text-indigo-700 font-mono block mt-1">{formatDeZahl(thinnedWft, 1)} µm</span>
                          <span className="text-[9px] text-text-main/50 block leading-tight mt-1">Nassfilm-Soll für die Schichtdickenmessung</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="bg-white p-3.5 rounded-lg border border-home-grau/10 shadow-xs">
                          <span className="text-[9px] text-text-main/40 block font-bold uppercase">Verbrauch (Theoretisch)</span>
                          <span className="text-base font-black text-text-main font-mono block mt-1">{formatDeZahl(theoreticalConsumption, 0)} ml/m²</span>
                          <span className="text-[9px] text-text-main/50 block leading-tight mt-1">Verbrauch ohne jegliche Spritzverluste</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-lg border border-home-grau/10 shadow-xs">
                          <span className="text-[9px] text-text-main/40 block font-bold uppercase">Verbrauch (Praxis/Soll)</span>
                          <span className="text-base font-black text-emerald-700 font-mono block mt-1">{formatDeZahl(effectiveConsumption, 0)} ml/m²</span>
                          <span className="text-[9px] text-text-main/50 block leading-tight mt-1">Inkl. Verlustfaktor von {formatDeWert(lossFactor)}%</span>
                        </div>
                      </div>

                      {/* TOTAL PAINT VALUE GAUGE CARD */}
                      <div className="bg-white p-4 rounded-xl border border-shiraz/20 shadow-xs text-center space-y-1">
                        <span className="text-[10px] text-text-main/50 font-bold uppercase tracking-wider block">
                          Gesamte benötigte Farbmenge ({formatDeWert(areaSquareMeters)} m² x {numCoats} Anstriche)
                        </span>
                        <div className="text-3xl font-black font-mono text-shiraz block py-1">
                          {formatDeZahl(totalLitersRequired, 2)} Liter
                        </div>
                        <div className="text-[10px] text-text-main/60 inline-flex items-center gap-1.5 max-w-sm px-2 text-center">
                          <Check className="text-emerald-600 flex-none" size={12} />
                          <span>Empfohlene Gebindebestellung: <strong>{formatDeWert(Math.ceil(totalLitersRequired / 10))} Eimer &agrave; 10 Liter</strong> (oder {formatDeWert(Math.ceil(totalLitersRequired / 2.5))} Eimer &agrave; 2,5 Liter)</span>
                        </div>
                      </div>
                    </div>

                    {/* MATHEMATICAL EQUATIONS SECTION */}
                    <div className="bg-white p-3 rounded-lg border border-home-grau/15 text-[10px] text-text-main/70 space-y-1">
                      <span className="font-bold text-text-main block">Verwendete Berechnungsformeln:</span>
                      
                      <div className="bg-stone-50 p-1.5 rounded text-text-main/90 overflow-x-auto my-1 flex justify-center">
                        <FormulaText text="WFT = \frac{DFT \times 100}{Vol\text{-}\%_{Solids}}" />
                      </div>

                      <div className="bg-stone-50 p-1.5 rounded text-text-main/90 overflow-x-auto flex justify-center">
                        <FormulaText text="\text{Verbrauch}_{effektiv} = \frac{\text{WFT}}{1 - \text{Verlust}/100} \quad \text{[ml/m²]}" />
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VOC & SCHADSTOFFE */}
          {activeTab === 'voc' && (
            <div className="space-y-6">
              <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-4">
                <h3 className="font-bold text-shiraz text-base flex items-center gap-2">
                  <ShieldCheck size={20} />
                  Die Decopaint-Richtlinie (2004/42/EG) &amp; VOC-Belastung
                </h3>
                <p className="leading-relaxed">
                  <strong>VOC (Volatile Organic Compounds)</strong> sind flüchtige organische Kohlenwasserstoffe, die beim Trocknen von weichmacher- und lösemittelhaltigen Anstrichen in die Atemluft übergehen. Hohe Konzentrationen führen zu gesundheitlichen Belastungen im Innenraum (Sick-Building-Syndrom) und belasten im Außenbereich die Umwelt.
                </p>
                <p className="leading-relaxed">
                  Die europäische <strong>Decopaint-Richtlinie</strong> begrenzt strengstens den maximal zulässigen VOC-Gewichtskatalysator (Gramm VOC pro Liter gebrauchsfertiges Produkt) für baurelevante Farben und Lacke.
                </p>
              </div>

              {/* Table representing DEC0PAINT LIMITS */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-text-main/40 uppercase tracking-wider block">Grenzwerte für ausgewählte Produktkategorien nach Anhang II A (Phase II):</span>
                <div className="overflow-hidden border border-home-grau/30 rounded-xl text-xs bg-white">
                  <div className="grid grid-cols-12 gap-1 p-3 bg-stone-100 font-bold border-b border-home-grau/30 text-text-main text-[11px]">
                    <div className="col-span-1 text-center">Cat</div>
                    <div className="col-span-5">Kategorie-Beschreibung</div>
                    <div className="col-span-3 text-center bg-blue-50/50">Wässrig (Wb) / [g/l]</div>
                    <div className="col-span-3 text-center bg-amber-50/50">Lösemittelbasiert (Sb) / [g/l]</div>
                  </div>
                  {[
                    { cat: 'a', name: 'Wandfarben für den Innenbereich (matt, Glanz < 25@85°)', wb: '30 g/l', sb: '30 g/l (selten)', desc: 'Standarddispersionsfarben' },
                    { cat: 'b', name: 'Wandfarben für den Innenbereich (glänzend)', wb: '100 g/l', sb: '100 g/l', desc: 'Latexfarben, Seidenglanz' },
                    { cat: 'c', name: 'Fassadenfarben für Außenwände (mineralisch/organisch)', wb: '40 g/l', sb: '430 g/l', desc: 'Silikatfassaden, Siliconharze' },
                    { cat: 'd', name: 'Innen-/Außenlacke für Holz und Metall (Bautenschutz)', wb: '130 g/l', sb: '300 g/l', desc: 'Acryllacke, Alkydharzlacke' },
                    { cat: 'i', name: 'Einkomponenten-Speziallacke (z.B. Parkettsiegel)', wb: '140 g/l', sb: '500 g/l', desc: 'Besonders schlagfeste Siegel' },
                    { cat: 'j', name: 'Zweikomponenten-Speziallacke (z.B. EP-Estrichbeschichtungen)', wb: '140 g/l', sb: '500 g/l', desc: 'Industrielle EP- und PUR-Schutzanstriche' },
                  ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-1 p-3 border-b border-home-grau/10 last:border-0 items-center text-[11px]">
                      <div className="col-span-1 text-center font-bold text-shiraz">{row.cat}</div>
                      <div className="col-span-5 font-semibold text-text-main">{row.name}</div>
                      <div className="col-span-3 text-center font-mono font-bold text-sky-800 bg-sky-50/20 py-1 rounded">{row.wb}</div>
                      <div className="col-span-3 text-center font-mono font-bold text-amber-800 bg-amber-50/20 py-1 rounded">{row.sb}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eco Labels card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-home-grau/30 rounded-xl p-5">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-emerald-600 rounded-full text-white text-[10px] font-black flex items-center justify-center">E</span>
                    <h4 className="font-bold text-text-main">Umweltzeichen „Blauer Engel“ (DE-UZ 102)</h4>
                  </div>
                  <p className="text-text-main/70 leading-relaxed">
                    Die Kriterien des Blauen Engels für emissionsarme Innenwandfarben gehen weit über die gesetzlichen VOC-Mindestanforderungen hinaus:
                  </p>
                  <ul className="list-disc list-inside space-y-1 font-normal text-text-main/80 pl-2">
                    <li>Max. VOC-Gehalt: ≤ 1 g/Liter (fast lösemittelfrei)</li>
                    <li>Weichmachergehalt: ≤ 2 g/Liter (Weichmacher können über Jahre ausgasen)</li>
                    <li>Strenge Grenzwerte für Isothiazolinone (übliche Biozide als Topfkonservierer, die Allergien auslösen können)</li>
                  </ul>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-indigo-600 rounded-full text-white text-[10px] font-black flex items-center justify-center">G</span>
                    <h4 className="font-bold text-text-main">GISCODE-Klassifizierungssystem der BG BAU</h4>
                  </div>
                  <p className="text-text-main/70 leading-relaxed">
                    Der GISCODE dient Handwerkern und Planern zur schnellen Einstufung des Arbeitsschutzes und der gesundheitlichen Gefährdung bei der Verarbeitung vor Ort:
                  </p>
                  <ul className="list-disc list-inside space-y-1 font-normal text-text-main/80 pl-2">
                    <li><strong>BSW10 / BSW20:</strong> Wässrige Beschichtungsstoffe, weichmacherfrei bzw. lösemittelarm (sehr geringe Gefährdung).</li>
                    <li><strong>BSL25:</strong> Lösemittelbasierte Bautenschutzlacke (erforderliche Schutzmaßnahmen wie Atemschutz).</li>
                    <li><strong>RE30:</strong> Epoxidharzprodukte, sensibilisierend (zwingend Schutzhandschuhe erforderlich).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: OBERFLAECHENSCHUTZ */}
          {activeTab === 'oberflaechenschutz' && (
            <div className="space-y-8">
              <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
                <h3 className="font-bold text-shiraz text-base mb-2">Oberflächenschutzsysteme (OS) für Beton nach DIN EN 1504-2</h3>
                <p className="mb-3">
                  Betonbauwerke, insbesondere Parkhäuser, Tiefgaragen, Brücken und Tunnel, sind im Laufe ihrer Lebensdauer extremen physikalischen und chemischen Beanspruchungen ausgesetzt (Frost-Tausalz-Angriffe, Karbonatisierung, Chlorideindrang, mechanische Torsionskräfte). 
                </p>
                <p>
                  Oberflächenschutzsysteme (OS) nach <strong>DIN EN 1504-2</strong> und der ergänzenden deutschen <strong>TR Instandhaltung (DAfStb)</strong> verhindern das Eindringen schädlicher Stoffe in das Porensystem des Betons. Damit stoppen sie das Fortschreiten der Karbonatisierung und verhindern die chloridinduzierte Korrosion der Stabbewehrung nachhaltig.
                </p>
              </div>

              {/* SECTION: OS SYSTEMS COMPARISON */}
              <div className="space-y-4">
                <h3 className="font-bold text-text-main text-lg flex items-center gap-2 border-b border-home-grau/20 pb-2">
                  <Layers size={18} className="text-shiraz" /> System-Klassifizierung (OS 1 bis OS 11)
                </h3>
                <p className="text-xs text-text-main/70">
                  Wählen Sie ein System aus, um eine vollständige Detailkarte mit Schichtaufbau und typischer Applikations-Chemie anzuzeigen:
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {OS_SYSTEMS.map((sys) => (
                    <button
                      key={sys.id}
                      onClick={() => setSelectedOsId(sys.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between gap-1.5 cursor-pointer ${
                        selectedOsId === sys.id
                          ? 'bg-shiraz border-shiraz text-white shadow-md font-bold'
                          : 'bg-white border-home-grau/30 text-text-main hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{sys.name}</div>
                      <div className={`text-[10px] font-medium leading-tight ${selectedOsId === sys.id ? 'text-white/85' : 'text-text-main/60'}`}>
                        {sys.title}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected OS Details Card */}
                {(() => {
                  const currentOs = OS_SYSTEMS.find(s => s.id === selectedOsId) || OS_SYSTEMS[5];
                  return (
                    <div className="bg-stone-50 border border-home-grau/30 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-shiraz/10 text-shiraz font-bold text-xs">Aktuelles System: {currentOs.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentOs.trafficable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {currentOs.trafficable ? 'Befahrbar' : 'Nicht befahrbar'}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-text-main mt-2 border-b border-home-grau/20 pb-1">{currentOs.title}</h4>
                        </div>
                        <p className="text-xs text-text-main/80 leading-relaxed">{currentOs.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                            <span className="font-bold text-text-main block mb-1">Typische Schichtdicke:</span>
                            <span className="font-mono text-xs text-text-main/70">{currentOs.thickness}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                            <span className="font-bold text-text-main block mb-1">Rissüberbrückungsklasse:</span>
                            <span className="text-xs text-text-main/70">{currentOs.bridging}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                            <span className="font-bold text-text-main block mb-1">Verwendetes Bindemittel:</span>
                            <span className="text-xs text-text-main/70">{currentOs.mainBinders}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                            <span className="font-bold text-text-main block mb-1">Mittlerer Materialbedarf:</span>
                            <span className="font-mono text-xs text-text-main/70">{currentOs.consumption}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-3 shadow-xs">
                        <h5 className="font-bold text-xs text-text-main uppercase tracking-wider border-b border-home-grau/20 pb-1.5">
                          Schichtaufbau (Applikation)
                        </h5>
                        <div className="relative border-l-2 border-shiraz/30 pl-4 ml-2 py-1 space-y-3 flex-1 flex flex-col justify-center">
                          {currentOs.layers.map((layer, index) => (
                            <div key={index} className="relative text-xs">
                              <span className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-shiraz border-2 border-white"></span>
                              <span className="font-mono text-[9px] text-shiraz font-black block">Schritt {index + 1}:</span>
                              <p className="text-text-main/80 font-medium leading-snug">{layer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* CHEMICAL MATRIX & BINDER CORRELATION */}
              <div className="space-y-4">
                <h3 className="font-bold text-text-main text-lg flex items-center gap-2 border-b border-home-grau/20 pb-2">
                  <Atom size={18} className="text-shiraz" /> Bindemittel-Wirkprinzipien (Der Bauchemikal-Link)
                </h3>
                <p className="text-xs text-text-main/70">
                  Jedes Oberflächenschutzsystem basiert auf spezifischen bauchemischen Molekülgruppen. Hier ist die strukturierte Übersicht nach Wirkungsweise:
                </p>

                <div className="overflow-x-auto border border-home-grau/30 rounded-xl bg-white shadow-xs">
                  <table className="w-full text-xs text-left text-text-main border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-home-grau/30 font-bold text-[11px] text-text-main/80">
                        <th className="p-3">Wirkstoffklasse</th>
                        <th className="p-3">Zugeordnete OS-Systeme</th>
                        <th className="p-3">Chemischer Prozess</th>
                        <th className="p-3">Vorteile / Eigenschaften</th>
                        <th className="p-3">Einschränkungen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-home-grau/20 leading-normal">
                      <tr>
                        <td className="p-3 font-semibold text-shiraz">Silane &amp; Siloxane</td>
                        <td className="p-3 font-semibold">OS 1 (Hydrophobierung)</td>
                        <td className="p-3 text-text-main/80">
                          Reagieren mit den Silanolgruppen der C-S-H-Phasen des Betons unter Abspaltung von Alkohol (Kondensation). Bilden eine polymere, unlösliche Auskleidung der Porenoberflächen, ohne die Poren zu verschließen.
                        </td>
                        <td className="p-3 text-emerald-800 font-medium bg-emerald-50/10">
                          Sehr hohe Eindringtiefe (&gt; 1mm), absolut wasserdampfdurchlässig (s_d &lt; 0,01 m), verringert Frost-Tausalz-Angriffe drastisch.
                        </td>
                        <td className="p-3 text-amber-800 bg-amber-50/10 font-medium">
                          Kein Schutz vor Kohlendioxid (Karbonatisierung), keine Rissüberbrückung.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-shiraz">2K-Epoxidharze (EP)</td>
                        <td className="p-3 font-semibold">OS 2, OS 8</td>
                        <td className="p-3 text-text-main/80">
                          Polyaddition von flüssigen Epoxid-Prepolymeren (Bisphenol-A) mit Amin-Härtern. Es entsteht ein extrem dicht vernetztes, duroplastisches Polymergitter.
                        </td>
                        <td className="p-3 text-emerald-800 font-medium bg-emerald-50/10">
                          Extreme Druck- und Abriebbeanspruchung, hervorragende Alkalibeständigkeit, unempfindlich gegenüber schweren mechanischen Lasten.
                        </td>
                        <td className="p-3 text-amber-800 bg-amber-50/10 font-medium">
                          Starr (keine Rissüberbrückung), frost- und vergilbungsempfindlich bei starker UV-Strahlung im Außenbereich.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-shiraz">2K-Polyurethane (PU)</td>
                        <td className="p-3 font-semibold">OS 5b, OS 11a, OS 11b</td>
                        <td className="p-3 text-text-main/80">
                          Polyaddition von Polyisocyanaten mit Polyolen. Durch gezielte Auswahl linearer Isocyanate wird ein hochelastischer Schutzfilm (Elastomer) erzielt.
                        </td>
                        <td className="p-3 text-emerald-800 font-medium bg-emerald-50/10">
                          Hochelastisch, exzellente dynamische Rissüberbrückung bei Minustemperaturen (-20 °C), UV-beständig bei aliphatischer Härter-Basis.
                        </td>
                        <td className="p-3 text-amber-800 bg-amber-50/10 font-medium">
                          Feuchtigkeitsempfindlich während der Härtung (Blasenbildung durch CO₂-Ausgasung bei Feuchtkontakt), geringere Ritzhärte als EP.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-shiraz">Reinacrylat-Dispersionen</td>
                        <td className="p-3 font-semibold">OS 4, OS 5a</td>
                        <td className="p-3 text-text-main/80">
                          Physikalische Filmbildung durch Verdunstung des Wassers und anschließende Koaleszenz der Polymer-Nanopartikel. Die polare Molekülstruktur hemmt Gase.
                        </td>
                        <td className="p-3 text-emerald-800 font-medium bg-emerald-50/10">
                          Herausragende CO₂-Bremswirkung (s_d &gt; 50 m), wasserbasiert (sehr umweltfreundlich / geruchlos), optimal für vertikale Sichtbetonflächen.
                        </td>
                        <td className="p-3 text-amber-800 bg-amber-50/10 font-medium">
                          Nicht befahrbar, mäßige statische Rissüberbrückung.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CONFRIGURATOR AND MATERIAL CALC BOARD */}
              <div className="bg-white rounded-2xl border border-home-grau/30 shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
                    <Calculator size={18} className="text-shiraz" /> Interaktiver OS-System-Konfigurator &amp; Materialrechner
                  </h3>
                  <p className="text-xs text-text-main/60">
                    Definieren Sie Ihren Anwendungsfall, um die ideale Spezifikation (nach TR Instandhaltung) und die exakt kalkulierten Materialmengen (in kg) zu erhalten.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                  
                  {/* Left Column: Selector Form Inputs */}
                  <div className="lg:col-span-4 bg-stone-50 rounded-xl border border-home-grau/20 p-4 space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-text-main">1. Projektfläche (m²)</label>
                      <input 
                        type="number"
                        min="5"
                        max="50000"
                        value={osArea}
                        onChange={(e) => setOsArea(Math.max(5, Number(e.target.value)))}
                        className="w-full bg-white border border-home-grau/30 rounded-lg p-2 font-mono text-xs font-bold text-text-main outline-none focus:border-shiraz transition-all"
                      />
                      <span className="text-[10px] text-text-main/50 block">Zur Berechnung der Gesamt-Materialmengen</span>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-main">2. Einsatzbereich / Bauteil</label>
                      <select 
                        value={osEinsatzbereich} 
                        onChange={(e) => setOsEinsatzbereich(e.target.value)}
                        className="w-full bg-white border border-home-grau/30 rounded-lg p-2 text-xs text-text-main outline-none focus:border-shiraz transition-all font-medium"
                      >
                        <option value="tiefgarage_boden">Tiefgarage / Bodenplatte</option>
                        <option value="freideck_parkdeck">Freibewittertes Parkgut-Oberdeck / Rampen</option>
                        <option value="brueckenkappe">Brückenüberbau / Brückenkappe</option>
                        <option value="fassade_tunnel">Betonfassade / Tunnelwand / Pfeiler</option>
                        <option value="industriehalle">Industriehalle / Gabelstapler-Betrieb</option>
                        <option value="kellerwand_aussen">Kelleraußenwand / Spritzwasserzone</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-main">3. Bruch- bzw. Rissrisiko</label>
                      <select 
                        value={osCrackBridging} 
                        onChange={(e) => setOsCrackBridging(e.target.value)}
                        className="w-full bg-white border border-home-grau/30 rounded-lg p-2 text-xs text-text-main outline-none focus:border-shiraz transition-all font-medium"
                      >
                        <option value="nein">Keine Rissüberbrückung nötig (starr, feste Bodenbedingungen)</option>
                        <option value="ja_statisch">Statische Rissüberbrückung (Klasse A1-A2, ruhende Haarrisse)</option>
                        <option value="ja_dynamisch">Hochelastische Rissüberbrückung (Klasse B3 bei -20 °C, Temperaturschwankungen)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-main">4. Mechanische Rollbeanspruchung</label>
                      <select 
                        value={osBelastung} 
                        onChange={(e) => setOsBelastung(e.target.value)}
                        className="w-full bg-white border border-home-grau/30 rounded-lg p-2 text-xs text-text-main outline-none focus:border-shiraz transition-all font-medium"
                      >
                        <option value="nur_begehbar">Nicht befahrbar (rein begehbar, dekorativ)</option>
                        <option value="leicht_pkw">Befahrbar (leichte PKW-Lasten, Garagenbetrieb)</option>
                        <option value="schwer_lkw">Schwer befahrbar (harte Punktlasten, LKW, Gabelstapler)</option>
                      </select>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 text-blue-950 rounded-lg space-y-1">
                      <span className="font-bold text-[10px] uppercase flex items-center gap-1"><Info size={11} /> Grenzabnahme</span>
                      <p className="text-[10px] leading-relaxed">
                        Reaktionsharz-Beschichtungen (EP/PU) dürfen nur verarbeitet werden, wenn die Betonfeuchte <strong>&lt; 4,0 %</strong> (CM-Methode) beträgt und die Substrattemperatur mindestens <strong>3 Kelvin über dem Taupunkt</strong> liegt!
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Calculations & Action recommendations */}
                  {(() => {
                    // Logic to find recommended system
                    let recommendedSysId = 'os8';
                    let categoryText = 'Starr befahrbares Parkhaus-Beschichtungssystem';
                    let noteText = '';

                    if (osEinsatzbereich === 'tiefgarage_boden') {
                      if (osCrackBridging === 'ja_dynamisch') {
                        recommendedSysId = 'os11b';
                        categoryText = 'OS 11b (OS-F2) - Elastisches befahrbares System';
                        noteText = 'Empfohlen für feuchtekritische Tiefgaragenböden mit Gefahr von dynamischen Setzungsrissen. Bei drückendem Grundwasser muss rückseitige Feuchtigkeit ausgeschlossen werden (sonst Osmoseblasengefahr!).';
                      } else {
                        recommendedSysId = 'os8';
                        categoryText = 'OS 8 (OS-H) - Starre befahrbare Beschichtung';
                        noteText = 'Die unschlagbar haltbare Standardspezifikation für Garagenböden. Bietet höchste Abriebfestigkeit gegen drehende PKW-Reifen.';
                      }
                    } else if (osEinsatzbereich === 'freideck_parkdeck') {
                      recommendedSysId = 'os11a';
                      categoryText = 'OS 11a (OS-F1) - Höchste dynamische Rissüberbrückung (4,5 mm)';
                      noteText = 'Zwingend nach Richtlinie für alle freigelegenen Parkdecks oberhalb bewohnter oder genutzter Ebenen. Schützt den Spannbeton vor dem Eindringen korrosiver Tausalzlösungen (Salzwasser).';
                    } else if (osEinsatzbereich === 'brueckenkappe') {
                      recommendedSysId = 'os1';
                      categoryText = 'OS 1 (OS-A) - Reine Hydrophobierung';
                      noteText = 'Einfaches und hocheffektives Verfahren für mineralische Überbau-Teile zur Erhöhung des Frost-Widerstands und Abperlen des Wassers.';
                    } else if (osEinsatzbereich === 'fassade_tunnel') {
                      if (osCrackBridging === 'ja_dynamisch') {
                        recommendedSysId = 'os5b';
                        categoryText = 'OS 5b (OS-D.2) - Elastische Wandbeschichtung';
                        noteText = 'Bietet dauerhaften Witterungsschutz auch bei rissanfälligen Betonfertigteil-Fassaden im Außenbereich.';
                      } else if (osCrackBridging === 'ja_statisch') {
                        recommendedSysId = 'os5a';
                        categoryText = 'OS 5a (OS-D.1) - Statisch rissüberbrückende Beschichtung';
                        noteText = 'Kostengünstiger Haarriss-Abdecker für Wände im schattigen Außen- oder Innenbereich.';
                      } else {
                        recommendedSysId = 'os4';
                        categoryText = 'OS 4 (OS-C) - Klassische Carbonatisierungsbremse';
                        noteText = 'Optimal für dichte Betonschutzanstriche auf Brückenpfeilern, Lärmschutzwänden und Architekturbetonschichten zur Bewahrung des alkalischen Milieus.';
                      }
                    } else if (osEinsatzbereich === 'industriehalle') {
                      recommendedSysId = 'os8';
                      categoryText = 'OS 8 (OS-H) - Druckfestes Industrie-EP-System';
                      noteText = 'In Industriehallen ist Verschleiß- und Torsionsfestigkeit vorzuziehen. Ein Schrammschutz mit feuergetrocknetem Sand verhindert Absplitterung durch Staplerverkehr.';
                    } else if (osEinsatzbereich === 'kellerwand_aussen') {
                      recommendedSysId = 'os2';
                      categoryText = 'OS 2 (OS-B) - Hauchdünne Poren-Imprägnierung';
                      noteText = 'Hilft als kapillarsperrender Zementanstrich gegen geringe aufsteigende Feuchte im Spritzwasserbereich.';
                    }

                    // Dynamically get recommended material list
                    const materialDefinitions: Record<string, { material: string; rate: number; remark: string }[]> = {
                      os1: [
                        { material: 'Chemischer Silan-Hydrophobierstoff (lösemittelfrei)', rate: 0.35, remark: 'Flutend per Airless oder Flutlanze applizieren (nass in nass)' }
                      ],
                      os2: [
                        { material: '2K-Epoxidharz-Imprägnierung (niedrigviskos)', rate: 0.20, remark: 'Saugfähige Porenfüllungs-Schicht' },
                        { material: 'Kopfversiegelung (pigmentiert)', rate: 0.15, remark: 'Roll-Anstrich' }
                      ],
                      os4: [
                        { material: 'Zementgebundene Porenfeinspachtelung (Mörtel)', rate: 1.50, remark: 'Schließen von Betonlunkern' },
                        { material: 'Systemgrundierung Acrylat-Basis', rate: 0.18, remark: 'Tiefenverankerung' },
                        { material: 'Reinacrylat-Schutzfarbe (1. Anstrich)', rate: 0.22, remark: 'Farbtonaufbau' },
                        { material: 'Reinacrylat-Schutzfarbe (2. Anstrich)', rate: 0.22, remark: 'Festlegung der endgültigen CO₂-Bremsschicht' }
                      ],
                      os5a: [
                        { material: 'Cementitious PCC-Feinspachtel', rate: 1.50, remark: 'Egalisierung' },
                        { material: 'Acrylat-Grundfestiger', rate: 0.20, remark: 'Haftverbesserung' },
                        { material: 'Elastomer-Zwischenlage (Acrylat)', rate: 0.35, remark: 'Fugen- und Haarrissabdeckung' },
                        { material: 'Elastomer-Dunkelbeschichtung (Acrylat)', rate: 0.35, remark: 'Satte, schützende Deckschicht' }
                      ],
                      os5b: [
                        { material: '2K-Spezialgrundierung (PU/EP)', rate: 0.25, remark: 'Flüssiggassperre vor Membran' },
                        { material: 'Dynamische PU-Zwischenmembrane', rate: 0.65, remark: 'Hochelastisch dehnbar (Rissbrücke)' },
                        { material: 'UV-beständige Kopfversiegelung (aliphatisches PU)', rate: 0.32, remark: 'Witterungsstabiler Endglanz' }
                      ],
                      os8: [
                        { material: '2K-Epoxidharz-Grundierharz (lösungsmittelfrei)', rate: 0.45, remark: 'Haftbrücke porentief einreiben' },
                        { material: 'Egalisierungs-Kratzspachtel (2K-EP + 50% Quarzmehl)', rate: 1.25, remark: 'Schutz vor Porenrückschlag' },
                        { material: 'Zähes Basisharz (2K-Epoxidharz)', rate: 1.65, remark: 'Satte Bindemittelschicht für Einstreuung' },
                        { material: 'Feuergetrockneter Einstreusand (Quarz, 0,4 - 0,8 mm)', rate: 4.50, remark: 'Einstreuung im Überschuss (vollständig absanden. Überschuss fegen)' },
                        { material: 'Kopfversiegelung (pigmentierte 2K-EP-Rollversiegelung)', rate: 0.70, remark: 'Sandeinbindung gegen Reifenabrieb' }
                      ],
                      os11a: [
                        { material: '2K-Epoxidharz-Systemgrundierung', rate: 0.40, remark: 'Füllen der Betonkapillaren' },
                        { material: 'Hochelastische PU-Dichtungsschicht (Membran)', rate: 2.00, remark: 'Rissüberbrückungs-Unterbau (unbesandet aufrakeln)' },
                        { material: 'Zähelastische PU-Verschleißschicht', rate: 1.60, remark: 'Bindeschicht für Quarzsand' },
                        { material: 'Feuergetrockneter Quarzsand (0,4 - 0,8 mm)', rate: 5.00, remark: 'Vollabsandung im Überschuss' },
                        { material: 'Chemikalienresistente PU-Kopfversiegelung (lichtecht)', rate: 0.80, remark: 'Schutz vor Streusalz, Benzin und UV-Licht' }
                      ],
                      os11b: [
                        { material: '2K-Epoxidharz-Systemgrundierung', rate: 0.40, remark: 'Absperrung Wasser' },
                        { material: 'Hochelastische Kombi-PU-Verschleißschicht', rate: 2.30, remark: 'Einschichtige Dichtung & Verschleiß' },
                        { material: 'Feuergetrockneter Absandsand (0,4 - 0,8 mm)', rate: 5.00, remark: 'Rutschfeste Abstreuung' },
                        { material: 'Abrieb- und lichtfeste PU-Kopfversiegelung', rate: 0.85, remark: 'Witterungsstabile Schutzfarbe' }
                      ]
                    };

                    const currentMatBreakdown = materialDefinitions[recommendedSysId] || materialDefinitions['os8'];
                    let totalVolumeSum = 0;

                    return (
                      <div className="lg:col-span-8 space-y-4 animate-in fade-in duration-300">
                        {/* Recommendation result box */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-xs text-emerald-950 flex gap-3.5">
                          <ShieldCheck size={28} className="text-emerald-700 flex-none mt-0.5" />
                          <div className="space-y-1.5">
                            <span className="font-bold text-[10px] uppercase tracking-wider block text-emerald-800">Technisch empfohlene Konfiguration (TR Instandhaltung):</span>
                            <h4 className="text-base font-black text-emerald-900 leading-none">{categoryText}</h4>
                            <p className="font-semibold text-emerald-800/90 leading-tight">{noteText}</p>
                          </div>
                        </div>

                        {/* Material volume output table */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center px-1">
                            <span className="text-[11px] font-bold text-text-main/50 uppercase tracking-wider">Kalkulierter Gesamtbedarf für {formatDeWert(osArea)} m²:</span>
                            <span className="px-2 py-0.5 rounded bg-shiraz/10 text-shiraz font-mono text-[11px] font-bold">Fläche: {formatDeWert(osArea)} m²</span>
                          </div>

                          <div className="overflow-hidden border border-home-grau/25 rounded-md text-xs bg-white">
                            <div className="grid grid-cols-12 gap-1 p-2.5 bg-stone-100 font-bold border-b border-home-grau/30 text-text-main text-[11px]">
                              <div className="col-span-5">Komponente / Schichtleistung</div>
                              <div className="col-span-2 text-center">Verbrauch</div>
                              <div className="col-span-2 text-center text-shiraz">Gesamtmenge</div>
                              <div className="col-span-3">Arbeitshinweis</div>
                            </div>
                            
                            {currentMatBreakdown.map((row, idx) => {
                              const calculatedTotal = row.rate * osArea;
                              totalVolumeSum += calculatedTotal;

                              return (
                                <div key={idx} className="grid grid-cols-12 gap-1 p-2.5 border-b border-home-grau/10 last:border-0 items-center text-[11px] font-medium text-text-main">
                                  <div className="col-span-5 font-bold flex gap-1.5 items-center">
                                    <span className="w-4 h-4 rounded-full bg-stone-200 text-[10px] font-mono flex items-center justify-center font-bold">{idx + 1}</span>
                                    <span>{row.material}</span>
                                  </div>
                                  <div className="col-span-2 text-center font-mono text-text-main/70">{formatDeZahl(row.rate, 2)} kg/m²</div>
                                  <div className="col-span-2 text-center font-mono font-black text-shiraz bg-shiraz/5 py-1 rounded">{calculatedTotal.toLocaleString('de-DE', { maximumFractionDigits: 0 })} kg</div>
                                  <div className="col-span-3 text-text-main/60 italic leading-snug">{row.remark}</div>
                                </div>
                              );
                            })}

                            {/* Aggregates total */}
                            <div className="grid grid-cols-12 gap-1 p-3 bg-stone-100/50 font-bold items-center font-mono text-xs border-t border-home-grau/20">
                              <div className="col-span-12 font-sans flex justify-between font-black">
                                <span>ZUSAMMENFASSUNG HARZ &amp; SAND:</span>
                                <span className="text-shiraz border-2 border-shiraz/35 px-3 py-1 rounded bg-shiraz/10 font-bold">
                                  {totalVolumeSum.toLocaleString('de-DE', { maximumFractionDigits: 0 })} kg Gesamt
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Concrete repairs info checklist */}
                        <div className="border border-amber-200 bg-amber-50/20 rounded-xl p-4 text-[11px]">
                          <h5 className="font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <AlertTriangle size={14} className="text-amber-700" /> Ausführungskriterien &amp; Betonvorbereitung (DIN 1045-3):
                          </h5>
                          <ul className="list-disc list-inside space-y-1.5 text-text-main/80 leading-relaxed pl-1">
                            <li><strong>Untergrundfestigkeit:</strong> Die Haftzugfestigkeit (Abreißtest) der vorbereiteten Betonrandzone muss im Mittel mindestens <strong>1,5 N/mm²</strong> betragen (kleinster Einzelwert &gt; 1,0 N/mm²).</li>
                            <li><strong>Rautiefe (Egalisierung):</strong> Bei grobem Betonprofil muss zwingend eine OS-Ausgleichsspachtelung aus feinkörnigem Reaktionsharzmörtel appliziert werden, da ansonsten Deckungsfehlstellen durch Porenblasen ("Pinholes") entstehen.</li>
                            <li><strong>Taupunkt-Regel:</strong> Eine Kondensatbildung auf dem Beton führt bei EP/PU-Harzen zur sofortigen Enthaftung (Ablösen). Die Bauteiloberfläche muss nachweislich ≥ 3 K wärmer sein als die Lufttemperatur des Taupunktes.</li>
                            <li><strong>Witterung:</strong> Relative Luftfeuchte &lt; 80 % zur Vermeidung von Carbamatbildung (Klebriger Schleier an der Oberfläche von Epoxidharzen) einhalten.</li>
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                  
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <InnovationPraxisSection moduleKey="bp_farben_lacke" />

      <ModuleFooter
        wikipedia={[
          { title: 'Farbe', url: 'https://de.wikipedia.org/wiki/Farbe' },
          { title: 'Lack', url: 'https://de.wikipedia.org/wiki/Lack' },
          { title: 'Flüchtige organische Verbindungen (VOC)', url: 'https://de.wikipedia.org/wiki/Fl%C3%BCchtige_organische_Verbindungen' },
          { title: 'Silikatfarbe', url: 'https://de.wikipedia.org/wiki/Silikatfarbe' }
        ]}
        literatur={[
          'Goldschmidt, A.; Streitberger, H.-J. (2018): BASF-Handbuch Lackiertechnik (Vincentz Network)',
          'Brock, T.; Groteklaes, M.; Mischke, P. (2020): Lehrbuch der Lacktechnologie (Vincentz Network)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 12944 (Korrosionsschutz von Stahlbauten durch Beschichtungssysteme - Teile 1 bis 9)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+12944' },
          { title: 'Decopaint-Richtlinie 2004/42/EG (Begrenzung der Emissionen flüchtiger organischer Verbindungen)', url: 'https://eur-lex.europa.eu/' },
          { title: 'DIN EN ISO 2409 (Beschichtungsstoffe - Gitterschnittprüfung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+2409' },
          { title: 'DIN EN 1062-1 (Beschichtungsstoffe - Beschichtungssysteme für mineralische Untergründe und Beton im Außenbereich)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1062-1' }
        ]}
        formeln={[
          {
            formel: 'd_{\\text{dry}} = d_{\\text{wet}} \\cdot \\frac{\\text{Festkörpervolumen}\\,[\\%]}{100}',
            erklaerung: 'Berechnung der Trockenschichtdicke d_dry [µm] aus Nassschichtdicke d_wet und Festkörpergehalt (VS-Wert) nach DIN EN ISO 2808.',
            quelle: 'DIN EN ISO 2808'
          },
          {
            formel: 'm_{\\text{VOC}} = \\frac{m_v}{V_{\\text{Produkt}}} \\le \\text{Grenzwert}_{\\text{Decopaint}} \\quad [\\text{g/l}]',
            erklaerung: 'VOC-Gehalt lösemittel- und wasserbasierter Anstrichstoffe zur Einhaltung der europäischen Grenzwerte (z.B. Innenwandfarben max. 30 g/l).',
            quelle: 'Richtlinie 2004/42/EG'
          }
        ]}
      />
    </div>
  );
}
