import React from 'react';
import { 
  BookOpen, 
  Layers, 
  Droplets, 
  TrendingUp, 
  ShieldAlert, 
  Calculator,
  CheckCircle2,
  FileText,
  ArrowRight,
  Sliders,
  Info
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';

export default function BetonAZ() {
  const { setActiveTab } = useTabContext();

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-800">
      
      {/* --- Unified Header: Clean Cockpit Theme --- */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <BookOpen className="text-shiraz" /> Beton A–Z
        </h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Zentrales ingenieurtechnisches Nachschlagewerk der Betontechnologie. Dieses Handbuch beschreibt die grundlegenden Dauerhaftigkeits-, Verarbeitungs- und Mischungsparameter und verweist direkt auf die interaktiven Berechnungsmodule des Baustoffboards.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2 border-t border-home-grau/20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-home-grau/30 text-slate-700 text-xs font-semibold tracking-wide">
            DIN EN 206 / DIN 1045-2 Ingenieur-Übersicht
          </div>
          <div className="bg-slate-50 border border-home-grau/30 px-4 py-2.5 rounded-lg text-xs font-mono text-slate-600 flex gap-4 items-center shrink-0">
            <span>⚙️ System: Standard-Referenz</span>
            <span>📅 Status: Normgrundlage DIN EN 206 / DIN 1045-2:2023-08</span>
          </div>
        </div>
      </div>

      {/* --- Pillars Grid of Beton A-Z --- */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Pillar 1: Mischungsberechnung */}
        <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="text-shiraz" size={22} />
              <h2 className="text-base font-bold text-slate-950 font-sans">1. Stoffraumrechnung & Mischungsberechnung</h2>
            </div>
            <button 
              onClick={() => setActiveTab('mischungsberechnung')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Mischungsrechner öffnen <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Grundlage jeder Betonrezeptur ist die <strong>absolute Volumenrechnung (Stoffraumgleichung)</strong> als Grundgleichung der Mischungsberechnung. 
                Sie fordert, dass die Summe der absoluten Einzelvolumina aller Komponenten (Zement, Zusatzstoffe, wirksames Wasser, Luftporen und Gesteinskörnung) 
                exakt einen verdichteten Frischbeton von 1 m³ (1000 dm³) ergibt. 
                Zur Reduktion von CO₂-Emissionen wird nach dem k-Wert-Konzept ein Teil des Zements durch Flugasche oder Silikastaub funktional ersetzt.
              </p>

              <div className="p-3.5 bg-slate-50 border border-home-grau/30 rounded-lg text-xs font-sans space-y-2">
                <span className="font-bold text-slate-800">Die fundamentale Stoffraumgleichung:</span>
                <div className="font-mono text-[13px] text-slate-900 border-l-2 border-shiraz/45 pl-3 py-1">
                  <FormulaText text="V_z + V_f + V_w + V_L + V_g = 1000 \, \text{dm}^3" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono grid grid-cols-3 gap-1">
                  <span>V_z = M_z / &rho;_z (Zement)</span>
                  <span>V_f = M_f / &rho;_f (Zusatzstoff)</span>
                  <span>V_w = M_w / &rho;_w (Wasser)</span>
                  <span>V_L = Luftporenvolumen</span>
                  <span>V_g = M_g / &rho;_g (Körnung)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between font-sans">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Standardwerte der Komponenten</span>
                <table className="min-w-full text-left text-[11px] text-slate-700 mt-2 break-normal">
                  <thead>
                    <tr className="border-b border-home-grau/30 text-[9px] text-slate-400 font-bold uppercase">
                      <th className="pb-1.5">Material</th>
                      <th className="pb-1.5">Typischer Gehalt</th>
                      <th className="pb-1.5">Rohdichte</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-1 px-0 font-medium">Zement</td>
                      <td className="py-1 px-0">280 – 360 kg/m³</td>
                      <td className="py-1 px-0 font-mono">3,00 – 3,15 kg/dm³</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-0 font-medium">Flugasche</td>
                      <td className="py-1 px-0">0 – 150 kg/m³</td>
                      <td className="py-1 px-0 font-mono">2,10 – 2,30 kg/dm³</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-0 font-medium">Wasser</td>
                      <td className="py-1 px-0">140 – 190 kg/m³</td>
                      <td className="py-1 px-0 font-mono">1,00 kg/dm³</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-0 font-medium">Gestein</td>
                      <td className="py-1 px-0">1700 – 1950 kg/m³</td>
                      <td className="py-1 px-0 font-mono">2,60 – 2,70 kg/dm³</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-3.5 border-t border-home-grau/30">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-sans">Zusatzstoffanrechnung:</span>
                <span className="text-[11px] text-slate-600 block mt-1">
                  Der äquivalente Wasserzementwert gilt nach: <FormulaText text="(w/z)_{eq} = M_w / (M_z + k \cdot M_f)" /> (Flugasche Beiwert <span className="font-mono">k = 0,4</span>).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Gefüge & w/z-Wert */}
        <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="text-shiraz" size={22} />
              <h2 className="text-base font-bold text-slate-950 font-sans">2. Gefügekapillarität & Wasserzementwert-Einfluss</h2>
            </div>
            <button 
              onClick={() => setActiveTab('festbeton')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Kapillaranalyse im Festbeton-Modul <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Eines der wichtigsten Kriterien der Materialbeständigkeit ist der <strong>Wasserzementwert (w/z-Wert)</strong>. 
                Für die reine Hydratation (chemische und physikalische Wasserbindung) wird theoretisch nur ein w/z-Wert von ca. 0,40 benötigt 
                (wasserfreies Gesteinsgel). Überschüssiges Zugabewasser verdampft im Lauf der Erhärtung und hinterlässt ein verzweigtes System aus 
                durchgehenden <strong>Kapillarporen</strong>, welche die Festigkeit des Betongefüges senken und das Eindringen Schadstoffen drastisch erhöhen.
              </p>

              <div className="p-3 bg-red-50/45 border border-red-150 rounded-lg text-xs flex gap-2 text-red-950">
                <Info size={16} className="text-red-700 shrink-0 mt-0.5" />
                <p className="font-sans leading-relaxed text-[11px]">
                  <strong>Dichtheitsgrenze (w/z ≤ 0,50):</strong> Ab einem w/z-Wert von ca. 0,50 wächst der Kapillarporengehalt überproportional an. 
                  Die Kapillarkanäle fangen an sich zusammenhängend zu vernetzen (Perkolation), wodurch die Diffusionsbarriere geschwächt wird.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-home-grau/30 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gefügekennwerte nach w/z-Wert</span>
              <div className="space-y-2">
                <div className="bg-white p-2.5 rounded border border-home-grau/30 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold block text-slate-900">w/z ≤ 0,40 (hochfester Beton; UHPC ca. 0,20–0,25)</span>
                    <span className="text-[10px] text-slate-500">Extrem dichtes Gefüge</span>
                  </div>
                  <span className="font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold text-[10px]">&lt; 3% Kapillarporen (Lehrwert)</span>
                </div>

                <div className="bg-white p-2.5 rounded border border-home-grau/30 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold block text-slate-900">w/z = 0,45 – 0,50 (Konstruktiver Hochbau)</span>
                    <span className="text-[10px] text-slate-500">Klassischer XC3/XC4 Außenbauteil-Standard</span>
                  </div>
                  <span className="font-mono bg-slate-50 text-slate-700 border border-home-grau/30 px-1.5 py-0.5 rounded font-bold text-[10px]">4 – 12% Kapillarporen (Lehrwert)</span>
                </div>

                <div className="bg-white p-2.5 rounded border border-home-grau/30 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold block text-slate-950">w/z ≥ 0,60 (Geringwertige Bauteile)</span>
                    <span className="text-[10px] text-slate-500">Unbewehrter Fundamentbeton / Sauberkeitsschicht</span>
                  </div>
                  <span className="font-mono bg-red-50 text-red-800 border border-red-200 px-1.5 py-0.5 rounded font-bold text-[10px]">&gt; 25% Kapillarporen (Lehrwert)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Frischbetonkonsistenzen */}
        <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-3">
            <div className="flex items-center gap-2">
              <Droplets className="text-shiraz" size={22} />
              <h2 className="text-base font-bold text-slate-950 font-sans">3. Frischbeton, Einbau & Konsistenzklassen</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('frischbeton')}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Frischbeton-Modul <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => setActiveTab('herstellung_einbau')}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 border border-home-grau/30 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Herstellung & Einbau <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Vor der Festigkeitsausprägung muss der Frischbeton auf Transportweg, Gießbedingungen und Bewehrungsdichte abgestimmt werden. 
                Das Maß der Verformbarkeit wird am Baustellenprüfplatz über ein standardisiertes <strong>Ausbreitmaß</strong> am kegelstumpfförmigen Versuchsgerät 
                gemessen (Klassen F1 bis F6). Ein fachgerechter Einbau verhindert Entmischung und die Bildung von instabilen Luftkammern.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                <div className="bg-slate-50 border border-home-grau/30 p-2.5 rounded">
                  <span className="text-[10px] font-semibold text-slate-500 font-mono block">A: TRANSPORTE & LIEFERSCHEIN</span>
                  <p className="text-slate-800 font-semibold mt-0.5">Lieferscheinkontrolle</p>
                  <p className="text-slate-500 text-[10px] leading-relaxed">Systematischer Abgleich von Lieferschein: Festigkeit, Expositionsklasse, Größtkorn und Konsistenz direkt beim Eintreffen.</p>
                </div>
                <div className="bg-slate-50 border border-home-grau/30 p-2.5 rounded">
                  <span className="text-[10px] font-semibold text-slate-500 font-mono block">B: TRANSPORTHÖHE & EINBAU</span>
                  <p className="text-slate-800 font-semibold mt-0.5">Vermeidung von Entmischung</p>
                  <p className="text-slate-500 text-[10px] leading-relaxed">Faustregel: freie Fallhöhe auf etwa 1,0–1,5 m begrenzen. Spezielle Fallschläuche oder Trichtersysteme nutzen.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Ausbreitmaßklassen (Konsistenz nach DIN EN 206)</span>
              <table className="min-w-full text-left text-[11px] text-slate-700">
                <thead>
                  <tr className="border-b border-home-grau/30 text-[9px] text-slate-400 font-bold uppercase">
                    <th className="pb-1">Klasse</th>
                    <th className="pb-1">Ausbreitmaß</th>
                    <th className="pb-1">Verhalten / typischer Einsatz</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-1 font-mono font-bold">F1</td>
                    <td className="py-1">≤ 340 mm</td>
                    <td className="py-1 text-slate-500">Steif (Massige Pfeiler, dicke Fundamente)</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono font-bold">F2</td>
                    <td className="py-1">350 - 410 mm</td>
                    <td className="py-1 text-slate-500">Plastisch (Gründungen)</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono font-bold text-shiraz">F3</td>
                    <td className="py-1">420 - 480 mm</td>
                    <td className="py-1 text-slate-600">Weich (Klassischer Hochbau, Wände/Decken)</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono font-bold">F4</td>
                    <td className="py-1">490 - 550 mm</td>
                    <td className="py-1 text-slate-500">Sehr weich (Schlanke Stützen, dichte Bewehrung)</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono font-bold">F5</td>
                    <td className="py-1">560 - 620 mm</td>
                    <td className="py-1 text-slate-500">Fließfähig</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono font-bold">F6</td>
                    <td className="py-1">≥ 630 mm</td>
                    <td className="py-1 text-slate-500">Sehr fließfähig (SVB wird über das Setzfließmaß SF beschrieben)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pillar 4: Festbeton & Erhärtungskinetik */}
        <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-shiraz" size={22} />
              <h2 className="text-base font-bold text-slate-950 font-sans">4. Festbeton: Festigkeitsentwicklung & elastisches Tragverhalten</h2>
            </div>
            <button 
              onClick={() => setActiveTab('festbeton')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Festbetonkenngrößen öffnen <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Die Verfestigung des Zementleims zu wasserunlöslichem Zementstein bestimmt die statischen Trageigenschaften. 
                Dabei hängen die Druck- und Zugfestigkeiten maßgeblich vom Hydratationstyp, dem Reifealter und der Temperaturhistorie ab. 
                Nach Eurocode 2 (DIN EN 1992-1-1) wird der zeitliche Entstehungsverzug mit Exponentialfunktionen berechnet 
                und die Festigkeiten für Zement-Schnelligkeitskoeffizienten R, N und S angepasst.
              </p>

              <div className="p-3.5 bg-slate-50 border border-home-grau/30 rounded-lg text-xs font-sans grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-mono block text-[10px]">Mittlere zentrische Zugfestigkeit f_ctm</span>
                  <div className="font-semibold text-slate-900 mt-1">
                    <FormulaText text="f_{ctm} = 0.3 \cdot (f_{ck})^{2/3}" />
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-mono block text-[10px]">Erhärtungsverlauf nach Eurocode 2</span>
                  <div className="font-semibold text-slate-900 mt-1">
                    <FormulaText text="\beta_{cc}(t) = \exp\left(s \cdot [1 - \sqrt{28/t}]\right)" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Festigkeitsklassen & Trageigenschaften (DIN 1045-2)</span>
              <table className="min-w-full text-left text-[11px] text-slate-700">
                <thead>
                  <tr className="border-b border-home-grau/30 text-[9px] text-slate-400 font-bold uppercase">
                    <th className="pb-1">Klasse</th>
                    <th className="pb-1">zyl. f_ck (MPa)</th>
                    <th className="pb-1">würfel. f_ck (MPa)</th>
                    <th className="pb-1">Zugf. f_ctm (MPa)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="py-1 font-bold">C12/15</td>
                    <td className="py-1">12</td>
                    <td className="py-1">15</td>
                    <td className="py-1">1,6 MPa</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">C20/25</td>
                    <td className="py-1">20</td>
                    <td className="py-1">25</td>
                    <td className="py-1">2,2 MPa</td>
                  </tr>
                  <tr className="text-slate-900 font-semibold bg-white/40">
                    <td className="py-1 font-sans font-bold">C25/30</td>
                    <td className="py-1">25</td>
                    <td className="py-1">30</td>
                    <td className="py-1">2,6 MPa</td>
                  </tr>
                  <tr className="text-slate-900 font-semibold bg-white/40">
                    <td className="py-1 font-sans font-bold">C30/37</td>
                    <td className="py-1">30</td>
                    <td className="py-1">37</td>
                    <td className="py-1">2,9 MPa</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">C45/55</td>
                    <td className="py-1">45</td>
                    <td className="py-1">55</td>
                    <td className="py-1">3,8 MPa</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pillar 5: Dauerhaftigkeit & Betondeckung */}
        <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="text-shiraz" size={22} />
              <h2 className="text-base font-bold text-slate-950 font-sans">5. Dauerhaftigkeit: Expositionsklassen & Betondeckung nach EC2</h2>
            </div>
            <button 
              onClick={() => setActiveTab('dauerhaftigkeit')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Dauerhaftigkeits-Rechner öffnen <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Um die eingebettete Stahlbewehrung dauerhaft vor zerstörender Carbonatisierung (Neutralisation des Porenwassers durch CO₂, pH-Abfall) 
                oder vordringenden Chlorid-Salzen (XD-Klassen, z.B. Streusalz) zu bewahren, muss nach Eurocode 2 ein 
                <strong>Mindestmaß der Betondeckung</strong> (<FormulaText text="c_{nom}" />) eingehalten werden. 
                Die Expositionsklassen XC und XD legen die Anfälligkeit des Standorts fest und steuern die Rechentiefen.
              </p>

              <div className="p-3.5 bg-slate-50 border border-home-grau/30 rounded-lg text-xs font-sans space-y-2">
                <span className="font-bold text-slate-800 font-sans block">Ermittlung des Nennmaßes c_nom nach EC2:</span>
                <div className="font-mono text-xs text-slate-900 border-l-2 border-shiraz/45 pl-3 py-1">
                  <FormulaText text="c_{nom} = c_{min} + \Delta c_{dev}" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono block">
                  Mit <FormulaText text="c_{min} = \max(c_{min,b}; c_{min,dur}; 10 \, \text{mm})" />. 
                  Das Vorhaltemaß <FormulaText text="\Delta c_{dev}" /> beträgt nach DIN EN 1992-1-1/NA 15 mm, bei XC1 10 mm.
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">XC / XD Richtlinien der Betondeckung (Mindestwerte)</span>
              <table className="min-w-full text-left text-[11px] text-slate-700">
                <thead>
                  <tr className="border-b border-home-grau/30 text-[9px] text-slate-400 font-bold uppercase">
                    <th className="pb-1">Expositionsklasse</th>
                    <th className="pb-1">Beschreibung</th>
                    <th className="pb-1 font-mono">c_min,dur</th>
                    <th className="pb-1 font-mono">c_nom (Standard)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  <tr>
                    <td className="py-1 font-bold">XC1</td>
                    <td className="py-1 text-slate-500">Ständig trocken (Innenräume)</td>
                    <td className="py-1 font-mono">10 mm</td>
                    <td className="py-1 font-mono">20 mm</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">XC2 / XC3</td>
                    <td className="py-1 text-slate-500">Nass / mäßig feucht</td>
                    <td className="py-1 font-mono">20 mm</td>
                    <td className="py-1 font-mono">35 mm</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">XC4</td>
                    <td className="py-1 text-slate-600">Direkt beregnet (Außenwände)</td>
                    <td className="py-1 font-mono">25 mm</td>
                    <td className="py-1 font-mono">40 mm</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">XD1</td>
                    <td className="py-1 text-slate-500">Mäßig feucht (Sprühkanal)</td>
                    <td className="py-1 font-mono">40 mm</td>
                    <td className="py-1 font-mono">55 mm</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">XD3</td>
                    <td className="py-1 text-slate-500">Wechselnd nass (Parkdecks)</td>
                    <td className="py-1 font-mono">40 mm</td>
                    <td className="py-1 font-mono">55 mm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pillar 6: Beton-Instandsetzung */}
        <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-shiraz" size={22} />
              <h2 className="text-base font-bold text-slate-950 font-sans">6. Beton-Instandsetzung: Schadensbeseitigung & Reprofilierung</h2>
            </div>
            <button 
              onClick={() => setActiveTab('instandhaltung')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Instandhaltung & Schutz öffnen <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Schäden durch Betonalterung werden nach den Instandsetzungsprinzipien der Normenreihe DIN EN 1504 behoben, in Deutschland bauaufsichtlich geregelt durch die Technische Regel Instandhaltung von Betonbauwerken (TR Instandhaltung, DIBt).. 
                Dabei gilt es, unkontrollierten pH-Abfall des porenbildenden Calciumhydroxids (welcher die Passivierungsschicht des Stahls zerstört) 
                aufzufangen. Die mechanische <strong>Reprofilierung</strong> erfordert das Freistemmen des korrodierten Stahls bis auf rostfreien 
                Untergrund (Reinheitsgrad nach TR Instandhaltung – manuell prüfen) und das anschließende Verfüllen mit geeigneten Instandsetzungsmörteln (z.B. polymervergüteter Zementmörtel PCC).
              </p>

              <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 p-3 rounded-lg text-xs text-slate-700 flex gap-2">
                <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="font-sans leading-relaxed text-[11px]">
                  <strong>Mindestabreißfestigkeit f_ct,sub:</strong> Die Haftzugfestigkeit des tragenden Altbetons muss vor einer Reprofilierung oder dem 
                  Auftrag von Schutzbeschichtungen geprüft werden; üblich ist ein Mittelwert von <strong>≥ 1,5 N/mm²</strong> (TR Instandhaltung, systemabhängig – manuell prüfen).
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-home-grau/30 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Instandsetzungsprinzipien nach DIN EN 1504-9 (Auswahl)</span>
              
              <div className="bg-white p-2.5 rounded border border-home-grau/30">
                <span className="font-bold text-slate-800 text-[10.5px]">Prinzip 10: Kathodischer Schutz (KKS)</span>
                <p className="text-slate-500 text-[10px] mt-0.5">Ein geregelter Schutzstrom polarisiert die Bewehrung kathodisch und unterdrückt die Korrosion, ohne den chloridbelasteten Beton vollständig abzutragen.</p>
              </div>

              <div className="bg-white p-2.5 rounded border border-home-grau/30">
                <span className="font-bold text-slate-800 text-[10.5px]">Prinzip 3: Betonersatz (Reprofilierung)</span>
                <p className="text-slate-500 text-[10px] mt-0.5">Entfernen des geschädigten Betons, Reinigen der Bewehrung und Reprofilieren mit Instandsetzungsmörtel (z. B. PCC/SPCC).</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- Part 7: Unified Checklist Item Overview --- */}
      <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-home-grau/30 pb-3">
          <FileText className="text-slate-800" size={20} />
          <h2 className="text-base font-bold text-slate-950 font-sans">7. Ingenieur-Checkliste: Planung, Bemessung & Ausführung</h2>
        </div>
        
        <p className="text-xs text-slate-600 leading-relaxed -mt-2">
          Ganzheitliche Übersicht der wichtigsten technologischen und baulichen Kontrolllinien für Tragwerksplaner und die baubegleitende Qualitätsüberprüfung.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
          {/* Section A: Planning & Specifying */}
          <div className="bg-slate-50 border border-home-grau/30 rounded-xl p-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider border-b border-home-grau/30 pb-1 font-sans">Tragwerksplanung, Normung & Spezifikation</span>
            
            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800">XC/XD-Grenzwerte festlegen</h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5">Zulässigen w/z-Wert, Mindestzementgehalt und Zementarten nach DIN EN 206 / DIN 1045-2 festlegen.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800">CO₂-Zusatzstoffe optimieren</h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5">Nachhaltigkeitswert durch das k-Wert-Konzept maximieren. Gezielte Substitution von Klinkeranteilen anfordern.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800">Bewehrungslage & Konsistenz aufeinander abstimmen</h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5">Bei komplizierter, enger Verlegung weichere Konsistenzklassen (F4 oder F5) anfordern, um Hohlräume oder Kiesnester zu blockieren.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800">Kriechen und Schwinden einkalkulieren</h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5">Zeitabhängige und umweltbedingte Längenänderungen in Langzeitverformungsrechnungen für schlanke Bauteile einpflegen.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Execution & Field Verification */}
          <div className="bg-slate-50 border border-home-grau/30 rounded-xl p-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider border-b border-home-grau/30 pb-1 font-sans">Bauüberwachung & Baustellen-Ausführung</span>
            
            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800">Eignungsprüfung des Herstellers anfordern</h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5">Vor Betonierbeginn klären, dass für die Betonsorte eine Erstprüfung nach DIN EN 206 vorliegt (Sortenverzeichnis, Lieferschein).</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800">Frühzeitige Nachbehandlung gewährleisten</h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5">Unmittelbar nach Einbau Folienabdeckungen verlegen, sprühen oder kontinuierlich wässern, um Rissbildungen vorzubeugen.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800">Sicherstellung der Abstandshalter</h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5">Prüfung vor Einbringung: Abstandhalter nach DBV-Merkblatt in ausreichender Anzahl, damit c_nom eingehalten wird.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800">Prüfung von Untergrundhaftwerten</h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5">Bei Sanierungen die saubere, rissfreie Verbundfläche mittels Haftzugprüfungen protokollieren (üblich Mittelwert ≥ 1,5 N/mm² – manuell prüfen).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter 
        weblinks={[
          { title: "Zement-Merkblätter Betoningenieure", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" },
          { title: "Beton.wiki", url: "https://beton.wiki/" }
        ]} 
        wikipedia={[
          { title: 'Betontechnologie', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Wasserzementwert', url: 'https://de.wikipedia.org/wiki/Wasserzementwert' }
        ]}
        normIds={['DIN_EN_206', 'DIN_1045_3', 'DIN_EN_1992_1_1', 'DIN_EN_13670', 'DBV_NACHBEHANDLUNG']}
        literatur={[
          'Grübl, P.; Weigler, H.; Karl, S.: Beton – Arten, Herstellung und Eigenschaften. Berlin: Ernst & Sohn 2001',
          'Zilch, K.; Zehetmaier, G.: Bemessung im konstruktiven Betonbau. 2. Aufl., Berlin, Heidelberg: Springer 2010'
        ]}
        formeln={[
          {
            formel: 'V_z + V_f + V_w + V_L + V_g = 1000 \\, \\ell',
            erklaerung: 'Stoffraumgleichung für 1 m³ verdichteten Frischbeton: Die Summe aller Stoffraumvolumina ergibt 1000 dm³.',
            quelle: 'Mischungsberechnung (Grundgleichung)'
          },
          {
            formel: '(w/z)_{eq} = \\frac{M_w}{M_z + k \\cdot M_f}',
            erklaerung: 'Äquivalenter Wasserzementwert nach DIN EN 206:2021-06 / DIN 1045-2:2023-08 bei Anrechnung von Flugasche (k = 0,4) oder Silikastaub (k = 1,0).',
            quelle: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08'
          }
        ]}
      />

    </div>
  );
}
