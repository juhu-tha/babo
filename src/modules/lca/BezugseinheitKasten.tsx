import { Ruler, AlertTriangle } from 'lucide-react';
import { BlockMath } from 'react-katex';
import inhalt from '@/content/lca/Bezugseinheit.json';
import { MdText } from '@/src/components/inhalt/MdText';

/** Umrechnung nach src/calc/lca.ts (mengeJeM2Bauteil, funktionelleEinheitBauteil) */
const FORMEL_MENGE = String.raw`m_{\text{FE}} = \begin{cases} d \cdot \rho & \text{deklarierte Einheit kg} \\ d \cdot \rho / 1000 & \text{deklarierte Einheit t} \\ d & \text{deklarierte Einheit m}^3 \\ 1 & \text{deklarierte Einheit m}^2 \end{cases}`;
const FORMEL_FE = String.raw`\text{GWP}_{\text{FE}} = m_{\text{FE}} \cdot \left(\text{GWP}_{A1\text{–}A3} + \text{GWP}_{C3/C4}\right) \cdot (1 + n), \qquad n = \left\lceil T/\text{ND} \right\rceil - 1`;

/**
 * Kasten „Funktionelle und deklarierte Einheit“ im Modul LCA: Grundlagen (Auftrag 28.10.2026):
 * Definitionen, Gegenüberstellung, Bauwesen-Beispiele, Umrechnung und typische Fehler.
 */
export default function BezugseinheitKasten() {
  return (
    <section id="funktionelle-deklarierte-einheit" aria-labelledby="bezugseinheit-titel" className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border-2 border-emerald-300 flex flex-col gap-5 font-normal">
      <header className="flex items-start gap-3 border-b border-home-grau/30 pb-3">
        <span className="bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-200 shrink-0" aria-hidden="true"><Ruler size={20} /></span>
        <div>
          <h3 id="bezugseinheit-titel" className="text-lg font-bold text-slate-900">{inhalt.texte.titel}</h3>
          <p className="text-xs text-slate-600">{inhalt.texte.untertitel}</p>
        </div>
      </header>

      <p className="text-sm text-slate-800 leading-relaxed"><MdText text={inhalt.texte.einleitung} /></p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-1.5">
          <h4 className="font-bold text-sky-950">{inhalt.texte.deklariertTitel}</h4>
          <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.deklariertText} /></p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-1.5">
          <h4 className="font-bold text-emerald-950">{inhalt.texte.funktionellTitel}</h4>
          <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.funktionellText} /></p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
          <h4 className="font-bold text-slate-900">{inhalt.texte.aequivalentTitel}</h4>
          <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.aequivalentText} /></p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-900">{inhalt.texte.tabelleTitel}</h4>
        <div className="overflow-x-auto rounded-xl border border-home-grau/30">
          <table className="w-full text-xs text-left">
            <caption className="sr-only">{inhalt.texte.tabelleCaption}</caption>
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th scope="col" className="p-2.5 font-bold">{inhalt.werte.merkmal}</th>
                <th scope="col" className="p-2.5 font-bold">{inhalt.werte.deklariert}</th>
                <th scope="col" className="p-2.5 font-bold">{inhalt.werte.funktionell}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inhalt.daten.tabelle.map(z => (
                <tr key={z.merkmal}>
                  <th scope="row" className="p-2.5 font-semibold text-slate-900 align-top">{z.merkmal}</th>
                  <td className="p-2.5 text-slate-700 align-top">{z.deklariert}</td>
                  <td className="p-2.5 text-slate-700 align-top">{z.funktionell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-900">{inhalt.texte.beispieleTitel}</h4>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {inhalt.daten.beispiele.map(b => (
            <li key={b.titel} className="border border-home-grau/30 rounded-xl p-3 space-y-1.5 bg-white">
              <strong className="block text-slate-900">{b.titel}</strong>
              <span className="block text-slate-700"><span className="font-semibold text-sky-900">{inhalt.werte.deklariert}: </span>{b.deklariert}</span>
              <span className="block text-slate-700"><span className="font-semibold text-emerald-900">{inhalt.werte.funktionell}: </span>{b.funktionell}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-slate-900">{inhalt.texte.umrechnungTitel}</h4>
        <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.umrechnungText} /></p>
        <div className="overflow-x-auto text-slate-900"><BlockMath math={FORMEL_MENGE} /></div>
        <div className="overflow-x-auto text-slate-900"><BlockMath math={FORMEL_FE} /></div>
        <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.umrechnungBeispiel} /></p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 text-xs">
        <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5"><AlertTriangle size={15} className="text-amber-700" aria-hidden="true" />{inhalt.texte.fehlerTitel}</h4>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-800 leading-relaxed">
          {inhalt.daten.fehler.map(f => <li key={f}><MdText text={f} /></li>)}
        </ul>
      </div>

      <p className="text-[11px] text-slate-600 leading-relaxed border-t border-home-grau/30 pt-3"><MdText text={inhalt.texte.quellen} /></p>
    </section>
  );
}
