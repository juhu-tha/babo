import { Task } from '../aufgabenData';

export const komplexTasks: Task[] = [
  {
    id: 't_nh_durability_co2_sink',
    difficulty: 'Schwer',
    title: 'Interdisziplinär: Karbonatisierung als CO2-Senke vs. Bewehrungskorrosion',
    question: 'Ein Betonbauteil im Außenbereich (Expositionsklasse XC3) karbonatisiert im Laufe der Jahre. Berechnen Sie näherungsweise die Karbonatisierungstiefe d_k nach t = 50 Jahren bei einem Karbonatisierungsbeiwert von k = 4.0 mm/\\sqrt{a}. Wie viel CO2 (in kg/m² Wandfläche) hat der Beton in dieser Schicht absorbiert, wenn der Zementgehalt c = 300 kg/m³ (mit 65% CaO-Anteil im Klinker) betrug und der Karbonatisierungsgrad des CaO bei 60% liegt?',
    moduleHint: { id: 'oekobilanz_lca', name: 'Ökobilanzierung (LCA)' },
    solution: '1. **Karbonatisierungstiefe ($d_k$):**\n   $$d_k = k \\cdot \\sqrt{t} = 4.0\\text{ mm/}\\sqrt{\\text{a}} \\times \\sqrt{50\\text{ a}} \\approx 4.0 \\times 7.071 = 28.28\\text{ mm} = 0.0283\\text{ m}$$\n2. **CO2-Uptake pro m² Wandfläche:**\n   - Karbonatisiertes Volumen: $V = 1.0\\text{ m}^2 \\times 0.0283\\text{ m} = 0.0283\\text{ m}^3$.\n   - Zementmasse: $m_z = 0.0283 \\times 300 = 8.49\\text{ kg}$.\n   - Enthaltenes CaO ($65\\%$): $m_{\\text{CaO}} = 8.49 \\times 0.65 = 5.52\\text{ kg}$.\n   - Reagiertes CaO ($60\\%$): $m_{\\text{CaO,react}} = 5.52 \\times 0.60 = 3.31\\text{ kg}$.\n3. **Molare Umrechnung ($CaO + CO_2 \\rightarrow CaCO_3$):**\n   Molverhältnis $M_{\\text{CO2}} / M_{\\text{CaO}} = 44.0 / 56.1 \\approx 0.784$:\n   $$m_{\\text{CO2}} = 3.31\\text{ kg} \\times 0.784 \\approx **2.60\\text{ kg CO}_2\\text{ pro m}^2$$\n   Fazit: Während die Karbonatisierung bezüglich des Korrosionsschutzes (Depassivierung des Stahls) die Lebensdauer begrenzt, bindet das Bauteil $2.6\\text{ kg CO}_2/\\text{m}^2$ dauerhaft mineralisch ein.'
  },
  {
    id: 't_nh_gwp_cem_vergleich',
    difficulty: 'Schwer',
    title: 'Interdisziplinär: GWP-Vergleich von Zementen & Hydratationswärme (CEM I vs. CEM III)',
    question: 'Für ein Brückenwiderlager werden 450 m³ Beton benötigt. Es stehen zwei Rezepturen zur Auswahl:\n- Rezeptur A (CEM I 42.5 N): c = 340 kg/m³, GWP = 850 kg CO2-eq/t Zement.\n- Rezeptur B (CEM III/B 32.5 N-LH): c = 350 kg/m³, GWP = 290 kg CO2-eq/t Zement.\n\na) Berechnen Sie die CO2-Gesamteinsparung (in Tonnen CO2-eq) bei Wahl von Rezeptur B.\nb) Welche bauphysikalischen und ausführungstechnischen Unterschiede ergeben sich bezüglich Rissbildung und Nachbehandlung?',
    moduleHint: { id: 'oekobilanz_lca', name: 'Ökobilanzierung (LCA)' },
    solution: '1. **GWP-Berechnung:**\n   - Rezeptur A: $450\\text{ m}^3 \\times 0.34\\text{ t/m}^3 \\times 850\\text{ kg/t} = 130\\,050\\text{ kg CO}_2\\text{-eq} = 130.05\\text{ t}$.\n   - Rezeptur B: $450\\text{ m}^3 \\times 0.35\\text{ t/m}^3 \\times 290\\text{ kg/t} = 45\\,675\\text{ kg CO}_2\\text{-eq} = 45.68\\text{ t}$.\n   - **CO2-Einsparung:** $\\Delta GWP = 130.05 - 45.68 = **84.37\\text{ Tonnen CO}_2\\text{-eq}**$ (Einsparung von ca. **65 %**!).\n2. **Bautechnische Konsequenzen:**\n   - *Hydratationswärme:* CEM III/B reagiert stark endotherm gedämpft (Low Heat - LH). Die Temperaturspitze im Kern des massigen Widerlagers sinkt drastisch, was schädliche Zwangrisse durch Temperaturgradienten zuverlässig verhindert.\n   - *Nachbehandlung:* Der Beton entwickelt seine Festigkeit und Randzonendichte in den ersten Tagen deutlich langsamer. Die Nachbehandlungsdauer (Schutz vor Austrocknung nach DIN EN 13670) muss mindestens verdoppelt werden (z.B. von 3 auf 7–10 Tage).'
  },
  {
    id: 't_materialkennwerte_vergleich',
    difficulty: 'Leicht',
    title: 'Baustoffkenngrößen: Leichtbaugüte von Stahl, Holz und Beton',
    question: 'Vergleichen Sie Stahl (S235), Nadelholz (C24 parallel zur Faser) und Beton (C30/37) bezüglich ihrer spezifischen Festigkeit (Verhältnis von Bemessungsfestigkeit f_d zu Rohdichte \\rho). Welcher Baustoff weist die höchste Leichtbaugüte auf?',
    moduleHint: { id: 'baustoffkenngroessen', name: 'Baustoffkenngrößen' },
    solution: '1. **Stahl S235:** $f_d \\approx 235\\text{ N/mm}^2$, $\\rho \\approx 7850\\text{ kg/m}^3$. Verhältnis $f_d / \\rho \\approx 0.030$.\n2. **Beton C30/37 (Druck):** $f_{cd} = 17.0\\text{ N/mm}^2$, $\\rho \\approx 2400\\text{ kg/m}^3$. Verhältnis $f_{cd} / \\rho \\approx 0.007$.\n3. **Holz C24 (Zug parallel zur Faser):** $f_{t,0,d} \\approx 14.0\\text{ N/mm}^2$ (mit $k_{\\text{mod}} = 0.8, \\gamma_M = 1.3$), $\\rho \\approx 420\\text{ kg/m}^3$. Verhältnis $f_d / \\rho \\approx 0.033$.\nHolz erreicht parallel zur Faser das höchste Verhältnis von Festigkeit zu Eigengewicht (höchste Leichtbaugüte) und ist im Weitspannungs-Tragwerksbau daher hochgradig effizient.'
  },
  {
    id: 't_einheiten_umrechnung',
    difficulty: 'Leicht',
    title: 'Einheiten: MPa vs. N/mm² vs. kN/cm²',
    question: 'Rechnen Sie eine elastische Normalspannung von 28.5 MPa in N/mm² sowie in kN/cm² um.',
    moduleHint: { id: 'einheiten', name: 'Einheiten' },
    solution: '1. **MPa in N/mm²:** $1\\text{ MPa} = 1\\text{ N/mm}^2$. Somit entsprechen $28.5\\text{ MPa}$ exakt **$28.5\\text{ N/mm}^2$**.\n2. **N/mm² in kN/cm²:** Da $1\\text{ kN} = 1000\\text{ N}$ und $1\\text{ cm}^2 = 100\\text{ mm}^2$, gilt: $1\\text{ kN/cm}^2 = 10\\text{ N/mm}^2$.\n   Daher ist $28.5\\text{ N/mm}^2 = 28.5 / 10 = **2.85\\text{ kN/cm}^2**$.'
  }
];
