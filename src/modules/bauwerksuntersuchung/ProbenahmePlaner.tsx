import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  ExternalLink, 
  Beaker, 
  Thermometer, 
  Hammer, 
  Info,
  Calendar,
  Grid,
  FileText
} from 'lucide-react';
import { SAMPLING_PRESETS, METHOD_DIAGNOSE_DETAILS } from './diagnoseData';
import { formatDeZahl } from '@/src/utils/numberFormat';
import { InlineMath, BlockMath } from 'react-katex';

export default function ProbenahmePlaner() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tiefgarage');
  
  // Custom calculator state
  const [customBauteil, setCustomBauteil] = useState<'decke' | 'stuetze' | 'wand' | 'balken' | 'holz'>('decke');
  const [flaecheM2, setFlaecheM2] = useState<number>(600);
  const [bauteilAnzahl, setBauteilAnzahl] = useState<number>(12);
  const [verfahrenType, setVerfahrenType] = useState<'verfahrenA' | 'verfahrenB'>('verfahrenA');
  const [primaryGoal, setPrimaryGoal] = useState<'druckfestigkeit' | 'chlorid' | 'karbonatisierung' | 'haftzug' | 'potentialfeld'>('chlorid');

  // Active preset
  const activePreset = useMemo(() => {
    return SAMPLING_PRESETS.find(p => p.id === selectedPresetId) || SAMPLING_PRESETS[0];
  }, [selectedPresetId]);

  // Calculations for custom planner
  const calculatedScope = useMemo(() => {
    // 1. Bohrkerne nach DIN EN 13791
    let bohrkerne = 0;
    if (primaryGoal === 'druckfestigkeit') {
      if (verfahrenType === 'verfahrenA') {
        bohrkerne = Math.max(14, Math.round(14 + (flaecheM2 > 1000 ? (flaecheM2 - 1000) / 300 : 0)));
      } else {
        bohrkerne = Math.min(13, Math.max(3, Math.round(3 + flaecheM2 / 150)));
      }
    } else if (primaryGoal === 'chlorid') {
      bohrkerne = Math.max(2, Math.round(flaecheM2 / 300));
    } else {
      bohrkerne = 2; // Kontrollkerne
    }

    // 2. ZfP-Messpunkte (Covermeter, Schmidt-Hammer)
    let zfpPunkte = 0;
    let rasterMass = '20 × 20 cm';
    if (primaryGoal === 'potentialfeld') {
      // 1 Messpunkt je 0,04 m² (20x20cm) bis 0,0225 m² (15x15cm)
      zfpPunkte = Math.min(600, Math.max(60, Math.round(flaecheM2 * 0.4)));
      rasterMass = '15 × 15 cm bis 20 × 20 cm';
    } else if (primaryGoal === 'chlorid') {
      zfpPunkte = Math.min(300, Math.max(40, Math.round(flaecheM2 * 0.2)));
      rasterMass = '25 × 25 cm (Covermeter-Vorlauf)';
    } else if (primaryGoal === 'druckfestigkeit') {
      zfpPunkte = bauteilAnzahl * 9; // mind. 9 Rückprallwerte je Bauteil
      rasterMass = '30 × 30 cm Prüffelder';
    } else {
      zfpPunkte = Math.round(flaecheM2 * 0.1);
    }

    // 3. Bohrmehl-Tiefenprofilstellen (Chlorid / Salze)
    let bohrmehlStellen = 0;
    if (primaryGoal === 'chlorid') {
      bohrmehlStellen = Math.max(4, Math.round(3 + flaecheM2 / 200));
    } else if (primaryGoal === 'karbonatisierung') {
      bohrmehlStellen = 2; // pH/Salzkontrolle
    } else {
      bohrmehlStellen = 1;
    }

    // 4. Haftzugstempel (DIN EN 1542 / ZTV-ING)
    let haftzugStempel = 0;
    if (primaryGoal === 'haftzug') {
      haftzugStempel = Math.max(5, Math.round(5 + flaecheM2 / 100));
    } else if (primaryGoal === 'chlorid' || primaryGoal === 'druckfestigkeit') {
      haftzugStempel = Math.max(3, Math.round(3 + flaecheM2 / 250));
    }

    return {
      bohrkerne,
      zfpPunkte,
      bohrmehlStellen,
      haftzugStempel,
      rasterMass
    };
  }, [flaecheM2, bauteilAnzahl, verfahrenType, primaryGoal]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & Normative Einordnung */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <ClipboardList className="text-shiraz" size={20} />
              Normative Stichprobenplanung &amp; Konditionierungs-Matrix
            </h3>
            <p className="text-xs text-text-main/70 mt-1">
              Verbindliche Festlegung von Mindestprüfpunkten, Entnahmerastern und Vor-Ort-/Labor-Konditionierung nach DIN EN 13791, DBV, DGZfP &amp; DIBt TR Instandhaltung
            </p>
          </div>
          <span className="px-3 py-1 bg-shiraz/10 text-shiraz text-xs font-bold rounded-full border border-shiraz/20 self-start md:self-center">
            Prüfdimension 3: Vollständigkeit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-home-grau/20 text-xs">
          <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Scale size={14} className="text-shiraz" />
              1. Statistische Repräsentanz
            </span>
            <p className="text-slate-650 leading-relaxed text-[11px]">
              Einzelfunde besitzen vor Gericht und Prüfingenieuren keine Aussagekraft. Normen verlangen das <strong>5 %-Quantil</strong> (z. B. bei Betondeckung) oder <strong>charakteristische In-situ-Werte f_ck,is</strong> mit Vertrauensniveau 90 %.
            </p>
          </div>

          <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Thermometer size={14} className="text-shiraz" />
              2. Exakte Konditionierung
            </span>
            <p className="text-slate-650 leading-relaxed text-[11px]">
              Falsche Feuchte verfälscht Prüfwerte massiv: Nasser Beton verringert die Druckfestigkeit um bis zu <strong>15 %</strong>; nasses Bohren wäscht Chloride vollständig aus; unzureichende Vorbefeuchtung verhindert Potentialfeldmessungen.
            </p>
          </div>

          <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Grid size={14} className="text-shiraz" />
              3. Raster- &amp; Entnahmeschemata
            </span>
            <p className="text-slate-650 leading-relaxed text-[11px]">
              Zerstörungsfreie Vorerkundung (ZfP-Raster 15–25 cm) lokalisiert Schadensschwerpunkte gezielt. Zerstörende Beprobungen (Bohrkerne, Bohrmehl) werden kalibrierend und bauteilschonend platziert.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interaktiver Stichproben- & Prüfumfangsrechner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
          <div>
            <h4 className="font-bold text-base text-text-main flex items-center gap-2">
              <Sliders className="text-shiraz" size={18} />
              Interaktiver Stichprobenrechner für Bauwerksuntersuchungen
            </h4>
            <p className="text-xs text-text-main/70 mt-0.5">
              Wählen Sie ein typisches Praxisszenario oder konfigurieren Sie Ihre Bauteilparameter individuell
            </p>
          </div>
        </div>

        {/* Preset Selector Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Praxisnahe Prüfszenarien (Presets):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {SAMPLING_PRESETS.map((p) => {
              const isSelected = p.id === selectedPresetId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPresetId(p.id);
                    setFlaecheM2(p.flaeche);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-shiraz text-white border-shiraz shadow-sm ring-2 ring-shiraz/20'
                      : 'bg-off-white hover:bg-slate-100 border-home-grau/30 text-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold leading-snug line-clamp-2">
                    {p.name.split(' (')[0]}
                  </span>
                  <span className={`text-[10px] mt-2 block font-mono ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                    {p.flaeche} m² • {p.bauteilTyp}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Configuration Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 bg-off-white rounded-2xl border border-home-grau/25">
          <div className="md:col-span-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Bauteilart / Struktur</label>
              <select
                value={customBauteil}
                onChange={(e) => setCustomBauteil(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-shiraz font-medium"
              >
                <option value="decke">Stahlbetondecke / Bodenplatte (m²)</option>
                <option value="stuetze">Stützen / Pfeiler (Stückzahl)</option>
                <option value="wand">Stützwand / Kelleraußenwand</option>
                <option value="balken">Spannbeton-Unterzug / Träger</option>
                <option value="holz">Holzbalkendecke / Dachstuhl</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Prüffläche / Losgröße: <span className="text-shiraz font-mono">{formatDeZahl(flaecheM2, 0)} m²</span>
              </label>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={flaecheM2}
                onChange={(e) => setFlaecheM2(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>50 m²</span>
                <span>1.500 m²</span>
                <span>3.000 m²</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Primäres Diagnoseziel</label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-shiraz font-medium"
              >
                <option value="chlorid">Chlorid-Tausalzbelastung &amp; Lochfraß (XD3)</option>
                <option value="druckfestigkeit">In-situ-Druckfestigkeit (DIN EN 13791)</option>
                <option value="potentialfeld">Elektrochemische Korrosionszustandsanalyse</option>
                <option value="karbonatisierung">Karbonatisierungstiefe &amp; Passivierung (XC4)</option>
                <option value="haftzug">Haftzugfestigkeit für Instandsetzungsmörtel</option>
              </select>
            </div>

            {primaryGoal === 'druckfestigkeit' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Verfahren nach DIN EN 13791</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setVerfahrenType('verfahrenA')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      verfahrenType === 'verfahrenA'
                        ? 'bg-shiraz text-white border-shiraz'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Verfahren A (≥ 14 Kerne)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerfahrenType('verfahrenB')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      verfahrenType === 'verfahrenB'
                        ? 'bg-shiraz text-white border-shiraz'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Verfahren B (3–13 Kerne)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Display */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Ermittelter normativer Prüfumfang &amp; Entnahmestellen:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-xl border border-home-grau/20 shadow-3xs flex flex-col items-center text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Bohrkerne</span>
                  <span className="text-xl font-mono font-black text-shiraz mt-1">
                    {formatDeZahl(calculatedScope.bohrkerne, 0)}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Ø 100 mm (DIN EN 12504-1)</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-home-grau/20 shadow-3xs flex flex-col items-center text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">ZfP-Messpunkte</span>
                  <span className="text-xl font-mono font-black text-shiraz mt-1">
                    {formatDeZahl(calculatedScope.zfpPunkte, 0)}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Raster: {calculatedScope.rasterMass}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-home-grau/20 shadow-3xs flex flex-col items-center text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Bohrmehl-Profile</span>
                  <span className="text-xl font-mono font-black text-shiraz mt-1">
                    {formatDeZahl(calculatedScope.bohrmehlStellen, 0)}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">je 5 Tiefenstufen (Trocken!)</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-home-grau/20 shadow-3xs flex flex-col items-center text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Haftzugstempel</span>
                  <span className="text-xl font-mono font-black text-shiraz mt-1">
                    {formatDeZahl(calculatedScope.haftzugStempel, 0)}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Ø 50 mm (DIN EN 1542)</span>
                </div>
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-4 bg-white rounded-xl border border-home-grau/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info size={15} className="text-shiraz" />
                <span>Normative Begründung des Stichprobenumfangs:</span>
              </div>
              <p className="text-slate-650 leading-relaxed text-[11.5px]">
                {primaryGoal === 'druckfestigkeit' && verfahrenType === 'verfahrenA' && (
                  <>
                    Nach <strong>DIN EN 13791:2020-02 Abschnitt 8.1</strong> sichern erst mind. <strong>14 Bohrkerne</strong> eine statistisch verlässliche Bestimmung der Standardabweichung <em>s</em> ab. Der charakteristische Wert berechnet sich aus <InlineMath math="f_{ck,is} = \min(f_{m,is} - 1{,}48 \cdot s, \, f_{is,lowest} + 4)" />. Kleinere Stichproben erfordern Verfahren B mit massiven Sicherheitsabschlägen.
                  </>
                )}
                {primaryGoal === 'druckfestigkeit' && verfahrenType === 'verfahrenB' && (
                  <>
                    Nach <strong>DIN EN 13791:2020-02 Abschnitt 8.2</strong> (Verfahren B) sind für kleine Prüfbereiche 3 bis 13 Bohrkerne zulässig. Die Berechnung erfolgt mit Sicherheitsbeiwert <InlineMath math="f_{ck,is} = f_{m,is} - k_n \cdot s" />, wobei <InlineMath math="k_n" /> für 3 Kerne bei 3,37 liegt (hoher statistischer Abschlag zum Ausgleich der Unsicherheit!).
                  </>
                )}
                {primaryGoal === 'chlorid' && (
                  <>
                    Nach <strong>DIBt TR Instandhaltung (Teil 1, Anhang B)</strong> müssen in korrosionsgefährdeten Zonen mind. 3–5 tiefengestaffelte Bohrmehlprofile entnommen werden, um den Oberflächenchloridgehalt <InlineMath math="C_s" /> und die Eindringtiefe an der Bewehrung (<InlineMath math="C_{krit} = 0{,}50\,\text{M.-\%}" />) rechtssicher zu belegen.
                  </>
                )}
                {primaryGoal === 'potentialfeld' && (
                  <>
                    Nach <strong>DGZfP-Merkblatt B1 (2018)</strong> erfordert die Detektion aktiver Makroelement-Anoden ein engmaschiges Raster von max. 15 × 15 cm bis 20 × 20 cm. Größere Rasterweiten übersehen lokale Lochfraßherde zwischen zwei Messpunkten.
                  </>
                )}
                {primaryGoal === 'karbonatisierung' && (
                  <>
                    Nach <strong>DIN EN 14630:2007-01</strong> sind mind. 3 Prüfbereiche je Bauteil mit je 5–10 Einzelwerten entlang der Bruchlinie auszuwerten, um lokale Fehlstellen der Zementsteinverdichtung abzubilden.
                  </>
                )}
                {primaryGoal === 'haftzug' && (
                  <>
                    Nach <strong>DIN EN 1542:1999-07</strong> und <strong>ZTV-ING Teil 3</strong> sind je 10–25 m² Prüffläche mind. 3–5 Prüfstempel Ø 50 mm abzureißen. Der Mittelwert muss <InlineMath math="f_{ct,m} \ge 1{,}5\,\text{N/mm}^2" /> betragen (ZTV-ING: <InlineMath math="\ge 2{,}0\,\text{N/mm}^2" />).
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Ausführlicher Leitfaden: Proben- & Prüfstellenkonditionierung */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
        <h4 className="font-bold text-base text-text-main flex items-center gap-2">
          <Beaker className="text-shiraz" size={18} />
          Verbindlicher Leitfaden: Proben- und Prüfstellenkonditionierung
        </h4>
        <p className="text-xs text-text-main/70 -mt-3">
          Präzise Vorbereitungs-, Lagerungs- und Prüfbedingungen zur Verhinderung verfälschter Messwerte
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Bohrkerne */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full inline-block">
                DIN EN 12504-1 / DIN EN 12390-3
              </span>
              <h5 className="font-bold text-sm text-slate-800">Bohrkerne für Druckprüfung</h5>
              <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Ablängen:</strong> Schlankheitsverhältnis <InlineMath math="h/d = 1{,}0" /> oder <InlineMath math="2{,}0" /> exakt rechtwinklig absägen.</li>
                <li><strong>Planparallelität:</strong> Stirnflächen auf Toleranz <InlineMath math="\le 0{,}05\,\text{mm}" /> schleifen oder Schwefel-/Tonerdeschmelzzement-Deckschicht auftragen.</li>
                <li><strong>Feuchtelagerung:</strong> Mind. 3 Tage im Prüfraum bei 20 ± 2 °C / 50–65 % r.F. (lufttrocken) ODER mind. 48 h wassergesättigt.</li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800">
              <strong>Kritischer Fehler:</strong> Nasser Beton zeigt ca. 10–15 % geringere Festigkeit als trockener Beton. Lagerungszustand zwingend protokollieren!
            </div>
          </div>

          {/* Card 2: Potentialfeldmessung */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full inline-block">
                DGZfP B1 / ASTM C876
              </span>
              <h5 className="font-bold text-sm text-slate-800">Potentialfeldmessung</h5>
              <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Vorbefeuchtung:</strong> Oberfläche mind. 30–45 min vor Messung mit Netzwasser benetzen, um Übergangswiderstand <InlineMath math="R_c < 10\,\text{k}\Omega" /> zu sichern.</li>
                <li><strong>Pfützenfreiheit:</strong> Freies Wasser vor Messung restlos abziehen (verhindert elektrische Kurzschlussfelder!).</li>
                <li><strong>Bewehrungskontakt:</strong> Freilegung an gesunder Stelle; Durchgangsprüfung mit Multimeter muss <InlineMath math="R < 1\,\Omega" /> ergeben.</li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800">
              <strong>Kritischer Fehler:</strong> Trockener Beton erzeugt Scheinpotentiale durch unendlichen Innenwiderstand; Wasserpfützen verfälschen Gradienten.
            </div>
          </div>

          {/* Card 3: Bohrmehl (Chloride) */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full inline-block">
                DIN EN 14629 / DIBt TR
              </span>
              <h5 className="font-bold text-sm text-slate-800">Bohrmehlanalyse (Chloride)</h5>
              <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Trockenbohren:</strong> Ausschließlich mit Schlagbohrer und speziellem Absaugadapter arbeiten; KEIN Spülwasser!</li>
                <li><strong>Tiefenstufung:</strong> Bohrloch nach jeder 5-mm-Stufe vollständig staubsaugen, um Schichtvermischung auszuschließen.</li>
                <li><strong>Labortrocknung:</strong> Trocknen bei 105 °C bis Gewichtskonstanz; Aufschluss mit verdünnter Salpetersäure (HNO3).</li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800">
              <strong>Kritischer Fehler:</strong> Nassbohren wäscht wasserlösliche Chloride vollständig aus; Messwert wäre fälschlich 0,00 M.-%!
            </div>
          </div>

          {/* Card 4: Phenolphthalein-Test */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full inline-block">
                DIN EN 14630
              </span>
              <h5 className="font-bold text-sm text-slate-800">Karbonatisierungsprüfung</h5>
              <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Bruchfläche:</strong> Frisch hergestellter Stemmbruch; kein Nass-Schnitt (Sägeschlämme verschmiert den pH-Wert).</li>
                <li><strong>Entstauben:</strong> Unmittelbar vor Aufsprühen mit ölfreier Druckluft trocken abblasen.</li>
                <li><strong>Indikator:</strong> 0,1 % Phenolphthalein in 70 Vol.-% Ethanol aufsprühen.</li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800">
              <strong>Kritischer Fehler:</strong> Ablesung zwingend nach 30–60 s! Nach 5–10 min karbonatisiert die Bruchfläche an Raumluft zurück (Violettfärbung schlägt um).
            </div>
          </div>

          {/* Card 5: Haftabzug */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full inline-block">
                DIN EN 1542 / ZTV-ING
              </span>
              <h5 className="font-bold text-sm text-slate-800">Haftabzugsprüfung (Abreißversuch)</h5>
              <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Ringnut:</strong> Kernbohrung Ø 50 mm mind. 10–15 mm in den Altbeton eintiefen (querkraftfrei).</li>
                <li><strong>Kleber:</strong> 2K-Epoxidharzkleber auf sauberem, entfettetem Stempel vollflächig aushärten lassen (mind. 24 h bei &gt; 10 °C).</li>
                <li><strong>Zugrate:</strong> Belastung mit konstanter Spannungsrate von <InlineMath math="0{,}05 \pm 0{,}01\,\text{MPa/s}" /> aufbringen.</li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800">
              <strong>Kritischer Fehler:</strong> Schiefzug erzeugt Schälspannungen und bis zu 40 % zu niedrige Festigkeitswerte. Kugelgelenk am Zuggerät zwingend!
            </div>
          </div>

          {/* Card 6: Gravimetrische Darr-Methode */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full inline-block">
                DIN EN ISO 12570
              </span>
              <h5 className="font-bold text-sm text-slate-800">Gravimetrische Darrprüfung</h5>
              <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Probennahme:</strong> Durch Meißeln mit niedriger Reibung; Probe sofort in dampfdichtem Alubeutel versiegeln.</li>
                <li><strong>Trocknung:</strong> Beton/Zement bei 105 ± 2 °C darren; Gips/Calciumsulfat zwingend bei 40 ± 2 °C!</li>
                <li><strong>Gewichtskonstanz:</strong> Trocknen bis Differenz zweier Wägungen im Abstand von 4 h <InlineMath math="\Delta m < 0{,}1\,\%" /> beträgt.</li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800">
              <strong>Kritischer Fehler:</strong> Gips bei 105 °C verliert sein Kristallwasser (Dihydrat wandelt sich um) und täuscht massiv überhöhte Feuchte vor!
            </div>
          </div>
        </div>
      </div>

      {/* 4. Normen- & Regelwerk-Synopse mit DIN Media Links */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
            <FileText className="text-shiraz" size={16} />
            Relevante Normen &amp; Regelwerke der Bauwerksdiagnostik (DIN Media / WTA / DIBt)
          </h4>
          <span className="text-[11px] font-mono text-slate-400">Ausgabe 2026 harmonisiert</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-home-grau/30 text-slate-500 font-bold bg-slate-50">
                <th className="py-2.5 px-3">Norm / Regelwerk</th>
                <th className="py-2.5 px-3">Ausgabe</th>
                <th className="py-2.5 px-3">Gegenstand &amp; Prüfbereich</th>
                <th className="py-2.5 px-3">Stichproben- / Konditionierungskern</th>
                <th className="py-2.5 px-3 text-right">Referenz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900">DIN EN 13791</td>
                <td className="py-2 px-3 font-mono text-slate-600">2020-02</td>
                <td className="py-2 px-3 font-medium">In-situ-Druckfestigkeit von Beton in Bauwerken</td>
                <td className="py-2 px-3 text-slate-650">Verfahren A (≥ 14 Kerne) &amp; B (3–13 Kerne); Basiskurven</td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.dinmedia.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    DIN Media <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900">DIN EN 12504-1 bis -4</td>
                <td className="py-2 px-3 font-mono text-slate-600">2019 bis 2021</td>
                <td className="py-2 px-3 font-medium">Prüfung von Beton in Bauwerken (Kerne, Rückprall, US)</td>
                <td className="py-2 px-3 text-slate-650">Konditionierung h/d, Planparallelität, R-Wert-Median, Ultraschall</td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.dinmedia.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    DIN Media <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900">DIN EN 14629</td>
                <td className="py-2 px-3 font-mono text-slate-600">2007-06</td>
                <td className="py-2 px-3 font-medium">Bestimmung des Chloridgehalts im Festbeton</td>
                <td className="py-2 px-3 text-slate-650">Trockenbohrmehl, Tiefenstufung 5 mm, HNO3-Aufschluss, Titration</td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.dinmedia.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    DIN Media <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900">DIN EN 14630</td>
                <td className="py-2 px-3 font-mono text-slate-600">2007-01</td>
                <td className="py-2 px-3 font-medium">Karbonatisierungstiefe mit Phenolphthalein</td>
                <td className="py-2 px-3 text-slate-650">Bruchfrische Spaltfläche, 0,1 % Indikator, Ablesung in 30–60 s</td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.dinmedia.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    DIN Media <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900">DIN EN 1542</td>
                <td className="py-2 px-3 font-mono text-slate-600">1999-07</td>
                <td className="py-2 px-3 font-medium">Haftfestigkeit im Abreißversuch</td>
                <td className="py-2 px-3 text-slate-650">Ø 50 mm Kernbohrung 15 mm in Altbeton, 2K-Epoxidkleber, 0,05 MPa/s</td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.dinmedia.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    DIN Media <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900">DGZfP-Merkblatt B1</td>
                <td className="py-2 px-3 font-mono text-slate-600">2018-06</td>
                <td className="py-2 px-3 font-medium">Elektrochemische Potenzialmessung Stahlbeton</td>
                <td className="py-2 px-3 text-slate-650">Rastermaß 15–20 cm, Vorbefeuchtung Rc &lt; 10 kΩ, CSE-Referenzelektrode</td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.dgzfp.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    DGZfP <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900">DBV-Merkblatt Betondeckung</td>
                <td className="py-2 px-3 font-mono text-slate-600">2015-12</td>
                <td className="py-2 px-3 font-medium">Betondeckung und Bewehrung im Bestand</td>
                <td className="py-2 px-3 text-slate-650">Mind. 20–30 Messwerte je Prüffeld, statistisches 5 %-Quantil</td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.betonverein.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    DBV <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900">DIBt TR Instandhaltung</td>
                <td className="py-2 px-3 font-mono text-slate-600">2020-05</td>
                <td className="py-2 px-3 font-medium">Technische Regel Instandhaltung von Betonbauwerken</td>
                <td className="py-2 px-3 text-slate-650">Grenzwerte C_krit = 0,5 M.-% (0,2 % bei Spannstahl), Prinzipien W/C/R</td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.dibt.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    DIBt <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold font-mono text-slate-900">WTA-Merkblatt 8-15-20/D</td>
                <td className="py-2 px-3 font-mono text-slate-600">2020-08</td>
                <td className="py-2 px-3 font-medium">Bohrwiderstandsmessung an Holztragwerken</td>
                <td className="py-2 px-3 text-slate-650">2–3 Bohrungen je Balkenkopf, Feuchte u &lt; 20 %, Restquerschnitt</td>
                <td className="py-2 px-3 text-right">
                  <a href="https://www.wta-international.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1 font-bold">
                    WTA <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
