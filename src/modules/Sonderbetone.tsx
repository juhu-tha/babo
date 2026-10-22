import React, { useState } from 'react';
import { Layers, Droplets, Droplet, Recycle, ShieldAlert, Waves, Box, Target, Zap, Circle, Weight, Package, Construction, MoveDown } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import Leichtbeton from './Leichtbeton';
import Sichtbeton from './Sichtbeton';
import Spritzbeton from './Spritzbeton';
import Recyclingbeton from './Recyclingbeton';
import UHPC from './UHPC';
import Draenbeton from './Draenbeton';
import Faserbeton from './Faserbeton';
import Schleuderbeton from './Schleuderbeton';
import UwBeton from './UwBeton';
import Infraleichtbeton from './Infraleichtbeton';
import SVB from './SVB';
import Schwerbeton from './Schwerbeton';
import Massenbeton from './Massenbeton';
import Pumpbeton from './Pumpbeton';
import Bohrpfahlbeton from './Bohrpfahlbeton';

export default function Sonderbetone() {
  const [activeTab, setActiveTab] = useState<'Leichtbeton' | 'Sichtbeton' | 'Spritzbeton' | 'Recyclingbeton' | 'UHPC' | 'Draenbeton' | 'Faserbeton' | 'Schleuderbeton' | 'UwBeton' | 'Infraleichtbeton' | 'SVB' | 'Schwerbeton' | 'Massenbeton' | 'Pumpbeton' | 'Bohrpfahlbeton'>('Leichtbeton');

  const options = [
    { value: 'Leichtbeton', label: 'Leichtbeton', icon: Box },
    { value: 'Infraleichtbeton', label: 'Infraleichtbeton', icon: Package },
    { value: 'Sichtbeton', label: 'Sichtbeton', icon: Layers },
    { value: 'Spritzbeton', label: 'Spritzbeton', icon: Droplet },
    { value: 'Recyclingbeton', label: 'RC-Beton', icon: Recycle },
    { value: 'UHPC', label: 'UHPC', icon: Target },
    { value: 'Draenbeton', label: 'Dränbeton', icon: Droplets },
    { value: 'Faserbeton', label: 'Faserbeton', icon: ShieldAlert },
    { value: 'Schleuderbeton', label: 'Schleuderbeton', icon: Zap },
    { value: 'UwBeton', label: 'Unterwasserbeton', icon: Waves },
    { value: 'SVB', label: 'SVB (Selbstverdichtend)', icon: MoveDown },
    { value: 'Schwerbeton', label: 'Schwerbeton', icon: Weight },
    { value: 'Massenbeton', label: 'Massenbeton', icon: Box },
    { value: 'Pumpbeton', label: 'Pumpbeton', icon: Circle },
    { value: 'Bohrpfahlbeton', label: 'Bohrpfahlbeton', icon: Construction }
  ];

  const GRUPPEN = [
    { titel: 'Rohdichte', werte: ['Leichtbeton', 'Infraleichtbeton', 'Schwerbeton'] },
    { titel: 'Verarbeitung', werte: ['SVB', 'Pumpbeton', 'Spritzbeton', 'UwBeton', 'Schleuderbeton'] },
    { titel: 'Leistungsbeton', werte: ['UHPC', 'Faserbeton'] },
    { titel: 'Bauteile', werte: ['Massenbeton', 'Bohrpfahlbeton', 'Draenbeton'] },
    { titel: 'Nachhaltigkeit & Optik', werte: ['Recyclingbeton', 'Sichtbeton'] },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Sonderbetone &amp; Spezialanwendungen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 mb-6 leading-relaxed">
          <p>
            Systematische Werkstoffanalyse für 15 spezielle Betonsorten: Von gefügeoptimiertem Leicht- und Schwerbeton über Sichtbetonklassen (SB 1–4) und Spritzbeton bis hin zu Ultra-Hochleistungsbeton (UHPC) und kreislaufgerechtem RC-Beton.
          </p>
        </div>

        <h3 className="block text-xs font-bold text-text-main/70 mb-3 uppercase tracking-wider">
          Sonderbeton-Verfahren auswählen
        </h3>
        {GRUPPEN.map(g => (
          <div key={g.titel} className="mb-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-main/60 mb-1.5">{g.titel}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {options.filter(o => g.werte.includes(o.value)).map((opt) => {
            const Icon = (opt as any).icon;
            const isActive = activeTab === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setActiveTab(opt.value as any)}
                className={"flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs text-center gap-2 cursor-pointer " + (
                  isActive 
                    ? "border-shiraz bg-shiraz text-white shadow-md scale-[1.02]" 
                    : "border-home-grau/30 bg-off-white text-text-main hover:border-shiraz/50 hover:bg-shiraz/5 hover:scale-[1.01]"
                )}
              >
                <Icon size={22} className={isActive ? "text-white" : "text-shiraz/80"} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-semibold leading-tight">{opt.label}</span>
              </button>
            );
            })}
            </div>
          </div>
        ))}
      </div>

      <div>
      {activeTab === 'Leichtbeton' && (
        <Leichtbeton />
      )}
      {activeTab === 'Sichtbeton' && (
        <Sichtbeton />
      )}
      {activeTab === 'Spritzbeton' && (
        <Spritzbeton />
      )}
      {activeTab === 'Recyclingbeton' && (
        <Recyclingbeton />
      )}
      {activeTab === 'UHPC' && (
        <UHPC />
      )}
      {activeTab === 'Draenbeton' && (
        <Draenbeton />
      )}
      {activeTab === 'Faserbeton' && (
        <Faserbeton />
      )}
      {activeTab === 'Schleuderbeton' && (
        <Schleuderbeton />
      )}
      {activeTab === 'UwBeton' && (
        <UwBeton />
      )}
      {activeTab === 'Infraleichtbeton' && (
        <Infraleichtbeton />
      )}
      {activeTab === 'SVB' && (
        <SVB />
      )}
      {activeTab === 'Schwerbeton' && (
        <Schwerbeton />
      )}
      {activeTab === 'Massenbeton' && (
        <Massenbeton />
      )}
      {activeTab === 'Pumpbeton' && (
        <Pumpbeton />
      )}
      {activeTab === 'Bohrpfahlbeton' && (
        <Bohrpfahlbeton />
      )}
      </div>

      <FormulaDerivationBox
        title="Anwendungsbeispiel: E-Modul von Leichtbeton"
        zielGleichung="E_{lcm} = \eta_E \cdot E_{cm}, \quad \eta_E = (\rho / 2200)^2"
        normQuelle="DIN EN 1992-1-1, Abschnitt 11.3.2"
        schritte={[
          { titel: '1. Gegeben', formel: '\\rho = 1\\,600\\,\\text{kg/m}^3', erklaerung: 'Konstruktionsleichtbeton mit Blähton.' },
          { titel: '2. Abminderungsbeiwert', formel: '\\eta_E = (1\\,600 / 2\\,200)^2 = 0{,}727^2 = 0{,}53', erklaerung: 'Die weiche Gesteinskörnung senkt die Steifigkeit.' },
          { titel: '3. Bedeutung', formel: 'E_{lcm} \\approx 0{,}53 \\cdot E_{cm}', erklaerung: 'Bei gleicher Festigkeitsklasse nur rund halb so steif wie Normalbeton – größere Verformungen.' },
        ]}
        ergebnisHinweis="η_E = 0,53: E-Modul rund 47 % geringer als bei Normalbeton."
      />

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Mehrwasser bei RC-Gesteinskörnung"
        zielGleichung="\Delta w = a_{RC} \cdot m_g \cdot WA_{24}"
        normQuelle="Lehrwerte; zulässige Anteile nach DAfStb-Richtlinie (2010) – Übernahme in DIN 1045-2:2023-08 manuell prüfen"
        schritte={[
          { titel: '1. Gegeben', formel: 'a_{RC} = 25\\,\\%,\\; m_g = 1\\,800\\,\\text{kg/m}^3,\\; WA_{24} = 5\\,\\%', erklaerung: 'Typ 1 (Betonsplitt) mit 24-h-Wasseraufnahme 5 M.-%.' },
          { titel: '2. Mehrwasser', formel: '\\Delta w = 0{,}25 \\cdot 1\\,800 \\cdot 0{,}05 = 22{,}5\\,\\text{kg/m}^3', erklaerung: 'Wird von der porösen Körnung aufgesogen und steht nicht für die Verarbeitbarkeit zur Verfügung.' },
          { titel: '3. Folge', formel: '\\Rightarrow \\text{Vornässen oder Zugabewasser erhöhen (ohne den wirksamen w/z zu ändern)}', erklaerung: 'Wirksamer Wassergehalt bleibt maßgebend für w/z.' },
        ]}
        ergebnisHinweis="Rund 22,5 kg/m³ zusätzliches Wasser für die Kernfeuchte der RC-Körnung."
      />

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Hohlraumgehalt von Dränbeton"
        zielGleichung="V_{Hohlraum} = 1000 - \frac{z}{\rho_z} - \frac{w}{\rho_w} - \frac{g}{\rho_g}"
        normQuelle="Stoffraumrechnung (Lehrwerte)"
        schritte={[
          { titel: '1. Gegeben', formel: 'z = 250,\\; w = 95,\\; g_{4/8} = 1\\,550\\,\\text{kg/m}^3;\\; \\rho_z = 3{,}1,\\; \\rho_g = 2{,}65\\,\\text{kg/dm}^3', erklaerung: 'Einkornbeton ohne Sand, w/z = 0,38.' },
          { titel: '2. Feststoffvolumen', formel: '80{,}6 + 95{,}0 + 584{,}9 = 760{,}5\\,\\text{dm}^3', erklaerung: 'Zement, Wasser und Gesteinskörnung.' },
          { titel: '3. Hohlraum', formel: 'V_{Hohlraum} = 1000 - 760{,}5 = 239{,}5\\,\\text{dm}^3 \\approx 24\\,\\%', erklaerung: 'Innerhalb des üblichen Bereichs von 15–25 %.' },
        ]}
        ergebnisHinweis="Rund 24 % Hohlraum – Voraussetzung für die Wasserdurchlässigkeit."
      />

      <FormulaDerivationBox
        title="Anwendungsbeispiel: SVB mit Flugasche – äquivalenter w/z-Wert"
        zielGleichung="(w/z)_{eq} = \frac{w}{z + 0{,}4 \cdot f_{anr}}, \quad f_{anr} \le 0{,}33 \cdot z"
        normQuelle="DIN 1045-2 (Anrechnung von Flugasche)"
        schritte={[
          { titel: '1. Gegeben', formel: 'z = 380,\\; f = 180,\\; w = 170\\,\\text{kg/m}^3', erklaerung: 'Mehlkornreicher SVB.' },
          { titel: '2. Anrechenbare Flugasche', formel: 'f_{anr} = \\min(180;\\; 0{,}33 \\cdot 380) = 125\\,\\text{kg/m}^3', erklaerung: 'Der Rest wirkt nur als Füller.' },
          { titel: '3. Äquivalenter w/z-Wert', formel: '(w/z)_{eq} = \\frac{170}{380 + 0{,}4 \\cdot 125} = \\frac{170}{430} = 0{,}40', erklaerung: 'Ohne Anrechnung: 170/380 = 0,45.' },
        ]}
        ergebnisHinweis="(w/z)eq = 0,40."
      />

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Ist es Schwerbeton?"
        zielGleichung="\rho = \frac{m_z + m_w + m_g}{V} > 2\,600\,\text{kg/m}^3"
        normQuelle="DIN EN 206 (Schwerbeton: Trockenrohdichte > 2 600 kg/m³)"
        schritte={[
          { titel: '1. Gegeben (Lehrwerte)', formel: 'm_z = 350,\\; m_w = 160,\\; m_g = 2\\,800\\,\\text{kg je m}^3 \\;(\\text{Baryt})', erklaerung: 'Strahlenschutzbeton mit Baryt-Gesteinskörnung.' },
          { titel: '2. Frischbetonrohdichte', formel: '\\rho = 350 + 160 + 2\\,800 = 3\\,310\\,\\text{kg/m}^3', erklaerung: 'Die Trockenrohdichte liegt um den verdunstbaren Wasseranteil darunter.' },
          { titel: '3. Einstufung', formel: '3\\,310 > 2\\,600 \\Rightarrow \\text{Schwerbeton}', erklaerung: 'Auch nach Abzug des Wassers deutlich über der Grenze.' },
        ]}
        ergebnisHinweis="Rund 3 300 kg/m³ – Schwerbeton."
      />

      <ModulTest moduleId="sonderbetone" />

      <ModuleFooter
        weblinks={[
          { title: 'Beton.wiki: Leichtbeton', url: 'https://beton.wiki/index.php?title=Leichtbeton' },
          { title: 'Beton.wiki: Infraleichtbeton', url: 'https://beton.wiki/index.php?title=Infraleichtbeton' },
          { title: 'Verein Deutscher Zementwerke (VDZ): Zement-Taschenbuch', url: 'https://www.vdz-online.de/publikationen/zement-taschenbuch' },
          { title: 'Beton.wiki: Spritzbeton', url: 'https://beton.wiki/index.php?title=Spritzbeton' },
          { title: 'Beton.wiki: UHPC', url: 'https://beton.wiki/index.php?title=UHPC' },
          { title: 'Beton.wiki: Dränbeton', url: 'https://beton.wiki/index.php?title=Dr%C3%A4nbeton' },
          { title: 'Beton.wiki: Faserbeton', url: 'https://beton.wiki/index.php?title=Faserbeton' },
          { title: 'Beton.wiki: Schleuderbeton', url: 'https://beton.wiki/index.php?title=Schleuderbeton' },
          { title: 'Beton.wiki: Unterwasserbeton', url: 'https://beton.wiki/index.php?title=Unterwasserbeton' },
          { title: 'Beton.wiki: SVB', url: 'https://beton.wiki/index.php?title=Selbstverdichtender_Beton' },
          { title: 'Beton.wiki: Schwerbeton', url: 'https://beton.wiki/index.php?title=Schwerbeton' },
          { title: 'Beton.wiki: Massige Bauteile', url: 'https://beton.wiki/index.php?title=Massige_Bauteile' },
          { title: 'Beton.wiki: Pumpbeton', url: 'https://beton.wiki/index.php?title=Pumpbeton' }
        ]}
        wikipedia={[
          { title: 'Leichtbeton', url: 'https://de.wikipedia.org/wiki/Leichtbeton' },
          { title: 'Porenbeton', url: 'https://de.wikipedia.org/wiki/Porenbeton' },
          { title: 'Spritzbeton', url: 'https://de.wikipedia.org/wiki/Spritzbeton' },
          { title: 'Neue Österreichische Tunnelbaumethode', url: 'https://de.wikipedia.org/wiki/Neue_%C3%96sterreichische_Tunnelbaumethode' },
          { title: 'Recyclingbeton', url: 'https://de.wikipedia.org/wiki/Recyclingbeton' },
          { title: 'Bauschutt', url: 'https://de.wikipedia.org/wiki/Bauschutt' },
          { title: 'Ultrahochfester Beton', url: 'https://de.wikipedia.org/wiki/Ultrahochfester_Beton' },
          { title: 'Silikastaub', url: 'https://de.wikipedia.org/wiki/Silikastaub' },
          { title: 'Dränbeton', url: 'https://de.wikipedia.org/wiki/Dr%C3%A4nbeton' },
          { title: 'Versickerung', url: 'https://de.wikipedia.org/wiki/Versickerung' },
          { title: 'Faserbeton', url: 'https://de.wikipedia.org/wiki/Faserbeton' },
          { title: 'Stahlfaserbeton', url: 'https://de.wikipedia.org/wiki/Stahlfaserbeton' },
          { title: 'Schleuderbeton', url: 'https://de.wikipedia.org/wiki/Schleuderbeton' },
          { title: 'Zentrifugalkraft', url: 'https://de.wikipedia.org/wiki/Zentrifugalkraft' },
          { title: 'Unterwasserbeton', url: 'https://de.wikipedia.org/wiki/Unterwasserbeton' },
          { title: 'Hydrostatischer Druck', url: 'https://de.wikipedia.org/wiki/Hydrostatischer_Druck' },
          { title: 'Selbstverdichtender Beton', url: 'https://de.wikipedia.org/wiki/Selbstverdichtender_Beton' },
          { title: 'Rheologie', url: 'https://de.wikipedia.org/wiki/Rheologie' },
          { title: 'Schwerbeton', url: 'https://de.wikipedia.org/wiki/Schwerbeton' },
          { title: 'Strahlenschutz', url: 'https://de.wikipedia.org/wiki/Strahlenschutz' },
          { title: 'Walzbeton', url: 'https://de.wikipedia.org/wiki/Walzbeton' },
          { title: 'Betonpumpe', url: 'https://de.wikipedia.org/wiki/Betonpumpe' },
          { title: 'Hagen-Poiseuille-Gesetz', url: 'https://de.wikipedia.org/wiki/Gesetz_von_Hagen-Poiseuille' },
          { title: 'Bohrpfahl', url: 'https://de.wikipedia.org/wiki/Bohrpfahl' },
          { title: 'Spezialtiefbau', url: 'https://de.wikipedia.org/wiki/Spezialtiefbau' }
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Leichtbetonklassen LC8/9 bis LC80/88, Rohdichteklassen D1.0 bis D2.0)' },
          { title: 'DIN EN 1992-1-1:2011-01 mit NA:2013-04, Abschnitt 11 (Leichtbeton); Neuausgabe DIN EN 1992-1-1:2025-09' },
          { title: 'DIN EN 13055:2016-11 (Leichte Gesteinskörnungen)' },
          { title: 'DBV-Merkblatt Konstruktionsleichtbeton (Ausgabe manuell prüfen)' },
          { title: 'DIBt: Vorhabenbezogene Bauartgenehmigung (vBG) / Zustimmung im Einzelfall (ZiE)' },
          { title: 'DIN EN 206 / DIN 1045-2 (Rohdichteklassen D0.8 und D1.0)' },
          { title: 'DIN EN 14487-1 / -2 (Spritzbeton - Teil 1: Begriffe, Festlegungen und Konformität; Teil 2: Ausführung)' },
          { title: 'DIN 18551 (Spritzbeton; Herstellung und Güteüberwachung)' },
          { title: 'DIN 18314 (VOB/C: Spritzbetonarbeiten)' },
          { title: 'ÖBV-Richtlinie Spritzbeton (Klassen J1, J2, J3 zur Frühfestigkeit)' },
          { title: 'DAfStb-Richtlinie Beton nach DIN EN 206-1 und DIN 1045-2 mit rezyklierten Gesteinskörnungen nach DIN EN 12620 (2010-09)' },
          { title: 'DIN EN 12620:2008-07 / DIN 4226-101/-102:2017-08 (Rezyklierte Gesteinskörnungen Typ 1 und Typ 2)' },
          { title: 'DIN 1045-2:2023-08 (Beton mit rezyklierter Gesteinskörnung; Bezeichnungen manuell prüfen)' },
          { title: 'DAfStb-Richtlinie Ultrahochfester Beton – in Vorbereitung; Sachstand: DAfStb-Heft 561 (2008)' },
          { title: 'NF P 18-470 (Bétons fibrés à ultra-hautes performances - Spécification, performance, production et conformité)' },
          { title: 'FGSV-Merkblatt für Versickerungsfähige Verkehrsflächen (M Vv)' },
          { title: 'FGSV: Merkblatt für Dränbetontragschichten (DBT)' },
          { title: 'ZTV Wegebau (Zusätzliche Technische Vertragsbedingungen für den Bau von Wegen und Plätzen)' },
          { title: 'DIN EN 12620 (Gesteinskörnungen für Beton - Anforderungen an eng gestufte Korngruppen)' },
          { title: 'DAfStb-Richtlinie Stahlfaserbeton (2012-11; Leistungsklassen L0,9/0,6 bis L3,0/2,4)' },
          { title: 'DIN EN 14889-1 (Fasern für Beton - Teil 1: Stahlfasern)' },
          { title: 'DIN EN 14889-2 (Fasern für Beton - Teil 2: Polymerfasern)' },
          { title: 'DIN EN 14651 (Prüfverfahren für Beton mit metallischen Fasern - Biegezugfestigkeit)' },
          { title: 'DIN EN 12843 (Betonfertigteile - Maste)' },
          { title: 'DIN EN 1916 / DIN V 1201 (Rohre und Formstücke aus Beton, Stahlfaserbeton und Stahlbeton)' },
          { title: 'DIN EN 206 / DIN 1045-2 (Unterwasserbeton; Mindestzementgehalt manuell prüfen)' },
          { title: 'ZTV-W LB 215 (Zusätzliche Technische Vertragsbedingungen im Wasserbau - Wasserbauwerke aus Beton)' },
          { title: 'DBV-Merkblatt Unterwasserbeton (manuell prüfen)' },
          { title: 'DAfStb-Richtlinie Selbstverdichtender Beton (SVB-Richtlinie, 2012-09)' },
          { title: 'DIN EN 12350-8 (Prüfung von Frischbeton - Teil 8: Selbstverdichtender Beton - Setzfließversuch)' },
          { title: 'DIN EN 12350-9 / -10 / -12 (V-Trichter-Versuch, L-Kasten-Versuch, Blockierring-Versuch)' },
          { title: 'DIN EN 206 / DIN 1045-2 (Konsistenzklassen SF1 bis SF3, Viskositätsklassen VS1/VS2)' },
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Schwerbeton mit Trockenrohdichte > 2600 kg/m³)' },
          { title: 'DIN 25413-1:1995-10 (Strahlenschutzbeton - Teil 1: Baustoffe für Strahlenschutzbeton)' },
          { title: 'DIN 6847-2:2008-03 (Medizinische Elektronenbeschleuniger-Anlagen - Baulicher Strahlenschutz)' },
          { title: 'DAfStb-Richtlinie: Massige Bauteile aus Beton' },
          { title: 'DIN EN 197-1 (Zemente mit niedriger Hydratationswärme LH / sehr niedriger Hydratationswärme VLH)' },
          { title: 'DIN EN 1992-1-1 / DIN EN 1992-3 (Rissbreitenbegrenzung infolge früher Zwangskräfte)' },
          { title: 'DBV-Merkblatt Pumpbeton (manuell prüfen)' },
          { title: 'DIN EN 206 / DIN 1045-2 (Mindestmehlkorngehalt für pumpbare Betone)' },
          { title: 'DIN 24200 (Betonpumpen und Verteilermaste - Sicherheitstechnische Anforderungen)' },
          { title: 'DIN EN 1536:2015-10 (Ausführung von Arbeiten im Spezialtiefbau - Bohrpfähle)' },
          { title: 'DIN EN 206 / DIN 1045-2 (Anforderungen an Beton für Geotechnische Bauteile / Bohrpfähle)' },
          { title: 'Empfehlungen des Arbeitskreises Pfähle (EA-Pfähle, DGGT)' },
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton: Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DBV/VDZ-Merkblatt Sichtbeton (2015)' }
        ]}
        literatur={[
          'Grübl, P.; Weigler, H.; Karl, S.: Beton – Arten, Herstellung und Eigenschaften. 2. Aufl., Berlin: Ernst & Sohn 2001',
          'Faust, T.: Leichtbeton im konstruktiven Ingenieurbau (Angaben manuell prüfen)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Lösch, C.; Rieseberg, P.; Hückler, A.: Infraleichtbeton – Entwurf, Konstruktion, Bau (2025)',
          'Maidl, B.: Handbuch für Spritzbeton. Berlin: Ernst & Sohn 1992',
          'Kusterle, W. et al.: Spritzbetontechnologie (Ernst & Sohn, Beton-Kalender) (Angaben manuell prüfen)',
          'DAfStb-Hefte zu rezyklierten Gesteinskörnungen (Heftnummern manuell prüfen)',
          'Müller, A.: Baustoffrecycling – Entstehung, Aufbereitung, Verwertung. Wiesbaden: Springer Vieweg 2018',
          'DAfStb-Heft 561: Sachstandsbericht Ultrahochfester Beton (2008)',
          'Fehling, E.; Schmidt, M.; Walraven, J. et al. (2014): Ultra-High Performance Concrete UHPC (Ernst & Sohn)',
          'Forschungsgesellschaft für Straßen- und Verkehrswesen (FGSV): Leitfaden für Dränbeton im Straßenbau (Angaben manuell prüfen)',
          'König, G.; Kützing, L.: Grundlagen des Faserbetons (Angaben manuell prüfen)',
          'DAfStb-Heft 614: Erläuterungen zur DAfStb-Richtlinie Stahlfaserbeton (2015)',
          'Beton-Kalender: Fertigteile und Spannbetonmaste (Ernst & Sohn) (Angaben manuell prüfen)',
          'Bundesanstalt für Wasserbau (BAW): Richtlinie Unterwasserbeton für Trog- und Sohlenbauwerke (Angaben manuell prüfen)',
          'DAfStb-Heft 560: Sachstandsbericht Selbstverdichtender Beton (Angaben manuell prüfen)',
          'Dehn, F.; Holschemacher, K.: Selbstverdichtender Beton (Angaben manuell prüfen)',
          'Schultze, N.: Strahlenschutz im Hochbau (Bauverlag) (Angaben manuell prüfen)',
          'Erläuterungen zur DAfStb-Richtlinie Massige Bauteile aus Beton (Heftnummer manuell prüfen; Heft 555 betrifft WU-Bauwerke)',
          'Kaplan, D.; de Larrard, F.; Sedran, T. (2005): Design of Concrete Pumping Pipes and Rheology (ACI Materials Journal) (Angaben manuell prüfen)',
          'Kempfert, H.-G.; Lüking, J.: Geotechnik nach Eurocode, Band 2: Grundbau (2020)'
        ]}
        formeln={[
          {
            formel: '\\eta_E = \\left( \\frac{\\rho}{2200} \\right)^2',
            erklaerung: 'Modifikationsbeiwert η_E nach DIN EN 1992-1-1 Abschnitt 11 für den Elastizitätsmodul von Leichtbeton: E_{lcm} = \\eta_E \\cdot E_{cm}.',
            quelle: 'DIN EN 1992-1-1 Abs. 11.3.2'
          },
          {
            formel: '\\eta_1 = 0{,}40 + 0{,}60 \\cdot \\frac{\\rho}{2200}',
            erklaerung: 'Abminderungsfaktor η_1 für Zugfestigkeiten von Leichtbeton infolge der reduzierten Kornfestigkeit des porigen Gefüges.',
            quelle: 'DIN EN 1992-1-1 Abs. 11.3.1'
          },
          {
            formel: 'f_{lctm} = \\eta_1 \\cdot f_{ctm}',
            erklaerung: 'Mittlere axiale Zugfestigkeit von Leichtbeton bezogen auf die Festigkeit eines Normalbetons gleicher Druckfestigkeitsklasse.',
            quelle: 'DIN EN 1992-1-1 Tab. 11.3.1'
          },
          {
            formel: '\\rho_{dry} < 800\\,\\text{kg/m}^3',
            erklaerung: 'Trockenrohdichtekriterium für Infraleichtbeton (ILB), welcher unterhalb der genormten Leichtbeton-Dichteklassen der DIN EN 206 (D1.0 bis D2.0) liegt.',
            quelle: 'TU Berlin / Schlaich (2018)'
          },
          {
            formel: '\\lambda_{10,dry} \\approx 0{,}12 - 0{,}18\\,\\text{W/(m}\\cdot\\text{K)}',
            erklaerung: 'Sehr niedrige Bemessungswerte der Wärmeleitfähigkeit ermöglichen monolithische Außenwände (U-Wert < 0,24 W/(m²K) bei Wandstärken um 40-50 cm) ohne Zusatzdämmung.',
            quelle: 'Schlaich & Hückler (2018)'
          },
          {
            formel: 'R = \\frac{m_{\\text{Rückprall}}}{m_{\\text{Gesamtförderung}}} \\cdot 100\\,\\%',
            erklaerung: 'Rückprallquote R: Anteil des von der Wand oder Decke abprallenden Materials (Trockenspritzen ca. 15-30 %, Nassspritzen ca. 5-15 %).',
            quelle: 'Erfahrungswerte (DIN EN 14487 regelt das Verfahren)'
          },
          {
            formel: 'E_{\\text{kin}} = \\frac{1}{2} m \\cdot v^2 \\quad (v \\approx 20 - 30\\,\\text{m/s})',
            erklaerung: 'Kinetische Aufprallenergie an der Spritzdüse, die zur selbsttätigen Gefügeverdichtung des Frischbetons an der Schalungs-/Felswand führt.',
            quelle: 'ÖBV-Richtlinie Spritzbeton'
          },
          {
            formel: 'w_{\\text{korr}} = w_{\\text{eff}} + \\sum \\left( m_{\\text{RC},i} \\cdot \\frac{\\text{WA}_{24,i} - h_i}{100} \\right)',
            erklaerung: 'Korrektur des Zugabewassers für RC-Beton: Berücksichtigung der 24-Stunden-Wasseraufnahme WA_24 der porösen Altmörtelanteile im Vergleich zur Eigenfeuchte h.',
            quelle: 'DAfStb-Richtlinie R-Beton'
          },
          {
            formel: 'E_{\\text{cm,RC}} = E_{\\text{cm}} \\cdot \\left( 1 - \\alpha_{\\text{RC}} \\cdot \\frac{\\text{RC\\%}}{100} \\right)',
            erklaerung: 'Abminderung des statischen E-Moduls infolge des geringeren E-Moduls der Altmörtel- und Ziegelphasen (α_RC ≈ 0.25 bis 0.40 je nach Typ 1 oder 2).',
            quelle: 'DAfStb Heft 600'
          },
          {
            formel: 'f_{ck} \\ge 150\\,\\text{N/mm}^2 \\quad (f_{cm} > 165 - 200\\,\\text{N/mm}^2)',
            erklaerung: 'Festigkeitskriterium für ultrahochfesten Beton (in der Literatur ab etwa 150 N/mm²; keine genormten Klassen) bei extrem dichter Packungsdichte.',
            quelle: 'Literatur (Fehling u. a. 2014); keine genormten Klassen'
          },
          {
            formel: 'w/z \\le 0{,}20 - 0{,}25 \\quad (w/(z + k \\cdot s) \\approx 0{,}18)',
            erklaerung: 'Extrem niedriger Wasserzementwert; das Porenwasser reicht nicht für vollständige Hydratation aus, Zementkerne wirken als mikrofeiner Festkörperfüllstoff.',
            quelle: 'Fehling et al. (2014)'
          },
          {
            formel: 'k_w \\ge 10^{-4} - 10^{-3}\\,\\text{m/s}',
            erklaerung: 'Geforderter Wasserdurchlässigkeitsbeiwert (Permeabilität) für Dränbetontragschichten nach FGSV zur sicheren Niederschlagsversickerung.',
            quelle: 'FGSV M Vv'
          },
          {
            formel: 'v_{\\text{Hohlraum}} = \\left( 1 - \\frac{\\rho_{\\text{Fest}}}{\\rho_{\\text{Realisierung}}} \\right) \\cdot 100\\,\\% \\approx 15 - 25\\,\\%',
            erklaerung: 'Zusammenhängender Haufwerkshohlraumgehalt des Einkorngefüges, der die Wasserabführung ohne Staudruck gewährleistet.',
            quelle: 'Zement-Merkblatt B13'
          },
          {
            formel: 'f_{R,j} = \\frac{3 \\cdot F_j \\cdot l}{2 \\cdot b \\cdot h_{\\text{sp}}^2}',
            erklaerung: 'Residuelle Biegezugfestigkeit f_R,j nach DIN EN 14651 am gekerbten Balken bei Rissöffnungsweiten CMOD (j = 1: 0,5 mm, j = 4: 3,5 mm).',
            quelle: 'DIN EN 14651'
          },
          {
            formel: '\\lambda = \\frac{l_f}{d_f} \\quad (\\text{Schlankheitsgrad der Faser})',
            erklaerung: 'Verhältnis von Faserlänge zu Faserdurchmesser: Bestimmt die Verankerungs- und Rissüberbrückungsfähigkeit im Zementstein.',
            quelle: 'DAfStb-Richtlinie Stahlfaserbeton'
          },
          {
            formel: 'a_z = \\omega^2 \\cdot r = (2 \\pi \\cdot n)^2 \\cdot r \\quad (\\approx 20 - 50\\,g)',
            erklaerung: 'Zentrifugalbeschleunigung während der Schleuderphase bei Drehzahl n und Radius r zur mechanischen Wasserabpressung und Entlüftung.',
            quelle: 'Grübl et al. (2001)'
          },
          {
            formel: '(w/z)_{\\text{eff}} = (w/z)_0 - \\frac{\\Delta m_w}{z} \\quad (\\approx 0{,}30 - 0{,}35)',
            erklaerung: 'Effektiver w/z-Wert des erhärtenden Rohrkörpers nach radialem Auspressen und Abfließen des Schlempewassers Δm_w zum Rohrinnenraum.',
            quelle: 'DIN EN 12843'
          },
          {
            formel: 'p_{\\text{Beton}} = \\rho_c \\cdot g \\cdot h_c > p_{\\text{Wasser}} = \\rho_w \\cdot g \\cdot h_w',
            erklaerung: 'Hydrostatisches Druckgleichgewicht beim Contractor-Verfahren: Das Betongewicht im Schüttrohr muss den äußeren Wasserdruck überwinden, um kontinuierlichen Austritt sicherzustellen.',
            quelle: 'DBV-Merkblatt Unterwasserbeton'
          },
          {
            formel: 'h_{\\text{Eintauch}} \\ge 1{,}5 - 2{,}0\\,\\text{m}',
            erklaerung: 'Mindesteintauchtiefe des Schüttrohres im frischen Betonbett, um den direkten Kontakt des frischen Zementleims mit dem umgebenden Wasser zu verhindern.',
            quelle: 'ZTV-W LB 215'
          },
          {
            formel: 'SF = \\frac{d_1 + d_2}{2} \\quad (\\text{Setzfließmaß}, \\text{Klassen SF1: } 550-650\\,\\text{mm},\\, \\text{SF2: } 660-750\\,\\text{mm},\\, \\text{SF3: } 760-850\\,\\text{mm})',
            erklaerung: 'Prüfkriterium nach DIN EN 12350-8 zur Einstufung des Fließvermögens von SVB ohne Erschütterung.',
            quelle: 'DIN EN 12350-8'
          },
          {
            formel: 't_{500} \\le 2\\,\\text{s} \\quad (\\text{Viskosität VS1}) \\quad \\text{bzw.} \\quad t_{500} > 2\\,\\text{s} \\quad (\\text{Viskosität VS2})',
            erklaerung: 'Zeitdauer bis zum Erreichen eines Fließkreisdurchmessers von 500 mm zur Beurteilung der plastischen Viskosität.',
            quelle: 'DIN EN 206'
          },
          {
            formel: 'I(x) = I_0 \\cdot e^{-\\mu \\cdot x} = I_0 \\cdot 2^{-x / d_{1/2}}',
            erklaerung: 'Lambert-Beersches Schwächungsgesetz für Gammastrahlung: Je höher der lineare Schwächungskoeffizient μ (proportional zur Materialdichte ρ), desto geringer die erforderliche Halbwertsdicke d_1/2.',
            quelle: 'DIN 25413-1'
          },
          {
            formel: '\\rho_{\\text{dry}} > 2600\\,\\text{kg/m}^3 \\quad (\\text{typisch } 3200 - 4500\\,\\text{kg/m}^3)',
            erklaerung: 'Normative Definition von Schwerbeton nach DIN EN 206 unter Verwendung hochdichter Gesteinskörnungen (Baryt, Magnetit, Hämatit).',
            quelle: 'DIN EN 206'
          },
          {
            formel: '\\Delta T_{\\text{ad}} = \\frac{z \\cdot Q_{H,7d}}{c_c \\cdot \\rho_c} \\approx \\frac{z \\cdot 250\\,\\text{kJ/kg}}{1{,}0\\,\\text{kJ/(kg}\\cdot\\text{K)} \\cdot 2400\\,\\text{kg/m}^3}',
            erklaerung: 'Adiabater Temperaturanstieg ΔT_ad infolge Zementhydratation im Bauteilkern ohne äußere Wärmeabfuhr.',
            quelle: 'DAfStb-Richtlinie Massige Bauteile'
          },
          {
            formel: '\\Delta T_{\\text{Kern-Rand}} \\le 15 - 20\\,\\text{K}',
            erklaerung: 'Kritische Begrenzung der Temperaturdifferenz zwischen Bauteilkern und Oberfläche zur Vermeidung von Trennrissen durch Eigenspannungen.',
            quelle: 'DAfStb Heft 555'
          },
          {
            formel: '\\Delta p = \\frac{2 \\cdot \\tau_0 \\cdot L}{R} + \\frac{4 \\cdot \\mu \\cdot Q \\cdot L}{\\pi \\cdot R^4}',
            erklaerung: 'Druckverlust Δp bei der Rohrströmung (Bingham-Fluid / Buckingham-Reiner-Beziehung) über Rohrlänge L, Innenradius R, Fließgrenze τ_0 und plastische Viskosität μ.',
            quelle: 'Kaplan et al. (2005)'
          },
          {
            formel: 'm_{\\text{Mehlkorn}} \\ge 350 - 400\\,\\text{kg/m}^3 \\quad (\\le 0{,}125\\,\\text{mm})',
            erklaerung: 'Erforderlicher Mehlkorngehalt (Zement + Flugasche + Feinsandanteile) zur kontinuierlichen Ausbildung der 1-2 mm Gleitschicht an der Stahlwandung.',
            quelle: 'DBV-Merkblatt Pumpbeton'
          },
          {
            formel: 'm_{\\text{Zement}} \\ge 325 - 375\\,\\text{kg/m}^3 \\quad (w/z \\le 0{,}60)',
            erklaerung: 'Mindestzementgehalt nach DIN EN 1536 / DIN 1045-2 in Abhängigkeit vom Größtkorn (16 bzw. 32 mm) und dem Einbauverfahren (trocken oder unter Stützflüssigkeit).',
            quelle: 'DIN EN 1536 / DIN 1045-2'
          },
          {
            formel: 't_{\\text{Verarbeitbarkeit}} \\ge t_{\\text{Förderung}} + t_{\\text{Einbau}} + 2\\,\\text{h}',
            erklaerung: 'Mindestdauer der Konsistenzhaltung (oft 4 bis 6 Stunden) zur Vermeidung von Abreißern des Betonstrangs beim Ziehen der Verrohrung.',
            quelle: 'EA-Pfähle'
          },
          {
            formel: '\\rho_{\\text{dry}} = \\frac{m_{\\text{dry}}}{V} \\le 2000 \\quad [\\text{kg/m}^3] \\quad (\\text{Leichtbeton})',
            erklaerung: 'Trockenrohdichtekriterium für Leichtbeton nach DIN EN 206 (Rohdichteklassen D1,0 bis D2,0) unter Verwendung poröser Gesteinskörnungen (Blähton, Bims).',
            quelle: 'DIN EN 206 Abs. 4.3'
          },
          {
            formel: 'f_{ctk,fl} = \\alpha_{fl} \\cdot f_{ctk,ax} \\quad [\\text{N/mm}^2], \\quad f_{R,1k} \\dots f_{R,4k}',
            erklaerung: 'Charakteristische Biegezug- und Nachrisszugfestigkeiten (Residual Flexural Strengths) von Stahlfaserbeton zur Bemessung tragender Bauteile.',
            quelle: 'DAfStb-Richtlinie Stahlfaserbeton'
          }
        ]}
      />
    </div>
  );
}
