import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
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

export default function Sonstiges() {
  const [activeTab, setActiveTab] = useState<'pcm' | 'leichtzuschlaege' | 'aerogele' | 'selfhealing' | 'photokatalyse' | 'vip'>('pcm');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="text-shiraz" /> Sonstige &amp; Innovationen
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
          <p>
            Zusammenfassung wichtiger Spezialthemen der Baustofftechnologie sowie zukunftsweisende Innovationen der zeitgenössischen Baustoffforschung.
          </p>
        </div>

        {/* Dynamic Navigation Sub-tabs */}
        <div className="flex flex-wrap gap-2 py-4 border-b border-home-grau/20 mb-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'pcm' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('pcm')}
          >
            <ThermometerSun size={16} /> PCM (Phasenwechsel)
          </button>
          
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'leichtzuschlaege' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('leichtzuschlaege')}
          >
            <CircleDashed size={16} /> Leichtzuschläge
          </button>
          
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'aerogele' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('aerogele')}
          >
            <Box size={16} /> Aerogele
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'selfhealing' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('selfhealing')}
          >
            <Droplets size={16} /> Selbstheilender Beton
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'photokatalyse' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('photokatalyse')}
          >
            <Cpu size={16} /> Smarte Baustoffe &amp; TiO₂
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'vip' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('vip')}
          >
            <Maximize size={16} /> Vakuum-Dämmung (VIP) &amp; Myzel
          </button>
        </div>

        {/* 1. SECTION: PCM */}
        {activeTab === 'pcm' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                <strong>Phasenwechselmaterialien (PCM - Phase Change Materials)</strong> sind Latentwärmespeicher. Sie nutzen die beim Phasenübergang (meist fest zu flüssig) aufgenommene oder abgegebene Wärmeenergie, um Temperaturschwankungen in Gebäuden auszugleichen und das Raumklima passiv zu verbessern.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <ThermometerSun size={18} /> Funktionsweise &amp; Materialien
                </h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><strong>Prinzip:</strong> Beim Schmelzen (z.B. tagsüber) nimmt das Material Wärme auf und kühlt den Raum bei konstanter Schmelztemperatur. Beim Erstarren (nachts) gibt es die Wärme wieder ab.</li>
                  <li><strong>Paraffine:</strong> Organische Kohlenwasserstoffe, chemisch inert, kein Supercooling, aber brennbar.</li>
                  <li><strong>Salzhydrate:</strong> Anorganische Salze mit Kristallwasser, nicht brennbar, höhere volumetrische Speicherdichte, können aber zur Entmischung und Unterkühlung neigen.</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Layers size={18} /> Anwendung im Bauwesen
                </h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><strong>Leichtbau:</strong> Erhöhung der thermischen Masse in Trockenbauwänden durch mikroverkapseltes PCM in Gipsplatten (z.B. zur Vermeidung sommerlicher Überhitzung).</li>
                  <li><strong>Kühldecken:</strong> Integration in abgehängte Decken zur passiven Spitzenlastkühlung ohne Kühlaggregate.</li>
                  <li><strong>Funktionsputze:</strong> Einmischung von PCM-Mikrokapseln in Innen- oder Außenputze zur Thermoregulierung im Tagesverlauf.</li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide block mb-1">Physikalischer Hintergrund: Latente Wärme</span>
              <p className="text-xs text-indigo-950/80 leading-relaxed">
                Die Phasenänderungsenthalpie &Delta;H_melt ermöglicht es, in einem engen Temperaturbereich (übliche Einsatzbereiche bei 21 °C bis 26 °C) die 10- bis 15-fache Wärmemenge im Vergleich zur sensiblen Wärmekapazität traditioneller Massivbaustoffe (wie Beton oder Vollziegel) gleicher Masse zu speichern.
              </p>
            </div>
          </div>
        )}

        {/* 2. SECTION: LEICHTZUSCHLAEGE */}
        {activeTab === 'leichtzuschlaege' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                <strong>Leichtzuschläge</strong> sind mineralische oder künstliche Gesteinskörnungen mit einer sehr geringen Rohdichte (&lt; 1,0 g/cm³) und hoher Porosität. Sie reduzieren das Eigengewicht strukturierter Betonbauteile und tragen erheblich zur Wärmedämmung bei.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <CircleDashed size={18} /> Arten von Leichtzuschlägen
                </h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><strong>Blähton (Leca):</strong> Gebrannter Spezialton bei ca. 1200 °C. Organische Hilfsstoffe verbrennen, erzeugen Gase und blähen das Korn auf – mit dichter, gesinterter Außenschale.</li>
                  <li><strong>Blähglas:</strong> Aus Recyclingmaterial (Altglas) hergestellt. Das Glasmehl wird mit Treibmitteln gemischt und bei 800 °C bis 900 °C zu feinen Kügelchen gebläht.</li>
                  <li><strong>Naturbims:</strong> Vulkanischer, hochporöser Naturstein (pyroklastisches Glas).</li>
                  <li><strong>Perlit:</strong> Vulkanischer Rohperlitstein mit eingeschlossenem Wasser, der bei Schockhitzung das 15- bis 20-fache seines ursprünglichen Volumens aufbläht.</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Gauge size={18} /> Eigenschaften &amp; Anwendung
                </h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><strong>Konstruktionsleichtbeton (KLB):</strong> Herstellung hochfester Leichtbetone für weitspannende Brücken und Hochhausdecken zur Reduzierung statischer Lasten.</li>
                  <li><strong>Wärmedämmbeton:</strong> Monolithischer Außenwandbeton ohne zusätzliches Wärmedämmverbundsystem (WDVS).</li>
                  <li><strong>Schüttungen:</strong> Als lose Dämm- und Ausgleichsschüttungen unter Schwing- und Trockenestrichen.</li>
                  <li><strong>Sorption:</strong> Die offene oder geschlossene Porenstruktur verlangt Vorsichtsmaßnahmen bei der Betonherstellung (Vornässung der Körnung zur Rissunterdrückung).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. SECTION: AEROGELE */}
        {activeTab === 'aerogele' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                <strong>Aerogele</strong> sind hochporöse Nanostruktur-Festkörper auf Siliziumdioxidbasis (SiO₂), deren Volumen zu bis zu 99,8 % aus feinsten Poren besteht. Sie gelten als die leistungsfähigsten festen Wärmedämmstoffe im Architekturbereich.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Maximize size={18} /> Nanochemische Eigenschaften
                </h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><strong>Wärmeleitfähigkeit:</strong> Extrem niedrig (λ = 0,013 bis 0,018 W/(m·K)), oft besser als stehende Luft.</li>
                  <li><strong>Knudsen-Effekt:</strong> Die Porenradien (&lt; 50 nm) liegen unter der mittleren freien Weglänge von Luftmolekülen, wodurch die Gaswärmeleitung weitgehend unterbunden wird.</li>
                  <li><strong>Brandschutz:</strong> Völlig unbrennbar (Baustoffklasse A1), schmilzt erst oberhalb von 1200 °C.</li>
                  <li><strong>Haptik:</strong> Hydrophobiert verarbeitet, hochgradig diffusionsoffen bei gleichzeitig exzellenter kapillarer Feuchtetrennung.</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Box size={18} /> High-End Anwendungen
                </h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><strong>Aerogel-Kalkputz:</strong> Höchstleistungswärmeschutzputz zur energieeffizienten Sanierung historischer, denkmalgeschützter Mauerwerksfassaden.</li>
                  <li><strong>Bauteilschlitzung:</strong> Einbau in Fensterlaibungen, Rollladenkästen und Wärmebrücken.</li>
                  <li><strong>Kerndämmung:</strong> Als granuliertes Einblasmaterial für zweischaliges Mauerwerk.</li>
                  <li><strong>Baubotanik &amp; Lichtausnutzung:</strong> Transluzente Glassandwiches zur hellen, hochdämmenden Tageslichtbeleuchtung.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 4. SECTION: SELBSTHEILENDER BETON (INNOVATION 1) */}
        {activeTab === 'selfhealing' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                <strong>Selbstheilender Beton (Bio-Beton)</strong> ist eine herausragende technologische Entwicklung zur Erhöhung der Langlebigkeit von Betonbauten. Durch den Einbau von ruhenden Bakteriensporen und Nährstoffen repariert sich der Beton bei Mikrorissbildung unter eindringender Feuchtigkeit völlig autonom selbst.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Leaf className="text-emerald-600" size={18} /> Das biochemische Prinzip
                </h3>
                <p className="text-xs text-text-main/70 leading-relaxed mb-3">
                  Dem Beton werden spezielle, extrem alkalibeständige Bakteriensporen (z. B. <em>Bacillus pseudofirmus</em> oder <em>Sporosarcina pasteurii</em>) zusammen mit einer organischen Calciumquelle (Calciumlactat) zugesetzt.
                </p>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><strong>Auslösung:</strong> Risse brechen die eingekapselten Sporen auf. Eindringendes Wasser und Sauerstoff aktivieren die Bakterien.</li>
                  <li><strong>Biomineralisation:</strong> Die Bakterien verstoffwechseln das Calciumlactat zu Kalkstein (Calciumcarbonat), welcher den Riss verstopft.</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={18} /> Vorteile &amp; Einsatzzweck
                </h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><strong>Rissbreitengrenze:</strong> Funktioniert exzellent für Rissbreitengrenze: Im Labor wurden Risse bis ca. 0,4–0,5 mm Breite geschlossen..</li>
                  <li><strong>Korrosionsschutz:</strong> Verhindert das Eindringen von Chloriden und Sauerstoff zur Bewehrung, stoppt so den Beginn elektrochemischer Korrosion.</li>
                  <li><strong>Untertagebau:</strong> Extrem vorteilhaft für Tunnelbauten, Tiefgaragen, Fundamente und WU-Bauwerke mit aufwendigen Wartungszyklen.</li>
                </ul>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl font-mono text-xs text-emerald-950">
              <span className="font-sans font-bold text-emerald-800 uppercase tracking-wide block mb-1">Stoffwechselgleichung</span>
              {"Ca(C₃H₅O₃)₂ + 6 O₂ → CaCO₃ ↓ + 5 CO₂ + 5 H₂O"}<br />
              {"CO₂ + Ca(OH)₂ (Portlandit/Porenlösung) → CaCO₃ ↓ + H₂O"}
              <span className="font-sans block text-[10px] text-emerald-850 mt-1.5 font-medium font-sans">
                Durch die Fällung des wasserunlöslichen Calciumcarbonats (Kalkstein CaCO₃) dichtet sich das Kapillarrissnetzwerk vollständig und stoffschlüssig ab.
              </span>
            </div>
          </div>
        )}

        {/* 5. SECTION: SMARTE BAUSTOFFE & TiO2 (INNOVATION 2) */}
        {activeTab === 'photokatalyse' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                <strong>Smarte &amp; funktionale Werkstoffe</strong> beschreiben Baustoffsysteme, die aktiv auf Umweltreize reagieren oder physikalische Diagnosedaten liefern. Paradebeispiele sind photokatalytische Beschichtungen zur Luftreinigung und Sensorbauten im Smart Monitoring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Cpu className="text-amber-500" size={18} /> Photokatalyse (Titandioxid TiO₂)
                </h3>
                <p className="text-xs text-text-main/70 leading-relaxed mb-3">
                  Wird die Kristallform <strong>Anatas</strong> des Titandioxids durch solares UV-Licht aktiviert, entsteht ein stark oxidierender Katalysator auf der Fassade.
                </p>
                <ol className="list-decimal list-inside text-xs text-text-main/70 space-y-2">
                  <li><strong>Luftreinigender Effekt:</strong> Schädliche Stickoxide (NOₓ) werden zu flüchtigem, unbedenklichem Nitrat (NO₃⁻) umgewandelt.</li>
                  <li><strong>Superhydrophilie (Self-Cleaning):</strong> Wasser bildet keinen Tropfen, sondern einen dünnen Film, der zersetzten organischen Schmutz unterspült und einfach mit dem nächsten Regen wäscht.</li>
                </ol>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Activity className="text-rose-500" size={18} /> Sensor- &amp; Carbonfaserbeton (Intelligent Concrete)
                </h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><strong>Piezoresistive Effekte:</strong> Durch Beimischung elektrisch leitfähiger Kohlenstofffasern ändert der Beton unter Dehnung oder Rissbildung seinen elektrischen Widerstand.</li>
                  <li><strong>Echtzeit-Diagnose (SHM):</strong> Das Tragwerk überwacht sich selbstständig elektronisch auf Extremereignisse, Dehnungsspitzen oder Ermüdung ohne aufgeklebte Sensoren.</li>
                  <li><strong>Thermobimetalle:</strong> Passive Metallkomponenten an Fassaden, die sich rein temperaturabhängig krümmen und so Lüftungsschlitze steuern.</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide block mb-1">Photokatalytische NO_x Reduzierung</span>
              <p className="text-xs text-amber-950/80 leading-relaxed font-mono">
                {"TiO₂ (Anatas) + hν (UV) → e⁻ + h⁺"}<br />
                {"H₂O + h⁺ → ·OH (Hydroxylradikale)"} <br />
                {"NO + ·OH + O₂⁻ → NO₃⁻ (Nitrat, abwaschbar) + H₂O"}
              </p>
              <span className="block text-[10px] text-amber-850 mt-1.5 font-medium leading-relaxed font-sans">
                Großflächig eingesetzt in Pflastersteinen, Straßenbelägen oder Dachpfannen kann dieses innovative Wirkprinzip die innerstädtische Smog-Belastung nachweisbar mindern.
              </span>
            </div>
          </div>
        )}

        {/* 6. SECTION: VIP & MYZEL (INNOVATION 3) */}
        {activeTab === 'vip' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                <strong>Vakuumisolationspaneele (VIP)</strong> und <strong>biogene Myzel-Baustoffe</strong> stehen an der Spitze hocheffizienter bzw. ressourcen-kreislauffähiger Dämmtechnologien. Sie lösen funktionale Platzprobleme und minimieren den CO₂-Fußabdruck im Baustoffbereich.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Maximize size={18} /> Vakuumisolationspaneele (VIP)
                </h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><strong>Wärmeleitfähigkeit:</strong> Phänomenal niedrig mit Bemessungswerten von λ ≈ 0,007 W/(m·K) (ca. 5-mal besser als Polystyrol EPS).</li>
                  <li><strong>Kernmaterial:</strong> Meist verpresste, mikroporöse Kieselsäure, umhüllt von einer gasdichten Hochbarriere-Verbundfolie, die evakuiert wird.</li>
                  <li><strong>Achtung Verletzlichkeit:</strong> Paneele dürfen auf der Baustelle <strong>niemals</strong> gekürzt, geschnitten oder durchbohrt werden, da das einströmende Gas die Wärmeleitfähigkeit auf ca. 0,020 W/(mK) erhöht, also die Dämmwirkung auf etwa ein Viertel bis ein Drittel reduziert.</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-base mb-2 flex items-center gap-2">
                  <Leaf className="text-emerald-600" size={18} /> Myzel-Baustoffe &amp; Bio-Komposite
                </h3>
                <ul className="list-disc list-inside text-xs text-text-main/70 space-y-2">
                  <li><strong>Konzept:</strong> Verwendung von Pilzmyzel (Fadennetzwerk der Pilze) als natürlicher, organischer Klebstoff.</li>
                  <li><strong>Herstellung:</strong> Myzelfäden wachsen kontrolliert auf landwirtschaftlichen Reststoffen (wie Stroh, Hanfschäben). Zum Abschluss wird das Produkt erhitzt und getrocknet, um das Wachstum dauerhaft zu stoppen.</li>
                  <li><strong>Vorteile:</strong> 100 % kompostierbare, CO₂-negative Dämmplatten mit hervorragenden Schalldämmeffekten und gutem Brandschutz durch natürliche Verkohlung der Myzelhaut.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
      
      <ModuleFooter wikipedia={[
        { title: 'Phasenwechselmaterial', url: 'https://de.wikipedia.org/wiki/Latentw%C3%A4rmespeicher' },
        { title: 'Leichtzuschlag (Beton)', url: 'https://de.wikipedia.org/wiki/Leichtbeton' },
        { title: 'Aerogel', url: 'https://de.wikipedia.org/wiki/Aerogel' },
        { title: 'Selbstheilender Beton' },
        { title: 'Photokatalyse', url: 'https://de.wikipedia.org/wiki/Photokatalyse' },
        { title: 'Vakuumisolationspaneel', url: 'https://de.wikipedia.org/wiki/Vakuumisolationspaneel' }
      ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Schumacher, M. et al.: Innovative Werkstoffe für energieeffizientes Bauen (Detail Verlag)',
          'Jonkers, H. M. (2011): Bacteria-based self-healing concrete. HERON 56 (1/2)'
        ]}
        regelwerke={[
          { title: 'DIBt: Allgemeine bauaufsichtliche Zulassungen (abZ / aBG) für Vakuum-Isolations-Paneele (VIP)', url: 'https://www.dibt.de/' },
          { title: 'DIN EN 13055:2016-11 (Leichte Gesteinskörnungen für Beton, Mörtel und Einpressmörtel)' },
          { title: 'DIN EN 17140:2021-02 (Wärmedämmstoffe für das Bauwesen - Werkmäßig hergestellte Produkte aus Vakuum-Isolations-Paneelen (VIP))' },
          { title: 'RAL-Gütezeichen RAL-GZ 896 (Phasenwechselmaterialien - PCM Quality Association)', url: 'https://www.pcm-ral.de/' }
        ]}
        formeln={[
          {
            formel: "\\lambda_{\\text{VIP}} \\approx 0{,}007 \\text{ W/(m}\\cdot\\text{K)}",
            erklaerung: "Wärmeleitfähigkeit von Vakuumisolationspaneelen im evakuierten Zustand; der Unterdruck unterdrückt die Wärmeleitung des Gases in den Nanoporen des Kieselsäurekerns.",
            quelle: "DIBt-Zulassungsrichtlinien / DIN EN 17140:2021-02"
          }
        ]}
      />
    </div>
  );
}
