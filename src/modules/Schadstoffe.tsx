import React, { useState } from 'react';
import { AlertTriangle, Wind, Droplets, Flame, Bug, Shield, Search, Globe, Activity } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { formatDeZahl } from '@/src/utils/numberFormat';
import inhalt from '@/content/schadstoffe/Schadstoffe.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';
import { ErgebnisAnsage, ansageWert } from '@/src/components/ui/ErgebnisAnsage';

const SCHADSTOFFE_DATA = [
  {
    id: 'asbest',
    name: 'Asbest',
    gestisUrl: 'https://gestis.dguv.de/search?query=Asbest',
    icon: <Wind size={24} className="text-gray-500" />,
    color: 'bg-gray-50 border-gray-200',
    textColor: 'text-gray-800',
    vorkommen: inhalt.daten["SCHADSTOFFE_DATA.asbest.vorkommen"],
    gefahren: inhalt.daten["SCHADSTOFFE_DATA.asbest.gefahren"],
    entsorgung: inhalt.daten["SCHADSTOFFE_DATA.asbest.entsorgung"]
  },
  {
    id: 'pak',
    name: inhalt.werte.pakPolyzyklischeAromatischeKohlenwassers,
    gestisUrl: 'https://gestis.dguv.de/search?query=Polyzyklische+Aromatische+Kohlenwasserstoffe',
    icon: <Droplets size={24} className="text-black" />,
    color: 'bg-stone-50 border-stone-300',
    textColor: 'text-stone-800',
    vorkommen: inhalt.daten["SCHADSTOFFE_DATA.pak.vorkommen"],
    gefahren: inhalt.daten["SCHADSTOFFE_DATA.pak.gefahren"],
    entsorgung: inhalt.daten["SCHADSTOFFE_DATA.pak.entsorgung"]
  },
  {
    id: 'pcb',
    name: inhalt.werte.pcbPolychlorierteBiphenyle,
    gestisUrl: 'https://gestis.dguv.de/search?query=Polychlorierte+Biphenyle',
    icon: <Flame size={24} className="text-orange-500" />,
    color: 'bg-orange-50 border-orange-200',
    textColor: 'text-orange-800',
    vorkommen: inhalt.daten["SCHADSTOFFE_DATA.pcb.vorkommen"],
    gefahren: inhalt.daten["SCHADSTOFFE_DATA.pcb.gefahren"],
    entsorgung: inhalt.daten["SCHADSTOFFE_DATA.pcb.entsorgung"]
  },
  {
    id: 'kmf',
    name: inhalt.werte.kmfKünstlicheMineralfasern,
    gestisUrl: 'https://gestis.dguv.de/search?query=K%C3%BCnstliche+Mineralfasern',
    icon: <Wind size={24} className="text-slate-500" />,
    color: 'bg-slate-50 border-home-grau/30',
    textColor: 'text-slate-800',
    vorkommen: inhalt.daten["SCHADSTOFFE_DATA.kmf.vorkommen"],
    gefahren: inhalt.daten["SCHADSTOFFE_DATA.kmf.gefahren"],
    entsorgung: inhalt.daten["SCHADSTOFFE_DATA.kmf.entsorgung"]
  },
  {
    id: 'pfas',
    name: inhalt.werte.pfasPerUndPolyfluorierte,
    gestisUrl: 'https://gestis.dguv.de/search?query=PFAS',
    icon: <Droplets size={24} className="text-blue-500" />,
    color: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-800',
    vorkommen: inhalt.daten["SCHADSTOFFE_DATA.pfas.vorkommen"],
    gefahren: inhalt.daten["SCHADSTOFFE_DATA.pfas.gefahren"],
    entsorgung: inhalt.daten["SCHADSTOFFE_DATA.pfas.entsorgung"]
  },
  {
    id: 'chlorparaffine',
    name: inhalt.werte.chlorparaffineChlorierteParaffineCps,
    gestisUrl: 'https://gestis.dguv.de/search?query=Chlorparaffine',
    icon: <Droplets size={24} className="text-zinc-600" />,
    color: 'bg-zinc-50 border-zinc-200',
    textColor: 'text-zinc-800',
    vorkommen: inhalt.daten["SCHADSTOFFE_DATA.chlorparaffine.vorkommen"],
    gefahren: inhalt.daten["SCHADSTOFFE_DATA.chlorparaffine.gefahren"],
    entsorgung: inhalt.daten["SCHADSTOFFE_DATA.chlorparaffine.entsorgung"]
  },
  {
    id: 'quecksilber',
    name: inhalt.werte.quecksilberVerbindungen,
    gestisUrl: 'https://gestis.dguv.de/search?query=Quecksilber',
    icon: <Droplets size={24} className="text-indigo-400" />,
    color: 'bg-indigo-50 border-indigo-200',
    textColor: 'text-indigo-800',
    vorkommen: inhalt.daten["SCHADSTOFFE_DATA.quecksilber.vorkommen"],
    gefahren: inhalt.daten["SCHADSTOFFE_DATA.quecksilber.gefahren"],
    entsorgung: inhalt.daten["SCHADSTOFFE_DATA.quecksilber.entsorgung"]
  },
  {
    id: 'biogefahren',
    name: inhalt.werte.biologischeGefahrstoffe,
    icon: <Bug size={24} className="text-emerald-700" />,
    color: 'bg-emerald-50 border-emerald-200',
    textColor: 'text-emerald-800',
    vorkommen: inhalt.daten["SCHADSTOFFE_DATA.biogefahren.vorkommen"],
    gefahren: inhalt.daten["SCHADSTOFFE_DATA.biogefahren.gefahren"],
    entsorgung: inhalt.daten["SCHADSTOFFE_DATA.biogefahren.entsorgung"]
  }
];

type SchadstoffReiter = 'fasern' | 'pak' | 'pcb' | 'pfas' | 'chlorparaffine' | 'quecksilber' | 'biogefahren';
const SCHADSTOFF_REITER: { id: SchadstoffReiter; label: string; icon: typeof Wind; stoffe: string[] }[] = [
  { id: 'fasern', label: inhalt.werte.asbestKmfFasern, icon: Wind, stoffe: ['asbest', 'kmf'] },
  { id: 'pak', label: 'PAK', icon: Droplets, stoffe: ['pak'] },
  { id: 'pcb', label: 'PCB', icon: Flame, stoffe: ['pcb'] },
  { id: 'pfas', label: 'PFAS', icon: Droplets, stoffe: ['pfas'] },
  { id: 'chlorparaffine', label: 'Chlorparaffine', icon: Droplets, stoffe: ['chlorparaffine'] },
  { id: 'quecksilber', label: 'Quecksilber', icon: Droplets, stoffe: ['quecksilber'] },
  { id: 'biogefahren', label: inhalt.werte.biologischeGefahrstoffe2, icon: Bug, stoffe: ['biogefahren'] }
];

export default function Schadstoffe() {
  const [activeTab, setActiveTab ] = useState<'stoffe' | 'finder' | 'beprobung' | 'elution' | 'gefahrstoffe'>('stoffe');
  
  // AP 3.8: höchstens 7 Reiter je Leiste – Asbest und KMF (beide Faserstoffe) teilen sich einen Reiter.
  const [activeSchadstoff, setActiveSchadstoff] = useState<SchadstoffReiter>('fasern');
  const [selectedMEB, setSelectedMEB] = useState<'rc_baustoff' | 'bodenaushub' | 'hm_asche'>('rc_baustoff');
  const [asbestBaujahr, setAsbestBaujahr] = useState<number>(1990);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<10000 | 50000 | 100000>(50000);
  const [finderZeitraum, setFinderZeitraum] = useState<string>('1970-1989');
  const [finderBauteil, setFinderBauteil] = useState<string>('decken-waende');
  
  // States for interactive KMF oxide calculation (Lung bio-solubility index KI)
  const [oxidNaK, setOxidNaK] = useState<number>(16.2);
  const [oxidCaMg, setOxidCaMg] = useState<number>(4.5);
  const [oxidBaB, setOxidBaB] = useState<number>(0.2);
  const [oxidAl, setOxidAl] = useState<number>(12.5);
  
  const schadstoffReiter = SCHADSTOFF_REITER.find(r => r.id === activeSchadstoff) ?? SCHADSTOFF_REITER[0];
  const ausgewaehlteSchadstoffe = schadstoffReiter.stoffe
    .map(id => SCHADSTOFFE_DATA.find(s => s.id === id))
    .filter((s): s is (typeof SCHADSTOFFE_DATA)[number] => Boolean(s));

  function checkRisks(zeitraum: string, bauteil: string) {
    const risks: { stoff: string, level: 'hoch' | 'mittel' | 'gering', detail: string }[] = [];
    
    if (bauteil === 'decken-waende') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: inhalt.werte.asbestChrysotilAmosit, level: 'hoch', detail: inhalt.werte.spritzasbestAlsBrandschutzAn });
        risks.push({ stoff: inhalt.werte.kmfLungengängigeFasern, level: 'hoch', detail: inhalt.werte.alteLungenbelastendeBiopersistenteMinera });
        risks.push({ stoff: inhalt.werte.pcbPolychlorierteBiphenyle2, level: 'mittel', detail: inhalt.werte.spezielleBrandschutzbeschichtungenAufAku });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: 'Asbest', level: 'mittel', detail: inhalt.werte.restvorkommenInWandspachtelmassenOder });
        risks.push({ stoff: 'KMF', level: 'hoch', detail: inhalt.werte.einsatzLungenbelastenderAltMineralwolle });
      } else {
        risks.push({ stoff: inhalt.werte.vocFlüchtigeOrganischeVerbindungen, level: 'mittel', detail: inhalt.werte.ausgasungenAusLösungsmittelhaltigenFarbe });
        risks.push({ stoff: 'Schimmelpilze', level: 'mittel', detail: inhalt.werte.biologischerBefallAufFeuchten });
      }
    }
    
    if (bauteil === 'bodenbelag') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: inhalt.werte.pakPolyzyklischeAromaten, level: 'hoch', detail: inhalt.werte.ausgezeichneterTeerhaltigerSchwarzerKleb });
        risks.push({ stoff: 'Asbest', level: 'hoch', detail: inhalt.werte.halbstarreVinylBodenbelägeFlex });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: 'Asbest', level: 'gering', detail: inhalt.werte.geringesRestrisikoAusAsbesthaltigen });
        risks.push({ stoff: 'VOC', level: 'mittel', detail: inhalt.werte.freisetzungVonAldehydenZ });
      } else {
        risks.push({ stoff: 'VOC', level: 'mittel', detail: inhalt.werte.ausgasungenVonPolyurethanUnd });
      }
    }
    
    if (bauteil === 'fassade') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: 'Asbest', level: 'hoch', detail: inhalt.werte.asbestzementFassadenbekleidungenFaserzem });
        risks.push({ stoff: 'PCB', level: 'mittel', detail: inhalt.werte.weichmacherhaltigeDauerelastischeFugenma });
        risks.push({ stoff: 'KMF', level: 'mittel', detail: inhalt.werte.krebserzeugendeBiopersistenteMineralwoll });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: inhalt.werte.hbcdFlammschutzmittel, level: 'hoch', detail: inhalt.werte.hbcdHaltigesExpandiertesPolystyrol });
        risks.push({ stoff: 'KMF', level: 'mittel', detail: inhalt.werte.minderwertigLöslicheSteinwolledämmungIn });
      } else {
        risks.push({ stoff: 'HBCD', level: 'mittel', detail: inhalt.werte.epsDämmplattenVerbautBis });
        risks.push({ stoff: inhalt.werte.pfasEwigkeitschemikalien, level: 'gering', detail: inhalt.werte.schmutzUndWasserabweisendeSteingrundieru });
      }
    }
    
    if (bauteil === 'dach') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: 'Asbest', level: 'hoch', detail: inhalt.werte.faserzementWellplattenDacheindeckungMit });
        risks.push({ stoff: 'PAK', level: 'hoch', detail: inhalt.werte.teerUndPechhaltigeKlassische });
        risks.push({ stoff: 'KMF', level: 'hoch', detail: inhalt.werte.alteUnschmelzbareMineralwolleZur });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: 'KMF', level: 'hoch', detail: inhalt.werte.biopersistenteMineralischeWolleZur });
        risks.push({ stoff: 'HBCD', level: 'hoch', detail: inhalt.werte.styroporartigeEpsXpsPlatten });
      } else {
        risks.push({ stoff: 'HBCD', level: 'mittel', detail: inhalt.werte.rückbauVonUnberührtenFlachdachdämmungen });
        risks.push({ stoff: inhalt.werte.biologischeGefahrstoffe3, level: 'mittel', detail: inhalt.werte.massiveTaubenkotAblagerungenAuf });
      }
    }
    
    if (bauteil === 'fugen') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: 'PCB', level: 'hoch', detail: inhalt.werte.dauerelastischeDehnfugenmassenZB });
        risks.push({ stoff: 'Asbest', level: 'mittel', detail: inhalt.werte.asbesthaltigeWeicherKitteUnd });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: inhalt.werte.chlorparaffineCps, level: 'hoch', detail: inhalt.werte.kurzkettigeChlorparaffineSccpsAls });
      } else {
        risks.push({ stoff: 'Chlorparaffine', level: 'mittel', detail: inhalt.werte.mittelkettigeChlorparaffineMccpsIn });
      }
    }
    
    if (bauteil === 'holz') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: inhalt.werte.pcpLindan, level: 'hoch', detail: inhalt.werte.ausgedehntePentachlorphenolUndLindanbela });
        risks.push({ stoff: 'PAK', level: 'mittel', detail: inhalt.werte.carbolineumBalkenbeschichtungenImBewitte });
        risks.push({ stoff: 'Quecksilber-Verbindungen', level: 'gering', detail: inhalt.werte.fungizideBiozidwirkstoffeInBiologischen });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: 'Schwermetall-Verbindungen', level: 'mittel', detail: inhalt.werte.chromKupferBorCkb });
      } else {
        risks.push({ stoff: 'VOC', level: 'mittel', detail: inhalt.werte.aldehydausgasungenFormaldehydAusMitteldi });
      }
    }
    
    if (bauteil === 'technik') {
      if (zeitraum === 'vor-1970' || zeitraum === '1970-1989') {
        risks.push({ stoff: 'PCB', level: 'hoch', detail: inhalt.werte.leckendePcbKondensatorenIn });
        risks.push({ stoff: 'Asbest', level: 'hoch', detail: inhalt.werte.schwachGebundeneBrandschutzklappenBrands });
        risks.push({ stoff: inhalt.werte.schwermetalleBleimennige, level: 'hoch', detail: inhalt.werte.bleihaltigeTrinkwasserleitungenSowieDick });
      } else if (zeitraum === '1990-1999') {
        risks.push({ stoff: 'KMF', level: 'mittel', detail: inhalt.werte.rohrisolationsschalenAufMineralfaseriger });
      } else {
        risks.push({ stoff: 'PFAS', level: 'gering', detail: inhalt.werte.fluorpolymerbeschichtungenFürExtremeHitz });
      }
    }
    
    return risks;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.schadUndGefahrstoffeIn} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.übersichtHistorischerUndAktueller} /></p>
        </div>
        </div>

        <ModuleTabs
          label={inhalt.werte.bereicheSchadstoffe}
          tabs={[
            { id: 'stoffe' as const, label: inhalt.werte.stoffgruppenGefahren, icon: AlertTriangle },
            { id: 'finder' as const, label: 'Fibel-Schadstofffinder', icon: Search },
            { id: 'beprobung' as const, label: inhalt.werte.erkundungBeprobung, icon: Search },
            { id: 'elution' as const, label: inhalt.werte.elutionAusBaustoffen, icon: Droplets },
            { id: 'gefahrstoffe' as const, icon: Shield, label: inhalt.werte.gefahrstoffeAufDerBaustelle }
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          variante="kachel"
          className="[&>[role=tablist]]:p-4 [&>[role=tablist]]:bg-slate-50/50 dark:[&>[role=tablist]]:bg-slate-800/40 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/30"
        >
        <div className="p-6">
          {activeTab === 'stoffe' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                <p><MdText text={inhalt.texte.aufgrundIhrerGesundheitsUnd} /></p>
              </div>

              {/* Schadstoff Selector (zweite Reiterebene, AP 3.8: 7 Reiter) */}
              <ModuleTabs
                label={inhalt.werte.schadstoffgruppeWählen}
                tabs={SCHADSTOFF_REITER}
                aktiv={activeSchadstoff}
                onWechsel={setActiveSchadstoff}
                variante="kachel"
                className="lg:[&>[role=tablist]]:grid-cols-4"
              >

              {/* Selected Schadstoff Details (bei gebündelten Reitern nacheinander) */}
              {ausgewaehlteSchadstoffe.map((selectedSchadstoff) => (
              <div key={selectedSchadstoff.id} className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 mt-4 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-home-grau/30">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-home-grau/30 text-shiraz">
                      {React.cloneElement(selectedSchadstoff.icon as React.ReactElement<{ className?: string }>, { className: 'text-shiraz' })}
                    </div>
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        {selectedSchadstoff.name}
                      </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dguvGeprüfteSchadstoffdatenbank} /></p>
        </div>
                  </div>
                  {selectedSchadstoff.gestisUrl && (
                    <a
                      href={selectedSchadstoff.gestisUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-shiraz hover:bg-shiraz/90 active:scale-95 transition-all rounded-xl shadow-sm border border-shiraz cursor-pointer text-center sm:self-center"
                    >
                      <Globe size={14} /><MdText text={inhalt.texte.offiziellerGestisEintrag} /></a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                    <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-1.5"><MdText text={inhalt.texte.vorkommenVerwendung} /></h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {selectedSchadstoff.vorkommen.map((item, idx) => {
                        const split = item.indexOf(':');
                        if (split > -1) {
                          return <li key={idx}><strong>{item.substring(0, split + 1)}</strong>{item.substring(split + 1)}</li>
                        }
                        return <li key={idx} className="list-disc ml-5">{item}</li>
                      })}
                    </ul>
                  </div>
                  
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                    <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-1.5"><MdText text={inhalt.texte.gefahrenSanierung} /></h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {selectedSchadstoff.gefahren.map((item, idx) => {
                        const split = item.indexOf(':');
                        if (split > -1) {
                          return <li key={idx}><strong>{item.substring(0, split + 1)}</strong>{item.substring(split + 1)}</li>
                        }
                        return <li key={idx} className="list-disc ml-5">{item}</li>
                      })}
                    </ul>
                  </div>
                  
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 md:col-span-2">
                    <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-1.5"><MdText text={inhalt.texte.entsorgungAvvSchutzmaßnahmenPsa} /></h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {selectedSchadstoff.entsorgung.map((item, idx) => {
                        const split = item.indexOf(':');
                        if (split > -1) {
                          return <li key={idx}><strong>{item.substring(0, split + 1)}</strong>{item.substring(split + 1)}</li>
                        }
                        return <li key={idx} className="list-disc ml-5">{item}</li>
                      })}
                    </ul>
                  </div>

                  {selectedSchadstoff.id === 'kmf' && (
                    <div className="bg-blue-50/50 border border-blue-200 p-5 rounded-xl md:col-span-2 space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
                      <div className="flex items-center gap-2 border-b border-blue-200 pb-2">
                        <Activity className="text-blue-700" size={20} />
                        <h5 className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.interaktiverKanzerogenitätsindexKiSchnel} /></h5>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-1"><MdText text={inhalt.texte.gebenSieDieIm} /></p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.naOKO} /></label>
                          <input aria-label={inhalt.werte.naOKO} 
                            type="number" 
                            min="0" 
                            max="30" 
                            step="0.1" 
                            value={oxidNaK} 
                            onChange={(e) => setOxidNaK(parseFloat(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-home-grau/35 text-xs text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.caoMgoGew} /></label>
                          <input aria-label={inhalt.werte.caoMgoGew} 
                            type="number" 
                            min="0" 
                            max="40" 
                            step="0.1" 
                            value={oxidCaMg} 
                            onChange={(e) => setOxidCaMg(parseFloat(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-home-grau/35 text-xs text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.baoBOGew} /></label>
                          <input aria-label={inhalt.werte.baoBOGew} 
                            type="number" 
                            min="0" 
                            max="15" 
                            step="0.1" 
                            value={oxidBaB} 
                            onChange={(e) => setOxidBaB(parseFloat(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-home-grau/35 text-xs text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.alOGew} /></label>
                          <input aria-label={inhalt.werte.alOGew} 
                            type="number" 
                            min="0" 
                            max="30" 
                            step="0.1" 
                            value={oxidAl} 
                            onChange={(e) => setOxidAl(parseFloat(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-home-grau/35 text-xs text-slate-900 bg-white"
                          />
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-blue-100 text-xs font-mono space-y-1">
                        <div>Gleichung: <span className="font-bold text-blue-800"><MdText text={inhalt.texte.kiNaOK} /></span></div>
                        <div className="text-slate-500">
                          Rechnung: ({formatDeZahl(oxidNaK, 1)} + {formatDeZahl(oxidCaMg, 1)} + {formatDeZahl(oxidBaB, 1)}) - (2 · {formatDeZahl(oxidAl, 1)}) = <span className="font-bold text-indigo-700 text-sm">{formatDeZahl((oxidNaK + oxidCaMg + oxidBaB) - 2 * oxidAl, 2)}</span>
                        </div>
                      </div>

                      <ErgebnisAnsage text={(() => {
                        const kiVal = (oxidNaK + oxidCaMg + oxidBaB) - 2 * oxidAl;
                        const stufe = kiVal >= 40 ? 'unbedenklich, biologisch abbaubar' : kiVal <= 30 ? 'krebserzeugend, TRGS 521 pflichtig' : 'Verdachtsbereich, erhöhtes Risiko';
                        return `${ansageWert('Kanzerogenitätsindex KI', kiVal, 2)}: ${stufe}`;
                      })()} />
                      {(() => {
                        const kiVal = (oxidNaK + oxidCaMg + oxidBaB) - 2 * oxidAl;
                        if (kiVal >= 40) {
                          return (
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-xs text-green-950 flex flex-col gap-1">
                              <span className="font-bold flex items-center gap-1 text-green-800"><MdText text={inhalt.texte.unbedenklichBiologischAbbaubarKi} />{formatDeZahl(kiVal, 2)} ≥ 40)</span>
                              <span><MdText text={inhalt.texte.dieMineralfaserIstHinreichend} /></span>
                            </div>
                          );
                        } else if (kiVal <= 30) {
                          return (
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-xs text-red-950 flex flex-col gap-1">
                              <span className="font-bold flex items-center gap-1 text-red-800"><MdText text={inhalt.texte.trgs521PflichtigKrebserzeugend} />{formatDeZahl(kiVal, 2)} ≤ 30)</span>
                              <span><MdText text={inhalt.texte.dieFaserGiltAls} /></span>
                            </div>
                          );
                        } else {
                          return (
                            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950 flex flex-col gap-1">
                              <span className="font-bold flex items-center gap-1 text-amber-800"><MdText text={inhalt.texte.verdachtsbereichErhöhtesRisiko30} />{formatDeZahl(kiVal, 2)} &lt; 40)</span>
                              <span><MdText text={inhalt.texte.esBestehtBegründeterVerdacht} /></span>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>
              </div>
              ))}
              </ModuleTabs>
            </div>
          )}

          {activeTab === 'finder' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Search className="text-shiraz" /><MdText text={inhalt.texte.interaktiverFibelSchadstofffinderGebäude} /></h3>
                <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed"><MdText text={inhalt.texte.stellenSieDasErbauungsjahr} /></p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Auswahlbereich */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono"><MdText text={inhalt.texte.t1ErbauungszeitraumDesGebäudes} /></label>
                      <AuswahlGruppe label="Erbauungszeitraum" className="grid grid-cols-2 gap-2">
                        {inhalt.daten.Schadstoffe.map((z) => (
                          <button {...alsOption(finderZeitraum === z.id)}
                            key={z.id}
                            onClick={() => setFinderZeitraum(z.id)}
                            className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                              finderZeitraum === z.id
                                ? 'bg-shiraz text-white border-shiraz shadow-sm font-semibold'
                                : 'bg-slate-50 border-home-grau/30 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="text-xs font-bold">{z.label}</div>
                            <div className="text-xs opacity-75">{z.desc}</div>
                          </button>
                        ))}
                      </AuswahlGruppe>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono font-semibold"><MdText text={inhalt.texte.t2BetroffenesBauteilMaterialart} /></label>
                      <AuswahlGruppe label="Bauteil oder Materialart" className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-1 border border-home-grau/30 rounded-xl p-2 bg-slate-50/50">
                        {inhalt.daten.Schadstoffe_2.map((b) => (
                          <button {...alsOption(finderBauteil === b.id)}
                            key={b.id}
                            onClick={() => setFinderBauteil(b.id)}
                            className={`p-2.5 rounded-lg border text-left transition-all flex justify-between items-center cursor-pointer ${
                              finderBauteil === b.id
                                ? 'bg-shiraz text-white border-shiraz font-bold'
                                : 'bg-white border-home-grau/30 hover:bg-slate-100 text-slate-800'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold">{b.label}</div>
                              <div className="text-xs opacity-75 font-normal">{b.detail}</div>
                            </div>
                            {finderBauteil === b.id && <span className="text-xs font-bold">✔</span>}
                          </button>
                        ))}
                      </AuswahlGruppe>
                    </div>
                  </div>

                  {/* Ergebnisbereich */}
                  <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-4 border-b border-home-grau/30 pb-2 flex justify-between items-center">
                        <span className="font-extrabold uppercase">Analyseergebnis</span>
                        <span className="text-xs text-slate-500 font-bold px-2 py-0.5 bg-slate-200 rounded">Gefahrenprognose</span>
                      </h4>

                      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                        {checkRisks(finderZeitraum, finderBauteil).map((risk, idx) => (
                          <div key={idx} className="bg-white p-3.5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-1.5 animate-in fade-in duration-200">
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-xs text-slate-900">{risk.stoff}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-extrabold uppercase tracking-wider ${
                                risk.level === 'hoch'
                                  ? 'bg-red-50 text-red-800 border border-red-200'
                                  : risk.level === 'mittel'
                                  ? 'bg-orange-50 text-orange-800 border border-orange-200'
                                  : 'bg-green-50 text-green-800 border border-green-200'
                              }`}>
                                {risk.level}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                              {risk.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-home-grau/30 text-xs text-slate-500 leading-relaxed font-semibold"><MdText text={inhalt.texte.wichtigerHinweisDieseRisikoanalyse} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'beprobung' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Richtlinien zur Beprobung */}
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.erkundungBeprobungWerWie} /></h3>
                <p className="text-sm text-slate-700 mb-6"><MdText text={inhalt.texte.dieErkundungUndProbenahme} /></p>
                
                <div className="bg-shiraz/5 border border-shiraz/30 p-4 rounded-xl mb-6">
                  <p className="text-shiraz font-bold flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" /><MdText text={inhalt.texte.hinweisImZweifelAlso} /></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* LAGA PN 98 */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5"><Droplets size={64} className="text-slate-400" /></div>
                    <h4 className="font-bold text-base mb-3 text-shiraz border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.lagaPn98Abfallbeprobung} /></h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 relative z-10">
                      <li><MdText text={inhalt.texte.wasFesteUndStichfeste} /></li>
                      <li><MdText text={inhalt.texte.warumUmDieExakte} /></li>
                      <li><MdText text={inhalt.texte.werDarfBeprobenAusschliesslich} /></li>
                      <li><MdText text={inhalt.texte.wieFestDefiniertesRaster} /></li>
                    </ul>
                  </div>

                  {/* TRGS 519 */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5"><Wind size={64} className="text-slate-400" /></div>
                    <h4 className="font-bold text-base mb-3 text-shiraz border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.trgs519Asbest} /></h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 relative z-10">
                      <li><MdText text={inhalt.texte.wasVerdächtigeAsbesthaltigeMaterialien} /></li>
                      <li><MdText text={inhalt.texte.warumAsbestfasernSindHochgradig} /></li>
                      <li><MdText text={inhalt.texte.werDarfBeprobenNur} /></li>
                      <li><MdText text={inhalt.texte.wieStaubdichtVerpacktDie} /></li>
                    </ul>
                  </div>

                  {/* TRGS 524 / DGUV */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5"><AlertTriangle size={64} className="text-slate-400" /></div>
                    <h4 className="font-bold text-base mb-3 text-shiraz border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.dguvRegel101004} /></h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 relative z-10">
                      <li><MdText text={inhalt.texte.wasArbeitenInKontaminierten} /></li>
                      <li><MdText text={inhalt.texte.warumGefährdungsbeurteilungUndArbeitssch} /></li>
                      <li><MdText text={inhalt.texte.werEinKoordinatorGem} /></li>
                      <li><MdText text={inhalt.texte.wieDieBeprobungAm} /></li>
                    </ul>
                  </div>

                  {/* VDI 6202 / Schadstoffkataster */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5"><Bug size={64} className="text-slate-400" /></div>
                    <h4 className="font-bold text-base mb-3 text-shiraz border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.vdi6202Blatt1} /></h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 relative z-10">
                      <li><MdText text={inhalt.texte.blatt1AllgemeinesVerfahren} /></li>
                      <li><MdText text={inhalt.texte.mischprobenPsfNachVdi} /></li>
                      <li><MdText text={inhalt.texte.wannDieBeprobungNach} /></li>
                      <li><MdText text={inhalt.texte.vermeidungVonBaustoppsUnentdeckter} /></li>
                    </ul>
                  </div>

                  {/* Gefahrstoffverordnung (GefStoffV) */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5"><Shield size={64} className="text-slate-400" /></div>
                    <h4 className="font-bold text-base mb-3 text-shiraz border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.gefahrstoffverordnungGefstoffv} /></h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 relative z-10">
                      <li><MdText text={inhalt.texte.wasDieNationaleUmsetzung} /></li>
                      <li><MdText text={inhalt.texte.anforderungenAktuellerStandDie} /></li>
                      <li><MdText text={inhalt.texte.erkundungEineGenerelleErkundungspflicht} /></li>
                      <li><MdText text={inhalt.texte.warumNurDurchDiese} /></li>
                    </ul>
                  </div>

                  {/* GISCODE & REACH */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5"><Shield size={64} className="text-slate-400" /></div>
                    <h4 className="font-bold text-base mb-3 text-shiraz border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.giscodeReach} /></h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 relative z-10">
                      <li><MdText text={inhalt.texte.reachVerordnungEgNr} /></li>
                      <li><MdText text={inhalt.texte.giscodeEinAlphanumerischesKlassifizierun} /></li>
                      <li><MdText text={inhalt.texte.warumErleichtertDieErstellung} /></li>
                    </ul>
                  </div>

                </div>
              </section>
            </div>
          )}

          {activeTab === 'elution' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
                  <div className="flex items-center gap-3 border-b border-home-grau/30 pb-4 mb-4">
                    <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                      <Droplets size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.ersatzbaustoffverordnungEbvElution} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.bundesweitEinheitlicheRegelungZum} /></p>
        </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4"><MdText text={inhalt.texte.dieErsatzbaustoffverordnungEbvIst} /></p>
                  
                  {/* Highlight-Panel: EBV vs. BBodSchV */}
                  <div className="bg-amber-50/70 border border-amber-200/60 p-4 rounded-xl text-xs space-y-2 text-amber-950 mb-2">
                    <span className="font-extrabold uppercase tracking-wider block text-xs text-amber-800"><MdText text={inhalt.texte.wichtigeRechtlicheAbgrenzungMantelverord} /></span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <strong className="text-amber-900 block font-bold mb-0.5"><MdText text={inhalt.texte.t1ErsatzbaustoffverordnungEbv} /></strong><MdText text={inhalt.texte.giltAusschließlichFürDen} /></div>
                      <div>
                        <strong className="text-amber-900 block font-bold mb-0.5"><MdText text={inhalt.texte.t2BundesBodenschutzUnd} /></strong><MdText text={inhalt.texte.giltFürDasAuf} /></div>
                    </div>
                  </div>
                </div>

                {/* Analytical Methods Detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30">
                    <h4 className="font-extrabold text-slate-900 text-sm mb-3 uppercase tracking-wider text-slate-500"><MdText text={inhalt.texte.relevanteElutionsverfahren} /></h4>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed"><MdText text={inhalt.texte.dieBestimmungDerSchadstofffreisetzung} /></p>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      <li className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                        <strong className="text-slate-900"><MdText text={inhalt.texte.auslaugungImSäulenversuchDin} /></strong>
                        <p className="mt-0.5 leading-relaxed"><MdText text={inhalt.texte.dasRechtlicheReferenzverfahrenWasser} /></p>
                      </li>
                      <li className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                        <strong className="text-slate-900"><MdText text={inhalt.texte.schüttelversuchDin19529} /></strong>
                        <p className="mt-0.5 leading-relaxed"><MdText text={inhalt.texte.schnellverfahrenFürDieGüteüberwachung} /></p>
                      </li>
                    </ul>
                  </div>

                  {/* Interactive MEB Selector and Limits */}
                  <div className="bg-white p-5 rounded-2xl border border-home-grau/30 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-3"><MdText text={inhalt.texte.interaktiverMebGüteklasseKatalog} /></h4>
                      <p className="text-xs text-slate-500 mb-4"><MdText text={inhalt.texte.wählenSieEinenRepräsentativen} /></p>
                      
                      <AuswahlGruppe label="Mineralischer Ersatzbaustoff" className="grid grid-cols-3 gap-2 mb-4">
                        <button {...alsOption(selectedMEB === 'rc_baustoff')} 
                          onClick={() => setSelectedMEB('rc_baustoff')}
                          className={`px-2.5 py-2 rounded-xl text-center text-xs font-bold border transition-all ${selectedMEB === 'rc_baustoff' ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-50 hover:bg-slate-100 border-home-grau/30 text-slate-700'}`}
                        >
                          RC-Bauschutt
                        </button>
                        <button {...alsOption(selectedMEB === 'bodenaushub')} 
                          onClick={() => setSelectedMEB('bodenaushub')}
                          className={`px-2.5 py-2 rounded-xl text-center text-xs font-bold border transition-all ${selectedMEB === 'bodenaushub' ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-50 hover:bg-slate-100 border-home-grau/30 text-slate-700'}`}
                        >
                          Bodenaushub
                        </button>
                        <button {...alsOption(selectedMEB === 'hm_asche')} 
                          onClick={() => setSelectedMEB('hm_asche')}
                          className={`px-2.5 py-2 rounded-xl text-center text-xs font-bold border transition-all ${selectedMEB === 'hm_asche' ? 'bg-shiraz text-white border-shiraz' : 'bg-slate-50 hover:bg-slate-100 border-home-grau/30 text-slate-700'}`}
                        >
                          Hausmüll-Asche
                        </button>
                      </AuswahlGruppe>

                      {/* Specification results card */}
                      <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl text-xs space-y-2">
                        {selectedMEB === 'rc_baustoff' && (
                          <>
                            <div className="font-bold text-slate-900 border-b border-home-grau/30 pb-1 flex justify-between">
                              <span><MdText text={inhalt.texte.recyclingKlasseRc1} /></span>
                              <span className="text-shiraz"><MdText text={inhalt.texte.bauschuttAufbereitet} /></span>
                            </div>
                            <div><MdText text={inhalt.texte.leitparameterImEluatEbv} /></div>
                            <div className="text-xs text-slate-600 bg-teal-50 border border-teal-200 p-2 rounded mt-1"><MdText text={inhalt.texte.erlaubteEinbaulagenUnterWasserundurchläs} /></div>
                          </>
                        )}
                        {selectedMEB === 'bodenaushub' && (
                          <>
                            <div className="font-bold text-slate-900 border-b border-home-grau/30 pb-1 flex justify-between">
                              <span><MdText text={inhalt.texte.bodenklassenBm0Bm} /></span>
                              <span className="text-teal-600"><MdText text={inhalt.texte.reinerErdaushub} /></span>
                            </div>
                            <div><MdText text={inhalt.texte.leitparameterImEluatArsen} /></div>
                            <div className="text-xs text-slate-600 bg-teal-50 border border-teal-200 p-2 rounded mt-1"><MdText text={inhalt.texte.erlaubteEinbaulagenBm0} /></div>
                          </>
                        )}
                        {selectedMEB === 'hm_asche' && (
                          <>
                            <div className="font-bold text-slate-900 border-b border-home-grau/30 pb-1 flex justify-between">
                              <span><MdText text={inhalt.texte.ascheklasseHmva1Hmva} /></span>
                              <span className="text-purple-600">Hausmüllverbrennungsasche</span>
                            </div>
                            <div><MdText text={inhalt.texte.leitparameterImEluatSulfat} /></div>
                            <div className="text-xs text-slate-600 bg-red-50 border border-red-200 p-2 rounded mt-1 text-red-900 font-medium"><MdText text={inhalt.texte.erlaubteEinbaulagenStrengReglementiert} /></div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-slate-500 italic"><MdText text={inhalt.texte.hinweisSämtlicheEinbautenVon} /></div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'gefahrstoffe' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section className="space-y-6">
                
                {/* Gefahrstoffverordnung (GefStoffV) - Das Neue Gesetz */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
                  <div className="flex items-center gap-3 border-b border-home-grau/30 pb-4 mb-4">
                    <div className="p-2 bg-shiraz text-white rounded-lg">
                      <Shield size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.aktuelleGefahrstoffverordnungGefstoffv} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.informationspflichtenDesVeranlassers5a} /></p>
        </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-slate-700">
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-900 text-base"><MdText text={inhalt.texte.gefstoffvNovelle2024Pflichten} /></h4>
                      <p><MdText text={inhalt.texte.mitDerNovellierungDer} /></p>
                      <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                        <li><MdText text={inhalt.texte.informationDerVeranlasserÜbergibt} /></li>
                        <li><MdText text={inhalt.texte.baujahrBeiBaujahrVor} /></li>
                        <li><MdText text={inhalt.texte.schutzmaßnahmenDasAusführendeUnternehmen} /></li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-2"><MdText text={inhalt.texte.interaktiverAsbestBaujahrCheck} /></h4>
                        <p className="text-xs text-slate-600 mb-3"><MdText text={inhalt.texte.verschiebenSieDenRegler} /></p>
                        
                        <div className="space-y-2">
                          <input 
                            type="range" 
                            min="1950" 
                            max="2020" 
                            value={asbestBaujahr}
                            aria-label="Baujahr"
                            aria-valuetext={`Baujahr ${asbestBaujahr}`}
                            onChange={(e) => setAsbestBaujahr(Number(e.target.value))}
                            className="w-full accent-shiraz"
                          />
                          <div className="flex justify-between text-xs font-mono text-slate-500">
                            <span>1950</span>
                            <span className="font-bold text-slate-900 bg-slate-200 px-2 rounded">{asbestBaujahr}</span>
                            <span>2020</span>
                          </div>
                        </div>

                        <ErgebnisAnsage text={`Baujahr ${asbestBaujahr}: ${asbestBaujahr < 1993 ? 'Asbestverdacht, Baujahr vor dem Verbot 1993' : asbestBaujahr <= 1996 ? 'Übergangszeit 1993 bis 1996, Baubeginn mitteilen' : 'nach 1996, Asbest nicht zu erwarten'}`} />
                        {asbestBaujahr < 1993 ? (
                          <div className="mt-3 p-3 rounded-lg bg-red-50 text-red-900 border border-red-200 text-xs font-semibold leading-relaxed animate-pulse"><MdText text={inhalt.texte.asbestverdachtBaujahrVorDem} /></div>
                        ) : asbestBaujahr <= 1996 ? (
                          <div className="mt-3 p-3 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold leading-relaxed"><MdText text={inhalt.texte.übergangszeit19931996Der} /></div>
                        ) : (
                          <div className="mt-3 p-3 rounded-lg bg-green-50 text-green-900 border border-green-200 text-xs font-semibold leading-relaxed"><MdText text={inhalt.texte.baujahrNach1996Die} /></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expositions-Risiko-Stufenmodell */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
                  <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-shiraz" /><MdText text={inhalt.texte.expositionsRisikoStufenmodellFür} /></h4>
                  <p className="text-xs text-slate-500 mb-4"><MdText text={inhalt.texte.dieIntensitätDesArbeitsschutzes} /></p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <button 
                      onClick={() => setSelectedRiskLevel(10000)}
                      className={`p-4 rounded-xl border text-left transition-all ${selectedRiskLevel === 10000 ? 'border-green-500 bg-green-50/50 shadow-sm font-bold' : 'bg-white border-home-grau/30 hover:bg-slate-50'}`}
                    >
                      <div className="text-xs font-bold text-green-700 uppercase"><MdText text={inhalt.texte.t1NiedrigesRisiko} /></div>
                      <div className="text-lg font-black text-slate-900 mt-1"><MdText text={inhalt.texte.t10000FM} /></div>
                      <div className="text-xs text-slate-500 font-medium mt-1"><MdText text={inhalt.texte.fasernProKubikmeterAtemluft} /></div>
                    </button>

                    <button 
                      onClick={() => setSelectedRiskLevel(50000)}
                      className={`p-4 rounded-xl border text-left transition-all ${selectedRiskLevel === 50000 ? 'border-orange-500 bg-orange-50/50 shadow-sm font-bold' : 'bg-white border-home-grau/30 hover:bg-slate-50'}`}
                    >
                      <div className="text-xs font-bold text-orange-700 uppercase"><MdText text={inhalt.texte.t2MittleresRisiko} /></div>
                      <div className="text-lg font-black text-slate-900 mt-1"><MdText text={inhalt.texte.t10000100000} /></div>
                      <div className="text-xs text-slate-500 font-medium mt-1"><MdText text={inhalt.texte.zwischenAkzeptanzUndToleranzkonzentratio} /></div>
                    </button>

                    <button 
                      onClick={() => setSelectedRiskLevel(100000)}
                      className={`p-4 rounded-xl border text-left transition-all ${selectedRiskLevel === 100000 ? 'border-red-500 bg-red-50/50 shadow-sm font-bold' : 'bg-white border-home-grau/30 hover:bg-slate-50'}`}
                    >
                      <div className="text-xs font-bold text-red-700 uppercase"><MdText text={inhalt.texte.t3HohesRisiko} /></div>
                      <div className="text-lg font-black text-slate-900 mt-1"><MdText text={inhalt.texte.t100000FM} /></div>
                      <div className="text-xs text-slate-500 font-medium mt-1"><MdText text={inhalt.texte.oberhalbDerToleranzkonzentration} /></div>
                    </button>
                  </div>

                  {/* Danger parameters resolution */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 text-xs sm:text-sm">
                    {selectedRiskLevel === 10000 && (
                      <div className="space-y-1.5">
                        <strong className="text-green-700 block"><MdText text={inhalt.texte.akzeptablerSchutzbereichGeringeGefährdun} /></strong>
                        <p className="text-slate-700 leading-normal"><MdText text={inhalt.texte.unterhalbDerAkzeptanzkonzentrationIst} /></p>
                        <p className="text-xs text-slate-500 italic mt-1"><MdText text={inhalt.texte.einsatzgebieteBohrverfahrenMitZugelassen} /></p>
                      </div>
                    )}
                    {selectedRiskLevel === 50000 && (
                      <div className="space-y-1.5">
                        <strong className="text-orange-700 block"><MdText text={inhalt.texte.erhöhteGefährdungsstufeAsiMaßnahmen} /></strong>
                        <p className="text-slate-700 leading-normal"><MdText text={inhalt.texte.derSTO} /></p>
                        <p className="text-xs text-orange-950 bg-orange-50 p-1.5 border border-orange-200 rounded mt-1 font-semibold"><MdText text={inhalt.texte.schutzmaßnahmenGebläseunterstützteFilter} /></p>
                      </div>
                    )}
                    {selectedRiskLevel === 100000 && (
                      <div className="space-y-1.5">
                        <strong className="text-red-700 block"><MdText text={inhalt.texte.hohesRisikoOberhalbDer} /></strong>
                        <p className="text-slate-700 leading-normal"><MdText text={inhalt.texte.nurDurchUnternehmenMit} /></p>
                        <p className="text-xs text-red-950 bg-red-50 p-1.5 border border-red-200 rounded mt-1 font-semibold"><MdText text={inhalt.texte.schutzmaßnahmenUmluftunabhängigerAtemsch} /></p>
                      </div>
                    )}
                  </div>
                </div>

                {/* S-T-O-P Principle */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl shadow-sm">
                   <h4 className="font-bold text-base mb-3 text-slate-900 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.dasSTO} /></h4>
                   <p className="text-sm text-slate-700 mb-3"><MdText text={inhalt.texte.inDieserGesetzlichFestgelegten} /></p>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-white p-3 rounded shadow-sm border border-home-grau/30 text-sm">
                       <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t1Substitution} /></strong><MdText text={inhalt.texte.gefahrstoffDurchHarmloserenStoff} /></div>
                     <div className="bg-white p-3 rounded shadow-sm border border-home-grau/30 text-sm">
                       <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t2Technisch} /></strong><MdText text={inhalt.texte.maschinenMitDirekterAbsaugung} /></div>
                     <div className="bg-white p-3 rounded shadow-sm border border-home-grau/30 text-sm">
                       <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t3Organisatorisch} /></strong><MdText text={inhalt.texte.gefahrenbereicheAbsperrenBeschränkungDer} /></div>
                     <div className="bg-white p-3 rounded shadow-sm border border-home-grau/30 text-sm">
                       <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t4Persönlich} /></strong><MdText text={inhalt.texte.alsLetzteInstanzPersönliche} /></div>
                   </div>
                </div>

              </section>
            </div>
          )}
        </div>
        </ModuleTabs>
      </div>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1KanzerogenitätsindexEiner}
        zielGleichung="KI = \sum (\mathrm{Na_2O}, \mathrm{K_2O}, \mathrm{CaO}, \mathrm{MgO}, \mathrm{BaO}, \mathrm{B_2O_3}) - 2 \cdot \mathrm{Al_2O_3}"
        schritte={inhalt.daten["Schadstoffe.schritte"]}
        ergebnisHinweis={inhalt.werte.für30Ki40}
        normQuelle={inhalt.werte.gefstoffvAnhangIiNr}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2SchichtmittelwertUnd}
        zielGleichung="I = \frac{\sum c_i \cdot t_i}{\text{AGW} \cdot 8\,\text{h}}"
        schritte={inhalt.daten["Schadstoffe.schritte_2"]}
        ergebnisHinweis={inhalt.werte.technischeMaßnahmenGehenVor}
        normQuelle={inhalt.werte.trgs402Trgs900}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="schadstoffe" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap9} 
        wikipedia={[
          { title: 'Schadstoff', url: 'https://de.wikipedia.org/wiki/Schadstoff' },
          { title: 'Asbest', url: 'https://de.wikipedia.org/wiki/Asbest' },
          { title: inhalt.werte.polychlorierteBiphenyle, url: 'https://de.wikipedia.org/wiki/Polychlorierte_Biphenyle' },
          { title: inhalt.werte.polyzyklischeAromatischeKohlenwasserstof, url: 'https://de.wikipedia.org/wiki/Polyzyklische_aromatische_Kohlenwasserstoffe' }
        ]}
        literatur={inhalt.daten["Schadstoffe.literatur"]}
        regelwerke={inhalt.daten["Schadstoffe.regelwerke"]}
        formeln={inhalt.daten["Schadstoffe.formeln"]}
      />
    </div>
  );
} 