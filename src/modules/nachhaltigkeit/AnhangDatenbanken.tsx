import { ArrowRight, ExternalLink, Compass } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import inhalt from '@/content/nachhaltigkeit/AnhangDatenbanken.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface AnhangDatenbankenProps {
  activeEcoDb: "oekobaudat" | "dgnb" | "ibu" | "wecobis";
  setActiveEcoDb: Dispatch<SetStateAction<"oekobaudat" | "dgnb" | "ibu" | "wecobis">>;
}

export default function AnhangDatenbanken({ activeEcoDb, setActiveEcoDb }: AnhangDatenbankenProps) {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 4</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1"><MdText text={inhalt.texte.ökoDatenbankenNachweisportaleQng} /></h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.dieDurchführungPräziserProdukt} /></p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Database 1: ÖKOBAUDAT */}
          <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${activeEcoDb === 'oekobaudat' ? 'bg-emerald-50/30 border-emerald-400' : 'bg-white border-stone-200 hover:bg-slate-50'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase rounded"><MdText text={inhalt.texte.ökobaudatBbsr} /></span>
              <button onClick={() => setActiveEcoDb('oekobaudat')} className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"><MdText text={inhalt.texte.detailsAnsehen} /><ArrowRight size={10} />
              </button>
            </div>
            <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.bundesreferenzdatenbankFürÖkobilanzierun} /></strong>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.dieVomBbsrBereitgestellte} /></p>
            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-sans leading-normal">
              <li><MdText text={inhalt.texte.identifikationJederBaustoffBesitzt} /></li>
              <li><MdText text={inhalt.texte.datenstrukturXmlFormatierungNach} /></li>
              <li><MdText text={inhalt.texte.normativeBasisEnthältLca} /></li>
            </ul>
            <a href="https://www.oekobaudat.de" target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1 self-start mt-1">
              oekobaudat.de <ExternalLink size={11} />
            </a>
          </div>

          {/* Database 2: DGNB Navigator */}
          <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${activeEcoDb === 'dgnb' ? 'bg-emerald-50/30 border-emerald-400' : 'bg-white border-stone-200 hover:bg-slate-50'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold text-[9px] uppercase rounded"><MdText text={inhalt.texte.dgnbNavigatorEV} /></span>
              <button onClick={() => setActiveEcoDb('dgnb')} className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"><MdText text={inhalt.texte.detailsAnsehen2} /><ArrowRight size={10} />
              </button>
            </div>
            <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.brückeZwischenEpdsBewertungssystemen} /></strong>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.dieOnlinePlattformDer} /></p>
            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-sans leading-normal">
              <li><MdText text={inhalt.texte.dgnbNavigatorCodeEinheitlicher} /></li>
              <li><MdText text={inhalt.texte.fokusSchadstofffreiheitDeklariertDirekt} /></li>
              <li><MdText text={inhalt.texte.kreislauffähigkeitListetKonkreteRückbauf} /></li>
            </ul>
            <a href="https://www.dgnb-navigator.de" target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1 self-start mt-1">
              dgnb-navigator.de <ExternalLink size={11} />
            </a>
          </div>

          {/* Database 3: IBU.data / IBU e.V. */}
          <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${activeEcoDb === 'ibu' ? 'bg-emerald-50/30 border-emerald-400' : 'bg-white border-stone-200 hover:bg-slate-50'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[9px] uppercase rounded"><MdText text={inhalt.texte.ibuDataIbuE} /></span>
              <button onClick={() => setActiveEcoDb('ibu')} className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"><MdText text={inhalt.texte.detailsAnsehen3} /><ArrowRight size={10} />
              </button>
            </div>
            <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.dasOffizielleEpdHerstellerportal} /></strong>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.dasInstitutBauenUnd} /></p>
            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-sans leading-normal">
              <li><MdText text={inhalt.texte.pcrKontrolleGewährleistetEinheitliche} /></li>
              <li><MdText text={inhalt.texte.datenfilterFilterungNachSpezifischen} /></li>
              <li><MdText text={inhalt.texte.vollständigkeitPrimäreEpdsEnthalten} /></li>
            </ul>
            <a href="https://ibu-epd.com" target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1 self-start mt-1">
              ibu-epd.com <ExternalLink size={11} />
            </a>
          </div>

          {/* Database 4: WECOBIS / LNID */}
          <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${activeEcoDb === 'wecobis' ? 'bg-emerald-50/30 border-emerald-400' : 'bg-white border-stone-200 hover:bg-slate-50'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold text-[9px] uppercase rounded"><MdText text={inhalt.texte.wecobisBbsr} /></span>
              <button onClick={() => setActiveEcoDb('wecobis')} className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"><MdText text={inhalt.texte.detailsAnsehen4} /><ArrowRight size={10} />
              </button>
            </div>
            <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.ökologischesProduktinformationssystem} /></strong>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.gemeinsamesInformationsportalDesBundes} /></p>
            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-sans leading-normal">
              <li><MdText text={inhalt.texte.interaktivePlanungshilfenListetVor} /></li>
              <li><MdText text={inhalt.texte.qngSchnittstelleLeitfadenZur} /></li>
              <li><MdText text={inhalt.texte.lebenszyklusBetrachtungBeschreibtÖkologi} /></li>
            </ul>
            <a href="https://www.wecobis.de" target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1 self-start mt-1">
              wecobis.de <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Dynamic scenario display based on active database click */}
        <div className="bg-slate-50/60 p-5 rounded-2xl border border-home-grau/30 shadow-2xs space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2 border-b border-stone-200 pb-2 animate-in fade-in">
            <Compass size={14} className="text-shiraz" /><MdText text={inhalt.texte.interaktiverPraxisFahrplanZur} /></h4>

          {activeEcoDb === 'oekobaudat' && (
            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
              <p><MdText text={inhalt.texte.anwendungsfallInArbeitsentwürfenElca} /></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-emerald-900 block font-mono"><MdText text={inhalt.texte.t1UuidMappingIn} /></span>
                  <p className="text-slate-500 leading-relaxed"><MdText text={inhalt.texte.umDieBauteilflächenEiner} /><code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono text-purple-700">8d94e77d-7c25-4fc1-aee4-20b6697b0a8f</code>.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-emerald-900 block font-mono"><MdText text={inhalt.texte.t2AnrechnungQngSicherheitszuschlag} /></span>
                  <p className="text-slate-500 leading-relaxed"><MdText text={inhalt.texte.inDerÖkobaudatKönnen} /></p>
                </div>
              </div>
              <div className="bg-emerald-50/20 border-l-4 border-emerald-500 p-3 rounded-r-lg text-[10.5px] text-emerald-950">
                <span className="font-bold"><MdText text={inhalt.texte.akademischerNachweistipp} /></span><MdText text={inhalt.texte.versuchenSieStetsDurch} /></div>
            </div>
          )}

          {activeEcoDb === 'dgnb' && (
            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
              <p><MdText text={inhalt.texte.anwendungsfallInProjektenZertifikatsbewe} /></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-emerald-950 block font-mono"><MdText text={inhalt.texte.t1ProduktdeklarationenImNavigator} /></span>
                  <p className="text-slate-500 leading-relaxed font-sans"><MdText text={inhalt.texte.herstellerRegistrierenIhreProdukte} /></p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-emerald-950 block font-mono"><MdText text={inhalt.texte.t2KriteriumEnv1} /></span>
                  <p className="text-slate-500 leading-relaxed font-sans"><MdText text={inhalt.texte.derNavigatorDeklariertIn} /></p>
                </div>
              </div>
              <div className="bg-sky-50/20 border-l-4 border-sky-500 p-3 rounded-r-lg text-[10.5px] text-sky-950">
                <span className="font-bold"><MdText text={inhalt.texte.regelungFürDiePraxis} /></span><MdText text={inhalt.texte.derDgnbNavigatorVerknüpft} /></div>
            </div>
          )}

          {activeEcoDb === 'ibu' && (
            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
              <p><MdText text={inhalt.texte.anwendungsfallAusstellungUndÜberprüfung} /></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-amber-950 block font-mono"><MdText text={inhalt.texte.t1AufbauVonHerstellereigenen} /></span>
                  <p className="text-slate-500 leading-relaxed font-sans"><MdText text={inhalt.texte.dieHerstellerErmittelnDie} /></p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-amber-950 block font-mono"><MdText text={inhalt.texte.t2AuslesenVonLebenszyklusmodulen} /></span>
                  <p className="text-slate-500 leading-relaxed font-sans"><MdText text={inhalt.texte.inDerHerstellereigenenIbu} /></p>
                </div>
              </div>
              <div className="bg-amber-50/20 border-l-4 border-amber-500 p-3 rounded-r-lg text-[10.5px] text-amber-950">
                <span className="font-bold"><MdText text={inhalt.texte.bedeutungImLebensende} /></span><MdText text={inhalt.texte.epdsEnthaltenInModul} /></div>
            </div>
          )}

          {activeEcoDb === 'wecobis' && (
            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
              <p><MdText text={inhalt.texte.anwendungsfallSchadstoffvermeidungUndVoc} /></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-rose-950 block font-mono"><MdText text={inhalt.texte.t1BauökologischesMaterialscreening} /></span>
                  <p className="text-slate-500 leading-relaxed font-sans"><MdText text={inhalt.texte.architektenSuchenVorAusschreibungen} /></p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-rose-950 block font-mono"><MdText text={inhalt.texte.t2EinhaltungDesQng} /></span>
                  <p className="text-slate-500 leading-relaxed font-sans"><MdText text={inhalt.texte.umFürKrediteDie} /></p>
                </div>
              </div>
              <div className="bg-rose-50/20 border-l-4 border-rose-500 p-3 rounded-r-lg text-[10.5px] text-rose-950">
                <span className="font-bold"><MdText text={inhalt.texte.verbindungDerModule} /></span><MdText text={inhalt.texte.nutzenSieWecobisParallel} /></div>
            </div>
          )}
        </div>
      </div>
    );
}
