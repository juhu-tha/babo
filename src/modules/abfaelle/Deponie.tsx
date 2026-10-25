import { Database, Layers, ShieldCheck, Droplets, Scale, HelpCircle } from 'lucide-react';
import { formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import inhalt from '@/content/abfaelle/Deponie.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface DeponieProps {
  activeBarrier: number;
  depVInputValue: number;
  depVSelectedParam: string;
  deponieSection: "basis" | "oberflaeche";
  selectedLayerIndex: number;
  setActiveBarrier: React.Dispatch<React.SetStateAction<number>>;
  setDepVInputValue: React.Dispatch<React.SetStateAction<number>>;
  setDepVSelectedParam: React.Dispatch<React.SetStateAction<string>>;
  setDeponieSection: React.Dispatch<React.SetStateAction<"basis" | "oberflaeche">>;
  setSelectedLayerIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function Deponie({ activeBarrier, depVInputValue, depVSelectedParam, deponieSection, selectedLayerIndex, setActiveBarrier, setDepVInputValue, setDepVSelectedParam, setDeponieSection, setSelectedLayerIndex }: DeponieProps) {
    const deponieParams: Record<string, { name: string; unit: string; limits: number[]; isEluat: boolean }> = {
      toc: inhalt.daten["Deponie.deponieParams.toc"],
      loi: inhalt.daten["Deponie.deponieParams.loi"],
      sulfat: inhalt.daten["Deponie.deponieParams.sulfat"],
      chlorid: { name: inhalt.werte.chloridClImEluat, unit: inhalt.werte.mgLImEluat, limits: [80, 1500, 1500, 2500], isEluat: true },
      pb: { name: inhalt.werte.bleiPbImEluat, unit: inhalt.werte.mgLImEluat2, limits: [0.05, 0.2, 1.0, 5.0], isEluat: true },
      as: { name: inhalt.werte.arsenAsImEluat, unit: inhalt.werte.mgLImEluat3, limits: [0.05, 0.2, 0.2, 2.5], isEluat: true },
      cd: { name: inhalt.werte.cadmiumCdImEluat, unit: inhalt.werte.mgLImEluat4, limits: [0.004, 0.05, 0.1, 0.5], isEluat: true },
      cu: { name: inhalt.werte.kupferCuImEluat, unit: inhalt.werte.mgLImEluat5, limits: [0.2, 1.0, 5.0, 10.0], isEluat: true },
      ni: { name: inhalt.werte.nickelNiImEluat, unit: inhalt.werte.mgLImEluat6, limits: [0.04, 0.2, 1.0, 4.0], isEluat: true },
      zn: { name: inhalt.werte.zinkZnImEluat, unit: inhalt.werte.mgLImEluat7, limits: [0.4, 2.0, 5.0, 20.0], isEluat: true },
      kw: { name: inhalt.werte.mineralölkohlenwasserstoffeC10C40Nur, unit: inhalt.werte.mgKgTmFeststoff, limits: [500, Infinity, Infinity, Infinity], isEluat: false }
    };

    const paramInfo = deponieParams[depVSelectedParam] || deponieParams.toc;

    const isLte = (val: number, limit: number) => val <= limit;

    const dk0Allowed = isLte(depVInputValue, paramInfo.limits[0]);
    const dkIAllowed = isLte(depVInputValue, paramInfo.limits[1]);
    const dkIIAllowed = isLte(depVInputValue, paramInfo.limits[2]);
    const dkIIIAllowed = isLte(depVInputValue, paramInfo.limits[3]);

    let finalClassVerdict = inhalt.werte.überschreitungDkIiiGrenzwert;
    let classColor = 'bg-shiraz/5 text-slate-900 border-shiraz/20';
    if (dk0Allowed) {
      finalClassVerdict = inhalt.werte.unbedenklichGeeignetFürDk;
      classColor = 'bg-slate-50 text-slate-800 border-home-grau/30';
    } else if (dkIAllowed) {
      finalClassVerdict = inhalt.werte.zulässigAbDeponieklasseDk;
      classColor = 'bg-slate-50 text-slate-800 border-home-grau/30';
    } else if (dkIIAllowed) {
      finalClassVerdict = inhalt.werte.erhöhtZulässigAbDeponieklasse;
      classColor = 'bg-slate-50 text-slate-800 border-home-grau/30';
    } else if (dkIIIAllowed) {
      finalClassVerdict = inhalt.werte.gefährlichStarkBelastetZulässig;
      classColor = 'bg-slate-50 text-slate-800 border-home-grau/30';
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div className="border-b border-home-grau/30 pb-4">
          <h3 className="text-2xl font-bold text-slate-850 flex items-center gap-2">
            <Database className="w-6 h-6 text-shiraz" /><MdText text={inhalt.texte.deponieverordnungDepvZuordnungsanalyse} /></h3>
          <p className="text-slate-500 text-sm mt-1"><MdText text={inhalt.texte.mineralischeAbfälleDieNicht} /></p>
        </div>

        {/* Deponieklassen Übersicht */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="font-extrabold text-slate-600 uppercase text-xs tracking-wider">DK 0</span>
              <h4 className="font-bold text-slate-800 mb-2 mt-0.5">Inertabfalldeponie</h4>
              <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.fürUnbelasteteInerteBauabfälle} /></p>
            </div>
            <div className="mt-2 pt-2 border-t border-home-grau/30 font-medium text-xs text-slate-700"><MdText text={inhalt.texte.beispielReinerBodenKiese} /></div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="font-extrabold text-slate-550 uppercase text-xs tracking-wider font-semibold">DK I</span>
              <h4 className="font-bold text-slate-800 mb-2 mt-0.5"><MdText text={inhalt.texte.nichtGefährlichGering} /></h4>
              <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.geringBelasteteMineralischeBaustoffe} /></p>
            </div>
            <div className="mt-2 pt-2 border-t border-home-grau/30 font-medium text-xs text-slate-700"><MdText text={inhalt.texte.beispielLeichtKontaminierterSchutt} /></div>
          </div>

          <div className="bg-slate-50/70 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="font-extrabold text-slate-550 uppercase text-xs tracking-wider font-semibold">DK II</span>
              <h4 className="font-bold text-slate-800 mb-2 mt-0.5"><MdText text={inhalt.texte.hausmüllähnlichMäßig} /></h4>
              <p className="text-slate-600 leading-relaxed"><MdText text={inhalt.texte.klassischeSiedlungsUndBauabfälle} /></p>
            </div>
            <div className="mt-2 pt-2 border-t border-home-grau/30 font-medium text-xs text-slate-700"><MdText text={inhalt.texte.beispielBelasteteSchlackenGipsbauteile} /></div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="font-extrabold text-slate-600 uppercase text-xs tracking-wider font-semibold">DK III</span>
              <h4 className="font-bold text-slate-800 mb-2 mt-0.5">Sondermülldeponie</h4>
              <p className="text-slate-650 leading-relaxed font-semibold"><MdText text={inhalt.texte.überwachungspflichtigeGefährlicheAbfälle} /></p>
            </div>
            <div className="mt-2 pt-2 border-t border-home-grau/30 font-medium text-xs text-slate-700"><MdText text={inhalt.texte.beispielAsbestplattenTeerigeBahnen} /></div>
          </div>

          <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/20 flex flex-col justify-between">
            <div>
              <span className="font-extrabold text-shiraz uppercase text-xs tracking-wider font-semibold">DK IV</span>
              <h4 className="font-bold text-slate-900 mb-2 mt-0.5">Untertagedeponie</h4>
              <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.dauerhafteKapselungInTiefen} /></p>
            </div>
            <div className="mt-2 pt-2 border-t border-shiraz/10 font-medium text-xs text-shiraz font-bold"><MdText text={inhalt.texte.beispielFiltrieraschenHochtoxischeSchluf} /></div>
          </div>
        </div>

        {/* Interactive Limit Checker */}
        <div className="p-5 rounded-2xl bg-white border border-home-grau/30 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1"><MdText text={inhalt.texte.interactiveDepvGrenzwertPrüfer} /></h4>
              <p className="text-xs text-slate-500 leading-relaxed"><MdText text={inhalt.texte.wählenSieEinenAnalysenwert} /></p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1"><MdText text={inhalt.texte.parameterSchadstoff} /></label>
                <select aria-label={inhalt.werte.parameterSchadstoff}
                  className="w-full text-xs font-mono bg-slate-50 border border-home-grau/30 rounded-lg p-2 outline-none focus:border-home-grau/30"
                  value={depVSelectedParam}
                  onChange={(e) => {
                    setDepVSelectedParam(e.target.value);
                    setDepVInputValue(deponieParams[e.target.value].limits[0]);
                  }}
                >
                  {Object.entries(deponieParams).map(([key, data]) => (
                    <option key={key} value={key}>{data.name} ({data.unit})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex justify-between">
                  <span>Labor-Analysenwert:</span>
                  <span className="font-mono text-slate-500 font-bold">{paramInfo.unit}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={paramInfo.limits[0] < 1 ? "0.001" : "0.5"}
                    min="0"
                    className="w-full text-xs font-mono bg-slate-50 border border-home-grau/30 rounded-lg p-2.5 outline-none focus:border-home-grau/30"
                    value={depVInputValue}
                    onChange={(e) => setDepVInputValue(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border text-xs font-bold leading-relaxed ${classColor}`}>
              {finalClassVerdict}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2"><MdText text={inhalt.texte.gesetzlicheGrenzwerteImVergleich} />{paramInfo.unit})</h5>

            <div className="space-y-3.5">
              {paramInfo.limits.map((lim, idx) => {
                const classes = inhalt.daten["Deponie.classes"];
                const cls = classes[idx];
                const isOk = depVInputValue <= lim;

                return (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${isOk ? 'bg-slate-50 border-home-grau/30' : 'bg-shiraz/5 border-shiraz/10 opacity-80'}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${cls.color} ${cls.text} border border-home-grau/30`}>{cls.label}</span>
                        <span className="font-bold text-slate-800">{Number.isFinite(lim) ? `C ≤ ${formatDeWert(lim)} ${paramInfo.unit}` : inhalt.werte.keinZuordnungswert}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{cls.desc}</p>
                    </div>
                    <div>
                      {isOk ? (
                        <span className="px-2 py-1 text-xs font-bold rounded bg-slate-100 text-slate-800 border border-home-grau/30"><MdText text={inhalt.texte.einhaltbar} /></span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-bold rounded bg-shiraz/15 text-shiraz border border-shiraz/35"><MdText text={inhalt.texte.überschritten} /></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 italic"><MdText text={inhalt.texte.wichtigerHinweisInDer} /></p>
          </div>
        </div>

        {/* Analytical and biological background */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/30">
            <h4 className="font-bold text-slate-900 mb-2"><MdText text={inhalt.texte.analytischeNachweisverfahrenEluatherstel} /></h4>
            <ul className="space-y-3 text-slate-650 leading-relaxed font-medium">
              <li>
                <strong className="text-slate-800"><MdText text={inhalt.texte.schüttelversuchDinEn12457} /></strong>
                <p className="text-xs mt-0.5 text-slate-500"><MdText text={inhalt.texte.dasStandardLaborverfahrenZur} /></p>
              </li>
              <li>
                <strong className="text-slate-850"><MdText text={inhalt.texte.säulenperkolationsprüfungDin19528} /></strong>
                <p className="text-xs mt-0.5 text-slate-500"><MdText text={inhalt.texte.imZugeDerMantelverordnung} /></p>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/30">
            <h4 className="font-bold text-slate-900 mb-2"><MdText text={inhalt.texte.gipsSulfatDieBiologische} /></h4>
            <p className="text-slate-700 leading-relaxed mb-3"><MdText text={inhalt.texte.derHoheSulfatgehaltIn} /></p>
            <ul className="list-decimal pl-4 space-y-2 text-slate-600 font-medium">
              <li><MdText text={inhalt.texte.gipsdeponierungsverbotAufDk0} /></li>
              <li><MdText text={inhalt.texte.anaerobeFäulnisgasbildungH2sWerden} /></li>
              <li><MdText text={inhalt.texte.ausschließlicheEntsorgungAlsMonofraktion} /></li>
            </ul>
          </div>
        </div>

        {/* Aufbau- und Barriereprinzip der Deponie (Multibarrierenkonzept & technischer Schichtenaufbau) */}
        <div className="border-t border-home-grau/20 pt-6 mt-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-slate-850 flex items-center gap-2">
              <Layers className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.aufbauUndBarriereprinzipVon} /></h3>
            <p className="text-slate-500 text-sm mt-1"><MdText text={inhalt.texte.dasSchutzkonzeptModernerDeponietechnisch} /></p>
          </div>

          {/* 1. Multibarrierenkonzept */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-md">
            <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /><MdText text={inhalt.texte.dasMultibarrierenkonzeptDie5} /></h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed"><MdText text={inhalt.texte.durchDasIneinandergreifenVon} /></p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                {
                  num: 1,
                  label: inhalt.werte.barriere1Geologie,
                  sub: inhalt.werte.standortUntergrund,
                  desc: inhalt.werte.derGeologischeUntergrundFungiert,
                  icon: ShieldCheck,
                },
                {
                  num: 2,
                  label: inhalt.werte.barriere2Abfallkörper,
                  sub: inhalt.werte.tocReaktivitätssperre,
                  desc: inhalt.werte.verbotDerAblagerungVon,
                  icon: Database,
                },
                {
                  num: 3,
                  label: inhalt.werte.barriere3Basisabdichtung,
                  sub: inhalt.werte.doppelteSperreDränung,
                  desc: inhalt.werte.kombinationsabdichtungAmDeponiebodenEine,
                  icon: Layers,
                },
                {
                  num: 4,
                  label: inhalt.werte.barriere4Oberflächenabdichtung,
                  sub: inhalt.werte.kapselungRekultivierung,
                  desc: inhalt.werte.nachVerfüllungErfolgtDer,
                  icon: Droplets,
                },
                {
                  num: 5,
                  label: inhalt.werte.barriere5Überwachung,
                  sub: inhalt.werte.monitoringNachsorge,
                  desc: inhalt.werte.kontrollierterMessstellenbetriebImAn,
                  icon: Scale,
                }
              ].map((bar) => {
                const isSelected = activeBarrier === bar.num;
                const IconComponent = bar.icon;
                return (
                  <button
                    key={bar.num}
                    onClick={() => setActiveBarrier(bar.num)}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                              isSelected
                                ? "bg-shiraz/5 border-shiraz text-slate-900 shadow-sm ring-1 ring-shiraz/50"
                                : "bg-slate-50 border-home-grau/30 text-slate-700 hover:bg-slate-100/50"
                            }`}
                  >
                    <div className="flex justify-between items-start w-full mb-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                                isSelected ? "bg-shiraz text-white" : "bg-slate-200 text-slate-600 border border-slate-300"
                              }`}>
                        {bar.num}
                      </span>
                      <IconComponent className={`w-4 h-4 ${isSelected ? "text-shiraz" : "text-slate-400"}`} />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs leading-snug">{bar.label}</h5>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">{bar.sub}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detaillierte Beschreibung der ausgewählten Barriere */}
            {(() => {
              const selectedBar = inhalt.daten.Deponie.find(b => b.num === activeBarrier);

              if (!selectedBar) return null;

              return (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-home-grau/20 text-xs animate-in fade-in duration-200">
                  <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-shiraz inline-block"></span>
                    {selectedBar.label}
                  </h5>
                  <p className="text-slate-650 leading-relaxed font-semibold mb-2">{selectedBar.desc}</p>
                  <div className="text-xs text-slate-550 font-mono">
                    <strong className="text-slate-600"><MdText text={inhalt.texte.gesetzlicheNorm} /></strong> {selectedBar.norm}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 2. Technischer Schichtenaufbau (Interaktiver Visualisierer) */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/25 pb-3 mb-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-shiraz" /><MdText text={inhalt.texte.geotechnischerSchichtenaufbauNachDepv} /></h4>
                <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.vergleichenSieDenNormativen} /></p>
              </div>

              <div className="flex p-0.5 bg-slate-100 rounded-lg border border-home-grau/30 self-start md:self-center">
                <button
                  onClick={() => { setDeponieSection('basis'); setSelectedLayerIndex(1); }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            deponieSection === 'basis' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                          }`}
                >
                  Basisabdichtung
                </button>
                <button
                  onClick={() => { setDeponieSection('oberflaeche'); setSelectedLayerIndex(0); }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            deponieSection === 'oberflaeche' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                          }`}
                >
                  Oberflächenabdichtung
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Visual Layer Stack Container */}
              <div className="md:col-span-5 flex flex-col space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-1">
                  {deponieSection === 'basis' ? inhalt.werte.innenAbfallkörper : inhalt.werte.aussenAtmosphäre}
                </div>

                {/* Hier loopen wir über die Layer rückwärts oder vorwärts um von dem echten Stapel zu rendern */}
                {(deponieSection === 'basis' ? inhalt.daten.Deponie_2 : [
                  {
                    index: 0,
                    name: inhalt.werte.rekultivierungsschichtMutterboden,
                    thickness: "≥ 1,0 m",
                    color: "bg-emerald-700/80 hover:bg-emerald-700/90 border-emerald-800 text-white",
                    previewText: inhalt.werte.mutterbodenBepflanzungFrostschutz
                  },
                  inhalt.daten["Deponie.1"],
                  {
                    index: 2,
                    name: inhalt.werte.dichtungskomponenteKdbTon,
                    thickness: "KDB ≥ 2,5mm",
                    color: "bg-slate-800 hover:bg-slate-700 border-slate-900 text-slate-200",
                    previewText: inhalt.werte.verbunddichtungPolymerBentonit
                  },
                  {
                    index: 3,
                    name: inhalt.werte.gasdränschichtGasschliff,
                    thickness: "≥ 30 cm",
                    color: "bg-stone-300 hover:bg-stone-350 border-stone-400 text-stone-800",
                    previewText: inhalt.werte.gasleitungEntgasungsSandschicht
                  },
                  {
                    index: 4,
                    name: inhalt.werte.ausgleichsschichtPlanum,
                    thickness: "≥ 20 cm",
                    color: "bg-stone-200 hover:bg-stone-250 border-stone-300 text-stone-600",
                    previewText: inhalt.werte.planierteProfilAusgleichsschicht
                  }
                ]).map((lay) => {
                  const isSelected = selectedLayerIndex === lay.index;
                  return (
                    <button
                      key={lay.index}
                      onClick={() => setSelectedLayerIndex(lay.index)}
                      className={`w-full py-3 px-4 rounded-xl border text-left text-xs font-bold leading-normal transition-all relative ${lay.color} ${
                                isSelected ? "ring-2 ring-shiraz ring-offset-2 scale-[1.01]" : ""
                              }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="truncate">{lay.previewText}</span>
                        <span className="text-xs bg-white/70 text-slate-900 px-1.5 py-0.5 rounded font-mono border border-black/10 flex-shrink-0">
                          {lay.thickness}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-shiraz rounded-r"></span>
                      )}
                    </button>
                  );
                })}

                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mt-1">
                  {deponieSection === 'basis' ? inhalt.werte.aussenGrundwasserpfad : inhalt.werte.innenAbfallkern}
                </div>
              </div>

              {/* Detailbeschreibung der selektierten Schicht */}
              <div className="md:col-span-7 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 h-full flex flex-col justify-between">
                {(() => {
                  const basisLayers: Record<number, { name: string; thickness: string; material: string; requirement: string; function: string }> = inhalt.daten["Deponie.basisLayers"];

                  const oberflaecheLayers: Record<number, { name: string; thickness: string; material: string; requirement: string; function: string }> = inhalt.daten["Deponie.oberflaecheLayers"];

                  const activeLayer = deponieSection === 'basis' ? basisLayers[selectedLayerIndex] : oberflaecheLayers[selectedLayerIndex];
                  if (!activeLayer) return null;

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-home-grau/25 pb-2">
                        <span className="text-xs font-bold text-shiraz uppercase tracking-wider">
                          {deponieSection === 'basis' ? `Basis-Schicht ${formatDeWert(selectedLayerIndex + 1)}` : `Oberflächen-Schicht ${formatDeWert(selectedLayerIndex + 1)}`}
                        </span>
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          Dicke: {activeLayer.thickness}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-extrabold text-slate-850 leading-tight">
                          {activeLayer.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          Regelstoff: <span className="text-slate-700">{activeLayer.material}</span>
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-xs">
                          <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.geotechnischeHauptfunktion} /></strong>
                          <span className="text-slate-600 leading-relaxed font-semibold">{activeLayer.function}</span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-xs">
                          <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.gesetzlicheMindestanforderungDepvAnhang} /></strong>
                          <span className="text-slate-550 font-mono leading-relaxed font-semibold">{activeLayer.requirement}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="mt-5 pt-3 border-t border-home-grau/20 flex items-center gap-1.5 text-xs text-slate-400">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span><MdText text={inhalt.texte.klickenSieAufEine} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
