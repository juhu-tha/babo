import React from 'react';
import { Thermometer, Home, ArrowRight, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function DaemmungVergleich() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Thermometer className="text-shiraz" /> Innendämmung vs. Außendämmung
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Wahl zwischen Innendämmung und Außendämmung (z.B. WDVS) ist eine der wichtigsten bauphysikalischen Entscheidungen bei der energetischen Sanierung. 
            Beide Systeme haben grundlegend unterschiedliche Auswirkungen auf den Temperaturverlauf, den Feuchteschutz und das Speicherverhalten der Wand.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Außendämmung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-home-grau/30 pb-4">
            <div className="p-3 bg-shiraz/10 text-shiraz rounded-xl">
              <Home size={24} />
            </div>
            <h3 className="text-xl font-bold text-text-main">Außendämmung (z.B. WDVS)</h3>
          </div>

          <div className="relative h-48 bg-off-white rounded-xl border border-home-grau/30 p-4 overflow-hidden flex items-center justify-center">
            {/* Visualisierung Temperaturverlauf Außendämmung */}
            <div className="flex w-full h-full max-w-sm relative">
              <div className="w-1/3 h-full bg-blue-50 border-r border-blue-200 flex items-center justify-center text-xs text-blue-800 font-bold">Außen (Kalt)</div>
              <div className="w-1/3 h-full bg-yellow-100 border-r border-yellow-300 flex items-center justify-center text-xs text-yellow-800 font-bold flex-col">
                <span>Dämmung</span>
              </div>
              <div className="w-1/3 h-full bg-red-50 flex items-center justify-center text-xs text-red-800 font-bold flex-col">
                <span>Mauerwerk</span>
              </div>
              
              {/* Temperaturkurve */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M 0 80 L 33% 80 L 66% 20 L 100% 20" fill="none" stroke="#A3113E" strokeWidth="3" />
                <circle cx="33%" cy="80" r="4" fill="#A3113E" />
                <circle cx="66%" cy="20" r="4" fill="#A3113E" />
              </svg>
            </div>
          </div>

          <div className="text-sm text-text-main/80">
            <p>Die Dämmschicht wird auf der Außenseite des tragenden Mauerwerks angebracht. Das Mauerwerk befindet sich im warmen Bereich.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><CheckCircle2 size={16} /> Vorteile</h4>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                <li><strong>Wärmespeicher:</strong> Mauerwerk speichert Wärme, gleicht Temperaturschwankungen aus.</li>
                <li><strong>Wärmebrücken:</strong> Werden effektiv minimiert (Dämmung "packt" das Haus ein).</li>
                <li><strong>Tauwasser:</strong> Geringes Risiko für Tauwasserausfall im Bauteilinneren.</li>
                <li><strong>Wohnraum:</strong> Kein Verlust von Wohnfläche im Innenraum.</li>
                <li><strong>Witterungsschutz:</strong> Schützt die Tragstruktur vor Frost und Schlagregen.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-shiraz flex items-center gap-2 mb-2"><XCircle size={16} /> Nachteile</h4>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                <li><strong>Optik:</strong> Historische oder erhaltenswerte Fassaden gehen verloren.</li>
                <li><strong>Aufwand:</strong> Gerüststellung erforderlich, witterungsabhängige Ausführung.</li>
                <li><strong>Dicke:</strong> Fensterlaibungen werden tiefer (Schießscharten-Effekt).</li>
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
              <div className="w-1/3 h-full bg-blue-50 border-r border-blue-200 flex items-center justify-center text-xs text-blue-800 font-bold">Außen (Kalt)</div>
              <div className="w-1/3 h-full bg-blue-50 border-r border-blue-300 flex items-center justify-center text-xs text-blue-800 font-bold flex-col">
                <span>Mauerwerk</span>
              </div>
              <div className="w-1/3 h-full bg-yellow-100 flex items-center justify-center text-xs text-yellow-800 font-bold flex-col">
                <span>Dämmung</span>
              </div>
              
              {/* Temperaturkurve */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M 0 80 L 33% 80 L 66% 80 L 100% 20" fill="none" stroke="#A3113E" strokeWidth="3" />
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
            <p>Die Dämmschicht wird auf der Rauminnenseite angebracht. Das tragende Mauerwerk kühlt im Winter stark aus.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><CheckCircle2 size={16} /> Vorteile</h4>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                <li><strong>Fassade:</strong> Erhalt von historischen, denkmalgeschützten oder aufwendigen Fassaden.</li>
                <li><strong>Flexibilität:</strong> Raumweise Sanierung möglich, unabhängig vom Wetter.</li>
                <li><strong>Aufheizzeit:</strong> Räume lassen sich schneller aufheizen (da das Mauerwerk nicht mitgeheizt wird).</li>
                <li><strong>Kosten:</strong> Kein Gerüst erforderlich.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-shiraz flex items-center gap-2 mb-2"><XCircle size={16} /> Nachteile</h4>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
                <li><strong>Tauwassergefahr:</strong> Hohes Risiko für Kondensation zwischen Dämmung und kalter Wand (Schimmelgefahr!). Erfordert Dampfsperre oder kapillaraktive Systeme.</li>
                <li><strong>Wärmebrücken:</strong> Einbindende Innenwände und Holzbalkendecken bilden kritische Wärmebrücken (Gefahr von Balkenkopffäule).</li>
                <li><strong>Wohnraum:</strong> Verlust von Wohnfläche.</li>
                <li><strong>Installation:</strong> Steckdosen und Leitungen in der Außenwand sind problematisch.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-orange-800/5 p-6 rounded-2xl border border-orange-800/20">
        <h3 className="text-lg font-bold text-shiraz mb-2 flex items-center gap-2">
          <AlertTriangle size={20} /> Fazit & Bauphysikalische Regel
        </h3>
        <p className="text-sm text-text-main/80">
          Aus bauphysikalischer Sicht ist die <strong>Außendämmung immer zu bevorzugen</strong>, da sie die Bausubstanz schützt und Wärmebrücken sowie Tauwasserprobleme minimiert. 
          Eine Innendämmung ist eine Notlösung (z.B. bei Denkmalschutz) und erfordert eine äußerst sorgfältige bauphysikalische Planung (Glaser-Verfahren, WUFI-Simulation) und fehlerfreie handwerkliche Ausführung.
        </p>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Wärmedämmverbundsystem', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmed%C3%A4mmverbundsystem' },
          { title: 'Innendämmung', url: 'https://de.wikipedia.org/wiki/Innend%C3%A4mmung' },
          { title: 'Wärmebrücke', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmebr%C3%BCcke' }
        ]}
        literatur={[
          'Hauser, G.; Maas, A. (2019): Bauphysikalischer Leitfaden zur Innendämmung (Fraunhofer IRB Verlag)',
          'Willems, W. M. (2018): Lehrbuch der Bauphysik (8. Auflage, Springer Vieweg)'
        ]}
        regelwerke={[
          { title: 'DIN 4108-3 (Klimabedingter Feuchteschutz - Anforderungen, Berechnungsverfahren und Hinweise für Planung und Ausführung)', url: 'https://www.dinmedia.de/' },
          { title: 'WTA-Merkblatt 6-4 (Innendämmung nach WTA I: Planungsleitfaden)', url: 'https://www.wta-international.org/' },
          { title: 'WTA-Merkblatt 6-5 (Innendämmung nach WTA II: Nachweis von Innendämmsystemen mittels rechnerischer Simulation)', url: 'https://www.wta-international.org/' }
        ]}
        formeln={[
          {
            formel: '\\theta_i = T_{\\text{innen}} - \\frac{R_{si}}{R_T} \\cdot (T_{\\text{innen}} - T_{\\text{aussen}})',
            erklaerung: 'Innentemperatur der Wandoberfläche theta_i: Liegt diese unter der Taupunkttemperatur der Raumluft (bzw. f_Rsi < 0.70), droht Tauwasserausfall und Schimmelpilzbildung.',
            quelle: 'DIN 4108-2 / DIN 4108-3'
          },
          {
            formel: 'f_{Rsi} = \\frac{\\theta_{si} - T_e}{T_i - T_e} \\ge 0.70',
            erklaerung: 'Temperaturfaktor f_Rsi an der ungünstigsten Stelle zur Vermeidung von Schimmelpilzwachstum (entspricht ca. 12.6 °C Oberflächentemperatur bei 20 °C Innen- und -5 °C Außentemperatur).',
            quelle: 'DIN 4108-2 Mindestwärmeschutz'
          }
        ]}
      />
    </div>
  );
}
