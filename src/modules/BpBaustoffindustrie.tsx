import React, { useState } from 'react';
import { 
  Factory, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  MapPin, 
  FileText, 
  Layers,
  TrendingDown,
  Database
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/bpbaustoffindustrie/BpBaustoffindustrie.json';
import { MdText } from '@/src/components/inhalt/MdText';

// Define the Tabs
type SubTab = 'overview' | 'sources';

export default function BpBaustoffindustrie() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview');

  return (
    <div className="flex flex-col gap-8">
      {/* Tab Navigation header */}
      <div className="flex flex-col gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-home-grau/30 flex flex-wrap justify-center sm:justify-start gap-2">
          <button aria-pressed={activeSubTab === 'overview'} 
            onClick={() => setActiveSubTab('overview')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'overview' ? 'bg-shiraz text-white shadow-sm' : 'bg-slate-50 border border-home-grau/25 hover:border-shiraz text-text-main'}`}
          >
            <Factory size={16} /><MdText text={inhalt.texte.marktdynamikSegmente} /></button>
          
          <button aria-pressed={activeSubTab === 'sources'} 
            onClick={() => setActiveSubTab('sources')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'sources' ? 'bg-shiraz text-white shadow-sm' : 'bg-slate-50 border border-home-grau/25 hover:border-shiraz text-text-main'}`}
          >
            <FileText size={16} /> Fachquellen
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <Factory className="text-shiraz" size={24} />
            <div>
              <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.dieDeutscheBaustoffSteine} /></h2>
              <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.wirtschaftlicheEinordnungUndGliederung} /></p>
            </div>
          </div>

          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed space-y-3">
            <p><MdText text={inhalt.texte.dieDeutscheBaustoffUnd} /></p>
            <p className="text-xs italic text-text-main/60 border-t border-home-grau/20 pt-2"><MdText text={inhalt.texte.entscheidendesStrukturmerkmalMassenbaust} /></p>
          </div>

          {/* Dualistic Anatomy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-200 pb-2">
                  <Globe className="text-slate-600 shrink-0" size={18} />
                  <span><MdText text={inhalt.texte.kategorieAKapitalintensiveGlobale} /></span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.geprägtDurchInternationaleKonzerne} /></p>
                <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-900 block mb-1"><MdText text={inhalt.texte.typischeSektorenAkteure} /></span>
                  <p className="text-text-main/70"><MdText text={inhalt.texte.zementwerkeGipsabbauBauchemieFlachglashe} /></p>
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-4 bg-slate-100 p-1.5 rounded text-center"><MdText text={inhalt.texte.hoherInvestitionsbedarfGlobaleEsg} /></div>
            </div>

            <div className="bg-amber-50/30 p-5 rounded-xl border border-amber-200/50 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold border-b border-amber-200 pb-2">
                  <MapPin className="text-amber-700 shrink-0" size={18} />
                  <span><MdText text={inhalt.texte.kategorieBDezentraleRegionale} /></span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.geprägtDurchFamiliengeführtenMittelstand} /></p>
                <div className="bg-white p-2.5 rounded-lg border border-amber-100 text-xs">
                  <span className="font-semibold text-amber-900 block mb-1"><MdText text={inhalt.texte.typischeSektorenAkteure2} /></span>
                  <p className="text-text-main/70"><MdText text={inhalt.texte.kieswerkeSteinbrücheZiegelbrennereienLok} /></p>
                </div>
              </div>
              <div className="text-[11px] font-mono text-amber-700 mt-4 bg-amber-100/40 p-1.5 rounded text-center"><MdText text={inhalt.texte.regionaleLogistikRohstoffsicherungVor} /></div>
            </div>
          </div>

          {/* Macroeconomic indicators and production value table */}
          <div className="space-y-4 shadow-3xs p-4 rounded-xl border border-home-grau/25 bg-white">
            <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
              <TrendingUp className="text-shiraz" size={18} /><MdText text={inhalt.texte.branchenaufteilungJährlicheProduktionswe} /></h3>
            <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.einSystematischerÜberblickDes} /></p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-text-main">
                <thead className="bg-slate-100 text-[11px] font-bold text-text-main/80 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3"><MdText text={inhalt.texte.branchensegmentIndustriezweig} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.hauptprodukteOutput} /></th>
                    <th className="p-3 text-right"><MdText text={inhalt.texte.wirtschaftlicherLieferradiusLkwTransport} /></th>
                    <th className="p-3 text-right"><MdText text={inhalt.texte.produktionswertGrößenordnungLehrwert} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800"><MdText text={inhalt.texte.sandKiesNaturstein} /></td>
                    <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.betonzuschlägeTragschichtenFürStraßenbau} /></td>
                    <td className="p-3 text-right text-amber-700 font-medium"><MdText text={inhalt.texte.lokal35Km} /></td>
                    <td className="p-3 text-right font-mono font-bold"><MdText text={inhalt.texte.t35Mrd} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800"><MdText text={inhalt.texte.zementKalkGips} /></td>
                    <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.hydraulischeBindemittelGipsplattenBau} /></td>
                    <td className="p-3 text-right text-slate-600 font-medium"><MdText text={inhalt.texte.überregional150Km} /></td>
                    <td className="p-3 text-right font-mono font-bold"><MdText text={inhalt.texte.t42Mrd} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800"><MdText text={inhalt.texte.mörtelBetonwarenFertigteile} /></td>
                    <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.vorgefertigteDeckenelementeBetonpflaster} /></td>
                    <td className="p-3 text-right text-amber-700 font-medium"><MdText text={inhalt.texte.regional80Km} /></td>
                    <td className="p-3 text-right font-mono font-bold"><MdText text={inhalt.texte.t128Mrd} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800"><MdText text={inhalt.texte.ziegelGrobkeramik} /></td>
                    <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.hochlochziegelDachziegelKlinkerFeuerfest} /></td>
                    <td className="p-3 text-right text-slate-600 font-medium"><MdText text={inhalt.texte.überregional150Km2} /></td>
                    <td className="p-3 text-right font-mono font-bold"><MdText text={inhalt.texte.t21Mrd} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800"><MdText text={inhalt.texte.naturwerksteineSchotterkörnungen} /></td>
                    <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.marmorplattenGranitpflasterGleisschotter} /></td>
                    <td className="p-3 text-right text-slate-600 font-medium"><MdText text={inhalt.texte.gezieltRegionalBisNational} /></td>
                    <td className="p-3 text-right font-mono font-bold"><MdText text={inhalt.texte.t16Mrd} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800"><MdText text={inhalt.texte.dämmstoffeFasererzeugnisse} /></td>
                    <td className="p-3 text-text-main/80"><MdText text={inhalt.texte.mineralwolleEpsHolzfaserdämmstoffe} /></td>
                    <td className="p-3 text-right text-blue-600 font-medium"><MdText text={inhalt.texte.nationalGlobal} /></td>
                    <td className="p-3 text-right font-mono font-bold"><MdText text={inhalt.texte.t45Mrd} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg text-[11.5px] leading-relaxed text-blue-900 mt-2"><MdText text={inhalt.texte.zusammenfassendeBranchenkennzahlenDieBra} /></div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: INFORMATION INFRASTRUCTURE / SOURCES */}
      {activeSubTab === 'sources' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 border-b border-home-grau/15 pb-4">
            <FileText className="text-shiraz" size={24} />
            <div>
              <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.digitaleInformationsportaleDatenbanken} /></h2>
              <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.verifizierteRechercheSchnittstellenFür} /></p>
            </div>
          </div>

          <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.fürWissenschaftlicheArbeitenMarktbeobach} /></p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Database size={16} className="text-slate-700" /><MdText text={inhalt.texte.destatisGenesisStatistischesBundesamt} /></h3>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.bietetMonatlichAktualisierteDaten} /></p>
              </div>
              <a 
                href="https://www.destatis.de" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center text-xs font-bold text-shiraz hover:underline"
              ><MdText text={inhalt.texte.zurGenesisDatenbank} /></a>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <TrendingDown size={16} className="text-slate-700" /><MdText text={inhalt.texte.ifoInstitutFürWirtschaftsforschung} /></h3>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.veröffentlichtDasMonatlicheIfo} /></p>
              </div>
              <a 
                href="https://www.ifo.de" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center text-xs font-bold text-shiraz hover:underline"
              ><MdText text={inhalt.texte.zuDenIfoKonjunkturindikatoren} /></a>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-slate-700" /><MdText text={inhalt.texte.lobbyregisterDesDeutschenBundestages} /></h3>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.offenesStaatlichesRegisterZur} /></p>
              </div>
              <a 
                href="https://www.lobbyregister.bundestag.de" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center text-xs font-bold text-shiraz hover:underline"
              ><MdText text={inhalt.texte.zumLobbyregisterDesBundes} /></a>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Layers size={16} className="text-slate-700" /><MdText text={inhalt.texte.econbizFachportalWirtschaftswissenschaft} /></h3>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.betriebenVonDerZbw} /></p>
              </div>
              <a href="https://www.econbiz.de" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-xs font-medium text-shiraz hover:underline"><MdText text={inhalt.texte.econbizDeÖffnen} /></a>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielWirtschaftlicherLiefer}
          zielGleichung="R_{max} = \frac{P_{Markt} - K_{prod} - K_{fix}}{k_{var}}"
          normQuelle={inhalt.werte.lehrmodellMitAngenommenenKostenwerten}
          schritte={inhalt.daten["BpBaustoffindustrie.schritte"]}
          ergebnisHinweis={inhalt.werte.rund50KmDeshalb}
        />
      </div>

      <ModulTest moduleId="bp_baustoffindustrie" />

      {/* Module Footer standard integration */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Baustoff', url: 'https://de.wikipedia.org/wiki/Baustoff' },
          { title: 'Klinker', url: 'https://de.wikipedia.org/wiki/Zementklinker' },
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' }
        ]}
        weblinks={inhalt.daten["BpBaustoffindustrie.weblinks"]}
        literatur={inhalt.daten["BpBaustoffindustrie.literatur"]}
        regelwerke={inhalt.daten["BpBaustoffindustrie.regelwerke"]}
        formeln={inhalt.daten["BpBaustoffindustrie.formeln"]}
      />
    </div>
  );
}
