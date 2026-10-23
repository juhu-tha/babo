import React from 'react';
import { InlineMath } from 'react-katex';
import { cn } from '@/src/lib/utils';
import { formelTextZuHtml as parseText } from '@/src/utils/formelText';

interface FormulaTextProps {
  text: string;
  className?: string;
}

export function FormulaText({ text, className = "" }: FormulaTextProps) {

  if (typeof text !== 'string') {
    return <span className={className}>{String(text)}</span>;
  }

  const isFormulaLike = text.includes('=') || text.includes('\\le') || text.includes('\\ge') || text.includes('\\approx') || text.includes('<') || text.includes('>');
  const formulaClass = isFormulaLike ? "pdf-formula" : "";

  // If the text contains $ signs, we parse it into text and math segments
  if (text.includes('$')) {
    const parts = text.split('$');
    return (
      <span className={cn(className, formulaClass)} data-formula={isFormulaLike ? text : undefined}>
        {parts.map((part, index) => {
          // Odd indices are inside $...$
          if (index % 2 === 1) {
            return <InlineMath key={index} math={part} />;
          }
          // Even indices are normal text
          return (
            <span 
              key={index} 
              dangerouslySetInnerHTML={{ __html: parseText(part) }} 
            />
          );
        })}
      </span>
    );
  }

  return (
    <span 
      className={cn(className, formulaClass)}
      data-formula={isFormulaLike ? text : undefined}
      dangerouslySetInnerHTML={{ __html: parseText(text) }} 
    />
  );
}
