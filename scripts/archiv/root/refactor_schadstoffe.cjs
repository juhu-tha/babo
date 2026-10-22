const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'modules', 'Schadstoffe.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

const SCHADSTOFFE_DATA_STR = `const SCHADSTOFFE_DATA = [
  {
    id: 'asbest',
    name: 'Asbest',
    icon: <Wind size={24} className="text-gray-500" />,
    color: 'bg-gray-50 border-gray-200',
    textColor: 'text-gray-800',
    vorkommen: [
      'Fest gebunden: Asbestzement (Eternit-Platten), Rohre, Wellplatten, Fassadenverkleidungen.',
      'Schwach gebunden: Spritzasbest (Brandschutz), Leichtbauplatten, Dichtungsschnüre, Pappen.',
      'Verwendungszeitraum: Hauptsächlich 1950er bis 1980er Jahre (Verbot in DE 1993).'
    ],
    gefahren: [
      'Gesundheitsgefahr: Einatmen von Asbestfasern kann Asbestose, Lungenkrebs und Mesotheliom verursachen.',
      'Sanierung: Nur durch zugelassene Fachbetriebe (TRGS 519). Strenge Schutzmaßnahmen (Absaugung, Schutzkleidung).',
      'Entsorgung: Als gefährlicher Abfall in Big-Bags auf speziellen Deponien.'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 06 05* (Asbesthaltige Baustoffe) - Gefährlicher Abfall.',
      'PSA (TRGS 519): Atemschutzmaske (mind. FFP3 oder Vollmaske mit P3-Filter), partikeldichter Einweg-Anzug (Typ 5/6), Schutzhandschuhe.'
    ]
  },
  {
    id: 'pak',
    name: 'PAK (Polyzyklische Aromatische Kohlenwasserstoffe)',
    icon: <Droplets size={24} className="text-black" />,
    color: 'bg-stone-50 border-stone-300',
    textColor: 'text-stone-800',
    vorkommen: [
      'Teerprodukte: Teerhaltige Klebstoffe (z.B. Parkettkleber), Teerpappe, teerhaltige Anstriche.',
      'Holzschutz: Carbolineum (früher oft für Außenholz verwendet).',
      'Erkennung: Typischer, stechender Geruch (nach Teer/Asphalt), dunkle bis schwarze Färbung.'
    ],
    gefahren: [
      'Gesundheitsgefahr: Viele PAK sind krebserregend, erbgutverändernd und fortpflanzungsgefährdend. Aufnahme über Haut und Atmung.',
      'Sanierung: Entfernung unter Atemschutz und Hautschutz. Staubminimierung.',
      'Entsorgung: PAK-haltige Abfälle sind meist gefährlicher Abfall (Sondermüll).'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 03 01* (Kohlenteerhaltige Bitumengemische), 17 09 03* (sonstige Bauabfälle mit gefährlichen Stoffen).',
      'PSA (TRGS 524): Je nach PAK-Typ schwerwiegend. Bei Staubentwicklung: Halbmaske mit Partikelfilter (P2/P3), ggf. Kombifilter A/P für Dämpfe. Chemikalienschutzanzug.'
    ]
  },
  {
    id: 'pcb',
    name: 'PCB (Polychlorierte Biphenyle)',
    icon: <Flame size={24} className="text-orange-500" />,
    color: 'bg-orange-50 border-orange-200',
    textColor: 'text-orange-800',
    vorkommen: [
      'Dichtungsmassen: Dauerelastische Fugenmassen (z.B. Thiokol) in Plattenbauten und Fenstern (1950-1970er).',
      'Anstriche: Flammschutzmittel in Farben und Lacken.',
      'Kondensatoren: In älteren Leuchtstoffröhren-Vorschaltgeräten.'
    ],
    gefahren: [
      'Gesundheitsgefahr: Toxisch, reichern sich im Fettgewebe an. Verdacht auf krebserregende Wirkung.',
      'Sekundärkontamination: PCB gast aus und kontaminiert angrenzende Bauteile (Putz, Möbel).',
      'Sanierung: Entfernung der Primärquellen, ggf. Absperrung oder Entfernung sekundär kontaminierter Flächen (TRGS 524).'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 09 02* (Bau- und Abbruchabfälle, die PCB enthalten).',
      'PSA (TRGS 524): Atemschutz mit Kombifilter (A/P3) wegen Ausgasungen, Chemikalien-Schutzhandschuhe (z. B. Nitril), Schutzanzug (Typ 4/5/6).'
    ]
  },
  {
    id: 'kmf',
    name: 'KMF (Künstliche Mineralfasern)',
    icon: <Wind size={24} className="text-slate-500" />,
    color: 'bg-slate-50 border-slate-200',
    textColor: 'text-slate-800',
    vorkommen: [
      'Verwendung: Glaswolle und Steinwolle zur Wärme- und Schalldämmung (Dach, Fassade, Rohre).',
      'Das Problem: Vor dem Jahr 2000 hergestellte ("alte") Mineralwolle ist oft biolöslich schlechter und bricht in lungengängige, kritische Fasern auf (wie Asbest).',
      'Stichtag: Seit 2000 (bzw. freiwillig ab 1996) gibt es in DE das RAL-Gütezeichen für "neue", unbedenkliche Wolle.'
    ],
    gefahren: [
      'Gesundheitsgefahr: "Alte" KMF stehen im Verdacht, krebserzeugend zu sein (Einstufung nach TRGS 521). Juckreiz auf der Haut.',
      'Umgang (TRGS 521): Staubfreier Ausbau, keine Wurfdemontage. Verpackung in dichten Gewebesäcken direkt an Ort und Stelle. Atemschutz (FFP2/FFP3).'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 06 03* (Anderes Dämmmaterial, das aus gefährlichen Stoffen besteht) - für alte Mineralwolle.',
      'PSA (TRGS 521): Atemschutz (mind. FFP2, besser FFP3), Einweg-Schutzanzug (Kopfhaube wichtig), geschlossene Schutzbrille (vermeidet Augenreizung), Handschuhe.'
    ]
  },
  {
    id: 'schwermetalle',
    name: 'Schwermetalle (Blei, Zink, Cadmium)',
    icon: <Droplets size={24} className="text-purple-600" />,
    color: 'bg-purple-50 border-purple-200',
    textColor: 'text-purple-800',
    vorkommen: [
      'Blei: Rostschutzfarben (Mennige) auf alten Stahlträgern, Bleirohre (Trinkwasser), Blechverwahrungen am Dach.',
      'Zink: Verzinkte Stahlbauteile, Zinkblechdächer. Oft nicht akut giftig für Menschen, aber umweltgefährdend bei Auswaschung ins Grundwasser.',
      'Cadmium: Oft als Verunreinigung in alten Zinkbeschichtungen oder PVC-Stabilisatoren.'
    ],
    gefahren: [
      'Gesundheitsgefahr: Blei ist neurotoxisch. Gefahr besteht v.a. durch Staub/Rauch (z.B. beim Trennschneiden oder Abschleifen von alten Lacken).',
      'Sanierung: Beim thermischen Trennen (Brennschneiden) von bleimennige-beschichteten Stahlträgern entsteht hochgiftiger Rauch! Strikte Atemschutzmaßnahmen nötig. Entsorgung als gefährlicher Abfall.'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 04 09* (Metallabfälle, die durch gefährliche Stoffe verunreinigt sind), 17 09 03* (Bauabfälle mit Schwermetallen).',
      'PSA: V. a. bei Trenn-/Brenn- oder Schleifarbeiten (Mennige) Atemschutz (FFP3 oder gebläseunterstützter Atemschutz) erforderlich! Bei Handhabung: abwaschbare Schutzhandschuhe.'
    ]
  },
  {
    id: 'holzschutz',
    name: 'Holzschutzmittel (PCP, Lindan)',
    icon: <Bug size={24} className="text-green-700" />,
    color: 'bg-green-50 border-green-200',
    textColor: 'text-green-800',
    vorkommen: [
      'Verwendung: Insektizide (Lindan) und Fungizide (PCP) in Holzschutzmitteln für Dachstühle, Fachwerk, Paneele.',
      'Zeitraum: Häufig eingesetzt in den 1960er bis 1980er Jahren.'
    ],
    gefahren: [
      'Gesundheitsgefahr: Nervengifte, krebserregend. Ausgasung in die Raumluft über Jahrzehnte.',
      'Sanierung: Maskierung (Absperren mit speziellen Folien/Lacken), Entfernung des Holzes oder Raumluftreinigung.'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 02 04* (Glas, Kunststoff und Holz, die gefährliche Stoffe enthalten). Entspricht A-IV Holz.',
      'PSA (TRGS 524): Bei mechanischer Bearbeitung/Rückbau (Staubentwicklung): FFP2/FFP3-Maske, Chemikalienschutzanzug, Augenschutz.'
    ]
  },
  {
    id: 'hbcd',
    name: 'HBCD (Hexabromcyclododecan)',
    icon: <Flame size={24} className="text-yellow-500" />,
    color: 'bg-yellow-50 border-yellow-200',
    textColor: 'text-yellow-800',
    vorkommen: [
      'Verwendung: Flammschutzmittel in EPS (Styropor) und XPS-Dämmstoffen.',
      'Zeitraum: Wurde bis ca. 2014/2015 flächendeckend eingesetzt (in DE verboten seit 2016).',
      'Erkennung: Im Labor (Röntgenfluoreszenzanalyse - RFA) oder per Schnelltest. Optisch nicht von reinem EPS zu unterscheiden.'
    ],
    gefahren: [
      'Gesundheitsgefahr: HBCD ist langlebig, reichert sich in Organismen an (POP - Persistent Organic Pollutant) und ist fortpflanzungsschädigend.',
      'Umgang: Beim Rückbau Staub vermeiden. Nicht mit Heißdraht schneiden (Ausgasung!).'
    ],
    entsorgung: [
      'AVV-Schlüssel: 17 06 04 (Dämmmaterial). Obwohl nicht formal gefährlich nach AVV, greift das POP-Recht! HBCD-haltiges EPS darf NICHT normal recycelt werden.',
      'Entsorgungsweg: Muss der thermischen Verwertung (Müllverbrennung) zugeführt werden, um HBCD zu zerstören.'
    ]
  }
];

export default function Schadstoffe() {
  const [activeTab, setActiveTab] = useState<\'stoffe\' | \'beprobung\'>(\'stoffe\');
  const [activeSchadstoff, setActiveSchadstoff] = useState(SCHADSTOFFE_DATA[0].id);
  
  const selectedSchadstoff = SCHADSTOFFE_DATA.find(s => s.id === activeSchadstoff) || SCHADSTOFFE_DATA[0];

  return (`;

const updatedContent = content.replace(
  /export default function Schadstoffe\(\) {[\s\S]*?return \(/,
  SCHADSTOFFE_DATA_STR
);

const newStoffeContent = `{activeTab === 'stoffe' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
                <p>
                  Aufgrund ihrer gesundheits- und umweltschädlichen Eigenschaften gelten für viele historische Baustoffe strenge Vorgaben bei Sanierung und Rückbau. 
                  Wähle einen Schadstoff, um mehr über Vorkommen, Gefahren und Entsorgung zu erfahren.
                </p>
              </div>

              {/* Schadstoff Selector */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {SCHADSTOFFE_DATA.map((stoff) => (
                  <button
                    key={stoff.id}
                    onClick={() => setActiveSchadstoff(stoff.id)}
                    className={\`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center h-full \${
                      activeSchadstoff === stoff.id 
                        ? \`\${stoff.color} shadow-sm border-b-2 ring-1 ring-inset ring-\${stoff.color.split(\\'-\\')[1]}-200\` 
                        : 'bg-white border-home-grau/20 hover:bg-off-white hover:border-home-grau/40'
                    }\`}
                  >
                    {stoff.icon}
                    <span className={\`text-xs font-bold \${activeSchadstoff === stoff.id ? stoff.textColor : 'text-text-main'}\`}>
                      {stoff.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected Schadstoff Details */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/20 mt-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-home-grau/20">
                  <div className={\`p-3 rounded-lg \${selectedSchadstoff.color}\`}>
                    {selectedSchadstoff.icon}
                  </div>
                  <h3 className={\`text-2xl font-bold \${selectedSchadstoff.textColor}\`}>
                    {selectedSchadstoff.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/20">
                    <h4 className="font-bold mb-3 flex items-center gap-2">Vorkommen & Verwendung</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {selectedSchadstoff.vorkommen.map((item, idx) => {
                        const split = item.indexOf(':');
                        if (split > -1) {
                          return <li key={idx}><strong>{item.substring(0, split + 1)}</strong>{item.substring(split + 1)}</li>
                        }
                        return <li key={idx} className="list-disc ml-5">{item}</li>
                      })}
                    </ul>
                  </div>
                  
                  <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/20">
                    <h4 className="font-bold mb-3 flex items-center gap-2">Gefahren & Sanierung</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {selectedSchadstoff.gefahren.map((item, idx) => {
                        const split = item.indexOf(':');
                        if (split > -1) {
                          return <li key={idx}><strong>{item.substring(0, split + 1)}</strong>{item.substring(split + 1)}</li>
                        }
                        return <li key={idx} className="list-disc ml-5">{item}</li>
                      })}
                    </ul>
                  </div>
                  
                  <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/20 md:col-span-2">
                    <h4 className="font-bold mb-3 flex items-center gap-2">Entsorgung (AVV) & Schutzmaßnahmen (PSA)</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {selectedSchadstoff.entsorgung.map((item, idx) => {
                        const split = item.indexOf(':');
                        if (split > -1) {
                          return <li key={idx}><strong>{item.substring(0, split + 1)}</strong>{item.substring(split + 1)}</li>
                        }
                        return <li key={idx} className="list-disc ml-5">{item}</li>
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}`;

const stoffeRegex = /\{activeTab === 'stoffe' && \(\s*<div className="space-y-10">[\s\S]*?<section>[\s\S]*?<\/div>[\s\S]*?\)\}/;
let finalContent = updatedContent.replace(stoffeRegex, newStoffeContent);

fs.writeFileSync(filePath, finalContent, 'utf-8');
console.log('Successfully updated Schadstoffe.tsx');
