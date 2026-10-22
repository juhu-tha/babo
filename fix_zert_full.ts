import fs from 'fs';
import path from 'path';
let content = fs.readFileSync('src/modules/Zertifizierung.tsx', 'utf-8');

const newSystems = `const SYSTEMS = [
  {
    id: 'dgnb',
    name: 'DGNB',
    fullName: 'Deutsche Gesellschaft für Nachhaltiges Bauen',
    origin: 'Deutschland',
    focus: 'Ganzheitlicher Ansatz (Ökologie, Ökonomie, Soziokulturelles gleichgewichtet)',
    icon: <Award className="text-blue-600" size={24} />,
    color: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-800',
    criteria: [
      { name: 'Ökologische Qualität', weight: 22.5, icon: <Leaf size={16} /> },
      { name: 'Ökonomische Qualität', weight: 22.5, icon: <Building size={16} /> },
      { name: 'Soziokulturelle & funktionale Qualität', weight: 22.5, icon: <Users size={16} /> },
      { name: 'Technische Qualität', weight: 15.0, icon: <Settings size={16} /> },
      { name: 'Prozessqualität', weight: 12.5, icon: <Zap size={16} /> },
      { name: 'Standortqualität', weight: 5.0, icon: <ShieldCheck size={16} /> }
    ],
    description: 'Das DGNB System (Deutsche Gesellschaft für Nachhaltiges Bauen) betrachtet den gesamten Gebäudelebenszyklus und bewertet die Gesamtperformance eines Projekts statt einzelner Maßnahmen. Es gilt als eines der fortschrittlichsten Systeme weltweit, da es Ökologie, Ökonomie und soziokulturelle Aspekte gleichwertig gewichtet. Die Zertifizierung erfolgt in Platin, Gold, Silber oder Bronze und erfordert eine umfassende Lebenszyklusanalyse (LCA) sowie Lebenszykluskostenrechnung (LCC).',
    example: 'Ein neuer Bürokomplex in Holz-Hybrid-Bauweise strebt DGNB Platin an. Durch ressourcenschonende Materialien (Ökologie), flexible Grundrisse für lange Nutzungsdauer und niedrige Betriebskosten (Ökonomie) sowie Barrierefreiheit und hohem Nutzerkomfort (Soziokulturell) erzielt das Projekt in allen Hauptkategorien Spitzenwerte.',
    link: 'https://www.dgnb.de/de/'
  },
  {
    id: 'bnb',
    name: 'BNB',
    fullName: 'Bewertungssystem Nachhaltiges Bauen',
    origin: 'Deutschland (Staatlich)',
    focus: 'Bundesbauten, ganzheitliche Bewertung ähnlich DGNB',
    icon: <Building className="text-teal-600" size={24} />,
    color: 'bg-teal-50 border-teal-200',
    textColor: 'text-teal-800',
    criteria: [
      { name: 'Ökologische Qualität', weight: 22.5, icon: <Leaf size={16} /> },
      { name: 'Ökonomische Qualität', weight: 22.5, icon: <Building size={16} /> },
      { name: 'Soziokulturelle & funktionale Qualität', weight: 22.5, icon: <Users size={16} /> },
      { name: 'Technische Qualität', weight: 22.5, icon: <Settings size={16} /> },
      { name: 'Prozessqualität', weight: 10.0, icon: <Zap size={16} /> },
      { name: 'Standortmerkmale', weight: 0.0, icon: <ShieldCheck size={16} /> }
    ],
    description: 'Das BNB (Bewertungssystem Nachhaltiges Bauen) ist das System des Bundes für Bundesbauten. Es ist eng mit dem DGNB-System verwandt, aber speziell auf die Anforderungen öffentlicher Bauherren zugeschnitten. Es wird verpflichtend bei Bundesbaumaßnahmen angewendet und legt großen Wert auf die ganzheitliche Betrachtung von Qualität und Lebenszykluskosten, um die Vorbildfunktion der öffentlichen Hand zu erfüllen.',
    example: 'Neubau eines Finanzamtes: Das Gebäude muss zwingend nach BNB zertifiziert werden (mindestens Silber). Der Fokus liegt stark auf den Lebenszykluskosten der nächsten 50 Jahre (LCC) und einer robusten, wartungsarmen technischen Qualität, da der Bund das Gebäude langfristig selbst nutzt und betreibt.',
    link: 'https://www.bnb-nachhaltigesbauen.de/'
  },
  {
    id: 'qng',
    name: 'QNG',
    fullName: 'Qualitätssiegel Nachhaltiges Gebäude',
    origin: 'Deutschland (Staatlich)',
    focus: 'Voraussetzung für staatliche Förderung (KFN/WEF)',
    icon: <ShieldCheck className="text-shiraz" size={24} />,
    color: 'bg-shiraz/5 border-shiraz/20',
    textColor: 'text-shiraz',
    criteria: [
      { name: 'Treibhausgasemissionen (LCA)', weight: 30, icon: <Leaf size={16} /> },
      { name: 'Primärenergiebedarf (LCA)', weight: 20, icon: <Zap size={16} /> },
      { name: 'Nachhaltige Materialgewinnung', weight: 20, icon: <Building size={16} /> },
      { name: 'Schadstoffvermeidung', weight: 15, icon: <ShieldCheck size={16} /> },
      { name: 'Barrierefreiheit', weight: 15, icon: <Users size={16} /> }
    ],
    description: 'Das QNG (Qualitätssiegel Nachhaltiges Gebäude) ist das staatliche Gütesiegel des Bundesbauministeriums (BMWSB). Es bildet die verpflichtende Grundlage für die Bundesförderung für effiziente Gebäude (BEG) sowie für klimafreundliche Neubauten (KFN/WEF) durch die KfW. Das Siegel existiert in den Varianten PLUS und PREMIUM. QNG ist kein eigenständiges Zertifizierungssystem, sondern knüpft an bestehende Systeme (wie DGNB, BNB, NaWoh oder BiRN) an. Es definiert harte, nicht verhandelbare K.O.-Kriterien: Strenge Grenzwerte für Treibhausgasemissionen im Gebäudelebenszyklus (LCA), Vorgaben zur nachhaltigen Materialgewinnung (Holz), und strenge Anforderungen an die Schadstoffvermeidung in Bauprodukten (Schadstoffmatrix nach QNG).',
    example: 'Eine Baugemeinschaft plant ein ressourcenschonendes Mehrfamilienhaus und beantragt KfW-Kredite für "Klimafreundlichen Neubau (KFN)". Um den Kredit zu erhalten, muss QNG PLUS erreicht werden. Absolutes K.O.-Kriterium ist dabei der Nachweis, dass der Treibhausgasausstoß über den gesamten Lebenszyklus unter 24 kg CO₂-Äqv./(m²a) bleibt.',
    link: 'https://www.qng.info/'
  },
  {
    id: 'leed',
    name: 'LEED',
    fullName: 'Leadership in Energy and Environmental Design',
    origin: 'USA',
    focus: 'Energieeffizienz, Wasserersparnis, Materialwahl',
    icon: <Leaf className="text-green-600" size={24} />,
    color: 'bg-green-50 border-green-200',
    textColor: 'text-green-800',
    criteria: [
      { name: 'Energie & Atmosphäre', weight: 33, icon: <Zap size={16} /> },
      { name: 'Standort & Verkehr', weight: 16, icon: <Building size={16} /> },
      { name: 'Innenraumqualität', weight: 16, icon: <Users size={16} /> },
      { name: 'Materialien & Ressourcen', weight: 13, icon: <Settings size={16} /> },
      { name: 'Wassereffizienz', weight: 11, icon: <Leaf size={16} /> },
      { name: 'Innovation & Regionale Priorität', weight: 11, icon: <Award size={16} /> }
    ],
    description: 'LEED (Leadership in Energy and Environmental Design) ist das vom U.S. Green Building Council entwickelte und international am weitesten verbreitete Zertifizierungssystem. Es arbeitet mit einem flexiblen Punktesystem und ist besonders bei internationalen Investoren sehr gefragt. Der Fokus liegt stark auf Energieeffizienz, Wassereinsparung und der Reduzierung von CO2-Emissionen, während ökonomische Lebenszykluskosten weniger stark gewichtet werden als bei der DGNB.',
    example: 'Ein internationaler Investor lässt in Frankfurt einen Wolkenkratzer errichten. Um das Gebäude für globale Tech-Konzerne als Mieter attraktiv zu machen, strebt der Investor das "LEED Platinum"-Zertifikat an. Kernpunkte sind u.A. die Nutzung von Regenwasser zur Toilettenspülung (Wassereffizienz) und exzellente Anbindung an den ÖPNV (Standort & Verkehr).',
    link: 'https://www.usgbc.org/leed'
  },
  {
    id: 'breeam',
    name: 'BREEAM',
    fullName: 'Building Research Establishment Environmental Assessment Methodology',
    origin: 'Großbritannien',
    focus: 'Management, Gesundheit, Energie, Transport',
    icon: <Building className="text-orange-600" size={24} />,
    color: 'bg-orange-50 border-orange-200',
    textColor: 'text-orange-800',
    criteria: [
      { name: 'Energie', weight: 19, icon: <Zap size={16} /> },
      { name: 'Gesundheit & Wohlbefinden', weight: 15, icon: <Users size={16} /> },
      { name: 'Materialien', weight: 12.5, icon: <Settings size={16} /> },
      { name: 'Management', weight: 12, icon: <ShieldCheck size={16} /> },
      { name: 'Landnutzung & Ökologie', weight: 10, icon: <Leaf size={16} /> },
      { name: 'Sonstige (Wasser, Transport, etc.)', weight: 31.5, icon: <Building size={16} /> }
    ],
    description: 'BREEAM (Building Research Establishment Environmental Assessment Methodology) ist das älteste Zertifizierungssystem (seit 1990) und stammt aus Großbritannien. Es zeichnet sich durch eine sehr detaillierte und wissenschaftlich fundierte Bewertungsmethodik aus. Es ist weltweit stark verbreitet und bewertet Gebäude in Kategorien wie Management, Gesundheit, Energie, Transport, Wasser, Materialien und Ökologie. Die Zertifikatsstufen reichen von "Pass" bis "Outstanding".',
    example: 'Ein großes Logistikzentrum wird nach BREEAM "Excellent" gebaut. Der Fokus liegt auf strengem Baustellen-Management (Minimierung von Bauabfall), dem Erhalt lokaler Biodiversität (ökologische Ausgleichsflächen am Standort) sowie einer effizienten Energieversorgung (Photovoltaik auf den großen Dachflächen).',
    link: 'https://breeam.com/'
  },
  {
    id: 'well',
    name: 'WELL',
    fullName: 'WELL Building Standard',
    origin: 'USA / International',
    focus: 'Gesundheit, Komfort und Wohlbefinden der Gebäudenutzer',
    icon: <Activity className="text-rose-600" size={24} />,
    color: 'bg-rose-50 border-rose-200',
    textColor: 'text-rose-800',
    criteria: [
      { name: 'Luft & Wasser', weight: 20, icon: <Leaf size={16} /> },
      { name: 'Ernährung & Licht', weight: 20, icon: <Zap size={16} /> },
      { name: 'Bewegung & thermischer Komfort', weight: 20, icon: <Activity size={16} /> },
      { name: 'Geist & Gemeinschaft', weight: 20, icon: <Users size={16} /> },
      { name: 'Materialien & Innovation', weight: 20, icon: <Settings size={16} /> }
    ],
    description: 'Der WELL Building Standard fokussiert sich im Gegensatz zu anderen Zertifizierungen fast ausschließlich auf den Menschen und sein Wohlbefinden im Gebäude. Er verbindet Best Practices im Design und Konstruktion mit evidenzbasierter medizinischer und wissenschaftlicher Forschung – das Gebäude wird als Mittel zur Gesundheitsförderung betrachtet.',
    example: 'Das neue Hauptquartier eines Softwareunternehmens strebt die "WELL Gold"-Zertifizierung an. Im Fokus stehen nicht in erster Linie die CO2-Emissionen des Betons, sondern die Luftqualität (strenge Filter), Beleuchtung (an den Biorhythmus angepasstes Kunstlicht, sogenanntes Human Centric Lighting), gesundes Kantinenessen und die Förderung von Bewegung der Mitarbeiter.',
    link: 'https://www.wellcertified.com/'
  },
  {
    id: 'birn',
    name: 'BiRN',
    fullName: 'Bau-Institut für Ressourceneffizientes und Nachhaltiges Bauen (BNK/BNG)',
    origin: 'Deutschland',
    focus: 'Nachhaltigkeit speziell für Wohngebäude (Basis für QNG-Förderung)',
    icon: <Building2 className="text-teal-600" size={24} />,
    color: 'bg-teal-50 border-teal-200',
    textColor: 'text-teal-800',
    criteria: [
      { name: 'Soziokulturelle & funktionale Qualität', weight: 33.3, icon: <Users size={16} /> },
      { name: 'Ökonomische Qualität', weight: 33.3, icon: <Calculator size={16} /> },
      { name: 'Ökologische Qualität', weight: 33.3, icon: <Leaf size={16} /> }
    ],
    description: 'BiRN (Bau-Institut für Ressourceneffizientes und Nachhaltiges Bauen) bietet die Zertifizierungssysteme BNK (Nachhaltiger Kleinwohnhausbau) und BNG (Nachhaltiger Geschosswohnungsbau). Diese Systeme sind speziell auf den Wohnungsbau zugeschnitten. Sie dienen als eine der maßgeblichen Nachweismethoden zur Erlangung des vom Bund geforderten "Qualitätssiegel Nachhaltiges Gebäude (QNG)", welches Voraussetzung für zinsgünstige KfW-Förderkredite ist.',
    example: 'Für den Bau eines Einfamilienhauses (EFH) wählt die Baufamilie das "BNK"-Zertifizierungssystem des BiRN. Der Auditor prüft u.a. die Ökobilanz des kleinen Hauses, den thermischen Komfort im Sommer und stellt sicher, dass am Ende das QNG-Siegel für das zinsgünstige KfW-Darlehen vergeben werden kann.',
    link: 'https://www.bau-irn.com/'
  }
];`;

content = content.replace(/const SYSTEMS = \[[\s\S]*?\];/m, newSystems);

const replaceHTML = `{selectedSystem.description}
              </p>

              {('example' in selectedSystem) && selectedSystem.example && (
                <div className={\`p-4 rounded-xl mt-4 \${selectedSystem.color}\`}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                    Praxisbeispiel
                  </p>
                  <p className={\`text-sm leading-relaxed \${selectedSystem.textColor}\`}>
                    {selectedSystem.example}
                  </p>
                </div>
              )}

              {selectedSystem.link && (`;

content = content.replace(/\{selectedSystem\.description\}\s*<\/p>\s*\{selectedSystem\.link && \(/, replaceHTML);

fs.writeFileSync('src/modules/Zertifizierung.tsx', content, 'utf-8');
