// Adresse einer Modulseite für die Browser-Prüfskripte (Z52): /modul/<id>, Startseite /.
// Mit --hash-links die alte Form /#<id> (Vergleich mit Builds vor dem Pfad-Routing; neue Builds leiten sie um).
export const HASH_LINKS = process.argv.includes('--hash-links');

export function seitenUrl(basis, id, hash = HASH_LINKS) {
  if (hash) return id === 'start' ? new URL('/', basis).href : new URL(`/#${id}`, basis).href;
  return new URL(id === 'start' ? '/' : `/modul/${encodeURIComponent(id)}`, basis).href;
}
