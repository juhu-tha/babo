import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { useState, useMemo } from 'react';
import { Activity, Scale, Sliders, BookOpen, Layers, TrendingUp, Sparkles, Clock, MoveHorizontal } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath, BlockMath } from 'react-katex';
import { MATERIALIEN } from './mechanischekenngroessen/daten';
import Grundlagen from './mechanischekenngroessen/Grundlagen';
import Steifigkeiten from './mechanischekenngroessen/Steifigkeiten';
import KriechenSchwinden from './mechanischekenngroessen/KriechenSchwinden';
import Zugversuchsimulator from './mechanischekenngroessen/Zugversuchsimulator';
import Beispiele from './mechanischekenngroessen/Beispiele';

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
      masse_kg
    };
  }, [mat, lastArt, kraftKn, stabLaengeM, querschnittTyp, durchmesserMm, breiteMm, hoeheMm, kriechZahl, schwindMassPromille]);

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
      {activeTab === 'grundlagen' && <Grundlagen />}

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
      {activeTab === 'steifigkeiten' && <Steifigkeiten />}

      {/* TAB 4: KRIECHEN, SCHWINDEN & RELAXATION */}
      {activeTab === 'kriechen_schwinden' && <KriechenSchwinden rheoModus={rheoModus} rheoTauSec={rheoTauSec} rheoWert0={rheoWert0} setRheoModus={setRheoModus} setRheoTauSec={setRheoTauSec} setRheoWert0={setRheoWert0} />}

      {/* TAB 5: INTERAKTIVER SIMULATOR */}
      {activeTab === 'simulator' && <Zugversuchsimulator breiteMm={breiteMm} durchmesserMm={durchmesserMm} handleSelectMaterial={handleSelectMaterial} hoeheMm={hoeheMm} kraftKn={kraftKn} kriechZahl={kriechZahl} lastArt={lastArt} mat={mat} materialKey={materialKey} querschnittTyp={querschnittTyp} schwindMassPromille={schwindMassPromille} setBreiteMm={setBreiteMm} setDurchmesserMm={setDurchmesserMm} setHoeheMm={setHoeheMm} setKraftKn={setKraftKn} setKriechZahl={setKriechZahl} setLastArt={setLastArt} setQuerschnittTyp={setQuerschnittTyp} setSchwindMassPromille={setSchwindMassPromille} setStabLaengeM={setStabLaengeM} sim={sim} stabLaengeM={stabLaengeM} />}

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
      {activeTab === 'beispiele' && <Beispiele />}

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
