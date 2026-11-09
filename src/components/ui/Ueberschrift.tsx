import React from 'react';

/**
 * Überschrift mit wählbarer Ebene für Bausteine, die in verschiedenen Modulen unter unterschiedlich tiefen
 * Überschriften stehen (a11y 09.11.2026, Überschriftenfolge über Komponentengrenzen). `wie` ist die Ebene,
 * deren Aussehen erhalten bleibt: liegt `ebene` darüber (angehoben), erhält das Element die Klasse wie-h<N>
 * (src/index.css gibt h3.wie-h4 / h4.wie-h5 die frühere Schriftgröße und Farbe; h2 und h3 sehen gleich aus).
 */
export type Ebene = 1 | 2 | 3 | 4 | 5 | 6;

export function Ueberschrift({ ebene, wie, className = '', children, ...rest }: {
  ebene: number; wie: Ebene; className?: string; children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLHeadingElement>, 'className' | 'children'>) {
  const n = Math.min(6, Math.max(1, Math.round(ebene))) as Ebene;
  const Tag = `h${n}` as 'h1';
  const klasse = n < wie && wie >= 4 ? `${className} wie-h${wie}`.trim() : className;
  return <Tag className={klasse} {...rest}>{children}</Tag>;
}
