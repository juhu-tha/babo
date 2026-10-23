import React, { useState, useMemo } from 'react';
import { 
  Leaf, Beaker, Layers, Sparkles, Trash2, 
  Settings, CheckCircle2, ChevronRight, Calculator, AlertTriangle, Recycle, Trees,
  ChevronDown, ChevronUp, Activity, BookOpen,
  Scale, Award, Building2, Sliders
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';

interface Seaeule {
  id: 'effizienz' | 'suffizienz' | 'konsistenz' | 'resilienz';
  title: string;
  tagline: string;
  mitigationPotential: string; // e.g. "Hoch"
  description: string;
  strategies: string[];
  example: string;
}

const SAEULEN_DATA: Seaeule[] = [
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

interface ConcretePrincipleItem {
  title: string;
  desc: string;
  tags: string[];
}

interface ConcreteCategory {
  name: string;
  items: ConcretePrincipleItem[];
}

interface ConcretePrincipleGroup {
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

const BETON_PRINZIPIEN: ConcretePrincipleGroup[] = [
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
            tags: ['RC-Zuschlag Typ 1 (Beton)', 'RC-Zuschlag Typ 2 (Misch)']
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
            title: 'Pyrogene Pflanzenkohle als stabiler Kohlenstoff-Zuschlag',
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

export default function Materialoptimierung() {
  const [activeSubTab, setActiveSubTab] = useState<'saeulen' | 'betonoptimierung' | 'dafstb_richtlinie'>('saeulen');
  const [selectedSaeule, setSelectedSaeule] = useState<'effizienz' | 'suffizienz' | 'konsistenz' | 'resilienz'>('effizienz');
  const [showPflanzenkohleModal, setShowPflanzenkohleModal] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // DAfStb-Richtlinie Calculator States
  const [dafstbBauteil, setDafstbBauteil] = useState<'decke' | 'stuetze' | 'wand' | 'bodenplatte'>('decke');
  const [dafstbBauweise, setDafstbBauweise] = useState<string>('hohlkoerper');
  const [dafstbZement, setDafstbZement] = useState<'cem1' | 'cem2_all' | 'cem2_bs' | 'cem3_a' | 'cem2_cm'>('cem3_a');
  const [dafstbPruefalter, setDafstbPruefalter] = useState<28 | 56>(56);
  const [dafstbStahlRoute, setDafstbStahlRoute] = useState<'standard_bof' | 'gruen_eaf'>('gruen_eaf');

  const activeSaeuleData = useMemo(() => {
    return SAEULEN_DATA.find(s => s.id === selectedSaeule)!;
  }, [selectedSaeule]);

  // DAfStb-Richtlinie Tragwerks-Berechnung
  const dafstbCalc = useMemo(() => {
    let refBetonVol = 26.0;
    let refStahlKg = 2860;
    let refArea = 100;
    let areaUnit = 'm² Deckenfläche';
    let label = 'Geschossdecke (100 m² Fläche)';

    let optBetonVol = 26.0;
    let optStahlKg = 2860;

    if (dafstbBauteil === 'decke') {
      label = 'Geschossdecke (100 m² Fläche)';
      refArea = 100;
      areaUnit = 'm² Decke';
      refBetonVol = 26.0; // 26 cm Massivplatte
      refStahlKg = 2860; // 110 kg/m³
      if (dafstbBauweise === 'massiv') {
        optBetonVol = 24.0; // 24 cm schlank optimiert
        optStahlKg = 2520; // 105 kg/m³
      } else if (dafstbBauweise === 'hohlkoerper') {
        optBetonVol = 19.5; // -25% durch Hohlkörperverdrängung
        optStahlKg = 2470; // 95 kg/m³ bezogen auf Bruttomaß
      } else if (dafstbBauweise === 'vorgespannt') {
        optBetonVol = 20.0; // 20 cm Flachdecke mit Spannbeton
        optStahlKg = 1400; // 70 kg/m³ Spann- und Zulagebewehrung
      }
    } else if (dafstbBauteil === 'stuetze') {
      label = 'Innenstützen (4 Stützen à 3,50 m = 14 m Gesamtlänge)';
      refArea = 14;
      areaUnit = 'm Stütze';
      refBetonVol = 2.835; // 45x45 cm C25/30
      refStahlKg = 397; // 140 kg/m³
      if (dafstbBauweise === 'hochfest_c50_schlank') {
        optBetonVol = 1.26; // 30x30 cm hochfest C50/60 (-55% Betonvolumen)
        optStahlKg = 202; // 160 kg/m³
      } else {
        optBetonVol = 2.835;
        optStahlKg = 397;
      }
    } else if (dafstbBauteil === 'wand') {
      label = 'Tragwand / Kernwand (60 m² Ansichtsfläche)';
      refArea = 60;
      areaUnit = 'm² Wand';
      refBetonVol = 14.4; // 24 cm Dicke
      refStahlKg = 1152; // 80 kg/m³
      if (dafstbBauweise === 'optimiert_18') {
        optBetonVol = 10.8; // 18 cm Dicke (-25% Betonvolumen)
        optStahlKg = 864;
      } else {
        optBetonVol = 14.4;
        optStahlKg = 1152;
      }
    } else if (dafstbBauteil === 'bodenplatte') {
      label = 'Fundamentplatte / Bodenplatte (120 m² Grundfläche)';
      refArea = 120;
      areaUnit = 'm² Platte';
      refBetonVol = 42.0; // 35 cm Dicke
      refStahlKg = 3780; // 90 kg/m³
      if (dafstbBauweise === 'optimiert_28') {
        optBetonVol = 33.6; // 28 cm Dicke (-20% Betonvolumen)
        optStahlKg = 2856;
      } else {
        optBetonVol = 42.0;
        optStahlKg = 3780;
      }
    }

    // Concrete GWP factors [kg CO2e / m³]
    const zementGwpMap: Record<string, number> = {
      cem1: 310,
      cem2_all: 250,
      cem2_bs: 190,
      cem3_a: 135,
      cem2_cm: 105
    };

    const optZementBaseGwp = zementGwpMap[dafstbZement] || 250;
    // 56-day testing age allows ~9% cement reduction due to prolonged hydration of slag/pozzolana
    const ageFactor = dafstbPruefalter === 56 ? 0.91 : 1.0;
    const optConcreteGwpPerM3 = Math.round(optZementBaseGwp * ageFactor);

    // Steel GWP factors [kg CO2e / kg]
    const refSteelGwpPerKg = 0.98; // European BOF average
    const optSteelGwpPerKg = dafstbStahlRoute === 'gruen_eaf' ? 0.42 : 0.98;

    // Totals Reference
    const refConcreteGwpTotal = Math.round(refBetonVol * 310);
    const refSteelGwpTotal = Math.round(refStahlKg * refSteelGwpPerKg);
    const refTotalGwp = refConcreteGwpTotal + refSteelGwpTotal;
    const refSpecificGwp = refTotalGwp / refArea;

    // Totals Optimized
    const optConcreteGwpTotal = Math.round(optBetonVol * optConcreteGwpPerM3);
    const optSteelGwpTotal = Math.round(optStahlKg * optSteelGwpPerKg);
    const optTotalGwp = optConcreteGwpTotal + optSteelGwpTotal;
    const optSpecificGwp = optTotalGwp / refArea;

    // Reduction
    const diffAbs = Math.max(0, refTotalGwp - optTotalGwp);
    const diffPct = Math.max(0, ((refTotalGwp - optTotalGwp) / refTotalGwp) * 100);

    // DAfStb Efficiency Class
    let efficiencyClass = 'Referenz';
    let efficiencyBadge = 'bg-slate-100 text-slate-800 border-slate-300';
    let classLabel = 'Konventioneller Standard';
    let classStar = 'Basis';

    if (diffPct >= 50) {
      efficiencyClass = 'Klasse A+';
      efficiencyBadge = 'bg-emerald-100 text-emerald-900 border-emerald-300';
      classLabel = 'THG-Exzellenz (Ultra-Low-Carbon)';
      classStar = '★★★★★';
    } else if (diffPct >= 40) {
      efficiencyClass = 'Klasse A';
      efficiencyBadge = 'bg-green-100 text-green-900 border-green-300';
      classLabel = 'Ambitionierte Dekarbonisierung';
      classStar = '★★★★☆';
    } else if (diffPct >= 25) {
      efficiencyClass = 'Klasse B';
      efficiencyBadge = 'bg-amber-100 text-amber-900 border-amber-300';
      classLabel = 'Wirtschaftliches Optimum';
      classStar = '★★★☆☆';
    } else if (diffPct >= 10) {
      efficiencyClass = 'Klasse C';
      efficiencyBadge = 'bg-blue-100 text-blue-900 border-blue-300';
      classLabel = 'Einstiegs-Optimierung';
      classStar = '★★☆☆☆';
    }

    return {
      label,
      areaUnit,
      refArea,
      refBetonVol,
      refStahlKg,
      optBetonVol,
      optStahlKg,
      optConcreteGwpPerM3,
      refTotalGwp,
      optTotalGwp,
      refConcreteGwpTotal,
      optConcreteGwpTotal,
      refSteelGwpTotal,
      optSteelGwpTotal,
      refSpecificGwp,
      optSpecificGwp,
      diffAbs,
      diffPct,
      efficiencyClass,
      efficiencyBadge,
      classLabel,
      classStar
    };
  }, [dafstbBauteil, dafstbBauweise, dafstbZement, dafstbPruefalter, dafstbStahlRoute]);

  return (
    <div className="flex flex-col gap-6 w-full text-slate-800 animate-fade-in">
      
      {/* --- Header Panel --- */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <Leaf className="text-shiraz" /> Material- &amp; Stoffoptimierung
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Ökologische Bilanzverbesserung durch stoffliche Optimierungspfade. Erschließen Sie Potenziale mit den Säulen der Kreislaufwirtschaft und analysiere klinkerarme Bindemittel- und Substitutionskonzepte nach DIN EN 15804+A2 und VDI 4800.
          </p>
        </div>
      </div>

      {/* --- Navigation Subtabs --- */}
      <div className="flex border-b border-home-grau/30 overflow-x-auto bg-white p-1 rounded-xl shadow-sm border gap-1">
        <button
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'saeulen' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('saeulen')}
        >
          <Layers size={14} /> Die 4 Säulen der Stoffoptimierung
        </button>
        <button
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'betonoptimierung' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('betonoptimierung')}
        >
          <Beaker size={14} /> Betonoptimierungs-Leitfaden (Prinzipien)
        </button>
        <button
          className={`flex-1 min-w-[180px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'dafstb_richtlinie' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('dafstb_richtlinie')}
        >
          <Scale size={14} /> DAfStb-Richtlinie: Treibhausgasoptimierte Tragwerke aus Stahlbeton
        </button>
      </div>

      {/* --- Tab 1: 4 Pillars of Optimization --- */}
      {activeSubTab === 'saeulen' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Sparkles className="text-shiraz" size={18} /> Strategische Dimensionen für kreislaufgerechte Gebäude
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Eine verbesserte Ökobilanz (LCA) lässt sich nicht allein durch nachlaufende Dämmstoffverbesserungen erzielen. Vielmehr greift die systemische Stoffoptimierung an der Tragwerksplanung an. Durch geschicktes Ineinandergreifen von Suffizienz, Effizienz, Konsistenz und Resilienz wird mineralischer Müll verhindert und der Carbon footprint drastisch minimiert.
          </p>
        </div>

            {/* Left selector, right details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
              
              {/* Pillar Selector Buttons */}
              <div className="md:col-span-4 flex flex-col gap-3">
                {SAEULEN_DATA.map((saeule) => (
                  <button
                    key={saeule.id}
                    type="button"
                    onClick={() => setSelectedSaeule(saeule.id)}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      selectedSaeule === saeule.id
                        ? 'border-rose-500 bg-rose-50/20 text-slate-900 shadow'
                        : 'border-home-grau/30 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-xs text-slate-900">{saeule.title}</h3>
                        <ChevronRight size={14} className={selectedSaeule === saeule.id ? 'text-shiraz' : 'text-slate-400'} />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{saeule.tagline}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Pillar Content Visualization */}
              <div className="md:col-span-8 bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3 border-b border-home-grau/30 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-shiraz uppercase tracking-wider block font-mono">
                        Schnittstellen-Details
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 font-sans mt-0.5">
                        {activeSaeuleData.title}
                      </h3>
                    </div>
                    <span className="bg-rose-100/50 text-shiraz text-[10.5px] font-mono font-bold px-2 py-0.5 rounded border border-rose-100">
                      {activeSaeuleData.mitigationPotential}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                    {activeSaeuleData.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-bold text-slate-800 block">
                      Maßgebliche Optimierungsansätze:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {activeSaeuleData.strategies.map((strat, idx) => (
                        <li key={idx} className="flex gap-2 items-start bg-slate-50 p-2 rounded border border-home-grau/30">
                          <CheckCircle2 size={14} className="text-shiraz shrink-0 mt-0.5" />
                          <span className="text-slate-700 leading-relaxed text-[11px]">{strat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-rose-50/20 border border-rose-200 p-3.5 rounded-lg mt-4">
                  <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block mb-1 font-mono">
                    🎓 Praxisbeispiel aus dem Ingenieurbüro
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-700 font-sans italic">
                    &quot;{activeSaeuleData.example}&quot;
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- Tab 2: Betonoptimierungs-Leitfaden --- */}
      {activeSubTab === 'betonoptimierung' && (
        <div className="space-y-6">
          
          {/* Main Informational Header Banner */}
          <div className="bg-gradient-to-r from-fuchsia-50/40 via-fuchsia-50/10 to-transparent border border-home-grau/30 p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm">
            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200/60 shrink-0">
              <Beaker className="text-shiraz" size={26} />
            </div>
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                Wissenschaftliche Prinzipien der Betonoptimierung
              </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Über 60% der CO₂-Emissionen des klassischen Betons basieren auf rohstoff- und prozessbedingten Prozeduren beim Entsäuern des Kalksteins im Ofen, während ~40% auf thermischen Brennstoffen lagern. Hier sind die vier baupraktischen Kern-Sektoren der systematischen Treibhausgasminimierung strukturiesystematisch gelistet.
          </p>
        </div>
          </div>

          {/* Collapse/Expand Control Panel */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50/75 border border-slate-200 rounded-xl gap-3">
            <div>
              <span className="text-xs font-extrabold text-shiraz uppercase tracking-widest block font-mono flex items-center gap-1.5">
                <Layers size={13} className="text-shiraz" /> Klappbare Menüpunkte (Leitfaden-Struktur)
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Klicken Sie auf einzelne Kategorieüberschriften, um spezifische Optimierungswege ein- oder auszublenden.
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const allKeys: Record<string, boolean> = {};
                  BETON_PRINZIPIEN.forEach(principle => {
                    principle.categories.forEach(category => {
                      allKeys[`${principle.id}-${category.name}`] = true;
                    });
                  });
                  setExpandedCategories(allKeys);
                }}
                className="px-3 py-1.5 text-[10.5px] font-bold text-shiraz bg-white border border-rose-300 hover:bg-rose-50 rounded-lg cursor-pointer transition-all shadow-xxs"
              >
                📂 Alle aufklappen
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpandedCategories({});
                }}
                className="px-3 py-1.5 text-[10.5px] font-bold text-slate-700 bg-white border border-slate-250 hover:bg-slate-50 rounded-lg cursor-pointer transition-all shadow-xxs"
              >
                📁 Alle einklappen
              </button>
            </div>
          </div>

          {/* Grid Layout of the Four Principles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {BETON_PRINZIPIEN.map((principle) => {
              const Icon = principle.icon;
              return (
                <div 
                  key={principle.id}
                  className={`border rounded-2xl p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md h-full space-y-4 ${principle.colorBg} ${principle.colorBorder}`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start gap-3 border-b pb-3 border-home-grau/30">
                    <div>
                      <h4 className="text-xs font-black tracking-tight text-slate-950 uppercase font-sans">
                        {principle.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium block leading-none mt-0.5 font-sans">
                        {principle.subtitle}
                      </p>
                    </div>
                    <div className={`p-1.5 rounded-lg border text-sm ${principle.colorIcon}`}>
                      {Icon}
                    </div>
                  </div>

                  {/* Intro Text */}
                  <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans font-normal italic">
                    {principle.intro}
                  </p>

                  {/* Categories Stack */}
                  <div className="space-y-4 pt-1">
                    {principle.categories.map((category, idx) => {
                      const categoryKey = `${principle.id}-${category.name}`;
                      const isExpanded = !!expandedCategories[categoryKey];
                      return (
                        <div key={idx} className="space-y-2 border border-slate-100/60 p-2 rounded-xl bg-slate-50/10 shadow-xxs">
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedCategories(prev => ({
                                ...prev,
                                [categoryKey]: !prev[categoryKey]
                              }));
                            }}
                            className="w-full flex items-center justify-between py-1 px-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors text-left focus:outline-none"
                          >
                            <span className="text-[10px] uppercase font-black tracking-widest text-[#8a1438] block font-mono flex items-center gap-1.5 select-none">
                              {category.name}
                              <span className="text-[8px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded-full font-sans">
                                {category.items.length} {category.items.length === 1 ? 'Eintrag' : 'Einträge'}
                              </span>
                            </span>
                            <span className="text-slate-400">
                              {isExpanded ? (
                                <ChevronUp size={13} className="text-slate-600 font-bold animate-in spin-in-180 duration-200" />
                              ) : (
                                <ChevronDown size={13} className="text-slate-400" />
                              )}
                            </span>
                          </button>

                          {isExpanded && (
                            <div className="space-y-2.5 pt-1.5 animate-in slide-in-from-top-1 duration-200">
                              {category.items.map((item, idy) => {
                                const isPflanzenkohle = item.title.includes('Pflanzenkohle');
                                return (
                                  <div 
                                    key={idy}
                                    onClick={isPflanzenkohle ? () => setShowPflanzenkohleModal(true) : undefined}
                                    className={`p-3.5 bg-white border rounded-xl space-y-1.5 transition-all ${
                                      isPflanzenkohle 
                                        ? 'border-rose-500 bg-rose-50/5 hover:bg-rose-50/20 hover:border-shiraz cursor-pointer shadow-sm relative group active:scale-[0.99] border-2 animate-pulse' 
                                        : 'border-home-grau/30 hover:shadow-sm'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-2">
                                      <strong className="text-[11px] text-slate-900 block font-bold font-sans font-medium">
                                        {item.title}
                                      </strong>
                                      {isPflanzenkohle && (
                                        <span className="shrink-0 text-[9px] bg-rose-100 text-shiraz font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                                          <span>Info 👆</span>
                                          <Sparkles size={8} className="text-shiraz font-bold" />
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">
                                      {item.desc}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {item.tags.map((tag, tagId) => (
                                        <span 
                                          key={tagId}
                                          className={`text-[8.5px] font-mono font-medium px-1.5 py-0.5 rounded border ${
                                            isPflanzenkohle 
                                              ? 'text-shiraz bg-rose-100/10 border-rose-200/40' 
                                              : 'text-slate-500 bg-slate-50 border-home-grau/30'
                                          }`}
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* --- Tab 3: DAfStb-Richtlinie Treibhausgasoptimierte Tragwerke aus Stahlbeton --- */}
      {activeSubTab === 'dafstb_richtlinie' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main Overview Card */}
          <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-50 text-shiraz border border-rose-200 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
                  <Scale size={13} /> DAfStb-Regelwerk • Gründruck / Richtlinie
                </div>
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  DAfStb-Richtlinie: Treibhausgasoptimierte Tragwerke aus Beton und Stahlbeton
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                Deutscher Ausschuss für Stahlbeton e.V.
              </span>
            </div>

            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
              <p>
                Rund <strong>60 bis 70 % der gebundenen Treibhausgasemissionen (Embodied Carbon / Modul A1–A5)</strong> eines Rohbaus entfallen auf das tragende Massivbaugerüst – vor allem auf Decken, Stützen und Wände.
                Die <strong>DAfStb-Richtlinie „Treibhausgasoptimierte Tragwerke aus Beton und Stahlbeton“</strong> schließt die Lücke zwischen der rein standsicherheitsorientierten Tragwerksplanung nach <strong>DIN EN 1992-1-1 (Eurocode 2)</strong> und den zwingenden Dekarbonisierungsanforderungen (EU-Taxonomie, EPBD 2024, QNG, DGNB).
                Sie definiert erstmals verbindliche <strong>THG-Referenzwerte, Nachweisverfahren und Effizienzklassen</strong> für Bauteile und Tragwerke über ihren Lebenszyklus.
              </p>
            </div>
          </div>

          {/* 3-Ebenen-Systematik der DAfStb-Richtlinie */}
          <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Building2 className="text-shiraz" size={18} /> Das 3-Ebenen-Nachweiskonzept der Richtlinie
            </h4>
            <p className="text-xs text-slate-600">
              Die Richtlinie verknüpft Baustoffherstellung, Bauteilgeometrie und Gesamttragwerk zu einer geschlossenen Bilanzkette:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Ebene 1</span>
                  <h5 className="font-bold text-sm text-text-main mb-1.5 flex items-center gap-1.5">
                    <Beaker size={15} className="text-shiraz" /> Baustoffebene (Beton &amp; Stahl)
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Quantifizierung der spezifischen Emissionen pro Kubikmeter Beton (<InlineMath math="GWP_{\text{c}}" /> in <InlineMath math="\text{kg CO}_2\text{-eq}/\text{m}^3" />) und pro Tonne Bewehrungsstahl (<InlineMath math="GWP_{\text{s}}" />) basierend auf EPDs nach DIN EN 15804+A2.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                  Fokus: Klinkerfaktor, Zementart, k-Wert, EAF-Stahl
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Ebene 2</span>
                  <h5 className="font-bold text-sm text-text-main mb-1.5 flex items-center gap-1.5">
                    <Layers size={15} className="text-shiraz" /> Bauteilebene (Decken, Stützen, Wände)
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Zusammenführung von Baustoff-GWP, Bauteilgeometrie und Bewehrungsgehalt. Bildung flächen- oder längenbezogener Kennwerte (<InlineMath math="\text{kg CO}_2\text{-eq}/\text{m}^2" /> bzw. <InlineMath math="\text{kg CO}_2\text{-eq}/\text{m}" />).
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                  Fokus: Schlankheit, Hohlkörper, Vorspannung, Bewehrungsgrad
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Ebene 3</span>
                  <h5 className="font-bold text-sm text-text-main mb-1.5 flex items-center gap-1.5">
                    <Award size={15} className="text-shiraz" /> Gesamttragwerk (Gebäudeebene)
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Summation aller Tragwerkselemente bezogen auf die Nettogrundfläche (NGF) des Gebäudes. Nachweisbedingung nach DAfStb:
                  </p>
                  <div className="bg-white p-2 rounded-lg border border-home-grau/30 text-center my-1">
                    <InlineMath math="GWP_{\text{Ist}} \le GWP_{\text{Ziel}} \le GWP_{\text{Referenz}}" />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                  Fokus: Lastabtrag, Stützenraster, Fundamentierung
                </div>
              </div>
            </div>
          </div>

          {/* DAfStb-Effizienzklassen Matrix */}
          <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-home-grau/20 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Award className="text-shiraz" size={18} /> THG-Effizienzklassen nach DAfStb
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Klassifizierung der Treibhausgasminderung gegenüber dem normativen Benchmark (konventioneller Standard mit CEM I)
                </p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                5 Dekarbonisierungsstufen
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-xs text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">Klasse A+</span>
                    <span className="text-xs text-emerald-700">★★★★★</span>
                  </div>
                  <strong className="text-xs font-bold text-emerald-950 block mb-1">THG-Minderung &ge; 50 %</strong>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Ultra-Low-Carbon Standard. Zement CEM III/B oder CEM II/C-M, 56d-Prüfalter, Hohlkörper-/Vorspanndecke, 100% Elektroofenstahl.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 mt-3 pt-2 border-t border-emerald-200/60 block">DGNB/QNG Platin-Level</span>
              </div>

              <div className="p-3.5 rounded-xl border border-green-200 bg-green-50/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-xs text-green-900 bg-green-100 px-2 py-0.5 rounded border border-green-300">Klasse A</span>
                    <span className="text-xs text-green-700">★★★★☆</span>
                  </div>
                  <strong className="text-xs font-bold text-green-950 block mb-1">THG-Minderung 40–49 %</strong>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Ambitioniertes Ziel. CEM III/A oder CEM II/B-S mit k-Wert, schlankere Deckenquerschnitte, optimierte Bewehrungsführung.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-green-800 mt-3 pt-2 border-t border-green-200/60 block">QNG-Premium tauglich</span>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">Klasse B</span>
                    <span className="text-xs text-amber-700">★★★☆☆</span>
                  </div>
                  <strong className="text-xs font-bold text-amber-950 block mb-1">THG-Minderung 25–39 %</strong>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Wirtschaftliches Optimum. CEM II/A-LL / CEM II/B, moderater Klinkerersatz, konsequenter Verzicht auf Überdimensionierung.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-amber-800 mt-3 pt-2 border-t border-amber-200/60 block">QNG-Plus Standard</span>
              </div>

              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-xs text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">Klasse C</span>
                    <span className="text-xs text-blue-700">★★☆☆☆</span>
                  </div>
                  <strong className="text-xs font-bold text-blue-950 block mb-1">THG-Minderung 10–24 %</strong>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Einstiegsstandard. Leichte Zementoptimierung, Standardbewehrung, minimale Bauteilreduktion ohne Bauablaufanpassung.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-800 mt-3 pt-2 border-t border-blue-200/60 block">Basis-Verbesserung</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-xs text-slate-700 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">Referenz</span>
                    <span className="text-xs text-slate-500">Basis</span>
                  </div>
                  <strong className="text-xs font-bold text-slate-900 block mb-1">Benchmark (0 %)</strong>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Historisch-konventionelle Bauweise nach DIN EN 206 mit reinem CEM I (Klinker &ge; 95%) und BOF-Standardstahl.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-600 mt-3 pt-2 border-t border-slate-200 block">Ausgangs-Baseline</span>
              </div>
            </div>
          </div>

          {/* 4 Planerische Hebel */}
          <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Sliders className="text-shiraz" size={18} /> Die 4 planerischen Hebel des Tragwerksplaners nach DAfStb
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-text-main">
                  <div className="w-6 h-6 rounded-md bg-shiraz text-white flex items-center justify-center text-xs font-mono font-bold">1</div>
                  <span>Tragwerksgeometrie &amp; Leichtbau</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Material nur dort anordnen, wo Zug- oder Druckkräfte fließen.
                  <strong> Hohlkörperdecken</strong> verdrängen bis zu 35 % Beton in der statischen Nullzone ohne Traglastverlust.
                  <strong> Vorspannung mit sofortigem oder nachträglichem Verbund</strong> verringert Deckendicken um 20 bis 25 % und spart tonnenweise Durchstanz- und Biegebewehrung.
                  <strong> Hochfester Beton (C50/60 bis C80/95) für Stützen</strong> spart trotz zementreicherer Mischung über 50 % Querschnittsvolumen – netto sinkt der CO₂-Ausstoß der Stütze um rund 35 %!
                </p>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-text-main">
                  <div className="w-6 h-6 rounded-md bg-shiraz text-white flex items-center justify-center text-xs font-mono font-bold">2</div>
                  <span>Klinkerfaktor &amp; Prüfalter 56 d</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Portlandzementklinker ist der Hauptemittent. Substitution durch Hüttensandmehl (CEM III/A), calcinierte Tone (LC3) oder Kalksteinmehl (CEM II/C-M) senkt den Zement-GWP um 50 bis 70 %.
                  <strong> DAfStb-Regel zum Prüfalter:</strong> Wer die Konformitätsprüfung auf <strong>56 Tage statt 28 Tage</strong> festlegt (DIN EN 206), nutzt die langsame Puzzolan- und Hüttensandhydratation vollständig aus und kann die Zementdosierung um ca. 8 bis 10 % reduzieren.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-text-main">
                  <div className="w-6 h-6 rounded-md bg-shiraz text-white flex items-center justify-center text-xs font-mono font-bold">3</div>
                  <span>Bewehrungsstahl &amp; Herstellroute</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bewehrungsstahl emittiert über die Hochofenroute (BOF) rund <strong>0,95 bis 1,2 kg CO₂-eq/kg</strong>, über die Elektrolichtbogenroute (EAF / 100% Stahlschrott mit Grünstrom) nur <strong>0,35 bis 0,45 kg CO₂-eq/kg</strong> – eine Reduktion um fast 60 %!
                  Zusätzlich lässt sich die Zwangsbewehrung zur Rissbreitenbegrenzung (<InlineMath math="w_{\text{max}}" />) durch den Einsatz von Zementen mit geringer Hydratationswärme (LH-Zemente) und optimierte Nachbehandlung drastisch reduzieren.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-text-main">
                  <div className="w-6 h-6 rounded-md bg-shiraz text-white flex items-center justify-center text-xs font-mono font-bold">4</div>
                  <span>Bauablauf &amp; Nachbehandlung (DIN EN 13670)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Klinkerarme Betone erhärten langsamer und besitzen in den ersten Tagen eine empfindlichere Randzone.
                  Die DAfStb-Richtlinie fordert daher eine <strong>angepasste Nachbehandlung (Nachbehandlungsklasse 3 oder 4 nach DIN EN 13670 / DIN 1045-3)</strong>: längeres Belassen der Schalung, Feuchthalten oder Nachbehandlungsfilme verhindern das vorzeitige Austrocknen und garantieren eine dichte, karbonatisierungsresistente Betondeckung.
                </p>
              </div>
            </div>
          </div>

          {/* Interaktiver DAfStb-Tragwerksrechner */}
          <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="border-b border-home-grau/20 pb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Calculator className="text-shiraz" size={18} /> Interaktiver DAfStb-Bauteilrechner &amp; Variantenvergleich
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Simulieren Sie den THG-Unterschied zwischen konventionellem Tragwerks-Benchmark und DAfStb-optimierter Bauweise.
                </p>
              </div>
              <div className={`px-3 py-1 rounded-xl border font-bold text-xs flex items-center gap-1.5 ${dafstbCalc.efficiencyBadge}`}>
                <Award size={14} /> {dafstbCalc.efficiencyClass} ({dafstbCalc.classLabel})
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-home-grau/20">
              
              {/* Bauteil-Auswahl */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono">
                  1. Bauteiltyp
                </label>
                <select aria-label="1. Bauteiltyp"
                  value={dafstbBauteil}
                  onChange={(e) => {
                    const b = e.target.value as any;
                    setDafstbBauteil(b);
                    if (b === 'decke') setDafstbBauweise('hohlkoerper');
                    else if (b === 'stuetze') setDafstbBauweise('hochfest_c50_schlank');
                    else if (b === 'wand') setDafstbBauweise('optimiert_18');
                    else if (b === 'bodenplatte') setDafstbBauweise('optimiert_28');
                  }}
                  className="w-full text-xs font-bold p-2.5 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                >
                  <option value="decke">Geschossdecke (100 m²)</option>
                  <option value="stuetze">Stützen (4 Stk. à 3,50 m = 14 m)</option>
                  <option value="wand">Tragwand / Kernwand (60 m²)</option>
                  <option value="bodenplatte">Fundamentplatte (120 m²)</option>
                </select>
                <span className="text-[10px] text-slate-500 block">Referenz: massives Standardbauteil</span>
              </div>

              {/* Bauweise & Geometrie-Optimierung */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono">
                  2. Geometrie &amp; Bauweise
                </label>
                <select aria-label="2. Geometrie &amp; Bauweise"
                  value={dafstbBauweise}
                  onChange={(e) => setDafstbBauweise(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                >
                  {dafstbBauteil === 'decke' && (
                    <>
                      <option value="massiv">Massivplatte schlank (24 cm)</option>
                      <option value="hohlkoerper">Hohlkörperdecke (26 cm, -25% Beton)</option>
                      <option value="vorgespannt">Vorgespannte Flachdecke (20 cm, -51% Bewehrung)</option>
                    </>
                  )}
                  {dafstbBauteil === 'stuetze' && (
                    <>
                      <option value="standard_c25">Standard C25/30 (45 x 45 cm)</option>
                      <option value="hochfest_c50_schlank">Hochfest C50/60 schlank (30 x 30 cm, -55% Beton)</option>
                    </>
                  )}
                  {dafstbBauteil === 'wand' && (
                    <>
                      <option value="standard_24">Standardwand massiv (24 cm)</option>
                      <option value="optimiert_18">Optimierte Tragwand (18 cm, -25% Beton)</option>
                    </>
                  )}
                  {dafstbBauteil === 'bodenplatte' && (
                    <>
                      <option value="standard_35">Standard-Bodenplatte (35 cm)</option>
                      <option value="optimiert_28">Dickenreduziert (28 cm, -20% Beton)</option>
                    </>
                  )}
                </select>
                <span className="text-[10px] text-slate-500 block">Gewichts- und Querschnittsreduktion</span>
              </div>

              {/* Bindemittel & Zementtyp */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono">
                  3. Zement- &amp; Bindemittelart
                </label>
                <select aria-label="3. Zement- &amp; Bindemittelart"
                  value={dafstbZement}
                  onChange={(e) => setDafstbZement(e.target.value as any)}
                  className="w-full text-xs font-bold p-2.5 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                >
                  <option value="cem1">CEM I (Klinker 95% - Ref. 310 kg/m³)</option>
                  <option value="cem2_all">CEM II/A-LL (Kalkstein - 250 kg/m³)</option>
                  <option value="cem2_bs">CEM II/B-S (Hüttensand - 190 kg/m³)</option>
                  <option value="cem3_a">CEM III/A (Hochofenzement - 135 kg/m³)</option>
                  <option value="cem2_cm">CEM II/C-M / LC3 (Ultra-Low - 105 kg/m³)</option>
                </select>
                <span className="text-[10px] text-slate-500 block">Klinkerersatz nach DIN EN 197-1/-5</span>
              </div>

              {/* Prüfalter & Stahlroute */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono">
                  4. Prüfalter &amp; Stahlroute
                </label>
                <div className="flex gap-2">
                  <select aria-label="4. Prüfalter &amp; Stahlroute"
                    value={dafstbPruefalter}
                    onChange={(e) => setDafstbPruefalter(Number(e.target.value) as any)}
                    className="w-1/2 text-xs font-bold p-2 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                  >
                    <option value={28}>28 Tage (Standard)</option>
                    <option value={56}>56 Tage (DAfStb -9%)</option>
                  </select>
                  <select
                    value={dafstbStahlRoute}
                    onChange={(e) => setDafstbStahlRoute(e.target.value as any)}
                    className="w-1/2 text-xs font-bold p-2 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
                  >
                    <option value="standard_bof">BOF-Stahl (0,98 kg)</option>
                    <option value="gruen_eaf">EAF Grün (0,42 kg)</option>
                  </select>
                </div>
                <span className="text-[10px] text-slate-500 block">Nachweispfad &amp; Schrott-Elektroofenstahl</span>
              </div>

            </div>

            {/* Results Comparison Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Box 1: Absolute CO2-Bilanz */}
              <div className="p-4 rounded-xl border border-home-grau/30 bg-white space-y-3 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                  Gesamte Treibhausgasemissionen (A1–A3)
                </span>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Referenz (CEM I + BOF):</span>
                    <strong className="text-lg font-bold text-slate-700 line-through decoration-slate-400">
                      {dafstbCalc.refTotalGwp.toLocaleString('de-DE')} kg
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">DAfStb-Optimiert:</span>
                    <strong className="text-2xl font-black text-shiraz">
                      {dafstbCalc.optTotalGwp.toLocaleString('de-DE')} kg
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Eingespartes CO₂-Äquivalent:</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    - {dafstbCalc.diffAbs.toLocaleString('de-DE')} kg CO₂-eq
                  </span>
                </div>
              </div>

              {/* Box 2: Spezifischer Bauteil-Kennwert */}
              <div className="p-4 rounded-xl border border-home-grau/30 bg-white space-y-3 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                  Spezifischer Bauteil-Kennwert
                </span>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Referenz:</span>
                    <strong className="text-base font-bold text-slate-600">
                      {formatDeZahl(dafstbCalc.refSpecificGwp, 1)} kg / {dafstbCalc.areaUnit}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Optimiert:</span>
                    <strong className="text-2xl font-black text-emerald-700">
                      {formatDeZahl(dafstbCalc.optSpecificGwp, 1)} kg
                    </strong>
                    <span className="text-[10px] text-slate-500 block">pro {dafstbCalc.areaUnit}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">THG-Reduktionsgrad:</span>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {formatDeZahl(dafstbCalc.diffPct, 1)} % Minderung
                  </span>
                </div>
              </div>

              {/* Box 3: DAfStb Effizienzklasse */}
              <div className="p-4 rounded-xl border border-home-grau/30 bg-white space-y-3 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                    DAfStb-Einstufung
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <strong className="text-2xl font-black text-text-main">
                      {dafstbCalc.efficiencyClass}
                    </strong>
                    <span className="text-amber-500 text-sm font-bold">{dafstbCalc.classStar}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 block mt-0.5">
                    {dafstbCalc.classLabel}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  {dafstbCalc.diffPct >= 40 
                    ? '✓ Erfüllt höchste Fördervorgaben nach QNG-Premium und DGNB-Kriterium ENV 1.1.'
                    : dafstbCalc.diffPct >= 25
                    ? '✓ Erfüllt Anforderungen für QNG-Plus und ambitionierte Nachhaltigkeitskriterien.'
                    : 'Basisverbesserung. Für QNG/DGNB-Zertifizierung wird Klasse B oder A empfohlen.'}
                </div>
              </div>

            </div>

            {/* Split Comparison Bars: Concrete vs. Steel */}
            <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                Emissionsanteile nach Baustoff (Beton vs. Bewehrungsstahl)
              </span>

              <div className="space-y-2 text-xs">
                {/* Reference bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Referenz ({dafstbCalc.refTotalGwp.toLocaleString('de-DE')} kg CO₂)</span>
                    <span>Beton: {dafstbCalc.refConcreteGwpTotal.toLocaleString('de-DE')} kg | Stahl: {dafstbCalc.refSteelGwpTotal.toLocaleString('de-DE')} kg</span>
                  </div>
                  <div className="h-4 w-full rounded-md bg-slate-200 overflow-hidden flex">
                    <div 
                      className="bg-slate-500 h-full transition-all"
                      style={{ width: `${(dafstbCalc.refConcreteGwpTotal / dafstbCalc.refTotalGwp) * 100}%` }}
                      title={`Beton CEM I: ${formatDeWert(Math.round((dafstbCalc.refConcreteGwpTotal / dafstbCalc.refTotalGwp) * 100))}%`}
                    />
                    <div 
                      className="bg-rose-400 h-full transition-all"
                      style={{ width: `${(dafstbCalc.refSteelGwpTotal / dafstbCalc.refTotalGwp) * 100}%` }}
                      title={`Bewehrungsstahl BOF: ${formatDeWert(Math.round((dafstbCalc.refSteelGwpTotal / dafstbCalc.refTotalGwp) * 100))}%`}
                    />
                  </div>
                </div>

                {/* Optimized bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span className="font-bold text-emerald-800">Optimiert ({dafstbCalc.optTotalGwp.toLocaleString('de-DE')} kg CO₂)</span>
                    <span>Beton: {dafstbCalc.optConcreteGwpTotal.toLocaleString('de-DE')} kg | Stahl: {dafstbCalc.optSteelGwpTotal.toLocaleString('de-DE')} kg</span>
                  </div>
                  <div className="h-4 w-full rounded-md bg-slate-200 overflow-hidden flex">
                    <div 
                      className="bg-emerald-600 h-full transition-all"
                      style={{ width: `${(dafstbCalc.optConcreteGwpTotal / dafstbCalc.refTotalGwp) * 100}%` }}
                      title={`Beton optimiert: ${formatDeWert(dafstbCalc.optConcreteGwpTotal)} kg`}
                    />
                    <div 
                      className="bg-teal-500 h-full transition-all"
                      style={{ width: `${(dafstbCalc.optSteelGwpTotal / dafstbCalc.refTotalGwp) * 100}%` }}
                      title={`Bewehrungsstahl optimiert: ${formatDeWert(dafstbCalc.optSteelGwpTotal)} kg`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600"></span>
                  <span>Beton optimiert ({formatDeWert(dafstbCalc.optConcreteGwpPerM3)} kg/m³)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-teal-500"></span>
                  <span>Bewehrungsstahl ({dafstbStahlRoute === 'gruen_eaf' ? 'EAF Grün 0,42 kg/kg' : 'BOF Standard 0,98 kg/kg'})</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto font-mono">
                  Betonvolumen: {formatDeZahl(dafstbCalc.optBetonVol, 1)} m³ (Ref: {formatDeZahl(dafstbCalc.refBetonVol, 1)} m³)
                </div>
              </div>
            </div>

            {/* Praxis- & Bemessungsempfehlungen */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 text-xs text-slate-700 space-y-2">
              <strong className="font-bold text-shiraz flex items-center gap-1.5">
                <CheckCircle2 size={15} /> Tragwerksplanerische Umsetzung nach DAfStb in der Praxis:
              </strong>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 leading-relaxed text-[11px]">
                <li>
                  <strong>Leistungsphase 2 &amp; 3 (Entwurf):</strong> Festlegung des Zielwertes <InlineMath math="GWP_{\text{Ziel}}" /> in der Tragwerksausschreibung und Wahl des Tragsystems (Hohlkörper, Vorspannung oder hochfeste Querschnitte).
                </li>
                <li>
                  <strong>Leistungsphase 6 (Vorbereitung Vergabe):</strong> Formulierung der Betonbestellung nach DIN EN 206 / DIN 1045-2 unter Nennung von <InlineMath math="\text{CEM III/A}" /> bzw. <InlineMath math="\text{CEM II/C-M}" /> sowie <strong>Prüfalter 56 Tage</strong> für den statischen Festigkeitsnachweis.
                </li>
                <li>
                  <strong>Ausführung &amp; Bauleitung:</strong> Einhaltung der verlängerten Ausschalfristen und Überwachung der Nachbehandlungsdauer nach DIN EN 13670 (Nachbehandlungsklasse 3 oder 4) zum dauerhaften Schutz der Betondeckung vor Frühkarbonatisierung.
                </li>
              </ul>
            </div>
          </div>

          {/* Formelsammlung DAfStb */}
          <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <BookOpen className="text-shiraz" size={18} /> Normative Berechnungsformeln der DAfStb-Richtlinie
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-2">
                <strong className="text-xs font-bold text-slate-900 block">
                  1. Treibhausgasbilanz des Bauteils (Modul A1–A3)
                </strong>
                <BlockMath math="GWP_{\text{Bauteil}} = V_{\text{c}} \cdot gwp_{\text{c}} + m_{\text{s}} \cdot gwp_{\text{s}} \quad [\text{kg CO}_2\text{-eq}]" />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Mit <InlineMath math="V_{\text{c}}" /> als Betonvolumen in <InlineMath math="\text{m}^3" />, <InlineMath math="gwp_{\text{c}}" /> als spezifischem Beton-GWP in <InlineMath math="\text{kg CO}_2\text{-eq}/\text{m}^3" />, <InlineMath math="m_{\text{s}}" /> als Bewehrungsmasse in <InlineMath math="\text{kg}" /> und <InlineMath math="gwp_{\text{s}}" /> als Stahl-GWP in <InlineMath math="\text{kg CO}_2\text{-eq}/\text{kg}" />.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-2">
                <strong className="text-xs font-bold text-slate-900 block">
                  2. Spezifischer Bauteil-Emissionswert
                </strong>
                <BlockMath math="gwp_{\text{Fläche}} = \frac{GWP_{\text{Bauteil}}}{A_{\text{Bauteil}}} \quad [\text{kg CO}_2\text{-eq}/\text{m}^2]" />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Bezug auf die Bauteilfläche <InlineMath math="A_{\text{Bauteil}}" /> (Decken, Wände, Bodenplatten) oder Bauteillänge <InlineMath math="L" /> (Stützen, Unterzüge) zur normativen Prüfung gegen die DAfStb-Referenzwerte.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-2">
                <strong className="text-xs font-bold text-slate-900 block">
                  3. Relativer Minderungswert der Effizienzklasse
                </strong>
                <BlockMath math="\Delta_{\text{THG}} = \left( 1 - \frac{GWP_{\text{opt}}}{GWP_{\text{ref}}} \right) \cdot 100 \quad [\%]" />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Bestimmt die Einstufung in die DAfStb-Effizienzklassen A+ (&ge; 50%), A (40–49%), B (25–39%), C (10–24%) gegenüber dem Referenztragwerk.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-2">
                <strong className="text-xs font-bold text-slate-900 block">
                  4. Äquivalenter Wasserzementwert mit k-Wert (DIN 1045-2)
                </strong>
                <BlockMath math="(w/c)_{\text{eq}} = \frac{w}{c + k \cdot z} \quad \text{mit } k_{\text{FA}} = 0{,}4; \: k_{\text{HS}} = 0{,}6" />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Erlaubt die normative Anrechnung von Flugasche (FA) und Hüttensandmehl (HS) als zementersetzende Zusatzstoffe Typ II zur Klinkerreduktion.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- Detailed Pflanzenkohle Infobox Modal --- */}
      {showPflanzenkohleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-rose-200 overflow-hidden flex flex-col my-8 animate-scale-in max-h-[85vh] font-sans">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-shiraz via-fuchsia-900 to-slate-950 p-6 text-white flex justify-between items-start">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/20 text-shiraz-300 border border-rose-500/30 text-xxs font-bold uppercase tracking-wider">
                  <Trees size={12} /> Klimapositiver Betonzuschlag
                </div>
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight">
                  Pyrogene Pflanzenkohle im Betongefüge
                </h3>
                <p className="text-fuchsia-200/80 text-xs font-normal">
                  Wissenschaftliche Hintergründe zur Kohlenstoffsenke im Tragwerk
                </p>
              </div>
              <button 
                onClick={() => setShowPflanzenkohleModal(false)}
                className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 transition-all text-xs font-bold cursor-pointer"
              >
                ✕ Schließen
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-700 leading-relaxed text-sm select-none">
              
              {/* Bento Grid: Core Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100 flex flex-col justify-between text-center">
                  <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block mb-1">CO₂-Bindungspotenzial</span>
                  <strong className="text-xl font-black text-rose-900">~ 2,5 - 3,0 t</strong>
                  <span className="text-[10px] text-slate-500 block leading-snug mt-1">CO₂-Äq lagern dauerhaft pro 1 t reiner Pflanzenkohle</span>
                </div>
                <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 flex flex-col justify-between text-center">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest block mb-1">Gefüge-Hydratation</span>
                  <strong className="text-xl font-black text-blue-900">Internal Curing</strong>
                  <span className="text-[10px] text-slate-500 block leading-snug mt-1">Porenspeicher mindert Schwindrisse signifikant</span>
                </div>
                <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100 flex flex-col justify-between text-center">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-1">Empfohlene Dosierung</span>
                  <strong className="text-xl font-black text-amber-900">2% bis 5%</strong>
                  <span className="text-[10px] text-slate-500 block leading-snug mt-1">bezogen auf das Zementgewicht als inerte Feinstsubstitution</span>
                </div>
              </div>

              {/* Carbon sink mechanism */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-rose-900 uppercase tracking-widest flex items-center gap-1 font-mono">
                  <Leaf size={14} className="text-shiraz" /> 1. Wie funktioniert die dauerhafte Carbon-Senke?
                </h4>
                <p className="text-slate-600 text-xs font-normal">
                  Bäume entziehen der Luft während des Wachstums Kohlendioxid. Stirbt der Baum oder verrottet Holzschutt, geht das CO₂ zurück in die Atmosphäre. 
                  Durch die <strong>thermochemische Pyrolyse</strong> (Erhitzung unter Sauerstoffentzug bei 500 °C bis 800 °C) wird der biologische Kohlenstoff hochgradig in aromatische Kohlenstoffringe strukturiert. Über Jahrhunderte ist diese feste Kohle resistent gegen Verrottung (inert). 
                  Wird dieser stabilisierte Kohlenstoff homogen im Zementstein des Betons umschlossen, entsteht ein künstliches, unlösliches Endlager im Fundament oder der Decke.
                </p>
              </div>

              {/* Physikalisch-chemischer Mechanismus */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <h5 className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                    <Activity size={12} className="text-blue-600" /> Gefüge-Vorteil (Internal Curing)
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-normal font-normal">
                    Pflanzenkohle besitzt eine enorme spezifische Oberfläche (bis zu 350 m²/g) und ein ausgeprägtes Porensystem. Beim Betonmischen saugt sie überschüssiges Anmachwasser auf und speichert es. 
                    Während der 28-tägigen Hydratation (Erstarren des Zements) gibt sie dieses Wasser langsam wieder ab. Dies sichert eine konstante Feuchte im Mikromilieu und verhindert autogenes Schwinden und Mikrorisse.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                    <Calculator size={12} className="text-amber-600" /> Praktisches Rechenbeispiel
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-normal font-normal">
                    Ein Standardbeton C25/30 verursacht ca. 240 kg CO₂ pro Kubikmeter. 
                    Substituiert man 10 kg Feinstsand durch 10 kg hochaktive Pflanzenkohle (Erhöhung des Biochar-Anteils um ca. 3% des Zementgewichts), filtert und bindet diese Menge rechnerisch rund **25 bis 30 kg CO₂** im Bauteil. 
                    Damit reduziert sich die herstellungsbedingte Gesamtbilanz auf einen Schlag um <strong>über 10 %</strong>!
                  </p>
                </div>
              </div>

              {/* Bautechnische Anforderungen */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-rose-950 uppercase tracking-widest flex items-center gap-1 font-mono">
                  <AlertTriangle size={14} className="text-rose-700" /> 2. Technische Herausforderungen im Betonwerk
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-red-50/30 rounded-xl border border-red-100 space-y-1">
                    <span className="font-extrabold text-xs text-rose-900 block">Extreme Feuchtekorrektur</span>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Aufgrund der hohen Porosität der Kohle muss das wirksame Wasser beim Mischen peinlichst korrigiert werden. Geschieht dies nicht, entzieht die Kohle dem Zementleim das Hydratationswasser und bricht das Ausbreitmaß (Konsistenz) ein.
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50/25 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-extrabold text-xs text-indigo-900 block">k-Wert &amp; anrechenbarer Anteil</span>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Pflanzenkohle dient als inerter Zusatzstoff (Typ I). Sie besitzt keine hydraulischen oder nennenswert puzzeolane Eigenreaktionen, weswegen die Festigkeitsklasse geringfügig absinken kann. Ihre Korngrößenverteilung muss präzise auf die Fuller-Sieblinie abgestimmt sein.
                    </p>
                  </div>
                </div>
              </div>

              {/* Zulassungs- und Prüfsituation */}
              <div className="p-4 bg-shiraz/5 text-rose-950 rounded-xl border border-rose-200/40 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-shiraz block font-mono">Normative Einordnung &amp; Zertifizierung</span>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  Pflanzenkohle fällt derzeit noch nicht unter das Standardregelwerk der DIN EN 206 (kein genormter Typ-II-Zusatzstoff). Für tragende Teile ist eine **Zustimmung im Einzelfall (ZiE)** oder eine vorzeitige bauaufsichtliche Zulassung (abZ) erforderlich. 
                  Die Zertifizierung über das <strong>European Biochar Certificate (EBC-Bau)</strong> garantiert, dass die Aktivkohle schadstofffrei ist (Einheit über polyzyklische aromatische Kohlenwasserstoffe - PAKs) und unbedenklich verbaut werden darf.
                </p>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowPflanzenkohleModal(false)}
                className="bg-shiraz hover:bg-shiraz text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition-all hover:shadow-md cursor-pointer"
              >
                Verstanden &amp; Schließen ✓
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Treibhausgas einer Stahlbetondecke je m² – Standard gegen optimiert"
        zielGleichung="\text{GWP} = V_c \cdot \text{gwp}_c + m_s \cdot \text{gwp}_s"
        schritte={[
          { titel: 'Standard', erklaerung: 'Vollplatte 20 cm, C25/30 mit CEM I (Lehrwert 245 kg CO₂-Äq./m³), Bewehrung 20 kg/m² (Elektrostahl, Lehrwert 0,7 kg CO₂-Äq./kg):', formel: '0{,}20 \\cdot 245 + 20 \\cdot 0{,}7 = 49{,}0 + 14{,}0 = 63{,}0\\,\\text{kg CO}_2\\text{-Äq./m}^2' },
          { titel: 'Optimiert', erklaerung: 'Hohlkörperdecke mit 25 % weniger Beton (0,15 m³/m²), CEM III/A (174 kg CO₂-Äq./m³), Bewehrung 18 kg/m²:', formel: '0{,}15 \\cdot 174 + 18 \\cdot 0{,}7 = 26{,}1 + 12{,}6 = 38{,}7\\,\\text{kg CO}_2\\text{-Äq./m}^2' },
          { titel: 'Einsparung', erklaerung: 'Relative Minderung:', formel: '\\frac{63{,}0 - 38{,}7}{63{,}0} = 39\\,\\%' }
        ]}
        ergebnisHinweis="Geometrie (Masse) und Zementart wirken multiplikativ. Tragfähigkeit, Durchstanzen, Schall- und Brandschutz der Hohlkörperdecke sind gesondert nachzuweisen."
        normQuelle="Lehrwerte; Projektwerte aus EPD (DIN EN 15804+A2) bzw. ÖKOBAUDAT"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Äquivalenter w/z-Wert mit Flugasche"
        zielGleichung="(w/z)_{eq} = \frac{w}{z + k_f \cdot f}"
        schritte={[
          { titel: 'Rezeptur', erklaerung: 'Wasser 165 kg/m³, Zement 280 kg/m³, Flugasche 60 kg/m³, k_f = 0,4:', formel: 'w = 165,\\; z = 280,\\; f = 60' },
          { titel: 'Anrechenbarer Bindemittelgehalt', erklaerung: 'Flugasche wird nur mit dem k-Wert angerechnet:', formel: 'z + 0{,}4 \\cdot 60 = 304\\,\\text{kg/m}^3' },
          { titel: 'Äquivalenter w/z-Wert', erklaerung: 'Vergleich mit Grenzwerten der Expositionsklassen (z. B. XC4: max. 0,60):', formel: '(w/z)_{eq} = \\frac{165}{304} = 0{,}54 \\le 0{,}60' }
        ]}
        ergebnisHinweis="Der k-Wert-Ansatz erlaubt Klinkereinsparung ohne Dauerhaftigkeitsverlust. Für Hüttensandmehl ist er in Deutschland nur eingeschränkt anwendbar; Höchstmengen an Flugasche je Zementart sind zu beachten."
        normQuelle="DIN EN 206:2021-06 / DIN 1045-2:2023-08 (k-Wert-Ansatz)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="materialoptimierung" />

      {/* --- Module Footer --- */}
      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 7 Nachhaltigkeit: Bilanzformeln, k-Wert-Ansatz und Quellen geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: "Deutscher Ausschuss für Stahlbeton", url: "https://de.wikipedia.org/wiki/Deutscher_Ausschuss_f%C3%BCr_Stahlbeton" },
          { title: "Bionik", url: "https://de.wikipedia.org/wiki/Bionik" },
          { title: "Carbonbeton", url: "https://de.wikipedia.org/wiki/Carbonbeton" },
          { title: "Materialeffizienz", url: "https://de.wikipedia.org/wiki/Materialeffizienz" }
        ]}
        literatur={[
          "Deutscher Ausschuss für Stahlbeton (DAfStb): DAfStb-Richtlinie Treibhausgasreduzierte Tragwerke aus Beton, Stahlbeton oder Spannbeton – Teil 1: Grundlagen und Nachweis am gesamten Tragwerk; Teil 2: Deckenbauteile. Ausgabe August 2024. Berlin: DIN Media 2024",
          "Sobek, W.: non nobis – über das Bauen in der Zukunft. Band 1: Ausgehen muss man von dem, was ist. Stuttgart: av edition 2022",
          "Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011",
          "Stark, J.; Wicht, B.: Dauerhaftigkeit von Beton. 2. Aufl., Berlin: Springer Vieweg 2013"
        ]}
        regelwerke={[
          { title: "DAfStb-Richtlinie Treibhausgasreduzierte Tragwerke aus Beton, Stahlbeton oder Spannbeton (Teile 1 und 2), Ausgabe August 2024", url: "https://www.dafstb.de/" },
          { title: "DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (Eurocode 2); neue Generation DIN EN 1992-1-1:2025-09" },
          { title: "DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton – Festlegung, Eigenschaften, Herstellung und Konformität; Neuausgaben DIN EN 206-1 und -2:2026-07 erschienen)" },
          { title: "DIN EN 13670 / DIN 1045-3 (Ausführung von Tragwerken aus Beton)" },
          { title: "VDI 4800 Blatt 1: Ressourceneffizienz - Methodische Grundlagen, Prinzipien und Strategien" }
        ]}
        formeln={[
          {
            formel: "GWP_{\\text{Bauteil}} = V_{\\text{c}} \\cdot gwp_{\\text{c}} + m_{\\text{s}} \\cdot gwp_{\\text{s}} \\quad [\\text{kg CO}_2\\text{-eq}]",
            erklaerung: "Treibhausgasbilanzierung von Stahlbetonbauteilen über Beton- und Bewehrungsstahlanteile (Modul A1–A3).",
            quelle: "Bilanzierung nach DIN EN 15804+A2 / DIN EN 15978 (Module A1–A3)"
          },
          {
            formel: "(w/c)_{\\text{eq}} = \\frac{w}{c + k \\cdot z} \\quad [\\text{k-Wert nach DIN 1045-2}]",
            erklaerung: "Äquivalenter Wasserzementwert zur Anrechnung von Flugasche (k = 0,4) und Silikastaub (k = 1,0); für Hüttensandmehl nach DIN EN 15167-1 enthält DIN 1045-2:2023-08 einen eigenen k-Wert-Ansatz (Abschn. 5.2.5.2.5).",
            quelle: "DIN 1045-2 / DIN EN 206"
          },
          {
            formel: "\\eta_{\\text{Material}} = \\frac{m_{\\text{Soll}}}{m_{\\text{Ist}}} \\cdot 100 \\quad [\\%]",
            erklaerung: "Materialnutzungsgrad zur Quantifizierung bionischer oder topologieoptimierter Leichtbaustrukturen.",
            quelle: "VDI 4800 Blatt 1"
          },
          {
            formel: "\\Delta G = \\left(1 - \\frac{\\rho_{\\text{leicht}}}{\\rho_{\\text{standard}}}\\right) \\cdot 100 \\quad [\\%]",
            erklaerung: "Gewichtseinsparungsquote bei Substitution von Normalbeton durch gradierte Strukturen oder Leichtzuschlagstoffe.",
            quelle: "Massivbau-Leichtbaupraxis"
          }
        ]}
      />

    </div>
  );
}
