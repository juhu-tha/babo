import React, { useState, useMemo } from 'react';
import { 
  Zap, Info, FileCheck, Home, Calculator, Sliders, Scale,
  TrendingDown, ArrowUpRight, Flame, Wind, Layers
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { InlineMath, BlockMath } from 'react-katex';

export default function Energieausweis() {
  const [activeTab, setActiveTab] = useState<'uebersicht' | 'annahmen_berechnung' | 'simulator' | 'praxis_recht'>('uebersicht');

  // State für interaktive Skala im Übersichtstab
  const [scaleHouseType, setScaleHouseType] = useState<'altbau_unsaniert' | 'altbau_saniert' | 'neubau_geg' | 'neubau_eh40'>('altbau_unsaniert');
  const [methodToggle, setMethodToggle] = useState<'bedarf' | 'verbrauch'>('bedarf');

  // Simulator State
  const [simBuildingType, setSimBuildingType] = useState<'efh' | 'mfh'>('efh');
  const [simArea, setSimArea] = useState<number>(150); // m² Wohnfläche / Bezugsfläche
  const [simHuelleStandard, setSimHuelleStandard] = useState<'unsaniert' | 'bestand_teilsaniert' | 'geg_standard' | 'effizienzhaus40'>('geg_standard');
  const [simVentilation, setSimVentilation] = useState<'fenster' | 'abluft' | 'kwl_wrg'>('fenster');
  const [simHeizung, setSimHeizung] = useState<'gas_brennwert' | 'oel_kessel' | 'pellets' | 'wp_luft' | 'wp_sole' | 'fernwaerme'>('wp_luft');

  // Skalenwerte für Übersicht
  const getScaleValue = () => {
    switch (scaleHouseType) {
      case 'altbau_unsaniert': return { val: 260, class: 'H', desc: 'Typischer unsanierter Altbau (vor der 1. WSVO 1977)' };
      case 'altbau_saniert': return { val: 85, class: 'C', desc: 'Umfassend energetisch modernisierter Altbau' };
      case 'neubau_geg': return { val: 55, class: 'B', desc: 'Standard-Neubau nach Mindestanforderung GModG/GEG (55 % des Referenzgebäudes)' };
      case 'neubau_eh40': return { val: 25, class: 'A+', desc: 'KfW/BEG Effizienzhaus 40 (höchster Dämmstandard)' };
    }
  };

  const getPositionStyle = (val: number) => {
    const percentage = Math.min(100, Math.max(0, (val / 250) * 100));
    return { left: `${percentage}%` };
  };

  const currentScale = getScaleValue();

  // Berechnungslogik für den interaktiven Simulator
  const simResults = useMemo(() => {
    // 1. Spezifische Hüllwerte nach Standard
    let u_wand = 0.28;
    let u_dach = 0.20;
    let u_fenster = 1.30;
    let delta_u_wb = 0.05;

    if (simHuelleStandard === 'unsaniert') {
      u_wand = 1.40;
      u_dach = 1.20;
      u_fenster = 3.00;
      delta_u_wb = 0.10;
    } else if (simHuelleStandard === 'bestand_teilsaniert') {
      u_wand = 0.45;
      u_dach = 0.30;
      u_fenster = 1.60;
      delta_u_wb = 0.07;
    } else if (simHuelleStandard === 'geg_standard') {
      u_wand = 0.24;
      u_dach = 0.18;
      u_fenster = 1.10;
      delta_u_wb = 0.05;
    } else if (simHuelleStandard === 'effizienzhaus40') {
      u_wand = 0.14;
      u_dach = 0.11;
      u_fenster = 0.75;
      delta_u_wb = 0.02; // wärmebrückenoptimiert
    }

    // Geometrische Näherung für Hüllflächen abhängig von A_N und Typ
    const a_wand = simBuildingType === 'efh' ? simArea * 1.2 : simArea * 0.7;
    const a_dach = simBuildingType === 'efh' ? simArea * 0.6 : simArea * 0.3;
    const a_fenster = simArea * 0.22;
    const a_boden = a_dach;
    const u_boden = simHuelleStandard === 'unsaniert' ? 0.90 : simHuelleStandard === 'bestand_teilsaniert' ? 0.50 : 0.25;
    const a_huelle_ges = a_wand + a_dach + a_fenster + a_boden;

    // Transmissionswärmetransferkoeffizient H_T [W/K]
    const h_t = (
      a_wand * u_wand * 1.0 +
      a_dach * u_dach * 1.0 +
      a_fenster * u_fenster * 1.0 +
      a_boden * u_boden * 0.6 + // F_x gegen Erdreich = 0.6
      a_huelle_ges * delta_u_wb
    );
    const h_t_prime = h_t / a_huelle_ges; // Spezifischer H'T [W/(m²K)]

    // Lüftungswärmetransferkoeffizient H_V [W/K]
    // Netto-Raumluftvolumen vereinfacht V ≈ 2,5 m · A_N (Lehrannahme)
    const v_netto = simArea * 2.5; 
    let n_eff = 0.5; // Luftwechselrate
    if (simVentilation === 'abluft') n_eff = 0.45;
    if (simVentilation === 'kwl_wrg') n_eff = 0.18; // ca. 80% Wärmerückgewinnung wirksam

    const h_v = v_netto * 0.34 * n_eff;

    // Jahresgradtage Deutschland (Norm-Klima TRY Potsdam ca. 66.000 Kh/a bis 75.000 Kh/a, ca. 2.900 Kd/a)
    const f_klima_k = 72; // kKh/a (Faktor zur Abschätzung des jährlichen Verlusts)
    const q_t_jahr = (h_t * f_klima_k) / simArea; // kWh/(m² a)
    const q_v_jahr = (h_v * f_klima_k) / simArea; // kWh/(m² a)

    // Solare & Interne Wärmegewinne
    const q_solar = (a_fenster * (simHuelleStandard === 'effizienzhaus40' ? 140 : 160)) / simArea; // ca. 25-35 kWh/(m²a)
    const q_intern = 35; // standardisiert ca. 35-40 kWh/(m²a)
    const eta_ausnutzung = simHuelleStandard === 'effizienzhaus40' ? 0.75 : simHuelleStandard === 'unsaniert' ? 0.98 : 0.88;
    const q_gewinne = eta_ausnutzung * (q_solar + q_intern);

    // 1. Nutzwärmebedarf Heizung Q_h
    const q_h = Math.max(10, Math.round(q_t_jahr + q_v_jahr - q_gewinne));

    // Warmwasserbedarf (standardisiert DIN V 18599)
    const q_w = 12.5; // kWh/(m² a)

    // 2. Anlagentechnik & Endenergiebedarf Q_E
    let eta_erzeuger = 0.95;
    let jaz = 1.0;
    let f_p = 1.1;
    let co2_faktor = 240; // g/kWh

    switch (simHeizung) {
      case 'gas_brennwert':
        eta_erzeuger = 0.96;
        f_p = 1.1;
        co2_faktor = 240;
        break;
      case 'oel_kessel':
        eta_erzeuger = 0.84;
        f_p = 1.1;
        co2_faktor = 310;
        break;
      case 'pellets':
        eta_erzeuger = 0.88;
        f_p = 0.2;
        co2_faktor = 30; // biogen
        break;
      case 'wp_luft':
        jaz = 3.3;
        eta_erzeuger = 1.0;
        f_p = 1.8;
        co2_faktor = 380; // Strommix
        break;
      case 'wp_sole':
        jaz = 4.3;
        eta_erzeuger = 1.0;
        f_p = 1.8;
        co2_faktor = 380;
        break;
      case 'fernwaerme':
        eta_erzeuger = 0.98;
        f_p = 0.4;
        co2_faktor = 120;
        break;
    }

    // Anlagenverluste Verteilung & Speicher
    const q_verlust_netz = simHuelleStandard === 'unsaniert' ? 14 : 7;
    const w_hilfsstrom = simHeizung.startsWith('wp') ? 2.5 : 3.5;

    let q_e = 0;
    if (simHeizung.startsWith('wp')) {
      q_e = ((q_h + q_w + q_verlust_netz) / jaz) + w_hilfsstrom;
    } else {
      q_e = ((q_h + q_w + q_verlust_netz) / eta_erzeuger) + w_hilfsstrom;
    }
    q_e = Math.round(q_e);

    // 3. Primärenergiebedarf Q_P
    let q_p = 0;
    if (simHeizung.startsWith('wp')) {
      q_p = Math.round(q_e * f_p);
    } else {
      const q_brennstoff = (q_h + q_w + q_verlust_netz) / eta_erzeuger;
      q_p = Math.round(q_brennstoff * f_p + w_hilfsstrom * 1.8);
    }

    // CO2-Emissionen [kg/(m² a)]
    const co2_emissionen = Math.round((q_e * co2_faktor) / 1000);

    // Effizienzklasse (Wohngebäude, GModG/GEG Anlage 10 zu § 86)
    let klasse = 'H';
    let klasseColor = 'bg-red-800 text-white';
    if (q_e <= 30) {
      klasse = 'A+';
      klasseColor = 'bg-green-700 text-white';
    } else if (q_e <= 50) {
      klasse = 'A';
      klasseColor = 'bg-green-600 text-white';
    } else if (q_e <= 75) {
      klasse = 'B';
      klasseColor = 'bg-green-500 text-white';
    } else if (q_e <= 100) {
      klasse = 'C';
      klasseColor = 'bg-lime-500 text-slate-900';
    } else if (q_e <= 130) {
      klasse = 'D';
      klasseColor = 'bg-yellow-400 text-slate-900';
    } else if (q_e <= 160) {
      klasse = 'E';
      klasseColor = 'bg-orange-400 text-white';
    } else if (q_e <= 200) {
      klasse = 'F';
      klasseColor = 'bg-orange-500 text-white';
    } else if (q_e <= 250) {
      klasse = 'G';
      klasseColor = 'bg-red-600 text-white';
    }

    return {
      q_h,
      q_e,
      q_p,
      h_t_prime: formatDeZahl(h_t_prime, 2),
      co2_emissionen,
      klasse,
      klasseColor,
      q_t_jahr: Math.round(q_t_jahr),
      q_v_jahr: Math.round(q_v_jahr),
      q_gewinne: Math.round(q_gewinne),
      f_p,
      // Zwischenwerte für den Live-Rechenweg (ungerundet)
      h_t, h_v, n_eff, v_netto, f_klima_k,
      q_t_roh: q_t_jahr, q_v_roh: q_v_jahr, q_solar, q_intern, eta_ausnutzung, q_gewinne_roh: q_gewinne,
      q_w, q_verlust_netz, w_hilfsstrom, jaz, eta_erzeuger,
      istWP: simHeizung.startsWith('wp')
    };
  }, [simBuildingType, simArea, simHuelleStandard, simVentilation, simHeizung]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Kopfbereich */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Zap className="text-shiraz" /> Der Energieausweis (nach GModG/GEG &amp; DIN V 18599)
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
          <p>
            Der <strong>Energiebedarfsausweis</strong> bewertet die energetische Beschaffenheit eines Gebäudes anhand einer 
            ingenieurmäßigen Bilanzierung von Hüllfläche und Anlagentechnik nach <strong>DIN V 18599</strong>. 
            Im Gegensatz zum verbrauchsbasierten Ausweis ist er <strong>vollständig nutzerunabhängig</strong> und 
            erlaubt die objektive energetische Vergleichbarkeit von Gebäuden unabhängig vom individuellen Heizverhalten der Bewohner.
          </p>
        </div>

        {/* Rechtsstand GModG Infobox */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 my-4 flex items-start gap-2.5">
          <Info className="text-amber-700 shrink-0 mt-0.5" size={16} />
          <div>
            <strong>Rechtsstand:</strong> Beschluss von Bundestag und Bundesrat am 10.07.2026, Verkündung am 28.07.2026, Inkrafttreten gestaffelt ab 29.07.2026. Das GEG heißt seither Gebäudemodernisierungsgesetz; Paragrafen zu Neubauanforderungen (§§ 15, 16) und Energieausweisen (§§ 79–88) bleiben bestehen. Die 65-%-Vorgabe entfällt; für neu eingebaute Gas- und Ölheizungen gilt eine „Bio-Treppe“ mit 10 % (2029), 15 % (2030), 30 % (2035) und 60 % (2040) klimafreundlichen Brennstoffen.
          </div>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button aria-pressed={activeTab === 'uebersicht'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'uebersicht' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('uebersicht')}
          >
            <FileCheck size={16} /> Übersicht &amp; Skala
          </button>
          
          <button aria-pressed={activeTab === 'annahmen_berechnung'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'annahmen_berechnung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('annahmen_berechnung')}
          >
            <Calculator size={16} /> Annahmen &amp; 3-Stufen-Rechnung
          </button>

          <button aria-pressed={activeTab === 'simulator'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'simulator' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('simulator')}
          >
            <Sliders size={16} /> Interaktiver Bedarfs-Rechner
          </button>

          <button aria-pressed={activeTab === 'praxis_recht'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'praxis_recht' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('praxis_recht')}
          >
            <Scale size={16} /> Praxis, Rebound &amp; GModG-Recht
          </button>
        </div>

        {/* TAB 1: ÜBERSICHT & FARBSKALA */}
        {activeTab === 'uebersicht' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="font-bold text-text-main text-base">Bedarfs- vs. Verbrauchsausweis: Wann gilt welcher Ausweis?</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div 
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  methodToggle === 'bedarf' 
                    ? 'bg-shiraz/5 border-shiraz/40 ring-1 ring-shiraz/30 shadow-xs' 
                    : 'bg-off-white border-home-grau/30 hover:border-home-grau/50'
                }`}
                onClick={() => setMethodToggle('bedarf')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-text-main flex items-center gap-2">
                    <FileCheck size={18} className="text-shiraz" /> Bedarfsausweis (Objektiv &amp; Berechnet)
                  </h4>
                  <span className="text-xxs font-bold px-2 py-0.5 rounded-full bg-shiraz/10 text-shiraz">
                    GEG-Standard
                  </span>
                </div>
                <ul className="text-xs text-text-main/80 space-y-2 list-disc pl-5">
                  <li>Wird durch eine <strong>physikalisch-technische Berechnung</strong> der Gebäudehülle (U-Werte von Wänden, Dach, Fenster) und der Anlagentechnik nach DIN V 18599 ermittelt.</li>
                  <li><strong>Vollständig nutzerunabhängig:</strong> Simuliert standardisierte Raumtemperaturen (19–20 °C) und Norm-Luftwechselraten.</li>
                  <li><strong>Gesetzliche Pflicht</strong> für alle Neubauten sowie Bestandsgebäude mit weniger als 5 Wohneinheiten, deren Bauantrag vor dem 1. November 1977 gestellt wurde und die nicht die 1. WSVO 1977 erfüllen.</li>
                  <li>Ermöglicht energetische Sanierungsfahrpläne (iSFP) und deckt bauliche Schwachstellen zuverlässig auf.</li>
                </ul>
              </div>
              
              <div 
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  methodToggle === 'verbrauch' 
                    ? 'bg-shiraz/5 border-shiraz/40 ring-1 ring-shiraz/30 shadow-xs' 
                    : 'bg-off-white border-home-grau/30 hover:border-home-grau/50'
                }`}
                onClick={() => setMethodToggle('verbrauch')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-text-main flex items-center gap-2">
                    <Home size={18} className="text-shiraz" /> Verbrauchsausweis (Abrechnungsbasiert)
                  </h4>
                  <span className="text-xxs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Eingeschränkt zulässig
                  </span>
                </div>
                <ul className="text-xs text-text-main/80 space-y-2 list-disc pl-5">
                  <li>Basiert auf den <strong>realen Heizkostenabrechnungen</strong> von drei zusammenhängenden, aktuellen Jahren unter rechnerischer Klimabereinigung.</li>
                  <li><strong>Stark nutzerabhängig:</strong> Sparsames Heizen oder Leerstand verfälscht die Kennwerte scheinbar ins Positive; hohes Komfortheizen (23 °C) bestraft das Gebäude.</li>
                  <li>Günstiger in der Erstellung, gibt aber <strong>keine verlässliche Auskunft</strong> über die tatsächliche bauliche Dämmqualität.</li>
                  <li>Nur zulässig bei Mehrfamilienhäusern (≥ 5 Wohneinheiten) oder Bestandsgebäuden, die bereits das Niveau der WSVO 1977 erfüllen.</li>
                </ul>
              </div>
            </div>

            {/* Interaktive Farbskala */}
            <div className="pt-4 border-t border-home-grau/20">
              <h3 className="font-bold text-text-main text-sm mb-3">Interaktive Energieeffizienzskala (Klassen A+ bis H nach GModG/GEG Anlage 10)</h3>
              
              <div className="flex gap-2 flex-wrap mb-4">
                <button aria-pressed={scaleHouseType === 'neubau_eh40'} 
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    scaleHouseType === 'neubau_eh40' ? 'bg-green-700 text-white border-green-700' : 'bg-off-white text-text-main border-home-grau/30'
                  }`} 
                  onClick={() => setScaleHouseType('neubau_eh40')}
                >
                  Effizienzhaus 40 (A+)
                </button>
                <button aria-pressed={scaleHouseType === 'neubau_geg'} 
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    scaleHouseType === 'neubau_geg' ? 'bg-green-600 text-white border-green-600' : 'bg-off-white text-text-main border-home-grau/30'
                  }`} 
                  onClick={() => setScaleHouseType('neubau_geg')}
                >
                  GEG-Neubau Standard (B)
                </button>
                <button aria-pressed={scaleHouseType === 'altbau_saniert'} 
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    scaleHouseType === 'altbau_saniert' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-off-white text-text-main border-home-grau/30'
                  }`} 
                  onClick={() => setScaleHouseType('altbau_saniert')}
                >
                  Altbau saniert (C)
                </button>
                <button aria-pressed={scaleHouseType === 'altbau_unsaniert'} 
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    scaleHouseType === 'altbau_unsaniert' ? 'bg-red-700 text-white border-red-700' : 'bg-off-white text-text-main border-home-grau/30'
                  }`} 
                  onClick={() => setScaleHouseType('altbau_unsaniert')}
                >
                  Altbau unsaniert vor 1977 (H)
                </button>
              </div>

              {/* Farbband */}
              <div className="w-full relative mt-12 mb-8 px-2">
                <div className="flex h-10 w-full overflow-hidden rounded-xl shadow-inner">
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-green-700" style={{width: '12%'}}>A+</div>
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-green-600" style={{width: '8%'}}>A</div>
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-green-500" style={{width: '10%'}}>B</div>
                  <div className="h-full relative font-bold text-slate-800 text-xs flex items-center justify-center bg-lime-400" style={{width: '10%'}}>C</div>
                  <div className="h-full relative font-bold text-slate-800 text-xs flex items-center justify-center bg-yellow-400" style={{width: '12%'}}>D</div>
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-orange-400" style={{width: '12%'}}>E</div>
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-orange-500" style={{width: '16%'}}>F</div>
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-red-600" style={{width: '20%'}}>G</div>
                  <div className="h-full relative font-bold text-white text-xs flex items-center justify-center bg-red-800 flex-grow">H</div>
                </div>

                <div className="flex justify-between text-xxs text-home-grau mt-2 relative w-full font-mono">
                  <span>0</span>
                  <span className="absolute left-[12%] -translate-x-1/2">30</span>
                  <span className="absolute left-[20%] -translate-x-1/2">50</span>
                  <span className="absolute left-[30%] -translate-x-1/2">75</span>
                  <span className="absolute left-[40%] -translate-x-1/2">100</span>
                  <span className="absolute left-[52%] -translate-x-1/2">130</span>
                  <span className="absolute left-[64%] -translate-x-1/2">160</span>
                  <span className="absolute left-[80%] -translate-x-1/2">200</span>
                  <span className="absolute left-[100%] -translate-x-1/2">250+</span>
                  <div className="absolute w-full mt-4 text-center text-xs text-text-main font-sans">
                    Endenergiebedarf in <strong>kWh / (m² · a)</strong>
                  </div>
                </div>

                {/* Zeiger */}
                <div 
                  className="absolute top-0 w-0 -mt-10 flex flex-col items-center transition-all duration-500 ease-out z-10"
                  style={getPositionStyle(currentScale.val)}
                >
                  <div
                    className="bg-text-main text-white px-2.5 py-1 rounded-lg font-bold text-xs shadow-md whitespace-nowrap"
                    style={(() => { const p = Math.min(100, Math.max(0, (currentScale.val / 250) * 100)); return { transform: `translateX(${p > 75 ? -(p - 75) * 1.6 : p < 25 ? (25 - p) * 1.6 : 0}%)` }; })()}
                  >
                    {formatDeWert(currentScale.val)}<span className="hidden sm:inline"> kWh/(m²a)</span> [Kl. {currentScale.class}]
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-text-main mt-0.5"></div>
                </div>
              </div>

              <div className="bg-off-white p-3.5 rounded-xl border border-home-grau/30 mt-12 text-xs text-text-main/90">
                <strong>Typische Einstufung:</strong> {currentScale.desc}.
              </div>
            </div>

            {/* Historie der Vorschriften */}
            <div className="pt-4 border-t border-home-grau/20">
              <h3 className="font-bold text-text-main text-sm mb-3">Historischer Stufenplan: Von der 1. WSVO 1977 zum GModG 2026</h3>
              <div className="text-xs text-text-main/80 space-y-3 relative border-l-2 border-shiraz/40 ml-2 pl-4">
                <div>
                  <strong className="text-text-main block">1977 – 1. Wärmeschutzverordnung (WSVO):</strong>
                  Reaktion auf die erste Ölkrise von 1973. Erstmals verbindliche Obergrenzen für Wärmedurchgangskoeffizienten (k-Werte, heute U-Werte) für Außenwände, Fenster und Dächer.
                </div>
                <div>
                  <strong className="text-text-main block">1984 &amp; 1995 – 2. &amp; 3. WSVO:</strong>
                  Verschärfung der Dämmstandards; die 3. WSVO führte 1995 erstmals den Jahresheizwärmebedarf (Q_h) als zusammenhängende Bilanzgröße ein.
                </div>
                <div>
                  <strong className="text-text-main block">2002 – 1. Energieeinsparverordnung (EnEV):</strong>
                  Ganzheitlicher Sprung: Zusammenführung von baulichem Wärmeschutz und Heizungsanlagen-Verordnung (HeizAnlV). Erstmals Bilanzierung des Primärenergiebedarfs (Q_P) inklusive Anlagenverlusten und Hilfsenergie.
                </div>
                <div>
                  <strong className="text-text-main block">2020 – Gebäudeenergiegesetz (GEG):</strong>
                  Zusammenfassung von EnEG, EnEV und EEWärmeG in ein einheitliches Gesetzeswerk.
                </div>
                <div>
                  <strong className="text-text-main block">2024 – GEG-Novelle („Heizungsgesetz“) [historisch]:</strong>
                  Pflicht zur Nutzung von mindestens 65 % erneuerbaren Energien bei neu eingebauten Heizungen in Neubaugebieten bzw. nach Verabschiedung kommunaler Wärmepläne.
                </div>
                <div>
                  <strong className="text-text-main block">2026 – Gebäudemodernisierungsgesetz (GModG):</strong>
                  Beschluss von Bundestag und Bundesrat am 10.07.2026, Verkündung am 28.07.2026, Inkrafttreten gestaffelt ab 29.07.2026. Das GEG heißt seither Gebäudemodernisierungsgesetz; Paragrafen zu Neubauanforderungen (§§ 15, 16) und Energieausweisen (§§ 79–88) bleiben bestehen. Die 65-%-Vorgabe entfällt; für neu eingebaute Gas- und Ölheizungen gilt eine „Bio-Treppe“ mit 10 % (2029), 15 % (2030), 30 % (2035) und 60 % (2040) klimafreundlichen Brennstoffen.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANNAHMEN & 3-STUFEN-RECHNUNG */}
        {activeTab === 'annahmen_berechnung' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* 1. Die normierten Randbedingungen */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <h3 className="font-bold text-text-main text-base">Die normierten Standard-Annahmen (Randbedingungen)</h3>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed mb-4">
                Um eine bundesweit objektive Bewertung zu gewährleisten, schließt der Bedarfsausweis das individuelle Verhalten 
                der Bewohner (wie Dauerlüften oder Raumtemperaturen von 24 °C) vollständig aus. Die Bilanzierung erfolgt 
                auf Basis verbindlicher Normparameter nach <strong>DIN V 18599-10</strong>:
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-xs mb-1">
                    <Wind size={15} /> Referenzklima (Standort)
                  </div>
                  <p className="text-xxs text-text-main/80">
                    Einheitliches Testreferenzjahr (TRY) des Deutschen Wetterdienstes (DWD), repräsentiert durch die 
                    Klimastation <strong>Potsdam</strong>. Damit wird vermieden, dass ein Haus in den Alpen schlechter abschneidet 
                    als ein identisches Haus an der milden Nordseeküste.
                  </p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-xs mb-1">
                    <Home size={15} /> Raum-Solltemperatur
                  </div>
                  <p className="text-xxs text-text-main/80">
                    Für Wohngebäude gilt im Heizfall eine Raum-Solltemperatur von <strong><InlineMath math="\theta_{i} = 20^\circ\text{C}" /></strong> (DIN V 18599-10);
                    Nachtabsenkung und eingeschränkter Heizbetrieb werden rechnerisch berücksichtigt, sodass die wirksame Mitteltemperatur darunter liegt
                    (im früheren Monatsbilanzverfahren nach DIN V 4108-6 pauschal 19 °C).
                  </p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-xs mb-1">
                    <Wind size={15} /> Mindestluftwechselrate
                  </div>
                  <p className="text-xxs text-text-main/80">
                    Standardmäßig wird ein Luftwechsel von <strong><InlineMath math="n = 0{,}5\,\text{h}^{-1}" /></strong> unterstellt 
                    (alle zwei Stunden wird das Raumvolumen einmal komplett gegen kalte Außenluft ausgetauscht). 
                    Mit geprüfter Lüftungsanlage und WRG sinkt dieser Verlustfaktor rechnerisch beträchtlich.
                  </p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-xs mb-1">
                    <Zap size={15} /> Interne Wärmegewinne (<InlineMath math="q_i" />)
                  </div>
                  <p className="text-xxs text-text-main/80">
                    Körperwärme anwesender Personen, Lampen und Elektrogeräte heizen das Gebäude mit. 
                    Pauschaler Ansatz im vereinfachten Verfahren nach DIN V 4108-6: <strong><InlineMath math="q_i = 5\,\text{W/m}^2" /></strong> Gebäudenutzfläche
                    (über die Heizperiode rund 25 bis 30 kWh/(m²·a)). DIN V 18599-10 setzt nutzungsabhängige Tageswerte an (Wohnen: EFH 45 Wh/(m²·d), MFH 90 Wh/(m²·d)).
                  </p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-xs mb-1">
                    <Flame size={15} /> Warmwasserbedarf (<InlineMath math="q_w" />)
                  </div>
                  <p className="text-xxs text-text-main/80">
                    Im vereinfachten Verfahren (DIN V 4108-6 / DIN V 4701-10) wird der Nutzenergiebedarf für Trinkwarmwasser pauschal mit
                    <strong><InlineMath math="q_w = 12{,}5\,\text{kWh}/(\text{m}^2\cdot\text{a})" /></strong> bezogen auf die
                    Gebäudenutzfläche <InlineMath math="A_N" /> angesetzt; DIN V 18599-10 verwendet nutzungsabhängige Werte.
                  </p>
                </div>

                <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/30">
                  <div className="flex items-center gap-2 text-shiraz font-bold text-xs mb-1">
                    <Layers size={15} /> Gebäudenutzfläche (<InlineMath math="A_N" />)
                  </div>
                  <p className="text-xxs text-text-main/80">
                    Wird vereinfacht aus dem beheizten Brutto-Gebäudevolumen <InlineMath math="V_e" /> ermittelt: 
                    <strong><InlineMath math="A_N = 0{,}32 \cdot V_e" /></strong> (für mittlere Geschosshöhen von 2,5 bis 3,0 m; sonst <InlineMath math="A_N = (1/h_G - 0{,}04\,\text{m}^{-1}) \cdot V_e" />). 
                    Sie ist ca. 20–30 % größer als die reine Wohnfläche nach WoFlV!
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Der 3-Stufen-Berechnungsgang */}
            <div className="pt-4 border-t border-home-grau/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <h3 className="font-bold text-text-main text-base">Der 3-Stufen-Berechnungsgang nach DIN V 18599</h3>
              </div>

              <div className="space-y-5">
                
                {/* STUFE 1 */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xxs font-bold">Stufe 1</span>
                      Nutzwärmebedarf / Heizwärmebedarf (<InlineMath math="Q_h" />)
                    </h4>
                    <span className="text-xxs text-slate-500 font-mono">Gebäudehülle &amp; Lüftung</span>
                  </div>
                  
                  <p className="text-xs text-text-main/80 mb-3">
                    Beziffert die Netto-Wärmemenge, die den Räumen über Heizkörper oder Fußbodenheizung aktiv 
                    zugeführt werden muss, um trotz Verlusten die Solltemperatur von 19–20 °C aufrechtzuerhalten:
                  </p>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 my-2 text-center text-sm font-mono overflow-x-auto">
                    <BlockMath math="Q_h = (Q_T + Q_V) - \eta \cdot (Q_s + Q_i) \quad [\text{kWh/a}]" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs text-text-main/80 mt-3">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <strong className="text-slate-900 block mb-1">Transmissionsverlust (<InlineMath math="Q_T" />):</strong>
                      <InlineMath math="H_T = \sum (U_i \cdot A_i \cdot F_{xi}) + \Delta U_{WB} \cdot A" />
                      <p className="text-xxs text-slate-600 mt-1">
                        Wärmeabfluss durch Bauteile. <InlineMath math="F_{xi}" /> ist der Korrekturfaktor (1,0 Außenluft, 0,6 Erdreich/Keller).
                        <InlineMath math="\Delta U_{WB}" /> berücksichtigt Wärmebrücken (0,05 W/m²K bei Beiblatt 2, sonst 0,10).
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <strong className="text-slate-900 block mb-1">Lüftungsverlust (<InlineMath math="Q_V" />):</strong>
                      <InlineMath math="H_V = V_v \cdot \rho \cdot c_p \cdot n" />
                      <p className="text-xxs text-slate-600 mt-1">
                        Wärmeabfluss durch Lufterneuerung. Spezifische Wärmekapazität der Luft <InlineMath math="\rho \cdot c_p \approx 0{,}34\,\text{Wh}/(\text{m}^3\text{K})" />.
                      </p>
                    </div>
                  </div>

                  <p className="text-xxs text-slate-500 mt-2">
                    * Der Faktor <InlineMath math="\eta" /> ist der monatliche Ausnutzungsgrad der Gewinne (an sonnigen Frühlingstagen kann nicht 100 % der Sonnenwärme genutzt werden).
                  </p>
                </div>

                {/* STUFE 2 */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-xxs font-bold">Stufe 2</span>
                      Endenergiebedarf (<InlineMath math="Q_E" />)
                    </h4>
                    <span className="text-xxs text-slate-500 font-mono">Anlagentechnik &amp; Hilfsstrom</span>
                  </div>

                  <p className="text-xs text-text-main/80 mb-3">
                    Die Energiemenge, die an der Grundstücksgrenze (am Gaszähler, Stromzähler oder Pellettank) eingekauft werden muss. 
                    Hier schlagen alle <strong>technischen Ineffizienzen</strong> der Heizungsanlage zu Buche:
                  </p>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 my-2 text-center text-sm font-mono overflow-x-auto">
                    <BlockMath math="Q_E = \frac{Q_h + Q_w + Q_{\text{Verlust,Übergabe}} + Q_{\text{Verlust,Verteilung}} + Q_{\text{Verlust,Speicher}}}{\eta_{\text{Erzeuger}} \text{ bzw. } JAZ} + W_{\text{Hilfs}}" />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-2 text-xxs text-text-main/80 mt-3">
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <strong>Übergabe &amp; Regelung:</strong>
                      <p className="text-slate-600 mt-0.5">Heizkörper erzeugen höhere Deckentemperaturen als Flächenheizungen; Thermostat-Hysterese führt zu Verlusten.</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <strong>Verteilung &amp; Speicher:</strong>
                      <p className="text-slate-600 mt-0.5">Wärmeverluste ungedämmter Rohrleitungen im Kriechkeller und Standby-Verluste des Warmwasserspeichers.</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <strong>Erzeugerwirkungsgrad / JAZ:</strong>
                      <p className="text-slate-600 mt-0.5">Brennwertkessel <InlineMath math="\eta \approx 0{,}95" />; Wärmepumpen nutzen Umweltwärme (JAZ 3,0 bis 4,5), wodurch <InlineMath math="Q_E" /> drastisch sinkt.</p>
                    </div>
                  </div>

                  <p className="text-xs text-text-main font-semibold mt-3">
                    👉 Der Endenergiebedarf <InlineMath math="Q_E" /> bestimmt die Einstufung auf dem Bandtacho (Klassen A+ bis H) und korreliert mit den Heizkosten.
                  </p>
                </div>

                {/* STUFE 3 */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-xxs font-bold">Stufe 3</span>
                      Primärenergiebedarf (<InlineMath math="Q_P" />)
                    </h4>
                    <span className="text-xxs text-slate-500 font-mono">Ökologische Gesamtbilanz</span>
                  </div>

                  <p className="text-xs text-text-main/80 mb-3">
                    Der Primärenergiebedarf bewertet die ökologische Umweltbelastung inklusive der gesamten 
                    Vorkette (Förderung, Raffination, Ferntransport, Leitungsverluste im Stromnetz):
                  </p>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 my-2 text-center text-sm font-mono overflow-x-auto">
                    <BlockMath math="Q_P = \sum_i \left( Q_{E,i} \cdot f_{P,i} \right) \quad [\text{kWh/(m}^2\cdot\text{a)}]" />
                  </div>

                  <div className="mt-3">
                    <strong className="text-xs text-text-main block mb-2">Primärenergiefaktoren (<InlineMath math="f_P" />, nicht erneuerbarer Anteil) nach GModG/GEG Anlage 4:</strong>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="font-bold block text-slate-800">1,1</span>
                        <span className="text-xxs text-slate-600">Erdgas &amp; Heizöl</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="font-bold block text-emerald-700">0,2</span>
                        <span className="text-xxs text-slate-600">Holzpellets / Scheitholz</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="font-bold block text-blue-700">1,8</span>
                        <span className="text-xxs text-slate-600">Strom-Mix (Netzbezug)</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="font-bold block text-amber-700">0,0 – 0,7</span>
                        <span className="text-xxs text-slate-600">Fernwärme (KWK)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xxs text-amber-900">
                    <strong>Wichtige Besonderheit bei Wärmepumpen:</strong> Obwohl der Strom-Primärenergiefaktor mit 1,8 höher als bei Gas (1,1) liegt, 
                    ist der Gesamt-Primärenergiebedarf einer Wärmepumpe wegen der Jahresarbeitszahl von ca. 3,5 viel geringer:
                    <br />
                    <InlineMath math="Q_P \approx \frac{Q_h}{3{,}5} \cdot 1{,}8 = Q_h \cdot 0{,}51" /> (mehr als 50 % Primärenergie-Einsparung gegenüber Gasbrennwert!).
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Das Referenzgebäude-Verfahren */}
            <div className="pt-4 border-t border-home-grau/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <h3 className="font-bold text-text-main text-base">Der gesetzliche Nachweis: Das Referenzgebäude-Verfahren</h3>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-xs text-text-main/80 space-y-2">
                <p>
                  Im Neubau schreibt das GModG (vormals GEG) keine starre absolute Zahl vor,
                  sondern arbeitet mit einem virtuellen <strong>Referenzgebäude</strong> (Anlage 1, §§ 15 und 16):
                </p>
                <div className="grid sm:grid-cols-2 gap-3 my-2">
                  <div className="p-3 bg-white rounded-lg border border-home-grau/30">
                    <strong className="text-text-main block mb-1">1. Primärenergie-Anforderung:</strong>
                    <BlockMath math="Q_{P,\text{Ist}} \le 0{,}55 \cdot Q_{P,\text{Ref}}" />
                    <p className="text-xxs text-slate-600">Seit 2023 gilt für neue Wohngebäude das EH-55-Niveau als gesetzlicher Mindeststandard (§ 15: 55 % des Referenzgebäudes).</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-home-grau/30">
                    <strong className="text-text-main block mb-1">2. Baulicher Wärmeschutz (Hülle):</strong>
                    <BlockMath math="H'_{T,\text{Ist}} \le H'_{T,\text{Ref}}" />
                    <p className="text-xxs text-slate-600">§ 16: höchstens das 1,0-Fache des Referenzwerts. Verhindert, dass schlechte Dämmung durch effiziente Haustechnik ausgeglichen wird.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: INTERAKTIVER SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-bold text-text-main text-base mb-1">Live-Simulator: Bedarfsausweis nach DIN V 18599 berechnen</h3>
              <p className="text-xs text-text-main/70">
                Verändern Sie Gebäudeparameter, Dämmstandards und Heiztechnik, um in Echtzeit die Auswirkung 
                auf Nutzwärme (<InlineMath math="Q_h" />), Endenergie (<InlineMath math="Q_E" />), Primärenergie (<InlineMath math="Q_P" />) 
                und die Energieeffizienzklasse zu sehen.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Parameter-Eingaben (7 Spalten) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* 1. Gebäudegeometrie */}
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Home size={15} className="text-shiraz" /> 1. Gebäudegröße &amp; Typ
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button aria-pressed={simBuildingType === 'efh'}
                      onClick={() => setSimBuildingType('efh')}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        simBuildingType === 'efh' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      Einfamilienhaus (freistehend)
                    </button>
                    <button aria-pressed={simBuildingType === 'mfh'}
                      onClick={() => setSimBuildingType('mfh')}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        simBuildingType === 'mfh' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      Mehrfamilienhaus (kompakt)
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-text-main mb-1">
                      <span>Gebäudenutzfläche (<InlineMath math="A_N" />):</span>
                      <strong className="font-mono">{formatDeWert(simArea)} m²</strong>
                    </div>
                    <input 
                      type="range" 
                      min="80" 
                      max="400" 
                      step="10" 
                      value={simArea} 
                      onChange={(e) => setSimArea(Number(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                  </div>
                </div>

                {/* 2. Dämmstandard der Gebäudehülle */}
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Layers size={15} className="text-shiraz" /> 2. Thermische Gebäudehülle (U-Werte)
                  </span>

                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    <button aria-pressed={simHuelleStandard === 'unsaniert'}
                      onClick={() => setSimHuelleStandard('unsaniert')}
                      className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                        simHuelleStandard === 'unsaniert' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block">Vor 1977 (unsaniert)</strong>
                      <span className="text-xxs opacity-80">Wand U≈1.4, Fenster U≈3.0</span>
                    </button>

                    <button aria-pressed={simHuelleStandard === 'bestand_teilsaniert'}
                      onClick={() => setSimHuelleStandard('bestand_teilsaniert')}
                      className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                        simHuelleStandard === 'bestand_teilsaniert' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block">Teilsaniert (WSVO 95)</strong>
                      <span className="text-xxs opacity-80">Wand U≈0.45, Fenster U≈1.6</span>
                    </button>

                    <button aria-pressed={simHuelleStandard === 'geg_standard'}
                      onClick={() => setSimHuelleStandard('geg_standard')}
                      className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                        simHuelleStandard === 'geg_standard' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block">Neubau GEG-Standard</strong>
                      <span className="text-xxs opacity-80">Wand U≈0.24, Fenster U≈1.1</span>
                    </button>

                    <button aria-pressed={simHuelleStandard === 'effizienzhaus40'}
                      onClick={() => setSimHuelleStandard('effizienzhaus40')}
                      className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                        simHuelleStandard === 'effizienzhaus40' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block">Effizienzhaus 40</strong>
                      <span className="text-xxs opacity-80">Wand U≈0.14, 3-fach Glas U≈0.75</span>
                    </button>
                  </div>

                  <div className="text-xxs text-text-main/70 bg-white p-2 rounded-md border border-slate-200">
                    Berechneter spezifischer Transmissionsverlust der Hülle: <strong><InlineMath math={`H'_T = ${simResults.h_t_prime}\\text{ W/(m}^2\\text{K)}`} /></strong>
                  </div>
                </div>

                {/* 3. Lüftungssystem */}
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Wind size={15} className="text-shiraz" /> 3. Lüftungskonzept
                  </span>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button aria-pressed={simVentilation === 'fenster'}
                      onClick={() => setSimVentilation('fenster')}
                      className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                        simVentilation === 'fenster' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Fensterlüftung</strong>
                      <span className="text-xxs opacity-80">n = 0,50 h⁻¹</span>
                    </button>
                    <button aria-pressed={simVentilation === 'abluft'}
                      onClick={() => setSimVentilation('abluft')}
                      className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                        simVentilation === 'abluft' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Abluftanlage</strong>
                      <span className="text-xxs opacity-80">n = 0,45 h⁻¹</span>
                    </button>
                    <button aria-pressed={simVentilation === 'kwl_wrg'}
                      onClick={() => setSimVentilation('kwl_wrg')}
                      className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                        simVentilation === 'kwl_wrg' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">KWL mit WRG</strong>
                      <span className="text-xxs opacity-80">80 % Rückgewinnung</span>
                    </button>
                  </div>
                </div>

                {/* 4. Wärmeerzeuger & Energieträger */}
                <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-3">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <Flame size={15} className="text-shiraz" /> 4. Heizsystem &amp; Energieträger
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <button aria-pressed={simHeizung === 'wp_luft'}
                      onClick={() => setSimHeizung('wp_luft')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        simHeizung === 'wp_luft' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Luft-Wasser-WP</strong>
                      <span className="text-xxs opacity-80">JAZ ≈ 3,3 | fp = 1,8</span>
                    </button>

                    <button aria-pressed={simHeizung === 'wp_sole'}
                      onClick={() => setSimHeizung('wp_sole')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        simHeizung === 'wp_sole' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Sole-Wasser-WP</strong>
                      <span className="text-xxs opacity-80">JAZ ≈ 4,3 | fp = 1,8</span>
                    </button>

                    <button aria-pressed={simHeizung === 'gas_brennwert'}
                      onClick={() => setSimHeizung('gas_brennwert')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        simHeizung === 'gas_brennwert' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Gas-Brennwert</strong>
                      <span className="text-xxs opacity-80">η ≈ 0,96 | fp = 1,1</span>
                    </button>

                    <button aria-pressed={simHeizung === 'pellets'}
                      onClick={() => setSimHeizung('pellets')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        simHeizung === 'pellets' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Holzpellets</strong>
                      <span className="text-xxs opacity-80">η ≈ 0,88 | fp = 0,2</span>
                    </button>

                    <button aria-pressed={simHeizung === 'fernwaerme'}
                      onClick={() => setSimHeizung('fernwaerme')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        simHeizung === 'fernwaerme' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Fernwärme (KWK)</strong>
                      <span className="text-xxs opacity-80">η ≈ 0,98 | fp = 0,4</span>
                    </button>

                    <button aria-pressed={simHeizung === 'oel_kessel'}
                      onClick={() => setSimHeizung('oel_kessel')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        simHeizung === 'oel_kessel' ? 'bg-shiraz text-white border-shiraz shadow-xs' : 'bg-white text-text-main border-home-grau/30'
                      }`}
                    >
                      <strong className="block text-xxs sm:text-xs">Öl-Heizkessel</strong>
                      <span className="text-xxs opacity-80">η ≈ 0,84 | fp = 1,1</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Berechnete Ergebnisse & Ausweis-Vorschau (5 Spalten) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Result Card */}
                <div className="bg-white p-5 rounded-2xl border-2 border-home-grau/30 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ergebnis Energieausweis</span>
                    <span className={`text-sm font-black px-3 py-1 rounded-lg ${simResults.klasseColor}`}>
                      Klasse {simResults.klasse}
                    </span>
                  </div>

                  {/* Große Kennwerte */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xxs text-slate-500 font-semibold uppercase block">Endenergiebedarf (QE)</span>
                      <div className="text-xl font-black text-slate-900 font-mono">
                        {formatDeWert(simResults.q_e)} <span className="text-xs font-normal text-slate-500">kWh/(m²a)</span>
                      </div>
                      <span className="text-xxs text-slate-500">Basis für Bandtacho &amp; Kosten</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xxs text-slate-500 font-semibold uppercase block">Primärenergiebedarf (QP)</span>
                      <div className="text-xl font-black text-emerald-800 font-mono">
                        {formatDeWert(simResults.q_p)} <span className="text-xs font-normal text-slate-500">kWh/(m²a)</span>
                      </div>
                      <span className="text-xxs text-slate-500">Nachweisgröße nach § 15 (fp = {formatDeWert(simResults.f_p)})</span>
                    </div>
                  </div>

                  {/* Detailaufschlüsselung Stufe 1 bis 3 */}
                  <div className="space-y-2 text-xs border-t border-home-grau/20 pt-3">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Transmissionsverlust (<InlineMath math="Q_T" />):</span>
                      <strong className="font-mono">{simResults.q_t_jahr} kWh/(m²a)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Lüftungsverlust (<InlineMath math="Q_V" />):</span>
                      <strong className="font-mono">{simResults.q_v_jahr} kWh/(m²a)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
                      <span>Solar- &amp; Interne Gewinne (<InlineMath math="\eta \cdot Q_g" />):</span>
                      <strong className="font-mono">- {formatDeWert(simResults.q_gewinne)} kWh/(m²a)</strong>
                    </div>
                    <div className="flex justify-between py-1.5 font-bold bg-amber-50 px-2 rounded-lg text-amber-900">
                      <span>Nutzwärmebedarf (<InlineMath math="Q_h" />):</span>
                      <span className="font-mono">{formatDeWert(simResults.q_h)} kWh/(m²a)</span>
                    </div>
                    <div className="flex justify-between py-1 text-slate-600">
                      <span>Geschätzte CO₂-Emissionen:</span>
                      <strong className="font-mono">{formatDeWert(simResults.co2_emissionen)} kg CO₂ / (m² · a)</strong>
                    </div>
                  </div>

                  {/* Didaktischer Kommentar */}
                  <div className="p-3 bg-off-white rounded-xl border border-home-grau/30 text-xxs text-text-main/80 space-y-1">
                    <strong>Ingenieurmäßige Einordnung:</strong>
                    {simResults.klasse === 'A+' || simResults.klasse === 'A' ? (
                      <p>Hervorragender Passivhaus- bzw. Effizienzhausstandard. Die Wärmeverluste sind minimal, die Haustechnik arbeitet hocheffizient.</p>
                    ) : simResults.klasse === 'B' || simResults.klasse === 'C' ? (
                      <p>Guter zeitgemäßer Standard. Erfüllt die Neubaustandards bzw. entspricht einem vorbildlich modernisierten Altbau.</p>
                    ) : (
                      <p className="text-red-700">Dringender Sanierungsbedarf. Hohe Transmissionsverluste führen zu enormen Heizkosten und CO₂-Abgaben.</p>
                    )}
                  </div>
                </div>

                {/* Live-Rechenweg (AP 3.7) mit den aktuellen Simulator-Einstellungen */}
                <FormulaDerivationBox
                  live
                  title={`Ihr Rechenweg: Energiebilanz für ${formatDeZahl(simArea, 0)} m²`}
                  zielGleichung="Q_E = \frac{Q_h + Q_W + Q_{\text{Verl}}}{\eta \;\text{bzw.}\; \text{JAZ}} + W_{\text{Hilf}}"
                  schritte={[
                    {
                      titel: 'Transmissionswärmeverlust',
                      erklaerung: `Wärmetransferkoeffizient der Hülle H_T (inkl. Wärmebrückenzuschlag) mal Lehr-Klimafaktor ${formatDeZahl(simResults.f_klima_k, 0)} kKh/a, bezogen auf die Fläche:`,
                      formel: `Q_T = \\frac{${formatDeTeX(simResults.h_t, 1)}\\,\\text{W/K} \\cdot ${formatDeTeX(simResults.f_klima_k, 0)}\\,\\text{kKh/a}}{${formatDeTeX(simArea, 0)}\\,\\text{m}^2} = ${formatDeTeX(simResults.q_t_roh, 1)}\\,\\text{kWh/(m}^2\\text{a)}`
                    },
                    {
                      titel: 'Lüftungswärmeverlust',
                      erklaerung: `Mit V = 2,5 m · A_N und der wirksamen Luftwechselrate n = ${formatDeZahl(simResults.n_eff, 2)} 1/h:`,
                      formel: `H_V = 0{,}34 \\cdot ${formatDeTeX(simResults.n_eff, 2)} \\cdot ${formatDeTeX(simResults.v_netto, 0)} = ${formatDeTeX(simResults.h_v, 1)}\\,\\text{W/K} \\;\\Rightarrow\\; Q_V = ${formatDeTeX(simResults.q_v_roh, 1)}\\,\\text{kWh/(m}^2\\text{a)}`
                    },
                    {
                      titel: 'Nutzbare Wärmegewinne',
                      erklaerung: 'Solare und interne Gewinne, gewichtet mit dem Ausnutzungsgrad η:',
                      formel: `\\eta \\cdot (Q_S + Q_I) = ${formatDeTeX(simResults.eta_ausnutzung, 2)} \\cdot (${formatDeTeX(simResults.q_solar, 1)} + ${formatDeTeX(simResults.q_intern, 0)}) = ${formatDeTeX(simResults.q_gewinne_roh, 1)}\\,\\text{kWh/(m}^2\\text{a)}`
                    },
                    {
                      titel: 'Nutzwärmebedarf',
                      erklaerung: 'Verluste minus Gewinne, auf ganze kWh gerundet (mindestens 10 kWh/(m²a)):',
                      formel: `Q_h = ${formatDeTeX(simResults.q_t_roh, 1)} + ${formatDeTeX(simResults.q_v_roh, 1)} - ${formatDeTeX(simResults.q_gewinne_roh, 1)} \\approx ${formatDeTeX(simResults.q_h, 0)}\\,\\text{kWh/(m}^2\\text{a)}`
                    },
                    {
                      titel: 'Endenergiebedarf',
                      erklaerung: simResults.istWP
                        ? `Wärme für Heizung, Warmwasser und Verteilverluste geteilt durch die Jahresarbeitszahl JAZ = ${formatDeZahl(simResults.jaz, 1)}, zuzüglich Hilfsstrom:`
                        : `Wärme für Heizung, Warmwasser und Verteilverluste geteilt durch den Erzeugernutzungsgrad η = ${formatDeZahl(simResults.eta_erzeuger, 2)}, zuzüglich Hilfsstrom:`,
                      formel: `Q_E = \\frac{${formatDeTeX(simResults.q_h, 0)} + ${formatDeTeX(simResults.q_w, 1)} + ${formatDeTeX(simResults.q_verlust_netz, 0)}}{${formatDeTeX(simResults.istWP ? simResults.jaz : simResults.eta_erzeuger, 2)}} + ${formatDeTeX(simResults.w_hilfsstrom, 1)} \\approx ${formatDeTeX(simResults.q_e, 0)}\\,\\text{kWh/(m}^2\\text{a)}`
                    },
                    {
                      titel: 'Primärenergiebedarf',
                      erklaerung: simResults.istWP
                        ? `Der Strom der Wärmepumpe wird mit dem Primärenergiefaktor f_p = ${formatDeZahl(simResults.f_p, 1)} bewertet:`
                        : `Brennstoff mit f_p = ${formatDeZahl(simResults.f_p, 1)}, Hilfsstrom mit f_p = 1,8:`,
                      formel: simResults.istWP
                        ? `Q_P = ${formatDeTeX(simResults.q_e, 0)} \\cdot ${formatDeTeX(simResults.f_p, 1)} \\approx ${formatDeTeX(simResults.q_p, 0)}\\,\\text{kWh/(m}^2\\text{a)}`
                        : `Q_P = ${formatDeTeX((simResults.q_h + simResults.q_w + simResults.q_verlust_netz) / simResults.eta_erzeuger, 1)} \\cdot ${formatDeTeX(simResults.f_p, 1)} + ${formatDeTeX(simResults.w_hilfsstrom, 1)} \\cdot 1{,}8 \\approx ${formatDeTeX(simResults.q_p, 0)}\\,\\text{kWh/(m}^2\\text{a)}`
                    }
                  ]}
                  ergebnisHinweis={`Effizienzklasse ${simResults.klasse} ergibt sich aus dem Endenergiebedarf Q_E. Vereinfachte Lehrbilanz – kein Ersatz für eine Berechnung nach DIN V 18599.`}
                  normQuelle="DIN V 18599; GModG/GEG Anlage 10"
                />

              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRAXIS, REBOUND & RECHT */}
        {activeTab === 'praxis_recht' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Prebound vs. Rebound */}
            <div>
              <h3 className="font-bold text-text-main text-base mb-2">Die Diskrepanz zwischen Bedarf und Realität: Prebound- &amp; Rebound-Effekt</h3>
              <p className="text-xs text-text-main/80 leading-relaxed mb-4">
                In der Praxis weichen die realen Verbrauchsabrechnungen häufig gravierend vom rechnerischen 
                Bedarfsausweis ab. Ursache ist die menschliche Verhaltensanpassung:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                  <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5 mb-2">
                    <TrendingDown size={16} /> Der Prebound-Effekt (im unsanierten Altbau)
                  </h4>
                  <p className="text-xs text-amber-950/80 leading-relaxed">
                    Bei unsanierten Altbauten (Klassen F–H) liegt der <strong>reale Verbrauch oft 30 % bis 50 % unter</strong> dem 
                    theoretischen Bedarfswert!
                  </p>
                  <ul className="text-xxs text-amber-900/90 space-y-1 list-disc pl-4 mt-2">
                    <li>Bewohner heizen aus Kostengründen nicht die gesamte Wohnung auf 20 °C.</li>
                    <li>Schlafzimmer, Flure oder Gästezimmer bleiben völlig ungeheizt.</li>
                    <li>Nachts und bei Abwesenheit wird die Temperatur drastisch abgesenkt.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5 mb-2">
                    <ArrowUpRight size={16} /> Der Rebound-Effekt (nach Sanierung / im Neubau)
                  </h4>
                  <p className="text-xs text-blue-950/80 leading-relaxed">
                    Nach einer teuren Sanierung oder im Passivhaus wird oft <strong>deutlich mehr geheizt</strong> als berechnet:
                  </p>
                  <ul className="text-xxs text-blue-900/90 space-y-1 list-disc pl-4 mt-2">
                    <li>Weil Heizen kaum noch Geld kostet, stellen Bewohner 22–24 °C Wohlfühltemperatur ein (+1 °C Raumtemperatur steigert den Heizwärmebedarf um ca. 6 %).</li>
                    <li>Fenster werden im Winter unbedarft gekippt statt stoßgelüftet.</li>
                    <li>Rechnerisch erhoffte Einsparungen werden zu 10–30 % durch Komfortansprüche kompensiert.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Rechtliche Pflichten nach GEG */}
            <div className="pt-4 border-t border-home-grau/20">
              <h3 className="font-bold text-text-main text-base mb-3 flex items-center gap-2">
                <Scale size={18} className="text-shiraz" /> Gesetzliche Pflichten nach GModG, vormals GEG (§§ 79–88)
              </h3>

              <div className="space-y-3 text-xs text-text-main/80">
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/30">
                  <strong className="text-text-main block mb-0.5">Vorlage- und Übergabepflicht bei Besichtigung (§ 80 Abs. 4 und 5):</strong>
                  Beim Verkauf oder der Neuvermietung eines Gebäudes oder einer Wohnung muss der Energieausweis potenziellen 
                  Interessenten bereits bei der ersten Besichtigung unaufgefordert vorgelegt und bei Vertragsabschluss unverzüglich als Kopie übergeben werden.
                </div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/30">
                  <strong className="text-text-main block mb-0.5">Pflichtangaben in Immobilienanzeigen (§ 87):</strong>
                  In kommerziellen Anzeigen (z. B. ImmoScout, Zeitungen) müssen Pflichtangaben zwingend genannt werden: 
                  Art des Ausweises (Bedarfs- oder Verbrauchsausweis), Endenergie-Kennwert, wesentlicher Energieträger der Heizung, Baujahr des Gebäudes und die Energieeffizienzklasse (A+ bis H).
                </div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/30">
                  <strong className="text-text-main block mb-0.5">Gültigkeit &amp; Modernisierungsempfehlungen (§ 79 Abs. 3, § 84):</strong>
                  Energieausweise sind genau <strong>10 Jahre gültig</strong>. Ein wesentlicher Bestandteil jedes Energieausweises für Bestandsgebäude sind fachlich 
                  fundierte und wirtschaftlich zumutbare <strong>Modernisierungsempfehlungen</strong> (z. B. Dämmung der obersten Geschossdecke, Fenstertausch, hydraulischer Abgleich, Heizungstausch).
                </div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/30">
                  <strong className="text-text-main block mb-0.5">Aushangpflicht in öffentlichen Gebäuden (§ 80 Abs. 6 und 7):</strong>
                  In behördlichen Gebäuden mit starkem Publikumsverkehr über 250 m² Nutzfläche sowie gewerblichen Bauten über 500 m² Nutzfläche 
                  muss der Energieausweis an gut sichtbarer Stelle ausgehängt werden. Ab 01.01.2027 werden Nichtwohngebäude im Energieausweis erstmals in Effizienzklassen A bis G eingestuft (Anlage 10a GModG; Bezug: Primärenergiebedarf im Verhältnis zum Referenzgebäude); es ist dann nur noch der Bedarfsausweis zulässig.
                </div>
              </div>
            </div>

          </div>
        )}

      </div>      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: End- und Primärenergie – Gas-Brennwertkessel gegen Wärmepumpe"
        zielGleichung="Q_P = \sum_i Q_{E,i} \cdot f_{P,i}"
        schritte={[
          { titel: 'Wärmebedarf', erklaerung: 'Nutzwärme Heizung und Trinkwarmwasser einschließlich Verteilverlusten:', formel: 'q_h + q_w + q_{Verl} = 60 + 12{,}5 + 7{,}5 = 80\\,\\text{kWh/(m}^2\\text{a)}' },
          { titel: 'Gas-Brennwert', erklaerung: 'Erzeugernutzungsgrad 0,96, f_P = 1,1 (Gas) bzw. 1,8 (Hilfsstrom 3,5 kWh/(m²a)):', formel: 'q_E = \\frac{80}{0{,}96} + 3{,}5 = 86{,}8, \\quad q_P = 83{,}3 \\cdot 1{,}1 + 3{,}5 \\cdot 1{,}8 = 98{,}0\\,\\text{kWh/(m}^2\\text{a)}' },
          { titel: 'Luft-Wasser-Wärmepumpe', erklaerung: 'Jahresarbeitszahl 3,3, Strom f_P = 1,8, Hilfsstrom 2,5 kWh/(m²a):', formel: 'q_E = \\frac{80}{3{,}3} + 2{,}5 = 26{,}7, \\quad q_P = 26{,}7 \\cdot 1{,}8 = 48{,}1\\,\\text{kWh/(m}^2\\text{a)}' },
          { titel: 'Effizienzklasse', erklaerung: 'Die Klasse richtet sich bei Wohngebäuden nach der Endenergie (Anlage 10):', formel: '86{,}8 \\Rightarrow \\text{C}, \\qquad 26{,}7 \\Rightarrow \\text{A+}' }
        ]}
        ergebnisHinweis="Bei gleicher Gebäudehülle halbiert die Wärmepumpe den Primärenergiebedarf und landet drei Klassen besser, weil die Effizienzklasse die Endenergie bewertet."
        normQuelle="GModG/GEG Anlage 4 (Primärenergiefaktoren) und Anlage 10 (Effizienzklassen), Lesefassung Stand 29.07.2026"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Gebäudenutzfläche und Gültigkeit des Energieausweises"
        zielGleichung="A_N = 0{,}32\,\text{m}^{-1} \cdot V_e"
        schritte={[
          { titel: 'Beheiztes Volumen', erklaerung: 'Einfamilienhaus 10 m × 9 m Grundfläche, beheizte Höhe 6,0 m (zwei Geschosse, h_G = 2,75 m):', formel: 'V_e = 10 \\cdot 9 \\cdot 6{,}0 = 540\\,\\text{m}^3' },
          { titel: 'Gebäudenutzfläche', erklaerung: 'Geschosshöhe zwischen 2,5 und 3,0 m, daher Pauschalfaktor 0,32:', formel: 'A_N = 0{,}32 \\cdot 540 = 172{,}8\\,\\text{m}^2' },
          { titel: 'Vergleich Wohnfläche', erklaerung: 'Bei rund 140 m² Wohnfläche ist A_N etwa 23 % größer – Kennwerte je m² A_N wirken daher günstiger als je m² Wohnfläche.', formel: '\\frac{172{,}8}{140} = 1{,}23' },
          { titel: 'Gültigkeit', erklaerung: 'Ausgestellt am 1. Oktober 2026 (§ 79 Abs. 3):', formel: '\\text{gültig bis 30. September 2036}' }
        ]}
        ergebnisHinweis="Der Bezug auf A_N statt Wohnfläche ist eine häufige Ursache für Missverständnisse beim Vergleich von Energieausweis und Heizkostenabrechnung."
        normQuelle="GModG: Gebäudenutzfläche A_N § 3 Abs. 1 Nr. 10 und § 25 Abs. 10 (DIN V 18599-1, Gl. 30); § 79 Abs. 3 (Gültigkeit 10 Jahre)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="energieausweis" />

      {/* Standardisierter Footer */}
      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 6 Bauphysik: GEG → GModG, Paragrafen, Primärenergiefaktoren und Effizienzklassen gegen die Lesefassung geprüft; fachliche Freigabe durch den Autor ausstehend)"
wikipedia={[
          { title: 'Energieausweis', url: 'https://de.wikipedia.org/wiki/Energieausweis' },
          { title: 'Gebäudeenergiegesetz', url: 'https://de.wikipedia.org/wiki/Geb%C3%A4udeenergiegesetz' },
          { title: 'DIN V 18599', url: 'https://de.wikipedia.org/wiki/DIN_V_18599' }
        ]}
        literatur={[
          'Willems, W. (Hrsg.): Lehrbuch der Bauphysik. 8. Aufl., Wiesbaden: Springer Vieweg 2017',
          'Pistohl, W. et al.: Handbuch der Gebäudetechnik, Band 1 und 2. Köln: Reguvis (aktuelle Auflage)',
          'Hegger, M.; Fuchs, M.; Stark, T.; Zeumer, M.: Energie Atlas – Nachhaltige Architektur. München: Edition Detail 2007'
        ]}
        regelwerke={[
          { title: 'Gebäudemodernisierungsgesetz (GModG, verkündet 28.07.2026, in Kraft gestaffelt ab 29.07.2026; vormals Gebäudeenergiegesetz GEG; Neubau §§ 15/16 und Energieausweis §§ 79–88 unverändert nummeriert; Bestand teils neu: Nachrüstung § 35, Änderung § 36 statt §§ 47/48)', url: 'https://www.gesetze-im-internet.de/geg/' },
          { title: 'DIN V 18599:2018-09 (Energetische Bewertung von Gebäuden; im GModG § 20 referenziert); Nachfolgereihe DIN/TS 18599 seit 2025-10' },
          { title: 'DIN 4108-2 (Mindestanforderungen an den Wärmeschutz; Neuausgabe 2026-05, bisher 2013-02)' }
        ]}
        formeln={
          activeTab === 'annahmen_berechnung' || activeTab === 'simulator'
            ? [
                {
                  formel: 'Q_h = (Q_T + Q_V) - \\eta \\cdot (Q_s + Q_i) \\quad [\\text{kWh/a}]',
                  erklaerung: 'Nutzwärmebedarf / Heizwärmebedarf nach DIN V 18599 als Differenz aus Transmissions- und Lüftungsverlusten abzüglich nutzbarer solarer und interner Wärmegewinne.',
                  quelle: 'DIN V 18599-2'
                },
                {
                  formel: 'Q_P = \\sum_i \\left( Q_{E,i} \\cdot f_{P,i} \\right) \\le Q_{P,\\text{zul}} \\quad [\\text{kWh/(m}^2\\cdot\\text{a)}]',
                  erklaerung: 'Berechnung des Jahres-Primärenergiebedarfs QP aus den Endenergiemengen QE je Energieträger und den zugehörigen Primärenergiefaktoren fP nach GModG/GEG Anlage 4.',
                  quelle: 'GModG § 20 i. V. m. DIN V 18599:2018-09'
                },
                {
                  formel: 'H\'_T = \\frac{\\sum_k \\left(A_k \\cdot U_k \\cdot F_{x,k}\\right) + \\Delta U_{WB} \\cdot A}{A} \\le H\'_{T,\\text{zul}} \\quad [\\text{W/(m}^2\\cdot\\text{K)}]',
                  erklaerung: 'Spezifischer transmissionsbedingter Wärmeverlust H\'T der wärmeübertragenden Hüllfläche A.',
                  quelle: 'GModG Anlage 1 / DIN V 18599-2:2018-09'
                }
              ]
            : [
                {
                  formel: 'Q_P = \\sum_i \\left(Q_{E,i} \\cdot f_{P,i}\\right) \\quad [\\text{kWh/(m}^2\\cdot\\text{a)}]',
                  erklaerung: 'Verknüpfung von Endenergie und ökologischer Primärenergie über den Primärenergiefaktor fP.',
                  quelle: 'GModG § 22, Anlage 4'
                }
              ]
        }
      />
    </div>
  );
}
