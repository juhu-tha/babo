import React, { useState } from 'react';
import { Trees, Layers, Wrench, Leaf, BookOpen } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import inhalt from '@/content/holzwerkstoffe/Holzwerkstoffe.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

type HolzwerkstoffReiter = 'steckbrief' | 'arten' | 'herstellung' | 'nachhaltigkeit';
const REITER: readonly ModulTab<HolzwerkstoffReiter>[] = [
  { id: 'steckbrief', label: 'Baustoff-Steckbrief', icon: BookOpen },
  { id: 'arten', label: inhalt.texte.artenEigenschaften.trim(), icon: Layers },
  { id: 'herstellung', label: 'Herstellung', icon: Wrench },
  { id: 'nachhaltigkeit', label: inhalt.texte.umweltNachhaltigkeit.trim(), icon: Leaf },
];

export default function Holzwerkstoffe() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'arten' | 'herstellung' | 'nachhaltigkeit'>('steckbrief');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Trees className="text-shiraz" /> Holzwerkstoffe
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.holzwerkstoffeEntstehenDurchDas} /></p>
        </div>
      </div>

      <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-8 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">

      {activeTab === 'arten' && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Vollholzwerkstoffe</h3>
          
          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz"><MdText text={inhalt.texte.brettschichtholzBshLeimholz} /></h4>
            <p className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.bestehtAusFaserparallelMiteinander} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><MdText text={inhalt.texte.eigenschaftenSehrHoheTragfähigkeit} /></li>
              <li><MdText text={inhalt.texte.verwendungWeitgespannteTrägerStützen} /></li>
            </ul>
          </div>

          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz"><MdText text={inhalt.texte.brettsperrholzBspClt} /></h4>
            <p className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.bestehtAusKreuzweiseMeist} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><MdText text={inhalt.texte.eigenschaftenHoheFormstabilitätLastabtra} /></li>
              <li><MdText text={inhalt.texte.verwendungMassivholzwändeDeckenDacheleme} /></li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Furnierwerkstoffe</h3>
          
          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz"><MdText text={inhalt.texte.furniersperrholzFu} /></h4>
            <p className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.bestehtAusMehrerenKreuzweise} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><MdText text={inhalt.texte.eigenschaftenHoheFestigkeitBei} /></li>
              <li><MdText text={inhalt.texte.verwendungBeplankungenMöbelbauFahrzeugba} /></li>
            </ul>
          </div>

          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz"><MdText text={inhalt.texte.furnierschichtholzFshLvl} /></h4>
            <p className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.bestehtAusFaserparallelVerleimten} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><MdText text={inhalt.texte.eigenschaftenExtremHoheZug} /></li>
              <li><MdText text={inhalt.texte.verwendungHochbelasteteTrägerSchlanke} /></li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Holzspanwerkstoffe</h3>
          
          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz"><MdText text={inhalt.texte.osbPlattenOrientedStrand} /></h4>
            <p className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.plattenAusLangenSchlanken} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><MdText text={inhalt.texte.eigenschaftenHoheBiegefestigkeitMarkante} /></li>
              <li><MdText text={inhalt.texte.verwendungAussteifendeBeplankungIm} /></li>
            </ul>
          </div>

          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz"><MdText text={inhalt.texte.flachpressplattenSpanplatten} /></h4>
            <p className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.plattenAusKleinenHolzspänen} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><MdText text={inhalt.texte.eigenschaftenGünstigIsotropeEigenschafte} /></li>
              <li><MdText text={inhalt.texte.verwendungMöbelbauUndInnenausbau} /></li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Holzfaserwerkstoffe</h3>
          
          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz"><MdText text={inhalt.texte.mdfMitteldichteFaserplatte} /></h4>
            <p className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.hergestelltAusFeinenHolzfasern} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><MdText text={inhalt.texte.eigenschaftenSehrHomogeneStruktur} /></li>
              <li><MdText text={inhalt.texte.verwendungMöbelbauProfilierteFronten} /></li>
            </ul>
          </div>

          <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
            <h4 className="font-bold text-sm mb-2 text-shiraz"><MdText text={inhalt.texte.holzfaserdämmplattenHfd} /></h4>
            <p className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.porösePlattenAusHolzfasern} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
              <li><MdText text={inhalt.texte.eigenschaftenGuteWärmedämmungHervorragen} /></li>
              <li><MdText text={inhalt.texte.verwendungAufsparrendämmungWdvsIm} /></li>
            </ul>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'herstellung' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-xl font-bold text-text-main border-b border-home-grau/30 pb-2">Herstellungsprozesse</h3>
          <p className="text-text-main/80"><MdText text={inhalt.texte.dieHerstellungsverfahrenBestimmenMaßgebl} /></p>
          <div className="space-y-4">
            <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.verleimungKlebeprozess} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.fürBaurelevanteAnwendungenWerden} /></p>
            </div>
            <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Furnierherstellung</h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.derStammWirdErhitzt} /></p>
            </div>
            <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1">Faseraufbereitung</h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.hackschnitzelWerdenUnterHohem} /></p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nachhaltigkeit' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-xl font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.ressourceneinsatzUndUmwelt} /></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-lg mb-2">Rohstoffausnutzung</h4>
              <p className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.holzwerkstoffeErmöglichenEineDeutlich} /></p>
            </div>
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.emissionenVocsUndFormaldehyd} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.einKritischerFaktorSind} /></p>
            </div>
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-lg mb-2">Kaskadennutzung</h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.idealerweiseVollholzBrettschichtholzOsb} /></p>
            </div>
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-lg mb-2">Kreislauffähigkeit</h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.kompliziertDurchBindemittelanteileNach} /></p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'steckbrief' && (
        <div className="animate-in fade-in duration-300">
          <BaustoffProfil materialKey="holzwerkstoffe" />
        </div>
      )}
      </ModuleTabs>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielKriechverformungEinerO}
          zielGleichung="w_{fin} = w_{inst} \cdot (1 + k_{def}) \quad (\text{ständige Last, } \psi_2 = 1)"
          normQuelle={inhalt.werte.dinEn19951}
          schritte={inhalt.daten["Holzwerkstoffe.schritte"]}
          ergebnisHinweis={inhalt.werte.fürHolzwerkstoffplattenUnterDauerlast}
        />
      </div>

      <ModulTest moduleId="holzwerkstoffe" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Holzwerkstoff', url: 'https://de.wikipedia.org/wiki/Holzwerkstoff' },
          { title: inhalt.werte.orientedStrandBoardOsb, url: 'https://de.wikipedia.org/wiki/Grobspanplatte' },
          { title: 'Sperrholz', url: 'https://de.wikipedia.org/wiki/Sperrholz' },
          inhalt.daten["Holzwerkstoffe.wikipedia.3"]
        ]}
        literatur={inhalt.daten["Holzwerkstoffe.literatur"]}
        regelwerke={inhalt.daten["Holzwerkstoffe.regelwerke"]}
        formeln={inhalt.daten["Holzwerkstoffe.formeln"]}
      />
    </div>
  );
} 