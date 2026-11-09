// Zugänglicher Name eines Reglers aus seiner sichtbaren Beschriftung (a11y 09.11.2026, Folgeauftrag aus #330).
// Die Beschriftungen stehen als Inline-Markdown in content/<modul>/<Datei>.json („texte“); für aria-label
// wird daraus reiner Text: Formeln ($f_{ck}$) als lesbare Zeichenfolge, Hoch-/Tiefstellung ohne Markierung,
// der Doppelpunkt am Ende entfällt (WCAG 2.5.3: sichtbarer Text bleibt Teil des Namens).
import { parseMd, mdKlartext } from '@/src/lib/inhaltMd';

const TEX_ZEICHEN: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', Delta: 'Δ', varepsilon: 'ε', epsilon: 'ε', eta: 'η', theta: 'θ',
  lambda: 'λ', mu: 'μ', nu: 'ν', rho: 'ρ', sigma: 'σ', Sigma: 'Σ', tau: 'τ', phi: 'φ', varphi: 'φ', psi: 'ψ',
  omega: 'ω', Omega: 'Ω', cdot: '·', times: '×', le: '≤', leq: '≤', ge: '≥', geq: '≥', approx: '≈', circ: '°',
};

/** TeX einer Inline-Formel als lesbarer Text: \text{…}/\mathrm{…} → Inhalt, Griechisch → Zeichen, _ ^ { } entfallen. Exportiert für Tests. */
export function texKlartext(tex: string): string {
  return tex
    .replace(/\\(?:text|mathrm|mathit|mathbf|operatorname)\s*\{([^{}]*)\}/g, '$1')
    .replace(/\\([A-Za-z]+)/g, (_m, n: string) => TEX_ZEICHEN[n] ?? '')
    .replace(/\\[,;!: ]/g, ' ')
    .replace(/[_^{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

type Knoten = ReturnType<typeof parseMd>;
const formelnLesbar = (k: Knoten): Knoten =>
  k.map(x => typeof x === 'string' ? x : x.typ === 'formel' ? texKlartext(x.tex) : 'kinder' in x ? { ...x, kinder: formelnLesbar(x.kinder) } : x);

/** Reiner Text einer Inline-Markdown-Beschriftung für aria-label („Betondeckung c_nom:“ → „Betondeckung c_nom“). */
export function reglerName(md: string): string {
  return mdKlartext(formelnLesbar(parseMd(md))).replace(/\s+/g, ' ').trim().replace(/\s*:$/, '');
}

/** Reiner Text eines Markdown-Teils der Wertanzeige (z. B. Einheit „ N/mm² (Soll: “) für aria-valuetext; Leerraum bleibt. */
export function reglerEinheit(md: string): string {
  return mdKlartext(formelnLesbar(parseMd(md))).replace(/\s+/g, ' ');
}
