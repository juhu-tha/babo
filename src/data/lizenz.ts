/**
 * Lizenz (Umsetzungsplan Phase 6, AP 6.8) – vorbereitet, NICHT aktiv.
 *
 * Geplant: Inhalte unter CC BY-SA 4.0, Quellcode unter MIT – erst nach Klärung der
 * Rechteinhaberschaft mit der THA (Art. 18 Satz 3 BayHIG: vermögensrechtliche Befugnisse nach dem
 * UrhG stehen ggf. der Hochschule zu). Ablauf: docs/lizenz-ablauf.md, Inventur: docs/lizenz-inventur.md.
 *
 * Solange LIZENZ_AKTIV = false, rendert LicenseNotice nichts und das Impressum zeigt den bisherigen
 * Urheberrechtshinweis. Umschalten ist der einzige Code-Schritt; Lizenzdateien liegen als Entwurf unter
 * docs/lizenz-entwurf/ und kommen erst nach der Freigabe ins Wurzelverzeichnis.
 *
 * Keine Rechtsberatung: Texte sind Entwürfe und vor dem Umschalten von der THA (Justiziariat) zu prüfen.
 */

/** Einziger Schalter für alle Lizenzhinweise. Erst nach schriftlicher Freigabe durch die THA auf true setzen. */
export const LIZENZ_AKTIV = false;

export const LIZENZ = {
  werk: 'BaustoffBoard',
  werkUrl: 'https://www.baustoffboard.de',
  urheber: 'Prof. Dr.-Ing. Jürgen Huber',
  einrichtung: 'Technische Hochschule Augsburg',
  inhalte: {
    kurz: 'CC BY-SA 4.0',
    name: 'Creative Commons Namensnennung – Weitergabe unter gleichen Bedingungen 4.0 International',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/deed.de',
    rechtstext: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode.de',
  },
  code: {
    kurz: 'MIT',
    name: 'MIT-Lizenz',
    url: 'https://opensource.org/license/mit',
  },
} as const;

/** Empfohlene Namensnennung (TULLU: Titel, Urheber, Lizenz, Link, Ursprungsort) zum Kopieren */
export const NAMENSNENNUNG =
  `„${LIZENZ.werk}“ von ${LIZENZ.urheber} (${LIZENZ.einrichtung}), ${LIZENZ.werkUrl}, ` +
  `lizenziert unter ${LIZENZ.inhalte.kurz} (${LIZENZ.inhalte.url})`;

/** Ausnahmen von der offenen Lizenz (Kurzform; vollständige Liste in docs/lizenz-inventur.md) */
export const LIZENZ_AUSNAHMEN =
  'Ausgenommen sind Inhalte Dritter: Auszüge, Tabellenwerte und Begriffe aus Normen und Regelwerken ' +
  '(DIN, EN, ISO, Eurocode, VDI, WTA u. a.; Urheberrecht der Normungsorganisationen bzw. Verlage), ' +
  'gekennzeichnete Zitate, Marken und Logos sowie die Schrift Inter (SIL Open Font License 1.1). ' +
  'Für sie gelten die Rechte der jeweiligen Inhaber.';

/** Urheberrechtsabsatz im Impressum, sobald LIZENZ_AKTIV = true (ersetzt „schriftliche Zustimmung“) */
export const IMPRESSUM_URHEBERRECHT_OFFEN =
  `Die Inhalte dieser Anwendung (Texte, Aufgaben, eigene Grafiken) stehen unter ${LIZENZ.inhalte.name} ` +
  `(${LIZENZ.inhalte.kurz}), der Quellcode unter der ${LIZENZ.code.name}. ${LIZENZ_AUSNAHMEN} ` +
  'DIN, EN, ISO, Eurocode und DIBt sind eingetragene Bezeichnungen bzw. Marken der jeweiligen Organisationen; ' +
  'ihre Nennung und der Verweis auf Formeln und Grenzwerte dienen der Erläuterung und dem Beleg (§ 51 UrhG).';
