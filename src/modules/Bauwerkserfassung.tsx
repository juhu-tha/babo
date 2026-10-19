import React, { useState, useMemo } from 'react';
import { 
  Building2, Layers, Search, Monitor, Calculator, Compass, Info, 
  ArrowRight, CheckCircle2, FileText, Activity, AlertTriangle, 
  Settings, Zap, ShieldCheck, HelpCircle, LayoutGrid
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';

export default function Bauwerkserfassung() {
  const [activeSubTab, setActiveSubTab] = useState<'grundlagen' | 'methoden' | 'leica_workflow' | 'tragwerksplanung'>('grundlagen');

  // Tab 1: Genauigkeitsstufe Selector
  const [selectedStufe, setSelectedStufe] = useState<number>(3); // Default level III (Denkmalpflege)

  // Tab 4: Dachstuhl Statik-Rechner (Timber Rafter with initial deformation e_0)
  const [rafterWidth, setRafterWidth] = useState<number>(100); // b in mm
  const [rafterHeight, setRafterHeight] = useState<number>(140); // h in mm
  const [spanLength, setSpanLength] = useState<number>(4000); // L in mm
  const [axialForce, setAxialForce] = useState<number>(15); // N_d in kN
  const [bendingLoad, setBendingLoad] = useState<number>(2.0); // q_d in kN/m
  const [initialDeformation, setInitialDeformation] = useState<number>(45); // e_0 in mm (visualized deflection)
  const [woodClass, setWoodClass] = useState<'C16' | 'C24' | 'C30' | 'D30'>('C24');

  // Wood parameters according to DIN EN 1995 (Eurocode 5)
  // Design strength values (f_m_d = f_m_k * k_mod / gamma_M)
  // Assuming k_mod = 0.9 (short-term load like snow), gamma_M = 1.3 (solid wood)
  const woodParams = useMemo(() => {
    const f_m_k = woodClass === 'C16' ? 16 : (woodClass === 'C24' ? 24 : (woodClass === 'C30' ? 30 : 30));
    const f_c_0_k = woodClass === 'C16' ? 17 : (woodClass === 'C24' ? 21 : (woodClass === 'C30' ? 23 : 23));
    const E_0_mean = woodClass === 'C16' ? 8000 : (woodClass === 'C24' ? 11000 : (woodClass === 'C30' ? 12000 : 12000));
    
    const k_mod = 0.9;
    const gamma_M = 1.3;
    
    return {
      f_m_d: (f_m_k * k_mod) / gamma_M, // Bending design stress
      f_c_0_d: (f_c_0_k * k_mod) / gamma_M, // Compression design stress
      E_0_mean
    };
  }, [woodClass]);

  // Combined compression + bending stress calculation including 2nd order theory approximation (verformungsabhängig)
  const staticsResults = useMemo(() => {
    const b = rafterWidth;
    const h = rafterHeight;
    const L = spanLength;
    const N_d = axialForce * 1000; // N
    const q_d = bendingLoad / 1000; // N/mm
    const e_0 = initialDeformation; // mm

    // Cross-section props
    const A = b * h; // mm^2
    const W = (b * Math.pow(h, 2)) / 6; // mm^3
    const I = (b * Math.pow(h, 3)) / 12; // mm^4

    // Primary stresses (idealized straight rafter)
    const M_q_d = (q_d * Math.pow(L, 2)) / 8; // Nmm (bending moment from transverse load)
    const sigma_m_d_primary = M_q_d / W; // N/mm^2 (primary bending stress)
    const sigma_c_d = N_d / A; // N/mm^2 (direct axial compression stress)

    // Secondary stresses due to measured deformation e_0 (1st order eccentricity)
    const M_e_d = N_d * e_0; // Nmm (eccentricity moment)
    const sigma_m_d_eccentric = M_e_d / W; // N/mm^2 (bending stress from eccentricity)

    // Euler buckling load (approximation for premium effect)
    const E = woodParams.E_0_mean;
    const N_crit = (Math.pow(Math.PI, 2) * E * I) / Math.pow(L, 2); // Euler Buckling Load in N
    
    // Magnification factor (1 / (1 - N_d / N_crit)) for second-order premium effect
    const alpha_crit = N_crit / N_d;
    const magFactor = alpha_crit > 1 ? alpha_crit / (alpha_crit - 1) : 1.5;

    // Total moment of combined bends (with premium second-order expansion)
    const M_total = (M_q_d + M_e_d) * magFactor;
    const sigma_m_d_total = M_total / W;

    // Design verification following Eurocode 5 (EC5) formula:
    // sigma_c_d / f_c_0_d + sigma_m_d_total / f_m_d <= 1.0 (approximative)
    const limitRatio = (sigma_c_d / woodParams.f_c_0_d) + (sigma_m_d_total / woodParams.f_m_d);
    
    // Idealized ratio ignoring measured deformation
    const limitRatioIdeal = (sigma_c_d / woodParams.f_c_0_d) + ((M_q_d * magFactor) / W / woodParams.f_m_d);

    return {
      A,
      W,
      I,
      sigma_c_d,
      sigma_m_d_primary,
      sigma_m_d_eccentric,
      sigma_m_d_total,
      N_crit_kN: N_crit / 1000,
      magFactor,
      limitRatio: limitRatio * 100, // as percentage
      limitRatioIdeal: limitRatioIdeal * 100, // as percentage
      unsafeRatioDelta: (limitRatio - limitRatioIdeal) * 100 // dangerous error gap
    };
  }, [rafterWidth, rafterHeight, spanLength, axialForce, bendingLoad, initialDeformation, woodParams]);

  return (
    <div className="flex flex-col gap-6 w-full text-slate-800 animate-fade-in">
      
      {/* --- Unified Header: Modern Cockpit Theme --- */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Building2 size={20} className="text-shiraz" /> Bauwerkserfassung &amp; Aufmaßtechniken
        </h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Methoden zur geometrischen und strukturellen Erfassung von Bestandsbauten. Vom analogen Handaufmaß über hochpräzises 3D-LiDAR-Scanning (Leica BLK360) bis zur schadens- und verformungsgerechten BIM/Statik-Aufbereitung.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2 border-t border-home-grau/20">
          <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded w-fit font-medium font-sans">
            <Info size={12} />
            <span>Hinweis: Gilt für die an der TH Augsburg vorhandenen Geräte und verwendeten Softwaretools.</span>
          </div>
          <div className="bg-slate-50 border border-home-grau/30 px-4 py-2.5 rounded-lg text-xs font-mono text-slate-600 flex gap-4 items-center shrink-0">
            <span>📐 Toleranz: DIN 18202 / DIN 18710</span>
            <span>🏛️ Leitfaden: Denkmalpflege-Richtlinien</span>
          </div>
        </div>
      </div>

      {/* --- Module-Level Tabs --- */}
      <div className="flex border-b border-home-grau/30 overflow-x-auto bg-white p-1 rounded-xl shadow-sm border">
        <button
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'grundlagen' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('grundlagen')}
        >
          <Building2 size={14} /> Grundlagen &amp; Genauigkeitsstufen
        </button>
        <button
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'methoden' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('methoden')}
        >
          <Compass size={14} /> Messverfahren im Vergleich
        </button>
        <button
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'leica_workflow' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('leica_workflow')}
        >
          <Monitor size={14} /> Leica Punktwolken-Workflow
        </button>
        <button
          className={`flex-1 min-w-[150px] px-4 py-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'tragwerksplanung' ? 'bg-shiraz text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          onClick={() => setActiveSubTab('tragwerksplanung')}
        >
          <Calculator size={14} /> BIM &amp; Statik (Revit + RSTAB)
        </button>
      </div>

      {/* --- Tab 1: Grundlagen & Genauigkeitsstufen --- */}
      {activeSubTab === 'grundlagen' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <Building2 className="text-shiraz" size={20} /> Warum &quot;verformungsgerechtes Aufmaß&quot;?
            </h2>
            <p className="text-slate-600 text-xs leading-relaxed max-w-4xl mb-6 font-sans">
              Im Neubau wird von idealisierten Ebenen und rechten Winkeln ausgegangen. Bestandsgebäude überdauern jedoch oft Jahrhunderte und reagieren auf Bodensenkungen, Feuchtigkeit, Kriechen und Schwinden oder temperaturbedingte Querdehnungen. Sie verformen sich. 
              Ein idealisiertes Aufmaß vernachlässigt schräge Wände, hängende Decken und gekrümmte Dachtragwerke. Das verformungsgerechte Aufmaß hingegen registriert diese Abweichungen exakt und überführt sie in die Bauwerksakte, um teure Überraschungen beim Modernisieren oder statische Fehleinschätzungen zu vermeiden.
            </p>

            {/* Interactive Level Explorer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {[
                { level: 1, name: 'Stufe I (Grobaufmaß)', tol: '± 5 bis 10 cm', scale: '1:100 / 1:200', desc: 'Verformungen werden ignoriert. Erfassung mit reiner Skizzierung, Handentfernungsmessern oder grobem Bandmaß, vor allem für erste Raumschnitte und Mietflächenberechnungen.' },
                { level: 2, name: 'Stufe II (Standardaufmaß)', tol: '± 1 bis 3 cm', scale: '1:100', desc: 'Sichtbare Schrägen oder unregelmäßige Bauteile werden durch Kontrollmaße punktuell erfasst, ansonsten werden idealtypische rechte Winkel dargestellt.' },
                { level: 3, name: 'Stufe III (Detaillierte Bauaufnahme)', tol: '± 5 mm', scale: '1:50 / 1:25', desc: 'Zentral für Denkmalschutz und historische Bausubstanz. Alle wesentlichen Bauteilverformungen (Wandneigungen, Balkendurchbiegungen) werden geodätisch/fotogrammetrisch eingemessen.' },
                { level: 4, name: 'Stufe IV (Umfassende Verformungsanalyse)', tol: '± 1 bis 2 mm', scale: '1:20 / 1:10', desc: 'Absolute Spitzenklasse. Dreidimensionale LiDAR-Registrierung jeder Krümmung, Beule und Senkung. Unverzichtbare metrologische Basis für die Simulation von Lastumlagerungen und Standsicherheitsnachweisen.' }
              ].map((stufe) => (
                <button
                  key={stufe.level}
                  type="button"
                  onClick={() => setSelectedStufe(stufe.level)}
                  className={`p-4 rounded-xl text-left border flex flex-col justify-between transition-all ${
                    selectedStufe === stufe.level
                      ? 'border-shiraz bg-shiraz/5 text-slate-900 shadow-md ring-2 ring-shiraz/20'
                      : 'border-home-grau/30 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border ${
                      selectedStufe === stufe.level ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-200 text-slate-600 border-home-grau/30'
                    }`}>
                      Stufe {formatDeWert(stufe.level)}
                    </span>
                    <h4 className="font-extrabold text-xs mt-3 text-slate-900">{stufe.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-1.5">
                      Toleranz: <strong className={selectedStufe === stufe.level ? 'text-shiraz' : 'text-slate-700'}>{stufe.tol}</strong>
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      Maßstab: {stufe.scale}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-home-grau/30 text-xs leading-relaxed text-slate-600 font-sans">
                    {stufe.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Visual Detail Panel based on selected Genauigkeitsstufe */}
            <div className="bg-slate-50/40 p-5 rounded-xl border border-home-grau/30 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <span className="font-sans w-2 h-2 rounded-full bg-shiraz inline-block"></span>
                  Metrologische Details zu Stufe {formatDeWert(selectedStufe)}
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 pl-4 list-disc font-sans">
                  {selectedStufe === 1 && (
                    <>
                      <li><strong>Genauigkeitseignung:</strong> Ausreichend für Machbarkeitsstudien, Heizkostenabrechnung oder grobe Grundrissaufaufteilungen.</li>
                      <li><strong>Typische Handgeräte:</strong> Rollbandmaß, Gliedermaßstab (Zollstock), einfacher Handlaser.</li>
                      <li><strong>Kritikpunk:</strong> Unsicher bei komplexer Tragwerkserfassung. Schrägen können gar nicht oder nur stark verzerrt erkannt werden.</li>
                    </>
                  )}
                  {selectedStufe === 2 && (
                    <>
                      <li><strong>Genauigkeitseignung:</strong> Standard im Umbau-Wohnungsbau. Ausreichend, wenn keine größeren Verformungen durch Risse oder Setzungen vorliegen.</li>
                      <li><strong>Gerätespektrum:</strong> Laser-Entfernungsmesser mit Zusatzabstützungen, Diagonaldistanzmessungen per Einzelschuss.</li>
                      <li><strong>Einsatzgrenze:</strong> Dachstühle mit krummem Gebälk führen hier bereits zu unrealistischen Bemaßungen in Plänen.</li>
                    </>
                  )}
                  {selectedStufe === 3 && (
                    <>
                      <li><strong>Genauigkeitseignung:</strong> Von den Landesdenkmalämtern empfohlener Standard bei schützenswerten Bauwerken (Eckstein; Toleranzwerte dort prüfen).</li>
                      <li><strong>Gerätespektrum:</strong> Tachymeter (Totalstation) zur Festpunktnetzmessung kombiniert mit verzugsarmer Fotogrammetrie oder lokalem Multipunktscanning.</li>
                      <li><strong>Besonderheit:</strong> Verbiegungen und krumme Wandfluchten werden geometrisch korrekt in Form von deformierten Schnitten dargestellt.</li>
                    </>
                  )}
                  {selectedStufe === 4 && (
                    <>
                      <li><strong>Genauigkeitseignung:</strong> Premium-Analyse für komplexe Bausanierungen, historische Kirchenkuppeln, deformierte Holzdachstühle und Riss-Fluchtungsmessungen.</li>
                      <li><strong>Gerätespektrum:</strong> Terrestrische Laserscan-Systeme (TLS), mobile SLAM-LiDAR-Scanner sowie dichte Luftphotogrammetrie (UAV).</li>
                      <li><strong>Vorteil:</strong> Schafft eine lückenlose 3D-Geometrie als Punktwolke. Perfekt für Finite-Elemente-Berechnungen (RSTAB) des de facto Ist-Zustandes.</li>
                    </>
                  )}
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-home-grau/30 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">Messtechnische Visualisierung</span>
                <div className="border border-home-grau/30 rounded bg-slate-50 p-3 text-xs font-mono text-slate-500">
                  <div className="flex justify-between border-b border-home-grau/30 pb-1.5 mb-1.5">
                    <span>Protokollierungsart:</span>
                    <span className="font-bold text-slate-800">
                      {selectedStufe <= 2 ? 'Idealisiert (Orthogonal)' : 'Realitätsnah (Toleranzgerecht)'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-home-grau/30 pb-1.5 mb-1.5">
                    <span>Vergleich Ausführungstoleranz DIN 18202 (keine Aufmaßgenauigkeit):</span>
                    <span className="font-bold text-slate-800">
                      {selectedStufe === 1 && 'N/A (nicht nachprüfbar)'}
                      {selectedStufe === 2 && 'Grenze Spalte 5 (± 16mm auf 4m)'}
                      {selectedStufe === 3 && 'Grenze Spalte 6 (± 6mm auf 4m)'}
                      {selectedStufe === 4 && 'Hochpräzise Spezialtoleranz (< 2mm)'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500 font-sans mt-2">
                    {selectedStufe >= 3 ? '✓ Durch die Verortung deformierter Bauteile (z.B. durchbeugender Firstpfetten) können Knickeffekte und Exzentrizitätsmomente in der Statik korrekt zugewiesen werden.' : '⚠ Achtung: Verformungen von Bauteilen werden bei diesem Erfassungsgrad weg-idealisiert. Dies birgt Risiken beim nachträglichen Aufbringen neuer Dachlasten!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 2: Vergleich der Messverfahren --- */}
      {activeSubTab === 'methoden' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <Compass className="text-shiraz" size={20} /> Vor- und Nachteile moderner Erfassungstechnologien
            </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Auswahl des optimalen Erfassungsverfahrens hängt vom Budget, der Komplexität des Bauwerks, der Zugänglichkeit und den geforderten Ziel-Toleranzen (Aufmaßstufen) ab. Oft werden Verfahren gewinnbringend kombiniert, z. B. ein geodätisches Rahmennetz aus Tachymetrie mit einer dichten LiDAR-Punktwolkenaufladung.
          </p>
        </div>

        <div className="overflow-x-auto border border-home-grau/30 rounded-xl">
              <table className="min-w-full text-xs text-left bg-white font-sans">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-home-grau/30">
                  <tr>
                    <th className="p-3">Verfahren</th>
                    <th className="p-3">Typische Genauigkeit</th>
                    <th className="p-3">Geschwindigkeit vor Ort</th>
                    <th className="p-3">Aufarbeitung (Büro)</th>
                    <th className="p-3">Vorteile</th>
                    <th className="p-3">Herausforderungen/Nachteile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      name: 'Handaufmaß',
                      tol: '± 20 - 50 mm',
                      speed: 'Sehr langsam',
                      work: 'Sofort (Skizze) / Mittelschwer (CAD-Eingabe)',
                      pros: 'Geringe Hardware-Kosten, Prüfer hat direkten Bauteilkontakt (Haptik) und erkennt Schäden.',
                      cons: 'Hoher manueller Aufwand, ungeeignet für verformte Dächer, Gefahr von Vergessensmaßen.',
                      bg: 'bg-white'
                    },
                    {
                      name: 'Laser-Entfernungsmesser',
                      tol: '± 1,0 - 5,0 mm',
                      speed: 'Mittel',
                      work: 'Manuelle Eingabe in CAD-Zeichnungen',
                      pros: 'Schnelle Einzelschüsse, hohe Präzision am Einzelpunkt, hohe Mobilität auf der Baustelle.',
                      cons: 'Schwerpunkt liegt auf Einzelpunkten, keine kontinuierlichen Kurvendarstellungen möglich.',
                      bg: 'bg-slate-50/10'
                    },
                    {
                      name: 'Tachymetrie (Totalstation)',
                      tol: '± 1,0 - 2,0 mm',
                      speed: 'Mittel-Langsam',
                      work: 'Direktimport von Festpunkthöhen',
                      pros: 'Höchste geodätische Genauigkeit, perfektes, verzugfreies Koordinatennetz an Festpunkten.',
                      cons: 'Teure Ausbildung nötig, hoher Zeitaufwand für den Aufbau des Geräts.',
                      bg: 'bg-white'
                    },
                    {
                      name: 'Terrestrisches LiDAR (TLS)',
                      tol: '± 1,0 - 3,0 mm',
                      speed: 'Sehr schnell',
                      work: 'Hoch (Registrierung, Filterung in Leica Cyclone)',
                      pros: 'Bis 680.000 Punkte/s (BLK360 G2), lückenlose 3D-Erfassung, Genauigkeit laut Datenblatt im Bereich weniger Millimeter (z. B. 4 mm @ 10 m).',
                      cons: 'Hohe Anschaffungskosten, enorme Datenmengen, Abschattung (tote Winkel) erfordern viele Standpunkte.',
                      bg: 'bg-slate-50/15'
                    },
                    {
                      name: '3D-Photogrammetrie (SfM)',
                      tol: '± 5,0 - 15,0 mm',
                      speed: 'Schnell (Kameradrohne)',
                      work: 'Sehr hoch (Bildrekonstruktion auf GPU)',
                      pros: 'Zusätzliche dichte RGB-Farbinformationen, hervorragend für Dachaußenseiten & Stuckverzierungen.',
                      cons: 'Stark licht- und oberflächenabhängig, unpräzise bei spiegelnden oder einfarbigen Wandflächen.',
                      bg: 'bg-white'
                    }
                  ].map((item, idx) => (
                    <tr key={idx} className={`${item.bg} hover:bg-slate-50`}>
                      <td className="p-3 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3 font-mono text-indigo-700 font-bold">{item.tol}</td>
                      <td className="p-3">{item.speed}</td>
                      <td className="p-3 text-slate-600">{item.work}</td>
                      <td className="p-3 text-emerald-800 bg-emerald-50/20">{item.pros}</td>
                      <td className="p-3 text-amber-800 bg-amber-50/20">{item.cons}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 3: Leica BLK360 & Cyclone Registrierungs-Workflow --- */}
      {activeSubTab === 'leica_workflow' && (
        <div className="space-y-6">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <Monitor className="text-shiraz" size={20} /> Punktwolken-Aufbereitung: Leica BLK360 &amp; Leica Cyclone
            </h2>
            <p className="text-slate-600 text-xs leading-relaxed max-w-4xl mb-6 font-sans">
              Um Daten aus einem terrestrischen Laserscanner (TLS) wie dem ultrakompakten <strong>Leica BLK360</strong> nutzbar zu machen, müssen die Scandaten einen strengen Filter- und Registrierungsprozess durchlaufen. Erst das Zusammenfügen mehrerer Scanstandorte ergibt eine lückenlose Wolke.
            </p>

            {/* Step-by-Step Workflow Path */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { step: '01', title: 'Erfassung am Objekt', detail: 'Der Leica BLK360 wird auf einem stabilen Stativ platziert. Er emittiert 680.000 Laserpunkte pro Sekunde und nimmt ein HDR-Farbpanorama auf. Pro Standpunkt dauert die kombinierte Aufnahme ca. 1-2 Minuten.' },
                { step: '02', title: 'Import & Vorfilterung', detail: 'Übertragen der RAW-Scandaten in Leica Cyclone Register 360. Automatische Reinigung von offensichtlichem Rauschen (Vorbeiziehender Verkehr, Vogelschlag) über vordefinierte Distanz-Grenzbereiche.' },
                { step: '03', title: 'Registrierung (Verknüpfung)', detail: 'Verknüpfen der Scanpunkte per Cloud-to-cloud (C2C) Abgleich. Algorithmen suchen nach Kantenüberlappungen im Raum. Alternativ werden physisch auf der Baustelle angebrachte Target-Kugeln zugewiesen.' },
                { step: '04', title: 'Export & Formate', detail: 'Validierung der Abweichungsmatrix (Zielwert: < 3mm Gesamtfehler). Finale Ausdünnung der Punktwolke und Export in Bau-BIM-Standardformate wie RCP/RCS (Autodesk) oder LGS.' }
              ].map((w, idx) => (
                <div key={idx} className="bg-slate-50 border border-home-grau/30 rounded-xl p-4 relative hover:shadow-md transition-shadow">
                  <span className="text-3xl font-extrabold text-indigo-100 font-mono absolute top-2 right-4 leading-none">
                    {w.step}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-900 mt-2 font-sans flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-indigo-600 rounded inline-block"></span>
                    {w.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-600 mt-3 font-sans">
                    {w.detail}
          </p>
        </div>
              ))}
            </div>

            {/* Detailed Registration Insight Box */}
            <div className="bg-indigo-50/30 border border-indigo-150/60 rounded-xl p-5 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Settings size={14} /> Cloud-to-cloud (C2C)-Registrierung in Cyclone
                </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            In modernen Erfassungen verzichtet man immer häufiger auf aufwendige Zielmarken (Kugeln) am Mauerwerk. Das <strong>Cloud-to-Cloud</strong>-Verfahren berechnet Flächenpassungen.
                </p>
                <div className="space-y-2 text-xs text-slate-700 font-sans">
                  <div className="bg-white p-2.5 rounded border border-home-grau/30">
                    <strong>Überlappungskriterium:</strong> Mindestens 30 % geometrische Überlappung zwischen Standort A und B ist erforderlich.
                  </div>
                  <div className="bg-white p-2.5 rounded border border-home-grau/30">
                    <strong>Vorteil:</strong> Kein zeitaufwendiges Einmessen von Referenzen per Hand auf riskantem Gerüstgebälk notwendig.
                  </div>
                </div>
              </div>
              <div className="bg-white border border-home-grau/30 rounded-xl p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">Typische Exportformate für CAD/BIM</span>
                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between border-b pb-1.5 border-home-grau/30">
                    <strong className="text-slate-800 font-mono">.RCP / .RCS</strong>
                    <span className="text-slate-500 text-right">Autodesk ReCap (Pflicht für Revit-Direktimport)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 border-home-grau/30">
                    <strong className="text-slate-800 font-mono">.LGS</strong>
                    <span className="text-slate-500 text-right">Leicas universelles Hochleistung-Punktwolkenformat</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 border-home-grau/30">
                    <strong className="text-slate-800 font-mono">.E57</strong>
                    <span className="text-slate-500 text-right">Herstellerneutraler ASTM-Standard (hochkompatibel)</span>
                  </div>
                  <div className="flex justify-between pb-1.5">
                    <strong className="text-slate-800 font-mono">.LAS / .LAZ</strong>
                    <span className="text-slate-500 text-right">Standard für Geländemodelle &amp; Punktaufmaße</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 4: BIM & Statik (Revit + RSTAB) --- */}
      {activeSubTab === 'tragwerksplanung' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
              <LayoutGrid className="text-shiraz" size={20} /> Datendurchgängigkeit: Vom 3D-Scan zur Stab-Statik
            </h2>
            <p className="text-slate-600 text-xs leading-relaxed max-w-4xl mb-6 font-sans">
              Aus der registrierten Punktwolke entsteht kein automatisches statisches System. Hierzu bedarf es einer Brücke zwischen CAD-Modellierung (Revit) und mechanischer Berechnung (RSTAB).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Revit Modeling Step */}
              <div className="bg-slate-50 border border-home-grau/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
                  <Monitor size={14} /> 1. BIM-Modellierung in Autodesk Revit
                </h3>
                <ul className="space-y-3 text-xs text-slate-600 pl-4 list-disc font-sans">
                  <li><strong>Punktwolken-Verlinkung:</strong> Die .RCP-Datei wird über &quot;Punktwolke einfügen&quot; referenziert.</li>
                  <li><strong>Schnittführung:</strong> Revit ermöglicht es, Schnitte exakt durch die Deckenkrümmungen zu legen, um diese nachzukonstruieren.</li>
                  <li><strong>Modellierungsregeln:</strong> Modellierung verformter Wände als &quot;schräge Wand&quot; (Tapered Wall) oder per Freiformflächen, anstatt sie als starr orthogonale Standardbauteile zu definieren.</li>
                </ul>
              </div>

              {/* RSTAB Modeling Step */}
              <div className="bg-slate-50 border border-home-grau/30 rounded-xl p-5">
                <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
                  <Calculator size={14} /> 2. Statische Erfassung in Dlubal RSTAB
                </h3>
                <ul className="space-y-3 text-xs text-slate-600 pl-4 list-disc font-sans">
                  <li><strong>Systemachsenexzentrizitäten:</strong> In RSTAB wird das Tragwerk aus Stabelementen zusammengesetzt. Durchbiegungen werden als EXZENTRIZITÄTEN e_0 auf Modellebene eingearbeitet.</li>
                  <li><strong>Theorie II. Ordnung:</strong> Bei der Berechnung werden Schnittgrößen infolge der gemessenen geometrischen Vorverformung nach Theorie II. Ordnung einbezogen.</li>
                  <li><strong>Nachweise:</strong> Spannungs- und Stabilitätsnachweise nach DIN EN 1995-1-1 für Holzrafter-Dächer und Fachwerkstrukturen.</li>
                </ul>
              </div>
            </div>

            {/* --- CORE INTERACTIVE EC5 STATICS CALCULATOR --- */}
            <div className="border border-amber-200 bg-amber-50/15 rounded-xl p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1 rounded bg-amber-200/50 text-amber-800">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 font-sans">
                    Eurocode 5 Holz-Dachstuhlnachweis mit Vorverformung hocheffizient simulieren
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    Sehen Sie live, wie eine vernachlässigte Vorverformung (Schiefstellung des Sparrens) aus einem unpräzisen Aufmaß zu deutlichen Spannungserhöhungen führen kann.
          </p>
        </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Inputs area */}
                <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-home-grau/30 space-y-4 text-xs font-sans">
                  <div className="border-b pb-2 mb-2 font-bold text-slate-800 uppercase text-xs tracking-wider text-indigo-900">
                    Tragwerk &amp; Einwirkung (Eurocode 5 &amp; C24)
                  </div>
                  
                  {/* Wood Selection */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Holzkennwertklasse (NH):</label>
                    <select
                      className="w-full bg-slate-50 border border-home-grau/30 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                      value={woodClass}
                      onChange={(e) => setWoodClass(e.target.value as any)}
                    >
                      <option value="C16">C16 (Standard-Nadelholz, f_m_k=16 MPa)</option>
                      <option value="C24">C24 (Konstruktionsvollholz, f_m_k=24 MPa)</option>
                      <option value="C30">C30 (Hochwertiges Vollholz, f_m_k=30 MPa)</option>
                      <option value="D30">D30 (Hartholz/Laubholz, f_m_k=30 MPa)</option>
                    </select>
                  </div>

                  {/* Geometric Input Dimensions */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Breite b (mm):</label>
                      <input
                        type="number" min="0"
                        className="w-full bg-slate-50 border border-home-grau/30 rounded p-1 font-mono font-bold text-right"
                        value={rafterWidth}
                        onChange={(e) => setRafterWidth(Math.max(40, parseInt(e.target.value) || 1))}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Höhe h (mm):</label>
                      <input
                        type="number" min="0"
                        className="w-full bg-slate-50 border border-home-grau/30 rounded p-1 font-mono font-bold text-right"
                        value={rafterHeight}
                        onChange={(e) => setRafterHeight(Math.max(60, parseInt(e.target.value) || 1))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">Sparrenlänge L (mm):</label>
                    <input
                      type="number" min="0"
                      className="w-full bg-slate-50 border border-home-grau/30 rounded p-1 font-mono font-bold text-right"
                      value={spanLength}
                      onChange={(e) => setSpanLength(Math.max(1000, parseInt(e.target.value) || 1))}
                    />
                  </div>

                  {/* Forces Inputs */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-home-grau/30">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5 text-xs">Axialdruck N_d (kN):</label>
                      <input
                        type="number" min="0"
                        className="w-full bg-slate-50 border border-home-grau/30 rounded p-1 font-mono font-bold text-right"
                        value={axialForce}
                        onChange={(e) => setAxialForce(Math.max(0, parseFloat(e.target.value) || 0))}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5 text-xs">Biegelast q_d (kN/m):</label>
                      <input
                        type="number" min="0"
                        step="0.1"
                        className="w-full bg-slate-50 border border-home-grau/30 rounded p-1 font-mono font-bold text-right"
                        value={bendingLoad}
                        onChange={(e) => setBendingLoad(Math.max(0, parseFloat(e.target.value) || 0))}
                      />
                    </div>
                  </div>

                  {/* INITIATOR e_0 DEFORMATION */}
                  <div className="pt-2 border-t border-home-grau/30">
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Gemessene Verformung e_0 (mm):</span>
                      <span className="text-shiraz font-mono font-bold">{formatDeWert(initialDeformation)} mm</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="120"
                      className="w-full accent-shiraz"
                      value={initialDeformation}
                      onChange={(e) => setInitialDeformation(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                      Dieser Wert steht für die reale Biegung/Durchbiegung des Sparrens, ermittelt über das verformungsgerechte Aufmaß (z.B. Leica BLK360 Punktwolke).
                    </p>
                  </div>
                </div>

                {/* Outputs area */}
                <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between font-sans">
                  <div>
                    <div className="border-b pb-2 mb-3 font-bold text-slate-800 uppercase text-xs tracking-wider text-emerald-900">
                      Spannungs- &amp; Tragfähigkeitsnachweise
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4 text-slate-600">
                      <div>
                        Querschnittsfläche A: <strong className="text-slate-800">{formatDeWert(staticsResults.A)} mm²</strong>
                      </div>
                      <div>
                        Trägheitsmoment I: <strong className="text-slate-800">{formatDeZahl(staticsResults.I / 10000, 1)} · 10⁴ mm⁴</strong>
                      </div>
                      <div>
                        Spannung sigma_c_d (Druck): <strong className="text-slate-800">{formatDeZahl(staticsResults.sigma_c_d, 2)} N/mm²</strong>
                      </div>
                      <div>
                        Sparren-Auslastung (C24/EC5 Limit): <strong className="text-slate-800">{formatDeZahl(woodParams.f_m_d, 1)} N/mm²</strong>
                      </div>
                    </div>

                    {/* Stress comparison bars */}
                    <div className="space-y-4 pt-1 mb-4">
                      {/* Idealized straight bar */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-600">Statik nach Idealisiertem Aufmaß (e_0 = 0)</span>
                          <span className="font-mono text-emerald-700">{formatDeZahl(staticsResults.limitRatioIdeal, 1)} %</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, staticsResults.limitRatioIdeal)}%` }}
                          />
                        </div>
                      </div>

                      {/* Real deformed bar */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-900 font-bold">Statik nach Verformungsgerechtem Aufmaß (e_0 = {formatDeWert(initialDeformation)}mm)</span>
                          <span className={`font-mono font-bold ${staticsResults.limitRatio > 100 ? 'text-red-600' : 'text-amber-600'}`}>
                            {formatDeZahl(staticsResults.limitRatio, 1)} %
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              staticsResults.limitRatio > 100 ? 'bg-red-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, staticsResults.limitRatio)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stress delta message */}
                    <div className="p-3.5 rounded-lg border text-xs leading-normal">
                      {staticsResults.limitRatio > 100 ? (
                        <div className="text-red-800 border-red-200 bg-red-50 p-2 rounded">
                          <strong>⚠ EINSTURZGEFAHR EXZENTRISCH!</strong> Durch den exzentrischen Kraftangriff (sigma_m_d_eccentric = {formatDeZahl(staticsResults.sigma_m_d_eccentric, 2)} N/mm²) überschreitet das Gebälk die zulässige Tragfähigkeit um <strong>{formatDeZahl(staticsResults.limitRatio - 100, 1)} %</strong>. Die Berechnung mit idealisierten Werten (Auslastung: {formatDeZahl(staticsResults.limitRatioIdeal, 1)} %) hätte ein vermeintlich sicheres Tragwerk vorgegeben!
                        </div>
                      ) : (
                        <div className="text-slate-700 border-indigo-100 bg-indigo-50/20 p-2 rounded">
                          <strong>Tragverhalten stabil:</strong> Das verformte Bauteil hält den Lasten noch stand (Auslastung: {formatDeZahl(staticsResults.limitRatio, 1)} %). Die Auslastung steigt durch die Exzentrizität von <strong>{formatDeZahl(staticsResults.limitRatioIdeal, 1)} %</strong> auf <strong>{formatDeZahl(staticsResults.limitRatio, 1)} %</strong> (Interaktion σ_c,d/(k_c·f_c,0,d) + σ_m,d/f_m,d ≤ 1, EC5 6.3.2).
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mt-4 leading-normal italic">
                    Berechnungsverfahren nach DIN EN 1995-1-1 (Eurocode 5) unter Berücksichtigung der Biegespannung aus asymmetrischem Kraftangriff nach Theorie II. Ordnung.
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- Module Footer --- */}
      <ModuleFooter 
        wikipedia={[
          { title: "Laserscanning", url: "https://de.wikipedia.org/wiki/Laserscanning" },
          { title: "Fotogrammetrie", url: "https://de.wikipedia.org/wiki/Fotogrammetrie" },
          { title: "Eurocode 5 (Holzbau)", url: "https://de.wikipedia.org/wiki/Eurocode_5" }
        ]}
        literatur={[
          "Neuhaus, H.: Ingenieurholzbau: Grundlagen - Bemessung - Nachweise nach Eurocode 5.",
          "Eckstein, G.: Empfehlungen für Baudokumentationen. Bauaufnahme – Bauuntersuchung. Landesdenkmalamt Baden-Württemberg, Arbeitsheft 7."
        ]}
        regelwerke={[
          { title: "DIN 18710-1 (Ingenieurvermessung - Teil 1: Allgemeine Anforderungen)", url: "https://www.dinmedia.de/de/suche?q=DIN+18710-1" },
          { title: "DIN EN 1995-1-1 (Eurocode 5: Bemessung und Konstruktion von Holzbauten)", url: "https://www.dinmedia.de/de/suche?q=DIN+EN+1995-1-1" },
          { title: "Eckstein, G.: Empfehlungen für Baudokumentationen – Genauigkeitsstufen I–IV (Landesdenkmalamt Baden-Württemberg)", url: "https://www.denkmalpflege-bw.de/" }
        ]}
        formeln={[
          {
            formel: "I_y = \\frac{b \\cdot h^3}{12}",
            erklaerung: "Flächenträgheitsmoment des rechteckigen Sparrenquerschnitts für Biegung um die y-Achse.",
            quelle: "DIN EN 1995-1-1"
          },
          {
            formel: "\\sigma_{c,0,d} = \\frac{N_d}{A}",
            erklaerung: "Rechnerische Druckspannung unter zentrischer Normalkraft parallel zur Holzfaser.",
            quelle: "DIN EN 1995-1-1"
          },
          {
            formel: "M_d = \\frac{q_d \\cdot L^2}{8} + N_d \\cdot e_0",
            erklaerung: "Kombiniertes Biegemoment aus Gleichlast (q_d) und exzentrischem Kraftangriff infolge Imperfektion (e_0).",
            quelle: "Eurocode 5"
          }
        ]}
      />

    </div>
  );
}
