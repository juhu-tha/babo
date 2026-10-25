import { History, Sparkles } from 'lucide-react';
import { formatDeZahl, formatDeTeX, formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';
import { BlockMath, InlineMath } from 'react-katex';
import React from 'react';

interface RechnungBestandProps {
  bestandSubTab: "beton" | "stahl";
  beta_WN: number;
  beta_WN_150: number;
  diameterStahl: number;
  f_cd_bestand: number;
  f_ck_act: number;
  f_ck_cyl_raw: number;
  f_ck_final: number;
  f_ck_tested: number;
  f_yd_stahl: number;
  f_yk_stahl: number;
  hasPruefung: boolean;
  histBetonKlasse: "B100" | "B150" | "B225" | "B300" | "B450" | "B600";
  histStahlKlasse: "BSt220" | "BSt420" | "BSt500";
  pruefFestigkeit: number;
  setBestandSubTab: React.Dispatch<React.SetStateAction<"beton" | "stahl">>;
  setDiameterStahl: React.Dispatch<React.SetStateAction<number>>;
  setHasPruefung: React.Dispatch<React.SetStateAction<boolean>>;
  setHistBetonKlasse: React.Dispatch<React.SetStateAction<"B100" | "B150" | "B225" | "B300" | "B450" | "B600">>;
  setHistStahlKlasse: React.Dispatch<React.SetStateAction<"BSt220" | "BSt420" | "BSt500">>;
  setPruefFestigkeit: React.Dispatch<React.SetStateAction<number>>;
  steelArea: number;
  testedKlasseLabel: string;
  yieldCapacity: number;
}

export default function RechnungBestand({ bestandSubTab, beta_WN, beta_WN_150, diameterStahl, f_cd_bestand, f_ck_act, f_ck_cyl_raw, f_ck_final, f_ck_tested, f_yd_stahl, f_yk_stahl, hasPruefung, histBetonKlasse, histStahlKlasse, pruefFestigkeit, setBestandSubTab, setDiameterStahl, setHasPruefung, setHistBetonKlasse, setHistStahlKlasse, setPruefFestigkeit, steelArea, testedKlasseLabel, yieldCapacity }: RechnungBestandProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">
        {/* SUB-TABS */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
          <button aria-pressed={bestandSubTab === 'beton'}
            onClick={() => setBestandSubTab('beton')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  bestandSubTab === 'beton'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
          >
            1. Historischer Beton (DIN 1045 zu DIN EN 1992)
          </button>
          <button aria-pressed={bestandSubTab === 'stahl'}
            onClick={() => setBestandSubTab('stahl')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  bestandSubTab === 'stahl'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
          >
            2. Historischer Betonstahl (RU vs. RK)
          </button>
        </div>

        {bestandSubTab === 'beton' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <History className="text-shiraz" size={16} /> Historische Betongüte & Nachweisart
                </h3>

                {/* Betonklasse Selector */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 block">Historische Festigkeitsklasse (DIN 1045:1972):</label>
                  <select aria-label="Historische Festigkeitsklasse (DIN 1045:1972)" 
                    value={histBetonKlasse} 
                    onChange={(e) => setHistBetonKlasse(e.target.value as any)}
                    className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value="B100">B 100 (Nominalfestigkeit 10,0 N/mm²)</option>
                    <option value="B150">B 150 (Nominalfestigkeit 15,0 N/mm²)</option>
                    <option value="B225">B 225 (Nominalfestigkeit 22,5 N/mm²)</option>
                    <option value="B300">B 300 (Nominalfestigkeit 30,0 N/mm²)</option>
                    <option value="B450">B 450 (Nominalfestigkeit 45,0 N/mm²)</option>
                    <option value="B600">B 600 (Nominalfestigkeit 60,0 N/mm²)</option>
                  </select>
                  <span className="text-xxs text-slate-500 block">Damals gemessen an Prüfwürfeln mit 200 mm Kantenlänge nach 28 Tagen Lagerung.</span>
                </div>

                {/* Checkbox for testing */}
                <div className="pt-2 flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="hasPruefung" 
                    checked={hasPruefung} 
                    onChange={(e) => setHasPruefung(e.target.checked)}
                    className="rounded accent-shiraz cursor-pointer"
                  />
                  <label htmlFor="hasPruefung" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                    Bauwerksprüfung durchgeführt (Zerstörende Kernbohrungen)
                  </label>
                </div>

                {hasPruefung && (
                  <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-150 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-700">Mittlere Prüffestigkeit (150mm Würfel):</span>
                      <span className="text-shiraz">{formatDeZahl(pruefFestigkeit, 1)} N/mm²</span>
                    </div>
                    <input 
                      type="range" 
                      min="10.0" 
                      max="70.0" 
                      step="0.5" 
                      value={pruefFestigkeit} 
                      onChange={(e) => setPruefFestigkeit(parseFloat(e.target.value))}
                      className="w-full accent-shiraz"
                    />
                    <span className="text-xxs text-slate-500 block">Mittlerer Wert f_cm,cube der entnommenen Bohrkerne, umgerechnet auf Standard-150mm-Prüfwürfel.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                  Umrechnung nach DAfStb-Richtlinie "Bauen im Bestand"
                </h3>

                <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal font-sans">
                  <div>
                    <strong>Schritt 1: Normierung des Probekörpers</strong>
                    <p className="mt-1 text-xxs">
                      Die historische Kantenlänge von 200 mm wird auf den heutigen 150 mm Prüfwürfel normiert:
                    </p>
                    <BlockMath math={`\\beta_{WN,150} = \\frac{\\beta_{WN,200}}{0{,}95} = \\frac{\\color{#A3113E}{${formatDeTeX(beta_WN, 1)}}}{0{,}95} = \\color{#A3113E}{${formatDeTeX(beta_WN_150, 2)}} \\, \\text{N/mm}^2`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <strong>Schritt 2: Umrechnung auf Zylinderdruckfestigkeit</strong>
                    <p className="mt-1 text-xxs">
                      Das standardisierte Zylinder-zu-Würfel-Verhältnis beträgt 0,80:
                    </p>
                    <BlockMath math={`f_{ck,cyl} = 0{,}80 \\cdot \\beta_{WN,150} = 0{,}80 \\cdot \\color{#A3113E}{${formatDeTeX(beta_WN_150, 2)}} = \\color{#A3113E}{${formatDeTeX(f_ck_cyl_raw, 2)}} \\, \\text{N/mm}^2`} />
                  </div>

                  {!hasPruefung ? (
                    <div className="border-t border-slate-100 pt-3">
                      <strong>Schritt 3: Sicherheitsabschlag (fehlende Bauwerksprüfung)</strong>
                      <p className="mt-1 text-xxs text-red-700">
                        Wegen reiner Einstufung nach Aktenlage ohne Bohrkernprüfung ist ein pauschaler Abschlag von <strong>3,0 N/mm²</strong> vorgeschrieben:
                      </p>
                      <BlockMath math={`f_{ck,act} = f_{ck,cyl} - 3{,}0 = ${formatDeTeX(f_ck_cyl_raw, 2)} - 3{,}0 = \\color{#A3113E}{${formatDeTeX(f_ck_act, 2)}} \\, \\text{N/mm}^2`} />
                    </div>
                  ) : (
                    <div className="border-t border-slate-100 pt-3 bg-green-50/50 p-2.5 rounded-lg border border-green-150">
                      <strong>Schritt 3: Einstufung nach Bauwerksprüfung</strong>
                      <p className="mt-1 text-xxs text-green-700">
                        Prüfwert: <InlineMath math={`f_{cm,cube} = ${formatDeTeX(pruefFestigkeit, 1)} \\, \\text{N/mm}^2`} />. Zuordnung zur Festigkeitsklasse: <strong>{testedKlasseLabel}</strong> (<InlineMath math={`f_{ck} = ${f_ck_tested} \\, \\text{N/mm}^2`} />)
                      </p>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-3">
                    <strong>Schritt 4: Heutiger Bemessungswert f_cd</strong>
                    <p className="mt-1 text-xxs">
                      Der Bemessungswert für die Tragfähigkeitsberechnung nach Eurocode 2 lautet:
                    </p>
                    <BlockMath math={`f_{cd} = \\alpha_{cc} \\cdot \\frac{f_{ck}}{\\gamma_C} = 0{,}85 \\cdot \\frac{\\color{#A3113E}{${formatDeTeX(f_ck_final, 1)}}}{1{,}5} = \\color{#A3113E}{${formatDeTeX(f_cd_bestand, 2)}} \\, \\text{N/mm}^2`} />
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl text-xs leading-relaxed font-normal ${
                    hasPruefung ? 'bg-green-50 border border-green-200 text-green-950' : 'bg-amber-50 border border-amber-200 text-amber-950'
                  }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                  <Sparkles size={16} />
                  <span>Tragfähigkeits-Potenzial im Bestand:</span>
                </div>
                <p>
                  Der Bemessungswert der Betondruckfestigkeit im Altbau beträgt für die Berechnungen <strong>{formatDeZahl(f_cd_bestand, 2)} N/mm²</strong>.
                </p>
                {hasPruefung ? (
                  <p className="text-xxs opacity-95 mt-1">
                    Durch die Durchführung von realen Bohrkernprüfungen entfällt der pauschale Sicherheitsabschlag. Sie erzielen eine höhere statisch anrechenbare Tragfähigkeit und vermeiden oft eine teure nachträgliche Verstärkung!
                  </p>
                ) : (
                  <p className="text-xxs opacity-95 mt-1">
                    Achtung: Ohne physische Prüfung müssen Sie den Sicherheitsabschlag von 3,0 MPa abziehen. Tipp: Das Durchführen zerstörender Materialprüfungen am realen Objekt rechnet sich meistens wirtschaftlich extrem schnell.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {bestandSubTab === 'stahl' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <History className="text-shiraz" size={16} /> Historische Betonstahl-Kenndaten
                </h3>

                {/* Stahlklasse Selector */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 block">Historische Betonstahl-Art:</label>
                  <select aria-label="Historische Betonstahl-Art" 
                    value={histStahlKlasse} 
                    onChange={(e) => setHistStahlKlasse(e.target.value as any)}
                    className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value="BSt220">Betonstahl I (BSt 220/340 RU) - Glatt, warmgewalzt, unberuhigt</option>
                    <option value="BSt420">Betonstahl III (BSt 420/500 RU) - Rippen/Sonderform, unberuhigt</option>
                    <option value="BSt500">Betonstahl IV (BSt 500/550 RK) - Gerippt, kaltverformt</option>
                  </select>
                </div>

                {/* Durchmesser Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700">Stabdurchmesser Ø:</span>
                    <span className="text-shiraz">{formatDeWert(diameterStahl)} mm</span>
                  </div>
                  <input 
                    type="range" 
                    min="6" 
                    max="32" 
                    step="2" 
                    value={diameterStahl} 
                    onChange={(e) => setDiameterStahl(parseInt(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                  Verbundeigenschaften & Zugkapazität (Eurocode 2)
                </h3>

                <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal font-sans">
                  <div>
                    <strong>Schritt 1: Bemessungswert der Streckgrenze f_yd</strong>
                    <p className="mt-1 text-xxs">
                      Berechnung mit dem Materialsicherheitsbeiwert <InlineMath math="\gamma_S = 1{,}15" />:
                    </p>
                    <BlockMath math={`f_{yd} = \\frac{f_{yk}}{\\gamma_S} = \\frac{\\color{#A3113E}{${f_yk_stahl}}}{1{,}15} = \\color{#A3113E}{${formatDeTeX(f_yd_stahl, 1)}} \\, \\text{N/mm}^2`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <strong>Schritt 2: Zugkapazität eines Einzelstabs F_yd</strong>
                    <BlockMath math={`A_s = \\frac{\\pi \\cdot d^2}{4} = \\frac{\\pi \\cdot \\color{#A3113E}{${formatDeTeXWert(diameterStahl)}}^2}{4} = \\color{#A3113E}{${formatDeTeX(steelArea, 1)}} \\, \\text{mm}^2`} />
                    <BlockMath math={`F_{yd} = A_s \\cdot f_{yd} = \\color{#A3113E}{${formatDeTeX(steelArea, 1)}} \\cdot \\color{#A3113E}{${formatDeTeX(f_yd_stahl, 1)}} \\cdot 10^{-3} = \\color{#A3113E}{${formatDeTeX(yieldCapacity, 1)}} \\, \\text{kN}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <strong>Schritt 3: Verbund- und Schweißeigenschaften</strong>
                    <div className="mt-1 text-xxs leading-normal">
                      {histStahlKlasse === 'BSt220' && (
                        <div className="text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-150 space-y-1">
                          <p className="font-bold">Achtung: Unberuhigt vergossener glatter Rundstahl (BSt 220 RU):</p>
                          <p>
                            - <strong>Keine Schweißeignung!</strong> Schweißen ist aufgrund der Gefahr von Heißrissen und plötzlichem Sprödbruch strengstens verboten.<br />
                            - <strong>Extrem geringe Verbundfestigkeit:</strong> Weil glatte Oberfläche, muss die Verbundspannung um 70% abgemindert werden (<InlineMath math="\eta_1 = 0{,}3" />).<br />
                            - <strong>Hakenverankerung zwingend erforderlich:</strong> Die Kraftübertragung kann statisch nicht allein durch Haftung am Stab entlang erfolgen. Winkelhaken oder Endhaken sind an Stabenden zwingend unerlässlich!
                          </p>
                        </div>
                      )}
                      {histStahlKlasse === 'BSt420' && (
                        <div className="text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-150 space-y-1">
                          <p className="font-bold">Hinweis: Betonstahl III (BSt 420/500 RU):</p>
                          <p>
                            - <strong>Schweißeignung kritisch:</strong> Meist unberuhigt vergossen, daher Schweißen nur in Ausnahmefällen unter strengen metallurgischen Sonderprüfungen gestattet.<br />
                            - <strong>Geringere Verbundwirkung:</strong> Die historische Schrägrippung ist unregelmäßiger und liefert eine geringere Verbundfestigkeit als moderne Betonstähle (<InlineMath math="\eta_1 \approx 0{,}7" />).
                          </p>
                        </div>
                      )}
                      {histStahlKlasse === 'BSt500' && (
                        <div className="text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-150 space-y-1">
                          <p className="font-bold">Hinweis: Kaltverformter gerippter Stahl (BSt 500 RK):</p>
                          <p>
                            - <strong>Bedingt schweißgeeignet:</strong> Kaltverformter Stahl verliert beim Erwärmen an Festigkeit. Schweißen vermindert die Streckgrenze in der Wärmeeinflusszone.<br />
                            - <strong>Gute Verbundwirkung:</strong> Gerippte Oberfläche erlaubt normalen Verbundnachweis (<InlineMath math="\eta_1 = 1{,}0" />).
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
