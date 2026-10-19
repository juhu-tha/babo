import React from 'react';
import { InlineMath } from 'react-katex';
import { cn } from '@/src/lib/utils';

interface FormulaTextProps {
  text: string;
  className?: string;
}

export function FormulaText({ text, className = "" }: FormulaTextProps) {
  const sanitizeHTML = (str: string) => {
    // Basic sanitization to prevent script injection in educational formulas
    return str.replace(/</g, '\x3C').replace(/>/g, '\x3E');
  };

  const parseText = (input: string) => {
    let processed = sanitizeHTML(input);
    
    // 0. Decode common HTML entities that might appear escaped
    processed = processed.replace(/\{,\}/g, ','); // TeX-Dezimalkomma {,} im Textmodus als Komma
    processed = processed.replace(/&amp;approx;|≈/g, '≈');
    processed = processed.replace(/&amp;ge;|≥/g, '≥');
    processed = processed.replace(/&amp;le;|≤/g, '≤');
    processed = processed.replace(/&amp;middot;|·/g, '·');
    processed = processed.replace(/&amp;times;|×/g, '×');
    processed = processed.replace(/&amp;plusmn;|±/g, '±');
    processed = processed.replace(/&amp;micro;|µ/g, 'µ');

    // Handle Markdown bold and italic before subscript parsing
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // 1. Handle explicit subscripts and superscripts first
    processed = processed.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
    processed = processed.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');

    // e.g. _text -> <sub>text</sub> (stops at non-word char)
    processed = processed.replace(/_([a-zA-Z0-9]+)/g, '<sub>$1</sub>');
    processed = processed.replace(/\^([a-zA-Z0-9]+)/g, '<sup>$1</sup>');

    // Remove \text{} wrapper but keep the content
    processed = processed.replace(/\\text\{([^}]+)\}/g, '$1');

    // Remove \mathrm{} wrapper but keep the content
    processed = processed.replace(/\\mathrm\{([^}]+)\}/g, '$1');

    // Handle \dot{} (combining dot above)
    processed = processed.replace(/\\dot\{([^}]+)\}/g, '$1\u0307');

    // Remove \quad
    processed = processed.replace(/\\quad/g, ' ');

    // 2. Handle specific chemical formulas (subscripts)
    const chemicals = ['CO2', 'H2O', 'O2', 'H2', 'SO3', 'SiO2', 'Al2O3', 'Fe2O3', 'CaCO3', 'Ca\\(OH\\)2', 'C3S', 'C2S', 'C3A', 'C4AF'];
    chemicals.forEach(chem => {
      const regex = new RegExp(`\\b${chem}\\b|${chem}`, 'g');
      processed = processed.replace(regex, (match) => {
        if (match.includes('<sub')) return match;
        return match.replace(/(\d+)/g, '<sub>$1</sub>');
      });
    });

    // 3. Handle specific units (superscripts)
    const units = ['m3', 'm2', 'mm2', 'cm2', 'cm3', 'dm3', 'N/mm2', 'kg/m3', 'kg/dm3'];
    units.forEach(unit => {
      const escapedUnit = unit.replace(/\//g, '\\/');
      const regex = new RegExp(`\\b${escapedUnit}\\b`, 'g');
      processed = processed.replace(regex, (match) => {
        if (match.includes('<sup')) return match;
        return match.replace(/(\d+)/g, '<sup>$1</sup>');
      });
    });

    // 4. Handle common LaTeX math symbols
    processed = processed.replace(/\\%/g, '%');
    processed = processed.replace(/\\cdot/g, '·');
    processed = processed.replace(/\\approx/g, '≈');
    processed = processed.replace(/\\le(q)?/g, '≤');
    processed = processed.replace(/\\ge(q)?/g, '≥');
    processed = processed.replace(/\\neq/g, '≠');
    processed = processed.replace(/\\pm/g, '±');
    processed = processed.replace(/\\rightarrow/g, '→');
    processed = processed.replace(/\\circ/g, '°');
    processed = processed.replace(/\\tan/g, 'tan');
    processed = processed.replace(/\\cot/g, 'cot');
    processed = processed.replace(/\\sin/g, 'sin');
    processed = processed.replace(/\\cos/g, 'cos');
    processed = processed.replace(/\\log/g, 'log');
    processed = processed.replace(/\\Delta/g, 'Δ');
    processed = processed.replace(/\\sigma/g, 'σ');
    processed = processed.replace(/\\varepsilon/g, 'ε');
    processed = processed.replace(/\\epsilon/g, 'ε');
    processed = processed.replace(/\\tau/g, 'τ');
    processed = processed.replace(/\\alpha/g, 'α');
    processed = processed.replace(/\\beta/g, 'β');
    processed = processed.replace(/\\gamma/g, 'γ');
    processed = processed.replace(/\\Psi/g, 'Ψ');
    processed = processed.replace(/\\psi/g, 'ψ');
    processed = processed.replace(/\\theta/g, 'θ');
    processed = processed.replace(/\\varphi/g, 'φ');
    processed = processed.replace(/\\phi/g, 'φ');
    processed = processed.replace(/\\rho/g, 'ρ');
    processed = processed.replace(/\\mu/g, 'μ');
    processed = processed.replace(/\\eta/g, 'η');
    processed = processed.replace(/\\lambda/g, 'λ');
    processed = processed.replace(/\\nu/g, 'ν');
    processed = processed.replace(/\\omega/g, 'ω');
    processed = processed.replace(/\\Gamma/g, 'Γ');
    processed = processed.replace(/\\pi/g, 'π');
    processed = processed.replace(/\\sum/g, '∑');
    processed = processed.replace(/\\int/g, '∫');
    processed = processed.replace(/\\infty/g, '∞');
    processed = processed.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
    processed = processed.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
    processed = processed.replace(/\\left\(/g, '(');
    processed = processed.replace(/\\right\)/g, ')');
    processed = processed.replace(/\\,/g, ' ');

    return processed;
  };

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
