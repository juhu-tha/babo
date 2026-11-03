import { Task } from '../aufgabenData';

export const rueckbauTasks: Task[] = [
  {
    id: 't_rueckbau_selektiv',
    difficulty: 'Mittel',
    title: 'Rückbau: Selektiver Rückbau und Getrennthaltung (GewAbfV § 8)',
    question: 'Warum fordert die moderne Kreislaufwirtschaft beim Gebäudeabbruch einen selektiven Rückbau (Begriffe und Verfahren nach DIN 18007:2022-09) anstelle des konventionellen Gesamtabbruchs mit der Abbruchbirne?',
    moduleHint: { id: 'rueckbau_info', name: 'Rückbau Grundlagen' },
    solution: 'Beim selektiven Rückbau wird das Gebäude in umgekehrter Reihenfolge seiner Errichtung (Rückbau von innen nach außen) demontiert:\n1. **Schadstoffsanierung vor Abbruch (Entfrachtung):** Asbest, KMF, PCB und teerhaltige Baustoffe werden im geschlossenen Zustand fachgerecht entfernt, um eine Kontamination des restlichen Bauschutts zu verhindern.\n2. **Sortenreine Trennung:** Ausbaumaterialien (Gipskarton, Dämmstoffe, Metalle, Holz) werden vor dem eigentlichen Massenabbruch separat ausgebaut.\n3. **Hochwertiges Baustoff-Recycling:** Nur schadstofffreier und sortenreiner Beton- und Mauerwerksabbruch eignet sich für hochwertige Verwertung: als güteüberwachter Ersatzbaustoff (z. B. Materialklasse RC-1 nach EBV) im Erd- und Straßenbau oder als rezyklierte Gesteinskörnung Typ 1/2 (DIN EN 12620 mit DIN 4226-101) für R-Beton. Die GewAbfV (§ 8) verlangt die Getrennthaltung von zehn Fraktionen, soweit technisch möglich und wirtschaftlich zumutbar. Vermischter oder belasteter Abbruch wird deutlich teurer verwertet oder muss deponiert werden.'
  },
  {
    id: 't_ebv_einbauklassen',
    difficulty: 'Schwer',
    title: 'Ersatzbaustoffverordnung (EBV): Einbauklassen für mineralische Ersatzbaustoffe',
    question: 'Welche Materialklassen unterscheidet die Ersatzbaustoffverordnung (EBV) für Recycling-Baustoffe aus Bauschutt (RC-Baustoffe) und unter welchen hydrogeologischen Bedingungen darf RC-1 bzw. RC-2 im Straßenbau eingebaut werden?',
    moduleHint: { id: 'boden_materialaufbereitung', name: 'Boden & Aufbereitung (EBV)' },
    solution: '1. **Einbauklassen der EBV:**\n   - **RC-1:** Höchste Materialgüte (strengste Eluatgrenzwerte für Schwermetalle, Sulfat und PAK).\n   - **RC-2:** Mittlere Materialgüte (erhöhte Schadstoffgehalte im Eluat).\n   - **RC-3:** Eingeschränkte Materialgüte (nur unter definierten technischen Sicherungsmaßnahmen).\n2. **Hydrogeologische Einbaubedingungen:**\n   - Maßgebend sind die Einbautabellen der Anlage 2 EBV und die Grundwasserdeckschicht (§ 19 Abs. 8): Die Sickerstrecke über dem höchsten zu erwartenden Grundwasserstand ist **günstig** bei mehr als $1\\text{ m}$, **ungünstig** bei $0{,}1$ bis $1\\text{ m}$ – jeweils zuzüglich $0{,}5\\text{ m}$ Sicherheitsabstand.\n   - **RC-1:** Breiteste Verwendbarkeit, auch in vielen offenen Bauweisen (ungebundene Trag- und Frostschutzschichten), abhängig von Deckschicht und Schutzgebiet.\n   - **RC-2:** Überwiegend nur in gebundenen oder unter wasserundurchlässiger Deckschicht (z. B. Asphalt) liegenden Einbauweisen.\n   - **Schutzgebiete (§ 19 Abs. 6):** In Zone I ist jeder Einbau verboten, in Zone II sind nur BM-0, BG-0, GS-0 und SKG zulässig – RC-Baustoffe also nicht; in Zone III A/III B nur die in Anlage 2 dafür ausgewiesenen Einbauweisen.\n   - **Anzeige (§ 22):** Für RC-3 ab $250\\text{ m}^3$ sowie bei Einbau in Schutzgebieten Voranzeige vier Wochen vor Beginn.'
  },
  {
    id: 't_schadstoffe_asbest_trgs519',
    difficulty: 'Schwer',
    title: 'Schadstoffe: Asbestsanierung nach TRGS 519 (Fest vs. Schwach gebunden)',
    question: 'Unterscheiden Sie schwach gebundenen Spritzasbest und fest gebundenen Asbestzement (Eternit) hinsichtlich ihrer Gefährdung für Atemwege und nennen Sie die geforderten Arbeitsschutzmaßnahmen nach TRGS 519 bei Sanierungsarbeiten an schwach gebundenem Asbest.',
    moduleHint: { id: 'schadstoffe', name: 'Schadstoffe: Asbest & KMF' },
    solution: '1. **Unterschied:**\n   - **Schwach gebundener Asbest (z.B. Spritzasbest, Brandschutzklappen, Dichtschnüre):** Asbestgehalt oft $> 60\\%$, Dichte $< 1000\\text{ kg/m}^3$. Fasern lösen sich bereits durch leichte Erschütterung oder Luftzug massenhaft in die Atemluft ab (extrem kanzerogen / Asbestose, Mesotheliom).\n   - **Fest gebundener Asbestzement (z.B. Wellplatten, Fassadentafeln, Rohre):** Asbestfasern sind fest in eine Zementmatrix eingebunden (ca. 10–15 % Faseranteil, Dichte $> 1400\\text{ kg/m}^3$). Faserfreisetzung tritt primär bei mechanischer Bearbeitung (Sägen, Brechen, Schleifen, Hochdruckreinigen) auf.\n2. **Schutzmaßnahmen bei schwach gebundenem Asbest (TRGS 519 Nr. 14):**\n   - Vollständige Abschottung des Arbeitsbereichs gegenüber der Umwelt (Unterdruckhaltung mit HEPA-Filterung / H14-Entstauber).\n   - Schleusensystem (Mehrkammer-Personenschleuse mit Dusche für die Schwarz-Weiß-Trennung, Ausführung nach TRGS 519).\n   - PSA: Gebläseunterstützter Atemschutz (Vollmaske mit Partikelfilter P3), partikeldichter Einweg-Schutzanzug (Kategorie III, Typ 5).\n   - Sachkunde der verantwortlichen und der aufsichtführenden Person nach TRGS 519, Anzeige bei der zuständigen Behörde mindestens eine Woche vor Beginn (§ 11a GefStoffV); Tätigkeiten mit hohem Risiko nur mit behördlicher Zulassung des Unternehmens.'
  },
  {
    id: 't_kmf_kanzerogenitaet',
    difficulty: 'Mittel',
    title: 'Schadstoffe: Künstliche Mineralfasern (KMF) & TRGS 521',
    question: 'Wann gilt eine Mineralwolle bei der Sanierung eines Bestandsdachs als "Alte Mineralwolle" nach TRGS 521 und wie wird der Kanzerogenitätsindex (KI) berechnet?',
    moduleHint: { id: 'schadstoffe', name: 'Schadstoffe: Asbest & KMF' },
    solution: '1. **Alte vs. Neue Mineralwolle:**\n   Seit dem **1. Juni 2000** dürfen nur noch biolösliche Mineralwollen verwendet werden (die Hersteller stellten ab etwa 1996 um). Ohne Nachweis ist vorher eingebaute Mineralwolle als **alte Mineralwolle** zu behandeln, da ihre lungengängigen Fasern biobeständig sein können (TRGS 521).\n2. **Kanzerogenitätsindex ($KI$ nach Gefahrstoffverordnung):**\n   $$KI = \\Sigma(\\text{Na}_2\\text{O}, \\text{K}_2\\text{O}, \\text{B}_2\\text{O}_3, \\text{CaO}, \\text{MgO}, \\text{BaO}) - 2 \\cdot \\text{Al}_2\\text{O}_3$$\n   - $KI \\le 30$: Als krebserzeugend eingestuft (Kategorie 1B) -> Schutzstufe 2 oder 3 nach TRGS 521.\n   - $30 < KI < 40$: Krebsverdacht (Kategorie 2).\n   - $KI \\ge 40$: Keine Einstufung als krebserzeugend (biolöslich) -> "neue Mineralwolle", erkennbar z. B. am RAL-Gütezeichen (RAL-GZ 388).'
  },
  {
    id: 't_avv_abfallschluessel',
    difficulty: 'Leicht',
    title: 'Abfallrecht: Abfallverzeichnis-Verordnung (AVV) & Gefährliche Abfälle',
    question: 'Was bedeutet der Stern (*) hinter einer sechsstelligen Abfallschlüsselnummer (AVV-Schlüssel) und welche Konsequenzen hat dies für das Entsorgungsnachweisverfahren?',
    moduleHint: { id: 'abfaelle', name: 'Abfallrecht & AVV' },
    solution: 'Ein Sternchen hinter dem AVV-Schlüssel (z.B. **17 01 06\\***: Gemische aus Beton, Ziegeln und Fliesen, die gefährliche Stoffe enthalten) kennzeichnet den Abfall als **gefährlichen Abfall** (§ 3 AVV, § 3 Abs. 5 KrWG).\n**Konsequenzen:**\n- Zwingende Führung von **Entsorgungsnachweisen** und Begleitscheinen im elektronischen Abfallnachweisverfahren (eANV).\n- Registerpflicht mit Aufbewahrung von drei Jahren (NachwV); in einigen Ländern zusätzlich Andienungspflichten (z. B. Bayern).\n- Kleinmengen bis 2 t/a sind vom Entsorgungsnachweis befreit (§ 2 Abs. 2 NachwV).\n- Beförderung gefährlicher Abfälle nur mit Erlaubnis nach § 54 KrWG (Entsorgungsfachbetriebe sind davon befreit).'
  }
];
