import fs from 'fs';

const btdPath = 'src/modules/BetontechnischeDaten.tsx';
let btdContent = fs.readFileSync(btdPath, 'utf8');

// Add "gesteinskoernung" to state
btdContent = btdContent.replace(
  "useState<'druckfestigkeit' | 'expositionsklassen' | 'konsistenz' | 'zement' | 'herstellung' | 'mehlkorn' | 'zusatzstoffe' | 'sonderbetone'>('druckfestigkeit')",
  "useState<'druckfestigkeit' | 'expositionsklassen' | 'konsistenz' | 'zement' | 'herstellung' | 'gesteinskoernung' | 'mehlkorn' | 'zusatzstoffe' | 'sonderbetone'>('druckfestigkeit')"
);

// Add button
const gesteinskoernungButton = `<button
            className={\`px-4 py-2 rounded-xl text-sm font-bold transition-all \${activeTab === 'gesteinskoernung' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/20 hover:border-text-main'}\`}
            onClick={() => setActiveTab('gesteinskoernung')}
          >
            Gesteinskörnungen
          </button>`;

btdContent = btdContent.replace(
  `onClick={() => setActiveTab('herstellung')}
          >
            Zementherstellung
          </button>`,
  `onClick={() => setActiveTab('herstellung')}
          >
            Zementherstellung
          </button>
          ${gesteinskoernungButton}`
);

const gesteinskoernungContent = `
        {activeTab === 'gesteinskoernung' && (
          <div className="flex flex-col gap-6 animate-fade-in">
             <h3 className="text-lg font-bold">Gesteinskörnungen für Beton (DIN EN 12620 / DIN 1045-2)</h3>
             <p className="text-sm text-text-main/80">
               Gesteinskörnungen machen ca. 70-80% des Betonvolumens aus und bilden das formstabile Gerüst (Kapitel 2 der Betontechnischen Daten).
             </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm">
                <h4 className="font-bold text-shiraz mb-2">Begriffe & Kategorien</h4>
                <ul className="space-y-3 text-sm text-text-main/80">
                  <li><strong>Dmax (Größtkorn):</strong> Oberer Siebdurchgang. Typischerweise 8, 16 oder 32 mm. Beeinflusst den Mehlkorn- und Wasserbedarf (je größer das Korn, desto weniger Hohlraum und Oberfläche).</li>
                  <li><strong>Gesteinsarten:</strong> Natürliche (Sand, Kies), rezyklierte (RC-Beton) oder leichte Gesteinskörnungen (z.B. Blähton, Bims für Leichtbeton nach DIN EN 13055).</li>
                  <li><strong>Kornform:</strong> Kubisch ist ideal. Längliche, plattige Körner erhöhen den Wasseranspruch und verschlechtern die Verarbeitbarkeit.</li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm">
                <h4 className="font-bold text-shiraz mb-2">Alkalikieselsäurereaktion (AKR) / Betonkrebs</h4>
                <p className="text-sm text-text-main/80 mb-2">
                  Zusammentreffen von feuchter Umgebung (WF, WA, WS), reaktiver Kieselsäure in der Gesteinskörnung (z.B. Opalsandstein, gebrochener Flint) und hohen Alkalien aus dem Zement. 
                </p>
                <div className="text-xs bg-off-white p-2 rounded">
                  <strong>Vorbeugende Maßnahmen nach DAfStb-Richtlinie:</strong> <br/>
                  - Gesteinskörnungen meiden (E1-Klasse nutzen statt EIII)<br/>
                  - Na-Zemente (Zement mit niedrigem wirksamen Alkaligehalt) verwenden<br/>
                  - Alkalieintrag von außen unterbinden (z.B. hydrophobieren)<br/>
                  - Nutzung von Hüttensand (CEM III)
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-sm md:col-span-2">
                <h4 className="font-bold text-shiraz mb-2">Eigenschaften & Kennwerte</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-main/80">
                  <div>
                    <h5 className="font-bold mb-1">Sieblinien (z.B. A/B/C)</h5>
                    <p className="text-xs">
                      Ideale Kornzusammensetzung. Die <strong>Sieblinie A</strong> ist sehr grob, die <strong>Sieblinie C</strong> sehr fein. Der günstige Bereich (z.B. AB) liegt dazwischen. Ein kontinuierlicher Kornaufbau fördert die Festigkeit und Dichtigkeit.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">Wasseranspruch</h5>
                    <p className="text-xs">
                      Feinanteile und poröse Gesteinskörnungen saugen Wasser auf. Dies muss bei der w/z-Wert-Berechnung als <strong>Kernfeuchte</strong> berücksichtigt werden, ansonsten sinkt die wirksame Wassermenge (schlechte Verarbeitbarkeit).
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">Rezyklierte Körnungen</h5>
                    <p className="text-xs">
                      Dürfen gemäß DAfStb (Typ 1 oder Typ 2) begrenzt beigemischt werden (z.B. 25-45% in trockenen Umgebungen). Problematisch ist oft der höhere Wasseranspruch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
`;

btdContent = btdContent.replace(
  "{activeTab === 'herstellung' && (",
  gesteinskoernungContent + "\n\n        {activeTab === 'herstellung' && ("
);

fs.writeFileSync(btdPath, btdContent);
console.log('integrated gesteinskoernung');
