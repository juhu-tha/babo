# Abgleich & Aktualisierung: Betontechnologie-Module mit betontechnische-daten.de

Systematischer Abgleich aller betontechnologischen Fachmodule der Anwendung mit dem Standard-Nachschlagewerk *Betontechnische Daten* (Heidelberg Materials / InformationsZentrum Beton, Stand 2022) unter strikter Einhaltung der aktuellen Normengeneration (DIN 1045-2:2023-08, DIN EN 206:2021-06, DIN EN 197-1/5, DIN EN 13670).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Bestätigte Weichenstellungen aus Phase 1:**
> - **Umfang:** Vollständiger Abgleich aller betontechnologischen Kernmodule der Anwendung (nicht nur Teilausschnitte).
> - **Normativer Vorrang:** Die aktuelle Normengeneration (2023/2024 sowie verifizierte Neuausgaben bis 2026) hat kompromisslosen Vorrang vor dem Stand 2022 von *betontechnische-daten.de*. Abweichungen zum Stand 2022 werden in den Modulen als informative Synopse/Hinweis kenntlich gemacht.
> - **Integrationsform:** Bestehende Fachmodule werden direkt im Kern aktualisiert, um Kennwerte, Formeln, Prüfverfahren und normative Referenzen ergänzt, ohne das bewährte Layout zu verändern.

---

## 1. Overview & Core Concept

Das Standardwerk *Betontechnische Daten* dient der deutschen Baupraxis als kompaktes Nachschlagewerk für Zemente, Gesteinskörnungen, Betonzusammensetzung, Konformitätsnachweise, Nachbehandlung und Betonanwendungen. Durch den Abgleich mit unserer App werden veraltete Richtwerte eliminiert und die Module auf den forensisch exakten, aktuellen Normenstand gebracht.

### Zielgruppen & Mehrwert
- **Studierende & Lehrende:** Didaktisch geschlossener Übergang von den handwerklichen Grundlagen zu aktuellen Grenzwerttabellen und Prüfverfahren.
- **Tragwerksplaner & Betontechnologen:** Verlässliche Hüllwerte, Konformitätskriterien nach DIN EN 206/DIN 1045-2 und exakte Nachbehandlungsfristen nach DIN EN 13670.
- **Prüfstellen & Bauleiter:** Klare Kriterien für Frisch- und Festbetonprüfungen auf der Baustelle.

---

## 2. Strukturierter Abgleich & Arbeitspakete (AP 1 – AP 4)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   BETONTECHNISCHE DATEN (STAND 2022 / 2024)                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
       ┌───────────────────────────────┼───────────────────────────────┐
       ▼                               ▼                               ▼
┌──────────────┐               ┌──────────────┐               ┌──────────────┐
│  AP 1: Binde- │               │  AP 2: Frisch-│               │  AP 3: Fest- │
│  mittel & Zement             │  beton & Prüf.│               │  beton & Konf│
│  (DIN EN 197) │               │  (DIN EN 1235)│               │  (DIN EN 206)│
└──────┬───────┘               └──────┬───────┘               └──────┬───────┘
       │                              │                              │
       └──────────────────────────────┼──────────────────────────────┘
                                      ▼
                        ┌──────────────────────────────┐
                        │  AP 4: Nachbehandlung &      │
                        │  Sonderbetone (WU, SVB, ...) │
                        │  (DIN EN 13670 / DAfStb)     │
                        └──────────────────────────────┘
```

### Arbeitspaket 1: Bindemittel, Zemente & Betonzusatzstoffe
*Betroffene Module:* `src/modules/Bindemittel.tsx`, `src/modules/Zementchemie.tsx`, `src/modules/Mischungsberechnung.tsx`
- **Recherche-Abgleich:**
  - 27 Normalzemente nach DIN EN 197-1 (CEM I bis CEM V).
  - **Neuerung gegenüber 2022:** Vollständige Integration von DIN EN 197-5 (klinkereffiziente Zemente CEM II/C-M mit 50–64 M.-% Klinker sowie CEM VI mit 35–49 M.-% Klinker) und deren nationale Anwendungsregeln nach DIN 1045-2:2023-08.
  - Zemente mit besonderen Eigenschaften: LH (Low Heat), SR (hoher Sulfatwiderstand nach DIN EN 197-1, Pflicht ab $600\,\text{mg/l}\,\text{SO}_4^{2-}$), NA (niedriger wirksamer Alkaligehalt nach DIN 1164-10 für Feuchteklasse WA/WS).
  - Betonzusatzstoffe Typ I (Gesteinsmehle, Pigmente) und Typ II (Flugasche nach DIN EN 450-1 mit $k = 0{,}40$, Silikastaub nach DIN EN 13263-1 mit $k = 1{,}0$ bzw. $2{,}0$).

### Arbeitspaket 2: Frischbetoneigenschaften & Prüfverfahren
*Betroffene Module:* `src/modules/Frischbeton.tsx`, `src/modules/Ausbreitversuch.tsx`, `src/modules/Frischbetontemperatur.tsx`, `src/modules/Frischbetondruck.tsx`
- **Recherche-Abgleich:**
  - Konsistenzbereiche und Grenzabweichungen nach DIN EN 206 Tab. 11/12 & DIN 1045-2:
    - Ausbreitmaßklassen F1 ($\le 340\,\text{mm}$) bis F6 ($\ge 630\,\text{mm}$) nach DIN EN 12350-5.
    - Verdichtungsmaßklassen C0 ($\ge 1{,}46$) bis C3 ($1{,}10 - 1{,}04$) nach DIN EN 12350-4.
    - Setzmaßklassen S1 ($10-40\,\text{mm}$) bis S5 ($\ge 220\,\text{mm}$) nach DIN EN 12350-2.
    - Setzfließmaßklassen SF1 ($550-650\,\text{mm}$) bis SF3 ($760-850\,\text{mm}$) für SVB nach DIN EN 12350-8.
  - Frischbetontemperatur nach DIN 1045-3 / ZTV-ING: Mindesttemperatur $+5\,{^\circ}\text{C}$ (bei $T_{\text{Luft}} \ge -3\,{^\circ}\text{C}$) bzw. $+10\,{^\circ}\text{C}$ (bei $T_{\text{Luft}} < -3\,{^\circ}\text{C}$); Höchsttemperatur $+30\,{^\circ}\text{C}$ (Massenbeton $\le +25\,{^\circ}\text{C}$).
  - Frischbetonrohdichte und Luftporengehalt (Druckausgleichsverfahren nach DIN EN 12350-7).

### Arbeitspaket 3: Festbetoneigenschaften, Konformitätskontrolle & Statistik
*Betroffene Module:* `src/modules/Festbeton.tsx`, `src/modules/FestbetonStatistik.tsx`, `src/modules/Konformitaetskontrolle.tsx`
- **Recherche-Abgleich:**
  - Druckfestigkeitsklassen von Normal- und Schwerbeton (C8/10 bis C100/115) sowie Leichtbeton (LC8/9 bis LC80/88) mit charakteristischer Zylinder- und Würfeldruckfestigkeit.
  - **Konformitätsnachweis nach DIN EN 206 / DIN 1045-2:**
    - **Kriterium 1 (Mittelwert $f_{cm}$):**
      - Erstherstellung ($n < 35$): $f_{cm} \ge f_{ck} + 4\,\text{MPa}$ (bei Hochleistungsbeton $+5\,\text{MPa}$).
      - Stetige Herstellung ($n \ge 35$): $f_{cm} \ge f_{ck} + 1{,}48 \cdot \sigma$ mit $\sigma \ge 3\,\text{MPa}$.
    - **Kriterium 2 (Einzelwert $f_{ci}$):**
      - Erstherstellung & stetige Herstellung: $f_{ci} \ge f_{ck} - 4\,\text{MPa}$ (bei Hochleistungsbeton $\ge f_{ck} - 5\,\text{MPa}$ bzw. $\ge 0{,}90 \cdot f_{ck}$).
  - Konformitätskriterien für Spaltzugfestigkeit, Biegezugfestigkeit und Luftporenkennwerte.

### Arbeitspaket 4: Nachbehandlung & Sonderbetonanwendungen
*Betroffene Module:* `src/modules/Nachbehandlung.tsx`, `src/modules/WUBauwerke.tsx`, `src/modules/SVB.tsx`, `src/modules/Leichtbeton.tsx`, `src/modules/Massenbeton.tsx`
- **Recherche-Abgleich:**
  - **Nachbehandlung nach DIN EN 13670 / DIN 1045-3:**
    - Festigkeitsentwicklungsrate $r = f_{cm,2} / f_{cm,28}$ (schnell: $r \ge 0{,}50$; mittel: $0{,}30 \le r < 0{,}50$; langsam: $0{,}15 \le r < 0{,}30$; sehr langsam: $r < 0{,}15$).
    - Mindestnachbehandlungsdauer in Tagen abhängig von Oberflächentemperatur ($T \ge 25\,{^\circ}\text{C}$, $15-25\,{^\circ}\text{C}$, $10-15\,{^\circ}\text{C}$, $5-10\,{^\circ}\text{C}$) und gefordertem Erhärtungsgrad (50 % $f_{ck}$ bei Normalbeton, 70 % $f_{ck}$ bei Expositionsklasse XM).
  - **WU-Beton nach DAfStb WU-Richtlinie:**
    - Beanspruchungsklasse 1 (drückendes/aufstauendes Wasser) vs. Beanspruchungsklasse 2 (Bodenfeuchte).
    - Mindestbauteildicken (z. B. $h \ge 250\,\text{mm}$ für Wände, $300\,\text{mm}$ für Ortbetonsohlen bei Beanspruchungsklasse 1).
    - Maximaler Wasserzementwert $w/z \le 0{,}55$ (bzw. $0{,}60$ bei Bauteildicken $\ge 400\,\text{mm}$).
  - **SVB nach DAfStb-Richtlinie SVB / DIN EN 206:**
    - Viskositätsklassen $t_{500}$ (VS1 $\le 2{,}0\,\text{s}$, VS2 $> 2{,}0\,\text{s}$).
    - Blockierneigung über L-Kasten und J-Ring.

---

## 3. User Experience & Visual Design

- **Strikter Layout-Freeze:** Volle Bewahrung des etablierten 4-Stufen-Lehrpfads (`1. Grundlagen`, `2. Labor & Baustelle`, `3. Rechner & Bemessung`, `4. Wissenstest`), des Shiraz-Edelrot-Farbkonzepts und des `ModuleFooter`-Standards.
- **Interaktive Formeln & Tabellen:** Einbindung exakter LaTeX-Formeln (`react-katex`) und Berechnungsrechner mit `formatDeZahl`.
- **Transparente Normenkennzeichnung:** Sichtbare Ausweisung der Normengeneration (z. B. DIN 1045-2:2023-08) mit Vermerk über Aktualisierungen gegenüber dem Stand 2022 von *betontechnische-daten.de*.

---

## 4. Technische Architektur & Datenkonsistenz

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           APP-ROUTER & NAVIGATION                         │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│      BETON-TECHNOLOGIE        │               │     BETONPRÜFUNGEN & LABOR    │
│  • Zementchemie.tsx           │               │  • Frischbeton.tsx            │
│  • Bindemittel.tsx            │               │  • Ausbreitversuch.tsx        │
│  • Expositionsklassen.tsx (OK)│               │  • Festbeton.tsx              │
│  • Betonkennwerte.tsx (OK)    │               │  • Konformitaetskontrolle.tsx │
│  • Nachbehandlung.tsx         │               │  • FestbetonStatistik.tsx     │
└───────────────────────────────┘               └───────────────────────────────┘
```

- **Verifikations-Pipeline:** Vor jedem Teilabschnitt wird die Dimensionsreinheit aller Formeln sowie die Lauffähigkeit via `lint_applet` (`tsc --noEmit`) und `compile_applet` (`npm run build`) sichergestellt.
- **Null-Halluzinations-Gebot:** Keine geratenen URLs oder Fantasie-Gleichungen. Verlinkungen folgen stets dem verifizierten DIN-Media-Suchschema.
