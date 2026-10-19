import { Task } from '../aufgabenData';

export const rueckbauTasks: Task[] = [
  {
    id: 't_rueckbau_selektiv',
    difficulty: 'Mittel',
    title: 'Rückbau: Selektiver Rückbau nach DIN 18007',
    question: 'Warum fordert die moderne Kreislaufwirtschaft beim Gebäudeabbruch einen selektiven Rückbau nach DIN 18007 anstelle des konventionellen Gesamtabbruchs mit der Abbruchbirne?',
    moduleHint: { id: 'rueckbau_info', name: 'Rückbau Grundlagen' },
    solution: 'Beim selektiven Rückbau wird das Gebäude in umgekehrter Reihenfolge seiner Errichtung (Rückbau von innen nach außen) demontiert:\n1. **Schadstoffsanierung vor Abbruch (Entfrachtung):** Asbest, KMF, PCB und teerhaltige Baustoffe werden im geschlossenen Zustand fachgerecht entfernt, um eine Kontamination des restlichen Bauschutts zu verhindern.\n2. **Sortenreine Trennung:** Ausbaumaterialien (Gipskarton, Dämmstoffe, Metalle, Holz) werden vor dem eigentlichen Massenabbruch separat ausgebaut.\n3. **Hochwertiges Baustoff-Recycling:** Nur schadstofffreier und sortenreiner Beton- und Mauerwerksabbruch kann nach der Ersatzbaustoffverordnung (EBV) zu hochwertigen güteüberwachten Recycling-Gesteinskörnungen (RC-1) für R-Beton aufbereitet werden. Eine Vermischung führt unweigerlich zur kostenintensiven Deponierung.'
  },
  {
    id: 't_ebv_einbauklassen',
    difficulty: 'Schwer',
    title: 'Ersatzbaustoffverordnung (EBV): Einbauklassen für mineralische Ersatzbaustoffe',
    question: 'Welche Einbauklassen (MEB-Klassen) unterscheidet die Ersatzbaustoffverordnung (EBV) für Recycling-Baustoffe aus Bauschutt (RC-Baustoffe) und unter welchen hydrogeologischen Bedingungen darf RC-1 bzw. RC-2 im Straßenbau eingebaut werden?',
    moduleHint: { id: 'boden_materialaufbereitung', name: 'Boden & Aufbereitung (EBV)' },
    solution: '1. **Einbauklassen der EBV:**\n   - **RC-1:** Höchste Materialgüte (strengste Eluatgrenzwerte für Schwermetalle, Sulfat und PAK).\n   - **RC-2:** Mittlere Materialgüte (erhöhte Schadstoffgehalte im Eluat).\n   - **RC-3:** Eingeschränkte Materialgüte (nur unter definierten technischen Sicherungsmaßnahmen).\n2. **Hydrogeologische Einbaubedingungen:**\n   - **RC-1:** Darf in ungebundenen Tragschichten und im Erdbau offen eingebaut werden, sofern ein Mindestabstand zum höchsten Grundwasserstand (HGW) von mindestens $0{,}5\\text{ m}$ (in Wasserschutzgebieten WSG Zone III $1{,}0\\text{ m}$) eingehalten wird.\n   - **RC-2:** Darf nur unter einer **wasserdurchlässigen Deckschicht** mit ausreichend mächtiger bindiger Deckschicht zum Grundwasser oder unter einer **vollständig wasserundurchlässigen Deckschicht (z.B. dichte Asphaltschicht)** eingebaut werden. In Wasserschutzgebieten der Zonen I und II ist der Einbau grundsätzlich verboten.'
  },
  {
    id: 't_schadstoffe_asbest_trgs519',
    difficulty: 'Schwer',
    title: 'Schadstoffe: Asbestsanierung nach TRGS 519 (Fest vs. Schwach gebunden)',
    question: 'Unterscheiden Sie schwach gebundenen Spritzasbest und fest gebundenen Asbestzement (Eternit) hinsichtlich ihrer Gefährdung für Atemwege und nennen Sie die geforderten Arbeitsschutzmaßnahmen nach TRGS 519 bei Sanierungsarbeiten an schwach gebundenem Asbest.',
    moduleHint: { id: 'schadstoffe', name: 'Schadstoffe: Asbest & KMF' },
    solution: '1. **Unterschied:**\n   - **Schwach gebundener Asbest (z.B. Spritzasbest, Brandschutzklappen, Dichtschnüre):** Asbestgehalt oft $> 60\\%$, Dichte $< 1000\\text{ kg/m}^3$. Fasern lösen sich bereits durch leichte Erschütterung oder Luftzug massenhaft in die Atemluft ab (extrem kanzerogen / Asbestose, Mesotheliom).\n   - **Fest gebundener Asbestzement (z.B. Wellplatten, Fassadentafeln, Rohre):** Asbestfasern sind fest in eine Zementmatrix eingebunden (ca. 10–15 % Faseranteil, Dichte $> 1400\\text{ kg/m}^3$). Faserfreisetzung tritt primär bei mechanischer Bearbeitung (Sägen, Brechen, Schleifen, Hochdruckreinigen) auf.\n2. **Schutzmaßnahmen bei schwach gebundenem Asbest (Anlage 3 TRGS 519):**\n   - Vollständige Abschottung des Arbeitsbereichs gegenüber der Umwelt (Unterdruckhaltung mit HEPA-Filterung / H14-Entstauber).\n   - Schleusensystem (mindestens 3-Kammer-Personenschleuse mit Dusche für Schwarz-Weiß-Trennung).\n   - PSA: Gebläseunterstützter Atemschutz (Vollmaske mit Partikelfilter P3), partikeldichter Einweg-Schutzanzug (Kategorie III, Typ 5).\n   - Sachkundenachweis nach TRGS 519 Anlage 3 des Bauleiters und Anmeldung bei Gewerbeaufsicht/Berufsgenossenschaft min. 7 Tage vor Beginn.'
  },
  {
    id: 't_kmf_kanzerogenitaet',
    difficulty: 'Mittel',
    title: 'Schadstoffe: Künstliche Mineralfasern (KMF) & TRGS 521',
    question: 'Wann gilt eine Mineralwolle bei der Sanierung eines Bestandsdachs als "Alte Mineralwolle" nach TRGS 521 und wie wird der Kanzerogenitätsindex (KI) berechnet?',
    moduleHint: { id: 'schadstoffe', name: 'Schadstoffe: Asbest & KMF' },
    solution: '1. **Alte vs. Neue Mineralwolle:**\n   Mineralwolle, die **vor dem Jahr 1996 eingebaut** wurde (in Deutschland bis 2000 im Handel), gilt grundsätzlich als krebsverdächtig ("Alte Mineralwolle"), da die Fasern lungengängig und biolangbeständig sind.\n2. **Kanzerogenitätsindex ($KI$ nach Gefahrstoffverordnung):**\n   $$KI = \\Sigma(\\text{Na, K, Ca, Mg, Ba-Oxide}) - 2 \\cdot \\text{Al}_2\\text{O}_3$$\n   - $KI \\le 30$: Als krebserzeugend eingestuft (Kategorie 1B) -> Schutzstufe 2 oder 3 nach TRGS 521.\n   - $30 < KI < 40$: Krebsverdacht (Kategorie 2).\n   - $KI \\ge 40$: Gilt als biolöslich (unschädlich, löst sich in der Lunge schnell auf) -> "Neue Mineralwolle" mit Gütezeichen RAL.'
  },
  {
    id: 't_avv_abfallschluessel',
    difficulty: 'Leicht',
    title: 'Abfallrecht: Abfallverzeichnis-Verordnung (AVV) & Gefährliche Abfälle',
    question: 'Was bedeutet der Stern (*) hinter einer sechsstelligen Abfallschlüsselnummer (AVV-Schlüssel) und welche Konsequenzen hat dies für das Entsorgungsnachweisverfahren?',
    moduleHint: { id: 'abfaelle', name: 'Abfallrecht & AVV' },
    solution: 'Ein Sternchen hinter dem AVV-Schlüssel (z.B. **17 01 06\\***: Gemische aus Beton, Ziegeln und Fliesen, die gefährliche Stoffe enthalten) kennzeichnet den Abfall als **gefährlichen Abfall (Sonderabfall)** nach dem Kreislaufwirtschaftsgesetz (KrWG).\n**Konsequenzen:**\n- Zwingende Führung von **Entsorgungsnachweisen** und Begleitscheinen im elektronischen Abfallnachweisverfahren (eANV).\n- Strenge Andienungspflichten und Nachweisführung über den Verbleib (Registerpflicht über 3 Jahre).\n- Transport nur durch zertifizierte Entsorgungsfachbetriebe mit behördlicher Transportgenehmigung.'
  }
];
