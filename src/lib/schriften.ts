// Lädt die Schrift Inter nach dem ersten Bild als FontFace (Ersatz für @font-face mit Binärdatei).
// Bis die Schrift da ist, greift die System-Ersatzschrift (wie font-display: swap).
const base64ZuBytes = (b64: string): Uint8Array => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

/**
 * @param einsetzenNach erst danach einsetzen (vorgerenderte Modulseite: nach dem Austausch durch React). Sonst
 * zeichnet React seine neuen Knoten schon in Inter, etwas breiter als die Ersatzschrift der statischen Seite, und der
 * Browser meldet sie als neues, späteres LCP-Element (gemessen bis +3 s, docs/pruefung/lcp-module-2026-11-02.md).
 */
export async function ladeSchriften(einsetzenNach?: Promise<unknown>): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document) || typeof FontFace === 'undefined') return;
  try {
    const { INTER_REGULAR_WOFF2, INTER_BOLD_WOFF2 } = await import('./schriftDaten');
    const flaechen = [
      new FontFace('Inter', base64ZuBytes(INTER_REGULAR_WOFF2), { weight: '400 500', style: 'normal', display: 'swap' }),
      new FontFace('Inter', base64ZuBytes(INTER_BOLD_WOFF2), { weight: '600 700', style: 'normal', display: 'swap' }),
    ];
    const geladen = await Promise.all(flaechen.map(f => f.load()));
    if (einsetzenNach) await einsetzenNach.catch(() => {});
    for (const f of geladen) document.fonts.add(f);
  } catch {
    // Schrift ist Gestaltung, keine Funktion: bei Fehlern bleibt die Ersatzschrift.
  }
}
