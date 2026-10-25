import type { Dispatch, SetStateAction } from 'react';
import { Recycle } from 'lucide-react';
import { baustoffRecyclingData } from './daten';
import { formatDeWert } from '@/src/utils/numberFormat';

export interface BaustoffrecyclingTabProps {
  setSelectedRecyclingMaterial: Dispatch<SetStateAction<number>>;
  selectedRecyclingMaterial: number;
}

export function BaustoffrecyclingTab({ setSelectedRecyclingMaterial, selectedRecyclingMaterial }: BaustoffrecyclingTabProps) {
  return (
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
                    <div className="text-sm font-mono font-bold text-shiraz">{formatDeWert(baustoffRecyclingData[selectedRecyclingMaterial].percentage)}%</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-shiraz/5 border border-shiraz/20 flex items-center justify-center text-xs font-bold text-shiraz">
                    {formatDeWert(baustoffRecyclingData[selectedRecyclingMaterial].percentage)}%
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
                <td className="py-2.5 px-3 font-semibold text-shiraz">{formatDeWert(mat.percentage)}%</td>
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
  );
}
