import fs from 'fs';

const btdPath = 'src/modules/BetontechnischeDaten.tsx';
let btdContent = fs.readFileSync(btdPath, 'utf8');

// Add "herstellung" to state
btdContent = btdContent.replace(
  "useState<'druckfestigkeit' | 'expositionsklassen' | 'konsistenz' | 'zement' | 'mehlkorn' | 'zusatzstoffe' | 'sonderbetone'>('druckfestigkeit')",
  "useState<'druckfestigkeit' | 'expositionsklassen' | 'konsistenz' | 'zement' | 'herstellung' | 'mehlkorn' | 'zusatzstoffe' | 'sonderbetone'>('druckfestigkeit')"
);

// Add button
const herstellungButton = `<button
            className={\`px-4 py-2 rounded-xl text-sm font-bold transition-all \${activeTab === 'herstellung' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/20 hover:border-text-main'}\`}
            onClick={() => setActiveTab('herstellung')}
          >
            Zementherstellung
          </button>`;

btdContent = btdContent.replace(
  `onClick={() => setActiveTab('zement')}
          >
            Zementarten
          </button>`,
  `onClick={() => setActiveTab('zement')}
          >
            Zementarten
          </button>
          ${herstellungButton}`
);

const herstellungContent = `
        {activeTab === 'herstellung' && (
          <div className="flex flex-col gap-6 animate-fade-in">
             <h3 className="text-lg font-bold">Zementherstellung & Klinker</h3>
             <p className="text-sm text-text-main/80">
               Von der Rohstoffgewinnung über den Drehrohrofen bis zum fertigen Bindemittel.
             </p>

            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/20 flex gap-4 items-start">
                <div className="bg-white px-3 py-1 rounded-lg border font-bold text-shiraz">1</div>
                <div>
                  <h4 className="font-bold mb-1">Rohstoffgewinnung & Aufbereitung</h4>
                  <p className="text-sm text-gray-700">Kalkstein (CaCO₃) und Ton (Silikate, Aluminate) werden im Steinbruch gewonnen, zerkleinert, homogenisiert und in der Vertikalmühle zu feinem <strong>Rohmehl</strong> vermahlen.</p>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/20 flex gap-4 items-start">
                <div className="bg-white px-3 py-1 rounded-lg border font-bold text-shiraz">2</div>
                <div>
                  <h4 className="font-bold mb-1">Zyklonvorwärmer & Kalzinator</h4>
                  <p className="text-sm text-gray-700">Das Rohmehl wird auf 800-900 °C erhitzt. Dabei findet die <strong>Entsäuerung (Kalzinierung)</strong> statt: Kalkstein (CaCO₃) spaltet CO₂ ab und wird zu Branntkalk (CaO). Diese Prozess-Emissionen machen ca. 60% der CO₂-Emissionen aus.</p>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/20 flex gap-4 items-start">
                <div className="bg-white px-3 py-1 rounded-lg border font-bold text-shiraz">3</div>
                <div>
                  <h4 className="font-bold mb-1">Sintern im Drehrohrofen</h4>
                  <p className="text-sm text-gray-700">Im Ofen wird das Material auf 1450 °C erhitzt (Flammentemperatur ca. 2000 °C). Die Rohstoffe schmelzen ansatzweise (Sintern) und reagieren zu neuen Mineralien: Alit (C₃S), Belit (C₂S), Aluminat (C₃A) und Ferrit (C₄AF). Das Granulat ist der <strong>Portlandzementklinker</strong>.</p>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/20 flex gap-4 items-start">
                <div className="bg-white px-3 py-1 rounded-lg border font-bold text-shiraz">4</div>
                <div>
                  <h4 className="font-bold mb-1">Mahlung & Zumahlstoffe</h4>
                  <p className="text-sm text-gray-700">Der gekühlte Klinker wird fein gemahlen. Zur Regelung des Erstarrens wird <strong>Gips (Sulfat)</strong> zugegeben. Um die CO₂-Bilanz zu senken, werden oft <strong>Zumahlstoffe</strong> (Kalksteinmehl, Hüttensand, Flugasche) hinzugegeben (CEM II bis CEM VI Zemente).</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold mt-4">CO₂-Reduktion & Dekarbonisierung</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm">
                <h4 className="font-bold text-shiraz mb-2">Ansatzpunkte der Industrie</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li><strong>Alternative Brennstoffe:</strong> z.B. Biomasse, Ersatzbrennstoffe statt Kohle.</li>
                  <li><strong>Klinkerreduktion:</strong> Mehr Kompositzemente, Klinkerersatz durch calcinierte Tone oder Hüttensand.</li>
                  <li><strong>Carbon Capture and Storage (CCS):</strong> Abspaltung und Speicherung des Prozess-CO₂.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
`;

btdContent = btdContent.replace(
  "{activeTab === 'zement' && (",
  herstellungContent + "\n\n        {activeTab === 'zement' && ("
);

fs.writeFileSync(btdPath, btdContent);
console.log('integrated');
