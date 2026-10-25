// Ausgelagert aus src/modules/ZfP.tsx (AP 5.2)
import { formatDeWert } from '@/src/utils/numberFormat';
import { useState, useMemo } from 'react';
import { ClipboardList, AlertTriangle, Award, BookOpen } from 'lucide-react';

export function DGZfPSection() {
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
                onChange={(e) => setMethod(e.target.value as typeof method)}
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
