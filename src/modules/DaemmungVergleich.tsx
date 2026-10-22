import React from 'react';
import { Thermometer, Home, ArrowRight, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

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
                <li><strong>Tauwassergefahr:</strong> Hohes Risiko für Kondensation zwischen Dämmung und kalter Wand (Schimmelgefahr!). Erfordert eine (feuchtevariable) Dampfbremse oder ein kapillaraktives System mit Feuchtenachweis.</li>
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
          Aus bauphysikalischer Sicht ist die <strong>Außendämmung in der Regel zu bevorzugen</strong>, da sie die Bausubstanz schützt und Wärmebrücken sowie Tauwasserprobleme minimiert.
          Die Innendämmung ist bei Denkmalschutz, erhaltenswerten Fassaden oder Grenzbebauung eine bewährte Lösung, erfordert aber eine sorgfältige Planung (Feuchtenachweis nach DIN 4108-3 bzw. hygrothermische Simulation nach WTA-Merkblatt 6-5 / DIN EN 15026, Schlagregenschutz der Fassade, Holzbalkenköpfe) und eine fehlerfreie, luftdichte Ausführung.
        </p>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Temperatur hinter der Innendämmung im Vergleich zur Außendämmung"
        zielGleichung="\theta_x = \theta_i - \frac{R_{si} + \sum R_{bis\,x}}{R_T} \cdot (\theta_i - \theta_e)"
        schritte={[
          { titel: 'Bestandswand', erklaerung: '36,5 cm Vollziegel (λ = 0,68 W/(mK)), θ_i = 20 °C, θ_e = −5 °C:', formel: 'R_T = 0{,}13 + \\frac{0{,}365}{0{,}68} + 0{,}04 = 0{,}71\\,\\text{m}^2\\text{K/W}, \\quad \\theta_{si} = 20 - \\frac{0{,}13}{0{,}71} \\cdot 25 = 15{,}4\\,^\\circ\\text{C}' },
          { titel: 'Mit 6 cm Dämmung (λ = 0,040)', erklaerung: 'Zusätzlicher Widerstand R = 1,50 m²K/W; Oberfläche innen wird wärmer:', formel: 'R_T = 2{,}21\\,\\text{m}^2\\text{K/W}, \\quad \\theta_{si} = 20 - \\frac{0{,}13}{2{,}21} \\cdot 25 = 18{,}5\\,^\\circ\\text{C}' },
          { titel: 'Grenzschicht bei Innendämmung', erklaerung: 'Zwischen Dämmung und Mauerwerk:', formel: '\\theta = 20 - \\frac{0{,}13 + 1{,}50}{2{,}21} \\cdot 25 = 1{,}5\\,^\\circ\\text{C}' },
          { titel: 'Grenzschicht bei Außendämmung', erklaerung: 'Zwischen Mauerwerk und Dämmung (von außen gerechnet):', formel: '\\theta = -5 + \\frac{0{,}04 + 1{,}50}{2{,}21} \\cdot 25 = 12{,}4\\,^\\circ\\text{C}' }
        ]}
        ergebnisHinweis="Bei gleicher Dämmwirkung liegt die Grenzschicht der Innendämmung mit 1,5 °C weit unter dem Taupunkt der Raumluft (9,3 °C bei 20 °C / 50 % r. F.). Ohne Dampfbremse oder kapillaraktives System droht dort Tauwasser; das Mauerwerk liegt im Frostbereich."
        normQuelle="Stationärer Temperaturverlauf nach DIN EN ISO 6946:2018-03"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Woher kommt der Temperaturfaktor f_Rsi ≥ 0,70?"
        zielGleichung="f_{Rsi} = \frac{\theta_{si,min} - \theta_e}{\theta_i - \theta_e}"
        schritte={[
          { titel: 'Dampfdruck der Raumluft', erklaerung: 'Raumklima 20 °C / 50 % r. F. (Sättigungsdampfdruck nach Magnus-Formel):', formel: 'p = 0{,}50 \\cdot 2\\,337 = 1\\,169\\,\\text{Pa}' },
          { titel: 'Schimmelkriterium', erklaerung: 'An der Oberfläche darf die relative Feuchte 80 % nicht überschreiten:', formel: 'p_{sat}(\\theta_{si,min}) = \\frac{1\\,169}{0{,}80} = 1\\,461\\,\\text{Pa} \\Rightarrow \\theta_{si,min} = 12{,}6\\,^\\circ\\text{C}' },
          { titel: 'Temperaturfaktor', erklaerung: 'Bezogen auf −5 °C Außentemperatur:', formel: 'f_{Rsi} = \\frac{12{,}6 - (-5)}{20 - (-5)} = 0{,}70' }
        ]}
        ergebnisHinweis="Die Bestandswand aus Beispiel 1 erreicht ungestört f = (15,4 + 5)/25 = 0,82; kritisch sind Ecken, Fensteranschlüsse und einbindende Innenwände, für die f_Rsi mit Wärmebrückenberechnung (DIN EN ISO 10211) nachzuweisen ist."
        normQuelle="DIN 4108-2:2013-02 (Neuausgabe 2026-05 manuell abgleichen); DIN EN ISO 13788:2013-05"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="daemmung_vergleich" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 6 Bauphysik: Temperaturverläufe, Temperaturfaktor, Normausgaben und Literatur geprüft; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Wärmedämmverbundsystem', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmed%C3%A4mmverbundsystem' },
          { title: 'Innendämmung', url: 'https://de.wikipedia.org/wiki/Innend%C3%A4mmung' },
          { title: 'Wärmebrücke', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmebr%C3%BCcke' }
        ]}
        literatur={[
          'Willems, W. (Hrsg.): Lehrbuch der Bauphysik. 8. Aufl., Wiesbaden: Springer Vieweg 2017',
          'Künzel, H. M.: Verfahren zur ein- und zweidimensionalen Berechnung des gekoppelten Wärme- und Feuchtetransports in Bauteilen mit einfachen Kennwerten. Dissertation, Universität Stuttgart 1994'
        ]}
        regelwerke={[
          { title: 'DIN 4108-3:2024-03 (Klimabedingter Feuchteschutz – Anforderungen, Berechnungsverfahren und Hinweise für Planung und Ausführung; ersetzt 2018-10)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+4108-3' },
          { title: 'WTA-Merkblatt 6-4 (Innendämmung nach WTA I: Planungsleitfaden; Ausgabestand manuell prüfen)', url: 'https://www.wta-international.org/' },
          { title: 'WTA-Merkblatt 6-5 (Innendämmung nach WTA II: Nachweis von Innendämmsystemen mittels numerischer Berechnungsverfahren; Ausgabestand manuell prüfen)', url: 'https://www.wta-international.org/' }
        ]}
        formeln={[
          {
            formel: '\\theta_i = T_{\\text{innen}} - \\frac{R_{si}}{R_T} \\cdot (T_{\\text{innen}} - T_{\\text{aussen}})',
            erklaerung: 'Innentemperatur der Wandoberfläche theta_i: Liegt diese unter der Taupunkttemperatur der Raumluft (bzw. f_Rsi < 0,70), droht Schimmelpilzbildung bzw. Tauwasserausfall.',
            quelle: 'DIN EN ISO 6946; DIN 4108-2'
          },
          {
            formel: 'f_{Rsi} = \\frac{\\theta_{si} - T_e}{T_i - T_e} \\ge 0{,}70',
            erklaerung: 'Temperaturfaktor f_Rsi an der ungünstigsten Stelle zur Vermeidung von Schimmelpilzwachstum (entspricht ca. 12,6 °C Oberflächentemperatur bei 20 °C / 50 % r. F. innen und −5 °C außen; Kriterium 80 % r. F. an der Oberfläche).',
            quelle: 'DIN 4108-2:2013-02 (Neuausgabe 2026-05 – Änderungen manuell prüfen)'
          }
        ]}
      />
    </div>
  );
}
