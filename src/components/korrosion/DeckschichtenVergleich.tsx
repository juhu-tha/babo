import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Scale, 
  Sparkles, 
  Info,
  Clock
} from 'lucide-react';
import { formatDeZahl } from '@/src/utils/numberFormat';

export interface MetalCorrosionProfile {
  id: string;
  name: string;
  symbol: string;
  standard: string;
  schichtTyp: 'undurchlaessig' | 'durchlaessig' | 'bedingt';
  schichtName: string;
  formel: string;
  pbr: number;
  pbrLabel: string;
  dicke: string;
  abtragsrate: string;
  farbe: string;
  mechanismus: string;
  diffusionssperre: string;
  baupraxis: string;
  warnung?: string;
  voraussetzungen?: string;
}

export const METAL_PROFILES: MetalCorrosionProfile[] = [
  {
    id: 'corten',
    name: 'Wetterfester Baustahl (Corten-Stahl)',
    symbol: 'S355J2W / WTSt 37-3',
    standard: 'DIN EN 10025-5',
    schichtTyp: 'bedingt',
    schichtName: 'Nanokristalline Goethit-Sperrschicht (Patina)',
    formel: '\\alpha\\text{-FeOOH} \\; (\\text{mit } \\text{Cu, Cr, Ni, P})',
    pbr: 1.85,
    pbrLabel: 'ca. 1,7–1,9 (innere Sperrschicht)',
    dicke: 'ca. 20–100 µm',
    abtragsrate: 'ca. 0,004–0,008 mm/Jahr (ab Jahr 3)',
    farbe: 'border-amber-700 bg-amber-50 text-amber-900',
    mechanismus: 'Während unlegierter Stahl linear weich rostet, bilden die Legierungszusätze (ca. 0,25–0,55 % Cu, 0,4–1,2 % Cr, 0,1–0,65 % Ni und P) unter der porösen Außenkruste eine amorphe, extrem dichte innere Schutzschicht aus nanokristallinem α-FeOOH (Goethit).',
    diffusionssperre: 'Hochwirksam. Die dichte innere Schicht hemmt den Durchtritt von Fe²⁺-Ionen und Sauerstoff um mehr als das Zehnfache gegenüber Normalstahl.',
    baupraxis: 'Fassadenplatten, Brückentragwerke und Landmarken ohne Korrosionsschutzbeschichtung.',
    warnung: 'GEFAHR VON DURCHROSTUNG: Corten benötigt zwingend zyklische Nass-Trocken-Wechsel! Bei permanenter Feuchte (Erdkontakt, stehendes Wasser in Profilen, Dauerschatten, Meeresluft mit Chloriden) kann sich keine dichte Sperrschicht bilden. Der Stahl rostet dann ungebremst wie unlegierter Baustahl durch!',
    voraussetzungen: 'Ausreichende Belüftung, rückstandsfreie Entwässerung, Verzicht auf stehende Wassertaschen.'
  },
  {
    id: 'kupfer',
    name: 'Kupfer (Reinkupfer & Baulegierungen)',
    symbol: 'Cu-DHP (CW024A)',
    standard: 'DIN EN 1172 / DIN EN 1982',
    schichtTyp: 'undurchlaessig',
    schichtName: 'Edle Kupferpatina (basische Salze)',
    formel: '\\text{Cu}_2[(\\text{OH})_2|\\text{CO}_3] \\; (\\text{Malachit}) \\;/\\; \\text{Cu}_4[(\\text{OH})_6|\\text{SO}_4]',
    pbr: 1.68,
    pbrLabel: '1,68 (Cu₂O) bis 1,78 (CuO)',
    dicke: 'ca. 10–50 µm',
    abtragsrate: '< 0,001 mm/Jahr (< 1 µm/Jahr)',
    farbe: 'border-teal-600 bg-teal-50 text-teal-900',
    mechanismus: 'Zunächst oxidiert Kupfer an Luft zu rotem Cu₂O und braunem CuO. Im Laufe von 5 bis 15 Jahren bildet sich unter Einwirkung von atmosphärischem CO₂ und SO₂ die charakteristische blaugrüne Patina aus basischem Kupfercarbonat (Malachit) und basischem Kupfersulfat (Brochantit).',
    diffusionssperre: 'Perfekt gas- und feuchtigkeitsdicht. Nach Ausbildung der Patina kommt der Korrosionsstrom praktisch zum Erliegen (asymptotischer Verlauf).',
    baupraxis: 'Bedachungen, Turmhelme, Dachrinnen und historische Kuppeln mit Nutzungsdauern von 150 bis über 300 Jahren ohne jeden Anstrich.',
    voraussetzungen: 'Atmosphärischer Freibewitterungszutritt. Kontakt mit sauren Bitumenschindeln oder stark ammoniakhaltiger Stallluft vermeiden.'
  },
  {
    id: 'alu',
    name: 'Aluminium & Al-Knetlegierungen',
    symbol: 'Al 99,5 / EN AW-6060',
    standard: 'DIN EN 485 / DIN EN 573',
    schichtTyp: 'undurchlaessig',
    schichtName: 'Selbstheilende Aluminiumoxid-Haut',
    formel: '\\text{Al}_2\\text{O}_3 \\; (\\text{amorphe Passivschicht})',
    pbr: 1.28,
    pbrLabel: '1,28 (ideales Druckverhältnis)',
    dicke: '2–10 nm (natürlich) / 10–25 µm (eloxiert)',
    abtragsrate: '< 0,001 mm/Jahr (im pH-Bereich 4,5–8,5)',
    farbe: 'border-sky-600 bg-sky-50 text-sky-900',
    mechanismus: 'Obwohl Aluminium mit E⁰ = -1,66 V thermodynamisch unedel ist, reagiert es an sauerstoffhaltiger Luft binnen Millisekunden zu einer atomar dichten amorphen Al₂O₃-Gitterstruktur, die sich bei mechanischen Mikrorissen spontan regeneriert.',
    diffusionssperre: 'Hervorragend isolierende Ionen- und Elektronenbarriere. Eloxieren (anodische Oxidation) verstärkt die Schutzschicht technisch um das 1000-Fache.',
    baupraxis: 'Fensterprofile, Pfosten-Riegel-Fassaden, Verbundbleche und Dacheindeckungen.',
    warnung: 'ALKALISCHER BETONANGRIFF: Aluminium ist amphoteres Metall. In frischem Zementmörtel oder Beton (pH ≈ 12,5–13,5) wird die Oxidhaut sofort zerstört. Es kommt zu heftiger Korrosion unter Bildung von Aluminaten und Wasserstoffgas (H₂-Entwicklung, Porenbildung, Querschnittsverlust)!',
    voraussetzungen: 'Schutzanstriche oder Trennlagen beim Einbetonieren; Chloride vermeiden.'
  },
  {
    id: 'stahl',
    name: 'Unlegierter Baustahl / Eisen',
    symbol: 'S235JR / S355J2',
    standard: 'DIN EN 10025-2',
    schichtTyp: 'durchlaessig',
    schichtName: 'Poröser, schuppiger Rost (keine Passivierung)',
    formel: '\\text{Fe}_2\\text{O}_3 \\cdot \\text{H}_2\\text{O} \\; / \\; \\text{FeO(OH)}',
    pbr: 2.15,
    pbrLabel: '2,1 bis 3,3 (starke Überdehnung)',
    dicke: 'Wächst unbegrenzt (Krusten)',
    abtragsrate: 'ca. 0,05–0,20 mm/Jahr (Kategorie C3/C4)',
    farbe: 'border-red-600 bg-red-50 text-red-900',
    mechanismus: 'Eisen bildet lose, voluminöse Eisen(II/III)-oxidhydrate. Wegen der 4- bis 6-fachen Volumendehnung (PBR > 2) reißt die Schicht ständig auf, blättert schuppig ab und bietet keinerlei Barriere.',
    diffusionssperre: 'KEINE SPERRWIRKUNG: Poröses Kapillarsystem saugt Elektrolytwasser und Sauerstoff regelrecht an die noch unkorrodierte Metalloberfläche. Der Abtrag verläuft linear fort bis zur Zerstörung.',
    baupraxis: 'Konstruktionsstahl erfordert ausnahmslos aktiven oder passiven Korrosionsschutz (Feuerverzinkung, Beschichtungssysteme nach DIN EN ISO 12944).',
    warnung: 'BAUTEILSPRENGUNG: Im Betonbau erzeugt das expansive Rostvolumen Radialdrücke von weit über 100 MPa, was die Betonzugfestigkeit (2–4 MPa) sprengt und zu Abplatzungen führt.'
  },
  {
    id: 'zink',
    name: 'Zink / Titanzink & Verzinkungen',
    symbol: 'Zn 99,995 % / Titanzink',
    standard: 'DIN EN 988 / DIN EN ISO 1461',
    schichtTyp: 'bedingt',
    schichtName: 'Zinkcarbonat-Patina vs. Weißrost',
    formel: '\\text{ZnCO}_3 \\cdot x\\,\\text{Zn(OH)}_2 \\; \\longleftrightarrow \\; \\text{Zn(OH)}_2',
    pbr: 1.58,
    pbrLabel: '1,58 (ZnO) / ca. 1,65 (Carbonat)',
    dicke: 'ca. 2–10 µm',
    abtragsrate: '0,001–0,004 mm/Jahr (normal) / massiv bei Weißrost',
    farbe: 'border-slate-600 bg-slate-50 text-slate-900',
    mechanismus: 'Bei Freibewitterung bildet Zink mit Luftsauerstoff und CO₂ eine dichte, mattgraue Patina aus basischem Zinkcarbonat. Unter sauerstoffarmem, feuchtem Kondensat (z. B. feucht gestapelte Bleche) entsteht hingegen poröses, voluminöses Zinkhydroxid (Weißrost).',
    diffusionssperre: 'Mit CO₂: Ausgezeichnete Schutzwirkung. Bei Weißrost: Vollkommen durchlässig und materialzerstörend.',
    baupraxis: 'Feuerverzinkter Stahl (kathodischer Schutz mit Fernwirkung), Rinnen und Stehfalzdächer aus Titanzink.',
    warnung: 'WEISSROST-SCHADEN: Auf feuchten Baustellenlagerungen (z. B. im Regenschauer gestapelte Trapezbleche ohne Luftzirkulation) frisst Weißrost die gesamte Zinkschicht innerhalb weniger Tage bis Wochen ab!',
    voraussetzungen: 'Ungehinderte Belüftung zur Zufuhr von CO₂ für die Patinabildung.'
  },
  {
    id: 'edelstahl',
    name: 'Nichtrostender Edelstahl (Cr-Ni-Stähle)',
    symbol: '1.4301 (V2A) / 1.4404 (V4A)',
    standard: 'DIN EN 10088 / DIN EN 1993-1-4',
    schichtTyp: 'undurchlaessig',
    schichtName: 'Porenfreie Chromoxid-Passivschicht',
    formel: '\\text{Cr}_2\\text{O}_3 \\; (\\text{mind. 10{,}5 \\% Cr})',
    pbr: 2.07,
    pbrLabel: 'ca. 2,07 (an der Grenze, atomar dünn)',
    dicke: '1–3 nm (extrem dünn, unsichtbar)',
    abtragsrate: '< 0,0005 mm/Jahr (im Passivzustand)',
    farbe: 'border-indigo-600 bg-indigo-50 text-indigo-900',
    mechanismus: 'Ab einem Chromgehalt von mindestens 10,5–12 % bildet sich an der Stahloberfläche spontan eine atomar dünne Chromoxidschicht (Cr₂O₃). Bei Sauerstoffzutritt regeneriert sich diese Barriere sofort selbst.',
    diffusionssperre: 'Perfekt passivierend. Nahezu null Abtrag bei Flächenkorrosion.',
    baupraxis: 'Fassadenbefestigungen, Bewehrung in hochbelasteten Zonen (z. B. Spritzwasserzonen von Brücken), Trinkwasserleitungen.',
    warnung: 'LOCHFRESSENDE CHLORIDE: In chloridreicher Umgebung (Tausalz, Hallenbäder) durchschlagen Chloridionen die Chromoxidschicht lokal. Es entsteht gefährlicher Lochfraß und Spannungsrisskorrosion (z. B. Werkstoff 1.4301 unzulässig in Hallenbädern!).',
    voraussetzungen: 'Ausreichender Sauerstoffzutritt zur Repassivierung; kein Fremdrostkontamination (Ferritstaub).'
  },
  {
    id: 'blei',
    name: 'Blei (Werkblei / Baublei)',
    symbol: 'Pb 99,94 %',
    standard: 'DIN EN 12588',
    schichtTyp: 'undurchlaessig',
    schichtName: 'Schwerlösliche Bleicarbonat-/Bleisulfat-Schicht',
    formel: '\\text{PbCO}_3 \\; / \\; \\text{PbSO}_4',
    pbr: 1.28,
    pbrLabel: '1,28 (PbO)',
    dicke: 'ca. 5–20 µm',
    abtragsrate: '< 0,002 mm/Jahr',
    farbe: 'border-zinc-600 bg-zinc-50 text-zinc-900',
    mechanismus: 'Blei bildet an Luft rasch eine graue Schicht aus schwerlöslichem Bleicarbonat und Bleisulfat, die einen dauerhaften Passivschutz bewirkt.',
    diffusionssperre: 'Sehr dichte, schwerlösliche Deckschicht.',
    baupraxis: 'Wandanschlüsse, Schornsteineinfassungen und Denkmalschutzrestaurationen.',
    warnung: 'Organische Säuren (z. B. Essigsäure aus Eichenholz oder manchen Silikonen) greifen die Schicht an (Bleizuckerbildung).'
  }
];

export function DeckschichtenVergleich() {
  const [selectedId, setSelectedId] = useState<string>('corten');

  // PBR Rechner State
  const [calcMetal, setCalcMetal] = useState<'custom' | 'alu' | 'kupfer' | 'corten' | 'stahl' | 'magnesium' | 'chrom'>('corten');
  const [molOxid, setMolOxid] = useState<number>(88.85); // FeOOH
  const [dichteMetall, setDichteMetall] = useState<number>(7.85); // Eisen
  const [wertigkeitN, setWertigkeitN] = useState<number>(1);
  const [molMetall, setMolMetall] = useState<number>(55.85); // Eisen
  const [dichteOxid, setDichteOxid] = useState<number>(4.26); // Goethit

  const activeProfile = METAL_PROFILES.find(m => m.id === selectedId) || METAL_PROFILES[0];

  const handleSelectCalcPreset = (preset: 'custom' | 'alu' | 'kupfer' | 'corten' | 'stahl' | 'magnesium' | 'chrom') => {
    setCalcMetal(preset);
    if (preset === 'alu') {
      // Al2O3: M_Oxid = 101.96, n = 2, M_Metall = 26.98, rho_M = 2.70, rho_Ox = 3.97
      setMolOxid(101.96);
      setDichteMetall(2.70);
      setWertigkeitN(2);
      setMolMetall(26.98);
      setDichteOxid(3.97);
    } else if (preset === 'kupfer') {
      // Cu2O: M_Oxid = 143.09, n = 2, M_Metall = 63.55, rho_M = 8.96, rho_Ox = 6.00
      setMolOxid(143.09);
      setDichteMetall(8.96);
      setWertigkeitN(2);
      setMolMetall(63.55);
      setDichteOxid(6.00);
    } else if (preset === 'corten') {
      // Goethit-Sperrschicht FeOOH: M_Oxid = 88.85, n = 1, M_Metall = 55.85, rho_M = 7.85, rho_Ox = 4.26
      setMolOxid(88.85);
      setDichteMetall(7.85);
      setWertigkeitN(1);
      setMolMetall(55.85);
      setDichteOxid(4.26);
    } else if (preset === 'stahl') {
      // Fe2O3 Rost: M_Oxid = 159.69, n = 2, M_Metall = 55.85, rho_M = 7.85, rho_Ox = 5.24 (Hydratisiert oft noch voluminöser, PBR > 2.5)
      setMolOxid(159.69);
      setDichteMetall(7.85);
      setWertigkeitN(2);
      setMolMetall(55.85);
      setDichteOxid(5.24);
    } else if (preset === 'magnesium') {
      // MgO: M_Oxid = 40.30, n = 1, M_Metall = 24.31, rho_M = 1.74, rho_Ox = 3.58
      setMolOxid(40.30);
      setDichteMetall(1.74);
      setWertigkeitN(1);
      setMolMetall(24.31);
      setDichteOxid(3.58);
    } else if (preset === 'chrom') {
      // Cr2O3: M_Oxid = 151.99, n = 2, M_Metall = 52.00, rho_M = 7.19, rho_Ox = 5.22
      setMolOxid(151.99);
      setDichteMetall(7.19);
      setWertigkeitN(2);
      setMolMetall(52.00);
      setDichteOxid(5.22);
    }
  };

  // PBR Formel: (M_Oxid * rho_Metall) / (n * M_Metall * rho_Oxid)
  const calculatedPbr = (molOxid * dichteMetall) / (wertigkeitN * molMetall * dichteOxid);

  const getPbrStatus = (val: number) => {
    if (isNaN(val) || !isFinite(val)) return { text: 'Ungültig', color: 'text-slate-500 bg-slate-100', eval: 'Berechnung nicht möglich' };
    if (val < 1.0) {
      return { 
        text: 'PBR < 1,0 (Zugspannung & Porös)', 
        color: 'text-amber-700 bg-amber-50 border-amber-300', 
        eval: 'Oxidschicht reißt ständig auf; ungehinderte Diffusion von Sauerstoff und Wasser (durchlässig).' 
      };
    }
    if (val <= 2.0) {
      return { 
        text: '1,0 ≤ PBR ≤ 2,0 (Optimal passivierend)', 
        color: 'text-emerald-700 bg-emerald-50 border-emerald-300', 
        eval: 'Dichte, zähe Schicht unter leichter Druckspannung; schützt das Metall dauerhaft vor weiterer Korrosion (undurchlässig).' 
      };
    }
    return { 
      text: 'PBR > 2,0 (Starke Druckspannung & Abplatzung)', 
      color: 'text-red-700 bg-red-50 border-red-300', 
      eval: 'Enorme innere Druckspannungen führen zum Abblättern (Schuppung) und zu Mikrorissen; keine geschlossene Barrierewirkung (durchlässig).' 
    };
  };

  const pbrStatus = getPbrStatus(calculatedPbr);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* 1. Header & Grundlagen-Box */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-extrabold text-slate-850 flex items-center gap-2">
            <Layers className="w-5 h-5 text-shiraz" />
            Durchlässige vs. Undurchlässige Korrosionsprodukte
          </h3>
          <span className="text-xs font-mono font-bold bg-shiraz/10 text-shiraz px-2.5 py-1 rounded-full border border-shiraz/20">
            DIN EN ISO 8044 / BGRCI 2025
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-normal">
          Warum rosten unlegierte Stähle an der Luft bis zum völligen Querschnittsverlust durch, während Bauteile aus <strong>Kupfer</strong>, <strong>Aluminium</strong> oder <strong>wetterfestem Baustahl (Corten)</strong> Jahrzehnte und Jahrhunderte im Freien unbeschadet überdauern? 
          Der physikochemische Schlüssel liegt im <strong>Reaktionsprodukt</strong>: Bildet das Metall eine <strong>undurchlässige, dichte Passivschicht (Patina)</strong> oder ein <strong>poröses, lockeres und durchlässiges Zersetzungsprodukt (Rost / Weißrost)</strong>?
        </p>

        {/* 2 Spalten: Durchlässig vs. Undurchlässig */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          {/* Box Durchlässig */}
          <div className="bg-white p-4 rounded-xl border border-red-200 shadow-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
              <XCircle size={16} />
              <span>1. Durchlässige Korrosionsprodukte (Rost / Zerstörung)</span>
            </div>
            <ul className="text-xs text-slate-650 space-y-1.5 list-disc pl-4 font-medium leading-relaxed">
              <li>
                <strong>Poröses Gefüge:</strong> Die Reaktionsprodukte (z. B. Rost am Baustahl) bilden offene Kapillarkanäle und Blätterstrukturen.
              </li>
              <li>
                <strong>Ungehinderte Diffusion:</strong> Sauerstoff (<InlineMath math="\text{O}_2" />) und Wasser (<InlineMath math="\text{H}_2\text{O}" />) diffundieren permanent an das frische Metall nach.
              </li>
              <li>
                <strong>Lineares Zeitgesetz:</strong> Der Materialabtrag schreitet mit konstanter Geschwindigkeit (<InlineMath math="x \propto t" />) fort, bis das Bauteil versagt.
              </li>
              <li>
                <strong>Typische Vertreter:</strong> Unlegierter Baustahl, Gusseisen, Zink bei Kondensat ohne CO₂ (Weißrost).
              </li>
            </ul>
          </div>

          {/* Box Undurchlässig */}
          <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 size={16} />
              <span>2. Undurchlässige Deckschichten (Passivierung / Patina)</span>
            </div>
            <ul className="text-xs text-slate-650 space-y-1.5 list-disc pl-4 font-medium leading-relaxed">
              <li>
                <strong>Dichte Atombarriere:</strong> Die Metalloxide bzw. basischen Salze bilden eine gitterkonforme, porenfreie Sperrschicht.
              </li>
              <li>
                <strong>Diffusionsstopp:</strong> Ionen- und Elektronenfluss werden blockiert; die chemische Triebkraft sinkt drastisch ab.
              </li>
              <li>
                <strong>Parabolisches / Logarithmisches Zeitgesetz:</strong> Nach initialer Schichtbildung verlangsamt sich der Abtrag asymptotisch gegen null (<InlineMath math="x \propto \sqrt{t}" /> bzw. <InlineMath math="x \propto \ln(t)" />).
              </li>
              <li>
                <strong>Typische Vertreter:</strong> Kupfer (Patina), Aluminium (Al₂O₃), Corten-Stahl (Goethit-Sperrschicht), Edelstahl (Cr₂O₃).
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Das Pilling-Bedworth-Verhältnis (PBR) */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-shiraz" />
            Das Pilling-Bedworth-Verhältnis (PBR) – Das Kriterium für Deckschichten
          </h4>
          <span className="text-xs text-slate-500 font-medium">N. B. Pilling & R. E. Bedworth (1923)</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-normal">
          Ob eine Oxidschicht schützend wirkt oder aufplatzt, hängt vom Verhältnis des molaren Volumens des gebildeten Oxids (<InlineMath math="V_{\text{Oxid}}" />) zum molaren Volumen des dafür verbrauchten Metalls (<InlineMath math="V_{\text{Metall}}" />) ab:
        </p>

        <div className="bg-white p-3.5 rounded-xl border border-home-grau/25 flex flex-col sm:flex-row items-center justify-around gap-4 text-xs font-mono shadow-xs overflow-x-auto">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-sans text-slate-500 mb-1 font-semibold">Pilling-Bedworth-Verhältnis (PBR)</span>
            <BlockMath math="\mathrm{PBR} = \frac{V_{\text{Oxid}}}{V_{\text{Metall}}} = \frac{M_{\text{Oxid}} \cdot \rho_{\text{Metall}}}{n \cdot M_{\text{Metall}} \cdot \rho_{\text{Oxid}}}" />
          </div>
          <div className="text-[11px] font-sans text-slate-600 border-l border-slate-200 pl-4 py-1 space-y-0.5">
            <div><InlineMath math="M_{\text{Oxid}}, M_{\text{Metall}}" /> = Molare Massen (g/mol)</div>
            <div><InlineMath math="\rho_{\text{Oxid}}, \rho_{\text{Metall}}" /> = Dichten der Phasen (g/cm³)</div>
            <div><InlineMath math="n" /> = Anzahl der Metallatome je Oxidmolekül</div>
          </div>
        </div>

        {/* 3 Ampel-Kriterien */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col gap-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-850">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>PBR &lt; 1,0 (Zugspannung)</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Das Oxidvolumen reicht nicht aus, um die Oberfläche lückenlos zu bedecken. Die Schicht steht unter Zugspannungen, reißt ständig auf und bleibt <strong>porös und durchlässig</strong>.
            </p>
            <span className="text-[10px] text-slate-500 font-semibold mt-auto">Beispiele: Magnesium (0,81), Lithium, Calcium.</span>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col gap-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-850">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>1,0 ≤ PBR ≤ 2,0 (Ideal dicht)</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Das Oxidvolumen übersteigt das Metallvolumen moderat. Die Schicht steht unter <strong>leichter Druckspannung</strong>, ist zäh, haftfest, porenfrei und <strong>vollkommen undurchlässig</strong>.
            </p>
            <span className="text-[10px] text-slate-500 font-semibold mt-auto">Beispiele: Aluminium (1,28), Zink (1,58), Kupfer (1,68), Corten (1,75–1,85), Titan (1,73).</span>
          </div>

          <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/50 flex flex-col gap-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-red-850">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>PBR &gt; 2,0 (Überdehnung)</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Das Oxidvolumen ist zu groß. Es bauen sich <strong>extreme innere Druckspannungen</strong> auf, die zu Blasenbildung, Schuppung, Mikrorissen und Abplatzungen führen. Die Schicht bleibt <strong>durchlässig</strong>.
            </p>
            <span className="text-[10px] text-slate-500 font-semibold mt-auto">Beispiele: Eisen/Rost (2,1–3,3), Vanadium (3,18).</span>
          </div>
        </div>
      </div>

      {/* 3. Interaktiver Werkstoff-Explorer */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-shiraz" />
            Werkstoff-Explorer: Korrosionsprodukte der Baumetalle
          </h4>
          <span className="text-xs text-slate-500 font-medium">Klicken Sie auf ein Metall zur Detailanalyse</span>
        </div>

        {/* Buttons / Badges für die Metalle */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {METAL_PROFILES.map((metal) => {
            const isSelected = metal.id === selectedId;
            return (
              <button
                key={metal.id}
                onClick={() => setSelectedId(metal.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-shiraz border-shiraz text-white shadow-md'
                    : 'bg-white hover:bg-slate-50 border-home-grau/25 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    {metal.id.toUpperCase()}
                  </span>
                  {metal.schichtTyp === 'undurchlaessig' ? (
                    <CheckCircle2 size={13} className={isSelected ? 'text-emerald-200' : 'text-emerald-600'} />
                  ) : metal.schichtTyp === 'durchlaessig' ? (
                    <XCircle size={13} className={isSelected ? 'text-red-200' : 'text-red-600'} />
                  ) : (
                    <AlertTriangle size={13} className={isSelected ? 'text-amber-200' : 'text-amber-600'} />
                  )}
                </div>
                <div className="font-extrabold text-xs mt-1 leading-snug line-clamp-1">
                  {metal.name.split(' ')[0]}
                </div>
                <span className={`text-[9px] mt-1 font-semibold truncate ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                  {metal.schichtTyp === 'undurchlaessig' ? 'Dicht / Patina' : metal.schichtTyp === 'durchlaessig' ? 'Poröser Rost' : 'Bedingt dicht'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail-Panel für das ausgewählte Metall */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900">{activeProfile.name}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {activeProfile.symbol}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                Normgrundlage: {activeProfile.standard}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                activeProfile.schichtTyp === 'undurchlaessig'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : activeProfile.schichtTyp === 'durchlaessig'
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {activeProfile.schichtTyp === 'undurchlaessig' ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Undurchlässige Deckschicht</span>
                  </>
                ) : activeProfile.schichtTyp === 'durchlaessig' ? (
                  <>
                    <XCircle size={14} className="text-red-600" />
                    <span>Durchlässiges Korrosionsprodukt</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={14} className="text-amber-600" />
                    <span>Bedingt dicht (Umgebungsabhängig)</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Kennwerte-Leiste */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Korrosionsprodukt</span>
              <span className="font-bold text-slate-800 leading-tight">{activeProfile.schichtName}</span>
              <div className="text-[11px] font-mono text-shiraz mt-0.5">
                <InlineMath math={activeProfile.formel} />
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PBR-Verhältnis</span>
              <span className="font-extrabold text-slate-800 text-sm">{formatDeZahl(activeProfile.pbr, 2)}</span>
              <span className="text-[10px] text-slate-500 font-medium">{activeProfile.pbrLabel}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Schichtdicke</span>
              <span className="font-bold text-slate-800">{activeProfile.dicke}</span>
              <span className="text-[10px] text-slate-500 font-medium">Im Gleichgewichtszustand</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Typische Abtragsrate</span>
              <span className="font-bold text-slate-800 leading-tight">{activeProfile.abtragsrate}</span>
              <span className="text-[10px] text-slate-500 font-medium">Außenatmosphäre</span>
            </div>
          </div>

          {/* Text-Erklärungen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <strong className="text-slate-900 font-bold flex items-center gap-1.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-shiraz"></span>
                Entstehung & Mechanismus
              </strong>
              <p className="text-slate-650 leading-relaxed font-normal bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                {activeProfile.mechanismus}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <strong className="text-slate-900 font-bold flex items-center gap-1.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                Diffusions- & Barrierewirkung
              </strong>
              <p className="text-slate-650 leading-relaxed font-normal bg-stone-50 p-3 rounded-lg border border-home-grau/15">
                {activeProfile.diffusionssperre}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-xs">
            <strong className="text-slate-900 font-bold flex items-center gap-1.5">
              <Clock size={14} className="text-slate-500" />
              Baupraxis & Langlebigkeit
            </strong>
            <p className="text-slate-650 leading-relaxed font-normal bg-stone-50 p-3 rounded-lg border border-home-grau/15">
              {activeProfile.baupraxis}
            </p>
          </div>

          {activeProfile.warnung && (
            <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/50 flex items-start gap-2.5 text-xs text-red-900">
              <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Praxis-Warnung & Ausfallgrenze:</strong> {activeProfile.warnung}
              </div>
            </div>
          )}

          {activeProfile.voraussetzungen && (
            <div className="p-3 rounded-lg border border-home-grau/20 bg-slate-50 text-xs text-slate-700 flex items-center gap-2">
              <Info size={16} className="text-shiraz shrink-0" />
              <span><strong>Konstruktive Voraussetzung:</strong> {activeProfile.voraussetzungen}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Synopse-Tabelle */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-3">
        <h4 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider flex items-center gap-2">
          <span>Vergleichende Synopse aller Baumetalle</span>
        </h4>
        <div className="overflow-x-auto rounded-xl border border-home-grau/25 bg-white shadow-2xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-stone-100 text-[11px] font-bold text-slate-800 border-b border-home-grau/25">
              <tr>
                <th className="p-3">Werkstoff</th>
                <th className="p-3">Korrosionsprodukt (Formel)</th>
                <th className="p-3 text-center">PBR</th>
                <th className="p-3">Charakter</th>
                <th className="p-3">Abtragsrate</th>
                <th className="p-3">Kritisches Risiko im Bauwesen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {METAL_PROFILES.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                    {m.name.split(' ')[0]} <span className="font-normal text-slate-400">({m.symbol.split(' ')[0]})</span>
                  </td>
                  <td className="p-3 font-mono text-[11px]">
                    <InlineMath math={m.formel.split('\\;')[0]} />
                  </td>
                  <td className="p-3 text-center font-bold">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      m.pbr >= 1.0 && m.pbr <= 2.0 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : m.pbr > 2.0 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {formatDeZahl(m.pbr, 2)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      m.schichtTyp === 'undurchlaessig' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : m.schichtTyp === 'durchlaessig'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {m.schichtTyp === 'undurchlaessig' ? 'Undurchlässig' : m.schichtTyp === 'durchlaessig' ? 'Durchlässig' : 'Bedingt'}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] whitespace-nowrap">{m.abtragsrate.split('(')[0]}</td>
                  <td className="p-3 text-slate-600 text-[11px]">
                    {m.id === 'corten' && 'Versagt bei permanenter Feuchte (ohne Abtrocknung)'}
                    {m.id === 'kupfer' && 'Säureangriff durch Bitumenschindeln / Ammoniak'}
                    {m.id === 'alu' && 'Alkalische Auflösung in frischem Zementmörtel (pH > 12,5)'}
                    {m.id === 'stahl' && 'Ständige Durchrostung, Betonabplatzung (4- bis 6-faches Volumen)'}
                    {m.id === 'zink' && 'Zerstörender Weißrost bei Feuchte ohne CO₂-Zufuhr'}
                    {m.id === 'edelstahl' && 'Lochfraß durch Chloride (Meerluft, Hallenbäder)'}
                    {m.id === 'blei' && 'Essigsäure-Angriff (Eichenholz / Silikone)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Interaktiver PBR-Rechner */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-shiraz" />
            Interaktiver Rechner: Pilling-Bedworth-Verhältnis live bestimmen
          </h4>
          <span className="text-xs text-slate-500 font-medium">Molare Masse & Dichte variieren</span>
        </div>

        {/* Schnellwahlschalter */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold mr-1">Preset wählen:</span>
          {[
            { id: 'corten', label: 'Corten (FeOOH)' },
            { id: 'alu', label: 'Aluminium (Al₂O₃)' },
            { id: 'kupfer', label: 'Kupfer (Cu₂O)' },
            { id: 'chrom', label: 'Chrom (Cr₂O₃)' },
            { id: 'stahl', label: 'Eisen/Rost (Fe₂O₃)' },
            { id: 'magnesium', label: 'Magnesium (MgO)' },
            { id: 'custom', label: 'Benutzerdefiniert' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleSelectCalcPreset(btn.id as "stahl" | "kupfer" | "custom" | "alu" | "corten" | "magnesium" | "chrom")}
              className={`px-3 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                calcMetal === btn.id
                  ? 'bg-shiraz border-shiraz text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 border-home-grau/25 text-slate-700'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Eingabefelder Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase">M_Oxid (g/mol)</label>
            <input aria-label="M_Oxid (g/mol)"
              type="number" min="0"
              step="0.01"
              value={molOxid}
              onChange={(e) => {
                setMolOxid(parseFloat(e.target.value) || 0);
                setCalcMetal('custom');
              }}
              className="p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold bg-slate-50 focus:bg-white focus:outline-shiraz"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase">ρ_Metall (g/cm³)</label>
            <input aria-label="ρ_Metall (g/cm³)"
              type="number" min="0"
              step="0.01"
              value={dichteMetall}
              onChange={(e) => {
                setDichteMetall(parseFloat(e.target.value) || 0);
                setCalcMetal('custom');
              }}
              className="p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold bg-slate-50 focus:bg-white focus:outline-shiraz"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase">Stoichiometrie n</label>
            <input aria-label="Stoichiometrie n"
              type="number"
              step="1"
              min="1"
              max="4"
              value={wertigkeitN}
              onChange={(e) => {
                setWertigkeitN(parseInt(e.target.value) || 1);
                setCalcMetal('custom');
              }}
              className="p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold bg-slate-50 focus:bg-white focus:outline-shiraz"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase">M_Metall (g/mol)</label>
            <input aria-label="M_Metall (g/mol)"
              type="number" min="0"
              step="0.01"
              value={molMetall}
              onChange={(e) => {
                setMolMetall(parseFloat(e.target.value) || 0);
                setCalcMetal('custom');
              }}
              className="p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold bg-slate-50 focus:bg-white focus:outline-shiraz"
            />
          </div>

          <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase">ρ_Oxid (g/cm³)</label>
            <input aria-label="ρ_Oxid (g/cm³)"
              type="number" min="0"
              step="0.01"
              value={dichteOxid}
              onChange={(e) => {
                setDichteOxid(parseFloat(e.target.value) || 0);
                setCalcMetal('custom');
              }}
              className="p-2 border border-home-grau/30 rounded-lg text-xs font-mono font-bold bg-slate-50 focus:bg-white focus:outline-shiraz"
            />
          </div>
        </div>

        {/* Ergebnis & Status-Box */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${pbrStatus.color}`}>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider">Berechnetes Pilling-Bedworth-Verhältnis:</span>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black font-mono">
                PBR = {formatDeZahl(calculatedPbr, 2)}
              </span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-white/80 border border-current shadow-xs">
                {pbrStatus.text}
              </span>
            </div>
            <p className="text-xs font-medium mt-1 text-slate-800">
              {pbrStatus.eval}
            </p>
          </div>

          {/* Balkenindikator */}
          <div className="w-full sm:w-64 flex flex-col gap-1.5 shrink-0">
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>0 (Zug)</span>
              <span>1,0</span>
              <span>2,0</span>
              <span>3,5+ (Druck)</span>
            </div>
            <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex relative border border-slate-300">
              <div className="w-[28%] bg-amber-400 h-full" title="Zugspannungsbereich (<1,0)"></div>
              <div className="w-[29%] bg-emerald-500 h-full" title="Optimaler Passivierungsbereich (1,0–2,0)"></div>
              <div className="w-[43%] bg-red-500 h-full" title="Überdehnungsbereich (>2,0)"></div>
              
              {/* Nadelzeiger */}
              {!isNaN(calculatedPbr) && isFinite(calculatedPbr) && (
                <div 
                  className="absolute top-0 bottom-0 w-1.5 bg-black rounded shadow"
                  style={{ 
                    left: `${Math.min(98, Math.max(2, (calculatedPbr / 3.5) * 100))}%`,
                    transform: 'translateX(-50%)'
                  }}
                  title={`Aktueller Wert: ${formatDeZahl(calculatedPbr, 2)}`}
                />
              )}
            </div>
            <span className="text-[10px] text-center text-slate-500 font-semibold">
              Grüner Bereich (1,0 bis 2,0) = langlebiger Schutz
            </span>
          </div>
        </div>
      </div>

      {/* 6. Baupraktische Fallstudien */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-4">
        <h4 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4 text-shiraz" />
          Vier baupraktische Schlüssellehren für Ingenieure & Gutachter
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Fall 1 */}
          <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-2">
            <span className="font-bold text-amber-850 flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-amber-600" />
              1. Corten-Fassaden: Das Erfordernis des Nass-Trocken-Wechsels
            </span>
            <p className="text-slate-650 leading-relaxed font-normal">
              Wetterfester Baustahl (S355J2W) bildet seine schützende amorphe Goethit-Sperrschicht <strong>nur durch wechselweises Benetzen und vollständiges Austrocknen</strong>. Wird Corten im Erdkontakt verbaut, in dauerfeuchten Schattenzonen platziert oder können sich Wassertaschen in offenen Profilen nicht entleeren, bleibt der Rostzustand aktiv: Das Blech rostet mit der vollen Geschwindigkeit von unlegiertem Baustahl durch!
            </p>
          </div>

          {/* Fall 2 */}
          <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-2">
            <span className="font-bold text-red-850 flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-red-600" />
              2. Aluminium in frischem Beton & Estrich: Alkalische Zersetzung
            </span>
            <p className="text-slate-650 leading-relaxed font-normal">
              Die atomar dichte Al₂O₃-Passivschicht ist nur im neutralen Bereich (<InlineMath math="\text{pH } 4{,}5\text{–}8{,}5" />) stabil. Trifft blankes Aluminium auf frischen Zementmörtel (<InlineMath math="\text{pH} \approx 12{,}5\text{–}13{,}5" /> durch <InlineMath math="\text{Ca(OH)}_2" />), wird die Passivschicht aufgelöst: Es kommt zu starker Wasserstoffgasbildung (<InlineMath math="\text{H}_2\uparrow" />), Lochfraß und völliger Zerstörung des Profils. Vor dem Einbetonieren sind Schutzanstriche oder Bitumenisolierungen zwingend!
            </p>
          </div>

          {/* Fall 3 */}
          <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-2">
            <span className="font-bold text-slate-850 flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-slate-600" />
              3. Weißrost an Zink: Warum gelagerte Trapezbleche durchrosten
            </span>
            <p className="text-slate-650 leading-relaxed font-normal">
              Zur Ausbildung der schützenden basischen Zinkcarbonat-Patina benötigt Zink atmosphärisches Kohlendioxid (<InlineMath math="\text{CO}_2" />). Werden frisch verzinkte Bleche eng gestapelt im Regen oder unter Schwitzwasser gelagert, fehlt das CO₂: Es bildet sich voluminöses, poröses Zinkhydroxid (<InlineMath math="\text{Zn(OH)}_2" /> = Weißrost), das die Zinkschicht in Tagen komplett aufzehrt. Bleche müssen stets gut durchlüftet und schräg gelagert werden!
            </p>
          </div>

          {/* Fall 4 */}
          <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-2">
            <span className="font-bold text-teal-850 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-teal-600" />
              4. Kupfer: Die langlebigste Eindeckung der Baugeschichte
            </span>
            <p className="text-slate-650 leading-relaxed font-normal">
              Kupfer bildet mit Malachit und Brochantit eine mikroskopisch geschlossene Schutzpatina mit idealem Pilling-Bedworth-Verhältnis (<InlineMath math="\text{PBR} \approx 1{,}68" />). Die Abtragsrate sinkt im Gleichgewicht auf unter <InlineMath math="1\,\mu\text{m/Jahr}" /> ab. Historische Kirchendächer aus Kupfer überstehen daher Jahrhunderte ohne jede Instandhaltung oder Beschichtung.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
