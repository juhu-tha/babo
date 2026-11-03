/**
 * Rückmeldeweg im statischen Betrieb (Entscheidung 03.11.2026): Ohne Server (src/data/betriebsart.ts) entfallen
 * Kurzfragebogen und Live-Abstimmung; an ihrer Stelle steht ein E-Mail-Link (mailto) mit vorbelegtem Betreff.
 *
 * Adresse: die dienstliche Kontakt-Adresse, die die App bereits in Impressum, Barrierefreiheit und Feedback nennt.
 * Leer = Link ausgeblendet (Schalter, falls die Adresse wechselt oder der Weg ruhen soll).
 * Mit Server (npm start) bleibt alles wie bisher – dort erscheint der Link nicht.
 */
export const RUECKMELDUNG_EMAIL = 'juergen.huber@tha.de';

/** Betreffzeile der Rückmeldung, z. B. „BaustoffBoard – Rückmeldung zu Betontechnologie“ */
export function rueckmeldungBetreff(modultitel: string): string {
  return `BaustoffBoard – Rückmeldung zu ${modultitel.replace(/\s+/g, ' ').trim()}`;
}

/** mailto-Adresse mit URL-kodiertem Betreff; null, wenn keine Adresse hinterlegt ist */
export function rueckmeldungMailto(modultitel: string, adresse: string = RUECKMELDUNG_EMAIL): string | null {
  const ziel = adresse.trim();
  if (!ziel) return null;
  return `mailto:${ziel}?subject=${encodeURIComponent(rueckmeldungBetreff(modultitel))}`;
}
