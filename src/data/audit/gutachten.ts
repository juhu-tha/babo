/**
 * Gutachten (unabhängiges Re-Review) vom 27.10.2026, Stand PR #191 – Noten je Kategorie und Top-10-Maßnahmen.
 * Status der Maßnahmen hier pflegen (per Pull Request); Anzeige: Admin → Audit → „Gutachten 27.10.“.
 * Das zweite Gutachten vom 27.10. abends (Stand #207) ist nicht als eigener Datensatz erfasst – die Anzeige kennt
 * nur ein Gutachten. Seine Noten stehen in `grundlage`, seine Maßnahmen in den Hinweisen („27.10. abends“).
 */
import type { Gutachten } from './typen';

export const GUTACHTEN_27_10: Gutachten = {
  datum: '2026-10-27',
  grundlage: 'Unabhängiges Re-Review, Stand PR #191 (origin/main); zweites Gutachten 27.10. abends (Stand #207): Technik 1,8, Rechner 1,6, Didaktik 2,4, Bedienung 1,9, Recht 2,6, Profil 2,3',
  ziel: 'Zielbild „sehr gut“: Note 1,0–1,3 in allen sechs Kategorien',
  kategorien: [
    { kategorie: 'Technik', note: 1.3, begruendung: 'Alle Prüfungen grün (tsc, 112 Testdateien, 4352 Formeln, Zahlformat, verwaist 0, any 0, Build mit 293 vorgerenderten Seiten, Bundle 102,5 kB). Abzug: CSP nur Report-Only, Doku-Drift, defekte/ungenutzte Schriftdateien.' },
    { kategorie: 'Rechner', note: 1.3, begruendung: '14 von 14 Stichproben stimmen mit unabhängiger Nachrechnung überein; Normbezug und Grenzen vorbildlich. Viele Werte noch „vorläufig, F-Freigabe“.' },
    { kategorie: 'Didaktik', note: 1.7, begruendung: 'Sehr gutes Gerüst (Lernziele, Selbsttest, Ausprobieren, Grenzen). Abzug: Mauerwerks-Quizfragen ohne ζ = 0,85 widersprechen dem Modul; nur 26 von 1282 Fragen freigegeben; 191 von 192 Modulen „Fachliche Prüfung ausstehend“.' },
    { kategorie: 'Bedienung/Barrierefreiheit', note: 1.7, begruendung: 'axe: 0 Verstöße WCAG 2.1 in 30 Läufen; 3 target-size-Elemente (WCAG 2.2); Reiterleisten mit aria-pressed in Feuchteschutz, LCA, Holzbau-Bemessung; Fokusrahmen schwach; manuelle BITV-Prüfung und Nutzertest fehlen.' },
    { kategorie: 'Recht', note: 2.0, begruendung: 'Impressum, Datenschutz, Barrierefreiheitserklärung solide. Fehlen: Speicherdauer Server-Protokolle, Google als Auftragsverarbeiter (AVV), Lizenz inaktiv, THA-Freigabe offen, Restrisiko Normtabellen.' },
    { kategorie: 'Profil', note: 2.7, begruendung: 'Seite „Forschung und Transfer“ zeigt 4 Platzhalter; Projekte, Publikationen, ORCID, DOI fehlen.' },
  ],
  massnahmen: [
    { nr: 1, titel: 'Platzhalter „Forschung und Transfer“ ersetzen (Projekte, Publikationen, ORCID, Labor, TTZ-Rolle)', wirkung: 'Profil → 1,3', status: 'wartet', hinweis: 'Texte ersetzt (#192); offen: URL der Personenseite, ORCID, DOI nach OER-Veröffentlichung. 27.10. abends: Profil 2,3; der Abzug „Prüfung ausstehend sichtbar“ beruht auf einem Irrtum – der Vermerk „offen“ ist öffentlich ausgeblendet (vermerkOeffentlich in src/components/ui/PruefVermerk.tsx, #193). 28.10.: Personenseite öffentlich gesucht – nur eine veraltete englische Adresse (404 nach Relaunch von tha.de), nicht eingetragen. Entscheidung 28.10. (nachts): Fakultätsseite statt Personenseite verlinkt (#248); offen: ORCID, DOI nach OER-Veröffentlichung' },
    { nr: 2, titel: 'Fachliche Freigaben abarbeiten (src/data/pruefvermerke.ts) bzw. Hinweis neutral formulieren; F-Freigabe-Werte freigeben', wirkung: 'Didaktik, Rechner', status: 'wartet', hinweis: 'teilweise: Hinweis „Fachliche Prüfung ausstehend“ ausgeblendet (#193); Quiz: 377 von 1282 Fragen freigegeben (#202), 28.10.: Sammelfreigabe Runde 2/3 → 1230 von 1290 (95,3 %); Modul-Freigaben: 6 von 193 Fachmodulen fachlich geprüft (28.10., Tranche 2/3); weitere Modul-Freigaben und F-Freigabe-Werte stehen aus (Reiter „Prüfpunkte F-Freigabe“). 27.10. abends: Modulprüfung in Tranchen (rund 20 Module je Woche), zuerst die 34 Quiz-Module ohne freigegebene Frage; Etikett „noch nicht fachlich freigegeben“ im Selbsttest umgesetzt (#209); Tranchen-Vorgehen als Zulieferung zur Bestätigung. Rechner-Prüfpunkte des Gutachtens (Modul D, t_T, z = 0,9·d, de Vree) umgesetzt bzw. vorläufig gekennzeichnet (#212, #213)' },
    { nr: 3, titel: 'Mauerwerksfragen korrigieren (ζ = 0,85) und Test „Rechenfragen gegen Rechenkerne“', wirkung: 'Didaktik', status: 'erledigt', hinweis: '#193' },
    { nr: 4, titel: 'Datenschutzerklärung ergänzen (Speicherdauer, AVV Google, bezahlter Gemini-Tarif) – mit DSB abstimmen', wirkung: 'Recht', status: 'wartet', hinweis: 'wartet auf DSB; Vorschlag in docs/entwuerfe/datenschutz-ergaenzungen.md' },
    { nr: 5, titel: 'Rolle der THA als Diensteanbieterin bestätigen, Lizenz aktivieren, OFL- und Drittlizenzliste', wirkung: 'Recht', status: 'wartet', hinweis: 'Anfrage an die THA vorbereitet (Z13/Z45), wird vom Professor gemeinsam versandt (Entscheidung 28.10.2026); 27.10. abends: Recht 2,6 – Rolle der THA offen; Drittlizenzliste im Impressum (#209), KI-Hinweis im Impressum (#212)' },
    { nr: 6, titel: 'CSP scharf schalten (nach Auswertung des Report-Only-Betriebs)', wirkung: 'Technik', status: 'wartet', hinweis: 'Entscheidung 27.10.: zwei Wochen nach dem Cloud-Run-Umzug – wartet auf Z50 (27.10. abends: erst THA-IT fragen). 27.10. abends zusätzlich: Build-Speicher entschärft (Vorrendern nach vite build, Spitze 4,7 → 3,1 GB), check-bundle prüft den vollständigen Build (#209)' },
    { nr: 7, titel: 'Manuelle BITV-Stichprobe und Screenreader-Test; restliche Reiterleisten von aria-pressed umstellen', wirkung: 'Bedienung/Barrierefreiheit', status: 'wartet', hinweis: 'Umstellung erledigt (#193 Hauptreiter, #205 Kontraste, #210: 204 Umschaltergruppen → 51 Reiterleisten mit tabpanel, 152 Optionsgruppen, 1 Akkordeon; Strukturprüfung scripts/qa/a11y-struktur.mjs); wartet auf manuelle BITV-Stichprobe und Screenreader-Test (Zulieferung). 28.10. (abends): Teil der Bachelorarbeit Z10/Z17 (12 ECTS) – 8 Seiten, 12 Prüfschritte nach EN 301 549/WCAG 2.1 AA, NVDA/Firefox und VoiceOver/Safari (docs/entwuerfe/ausschreibung-pruefung.md, Teil D); Ausschreibung fertig (#248), wartet auf Bearbeitung' },
    { nr: 8, titel: 'Sichtbarer Fokusrahmen (:focus-visible), 3 target-size-Elemente vergrößern', wirkung: 'Bedienung/Barrierefreiheit', status: 'erledigt', hinweis: '#192 (Favoritenstern), #193' },
    { nr: 9, titel: 'index.html: JSON-LD bereinigen (&amp;, Domain einheitlich, Tippfehler), Doku angleichen', wirkung: 'Technik', status: 'erledigt', hinweis: '#193' },
    { nr: 10, titel: 'Quiz-Qualität: Längenhinweis abbauen (37 % längste = richtige), normRef ergänzen, Freigabe planen', wirkung: 'Didaktik', status: 'erledigt', hinweis: '#194: Distraktoren angeglichen (27,3 % statt 37 %), normRef ergänzt; Freigabe siehe Maßnahme 2' },
  ],
};

/** Mittelwert der Noten (ungewichtet) */
export function notenMittel(g: Gutachten = GUTACHTEN_27_10): number {
  return g.kategorien.reduce((s, k) => s + k.note, 0) / g.kategorien.length;
}
