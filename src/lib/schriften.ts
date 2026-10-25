// Lädt die Schrift Inter nach dem ersten Bild als FontFace (Ersatz für @font-face mit Binärdatei).
// Bis die Schrift da ist, greift die System-Ersatzschrift (wie font-display: swap).
const base64ZuBytes = (b64: string): Uint8Array => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

export async function ladeSchriften(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document) || typeof FontFace === 'undefined') return;
  try {
    const { INTER_REGULAR_WOFF2, INTER_BOLD_WOFF2 } = await import('./schriftDaten');
    const flaechen = [
      new FontFace('Inter', base64ZuBytes(INTER_REGULAR_WOFF2), { weight: '400 500', style: 'normal', display: 'swap' }),
      new FontFace('Inter', base64ZuBytes(INTER_BOLD_WOFF2), { weight: '600 700', style: 'normal', display: 'swap' }),
    ];
    for (const f of flaechen) document.fonts.add(await f.load());
  } catch {
    // Schrift ist Gestaltung, keine Funktion: bei Fehlern bleibt die Ersatzschrift.
  }
}
