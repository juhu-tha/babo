import React from 'react';
import { Thermometer, Home, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/daemmungvergleich/DaemmungVergleich.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function DaemmungVergleich() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Thermometer className="text-shiraz" /><MdText text={inhalt.texte.innendämmungVsAußendämmung} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieWahlZwischenInnendämmung} /></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Außendämmung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-home-grau/30 pb-4">
            <div className="p-3 bg-shiraz/10 text-shiraz rounded-xl">
              <Home size={24} />
            </div>
            <h3 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.außendämmungZBWdvs} /></h3>
          </div>

          <div className="relative h-48 bg-off-white rounded-xl border border-home-grau/30 p-4 overflow-hidden flex items-center justify-center">
            {/* Visualisierung Temperaturverlauf Außendämmung */}
            <div className="flex w-full h-full max-w-sm relative">
              <div className="w-1/3 h-full bg-blue-50 border-r border-blue-200 flex items-center justify-center text-xs text-blue-800 font-bold"><MdText text={inhalt.texte.außenKalt} /></div>
              <div className="w-1/3 h-full bg-yellow-100 border-r border-yellow-300 flex items-center justify-center text-xs text-yellow-800 font-bold flex-col">
                <span>Dämmung</span>
              </div>
              <div className="w-1/3 h-full bg-red-50 flex items-center justify-center text-xs text-red-800 font-bold flex-col">
                <span>Mauerwerk</span>
              </div>
              
              {/* Temperaturkurve */}
              <svg role="img" aria-label="Temperaturverlauf im Wandquerschnitt bei Außendämmung" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                {/* SVG-Pfade akzeptieren keine %-Koordinaten → Linienzüge */}
                <line x1="0" y1="80" x2="33%" y2="80" stroke="#A3113E" strokeWidth="3" strokeLinecap="round" />
                <line x1="33%" y1="80" x2="66%" y2="20" stroke="#A3113E" strokeWidth="3" strokeLinecap="round" />
                <line x1="66%" y1="20" x2="100%" y2="20" stroke="#A3113E" strokeWidth="3" strokeLinecap="round" />
                <circle cx="33%" cy="80" r="4" fill="#A3113E" />
                <circle cx="66%" cy="20" r="4" fill="#A3113E" />
              </svg>
            </div>
          </div>

          <div className="text-sm text-text-main/80">
            <p><MdText text={inhalt.texte.dieDämmschichtWirdAuf} /></p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><CheckCircle2 size={16} /> Vorteile</h4>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                <li><MdText text={inhalt.texte.wärmespeicherMauerwerkSpeichertWärme} /></li>
                <li><MdText text={inhalt.texte.wärmebrückenWerdenEffektivMinimiert} /></li>
                <li><MdText text={inhalt.texte.tauwasserGeringesRisikoFür} /></li>
                <li><MdText text={inhalt.texte.wohnraumKeinVerlustVon} /></li>
                <li><MdText text={inhalt.texte.witterungsschutzSchütztDieTragstruktur} /></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-shiraz flex items-center gap-2 mb-2"><XCircle size={16} /> Nachteile</h4>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                <li><MdText text={inhalt.texte.optikHistorischeOderErhaltenswerte} /></li>
                <li><MdText text={inhalt.texte.aufwandGerüststellungErforderlichWitteru} /></li>
                <li><MdText text={inhalt.texte.dickeFensterlaibungenWerdenTiefer} /></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Innendämmung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-home-grau/30 pb-4">
            <div className="p-3 bg-red-100 text-shiraz rounded-xl">
              <Home size={24} />
            </div>
            <h3 className="text-xl font-bold text-text-main">Innendämmung</h3>
          </div>

          <div className="relative h-48 bg-off-white rounded-xl border border-home-grau/30 p-4 overflow-hidden flex items-center justify-center">
            {/* Visualisierung Temperaturverlauf Innendämmung */}
            <div className="flex w-full h-full max-w-sm relative">
              <div className="w-1/3 h-full bg-blue-50 border-r border-blue-200 flex items-center justify-center text-xs text-blue-800 font-bold"><MdText text={inhalt.texte.außenKalt2} /></div>
              <div className="w-1/3 h-full bg-blue-50 border-r border-blue-300 flex items-center justify-center text-xs text-blue-800 font-bold flex-col">
                <span>Mauerwerk</span>
              </div>
              <div className="w-1/3 h-full bg-yellow-100 flex items-center justify-center text-xs text-yellow-800 font-bold flex-col">
                <span>Dämmung</span>
              </div>
              
              {/* Temperaturkurve */}
              <svg role="img" aria-label="Temperaturverlauf im Wandquerschnitt bei Innendämmung" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                {/* SVG-Pfade akzeptieren keine %-Koordinaten → Linienzüge */}
                <line x1="0" y1="80" x2="33%" y2="80" stroke="#A3113E" strokeWidth="3" strokeLinecap="round" />
                <line x1="33%" y1="80" x2="66%" y2="80" stroke="#A3113E" strokeWidth="3" strokeLinecap="round" />
                <line x1="66%" y1="80" x2="100%" y2="20" stroke="#A3113E" strokeWidth="3" strokeLinecap="round" />
                <circle cx="66%" cy="80" r="4" fill="#A3113E" />
                <circle cx="100%" cy="20" r="4" fill="#A3113E" />
              </svg>
              
              {/* Tauwasser Warnung */}
              <div className="absolute left-[66%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500">
                <AlertTriangle size={24} className="fill-blue-100" />
              </div>
            </div>
          </div>

          <div className="text-sm text-text-main/80">
            <p><MdText text={inhalt.texte.dieDämmschichtWirdAuf2} /></p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><CheckCircle2 size={16} /> Vorteile</h4>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                <li><MdText text={inhalt.texte.fassadeErhaltVonHistorischen} /></li>
                <li><MdText text={inhalt.texte.flexibilitätRaumweiseSanierungMöglich} /></li>
                <li><MdText text={inhalt.texte.aufheizzeitRäumeLassenSich} /></li>
                <li><MdText text={inhalt.texte.kostenKeinGerüstErforderlich} /></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-shiraz flex items-center gap-2 mb-2"><XCircle size={16} /> Nachteile</h4>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                <li><MdText text={inhalt.texte.tauwassergefahrHohesRisikoFür} /></li>
                <li><MdText text={inhalt.texte.wärmebrückenEinbindendeInnenwändeUnd} /></li>
                <li><MdText text={inhalt.texte.wohnraumVerlustVonWohnfläche} /></li>
                <li><MdText text={inhalt.texte.installationSteckdosenUndLeitungen} /></li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-orange-800/5 p-6 rounded-2xl border border-orange-800/20">
        <h3 className="text-lg font-bold text-shiraz mb-2 flex items-center gap-2">
          <AlertTriangle size={20} /><MdText text={inhalt.texte.fazitBauphysikalischeRegel} /></h3>
        <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.ausBauphysikalischerSichtIst} /></p>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1TemperaturHinter}
        zielGleichung="\theta_x = \theta_i - \frac{R_{si} + \sum R_{bis\,x}}{R_T} \cdot (\theta_i - \theta_e)"
        schritte={inhalt.daten["DaemmungVergleich.schritte"]}
        ergebnisHinweis={inhalt.werte.beiGleicherDämmwirkungLiegt}
        normQuelle={inhalt.werte.stationärerTemperaturverlaufNachDin}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2WoherKommt}
        zielGleichung="f_{Rsi} = \frac{\theta_{si,min} - \theta_e}{\theta_i - \theta_e}"
        schritte={inhalt.daten["DaemmungVergleich.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dieBestandswandAusBeispiel}
        normQuelle={inhalt.werte.din410822013}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="daemmung_vergleich" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap6}
        wikipedia={[
          { title: 'Wärmedämmverbundsystem', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmed%C3%A4mmverbundsystem' },
          { title: 'Innendämmung', url: 'https://de.wikipedia.org/wiki/Innend%C3%A4mmung' },
          { title: 'Wärmebrücke', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmebr%C3%BCcke' }
        ]}
        literatur={inhalt.daten["DaemmungVergleich.literatur"]}
        regelwerke={inhalt.daten["DaemmungVergleich.regelwerke"]}
        formeln={inhalt.daten["DaemmungVergleich.formeln"]}
      />
    </div>
  );
}
