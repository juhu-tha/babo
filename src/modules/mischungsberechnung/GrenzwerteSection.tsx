import { FEUCHTIGKEITSKLASSEN } from './daten';

export function GrenzwerteSection() {
  return (
    <div className="flex flex-col gap-8 mt-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          Grenzwerte (DIN EN 206 / DIN 1045-2) <br/><span className="text-sm font-normal text-text-main/70">Quelle: betontechnische-daten.de u.a.</span>
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Dieser Abschnitt bietet übersichtliche Tabellen für die betontechnologischen Grenzwerte, Feuchtigkeits- und Konsistenzklassen (äquivalent zu den Tabellenwerken bekannter Zementhersteller).
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
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
          
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
             <h3 className="font-bold text-lg mb-3">Konsistenzklassen</h3>
             <div className="text-sm text-text-main/80 mb-2">Die Konsistenz wird über Verdichtungsmaß (C) oder Ausbreitmaß (F) definiert:</div>
             <ul className="space-y-1 text-sm text-text-main/80">
               <li><strong>C0 (V ≥ 1,46) / F1 (A ≤ 340):</strong> Sehr steif / steif</li>
               <li><strong>C1 (V 1.45-1.26) / F2 (A 350-410):</strong> Steif / plastisch</li>
               <li><strong>C2 (V 1.25-1.11) / F3 (A 420-480):</strong> Weich (Standard im Hochbau)</li>
               <li><strong>C3 (V 1.10-1.04) / F4 (A 490-550):</strong> Sehr weich</li>
               <li><strong>F5 (A 560-620) / F6 (A ≥ 630):</strong> Fließfähig / sehr fließfähig</li>
             </ul>
          </div>
        </div>
        
        <div className="mt-6 bg-off-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-lg mb-3">Ausgewählte Expositionsklassen (LP-Beton vs. Normalbeton)</h3>
          <p className="text-sm text-text-main/80 mb-4">
            Besonders im Frostbereich (XF2, XF3, XF4) unterscheiden sich die Anforderungen stark, je nachdem ob künstliche Luftporenbildner (LP) eingesetzt werden.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-home-grau/30">
                  <th className="py-2 px-2">Klasse</th>
                  <th className="py-2 px-2">Ausführung</th>
                  <th className="py-2 px-2">max. w/z</th>
                  <th className="py-2 px-2">min. Festigkeit</th>
                  <th className="py-2 px-2">min. Zement (kg/m³)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-home-grau/10">
                  <td className="py-2 px-2 font-bold" rowSpan={2}>XF2 / XF3</td>
                  <td className="py-2 px-2">ohne LP</td>
                  <td className="py-2 px-2">0,50</td>
                  <td className="py-2 px-2">C35/45</td>
                  <td className="py-2 px-2">320</td>
                </tr>
                <tr className="border-b border-home-grau/30 bg-white">
                  <td className="py-2 px-2">mit LP (min. 4,0%)</td>
                  <td className="py-2 px-2">0,55</td>
                  <td className="py-2 px-2">C25/30</td>
                  <td className="py-2 px-2">300</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-2 px-2 font-bold" rowSpan={2}>XF4</td>
                  <td className="py-2 px-2">ohne LP</td>
                  <td className="py-2 px-2">–</td>
                  <td className="py-2 px-2">nicht geregelt (nur LP-Beton)</td>
                  <td className="py-2 px-2">–</td>
                </tr>
                <tr className="border-b border-home-grau/30 bg-white">
                  <td className="py-2 px-2">mit LP (min. 4,0%)</td>
                  <td className="py-2 px-2">0,50</td>
                  <td className="py-2 px-2">C30/37</td>
                  <td className="py-2 px-2">320</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-main/60 mt-3">
            Hinweis: Bei Gesteinskörnung Dmax = 16 mm erhöht sich der erforderliche Mindestzementgehalt teils um ~20 kg/m³ und bei Dmax = 8 mm um ~40 kg/m³.
          </p>
        </div>
      </div>
    </div>
  );
}
