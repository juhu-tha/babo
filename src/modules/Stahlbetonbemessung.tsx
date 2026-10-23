import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Box, 
  Scissors, 
  Columns, 
  CircleDashed, 
  GitCommit,
  Layers,
  Activity,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import SpannungDehnung from './SpannungDehnung';
import Biegebemessung from './Biegebemessung';
import Querkraftbemessung from './Querkraftbemessung';
import Stuetzenbemessung from './Stuetzenbemessung';
import Durchstanzen from './Durchstanzen';
import Verankerungslaenge from './Verankerungslaenge';
import Rissbreite from './Rissbreite';
import StahlbetonNullBisHundert from './stahlbeton/StahlbetonNullBisHundert';

export type BemessungSubTab = 
  | 'null_bis_hundert'
  | 'spannung'
  | 'biegebemessung' 
  | 'querkraftbemessung' 
  | 'stuetzenbemessung' 
  | 'durchstanzen' 
  | 'verankerungslaenge'
  | 'rissbreite'
  | 'ec2_generation2';


// Formeln je Reiter (aus den Unterrechnern zusammengeführt)
const FORMELN_JE_REITER: Partial<Record<BemessungSubTab, { formel: string; erklaerung: string; quelle?: string }[]>> = {
  spannung: [
          {
            formel: '\\sigma_c = f_{cd} \\cdot \\left[ 1 - \\left(1 - \\frac{\\varepsilon_c}{\\varepsilon_{c2}}\\right)^n \\right]',
            erklaerung: 'Bemessungsmodell Beton (Parabel-Rechteck-Diagramm nach Eurocode 2): σc ist die Betonspannung, fcd der Bemessungswert der Betondruckfestigkeit, εc2 die Dehnung bei Höchstspannung (2,0 ‰ für fck ≤ 50 MPa) und n der Exponent (2.0 für fck ≤ 50 MPa).',
            quelle: 'DIN EN 1992-1-1, 3.1.7'
          },
          {
            formel: '\\frac{\\sigma_c}{f_{cm}} = \\frac{k \\cdot \\eta - \\eta^2}{1 + (k - 2)\\eta}',
            erklaerung: 'Nichtlineares Spannungs-Dehnungs-Modell für Verformungsberechnungen nach EC2: η = εc / εc1, k = 1.05 · Ecm · |εc1| / fcm mit Sekantenmodul Ecm.',
            quelle: 'DIN EN 1992-1-1 Gl. (3.14)'
          },
          {
            formel: '\\sigma_s = E_s \\cdot \\varepsilon_s \\quad (\\varepsilon_s \\le \\varepsilon_{yd})',
            erklaerung: 'Hookesches Gesetz für Betonstahl mit E_s = 200 000 N/mm² bis zur Fließdehnung ε_yd = f_yd/E_s ≈ 2,17 ‰.',
            quelle: 'DIN EN 1992-1-1, 3.2.7'
          }
        ],
  biegebemessung: [
          {
            formel: 'A_{s,min} = \\frac{M_{cr}}{f_{yk} \\cdot z}',
            erklaerung: 'Mindestbewehrung als Robustheitsbewehrung nach DIN EN 1992-1-1/NA\nM_{cr}: Rissmoment des Querschnitts = f_{ctm} \\cdot b \\cdot h^2 / 6 [kNm]\nz: Innerer Hebelarm = 0{,}9 \\cdot d [m]\nf_{yk}: Charakteristische Streckgrenze des Stahls [MPa]. Die Standard-Formel 0,26 * (fctm/fyk) * b * d ist eine EC-Empfehlung (nicht DE).',
            quelle: 'DIN EN 1992-1-1/NA Abs. 9.2.1.1'
          },
          {
            formel: '\\mu_{Ed} = \\frac{M_{Ed}}{b \\cdot d^2 \\cdot f_{cd}}',
            erklaerung: 'Bezogenes Biegemoment\n\\mu_{Ed}: Bezogenes Biegemoment [-]\nf_{cd}: Bemessungswert der Betondruckfestigkeit [MPa]\nM_{Ed}: Einwirkendes Biegemoment [kNm]\nd: Statische Nutzhöhe (h - d₁) [m]\nb: Bauteilbreite [m]',
            quelle: 'DIN EN 1992-1-1 Abs. 6.1'
          },
          {
            formel: '\\omega = 1 - \\sqrt{1 - 2 \\cdot \\mu_{Ed}}',
            erklaerung: 'Mechanischer Bewehrungsgrad\n\\mu_{Ed}: Bezogenes Biegemoment [-]\n\\omega: Mechanischer Bewehrungsgrad [-]',
            quelle: 'DIN EN 1992-1-1 Abs. 6.1'
          },
          {
            formel: 'A_{s1} = \\omega \\cdot b \\cdot d \\cdot \\frac{f_{cd}}{f_{yd}}',
            erklaerung: 'Erforderliche Zugbewehrung\n\\omega: Mechanischer Bewehrungsgrad [-]\nb: Bauteilbreite [m]\nd: Statische Nutzhöhe [m]\nf_{cd}, f_{yd}: Bemessungswerte Festigkeit [MPa]\nA_{s1}: Zugbewehrungsquerschnitt [cm²]',
            quelle: 'DIN EN 1992-1-1 Abs. 6.1'
          }
        ],
  querkraftbemessung: [
          {
            formel: 'V_{Rd,c} = [C_{Rd,c} \\cdot k \\cdot (100 \\cdot \\rho_l \\cdot f_{ck})^{1/3}] \\cdot b_w \\cdot d',
            erklaerung: 'Bauteilwiderstand ohne Querkraftbewehrung nach NA DE\nV_{Rd,c}: Bemessungswert des Querkraftwiderstands ohne Querkraftbewehrung [kN]\nC_{Rd,c}: Beiwert (0.15 / \\gamma_c nach NA DE)\nk: Maßstabsfaktor (1 + \\sqrt{200/d} \\leq 2.0)\n\\rho_l: Längsbewehrungsgrad (A_{sl} / (b_w \\cdot d) \\leq 0.02)\nf_{ck}: Charakteristische Betondruckfestigkeit [N/mm²]\nb_w: Kleinste Querschnittsbreite in der Zugzone [mm]\nd: Statische Nutzhöhe [mm]',
            quelle: 'DIN EN 1992-1-1/NA Gl. (6.2aDE)'
          },
          {
            formel: 'V_{Rd,max} = \\frac{\\alpha_{cw} \\cdot b_w \\cdot z \\cdot \\nu_1 \\cdot f_{cd}}{\\cot(\\theta) + \\tan(\\theta)}',
            erklaerung: 'Maximale Querkrafttragfähigkeit (Druckstrebenversagen)\nV_{Rd,max}: Maximal aufnehmbare Querkraft [kN]\n\\alpha_{cw}: Beiwert für den Spannungszustand im Druckgurt (1,0 für unbewehrte Gurte)\nb_w: Stegbreite [mm]\nz: Hebelarm der inneren Kräfte [mm]\n\\nu_1: Abminderungsbeiwert für gerissenen Beton (0,75 nach NA DE)\nf_{cd}: Bemessungswert der Betondruckfestigkeit [N/mm²]\n\\theta: Druckstrebenneigungswinkel [°]',
            quelle: 'DIN EN 1992-1-1/NA Gl. (6.9)'
          },
          {
            formel: 'a_{sw} = \\frac{V_{Ed}}{z \\cdot f_{yd} \\cdot \\cot(\\theta)}',
            erklaerung: 'Erforderliche Querkraftbewehrung (Zugstrebenversagen)\na_{sw}: Erforderliche Querkraftbewehrung je Längeneinheit [cm²/m]\nV_{Ed}: Bemessungswert der einwirkenden Querkraft [kN]\nz: Hebelarm der inneren Kräfte [mm]\nf_{yd}: Bemessungswert der Streckgrenze der Querkraftbewehrung [N/mm²]\n\\theta: Druckstrebenneigungswinkel [°]',
            quelle: 'DIN EN 1992-1-1 Gl. (6.8)'
          },
          {
            formel: '\\rho_{w,min} = 0{,}16 \\cdot \\frac{f_{ctm}}{f_{yk}}',
            erklaerung: 'Mindestquerkraftbewehrungsgrad nach deutschem Nationalen Anhang (NA DE)\n\\rho_{w,min}: Mindestquerkraftbewehrungsgrad [-]\nf_{ctm}: Mittelwert der Betonzugfestigkeit [N/mm²]\nf_{yk}: Charakteristische Streckgrenze der Querkraftbewehrung [N/mm²]. Die europäische Empfehlung mit 0,08 * sqrt(fck) gilt in Deutschland nicht.',
            quelle: 'DIN EN 1992-1-1/NA Gl. (9.5N)'
          }
        ],
  stuetzenbemessung: [
          {
            erklaerung: "Mindestbewehrung für Stützen nach NA DE\nA_{s,min}: Mindestbewehrung [cm²]\nN_{Ed}: Bemessungswert der Normalkraft [kN]\nf_{yd}: Bemessungsstreckgrenze des Betonstahls [MPa]",
            formel: "A_{s,min} = \\frac{0{,}15 \\cdot |N_{Ed}|}{f_{yd}}"
          },
          {
            erklaerung: "Bemessungsmoment mit Mindestausmitte und Imperfektion\nM_{Ed,1}: Bemessungsmoment Theorie I. Ordnung [kNm]\ne_0: Mindestausmitte = \\max(h/30; 20\\text{ mm})\ne_i: Ungewollte Schiefstellung = l_0 / 400",
            formel: "M_{Ed,1} = \\max(M_{Ed}, N_{Ed} \\cdot e_0) + N_{Ed} \\cdot e_i"
          },
          {
            erklaerung: "Schlankheit und Grenzschlankheitskriterium\n\\lambda: Bauteilschlankheit = l_0 / i\ni: Trägheitsradius = h / \\sqrt{12}\n\\lambda_{lim}: Grenzschlankheit nach DIN EN 1992-1-1/NA, 5.8.3.1 für Theorie II. Ordnung",
            formel: "\\lambda = \\frac{l_0}{i} \\le \\lambda_{lim} = \\begin{cases} 25 & |n| \\ge 0{,}41 \\\\ 16/\\sqrt{|n|} & |n| < 0{,}41 \\end{cases}"
          }
        ],
  durchstanzen: [
          {
            erklaerung: "Einwirkende Durchstanz-Schubspannung\nv_{Ed}: Bemessungswert der einwirkenden Durchstanzspannung [MPa]\n\\beta: Beiwert zur Berücksichtigung der Lastexzentrizität (1,10 Innen-, 1,40 Rand-, 1,50 Eckstütze nach NA DE)\nV_{Ed}: Einwirkende Querkraft [kN]\nu_1: Länge des kritischen Rundschnitts im Abstand 2d [mm]\nd: Mittlere statische Nutzhöhe [mm]",
            formel: "v_{Ed} = \\frac{\\beta \\cdot V_{Ed}}{u_1 \\cdot d}"
          },
          {
            erklaerung: "Durchstanzwiderstand ohne Durchstanzbewehrung nach DIN EN 1992-1-1/NA\nv_{Rd,c}: Durchstanzwiderstand ohne Bewehrung [MPa]\nC_{Rd,c}: Beiwert (0{,}18 / \\gamma_c für u_0/d \\geq 4, sonst (0{,}18/\\gamma_c) \\cdot (0{,}1 \\cdot u_0/d + 0{,}6))\nk: Maßstabsfaktor (1 + \\sqrt{200/d} \\leq 2.0)\n\\rho_l: Mittlerer Längsbewehrungsgrad (\\leq 0.02)\nf_{ck}: Charakteristische Betondruckfestigkeit [MPa]",
            formel: "v_{Rd,c} = C_{Rd,c} \\cdot k \\cdot (100 \\cdot \\rho_l \\cdot f_{ck})^{1/3}"
          },
          {
            erklaerung: "Maximaler Durchstanzwiderstand nach NA DE\nv_{Rd,max}: Maximaler Durchstanzwiderstand im Rundschnitt u_1 [MPa]\nv_{Rd,c}: Durchstanzwiderstand ohne Bewehrung [MPa]. Der europäische Nachweis mit 0,4 * nu * fcd am Stützenrand entfällt in Deutschland.",
            formel: "v_{Rd,max} = 1{,}4 \\cdot v_{Rd,c}"
          }
        ],
  verankerungslaenge: [
          {
            erklaerung: "Bemessungswert der Verbundspannung\nf_bd: Bemessungswert der Verbundspannung [MPa]\nη₁: Beiwert für die Verbundbedingung (1.0 für gut, 0.7 für mäßig)\nη₂: Beiwert für den Stabdurchmesser (1.0 für ≤ 32 mm)\nf_ctd: Bemessungswert der Betonzugfestigkeit [MPa]",
            formel: "f_{bd} = 2{,}25 \\cdot \\eta_1 \\cdot \\eta_2 \\cdot f_{ctd}"
          },
          {
            erklaerung: "Grundwert der Verankerungslänge\nl_b,rqd: Grundwert der Verankerungslänge [mm]\nØ: Stabdurchmesser [mm]\nσ_sd: Bemessungswert der Stabspannung [MPa]\nf_bd: Bemessungswert der Verbundspannung [MPa]",
            formel: "l_{b,rqd} = \\frac{\\varnothing}{4} \\cdot \\frac{\\sigma_{sd}}{f_{bd}}"
          },
          {
            erklaerung: "Bemessungswert der Verankerungslänge\nα₁ bis α₅: Beiwerte für Form, Betondeckung, Querbewehrung, angeschweißte Querstäbe, Querdruck\nA_s,erf / A_s,vorh: Ausnutzungsverhältnis",
            formel: "l_{bd} = \\left(\\prod_{i=1}^5 \\alpha_i\\right) \\cdot l_{b,rqd} \\cdot \\frac{A_{s,erf}}{A_{s,vorh}} \\ge l_{b,min}"
          },
          {
            erklaerung: "Bemessungswert der Übergreifungslänge\nα₆: Beiwert für den Anteil gestoßener Stäbe",
            formel: "l_0 = \\left(\\prod_{i=1}^6 \\alpha_i\\right) \\cdot l_{b,rqd} \\cdot \\frac{A_{s,erf}}{A_{s,vorh}} \\ge l_{0,min}"
          }
        ],
  rissbreite: [
            {
              formel: 'w_{k} = s_{r,max} \\cdot (\\varepsilon_{sm} - \\varepsilon_{cm})',
              erklaerung: 'Charakteristische Rissbreite\nw_k: Berechnete charakteristische Rissbreite [mm]\ns_r,max: Maximaler Rissabstand [mm]\nε_sm: Mittlere Stahldehnung unter der relevanten Einwirkungskombination [-]\nε_cm: Mittlere Betondehnung zwischen den Rissen [-]',
              quelle: 'DIN EN 1992-1-1 Gl. (7.8)'
            },
            {
              formel: 's_{r,max} = \\min \\left( \\frac{\\varnothing}{3{,}6 \\cdot \\rho_{p,eff}} \\,;\\, \\frac{\\sigma_s \\cdot \\varnothing}{3{,}6 \\cdot f_{ct,eff}} \\right)',
              erklaerung: 'Maximaler Rissabstand nach deutschem Nationalem Anhang (NA DE).\nØ: Stabdurchmesser [mm]\nρ_p,eff: Effektiver Bewehrungsgrad (A_s / A_{c,eff}) [-]\nσ_s: Stahlspannung im Zustand II [MPa]\nf_ct,eff: Effektive Betonzugfestigkeit [MPa]. Die europäische EC-Empfehlung mit k3 und k4 gilt in Deutschland nicht.',
              quelle: 'DIN EN 1992-1-1/NA Gl. (7.11DE)'
            },
            {
              formel: 'A_{s,min} = k_c \\cdot k \\cdot f_{ct,eff} \\cdot \\frac{A_{ct}}{\\sigma_s}',
              erklaerung: 'Mindestbewehrung zur Begrenzung der Rissbreite nach DIN EN 1992-1-1/NA Abs. 7.3.2.\nk: Beiwert für nichtlineare Eigenspannungen aus kAsMin(h)\nk_c: Beiwert für die Spannungsverteilung vor der Erstrissbildung (0,4 bei Biegung)\nA_ct: Betonzugzone vor Erstrissbildung [mm²]\nσ_s: Maximal zulässige Stahlspannung unmittelbar nach Erstrissbildung [MPa]',
              quelle: 'DIN EN 1992-1-1/NA Abs. 7.3.2'
            },
            {
              formel: '\\varepsilon_{sm} - \\varepsilon_{cm} = \\frac{\\sigma_s - k_t \\cdot \\frac{f_{ct,eff}}{\\rho_{p,eff}} \\cdot (1 + \\alpha_e \\cdot \\rho_{p,eff})}{E_s} \\ge 0{,}6 \\cdot \\frac{\\sigma_s}{E_s}',
              erklaerung: 'Dehnungsdifferenz nach DIN EN 1992-1-1 Gl. (7.9).\nσ_s: Stahlspannung im gerissenen Zustand [MPa]\nk_t: Beiwert für Lasteinwirkungsdauer (0,6 für kurzzeitig, 0,4 für langzeitig)\nf_ct,eff: Effektive Betonzugfestigkeit [MPa]\nρ_p,eff: Effektiver Bewehrungsgrad (A_s / A_{c,eff}) [-]\nα_e: Modulverhältnis (E_s / E_{cm}) [-]\nE_s: Elastizitätsmodul des Betonstahls (200.000 MPa)',
              quelle: 'DIN EN 1992-1-1 Gl. (7.9)'
            }
          ],
};

export default function Stahlbetonbemessung({ initialTab }: { initialTab?: BemessungSubTab }) {
  const { activeTab, setActiveTab } = useTabContext();

  // Determine initial subtab based on prop, activeTab or window hash
  const getInitialSubTab = (): BemessungSubTab => {
    if (initialTab) return initialTab;
    if ((activeTab as string) === 'null_bis_hundert') return 'null_bis_hundert';
    if (activeTab === 'spannung') return 'spannung';
    if (activeTab === 'querkraftbemessung') return 'querkraftbemessung';
    if (activeTab === 'stuetzenbemessung') return 'stuetzenbemessung';
    if (activeTab === 'durchstanzen') return 'durchstanzen';
    if (activeTab === 'verankerungslaenge') return 'verankerungslaenge';
    if (activeTab === 'rissbreite') return 'rissbreite';
    if (activeTab === 'biegebemessung') return 'biegebemessung';

    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.toLowerCase().replace(/^#/, '');
      if (h.includes('0-100') || h.includes('null_bis_hundert') || h.includes('guide')) return 'null_bis_hundert';
      if (h.includes('spannung') || h.includes('dehnung')) return 'spannung';
      if (h.includes('querkraft')) return 'querkraftbemessung';
      if (h.includes('stuetz')) return 'stuetzenbemessung';
      if (h.includes('durchstanz')) return 'durchstanzen';
      if (h.includes('verankerung')) return 'verankerungslaenge';
      if (h.includes('riss')) return 'rissbreite';
      if (h.includes('bieg')) return 'biegebemessung';
    }
    return 'null_bis_hundert';
  };

  const [currentTab, setCurrentTab] = useState<BemessungSubTab>(getInitialSubTab);

  // Sync state if initialTab or activeTab changes from outside (e.g. search, quiz, cross-link)
  useEffect(() => {
    if (initialTab) setCurrentTab(initialTab);
    else if ((activeTab as string) === 'null_bis_hundert') setCurrentTab('null_bis_hundert');
    else if (activeTab === 'spannung') setCurrentTab('spannung');
    else if (activeTab === 'querkraftbemessung') setCurrentTab('querkraftbemessung');
    else if (activeTab === 'stuetzenbemessung') setCurrentTab('stuetzenbemessung');
    else if (activeTab === 'durchstanzen') setCurrentTab('durchstanzen');
    else if (activeTab === 'verankerungslaenge') setCurrentTab('verankerungslaenge');
    else if (activeTab === 'rissbreite') setCurrentTab('rissbreite');
    else if (activeTab === 'biegebemessung') setCurrentTab('biegebemessung');
  }, [initialTab, activeTab]);

  const handleTabChange = (tab: BemessungSubTab) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', `#${tab}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Central Header & Tab Selector Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Calculator className="text-shiraz h-6 w-6" />
              Stahlbeton (DIN EN 1992-1-1 / Eurocode 2)
            </h2>
            <p className="text-xs text-text-main/70 mt-1">
              Integrierte Werkstoffgesetze (Spannung-Dehnung) &amp; Bauteilbemessung nach DIN EN 1992-1-1 für Biegung, Querkraft, Stützen, Durchstanzen, Verankerung &amp; Rissbreite
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap">
            DIN EN 1992-1-1 + NA (DE)
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed mb-6">
          <p>
            Zentrales Berechnungsmodul für den Stahlbetonbau: Wählen Sie über die sieben Reiter das gewünschte 
            Thema nach DIN EN 1992-1-1 (Eurocode 2 mit deutschem Nationalen Anhang). 
            Das Modul umfasst die grundlegenden Werkstoffgesetze (Spannungs-Dehnungs-Diagramme für Beton und Betonstahl), 
            alle wesentlichen Nachweise im Grenzzustand der Tragfähigkeit (GZT: Biegung, Querkraft, 
            Stützen, Durchstanzen, Verankerungslänge) sowie im Grenzzustand der Gebrauchstauglichkeit (GZG: Rissbreitenbegrenzung 
            und Mindestbewehrung).
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-1 border-b border-home-grau/20">
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'null_bis_hundert'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('null_bis_hundert')}
          >
            <GraduationCap size={16} /> 0-100
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'spannung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('spannung')}
          >
            <Activity size={16} /> 1. Spannung-Dehnung (σ-ε)
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'biegebemessung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('biegebemessung')}
          >
            <Box size={16} /> 2. Biegebemessung
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'querkraftbemessung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('querkraftbemessung')}
          >
            <Scissors size={16} /> 3. Querkraftbemessung
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'stuetzenbemessung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('stuetzenbemessung')}
          >
            <Columns size={16} /> 4. Stützenbemessung
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'durchstanzen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('durchstanzen')}
          >
            <CircleDashed size={16} /> 5. Durchstanzen
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'verankerungslaenge'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('verankerungslaenge')}
          >
            <GitCommit size={16} /> 6. Verankerungslänge
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'rissbreite'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('rissbreite')}
          >
            <Layers size={16} /> 7. Rissbreite (GZG)
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'ec2_generation2'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('ec2_generation2')}
          >
            <Sparkles size={16} className="text-amber-500" /> 8. Eurocode 2 (2. Generation)
          </button>
        </div>
      </div>

      {/* Render Active Sub-Module */}
      <div className="transition-all duration-200">
        {currentTab === 'null_bis_hundert' && (
          <div className="animate-in fade-in duration-200">
            <StahlbetonNullBisHundert onNavigateTab={(tab) => handleTabChange(tab)} />
          </div>
        )}

        {currentTab === 'spannung' && (
          <div className="animate-in fade-in duration-200">
            <SpannungDehnung />
          </div>
        )}

        {currentTab === 'biegebemessung' && (
          <div className="animate-in fade-in duration-200">
            <Biegebemessung />
          </div>
        )}

        {currentTab === 'querkraftbemessung' && (
          <div className="animate-in fade-in duration-200">
            <Querkraftbemessung />
          </div>
        )}

        {currentTab === 'stuetzenbemessung' && (
          <div className="animate-in fade-in duration-200">
            <Stuetzenbemessung />
          </div>
        )}

        {currentTab === 'durchstanzen' && (
          <div className="animate-in fade-in duration-200">
            <Durchstanzen />
          </div>
        )}

        {currentTab === 'verankerungslaenge' && (
          <div className="animate-in fade-in duration-200">
            <Verankerungslaenge />
          </div>
        )}

        {currentTab === 'rissbreite' && (
          <div className="animate-in fade-in duration-200">
            <Rissbreite />
          </div>
        )}
        {currentTab === 'ec2_generation2' && (
          <div className="animate-in fade-in duration-200 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Normenentwicklung &amp; Stand 2026</span>
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mt-0.5">
                  <Sparkles className="text-amber-500 h-5 w-5" />
                  2. Generation des Eurocode 2 (EN 1992-1-1:2023, deutsche Fassung DIN EN 1992-1-1:2025-09; bauaufsichtliche Einführung manuell prüfen)
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Europäische Harmonisierung
              </span>
            </div>

            <p className="text-xs text-text-main/80 leading-relaxed">
              Die 2. Generation des Eurocode 2 (EN 1992-1-1:2023) führt fundamentale mechanische und 
              nachhaltigkeitsbezogene Weiterentwicklungen ein, die über die klassische Ausgabe 2004/2010 hinausgehen:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Querkraft */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">1. Geänderte Querkraftbemessung</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white rounded border border-home-grau/20 font-bold">V_Rd,c</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Ablösung des alten empirischen Ansatzes durch ein <strong>physikalisch geschlossenes Dehnungsfeldmodell (Kritische Rissöffnung / CSCT-Ansatz)</strong>. 
                  Die Querkrafttragfähigkeit von Bauteilen ohne Querkraftbewehrung berücksichtigt nun explizit den Maßstabseffekt d_dg (Größtkorn der Gesteinskörnung) 
                  und die Durchbiegungskrümmung.
                </p>
                <div className="p-2 bg-white rounded text-[11px] font-mono text-center border border-home-grau/15">
                  V_Rd,c = tau_Rd,c * b_w * d * f(d_dg, a_cs)
                </div>
              </div>

              {/* Durchstanzen */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">2. Durchstanzmodell (CSCT)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white rounded border border-home-grau/20 font-bold">V_Rd,c (Stütze)</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Vereinheitlichtes Durchstanzmodell basierend auf der <strong>Critical Shear Crack Theory (CSCT)</strong>. 
                  Der kritische Rundschnitt liegt nun bei <strong>d/2</strong> vom Stützenrand (vorher 2,0 d). Die Durchstanztragfähigkeit 
                  ist direkt an die Rotationsverformung der Platte gekoppelt.
                </p>
                <div className="p-2 bg-white rounded text-[11px] font-mono text-center border border-home-grau/15">
                  Rundschnitt: 0,5 d (statt bisher 2,0 d)
                </div>
              </div>

              {/* ERC */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">3. Expositions-Widerstand (ERC)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-bold">Exposure Resistance</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Einführung von <strong>Exposure Resistance Classes (ERC)</strong> für die performancebasierte Dauerhaftigkeitsbemessung 
                  anstelle starrer Mindestfestigkeitsklassen. Ermöglicht den gezielten Einsatz klinkerreduzierter, CO₂-armer Bindemittel 
                  bei gleichem Korrosionsschutz der Bewehrung.
                </p>
                <div className="p-2 bg-white rounded text-[11px] font-mono text-center border border-home-grau/15">
                  c_nom = c_min,dur(ERC) + Delta c_dev
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs text-text-main/80 space-y-2">
              <div className="font-bold text-text-main flex items-center gap-2">
                <Calculator size={15} className="text-shiraz" />
                Vergleichende Übergangsregelung im deutschen Bauordnungsrecht
              </div>
              <p className="text-[11px] leading-relaxed text-text-main/70">
                Die Bemessungsprogramme und Nachweise auf dieser Plattform rechnen im Regelfall mit der aktuell bauaufsichtlich über die Muster-Verwaltungsvorschrift Technische Baubestimmungen (MVV TB) verbindlich eingeführten Fassung <strong>DIN EN 1992-1-1:2011-01 + A1:2015 + DIN EN 1992-1-1/NA:2013-04</strong>. Die Neuregelungen der 2. Generation können als moderne Vergleichs- und Prognosewerte herangezogen werden.
              </p>
            </div>
          </div>
        )}
      </div>

      <ModulTest moduleId="stahlbeton" />

      <ModuleFooter
        wikipedia={[
          { title: 'Stahlbeton', url: 'https://de.wikipedia.org/wiki/Stahlbeton' },
          { title: 'Eurocode 2', url: 'https://de.wikipedia.org/wiki/Eurocode_2' },
          { title: 'Betonstahl', url: 'https://de.wikipedia.org/wiki/Betonstahl' },
          { title: 'Durchstanzen', url: 'https://de.wikipedia.org/wiki/Durchstanzen' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 + DIN EN 1992-1-1/NA:2013-04 (Eurocode 2, bauaufsichtlich eingeführt)' },
          { title: 'DIN EN 1992-1-1:2025-09 (Eurocode 2, 2. Generation – bauaufsichtliche Einführung manuell prüfen)' },
          { title: 'DIN 488-1:2009-08 (Betonstahl – Sorten, Eigenschaften, Kennzeichen)' },
          { title: 'DAfStb-Richtlinie Betonbauteile mit nichtmetallischer Bewehrung (2024-01)' }
        ]}
        literatur={[
          'Zilch, K.; Zehetmaier, G.: Bemessung im konstruktiven Betonbau. 2. Aufl., Berlin, Heidelberg: Springer 2010',
          'Goris, A. (Hrsg.): Stahlbetonbau-Praxis nach Eurocode 2, Band 1 und 2. Berlin: Beuth 2023 (Auflage manuell prüfen)',
          'DAfStb-Heft 600: Erläuterungen zu DIN EN 1992-1-1 und DIN EN 1992-1-1/NA (Ausgabe manuell prüfen)',
          'Bargel, H.-J.; Schulze, G. (Hrsg.): Werkstoffkunde. Berlin: Springer Vieweg (Auflage manuell prüfen)'
        ]}
        formeln={FORMELN_JE_REITER[currentTab] ?? []}
      />
    </div>
  );
}
