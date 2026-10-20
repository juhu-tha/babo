# Implementierungsplan: Überarbeitung der Startseite (Startseite.tsx)

## 1. Ausgangslage & Zielsetzung
Die Startseite des BaustoffBoards soll textlich und strukturell an den stark gewachsenen Funktionsumfang der Plattform angepasst werden. Auf Basis der Benutzerentscheidung werden folgende Kernanforderungen umgesetzt:
1. **7 Meta-Cluster & Fachbereiche:** Prominente, interaktive Themenübersicht mit Direktnavigation in die jeweiligen Kernmodule.
2. **4-Stufen-Lehrpfad:** Didaktische Visualisierung des durchgängigen Modulaufbaus (1. Grundlagen & Mechanismen $\to$ 2. Labor & Diagnostik $\to$ 3. Rechnerische Bemessung & Formelherleitungen $\to$ 4. Wissensüberprüfung & Klausurtests).
3. **Identität & Tonalität:** Beibehaltung des bewährten Zitats (*„Chabos wissen was das BaBo ist“*) sowie des prägnanten Institutsnamens (*Prof. Dr.-Ing. Jürgen Huber · TH Augsburg*).
4. **Aktualisierte Plattform-Kennzahlen:** Ersetzung veralteter Modul- und Zeilenzahlen durch verifizierte Echtwerte (über 240 Fachmodule, 2.900+ KaTeX-Formeln, 1.300+ normgeprüfte Prüfungs- und Klausurfragen).
5. **Rechts- & Nutzungshinweise:** Fortführung des Hinweises zum akademischen Lehr- und Übungszweck, direkter Sprung zum `Feedback`-Modul sowie lokale Datenspeicherung (DSGVO-konform im Browser).

---

## 2. Detaillierte Modul-Architektur (`Startseite.tsx`)

### A. Hero-Bereich & Instituts-Kopf
- **Branding:** `GraduationCap`-Icon im dezenten Shiraz-Akzent.
- **Titel & Untertitel:** Zweisprachig (DE/EN) wie bisher (`useLanguage`).
- **Institutsbezug:** `Prof. Dr.-Ing. Jürgen Huber · TH Augsburg`.
- **Informelles Zitat:** *„Chabos wissen was das BaBo ist“* (unterhalb der Institutsbezeichnung).
- **Versions-Tag:** Klickbarer Button mit Link zu den Versionen (`v3.23.1`).

### B. Didaktischer 4-Stufen-Lehrpfad (Stufen-Modell)
Visualisierung der universellen Lern- und Arbeitsmethodik über 4 didaktische Stufen:
1. **Stufe 1 – Grundlagen & Phänomene:** Physikalisch-chemische Wirkmechanismen, Hydratation, Diffusion, Phasenübergänge.
2. **Stufe 2 – Labor & Diagnostik:** Normgerechte Prüfverfahren (Druckpresse, ZfP, TGA, MIP, Spaltzugversuch, Schallemissionsanalyse), Baustofflabor G2.
3. **Stufe 3 – Bemessung & Formelherleitung:** Analytische Nachweise (Eurocode 2, 3, 5, Glaser-Verfahren, Fick II) mit standardmäßig einklappbaren Rechenwegen (`FormulaDerivationBox`).
4. **Stufe 4 – ModulTest & Klausursimulator:** Interaktive Selbsttests mit sofortiger Trefferanalyse und über 1.300 kuratierten Multiple-Choice-Fragen.

### C. Interaktive Meta-Cluster-Themenübersicht
Kartenraster mit direkter Ansteuerung (`setActiveTab`) der zentralen Cluster-Einstiege:
1. **Cluster I: Grundlagen & Labor** (Physik, Bauchemie, Mechanik, Bauphysik, Brandschutz, Baustoffprüfungen).
2. **Cluster II: Materialien & Bauprodukte** (Kalk, Zement, Beton, Metalle, Holz, Kunststoffe, Glas, CE & Normen).
3. **Cluster III: Entwurf & Bemessung** (Stahlbeton EC 2, Spannbeton, Holzbau EC 5, Mauerwerk, Querkraft & Knicken).
4. **Cluster IV: Bestand, Schadensanalyse & Sanierung** (Diagnostik, Betonschäden, Korrosion, WTA, Schadstoffrückbau).
5. **Cluster V: Nachhaltigkeit, Kreislauf & Ökobilanz** (LCA, EPD, CO₂-Bilanzierung, Recyclingbeton, DGNB/QNG).
6. **Cluster VI: Digitales & Baupraxis** (BIM, KI-Tools im Bauwesen, Bauleitung, Bautagebuch, Regelwerke).
7. **Cluster VII: Studium, Vorlesungen & Laborordnung** (Vorlesungsportal, Thesen, Baustofflabor G2, Laborordnung & Sicherheitsregeln).

### D. Revisions-, Haftungs- & Datenschutz-Hinweise
- **Nutzungshinweis:** Klarer Lehr- und Vorbemessungshinweis mit Direkt-Schaltfläche zum `Feedback`-Modul (zur Fehlermeldung und Qualitätsoptimierung).
- **Datenschutz & Datensouveränität:** Bestätigung der rein lokalen Datenspeicherung (`localStorage`), kein Tracking, clientseitiger PDF-Export.
- **Projektabgrenzung:** Bewährter Hinweis auf das engagementgetriebene Hochschulprojekt ohne Förder- oder Industriemittel.

---

## 3. Verifikations- & Qualitätssicherung
- **Typescript & Linting:** `tsc --noEmit` fehlerfrei.
- **Test-Suite:** `npm test` (5/5 bestanden).
- **Formel-Auditing:** `npm run check:formeln` (0 Fehler).
- **Build-Integrität:** `compile_applet` erfolgreich.
- **Sprachunterstützung:** Korrekte Übersetzung aller Kerntexte über das bestehende `useLanguage`-System.
