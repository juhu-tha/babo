import type { LucideIcon } from 'lucide-react';
import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  FileText, ShieldCheck, Scale, AlertTriangle, FileSignature, CheckCircle, Globe, 
  Building, ShieldAlert, Briefcase, Leaf, Search, ArrowUpRight, ClipboardCheck,
  Award, BookOpen
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';
import { getNormsByCategory } from '@/src/data/centralNormenRegistry';

const REGELUNGS_HIERARCHIE_DATA = [
  {
    level: 1,
    title: "1. Europäisches Recht (EU-Ebene)",
    subtitle: "Harmonisierte Verordnungen & Richtlinien",
    scope: "Europäischer Wirtschaftsraum (EWR)",
    icon: "globe",
    colorClass: "bg-blue-50 border-blue-200 text-blue-900 border-l-4 border-l-blue-500",
    badgeColor: "bg-blue-100 text-blue-800",
    bindingForce: "Unmittelbare Geltung (Verordnungen) oder Pflicht zur nationalen Umsetzung (Richtlinien). Europäisches Recht hat Anwendungsvorrang vor nationalem Recht.",
    summary: "Einflüsse und Technik-Harmonisierungen aus Brüssel, die das freie Inverkehrbringen von Bauprodukten sichern und Mindestanforderungen vorschreiben.",
    detailDesc: "Die Europäische Union erlässt vor allem Verordnungen zur Angleichung des Binnenmarktes. Für das Bauwesen ist insbesondere die Bauproduktenverordnung (BauPVO) von fundamentaler Bedeutung, da sie die Anforderungen an das CE-Kennzeichen stellt.",
    items: [
      {
        name: "Bauproduktenverordnung (BauPVO)",
        abbreviation: "BauPVO (EU) 2024/3110 / VO (EU) 305/2011",
        description: "Regelt das Inverkehrbringen und die Bereitstellung von Bauprodukten auf dem europäischen Markt durch harmonisierte technische Spezifikationen (hEN, EAD). Die neue BauPVO (EU) 2024/3110 gilt seit 08.01.2026; die VO (EU) 305/2011 bleibt für bereits zitierte hEN übergangsweise anwendbar. Neu: Leistungs- und Konformitätserklärung sowie digitaler Produktpass.",
        impact: "Für Produkte, die von einer harmonisierten technischen Spezifikation erfasst sind, muss der Hersteller eine Leistungserklärung (DoP) erstellen und die CE-Kennzeichnung anbringen; ohne sie darf das Produkt nicht in Verkehr gebracht werden. Ob es für ein konkretes Bauwerk verwendet werden darf, regelt zusätzlich das nationale Bauordnungsrecht (MVV TB).",
        regulatoryLevel: "Verordnung"
      },
      {
        name: "EU-Gebäuderichtlinie (EPBD)",
        abbreviation: "Richtlinie (EU) 2024/1275 / RL 2010/31/EU",
        description: "Neufassung der Richtlinie über die Gesamtenergieeffizienz von Gebäuden (EPBD 2024). Schreibt Nullemissionsgebäude bis 2030 (öffentliche Gebäude bis 2028), Ausstieg aus fossilen Heizungen und Solarpflichten vor.",
        impact: "Die Richtlinie bindet nicht unmittelbar den Bürger, sondern verpflichtet die Mitgliedstaaten zur Umsetzung bis Mai 2026. In Deutschland erfolgt sie über das Gebäudemodernisierungsgesetz (GModG); die EPBD-bezogenen Teile gelten ab 01.01.2027.",
        regulatoryLevel: "Richtlinie"
      },
      {
        name: "REACH-Verordnung",
        abbreviation: "Verordnung (EG) Nr. 1907/2006",
        description: "Chemikalienverordnung zur Registrierung, Bewertung, Zulassung und Beschränkung chemischer Stoffe zum Schutz von Gesundheit und Umwelt.",
        impact: "Baut Produkthersteller in die Pflicht, Sicherheitsdatenblätter (SDB) bereitzustellen. Wichtig bei Schadstofffragen, Gefahrstoffen auf Baustellen und Klebstoffen, Farben, Harzen.",
        regulatoryLevel: "Verordnung"
      },
      {
        name: "EU-Taxonomie-Verordnung",
        abbreviation: "Verordnung (EU) 2020/852",
        description: "Regelt die Kriterien zur Bestimmung, ob eine Wirtschaftstätigkeit (wie der Bau eines Gebäudes oder die Herstellung eines Baustoffs) als ökologisch nachhaltig einzustufen ist, insbesondere bezogen auf Klimaschutz und Kreislaufwirtschaft.",
        impact: "Beeinflusst den Zugang zu nachhaltigen Finanzierungen (Sustainable Finance). Für Neubau und Renovierung verlangen die technischen Bewertungskriterien u. a., dass mindestens 70 % (Masse) der nicht gefährlichen Bau- und Abbruchabfälle für Wiederverwendung oder Recycling vorbereitet werden.",
        regulatoryLevel: "Verordnung"
      }
    ]
  },
  {
    level: 2,
    title: "2. Nationales Gesetzesrecht (Bundesebene)",
    subtitle: "Bundesgesetze & Bundesverordnungen",
    scope: "Bundesrepublik Deutschland (national)",
    icon: "scale",
    colorClass: "bg-indigo-50 border-indigo-200 text-indigo-900 border-l-4 border-l-indigo-500",
    badgeColor: "bg-indigo-100 text-indigo-800",
    bindingForce: "Verbindliches Recht des Bundes. Verstöße können zur Unzulässigkeit eines Vorhabens, zu Bußgeldern oder zu behördlichen Anordnungen führen.",
    summary: "Gesetze und Verordnungen, die vom Bundestag beschlossen oder über Ermächtigungsgrundlagen von der Bundesregierung erlassen werden.",
    detailDesc: "Das Bundesrecht regelt vor allem das allgemeine raumbezogene Planungsrecht (Wo und Was darf gebaut werden?), den Umweltschutz, die stofflichen Abfalleinstufungen sowie die übergeordneten energetischen Ziele Deutschlands.",
    items: [
      {
        name: "Baugesetzbuch (BauGB)",
        abbreviation: "BauGB",
        description: "Das fundamentale Bundesgesetz des Städtebaurechts. Regelt die städtebauliche Planung (Bebauungspläne), die Zulässigkeit von Bauvorhaben im Innen- und Außenbereich (§§ 34, 35) sowie die Bodenordnung.",
        impact: "Das BauGB definiert, unter welchen planungsrechtlichen Voraussetzungen ein Grundstück bebaut werden darf. Ein planungsrechtlich unzulässiges Vorhaben ist nicht genehmigungsfähig (Ausnahmen und Befreiungen nach § 31 BauGB).",
        regulatoryLevel: "Formelles Bundesgesetz"
      },
      {
        name: "Baunutzungsverordnung (BauNVO)",
        abbreviation: "BauNVO",
        description: "Konkretisiert das BauGB bezüglich der Art der baulichen Nutzung (z.B. reines Wohngebiet, Mischgebiet, Gewerbegebiet) und des Maßes der baulichen Nutzung (Grundflächenzahl GRZ, Geschossflächenzahl GFZ).",
        impact: "Gemeinden müssen bei der Erstellung ihrer Bebauungspläne die Kategorien der BauNVO anwenden. Dies schränkt ein, ob z.B. ein Bürogebäude in einem reinen Wohngebiet zulässig ist.",
        regulatoryLevel: "Rechtsverordnung"
      },
      {
        name: "Gebäudemodernisierungsgesetz (GModG, bis 28.07.2026 Gebäudeenergiegesetz GEG)",
        abbreviation: "GModG (vormals GEG)",
        description: "Das GEG (2020; Zusammenführung von EnEG, EnEV und EEWärmeG) wurde durch Änderungsgesetz in Gebäudemodernisierungsgesetz umbenannt (BGBl. vom 28.07.2026, in Kraft seit 29.07.2026). Es regelt Anforderungen an Wärmeschutz, Anlagentechnik und Primärenergiebedarf bei Neubau und Bestand; EPBD-Anforderungen folgen gestaffelt ab 2027.",
        impact: "Verstöße gegen Anforderungen können als Ordnungswidrigkeit mit Bußgeld geahndet werden. Bei Neubau, Verkauf und Vermietung ist ein Energieausweis vorzulegen.",
        regulatoryLevel: "Formelles Bundesgesetz"
      },
      {
        name: "Kreislaufwirtschaftsgesetz (KrWG)",
        abbreviation: "KrWG",
        description: "Zentrales Gesetz für den Umweltschutz im Bausektor. Regelt die 5-stufige Abfallhierarchie (Vermeidung, Vorbereitung zur Wiederverwendung, Recycling, sonstige Verwertung, Beseitigung).",
        impact: "Bauherren und Abbruchunternehmer sind rechtlich Erzeuger bzw. Besitzer von Abfällen und müssen Stoffströme (Bauschutt, gefährliche Altlasten) getrennt sammeln, dokumentieren und hochwertig verwerten.",
        regulatoryLevel: "Formelles Bundesgesetz"
      },
      {
        name: "Ersatzbaustoffverordnung (EBV)",
        abbreviation: "ErsatzbaustoffV (Teil der MantelV)",
        description: "Seit August 2023 in Kraft. Regelt bundesweit einheitlich den rechtskonformen Einsatz mineralischer Ersatzbaustoffe (z.B. RC-Baustoffe, Schlacken, Aschen) in technischen Bauwerken zum Schutz von Boden und Grundwasser.",
        impact: "Ordnet RC-Baustoffe Materialklassen zu (z. B. RC-1, RC-2, RC-3) und legt zulässige Einbauweisen fest. Wichtig: Ersatzbaustoffe bleiben auch bei Einhaltung der Werte rechtlich Abfall – eine bundesweite Abfallende-Regelung ist nur angekündigt (Stand Oktober 2026); eine Novelle der Verordnung befindet sich im Verfahren.",
        regulatoryLevel: "Rechtsverordnung"
      }
    ]
  },
  {
    level: 3,
    title: "3. Landesrecht (Bundesländer-Ebene)",
    subtitle: "Landesbauordnungen & Landesgesetze",
    scope: "Spezifisches Bundesland (z.B. Freistaat Bayern)",
    icon: "building",
    colorClass: "bg-emerald-50 border-emerald-200 text-emerald-900 border-l-4 border-l-emerald-500",
    badgeColor: "bg-emerald-100 text-emerald-800",
    bindingForce: "Verbindliches Recht des jeweiligen Bundeslandes. Maßgeblich für Genehmigungsverfahren und bauliche Ausführung.",
    summary: "Gesetze, die von den Landesparlamenten beschlossen werden. Aufgrund der Kulturhoheit und Bauordnungskompetenz liegt das technische Bauordnungsrecht vollständig bei den Ländern.",
    detailDesc: "Während das Bundesrecht die planerische Zulässigkeit (Wo?) regelt, bestimmt das Landesrecht die konkrete bauliche Ausführung (Wie darf gebaut werden, damit keine Gefahren entstehen?).",
    items: [
      {
        name: "Bayerische Bauordnung (BayBO)",
        abbreviation: "BayBO",
        description: "Das Landesgesetz für Baumaßnahmen im Freistaat Bayern. Regelt Standsicherheit, Brandschutz, Fluchtwege, Barrierefreiheit, Stellplatzpflicht sowie Abstandsflächen und Bauantragsverfahren.",
        impact: "Hier ist geregelt, ob ein Vorhaben baugenehmigungspflichtig ist oder im vereinfachten Genehmigungsverfahren abläuft. Ein Verstoß gegen Abstandsflächen oder Brandschutz führt zum Baustopp.",
        regulatoryLevel: "Landesgesetz"
      },
      {
        name: "Verwaltungsvorschrift Technische Baubestimmungen",
        abbreviation: "BayTB / VV TB (nach MVV TB)",
        description: "Verbindliche Liste technischer Vorschriften und Normen (z.B. ausgewählte DIN-Normen, Eurocodes), die zur Erfüllung der bauordnungsrechtlichen Grundanforderungen an Tragfähigkeit und Brandschutz zwingend einzuhalten sind.",
        impact: "Durch die Aufnahme einer technischen Regel als Technische Baubestimmung wird sie bauaufsichtlich verbindlich (Art. 81a BayBO bzw. § 85a MBO); Abweichungen sind nur mit gleichwertiger Lösung zulässig.",
        regulatoryLevel: "Verwaltungsvorschrift"
      },
      {
        name: "Sonderbauverordnungen (z.B. BayVStättV, GaStellV)",
        abbreviation: "VStättV / GaV / HHR",
        description: "Spezialvorschriften für Bauten mit erhöhtem Gefährdungspotenzial (Versammlungsstätten ab 200 Personen, Großgaragen ab 1000m², Hochhäuser über 22m, Verkaufsstätten).",
        impact: "Enthalten extrem scharfe zusätzliche Brandschutz-, Lüftungs- und Fluchtwegauflagen, die weit über die Standardanforderungen der regulären BayBO hinausgehen.",
        regulatoryLevel: "Rechtsverordnung der Landesregierung"
      }
    ]
  },
  {
    level: 4,
    title: "4. Kommunales Recht (Orts-Satzungsrecht)",
    subtitle: "Gemeindliche Satzungen & Ortssatzungen",
    scope: "Gemeinde- oder Stadtgebiet",
    icon: "globe",
    colorClass: "bg-amber-50 border-amber-200 text-amber-900 border-l-4 border-l-amber-500",
    badgeColor: "bg-amber-100 text-amber-800",
    bindingForce: "Verbindliches Ortsrecht. Steht in der Hierarchie unter den Landesgesetzen, hat aber für das konkrete Grundstück unmittelbare Rechtswirkung.",
    summary: "Rechtsnormen, die von Städten und Gemeinden im Rahmen ihrer verfassungsmäßigen kommunalen Selbstverwaltung erlassen werden.",
    detailDesc: "Das Kommunalrecht regelt die parzellenscharfe Zulassung von Gebäuden und die Einhaltung eines harmonischen städtebaulichen Ortsbildes.",
    items: [
      {
        name: "Bebauungspläne (B-Plan)",
        abbreviation: "B-Plan",
        description: "Eine gemeindliche Satzung gemäß § 10 BauGB. Setzt verbindlich fest, welche Nutzungen auf den einzelnen Grundstücken zulässig sind (z.B. Firstrichtung, Dachneigung, Traufhöhe, Baulinien, Pflanzgebote).",
        impact: "Der B-Plan ist die absolut wichtigste Planungsgrundlage. Ein Entwurf, der die Baugrenzen oder zulässigen Dachformen ohne genehmigte Befreiung missachtet, wird vom Bauamt nicht genehmigt.",
        regulatoryLevel: "Kommunale Satzung"
      },
      {
        name: "Gestaltungssatzung",
        abbreviation: "GestS",
        description: "Regelt gestalterische Merkmale der Gebäude zur Erhaltung des charakteristischen Ortsbildes (z.B. Vorgaben zu Fassadenmaterialien, Farbpaletten, Fenstertypen, Werbeanlagen, Altstadtschutz).",
        impact: "Ermöglicht Kommunen, als örtliche Bauvorschrift (z. B. Art. 81 BayBO) gestalterische Vorgaben für historisch gewachsene Ortskerne verbindlich festzulegen.",
        regulatoryLevel: "Kommunale Satzung"
      },
      {
        name: "Stellplatzsatzung / Baumbestandssatzung",
        abbreviation: "StellpS / BaumbS",
        description: "Regelt ortsspezifisch, wie viele PKW- und Fahrradstellplätze je neu gebauter Wohneinheit nachgewiesen werden müssen, bzw. ab welchem Stammumfang Bäume auf privaten Grundstücken geschützt sind.",
        impact: "Kann zu erheblichen Mehrkosten führen, wenn beispielsweise kostspielige Tiefgaragenplätze gebaut werden müssen oder eine Stellplatzablöse an die Gemeinde fällig wird.",
        regulatoryLevel: "Kommunale Satzung"
      }
    ]
  },
  {
    level: 5,
    title: "5. Vertragliches Privatrecht",
    subtitle: "Bürgerliches Gesetzbuch & VOB/B",
    scope: "Nur zwischen den Vertragsparteien",
    icon: "briefcase",
    colorClass: "bg-purple-50 border-purple-200 text-purple-900 border-l-4 border-l-purple-500",
    badgeColor: "bg-purple-100 text-purple-800",
    bindingForce: "Privatrechtlich bindend durch Vertragsschluss. Ermöglicht schadensersatzrechtliche Ansprüche, Minderung, Kündigung und Nachbesserung.",
    summary: "Gesetzliche und vertragliche Grundlagen, die das Rechtsverhältnis zwischen dem Besteller (Bauherr) und den beauftragten Unternehmern/Planern regeln.",
    detailDesc: "Abseits des öffentlichen Baurechts (Bauamt) wird hier die kaufmännische und werkvertragliche Qualität des Bauwerks vertraglich festgeschrieben.",
    items: [
      {
        name: "BGB-Werkvertragsrecht",
        abbreviation: "§§ 631 ff. BGB",
        description: "Das gesetzliche Fundament für Bau- und Planerverträge in Deutschland. Vergütungspflicht bei Abnahme, Anspruch auf Mängelbeseitigung und Haftung.",
        impact: "Gilt, soweit vertraglich nichts anderes wirksam vereinbart ist; seit 2018 mit eigenem Bauvertragsrecht (§§ 650a ff. BGB). Mängelansprüche bei Bauwerken verjähren in 5 Jahren ab Abnahme (§ 634a BGB).",
        regulatoryLevel: "Zivilgesetzbuch (Bundesrecht)"
      },
      {
        name: "Vergabe- und Vertragsordnung für Bauleistungen - Teil B",
        abbreviation: "VOB/B",
        description: "Vorformulierte Vertragsbedingungen (AGB) für Bauverträge. Regelt u. a. Vergütung, Nachträge, Behinderung, Abnahme und Mängelansprüche.",
        impact: "Gilt nur, wenn sie vereinbart wird; nur bei Vereinbarung als Ganzes und gegenüber Unternehmern ist sie der AGB-Inhaltskontrolle entzogen. Verjährung für Bauwerke: 4 Jahre nach § 13 Abs. 4 VOB/B.",
        regulatoryLevel: "Allgemeine Geschäftsbedingung (AGB-Standard)"
      },
      {
        name: "HOAI (Honorarordnung)",
        abbreviation: "HOAI",
        description: "Regelt die Honorarermittlung für Architekten- und Ingenieurleistungen anhand der anrechenbaren Kosten, Honorarzonen und Leistungsphasen (1 bis 9).",
        impact: "Nach dem EuGH-Urteil vom 04.07.2019 (C-377/17) sind die Honorare seit der HOAI 2021 frei vereinbar; die Honorartafeln dienen als Orientierung, ohne Vereinbarung gilt der Basishonorarsatz.",
        regulatoryLevel: "Bundes-Rechtsverordnung"
      },
      {
        name: "Gebäudetyp E (BGB-Reform & Landesinitiativen)",
        abbreviation: "Gebäudetyp E (Gesetzentwurf)",
        description: "Initiative für einfacheres und günstigeres Bauen (Bayern mit Pilotprojekten „Gebäudetyp E“; auf Bundesebene ein Gesetzentwurf zur Änderung des BGB-Bauvertragsrechts, im parlamentarischen Verfahren seit 06/2026). Ziel: Abweichungen von nicht sicherheitsrelevanten technischen Standards vertraglich rechtssicherer zu machen, solange Schutzziele wie Standsicherheit und Brandschutz gewahrt bleiben.",
        impact: "Soll reduziertes Bauen erleichtern: Vereinbaren fachkundige Vertragsparteien eine Abweichung von Komfortstandards (z. B. erhöhter Schallschutz, Ausstattungsnormen), soll diese nicht automatisch als Mangel gelten. Bis zum Inkrafttreten gilt das bisherige Recht – Abweichungen sind weiterhin ausdrücklich und aufgeklärt zu vereinbaren.",
        regulatoryLevel: "Gesetzentwurf (Stand Oktober 2026)"
      }
    ]
  },
  {
    level: 6,
    title: "6. Private Technische Regeln & Normung",
    subtitle: "DIN, EN, ISO, VDI, DAFStB & DIBt",
    scope: "Technischer Standard (national/weltweit)",
    icon: "shieldAlert",
    colorClass: "bg-rose-50 border-rose-200 text-rose-900 border-l-4 border-l-rose-500",
    badgeColor: "bg-rose-100 text-rose-800",
    bindingForce: "Kein Gesetz. Für DIN-Normen besteht aber die widerlegbare Vermutung, die allgemein anerkannten Regeln der Technik (aRdT) wiederzugeben. Wer ohne Vereinbarung von den aRdT abweicht, liefert in der Regel ein mangelhaftes Werk.",
    summary: "Wissenschaftlich erarbeitete, freiwillig anwendbare Standards zur Definition von Abmessungen, Prüfverfahren, Materialparametern und Verarbeitungsregeln im Hochbau.",
    detailDesc: "Entstehen im Konsensverfahren von Wirtschaft, Forschung und öffentlicher Hand. Gerichte ziehen sie im Streitfall als wichtigen Maßstab für fachgerechtes Handeln heran.",
    items: [
      {
        name: "DIN-Normen / Europäische Normen (EN)",
        abbreviation: "DIN / DIN EN / DIN EN ISO",
        description: "Umfassender Korpus von tausenden Einzelregeln (z. B. DIN EN 206 / DIN 1045-2 für Beton, DIN 18202 für Maßtoleranzen im Hochbau, DIN 18531 bis 18535 für Abdichtungen – die frühere DIN 18195 enthält seit 2017 nur noch Begriffe).",
        impact: "Werden als Standard für fachgerechtes Arbeiten vermutet. Weicht ein Unternehmer ohne Vereinbarung von einer Norm ab, muss er im Streitfall darlegen, dass seine Ausführung dennoch den anerkannten Regeln der Technik entspricht.",
        regulatoryLevel: "Technischer Standard"
      },
      {
        name: "Nationale Verwendbarkeits- und Anwendbarkeitsnachweise",
        abbreviation: "abZ / aBG / abP / ZiE / vBG",
        description: "Allgemeine bauaufsichtliche Zulassung (abZ) und allgemeine Bauartgenehmigung (aBG) erteilt das Deutsche Institut für Bautechnik (DIBt) für Bauprodukte bzw. Bauarten ohne Technische Baubestimmung; das allgemeine bauaufsichtliche Prüfzeugnis (abP) erteilt eine anerkannte Prüfstelle; Zustimmung im Einzelfall (ZiE) und vorhabenbezogene Bauartgenehmigung (vBG) die oberste Bauaufsichtsbehörde.",
        impact: "Ermöglicht die Verwendung neuer Produkte und Bauarten (z. B. Spezialdübel, neuartige Dämmsysteme). Fehlt der erforderliche Nachweis, ist das Produkt für diesen Zweck nicht verwendbar.",
        regulatoryLevel: "Verwaltungsakt"
      },
      {
        name: "Allgemeine Technische Vertragsbedingungen (VOB/C)",
        abbreviation: "VOB/C (ATV)",
        description: "Das technische Bindeglied bei Werkverträgen. Enthält gewerkespezifische Ausführungs- und Abrechnungsvorschriften (z.B. Messregeln, Nebenleistungen).",
        impact: "Wird bei Vereinbarung der VOB/B automatisch Vertragsbestandteil (§ 1 Abs. 1 VOB/B). Klärt z. B., wie Leistungen abzurechnen sind (Übermessungsregeln für Öffnungen) und welche Nebenleistungen nicht gesondert vergütet werden.",
        regulatoryLevel: "Vertragsrelevante DIN-Normensammlung"
      }
    ]
  }
];

const levelIcons: Record<string, LucideIcon> = {
  globe: Globe,
  scale: Scale,
  building: Building,
  briefcase: Briefcase,
  shieldAlert: ShieldAlert,
  fileText: FileText,
  fileSignature: FileSignature,
  award: Award,
};

export default function Regularien() {
  const [activeTab, setActiveTab] = useState<'hierarchie' | 'katalog' | 'normen'>('hierarchie');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [hierarchySearchTerm, setHierarchySearchTerm] = useState('');
  const { setActiveTab: setGlobalActiveTab } = useTabContext();

  // Filtering norms dynamically from Central SSOT Registry
  const allNormCategories = getNormsByCategory();
  const filteredNormenData = allNormCategories.map(group => {
    const norms = group.norms.filter(norm => 
      norm.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      norm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      norm.beschreibung.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...group, norms };
  }).filter(group => group.norms.length > 0);

  // Filtering regulations hierarchy based on search term
  const filteredHierarchy = REGELUNGS_HIERARCHIE_DATA.map(level => {
    const term = hierarchySearchTerm.toLowerCase().trim();
    if (!term) {
      return { ...level, hasMatches: true, matchedItems: level.items };
    }

    const levelMatches = 
      level.title.toLowerCase().includes(term) || 
      level.subtitle.toLowerCase().includes(term) || 
      level.scope.toLowerCase().includes(term) || 
      level.summary.toLowerCase().includes(term) ||
      level.detailDesc.toLowerCase().includes(term) ||
      level.bindingForce.toLowerCase().includes(term);

    const matchedItems = level.items.filter(item => 
      item.name.toLowerCase().includes(term) ||
      item.abbreviation.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.impact.toLowerCase().includes(term) ||
      item.regulatoryLevel.toLowerCase().includes(term)
    );

    if (levelMatches || matchedItems.length > 0) {
      return {
        ...level,
        matchedItems: levelMatches ? level.items : matchedItems,
        hasMatches: true
      };
    }
    return { ...level, matchedItems: [], hasMatches: false };
  }).filter(level => level.hasMatches);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Scale size={24} />
          </div>
          <h2 className="text-2xl font-bold text-text-main">Regulatives im Bauwesen</h2>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Baustoffe und Bauprodukte unterliegen strengen nationalen und europäischen Regularien. Erleben Sie die <strong>Hierarchie aller Regelungen</strong> – vom europäischen Leitfaden bis zu den privaten Regeln der Technik vor Ort.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-home-grau/30 overflow-x-auto w-full">
          <button aria-pressed={activeTab === 'hierarchie'}
            className={`px-5 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'hierarchie' ? 'border-shiraz text-shiraz' : 'border-transparent text-home-grau hover:text-text-main'
            }`}
            onClick={() => setActiveTab('hierarchie')}
          >
            <Scale size={16} /> Hierarchie aller Regelungen
          </button>
          <button aria-pressed={activeTab === 'katalog'}
            className={`px-5 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'katalog' ? 'border-shiraz text-shiraz' : 'border-transparent text-home-grau hover:text-text-main'
            }`}
            onClick={() => setActiveTab('katalog')}
          >
            <Building size={16} /> Grundbegriffe &amp; Bauaufsicht
          </button>
          <button aria-pressed={activeTab === 'normen'}
            className={`px-5 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'normen' ? 'border-shiraz text-shiraz' : 'border-transparent text-home-grau hover:text-text-main'
            }`}
            onClick={() => setActiveTab('normen')}
          >
            <ClipboardCheck size={16} /> Technische Normen (Katalog)
          </button>
        </div>

        {/* Tab 0: Hierarchie der Regelungen */}
        {activeTab === 'hierarchie' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-text-main uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={16} className="text-shiraz" />
                    Stufenbau der Rechtsordnung im deutschen Bauwesen
                  </h3>
                  <p className="text-xs text-text-main/70">
                    Suchen Sie nach bestimmten Regelungen (z. B. „BauGB“, „EBV“) oder wählen Sie direkt eine Stufe aus der rechtlichen Pyramide aus.
                  </p>
                </div>
                
                {/* Search Bar for hierarchy */}
                <div className="relative w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-home-grau">
                    <Search size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder="Regelungen durchsuchen..."
                    value={hierarchySearchTerm}
                    onChange={(e) => setHierarchySearchTerm(e.target.value)}
                    className="w-full bg-white border border-home-grau/30 rounded-lg pl-9 pr-4 py-1.5 text-xs text-text-main placeholder:text-home-grau focus:ring-1 focus:ring-shiraz focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {hierarchySearchTerm.trim() === '' ? (
              // Split screens layout (Pyramid left / Details right)
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Hierarchical selection column */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="p-1 text-[10px] font-bold text-home-grau uppercase tracking-wider block mb-1">
                    Stufe der Rechtspyramide wählen:
                  </div>
                  
                  <div className="flex flex-col gap-2.5">
                    {REGELUNGS_HIERARCHIE_DATA.map((level) => {
                      const IconComponent = levelIcons[level.icon] || FileText;
                      const isSelected = selectedLevel === level.level;
                      
                      return (
                        <button
                          key={level.level}
                          onClick={() => setSelectedLevel(level.level)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 transform ${
                            isSelected
                              ? 'bg-white border-shiraz shadow-md ring-2 ring-shiraz/20 scale-[1.01]'
                              : 'bg-slate-50/50 hover:bg-slate-55 border-home-grau/20 hover:border-home-grau/35'
                          }`}
                        >
                          <div className={`p-2.5 rounded-lg shrink-0 flex items-center justify-center ${
                            isSelected ? 'bg-shiraz/10 text-shiraz' : 'bg-slate-200/60 text-slate-550'
                          }`}>
                            <IconComponent size={20} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-[10px] uppercase font-bold tracking-wider ${
                                isSelected ? 'text-shiraz' : 'text-slate-500'
                              }`}>
                                Stufe {formatDeWert(level.level)}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${level.badgeColor}`}>
                                {level.scope}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-xs text-text-main leading-tight mt-1 truncate">
                              {level.title.replace(/^\d+\.\s+/, '')}
                            </h4>
                            <p className="text-[11px] text-text-main/60 mt-0.5 line-clamp-1">
                              {level.subtitle}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-orange-50/40 border border-orange-200 rounded-xl space-y-2 mt-4 text-xs text-slate-700">
                    <span className="font-bold flex items-center gap-1.5 text-orange-950">
                      <AlertTriangle size={14} className="text-orange-700" />
                      Der goldene Grundsatz d. Rechtshierarchie:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Höherrangiges Recht geht dem niederrangigen vor: EU-Recht hat Anwendungsvorrang vor nationalem Recht, Bundesrecht bricht Landesrecht (Art. 31 GG). Technische Regeln (z. B. DIN-Normen) sind private Regelwerke; verbindlich werden sie durch Einführung als Technische Baubestimmung oder durch Vertrag. Im Streitfall dienen sie als Maßstab für die <strong>allgemein anerkannten Regeln der Technik</strong> – Abweichungen sollten deshalb immer ausdrücklich vereinbart werden.
                    </p>
                  </div>
                </div>

                {/* Details view column */}
                <div className="lg:col-span-7 bg-white p-6 border border-home-grau/35 rounded-2xl space-y-6">
                  {(() => {
                    const level = REGELUNGS_HIERARCHIE_DATA.find(l => l.level === selectedLevel)!;
                    const IconComponent = levelIcons[level.icon] || FileText;
                    
                    return (
                      <div className="space-y-6">
                        <div className="border-b border-home-grau/20 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-slate-100 text-slate-700 border border-home-grau/20 px-2 py-0.5 rounded font-mono font-bold">
                                Stufe {formatDeWert(level.level)} von 6
                              </span>
                              <span className={`text-[10px] uppercase font-bold tracking-wider ${level.badgeColor} px-2 py-0.5 rounded`}>
                                {level.scope}
                              </span>
                            </div>
                            <h3 className="text-lg font-black text-text-main flex items-center gap-2 mt-1.5">
                              <IconComponent size={22} className="text-shiraz shrink-0" />
                              {level.title}
                            </h3>
                            <p className="text-xs text-text-main/55 font-medium italic">
                              {level.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Summary Block */}
                        <p className="text-xs text-text-main/80 leading-relaxed font-medium">
                          {level.summary}
                        </p>

                        {/* Legal force disclaimer box */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold block">
                            Rechtliche Verbindlichkeit &amp; Wirkungskraft:
                          </span>
                          <p className="text-xs font-semibold text-text-main leading-relaxed">
                            {level.bindingForce}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="font-bold text-xs text-text-main uppercase tracking-wider block mb-3">
                            Maßgebende Verordnungen, Gesetze &amp; Richtlinien:
                          </span>

                          <div className="space-y-4">
                            {level.items.map((item, idx) => (
                              <div key={idx} className="bg-white border border-home-grau/25 rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow">
                                <div className="bg-slate-50 px-4 py-3 border-b border-home-grau/15 flex flex-wrap items-center justify-between gap-2">
                                  <div className="space-y-0.5">
                                    <h4 className="font-bold text-xs text-text-main flex items-center gap-1.5 leading-tight">
                                      {item.name}
                                    </h4>
                                    {item.abbreviation && (
                                      <span className="font-mono text-[10px] text-home-grau font-semibold">
                                        Kürzel: {item.abbreviation}
                                      </span>
                                    )}
                                  </div>
                                  <span className="bg-shiraz/5 text-shiraz border border-shiraz/20 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                                    {item.regulatoryLevel}
                                  </span>
                                </div>

                                <div className="p-4 space-y-3">
                                  <p className="text-xs text-text-main/75 leading-relaxed">
                                    {item.description}
                                  </p>

                                  <div className="bg-stone-50 border border-stone-150 p-3 rounded-lg space-y-1 text-xs">
                                    <span className="text-[9px] uppercase text-stone-500 font-extrabold tracking-wider flex items-center gap-1">
                                      <ShieldAlert size={12} className="text-shiraz" />
                                      Konkrete Praxisrelevanz für das Bauprojekt:
                                    </span>
                                    <p className="text-text-main/80 text-[11px] leading-relaxed">
                                      {item.impact}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>

              </div>
            ) : (
              // Search active state layout (Search results)
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-home-grau/20 pb-2.5">
                  <span className="text-xs font-bold text-text-main flex items-center gap-2">
                    <Search size={14} />
                    Suchergebnisse für „{hierarchySearchTerm}“ ({filteredHierarchy.length} Treffer)
                  </span>
                  
                  <button
                    onClick={() => setHierarchySearchTerm('')}
                    className="text-shiraz hover:underline text-xs font-bold"
                  >
                    Suche zurücksetzen
                  </button>
                </div>

                {filteredHierarchy.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-home-grau/20 rounded-2xl bg-white text-home-grau text-xs">
                    Keine Regelungen oder Verordnungen für <strong>„{hierarchySearchTerm}“</strong> in der Hierarchie gefunden.
                    <br />
                    <span className="block mt-2 text-slate-400">Tipp: Suchen Sie nach „BauGB“, „BayBO“, „Zulassung“ oder „EBV“.</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredHierarchy.map((level) => {
                      const IconComponent = levelIcons[level.icon] || FileText;
                      return (
                        <div key={level.level} className="bg-white border border-home-grau/30 rounded-2xl overflow-hidden shadow-sm">
                          {/* Level Banner */}
                          <div className="bg-slate-50 px-5 py-3.5 border-b border-home-grau/20 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-lg bg-shiraz/10 text-shiraz shrink-0">
                                <IconComponent size={16} />
                              </div>
                              <div>
                                <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-home-grau block leading-none">
                                  Stufe {formatDeWert(level.level)} ({level.scope})
                                </span>
                                <h4 className="font-extrabold text-sm text-text-main mt-0.5">
                                  {level.title}
                                </h4>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${level.badgeColor}`}>
                              {level.scope}
                            </span>
                          </div>

                          <div className="p-5 space-y-4">
                            <p className="text-xs text-text-main/70 leading-relaxed max-w-4xl">
                              {level.detailDesc}
                            </p>

                            <div className="divide-y divide-home-grau/10">
                              {level.matchedItems && level.matchedItems.map((item, idx) => (
                                <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-2">
                                  <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <h5 className="font-extrabold text-xs text-text-main flex items-center gap-2">
                                      {item.name}
                                      {item.abbreviation && (
                                        <span className="font-mono text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-home-grau/15">
                                          {item.abbreviation}
                                        </span>
                                      )}
                                    </h5>
                                    <span className="text-[10px] bg-shiraz/5 text-shiraz font-bold border border-shiraz/20 px-2 py-0.5 rounded">
                                      {item.regulatoryLevel}
                                    </span>
                                  </div>

                                  <p className="text-xs text-text-main/75 transition-colors leading-relaxed">
                                    {item.description}
                                  </p>

                                  <div className="bg-stone-50 border border-stone-150 p-3 rounded-xl space-y-1 text-xs">
                                    <span className="text-[9px] uppercase text-stone-500 font-extrabold tracking-wider flex items-center gap-1">
                                      <ShieldAlert size={12} className="text-shiraz" />
                                      Praxisrelevanz:
                                    </span>
                                    <p className="text-slate-800 text-[11px] leading-relaxed">
                                      {item.impact}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Grundbegriffe & Gesetzliche Regularien (Katalog) */}
        {activeTab === 'katalog' && (

          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Section 1: Normung & Technikstandards */}
            <div className="mt-2">
              <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                <FileText className="text-shiraz" size={20} />
                Normung &amp; Technikstandards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Normen */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-slate-100 text-slate-700 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">Normen &amp; Richtlinien</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>ISO:</strong> Internationale Normen (weltweit)<br/>
                    <strong>EN:</strong> Europäische Normen (im EWR gültig)<br/>
                    <strong>DIN:</strong> Normen des Deutschen Instituts für Normung (national)<br/>
                    <strong>Richtlinien/Merkblätter:</strong> Ergänzende technische Regeln (z.B. DAfStb, VDI)
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Hierarchie:</strong> ISO und EN verdrängen oft nationale DIN-Normen (z.B. DIN EN ISO).
                  </div>
                </div>

                {/* Technikklauseln */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-orange-100 text-orange-700 p-2 rounded-lg">
                      <Scale size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">Technikklauseln</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Allgemein anerkannte Regeln der Technik (aRdT):</strong> Wissenschaftlich als richtig anerkannt, in der Praxis bewährt und von der Mehrheit der Fachleute angewandt (DIN-Normen können ihnen entsprechen, müssen es aber nicht).<br/>
                    <strong>Stand der Technik:</strong> Technisch machbar und fortschrittlich, aber noch nicht zwingend breit bewährt.<br/>
                    <strong>Stand von Wissenschaft und Technik:</strong> Neueste wissenschaftliche Erkenntnisse, oft noch im Laborstadium.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Relevanz:</strong> Die aRdT sind der juristische Mindeststandard für mangelfreies Bauen.
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Europäisches Recht (BauPVO) */}
            <div className="mt-4">
              <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                <Globe className="text-shiraz" size={20} />
                Europäisches Recht (BauPVO)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* BauPVO */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                      <Scale size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">BauPVO (Bauproduktenverordnung)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    BauPVO (EU) 2024/3110 (anwendbar seit 08.01.2026); für bestehende hEN gilt übergangsweise noch VO (EU) 305/2011 zur Festlegung harmonisierter Bedingungen für die Vermarktung von Bauprodukten.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Ziel:</strong> Abbau von Handelshemmnissen im Europäischen Wirtschaftsraum (EWR) durch eine gemeinsame technische Sprache.
                  </div>
                </div>

                {/* hEN */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 text-purple-700 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">hEN (Harmonisierte Norm)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    Eine von europäischen Normungsorganisationen (CEN, CENELEC) erarbeitete Norm, die im Amtsblatt der EU veröffentlicht wurde. 
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Funktion:</strong> Sie bildet die Grundlage für die Leistungserklärung und die CE-Kennzeichnung.
                  </div>
                </div>

                {/* ETA */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-cyan-100 text-cyan-700 p-2 rounded-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">ETA (Europäische Technische Bewertung)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    (European Technical Assessment) Ein Dokument zur Bewertung der Leistung eines Bauprodukts, das nicht oder nicht vollständig von einer hEN erfasst wird.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Funktion:</strong> Ermöglicht die CE-Kennzeichnung für innovative oder abweichende Produkte auf Basis eines EAD (European Assessment Document).
                  </div>
                </div>

                {/* DoP */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                      <FileSignature size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">DoP (Leistungserklärung)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    (Declaration of Performance) Ein zentrales Dokument der Bauproduktenverordnung (BauPVO). Der Hersteller deklariert darin die wesentlichen Merkmale seines Produkts.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Voraussetzung:</strong> Ohne DoP darf kein CE-Zeichen angebracht und das Produkt nicht im EWR in Verkehr gebracht werden.
                  </div>
                </div>

                {/* CE-Kennzeichnung */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                      <CheckCircle size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">CE-Kennzeichnung</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    (Conformité Européenne) Bestätigt, dass ein Bauprodukt der maßgeblichen harmonisierten europäischen Norm (hEN) oder einer Europäischen Technischen Bewertung (ETA) entspricht.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Wichtig:</strong> Das CE-Zeichen ist kein Qualitäts- oder Herkunftssiegel, sondern der "Reisepass" für den europäischen Binnenmarkt.
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Nationales Baurecht (Deutschland) */}
            <div className="mt-4">
              <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                <Building className="text-shiraz" size={20} />
                Nationales Baurecht (Deutschland)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* MBO & LBO */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                      <Building size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">MBO &amp; LBO</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Musterbauordnung (MBO):</strong> Mustergesetz der Bauministerkonferenz der Länder (ARGEBAU) – kein Bundesgesetz, sondern Vorlage zur Vereinheitlichung der Landesbauordnungen.<br/>
                    <strong>Landesbauordnungen (LBO):</strong> Länderspezifische Gesetze, die das Bauordnungsrecht regeln (Genehmigungspflichten, Abstandsflächen, Brandschutz).
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Wichtig:</strong> Baurecht ist Ländersache. Die LBO des jeweiligen Bundeslandes ist rechtlich bindend.
                  </div>
                </div>

                {/* GEG */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                      <Leaf size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">GModG (vormals GEG)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    Das Gebäudeenergiegesetz (2020, Zusammenführung von EnEG, EnEV und EEWärmeG) heißt seit 29.07.2026 Gebäudemodernisierungsgesetz. Regelt energetische Anforderungen an beheizte und klimatisierte Gebäude.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Fokus:</strong> Begrenzung des Primärenergiebedarfs und Wärmeverlusts, Nutzung erneuerbarer Energien.
                  </div>
                </div>

                {/* VV TB */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-stone-100 text-stone-700 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">VV TB</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Verwaltungsvorschrift Technische Baubestimmungen:</strong> Führt die technischen Regeln (z.B. DIN-Normen) auf, die zur Erfüllung der bauordnungsrechtlichen Anforderungen zwingend zu beachten sind.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Relevanz:</strong> Verbindliche Vorgabe der Bundesländer für die Planung und Ausführung von Bauwerken.
                  </div>
                </div>

                {/* aBZ / abG */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">abZ / aBG</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>abZ:</strong> allgemeine bauaufsichtliche Zulassung (Bauprodukt)<br/>
                    <strong>aBG:</strong> allgemeine Bauartgenehmigung (Bauart)
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>National (D):</strong> Erteilt vom DIBt für Bauprodukte bzw. Bauarten, die von Technischen Baubestimmungen wesentlich abweichen oder für die es keine gibt. Für CE-gekennzeichnete Produkte dürfen keine zusätzlichen nationalen Produktanforderungen gestellt werden.
                  </div>
                </div>

                {/* Ü-Zeichen */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-rose-100 text-rose-700 p-2 rounded-lg">
                      <CheckCircle size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">Ü-Zeichen</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Übereinstimmungszeichen:</strong> Bestätigt die Übereinstimmung eines Bauprodukts mit den maßgebenden Technischen Baubestimmungen, einer abZ, einem abP oder einer ZiE.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Funktion:</strong> Das nationale Pendant zur CE-Kennzeichnung für Produkte, die (noch) nicht europäisch harmonisiert sind.
                  </div>
                </div>

                {/* ZiE */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-torch-red/10 text-torch-red p-2 rounded-lg">
                      <AlertTriangle size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">ZiE / vBG</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>ZiE:</strong> Zustimmung im Einzelfall<br/>
                    <strong>vBG:</strong> vorhabenbezogene Bauartgenehmigung
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Gültigkeit:</strong> Streng objektbezogen und nicht auf andere Projekte übertragbar. Wird von der obersten Bauaufsichtsbehörde erteilt.
                  </div>
                </div>

                {/* abP */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">abP</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>allgemeines bauaufsichtliches Prüfzeugnis:</strong> Für nicht geregelte Bauprodukte bzw. Bauarten, deren Verwendbarkeit nach allgemein anerkannten Prüfverfahren beurteilt werden kann (abschließend festgelegt in der MVV TB, z. B. bestimmte Abdichtungsbahnen und Brandschutzprodukte).
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Nachweis:</strong> Wird von einer anerkannten Prüfstelle nach erfolgreicher Prüfung erteilt und bedarf keiner DIBt-Zulassung.
                  </div>
                </div>

                {/* VOB */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                      <FileSignature size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">VOB</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Vergabe- und Vertragsordnung für Bauleistungen:</strong> Regelt die Vergabe (Teil A), den Bauvertrag (Teil B) und die Ausführung (Teil C, ATV - Allgemeine Technische Vertragsbedingungen).
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Relevanz:</strong> Öffentliche Auftraggeber müssen VOB/B und VOB/C vereinbaren (§ 8a VOB/A). Die ATV geben weitgehend die anerkannten Regeln der Technik wieder.
                  </div>
                </div>

                {/* BauGB & BauNVO */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-sans-gray text-indigo-700 p-2 rounded-lg">
                      <Globe size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">BauGB &amp; BauNVO</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Baugesetzbuch &amp; Baunutzungsverordnung:</strong> Das Fundament des deutschen Bauplanungsrechts. Regelt die Zulässigkeit von Bauvorhaben im Raum (z. B. im Innenbereich § 34, Außenbereich § 35 oder per B-Plan § 30) und die Art/Maß der baulichen Nutzung (GRZ, GFZ, BMZ).
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Unterschied:</strong> Bauplanungsrecht regelt das „Ob“ und „Wo“ eines Vorhabens, das Bauordnungsrecht (LBO) regelt das „Wie“ (technische Ausführung).
                  </div>
                </div>

                {/* BGB Werkvertrag */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gray-100 text-gray-700 p-2 rounded-lg">
                      <FileSignature size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">BGB-Werkvertragsrecht</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>§§ 631 ff. BGB:</strong> Das gesetzliche Fundament für Bau- und Werkverträge in Deutschland. Regelt die Pflichten von Unternehmer und Besteller, falls die VOB/B nicht wirksam vereinbart wurde. Seit 2018 gibt es ein eigenes Kapitel für das spezielle „Bauvertragsrecht“ (§§ 650a ff. BGB).
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Verhältnis zur VOB/B:</strong> Die BGB-Regeln sind überwiegend abdingbar. Vorformulierte Klauseln wie die VOB/B unterliegen aber der AGB-Kontrolle; gegenüber Verbrauchern immer, gegenüber Unternehmern nur, wenn die VOB/B nicht als Ganzes vereinbart wurde.
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Vergabe- und Vertragsrecht */}
            <div className="mt-4">
              <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                <Briefcase className="text-shiraz" size={20} />
                Vergabe-, Vertrags- &amp; Planungsrecht (VOB, HOAI &amp; BGB)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* VOB/A */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">VOB/A</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Vergabe von Bauleistungen:</strong> Regelt die allgemeinen Bestimmungen für die Vergabe von Bauaufträgen durch öffentliche Auftraggeber.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Fokus:</strong> Transparenz, Wettbewerb und Gleichbehandlung bei Ausschreibungen (Unterscheidung nach nationalen/EU-Schwellenwerten).
                  </div>
                </div>

                {/* VOB/B */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                      <Scale size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">VOB/B</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Vertragsbedingungen:</strong> Regelt die allgemeinen Vertragsbedingungen für die Ausführung von Bauleistungen (Rechte und Pflichten).
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Fokus:</strong> Bauausführung, kooperative Streitbeilegung, Vergütung, Bedenkenanzeigen und Abnahme.
                  </div>
                </div>

                {/* VOB/C */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                      <Building size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">VOB/C (ATV)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Allgemeine Technische Vertragsbedingungen:</strong> Sammlung von DIN-Normen, die technische Standards für spezifische Gewerke definieren.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Fokus:</strong> Abrechnungsregeln (Messen/Abziehen von Aussparungen) und technische Ausführungsvorgaben je Gewerk.
                  </div>
                </div>

                {/* HOAI */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                      <Scale size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">HOAI</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Honorarordnung für Architekten und Ingenieure:</strong> Regelt die Berechnung der Honorare für Planungsleistungen im Bauwesen, aufgeteilt in <strong>9 Leistungsphasen (LPH)</strong> (Grundlagenermittlung bis Objektbetreuung).
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Wichtig:</strong> Seit dem EuGH-Urteil vom 04.07.2019 und der HOAI 2021 sind Mindest- und Höchstsätze nicht mehr verbindlich; die Leistungsphasen bleiben Branchenstandard.
                  </div>
                </div>

                {/* Gewährleistungsfristen */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-red-100 text-red-700 p-2 rounded-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">Verjährung von Mängelansprüchen (BGB / VOB)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    Verjährungsfristen für Mängelansprüche bei Bauwerken (keine Garantie im Rechtssinn):<br/>
                    • <strong>BGB § 634a:</strong> Grundsätzlich <strong>5 Jahre</strong> ab Abnahme.<br/>
                    • <strong>VOB/B § 13:</strong> Grundsätzlich <strong>4 Jahre</strong> ab Abnahme (sofern VOB/B als Ganzes vereinbart wurde).
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Hemmung und Verlängerung:</strong> Nach BGB hemmen z. B. Verhandlungen über den Mangel die Verjährung (§ 203 BGB). Nach VOB/B löst eine schriftliche Mängelrüge eine neue Frist von 2 Jahren für diesen Mangel aus, jedoch nicht vor Ablauf der Regelfrist (§ 13 Abs. 5).
                  </div>
                </div>

                {/* DIN 276 */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 text-purple-700 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">Kosten im Bauwesen (DIN 276)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    Normierte Gliederung der Kosten im Hochbau (Kostengruppen 100 bis 800) sowie Vorgabe zur Genauigkeit der Ermittlungsstufen: Rahmen, Schätzung, Berechnung, Anschlag und Feststellung.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Relevanz:</strong> Bildet zusammen mit DIN 18205 (Bedarfsplanung) das wirtschaftliche Steuerungsinstrument im Projekt.
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Umwelt, Sicherheit & Nachhaltigkeit */}
            <div className="mt-4">
              <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                <ShieldAlert className="text-shiraz" size={20} />
                Umwelt, Sicherheit &amp; Nachhaltigkeit (Green Building)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SDB */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-teal-100 text-teal-700 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">SDB (Sicherheitsdatenblatt)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    (Safety Data Sheet) Ein Dokument nach REACH-Verordnung, das Informationen über Gefährdungen und den sicheren Umgang mit chemischen Stoffen und Gemischen (z.B. Zement, Zusatzmittel, Harze) liefert.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Zielgruppe:</strong> Richtet sich primär an gewerbliche Verwender zum Schutz von Gesundheit und Umwelt.
                  </div>
                </div>

                {/* TRGS */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-orange-100 text-orange-700 p-2 rounded-lg">
                      <AlertTriangle size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">TRGS (Gefahrstoffe)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Technische Regeln für Gefahrstoffe:</strong> Konkretisieren die Gefahrstoffverordnung (GefStoffV) hinsichtlich Ermittlung und Arbeitsschutzmaßnahmen (Zementdermatitis-Schutz, Lungenschutz).
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Beispiel:</strong> TRGS 559 (Quarzhaltiger Staub) oder TRGS 519 (Asbest).
                  </div>
                </div>

                {/* KrWG & ErsatzbaustoffV */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                      <Leaf size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">KrWG &amp; ErsatzbaustoffV</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Kreislaufwirtschaftsgesetz:</strong> Verpflichtet Bauherren zur Abfallvermeidung und hochwertigen Verwertung.<br/>
                    <strong>Ersatzbaustoffverordnung (seit 2023):</strong> Einheitliche bundesweite Vorgaben für den Einbau mineralischer Recyclingbaustoffe.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Ziel:</strong> Förderung von kreislauffähigem Bauschuttrecycling unter strenger Einhaltung von Bodenschutz-Vorgaben.
                  </div>
                </div>

                {/* AwSV */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-cyan-100 text-cyan-700 p-2 rounded-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">AwSV (Gewässerschutz)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    <strong>Anlagenverordnung wassergefährdende Stoffe:</strong> Regelt den Umgang mit wassergefährdenden Stoffen (Klassen WGK 1 bis 3) zur Absicherung des Grundwassers auf der Baustelle.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Relevanz:</strong> Wichtig bei der Lagerung von Schalöl, Bindemitteln, Zusatzmittel-Konzentraten oder Kraftstoffen.
                  </div>
                </div>

                {/* Green Building Zertifikate */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                      <Leaf size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">Green Building: DGNB, LEED &amp; BREEAM</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    Internationale und nationale Bewertungssysteme für nachhaltiges Bauen. Bewerten das Gebäude ganzheitlich über den gesamten Lebenszyklus (LCA - Ökobilanzierung, Treibhauspotenzial GWP).
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/85 border border-home-grau/30">
                    <strong>DGNB (D):</strong> Deutsche Gesellschaft für Nachhaltiges Bauen (starker Fokus auf Ökobilanz und Lebenszykluskosten LCC).
                  </div>
                </div>

                {/* QNG */}
                <div className="border border-home-grau/30 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                      <CheckCircle size={20} />
                    </div>
                    <h4 className="font-bold text-text-main text-lg">QNG (Qualitätssiegel Nachhaltiges Gebäude)</h4>
                  </div>
                  <p className="text-sm text-text-main/70 mb-3">
                    Ein staatliches deutsches Gütesiegel des BMWSB, das die Erfüllung hoher ökologischer, soziokultureller und ökonomischer Anforderungen an Gebäude im Neubau und in der Sanierung nachweist.
                  </p>
                  <div className="bg-off-white p-3 rounded-lg text-xs text-text-main/80 border border-home-grau/30">
                    <strong>Förderung:</strong> Im KfW-Programm „Klimafreundlicher Neubau“ (KFN) ermöglicht ein QNG-Zertifikat die höhere Förderstufe; die Basisförderung setzt Effizienzhaus-40-Standard und die Einhaltung von Ökobilanz-Grenzwerten voraus.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Aggregated Key Standards Registry (Die wichtigsten Normen) */}
        {activeTab === 'normen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Search and Guidance */}
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-xl text-xs text-text-main/80">
                <p className="font-semibold text-text-main mb-1">Gewerkübergreifendes Normenverzeichnis des BaustoffBoards</p>
                <p>
                  Suchen Sie gezielt nach Kürzeln (z. B. <strong>„DIN 1045“</strong> oder <strong>„Eurocode“</strong>) oder Begriffen (z. B. <strong>„Schallschutz“</strong>, <strong>„Zement“</strong>/<strong>„Holz“</strong>), um die maßgeblichen technischen Regeln schnell zu filtern.
                </p>
              </div>

              {/* Interactive Search Bar widget */}
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-home-grau">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Suchen nach Standard, Code oder Titel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-home-grau/30 rounded-lg pl-9 pr-4 py-2 text-sm text-text-main placeholder:text-home-grau focus:ring-1 focus:ring-shiraz focus:outline-none"
                />
              </div>
            </div>

            {/* Normen Content Rendering */}
            {filteredNormenData.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-home-grau/30 rounded-xl bg-white text-home-grau text-sm">
                Keine passenden Normen für <strong>„{searchTerm}“</strong> gefunden. Probieren Sie andere Suchbegriffe aus wie „DIN“, „Eurocode“ oder „Gips“.
              </div>
            ) : (
              <div className="space-y-8">
                {filteredNormenData.map((categoryGroup, catIndex) => (
                  <div key={catIndex} className="bg-white rounded-xl border border-home-grau/30 overflow-hidden">
                    <h3 className="bg-off-white px-5 py-3.5 border-b border-home-grau/30 font-bold text-text-main text-base flex items-center justify-between">
                      <span>{categoryGroup.category}</span>
                      <span className="text-xs bg-shiraz/10 text-shiraz px-2 py-0.5 rounded-full font-medium">
                        {categoryGroup.norms.length} {categoryGroup.norms.length === 1 ? 'Norm' : 'Normen'}
                      </span>
                    </h3>

                    <div className="divide-y divide-home-grau/10">
                      {categoryGroup.norms.map((norm) => (
                        <div key={norm.id} className="p-5 hover:bg-slate-50/40 transition-colors flex flex-col md:flex-row md:items-start gap-4">
                          <div className="flex-shrink-0 flex md:flex-col items-start gap-1.5">
                            <span className="inline-block bg-slate-100 border border-home-grau/30 text-slate-700 font-mono text-xs font-bold px-2.5 py-1 rounded">
                              {norm.code}
                            </span>
                            {norm.status === 'ersetzt' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-shiraz/10 text-shiraz border border-shiraz/20" title={norm.ersetztDurch ? `Ersetzt durch ${norm.ersetztDurch}` : undefined}>
                                Zurückgezogen ({norm.ausgabeStand})
                              </span>
                            ) : norm.status === 'in_ueberarbeitung' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                Übergang / neue Fassung ({norm.ausgabeStand})
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Gültig ({norm.ausgabeStand})
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <h4 className="font-bold text-text-main text-sm flex items-center gap-1.5 leading-tight">
                                {norm.title}
                              </h4>
                              {norm.url && (
                                <a
                                  href={norm.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-shiraz hover:underline inline-flex items-center gap-1"
                                >
                                  DIN Media <ArrowUpRight size={13} />
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-text-main/75 mt-1 leading-relaxed">
                              {norm.beschreibung}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      <ModulTest moduleId="regularien" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Baurecht (Deutschland)', url: 'https://de.wikipedia.org/wiki/Baurecht_(Deutschland)' },
          { title: 'Bauordnungsrecht', url: 'https://de.wikipedia.org/wiki/Bauordnungsrecht' },
          { title: 'Bauproduktenverordnung', url: 'https://de.wikipedia.org/wiki/Bauproduktenverordnung' }
        ]}
        regelwerke={[
          { title: 'Musterbauordnung (MBO) der Bauministerkonferenz', url: 'https://www.bauministerkonferenz.de/' },
          { title: 'Gebäudemodernisierungsgesetz (GModG; bis 28.07.2026 Gebäudeenergiegesetz GEG) – Infoportal des BBSR', url: 'https://www.gmodg.bund.de/' },
          { title: 'Bauproduktenverordnung (BauPVO) – Verordnung (EU) 2024/3110 (übergangsweise VO (EU) 305/2011)', url: 'https://eur-lex.europa.eu/eli/reg/2024/3110/oj' },
          { title: 'Muster-Verwaltungsvorschrift Technische Baubestimmungen (MVV TB)', url: 'https://www.dibt.de/' },
          { title: 'Vergabe- und Vertragsordnung für Bauleistungen (VOB Teile A, B, C)' },
          { title: 'Ersatzbaustoffverordnung (ErsatzbaustoffV)', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' }
        ]}
        literatur={[
          'Deutsches Institut für Bautechnik (DIBt): Publikationen und Hinweise zu Bauprodukten und Bauarten',
          'Ingenstau, H.; Korbion, H. (Begr.): VOB Teile A und B – Kommentar. Köln: Werner Verlag (jeweils aktuelle Auflage)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
            formel: 'H_T\' = \\frac{H_T}{A} = \\frac{\\sum U_i \\cdot A_i \\cdot f_{x,i} + \\sum \\psi_j \\cdot l_j}{A} \\le H_{T,\\text{zul}}\'',
            erklaerung: 'Spezifischer, auf die wärmeübertragende Umfassungsfläche A bezogener Transmissionswärmetransferkoeffizient H_T\' als Nachweis für den baulichen Wärmeschutz (Höchstwert nach GEG/GModG, Wohngebäude).',
            quelle: 'GEG § 16 (seit 29.07.2026 GModG) / DIN V 18599'
          },
          {
            formel: '\\text{Leistungserklärung} = \\{\\text{wesentliches Merkmal}_i \\mapsto \\text{Wert, Stufe oder Klasse}_i\\}',
            erklaerung: 'Leistungserklärung nach BauPVO: Der Hersteller erklärt für die wesentlichen Merkmale eines Bauprodukts nach hEN oder EAD die Leistung als Wert, Stufe oder Klasse; sie ist Voraussetzung für die CE-Kennzeichnung. Ob die erklärte Leistung für ein Bauwerk genügt, entscheidet der Planer anhand der Bauwerksanforderungen (MVV TB).',
            quelle: 'VO (EU) 305/2011 Art. 4 und 6; VO (EU) 2024/3110'
          }
        ]}
        lastReviewed="Oktober 2026 (AP 3 Grundlagen: BauPVO 2024/3110, GModG, ErsatzbaustoffV, BGB/VOB, MBO/MVV TB geprüft; keine Rechtsberatung; fachliche Freigabe durch den Autor ausstehend)"
      />
    </div>
  );
}
