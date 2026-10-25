import { List, AlertTriangle, ClipboardList } from 'lucide-react';

export default function AvvSchluessel() {
  return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <List className="w-5 h-5 text-emerald-600" />
          Abfallarten nach AVV (Kapitel 17)
        </h3>
        <p className="text-gray-700">
          Die Abfallverzeichnis-Verordnung (AVV) klassifiziert Abfälle europaweit einheitlich mit einem 6-stelligen Abfallschlüssel. Bau- und Abbruchabfälle finden sich in <strong>Kapitel 17</strong>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-semibold mb-3 text-shiraz">Mineralische Abfälle (17 01)</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li><strong>Beton (17 01 01):</strong> Sehr gut recycelbar (RC-Körnung).</li>
              <li><strong>Ziegel (17 01 02):</strong> Recycelbar, oft Einsatz im Erdbau oder als Vegetationssubstrat.</li>
              <li><strong>Fliesen, Ziegel und Keramik (17 01 03):</strong> Ähnlich wie Ziegel.</li>
              <li><strong>Gemische (17 01 07):</strong> Bauschuttgemische, aufwendiger zu recyceln als sortenreine Fraktionen.</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-semibold mb-3 text-shiraz">Holz, Glas und Kunststoff (17 02)</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li><strong>Holz (17 02 01):</strong> Einteilung in Altholzkategorien (A I bis A IV). Unbehandelt (A I) ist stofflich verwertbar, behandelt (A IV) muss thermisch verwertet werden.</li>
              <li><strong>Glas (17 02 02):</strong> Flachglas kann gut recycelt werden, wenn es sortenrein vorliegt.</li>
              <li><strong>Kunststoff (17 02 03):</strong> Z.B. PVC-Fensterrahmen, oft werkstofflich recycelbar.</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-semibold mb-3 text-shiraz">Metalle (17 04)</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li><strong>Kupfer, Bronze, Messing (17 04 01):</strong> Sehr hoher Schrottwert.</li>
              <li><strong>Aluminium (17 04 02):</strong> Hoher Wert, energiesparendes Recycling.</li>
              <li><strong>Eisen und Stahl (17 04 05):</strong> Bewehrungsstahl, Träger. Fast 100% Recyclingquote.</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
            <h4 className="font-semibold mb-3 text-shiraz">Weitere wichtige Gruppen</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li><strong>Bitumengemische (17 03):</strong> Strikte Trennung von teerhaltig (PAK-belastet, gefährlich) und rein bitumenhaltig (recycelbar).</li>
              <li><strong>Boden und Steine (17 05):</strong> Größter Massenstrom. Unbelastet (17 05 04) oft zur Verfüllung genutzt.</li>
              <li><strong>Dämmmaterial (17 06):</strong> Oft gefährlich (z.B. Asbest, alte Mineralwolle).</li>
            </ul>
          </div>
        </div>

        {/* Spiegeleinträge */}
        <div className="mt-6 bg-slate-50 p-5 rounded-xl border border-home-grau/30">
          <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-shiraz" /> Spiegeleinträge (Gefährliche vs. Nicht gefährliche Abfälle)
          </h4>
          <p className="text-sm text-slate-600 mb-3">
            Viele Abfallarten in der AVV treten als sogenannte <strong>Spiegeleinträge</strong> auf. Das bedeutet, es gibt für dieselbe Abfallart zwei Einträge: einen für die gefährliche Variante (mit Sternchen <strong>*</strong>) und einen für die nicht gefährliche Variante. Die Einstufung erfolgt anhand von Laboranalysen (Grenzwerte).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded border border-home-grau/30">
              <div className="font-bold text-shiraz mb-1">Beispiel: Gemischte Bau- und Abbruchabfälle</div>
              <ul className="space-y-1">
                <li><span className="font-mono font-bold">17 09 03*</span>: ... die gefährliche Stoffe enthalten.</li>
                <li><span className="font-mono font-bold">17 09 04</span>: ... mit Ausnahme derjenigen, die unter 17 09 01, 17 09 02 und 17 09 03 fallen.</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded border border-home-grau/30">
              <div className="font-bold text-shiraz mb-1">Beispiel: Boden und Steine</div>
              <ul className="space-y-1">
                <li><span className="font-mono font-bold">17 05 03*</span>: ... die gefährliche Stoffe enthalten.</li>
                <li><span className="font-mono font-bold">17 05 04</span>: ... mit Ausnahme derjenigen, die unter 17 05 03 fallen.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Checkliste: Abfallrechtliche Einstufung */}
        <div className="mt-8 bg-slate-50/50 p-6 rounded-xl border border-home-grau/30 shadow-sm">
          <h4 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-shiraz" /> Checkliste: Korrekte abfallrechtliche Einstufung von Baustellenabfällen
          </h4>
          <p className="text-xs text-slate-600 mb-6">
            Dieser systematische Leitfaden unterstützt Bauleiter und Umweltbeauftragte bei der rechtskonformen und haftungssicheren Klassifizierung anfallender Abfallströme auf der Baustelle gemäß KrWG, GewAbfV und AVV.
          </p>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                1
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  Getrennthaltungspflicht prüfen (§ 8 GewAbfV)
                </h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Klären Sie vorab, ob die Abfallfraktionen (Holz, Beton, Ziegel, Metalle, Glas, Kunststoffe, Bitumengemische) getrennt gesammelt werden können. Bei Abweichungen ist eine schriftliche Dokumentation der technischen Unmöglichkeit oder wirtschaftlichen Unzumutbarkeit zu erstellen (§ 8 Abs. 3 GewAbfV).
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                2
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  Erstzuordnung nach AVV Kapitel 17 vornehmen
                </h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Ordnen Sie den Abfall anhand seines Entstehungsorts und seiner Materialart einem 6-stelligen Abfallschlüssel im Kapitel 17 (z.B. <span className="font-mono bg-slate-50 border px-1 rounded font-bold text-slate-800">17 01 01</span> für Beton oder <span className="font-mono bg-slate-50 border px-1 rounded font-bold text-slate-800">17 05 04</span> für Boden/Steine) zu.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                3
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  Vorhandensein von Gefahrstoffen prüfen
                </h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Prüfen Sie, ob Hinweise auf historische Schadstoffe vorliegen (z.B. Asbest, teerhaltiger Gussasphalt, PCB-haltige Fugendichtstoffe, Holzschutzmittelhaltiges Altholz). Ziehen Sie hierzu Schadstoffgutachten, Bestandspläne und die historische Nutzung des Bauwerks heran.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                4
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  Spiegeleinträge & Analyseanforderung identifizieren
                </h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Wenn die Abfallart ein "Spiegeleintrag" ist (z.B. <span className="font-mono bg-slate-50 border px-1 rounded font-bold text-slate-800">17 05 03* / 17 05 04</span> oder <span className="font-mono bg-slate-50 border px-1 rounded font-bold text-slate-800">17 09 03* / 17 09 04</span>), veranlassen Sie rechtzeitig eine repräsentative Probenahme (z.B. nach LAGA PN 98) sowie Feststoff- und Eluat-Analysen im Fachlabor.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                5
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  Abfallschlüssel final festlegen & deklarieren
                </h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Legen Sie basierend auf den Analyseergebnissen und Grenzwerten den finalen Abfallschlüssel fest. Handelt es sich um gefährlichen Abfall (gekennzeichnet mit einem Sternchen *), greift das elektronische Abfallnachweisverfahren (eANV) mit Erzeugernummer und Entsorgungsnachweis.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                6
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  Transport und Übergabe dokumentieren
                </h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Übergeben Sie den Abfall nur an zertifizierte Entsorgungsfachbetriebe. Archivieren Sie sämtliche Wiegescheine, Begleitscheine, Übernahmescheine und Entsorgungsverträge im Abfallregister; die Registerbelege sind mindestens 3 Jahre ab Einstellung in das Register aufzubewahren (§ 25 NachwV; der Zulassungsbescheid einer Entsorgungsanlage kann längere Fristen festlegen) und den Aufsichtsbehörden auf Verlangen vorzulegen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
