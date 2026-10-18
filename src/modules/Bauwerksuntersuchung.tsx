import React, { useState } from 'react';
import { Search, Eye, Activity, Hammer, Building2, ArrowRight, BookOpen, ClipboardCheck, FlaskConical, LifeBuoy, FileSpreadsheet, Layers } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { useTabContext } from '@/src/contexts/TabContext';
import PruefverfahrenKatalog from './bauwerksuntersuchung/PruefverfahrenKatalog';
import ProbenahmePlaner from './bauwerksuntersuchung/ProbenahmePlaner';
import InterpretationNavigator from './bauwerksuntersuchung/InterpretationNavigator';
import { Scale } from 'lucide-react';

const ZfP = React.lazy(() => import('./ZfP'));

export default function Bauwerksuntersuchung() {
  const { activeTab, setActiveTab } = useTabContext();
  const [subTab, setSubTab] = useState<'diagnose' | 'probenahme' | 'interpretation' | 'katalog' | 'zfp'>(activeTab === 'zfp' ? 'zfp' : 'diagnose');
  const [activeStep, setActiveStep] = useState<number>(1);

  // Sync state if activeTab changes externally
  React.useEffect(() => {
    if (activeTab === 'zfp') {
      setSubTab('zfp');
    } else if (activeTab === 'bauwerksuntersuchung') {
      setSubTab('diagnose');
    }
  }, [activeTab]);

  const stepsDetails = [
    {
      id: 1,
      title: "1. Recherche, Planung & Archivrecherche",
      icon: BookOpen,
      color: "blue",
      desc: "Das Fundament jeder erfolgreichen Bauwerksuntersuchung liegt im Studium der Bestandsunterlagen vor dem ersten Baustellenbesuch.",
      bullets: [
        "Sichtung der ursprünglichen statischen Berechnung, Bewehrungspläne, Schalungspläne und Abnahmeprotokolle.",
        "Auswertung historischer Prüfberichte (z.B. Brückenbücher nach DIN 1076 oder Prüfbücher nach VDI 6200).",
        "Ermittlung des statischen Systems und Identifikation von statisch hochbeanspruchten, kritischen Querschnitten.",
        "Erstellung eines zielgerichteten Untersuchungskonzepts (Probenahme- und Rasterpläne)."
      ],
      standards: [
        "VDI 6200 (\"Standsicherheit von Bauwerken\")",
        "DIN 1076 (\"Ingenieurbauwerke - Überwachung\")",
        "TR Instandhaltung DIBt (\"Technische Regel Instandhaltung\")"
      ],
      linkText: "Zum Zustandsbewertungs-Modul (VDI 6200 / DIN 1076)",
      linkTab: "vdi6200"
    },
    {
      id: 2,
      title: "2. Visuelle Ersterfassung & Schadenskartierung",
      icon: Eye,
      color: "orange",
      desc: "Die handnahe, visuelle Begutachtung liefert ein erstes makroskopisches Bild der Schäden und lokalisiert Fehlstellen.",
      bullets: [
        "Systematische Rissaufnahme (Rissbreite mittels Risslupe bestimmen, Rissverlauf und Rissursachen bewerten).",
        "Kartierung von feuchten Stellen, Ausblühungen, Versinterungen, Rostfahnen und Betonabplatzungen.",
        "Klopfprüfung zur Ortung von Hohlstellen (Delaminationen) über dem korrodierenden Bewehrungsstahl.",
        "Fotodokumentation und Übertrag in ein Schadenskataster als Grundlage für Instandsetzungskonzepte."
      ],
      standards: [
        "DIN 1076 (\"Bauwerksprüfung Handbereich\")",
        "DBV-Merkblatt \"Risse im Beton (Untersuchung & Bewertung)\"",
        "WTA-Merkblatt 2-9 (\"Mauerwerksinstandsetzung - Schadensanalyse\")"
      ],
      linkText: "Klassische Bauschadensbilder analysieren",
      linkTab: "bauschaeden"
    },
    {
      id: 3,
      title: "3. Vor-Ort-Messdiagnostik (ZfP)",
      icon: Activity,
      color: "emerald",
      desc: "Zerstörungsfreie Prüfverfahren (ZfP) erlauben ein engmaschiges Scannen des Tragwerks, ohne die Tragfähigkeit zu schwächen.",
      bullets: [
        "Bewehrungssuchgerät (Elektromagnetische Ortung der Betondeckung 'c' und Erstellung von Bewehrungsrasterfrequenzen).",
        "Rückprallhammer (Schmidtscher Hammer) zur näherungsweisen Abschätzung der Beton-Oberflächenhärte.",
        "Potentialfeldmessung zur zerstörungsfreien Lokalisierung aktiv korrodierender Bewehrungsbereiche im Zementstein.",
        "Karbonatisierungstiefe bestimmen mittels Phenolphthalein-Indikatorsprühung an frisch hergestellten Stemmbrüchen."
      ],
      standards: [
        "DGZfP-Merkblätter B 02 (Betondeckung) / B 03 (Potentialmessung) / B 04 (Ultraschall)",
        "DBV-Merkblatt \"Betondeckung und Bewehrung\" (2015)",
        "DIN EN 12504-4 (\"Ultraschalllaufzeit im Festbeton\")"
      ],
      linkText: "Alle Prüfverfahren im Detailkatalog untersuchen",
      linkTab: "katalog"
    },
    {
      id: 4,
      title: "4. Zerstörende Ergänzungsprüfung (Labor)",
      icon: Hammer,
      color: "purple",
      desc: "Zur Kalibrierung der ZfP-Messergebnisse und für Tiefendiagnosen sind punktuelle Bohrkernentnahmen unerlässlich.",
      bullets: [
        "Bohrkernentnahme zur Bestimmung der realen Betondruckfestigkeit im Labor (Zylinderdruckprüfung).",
        "Entnahme von Bohrmehlproben in Millimeterstufen zur chemischen Analyse von chloridinduzierter Lochfraßgefahr.",
        "Mikroskopische Dünnschliffanalysen zur Untersuchung von Alkalitreiben (AKR) oder Sulfatangriffen.",
        "Quantitative Mineralphasen-Bestimmung bei Zersetzungserscheinungen (z.B. mittels XRD-Spektren im Labor)."
      ],
      standards: [
        "DIN EN 12504-1 (\"Zylindrische Bohrkernentnahme und Druckprüfung\")",
        "DIN EN 13791 (\"Bewertung der In-situ-Betondruckfestigkeit\")",
        "DIN EN 14629 (\"Bestimmung des Chloridgehalts im Labor\")"
      ],
      linkText: "Zerstörende & Laborprüfverfahren im Detail ansehen",
      linkTab: "katalog"
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Sub-tab Switcher Toolbar mit 5 Kernmodulen */}
      <div className="flex border border-home-grau/30 bg-white p-1 rounded-2xl shadow-sm gap-2 flex-wrap">
        <button
          className={`flex-1 min-w-[180px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            subTab === 'diagnose'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          onClick={() => {
            setSubTab('diagnose');
            if (activeTab === 'zfp') setActiveTab('bauwerksuntersuchung');
          }}
        >
          <Search size={16} />
          <span>Diagnose-Phasen</span>
        </button>

        <button
          className={`flex-1 min-w-[200px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            subTab === 'probenahme'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          onClick={() => {
            setSubTab('probenahme');
            if (activeTab === 'zfp') setActiveTab('bauwerksuntersuchung');
          }}
        >
          <ClipboardCheck size={16} />
          <span>Prüfumfang &amp; Konditionierung</span>
        </button>

        <button
          className={`flex-1 min-w-[200px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            subTab === 'interpretation'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          onClick={() => {
            setSubTab('interpretation');
            if (activeTab === 'zfp') setActiveTab('bauwerksuntersuchung');
          }}
        >
          <Scale size={16} />
          <span>Interpretation &amp; Anwendung</span>
        </button>

        <button
          className={`flex-1 min-w-[190px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            subTab === 'katalog'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          onClick={() => {
            setSubTab('katalog');
            if (activeTab === 'zfp') setActiveTab('bauwerksuntersuchung');
          }}
        >
          <Layers size={16} />
          <span>Prüfkatalog (14 Verf.)</span>
        </button>

        <button
          className={`flex-1 min-w-[170px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            subTab === 'zfp'
              ? 'bg-shiraz text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          onClick={() => {
            setSubTab('zfp');
            if (activeTab === 'bauwerksuntersuchung') setActiveTab('zfp');
          }}
        >
          <Activity size={16} />
          <span>DGZfP &amp; Ausbildung</span>
        </button>
      </div>

      {subTab === 'diagnose' && (
        <>
          {/* Haupt-Einführung */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Search className="text-shiraz" /> Bauwerksuntersuchung / Zustandsanalyse
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Prüfphasen, messtechnische Diagnostik und interdisziplinäre Systematik im Bestand
          </p>
        </div>
            </div>
            
            <div className="text-sm text-slate-800 bg-slate-50 p-4 rounded-xl border border-home-grau/30 leading-relaxed">
              <p>
                Eine umfassende <strong>Bauwerksuntersuchung (Ist-Analyse)</strong> stellt die maßgebliche Grundlage für das Bauen im Bestand dar. Sie schätzt die Restlebensdauer ab, liefert verlässliche rechnerische Kennwerte für Statiker bei Traglaststeigerungen und dient als rechtssichere Grundlage für Instandsetzungsmaßnahmen gemäß der <strong>DIBt-Instandhaltungsrichtlinie (TR Instandhaltung)</strong>.
              </p>
            </div>
          </div>

          {/* Interaktiver Ablaufplaner (Bento-Art) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Linke Auswahlliste */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-gray-550 uppercase tracking-widest pl-1">Phasen der Tragwerksdiagnose</h3>
              <div className="flex flex-col gap-2.5">
                {stepsDetails.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3.5 relative ${
                        isActive 
                          ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-800'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-shiraz text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <StepIcon size={18} />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Schritt {step.id}</span>
                        <span className="text-sm leading-tight block">{step.title.replace(/^\d+\.\s*/, '')}</span>
                      </div>
                      {isActive && (
                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-shiraz animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rechte Detailanzeige */}
            <div className="lg:col-span-7">
              {(() => {
                const current = stepsDetails.find(s => s.id === activeStep)!;
                const DetailIcon = current.icon;
                return (
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4 min-h-[380px] justify-between h-full animate-in fade-in zoom-in-95 duration-150">
                    <div>
                      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-home-grau/30">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-shiraz shrink-0">
                          <DetailIcon size={16} />
                        </div>
                        <h3 className="font-bold text-base text-slate-900">{current.title}</h3>
                      </div>

                      <p className="text-sm font-medium text-slate-800 mb-4 leading-relaxed">
                        {current.desc}
                      </p>

                      <div className="space-y-2.5">
                        <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Prüfschwerpunkte &amp; Arbeitsmittel:</span>
                        <ul className="space-y-2">
                           {current.bullets.map((b, idx) => (
                            <li key={idx} className="text-xs text-slate-600 leading-relaxed flex gap-2 items-start">
                              <span className="text-shiraz select-none font-bold">✔</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {current.standards && (
                        <div className="space-y-2 pt-4 border-t border-slate-100 mt-4 animate-in fade-in duration-300">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Aktuelle Normen &amp; Prüfvorschriften:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {current.standards.map((std, idx) => (
                              <span key={idx} className="px-2 py-1 bg-[#FCF8F2] border border-home-grau/25 text-text-main/90 rounded text-[10px] font-mono leading-tight">
                                {std}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
     
                      {/* Querverweis direkt im Kontext */}
                    <div className="mt-6 pt-4 border-t border-home-grau/30">
                      <button
                        onClick={() => {
                          if (current.linkTab === 'katalog') {
                            setSubTab('katalog');
                          } else if (current.linkTab === 'zfp') {
                            setSubTab('zfp');
                            setActiveTab('zfp');
                          } else {
                            setActiveTab(current.linkTab as any);
                          }
                        }}
                        className="w-full py-2.5 px-4 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-xs"
                      >
                        <span>{current.linkText}</span>
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

          {/* Querverweise / Vernetzungsknotenpunkt (Static links for full linkage) */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-home-grau/30">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <ClipboardCheck className="text-slate-600 w-5 h-5" />
              Gebäudediagnostik - Übersicht verknüpfter Wissensmodule
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Umfangreiche Bauwerksdiagnostik erfordert stets ein fächerübergreifendes Ineinandergreifen von Richtlinien, physikalischer Sensorik und chemischer Analytik. Nutzen Sie die direkten Shortcuts in die jeweiligen Spezialthemen:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab('vdi6200')}
                className="p-3 bg-white hover:bg-slate-100 border border-home-grau/30 hover:border-shiraz/40 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1"
              >
                <span className="font-bold text-xs text-slate-800">Regelwerke</span>
                <span className="text-xs text-slate-500">Zustandsbewertung nach DIN 1076 und VDI 6200. Mängelkatalog &amp; Robustheit.</span>
              </button>
              <button
                onClick={() => setSubTab('katalog')}
                className="p-3 bg-white hover:bg-slate-100 border border-home-grau/30 hover:border-shiraz/40 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1"
              >
                <span className="font-bold text-xs text-slate-800">Prüfkatalog</span>
                <span className="text-xs text-slate-500">Alle 14 Verfahren im Detailgrad von Bohrwiderstand mit interaktiven Simulatoren.</span>
              </button>
              <button
                onClick={() => setActiveTab('analytik')}
                className="p-3 bg-white hover:bg-slate-100 border border-home-grau/30 hover:border-shiraz/40 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1"
              >
                <span className="font-bold text-xs text-slate-800">Laboranalytik</span>
                <span className="text-xs text-slate-500">Röntgendiffraktometrie (XRD), REM Mikroskopie, Chloridgehalte bestimmen.</span>
              </button>
              <button
                onClick={() => setActiveTab('bauschaeden')}
                className="p-3 bg-white hover:bg-slate-100 border border-home-grau/30 hover:border-shiraz/40 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1"
              >
                <span className="font-bold text-xs text-slate-800">Schadensbilder</span>
                <span className="text-xs text-slate-500">Alkali-Kieselsäure-Reaktion (AKR), Betonausblühungen, Rissentstehung im Beton.</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* SUBTAB: PROBENAHME & KONDITIONIERUNG (NEU NACH NUTZERANFORDERUNG) */}
      {subTab === 'probenahme' && (
        <ProbenahmePlaner />
      )}

      {/* SUBTAB: INTERPRETATION & ANWENDUNG DER ERGEBNISSE (NEU NACH NUTZERANFORDERUNG) */}
      {subTab === 'interpretation' && (
        <InterpretationNavigator />
      )}

      {/* SUBTAB: PRÜFVERFAHREN-KATALOG (DETAILGRAD BOHRWIDERSTAND) */}
      {subTab === 'katalog' && (
        <PruefverfahrenKatalog />
      )}

      {/* SUBTAB 3: DGZfP & ZfP-AUSBILDUNG */}
      {subTab === 'zfp' && (
        <React.Suspense fallback={<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shiraz"></div></div>}>
          <ZfP />
        </React.Suspense>
      )}

      {/* Standardisierter ModuleFooter für Bauwerksuntersuchung */}
      <ModuleFooter
        wikipedia={[
          { title: 'Bauwerksdiagnostik', url: 'https://de.wikipedia.org/wiki/Bauwerksdiagnostik' },
          { title: 'Zerstörungsfreie Werkstoffprüfung', url: 'https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Werkstoffpr%C3%BCfung' },
          { title: 'Bohrwiderstandsmessung', url: 'https://de.wikipedia.org/wiki/Bohrwiderstandsmessung' },
          { title: 'Schmidt-Hammer', url: 'https://de.wikipedia.org/wiki/Schmidt-Hammer' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Rinn, F.: Bohrwiderstandsmessung an Holz (Resistograph) – Originalpatent/Quelle prüfen'
        ]}
        regelwerke={[
          { title: 'DIN EN 13791:2020-02 (Bewertung der Druckfestigkeit von Beton in Bauwerken oder in Bauwerksteilen)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 12504-1:2019-09 (Bohrkernproben - Herstellung, Untersuchung und Prüfung der Druckfestigkeit)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 12504-2:2021-08 (Bestimmung der Rückprallzahl mit dem Schmidt-Hammer)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 12504-4:2021-08 (Bestimmung der Ultraschallimpulsgeschwindigkeit)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 14629:2007-06 (Bestimmung des Chloridgehaltes in Festbeton - Säureaufschluss und Titration)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 14630:2007-01 (Bestimmung der Karbonatisierungstiefe im Festbeton mit Phenolphthalein)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 1542:1999-07 (Messung der Haftfestigkeit im Abreißversuch mit Prüfstempel Ø 50 mm)', url: 'https://www.dinmedia.de/' },
          { title: 'DBV-Merkblatt Betondeckung und Bewehrung (2015-12, statistisches 5 %-Quantil)', url: 'https://www.betonverein.de/' },
          { title: 'DGZfP-Merkblätter B 02 (Betondeckung), B 03 (Potentialmessung, 2025), B 04 (Ultraschall), B 10 (Radar), B 11 (Impakt-Echo, 2022)', url: 'https://publikationen.dgzfp.de/' },
          { title: 'TR Instandhaltung von Betonbauwerken (DIBt) – korrosionsauslösender Chloridgehalt objektspezifisch durch den sachkundigen Planer', url: 'https://www.dibt.de/' },
          { title: 'DIN 68800-2 / -4 (Holzschutz; bekämpfende Maßnahmen) – Bohrwiderstandsmessung selbst ist nicht genormt', url: 'https://www.dinmedia.de/de/suche?q=DIN+68800-4' },
          { title: 'VDI 6200:2010-02 (Standsicherheit von Bauwerken - Regelmäßige Überprüfung)', url: 'https://www.vdi.de/' }
        ]}
        formeln={[
          {
            formel: 'M_{\\text{Bohr}}(z) = c_1 \\cdot \\rho_{\\text{local}}(z) \\cdot A_{\\text{Nadel}} + f_{\\text{friction}}(z)',
            erklaerung: 'Bohrprofil-Widerstandsmessung (Holzresistographie): Bohrdrehmoment M_Bohr über die Eindringtiefe z zur Detektion von Jahrringdichten, Fäulnis und Insektenfraß.',
            quelle: 'Bohrwiderstandsmessung (nicht genormt)'
          },
          {
            formel: 'v_L = \\frac{L}{t_p} = \\sqrt{\\frac{E \\cdot (1 - \\nu)}{\\rho \\cdot (1 + \\nu)(1 - 2\\nu)}}',
            erklaerung: 'Longitudinale Ultraschallimpulsgeschwindigkeit v_L [km/s] zur Erfassung von Bauteilhomogenität, Rissen, Hohlstellen und dynamischem E-Modul.',
            quelle: 'DIN EN 12504-4'
          },
          {
            formel: 'f_c = a \\cdot R^b \\quad \\text{bzw.} \\quad f_{ck,\\text{is}} = \\alpha \\cdot R + \\beta \\cdot v_L + \\gamma',
            erklaerung: 'Korrelationsbeziehung (z.B. SonReb-Methode) zwischen Rückprallwert R, Ultraschallgeschwindigkeit v_L und der In-situ-Druckfestigkeit des Betons.',
            quelle: 'RILEM TC 43 / DIN EN 13791'
          },
          {
            formel: 'd_k(t) = k_{\\text{carb}} \\cdot \\sqrt{t}',
            erklaerung: 'Karbonatisierungs-Fortschritt nach dem Fickschen Diffusionsgesetz mit Karbonatisierungsbeiwert k_carb in mm/√Jahr zur Prognose der Passivierungsreserve.',
            quelle: 'DIN EN 14630'
          },
          {
            formel: 'f_{\\text{ct}} = \\frac{4 \\cdot F_{\\text{break}}}{\\pi \\cdot d^2}',
            erklaerung: 'Oberflächenzugfestigkeit bzw. Abreißfestigkeit im Haftabzugversuch mit Prüfstempel Ø 50 mm (Grenzforderung für Untergründe: f_ct,mean ≥ 1,5 N/mm²).',
            quelle: 'DIN EN 1542 / ZTV-ING'
          },
          {
            formel: 'f_{ck,\\text{is}} = \\min\\left(f_{m,\\text{is}} - 1{,}48 \\cdot s, \\; f_{\\text{is,lowest}} + 4\\right)',
            erklaerung: 'Charakteristische In-situ-Druckfestigkeit nach DIN EN 13791:2020-02 (ab n = 8 Bohrkernen; k_n = 2,00 bis 1,64, s mindestens entsprechend V = 8 %, Zuschlag M = 1–4 N/mm²); Einstufung mit f_ck = f_ck,is / 0,85.',
            quelle: 'DIN EN 13791'
          },
          {
            formel: 'f_{cd,\\text{is}} = \\frac{\\eta \\cdot f_{ck,\\text{is}}}{\\gamma_c} = \\frac{0{,}85 \\cdot f_{ck,\\text{is}}}{1{,}50}',
            erklaerung: 'Statische Bemessungsdruckfestigkeit nach Eurocode 2 (DIN EN 1992-1-1) unter Berücksichtigung des Dauerstand- und In-situ-Faktors η = 0,85 für die Tragwerksnachrechnung.',
            quelle: 'DIN EN 1992-1-1'
          },
          {
            formel: 'C(x, t) = C_s \\cdot \\left[1 - \\text{erf}\\left(\\frac{x}{2 \\sqrt{D_{\\text{app}} \\cdot t}}\\right)\\right]',
            erklaerung: 'Ficksches 2. Diffusionsgesetz zur Modellierung des Chloridprofils aus tiefengestaffelter Bohrmehlanalyse zur Prognose der Restlebensdauer bis zum korrosionsauslösenden Chloridgehalt (Anhaltswert ≈ 0,5 M.-% bez. Zement, objektspezifisch).',
            quelle: 'DIN EN 14629 / TR Instandhaltung (DIBt)'
          },
          {
            formel: '\\Delta c = c_{\\text{act,0.05}} - d_k = c_{\\text{act,0.05}} - k_{\\text{carb}} \\cdot \\sqrt{t}',
            erklaerung: 'Restpassivierungsreserve der Betondeckung gegenüber der Karbonatisierungsfront. Bei Δc ≤ 0 mm ist die alkalische Passivschicht zerstört und es droht Sauerstoff-Rostbildung.',
            quelle: 'DIN EN 14630 / DBV'
          }
        ]}
      />
    </div>
  );
}
