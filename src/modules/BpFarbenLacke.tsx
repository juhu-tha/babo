import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Paintbrush, Calculator, ShieldCheck, Info, Check, AlertTriangle, FlaskConical, Atom, Layers } from 'lucide-react';
import { InnovationPraxisSection } from '@/src/components/ui/InnovationPraxisSection';
import { BINDERS, OS_SYSTEMS, REACTION_MECHANISMS } from './bpfarbenlacke/daten';
import { RechnerTab } from './bpfarbenlacke/RechnerTab';
import { FilmchemieTab } from './bpfarbenlacke/FilmchemieTab';
import inhalt from '@/content/bpfarbenlacke/BpFarbenLacke.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

export default function BpFarbenLacke() {
  const [activeTab, setActiveTab] = useState<'allgemein' | 'komponenten' | 'filmchemie' | 'bindemittel' | 'rechner' | 'voc' | 'oberflaechenschutz'>('allgemein');
  const [selectedMech, setSelectedMech] = useState<string>('oxidative');

  // OS-System selector state
  const [osArea, setOsArea] = useState<number>(300); // m²
  const [osEinsatzbereich, setOsEinsatzbereich] = useState<string>('tiefgarage_boden');
  const [osCrackBridging, setOsCrackBridging] = useState<string>('nein');
  const [osBelastung, setOsBelastung] = useState<string>('leicht_pkw');
  const [selectedOsId, setSelectedOsId] = useState<string>('os8');

  // Input states for calculation
  const [targetDft, setTargetDft] = useState<number>(40); // µm (Desired dry thickness)
  const [solidsVol, setSolidsVol] = useState<number>(45); // % (Volume Solids)
  const [thinning, setThinning] = useState<number>(5); // % (Add dilution)
  const [lossFactor, setLossFactor] = useState<number>(20); // % (Overspray, roller loss, etc.)
  const [areaSquareMeters, setAreaSquareMeters] = useState<number>(120); // m²
  const [numCoats, setNumCoats] = useState<number>(2); // Number of coats

  // Calculations
  // 1. Wet Film Thickness without dilution: WFT = (DFT * 100) / Solids_Vol
  const baseWft = useMemo(() => {
    if (solidsVol <= 0) return 0;
    return (targetDft * 100) / solidsVol;
  }, [targetDft, solidsVol]);

  // 2. Wet Film Thickness including thinning: WFT_thinned = WFT * (1 + thin/100)
  const thinnedWft = useMemo(() => {
    return baseWft * (1 + thinning / 100);
  }, [baseWft, thinning]);

  // 3. Spreading Rate (theoretisch) in m²/Liter: 10 * VolumeSolids[%] / DFT[µm]
  const theoreticalSpreadingRate = useMemo(() => {
    if (targetDft <= 0) return 0;
    return (10 * solidsVol) / targetDft;
  }, [solidsVol, targetDft]);

  // 4. Consumption rate:
  // Theoretical Consumption (ml/m² per coat) = WFT (without dilution, because dilution evaporates)
  // Effective Consumption with loss factor = Theoretical Consumption / (1 - loss/100)
  const theoreticalConsumption = useMemo(() => {
    return baseWft; // µm is equal to ml/m² for liquids without loss and before thinning evaporation
  }, [baseWft]);

  const effectiveConsumption = useMemo(() => {
    if (lossFactor >= 100) return 0;
    return theoreticalConsumption / (1 - lossFactor / 100);
  }, [theoreticalConsumption, lossFactor]);

  // Total required quantity in liters = (effectiveConsumption * area * coats) / 1000
  const totalLitersRequired = useMemo(() => {
    return (effectiveConsumption * areaSquareMeters * numCoats) / 1000;
  }, [effectiveConsumption, areaSquareMeters, numCoats]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-6">
          <Paintbrush className="text-shiraz" size={28} />
          <h2 id="modul-titel" className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.farbenLackeImBauwesen} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.umfassendesKompendiumÜberBeschichtungssy} /></p>
        </div>
        </div>

        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'allgemein' as const, label: inhalt.texte.allgemeineÜbersicht },
            { id: 'komponenten' as const, label: inhalt.texte.die4Hauptbestandteile },
            { id: 'filmchemie' as const, label: inhalt.texte.chemieFilmbildung, icon: FlaskConical },
            { id: 'bindemittel' as const, label: 'Bindemittel-Matrix' },
            { id: 'rechner' as const, label: inhalt.texte.schichtdickenMengenschätzer, icon: Calculator },
            { id: 'voc' as const, label: inhalt.texte.schadstoffeVocGrenzwerte },
            { id: 'oberflaechenschutz' as const, label: inhalt.texte.oberflächenschutzsystemeOs, icon: ShieldCheck },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6"
        >
        {/* TAB CONTENST */}
        <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-300">
          
          {/* TAB 1: ALLGEMEIN */}
          {activeTab === 'allgemein' && (
            <div className="space-y-6">
              <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
                <h3 className="font-bold text-shiraz text-base mb-2"><MdText text={inhalt.texte.bedeutungVonBeschichtungenIm} /></h3>
                <p className="mb-3"><MdText text={inhalt.texte.farbenLackeUndLasuren} /></p>
                <p><MdText text={inhalt.texte.einOptimalGewähltesBeschichtungssystem} /></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold mb-3">1</div>
                  <h4 className="font-bold text-text-main text-sm">Schutzfunktion</h4>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.verhinderungVonFeuchtigkeitseintrittRege} /></p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/10 text-orange-600 flex items-center justify-center font-bold mb-3">2</div>
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.hygieneRaumklima} /></h4>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.einstellungDerRaumfeuchteDurch} /></p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold mb-3">3</div>
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.ästhetikLichtausbeute} /></h4>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.glanzgradUndHelligkeitskoeffizientenBeei} /></p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-950 flex gap-3">
                <Info size={20} className="text-amber-700 mt-0.5 flex-none" />
                <div>
                  <strong className="font-bold"><MdText text={inhalt.texte.praktischerBauTipp} /></strong><MdText text={inhalt.texte.untergründeMüssenVorDer} /></div>
              </div>
            </div>
          )}

          {/* TAB 2: KOMPONENTEN */}
          {activeTab === 'komponenten' && (
            <div className="space-y-6">
              <h3 className="font-bold text-text-main text-xl"><MdText text={inhalt.texte.worausBestehtEinBeschichtungsstoff} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.nahezuAlleFarbenUnd} /></p>
        </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-stone-50 rounded-xl border border-home-grau/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-shiraz text-white font-mono font-black text-xs flex items-center justify-center">1</span>
                    <h4 className="font-bold text-text-main text-sm sm:text-base"><MdText text={inhalt.texte.dasBindemittelDieBasis} /></h4>
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.diePrimäreTrägerkomponenteDes} /></p>
                  <p className="text-xs text-text-main/70 bg-white p-2.5 rounded border border-home-grau/10"><MdText text={inhalt.texte.beispieleAcrylharzeAlkydharzeEpoxidharze} /></p>
                </div>

                <div className="p-5 bg-stone-50 rounded-xl border border-home-grau/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-shiraz text-white font-mono font-black text-xs flex items-center justify-center">2</span>
                    <h4 className="font-bold text-text-main text-sm sm:text-base"><MdText text={inhalt.texte.lösemittelWasserTrägermaterial} /></h4>
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.ermöglichtDasFlüssigeAufbringen} /></p>
                  <p className="text-xs text-text-main/70 bg-white p-2.5 rounded border border-home-grau/10"><MdText text={inhalt.texte.beispieleWasserBeiDispersions} /></p>
                </div>

                <div className="p-5 bg-stone-50 rounded-xl border border-home-grau/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-shiraz text-white font-mono font-black text-xs flex items-center justify-center">3</span>
                    <h4 className="font-bold text-text-main text-sm sm:text-base"><MdText text={inhalt.texte.pigmenteFüllstoffeFarbaufbau} /></h4>
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.pigmenteLiefernDenFarbton} /></p>
                  <p className="text-xs text-text-main/70 bg-white p-2.5 rounded border border-home-grau/10"><MdText text={inhalt.texte.beispieleTitandioxidWeißpigmentEisenoxid} /></p>
                </div>

                <div className="p-5 bg-stone-50 rounded-xl border border-home-grau/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-shiraz text-white font-mono font-black text-xs flex items-center justify-center">4</span>
                    <h4 className="font-bold text-text-main text-sm sm:text-base"><MdText text={inhalt.texte.additiveSpezialhelfer} /></h4>
                  </div>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.inKleinstmengen01} /></p>
                  <p className="text-xs text-text-main/70 bg-white p-2.5 rounded border border-home-grau/10"><MdText text={inhalt.texte.beispieleEntschäumerVerlaufshilfsmittelT} /></p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHEMIE & FILMBILDUNG */}
          {activeTab === 'filmchemie' && (
            <FilmchemieTab setSelectedMech={setSelectedMech} selectedMech={selectedMech} />
          )}

          {/* TAB 3: BINDEMITTELMATRIX */}
          {activeTab === 'bindemittel' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.dieBindemittelBibliothek} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.vergleichendeAnalyseAllerBaurelevanten} /></p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BINDERS.map((binder, idx) => (
                  <div key={idx} className="bg-white border border-home-grau/25 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-shiraz/40 transition-colors">
                    <div className="space-y-3">
                      <div className="border-b border-home-grau/10 pb-2">
                        <span className="text-xs uppercase tracking-wider font-bold text-shiraz">{binder.category}</span>
                        <h4 className="font-black text-text-main text-base mt-0.5 leading-tight">{binder.name}</h4>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-text-main/40 font-bold block">Vorteile:</span>
                        <ul className="text-sm text-text-main/80 space-y-0.5 pl-2">
                          {binder.advantages.map((adv, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-1">
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                              <span>{adv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-text-main/40 font-bold block">Einschränkungen:</span>
                        <ul className="text-sm text-text-main/80 space-y-0.5 pl-2">
                          {binder.disadvantages.map((dis, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-1">
                              <span className="text-red-600 font-bold shrink-0">✕</span>
                              <span>{dis}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-home-grau/10 mt-4 space-y-2">
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] leading-tight">
                        <div className="bg-stone-50 p-2 rounded text-center border border-home-grau/10">
                          <span className="text-text-main/40 block font-semibold uppercase text-[8px]">Diffusionsfähigkeit</span>
                          <span className="font-bold text-text-main mt-0.5 block">{binder.sdValue}</span>
                        </div>
                        <div className="bg-stone-50 p-2 rounded text-center border border-home-grau/10">
                          <span className="text-text-main/40 block font-semibold uppercase text-[8px]"><MdText text={inhalt.texte.giscodePufCode} /></span>
                          <span className="font-bold text-indigo-700 mt-0.5 block">{binder.pufCode || 'N/A'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-text-main/70 leading-normal italic mt-1">
                        <strong>Einsatz:</strong> {binder.typicalUse}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CALCULATOR */}
          {activeTab === 'rechner' && (
            <RechnerTab targetDft={targetDft} setTargetDft={setTargetDft} solidsVol={solidsVol} setSolidsVol={setSolidsVol} thinning={thinning} setThinning={setThinning} lossFactor={lossFactor} setLossFactor={setLossFactor} areaSquareMeters={areaSquareMeters} setAreaSquareMeters={setAreaSquareMeters} numCoats={numCoats} setNumCoats={setNumCoats} baseWft={baseWft} thinnedWft={thinnedWft} theoreticalConsumption={theoreticalConsumption} effectiveConsumption={effectiveConsumption} totalLitersRequired={totalLitersRequired} />
          )}

          {/* TAB 5: VOC & SCHADSTOFFE */}
          {activeTab === 'voc' && (
            <div className="space-y-6">
              <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-4">
                <h3 className="font-bold text-shiraz text-base flex items-center gap-2">
                  <ShieldCheck size={20} /><MdText text={inhalt.texte.dieDecopaintRichtlinie2004} /></h3>
                <p className="leading-relaxed"><MdText text={inhalt.texte.vocVolatileOrganicCompounds} /></p>
                <p className="leading-relaxed"><MdText text={inhalt.texte.dieEuropäischeDecopaintRichtlinie} /></p>
              </div>

              {/* Table representing DEC0PAINT LIMITS */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-text-main/40 uppercase tracking-wider block"><MdText text={inhalt.texte.grenzwerteFürAusgewählteProduktkategorie} /></span>
                <div className="overflow-hidden border border-home-grau/30 rounded-xl text-xs bg-white">
                  <div className="grid grid-cols-12 gap-1 p-3 bg-stone-100 font-bold border-b border-home-grau/30 text-text-main text-[11px]">
                    <div className="col-span-1 text-center">Cat</div>
                    <div className="col-span-5">Kategorie-Beschreibung</div>
                    <div className="col-span-3 text-center bg-blue-50/50"><MdText text={inhalt.texte.wässrigWbGL} /></div>
                    <div className="col-span-3 text-center bg-amber-50/50"><MdText text={inhalt.texte.lösemittelbasiertSbGL} /></div>
                  </div>
                  {inhalt.daten.BpFarbenLacke.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-1 p-3 border-b border-home-grau/10 last:border-0 items-center text-[11px]">
                      <div className="col-span-1 text-center font-bold text-shiraz">{row.cat}</div>
                      <div className="col-span-5 font-semibold text-text-main">{row.name}</div>
                      <div className="col-span-3 text-center font-mono font-bold text-sky-800 bg-sky-50/20 py-1 rounded">{row.wb}</div>
                      <div className="col-span-3 text-center font-mono font-bold text-amber-800 bg-amber-50/20 py-1 rounded">{row.sb}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eco Labels card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-home-grau/30 rounded-xl p-5">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-emerald-600 rounded-full text-white text-[10px] font-black flex items-center justify-center">E</span>
                    <h4 className="font-bold text-text-main"><MdText text={inhalt.texte.umweltzeichenBlauerEngelDe} /></h4>
                  </div>
                  <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.dieKriterienDesBlauen} /></p>
                  <ul className="list-disc list-inside space-y-1 font-normal text-text-main/80 pl-2">
                    <li><MdText text={inhalt.texte.maxVocGehalt1} /></li>
                    <li><MdText text={inhalt.texte.begrenzungVonWeichmachernUnd} /></li>
                    <li><MdText text={inhalt.texte.strengeGrenzwerteFürIsothiazolinone} /></li>
                  </ul>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-indigo-600 rounded-full text-white text-[10px] font-black flex items-center justify-center">G</span>
                    <h4 className="font-bold text-text-main"><MdText text={inhalt.texte.giscodeKlassifizierungssystemDerBg} /></h4>
                  </div>
                  <p className="text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.derGiscodeDientHandwerkern} /></p>
                  <ul className="list-disc list-inside space-y-1 font-normal text-text-main/80 pl-2">
                    <li><MdText text={inhalt.texte.bsw10Bsw20WässrigeBeschichtungsstoffe} /></li>
                    <li><MdText text={inhalt.texte.bsl25LösemittelbasierteBautenschutzlacke} /></li>
                    <li><MdText text={inhalt.texte.re30EpoxidharzprodukteSensibilisierendZw} /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: OBERFLAECHENSCHUTZ */}
          {activeTab === 'oberflaechenschutz' && (
            <div className="space-y-8">
              <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed">
                <h3 className="font-bold text-shiraz text-base mb-2"><MdText text={inhalt.texte.oberflächenschutzsystemeOsFürBeton} /></h3>
                <p className="mb-3"><MdText text={inhalt.texte.betonbauwerkeInsbesondereParkhäuserTiefg} /></p>
                <p><MdText text={inhalt.texte.oberflächenschutzsystemeOsNachDin} /></p>
              </div>

              {/* SECTION: OS SYSTEMS COMPARISON */}
              <div className="space-y-4">
                <h3 className="font-bold text-text-main text-lg flex items-center gap-2 border-b border-home-grau/20 pb-2">
                  <Layers size={18} className="text-shiraz" /><MdText text={inhalt.texte.systemKlassifizierungOs1} /></h3>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.wählenSieEinSystem} /></p>
                
                <AuswahlGruppe label="Oberflächenschutzsystem" className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {OS_SYSTEMS.map((sys) => (
                    <button {...alsOption(selectedOsId === sys.id)}
                      key={sys.id}
                      onClick={() => setSelectedOsId(sys.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between gap-1.5 cursor-pointer ${
                        selectedOsId === sys.id
                          ? 'bg-shiraz border-shiraz text-white shadow-md font-bold'
                          : 'bg-white border-home-grau/30 text-text-main hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{sys.name}</div>
                      <div className={`text-[10px] font-medium leading-tight ${selectedOsId === sys.id ? 'text-white/85' : 'text-text-main/60'}`}>
                        {sys.title}
                      </div>
                    </button>
                  ))}
                </AuswahlGruppe>

                {/* Selected OS Details Card */}
                {(() => {
                  const currentOs = OS_SYSTEMS.find(s => s.id === selectedOsId) || OS_SYSTEMS[5];
                  return (
                    <div className="bg-stone-50 border border-home-grau/30 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-shiraz/10 text-shiraz font-bold text-xs"><MdText text={inhalt.texte.aktuellesSystem} />{currentOs.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentOs.trafficable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {currentOs.trafficable ? 'Befahrbar' : inhalt.werte.nichtBefahrbar}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-text-main mt-2 border-b border-home-grau/20 pb-1">{currentOs.title}</h4>
                        </div>
                        <p className="text-xs text-text-main/80 leading-relaxed">{currentOs.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                            <span className="font-bold text-text-main block mb-1"><MdText text={inhalt.texte.typischeSchichtdicke} /></span>
                            <span className="font-mono text-xs text-text-main/70">{currentOs.thickness}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                            <span className="font-bold text-text-main block mb-1">Rissüberbrückungsklasse:</span>
                            <span className="text-xs text-text-main/70">{currentOs.bridging}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                            <span className="font-bold text-text-main block mb-1"><MdText text={inhalt.texte.verwendetesBindemittel} /></span>
                            <span className="text-xs text-text-main/70">{currentOs.mainBinders}</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-home-grau/15">
                            <span className="font-bold text-text-main block mb-1"><MdText text={inhalt.texte.mittlererMaterialbedarf} /></span>
                            <span className="font-mono text-xs text-text-main/70">{currentOs.consumption}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-3 shadow-xs">
                        <h5 className="font-bold text-xs text-text-main uppercase tracking-wider border-b border-home-grau/20 pb-1.5"><MdText text={inhalt.texte.schichtaufbauApplikation} /></h5>
                        <div className="relative border-l-2 border-shiraz/30 pl-4 ml-2 py-1 space-y-3 flex-1 flex flex-col justify-center">
                          {currentOs.layers.map((layer, index) => (
                            <div key={index} className="relative text-xs">
                              <span className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-shiraz border-2 border-white"></span>
                              <span className="font-mono text-[9px] text-shiraz font-black block">Schritt {index + 1}:</span>
                              <p className="text-text-main/80 font-medium leading-snug">{layer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* CHEMICAL MATRIX & BINDER CORRELATION */}
              <div className="space-y-4">
                <h3 className="font-bold text-text-main text-lg flex items-center gap-2 border-b border-home-grau/20 pb-2">
                  <Atom size={18} className="text-shiraz" /><MdText text={inhalt.texte.bindemittelWirkprinzipienDerBauchemikal} /></h3>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.jedesOberflächenschutzsystemBasiertAuf} /></p>

                <div className="overflow-x-auto border border-home-grau/30 rounded-xl bg-white shadow-xs">
                  <table className="w-full text-xs text-left text-text-main border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-home-grau/30 font-bold text-[11px] text-text-main/80">
                        <th className="p-3">Wirkstoffklasse</th>
                        <th className="p-3"><MdText text={inhalt.texte.zugeordneteOsSysteme} /></th>
                        <th className="p-3"><MdText text={inhalt.texte.chemischerProzess} /></th>
                        <th className="p-3"><MdText text={inhalt.texte.vorteileEigenschaften} /></th>
                        <th className="p-3">Einschränkungen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-home-grau/20 leading-normal">
                      <tr>
                        <td className="p-3 font-semibold text-shiraz"><MdText text={inhalt.texte.silaneSiloxane} /></td>
                        <td className="p-3 font-semibold"><MdText text={inhalt.texte.os1Hydrophobierung} /></td>
                        <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.reagierenMitDenSilanolgruppen} /></td>
                        <td className="p-3 text-emerald-800 font-medium bg-emerald-50/10"><MdText text={inhalt.texte.sehrHoheEindringtiefe1mm} /></td>
                        <td className="p-3 text-amber-800 bg-amber-50/10 font-medium"><MdText text={inhalt.texte.keinSchutzVorKohlendioxid} /></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-shiraz"><MdText text={inhalt.texte.t2kEpoxidharzeEp} /></td>
                        <td className="p-3 font-semibold">OS 8</td>
                        <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.polyadditionVonFlüssigenEpoxid} /></td>
                        <td className="p-3 text-emerald-800 font-medium bg-emerald-50/10"><MdText text={inhalt.texte.hoheDruckUndAbriebfestigkeit} /></td>
                        <td className="p-3 text-amber-800 bg-amber-50/10 font-medium"><MdText text={inhalt.texte.starrKeineRissüberbrückungFrost} /></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-shiraz"><MdText text={inhalt.texte.t2kPolyurethanePu} /></td>
                        <td className="p-3 font-semibold"><MdText text={inhalt.texte.os11aOs11b} /></td>
                        <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.polyadditionVonPolyisocyanatenMit} /></td>
                        <td className="p-3 text-emerald-800 font-medium bg-emerald-50/10"><MdText text={inhalt.texte.hochelastischSehrGuteDynamische} /></td>
                        <td className="p-3 text-amber-800 bg-amber-50/10 font-medium"><MdText text={inhalt.texte.feuchtigkeitsempfindlichWährendDerHärtun} /></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-shiraz">Reinacrylat-Dispersionen</td>
                        <td className="p-3 font-semibold"><MdText text={inhalt.texte.os2Os4} /></td>
                        <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.physikalischeFilmbildungDurchVerdunstung} /></td>
                        <td className="p-3 text-emerald-800 font-medium bg-emerald-50/10"><MdText text={inhalt.texte.hoheCoBremswirkungS} /></td>
                        <td className="p-3 text-amber-800 bg-amber-50/10 font-medium"><MdText text={inhalt.texte.nichtBefahrbarMäßigeStatische} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CONFRIGURATOR AND MATERIAL CALC BOARD */}
              <div className="bg-white rounded-2xl border border-home-grau/30 shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-text-main text-lg flex items-center gap-2">
                    <Calculator size={18} className="text-shiraz" /><MdText text={inhalt.texte.interaktiverOsSystemKonfigurator} /></h3>
                  <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.definierenSieIhrenAnwendungsfall} /></p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                  
                  {/* Left Column: Selector Form Inputs */}
                  <div className="lg:col-span-4 bg-stone-50 rounded-xl border border-home-grau/20 p-4 space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-text-main"><MdText text={inhalt.texte.t1ProjektflächeM} /></label>
                      <input aria-label={inhalt.werte.t1ProjektflächeM} 
                        type="number"
                        min="5"
                        max="50000"
                        value={osArea}
                        onChange={(e) => setOsArea(Math.max(5, Number(e.target.value)))}
                        className="w-full bg-white border border-home-grau/30 rounded-lg p-2 font-mono text-xs font-bold text-text-main outline-none focus:border-shiraz transition-all"
                      />
                      <span className="text-[10px] text-text-main/50 block"><MdText text={inhalt.texte.zurBerechnungDerGesamt} /></span>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-main"><MdText text={inhalt.texte.t2EinsatzbereichBauteil} /></label>
                      <select aria-label={inhalt.werte.t2EinsatzbereichBauteil} 
                        value={osEinsatzbereich} 
                        onChange={(e) => setOsEinsatzbereich(e.target.value)}
                        className="w-full bg-white border border-home-grau/30 rounded-lg p-2 text-xs text-text-main outline-none focus:border-shiraz transition-all font-medium"
                      >
                        <option value="tiefgarage_boden">Tiefgarage / Bodenplatte</option>
                        <option value="freideck_parkdeck">Freibewittertes Parkgut-Oberdeck / Rampen</option>
                        <option value="brueckenkappe">Brückenüberbau / Brückenkappe</option>
                        <option value="fassade_tunnel">Betonfassade / Tunnelwand / Pfeiler</option>
                        <option value="industriehalle">Industriehalle / Gabelstapler-Betrieb</option>
                        <option value="kellerwand_aussen">Kelleraußenwand / Spritzwasserzone</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-main"><MdText text={inhalt.texte.t3BruchBzwRissrisiko} /></label>
                      <select aria-label={inhalt.werte.t3BruchBzwRissrisiko} 
                        value={osCrackBridging} 
                        onChange={(e) => setOsCrackBridging(e.target.value)}
                        className="w-full bg-white border border-home-grau/30 rounded-lg p-2 text-xs text-text-main outline-none focus:border-shiraz transition-all font-medium"
                      >
                        <option value="nein">Keine Rissüberbrückung nötig (starr, feste Bodenbedingungen)</option>
                        <option value="ja_statisch">Statische Rissüberbrückung (Klasse A1-A2, ruhende Haarrisse)</option>
                        <option value="ja_dynamisch">Hochelastische Rissüberbrückung (Klasse B3 bei -20 °C, Temperaturschwankungen)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-text-main"><MdText text={inhalt.texte.t4MechanischeRollbeanspruchung} /></label>
                      <select aria-label={inhalt.werte.t4MechanischeRollbeanspruchung} 
                        value={osBelastung} 
                        onChange={(e) => setOsBelastung(e.target.value)}
                        className="w-full bg-white border border-home-grau/30 rounded-lg p-2 text-xs text-text-main outline-none focus:border-shiraz transition-all font-medium"
                      >
                        <option value="nur_begehbar">Nicht befahrbar (rein begehbar, dekorativ)</option>
                        <option value="leicht_pkw">Befahrbar (leichte PKW-Lasten, Garagenbetrieb)</option>
                        <option value="schwer_lkw">Schwer befahrbar (harte Punktlasten, LKW, Gabelstapler)</option>
                      </select>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 text-blue-950 rounded-lg space-y-1">
                      <span className="font-bold text-[10px] uppercase flex items-center gap-1"><Info size={11} /> Grenzabnahme</span>
                      <p className="text-[10px] leading-relaxed"><MdText text={inhalt.texte.reaktionsharzBeschichtungenEpPu} /></p>
                    </div>
                  </div>

                  {/* Right Column: Calculations & Action recommendations */}
                  {(() => {
                    // Logic to find recommended system
                    let recommendedSysId = 'os8';
                    let categoryText = inhalt.werte.starrBefahrbaresParkhausBeschichtungssys;
                    let noteText = '';

                    if (osEinsatzbereich === 'tiefgarage_boden') {
                      if (osCrackBridging === 'ja_dynamisch') {
                        recommendedSysId = 'os11b';
                        categoryText = inhalt.werte.os11bElastischesBefahrbares;
                        noteText = inhalt.werte.empfohlenFürFeuchtekritischeTiefgaragenb;
                      } else {
                        recommendedSysId = 'os8';
                        categoryText = inhalt.werte.os8StarreBefahrbare;
                        noteText = inhalt.werte.bewährtesStarresSystemFür;
                      }
                    } else if (osEinsatzbereich === 'freideck_parkdeck') {
                      recommendedSysId = 'os11a';
                      categoryText = inhalt.werte.os11aErhöhteDynamische;
                      noteText = inhalt.werte.fürFreiBewitterteParkdecks;
                    } else if (osEinsatzbereich === 'brueckenkappe') {
                      recommendedSysId = 'os1';
                      categoryText = inhalt.werte.os1Hydrophobierung;
                      noteText = inhalt.werte.einfachesUndHocheffektivesVerfahren;
                    } else if (osEinsatzbereich === 'fassade_tunnel') {
                      if (osCrackBridging === 'ja_dynamisch') {
                        recommendedSysId = 'os5b';
                        categoryText = inhalt.werte.os5bBeschichtungMit;
                        noteText = inhalt.werte.bietetDauerhaftenWitterungsschutzAuch;
                      } else if (osCrackBridging === 'ja_statisch') {
                        recommendedSysId = 'os5a';
                        categoryText = inhalt.werte.os5aBeschichtungMit;
                        noteText = inhalt.werte.kostengünstigerHaarrissAbdeckerFür;
                      } else {
                        recommendedSysId = 'os4';
                        categoryText = inhalt.werte.os4BeschichtungMit;
                        noteText = inhalt.werte.optimalFürDichteBetonschutzanstriche;
                      }
                    } else if (osEinsatzbereich === 'industriehalle') {
                      recommendedSysId = 'os8';
                      categoryText = inhalt.werte.os8StarreEp;
                      noteText = inhalt.werte.inIndustriehallenIstHoher;
                    } else if (osEinsatzbereich === 'kellerwand_aussen') {
                      recommendedSysId = 'os2';
                      categoryText = inhalt.werte.os2DünneBeschichtung;
                      noteText = inhalt.werte.dünneBeschichtungZurVerringerung;
                    }

                    // Dynamically get recommended material list
                    const materialDefinitions: Record<string, { material: string; rate: number; remark: string }[]> = inhalt.daten["BpFarbenLacke.materialDefinitions"];

                    const currentMatBreakdown = materialDefinitions[recommendedSysId] || materialDefinitions['os8'];
                    let totalVolumeSum = 0;

                    return (
                      <div className="lg:col-span-8 space-y-4 animate-in fade-in duration-300">
                        {/* Recommendation result box */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-xs text-emerald-950 flex gap-3.5">
                          <ShieldCheck size={28} className="text-emerald-700 flex-none mt-0.5" />
                          <div className="space-y-1.5">
                            <span className="font-bold text-[10px] uppercase tracking-wider block text-emerald-800"><MdText text={inhalt.texte.technischEmpfohleneKonfigurationTr} /></span>
                            <h4 className="text-base font-black text-emerald-900 leading-none">{categoryText}</h4>
                            <p className="font-semibold text-emerald-800/90 leading-tight">{noteText}</p>
                          </div>
                        </div>

                        {/* Material volume output table */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center px-1">
                            <span className="text-[11px] font-bold text-text-main/50 uppercase tracking-wider"><MdText text={inhalt.texte.kalkulierterGesamtbedarfFür} />{formatDeWert(osArea)} m²:</span>
                            <span className="px-2 py-0.5 rounded bg-shiraz/10 text-shiraz font-mono text-[11px] font-bold">Fläche: {formatDeWert(osArea)} m²</span>
                          </div>

                          <div className="overflow-hidden border border-home-grau/25 rounded-md text-xs bg-white">
                            <div className="grid grid-cols-12 gap-1 p-2.5 bg-stone-100 font-bold border-b border-home-grau/30 text-text-main text-[11px]">
                              <div className="col-span-5"><MdText text={inhalt.texte.komponenteSchichtleistung} /></div>
                              <div className="col-span-2 text-center">Verbrauch</div>
                              <div className="col-span-2 text-center text-shiraz">Gesamtmenge</div>
                              <div className="col-span-3">Arbeitshinweis</div>
                            </div>
                            
                            {currentMatBreakdown.map((row, idx) => {
                              const calculatedTotal = row.rate * osArea;
                              totalVolumeSum += calculatedTotal;

                              return (
                                <div key={idx} className="grid grid-cols-12 gap-1 p-2.5 border-b border-home-grau/10 last:border-0 items-center text-[11px] font-medium text-text-main">
                                  <div className="col-span-5 font-bold flex gap-1.5 items-center">
                                    <span className="w-4 h-4 rounded-full bg-stone-200 text-[10px] font-mono flex items-center justify-center font-bold">{idx + 1}</span>
                                    <span>{row.material}</span>
                                  </div>
                                  <div className="col-span-2 text-center font-mono text-text-main/70">{formatDeZahl(row.rate, 2)} kg/m²</div>
                                  <div className="col-span-2 text-center font-mono font-black text-shiraz bg-shiraz/5 py-1 rounded">{calculatedTotal.toLocaleString('de-DE', { maximumFractionDigits: 0 })} kg</div>
                                  <div className="col-span-3 text-text-main/60 italic leading-snug">{row.remark}</div>
                                </div>
                              );
                            })}

                            {/* Aggregates total */}
                            <div className="grid grid-cols-12 gap-1 p-3 bg-stone-100/50 font-bold items-center font-mono text-xs border-t border-home-grau/20">
                              <div className="col-span-12 font-sans flex justify-between font-black">
                                <span><MdText text={inhalt.texte.zusammenfassungHarzSand} /></span>
                                <span className="text-shiraz border-2 border-shiraz/35 px-3 py-1 rounded bg-shiraz/10 font-bold">
                                  {totalVolumeSum.toLocaleString('de-DE', { maximumFractionDigits: 0 })} kg Gesamt
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Concrete repairs info checklist */}
                        <div className="border border-amber-200 bg-amber-50/20 rounded-xl p-4 text-[11px]">
                          <h5 className="font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <AlertTriangle size={14} className="text-amber-700" /><MdText text={inhalt.texte.ausführungskriterienBetonvorbereitungDin} /></h5>
                          <ul className="list-disc list-inside space-y-1.5 text-text-main/80 leading-relaxed pl-1">
                            <li><MdText text={inhalt.texte.untergrundfestigkeitDieHaftzugfestigkeit} /></li>
                            <li><MdText text={inhalt.texte.rautiefeEgalisierungBeiGrobem} /></li>
                            <li><MdText text={inhalt.texte.taupunktRegelEineKondensatbildung} /></li>
                            <li><MdText text={inhalt.texte.witterungRelativeLuftfeuchte80} /></li>
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                  
                </div>
              </div>
            </div>
          )}

        </div>
        </ModuleTabs>
      </div>

      <InnovationPraxisSection moduleKey="bp_farben_lacke" />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielNassschichtdickeUndVer}
          zielGleichung="d_{wet} = \frac{d_{dry}}{VS/100}, \quad V = \frac{d_{wet}}{1000}\,\text{l/m}^2"
          normQuelle={inhalt.werte.dinEnIso2808}
          schritte={inhalt.daten["BpFarbenLacke.schritte"]}
          ergebnisHinweis={inhalt.werte.jeGeringerDerFestkörperanteil}
        />
      </div>

      <ModulTest moduleId="bp_farben_lacke" />

      <ModuleFooter
        wikipedia={[
          { title: 'Farbe', url: 'https://de.wikipedia.org/wiki/Farbe' },
          { title: 'Lack', url: 'https://de.wikipedia.org/wiki/Lack' },
          { title: inhalt.werte.flüchtigeOrganischeVerbindungenVoc, url: 'https://de.wikipedia.org/wiki/Fl%C3%BCchtige_organische_Verbindungen' },
          { title: 'Silikatfarbe', url: 'https://de.wikipedia.org/wiki/Silikatfarbe' }
        ]}
        literatur={inhalt.daten["BpFarbenLacke.literatur"]}
        regelwerke={inhalt.daten["BpFarbenLacke.regelwerke"]}
        formeln={inhalt.daten["BpFarbenLacke.formeln"]}
      />
    </div>
  );
}
