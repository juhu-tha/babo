import { formatDeZahl, formatDeTeX, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InlineMath } from 'react-katex';
import { Activity, Search, Magnet, Zap, Thermometer, Battery, Waves, Radiation, Hammer, Radio, Trees, Droplets, Wrench, ClipboardList, CheckCircle2, AlertTriangle, Award, BookOpen } from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DGZfPSection() {
  const [background, setBackground] = useState<'ingenieur' | 'andere'>('ingenieur');
  const [method, setMethod] = useState<'gpr' | 'ut' | 'et' | 'chemical' | 'ie'>('gpr');
  const [level, setLevel] = useState<'1' | '2'>('2');

  const simulationRes = useMemo(() => {
    let schoolHours = 40;
    let practiceDays = 30;
    let details = "";
    let typicalTasks = "";

    if (method === 'gpr') {
      schoolHours = level === '1' ? 40 : 80;
      practiceDays = background === 'ingenieur' ? (level === '1' ? 15 : 45) : (level === '1' ? 30 : 90);
      details = "Georadar-Verfahren (GPR / Bodenradar im Bauwesen) nach DGZfP-Merkblatt B 10. Dient dem berührungsfreien Aufspüren von Spannkanälen, Rohrleitungen und Bewehrungslagen.";
      typicalTasks = level === '1' 
        ? "Datenerfassung auf Rasterflächen vor Ort nach klaren Vorgaben, Systemkalibrierung." 
        : "Komplexe Radargramm-Auswertung, 3D-B-Scan Visualisierung, Bestimmung von Dielektrizitätskonstanten und Erstellung von Prüfberichten.";
    } else if (method === 'ut') {
      schoolHours = level === '1' ? 40 : 80;
      practiceDays = background === 'ingenieur' ? (level === '1' ? 15 : 60) : (level === '1' ? 30 : 120);
      details = "Ultraschallverfahren (UT-Bau) nach DGZfP-Merkblatt B 04. Lokalisierung von Kiesnestern, Verbundmängeln, Rissen und Ablösungen im Inneren mineralischer Baustoffe.";
      typicalTasks = level === '1'
        ? "Kopplung der Sensoren, Oberfächenpräparation, Messung von Durchschallungs-Laufzeiten."
        : "Laufzeit-Tomographie-Auswertung, Bestimmung des dynamischen E-Moduls in-situ, Fehlerbeurteilung.";
    } else if (method === 'et') {
      schoolHours = level === '1' ? 24 : 40;
      practiceDays = background === 'ingenieur' ? (level === '1' ? 10 : 20) : (level === '1' ? 20 : 40);
      details = "Elektromagnetische Betondeckungsmessgeräte (Wirbelstromprüfung / ET-Bau) nach DGZfP-Merkblatt B 02. Präzise Bestimmung der Überdeckungshöhe.";
      typicalTasks = level === '1'
        ? "Systematische Linien-Scans an Bauteilen, Bestimmung nominaler Überdeckungen unter Laboraufsicht."
        : "Ermittlung von Stabdurchmessern bei unbekannter Bewehrung, statistische Konformitätsprüfung nach DBV-Merkblatt.";
    } else if (method === 'chemical') {
      schoolHours = level === '1' ? 24 : 40;
      practiceDays = background === 'ingenieur' ? (level === '1' ? 15 : 30) : (level === '1' ? 30 : 60);
      details = "Elektrochemische Potenzialmessung (Corrosion Diagnostics) nach DGZfP-Merkblatt B 03. Aufspüren aktiver Korrosionsherde (Lochfraßerfassung).";
      typicalTasks = level === '1'
        ? "Rastervorbereitung, Aufstemmen von Kontaktstellen zur Bewehrung, Durchführung von Spannungsmessungen."
        : "Interpretation von Potenzialfeldern, Erstellung von Korrosionswahrscheinlichkeits-Karten, Sanierungsprüfung.";
    } else if (method === 'ie') {
      schoolHours = level === '1' ? 32 : 64;
      practiceDays = background === 'ingenieur' ? (level === '1' ? 15 : 45) : (level === '1' ? 30 : 90);
      details = "Impact-Echo-Verfahren (IE-Bau) nach DGZfP-Merkblatt B 11. Dickenmessung einseitig zugänglicher Bauteile und Ortung tief liegender Hohlräume.";
      typicalTasks = level === '1'
        ? "Prüfkörper-Anregung per Stahlkugelschlag, Fourier-Transformations-Messwertaufnahme."
        : "Analyse des Resonanzfrequenz-Spektrums, Bestimmung der realen Bauteildicke nach d = β · v_p / (2 · f) mit β ≈ 0,96 (ASTM C1383).";
    }

    return { schoolHours, practiceDays, details, typicalTasks };
  }, [background, method, level]);

  const MERKBLAETTER = [
    {
      id: 'B1',
      title: 'Merkblatt B 03 (Potentialmessung)',
      subtitle: 'Elektrochemische Potentialmessungen zur Detektion von Bewehrungsstahlkorrosion (2025)',
      focus: 'Zerstörungsfreies Auffinden aktiver Korrosionsherde (Anoden) in bewehrten Betonbauteilen (Brückenkappen, Parkdecks). Beschreibt Grenzwerte und Rasterabstände für praxisgerechte Korrosionspotentiale (z.B. Cu/CuSO4-Bezugselektrode).'
    },
    {
      id: 'B2',
      title: 'DBV-Merkblatt (Methodenübersicht)',
      subtitle: 'Anwendung zerstörungsfreier Prüfverfahren im Bauwesen (DBV, Fassung 01/2014)',
      focus: 'Zentrale Leitlinie für Ingenieurbüros und Prüfämter. Ordnet baupraktische Fragestellungen (z.B. Druckfestigkeitsschätzung, feuchte Betonanalytik, Rissverläufe) den physikalisch geeignetsten ZfP-Verfahren zu.'
    },
    {
      id: 'B3',
      title: 'Merkblatt B 02 (Betondeckung)',
      subtitle: 'Zerstörungsfreie Betondeckungsmessung und Bewehrungsortung an Stahl- und Spannbetonbauteilen',
      focus: 'Spezifiziert den elektromagnetischen Messbereich von Wirbelstromsonden. Regelt Richtlinien zur Kalibrierung, Einflussfaktoren wie Nachbarstäbe oder Bindedrahtwindungen sowie Fehlertoleranzen bei Bewehrungsdurchmessern.'
    },
    {
      id: 'B4',
      title: 'Merkblatt B 04 (Ultraschall)',
      subtitle: 'Ultraschallverfahren zur zerstörungsfreien Prüfung im Bauwesen',
      focus: 'Behandelt Kompressionswellenlängen in heterogenen Stoffen. Legt Prüfbedingungen fest für Transmission, Impuls-Laufzeitverfahren und 2D/3D-Ultraschall-Laufzeittomographie zur Bestimmung von inneren Bauteilschichten.'
    },
    {
      id: 'B5',
      title: 'Merkblatt B 10 (Radar)',
      subtitle: 'Radarverfahren zur zerstörungsfreien Prüfung im Bauwesen',
      focus: 'Regelt Hochfrequenzantennen-Messungen (0,5 bis 4,0 GHz). Bietet exakte mathematische Grundlagen zur Bestimmung der relativen Permittivität (Dielektrizitätszahl) und die korrekte geophysikalische Interpretation von Radargrammen.'
    },
    {
      id: 'B8',
      title: 'Merkblatt B 06 (Sichtprüfung & Endoskopie)',
      subtitle: 'Sichtprüfung und Endoskopie als optische Verfahren der zerstörungsfreien Prüfung',
      focus: 'Beschreibt Geräte, Durchführung und Dokumentation der visuellen Prüfung und der Endoskopie (z. B. in Hüllrohren, Hohlräumen, zweischaligem Mauerwerk). Feuchtemessverfahren sind nicht Gegenstand der B-Merkblätter; für Feuchte siehe DIN EN ISO 12570 (Darr) und CM-Methode.'
    },
    {
      id: 'B10',
      title: 'Merkblatt B 05 (Thermografie)',
      subtitle: 'Aktives Thermographieverfahren zur zerstörungsfreien Prüfung im Bauwesen',
      focus: 'Legt Prüfungsbedingungen für berührungslose Oberflächentemperaturmessungen fest. Behandelt bauphysikalische Randbedingungen (Sonneneinstrahlung, Wind, Feuchtigkeit) für thermische Dämmstoff- und Fassadenprüfungen.'
    },
    {
      id: 'B11',
      title: 'Merkblatt B 11 (Impact-Echo)',
      subtitle: 'Anwendung des Impakt-Echo-Verfahrens zur ZfP von Betonbauteilen (2022)',
      focus: 'Standardisiert die elastomechanische Impulsanregung. Definiert die Auswertung im Frequenzbereich (FFT) zur Lokalisierung von Verpressmängeln in Hüllrohren von Spanngliedern und Dickenbestimmungen von unbewehrten Platten.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Overview Block */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <Award size={24} />
            </div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">Deutsche Gesellschaft für Zerstörungsfreie Prüfung (DGZfP)</h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Das maßgebliche deutsche Normen- und Ausbildungsnetzwerk für ZfP-Verfahren im Bauwesen
          </p>
        </div>
          </div>
          <a 
            href="https://www.dgzfp.de" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs font-bold text-shiraz hover:underline flex items-center gap-1 self-start sm:self-auto shrink-0 bg-shiraz/5 px-3 py-1.5 rounded-lg border border-shiraz/20"
          >
            Zur offiziellen DGZfP Webseite
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Rolle & Bedeutung für die Bauwerkserhaltung</h3>
            <p>
              Die <strong>DGZfP</strong> wurde bereits 1933 gegründet und ist heute der führende wissenschaftlich-technische Verein zur Förderung zerstörungsfreier Prüfverfahren (NDT - Non-Destructive Testing) in Deutschland. Ihr <strong>Fachausschuss ZfP im Bauwesen (FA ZfP-Bau)</strong> und der zugehörige <strong>Unterausschuss</strong> fassen Experten aller führenden Prüfämter, Universitäten und Hersteller von Sonden zusammen.
            </p>
            <p>
              Im Gegensatz zu metallischen Werkstoffen weisen Baustoffe wie Beton, Holz und Mauerwerk komplexe, stark heterogene Gefüge auf. Die DGZfP erarbeitet deshalb eigens darauf zugeschnittene <strong>Richtlinien (Merkblätter)</strong>, die als anerkannte Regeln der Technik und in rechtlichen Streitfällen als <strong>anerkannte Regeln der Technik</strong> herangezogen werden.
            </p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-500">Wissenschaftliche Fachtagungen</h4>
              <p className="text-xs text-slate-600">
                Die von der DGZfP mitorganisierte zweijährlich stattfindende <strong>Fachtagung Bauwerksdiagnose</strong> ist das wichtigste Forum für Innovationen im Bestand. Themenschwerpunkte umfassen u.a.:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                <li>KI-gestützte Radargrammüberlagerung zur schnellen Risslokalisierung</li>
                <li>Qualitätssicherung von Injektionen bei Denkmalbauten</li>
                <li>Drohnengestützte Infrarotthermographie an Brückenpfeilern</li>
                <li>Kombinationsprüfungen (z.B. UT + GPR) zur Fehlerminimierung (Prüfunsicherheiten)</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-home-grau/30 text-[11px] text-slate-500 italic">
              Empfehlung DGZfP Tagungsbände bieten sehr gute praxisnahe Referenzen für Bachelor- und Masterarbeiten in der Zustandserfassung!
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Certification Path Simulator */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <BookOpen size={20} className="text-shiraz" />
            Zertifizierungspfad nach DIN EN ISO 9712 & DGZfP (ZfP-Bau)
          </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Rechne interaktiv aus, welche theoretischen Ausbildungsstunden und praktischen Erfahrungszeiten für die gesetzlich anerkannte Prüferqualifikation erforderlich sind.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">1. Vorbildung des Prüfkandidaten</label>
              <div className="grid grid-cols-2 gap-2">
                <button aria-pressed={background === 'ingenieur'} 
                  onClick={() => setBackground('ingenieur')}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${background === 'ingenieur' ? 'bg-slate-900 text-white border-home-grau/30' : 'bg-white border-home-grau/30 hover:bg-slate-100 text-slate-700'}`}
                >
                  Bauingenieur / M.Sc. / techn. Ausbildung
                </button>
                <button aria-pressed={background === 'andere'} 
                  onClick={() => setBackground('andere')}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${background === 'andere' ? 'bg-slate-900 text-white border-home-grau/30' : 'bg-white border-home-grau/30 hover:bg-slate-100 text-slate-700'}`}
                >
                  Andere Vorbildung / Facharbeiter
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">2. Gewünschte Prüfmethode</label>
              <select aria-label="2. Gewünschte Prüfmethode" 
                value={method} 
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-home-grau/30 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-shiraz font-medium"
              >
                <option value="gpr">Georadar-Verfahren (GPR-Bau)</option>
                <option value="ut">Ultraschallprüfung (UT-Bau)</option>
                <option value="et">Wirbelstrom / Betondeckung (ET-Bau)</option>
                <option value="chemical">Elektrochemische Potentialmessung</option>
                <option value="ie">Impact-Echo-Verfahren (IE-Bau)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">3. Angestrebte Prüfstufe (DIN EN ISO 9712)</label>
              <div className="grid grid-cols-2 gap-2">
                <button aria-pressed={level === '1'} 
                  onClick={() => setLevel('1')}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${level === '1' ? 'bg-shiraz text-white border-shiraz' : 'bg-white border-home-grau/30 hover:bg-slate-100 text-slate-700'}`}
                >
                  Stufe 1 (Bediener)
                </button>
                <button aria-pressed={level === '2'} 
                  onClick={() => setLevel('2')}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${level === '2' ? 'bg-shiraz text-white border-shiraz' : 'bg-white border-home-grau/30 hover:bg-slate-100 text-slate-700'}`}
                >
                  Stufe 2 (Fachprüfer)
                </button>
              </div>
            </div>
          </div>

          {/* Results visualization */}
          <div className="lg:col-span-7 flex flex-col gap-4 justify-between">
            <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col gap-4">
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-400">Erforderliche Qualifikationsmerkmale:</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-home-grau/30">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Theorieausbildung (DGZfP Kurs)</div>
                  <div className="text-2xl font-black text-shiraz mt-1">{formatDeWert(simulationRes.schoolHours)} Stunden</div>
                  <div className="text-[10px] text-slate-300 mt-1">Vorausgesetzte Theoriezeit des DGZfP-Lehrgangs.</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-home-grau/30">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Praxiserfahrung im Bauwesen</div>
                  <div className="text-2xl font-black text-teal-400 mt-1">{formatDeWert(simulationRes.practiceDays)} Arbeitstage</div>
                  <div className="text-[10px] text-slate-300 mt-1">Nachzuweisende Tage unter Anleitung eines Stufe-2/3 Prüfers.</div>
                </div>
              </div>

              <div className="border-t border-home-grau/30 pt-3 space-y-2">
                <div className="text-xs"><strong className="text-shiraz">Beschreibung der Methode:</strong> {simulationRes.details}</div>
                <div className="text-xs"><strong className="text-teal-400">Typische Tätigkeiten nach Qualifizierung:</strong> {simulationRes.typicalTasks}</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs sm:text-sm text-blue-900 leading-relaxed flex gap-3">
              <AlertTriangle className="text-blue-600 shrink-0 mt-0.5" size={18} />
              <div>
                <strong>Akkreditierungshinweis für Gutachten:</strong> Nach ZTV-ING, Richtlinie SIB und staatlichen Bahnvorgaben dürfen zerstörungsfreie Messungen für Bauwerksgutachten oft <strong>nur</strong> von Personen vorgenommen und unterzeichnet werden, die nachweislich ein gültiges Zertifikat nach <strong>DIN EN ISO 9712</strong> für das entsprechende Prüfverfahren besitzen. Reine "Hobby-Scans" ohne diese Qualifikation sind vor Gericht wertlos.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DGZfP Merkblätter List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <ClipboardList size={20} className="text-shiraz" />
            Offizieller DGZfP Merkblatt-Katalog (B-Serie / Bauwesen)
          </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Diese Bautechnik-Merkblätter repräsentieren den anerkannten Stand der praktischen Messtechnik im Hoch-, Tief- und Ingenieurbau.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MERKBLAETTER.map((mb) => (
            <div key={mb.id} className="bg-white p-5 rounded-2xl border border-home-grau/30 hover:border-shiraz/50 hover:shadow-md transition-all flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-home-grau/30 pb-2">
                <span className="font-mono text-xs font-black text-white bg-shiraz px-2 py-0.5 rounded">DGZfP {mb.id}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Anerkannte Regel d. Technik</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">{mb.title}</h4>
              <p className="text-xs text-slate-400 font-medium leading-normal -mt-1 italic">{mb.subtitle}</p>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">{mb.focus}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default function ZfP() {
  const [activeTab, setActiveTab] = useState<'mechanisch' | 'akustisch' | 'elektromagnetisch' | 'elektrochemisch' | 'thermisch' | 'holz' | 'geraete' | 'dgzfp'>('mechanisch');

  // New states for Wenner-Sonde, Torrent, and Karsten-Röhrchen
  const [wennerSpacing, setWennerSpacing] = useState(50); // mm
  const [wennerResistance, setWennerResistance] = useState(150); // Ohm

  const [torrentKt, setTorrentKt] = useState(0.2); // kT in 10^-16 m^2
  const [torrentMoisture, setTorrentMoisture] = useState(55); // %

  const [karstenTime, setKarstenTime] = useState(15); // min
  const [karstenAbsorbed, setKarstenAbsorbed] = useState(2.5); // ml
  const [karstenMaterial, setKarstenMaterial] = useState<'concrete' | 'klinker' | 'plaster'>('concrete');

  // Selected device state (now used in local tab views)
  const [selectedGeraetLocal, setSelectedGeraetLocal] = useState<Record<string, string>>({
    mechanisch: 'rueckprall',
    akustisch: 'ultraschall',
    elektromagnetisch: 'georadar',
    elektrochemisch: 'potentialfeld',
    thermisch: 'thermografie',
    holz: 'setzdehnung'
  });

  // Keep original states to avoid breaking any references
  const [selectedGeraet, setSelectedGeraet] = useState<string | null>('georadar');
  const [geraeteSearch, setGeraeteSearch] = useState('');
  const [geraeteCategory, setGeraeteCategory] = useState<'all' | 'zfp' | 'destructive' | 'monitoring' | 'spezial'>('all');

  // Rückprallhammer State
  const [rebound, setRebound] = useState(35);
  const [angle, setAngle] = useState<'0' | '90' | '-90'>('0');

  // Ultraschall State
  const [velocity, setVelocity] = useState(4.0); // km/s

  // Bewehrungssucher State
  const [cover, setCover] = useState(30); // mm
  const [barDiameter, setBarDiameter] = useState(16); // mm

  // Radar State
  const [dielectric, setDielectric] = useState(6.0); // Dielektrizitätszahl
  const [timeOfFlight, setTimeOfFlight] = useState(1.5); // ns

  // Potentialmessung State
  const [potential, setPotential] = useState(-350); // mV

  // Thermografie State
  const [tempDiff, setTempDiff] = useState(2.5); // K

  // Impact-Echo State
  const [frequency, setFrequency] = useState(15); // kHz
  const [waveVelocity, setWaveVelocity] = useState(4000); // m/s

  // Durchstrahlungsprüfung State
  const [thickness, setThickness] = useState(20); // cm
  const [radiationEnergy, setRadiationEnergy] = useState(1.5); // MeV

  // Liste von repräsentativen Prüfgeräten und Standardverfahren
  const geraeteList = useMemo(() => [
    {
      id: "georadar",
      name: "Georadar (GPR)",
      category: "zfp",
      categoryLabel: "Zerstörungsfreie ZfP",
      desc: "Zerstörungsfreie elektromagnetische Ortung von Bauteilen, Spanngliedern und Hohlräumen.",
      norm: "RI-ZFP-GB / DGZfP Richtlinien",
      useCase: "Orten von Spannkanälen, Rohrleitungen, Fundamentplattenstärken und Hohlraumdetektion.",
      details: [
        "Frequenzbereich von 500 MHz bis zu 4 GHz für maximale Auflösung im Betonbereich.",
        "Sichtbarmachung von Übergängen im Dielektrikum (z.B. Beton-Stahl, Beton-Luft, Beton-Wasser).",
        "Ermittlung von Bauteildicken und verdeckten historischen Bauteilschichten.",
        "Erstellung von 2D- und 3D-Schnittbildern (B-Scan und C-Scan)."
      ]
    },
    {
      id: "ultraschall",
      name: "Ultraschallmessungen",
      category: "zfp",
      categoryLabel: "Zerstörungsfreie ZfP",
      desc: "Zerstörungsfreie Detektion von Bauteilschichtungen, Fehlstellen und Vorspannkräften.",
      norm: "DIN EN 12504-4 / DIN EN 13791",
      useCase: "Nachweis der inneren Homogenität, Fehlstellenortung in dicken Bauteilen und zerstörungsfreie Bestimmung von Ankerkräften.",
      details: [
        "Messung der Ultraschalllaufzeit von longitudinalen Kompressionswellen.",
        "Berechnung des dynamischen Elastizitätsmoduls (E_dyn) in-situ.",
        "Auffinden innerer Entmischungen, Kiesnester, Risse und Ablösungen.",
        "Bestimmung von Vorspann- und Verankerungszuständen (Ankerkräfte)."
      ]
    },
    {
      id: "betondeckung",
      name: "Elektromagnetisches Betondeckungsmessgerät",
      category: "zfp",
      categoryLabel: "Zerstörungsfreie ZfP",
      desc: "Elektromagnetische Detektion der Bewehrungslage und Messung der nominalen Betondeckungstiefe.",
      norm: "DIN EN 1992-1-1 (Eurocode 2) / DBV-Merkblatt 'Betondeckung'",
      useCase: "Erfassung der Bewehrungsüberdeckung zur Bewertung des Korrosionsschutzes (Karbonatisierungsfront).",
      details: [
        "Nutzt elektromagnetische Induktion (Wirbelstromverfahren).",
        "Ermittlung von Stabdurchmessern und deren genauer Lage.",
        "Präzise Bestimmung der Betondeckungstiefe c zur dauerhaftigkeitstechnischen Bewertung.",
        "Erstellung von großflächigen 2D-Karten der Bewehrungsverteilung."
      ]
    },
    {
      id: "potentialfeld",
      name: "Potentialfeldmessung",
      category: "monitoring",
      categoryLabel: "Echtzeit-Monitoring & Sensorik",
      desc: "Elektrochemische Detektion und Lokalisierung aktiver (rostender) Bewehrungskorrosion.",
      norm: "DGZfP-Richtlinie B3 / SIA 2006",
      useCase: "Zerstörungsfreies Aufspüren von Korrosions-Hotspots in chloridbelasteten Brückenkappen oder Parkdecks.",
      details: [
        "Messung der Potentialdifferenz zwischen der Stahlbewehrung und einer Referenzelektrode (Cu/CuSO4-Elektrode oder Ag/AgCl).",
        "Identifikation von Anodenbereichen (aktive Korrosion) vor sichtbarem Rissbild.",
        "Wichtiger Indikator bei chloridinduzierter Lochfraßkorrosion.",
        "Rastermessung mit Rad- oder Stabelektrode für großflächige Farbkartendarstellung."
      ]
    },
    {
      id: "laserscanner",
      name: "3D-Laserscanner",
      category: "spezial",
      categoryLabel: "Spezialdiagnostik",
      desc: "Hochpräzise berührungslose Geometrie- und Raumerfassung von Bauwerksoberflächen.",
      norm: "Allg. Vermessungsstandard / BIM-Schnittstellen",
      useCase: "Erstellung exakter digitaler Zwillinge (BIM), Ebenheitskontrollen, Verbiegungsdokumentationen.",
      details: [
        "Erzeugung dichter 3D-Punktwolken im Millimeterbereich.",
        "Erfassung von Bauteilverformungen, Neigungen und Risskartierungen grossflächig.",
        "Präzise Verformungs- und Setzungsmessungen über zeitlich zeitversetzte Scans.",
        "Schnittstelle zur Erstellung von geometrisch exakten Tragmodellen."
      ]
    },
    {
      id: "bohrmehl",
      name: "Bohrmehlentnahme",
      category: "destructive",
      categoryLabel: "Zerstörend & Laborchemie",
      desc: "Tiefengestaffelte Probenahme zur präzisen rechnerischen Chloridanalytik im Beton.",
      norm: "DafStb-Heft 401 / DIN EN 14629",
      useCase: "Bestimmung des Chloridgehalts zur Beurteilung der Lochfraßkorrosionsgefahr von Brücken oder Parkhäusern.",
      details: [
        "Tiefengestaffelte Bohrungen in 10-mm- oder 20-mm-Schritten (z.B. 0-10, 10-20, 20-30 mm).",
        "Chemischer Aufschluss im Labor zur Bestimmung des Chloridgehalts bezogen auf die Zementmasse.",
        "Erstellung von Chlorid-Eindringprofilen zur Restlebensdauerprognose.",
        "Ermittlung der kritischen chloridinitiierenden Tiefe."
      ]
    },
    {
      id: "bohrkern",
      name: "Bohrkernentnahme & Begutachtung",
      category: "destructive",
      categoryLabel: "Zerstörend & Laborchemie",
      desc: "Mechanische Probenentnahme zur Bestimmung realer mechanischer und chemischer Materialkennwerte.",
      norm: "DIN EN 12504-1 / DIN EN 13791",
      useCase: "Bestimmung der Druckfestigkeitsklasse am Bestandsbeton, Karbonatisierungstiefe und Zementgehalt.",
      details: [
        "Nassbohrentnahme mit diamantbestückten Bohrkronen (Durchmesser typischerweise 50 - 150 mm).",
        "Bestimmung der Zylinder- und Würfeldruckfestigkeiten im Labor.",
        "Visualisierung von Gefügestörungen, Rissen und Porositätszonen.",
        "Besprühen der Bruchfläche mit Phenolphthalein-Indikator zur Messung der Karbonatisierungstiefe."
      ]
    },
    {
      id: "labor",
      name: "Laboruntersuchungen (Akkreditiertes Prüflabor)",
      category: "destructive",
      categoryLabel: "Zerstörend & Laborchemie",
      desc: "Akkreditiertes Baustofflabor zur Analyse mechanischer, bauphysikalischer und chemischer Proben.",
      norm: "DIN EN 206 / DIN 1045",
      useCase: "Auswertung entnommener Bohrkerne, Dichteanalytik, Druckprüfungen, Darrverfahren, E-Modul-Bestimmung.",
      details: [
        "Hydraulische Druckprüfmaschinen mit rechnergestützter Auswertung für f_c und E-Modul.",
        "Materialanalysen mittels REM (Rasterelektronenmikroskop) bei AKR-Verdacht oder Carbonatbildung.",
        "Auswertung von Festbeton-Porenstrukturen und Dichten.",
        "Chemische Bestimmung von Bindemittelgehalten und Sulfatkonzentrationen."
      ]
    },
    {
      id: "ausziehpruefung",
      name: "Ausziehprüfung & Ankerbelastung",
      category: "destructive",
      categoryLabel: "Zerstörend & Laborchemie",
      desc: "Ermittlung von realen maximalen Auszugslasten von Befestigungssystemen und Dübeln vor Ort.",
      norm: "EOTA TR 048 / DIN EN 1881",
      useCase: "Sicherung der Tragfähigkeit von Brückengeländern, Lärmschutzwänden und nachträglichen Bewehrungsanschlüssen.",
      details: [
        "Hydraulisches Ausziehgerät mit digitaler Kraftmessdose zur Erfassung der Zuglast.",
        "Unterscheidung zwischen Stahlversagen, Betonausbruch oder Verbundversagen.",
        "Genaue Qualitätssicherung bei chemischen Verbundankern und Spreizdübeln.",
        "Ermittlung des Last-Verschiebungs-Verhaltens vor Ort."
      ]
    },
    {
      id: "haftzug",
      name: "Haftzugprüfung (Abreißprüfung)",
      category: "destructive",
      categoryLabel: "Zerstörend & Laborchemie",
      desc: "Prüfung der Oberflächenzugfestigkeit von Betonuntergründen und Verbundfestigkeit von Beschichtungen.",
      norm: "DIN EN 1542 / Richtlinie SIB / ZTV-ING",
      useCase: "Qualitätsnachweis vor und nach Betoninstandsetzungsmassnahmen und dem Aufkleben von CFK-Lamellen.",
      details: [
        "Aufkleben von standardisierten Prüfstempeln (Ø 50 mm) mittels Epoxidharzklebstoff.",
        "Kernbohrung der Beschichtung bis in den tragenden Betonuntergrund.",
        "Zentrischer Zugversuch bis zum Bruch mit mobiler Zugvorrichtung.",
        "Sollwerte: Meist mind. 1,5 N/mm² für Oberflächenfestigkeit bei Instandsetzungen."
      ]
    },
    {
      id: "rautiefe",
      name: "Rautiefenbestimmung (Lasertriangulation)",
      category: "spezial",
      categoryLabel: "Spezialdiagnostik",
      desc: "Laserbasierte präzise Oberflächenprofilanalyse zur Qualitätssicherung bei Beschichtungen.",
      norm: "DIN EN 1766 / DBV-Merkblatt 'Betoninstandsetzung'",
      useCase: "Detektion der Rautiefe (z.B. Sandstrahlen) vor Applikation von Schutzsystemen (PCC, OS 8, OS 11).",
      details: [
        "Einsatz von hochpräzisen Lasertriangulations-Distanzsensoren.",
        "Kontinuierliche Ermittlung des Mittenrauwerts R_a und der Rautiefe.",
        "Präziser Ersatz für das ungenaue Sandflächenverfahren nach Kaufmann.",
        "Minimierung des Materialverbrauchs für Primer und Ausgleichsschichten."
      ]
    },
    {
      id: "gleitmessung",
      name: "Mobiles Gleitmessgerät",
      category: "spezial",
      categoryLabel: "Spezialdiagnostik",
      desc: "Prüfung und Bestimmung der Rutschanfälligkeit und Griffigkeit von Fußböden im verbauten Zustand.",
      norm: "DIN 51131 / DGUV Information 208-041",
      useCase: "Erfassung der Arbeitssicherheit und Verkehrssicherheit auf Industrieböden, Rampen und öffentlichen Treppen.",
      details: [
        "Mobiles, selbstfahrendes Messgerät mit genormten Gleitkörpern.",
        "Ermittlung des dynamischen Gleitreibungskoeffizienten µ im trockenen und nassen Zustand.",
        "Direkte Gutachtenerstellung für Rutschunbarkeiten und Haftungssicherung.",
        "Wichtige Kenngröße bei der Bauabnahme von Industrieböden."
      ]
    },
    {
      id: "porensuchgeraet",
      name: "Porensuchgerät (Hochspannungsprüfung)",
      category: "spezial",
      categoryLabel: "Spezialdiagnostik",
      desc: "Detektion feinster Poren, Haarrisse und Fehlstellen in nicht-leitenden Beschichtungen auf Metall/Beton.",
      norm: "DIN EN 14430 / ISO 8289",
      useCase: "Porenprüfung von Abdichtungssystemen bei Behältern, Verbundbeschichtungen und Korrosionsschutzlagen.",
      details: [
        "Nutzt elektrische Hochspannung (Gleich- oder Pulsspannung von 0,5 kV bis 35 kV).",
        "Ein elektrischer Funke bildet sich sofort bei Vorhandensein von Poren oder Schwachstellen.",
        "Ermöglicht eine 100% lückenlose Überprüfung dünner Schutzfilme.",
        "Sicherung gegen zukünftige Korrosionsschäden durch aggressive Medien."
      ]
    },
    {
      id: "bte",
      name: "Bauteiltemperaturgesteuerte Erhärtung (BTE)",
      category: "destructive",
      categoryLabel: "Zerstörend & Laborchemie",
      desc: "Laborgeführter Festigkeitsnachweis von jungem Beton unter realen Bauteiltemperaturen.",
      norm: "DIN 1045-3 / ZTV-ING",
      useCase: "Überwachung der realen Hydratationsentwicklung zur präzisen Bestimmung des Ausschalzeitpunkts.",
      details: [
        "Einlagerung von Betonprüfkörpern in eine thermisch isolierte BTE-Klimakiste.",
        "Permanente Online-Temperaturerfassung am realen Grossbauteil des Bauwerks.",
        "Automatische Anpassung der Laborkistentemperatur an den gemessenen Verlauf im Bauteil.",
        "Ermittlung der tatsächlichen Druckfestigkeitsentwicklung unter Einbezug der Hydratationswärme."
      ]
    },
    {
      id: "rueckprall",
      name: "Rückprallhammer",
      category: "zfp",
      categoryLabel: "Zerstörungsfreie ZfP",
      desc: "Zerstörungsfreie Prüfung der Oberflächenhärte zur Schätzung der Bauteildruckfestigkeit.",
      norm: "DIN EN 12504-2 / DIN EN 13791",
      useCase: "Schnelle Orientierungsmessungen zur Qualitätssicherung und Gleichmäßigkeit des Betons in-situ.",
      details: [
        "Messen des Rückprallwerts R einer federgetriebenen Schlagmasse.",
        "Kalibrierungskurven berücksichtigen die Prüfrichtung (Schwerkraftwirkung).",
        "Abhängig von Oberflächenbeschaffenheit, Carbonatisierungsgrad und Korngröße.",
        "Kombination mit Ultraschall liefert höchste Genauigkeit (SONREB-Methode)."
      ]
    },
    {
      id: "setzdehnung",
      name: "Setzdehnungsmessung",
      category: "monitoring",
      categoryLabel: "Echtzeit-Monitoring & Sensorik",
      desc: "Mechanische Präzisionsmessung kleinster Längenänderungen zur präzisen Rissüberwachung.",
      norm: "Kein Normverfahren (Herstellerangaben); DMS-Messtechnik: VDI/VDE 2635",
      useCase: "Kurz- und Langzeitrissmonitoring an Brücken, Stützwänden, historischen Mauerwerken bei Lastwechsel.",
      details: [
        "Präzisionstaster mit mechanischer Messuhr (Auflösung bis zu 1 µm).",
        "Anbringen von definierten Passpunkten (Setzbolzen) beidseits der Rissfuge.",
        "Erfassung von witterungs-, last- oder absetzbedingten Rissbewegungen.",
        "Bereitstellung verlässlicher Bemessungsgrundlagen für Instandsetzer."
      ]
    },
    {
      id: "messverstaerker",
      name: "Universal Messverstärker",
      category: "monitoring",
      categoryLabel: "Echtzeit-Monitoring & Sensorik",
      desc: "Zentraler multi-analoger Datenlogger zur digitalen Aufnahme zahlreicher Sensoren im Bauwerksmonitoring.",
      norm: "DIN EN ISO 9001 / Monitoringstandards",
      useCase: "In-situ Erfassung von Tragwerksverformungen, Spannungen und Temperaturen im Langzeitmonitoring.",
      details: [
        "Unterstützung von Dehnungsmesstreifen (DMS), LVDTs, PT100, Thermoelementen und Beschleunigungsaufnehmern.",
        "Hochfrequente Echtzeit-Abtastung für dynamische Tragwerksanalysen (z.B. Eisenbahnbrücken).",
        "Webbasierte Datenübertragung mit automatischen Grenzwert-Alarmierungen via SMS/E-Mail.",
        "Robustes, baustellentaugliches IP67-Gehäuse für den exponierten Außeneinsatz."
      ]
    },
    {
      id: "wegaufnehmer",
      name: "Induktiver Wegaufnehmer (LVDT)",
      category: "monitoring",
      categoryLabel: "Echtzeit-Monitoring & Sensorik",
      desc: "Elektronischer Weggeber zur hochauflösenden kontinuierlichen Rissbreitenüberwachung.",
      norm: "VDI / VDE 2624",
      useCase: "Online-Monitoring bewegungsaktiver Risse unter laufendem Verkehr oder Temperaturgang.",
      details: [
        "Nutzt induktive Differentialtransformator-Technik (LVDT).",
        "Verschleißfreie und berührungslose Erfassung von Wegänderungen im Submikrometer-Bereich.",
        "Kombinationsfähig mit digitalen Messverstärkern zur kontinuierlichen Zeitreihendatenerfassung.",
        "Erlaubt den Abgleich zwischen Außentemperatur und Rissöffnungsverhalten."
      ]
    },
    {
      id: "lanze",
      name: "Temperaturlanze",
      category: "monitoring",
      categoryLabel: "Echtzeit-Monitoring & Sensorik",
      desc: "Sensorlanze mit mehreren verteilten Temperaturfühlern zur Erfassung raumtiefenaufgelöster Profile.",
      norm: "DIN 1045-3 / Richtlinie 'Massige Bauteile'",
      useCase: "Überwachung von Hydratationswärme-Entwicklungen in Fundamenten und dicken massiven Betonbauteilen.",
      details: [
        "Integrierte Messpunkte in festen Abständen (z.B. alle 100 mm oder 500 mm) entlang der Lanze.",
        "Erfassung der Temperatur im Kern und an der Bauteiloberfläche.",
        "Bestimmung des Temperaturgradienten zur aktiven Vermeidung von Thermorissen.",
        "Sehr wichtig für die baupraktische Steuerung von Reifegraden und Nachbehandlungen."
      ]
    },
    {
      id: "thermografie",
      name: "IR-Thermografie",
      category: "zfp",
      categoryLabel: "Zerstörungsfreie ZfP",
      desc: "Infrarot-Wärmebildaufnahmen zur Visualisierung von Delaminationen, Wärmebrücken und Feuchtstellen.",
      norm: "DIN EN 13187",
      useCase: "Auffinden von Wärmebrücken im Hochbau, Feuchtezonen sowie Hohlräumen und Putzablösungen unter der Oberfläche.",
      details: [
        "Ausnutzung der unterschiedlichen Wärmekapazität und Leitfähigkeit von Beton, Hohlräumen und EPS.",
        "Detektion von Leckagen in verdeckten wasserführenden Leitungen (z.B. Fußbodenheizungen).",
        "Passive Thermografie (Sonneneinstrahlung nutzt natürliche Temperaturerwärmung) vs. aktive Anregung.",
        "Zerstörungsfreie Rasterung ganzer Fassaden oder Tunnelinnenwände (Scannerverfahren)."
      ]
    },
    {
      id: "blowerdoor",
      name: "Blower-Door (Differenzdruckmessung)",
      category: "spezial",
      categoryLabel: "Spezialdiagnostik",
      desc: "Prüfung der allgemeinen Luftdichtheit eines Gebäudes und Lokalisierung von Leckagen in der Hülle.",
      norm: "DIN EN ISO 9972",
      useCase: "Qualitätssicherung bei Neubauten, Passivhäusern und energetischen Gebäudesanierungen.",
      details: [
        "Einbau eines regelbaren Ventilators in eine Außentür oder ein Fenster.",
        "Erzeugung einer konstanten Druckdifferenz von z.B. 50 Pascal (Überdruck und Unterdruck).",
        "Ermittlung des Luftwechselvolumens n_50 als Indikator für Undichtigkeiten.",
        "Lokalisierung von strömenden Leckagen mittels Nebelgenerator oder Thermo-Anemometer."
      ]
    },
    {
      id: "endoskopie",
      name: "Endoskopie & Boroskopie",
      category: "spezial",
      categoryLabel: "Spezialdiagnostik",
      desc: "Optische in-situ Inspektion von baupraktisch unzugänglichen Bohrkanälen, Fugen und Hohlräumen.",
      norm: "DGZfP Richtlinie EO / optische Prüfungsnormen",
      useCase: "Inspektion von Spannbetonkanälen, Mauerwerkshohlräumen, Deckenaufbauten und Trägerauflagern.",
      details: [
        "Verwendung von hochauflösenden starren Boroskopen oder flexiblen Videoskopen.",
        "Helle integrierte faseroptische LED-Lichtquellen zur optimalen Ausleuchtung.",
        "Bedarf nur eines minmalen Bohrloches (Ø 6 - 8 mm).",
        "Fotodokumentation von verdecktem Rost, Verpressmängeln oder Holzkäferbefall."
      ]
    },
    {
      id: "elektrolyt",
      name: "Betonwiderstandsmessung (Wenner-Sonde)",
      category: "monitoring",
      categoryLabel: "Echtzeit-Monitoring & Sensorik",
      desc: "Elektrochemische Bestimmung des spezifischen Betonwiderstandes (4-Punkt Wenner-Sonden-Verfahren).",
      norm: "RILEM TC 154-EMC / AASHTO T 358",
      useCase: "Zerstörungsfreie Abschätzung der Porosität, Bauwerksfeuchte und der potenziellen Korrosionsgeschwindigkeit des Bewehrungsstahls.",
      details: [
        "Nutzung von 4 äquidistanten Elektroden zur Eliminierung von Übergangswiderständen an den Kontaktflächen.",
        "Der spezifische elektrische Widerstand (R_ho) korreliert direkt mit dem Eindringwiderstand von Chloriden.",
        "Grenzwert: Widerstände > 1000 Ohm*m (100 kOhm*cm) stehen für extrem vernachlässigbares Korrosionsrisiko.",
        "Unentbehrlich für die quantitative Zustandserfassung von Brückenpfeilern, Kühltürmen und Tunnelwänden."
      ]
    },
    {
      id: "torrent",
      name: "Torrent Gaspermeabilitätsmesser",
      category: "zfp",
      categoryLabel: "Zerstörungsfreie ZfP",
      desc: "Prüfung der Luftdurchlässigkeit der oberflächennahen Überdeckungsschicht nach dem Torrent-Verfahren.",
      norm: "SIA 262/1 Anhang E / Richtlinien des Bundesamtes für Strassen (ASTRA)",
      useCase: "Qualitätssicherung der ausgebildeten Betonrandzone nach dem Ausschalen und Bestimmung des Karbonatisierungsschutzes.",
      details: [
        "Vakuumgestütztes, zerstörungsfreies Doppelkammer-Messprinzip eliminiert Randlecks und Querströmungen.",
        "Liefert den Luftpermeabilitätsbeiwert kT (10^-16 m²) der Betondeckung innerhalb weniger Minuten.",
        "Direkter Indikator für den Widerstand gegen Karbonatisierung und Chlorideindringung.",
        "Klassifizierung von Klasse I (hervorragend dicht, kT < 0.01) bis Klasse V (sehr offen, kT > 10)."
      ]
    },
    {
      id: "karsten",
      name: "Karsten'sches Prüfröhrchen",
      category: "zfp",
      categoryLabel: "Zerstörungsfreie ZfP",
      desc: "Wasseraufnahme-Messverfahren für mineralische Baustoffe und Oberflächenbeschichtungen unter hydrostatischem Druck.",
      norm: "DIN 52617 / RILEM No. II.4",
      useCase: "Bestimmung des kapillaren Aufsauglast-Verhaltens von Betonoberflächen, Mauerwerk, Ziegelstoffen und Fassadenputzen.",
      details: [
        "Einfache Baustellenmontage mittels dichte-elastischem Plastilin-Klebepads auf trockenen Untergründen.",
        "Simulation starker Schlagregenereignisse durch eine 10-cm-Wassersäule (entspricht ca. 140 km/h Sturmwind).",
        "Ermittlung des Wasseraufnahmekoeffizienten w in kg/(m² * h^0.5) über den zeitlichen Volumenverlust (ml).",
        "Sehr gut geeignet zur schnellen Überprüfung von Hydrophobierungserfolgen vor Ort."
      ]
    },
    {
      id: "stahlhaerte",
      name: "Mobiler Härteprüfer für Stahl",
      category: "spezial",
      categoryLabel: "Spezialdiagnostik",
      desc: "Zerstörungsfreie Härteprüfung von metallischen Bauteilen im eingebauten Zustand.",
      norm: "DIN EN ISO 6507 / DIN 50159-1 (UCI-Verfahren)",
      useCase: "Bestimmung der Stahlgüte von historischen Brückenlagern, Nieten, Stahlskeletten vor Ort.",
      details: [
        "Nutzt das Ultrasonic Contact Impedance (UCI)-Härteprüfverfahren.",
        "Ein Vickers-Diamant wird mit definierter Prüfkraft schwingend auf die Stahloberfläche gepresst.",
        "Die Frequenzverschiebung der Schwingung korreliert direkt mit der Härte (Vickers, Brinell, Rockwell).",
        "Erlaubt verlässliche Rückschlüsse auf die Streckgrenze f_y und Zugfestigkeit des Stahls."
      ]
    }
  ], []);

  // Filtered devices based on Category and Search
  const filteredGeraete = useMemo(() => {
    return geraeteList.filter((item) => {
      const matchCategory =
        geraeteCategory === 'all' || item.category === geraeteCategory;
      const matchSearch =
        item.name.toLowerCase().includes(geraeteSearch.toLowerCase()) ||
        item.desc.toLowerCase().includes(geraeteSearch.toLowerCase()) ||
        item.useCase.toLowerCase().includes(geraeteSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [geraeteList, geraeteCategory, geraeteSearch]);

  // Selected device object
  const activeGeraet = useMemo(() => {
    return geraeteList.find((item) => item.id === selectedGeraet) || null;
  }, [geraeteList, selectedGeraet]);

  // Berechnungen Rückprallhammer
  const reboundResults = useMemo(() => {
    let deltaR = 0;
    if (angle === '90') deltaR = -3; // nach unten (Schwerkraft erhöht Aufprallenergie -> R zu groß -> Korrektur negativ)
    if (angle === '-90') deltaR = 3; // nach oben (Schwerkraft verringert Aufprallenergie -> R zu klein -> Korrektur positiv)
    
    const rCorr = rebound + deltaR;
    // Empirische Formel: fc = 0.027 * R^2.1 (vereinfacht)
    const fc = 0.027 * Math.pow(Math.max(10, rCorr), 2.1);

    return {
      rCorr,
      fc
    };
  }, [rebound, angle]);

  // Berechnungen Ultraschall
  const ultrasonicResults = useMemo(() => {
    // Edyn = rho * v^2 * (1+v)(1-2v)/(1-v)
    // rho = 2400 kg/m3, v_poisson = 0.2 -> Faktor = 0.9
    // v in km/s -> v * 1000 m/s
    const eDyn = 2.4 * Math.pow(velocity, 2) * 0.9; // in GPa
    
    // Grobe Abschätzung der Druckfestigkeit aus Ultraschall (sehr stark vereinfacht)
    // fc ≈ (v - 2.0) * 20
    const fcEst = Math.max(0, (velocity - 2.0) * 20);

    return {
      eDyn,
      fcEst
    };
  }, [velocity]);

  // Berechnungen Bewehrungssucher
  const bewehrungssucherResults = useMemo(() => {
    // Signalstärke nimmt mit Abstand quadratisch/kubisch ab
    // Vereinfachtes Modell für die Anzeige
    const signalStrength = Math.max(0, 100 - (cover / barDiameter) * 20);
    return { signalStrength };
  }, [cover, barDiameter]);

  // Berechnungen Radar (Georadar)
  const radarResults = useMemo(() => {
    // v = c / sqrt(epsilon_r)
    // c = 300 mm/ns (Lichtgeschwindigkeit)
    const vRadar = 300 / Math.sqrt(dielectric); // mm/ns
    
    // Tiefe d = v * t / 2 (Hin- und Rückweg)
    const depth = (vRadar * timeOfFlight) / 2; // mm
    
    return { vRadar, depth };
  }, [dielectric, timeOfFlight]);

  // Berechnungen Potentialmessung
  const potentialResults = useMemo(() => {
    let risk = "Gering (< 10%)";
    let color = "bg-green-500";
    if (potential < -350) {
      risk = "Hoch (> 90%)";
      color = "bg-red-500";
    } else if (potential < -200) {
      risk = "Mittel (unsicher)";
      color = "bg-yellow-500";
    }
    return { risk, color };
  }, [potential]);

  // Berechnungen Wenner-Sonde (Spezifischer Widerstand)
  const wennerResults = useMemo(() => {
    // rho = 2 * pi * a * R
    // a in meter = wennerSpacing / 1000
    // R in Ohm = wennerResistance
    const rho = 2 * Math.PI * (wennerSpacing / 1000) * wennerResistance; // Ohm*m
    const rhoKohmCm = rho / 10; // 1 Ohm*m = 0.1 kOhm*cm
    
    let rate = "Vernachlässigbar";
    let color = "bg-green-600";
    let textClass = "text-green-800 bg-green-50";
    let description = "Sehr trockenes Bauteil oder extrem dichtes Gefüge (z.B. Silicafume/HSPC). Eine Korrosionsinitiierung ist thermodynamisch extrem unwahrscheinlich.";

    if (rho < 120) {
      rate = "Sehr hoch";
      color = "bg-red-600";
      textClass = "text-red-800 bg-red-50 border-red-200";
      description = "Feuchter, chloridbelasteter oder karbonatisierter Beton. Aktiver Korrosionsstrom kann ungehindert fließen (Lochfraßgefahr).";
    } else if (rho < 500) {
      rate = "Mittel";
      color = "bg-amber-500";
      textClass = "text-amber-800 bg-amber-50 border-amber-200";
      description = "Durchschnittlicher Feuchte- und Carbonatisierungsgrad. Geringe bis moderate Ausbreitungsgeschwindigkeit.";
    } else if (rho < 1000) {
      rate = "Niedrig";
      color = "bg-emerald-500";
      textClass = "text-emerald-800 bg-emerald-50 border-emerald-100";
      description = "Vorwiegend trocken, hohe Betondichte. Sehr geringe Schädigungsdynamik.";
    }

    return { rho, rhoKohmCm, rate, color, textClass, description };
  }, [wennerSpacing, wennerResistance]);

  // Berechnungen Gaspermeationsmessung (Torrent)
  const torrentResults = useMemo(() => {
    let klassifizierung = "Klasse I (Sehr niedrig)";
    let bewertung = "Hervorragend dicht";
    let textClass = "text-green-800 bg-green-50 border-green-200";
    let description = "Maximale Dauerhaftigkeit. Das Bauteil besitzt einen sehr guten Widerstand gegen Karbonatisierung und Chlorideindringung.";

    if (torrentKt >= 10.0) {
      klassifizierung = "Klasse V (Sehr hoch)";
      bewertung = "Ungenügend / Sehr offenporig";
      textClass = "text-red-800 bg-red-50 border-red-200";
      description = "Extrem durchlässiges Porensystem. Dringender Sanierungsbedarf oder zusätzliche hydrophobierende Applikation angeraten.";
    } else if (torrentKt >= 1.0) {
      klassifizierung = "Klasse IV (Hoch)";
      bewertung = "Minderwertiger Schutz";
      textClass = "text-rose-700 bg-rose-50 border-rose-200";
      description = "Erhöhtes Risiko für Bewehrungskorrosion. Die Karbonatisierungsfront schreitet beschleunigt voran.";
    } else if (torrentKt >= 0.1) {
      klassifizierung = "Klasse III (Mittel)";
      bewertung = "Durchschnittlich";
      textClass = "text-amber-700 bg-amber-50 border-amber-200";
      description = "Durchschnittlicher Betonüberdeckungswiderstand. Standardbeton ohne gesonderte Expositionsklassenschutz-Vorgaben.";
    } else if (torrentKt >= 0.01) {
      klassifizierung = "Klasse II (Niedrig)";
      bewertung = "Gute Qualität";
      textClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
      description = "Sicheres Bauteilverhalten. Ausreichender Porenwiderstand für reguläre Umwelteinflüsse.";
    }

    // Feuchtigkeitseinfluss bestimmen
    let moistureWarning = null;
    let moistureCritical = false;
    if (torrentMoisture > 85) {
      moistureWarning = "Kritische Betonfeuchte (> 85%): Die Messung ist extrem fehleranfällig und ungültig! Wasser blockiert den Porenraum, wodurch der gemessene kT-Wert künstlich gegen Null fällt.";
      moistureCritical = true;
    } else if (torrentMoisture > 70) {
      moistureWarning = "Hohe Betonfeuchte (> 70%): Die tatsächliche Gaspermeabilität ist durch okkludiertes Porenwasser beeinträchtigt. Der reale kT-Wert ist schätzungsweise um den Faktor 2-5 höher.";
    }

    return { klassifizierung, bewertung, textClass, description, moistureWarning, moistureCritical };
  }, [torrentKt, torrentMoisture]);

  // Berechnungen Karstensches Röhrchen
  const karstenResults = useMemo(() => {
    // w = V / (0.491 * sqrt(t_hours))
    const tHours = karstenTime / 60;
    const w = karstenAbsorbed / (0.491 * Math.sqrt(tHours)); // kg/(m² * h^0.5)

    let eingruppierung = "Wasserabweisend (Hydrophob)";
    let textClass = "text-green-800 bg-green-50 border-green-200";
    let color = "bg-green-600";
    let detailtext = "Sehr gute Sperrwirkung gegen eindringende Flüssigkeiten. Extrem hohe Lebensdauer bei Schlagregenbelastung.";

    if (w > 0.5) {
      eingruppierung = "Stark saugend (Absorbierend)";
      textClass = "text-red-800 bg-red-50 border-red-200";
      color = "bg-red-600";
      detailtext = "Baustoff saugt Feuchtigkeit gierig auf. Extreme Frost-Tau-Schadensgefahr und beschleunigter Carbonatisierungsgrad.";
    } else if (w > 0.1) {
      eingruppierung = "Wasserhemmend";
      textClass = "text-amber-700 bg-amber-50 border-amber-200";
      color = "bg-amber-500";
      detailtext = "Ausreichende Reduzierung der Saugwirkung. Regellösung für gut ausgeführte mineralische Außenputze.";
    }

    return { w, tHours, eingruppierung, textClass, color, detailtext };
  }, [karstenTime, karstenAbsorbed]);

  // Berechnungen Thermografie
  const thermographyResults = useMemo(() => {
    let indication = "Keine Auffälligkeiten";
    let color = "bg-green-500";
    if (tempDiff > 2.0) {
      indication = "Deutlicher Hohlraum / Ablösung";
      color = "bg-red-500";
    } else if (tempDiff > 0.5) {
      indication = "Mögliche Fehlstelle";
      color = "bg-yellow-500";
    }
    return { indication, color };
  }, [tempDiff]);

  // Berechnungen Impact-Echo
  const impactEchoResults = useMemo(() => {
    // d = β · v_p / (2 · f), Formfaktor β ≈ 0,96 für Platten (ASTM C1383); f in kHz → Hz
    const beta = 0.96;
    const depth = frequency > 0 ? (beta * waveVelocity) / (2 * (frequency * 1000)) : 0; // in m
    return { depth: depth * 1000 }; // in mm
  }, [frequency, waveVelocity]);

  // Berechnungen Durchstrahlungsprüfung
  const radiographyResults = useMemo(() => {
    // Schwächungsgesetz: I = I0 * e^(-mu * d)
    // Vereinfachte Annahme für mu (Absorptionskoeffizient) basierend auf Energie
    const mu = 0.15 / radiationEnergy; // cm^-1 (stark vereinfacht)
    const transmission = Math.exp(-mu * thickness) * 100; // in %
    
    let quality = "Gut";
    let color = "bg-green-500";
    if (transmission < 1) {
      quality = "Schlecht (zu dick/dicht)";
      color = "bg-red-500";
    } else if (transmission < 5) {
      quality = "Ausreichend";
      color = "bg-yellow-500";
    }

    return { transmission, quality, color };
  }, [thickness, radiationEnergy]);

  // Chart Data für Rückprallhammer
  const chartData = useMemo(() => {
    const labels = [];
    const data0 = [];
    const data90 = [];
    const dataMinus90 = [];

    for (let r = 20; r <= 60; r += 2) {
      labels.push(r);
      data0.push(0.027 * Math.pow(r, 2.1));
      data90.push(0.027 * Math.pow(Math.max(10, r - 3), 2.1));
      dataMinus90.push(0.027 * Math.pow(r + 3, 2.1));
    }

    return {
      labels,
      datasets: [
        {
          label: 'Horizontal (0°)',
          data: data0,
          borderColor: '#E63946',
          backgroundColor: 'rgba(230, 57, 70, 0.1)',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'Nach unten (+90°)',
          data: data90,
          borderColor: '#457B9D',
          backgroundColor: 'rgba(69, 123, 157, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
        },
        {
          label: 'Nach oben (-90°)',
          data: dataMinus90,
          borderColor: '#1D3557',
          backgroundColor: 'rgba(29, 53, 87, 0.1)',
          borderWidth: 2,
          borderDash: [2, 2],
          tension: 0.4,
        }
      ]
    };
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: { display: true, text: 'Druckfestigkeit f_c [N/mm²]' },
        min: 0,
        max: 100
      },
      x: {
        title: { display: true, text: 'Rückprallzahl R [-]' }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${formatDeZahl(context.raw, 1)} N/mm²`
        }
      }
    }
  };

  // Sub-renderer for the distributed Device Pool
  const renderEmbeddedGeraete = (tabKey: string, deviceIds: string[]) => {
    // filter devices
    const devices = geraeteList.filter(d => deviceIds.includes(d.id));
    
    // get selected device for this tab
    const selectedId = selectedGeraetLocal[tabKey] || deviceIds[0];
    const currentDevice = devices.find(d => d.id === selectedId) || devices[0];

    const handleSelect = (id: string) => {
      setSelectedGeraetLocal(prev => ({
        ...prev,
        [tabKey]: id
      }));
    };

    if (devices.length === 0) return null;

    return (
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-home-grau/20 mt-8 flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="flex flex-col gap-1 border-b border-home-grau/20 pb-4">
          <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <Wrench className="text-shiraz" size={20} />
            Praxis-Gerätepool &amp; Fach-Datenblätter
          </h3>
          <p className="text-xs text-slate-500">
            Wählen Sie ein Prüfgerät aus, um detaillierte normative und bautechnische Spezifikationen einzusehen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Device Selector Cards */}
          <div className="lg:col-span-5 flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {devices.map((dev) => {
              const isSelected = dev.id === selectedId;
              return (
                <button
                  key={dev.id}
                  onClick={() => handleSelect(dev.id)}
                  className={`w-full p-4 rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-shiraz text-white border-shiraz shadow-md'
                      : 'bg-white text-slate-850 border-home-grau/30 hover:bg-slate-100 hover:border-home-grau/40'
                  }`}
                >
                  <span className="font-bold text-sm flex items-center justify-between">
                    {dev.name}
                    {isSelected && <CheckCircle2 size={16} className="text-white" />}
                  </span>
                  <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'} line-clamp-1`}>
                    {dev.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Device Details Sheet */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-4 shadow-sm animate-in fade-in duration-300">
            {currentDevice && (
              <>
                <div className="flex flex-col gap-1 border-b border-home-grau/20 pb-2">
                  <div className="text-[10px] font-mono tracking-wider uppercase text-shiraz bg-shiraz/10 px-2 py-0.5 rounded-full w-max font-bold">
                    {currentDevice.categoryLabel}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{currentDevice.name}</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Relevante Norm / Regelwerk</span>
                    <span className="text-slate-800 font-medium">{currentDevice.norm || 'Keine Angabe'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Typischer Einsatzzweck</span>
                    <span className="text-slate-800 font-medium">{currentDevice.useCase}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Technische &amp; Methodische Details</span>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-home-grau/10">
                    {currentDevice.details.map((detail, idx) => (
                      <li key={idx} className="indent-[-12px] pl-[12px] text-slate-700">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button aria-pressed={activeTab === 'mechanisch'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'mechanisch' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('mechanisch')}
        >
          <Hammer size={16} /> Mechanisch (Rückprall)
        </button>
        <button aria-pressed={activeTab === 'akustisch'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'akustisch' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('akustisch')}
        >
          <Waves size={16} /> Akustisch (US, IE)
        </button>
        <button aria-pressed={activeTab === 'elektromagnetisch'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'elektromagnetisch' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('elektromagnetisch')}
        >
          <Radio size={16} /> Elektromagnetisch
        </button>
        <button aria-pressed={activeTab === 'elektrochemisch'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'elektrochemisch' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('elektrochemisch')}
        >
          <Battery size={16} /> Elektrochemisch
        </button>
        <button aria-pressed={activeTab === 'thermisch'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'thermisch' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('thermisch')}
        >
          <Thermometer size={16} /> Thermisch &amp; Strahlung
        </button>
        <button aria-pressed={activeTab === 'holz'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'holz' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('holz')}
        >
          <Trees size={16} /> Holz &amp; Feuchte
        </button>
        <button aria-pressed={activeTab === 'dgzfp'}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'dgzfp' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
          }`}
          onClick={() => setActiveTab('dgzfp')}
          id="dgzfp-tab-btn"
        >
          <Award size={16} /> DGZfP &amp; Richtlinien
        </button>
      </div>

      {activeTab === 'mechanisch' && (
        <div className="flex flex-col gap-8">
          {/* Section 1: Rückprallhammer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Parameter Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Rückprallhammer */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                    <Activity size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Rückprallhammer (Druckfestigkeit)</h2>
                </div>
              
                <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                  <p>
                    <FormulaText text="Der Rückprallhammer misst die Oberflächenhärte des Betons. Die Rückprallzahl R korreliert mit der Druckfestigkeit f_c." />
                  </p>
                </div>

                <Slider info="Vorgabe der gemessenen Rückprallzahl R."
                  label={<FormulaText text="Rückprallzahl R" />}
                  min={20} max={60} step={1}
                  value={rebound} unit="-"
                  onChange={(e) => setRebound(Number(e.target.value))}
                />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-900">Prüfrichtung (Winkel)</label>
                    <InfoTooltip text="Die Schwerkraft beeinflusst die Masse im Hammer. Messungen rechtwinklig nach unten liefern höhere Werte als Messungen senkrecht nach oben." />
                  </div>
                  <select aria-label="Prüfrichtung (Winkel)" 
                    className="p-2 border border-home-grau/30 rounded-md bg-slate-50 focus:outline-none focus:border-shiraz text-sm"
                    value={angle}
                    onChange={(e) => setAngle(e.target.value as any)}
                  >
                    <option value="0">Horizontal (0°)</option>
                    <option value="90">Nach unten (+90°)</option>
                    <option value="-90">Nach oben (-90°)</option>
                  </select>
                </div>

                <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md relative overflow-hidden">
                  <div className="text-sm opacity-90 mb-1">Geschätzte Druckfestigkeit</div>
                  <div className="text-3xl font-bold">{formatDeZahl(reboundResults.fc, 1)} N/mm²</div>
                  <div className="text-xs opacity-75 mt-2">
                    Korrigiertes R: {formatDeZahl(reboundResults.rCorr, 1)}
                  </div>
                  {/* Animation */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                    <div className="w-8 h-8 bg-white/40 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[400px]">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Korrelationskurven (Rückprallhammer)</h2>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-4">
                  <p>
                    Zusammenhang zwischen Rückprallzahl R und Druckfestigkeit f_c für verschiedene Prüfrichtungen nach DIN EN 12504-2.
                  </p>
                </div>
                
                <div className="flex-1 relative w-full h-full">
                  <Line data={chartData} options={options} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Gaspermeation & Karstensches Röhrchen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Torrent Gaspermeationsmessung */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                  <Waves size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-sans">Gaspermeabilität (Torrent)</h2>
              </div>

              <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                <p>
                  Das Torrent-Verfahren misst zerstörungsfrei den Luftpermeabilitätsbeiwert <InlineMath math="k_T" /> der Betonrandzone. Ein wichtiges Maß zur Vorhersage der Carbonatisierungsgeschwindigkeit.
                </p>
              </div>

              <Slider 
                label={<FormulaText text="Gaspermeabilitätsbeiwert kT (10^{-16}\ \text{m}^2)" />}
                min={0.001} max={15.0} step={0.01}
                value={torrentKt} unit=""
                info="Spezifischer Beiwert der Deckschichtverätzung."
                onChange={(e) => setTorrentKt(Number(e.target.value))}
              />

              <Slider 
                label="Betonfeuchtigkeit (r.F.)"
                min={10} max={98} step={1}
                value={torrentMoisture} unit="%"
                info="Das okkludierte Wasser im Porensystem behindert den Gasdurchfluss."
                onChange={(e) => setTorrentMoisture(Number(e.target.value))}
              />

              {torrentResults.moistureWarning && (
                <div className={`p-3 rounded-lg border text-xs flex gap-2 items-start ${
                  torrentResults.moistureCritical 
                    ? 'bg-red-50 text-red-800 border-red-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>{torrentResults.moistureWarning}</span>
                </div>
              )}

              <div className={`mt-2 p-4 rounded-xl border flex flex-col gap-2 ${torrentResults.textClass}`}>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Qualitative Einstufung</div>
                <div className="text-xl font-bold font-sans">{torrentResults.klassifizierung}</div>
                <div className="text-sm font-semibold text-slate-800">Bewertung: {torrentResults.bewertung}</div>
                <p className="text-xs text-slate-600 mt-1">{torrentResults.description}</p>
              </div>
            </div>

            {/* Karsten'sches Röhrchen */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                  <Droplets size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-sans">Kapillare Wasseraufnahme (Karsten-Röhrchen)</h2>
              </div>

              <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                <p>
                  Misst vor Ort die kapillare Wasseraufnahme von mineralischen Baustoffen unter definiertem hydrostatischem Wasserdruck (simulierter Schlagregen).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Slider 
                  label="Messdauer (t)"
                  min={5} max={60} step={5}
                  value={karstenTime} unit="min"
                  info="Dauer des hydrostatischen Eindringversuchs."
                  onChange={(e) => setKarstenTime(Number(e.target.value))}
                />
                <Slider 
                  label="Wasseraufnahme (V)"
                  min={0.1} max={10.0} step={0.1}
                  value={karstenAbsorbed} unit="ml"
                  info="Menge des eingedrungenen Wassers."
                  onChange={(e) => setKarstenAbsorbed(Number(e.target.value))}
                />
              </div>

              <div className="mt-2 p-4 rounded-xl border flex flex-col gap-2 bg-slate-50 border-home-grau/20">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>Wasseraufnahmekoeffizient (w)</span>
                  <span className="font-mono text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded text-[10px]">RILEM II.4</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {formatDeZahl(karstenResults.w, 3)} kg/(m² · h^{"0.5"})
                </div>

                <div className={`mt-2 p-3 rounded-lg border text-xs flex flex-col gap-1 ${karstenResults.textClass}`}>
                  <span className="font-bold">{karstenResults.eingruppierung}</span>
                  <p className="text-slate-600 font-normal">{karstenResults.detailtext}</p>
                </div>
              </div>

              {/* Röhrchen Visualisierung */}
              <div className="relative h-20 bg-slate-100 rounded-lg border border-home-grau/20 overflow-hidden flex items-center justify-between px-6">
                <div className="text-xs font-semibold text-slate-700 flex flex-col">
                  <span>Simulierter Wasserspeicher</span>
                  <span className="text-[10px] text-slate-500">Kapillarer Flüssigkeitsstadium</span>
                </div>
                {/* Dynamische Wassersäule */}
                <div className="h-4 w-48 bg-slate-200 rounded-full overflow-hidden relative border border-home-grau/30">
                  <div 
                    className="h-full bg-blue-500 absolute left-0 transition-all duration-500"
                    style={{ width: `${Math.max(10, 100 - (karstenAbsorbed * 10))}%` }}
                  ></div>
                </div>
                <div className="text-xs font-mono font-bold text-blue-600">
                  {formatDeZahl(Math.max(0, 10 - karstenAbsorbed), 1)} ml übrig
                </div>
              </div>
            </div>

          </div>

          {/* Section 3: Zugehörige Geräte aus Gerätepool */}
          {renderEmbeddedGeraete('mechanisch', ['rueckprall', 'haftzug', 'ausziehpruefung', 'torrent', 'karsten'])}
        </div>
      )}

      {activeTab === 'akustisch' && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ultraschall */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                <Search size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Ultraschalllaufzeit</h2>
            </div>

            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <p>
                Die Ultraschallgeschwindigkeit hängt von der Dichte und dem E-Modul ab. Risse und Hohlräume verringern die Geschwindigkeit.
              </p>
            </div>

            <Slider
              label={<FormulaText text="Ultraschallgeschwindigkeit (v)" />}
              min={2.0} max={5.0} step={0.1}
              value={velocity} unit="km/s"
              onChange={(e) => setVelocity(Number(e.target.value))}
            />

            <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md relative overflow-hidden">
              <div className="text-sm opacity-90 mb-1"><FormulaText text="Dyn. Elastizitätsmodul (E_{dyn})" /></div>
              <div className="text-3xl font-bold">{formatDeZahl(ultrasonicResults.eDyn, 1)} GPa</div>
              <div className="text-xs opacity-75 mt-2">
                <FormulaText text={`\\text{Grobe Festigkeitsabschätzung: } \\approx ${formatDeTeX(ultrasonicResults.fcEst, 1)} \\text{ N/mm}^2`} />
              </div>
              {/* Animation */}
              <div className="absolute right-0 top-0 h-full w-full pointer-events-none">
                <div 
                  className="h-full w-2 bg-white/30 absolute top-0 left-0"
                  style={{ animation: `scan ${6 - velocity}s linear infinite` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Impact-Echo */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                <Waves size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Impuls-Echo-Verfahren</h2>
            </div>
            
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <p>
                Ein mechanischer Impuls erzeugt Spannungswellen. Die Reflexion an Rückwänden oder Fehlstellen wird als Resonanzfrequenz gemessen.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Slider
                label="Resonanzfrequenz (f)"
                min={2} max={50} step={1}
                value={frequency} unit="kHz"
                info="Gemessene dominante Frequenz im Frequenzspektrum."
                onChange={(e) => setFrequency(Number(e.target.value))}
              />
              <Slider
                label="Wellengeschwindigkeit (v)"
                min={3000} max={5000} step={100}
                value={waveVelocity} unit="m/s"
                
                onChange={(e) => setWaveVelocity(Number(e.target.value))}
              />
            </div>

            <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md relative overflow-hidden">
              <div className="text-sm opacity-90 mb-1">Berechnete Tiefe (Bauteildicke / Fehlstelle)</div>
              <div className="text-3xl font-bold">{formatDeZahl(impactEchoResults.depth, 0)} mm</div>
              <div className="text-[11px] opacity-80 mt-1">d = β · v_p / (2 · f), β = 0,96 (ASTM C1383)</div>
              
              {/* Impact-Echo Animation */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                <div className="w-8 h-1 bg-white/50 rounded-full animate-ping" style={{ animationDuration: `${100/frequency}s` }}></div>
                <div className="w-12 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDuration: `${100/frequency}s`, animationDelay: '0.1s' }}></div>
                <div className="w-16 h-1 bg-white/10 rounded-full animate-ping" style={{ animationDuration: `${100/frequency}s`, animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
          </div>
          {/* Section: Zugehörige Geräte aus Gerätepool */}
          {renderEmbeddedGeraete('akustisch', ['ultraschall'])}
        </div>
      )}

      {activeTab === 'elektromagnetisch' && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Elektromagnetischer Bewehrungssucher */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                <Magnet size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Elektromagnetischer Bewehrungssucher</h2>
            </div>
            
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <p>
                Nutzt das Wirbelstromverfahren zur Ortung von Bewehrungsstäben und Messung der Betondeckung.
              </p>
            </div>

            <Slider
              label="Betondeckung"
              min={10} max={100} step={1}
              value={cover} unit="mm"
              info="Abstand der Bewehrung zur Oberfläche."
              onChange={(e) => setCover(Number(e.target.value))}
            />
            
            <Slider
              label="Stabdurchmesser"
              min={6} max={40} step={2}
              value={barDiameter} unit="mm"
              
              onChange={(e) => setBarDiameter(Number(e.target.value))}
            />

            <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md relative overflow-hidden">
              <div className="text-sm opacity-90 mb-1">Relative Signalstärke</div>
              <div className="text-3xl font-bold">{formatDeZahl(bewehrungssucherResults.signalStrength, 0)} %</div>
              
              {/* Animation für Signalstärke */}
              <div className="relative w-full h-48 bg-slate-200 rounded-lg overflow-hidden border border-home-grau/30 mt-4">
                {/* Concrete Texture */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                
                {/* Sensor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-shiraz rounded-b-md flex items-center justify-center z-10 shadow-md">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                
                {/* Magnetic Field Lines (simplified) */}
                <svg className="absolute inset-0 w-full h-full" style={{ opacity: bewehrungssucherResults.signalStrength / 100 }}>
                  {/* SVG-Pfade akzeptieren keine %-Koordinaten → zentriertes Unter-SVG */}
                  <svg x="50%" overflow="visible">
                    <path d="M 0 24 Q -40 50 0 100" stroke="rgba(230, 57, 70, 0.3)" strokeWidth="2" fill="none" className="animate-pulse" />
                    <path d="M 0 24 Q 40 50 0 100" stroke="rgba(230, 57, 70, 0.3)" strokeWidth="2" fill="none" className="animate-pulse" />
                  </svg>
                </svg>

                {/* Rebar */}
                <div 
                  className="absolute left-0 w-full bg-gray-700 shadow-inner flex items-center justify-center transition-all duration-300"
                  style={{ 
                    top: `${Math.max(15, Math.min(85, (cover / 100) * 100))}%`, 
                    height: `${Math.max(6, barDiameter * 1.5)}px` 
                  }}
                >
                  <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.8) 10px, rgba(255,255,255,0.8) 12px)' }}></div>
                </div>
                
                {/* Dimension line */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 border-l-2 border-shiraz z-10 transition-all duration-300"
                  style={{
                    top: '24px',
                    height: `calc(${Math.max(15, Math.min(85, (cover / 100) * 100))}% - 24px)`
                  }}
                >
                  <div className="absolute -left-1 top-0 w-2 h-0.5 bg-shiraz"></div>
                  <div className="absolute -left-1 bottom-0 w-2 h-0.5 bg-shiraz"></div>
                </div>
                
                <div 
                  className="absolute left-1/2 ml-3 text-xs font-bold text-shiraz bg-white/90 px-1.5 py-0.5 rounded shadow-sm z-10 transition-all duration-300"
                  style={{
                    top: `calc(${Math.max(15, Math.min(85, (cover / 100) * 100)) / 2}% + 12px)`,
                    transform: 'translateY(-50%)'
                  }}
                >
                  c = {formatDeWert(cover)} mm
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 bg-white/50 w-full">
                <div 
                  className="h-full bg-white transition-all duration-300 ease-out" 
                  style={{ width: `${bewehrungssucherResults.signalStrength}%` }}
                />
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <div 
                  className="rounded-full border-2 border-white/50 animate-ping absolute"
                  style={{ width: `${bewehrungssucherResults.signalStrength}%`, height: `${bewehrungssucherResults.signalStrength}%`, minWidth: '20px', minHeight: '20px', maxWidth: '80px', maxHeight: '80px' }}
                ></div>
                <div className="w-4 h-4 bg-white rounded-full z-10"></div>
              </div>
            </div>
          </div>

          {/* Georadar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                <Zap size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Georadar (GPR)</h2>
            </div>
            
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <p>
                Sendet elektromagnetische Impulse aus. Reflexionen an Materialgrenzen (z.B. Stahl, Hohlräume) werden gemessen.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Slider info="Parameter zur Anpassung der Berechnung."
                label={<FormulaText text="Dielektrizitätszahl (\varepsilon_r)" />}
                min={4.0} max={12.0} step={0.5}
                value={dielectric} unit="-"
                onChange={(e) => setDielectric(Number(e.target.value))}
              />
              
              <Slider
                label={<FormulaText text="Laufzeit (t)" />}
                min={0.5} max={5.0} step={0.1}
                value={timeOfFlight} unit="ns"
                info="Zeit vom Senden bis zum Empfang des Echos."
                onChange={(e) => setTimeOfFlight(Number(e.target.value))}
              />
            </div>

            <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md relative overflow-hidden">
              <div className="text-sm opacity-90 mb-1">Berechnete Tiefe des Objekts</div>
              <div className="text-3xl font-bold">{formatDeZahl(radarResults.depth, 1)} mm</div>
              <div className="text-xs opacity-75 mt-2">
                Radargeschwindigkeit: {formatDeZahl(radarResults.vRadar, 1)} mm/ns
              </div>
              {/* Animation */}
              <div className="relative w-full h-48 bg-slate-200 rounded-lg overflow-hidden border border-home-grau/30 mt-4">
                {/* Concrete Texture */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                
                {/* Sensor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 bg-blue-600 rounded-b-md flex items-center justify-center z-10 shadow-md">
                  <Zap size={16} className="text-white" />
                </div>
                
                {/* Radar Waves (SVG) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="radarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(37, 99, 235, 0.6)" />
                      <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
                    </linearGradient>
                  </defs>
                  <path 
                    d={`M 50 16.7 L ${50 - radarResults.depth/5} ${Math.min(90, 32 + radarResults.depth/2)} L ${50 + radarResults.depth/5} ${Math.min(90, 32 + radarResults.depth/2)} Z`} /* viewBox 0–100: Prozentkoordinaten ohne %-Zeichen (in SVG-Pfaden ungültig); Start = Unterkante Sensor (32 px von 192 px) */ 
                    fill="url(#radarGrad)" 
                    className="animate-pulse"
                    style={{ animationDuration: '2s' }}
                  />
                </svg>

                {/* Target Object (e.g. void or pipe) */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 w-16 h-8 bg-gray-800 rounded-full border-2 border-gray-600 shadow-inner transition-all duration-300"
                  style={{ 
                    top: `${Math.min(85, 15 + radarResults.depth/3)}%`,
                  }}
                ></div>
                
                {/* Dimension line */}
                <div 
                  className="absolute left-[60%] border-l-2 border-blue-600 z-10 transition-all duration-300"
                  style={{
                    top: '32px',
                    height: `calc(${Math.min(85, 15 + radarResults.depth/3)}% - 32px)`
                  }}
                >
                  <div className="absolute -left-1 top-0 w-2 h-0.5 bg-blue-600"></div>
                  <div className="absolute -left-1 bottom-0 w-2 h-0.5 bg-blue-600"></div>
                </div>
                
                <div 
                  className="absolute left-[60%] ml-3 text-xs font-bold text-blue-700 bg-white/90 px-1.5 py-0.5 rounded shadow-sm z-10 transition-all duration-300"
                  style={{
                    top: `calc(${Math.min(85, 15 + radarResults.depth/3)} / 2% + 16px)`,
                    transform: 'translateY(-50%)'
                  }}
                >
                  d = {formatDeZahl(radarResults.depth, 0)} mm
                </div>
              </div>
              <div className="absolute right-8 top-0 h-full w-32 flex flex-col items-center justify-between py-2">
                <div className="w-full h-1 bg-white/30 rounded-full animate-pulse"></div>
                <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
                <div className="w-full h-1 bg-white/30 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          </div>
          {/* Section: Zugehörige Geräte aus Gerätepool */}
          {renderEmbeddedGeraete('elektromagnetisch', ['georadar', 'betondeckung'])}
        </div>
      )}

      {activeTab === 'elektrochemisch' && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Potentialmessung */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                  <Battery size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Potentialmessung (Half-cell)</h2>
              </div>
              
              <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                <p>
                  <FormulaText text="Misst das elektrochemische Potential der Bewehrung gegen eine Referenzelektrode (z.B. \text{Cu/CuSO}_4), um aktive Korrosion zu lokalisieren." />
                </p>
              </div>

              <Slider
                label="Gemessenes Potential"
                min={-600} max={0} step={10}
                value={potential} unit="mV"
                onChange={(e) => setPotential(Number(e.target.value))}
              />

              <div className={`mt-4 p-4 text-white rounded-xl shadow-md transition-colors duration-500 ${potentialResults.color}`}>
                <div className="text-sm opacity-90 mb-1">Korrosionswahrscheinlichkeit</div>
                <div className="text-3xl font-bold">{potentialResults.risk}</div>
                <div className="text-xs opacity-75 mt-2">
                  <FormulaText text="Referenzelektrode: \text{Cu/CuSO}_4" />
                </div>
              </div>
            </div>

            {/* Wenner-Sonde (Betonwiderstandsmessung) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                  <Zap size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Betonwiderstand (Wenner-Sonde)</h2>
              </div>

              <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
                <p>
                  Das 4-Punkt Wenner-Sonden-Verfahren misst den spezifischen elektrischen Widerstand <InlineMath math="\rho" />. Dies korreliert mit der Durchfeuchtung und der Korrosionsgeschwindigkeit im Beton.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Slider 
                  label="Elektrodenabstand (a)"
                  min={20} max={100} step={5}
                  value={wennerSpacing} unit="mm"
                  info="Gleichmäßiger Abstand zwischen den 4 Messnadeln."
                  onChange={(e) => setWennerSpacing(Number(e.target.value))}
                />
                <Slider 
                  label="Elektrolytwiderstand (R)"
                  min={10} max={2000} step={10}
                  value={wennerResistance} unit="Ohm"
                  info="Gemessener Widerstandswert zwischen den Innenelektroden."
                  onChange={(e) => setWennerResistance(Number(e.target.value))}
                />
              </div>

              <div className="mt-2 p-4 rounded-xl border border-home-grau/20 bg-slate-50 flex flex-col gap-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Spezifischer elektrischer Widerstand</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">{formatDeZahl(wennerResults.rho, 1)} Ω·m</span>
                  <span className="text-sm text-slate-500">({formatDeZahl(wennerResults.rhoKohmCm, 1)} kΩ·cm)</span>
                </div>

                <div className={`mt-2 p-3 rounded-lg border text-xs flex flex-col gap-1 ${wennerResults.textClass}`}>
                  <span className="font-bold">Korrosionsrate: {wennerResults.rate}</span>
                  <p className="text-slate-600 font-normal">{wennerResults.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Zugehörige Geräte aus Gerätepool */}
          {renderEmbeddedGeraete('elektrochemisch', ['potentialfeld', 'elektrolyt'])}
        </div>
      )}

      {activeTab === 'thermisch' && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Infrarot-Thermografie */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                <Thermometer size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Infrarot-Thermografie</h2>
            </div>
            
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <p>
                Erfasst die Oberflächentemperatur. Hohlräume oder Ablösungen unter der Oberfläche erwärmen sich bei Sonneneinstrahlung schneller als massiver Beton.
              </p>
            </div>

            <Slider info="Parameter zur Anpassung der Berechnung."
              label={<FormulaText text="Temperaturdifferenz (\Delta T)" />}
              min={0} max={5} step={0.1}
              value={tempDiff} unit="K"
              
              onChange={(e) => setTempDiff(Number(e.target.value))}
            />

            <div className={`mt-4 p-4 text-white rounded-xl shadow-md transition-colors duration-500 ${thermographyResults.color} relative overflow-hidden`}>
              <div className="text-sm opacity-90 mb-1">Befund</div>
              <div className="text-3xl font-bold">{thermographyResults.indication}</div>
              
              {/* Thermografie Animation */}
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-50" style={{
                background: `linear-gradient(90deg, transparent, ${tempDiff > 2 ? 'rgba(255,0,0,0.8)' : tempDiff > 0.5 ? 'rgba(255,255,0,0.8)' : 'rgba(0,255,0,0.8)'})`
              }}></div>
            </div>
          </div>

          {/* Durchstrahlungsprüfung */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
                <Radiation size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Durchstrahlungsprüfung (Radiographie)</h2>
            </div>
            
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <p>
                Nutzt Röntgen- oder Gammastrahlung zur Abbildung des Bauteilinneren (z.B. Spannglieder). Die Schwächung hängt von Dicke und Dichte ab.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Slider info="Parameter zur Anpassung der Berechnung."
                label={<FormulaText text="Bauteildicke (d)" />}
                min={5} max={100} step={1}
                value={thickness} unit="cm"
                
                onChange={(e) => setThickness(Number(e.target.value))}
              />
              <Slider
                label="Strahlungsenergie"
                min={0.5} max={15.0} step={0.5}
                value={radiationEnergy} unit="MeV"
                info="Höhere Energie durchdringt dickere Bauteile."
                onChange={(e) => setRadiationEnergy(Number(e.target.value))}
              />
            </div>

            <div className={`mt-4 p-4 text-white rounded-xl shadow-md transition-colors duration-500 ${radiographyResults.color} relative overflow-hidden`}>
              <div className="text-sm opacity-90 mb-1">Transmission & Bildqualität</div>
              <div className="text-3xl font-bold">{formatDeZahl(radiographyResults.transmission, 2)} %</div>
              <div className="text-xs opacity-75 mt-2">
                Qualität: {radiographyResults.quality}
              </div>
              
              {/* Radiography Animation */}
              <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center opacity-30">
                <div className="w-full h-full bg-gradient-to-r from-transparent to-white" style={{ opacity: radiographyResults.transmission / 100 }}></div>
              </div>
            </div>
          </div>
          </div>
          {/* Section: Zugehörige Geräte aus Gerätepool */}
          {renderEmbeddedGeraete('thermisch', ['thermografie', 'bte', 'lanze', 'blowerdoor'])}
        </div>
      )}

      {activeTab === 'holz' && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <Activity size={20} className="text-shiraz" /> Bohrwiderstandsmessung (Nadelbohrverfahren)
            </h3>
            <p className="text-sm text-slate-700">
              Ein dünner Bohrer (meist Ø 1,5 - 3,0 mm) wird mit konstanter Geschwindigkeit in das Holz getrieben. Der elektrische Energieaufwand (Bohrwiderstand) wird in Abhängigkeit von der Bohrtiefe aufgezeichnet.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
              <li><strong>Anwendung:</strong> Erkennung von Fäulnis, Hohlräumen, Rissen und Insektengängen im Inneren von Holzbauteilen.</li>
              <li><strong>Ergebnis:</strong> Ein Bohrprofil (Resistogramm). Intaktes Holz zeigt hohe Widerstände (mit sichtbaren Jahrringschwankungen), geschädigtes Holz zeigt starke Abfälle im Widerstand.</li>
              <li><strong>Vorteil:</strong> Quasi-zerstörungsfrei (sehr kleines Bohrloch), liefert direkte in-situ Informationen über den Restquerschnitt.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <Waves size={20} className="text-shiraz" /> Dynamischer E-Modul (Ultraschall / Resonanz)
            </h3>
            <p className="text-sm text-slate-700">
              Bestimmung der Festigkeit und Steifigkeit von Holzbauteilen über die Ausbreitungsgeschwindigkeit von Schallwellen.
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-center">
              <FormulaText text="E_{dyn} = \rho \cdot v^2" />
            </div>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
              <li><strong>Prinzip:</strong> Schall breitet sich in dichtem, gesundem Holz schneller aus als in geschädigtem oder porösem Holz.</li>
              <li><strong>Anwendung:</strong> Abschätzung der Festigkeitsklasse (Sortierung), Erkennung von inneren Schäden (Pilzbefall verringert die Schallgeschwindigkeit drastisch).</li>
              <li><strong>Hinweis:</strong> Der dynamische E-Modul ist in der Regel ca. 10-20% höher als der statische E-Modul.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <Droplets size={20} className="text-shiraz" /> Feuchtemessung
            </h3>
            <p className="text-sm text-slate-700">
              Die Holzfeuchte ist der kritischste Parameter für die Dauerhaftigkeit (Gefahr von Pilzbefall ab ca. 20% Holzfeuchte).
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
              <li><strong>Widerstandsmessung:</strong> Zwei Elektroden werden ins Holz geschlagen. Der elektrische Widerstand sinkt mit steigender Feuchtigkeit. Genau im Bereich von 6% bis 30% (Fasersättigungspunkt).</li>
              <li><strong>Kapazitive Messung:</strong> Zerstörungsfrei durch Auflegen eines Sensors. Misst die Änderung der Dielektrizitätskonstante. Gut für schnelle Rastermessungen, aber anfällig für Dichteschwankungen.</li>
              <li><strong>Darr-Methode:</strong> Zerstörend (Probenentnahme), aber das genaueste Referenzverfahren.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <Trees size={20} className="text-shiraz" /> Dendrochronologie
            </h3>
            <p className="text-sm text-slate-700">
              Altersbestimmung von Holz anhand der charakteristischen Abfolge von breiten und schmalen Jahrringen.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
              <li><strong>Prinzip:</strong> Das Baumwachstum (Jahrringbreite) wird stark vom Klima (Temperatur, Niederschlag) des jeweiligen Jahres beeinflusst. Diese Muster sind regional einheitlich.</li>
              <li><strong>Anwendung:</strong> Exakte Datierung von historischen Dachstühlen, Fachwerkhäusern oder archäologischen Funden (oft auf das genaue Fälljahr bestimmbar).</li>
              <li><strong>Vorgehen:</strong> Entnahme eines Bohrkerns (Zuwachsbohrer), Ausmessen der Jahrringbreiten und Abgleich mit regionalen Referenzkurven (Masterchronologien).</li>
            </ul>
          </div>
          </div>
          {/* Section: Zugehörige Geräte aus Gerätepool */}
          {renderEmbeddedGeraete('holz', ['setzdehnung', 'messverstaerker', 'wegaufnehmer', 'endoskopie', 'laserscanner'])}
        </div>
      )}

      <ModuleFooter 
        weblinks={[
          { title: "Deutsche Gesellschaft für Zerstörungsfreie Prüfung e.V. (DGZfP)", url: "https://www.dgzfp.de" }
        ]}
        wikipedia={[
          { title: 'Zerstörungsfreie Prüfung', url: 'https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Pr%C3%BCfung' },
          { title: 'Rückprallhammer', url: 'https://de.wikipedia.org/wiki/R%C3%BCckprallhammer' },
          { title: 'Ultraschallprüfung', url: 'https://de.wikipedia.org/wiki/Ultraschallpr%C3%BCfung' },
          { title: 'Bodenradar', url: 'https://de.wikipedia.org/wiki/Bodenradar' }
        ]}
        literatur={[
          'Schickert, M.: Verfahren der zerstörungsfreien Prüfung im Bauwesen.',
          'DGZfP-Merkblatt B 04: Ultraschallverfahren zur Zerstörungsfreien Prüfung im Bauwesen.'
        ]}
        regelwerke={[
          { title: 'DIN EN 12504-2 (Prüfung von Beton - Bestimmung der Rückprallzahl)' },
          { title: 'DIN EN 12504-4 (Prüfung von Beton - Bestimmung der Ultraschalllaufzeit)' },
          { title: 'DGZfP-Merkblätter der Reihe B (ZfP im Bauwesen)', url: 'https://publikationen.dgzfp.de/' }
        ]}
        formeln={[
          {
            formel: 'E_{dyn} = \\rho \\cdot v^2 \\cdot \\frac{(1+\\nu)(1-2\\nu)}{1-\\nu}',
            erklaerung: 'Dynamischer Elastizitätsmodul E_{dyn} aus der Ultraschall-Impulsgeschwindigkeit v (mit Dichte \\rho und Querdehnzahl \\nu).',
            quelle: 'DIN EN 12504-4'
          },
          {
            formel: 'd = \\frac{v \\cdot t}{2}',
            erklaerung: 'Tiefenberechnung beim akustischen Impuls-Echo-Verfahren aus Ultraschallgeschwindigkeit v und Reflexionslaufzeit t.',
            quelle: 'DGZfP-Merkblatt B 04'
          },
          {
            formel: 'd = \\frac{c_0}{\\sqrt{\\varepsilon_r}} \\cdot \\frac{t}{2}',
            erklaerung: 'Tiefenberechnung beim Boden- und Betonradar (GPR): c_0 = Lichtgeschwindigkeit im Vakuum, \\varepsilon_r = relative Dielektrizitätskonstante des Baustoffs, t = Signallaufzeit.',
            quelle: 'DGZfP Richtlinie B1'
          },
          {
            formel: 'I = I_0 \\cdot e^{-\\mu \\cdot d}',
            erklaerung: 'Lambert-Beersches Schwächungsgesetz für Durchstrahlungsprüfungen (Röntgen- / Gammametrie): I_0 = Ursprungsintensität, \\mu = linearer Schwächungskoeffizient, d = Bauteildicke.',
            quelle: 'DIN EN ISO 5579'
          }
        ]}
      />
      <style>{`
        @keyframes scan {
          0% { transform: translateX(0); }
          100% { transform: translateX(1000%); }
        }
      `}</style>
    </div>
  );
}
