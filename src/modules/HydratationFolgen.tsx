import React, { useState } from 'react';
import { Flame, Layers, Activity, BookOpen, ShieldAlert, Cpu } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import IntegrationVerformungen from './IntegrationVerformungen';
import Hydratation from './Hydratation';
import Praxisbeispiele from './Praxisbeispiele';
import Eigenspannungen from './Eigenspannungen';
import KriechenSchwinden from './KriechenSchwinden';
import MassigeBauteile from './MassigeBauteile';
import HydratationRissberechnung from './HydratationRissberechnung';
import HydratationPruefverfahren from './HydratationPruefverfahren';

export default function HydratationFolgen() {
  const [activeTab, setActiveTab] = useState<'IntegrationVerformungen' | 'Hydratation' | 'Praxisbeispiele' | 'Eigenspannungen' | 'KriechenSchwinden' | 'MassigeBauteile' | 'HydratationRissberechnung' | 'HydratationPruefverfahren'>('IntegrationVerformungen');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Flame className="text-shiraz" /> Hydratation, Reife &amp; Verformungen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Exotherme Reaktionswärmeentwicklung, Festigkeitsentwicklung (Reifegradmodell), Eigenspannungen sowie zeitabhängige Verformungsmechanismen durch Schwinden, Kriechen und Bauteilzwang nach Eurocode 2 und DAfStb-Richtlinien.
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-xs">
            <strong className="mr-1">Lernpfad:</strong>
            {([
              ['IntegrationVerformungen', 'Übersicht'], ['Hydratation', 'Hydratation & Reife'], ['HydratationPruefverfahren', 'Labor-Prüfverfahren'],
              ['Eigenspannungen', 'Eigenspannungen'], ['MassigeBauteile', 'Massige Bauteile'], ['Praxisbeispiele', 'Zwang & Risse'],
              ['HydratationRissberechnung', 'Rissnachweis'], ['KriechenSchwinden', 'Kriechen & Schwinden'],
            ] as const).map(([id, label], i) => (
              <React.Fragment key={id}>
                {i > 0 && <span className="text-text-main/40">→</span>}
                <button onClick={() => setActiveTab(id)} className="underline decoration-dotted hover:text-shiraz cursor-pointer">{i + 1}. {label}</button>
              </React.Fragment>
            ))}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button 
            onClick={() => setActiveTab('IntegrationVerformungen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'IntegrationVerformungen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <BookOpen size={16} /> Übersicht &amp; Zusammenhänge
          </button>
          <button 
            onClick={() => setActiveTab('Hydratation')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Hydratation' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Activity size={16} /> 1. Hydratation &amp; Reife
          </button>
          <button 
            onClick={() => setActiveTab('Praxisbeispiele')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Praxisbeispiele' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <ShieldAlert size={16} /> 2. Zwang &amp; Risse
          </button>
          <button 
            onClick={() => setActiveTab('HydratationRissberechnung')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'HydratationRissberechnung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Cpu size={16} /> Präziser Rissnachweis (EC2)
          </button>
          <button 
            onClick={() => setActiveTab('Eigenspannungen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Eigenspannungen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Flame size={16} /> 3. Eigenspannungen
          </button>
          <button 
            onClick={() => setActiveTab('KriechenSchwinden')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'KriechenSchwinden' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Layers size={16} /> 4. Kriechen &amp; Schwinden
          </button>
          <button 
            onClick={() => setActiveTab('MassigeBauteile')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'MassigeBauteile' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Layers size={16} /> Massige Bauteile
          </button>
          <button 
            onClick={() => setActiveTab('HydratationPruefverfahren')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'HydratationPruefverfahren' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Activity size={16} /> Labor-Prüfverfahren
          </button>
        </div>

        <div>
          {activeTab === 'IntegrationVerformungen' && <IntegrationVerformungen />}
          {activeTab === 'Hydratation' && <Hydratation />}
          {activeTab === 'Praxisbeispiele' && <Praxisbeispiele />}
          {activeTab === 'HydratationRissberechnung' && <HydratationRissberechnung />}
          {activeTab === 'Eigenspannungen' && <Eigenspannungen />}
          {activeTab === 'KriechenSchwinden' && <KriechenSchwinden />}
          {activeTab === 'MassigeBauteile' && <MassigeBauteile />}
          {activeTab === 'HydratationPruefverfahren' && <HydratationPruefverfahren />}
        </div>
      </div>

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Reifegrad nach Saul"
        zielGleichung="M = \sum (T_i - T_0) \cdot \Delta t_i, \quad T_0 = -10\,^{\circ}\text{C}"
        normQuelle="Saul (1951); ASTM C1074"
        schritte={[
          { titel: '1. Gegeben', formel: 'T = 10\\,^{\\circ}\\text{C},\\; \\Delta t = 48\\,\\text{h}', erklaerung: 'Konstante Betontemperatur bei kühler Witterung.' },
          { titel: '2. Reifegrad', formel: 'M = (10 - (-10)) \\cdot 48 = 960\\,^{\\circ}\\text{C}\\cdot\\text{h}', erklaerung: 'Temperatur über der Bezugstemperatur mal Dauer.' },
          { titel: '3. Gleichwertiges Alter bei 20 °C', formel: 't_{20} = \\frac{960}{20 - (-10)} = 32\\,\\text{h}', erklaerung: 'Bei 20 °C wäre derselbe Reifegrad nach 32 h erreicht.' },
        ]}
        ergebnisHinweis="48 h bei 10 °C entsprechen rund 32 h bei 20 °C (Ansatz nach Saul)."
      />

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Adiabatische Temperaturerhöhung"
        zielGleichung="\Delta T_{ad} = \frac{z \cdot Q}{c \cdot \rho}"
        normQuelle="Wärmebilanz (Lehrwerte); Richtwerte DAfStb-Richtlinie Massige Bauteile"
        schritte={[
          { titel: '1. Gegeben (Lehrwerte)', formel: 'z = 320\\,\\text{kg/m}^3,\\; Q = 350\\,\\text{kJ/kg},\\; c \\cdot \\rho = 2\\,500\\,\\text{kJ/(m}^3\\text{K)}', erklaerung: 'Q = 350 J/g entspricht 350 kJ/kg Zement.' },
          { titel: '2. Wärmemenge', formel: 'z \\cdot Q = 320 \\cdot 350 = 112\\,000\\,\\text{kJ/m}^3', erklaerung: 'Gesamte Hydratationswärme je m³ Beton.' },
          { titel: '3. Temperaturerhöhung', formel: '\\Delta T_{ad} = 112\\,000 / 2\\,500 \\approx 45\\,\\text{K}', erklaerung: 'Ohne Wärmeabfuhr; im Bauteilkern wird dieser Wert näherungsweise erreicht.' },
        ]}
        ergebnisHinweis="Rund 45 K – bei 15 °C Frischbetontemperatur bis rund 60 °C im Kern; Maßnahmen: LH-Zement, Kühlung, Nachbehandlung."
      />

      <ModulTest moduleId="hydratation_folgen" />

      <ModuleFooter
        weblinks={[
          { title: "Beton.wiki: Hydratation", url: "https://beton.wiki/index.php?title=Hydratation" },
          { title: "Beton.wiki: Risse", url: "https://beton.wiki/index.php?title=Risse" }
        ]}
        wikipedia={[
          { title: 'Zementstein', url: 'https://de.wikipedia.org/wiki/Zementstein' },
          { title: 'Zwangspannung', url: 'https://de.wikipedia.org/wiki/Zwangspannung' },
          { title: 'Hydratationswärme', url: 'https://de.wikipedia.org/wiki/Hydratationsw%C3%A4rme' },
          { title: 'Schwinden', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' },
          { title: 'Kriechen', url: 'https://de.wikipedia.org/wiki/Kriechen' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1 mit NA (Eurocode 2: Festigkeitsentwicklung Abschn. 3.1, Kriechen/Schwinden Anhang B, Rissbegrenzung Abschn. 7.3)' },
          { title: 'DAfStb-Heft 600: Erläuterungen zu DIN EN 1992-1-1 und DIN EN 1992-1-1/NA' },
          { title: 'DAfStb-Heft 466: Rissbreitenbeschränkung (Angaben manuell prüfen)' },
          { title: 'DAfStb-Richtlinie Massige Bauteile aus Beton' },
          { title: 'DIN EN 13670 / DIN 1045-3 (Ausführung von Tragwerken aus Beton – Nachbehandlung)' },
          { title: 'DIN 1045-2:2023-08 / DIN EN 206; DIN EN 197-1 (LH-Zement), DIN EN 14216 (VLH-Zement)' },
          { title: 'DIN EN 196-8 / -9 / -11 (Hydratationswärme: Lösungswärme, teiladiabatisch, isotherme Kalorimetrie)' },
          { title: 'ASTM C1074 (Reifegradverfahren); ASTM C1581 (Ringversuch); DIN EN 12617-4 (Schwinden)' },
          { title: 'RILEM TC 119-TCE (Reißrahmen, Zwang im jungen Beton)' },
          { title: 'fib Model Code 2010' },
          { title: 'ZTV-ING (Ingenieurbauten)' }
        ]}
        literatur={[
          'Stark, J.; Wicht, B.: Dauerhaftigkeit von Beton. 2. Aufl., Berlin: Springer Vieweg 2013',
          'Locher, F. W.: Zement – Grundlagen der Herstellung und Verwendung. Düsseldorf: Verlag Bau+Technik 2000',
          'Neville, A. M.: Properties of Concrete. 5. Aufl., Harlow: Pearson 2011',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Lohmeyer, G.: Weiße Wannen – einfach und sicher. Verlag Bau+Technik (aktuelle Auflage manuell prüfen)',
          'Rastrup, E.: Heat of hydration in concrete. Magazine of Concrete Research 6 (1954) 17, S. 79–92',
          'Freiesleben Hansen, P.; Pedersen, J.: Maturity computer for controlled curing and hardening of concrete. Nordisk Betong 1 (1977), S. 19–34',
          'Rostásy, F. S.; Krauß, M.; Budelmann, H.: Planungshilfen zur Beherrschung von Zwang in massigen Bauteilen (DAfStb-Heft 483 – Angaben manuell prüfen)',
          'Breitenbücher, R.: Zwangsspannungen und Rissbildung im jungen Beton (Angaben manuell prüfen)',
          'Springenschmid, R.: Vermeidung von Rissen in jungen Massenbetonbauteilen (Angaben manuell prüfen)',
          'Litzner, H.-U.: Grundlagen der Bemessung nach Eurocode 2 (Angaben manuell prüfen)',
          'Beton-Laborpraxis: Frisch- und Festbetonprüfung, Bindemittelprüfungen. Verlag Bau+Technik (Angaben manuell prüfen)'
        ]}
        formeln={[
          {
            formel: '\\sigma_{ct}(t) = E_{cm}(t) \\cdot \\left[ \\alpha_T \\cdot \\Delta T(t) + \\epsilon_{cs}(t) \\right] \\cdot R \\cdot k_{relax}(t)',
            erklaerung: 'Integraler Spannungsaufbau im jungen Beton unter Berücksichtigung von thermischer Dehnung, Schwinden, Festhaltungsgrad R und viskoelastischer Kriech-Relaxation.',
            quelle: 'Rostásy/Krauß/Budelmann (manuell prüfen); Eurocode 2'
          },
          {
            formel: '\\eta_{riss} = \\frac{\\sigma_{ct}(t)}{f_{ct,eff}(t)} \\le 1{,}0',
            erklaerung: 'Rissrisiko-Kriterium: Übersteigt die Zwangspannung die zu diesem Zeitpunkt verfügbare effektive Betonzugfestigkeit, bildet sich ein Trennriss.',
            quelle: 'DIN EN 1992-1-1'
          },
          {
              formel: 'M = \\sum \\Delta t \\cdot (T_c + 10)',
              erklaerung: 'Reifegrad nach Saul (Nurse-Saul-Funktion): M [°C·d] oder [°C·h] aus Zeitintervallen Δt und Betontemperatur Tc (Basis -10 °C).',
              quelle: 'Nurse (1949) / Saul (1951)'
            },
          {
              formel: 't_e = \\sum \\Delta t \\cdot 2^{\\frac{T_c - 20}{10}}',
              erklaerung: 'Äquivalentalter nach Rastrup: Verdopplung der Erhärtungsrate je 10 K Temperaturanstieg.',
              quelle: 'Rastrup (1954)'
            },
          {
              formel: 't_e = \\sum \\Delta t \\cdot 10^{C \\cdot \\frac{T_c - 20}{10}}',
              erklaerung: 'Äquivalentalter nach de Vree (Temperaturbeiwert meist C = 0.30 bis 0.35 für Normalbeton).',
              quelle: 'de Vree (1976)'
            },
          {
              formel: 't_e = \\sum \\Delta t \\cdot \\exp\\left( \\frac{E_a}{R} \\cdot \\left(\\frac{1}{293{,}15} - \\frac{1}{T_c + 273{,}15}\\right) \\right)',
              erklaerung: 'Äquivalentalter nach Arrhenius (C-Wert-Methode nach Freiesleben Hansen & Pedersen): Berücksichtigt die Aktivierungsenergie Ea (typisch 30–50 kJ/mol).',
              quelle: 'Freiesleben Hansen & Pedersen (1977)'
            },
          {
              formel: 't_e = \\sum \\Delta t \\cdot \\exp\\left( 4000 \\cdot \\left(\\frac{1}{293{,}15} - \\frac{1}{T_c + 273{,}15}\\right) \\right)',
              erklaerung: 'Vereinfachte Arrhenius-Gleichung nach fib Model Code 2010 mit pauschaler Konstante 4000 K (Ea/R).',
              quelle: 'fib Model Code 2010'
            },
          {
              formel: 'f_{cm}(t) = \\beta_{cc}(t) \\cdot f_{cm} = \\exp\\left(s \\cdot \\left(1 - \\sqrt{\\frac{28}{t_e}}\\right)\\right) \\cdot f_{cm}',
              erklaerung: 'Druckfestigkeitsentwicklung nach Eurocode 2 (DIN EN 1992-1-1 Cl. 3.1.2 Gl. 3.1 & 3.2) in Abhängigkeit vom Reifealter te und dem Zement-Beiwert s.',
              quelle: 'DIN EN 1992-1-1 Gl. 3.1 / 3.2'
            },
          {
              formel: 'f_{ctm}(t) = [\\beta_{cc}(t)]^{\\alpha} \\cdot f_{ctm} \\quad (\\alpha = 1{,}0 \\text{ für } t < 28\\,\\text{d};\\; \\alpha = 2/3 \\text{ für } t \\ge 28\\,\\text{d})',
              erklaerung: 'Entwicklung der zentrischen Zugfestigkeit junger Betone nach Eurocode 2 (DIN EN 1992-1-1 Cl. 3.1.2 Gl. 3.4). Eilt im Frühbereich der Druckfestigkeit voraus.',
              quelle: 'DIN EN 1992-1-1 Gl. 3.4'
            },
          {
              formel: 'E_{cm}(t) = \\left(\\frac{f_{cm}(t)}{f_{cm}}\\right)^{0{,}3} \\cdot E_{cm} = [\\beta_{cc}(t)]^{0{,}3} \\cdot E_{cm}',
              erklaerung: 'Zeitliche Entwicklung des Elastizitätsmoduls nach Eurocode 2 (DIN EN 1992-1-1 Cl. 3.1.3 Gl. 3.5). Durch die 0.3-Potenzierung wird der E-Modul sehr früh (ca. 70–80 % nach 2 Tagen) aufgebaut.',
              quelle: 'DIN EN 1992-1-1 Gl. 3.5'
            },
          {
              formel: '\\Delta T_{ad} = \\frac{z \\cdot H_z}{c_p \\cdot \\rho}',
              erklaerung: 'Adiabatischer Temperaturanstieg: z = Zementgehalt [kg/m³], Hz = Hydratationswärme [kJ/kg], cp = spez. Wärmekapazität [ca. 1,0 kJ/(kg·K)], ρ = Betondichte [ca. 2400 kg/m³].',
              quelle: 'DAfStb Massige Bauteile'
            },
          {
              formel: '\\Delta T_{ad} \\approx  c \\cdot  Q_{max} / (c_p \\cdot  \\rho )',
              erklaerung: 'Adiabatischer Temperaturanstieg. c: Zementgehalt, Q_{max}: Hydratationswärme.',
              quelle: 'Lohmeyer, G.: Weiße Wannen - Einfach und sicher (2...'
            },
          {
              formel: '\\sigma_{z}(t) = \\alpha _T \\cdot  E_{c,eff}(t) \\cdot  R \\cdot  (T_{max} - T(t))',
              erklaerung: 'Zwangspannung in der Abkühlphase. α_T: Wärmedehnzahl, E_{c,eff}: Effektiver E-Modul, R: Behinderungsgrad.',
              quelle: 'Lohmeyer, G.: Weiße Wannen - Einfach und sicher (2...'
            },
          {
              formel: '\\varepsilon _{frei} = \\alpha _T \\cdot  \\Delta T + \\varepsilon _{cs}',
              erklaerung: 'Freie (ungehinderte) Dehnung. α_T: Wärmeausdehnungskoeffizient.',
              quelle: 'Lohmeyer, G.: Weiße Wannen - Einfach und sicher (2...'
            },
          {
              formel: '\\sigma_{z} = \\varepsilon _{frei} \\cdot  E_{c} \\cdot  R',
              erklaerung: 'Zwangspannung',
              quelle: 'Lohmeyer, G.: Weiße Wannen - Einfach und sicher (2...'
            },
          {
            formel: '\\Delta T_{ad} = \\frac{z \\cdot Q_h}{c_p \\cdot \\rho}',
            erklaerung: 'Maximal möglicher adiabatischer Temperaturanstieg im Kern massiger Bauteile ohne Wärmeabfuhr (z: Zementgehalt in kg/m³, Q_h: Hydratationswärme in J/kg, c_p: spezifische Wärmekapazität ~ 1,0 kJ/(kg·K), ρ: Betondichte ~ 2400 kg/m³).',
            quelle: 'DAfStb-Richtlinie Massige Bauteile'
          },
          {
            formel: '\\Delta T_{\\text{Kern-Rand}} \\le 15\\,\\text{K} \\dots 20\\,\\text{K}',
            erklaerung: 'Kritischer Grenzwert des Temperaturunterschieds zwischen heißem Kern und abkühlendem Rand zur Vermeidung oberflächennaher Trenn- und Schalenrisse durch Eigenspannungen.',
            quelle: 'DAfStb / DBV-Merkblatt'
          },
          {
            formel: 'A_{s,min} = k_c \\cdot k \\cdot f_{ct,eff} \\cdot A_{ct} / \\sigma_s',
            erklaerung: 'Mindestbewehrungsformel zur Rissbreitenbegrenzung gemäß DIN EN 1992-1-1 Abschnitt 7.3.2.',
            quelle: 'DIN EN 1992-1-1'
          },
          {
            formel: 'q(t) = \\frac{dQ(t)}{dt}',
            erklaerung: 'Spezifischer Wärmefluss (Entwicklungswärmestrom) der Hydratationsdauer.',
            quelle: 'Zementchemie'
          },
          {
            formel: 'M(t) = \\sum_{i} \\left(T_i - T_0\\right) \\cdot \\Delta t_i \\quad [^{\\circ}\\text{C}\\cdot\\text{h}]',
            erklaerung: 'Reifegrad M(t) nach Saul-Nurse zur Prognose der zeit- und temperaturabhängigen Festigkeitsentwicklung des Betons.',
            quelle: 'Saul (1951); ASTM C1074'
          },
          {
            formel: '\\varepsilon_{\\text{tot}}(t, t_0) = \\varepsilon_{ci}(t_0) + \\varepsilon_{cc}(t, t_0) + \\varepsilon_{cs}(t, t_s) + \\varepsilon_{cT}(t)',
            erklaerung: 'Gesamtdehnung von jungem Beton infolge elastischer Lastbeanspruchung εci, zeitabhängigem Kriechen εcc, Trocknungs- und autogenem Schwinden εcs sowie thermischer Kontraktion εcT.',
            quelle: 'DIN EN 1992-1-1 Kap. 3.1.4'
          }
        ]}
      />
    </div>
  );
}
