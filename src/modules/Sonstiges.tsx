import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  Box, 
  Layers, 
  Droplets, 
  ThermometerSun, 
  Maximize, 
  CircleDashed, 
  Cpu, 
  Activity, 
  Leaf, 
  ShieldCheck, 
  Gauge 
} from 'lucide-react';
import inhalt from '@/content/sonstiges/Sonstiges.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

type SonstigesReiter = 'pcm' | 'leichtzuschlaege' | 'aerogele' | 'selfhealing' | 'photokatalyse' | 'vip';
const REITER: readonly ModulTab<SonstigesReiter>[] = [
  { id: 'pcm', label: inhalt.texte.pcmPhasenwechsel.trim(), icon: ThermometerSun },
  { id: 'leichtzuschlaege', label: 'Leichtzuschläge', icon: CircleDashed },
  { id: 'aerogele', label: 'Aerogele', icon: Box },
  { id: 'selfhealing', label: inhalt.texte.selbstheilenderBeton.trim(), icon: Droplets },
  { id: 'photokatalyse', label: inhalt.texte.smarteBaustoffeTio.trim(), icon: Cpu },
  { id: 'vip', label: inhalt.texte.vakuumDämmungVipMyzel.trim(), icon: Maximize },
];

export default function Sonstiges() {
  const [activeTab, setActiveTab] = useState<SonstigesReiter>('pcm');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="text-shiraz" /><MdText text={inhalt.texte.sonstigeInnovationen} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
          <p><MdText text={inhalt.texte.zusammenfassungWichtigerSpezialthemenDer} /></p>
        </div>

        {/* Dynamic Navigation Sub-tabs */}
        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:py-4 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6">

        {/* 1. SECTION: PCM */}
        {activeTab === 'pcm' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.phasenwechselmaterialienPcmPhaseChange} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <ThermometerSun size={18} /><MdText text={inhalt.texte.funktionsweiseMaterialien} /></h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.prinzipBeimSchmelzenZ} /></li>
                  <li><MdText text={inhalt.texte.paraffineOrganischeKohlenwasserstoffeChe} /></li>
                  <li><MdText text={inhalt.texte.salzhydrateAnorganischeSalzeMit} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Layers size={18} /><MdText text={inhalt.texte.anwendungImBauwesen} /></h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.leichtbauErhöhungDerThermischen} /></li>
                  <li><MdText text={inhalt.texte.kühldeckenIntegrationInAbgehängte} /></li>
                  <li><MdText text={inhalt.texte.funktionsputzeEinmischungVonPcm} /></li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide block mb-1"><MdText text={inhalt.texte.physikalischerHintergrundLatenteWärme} /></span>
              <p className="text-xs text-indigo-950/80 leading-relaxed"><MdText text={inhalt.texte.diePhasenänderungsenthalpieHMelt} /></p>
            </div>
            <FormulaDerivationBox
              title={inhalt.werte.anwendungsbeispielSpeicherwärmeVonPcm}
              zielGleichung="Q = m \cdot (c \cdot \Delta T + \Delta h_m)"
              normQuelle={inhalt.werte.hMFürParaffin}
              schritte={inhalt.daten["Sonstiges.schritte"]}
              ergebnisHinweis={inhalt.werte.imSchmalenKomfortbereichSpeichert}
            />
          </div>
        )}

        {/* 2. SECTION: LEICHTZUSCHLAEGE */}
        {activeTab === 'leichtzuschlaege' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.leichtzuschlägeSindMineralischeOder} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <CircleDashed size={18} /><MdText text={inhalt.texte.artenVonLeichtzuschlägen} /></h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.blähtonGebrannterSpezialtonBei} /></li>
                  <li><MdText text={inhalt.texte.blähglasAusRecyclingmaterialAltglas} /></li>
                  <li><MdText text={inhalt.texte.naturbimsVulkanischerHochporöserNaturste} /></li>
                  <li><MdText text={inhalt.texte.perlitVulkanischerRohperlitsteinMit} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Gauge size={18} /><MdText text={inhalt.texte.eigenschaftenAnwendung} /></h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.konstruktionsleichtbetonKlbHerstellungHo} /></li>
                  <li><MdText text={inhalt.texte.wärmedämmbetonMonolithischerAußenwandbet} /></li>
                  <li><MdText text={inhalt.texte.schüttungenAlsLoseDämm} /></li>
                  <li><MdText text={inhalt.texte.wasseraufnahmePoröseKörnungenSaugen} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. SECTION: AEROGELE */}
        {activeTab === 'aerogele' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.aerogeleSindHochporöseNanostruktur} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Maximize size={18} /><MdText text={inhalt.texte.nanochemischeEigenschaften} /></h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.wärmeleitfähigkeitSehrNiedrig0} /></li>
                  <li><MdText text={inhalt.texte.knudsenEffektDiePorenradien} /></li>
                  <li><MdText text={inhalt.texte.brandschutzReinesSilicaAerogel} /></li>
                  <li><MdText text={inhalt.texte.feuchteMeistHydrophobiertUnd} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Box size={18} /><MdText text={inhalt.texte.highEndAnwendungen} /></h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.aerogelDämmputzHochleistungsdämmputz0} /></li>
                  <li><MdText text={inhalt.texte.bauteilschlitzungEinbauInFensterlaibunge} /></li>
                  <li><MdText text={inhalt.texte.kerndämmungAlsGranuliertesEinblasmateria} /></li>
                  <li><MdText text={inhalt.texte.tageslichtelementeTransluzenteGlasOder} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 4. SECTION: SELBSTHEILENDER BETON (INNOVATION 1) */}
        {activeTab === 'selfhealing' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.selbstheilenderBetonBioBeton} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Leaf className="text-emerald-600" size={18} /><MdText text={inhalt.texte.dasBiochemischePrinzip} /></h3>
                <p className="text-xs text-text-main/70 leading-relaxed mb-3"><MdText text={inhalt.texte.demBetonWerdenAlkalitolerante} /></p>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.auslösungRisseBrechenDie} /></li>
                  <li><MdText text={inhalt.texte.biomineralisationDieBakterienVerstoffwec} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={18} /><MdText text={inhalt.texte.vorteileEinsatzzweck} /></h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.rissbreitenImLaborWurden} /></li>
                  <li><MdText text={inhalt.texte.korrosionsschutzVerhindertDasEindringen} /></li>
                  <li><MdText text={inhalt.texte.anwendungspotenzialSchwerZugänglicheBaut} /></li>
                </ul>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl font-mono text-xs text-emerald-950">
              <span className="font-sans font-bold text-emerald-800 uppercase tracking-wide block mb-1">Stoffwechselgleichung</span><MdText text={inhalt.texte.caCHO} /><span className="font-sans block text-[10px] text-emerald-850 mt-1.5 font-medium font-sans"><MdText text={inhalt.texte.durchDieFällungVon} /></span>
            </div>
          </div>
        )}

        {/* 5. SECTION: SMARTE BAUSTOFFE & TiO2 (INNOVATION 2) */}
        {activeTab === 'photokatalyse' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.smarteFunktionaleWerkstoffeBeschreiben} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Cpu className="text-amber-500" size={18} /><MdText text={inhalt.texte.photokatalyseTitandioxidTio} /></h3>
                <p className="text-xs text-text-main/70 leading-relaxed mb-3"><MdText text={inhalt.texte.wirdDieKristallformAnatas} /></p>
                <ol className="list-decimal list-inside text-xs text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.luftreinigenderEffektSchädlicheStickoxid} /></li>
                  <li><MdText text={inhalt.texte.superhydrophilieSelfCleaningWasser} /></li>
                </ol>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Activity className="text-rose-500" size={18} /><MdText text={inhalt.texte.sensorCarbonfaserbetonIntelligentConcret} /></h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.piezoresistiveEffekteDurchBeimischung} /></li>
                  <li><MdText text={inhalt.texte.bauwerksüberwachungShmLeitfähigerBeton} /></li>
                  <li><MdText text={inhalt.texte.thermobimetallePassiveMetallkomponentenA} /></li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide block mb-1"><MdText text={inhalt.texte.photokatalytischeNoXReduzierung} /></span>
              <p className="text-xs text-amber-950/80 leading-relaxed font-mono"><MdText text={inhalt.texte.tioAnatasHUv} /></p>
              <span className="block text-[10px] text-amber-850 mt-1.5 font-medium leading-relaxed font-sans"><MdText text={inhalt.texte.photokatalytischePflastersteineBelägeUnd} /></span>
            </div>
          </div>
        )}

        {/* 6. SECTION: VIP & MYZEL (INNOVATION 3) */}
        {activeTab === 'vip' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.vakuumisolationspaneeleVipUndBiogene} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Maximize size={18} /><MdText text={inhalt.texte.vakuumisolationspaneeleVip} /></h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.wärmeleitfähigkeitSehrNiedrigBemessungsw} /></li>
                  <li><MdText text={inhalt.texte.kernmaterialMeistVerpressteMikroporöse} /></li>
                  <li><MdText text={inhalt.texte.achtungVerletzlichkeitPaneeleDürfen} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Leaf className="text-emerald-600" size={18} /><MdText text={inhalt.texte.myzelBaustoffeBioKomposite} /></h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.konzeptVerwendungVonPilzmyzel} /></li>
                  <li><MdText text={inhalt.texte.herstellungMyzelfädenWachsenKontrolliert} /></li>
                  <li><MdText text={inhalt.texte.eigenschaftenOhneZusätzeKompostierbar} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        </ModuleTabs>
      </div>
      
      <ModulTest moduleId="sonstiges" />

      <ModuleFooter wikipedia={[
        { title: 'Phasenwechselmaterial', url: 'https://de.wikipedia.org/wiki/Latentw%C3%A4rmespeicher' },
        { title: inhalt.werte.leichteGesteinskörnungBeton, url: 'https://de.wikipedia.org/wiki/Leichtbeton' },
        { title: 'Aerogel', url: 'https://de.wikipedia.org/wiki/Aerogel' },
        { title: inhalt.werte.opusCaementiciumRömischerBeton, url: 'https://de.wikipedia.org/wiki/Opus_caementicium' },
        { title: 'Photokatalyse', url: 'https://de.wikipedia.org/wiki/Photokatalyse' },
        { title: 'Vakuumisolationspaneel', url: 'https://de.wikipedia.org/wiki/Vakuumd%C3%A4mmplatte' }
      ]}
        literatur={inhalt.daten["Sonstiges.literatur"]}
        regelwerke={inhalt.daten["Sonstiges.regelwerke"]}
        formeln={inhalt.daten["Sonstiges.formeln"]}
      />
    </div>
  );
}
