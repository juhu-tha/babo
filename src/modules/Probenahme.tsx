import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { 
  FileSearch, SplitSquareHorizontal, LayoutGrid, Scale, AlertTriangle, 
  GitMerge, ArrowRight, Wrench, Layers, Target, Info, 
  Disc, Sliders, CheckCircle2, MapPin, Gauge 
} from 'lucide-react';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/probenahme/Probenahme.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

export default function Probenahme() {
  const [activeTab, setActiveTab] = useState<'haufwerk' | 'diagnostik'>('haufwerk');

  // Diagnostics Tab sub-navigation for principles explorer
  const [selectedDiagTopic, setSelectedDiagTopic] = useState<'vorbereitung' | 'bohrkerne' | 'chloride' | 'rueckprall'>('vorbereitung');

  // Interactive Bohrkerne states
  const [dMax, setDMax] = useState<number>(32); // Max aggregate size: 8, 16, 22, 32 mm
  const [coreD, setCoreD] = useState<number>(100); // Core diameter: 50, 75, 100, 150 mm
  const [coreH, setCoreH] = useState<number>(100); // Core height: 50, 75, 100, 150, 200 mm
  const [measuredFCore, setMeasuredFCore] = useState<number>(35); // Measured compression strength in MPa

  // Interactive Chloride states
  const [drillD, setDrillD] = useState<number>(12); // Drill diameter in mm: 10, 12, 16, 20
  const [layerD, setLayerD] = useState<number>(10); // Layer thickness in mm: 5, 10, 15, 20
  const [numHoles, setNumHoles] = useState<number>(3); // Unified holes to merge

  // Interactive Rebound hammer states
  const [rawR, setRawR] = useState<number>(38); // Raw rebound value
  const [carbX, setCarbX] = useState<number>(15); // Carbonation depth in mm
  const [impactAngle, setImpactAngle] = useState<number>(0); // Angle: -90 (downwards/deck), 0 (horizontal/wall), 90 (upwards/ceiling)

  // Interactive Vorbereitung states
  const [elemType, setElemType] = useState<'deck' | 'pier' | 'wall' | 'balcony'>('pier');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col gap-1 mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <FileSearch className="text-shiraz" /><MdText text={inhalt.texte.probenahmeErkundung} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.präziseMaterialentnahmeProbenteilungUnd} /></p>
        </div>
        </div>

        <ModuleTabs
          label={inhalt.werte.bereicheProbenahme}
          tabs={[
            { id: 'haufwerk' as const, label: inhalt.texte.haufwerkeSchüttgüter },
            { id: 'diagnostik' as const, label: inhalt.texte.bauwerksdiagnostikImBestand },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6"
        >

        {activeTab === 'haufwerk' ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.grundlagenDerBeprobung} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.umDieEigenschaftenEines} /></p>

              <h4 className="font-bold text-home-prim mt-6 mb-2"><MdText text={inhalt.texte.dieProbenHierarchie} /></h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-4 bg-off-white border border-home-grau/30 rounded-xl">
                  <div className="font-bold text-text-main mb-1 text-sm animate-in"><MdText text={inhalt.texte.t1EinzelprobeStichprobe} /></div>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.eineMengeAnMaterial} /></p>
        </div>
                <div className="p-4 bg-off-white border border-home-grau/30 rounded-xl relative">
                  <ArrowRight className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-home-grau/40" size={16} />
                  <div className="font-bold text-text-main mb-1 text-sm"><MdText text={inhalt.texte.t2Sammelprobe} /></div>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.entstehtDurchDasHomogene} /></p>
                </div>
                <div className="p-4 bg-off-white border border-home-grau/30 rounded-xl relative">
                  <ArrowRight className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-home-grau/40" size={16} />
                  <div className="font-bold text-text-main mb-1 text-sm"><MdText text={inhalt.texte.t3Laborprobe} /></div>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.eineDurchNormgerechteProbenteilung} /></p>
                </div>
                <div className="p-4 bg-off-white border border-home-grau/30 rounded-xl relative">
                  <ArrowRight className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-home-grau/40" size={16} />
                  <div className="font-bold text-text-main mb-1 text-sm"><MdText text={inhalt.texte.t4MessprobeOderPrüfprobe} /></div>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.dieKleineFraktionOft} /></p>
                </div>
              </div>
            </div>

            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <GitMerge className="text-shiraz" size={20} /><MdText text={inhalt.texte.derKorrekteProzessablaufZ} /></h3>
              <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.besondersBeiDerEntsorgung} /></p>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-start text-sm">
                  <div className="bg-shiraz/10 text-shiraz font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <div className="leading-relaxed"><MdText text={inhalt.texte.vorabbegehungRasterungDasHaufwerk} /></div>
                </div>
                <div className="flex gap-3 items-start text-sm">
                  <div className="bg-shiraz/10 text-shiraz font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <div className="leading-relaxed"><MdText text={inhalt.texte.stichprobenentnahmeEinzelprobenMitGeeign} /></div>
                </div>
                <div className="flex gap-3 items-start text-sm">
                  <div className="bg-shiraz/10 text-shiraz font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">3</div>
                  <div className="leading-relaxed"><MdText text={inhalt.texte.homogenisierungZurSammelprobeDie} /></div>
                </div>
                <div className="flex gap-3 items-start text-sm">
                  <div className="bg-shiraz/10 text-shiraz font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">4</div>
                  <div className="leading-relaxed"><MdText text={inhalt.texte.probenteilerLaborprobeErstellenDa} /></div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex gap-3 text-orange-900">
                <AlertTriangle className="shrink-0 text-orange-500" />
                <p className="text-sm leading-relaxed"><MdText text={inhalt.texte.vorsichtBeiLeichtflüchtigenSchadstoffen} /></p>
              </div>
            </div>

            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <SplitSquareHorizontal className="text-shiraz" size={20} /> Probenteilungsverfahren
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.dieEntnahmemengeSammelprobeMuss} /></p>

              <div className="grid md:grid-cols-2 gap-6 mt-4 pb-4">
                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-3">
                    <LayoutGrid size={18} /><MdText text={inhalt.texte.riffelkastenRiffelbombe} /></h4>
                  <p className="text-sm text-text-main/80 mb-3 leading-relaxed"><MdText text={inhalt.texte.einGerätMitAbwechselnd} /></p>
                  <ul className="list-disc pl-5 text-sm text-text-main/80 space-y-1">
                    <li><MdText text={inhalt.texte.halbiertDieProbeSchrittweise} /></li>
                    <li><MdText text={inhalt.texte.sehrGenauUndNormgerecht} /></li>
                    <li><MdText text={inhalt.texte.dieSchachtbreiteMussDeutlich} /></li>
                  </ul>
                </div>
                
                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-3">
                    <Scale size={18} /><MdText text={inhalt.texte.kegelnUndVierteln} /></h4>
                  <p className="text-sm text-text-main/80 mb-3 leading-relaxed"><MdText text={inhalt.texte.einManuellesVerfahrenDie} /></p>
                  <ul className="list-disc pl-5 text-sm text-text-main/80 space-y-1">
                    <li><MdText text={inhalt.texte.zweiDiagonalGegenüberliegendeViertel} /></li>
                    <li><MdText text={inhalt.texte.dieVerbleibendenZweiViertel} /></li>
                    <li><MdText text={inhalt.texte.gutFürLeichtFeuchte} /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.grundlagenDerBauwerksdiagnostik} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.imGegensatzZurLockeren} /></p>
        </div>

            {/* Section 1: Vorbereitung & Entnahmeorte */}
            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <MapPin className="text-shiraz" size={20} /><MdText text={inhalt.texte.t1EntnahmeorteVorbereitungDer} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.umRepräsentativeUndUnverschleierte} /></p>

              <div className="grid md:grid-cols-2 gap-6 mt-4 pb-4">
                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <Wrench size={18} /><MdText text={inhalt.texte.praxisregelnDerProbenstellung} /></h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="bg-shiraz/15 text-shiraz font-bold rounded-md w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">A</div>
                      <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.sondierungspflichtVorJedemEingriff} /></p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/15 text-shiraz font-bold rounded-md w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">B</div>
                      <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.trockeneOberflächenSäuberungFremdschicht} /></p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/15 text-shiraz font-bold rounded-md w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">C</div>
                      <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.systematischeSchadVsReferenzstellen} /></p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <MapPin size={18} /><MdText text={inhalt.texte.entnahmeTaktikNachBauteiltyp} /></h4>
                  <div className="space-y-3.5">
                    <label className="block text-xs font-bold text-slate-700"><MdText text={inhalt.texte.wählenSieIhrBauteil} /></label>
                    <div className="grid grid-cols-2 gap-2">
                      {inhalt.daten.Probenahme.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setElemType(b.id as typeof elemType)}
                          className={`p-2 rounded-lg border text-left transition-all ${
                            elemType === b.id 
                              ? 'bg-shiraz/10 border-shiraz font-bold' 
                              : 'bg-white border-home-grau/30 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xs font-bold block">{b.label}</span>
                          <span className="text-[9.5px] text-slate-500 block font-normal mt-0.5 leading-tight">{b.exp}</span>
                        </button>
                      ))}
                    </div>

                    {(() => {
                      let recommendPoints = '';
                      let locations = '';
                      let prepSteps = '';
                      if (elemType === 'pier') {
                        recommendPoints = inhalt.werte.orientierungswert46Probestellen;
                        locations = inhalt.werte.spritzwasserbereichCa01;
                        prepSteps = inhalt.werte.bewehrungsscanMitCovermeterZwingend;
                      } else if (elemType === 'deck') {
                        recommendPoints = inhalt.werte.orientierungswert68Probestellen;
                        locations = inhalt.werte.tiefpunkteImGefälleEntwässerungsrinnen;
                        prepSteps = inhalt.werte.entfernenDerOsDichtungsbeschichtung;
                      } else if (elemType === 'wall') {
                        recommendPoints = inhalt.werte.orientierungswert3StellenJe;
                        locations = inhalt.werte.horizontaldichtungsebeneErdberührendeSoc;
                        prepSteps = inhalt.werte.abklopfenHohlerPutzschichtenGetrennte;
                      } else {
                        recommendPoints = inhalt.werte.orientierungswert3Probestellen;
                        locations = inhalt.werte.balkonschnittkanteTropfnasenBereichFreib;
                        prepSteps = inhalt.werte.messungDerTatsächlichenBetondeckung;
                      }

                      return (
                        <div className="bg-white border border-home-grau/30 rounded-lg p-3 space-y-2.5 text-xs text-slate-700">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block"><MdText text={inhalt.texte.empfohleneProbenanzahlLehrRichtwert} /></span>
                            <strong className="text-slate-950 mt-0.5 block">{recommendPoints}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block"><MdText text={inhalt.texte.kritischeEntnahmeorte} /></span>
                            <span className="block mt-0.5 leading-relaxed text-slate-600">{locations}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Präparations-Arbeitsschritte:</span>
                            <span className="block mt-0.5 leading-relaxed text-slate-600">{prepSteps}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Bohrkerne */}
            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <Layers className="text-shiraz" size={20} /><MdText text={inhalt.texte.t2BohrkerneGeometrieGrößtkorn} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.bohrkerneWerdenMeistNass} /></p>

              <div className="grid md:grid-cols-2 gap-6 mt-4 pb-4">
                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <Disc size={18} /><MdText text={inhalt.texte.statischeGeometrischeAnforderungen} /></h4>
                  <div className="space-y-3.5">
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">1</div>
                      <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieDreifachRegelD} /></p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">2</div>
                      <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.schlankheitseinflussHDVerhältnis} /></p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">3</div>
                      <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.sofortigeHohlraumverfüllungDieVerbleiben} /></p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <Sliders size={18} /><MdText text={inhalt.texte.kernGeometrieAggregatprüfer} /></h4>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1"><MdText text={inhalt.texte.maximalesGesteinskornDMax} /></label>
                      <select aria-label={inhalt.werte.maximalesGesteinskornDMax} 
                        className="w-full bg-white border border-home-grau/30 rounded p-1.5 font-mono text-slate-800 text-xs"
                        value={dMax} 
                        onChange={(e) => setDMax(Number(e.target.value))}
                      >
                        <option value="8">8 mm (z.B. Estrich / Feinkorn)</option>
                        <option value="16">16 mm (Standard-Beton)</option>
                        <option value="22">22 mm (Konstruktionsbeton, grobe Sieblinie)</option>
                        <option value="32">32 mm (Grobkorn, z. B. Massenbeton)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1"><MdText text={inhalt.texte.geplanterBohrkernDurchmesserD} /></label>
                      <select aria-label={inhalt.werte.geplanterBohrkernDurchmesserD} 
                        className="w-full bg-white border border-home-grau/30 rounded p-1.5 font-mono text-slate-800 text-xs"
                        value={coreD} 
                        onChange={(e) => setCoreD(Number(e.target.value))}
                      >
                        <option value="50">50 mm (Dünner Kern)</option>
                        <option value="75">75 mm (Mittlerer Kern)</option>
                        <option value="100">100 mm (Standardkern)</option>
                        <option value="150">150 mm (Großer Kern)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1"><MdText text={inhalt.texte.gewonnenePrüfHöheH} /></label>
                      <select aria-label={inhalt.werte.gewonnenePrüfHöheH} 
                        className="w-full bg-white border border-home-grau/30 rounded p-1.5 font-mono text-slate-800 text-xs"
                        value={coreH} 
                        onChange={(e) => setCoreH(Number(e.target.value))}
                      >
                        <option value="50">50 mm</option>
                        <option value="75">75 mm</option>
                        <option value="100">100 mm</option>
                        <option value="150">150 mm</option>
                        <option value="200">200 mm</option>
                      </select>
                    </div>

                    {(() => {
                      const tripleRequired = 3 * dMax;
                      const passesAgg = coreD >= tripleRequired;
                      const lambda = coreH / coreD;
                      // Umrechnung auf h/d = 2 (Literaturansatz ASTM C42/C42M, Tabelle der Korrekturfaktoren;
                      // DIN EN 13791 regelt nur h/d = 1 (→ Würfel) und h/d = 2 (→ Zylinder)).
                      const astmStuetz: [number, number][] = [[1.0, 0.87], [1.25, 0.93], [1.5, 0.96], [1.75, 0.98], [2.0, 1.0]];
                      let correctionFactor = NaN;
                      if (lambda >= 1.0 && lambda <= 2.0) {
                        for (let i = 0; i < astmStuetz.length - 1; i++) {
                          const [l0, k0] = astmStuetz[i];
                          const [l1, k1] = astmStuetz[i + 1];
                          if (lambda >= l0 && lambda <= l1) {
                            correctionFactor = k0 + (k1 - k0) * (lambda - l0) / (l1 - l0);
                            break;
                          }
                        }
                      }

                      return (
                        <div className="bg-white p-3 rounded-lg border border-home-grau/30 space-y-2.5 mt-2 leading-relaxed text-[11px] text-slate-700">
                          <div className="flex justify-between items-center pb-1 border-b border-home-grau/30">
                            <span className="font-bold">Größtkorn-Prüfung:</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${passesAgg ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                              {passesAgg ? '✔ Valide' : inhalt.werte.nichtRepräsentativ}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[10px] leading-tight">
                            Für D_max = {formatDeWert(dMax)}<MdText text={inhalt.texte.mmMussDerBohrdurchmesser} />{formatDeWert(tripleRequired)}<MdText text={inhalt.texte.mmBetragenIhrKern} />{formatDeWert(coreD)} mm.
                          </p>
                          <div className="pt-1.5 border-t border-home-grau/30 grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[9px] text-slate-400 block font-bold leading-none"><MdText text={inhalt.texte.schlankheitHD} /></span>
                              <strong className="font-mono text-xs block mt-1">{formatDeZahl(lambda, 2)}</strong>
                              <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">
                                ({lambda === 1.0 ? inhalt.werte.entsprichtWürfelDinEn : lambda === 2.0 ? inhalt.werte.entsprichtZylinderDinEn : lambda < 1.0 ? inhalt.werte.zuKurzNichtPrüfbar : lambda > 2.0 ? inhalt.werte.zuLangAufH : inhalt.werte.zwischenwertUmrechnungNötig})
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block font-bold leading-none">Umrechnungsfaktor:</span>
                              <strong className="font-mono text-xs text-indigo-700 block mt-1">{formatDeZahl(correctionFactor, 3)}</strong>
                              <span className="text-[9px] text-slate-500 block leading-tight mt-0.5"><MdText text={inhalt.texte.aufHD2} /></span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Chloride */}
            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <Target className="text-shiraz" size={20} /><MdText text={inhalt.texte.t3ChloridbeprobungStatistischeAbsicherung} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.derEintrittVonChloridhaltigem} /></p>

              <div className="grid md:grid-cols-2 gap-6 mt-4 pb-4">
                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <CheckCircle2 size={18} /><MdText text={inhalt.texte.laborpräparierteQualitätssicherung} /></h4>
                  <div className="space-y-3.5">
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">✔</div>
                      <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.fülleDerProbestellenMin} /></p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">✔</div>
                      <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.verschleppungsverbotStufenbohrungWirdEin} /></p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">✔</div>
                      <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.ausreichendeProbenmengeRichtwert5} /></p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <Sliders size={18} /> Gewichtsertrags-Kalkulator
                  </h4>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span><MdText text={inhalt.texte.bohrdurchmesserDB} /></span>
                        <span className="text-shiraz font-mono font-bold">{formatDeWert(drillD)} mm</span>
                      </div>
                      <input
                        type="range" min="10" max="25" step="1"
                        value={drillD} onChange={(e) => setDrillD(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span><MdText text={inhalt.texte.schichtIntervallDz} /></span>
                        <span className="text-shiraz font-mono font-bold">{formatDeWert(layerD)} mm</span>
                      </div>
                      <input
                        type="range" min="5" max="20" step="5"
                        value={layerD} onChange={(e) => setLayerD(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span><MdText text={inhalt.texte.vereinigteBohrungenN} /></span>
                        <span className="text-shiraz font-mono font-bold">{formatDeWert(numHoles)} Löcher</span>
                      </div>
                      <input
                        type="range" min="1" max="5" step="1"
                        value={numHoles} onChange={(e) => setNumHoles(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    {(() => {
                      const radiusCm = drillD / 2 / 10;
                      const heightCm = layerD / 10;
                      const volumeOnem3 = Math.PI * Math.pow(radiusCm, 2) * heightCm;
                      const densityGcm3 = 2.2;
                      const weightPerHole = volumeOnem3 * densityGcm3;
                      const totalWeight = weightPerHole * numHoles;
                      const isValidWeight = totalWeight >= 5.0;

                      return (
                        <div className="p-3 bg-white border border-home-grau/30 rounded-lg space-y-2 mt-2 leading-normal text-[11px] text-slate-700">
                          <div className="flex justify-between items-center pb-1 border-b border-home-grau/30">
                            <span className="font-bold"><MdText text={inhalt.texte.ausbeuteBohrmehl} /></span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isValidWeight ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {isValidWeight ? inhalt.werte.mengeAusreichend : inhalt.werte.zuGering5G}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[9px] text-slate-400 block font-bold leading-none"><MdText text={inhalt.texte.mengeProLoch} /></span>
                              <strong className="font-mono text-xs block mt-1">{formatDeZahl(weightPerHole, 2)} g</strong>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block font-bold leading-none">Gesamtgewicht:</span>
                              <strong className={`font-mono text-xs block mt-1 ${isValidWeight ? 'text-emerald-700' : 'text-red-650 font-bold'}`}>{formatDeZahl(totalWeight, 2)} g</strong>
                            </div>
                          </div>
                          {!isValidWeight && (
                            <p className="text-[9.5px] text-red-500 font-medium leading-tight pt-1"><MdText text={inhalt.texte.dieGewonneneMengeLiegt} /></p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Rückprallhammer */}
            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <Gauge className="text-shiraz" size={20} /><MdText text={inhalt.texte.t4RückprallhammerUntergrundpräparationKor} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.derRückprallhammerSchmidtHammer} /></p>

              <div className="grid md:grid-cols-2 gap-6 mt-4 pb-4">
                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <AlertTriangle size={18} className="text-shiraz" /><MdText text={inhalt.texte.fehlerquellenStoßwinkelkorrektur} /></h4>
                  <div className="space-y-3.5">
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">▲</div>
                      <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.derKarbonatisierungsfehlerKarbonatisieru} /></p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">▲</div>
                      <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.winkelkorrekturGravitationsEinflussDie} /></p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">▲</div>
                      <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.messfeldAuswertungNachDin} /></p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <Sliders size={18} /><MdText text={inhalt.texte.karbonatisierungsWinkeljustierung} /></h4>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span><MdText text={inhalt.texte.rohwertRückprallMedianR} /></span>
                        <span className="text-shiraz font-mono font-bold">{formatDeWert(rawR)} Skt.</span>
                      </div>
                      <input
                        type="range" min="20" max="55" step="1"
                        value={rawR} onChange={(e) => setRawR(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span><MdText text={inhalt.texte.karbonatisierungsTiefeXCo} /></span>
                        <span className="text-shiraz font-mono font-bold">{formatDeWert(carbX)} mm</span>
                      </div>
                      <input
                        type="range" min="0" max="40" step="1"
                        value={carbX} onChange={(e) => setCarbX(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5"><MdText text={inhalt.texte.schlagrichtungEinbauwinkel} /></label>
                      <AuswahlGruppe label="Schlagrichtung" className="grid grid-cols-3 gap-1.5">
                        {[
                          { value: -90, label: inhalt.werte.boden90 },
                          { value: 0, label: 'Wand (0°)' },
                          { value: 90, label: inhalt.werte.decke90 }
                        ].map((a) => (
                          <button {...alsOption(impactAngle === a.value)}
                            key={a.value}
                            type="button"
                            onClick={() => setImpactAngle(a.value)}
                            className={`p-1.5 text-[10px] font-bold rounded border text-center transition-all ${
                              impactAngle === a.value 
                                ? 'bg-shiraz text-white border-shiraz font-bold' 
                                : 'bg-white border-home-grau/30 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </AuswahlGruppe>
                    </div>

                    {(() => {
                      // Winkelkorrektur: typische Herstellerwerte für Schmidt-Hammer Typ N (gerätespezifisch!),
                      // linear interpoliert zwischen R = 20 und R = 60.
                      // Nach unten (−90°): Rückprall gegen die Schwerkraft → R zu niedrig → Korrektur positiv.
                      // Nach oben (+90°): Rückprall mit der Schwerkraft → R zu hoch → Korrektur negativ.
                      const rKlemm = Math.min(60, Math.max(20, rawR));
                      const interpol = (a20: number, a60: number) => a20 + (a60 - a20) * (rKlemm - 20) / 40;
                      let angleCorr = 0;
                      if (impactAngle === -90) angleCorr = interpol(3.4, 1.7);
                      else if (impactAngle === 90) angleCorr = interpol(-5.4, -2.3);

                      // Karbonatisierung: Lehrmodell (−0,15 Skt. je mm, max. −6 Skt.). Kein Normansatz –
                      // in der Praxis wird der Einfluss über Vergleichsbohrkerne (DIN EN 13791) kalibriert.
                      let carbCorr = carbX > 0 ? -0.15 * carbX : 0;
                      if (carbCorr < -6.0) carbCorr = -6.0;

                      const finalR = rawR + angleCorr + carbCorr;
                      // Festigkeitsschätzung: lineare Lehr-Näherung f ≈ 1,4·R − 20 (nicht normativ).
                      const rawEstStr = Math.max(10, (rawR * 1.4) - 20);
                      const finalEstStr = Math.max(10, (finalR * 1.4) - 20);

                      return (
                        <div className="p-3 bg-white border border-home-grau/30 rounded-lg space-y-2 mt-2 leading-relaxed text-[11px] text-slate-700">
                          <div className="flex justify-between items-center pb-1 border-b border-home-grau/30 text-shiraz font-bold">
                            <span>Ergebnis-Klassifizierung:</span>
                            <span className="font-mono text-slate-900 font-bold text-xs">
                              R korr. = {formatDeZahl(finalR, 1)}
                            </span>
                          </div>
                          <div className="space-y-1 text-slate-600 text-[10px]">
                            <div className="flex justify-between">
                              <span><MdText text={inhalt.texte.korrekturKarbonatisierungLehrmodell} /></span>
                              <strong className="font-semibold text-rose-800">{formatDeZahl(carbCorr, 1)} Skt.</strong>
                            </div>
                            <div className="flex justify-between">
                              <span><MdText text={inhalt.texte.korrekturWinkelHerstellerrichtwert} /></span>
                              <strong className="font-semibold text-indigo-800">{angleCorr > 0 ? `+${formatDeZahl(angleCorr, 1)}` : formatDeZahl(angleCorr, 1)} Skt.</strong>
                            </div>
                            <div className="flex justify-between border-t border-home-grau/30 pt-1 text-[11px] text-slate-850">
                              <span className="font-bold"><MdText text={inhalt.texte.schätzungAusRohwertLehr} /></span>
                              <span className="font-mono text-red-650 font-bold">~{formatDeZahl(rawEstStr, 0)} MPa</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-850">
                              <span className="font-bold"><MdText text={inhalt.texte.schätzungAusKorrigiertemR} /></span>
                              <span className="font-mono text-emerald-700 font-bold">~{formatDeZahl(finalEstStr, 0)} MPa</span>
                            </div>
                          </div>
                          <p className="text-[9.5px] text-slate-500 leading-tight pt-1"><MdText text={inhalt.texte.lehrmodellWinkelkorrekturNachTypischen} /></p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-orange-50/60 border border-orange-200 rounded-xl flex gap-3 text-orange-950">
              <Info className="shrink-0 text-orange-500 mt-0.5" />
              <p className="text-sm leading-relaxed"><MdText text={inhalt.texte.merksatzDerDiagnostikAuswertungsmethoden} /></p>
            </div>
          </div>
        )}
        </ModuleTabs>

      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <div className="flex flex-col gap-6">
        <FormulaDerivationBox
          title={inhalt.werte.beispiel1ReichtDas}
          zielGleichung="m = n \cdot \pi \cdot \left(\frac{D_b}{2}\right)^2 \cdot \Delta z \cdot \rho"
          schritte={inhalt.daten["Probenahme.schritte"]}
          ergebnisHinweis={inhalt.werte.jedeTiefenstufeBrauchtZwei}
          normQuelle={inhalt.werte.dinEn146292007}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel2BohrkernMit}
          zielGleichung="f_{c,\,h/d=2} = k(\lambda) \cdot f_{core},\quad \lambda = h/d"
          schritte={inhalt.daten["Probenahme.schritte_2"]}
          ergebnisHinweis={inhalt.werte.einEinzelkernIstKein}
          normQuelle={inhalt.werte.dinEn125041}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel3RückprallwertAn}
          zielGleichung="R_{korr} = R_{Median} + \Delta R_{\alpha}"
          schritte={inhalt.daten["Probenahme.schritte_3"]}
          ergebnisHinweis={inhalt.werte.dieKorrekturwerteSindGerätespezifisch}
          normQuelle={inhalt.werte.dinEn125042}
        />
      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="probenahme" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Probenahme', url: 'https://de.wikipedia.org/wiki/Probenahme' },
          { title: 'Bauwerksdiagnostik', url: 'https://de.wikipedia.org/wiki/Bauwerksdiagnostik' },
          { title: 'Rückprallhammer', url: 'https://de.wikipedia.org/wiki/R%C3%BCckprallhammer' }
        ]}
        literatur={inhalt.daten["Probenahme.literatur"]}
        regelwerke={inhalt.daten["Probenahme.regelwerke"]}
        formeln={inhalt.daten["Probenahme.formeln"]}
        lastReviewed={inhalt.werte.oktober2026Ap4}
      />
    </div>
  );
}
