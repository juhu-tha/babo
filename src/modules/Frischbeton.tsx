import React, { useState } from 'react';
import { Waves, Gauge, Thermometer, Layers, CheckCircle2, AlertTriangle, Scale, Wind } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import Ausbreitversuch from './Ausbreitversuch';
import Frischbetondruck from './Frischbetondruck';
import Frischbetontemperatur from './Frischbetontemperatur';

type TabKey = 'konsistenz' | 'ausbreitversuch' | 'luftporen' | 'frischbetondruck' | 'frischbetontemperatur';
type TestVerfahren = 'ausbreitmass' | 'verdichtungsmass' | 'setzmass' | 'setzfliessmass';

export default function Frischbeton() {
  const [activeTab, setActiveTab] = useState<TabKey>('konsistenz');

  // State für Grenzabmaß-Prüfer (DIN EN 206 Tab. 21 / DIN 1045-2:2023-08)
  const [verfahren, setVerfahren] = useState<TestVerfahren>('ausbreitmass');
  const [zielwert, setZielwert] = useState<number>(450); // z.B. F3 = 450 mm
  const [messwert, setMesswert] = useState<number>(440);

  // State für Luftporen- & Rohdichterechner (DIN EN 12350-7 / -6 / DIN 1045-2:2023-08)
  const [dMax, setDMax] = useState<8 | 16 | 32 | 63>(32);
  const [expKlasse, setExpKlasse] = useState<'XF2' | 'XF4' | 'X0_XF1_XF3'>('XF4');
  const [lAbg, setLAbg] = useState<number>(4.8); // abgelesener Luftgehalt in %
  const [kGestein, setKGestein] = useState<number>(0.2); // Korrekturfaktor Gestein in %
  const [m1, setM1] = useState<number>(10.2); // Behälter leer in kg
  const [m2, setM2] = useState<number>(29.1); // Behälter mit verdichtetem Beton in kg
  const [volumenL, setVolumenL] = useState<number>(8.0); // 8 Liter Topf

  // Berechnung der zulässigen Grenzabmaße nach DIN EN 206:2021 Tabelle 21 / DIN 1045-2:2023-08
  const getGrenzabmass = (v: TestVerfahren, target: number) => {
    switch (v) {
      case 'ausbreitmass':
        if (target <= 400) return 20;
        if (target <= 540) return 30;
        return 40;
      case 'verdichtungsmass':
        if (target >= 1.26) return 0.10;
        if (target >= 1.11) return 0.08;
        return 0.05;
      case 'setzmass':
        if (target <= 40) return 10;
        if (target <= 90) return 20;
        if (target <= 150) return 30;
        return 40;
      case 'setzfliessmass':
        return 40; // Für alle Zielwerte bei SVB
    }
  };

  const toleranz = getGrenzabmass(verfahren, zielwert);
  const minZul = verfahren === 'verdichtungsmass' ? zielwert - toleranz : zielwert - toleranz;
  const maxZul = verfahren === 'verdichtungsmass' ? zielwert + toleranz : zielwert + toleranz;
  const istKonform = messwert >= minZul && messwert <= maxZul;
  const abweichung = messwert - zielwert;

  // Berechnung Luftgehalt und Rohdichte
  const lEffektiv = Math.max(0, lAbg - kGestein);
  
  // Mindestluftporengehalte nach DIN 1045-2:2023-08 Tabelle F.2.2 & Tabelle 2 für XF2 / XF4
  const getMinLp = (d: number, klasse: 'XF2' | 'XF4' | 'X0_XF1_XF3') => {
    if (klasse === 'X0_XF1_XF3') return 0;
    switch (d) {
      case 8: return 5.5;
      case 16: return 4.5;
      case 32: return 4.0;
      case 63: return 3.5;
      default: return 4.0;
    }
  };

  const minLpGefordert = getMinLp(dMax, expKlasse);
  // Einzelwertkriterium nach DIN EN 206 Tab. 21: Höchstens 0,5 Vol.-% unter dem Sollwert
  const minLpEinzelwert = Math.max(0, minLpGefordert - 0.5);
  // Maximal empfohlener Luftgehalt zur Vermeidung übermäßiger Druckfestigkeitseinbußen (~4% über Sollwert)
  const maxLpSinnvoll = minLpGefordert > 0 ? minLpGefordert + 4.0 : 4.0;
  const lpKonform = expKlasse === 'X0_XF1_XF3' ? true : lEffektiv >= minLpEinzelwert && lEffektiv <= maxLpSinnvoll;

  // Frischbetonrohdichte D in kg/m³ (DIN EN 12350-6)
  const volumenM3 = volumenL / 1000;
  const rohdichte = volumenM3 > 0 ? (m2 - m1) / volumenM3 : 0;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Waves className="text-shiraz" /> Frischbeton &amp; Baustellenprüfungen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Vollständige Prüfung, Konsistenzklassifizierung, Toleranzabgleich nach <strong>DIN EN 206:2021-06</strong> und <strong>DIN 1045-2:2023-08</strong>, Luftporen- und Rohdichtebestimmung nach <strong>DIN EN 12350-7/-6</strong> sowie Schalungsdruckberechnung (DIN 18218) und Frischbetontemperaturprognosen.
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button 
            onClick={() => setActiveTab('konsistenz')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'konsistenz' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Layers size={16} /> Konsistenzklassen &amp; Grenzabmaße
          </button>
          <button 
            onClick={() => setActiveTab('ausbreitversuch')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'ausbreitversuch' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Waves size={16} /> Ausbreitversuch &amp; Rheologie
          </button>
          <button 
            onClick={() => setActiveTab('luftporen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'luftporen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Wind size={16} /> Luftporen &amp; Rohdichte
          </button>
          <button 
            onClick={() => setActiveTab('frischbetondruck')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'frischbetondruck' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Gauge size={16} /> Frischbetondruck (DIN 18218)
          </button>
          <button 
            onClick={() => setActiveTab('frischbetontemperatur')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'frischbetontemperatur' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Thermometer size={16} /> Frischbetontemperatur
          </button>
        </div>

        {/* Tab 1: Konsistenzklassen & Grenzabmaße */}
        {activeTab === 'konsistenz' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Tabellarische Übersicht aller Konsistenzbereiche */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm">
                  <h3 className="text-base font-bold text-text-main mb-3 flex items-center gap-2">
                    <Layers size={18} className="text-shiraz" /> Konsistenzbereiche nach DIN EN 206 / DIN 1045-2:2023-08
                  </h3>
                  <p className="text-xs text-text-main/70 mb-4">
                    Gegenüberstellung der fünf genormten Prüfverfahren zur Konsistenzbestimmung auf der Baustelle und im Fertigteilwerk.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                          <th className="p-2.5">Konsistenzbereich</th>
                          <th className="p-2.5">Ausbreitmaß <br /><span className="text-[10px] text-text-main/60">F (DIN EN 12350-5)</span></th>
                          <th className="p-2.5">Verdichtungsmaß <br /><span className="text-[10px] text-text-main/60">C (DIN EN 12350-4)</span></th>
                          <th className="p-2.5">Setzmaß <br /><span className="text-[10px] text-text-main/60">S (DIN EN 12350-2)</span></th>
                          <th className="p-2.5">Setzfließmaß <br /><span className="text-[10px] text-text-main/60">SF (DIN EN 12350-8)</span></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-home-grau/20 text-text-main/90 font-medium">
                        <tr className="hover:bg-off-white/50">
                          <td className="p-2.5 font-bold">sehr steif</td>
                          <td className="p-2.5">–</td>
                          <td className="p-2.5 font-mono">C0 (≥ 1,46)</td>
                          <td className="p-2.5">–</td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="hover:bg-off-white/50">
                          <td className="p-2.5 font-bold">steif</td>
                          <td className="p-2.5 font-mono">F1 (≤ 340 mm)</td>
                          <td className="p-2.5 font-mono">C1 (1,45 – 1,26)</td>
                          <td className="p-2.5 font-mono">S1 (10 – 40 mm)</td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="hover:bg-off-white/50">
                          <td className="p-2.5 font-bold">plastisch</td>
                          <td className="p-2.5 font-mono">F2 (350 – 410 mm)</td>
                          <td className="p-2.5 font-mono">C2 (1,25 – 1,11)</td>
                          <td className="p-2.5 font-mono">S2 (50 – 90 mm)</td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="bg-amber-50/40 hover:bg-amber-50/70 border-l-4 border-l-amber-500">
                          <td className="p-2.5 font-bold text-amber-900">weich (Regelkonsistenz)</td>
                          <td className="p-2.5 font-mono font-bold text-amber-900">F3 (420 – 480 mm)</td>
                          <td className="p-2.5 font-mono font-bold text-amber-900">C3 (1,10 – 1,04)</td>
                          <td className="p-2.5 font-mono font-bold text-amber-900">S3 (100 – 150 mm)</td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="hover:bg-off-white/50">
                          <td className="p-2.5 font-bold">sehr weich</td>
                          <td className="p-2.5 font-mono">F4 (490 – 550 mm)</td>
                          <td className="p-2.5 font-mono">C4 (&lt; 1,04)*</td>
                          <td className="p-2.5 font-mono">S4 (160 – 210 mm)</td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="hover:bg-off-white/50">
                          <td className="p-2.5 font-bold">fließfähig</td>
                          <td className="p-2.5 font-mono">F5 (560 – 620 mm)</td>
                          <td className="p-2.5">–</td>
                          <td className="p-2.5 font-mono">S5 (≥ 220 mm)</td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="hover:bg-off-white/50">
                          <td className="p-2.5 font-bold">sehr fließfähig</td>
                          <td className="p-2.5 font-mono">F6 (630 – 700 mm)</td>
                          <td className="p-2.5">–</td>
                          <td className="p-2.5">–</td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="bg-indigo-50/40 hover:bg-indigo-50/70 border-l-4 border-l-indigo-500">
                          <td className="p-2.5 font-bold text-indigo-950">Selbstverdichtend (SVB)</td>
                          <td className="p-2.5 text-[11px] text-text-main/70">nicht anwendbar</td>
                          <td className="p-2.5 text-[11px] text-text-main/70">nicht anwendbar</td>
                          <td className="p-2.5 text-[11px] text-text-main/70">nicht anwendbar</td>
                          <td className="p-2.5 font-mono font-bold text-indigo-950">
                            SF1: 550–650 mm<br />
                            SF2: 660–750 mm<br />
                            SF3: 760–850 mm
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-text-main/60 mt-2">
                    * C4 gilt nach DIN EN 206 ausschließlich für Leichtbeton. Im üblichen Hochbau gilt <strong>F3</strong> (bzw. <strong>C2/C3</strong>) als praxiserprobte Regelkonsistenz für Kran- und Pumpbeton.
                  </p>
                </div>

                {/* Normative Grenzwerte-Tabelle */}
                <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30 text-xs">
                  <h4 className="font-bold text-text-main mb-2">Zulässige Grenzabmaße für Zielwerte (DIN EN 206 Tab. 21 / DIN 1045-2:2023-08)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-text-main/80">
                    <div className="bg-white p-3 rounded-xl border border-home-grau/20">
                      <span className="font-bold text-shiraz">Ausbreitmaß:</span>
                      <ul className="mt-1 space-y-0.5 list-disc list-inside">
                        <li>Zielwert ≤ 400 mm: ± 20 mm</li>
                        <li>Zielwert 410 – 540 mm: ± 30 mm</li>
                        <li>Zielwert ≥ 550 mm: ± 40 mm</li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-home-grau/20">
                      <span className="font-bold text-shiraz">Verdichtungsmaß:</span>
                      <ul className="mt-1 space-y-0.5 list-disc list-inside">
                        <li>Zielwert ≥ 1,26: ± 0,10</li>
                        <li>Zielwert 1,25 – 1,11: ± 0,08</li>
                        <li>Zielwert ≤ 1,10: ± 0,05</li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-home-grau/20">
                      <span className="font-bold text-shiraz">Setzmaß (Slump):</span>
                      <ul className="mt-1 space-y-0.5 list-disc list-inside">
                        <li>Zielwert ≤ 40 mm: ± 10 mm</li>
                        <li>Zielwert 50 – 90 mm: ± 20 mm</li>
                        <li>Zielwert 100 – 150 mm: ± 30 mm</li>
                        <li>Zielwert ≥ 160 mm: ± 40 mm</li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-home-grau/20">
                      <span className="font-bold text-shiraz">Setzfließmaß (SVB):</span>
                      <ul className="mt-1 space-y-0.5 list-disc list-inside">
                        <li>Alle Zielwerte (SF1–SF3): ± 40 mm</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interaktiver Grenzabmaß-Prüfer */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-text-main border-b border-home-grau/20 pb-2 flex items-center gap-2">
                    <Scale size={18} className="text-shiraz" /> Interaktiver Baustellen-Toleranzprüfer
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-text-main block mb-1">Prüfverfahren wählen</label>
                      <select 
                        value={verfahren}
                        onChange={(e) => {
                          const v = e.target.value as TestVerfahren;
                          setVerfahren(v);
                          if (v === 'ausbreitmass') { setZielwert(450); setMesswert(440); }
                          else if (v === 'verdichtungsmass') { setZielwert(1.18); setMesswert(1.15); }
                          else if (v === 'setzmass') { setZielwert(120); setMesswert(130); }
                          else if (v === 'setzfliessmass') { setZielwert(680); setMesswert(690); }
                        }}
                        className="w-full p-2.5 bg-off-white border border-home-grau/30 rounded-xl text-xs font-semibold"
                      >
                        <option value="ausbreitmass">Ausbreitmaß f (DIN EN 12350-5) [mm]</option>
                        <option value="verdichtungsmass">Verdichtungsmaß c (DIN EN 12350-4) [-]</option>
                        <option value="setzmass">Setzmaß s (DIN EN 12350-2) [mm]</option>
                        <option value="setzfliessmass">Setzfließmaß SF (DIN EN 12350-8) [mm]</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-text-main block mb-1">
                          Vereinbarter Zielwert {verfahren === 'verdichtungsmass' ? '[-]' : '[mm]'}
                        </label>
                        <input 
                          type="number"
                          step={verfahren === 'verdichtungsmass' ? '0.01' : '5'}
                          value={zielwert}
                          onChange={(e) => setZielwert(parseFloat(e.target.value) || 0)}
                          className="w-full p-2.5 bg-off-white border border-home-grau/30 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-main block mb-1">
                          Baustellen-Messwert {verfahren === 'verdichtungsmass' ? '[-]' : '[mm]'}
                        </label>
                        <input 
                          type="number"
                          step={verfahren === 'verdichtungsmass' ? '0.01' : '5'}
                          value={messwert}
                          onChange={(e) => setMesswert(parseFloat(e.target.value) || 0)}
                          className="w-full p-2.5 bg-off-white border border-home-grau/30 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ergebnis-Box */}
                  <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                    istKonform 
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' 
                      : 'bg-rose-50/70 border-rose-300 text-rose-950'
                  }`}>
                    <div className="flex items-center gap-2">
                      {istKonform ? (
                        <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle size={20} className="text-rose-600 shrink-0" />
                      )}
                      <span className="font-bold text-sm">
                        {istKonform ? 'Konform: Innerhalb der zulässigen Normtoleranz' : 'Nicht konform: Grenzabmaß überschritten'}
                      </span>
                    </div>

                    <div className="text-xs grid grid-cols-2 gap-2 pt-2 border-t border-black/10">
                      <div>
                        <span className="text-text-main/70 block">Zulässige Toleranz:</span>
                        <span className="font-mono font-bold">
                          ± {formatDeZahl(toleranz, verfahren === 'verdichtungsmass' ? 2 : 0)} {verfahren === 'verdichtungsmass' ? '' : 'mm'}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-main/70 block">Zulässiges Intervall:</span>
                        <span className="font-mono font-bold">
                          [{formatDeZahl(minZul, verfahren === 'verdichtungsmass' ? 2 : 0)} … {formatDeZahl(maxZul, verfahren === 'verdichtungsmass' ? 2 : 0)}]
                        </span>
                      </div>
                      <div>
                        <span className="text-text-main/70 block">Tatsächliche Abweichung:</span>
                        <span className="font-mono font-bold">
                          {abweichung > 0 ? '+' : ''}{formatDeZahl(abweichung, verfahren === 'verdichtungsmass' ? 2 : 0)} {verfahren === 'verdichtungsmass' ? '' : 'mm'}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-main/70 block">Klassenzuordnung:</span>
                        <span className="font-mono font-bold">
                          {verfahren === 'ausbreitmass' && (messwert < 350 ? 'F1' : messwert <= 410 ? 'F2' : messwert <= 480 ? 'F3' : messwert <= 550 ? 'F4' : messwert <= 620 ? 'F5' : 'F6')}
                          {verfahren === 'verdichtungsmass' && (messwert >= 1.46 ? 'C0' : messwert >= 1.26 ? 'C1' : messwert >= 1.11 ? 'C2' : messwert >= 1.04 ? 'C3' : 'C4')}
                          {verfahren === 'setzmass' && (messwert < 50 ? 'S1' : messwert <= 90 ? 'S2' : messwert <= 150 ? 'S3' : messwert <= 210 ? 'S4' : 'S5')}
                          {verfahren === 'setzfliessmass' && (messwert < 660 ? 'SF1' : messwert <= 750 ? 'SF2' : 'SF3')}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] mt-1 pt-2 border-t border-black/10 leading-relaxed">
                      <strong>Handlungsempfehlung auf der Baustelle:</strong>{' '}
                      {istKonform ? (
                        'Beton kann zum Einbau freigegeben werden. Einbaudauer und Witterungseinflüsse beachten.'
                      ) : abweichung < 0 ? (
                        'Beton ist zu steif: Nachdosierung von Fließmittel (FM) im Fahrmischer ausschließlich unter genauer Dokumentation nach DIN EN 206 Abs. 7.5 zulässig (Mischzeit mind. 1 min/m³, mind. 5 Minuten). Niemals eigenmächtig Wasser zugeben (w/z-Erhöhung führt zu Festigkeitsabfall und Verlust des Frost-Tausalz-Widerstands!).'
                      ) : (
                        'Beton ist zu weich / überflüssig: Entmischungsgefahr! Lieferschein und Dosierprotokoll prüfen. Bei unerlaubter Wasserzugabe muss die Fuhre zwingend abgewiesen werden.'
                      )}
                    </div>
                  </div>
                </div>

                {/* Info-Card */}
                <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-xs leading-relaxed text-text-main/80">
                  <h4 className="font-bold text-shiraz mb-1">Normativer Hinweis zur Probenahme (DIN EN 12350-1)</h4>
                  <p>
                    Die Probenahme aus dem Fahrmischer darf erst nach Entladen des ersten Drittels (mindestens 0,2 m³) und vor Entladen des letzten Drittels erfolgen, um repräsentative Messwerte sicherzustellen.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Ausbreitversuch & Rheologie */}
        {activeTab === 'ausbreitversuch' && (
          <div className="animate-in fade-in duration-300">
            <Ausbreitversuch />
          </div>
        )}

        {/* Tab 3: Luftporen & Rohdichte */}
        {activeTab === 'luftporen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Rechner Luftporen und Rohdichte */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-text-main border-b border-home-grau/20 pb-2 flex items-center gap-2">
                    <Wind size={18} className="text-shiraz" /> Frischbeton-Luftgehalt (DIN EN 12350-7)
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-text-main block mb-1">Expositionsklasse</label>
                        <select
                          value={expKlasse}
                          onChange={(e) => setExpKlasse(e.target.value as 'XF2' | 'XF4' | 'X0_XF1_XF3')}
                          className="w-full p-2.5 bg-off-white border border-home-grau/30 rounded-xl text-xs font-semibold"
                        >
                          <option value="XF4">XF4 (hohe Tausalzbelastung, LP-Beton)</option>
                          <option value="XF2">XF2 (mäßige Tausalzbelastung, LP-Beton)</option>
                          <option value="X0_XF1_XF3">X0 / XF1 / XF3 (ohne LP-Anforderung)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-text-main block mb-1">Größtkorn D_max [mm]</label>
                        <select
                          value={dMax}
                          onChange={(e) => setDMax(parseInt(e.target.value) as 8 | 16 | 32 | 63)}
                          className="w-full p-2.5 bg-off-white border border-home-grau/30 rounded-xl text-xs font-semibold"
                        >
                          <option value="8">8 mm</option>
                          <option value="16">16 mm</option>
                          <option value="32">32 mm</option>
                          <option value="63">63 mm</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-text-main block mb-1">Ablesung Manometer L_abg [%]</label>
                        <input 
                          type="number"
                          step="0.1"
                          min="0"
                          max="20"
                          value={lAbg}
                          onChange={(e) => setLAbg(parseFloat(e.target.value) || 0)}
                          className="w-full p-2.5 bg-off-white border border-home-grau/30 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-text-main block mb-1">Gesteinskorrektur G [%]</label>
                        <input 
                          type="number"
                          step="0.1"
                          min="0"
                          max="2"
                          value={kGestein}
                          onChange={(e) => setKGestein(parseFloat(e.target.value) || 0)}
                          className="w-full p-2.5 bg-off-white border border-home-grau/30 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ergebnis Luftgehalt */}
                  <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                    lpKonform 
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' 
                      : 'bg-rose-50/70 border-rose-300 text-rose-950'
                  }`}>
                    <div className="flex items-center gap-2">
                      {lpKonform ? (
                        <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle size={20} className="text-rose-600 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-sm block">
                          Tatsächlicher Luftgehalt: {formatDeZahl(lEffektiv, 1)} Vol.-%
                        </span>
                        <span className="text-xs text-text-main/70">
                          (Berechnet: L = {formatDeZahl(lAbg, 1)} % - {formatDeZahl(kGestein, 1)} %)
                        </span>
                      </div>
                    </div>

                    {expKlasse !== 'X0_XF1_XF3' && (
                      <div className="text-xs pt-2 border-t border-black/10 grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-text-main/70 block">Geforderter Mindestwert:</span>
                          <span className="font-mono font-bold">≥ {formatDeZahl(minLpGefordert, 1)} Vol.-%</span>
                        </div>
                        <div>
                          <span className="text-text-main/70 block">Zulässiger Einzelwert (Tab. 21):</span>
                          <span className="font-mono font-bold">≥ {formatDeZahl(minLpEinzelwert, 1)} Vol.-%</span>
                        </div>
                      </div>
                    )}

                    <div className="text-[11px] pt-1 text-text-main/80">
                      {expKlasse === 'X0_XF1_XF3' ? (
                        'Keine bauaufsichtliche Mindestluftporenanforderung für diese Expositionsklasse.'
                      ) : lpKonform ? (
                        'Anforderung nach DIN 1045-2:2023-08 Tab. F.2.2 erfüllt. Frost-Tausalz-Widerstand gewährleistet.'
                      ) : (
                        'Achtung: Mindestluftporengehalt unterschritten! Hohes Risiko für Frost-Tausalz-Schäden (Abplatzungen). Beton darf nicht in XF2/XF4 eingebaut werden.'
                      )}
                    </div>
                  </div>
                </div>

                {/* Frischbetonrohdichte nach DIN EN 12350-6 */}
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-text-main border-b border-home-grau/20 pb-2 flex items-center gap-2">
                    <Scale size={18} className="text-shiraz" /> Frischbetonrohdichte (DIN EN 12350-6)
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-text-main block mb-1">m1 Topf leer [kg]</label>
                      <input 
                        type="number"
                        step="0.1"
                        value={m1}
                        onChange={(e) => setM1(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 bg-off-white border border-home-grau/30 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-main block mb-1">m2 Topf voll [kg]</label>
                      <input 
                        type="number"
                        step="0.1"
                        value={m2}
                        onChange={(e) => setM2(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 bg-off-white border border-home-grau/30 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-main block mb-1">Volumen [Liter]</label>
                      <input 
                        type="number"
                        step="0.1"
                        value={volumenL}
                        onChange={(e) => setVolumenL(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 bg-off-white border border-home-grau/30 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="bg-off-white p-3 rounded-xl border border-home-grau/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-text-main/70 block">Frischbetonrohdichte D:</span>
                      <span className="text-xs text-text-main/60">D = (m2 - m1) / V</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-shiraz">{formatDeZahl(rohdichte, 0)} kg/m³</span>
                      <span className="text-[10px] text-text-main/60 block">
                        {rohdichte > 2600 ? 'Schwerbeton' : rohdichte >= 2000 ? 'Normalbeton' : 'Leichtbeton'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Normatives Hintergrundwissen zu XF und Luftporen */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-3 text-xs leading-relaxed">
                  <h3 className="text-base font-bold text-text-main border-b border-home-grau/20 pb-2">
                    Mindestluftgehalte nach DIN 1045-2:2023-08 Tab. F.2.2
                  </h3>
                  <p className="text-text-main/80">
                    Bei Betonen mit hohem Frost-Tausalz-Widerstand (Expositionsklassen <strong>XF2</strong> und <strong>XF4</strong>) muss durch Zusatz von Luftporenbildnern (LP) ein künstliches System fein verteilter Mikroluftporen erzeugt werden:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-off-white border-b border-home-grau/30 font-bold">
                          <th className="p-2">Größtkorn D_max</th>
                          <th className="p-2">Mindestluftgehalt (Mittelwert)</th>
                          <th className="p-2">Zul. Mindesteinzelwert</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-home-grau/20">
                        <tr>
                          <td className="p-2 font-mono font-bold">8 mm</td>
                          <td className="p-2 font-mono text-shiraz font-bold">≥ 5,5 Vol.-%</td>
                          <td className="p-2 font-mono">≥ 5,0 Vol.-%</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono font-bold">16 mm</td>
                          <td className="p-2 font-mono text-shiraz font-bold">≥ 4,5 Vol.-%</td>
                          <td className="p-2 font-mono">≥ 4,0 Vol.-%</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono font-bold">32 mm</td>
                          <td className="p-2 font-mono text-shiraz font-bold">≥ 4,0 Vol.-%</td>
                          <td className="p-2 font-mono">≥ 3,5 Vol.-%</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono font-bold">63 mm</td>
                          <td className="p-2 font-mono text-shiraz font-bold">≥ 3,5 Vol.-%</td>
                          <td className="p-2 font-mono">≥ 3,0 Vol.-%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-amber-950 mt-2">
                    <h4 className="font-bold mb-1">Einfluss auf die Druckfestigkeit (Faustregel)</h4>
                    <p className="text-[11px]">
                      Jedes zusätzliche Prozent Luftgehalt verringert die Druckfestigkeit des erhärteten Betons um ca. <strong>3 bis 5 N/mm²</strong> (entspricht ca. 5 bis 10 %). Daher darf der Luftgehalt auf der Baustelle auch nach oben hin nicht unbegrenzt streuen (Richtwert: max. 4 Vol.-% über Sollwert).
                    </p>
                  </div>

                  <div className="bg-off-white p-3 rounded-xl border border-home-grau/20 text-[11px] text-text-main/80">
                    <h4 className="font-bold text-shiraz mb-1">Abstandsfaktor L nach DIN EN 480-11</h4>
                    <p>
                      Für die Frostbeständigkeit ist nicht der Gesamtluftgehalt allein entscheidend, sondern die Verteilung im Zementstein. Der am Festbeton mikroskopisch bestimmte <strong>Abstandsfaktor L</strong> muss für XF4 im Mittel <strong>≤ 0,20 mm</strong> betragen.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: Frischbetondruck */}
        {activeTab === 'frischbetondruck' && (
          <div className="animate-in fade-in duration-300">
            <Frischbetondruck />
          </div>
        )}

        {/* Tab 5: Frischbetontemperatur */}
        {activeTab === 'frischbetontemperatur' && (
          <div className="animate-in fade-in duration-300">
            <Frischbetontemperatur />
          </div>
        )}
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Frischbeton', url: 'https://de.wikipedia.org/wiki/Frischbeton' },
          { title: 'Konsistenz (Beton)', url: 'https://de.wikipedia.org/wiki/Konsistenz_(Beton)' },
          { title: 'Luftporenbildner', url: 'https://de.wikipedia.org/wiki/Luftporenbildner' },
          { title: 'Schalung (Beton)', url: 'https://de.wikipedia.org/wiki/Schalung_(Beton)' }
        ]}
        literatur={[
          'Heidelberg Materials / InformationsZentrum Beton: Betontechnische Daten (Stand 2022 / aktualisiert nach DIN 1045-2:2023-08)',
          'Grübl, P.; Weigler, H.; Siebel, E.: Beton: Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner'
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 (Beton: Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+206' },
          { title: 'DIN 1045-2:2023-08 (Tragwerke aus Beton - Teil 2: Anwendungsregeln zu DIN EN 206)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2' },
          { title: 'DIN EN 12350-1 bis 12350-8:2019-09 (Prüfung von Frischbeton)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12350' },
          { title: 'DIN 18218:2010-01 (Frischbetondruck auf vertikale Schalungen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+18218' }
        ]}
        formeln={[
          {
            formel: 'L = L_{\\text{abg}} - G \\quad [\\%]',
            erklaerung: 'Tatsächlicher Luftgehalt L im Frischbeton nach Druckausgleichsverfahren (DIN EN 12350-7) aus der Manometerablesung Labg abzüglich des Gesteinskorrekturfaktors G.',
            quelle: 'DIN EN 12350-7:2019-09'
          },
          {
            formel: 'D = \\frac{m_2 - m_1}{V} \\quad [\\text{kg/m}^3]',
            erklaerung: 'Frischbetonrohdichte D nach DIN EN 12350-6: m1 = Leermasse Behälter, m2 = Masse gefüllter/verdichteter Behälter, V = Behältervolumen (typ. 8 Liter = 0,008 m³).',
            quelle: 'DIN EN 12350-6:2019-09'
          },
          {
            formel: 'f = \\frac{d_1 + d_2}{2} \\quad [\\text{mm}]',
            erklaerung: 'Ausbreitmaß f nach DIN EN 12350-5: Arithmetischer Mittelwert aus zwei kreuzweise gemessenen Durchmessern des Betonkuchens nach 15 Hubschlägen auf dem Ausbreittisch.',
            quelle: 'DIN EN 12350-5:2019-09'
          },
          {
            formel: 'T_{\\text{Misch}} = \\frac{\\sum (m_i \\cdot c_i \\cdot T_i)}{\\sum (m_i \\cdot c_i)} \\quad [^{\\circ}\\text{C}]',
            erklaerung: 'Frischbetonmischungstemperatur aus den spezifischen Wärmekapazitäten ci, Massen mi und Ausgangstemperaturen Ti der Ausgangsstoffe.',
            quelle: 'DIN EN 206 / DBV-Merkblatt'
          },
          {
            formel: '\\sigma_{hk,\\text{max}} = \\min\\left(\\gamma_c \\cdot h_s, \\; \\alpha_k \\cdot (v \\cdot t_E + d_s)\\right) \\quad [\\text{kN/m}^2]',
            erklaerung: 'Charakteristischer horizontaler Frischbetondruck nach DIN 18218.',
            quelle: 'DIN 18218:2010-01'
          }
        ]}
      />
    </div>
  );
}
