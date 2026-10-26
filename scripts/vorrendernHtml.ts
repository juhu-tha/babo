/**
 * HTML-Werkzeuge für das Vorrendern (Z52, scripts/vorrendern.ts) – ohne Zusatzpaket.
 * Die Eingabe stammt aus react-dom/server und ist wohlgeformt: Text und Attributwerte sind maskiert
 * (kein rohes < oder > darin), Nicht-Leer-Elemente haben immer ein End-Tag. Das genügt für einen kleinen
 * Baum-Parser; beliebiges HTML aus dem Netz soll hiermit nicht verarbeitet werden.
 */

export type Knoten =
  | { art: 'element'; tag: string; attrs: string; kinder: Knoten[]; leer: boolean }
  | { art: 'text'; text: string }
  | { art: 'roh'; text: string };

const LEER = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const ROHTEXT = new Set(['script', 'style']);

/** HTML-Fragment in einen Knotenbaum zerlegen (Kommentare als 'roh') */
export function zerlege(html: string): Knoten[] {
  const wurzel: Knoten[] = [];
  const stapel: Array<Extract<Knoten, { art: 'element' }>> = [];
  const anhaengen = (k: Knoten) => (stapel.length ? stapel[stapel.length - 1].kinder : wurzel).push(k);
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) { anhaengen({ art: 'text', text: html.slice(i) }); break; }
    if (lt > i) anhaengen({ art: 'text', text: html.slice(i, lt) });
    if (html.startsWith('<!--', lt)) {
      const ende = html.indexOf('-->', lt + 4);
      if (ende < 0) throw new Error('zerlege: Kommentar ohne Ende');
      anhaengen({ art: 'roh', text: html.slice(lt, ende + 3) });
      i = ende + 3;
      continue;
    }
    const gt = html.indexOf('>', lt);
    if (gt < 0) throw new Error('zerlege: Tag ohne Ende');
    const roh = html.slice(lt + 1, gt);
    if (roh.startsWith('/')) {
      const tag = roh.slice(1).trim().toLowerCase();
      const oben = stapel.pop();
      if (!oben || oben.tag !== tag) throw new Error(`zerlege: </${tag}> passt nicht zu <${oben?.tag ?? '–'}>`);
      i = gt + 1;
      continue;
    }
    if (roh.startsWith('!')) { anhaengen({ art: 'roh', text: html.slice(lt, gt + 1) }); i = gt + 1; continue; }
    const m = /^([a-zA-Z][\w:-]*)([\s\S]*)$/.exec(roh);
    if (!m) throw new Error(`zerlege: unbekanntes Tag <${roh.slice(0, 20)}`);
    const tag = m[1].toLowerCase();
    const attrs = m[2]; // roh, samt abschließendem „/“ (<img …/>), damit der Rundlauf exakt bleibt
    const selbst = attrs.endsWith('/');
    const el: Extract<Knoten, { art: 'element' }> = { art: 'element', tag, attrs, kinder: [], leer: selbst || LEER.has(tag) };
    anhaengen(el);
    i = gt + 1;
    if (el.leer) continue;
    if (ROHTEXT.has(tag)) {
      const ende = html.toLowerCase().indexOf(`</${tag}>`, i);
      if (ende < 0) throw new Error(`zerlege: <${tag}> ohne Ende`);
      if (ende > i) el.kinder.push({ art: 'roh', text: html.slice(i, ende) });
      i = ende + tag.length + 3;
      continue;
    }
    stapel.push(el);
  }
  if (stapel.length) throw new Error(`zerlege: <${stapel[stapel.length - 1].tag}> nicht geschlossen`);
  return wurzel;
}

export function zusammensetzen(knoten: readonly Knoten[]): string {
  let aus = '';
  for (const k of knoten) {
    if (k.art !== 'element') { aus += k.text; continue; }
    aus += `<${k.tag}${k.attrs}>`;
    if (k.leer) continue;
    aus += zusammensetzen(k.kinder) + `</${k.tag}>`;
  }
  return aus;
}

/** sichtbarer Textumfang (Entities als ein Zeichen, Leerraum zusammengefasst) */
export function textLaenge(knoten: readonly Knoten[]): number {
  let n = 0;
  for (const k of knoten) {
    if (k.art === 'text') n += k.text.replace(/&[#\w]+;/g, '_').replace(/\s+/g, ' ').length;
    else if (k.art === 'element' && !ROHTEXT.has(k.tag)) n += textLaenge(k.kinder);
  }
  return n;
}

export function attr(el: Knoten, name: string): string | undefined {
  if (el.art !== 'element') return undefined;
  const m = new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(el.attrs);
  return m?.[1];
}

/** erstes Element (Tiefensuche), das die Bedingung erfüllt */
export function finde(knoten: readonly Knoten[], pruef: (el: Extract<Knoten, { art: 'element' }>) => boolean): Extract<Knoten, { art: 'element' }> | undefined {
  for (const k of knoten) {
    if (k.art !== 'element') continue;
    if (pruef(k)) return k;
    const tiefer = finde(k.kinder, pruef);
    if (tiefer) return tiefer;
  }
  return undefined;
}

export interface Budget { text: number; bytes: number }

/**
 * Anfang eines Inhaltsbaums behalten: ganze Elemente, solange Text- und Byte-Budget reichen; das erste Element,
 * das nicht mehr ganz passt, wird rekursiv angeschnitten (mindestens ein Teil seines Inhalts), danach ist Schluss.
 * So bleibt bei langen Modulen der erste Abschnitt stehen, ohne die ganze Seite auszuliefern.
 */
export function kuerze(knoten: readonly Knoten[], budget: Budget): { knoten: Knoten[]; voll: boolean } {
  const aus: Knoten[] = [];
  let text = 0, bytes = 0;
  for (const k of knoten) {
    const t = k.art === 'element' ? textLaenge([k]) : k.art === 'text' ? textLaenge([k]) : 0;
    const b = zusammensetzen([k]).length;
    if (text + t <= budget.text && bytes + b <= budget.bytes) { aus.push(k); text += t; bytes += b; continue; }
    if (k.art === 'element' && !k.leer && !ROHTEXT.has(k.tag) && k.tag !== 'svg') {
      const rest = kuerze(k.kinder, { text: budget.text - text, bytes: budget.bytes - bytes });
      if (rest.knoten.some(x => x.art === 'element' || (x.art === 'text' && x.text.trim()))) aus.push({ ...k, kinder: rest.knoten });
    }
    return { knoten: aus, voll: true };
  }
  return { knoten: aus, voll: false };
}

/** HTML-Sonderzeichen für Text und Attributwerte maskieren */
export function maskiere(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
