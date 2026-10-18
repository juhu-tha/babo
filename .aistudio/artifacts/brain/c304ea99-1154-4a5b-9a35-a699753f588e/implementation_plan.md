# Intensivprüfung & Erweiterung: Ökobilanzierung (LCA) im Bauwesen

Ganzheitliche fachliche und normative Intensivprüfung des Moduls Ökobilanzierung (LCA) für die Technische Hochschule Augsburg. Dieser Plan führt ein tiefgehendes Audit nach DIN EN 15804+A2, DIN EN 15978 und QNG (Stand 2026) durch, erweitert den interaktiven CO₂-/LCA-Rechner um Zirkularitäts- und Modul-D-Metriken sowie moderne ÖKOBAUDAT-Datensätze und bettet einen wissenschaftlichen Auditbericht direkt in die Anwendung ein.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Auf Basis der interaktiven Vorabstimmung wurden folgende Kernfestlegungen getroffen:

- **Confirmed Decision 1 (Prüfungsumfang):** Ganzheitlicher Audit aller Teilbereiche des LCA-Moduls (Normen, Lebenszyklusphasen A1–D, Indikatoren, EPD-Logik, Rechner und Didaktik).
- **Confirmed Decision 2 (Funktionale Rechner-Erweiterungen):** Umsetzung aller drei Schlüssel-Erweiterungen:
  1. *Modul-D-Gutschriften & Zirkularitätsmetriken* (Urban Mining Index, Sekundärrohstoff-Potenziale, Netto- vs. Brutto-GWP).
  2. *QNG-Konformitätsvergleich (Stand 2026)* mit exakten Benchmarks für Wohngebäude (WG) und Nichtwohngebäude (NWG) für die Siegelstufen QNG-PLUS und QNG-PREMIUM.
  3. *ÖKOBAUDAT-Stammdaten-Erweiterung* um moderne, zukunftsorientierte Baustoffe (klinkereffiziente CEM II/C-M- und CEM III-Betone, Recyclingbeton RC-C25/30, Holz-Beton-Verbund, Lehmbaustoffe, Hanfkalk und biobasierte Dämmstoffe).
- **Confirmed Decision 3 (Ergebnisdarstellung):** Bereitstellung eines detaillierten Fachprüfberichts aus Professoren- und Studierendensicht (integriert als dezidierter Audit-Tab im Modul) bei gleichzeitiger direkter Optimierung aller betroffenen Rechner- und Wissenskomponenten.

---

## 1. Overview & Core Concept

- **What It Does**: Das erweiterte Ökobilanzierungs-Modul bietet eine lückenlose Verknüpfung aus normativer Theorie (DIN EN 15804+A2, DIN EN 15978, CPR-Novelle 2024/3110 mit Digitalem Produktpass DPP) und baupraktischer Anwendung. Studierende und Ingenieure können über interaktive Parameterstudien die Treibhausgaswirkung (GWP-total, GWP-fossil, GWP-biogenic, GWP-luluc) und Primärenergiebedarfe (PENRT, PERT) ganzer Bauteilaufbauten simulieren, den Einfluss von Rückbau- und Recyclingpfaden (Modul D) analysieren und die Einhaltung staatlicher QNG-Grenzwerte prüfen.
- **Target Audience / Persona**:
  - *Bauingenieur-Studierende (Bachelor/Master)* im Fach Baustoffkunde & Nachhaltiges Bauen zur Klausur- und Projektarbeitsvorbereitung.
  - *Lehrende und wissenschaftliche Mitarbeiter* für Vorlesungsdemonstrationen und Laborübungen.
  - *Praxispartner & Tragwerksplaner* zur schnellen Abschätzung von Materialsubstitutions-Effekten.
- **Key Value**: Didaktisch transparente Entmystifizierung der Lebenszyklusanalyse nach dem "Cradle-to-Cradle"- bzw. "Cradle-to-Grave"-Prinzip ohne intransparente Black-Box-Rechnungen.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Theorie & Normativer Rahmen (Tab 1: Grundlagen)**: Schneller Einstieg in DIN EN 15804+A2 und DIN EN 15978 mit klarer Gegenüberstellung der 17 Module A1–A5, B1–B7, C1–C4 und Modul D.
2. **Interaktiver CO₂- & LCA-Rechner (Tab 2: Berechnungs-Sandbox)**:
   - Auswahl des Gebäudetyps (Wohngebäude WG vs. Nichtwohngebäude NWG).
   - Dynamisches Hinzufügen/Entfernen von Bauteilschichten aus der erweiterten ÖKOBAUDAT-Bibliothek.
   - Echtzeit-Berechnung von GWP ($A1\text{--}A3$), Rückbau ($C3/C4$) und Recyclinggutschriften ($Modul\ D$).
   - Direkte Visualisierung der QNG-Erfüllung (Standard, QNG-PLUS, QNG-PREMIUM) anhand von dynamischen Benchmark-Balken mit Norm-Grenzlinien.
   - Vergleichsansicht: Konventionelle Massivbauweise vs. Zirkuläre / Holz-Hybrid-Bauweise.
3. **Didaktische Excel- & Laborübung (Tab 3: Praxis-Transfer)**: Anleitung zur Erstellung eigener Transportbeton-Ökobilanzen mit Excel-Export.
4. **Wissenschaftlicher Prüfbericht (Neuer Tab 4: Audit & Evaluation)**: Strukturierte Würdigung des Moduls mit Bewertungsmatrix, Stärkenprofil, didaktischen Hinweisen und Normen-Audit Stand 2026.

### Visual Identity & Theme (Adhering to GEMINI.md & Frontend Design)
- **Aesthetic Direction**: Hochschuladäquate, akademisch-technische Fachanwendung mit klarer Informationsdichte und visueller Ruhe (Anti-Slop, keine bunten Pillenanhäufungen, keine immersiven Konsolenhintergründe).
- **Color Budget (60-30-10)**:
  - *60% Dominanter Canvas*: Helles, augenfreundliches Weiß / Off-White (`bg-white`, `bg-slate-50/50`).
  - *30% Strukturelle Flächen*: Feine Begrenzungen (`border-home-grau/30`), sanfte Karten-Hintergründe (`bg-off-white` / Pergamentweiß).
  - *10% Akzentfarbe*: Modulspezifisches Edel-Weinrot (`shiraz` / `#8B1538`) für aktive Tab-Indikatoren, Formel-Highlights und primäre Aktionen, ergänzt durch semantische Signalmarker (Smaragdgrün für QNG-Zielerreichung, Korallenrot für Schwellenwertüberschreitungen).
- **Typography & Formatting**:
  - LaTeX-Formelblöcke via `react-katex` (`\text{GWP}_{\text{total}} = \text{GWP}_{\text{fossil}} + \text{GWP}_{\text{biogenic}} + \text{GWP}_{\text{luluc}}`).
  - Tabellarische Zahlen (`font-mono tabular-nums`) für alle CO₂- und Primärenergie-Werte zur optimalen visuellen Vergleichbarkeit.
  - Klare typografische Trennung von Fließtext (`text-text-main/80`) und Kernkennwerten (`font-bold text-text-main`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Trennung von Herstellung (A1–A3), End-of-Life (C) und Modul D**:
  - *Chosen Approach*: Das Netto-GWP wird transparent aufgeschlüsselt. Nach DIN EN 15978 darf Modul D nicht unkommentiert in die Gesamt-GWP-Summe der Phasen A–C eingerechnet werden, sondern muss als separate Informationssäule ("Potenziale außerhalb der Systemgrenze") ausgewiesen werden.
  - *Why*: Entspricht exakt den Vorgaben des QNG und der DGNB. Ein einfaches Abziehen von Modul D würde den Blick auf die real in die Atmosphäre emittierte CO₂-Menge bei der Baustofferrichtung verschleiern (Greenwashing-Gefahr).
- **Decision 2: Erweiterung der ÖKOBAUDAT-Materialdatenbank im Client**:
  - *Chosen Approach*: Vollständig typisierte clientseitige Datenstruktur mit echten EPD-Mittelwerten für klinkereffiziente Betone, Recyclingmaterialien und biobasierte Verbundstoffe ohne Latenz und ohne externe Serverabhängigkeit.
  - *Why*: Garantiert maximale Rechengeschwindigkeit, Offline-Fähigkeit und fehlerfreie Simulation im Hörsaal.
- **Decision 3: Fester QNG-Benchmark-Vergleich nach Wohn-/Nichtwohngebäuden**:
  - *Chosen Approach*: Differenzierte Grenzwerte:
    - *Wohngebäude (WG)*: QNG-PLUS $\le 28{,}0\,\text{kg CO}_2\text{-Äq.}/(\text{m}^2\cdot\text{a})$, QNG-PREMIUM $\le 24{,}0\,\text{kg CO}_2\text{-Äq.}/(\text{m}^2\cdot\text{a})$.
    - *Nichtwohngebäude (NWG)*: Differenzierung nach Nutzungsprofilen (Büro / Unterricht) mit Bezug auf NGF bzw. BGF.
  - *Why*: Ermöglicht Studierenden reale Entwurfsbeurteilungen für die KfW-Förderung (KFN-Kreditprogramm).

---

## 4. Technical Architecture & Data Strategy

### System & Component Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        OekobilanzLCA (Host-Modul)                      │
│   ┌──────────────┬──────────────────┬─────────────────┬────────────┐   │
│   │ Tab: Theorie │ Tab: LCA-Rechner │ Tab: Excel-Uebg │ Tab: Audit │   │
│   └──────┬───────┴─────────┬────────┴────────┬────────┴─────┬──────┘   │
└──────────┼─────────────────┼─────────────────┼──────────────┼──────────┘
           │                 │                 │              │
           ▼                 ▼                 ▼              ▼
    ┌─────────────┐   ┌─────────────┐   ┌────────────┐  ┌────────────┐
    │   LCA.tsx   │   │ Interactive │   │ Transport- │  │  LcaAudit  │
    │  (Normen &  │   │  LCACalc    │   │ beton-LCA  │  │   Report   │
    │  Phasen)    │   │ (Sandbox)   │   │ (Excel)    │  │ (Prof/Stud)│
    └─────────────┘   └──────┬──────┘   └────────────┘  └────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   ┌───────────────────┐             ┌──────────────────┐
   │ Extended Material │             │ QNG 2026 Engine  │
   │ Database (ÖKOBAU) │             │ (WG/NWG Benchm.) │
   │ - CEM II/C-M & III│             │ - Modul D Credit │
   │ - RC-Beton C25/30 │             │ - UMI Zirkulär   │
   │ - Holz-Hybrid/CLT │             │ - GWP-Indikator  │
   │ - Hanfkalk/Lehm   │             │ - PENRT & PERT   │
   └───────────────────┘             └──────────────────┘
```

### Data Model & State Mapping
- `MaterialDefinition`:
  - `id`, `name`, `category`, `unit` (`m³` | `t`).
  - `densityKg`: Rohdichte zur Massenermittlung.
  - `gwpA1A3`: Spezifisches Treibhauspotenzial Herstellung.
  - `gwpC`: End-of-Life-Emissionen (Rückbau/Verbrennung).
  - `gwpD`: Gutschriften für stoffliches/thermisches Recycling (negativer Wert).
  - `biogenicContent`: Gebundener biogener Kohlenstoff ($-\text{kg CO}_2\text{-Äq.}$).
  - `umiScore`: Urban Mining Index / Recyclinganteil (0–100%).
  - `penrt`: Primärenergieaufwand nicht erneuerbar ($\text{MJ}/\text{Einheit}$).
- `LcaCalculationState`:
  - `buildingType`: `'wohnbau'` | `'nichtwohnbau'`.
  - `grossFloorArea`: $BGF$ in $\text{m}^2$.
  - `referenceStudyPeriod`: Betrachtungszeitraum $50\,\text{Jahre}$ (Normvorgabe).
  - `selectedMaterials`: Array mit `materialId` und `quantity`.
- `ComputedResults`:
  - $GWP_{\text{A1-A3}}$, $GWP_{\text{C}}$, $GWP_{\text{D}}$, $GWP_{\text{Netto}}$ und $GWP_{\text{m}^2\cdot\text{a}}$.
  - `qngStatus`: Bewertung (`Standard`, `QNG-PLUS`, `QNG-PREMIUM`).
  - `zirkularitaetsIndex`: Gewichteter Zirkularitätswert des Tragwerks/Aufbaus.

### Implementation Checklist
1. **Auditbericht integrieren**: Erstellung eines strukturierten Prüfberichts aus Dozenten- und Studierendensicht mit detaillierten Fachbewertungen und Normen-Abgleich.
2. **ÖKOBAUDAT-Materialstamm erweitern**: Einpflegen von CEM II/C-M, Geopolymer, RC-Beton, Hanfkalk, Lehmbauplatte und modernen Dämmstoffen in `InteractiveLCACalc.tsx`.
3. **Modul-D- & Zirkularitäts-Rechner ausbauen**: Saubere Gegenüberstellung von $A1\text{--}C$ vs. $Modul\ D$, inkl. Urban-Mining-Index-Berechnung.
4. **QNG 2026 Benchmarks schärfen**: Differenzierung nach Wohn- und Nichtwohngebäuden mit interaktiven Grenzlinien im Diagramm.
5. **Verifikation & Test**: Durchführung von `npm run lint` und `compile_applet` zur Bestätigung fehlerfreier Funktion.
