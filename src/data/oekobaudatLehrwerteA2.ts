// Lehrwerte der Wirkungsindikatoren Versauerung und Eutrophierung nach DIN EN 15804+A2 (Modul A1–A3)
// für die simulierte ÖKOBAUDAT-Konsole im Modul Materialdatenbanken (Umsetzung T14-MDB-5, 29.10.2026).
// Lehrwerte, vorläufig: Größenordnungen aus öffentlichen EPD nach EN 15804+A2, über das GWP-Verhältnis
// (GWP des Konsolendatensatzes / GWP der Quell-EPD) auf den Datensatz skaliert und auf zwei geltende Ziffern
// gerundet (Holz ohne Skalierung, da das GWP dort vom biogenen Kohlenstoff bestimmt wird).
// Keine Planungswerte – für Nachweise die aktuellen Datensätze der ÖKOBAUDAT bzw. die Produkt-EPD verwenden.

export interface LehrwertA2 {
  /** Versauerung, kumulierte Überschreitung: mol H⁺-Äq. je Bezugseinheit */
  ap: number;
  /** Eutrophierung Süßwasser: kg P-Äq. je Bezugseinheit */
  epSuesswasser: number;
  /** Eutrophierung Meerwasser: kg N-Äq. je Bezugseinheit */
  epMeer: number;
  /** Eutrophierung terrestrisch, kumulierte Überschreitung: mol N-Äq. je Bezugseinheit */
  epLand: number;
  /** Quell-EPD (öffentlich), aus der die Größenordnung stammt */
  quelle: string;
  /** Skalierungsfaktor GWP Datensatz / GWP Quell-EPD (1 = unskaliert) */
  faktor: number;
}

/** Schlüssel = Datensatz-ID der Konsole (o-1 … o-7) */
export const LEHRWERTE_A2: Record<string, LehrwertA2> = {
  // Normalbeton C25/30, 1 m³: Quelle Transportbeton C30/37 (GWP 191) · 245/191
  'o-1': { ap: 0.28, epSuesswasser: 0.024, epMeer: 0.09, epLand: 1.1, faktor: 1.28,
    quelle: 'https://www.schwenk.de/wp-content/uploads/2017/03/3038_3130_NEPD-10791-10791-2_N44463200511_C30-37-F4-mittel-Dmax16-XC4-XF1-XA1-GWP-Beton-WU-Rili.pdf' },
  // Brettschichtholz, 1 m³: Quelle Konstruktionsvollholz (EN 15804+A2), unskaliert
  'o-2': { ap: 0.47, epSuesswasser: 0.092, epMeer: 0.19, epLand: 2.2, faktor: 1,
    quelle: 'https://www.rettenmeier.com/fileadmin/PDF/produktinformationen/2026-EPD-konstruktionsvollholz-KVH-de-en-it.pdf' },
  // Betonstahl B500B, 1 t: Quelle Betonstahl Elektrostahlroute (GWP 599 je t) · 1120/599; EP-Süßwasser von kg PO₄-Äq. in kg P-Äq. umgerechnet (· 30,97/94,97)
  'o-3': { ap: 3.2, epSuesswasser: 0.015, epMeer: 0.77, epLand: 8.8, faktor: 1.87,
    quelle: 'https://www.feralpigroup.com/sites/default/files/ESF%20certificati/2023/EPD-ESF%20Elbe-Stahlwerke%20Feralpi-310-DE.pdf' },
  // Steinwolle-Dämmplatte, 1 m³: Quelle Steinwolle mittlere Rohdichte (99 kg/m³, GWP 115) · 45,5/115
  'o-4': { ap: 0.32, epSuesswasser: 0.00023, epMeer: 0.034, epLand: 0.93, faktor: 0.396,
    quelle: 'https://www.heinze.de/epd/pdf/rockwool-steinwolle-daemmstoffe-im-mittleren-rohdichtebereich/732dcc2d-1131-4a75-a669-e871675b5ba4/' },
  // Portlandzement CEM I, 1 t: Quelle VDZ-Verbands-EPD CEM I (GWP 665) · 680/665
  'o-5': { ap: 0.96, epSuesswasser: 0.00072, epMeer: 0.25, epLand: 3.1, faktor: 1.02,
    quelle: 'https://www.beton.org/fileadmin/beton-org/media/Dokumente/PDF/Wissen/Beton-Bautechnik/Nachhaltigkeit/2022-06-08-EPD-CEM_I-D.pdf' },
  // Porenbeton-Planstein, 1 m³: Quelle Porenbeton 486 kg/m³ (GWP 176) · 110/176
  'o-6': { ap: 0.12, epSuesswasser: 0.00003, epMeer: 0.042, epLand: 0.46, faktor: 0.625,
    quelle: 'https://www.heinze.de/epd/pdf/ytong-porenbeton-35050-ro/f6ec0adc-f1d2-453b-b834-f34bac094842' },
  // Gipskartonplatte GKB 12,5 mm, 1 m²: Quelle Hartgipsplatte 12,5 mm (GWP 2,72) · 1,85/2,72
  'o-7': { ap: 0.0031, epSuesswasser: 0.0000088, epMeer: 0.00097, epLand: 0.01, faktor: 0.68,
    quelle: 'https://www.heinze.de/epd/hartgipsplatte-tool/29248c83-68d5-4ff6-ae8d-cf91e54dd000/' },
};
