import React from 'react';
import { InlineMath } from 'react-katex';
import { parseMd, type MdKnoten } from '@/src/lib/inhaltMd';

/**
 * Rendert einen ausgelagerten Fachtext (content/<modul>/<Datei>.json → „texte“) als Inline-Markdown
 * (AP 5.3, Syntax in src/lib/inhaltMd.ts). Erzeugt nur Inline-Knoten (Text, strong, em, sub, sup, code,
 * br, KaTeX, a) ohne eigenes Hüllelement – das umgebende Element mit seinen Klassen bleibt im Modul:
 *
 *   <p className="text-sm">{…}</p>  →  <p className="text-sm"><MdText text={inhalt.texte.einleitung} /></p>
 */
export function MdText({ text }: { text: string }) {
  const knoten = React.useMemo(() => parseMd(text), [text]);
  return <>{knoten.map(rendere)}</>;
}

function rendere(k: MdKnoten, i: number): React.ReactNode {
  if (typeof k === 'string') return k;
  switch (k.typ) {
    case 'strong': return <strong key={i}>{k.kinder.map(rendere)}</strong>;
    case 'em': return <em key={i}>{k.kinder.map(rendere)}</em>;
    case 'sub': return <sub key={i}>{k.kinder.map(rendere)}</sub>;
    case 'sup': return <sup key={i}>{k.kinder.map(rendere)}</sup>;
    case 'code': return <code key={i}>{k.text}</code>;
    case 'br': return <br key={i} />;
    case 'formel': return <InlineMath key={i} math={k.tex} />;
    case 'link': return <a key={i} href={k.href} target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline">{k.kinder.map(rendere)}</a>;
  }
}
