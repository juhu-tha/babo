import React, { useState } from 'react';
import { 
  Trash2, 
  Recycle, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  FileCheck, 
  BookOpen, 
  ArrowRight, 
  HelpCircle, 
  Info, 
  Clock, 
  Hammer, 
  FileText, 
  Building,
  RotateCcw,
  ShieldCheck,
  TrendingDown,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';

// Define TS Types for the components
interface Pollutant {
  name: string;
  chemical: string;
  foundIn: string;
  probability: 'Sehr hoch' | 'Hoch' | 'Mittel' | 'Gering';
  handling: string;
  rules: string;
}

interface EraData {
  title: string;
  description: string;
  dominantMaterials: string[];
  pollutants: Pollutant[];
}

const baustoffRecyclingData = [
  {
    name: "Beton & Betonerzeugnisse",
    avv: "17 01 01",
    rating: "Sehr hoch",
    percentage: 95,
    subtitle: "Wichtigste stoffliche Fraktion der mineralischen Ersatzbaustoffe im Hoch- und Tiefbau",
    process: "Brechen (Prallbrecher), Absieben in definierte Fraktionen (0/4, 4/8, 8/16, 16/32), Nassklassierung zur Leichtstoffabtrennung, Magnetscheidung für Bewehrungsstahl.",
    useCases: [
      "Zuschlag für R-Beton im Hochbau (Ersatz von Primärkies bis zu 35/45 Gew.-% nach DIN EN 206 / DIN 1045-2).",
      "Ungebundene Tragschichten im Straßenbau (Frostschutzschichten) nach Ersatzbaustoffverordnung (EBV) Güteklasse RC-1 / RC-2.",
      "Asphaltproduktions-Zuschlagstoffe (feine Gesteinsmehle)."
    ],
    risks: "Anhaftender Gipsputz (Gefahr von Ettringittreiben), organische Anhaftungen (Holz, Kunststoffe), Farbanstriche (historisch asbesthaltig oder bleihaltig), Karbonatisierungstiefe.",
    regulations: "Ersatzbaustoffverordnung (EBV) 2023: Zuweisung zu den Einbauklassen (BM-0, BM-F1 bis BM-F3) bestimmt die zulässigen hydrogeologischen Einbaubedingungen."
  },
  {
    name: "Ziegel & Mauerwerk",
    avv: "17 01 02",
    rating: "Hoch",
    percentage: 85,
    subtitle: "Wertstoffpotenzial aus dem traditionellen Massivbau",
    process: "Schonende Zerkleinerung zur Vermeidung zu hoher Feinanteile, Windsichtung zur Abscheidung von Mörtelsand und Leichtfraktionen.",
    useCases: [
      "Produktion von Vegetationssubstraten für extensive und intensive Dachbegrünungen (hohe Wasserspeicherkapazität).",
      "Zusatzstoff für Tennissand und Sportplatzböden.",
      "Leichtzuschlag für wärmedämmende R-Ziegel (geschlossener Kreislauf im Ziegelwerk).",
      "Unterbau im Erd- und Wegebau (EBV-Klasse Ziegelmaterial)."
    ],
    risks: "Sulphathaltige Mörtelreste (Gipsmörtel). Gips im Ziegel führt bei Recycling-Einsatz im Beton zu enormen Quellschäden. Dämmmörtel-Anhaftungen.",
    regulations: "GewAbfV § 3 Abs. 1 verlangt die getrennte Erfassung von Ziegeln an der Anfallstelle, um biologisch-chemische Restkontaminationen zu minimieren."
  },
  {
    name: "Gips- und Calciumsulfatbaustoffe",
    avv: "17 08 02",
    rating: "Hoch (theoretisch) / Gering (praktisch)",
    percentage: 35,
    subtitle: "Kritischer Störstoff im Bauschutzkreislauf mit hohem Upcycling-Potenzial",
    process: "Strikte manuelle Demontage vor dem Rohbauabbruch, mechanisches Mahlen und anschließende thermische Entwässerung (Kalzinierung) zu Stuckgips in speziellen RC-Gipswerken.",
    useCases: [
      "Vollständiges stoffliches Recycling zu neuen Gipskartonplatten (geschlossener Produktkreislauf).",
      "Bodenverbesserer in der Landwirtschaft (Calciumsulfat als Schwefelquelle).",
      "Abbinderegler in der Zementindustrie (Begrenzt auf saubere Monofraktionen)."
    ],
    risks: "Gips ist der schädlichste Störstoff im mineralischen Recycling! Durch Wasserzutritt bildet sich Ettringit ('Gipstreiben'), das Beton und Asphalt sprengt. Staubentwicklung beim Abbruch bindet Feuchtigkeit.",
    regulations: "DepV: Gips darf aufgrund des Sulfatgehalts nicht auf DK-0-Deponien ohne Abdichtung abgelagert werden. Ersatzbaustoffverordnung schränkt Gips im Gemisch drastisch ein."
  },
  {
    name: "Holz (Altholz)",
    avv: "17 02 01",
    rating: "Sehr hoch (A I - A II) / Thermisch (A III - A IV)",
    percentage: 90,
    subtitle: "Regenerativer Baustoff mit anspruchsvoller Schadstoff-Kaskadierung",
    process: "Sortierung nach Altholzverordnung (AltholzV) in die Kategorien A I bis A IV. Mechanisches Schreddern, Metallabscheidung, optische Sortierung zur Fremdstoffbeseitigung.",
    useCases: [
      "Stoffliche Verwertung (A I & A II): Rohstoff für die Spanplatten- und Holzwerkstoffindustrie (Kreislaufwirtschaft).",
      "Thermische Verwertung (A III & A IV): Energetische Nutzung in Biomasseheizkraftwerken mit zertifizierter Rauchgasreinigung.",
      "Koppelnutzung: Einsatz im temporären Holzbau (Wiederverwendung von Balken)."
    ],
    risks: "Holzschutzmittel (PCP, Lindan, DDT, kupfer- und chromhaltige Salze), Teeröle (Karbolineum) im Außenbereich (Bahnschwellen, Pfähle). Halogenorganische Verbindungen in Beschichtungen.",
    regulations: "Altholzverordnung (AltholzV): Regelt die Einstufung und schließt belastetes Holz der Kategorie A IV von der stofflichen Verwertung rigoros aus."
  },
  {
    name: "Baustahl & Bewehrung",
    avv: "17 04 05",
    rating: "Nahezu 100%",
    percentage: 99,
    subtitle: "Das Paradebeispiel für echtes geschlossenes Metall-Upcycling",
    process: "Magnetscheidung aus dem Brecherstrom, Schopfscherenzerkleinerung, Einschmelzen im Elektrolichtbogenofen (EAF) unter Beigabe von Schlackenbildnern zur Raffination.",
    useCases: [
      "100%iges Reproduzieren von neuem Betonstahl, Profilstahl oder Blechen mit exakt identischen mechanisch-physikalischen Eigenschaften.",
      "Maschinenbauteile und Gussprodukte."
    ],
    risks: "Geringe Schadstoffrisiken. Beschichtungen (historisch bleihaltiger Korrosionsschutz wie Bleimennige), Zinkanhaftungen (erfordern Filterung des Zinkstaubs im Elektroofen-Rauchgas)."
  },
  {
    name: "Flachglas & Fensterscheiben",
    avv: "17 02 02",
    rating: "Mittel",
    percentage: 50,
    subtitle: "Gefügiger Werkstoff mit hohen Reinheitsanforderungen an den Schmelzprozess",
    process: "Manueller Scheibenausbau aus dem Holz-/Kunststoffrahmen. Aufmahlen, optoelektronische Trennung nach Farbreinheit, Entfernung von Metall- und Folienresten.",
    useCases: [
      "Wiederaufladung der Floatglas-Produktion (Sparen von Schmelzenergie um ca. 25% bei Scherbeneinsatz).",
      "Blähglas-Herstellung (hochwertiger wärmedämmender Leichtzuschlagstoff).",
      "Rohstoff für Dämmmaterialien (Glaswolle).",
      "Zuschlagstoff in der Fliesen- und Sanitärkeramikindustrie."
    ],
    risks: "Verbundsicherheitsglas (VSG): Die zähelastische Polyvinylbutyral-Folie (PVB) haftet extrem fest am Glas und erfordert Spezial-Schälmühlen. Blei- oder Cadmiumschichten bei historischen Bedruckungen.",
    regulations: "Bayerischer LfU-Rückbauleitfaden fordert den Ausbau der kompletten Fensterbaugruppe vor dem maschinellen Abbruch."
  },
  {
    name: "Kunststoffe & Dämmstoffe",
    avv: "17 02 03",
    rating: "Gering bis Mittel",
    percentage: 25,
    subtitle: "Komplizierte Verbundstrukturen und historische Schadstoff-Altlasten",
    process: "Sortenreine Erfassung (Hart-PVC, PE, PP). Mechanisches Zerkleinern und Extrudieren (Regranulierung). Chemisches Recycling (z. B. lösungsmittelbasiertes CreaSolv-Verfahren für Polystyrol).",
    useCases: [
      "Einsatz im Fensterprofilbau (Co-Extrusion von Neukunststoff mit RC-Kern, Cradle-to-Cradle).",
      "Kabelkanäle, Abstandshalter und baustellenspezifische Spritzgussteile.",
      "Ersatzbrennstoff in Zementwerken (Thermische Verwertung hochkalorischer, zersplitterter Fraktionen)."
    ],
    risks: "Hexabromcyclododecan (HBCD) in Dämmstoffen des Typs EPS/XPS vor Baujahr 2014 (Flammschutzmittel, giftig/schädlich). Weichmacher (Phthalate in PVC-Böden, chlorierte Paraffine).",
    regulations: "POP-Verordnung der EU: Dämmstoffe mit > 1000 mg/kg HBCD gelten als persistente organische Abfälle und müssen in zugelassenen Müllverbrennungsanlagen zerstört werden."
  },
  {
    name: "Teerfreie Bitumenmischungen (Asphalt)",
    avv: "17 03 02",
    rating: "Sehr hoch",
    percentage: 92,
    subtitle: "Ressourcenschonung im Verkehrswegebau",
    process: "Kaltfräsen im Straßenoberbau, mechanisches Brechen des Rückbauträgers, thermische Vorerwärmung in Asphaltmischwerken (Paralleltrommel) unter kontrollierter Sauerstoffzufuhr.",
    useCases: [
      "Direkte stoffliche Heißzugabe von Asphaltgranulat (bis zu 60% im Asphaltmischwerk für Trag-, Binder- und Deckschichten).",
      "Ungebundener Frostschutz- und Schotterunterbau nach Ersatzbaustoffverordnung (Klasse RC-Asphalt)."
    ],
    risks: "Verwechslungsgefahr mit teer- und pechhaltigen Mischungen (AVV 17 03 01*, enthalten krebserregendes PAK). Geringfügige Asphaltkleberrückstände müssen PAK-frei sein.",
    regulations: "Ersatzbaustoffverordnung (EBV) regelt Grenzwerte für PAK-Auswaschungen. Teerhaltiges Material darf auf keinen Fall wieder eingebaut werden."
  }
];

export default function Rueckbau() {
  const [activeTab, setActiveTab] = useState<'lfu_leitfaden' | 'schadstoffe' | 'baustoffrecycling' | 'rechner' | 'aktualitaet' | 'praxis'>('lfu_leitfaden');
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [selectedEra, setSelectedEra] = useState<'pre1970' | 'era1970_1990' | 'post1990'>('pre1970');
  const [selectedRecyclingMaterial, setSelectedRecyclingMaterial] = useState<number>(0);
  
  // Rechner states
  const [buildingVolume, setBuildingVolume] = useState<number>(2500); // m³
  const [structureType, setStructureType] = useState<'concrete' | 'masonry' | 'timber' | 'composite'>('masonry');
  const [showCalculations, setShowCalculations] = useState<boolean>(false);

  // LfU 5-Phase selective dismantling process definitions
  const processPhases = [
    {
      num: 1,
      title: 'Bestandsaufnahme & Historische Erkundung',
      subtitle: 'Voruntersuchung & Archivrecherche',
      description: 'Zusammentragen von Altunterlagen (Statik, Pläne, Baugenehmigungen), Baujahr-Recherche und Analyse früherer Nutzungen (z.B. Gewerbebetriebe mit Ölen, Lösungsmitteln). Erstbegehung zur Feststellung von offensichtlich schadstoffverdächtigen Bauteilen.',
      checklists: [
        'Prüfung der Bauakte (Baujahr, Umbauten, Sanierungen)',
        'Ermittlung früherer Funktionen (z.B. chemische Reinigung, Werkstatt, Zahnarzt)',
        'Erfassen sichtbarer Schadstoffe (Leuchtstoffröhren, Kondensatoren, Asbestwellplatten)',
        'Erste Abstimmung mit der Kreisverwaltungsbehörde (Landratsamt/kreisfreie Stadt)'
      ],
      lfuStandard: 'Leitfaden Kap. 2.1: Grundlage für das weitere Vorgehen ist die lückenlose Dokumentation der Nutzungsgeschichte.'
    },
    {
      num: 2,
      title: 'Schadstoffkataster & Rückbaukonzept',
      subtitle: 'Baustoff- und Schadstoffinventar',
      description: 'Systematische Beprobung aller fraglichen Materialien durch akkreditierte Gutachter. Erstellung eines Schadstoffkatasters nach VDI 6202 Blatt 1 sowie eines strukturierten Rückbau- und Entsorgungskonzepts, das Mengen, Schadstoffklassen und Ziel-Recycling-Anlagen festlegt.',
      checklists: [
        'Probenahme von Wandputzen, Fliesenklebern (Asbestverdacht) und Fugendichtungsmassen (PCB)',
        'Quantifizierung aller schadstoffhaltigen Abfälle (Einstufung nach AVV)',
        'Erstellung des Abbruch- und Rückbaukonzepts (Anzeige bei der Unteren Bauaufsichtsbehörde)',
        'Ausarbeitung von Arbeits- und Sicherheitsplänen (AaS) gem. TRGS 524 / DGUV Regel 101-004'
      ],
      lfuStandard: 'Leitfaden Kap. 2.2: Beprobungspflicht für Lacke, Estriche, Kleber und künstliche Mineralfasern (KMF) vor Vergabe von Abbruchleistungen.'
    },
    {
      num: 3,
      title: 'Schadstoffsanierung & Entfrachtung',
      subtitle: 'Ausbau schadstoffbelasteter Bauteile vor dem Abbruch',
      description: 'Sämtliche Gefahrstoffe müssen staubdicht abgereiht, unter Unterdruckbedingungen ausgebaut und separat verpackt und entsorgt werden. Erst nach erfolgreicher Freigabemessung darf der mineralische Abbruch (Rohbauabbruch) beginnen, um Kreuzkontaminationen zu verhindern.',
      checklists: [
        'Fachgerechte Sanierung von Asbest (TRGS 519) und KMF (TRGS 521) durch zertifizierte Fachbetriebe',
        'Separierte Verpackung (z.B. Asbest in BigBags, KMF in staubdichten Säcken)',
        'Ausschleusen aus dem Gebäude, Vorlegen der Entsorgungsbelege (eANV für gefährliche Abfälle)',
        'Freigabe und Staubprüfung des entfrachteten Rohbaus'
      ],
      lfuStandard: 'Leitfaden Kap. 3.1 & 4.1: Eine Kontamination unbelasteten Bauschutts durch Schadstoffe beim Abbruch ist durch strikte Trennung zu verhindern.'
    },
    {
      num: 4,
      title: 'Sortenreiner Rückbau & Demontage',
      subtitle: 'Der selektive Rohbau-Rückbau',
      description: 'Der tatsächliche mineralische Abbruch erfolgt "von oben nach unten" und "von innen nach außen". Die Getrennthaltungspflichten der Gewerbeabfallverordnung (GewAbfV) greifen hier strikt: Ziegel, Beton, Holz, Metalle und Kunststoffe werden getrennt erfasst.',
      checklists: [
        'Abbruch in koordinierten Phasen: Zuerst Dachstuhl (Holz), dann nichttragendes Mauerwerk, zuletzt Stahlbetontragwerk',
        'Strikte stoffliche Trennung unmittelbar an der Abbruchstelle (keine Mischcontainer!)',
        'Gewährleistung von Staub- und Lärmschutz (Wasserberieselung zum Binden feiner Partikel)',
        'Erhalt von recyclingfähigem, hochwertigem Bauschutt zur Aufbereitung in RC-Großanlagen'
      ],
      lfuStandard: 'Leitfaden Kap. 4.2: Demontage von Fensterrahmen, Gipskarton und Bitumenbahnen ist zwingend vor dem Betonabbruch auszuführen.'
    },
    {
      num: 5,
      title: 'Aufbereitung, Verwertung & Deponierung',
      subtitle: 'Umgang mit den Abbruchstoffen',
      description: 'Der gewonnene mineralische Bauschutt wird zu güteüberwachtem Recycling-Baustoff (RC-Baustoffe) gebrochen und gesiebt. Nicht verwertbare Reststoffe (z.B. Gipsstaub, stark kontaminierte Mineralik) werden ordnungsgemäß auf Deponien (DK 0 bis DK III) entsorgt.',
      checklists: [
        'Transport mit Entsorgungsnachweisen an zugelassene stationäre oder mobile Recyclinganlagen',
        'Prüfung der Einbaufähigkeit nach der neuen Ersatzbaustoffverordnung (EBV) 2023',
        'Deponierung unlösbarer mineralischer Verbundstoffe unter Einhaltung der Grenzwerte der DepV',
        'Abschließende Dokumentation und Einreichen des Verwertungsnachweises bei den Aufsichtsbehörden'
      ],
      lfuStandard: 'Leitfaden Kap. 5 & 6: Bevorzugung von gütegesichertem RC-Material im Straßen- und Erdbau. Letzte Instanz ist die Deponie.'
    }
  ];

  // Era-based pollutant matrix data (LfU-specific & TRGS rules)
  const eraPollutants: Record<'pre1970' | 'era1970_1990' | 'post1990', EraData> = {
    pre1970: {
      title: 'Bis 1970 (Hochrisiko-Epoche)',
      description: 'In dieser Phase gab es kaum Einschränkungen für asbesthaltige Baustoffe, Steinkohlenteer-Produkte und hochgiftige Holzschutzmittel. Viele Schadstoffe sind unsichtbar im Putz, Estrich, Bitumen oder in Fugendichtungen verbaut.',
      dominantMaterials: ['Naturwerksteine, Ziegelmauerwerk', 'Bimsbeton, Schlackenbeton als Füllstoffe', 'Gerade und genietete Stahlträger', 'Erste Generation von Stahlbetonplatten (dünne Decken)'],
      pollutants: [
        {
          name: 'Asbest (fest & schwach gebunden)',
          chemical: 'Silikatminerale (Chrysolit, Krokydolith)',
          foundIn: 'Faserzementplatten (Eternit), Spritzasbest an Trägern, Fliesenkleber, Putz, Fensterkitte.',
          probability: 'Sehr hoch',
          handling: 'Staubfreier Ausbau unter Unterdruck, Personenschleusen, Vollschutz, TRGS 519 Zertifikat zwingend.',
          rules: 'Gefahrstoffverordnung (GefStoffV), TRGS 519'
        },
        {
          name: 'Teer & Pech (PAK)',
          chemical: 'Polyzyklische Aromatische Kohlenwasserstoffe',
          foundIn: 'Estrichkleber (Asphaltkleber), Dachpappen, teerhaltiger Holzpflasterkleber, Kaltbitumen-Anstriche.',
          probability: 'Sehr hoch',
          handling: 'Fräs- und Stemmarbeiten nur unter Atemschutz. PAK-verdächtiger Bauschutt darf nicht in normale Brechanlagen (Krebsgefahr!).',
          rules: 'DGUV Regel 101-004 (ehemals BGR 128), Ruva-StB (in Bayern historisch)'
        },
        {
          name: 'Polychlorierte Biphenyle (PCB)',
          chemical: 'PCB-Gemische (Weichmacher)',
          foundIn: 'Dauerelastische Fugendichtungsmassen (Thiokolfugen), Flammschutzanstriche, Deckenplatten kleber.',
          probability: 'Mittel',
          handling: 'Herausschneiden der Fugenflanken, Unterdruck, Sanierungspflicht bei Raumluftwerten > 300 ng/m³.',
          rules: 'PCB-Richtlinie (Bayern), TRGS 524'
        },
        {
          name: 'Blei & Schwermetalle',
          chemical: 'Schwermetalloxide',
          foundIn: 'Rote Bleimennige-Anstriche (Rostschutz auf Altstahl), Bleirohre in Sanitärinstallationen.',
          probability: 'Sehr hoch',
          handling: 'Staubarmes Absaugen, kein mechanisches Schleifen ohne Absaugung der Staubklasse M/H.',
          rules: 'TRGS 505 (Blei)'
        }
      ]
    },
    era1970_1990: {
      title: '1970 - 1990 (Konsolidierungs- und Übergangsphase)',
      description: 'Zunehmende Industrialisierung des Bauens (Fertigteile, Sandwichwände). Beginnende Verbote von Spritzasbest (1979) und PCP (1989), jedoch extrem hoher Einsatz von künstlichen Mineralfasern (alte lungenvergängliche Steinwolle) und Formaldehyd-Platten.',
      dominantMaterials: ['Großtafelbauwerke (Plattenbau)', 'Standardisierte Fertigteildecken', 'Extrem viel Gipskarton und Leichtbauplatten', 'Gegossener Transportbeton (normiert)'],
      pollutants: [
        {
          name: 'Asbest (v.a. in Bauchemikalien)',
          chemical: 'Chrysotilasbest',
          foundIn: 'Putzträger, Spachtelmassen, Fliesenkleber, Dichtungsbänder, Vinyl-Asbest-Bodenplatten (Flex-Platten).',
          probability: 'Sehr hoch',
          handling: 'Bohr- und Schleifverfahren nur unter anerkannten staubarmen Schutzverfahren (BT-Verfahren gem. DGUV).',
          rules: 'TRGS 519'
        },
        {
          name: 'Künstliche Mineralfasern (KMF - alt)',
          chemical: 'Glaswolle/Steinwolle (KI < 40)',
          foundIn: 'Lose Dachbodendämmungen, Trittschalldämmungen unter Estrich, Rohrleitungsisolierungen.',
          probability: 'Sehr hoch',
          handling: 'Alte Mineralwolle gilt als krebserzeugend. Ausbau nur im Schutzanzug und mit Atemschutz (Stb-Maske P2), Staubbindung durch Benetzung.',
          rules: 'TRGS 521'
        },
        {
          name: 'Holzschutzmittel (PCP & Lindan)',
          chemical: 'Pentachlorphenol, Hexachlorcyclohexan',
          foundIn: 'Imprägnierte Holzkonstruktionen (Dachstühle, Fachwerk), Holzzäune, Holzpaneele.',
          probability: 'Hoch',
          handling: 'Belastete Hölzer müssen separiert und als gefährlicher Abfall (Altholzkategorie A IV) in Spezial-Müllverbrennungsanlagen verbrannt werden.',
          rules: 'Altholzverordnung (AltholzV), PCP-Richtlinie'
        },
        {
          name: 'Formaldehyd',
          chemical: 'Methanal (Gasförmig gelöst)',
          foundIn: 'Spanplatten (Fertighäuser, Trennwände), Spanplatten-Klebstoff (Harnstoff-Formaldehyd-Harz).',
          probability: 'Hoch',
          handling: 'Gute Durchlüftung beim Abbruch, staubarmes Schneiden zur Vermeidung freigesetzter Formaldehydstäube.',
          rules: 'Gefahrstoffverordnung, Grenzwerte für Luftbelastung'
        }
      ]
    },
    post1990: {
      title: 'Ab 1990 (Moderne Bauära mit Restrisiken)',
      description: 'Asbestverbot ab 1993 in Deutschland. Die Schadstoffbelastung sinkt drastisch, allerdings müssen neuere Verbundstoffe, Flammschutzmittel wie HBCD (in EPS) und künstliche Mineralfasern (ohne Krebspotenzial, aber lungengängig) beachtet werden.',
      dominantMaterials: ['Hochfester Stahlbeton (C50/60+), filigrane Elementdecken', 'Wärmedämmverbundsysteme (WDVS)', 'Schnittstellenmauerwerke (Porenbeton, Planziegel)', 'Verbundwerkstoffe (GFK, carbonbewehrter Beton)'],
      pollutants: [
        {
          name: 'HBCD (Dämmstoffe)',
          chemical: 'Hexabromcyclododecan (Flammschutzmittel)',
          foundIn: 'Polystyrol-Dämmplatten (EPS/XPS) in Wärmedämmverbundsystemen (WDVS) vor Baujahr 2014.',
          probability: 'Hoch',
          handling: 'Gilt als POP (Persistent Organic Pollutant). Abfallschlüssel für gefährliche Baustoffe bei HBCD-Gehalt > 1000 mg/kg. Getrennthaltungspflicht vom normalen Bauschutt!',
          rules: 'POP-Verordnung der EU, Abfallverzeichnis-Verordnung (AVV)'
        },
        {
          name: 'Fluorierte Treibgase (FCKW/HFKW)',
          chemical: 'Chlorfluorkohlenwasserstoffe',
          foundIn: 'PU-Hartschaumdämmstoffe (Ortschaum-Isolierungen, Rohrschalen, Sandwichpaneele).',
          probability: 'Mittel',
          handling: 'Geordneter Ausbau ohne Zerstückelung, um Ausgasen zu verhindern. Spezialentsorgung zur Zerstörung der Treibgase.',
          rules: 'FCKW-Halon-Verordnung / POP-V'
        },
        {
          name: 'Künstliche Mineralfasern (KMF - neu)',
          chemical: 'Glas- und Steinwolle (KI >= 40)',
          foundIn: 'Wärme- und Brandschutzdämmungen.',
          probability: 'Sehr hoch',
          handling: 'Verschärfter Staubschutz, da Fasern mechanisch reizend sind. Jedoch bio-löslich und nicht krebserzeugend nachgewiesen.',
          rules: 'TRGS 521 (Schutzstufe II)'
        }
      ]
    }
  };

  // Selective Dismantling Mass Estimator Logic
  // Density constants in t/m³ (approximate bulk/solid values used in deconstruction engineering)
  const densities = {
    concrete: { concrete: 1.5, masonry: 0.1, wood: 0.05, metals: 0.06, plastics: 0.02, gypsum: 0.04, hazardous: 0.015, mixed: 0.08 },
    masonry: { concrete: 0.4, masonry: 1.2, wood: 0.08, metals: 0.04, plastics: 0.02, gypsum: 0.06, hazardous: 0.01, mixed: 0.09 },
    timber: { concrete: 0.2, masonry: 0.1, wood: 0.5, metals: 0.03, plastics: 0.03, gypsum: 0.12, hazardous: 0.025, mixed: 0.12 },
    composite: { concrete: 0.9, masonry: 0.6, wood: 0.08, metals: 0.08, plastics: 0.04, gypsum: 0.08, hazardous: 0.02, mixed: 0.14 }
  };

  const currentDensity = densities[structureType];
  const massConcrete = Math.round(buildingVolume * currentDensity.concrete);
  const massMasonry = Math.round(buildingVolume * currentDensity.masonry);
  const massWood = Math.round(buildingVolume * currentDensity.wood);
  const massMetals = Math.round(buildingVolume * currentDensity.metals);
  const massPlastics = Math.round(buildingVolume * currentDensity.plastics);
  const massGypsum = Math.round(buildingVolume * currentDensity.gypsum);
  const massHazardous = Math.round(buildingVolume * currentDensity.hazardous);
  const massMixed = Math.round(buildingVolume * currentDensity.mixed);

  const totalMass = massConcrete + massMasonry + massWood + massMetals + massPlastics + massGypsum + massHazardous + massMixed;
  const mineralPercentage = Math.round(((massConcrete + massMasonry) / (totalMass || 1)) * 100);

  return (
    <div className="space-y-8" id="rueckbau-modul">
      {/* Module Title Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-shiraz/10 text-shiraz text-xs font-bold uppercase px-2.5 py-1 rounded">
              Zirkuläres Bauen & Kreislaufwirtschaft
            </span>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          Baukörper-Rückbau & Material
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Systematische Entfrachtung, selektiver Abbruch und mineralische Aufbereitung nach den Richtlinien des 
              <strong> Bayerischen Landesamtes für Umwelt (LfU)</strong>. Aktualisiert mit den strengen Vorgaben der 
              <strong> Ersatzbaustoffverordnung (EBV) 2023</strong>.
          </p>
        </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex-shrink-0">
            <ShieldCheck size={28} className="text-emerald-600" />
            <div>
              <div className="text-xs font-bold text-emerald-800">Gesetzlicher Status</div>
              <div className="text-xs font-medium text-emerald-700">Bundesweit harmonisiert (EBV)</div>
            </div>
          </div>
        </div>
        
        {/* Module Sub-navigation */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-home-grau/30 pt-4">
          <button
            onClick={() => setActiveTab('lfu_leitfaden')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'lfu_leitfaden' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <BookOpen size={14} /> LfU Rückbau-Leitfaden
          </button>
          <button
            onClick={() => setActiveTab('schadstoffe')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'schadstoffe' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <AlertTriangle size={14} /> Schadstoff-Erkundung (VDI)
          </button>
          <button
            onClick={() => setActiveTab('baustoffrecycling')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'baustoffrecycling' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <Recycle size={14} /> Baustoffrecycling
          </button>
          <button
            onClick={() => setActiveTab('rechner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'rechner' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <Hammer size={14} /> Masse- & Abfallrechner
          </button>
          <button
            onClick={() => setActiveTab('aktualitaet')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'aktualitaet' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <Recycle size={14} /> Aktualitäts-Check (EBV)
          </button>
          <button
            onClick={() => setActiveTab('praxis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white' 
                : 'bg-home-grau/10 text-text-main hover:bg-home-grau/20'
            }`}
          >
            <FileText size={14} /> Praxis-Szenarien & Behörden
          </button>
        </div>
      </div>

      {/* TAB 1: LfU Rückbau-Leitfaden */}
      {activeTab === 'lfu_leitfaden' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Timeline navigation Left (4 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
                <Clock size={16} className="text-shiraz" /> Phasen des selektiven Rückbaus
              </h3>
              <p className="text-xs text-text-main/70 mb-4">
                Der LfU-Leitfaden empfiehlt ein stufenweises Vorgehen, um schadstofffreien Bauschutt zu erhalten.
              </p>
              
              <div className="space-y-1">
                {processPhases.map((phase) => (
                  <button
                    key={phase.num}
                    onClick={() => setSelectedPhase(phase.num)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${
                      selectedPhase === phase.num
                        ? 'bg-shiraz/5 border-shiraz/50 shadow-sm'
                        : 'bg-off-white border-transparent hover:bg-home-grau/10'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      selectedPhase === phase.num ? 'bg-shiraz text-white' : 'bg-home-grau/20 text-text-main'
                    }`}>
                      {phase.num}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${selectedPhase === phase.num ? 'text-shiraz' : 'text-text-main'}`}>
                        {phase.title}
                      </h4>
                      <p className="text-xs text-text-main/60 mt-0.5 line-clamp-1">{phase.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <AlertTriangle size={14} className="text-amber-700" /> Getrennthaltung und Schadstoffentfrachtung vor dem Abbruch (Vermischungsverbot, § 9 Abs. 2 KrWG / GewAbfV)
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Bauschutt gilt abfallrechtlich nach dem Vermischungsverbot bereits als 
                kontaminiert, wenn er vor dem Abbruch nicht ordnungsgemäß von anhaftenden Fremd- und Schadstoffen 
                (wie asbesthaltigem Putz, PAK-Kleber oder Bitumen) entfrachtet wurde!
              </p>
            </div>
          </div>

          {/* Details Right (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-home-grau/10">
                <span className="text-3xl font-extrabold text-shiraz/20">Phase 0{selectedPhase}</span>
                <div>
                  <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                    {processPhases[selectedPhase - 1].title}
                  </h3>
                  <span className="text-xs text-text-main/60 font-medium">
                    {processPhases[selectedPhase - 1].subtitle}
                  </span>
                </div>
              </div>

              <div className="space-y-4 my-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/70 mb-1">Beschreibung</h4>
                  <p className="text-xs text-text-main leading-relaxed bg-off-white p-3 rounded-lg border border-home-grau/10">
                    {processPhases[selectedPhase - 1].description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/70 mb-2">Checkliste zur Umsetzung</h4>
                  <ul className="space-y-2">
                    {processPhases[selectedPhase - 1].checklists.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-text-main">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-home-grau/15 bg-slate-50 p-4 rounded-lg">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1 uppercase tracking-wider">
                <Info size={13} className="text-shiraz" /> Original-Anforderung (LfU Leitfaden)
              </h4>
              <p className="text-xs italic text-slate-700 font-medium leading-relaxed">
                "{processPhases[selectedPhase - 1].lfuStandard}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Schadstoff-Detektor */}
      {activeTab === 'schadstoffe' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/15 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-text-main">Epochen-Schadstoff-Matrix</h3>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
                  <p>
                    Wählen Sie die Bauwerksepoche aus, um die baujahrtypischen Schadstoffquellen nach VDI 6202 und LfU-Kriterien zu visualisieren.
                  </p>
                </div>
              </div>
              
              {/* Era selector tabs */}
              <div className="flex rounded-lg bg-off-white p-1 border border-home-grau/30">
                <button
                  onClick={() => setSelectedEra('pre1970')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedEra === 'pre1970' ? 'bg-white shadow-sm text-shiraz' : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  Bis 1970
                </button>
                <button
                  onClick={() => setSelectedEra('era1970_1990')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedEra === 'era1970_1990' ? 'bg-white shadow-sm text-shiraz' : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  1970 - 1990
                </button>
                <button
                  onClick={() => setSelectedEra('post1990')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedEra === 'post1990' ? 'bg-white shadow-sm text-shiraz' : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  Nach 1990
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Era summary card */}
              <div className="md:col-span-4 bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-shiraz mb-1">{eraPollutants[selectedEra].title}</h4>
                  <p className="text-xs text-text-main/80 leading-relaxed mb-4">
                    {eraPollutants[selectedEra].description}
                  </p>
                </div>
                
                <div className="border-t border-home-grau/30 pt-3">
                  <h5 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2">Dominierende Tragwerkstypen:</h5>
                  <ul className="space-y-1">
                    {eraPollutants[selectedEra].dominantMaterials.map((mat, i) => (
                      <li key={i} className="text-xs text-text-main/70 flex items-center gap-1.5">
                        <ChevronRight size={12} className="text-shiraz" /> {mat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pollutants details view */}
              <div className="md:col-span-8 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/60">Schadstoff-Katasterkarten</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {eraPollutants[selectedEra].pollutants.map((pollutant, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h5 className="text-xs font-bold text-slate-800 leading-tight">{pollutant.name}</h5>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-bold uppercase ${
                            pollutant.probability === 'Sehr hoch' 
                              ? 'bg-red-100 text-red-800' 
                              : pollutant.probability === 'Hoch' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            Präsenz: {pollutant.probability}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">{pollutant.chemical}</p>
                        
                        <div className="mt-3 space-y-2">
                          <div>
                            <span className="text-xs font-bold text-text-main/60 block">Vorkommen:</span>
                            <span className="text-xs text-text-main leading-relaxed">{pollutant.foundIn}</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-text-main/60 block">Sanierung & Demontageschutz:</span>
                            <span className="text-xs text-text-main leading-relaxed italic">{pollutant.handling}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-2 border-t border-home-grau/10 flex justify-between items-center bg-slate-50 -mx-4 -mb-4 p-2 px-4 rounded-b-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase">Regelwerk:</span>
                        <span className="text-xs font-mono font-bold text-shiraz">{pollutant.rules}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* TRGS Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 block"></span> TRGS 519 (Asbest)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Regelt Abbruch-, Sanierungs- und Instandhaltungsarbeiten (ASI) mit Asbest. Fachkunde nach Anlage 3 oder 4 ist zwingend erforderlich. Arbeiten müssen 7 Tage vorab beim Gewerbeaufsichtsamt angemeldet werden.
              </p>
            </div>
            <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600 block"></span> TRGS 521 (Mineralfasern)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Regelt den Schutz bei mineralischen Dämmstoffen. Für krebserzeugendes "altes" KMF (Einbau vor 2000) gelten strikte Schutzmaßnahmen (Staubschutzstufe II: Ganzkörperanzug, Masken, Staubunterdrückung).
              </p>
            </div>
            <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 block"></span> TRGS 524 / DGUV 101-004
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sicherheit und Gesundheitsschutz bei der Arbeit in kontaminierten Bereichen (z.B. PCB in dauerelastischen Fugen oder PAK-kontaminierte Böden und Untergründe). Erfordert Sachkundennachweis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Baustoffrecycling */}
      {activeTab === 'baustoffrecycling' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
            <h3 className="text-base font-bold text-text-main mb-1 flex items-center gap-1.5">
              <Recycle size={18} className="text-shiraz" /> Recyclingfähigkeit einzelner Baustoffe nach GewAbfV & EBV 2023
            </h3>
            <p className="text-xs text-text-main/70 mb-4 max-w-4xl">
              Gemäß der Gewerbeabfallverordnung (GewAbfV) gilt an bayerischen Baustellen eine strikte Pflicht zur getrennten Sammlung von mineralischen Gemischen, Holz, Glas, Kunststoffen und Metallen. Die stoffliche Analyse und Aufbereitung entscheidet über die Wiederverzahnung im Wirtschaftskreislauf.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              {/* Left Selector List */}
              <div className="lg:col-span-4 space-y-2">
                <span className="text-xs font-bold text-text-main/50 uppercase tracking-wider block mb-1">Baustoffauswahl</span>
                <div className="space-y-1.5">
                  {baustoffRecyclingData.map((mat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedRecyclingMaterial(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        selectedRecyclingMaterial === idx
                          ? 'bg-shiraz/5 border-shiraz/50 shadow-sm'
                          : 'bg-off-white border-home-grau/10 hover:bg-home-grau/5'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-xs font-bold text-text-main block leading-tight">{mat.name}</span>
                        <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-home-grau/30 flex-shrink-0">AVV {mat.avv}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1 mt-1.5">
                        <span className="text-xs text-text-main/60">{mat.subtitle}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-bold uppercase transition-transform ${
                          mat.rating.includes('Sehr hoch')
                            ? 'bg-emerald-100 text-emerald-800'
                            : mat.rating.includes('Hoch')
                            ? 'bg-emerald-50 text-emerald-700'
                            : mat.rating.includes('Mittel')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-50 text-red-800'
                        }`}>
                          {mat.rating.split(' ')[0]}
                        </span>
                      </div>
                      
                      {/* Linear progress preview */}
                      <div className="h-1 bg-slate-200 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            mat.percentage > 80 ? 'bg-emerald-500' : mat.percentage > 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${mat.percentage}%` }}
                        ></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Detail Panel */}
              <div className="lg:col-span-8 bg-off-white p-6 rounded-xl border border-home-grau/15 flex flex-col justify-between">
                <div>
                  {/* Title and Rating header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/15">
                    <div>
                      <h4 className="text-base font-bold text-shiraz">{baustoffRecyclingData[selectedRecyclingMaterial].name}</h4>
                      <p className="text-xs text-text-main/60 mt-0.5 italic">{baustoffRecyclingData[selectedRecyclingMaterial].subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-home-grau/10 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-text-main/60 font-bold">RECYCLING-QUOTE</div>
                        <div className="text-sm font-mono font-bold text-shiraz">{baustoffRecyclingData[selectedRecyclingMaterial].percentage}%</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-shiraz/5 border border-shiraz/20 flex items-center justify-center text-xs font-bold text-shiraz">
                        {baustoffRecyclingData[selectedRecyclingMaterial].percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Detailed Information blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white p-4 rounded-xl border border-home-grau/10 space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Aufbereitungsmethode</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">{baustoffRecyclingData[selectedRecyclingMaterial].process}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-home-grau/10 space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Typische Verwertungspfade</span>
                      <ul className="space-y-1.5 pt-0.5">
                        {baustoffRecyclingData[selectedRecyclingMaterial].useCases.map((useCase, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-normal">
                            <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
                            <span>{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-red-50/40 p-4 rounded-xl border border-red-200/50 space-y-1">
                      <span className="text-xs font-bold text-red-800 uppercase tracking-widest block">Störstoffrisiko & Sensibilität</span>
                      <p className="text-xs text-red-950 leading-relaxed font-sans">{baustoffRecyclingData[selectedRecyclingMaterial].risks}</p>
                    </div>

                    <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-200/40 space-y-1">
                      <span className="text-xs font-bold text-indigo-800 uppercase tracking-widest block">Rechtliche Normierung & Beachtung</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        {baustoffRecyclingData[selectedRecyclingMaterial].regulations || "Fällt unter die allgemeinen Getrennthaltungspflichten der Gewerbeabfallverordnung (GewAbfV). Unvermischter Transport zu qualifizierten Verwerterbetrieben zwingend vorgeschrieben."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-home-grau/10 bg-slate-50/75 p-3 rounded-lg flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold uppercase tracking-wider">Abfallschlüssel (AVV):</span>
                  <span className="font-mono font-bold text-shiraz bg-white border border-shiraz/20 px-2 py-0.5 rounded">AVV {baustoffRecyclingData[selectedRecyclingMaterial].avv}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table summary of all materials for quick overview */}
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm overflow-x-auto">
            <h4 className="text-sm font-bold text-text-main mb-1">Vergleichende Recyclingmatrix für Baustoffe</h4>
            <p className="text-xs text-text-main/60 mb-4">Umfassende Zusammenstellung aller recyclingrelevanten Kennwerte der Hauptmassenströme im Baubestand.</p>
            <table className="min-w-full text-xs text-left text-text-main">
              <thead className="bg-slate-50 uppercase text-xs text-text-main/60 border-b border-home-grau/25">
                <tr>
                  <th className="py-2.5 px-3">Baustoff</th>
                  <th className="py-2.5 px-3">AVV-Code</th>
                  <th className="py-2.5 px-3">Quote (%)</th>
                  <th className="py-2.5 px-3">Einstufung</th>
                  <th className="py-2.5 px-3">Hauptstörstoffe</th>
                  <th className="py-2.5 px-3">Verwertungsklasse / Rechtliches</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/10">
                {baustoffRecyclingData.map((mat, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">{mat.name}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-slate-500">{mat.avv}</td>
                    <td className="py-2.5 px-3 font-semibold text-shiraz">{mat.percentage}%</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-bold uppercase ${
                        mat.rating.includes('Sehr hoch')
                          ? 'bg-emerald-100 text-emerald-800'
                          : mat.rating.includes('Hoch')
                          ? 'bg-emerald-50 text-emerald-700'
                          : mat.rating.includes('Mittel')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-50 text-red-800'
                      }`}>
                        {mat.rating}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-red-900 text-xs max-w-[200px] truncate" title={mat.risks}>{mat.risks}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-xs max-w-[250px] truncate" title={mat.regulations || 'GewAbfV Standard'}>
                      {mat.regulations || "GewAbfV Getrennthaltungspflicht"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Spezialthema: Bodenaufbereitung & Qualitätssicherung */}
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-home-grau/25 pb-3">
              <div className="p-2 bg-emerald-50 text-emerald-750 rounded-lg">
                <Recycle size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Boden- &amp; Erdaushubaufbereitung (Verfahren, Vorschriften, QS)</h4>
                <p className="text-xs text-slate-500 mt-0.5">Stoffliche Erholung von kontaminierten Böden nach Ersatzbaustoffverordnung (EBV) 2023</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Die Wiederverwendung von bodenähnlichen Massen ist in der modernen Kreislaufwirtschaft von elementarer Bedeutung. Seit Inkrafttreten der <strong>Ersatzbaustoffverordnung (EBV)</strong> am 1. August 2023 gelten bundesweit einheitliche Standards. Je nach Belastung der Bodenmatrix (Schwermetalle, organische Kohlenwasserstoffe, PAK, etc.) kommen unterschiedliche physikalisch-chemische Verfahren zum Einsatz, um das Zielprodukt wieder bautechnisch nutzbar zu machen.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Verfahren Panel */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 space-y-3">
                <h5 className="font-bold text-xs text-slate-900 border-b border-home-grau/20 pb-1 uppercase tracking-wider text-slate-500">1. Aufbereitungsverfahren</h5>
                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="space-y-0.5">
                    <strong className="text-slate-950 font-bold block">Nassmechanische Bodenwasch-Verfahren:</strong>
                    <p className="text-xs text-slate-600 leading-normal">Prallwäsche trennt kontaminierte Feinfraktionen (Silt, Ton) physikalisch von sauberen Sanden und Kiesen ab. Schadstoffe wandern hochkonzentriert in den Filterkuchen.</p>
                  </li>
                  <li className="space-y-0.5">
                    <strong className="text-slate-950 font-bold block">Thermische Desorptionsanlagen (Drehrohr):</strong>
                    <p className="text-xs text-slate-600 leading-normal">Bei Erhitzung auf 350°C bis 600°C verdampfen persistente organische Schadstoffe (MKW, PAK, Teer) restlos und werden in der Nachverbrennung bei &gt;850°C zerstört.</p>
                  </li>
                  <li className="space-y-0.5">
                    <strong className="text-slate-950 font-bold block">Biologische Mietenaufbereitung (Bioremediation):</strong>
                    <p className="text-xs text-slate-650 leading-normal">Mikrobieller Abbau leicht flüchtiger Mineralöle. Der Boden wird in Mieten aufgesetzt, belüftet, bewässert und mit Stickstoff/Phosphor-Nährlösungen konditioniert.</p>
                  </li>
                </ul>
              </div>

              {/* Vorschriften Panel */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 space-y-3">
                <h5 className="font-bold text-xs text-slate-900 border-b border-home-grau/20 pb-1 uppercase tracking-wider text-slate-500">2. Gesetzliche Vorschriften</h5>
                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="space-y-0.5">
                    <strong className="text-slate-950 font-bold block">EBV (Güte- und Einbauklassen):</strong>
                    <p className="text-xs text-slate-600 leading-normal">Gereinigte Böden werden je nach Messwert im Sickerwasser (Eluat) Klassen wie BM-0 (unbeschränkt), BM-F1/F2/F3 (z. B. im Lärm- und Straßenbau mit technischer Barriere) zugewiesen.</p>
                  </li>
                  <li className="space-y-0.5">
                    <strong className="text-slate-950 font-bold block">Bundes-Bodenschutzverordnung (BBodSchV):</strong>
                    <p className="text-xs text-slate-600 leading-normal">Tritt in Kraft, wenn aufbereitetes Material außerhalb technischer Bauwerke (z. B. bei landwirtschaftlicher Rekultivierung oder im Landschaftsbau) direkt eingebracht werden soll.</p>
                  </li>
                  <li className="space-y-0.5">
                    <strong className="text-slate-950 font-bold block">Ersatzbaustoffregister Meldepflicht (§ 22):</strong>
                    <p className="text-xs text-slate-600 leading-normal">Einbauerstatter müssen Einbauten mineralischer Ersatzbaustoffe ab 250 m³ behördlich melden. Das Register dient der lückenlosen behördlichen Dokumentation.</p>
                  </li>
                </ul>
              </div>

              {/* Qualitätssicherung Panel */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 space-y-3">
                <h5 className="font-bold text-xs text-slate-900 border-b border-home-grau/20 pb-1 uppercase tracking-wider text-slate-500">3. Qualitätssicherung (Güteüberwachung)</h5>
                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="space-y-0.5">
                    <strong className="text-slate-950 font-bold block">Werkseigene Produktionskontrolle (WPK):</strong>
                    <p className="text-xs text-slate-600 leading-normal">Das Aufbereitungswerk führt kontinuierliche, tägliche Eigenüberwachungen (Sieblinie, Dichte, Feuchtigkeitsgrad, Eluatprüfungen) und Dokumentationen durch.</p>
                  </li>
                  <li className="space-y-0.5">
                    <strong className="text-slate-950 font-bold block">Fremdüberwachung (Prüfstellen):</strong>
                    <p className="text-xs text-slate-600 leading-normal">Unabhängige, staatlich anerkannte Prüfinstitute entnehmen mehrmals im Jahr unangekündigt Stichproben, um die Zuverlässigkeit der Analytik des Werks zu validieren.</p>
                  </li>
                  <li className="space-y-0.5">
                    <strong className="text-slate-950 font-bold block">Gütegemeinschaften &amp; Zertifikate:</strong>
                    <p className="text-xs text-slate-600 leading-normal">Etablierte Verbände (z. B. <strong>QRB - Qualitätssicherungs-System Recycelte Baustoffe</strong>, <strong>bvse</strong>) verleihen nach erfolgreicher Fremdüberwachung das Gütesiegel für sicheren Absatz.</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-200/60 text-xs font-semibold flex items-start gap-2">
              <span className="p-1 px-1.5 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded text-xs font-mono leading-none flex-shrink-0">TIPP</span>
              <p className="leading-relaxed">
                Interaktive Berechnungen und tiefergehende verfahrenstechnische Details aller Substrat-Schadstoff-Konfigurationen finden Sie im Modulbereich <strong>Schad- und Gefahrstoffe</strong> unter der neuen Rubrik <strong>Boden- &amp; Materialaufbereitung</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Masse- & Abfallrechner */}
      {activeTab === 'rechner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Left */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-1.5 pb-2 border-b border-home-grau/10">
              <Hammer size={16} className="text-shiraz" /> Baukörper-Spezifikationen
            </h3>

            <div className="space-y-4">
              {/* Typical Building Presets (Menge & Material) */}
              <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/10 space-y-2">
                <span className="text-xs font-extrabold text-[#A3113E] tracking-wider uppercase font-mono block">Typische Musterbauten-Presets</span>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: '🏠 Einfamilienhaus (EFH)', vol: 800, type: 'masonry', label: '800 m³ • Mauerwerk (Ziegel)' },
                    { name: '🏡 Doppelhaushälfte (DHH)', vol: 600, type: 'composite', label: '600 m³ • Mischbauweise' },
                    { name: '🏢 Mehrfamilienhaus (MFH)', vol: 3500, type: 'concrete', label: '3.500 m³ • Stahlbeton' },
                    { name: '🪵 Holzhaus (EFH-Leichtbau)', vol: 900, type: 'timber', label: '900 m³ • Holzständer' },
                    { name: '🏭 Gewerbehalle (Mittel)', vol: 12000, type: 'concrete', label: '12.000 m³ • Skelettbau' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setBuildingVolume(preset.vol);
                        setStructureType(preset.type as any);
                      }}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all flex justify-between items-center ${
                        buildingVolume === preset.vol && structureType === preset.type
                          ? 'bg-shiraz text-white border-shiraz font-semibold shadow-sm shadow-shiraz/25'
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-semibold">{preset.name}</span>
                      <span className={`text-xs font-mono ${
                        buildingVolume === preset.vol && structureType === preset.type
                          ? 'text-white/80'
                          : 'text-slate-500'
                      }`}>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-main flex justify-between mb-1.5">
                  <span>Gebäudevolumen (BRI)</span>
                  <span className="text-shiraz font-mono">{buildingVolume.toLocaleString('de-DE')} m³</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={buildingVolume}
                  onChange={(e) => setBuildingVolume(Number(e.target.value))}
                  className="w-full accent-shiraz"
                />
                <span className="text-xs text-text-main/60 block mt-1">BRI = Brutto-Rauminhalt des Abbruchobjekts</span>
              </div>

              <div>
                <label className="text-xs font-bold text-text-main block mb-1.5">Konstruktionsart</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStructureType('concrete')}
                    className={`p-2.5 text-left border rounded-lg text-xs font-bold transition-all flex flex-col ${
                      structureType === 'concrete' ? 'border-shiraz bg-shiraz/5 text-shiraz' : 'border-home-grau/30 text-text-main hover:bg-slate-50'
                    }`}
                  >
                    <span>Stahlbetonbau</span>
                    <span className="text-xs font-normal text-text-main/50 mt-0.5">Skelett / Fertigteile</span>
                  </button>
                  <button
                    onClick={() => setStructureType('masonry')}
                    className={`p-2.5 text-left border rounded-lg text-xs font-bold transition-all flex flex-col ${
                      structureType === 'masonry' ? 'border-shiraz bg-shiraz/5 text-shiraz' : 'border-home-grau/30 text-text-main hover:bg-slate-50'
                    }`}
                  >
                    <span>Mauerwerk</span>
                    <span className="text-xs font-normal text-text-main/50 mt-0.5">Ziegel / Kalksandstein</span>
                  </button>
                  <button
                    onClick={() => setStructureType('timber')}
                    className={`p-2.5 text-left border rounded-lg text-xs font-bold transition-all flex flex-col ${
                      structureType === 'timber' ? 'border-shiraz bg-shiraz/5 text-shiraz' : 'border-home-grau/30 text-text-main hover:bg-slate-50'
                    }`}
                  >
                    <span>Holzständerbau</span>
                    <span className="text-xs font-normal text-text-main/50 mt-0.5">Leichtbau / Gefache</span>
                  </button>
                  <button
                    onClick={() => setStructureType('composite')}
                    className={`p-2.5 text-left border rounded-lg text-xs font-bold transition-all flex flex-col ${
                      structureType === 'composite' ? 'border-shiraz bg-shiraz/5 text-shiraz' : 'border-home-grau/30 text-text-main hover:bg-slate-50'
                    }`}
                  >
                    <span>Mischbauweise</span>
                    <span className="text-xs font-normal text-text-main/50 mt-0.5">Gängiger Wohnungsbau</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-home-grau/10 text-xs text-text-main/70 bg-slate-50 p-3 rounded-xl border border-home-grau/5 leading-relaxed space-y-2">
              <div className="flex justify-between font-bold text-text-main">
                <span>Geschätzte Gesamtmasse:</span>
                <span className="font-mono text-xs">{totalMass.toLocaleString('de-DE')} t</span>
              </div>
              <div className="flex justify-between">
                <span>Mineralischer Anteil:</span>
                <span className="font-mono font-bold text-slate-800">{mineralPercentage} %</span>
              </div>
            </div>
          </div>

          {/* Graphical Output Right */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                Abschätzung der Wertstoff-Massenströme (Selektiver Rückbau)
              </h3>
              
              <div className="space-y-4">
                {/* Visual Bar Graph of calculated masses */}
                {[
                  { name: 'Betonbruch (Beton / Stahlbeton)', mass: massConcrete, color: 'bg-slate-500', avv: '17 01 01' },
                  { name: 'Mauerwerkbruch (Ziegel, Kalksandstein)', mass: massMasonry, color: 'bg-orange-600', avv: '17 01 02' },
                  { name: 'Altholz (A I bis A IV)', mass: massWood, color: 'bg-amber-750', avv: '17 02 01' },
                  { name: 'Altmetalle (Eisen, Baustahl, Alu, Kupfer)', mass: massMetals, color: 'bg-indigo-600', avv: '17 04 07' },
                  { name: 'Gipskarton / Baustoffe auf Gipsbasis', mass: massGypsum, color: 'bg-neutral-350', avv: '17 08 02' },
                  { name: 'Baustellenspezifische Kunststoffe', mass: massPlastics, color: 'bg-teal-500', avv: '17 02 03' },
                  { name: 'Gefährliche Holzschutz-/Schadstoffe', mass: massHazardous, color: 'bg-red-500', avv: '17 09 03*' },
                  { name: 'Gemischte Bau- und Abbruchabfälle', mass: massMixed, color: 'bg-yellow-600', avv: '17 09 04' }
                ]
                .filter(item => item.mass > 0)
                .map((item, idx) => {
                  const percent = Math.max(2, Math.round((item.mass / totalMass) * 100));
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-text-main flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`}></span>
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 p-0.5 rounded">AVV {item.avv}</span>
                          <span className="font-bold font-mono text-text-main">{item.mass.toLocaleString('de-DE')} t ({percent}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show interactive step-by-step calculation path */}
              <div className="mt-4 border-t border-home-grau/15 pt-4 text-xs">
                <button
                  type="button"
                  onClick={() => setShowCalculations(!showCalculations)}
                  className="w-full text-left py-2 px-3 bg-white border border-home-grau/30 hover:bg-slate-50 rounded-lg font-bold flex justify-between items-center transition-colors text-indigo-900 border-l-4 border-l-indigo-600 cursor-pointer text-xs"
                >
                  <span>{showCalculations ? '▲ Berechnungsweg & Formeln ausblenden' : '▼ Wissenschaftlichen Berechnungsweg & Formeln einblenden'}</span>
                  <span className="text-xs text-slate-500 font-normal">Details nach GewAbfV &amp; LfU</span>
                </button>

                {showCalculations && (
                  <div className="mt-3 p-4 bg-white border border-home-grau/25 rounded-xl space-y-4 text-text-main/90 leading-relaxed text-left">
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        Schritt 1: Ermittlung des Brutto-Rauminhalts (BRI) und Konstruktionstyp
                      </h5>
                      <p className="mb-2 text-text-main/75 text-xs">
                        Ausgangspunkt ist der Brutto-Rauminhalt des Abbruchobjekts (<FormulaText text="V" /> = {buildingVolume.toLocaleString('de-DE')} m³) sowie der tragende Konstruktionstyp (<strong>{
                          structureType === 'concrete' ? 'Stahlbetonbau' :
                          structureType === 'masonry' ? 'Mauerwerksbau' :
                          structureType === 'timber' ? 'Holzständerbau' : 'Mischbauweise'
                        }</strong>).
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        Schritt 2: Spezifische Massendichten (<FormulaText text="\rho_i" />)
                      </h5>
                      <p className="mb-2 text-text-main/75 text-xs">
                        Für die gewählte Bauart ergeben sich folgende statistische Massenkonzentrationen (in Tonnen pro Kubikmeter umbauter Raum) nach Aufmaßwerten typischer Rückbaustrukturen:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-home-grau/15 font-mono">
                        <div>Beton: {currentDensity.concrete} t/m³</div>
                        <div>Mauerwerk: {currentDensity.masonry} t/m³</div>
                        <div>Holz: {currentDensity.wood} t/m³</div>
                        <div>Metalle: {currentDensity.metals} t/m³</div>
                        <div>Gips: {currentDensity.gypsum} t/m³</div>
                        <div>Plastik: {currentDensity.plastics} t/m³</div>
                        <div>Gefahrstoffe: {currentDensity.hazardous} t/m³</div>
                        <div>Mischabfall: {currentDensity.mixed} t/m³</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        Schritt 3: Berechnung der Einzelmassen (<FormulaText text="m_i = V \cdot \rho_i" />)
                      </h5>
                      <p className="mb-2 text-text-main/75 text-xs">
                        Die prognostizierten Massenströme ergeben sich direkt aus dem Produkt des Raumvolumens mit der jeweiligen Dichte. Beispiel für Betonbruch:
                      </p>
                      <FormulaText text={`m_{\\text{Beton}} = V \\cdot \\rho_{\\text{Beton}} = ${buildingVolume} \\text{ m}^3 \\cdot ${currentDensity.concrete} \\text{ t/m}^3 = ${massConcrete} \\text{ t}`} />
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        Schritt 4: Bestimmung der Gesamtmasse (<FormulaText text="m_{\text{ges}} = \sum m_i" />)
                      </h5>
                      <p className="mb-2 text-text-main/75 text-xs">
                        Die Summe aller Fraktionen ergibt das geschätzte Abbruchgewicht auf der Baustelle:
                      </p>
                      <FormulaText text={`m_{\\text{ges}} = ${massConcrete} + ${massMasonry} + ${massWood} + ${massMetals} + ${massPlastics} + ${massGypsum} + ${massHazardous} + ${massMixed} = ${totalMass} \\text{ t}`} />
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        Schritt 5: Mineralischer Anteil (<FormulaText text="P_{\text{min}}" />) und Getrennthalte-Quote
                      </h5>
                      <p className="mb-2 text-text-main/75 text-xs">
                        Nach der Gewerbeabfallverordnung (GewAbfV) müssen Bauschuttfraktionen getrennt erfasst werden. Der mineralische Haupt-Massenstrom (Beton- und Mauerwerksbruch) beträgt:
                      </p>
                      <FormulaText text={`P_{\\text{min}} = \\frac{m_{\\text{Beton}} + m_{\\text{Mauerwerk}}}{m_{\\text{ges}}} \\cdot 100 = \\frac{${massConcrete} + ${massMasonry}}{${totalMass}} \\cdot 100 \\approx ${mineralPercentage} \\%`} />
                      <div className="mt-2 text-indigo-950 bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-lg text-xs">
                        <span className="font-bold font-semibold text-indigo-900 block mb-0.5">✓ Kreislauffähigkeit &amp; LfU-Konformität:</span>
                        Da der mineralische Anteil über 85% liegt ({mineralPercentage}%), ist dieses Bauwerk baustofflich prädestiniert für ein hochwertiges RC-Recycling nach der neuen Ersatzbaustoffverordnung (EBV) von 2023. Das sortenreine Rückbaukonzept ist zwingend umzusetzen, um eine unzulässige Vermischung zu verhindern.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-home-grau mt-6 pt-4 border-t border-home-grau/10">
                *Hinweis zur Massenermittlung: Die berechneten Massen basieren auf statistischen Kennwerten für Brutto-Rauminhalte im Hochbau. Bei realitätsnahen Projekten ist das Vorlegen eines bauteilspezifischen Aufmaßes / Schadstoffgutachtens zwingend erforderlich.
              </p>
          </div>
        </div>
      )}

      {/* TAB 4: Aktualitäts-Check */}
      {activeTab === 'aktualitaet' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
            <h3 className="text-base font-bold text-text-main mb-2">Aktualisierung &amp; Gesetzlicher Status</h3>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Der alte LfU Leitfaden bezieht sich teilweise auf historische Verordnungen und die alten Richtlinien 
                der Bund/Länder-Arbeitsgemeinschaft Abfall (<strong>LAGA Mitteilung 20</strong>). Es ist von überragender 
                Wichtigkeit, die Neuerungen im Baurecht für nachhaltiges Bauen und Demontage zu kennen:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Old vs New Mineral Recycling */}
              <div className="border border-shiraz/20 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-shiraz/10 p-3 px-4 text-xs font-bold text-shiraz border-b border-shiraz/20 uppercase tracking-wider">
                  Mineralische Bauabfälle: LAGA M 20 vs. EBV 2023
                </div>
                <div className="p-4 space-y-4">
                  <div className="bg-slate-50 p-2.5 rounded text-xs text-slate-600">
                    <span className="font-bold text-slate-800 uppercase text-xs block">Historischer Zustand (LAGA M 20):</span>
                    Föderalismus führte zu uneinheitlichen Grenzwerten und Richtlinien. In Bayern galt z.B. der RC-Leitfaden des LfU mit den Einstufungen unbedenklich (Z0), eingeschränkt (Z1.1, Z1.2) oder deponierungsbedürftig (Z2).
                  </div>
                  
                  <div className="bg-emerald-50 p-2.5 rounded text-xs text-emerald-800 border border-emerald-200">
                    <span className="font-bold text-emerald-900 uppercase text-xs block">Neuer Zustand seit August 2023 (Ersatzbaustoffverordnung):</span>
                    Einführung einer bundesweit harmonisierten Bundes-Ersatzbaustoffverordnung (EBV). Die alten LAGA M20-Klassen wurden durch einheitliche Materialklassen ersetzt (Bodenmaterial BM-0/F1/F2/F3, Recycling-Baustoff RC-1/RC-2/RC-3). Vorgeschriebene Güteüberwachung und Anzeige von Großbaustellen im Ersatzbaustoffkataster sind Pflicht.
                  </div>
                </div>
              </div>

              {/* Card 2: GewAbfV and Circularity */}
              <div className="border border-indigo-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-indigo-50 p-3 px-4 text-xs font-bold text-indigo-800 border-b border-indigo-200 uppercase tracking-wider">
                  Gewerbeabfallverordnung (GewAbfV) & Getrenntsammlung
                </div>
                <div className="p-4 space-y-4 text-xs text-text-main leading-relaxed">
                  <div>
                    <span className="font-bold text-slate-800 block">Strenge Getrennthaltungsgebote:</span>
                    Die GewAbfV verlangt die lückenlose Dokumentation und Separation von mindestens 10 Kernfraktionen an der Bau- und Abbruchstelle. 
                  </div>
                  
                  <div className="bg-indigo-50/50 p-3 rounded border border-indigo-100 space-y-2">
                    <span className="font-bold text-indigo-900 block text-xs uppercase">Mindest-Sortierquote:</span>
                    Erreicht eine Abbruchstelle die gesetzlich geforderte Sortierquote von <strong>mindestens 90%</strong> nicht, muss der gemischte Bauschutt nachweislich in einer zugelassenen Vorbehandlungsanlage nachsortiert werden.
                  </div>

                  <div className="bg-white rounded border border-amber-300 p-2.5 text-xs text-amber-800">
                    <strong>Achtung Bußgeldgefahr:</strong> Ausbleibende Getrenntsammlungs-Dokumentation (Fotobeweise, Wiegescheine, Entsorgungserklärungen) stellt eine Ordnungswidrigkeit dar und kann hohe Strafen nach sich ziehen.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table comparison representation */}
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm overflow-x-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/70 mb-3">Rechtliche Konsequenzen für die Bauleitung</h4>
            <table className="min-w-full text-xs text-left text-text-main">
              <thead className="bg-slate-50 uppercase text-xs text-text-main/60 border-b border-home-grau/30">
                <tr>
                  <th className="py-3 px-4">Themenfeld</th>
                  <th className="py-3 px-4">Alte Praxis (LfU historisch)</th>
                  <th className="py-3 px-4">Aktuelle Vorschrift (2026 / EBV)</th>
                  <th className="py-3 px-4">Handlungsempfehlung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/15">
                <tr>
                  <td className="py-3 px-4 font-bold">Verwertung im Erdbau</td>
                  <td className="py-3 px-4">Verwertungs-Leitfaden Bayern (Z0 bis Z2)</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">Ersatzbaustoffverordnung (BM-0 bis BM-F3)</td>
                  <td className="py-3 px-4">Nur chargenweise im Labor (nach PN 98) freigegebenes RC-Material einbauen.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Bauschutt-Transport</td>
                  <td className="py-3 px-4">Einfache Transportbelege in Papierform</td>
                  <td className="py-3 px-4 font-semibold text-red-800">Nachweisverfahren elektronisch (eANV)</td>
                  <td className="py-3 px-4">Für alle gefährlichen Abfälle Signaturkarte bereithalten und Begleitscheine am PC zeichnen.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Wiederverwertung Beton</td>
                  <td className="py-3 px-4">RC-Material meist im Straßenunterbau deponiert</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">Kreislaufbeton (R-Beton nach DIN EN 206)</td>
                  <td className="py-3 px-4">Zerkleinerte Gesteinskörnung im Hochbau einsetzen. Spart mineralischen Primärschotter.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Rückbau-Konzepterstellung</td>
                  <td className="py-3 px-4">Optional bei kleineren Bauvorhaben</td>
                  <td className="py-3 px-4 font-semibold text-amber-800">Materialpasspflicht & Ressourcenpass-Vorbereitung</td>
                  <td className="py-3 px-4">Digitalisierung von Gebäuden mit BIM-Schadstoffkatastern (Madaster / Ressourcenpass).</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Neue Normengruppe: DIN SPEC 91525, DIN SPEC 91484, VDI 6210, DIN 18007 */}
          <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-home-grau/20">
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <FileCheck size={18} className="text-shiraz" />
                Aktuelle Schlüsselstandards für Rückbau, Schadstoffsanierung &amp; Zirkularität
              </h4>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-shiraz/10 text-shiraz rounded-full border border-shiraz/20">
                Normenstand 2024–2026
              </span>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Für eine rechtlich belastbare Planung, die Ausschreibung und den kontrollierten selektiven Rückbau bilden neben der EBV und GewAbfV vier spezialisierte Regelwerke das normative Fundament:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DIN SPEC 91525 */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/30 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-shiraz text-white rounded">
                      DIN SPEC 91525
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Digitaler Gebäuderessourcenpass</span>
                  </div>
                  <h5 className="font-bold text-sm text-text-main">
                    Standardisierte Erfassung für den zirkulären Rückbau
                  </h5>
                  <p className="text-xs text-text-main/80 leading-relaxed">
                    Definiert die Datenstruktur und Mindestanforderungen an digitale Material- und Gebäudepässe. Bildet das Bindeglied zwischen BIM-Bestandsmodellen, Schadstoffkatastern und der Bilanzierung recyclingfähiger Bauteile vor dem Abbruch.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-text-main/70">
                  <span>Fokus: Zirkularitäts-Index, Materialidentität</span>
                  <span className="font-mono font-bold text-shiraz">DIN SPEC 91525-1</span>
                </div>
              </div>

              {/* DIN SPEC 91484 */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/30 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-shiraz text-white rounded">
                      DIN SPEC 91484
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Pre-Demolition Audit</span>
                  </div>
                  <h5 className="font-bold text-sm text-text-main">
                    Verfahren für das Rückbau-Audit vor Abbrucharbeiten
                  </h5>
                  <p className="text-xs text-text-main/80 leading-relaxed">
                    Normiertes Verfahren für die qualifizierte Bestandserfassung und Schadstofferkundung (Pre-Demolition Audit) vor dem Abbruch baulicher Anlagen. Klassifiziert Baustofffraktionen nach Verwertbarkeit und schadstofffreier Separierbarkeit.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-text-main/70">
                  <span>Fokus: Schadstofffreie Selektion, Verwertungsquoten</span>
                  <span className="font-mono font-bold text-shiraz">DIN SPEC 91484</span>
                </div>
              </div>

              {/* VDI 6210 */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/30 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-800 text-white rounded">
                      VDI 6210 Blatt 1 &amp; 2
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Abbruch &amp; Schadstoffsanierung</span>
                  </div>
                  <h5 className="font-bold text-sm text-text-main">
                    Rückbau baulicher und technischer Anlagen
                  </h5>
                  <p className="text-xs text-text-main/80 leading-relaxed">
                    Regelt die technische Durchführung, Arbeitsschutz-, Standsicherheits- und Umweltaspekte beim Abbruch von Bauwerken und Industrieanlagen. Ergänzt VDI 6202 (Erkundung) um konkrete Rückbau- und Abbruchverfahren.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-text-main/70">
                  <span>Fokus: Abbruchstatik, Entkernung, Emissionsschutz</span>
                  <span className="font-mono font-bold text-slate-800">VDI 6210</span>
                </div>
              </div>

              {/* DIN 18007 */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/30 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-800 text-white rounded">
                      DIN 18007
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Abbrucharbeiten - Begriffe &amp; Verfahren</span>
                  </div>
                  <h5 className="font-bold text-sm text-text-main">
                    Abbruch- und Rückbauarbeiten – Begriffe, Verfahren, Arbeitssicherheit
                  </h5>
                  <p className="text-xs text-text-main/80 leading-relaxed">
                    Die übergeordnete nationale Grundnorm für Abbrucharbeiten. Definiert einheitliche Begrifflichkeiten, technische Abbruchverfahren (Demontage, Einsturzverfahren, Abtragen, Sprengen) und fundamentale Schutzvorschriften.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-text-main/70">
                  <span>Fokus: Abbruchverfahren, Begriffsdefinitionen</span>
                  <span className="font-mono font-bold text-slate-800">DIN 18007</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailliertes Fachmodul: Ersatzbaustoffverordnung (EBV) & GefStoffV 2024/2026 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* EBV Systematik */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-home-grau/20">
                <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                  <Recycle size={18} className="text-shiraz" />
                  Ersatzbaustoffverordnung (EBV) – Materialklassen &amp; Einbauweisen
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                  Seit 01.08.2023 Bundesrecht
                </span>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Die EBV harmonisiert das Recycling mineralischer Baustoffe bundesweit verbindlich und löst LAGA M20 ab. 
                Sie definiert konkrete Materialklassen und Einbauweisen abhängig von den hydrogeologischen Bedingungen (Grundwasserabstand, Wasserschutzgebiet):
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/15">
                  <strong className="text-shiraz block mb-1">Recycling-Baustoffe (RC-1, RC-2, RC-3):</strong>
                  <ul className="list-disc list-inside space-y-0.5 text-text-main/80 text-[11px]">
                    <li><strong>RC-1:</strong> Höchste Güteklasse (geringste Eluatwerte). Einbau ohne technische Sicherungsmaßnahmen auch im ungebundenen Straßenoberbau und Wegebau zulässig.</li>
                    <li><strong>RC-2:</strong> Mittlere Belastung. Einbau in definierten Einbauweisen (z. B. unter wasserundurchlässiger Deckschicht wie Asphalt oder Pflaster mit mineralischer Abdichtung).</li>
                    <li><strong>RC-3:</strong> Eingeschränkter Einbau nur mit strikter bautechnischer Sicherung und behördlicher Anzeige bei der unteren Abfallwirtschaftsbehörde.</li>
                  </ul>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/15">
                  <strong className="text-slate-800 block mb-1">Bodenmaterial (BM) &amp; Gleisschotter (GS):</strong>
                  <p className="text-[11px] text-text-main/80 leading-relaxed">
                    Klassen BM-0 (unbelasteter Oberboden/Boden), BM-F1 bis BM-F3 sowie GS-0 bis GS-3. Mindestabstand zum höchsten zu erwartenden Grundwasserstand (HGW) beträgt in der Regel ≥ 1,0 m (in Karst- oder kiesigen Gebieten strengere Auflagen).
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-700 font-mono">
                  Güteüberwachung nach EBV: Eignungsnachweis + Werkseigene Produktionskontrolle (WPK) + regelmäßige Fremdüberwachung durch akkreditierte Prüfstellen.
                </div>
              </div>
            </div>

            {/* GefStoffV & TRGS 519 Ampelmodell */}
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-home-grau/20">
                <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                  <ShieldAlert size={18} className="text-shiraz" />
                  GefStoffV-Novelle &amp; TRGS 519 – Bauherrenpflicht &amp; Ampelmodell
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-red-50 text-red-800 rounded border border-red-200">
                  Stand 2024 / 2026
                </span>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Die novellierte Gefahrstoffverordnung (GefStoffV) verankert erstmals eine gesetzliche 
                <strong>Mitwirkungs- und Informationspflicht des Bauherrn/Veranlassers</strong> zur Schadstofferkundung im Bestand:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-red-50/40 rounded-lg border border-red-200 space-y-1">
                  <strong className="text-red-900 block text-xs">Gesetzliche Erkundungspflicht für Bauten vor dem 31.10.1993:</strong>
                  <p className="text-[11px] text-red-950/80 leading-relaxed">
                    Vor Beginn von Abbruch-, Umbau- oder Instandhaltungsarbeiten muss der Veranlasser das Gebäude auf Asbest und verdeckte Gefahrstoffe (insb. asbesthaltige Spachtelmassen, Fliesenkleber, Putze nach VDI 6202 Bl. 3) durch eine sachkundige Person erkunden lassen und den Ausführenden schriftlich mitteilen.
                  </p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-1.5">
                  <strong className="text-text-main block text-xs">Risikobasiertes Ampelmodell der TRGS 519:</strong>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                    <div className="p-2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Grün: &lt; 10.000 F/m³
                      <span className="font-normal block text-[9.5px] mt-0.5 text-emerald-800">Geringe Exposition (BT-Verfahren)</span>
                    </div>
                    <div className="p-2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      Gelb: 10.000–100.000 F/m³
                      <span className="font-normal block text-[9.5px] mt-0.5 text-amber-800">Mittlere Exposition (Erweiterter Schutz)</span>
                    </div>
                    <div className="p-2 rounded bg-red-100 text-red-900 border border-red-300">
                      Rot: &gt; 100.000 F/m³
                      <span className="font-normal block text-[9.5px] mt-0.5 text-red-800">Hohe Exposition (Schwarz-Weiß / 4-Kammer)</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-main/70 leading-relaxed pt-1">
                    Bauen im Bestand erfordert bei abrasiven Tätigkeiten (Fräsen, Schleifen, Stemmen) baumustergeprüfte Entstauber der Staubklasse H und zertifizierte emissionsarme Verfahren (BT-Verfahren).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Praxis-Szenarien & Behördenwegweiser */}
      {activeTab === 'praxis' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bavaria specific workflow map */}
          <div className="md:col-span-4 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-1.5 pb-2 border-b border-home-grau/10">
              <FileCheck size={16} className="text-shiraz" /> Behördenwegweiser Bayern
            </h3>
            <p className="text-xs text-text-main/70 leading-relaxed">
              Die bauordnungs- und abfallrechtliche Vorbereitung eines Rückbaus in einer bayerischen Gemeinde / Kreisstadt erfordert feste Schritte:
            </p>

            <div className="relative border-l border-shiraz pl-4 space-y-4 ml-2">
              <div className="relative">
                <span className="absolute -left-6 bg-shiraz text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span className="text-xs font-bold text-text-main block">Gemeinde / Bauordnungsamt</span>
                <p className="text-xs text-text-main/70">Anzeige des Abbruchs nach BayBO (Art. 57 Abs. 5 Gesetzlicher Verfahrensfreie Vorhaben).
          </p>
        </div>
              <div className="relative">
                <span className="absolute -left-6 bg-shiraz text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span className="text-xs font-bold text-text-main block">Untere Umweltschutzbehörde</span>
                <p className="text-xs text-text-main/70">Vorlage des Schadstoffkatasters (VDI 6202 Blatt 1) für asbestbelastete Putze oder PCB-Fugen.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-6 bg-shiraz text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span className="text-xs font-bold text-text-main block">Gewerbeaufsichtsamt (GAA)</span>
                <p className="text-xs text-text-main/70">Anzeige der Schadstoffarbeiten nach TRGS 519 (Asbest) mind. 7 Tage vor Arbeitsbeginn.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-6 bg-shiraz text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span className="text-xs font-bold text-text-main block">LfU / Abfallregister (eANV)</span>
                <p className="text-xs text-text-main/70">Elektronisches Nachweisverfahren (Begleitscheine und Übernahmescheine gefährlicher Abfälle).</p>
              </div>
            </div>
          </div>

          {/* Real-world Scenarios (8 cols) */}
          <div className="md:col-span-8 bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
            <h3 className="text-sm font-bold text-text-main mb-4">Typische Rückbaufehler & Pitfalls aus der Praxis</h3>
            
            <div className="space-y-4">
              <div className="border border-red-200 bg-red-50/20 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 block"></span> Schadstoffverschleppung im Putz (Asbestfalle)
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-2">
                  <strong>Szenario:</strong> Ein altes Bürogebäude (Baujahr 1978) wird maschinell abgebrochen. Der Putz enthält 
                  flächig verteilt 0,1 % Asbest (früher üblich als Haftvermittler). 
                </p>
                <div className="text-xs text-red-800 font-semibold bg-red-100/30 p-2 rounded">
                  <strong>Die LfU-Konsequenz:</strong> Ohne vorherige Entfrachtung des asbesthaltigen Putzes (durch Fräsverfahren) 
                  kontaminiert der Abbruch den gesamten Ziegel- und Betonabbruch. Tonnenweise Material muss unter extrem 
                  hohen Kosten als Sondermüll auf Deponien (DK III) entsorgt werden, anstatt hochwertig aufbereitet zu werden.
                </div>
              </div>

              <div className="border border-orange-200 bg-orange-50/20 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 block"></span> Mangelhafte Dokumentation der GewAbfV
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-2">
                  <strong>Szenario:</strong> Ein Generalunternehmer mischt Altholz (A II-Fensterrahmen) und Gipskartonplatten im Bauschuttcontainer, um Transportkosten zu sparen.
                </p>
                <div className="text-xs text-orange-900 font-semibold bg-orange-100/30 p-2 rounded">
                  <strong>Die Kontrollreaktion:</strong> Der Deponiebetreiber bzw. die Aufbereitungsanlage weist die Charge zurück (Gipsstaub sulfatiert Asphaltdeckschichten). Das LfU ordnet ein empfindliches Bußgeld an und beschlagnahmt die nicht deklarierten Transportfahrzeuge.
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50/20 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 block"></span> Verwertung von Asphalt im Wegebau
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-2">
                  <strong>Szenario:</strong> Ausbauasphalt aus einer alten Betriebseinfahrt wird ohne Voruntersuchung (Teerfreiheit) aufbereitet und als Frostschutzschicht im Wegebau wieder eingebaut.
                </p>
                <div className="text-xs text-indigo-900 font-semibold bg-blue-100/30 p-2 rounded">
                  <strong>Die gesetzliche Hürde (EBV):</strong> Teerhaltiger Straßenaufbruch (PAK-reich) hat im Erdbau absolut nichts verloren (Gefahr der Auswaschung ins Grundwasser). Vor Einbau ist eine Bindemittelanalyse zwingend erforderlich. Belasteter Asphalt muss thermisch dekarbonisiert werden.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer references */}
      <ModuleFooter
        wikipedia={[
          { title: 'Rückbau (Bauwesen)', url: 'https://de.wikipedia.org/wiki/R%C3%BCckbau' },
          { title: 'Ersatzbaustoffverordnung', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' },
          { title: 'Asbestsanierung', url: 'https://de.wikipedia.org/wiki/Asbestsanierung' }
        ]}
        literatur={[
          'Bayerisches Landesamt für Umwelt (LfU): Leitfaden für den umweltgerechten Rückbau von Gebäuden (Augsburg)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN 18007 (Abbruch- und Rückbauarbeiten - Begriffe, Verfahren, Arbeitssicherheit)', url: 'https://www.dinmedia.de/de/suche?q=DIN+18007' },
          { title: 'VDI 6210 Blatt 1 & Blatt 2 (Rückbau baulicher und technischer Anlagen)', url: 'https://www.vdi.de/' },
          { title: 'DIN SPEC 91484 (Verfahren für das Rückbau-Audit vor Abbrucharbeiten)', url: 'https://www.dinmedia.de/de/suche?q=DIN+SPEC+91484' },
          { title: 'DIN SPEC 91525-1 (Digitaler Gebäuderessourcenpass für den zirkulären Rückbau)', url: 'https://www.dinmedia.de/de/suche?q=DIN+SPEC+91525-1' },
          { title: 'VDI 6202 Blatt 1 (Schadstoffbelastete bauliche Anlagen - Erkundung und Bewertung)', url: 'https://www.vdi.de/' },
          { title: 'Ersatzbaustoffverordnung (EBV)', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' },
          { title: 'Gewerbeabfallverordnung (GewAbfV)', url: 'https://www.gesetze-im-internet.de/gewabfv_2017/' },
          { title: 'TRGS 519 (Asbest: Abbruch-, Sanierungs- oder Instandhaltungsarbeiten)', url: 'https://www.baua.de/' }
        ]}
        formeln={[
          {
            formel: 'M_{\\text{Sortenrein}} = \\frac{\\sum m_{\\text{getrennt}}}{\\sum m_{\\text{gesamt}}} \\ge 0.90 \\quad (90\\%\\text{-Getrenntsammlungsquote})',
            erklaerung: 'Gesetzlich geforderte Getrenntsammlungsquote der Gewerbeabfallverordnung (GewAbfV § 8) für mineralische und nicht-mineralische Bau- und Abbruchabfälle.',
            quelle: 'GewAbfV § 8 Abs. 1'
          },
          {
            formel: 'C_{\\text{Eluat}} \\le C_{\\text{MEW}} \\quad [\\mu\\text{g/l bzw. mg/l}]',
            erklaerung: 'Eluat-Grenzwerteinhaltung nach Ersatzbaustoffverordnung (EBV) zur Klassifizierung mineralischer Ersatzbaustoffe (z.B. RC-1, RC-2) und Vermeidung von Grundwassereinträgen.',
            quelle: 'EBV Anlage 1 & 2'
          }
        ]}
      />
    </div>
  );
}
