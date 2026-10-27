// Reiter „DGZfP-Richtlinien“ im Modul ZfP: Übersicht der DGZfP-Merkblätter (Reihe B) und Leitfäden (B-LF) für das Bauwesen.
// Nur Kennung, Titel, Ausgabe und Beleg aus öffentlichen Verzeichnissen (Stand 27.10.2026), keine Inhalte aus den Merkblättern.
import { Award } from 'lucide-react';
import inhalt from '@/content/zfp/DgzfpTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface DgzfpDokument { kennung: string; titel: string; zweck: string; ausgabe: string; quelle: string }

const DGZFP_DOKUMENTE: readonly DgzfpDokument[] = inhalt.daten["DgzfpTab.dokumente"];

export default function DgzfpTab() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
        <Award size={20} className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.ueberschrift} />
      </h3>
      <p className="text-sm text-slate-700"><MdText text={inhalt.texte.einleitung} /></p>
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={inhalt.texte.tabelleTitel}>
        <table className="w-full text-xs border-collapse min-w-[640px]">
          <caption className="text-left text-sm font-semibold text-slate-800 pb-2">{inhalt.texte.tabelleTitel}</caption>
          <thead>
            <tr className="bg-off-white text-slate-800">
              <th scope="col" className="p-2 text-left border border-home-grau/30">{inhalt.texte.spalteKennung}</th>
              <th scope="col" className="p-2 text-left border border-home-grau/30">{inhalt.texte.spalteTitel}</th>
              <th scope="col" className="p-2 text-left border border-home-grau/30">{inhalt.texte.spalteZweck}</th>
              <th scope="col" className="p-2 text-left border border-home-grau/30">{inhalt.texte.spalteAusgabe}</th>
              <th scope="col" className="p-2 text-left border border-home-grau/30">{inhalt.texte.spalteQuelle}</th>
            </tr>
          </thead>
          <tbody>
            {DGZFP_DOKUMENTE.map(d => (
              <tr key={d.kennung + d.titel} className="align-top text-slate-700">
                <th scope="row" className="p-2 text-left font-mono font-bold text-slate-900 border border-home-grau/30 whitespace-nowrap">{d.kennung}</th>
                <td className="p-2 border border-home-grau/30">{d.titel}</td>
                <td className="p-2 border border-home-grau/30">{d.zweck}</td>
                <td className="p-2 border border-home-grau/30">{d.ausgabe}</td>
                <td className="p-2 border border-home-grau/30">{d.quelle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-700"><MdText text={inhalt.texte.hinweisStand} /></p>
      <p className="text-[11px] text-slate-600"><MdText text={inhalt.texte.quellen} /></p>
    </div>
  );
}
