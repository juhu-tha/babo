import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Smartphone, Database, ShieldCheck, Recycle, FileText, MapPin, Factory, Leaf, Truck, Activity, BookOpen, Wrench, Clock, Scale, CheckCircle2, Camera, RefreshCw, Volume2, AlertCircle } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';

const DPP_MOCK_DATA = {
  'uid-1234-beton': {
    name: 'Stahlbetonfertigteil-Stütze',
    manufacturer: 'Precast Solutions GmbH',
    productionDate: '2025-10-12',
    location: 'Werk Augsburg',
    batchId: 'B-2025-10-12-04',
    materials: [
      { name: 'Normalbeton C35/45', amount: '1,2 m³', recycledContent: '15%' },
      { name: 'Betonstahl B500B', amount: '180 kg', recycledContent: '100%' }
    ],
    carbonFootprint: '385 kg CO₂-Äqv.',
    circularity: {
      recyclability: '95%',
      instructions: 'Demontage über Schraubverbindungen am Fußpunkt. Stahl und Beton können im Brecher getrennt und recycelt werden.'
    },
    compliance: ['CE-Kennzeichnung', 'DIN EN 13225', 'EPD verfügbar']
  },
  'uid-5678-holz': {
    name: 'Brettschichtholz-Träger (BSH)',
    manufacturer: 'WoodBuild AG',
    productionDate: '2026-01-05',
    location: 'Werk Rosenheim',
    batchId: 'H-2026-01-05-12',
    materials: [
      { name: 'Fichtenholz (PEFC zertifiziert)', amount: '0,8 m³', recycledContent: '0%' },
      { name: 'Melamin-Harnstoff-Harz (MUF)', amount: '12 kg', recycledContent: '0%' }
    ],
    carbonFootprint: '-620 kg CO₂-Äqv. (inkl. biogener Kohlenstoff)',
    circularity: {
      recyclability: '80%',
      instructions: 'Kaskadennutzung empfohlen. Zuerst Wiederverwendung als Bauteil, danach stoffliche Verwertung (Spanplatten), zuletzt thermische Verwertung.'
    },
    compliance: ['FSC/PEFC', 'DIN EN 14080', 'Blauer Engel']
  }
};

const EPD_DATA = [
  {
    id: 'beton',
    name: 'Normalbeton C25/30',
    manufacturer: 'MusterBeton GmbH',
    validUntil: '2028-12-31',
    deklarationsnummer: 'EPD-MBG-20230115-IBC1-DE',
    einheit: '1 m³',
    phasen: {
      a1a3: { name: 'Herstellung (A1-A3)', gwp: 245.0, penrt: 1850.0, ap: 0.45, ep: 0.12 },
      a4: { name: 'Transport (A4)', gwp: 15.5, penrt: 210.0, ap: 0.08, ep: 0.02 },
      c3: { name: 'Abfallbehandlung (C3)', gwp: 8.2, penrt: 120.0, ap: 0.03, ep: 0.01 },
      d: { name: 'Recyclingpotenzial (D)', gwp: -12.5, penrt: -180.0, ap: -0.05, ep: -0.01 }
    }
  },
  {
    id: 'stahl',
    name: 'Betonstahl B500B (100% Recycling)',
    manufacturer: 'EcoSteel AG',
    validUntil: '2027-06-30',
    deklarationsnummer: 'EPD-ECO-20220610-IBA1-DE',
    einheit: '1 t',
    phasen: {
      a1a3: { name: 'Herstellung (A1-A3)', gwp: 450.0, penrt: 4200.0, ap: 1.2, ep: 0.3 },
      a4: { name: 'Transport (A4)', gwp: 25.0, penrt: 350.0, ap: 0.1, ep: 0.03 },
      c3: { name: 'Abfallbehandlung (C3)', gwp: 5.0, penrt: 80.0, ap: 0.02, ep: 0.01 },
      d: { name: 'Recyclingpotenzial (D)', gwp: -300.0, penrt: -2800.0, ap: -0.8, ep: -0.2 }
    }
  },
  {
    id: 'holz',
    name: 'Brettschichtholz (BSH)',
    manufacturer: 'WoodBuild GmbH',
    validUntil: '2029-03-15',
    deklarationsnummer: 'EPD-WBG-20240315-IBA1-DE',
    einheit: '1 m³',
    phasen: {
      a1a3: { name: 'Herstellung (A1-A3)', gwp: -750.0, penrt: 3100.0, ap: 0.8, ep: 0.25 },
      a4: { name: 'Transport (A4)', gwp: 35.0, penrt: 480.0, ap: 0.15, ep: 0.04 },
      c3: { name: 'Abfallbehandlung (C3)', gwp: 820.0, penrt: 150.0, ap: 0.1, ep: 0.05 },
      d: { name: 'Recyclingpotenzial (D)', gwp: -450.0, penrt: -4200.0, ap: -0.6, ep: -0.15 }
    }
  }
];

interface DppEpdProps {
  view?: 'dpp' | 'epd';
}

export default function DppEpd({ view }: DppEpdProps = {}) {
  const [localTab, setLocalTab] = useState<'dpp' | 'epd'>('dpp');
  const [activeDetailSection, setActiveDetailSection] = useState<string>('grundlagen');
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState(EPD_DATA[0].id);

  // Advanced Scanner states
  const [webcamActive, setWebcamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hudMessage, setHudMessage] = useState('BEREIT FÜR SCAN');
  const [hudCoordinates, setHudCoordinates] = useState({ x: 50, y: 50 });
  const videoRef = useRef<HTMLVideoElement>(null);

  // High-fidelity synthesized sound effects for micro-interactions
  const playBeep = (type: 'success' | 'scan') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.13);
      } else if (type === 'scan') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(380, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      }
    } catch (e) {
      // AudioContext blocked or unsupported
    }
  };

  // Sync real-time camera feed based on active state
  useEffect(() => {
    if (webcamActive) {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => {
      stopWebcam();
    };
  }, [webcamActive]);

  const startWebcam = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log("Video playback exception", e));
      }
    } catch (err: any) {
      console.warn("Camera hardware access rejected or restricted in iframe:", err);
      setCameraError("Zugriff blockiert (oder iFrame Sandbox Einschränkung)");
      setWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleScan = (id: string) => {
    if (isScanning) return;
    setIsScanning(true);
    setScannedId(null);
    setHudMessage('REICHWEITE PRÜFEN...');
    playBeep('scan');

    // Dynamic random coordinate movements to simulate computer-vision autofocus
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setHudCoordinates({
        x: Math.round(35 + Math.random() * 30),
        y: Math.round(35 + Math.random() * 30)
      });
      if (step === 2) setHudMessage('KALIBRIERUNG...');
      if (step === 4) setHudMessage('AUSLESEN (UID)...');
      if (step === 6) setHudMessage('DECODIERUNG...');
    }, 180);

    setTimeout(() => {
      clearInterval(interval);
      setScannedId(id);
      setIsScanning(false);
      setHudMessage('PASS-UID ENTSCHLÜSSELT');
      setHudCoordinates({ x: 50, y: 50 });
      playBeep('success');
    }, 1300);
  };

  const product = scannedId ? DPP_MOCK_DATA[scannedId as keyof typeof DPP_MOCK_DATA] : null;
  const selectedEpd = EPD_DATA.find(e => e.id === activeMaterial) || EPD_DATA[0];
  const displayTab = view || localTab;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        
        {/* Dynamic Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz animate-pulse">
            {displayTab === 'dpp' ? <QrCode size={24} /> : <FileText size={24} />}
          </div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              {displayTab === 'dpp' ? 'Digitaler Produktpass (DPP)' : 'Umweltproduktdeklaration (EPD)'}
            </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            {displayTab === 'dpp' 
                ? 'Zentrales Instrument der EU-Ökodesign-Verordnung (ESPR) für lückenlose Materialtransparenz.' 
                : 'Zertifizierter Konformitätsnachweis der Umweltwirkungen von Baustoffen über alle Lebenszyklusphasen.'}
          </p>
        </div>
        </div>

        {/* Local Tab Fallback Selector - only visible if view is not passed from outer component */}
        {!view && (
          <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
            <button
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                localTab === 'dpp' 
                  ? 'bg-shiraz text-white border-shiraz shadow-md' 
                  : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
              }`}
              onClick={() => setLocalTab('dpp')}
            >
              <QrCode size={16} /> Digitaler Produktpass (DPP)
            </button>
            <button
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                localTab === 'epd' 
                  ? 'bg-shiraz text-white border-shiraz shadow-md' 
                  : 'bg-white text-slate-500 border-home-grau/30 hover:bg-off-white hover:text-slate-900'
              }`}
              onClick={() => setLocalTab('epd')}
            >
              <FileText size={16} /> Umweltproduktdeklaration (EPD)
            </button>
          </div>
        )}

        {displayTab === 'dpp' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Split screen: Academic Guide vs Interactive Scanner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Academic Guide (Detailed Sections) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                <div className="text-sm text-slate-705 bg-slate-50 p-4 rounded-xl border border-home-grau/30 leading-relaxed">
                  Der <strong>Digitale Produktpass (DPP)</strong> ist ein zentrales Instrument der EU-Ökodesign-Verordnung (ESPR). Er speichert produktspezifische Daten über den gesamten Lebenszyklus hinweg, um Transparenz, Rückverfolgbarkeit und die Kreislaufwirtschaft (Circular Economy) im Bauwesen nachhaltig zu fördern.
                </div>

                {/* Subsections Selectors */}
                <div className="flex border-b border-home-grau/30 overflow-x-auto gap-2 scrollbar-none">
                  {[
                    { id: 'grundlagen', label: '1. Grundlagen', icon: BookOpen },
                    { id: 'umsetzung', label: '2. Umsetzung', icon: Wrench },
                    { id: 'inhalte', label: '3. Inhalte (BOM)', icon: Database },
                    { id: 'zeitschiene', label: '4. Zeitschiene', icon: Clock },
                    { id: 'verpflichtung', label: '5. Verpflichtung', icon: Scale },
                  ].map((sec) => {
                    const IconComp = sec.icon;
                    const isSelected = activeDetailSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setActiveDetailSection(sec.id)}
                        className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 border-t border-x hover:bg-slate-50 ${
                          isSelected
                            ? 'bg-shiraz text-white border-shiraz font-bold -mb-[1px]'
                            : 'bg-white text-slate-500 border-gray-200'
                        }`}
                      >
                        <IconComp size={12} />
                        <span>{sec.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Subsection Panel */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-home-grau/30 shadow-inner min-h-[350px] flex flex-col justify-between">
                  {activeDetailSection === 'grundlagen' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <h4 className="font-bold text-base text-slate-900">1. Wissenschaftliche Grundlagen &amp; Ziele</h4>
                        <p className="text-xs text-slate-500 mt-0.5">EU Ecodesign for Sustainable Products Regulation (ESPR)</p>
                      </div>
                      <p className="text-sm text-slate-705 leading-relaxed font-normal">
                        Die Grundlagen des DPP basieren auf der Erkenntnis, dass zirkuläre Materialströme am Fehlen standardisierter, herstellerübergreifender und maschinenlesbarer Produktinformationen scheitern. Durch die Beseitigung dieser Informationsasymmetrien wird der gesamte Lebenszyklus eines Bauprodukts transparent nachvollziehbar gemacht.
                      </p>
                      
                      {/* Rechtliche Gültigkeit: BauPVO, hEN, ETA */}
                      <div className="bg-shiraz/5 border border-shiraz/10 p-4 rounded-xl space-y-2">
                        <span className="text-xs font-bold text-shiraz block uppercase tracking-wide">Gültigkeit &amp; Rechtlicher Rahmen</span>
                        <p className="text-xs text-slate-800 leading-relaxed font-normal">
                          Im Baubereich wird der Digitale Produktpass über die neue <strong>Bauprodukteverordnung (EU) 2024/3110</strong> eingeführt (in Kraft seit 07.01.2025, anwendbar seit 08.01.2026). Er wird verpflichtend, sobald dies für die jeweilige Produktfamilie festgelegt ist, und betrifft:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-normal">
                          <div className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                            <strong className="text-shiraz block mb-0.5 font-bold">Harmonisierte Normen (hEN)</strong>
                            <span>Produkte mit harmonisierter technischer Spezifikation, sobald diese und ein delegierter Rechtsakt den DPP vorsehen; er begleitet die Leistungs- und Konformitätserklärung.</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                            <strong className="text-shiraz block mb-0.5 font-bold">Techn. Bewertungen (ETA)</strong>
                            <span>Auch Produkte mit Europäischer Technischer Bewertung (ETA) können einbezogen werden; der DPP ersetzt die Konformitätsbewertung nicht, sondern stellt deren Informationen digital bereit.</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-normal">
                        <div className="bg-white p-3 rounded-xl border border-home-grau/30">
                          <strong className="text-xs text-shiraz block font-bold">Informationssymmetrie</strong>
                          <span className="text-[11px] text-slate-500 leading-relaxed">Lückenlose Transparenz für alle Akteure über Schadstoffe, Primärrohstoffe und Treibhauspotenziale.</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-home-grau/30">
                          <strong className="text-xs text-shiraz block font-bold">Zirkuläre Optimierung</strong>
                          <span className="text-[11px] text-slate-500 leading-relaxed">Entscheidungen zur Wiederverwendung und zum Recycling beruhen auf präzise dokumentierten Fakten statt auf Schätzungen.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailSection === 'umsetzung' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <h4 className="font-bold text-base text-slate-900">2. Technische Umsetzung &amp; Standardisierung</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Identifikatoren, Schnittstellen und Datenstrukturen</p>
                      </div>
                      <p className="text-sm text-slate-705 leading-relaxed font-normal">
                        Die Umsetzung des DPP erfordert eine dezentrale und hochgradig standardisierte IT-Architektur. Es wird <strong>keine</strong> zentrale EU-Datenbank geben, die alle Produktdetails speichert. Stattdessen verbleiben die Daten dezentral beim Hersteller und sind über APIs abrufbar:
                      </p>
                      <ul className="text-xs sm:text-sm text-slate-705 space-y-2 list-none pl-0 font-normal">
                        <li className="flex gap-2 items-start leading-relaxed">
                          <span className="text-shiraz font-bold shrink-0">■</span>
                          <span><strong>M2M-Interoperabilität:</strong> Datenablage strukturiert nach dem concept der <strong>Asset Administration Shell (AAS / Verwaltungsschale)</strong> gemäß DIN EN IEC 63278.</span>
                        </li>
                        <li className="flex gap-2 items-start leading-relaxed">
                          <span className="text-shiraz font-bold shrink-0">■</span>
                          <span><strong>Eindeutige Identifikation:</strong> Verwendung standardisierter Barcodes und Links (z. B. GS1 Digital Link) gekoppelt an GTIN- und UID-Schlüssel für jedes einzelne verbaute Element.</span>
                        </li>
                        <li className="flex gap-2 items-start leading-relaxed">
                          <span className="text-shiraz font-bold shrink-0">■</span>
                          <span><strong>BIM-Integration:</strong> Direkte maschinelle Verknüpfung der Produktdatenblätter (Product Data Templates - PDT) mit den BIM-Gebäudemodellen über offene Dateiformate wie IFC.</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {activeDetailSection === 'inhalte' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <h4 className="font-bold text-base text-slate-900">3. Zu dokumentierende Inhalte (Datenfelder)</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Bill of Materials (BOM) &amp; Schadstoff-Screening</p>
                      </div>
                      <p className="text-sm text-slate-705 leading-relaxed font-normal">
                        Ein normkonformer Digitaler Produktpass stellt Datenfelder für unterschiedliche Lebenszyklusphasen und Akteure rollenbasiert bereit:
                      </p>
                      <div className="bg-white rounded-xl border border-home-grau/30 overflow-hidden text-xs font-normal">
                        <div className="grid grid-cols-12 gap-1.5 p-2 bg-slate-100/70 border-b border-home-grau/30 font-bold">
                          <span className="col-span-4">Kategorie</span>
                          <span className="col-span-8">Typische Kennwerte / Parameter</span>
                        </div>
                        <div className="p-2 grid grid-cols-12 gap-1.5 border-b border-home-grau/30">
                          <span className="col-span-4 font-bold text-shiraz">Allgemeines</span>
                          <span className="col-span-8 text-slate-705">Herstellerdaten, Herstellungsort, Charge, UID/UPI, Herstellungsdatum, CE-Zeichen, Leistungserklärung.</span>
                        </div>
                        <div className="p-2 grid grid-cols-12 gap-1.5 border-b border-home-grau/30">
                          <span className="col-span-4 font-bold text-shiraz">Stückliste (BOM)</span>
                          <span className="col-span-8 text-slate-705">Chemische Hauptbestandteile, Recycling-Anteile (Pre- &amp; Post-Consumer), REACH-Schadstoffdeklarationen.</span>
                        </div>
                        <div className="p-2 grid grid-cols-12 gap-1.5 border-b border-home-grau/30">
                          <span className="col-span-4 font-bold text-shiraz">Umweltdaten</span>
                          <span className="col-span-8 text-slate-705">Verweistabelle auf EPD-Kennwerte (Treibhauspotenzial GWP, nicht-erneuerbare Primärenergie PENRT).</span>
                        </div>
                        <div className="p-2 grid grid-cols-12 gap-1.5">
                          <span className="col-span-4 font-bold text-shiraz">Rückbau</span>
                          <span className="col-span-8 text-slate-705">Leitfäden zur zerstörungsfreien Demontage, sortenreinen Materialtrennbarkeit und Entsorgungshinweise.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailSection === 'zeitschiene' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <h4 className="font-bold text-base text-slate-900">4. Zeitschiene zur stufenweisen Einführung</h4>
                        <p className="text-xs text-slate-500 mt-0.5">EU-weite Implementierungsstufen der ESPR und CPR</p>
                      </div>
                      <p className="text-sm text-slate-705 leading-relaxed font-normal">
                        Die schrittweise Einführung des Digitalen Produktpasses im Bauwesen erfolgt eng verzahnt mit der europäischen Bauprodukteverordnung (CPR):
                      </p>
                      <div className="relative pl-6 border-l-2 border-shiraz/35 space-y-4 pt-1 font-normal">
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-shiraz border-2 border-white" />
                          <div className="text-xs font-bold text-shiraz">18.07.2024 (Inkrafttreten)</div>
                          <div className="text-xs text-slate-705 leading-relaxed">Inkrafttreten der Ökodesign-Verordnung (EU) 2024/1781 (ESPR, erlassen am 13.06.2024). Konkrete DPP-Pflichten folgen erst über produktgruppenspezifische delegierte Rechtsakte.</div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-shiraz border-2 border-white" />
                          <div className="text-xs font-bold text-shiraz">2025 bis 2027 (Arbeitsplan und Grundlagen)</div>
                          <div className="text-xs text-slate-705 leading-relaxed font-normal">ESPR-Arbeitsplan 2025–2030 (16.04.2025) mit Prioritäten u. a. Eisen/Stahl, Aluminium, Textilien, Möbel, Reifen, Matratzen; DPP-Register (Durchführungsverordnung 2026); Batteriepass nach Verordnung (EU) 2023/1542 ab 18.02.2027.</div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-shiraz border-2 border-white" />
                          <div className="text-xs font-bold text-shiraz">Ab 08.01.2026 (neue BauPVO)</div>
                          <div className="text-xs text-slate-705 leading-relaxed font-normal">Die Bauprodukteverordnung (EU) 2024/3110 gilt seit 08.01.2026. Ein DPP für Bauprodukte wird je Produktfamilie über delegierte Rechtsakte und neue harmonisierte technische Spezifikationen verpflichtend; feste Termine stehen noch nicht fest.</div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-gray-600 border-2 border-white" />
                          <div className="text-xs font-bold text-gray-600">Bis etwa 2040 (Übergang)</div>
                          <div className="text-xs text-slate-705 leading-relaxed">Schrittweiser Übergang aller Produktfamilien in das neue System; bis dahin gelten für bestehende harmonisierte Normen Übergangsregeln (Einzelheiten und Fristen manuell prüfen).</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailSection === 'verpflichtung' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <h4 className="font-bold text-base text-slate-900">5. Gesetzliche Verpflichtungen &amp; Akteureskreis</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Wer ist wann zu welchen Maßnahmen rechtlich verpflichtet?</p>
                      </div>
                      <p className="text-sm text-slate-705 leading-relaxed font-normal">
                        Die Einführung des DPP bringt weitreichende rechtliche Pflichten für alle baubeteiligten Personengruppen mit sich:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-normal">
                        <div className="bg-white p-3 rounded-xl border border-home-grau/30">
                          <strong className="text-shiraz block font-bold mb-1">Herstellung &amp; Vertrieb</strong>
                          <span>Verpflichtet zur Bereitstellung der Datenstrukturen und Anbringung unzerstörbarer Datenträger. Ohne DPP verliert das Produkt seine Verkehrs- und CE-Zulassung.</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-home-grau/30">
                          <strong className="text-shiraz block font-bold mb-1">Planung &amp; Entsorgung</strong>
                          <span>Planer müssen DPP-Werte (z.B. Recyclinganteile) für Gebäuderessourcenpässe konsolidieren. Entsorger scannen Bauteile für schadstofffreie Sortierungen.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Little expert hint at bottom */}
                  <div className="mt-4 pt-4 border-t border-home-grau/30 flex items-center gap-2 text-[11px] text-slate-500 font-normal">
                    <Activity size={13} className="text-shiraz shrink-0" />
                    <span>Expertentipp: DPP-Daten fließen direkt in den Gebäuderessourcenpass (Madaster) ein und sind hochgradig DGNB/QNG-relevant.</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive Scanner Mockup (5-cols) */}
              <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-sm bg-gray-900 rounded-[3rem] p-4 shadow-xl relative border-8 border-gray-800">
                  {/* Speaker slot / Camera notch at the top */}
                  <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-xl mx-24 z-20 flex items-center justify-center">
                    <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                  
                  {/* Screen */}
                  <div className="w-full h-[525px] bg-slate-950 rounded-2xl overflow-hidden flex flex-col relative text-white border border-home-grau/30">
                    
                    {/* Status bar */}
                    <div className="h-6 bg-slate-900 px-4 flex justify-between items-center text-[10px] text-slate-400 font-mono z-10 shrink-0 select-none">
                      <span>12:00</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] bg-slate-800 px-1 py-0.5 rounded text-emerald-400 font-bold border border-home-grau/30">LTE</span>
                        <span>100%🔋</span>
                      </div>
                    </div>

                    {/* Scanner Viewfinder Area (Half Screen) */}
                    <div className="h-[210px] bg-black relative overflow-hidden flex items-center justify-center shrink-0 border-b border-home-grau/30">
                      {webcamActive ? (
                        <>
                          <video 
                            ref={videoRef} 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover" 
                          />
                          {/* Green scanning frame */}
                          <div className="absolute inset-8 border-2 border-emerald-500 rounded-lg pointer-events-none transition-all duration-300">
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-400 rounded-tl animate-pulse"></div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-400 rounded-tr animate-pulse"></div>
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-400 rounded-bl animate-pulse"></div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-400 rounded-br animate-pulse"></div>
                          </div>
                        </>
                      ) : (
                        /* Simulated Holographic Camera Dashboard Feed */
                        <div className="w-full h-full relative flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-black select-none z-0">
                          {/* Grid matrix overlay */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.45)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-50"></div>
                          
                          {/* Spinning crosshairs */}
                          <div className="absolute w-36 h-36 rounded-full border border-dashed border-shiraz/20 animate-spin" style={{ animationDuration: '24s' }}></div>
                          <div className="absolute w-28 h-28 rounded-full border border-shiraz/10 animate-pulse"></div>

                          {/* Dynamic target tracking boxes */}
                          <div 
                            className="absolute border-2 border-shiraz/60 w-16 h-16 rounded transition-all duration-300 pointer-events-none flex items-center justify-center"
                            style={{ 
                              left: `calc(${hudCoordinates.x}% - 32px)`, 
                              top: `calc(${hudCoordinates.y}% - 32px)` 
                            }}
                          >
                            <div className="absolute top-0 left-0 w-2 h-2 bg-shiraz"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 bg-shiraz"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 bg-shiraz"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-shiraz"></div>
                            <span className="text-[7px] text-shiraz font-bold font-mono tracking-widest absolute -bottom-4 bg-slate-950/90 px-1 py-0.5 rounded border border-shiraz/35 shadow">
                              LOCK_{formatDeWert(hudCoordinates.x)}_{formatDeWert(hudCoordinates.y)}
                            </span>
                          </div>

                          {/* Centered camera scanner target status */}
                          <div className="text-slate-600 flex flex-col items-center gap-1 z-10 pointer-events-none">
                            <QrCode size={40} className={`text-shiraz/45 ${isScanning ? 'scale-110 opacity-100' : 'opacity-65 transition-all duration-300'}`} />
                            <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400">Scanner aktiv</span>
                          </div>

                          {/* Sci-fi overlay HUD parameter display */}
                          <div className="absolute top-2 left-3 font-mono text-[8px] text-slate-400 space-y-0.5 leading-none bg-slate-950/85 p-1.5 rounded border border-home-grau/30 z-10">
                            <div>CAMERA: SIMULATOR</div>
                            <div>STATE: <span className="text-shiraz font-bold">{hudMessage}</span></div>
                            <div>RESOLUTION: 1080P</div>
                          </div>

                          <div className="absolute top-2 right-3 font-mono text-[8px] text-slate-400 p-1.5 bg-slate-950/85 rounded border border-home-grau/30 z-10 leading-none">
                            FPS: <span className="text-emerald-500 font-bold">60,00</span>
                          </div>
                        </div>
                      )}

                      {/* Moving laser scan line overlay */}
                      {isScanning && (
                        <div className="absolute inset-x-0 h-1 bg-shiraz shadow-[0_0_12px_#A3113E] z-20 animate-pulse border-b border-shiraz/60" style={{ top: '50%' }}></div>
                      )}

                      {/* White flashing transition on barcode scan success */}
                      {scannedId && !isScanning && (
                        <div className="absolute inset-0 bg-white/70 animate-ping pointer-events-none" style={{ animationIterationCount: 1, animationDuration: '0.4s' }}></div>
                      )}
                    </div>

                    {/* Hardware Control panel */}
                    <div className="bg-slate-900 border-b border-home-grau/30 p-2 px-3 flex items-center justify-between text-xs shrink-0 font-normal select-none">
                      <div className="flex gap-2">
                        {/* Audio Toggle */}
                        <button
                          type="button"
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            soundEnabled 
                              ? 'bg-slate-850 border-home-grau/30 text-slate-200 hover:text-white' 
                              : 'bg-slate-950 border-home-grau/30 text-slate-500 hover:text-slate-400'
                          }`}
                          title="Töne an/aus"
                        >
                          <Volume2 size={13} className={!soundEnabled ? 'line-through opacity-70' : ''} />
                        </button>

                        {/* Webcam Toggle */}
                        <button
                          type="button"
                          onClick={() => setWebcamActive(!webcamActive)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                            webcamActive 
                              ? 'bg-shiraz border-shiraz text-white hover:bg-shiraz/90 shadow-sm' 
                              : 'bg-slate-850 border-home-grau/30 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <Camera size={11} />
                          {webcamActive ? 'Kamera Stoppen' : 'Echte Webcam'}
                        </button>
                      </div>

                      {scannedId && (
                        <button
                          type="button"
                          onClick={() => {
                            setScannedId(null);
                            setHudMessage('BEREIT FÜR SCAN');
                          }}
                          className="text-[9.5px] text-shiraz hover:underline flex items-center gap-1 font-bold"
                        >
                          <RefreshCw size={10} /> Zurücksetzen
                        </button>
                      )}
                    </div>

                    {/* Camera error description overlay block */}
                    {cameraError && webcamActive && (
                      <div className="bg-amber-950/95 border-b border-amber-850 p-2 px-3 text-[9.5px] text-amber-200 flex items-center gap-1.5 leading-tight shrink-0">
                        <AlertCircle size={11} className="text-amber-400 shrink-0" />
                        <span>{cameraError}. Verwenden Sie Simulator.</span>
                      </div>
                    )}

                    {/* Lower half of physical phone screen: List of Scannable barcoded assets */}
                    <div className="flex-1 p-3 bg-white flex flex-col gap-2 overflow-y-auto scrollbar-none">
                      <h4 className="font-bold text-center text-[11px] text-slate-500 uppercase tracking-widest mt-0.5 select-none">Scannbare Bauteile</h4>
                      <p className="text-[10px] text-slate-400 text-center -mt-1 leading-snug font-normal select-none">Wählen Sie eines der vorpräparierten Bauteile, um den Scan-Vorgang auszuführen:</p>
                      
                      {/* Interactive Button Elements */}
                      <button 
                        type="button"
                        onClick={() => handleScan('uid-1234-beton')}
                        disabled={isScanning}
                        className={`w-full bg-white border p-2.5 rounded-xl transition-all flex items-center gap-2.5 text-left border-home-grau/30 hover:border-shiraz/50 hover:shadow-md ${isScanning ? 'opacity-55 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                      >
                        <div className="p-1.5 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-600 relative group-hover:scale-105 transition-transform shrink-0">
                          <QrCode size={22} className="text-slate-500" />
                          <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-xs text-slate-800 block truncate">Stahlbetonstütze C35/45</span>
                          <span className="text-[9px] text-slate-400 block font-normal truncate">Precast Solutions GmbH • ID: 1234-BETON</span>
                        </div>
                      </button>

                      <button 
                        type="button"
                        onClick={() => handleScan('uid-5678-holz')}
                        disabled={isScanning}
                        className={`w-full bg-white border p-2.5 rounded-xl transition-all flex items-center gap-2.5 text-left border-home-grau/30 hover:border-shiraz/50 hover:shadow-md ${isScanning ? 'opacity-55 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                      >
                        <div className="p-1.5 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-600 relative group-hover:scale-105 transition-transform shrink-0">
                          <QrCode size={22} className="text-slate-500" />
                          <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-xs text-slate-800 block truncate">Brettschichtholz-Träger</span>
                          <span className="text-[9px] text-slate-400 block font-normal truncate">WoodBuild AG • ID: 5678-HOLZ</span>
                        </div>
                      </button>

                      {/* Instruction text helper */}
                      <div className="text-[8px] text-slate-400 leading-normal text-center bg-slate-50 p-1.5 rounded-lg border border-home-grau/30 font-normal mt-1 select-none">
                        🔒 Integrierte Daten-Audits nach <strong>DIN SPEC 91484</strong> &amp; <strong>91525</strong> standardgerechter Validierung.
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              
            </div>

            {/* Simulated Database Output below the vertical split */}
            <div className="mt-4 border-t border-home-grau/30 pt-6">
              {product ? (
                <div className="bg-slate-50 border border-home-grau/30 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-start mb-6 border-b border-home-grau/30 pb-4">
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">{product.name}</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Eindeutige ID (UID): {scannedId}
          </p>
        </div>
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck size={14} className="text-emerald-600" /> Verifiziert &amp; Aktiv
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex gap-3 bg-white p-3 rounded-xl border border-home-grau/30 items-center">
                      <Factory className="text-shiraz shrink-0" size={18} />
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-900/55 uppercase tracking-wider">Hersteller</h4>
                        <p className="font-bold text-sm text-slate-900">{product.manufacturer}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 bg-white p-3 rounded-xl border border-home-grau/30 items-center">
                      <MapPin className="text-shiraz shrink-0" size={18} />
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-900/55 uppercase tracking-wider">Produktionsort</h4>
                        <p className="font-bold text-sm text-slate-900">{product.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 bg-white p-3 rounded-xl border border-home-grau/30 items-center">
                      <Database className="text-shiraz shrink-0" size={18} />
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-900/55 uppercase tracking-wider">Charge / Abnahme</h4>
                        <p className="font-bold text-sm text-slate-900">{product.batchId} ({product.productionDate})</p>
                      </div>
                    </div>
                    <div className="flex gap-3 bg-white p-3 rounded-xl border border-home-grau/30 items-center">
                      <Leaf className="text-shiraz shrink-0" size={18} />
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-900/55 uppercase tracking-wider">CO₂-Fußabdruck</h4>
                        <p className="font-bold text-sm text-slate-900">{product.carbonFootprint}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2 border-b border-home-grau/30 pb-1.5">
                      <FileText size={15} className="text-shiraz" /> Materialzusammensetzung (BOM - Bill of Materials)
                    </h4>
                    <div className="bg-white rounded-xl border border-home-grau/30 overflow-hidden font-normal">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="py-2 px-3 font-bold text-slate-900 border-b border-home-grau/30">Komponente / Werkstoff</th>
                            <th className="py-2 px-3 font-bold text-slate-900 border-b border-home-grau/30">Massenanteil</th>
                            <th className="py-2 px-3 font-bold text-slate-900 border-b border-home-grau/30">Recyclinganteil (Sekundär)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.materials.map((mat, idx) => (
                            <tr key={idx} className="border-t border-home-grau/30 hover:bg-slate-50/40">
                              <td className="py-2 px-3">{mat.name}</td>
                              <td className="py-2 px-3 font-mono text-gray-700">{mat.amount}</td>
                              <td className="py-2 px-3 font-mono text-emerald-600 font-bold">{mat.recycledContent}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2 border-b border-home-grau/30 pb-1.5">
                      <Recycle size={15} className="text-shiraz" /> Zirkularität, Demontage- &amp; Recyclinganleitung
                    </h4>
                    <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-normal">
                      <div className="space-y-1 text-xs font-normal">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-blue-900">Konstruktiv geplante Recyclingfähigkeit:</span>
                          <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded text-[10px] font-bold">{product.circularity.recyclability}</span>
                        </div>
                        <p className="text-blue-800 leading-relaxed text-[11px] sm:text-xs">{product.circularity.instructions}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2 border-b border-home-grau/30 pb-1.5">
                      <ShieldCheck size={15} className="text-shiraz" /> Integrierte Konformitätsnachweise &amp; Deklarationen
                    </h4>
                    <div className="flex flex-wrap gap-2 pt-1 font-normal">
                      {product.compliance.map((cert, idx) => (
                        <span key={idx} className="bg-white border border-home-grau/30 px-2.5 py-1 rounded-full text-xs font-medium text-slate-900 shadow-sm flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="h-full min-h-[160px] border-2 border-dashed border-home-grau/30 rounded-2xl flex flex-col items-center justify-center text-slate-500 p-6 text-center bg-slate-50/50">
                  <Smartphone size={32} className="mb-2 opacity-50 text-shiraz" />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Kein Scanner-Ergebnis geladen</h3>
                  <p className="text-[11px] max-w-md text-slate-500 font-normal">
                    Klicken Sie auf ein Bauteil im Handy-Mockup, um die ausgelesenen Daten des digitalen Bauteilpasses hier anzuzeigen.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {displayTab === 'epd' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-slate-705 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <p>
                Eine <strong>Environmental Product Declaration (EPD)</strong> nach DIN EN 15804 liefert transparente, 
                vergleichbare und überprüfte Informationen über die Umweltleistung von Bauprodukten über ihren Lebenszyklus. 
                Sie bildet die Datengrundlage für die Gebäudeökobilanzierung (LCA).
              </p>
            </div>

            <div className="flex border-b border-home-grau/30 overflow-x-auto scrollbar-none">
              {EPD_DATA.map((epd) => (
                <button
                  key={epd.id}
                  onClick={() => setActiveMaterial(epd.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                    activeMaterial === epd.id 
                      ? 'bg-shiraz text-white shadow-sm' 
                      : 'bg-slate-50 text-slate-500 hover:bg-home-grau/20'
                  }`}
                >
                  {epd.name}
                </button>
              ))}
            </div>

            <div className="border border-home-grau/30 rounded-xl overflow-hidden">
              <div className="bg-home-grau/10 p-4 border-b border-home-grau/30 flex flex-col md:flex-row justify-between gap-4">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">{selectedEpd.name}</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Hersteller: {selectedEpd.manufacturer}
          </p>
        </div>
                <div className="text-sm text-slate-500 flex flex-col md:items-end">
                  <span>Deklarationsnummer: <strong>{selectedEpd.deklarationsnummer}</strong></span>
                  <span>Gültig bis: {selectedEpd.validUntil}</span>
                  <span>Deklarierte Einheit: <strong>{selectedEpd.einheit}</strong></span>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-shiraz" /> 
                  Umweltwirkungen nach Lebenszyklusphasen
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b-2 border-home-grau/30">
                        <th className="py-3 px-2 font-bold text-slate-900">Indikator</th>
                        <th className="py-3 px-2 font-bold text-slate-900 text-right">A1-A3<br/><span className="text-xs font-normal text-slate-500">Herstellung</span></th>
                        <th className="py-3 px-2 font-bold text-slate-900 text-right">A4<br/><span className="text-xs font-normal text-slate-500">Transport</span></th>
                        <th className="py-3 px-2 font-bold text-slate-900 text-right">C3<br/><span className="text-xs font-normal text-slate-500">Abfallbehandlung</span></th>
                        <th className="py-3 px-2 font-bold text-slate-900 text-right">D<br/><span className="text-xs font-normal text-slate-500">Recyclingpotenzial</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-home-grau/30 hover:bg-slate-50">
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-900">GWP <InfoTooltip text="Global Warming Potential (Treibhauspotenzial)" /></div>
                          <div className="text-xs text-slate-500">[kg CO₂-Äqv.]</div>
                        </td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a1a3.gwp, 2)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a4.gwp, 2)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.c3.gwp, 2)}</td>
                        <td className="py-3 px-2 text-right font-mono text-green-600">{formatDeZahl(selectedEpd.phasen.d.gwp, 2)}</td>
                      </tr>
                      <tr className="border-b border-home-grau/30 hover:bg-slate-50">
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-900">PENRT <InfoTooltip text="Primary Energy Non-Renewable Total (Nicht-erneuerbare Primärenergie)" /></div>
                          <div className="text-xs text-slate-500">[MJ]</div>
                        </td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a1a3.penrt, 2)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a4.penrt, 2)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.c3.penrt, 2)}</td>
                        <td className="py-3 px-2 text-right font-mono text-green-600">{formatDeZahl(selectedEpd.phasen.d.penrt, 2)}</td>
                      </tr>
                      <tr className="border-b border-home-grau/30 hover:bg-slate-50">
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-900">AP <InfoTooltip text="Acidification Potential (Versauerungspotenzial von Boden und Wasser)" /></div>
                          <div className="text-xs text-slate-500">[kg SO₂-Äqv.]</div>
                        </td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a1a3.ap, 3)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a4.ap, 3)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.c3.ap, 3)}</td>
                        <td className="py-3 px-2 text-right font-mono text-green-600">{formatDeZahl(selectedEpd.phasen.d.ap, 3)}</td>
                      </tr>
                      <tr className="border-b border-home-grau/30 hover:bg-slate-50">
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-900">EP <InfoTooltip text="Eutrophication Potential (Eutrophierungspotenzial / Überdüngung)" /></div>
                          <div className="text-xs text-slate-500">[kg PO₄³⁻-Äqv.]</div>
                        </td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a1a3.ep, 3)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a4.ep, 3)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.c3.ep, 3)}</td>
                        <td className="py-3 px-2 text-right font-mono text-green-600">{formatDeZahl(selectedEpd.phasen.d.ep, 3)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center text-center gap-2">
                <Factory className="text-blue-600" size={24} />
                <h5 className="font-bold text-blue-900 text-sm">A1-A3</h5>
                <p className="text-xs text-blue-800/80">Rohstoffgewinnung, Transport zum Werk, Herstellung</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex flex-col items-center text-center gap-2">
                <Truck className="text-orange-600" size={24} />
                <h5 className="font-bold text-orange-900 text-sm">A4-A5</h5>
                <p className="text-xs text-orange-800/80">Transport zur Baustelle, Einbau/Errichtung</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center text-center gap-2">
                <Activity className="text-gray-600" size={24} />
                <h5 className="font-bold text-gray-900 text-sm">B & C</h5>
                <p className="text-xs text-gray-800/80">Nutzung (Instandhaltung) & Entsorgung (Rückbau, Abfall)</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center text-center gap-2">
                <Recycle className="text-green-600" size={24} />
                <h5 className="font-bold text-green-900 text-sm">Modul D</h5>
                <p className="text-xs text-green-800/80">Gutschriften und Lasten außerhalb der Systemgrenze (Recycling)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Deklarierte Module einer EPD richtig zusammenfassen"
        zielGleichung="GWP_{A\text{–}C} = GWP_{A1\text{–}A3} + GWP_{C3} + GWP_{C4}, \quad D \text{ getrennt}"
        schritte={[
          { titel: 'Herstellung', erklaerung: 'EPD eines Betonfertigteils je m³:', formel: 'GWP_{A1\\text{–}A3} = 250\\,\\text{kg CO}_2\\text{e}' },
          { titel: 'Entsorgung', erklaerung: 'Abfallbehandlung C3 = 5, Beseitigung C4 = 2:', formel: 'GWP_{A\\text{–}C} = 250 + 5 + 2 = 257\\,\\text{kg CO}_2\\text{e}' },
          { titel: 'Modul D', erklaerung: 'Gutschrift für Recycling außerhalb der Systemgrenze:', formel: 'D = -30\\,\\text{kg CO}_2\\text{e (separat ausweisen)}' }
        ]}
        ergebnisHinweis="Nach EN 15804+A2 sind die Module C1–C4 und D bei den meisten Produkten zu deklarieren; Modul D wird nicht mit A–C saldiert, sondern daneben angegeben."
        normQuelle="DIN EN 15804:2022-03"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Primärenergie – energetisch und stofflich"
        zielGleichung="PENRT = PENRE + PENRM"
        schritte={[
          { titel: 'Energetisch', erklaerung: 'Nicht erneuerbare Primärenergie als Energieträger:', formel: 'PENRE = 1\\,800\\,\\text{MJ}' },
          { titel: 'Stofflich', erklaerung: 'Im Produkt gebundene nicht erneuerbare Rohstoffe (z. B. Erdöl in Kunststoff):', formel: 'PENRM = 200\\,\\text{MJ}' },
          { titel: 'Summe', erklaerung: 'Gesamter nicht erneuerbarer Primärenergieeinsatz:', formel: 'PENRT = 2\\,000\\,\\text{MJ}' }
        ]}
        ergebnisHinweis="Bei der Verbrennung am Lebensende wird PENRM als Energie frei – deshalb wird der stoffliche Anteil getrennt ausgewiesen."
        normQuelle="DIN EN 15804:2022-03"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="dpp" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 13 Digitales: ESPR 2024/1781, BauPVO 2024/3110, DPP-Zeitplan, EN 15804+A2 geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Umweltproduktdeklaration', url: 'https://de.wikipedia.org/wiki/Environmental_Product_Declaration' },
          { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' },
          { title: 'Treibhauspotenzial', url: 'https://de.wikipedia.org/wiki/Treibhauspotenzial' }
        ]}
        literatur={[
          'König, H.; Kohler, N.; Kreißig, J.; Lützkendorf, T.: Lebenszyklusanalyse in der Gebäudeplanung. München: Detail 2009',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'IBU (Institut Bauen und Umwelt e.V.): Allgemeine Programmanleitung für EPDs'
        ]}
        regelwerke={[
          { title: 'DIN EN 15804:2022-03 (Umweltproduktdeklarationen – Grundregeln für die Produktkategorie Bauprodukte)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15804' },
          { title: 'DIN EN ISO 14040 / 14044 (Umweltmanagement - Ökobilanz - Grundsätze und Rahmenbedingungen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+14040' },
          { title: 'Verordnung (EU) 2024/1781 (Ökodesign, ESPR) und Verordnung (EU) 2024/3110 (Bauprodukteverordnung)', url: 'https://eur-lex.europa.eu/' },
          { title: 'DIN EN ISO 14025 (Umweltkennzeichnungen und -deklarationen - Typ III Umweltdeklarationen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+14025' }
        ]}
        formeln={[
          {
            formel: '\\text{GWP}_{100} = \\sum_{i} m_i \\cdot \\text{GWP}_{i} \\quad [\\text{kg CO}_2\\text{-Äquiv.}]',
            erklaerung: 'Global Warming Potential (Treibhauspotenzial): Summe der emittierten Massen mi multipliziert mit ihrem jeweiligen Treibhausfaktor bezogen auf CO2 über einen Betrachtungshorizont von 100 Jahren (z. B. nach IPCC AR5 ohne Klima-Kohlenstoff-Rückkopplung CH4 = 28, N2O = 265; die nach EN 15804+A2 verwendeten EF-Faktoren weichen davon ab – Werte am EF-Referenzpaket prüfen).',
            quelle: 'DIN EN 15804 / IPCC'
          },
          {
            formel: '\\text{PENRT} = \\text{PENRE} + \\text{PENRM} \\quad [\\text{MJ}]',
            erklaerung: 'Total nicht erneuerbare Primärenergie (Total Non-Renewable Primary Energy): Summe aus energetisch genutzter (PENRE) und stofflich gebundener (PENRM) Primärenergie.',
            quelle: 'DIN EN 15804 Tabelle 4'
          }
        ]}
      />
    </div>
  );
} 