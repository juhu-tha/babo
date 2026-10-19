import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Layers, ShieldAlert, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

function MetalThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider">
          Material-Lehrpfad: Metalle im Bauwesen
        </h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5">
          Wechseln Sie nahtlos zwischen den drei Säulen der Baustofflehre (Basis, Anwendung und Alterung):
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('metalle')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span>1. Baustoff-Kennwerte</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Physikalische Eigenschaften, Schmelzpunkt & Legierungen der Metalle.
          </span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_metallisch')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span>2. Mechanik & Praxis</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Plattenrechner, Kontaktkorrosions-Prüfung & Herstellerübersicht (Produkte mit Leistungserklärung und CE-Kennzeichnung nach BauPVO (EU) 2024/3110).
          </span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={() => setActiveTab('metallkorrosion')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span>3. Dauerhaftigkeit</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Galvanische Zellen, Korrosionsarten & Schutz nach DIN EN ISO 12944.
          </span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

const METALS_DATA = [
  {
    name: 'Aluminium',
    symbol: 'Al',
    density: 2700,
    eModul: 70000,
    thermalConductivity: 235,
    meltingPoint: 660,
    corrosionBehavior: 'Bildet an der Luft spontan eine dichte, transparente Oxidschicht (Al₂O₃, 5–20 nm), die im neutralen pH-Bereich (pH 4,5–8,5) passivierend wirkt. Stark gefährdet bei direktem Kontakt mit edleren Metallen (Kupfer, Edelstahl) unter Feuchtigkeit (Bimetallkorrosion) sowie in chloridreicher Meeresluft (Lochfraß). Im stark alkalischen Milieu von frischem Zementmörtel oder Beton (pH > 12,5) löst sich die Oxidschicht stürmisch unter Freisetzung von brennbarem Wasserstoffgas auf.',
    corrosionProtection: 'Künstliche Verstärkung der Oxidschicht durch Eloxieren (Anodisieren, 15–25 µm Schichtdicke) oder hochwertige Pulverbeschichtung. Bei Einbau in feuchtes Mauerwerk oder Kontakt mit edleren Metallen ist zwingend eine elektrische und stoffliche Trennung (EPDM-Dichtscheiben, Isolierhülsen, Folien) vorzusehen.',
    applications: 'Fassadenunterkonstruktionen, Fenster- und Pfosten-Riegel-Profile, Trapezbleche, Leichtbautragwerke (DIN EN 1999)',
    description: 'Leichtmetall mit kubisch-flächenzentriertem (kfz) Kristallgitter und hervorragender Kaltumformbarkeit ohne Tieftemperaturversprödung. Aufgrund des geringen E-Moduls (ca. 1/3 von Baustahl) sind tragende Profile formsteifer zu dimensionieren. Die hohe Wärmeleitung erfordert konsequente thermische Entkopplung an Fassadenkonsolen zur Vermeidung von Wärmebrücken.'
  },
  {
    name: 'Kupfer',
    symbol: 'Cu',
    density: 8960,
    eModul: 130000,
    thermalConductivity: 380,
    meltingPoint: 1085,
    corrosionBehavior: 'Thermodynamisch edles Metall (U₀ = +0,34 V) mit überragender atmosphärischer Witterungsbeständigkeit. Oxidiert zunächst zu dunkelbraunem Kupfer(I)-oxid und bildet über Jahrzehnte die charakteristische samtgrüne, unlösliche Schutzpatina aus basischem Kupfersulfat (Brochantit) und basischem Kupfercarbonat (Malachit). Aufgrund freigesetzter Kupferionen im Niederschlagswasser löst ablaufendes Wasser an nachgeschalteten unedlen Metallen (Zink, verzinkter Stahl, Alu) verheerenden Lochfraß aus (Fließregel!).',
    corrosionProtection: 'Im Freien durch die Eigenschutzpatina wartungsfrei. Zwingend vorgeschrieben ist die Einhaltung der Fließregel: Kupfer niemals oberhalb von Zink oder verzinktem Stahl verbauen. Befestigungen nur mit Kupfer- oder Edelstahlschrauben (A4) ausführen.',
    applications: 'Stehfalzdächer, architektonische Fassadenbekleidungen, Dachentwässerung (Rinnen, Fallrohre), Haustechnik (Trinkwasserleitungen)',
    description: 'Halbedelmetall mit kubisch-flächenzentriertem Gitter, exzellenter plastischer Verformbarkeit auch bei Frost und höchster thermischer Leitfähigkeit. Bildet über Jahre eine schützende, unverwechselbare grüne Patina mit extrem hoher Lebensdauer von über 100 Jahren.'
  },
  {
    name: 'Stahl (Baustahl)',
    symbol: 'Fe + C',
    density: 7850,
    eModul: 210000,
    thermalConductivity: 50,
    meltingPoint: 1530,
    corrosionBehavior: 'Ferritisch-perlitische Grundmatrix mit hoher Korrosionsanfälligkeit in feuchter sauerstoffreicher Atmosphäre. Der entstehende Rost (Eisenoxidhydrat) besitzt das bis zu 6-fache Volumen des Stahls, haftet nicht dicht an und blättert kontinuierlich ab, sodass der tragende Querschnitt ohne Schutzschicht stetig abgetragen wird (ca. 20–100 µm/Jahr je nach Korrosivitätskategorie).',
    corrosionProtection: 'Aktiver kathodischer Opferschutz durch Feuerverzinken (Zinkschicht opfert sich an Fehlstellen). Passive Barrieresysteme durch Mehrschicht-Flüssigbeschichtungen (Zinkstaub-Grundierung, Eisenglimmer-Zwischenschicht, PU-Decklack nach DIN EN ISO 12944). Im Stahlbetonbau: Selbstpassivierung durch die stark alkalische Porenlösung des Zementsteins (pH > 12,5).',
    applications: 'Skelettbauten, Weitspannteile, Industriehallen, Brücken, Fachwerke, Betonstahl (B500) im Massivbau',
    description: 'Raumzentriert-kubische (krz) Eisen-Kohlenstoff-Legierung (C < 0,22 %) mit unübertroffenem Verhältnis aus hoher Festigkeit, Steifigkeit und ausgeprägtem plastischen Fließvermögen. Bildet die statische Grundlage des modernen Ingenieurbaus nach Eurocode 3.'
  },
  {
    name: 'Edelstahl (Nichtrostender Stahl)',
    symbol: 'Fe + Cr + Ni',
    density: 7900,
    eModul: 200000,
    thermalConductivity: 15,
    meltingPoint: 1450,
    corrosionBehavior: 'Durch Legierung mit mindestens 10,5 % Chrom (in der Praxis 17–19 % Cr und 8–12 % Ni) bildet sich bei Sauerstoffkontakt spontan eine nanometerdünne, selbsterneuernde Passivschicht aus Chromoxid (Cr₂O₃). In Gegenwart von Chloriden (Tausalz, Meeresluft, Schwimmbäder) besteht jedoch bei unzureichender Legierungswahl akute Gefahr von mikroskopischem Lochfraß und unter Zugspannung von katastrophaler Spannungsrisskorrosion (SCC).',
    corrosionProtection: 'Genaue Abstimmung der Werkstoffgüte auf die Umgebungsbedingungen: A2 (1.4301, CRC II) für Normalatmosphäre; A2 (1.4301, CRC II) für normale Innen- und Landatmosphäre; A4 (1.4404 mit Molybdän, CRC III) für mäßig chloridbelastete Außenatmosphäre, z. B. küstennah; CRC V (z. B. 1.4529, 1.4565) für Straßentunnel mit Tausalzeintrag und für nicht regelmäßig gereinigte, sicherheitsrelevante Bauteile in Hallenschwimmbädern.; hochlegierte Sonderstähle wie 1.4529 (CRC IV/V) zwingend für Hallenschwimmbäder. Vermeidung von Kontakt mit gewöhnlichem ferritischen Eisenstaub (Fremdrost).',
    applications: 'Fassadenbefestigungen, tragende Unterkonstruktionen, Glasfassadenanker, Geländer, Schwimmbaddächer, Bewehrung in hochbelasteten Bauteilen',
    description: 'Austenitischer Hochleistungsstahl mit dichter kubisch-flächenzentrierter Atompackung. Hohe Zähigkeit ohne Tieftemperaturversprödung, sehr wartungsarm und repräsentativ. Geringe Wärmeleitung (15 W/(m·K)) minimiert Wärmebrücken.'
  },
  {
    name: 'Zink / Titanzink',
    symbol: 'Zn / Zn-Ti',
    density: 7140,
    eModul: 100000,
    thermalConductivity: 110,
    meltingPoint: 420,
    corrosionBehavior: 'Bildet unter atmosphärischer Einwirkung von CO₂ und Feuchte eine dichte, mattgraue Deckschicht aus basischem Zinkcarbonat (2 ZnCO₃ · 3 Zn(OH)₂). Bei stehender Nässe und behinderter Belüftung (z.B. mangelhafte Hinterlüftung an Dachunterseiten) bildet sich stattdessen mehliger, zerstörerischer Weißrost (Zinkhydroxid). Extrem empfindlich gegenüber saurem Regen und herablaufendem kupferhaltigem Wasser.',
    corrosionProtection: 'Zwingend vollflächig hinterlüftete Dach- und Wandkonstruktionen ausführen (Verhinderung von Tauwasserstau an der Blechunterseite). Strukturierte Trennlagen einsetzen. Niemals in Fließrichtung unterhalb von Kupfer anordnen (Fließregel)..',
    applications: 'Dacheindeckungen (Stehfalztechnik), Rinnen, Fallrohre, Gaubenbekleidungen, Feuerverzinkungsschichten für Tragwerksstahl',
    description: 'Im Hochbau vor allem als Titanzink nach DIN EN 988 (Feinzink mit geringen Anteilen Titan und Kupfer zur Begrenzung des Kriechverhaltens) eingesetzt. Sehr gut falzbar, erfordert jedoch aufgrund der hohen Wärmedehnung (22 × 10⁻⁶/K) sorgfältig dimensionierte Schiebehafte.'
  },
  {
    name: 'Blei',
    symbol: 'Pb',
    density: 11340,
    eModul: 16000,
    thermalConductivity: 35,
    meltingPoint: 327,
    corrosionBehavior: 'Exzellente Witterungsbeständigkeit durch dichte, unlösliche Deckschichten aus basischem Bleicarbonat. Korrodiert jedoch rasch bei Einwirkung schwacher flüchtiger organischer Säuren (z.B. Essigsäure- und Gerbsäuredämpfe aus feuchtem Eichenholz) oder stark alkalisch bei direktem Kontakt mit frischem Kalk- und Zementmörtel.',
    corrosionProtection: 'Kein atmosphärischer Anstrich nötig. Direkten Kontakt zu gerbstoffreichem Holz (Eiche, Lärche) oder frischem Zementmörtel durch Bitumentrennlagen oder PE-Folien verhindern. Bei Sanierungen Umwelt- und Arbeitsschutzmaßnahmen (TRGS 505) streng einhalten.',
    applications: 'Passgenaue Verwahrungen und Anschlüsse an Schornsteinen, Kehlen, Wandanschlüssen, Strahlenschutzräume, Schallschutz',
    description: 'Sehr schweres, extrem duktiles Schwermetall (Dichte 11.340 kg/m³). Da seine Rekristallisationstemperatur unter Raumtemperatur liegt, verfestigt es sich nicht beim Kaltverformen und lässt sich händisch an komplexe Ziegeldurchdringungen anpassen. Wird aus Umweltschutzgründen heute oft durch elastomere Bleiersatzbänder substituiert.'
  },
  {
    name: 'Titan',
    symbol: 'Ti',
    density: 4500,
    eModul: 105000,
    thermalConductivity: 22,
    meltingPoint: 1668,
    corrosionBehavior: 'Unter allen Baumetallen die höchste Korrosionsbeständigkeit. Bildet spontan eine chemisch extrem inerte, festhaftende Rutil-Oxidschicht (TiO₂), die das Metall selbst gegen konzentrierte Meersalzlösungen, Industrieabgase und aggressive Säuren vollkommen resistent macht.',
    corrosionProtection: 'Vollkommen wartungsfrei; keinerlei Beschichtungen oder Schutzmaßnahmen erforderlich. Selbst bei mechanischen Kratzern passiviert sich die Stelle im Kontakt mit Luftsauerstoff binnen Millisekunden neu.',
    applications: 'Monumentale Architekturfassaden, extrem beanspruchte Dächer repräsentativer Kulturbauten, korrosionskritische Spezialverankerungen',
    description: 'Leichtes Hochleistungsmetall (hdp) mit hervorragendem Festigkeits-zu-Dichte-Verhältnis und dem geringsten thermischen Längenausdehnungskoeffizienten (α = 8,6 × 10⁻⁶/K) aller Fassadenmetalle. Dies verhindert thermische Wellenbildung und garantiert verzugsfreie Großkassetten über Jahrhunderte.'
  },
  {
    name: 'Wetterfester Baustahl (Cortenstahl)',
    symbol: 'Fe + Cu + Cr',
    density: 7850,
    eModul: 210000,
    thermalConductivity: 48,
    meltingPoint: 1510,
    corrosionBehavior: 'Niedriglegierter Baustahl (S355J2W nach DIN EN 10025-5) mit Zusätzen von Kupfer, Chrom und Nickel. Durch den zyklischen Wechsel von Befeuchtung (Regen) und rascher Abtrocknung bildet sich binnen 1,5 bis 3 Jahren eine außergewöhnlich dichte, fest haftende Sperrschicht (Edelrost-Patina) aus dotiertem α-FeOOH, die den Sauerstoffzutritt blockiert.',
    corrosionProtection: 'Selbstschützend ohne Anstrich – jedoch nur bei freier Bewitterung und vollständigen Trocknungsphasen! In dauerfeuchten Zonen (Erdreich, Spritzwasser mit Tausalz) rostet Cortenstahl wie normaler Baustahl durch und muss mit Schutzanstrichen versehen werden.',
    applications: 'Skulpturale Fassaden, Brückenbauwerke ohne Korrosionsschutzbeschichtung, Landschaftsarchitektur, Lärmschutzwände',
    description: 'Konstruktionsstahl mit warmtoniger, lebendiger Rostoptik und hohem Fließgrenzwert (fy = 355 N/mm²). Spart über die Lebensdauer erhebliche Neubeschichtungskosten ein, erfordert jedoch eine konstruktive Ableitung des ablaufenden Rostwassers während der Patinierungsphase.'
  },
  {
    name: 'Messing (CuZn-Legierung)',
    symbol: 'Cu + Zn',
    density: 8470,
    eModul: 105000,
    thermalConductivity: 120,
    meltingPoint: 900,
    corrosionBehavior: 'Gute allgemeine Witterungsbeständigkeit an normaler Stadt- und Landluft. Gefahr von Entzinkung in chloridreichem Wasser (Herauslösen des Zinks hinterlässt brüchigen Kupferschwamm) sowie von katastrophaler Spannungsrisskorrosion (Saisonrissigkeit) unter Zugspannung in ammoniakalischer Umgebung (Fäulnisgase, Stallluft).',
    corrosionProtection: 'Für korrosionskritische Anwendungen entzinkungsbeständige Sonderlegierungen (DZR-Messing nach DIN EN 12164) verwenden. Vor der Montage spannungsarm glühen, um Eigenspannungen abzubauen.',
    applications: 'Tür- und Fensterbeschläge, Sanitärarmaturen, hochpräzise Fassadenbefestigungen, Innenausbau',
    description: 'Zweiphasiger (α + β)-Kupfer-Zink-Mischkristall mit hervorragender Zerspanbarkeit, hoher Härte und edler goldener Optik. Widerstandsfähig gegen mechanischen Verschleiß.'
  },
  {
    name: 'Gusseisen mit Kugelgraphit (Sphäroguss)',
    symbol: 'Fe + C + Si (GJS)',
    density: 7200,
    eModul: 170000,
    thermalConductivity: 36,
    meltingPoint: 1180,
    corrosionBehavior: 'Deutlich beständiger gegen atmosphärische und bodenmechanische Korrosion als unlegierter Stahl. Bildet im Erdreich eine stabile, festhaftende Oxidhaut. Graphitkugeln wirken als Barrieren gegen das Fortschreiten mikroskopischer Risse.',
    corrosionProtection: 'Für Tiefbauanwendungen werkseitig mit Zinküberzügen und Epoxidharz- bzw. Polyurethanbeschichtungen nach DIN EN 545 geschützt. Schachtabdeckungen erhalten bituminöse Tauchlackierungen.',
    applications: 'Schachtabdeckungen und Entwässerungsrinnen (DIN EN 124, Klassen D400 bis F900), Druckrohre für Trink- und Abwasser, Brückenlager, historische Rekonstruktion tragender Stützen',
    description: 'Gusswerkstoff, bei dem freier Kohlenstoff durch Magnesiumbehandlung in kugelförmiger Graphitgestalt (Nodules) erstarrt. Weist im Gegensatz zum spröden Lamellengrauguss hohe Duktilität (Bruchdehnung bis 18 %) und Weist im Gegensatz zum spröden Lamellengrauguss hohe Duktilität (Bruchdehnung bis 18 %) auf; die Schwingungsdämpfung ist geringer als bei Lamellengrauguss, aber höher als bei Stahl. auf.'
  }
];

export default function Metalle() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'kennwerte'>('steckbrief');
  const [selectedMetal, setSelectedMetal] = useState(METALS_DATA[0].name);
  const [selectedSteckbriefMetal, setSelectedSteckbriefMetal] = useState<string>('aluminium');

  const activeMetal = METALS_DATA.find(m => m.name === selectedMetal) || METALS_DATA[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Layers size={24} />
          </div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            Metalle im Bauwesen
          </h2>
        </div>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Metalle (insb. Baustahl, Edelstahl, Aluminium) zeichnen sich durch hohe Tragfähigkeit und Duktilität aus. In diesem Modul werden Festigkeiten, Spannungs-Dehnungs-Linien und Legierungskennwerte behandelt.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            onClick={() => setActiveTab('steckbrief')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief'
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <BookOpen size={16} />
            Baustoff-Steckbrief
          </button>
          <button
            onClick={() => setActiveTab('kennwerte')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'kennwerte'
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Sparkles size={16} />
            Metalle &amp; Kennwerte
          </button>
        </div>

        {activeTab === 'steckbrief' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-3 flex flex-col gap-2">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-2">Material auswählen</h3>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'aluminium', name: 'Aluminium', symbol: 'Al' },
                  { key: 'kupfer', name: 'Kupfer', symbol: 'Cu' },
                  { key: 'baustahl', name: 'Baustahl', symbol: 'Fe+C' },
                  { key: 'edelstahl', name: 'Edelstahl', symbol: 'Fe+Cr' },
                  { key: 'zink', name: 'Zink / Titanzink', symbol: 'Zn' },
                  { key: 'blei', name: 'Blei', symbol: 'Pb' },
                  { key: 'titan', name: 'Titan', symbol: 'Ti' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedSteckbriefMetal(item.key)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      selectedSteckbriefMetal === item.key 
                        ? 'bg-shiraz/10 border-shiraz text-shiraz font-bold' 
                        : 'bg-off-white border-home-grau/30 text-text-main hover:border-shiraz/50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span>{item.name}</span>
                      <span className="text-xs opacity-70 font-mono">{item.symbol}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-9">
              <BaustoffProfil materialKey={selectedSteckbriefMetal} />
            </div>
          </div>
        )}

        {activeTab === 'kennwerte' && (
          <>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Neben Baustahl werden im Bauwesen zahlreiche weitere Metalle eingesetzt, insbesondere für die Gebäudehülle (Fassaden, Dächer), die Haustechnik und für spezielle architektonische Anforderungen. Die Wahl des Metalls hängt von Anforderungen an Festigkeit, Gewicht, Korrosionsbeständigkeit und Optik ab.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-2">Metall auswählen</h3>
                <div className="flex flex-col gap-2">
                  {METALS_DATA.map((metal) => (
                    <button
                      key={metal.name}
                      onClick={() => setSelectedMetal(metal.name)}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        selectedMetal === metal.name 
                          ? 'bg-shiraz/10 border-shiraz text-shiraz font-bold' 
                          : 'bg-off-white border-home-grau/30 text-text-main hover:border-shiraz/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{metal.name}</span>
                        <span className="text-xs opacity-70 font-mono">{metal.symbol}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-off-white p-6 rounded-xl border border-home-grau/30">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-text-main">{activeMetal.name}</h3>
                    <div className="px-3 py-1 bg-white border border-home-grau/30 rounded-lg font-mono text-shiraz font-bold">
                      {activeMetal.symbol}
                    </div>
                  </div>
                  
                  <p className="text-text-main/80 mb-6 leading-relaxed">
                    {activeMetal.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-home-grau/30">
                      <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Dichte</div>
                      <div className="text-lg font-bold text-text-main">{formatDeWert(activeMetal.density)} <span className="text-sm font-normal">kg/m³</span></div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-home-grau/30">
                      <div className="text-xs text-home-grau uppercase tracking-wider mb-1">E-Modul</div>
                      <div className="text-lg font-bold text-text-main">{formatDeZahl((activeMetal.eModul / 1000), 0)} <span className="text-sm font-normal">GPa</span></div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-home-grau/30">
                      <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Wärmeleitfähigkeit</div>
                      <div className="text-lg font-bold text-text-main">{formatDeWert(activeMetal.thermalConductivity)} <span className="text-sm font-normal">W/(m·K)</span></div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-home-grau/30">
                      <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Schmelzpunkt</div>
                      <div className="text-lg font-bold text-text-main">{formatDeWert(activeMetal.meltingPoint)} <span className="text-sm font-normal">°C</span></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-bold text-text-main mb-1">Korrosionsverhalten & Widerstand</div>
                      <div className="text-sm text-text-main/80 bg-white p-3 rounded-lg border border-home-grau/30 leading-relaxed">
                        {activeMetal.corrosionBehavior}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-main mb-1">Korrosionsschutz & Verhaltensmaßnahmen</div>
                      <div className="text-sm text-text-main/80 bg-shiraz/5 p-3 rounded-lg border border-shiraz/20 leading-relaxed">
                        {activeMetal.corrosionProtection}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-main mb-1">Typische Einsatzbereiche</div>
                      <div className="text-sm text-text-main/80 bg-white p-3 rounded-lg border border-home-grau/30 leading-relaxed">
                        {activeMetal.applications}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vergleichstabelle */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm overflow-x-auto">
                  <h3 className="text-sm font-bold text-text-main mb-4">Vergleich der physikalischen Eigenschaften</h3>
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-home-grau uppercase bg-off-white border-b border-home-grau/30">
                      <tr>
                        <th className="px-4 py-3">Metall</th>
                        <th className="px-4 py-3">Dichte [kg/m³]</th>
                        <th className="px-4 py-3">E-Modul [GPa]</th>
                        <th className="px-4 py-3">Wärmeleitf. [W/(mK)]</th>
                      </tr>
                    </thead>
                    <tbody>
                      {METALS_DATA.map((metal) => (
                        <tr key={metal.name} className={`border-b border-home-grau/10 ${selectedMetal === metal.name ? 'bg-shiraz/5' : ''}`}>
                          <td className="px-4 py-3 font-bold">{metal.name}</td>
                          <td className="px-4 py-3">{formatDeWert(metal.density)}</td>
                          <td className="px-4 py-3">{formatDeZahl((metal.eModul / 1000), 0)}</td>
                          <td className="px-4 py-3">{formatDeWert(metal.thermalConductivity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <MetalThematicLinks current="baustoff" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Metall', url: 'https://de.wikipedia.org/wiki/Metall' },
          { title: 'Korrosion', url: 'https://de.wikipedia.org/wiki/Korrosion' },
          { title: 'Passivierung', url: 'https://de.wikipedia.org/wiki/Passivierung' },
          { title: 'Bimetallkorrosion', url: 'https://de.wikipedia.org/wiki/Bimetallkorrosion' }
        ]}
        literatur={[
          'Bargel, H.-J.; Schulze, G. (2018): Werkstoffkunde (12. Auflage, Springer Vieweg)',
          'Roos, E.; Maile, K. (2017): Werkstoffkunde für Ingenieure (Springer Vieweg)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 8044:2020-08 (Korrosion von Metallen und Legierungen - Grundbegriffe)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+8044' },
          { title: 'DIN EN 1993-1-4:2021-02 (Eurocode 3: Bemessung und Konstruktion von Stahlbauten - Teil 1-4: Nichtrostende Stähle)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1993-1-4' },
          { title: 'DIN EN 1999-1-1:2023-11 (Eurocode 9: Bemessung und Konstruktion von Aluminiumtragwerken - Allgemeine Bemessungsregeln)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1999-1-1' },
          { title: 'DIN EN ISO 12944-1..9:2018-06 (Beschichtungsstoffe - Korrosionsschutz von Stahlbauten durch Beschichtungssysteme)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+12944-1..9' },
          { title: 'DIN EN 10025-5:2019-10 (Warmgewalzte Erzeugnisse aus wetterfesten Baustählen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+10025-5' },
          { title: 'DIN EN 988:1996-08 (Zink und Zinklegierungen - Festlegungen für gewalzte Flacherzeugnisse für das Bauwesen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+988' }
        ]}
        formeln={[
          {
            formel: '\\Delta l = l_0 \\cdot \\alpha_T \\cdot \\Delta T',
            erklaerung: 'Thermische Längendehnung: l0 = Ausgangslänge, alpha_T = Längenausdehnungskoeffizient (z.B. Stahl: 12·10⁻⁶ 1/K, Aluminium: 24·10⁻⁶ 1/K, Zink (rein): ca. 30·10⁻⁶ 1/K, Titanzink (DIN EN 988, in Walzrichtung): ca. 22·10⁻⁶ 1/K), Delta T = Temperaturdifferenz.',
            quelle: 'DIN EN 1993-1-1 / Physik'
          },
          {
            formel: 'U_0 = E_{\\text{Kathode}} - E_{\\text{Anode}} > 0',
            erklaerung: 'Elektrochemische Potentialdifferenz bei Kontaktkorrosion (galvanisches Element) zweier unterschiedlicher Metalle im wässrigen Elektrolyten.',
            quelle: 'DIN EN ISO 8044'
          }
        ]}
      />
    </div>
  );
} 