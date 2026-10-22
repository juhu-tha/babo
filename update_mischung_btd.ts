import fs from 'fs';

const filePath = 'src/modules/Mischungsberechnung.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update KONSISTENZ_DATA
content = content.replace(
  "const KONSISTENZ_DATA: Record<string, { label: string, waterMod: number }> = {",
  `const KONSISTENZ_DATA: Record<string, { label: string, waterMod: number }> = {
  'C0': { label: 'C0 (sehr steif)', waterMod: -40 },
  'C1': { label: 'C1 (steif)', waterMod: -30 },
  'C2': { label: 'C2 (plastisch)', waterMod: -15 },
  'C3': { label: 'C3 (weich)', waterMod: 0 },`
);

// 2. Add Tab
content = content.replace(
  "<button\n          className={`px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${",
  `<button
          className={\`px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 \${
            activeTab === 'grenzwerte' ? 'border-b-2 border-shiraz text-shiraz' : 'text-home-grau hover:text-text-main'
          }\`}
          onClick={() => setActiveTab('grenzwerte')}
        >
          <ShieldAlert size={16} /> Grenzwerte & Klassen
        </button>
        <button
          className={\`px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 \${`
);

// 3. Add Tab State
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'berechnung' | 'anleitung' | 'walzkurven'>('berechnung');",
  "const [activeTab, setActiveTab] = useState<'berechnung' | 'anleitung' | 'walzkurven' | 'grenzwerte'>('berechnung');"
);

// 4. Feuchtigkeitsklassen
const fdContent = `
const FEUCHTIGKEITSKLASSEN = [
  { id: 'WO', name: 'WO (Trocken)', desc: 'Beton, der nach dem Austrocknen w\xE4hrend der Nutzung trocken bleibt (z.B. Innenr\xE4ume).' },
  { id: 'WF', name: 'WF (Feucht)', desc: 'Beton, der h\xE4ufig oder lange feucht ist (z.B. ungesch\xFCtzte Au\xDFenbauteile).' },
  { id: 'WA', name: 'WA (Feucht + Alkalien)', desc: 'Beton, der h\xE4ufig feucht ist und externe Alkalien aufnimmt (z.B. Tausalzbereiche).' },
  { id: 'WS', name: 'WS (Feucht + Alkalien + Dynamisch)', desc: 'Wie WA, aber mit starker dynamischer mechanischer Beanspruchung (z.B. Betondecken auf Stra\xDFen).' }
];

function GrenzwerteSection() {
  return (
    <div className="flex flex-col gap-8 mt-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4">Grenzwerte (DIN EN 206 / DIN 1045-2) <br/><span className="text-sm font-normal text-text-main/70">Quelle: betontechnische-daten.de u.a.</span></h2>
        <p className="text-text-main/80 mb-6">
          Dieser Abschnitt bietet \xFCbersichtliche Tabellen f\xFCr die betontechnologischen Grenzwerte, Feuchtigkeits- und Konsistenzklassen (\xE4quivalent zu den Tabellenwerken bekannter Zementhersteller).
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/20">
             <h3 className="font-bold text-lg mb-3">Feuchtigkeitsklassen (AKR)</h3>
             <ul className="space-y-3">
               {FEUCHTIGKEITSKLASSEN.map(f => (
                 <li key={f.id} className="text-sm">
                   <strong className="text-text-main">{f.name}</strong> 
                   <div className="text-text-main/70">{f.desc}</div>
                 </li>
               ))}
             </ul>
          </div>
          
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/20">
             <h3 className="font-bold text-lg mb-3">Konsistenzklassen</h3>
             <div className="text-sm text-text-main/80 mb-2">Die Konsistenz wird \xFCber Verdichtungsma\xDF (C) oder Ausbreitma\xDF (F) definiert:</div>
             <ul className="space-y-1 text-sm text-text-main/80">
               <li><strong>C0 (V \u2265 1.46) / F1 (A \u2264 340):</strong> Sehr steif / steif</li>
               <li><strong>C1 (V 1.45-1.26) / F2 (A 350-410):</strong> Steif / plastisch</li>
               <li><strong>C2 (V 1.25-1.11) / F3 (A 420-480):</strong> Weich (Standard im Hochbau)</li>
               <li><strong>C3 (V 1.10-1.04) / F4 (A 490-550):</strong> Sehr weich</li>
               <li><strong>F5 (A 560-620) / F6 (A \u2265 630):</strong> Flie\xDFf\xE4hig / sehr flie\xDFf\xE4hig</li>
             </ul>
          </div>
        </div>
        
        <div className="mt-6 bg-off-white p-5 rounded-xl border border-home-grau/20">
          <h3 className="font-bold text-lg mb-3">Ausgew\xE4hlte Expositionsklassen (LP-Beton vs. Normalbeton)</h3>
          <p className="text-sm text-text-main/80 mb-4">
            Besonders im Frostbereich (XF2, XF3, XF4) unterscheiden sich die Anforderungen stark, je nachdem ob k\xFCnstliche Luftporenbildner (LP) eingesetzt werden.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-home-grau/30">
                  <th className="py-2 px-2">Klasse</th>
                  <th className="py-2 px-2">Ausf\xFChrung</th>
                  <th className="py-2 px-2">max. w/z</th>
                  <th className="py-2 px-2">min. Festigkeit</th>
                  <th className="py-2 px-2">min. Zement (kg/m\xB3)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-home-grau/10">
                  <td className="py-2 px-2 font-bold" rowSpan={2}>XF2 / XF3</td>
                  <td className="py-2 px-2">ohne LP</td>
                  <td className="py-2 px-2">0.50 / 0.55</td>
                  <td className="py-2 px-2">C35/45</td>
                  <td className="py-2 px-2">320</td>
                </tr>
                <tr className="border-b border-home-grau/20 bg-white">
                  <td className="py-2 px-2">mit LP (min. 4.0%)</td>
                  <td className="py-2 px-2">0.55</td>
                  <td className="py-2 px-2">C25/30</td>
                  <td className="py-2 px-2">300</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-2 px-2 font-bold" rowSpan={2}>XF4</td>
                  <td className="py-2 px-2">ohne LP</td>
                  <td className="py-2 px-2">0.45</td>
                  <td className="py-2 px-2">C50/60</td>
                  <td className="py-2 px-2">340</td>
                </tr>
                <tr className="border-b border-home-grau/20 bg-white">
                  <td className="py-2 px-2">mit LP (min. 4.0%)</td>
                  <td className="py-2 px-2">0.50</td>
                  <td className="py-2 px-2">C30/37</td>
                  <td className="py-2 px-2">320</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-main/60 mt-3">
            Hinweis: Bei Gesteinsk\xF6rnung Dmax = 16 mm erh\xF6ht sich der erforderliche Mindestzementgehalt teils um ~20 kg/m\xB3 und bei Dmax = 8 mm um ~40 kg/m\xB3.
          </p>
        </div>
      </div>
    </div>
  );
}
`;

content = content.replace("function WalzKurvenSection() {", fdContent + "\n\nfunction WalzKurvenSection() {");

content = content.replace("{activeTab === 'walzkurven' && (\\n        <WalzKurvenSection />\\n      )}", "{activeTab === 'grenzwerte' && (\n        <GrenzwerteSection />\n      )}\n\n      {activeTab === 'walzkurven' && (\n        <WalzKurvenSection />\n      )}");

fs.writeFileSync(filePath, content);
console.log("Updated Mischungsberechnung.tsx successfully");
