# BaustoffBoard 🏗️🔬

> **Interaktives Portal für Baustoffkunde, Werkstoffprüfung, Tragwerkslehre, Bauphysik und kreislaufgerechten Rückbau.**

Das **BaustoffBoard** ist eine webbasierte, modulare Lehr-, Lern- und Arbeitsplattform für das Bauingenieurwesen und die Architektur. Sie schlägt die Brücke zwischen fundierter akademischer Theorie (Hochschule Augsburg), aktuellen normativen Regelwerken und der direkten ingenieurpraktischen Anwendung auf der Baustelle, im Prüflabor sowie in der Schadensgutachten-Praxis.

---

## 🚀 Kernmerkmale & Systemarchitektur

* **Umfassender Modulbestand:** Über 200 spezialisierte Fachmodule, strukturiert in thematische Haupt-Reiter und einen vierstufigen Lehrpfad (*Grundlagen $\rightarrow$ Labor $\rightarrow$ Bemessung $\rightarrow$ Test*).
* **Interaktive Berechnungs-Tools:** Integrierte Rechner für u. a. U-Werte, Glaser-Nachweise, Hydratationswärme, statistische Festigkeitsauswertung nach DIN EN 206 und Fick’sche Chloriddiffusion.
* **Normenkonformität & Aktualität:** Fundierte Abdeckung des aktuellen Regelwerks (Stand 2023–2026+: z. B. DIN 1045-1000, TR Instandhaltung, ErsatzbaustoffV, DIN EN 1504, Eurocodes 2 & 5).
* **Zirkuläre Nachhaltigkeit & Innovationen:** Tiefe Integration von Ökobilanzierung (LCA nach EN 15804+A2), Digitalen Produktpässen (DPP), EPDs und Zukunftswerkstoffen (Carbonbeton, Geopolymere/AAM, TRL 1–9).
* **Moderne Web-Architektur:** Bereitgestellt als performante Single-Page-Application via Google Cloud Run mit optimiertem statischem HTML-Fallback für Suchmaschinen und Dokumenten-Parser.

---

## 📂 Struktur der Fachbereiche (Übersicht)

Das Portal gliedert sich in folgende zentrale Themencluster:

1. **Grundlagen & Werkstoffmechanik:** Physikalische Einheiten, Materialkennwerte, E-Modul, Spannungs-Dehnungs-Linien.
2. **Baustoff-Enzyklopädie:** Von klassischen mineralischen Bindemitteln und Mauerwerk bis hin zu Holz, Kunststoffen, Asphalt und nachwachsenden Rohstoffen.
3. **Betontechnologie & Stahlbetonbau:** Transportbeton, Konsistenzprüfung, Ausbreitmaß, Bemessung nach Eurocode 2 und Rissbreitenberechnung.
4. **Ingenieurholzbau & Innenausbau:** Bemessung nach Eurocode 5 (BSH, KVH, CLT), Trockenbau (DIN 18181) und Estrichsysteme.
5. **Bauphysik & Nachhaltigkeit:** U-Wert-Berechnung, Tauwasser- und Feuchtigkeitsnachweis (Glaser), graue Energie, LCA und Kreislaufwirtschaft.
6. **Bauen im Bestand & Schadensforensik:** Zustandserfassung (VDI 6200), Feuchtemessung, WTA-Merkblätter, Erkennung von Gefahrstoffen (Asbest, PAK, PCB, KMF, Schimmel).
7. **Instandhaltung & Bautenschutz:** Europäische Prinzipien (DIN EN 1504-9) und nationale Richtlinien (DIBt TR Instandhaltung), Oberflächenschutzsysteme (OS), KKS, Holz- und Korrosionsschutz (DIN EN ISO 12944).
8. **Recht, Innovationen & Praxiswissen:** Bauproduktenrecht (AVCP, abZ/aBG, TRL-Reifegradmodell), Baustellen-Checklisten für Sachkundige Planer (SKP) und Bautagebuch-Praxis.

---

## 🛠️ Technische Details & Bibliotheken

* **Frontend:** Modulare React-/TypeScript-/Vite-Architektur mit dynamischem Rendering und Tailwind CSS.
* **Formelsatz:** Saubere Darstellung mathematischer und physikalischer Gleichungen mittels **KaTeX**.
* **Zahlenformatierung:** Konsequenter Einsatz deutscher Formatierungsstandards (`src/utils/numberFormat.ts`: Dezimalkomma; Tausendertrennung ab 5 Stellen mit schmalem geschütztem Leerzeichen U+202F nach DIN 5008/DIN 1333, in KaTeX `\,`; vierstellige Zahlen ungegliedert; Prüfung `node scripts/qa/zahlformat-tausender.mjs --check`, Details in `docs/architektur.md`, „Zahlformat“).
* **Hosting:** Cloud-Infrastruktur über Google Cloud Run.

### Entwicklung & Qualitätssicherung

* **Struktur:** zentrale Modul-Registry (`src/registry/`), Routing (`src/routing/ModulInhalt.tsx`), Rechenkerne (`src/calc/`), Daten (`src/data/`), Fachmodule (`src/modules/`). Details: [`docs/architektur.md`](docs/architektur.md).
* **QA:** `npx tsc --noEmit`, `npm test`, `npm run check:formeln`, `npm run check:zahlen`, `npm run check:quellen`, `npm run build`, `node scripts/qa/check-bundle.mjs` (Bundle-Budget), `node scripts/qa/check-verwaist.mjs` (verwaiste Dateien) – alle in `.github/workflows/qa.yml`.
* **Workflow:** GitHub ist die einzige Quelle; Google AI Studio wird nur zum Pull von `main` und zum Veröffentlichen genutzt. Abhängigkeits-Updates über Renovate (`renovate.json`). Betriebs-Check: `GET /api/health`.

---

## 👥 Urheberrecht & Kontext

* **Institution:** Technische Hochschule Augsburg (THA)
* **Fachgebiet:** Prof. Dr.-Ing. Jürgen Huber (Professur für Werkstoffe und Stoffkreisläufe im Bauwesen)
* **Zielgruppe:** Studierende des Bauingenieurwesens und der Architektur, Bauleiter, Tragwerksplaner sowie beratende und prüfende Ingenieure und Sachverständige.

---

## 📄 Lizenz

Dieses Projekt und die zugehörigen Inhalte sind urheberrechtlich geschützt. Alle Rechte vorbehalten © 2026 Technische Hochschule Augsburg / Prof. Dr.-Ing. Jürgen Huber.
