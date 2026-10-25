import React, { useState } from 'react';
import { Layers, Sparkles, Flame, Microscope, Droplets, ArrowRight } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { useTabContext } from '@/src/contexts/TabContext';
import { ExpositionsKurzkarte } from '@/src/components/ui/ExpositionsKurzkarte';
import { springeZu } from '@/src/components/ui/Querverweis';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/grundlagen/Grundlagen.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Grundlagen() {
  const [activeTab, setActiveTab] = useState<'zement' | 'wasser' | 'gesteinskoernung' | 'zusatzstoffe' | 'mehlkorn'>('zement');
  const { setActiveTab: setModul } = useTabContext();
  // Themen mit eigener Quelle (AP 3.9): hier nur verlinkt
  const WEITER = [
    { ziel: 'bindemittel', label: inhalt.werte.zementherstellungHydratation, modul: 'Bindemittel' },
    { ziel: 'frischbeton', label: 'Konsistenzklassen', modul: 'Frischbeton' },
    { ziel: 'festbeton', label: 'Druckfestigkeitsklassen', modul: 'Festbeton' },
    { ziel: 'expositionsklassen', label: inhalt.werte.expositionsFeuchtigkeitsklassen, modul: 'Expositionsklassen' },
    { ziel: 'regularien', label: inhalt.werte.normenRegelwerke, modul: 'Regulatives' },
  ] as const;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.ausgangsstoffeDesBetons} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.betonBestehtAusZement} /></p>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-xs">
            <strong className="mr-1">Lernpfad:</strong>
            {([
              ['zement', 'Zement'], ['wasser', 'Zugabewasser'], ['gesteinskoernung', 'Gesteinskörnung'],
              ['zusatzstoffe', 'Zusätze'], ['mehlkorn', 'Mehlkorn'],
            ] as const).map(([id, label], i) => (
              <React.Fragment key={id}>
                {i > 0 && <span className="text-text-main/40">→</span>}
                <button onClick={() => setActiveTab(id)} className="underline decoration-dotted hover:text-shiraz cursor-pointer">{i + 1}. {label}</button>
              </React.Fragment>
            ))}
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs" data-weiterfuehrend="grundlagen">
            <strong className="mr-1"><MdText text={inhalt.texte.eigeneModule} /></strong>
            {WEITER.map(w => (
              <button key={w.ziel} onClick={() => springeZu(setModul, w.ziel)} title={`Zum Modul ${w.modul}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-home-grau/30 hover:border-shiraz hover:text-shiraz cursor-pointer">
                {w.label} <ArrowRight size={11} />
              </button>
            ))}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button aria-pressed={activeTab === 'zement'}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'zement' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/30 hover:border-text-main'}`}
            onClick={() => setActiveTab('zement')}
          >
            Zementarten
          </button>
          <button aria-pressed={activeTab === 'wasser'}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'wasser' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/30 hover:border-text-main'}`}
            onClick={() => setActiveTab('wasser')}
          >
            Zugabewasser
          </button>
          <button aria-pressed={activeTab === 'gesteinskoernung'}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'gesteinskoernung' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/30 hover:border-text-main'}`}
            onClick={() => setActiveTab('gesteinskoernung')}
          >
            Gesteinskörnungen
          </button>
          <button aria-pressed={activeTab === 'mehlkorn'}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'mehlkorn' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/30 hover:border-text-main'}`}
            onClick={() => setActiveTab('mehlkorn')}
          >
            Mehlkorngehalt
          </button>
          <button aria-pressed={activeTab === 'zusatzstoffe'}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'zusatzstoffe' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/30 hover:border-text-main'}`}
            onClick={() => setActiveTab('zusatzstoffe')}
          >
            Zusätze
          </button>
        </div>

        {activeTab === 'wasser' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <h3 className="text-lg font-bold flex items-center gap-2"><Droplets size={18} className="text-shiraz" /><MdText text={inhalt.texte.zugabewasserDinEn1008} /></h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.dasZugabewasserLöstDie} /></p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-off-white text-left">
                    <th className="p-3 border border-home-grau/30">Wasserart</th>
                    <th className="p-3 border border-home-grau/30"><MdText text={inhalt.texte.eignungNachDinEn} /></th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-3 border border-home-grau/30 font-semibold">Trinkwasser</td><td className="p-3 border border-home-grau/30"><MdText text={inhalt.texte.geeignetEinePrüfungIst} /></td></tr>
                  <tr><td className="p-3 border border-home-grau/30 font-semibold"><MdText text={inhalt.texte.restwasserAusDerBetonherstellung} /></td><td className="p-3 border border-home-grau/30"><MdText text={inhalt.texte.geeignetWennDieAnforderungen} /></td></tr>
                  <tr><td className="p-3 border border-home-grau/30 font-semibold"><MdText text={inhalt.texte.grundwasserNatürlichesOberflächenwasserB} /></td><td className="p-3 border border-home-grau/30"><MdText text={inhalt.texte.kannGeeignetSeinVor} /></td></tr>
                  <tr><td className="p-3 border border-home-grau/30 font-semibold"><MdText text={inhalt.texte.meerwasserBrackwasser} /></td><td className="p-3 border border-home-grau/30"><MdText text={inhalt.texte.allenfallsFürUnbewehrtenBeton} /></td></tr>
                  <tr><td className="p-3 border border-home-grau/30 font-semibold"><MdText text={inhalt.texte.häuslichesAbwasser} /></td><td className="p-3 border border-home-grau/30"><MdText text={inhalt.texte.nichtGeeignet} /></td></tr>
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h4 className="font-bold text-shiraz mb-2">Prüfmerkmale</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
                  <li><MdText text={inhalt.texte.vorprüfungÖleUndFette} /></li>
                  <li><MdText text={inhalt.texte.chemischePrüfungChloridSulfat} /></li>
                  <li><MdText text={inhalt.texte.vergleichsprüfungErstarrungszeitUndDruck} /></li>
                </ul>
              </div>
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.wirksamerWassergehalt} /></h4>
                <p className="text-sm text-gray-700"><MdText text={inhalt.texte.fürDenWZ} /></p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gesteinskoernung' && (
          <div className="flex flex-col gap-6 animate-fade-in">
             <h3 className="text-lg font-bold"><MdText text={inhalt.texte.gesteinskörnungenFürBetonDin} /></h3>
             <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.gesteinskörnungenMachenCa70} /></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.begriffeKategorien} /></h4>
                <ul className="space-y-3 text-sm text-text-main/80">
                  <li><MdText text={inhalt.texte.dmaxGrößtkornObererSiebdurchgang} /></li>
                  <li><MdText text={inhalt.texte.gesteinsartenNatürlicheSandKies} /></li>
                  <li><MdText text={inhalt.texte.kornformKubischIstIdeal} /></li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.alkalikieselsäurereaktionAkrBetonkrebs} /></h4>
                <p className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.zusammentreffenVonFeuchterUmgebung} /></p>
                <div className="text-xs bg-off-white p-2 rounded"><MdText text={inhalt.texte.vorbeugendeMaßnahmenNachDafstb} /></div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm md:col-span-2">
                <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.eigenschaftenKennwerte} /></h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-main/80">
                  <div>
                    <h5 className="font-bold mb-1"><MdText text={inhalt.texte.sieblinienZBA} /></h5>
                    <p className="text-xs"><MdText text={inhalt.texte.idealeKornzusammensetzungDieSieblinie} /></p>
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">Wasseranspruch</h5>
                    <p className="text-xs"><MdText text={inhalt.texte.feinanteileUndPoröseGesteinskörnungen} /></p>
                  </div>
                  <div>
                    <h5 className="font-bold mb-1"><MdText text={inhalt.texte.rezyklierteKörnungen} /></h5>
                    <p className="text-xs"><MdText text={inhalt.texte.dürfenNachDin1045} /></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'zement' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <h3 className="text-lg font-bold"><MdText text={inhalt.texte.zementartenNachDinEn} /></h3>
            <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.übersichtDerHauptzementartenUnd} /><button onClick={() => springeZu(setModul, 'bindemittel')} className="underline decoration-dotted text-shiraz hover:text-shiraz/80 cursor-pointer">Bindemittel</button>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {inhalt.daten.Grundlagen.map((c, i) => (
                 <div key={i} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col">
                   <div className="text-lg font-bold text-shiraz mb-1">{c.typ}</div>
                   <div className="font-medium text-sm mb-3 border-b pb-2">{c.name}</div>
                   <div className="text-sm text-text-main/70">{c.desc}</div>
                 </div>
               ))}
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 mt-4">
              <h4 className="font-bold mb-2"><MdText text={inhalt.texte.festigkeitsklassenZement} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.dieNormfestigkeitNach28} /></p>
              <ul className="list-disc list-inside mt-2 text-sm text-text-main/70">
                <li><MdText text={inhalt.texte.t325425} /></li>
                <li><MdText text={inhalt.texte.lLowNiedrigeAnfangsfestigkeit} /></li>
                <li><MdText text={inhalt.texte.nNormalNormaleAnfangsfestigkeit} /></li>
                <li><MdText text={inhalt.texte.rRapidHoheAnfangsfestigkeit} /></li>
              </ul>
              <div className="mt-3 text-xs text-text-main/50 font-mono bg-white p-2 border rounded"><MdText text={inhalt.texte.beispielCemIiA} /></div>
            </div>
          </div>
        )}

        {activeTab === 'mehlkorn' && (
          <div className="flex flex-col gap-6 animate-fade-in">
             <h3 className="text-lg font-bold">Mehlkorngehalt</h3>
             <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.alsMehlkornGeltenAlle} /></p>

             <div className="bg-white rounded-xl border border-home-grau/30 shadow-sm p-5">
               <h4 className="font-bold mb-4"><MdText text={inhalt.texte.höchstzulässigerMehlkorngehaltDin1045} /></h4>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm border-collapse">
                   <thead>
                     <tr className="border-b-2 border-home-grau/30">
                       <th className="py-2 px-2">Anwendungsbereich</th>
                       <th className="py-2 px-2">Zementgehalt</th>
                       <th className="py-2 px-2"><MdText text={inhalt.texte.maxMehlkorngehaltKgM} /></th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="border-b border-home-grau/10">
                       <td className="py-2 px-2"><MdText text={inhalt.texte.xfXmBisC50} /></td>
                       <td className="py-2 px-2">≤ 300 kg/m³</td>
                       <td className="py-2 px-2 font-mono">400</td>
                     </tr>
                     <tr className="border-b border-home-grau/10">
                       <td className="py-2 px-2"><MdText text={inhalt.texte.xfXmBisC502} /></td>
                       <td className="py-2 px-2">≥ 350 kg/m³</td>
                       <td className="py-2 px-2 font-mono">450</td>
                     </tr>
                     <tr className="border-b border-home-grau/10">
                       <td className="py-2 px-2"><MdText text={inhalt.texte.alleExpositionsklassenAbC55} /></td>
                       <td className="py-2 px-2">≤ 400 kg/m³</td>
                       <td className="py-2 px-2 font-mono">500</td>
                     </tr>
                     <tr className="border-b border-home-grau/10">
                       <td className="py-2 px-2"><MdText text={inhalt.texte.alleExpositionsklassenAbC552} /></td>
                       <td className="py-2 px-2">450 kg/m³</td>
                       <td className="py-2 px-2 font-mono">550</td>
                     </tr>
                     <tr className="border-b border-home-grau/10">
                       <td className="py-2 px-2"><MdText text={inhalt.texte.alleExpositionsklassenAbC553} /></td>
                       <td className="py-2 px-2">≥ 500 kg/m³</td>
                       <td className="py-2 px-2 font-mono">600</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
               <p className="text-xs text-text-main/60 mt-3 text-justify"><MdText text={inhalt.texte.zwischenwerteWerdenLinearInterpoliert} /></p>
             </div>
            <FormulaDerivationBox
              title={inhalt.werte.anwendungsbeispielMehlkorngehaltPrüfen}
              zielGleichung="m_{Mk} = m_z + m_{ST} + m_{Gk \le 0{,}125\,\text{mm}} \le m_{Mk,max}"
              normQuelle={inhalt.werte.din104522008}
              schritte={inhalt.daten["Grundlagen.schritte"]}
              ergebnisHinweis={inhalt.werte.t381KgM420}
            />
          </div>
        )}

        {activeTab === 'zusatzstoffe' && (
          <div className="flex flex-col gap-6 animate-fade-in">
             <h3 className="text-lg font-bold"><MdText text={inhalt.texte.betonzusatzstoffeStUndZusatzmittel} /></h3>
             <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.übersichtDerÜblichenWirkstoffe} /></p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
               <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                 <h4 className="font-bold text-shiraz mb-3"><MdText text={inhalt.texte.zusatzmittelZm} /></h4>
                 <ul className="space-y-3 text-sm">
                   <li><strong className="font-mono text-text-main bg-off-white px-1">BV</strong><MdText text={inhalt.texte.betonverflüssigerVerringerungDesWasserbe} /></li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">FM</strong><MdText text={inhalt.texte.fließmittelStarkeVerflüssigungFür} /></li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">VZ</strong><MdText text={inhalt.texte.verzögererVerlängerungDerVerarbeitungsze} /></li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">LP</strong><MdText text={inhalt.texte.luftporenbildnerErzeugenKleinerVerteilte} /></li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">BE</strong><MdText text={inhalt.texte.beschleunigerErstarrungsOderErhärtungsbe} /></li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">ST</strong><MdText text={inhalt.texte.stabilisiererVerhindernVonEntmischung} /></li>
                 </ul>
               </div>

               <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                 <h4 className="font-bold text-shiraz mb-3"><MdText text={inhalt.texte.zusatzstoffeTypIiReaktiv} /></h4>
                 <ul className="space-y-3 text-sm">
                   <li><strong className="font-mono text-text-main bg-off-white px-1">FA</strong><MdText text={inhalt.texte.flugascheSfaPuzzolanischVerbessert} /></li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">SF</strong><MdText text={inhalt.texte.silikastaubMicrosilicaHochreaktivStark} /></li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">HÜS</strong><MdText text={inhalt.texte.hüttensandHsmLatentHydraulisch} /></li>
                 </ul>
                 <h4 className="font-bold text-shiraz mb-3 mt-6"><MdText text={inhalt.texte.zusatzstoffeTypIInert} /></h4>
                 <ul className="space-y-3 text-sm">
                   <li><strong className="font-mono text-text-main bg-off-white px-1">KM</strong><MdText text={inhalt.texte.kalksteinmehlLlFüllerVerbessert} /></li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">Farbpigmente</strong><MdText text={inhalt.texte.eisenoxidEtcFürArchitekturbeton} /></li>
                 </ul>
               </div>
             </div>

             {/* Wirkungsmechanismen der Zusatzstoffe: Hydratationswärme & ITZ */}
             <div className="p-5 bg-white rounded-2xl border border-home-grau/25 shadow-sm text-xs text-text-main/80 space-y-4">
               <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-home-grau/15">
                 <div className="font-bold text-sm text-text-main flex items-center gap-2">
                   <Sparkles size={18} className="text-shiraz" />
                   <span><MdText text={inhalt.texte.wirkungsmechanismenDerZusatzstoffeHydrat} /></span>
                 </div>
                 <span className="text-[11px] font-semibold text-slate-500 bg-off-white px-2.5 py-0.5 rounded-full border border-home-grau/20"><MdText text={inhalt.texte.gefügeThermomechanik} /></span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                 {/* Karte 1: Hydratationswärme */}
                 <div className="bg-off-white/80 p-4 rounded-xl border border-home-grau/20 flex flex-col justify-between">
                   <div>
                     <div className="font-bold text-xs text-text-main flex items-center gap-1.5 mb-2 text-orange-950">
                       <Flame size={16} className="text-orange-600" />
                       <span><MdText text={inhalt.texte.t1HydratationswärmeMassenbeton} /></span>
                     </div>
                     <p className="text-[11px] leading-relaxed text-text-main/80 mb-2"><MdText text={inhalt.texte.problemstellungDieKlinkerbestandteile} /><FormulaText text="C_3S, C_3A" /><MdText text={inhalt.texte.reagierenStarkExothermWärmefreisetzung} /><FormulaText text="\Delta T > 15\text{–}20\text{ K}" /><MdText text={inhalt.texte.entstehenMassiveThermischeZwangspannunge} /></p>
                     <p className="text-[11px] leading-relaxed text-text-main/80"><MdText text={inhalt.texte.einflussDerZusatzstoffe} /></p>
                     <ul className="list-disc list-inside text-[11px] space-y-1 text-text-main/75 mt-1 ml-1">
                       <li><MdText text={inhalt.texte.flugascheFaHüttensandmehlHüs} /></li>
                       <li><MdText text={inhalt.texte.silikastaubSfBeschleunigtDurch} /></li>
                     </ul>
                   </div>
                   <div className="mt-3 pt-2 border-t border-home-grau/15 text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.richtwertePraxisMaxKerntemperatur} /></div>
                 </div>

                 {/* Karte 2: ITZ (Interfacial Transition Zone) */}
                 <div className="bg-off-white/80 p-4 rounded-xl border border-home-grau/20 flex flex-col justify-between">
                   <div>
                     <div className="font-bold text-xs text-text-main flex items-center gap-1.5 mb-2 text-blue-950">
                       <Microscope size={16} className="text-middle-blue" />
                       <span><MdText text={inhalt.texte.t2ItzInterfacialTransition} /></span>
                     </div>
                     <p className="text-[11px] leading-relaxed text-text-main/80 mb-2"><MdText text={inhalt.texte.wasIstDieItz} /></p>
                     <p className="text-[11px] leading-relaxed text-text-main/80 mb-2"><MdText text={inhalt.texte.schwachstelleOhneZusatzstoffeAn} /><FormulaText text="\text{Ca(OH)}_2" /><MdText text={inhalt.texte.undEttringitDieFolge} /></p>
                     <p className="text-[11px] leading-relaxed text-text-main/80"><MdText text={inhalt.texte.optimierungDurchZusatzstoffe} /></p>
                     <ul className="list-disc list-inside text-[11px] space-y-1 text-text-main/75 mt-1 ml-1">
                       <li><MdText text={inhalt.texte.mikroFüllereffektNanofeinerSilikastaub} /></li>
                       <li><MdText text={inhalt.texte.puzzolanischePhasenumwandlungSieWandeln} /><span className="font-mono text-shiraz text-[10px] block mt-0.5"><MdText text={inhalt.texte.caOhSioH} /></span></li>
                     </ul>
                   </div>
                   <div className="mt-3 pt-2 border-t border-home-grau/15 text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.ergebnisHomogeneKontaktzoneDeutlich} /></div>
                 </div>
               </div>
             </div>
            <FormulaDerivationBox
              title={inhalt.werte.anwendungsbeispielÄquivalenterWZ}
              zielGleichung="(w/z)_{eq} = \frac{w}{z + k_f \cdot f}"
              normQuelle={inhalt.werte.din10452Anrechnung}
              schritte={inhalt.daten["Grundlagen.schritte_2"]}
              ergebnisHinweis={inhalt.werte.wZEq0}
            />
            <ExpositionsKurzkarte hinweis={inhalt.werte.obUndInWelchem} />
          </div>
        )}

      </div>

      <ModulTest moduleId="grundlagen" />

      <ModuleFooter
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Gesteinskörnung', url: 'https://de.wikipedia.org/wiki/Gesteinsk%C3%B6rnung' },
          { title: 'Expositionsklasse', url: 'https://de.wikipedia.org/wiki/Expositionsklasse' },
          { title: 'Wasserzementwert', url: 'https://de.wikipedia.org/wiki/Wasserzementwert' }
        ]}
        literatur={inhalt.daten["Grundlagen.literatur"]}
        regelwerke={inhalt.daten["Grundlagen.regelwerke"]}
        formeln={inhalt.daten["Grundlagen.formeln"]}
      />
    </div>
  );
}
