import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect } from 'react';
import { Network, Calculator, FlaskConical, ArrowRight, Table as TableIcon } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

interface RunData {
  run: number;
  A: number;
  B: number;
  C?: number;
  response: number;
}

export default function StatistischeVersuchsplanung() {
  const [factors, setFactors] = useState<2 | 3>(2);

  const initialData2: RunData[] = [
    { run: 1, A: -1, B: -1, response: 30.5 },
    { run: 2, A: 1, B: -1, response: 24.2 },
    { run: 3, A: -1, B: 1, response: 35.8 },
    { run: 4, A: 1, B: 1, response: 28.5 },
  ];

  const initialData3: RunData[] = [
    { run: 1, A: -1, B: -1, C: -1, response: 28.5 },
    { run: 2, A: 1, B: -1, C: -1, response: 22.0 },
    { run: 3, A: -1, B: 1, C: -1, response: 34.0 },
    { run: 4, A: 1, B: 1, C: -1, response: 27.5 },
    { run: 5, A: -1, B: -1, C: 1, response: 30.0 },
    { run: 6, A: 1, B: -1, C: 1, response: 23.5 },
    { run: 7, A: -1, B: 1, C: 1, response: 36.5 },
    { run: 8, A: 1, B: 1, C: 1, response: 28.0 },
  ];

  const [data2, setData2] = useState<RunData[]>(initialData2);
  const [data3, setData3] = useState<RunData[]>(initialData3);

  const currentData = factors === 2 ? data2 : data3;

  const handleResponseChange = (run: number, newValue: string) => {
    const val = parseFloat(newValue) || 0;
    if (factors === 2) {
      setData2(prev => prev.map(d => d.run === run ? { ...d, response: val } : d));
    } else {
      setData3(prev => prev.map(d => d.run === run ? { ...d, response: val } : d));
    }
  };

  const computeEffect = (factor: 'A' | 'B' | 'C') => {
    let sumHigh = 0;
    let sumLow = 0;
    let countHigh = 0;
    let countLow = 0;

    currentData.forEach((row: any) => {
      if (row[factor] === 1) {
        sumHigh += row.response;
        countHigh++;
      } else if (row[factor] === -1) {
        sumLow += row.response;
        countLow++;
      }
    });

    if (countHigh === 0 || countLow === 0) return 0;
    return ((sumHigh / countHigh) - (sumLow / countLow)).toFixed(2);
  };

  const computeInteraction = (f1: 'A' | 'B' | 'C', f2: 'A' | 'B' | 'C') => {
    let sumHigh = 0;
    let sumLow = 0;
    let countHigh = 0;
    let countLow = 0;

    currentData.forEach((row: any) => {
      const interaction = row[f1] * row[f2];
      if (interaction === 1) {
        sumHigh += row.response;
        countHigh++;
      } else {
        sumLow += row.response;
        countLow++;
      }
    });

    if (countHigh === 0 || countLow === 0) return 0;
    return ((sumHigh / countHigh) - (sumLow / countLow)).toFixed(2);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Network className="text-shiraz" /> Statistische Versuchsplanung (DoE)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die <strong>Statistische Versuchsplanung (Design of Experiments, DoE)</strong> ist eine Methodik, 
            um mit möglichst wenigen Versuchen den maximalen Informationsgewinn über ein System zu erzielen. 
            Anstatt einen Faktor nach dem anderen zu variieren (One-Factor-At-A-Time, OFAT), werden mehrere 
            Faktoren gleichzeitig variiert. Dies ermöglicht nicht nur die Berechnung von Haupteffekten, sondern 
            auch das Erkennen von Wechselwirkungen (Interaktionen) zwischen den Faktoren. <strong>Ändern Sie die Zielgrößen in der Tabelle, um die Auswirkungen in Echtzeit zu sehen!</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
            <FlaskConical size={20} className="text-shiraz" /> Versuchsmatrix konfigurieren
          </h3>
          <p className="text-sm text-text-main/80">
            Wählen Sie die Anzahl der Faktoren für ein vollfaktorielles Versuchsdesign auf zwei Stufen (2^k).
          </p>
          
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => setFactors(2)}
              className={`flex-1 py-3 px-4 rounded-xl border transition-all text-sm font-bold ${
                factors === 2 ? 'bg-shiraz text-white border-shiraz' : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/50'
              }`}
            >
              2 Faktoren (2^2 = 4 Versuche)
            </button>
            <button
              onClick={() => setFactors(3)}
              className={`flex-1 py-3 px-4 rounded-xl border transition-all text-sm font-bold ${
                factors === 3 ? 'bg-shiraz text-white border-shiraz' : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/50'
              }`}
            >
              3 Faktoren (2^3 = 8 Versuche)
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mt-4 text-sm text-blue-900/80">
            <strong>Faktoren:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Faktor A:</strong> w/z-Wert (-1 = 0,40, +1 = 0,50)</li>
              <li><strong>Faktor B:</strong> Zementgehalt (-1 = 300 kg/m³, +1 = 350 kg/m³)</li>
              {factors === 3 && <li><strong>Faktor C:</strong> Fließmittel (-1 = 0%, +1 = 1%)</li>}
            </ul>
            <p className="mt-2"><strong>Zielgröße (Response):</strong> Druckfestigkeit [MPa]</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
            <TableIcon size={20} className="text-shiraz" /> Versuchsplan & Ergebnisse
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-off-white text-text-main">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Run</th>
                  <th className="px-4 py-2">A</th>
                  <th className="px-4 py-2">B</th>
                  {factors === 3 && <th className="px-4 py-2">C</th>}
                  <th className="px-4 py-2 rounded-tr-lg font-bold text-shiraz">Festigkeit (editierbar)</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((row) => (
                  <tr key={row.run} className="border-b border-home-grau/10 last:border-0 hover:bg-off-white/50">
                    <td className="px-4 py-2">{formatDeWert(row.run)}</td>
                    <td className="px-4 py-2 font-mono">{(row as any).A > 0 ? '+1' : '-1'}</td>
                    <td className="px-4 py-2 font-mono">{(row as any).B > 0 ? '+1' : '-1'}</td>
                    {factors === 3 && <td className="px-4 py-2 font-mono">{(row as any).C > 0 ? '+1' : '-1'}</td>}
                    <td className="px-4 py-2">
                      <input 
                        type="number" 
                        value={(row as any).response}
                        onChange={(e) => handleResponseChange(row.run, e.target.value)}
                        className="w-20 p-1 border border-home-grau/30 rounded font-bold text-shiraz bg-white text-right"
                        step="0.1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <Calculator size={20} className="text-shiraz" /> Effektauswertung
        </h3>
        <p className="text-sm text-text-main/80 mb-2">
          Der Haupteffekt eines Faktors ist die durchschnittliche Änderung der Zielgröße, wenn der Faktor von der unteren (-1) auf die obere (+1) Stufe geändert wird.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col items-center text-center">
            <span className="text-xs font-bold text-home-grau uppercase mb-1">Effekt A (w/z)</span>
            <span className={`text-2xl font-bold ${Number(computeEffect('A')) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatDeZahl(Number(computeEffect('A')), 2)}
            </span>
            <span className="text-xs text-text-main/60 mt-1">MPa</span>
          </div>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col items-center text-center">
            <span className="text-xs font-bold text-home-grau uppercase mb-1">Effekt B (Zement)</span>
            <span className={`text-2xl font-bold ${Number(computeEffect('B')) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatDeZahl(Number(computeEffect('B')), 2)}
            </span>
            <span className="text-xs text-text-main/60 mt-1">MPa</span>
          </div>
          {factors === 3 && (
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-home-grau uppercase mb-1">Effekt C (Fließm.)</span>
              <span className={`text-2xl font-bold ${Number(computeEffect('C')) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatDeZahl(Number(computeEffect('C')), 2)}
              </span>
              <span className="text-xs text-text-main/60 mt-1">MPa</span>
            </div>
          )}
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col items-center text-center">
            <span className="text-xs font-bold text-home-grau uppercase mb-1">Interaktion AB</span>
            <span className={`text-2xl font-bold ${Number(computeInteraction('A', 'B')) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatDeZahl(Number(computeInteraction('A', 'B')), 2)}
            </span>
            <span className="text-xs text-text-main/60 mt-1">MPa</span>
          </div>
        </div>

        <div className="mt-4 text-sm text-text-main/80 space-y-3">
          <p>
            <strong className="text-text-main">Interpretation der Haupteffekte:</strong>
            <br />Ein negativer Effekt bei A (w/z-Wert) bedeutet, dass eine Erhöhung des w/z-Wertes von 0,40 auf 0,50 die Druckfestigkeit im Durchschnitt um {formatDeZahl(Math.abs(Number(computeEffect('A'))), 2)} MPa senkt. Ein positiver Effekt bei B (Zementgehalt) zeigt, dass mehr Zement die Festigkeit erhöht.
          </p>
          <p>
            <strong className="text-text-main">Interaktion AB:</strong>
            <br />Wenn der Interaktionseffekt AB ungleich 0 ist (oder signifikant groß), bedeutet dies, dass die Auswirkung der Erhöhung des Zementgehalts (B) nicht unabhängig vom w/z-Wert (A) ist. In der Baupraxis ist dies essenziell: Mehr Zement bringt bei einem hohen w/z-Wert eventuell einen geringeren Festigkeitszuwachs als bei einem niedrigen w/z-Wert.
          </p>
        </div>
      </div>
    
      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 4 Labor: 2^k-Versuchspläne, Haupt- und Wechselwirkungseffekte geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Statistische Versuchsplanung', url: 'https://de.wikipedia.org/wiki/Statistische_Versuchsplanung' },
          { title: 'Varianzanalyse', url: 'https://de.wikipedia.org/wiki/Varianzanalyse' },
          { title: 'Regressionsanalyse', url: 'https://de.wikipedia.org/wiki/Regressionsanalyse' }
        ]}
        literatur={[
          'Montgomery, D. C. (2017): Design and Analysis of Experiments (9th Edition, Wiley)',
          'Siebertz, K.; van Bebber, D.; Hochkirchen, T. (2017): Statistische Versuchsplanung: Design of Experiments (DoE) (2. Auflage, Springer Vieweg)',
          'Kleppmann, W. (2020): Taschenbuch Versuchsplanung (10. Auflage, Hanser Verlag)'
        ]}
        regelwerke={[
          { title: 'DIN ISO 3534-3 (Statistik - Begriffe und Formelzeichen - Teil 3: Versuchsplanung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+ISO+3534-3' },
          { title: 'ISO 5725 (Genauigkeit (Richtigkeit und Präzision) von Messverfahren und Messergebnissen; DIN ISO 5725 zurückgezogen)', url: 'https://www.dinmedia.de/de/suche?q=ISO+5725' }
        ]}
        formeln={[
          {
            formel: 'E_A = \\bar{y}_{A^+} - \\bar{y}_{A^-} = \\frac{1}{2^{k-1}} \\sum_{i=1}^{2^k} c_i \\cdot y_i',
            erklaerung: 'Haupteffekt eines Faktors A in einem 2^k-Faktorplan (vollfaktoriell): Differenz der Mittelwerte aller Versuchsläufe auf oberer (+) und unterer (-) Stufe.',
            quelle: 'DoE / Montgomery'
          },
          {
            formel: 'y = \\beta_0 + \\sum_{i=1}^k \\beta_i x_i + \\sum_{i < j} \\beta_{ij} x_i x_j + \\varepsilon',
            erklaerung: 'Lineares statistisches Regressionsmodell mit Interaktionseffekten beta_ij zweier Faktoren (z.B. w/z-Wert und Zementgehalt auf Betonfestigkeit).',
            quelle: 'DIN ISO 3534-3'
          }
        ]}
      />
</div>
  );
}
