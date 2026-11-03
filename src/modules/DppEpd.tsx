import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Smartphone, Database, ShieldCheck, Recycle, FileText, MapPin, Factory, Leaf, Truck, Activity, BookOpen, Wrench, Clock, Scale, CheckCircle2, Camera, RefreshCw, Volume2, AlertCircle } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import inhalt from '@/content/dppepd/DppEpd.json';
import { GWP_LEHRWERTE, type GwpLehrwertSchluessel } from '@/src/data/gwpLehrwerte';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

const DPP_MOCK_DATA = inhalt.daten.DPP_MOCK_DATA;

// Muster-EPD (fiktiv): A1–A3 von Beton und BSH aus der gemeinsamen Lehrwerttabelle (Konsistenz 29.10.2026, F-4);
// beim BSH gibt C3 den gespeicherten biogenen Kohlenstoff wieder ab (+ 10 kg CO₂e Aufbereitung, Lehrwert)
const AUS_LEHRWERTTABELLE: Partial<Record<string, GwpLehrwertSchluessel>> = { beton: 'betonC2530CemI', holz: 'bsh' };
const EPD_DATA = inhalt.daten.EPD_DATA.map(e => {
  const s = AUS_LEHRWERTTABELLE[e.id];
  if (!s) return e;
  const w = GWP_LEHRWERTE[s];
  const c3 = w.biogen < 0 ? { ...e.phasen.c3, gwp: -w.biogen + 10 } : e.phasen.c3;
  return { ...e, phasen: { ...e.phasen, a1a3: { ...e.phasen.a1a3, gwp: w.gwp }, c3 } };
});

interface DppEpdProps {
  view?: 'dpp' | 'epd';
}

/** Reiter DPP/EPD; mit vorgegebener Ansicht (Route übergibt view) nur der Inhalt */
function DppReiter({ view, aktiv, onWechsel, children }: { view?: 'dpp' | 'epd'; aktiv: 'dpp' | 'epd'; onWechsel: (id: 'dpp' | 'epd') => void; children: React.ReactNode }) {
  if (view) return <>{children}</>;
  return (
    <ModuleTabs
      label={inhalt.werte.bereicheDppEpd}
      tabs={[
        { id: 'dpp' as const, label: inhalt.werte.digitalerProduktpassDpp, icon: QrCode },
        { id: 'epd' as const, label: inhalt.werte.umweltproduktdeklarationEpd, icon: FileText },
      ]}
      aktiv={aktiv}
      onWechsel={onWechsel}
      className="flex flex-col gap-6"
    >
      {children}
    </ModuleTabs>
  );
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
  const [hudMessage, setHudMessage] = useState(inhalt.werte.bereitFürScan);
  const [hudCoordinates, setHudCoordinates] = useState({ x: 50, y: 50 });
  const videoRef = useRef<HTMLVideoElement>(null);

  // High-fidelity synthesized sound effects for micro-interactions
  const playBeep = (type: 'success' | 'scan') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
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
        // Wiedergabe kann z. B. durch Autoplay-Regeln scheitern: Hinweis im Scanner statt Konsolenausgabe
        videoRef.current.play().catch(() => setCameraError(inhalt.werte.kamerabildKonnteNichtGestartet));
      }
    } catch (err) {
      console.warn("Camera hardware access rejected or restricted in iframe:", err);
      setCameraError(inhalt.werte.zugriffBlockiertOderIframe);
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
    setHudMessage(inhalt.werte.reichweitePrüfen);
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
      if (step === 4) setHudMessage(inhalt.werte.auslesenUid);
      if (step === 6) setHudMessage('DECODIERUNG...');
    }, 180);

    setTimeout(() => {
      clearInterval(interval);
      setScannedId(id);
      setIsScanning(false);
      setHudMessage(inhalt.werte.passUidEntschlüsselt);
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
              {displayTab === 'dpp' ? inhalt.werte.digitalerProduktpassDpp : inhalt.werte.umweltproduktdeklarationEpd}
            </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            {displayTab === 'dpp' 
                ? inhalt.werte.zentralesInstrumentDerEu 
                : inhalt.werte.zertifizierterKonformitätsnachweisDerUmw}
          </p>
        </div>
        </div>

        {/* Reiter nur ohne vorgegebene Ansicht (view) */}
        <DppReiter view={view} aktiv={localTab} onWechsel={setLocalTab}>
        {displayTab === 'dpp' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Split screen: Academic Guide vs Interactive Scanner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Academic Guide (Detailed Sections) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30 leading-relaxed"><MdText text={inhalt.texte.derDigitaleProduktpassDpp} /></div>

                <ModuleTabs
                  label={inhalt.werte.abschnitteDesProduktpasses}
                  tabs={[
                    { id: 'grundlagen', label: inhalt.werte.t1Grundlagen, icon: BookOpen },
                    { id: 'umsetzung', label: inhalt.werte.t2Umsetzung, icon: Wrench },
                    { id: 'inhalte', label: inhalt.werte.t3InhalteBom, icon: Database },
                    { id: 'zeitschiene', label: inhalt.werte.t4Zeitschiene, icon: Clock },
                    { id: 'verpflichtung', label: inhalt.werte.t5Verpflichtung, icon: Scale },
                  ]}
                  aktiv={activeDetailSection}
                  onWechsel={setActiveDetailSection}
                  className="flex flex-col gap-6"
                >
                {/* Subsection Panel */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-home-grau/30 shadow-inner min-h-[350px] flex flex-col justify-between">
                  {activeDetailSection === 'grundlagen' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <h4 className="font-bold text-base text-slate-900"><MdText text={inhalt.texte.t1WissenschaftlicheGrundlagenZiele} /></h4>
                        <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.euEcodesignForSustainable} /></p>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.dieGrundlagenDesDpp} /></p>
                      
                      {/* Rechtliche Gültigkeit: BauPVO, hEN, ETA */}
                      <div className="bg-shiraz/5 border border-shiraz/10 p-4 rounded-xl space-y-2">
                        <span className="text-xs font-bold text-shiraz block uppercase tracking-wide"><MdText text={inhalt.texte.gültigkeitRechtlicherRahmen} /></span>
                        <p className="text-xs text-slate-800 leading-relaxed font-normal"><MdText text={inhalt.texte.imBaubereichWirdDer} /></p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-normal">
                          <div className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                            <strong className="text-shiraz block mb-0.5 font-bold"><MdText text={inhalt.texte.harmonisierteNormenHen} /></strong>
                            <span><MdText text={inhalt.texte.produkteMitHarmonisierterTechnischer} /></span>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                            <strong className="text-shiraz block mb-0.5 font-bold"><MdText text={inhalt.texte.technBewertungenEta} /></strong>
                            <span><MdText text={inhalt.texte.auchProdukteMitEuropäischer} /></span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-normal">
                        <div className="bg-white p-3 rounded-xl border border-home-grau/30">
                          <strong className="text-xs text-shiraz block font-bold">Informationssymmetrie</strong>
                          <span className="text-[11px] text-slate-500 leading-relaxed"><MdText text={inhalt.texte.lückenloseTransparenzFürAlle} /></span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-home-grau/30">
                          <strong className="text-xs text-shiraz block font-bold"><MdText text={inhalt.texte.zirkuläreOptimierung} /></strong>
                          <span className="text-[11px] text-slate-500 leading-relaxed"><MdText text={inhalt.texte.entscheidungenZurWiederverwendungUnd} /></span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailSection === 'umsetzung' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <h4 className="font-bold text-base text-slate-900"><MdText text={inhalt.texte.t2TechnischeUmsetzungStandardisierung} /></h4>
                        <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.identifikatorenSchnittstellenUndDatenstr} /></p>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.dieUmsetzungDesDpp} /></p>
                      <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-none pl-0 font-normal">
                        <li className="flex gap-2 items-start leading-relaxed">
                          <span className="text-shiraz font-bold shrink-0">■</span>
                          <span><MdText text={inhalt.texte.m2mInteroperabilitätDatenablageStrukturi} /></span>
                        </li>
                        <li className="flex gap-2 items-start leading-relaxed">
                          <span className="text-shiraz font-bold shrink-0">■</span>
                          <span><MdText text={inhalt.texte.eindeutigeIdentifikationVerwendungStanda} /></span>
                        </li>
                        <li className="flex gap-2 items-start leading-relaxed">
                          <span className="text-shiraz font-bold shrink-0">■</span>
                          <span><MdText text={inhalt.texte.bimIntegrationDirekteMaschinelle} /></span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {activeDetailSection === 'inhalte' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <h4 className="font-bold text-base text-slate-900"><MdText text={inhalt.texte.t3ZuDokumentierendeInhalte} /></h4>
                        <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.billOfMaterialsBom} /></p>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.einNormkonformerDigitalerProduktpass} /></p>
                      <div className="bg-white rounded-xl border border-home-grau/30 overflow-hidden text-xs font-normal">
                        <div className="grid grid-cols-12 gap-1.5 p-2 bg-slate-100/70 border-b border-home-grau/30 font-bold">
                          <span className="col-span-4">Kategorie</span>
                          <span className="col-span-8"><MdText text={inhalt.texte.typischeKennwerteParameter} /></span>
                        </div>
                        <div className="p-2 grid grid-cols-12 gap-1.5 border-b border-home-grau/30">
                          <span className="col-span-4 font-bold text-shiraz">Allgemeines</span>
                          <span className="col-span-8 text-slate-700"><MdText text={inhalt.texte.herstellerdatenHerstellungsortChargeUid} /></span>
                        </div>
                        <div className="p-2 grid grid-cols-12 gap-1.5 border-b border-home-grau/30">
                          <span className="col-span-4 font-bold text-shiraz"><MdText text={inhalt.texte.stücklisteBom} /></span>
                          <span className="col-span-8 text-slate-700"><MdText text={inhalt.texte.chemischeHauptbestandteileRecyclingAntei} /></span>
                        </div>
                        <div className="p-2 grid grid-cols-12 gap-1.5 border-b border-home-grau/30">
                          <span className="col-span-4 font-bold text-shiraz">Umweltdaten</span>
                          <span className="col-span-8 text-slate-700"><MdText text={inhalt.texte.verweistabelleAufEpdKennwerte} /></span>
                        </div>
                        <div className="p-2 grid grid-cols-12 gap-1.5">
                          <span className="col-span-4 font-bold text-shiraz">Rückbau</span>
                          <span className="col-span-8 text-slate-700"><MdText text={inhalt.texte.leitfädenZurZerstörungsfreienDemontage} /></span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailSection === 'zeitschiene' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <h4 className="font-bold text-base text-slate-900"><MdText text={inhalt.texte.t4ZeitschieneZurStufenweisen} /></h4>
                        <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.euWeiteImplementierungsstufenDer} /></p>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.dieSchrittweiseEinführungDes} /></p>
                      <div className="relative pl-6 border-l-2 border-shiraz/35 space-y-4 pt-1 font-normal">
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-shiraz border-2 border-white" />
                          <div className="text-xs font-bold text-shiraz"><MdText text={inhalt.texte.t18072024Inkrafttreten} /></div>
                          <div className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.inkrafttretenDerÖkodesignVerordnung} /></div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-shiraz border-2 border-white" />
                          <div className="text-xs font-bold text-shiraz"><MdText text={inhalt.texte.t2025Bis2027Arbeitsplan} /></div>
                          <div className="text-xs text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.esprArbeitsplan20252030} /></div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-shiraz border-2 border-white" />
                          <div className="text-xs font-bold text-shiraz"><MdText text={inhalt.texte.ab08012026} /></div>
                          <div className="text-xs text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.dieBauprodukteverordnungEu2024} /></div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-gray-600 border-2 border-white" />
                          <div className="text-xs font-bold text-gray-600"><MdText text={inhalt.texte.bisEtwa2040Übergang} /></div>
                          <div className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.schrittweiserÜbergangAllerProduktfamilie} /></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailSection === 'verpflichtung' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <h4 className="font-bold text-base text-slate-900"><MdText text={inhalt.texte.t5GesetzlicheVerpflichtungenAkteureskreis} /></h4>
                        <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.werIstWannZu} /></p>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-normal"><MdText text={inhalt.texte.dieEinführungDesDpp} /></p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-normal">
                        <div className="bg-white p-3 rounded-xl border border-home-grau/30">
                          <strong className="text-shiraz block font-bold mb-1"><MdText text={inhalt.texte.herstellungVertrieb} /></strong>
                          <span><MdText text={inhalt.texte.verpflichtetZurBereitstellungDer} /></span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-home-grau/30">
                          <strong className="text-shiraz block font-bold mb-1"><MdText text={inhalt.texte.planungEntsorgung} /></strong>
                          <span><MdText text={inhalt.texte.planerMüssenDppWerte} /></span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Little expert hint at bottom */}
                  <div className="mt-4 pt-4 border-t border-home-grau/30 flex items-center gap-2 text-[11px] text-slate-500 font-normal">
                    <Activity size={13} className="text-shiraz shrink-0" />
                    <span><MdText text={inhalt.texte.expertentippDppDatenFließen} /></span>
                  </div>
                </div>
                </ModuleTabs>

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
                            <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400"><MdText text={inhalt.texte.scannerAktiv} /></span>
                          </div>

                          {/* Sci-fi overlay HUD parameter display */}
                          <div className="absolute top-2 left-3 font-mono text-[8px] text-slate-400 space-y-0.5 leading-none bg-slate-950/85 p-1.5 rounded border border-home-grau/30 z-10">
                            <div><MdText text={inhalt.texte.cameraSimulator} /></div>
                            <div>STATE: <span className="text-shiraz font-bold">{hudMessage}</span></div>
                            <div><MdText text={inhalt.texte.resolution1080p} /></div>
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
                          {webcamActive ? inhalt.werte.kameraStoppen : inhalt.werte.echteWebcam}
                        </button>
                      </div>

                      {scannedId && (
                        <button
                          type="button"
                          onClick={() => {
                            setScannedId(null);
                            setHudMessage(inhalt.werte.bereitFürScan2);
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
                        <span>{cameraError}<MdText text={inhalt.texte.verwendenSieSimulator} /></span>
                      </div>
                    )}

                    {/* Lower half of physical phone screen: List of Scannable barcoded assets */}
                    <div className="flex-1 p-3 bg-white flex flex-col gap-2 overflow-y-auto scrollbar-none">
                      <h4 className="font-bold text-center text-[11px] text-slate-500 uppercase tracking-widest mt-0.5 select-none"><MdText text={inhalt.texte.scannbareBauteile} /></h4>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 text-center -mt-1 leading-snug font-normal select-none"><MdText text={inhalt.texte.wählenSieEinesDer} /></p>
                      
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
                          <span className="font-bold text-xs text-slate-800 block truncate"><MdText text={inhalt.texte.stahlbetonstützeC3545} /></span>
                          <span className="text-[9px] text-slate-600 dark:text-slate-300 block font-normal truncate"><MdText text={inhalt.texte.precastSolutionsGmbhId} /></span>
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
                          <span className="text-[9px] text-slate-600 dark:text-slate-300 block font-normal truncate"><MdText text={inhalt.texte.woodbuildAgId5678} /></span>
                        </div>
                      </button>

                      {/* Instruction text helper */}
                      <div className="text-[8px] text-slate-600 dark:text-slate-300 leading-normal text-center bg-slate-50 p-1.5 rounded-lg border border-home-grau/30 font-normal mt-1 select-none"><MdText text={inhalt.texte.integrierteDatenAuditsNach} /></div>
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
          <p><MdText text={inhalt.texte.eindeutigeIdUid} />{scannedId}
          </p>
        </div>
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck size={14} className="text-emerald-600" /><MdText text={inhalt.texte.verifiziertAktiv} /></div>
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
                        <h4 className="text-[10px] font-bold text-slate-900/55 uppercase tracking-wider"><MdText text={inhalt.texte.chargeAbnahme} /></h4>
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
                      <FileText size={15} className="text-shiraz" /><MdText text={inhalt.texte.materialzusammensetzungBomBillOf} /></h4>
                    <div className="bg-white rounded-xl border border-home-grau/30 overflow-hidden font-normal">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="py-2 px-3 font-bold text-slate-900 border-b border-home-grau/30"><MdText text={inhalt.texte.komponenteWerkstoff} /></th>
                            <th className="py-2 px-3 font-bold text-slate-900 border-b border-home-grau/30">Massenanteil</th>
                            <th className="py-2 px-3 font-bold text-slate-900 border-b border-home-grau/30"><MdText text={inhalt.texte.recyclinganteilSekundär} /></th>
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
                      <Recycle size={15} className="text-shiraz" /><MdText text={inhalt.texte.zirkularitätDemontageRecyclinganleitung} /></h4>
                    <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-normal">
                      <div className="space-y-1 text-xs font-normal">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-blue-900"><MdText text={inhalt.texte.konstruktivGeplanteRecyclingfähigkeit} /></span>
                          <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded text-[10px] font-bold">{product.circularity.recyclability}</span>
                        </div>
                        <p className="text-blue-800 leading-relaxed text-[11px] sm:text-xs">{product.circularity.instructions}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2 border-b border-home-grau/30 pb-1.5">
                      <ShieldCheck size={15} className="text-shiraz" /><MdText text={inhalt.texte.integrierteKonformitätsnachweiseDeklarat} /></h4>
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
                  <h3 className="text-sm font-bold text-slate-900 mb-1"><MdText text={inhalt.texte.keinScannerErgebnisGeladen} /></h3>
                  <p className="text-[11px] max-w-md text-slate-500 font-normal"><MdText text={inhalt.texte.klickenSieAufEin} /></p>
                </div>
              )}
            </div>

          </div>
        )}

        {displayTab === 'epd' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.eineEnvironmentalProductDeclaration} /></p>
            </div>

            <AuswahlGruppe label="Material" className="flex border-b border-home-grau/30 overflow-x-auto scrollbar-none">
              {EPD_DATA.map((epd) => (
                <button {...alsOption(activeMaterial === epd.id)}
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
            </AuswahlGruppe>

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
                  <span><MdText text={inhalt.texte.deklarierteEinheit} /><strong>{selectedEpd.einheit}</strong></span>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-shiraz" /><MdText text={inhalt.texte.umweltwirkungenNachLebenszyklusphasen} /></h4>
                
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
                          <div className="font-bold text-slate-900">GWP <InfoTooltip text={inhalt.werte.globalWarmingPotentialTreibhauspotenzial} /></div>
                          <div className="text-xs text-slate-500"><MdText text={inhalt.texte.kgCoÄqv} /></div>
                        </td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a1a3.gwp, 2)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a4.gwp, 2)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.c3.gwp, 2)}</td>
                        <td className="py-3 px-2 text-right font-mono text-green-600">{formatDeZahl(selectedEpd.phasen.d.gwp, 2)}</td>
                      </tr>
                      <tr className="border-b border-home-grau/30 hover:bg-slate-50">
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-900">PENRT <InfoTooltip text={inhalt.werte.primaryEnergyNonRenewable} /></div>
                          <div className="text-xs text-slate-500">[MJ]</div>
                        </td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a1a3.penrt, 2)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a4.penrt, 2)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.c3.penrt, 2)}</td>
                        <td className="py-3 px-2 text-right font-mono text-green-600">{formatDeZahl(selectedEpd.phasen.d.penrt, 2)}</td>
                      </tr>
                      <tr className="border-b border-home-grau/30 hover:bg-slate-50">
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-900">AP <InfoTooltip text={inhalt.werte.acidificationPotentialVersauerungspotenz} /></div>
                          <div className="text-xs text-slate-500"><MdText text={inhalt.texte.molHÄqv} /></div>
                        </td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a1a3.ap, 3)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.a4.ap, 3)}</td>
                        <td className="py-3 px-2 text-right font-mono">{formatDeZahl(selectedEpd.phasen.c3.ap, 3)}</td>
                        <td className="py-3 px-2 text-right font-mono text-green-600">{formatDeZahl(selectedEpd.phasen.d.ap, 3)}</td>
                      </tr>
                      <tr className="border-b border-home-grau/30 hover:bg-slate-50">
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-900">EP <InfoTooltip text={inhalt.werte.eutrophicationPotentialSüßwasserEutrophi} /></div>
                          <div className="text-xs text-slate-500">[kg P-Äqv.]</div>
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
                <p className="text-xs text-blue-800/80"><MdText text={inhalt.texte.rohstoffgewinnungTransportZumWerk} /></p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex flex-col items-center text-center gap-2">
                <Truck className="text-orange-600" size={24} />
                <h5 className="font-bold text-orange-900 text-sm">A4-A5</h5>
                <p className="text-xs text-orange-800/80"><MdText text={inhalt.texte.transportZurBaustelleEinbau} /></p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center text-center gap-2">
                <Activity className="text-gray-600" size={24} />
                <h5 className="font-bold text-gray-900 text-sm">B & C</h5>
                <p className="text-xs text-gray-800/80"><MdText text={inhalt.texte.nutzungInstandhaltungEntsorgungRückbau} /></p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center text-center gap-2">
                <Recycle className="text-green-600" size={24} />
                <h5 className="font-bold text-green-900 text-sm">Modul D</h5>
                <p className="text-xs text-green-800/80"><MdText text={inhalt.texte.gutschriftenUndLastenAußerhalb} /></p>
              </div>
            </div>
          </div>
        )}
        </DppReiter>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1DeklarierteModule}
        zielGleichung="GWP_{A\text{–}C} = GWP_{A1\text{–}A3} + GWP_{C3} + GWP_{C4}, \quad D \text{ getrennt}"
        schritte={inhalt.daten["DppEpd.schritte"]}
        ergebnisHinweis={inhalt.werte.nachEn15804A2}
        normQuelle={inhalt.werte.dinEn158042022}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2PrimärenergieEnergetisch}
        zielGleichung="PENRT = PENRE + PENRM"
        schritte={inhalt.daten["DppEpd.schritte_2"]}
        ergebnisHinweis={inhalt.werte.beiDerVerbrennungAm}
        normQuelle={inhalt.werte.dinEn1580420222}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="dpp" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap13} 
        wikipedia={[
          { title: 'Umweltproduktdeklaration', url: 'https://de.wikipedia.org/wiki/Environmental_Product_Declaration' },
          { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/Lebenszyklusanalyse' },
          { title: 'Treibhauspotenzial', url: 'https://de.wikipedia.org/wiki/Treibhauspotential' }
        ]}
        literatur={inhalt.daten["DppEpd.literatur"]}
        regelwerke={inhalt.daten["DppEpd.regelwerke"]}
        formeln={inhalt.daten["DppEpd.formeln"]}
      />
    </div>
  );
} 