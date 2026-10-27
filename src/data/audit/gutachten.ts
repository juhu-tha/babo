/**
 * Gutachten (unabhängiges Re-Review) vom 27.10.2026, Stand PR #191 – Noten je Kategorie und Top-10-Maßnahmen.
 * Status der Maßnahmen hier pflegen (per Pull Request); Anzeige: Admin → Audit → „Gutachten 27.10.“.
 */
import type { Gutachten } from './typen';

export const GUTACHTEN_27_10: Gutachten = {
  datum: '2026-10-27',
  grundlage: 'Unabhängiges Re-Review, Stand PR #191 (origin/main)',
  ziel: 'Zielbild „sehr gut“: Note 1,0–1,3 in allen sechs Kategorien',
  kategorien: [
    { kategorie: 'Technik', note: 1.3, begruendung: 'Alle Prüfungen grün (tsc, 112 Testdateien, 4 352 Formeln, Zahlformat, verwaist 0, any 0, Build mit 293 vorgerenderten Seiten, Bundle 102,5 kB). Abzug: CSP nur Report-Only, Doku-Drift, defekte/ungenutzte Schriftdateien.' },
    { kategorie: 'Rechner', note: 1.3, begruendung: '14 von 14 Stichproben stimmen mit unabhängiger Nachrechnung überein; Normbezug und Grenzen vorbildlich. Viele Werte noch „vorläufig, F-Freigabe“.' },
    { kategorie: 'Didaktik', note: 1.7, begruendung: 'Sehr gutes Gerüst (Lernziele, Selbsttest, Ausprobieren, Grenzen). Abzug: Mauerwerks-Quizfragen ohne ζ = 0,85 widersprechen dem Modul; nur 26 von 1 282 Fragen freigegeben; 191 von 192 Modulen „Fachliche Prüfung ausstehend“.' },
    { kategorie: 'Bedienung/Barrierefreiheit', note: 1.7, begruendung: 'axe: 0 Verstöße WCAG 2.1 in 30 Läufen; 3 target-size-Elemente (WCAG 2.2); Reiterleisten mit aria-pressed in Feuchteschutz, LCA, Holzbau-Bemessung; Fokusrahmen schwach; manuelle BITV-Prüfung und Nutzertest fehlen.' },
    { kategorie: 'Recht', note: 2.0, begruendung: 'Impressum, Datenschutz, Barrierefreiheitserklärung solide. Fehlen: Speicherdauer Server-Protokolle, Google als Auftragsverarbeiter (AVV), Lizenz inaktiv, THA-Freigabe offen, Restrisiko Normtabellen.' },
    { kategorie: 'Profil', note: 2.7, begruendung: 'Seite „Forschung und Transfer“ zeigt 4 Platzhalter; Projekte, Publikationen, ORCID, DOI fehlen.' },
  ],
  massnahmen: [
    { nr: 1, titel: 'Platzhalter „Forschung und Transfer“ ersetzen (Projekte, Publikationen, ORCID, Labor, TTZ-Rolle)', wirkung: 'Profil → 1,3', status: 'wartet', hinweis: 'Texte ersetzt (#192); offen: URL der Personenseite, ORCID, DOI nach OER-Veröffentlichung' },
    { nr: 2, titel: 'Fachliche Freigaben abarbeiten (src/data/pruefvermerke.ts) bzw. Hinweis neutral formulieren; F-Freigabe-Werte freigeben', wirkung: 'Didaktik, Rechner', status: 'wartet', hinweis: 'Liste der Werte: Reiter „Prüfpunkte F-Freigabe“' },
    { nr: 3, titel: 'Mauerwerksfragen korrigieren (ζ = 0,85) und Test „Rechenfragen gegen Rechenkerne“', wirkung: 'Didaktik', status: 'offen' },
    { nr: 4, titel: 'Datenschutzerklärung ergänzen (Speicherdauer, AVV Google, bezahlter Gemini-Tarif) – mit DSB abstimmen', wirkung: 'Recht', status: 'wartet', hinweis: 'Abstimmung mit der bzw. dem Datenschutzbeauftragten (Z11/Z39)' },
    { nr: 5, titel: 'Rolle der THA als Diensteanbieterin bestätigen, Lizenz aktivieren, OFL- und Drittlizenzliste', wirkung: 'Recht', status: 'wartet', hinweis: 'Anfrage an die THA vorbereitet (Z13/Z45)' },
    { nr: 6, titel: 'CSP scharf schalten (nach Auswertung des Report-Only-Betriebs)', wirkung: 'Technik', status: 'offen', hinweis: 'setzt den Betrieb auf Cloud Run voraus (Z50/Z56)' },
    { nr: 7, titel: 'Manuelle BITV-Stichprobe und Screenreader-Test; restliche Reiterleisten von aria-pressed umstellen', wirkung: 'Bedienung/Barrierefreiheit', status: 'offen' },
    { nr: 8, titel: 'Sichtbarer Fokusrahmen (:focus-visible), 3 target-size-Elemente vergrößern', wirkung: 'Bedienung/Barrierefreiheit', status: 'in_arbeit', hinweis: 'Favoritenstern in der Brotkrumenleiste auf 24 × 24 px (#192)' },
    { nr: 9, titel: 'index.html: JSON-LD bereinigen (&amp;, Domain einheitlich, Tippfehler), Doku angleichen', wirkung: 'Technik', status: 'offen' },
    { nr: 10, titel: 'Quiz-Qualität: Längenhinweis abbauen (37 % längste = richtige), normRef ergänzen, Freigabe planen', wirkung: 'Didaktik', status: 'offen' },
  ],
};

/** Mittelwert der Noten (ungewichtet) */
export function notenMittel(g: Gutachten = GUTACHTEN_27_10): number {
  return g.kategorien.reduce((s, k) => s + k.note, 0) / g.kategorien.length;
}
