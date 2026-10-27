import React, { useState } from 'react';
import { Recycle, Sliders, Activity, CheckCircle2, Info, AlertTriangle, AlertCircle, FileText, BookOpen, Layers, ClipboardCheck, Printer } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { pn98Plan } from '@/src/calc/probenahme';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

const TREATMENT_OPTIONS = inhalt.daten.TREATMENT_OPTIONS;

export default function BodenMaterialAufbereitung() {
  const [activeTab, setActiveTab] = useState<'vorschriften' | 'simulator' | 'qualitaet' | 'probenahme'>('vorschriften');
  const [treatmentMaterial, setTreatmentMaterial] = useState<'erdaushub_sand' | 'boden_ton' | 'bauschutt_gemisch' | 'altablagerung'>('erdaushub_sand');
  const [treatmentContaminant, setTreatmentContaminant] = useState<'heavy_metals' | 'mkw_pak' | 'asbest_faser' | 'gips_sulfat'>('heavy_metals');

  // LAGA PN 98 & LfU Bayern sampling calculator states
  const [heapVolume, setHeapVolume] = useState<number>(120);
  const [heapDensity, setHeapDensity] = useState<number>(1.6);
  const [dMax, setDMax] = useState<number>(32);
  const [isHeterogeneous, setIsHeterogeneous] = useState<boolean>(false);
  const [hasSachkunde, setHasSachkunde] = useState<boolean>(true);
  const [volatilesSelected, setVolatilesSelected] = useState<boolean>(false);

  // Probenahmeprotokoll fields
  const [pProject, setPProject] = useState<string>(inhalt.werte.erweiterungThaCampusBaufeld);
  const [pSampler, setPSampler] = useState<string>(inhalt.werte.thomasWagnerZertifizierterProbennehmer);
  const [pDate, setPDate] = useState<string>('2026-06-03');
  const [pLocation, setPLocation] = useState<string>(inhalt.werte.augsburgAnDerHochschule);
  const [pWeather, setPWeather] = useState<string>(inhalt.werte.trockenLeichtBewölktCa);
  const [pWitness, setPWitness] = useState<string>(inhalt.werte.frDrMeierUntergeordnete);
  const [pNotes, setPNotes] = useState<string>(inhalt.werte.aushubhaufwerkNr4Vorsortierter);
  const [isFinalized, setIsFinalized] = useState<boolean>(false);

  // Math & Logic based on LAGA PN 98 & LfU standards
  const tonnage = Math.round(heapVolume * heapDensity);

  // Obergrenze je Untersuchung: LfU-Arbeitshilfe "Umgang mit Bodenmaterial" (Stand 10/2025) – max. 3.000 m³ je Haufwerk im Zwischenlager
  const maxUnitVol = 3000;

  // Rechenkern src/calc/probenahme.ts: LAGA PN 98, Tabelle 2, je Untersuchungseinheit (UE) – Runde 5:
  // bisher wurde die Tabelle auf das Gesamtvolumen statt auf jede UE angewendet; jetzt Summe über alle UE
  const pn98 = pn98Plan({ volumenM3: heapVolume, maxUeM3: maxUnitVol });
  const numInvestigationUnits = Math.max(1, pn98.einheiten);
  const samplingReq = { mp: pn98.gesamt.mischproben, ep: pn98.gesamt.einzelproben, laborproben: pn98.gesamt.laborproben, jeUe: pn98.jeUe };

  // Minimum single increment specification according to LAGA PN 98 / max grain size (d_max in mm)
  const getIncrementSpecs = (maxGrain: number) => {
    // LAGA PN 98, Tabelle 3: Mindestvolumen der Einzelprobe nach Größtkorn (Masse bei ca. 1,6 t/m³)
    switch (maxGrain) {
      case 2:
        return inhalt.daten.getIncrementSpecs;
      case 8:
        return inhalt.daten.getIncrementSpecs_2;
      case 16:
        return inhalt.daten.getIncrementSpecs_3;
      case 32:
        return inhalt.daten.getIncrementSpecs_4;
      case 63:
        return inhalt.daten.getIncrementSpecs_5;
      case 125:
        return inhalt.daten.getIncrementSpecs_6;
      default:
        return inhalt.daten.getIncrementSpecs_7;
    }
  };

  const specs = getIncrementSpecs(dMax);
  // Total volume for a full composite sample (Liters)
  const minMischprobeVolume = Math.round(specs.vol * (samplingReq.ep / samplingReq.mp) * 10) / 10;
  const minMischprobeMass = Math.round(specs.mass * (samplingReq.ep / samplingReq.mp) * 10) / 10;

  // LfU Bayern: Counter samples (Rückstellproben) - min 3 replicates:
  // 1x Analytical Lab Sample, 1x Authority Retained Sample, 1x Counter-Proof Retained Sample
  const numReplicates = 3;
  const totalMinLabSampleMass = Math.max(2, Math.round(specs.mass * 2)); // Laborprobe = 2 x Einzelprobe (LAGA PN 98 Tabelle 3); Rückstellproben als Praxisempfehlung
  const totalFieldMassRequired = totalMinLabSampleMass * numReplicates;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Recycle className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.bodenMaterialaufbereitung} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3">
            <p className="leading-relaxed"><MdText text={inhalt.texte.diesesDedizierteModulFokussiert} /></p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          <ModuleTabs
            label={inhalt.werte.bereicheBodenMaterialaufbereitung}
            tabs={[
              { id: 'vorschriften' as const, label: inhalt.texte.vorschriftenRahmen, icon: BookOpen },
              { id: 'simulator' as const, label: 'Aufbereitungssimulator', icon: Sliders },
              { id: 'qualitaet' as const, label: inhalt.texte.qualitätssicherungQs, icon: Activity },
              { id: 'probenahme' as const, label: inhalt.texte.lagaPn98Rechner, icon: ClipboardCheck },
            ]}
            aktiv={activeTab}
            onWechsel={setActiveTab}
            className="space-y-6"
          >

          {activeTab === 'vorschriften' && (
            <div className="animate-in fade-in duration-300">
              {/* 1. Einleitung & Rechtlicher Rahmen */}
              <section className="bg-white p-6 rounded-2xl border border-home-grau/30">
            <div className="flex items-center gap-3 border-b border-home-grau/30 pb-4 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-750 rounded-lg">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.vorschriftenDerMaterialaufbereitung} /></h3>
                <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.rechtlicherRahmenFürBöden} /></p>
              </div>
            </div>
            
            <p className="text-sm text-slate-700 leading-relaxed mb-6"><MdText text={inhalt.texte.dieAufbereitungKontaminierterBöden} /></p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50/70 p-4 rounded-xl border border-home-grau/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 bg-teal-100 text-teal-800 rounded text-xs font-bold font-mono">EBV</span>
                  <h4 className="font-bold text-sm text-slate-950">Ersatzbaustoffverordnung</h4>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed"><MdText text={inhalt.texte.regeltBundeseinheitlichDieHerstellung} /></p>
              </div>

              <div className="bg-slate-50/70 p-4 rounded-xl border border-home-grau/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 bg-amber-100 text-amber-800 rounded text-xs font-bold font-mono">BBodSchV</span>
                  <h4 className="font-bold text-sm text-slate-950">Bundes-Bodenschutzverordnung</h4>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed"><MdText text={inhalt.texte.greiftBeimAufUnd} /></p>
              </div>

              <div className="bg-slate-50/70 p-4 rounded-xl border border-home-grau/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 bg-indigo-100 text-indigo-800 rounded text-xs font-bold font-mono">GewAbfV</span>
                  <h4 className="font-bold text-sm text-slate-950">Gewerbeabfallverordnung</h4>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed"><MdText text={inhalt.texte.verordnetDieStrikteStoffliche} /></p>
              </div>
            </div>
          </section>
        </div>
      )}

          {activeTab === 'simulator' && (
            <div className="animate-in fade-in duration-300">
              {/* 2. Interaktiver Simulator */}
              <section className="bg-white p-6 rounded-2xl border border-home-grau/30">
            <div className="flex gap-2 items-center mb-1.5 border-b border-home-grau/30 pb-3">
              <Sliders size={20} className="text-shiraz" />
              <div>
                <h4 className="font-bold text-lg text-slate-900"><MdText text={inhalt.texte.interaktiverBodenMaterialaufbereitungssi} /></h4>
                <p className="text-xs text-slate-500"><MdText text={inhalt.texte.kombiniereBodenmatrixUndKontaminationsqu} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
              {/* Linkes Kontrollpanel */}
              <div className="lg:col-span-4 space-y-4">
                {/* Substrat-Auswahl */}
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono"><MdText text={inhalt.texte.t1DasAusgangsSubstrat} /></span>
                  <AuswahlGruppe label="Ausgangssubstrat" className="flex flex-col gap-1.5">
                    {[
                      { id: 'erdaushub_sand' as const, label: inhalt.werte.sandigerKiesigerBodenErdaushub, info: inhalt.werte.gutWaschbaresGekörntesMaterial },
                      { id: 'boden_ton' as const, label: inhalt.werte.bindigerTonschlammSchluff, info: inhalt.werte.klebrigFeinkörnigNassSchwer },
                      { id: 'bauschutt_gemisch' as const, label: inhalt.werte.mineralischerBauschuttBetonZiegel, info: inhalt.werte.klassischeAbbruchMischfraktion },
                      { id: 'altablagerung' as const, label: inhalt.werte.altablagerungenDeponiekörper, info: inhalt.werte.extremeHeterogenitätOftOrganikbeimischun }
                    ].map((mat) => (
                      <button {...alsOption(treatmentMaterial === mat.id)}
                        key={mat.id}
                        onClick={() => setTreatmentMaterial(mat.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          treatmentMaterial === mat.id 
                            ? 'bg-shiraz/5 border-shiraz text-shiraz shadow-sm' 
                            : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold leading-normal">{mat.label}</div>
                        <div className="text-xs text-slate-500 leading-normal mt-0.5">{mat.info}</div>
                      </button>
                    ))}
                  </AuswahlGruppe>
                </div>

                {/* Schadstoff-Auswahl */}
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono"><MdText text={inhalt.texte.t2DieHauptbelastungLeitkontaminante} /></span>
                  <AuswahlGruppe label="Leitkontaminante" className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'heavy_metals' as const, label: 'Schwermetalle', desc: inhalt.werte.asPbCdCu },
                      { id: 'mkw_pak' as const, label: 'MKW & PAK', desc: inhalt.werte.öleTeerrückstände },
                      { id: 'asbest_faser' as const, label: inhalt.werte.asbestKmf, desc: inhalt.werte.gefährlicheFasern },
                      { id: 'gips_sulfat' as const, label: inhalt.werte.gipsSulfat, desc: inhalt.werte.gefahrVGipstreiben }
                    ].map((cont) => (
                      <button {...alsOption(treatmentContaminant === cont.id)}
                        key={cont.id}
                        onClick={() => setTreatmentContaminant(cont.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          treatmentContaminant === cont.id 
                            ? 'bg-shiraz/5 border-shiraz text-shiraz shadow-sm' 
                            : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{cont.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5 leading-normal">{cont.desc}</div>
                      </button>
                    ))}
                  </AuswahlGruppe>
                </div>
              </div>

              {/* Rechtes Detailpanel mit den Simulationsergebnissen */}
              <div className="lg:col-span-8 bg-slate-50 p-6 rounded-2xl border border-home-grau/30 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/30 mb-4">
                    <div>
                      <span className="text-xs font-extrabold text-teal-850 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded tracking-wide uppercase font-mono"><MdText text={inhalt.texte.optimalesBehandlungsverfahren} /></span>
                      <h4 className="text-lg font-black text-slate-900 mt-1">
                        {TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].method}
                      </h4>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-white border border-home-grau/30 rounded font-bold font-mono text-slate-700">CO₂: {TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].co2}</span>
                      <span className="px-2 py-1 bg-white border border-home-grau/30 rounded font-bold font-mono text-slate-700">Kosten: {TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].cost}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-xl border border-home-grau/20">
                      <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block font-mono">Verfahrensprinzip</span>
                      <p className="text-xs text-slate-750 leading-relaxed mt-1">{TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].principles}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-home-grau/20">
                      <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block font-mono"><MdText text={inhalt.texte.rechtlicheVorgabenEbvBbodschv} /></span>
                      <p className="text-xs text-slate-750 leading-relaxed mt-1 font-medium">{TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].rules}</p>
                      <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Abreicherungseffizienz: {TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].efficiency}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-home-grau/20">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono"><MdText text={inhalt.texte.chronologischerVerfahrensablauf} /></span>
                    <ol className="space-y-1.5 text-xs text-slate-700">
                      {TREATMENT_OPTIONS[treatmentMaterial][treatmentContaminant].steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 items-start leading-relaxed animate-in fade-in slide-in-from-left-2 duration-200">
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">{idx + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/30 text-xs text-slate-500 italic"><MdText text={inhalt.texte.hinweisZuAsbestFasern} /></div>
              </div>
            </div>
          </section>
        </div>
      )}

          {activeTab === 'qualitaet' && (
            <div className="animate-in fade-in duration-300">
              {/* 3. Qualitätssicherung & Güteüberwachung (QA Pipeline) */}
              <section className="bg-white p-6 rounded-2xl border border-home-grau/30">
            <div className="flex gap-2 items-center mb-1.5 border-b border-home-grau/30 pb-3">
              <Activity size={20} className="text-emerald-600" />
              <div>
                <h4 className="font-bold text-lg text-slate-900"><MdText text={inhalt.texte.qualitätssicherungGüteüberwachungProdukt} /></h4>
                <p className="text-xs text-slate-500"><MdText text={inhalt.texte.dieGesetzlicheQualitätssicherungsschleif} /></p>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-normal mb-6"><MdText text={inhalt.texte.damitMineralischeErsatzbaustoffeMeb} /></p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 relative">
                <span aria-hidden="true" data-wasserzeichen="01" className="absolute top-2 right-2 text-3xl font-black text-slate-200 font-mono after:content-[attr(data-wasserzeichen)]" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">Schritt 1</span>
                <h5 className="font-bold text-sm text-slate-950 mt-1 mb-1.5 flex gap-1.5 items-center">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Annahmekontrolle
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.prüfungVonHerkunftsDeklaration} /></p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 relative">
                <span aria-hidden="true" data-wasserzeichen="02" className="absolute top-2 right-2 text-3xl font-black text-slate-200 font-mono after:content-[attr(data-wasserzeichen)]" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">Schritt 2</span>
                <h5 className="font-bold text-sm text-slate-950 mt-1 mb-1.5 flex gap-1.5 items-center">
                  <CheckCircle2 size={14} className="text-emerald-500" /><MdText text={inhalt.texte.werkseigeneKontrolle} /></h5>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.täglicheMesstechnischeÜberwachungDes} /></p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 relative">
                <span aria-hidden="true" data-wasserzeichen="03" className="absolute top-2 right-2 text-3xl font-black text-slate-200 font-mono after:content-[attr(data-wasserzeichen)]" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">Schritt 3</span>
                <h5 className="font-bold text-sm text-slate-950 mt-1 mb-1.5 flex gap-1.5 items-center">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Fremdüberwachung
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.unabhängigeUnangekündigteAuditierungDer} /></p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 relative">
                <span aria-hidden="true" data-wasserzeichen="04" className="absolute top-2 right-2 text-3xl font-black text-slate-200 font-mono after:content-[attr(data-wasserzeichen)]" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">Schritt 4</span>
                <h5 className="font-bold text-sm text-slate-950 mt-1 mb-1.5 flex gap-1.5 items-center">
                  <CheckCircle2 size={14} className="text-emerald-500" /><MdText text={inhalt.texte.güteschutzRegister} /></h5>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.zertifizierungDurchGütekonsortienZ} /></p>
              </div>
            </div>
          </section>
        </div>
      )}

          {activeTab === 'probenahme' && (
            <div className="animate-in fade-in duration-300">
              {/* 4. Probenahme-Rechner & Protokoll-Generator (LAGA PN 98 / LfU Bayern) */}
              <section className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-2xs">
            <div className="flex gap-2 items-center mb-1.5 border-b border-home-grau/30 pb-3">
              <ClipboardCheck size={20} className="text-shiraz" />
              <div>
                <h4 className="font-bold text-lg text-slate-900"><MdText text={inhalt.texte.probenahmeNachLagaPn} /></h4>
                <p className="text-xs text-slate-500"><MdText text={inhalt.texte.berechnungDerProbenmengenNach} /><span className="font-mono bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-xs">lfu_abfall_00266.pdf</span>
                </p>
              </div>
            </div>

            {/* Quick Informational Note */}
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 leading-relaxed">
              <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                <Info size={14} className="text-slate-700" /><MdText text={inhalt.texte.bayerischeLandesreglementierungZurHaufwe} /></div>
              <p><MdText text={inhalt.texte.inBayernRegeltDas} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Controls Column */}
              <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-home-grau/20 space-y-5">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono mb-4">Input-Parameter</h5>
                
                {/* Slope Volume slider & input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800"><MdText text={inhalt.texte.haufwerksvolumenV} /></label>
                    <div className="flex items-center gap-1">
                      <input aria-label={inhalt.werte.haufwerksvolumen} 
                        type="number" min="0" 
                        value={heapVolume} 
                        onChange={(e) => setHeapVolume(Math.max(1, parseInt(e.target.value) || 0))}
                        disabled={isFinalized}
                        className="w-16 p-1 text-xs text-right border border-home-grau/40 bg-slate-50 rounded font-bold" 
                      />
                      <span className="text-xs text-slate-500 font-serif">m³</span>
                    </div>
                  </div>
                  <input aria-label={inhalt.werte.haufwerksvolumenM} 
                    type="range" 
                    min="5" 
                    max="3000" 
                    step="5"
                    value={heapVolume} 
                    onChange={(e) => setHeapVolume(parseInt(e.target.value))}
                    disabled={isFinalized}
                    className="w-full accent-shiraz h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>5 m³</span>
                    <span>1000 m³</span>
                    <span>2000 m³</span>
                    <span>3000 m³</span>
                  </div>
                </div>

                {/* Density Selection */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-800"><MdText text={inhalt.texte.dichteSchüttgewichtRho} /></label>
                    <span className="text-xs font-mono font-bold text-slate-700">{formatDeZahl(heapDensity, 1)} t/m³</span>
                  </div>
                  <select 
                    value={heapDensity} 
                    onChange={(e) => setHeapDensity(parseFloat(e.target.value))}
                    disabled={isFinalized}
                    className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white"
                  >
                    <option value="1.5">1,5 t/m³ (Ziegel / Bauschuttleichtfraktion)</option>
                    <option value="1.6">1,6 t/m³ (Bindiger Tonschlamm / Schluff)</option>
                    <option value="1.8">1,8 t/m³ (Sandiger / kiesiger Boden / Erdaushub)</option>
                    <option value="1.7">1,7 t/m³ (Heterogene Altablagerungen / Deponiematerial)</option>
                    <option value="2.0">2,0 t/m³ (Betonbruch / Schwerer Bauschutt)</option>
                  </select>
                </div>

                {/* Maximum Grain Size d_max */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-800 block"><MdText text={inhalt.texte.größtkornDesMaterialsD} /></span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[2, 8, 16, 32, 63, 125, 126].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setDMax(sz)}
                        disabled={isFinalized}
                        className={`py-1.5 px-1 text-xs font-bold border rounded text-center transition-all cursor-pointer ${
                          dMax === sz 
                            ? 'bg-shiraz text-white border-shiraz' 
                            : 'bg-slate-50 border-home-grau/30 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {sz === 126 ? '> 125 mm' : `≤ ${formatDeWert(sz)} mm`}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 leading-normal italic mt-1 bg-slate-50 p-2 rounded">
                    Ausgewählt: <span className="font-semibold text-slate-800">{specs.name}</span><MdText text={inhalt.texte.brBestimmtDasBenötigte} /></div>
                </div>

                {/* Toggles */}
                <div className="space-y-2.5 pt-3 border-t border-home-grau/25">
                  
                  {/* Sachkundenachweis Checkbox */}
                  <label className="flex gap-2.5 items-start cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasSachkunde}
                      onChange={(e) => setHasSachkunde(e.target.checked)}
                      disabled={isFinalized}
                      className="mt-0.5 rounded border-home-grau/40 accent-shiraz"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-850 block leading-tight"><MdText text={inhalt.texte.probennehmerMitSachkundenachweis} /></span>
                      <span className="text-xs text-slate-500 block leading-normal mt-0.5"><MdText text={inhalt.texte.besitztZertifizierungsnachweisGemäßLaga} /></span>
                    </div>
                  </label>

                  {/* Volatiles Checkbox */}
                  <label className="flex gap-2.5 items-start cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={volatilesSelected}
                      onChange={(e) => setVolatilesSelected(e.target.checked)}
                      disabled={isFinalized}
                      className="mt-0.5 rounded border-home-grau/40 accent-shiraz"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-850 block leading-tight"><MdText text={inhalt.texte.flüchtigeSchadstoffeImFokus} /></span>
                      <span className="text-xs text-slate-500 block leading-normal mt-0.5"><MdText text={inhalt.texte.analytikSuchtNachBtex} /></span>
                    </div>
                  </label>

                  {/* Heterogeneity Toggle */}
                  <label className="flex gap-2.5 items-start cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isHeterogeneous}
                      onChange={(e) => setIsHeterogeneous(e.target.checked)}
                      disabled={isFinalized}
                      className="mt-0.5 rounded border-home-grau/40 accent-shiraz"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-850 block leading-tight"><MdText text={inhalt.texte.schichtungUngleichmäßigkeit} /></span>
                      <span className="text-xs text-slate-500 block leading-normal mt-0.5"><MdText text={inhalt.texte.haufwerkIstVisuellInhomogen} /></span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Calculated Outputs Column */}
              <div className="lg:col-span-7 bg-slate-50 p-5 rounded-xl border border-home-grau/20 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono mb-4"><MdText text={inhalt.texte.berechnetesProbenahmeSollLaga} /></h5>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-xl border border-home-grau/15">
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block"><MdText text={inhalt.texte.tonnageDesHaufwerks} /></span>
                      <div className="text-xl font-extrabold text-slate-850 mt-0.5 flex items-baseline gap-1">
                        {tonnage.toLocaleString('de-DE')}
                        <span className="text-xs font-normal text-slate-500">t</span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-xl border border-home-grau/15">
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block"><MdText text={inhalt.texte.untersuchungseinheitenUe} /></span>
                      <div className="text-xl font-extrabold text-slate-850 mt-0.5 flex items-baseline gap-1">
                        {numInvestigationUnits}
                        <span className="text-xs font-normal text-slate-500">UE</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 bg-white p-4 rounded-xl border border-home-grau/15">
                    
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-800"><MdText text={inhalt.texte.mindestanzahlMischproben} /></span>
                        <span className="text-xs text-slate-400 block mt-0.5 font-mono"><MdText text={inhalt.texte.lagaPn98Tabelle} /> · {formatDeWert(samplingReq.jeUe.mischproben)}<MdText text={inhalt.texte.mpJeUeLaborproben} />{formatDeWert(samplingReq.laborproben)}</span>
                      </div>
                      <span className="text-sm font-black text-shiraz bg-shiraz/5 border border-shiraz/20 px-3 py-1 rounded">
                        {formatDeWert(samplingReq.mp)} MP
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-800"><MdText text={inhalt.texte.mindestanzahlEinzelprobenIncrements} /></span>
                        <span className="text-xs text-slate-400 block mt-0.5 font-mono"><MdText text={inhalt.texte.insgesamtAusVerschiedenenTiefenstufen} /></span>
                      </div>
                      <span className="text-sm font-black text-slate-800 bg-slate-50 border border-slate-200 px-3 py-1 rounded">
                        {formatDeWert(samplingReq.ep)} EP
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-800"><MdText text={inhalt.texte.mengeJeEinzelprobeVolumen} /></span>
                        <span className="text-xs text-slate-400 block mt-0.5 font-mono"><MdText text={inhalt.texte.orientiertNachDMax} />{specs.name})</span>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
                        {specs.vol >= 1 ? `${formatDeWert(specs.vol)} L` : `${formatDeWert(specs.vol * 1000)} ml`} / {formatDeWert(specs.mass)} kg
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-slate-800"><MdText text={inhalt.texte.laborMindestmengeRückstellprobenPraxisem} /></span>
                        <span className="text-xs text-slate-400 block mt-0.5 font-mono"><MdText text={inhalt.texte.analysenprobeBehördenprobeBeweissicherun} /></span>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded">
                        3 x {formatDeWert(totalMinLabSampleMass)} kg (= {formatDeWert(totalFieldMassRequired)} kg)
                      </span>
                    </div>
                  </div>

                  {/* Context-Sensitive Warnings and Instructions (Bavarian Specifics) */}
                  <div className="mt-4 space-y-2">
                    
                    {/* Warning: Missing Qualification */}
                    {!hasSachkunde && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg flex gap-2 items-start animate-pulse">
                        <AlertTriangle size={15} className="text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-0.5 font-extrabold">Qualitätsmangel:</strong><MdText text={inhalt.texte.lagaPn98Verlangt} /></div>
                      </div>
                    )}

                    {/* Instruction: Volatiles (BTEX/LCKW) required procedure */}
                    {volatilesSelected && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-850 text-xs p-3 rounded-lg flex gap-2 items-start">
                        <AlertCircle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-0.5 font-extrabold"><MdText text={inhalt.texte.spezialvorgabeLfuBayernFür} /></strong><MdText text={inhalt.texte.fürLeichtflüchtigeStoffeDürfen} /></div>
                      </div>
                    )}

                    {/* Instruction: Heterogeneity */}
                    {isHeterogeneous && (
                      <div className="bg-sky-50 border border-sky-200 text-sky-850 text-xs p-3 rounded-lg flex gap-2 items-start">
                        <Info size={15} className="text-sky-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-0.5 font-extrabold"><MdText text={inhalt.texte.hinweisZurProbenahmestrategie} /></strong><MdText text={inhalt.texte.inhomogeneOderGeschichteteHaufwerke} /></div>
                      </div>
                    )}

                    {/* Big units notice */}
                    {numInvestigationUnits > 1 && (
                      <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-lg flex gap-2 items-start">
                        <Layers size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-0.5 font-extrabold"><MdText text={inhalt.texte.erforderlicheAufteilungIn} />{numInvestigationUnits} Sektoren:</strong><MdText text={inhalt.texte.dasHaufwerkÜbersteigt3} />{numInvestigationUnits}<MdText text={inhalt.texte.getrennteUntersuchungseinheitenUeBilden} /></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-500 italic mt-3 pt-3 border-t border-home-grau/20"><MdText text={inhalt.texte.formelZurProbenanzahlLaga} /><FormulaText text="n_{MP} = 10 + \lceil \frac{V_u - 600}{100} \rceil" /><MdText text={inhalt.texte.mitInDerRegel} /><FormulaText text="4" /><MdText text={inhalt.texte.einzelprobenJeMischprobe} /></div>
              </div>
            </div>

            {/* Part 4.2 Probenahmeprotokoll Form & Report Generator */}
            <div className="mt-8 pt-8 border-t border-home-grau/30">
              <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
                <FileText size={16} className="text-shiraz" /><MdText text={inhalt.texte.interaktiverProbenahmeprotokollGenerator} /></h5>
              <p className="text-xs text-slate-600 leading-normal mb-4"><MdText text={inhalt.texte.nutzenSieDiesesInteraktive} /></p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Projektbezeichnung:</label>
                    <input aria-label="Projektbezeichnung" 
                      type="text" 
                      value={pProject}
                      onChange={(e) => setPProject(e.target.value)}
                      disabled={isFinalized}
                      className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.zertifizierterProbennehmerName} /></label>
                    <input aria-label={inhalt.werte.zertifizierterProbennehmerName} 
                      type="text" 
                      value={pSampler}
                      onChange={(e) => setPSampler(e.target.value)}
                      disabled={isFinalized}
                      className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.datumDerProbenahme} /></label>
                    <input aria-label={inhalt.werte.datumDerProbenahme} 
                      type="text" 
                      value={pDate}
                      onChange={(e) => setPDate(e.target.value)}
                      disabled={isFinalized}
                      className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.entnahmeortGpsKoordinaten} /></label>
                    <input aria-label={inhalt.werte.entnahmeortGpsKoordinaten} 
                      type="text" 
                      value={pLocation}
                      onChange={(e) => setPLocation(e.target.value)}
                      disabled={isFinalized}
                      className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Witterungsverhältnisse:</label>
                    <input aria-label="Witterungsverhältnisse" 
                      type="text" 
                      value={pWeather}
                      onChange={(e) => setPWeather(e.target.value)}
                      disabled={isFinalized}
                      className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.behördenzeugeVertretungBauherr} /></label>
                    <input aria-label={inhalt.werte.behördenzeugeVertretungBauherr} 
                      type="text" 
                      value={pWitness}
                      onChange={(e) => setPWitness(e.target.value)}
                      disabled={isFinalized}
                      className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white" 
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.besondereBemerkungenVorOrt} /></label>
                <textarea aria-label={inhalt.werte.besondereBemerkungenVorOrt} 
                  value={pNotes}
                  onChange={(e) => setPNotes(e.target.value)}
                  disabled={isFinalized}
                  className="w-full p-2 text-xs border border-home-grau/40 rounded bg-white h-16 font-sans resize-none" 
                />
              </div>

              {/* LIVE RENDER OF OFFICIAL DOCUMENT SHEETS */}
              <div id="printable-probenahmeprotokoll" className="bg-white border-2 border-slate-700 rounded-lg p-6 font-serif shadow-sm relative text-xs text-slate-900 leading-normal max-w-3xl mx-auto">
                <div className="absolute top-2 right-4 text-xs font-sans font-bold text-slate-400 font-mono hidden md:block"><MdText text={inhalt.texte.akkreditierungsnummerByPn982026} /></div>

                <div className="border-b-2 border-slate-700 pb-3 mb-4 text-center">
                  <h3 className="text-base font-black font-sans uppercase tracking-widest text-slate-900"><MdText text={inhalt.texte.probenahmeprotokollGemäßLagaPn} /></h3>
                  <p className="text-xs font-sans text-slate-500 mt-1"><MdText text={inhalt.texte.güttigkeitsnachweisUnterAnerkennungDes} /></p>
                </div>

                {/* Status Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] text-shiraz font-sans font-black text-6xl text-center rotate-12 uppercase select-none">
                  {isFinalized ? inhalt.werte.geregeltUnterzeichnet : inhalt.werte.entwurfDraft}
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 pb-3 mb-3 border-b border-dashed border-slate-300">
                  <div>
                    <span className="font-bold font-sans text-xs text-slate-500 block">PROJEKT:</span>
                    <span className="font-semibold text-slate-900">{pProject}</span>
                  </div>
                  <div>
                    <span className="font-bold font-sans text-xs text-slate-500 block">ENTNAHMEORT:</span>
                    <span className="font-semibold text-slate-900">{pLocation}</span>
                  </div>
                  <div>
                    <span className="font-bold font-sans text-xs text-slate-500 block">DATUM:</span>
                    <span className="font-semibold text-slate-900">{pDate}</span>
                  </div>
                  <div>
                    <span className="font-bold font-sans text-xs text-slate-500 block">WITTERUNG:</span>
                    <span className="font-semibold text-slate-900">{pWeather}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 pb-3 mb-3 border-b border-dashed border-slate-300">
                  <div>
                    <span className="font-bold font-sans text-xs text-slate-500 block"><MdText text={inhalt.texte.probennehmerSachkunde} /></span>
                    <span className="font-semibold text-slate-900">{pSampler}</span>
                    <span className="block text-xs text-slate-500 font-sans mt-0.5">
                      {hasSachkunde 
                        ? inhalt.werte.zertifikatPn98LiegtVor 
                        : inhalt.werte.achtungKlärenSieMangelnde
                      }
                    </span>
                  </div>
                  <div>
                    <span className="font-bold font-sans text-xs text-slate-500 block">BEHÖRDENZEUGE:</span>
                    <span className="font-semibold text-slate-900">{pWitness}</span>
                  </div>
                </div>

                <div className="pb-3 mb-3 border-b border-dashed border-slate-300">
                  <span className="font-bold font-sans text-xs text-slate-500 block mb-1"><MdText text={inhalt.texte.haufwerksmetadatenSollAnforderungen} /></span>
                  <table className="w-full text-xs font-sans border border-collapse border-slate-300">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="border border-slate-300 p-1 text-left font-bold">Parameter</th>
                        <th className="border border-slate-300 p-1 text-left font-bold"><MdText text={inhalt.texte.sollVorgabeLagaPn} /></th>
                        <th className="border border-slate-300 p-1 text-left font-bold"><MdText text={inhalt.texte.istWertProbenahme} /></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-1"><MdText text={inhalt.texte.haufwerksvolumenMasse} /></td>
                        <td className="border border-slate-300 p-1 font-mono">{formatDeWert(heapVolume)} m³ / {formatDeWert(tonnage)} t</td>
                        <td className="border border-slate-300 p-1 font-semibold"><MdText text={inhalt.texte.lautVermessungErfüllt} /></td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1"><MdText text={inhalt.texte.untersuchungseinheitenUe2} /></td>
                        <td className="border border-slate-300 p-1 font-mono">{numInvestigationUnits}<MdText text={inhalt.texte.ueMax3000} /></td>
                        <td className="border border-slate-300 p-1 font-semibold">{numInvestigationUnits} UE gebildet</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1"><MdText text={inhalt.texte.anzahlMischprobenMp} /></td>
                        <td className="border border-slate-300 p-1 font-mono">≥ {formatDeWert(samplingReq.mp)} MP</td>
                        <td className="border border-slate-300 p-1 font-semibold">{formatDeWert(samplingReq.mp)}<MdText text={inhalt.texte.mpEntnommen} /></td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1"><MdText text={inhalt.texte.anzahlEinzelprobenEp} /></td>
                        <td className="border border-slate-300 p-1 font-mono">≥ {formatDeWert(samplingReq.ep)}<MdText text={inhalt.texte.epVerteilt} /></td>
                        <td className="border border-slate-300 p-1 font-semibold">{formatDeWert(samplingReq.ep)}<MdText text={inhalt.texte.epHomogenVermischt} /></td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1"><MdText text={inhalt.texte.maximalesKornDMax} /></td>
                        <td className="border border-slate-300 p-1">{specs.name}</td>
                        <td className="border border-slate-300 p-1 font-semibold">Bestätigt</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-350 p-1"><MdText text={inhalt.texte.inkrementmengeJeEp} /></td>
                        <td className="border border-slate-350 p-1 font-mono">≥ {formatDeWert(specs.vol)} Liters / {formatDeWert(specs.mass)} kg</td>
                        <td className="border border-slate-350 p-1 font-semibold"><MdText text={inhalt.texte.eingehaltenSchaufelbeprobung} /></td>
                      </tr>
                      <tr>
                        <td className="border border-slate-350 p-1"><MdText text={inhalt.texte.probenkonservierungRückhaltLfu} /></td>
                        <td className="border border-slate-350 p-1 font-mono">3 x {formatDeWert(totalMinLabSampleMass)}<MdText text={inhalt.texte.kgReplikate} /></td>
                        <td className="border border-slate-350 p-1 font-semibold"><MdText text={inhalt.texte.inVerplombtenPeEimern} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pb-4 mb-4">
                  <span className="font-bold font-sans text-xs text-slate-500 block"><MdText text={inhalt.texte.sensorikBesondereBemerkungen} /></span>
                  <p className="italic text-slate-800 bg-slate-50 p-2 border border-slate-200 rounded leading-relaxed mt-1">
                    "{pNotes || inhalt.werte.keineSensorischenAuffälligkeiten}"
                  </p>
                </div>

                {/* Simulated Signatures */}
                <div className="grid grid-cols-2 gap-12 mt-8 pt-8 border-t border-slate-300 font-sans text-xs">
                  <div className="space-y-4">
                    <div className="border-b border-slate-900 pb-1 font-mono font-medium text-slate-700 italic h-6 flex items-center">
                      {isFinalized ? pSampler : ''}
                    </div><MdText text={inhalt.texte.unterschriftDesProbennehmers} /><span className="block text-slate-400"><MdText text={inhalt.texte.sachkundenummerByPn982026} /></span>
                  </div>
                  <div className="space-y-4">
                    <div className="border-b border-slate-900 pb-1 font-mono font-medium text-slate-700 italic h-6 flex items-center">
                      {isFinalized ? pWitness : ''}
                    </div><MdText text={inhalt.texte.unterschriftBauzeugeBehörde} /><span className="block text-slate-400"><MdText text={inhalt.texte.verantwortlicheÜberwachungsstelle} /></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for report */}
              <div className="mt-5 flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setIsFinalized(!isFinalized)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isFinalized 
                      ? 'bg-slate-700 text-white hover:bg-slate-800' 
                      : 'bg-shiraz hover:bg-shiraz/90 text-white'
                  }`}
                >
                  <ClipboardCheck size={14} />
                  {isFinalized ? inhalt.werte.protokollEntsperrenKorrektur : inhalt.werte.protokollFinalisierenAmpDigital}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!isFinalized) {
                      setIsFinalized(true);
                    }
                    setTimeout(() => window.print(), 150);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer size={14} /><MdText text={inhalt.texte.alsOffiziellesPdfDrucken} /></button>
              </div>
            </div>
          </section>
        </div>
      )}
          </ModuleTabs>

        </div>
      </div>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1BeprobungEines}
        zielGleichung="m = V \cdot \rho, \quad n_{EP} = 4 \cdot n_{MP}"
        schritte={inhalt.daten["BodenMaterialAufbereitung.schritte"]}
        ergebnisHinweis={inhalt.werte.dieMischprobenWerdenVor}
        normQuelle={inhalt.werte.lagaPn98Tabellen}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2WassergehaltUnd}
        zielGleichung="w = \frac{m_f - m_d}{m_d}"
        schritte={inhalt.daten["BodenMaterialAufbereitung.schritte_2"]}
        ergebnisHinweis={inhalt.werte.einFalscherBezugOriginalsubstanz}
        normQuelle={inhalt.werte.dinEnIso17892}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="boden_materialaufbereitung" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap9} 
        wikipedia={[
          { title: 'Ersatzbaustoffverordnung', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' },
          { title: 'Bodenschutz', url: 'https://de.wikipedia.org/wiki/Bodenschutz' },
          { title: 'Kreislaufwirtschaftsgesetz', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaftsgesetz' }
        ]}
        literatur={inhalt.daten["BodenMaterialAufbereitung.literatur"]}
        weblinks={[
          { title: inhalt.werte.lfuBayernUmgangMit, url: 'https://www.bestellen.bayern.de/med/801504b0-b4a5-11f0-81ee-c3fc7d0a3316/4b0e6a70-1059-11d9-4c85-9d915831e9eb/0/lfu_abfall_00266.pdf' }
        ]}
        regelwerke={inhalt.daten["BodenMaterialAufbereitung.regelwerke"]}
        formeln={inhalt.daten["BodenMaterialAufbereitung.formeln"]}
      />
    </div>
  );
}
