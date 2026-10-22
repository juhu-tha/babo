import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { 
  Layers, 
  Flame, 
  Calculator, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Check, 
  RefreshCw, 
  Star, 
  Scale, 
  Info as FactIcon, 
  ArrowRight, 
  BookOpen, 
  ShieldAlert,
  Sparkles,
  Award,
  CheckCircle2
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { InnovationPraxisSection } from '@/src/components/ui/InnovationPraxisSection';

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
            Physikalische Eigenschaften, Schmelzpunkt &amp; Legierungen der Metalle.
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
            <span>2. Mechanik &amp; Praxis</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Plattenrechner, Kontaktkorrosions-Prüfung &amp; Lieferantenlisten der BauPVO.
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
            Galvanische Zellen, Korrosionsarten &amp; Schutz nach DIN EN ISO 12944.
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

export interface MetalMaterial {
  id: string;
  name: string;
  density: number; // kg/m³
  potential: number; // Volt vs Standard Hydrogen Electrode
  lambda: number; // W/(m·K)
  alpha: number; // 10^-6 / K
  description: string;
  crystalStructure?: string;
  eModul?: number; // N/mm²
  yieldStrength?: string;
  standards?: string;
  corrosionCategory?: string;
  practicalAdvice?: string;
  poissonRatio?: number;
  elongationAtBreak?: string;
  recyclingRate?: string;
}

export const metalsDb: MetalMaterial[] = [
  {
    id: 'zinc',
    name: 'Verzinkter Stahl (Zinküberzug)',
    density: 7140,
    potential: -0.76,
    lambda: 110,
    alpha: 22,
    crystalStructure: 'Hexagonal dichteste Kugelpackung (hdp)',
    eModul: 210000, // Grundstahl 210 GPa, Zinkschicht ca. 100 GPa
    yieldStrength: 'fy = 220 – 350 N/mm² (DX51D / S250GD)',
    standards: 'DIN EN ISO 1461, DIN EN 10346, DIN EN 988',
    corrosionCategory: 'C1 bis C4 (Abtragsrate Zink: 0,2–2 µm/Jahr)',
    poissonRatio: 0.25,
    elongationAtBreak: 'A80 ≥ 22 % (Tiefziehgüte)',
    recyclingRate: '> 95 % im Elektrostahlwerk',
    description: `Stahl geschützt durch einen metallischen Zinküberzug (Stückverzinkung im Tauchbad bei ca. 450 °C mit diffusionsbedingter Eisen-Zink-Phasenbildung Γ-, δ- und ζ-Phase oder kontinuierliche Bandverzinkung mit Zink-Aluminium-Magnesium-Überzügen ZM). Zink bildet auf der Oberfläche durch Reaktion mit Sauerstoff, Feuchte und Kohlendioxid eine dichte, festhaftende Schutzschicht aus basischem Zinkcarbonat (2 ZnCO₃ · 3 Zn(OH)₂).

Herausragende werkstoffliche Eigenschaft ist der aktive kathodische Opferschutz: Da Zink mit U₀ = -0,76 V deutlich unedler ist als Eisen (-0,44 V), opfert es sich an Schnittkanten, Bohrungen und Kratzern bis zu einer Breite von 1,5 mm als galvanische Anode auf, sodass der Grundstahl vollkommen rostfrei bleibt.

Bei behinderter Belüftung oder feuchter Lagerung kann sich poröser, voluminöser Weißrost (Zinkhydroxid Zn(OH)₂) bilden, der die Schutzschicht zersetzt. Zinkbleche (Titanzink nach DIN EN 988 mit 0,08–0,2 % Titan und Kupfer zur Kriechhemmung) besitzen hervorragende Falzeigenschaften, bedürfen jedoch wegen der hohen Wärmedehnung ausreichender Schiebehafte.`,
    practicalAdvice: 'Titanzinkdächer und verzinkte Fassadenelemente müssen an der Unterseite zwingend hinterlüftet werden (Tauwasser-Abtrocknung), um zerstörerische Weißrostbildung zu unterbinden. Niemals unterhalb von Kupfer einbauen (Fließregel!).'
  },
  {
    id: 'aluminum',
    name: 'Aluminium & -Legierungen',
    density: 2700,
    potential: -0.50, // Passivpotential in Außenluft
    lambda: 220,
    alpha: 23,
    crystalStructure: 'Kubisch flächenzentriert (kfz)',
    eModul: 70000,
    yieldStrength: 'Rp0,2 = 120 – 240 N/mm² (EN AW-6060 T6)',
    standards: 'DIN EN 1999 (EC 9), DIN EN 573, DIN 17611 (Eloxal)',
    corrosionCategory: 'C1 bis C4 (Eloxiert / Pulverbeschichtet)',
    poissonRatio: 0.33,
    elongationAtBreak: 'A50 ≥ 8 – 12 % (aushärtbare Knetlegierung)',
    recyclingRate: '> 95 % (Sekundäraluminium spart 95 % Schmelzenergie)',
    description: `Leichtmetall mit kubisch-flächenzentriertem Gitter, exzellenter Kaltumformbarkeit und hoher Zähigkeit ohne Tieftemperaturversprödung. Bei Luftkontakt bildet Aluminium binnen Millisekunden eine porenfreie, transparente Passivschicht aus Aluminiumoxid (Al₂O₃, ca. 5–20 nm dünn), die das Metall im neutralen pH-Bereich (pH 4,5–8,5) vor atmosphärischem Abtrag schützt.

Aggressive Zersetzungsmechanismen: Im stark alkalischen Milieu (z.B. flüssiger Zementleim, frischer Beton oder Mauermörtel mit pH 12,5–13,5) löst sich die amphipathische Passivschicht unter heftiger Wasserstoffgasbildung stürmisch auf (2 Al + 2 OH⁻ + 6 H₂O → 2 [Al(OH)₄]⁻ + 3 H₂↑). Aluminium darf daher niemals ungeschützt in Mörtel oder Beton eingebettet werden.

In der Baupraxis wird Aluminium überwiegend eloxiert (anodische Oxidation, Schichtdicke 15–25 µm nach DIN 17611) oder einbrennpulverbeschichtet. Aufgrund des niedrigen E-Moduls (ca. 1/3 des Stahls) sind Profile mit größeren Trägheitsmomenten Iy auszuführen. Die Wärmedehnung ist mit 23 × 10⁻⁶/K fast doppelt so hoch wie bei Baustahl.`,
    practicalAdvice: 'Aluminium-Fassadenunterkonstruktionen stellen erhebliche Wärmebrücken dar (hohe Wärmeleitfähigkeit λ = 220 W/(m·K)) und müssen zwingend mit thermischen Trennelementen (Thermostopps) an der Massivwand verankert werden.'
  },
  {
    id: 'steel',
    name: 'Baustahl (unlegiert S235 / S355)',
    density: 7850,
    potential: -0.44,
    lambda: 50,
    alpha: 12,
    crystalStructure: 'Raumzentriert kubisch (krz, Ferrit + Perlit)',
    eModul: 210000,
    yieldStrength: 'fy = 235 N/mm² (S235) bzw. 355 N/mm² (S355)',
    standards: 'DIN EN 1993 (EC 3), DIN EN 10025-2, DIN EN ISO 12944',
    corrosionCategory: 'Erfordert Schutzsysteme nach ISO 12944 (C1–CX)',
    poissonRatio: 0.30,
    elongationAtBreak: 'A ≥ 20 – 26 % (ausgeprägtes Fließplateau)',
    recyclingRate: '> 98 % (im Stahlkreislauf beliebig oft ohne Downcycling)',
    description: `Ferritisch-perlitischer Konstruktionswerkstoff und das universelle Rückgrat des modernen Hoch-, Hallen- und Brückenbaus. Zeichnet sich durch ein ausgeprägtes Fließplateau, exzellente Schweißbarkeit und hohe Bruchdehnungen (A ≥ 20 %) aus, was die Ausbildung stabiler Fließgelenke und plastischer Schnittgrößenumlagerungen nach Eurocode 3 ermöglicht.

Korrosionsverhalten: Baustahl ist an feuchter Atmosphäre thermodynamisch unedel und bildet porösen Rost (FeO(OH) und Fe₂O₃ · n H₂O). Da das Rostvolumen bis zum 6-fachen des Ausgangsstahls anwächst, haftet der Rost nicht dicht an, sondern blättert kontinuierlich ab, sodass der Querschnitt ohne Schutzschicht linear abgetragen wird.

Schutzsysteme: Baustahl erfordert im Außenbereich zwingend hochwertige Mehrschicht-Flüssigbeschichtungen (Zinkstaub-Grundierung, Eisenglimmer-Zwischenschicht, PU-Decklack nach DIN EN ISO 12944) oder Stückfeuerverzinkung. In Betonbauteilen bewirkt die alkalische Porenlösung des Zements (pH > 12,5) eine selbsttätige Passivierung (dünner γ-Fe₂O₃-Film).`,
    practicalAdvice: 'Konstruktiven Korrosionsschutz beachten: Schmutz- und Wassersäcke (z.B. nach oben offene U-Profile) vermeiden, kontinuierliche Schweißnähte statt Heftschweißung wählen und scharfe Profilkanten vor der Beschichtung abrunden.'
  },
  {
    id: 'stainless',
    name: 'Edelstahl rostfrei (A2 / A4, 1.4301 / 1.4404)',
    density: 7900,
    potential: +0.15, // Passivzustand in belüfteter Atmosphäre
    lambda: 15,
    alpha: 16,
    crystalStructure: 'Kubisch flächenzentriert (kfz, Austenit)',
    eModul: 200000,
    yieldStrength: 'Rp0,2 = 200 – 240 N/mm² (Rm = 500 – 700 N/mm²)',
    standards: 'DIN EN 10088, DIN EN 1993-1-4 (EC 3 Edelstahl), Z-30.3-6',
    corrosionCategory: 'CRC II (A2) bis CRC III / IV (A4 / Sonderedelstähle)',
    poissonRatio: 0.30,
    elongationAtBreak: 'A ≥ 40 – 45 % (hohe Kaltverfestigung)',
    recyclingRate: '100 % (wichtiger Träger von Legierungselementen Cr, Ni, Mo)',
    description: `Austenitischer Chrom-Nickel- bzw. Chrom-Nickel-Molybdän-Stahl mit dichtester kubisch-flächenzentrierter Atompackung. Durch mindestens 10,5 % Chrom bildet sich an sauerstoffhaltiger Luft spontan eine nanometerdünne, extrem dichte und unsichtbare Passivschicht aus Chrom(III)-oxid (Cr₂O₃), die sich bei mechanischer Beschädigung selbstständig regeneriert.

Legierungsunterschiede:
• A2 (Werkstoff 1.4301 / X5CrNi18-10): Standard für normale Außenluft, Fassadenunterkonstruktionen und Geländer (Korrosionswiderstandsklasse CRC II).
• A4 (Werkstoff 1.4404 / X2CrNiMo17-12-2): Durch 2–2,5 % Molybdänzusatz stark erhöhter Lochfraßwiderstand (PREN ≥ 23); vorgeschrieben in meeresnahen Gebieten (C4/C5), Industrieatmosphäre und im Spritzwasserbereich von Tausalzen.

Besondere Gefahren: In chloridhaltigen Hallenschwimmbad-Atmosphären neigen Standard-Austeniten unter mechanischer Zugspannung zu katastrophaler, unsichtbarer Spannungsrisskorrosion (SCC). Tragende Deckenabhänger erfordern dort zwingend hochlegierte Sonderstähle der Korrosionswiderstandsklasse CRC IV / V (z.B. 1.4529).`,
    practicalAdvice: 'In Hallenbädern, Straßentunneln und Küstenklima niemals einfachen A2-Edelstahl für tragende Befestigungen einsetzen! Edelstahlwerkzeuge für die Montage verwenden, um Fremdrost-Kontaminationen (Kontakt mit Eisenabrieb) zu verhindern.'
  },
  {
    id: 'lead',
    name: 'Blei (Bauwalzblei DIN EN 12588)',
    density: 11340,
    potential: -0.13,
    lambda: 35,
    alpha: 29,
    crystalStructure: 'Kubisch flächenzentriert (kfz, Mohshärte 1,5)',
    eModul: 16000,
    yieldStrength: 'Rp0,2 ≈ 10 – 15 N/mm² (viskoses Kriechverhalten)',
    standards: 'DIN EN 12588, DIN EN 1991, ZVDH-Fachregeln',
    corrosionCategory: 'Sehr witterungsbeständig durch basische Bleicarbonatpatina',
    poissonRatio: 0.44,
    elongationAtBreak: 'A > 50 % (keine Kaltverfestigung)',
    recyclingRate: '> 95 % geschlossene Kreisläufe',
    description: `Extrem dichtes, weiches und leicht verformbares Schwermetall (Dichte 11.340 kg/m³). Da die Rekristallisationstemperatur von reinem Blei unterhalb der Raumtemperatur liegt, verfestigt sich Blei beim Kaltumformen nicht, sondern lässt sich mühelos von Hand an dreidimensionale Dachdetails, Kamineinfassungen und Ziegelanschlüsse anformen.

Deckschichten & Beständigkeit: An der Atmosphäre reagiert Blei mit Kohlendioxid und Feuchte zu einer unlöslichen, dichten Schutzschicht aus basischem Bleicarbonat (2 PbCO₃ · Pb(OH)₂), die über Jahrzehnte hinweg wetterfest bleibt.

Toxikologie & Korrosionsrisiken: Blei ist anfällig für Angriffe durch organische Säuren (z.B. Essigsäuredämpfe aus feuchtem Eichenholz) sowie durch stark alkalische Medien (frischer Zementmörtel). Wegen der Schwermetalltoxizität (REACH) wird Bauwalzblei heute zunehmend durch bitumenbasierte oder polymere Verbund-Bleiersatzbänder mit Aluminiumstreckgitter-Einlage substituiert.`,
    practicalAdvice: 'Beim Einbau von Walzblech an Dachanschlüssen direkten Kontakt zu frischem Mörtel und gerbstoffreicher Eiche durch Bitumentrennlagen verhindern. Schutzkleidung tragen und Staubentwicklung meiden.'
  },
  {
    id: 'titanium',
    name: 'Titan (Reintitan Grad 1 / Grad 2)',
    density: 4500,
    potential: +0.20,
    lambda: 22,
    alpha: 8.6,
    crystalStructure: 'Hexagonal dichteste Kugelpackung (hdp, α-Titan)',
    eModul: 105000,
    yieldStrength: 'Rp0,2 = 275 – 345 N/mm² (Grad 2 nach ASTM B265)',
    standards: 'DIN EN ISO 28438, ASTM B265, DIN 17850',
    corrosionCategory: 'Höchste Korrosionsbeständigkeit (Meerwasser, CX, chloridresistent)',
    poissonRatio: 0.34,
    elongationAtBreak: 'A ≥ 20 %',
    recyclingRate: '> 90 % als Titanschrott & Ferro-Titan',
    description: `Hochleistungs-Leichtmetall mit herausragendem Festigkeits-zu-Dichte-Verhältnis und dem geringsten thermischen Längenausdehnungskoeffizienten (α = 8,6 × 10⁻⁶/K) aller Fassadenmetalle. Dies verhindert thermisch bedingte Wellenbildung bei großflächigen Kassetten und ermöglicht verzugsfreie Fassadenkonstruktionen.

Überragende Passivierung: Titan bildet unter allen atmosphärischen Bedingungen spontan eine chemisch extrem inerte, festhaftende Rutil-Oxidschicht (TiO₂). Es widersteht selbst kochenden Chloridlösungen, aggressivem Meerwasser, saurem Regen und industriellen Schwefeldioxid-Gasen ohne jeden Oberflächenabtrag.

Einsatzbereiche: Aufgrund der anspruchsvollen Gewinnung (Kroll-Verfahren) und Schmelzführung ist Titan kostspielig und wird vorrangig bei ikonischen Monumentalbauten (z.B. Guggenheim-Museum Bilbao) eingesetzt. Es behält über Jahrhunderte seine silbergraue, samtmatte Optik ohne jeglichen Wartungsaufwand.`,
    practicalAdvice: 'Fügen von Titanelementen auf der Baustelle nur durch mechanische Falzungen oder Nieten. Schweißarbeiten müssen unter 100 % hochreinem Schutzgas (Argon 5.0) erfolgen, da Titan ab ca. 300 °C Sauerstoff und Stickstoff aus der Luft löst und versprödet.'
  },
  {
    id: 'copper',
    name: 'Kupfer (Bau-Kupfer Cu-DHP)',
    density: 8960,
    potential: +0.34,
    lambda: 380,
    alpha: 17,
    crystalStructure: 'Kubisch flächenzentriert (kfz)',
    eModul: 130000,
    yieldStrength: 'Rp0,2 = 140 – 250 N/mm² (R220 weich / R240 halbhart)',
    standards: 'DIN EN 1172 (Kupfer für das Bauwesen), DIN EN 1993',
    corrosionCategory: 'Äußerst beständig, bildet schützende Patina',
    poissonRatio: 0.34,
    elongationAtBreak: 'A50 ≥ 33 % (R220 weich)',
    recyclingRate: '> 95 % ohne Qualitätsverlust recyclierbar',
    description: `Halbedelmetall mit kubisch-flächenzentriertem Gitter, überragender thermischer Leitfähigkeit (λ = 380 W/(m·K)) und exzellenter Falzbarkeit selbst bei Minusgraden. Seit Jahrhunderten der bevorzugte Werkstoff für repräsentative Dacheindeckungen, Stehfalzfassaden und Dachentwässerungen.

Patinabildung im Lebenszyklus:
Frisch gewalztes Kupfer glänzt lachsrot, oxidiert rasch zu dunkelbraunem Kupfer(I)-oxid (Cu₂O) und wandelt sich an der Atmosphäre über Jahre unter Einwirkung von CO₂, SO₂ und Feuchtigkeit in die samtartige grüne Patina aus basischem Kupfersulfat (Brochantit) und basischem Kupfercarbonat (Malachit) um. Diese Schicht ist wasserunlöslich und schützt das Metall für Jahrhunderte.

Die baurechtlich verbindliche "Fließregel": Da Kupfer im sauren Niederschlag geringe Mengen Kupferionen (Cu²⁺) freisetzt, darf ablaufendes Wasser niemals auf tieferliegende, unedlere Metalle (verzinkter Stahl, Zink, Aluminium) geleitet werden. Die Kupferionen zementieren sich dort ab und zerstören das unedle Metall in Rekordzeit durch Lochfraß.`,
    practicalAdvice: 'Fließregel zwingend einhalten: Kupferrinnen niemals über verzinkte Fallrohre entwässern! Kupferbefestigungen nur mit Edelstahlschrauben (A4) oder Kupfernägeln ausführen.'
  },
  {
    id: 'corten',
    name: 'Wetterfester Baustahl (Cortenstahl S355J2W)',
    density: 7850,
    potential: -0.40,
    lambda: 48,
    alpha: 12,
    crystalStructure: 'Raumzentriert kubisch (krz)',
    eModul: 210000,
    yieldStrength: 'fy = 355 N/mm² (Zugfestigkeit Rm = 470 – 630 N/mm²)',
    standards: 'DIN EN 10025-5, DASt-Richtlinie 007, DIN EN 1993',
    corrosionCategory: 'Selbstschützend unter zyklischer Feuchte-Trocken-Einwirkung',
    poissonRatio: 0.30,
    elongationAtBreak: 'A ≥ 22 %',
    recyclingRate: '> 98 % voll recyclierbar im Schrottkreislauf',
    description: `Niedriglegierter Konstruktionsstahl mit Beimengungen von Kupfer (0,25–0,55 %), Chrom, Nickel und Phosphor. Unter freier Bewitterung bildet Cortenstahl durch den kontinuierlichen Wechsel von Befeuchtung (Regen) und vollständiger Austrocknung (Sonne/Wind) binnen 1,5 bis 3 Jahren eine außergewöhnlich dichte, fest haftende Sperrschicht (Edelrost-Patina) aus amorphem Eisenoxihydroxid und dotiertem α-FeOOH.

Schutzmechanismus: Die Sperrschicht verlangsamt die Sauerstoffdiffusion an den Grundstahl drastisch. Der jährliche Materialabtrag sinkt nach Ausbildung der Patina auf unter 2–5 µm/Jahr ab, sodass auf Lackierungen oder Verzinkungen vollständig verzichtet werden kann.

Kritische Einsatzgrenzen: Cortenstahl benötigt zwingend vollständige Trocknungszyklen. Im Erdreich, im permanenten Spritzwasserbereich mit Tausalzkontakt oder in unbelüfteten Hohlräumen versagt der Passivierungsmechanismus und das Material rostet wie unlegierter Stahl kontinuierlich durch.`,
    practicalAdvice: 'Bei Fassadenkonstruktionen das Abwaschen von braunem Rostwasser während der 2- bis 3-jährigen Patinierungsphase baulich einplanen: Vorstehende Bauteile, helle Natursteine oder Sichtbetonflächen müssen vor abtropfendem Rostwasser durch Tropfkanten und Rinnen geschützt werden.'
  },
  {
    id: 'brass',
    name: 'Messing (CuZn-Legierung CuZn39Pb3 / CW614N)',
    density: 8470,
    potential: -0.10,
    lambda: 120,
    alpha: 19,
    crystalStructure: 'Mischkristall aus kfz (α-Phase) und krz (β-Phase)',
    eModul: 105000,
    yieldStrength: 'Rp0,2 = 250 – 350 N/mm² (Rm = 450 – 550 N/mm²)',
    standards: 'DIN EN 12164, DIN EN 12165, DIN EN 12449',
    corrosionCategory: 'Gute Witterungsbeständigkeit an normaler Atmosphäre',
    poissonRatio: 0.35,
    elongationAtBreak: 'A ≥ 12 – 18 %',
    recyclingRate: '> 95 % als Späne & Gussrücklauf',
    description: `Kupfer-Zink-Knetlegierung mit ca. 58 % Kupfer, 39 % Zink und geringem Bleianteil zur Spanbrechung. Unverzichtbar für hochwertige Architektur- und Türbeschläge, Fassadenverankerungen, Sanitärinstallationen und hochpräzise mechanische Befestigungsmittel.

Gefüge & Festigkeit: Das zweiphasige (α + β)-Gefüge vereint gute Festigkeit mit hoher Härte und ausgezeichneter Warmumformbarkeit beim Strangpressen. An trockener Luft bildet sich eine schützende Zinkoxid-Kupferoxid-Deckschicht.

Besondere Korrosionsrisiken: Bei gleichzeitiger Einwirkung von Zugspannungen und ammoniakhaltiger Umgebung (z.B. Stallungen, Fäulnisgase, feuchtes Holz mit Amin-Ausgasungen) neigt unentspanntes Messing zu interkristalliner Spannungsrisskorrosion (sog. Saisonrissigkeit). In stark chloridhaltigem Wasser kann es zudem zur "Entzinkung" kommen, bei der das Zink selektiv herausgelöst wird und ein poröses, mechanisch instabiles Kupferschwämmchen zurückbleibt.`,
    practicalAdvice: 'In landwirtschaftlichen Bauten und Schwimmbädern keine einfachen Standard-Messingdübel oder -Schrauben unter Zuglast einsetzen. Hierfür entzinkungsbeständiges Messing (DZR) oder Edelstahl A4 wählen.'
  },
  {
    id: 'cast_iron',
    name: 'Gusseisen mit Kugelgraphit (Sphäroguss EN-GJS)',
    density: 7200,
    potential: -0.42,
    lambda: 36,
    alpha: 11.5,
    crystalStructure: 'Ferritisch-perlitische Matrix mit kugelförmigem Graphit',
    eModul: 170000,
    yieldStrength: 'Rp0,2 = 250 – 400 N/mm² (EN-GJS-400 bis EN-GJS-600)',
    standards: 'DIN EN 1563 (Sphäroguss), DIN EN 124 (Schachtabdeckungen)',
    corrosionCategory: 'Hohe Beständigkeit gegen Erdreich- und Abwasserkorrosion',
    poissonRatio: 0.28,
    elongationAtBreak: 'A ≥ 12 – 18 % (EN-GJS-400-18)',
    recyclingRate: '> 95 % in Gießereien',
    description: `Eisen-Kohlenstoff-Gusswerkstoff mit 3,2 bis 3,8 % Kohlenstoff. Durch eine gezielte Schmelzenbehandlung mit Magnesium erstarrt der freie Kohlenstoff nicht in scharfkantigen Lamellen (wie beim spröden Grauguss EN-GJL), sondern in Form feinverteilter mikroskopischer Graphitkugeln (Nodules).

Mechanische Überlegenheit: Die Kugelform verhindert Spannungsspitzen an den Graphiträndern. Dadurch erreicht Sphäroguss stahlähnliche Festigkeiten bei hervorragender plastischer Dehnbarkeit (Bruchdehnung A bis 18 %) und hoher Kerbschlagzähigkeit. Zudem besitzt er erstklassige Schwingungsdämpfungseigenschaften.

Bauanwendungen: Der Standardwerkstoff für hochbelastete Kanalisationsguss-Erzeugnisse nach DIN EN 124 (Schachtabdeckungen Klassen D400 bis F900 im Straßen- und Flughafenbau), Druckrohrleitungen für Trinkwasser und Abwasser sowie historisierende Stützen und Brückenauflager. Er ist wesentlich korrosionsbeständiger gegenüber Erdreich und Grundwasser als unlegierter Walzstahl.`,
    practicalAdvice: 'Gusseiserne Bauteile sind für Schweißverbindungen auf der Baustelle ungeeignet (Gefahr von Aufhärtung und Rissbildung). Verbindungen müssen formschlüssig oder über Flansche und Schrauben ausgeführt werden.'
  }
];

export default function BpMetallisch() {
  const [selectedMetal, setSelectedMetal] = useState<MetalMaterial>(metalsDb[0]);

  // Galvanic (Contact) Corrosion Selector States
  const [metalAnode, setMetalAnode] = useState<string>('zinc'); // Fastener (small)
  const [metalCathode, setMetalCathode] = useState<string>('copper'); // Main Sheet (large)

  // Sheet metal weight calculator states
  const [sheetThick, setSheetThick] = useState<number>(2.0); // mm
  const [sheetWidth, setSheetWidth] = useState<number>(1.25); // m
  const [sheetLength, setSheetLength] = useState<number>(3.0); // m
  const [calcMetalId, setCalcMetalId] = useState<string>('steel');

  // Load calculator chosen metal
  const calcMetal = metalsDb.find(m => m.id === calcMetalId) || metalsDb[2];

  // Calculations weight: W = length * width * (thick / 1000) * density (kg)
  const volM3 = sheetLength * sheetWidth * (sheetThick / 1000);
  const totalWeightKg = volM3 * calcMetal.density;

  // Bimetallic / Galvanic evaluation
  const anodeObj = metalsDb.find(m => m.id === metalAnode) || metalsDb[0];
  const cathodeObj = metalsDb.find(m => m.id === metalCathode) || metalsDb[4];

  // Potential difference deltaE
  const deltaE = Math.abs(cathodeObj.potential - anodeObj.potential);

  const getCorrosionRating = (val: number, an: string, cat: string) => {
    if (an === cat) {
      return { rating: 'Keine (Gleiche Metalle)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: 'check', desc: 'Identisches Material. Es tritt kein elektrochemischer Stromfluss auf.' };
    }
    // Copper is extremely noble, aluminium or zinc next to it is disastrous
    if ((an === 'zinc' || an === 'aluminum' || an === 'steel' || an === 'corten') && cat === 'copper') {
      return { rating: 'Katastrophal (Akute Zerstörungsgefahr!)', color: 'bg-red-150 text-red-900 border-red-300', icon: 'danger', desc: 'Schnittstellen-Katastrophe! Das edle Kupfer entzieht dem unedlen Metall sofort Elektronen. In feuchter Außenluft zersetzen sich Schrauben, Nieten oder Clips in Rekordzeit (Flächenregel beachten!).' };
    }
    if (val <= 0.15) {
      return { rating: 'Sicher (Geringes Risiko)', color: 'bg-emerald-150 text-emerald-800 border-emerald-300', icon: 'check', desc: 'Geringes Potentialgefälle (ΔU ≤ 150 mV). Bei normalen Witterungsbedingungen im Außenbereich unbedenklich.' };
    }
    if (val <= 0.35) {
      return { rating: 'Bedenklich (Nutzung einschränken)', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: 'warning', desc: 'Mäßiges Potentialgefälle. Für trockene Innenräume sicher; im Außenbereich ist eine elektrische Trennung (Polyamid- oder EPDM-Dichtscheiben) zwingend erforderlich.' };
    }
    return { rating: 'Hohes Korrosionsrisiko', color: 'bg-red-100 text-red-800 border-red-200', icon: 'danger', desc: 'Starkes Potentialgefälle. Das unedlere Metall opfert sich rasch auf. Direkten mechanischen Kontakt unbedingt verhindern!' };
  };

  const corrosionResult = getCorrosionRating(deltaE, metalAnode, metalCathode);

  return (
    <div id="bp-metallisch-module" className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Overview Block */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              Metallische Bauprodukte: Tragwerk, Hülle &amp; Verbindungstechnik
            </h2>
            <p className="text-xs text-text-main/70 mt-0.5">
              Werkstoffliche Charakteristiken, physikalische Kennwerte, CE-Leistungsprofile &amp; Bimetallkorrosion
            </p>
          </div>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed font-normal">
          Metalle zeichnen sich durch enorme Zug- und Fließfestigkeiten, exzellente Duktilität und erstklassige Verformungsreserven aus. Aufgrund ihrer thermischen Leitfähigkeit und dem inhärenten Bestreben nach Oxidation müssen sie jedoch detailliert auf thermomechanischen Verzug und vor allem auf elektrochemische Kontaktkorrosion hin berechnet werden.
        </p>
      </div>

      {/* Main Material Database Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left hand selection list */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-text-main/50 uppercase tracking-wider block">Verfügbare Konstruktionsmetalle:</span>
          
          <div className="flex flex-col gap-2 max-h-[580px] overflow-y-auto pr-1">
            {metalsDb.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMetal(m)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                  selectedMetal.id === m.id
                    ? 'bg-shiraz text-white border-shiraz shadow-md scale-[1.01]'
                    : 'bg-white text-text-main hover:bg-slate-50 border-home-grau/30 shadow-xs'
                }`}
              >
                <div>
                  <span className={`text-[9px] uppercase font-mono font-bold tracking-wider block ${selectedMetal.id === m.id ? 'text-white/70' : 'text-text-main/40'}`}>
                    Potential: {(m.potential > 0 ? '+' : '') + formatDeZahl(m.potential, 2) + ' V'}
                  </span>
                  <span className="font-extrabold text-sm">{m.name}</span>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                  selectedMetal.id === m.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {m.id.toUpperCase()}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-amber-50/80 p-4 border border-amber-250 rounded-xl space-y-2 text-xs text-amber-900 mt-2">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="text-amber-800" size={14} />
              <span>Die Anoden/Kathoden "Flächenregel"</span>
            </div>
            <p className="font-normal text-[11px] text-amber-950/80 leading-relaxed">
              Katastrophal wirkt sich Kontaktkorrosion immer dann aus, wenn ein <strong>kleines unedleres Metall (z. B. feuerverzinkte Schraube)</strong> in Verbindung steht mit einem <strong>großen edleren Metall (z. B. Edelstahlblech oder Kupferbahn)</strong>. Hier bündelt sich der Stromfluss auf kleinstem Raum und zerstört das Verbindungsmittel oft binnen weniger Monate komplett!
            </p>
          </div>
        </div>

        {/* Right hand Technical details block */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-home-grau/15 pb-4 flex justify-between items-start flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">LEISTUNGSWERTE NACH BAUPVO / DIN EN</span>
                <h3 className="text-xl font-extrabold text-text-main mt-0.5">{selectedMetal.name}</h3>
              </div>
              <div className="bg-slate-50 border border-home-grau/15 px-3 py-1.5 rounded-lg text-right">
                <span className="text-[10px] text-text-main/50 block leading-tight font-medium">Grenz-Potential (U₀)</span>
                <span className="text-sm font-extrabold text-slate-800 font-mono">{(selectedMetal.potential > 0 ? '+' : '') + formatDeZahl(selectedMetal.potential, 2)} V</span>
              </div>
            </div>

            {/* Quick specifications grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5">Dichte (Rohdichte)</span>
                <span className="text-sm font-extrabold font-mono text-slate-800">{selectedMetal.density.toLocaleString('de-DE')} kg/m³</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5">Wärmeleitfähigkeit λ</span>
                <span className="text-sm font-extrabold font-mono text-slate-800">{formatDeWert(selectedMetal.lambda)} W/(m·K)</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-home-grau/30">
                <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-0.5">Wärmedehnung α</span>
                <span className="text-sm font-extrabold font-mono text-slate-800">{formatDeWert(selectedMetal.alpha)} × 10⁻⁶/K</span>
              </div>
            </div>

            {/* General Description text block with expanded Werkstoffliche Charakteristik */}
            <div className="p-5 bg-slate-50/90 rounded-xl border border-home-grau/25 space-y-3.5 leading-relaxed font-sans">
              <div className="flex items-center justify-between border-b border-home-grau/15 pb-2.5 flex-wrap gap-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={15} /> Werkstoffliche Charakteristik:
                </span>
                {selectedMetal.standards && (
                  <span className="text-[10px] font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded border border-home-grau/25 shadow-2xs">
                    Normung: {selectedMetal.standards}
                  </span>
                )}
              </div>

              <div className="text-xs text-text-main/85 font-normal leading-relaxed whitespace-pre-line space-y-2">
                {selectedMetal.description}
              </div>

              {/* Structured Engineering Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-3 border-t border-home-grau/15">
                {selectedMetal.crystalStructure && (
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-2xs">
                    <span className="text-[10px] text-text-main/50 block font-bold uppercase">Kristallgitter / Gefüge</span>
                    <span className="text-xs font-bold text-slate-800">{selectedMetal.crystalStructure}</span>
                  </div>
                )}
                {selectedMetal.eModul && (
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-2xs">
                    <span className="text-[10px] text-text-main/50 block font-bold uppercase">E-Modul (Steifigkeit)</span>
                    <span className="text-xs font-bold font-mono text-slate-800">{selectedMetal.eModul.toLocaleString('de-DE')} N/mm²</span>
                  </div>
                )}
                {selectedMetal.yieldStrength && (
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-2xs">
                    <span className="text-[10px] text-text-main/50 block font-bold uppercase">Streckgrenze (fy / Rp0,2)</span>
                    <span className="text-xs font-bold font-mono text-slate-800">{selectedMetal.yieldStrength}</span>
                  </div>
                )}
                {selectedMetal.poissonRatio && (
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-2xs">
                    <span className="text-[10px] text-text-main/50 block font-bold uppercase">Querdehnzahl ν (Poisson)</span>
                    <span className="text-xs font-bold font-mono text-slate-800">{formatDeZahl(selectedMetal.poissonRatio, 2)} [-]</span>
                  </div>
                )}
                {selectedMetal.elongationAtBreak && (
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-2xs">
                    <span className="text-[10px] text-text-main/50 block font-bold uppercase">Bruchdehnung (Duktilität)</span>
                    <span className="text-xs font-bold font-mono text-slate-800">{selectedMetal.elongationAtBreak}</span>
                  </div>
                )}
                {selectedMetal.recyclingRate && (
                  <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-2xs">
                    <span className="text-[10px] text-text-main/50 block font-bold uppercase">Recycling &amp; Zirkularität</span>
                    <span className="text-xs font-bold text-emerald-700">{selectedMetal.recyclingRate}</span>
                  </div>
                )}
              </div>

              {selectedMetal.practicalAdvice && (
                <div className="bg-amber-50/90 border border-amber-200/80 p-3 rounded-lg text-[11px] text-amber-950 flex items-start gap-2 mt-2">
                  <Info size={14} className="text-amber-800 mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-bold text-amber-900">Praxis- &amp; Ausführungshinweis: </strong>
                    <span>{selectedMetal.practicalAdvice}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-3 border border-home-grau/10 rounded-xl text-xs flex gap-2 items-center text-text-main/70 mt-4 font-normal">
            <Info size={14} className="text-shiraz shrink-0" />
            <span>Aluminium weist eine um ein Vielfaches höhere Wärmeleitung (220 W/(m·K)) auf als Edelstahl (15 W/(m·K)). Wärmebrücken an Fassadenkonsolen müssen daher thermisch entkoppelt werden!</span>
          </div>
        </div>
      </div>

      {/* Bimetallic contact corrosion compatibility checker */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
        <div className="border-b border-home-grau/15 pb-4">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" /> Opferanoden &amp; Kontaktkorrosions-Prüfung
          </h3>
          <p className="text-xs text-text-main/70 mt-1">
            Interaktive Verbindungsmittel-Kompatibilitätsprüfung nach der galvanischen Spannungsreihe (DIN EN ISO 8044 / VDI 3822)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Controls Column (col span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-text-main/60 uppercase block tracking-wider">Verbindungspaar auswählen</span>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-main text-shiraz">1. Metall (Meist das Verbindungsmittel/Schraube/Clip - Anode):</label>
              <select
                value={metalAnode}
                onChange={(e) => setMetalAnode(e.target.value)}
                className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
              >
                {metalsDb.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name} (U_anode = {x.potential > 0 ? '+' : ''}{formatDeZahl(x.potential, 2)} V)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-main text-slate-700">2. Metall (Profilblech, Abdeckung oder Schiene - Kathode):</label>
              <select
                value={metalCathode}
                onChange={(e) => setMetalCathode(e.target.value)}
                className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
              >
                {metalsDb.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name} (U_kathode = {x.potential > 0 ? '+' : ''}{formatDeZahl(x.potential, 2)} V)
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-[11px] text-text-main/70 space-y-1">
              <div className="flex justify-between font-mono">
                <span>Spannungsdifferenz ΔU₀:</span>
                <strong className="text-slate-800">{formatDeZahl(deltaE, 2)} V ({formatDeZahl((deltaE * 1000), 0)} mV)</strong>
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span>Grenzschwelle DIN 8044:</span>
                <span className="text-slate-500">≤ 150 mV empfohlen</span>
              </div>
            </div>
          </div>

          {/* Result Column (col span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/60 p-5 rounded-xl border border-home-grau/25">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">Elektrochemische Risikobewertung:</span>
              <div className={`p-4 rounded-xl border ${corrosionResult.color} space-y-2`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    {corrosionResult.rating}
                  </h4>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/70">
                    ΔU = {formatDeZahl((deltaE * 1000), 0)} mV
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-normal">
                  {corrosionResult.desc}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-home-grau/20 text-[11px] text-slate-600 space-y-1">
              <p><strong>Praxis-Regel:</strong> Im Freien müssen ungleiche Metalle durch isolierende Zwischenlagen (z.B. EPDM-Unterlegscheiben, Polyamid-Hülsen, Bitumenanstriche) elektrisch voneinander getrennt werden.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sheet metal weight calculator */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6">
        <div className="border-b border-home-grau/15 pb-4">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Calculator className="text-shiraz" /> Blech- &amp; Profil-Gewichtsrechner
          </h3>
          <p className="text-xs text-text-main/70 mt-1">
            Ermittlung von Eigenlasten gk [kN/m²] und Gesamtmasse für Kranlogistik, Transport und statische Bemessung
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-text-main block mb-1">Werkstoff:</label>
            <select
              value={calcMetalId}
              onChange={(e) => setCalcMetalId(e.target.value)}
              className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
            >
              {metalsDb.map((x) => (
                <option key={x.id} value={x.id}>{x.name} ({formatDeWert(x.density)} kg/m³)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-text-main block mb-1">Blechdicke (mm):</label>
            <input
              type="number"
              step="0.1"
              min="0.4"
              max="50"
              value={sheetThick}
              onChange={(e) => setSheetThick(parseFloat(e.target.value) || 0)}
              className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-text-main block mb-1">Blechbreite (m):</label>
            <input
              type="number"
              step="0.05"
              min="0.1"
              max="10"
              value={sheetWidth}
              onChange={(e) => setSheetWidth(parseFloat(e.target.value) || 0)}
              className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-text-main block mb-1">Blechlänge (m):</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="50"
              value={sheetLength}
              onChange={(e) => setSheetLength(parseFloat(e.target.value) || 0)}
              className="w-full text-xs p-2.5 border border-home-grau/30 rounded-lg bg-white font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Calculator Output */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 text-center">
            <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">Flächenbezogene Masse</span>
            <span className="text-lg font-extrabold font-mono text-slate-800">
              {formatDeZahl(((sheetThick / 1000) * calcMetal.density), 2)} kg/m²
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 text-center">
            <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">Charakteristisches Eigengewicht (gk)</span>
            <span className="text-lg font-extrabold font-mono text-shiraz">
              {formatDeZahl((((sheetThick / 1000) * calcMetal.density * 9.81) / 1000), 3)} kN/m²
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/20 text-center">
            <span className="text-[10px] text-text-main/50 block font-bold uppercase mb-1">Tafel-Gesamtgewicht</span>
            <span className="text-lg font-extrabold font-mono text-slate-800">
              {formatDeZahl(totalWeightKg, 2)} kg
            </span>
          </div>
        </div>
      </div>

      {/* Normative Bauprodukte Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ShieldCheck className="text-shiraz" /> Bauprodukt-Gruppen &amp; Nachweissysteme (EN 1090)
        </h3>
        <p className="text-xs text-text-main/70 mb-4 font-normal">
          Metallische Bauprodukte weisen durchgehend gesetzliche Pflichtnachweissysteme der EN 1090-Serie auf (Ausführung von Tragwerken aus Stahl und Aluminium) und werden nach standardisierten Güten und Fertigungstoleranzen spezifiziert:
        </p>
        <div className="overflow-x-auto rounded-xl border border-home-grau/15 bg-white">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-home-grau/15 text-text-main/80 font-bold">
                <th className="p-3">Produktgruppe / System</th>
                <th className="p-3">Typische Erzeugnisse &amp; Spezifikationen</th>
                <th className="p-3">Güteklassen / Zertifikate</th>
                <th className="p-3">Bedeutung im modernen Tragwerks- &amp; Leichtbau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-text-main/80">
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800">Dach- und Fassadenprofile (Feinbleche)</td>
                <td className="p-3">Trapezbleche, Wellprofile, Sandwichelemente, korrosionsschützende Schmelztauchveredelungen.</td>
                <td className="p-3 font-mono">DIN EN 10346 (S220GD - S550GD), EN 10169 (Organische Bandbeschichtungen)</td>
                <td className="p-3">Weit verbreitet im großflächigen Industrie- und Hallenleichtbau im Wand- und Dachbereich.</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800">Form- und Profilstähle (Profilwalzerzeugnisse)</td>
                <td className="p-3">Warmgewalzte Träger (HEB, IPE, HEA), U-Profile, Hohlprofile für Schweißkonstruktionen.</td>
                <td className="p-3 font-mono">DIN EN 10025 (S235JR bis S460QL), EN 1090-2 (EXC1-EXC4)</td>
                <td className="p-3">Rückgrat des klassischen Skelett-, Hochhaus- und Brückenbaus sowie für Rahmenkonstruktionen.</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800">Bewehrungsstähle (Betonstähle)</td>
                <td className="p-3">Gerippter Betonstahl in Stäben, standardisierte Betonstahlmatten (Q- und R-Matten), Bewehrungskörbe.</td>
                <td className="p-3 font-mono">DIN 488 (B500A, B500B), Gütezeichen Betonstahl</td>
                <td className="p-3">Unverzichtbarer Verbundwerkstoffpartner des Massiv- und Stahlbetonbaus zur Aufnahme von Zugspannungen.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <InnovationPraxisSection moduleKey="bp_metallisch" />

      <MetalThematicLinks current="bauprodukt" />

      <ModuleFooter 
        wikipedia={[
          { title: "Baustahl", url: "https://de.wikipedia.org/wiki/Baustahl" },
          { title: "Bimetallkorrosion", url: "https://de.wikipedia.org/wiki/Bimetallkorrosion" },
          { title: "Nichteisenmetall", url: "https://de.wikipedia.org/wiki/Nichteisenmetall" },
          { title: "Verzinken", url: "https://de.wikipedia.org/wiki/Verzinken" }
        ]} 
        literatur={[ 
          'Wagenknecht, G.: Stahlbau-Praxis nach Eurocode 3 (Bauwerk Verlag)', 
          'Rubin, H.: Baustatik und Stahlbau (Springer Vieweg)',
          'Bargel, H.-J.; Schulze, G.: Werkstoffkunde (Springer Vieweg)',
          'Deutsches Kupferinstitut: Kupfer im Hochbau - Planung und Ausführung'
        ]} 
        regelwerke={[ 
          { title: 'DIN EN 10025 (Warmgewalzte Erzeugnisse aus Baustählen)' }, 
          { title: 'DIN EN 1090 (Ausführung von Stahltragwerken und Aluminiumtragwerken)' }, 
          { title: 'DIN EN ISO 1461 (Durch Feuerverzinken auf Stahl aufgebrachte Zinküberzüge)' },
          { title: 'DIN EN 1993-1-1 / NA (Eurocode 3: Bemessung und Konstruktion von Stahlbauten)' },
          { title: 'DIN EN 1999-1-1 (Eurocode 9: Bemessung und Konstruktion von Aluminiumtragwerken)' }
        ]} 
        weblinks={[
          { title: 'bauforumstahl e.V. – Bemessungshilfen & Nachhaltigkeitsdaten', url: 'https://www.bauforumstahl.de/' },
          { title: 'Gütegemeinschaft Verzinken e.V. – Korrosionsschutz durch Feuerverzinken', url: 'https://www.feuerverzinken.com/' },
          { title: 'Informationsplattform Nichtrostender Stahl (ISER)', url: 'https://www.edelstahl-rostfrei.de/' }
        ]}
        formeln={[
          { 
            formel: 'G_k = L \\cdot W \\cdot \\frac{t}{1000} \\cdot \\rho_{\\text{metal}} \\cdot 9{,}81 \\cdot 10^{-3} \\quad [\\text{kN}]', 
            erklaerung: 'Charakteristische Eigengewichtslast Gk flächiger Bleche: L = Länge [m], W = Breite [m], t = Blechdicke [mm], rho = Dichte [kg/m³].',
            quelle: 'DIN EN 1991-1-1'
          },
          { 
            formel: '\\Delta U_0 = |U_{\\text{Kathode}} - U_{\\text{Anode}}| \\ge 150\\,\\text{mV}', 
            erklaerung: 'Elektrochemische Potentialdifferenz-Grenzschwelle nach DIN EN ISO 8044 / VDI 3822: Bei Werten über 150-200 mV steigt die Gefahr beschleunigter galvanischer Bimetallkorrosion der unedleren Phase drastisch.',
            quelle: 'DIN EN ISO 8044'
          },
          {
            formel: '\\Delta L = L_0 \\cdot \\alpha_T \\cdot \\Delta T \\quad [\\text{mm}]',
            erklaerung: 'Thermische Längenänderung von Metallbauteilen: L0 = Ausgangslänge [m], alpha_T = thermischer Längenausdehnungskoeffizient [1/K], delta_T = Temperaturdifferenz [K].',
            quelle: 'DIN EN 1991-1-5'
          }
        ]} 
      />
    </div>
  );
}
