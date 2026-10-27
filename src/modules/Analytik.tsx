import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { Microscope, Activity, Compass, Wind, Layers, Flame, MousePointerClick, Info } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/analytik/Analytik.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

const TGAInteraction = () => {
  const [temp, setTemp] = useState(20);
  
  // Mass loss logic
  const getMass = (t: number) => {
    // Lehrmodell einer Zementstein-/Betonprobe (Massenanteile in %):
    // freies Wasser 30–105 °C, C-S-H/Ettringit/AFm 105–400 °C, Portlandit 400–500 °C, Calcit 600–800 °C
    const anteil = (a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
    let mass = 100;
    mass -= 2 * anteil(30, 105);   // freies (verdampfbares) Wasser
    mass -= 4 * anteil(105, 400);  // chemisch gebundenes Wasser aus C-S-H, Ettringit, AFm
    mass -= 2.5 * anteil(400, 500); // Ca(OH)2 → CaO + H2O
    mass -= 6 * anteil(600, 800);  // CaCO3 → CaO + CO2 (Karbonatisierung bzw. kalkst. Gesteinskörnung)
    return formatDeZahl(mass, 1);
  };

  const getPhase = (t: number) => {
    if (t < 30) return "Ausgangszustand";
    if (t < 105) return inhalt.werte.verdampfenDesFreienWassers;
    if (t < 400) return inhalt.werte.abgabeChemischGebundenenWassers;
    if (t < 500) return inhalt.werte.zersetzungVonPortlanditCa;
    if (t < 600) return inhalt.werte.kaumMassenänderung;
    if (t < 800) return inhalt.werte.zersetzungVonCalciumcarbonatCaco;
    return inhalt.werte.zersetzungsreaktionenWeitgehendAbgeschlo;
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-home-grau/30 shadow-inner">
      <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><MousePointerClick size={16}/><MdText text={inhalt.texte.interaktivTgaSimulatorZementsteinprobe} /></h4>
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">Temperatur: {formatDeWert(temp)}°C</label>
        <input 
          type="range" 
          min="20" max="1000" 
          value={temp} 
          onChange={(e) => setTemp(Number(e.target.value))}
          className="w-full accent-orange-600" 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 p-3 rounded-md border border-orange-100 flex flex-col items-center justify-center">
          <span className="text-xs text-orange-800 uppercase tracking-wider font-bold">Masse</span>
          <span className="text-2xl font-mono text-orange-600">{getMass(temp)}%</span>
        </div>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex flex-col justify-center">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Prozess</span>
          <span className="text-sm text-gray-800 leading-tight">{getPhase(temp)}</span>
        </div>
      </div>
    </div>
  );
};

const MIPInteraction = () => {
  const [pressure, setPressure] = useState(1);
  
  const getPoreRadius = (p: number) => {
    return formatDeZahl(7500 / p, 1);
  };

  const getPoreType = (p: number) => {
    const r = 7500 / p;
    if (r > 50) return inhalt.werte.kapillarporenTransportVonWasser;
    if (r > 10) return inhalt.werte.übergangsbereichKleineKapillarporenGroße;
    return inhalt.werte.gelporenTeilDesC;
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-home-grau/30 shadow-inner">
      <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><MousePointerClick size={16}/><MdText text={inhalt.texte.interaktivMipEinpressdruckUnd} /></h4>
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1"><MdText text={inhalt.texte.druckLog10} />{formatDeWert(pressure)} bar</label>
        <input 
          type="range" 
          min="0" max="3.6" step="0.1"
          value={pressure} 
          onChange={(e) => setPressure(Number(e.target.value))}
          className="w-full accent-cyan-600" 
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-50 p-3 rounded-md border border-cyan-100 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-cyan-800 uppercase tracking-wider font-bold mb-1">Porenradius</span>
          <span className="text-xl font-mono text-cyan-600">ca. {getPoreRadius(Math.pow(10, pressure))} nm</span>
        </div>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex items-center text-center justify-center">
          <span className="text-sm text-gray-800 leading-tight">{getPoreType(Math.pow(10, pressure))}</span>
        </div>
      </div>
    </div>
  );
};

const RemEdxInteraction = () => {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  const points = inhalt.daten["RemEdxInteraction.points"];

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-home-grau/30 shadow-inner">
      <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><MousePointerClick size={16}/><MdText text={inhalt.texte.interaktivRemEdxPunktsonde} /></h4>
      <div className="flex flex-col md:flex-row gap-4">
        <AuswahlGruppe label="Messpunkt" className="relative w-full md:w-1/2 aspect-video bg-stone-300 rounded-md border border-stone-400 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.35)_1px,transparent_0)] bg-[length:6px_6px] mix-blend-multiply" aria-hidden="true"></div>
          <span className="text-stone-500 font-mono text-xs z-0 relative font-bold uppercase tracking-widest"><MdText text={inhalt.texte.remVisualisierung} /></span>
          
          {points.map((pt) => (
            <button {...alsOption(selectedPoint === pt.id)}
              key={pt.id}
              onClick={() => setSelectedPoint(pt.id)}
              className={`absolute w-5 h-5 rounded-full border-[3px] transform -translate-x-1/2 -translate-y-1/2 transition-all shadow-sm z-10 ${selectedPoint === pt.id ? 'bg-purple-500 border-white scale-125 cursor-default' : 'bg-white/50 border-purple-500 hover:scale-110 cursor-pointer animate-pulse'}`}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              title="EDX Analyse"
            />
          ))}
        </AuswahlGruppe>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          {selectedPoint ? (
            <div className="bg-purple-50 p-4 rounded-md border border-purple-100 animate-in fade-in zoom-in-95 duration-200 h-full flex flex-col justify-center">
              <span className="text-xs text-purple-800 uppercase tracking-wider font-bold block mb-1"><MdText text={inhalt.texte.spektrumAuswertung} /></span>
              <h5 className="font-bold text-gray-900 text-lg">{points.find(p => p.id === selectedPoint)?.name}</h5>
              <div className="flex gap-2 items-center mt-2 mb-2">
                <span className="font-mono text-sm bg-purple-200 text-purple-900 px-2 py-0.5 rounded shadow-sm font-bold border border-purple-300">{points.find(p => p.id === selectedPoint)?.elements}</span>
              </div>
              <p className="text-sm text-gray-700 mt-1 leading-snug">{points.find(p => p.id === selectedPoint)?.desc}</p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 p-4 rounded-md text-center flex flex-col items-center justify-center h-full text-gray-500">
              <Info size={24} className="mb-2 opacity-50"/>
              <p className="text-sm"><MdText text={inhalt.texte.klickenSieAufMesspunkte} /></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const XrdInteraction = () => {
    const [selectedMineral, setSelectedMineral] = useState<string | null>(null);

    const peaks = [
        { angle: 9.1, name: "Ettringit", mineral: "Ettringit", intensity: 40 },
        { angle: 18.0, name: "Portlandit", mineral: "CH", intensity: 65 },
        { angle: 26.6, name: "Quarz", mineral: "SiO2", intensity: 100 },
        { angle: 29.4, name: "Calcit", mineral: "CaCO3", intensity: 80 }
    ];

    return (
        <div className="mt-4 p-4 bg-white rounded-lg border border-home-grau/30 shadow-inner">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                <MousePointerClick size={16} /><MdText text={inhalt.texte.interaktivXrdDiffraktogrammReflex} /></h4>
            <div className="relative h-40 bg-slate-50 border-b-2 border-l-2 border-home-grau/30 rounded-bl-sm pt-4 pr-4 ml-6 mb-6 mt-4">
                <div className="absolute -bottom-6 right-2 text-xs text-slate-500 font-mono"><MdText text={inhalt.texte.t2CuK} /></div>
                <div className="absolute top-2 -left-8 text-xs text-slate-500 font-mono -rotate-90 origin-top-left transform translate-y-8">Intensität</div>
                
                {/* Simulated baseline noise */}
                <svg className="absolute inset-x-0 bottom-0 h-full w-full opacity-30 pointer-events-none" preserveAspectRatio="none">
                    <path d="M0,150 Q10,145 20,150 T40,150 T60,150 T80,148 T100,150 T120,150 T140,150 T160,152 T180,150 T200,150 T220,149 T240,150 T260,150 T280,150 T300,150 T320,151 T340,150 L340,160 L0,160 Z" fill="none" stroke="#64748b" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                </svg>

                {/* Peaks */}
                <div className="absolute bottom-0 left-0 right-0 h-full flex items-end px-2">
                    <div className="relative w-full h-full">
                        {peaks.map((p, i) => {
                            const percentX = (p.angle / 40) * 100;
                            const isSelected = selectedMineral === p.mineral;
                            return (
                                <div 
                                    key={i} 
                                    className="absolute bottom-0 flex flex-col items-center transform -translate-x-1/2 cursor-pointer group"
                                    style={{ left: `${percentX}%`, height: `${p.intensity}%` }}
                                    onClick={() => setSelectedMineral(p.mineral)}
                                >
                                    <div className={`absolute -top-7 whitespace-nowrap px-2 py-0.5 bg-slate-800 text-white text-[10px] sm:text-xs rounded transition-opacity shadow-sm z-20 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        {p.name} ({formatDeWert(p.angle)}°)
                                    </div>
                                    <div className={`w-0.5 transition-all z-10 origin-bottom ${isSelected ? 'h-full bg-blue-600 scale-x-[3] scale-y-[1.05]' : 'h-full bg-blue-500 group-hover:scale-y-[1.05]'}`}></div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            
            <div className="mt-2 flex gap-2 justify-center items-center">
                <span className="text-sm text-gray-600"><MdText text={inhalt.texte.erkanntePhase} /></span>
                {selectedMineral ? 
                    <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-md shadow-sm border border-blue-200">{peaks.find(p => p.mineral === selectedMineral)?.name}</span> : 
                    <span className="text-sm italic text-gray-600 bg-gray-100 px-3 py-1 rounded-md"><MdText text={inhalt.texte.klickenSieAufEinen} /></span>
                }
            </div>
        </div>
    );
};

export default function Analytik() {
  const [activeTab, setActiveTab] = useState<'kristall' | 'chemie' | 'mikroskopie' | 'poren_thermo'>('kristall');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Microscope className="text-shiraz" /><MdText text={inhalt.texte.analyseverfahrenInDerBaustoffkunde} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.umfassendePhysikalischeChemischeUnd} /></p>
        </div>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.moderneMaterialdiagnostikErmöglichtEs} /></p>
        </div>

        <ModuleTabs
          label={inhalt.werte.bereicheAnalytik}
          tabs={[
            { id: 'kristall' as const, label: inhalt.texte.kristallographiePhasenXrdFtir },
            { id: 'chemie' as const, label: inhalt.texte.elementaranalyseRfaIcpOes },
            { id: 'mikroskopie' as const, label: inhalt.texte.mikroskopieGefügeRemEdx },
            { id: 'poren_thermo' as const, label: inhalt.texte.porendiagnostikThermoanalyse },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="flex flex-col gap-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20"
        >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* XRD */}
          {(activeTab === 'kristall') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Layers className="text-blue-600" size={20} /><MdText text={inhalt.texte.xrdRöntgendiffraktometrie} /></h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.bestimmtDieMineralogischeKristalline} /></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><MdText text={inhalt.texte.wasWirdGemessenBeugung} /></li>
                <li><MdText text={inhalt.texte.anwendungKlinkerphasenImZement} /></li>
                <li><MdText text={inhalt.texte.probenvorbereitungMaterialMussZu} /></li>
              </ul>
              <XrdInteraction />
            </div>
          )}

          {/* FTIR */}
          {(activeTab === 'kristall') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Activity className="text-pink-600" size={20} /><MdText text={inhalt.texte.ftirInfrarotspektroskopie} /></h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.analysiertFunktionelleGruppenOrganischer} /></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><MdText text={inhalt.texte.wasWirdGemessenMolekülschwingungen} /></li>
                <li><MdText text={inhalt.texte.anwendungIdealFürDie} /></li>
              </ul>
            </div>
          )}

          {/* NIR */}
          {(activeTab === 'kristall') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Activity className="text-indigo-500" size={20} /><MdText text={inhalt.texte.nirNahinfrarotspektroskopie} /></h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.zerstörungsfreieOptischeAbsorptionsspekt} /></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><MdText text={inhalt.texte.wasWirdGemessenMolekulare} /></li>
                <li><MdText text={inhalt.texte.anwendungZerstörungsfreieBestimmungDer} /></li>
                <li><MdText text={inhalt.texte.vorteilKontaktloseEchtzeitmessungAuch} /></li>
              </ul>
            </div>
          )}

          {/* RFA */}
          {(activeTab === 'chemie') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Activity className="text-emerald-600" size={20} /><MdText text={inhalt.texte.rfaRöntgenfluoreszenzanalyse} /></h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.bestimmtDieElementareChemische} /></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><MdText text={inhalt.texte.wasWirdGemessenProbe} /></li>
                <li><MdText text={inhalt.texte.anwendungNachweisVonSchwermetallen} /></li>
                <li><MdText text={inhalt.texte.tragbareGeräteHandRfa} /></li>
              </ul>
            </div>
          )}

          {/* ICP-OES */}
          {(activeTab === 'chemie') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Activity className="text-amber-600" size={20} />
                ICP-OES
              </h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.optischeEmissionsspektroskopieMitIndukti} /></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><MdText text={inhalt.texte.wieEsFunktioniertEine} /></li>
                <li><MdText text={inhalt.texte.anwendungHochempfindlichesVerfahrenZur} /></li>
              </ul>
            </div>
          )}

          {/* LIPS / LIBS */}
          {(activeTab === 'chemie') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Activity className="text-teal-600" size={20} /><MdText text={inhalt.texte.lipsLibsLaserinduziertePlasmaspektroskop} /></h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.laserInducedBreakdownSpectroscopy} /></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><MdText text={inhalt.texte.wieEsFunktioniertEin} /></li>
                <li><MdText text={inhalt.texte.anwendungOrtsaufgelösteElementverteilung} /></li>
                <li><MdText text={inhalt.texte.vorteilAuchAlsMobiles} /></li>
              </ul>
            </div>
          )}

          {/* Chloridbestimmung */}
          {(activeTab === 'chemie') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Activity className="text-red-650" size={20} /><MdText text={inhalt.texte.nasschemischeChloridbestimmungDinEn} /></h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.derStandardLaborwegZur} /></p>
              <div className="space-y-4 text-xs text-gray-700">
                <div className="bg-white p-2.5 rounded border border-home-grau/15">
                  <span className="font-bold text-shiraz"><MdText text={inhalt.texte.prüfungsablaufImDetail} /></span>
                  <ol className="list-decimal pl-4 mt-1 space-y-1">
                    <li><MdText text={inhalt.texte.probenahmeAufbereitungEntnahmeVon} /></li>
                    <li><MdText text={inhalt.texte.säureaufschlussAufschlussDesBohrmehls} /><strong className="font-mono text-[10px]">HNO₃</strong><MdText text={inhalt.texte.erfasstWirdDerSäurelösliche} /></li>
                    <li><MdText text={inhalt.texte.titrationVolhardOderPotentiometrisch} /><strong className="font-mono text-[10px]">AgNO₃</strong><MdText text={inhalt.texte.alsSilberchloridEndpunktPotentiometrisch} /></li>
                    <li><MdText text={inhalt.texte.berechnungChloridgehaltZunächstIn} /></li>
                  </ol>
                </div>
                <div className="bg-white p-2.5 rounded border border-home-grau/15 flex justify-between gap-2.5">
                  <div className="flex-1">
                    <span className="font-bold text-gray-800"><MdText text={inhalt.texte.höchstwertNeubetonStahlbetonDin} /></span>
                    <p className="font-mono font-bold text-amber-600 text-[11px] mt-0.5"><MdText text={inhalt.texte.max040M} /></p>
                  </div>
                  <div className="border-l border-home-grau/15 pl-2.5 flex-1">
                    <span className="font-bold text-gray-800"><MdText text={inhalt.texte.höchstwertNeubetonSpannbetonDin} /></span>
                    <p className="font-mono font-bold text-red-600 text-[11px] mt-0.5"><MdText text={inhalt.texte.max020M} /></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REM / ESEM / EDX */}
          {(activeTab === 'mikroskopie') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm md:col-span-2 transition-all animate-in fade-in duration-305">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Compass className="text-purple-600" size={20} /><MdText text={inhalt.texte.remEsemEdxRasterelektronenmikroskopie} /></h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.abbildungVonMikrostrukturenMit} /></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><MdText text={inhalt.texte.remRasterelektronenmikroskopHohesVakuum} /></li>
                <li><MdText text={inhalt.texte.esemEnvironmentalScanningElectron} /></li>
                <li><MdText text={inhalt.texte.edxEnergiedispersiveRöntgenspektroskopie} /></li>
              </ul>
              <RemEdxInteraction />
            </div>
          )}

          {/* μ-CT */}
          {(activeTab === 'mikroskopie') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm md:col-span-2 transition-all animate-in fade-in duration-305">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Compass className="text-indigo-600" size={20} /><MdText text={inhalt.texte.ctRöntgenMikrocomputertomographie} /></h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.zerstörungsfreieDreidimensionaleBildgebu} /></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><MdText text={inhalt.texte.wasWirdGemessenRöntgenabschwächung} /></li>
                <li><MdText text={inhalt.texte.anwendungCharakterisierungVonPorensystem} /></li>
                <li><MdText text={inhalt.texte.vorteilZerstörungsfreiUndDreidimensional} /></li>
              </ul>
            </div>
          )}

          {/* TGA */}
          {(activeTab === 'poren_thermo') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Flame className="text-orange-600" size={20} /><MdText text={inhalt.texte.tgaThermogravimetrischeAnalyse} /></h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.misstDieMassenänderungEiner} /></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><MdText text={inhalt.texte.anwendungBestimmungDesPortlanditgehalts} /></li>
              </ul>
              <TGAInteraction />
            </div>
          )}

          {/* MIP */}
          {(activeTab === 'poren_thermo') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Compass className="text-cyan-600" size={20} /><MdText text={inhalt.texte.mipQuecksilberdruckporosimetrie} /></h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.bestimmungDerPorenradienverteilungUnd} /></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><MdText text={inhalt.texte.wieEsFunktioniertQuecksilber} /></li>
                <li><MdText text={inhalt.texte.anwendungFrostwiderstandVonBeton} /></li>
              </ul>
              <MIPInteraction />
            </div>
          )}

          {/* GC-MS */}
          {(activeTab === 'poren_thermo') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all md:col-span-2 animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Wind className="text-teal-600" size={20} /><MdText text={inhalt.texte.gcMsGaschromatografieMassenspektrometrie} /></h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.gaschromatografieMitGekoppeltemMassenspe} /></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><MdText text={inhalt.texte.funktionsweiseDasOrganischeGemisch} /></li>
                <li><MdText text={inhalt.texte.anwendungStandardverfahrenZurIdentifizie} /></li>
              </ul>
            </div>
          )}

          {/* Protonen-NMR */}
          {(activeTab === 'poren_thermo') && (
            <div className="bg-stone-50 border border-home-grau/30 p-5 rounded-xl shadow-sm transition-all md:col-span-2 animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-home-prim mb-3 flex items-center gap-2">
                <Layers className="text-emerald-600" size={20} /><MdText text={inhalt.texte.protonenNmr1hNmr} /></h3>
              <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.zerstörungsfreieKernspinresonanzSpektros} /></p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li><MdText text={inhalt.texte.wieEsFunktioniertIn} /></li>
                <li><MdText text={inhalt.texte.anwendungKontinuierlicheVerfolgungDer} /></li>
                <li><MdText text={inhalt.texte.vorteilExtremSchonendesUnd} /></li>
              </ul>
            </div>
          )}

        </div>
        </ModuleTabs>

      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <div className="flex flex-col gap-6">
        <FormulaDerivationBox
          title={inhalt.werte.beispiel1PortlanditgehaltAus}
          zielGleichung="w_{CH} = \Delta m_{H_2O} \cdot \frac{M_{Ca(OH)_2}}{M_{H_2O}}"
          schritte={inhalt.daten["Analytik.schritte"]}
          ergebnisHinweis={inhalt.werte.einNiedrigerPortlanditgehaltIn}
          normQuelle={inhalt.werte.stöchiometrieVglScrivenerSnellings}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel2WelcherPorenradius}
          zielGleichung="r = \frac{-2\gamma \cos\theta}{p}"
          schritte={inhalt.daten["Analytik.schritte_2"]}
          ergebnisHinweis={inhalt.werte.faustformelRNm7}
          normQuelle={inhalt.werte.dinIso159011}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel3NetzebenenabstandDes}
          zielGleichung="n\lambda = 2d \sin\theta"
          schritte={inhalt.daten["Analytik.schritte_3"]}
          ergebnisHinweis={inhalt.werte.d0335Nm}
          normQuelle={inhalt.werte.dinEn139251}
        />
      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="analytik" />

      <ModuleFooter 
        wikipedia={[
          { title: inhalt.werte.röntgenbeugungXrd, url: 'https://de.wikipedia.org/wiki/R%C3%B6ntgenbeugung' },
          { title: inhalt.werte.röntgenfluoreszenzanalyseRfa, url: 'https://de.wikipedia.org/wiki/R%C3%B6ntgenfluoreszenzanalyse' },
          { title: inhalt.werte.rasterelektronenmikroskopRem, url: 'https://de.wikipedia.org/wiki/Rasterelektronenmikroskop' },
          { title: inhalt.werte.infrarotspektroskopieFtir, url: 'https://de.wikipedia.org/wiki/Infrarotspektroskopie' }
        ]}
        literatur={inhalt.daten["Analytik.literatur"]}
        regelwerke={inhalt.daten["Analytik.regelwerke"]}
        formeln={inhalt.daten["Analytik.formeln"]}
        lastReviewed={inhalt.werte.oktober2026Ap4}
      />
    </div>
  );
}
