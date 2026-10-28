/**
 * Umsetzungsplan Phasen 0–6 (Teil C des Audit-Stands, 27.10.2026) – Status je Arbeitspaket.
 * Der Umsetzungsplan selbst liegt nicht im Repository (docs/zwischenreview-2026-10-26.md). Erfasst sind die
 * Arbeitspakete, die im Audit-Stand genannt sind oder im Code mit „AP x.y“ belegt sind; die Titel stammen aus den
 * Code-Kommentaren der jeweiligen Umsetzung. Status hier pflegen (per Pull Request).
 * Anzeige: Admin → Audit → „Umsetzungsplan“ (Fortschritt je Phase = Anteil „erledigt“).
 */
import type { AuditStatus, Phase } from './typen';

export const UMSETZUNGSPLAN_STAND = '2026-10-28';
/** zusammengeführte Pull Requests bis zum Stand (laut Audit-Stand) */
export const PRS_GEMERGT = 'bis #214 (#189 und #190 über den Merge von #191)';

export const UMSETZUNGSPLAN: readonly Phase[] = [
  { nr: 0, titel: 'Grundlagen und Baseline', aps: [
    { ap: '0.1', titel: 'Prüf-Workflow qa.yml wieder aktiv (lokale Prüfung, solange Actions gesperrt)', status: 'erledigt' },
    { ap: '0.4', titel: 'Zentrale Modul-Registry', status: 'erledigt' },
    { ap: '0.5', titel: 'Normenstand-Prüfung', status: 'erledigt' },
    { ap: '0.6', titel: 'Zentrale Beton- und Materialkennwerte', status: 'erledigt' },
    { ap: '0.7', titel: 'Metrik-Baseline (docs/metriken.json)', status: 'erledigt' },
  ] },
  { nr: 1, titel: 'Recht und Sicherheit', aps: [
    { ap: '1.3', titel: 'Register aller Speicherorte und Cookies (Datenschutzerklärung)', status: 'erledigt' },
    { ap: '1.4', titel: 'Barrierefreiheitserklärung', status: 'erledigt' },
    { ap: '1.9', titel: 'Formeltexte: HTML wird maskiert', status: 'erledigt' },
    { ap: '1.10', titel: 'Haftungshinweis für alle Rechner-Module', status: 'erledigt' },
  ] },
  { nr: 2, titel: 'Bedienung und Barrierefreiheit', aps: [
    { ap: '2.1', titel: 'Barrierefreiheits-Prüfung über alle Modulrouten (axe)', status: 'erledigt', hinweis: 'manuelle BITV-Stichprobe offen (Gutachten Maßnahme 7); Teil der Bachelorarbeit Z10/Z17' },
    { ap: '2.2', titel: 'Genau eine Hauptüberschrift je Seite', status: 'erledigt' },
    { ap: '2.3', titel: 'Tastatur- und Screenreader-Reihenfolge (Seitenleiste inert)', status: 'erledigt' },
    { ap: '2.4', titel: 'Dunkelmodus und Kontrast-Mindestwerte', status: 'erledigt' },
    { ap: '2.5', titel: 'Mobil: Werkzeugmenü, aktuelles Modul in der Kopfzeile', status: 'erledigt' },
    { ap: '2.6', titel: 'Mobil-Layout-Prüfung', status: 'erledigt' },
    { ap: '2.7', titel: 'Mindestgröße Bedienelemente 24 × 24 px (WCAG 2.2)', status: 'erledigt', hinweis: 'restliche target-size-Elemente mit #192/#193' },
    { ap: '2.8', titel: 'Reiter vereinheitlichen (ModuleTabs)', status: 'erledigt', hinweis: 'Reiterleisten umgestellt (#193); Ansichtsumschalter auf Reiterleisten/Optionsgruppen umgestellt (#210)' },
    { ap: '2.9', titel: 'Volltextsuche über den Inhalt aller Module', status: 'erledigt' },
    { ap: '2.10', titel: 'Einstieg in die Themen je Cluster', status: 'erledigt' },
    { ap: '2.11', titel: 'Lesbarkeit', status: 'erledigt' },
  ] },
  { nr: 3, titel: 'Didaktik und Quiz', aps: [
    { ap: '3.1', titel: 'Quizpool: Zuordnung zu Modulen und Clustern', status: 'erledigt' },
    { ap: '3.2', titel: 'Schema-Erweiterung (Bloom-Stufe, Niveau)', status: 'erledigt' },
    { ap: '3.3', titel: 'Qualität der Antwortoptionen', status: 'erledigt', hinweis: 'Distraktoren angeglichen, normRef ergänzt (#194: 27,3 % statt 37 %)' },
    { ap: '3.4', titel: 'Selbsttest-Abdeckung der Fachmodule', status: 'erledigt' },
    { ap: '3.5', titel: 'Fachliche Freigabe der Quizfragen je Cluster', status: 'in_arbeit', hinweis: 'Sammelfreigabe 28.10.: 1234 von 1290 Fragen freigegeben (95,7 %); 56 Einzelfreigaben offen (Z19/Z23)' },
    { ap: '3.6', titel: 'Lernziele je Fachmodul', status: 'erledigt', hinweis: 'fachliche Durchsicht Z26' },
    { ap: '3.7', titel: 'Erkundungsauftrag „Ausprobieren“ für Rechner', status: 'erledigt' },
    { ap: '3.8', titel: 'Zweistufige Reiter (höchstens 7 je Leiste)', status: 'erledigt' },
    { ap: '3.9', titel: 'Expositionsklassen aus einer Quelle', status: 'erledigt' },
    { ap: '3.10', titel: 'Begriffs-Styleguide', status: 'erledigt' },
    { ap: '3.13', titel: 'Neue Fachmodule (u. a. Kesselformel, Zinküberzüge/Duplex)', status: 'erledigt' },
  ] },
  { nr: 4, titel: 'Rechner', aps: [
    { ap: '4.1', titel: 'Reine Rechenkerne in src/calc (Muster und Tests)', status: 'erledigt', hinweis: 'Titel nicht im Code belegt' },
    { ap: '4.2', titel: 'Rechenkerne der Fachrechner (u. a. Bauglas, Schwinden/Kriechen)', status: 'erledigt' },
    { ap: '4.3', titel: 'Rechenkerne gegen Literatur prüfen', status: 'wartet', hinweis: 'Literaturauszüge (Z1–Z4, Fehlliste); öffentliche Belege für Mauerwerk, Querkraft, Sieblinien, Lebensdauer ergänzt (#213, #214)' },
    { ap: '4.4', titel: 'Normtext-Prüfpunkte (NA DE)', status: 'wartet', hinweis: 'Normtextauszüge (Z1–Z4, docs/normwerte-belege.md)' },
    { ap: '4.5', titel: 'Absicherung gegen unsinnige Eingaben', status: 'erledigt' },
    { ap: '4.6', titel: 'Rechenkern Schwingung Brettsperrholzdecke', status: 'erledigt' },
    { ap: '4.7', titel: 'Mauerwerk nach Eurocode 6', status: 'erledigt' },
    { ap: '4.8', titel: 'Gemeinsame Plausibilitätsschicht und Fuzz-Tests', status: 'erledigt' },
    { ap: '4.9', titel: 'Glaser-Verfahren als einziger Rechenkern (src/calc/glaser.ts)', status: 'erledigt' },
    { ap: '4.10', titel: 'Rechenkern Gebäude-Ökobilanz', status: 'erledigt' },
    { ap: '4.11', titel: 'Annahmen und Grenzen der Rechner', status: 'erledigt' },
    { ap: '4.12', titel: 'Gegenrechnung von 10 Rechnern', status: 'wartet', hinweis: 'Bachelorarbeit, 12 ECTS, ohne Vergütung (Z10/Z17, Entscheidung 28.10.)' },
  ] },
  { nr: 5, titel: 'Technik und Leistung', aps: [
    { ap: '5.1', titel: 'Typsicherheit: explizite any auf 0', status: 'erledigt' },
    { ap: '5.2', titel: 'Routing und Module aus App.tsx ausgelagert', status: 'erledigt' },
    { ap: '5.3', titel: 'Fachtexte in content/ (JSON)', status: 'erledigt' },
    { ap: '5.4', titel: 'Bundle-Aufteilung und Budget', status: 'erledigt' },
    { ap: '5.5', titel: 'Ladezeit: Vorladen, Modulkopf, Registry-Auszug', status: 'erledigt' },
    { ap: '5.6', titel: 'E2E-Smoke je Meta-Cluster, Komponententests', status: 'erledigt' },
    { ap: '5.7', titel: 'Verwaiste Dateien', status: 'erledigt' },
    { ap: '5.8', titel: 'Technik (Titel nicht im Code belegt)', status: 'erledigt' },
  ] },
  { nr: 6, titel: 'Lehre, Transfer und Betrieb', aps: [
    { ap: '6.1', titel: 'Lernpfade der Lehrveranstaltungen', status: 'in_arbeit', hinweis: 'Entscheidung 27.10.: inaktiv geschaltet (#197); Code und Entwürfe bleiben' },
    { ap: '6.2', titel: 'Neue Forschungsthemen (u. a. Biokohlebeton, PFAS, Altholz)', status: 'wartet' },
    { ap: '6.3', titel: 'TTZ-Weiterbildungspfad und Kursquiz', status: 'wartet', hinweis: 'TTZ-Kursliste (Z44)' },
    { ap: '6.4', titel: 'Versuchs-Handouts', status: 'wartet', hinweis: 'Laborpilot WS 26/27 (Z37/Z42)' },
    { ap: '6.5', titel: 'KI-Master: Grundlagen und Hands-on-Übungen', status: 'wartet', hinweis: 'Übungen mit neutralem „KI-Assistent der Hochschule“ (#212)' },
    { ap: '6.6', titel: 'Admin-Ansicht „Meine Module“, Paten je Cluster', status: 'wartet', hinweis: 'Prüfvermerke (Z38): 6 von 193 Fachmodulen fachlich geprüft (28.10.2026, Vermerk passiv ohne Namen)' },
    { ap: '6.7', titel: 'Halbjährlicher Normen- und Rechtsstand-Check', status: 'erledigt' },
    { ap: '6.8', titel: 'Offene Lizenz', status: 'wartet', hinweis: 'THA-Klärung (Z13/Z45)' },
    { ap: '6.9', titel: 'Anonymer Kurzfragebogen', status: 'wartet', hinweis: 'DSB-Freigabe (Z11/Z39)' },
    { ap: '6.10', titel: 'Seite „Forschung und Transfer“', status: 'erledigt', hinweis: 'Texte ersetzt (#192); URL der Personenseite offen (28.10.: öffentlich keine gültige Adresse gefunden)' },
  ] },
];

/** Zählung je Status für eine Phase */
export function phasenStand(p: Phase): { gesamt: number; erledigt: number; wartet: number; offen: number; anteil: number } {
  const n = (s: AuditStatus) => p.aps.filter(a => a.status === s).length;
  const erledigt = n('erledigt');
  const wartet = n('wartet');
  return { gesamt: p.aps.length, erledigt, wartet, offen: p.aps.length - erledigt - wartet, anteil: p.aps.length ? erledigt / p.aps.length : 0 };
}
