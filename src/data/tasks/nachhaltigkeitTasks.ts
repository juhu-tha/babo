import { Task } from '../aufgabenData';

export const nachhaltigkeitTasks: Task[] = [
  {
    id: 't_dpp_value',
    title: 'Digitaler Produktpass: Kreislaufwirtschaft & DPP',
    difficulty: 'Mittel',
    question: 'Welche Rolle spielt der Digitale Produktpass (DPP) bei der Umsetzung der europäischen Kreislaufwirtschaftsstrategie für Bauprodukte, und welche Daten müssen zwingend hinterlegt sein?',
    moduleHint: { id: 'kreislauf_dpp', name: 'Digitaler Produktpass & Kreislauf' },
    solution: 'Der Digitale Produktpass (DPP) bündelt alle relevanten Informationen bezüglich Herkunft, chemischer Zusammensetzung, Schadstoffen, Demontierbarkeit, Reparaturmöglichkeiten und Recyclingfähigkeit eines Bauprodukts über eine eindeutige Kennung. Dies ermöglicht es Abbruchunternehmen und Recyclern am Ende des Lebenszyklus (Szenario C), Baustoffe exakt zu klassifizieren, schadstofffreie Stoffströme abzutrennen und hochwertige Sekundärrohstoffe zu gewinnen.'
  },
  {
    id: 't24',
    difficulty: 'Leicht',
    title: 'Ökobilanz: GWP von Baustoffen & Biogener Kohlenstoff',
    question: 'Warum hat Brettschichtholz in der Herstellungsphase (A1-A3) oft ein negatives Treibhausgaspotenzial (GWP), während Stahlbeton stark positiv ist?',
    moduleHint: { id: 'oekobilanz_lca', name: 'Ökobilanzierung (LCA)' },
    solution: 'Bäume entziehen der Atmosphäre während des Wachstums CO2 durch Photosynthese und speichern den Kohlenstoff in den Holzfasern. Nach DIN EN 15804+A2 wird dies als negativer biogener GWP-Wert in A1–A3 bilanziert und am Lebensende in C3/C4 wieder als Emission angesetzt: 1 kg darrtrockenes Holz (Kohlenstoffanteil ca. 50 %) bindet rechnerisch 0,5 · 44/12 = 1,83 kg CO2 (DIN EN 16449). Bei der Zementherstellung hingegen wird durch das Entsäuern des Kalksteins im Drehrohrofen (thermische Zersetzung von CaCO3) zwingend CO2 freigesetzt.'
  },
  {
    id: 't_lca_module_en15804',
    difficulty: 'Schwer',
    title: 'Ökobilanzierung: Lebenszyklusmodule nach DIN EN 15978 / EN 15804',
    question: 'Erläutern Sie die Lebenszyklusmodule A1-A3, B4, C1-C4 und Modul D. Warum darf Modul D (Wiederverwendungs- und Recyclingpotenziale) nicht einfach mit den Modulen A-C saldiert werden?',
    moduleHint: { id: 'oekobilanz_lca', name: 'Ökobilanzierung (LCA)' },
    solution: '1. **Phasen:**\n   - **A1–A3:** Herstellungsphase (Rohstoffgewinnung, Transport zum Werk, Fabrikation).\n   - **B4:** Nutzungsphase (geplanter Austausch von Bauteilen mit kürzerer Lebensdauer, z.B. Fenster, Dachanstrich).\n   - **C1–C4:** Entsorgungsphase (Rückbau/Abbruch C1, Transport C2, Abfallbehandlung C3, Beseitigung/Deponierung C4).\n   - **Modul D:** Gutschriften und Lasten außerhalb der Systemgrenze (z.B. vermiedene Primärenergie durch Verbrennung oder Sekundärrohstoffverwertung).\n2. **Getrennte Ausweisung:**\n   Modul D liegt **außerhalb der Lebenszyklus-Systemgrenze** des aktuellen Gebäudes. Würde man Modul D direkt von den Emissionen der Phasen A–C abziehen, bestünde die Gefahr des "Greenwashings" und der Doppelzählung (Double-Counting), da die tatsächliche Umweltentlastung erst im zukünftigen Folgesystem (beim nächsten Nutzer des Sekundärstoffs) wirksam wird.'
  },
  {
    id: 't_klinkersubstitution_lc3',
    difficulty: 'Mittel',
    title: 'Materialoptimierung: LC3-Zement (Limestone Calcined Clay)',
    question: 'Welches ökologische und technische Einsparpotenzial bietet LC3-Zement (kombinierter Einsatz von calciniertem Ton und Kalksteinmehl) gegenüber Standard-Portlandzement CEM I?',
    moduleHint: { id: 'materialoptimierung', name: 'Materialoptimierung' },
    solution: 'LC3-Zemente ersetzen bis zu **50 % des energie- und emissionsintensiven Portlandzementklinkers** durch eine Kombination aus calciniertem Ton (Metakaolin) und ungebranntem Kalksteinmehl (Kalkstein-Filler). Tone werden bei nur ca. 700–800°C gebrannt (Klinker bei 1450°C) und spalten kein CO2 aus Karbonaten ab. Dadurch sinken die CO2-Emissionen des Bindemittels um ca. 30–40 %. Chemisch reagiert das Metakaolin mit dem Kalksteinmehl und dem Calciumhydroxid zu dichten Carboaluminat-Hydratphasen, wodurch die 28-Tage-Druckfestigkeit und der Chloridwiderstand dem Niveau von CEM I entsprechen.'
  },
  {
    id: 't_lcc_lebenszykluskosten',
    difficulty: 'Schwer',
    title: 'Lebenszykluskosten (LCC): Barwertmethode nach ISO 15686-5 / DIN EN 16627',
    question: 'Für ein Bauteil stehen zwei Varianten zur Wahl:\n- Variante A: Investitionskosten C_0 = 50.000 €, jährliche Wartungskosten A_t = 1.000 €/a über n = 30 Jahre.\n- Variante B: Investitionskosten C_0 = 65.000 €, jährliche Wartungskosten A_t = 200 €/a über n = 30 Jahre.\n\nBerechnen Sie den Barwert der Lebenszykluskosten (Net Present Value, NPV) für beide Varianten bei einem Diskontierungszinssatz von r = 3,0 % und bestimmen Sie die wirtschaftlichere Variante.',
    moduleHint: { id: 'lebenszyklus_kosten', name: 'Lebenszykluskosten (LCC)' },
    solution: 'Berechnung nach der Barwertmethode:\n1. **Rentenbarwertfaktor ($RBF$):**\n   $$RBF = \\frac{(1+r)^n - 1}{r \\cdot (1+r)^n} = \\frac{(1{,}03)^{30} - 1}{0{,}03 \\cdot (1{,}03)^{30}} = \\frac{2{,}4273 - 1}{0{,}03 \\cdot 2{,}4273} = \\frac{1{,}4273}{0{,}07282} \\approx 19{,}60$$\n2. **Barwert Variante A:**\n   $$\\text{LCC}_A = C_0 + A_t \\cdot RBF = 50000\\text{ €} + 1000\\text{ €/a} \\times 19{,}60 = 50000 + 19600 = **69.600\\text{ €}**$$\n3. **Barwert Variante B:**\n   $$\\text{LCC}_B = C_0 + A_t \\cdot RBF = 65000\\text{ €} + 200\\text{ €/a} \\times 19{,}60 = 65000 + 3920 = **68.920\\text{ €}**$$\n4. **Ergebnis:**\n   Obwohl Variante B bei der Erstinvestition um 15.000 € teurer ist, ist sie über den Betrachtungszeitraum von 30 Jahren um **680 € günstiger** als Variante A (Variante B ist die wirtschaftlichere Lebenszyklus-Lösung).'
  },
  {
    id: 't25',
    difficulty: 'Mittel',
    title: 'Recyclingbeton: E-Modul & Wasseranspruch',
    question: 'Sie ersetzen 40% der groben Gesteinskörnung durch Betonsplitt (RC-Typ 1). Wie verändert sich der E-Modul des Betons und warum?',
    moduleHint: { id: 'ressourcen_umwelt', name: 'Ressourcen & Umwelt' },
    solution: 'RC-Körnung enthält anhaftenden Altmörtel, der poröser und verformbarer ist als primärer Naturstein. Bei 40% Austauschrate sinkt der E-Modul des Festbetons um ca. 10–15 %, während das Schwindmaß um ca. 15–20 % ansteigt. Auch der Wasseranspruch nimmt zu.'
  },
  {
    id: 't26',
    difficulty: 'Mittel',
    title: 'Kreislaufwirtschaft: Urban Mining Index (UMI)',
    question: 'Ein Neubau besteht zu 30% aus Sekundärmaterialien (Input). Durch zirkuläres Konstruieren können 80% der Materialien am Lebensende recycelt werden (Output). Berechnen Sie den UMI.',
    moduleHint: { id: 'kreislauf_dpp', name: 'Kreislaufwirtschaft' },
    solution: 'Der vereinfachte Urban Mining Index (UMI) ermittelt den Rezyklatanteil und die Rückführbarkeit:\n$$\\text{UMI} = \\frac{\\text{Zirkulärer Input} + \\text{Zirkulärer Output}}{2} = \\frac{30\\% + 80\\%}{2} = **55\\%**$$'
  },
  {
    id: 't_zertifizierung_qng',
    difficulty: 'Leicht',
    title: 'Gebäudezertifizierung: DGNB vs. QNG-Siegel',
    question: 'Welche Bedeutung hat das staatliche Qualitätssiegel Nachhaltiges Gebäude (QNG) für die Bundesförderung für effiziente Gebäude (KFW-Kredite)?',
    moduleHint: { id: 'zertifizierung_siegel', name: 'Zertifizierung & Siegel' },
    solution: 'Das QNG ist ein staatliches Gütesiegel des Bundesministeriums für Wohnen, Stadtentwicklung und Bauwesen (BMWSB). Im KfW-Programm „Klimafreundlicher Neubau“ (KFN) sind der Effizienzhaus-40-Standard und die Einhaltung der Treibhausgas-Anforderung des QNG-PLUS (Ökobilanz) Fördervoraussetzung; mit QNG-Zertifikat steigt der Kredithöchstbetrag (Förderbedingungen ändern sich häufig – aktuellen Stand prüfen). Das Siegel verlangt den Nachweis der Treibhausgasemissionen im Lebenszyklus (LCA-Grenzwerte) sowie die Einhaltung gesundheitlicher Kriterien für Innenraumluft (Schadstofffreiheit).'
  }
];
