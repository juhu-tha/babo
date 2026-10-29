import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  CheckCircle2,
  HardHat,
  Eye,
  Ear,
  Wind,
  Flame,
  Zap,
  Ban,
  FileText,
  Printer,
  BookOpen,
  Box
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { BlockMath, InlineMath } from 'react-katex';
import inhalt from '@/content/laborsicherheit/LaborSicherheit.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

export type LaborTab = 'uebersicht' | 'regeln' | 'psa' | 'maschinen' | 'gefahrstoffe' | 'notfall';

export default function LaborSicherheit() {
  const [activeTab, setActiveTab] = useState<LaborTab>('uebersicht');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* 1. Header & Quick Info Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
              <ShieldAlert size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-shiraz text-white"><MdText text={inhalt.texte.clusterViStudiumLehre} /></span>
                <span className="text-xs text-text-main/60 font-semibold"><MdText text={inhalt.texte.gebäudeG2ThAugsburg} /></span>
              </div>
              <h2 className="text-2xl font-bold text-text-main mt-0.5"><MdText text={inhalt.texte.sicherheitImBaustofflabor} /></h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-text-main bg-off-white hover:bg-home-grau/20 border border-home-grau/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title={inhalt.werte.sicherheitsordnungAusdrucken}
            >
              <Printer size={15} /><MdText text={inhalt.texte.aushangDrucken} /></button>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"><MdText text={inhalt.texte.gültigAbWs2026} /></span>
          </div>
        </div>

        {/* Institution & Laborleitung Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
            <span className="text-text-main/60 block font-medium"><MdText text={inhalt.texte.einrichtungFakultät} /></span>
            <strong className="text-text-main text-sm block"><MdText text={inhalt.texte.laborFürBaustofftechnologieUmwelt} /></strong>
            <span className="text-text-main/80 text-[11px]"><MdText text={inhalt.texte.fakultätFürArchitekturUnd} /></span>
          </div>
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
            <span className="text-text-main/60 block font-medium">Laborleitung</span>
            <strong className="text-shiraz text-sm block"><MdText text={inhalt.texte.laborleitungFunktion} /></strong>
            <span className="text-text-main/80 text-[11px]"><MdText text={inhalt.texte.laborleitungErreichbar} /></span>
          </div>
          <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-rose-950">
            <span className="text-rose-700 block font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <PhoneCall size={12} /><MdText text={inhalt.texte.notrufErsthelferG2} /></span>
            <strong className="text-rose-900 text-sm block"><MdText text={inhalt.texte.notruf112Festnetz0} /></strong>
            <span className="text-rose-800 text-[11px]"><MdText text={inhalt.texte.ersthelferAushang} /></span>
          </div>
        </div>

      </div>

      <ModuleTabs
        label={inhalt.werte.bereicheLaborsicherheit}
        tabs={[
          { id: 'uebersicht' as const, label: inhalt.werte.übersichtLaborordnung, icon: FileText },
          { id: 'regeln' as const, label: inhalt.werte.die8Sicherheitsregeln, icon: ShieldAlert },
          { id: 'psa' as const, label: inhalt.werte.psaEinzugsgefahr, icon: HardHat },
          { id: 'maschinen' as const, label: inhalt.werte.sperrgeräteMaschinen, icon: Zap },
          { id: 'gefahrstoffe' as const, label: inhalt.werte.gefahrstoffeZementStaub, icon: Flame },
          // Notruf 112 bisher als Plakette neben dem Reitertext
          { id: 'notfall' as const, label: `${inhalt.werte.notfallmaßnahmenGebäudeG2} 112`, icon: AlertTriangle }
        ]}
        aktiv={activeTab}
        onWechsel={setActiveTab}
        className="flex flex-col gap-6"
      >
      {/* TAB 1: ÜBERSICHT */}
      {activeTab === 'uebersicht' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <BookOpen className="text-shiraz" size={20} /><MdText text={inhalt.texte.präambelSicherheitsphilosophieImBaustoff} /></h3>
              <span className="text-xs text-text-main/60"><MdText text={inhalt.texte.dguvInformation213850} /></span>
            </div>

            <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dasBaustofflaborDerTechnischen} /></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950 flex flex-col gap-2">
                <strong className="text-amber-900 flex items-center gap-1.5 text-sm">
                  <AlertTriangle size={16} className="text-amber-700" /><MdText text={inhalt.texte.wichtigsteGrundregelAufsichtStopp} /></strong>
                <p className="text-xs leading-relaxed text-amber-900/90"><MdText text={inhalt.texte.mitarbeitendeHabenImLabor} /></p>
              </div>

              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl text-rose-950 flex flex-col gap-2">
                <strong className="text-rose-900 flex items-center gap-1.5 text-sm">
                  <Ban size={16} className="text-rose-700" /><MdText text={inhalt.texte.striktesAlleinarbeitsverbot} /></strong>
                <p className="text-xs leading-relaxed text-rose-900/90"><MdText text={inhalt.texte.striktesAlleinarbeitsverbotBeiAllen} /></p>
              </div>
            </div>

            {/* Quick Overview Table of the 8 Rules */}
            <div className="mt-2 overflow-x-auto">
              <h4 className="text-sm font-bold text-text-main mb-2"><MdText text={inhalt.texte.die8SäulenDer} /></h4>
              <table className="w-full text-left text-xs border border-home-grau/25 rounded-xl overflow-hidden min-w-[600px]">
                <thead className="bg-off-white text-text-main border-b border-home-grau/20">
                  <tr>
                    <th className="py-2.5 px-3 font-bold w-12">Nr.</th>
                    <th className="py-2.5 px-4 font-bold">Sicherheitsbereich</th>
                    <th className="py-2.5 px-4 font-bold"><MdText text={inhalt.texte.verbindlicheKernanforderung} /></th>
                    <th className="py-2.5 px-3 font-bold">Zuständigkeit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/15">
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">1</td>
                    <td className="py-2.5 px-4 font-bold"><MdText text={inhalt.texte.aufsichtspflichtStoppGebot} /></td>
                    <td className="py-2.5 px-4 text-text-main/80"><MdText text={inhalt.texte.volleAufsichtspflichtSofortigerAbbruch} /></td>
                    <td className="py-2.5 px-3 font-mono"><MdText text={inhalt.texte.dozierendeBetreuer} /></td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">2</td>
                    <td className="py-2.5 px-4 font-bold"><MdText text={inhalt.texte.zutrittAlleinarbeitsverbot} /></td>
                    <td className="py-2.5 px-4 text-text-main/80"><MdText text={inhalt.texte.keinZutrittFürUnbefugte} /></td>
                    <td className="py-2.5 px-3 font-mono"><MdText text={inhalt.texte.allePersonen} /></td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">3</td>
                    <td className="py-2.5 px-4 font-bold"><MdText text={inhalt.texte.geräteberechtigungSperrgeräte} /></td>
                    <td className="py-2.5 px-4 text-text-main/80"><MdText text={inhalt.texte.bedienungVonGroßgerätenNur} /></td>
                    <td className="py-2.5 px-3 font-mono">Fachpersonal</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">4</td>
                    <td className="py-2.5 px-4 font-bold"><MdText text={inhalt.texte.persönlicheSchutzausrüstungPsa} /></td>
                    <td className="py-2.5 px-4 text-text-main/80"><MdText text={inhalt.texte.s3SchuheBrilleGehör} /></td>
                    <td className="py-2.5 px-3 font-mono"><MdText text={inhalt.texte.alleImLabor} /></td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">5</td>
                    <td className="py-2.5 px-4 font-bold"><MdText text={inhalt.texte.prüfpressenSägenMischer} /></td>
                    <td className="py-2.5 px-4 text-text-main/80"><MdText text={inhalt.texte.splitterschutzSchließenNassschnittQuarz} /></td>
                    <td className="py-2.5 px-3 font-mono">Bedienende</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">6</td>
                    <td className="py-2.5 px-4 font-bold"><MdText text={inhalt.texte.kranHebezeugeFlurförderzeuge} /></td>
                    <td className="py-2.5 px-4 text-text-main/80"><MdText text={inhalt.texte.nieUnterSchwebendeLasten} /></td>
                    <td className="py-2.5 px-3 font-mono">Kran-/Staplerschein</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">7</td>
                    <td className="py-2.5 px-4 font-bold"><MdText text={inhalt.texte.gefahrstoffeZementQuarzstaub} /></td>
                    <td className="py-2.5 px-4 text-text-main/80"><MdText text={inhalt.texte.zementPh12Ätzend} /></td>
                    <td className="py-2.5 px-3 font-mono"><MdText text={inhalt.texte.allePersonen2} /></td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">8</td>
                    <td className="py-2.5 px-4 font-bold"><MdText text={inhalt.texte.ordnungHygieneElektrik} /></td>
                    <td className="py-2.5 px-4 text-text-main/80"><MdText text={inhalt.texte.absolutesEssTrinkUnd} /></td>
                    <td className="py-2.5 px-3 font-mono"><MdText text={inhalt.texte.allePersonen3} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIE 8 SICHERHEITSREGELN (VOLLSTÄNDIGER TEXT) */}
      {activeTab === 'regeln' && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-200">
          
          {/* Regel 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">1</span>
              <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.volleAufsichtspflichtStoppGebot} /></h3>
            </div>
            <p className="text-sm text-text-main/85 leading-relaxed bg-off-white p-4 rounded-xl border border-home-grau/20"><MdText text={inhalt.texte.mitarbeitendeHabenImLabor2} /></p>
            <div className="text-xs text-text-main/70 flex items-center gap-2 mt-1">
              <span className="font-semibold text-shiraz">Konsequenz:</span>
              <span><MdText text={inhalt.texte.wiederaufnahmeDerVersucheErst} /></span>
            </div>
          </div>

          {/* Regel 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">2</span>
              <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.zutrittskontrolleStriktesAlleinarbeitsve} /></h3>
            </div>
            <p className="text-sm text-text-main/85 leading-relaxed bg-off-white p-4 rounded-xl border border-home-grau/20"><MdText text={inhalt.texte.zutrittZumLaborNur} /></p>
          </div>

          {/* Regel 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">3</span>
              <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.geräteberechtigungBeachtenSperrgeräte} /></h3>
            </div>
            <p className="text-sm text-text-main/85 leading-relaxed bg-off-white p-4 rounded-xl border border-home-grau/20"><MdText text={inhalt.texte.steinsägenKernbohrgeräteGroßprüfpressenB} /></p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200"><MdText text={inhalt.texte.steinsägenNassschnitt} /></span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200"><MdText text={inhalt.texte.kernbohrgeräte} /></span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200"><MdText text={inhalt.texte.großprüfpressen} /></span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200"><MdText text={inhalt.texte.backenbrecher} /></span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200"><MdText text={inhalt.texte.brückenkran} /></span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200"><MdText text={inhalt.texte.staplerEAmeise} /></span>
            </div>
          </div>

          {/* Regel 4 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">4</span>
              <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.persönlicheSchutzausrüstungPsaKonsequent} /></h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
                <HardHat className="text-shiraz shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="text-text-main block"><MdText text={inhalt.texte.sicherheitsschuheS3} /></strong>
                  <span className="text-text-main/80"><MdText text={inhalt.texte.pflichtInDerGesamten} /></span>
                </div>
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
                <Eye className="text-shiraz shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="text-text-main block">Schutzbrille:</strong>
                  <span className="text-text-main/80"><MdText text={inhalt.texte.pflichtBeimMischenUmgang} /></span>
                </div>
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
                <Ear className="text-shiraz shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="text-text-main block">Gehörschutz:</strong>
                  <span className="text-text-main/80"><MdText text={inhalt.texte.pflichtBeimSägenRütteln} /></span>
                </div>
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
                <Wind className="text-shiraz shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="text-text-main block"><MdText text={inhalt.texte.atemschutzFfp2Ffp3} /></strong>
                  <span className="text-text-main/80"><MdText text={inhalt.texte.pflichtBeimAbwiegenUmfüllen} /></span>
                </div>
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5 md:col-span-2">
                <ShieldCheck className="text-shiraz shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="text-text-main block">Handschuhe:</strong>
                  <span className="text-text-main/80"><MdText text={inhalt.texte.wasserdichteNitrilhandschuheBeiFrischbet} /></span>
                </div>
              </div>
            </div>

            {/* Rot-markierte Alarm-Box zur Einzugsgefahr */}
            <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-xl text-rose-950 flex flex-col gap-1.5 mt-1">
              <strong className="text-rose-900 font-extrabold text-sm flex items-center gap-2">
                <Ban size={18} className="text-rose-700" /><MdText text={inhalt.texte.achtungAbsolutesHandschuhRing} /></strong>
              <p className="text-xs leading-relaxed text-rose-900 font-medium"><MdText text={inhalt.texte.anRotierendenMaschinenSteinsäge} /></p>
            </div>
          </div>

          {/* Regel 5 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">5</span>
              <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.sicherheitAnPrüfpressenSägen} /></h3>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Prüfpressen:</strong><MdText text={inhalt.texte.prüfkörperZentrischEinbauenVor} /></div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Steinsägen:</strong><MdText text={inhalt.texte.nurImNassschnittArbeiten} /></div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.mischerBrecher} /></strong><MdText text={inhalt.texte.schutzgitterNiemalsÜberbrückenVor} /></div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Trockenschränke:</strong><MdText text={inhalt.texte.niemalsBrennbareFlüssigkeitenOder} /></div>
            </div>
          </div>

          {/* Regel 6 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">6</span>
              <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.kranHebezeugeFlurförderzeugeStapler} /></h3>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.sichtprüfungVorArbeitsbeginn} /></strong><MdText text={inhalt.texte.vorGebrauchKranLasthaken} /></div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-shiraz block mb-0.5">Gefahrenbereich:</strong><MdText text={inhalt.texte.niemalsUnterSchwebendeLasten} /></div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.staplerEAmeise2} /></strong><MdText text={inhalt.texte.nurMitGültigerBerechtigung} /></div>
            </div>
          </div>

          {/* Regel 7 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">7</span>
              <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.gefahrstoffeZementQuarzstaubEpoxidharze} /></h3>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200">
                <strong className="text-rose-900 block mb-0.5"><MdText text={inhalt.texte.zementFrischbetonIstStark} /></strong><MdText text={inhalt.texte.verursachtSchwereAugenschädenUnd} /></div>
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                <strong className="text-amber-900 block mb-0.5"><MdText text={inhalt.texte.quarzfeinstaubIstKrebserzeugendAlveoleng} /></strong><MdText text={inhalt.texte.immerPunktabsaugungNutzenAbsolutes} /></div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.keineSchadstoffprobenImBaustofflabor} /></strong><MdText text={inhalt.texte.kontaminierteVerdachtsprobenZB} /></div>
            </div>
          </div>

          {/* Regel 8 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">8</span>
              <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.ordnungHygieneElektrik2} /></h3>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.nahrungsGenussmittelverbot} /></strong><MdText text={inhalt.texte.keinEssenTrinkenOder} /></div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.fluchtwegeRettungseinrichtungen} /></strong><MdText text={inhalt.texte.fluchtwegeFeuerlöscherNotduschenUnd} /></div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.elektrischeSicherheit} /></strong><MdText text={inhalt.texte.elektrischeGeräteVorGebrauch} /></div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PSA & EINZUGSGEFAHR */}
      {activeTab === 'psa' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <HardHat className="text-shiraz" size={20} /><MdText text={inhalt.texte.persönlicheSchutzausrüstungPsaAusstattun} /></h3>

            {/* Alarm Box */}
            <div className="p-5 bg-rose-50 border-2 border-rose-400 rounded-2xl text-rose-950 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-base">
                <Ban size={22} className="text-rose-700" /><MdText text={inhalt.texte.höchsteVorsichtRotierendeWellen} /></div>
              <p className="text-xs leading-relaxed text-rose-950"><MdText text={inhalt.texte.anAllenRotierendenMaschinen} /></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-rose-200 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-rose-900">
                  <CheckCircle2 size={14} className="text-rose-700" /><MdText text={inhalt.texte.haareFestZusammenbinden} /></span>
                <span className="flex items-center gap-1.5 font-bold text-rose-900">
                  <CheckCircle2 size={14} className="text-rose-700" /><MdText text={inhalt.texte.ärmelNachInnenUmschlagen} /></span>
              </div>
            </div>

            {/* PSA Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main flex items-center gap-2">
                    <Box size={16} className="text-shiraz" /><MdText text={inhalt.texte.sicherheitsschuheS32} /></strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-home-grau/30">Dauerpflicht</span>
                </div>
                <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.ausstattungMitZehenschutzkappe200} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main flex items-center gap-2">
                    <Eye size={16} className="text-shiraz" /><MdText text={inhalt.texte.schutzbrilleMitSeitenschutz} /></strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-home-grau/30">EN 166</span>
                </div>
                <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.schütztGegenZementspritzerHarze} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main flex items-center gap-2">
                    <Ear size={16} className="text-shiraz" /><MdText text={inhalt.texte.kapselOderStöpselGehörschutz} /></strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-home-grau/30">Ab 85 dB(A)</span>
                </div>
                <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.pflichtBeimBetriebVon} /></p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main flex items-center gap-2">
                    <Wind size={16} className="text-shiraz" /><MdText text={inhalt.texte.atemschutzmaskeFfp2Ffp3} /></strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-home-grau/30">Partikelfilter</span>
                </div>
                <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.zwingendBeimEinwiegenUnd} /></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SPERRGERÄTE & MASCHINEN */}
      {activeTab === 'maschinen' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Zap className="text-shiraz" size={20} /><MdText text={inhalt.texte.sperrgeräteMaschinenrichtlinien} /></h3>
              <span className="text-xs text-shiraz font-bold bg-shiraz/10 px-2.5 py-1 rounded-lg"><MdText text={inhalt.texte.keineSelbstständigeNutzungDurch} /></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Prüfpressen */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.großprüfpressenDruckBiegung} /></h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">5000 kN</span>
                </div>
                <ul className="text-xs text-text-main/80 space-y-1.5 list-disc pl-4 mt-1">
                  <li><MdText text={inhalt.texte.zentrischerEinbauProbekörperExakt} /></li>
                  <li><MdText text={inhalt.texte.splitterschutzSchutzgitterSchutzhaubeVor} /></li>
                  <li><MdText text={inhalt.texte.quetschgefahrNiemalsWährendDer} /></li>
                  <li><MdText text={inhalt.texte.explosionsbruchHochfesteBetoneAb} /></li>
                </ul>
              </div>

              {/* Steinsägen */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.steintrennsägenBohrer} /></h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Diamantwerkzeuge</span>
                </div>
                <ul className="text-xs text-text-main/80 space-y-1.5 list-disc pl-4 mt-1">
                  <li><MdText text={inhalt.texte.ausschließlichNassschnittKühlwasserzufuh} /></li>
                  <li><MdText text={inhalt.texte.werkstückspannungBetonwürfelBohrkerneOde} /></li>
                  <li><MdText text={inhalt.texte.fiSchutzPrcdS} /></li>
                  <li><MdText text={inhalt.texte.handschuhverbotNiemalsMitHandschuhen} /></li>
                </ul>
              </div>

              {/* Mischer & Brecher */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.betonmischerBackenbrecher} /></h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Zwangsmischer</span>
                </div>
                <ul className="text-xs text-text-main/80 space-y-1.5 list-disc pl-4 mt-1">
                  <li><MdText text={inhalt.texte.schutzgitterÜberbrückungVerbotenDer} /></li>
                  <li><MdText text={inhalt.texte.reinigungWartungVorDem} /></li>
                  <li><MdText text={inhalt.texte.zuschlägeEinfüllenGesteinskörnungenVorsi} /></li>
                </ul>
              </div>

              {/* Kran & Flurförderzeuge */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.brückenkranFlurförderzeuge} /></h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">Hebezeuge</span>
                </div>
                <ul className="text-xs text-text-main/80 space-y-1.5 list-disc pl-4 mt-1">
                  <li><MdText text={inhalt.texte.anschlagmittelCheckHebebänderRundschling} /></li>
                  <li><MdText text={inhalt.texte.absturzbereichMeidenNiemalsUnter} /></li>
                  <li><MdText text={inhalt.texte.staplerElektroAmeiseBedienung} /></li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GEFAHRSTOFFE */}
      {activeTab === 'gefahrstoffe' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Flame className="text-shiraz" size={20} /><MdText text={inhalt.texte.gefahrstoffeImBaustofflaborToxikologie} /></h3>
              <span className="text-xs text-text-main/60"><MdText text={inhalt.texte.gefstoffvTrgs559} /></span>
            </div>

            <div className="space-y-4">
              
              {/* Zement */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.t1ZementKalkFrischbeton} /></strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold"><MdText text={inhalt.texte.ätzendGhs05} /></span>
                </div>
                <div className="text-xs text-text-main/80 leading-relaxed space-y-2">
                  <p><MdText text={inhalt.texte.beiKontaktMitWasser} /></p>
                  <BlockMath math="\text{pH} = -\log_{10}[H^+] \approx 12{,}5 - 13{,}5 \quad (\text{stark alkalisch / ätzend})" />
                  <div className="p-3 bg-white rounded-lg border border-rose-200 text-rose-950"><MdText text={inhalt.texte.sofortmaßnahmeBeiAugenkontaktDas} /></div>
                </div>
              </div>

              {/* Quarzfeinstaub */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.t2QuarzfeinstaubAlveolengängigeFraktion} /></strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold"><MdText text={inhalt.texte.krebserzeugendKat1a} /></span>
                </div>
                <div className="text-xs text-text-main/80 leading-relaxed space-y-2">
                  <p><MdText text={inhalt.texte.kristallinesSiliciumdioxidTextSio} /></p>
                  <div className="p-3 bg-white rounded-lg border border-amber-200 text-amber-950 font-medium"><MdText text={inhalt.texte.striktesTrockenkehrverbotNiemalsTrockene} /></div>
                </div>
              </div>

              {/* Epoxidharze */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.t3ReaktionsharzeEpoxidharzeEp} /></strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold"><MdText text={inhalt.texte.sensibilisierendGhs0708} /></span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.harzUndHärterkomponentenKönnen} /></p>
              </div>

              {/* Schadstoffproben */}
              <div className="p-5 bg-rose-50/60 rounded-xl border border-rose-300 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-rose-950"><MdText text={inhalt.texte.t4KeineSchadstoffprobenIm} /></strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold"><MdText text={inhalt.texte.striktesVerbot} /></span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed"><MdText text={inhalt.texte.probenMitVerdachtAuf} /></p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 6: NOTFALLMASSNAHMEN (GEBÄUDE G2) */}
      {activeTab === 'notfall' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/20 pb-3">
              <div>
                <h3 className="text-lg font-bold text-rose-900 flex items-center gap-2">
                  <AlertTriangle className="text-shiraz" size={22} /><MdText text={inhalt.texte.notfallUndSofortmassnahmenGebäude} /></h3>
                <span className="text-xs text-text-main/70"><MdText text={inhalt.texte.standortThAugsburgCampus} /></span>
              </div>
              <div className="px-4 py-2 bg-shiraz text-white font-mono font-bold text-base rounded-xl shadow-xs">
                NOTRUF: 112
              </div>
            </div>

            {/* 5-Schritte Notfall-Kette */}
            <div className="grid grid-cols-1 gap-3.5">
              
              {/* Schritt 1 */}
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-rose-950 text-sm block"><MdText text={inhalt.texte.notHaltDrückenGefahrenbereich} /></strong>
                  <p className="text-xs text-rose-900 mt-0.5 leading-relaxed"><MdText text={inhalt.texte.maschineSofortDurchSchlag} /></p>
                </div>
              </div>

              {/* Schritt 2 */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-shiraz text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <strong className="text-text-main text-sm block"><MdText text={inhalt.texte.ersteHilfeLeistenErsthelfer} /></strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                      <span className="text-text-main/60 block text-[10px] font-bold uppercase"><MdText text={inhalt.texte.ersthelferinImLabor} /></span>
                      <strong className="text-text-main block"><MdText text={inhalt.texte.ersthelferLabor} /></strong>
                      <span className="text-shiraz font-bold block"><MdText text={inhalt.texte.ueberHochschulzentrale} /></span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                      <span className="text-text-main/60 block text-[10px] font-bold uppercase"><MdText text={inhalt.texte.ersthelferImG2Bau} /></span>
                      <strong className="text-text-main block"><MdText text={inhalt.texte.ersthelferGebaeude} /></strong>
                      <span className="text-shiraz font-bold block"><MdText text={inhalt.texte.ueberHochschulzentrale} /></span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                      <span className="text-text-main/60 block text-[10px] font-bold uppercase">Laborpersonal</span>
                      <strong className="text-text-main block"><MdText text={inhalt.texte.sicherheitsbeauftragte} /></strong>
                      <span className="text-shiraz font-bold block"><MdText text={inhalt.texte.ueberHochschulzentrale} /></span>
                      <span className="text-text-main/70 text-[11px]"><MdText text={inhalt.texte.baustofflaborEg} /></span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                      <span className="text-text-main/60 block text-[10px] font-bold uppercase">Laborleitung</span>
                      <strong className="text-text-main block"><MdText text={inhalt.texte.laborleitungKarte} /></strong>
                      <span className="text-shiraz font-bold block"><MdText text={inhalt.texte.ueberHochschulzentrale} /></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schritt 3 */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-shiraz text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <strong className="text-text-main text-sm block"><MdText text={inhalt.texte.notruf112WählenVom} /></strong>
                  <div className="mt-2 p-3 bg-white rounded-lg border border-home-grau/20 text-xs text-text-main/90 space-y-1">
                    <p><MdText text={inhalt.texte.genaueOrtsangabeFürDie} /></p>
                    <p className="font-mono bg-off-white p-2 rounded text-shiraz font-bold"><MdText text={inhalt.texte.technischeHochschuleAugsburgCampus} /></p>
                    <p className="text-[11px] text-text-main/70 pt-1"><MdText text={inhalt.texte.die5WFragen} /></p>
                  </div>
                </div>
              </div>

              {/* Schritt 4 */}
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-300 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <strong className="text-amber-950 text-sm block"><MdText text={inhalt.texte.einweiserSchickenHausserviceInformieren} /></strong>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed"><MdText text={inhalt.texte.zwingendEinePersonAn} /></p>
                  <div className="mt-2 text-xs text-amber-950 font-medium"><MdText text={inhalt.texte.hausserviceInformieren} /></div>
                </div>
              </div>

              {/* Schritt 5 */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <strong className="text-text-main text-sm block"><MdText text={inhalt.texte.dokumentationDArztDurchgangsarzt} /></strong>
                  <p className="text-xs text-text-main/80 mt-1 leading-relaxed"><MdText text={inhalt.texte.jedeNochSoKleine} /></p>
                  <p className="text-xs text-shiraz font-bold mt-1"><MdText text={inhalt.texte.beiJedemArztbesuchNach} /></p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      </ModuleTabs>

      {/* Module Footer with standard DIN/DGUV references */}
      <ModuleFooter
        wikipedia={[
          { title: 'Laborsicherheit' },
          { title: inhalt.werte.persönlicheSchutzausrüstung, url: 'https://de.wikipedia.org/wiki/Pers%C3%B6nliche_Schutzausr%C3%BCstung' },
          { title: 'Durchgangsarzt', url: 'https://de.wikipedia.org/wiki/Durchgangsarzt' }
        ]}
        literatur={inhalt.daten["LaborSicherheit.literatur"]}
        regelwerke={inhalt.daten["LaborSicherheit.regelwerke"]}
        formeln={inhalt.daten["LaborSicherheit.formeln"]}
        lastReviewed={inhalt.werte.oktober2026LaborordnungNotfallplan}
      />

    </div>
  );
}
