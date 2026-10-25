import { Search, Scale, AlertTriangle } from 'lucide-react';
import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import React from 'react';

interface LagaPn98Props {
  pnGrainSize: string;
  pnMaterialState: "homogen" | "heterogen";
  pnVolume: number;
  setPnGrainSize: React.Dispatch<React.SetStateAction<string>>;
  setPnMaterialState: React.Dispatch<React.SetStateAction<"homogen" | "heterogen">>;
  setPnVolume: React.Dispatch<React.SetStateAction<number>>;
}

export default function LagaPn98({ pnGrainSize, pnMaterialState, pnVolume, setPnGrainSize, setPnMaterialState, setPnVolume }: LagaPn98Props) {
    // Calculate LAGA PN 98 limits dynamically
    // LAGA PN 98 (Mitteilung 32), Tabelle 2: Mindestanzahl Einzel-, Misch- und Laborproben
    // (gilt unabhängig von der Homogenität; Reduktion nur bei dokumentierter Vorkenntnis zulässig)
    const pnStufen = [30, 60, 100, 150, 200, 300, 400, 500, 600];
    let mischproben = 10;
    let laborproben = 10;
    if (pnVolume <= 600) {
      const idx = pnStufen.findIndex(g => pnVolume <= g);
      mischproben = idx + 2;
      laborproben = idx + 2;
    } else {
      mischproben = 10 + Math.ceil((pnVolume - 600) / 100);
      laborproben = 10 + Math.ceil((pnVolume - 600) / 300);
    }
    const einzelproben = 4 * mischproben;
    if (pnMaterialState === 'heterogen') {
      // Heterogenes Material: Tabellenwerte sind Mindestwerte; ggf. Teilmengen bilden (keine Reduktion)
      laborproben = mischproben;
    }

    // Container size constraints based on grain size
    // LAGA PN 98, Tabelle 3: Mindestvolumen Einzel-/Laborprobe nach Größtkorn
    let minVolEinzel = 2.0;
    let minVolVerbund = 4.0;
    let grainLabel = 'Grobkörnig (20 < d ≤ 50 mm)';

    if (pnGrainSize === '2') {
      minVolEinzel = 0.5;
      minVolVerbund = 1.0;
      grainLabel = 'Feinkörnig (d ≤ 2 mm)';
    } else if (pnGrainSize === '8' || pnGrainSize === '16') {
      minVolEinzel = 1.0;
      minVolVerbund = 2.0;
      grainLabel = 'Mittelkörnig (2 < d ≤ 20 mm)';
    } else if (pnGrainSize === '32') {
      minVolEinzel = 2.0;
      minVolVerbund = 4.0;
      grainLabel = 'Grobkörnig (20 < d ≤ 50 mm)';
    } else if (pnGrainSize === '63') {
      minVolEinzel = 5.0;
      minVolVerbund = 10.0;
      grainLabel = 'Sehr grobkörnig (50 < d ≤ 120 mm)';
    } else if (pnGrainSize === '120') {
      minVolEinzel = 5.0;
      minVolVerbund = 10.0;
      grainLabel = 'Stückig (d > 120 mm: Stücke einzeln als Einzelprobe)';
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div className="border-b border-home-grau/30 pb-4">
          <h3 className="text-2xl font-bold text-slate-850 flex items-center gap-2">
            <Search className="w-6 h-6 text-emerald-600" />
            Probenahme nach LAGA PN 98 &amp; DIN 19698
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Bauabfall- und Bodendeklarationen erfordern repräsentative Sammelanalysen von Haufwerken (Haufwerksbeprobung) nach bundeseinheitlichen Standards, um Fehlentsorgungen und Haftungskonsequenzen auszuschließen.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="p-5 bg-white border border-home-grau/30 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Interaktiver Beprobungsplaner</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Berechnen Sie das offizielle Probenahmeschema nach der LAGA PN 98 Richtline sowie DIN 19698-1 für Haufwerke.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">1. Haufwerksvolumen (m³):</label>
                <input aria-label="1. Haufwerksvolumen (m³)"
                  type="number"
                  min="1"
                  max="20000"
                  className="w-full text-xs font-mono bg-slate-50 border border-home-grau/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  value={pnVolume}
                  onChange={(e) => setPnVolume(Math.max(1, parseInt(e.target.value) || 0))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">2. Homogenität des Materials:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button aria-pressed={pnMaterialState === 'homogen'}
                    type="button"
                    onClick={() => setPnMaterialState('homogen')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              pnMaterialState === 'homogen'
                                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                                : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                            }`}
                  >
                    Homogen
                    <span className="block text-xs opacity-80 font-normal mt-0.5">(z.B. reiner Asphalt, Sand)</span>
                  </button>
                  <button aria-pressed={pnMaterialState === 'heterogen'}
                    type="button"
                    onClick={() => setPnMaterialState('heterogen')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              pnMaterialState === 'heterogen'
                                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                                : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                            }`}
                  >
                    Heterogen
                    <span className="block text-xs opacity-80 font-normal mt-0.5">(z.B. Bauschutt, Hausmüll)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">3. Größtkorn d (mm):</label>
                <select aria-label="3. Größtkorn d (mm)"
                  className="w-full text-xs bg-slate-50 border border-home-grau/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                  value={pnGrainSize}
                  onChange={(e) => setPnGrainSize(e.target.value)}
                >
                  <option value="2">Sand / Feinmaterial (d ≤ 2 mm)</option>
                  <option value="8">Feinkorn / Siebschutt (d ≤ 8 mm)</option>
                  <option value="16">Splitt / mittlerer Schutt (d ≤ 16 mm)</option>
                  <option value="32">Regelfall Bauschutt-Brechergut (d ≤ 32 mm)</option>
                  <option value="63">Grobmaterial / Bahnschotter (50 &lt; d ≤ 120 mm)</option>
                  <option value="120">Stückig / Ungebrochen (d &gt; 120 mm)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Vorgeschriebener Beprobungsumfang (Tabelle 2 LAGA)</h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Einzelproben */}
              <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-500 uppercase">Anzahl Einzelproben (EP)</span>
                  <div className="text-3xl font-extrabold text-emerald-800 mt-1">{formatDeWert(einzelproben)}</div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Einzelproben müssen gleichmäßig verteilt über drei Dimensionen (oben, mitte, unten, tief im Haldenkörper) entnommen werden.
                  </p>
                </div>
              </div>

              {/* Card 2: Mischproben */}
              <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-500 uppercase">Labor- / Mischproben (MP)</span>
                  <div className="text-3xl font-extrabold text-emerald-800 mt-1">{formatDeWert(mischproben)}</div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Die EP werden zu {formatDeWert(mischproben)} repräsentativen Mischprobe(n) vereint und anschließend fachgerecht homogenisiert.
                  </p>
                </div>
              </div>

              {/* Card 3: Mindestvolumen Einzelprobe */}
              <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-500 uppercase">Mindestvolumen je Einzelprobe</span>
                  <div className="text-2xl font-extrabold text-slate-800 mt-1">{formatDeWert(minVolEinzel)} Liter <span className="text-xs font-semibold text-slate-500">(≈ {formatDeZahl(minVolEinzel * 1.6, 1)} kg bei 1,6 t/m³)</span></div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Abhängig vom Größtkorn. Zu geringe Probemengen verletzen das Repräsentativitätsgebot der LAGA Richtlinie.
                  </p>
                </div>
              </div>

              {/* Card 4: Mindestvolumen Verbundprobe */}
              <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-500 uppercase">Laborproben-Sollvolumen</span>
                  <div className="text-2xl font-extrabold text-slate-800 mt-1">{formatDeWert(minVolVerbund)} Liter <span className="text-xs font-semibold text-slate-500">(Laborprobe; {formatDeWert(laborproben)} Laborproben)</span></div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Mindestvolumen der laborbereiten Probe nach Homogenisierung (mittels Kegel- &amp; Viertelmethode oder Probenteiler).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-150 text-xs leading-relaxed text-emerald-950 font-semibold">
              📋 <strong className="text-emerald-900 leading-normal">Gesamtbilanz für {formatDeWert(pnVolume)} m³ ({pnMaterialState}):</strong> Es müssen mindestens <strong>{formatDeWert(einzelproben)} Einzelproben</strong> à <strong>{formatDeWert(minVolEinzel)} l</strong> gezogen werden. Das Gesamtgewicht des Beprobungsvorganges im Feld liegt somit bei mindestens <strong>{formatDeZahl(einzelproben * minVolEinzel, 1)} Litern</strong> mineralischem Probengut, um daraus die <strong>{formatDeWert(mischproben)} Laborprobe(n)</strong> zu speisen.
            </div>
          </div>
        </div>

        {/* Legal and methodological guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-wider">
              <Scale className="w-4 h-4 text-slate-500" />
              Entscheidende Abgrenzung: LAGA PN 98 vs. DIN 19698
            </h4>
            <p className="text-slate-600">
              In Ausschreibungen und Prüfberichten herrscht oft Verwirrung über die geltenden Normen. Unter der <strong>Mantelverordnung 2023</strong> ist die Lage vom Gesetzgeber klarer geregelt worden:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600 font-semibold">
              <li>
                <strong>Geltungsbereich Boden &amp; Ersatzbaustoffe (BBodSchV §§ 18–24, EBV §§ 8 und 14):</strong> Haufwerke sind nach § 21 BBodSchV bzw. § 8 EBV nach <strong>LAGA PN 98</strong> zu beproben. Für die Probenahme von Böden in situ kann nach § 14 Abs. 2 EBV insbesondere <strong>DIN 19698-6</strong> (2019-01) herangezogen werden.
              </li>
              <li>
                <strong>Geltungsbereich Bauschutt &amp; Deponien (DepV § 8, Anhang 4):</strong> Bauschuttfraktionen und Zuordnungsanalysen mineralischer Abfälle zur Deponierung stützen sich nach wie vor auf den Vollzug der <strong>LAGA PN 98</strong> in Kombination mit landsspezifischen Richtlinien des Landesamtes für Umwelt (z.B. Bayern, Thüringen, Hessen).
              </li>
              <li>
                <strong>Die Probenahmestrategie:</strong> Beide Normen fordern für Haufwerke das systematische Abtragen oder Durchstechen mittels Baggerschaufeln und weisen oberflächliche Entnahmen (Randbeprobungen) scharf zurück.
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Landesrecht &amp; Erleichterte Probenahmen
            </h4>
            <p className="text-slate-600">
              Um kleine Baustellen vor übertriebenen Laborkosten zu schützen, haben viele Landesämter für Umwelt (LfU) Ausnahmeregeln erlassen:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600 font-semibold">
              <li>
                <strong>Bayerisches Landesamt für Umwelt (LfU Bayern):</strong> Die Arbeitshilfe „Umgang mit Bodenmaterial“ (Stand Oktober 2025) sieht für kleine Baumaßnahmen bis <strong>500 m³</strong> ohne Kontaminationsverdacht Ausnahmen von der Untersuchungspflicht vor und begrenzt Haufwerke in Zwischenlägern auf 3.000 m³ je Untersuchung (Voraussetzungen im Original prüfen).
              </li>
              <li>
                <strong>Das "Vierteln &amp; Schaufeln"-Verfahren:</strong> Zur Verkleinerung und Homogenisierung wird der Haufwerks-Gesamtauszug kegelförmig aufgeschüttet, in vier Quadranten geteilt, wovon zwei gegenüberliegende Viertel verworfen werden. Dieser Vorgang wird wiederholt, bis das Sollvolumen der Laborflaschen erreicht ist.
              </li>
              <li>
                <strong>Gefahrenquelle Falschbeprobung:</strong> Häufige Ursache für nicht verwertbare Ergebnisse sind Fehler im Probenahmeprotokoll oder fehlende Fachkunde der Probenehmer.
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
}
