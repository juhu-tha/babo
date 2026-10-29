import React, { useState } from 'react';
import { AlertTriangle, Search, FileText, Info, Sliders, Calculator, Award, Plus, Minus, BookOpen, ClipboardCheck, ShieldCheck } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import inhalt from '@/content/zustandsbewertung/Zustandsbewertung.json';
import { zustandsnote, schulnoteAusZustandsnote } from '@/src/calc/schutzInstandsetzung';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { ReiterLeiste, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

const SCHADEN_KATEGORIEN = [
  { id: 'all', label: inhalt.werte.alleKategorien },
  { id: 'beton', label: 'Betonbau' },
  { id: 'stahl', label: 'Stahlbau' },
  { id: 'holz', label: 'Holzbau' },
  { id: 'mauerwerk', label: 'Mauerwerk' }
];

const SCHAEDEN = inhalt.daten.SCHAEDEN;

type ZustandReiter = 'din1076' | 'vdi6200' | 'rechner';
const REITER: readonly ModulTab<ZustandReiter>[] = [
  { id: 'din1076', label: inhalt.texte.din1076BrückenIngenieurbauten.trim(), icon: BookOpen },
  { id: 'vdi6200', label: inhalt.texte.vdi6200StandsicherheitIm.trim(), icon: AlertTriangle },
  { id: 'rechner', label: inhalt.texte.notenrechnerKonverter.trim(), icon: Calculator },
];

export default function Zustandsbewertung() {
  const [activeTab, setActiveTab] = useState<ZustandReiter>('din1076');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [calculatorTab, setCalculatorTab] = useState<'quick' | 'matrix'>('quick');
  const [zustandsnoteInput, setZustandsnoteInput] = useState<number>(2.2);
  const [sScore, setSScore] = useState<number>(2);
  const [vScore, setVScore] = useState<number>(1);
  const [dScore, setDScore] = useState<number>(3);
  const [additionalCount, setAdditionalCount] = useState<number>(1);

  const filteredSchaeden = SCHAEDEN.filter(s => {
    const matchesCategory = activeCategory === 'all' || s.kategorie === activeCategory;
    const matchesSearch = s.titel.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.beschreibung.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-6 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/30 [&>[role=tablist]]:pb-3">
      <div className="flex flex-col gap-6">
      {/* Querverweis (kein Reiter): öffnet das Untermodul „Typische Bauschäden“ */}
      <div className="flex justify-end -mt-3">
        <button type="button"
          className="px-3 py-1.5 font-bold text-xs flex items-center gap-2 text-home-grau hover:text-text-main cursor-pointer"
          onClick={() => { window.location.hash = 'schadensbilder'; }}
          title={inhalt.werte.öffnetDasUntermodulTypische}
        >
          <Search size={14} aria-hidden={true} /><MdText text={inhalt.texte.typischeBauschäden} /></button>
      </div>

      {/* TAB Content 1: DIN 1076 */}
      {activeTab === 'din1076' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-shiraz" size={28} />
              <h2 className="text-2xl font-bold text-text-main"><MdText text={inhalt.texte.überwachungPrüfungNachDin} /></h2>
            </div>
            <p className="text-text-main/80 mb-6 text-sm leading-relaxed"><MdText text={inhalt.texte.dieDeutscheNormDin} /></p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-shiraz text-white flex items-center justify-center font-bold text-sm">H</div>
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.hauptprüfungH} /></h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.alle6JahreEingehende} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-shiraz text-white flex items-center justify-center font-bold text-sm">E</div>
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.einfachePrüfungE} /></h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.t3JahreNachHauptprüfung} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-bold text-sm">B</div>
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.besichtigungB} /></h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.jährlichAußerImH} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-bold text-sm">L</div>
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.laufendeBeobachtungL} /></h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.inDerRegelZweimal} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">S</div>
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.sonderprüfungS} /></h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.anlassbezogenEingehendeBauwerksprüfungUn} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#7c3aed] text-white flex items-center justify-center font-bold text-sm">P</div>
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.prüfungVorAbnahmeVor} /></h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.jeweilsAlsHauptprüfungPrüfung} /></p>
              </div>
            </div>
          </div>

          {/* RI-EBW-PRÜF Zustandsnoten */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="font-bold text-lg text-text-main mb-4"><MdText text={inhalt.texte.bauwerksbewertungZustandsnotenNachRi} /></h3>
            <p className="text-sm text-text-main/80 mb-6"><MdText text={inhalt.texte.dieBewertungEinesIngenieurbauwerks} /></p>

            <div className="space-y-3">
              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="w-full md:w-32 bg-emerald-500 text-white font-mono font-bold text-center py-3 rounded-lg flex flex-col justify-center items-center shrink-0">
                  <span className="text-2xl">1,0–1,4</span>
                  <span className="text-xs uppercase font-bold tracking-wider">Sehr gut</span>
                </div>
                <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/15 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-main font-semibold leading-relaxed"><MdText text={inhalt.texte.dasBauwerksbauteilWeistKeine} /></p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="w-full md:w-32 bg-lime-500 text-text-main font-mono font-bold text-center py-3 rounded-lg flex flex-col justify-center items-center shrink-0">
                  <span className="text-2xl">1,5–1,9</span>
                  <span className="text-xs uppercase font-bold tracking-wider">Gut</span>
                </div>
                <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/15 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-main font-semibold leading-relaxed"><MdText text={inhalt.texte.geringeMängelVorhandenZ} /></p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="w-full md:w-32 bg-yellow-400 text-text-main font-mono font-bold text-center py-3 rounded-lg flex flex-col justify-center items-center shrink-0">
                  <span className="text-2xl">2,0–2,4</span>
                  <span className="text-xs uppercase font-bold tracking-wider">Befriedigend</span>
                </div>
                <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/15 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-main font-semibold leading-relaxed"><MdText text={inhalt.texte.mittlereMängelErkennbarZ} /></p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="w-full md:w-32 bg-orange-400 text-white font-mono font-bold text-center py-3 rounded-lg flex flex-col justify-center items-center shrink-0">
                  <span className="text-2xl">2,5–2,9</span>
                  <span className="text-xs uppercase font-bold tracking-wider">Ausreichend</span>
                </div>
                <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/15 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-main font-semibold leading-relaxed"><MdText text={inhalt.texte.größereMängelImEinzelnen} /></p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="w-full md:w-32 bg-orange-600 text-white font-mono font-bold text-center py-3 rounded-lg flex flex-col justify-center items-center shrink-0">
                  <span className="text-2xl">3,0–3,4</span>
                  <span className="text-xs uppercase font-bold tracking-wider"><MdText text={inhalt.texte.nichtAusreichend} /></span>
                </div>
                <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/15 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-main font-semibold leading-relaxed"><MdText text={inhalt.texte.schwereMängelBeeinträchtigenDas} /></p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="w-full md:w-32 bg-red-600 text-white font-mono font-bold text-center py-3 rounded-lg flex flex-col justify-center items-center shrink-0">
                  <span className="text-2xl">3,5–4,0</span>
                  <span className="text-xs uppercase font-bold tracking-wider">Ungenügend</span>
                </div>
                <div className="bg-off-white p-3.5 rounded-lg border border-home-grau/15 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-main font-semibold leading-relaxed"><MdText text={inhalt.texte.kritischerZustandSehrSchwere} /></p>
                </div>
              </div>
            </div>
          </div>

          {/* Neu: Einzelnoten (0-4) und Bewertungsschema */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="font-bold text-lg text-text-main mb-4 flex items-center gap-2">
              <ClipboardCheck className="text-shiraz" size={22} /><MdText text={inhalt.texte.mängelEinzelnoten04} /></h3>
            <p className="text-sm text-text-main/80 mb-6 leading-relaxed"><MdText text={inhalt.texte.nachRiEbwPrüf} /></p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold font-mono text-xs">0</span>
                  <h4 className="font-extrabold text-emerald-800 text-xs">Unbedeutend</h4>
                </div>
                <p className="text-xs text-emerald-950/80 leading-relaxed"><MdText text={inhalt.texte.keinOderNurEin} /></p>
                <div className="text-xs text-emerald-700 italic mt-1.5 font-semibold"><MdText text={inhalt.texte.maßnahmeKeineNötig} /></div>
              </div>

              <div className="p-3.5 bg-lime-50 rounded-xl border border-lime-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-6 h-6 rounded-full bg-lime-500 text-text-main flex items-center justify-center font-bold font-mono text-xs">1</span>
                  <h4 className="font-extrabold text-lime-800 text-xs"><MdText text={inhalt.texte.geringerMangel} /></h4>
                </div>
                <p className="text-xs text-lime-900/80 leading-relaxed"><MdText text={inhalt.texte.kleinererLokalerMangelKeine} /></p>
                <div className="text-xs text-lime-700 italic mt-1.5 font-semibold"><MdText text={inhalt.texte.maßnahmeLaufendeBeobachtung} /></div>
              </div>

              <div className="p-3.5 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-6 h-6 rounded-full bg-yellow-400 text-text-main flex items-center justify-center font-bold font-mono text-xs">2</span>
                  <h4 className="font-extrabold text-yellow-800 text-xs"><MdText text={inhalt.texte.mäßigerMangel} /></h4>
                </div>
                <p className="text-xs text-yellow-900/80 leading-relaxed"><MdText text={inhalt.texte.deutlicherMangelZB} /></p>
                <div className="text-xs text-yellow-700 italic mt-1.5 font-semibold"><MdText text={inhalt.texte.maßnahmeMittelfristigeSanierung} /></div>
              </div>

              <div className="p-3.5 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold font-mono text-xs">3</span>
                  <h4 className="font-extrabold text-orange-850 text-xs"><MdText text={inhalt.texte.schwererMangel} /></h4>
                </div>
                <p className="text-xs text-orange-900/80 leading-relaxed"><MdText text={inhalt.texte.schwerwiegenderMangelSOder} /></p>
                <div className="text-xs text-orange-700 italic mt-1.5 font-semibold"><MdText text={inhalt.texte.maßnahmeKurzfristigeSanierung} /></div>
              </div>

              <div className="p-3.5 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold font-mono text-xs">4</span>
                  <h4 className="font-extrabold text-red-800 text-xs">Sehr schwer</h4>
                </div>
                <p className="text-xs text-red-900/80 leading-relaxed"><MdText text={inhalt.texte.sehrSchwererMangelStandsicherheit} /></p>
                <div className="text-xs text-red-700 italic mt-1.5 font-semibold"><MdText text={inhalt.texte.maßnahmeSofortmaßnahmenSperrung} /></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-shiraz text-xs text-text-main/80 space-y-2 mt-4 leading-relaxed">
              <div className="font-bold text-shiraz flex items-center gap-1.5">
                <Sliders size={15} /><MdText text={inhalt.texte.dasBewertungsschemaZurGesamtbauwerksnote} /></div>
              <p><MdText text={inhalt.texte.vereinfachteDarstellungDesAlgorithmus} /></p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><MdText text={inhalt.texte.basiszahlJeBauteilgruppeErgibt} /></li>
                <li><MdText text={inhalt.texte.zuUndAbschlägeSchadensumfang} /></li>
                <li><MdText text={inhalt.texte.bauwerksnoteMaßgebendIstDie} /></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB Content 2: VDI 6200 */}
      {activeTab === 'vdi6200' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-shiraz" size={28} />
              <h2 className="text-2xl font-bold text-text-main"><MdText text={inhalt.texte.überprüfungNachVdi6200} /></h2>
            </div>
            <p className="text-text-main/80 mb-6 text-sm leading-relaxed"><MdText text={inhalt.texte.dieRichtlinieVdi6200} /></p>

            <h3 className="font-bold text-lg text-text-main mb-4"><MdText text={inhalt.texte.prüfungsartenNachVdi6200} /></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-shiraz mb-2">Begehung</h4>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.sichtkontrolleDurchDenEigentümer} /></p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-shiraz mb-2">Inspektion</h4>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.eingehendeSichtprüfungDurchEine} /></p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.eingehendeÜberprüfung} /></h4>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.detaillierteTiefgreifendeBauwerksuntersu} /></p>
              </div>
            </div>

            <h4 className="font-bold text-md text-text-main mb-3 mt-6 border-t border-home-grau/30 pt-4"><MdText text={inhalt.texte.matrixWerPrüftWann} /></h4>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-home-grau/10 text-text-main">
                  <tr>
                    <th className="px-4 py-2 border border-home-grau/30 rounded-tl-lg">Aspekt</th>
                    <th className="px-4 py-2 border border-home-grau/30">Begehung</th>
                    <th className="px-4 py-2 border border-home-grau/30">Inspektion</th>
                    <th className="px-4 py-2 border border-home-grau/30 rounded-tr-lg"><MdText text={inhalt.texte.eingehendeÜberprüfung2} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main">
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold text-shiraz"><MdText text={inhalt.texte.werQualifikation} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.eigentümerVerfügungsberechtigterOderEine} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.fachkundigePersonAnforderungenNach} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.besondersFachkundigePersonMit} /></td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold text-shiraz"><MdText text={inhalt.texte.wannIntervall} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.vdi6200Tab3} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.cc3Alle23} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.cc3Alle69} /></td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold text-shiraz"><MdText text={inhalt.texte.wasUmfang} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.offensichtlicheMängelGrobeRisse} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.systematischeUndMesstechnischeErfassung} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.detaillierteMaterialprüfungKarbonatisier} /></td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold text-shiraz"><MdText text={inhalt.texte.wieMethode} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.einfacheSichtprüfungVomBegehbaren} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.handnaheSichtprüfungMithilfeVon} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.zerstörungsfreiePrüfverfahrenZfpEndoskop} /></td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold text-shiraz"><MdText text={inhalt.texte.warumZiel} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.früherkennungOffensichtlicherAkuterGefah} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.detaillierteBeurteilungDerStandsicherhei} /></td>
                    <td className="px-4 py-3 border border-home-grau/30"><MdText text={inhalt.texte.ermittlungTiefererSchadensursachenResttr} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="font-bold text-lg text-text-main mb-4"><MdText text={inhalt.texte.bewertungskriterienSVD} /></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-shiraz text-white flex items-center justify-center font-bold">S</div>
                  <h4 className="font-bold text-text-main text-sm">Standsicherheit</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.tragfähigkeitUndVerformungsverhaltenDer} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-bold">V</div>
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.verkehrssicherheitGebrauchstauglichkeit} /></h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.unmittelbareMechanischeGefahrenFür} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">D</div>
                  <h4 className="font-bold text-text-main text-sm">Dauerhaftigkeit</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.fortschreitenderVerschleißUndLangfristig} /></p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="font-bold text-lg text-text-main mb-4"><MdText text={inhalt.texte.schadensfolgeklassenCcNachVdi} /></h3>
            <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.vdi6200KnüpftDie} /></p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-text-main mb-2 text-sm"><MdText text={inhalt.texte.cc1NiedrigeFolgen} /></h4>
                <p className="text-text-main/80 mb-2 leading-relaxed"><MdText text={inhalt.texte.geringesRisikoFürMenschenleben} /></p>
                <p className="text-text-main/60 italic"><MdText text={inhalt.texte.beispieleEinUndMehrfamilienhäuser} /></p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 border-l-4 border-l-[#0284c7]">
                <h4 className="font-bold text-text-main mb-2 text-sm"><MdText text={inhalt.texte.cc2MittlereFolgen} /></h4>
                <p className="text-text-main/80 mb-2 leading-relaxed"><MdText text={inhalt.texte.mittleresRisikoFürMenschenleben} /></p>
                <p className="text-text-main/60 italic"><MdText text={inhalt.texte.beispieleBürogebäudeIndustriebautenKrank} /></p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 border-l-4 border-l-shiraz">
                <h4 className="font-bold text-text-main mb-2 text-sm"><MdText text={inhalt.texte.cc3HoheFolgen} /></h4>
                <p className="text-text-main/80 mb-2 leading-relaxed"><MdText text={inhalt.texte.extremesRisikoFürMenschenleben} /></p>
                <p className="text-text-main/60 italic"><MdText text={inhalt.texte.beispieleVersammlungsstättenFürMehr} /></p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="font-bold text-lg text-text-main mb-4"><MdText text={inhalt.texte.robustheitsklassenRcDesTragwerks} /></h3>
            <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.nebenDenVersagensfolgenSpielt} /></p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs mb-6">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 border-t-4 border-t-red-550">
                <h4 className="font-bold text-text-main mb-2 text-sm"><MdText text={inhalt.texte.rc1GeringeRobustheit} /></h4>
                <p className="text-text-main/80 mb-2 leading-relaxed"><MdText text={inhalt.texte.statischBestimmtOhneSystemreserven} /></p>
                <p className="text-text-main/60 italic"><MdText text={inhalt.texte.beispieleEinfeldträgerSchlankeSchalen} /></p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 border-t-4 border-t-[#0284c7]">
                <h4 className="font-bold text-text-main mb-2 text-sm">RC 2</h4>
                <p className="text-text-main/80 mb-2 leading-relaxed"><MdText text={inhalt.texte.statischUnbestimmtMitSystemreserven} /></p>
                <p className="text-text-main/60 italic"><MdText text={inhalt.texte.beispieleDurchlaufträgerEingeschossigeRa} /></p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 border-t-4 border-t-emerald-600">
                <h4 className="font-bold text-text-main mb-2 text-sm">RC 3</h4>
                <p className="text-text-main/80 mb-2 leading-relaxed"><MdText text={inhalt.texte.großeSystemredundanz} /></p>
                <p className="text-text-main/60 italic"><MdText text={inhalt.texte.beispieleMehrgeschossigeRahmenVielfach} /></p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 border-t-4 border-t-emerald-600">
                <h4 className="font-bold text-text-main mb-2 text-sm"><MdText text={inhalt.texte.rc4NachgewieseneRobustheit} /></h4>
                <p className="text-text-main/80 mb-2 leading-relaxed"><MdText text={inhalt.texte.robustheitFürAlternativeGefährdungsszena} /></p>
                <p className="text-text-main/60 italic"><MdText text={inhalt.texte.beispielNachweisDesStützenausfalls} /></p>
              </div>
            </div>

            <h4 className="font-bold text-md text-text-main mb-3"><MdText text={inhalt.texte.didaktischesModellNichtBestandteil} /></h4>
            <p className="text-xs text-text-main/80 mb-4 leading-relaxed"><MdText text={inhalt.texte.eigeneVeranschaulichungWieSchadensfolge} /></p>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#8c1d40]/10 text-text-main">
                  <tr>
                    <th className="px-4 py-2 border border-home-grau/30"><MdText text={inhalt.texte.schadensfolgeklasseRobustheit} /></th>
                    <th className="px-4 py-2 border border-home-grau/30 font-bold text-emerald-600"><MdText text={inhalt.texte.rc34Robust} /></th>
                    <th className="px-4 py-2 border border-home-grau/30 font-bold text-[#0284c7]">RC 2</th>
                    <th className="px-4 py-2 border border-home-grau/30 font-bold text-red-500"><MdText text={inhalt.texte.rc1GeringRobust} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main font-semibold">
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold"><MdText text={inhalt.texte.cc1GeringeFolgen} /></td>
                    <td className="px-4 py-3 border border-home-grau/30 text-emerald-700 bg-emerald-50"><MdText text={inhalt.texte.pk1Gering} /></td>
                    <td className="px-4 py-3 border border-home-grau/30 text-emerald-700 bg-emerald-50"><MdText text={inhalt.texte.pk1Gering2} /></td>
                    <td className="px-4 py-3 border border-home-grau/30 text-[#0284c7] bg-sky-50 font-medium"><MdText text={inhalt.texte.pk2Mitte} /></td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold"><MdText text={inhalt.texte.cc2MittlereFolgen2} /></td>
                    <td className="px-4 py-3 border border-home-grau/30 text-[#0284c7] bg-sky-50 font-medium"><MdText text={inhalt.texte.pk2Mitte2} /></td>
                    <td className="px-4 py-3 border border-home-grau/30 text-orange-700 bg-orange-50 font-medium"><MdText text={inhalt.texte.pk3Erhöht} /></td>
                    <td className="px-4 py-3 border border-home-grau/30 text-red-700 bg-red-50 font-bold"><MdText text={inhalt.texte.pk4SehrHoch} /></td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="px-4 py-3 border border-home-grau/30 font-bold"><MdText text={inhalt.texte.cc3HoheFolgen2} /></td>
                    <td className="px-4 py-3 border border-home-grau/30 text-orange-700 bg-orange-50 font-medium"><MdText text={inhalt.texte.pk3Erhöht2} /></td>
                    <td className="px-4 py-3 border border-home-grau/30 text-red-700 bg-red-50 font-bold"><MdText text={inhalt.texte.pk4SehrHoch2} /></td>
                    <td className="px-4 py-3 border border-home-grau/30 text-red-700 bg-red-50 font-bold"><MdText text={inhalt.texte.pk4SehrHoch3} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB Content 4: Notenrechner */}
      {activeTab === 'rechner' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* VDI 6200 Zustandsnoten- & Schulnoten-Konverter */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Calculator className="text-shiraz" size={28} />
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.notenrechnerSchulnotenKonverter} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.didaktischeVeranschaulichungDerZustandsn} /></p>
        </div>
              </div>

              <ReiterLeiste label="Rechner" className="flex border border-home-grau/30 rounded-lg p-1 bg-off-white">
                <button {...alsReiter(calculatorTab === 'quick', 'zustand-rechner', 'quick')}
                  onClick={() => setCalculatorTab('quick')}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    calculatorTab === 'quick'
                      ? 'bg-shiraz text-white shadow-sm'
                      : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Sliders size={14} />
                    Schnellkonverter
                  </div>
                </button>
                <button {...alsReiter(calculatorTab === 'matrix', 'zustand-rechner', 'matrix')}
                  onClick={() => setCalculatorTab('matrix')}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    calculatorTab === 'matrix'
                      ? 'bg-shiraz text-white shadow-sm'
                      : 'text-text-main/70 hover:text-text-main'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <FileText size={14} /><MdText text={inhalt.texte.sVDEinzelprüfung} /></div>
                </button>
              </ReiterLeiste>
            </div>

            {/* Dynamic calculation states & helper helper */}
            {(() => {
              // Zustandsnote und Schulnoten-Zuordnung (didaktisch; Kern: src/calc/schutzInstandsetzung.ts)
              const finalZustandsnote = zustandsnote(sScore, vScore, dScore, additionalCount);
              const currentZ = calculatorTab === 'quick' ? zustandsnoteInput : finalZustandsnote;
              const interpolatedSchulnote = schulnoteAusZustandsnote(currentZ);

              const getSchulnoteInfo = (zn: number) => {
                if (zn < 1.5) {
                  return inhalt.daten.getSchulnoteInfo;
                } else if (zn < 2.0) {
                  return inhalt.daten.getSchulnoteInfo_2;
                } else if (zn < 2.5) {
                  return inhalt.daten.getSchulnoteInfo_3;
                } else if (zn < 3.0) {
                  return inhalt.daten.getSchulnoteInfo_4;
                } else if (zn < 3.5) {
                  return inhalt.daten.getSchulnoteInfo_5;
                } else {
                  return inhalt.daten.getSchulnoteInfo_6;
                }
              };

              const noteInfo = getSchulnoteInfo(currentZ);

              // Preset options
              const loadPreset = (s: number, v: number, d: number, add: number) => {
                setSScore(s);
                setVScore(v);
                setDScore(d);
                setAdditionalCount(add);
              };

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* INPUT PANEL */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {calculatorTab === 'quick' ? (
                      <div {...reiterPanel('zustand-rechner', calculatorTab)} className="p-5 border border-home-grau/30 rounded-xl bg-off-white">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-bold text-text-main flex items-center gap-1.5">
                            <Sliders size={16} className="text-shiraz" /><MdText text={inhalt.texte.manuelleBaustoffBauwerksnoteZustandsnote} /></span>
                          <span className="text-xs font-mono px-2 py-0.5 bg-shiraz/10 text-shiraz rounded-full"><MdText text={inhalt.texte.din1076Vdi6200} /></span>
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-semibold text-text-main/60"><MdText text={inhalt.texte.t10SehrGut} /></span>
                            <div className="text-3xl font-black text-shiraz">{formatDeZahl(currentZ, 1)}</div>
                            <span className="text-xs font-semibold text-text-main/60"><MdText text={inhalt.texte.t40Ungenügend} /></span>
                          </div>

                          <input
                            type="range"
                            min="1.0"
                            max="4.0"
                            step="0.1"
                            value={zustandsnoteInput}
                            onChange={(e) => setZustandsnoteInput(parseFloat(e.target.value))}
                            className="w-full h-2 rounded-lg cursor-pointer bg-slate-200 accent-shiraz"
                          />

                          <div className="grid grid-cols-4 gap-1 text-xs text-center text-text-main/50 font-semibold">
                            <div><MdText text={inhalt.texte.t10SehrGut2} /></div>
                            <div><MdText text={inhalt.texte.t20Befriedigend} /></div>
                            <div><MdText text={inhalt.texte.t30NichtAusreichend} /></div>
                            <div><MdText text={inhalt.texte.t40Ungenügend2} /></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div {...reiterPanel('zustand-rechner', calculatorTab)} className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-5">
                        <div className="flex justify-between items-center pb-2 border-b border-home-grau/10">
                          <span className="text-sm font-bold text-text-main flex items-center gap-1.5">
                            <FileText size={16} className="text-shiraz" /><MdText text={inhalt.texte.sVDEinzelbewertung} /></span>
                          <span className="text-xs font-bold text-text-main/60 bg-home-grau/10 px-2 py-0.5 rounded uppercase">
                            Didaktisch
                          </span>
                        </div>

                        {/* S, V, D Radio Matrix */}
                        {[
                          {
                            key: 's',
                            label: inhalt.werte.sStandsicherheit,
                            icon: 'S',
                            desc: inhalt.werte.auswirkungAufTragfähigkeitUnd,
                            currVal: sScore,
                            setVal: setSScore
                          },
                          {
                            key: 'v',
                            label: inhalt.werte.vVerkehrssicherheitBzwGebrauchstauglichk,
                            icon: 'V',
                            desc: inhalt.werte.unmittelbareGefahrFürNutzer,
                            currVal: vScore,
                            setVal: setVScore
                          },
                          {
                            key: 'd',
                            label: inhalt.werte.dDauerhaftigkeit,
                            icon: 'D',
                            desc: inhalt.werte.restnutzungsdauerVerschleißrisikoZB,
                            currVal: dScore,
                            setVal: setDScore
                          }
                        ].map((row) => (
                          <div key={row.key} className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-xs font-bold text-text-main">{row.label}</span>
                                <p className="text-xs text-text-main/60 leading-tight">{row.desc}</p>
                              </div>
                              <span className="text-xs font-bold bg-shiraz text-white px-2 py-0.5 rounded">
                                Wert: {formatDeWert(row.currVal)}
                              </span>
                            </div>

                            <div className="grid grid-cols-4 gap-1.5">
                              {[1, 2, 3, 4].map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => row.setVal(v)}
                                  className={`py-1.5 px-1 rounded-md text-xs font-bold transition-all border ${
                                    row.currVal === v
                                      ? 'bg-shiraz/10 border-shiraz text-shiraz scale-102 font-black'
                                      : 'bg-white border-home-grau/25 text-text-main hover:bg-home-grau/5'
                                  }`}
                                >
                                  Stufe {formatDeWert(v)}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Additional Mängel count */}
                        <div className="pt-3 border-t border-home-grau/10 flex justify-between items-center">
                          <div>
                            <span className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.weitereSchädenVereinfachterZuschlag} /></span>
                            <p className="text-xs text-text-main/60 leading-tight"><MdText text={inhalt.texte.didaktischeVereinfachungRiEbw} /></p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={additionalCount <= 0}
                              aria-label="Weitere Schäden verringern"
                              onClick={() => setAdditionalCount(prev => prev - 1)}
                              className="w-7 h-7 bg-white border border-home-grau/30 rounded flex items-center justify-center text-text-main hover:bg-home-grau/5 disabled:opacity-40"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-text-main">{additionalCount}</span>
                            <button
                              type="button"
                              disabled={additionalCount >= 5}
                              aria-label="Weitere Schäden erhöhen"
                              onClick={() => setAdditionalCount(prev => prev + 1)}
                              className="w-7 h-7 bg-white border border-home-grau/30 rounded flex items-center justify-center text-text-main hover:bg-home-grau/5 disabled:opacity-40"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Quick Presets */}
                        <div className="pt-3 border-t border-home-grau/10">
                          <div className="text-xs font-bold uppercase text-text-main/50 mb-2"><MdText text={inhalt.texte.prüfszenarienLaden} /></div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => loadPreset(1, 1, 1, 0)}
                              className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded hover:bg-emerald-100 transition-colors"
                            ><MdText text={inhalt.texte.neubauNote10} /></button>
                            <button
                              type="button"
                              onClick={() => loadPreset(1, 1, 2, 2)}
                              className="text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                            ><MdText text={inhalt.texte.normalerVerschleißNote2} /></button>
                            <button
                              type="button"
                              onClick={() => loadPreset(2, 2, 3, 3)}
                              className="text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200 px-2 py-1 rounded hover:bg-yellow-100 transition-colors"
                            ><MdText text={inhalt.texte.sanierungsstauNote33} /></button>
                            <button
                              type="button"
                              onClick={() => loadPreset(4, 2, 4, 1)}
                              className="text-xs font-semibold bg-red-50 text-red-800 border border-red-200 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                            ><MdText text={inhalt.texte.kritischerZustandNote4} /></button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* EDUCATIONAL FORMULA GRAPHIC */}
                    <div className="p-4 rounded-xl bg-shiraz/5 border border-shiraz/10 text-xs text-text-main/85 space-y-1.5 leading-snug">
                      <div className="font-bold flex items-center gap-1 text-shiraz">
                        <Info size={14} /><MdText text={inhalt.texte.hintergrundHerkunft} /></div>
                      <p><MdText text={inhalt.texte.dieZustandsnoteNachRi} /></p>
                      <div className="bg-white/80 p-2 rounded-md font-mono text-center text-xs border border-home-grau/15 text-text-main my-2"><MdText text={inhalt.texte.sehrGut1Gut} /></div>
                      <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.eineLineareUmrechnungPasst} /></p>
                    </div>
                  </div>

                  {/* OUTPUT DISPLAY */}
                  <div className="lg:col-span-5 flex flex-col justify-between border border-home-grau/30 rounded-xl bg-off-white p-5 space-y-5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Award size={18} className="text-shiraz" />
                        <span className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.berechnungsKonverterergebnis} /></span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-lg border border-home-grau/15 text-center shadow-xs">
                          <div className="text-xs font-bold text-text-main/50 uppercase tracking-wide font-sans">Bauwerksnote</div>
                          <div className="text-3xl font-black text-text-main mt-1 font-mono">{formatDeZahl(currentZ, 1)}</div>
                          <div className="text-xs font-semibold text-text-main/60 mt-1 uppercase">RI-EBW-PRÜF</div>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-home-grau/15 text-center shadow-xs">
                          <div className="text-xs font-bold text-text-main/50 uppercase tracking-wide font-sans"><MdText text={inhalt.texte.schulnoteDidaktisch} /></div>
                          <div className={`text-3xl font-black mt-1 font-mono text-shiraz`}>{interpolatedSchulnote}</div>
                          <div className="text-xs font-semibold text-text-main/60 mt-1 uppercase">Schulnotensystem</div>
                        </div>
                      </div>

                      {/* Verbal Classification school grade */}
                      <div className={`p-4 rounded-xl border-l-4 ${noteInfo.borderCol} bg-white space-y-2 shadow-xs`}>
                        <div className="flex justify-between items-center flex-wrap gap-1">
                          <div className="text-xs font-bold uppercase text-text-main/50">Wertung:</div>
                          <div className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${noteInfo.color}`}>
                            {noteInfo.label} (Kategorie {formatDeWert(noteInfo.grade)})
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-text-main leading-relaxed">
                            {noteInfo.desc}
                          </span>
                        </div>
                      </div>

                      {/* Concrete Engineering action line */}
                      <div className="p-3.5 bg-shiraz/5 rounded-xl border border-shiraz/10 space-y-1">
                        <div className="text-xs font-bold uppercase text-shiraz tracking-wider font-sans"><MdText text={inhalt.texte.erforderlicheMaßnahmen} /></div>
                        <p className="text-xs text-text-main/90 leading-snug">{noteInfo.action}</p>
                      </div>

                      {/* RI-EBW-PRÜF SIBs-Eskalationsprotokoll */}
                      {(() => {
                        // Check KO-Criteria
                        const isKOSafety = sScore === 4;
                        const isKOTraffic = vScore === 4;
                        const zn = currentZ;

                        let stufe = 0;
                        let label = "Normalbetrieb";
                        let color = "bg-emerald-50/60 text-emerald-950 border-emerald-250";
                        let iconColor = "text-emerald-600";
                        let alertText = inhalt.werte.bauwerkBefindetSichIm;
                        let timeFrame = inhalt.werte.nächsteHauptprüfungImRegelzyklus;
                        let protocol = inhalt.daten["Zustandsbewertung.protocol"];

                        if (isKOSafety || isKOTraffic || zn >= 3.5) {
                          stufe = 5;
                          label = inhalt.werte.ungenügendSofortigerHandlungsbedarf;
                          color = "bg-red-50 text-red-950 border-red-500 ring-2 ring-red-200 animate-pulse";
                          iconColor = "text-red-600 animate-bounce";
                          alertText = isKOSafety 
                            ? inhalt.werte.einzelbewertungS4Standsicherheit 
                            : isKOTraffic 
                              ? inhalt.werte.einzelbewertungV4Verkehrssicherheit
                              : inhalt.werte.standsicherheitUndOderVerkehrssicherheit;
                          timeFrame = inhalt.werte.sofortmaßnahmenSperrungLastbeschränkungN;
                          protocol = inhalt.daten.Zustandsbewertung;
                        } else if (zn >= 3.0 && zn < 3.5) {
                          stufe = 4;
                          label = inhalt.werte.nichtAusreichendKurzfristigerHandlungsbe;
                          color = "bg-orange-50 text-orange-950 border-orange-400";
                          iconColor = "text-orange-700";
                          alertText = inhalt.werte.deutlicheMängelAnStandsicherheitsrelevan;
                          timeFrame = inhalt.werte.fristenLegtDerPrüfer;
                          protocol = inhalt.daten.Zustandsbewertung_2;
                        } else if (zn >= 2.5 && zn < 3.0) {
                          stufe = 3;
                          label = inhalt.werte.ausreichendInstandsetzungPlanen;
                          color = "bg-yellow-50 text-yellow-950 border-yellow-350";
                          iconColor = "text-yellow-700";
                          alertText = inhalt.werte.größereMängelBeeinträchtigenDie;
                          timeFrame = inhalt.werte.fristenLegtDerPrüfer2;
                          protocol = inhalt.daten.Zustandsbewertung_3;
                        } else if (zn >= 2.0 && zn < 2.5) {
                          stufe = 2;
                          label = inhalt.werte.befriedigendBeobachtungMittelfristigeIns;
                          color = "bg-lime-50/50 text-lime-950 border-lime-300";
                          iconColor = "text-lime-700";
                          alertText = inhalt.werte.mängelVorhandenWelcheDie;
                          timeFrame = inhalt.werte.fristenLegtDerPrüfer3;
                          protocol = inhalt.daten.Zustandsbewertung_4;
                        } else if (zn >= 1.5 && zn < 2.0) {
                          stufe = 1;
                          label = inhalt.werte.gutBeobachtungImRegelzyklus;
                          color = "bg-emerald-50/30 text-emerald-950 border-emerald-150";
                          iconColor = "text-emerald-700";
                          alertText = inhalt.werte.geringfügigeVerschleißmängelOhneUnmittel;
                          timeFrame = inhalt.werte.instandhaltungBeiRegulärenWartungszyklen;
                          protocol = inhalt.daten.Zustandsbewertung_5;
                        }

                        return (
                          <div className={`p-4 rounded-xl border space-y-3 shadow-3xs transition-all ${color}`} id="ri-ebw-escalation-card">
                            <div className="flex justify-between items-center flex-wrap gap-2 border-b border-home-grau/10 pb-2">
                              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                <ShieldCheck size={11} className={iconColor} /><MdText text={inhalt.texte.handlungsbedarfDidaktischAngelehntAn} /></span>
                              <span className="text-xs font-bold font-mono px-2 py-0.5 bg-black/10 rounded-full">
                                {label}
                              </span>
                            </div>
                            
                            <div className="space-y-1.5">
                              <p className="text-xs font-bold leading-snug">{alertText}</p>
                              
                              <div className="text-xs space-y-1">
                                <div className="font-semibold text-black/65 block">Handlungsrahmen:</div>
                                <div className="bg-white/60 p-1.5 rounded text-black font-semibold border border-black/5">
                                  ⏱️ {timeFrame}
                                </div>
                              </div>
                              
                              <div className="space-y-1 text-xs pt-1">
                                <span className="font-bold text-black/60 uppercase block"><MdText text={inhalt.texte.typischeMaßnahmenBeispiele} /></span>
                                <ul className="space-y-1 list-none pl-0">
                                  {protocol.map((step, i) => (
                                    <li key={i} className="flex items-start gap-1.5 leading-snug">
                                      <span className="text-shiraz font-bold shrink-0 mt-0.5">▪</span>
                                      <span className="text-black/80 font-medium">{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* VISUAL SCALE OF SCHOOL GRADES */}
                    <div className="pt-4 border-t border-home-grau/10 space-y-2">
                      <div className="flex justify-between items-center text-xs text-text-main/60 font-bold">
                        <span><MdText text={inhalt.texte.sehrGut1} /></span>
                        <span><MdText text={inhalt.texte.befriedigend3} /></span>
                        <span><MdText text={inhalt.texte.ungenügend6} /></span>
                      </div>

                      {/* Custom progress marker along the scale */}
                      <div className="relative h-3 bg-home-grau/15 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-600 transition-all duration-300"
                          style={{ width: '100%' }}
                        />
                        {/* The indicator bar */}
                        <div
                          className="absolute top-0 bottom-0 w-2 bg-text-main border-2 border-white rounded-full transition-all duration-300 -translate-x-1/2"
                          style={{ left: `${((interpolatedSchulnote - 1) / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                  </div>

                </div>
              );
            })()}
          </div>
        </div>
      )}
      </div>
      </ModuleTabs>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1PrüfplanEiner}
        zielGleichung="H_{n+1} = H_n + 6\,\text{a}, \quad E = H + 3\,\text{a}"
        schritte={inhalt.daten["Zustandsbewertung.schritte"]}
        ergebnisHinweis={inhalt.werte.nachDin10762026}
        normQuelle={inhalt.werte.din1076202601}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2ZuverlässigkeitsindexEines}
        zielGleichung="\beta = \frac{\mu_R - \mu_S}{\sqrt{\sigma_R^2 + \sigma_S^2}}"
        schritte={inhalt.daten["Zustandsbewertung.schritte_2"]}
        ergebnisHinweis={inhalt.werte.fürBestehendeTragwerkeDürfen}
        normQuelle={inhalt.werte.dinEn1990Anhang}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="vdi6200" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap11}
        wikipedia={[
          { title: 'Bauwerksüberwachung', url: 'https://de.wikipedia.org/wiki/Bauwerks%C3%BCberwachung' },
          { title: 'Standsicherheit', url: 'https://de.wikipedia.org/wiki/Standsicherheit' }
        ]}
        regelwerke={inhalt.daten["Zustandsbewertung.regelwerke"]}
        literatur={inhalt.daten["Zustandsbewertung.literatur"]}
        formeln={inhalt.daten["Zustandsbewertung.formeln"]}
      />
    </div>
  );
}
