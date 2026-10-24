import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Activity, Scale, Sliders, BookOpen, Layers, 
  TrendingUp, CheckCircle2, Sparkles,
  Clock, Timer, Compass, MoveHorizontal
} from 'lucide-react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath, BlockMath } from 'react-katex';

interface MaterialData {
  id: string;
  name: string;
  kategorie: 'Metall' | 'Mineralisch' | 'Organisch' | 'Verbund' | 'Glas';
  E: number; // MPa
  nu: number; // Querdehnzahl [-]
  fy: number; // Streckgrenze / Druckfestigkeit MPa
  fu: number; // Zugfestigkeit MPa
  epsBreak: number; // Bruchdehnung %
  dichte: number; // kg/m³
  alphaT: number; // 10^-6 / K
  phiKriechen?: number; // typische Kriechzahl
  epsSchwinden?: number; // typisches Endschwindmaß in ‰
  beschreibung: string;
}

const MATERIALIEN: Record<string, MaterialData> = {
  s235: {
    id: 's235',
    name: 'Baustahl S235JR',
    kategorie: 'Metall',
    E: 210000,
    nu: 0.30,
    fy: 235,
    fu: 360,
    epsBreak: 26.0,
    dichte: 7850,
    alphaT: 12.0,
    phiKriechen: 0.0, // bei Raumtemperatur vernachlässigbar
    epsSchwinden: 0.0,
    beschreibung: 'Duktiler Standard-Baustahl mit ausgeprägter Fließgrenze, konstanter Dehnsteifigkeit und hoher Verformungsreserve.'
  },
  s355: {
    id: 's355',
    name: 'Baustahl S355J2',
    kategorie: 'Metall',
    E: 210000,
    nu: 0.30,
    fy: 355,
    fu: 510,
    epsBreak: 22.0,
    dichte: 7850,
    alphaT: 12.0,
    phiKriechen: 0.0,
    epsSchwinden: 0.0,
    beschreibung: 'Höherfester Konstruktionsbaustahl für schlanke Tragwerke im Hoch- und Brückenbau mit identischem E-Modul wie S235.'
  },
  beton_c30: {
    id: 'beton_c30',
    name: 'Normalbeton C30/37',
    kategorie: 'Mineralisch',
    E: 33000,
    nu: 0.20,
    fy: 38, // mittlere Zylinderdruckfestigkeit fcm
    fu: 2.9, // fctm
    epsBreak: 0.35, // Bruchdehnung Druck ca. 3,5 ‰
    dichte: 2400,
    alphaT: 10.0,
    phiKriechen: 2.2, // Kriechzahl φ ca. 2,0 bis 2,5
    epsSchwinden: -0.45, // ca. -0,45 ‰
    beschreibung: 'Sprödes, heterogenes Mehrphasenmaterial. Zeigt ausgeprägtes Kriechen und Schwinden über Monate bis Jahre.'
  },
  holz_c24: {
    id: 'holz_c24',
    name: 'Nadelholz C24 (parallel)',
    kategorie: 'Organisch',
    E: 11000,
    nu: 0.05,
    fy: 21, // fc0k
    fu: 14.5, // ft0k
    epsBreak: 0.8,
    dichte: 420,
    alphaT: 5.0,
    phiKriechen: 0.8, // k_def Beiwert 0,6 bis 2,0
    epsSchwinden: -0.20, // hygroskopisches Schwindmaß parallel zur Faser
    beschreibung: 'Anisotroper Naturbaustoff mit hoher spezifischer Steifigkeit längs zur Faser und Feuchtekriechen (k_def).'
  },
  alu_6060: {
    id: 'alu_6060',
    name: 'Aluminium EN AW-6060 T6',
    kategorie: 'Metall',
    E: 70000,
    nu: 0.33,
    fy: 160, // Rp0,2
    fu: 215,
    epsBreak: 12.0,
    dichte: 2700,
    alphaT: 23.0,
    phiKriechen: 0.0,
    epsSchwinden: 0.0,
    beschreibung: 'Leichtmetall mit geringem E-Modul (1/3 des Stahls), aber hervorragender Korrosionsbeständigkeit.'
  },
  glas_float: {
    id: 'glas_float',
    name: 'Bauglas (Kalk-Natron-Floatglas)',
    kategorie: 'Glas',
    E: 70000,
    nu: 0.23,
    fy: 800, // theoretische Druckfestigkeit
    fu: 45, // Biegezugfestigkeit Floatglas
    epsBreak: 0.1,
    dichte: 2500,
    alphaT: 9.0,
    phiKriechen: 0.0,
    epsSchwinden: 0.0,
    beschreibung: 'Vollkommen linear-elastisches, ideal sprödes Material ohne plastische Fließzone und ohne Kriechverformung.'
  },
  cfk_lamelle: {
    id: 'cfk_lamelle',
    name: 'CFK-Lamelle (Carbonfaserverstärkt)',
    kategorie: 'Verbund',
    E: 165000,
    nu: 0.30,
    fy: 2800,
    fu: 2800,
    epsBreak: 1.7,
    dichte: 1600,
    alphaT: -0.2,
    phiKriechen: 0.05,
    epsSchwinden: 0.0,
    beschreibung: 'Hochleistungs-Verbundwerkstoff für die nachträgliche Bauwerksverstärkung im Bestand mit extrem geringer Relaxation.'
  }
};

export default function MechanischeKenngroessen() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'hooke_emodul' | 'steifigkeiten' | 'kriechen_schwinden' | 'simulator' | 'matrix' | 'beispiele'>('grundlagen');

  // Simulator State
  const [materialKey, setMaterialKey] = useState<string>('s235');
  const [lastArt, setLastArt] = useState<'zug' | 'druck'>('zug');
  const [kraftKn, setKraftKn] = useState<number>(80);
  const [stabLaengeM, setStabLaengeM] = useState<number>(3.0);
  const [querschnittTyp, setQuerschnittTyp] = useState<'rund' | 'rechteck'>('rund');
  const [durchmesserMm, setDurchmesserMm] = useState<number>(25);
  const [breiteMm, setBreiteMm] = useState<number>(30);
  const [hoeheMm, setHoeheMm] = useState<number>(30);

  // Kriech-Simulator State
  const [kriechZahl, setKriechZahl] = useState<number>(0.0);
  const [schwindMassPromille, setSchwindMassPromille] = useState<number>(0.0);
  const [relaxDauerTage, setRelaxDauerTage] = useState<number>(1000);

  // Rheologie-Labor State (Tab 4: Kriechen vs. Relaxieren)
  const [rheoModus, setRheoModus] = useState<'relaxieren' | 'kriechen'>('relaxieren');
  const [rheoTauSec, setRheoTauSec] = useState<number>(2.5);
  const [rheoWert0, setRheoWert0] = useState<number>(10); // MPa bzw. Promille

  const mat = MATERIALIEN[materialKey] || MATERIALIEN['s235'];

  // Material-Auswahl mit automatischer Synchronisation typischer Kriech- & Schwindbeiwerte
  const handleSelectMaterial = (key: string) => {
    setMaterialKey(key);
    const m = MATERIALIEN[key];
    if (m) {
      setKriechZahl(m.phiKriechen ?? 0);
      setSchwindMassPromille(Math.abs(m.epsSchwinden ?? 0));
    }
  };

  // Berechnungen für den Simulator, Steifigkeiten & Stabilität
  const sim = useMemo(() => {
    // 1. Querschnittsfläche A0 & Flächenträgheitsmomente I
    let A0_mm2 = 0;
    let d0_mm = 0;
    let I_y_mm4 = 0;
    let I_z_mm4 = 0;
    let I_min_mm4 = 0;

    if (querschnittTyp === 'rund') {
      A0_mm2 = (Math.PI * Math.pow(durchmesserMm, 2)) / 4;
      d0_mm = durchmesserMm;
      I_y_mm4 = (Math.PI * Math.pow(durchmesserMm, 4)) / 64;
      I_z_mm4 = I_y_mm4;
      I_min_mm4 = I_y_mm4;
    } else {
      A0_mm2 = breiteMm * hoeheMm;
      d0_mm = Math.min(breiteMm, hoeheMm);
      // I bzgl. starker Achse y: b * h³ / 12, schwache Achse z: h * b³ / 12
      I_y_mm4 = (breiteMm * Math.pow(hoeheMm, 3)) / 12;
      I_z_mm4 = (hoeheMm * Math.pow(breiteMm, 3)) / 12;
      I_min_mm4 = Math.min(I_y_mm4, I_z_mm4);
    }

    const I_mm4 = I_y_mm4;

    // 2. Dehnsteifigkeit EA & Biegesteifigkeit EI
    const EA_N = mat.E * A0_mm2; // N
    const EA_kN = EA_N / 1000; // kN
    const EA_MN = EA_N / 1e6; // MN

    const EI_Nmm2 = mat.E * I_mm4; // N*mm²
    const EI_kNm2 = EI_Nmm2 / 1e9; // kNm²
    const EI_min_kNm2 = (mat.E * I_min_mm4) / 1e9; // kNm²

    // Federsteifigkeit des Längsstabs: c = EA / L
    const L0_mm = stabLaengeM * 1000;
    const federsteifigkeit_N_mm = EA_N / L0_mm; // N/mm (oder kN/m)
    const federsteifigkeit_kN_m = federsteifigkeit_N_mm;

    // Biegung Einfeldträger unter Einzellast F in Feldmitte: w_max = F * L³ / (48 * EI)
    const F_N = (lastArt === 'zug' ? kraftKn : -kraftKn) * 1000;
    const absF_N = Math.abs(F_N);
    const biegedurchbiegung_mm = (absF_N * Math.pow(L0_mm, 3)) / (48 * EI_Nmm2);

    // 3. Normalspannung sigma = F / A (in MPa = N/mm²)
    const sigma = F_N / A0_mm2;
    const absSigma = Math.abs(sigma);

    // 4. Differenzierung spröder vs. duktiler Werkstoffe & Grenzfestigkeiten
    const isSproede = mat.kategorie === 'Mineralisch' || mat.kategorie === 'Glas';
    let zulSpannung = 0;
    let fliessGrenze = 0;

    if (lastArt === 'zug') {
      zulSpannung = mat.fu; // Zugfestigkeit fctm / fu
      fliessGrenze = isSproede ? mat.fu : mat.fy; // Spröde Stoffe besitzen keine plastische Fließgrenze
    } else {
      zulSpannung = mat.fy; // Druckfestigkeit fcm / fc0k / fy
      fliessGrenze = mat.fy;
    }

    const auslastungFestigkeit = (absSigma / (zulSpannung || 1)) * 100;
    const auslastungFliess = (absSigma / (fliessGrenze || 1)) * 100;

    const isPlastisch = !isSproede && absSigma > fliessGrenze && absSigma <= zulSpannung;
    const isVersagt = absSigma > zulSpannung;

    // 5. Knicknachweis nach Euler (Stabilitätsprüfung bei Druck)
    // Pendelstab (Euler-Fall 2: beta = 1.0)
    const betaKnick = 1.0;
    const F_K_N = (Math.pow(Math.PI, 2) * mat.E * I_min_mm4) / Math.pow(betaKnick * L0_mm, 2);
    const F_K_kN = F_K_N / 1000;
    const knickAuslastung = lastArt === 'druck' ? (kraftKn / (F_K_kN || 0.001)) * 100 : 0;
    const isKnickGefaehrdet = lastArt === 'druck' && kraftKn > F_K_kN;

    // 6. Dehnung epsilon = sigma / E (linear-elastisch nach Hooke)
    const epsilon = sigma / mat.E; // [-]
    const epsilonPromille = epsilon * 1000; // ‰
    const epsilonProzent = epsilon * 100; // %

    // 7. Längenänderung Delta L = epsilon * L0 = (F * L0) / (E * A)
    const deltaL_mm = (F_N * L0_mm) / EA_N;
    const endLaenge_mm = L0_mm + deltaL_mm;

    // 8. Querdehnung epsilon_q = -nu * epsilon
    const epsilonQ = -mat.nu * epsilon;
    const deltaD_mm = epsilonQ * d0_mm;
    const endD_mm = d0_mm + deltaD_mm;

    // 9. Elastische Formänderungsenergie (Federarbeit) U = 0.5 * F * Delta L
    const U_Joule = 0.5 * (absF_N * (Math.abs(deltaL_mm) / 1000));

    // 10. Schubmodul G & Kompressionsmodul K
    const G_MPa = mat.E / (2 * (1 + mat.nu));
    const K_MPa = mat.E / (3 * (1 - 2 * mat.nu));

    // 11. Langzeitkriechen (Kriechdehnung & Kriechstauchung)
    const effEModulKriechen = mat.E / (1 + kriechZahl);
    const deltaL_kriechen_mm = deltaL_mm * kriechZahl; // zusätzliche Verformung durch Kriechen
    const deltaL_elastisch_plus_kriechen_mm = deltaL_mm * (1 + kriechZahl);

    // 12. Schwindverkürzung Delta L_s
    const deltaL_schwinden_mm = -(schwindMassPromille / 1000) * L0_mm;

    // 13. Gesamtverformung nach Kriechen & Schwinden
    const deltaL_gesamt_mm = deltaL_elastisch_plus_kriechen_mm + deltaL_schwinden_mm;
    const endLaengeGesamt_mm = L0_mm + deltaL_gesamt_mm;

    // 14. Spannungsrelaxation (Maxwell Modell): sigma(t) = sigma0 * exp(-t / tau)
    const tauRelax = 250; // Tage (Modellwert)
    const sigmaRelaxiert = absSigma * Math.exp(-relaxDauerTage / tauRelax);
    const relaxVerlustProzent = ((absSigma - sigmaRelaxiert) / (absSigma || 1)) * 100;

    // Stabmasse
    const volumen_m3 = (A0_mm2 / 1e6) * stabLaengeM;
    const masse_kg = volumen_m3 * mat.dichte;

    return {
      A0_mm2,
      d0_mm,
      I_mm4,
      I_y_mm4,
      I_z_mm4,
      I_min_mm4,
      EA_kN,
      EA_MN,
      EI_kNm2,
      EI_min_kNm2,
      federsteifigkeit_kN_m,
      biegedurchbiegung_mm,
      sigma,
      absSigma,
      zulSpannung,
      fliessGrenze,
      auslastungFestigkeit,
      auslastungFliess,
      isSproede,
      isPlastisch,
      isVersagt,
      F_K_kN,
      knickAuslastung,
      isKnickGefaehrdet,
      epsilon,
      epsilonPromille,
      epsilonProzent,
      deltaL_mm,
      endLaenge_mm,
      epsilonQ,
      deltaD_mm,
      endD_mm,
      U_Joule,
      G_MPa,
      K_MPa,
      effEModulKriechen,
      deltaL_kriechen_mm,
      deltaL_elastisch_plus_kriechen_mm,
      deltaL_schwinden_mm,
      deltaL_gesamt_mm,
      endLaengeGesamt_mm,
      sigmaRelaxiert,
      relaxVerlustProzent,
      masse_kg
    };
  }, [mat, lastArt, kraftKn, stabLaengeM, querschnittTyp, durchmesserMm, breiteMm, hoeheMm, kriechZahl, schwindMassPromille, relaxDauerTage]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Scale className="text-shiraz" /> Mechanische Kenngrößen: Spannung, Dehnung &amp; Steifigkeit
          </h2>
          <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-3 py-1 rounded-full border border-shiraz/20">
            Elastostatik, Rheologie &amp; Werkstoffmechanik
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 leading-relaxed">
          <p>
            Mechanische Kenngrößen bilden das Fundament der Baustatik und Tragwerkslehre. 
            Neben den Kurzzeit-Größen <strong>Spannung (<InlineMath math="\sigma, \tau" />)</strong>, 
            <strong> Dehnung (<InlineMath math="\varepsilon" />)</strong>, <strong>E-Modul (<InlineMath math="E" />)</strong>, 
            <strong> Dehnsteifigkeit (<InlineMath math="EA" />)</strong> und <strong>Biegesteifigkeit (<InlineMath math="EI" />)</strong> 
            prägen zeitabhängige rheologische Prozesse wie <strong>Kriechen</strong>, <strong>Schwinden</strong> und 
            <strong> Relaxation</strong> die Dauerhaftigkeit und Gebrauchstauglichkeit moderner Tragwerke.
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button aria-pressed={activeTab === 'grundlagen'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'grundlagen'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('grundlagen')}
          >
            <Activity size={16} /> 1. Spannung &amp; Dehnung
          </button>
          <button aria-pressed={activeTab === 'hooke_emodul'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'hooke_emodul'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('hooke_emodul')}
          >
            <Sparkles size={16} /> 2. E-Modul &amp; Hooke
          </button>
          <button aria-pressed={activeTab === 'steifigkeiten'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steifigkeiten'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steifigkeiten')}
          >
            <MoveHorizontal size={16} /> 3. Dehn- &amp; Biegesteifigkeit (EA &amp; EI)
          </button>
          <button aria-pressed={activeTab === 'kriechen_schwinden'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'kriechen_schwinden'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('kriechen_schwinden')}
          >
            <Clock size={16} /> 4. Kriechen, Schwinden &amp; Relaxation
          </button>
          <button aria-pressed={activeTab === 'simulator'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('simulator')}
          >
            <Sliders size={16} /> 5. Interaktiver Simulator
          </button>
          <button aria-pressed={activeTab === 'matrix'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('matrix')}
          >
            <Layers size={16} /> 6. Werkstoff-Matrix
          </button>
          <button aria-pressed={activeTab === 'beispiele'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'beispiele'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('beispiele')}
          >
            <BookOpen size={16} /> 7. Praxis-Beispiele
          </button>
        </div>
      </div>

      {/* TAB 1: GRUNDLAGEN (Spannung & Dehnung) */}
      {activeTab === 'grundlagen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Spannung */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                  <Scale className="text-shiraz" size={18} /> 1. Was ist Spannung (<InlineMath math="\sigma, \tau" />)?
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Spannung ist die auf eine infinitesimale Querschnittsfläche bezogene Schnittkraft. Sie misst die 
                  <strong> innere Beanspruchungsintensität</strong> eines Körpers unter äußerer Last.
                </p>

                <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4 space-y-2">
                  <div className="text-xs font-bold text-text-main">Normalspannung (Zug/Druck senkrecht zur Fläche):</div>
                  <BlockMath math="\sigma = \frac{F_N}{A_0} \quad \left[\frac{\text{N}}{\text{mm}^2} = \text{MPa}\right]" />
                  <div className="text-xs font-bold text-text-main pt-1">Schubspannung (Tangential zur Schnittfläche):</div>
                  <BlockMath math="\tau = \frac{V}{A_0} \quad \left[\frac{\text{N}}{\text{mm}^2} = \text{MPa}\right]" />
                </div>

                <div className="space-y-2 text-xs text-text-main/80">
                  <div><strong>Technische vs. wahre Spannung:</strong></div>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-text-main/75">
                    <li><strong>Technische Spannung (<InlineMath math="\sigma_{\text{eng}}" />):</strong> Kraft bezogen auf den unberührten Ausgangsquerschnitt <InlineMath math="A_0" />. Standard für den Ingenieurbau nach DIN EN ISO 6892-1.</li>
                    <li><strong>Wahre Spannung (<InlineMath math="\sigma_{\text{true}}" />):</strong> Kraft bezogen auf den aktuellen, sich einschnürenden Querschnitt <InlineMath math="A(t)" />: <InlineMath math="\sigma_{\text{true}} = \sigma_{\text{eng}} (1 + \varepsilon_{\text{eng}})" />.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono">
                Einheiten-Konvention: 1 MPa = 1 N/mm² = 1 MN/m² = 10 bar = 1000 kN/m²
              </div>
            </div>

            {/* Box 2: Dehnung */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                  <Activity className="text-shiraz" size={18} /> 2. Was ist Dehnung (<InlineMath math="\varepsilon" />)?
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Die Dehnung ist die relative Längenänderung bezogen auf die Ausgangslänge <InlineMath math="L_0" />. 
                  Sie ist eine dimensionslose Verhältniszahl und quantifiziert die geometrische Verzerrung.
                </p>

                <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4 space-y-2">
                  <div className="text-xs font-bold text-text-main">Technische Ingenieurdehnung:</div>
                  <BlockMath math="\varepsilon = \frac{\Delta L}{L_0} = \frac{L - L_0}{L_0} \quad [-] \text{ oder } [\%] \text{ bzw. } [\text{‰}]" />
                  <div className="text-xs font-bold text-text-main pt-1">Logarithmische (wahre) Dehnung:</div>
                  <BlockMath math="\varepsilon_{\text{true}} = \int_{L_0}^{L} \frac{dL}{L} = \ln\left(\frac{L}{L_0}\right) = \ln(1 + \varepsilon)" />
                </div>

                <div className="space-y-2 text-xs text-text-main/80">
                  <div><strong>Elastisch vs. Plastisch:</strong></div>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-text-main/75">
                    <li><strong>Elastische Dehnung (<InlineMath math="\varepsilon_{\text{el}}" />):</strong> Vollständig reversibel. Nach Entlastung kehren die Atome in ihre Ruhelage zurück.</li>
                    <li><strong>Plastische Dehnung (<InlineMath math="\varepsilon_{\text{pl}}" />):</strong> Bleibende Gefügeverformung infolge Versetzungsbewegungen im Kristallgitter.</li>
                    <li><strong>Gesamtdehnung:</strong> <InlineMath math="\varepsilon_{\text{tot}} = \varepsilon_{\text{el}} + \varepsilon_{\text{pl}}" />.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono">
                Umrechnung: 1 ‰ = 0,001 = 0,1 % = 1 mm/m Verformung
              </div>
            </div>

          </div>

          {/* Querdehnung & Poisson-Effekt */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <Sparkles className="text-shiraz" size={18} /> 3. Querdehnung &amp; Poisson-Zahl (<InlineMath math="\nu" />)
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 text-xs text-text-main/80 space-y-3">
                <p className="leading-relaxed">
                  Wird ein Stab in Längsrichtung gedehnt (<InlineMath math="\varepsilon_{\text{ax}} > 0" />), verengt sich sein Querschnitt 
                  senkrecht zur Belastungsachse (<InlineMath math="\varepsilon_q < 0" />). Dieses Phänomen heißt <strong>Querkontraktion</strong>. 
                  Die Querdehnzahl <InlineMath math="\nu" /> (Poissonzahl) ist das negative Verhältnis von Quer- zu Längsdehnung:
                </p>
                <BlockMath math="\nu = - \frac{\varepsilon_q}{\varepsilon_{\text{ax}}} = - \frac{\Delta d / d_0}{\Delta L / L_0}" />
                <p className="leading-relaxed">
                  Für homogene, isotrope Festkörper ist die Querdehnzahl thermodynamisch streng auf den Bereich 
                  <InlineMath math="0 \le \nu \le 0{,}5" /> begrenzt.
                </p>
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-[11px] space-y-1.5">
                  <div><strong>Spezialfälle der Poissonzahl:</strong></div>
                  <div>• <InlineMath math="\nu = 0{,}50" />: <em>Inkompressibles Material</em> (z. B. Gummi, Fließzustand im Stahl). Die Volumendehnung <InlineMath math="\varepsilon_V = \varepsilon (1 - 2\nu) = 0" />!</div>
                  <div>• <InlineMath math="\nu \approx 0{,}00" />: <em>Kork</em> (keine Querdehnung; daher ideal als Flaschenkorken, da er beim Hineindrücken nicht klemmt).</div>
                  <div>• <InlineMath math="\nu < 0" />: <em>Auxetische Strukturen</em> (dehnen sich bei Zugbelastung auch quer aus!).</div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-off-white p-4 rounded-xl border border-home-grau/25 flex flex-col items-center justify-center">
                <svg width="240" height="150" viewBox="0 0 240 150" className="select-none">
                  {/* Original ungestreckter Stab */}
                  <rect x="40" y="45" width="160" height="60" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" rx="4" />
                  <text x="120" y="40" textAnchor="middle" fill="#94a3b8" fontSize="10" className="font-mono">Ausgangszustand (L0, d0)</text>

                  {/* Gedehnter Stab unter Zug */}
                  <rect x="20" y="55" width="200" height="40" fill="rgba(163, 17, 62, 0.1)" stroke="#A3113E" strokeWidth="2" rx="4" />
                  <text x="120" y="78" textAnchor="middle" fill="#A3113E" fontSize="11" fontWeight="bold">Gedehnt (L0 + ΔL, d0 - Δd)</text>

                  {/* Zugkraft Pfeile */}
                  <line x1="5" y1="75" x2="18" y2="75" stroke="#dc2626" strokeWidth="2.5" />
                  <polygon points="18,75 10,71 10,79" fill="#dc2626" />
                  <text x="5" y="68" fill="#dc2626" fontSize="10" fontWeight="bold">F</text>

                  <line x1="235" y1="75" x2="222" y2="75" stroke="#dc2626" strokeWidth="2.5" />
                  <polygon points="222,75 230,71 230,79" fill="#dc2626" />
                  <text x="230" y="68" fill="#dc2626" fontSize="10" fontWeight="bold">F</text>

                  {/* Querkontraktion Pfeile */}
                  <line x1="120" y1="46" x2="120" y2="54" stroke="#b45309" strokeWidth="1.5" />
                  <line x1="120" y1="104" x2="120" y2="96" stroke="#b45309" strokeWidth="1.5" />
                  <text x="126" y="112" fill="#b45309" fontSize="9" className="font-mono">Einschnürung -Δd</text>
                </svg>
                <span className="text-[10px] text-text-main/70 text-center mt-2">
                  Querkontraktion bei Zugbeanspruchung (<InlineMath math="\nu = -\varepsilon_q / \varepsilon_{\text{ax}}" />)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: E-MODUL & HOOKE */}
      {activeTab === 'hooke_emodul' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Das Hooke'sche Gesetz */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                  <TrendingUp className="text-shiraz" size={18} /> 1. Das Hooke’sche Gesetz (1D &amp; 3D)
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Im Jahr 1678 formulierte Robert Hooke: <em>„Ut tensio, sic vis“</em> (Wie die Dehnung, so die Kraft). 
                  Im linear-elastischen Bereich verhält sich die Spannung direkt proportional zur Dehnung:
                </p>

                <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4">
                  <div className="text-xs font-bold text-text-main mb-1">Eindimensionaler Fall (Stab):</div>
                  <BlockMath math="\sigma = E \cdot \varepsilon \iff \varepsilon = \frac{\sigma}{E}" />
                  <div className="text-[11px] text-slate-500 text-center">
                    Steigung der Hooke'schen Geraden im <InlineMath math="\sigma\text{-}\varepsilon" />-Diagramm entspricht dem E-Modul.
                  </div>
                </div>

                <div className="space-y-2 text-xs text-text-main/80">
                  <div><strong>Dreidimensionales verallgemeinertes Hooke'sches Gesetz (Isotropie):</strong></div>
                  <p className="text-[11px] text-text-main/75 leading-relaxed">
                    Spannungen in einer Raumrichtung erzeugen durch den Poisson-Effekt auch Dehnungen in den beiden Querrichtungen:
                  </p>
                  <BlockMath math="\varepsilon_x = \frac{1}{E} \left[ \sigma_x - \nu (\sigma_y + \sigma_z) \right]" />
                  <BlockMath math="\gamma_{xy} = \frac{\tau_{xy}}{G}, \quad \gamma_{yz} = \frac{\tau_{yz}}{G}, \quad \gamma_{zx} = \frac{\tau_{zx}}{G}" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono">
                Gültigkeitsgrenze: Bis zur Proportionalitätsgrenze fp bzw. Streckgrenze fy
              </div>
            </div>

            {/* Box 2: Moduln-Beziehungen (E, G, K) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                  <Layers className="text-shiraz" size={18} /> 2. Schubmodul (<InlineMath math="G" />) &amp; Kompressionsmodul (<InlineMath math="K" />)
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Für isotrope Materialien reichen <strong>zwei unabhängige elastische Konstanten</strong> aus 
                  (z. B. <InlineMath math="E" /> und <InlineMath math="\nu" />), um sämtliche elastische Verformungen zu beschreiben:
                </p>

                <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4 space-y-3">
                  <div>
                    <div className="text-xs font-bold text-text-main">Schubmodul G (Widerstand gegen Scherung / Gestaltänderung):</div>
                    <BlockMath math="G = \frac{E}{2 \cdot (1 + \nu)}" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-main">Kompressionsmodul K (Widerstand gegen allseitigen hydrostatischen Druck):</div>
                    <BlockMath math="K = \frac{E}{3 \cdot (1 - 2\nu)}" />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-text-main/80">
                  <div><strong>Berechnungsbeispiel Baustahl:</strong></div>
                  <div className="p-2.5 bg-off-white rounded-lg border border-home-grau/20 text-[11px] font-mono">
                    E = 210.000 MPa, ν = 0,30<br />
                    G = 210.000 / (2 · 1,30) ≈ <strong>80.769 MPa</strong><br />
                    K = 210.000 / (3 · 0,40) ≈ <strong>175.000 MPa</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono">
                Hinweis: Geht ν gegen 0,5, strebt der Kompressionsmodul K gegen Unendlich (reine Inkompressibilität).
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: DEHNSTEIFIGKEIT & BIEGESTEIFIGKEIT (EA & EI) */}
      {activeTab === 'steifigkeiten' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Karte 1: Dehnsteifigkeit EA */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                  <MoveHorizontal className="text-shiraz" size={18} /> 1. Dehnsteifigkeit (<InlineMath math="EA" />)
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Die Dehnsteifigkeit (auch Längs- oder Normalkraftsteifigkeit) ist das Produkt aus 
                  <strong> Materialsteifigkeit (<InlineMath math="E" />)</strong> und <strong>Querschnittsfläche (<InlineMath math="A" />)</strong>. 
                  Sie bestimmt den Widerstand eines Bauteils gegen axiale Dehnung oder Stauchung unter Normalkraft.
                </p>

                <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4 space-y-2">
                  <div className="text-xs font-bold text-text-main">Definition &amp; Einheiten:</div>
                  <BlockMath math="EA = E \cdot A \quad [\text{N}, \text{ kN}, \text{ MN}]" />
                  <div className="text-xs font-bold text-text-main pt-1">Verlängerung eines Zugstabs:</div>
                  <BlockMath math="\Delta L = \frac{N \cdot L_0}{EA} \iff N = \left(\frac{EA}{L_0}\right) \cdot \Delta L = c \cdot \Delta L" />
                </div>

                <div className="space-y-2 text-xs text-text-main/80">
                  <div><strong>Tragwerksplanerische Bedeutung:</strong></div>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-text-main/75">
                    <li><strong>Federsteifigkeit (<InlineMath math="c" />):</strong> Ein Stab wirkt axial wie eine Feder mit Steifigkeit <InlineMath math="c = \frac{EA}{L_0}" />.</li>
                    <li><strong>Fachwerke &amp; Seile:</strong> Bei Fachwerkträgern, Hängebrücken und Abspannseilen bestimmt ausschließlich <InlineMath math="EA" /> die Systemdurchbiegung.</li>
                    <li><strong>Temperaturzwang:</strong> Ein an beiden Enden festgehaltener Stab erfährt bei Erwärmung eine Zwangsdruckkraft <InlineMath math="N_{\Delta T} = -EA \cdot \alpha_T \cdot \Delta T" />.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono">
                Differentialgleichung des Dehnstabs: (EA · u'(x))' + n(x) = 0
              </div>
            </div>

            {/* Karte 2: Biegesteifigkeit EI */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
                  <Compass className="text-shiraz" size={18} /> 2. Biegesteifigkeit (<InlineMath math="EI" />)
                </h3>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Die Biegesteifigkeit ist das Produkt aus <strong>Elastizitätsmodul (<InlineMath math="E" />)</strong> und 
                  dem <strong>Flächenträgheitsmoment (<InlineMath math="I" />)</strong> des Querschnitts bezüglich der neutralen Biegeachse. 
                  Sie definiert den Widerstand eines Balkens gegen Verkrümmung unter Biegemoment.
                </p>

                <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/25 mb-4 space-y-2">
                  <div className="text-xs font-bold text-text-main">Momenten-Krümmungs-Beziehung (Bernoulli-Balken):</div>
                  <BlockMath math="\kappa(x) = -w''(x) = \frac{M(x)}{EI} \quad [\text{N}\cdot\text{mm}^2 = \text{kNm}^2]" />
                  <div className="text-xs font-bold text-text-main pt-1">Durchbiegung Einfeldträger (Einzellast F in Feldmitte):</div>
                  <BlockMath math="w_{\max} = \frac{F \cdot L^3}{48 \cdot EI}" />
                </div>

                <div className="space-y-2 text-xs text-text-main/80">
                  <div><strong>Flächenträgheitsmomente Standardquerschnitte:</strong></div>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-text-main/75 font-mono">
                    <li>Rechteck (b × h): I_y = (b · h³) / 12 (Höhe h geht in der 3. Potenz ein!)</li>
                    <li>Kreis (Ø d): I = (π · d⁴) / 64</li>
                    <li>Kreisrohr: I = π · (D⁴ - d⁴) / 64</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-500 font-mono">
                Balken-Differentialgleichung 4. Ordnung: EI · w''''(x) = q(x)
              </div>
            </div>

          </div>

          {/* Gegenüberstellung Tabelle */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <Scale className="text-shiraz" size={18} /> Direkter Systemvergleich: EA vs. EI
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/30">
                  <tr>
                    <th className="p-3">Kriterium</th>
                    <th className="p-3">Dehnsteifigkeit (EA)</th>
                    <th className="p-3">Biegesteifigkeit (EI)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20">
                  <tr>
                    <td className="p-3 font-bold text-text-main">Schnittgröße</td>
                    <td className="p-3 font-mono">Normalkraft N(x)</td>
                    <td className="p-3 font-mono">Biegemoment M(x)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-text-main">Verzerrungsgröße</td>
                    <td className="p-3 font-mono">Längsdehnung ε(x) = u'(x)</td>
                    <td className="p-3 font-mono">Krümmung κ(x) = -w''(x)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-text-main">Geometrieeinfluss</td>
                    <td className="p-3">Linear mit der Fläche (<InlineMath math="A \propto h" />)</td>
                    <td className="p-3">Kubisch mit der Bauteilhöhe (<InlineMath math="I \propto h^3" />)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-text-main">Maßgebend für</td>
                    <td className="p-3">Stützenstauchung, Zugbänder, Seile, Baugrundsetzung</td>
                    <td className="p-3">Deckendurchbiegung, Trägerüberhöhung, Euler-Knicken (<InlineMath math="F_K = \frac{\pi^2 EI}{l_k^2}" />)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KRIECHEN, SCHWINDEN & RELAXATION */}
      {activeTab === 'kriechen_schwinden' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1: Kriechen */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-home-grau/20 mb-3">
                  <h3 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                    <Clock className="text-shiraz" size={17} /> 1. Kriechen (Creep)
                  </h3>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                    σ = konst.
                  </span>
                </div>
                
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  <strong>Kriechen</strong> ist die zeitabhängige <em>Zunahme der Verformung</em> unter einer 
                  dauerhaft wirkenden, konstanten mechanischen Spannung.
                </p>

                <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 mb-3 text-xs space-y-1">
                  <div className="font-bold text-text-main">Gesamtdehnung nach Zeit t:</div>
                  <BlockMath math="\varepsilon(t) = \varepsilon_{\text{el}} \cdot \left[ 1 + \varphi(t, t_0) \right]" />
                  <div className="font-bold text-text-main pt-1">Effektiver Langzeit-E-Modul:</div>
                  <BlockMath math="E_{c,\text{eff}} = \frac{E_{cm}}{1 + \varphi(t, t_0)}" />
                </div>

                <div className="text-[11px] text-text-main/75 space-y-1">
                  <div><strong>Ursache &amp; Folgen:</strong></div>
                  <p>
                    Im Zementstein führt die Wanderung des adsorbierten Wassers in den C-S-H-Gelen zum Gleiten der Gelpartikel. 
                    Folge: Stützensenkungen und bis zu <strong>3-fache Langzeitdurchbiegungen</strong> von Betonplatten!
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-home-grau/20 text-[10px] text-slate-500 font-mono">
                Typische Kriechzahl Beton: φ ≈ 1,5 bis 3,0 (DIN EN 1992-1-1)
              </div>
            </div>

            {/* Box 2: Schwinden */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-home-grau/20 mb-3">
                  <h3 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                    <Activity className="text-amber-600" size={17} /> 2. Schwinden (Shrinkage)
                  </h3>
                  <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                    σ = 0 (lastfrei)
                  </span>
                </div>

                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  <strong>Schwinden</strong> ist die <em>lastunabhängige Volumenverringerung</em> eines Werkstoffs 
                  infolge Feuchtigkeitsabgabe an die Umwelt und innerer chemischer Reaktionen.
                </p>

                <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 mb-3 text-xs space-y-1">
                  <div className="font-bold text-text-main">Gesamtschwinddehnung:</div>
                  <BlockMath math="\varepsilon_{\text{cs}} = \varepsilon_{\text{cd}} + \varepsilon_{\text{ca}}" />
                  <div className="text-[10px] text-slate-600 font-mono">
                    εcd: Trocknungsschwinden (Diffusionsvorgang)<br />
                    εca: Autogenes Schwinden (Hydratationskontraktion)
                  </div>
                </div>

                <div className="text-[11px] text-text-main/75 space-y-1">
                  <div><strong>Zwang &amp; Rissbildung:</strong></div>
                  <p>
                    Wird das freie Schwinden behindert (z. B. Bodenplatte auf festem Grund), entstehen massive 
                    Zugspannungen: <InlineMath math="\sigma_z = E \cdot \varepsilon_{\text{cs}}" />. Übersteigt <InlineMath math="\sigma_z" /> die 
                    Zugfestigkeit <InlineMath math="f_{ct}" />, bilden sich Schwindrisse.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-home-grau/20 text-[10px] text-slate-500 font-mono">
                Endschwindmaß Beton: εcs,∞ ≈ -0,30 bis -0,60 ‰ (-0,3 bis -0,6 mm/m)
              </div>
            </div>

            {/* Box 3: Relaxation */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-home-grau/20 mb-3">
                  <h3 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                    <Timer className="text-purple-600" size={17} /> 3. Relaxation (Stress Relaxation)
                  </h3>
                  <span className="text-[10px] font-mono bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                    ε = konst.
                  </span>
                </div>

                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  <strong>Relaxation</strong> ist der zeitabhängige <em>Abbau von mechanischer Spannung</em> 
                  bei konstant gehaltener äußerer Verformung (Dehnung <InlineMath math="\varepsilon_0 = \text{konst.}" />).
                </p>

                <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 mb-3 text-xs space-y-1">
                  <div className="font-bold text-text-main">Spannungsverlauf (Maxwell-Element):</div>
                  <BlockMath math="\sigma(t) = \sigma_0 \cdot \exp\left(-\frac{t}{\tau_{\text{rel}}}\right)" />
                  <div className="text-[10px] text-slate-600 font-mono">
                    Relaxationszeit: τ = η / E (Verhältnis Viskosität zu Steifigkeit)
                  </div>
                </div>

                <div className="text-[11px] text-text-main/75 space-y-1">
                  <div><strong>Praxisbeispiele:</strong></div>
                  <ul className="list-disc list-inside space-y-0.5 pl-0.5">
                    <li><strong>Spannbeton:</strong> Vorspanndrähte verlieren durch Relaxation über 50 Jahre ca. 4–8 % ihrer Anfangsspannung.</li>
                    <li><strong>Fugendichtstoffe:</strong> Polymerabdichtungen entspannen sich, um Reißkräfte abzubauen.</li>
                    <li><strong>Vorgespannte Schrauben:</strong> Setzen und Relaxation erfordern Nachziehen.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-home-grau/20 text-[10px] text-slate-500 font-mono">
                Spannstahl-Klassen nach EC2: Klasse 1 (Draht), Klasse 2 (Litze sehr niedrig), Klasse 3 (Stab)
              </div>
            </div>

          </div>

          {/* Rheologische Ersatzmodelle */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <Layers className="text-shiraz" size={18} /> Rheologische Ersatzmodelle (Feder &amp; Dämpfer)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="font-bold text-text-main">1. Hooke-Körper (Feder)</div>
                <div className="text-[11px] font-mono text-shiraz">σ = E · ε</div>
                <p className="text-[11px] text-text-main/75">
                  Rein elastisch, verzögerungsfrei, vollkommen reversibel. Keine Energieverluste.
                </p>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="font-bold text-text-main">2. Newton-Körper (Dämpfer)</div>
                <div className="text-[11px] font-mono text-shiraz">σ = η · (dε/dt)</div>
                <p className="text-[11px] text-text-main/75">
                  Rein viskose Flüssigkeit. Die Spannung hängt von der Dehngeschwindigkeit ab. Keine reversible Rückstellung.
                </p>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="font-bold text-text-main">3. Maxwell-Modell (Reihe)</div>
                <div className="text-[11px] font-mono text-shiraz">Feder + Dämpfer in Reihe</div>
                <p className="text-[11px] text-text-main/75">
                  Grundmodell für <strong>Spannungsrelaxation</strong>. Bei Dehnungssprung relaxiert die Spannung exponentiell gegen 0.
                </p>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="font-bold text-text-main">4. Kelvin-Voigt (Parallel)</div>
                <div className="text-[11px] font-mono text-shiraz">Feder + Dämpfer parallel</div>
                <p className="text-[11px] text-text-main/75">
                  Grundmodell für <strong>verzögerte Elastizität (Kriechen)</strong>. Verformung nähert sich asymptotisch dem Hooke-Wert.
                </p>
              </div>
            </div>

            {/* INTERAKTIVER RHEOLOGIE-SIMULATOR: KRIECHEN VS. RELAXIEREN */}
            <div className="mt-6 pt-5 border-t border-home-grau/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sliders className="text-shiraz" size={17} />
                  <h4 className="text-sm font-bold text-text-main uppercase tracking-wider">
                    Live-Simulator Rheologischer Modelle: Kriechen &amp; Relaxieren
                  </h4>
                </div>
                
                {/* Umschalter: Relaxieren vs. Kriechen */}
                <div className="flex bg-off-white p-1 rounded-xl border border-home-grau/30 gap-1 text-xs">
                  <button aria-pressed={rheoModus === 'relaxieren'}
                    onClick={() => setRheoModus('relaxieren')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      rheoModus === 'relaxieren'
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'text-text-main/70 hover:text-text-main hover:bg-white'
                    }`}
                  >
                    <Timer size={14} /> 1. Relaxieren (ε = konst.)
                  </button>
                  <button aria-pressed={rheoModus === 'kriechen'}
                    onClick={() => setRheoModus('kriechen')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      rheoModus === 'kriechen'
                        ? 'bg-shiraz text-white shadow-sm'
                        : 'text-text-main/70 hover:text-text-main hover:bg-white'
                    }`}
                  >
                    <Clock size={14} /> 2. Kriechen (σ = konst.)
                  </button>
                </div>
              </div>

              {/* Slider & Berechnungen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-off-white p-4 rounded-xl border border-home-grau/25">
                <Slider
                  label={rheoModus === 'relaxieren' ? "Anfangsspannung σ₀" : "Dauerlastspannung σ₀"}
                  min={2}
                  max={50}
                  step={1}
                  value={rheoWert0}
                  unit="MPa"
                  info={rheoModus === 'relaxieren' ? "Ausgangsspannung beim Dehnungssprung ε₀ = σ₀ / E." : "Konstant wirkende Dauerlastspannung."}
                  onChange={(e) => setRheoWert0(Number(e.target.value))}
                />
                <Slider
                  label={rheoModus === 'relaxieren' ? "Relaxationszeit τ = η / E" : "Retardationszeit τ = η / E"}
                  min={0.5}
                  max={8.0}
                  step={0.5}
                  value={rheoTauSec}
                  unit="s"
                  info="Verhältnis von Viskosität zu Steifigkeit. Gibt die Zeit bis zum Abfall auf 1/e ≈ 36,8 % bzw. Erreichen von 63,2 % an."
                  onChange={(e) => setRheoTauSec(Number(e.target.value))}
                />
              </div>

              {/* Live SVG Diagramm der Ersatzmodelle */}
              {(() => {
                const W = 520;
                const H = 240;
                const padL = 55;
                const padR = 25;
                const padT = 30;
                const padB = 40;
                const plotW = W - padL - padR;
                const plotH = H - padT - padB;

                const maxTime = 10; // 0 bis 10 s
                const tToX = (t: number) => padL + (t / maxTime) * plotW;

                if (rheoModus === 'relaxieren') {
                  // RELAXATION: sigma(t)
                  // Max Y = rheoWert0 * 1.15
                  const maxY = rheoWert0 * 1.15;
                  const yToY = (yVal: number) => padT + plotH - (Math.max(0, Math.min(yVal, maxY)) / maxY) * plotH;

                  // Maxwell: sig(t) = sig0 * exp(-t / tau)
                  let maxwellPts = '';
                  // Zener (SLS): sig(t) = sig0 * (0.4 + 0.6 * exp(-t / tau))
                  let zenerPts = '';
                  // Kelvin-Voigt: sig(t) = sig0 = konst. (kann nicht relaxieren)
                  let kelvinPts = '';
                  // Hooke: sig(t) = sig0 = konst.
                  let hookePts = '';

                  for (let i = 0; i <= 100; i++) {
                    const t = (i / 100) * maxTime;
                    const x = tToX(t);
                    
                    const sMax = rheoWert0 * Math.exp(-t / rheoTauSec);
                    const sZen = rheoWert0 * (0.4 + 0.6 * Math.exp(-t / rheoTauSec));
                    const sKel = rheoWert0;
                    const sHoo = rheoWert0;

                    maxwellPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(sMax).toFixed(1)} `;
                    zenerPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(sZen).toFixed(1)} `;
                    kelvinPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(sKel).toFixed(1)} `;
                    hookePts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(sHoo).toFixed(1)} `;
                  }

                  const sigEndMaxwell = rheoWert0 * Math.exp(-maxTime / rheoTauSec);
                  const sigEndZener = rheoWert0 * (0.4 + 0.6 * Math.exp(-maxTime / rheoTauSec));
                  const relaxRateMaxwell = ((rheoWert0 - sigEndMaxwell) / rheoWert0) * 100;
                  const halfLife = rheoTauSec * Math.LN2;

                  return (
                    <div className="space-y-4">
                      {/* Diagram Container */}
                      <div className="relative bg-white rounded-2xl border border-home-grau/30 shadow-sm p-4 overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                            Spannungsverlauf σ(t) bei vorgegebener Dehnung ε(t) = ε₀ = konst.
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            Halbwertszeit t½ = {formatDeZahl(halfLife, 2)} s
                          </span>
                        </div>

                        <div className="w-full overflow-x-auto">
                          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-h-[260px] select-none font-mono">
                            {/* Explicit White Background */}
                            <rect width={W} height={H} fill="#ffffff" rx="12" />

                            {/* Coordinate Grid */}
                            {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                              const yVal = frac * rheoWert0;
                              const yPos = yToY(yVal);
                              return (
                                <g key={idx}>
                                  <line x1={padL} y1={yPos} x2={W - padR} y2={yPos} stroke="#f1f5f9" strokeWidth="1" />
                                  <text x={padL - 6} y={yPos + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                                    {formatDeZahl(yVal, 1)}
                                  </text>
                                </g>
                              );
                            })}

                            {[0, 2, 4, 6, 8, 10].map((tVal) => {
                              const xPos = tToX(tVal);
                              return (
                                <g key={tVal}>
                                  <line x1={xPos} y1={padT} x2={xPos} y2={padT + plotH} stroke="#f1f5f9" strokeWidth="1" />
                                  <text x={xPos} y={H - padB + 18} textAnchor="middle" fontSize="10" fill="#334155" fontWeight="bold">
                                    {formatDeWert(tVal)} s
                                  </text>
                                </g>
                              );
                            })}

                            {/* Coordinate Axes */}
                            <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#334155" strokeWidth="1.5" />
                            <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth="1.5" />
                            <text x={W - padR} y={padT + plotH - 8} textAnchor="end" fontSize="11" fill="#0f172a" fontWeight="bold">Zeit t (s)</text>
                            <text x={padL + 6} y={padT + 12} fontSize="11" fill="#0f172a" fontWeight="bold">Spannung σ (MPa)</text>

                            {/* 1. Hooke (schwarz gepunktet) */}
                            <path d={hookePts} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />

                            {/* 2. Kelvin-Voigt (grün gestrichelt, keine Relaxation) */}
                            <path d={kelvinPts} fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="6 3" />

                            {/* 3. Zener (SLS / violett) */}
                            <path d={zenerPts} fill="none" stroke="#9333ea" strokeWidth="2.5" />

                            {/* 4. Maxwell (blau) */}
                            <path d={maxwellPts} fill="none" stroke="#2563eb" strokeWidth="3" />

                            {/* Marker bei t = tau */}
                            {rheoTauSec <= 10 && (
                              <g>
                                <line 
                                  x1={tToX(rheoTauSec)} 
                                  y1={padT} 
                                  x2={tToX(rheoTauSec)} 
                                  y2={padT + plotH} 
                                  stroke="#3b82f6" 
                                  strokeWidth="1" 
                                  strokeDasharray="2 2" 
                                />
                                <circle 
                                  cx={tToX(rheoTauSec)} 
                                  cy={yToY(rheoWert0 * Math.exp(-1))} 
                                  r="4" 
                                  fill="#2563eb" 
                                />
                                <text 
                                  x={tToX(rheoTauSec) + 6} 
                                  y={yToY(rheoWert0 * Math.exp(-1)) - 6} 
                                  fontSize="9" 
                                  fill="#1d4ed8" 
                                  fontWeight="bold"
                                >
                                  τ = {formatDeWert(rheoTauSec)} s (36,8 %)
                                </text>
                              </g>
                            )}
                          </svg>
                        </div>

                        {/* Legende der Kurven */}
                        <div className="flex flex-wrap items-center justify-center gap-4 mt-2 pt-2 border-t border-home-grau/20 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-0.5 bg-blue-600 inline-block border-t-2 border-blue-600"></span>
                            <span className="font-bold text-blue-700">Maxwell-Element:</span>
                            <span className="text-slate-600 font-mono">σ(t) = σ₀ · e^(-t/τ) → 0</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-0.5 bg-purple-600 inline-block border-t-2 border-purple-600"></span>
                            <span className="font-bold text-purple-700">Zener (SLS):</span>
                            <span className="text-slate-600 font-mono">σ(t) → σ_∞ &gt; 0</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-0.5 border-t-2 border-green-600 border-dashed inline-block"></span>
                            <span className="font-bold text-green-700">Kelvin-Voigt:</span>
                            <span className="text-slate-600 font-mono">Keine Relaxation (starr)</span>
                          </div>
                        </div>
                      </div>

                      {/* Live Cockpit Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
                          <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Anfangsspannung σ₀</span>
                          <span className="font-mono font-bold text-base text-text-main block mt-0.5">{formatDeZahl(rheoWert0, 1)} MPa</span>
                          <span className="text-[10px] text-slate-500 font-mono">aufgeprägt bei t = 0</span>
                        </div>
                        <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
                          <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Relaxationszeit τ</span>
                          <span className="font-mono font-bold text-base text-blue-700 block mt-0.5">{formatDeZahl(rheoTauSec, 1)} s</span>
                          <span className="text-[10px] text-slate-500 font-mono">t½ = {formatDeZahl(halfLife, 2)} s</span>
                        </div>
                        <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
                          <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Maxwell σ(10 s)</span>
                          <span className="font-mono font-bold text-base text-blue-800 block mt-0.5">{formatDeZahl(sigEndMaxwell, 2)} MPa</span>
                          <span className="text-[10px] text-slate-500 font-mono">Abbau: -{formatDeZahl(relaxRateMaxwell, 0)} %</span>
                        </div>
                        <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
                          <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Zener σ(10 s)</span>
                          <span className="font-mono font-bold text-base text-purple-800 block mt-0.5">{formatDeZahl(sigEndZener, 2)} MPa</span>
                          <span className="text-[10px] text-slate-500 font-mono">Restgrenze: 40 %</span>
                        </div>
                      </div>

                      {/* Vertiefte didaktische Erklärung zur Relaxation */}
                      <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 text-xs text-text-main/80 space-y-2 leading-relaxed">
                        <div className="font-bold text-purple-950 flex items-center gap-1.5">
                          <Timer size={15} className="text-purple-700" />
                          <span>Warum relaxiert das Maxwell-Modell, während Kelvin-Voigt starr bleibt?</span>
                        </div>
                        <p>
                          Bei der <strong>Spannungsrelaxation</strong> wird dem Körper eine konstante Gesamtdehnung 
                          <InlineMath math="\varepsilon(t) = \varepsilon_0 = \text{konst.}" /> aufgeprägt (daher <InlineMath math="\dot{\varepsilon} = 0" />):
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
                          <div className="p-2.5 bg-white rounded-lg border border-purple-150 space-y-1">
                            <span className="font-bold text-blue-700 block">Maxwell-Element (Reihe):</span>
                            <span>
                              Feder und Dämpfer teilen sich die Gesamtdehnung (<InlineMath math="\varepsilon = \varepsilon_F + \varepsilon_D" />), 
                              übertragen aber dieselbe Spannung. Unter konstanter Dehnung fließt der serielle Dämpfer weiter: 
                              <InlineMath math="\dot{\varepsilon}_D = \sigma / \eta" />. Dies entlastet die Hooke-Feder (<InlineMath math="\dot{\varepsilon}_F = - \dot{\varepsilon}_D" />). 
                              Die Spannung baut sich nach <InlineMath math="\sigma(t) = \sigma_0 \cdot \exp(-t/\tau)" /> vollständig ab!
                            </span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-purple-150 space-y-1">
                            <span className="font-bold text-green-700 block">Kelvin-Voigt-Element (Parallel):</span>
                            <span>
                              Feder und Dämpfer erfahren zwingend dieselbe Dehnung (<InlineMath math="\varepsilon_F = \varepsilon_D = \varepsilon_0" />). 
                              Bei konstanter Dehnung ist die Dehngeschwindigkeit im Dämpfer <InlineMath math="\dot{\varepsilon}_D = 0" />. 
                              Damit ist der Dämpfer vollkommen kraftlos (<InlineMath math="\sigma_D = \eta \cdot 0 = 0" />). 
                              Die Hooke-Feder hält die volle Anfangsspannung unendlich aufrecht – <strong>Kelvin-Voigt kann nicht relaxieren!</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // KRIECHEN: eps(t)
                  // Kelvin-Voigt vs. Maxwell vs. Hooke
                  const epsEl = rheoWert0 / 10; // Promille
                  const maxEps = epsEl * 3.5;
                  const yToY = (yVal: number) => padT + plotH - (Math.max(0, Math.min(yVal, maxEps)) / maxEps) * plotH;

                  let maxwellPts = '';
                  let zenerPts = '';
                  let kelvinPts = '';
                  let hookePts = '';

                  for (let i = 0; i <= 100; i++) {
                    const t = (i / 100) * maxTime;
                    const x = tToX(t);

                    const eKel = epsEl * (1 + 1.5 * (1 - Math.exp(-t / rheoTauSec)));
                    const eMax = epsEl * (1 + (t / rheoTauSec));
                    const eZen = epsEl * (1 + 1.2 * (1 - Math.exp(-t / rheoTauSec)));
                    const eHoo = epsEl;

                    kelvinPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(eKel).toFixed(1)} `;
                    maxwellPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(eMax).toFixed(1)} `;
                    zenerPts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(eZen).toFixed(1)} `;
                    hookePts += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yToY(eHoo).toFixed(1)} `;
                  }

                  const epsEndKelvin = epsEl * (1 + 1.5 * (1 - Math.exp(-maxTime / rheoTauSec)));
                  const epsEndMaxwell = epsEl * (1 + (maxTime / rheoTauSec));

                  return (
                    <div className="space-y-4">
                      {/* Diagram Container */}
                      <div className="relative bg-white rounded-2xl border border-home-grau/30 shadow-sm p-4 overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-shiraz flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-shiraz"></span>
                            Dehnungsverlauf ε(t) bei konstanter Lastspannung σ(t) = σ₀ = konst.
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            Retardationszeit τ = {formatDeZahl(rheoTauSec, 1)} s
                          </span>
                        </div>

                        <div className="w-full overflow-x-auto">
                          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-h-[260px] select-none font-mono">
                            <rect width={W} height={H} fill="#ffffff" rx="12" />

                            {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                              const yVal = frac * maxEps;
                              const yPos = yToY(yVal);
                              return (
                                <g key={idx}>
                                  <line x1={padL} y1={yPos} x2={W - padR} y2={yPos} stroke="#f1f5f9" strokeWidth="1" />
                                  <text x={padL - 6} y={yPos + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                                    {formatDeZahl(yVal, 1)} ‰
                                  </text>
                                </g>
                              );
                            })}

                            {[0, 2, 4, 6, 8, 10].map((tVal) => {
                              const xPos = tToX(tVal);
                              return (
                                <g key={tVal}>
                                  <line x1={xPos} y1={padT} x2={xPos} y2={padT + plotH} stroke="#f1f5f9" strokeWidth="1" />
                                  <text x={xPos} y={H - padB + 18} textAnchor="middle" fontSize="10" fill="#334155" fontWeight="bold">
                                    {formatDeWert(tVal)} s
                                  </text>
                                </g>
                              );
                            })}

                            <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#334155" strokeWidth="1.5" />
                            <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth="1.5" />
                            <text x={W - padR} y={padT + plotH - 8} textAnchor="end" fontSize="11" fill="#0f172a" fontWeight="bold">Zeit t (s)</text>
                            <text x={padL + 6} y={padT + 12} fontSize="11" fill="#0f172a" fontWeight="bold">Dehnung ε (‰)</text>

                            {/* 1. Hooke (gestrichelt) */}
                            <path d={hookePts} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />

                            {/* 2. Kelvin-Voigt (grün, asymptotisch) */}
                            <path d={kelvinPts} fill="none" stroke="#16a34a" strokeWidth="3" />

                            {/* 3. Zener (SLS / violett) */}
                            <path d={zenerPts} fill="none" stroke="#9333ea" strokeWidth="2.5" />

                            {/* 4. Maxwell (blau, linear unbegrenzt) */}
                            <path d={maxwellPts} fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="5 3" />
                          </svg>
                        </div>

                        {/* Legende */}
                        <div className="flex flex-wrap items-center justify-center gap-4 mt-2 pt-2 border-t border-home-grau/20 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-0.5 bg-green-600 inline-block border-t-2 border-green-600"></span>
                            <span className="font-bold text-green-700">Kelvin-Voigt (Kriechen):</span>
                            <span className="text-slate-600 font-mono">Asymptotisch begrenzt</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-0.5 border-t-2 border-blue-600 border-dashed inline-block"></span>
                            <span className="font-bold text-blue-700">Maxwell-Fluid:</span>
                            <span className="text-slate-600 font-mono">Unbegrenztes Fließen</span>
                          </div>
                        </div>
                      </div>

                      {/* Live Cockpit Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
                          <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Elast. Anfangsdehnung</span>
                          <span className="font-mono font-bold text-base text-text-main block mt-0.5">{formatDeZahl(epsEl, 2)} ‰</span>
                          <span className="text-[10px] text-slate-500 font-mono">ε_el = σ₀ / E</span>
                        </div>
                        <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
                          <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Retardationszeit τ</span>
                          <span className="font-mono font-bold text-base text-green-700 block mt-0.5">{formatDeZahl(rheoTauSec, 1)} s</span>
                          <span className="text-[10px] text-slate-500 font-mono">63,2 % Erreichen</span>
                        </div>
                        <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
                          <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Kelvin-Voigt ε(10 s)</span>
                          <span className="font-mono font-bold text-base text-green-800 block mt-0.5">{formatDeZahl(epsEndKelvin, 2)} ‰</span>
                          <span className="text-[10px] text-slate-500 font-mono">Kriechzahl φ ≈ 1,5</span>
                        </div>
                        <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 text-center">
                          <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Maxwell ε(10 s)</span>
                          <span className="font-mono font-bold text-base text-blue-800 block mt-0.5">{formatDeZahl(epsEndMaxwell, 2)} ‰</span>
                          <span className="text-[10px] text-slate-500 font-mono">lineares Fließen</span>
                        </div>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>

          {/* KRIECHEN BEI UNTERSCHIEDLICHEN BAUSTOFFEN */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div className="border-b border-home-grau/20 pb-3">
              <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                <Scale className="text-shiraz" size={18} /> Kriechen bei unterschiedlichen Werkstoffen (Normative Kennwerte &amp; Mechanismen)
              </h3>
              <p className="text-xs text-text-main/70 mt-1">
                Kriechen tritt keineswegs nur bei Beton auf. Nahezu alle Festkörper zeigen unter Dauerlast viskoelastische Verformungen, 
                jedoch bei völlig unterschiedlichen Temperaturen, Zeiträumen und mikrophysikalischen Prozessen.
              </p>
            </div>

            {/* 6 Werkstoff-Karten für Kriechen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* 1. Beton & Zementstein */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-shiraz text-sm">Beton &amp; Zementstein</span>
                    <span className="font-mono text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">EC2 / DIN EN 1992</span>
                  </div>
                  <div className="text-[11px] font-semibold text-text-main mb-1.5">
                    Kriechzahl <InlineMath math="\varphi(t, t_0) \approx 1{,}5 \text{ bis } 3{,}5" />
                  </div>
                  <p className="text-[11px] text-text-main/80 leading-relaxed mb-2">
                    <strong>Mechanismus:</strong> Gleiten der Schichtstrukturen in den Calciumsilicathydrat-Phasen (C-S-H) unter Wanderung des 
                    adsorbierten Zeolithwassers.
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                    <div>• <strong>Grundkriechen (Basic Creep):</strong> Unter Feuchteisolierung (reines Scherdehnen).</div>
                    <div>• <strong>Trocknungskriechen (Pickett-Effekt):</strong> Beschleunigtes Kriechen durch gleichzeitige Feuchteabgabe.</div>
                    <div>• <strong>Berechnungsansatz:</strong> <InlineMath math="E_{c,\text{eff}} = E_{cm} / (1 + \varphi)" /> führt zu 3-facher Plattendurchbiegung.</div>
                  </div>
                </div>
              </div>

              {/* 2. Holz & Holzwerkstoffe */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-amber-800 text-sm">Holz &amp; Holzwerkstoffe</span>
                    <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">EC5 / DIN EN 1995</span>
                  </div>
                  <div className="text-[11px] font-semibold text-text-main mb-1.5">
                    Verformungsbeiwert <InlineMath math="k_{\text{def}} = 0{,}60 \text{ bis } 2{,}00" />
                  </div>
                  <p className="text-[11px] text-text-main/80 leading-relaxed mb-2">
                    <strong>Mechanismus:</strong> Fließen der amorphen Lignin- und Hemicellulose-Matrix zwischen den hochfesten Cellulose-Fibrillen.
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                    <div>• <strong>Nutzungsklassen:</strong> NKL 1 (Innenraum): <InlineMath math="k_{\text{def}} = 0{,}60" />; NKL 2: <InlineMath math="k_{\text{def}} = 0{,}80" />; NKL 3 (Freiland): <InlineMath math="k_{\text{def}} = 2{,}00" />!</div>
                    <div>• <strong>Mechanosorptives Kriechen:</strong> Wechselnde Feuchtezyklen unter Last vervielfachen das Kriechmaß drastisch.</div>
                    <div>• <strong>Endverformung:</strong> <InlineMath math="u_{\text{fin}} = u_{\text{inst}} \cdot (1 + k_{\text{def}})" />.</div>
                  </div>
                </div>
              </div>

              {/* 3. Mauerwerk */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-orange-700 text-sm">Mauerwerk &amp; Mörtel</span>
                    <span className="font-mono text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold">EC6 / DIN EN 1996</span>
                  </div>
                  <div className="text-[11px] font-semibold text-text-main mb-1.5">
                    Endkriechzahl <InlineMath math="\Phi_{\infty} \approx 0{,}5 \text{ bis } 3{,}0" />
                  </div>
                  <p className="text-[11px] text-text-main/80 leading-relaxed mb-2">
                    <strong>Mechanismus:</strong> Kriechverformungen finden fast ausschließlich in den kalk- und zementgebundenen 
                    Lagerfugen (Mörtelbett) statt; Steine selbst kriechen werkstoffabhängig.
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                    <div>• <strong>Mauerziegel (MZI):</strong> <InlineMath math="\Phi_{\infty} \approx 0{,}5 \text{ bis } 1{,}5" /> (geringes Kriechen).</div>
                    <div>• <strong>Kalksandstein (KS):</strong> <InlineMath math="\Phi_{\infty} \approx 1{,}0 \text{ bis } 2{,}0" />.</div>
                    <div>• <strong>Porenbeton (PB) &amp; Leichtbeton:</strong> <InlineMath math="\Phi_{\infty} \approx 1{,}5 \text{ bis } 3{,}0" />.</div>
                  </div>
                </div>
              </div>

              {/* 4. Baustahl & Metalle */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-sm">Baustahl &amp; Metalle</span>
                    <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">EC3 / DIN EN 1993</span>
                  </div>
                  <div className="text-[11px] font-semibold text-text-main mb-1.5">
                    Raumtemperatur: <InlineMath math="\varphi \approx 0" /> | Brand: Hochtemperaturkriechen
                  </div>
                  <p className="text-[11px] text-text-main/80 leading-relaxed mb-2">
                    <strong>Mechanismus:</strong> Bei <InlineMath math="T < 0{,}3 \cdot T_m" /> (&lt; 350 °C) ist Kriechen von Stahl vernachlässigbar. 
                    Im Brandfall (<InlineMath math="T > 400-500^\circ\text{C}" />) klettern Versetzungen diffusionsgesteuert über Hindernisse.
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                    <div>• <strong>Phasen:</strong> 1. Primäres, 2. Stationäres (sekundäres), 3. Tertiäres Kriechen bis zum Kriechbruch.</div>
                    <div>• <strong>Spannstahl-Relaxation:</strong> Hochfeste Drähte/Litzen entspannen sich isotherm um 2,5–8 % unter Dauerspannung.</div>
                  </div>
                </div>
              </div>

              {/* 5. Kunststoffe & Elastomere */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-purple-700 text-sm">Kunststoffe &amp; Polymere</span>
                    <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">DIN EN ISO 899</span>
                  </div>
                  <div className="text-[11px] font-semibold text-text-main mb-1.5">
                    Kriechmodul <InlineMath math="E_c(t) = \frac{\sigma_0}{\varepsilon(t)} \ll E_0" />
                  </div>
                  <p className="text-[11px] text-text-main/80 leading-relaxed mb-2">
                    <strong>Mechanismus:</strong> Polymerketten entknäueln und gleiten bereits bei <strong>Raumtemperatur (20 °C)</strong> aneinander ab, 
                    da viele Kunststoffe (PE, PP, PVC, EPDM) nahe ihrer Glasübergangstemperatur betrieben werden.
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                    <div>• <strong>Praxis:</strong> Rohre, Dichtungsbahnen, Elastomer-Brückenlager verlieren bis zu 70 % ihrer elastischen Steifigkeit!</div>
                    <div>• <strong>Auslegung:</strong> Nachweis muss stets mit dem zeitabhängigen Kriechmodul <InlineMath math="E_c(50\text{ a})" /> erfolgen.</div>
                  </div>
                </div>
              </div>

              {/* 6. Boden & Glas / CFK */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-teal-800 text-sm">Böden &amp; Glas / CFK</span>
                    <span className="font-mono text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">EC7 / DIN 1054 / DIN 18008</span>
                  </div>
                  <div className="text-[11px] font-semibold text-text-main mb-1.5">
                    Boden: Sekundäre Setzung | Glas: <InlineMath math="\varphi = 0" />
                  </div>
                  <p className="text-[11px] text-text-main/80 leading-relaxed mb-2">
                    <strong>Boden:</strong> Nach Abschluss der primären Porenwasserkonsolidation gleiten Tonpartikel viskos weiter 
                    (Kriechbeiwert <InlineMath math="C_\alpha = \Delta e / \Delta \log t" />).
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                    <div>• <strong>Bauglas:</strong> Absolut kriechfrei bis 500 °C. Dauerlast führt zu statischer Ermüdung (unterkritisches Risswachstum).</div>
                    <div>• <strong>CFK:</strong> Kohlenstofffasern sind kriechfrei; Kriechzahl der Lamelle <InlineMath math="\varphi < 0{,}05" />.</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Übersichtstabelle Werkstoff-Kriechen */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/30">
                  <tr>
                    <th className="p-2.5">Werkstoff</th>
                    <th className="p-2.5">Kriechneigung bei 20 °C</th>
                    <th className="p-2.5">Normativer Kennwert</th>
                    <th className="p-2.5">Mikrophysikalische Ursache</th>
                    <th className="p-2.5">Praxis-Relevanz im Bauwesen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-[11px]">
                  <tr>
                    <td className="p-2.5 font-bold text-shiraz">Beton (C30/37)</td>
                    <td className="p-2.5 text-red-700 font-semibold">Sehr hoch</td>
                    <td className="p-2.5 font-mono">φ(∞, t0) ≈ 1,5 – 3,0 (EC2)</td>
                    <td className="p-2.5">Wasserumlagerung in C-S-H-Gelporen, Schichtenverschiebung</td>
                    <td className="p-2.5">Verdreifachung der Deckendurchbiegung, Stützensenkungen</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-800">Holz (C24)</td>
                    <td className="p-2.5 text-amber-700 font-semibold">Hoch (stark feuchteabhängig)</td>
                    <td className="p-2.5 font-mono">k_def = 0,6 bis 2,0 (EC5)</td>
                    <td className="p-2.5">Viskoelastisches Fließen von Lignin &amp; Hemicellulose, mechanosorptiv</td>
                    <td className="p-2.5">Große Dach- &amp; Deckendurchbiegungen, NKL-Abstufung maßgebend</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-orange-700">Mauerwerk</td>
                    <td className="p-2.5 text-orange-700 font-semibold">Mittel bis hoch</td>
                    <td className="p-2.5 font-mono">Φ_∞ ≈ 0,5 bis 3,0 (EC6)</td>
                    <td className="p-2.5">Mörtelfugenkriechen, Gesteinsleimstauchung (PB, KS)</td>
                    <td className="p-2.5">Setzungen in tragenden Wandpfeilern, Rissbildung an Deckenanschlüssen</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">Baustahl (S235/S355)</td>
                    <td className="p-2.5 text-slate-500 font-semibold">Keine (bei T &lt; 350 °C)</td>
                    <td className="p-2.5 font-mono">φ = 0 (EC3)</td>
                    <td className="p-2.5">Atomgitter stabil, Versetzungsklettern erst ab ca. 450 °C aktiviert</td>
                    <td className="p-2.5">Kriechsicher bei Raumklima; Versagen erst im Brandfall</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-purple-700">Kunststoffe (PE/PVC)</td>
                    <td className="p-2.5 text-red-700 font-semibold">Extrem hoch</td>
                    <td className="p-2.5 font-mono">Ec(t) = σ0 / ε(t) (ISO 899)</td>
                    <td className="p-2.5">Entknäuelung &amp; viskoses Gleiten der Makromolekülketten</td>
                    <td className="p-2.5">Ovalisierung von Kunststoffrohren, Nachlassen von Dichtpressung</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-teal-800">Ton- &amp; Schluffboden</td>
                    <td className="p-2.5 text-amber-700 font-semibold">Hoch (über Jahrzehnte)</td>
                    <td className="p-2.5 font-mono">C_α = Δe / Δlog t (EC7)</td>
                    <td className="p-2.5">Viskose Umlagerung von Tonmineralplättchen nach Konsolidation</td>
                    <td className="p-2.5">Langzeitsenkung von Großbauwerken (z. B. Frankfurter Hochhäuser)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-700">Bauglas</td>
                    <td className="p-2.5 text-emerald-700 font-semibold">Keine (φ = 0)</td>
                    <td className="p-2.5 font-mono">φ = 0 (DIN 18008)</td>
                    <td className="p-2.5">Amorphes Silicatnetzwerk starr unterhalb Tg (~530 °C)</td>
                    <td className="p-2.5">Keine Verformungszunahme; statische Ermüdung (Risswachstum)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* UMFASSENDE SYSTEMATIK ALLER SCHWINDARTEN */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div className="border-b border-home-grau/20 pb-3">
              <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                <Activity className="text-shiraz" size={18} /> Systematik aller Schwindarten im Bauwesen &amp; der Baustoffkunde
              </h3>
              <p className="text-xs text-text-main/70 mt-1">
                Schwinden ist die lastunabhängige Volumenverminderung eines Baustoffs. Im Betonbau und in der Werkstoffkunde 
                wird nach Ursache, Zeitfenster, Feuchteverlauf und Schadensmechanismus zwischen <strong>sechs eigenständigen Schwindarten</strong> unterschieden.
              </p>
            </div>

            {/* Die 6 Schwindarten im Detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* 1. Frühschwinden */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-shiraz text-sm">1. Frühschwinden (Plastisches Schwinden)</span>
                    <span className="font-mono text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">0 – 24 h</span>
                  </div>
                  <div className="text-[11px] font-semibold text-text-main mb-1.5">Kapillarschwinden / Schrumpfen</div>
                  <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5">
                    Verdunstet Wasser von der noch ungeschützten Frischbetonoberfläche schneller als Porenwasser durch Bluten nachsteigt 
                    (<InlineMath math="E > 0{,}5\text{ bis }1{,}0\text{ kg/(m}^2\text{h)}" /> durch Wind, Sonneneinstrahlung, trockene Luft), 
                    entstehen in den Kapillaren Menisken mit extremen <strong>Kapillarunterdrücken</strong>.
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                    <div><strong>Schadensbild:</strong> Klaffende, unregelmäßige Risse im noch plastischen Gefüge (oft netzartig oder parallel über Bewehrungseisen).</div>
                    <div><strong>Gegenmaßnahmen:</strong> Unverzügliches Abdecken mit Folien, Curing-Filme, Wassernebel, PP-Fasern.</div>
                  </div>
                </div>
              </div>

              {/* 2. Autogenes Schwinden */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-amber-700 text-sm">2. Autogenes Schwinden</span>
                    <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">1 d – 28 d</span>
                  </div>
                  <div className="text-[11px] font-semibold text-text-main mb-1.5">Selbsttrocknungsschwinden</div>
                  <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5">
                    Findet <strong>ohne jeden Feuchtigkeitsaustausch mit der Umwelt</strong> statt. Durch die fortschreitende chemische Hydratation 
                    des Zements wird das innere Kapillarwasser verbraucht. Die innere relative Porenfeuchte sinkt 
                    (<em>Self-Desiccation</em> auf &lt; 80 % RH), was das Gelgerüst zusammenzieht.
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                    <div><strong>Relevanz:</strong> Extrem dominant bei dichten Hochleistungsbetonen, UHPC und Betonen mit sehr niedrigem <InlineMath math="w/z < 0{,}40" />.</div>
                    <div><strong>Gegenmaßnahmen:</strong> Innere Nachbehandlung (SAP – superabsorbierende Polymere, feuchte Blähton-Leichtsande).</div>
                  </div>
                </div>
              </div>

              {/* 3. Trocknungsschwinden */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-700 text-sm">3. Trocknungsschwinden</span>
                    <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Monate – Jahre</span>
                  </div>
                  <div className="text-[11px] font-semibold text-text-main mb-1.5">Klassisches Diffusionsschwinden</div>
                  <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5">
                    Diffusionsbedingte Abgabe von physikalisch adsorbiertem Wasser aus den C-S-H-Gelporen an eine trockenere Umgebung 
                    bis zum thermodynamischen Feuchtegleichgewicht.
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                    <div><strong>Größenordnung:</strong> Typisch <InlineMath math="\varepsilon_{\text{cd},\infty} \approx -0{,}30 \text{ bis } -0{,}60 \text{ ‰}" /> (0,3–0,6 mm/m).</div>
                    <div><strong>Einflussfaktoren:</strong> Relative Luftfeuchte <InlineMath math="RH" />, Bauteildicke <InlineMath math="h_0 = 2A_c / u" />, Zementleimvolumen.</div>
                  </div>
                </div>
              </div>

              {/* 4. Karbonatisierungsschwinden */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-purple-700 text-sm">4. Karbonatisierungsschwinden</span>
                    <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">Jahre – Jahrzehnte</span>
                  </div>
                  <div className="text-[11px] font-semibold text-text-main mb-1.5">Chemische Reaktion mit atmosphärischem CO₂</div>
                  <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5">
                    Reaktion von gasförmigem <InlineMath math="\text{CO}_2" /> mit Calciumhydroxid (Portlandit): 
                    <InlineMath math="\text{Ca(OH)}_2 + \text{CO}_2 \rightarrow \text{CaCO}_3 + \text{H}_2\text{O}" />. 
                    Trotz Calcit-Bildung führt die Auflösung tragender Portlanditkristalle und C-S-H-Umlagerung zu zusätzlicher irreversibler Kontraktion.
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                    <div><strong>Besonderheit:</strong> Maximaler Effekt bei 50–70 % relativer Luftfeuchte. Vergrößert oberflächennahe Schwindspannungen um bis zu 30 %.</div>
                  </div>
                </div>
              </div>

              {/* 5. Thermisches Schwinden */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-emerald-700 text-sm">5. Thermisches Schwinden</span>
                    <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">1 d – 7 d</span>
                  </div>
                  <div className="text-[11px] font-semibold text-text-main mb-1.5">Abkühlungskontraktion nach Wärmespitze</div>
                  <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5">
                    Die exotherme Zementhydratation setzt <InlineMath math="300-500\text{ kJ/kg}" /> Wärme frei (Bauteilkerne bis &gt; 60 °C). 
                    Beim anschließenden Auskühlen zieht sich der Beton zusammen: <InlineMath math="\Delta \varepsilon_{\text{th}} = \alpha_T \cdot \Delta T" />.
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                    <div><strong>Rissursache:</strong> Bei <InlineMath math="\Delta T = 30\text{ K}" /> beträgt <InlineMath math="\Delta \varepsilon_{\text{th}} \approx -0{,}30 \text{ ‰}" /> – das Dreifache der Betonzugdehnung!</div>
                    <div><strong>Gegenmaßnahmen:</strong> LH-Zemente (CEM III), Frischbetonkühlung, Schalungsdämmung.</div>
                  </div>
                </div>
              </div>

              {/* 6. Chemische Kontraktion */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-sm">6. Chemische Kontraktion</span>
                    <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">Molekulare Ebene</span>
                  </div>
                  <div className="text-[11px] font-semibold text-text-main mb-1.5">Le-Chatelier-Kontraktion</div>
                  <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5">
                    Das spezifische Volumen der Hydratphasen (C-S-H, Portlandit, Ettringit) ist um ca. <strong>8 bis 10 Vol.-% kleiner</strong> als 
                    das summierte Ausgangsvolumen von Zementklinker und flüssigem Wasser.
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                    <div><strong>Auswirkung:</strong> Vor dem Erstarren äußere Leimschrumpfung; nach dem Erstarren Entstehung von innerem Porenunterdruck und Ursprung des autogenen Schwindens.</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Übersichtstabelle */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/30">
                  <tr>
                    <th className="p-2.5">Schwindart</th>
                    <th className="p-2.5">Zeitpunkt</th>
                    <th className="p-2.5">Feuchtefluss</th>
                    <th className="p-2.5">Physikalisch-chemischer Mechanismus</th>
                    <th className="p-2.5">Gegenmaßnahmen auf der Baustelle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-[11px]">
                  <tr>
                    <td className="p-2.5 font-bold text-shiraz">Frühschwinden (Plastisch)</td>
                    <td className="p-2.5 font-mono">0–24 Stunden</td>
                    <td className="p-2.5">Wasserverlust nach außen</td>
                    <td className="p-2.5">Meniskenbildung in Kapillaren, Kapillardruck &gt; Zementleimzugfestigkeit</td>
                    <td className="p-2.5">Sofortiges Abdecken mit Folien, Curing-Film, PP-Fasern, Windschutz</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-700">Autogenes Schwinden</td>
                    <td className="p-2.5 font-mono">1–28 Tage</td>
                    <td className="p-2.5">Kein Feuchtefluss nach außen (isoliert)</td>
                    <td className="p-2.5">Selbsttrocknung durch chemischen Wasserverbrauch (w/z &lt; 0,40)</td>
                    <td className="p-2.5">Internal Curing (SAP, gesättigter Blähton), Schwindreduzierer (SRA)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-blue-700">Trocknungsschwinden</td>
                    <td className="p-2.5 font-mono">Monate bis Jahre</td>
                    <td className="p-2.5">Wasserabgabe an Umwelt</td>
                    <td className="p-2.5">Gelporenwasser-Diffusion bis zur Gleichgewichtsfeuchte</td>
                    <td className="p-2.5">Niedriger Zementleimgehalt, steife Gesteinskörnung, DIN EN 1992-1-1 Nachbehandlung</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-purple-700">Karbonatisierungsschwinden</td>
                    <td className="p-2.5 font-mono">Jahre</td>
                    <td className="p-2.5">CO₂-Aufnahme aus Luft</td>
                    <td className="p-2.5">Auflösung von Ca(OH)₂ und Umlagerung der C-S-H-Gelstruktur</td>
                    <td className="p-2.5">Dichtes Betongefüge, ausreichende Betondeckung c_nom nach DIN 1045-2</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-emerald-700">Thermisches Schwinden</td>
                    <td className="p-2.5 font-mono">1–7 Tage</td>
                    <td className="p-2.5">Wärmeabgabe nach außen</td>
                    <td className="p-2.5">Längenkontraktion beim Abkühlen des erhärteten Betons (Δε = αT · ΔT)</td>
                    <td className="p-2.5">LH-Zemente (CEM III/B), Schalungsdämmung (ΔT &lt; 15 K Kern-Schale)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">Chemische Kontraktion</td>
                    <td className="p-2.5 font-mono">Stunden bis Tage</td>
                    <td className="p-2.5">Innerer Prozess</td>
                    <td className="p-2.5">Le-Chatelier: Molvolumen Hydratphasen &lt; Molvolumen Klinker + Wasser</td>
                    <td className="p-2.5">Thermodynamisch nicht verhinderbar; steuert autogenes Schwinden</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Schwinden anderer Baustoffe: Holz, Ton, Metalle */}
            <div className="pt-2 border-t border-home-grau/20">
              <h4 className="text-xs font-bold text-text-main mb-2">
                Schwindverhalten bei anderen Werkstoffen (Holz, Ton &amp; Metalle):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-text-main/80">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-1">
                  <div className="font-bold text-text-main">Holz (Hygroskopisches Schwinden):</div>
                  <p className="text-[10px] leading-relaxed">
                    Tritt ausschließlich <strong>unterhalb des Fasersättigungsbereichs</strong> (<InlineMath math="u_{\text{FS}} \approx 28-32\,\%" />) auf. 
                    Extrem anisotrop:
                  </p>
                  <div className="font-mono text-[10px] text-slate-700">
                    • Längs zur Faser: α_l ≈ 0,1 – 0,3 % (vernachlässigbar)<br />
                    • Radial (Jahrringe quer): α_r ≈ 3 – 5 %<br />
                    • Tangential (Jahrringe längs): α_t ≈ 6 – 10 % (Rissursache!)
                  </div>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-1">
                  <div className="font-bold text-text-main">Mauerziegel &amp; Lehm:</div>
                  <p className="text-[10px] leading-relaxed">
                    <strong>Tonschwinden:</strong> Wasserfilme zwischen den Schichtgittermineralen (Montmorillonit, Illit) verdunsten. 
                    Ungebrannter Lehm schwindet um 2–8 %. Gebrannte Ziegel schwinden nicht mehr, sondern zeigen stattdessen langfristiges <strong>Feuchtequellen</strong>!
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-1">
                  <div className="font-bold text-text-main">Metalle &amp; Polymere:</div>
                  <p className="text-[10px] leading-relaxed">
                    <strong>Erstarrungsschrumpf:</strong> Phasenübergang flüssig zu fest (Gießereitechnik, Stahlguss ca. 1–2 %). 
                    Im Festkörper existiert nur rein <strong>thermisches Schwinden/Dehnen</strong> (<InlineMath math="\Delta L = L_0 \cdot \alpha_T \cdot \Delta T" />).
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: INTERAKTIVER SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          
          {/* Controls (5 Spalten) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                  <Sliders size={16} className="text-shiraz" /> Prüfstand-Parameter
                </h3>
                <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">
                  {mat.name}
                </span>
              </div>

              {/* Werkstoff-Wahl */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-text-main">Werkstoff auswählen:</label>
                  {mat.phiKriechen === 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">Kriechen/Schwinden ≈ 0</span>
                  )}
                </div>
                <select
                  value={materialKey}
                  onChange={(e) => handleSelectMaterial(e.target.value)}
                  className="w-full p-2.5 border border-home-grau/30 rounded-xl bg-off-white text-xs font-semibold focus:ring-2 focus:ring-shiraz outline-none cursor-pointer"
                >
                  {Object.values(MATERIALIEN).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (E = {formatDeWert(m.E)} MPa, ν = {formatDeWert(m.nu)})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-text-main/70 italic">{mat.beschreibung}</p>
              </div>

              {/* Belastungsart: Zug oder Druck */}
              <div className="space-y-1.5 pt-2 border-t border-home-grau/20">
                <label className="text-xs font-bold text-text-main block">Belastungsrichtung:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button aria-pressed={lastArt === 'zug'}
                    onClick={() => setLastArt('zug')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      lastArt === 'zug' ? 'bg-shiraz text-white border-shiraz shadow' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'
                    }`}
                  >
                    Zugspannung (+σ)
                  </button>
                  <button aria-pressed={lastArt === 'druck'}
                    onClick={() => setLastArt('druck')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      lastArt === 'druck' ? 'bg-shiraz text-white border-shiraz shadow' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'
                    }`}
                  >
                    Druckspannung (-σ)
                  </button>
                </div>
              </div>

              {/* Kraft Slider */}
              <Slider
                label={<FormulaText text={`Normalkraft |F|`} />}
                min={5}
                max={500}
                step={5}
                value={kraftKn}
                unit="kN"
                info="Auf den Stab axial wirkende Normalzug- oder Druckkraft."
                onChange={(e) => setKraftKn(Number(e.target.value))}
              />

              {/* Stablänge */}
              <Slider
                label={<FormulaText text="Stablänge L_0" />}
                min={0.5}
                max={10.0}
                step={0.5}
                value={stabLaengeM}
                unit="m"
                onChange={(e) => setStabLaengeM(Number(e.target.value))}
              />

              {/* Euler-Knicklast Hinweis bei Druck */}
              {lastArt === 'druck' && (
                <div className={`p-2.5 rounded-xl border text-xs flex justify-between items-center ${
                  sim.isKnickGefaehrdet 
                    ? 'bg-red-50 text-red-900 border-red-300' 
                    : sim.knickAuslastung > 75 
                    ? 'bg-amber-50 text-amber-900 border-amber-300' 
                    : 'bg-slate-50 text-slate-800 border-slate-200'
                }`}>
                  <div>
                    <span className="font-bold block">Euler-Knicklast FK (β=1,0):</span>
                    <span className="text-[10px] text-text-main/70">I_min = {formatDeZahl((sim.I_min_mm4 / 1e4), 1)} cm⁴</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold text-sm ${sim.isKnickGefaehrdet ? 'text-red-700 font-extrabold' : ''}`}>
                      {formatDeZahl(sim.F_K_kN, 1)} kN
                    </span>
                    <span className="block text-[10px] font-mono">
                      (Auslastung: {formatDeZahl(sim.knickAuslastung, 0)} %)
                    </span>
                  </div>
                </div>
              )}

              {/* Querschnittsform */}
              <div className="space-y-2 pt-2 border-t border-home-grau/20">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-text-main">Querschnittsgeometrie:</span>
                  <div className="flex gap-2">
                    <button aria-pressed={querschnittTyp === 'rund'}
                      onClick={() => setQuerschnittTyp('rund')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border cursor-pointer ${
                        querschnittTyp === 'rund' ? 'bg-slate-700 text-white' : 'bg-off-white text-slate-700'
                      }`}
                    >
                      Kreisstab (Ø)
                    </button>
                    <button aria-pressed={querschnittTyp === 'rechteck'}
                      onClick={() => setQuerschnittTyp('rechteck')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border cursor-pointer ${
                        querschnittTyp === 'rechteck' ? 'bg-slate-700 text-white' : 'bg-off-white text-slate-700'
                      }`}
                    >
                      Rechteck (b × h)
                    </button>
                  </div>
                </div>

                {querschnittTyp === 'rund' ? (
                  <Slider
                    label={<FormulaText text="Durchmesser d_0" />}
                    min={10}
                    max={120}
                    step={2}
                    value={durchmesserMm}
                    unit="mm"
                    onChange={(e) => setDurchmesserMm(Number(e.target.value))}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Slider
                      label="Breite b"
                      min={10}
                      max={150}
                      step={5}
                      value={breiteMm}
                      unit="mm"
                      onChange={(e) => setBreiteMm(Number(e.target.value))}
                    />
                    <Slider
                      label="Höhe h"
                      min={10}
                      max={150}
                      step={5}
                      value={hoeheMm}
                      unit="mm"
                      onChange={(e) => setHoeheMm(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>

              {/* Kriechzahl & Schwinden Slider */}
              <div className="space-y-3 pt-3 border-t border-home-grau/20 bg-off-white p-3 rounded-xl border">
                <div className="text-xs font-bold text-text-main flex items-center gap-1.5">
                  <Clock size={14} className="text-shiraz" /> Langzeiteffekte (Kriechen &amp; Schwinden):
                </div>
                <Slider
                  label="Kriechzahl φ"
                  min={0.0}
                  max={4.0}
                  step={0.1}
                  value={kriechZahl}
                  unit="-"
                  info="Verhältnis der Kriechverformung zur elastischen Anfangsverformung."
                  onChange={(e) => setKriechZahl(Number(e.target.value))}
                />
                <Slider
                  label="Endschwindmaß |ε_cs|"
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  value={schwindMassPromille}
                  unit="‰"
                  info="Lastfreie Verkürzung durch Austrocknung und Zementsteinreaktion."
                  onChange={(e) => setSchwindMassPromille(Number(e.target.value))}
                />
              </div>

              {/* Result Badges */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-home-grau/20">
                <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                  <span className="text-[10px] uppercase font-bold text-text-main/60 block">Spannung σ</span>
                  <span className={`text-lg font-mono font-bold ${sim.isVersagt ? 'text-red-600' : sim.isPlastisch ? 'text-amber-600' : 'text-shiraz'}`}>
                    {sim.sigma > 0 ? '+' : ''}{formatDeZahl(sim.sigma, 1)} MPa
                  </span>
                  <span className="text-[9px] text-text-main/70 block">
                    Grenz: {formatDeWert(sim.zulSpannung)} MPa ({formatDeZahl(sim.auslastungFestigkeit, 0)} %)
                  </span>
                </div>

                <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                  <span className="text-[10px] uppercase font-bold text-text-main/60 block">Dehnung ε_el</span>
                  <span className="text-lg font-mono font-bold text-text-main">
                    {sim.epsilonPromille > 0 ? '+' : ''}{formatDeZahl(sim.epsilonPromille, 2)} ‰
                  </span>
                  <span className="text-[9px] text-text-main/70 block">({formatDeZahl((sim.epsilonProzent), 3)} %)</span>
                </div>
              </div>

              {/* Status Warning with Buckling & Brittle Fracture checks */}
              <div className={`p-3 rounded-xl border text-xs text-center font-bold ${
                sim.isKnickGefaehrdet
                  ? 'bg-red-100 text-red-900 border-red-300 animate-pulse'
                  : sim.isVersagt
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : sim.isPlastisch
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}>
                {sim.isKnickGefaehrdet ? (
                  `STABILITÄTSVERSAGEN DURCH BIEGEKNICKEN! Euler-Knicklast FK = ${formatDeZahl(sim.F_K_kN, 1)} kN überschritten (Knickauslastung: ${formatDeZahl(sim.knickAuslastung, 0)} %). Der Druckstab knickt seitlich aus, bevor die Druckfestigkeit erreicht wird!`
                ) : sim.isVersagt ? (
                  sim.isSproede && lastArt === 'zug'
                    ? `SPRÖDBRUCH! Zugfestigkeit fctm (${formatDeWert(sim.zulSpannung)} MPa) überschritten. Werkstoff reißt schlagartig ohne plastische Fließzone ab!`
                    : `BRUCHVERSAGEN! Grenzfestigkeit (${formatDeWert(sim.zulSpannung)} MPa) überschritten.`
                ) : sim.isPlastisch ? (
                  `PLASTISCHES FLIEßEN! Streckgrenze fy (${formatDeWert(sim.fliessGrenze)} MPa) überschritten (Fließauslastung: ${formatDeZahl(sim.auslastungFliess, 0)} %)`
                ) : (
                  `Linear-elastisch tragfähig (Auslastung: ${formatDeZahl(sim.auslastungFestigkeit, 0)} %${lastArt === 'druck' ? `, Knickauslastung: ${formatDeZahl(sim.knickAuslastung, 0)} %` : ''})`
                )}
              </div>

            </div>
          </div>

          {/* Visualization (7 Spalten) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
              
              <div className="flex items-center justify-between pb-3 border-b border-home-grau/20 mb-3">
                <div>
                  <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                    <Activity size={18} className="text-shiraz" /> Stabverformung &amp; Querdehnung
                  </h3>
                  <span className="text-xs text-text-main/70 font-medium">
                    ΔL_el = {sim.deltaL_mm > 0 ? '+' : ''}{formatDeZahl(sim.deltaL_mm, 2)} mm | Einschnürung Δd = {sim.deltaD_mm > 0 ? '+' : ''}{formatDeZahl((sim.deltaD_mm * 1000), 1)} µm
                  </span>
                </div>
                <span className="text-[11px] font-mono bg-off-white text-slate-700 px-2.5 py-1 rounded border border-home-grau/20">
                  U = {formatDeZahl(sim.U_Joule, 2)} J
                </span>
              </div>

              {/* 2D Technical SVG Visualization with White Background */}
              <div className="relative w-full aspect-16/9 max-h-[360px] bg-white rounded-xl overflow-hidden border border-home-grau/30 shadow-sm flex items-center justify-center p-2">
                <svg width="100%" height="100%" viewBox="0 0 520 280" className="select-none">
                  <defs>
                    <pattern id="gridMech" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#gridMech)" />

                  {/* Lagerung Links (Feste Einspannung) */}
                  <g transform="translate(60, 140)">
                    <rect x="-16" y="-60" width="16" height="120" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
                    {[-50, -35, -20, -5, 10, 25, 40, 55].map((y, i) => (
                      <line key={i} x1="-16" y1={y} x2="-26" y2={y + 10} stroke="#64748b" strokeWidth="1.5" />
                    ))}
                    <line x1="0" y1="-70" x2="0" y2="70" stroke="#1e293b" strokeWidth="3" />
                  </g>

                  {/* Parameter für Deformation */}
                  {(() => {
                    const originX = 60;
                    const originY = 140;
                    const baseWidth = 320;
                    const baseHeight = 50;

                    const visualDeltaL = Math.max(-50, Math.min(80, sim.deltaL_mm * 15));
                    const currentWidth = baseWidth + visualDeltaL;

                    const visualDeltaH = -Math.sign(visualDeltaL) * Math.min(18, Math.abs(visualDeltaL) * 0.35);
                    const currentHeight = Math.max(16, baseHeight + visualDeltaH);

                    return (
                      <g>
                        {/* Ursprünglicher Stabkontur */}
                        <rect
                          x={originX}
                          y={originY - baseHeight / 2}
                          width={baseWidth}
                          height={baseHeight}
                          fill="none"
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                          strokeDasharray="5 4"
                          rx="2"
                        />
                        <text x={originX + baseWidth / 2} y={originY - baseHeight / 2 - 8} fill="#94a3b8" fontSize="10" textAnchor="middle" className="font-mono">
                          Ausgangszustand: L0 = {formatDeZahl(stabLaengeM, 1)} m, d0 = {formatDeZahl(sim.d0_mm, 0)} mm
                        </text>

                        {/* Verformter Stab */}
                        <rect
                          x={originX}
                          y={originY - currentHeight / 2}
                          width={currentWidth}
                          height={currentHeight}
                          fill={sim.isVersagt ? 'rgba(239, 68, 68, 0.15)' : sim.isPlastisch ? 'rgba(245, 158, 11, 0.15)' : 'rgba(163, 17, 62, 0.12)'}
                          stroke={sim.isVersagt ? '#dc2626' : sim.isPlastisch ? '#d97706' : '#A3113E'}
                          strokeWidth={sim.isPlastisch ? 3 : 2}
                          rx="3"
                        />

                        {/* Kraftpfeile am rechten Stabende */}
                        <g transform={`translate(${originX + currentWidth}, ${originY})`}>
                          {lastArt === 'zug' ? (
                            <>
                              <line x1="0" y1="0" x2="45" y2="0" stroke="#dc2626" strokeWidth="3" />
                              <polygon points="45,0 35,-5 35,5" fill="#dc2626" />
                              <text x="50" y="4" fill="#dc2626" fontSize="12" fontWeight="bold">
                                +F = {formatDeWert(kraftKn)} kN
                              </text>
                            </>
                          ) : (
                            <>
                              <line x1="50" y1="0" x2="5" y2="0" stroke="#b45309" strokeWidth="3" />
                              <polygon points="5,0 15,-5 15,5" fill="#b45309" />
                              <text x="55" y="4" fill="#b45309" fontSize="12" fontWeight="bold">
                                -F = {formatDeWert(kraftKn)} kN
                              </text>
                            </>
                          )}
                        </g>

                        {/* Längenänderung Maßlinie unten */}
                        <g transform={`translate(${originX}, ${originY + baseHeight / 2 + 25})`}>
                          <line x1="0" y1="0" x2={currentWidth} y2="0" stroke="#475569" strokeWidth="1.5" />
                          <line x1="0" y1="-5" x2="0" y2="5" stroke="#475569" strokeWidth="1.5" />
                          <line x1={currentWidth} y1="-5" x2={currentWidth} y2="5" stroke="#475569" strokeWidth="1.5" />
                          
                          <text x={currentWidth / 2} y="15" fill="#334155" fontSize="11" fontWeight="bold" textAnchor="middle">
                            L = {formatDeZahl(sim.endLaenge_mm, 1)} mm (ΔL_el = {sim.deltaL_mm > 0 ? '+' : ''}{formatDeZahl(sim.deltaL_mm, 2)} mm)
                          </text>
                        </g>

                        {/* Querkontraktion Indikator-Pfeile */}
                        {Math.abs(visualDeltaH) > 1.5 && (
                          <g transform={`translate(${originX + currentWidth / 2}, ${originY})`}>
                            {lastArt === 'zug' ? (
                              <>
                                <line x1="0" y1={-baseHeight / 2} x2="0" y2={-currentHeight / 2} stroke="#b45309" strokeWidth="1.5" />
                                <line x1="0" y1={baseHeight / 2} x2="0" y2={currentHeight / 2} stroke="#b45309" strokeWidth="1.5" />
                                <text x="8" y="3" fill="#b45309" fontSize="9" fontWeight="bold" className="font-mono">
                                  -Δd = {formatDeZahl((sim.deltaD_mm * 1000), 0)} µm
                                </text>
                              </>
                            ) : (
                              <>
                                <line x1="0" y1={-currentHeight / 2} x2="0" y2={-baseHeight / 2} stroke="#0284c7" strokeWidth="1.5" />
                                <line x1="0" y1={currentHeight / 2} x2="0" y2={baseHeight / 2} stroke="#0284c7" strokeWidth="1.5" />
                                <text x="8" y="3" fill="#0284c7" fontSize="9" fontWeight="bold" className="font-mono">
                                  +Δd = {formatDeZahl((Math.abs(sim.deltaD_mm) * 1000), 0)} µm
                                </text>
                              </>
                            )}
                          </g>
                        )}
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Steifigkeits- & Rheologie-Cockpit Live */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase block font-bold">Dehnsteifigkeit EA</span>
                  <span className="font-mono font-bold text-shiraz">{formatDeZahl(sim.EA_MN, 2)} MN</span>
                </div>
                <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase block font-bold">Biegesteifigkeit EI</span>
                  <span className="font-mono font-bold text-shiraz">{formatDeZahl(sim.EI_kNm2, 2)} kNm²</span>
                </div>
                <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase block font-bold">Langzeit ΔL (Kriechen)</span>
                  <span className="font-mono font-bold text-blue-700">
                    {sim.deltaL_kriechen_mm > 0 ? '+' : ''}{formatDeZahl(sim.deltaL_kriechen_mm, 2)} mm
                  </span>
                </div>
                <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-center">
                  <span className="text-[10px] text-text-main/60 uppercase block font-bold">Schwindverkürzung</span>
                  <span className="font-mono font-bold text-amber-700">{formatDeZahl(sim.deltaL_schwinden_mm, 2)} mm</span>
                </div>
              </div>

              {/* Gesamtverformungs-Banner */}
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-text-main block">Gesamtverformung nach Kriechen &amp; Schwinden:</span>
                  <span className="text-[10px] text-text-main/70">
                    ΔL_ges = ΔL_el ({sim.deltaL_mm > 0 ? '+' : ''}{formatDeZahl(sim.deltaL_mm, 2)} mm) + ΔL_kriech ({sim.deltaL_kriechen_mm > 0 ? '+' : ''}{formatDeZahl(sim.deltaL_kriechen_mm, 2)} mm) + ΔL_schwind ({formatDeZahl(sim.deltaL_schwinden_mm, 2)} mm)
                  </span>
                </div>
                <div className="font-mono font-bold text-sm bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-text-main shadow-xs">
                  ΔL_ges = {sim.deltaL_gesamt_mm > 0 ? '+' : ''}{formatDeZahl(sim.deltaL_gesamt_mm, 2)} mm (L_end = {formatDeZahl(sim.endLaengeGesamt_mm, 1)} mm)
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 6: WERKSTOFF-MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-home-grau/20">
            <div>
              <h3 className="font-bold text-base text-text-main flex items-center gap-2">
                <Layers className="text-shiraz" size={18} /> Vergleichende Werkstoffkennwerte im Bauwesen
              </h3>
              <p className="text-xs text-text-main/70">
                Gegenüberstellung typischer elastischer, rheologischer und bruchmechanischer Kennwerte nach Eurocodes (EC2, EC3, EC5, DIN 18008).
              </p>
            </div>
            <span className="text-xs font-mono font-semibold bg-off-white px-2.5 py-1 rounded border border-home-grau/30">
              7 Baustoffgruppen
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/30">
                <tr>
                  <th className="p-3">Werkstoff</th>
                  <th className="p-3">Kategorie</th>
                  <th className="p-3 text-right">E-Modul [MPa]</th>
                  <th className="p-3 text-right">Querdehnzahl ν [-]</th>
                  <th className="p-3 text-right">Schubmodul G [MPa]</th>
                  <th className="p-3 text-right">Kriechzahl φ [-]</th>
                  <th className="p-3 text-right">Streckgrenze fy [MPa]</th>
                  <th className="p-3 text-right">Dichte ρ [kg/m³]</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20">
                {Object.values(MATERIALIEN).map((m) => {
                  const G = m.E / (2 * (1 + m.nu));
                  return (
                    <tr key={m.id} className="hover:bg-off-white/60 transition-colors">
                      <td className="p-3 font-bold text-text-main">{m.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {m.kategorie}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-shiraz">{formatDeWert(m.E)}</td>
                      <td className="p-3 text-right font-mono">{formatDeZahl(m.nu, 2)}</td>
                      <td className="p-3 text-right font-mono text-slate-600">{formatDeZahl(G, 0)}</td>
                      <td className="p-3 text-right font-mono font-semibold text-blue-800">{m.phiKriechen !== undefined ? formatDeZahl(m.phiKriechen, 1) : '-'}</td>
                      <td className="p-3 text-right font-mono font-semibold">{formatDeWert(m.fy)}</td>
                      <td className="p-3 text-right font-mono">{formatDeWert(m.dichte)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs text-text-main/80 space-y-2 mt-4">
            <div className="font-bold text-text-main">Wichtige baustoffliche Faustregeln:</div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-text-main/75 pl-1">
              <li><strong>Baustahl (S235/S355):</strong> Der E-Modul ist mit <InlineMath math="210.000\text{ MPa}" /> für alle Festigkeitsklassen identisch! Höherfester Stahl ist nicht dehnsteifer, sondern beginnt erst bei höherer Last zu fließen.</li>
              <li><strong>Dehnsteifigkeit vs. Biegesteifigkeit:</strong> Bei Verdopplung der Bauteilhöhe verdoppelt sich die Dehnsteifigkeit (<InlineMath math="EA \propto h" />), während sich die Biegesteifigkeit <strong>verachtfacht</strong> (<InlineMath math="EI \propto h^3" />).</li>
              <li><strong>Betonkriechen:</strong> Bei dauerbelasteten Bauteilen sinkt der effektive E-Modul auf <InlineMath math="E_{c,\text{eff}} = \frac{E_{cm}}{1+\varphi}" /> (z. B. von 33.000 MPa auf 11.000 MPa bei <InlineMath math="\varphi = 2{,}0" />).</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 7: GERECHNETE BEISPIELE */}
      {activeTab === 'beispiele' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Beispiel 1: Stahlbau Zugstab */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <h3 className="font-bold text-base text-text-main flex items-center gap-2">
                <CheckCircle2 className="text-emerald-600" size={18} /> Beispiel 1: Zugstab im Stahlbau &amp; Dehnsteifigkeit EA (DIN EN 1993-1-1)
              </h3>
              <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200">
                Stahlbau S235
              </span>
            </div>

            <div className="text-xs text-text-main/80 space-y-3 leading-relaxed">
              <p>
                <strong>Aufgabenstellung:</strong> Ein Rundstahl-Zugstab aus S235 (<InlineMath math="f_y = 235\text{ MPa}, E = 210.000\text{ MPa}, \nu = 0{,}30" />) 
                mit Durchmesser <InlineMath math="d_0 = 30\text{ mm}" /> und einer Stablänge von <InlineMath math="L_0 = 4{,}00\text{ m}" /> 
                wird durch eine Zugkraft <InlineMath math="F = 120\text{ kN}" /> beansprucht.
                Gesucht sind die Dehnsteifigkeit <InlineMath math="EA" />, die Normalspannung <InlineMath math="\sigma" />, die Längsdehnung <InlineMath math="\varepsilon" />, die Verlängerung <InlineMath math="\Delta L" /> 
                und die Querschnittseinschnürung <InlineMath math="\Delta d" />.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                  <div className="font-bold text-text-main font-sans">1. Querschnitt, Dehnsteifigkeit &amp; Spannung:</div>
                  <div>A0 = π · (30 mm)² / 4 = <strong>706,86 mm²</strong></div>
                  <div>EA = 210.000 N/mm² · 706,86 mm² = <strong>148,44 MN (148.440 kN)</strong></div>
                  <div>σ = F / A0 = 120.000 N / 706,86 mm² = <strong>169,76 N/mm² (MPa)</strong></div>
                  <div className="text-emerald-700">Nachweis: σ = 169,8 MPa ≤ fy = 235 MPa (Auslastung: 72,2 %) ✓</div>
                </div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                  <div className="font-bold text-text-main font-sans">2. Dehnung &amp; Verformungen:</div>
                  <div>ε = σ / E = 169,76 / 210.000 = <strong>0,000808 (0,808 ‰)</strong></div>
                  <div>ΔL = (F · L0) / EA = (120 kN · 4000 mm) / 148.440 kN = <strong>+3,23 mm</strong></div>
                  <div>ε_q = -ν · ε = -0,30 · 0,000808 = -0,000242</div>
                  <div>Δd = ε_q · d0 = -0,000242 · 30 mm = <strong>-0,0073 mm (-7,3 µm)</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Beispiel 2: Biegesteifigkeit eines Einfeldträgers */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <h3 className="font-bold text-base text-text-main flex items-center gap-2">
                <CheckCircle2 className="text-indigo-600" size={18} /> Beispiel 2: Biegesteifigkeit EI &amp; Trägerdurchbiegung (Holzbalken C24)
              </h3>
              <span className="text-xs font-mono bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded border border-indigo-200">
                Holzbau C24 (DIN EN 1995-1-1)
              </span>
            </div>

            <div className="text-xs text-text-main/80 space-y-3 leading-relaxed">
              <p>
                <strong>Aufgabenstellung:</strong> Ein Deckenbalken aus Nadelholz C24 (<InlineMath math="E_{0,\text{mean}} = 11.000\text{ MPa}" />) 
                mit Querschnitt <InlineMath math="b/h = 12 / 24\text{ cm}" /> überbrückt eine Spannweite von <InlineMath math="L = 5{,}00\text{ m}" />. 
                In Feldmitte wirkt eine Nutzlast (Einzellast) von <InlineMath math="F = 15\text{ kN}" />.
                Gesucht sind das Flächenträgheitsmoment <InlineMath math="I_y" />, die Biegesteifigkeit <InlineMath math="EI_y" /> und die maximale Durchbiegung <InlineMath math="w_{\max}" />.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                  <div className="font-bold text-text-main font-sans">1. Flächenträgheitsmoment &amp; Biegesteifigkeit:</div>
                  <div>Iy = (120 mm · (240 mm)³) / 12 = <strong>138.240.000 mm⁴ (13.824 cm⁴)</strong></div>
                  <div>EIy = 11.000 N/mm² · 138.240.000 mm⁴ = 1,521 · 10¹² N·mm²</div>
                  <div>EIy = <strong>1.520,6 kNm²</strong></div>
                </div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                  <div className="font-bold text-text-main font-sans">2. Durchbiegung (Einzellast Feldmitte):</div>
                  <div>w_max = (F · L³) / (48 · EIy)</div>
                  <div>w_max = (15.000 N · (5000 mm)³) / (48 · 1,521 · 10¹² N·mm²)</div>
                  <div>w_max = 1,875 · 10¹⁵ / 7,299 · 10¹³ = <strong>25,69 mm</strong></div>
                  <div className="text-indigo-800">Vergleich mit dem Empfehlungswert w_inst ≤ L/300 = 16,7 mm (DIN EN 1995-1-1/NA): nicht eingehalten – Querschnitt vergrößern; Kriechen (k_def) erhöht die Enddurchbiegung zusätzlich.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Beispiel 3: Massivbau Betonstütze mit Kriecheffekt */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <h3 className="font-bold text-base text-text-main flex items-center gap-2">
                <CheckCircle2 className="text-blue-600" size={18} /> Beispiel 3: Stauchung einer Betonstütze (Kriechzahl φ = 2,0 nach EC2)
              </h3>
              <span className="text-xs font-mono bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
                Massivbau C30/37
              </span>
            </div>

            <div className="text-xs text-text-main/80 space-y-3 leading-relaxed">
              <p>
                <strong>Aufgabenstellung:</strong> Eine quadratische Stahlbetonstütze (<InlineMath math="b = h = 40\text{ cm}" />, <InlineMath math="L_0 = 3{,}50\text{ m}" />) 
                aus Beton C30/37 (<InlineMath math="E_{cm} = 33.000\text{ MPa}" />, Bewehrung vereinfachend vernachlässigt) wird durch eine ständige Normalkraft <InlineMath math="N = 1200\text{ kN}" /> 
                auf Druck beansprucht. Die Kriechzahl nach DIN EN 1992-1-1 beträgt <InlineMath math="\varphi = 2{,}0" />.
                Gesucht sind die sofortige elastische Stauchung <InlineMath math="\Delta L_0" /> und die Endstauchung <InlineMath math="\Delta L_{\infty}" /> nach Abschluss des Kriechens.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                  <div className="font-bold text-text-main font-sans">1. Spannung &amp; Sofortverformung:</div>
                  <div>A = 400 mm · 400 mm = <strong>160.000 mm²</strong></div>
                  <div>σ = -1.200.000 N / 160.000 mm² = <strong>-7,50 N/mm²</strong></div>
                  <div>ε_0 = -7,50 / 33.000 = <strong>-0,227 ‰</strong></div>
                  <div>ΔL_0 = ε_0 · 3500 mm = <strong>-0,80 mm</strong></div>
                </div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                  <div className="font-bold text-text-main font-sans">2. Langzeitverformung mit Kriechzahl φ = 2,0:</div>
                  <div>E_c,eff = E_cm / (1 + φ) = 33.000 / (1 + 2,0) = <strong>11.000 MPa</strong></div>
                  <div>ε_end = -7,50 / 11.000 = -0,682 ‰ = ε_0 · (1 + φ)</div>
                  <div>ΔL_end = ε_end · 3500 mm = <strong>-2,39 mm</strong></div>
                  <div className="text-blue-700">Kriechanteil allein: ΔL_kriechen = -1,59 mm</div>
                </div>
              </div>
            </div>
          </div>

          {/* Beispiel 4: Spannbeton Relaxation */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <h3 className="font-bold text-base text-text-main flex items-center gap-2">
                <CheckCircle2 className="text-purple-600" size={18} /> Beispiel 4: Spannkraftverlust durch Stahlrelaxation (DIN EN 1992-1-1 Abs. 3.3.2)
              </h3>
              <span className="text-xs font-mono bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded border border-purple-200">
                Spannbeton Y1860
              </span>
            </div>

            <div className="text-xs text-text-main/80 space-y-3 leading-relaxed">
              <p>
                <strong>Aufgabenstellung:</strong> Ein Spannstahl Y1860 (<InlineMath math="f_{pk} = 1860\text{ MPa}, f_{p0{,}1k} = 1600\text{ MPa}" />) 
                wird mit <InlineMath math="\sigma_{p0} = 0{,}75 \cdot f_{pk} = 1395\text{ MPa}" /> vorgespannt. Die Dehnung wird konstant gehalten (<InlineMath math="\varepsilon_p = \text{konst.}" />).
                Für Spannstahllitzen der Klasse 2 (niedrige Relaxation nach DIN EN 1992-1-1, 3.3.2) beträgt der 1000-Stunden-Relaxationsverlust <InlineMath math="\rho_{1000} = 2{,}5\,\%" />.
                Gesucht ist der 1000-Stunden-Spannungsverlust <InlineMath math="\Delta\sigma_{pr}" />.
              </p>

              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div>Ausnutzungsgrad: μ = σ_p0 / f_pk = 1395 / 1860 = <strong>0,75</strong></div>
                <div>Relaxationsverlust nach Eurocode 2:</div>
                <div>Δσ_pr / σ_p0 = 0,66 · ρ_1000 · e^(9,1 · μ) · (t / 1000)^(0,75·(1-μ)) · 10⁻⁵</div>
                <div>Δσ_pr / σ_p0 = 0,66 · 2,5 · e^(9,1 · 0,75) · 1,0 · 10⁻⁵ = 1,65 · 920,58 · 10⁻⁵ = <strong>0,0152 (1,52 %)</strong></div>
                <div>Spannungsverlust nach 1000 h: Δσ_pr = 0,0152 · 1395 MPa = <strong>21,2 MPa</strong></div>
                <div>Verbleibende Vorspannung: σ_p(1000h) = 1395 - 21,2 = <strong>1373,8 MPa</strong></div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="mechanische_kenngroessen" />

      {/* FOOTER */}
      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 5 Mechanik: Rechenbeispiele nachgerechnet, Relaxationsklasse und Durchbiegungsgrenze korrigiert, Normausgaben ergänzt; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Mechanische Spannung', url: 'https://de.wikipedia.org/wiki/Mechanische_Spannung' },
          { title: 'Dehnung', url: 'https://de.wikipedia.org/wiki/Dehnung' },
          { title: 'Elastizitätsmodul', url: 'https://de.wikipedia.org/wiki/Elastizit%C3%A4tsmodul' },
          { title: 'Kriechen (Werkstoffe)', url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
          { title: 'Schwinden', url: 'https://de.wikipedia.org/wiki/Schwinden' },
          { title: 'Spannungsrelaxation', url: 'https://de.wikipedia.org/wiki/Spannungsrelaxation' },
          { title: 'Biegesteifigkeit', url: 'https://de.wikipedia.org/wiki/Biegesteifigkeit' }
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 6892-1:2020-06 (Metallische Werkstoffe – Zugversuch – Teil 1: Prüfverfahren bei Raumtemperatur)' },
          { title: 'DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3, 3.2.6 Werkstoffkennwerte); neue Generation DIN EN 1993-1-1:2025-04' },
          { title: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 (Eurocode 2, 3.1.4 Kriechen und Schwinden, 3.3.2 Relaxation); neue Generation DIN EN 1992-1-1:2025-09' },
          { title: 'DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA (Eurocode 5, 2.2.3 Verformungen, 3.2 k_def)' }
        ]}
        literatur={[
          'Gross, D., Hauger, W., Schröder, J., Wall, W. A.: Technische Mechanik 2: Elastostatik (Springer Vieweg)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Kindmann, R.; Kraus, M.: Finite-Elemente-Methoden im Stahlbau. Berlin: Ernst & Sohn 2007'
        ]}
        formeln={
          activeTab === 'grundlagen'
            ? [
                {
                  formel: '\\sigma = \\frac{F}{A_0}, \\quad \\varepsilon = \\frac{\\Delta L}{L_0}',
                  erklaerung: 'Definition der Normalspannung als Schnittkraft pro Flächeneinheit und der Dehnung als relative Längenänderung.',
                  quelle: 'Gross et al.: Technische Mechanik 2'
                },
                {
                  formel: '\\nu = - \\frac{\\varepsilon_q}{\\varepsilon_{\\text{ax}}} = - \\frac{\\Delta d / d_0}{\\Delta L / L_0}',
                  erklaerung: 'Poissonzahl (Querdehnzahl) als negatives Verhältnis von Querdehnung zu Längsdehnung.',
                  quelle: 'DIN EN ISO 6892-1'
                }
              ]
            : activeTab === 'hooke_emodul'
            ? [
                {
                  formel: '\\sigma = E \\cdot \\varepsilon \\iff \\varepsilon = \\frac{\\sigma}{E}',
                  erklaerung: 'Eindimensionales Hooke\'sches Gesetz für linear-elastische isotrope Festkörper.',
                  quelle: 'Elastizitätstheorie (Hooke)'
                },
                {
                  formel: 'G = \\frac{E}{2(1+\\nu)}, \\quad K = \\frac{E}{3(1-2\\nu)}',
                  erklaerung: 'Beziehungen zwischen Elastizitätsmodul E, Schubmodul G, Kompressionsmodul K und Querdehnzahl ν.',
                  quelle: 'Elastizitätstheorie'
                }
              ]
            : activeTab === 'steifigkeiten'
            ? [
                {
                  formel: 'EA = E \\cdot A, \\quad \\Delta L = \\frac{N \\cdot L_0}{EA}',
                  erklaerung: 'Dehnsteifigkeit EA eines Stabs und daraus resultierende Längenänderung unter axialer Normalkraft N.',
                  quelle: 'Gross et al.: Technische Mechanik 2'
                },
                {
                  formel: 'EI = E \\cdot I, \\quad \\kappa(x) = -w\'\'(x) = \\frac{M(x)}{EI}',
                  erklaerung: 'Biegesteifigkeit EI und Bernoulli-Euler-Momenten-Krümmungsbeziehung.',
                  quelle: 'Balkentheorie'
                }
              ]
            : activeTab === 'kriechen_schwinden'
            ? [
                {
                  formel: '\\varepsilon(t) = \\varepsilon_{\\text{el}} \\cdot \\left[ 1 + \\varphi(t, t_0) \\right] = \\frac{\\sigma_0}{E_{c,\\text{eff}}}',
                  erklaerung: 'Gesamtverformung unter Kriecheinwirkung mit Kriechzahl φ und effektivem Kriechmodul Ec,eff.',
                  quelle: 'DIN EN 1992-1-1'
                },
                {
                  formel: '\\sigma(t) = \\sigma_0 \\cdot \\exp\\left(-\\frac{t}{\\tau_{\\text{rel}}}\\right)',
                  erklaerung: 'Exponentieller Spannungsabbau unter erzwungener konstanter Dehnung (Maxwell-Relaxation).',
                  quelle: 'Kontinuumsmechanik / Rheologie'
                }
              ]
            : [
                {
                  formel: '\\Delta L = \\frac{F \\cdot L_0}{E \\cdot A_0}',
                  erklaerung: 'Elastische Federverlängerung eines prismatischen Zugstabs konstanter Steifigkeit EA.',
                  quelle: 'Technische Mechanik'
                },
                {
                  formel: 'U = \\frac{1}{2} F \\cdot \\Delta L = \\frac{1}{2} \\frac{F^2 L_0}{E A_0}',
                  erklaerung: 'Elastische Formänderungsenergie (Federarbeit) unter quasi-statischer Lasteinleitung.',
                  quelle: 'Arbeitssatz der Elastomechanik'
                }
              ]
        }
      />

    </div>
  );
}
