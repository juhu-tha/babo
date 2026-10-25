import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { Network, Calculator, FlaskConical, Table as TableIcon } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/statistischeversuchsplanung/StatistischeVersuchsplanung.json';
import { MdText } from '@/src/components/inhalt/MdText';

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

    currentData.forEach((row) => {
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

    currentData.forEach((row) => {
      const interaction = (row[f1] ?? NaN) * (row[f2] ?? NaN); // C fehlt im 2-Faktor-Plan → NaN wie zuvor
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
          <Network className="text-shiraz" /><MdText text={inhalt.texte.statistischeVersuchsplanungDoe} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieStatistischeVersuchsplanungDesign} /></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
            <FlaskConical size={20} className="text-shiraz" /><MdText text={inhalt.texte.versuchsmatrixKonfigurieren} /></h3>
          <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.wählenSieDieAnzahl} /></p>
          
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => setFactors(2)}
              className={`flex-1 py-3 px-4 rounded-xl border transition-all text-sm font-bold ${
                factors === 2 ? 'bg-shiraz text-white border-shiraz' : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/50'
              }`}
            ><MdText text={inhalt.texte.t2Faktoren22} /></button>
            <button
              onClick={() => setFactors(3)}
              className={`flex-1 py-3 px-4 rounded-xl border transition-all text-sm font-bold ${
                factors === 3 ? 'bg-shiraz text-white border-shiraz' : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/50'
              }`}
            ><MdText text={inhalt.texte.t3Faktoren23} /></button>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mt-4 text-sm text-blue-900/80">
            <strong>Faktoren:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><MdText text={inhalt.texte.faktorAWZ} /></li>
              <li><MdText text={inhalt.texte.faktorBZementgehalt1} /></li>
              {factors === 3 && <li><MdText text={inhalt.texte.faktorCFließmittel1} /></li>}
            </ul>
            <p className="mt-2"><MdText text={inhalt.texte.zielgrößeResponseDruckfestigkeitMpa} /></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
            <TableIcon size={20} className="text-shiraz" /><MdText text={inhalt.texte.versuchsplanErgebnisse} /></h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-off-white text-text-main">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Run</th>
                  <th className="px-4 py-2">A</th>
                  <th className="px-4 py-2">B</th>
                  {factors === 3 && <th className="px-4 py-2">C</th>}
                  <th className="px-4 py-2 rounded-tr-lg font-bold text-shiraz"><MdText text={inhalt.texte.festigkeitEditierbar} /></th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((row) => (
                  <tr key={row.run} className="border-b border-home-grau/10 last:border-0 hover:bg-off-white/50">
                    <td className="px-4 py-2">{formatDeWert(row.run)}</td>
                    <td className="px-4 py-2 font-mono">{row.A > 0 ? '+1' : '-1'}</td>
                    <td className="px-4 py-2 font-mono">{row.B > 0 ? '+1' : '-1'}</td>
                    {factors === 3 && <td className="px-4 py-2 font-mono">{(row.C ?? 0) > 0 ? '+1' : '-1'}</td>}
                    <td className="px-4 py-2">
                      <input 
                        type="number" 
                        value={row.response}
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
        <p className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.derHaupteffektEinesFaktors} /></p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col items-center text-center">
            <span className="text-xs font-bold text-home-grau uppercase mb-1"><MdText text={inhalt.texte.effektAWZ} /></span>
            <span className={`text-2xl font-bold ${Number(computeEffect('A')) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatDeZahl(Number(computeEffect('A')), 2)}
            </span>
            <span className="text-xs text-text-main/60 mt-1">MPa</span>
          </div>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col items-center text-center">
            <span className="text-xs font-bold text-home-grau uppercase mb-1"><MdText text={inhalt.texte.effektBZement} /></span>
            <span className={`text-2xl font-bold ${Number(computeEffect('B')) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatDeZahl(Number(computeEffect('B')), 2)}
            </span>
            <span className="text-xs text-text-main/60 mt-1">MPa</span>
          </div>
          {factors === 3 && (
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-home-grau uppercase mb-1"><MdText text={inhalt.texte.effektCFließm} /></span>
              <span className={`text-2xl font-bold ${Number(computeEffect('C')) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatDeZahl(Number(computeEffect('C')), 2)}
              </span>
              <span className="text-xs text-text-main/60 mt-1">MPa</span>
            </div>
          )}
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col items-center text-center">
            <span className="text-xs font-bold text-home-grau uppercase mb-1"><MdText text={inhalt.texte.interaktionAb} /></span>
            <span className={`text-2xl font-bold ${Number(computeInteraction('A', 'B')) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatDeZahl(Number(computeInteraction('A', 'B')), 2)}
            </span>
            <span className="text-xs text-text-main/60 mt-1">MPa</span>
          </div>
        </div>

        <div className="mt-4 text-sm text-text-main/80 space-y-3">
          <p>
            <strong className="text-text-main"><MdText text={inhalt.texte.interpretationDerHaupteffekte} /></strong><MdText text={inhalt.texte.brEinNegativerEffekt} />{formatDeZahl(Math.abs(Number(computeEffect('A'))), 2)}<MdText text={inhalt.texte.mpaSenktEinPositiver} /></p>
          <p>
            <strong className="text-text-main"><MdText text={inhalt.texte.interaktionAb2} /></strong><MdText text={inhalt.texte.brWennDerInteraktionseffekt} /></p>
        </div>
      </div>
    
      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap4} 
        wikipedia={[
          { title: inhalt.werte.statistischeVersuchsplanung, url: 'https://de.wikipedia.org/wiki/Statistische_Versuchsplanung' },
          { title: 'Varianzanalyse', url: 'https://de.wikipedia.org/wiki/Varianzanalyse' },
          { title: 'Regressionsanalyse', url: 'https://de.wikipedia.org/wiki/Regressionsanalyse' }
        ]}
        literatur={inhalt.daten["StatistischeVersuchsplanung.literatur"]}
        regelwerke={inhalt.daten["StatistischeVersuchsplanung.regelwerke"]}
        formeln={inhalt.daten["StatistischeVersuchsplanung.formeln"]}
      />
</div>
  );
}
