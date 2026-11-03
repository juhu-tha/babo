import React, { useState } from 'react';
import { 
  FileWarning, 
  ChevronRight, 
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Activity,
  Layers,
  Wrench,
  Paperclip,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';
import inhalt from '@/content/typischebauschaeden/TypischeBauschaeden.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

type TypSchadTab = 'feuchtigkeit' | 'risse' | 'korrosion' | 'unvertraeglichkeiten' | 'tief_ingenieurbau' | 'kleb_dicht' | 'analysator';

export default function TypischeBauschaeden() {
  const { typischeBauschaedenSubTab } = useTabContext();
  // Startkategorie aus Querverweisen (z. B. Fallakten in „Große Materialschäden“)
  const [activeSubTab, setActiveSubTab] = useState<TypSchadTab>(typischeBauschaedenSubTab ?? 'feuchtigkeit');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const tabs = [
    { id: 'feuchtigkeit', label: inhalt.werte.feuchtigkeitSchimmel, icon: Droplets, desc: inhalt.werte.feuchtigkeitseintritteKapillareEffekteAb },
    { id: 'risse', label: inhalt.werte.risseVerformungen, icon: Activity, desc: inhalt.werte.schwindrisseSetzungsrisseThermischeSpann },
    { id: 'korrosion', label: inhalt.werte.korrosionBetonschäden, icon: Layers, desc: inhalt.werte.karbonatisierungChlorideintragFrostTau },
    { id: 'unvertraeglichkeiten', label: inhalt.werte.unverträglichkeitenNeu, icon: AlertTriangle, desc: inhalt.werte.gipstreibenKontakkorrosionFließregelVerl },
    { id: 'tief_ingenieurbau', label: inhalt.werte.tiefIngenieurbau, icon: Wrench, desc: inhalt.werte.schädenAnBrückenTunneln },
    { id: 'kleb_dicht', label: inhalt.werte.klebDichtstoffSchäden, icon: Paperclip, desc: inhalt.werte.anwendungstippsFehlerquellenAlterungsmec },
    { id: 'analysator', label: 'Szenarien-Analysator', icon: Lightbulb, desc: inhalt.werte.interaktiverBauSzenarienAnalysator },
  ] as const;

  // Practical scenarios for the Interactive Checker
  const scenarios = inhalt.daten["TypischeBauschaeden.scenarios"];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <FileWarning className="text-shiraz animate-pulse" /><MdText text={inhalt.texte.typischeBauschädenSchadensbilder} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.detailliertesFachwissenZuPhysikalisch} /></p>
        </div>

        {/* Reiter (Z53: ModuleTabs; die Kurzbeschreibung des aktiven Reiters steht sichtbar über dem Inhalt) */}
        <ModuleTabs label="Kategorien typischer Bauschäden" tabs={tabs} aktiv={activeSubTab} onWechsel={setActiveSubTab} variante="kachel" className="flex flex-col gap-4 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/30 [&>[role=tablist]]:pb-4">
        <p className="text-xs text-text-main/70">{tabs.find(t => t.id === activeSubTab)?.desc}</p>

        {/* Tab Content Area */}
        <div className="mt-2 text-sm text-text-main">

          {/* Tab 1: Feuchtigkeit & Schimmel */}
          {activeSubTab === 'feuchtigkeit' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <Droplets opacity={0.8} /><MdText text={inhalt.texte.feuchtigkeitseintrittMechanismen} /></h3>
                  <div className="space-y-2.5 text-sm leading-relaxed text-slate-800">
                    <div>
                      <strong className="text-slate-950"><MdText text={inhalt.texte.t1AufsteigendeFeuchtigkeitKapillartranspo} /></strong>
                      <p className="mt-0.5 text-slate-700"><MdText text={inhalt.texte.mangelhafteOderFehlendeHorizontale} /></p>
                      <div className="bg-white p-2 rounded-lg border border-home-grau/25 text-xs my-1.5 font-mono">
                        <span className="text-slate-600 block text-[11px] font-sans mb-0.5"><MdText text={inhalt.texte.kapillareSteighöheNachJurin} /></span>
                        <BlockMath math="h = \frac{2 \cdot \sigma \cdot \cos\theta}{\rho \cdot g \cdot r}" />
                        <span className="text-[10px] text-slate-500 font-sans block mt-1"><MdText text={inhalt.texte.mitOberflächenspannungSigmaKontaktwinkel} /></span>
                      </div>
                    </div>
                    <div>
                      <strong className="text-slate-950"><MdText text={inhalt.texte.t2QuerdurchfeuchtungHydrostatischerDruck} /></strong>
                      <p className="mt-0.5 text-slate-700"><MdText text={inhalt.texte.versagenDerVertikalenBauwerksabdichtung} /></p>
                    </div>
                    <div>
                      <strong className="text-slate-950"><MdText text={inhalt.texte.t3HygroskopischeFeuchteSalzsprengung} /></strong>
                      <p className="mt-0.5 text-slate-700"><MdText text={inhalt.texte.mitDemWasserTransportierte} /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <AlertTriangle size={18} /><MdText text={inhalt.texte.tauwasserKältebrückenSchimmel} /></h3>
                  <div className="space-y-2.5 text-sm leading-relaxed text-slate-800">
                    <div>
                      <strong className="text-slate-950"><MdText text={inhalt.texte.temperaturfaktorFRsiDin} /></strong>
                      <p className="mt-0.5 text-slate-700"><MdText text={inhalt.texte.geometrischeOderKonstruktiveWärmebrücken} /></p>
                      <div className="bg-white p-2 rounded-lg border border-home-grau/25 text-xs my-1.5 font-mono">
                        <BlockMath math="f_{Rsi} = \frac{\theta_{si} - \theta_e}{\theta_i - \theta_e} \ge 0{,}70" />
                        <span className="text-[10px] text-slate-500 font-sans block mt-1"><MdText text={inhalt.texte.beiNormrandbedingungenThetaI} /></span>
                      </div>
                    </div>
                    <div>
                      <strong className="text-slate-950"><MdText text={inhalt.texte.dampfdiffusionNachGlaserDin} /></strong>
                      <p className="mt-0.5 text-slate-700"><MdText text={inhalt.texte.wasserdampfteildruckPVVs} /></p>
                    </div>
                    <div className="bg-rose-50/50 p-3 rounded-lg border border-shiraz/20 font-medium text-slate-900 text-xs leading-relaxed"><MdText text={inhalt.texte.schimmelpilzkriteriumSchimmelpilzmyzelie} /></div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-shiraz"></span><MdText text={inhalt.texte.messtechnikSensorikSchadensdiagnostikIn} /></h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30">
                    <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.darrMethodeGravimetrieNach} /></strong>
                    <p className="text-slate-700 text-xs leading-relaxed"><MdText text={inhalt.texte.zerstörendesJustitiablesReferenzverfahre} /></p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30">
                    <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.cmVerfahrenCalciumcarbidMethode} /></strong>
                    <p className="text-slate-700 text-xs leading-relaxed"><MdText text={inhalt.texte.chemischeUmsetzungVonPorenwasser} /></p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30">
                    <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.dielektrischeMikrowellenSensorik} /></strong>
                    <p className="text-slate-700 text-xs leading-relaxed"><MdText text={inhalt.texte.zerstörungsfreieHochfrequenzMessungDer} /></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Risse & Verformungen */}
          {activeSubTab === 'risse' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
                  <Activity className="text-shiraz" /><MdText text={inhalt.texte.ursachenVonRisserscheinungenBruchmechani} /></h3>
                <p className="text-sm text-slate-700 mb-4 leading-relaxed"><MdText text={inhalt.texte.baustoffeVerändernIhrVolumen} /></p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1">
                    <span className="font-bold text-shiraz uppercase text-xs tracking-wide"><MdText text={inhalt.texte.t1SchwindenDinEn} /></span>
                    <p className="text-slate-700 text-xs leading-relaxed"><MdText text={inhalt.texte.gesamtschwinddehnungVarepsilonCsVarepsil} /></p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1">
                    <span className="font-bold text-shiraz uppercase text-xs tracking-wide"><MdText text={inhalt.texte.t2QuellenTreibreaktionen} /></span>
                    <p className="text-slate-700 text-xs leading-relaxed"><MdText text={inhalt.texte.volumenzunahmeDurchChemischeKristallisat} /></p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1">
                    <span className="font-bold text-shiraz uppercase text-xs tracking-wide"><MdText text={inhalt.texte.t3Baugrundsetzung} /></span>
                    <p className="text-slate-700 text-xs leading-relaxed"><MdText text={inhalt.texte.differenzielleSetzungenDeltaS} /></p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1">
                    <span className="font-bold text-shiraz uppercase text-xs tracking-wide"><MdText text={inhalt.texte.t4Temperaturzwang} /></span>
                    <p className="text-slate-700 text-xs leading-relaxed"><MdText text={inhalt.texte.dehnungDeltaLAlpha} /></p>
                  </div>
                </div>

                {/* Lineare Elastische Bruchmechanik (LEBM) Box */}
                <div className="mt-4 bg-white p-4 rounded-xl border border-home-grau/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs text-slate-950 flex items-center gap-1.5 font-bold"><MdText text={inhalt.texte.bruchmechanischeRissfortschrittsbedingun} /></strong>
                    <span className="text-[11px] font-mono text-shiraz bg-rose-50 px-2 py-0.5 rounded border border-shiraz/20 font-semibold">
                      K_I ≥ K_Ic
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.beiVorhandenenMikrorissenOder} /></p>
                  <div className="bg-[#FCFAF7] border border-home-grau/20 p-2.5 rounded-lg text-xs font-mono text-center">
                    <BlockMath math="K_I = Y \cdot \sigma \cdot \sqrt{\pi \cdot a} \quad \ge \quad K_{Ic} \quad \Longrightarrow \quad \text{Instabiler Gewaltbruch ohne plastische Vorwarnung}" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                    <div><strong className="text-slate-800">Spannung <InlineMath math="\sigma" />:</strong><MdText text={inhalt.texte.nennspannungImQuerschnitt} /></div>
                    <div><strong className="text-slate-800">Risslänge <InlineMath math="a" />:</strong><MdText text={inhalt.texte.tiefeDesAnrissesKerbe} /></div>
                    <div><strong className="text-slate-800"><MdText text={inhalt.texte.bruchzähigkeitKIc} /></strong><MdText text={inhalt.texte.werkstoffkennwertTemperaturabhängig} /></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900"><MdText text={inhalt.texte.einteilungNachRissbreitePraxisübliche} /></h4>
                  <table className="w-full text-sm text-slate-800 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-home-grau/30 text-left">
                        <th className="p-2">Rissbreite <InlineMath math="w_r" /></th>
                        <th className="p-2">Bedeutung</th>
                        <th className="p-2">Maßnahmenrelevanz</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-home-grau/30">
                        <td className="p-2 font-mono text-slate-700">&lt; 0,1 mm</td>
                        <td className="p-2">Haarrisse</td>
                        <td className="p-2"><MdText text={inhalt.texte.meistUnkritischKosmetischWasserunwirksam} /></td>
                      </tr>
                      <tr className="border-b border-home-grau/30">
                        <td className="p-2 font-mono text-shiraz"><MdText text={inhalt.texte.t0103} /></td>
                        <td className="p-2">Feine Risse</td>
                        <td className="p-2"><MdText text={inhalt.texte.imAußenbereichWegenFrostgefahr} /></td>
                      </tr>
                      <tr className="border-b border-home-grau/30">
                        <td className="p-2 font-mono text-shiraz font-semibold">0,3 - 1,0 mm</td>
                        <td className="p-2">Konstruktionsrisse</td>
                        <td className="p-2"><MdText text={inhalt.texte.statischKonstruktiveUrsachenprüfungZwing} /></td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-shiraz font-bold">&gt; 1,0 mm</td>
                        <td className="p-2 font-bold"><MdText text={inhalt.texte.gefügerisseKlaffendeRisse} /></td>
                        <td className="p-2 text-shiraz font-bold"><MdText text={inhalt.texte.ursacheUndTragwirkungUmgehend} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900"><MdText text={inhalt.texte.überwachungSanierungsbündnisse} /></h4>
                  <div className="space-y-3 text-sm text-slate-800 leading-relaxed">
                    <p><MdText text={inhalt.texte.rissgipsmarkeKlassikerÜberDem} /></p>
                    <p><MdText text={inhalt.texte.rissbreitenlinealTransparenteKarteMit} /></p>
                    <div className="p-3 bg-white rounded border border-home-grau/30 text-sm"><MdText text={inhalt.texte.sanierungsmethodikBeiRuhendemRiss} /></div>
                  </div>
                </div>
              </div>

              {/* TECHNOLOGICAL REHABILITATION: RISSVERPRESSUNG & CARBONLAMELLEN */}
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-6">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 border-b border-home-grau/20 pb-2"><MdText text={inhalt.texte.bauphysikalischeErtüchtigungRissverpress} /></h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Teil 1: Rissinjektion / Rissverpressung */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/25 space-y-3">
                      <h4 className="font-bold text-sm text-shiraz flex items-center gap-2"><MdText text={inhalt.texte.t1RissinjektionRissverpressungDin} /></h4>
                      <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.dieRissinjektionHatZum} /></p>

                      {/* Spaltströmung (ebener Spalt) */}
                      <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs my-2">
                        <strong className="block text-slate-900 mb-1"><MdText text={inhalt.texte.durchflussImRissLaminare} /></strong>
                        <p className="text-[11px] text-slate-500 leading-tight mb-2"><MdText text={inhalt.texte.derVolumenstromQDes} /></p>
                        <BlockMath math="Q = \frac{w^3 \cdot b \cdot \Delta p}{12 \cdot \eta \cdot L}" />
                        <span className="text-[10px] text-slate-500 block mt-1"><MdText text={inhalt.texte.dasBedeutetBeiEiner} /></span>
                      </div>

                      {/* Tabelle Wirkungsarten */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-white border-b border-home-grau/30 text-slate-700 font-bold">
                              <th className="p-1.5"><MdText text={inhalt.texte.füllstoffKürzel} /></th>
                              <th className="p-1.5">Eigenschaft</th>
                              <th className="p-1.5"><MdText text={inhalt.texte.zweckAnwendung} /></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            <tr>
                              <td className="p-1.5 font-bold font-mono text-shiraz"><MdText text={inhalt.texte.epoxidharzEp} /></td>
                              <td className="p-1.5 text-slate-600"><MdText text={inhalt.texte.sehrHoheZugDruckfestigkeit} /></td>
                              <td className="p-1.5"><MdText text={inhalt.texte.kraftschlüssigesVerbindenRuhenderTrocken} /></td>
                            </tr>
                            <tr>
                              <td className="p-1.5 font-bold font-mono text-shiraz"><MdText text={inhalt.texte.polyurethanPur} /></td>
                              <td className="p-1.5 text-slate-600"><MdText text={inhalt.texte.elastischSchäumtBeiWasserkontakt} /></td>
                              <td className="p-1.5"><MdText text={inhalt.texte.begrenztDehnfähigesVerbindenBzw} /></td>
                            </tr>
                            <tr>
                              <td className="p-1.5 font-bold font-mono text-shiraz"><MdText text={inhalt.texte.zementsuspensZs} /></td>
                              <td className="p-1.5 text-slate-600"><MdText text={inhalt.texte.mineralischStarrFüllstark} /></td>
                              <td className="p-1.5"><MdText text={inhalt.texte.füllenBreiterRisse0} /></td>
                            </tr>
                            <tr>
                              <td className="p-1.5 font-bold font-mono text-shiraz"><MdText text={inhalt.texte.acrylatgelGel} /></td>
                              <td className="p-1.5 text-slate-600"><MdText text={inhalt.texte.extremDünnflüssigQuellfähig} /></td>
                              <td className="p-1.5"><MdText text={inhalt.texte.schleierinjektionHintergelfüllung} /></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Ausführungsschritte */}
                      <div className="border-t border-home-grau/20 pt-2 mt-2">
                        <strong className="text-xs text-slate-800 block mb-1"><MdText text={inhalt.texte.verfahrensschritteDerRissinjektionHochdr} /></strong>
                        <ol className="list-decimal pl-4 text-[11px] text-slate-600 space-y-1">
                          <li><MdText text={inhalt.texte.reinigungVorbereitungRissflankenMechanis} /></li>
                          <li><MdText text={inhalt.texte.packerbohrungBohrenVonBohrkanälen} /></li>
                          <li><MdText text={inhalt.texte.setzenDerPackerEinschrauben} /></li>
                          <li><MdText text={inhalt.texte.verdämmungRissspaltAnDer} /></li>
                          <li><MdText text={inhalt.texte.injektionEinspritzenVonUnten} /></li>
                          <li><MdText text={inhalt.texte.nachbereitungNachAushärtungPacker} /></li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Teil 2: Ertüchtigung mittels Carbonlamellen */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/25 space-y-3">
                      <h4 className="font-bold text-sm text-shiraz flex items-center gap-2"><MdText text={inhalt.texte.t2TragwerksverstärkungMitCfk} /></h4>
                      <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.wennDieBiegeOder} /></p>

                      {/* Verbundnachweis Formel */}
                      <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs my-2">
                        <strong className="block text-slate-900 mb-1"><MdText text={inhalt.texte.verbundnachweisAmLamellenendeEndveranker} /></strong>
                        <p className="text-[11px] text-slate-500 leading-tight mb-2"><MdText text={inhalt.texte.umEinSchlagartigesAbplatzen} /></p>
                        <BlockMath math="\tau_{bd} \propto k_b \cdot \sqrt{f_{cm} \cdot f_{ctm}}" />
                        <span className="text-[10px] text-slate-500 block mt-1"><MdText text={inhalt.texte.hierbeiIstKB} /></span>
                      </div>

                      {/* Technische Merkmale von Carbonfaser CFK */}
                      <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs text-slate-700 space-y-2">
                        <strong className="text-xs text-slate-950 block"><MdText text={inhalt.texte.sehrGuteMaterialeigenschaftenVorteile} /></strong>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                          <div>
                            <span className="text-slate-400 block">Zug-E-Modul:</span>
                            <strong className="text-slate-800 font-mono"><MdText text={inhalt.texte.t165000210000} /></strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Zugfestigkeit:</span>
                            <strong className="text-slate-800 font-mono"><MdText text={inhalt.texte.t25003000} /></strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Eigengewicht:</span>
                            <strong className="text-slate-800"><MdText text={inhalt.texte.extremGering16} /></strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Korrosion:</span>
                            <strong className="text-emerald-700"><MdText text={inhalt.texte.t100Korrosionsbeständig} /></strong>
                          </div>
                        </div>
                      </div>

                      {/* Einbau & Konstruktive Regeln */}
                      <div className="border-t border-home-grau/20 pt-2 mt-2">
                        <strong className="text-xs text-slate-800 block mb-1"><MdText text={inhalt.texte.arbeitsverfahrenZurCfkLamellenverstärkun} /></strong>
                        <ol className="list-decimal pl-4 text-[11px] text-slate-600 space-y-1">
                          <li><MdText text={inhalt.texte.untergrundprüfungZwingendPrüfungDer} /></li>
                          <li><MdText text={inhalt.texte.vorbereitungKugelstrahlenSchleifenDie} /></li>
                          <li><MdText text={inhalt.texte.applikationEpoxidkleberAuftragEines} /></li>
                          <li><MdText text={inhalt.texte.andrückenDerLamelleLamelle} /></li>
                          <li><MdText text={inhalt.texte.sicherungBrandschutzBeiBrandbeanspruchun} /></li>
                        </ol>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Didaktische Zusammenfassung */}
                <div className="p-3.5 bg-rose-50/40 border border-shiraz/20 rounded-xl text-xs text-slate-800 leading-relaxed space-y-1.5">
                  <span className="font-bold text-shiraz block"><MdText text={inhalt.texte.ingenieurtechnischerVergleichRissinjekti} /></span>
                  <p><MdText text={inhalt.texte.währendDieRissverpressungDie} /></p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Bewehrungskorrosion & Betonschäden */}
          {activeSubTab === 'korrosion' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Carbonatisierung */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.karbonatisierungPassivierungsverlust} /></h3>
                  <div className="space-y-2.5 text-sm text-slate-800 leading-relaxed">
                    <p><MdText text={inhalt.texte.stahlImUnbeschädigtenBeton} /></p>
                    <p><MdText text={inhalt.texte.karbonatisierungsfrontWurzelTGesetz} /></p>
                    <div className="bg-white border border-home-grau/25 p-2.5 rounded-lg text-xs leading-relaxed text-slate-800 text-center my-1.5 font-mono">
                      <BlockMath math="\text{Ca(OH)}_2 + \text{CO}_2 \longrightarrow \text{CaCO}_3 \downarrow + \text{H}_2\text{O} \quad (\text{pH sinkt auf } \le 8{,}5)" />
                    </div>
                    <div className="bg-[#FCFAF7] border border-home-grau/20 p-2.5 rounded-lg text-xs text-slate-700">
                      <span className="font-semibold block text-slate-900 mb-0.5"><MdText text={inhalt.texte.fortschrittNachDemT} /></span>
                      <BlockMath math="x_c(t) = k_{\text{carb}} \cdot \sqrt{t}" />
                      <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.dabeiIstKText} /></span>
                    </div>
                    <p className="text-xs text-slate-700"><MdText text={inhalt.texte.rostexpansionDieEisenoxidhydrateText} /></p>
                  </div>
                </div>

                {/* Lochfrasskorrosion durch Chloride */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.chlorideintragLochfraßkorrosionPitting} /></h3>
                  <div className="space-y-2.5 text-sm text-slate-800 leading-relaxed">
                    <p><MdText text={inhalt.texte.ausgelöstDurchDeIcing} /></p>
                    <p><MdText text={inhalt.texte.katalytischeAutokatalyseFreieChlorid} /></p>
                    <div className="bg-white border border-home-grau/25 p-2.5 rounded-lg text-xs leading-relaxed text-slate-800 text-center my-1.5 font-mono">
                      <BlockMath math="\text{Fe} + 2\,\text{Cl}^- \longrightarrow \text{FeCl}_2 + 2\,e^- \quad \xrightarrow{+\text{H}_2\text{O}} \quad \text{Fe(OH)}_2 + 2\,\text{H}^+ + 2\,\text{Cl}^-" />
                    </div>
                    <div className="bg-rose-50/50 p-2.5 rounded-lg border border-shiraz/25 text-xs text-slate-800 leading-relaxed"><MdText text={inhalt.texte.korrosionsauslösenderChloridgehaltAnhalt} /><BlockMath math="c_{\text{krit}} \approx 0{,}5\,\% \text{ Cl}^- \text{ bezogen auf Zementmasse}" />
                      <span className="text-[10px] text-slate-600 block mt-0.5"><MdText text={inhalt.texte.wederEc2NochDin} /></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spannungsrisskorrosion (SpRK) & AKR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SpRK */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.wasserstoffinduzierteSpannungsrisskorros} /></h3>
                  <div className="space-y-2 text-xs leading-relaxed text-slate-800">
                    <p><MdText text={inhalt.texte.gefürchtetsterSchadensmechanismusImSpann} /></p>
                    <p><MdText text={inhalt.texte.voraussetzungenSchadensTrias} /></p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      <li><MdText text={inhalt.texte.werkstoffHöchstzugfesterSpannungsempfind} /></li>
                      <li><MdText text={inhalt.texte.mechanischeSpannungHoheStatische} /></li>
                      <li><MdText text={inhalt.texte.elektrochemischesMilieuUnvollständigeHül} /></li>
                    </ul>
                    <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 font-mono text-center my-1 text-[11px]">
                      <BlockMath math="\text{H}^+ + e^- \longrightarrow \text{H}_{\text{ad}} \quad \longrightarrow \quad \text{H}_{\text{abs}} \text{ (Diffundiert ins Stahlgitter)}" />
                    </div>
                    <p className="text-slate-600 text-[11px]"><MdText text={inhalt.texte.atomarerWasserstoffSammeltSich} /></p>
                  </div>
                </div>

                {/* AKR */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <span className="w-2.5 h-2.5 bg-shiraz rounded-full"></span><MdText text={inhalt.texte.alkaliKieselsäureReaktionAkr} /></h3>
                  <div className="space-y-2 text-xs leading-relaxed text-slate-800">
                    <p><MdText text={inhalt.texte.chemischerZerstörungsmechanismusInMassiv} /></p>
                    <p><MdText text={inhalt.texte.reaktionsablaufAlkalihydroxideTextNa} /></p>
                    <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 font-mono text-center my-1 text-[11px]">
                      <BlockMath math="\equiv\!\text{Si-O-Si}\!\equiv \;+\; 2\,\text{OH}^- \longrightarrow 2\,(\equiv\!\text{Si-O}^-) + \text{H}_2\text{O}" />
                    </div>
                    <p className="text-slate-700"><MdText text={inhalt.texte.dasEntstehendeAlkaliSilikat} /></p>
                    <div className="bg-[#FCFAF7] p-2 rounded border border-home-grau/25 text-[11px] text-slate-600"><MdText text={inhalt.texte.präventionDafstbAlkaliRichtlinie} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Unverträglichkeiten (Materialunverträglichkeiten) */}
          {activeSubTab === 'unvertraeglichkeiten' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
                <p className="text-sm text-shiraz font-semibold leading-relaxed"><MdText text={inhalt.texte.definitionChemischeOderElektrochemische} /></p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Gipstreiben / Ettringit */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-shiraz flex items-center gap-1.5 border-b border-home-grau/30 pb-1.5"><MdText text={inhalt.texte.gipshaltigeStoffeInZement} /></h3>
                    <p className="text-xs text-slate-800 leading-relaxed"><MdText text={inhalt.texte.wirdGipsCalciumsulfatDihydrat} /></p>
                    <div className="bg-white p-2.5 rounded border border-home-grau/25 text-xs font-mono">
                      <span className="font-bold text-slate-900 block text-[11px] mb-1"><MdText text={inhalt.texte.sekundäreEttringitbildungVolumenzunahme1} /></span>
                      <BlockMath math="\text{C}_3\text{A}\cdot\text{CaSO}_4\cdot 12\,\text{H}_2\text{O} + 2\,\text{Ca}^{2+} + 2\,\text{SO}_4^{2-} + 20\,\text{H}_2\text{O} \longrightarrow \text{C}_3\text{A}\cdot 3\,\text{CaSO}_4\cdot 32\,\text{H}_2\text{O}" />
                      <span className="text-[10px] text-slate-600 font-sans block mt-1"><MdText text={inhalt.texte.nadelförmigeEttringitkristalleTextAft} /></span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs bg-rose-50/50 text-slate-900 p-2.5 rounded border border-shiraz/25 font-semibold"><MdText text={inhalt.texte.praxisRegelPutzDin} /></div>
                </div>

                {/* 2. Kontaktkorrosion */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-shiraz flex items-center gap-1.5 border-b border-home-grau/30 pb-1.5"><MdText text={inhalt.texte.galvanischeKontaktkorrosionDinEn} /></h3>
                    <p className="text-xs text-slate-800 leading-relaxed"><MdText text={inhalt.texte.kommenZweiMetalleMit} /></p>
                    <div className="bg-white p-2.5 rounded border border-home-grau/25 text-xs">
                      <span className="font-semibold block text-slate-900 text-[11px] mb-1"><MdText text={inhalt.texte.spannungsreiheImBauwesenStandardpotentia} /></span>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-700">
                        <div>Aluminium: <InlineMath math="E^0 = -1{,}66\,\text{V}" /></div>
                        <div>Zink: <InlineMath math="E^0 = -0{,}76\,\text{V}" /></div>
                        <div><MdText text={inhalt.texte.baustahlFeE0} /></div>
                        <div>Kupfer: <InlineMath math="E^0 = +0{,}34\,\text{V}" /></div>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.zellspannungDeltaEE} /></div>
                    </div>
                    <p className="text-[11px] text-slate-700 italic leading-relaxed"><MdText text={inhalt.texte.dieFließregelAmBau} /></p>
                  </div>
                  <div className="mt-3 text-xs bg-white text-slate-800 p-2.5 rounded border border-home-grau/30 font-semibold"><MdText text={inhalt.texte.praxisRegelMetalleElektrisch} /></div>
                </div>

                {/* 3. Holzinhaltsstoffe */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-shiraz flex items-center gap-1.5 border-b border-home-grau/30 pb-1.5"><MdText text={inhalt.texte.holzinhaltsstoffeGerbsäurenTannineIm} /></h3>
                    <p className="text-xs text-slate-800 leading-relaxed"><MdText text={inhalt.texte.eichenEdelkastanienRobinienUnd} /></p>
                    <div className="bg-white p-2.5 rounded border border-home-grau/25 text-xs text-slate-700 space-y-1">
                      <p><MdText text={inhalt.texte.chemischeReaktionGelösteEisenionen} /></p>
                      <p><MdText text={inhalt.texte.konstruktiveSchädenNebenBleibenden} /></p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs bg-white text-slate-800 p-2.5 rounded border border-home-grau/30 font-semibold"><MdText text={inhalt.texte.praxisRegelDinEn} /></div>
                </div>

                {/* 4. Weichmacher-Migration */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-shiraz flex items-center gap-1.5 border-b border-home-grau/30 pb-1.5"><MdText text={inhalt.texte.weichmacherMigrationKunststoffVs} /></h3>
                    <p className="text-xs text-slate-800 leading-relaxed"><MdText text={inhalt.texte.phänomenDesStofftransportsNiedermolekula} /></p>
                    <div className="bg-white p-2.5 rounded border border-home-grau/25 text-xs text-slate-750 space-y-1">
                      <p><MdText text={inhalt.texte.versprödungDerDichtungsbahnDurch} /></p>
                      <p><MdText text={inhalt.texte.lösungseffektImGegenzugQuillt} /></p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs bg-white text-slate-800 p-2.5 rounded border border-home-grau/30 font-semibold"><MdText text={inhalt.texte.praxisRegelDin18531} /></div>
                </div>

              </div>
            </div>
          )}

          {/* Tab 5: Tief- & Ingenieurbau */}
          {activeSubTab === 'tief_ingenieurbau' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Ingenieurbau (Brücken & Tunnel) */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.ingenieurbauBrückenTunnelDin} /></h3>
                  
                  <div className="space-y-3.5 text-sm text-slate-800 leading-relaxed">
                    <div>
                      <strong className="block text-slate-900"><MdText text={inhalt.texte.t1ChloridInduzierteLochfraßkorrosion} /></strong>
                      <p className="mt-0.5 text-slate-700 text-xs"><MdText text={inhalt.texte.infolgeUndichterFahrbahnübergängeOder} /></p>
                    </div>

                    <div>
                      <strong className="block text-slate-900"><MdText text={inhalt.texte.t2KappenAbplatzungenFrost} /></strong>
                      <p className="mt-0.5 text-slate-700 text-xs"><MdText text={inhalt.texte.brückenkappenUnterliegenFrostTau} /></p>
                      <div className="bg-white p-2 rounded border border-home-grau/25 text-xs font-mono my-1">
                        <BlockMath math="L \le 0{,}20\,\text{mm} \quad \text{und Luftgehalt im Frischbeton } \ge 4{,}0\text{--}5{,}5\,\% \quad \Longrightarrow \text{ Frost-Tausalz-Beständigkeit}" />
                      </div>
                    </div>

                    <div>
                      <strong className="block text-slate-900"><MdText text={inhalt.texte.t3SinterbildungBiogeneSchwefelsäurekorros} /></strong>
                      <p className="mt-0.5 text-slate-700 text-xs"><MdText text={inhalt.texte.kalklösendesBergwasserReagiertMit} /></p>
                    </div>
                  </div>
                </div>

                {/* Geotechnik & Tiefbau (Baugruben & Gründungen) */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.geotechnikBaugrubenGründungen} /></h3>

                  <div className="space-y-3.5 text-sm text-slate-800 leading-relaxed">
                    <div>
                      <strong className="block text-slate-900"><MdText text={inhalt.texte.t1HydrologischerHydraulischerGrundbruch} /></strong>
                      <p className="mt-0.5 text-slate-700 font-sans"><MdText text={inhalt.texte.wennDieNachOben} /></p>
                      <div className="mt-2 bg-white p-2.5 rounded border border-home-grau/30 text-xs">
                        <span className="font-semibold block mb-1 text-slate-800"><MdText text={inhalt.texte.nachweisHydNachDin} /></span>
                        <BlockMath math="S_{dst,k} \cdot \gamma_{H} \le G'_{stb,k} \cdot \gamma_{G,stb}" />
                        <span className="text-slate-500 block mt-1 leading-normal"><MdText text={inhalt.texte.strömungskraftSAusDem} /></span>
                      </div>
                    </div>

                    <div>
                      <strong className="block text-slate-900"><MdText text={inhalt.texte.t2PfahlkopfBohrpfahlerstellungsfehler} /></strong>
                      <p className="mt-0.5 text-slate-700"><MdText text={inhalt.texte.beimBetonierenVonTiefgründungen} /></p>
                      <div className="mt-2 bg-white p-2.5 rounded border border-home-grau/30 text-xs text-slate-500">
                        <strong className="text-slate-700 block"><MdText text={inhalt.texte.grenzzustandDerTragfähigkeitBohrpfahl} /></strong>
                        <BlockMath math="R_{c,d} = \frac{R_{b,k}}{\gamma_b} + \frac{R_{s,k}}{\gamma_s}" />
                        <span className="block mt-1 leading-normal"><MdText text={inhalt.texte.dabeiRepräsentiertRB} /></span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Diagnostik & Monitoring im Ingenieurbau */}
              <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.diagnostikZerstörungsfreiePrüfverfahrenZ} /></h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <strong className="text-shiraz block"><MdText text={inhalt.texte.potenzialfeldmessungHalfCell} /></strong>
                    <p className="text-slate-700 leading-relaxed text-xs"><MdText text={inhalt.texte.misstDieElektrochemischeSpannung} /></p>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <strong className="text-shiraz block">Ultraschall-Echoverfahren</strong>
                    <p className="text-slate-700 leading-relaxed text-xs"><MdText text={inhalt.texte.schallwellenWerdenEingeleitetUnd} /></p>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <strong className="text-shiraz block"><MdText text={inhalt.texte.brückenmonitoringNachDin1076} /></strong>
                    <p className="text-slate-700 leading-relaxed text-xs"><MdText text={inhalt.texte.überwachungDerIngenieurbauwerkeIm} /></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Kleb- & Dichtstoff-Schäden (aus „Recht & Grundlagen“ verschoben, 02.11.2026) */}
          {activeSubTab === 'kleb_dicht' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header Box mit Praxis-Relevanz */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/30 pb-3 mb-4">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Paperclip className="text-shiraz shrink-0" size={20} /><MdText text={inhalt.texte.klebUndDichtstoffePraxisleitfaden} /></h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-shiraz/10 text-shiraz border border-shiraz/20 self-start sm:self-auto"><MdText text={inhalt.texte.din18540DinEn} /></span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed"><MdText text={inhalt.texte.fugendichtstoffeUndBauklebstoffeGehören} /></p>
              </div>

              {/* Sektion 1: Anwendungstipps für die Baustellenpraxis */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                  <Lightbulb className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.t1AnwendungstippsFürEine} /></h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-shiraz border-b border-shiraz/10 pb-1.5 mb-2">
                        <CheckCircle2 size={15} /><MdText text={inhalt.texte.t1Untergrundprüfung} /></div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.trockenTragfähigTrennmittelfreiBeton} /></p>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 bg-off-white p-1.5 rounded border border-home-grau/20"><MdText text={inhalt.texte.tippAbreißtestGitterschnittVorab} /></div>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-shiraz border-b border-shiraz/10 pb-1.5 mb-2">
                        <CheckCircle2 size={15} /><MdText text={inhalt.texte.t2PrimerHaftbrücken} /></div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.systemgerechteVoranstrichePoröseMinerali} /></p>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 bg-off-white p-1.5 rounded border border-home-grau/20"><MdText text={inhalt.texte.ablüftezeiten530Min} /></div>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-shiraz border-b border-shiraz/10 pb-1.5 mb-2">
                        <CheckCircle2 size={15} /><MdText text={inhalt.texte.t3Fugendimensionierung} /></div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.geometrieZuordnungFugenbreiteDichtstoffd} /><span className="font-semibold"><MdText text={inhalt.texte.b10MmB} /></span>, <span className="font-semibold"><MdText text={inhalt.texte.b10MmB2} /></span><MdText text={inhalt.texte.zB20Mm} /></p>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 bg-off-white p-1.5 rounded border border-home-grau/20"><MdText text={inhalt.texte.verhindertUnzulässigeDehnungsspitzen} /></div>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-shiraz border-b border-shiraz/10 pb-1.5 mb-2">
                        <CheckCircle2 size={15} /><MdText text={inhalt.texte.t4HinterfüllungGlätten} /></div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.zweiflankenhaftungSichernGeschlossenzell} /></p>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 bg-off-white p-1.5 rounded border border-home-grau/20"><MdText text={inhalt.texte.keineScharfenWerkzeugeZum} /></div>
                  </div>
                </div>
              </div>

              {/* Sektion 2: Häufige Fehlerquellen */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                  <AlertTriangle className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.t2HäufigeFehlerquellenIn} /></h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-lg border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 border-b border-rose-100 pb-1.5 mb-2">
                        <XCircle size={16} /><MdText text={inhalt.texte.dreiflankenhaftungKlassischerKardinalfeh} /></div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.wirdDieFugeOhne} /></p>
                    </div>
                    <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-900 font-semibold"><MdText text={inhalt.texte.präventionPeRundschnurOder} /></div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 border-b border-rose-100 pb-1.5 mb-2">
                        <XCircle size={16} /><MdText text={inhalt.texte.taupunktunterschreitungFeuchtefilm} /></div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.applikationBeiHoherLuftfeuchte} /></p>
                    </div>
                    <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-900 font-semibold"><MdText text={inhalt.texte.präventionOberflächentemperaturMind3} /></div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 border-b border-rose-100 pb-1.5 mb-2">
                        <XCircle size={16} /><MdText text={inhalt.texte.falschePolymerwahlRandzonenverschmutzung} /></div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.verwendungVonStandardEssig} /></p>
                    </div>
                    <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-900 font-semibold"><MdText text={inhalt.texte.präventionNurWeichmacherfreieNatursteins} /></div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 border-b border-rose-100 pb-1.5 mb-2">
                        <XCircle size={16} /><MdText text={inhalt.texte.überschreitungDerOffenenZeit} /></div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.wirdDieDichtstofffugeNach} /></p>
                    </div>
                    <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-900 font-semibold"><MdText text={inhalt.texte.präventionNurMeterweiseVorgehen} /></div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 border-b border-rose-100 pb-1.5 mb-2">
                        <XCircle size={16} /><MdText text={inhalt.texte.hausmittelAlsGlättmittelSpülmittel} /></div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.verwendungHandelsüblicherGeschirrspülmit} /></p>
                    </div>
                    <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-900 font-semibold"><MdText text={inhalt.texte.präventionAusschließlichAbgestimmteSyste} /></div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 border-b border-rose-100 pb-1.5 mb-2">
                        <XCircle size={16} /><MdText text={inhalt.texte.unzureichendeFugenbreiteÜberdehnung} /></div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.fugenbreiteZuSchmalBemessen} /></p>
                    </div>
                    <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-900 font-semibold"><MdText text={inhalt.texte.präventionThermischeLängenänderungRechne} /></div>
                  </div>
                </div>
              </div>

              {/* Sektion 3: Alterungsmechanismen von Polymeren */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                  <Clock className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.t3AlterungsmechanismenChemischPhysikalisc} /></h3>
                <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.polymernetzwerkeVonDichtUnd} /></p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <span className="font-bold text-shiraz block text-xs"><MdText text={inhalt.texte.photooxidationUvStrahlung} /></span>
                    <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.kurzwelligeUvPhotonenSpalten} /></p>
                    <span className="text-[11px] text-slate-500 block"><MdText text={inhalt.texte.silikoneSiOBindung} /></span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <span className="font-bold text-shiraz block text-xs"><MdText text={inhalt.texte.hydrolytischerAbbauFeuchte} /></span>
                    <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.permanenteWassereinwirkungSpaltetHydroly} /></p>
                    <span className="text-[11px] text-slate-500 block"><MdText text={inhalt.texte.kritischBeiStehendemWasser} /></span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <span className="font-bold text-shiraz block text-xs"><MdText text={inhalt.texte.weichmacherMigrationVerflüchtigung} /></span>
                    <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.niedermolekulareWeichmacherDiffundierenB} /></p>
                    <span className="text-[11px] text-slate-500 block"><MdText text={inhalt.texte.folgeMassiverVolumenschwundErhöhung} /></span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <span className="font-bold text-shiraz block text-xs"><MdText text={inhalt.texte.mikrobiellerBefallSchimmelbildung} /></span>
                    <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.inFeuchträumenNutzenPilzsporen} /></p>
                    <span className="text-[11px] text-slate-500 block"><MdText text={inhalt.texte.fungizideZusätzeWerdenMit} /></span>
                  </div>
                </div>
              </div>

              {/* Sektion 4: Typische Schadensbilder & Diagnostik */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                  <FileWarning className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.t4TypischeSchadensbilderIm} /></h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Schadensbild 1 */}
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
                        <span className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.flankenabrissAdhäsionsbruch} /></span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800"><MdText text={inhalt.texte.häufigstesSchadensbild} /></span>
                      </div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.erscheinungsbildDerDichtstoffstrangLöst} /></p>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.hauptursachenFehlenderOderUngeeigneter} /></p>
                    </div>
                    <div className="mt-3 p-2 bg-off-white rounded border border-home-grau/30 text-[11px] text-slate-800"><MdText text={inhalt.texte.sanierungKomplettHerausschneidenFlanken} /></div>
                  </div>

                  {/* Schadensbild 2 */}
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
                        <span className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.kohäsionsbruchMittenrissMaterialriss} /></span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          häufig
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.erscheinungsbildLängsrissMittigIm} /></p>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.hauptursachenFugeZuSchmal} /></p>
                    </div>
                    <div className="mt-3 p-2 bg-off-white rounded border border-home-grau/30 text-[11px] text-slate-800"><MdText text={inhalt.texte.sanierungRechnerischeFugenbreitePrüfen} /></div>
                  </div>

                  {/* Schadensbild 3 */}
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
                        <span className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.blasenbildungAufschäumen} /></span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800"><MdText text={inhalt.texte.polyurethan2k} /></span>
                      </div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.erscheinungsbildSichtbarePorenBlasen} /></p>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.hauptursachenFeuchtigkeitImMineralischen} /><span className="font-mono"><MdText text={inhalt.texte.rNcoHO} /></span><MdText text={inhalt.texte.starkeSonneneinstrahlungBeiFrischer} /></p>
                    </div>
                    <div className="mt-3 p-2 bg-off-white rounded border border-home-grau/30 text-[11px] text-slate-800"><MdText text={inhalt.texte.sanierungAufgeschäumtesMaterialVollständ} /></div>
                  </div>

                  {/* Schadensbild 4 */}
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
                        <span className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.randzonenverschmutzungVerfärbung} /></span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800"><MdText text={inhalt.texte.natursteinFassade} /></span>
                      </div>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.erscheinungsbildDunkleFeuchtWirkende} /></p>
                      <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.hauptursachenNichtWeichmacherfreieSiliko} /></p>
                    </div>
                    <div className="mt-3 p-2 bg-off-white rounded border border-home-grau/30 text-[11px] text-slate-800"><MdText text={inhalt.texte.sanierungMeistIrreparabelChemische} /></div>
                  </div>
                </div>

                {/* Wartungsfugen-Rechtshinweis */}
                <div className="bg-rose-50/40 border border-shiraz/25 p-4 rounded-xl flex gap-3 text-xs text-slate-800 leading-relaxed mt-2">
                  <AlertTriangle className="text-shiraz shrink-0 mt-0.5" size={18} />
                  <div>
                    <strong className="font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.juristischerHinweisNachDin} /></strong>
                    <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.häufigDeklarierenVerarbeiterSilikonfugen} /></p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Tab 7: Interaktiver Bau-Szenarien-Analysator */}
          {activeSubTab === 'analysator' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-50 border border-home-grau/30 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4 border-b border-home-grau/30 pb-3">
                  <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg"><Lightbulb size={18} /></span>
                  <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.interaktiverBauSzenarienAnalysator} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.entdeckenSieTypischeBauschäden} /></p>
        </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Selector List */}
                  <AuswahlGruppe label="Schadensszenario" className="lg:col-span-5 flex flex-col gap-2">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1 block"><MdText text={inhalt.texte.wählenSieEinenFall} /></span>
                    {scenarios.map((scen) => (
                      <button {...alsOption(selectedScenario === scen.id)}
                        key={scen.id}
                        onClick={() => setSelectedScenario(scen.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm flex justify-between items-center gap-2 ${
                          selectedScenario === scen.id
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white border-home-grau/30 hover:bg-slate-100 text-slate-850'
                        }`}
                      >
                        <div className="flex flex-col gap-1 min-w-0 pr-2">
                          <span className={`text-xs uppercase font-bold tracking-wider ${selectedScenario === scen.id ? 'text-white/85' : 'text-shiraz'}`}>{scen.category}</span>
                          <span className="font-bold truncate">{scen.title}</span>
                        </div>
                        <ChevronRight size={14} className="shrink-0" />
                      </button>
                    ))}
                  </AuswahlGruppe>

                  {/* Detail Output Container */}
                  <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col justify-center">
                    {selectedScenario ? (
                      (() => {
                        const activeVal = scenarios.find(s => s.id === selectedScenario)!;
                        return (
                          <div className="space-y-4 animate-in fade-in duration-300">
                            <div>
                              <span className="text-sm font-bold text-shiraz uppercase tracking-widest">{activeVal.category}</span>
                              <h4 className="font-bold text-base text-slate-900 leading-tight mt-0.5">{activeVal.title}</h4>
                            </div>

                            <div className="text-sm text-slate-800 bg-slate-50 p-3.5 rounded-lg border border-home-grau/30 leading-relaxed italic">
                              "{activeVal.description}"
                            </div>

                            <div className="grid grid-cols-1 gap-3.5 text-sm text-slate-800 leading-relaxed font-normal">
                              <div>
                                <span className="font-semibold text-slate-900 block border-b pb-1"><MdText text={inhalt.texte.juristischerStatusRelevanz} /></span>
                                <span className="text-slate-700 block mt-1">{activeVal.status}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-shiraz block border-b pb-1"><MdText text={inhalt.texte.verantwortlicherBauakteur} /></span>
                                <span className="text-slate-700 block mt-1">{activeVal.responsibility}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 block border-b pb-1"><MdText text={inhalt.texte.zuständigeBauVersicherungsdeckung} /></span>
                                <span className="text-slate-700 block mt-1">{activeVal.insurance}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 block border-b pb-1"><MdText text={inhalt.texte.technischeSanierungsmethode} /></span>
                                <span className="text-slate-700 block mt-1">{activeVal.remedy}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-center py-8 text-slate-400 flex flex-col items-center justify-center gap-2">
                        <HelpCircle size={36} className="text-slate-300 animate-bounce" />
                        <span className="font-bold text-sm text-slate-900"><MdText text={inhalt.texte.keinSchadenSzenarioAusgewählt} /></span>
                        <p className="text-sm text-slate-500 max-w-xs leading-relaxed"><MdText text={inhalt.texte.wählenSieLinksEines} /></p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1RechnerischeRissbreite}
        zielGleichung="w_k = s_{r,max} \cdot (\varepsilon_{sm} - \varepsilon_{cm})"
        schritte={inhalt.daten["TypischeBauschaeden.schritte"]}
        ergebnisHinweis={inhalt.werte.gemesseneRisseImBestand}
        normQuelle={inhalt.werte.dinEn19921}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2KritischeRisslänge}
        zielGleichung="a_c = \frac{1}{\pi}\left(\frac{K_{Ic}}{Y \cdot \sigma}\right)^2"
        schritte={inhalt.daten["TypischeBauschaeden.schritte_2"]}
        ergebnisHinweis={inhalt.werte.beiTiefenTemperaturenSinkt}
        normQuelle={inhalt.werte.irwin1957Iso12135}
      />

      <FormulaDerivationBox
        title={inhalt.werte.beispiel3MindestbreiteEiner}
        zielGleichung="b_{erf} = \frac{L \cdot \alpha_T \cdot \Delta T}{ZGV}"
        schritte={inhalt.daten["TypischeBauschaeden.schritte_3"]}
        ergebnisHinweis={inhalt.werte.zuSchmaleFugenÜberdehnen}
        normQuelle={inhalt.werte.din18540DinEn}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="schadensbilder" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap11}
        weblinks={inhalt.daten["TypischeBauschaeden.weblinks"]} 
        wikipedia={[
          { title: "Bauschaden", url: "https://de.wikipedia.org/wiki/Bauschaden" },
          { title: "Ettringit", url: "https://de.wikipedia.org/wiki/Ettringit" },
          { title: "Alkali-Kieselsäure-Reaktion", url: "https://de.wikipedia.org/wiki/Alkali-Kiesels%C3%A4ure-Reaktion" },
          { title: "Bimetallkorrosion", url: "https://de.wikipedia.org/wiki/Bimetallkorrosion" },
          { title: "Spannungsrisskorrosion", url: "https://de.wikipedia.org/wiki/Spannungsrisskorrosion" },
          { title: "Dichtstoff", url: "https://de.wikipedia.org/wiki/Dichtstoff" },
          { title: "Klebstoff", url: "https://de.wikipedia.org/wiki/Klebstoff" }
        ]} 
        literatur={inhalt.daten["TypischeBauschaeden.literatur"]} 
        regelwerke={inhalt.daten["TypischeBauschaeden.regelwerke"]} 
        formeln={inhalt.daten["TypischeBauschaeden.formeln"]} 
      />
    </div>
  );
}
