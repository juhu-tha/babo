// Ausgelagert aus src/modules/Betonkennwerte.tsx (AP 5.2)
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { EC2_CONCRETE_CLASSES } from './daten';
import inhalt from '@/content/betonkennwerte/TabelleTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface TabelleTabProps {
  selectedClassIdx: number;
  setSelectedClassIdx: React.Dispatch<React.SetStateAction<number>>;
}

export default function TabelleTab({ selectedClassIdx, setSelectedClassIdx }: TabelleTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-home-grau/20 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base"><MdText text={inhalt.texte.dinEn19921} /></h3>
            <p className="text-xs text-slate-500"><MdText text={inhalt.texte.vergleichendeÜbersichtAller15} /></p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold font-mono"><MdText text={inhalt.texte.abschnitt7DerFormelsammlung} /></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                <th className="py-2.5 px-3 font-bold">Klasse</th>
                <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="f_{ck}" /> [MPa]</th>
                <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="f_{ck,\text{cube}}" /></th>
                <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="f_{cm}" /></th>
                <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="f_{cd}" /> (DE)</th>
                <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="f_{ctm}" /></th>
                <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="f_{ctk,0{,}05}" /></th>
                <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="E_{cm}" /> [GPa]</th>
                <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="\varepsilon_{c1}" /> [‰]</th>
                <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="\varepsilon_{cu1}" /> [‰]</th>
                <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="\varepsilon_{c2}" /> [‰]</th>
                <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="\varepsilon_{cu2}" /> [‰]</th>
                <th className="py-2.5 px-3 font-bold text-right"><InlineMath math="n" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {EC2_CONCRETE_CLASSES.map((c, idx) => {
                const isSelected = idx === selectedClassIdx;
                const isHighStrength = c.fck > 50;
                const fcdVal = (0.85 * c.fck) / 1.50;

                return (
                  <tr 
                    key={c.name}
                    onClick={() => setSelectedClassIdx(idx)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-shiraz/10 font-semibold' 
                        : isHighStrength 
                          ? 'bg-rose-50/30 hover:bg-rose-50/70' 
                          : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      {c.name}
                      {isHighStrength && (
                        <span className="text-[9px] bg-rose-200 text-rose-800 px-1 py-0.2 rounded font-extrabold uppercase">
                          HFB
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-mono text-right text-slate-800">{formatDeWert(c.fck)}</td>
                    <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeWert(c.fckCube)}</td>
                    <td className="py-2 px-3 font-mono text-right text-slate-800">{formatDeWert(c.fcm)}</td>
                    <td className="py-2 px-3 font-mono text-right text-emerald-800 font-bold">{formatDeZahl(fcdVal, 1)}</td>
                    <td className="py-2 px-3 font-mono text-right text-slate-800">{formatDeZahl(c.fctm, 1)}</td>
                    <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeZahl(c.fctk005, 1)}</td>
                    <td className="py-2 px-3 font-mono text-right text-slate-900 font-bold">{formatDeWert(c.Ecm)}</td>
                    <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeZahl(c.epsC1, 2)}</td>
                    <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeZahl(c.epsCu1, 1)}</td>
                    <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeZahl(c.epsC2, 2)}</td>
                    <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeZahl(c.epsCu2, 1)}</td>
                    <td className="py-2 px-3 font-mono text-right text-slate-600">{formatDeZahl(c.n, 2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-off-white rounded-xl border border-home-grau/20 text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.hinweisZuHochleistungsbetonenC50} /></div>
      </div>
    </div>
  );
}
