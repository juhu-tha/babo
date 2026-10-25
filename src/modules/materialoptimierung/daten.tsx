import React from 'react';
import { Sparkles, Trash2, Settings, Recycle } from 'lucide-react';

export interface Seaeule {
  id: 'effizienz' | 'suffizienz' | 'konsistenz' | 'resilienz';
  title: string;
  tagline: string;
  mitigationPotential: string; // e.g. "Hoch"
  description: string;
  strategies: string[];
  example: string;
}

export const SAEULEN_DATA: Seaeule[] = [
  {
    id: 'effizienz',
    title: 'Effizienz (Besser machen)',
    tagline: 'Gleicher Nutzen mit weniger Material- und Energieeinsatz.',
    mitigationPotential: '30% - 50% CO₂-Einsparung',
    description: 'Erhöhung der Materialausnutzung durch optimierte Tragwerkshierarchien und Hochleistungswerkstoffe. Ziel ist es, den Baustoff dorthin zu legen, wo er statisch zwingend benötigt wird.',
    strategies: [
      'Einsatz von ultrahochfestem Beton (UHPC) für filigrane Querschnitte',
      'Topologieoptimierung und bionische Bauteilgestaltung',
      'Verwendung von Carbon-, Textil- oder Faserbeton zur Vermeidung dicker Korrosionsschutz-Betondeckungen',
      'Bauteilgradierung (Hohlräume im Inneren von Betonbauteilen zur Gewichtsreduktion)'
    ],
    example: 'Ersatz einer standardmäßig 30 cm dicken Stahlbetondecke durch eine vierteilige, textilbewehrte Hohlkörperdecke mit nur noch 12 cm effektiver Dicke.'
  },
  {
    id: 'suffizienz',
    title: 'Suffizienz (Weniger machen)',
    tagline: 'Reduktion des absoluten Bedarfs an Materialien und Flächen.',
    mitigationPotential: '50% - 80% CO₂-Einsparung',
    description: 'Hinterfragen des realen Bauteilbedarfs und Verzicht auf unproduktive Überdimensionierung. Es gilt eine nutzungsflexible, modulare Bauweise vorzuziehen, die Umbauten ohne Abbruch ermöglicht.',
    strategies: [
      'Reduktion von Komfort- und Gestaltungsüberbauten (z. B. abgehängte Zierdecken)',
      'Erhöhung der Grundrissentwurfs-Flexibilität zur Vermeidung zukünftigen Umbaubedarfs',
      'Bewusster Verzicht auf tiefgehende Untergeschosse bei schwierigen Baugrundverhältnissen',
      'Nutzungsgerechte Lastannahmen statt pauschaler Maximal-Sicherheitsbeiwerte'
    ],
    example: 'Modulare Trennwandsysteme im Holzständerbau, die werkzeuglos versetzbar sind, wodurch Mieterwechsel keinen Abbruchschutt erzeugen.'
  },
  {
    id: 'konsistenz',
    title: 'Konsistenz (In Kreisläufen denken)',
    tagline: 'Nutzung umweltverträglicher Stoffströme und geschlossener Materialkreisläufe.',
    mitigationPotential: '40% - 70% CO₂-Einsparung',
    description: 'Einsatz kreislauffähiger (Cradle-to-Cradle) Rohstoffe, nachwachsender Naturmaterialien oder Sekundärbaustoffe. Konstruktionen müssen recyclinggerecht trennbar gefügt werden.',
    strategies: [
      'Einsatz von RC-Beton (Recycling-Gesteinskörnung Typ 1 & 2)',
      'Verstärkter Einsatz nachwachsender Rohstoffe (Holz, Stroh, Lehm, Hanfschäben)',
      'Verwendung von rückbaubaren, mechanisch gelösten Verbindungen (Schrauben statt Kleben)',
      'Aufbau digitaler Materialpässe (DPP) zur Rückführung in den Baustoffkreislauf'
    ],
    example: 'Schraubbare Holz-Beton-Verbunddecken mit trennbaren Schubkegeln anstelle unzertrennlich flächig verklebter Hybridbauteile.'
  },
  {
    id: 'resilienz',
    title: 'Resilienz (Langlebig machen)',
    tagline: 'Verlängerung der Nutzungsdauer durch Robustheit und Wartungsfreundlichkeit.',
    mitigationPotential: 'Langfristig extrem hoch',
    description: 'Die umweltfreundlichste Tonne Zement ist jene, die gar nicht erst produziert werden muss, weil das bestehende Bauteil 150 statt 50 Jahre schadensfrei übersteht. Anpassungsfähigkeit an verändertes Klima steht im Fokus.',
    strategies: [
      'Erhöhung der Dauerhaftigkeit durch optimierten Feuchteschutz und korrosionsfreie Bewehrungen',
      'Leicht austauschbare Haustechniksysteme, entkoppelt von der tragenden Hauptstruktur',
      'Schlagregensichere, diffusionsoffene Außenwandkonstruktionen',
      'Erhöhter mechanischer Schutz gefährdeter Sockel- und Fassadenbereiche'
    ],
    example: 'Ersatz einer hinterlüfteten Holzfassade mit konstruktivem Holzschutz, deren Einzelelemente ohne Beschädigung des Dämmkerns getauscht werden können.'
  }
];

export interface ConcretePrincipleItem {
  title: string;
  desc: string;
  tags: string[];
}

export interface ConcreteCategory {
  name: string;
  items: ConcretePrincipleItem[];
}

export interface ConcretePrincipleGroup {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  colorBorder: string;
  colorBg: string;
  colorText: string;
  colorIcon: string;
  intro: string;
  categories: ConcreteCategory[];
}

export const BETON_PRINZIPIEN: ConcretePrincipleGroup[] = [
  {
    id: 'vermeidung',
    title: '1. Vermeidung & Substitution',
    subtitle: 'Strategischer Materialersatz & Tragwerkseffizienz',
    icon: <Trash2 size={18} />,
    colorBorder: 'border-rose-100 focus-within:border-rose-300',
    colorBg: 'bg-rose-50/10',
    colorText: 'text-rose-950',
    colorIcon: 'bg-rose-100/70 text-rose-700 border-rose-200/50',
    intro: 'Der effektivste Hebel zur CO₂-Minderung liegt in der Vermeidung von Klinker und Zementvolumen. Dies geschieht durch alternativen Baustoffbezug oder extreme Erhöhung der geometrischen Konstruktionseffizienz.',
    categories: [
      {
        name: 'Vermeidung & Kompletter Ersatz',
        items: [
          {
            title: 'Substituierung tragender Massivbauteile',
            desc: 'Kompletter Ersatz von Beton durch Holz-, Hybrid- oder Lehmkonstruktionen (z.B. Brettsperrholz CLT). Dadurch wird Kohlenstoff langfristig biogen im Holzvolumen gespeichert und klinkerbedingte Prozessemissionen entfallen vollständig.',
            tags: ['Holzbau (CLT)', 'Lehmbau', 'Biogene CO2-Senke']
          }
        ]
      },
      {
        name: 'Reduktion & Geometrieoptimierung',
        items: [
          {
            title: 'Verringerung des absoluten Materialeinsatzes',
            desc: 'Gezielte Ausdünnung von Querschnitten durch bionische Bauweisen, Topologieoptimierung und exakte Tragwerks-Lastflussanalysen zur Reduzierung des unproduktiven Volumens.',
            tags: ['Bionik', 'Topologieoptimierung', 'Materialeffizienz']
          },
          {
            title: 'Steigerung der Leistungsfähigkeit & Dauerhaftigkeit',
            desc: 'Einsatz von ultrahochfestem Beton (UHPC), Hochleistungsfasern oder korrosionsfreier Bewehrung. Da Carbon oder Glasfaser nicht rosten, entfällt der Bedarf an dicken statisch inaktiven Schutzdeckungen (~4-5 cm), was filigrane Bauglieder ermöglicht.',
            tags: ['UHPC / Faserbeton', 'Carbon- & Glasfaserbewehrung']
          },
          {
            title: 'Verbesserte Konstruktion & Hybridglieder',
            desc: 'Tragwerksänderung weg vom Vollquerschnitt hin zu Rippendecken, Kasettendecken, Hohlkörperdecken oder Holz-Beton-Verbundkonstruktionen (HBV). Der Beton wird geometrisch hocheffizient nur in der materialgerechten Druckzone gelagert.',
            tags: ['Rippen- & Waffendecken', 'Holz-Beton-Verbund (HBV)']
          }
        ]
      },
      {
        name: 'Ersatz nicht-nachhaltiger Komponenten',
        items: [
          {
            title: 'Zementklinker-Substitution (Minderungsstoffe)',
            desc: 'Vorteilhafter Teilersatz des CO₂-intensiven CEM I (Portlandzement) durch Zusatzstoffe wie Steinkohlenflugasche (SFA), Hüttensandmehl (HÜS) oder Kalksteinmehl (KSM).',
            tags: ['Flugasche (SFA)', 'Hüttensand (HÜS)', 'Kalksteinmehl (KSM)']
          },
          {
            title: 'Geopolymere & Alkali-aktivierte Bindemittel',
            desc: 'Klinkerfreie, anorganische Bindemittelfamilien (Alkali-activated Binders AAB) auf Basis von reaktiven Alumosilikaten (z.B. Hüttensanden oder Flugaschen) in Kombination mit alkalischen Aktivatoren.',
            tags: ['Geopolymere', 'Klinkerfreie Binder', 'AAB-Systeme']
          },
          {
            title: 'Alternative Klinkertechnologien',
            desc: 'Herstellung kohlendioxidarmer Klinkermodifikationen wie Calciumsulfoaluminat-Zemente (CSA), Celitement oder bio-mineralisierten Bindemittelsystemen mit drastisch geringeren Prozesstemperaturen.',
            tags: ['Celitement', 'CSA-Zemente', 'Biozemente']
          },
          {
            title: 'Calcinierte Tone (Metakaolin & LC3)',
            desc: 'Einsatz thermisch aktivierter Tone in Kombination mit gemahlenem Kalkstein (LC3 - Limestone Calcined Clay Cement). Ermöglicht Klinkersubstitutionen von bis zu 50% bei hohem mechanischem Dauerhaftigkeitsniveau.',
            tags: ['Metakaolin', 'LC3-Zement', 'Thermischer Ton']
          },
          {
            title: 'Alternative mineralische Silikatquellen',
            desc: 'Ersatz künstlicher Puzzolane durch amorphe, natürliche agro-industrielle Reststoffaschen (z.B. Reisschalenasche mit enorm hohem SiO₂-Gehalt).',
            tags: ['Reisschalenasche', 'Bio-Silikate']
          }
        ]
      }
    ]
  },
  {
    id: 'optimierung',
    title: '2. Rezeptur- & Herstelloptimierung',
    subtitle: 'Chemische Gefüge-Präzision & Thermische Energiequellen',
    icon: <Settings size={18} />,
    colorBorder: 'border-amber-100 focus-within:border-amber-300',
    colorBg: 'bg-amber-50/10',
    colorText: 'text-amber-950',
    colorIcon: 'bg-amber-100/70 text-amber-700 border-amber-200/50',
    intro: 'Effizienzsprünge auf Material- und Prozessebene optimieren die Wirkstoffteilchen des Betongefüges und dämpfen Drehofen-Emissionen direkt am Entstehungsort.',
    categories: [
      {
        name: 'Zusammensetzung & Gefüge',
        items: [
          {
            title: 'Gefügeoptimierte Packungsdichte (Funk & Dinger)',
            desc: 'Optimierung der Partikelabstufung (Sieblinie) im Feinstbereich. Dadurch wird der Hohlraum (Zwickelvolumen) zwischen den größeren Gesteinskörnern minimiert, sodass massiv weniger teurer und CO₂-belasteter Zementleim zur Gefüllung anfällt.',
            tags: ['Partikeleinpassung', 'Funk & Dinger', 'Leimminderung']
          },
          {
            title: 'Spezialzusatzmittel (BZM / superplastifizierende PCE)',
            desc: 'Nutzung hochentwickelter Polycarboxylatether-Fließmittel (PCE) zur elektrostatischen Dispergierung im Frischbeton. Ermöglicht extreme Reduktionen des Wasseranspruchs (sehr niedriger w/z-Wert) bei voller Fließfähigkeit.',
            tags: ['PCE-Dispergierung', 'Niedriger w/z-Wert']
          }
        ]
      },
      {
        name: 'Herstellungsprozess',
        items: [
          {
            title: 'Herstellung Beton (Qualitätssicherung & Vorhaltemaße)',
            desc: 'Reduktion werkseitig aufgeprägter Festigkeits-Sicherheitsüberhöhungen durch hochpräzise Online-Feuchtemessgeräte der Gesteinskörnungen im Betonwerk. Dies senkt statistische Schwankungen und ermöglicht zielgenaue Punktlandungen der Festigkeitsklasse.',
            tags: ['Online-Feuchtesensoren', 'Grenzfaktoren']
          },
          {
            title: 'Herstellung Zement (Thermische Ofen-Brennstoffe)',
            desc: 'Substitution fossiler Energieträger (Kohle) im Drehrohrofen des Zementwerkes durch energetische Sekundärbrennstoffe wie Altreifen, getrocknete Klärschlämme, Biomasse und zukünftig grüne Wasserstoff-Zyklonbrenner.',
            tags: ['Sekundärbrennstoffe', 'Drehofen', 'H2-Brennstoff']
          }
        ]
      },
      {
        name: 'Regulatives & Leistungsorientierung',
        items: [
          {
            title: 'Unterschreitung normativer Mindestzementgehalte',
            desc: 'Individueller, experimentaler Nachweis der Frost-Tausalz- und Karbonatisierungsbeständigkeit mittels performancebasierter Entwurfsverfahren (Performance Concept) anstelle starrer deskriptiver Tabellenwerte.',
            tags: ['Performance Concept', 'Abweichende Rezeptur']
          }
        ]
      }
    ]
  },
  {
    id: 'recycling',
    title: '3. Recycling & Kreislaufführung',
    subtitle: 'Ressourcenschonung durch mineralische Sekundärgesteine',
    icon: <Recycle size={18} />,
    colorBorder: 'border-blue-100 focus-within:border-blue-300',
    colorBg: 'bg-blue-50/10',
    colorText: 'text-blue-950',
    colorIcon: 'bg-blue-100/70 text-blue-700 border-blue-200/50',
    intro: 'Vermeidung primärer Rohstoffentnahmen durch dezentrales, hocheffizientes Aufbereiten mineralischer Altbausubstanzen und Rückführung in das Nutzungsnetzwerk.',
    categories: [
      {
        name: 'Kreislaufkomponenten',
        items: [
          {
            title: 'RC-Beton (Gesteinskörnung Typ 1 & Typ 2)',
            desc: 'Ersatz natürlich gewonnener Quarzkiese und Sande durch rezyklierte Gesteinskörnungen aus sortenrein aufbereitetem Beton- und Mauerwerksbruch (Recycling-Splitt). Schont wertvolle biologische Bodenhorizonte vor Auskiesung.',
            tags: ['RC-Gesteinskörnung Typ 1 (Beton)', 'RC-Gesteinskörnung Typ 2 (Misch)']
          },
          {
            title: 'Rezyklierter Gesteinssand & CO₂-Karbonatisierung',
            desc: 'Spezielle Anreicherung und Begasung von feinsten Recycling-Sanden mit CO₂-Gasströmen zur Festigkeitshärtung der sandigen Randzonen bei permanentem, materialschonendem Kohlenstoffschadensausgleich.',
            tags: ['Sand-Karbonatisierung', 'Aggregatsverstärkung']
          }
        ]
      }
    ]
  },
  {
    id: 'sonstiges',
    title: '4. Technische Carbon-Senken & Abscheidung',
    subtitle: 'Chemische Bindung & zirkuläres Net-Zero-Engineering',
    icon: <Sparkles size={18} />,
    colorBorder: 'border-indigo-100 focus-within:border-indigo-300',
    colorBg: 'bg-indigo-50/10',
    colorText: 'text-indigo-950',
    colorIcon: 'bg-indigo-100/70 text-indigo-700 border-indigo-200/50',
    intro: 'Klimapositive Effekte und technische Carbonat-Anreicherung zur Bindung klimaschädlicher Gase im Inneren mineralischer Matrixsysteme oder unmittelbar am Klinkerofen.',
    categories: [
      {
        name: 'Kohlenstoffsenken im Beton',
        items: [
          {
            title: 'Misch-Karbonatisierung (Wasser- & Gastechnik)',
            desc: 'Aktives Injizieren verflüssigten gasförmigen Treibhausgases während des Nassmischvorgangs. Das CO₂ mineralisiert sofort in microfeine, laststabile Calciumcarbonatkristallite und schließt das Treibhausgas dauerhaft physikalisch ein.',
            tags: ['CO2-Mischereindüsung', 'Kalksteinausfällung']
          },
          {
            title: 'Pyrogene Pflanzenkohle als stabile Kohlenstoffkomponente',
            desc: 'Integration zertifizierter, stabiler Pflanzenkohle als inertes Substitutionsgut für Feinstsande. Wirkt über Jahrhunderte als statisch neutrale, unzerfallbare bioklimatische CO₂-Speicher-Senke im tragenden Gefüge.',
            tags: ['Pflanzenkohle', 'Carbon Carbon Sink']
          }
        ]
      },
      {
        name: 'Carbon Capture & Storage (CCU / CCS)',
        items: [
          {
            title: 'Industrielle Abscheidung und Ofenmündungsspeicherung',
            desc: 'Abfangen des prozess- und rohstoffbedingten Drehofen-CO₂ (Kalksteinentsäuerung) am Industrieschornstein (CCS). Das komprimierte Gas wird dauerhaft verflüssigt in ungenutzten marinen Kavernen verpresst oder für chemische Wertkreisläufe katalytisch aufbereitet (CCU).',
            tags: ['Carbon Capture', 'Klinkergas-Abscheidung', 'Endlagerung (CCS)']
          }
        ]
      }
    ]
  }
];
