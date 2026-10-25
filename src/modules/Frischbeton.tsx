import React, { useState } from 'react';
import { Waves, Gauge, Thermometer, Layers, CheckCircle2, AlertTriangle, Scale, Wind } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { formatDeZahl } from '@/src/utils/numberFormat';
import Ausbreitversuch from './Ausbreitversuch';
import Frischbetondruck from './Frischbetondruck';
import Frischbetontemperatur from './Frischbetontemperatur';
import inhalt from '@/content/frischbeton/Frischbeton.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
        return 50; // Setzfließmaß: ± 50 mm
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
  // Einzelwertkriterium nach DIN 1045-2 (Fußnote zur Grenzwerttabelle): höchstens 0,5 Vol.-% unter dem Mindestwert
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
          <Waves className="text-shiraz" /><MdText text={inhalt.texte.frischbetonBaustellenprüfungen} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.vollständigePrüfungKonsistenzklassifizie} /></p>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-xs">
            <strong className="mr-1">Lernpfad:</strong>
            {([
              ['konsistenz', inhalt.werte.konsistenzToleranzen], ['ausbreitversuch', 'Ausbreitversuch'], ['luftporen', inhalt.werte.luftgehaltRohdichte],
              ['frischbetontemperatur', 'Frischbetontemperatur'], ['frischbetondruck', 'Frischbetondruck'],
            ] as const).map(([id, label], i) => (
              <React.Fragment key={id}>
                {i > 0 && <span className="text-text-main/40">→</span>}
                <button onClick={() => setActiveTab(id)} className="underline decoration-dotted hover:text-shiraz cursor-pointer">{i + 1}. {label}</button>
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button aria-pressed={activeTab === 'konsistenz'} 
            onClick={() => setActiveTab('konsistenz')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'konsistenz' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Layers size={16} /><MdText text={inhalt.texte.konsistenzklassenGrenzabmaße} /></button>
          <button aria-pressed={activeTab === 'ausbreitversuch'} 
            onClick={() => setActiveTab('ausbreitversuch')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'ausbreitversuch' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Waves size={16} /><MdText text={inhalt.texte.ausbreitversuchRheologie} /></button>
          <button aria-pressed={activeTab === 'luftporen'} 
            onClick={() => setActiveTab('luftporen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'luftporen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Wind size={16} /><MdText text={inhalt.texte.luftporenRohdichte} /></button>
          <button aria-pressed={activeTab === 'frischbetondruck'} 
            onClick={() => setActiveTab('frischbetondruck')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'frischbetondruck' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Gauge size={16} /><MdText text={inhalt.texte.frischbetondruckDin18218} /></button>
          <button aria-pressed={activeTab === 'frischbetontemperatur'} 
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
                    <Layers size={18} className="text-shiraz" /><MdText text={inhalt.texte.konsistenzbereicheNachDinEn} /></h3>
                  <p className="text-xs text-text-main/70 mb-4"><MdText text={inhalt.texte.gegenüberstellungDerFünfGenormten} /></p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                          <th className="p-2.5">Konsistenzbereich</th>
                          <th className="p-2.5">Ausbreitmaß <br /><span className="text-[10px] text-text-main/60"><MdText text={inhalt.texte.fDinEn12350} /></span></th>
                          <th className="p-2.5">Verdichtungsmaß <br /><span className="text-[10px] text-text-main/60"><MdText text={inhalt.texte.cDinEn12350} /></span></th>
                          <th className="p-2.5">Setzmaß <br /><span className="text-[10px] text-text-main/60"><MdText text={inhalt.texte.sDinEn12350} /></span></th>
                          <th className="p-2.5">Setzfließmaß <br /><span className="text-[10px] text-text-main/60"><MdText text={inhalt.texte.sfDinEn12350} /></span></th>
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
                          <td className="p-2.5 font-mono"><MdText text={inhalt.texte.f1340Mm} /></td>
                          <td className="p-2.5 font-mono"><MdText text={inhalt.texte.c11451} /></td>
                          <td className="p-2.5 font-mono"><MdText text={inhalt.texte.s11040Mm} /></td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="hover:bg-off-white/50">
                          <td className="p-2.5 font-bold">plastisch</td>
                          <td className="p-2.5 font-mono"><MdText text={inhalt.texte.f2350410Mm} /></td>
                          <td className="p-2.5 font-mono"><MdText text={inhalt.texte.c21251} /></td>
                          <td className="p-2.5 font-mono"><MdText text={inhalt.texte.s25090Mm} /></td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="bg-amber-50/40 hover:bg-amber-50/70 border-l-4 border-l-amber-500">
                          <td className="p-2.5 font-bold text-amber-900"><MdText text={inhalt.texte.weichRegelkonsistenz} /></td>
                          <td className="p-2.5 font-mono font-bold text-amber-900"><MdText text={inhalt.texte.f3420480Mm} /></td>
                          <td className="p-2.5 font-mono font-bold text-amber-900"><MdText text={inhalt.texte.c31101} /></td>
                          <td className="p-2.5 font-mono font-bold text-amber-900"><MdText text={inhalt.texte.s3100150Mm} /></td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="hover:bg-off-white/50">
                          <td className="p-2.5 font-bold">sehr weich</td>
                          <td className="p-2.5 font-mono"><MdText text={inhalt.texte.f4490550Mm} /></td>
                          <td className="p-2.5 font-mono"><MdText text={inhalt.texte.c4104} /></td>
                          <td className="p-2.5 font-mono"><MdText text={inhalt.texte.s4160210Mm} /></td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="hover:bg-off-white/50">
                          <td className="p-2.5 font-bold">fließfähig</td>
                          <td className="p-2.5 font-mono"><MdText text={inhalt.texte.f5560620Mm} /></td>
                          <td className="p-2.5">–</td>
                          <td className="p-2.5 font-mono"><MdText text={inhalt.texte.s5220Mm} /></td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="hover:bg-off-white/50">
                          <td className="p-2.5 font-bold"><MdText text={inhalt.texte.sehrFließfähig} /></td>
                          <td className="p-2.5 font-mono"><MdText text={inhalt.texte.f6630700Mm} /></td>
                          <td className="p-2.5">–</td>
                          <td className="p-2.5">–</td>
                          <td className="p-2.5">–</td>
                        </tr>
                        <tr className="bg-indigo-50/40 hover:bg-indigo-50/70 border-l-4 border-l-indigo-500">
                          <td className="p-2.5 font-bold text-indigo-950"><MdText text={inhalt.texte.selbstverdichtendSvb} /></td>
                          <td className="p-2.5 text-[11px] text-text-main/70"><MdText text={inhalt.texte.nichtAnwendbar} /></td>
                          <td className="p-2.5 text-[11px] text-text-main/70"><MdText text={inhalt.texte.nichtAnwendbar2} /></td>
                          <td className="p-2.5 text-[11px] text-text-main/70"><MdText text={inhalt.texte.nichtAnwendbar3} /></td>
                          <td className="p-2.5 font-mono font-bold text-indigo-950"><MdText text={inhalt.texte.sf1550650Mm} /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-text-main/60 mt-2"><MdText text={inhalt.texte.c4GiltNachDin} /></p>
                </div>

                {/* Normative Grenzwerte-Tabelle */}
                <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30 text-xs">
                  <h4 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.zulässigeGrenzabmaßeFürZielwerte} /></h4>
                  <p className="text-[11px] text-text-main/60 mb-2"><MdText text={inhalt.texte.werteFürAusbreitUnd} /></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-text-main/80">
                    <div className="bg-white p-3 rounded-xl border border-home-grau/20">
                      <span className="font-bold text-shiraz">Ausbreitmaß:</span>
                      <ul className="mt-1 space-y-0.5 list-disc list-inside">
                        <li><MdText text={inhalt.texte.zielwert400Mm20} /></li>
                        <li><MdText text={inhalt.texte.zielwert410540Mm} /></li>
                        <li><MdText text={inhalt.texte.zielwert550Mm40} /></li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-home-grau/20">
                      <span className="font-bold text-shiraz">Verdichtungsmaß:</span>
                      <ul className="mt-1 space-y-0.5 list-disc list-inside">
                        <li><MdText text={inhalt.texte.zielwert1260} /></li>
                        <li><MdText text={inhalt.texte.zielwert1251} /></li>
                        <li><MdText text={inhalt.texte.zielwert1100} /></li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-home-grau/20">
                      <span className="font-bold text-shiraz"><MdText text={inhalt.texte.setzmaßSlump} /></span>
                      <ul className="mt-1 space-y-0.5 list-disc list-inside">
                        <li><MdText text={inhalt.texte.zielwert40Mm10} /></li>
                        <li><MdText text={inhalt.texte.zielwert5090Mm} /></li>
                        <li><MdText text={inhalt.texte.zielwert100150Mm} /></li>
                        <li><MdText text={inhalt.texte.zielwert160Mm40} /></li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-home-grau/20">
                      <span className="font-bold text-shiraz"><MdText text={inhalt.texte.setzfließmaßSvb} /></span>
                      <ul className="mt-1 space-y-0.5 list-disc list-inside">
                        <li><MdText text={inhalt.texte.alleZielwerteSf1Sf3} /></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interaktiver Grenzabmaß-Prüfer */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-text-main border-b border-home-grau/20 pb-2 flex items-center gap-2">
                    <Scale size={18} className="text-shiraz" /><MdText text={inhalt.texte.interaktiverBaustellenToleranzprüfer} /></h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-text-main block mb-1"><MdText text={inhalt.texte.prüfverfahrenWählen} /></label>
                      <select aria-label={inhalt.werte.prüfverfahrenWählen} 
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
                        <label className="text-xs font-bold text-text-main block mb-1"><MdText text={inhalt.texte.vereinbarterZielwert} />{verfahren === 'verdichtungsmass' ? '[-]' : '[mm]'}
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
                        {istKonform ? inhalt.werte.konformInnerhalbDerZulässigen : inhalt.werte.nichtKonformGrenzabmaßÜberschritten}
                      </span>
                    </div>

                    <div className="text-xs grid grid-cols-2 gap-2 pt-2 border-t border-black/10">
                      <div>
                        <span className="text-text-main/70 block"><MdText text={inhalt.texte.zulässigeToleranz} /></span>
                        <span className="font-mono font-bold">
                          ± {formatDeZahl(toleranz, verfahren === 'verdichtungsmass' ? 2 : 0)} {verfahren === 'verdichtungsmass' ? '' : 'mm'}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-main/70 block"><MdText text={inhalt.texte.zulässigesIntervall} /></span>
                        <span className="font-mono font-bold">
                          [{formatDeZahl(minZul, verfahren === 'verdichtungsmass' ? 2 : 0)} … {formatDeZahl(maxZul, verfahren === 'verdichtungsmass' ? 2 : 0)}]
                        </span>
                      </div>
                      <div>
                        <span className="text-text-main/70 block"><MdText text={inhalt.texte.tatsächlicheAbweichung} /></span>
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

                    <div className="text-[11px] mt-1 pt-2 border-t border-black/10 leading-relaxed"><MdText text={inhalt.texte.handlungsempfehlungAufDerBaustelle} />{istKonform ? (
                        inhalt.werte.betonKannZumEinbau
                      ) : abweichung < 0 ? (
                        inhalt.werte.betonIstZuSteif
                      ) : (
                        inhalt.werte.betonIstZuWeich
                      )}
                    </div>
                  </div>
                </div>

                {/* Info-Card */}
                <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-xs leading-relaxed text-text-main/80">
                  <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.normativerHinweisZurProbenahme} /></h4>
                  <p><MdText text={inhalt.texte.dieProbenahmeAusDem} /></p>
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
                    <Wind size={18} className="text-shiraz" /><MdText text={inhalt.texte.frischbetonLuftgehaltDinEn} /></h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-text-main block mb-1">Expositionsklasse</label>
                        <select aria-label="Expositionsklasse"
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
                        <label className="text-xs font-bold text-text-main block mb-1"><MdText text={inhalt.texte.größtkornDMaxMm} /></label>
                        <select aria-label={inhalt.werte.größtkornDMaxMm}
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
                        <label className="text-xs font-bold text-text-main block mb-1"><MdText text={inhalt.texte.ablesungManometerLAbg} /></label>
                        <input aria-label={inhalt.werte.ablesungManometerLAbg} 
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
                        <label className="text-xs font-bold text-text-main block mb-1"><MdText text={inhalt.texte.gesteinskorrekturG} /></label>
                        <input aria-label={inhalt.werte.gesteinskorrekturG} 
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
                        <span className="font-bold text-sm block"><MdText text={inhalt.texte.tatsächlicherLuftgehalt} />{formatDeZahl(lEffektiv, 1)} Vol.-%
                        </span>
                        <span className="text-xs text-text-main/70"><MdText text={inhalt.texte.berechnetL} />{formatDeZahl(lAbg, 1)} % - {formatDeZahl(kGestein, 1)} %)
                        </span>
                      </div>
                    </div>

                    {expKlasse !== 'X0_XF1_XF3' && (
                      <div className="text-xs pt-2 border-t border-black/10 grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-text-main/70 block"><MdText text={inhalt.texte.geforderterMindestwert} /></span>
                          <span className="font-mono font-bold">≥ {formatDeZahl(minLpGefordert, 1)} Vol.-%</span>
                        </div>
                        <div>
                          <span className="text-text-main/70 block"><MdText text={inhalt.texte.zulässigerEinzelwertDin1045} /></span>
                          <span className="font-mono font-bold">≥ {formatDeZahl(minLpEinzelwert, 1)} Vol.-%</span>
                        </div>
                      </div>
                    )}

                    <div className="text-[11px] pt-1 text-text-main/80">
                      {expKlasse === 'X0_XF1_XF3' ? (
                        inhalt.werte.keineBauaufsichtlicheMindestluftporenanf
                      ) : lpKonform ? (
                        inhalt.werte.anforderungNachDin1045
                      ) : (
                        inhalt.werte.achtungMindestluftporengehaltUnterschrit
                      )}
                    </div>
                  </div>
                </div>

                {/* Frischbetonrohdichte nach DIN EN 12350-6 */}
                <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-text-main border-b border-home-grau/20 pb-2 flex items-center gap-2">
                    <Scale size={18} className="text-shiraz" /><MdText text={inhalt.texte.frischbetonrohdichteDinEn12350} /></h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-text-main block mb-1"><MdText text={inhalt.texte.m1TopfLeerKg} /></label>
                      <input aria-label={inhalt.werte.m1TopfLeerKg} 
                        type="number"
                        step="0.1"
                        value={m1}
                        onChange={(e) => setM1(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 bg-off-white border border-home-grau/30 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-main block mb-1"><MdText text={inhalt.texte.m2TopfVollKg} /></label>
                      <input aria-label={inhalt.werte.m2TopfVollKg} 
                        type="number"
                        step="0.1"
                        value={m2}
                        onChange={(e) => setM2(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 bg-off-white border border-home-grau/30 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-main block mb-1"><MdText text={inhalt.texte.volumenLiter} /></label>
                      <input aria-label={inhalt.werte.volumenLiter} 
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
                      <span className="text-xs text-text-main/70 block"><MdText text={inhalt.texte.frischbetonrohdichteD} /></span>
                      <span className="text-xs text-text-main/60"><MdText text={inhalt.texte.dM2M1V} /></span>
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
                  <h3 className="text-base font-bold text-text-main border-b border-home-grau/20 pb-2"><MdText text={inhalt.texte.mindestluftgehalteNachDin1045} /></h3>
                  <p className="text-text-main/80"><MdText text={inhalt.texte.beiBetonenMitHohem} /></p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-off-white border-b border-home-grau/30 font-bold">
                          <th className="p-2"><MdText text={inhalt.texte.größtkornDMax} /></th>
                          <th className="p-2"><MdText text={inhalt.texte.mindestluftgehaltMittelwert} /></th>
                          <th className="p-2"><MdText text={inhalt.texte.zulMindesteinzelwert} /></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-home-grau/20">
                        <tr>
                          <td className="p-2 font-mono font-bold">8 mm</td>
                          <td className="p-2 font-mono text-shiraz font-bold"><MdText text={inhalt.texte.t55Vol} /></td>
                          <td className="p-2 font-mono"><MdText text={inhalt.texte.t50Vol} /></td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono font-bold">16 mm</td>
                          <td className="p-2 font-mono text-shiraz font-bold"><MdText text={inhalt.texte.t45Vol} /></td>
                          <td className="p-2 font-mono"><MdText text={inhalt.texte.t40Vol} /></td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono font-bold">32 mm</td>
                          <td className="p-2 font-mono text-shiraz font-bold"><MdText text={inhalt.texte.t40Vol2} /></td>
                          <td className="p-2 font-mono"><MdText text={inhalt.texte.t35Vol} /></td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono font-bold">63 mm</td>
                          <td className="p-2 font-mono text-shiraz font-bold"><MdText text={inhalt.texte.t35Vol2} /></td>
                          <td className="p-2 font-mono"><MdText text={inhalt.texte.t30Vol} /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-amber-950 mt-2">
                    <h4 className="font-bold mb-1"><MdText text={inhalt.texte.einflussAufDieDruckfestigkeit} /></h4>
                    <p className="text-[11px]"><MdText text={inhalt.texte.jedesZusätzlicheProzentLuftgehalt} /></p>
                  </div>

                  <div className="bg-off-white p-3 rounded-xl border border-home-grau/20 text-[11px] text-text-main/80">
                    <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.abstandsfaktorLPrüfungNach} /></h4>
                    <p><MdText text={inhalt.texte.fürDieFrostbeständigkeitIst} /></p>
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

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielLuftgehaltBeiXf4}
        zielGleichung="L = L_{abg} - G \ge L_{min} - 0{,}5\,\%"
        normQuelle={inhalt.werte.dinEn123507}
        schritte={inhalt.daten["Frischbeton.schritte"]}
        ergebnisHinweis={inhalt.werte.t46LuftgehaltAnforderung}
      />

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielFrischbetondruckAufEin}
        zielGleichung="\sigma_{hk,max} = (14\,v + 18) \cdot K_1 \ge 25\,\text{kN/m}^2"
        normQuelle={inhalt.werte.din18218201001}
        schritte={inhalt.daten["Frischbeton.schritte_2"]}
        ergebnisHinweis={inhalt.werte.bemessungsdruckFürDieSchalung}
      />

      <ModulTest moduleId="frischbeton" />

      <ModuleFooter
        weblinks={[
          { title: inhalt.werte.betonWikiFrischbetondruck, url: 'https://beton.wiki/index.php?title=Frischbetondruck' },
          { title: inhalt.werte.betonWikiFrischbetontemperatur, url: 'https://beton.wiki/index.php?title=Frischbetontemperatur' }
        ]}
        wikipedia={[
          { title: 'Frischbeton', url: 'https://de.wikipedia.org/wiki/Frischbeton' },
          { title: inhalt.werte.konsistenzBeton, url: 'https://de.wikipedia.org/wiki/Konsistenz_(Beton)' },
          { title: 'Ausbreitmaß', url: 'https://de.wikipedia.org/wiki/Ausbreitma%C3%9F' },
          { title: 'Bingham-Fluid', url: 'https://de.wikipedia.org/wiki/Bingham-Fluid' },
          { title: 'Luftporenbildner', url: 'https://de.wikipedia.org/wiki/Luftporenbildner' },
          { title: inhalt.werte.richmannscheMischungsregel, url: 'https://de.wikipedia.org/wiki/Richmannsche_Mischungsregel' },
          { title: 'Frischbetondruck', url: 'https://de.wikipedia.org/wiki/Frischbetondruck' },
          { title: inhalt.werte.schalungBeton, url: 'https://de.wikipedia.org/wiki/Schalung_(Beton)' }
        ]}
        literatur={inhalt.daten["Frischbeton.literatur"]}
        regelwerke={inhalt.daten["Frischbeton.regelwerke"]}
        formeln={inhalt.daten["Frischbeton.formeln"]}
      />
    </div>
  );
}
