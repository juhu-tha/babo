import React from 'react';
import { Landmark, Info, ExternalLink } from 'lucide-react';
import inhalt from '@/content/zertifizierung/Kfn.json';
import { MdText } from '@/src/components/inhalt/MdText';

const STUFEN = [
  { stufe: inhalt.werte.stufe55, anf: inhalt.werte.anf55, wohn: inhalt.werte.wohn55, nwg: inhalt.werte.nwg55 },
  { stufe: inhalt.werte.stufe40, anf: inhalt.werte.anf40, wohn: inhalt.werte.wohn40, nwg: inhalt.werte.nwg40 },
  { stufe: inhalt.werte.stufe40qng, anf: inhalt.werte.anf40qng, wohn: inhalt.werte.wohn40qng, nwg: inhalt.werte.nwg40qng },
] as const;

/** Reiter „Klimafreundlicher Neubau (KFN)“ im Bereich Zertifizierungen und Förderungen (Ergänzung 28.10.2026) */
export function KfnFoerderung() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-shiraz/20 bg-shiraz/5 p-5 text-sm text-text-main">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-text-main">
          <Landmark size={20} className="text-shiraz" aria-hidden="true" /> {inhalt.texte.titel}
        </h3>
        <p className="leading-relaxed"><MdText text={inhalt.texte.einleitung} /></p>
      </div>

      <section aria-labelledby="kfn-stufen" className="rounded-2xl border border-home-grau/30 bg-white p-5">
        <h4 id="kfn-stufen" className="mb-3 font-bold text-text-main">{inhalt.texte.stufenTitel}</h4>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-labelledby="kfn-stufen">
          <table className="w-full min-w-[640px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-home-grau/30 text-text-main">
                <th scope="col" className="py-2 pr-3 font-bold">{inhalt.werte.spalteStufe}</th>
                <th scope="col" className="py-2 pr-3 font-bold">{inhalt.werte.spalteAnforderung}</th>
                <th scope="col" className="py-2 pr-3 font-bold">{inhalt.werte.spalteWohn}</th>
                <th scope="col" className="py-2 font-bold">{inhalt.werte.spalteNwg}</th>
              </tr>
            </thead>
            <tbody>
              {STUFEN.map(s => (
                <tr key={s.stufe} className="border-b border-home-grau/15 align-top">
                  <th scope="row" className="py-2 pr-3 font-bold text-shiraz whitespace-nowrap">{s.stufe}</th>
                  <td className="py-2 pr-3 text-text-main/90">{s.anf}</td>
                  <td className="py-2 pr-3 text-text-main whitespace-nowrap">{s.wohn}</td>
                  <td className="py-2 text-text-main">{s.nwg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-text-main/70"><MdText text={inhalt.texte.stufenHinweis} /></p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-sm">
        <section className="rounded-2xl border border-home-grau/30 bg-white p-5">
          <h4 className="mb-2 font-bold text-text-main">{inhalt.texte.qngTitel}</h4>
          <p className="leading-relaxed text-text-main/90"><MdText text={inhalt.texte.qngText} /></p>
        </section>
        <section className="rounded-2xl border border-home-grau/30 bg-white p-5 space-y-2">
          <h4 className="font-bold text-text-main">{inhalt.texte.weitereTitel}</h4>
          <p className="leading-relaxed text-text-main/90"><MdText text={inhalt.texte.weitere296} /></p>
          <p className="leading-relaxed text-text-main/90"><MdText text={inhalt.texte.weitere498} /></p>
        </section>
        <section className="rounded-2xl border border-home-grau/30 bg-white p-5">
          <h4 className="mb-2 font-bold text-text-main">{inhalt.texte.gemeinsamTitel}</h4>
          <p className="leading-relaxed text-text-main/90"><MdText text={inhalt.texte.gemeinsam} /></p>
        </section>
        <section className="rounded-2xl border border-home-grau/30 bg-white p-5">
          <h4 className="mb-2 font-bold text-text-main">{inhalt.texte.lernTitel}</h4>
          <p className="leading-relaxed text-text-main/90"><MdText text={inhalt.texte.lernText} /></p>
        </section>
      </div>

      <p role="note" className="flex items-start gap-2 rounded-xl border border-home-grau/30 bg-off-white p-3 text-xs text-text-main/80">
        <Info size={14} className="mt-0.5 shrink-0 text-shiraz" aria-hidden="true" /> {inhalt.texte.standHinweis}
      </p>

      <section aria-labelledby="kfn-quellen" className="text-xs">
        <h4 id="kfn-quellen" className="mb-1 font-bold text-text-main">{inhalt.texte.quellenTitel}</h4>
        <ul className="space-y-1">
          {inhalt.daten.quellen.map(q => (
            <li key={q.url}>
              <a href={q.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-shiraz underline underline-offset-2">
                {q.titel} <ExternalLink size={11} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default KfnFoerderung;
