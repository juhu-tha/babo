import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import {
  Scale,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  ChevronRight
} from 'lucide-react';

interface BeiwerterDetail {
  id: string;
  symbol: string;
  latexSymbol: string;
  name: string;
  category: 'kriechen' | 'schwinden' | 'relaxation' | 'elastisch' | 'mechanisch' | 'sicherheit';
  kategorieLabel: string;
  einheit: string;
  schaetzwert: string;
  schaetzwertKurz: string;
  rechenwertNorm: string;
  normBezug: string;
  bedeutungUndEinfluss: string;
  praxisWarnung?: string;
  einflussparameter: string[];
}

export const BEIWERTE_KATALOG: BeiwerterDetail[] = [
  // 1. KRIECHEN
  {
    id: 'phi',
    symbol: 'φ(∞, t0)',
    latexSymbol: '\\varphi(\\infty, t_0)',
    name: 'Endkriechzahl des Betons',
    category: 'kriechen',
    kategorieLabel: 'Kriechen',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: '1.5 – 3.0 (Hochbau: ~2.5, Brücken: ~1.8–2.0)',
    schaetzwert: 'Typischer Vordimensionierungswert: φ ≈ 2.0 bis 2.5 für Normalbeton (C30/37 bis C40/50). Für dicke Brückenquerschnitte (hohe wirksame Bauteildicke h₀ ≥ 500 mm) wird oft pauschal φ ≈ 1.8 geschätzt; für dünne Hochbaudecken in trockener Innenraumluft φ ≈ 2.8 bis 3.2.',
    rechenwertNorm: '\\varphi(\\infty, t_0) = \\varphi_0 \\cdot \\beta_c(\\infty, t_0) \\quad \\text{mit } \\varphi_0 = \\phi_{RH} \\cdot \\beta(f_{cm}) \\cdot \\beta(t_0)',
    normBezug: 'DIN EN 1992-1-1 (EC2), Abs. 3.1.4 & Anhang B.1',
    bedeutungUndEinfluss: 'Beschreibt das Verhältnis der zeitabhängigen Kriechdehnung zur elastischen Anfangsstauchung: ε_cc(∞) = φ · ε_c,el. Bestimmt die langfristige Durchbiegung (Zunahme um das 2,5- bis 3,5-fache) und ca. 8–15 % Spannkraftverlust.',
    praxisWarnung: 'Gilt nur für lineare Kriechtheorie bei Betondruckspannungen σ_c(t0) ≤ 0.45 f_ck(t0). Bei σ_c > 0.45 f_ck(t0) muss nichtlineares Kriechen mit dem Vergrößerungsfaktor exp(1.5(k_σ - 0.45)) angesetzt werden!',
    einflussparameter: [
      'Betonfestigkeitsklasse (f_cm): höhere Festigkeit → kleineres φ',
      'Belastungsalter t₀: frühes Belasten (t₀ = 3 d) verdoppelt φ gegenüber t₀ = 28 d',
      'Relative Luftfeuchte RH: Innenraum (50 %) ergibt ~50 % höheres φ als Außenluft (80 %)',
      'Wirksame Bauteildicke h₀ = 2 Ac / u: massige Bauteile kriechen deutlich langsamer'
    ]
  },
  {
    id: 'phi_rh',
    symbol: 'φ_RH',
    latexSymbol: '\\varphi_{RH}',
    name: 'Feuchtebeiwert der Kriechzahl',
    category: 'kriechen',
    kategorieLabel: 'Kriechen',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: 'Innenraum: 1.8 – 2.2 | Außenbereich: 1.1 – 1.4',
    schaetzwert: 'Für trockene Räume (RH = 50 %) ca. 1.95; für mitteleuropäische Außenluft (RH = 80 %) ca. 1.25 bis 1.35.',
    rechenwertNorm: '\\varphi_{RH} = 1 + \\frac{1 - RH/100}{0.1 \\cdot \\sqrt[3]{h_0}} \\quad (\\text{für } f_{cm} \\le 35\\text{ MPa})',
    normBezug: 'EC2 Gl. (B.3a) / Gl. (B.3b)',
    bedeutungUndEinfluss: 'Erfasst das Zusammenwirken aus Umgebungsfeuchte und Wasserabgabe unter Last. Trockene Umgebungen beschleunigen und vergrößern den Kriechvorgang erheblich.',
    einflussparameter: ['Relative Luftfeuchtigkeit RH (in %)', 'Wirksame Bauteildicke h₀ (in mm)']
  },
  {
    id: 'beta_t0',
    symbol: 'β(t₀)',
    latexSymbol: '\\beta(t_0)',
    name: 'Einflussbeiwert des Beton-Belastungsalters',
    category: 'kriechen',
    kategorieLabel: 'Kriechen',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: 't₀=3 d: ~0.85 | t₀=7 d: ~0.65 | t₀=28 d: ~0.48',
    schaetzwert: 'Bei Regelausschalung bzw. Vorspannung im Fertigteilwerk (t₀ ≈ 3–7 Tage) liegt β(t₀) um 0.65 bis 0.85. Bei Baustellen-Nachspannungen nach 28 Tagen sinkt der Beiwert auf ~0.48.',
    rechenwertNorm: '\\beta(t_0) = \\frac{1}{0.1 + (t_0)^{0.20}} \\quad (\\text{mit modifiziertem } t_{0,T} \\text{ bei Temperaturabweichung})',
    normBezug: 'EC2 Gl. (B.5)',
    bedeutungUndEinfluss: 'Je jünger der Zementstein beim Spannen, desto unvollständiger ist die C-S-H-Gitterbildung und desto plastischer deformiert sich das Mikrogefüge unter Druck.',
    praxisWarnung: 'Ein Vorspannen nach bereits 3 Tagen (z.B. bei Zyklusbeschleunigung) erhöht die Kriechverluste um 30–50 % gegenüber 14 oder 28 Tagen!',
    einflussparameter: ['Effektives Betonalter t₀ bei Erstbelastung (Tage)', 'Zementart (R/N/S via Alpha-Modifikator)']
  },
  {
    id: 'beta_fcm',
    symbol: 'β(f_cm)',
    latexSymbol: '\\beta(f_{cm})',
    name: 'Festigkeitsbeiwert des Krieches',
    category: 'kriechen',
    kategorieLabel: 'Kriechen',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: 'C25/30: ~3.0 | C35/45: ~2.5 | C50/60: ~2.1',
    schaetzwert: 'Nimmt monoton mit steigender Zylinderdruckfestigkeit ab. Für Standard-Spannbeton C45/55 ca. 2.25.',
    rechenwertNorm: '\\beta(f_{cm}) = \\frac{16.8}{\\sqrt{f_{cm}}} \\quad [f_{cm} \\text{ in MPa}]',
    normBezug: 'EC2 Gl. (B.4)',
    bedeutungUndEinfluss: 'Höherfester Beton besitzt einen dichteren Zementstein mit geringerer Kapillarporosität, wodurch der Fließwiderstand der adsorbierten Gelschichten zunimmt.',
    einflussparameter: ['Mittlere Druckfestigkeit f_cm = f_ck + 8 MPa']
  },

  // 2. SCHWINDEN
  {
    id: 'eps_cs',
    symbol: 'ε_cs(∞)',
    latexSymbol: '\\varepsilon_{cs}(\\infty)',
    name: 'Gesamtschwindmaß des Betons',
    category: 'schwinden',
    kategorieLabel: 'Schwinden',
    einheit: 'Stauchung [‰] bzw. [mm/m]',
    schaetzwertKurz: '-0.30 bis -0,55 ‰ (typ. -0.35 bis -0,40 ‰)',
    schaetzwert: 'Für Vordimensionierung im Hochbau: ε_cs ≈ -0,40 ‰ (-0,40 mm/m). Im feuchten Außenbereich (RH 80 %): ε_cs ≈ -0.25 bis -0,32 ‰. Im trockenen Innenbereich (RH 50 %): ε_cs ≈ -0.45 bis -0,55 ‰.',
    rechenwertNorm: '\\varepsilon_{cs}(\\infty) = \\varepsilon_{cd}(\\infty) + \\varepsilon_{ca}(\\infty) \\quad (\\text{Trocknungs- + Autogenschwinden})',
    normBezug: 'DIN EN 1992-1-1 (EC2), Abs. 3.1.4 (6) & Gl. (3.8)',
    bedeutungUndEinfluss: 'Volumenkontraktion ohne äußere Last durch Feuchteverlust und Hydratationsreaktion. Führt bei Spannstahl (Ep = 195.000 MPa) zu direkten Spannungsverlusten: Δε_p,s = ε_cs · Ep ≈ 60 bis 100 MPa (~4–8 % von P₀).',
    praxisWarnung: 'Autogenes Schwinden setzt sofort nach dem Erstarren ein und kann bei hochfestem Beton (C50/60 aufwärts) bis zu 50 % des Gesamtschwindens ausmachen!',
    einflussparameter: [
      'Betongüte f_ck (steuert autogenes Schwinden)',
      'Relative Luftfeuchte RH (steuert Trocknungsschwinden)',
      'Wirksame Bauteildicke h₀ (verzögert Austrocknung über Jahre)',
      'Zementklasse R / N / S'
    ]
  },
  {
    id: 'eps_ca',
    symbol: 'ε_ca(∞)',
    latexSymbol: '\\varepsilon_{ca}(\\infty)',
    name: 'Autogenes Schwindmaß (chemische Kontraktion)',
    category: 'schwinden',
    kategorieLabel: 'Schwinden',
    einheit: 'Stauchung [‰] bzw. [mm/m]',
    schaetzwertKurz: '-0.03 bis -0,10 ‰ (C35/45: -0,06 ‰, C60/75: -0,10 ‰)',
    schaetzwert: 'Bei Normalbetonen (C30/37) mit ~-0,05 ‰ gering, bei Hochleistungsbeton (C50/60 bis C90/105 mit niedrigem w/z < 0.40) stark ansteigend auf bis zu -0,15 ‰.',
    rechenwertNorm: '\\varepsilon_{ca}(\\infty) = 2.5 \\cdot (f_{ck} - 10) \\cdot 10^{-6} \\quad [\\text{für } f_{ck} \\ge 10\\text{ MPa}]',
    normBezug: 'EC2 Gl. (3.12)',
    bedeutungUndEinfluss: 'Entsteht durch Selbstaustrocknung (chemische Schrumpfung der Hydratphasen). Tritt unabhängig von der Luftfeuchtigkeit und auch unter Wasser auf.',
    einflussparameter: ['Charakteristische Zylinderdruckfestigkeit f_ck', 'Wasserzementwert w/z']
  },
  {
    id: 'eps_cd0',
    symbol: 'ε_cd,0',
    latexSymbol: '\\varepsilon_{cd,0}',
    name: 'Grundwert des Trocknungsschwindens',
    category: 'schwinden',
    kategorieLabel: 'Schwinden',
    einheit: 'Stauchung [‰]',
    schaetzwertKurz: 'Zementklasse N: ~0,45 ‰ | R: ~0,55 ‰ | S: ~0,35 ‰',
    schaetzwert: 'Für Standardzemente CEM I 42.5 N bei C35/45: ε_cd,0 ≈ 0,48 ‰; bei CEM I 52.5 R ca. 0,58 ‰.',
    rechenwertNorm: '\\varepsilon_{cd,0} = 0.85 \\cdot \\left[ (220 + 110 \\alpha_{ds1}) \\cdot \\exp\\left(-\\alpha_{ds2} \\frac{f_{cm}}{f_{cmo}}\\right) \\right] \\cdot 10^{-6} \\cdot \\beta_{RH}',
    normBezug: 'EC2 Anhang B.2, Gl. (B.11)',
    bedeutungUndEinfluss: 'Referenz-Schwindmaß für unendlich dünne Probekörper bei vollständiger Austrocknung.',
    einflussparameter: ['Zementart (Alpha_ds1,ds2)', 'Druckfestigkeit f_cm', 'Feuchtebeiwert beta_RH']
  },
  {
    id: 'kh',
    symbol: 'k_h',
    latexSymbol: 'k_h',
    name: 'Geometrie-Beiwert des Trocknungsschwindens',
    category: 'schwinden',
    kategorieLabel: 'Schwinden',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: 'h₀=100 mm: 1.00 | h₀=300 mm: 0.80 | h₀≥500 mm: 0.70',
    schaetzwert: 'Dünne Bauteile (h₀ ≤ 100 mm) trocknen voll durch → kh = 1.00. Massive Träger (h₀ = 400 mm) kh = 0.75; Brückenhohlkästen (h₀ ≥ 500 mm) kh = 0.70.',
    rechenwertNorm: 'k_h = 1.00 \\,(h_0 \\le 100) \\dots 0.70 \\,(h_0 \\ge 500\\text{ mm}) \\quad [\\text{Interpolation nach EC2 Tab. 3.3}]',
    normBezug: 'EC2 Tabelle 3.3',
    bedeutungUndEinfluss: 'Wasser diffundiert extrem langsam durch dichten Zementstein (Diffusionskoeffizient ~ 10⁻¹¹ m²/s). Im Kern massiver Träger bleibt Feuchte über Jahrzehnte gefangen.',
    einflussparameter: ['Wirksame Bauteildicke h₀ = 2 Ac / u (mm)']
  },

  // 3. STAHLRELAXATION
  {
    id: 'rho_1000',
    symbol: 'ρ₁₀₀₀',
    latexSymbol: '\\rho_{1000}',
    name: '1000-Stunden-Relaxationsverlust des Spannstahls',
    category: 'relaxation',
    kategorieLabel: 'Relaxation',
    einheit: 'Prozent [%]',
    schaetzwertKurz: 'Klasse 2 (niedrig): 2,5 % | Klasse 1 (Draht): 8,0 %',
    schaetzwert: 'In modernen Tragwerken wird nahezu ausschließlich Klasse 2 (kaltgezogene 7-drähtige Litzen mit abZ des DIBt) verbaut mit ρ₁₀₀₀ = 2,5 %. Ältere Konstruktionen oder Stäbe: Klasse 1 (ρ₁₀₀₀ ≈ 8,0 %) oder Klasse 3 (ρ₁₀₀₀ ≈ 4,0 %).',
    rechenwertNorm: '\\rho_{1000} = 2.5\\,\\% \\quad (\\text{Klasse 2, Normwert nach EC2 Abs. 3.3.2 (4)})',
    normBezug: 'DIN EN 1992-1-1 Abs. 3.3.2 & abZ des Spannstahls',
    bedeutungUndEinfluss: 'Gibt den Spannungsabfall im Spannstahl nach 1000 Stunden bei 20 °C und einer Anfangsspannung von 0.70 f_pk an.',
    praxisWarnung: 'Erwärmung im Bauzustand (z.B. Dampfhärtung bei 60–80 °C) beschleunigt die Relaxation massiv um das 2- bis 4-Fache!',
    einflussparameter: ['Spannstahlklasse (Klasse 1, 2 oder 3)', 'Prüftemperatur (Referenz: 20 °C)', 'Gefügebehandlung (Stabilisieren/Thermo-Mechanisch)']
  },
  {
    id: 'delta_sigma_pr_inf',
    symbol: 'Δσ_pr(∞)',
    latexSymbol: '\\Delta\\sigma_{pr}(\\infty)',
    name: 'Endwert des Relaxationsverlusts (bei t = 500.000 h)',
    category: 'relaxation',
    kategorieLabel: 'Relaxation',
    einheit: 'MPa bzw. N/mm² (oder % von σ_p0)',
    schaetzwertKurz: 'ca. 2.5 bis 3.0-facher Wert von ρ₁₀₀₀ (~4–8 % von σ_p0)',
    schaetzwert: 'Für typische Vorspannung σ_p0 = 0.75 f_pk (ca. 1395 MPa bei St 1660/1860): Langzeit-Relaxation ca. 40 bis 70 MPa (entspricht ~3–5 % Spannkraftverlust).',
    rechenwertNorm: '\\frac{\\Delta\\sigma_{pr}}{\\sigma_{pi}} = 0.66 \\cdot \\rho_{1000} \\cdot e^{9.1 \\mu} \\cdot \\left(\\frac{t}{1000}\\right)^{0.75 (1-\\mu)} \\cdot 10^{-5} \\quad \\text{mit } \\mu = \\frac{\\sigma_{pi}}{f_{pk}}',
    normBezug: 'EC2 Gl. (3.29) für Klasse 2',
    bedeutungUndEinfluss: 'Zeitabhängiger Abbau elastischer Atomgitterspannung durch Versetzungsbewegungen im Stahl bei starr festgehaltener Dehnung ε_p = const.',
    praxisWarnung: 'Die Formel reagiert exponentiell auf den Ausnutzungsgrad μ! Eine Erhöhung von μ = 0.70 auf μ = 0.80 verdoppelt den Relaxationsverlust!',
    einflussparameter: ['Ausnutzungsgrad μ = σ_pi / f_pk', 'Zeitdauer t (Norm-Endwert: 500.000 h ≈ 57 Jahre)', 'Relaxationsklasse des Stahls']
  },

  // 4. KOPPLUNG & ZEITABHÄNGIGKEIT (C+S+R)
  {
    id: 'delta_p_csr',
    symbol: 'ΔP_c+s+r(∞)',
    latexSymbol: '\\Delta P_{c+s+r}(\\infty)',
    name: 'Gekoppelter Langzeit-Spannkraftverlust',
    category: 'sicherheit',
    kategorieLabel: 'Gekoppelte Langzeitverluste',
    einheit: 'Prozent [% von P₀]',
    schaetzwertKurz: 'Hochbau: 12 – 18 % | Brückenbau: 15 – 22 %',
    schaetzwert: 'Typische Überschlagsgröße: 15 % für mäßig beanspruchte Träger, 20 % für schlanke weitgespannte Brückenträger mit hoher Dauerlast.',
    rechenwertNorm: '\\Delta\\sigma_{p,c+s+r} = \\frac{\\varepsilon_{cs} E_p + \\Delta\\sigma_{pr} + \\alpha_{\\varphi} \\varphi(t,t_0) \\sigma_{c,QP}}{1 + \\alpha_e \\frac{A_p}{A_c} \\left(1 + \\frac{A_c z_{cp}^2}{I_c}\\right) \\left(1 + 0.8 \\varphi(t,t_0)\\right)}',
    normBezug: 'DIN EN 1992-1-1 Abs. 5.10.6, Gl. (5.46)',
    bedeutungUndEinfluss: 'Die drei Mechanismen treten nicht unabhängig auf: Durch das Nachgeben des Betons (Kriechen + Schwinden) verkürzt sich der Stahl, wodurch seine Spannung sinkt. Eine geringere Stahlspannung verringert wiederum die nachfolgende Relaxation! Der Nenner in Gl. (5.46) erfasst diesen Rückkopplungseffekt.',
    einflussparameter: ['Spannstahl-E-Modul Ep (195.000 MPa)', 'Kriechzahl φ(t,t0)', 'Schwindmaß ε_cs', 'Betonspannung σ_c,QP auf Spanngliedhöhe']
  },
  {
    id: 'alpha_e',
    symbol: 'α_e',
    latexSymbol: '\\alpha_e = E_p / E_{cm}',
    name: 'Elastizitätsmodul-Verhältnis (Stahl / Beton)',
    category: 'elastisch',
    kategorieLabel: 'Elastizität',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: '5.5 bis 6.5 (C35/45: ~5.7, C50/60: ~5.3)',
    schaetzwert: 'Wird oft pauschal mit α_e ≈ 6.0 angenommen. Bei C35/45 (Ecm = 34.000 MPa, Ep = 195.000 MPa): α_e = 5.74.',
    rechenwertNorm: '\\alpha_e = \\frac{E_p}{E_{cm}} = \\frac{195.000\\text{ MPa}}{E_{cm}}',
    normBezug: 'EC2 Abs. 5.10.6 & Abs. 3.1.3',
    bedeutungUndEinfluss: 'Maß für die Steifigkeitskompatibilität. Bestimmt den Dehnungsverbund und den Umrechnungsfaktor im ideellen Querschnitt A_i = A_c + (α_e - 1) A_p.',
    einflussparameter: ['Spannstahlart (Litzen: 195 GPa, Stäbe: 205 GPa)', 'Betongüte (C30/37 bis C60/75)']
  },

  // 5. REIBUNG & KEILSCHLUPF
  {
    id: 'mu_reibung',
    symbol: 'μ',
    latexSymbol: '\\mu',
    name: 'Reibungsbeiwert im Hüllrohr',
    category: 'mechanisch',
    kategorieLabel: 'Reibung & Mechanik',
    einheit: '– [dimensionslos]',
    schaetzwertKurz: 'Stahl-Hüllrohr: 0,19 (EC2 Tab. 5.1) | Kunststoff: nach ETA | Monolitze: 0,05–0,07',
    schaetzwert: 'Normativer Standard-Rechenwert für gewellte Stahlblechhüllrohre mit Litzen: μ = 0,19 (dimensionslos, EC2 Tab. 5.1). Für Kunststoffhüllrohre gilt der Wert der ETA/Zulassung des Spannverfahrens.',
    rechenwertNorm: 'P(x) = P_0 \\cdot e^{-\\mu (\\theta + k \\cdot x)}',
    normBezug: 'DIN EN 1992-1-1 Abs. 5.10.5.2, Gl. (5.45) & Tab. 5.1',
    bedeutungUndEinfluss: 'Beschreibt den Reibungswiderstand des Spannglieds bei Umlenkungen (Winkelumlenkung θ). Zusammen mit dem ungewollten Knickbeiwert k bestimmt er die Spannkraftabnahme über die Trägerlänge.',
    praxisWarnung: 'Ungeschmierte oder korrodierte Hüllrohre können μ auf > 0.30 ansteigen lassen, was zu unzureichender Spannkraft in Feldmitte führt!',
    einflussparameter: ['Hüllrohrmaterial (verzinktes Stahlband vs. Kunststoffrohr)', 'Spannstahl-Oberfläche (glatt, profiliert, geölt)', 'Zustand der Rohre (trocken, befeuchtet)']
  },
  {
    id: 'k_ungewollt',
    symbol: 'k bzw. β',
    latexSymbol: 'k \\text{ bzw. } \\beta',
    name: 'Ungewollter Umlenkwinkel (Wobble-Beiwert / Knickbeiwert)',
    category: 'mechanisch',
    kategorieLabel: 'Reibung & Mechanik',
    einheit: 'rad/m bzw. m⁻¹',
    schaetzwertKurz: '0.005 bis 0.010 rad/m (typ. 0.007 rad/m ≈ 0.4°/m)',
    schaetzwert: 'Wird in statischen Berechnungen nach EC2 üblicherweise mit k = 0.005 bis 0.010 rad/m (oft k = 0.007 rad/m) angesetzt.',
    rechenwertNorm: 'k = 0.005 \\dots 0.010\\text{ rad/m} \\quad (\\text{nach Zulassung des Spannverfahrens})',
    normBezug: 'EC2 Abs. 5.10.5.2 (3)',
    bedeutungUndEinfluss: 'Erfasst unvermeidliche geometrische Verlegetoleranzen und Durchhang der Hüllrohre zwischen den Unterstützungsträgern während des Betonierens.',
    einflussparameter: ['Unterstützungsabstand der Hüllrohre (typ. 1,0 bis 1,5 m)', 'Steifigkeit des Rohres', 'Sorgfalt der Baustellen-Verlegung']
  },
  {
    id: 'delta_l_schlupf',
    symbol: 'Δl_s / w',
    latexSymbol: '\\Delta l_s \\text{ bzw. } w',
    name: 'Keilschlupf beim Verankern (Setzmaß)',
    category: 'mechanisch',
    kategorieLabel: 'Reibung & Mechanik',
    einheit: 'Millimeter [mm]',
    schaetzwertKurz: '4 – 8 mm (typ. 6 mm bei Keilverankerung)',
    schaetzwert: 'Typisches Setzmaß bei 3-teiligen Spannkeilen: Δl_s = 5 bis 7 mm. Bei Gewindestäben (z.B. SAS/Dywidag) nur 1 bis 2 mm (Mutterdrehung).',
    rechenwertNorm: 'l_{set} = \\sqrt{\\frac{w \\cdot E_p \\cdot A_p}{p}}, \\quad \\Delta P_{Anker} = 2 \\cdot p \\cdot l_{set}',
    normBezug: 'DIN EN 1992-1-1 Abs. 5.10.5.3 & Zulassung (ETA)',
    bedeutungUndEinfluss: 'Beim Lösen der Spannpresse ziehen sich die Spannkeile um wenige Millimeter in den Ankerkörper hinein, bis die Klemmpressung voll greift. Dies entspannt das Spannglied im Verankerungsbereich.',
    praxisWarnung: 'Bei kurzen Spanngliedern (L < 15 m) ist der Keilschlupfverlust dramatisch (bis zu 20 % Verlust auf ganzer Länge), weshalb hier oft Gewindestangen oder Nachkeilpressen eingesetzt werden!',
    einflussparameter: ['Verankerungsbauart (Keil, Mutter, Flachanker)', 'Vorspannverfahren (ETA-Zulassungskennwert)']
  },

  // 6. TEILSICHERHEITSBEIWERTE
  {
    id: 'gamma_p',
    symbol: 'γ_P,fav / γ_P,unfav',
    latexSymbol: '\\gamma_{P,fav} \\; / \\; \\gamma_{P,unfav}',
    name: 'Teilsicherheitsbeiwerte der Vorspannung im GZT',
    category: 'sicherheit',
    kategorieLabel: 'Sicherheitsbeiwerte & Normgrenzen',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: 'Günstig: 1.00 (oder 0.90) | Ungünstig: 1.00 (oder 1.20)',
    schaetzwert: 'Im Regelfall linearer Schnittgrößenermittlung nach EC2: γ_P = 1.00 sowohl für günstige als auch ungünstige Wirkungen (bei internen Spanngliedern).',
    rechenwertNorm: '\\gamma_{P,fav} = 1.00 \\quad (\\text{bzw. } 0.90 \\text{ bei Stabilitätsnachweisen}) \\\\ \\gamma_{P,unfav} = 1.00 \\quad (\\text{bzw. } 1.20 \\text{ bei Verankerungsausreißnachweis})',
    normBezug: 'DIN EN 1992-1-1 Abs. 2.4.2.2 & Abs. 5.10.8',
    bedeutungUndEinfluss: 'Sicherheitsfaktor auf die Vorspannwirkung im Grenzzustand der Tragfähigkeit (GZT). Da Vorspannung eine eingeprägte Zwangsverformung darstellt, wird sie im Querschnittsnachweis meist mit γ_P = 1.0 angesetzt.',
    einflussparameter: ['Verankerungsgrund / Nachweisart (Biegebemessung vs. Spaltzugnachweis)', 'Interner vs. externer Verbund']
  },
  {
    id: 'r_sup_inf',
    symbol: 'r_sup / r_inf',
    latexSymbol: 'r_{sup} \\; / \\; r_{inf}',
    name: 'Streubeizahlen der Vorspannkraft im GZG',
    category: 'sicherheit',
    kategorieLabel: 'Sicherheitsbeiwerte & Normgrenzen',
    einheit: 'dimensionslos [-]',
    schaetzwertKurz: 'r_sup = 1.05 – 1.10 | r_inf = 0.90 – 0.95',
    schaetzwert: 'Nach EC2 für nachträglichen Verbund: r_sup = 1.05 (oberer Kennwert) und r_inf = 0.95 (unterer Kennwert). Bei Vorspannung mit sofortigem Verbund (Spannbett): r_sup = 1.10 und r_inf = 0.90.',
    rechenwertNorm: 'P_{k,sup} = r_{sup} \\cdot P_m(t) \\quad \\text{und} \\quad P_{k,inf} = r_{inf} \\cdot P_m(t)',
    normBezug: 'DIN EN 1992-1-1 Abs. 5.10.9',
    bedeutungUndEinfluss: 'Erfasst die stochastische Streuung von Reibung, Keilschlupf, Beton-E-Modul und Spannstahlstreckgrenze im Gebrauchszustand (Dekompression, Rissbreite, Durchbiegung).',
    praxisWarnung: 'Dekompression und Rissfreiheit müssen zwingend mit dem unteren Wert P_k,inf nachgewiesen werden; die Betondruckspannung mit P_k,sup!',
    einflussparameter: ['Spanngliedtyp (sofortiger Verbund vs. nachträglicher Verbund vs. ohne Verbund)']
  }
];

export default function BeiwerteKatalog() {
  const [selectedFilter, setSelectedFilter] = useState<'alle' | 'kriechen' | 'schwinden' | 'relaxation' | 'mechanisch' | 'sicherheit'>('alle');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('phi');

  const filteredBeiwerte = BEIWERTE_KATALOG.filter((item) => {
    const matchesFilter = selectedFilter === 'alle' || item.category === selectedFilter;
    const matchesSearch =
      searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bedeutungUndEinfluss.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.normBezug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-home-grau/15 pb-4">
        <div>
          <h4 className="text-base font-bold text-text-main flex items-center gap-2">
            <Scale className="text-shiraz h-5 w-5" />
            Normative Beiwerte &amp; Phänomene: Schätzwerte vs. Rechenwerte
          </h4>
          <p className="text-xs text-text-main/70 mt-1">
            Systematische Gegenüberstellung von Vordimensionierungs-Schätzwerten, exakten Eurocode-2-Rechenformeln, Größenordnungen und baupraktischen Toleranzen
          </p>
        </div>
        <span className="self-start md:self-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          DIN EN 1992-1-1 / abZ Spannstahl
        </span>
      </div>

      {/* Didaktischer Erklärungskasten Schätzwert vs. Rechenwert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2">
          <div className="font-bold text-amber-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-700" />
            Was zeichnet Schätzwerte (Vordimensionierung) aus?
          </div>
          <p className="text-amber-950/80 leading-relaxed">
            In der Entwurfsphase liegen exakte Parameter (Betonfeuchte, Betonalter beim Spannen <InlineMath math="t_0" />, wirksame Bauteildicke <InlineMath math="h_0" />, Lieferant des Spannstahls) noch nicht vor. Ingenieure verwenden hier <strong>robuste Schätzgrößen</strong> (z.B. Endkriechzahl <InlineMath math="\varphi \approx 2{,}0" />, Gesamtschwindmaß <InlineMath math="\varepsilon_{cs} \approx -0{,}35\,\text{mm/m}" />, Langzeitverlust ca. 15–20 % von <InlineMath math="P_0" />), um die Querschnittsabmessungen und Spanngliedanzahl schnell festzulegen.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 space-y-2">
          <div className="font-bold text-blue-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-blue-700" />
            Was verlangt der normative Rechenwert (Ausführungsstatik)?
          </div>
          <p className="text-blue-950/80 leading-relaxed">
            Für die prüffähige Statik nach <strong>Eurocode 2 (DIN EN 1992-1-1)</strong> müssen die Beiwerte funktional aus den exakten Randbedingungen ermittelt werden: Feuchtebeiwert <InlineMath math="\varphi_{RH}" />, Festigkeitsbeiwert <InlineMath math="\beta(f_{cm})" />, Reifeentwicklung <InlineMath math="\beta(t_0)" />, Zeitbeiwert <InlineMath math="\beta_c(t, t_0)" /> sowie die gekoppelte Verlustgleichung (5,46). Sie bilden die juristisch verbindliche Nachweisgrundlage.
          </p>
        </div>
      </div>

      {/* Filterleiste */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap gap-1.5">
          <button aria-pressed={selectedFilter === 'alle'}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'alle'
                ? 'bg-shiraz text-white shadow-xs'
                : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
            }`}
            onClick={() => setSelectedFilter('alle')}
          >
            Alle Beiwerte ({BEIWERTE_KATALOG.length})
          </button>
          <button aria-pressed={selectedFilter === 'kriechen'}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'kriechen'
                ? 'bg-shiraz text-white shadow-xs'
                : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
            }`}
            onClick={() => setSelectedFilter('kriechen')}
          >
            Kriechen (φ)
          </button>
          <button aria-pressed={selectedFilter === 'schwinden'}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'schwinden'
                ? 'bg-shiraz text-white shadow-xs'
                : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
            }`}
            onClick={() => setSelectedFilter('schwinden')}
          >
            Schwinden (ε_cs)
          </button>
          <button aria-pressed={selectedFilter === 'relaxation'}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'relaxation'
                ? 'bg-shiraz text-white shadow-xs'
                : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
            }`}
            onClick={() => setSelectedFilter('relaxation')}
          >
            Stahlrelaxation (ρ, Δσ_pr)
          </button>
          <button aria-pressed={selectedFilter === 'mechanisch'}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'mechanisch'
                ? 'bg-shiraz text-white shadow-xs'
                : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
            }`}
            onClick={() => setSelectedFilter('mechanisch')}
          >
            Reibung &amp; Schlupf (μ, k, w)
          </button>
          <button aria-pressed={selectedFilter === 'sicherheit'}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'sicherheit'
                ? 'bg-shiraz text-white shadow-xs'
                : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
            }`}
            onClick={() => setSelectedFilter('sicherheit')}
          >
            Sicherheitsbeiwerte (γ_P, r)
          </button>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Suchen nach Symbol, Name, Formel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs px-3 py-1.5 rounded-lg border border-home-grau/30 bg-white focus:outline-none focus:ring-1 focus:ring-shiraz"
          />
        </div>
      </div>

      {/* Übersichtstabelle aller Beiwerte */}
      <div className="overflow-x-auto rounded-xl border border-home-grau/30 shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-off-white text-text-main border-b border-home-grau/30 font-bold">
              <th className="p-3 w-28">Symbol &amp; Name</th>
              <th className="p-3 w-28">Kategorie</th>
              <th className="p-3 w-52 bg-amber-50/50 text-amber-900 border-x border-home-grau/20">
                Praxis-Schätzwert (Größenordnung)
              </th>
              <th className="p-3 w-64 bg-blue-50/50 text-blue-900 border-r border-home-grau/20">
                Normativer Rechenwert (EC2-Formel / Vorgabe)
              </th>
              <th className="p-3">Wirkung &amp; physikalischer Einfluss</th>
              <th className="p-3 w-16 text-center">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-home-grau/20">
            {filteredBeiwerte.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <React.Fragment key={item.id}>
                  <tr
                    className={`hover:bg-off-white/80 transition-colors cursor-pointer ${
                      isExpanded ? 'bg-shiraz/5' : ''
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <td className="p-3 font-semibold text-text-main">
                      <div className="font-mono text-sm font-bold text-shiraz flex items-center gap-1.5">
                        <InlineMath math={item.latexSymbol} />
                      </div>
                      <div className="text-[11px] text-text-main/70 leading-tight mt-0.5">
                        {item.name}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-home-grau/15 text-text-main/80">
                        {item.kategorieLabel}
                      </span>
                      <div className="text-[10px] text-text-main/60 mt-1 font-mono">
                        {item.einheit}
                      </div>
                    </td>
                    <td className="p-3 bg-amber-50/30 font-semibold text-amber-950 border-x border-home-grau/20">
                      <div className="bg-amber-100/60 px-2 py-1 rounded text-amber-900 font-mono text-[11px] font-bold inline-block mb-1">
                        {item.schaetzwertKurz}
                      </div>
                      <div className="text-[11px] font-normal text-amber-900/80 leading-snug">
                        {item.schaetzwert.slice(0, 110)}...
                      </div>
                    </td>
                    <td className="p-3 bg-blue-50/30 text-blue-950 border-r border-home-grau/20">
                      <div className="bg-white/90 p-1.5 rounded border border-blue-200/60 font-mono text-[11px] text-blue-900 overflow-x-auto mb-1">
                        <InlineMath math={item.rechenwertNorm} />
                      </div>
                      <div className="text-[10px] text-blue-800/80 font-medium">
                        {item.normBezug}
                      </div>
                    </td>
                    <td className="p-3 text-text-main/80 leading-relaxed text-[11px]">
                      {item.bedeutungUndEinfluss.slice(0, 130)}...
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        aria-label="Details aufklappen"
                        className="p-1 rounded hover:bg-home-grau/20 text-shiraz font-bold"
                      >
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    </td>
                  </tr>

                  {/* Aufgeklappte Detailansicht */}
                  {isExpanded && (
                    <tr className="bg-[#fcfbf9] border-y border-shiraz/20">
                      <td colSpan={6} className="p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
                          {/* Linke Spalte: Schätzwert vs. Rechenwert ausführlich */}
                          <div className="lg:col-span-7 space-y-4">
                            <div className="bg-amber-50/90 p-4 rounded-xl border border-amber-200 space-y-2">
                              <h5 className="font-bold text-xs text-amber-950 flex items-center gap-1.5 uppercase tracking-wide">
                                <Clock className="h-4 w-4 text-amber-700" />
                                Praxis-Schätzwert &amp; Vordimensionierung:
                              </h5>
                              <p className="text-xs text-amber-900/90 leading-relaxed">
                                {item.schaetzwert}
                              </p>
                              <div className="text-[11px] font-mono font-bold text-amber-950 bg-white/70 px-2 py-1 rounded inline-block border border-amber-200">
                                Richtwert: {item.schaetzwertKurz} [{item.einheit}]
                              </div>
                            </div>

                            <div className="bg-blue-50/90 p-4 rounded-xl border border-blue-200 space-y-2">
                              <h5 className="font-bold text-xs text-blue-950 flex items-center gap-1.5 uppercase tracking-wide">
                                <CheckCircle2 className="h-4 w-4 text-blue-700" />
                                Exakter Rechenwert nach Norm ({item.normBezug}):
                              </h5>
                              <div className="bg-white p-3 rounded-lg border border-blue-200 overflow-x-auto text-center">
                                <BlockMath math={item.rechenwertNorm} />
                              </div>
                              <p className="text-xs text-blue-900/90 leading-relaxed">
                                {item.bedeutungUndEinfluss}
                              </p>
                            </div>
                          </div>

                          {/* Rechte Spalte: Einflussfaktoren & Praxiswarnungen */}
                          <div className="lg:col-span-5 space-y-4">
                            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs space-y-2.5">
                              <h5 className="font-bold text-xs text-text-main flex items-center gap-1.5 uppercase tracking-wide">
                                <TrendingDown className="h-4 w-4 text-shiraz" />
                                Primäre Einflussfaktoren auf den Beiwert:
                              </h5>
                              <ul className="space-y-1.5 text-xs text-text-main/80">
                                {item.einflussparameter.map((param, pIdx) => (
                                  <li key={pIdx} className="flex items-start gap-1.5">
                                    <span className="text-shiraz font-bold mt-0.5">•</span>
                                    <span>{param}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {item.praxisWarnung && (
                              <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                                <div className="font-bold flex items-center gap-1.5 text-rose-950">
                                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                                  Kritischer Baupraxis-Hinweis:
                                </div>
                                <p className="leading-relaxed text-[11px] text-rose-950/80">
                                  {item.praxisWarnung}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Synopse / Fazit Box */}
      <div className="bg-[#fcf8f2] p-4 rounded-xl border border-amber-200/60 text-xs text-amber-950/90 space-y-2">
        <div className="font-bold text-amber-950 flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-800" />
          Ingenieur-Fazit zur Handhabung von Schätz- und Rechenwerten im Spannbetonbau
        </div>
        <p className="leading-relaxed">
          Schätzwerte ermöglichen im frühen Entwurf eine zielsichere Bauteildimensionierung ohne aufwändige iterative Iterationsschritte. In der Ausführungsplanung verlangt <strong>DIN EN 1992-1-1 (Eurocode 2)</strong> jedoch zwingend die Auswertung der differenzierten physikalischen Formeln. Da bei Vorspannung bis zu <strong>25 % der Vorspannkraft durch zeitabhängige Vorgänge</strong> (<InlineMath math="\varphi" />, <InlineMath math="\varepsilon_{cs}" />, <InlineMath math="\Delta\sigma_{pr}" />) verloren gehen können, entscheidet die zutreffende Erfassung dieser Beiwerte direkt über die Dekompression, die Rissbreiten und die Gebrauchstauglichkeit des Bauwerks über 100 Jahre.
        </p>
      </div>
    </div>
  );
}
