import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';
import { Factory, Truck, Waves, ArrowRight, AlertTriangle, Settings, Combine } from 'lucide-react';
import inhalt from '@/content/herstellungeinbau/HerstellungEinbau.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function HerstellungEinbau() {
  const { setActiveTab } = useTabContext();
  return (
    <div className="flex flex-col gap-8">
      {/* 1. Herstellung & Transport */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Factory size={24} />
          </div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.herstellungTransport} /></h2>
      

        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.betonWirdMeistAls} /></p>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-xs">
            <strong className="mr-1">Lernpfad:</strong> 1. Mischen <span className="text-text-main/40">→</span><MdText text={inhalt.texte.t2Transport} /><span className="text-text-main/40">→</span> 3. Pumpen <span className="text-text-main/40">→</span><MdText text={inhalt.texte.t4Verdichten} /><span className="text-text-main/40 mx-1">|</span> weiter:
            <button onClick={() => setActiveTab('frischbeton')} className="underline decoration-dotted hover:text-shiraz cursor-pointer"><MdText text={inhalt.texte.frischbetonKonsistenz} /></button>
            <span className="text-text-main/40">·</span>
            <button onClick={() => setActiveTab('nachbehandlung')} className="underline decoration-dotted hover:text-shiraz cursor-pointer">Nachbehandlung</button>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-home-grau/30 rounded-xl bg-white">
             <h3 className="font-bold text-text-main flex items-center gap-2 mb-2"><Truck size={18} className="text-shiraz"/><MdText text={inhalt.texte.transportFahrmischer} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.fahrmischerUndFahrzeugeMit} /></p>
        </div>
             <p className="text-sm text-text-main/70"><MdText text={inhalt.texte.mischwirkungImFahrmischerFortwährendes} /></p>
          </div>
          <div className="p-4 border border-home-grau/30 rounded-xl bg-white">
             <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><Combine size={18} className="text-shiraz"/> Mischen</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.zwangsmischerGewährleistenEineStarke} /></p>
        </div>
             <p className="text-sm text-text-main/70"><MdText text={inhalt.texte.überwachungDerMischprozessUnd} /></p>
          </div>
        </div>
      </div>

      {/* 2. Pumpen von Beton (aus Pumpbeton.tsx integriert) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 border-2 border-shiraz text-shiraz rounded-lg">
            <Waves size={24} />
          </div>
          <h2 className="text-2xl font-bold text-text-main"><MdText text={inhalt.texte.einbauverfahrenPumpenVonBeton} /></h2>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dasFördernVonBeton} /></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gleitschicht & Mechanismus */}
          <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
            <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
              <ArrowRight className="text-shiraz" size={20} /><MdText text={inhalt.texte.wirkprinzipDieGleitschicht} /></h3>
            <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.beimPumpenBewegtSich} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
              <li><MdText text={inhalt.texte.zusammensetzungDieGleitschichtBesteht} /></li>
              <li><MdText text={inhalt.texte.entstehungDurchDenPumpdruck} /></li>
              <li><MdText text={inhalt.texte.bedeutungOhneIntakteGleitschicht} /></li>
            </ul>
          </div>

          {/* Anforderungen an den Beton */}
          <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
            <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
              <Settings className="text-shiraz" size={20} /><MdText text={inhalt.texte.anforderungenAnDieRezeptur} /></h3>
            <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.nichtJederBetonIst} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
              <li><MdText text={inhalt.texte.mehlkorngehaltAusreichendFeinstoffeZwing} /></li>
              <li><MdText text={inhalt.texte.kornzusammensetzungEineStetigeSieblinie} /></li>
              <li><MdText text={inhalt.texte.konsistenzMeistF3Bis} /></li>
              <li><MdText text={inhalt.texte.wasserhaltevermögenDerBetonDarf} /></li>
              <li><MdText text={inhalt.texte.hochfesterBetonHpcBesitzt} /></li>
            </ul>
          </div>
        </div>

        {/* Risiken und Probleme */}
        <div className="mt-2 border border-shiraz/20 bg-off-white rounded-xl p-5">
          <h3 className="font-bold text-shiraz text-lg mb-3 flex items-center gap-2">
            <AlertTriangle size={20} /><MdText text={inhalt.texte.typischeProblemeBeimPumpen} /></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-shiraz/10 shadow-sm">
              <h4 className="font-bold text-text-main text-sm mb-1"><MdText text={inhalt.texte.verblutenBleeding} /></h4>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.wasserWirdHerausgepresstUnd} /></p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-shiraz/10 shadow-sm">
              <h4 className="font-bold text-text-main text-sm mb-1"><MdText text={inhalt.texte.anpumpenSchmieren} /></h4>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.vorlaufmörtelFehltWodurchDas} /></p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-shiraz/10 shadow-sm">
              <h4 className="font-bold text-text-main text-sm mb-1">Rohrleitungs-Geometrie</h4>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.engeBögenOderUndichte} /></p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Verdichten und Einbau */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-text-main"><MdText text={inhalt.texte.einbauVerdichtung} /></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-4">
             <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.nachdemDerBetonIn} /></p>
             <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
               <li><MdText text={inhalt.texte.flaschenrüttlerInnenrüttlerDasGängigste} /></li>
               <li><MdText text={inhalt.texte.außenrüttlerSchalungsrüttlerDirektAn} /></li>
               <li><MdText text={inhalt.texte.rüttelbohlenZumAbziehenUnd} /></li>
             </ul>
           </div>
           
           <div className="bg-home-grau/5 rounded-xl border border-home-grau/30 p-5">
              <h3 className="font-bold text-text-main text-sm mb-2 text-shiraz"><MdText text={inhalt.texte.achtungFehlerBeimVerdichten} /></h3>
              <ul className="space-y-3">
                <li className="text-xs text-text-main/70 flex gap-2"><ArrowRight size={14} className="shrink-0 text-shiraz mt-0.5" /><MdText text={inhalt.texte.überrüttelnSedimentationBlutenZu} /></li>
                <li className="text-xs text-text-main/70 flex gap-2"><ArrowRight size={14} className="shrink-0 text-shiraz mt-0.5" /><MdText text={inhalt.texte.unterrüttelnLufteinschlüsseBleibenIm} /></li>
                <li className="text-xs text-text-main/70 flex gap-2"><ArrowRight size={14} className="shrink-0 text-shiraz mt-0.5" /><MdText text={inhalt.texte.eigenfließenBetonDarfNicht} /></li>
              </ul>
           </div>
        </div>
      </div>

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielFörderdruckEinerBetonp}
        zielGleichung="p = \frac{2\,\tau_0\,L}{R} + \frac{8\,\mu_p\,v\,L}{R^2} + \rho\,g\,H"
        normQuelle={inhalt.werte.binghamAnsatzFürRohrströmung}
        schritte={inhalt.daten["HerstellungEinbau.schritte"]}
        ergebnisHinweis={inhalt.werte.erforderlicherFörderdruckRund22}
      />

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielZulässigeTransportzeit}
        zielGleichung="t_{\text{Entladen}} - t_{\text{Wasserzugabe}} \le 90\,\text{min}"
        normQuelle={inhalt.werte.din104527}
        schritte={inhalt.daten["HerstellungEinbau.schritte_2"]}
        ergebnisHinweis={inhalt.werte.t100Min90Min}
      />

      <ModulTest moduleId="herstellung_einbau" />

      <ModuleFooter weblinks={[
          { title: inhalt.werte.betonWikiBetonherstellung, url: "https://beton.wiki/index.php?title=Betonherstellung" }, 
          { title: inhalt.werte.zementMerkblattB7, url: "https://www.baunetzwissen.de/beton/tipps/planungshilfen/b--7--bereiten-und-verarbeiten-von-beton-151304" }, 
          { title: inhalt.werte.betonWikiBetonieren, url: "https://beton.wiki/index.php?title=Betonieren" },
          { title: inhalt.werte.vereinDeutscherZementwerkeVdz, url: "https://www.vdz-online.de/publikationen/zement-taschenbuch" }
        ]} 
        wikipedia={[
          { title: 'Transportbeton', url: 'https://de.wikipedia.org/wiki/Transportbeton' },
          { title: 'Pumpbeton', url: 'https://de.wikipedia.org/wiki/Pumpbeton' },
          { title: 'Betonmischer', url: 'https://de.wikipedia.org/wiki/Betonmischer' }
        ]}
        regelwerke={inhalt.daten["HerstellungEinbau.regelwerke"]}
        literatur={inhalt.daten["HerstellungEinbau.literatur"]}
        formeln={inhalt.daten["HerstellungEinbau.formeln"]}
      />
    </div>
  );
}
