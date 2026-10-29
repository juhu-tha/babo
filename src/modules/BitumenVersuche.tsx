import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Thermometer, ArrowDownToLine, BookOpen, Activity, Box } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import inhalt from '@/content/bitumenversuche/BitumenVersuche.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ringKugelZustand, RUK_STARTTEMPERATUR, RUK_AUFHEIZRATE } from '@/src/calc/laborVersuch';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

type BitumenSorte = '160/220' | '70/100' | '50/70' | '30/45' | '20/30' | 'PmB 25/55-55';

interface BitumenVersucheProps {
  isEmbedded?: boolean;
}

export default function BitumenVersuche({ isEmbedded = false }: BitumenVersucheProps = {}) {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'versuche'>('versuche');
  const [sorte, setSorte] = useState<BitumenSorte>('50/70');
  const [activeTest, setActiveTest] = useState<'penetration' | 'ruk'>('penetration');
  
  // Test states
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [progress, setProgress] = useState(0); // 0 to 100
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getBitumenProps = (s: BitumenSorte) => {
    switch (s) {
      // Typische Werte innerhalb der Spannen nach DIN EN 12591 bzw. DIN EN 14023 (PmB)
      case '160/220': return { pen: 190, ruk: 39 }; // Soft
      case '70/100': return { pen: 85, ruk: 46 };
      case '50/70': return { pen: 60, ruk: 50 };
      case '30/45': return { pen: 38, ruk: 56 };
      case '20/30': return { pen: 25, ruk: 59 }; // Hard (DIN EN 12591: EP 55–63 °C)
      case 'PmB 25/55-55': return { pen: 40, ruk: 58 }; // Polymer modified
    }
  };

  const currentProps = getBitumenProps(sorte);
  const anteil = testStatus === 'finished' ? 1 : progress / 100;

  // Penetrometer (DIN EN 1426): Eindringtiefe 0 … 200 · 0,1 mm auf 0,4 px je Einheit; Oberfläche bei y = 150
  const oberflaecheY = 150;
  const tiefeEinheiten = anteil * currentProps.pen;
  const spitzeY = oberflaecheY + tiefeEinheiten * 0.4;
  const penLabel = `Penetrometer nach DIN EN 1426: Nadel mit 100 g Gesamtlast über der Bitumenprobe im Wasserbad 25 °C. `
    + (testStatus === 'idle' ? 'Versuch noch nicht gestartet.' : `Eindringtiefe ${formatDeWert(Math.round(tiefeEinheiten))} · 0,1 mm nach ${formatDeZahl(anteil * 5, 1)} s von 5 s.`);
  // Ring-und-Kugel (DIN EN 1427): Abstand Ring – Bodenplatte 25 mm (2 px je mm), Bitumen sackt mit der Kugel durch;
  // Wasserbad ab 5 °C, gleichmäßig mit 5 K/min erwärmt
  const ruk = ringKugelZustand(anteil, currentProps.ruk);
  const temperatur = ruk.temperatur;
  const durchhang = anteil * 54;
  const rukLabel = `Ring-und-Kugel-Gerät nach DIN EN 1427: zwei Ringe mit Bitumen und Stahlkugeln im Wasserbad über der Bodenplatte (Abstand 25 mm), Thermometer rechts. `
    + (testStatus === 'idle' ? 'Versuch noch nicht gestartet.' : testStatus === 'finished' ? `Bitumen berührt die Bodenplatte bei ${formatDeZahl(currentProps.ruk, 1)} °C (Erweichungspunkt) nach ${formatDeZahl(ruk.dauer, 1)} min Aufheizen ab ${formatDeWert(RUK_STARTTEMPERATUR)} °C mit ${formatDeWert(RUK_AUFHEIZRATE)} K/min.` : `Badtemperatur ${formatDeZahl(temperatur, 1)} °C nach ${formatDeZahl(ruk.minuten, 1)} min (Start ${formatDeWert(RUK_STARTTEMPERATUR)} °C, ${formatDeWert(RUK_AUFHEIZRATE)} K/min).`);

  const clearTestInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    resetTest();
    return () => clearTestInterval();
  }, [sorte, activeTest]);

  const resetTest = () => {
    clearTestInterval();
    setTestStatus('idle');
    setProgress(0);
  };

  const startTest = () => {
    setTestStatus('running');
    setProgress(0);
    
    const steps = 100;
    const intervalTime = activeTest === 'penetration' ? 50 : 80;
    let currentStep = 0;
    
    intervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setProgress(currentStep);
      } else {
        clearTestInterval();
        setTestStatus('finished');
      }
    }, intervalTime);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="text-shiraz" /><MdText text={inhalt.texte.bitumenBitumenprüfung} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.standardisiertePrüfverfahrenZurBestimmun} /></p>
        </div>

        {/* Tab-Navigation */}
        <ReiterLeiste label="Bereiche Bitumen" className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button {...alsReiter(activeTab === 'steckbrief', 'bitumen-bereich', 'steckbrief')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Steckbrief
          </button>
          <button {...alsReiter(activeTab === 'versuche', 'bitumen-bereich', 'versuche')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'versuche' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('versuche')}
          >
            <Activity size={16} /><MdText text={inhalt.texte.virtuelleVersuchePenetrationEp} /></button>
        </ReiterLeiste>

        {activeTab === 'steckbrief' && (
          <div {...reiterPanel('bitumen-bereich', activeTab)} className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="bitumen" />
          </div>
        )}
      </div>

      {activeTab === 'versuche' && (
        <div {...reiterPanel('bitumen-bereich', activeTab)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.t1Konfiguration} /></h3>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.bitumensorteWählen} /></label>
              <select aria-label={inhalt.werte.bitumensorteWählen} 
                className="w-full p-2 border border-home-grau rounded-md bg-off-white text-sm focus:outline-none focus:border-shiraz"
                value={sorte}
                onChange={(e) => setSorte(e.target.value as BitumenSorte)}
                disabled={testStatus === 'running'}
              >
                <option value="160/220">160/220 (Sehr weich)</option>
                <option value="70/100">70/100 (Weich)</option>
                <option value="50/70">50/70 (Standard)</option>
                <option value="30/45">30/45 (Hart)</option>
                <option value="20/30">20/30 (Sehr hart)</option>
                <option value="PmB 25/55-55">PmB 25/55-55 (Polymermodifiziert)</option>
              </select>
            </div>

            <div className="space-y-3 pt-4 border-t border-home-grau/30">
               <label className="text-sm font-bold text-text-main">Versuchsart</label>
               <AuswahlGruppe label="Versuchsart" className="grid grid-cols-2 gap-2">
                 <button {...alsOption(activeTest === 'penetration')}
                   onClick={() => setActiveTest('penetration')}
                   disabled={testStatus === 'running'}
                   className={`py-3 px-2 text-xs font-medium rounded-lg border transition-colors flex flex-col items-center gap-2 ${
                     activeTest === 'penetration' 
                       ? 'bg-shiraz text-white border-shiraz' 
                       : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/50'
                   }`}
                 >
                   <ArrowDownToLine size={18} />
                   Nadelpenetration
                 </button>
                 <button {...alsOption(activeTest === 'ruk')}
                   onClick={() => setActiveTest('ruk')}
                   disabled={testStatus === 'running'}
                   className={`py-3 px-2 text-xs font-medium rounded-lg border transition-colors flex flex-col items-center gap-2 ${
                     activeTest === 'ruk' 
                       ? 'bg-shiraz text-white border-shiraz' 
                       : 'bg-off-white text-text-main border-home-grau/30 hover:border-shiraz/50'
                   }`}
                 >
                   <Thermometer size={18} />
                   Erweichungspunkt
                 </button>
               </AuswahlGruppe>
            </div>

            <div className="pt-4 border-t border-home-grau/30 flex gap-2">
               <button
                 onClick={startTest}
                 disabled={testStatus !== 'idle'}
                 className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <Play size={18} /> Versuch starten
               </button>
               <button
                 onClick={resetTest}
                 aria-label="Versuch zurücksetzen"
                 title="Versuch zurücksetzen"
                 disabled={testStatus === 'idle'}
                 className="py-3 px-4 bg-home-grau/20 hover:bg-home-grau/30 text-text-main rounded-lg font-bold flex items-center justify-center transition-colors disabled:opacity-50"
               >
                 <RotateCcw size={18} />
               </button>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full min-h-[400px]">
             <div className="flex justify-between items-center mb-6 border-b border-home-grau/30 pb-4">
               <h3 className="text-lg font-bold text-text-main"><MdText text={inhalt.texte.t2Durchführung} />{activeTest === 'penetration' ? 'DIN EN 1426' : 'DIN EN 1427'})</h3>
               <div className="flex items-center gap-2">
                 <span className="text-sm font-medium text-home-grau">Status:</span>
                 <span className={`text-sm font-bold px-2 py-1 rounded ${
                   testStatus === 'idle' ? 'bg-home-grau/20 text-text-main' :
                   testStatus === 'running' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                   'bg-emerald-100 text-emerald-700'
                 }`}>
                   {testStatus === 'idle' ? 'Bereit' : testStatus === 'running' ? 'Läuft...' : 'Abgeschlossen'}
                 </span>
               </div>
             </div>

             <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center">
               
               <figure className="pruefgeraet w-full max-w-[320px] p-2 rounded-xl border flex-shrink-0 m-0">
                 {activeTest === 'penetration' ? (
                   <svg viewBox="0 0 280 260" className="w-full h-auto select-none" role="img" aria-label={penLabel}>
                     <title>{penLabel}</title>
                     {/* Stativ */}
                     <rect x="20" y="236" width="170" height="10" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
                     <rect x="28" y="12" width="10" height="224" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
                     <rect x="38" y="30" width="80" height="10" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
                     <rect x="102" y="24" width="12" height="22" rx="1" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1" />
                     {/* Wasserbad mit Probengefäß */}
                     <rect x="56" y="128" width="104" height="104" rx="4" fill="var(--pg-wasser)" stroke="var(--pg-wasser-rand)" strokeWidth="1.2" />
                     <text x="108" y="230" textAnchor="middle" fontSize="11" fill="var(--pg-text)">Wasserbad 25 °C</text>
                     <rect x="72" y="146" width="72" height="66" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
                     <rect x="76" y={oberflaecheY} width="64" height="58" fill="var(--pg-bitumen)" stroke="var(--pg-bitumen-rand)" strokeWidth="1.2" />
                     {/* Fallstab mit Zusatzgewicht und Nadel */}
                     <g transform={`translate(0 ${spitzeY - oberflaecheY})`} className="transition-transform duration-300">
                       <line x1="108" y1="8" x2="108" y2="52" stroke="var(--pg-kontur)" strokeWidth="3" />
                       <rect x="94" y="52" width="28" height="34" rx="2" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
                       <text x="108" y="73" textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--pg-text)">100 g</text>
                       <line x1="108" y1="84" x2="108" y2={oberflaecheY - 2} stroke="var(--pg-kontur)" strokeWidth="2.5" />
                       <path d={`M 106.5 ${oberflaecheY - 2} L 108 ${oberflaecheY + 2} L 109.5 ${oberflaecheY - 2} Z`} fill="var(--pg-kontur)" />
                     </g>
                     {/* Nadelspitze in der Probe (über dem Bitumen sichtbar) */}
                     {tiefeEinheiten > 0 && <line x1="108" y1={oberflaecheY} x2="108" y2={spitzeY} stroke="var(--pg-stahl3)" strokeWidth="2.5" />}
                     {/* Skala der Eindringtiefe */}
                     <text x="226" y="118" textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--pg-text)">Eindringtiefe</text>
                     <text x="226" y="131" textAnchor="middle" fontSize="11" fill="var(--pg-text2)">in 0,1 mm</text>
                     <line x1="196" y1={oberflaecheY} x2="196" y2={oberflaecheY + 80} stroke="var(--pg-kontur)" strokeWidth="1.2" />
                     {[0, 50, 100, 150, 200].map(v => (
                       <g key={v}>
                         <line x1="190" y1={oberflaecheY + v * 0.4} x2="202" y2={oberflaecheY + v * 0.4} stroke="var(--pg-kontur)" strokeWidth="1" />
                         <text x="208" y={oberflaecheY + v * 0.4 + 4} fontSize="11" fill="var(--pg-text)">{formatDeWert(v)}</text>
                       </g>
                     ))}
                     <line x1="112" y1={spitzeY} x2="196" y2={spitzeY} stroke="var(--pg-akzent)" strokeWidth="1" strokeDasharray="3 2" />
                     <path d={`M 190 ${spitzeY} l -7 -4 l 0 8 z`} fill="var(--pg-akzent)" />
                     <text x="270" y="22" textAnchor="end" fontSize="12" fontWeight="bold" fill="var(--pg-akzent)">t = {formatDeZahl(anteil * 5, 1)} s / 5 s</text>
                     <text x="270" y="40" textAnchor="end" fontSize="12" fill="var(--pg-text)">{formatDeWert(Math.round(tiefeEinheiten))} · 0,1 mm</text>
                   </svg>
                 ) : (
                   <svg viewBox="0 0 300 270" className="w-full h-auto select-none" role="img" aria-label={rukLabel}>
                     <title>{rukLabel}</title>
                     {/* Heizplatte */}
                     <rect x="30" y="246" width="180" height="10" rx="2" fill={testStatus === 'running' ? 'var(--pg-akzent)' : 'var(--pg-stahl3)'} stroke="var(--pg-kontur)" strokeWidth="1" />
                     {/* Becherglas mit Wasser */}
                     <path d="M 40 30 L 40 240 L 200 240 L 200 30" fill="none" stroke="var(--pg-kontur)" strokeWidth="2" />
                     <rect x="41" y="52" width="158" height="187" fill="var(--pg-wasser)" />
                     {/* Haltestäbe, Ringplatte und Bodenplatte (Abstand 25 mm) */}
                     <line x1="58" y1="20" x2="58" y2="160" stroke="var(--pg-kontur)" strokeWidth="2" />
                     <line x1="182" y1="20" x2="182" y2="160" stroke="var(--pg-kontur)" strokeWidth="2" />
                     <rect x="54" y="104" width="132" height="4" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="0.8" />
                     <rect x="54" y="158" width="132" height="5" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="0.8" />
                     <line x1="192" y1="108" x2="192" y2="158" stroke="var(--pg-mass)" strokeWidth="1" />
                     <text x="196" y="137" fontSize="11" fill="var(--pg-mass)" fontWeight="bold">25 mm</text>
                     {[90, 150].map(cxr => (
                       <g key={cxr}>
                         {/* durchhängendes Bitumen mit Kugel */}
                         <path d={`M ${cxr - 14} 104 Q ${cxr - 14} ${104 + durchhang} ${cxr} ${104 + durchhang} Q ${cxr + 14} ${104 + durchhang} ${cxr + 14} 104 Z`} fill="var(--pg-bitumen)" stroke="var(--pg-bitumen-rand)" strokeWidth="1" />
                         <rect x={cxr - 16} y="96" width="32" height="8" fill="var(--pg-bitumen)" stroke="var(--pg-kontur)" strokeWidth="1.5" />
                         <circle cx={cxr} cy={90 + durchhang * 0.9} r="6" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
                       </g>
                     ))}
                     {/* Thermometer */}
                     <rect x="246" y="30" width="10" height="200" rx="5" fill="var(--pg-anzeige)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
                     <rect x="248" y={230 - ((temperatur - 0) / 100) * 200} width="6" height={((temperatur - 0) / 100) * 200} rx="3" fill="var(--pg-akzent)" />
                     {[0, 20, 40, 60, 80].map(t => (
                       <g key={t}>
                         <line x1="256" y1={230 - (t / 100) * 200} x2="262" y2={230 - (t / 100) * 200} stroke="var(--pg-kontur)" strokeWidth="1" />
                         <text x="264" y={234 - (t / 100) * 200} fontSize="11" fill="var(--pg-text)">{formatDeWert(t)} °C</text>
                       </g>
                     ))}
                     <text x="120" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="var(--pg-akzent)">T = {formatDeZahl(temperatur, 1)} °C · t = {formatDeZahl(ruk.minuten, 1)} min</text>
                   </svg>
                 )}
               </figure>

               <div className="flex-1 space-y-4">
                 {testStatus === 'finished' ? (
                   <div className="animate-in fade-in slide-in-from-right-4 space-y-4">
                     <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                       <h4 className="font-bold text-emerald-900 mb-2">Ergebnis</h4>
                       {activeTest === 'penetration' ? (
                         <div>
                           <div className="text-3xl font-bold text-emerald-700">{formatDeWert(currentProps.pen)} <span className="text-sm font-normal text-emerald-800">1/10 mm</span></div>
                           <p className="text-sm text-emerald-800 mt-2"><MdText text={inhalt.texte.dieNadelIstStandardgemäß} />{formatDeWert(currentProps.pen / 10)}<MdText text={inhalt.texte.mmInDieBitumenprobe} /></p>
                         </div>
                       ) : (
                         <div>
                           <div className="text-3xl font-bold text-emerald-700">{formatDeZahl(currentProps.ruk, 1)} <span className="text-sm font-normal text-emerald-800">°C</span></div>
                           <p className="text-sm text-emerald-800 mt-2"><MdText text={inhalt.texte.beiDieserBadtemperaturIst} /></p>
                         </div>
                       )}
                     </div>
                     <div className="bg-off-white border border-home-grau/30 p-4 rounded-xl">
                       <h4 className="font-bold text-sm text-text-main mb-1"><MdText text={inhalt.texte.bedeutungFürDiePraxis} /></h4>
                       <p className="text-sm text-text-main/80">
                         {activeTest === 'penetration' 
                           ? inhalt.werte.geringePenetrationswerteZB
                           : inhalt.werte.einHoherErweichungspunktZ
                         }
                       </p>
                     </div>
                   </div>
                 ) : (
                   <div className="text-sm text-home-grau text-center p-8"><MdText text={inhalt.texte.startenSieDenVersuch} /></div>
                 )}
               </div>
             </div>

          </div>
        </div>
      </div>
    )}
      
      {!isEmbedded && (
        <ModuleFooter 
          wikipedia={[
            { title: 'Bitumen', url: 'https://de.wikipedia.org/wiki/Bitumen' },
            { title: 'Nadelpenetration', url: 'https://de.wikipedia.org/wiki/Nadelpenetration' },
            { title: inhalt.werte.erweichungspunktRuk, url: 'https://de.wikipedia.org/wiki/Erweichungspunkt_RuK' }
          ]}
          regelwerke={inhalt.daten["BitumenVersuche.regelwerke"]}
          literatur={inhalt.daten["BitumenVersuche.literatur"]}
          formeln={inhalt.daten["BitumenVersuche.formeln"]}
        />
      )}
    </div>
  );
}
