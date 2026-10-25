import { Database, Layers, ShieldCheck, Droplets, Scale, HelpCircle } from 'lucide-react';
import { formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';

interface DeponieProps {
  activeBarrier: number;
  depVInputValue: number;
  depVSelectedParam: string;
  deponieSection: "basis" | "oberflaeche";
  selectedLayerIndex: number;
  setActiveBarrier: React.Dispatch<React.SetStateAction<number>>;
  setDepVInputValue: React.Dispatch<React.SetStateAction<number>>;
  setDepVSelectedParam: React.Dispatch<React.SetStateAction<string>>;
  setDeponieSection: React.Dispatch<React.SetStateAction<"basis" | "oberflaeche">>;
  setSelectedLayerIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function Deponie({ activeBarrier, depVInputValue, depVSelectedParam, deponieSection, selectedLayerIndex, setActiveBarrier, setDepVInputValue, setDepVSelectedParam, setDeponieSection, setSelectedLayerIndex }: DeponieProps) {
    const deponieParams: Record<string, { name: string; unit: string; limits: number[]; isEluat: boolean }> = {
      toc: { name: 'TOC (Gesamter organisch gebundener Kohlenstoff)', unit: 'Masse-% TM', limits: [1.0, 1.0, 3.0, 6.0], isEluat: false },
      loi: { name: 'Glühverlust (Anteil an brennbaren organischen Stoffen)', unit: 'Masse-%', limits: [3.0, 3.0, 5.0, 10.0], isEluat: false },
      sulfat: { name: 'Sulfat (SO4 im Sickerwasser/Eluat)', unit: 'mg/l im Eluat', limits: [100, 2000, 2000, 5000], isEluat: true },
      chlorid: { name: 'Chlorid (Cl im Eluat)', unit: 'mg/l im Eluat', limits: [80, 1500, 1500, 2500], isEluat: true },
      pb: { name: 'Blei (Pb im Eluat)', unit: 'mg/l im Eluat', limits: [0.05, 0.2, 1.0, 5.0], isEluat: true },
      as: { name: 'Arsen (As im Eluat)', unit: 'mg/l im Eluat', limits: [0.05, 0.2, 0.2, 2.5], isEluat: true },
      cd: { name: 'Cadmium (Cd im Eluat)', unit: 'mg/l im Eluat', limits: [0.004, 0.05, 0.1, 0.5], isEluat: true },
      cu: { name: 'Kupfer (Cu im Eluat)', unit: 'mg/l im Eluat', limits: [0.2, 1.0, 5.0, 10.0], isEluat: true },
      ni: { name: 'Nickel (Ni im Eluat)', unit: 'mg/l im Eluat', limits: [0.04, 0.2, 1.0, 4.0], isEluat: true },
      zn: { name: 'Zink (Zn im Eluat)', unit: 'mg/l im Eluat', limits: [0.4, 2.0, 5.0, 20.0], isEluat: true },
      kw: { name: 'Mineralölkohlenwasserstoffe C10–C40 (nur DK 0 begrenzt)', unit: 'mg/kg TM (Feststoff)', limits: [500, Infinity, Infinity, Infinity], isEluat: false }
    };

    const paramInfo = deponieParams[depVSelectedParam] || deponieParams.toc;

    const isLte = (val: number, limit: number) => val <= limit;

    const dk0Allowed = isLte(depVInputValue, paramInfo.limits[0]);
    const dkIAllowed = isLte(depVInputValue, paramInfo.limits[1]);
    const dkIIAllowed = isLte(depVInputValue, paramInfo.limits[2]);
    const dkIIIAllowed = isLte(depVInputValue, paramInfo.limits[3]);

    let finalClassVerdict = '⛔ Überschreitung DK III Grenzwert: DK IV (Untertägige Einlagerung) oder Sondermüllvorbehandlung erforderlich!';
    let classColor = 'bg-shiraz/5 text-slate-900 border-shiraz/20';
    if (dk0Allowed) {
      finalClassVerdict = '💚 Unbedenklich: Geeignet für DK 0 (sowie DK I, DK II, DK III)';
      classColor = 'bg-slate-50 text-slate-800 border-home-grau/30';
    } else if (dkIAllowed) {
      finalClassVerdict = '✓ Zulässig ab Deponieklasse DK I (sowie DK II, DK III)';
      classColor = 'bg-slate-50 text-slate-800 border-home-grau/30';
    } else if (dkIIAllowed) {
      finalClassVerdict = '⚠️ Erhöht: Zulässig ab Deponieklasse DK II (sowie DK III)';
      classColor = 'bg-slate-50 text-slate-800 border-home-grau/30';
    } else if (dkIIIAllowed) {
      finalClassVerdict = '🚨 Gefährlich / Stark Belastet: Zulässig erst ab Deponieklasse DK III (Sondermüll)';
      classColor = 'bg-slate-50 text-slate-800 border-home-grau/30';
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div className="border-b border-home-grau/30 pb-4">
          <h3 className="text-2xl font-bold text-slate-850 flex items-center gap-2">
            <Database className="w-6 h-6 text-shiraz" />
            Deponieverordnung (DepV) &amp; Zuordnungsanalyse
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Mineralische Abfälle, die nicht verwertet werden können (z.B. fehlendes Recycling-Potential, Überschreitung der EBV-Werte), müssen deponiert werden. Die DepV teilt Deponien in 5 Klassen ein, basierend auf Schadstoffpotential und Auslaugverhalten.
          </p>
        </div>

        {/* Deponieklassen Übersicht */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="font-extrabold text-slate-600 uppercase text-xs tracking-wider">DK 0</span>
              <h4 className="font-bold text-slate-800 mb-2 mt-0.5">Inertabfalldeponie</h4>
              <p className="text-slate-600 leading-relaxed">Für unbelastete, inerte Bauabfälle, die sich chemisch, biologisch und physikalisch nicht verändern.</p>
            </div>
            <div className="mt-2 pt-2 border-t border-home-grau/30 font-medium text-xs text-slate-700">Beispiel: Reiner Boden, Kiese.</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="font-extrabold text-slate-550 uppercase text-xs tracking-wider font-semibold">DK I</span>
              <h4 className="font-bold text-slate-800 mb-2 mt-0.5">Nicht-gefährlich (Gering)</h4>
              <p className="text-slate-600 leading-relaxed">Gering belastete mineralische Baustoffe mit sehr moderaten Abdichtungsbarrieren.</p>
            </div>
            <div className="mt-2 pt-2 border-t border-home-grau/30 font-medium text-xs text-slate-700">Beispiel: Leicht kontaminierter Schutt.</div>
          </div>

          <div className="bg-slate-50/70 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="font-extrabold text-slate-550 uppercase text-xs tracking-wider font-semibold">DK II</span>
              <h4 className="font-bold text-slate-800 mb-2 mt-0.5">Hausmüllähnlich (Mäßig)</h4>
              <p className="text-slate-600 leading-relaxed">Klassische Siedlungs- und Bauabfälle. Höhere Anforderungen an Sickerwassererfassung und Basisabdichtungen.</p>
            </div>
            <div className="mt-2 pt-2 border-t border-home-grau/30 font-medium text-xs text-slate-700">Beispiel: Belastete Schlacken, Gipsbauteile.</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="font-extrabold text-slate-600 uppercase text-xs tracking-wider font-semibold">DK III</span>
              <h4 className="font-bold text-slate-800 mb-2 mt-0.5">Sondermülldeponie</h4>
              <p className="text-slate-650 leading-relaxed font-semibold">Überwachungspflichtige, gefährliche Abfälle. Extreme Sicherheitsstandards und doppelte Barrieren.</p>
            </div>
            <div className="mt-2 pt-2 border-t border-home-grau/30 font-medium text-xs text-slate-700">Beispiel: Asbestplatten, teerige Bahnen.</div>
          </div>

          <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/20 flex flex-col justify-between">
            <div>
              <span className="font-extrabold text-shiraz uppercase text-xs tracking-wider font-semibold">DK IV</span>
              <h4 className="font-bold text-slate-900 mb-2 mt-0.5">Untertagedeponie</h4>
              <p className="text-slate-700 leading-relaxed">Dauerhafte Kapselung in tiefen geologischen Steinsalz-Formationen, isoliert von Biosphäre.</p>
            </div>
            <div className="mt-2 pt-2 border-t border-shiraz/10 font-medium text-xs text-shiraz font-bold">Beispiel: Filtrieraschen, hochtoxische Schluffe.</div>
          </div>
        </div>

        {/* Interactive Limit Checker */}
        <div className="p-5 rounded-2xl bg-white border border-home-grau/30 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Interactive DepV Grenzwert-Prüfer</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Wählen Sie einen Analysenwert aus dem Laborprüfbericht (Eluat oder Feststoff), um die Mindest-Deponieklasse (nach DepV Anhang 3) sofort zu bestimmen.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Parameter / Schadstoff:</label>
                <select aria-label="Parameter / Schadstoff"
                  className="w-full text-xs font-mono bg-slate-50 border border-home-grau/30 rounded-lg p-2 outline-none focus:border-home-grau/30"
                  value={depVSelectedParam}
                  onChange={(e) => {
                    setDepVSelectedParam(e.target.value);
                    setDepVInputValue(deponieParams[e.target.value].limits[0]);
                  }}
                >
                  {Object.entries(deponieParams).map(([key, data]) => (
                    <option key={key} value={key}>{data.name} ({data.unit})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex justify-between">
                  <span>Labor-Analysenwert:</span>
                  <span className="font-mono text-slate-500 font-bold">{paramInfo.unit}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={paramInfo.limits[0] < 1 ? "0.001" : "0.5"}
                    min="0"
                    className="w-full text-xs font-mono bg-slate-50 border border-home-grau/30 rounded-lg p-2.5 outline-none focus:border-home-grau/30"
                    value={depVInputValue}
                    onChange={(e) => setDepVInputValue(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border text-xs font-bold leading-relaxed ${classColor}`}>
              {finalClassVerdict}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Gesetzliche Grenzwerte im Vergleich ({paramInfo.unit})</h5>

            <div className="space-y-3.5">
              {paramInfo.limits.map((lim, idx) => {
                const classes = [
                  { label: 'DK 0 (Inert)', desc: 'Unbelastete Boden- und Bauschuttfraktionen', color: 'bg-slate-100', text: 'text-slate-800' },
                  { label: 'DK I (Gering)', desc: 'Gering belastete mineralische Abfälle', color: 'bg-slate-100', text: 'text-slate-700' },
                  { label: 'DK II (Mäßig)', desc: 'Höher belastete mineralische und vorbehandelte Siedlungsabfälle', color: 'bg-slate-100', text: 'text-slate-700 font-medium' },
                  { label: 'DK III (Gefährlich)', desc: 'Gefährliche Abfälle, oberirdische Deponie', color: 'bg-slate-150', text: 'text-slate-800 font-bold' }
                ];
                const cls = classes[idx];
                const isOk = depVInputValue <= lim;

                return (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${isOk ? 'bg-slate-50 border-home-grau/30' : 'bg-shiraz/5 border-shiraz/10 opacity-80'}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${cls.color} ${cls.text} border border-home-grau/30`}>{cls.label}</span>
                        <span className="font-bold text-slate-800">{Number.isFinite(lim) ? `C ≤ ${formatDeWert(lim)} ${paramInfo.unit}` : 'kein Zuordnungswert'}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{cls.desc}</p>
                    </div>
                    <div>
                      {isOk ? (
                        <span className="px-2 py-1 text-xs font-bold rounded bg-slate-100 text-slate-800 border border-home-grau/30">✓ Einhaltbar</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-bold rounded bg-shiraz/15 text-shiraz border border-shiraz/35">❌ Überschritten</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 italic">
              ℹ️ <strong>Wichtiger Hinweis:</strong> In der Praxis werden nach DepV Anhang 3 über 40 Parameter zeitgleich analysiert. Überschreitet auch nur ein einziger Parameter den Grenzwert (z.B. hohe TOC-Werte durch Holzspäne oder hoher Sulfatwert durch Gips), stuft dies den gesamten Abfallkörper unweigerlich in die nächsthöhere Klasse ein!
            </p>
          </div>
        </div>

        {/* Analytical and biological background */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/30">
            <h4 className="font-bold text-slate-900 mb-2">Analytische Nachweisverfahren &amp; Eluatherstellung</h4>
            <ul className="space-y-3 text-slate-650 leading-relaxed font-medium">
              <li>
                <strong className="text-slate-800">Schüttelversuch (DIN EN 12457-4):</strong>
                <p className="text-xs mt-0.5 text-slate-500">Das Standard-Laborverfahren zur Bestimmung wasserlöslicher Stoffe. Der mechanisch zerkleinerte Feststoff wird im Gewichtsverhältnis 1:10 (1 kg Probe auf 10 Liter entionisiertes Wasser) über 24 Stunden rotatorisch geschüttelt. Die anschließende Membranfiltration liefert das "Eluat", das chemisch analysiert wird.</p>
              </li>
              <li>
                <strong className="text-slate-850">Säulenperkolationsprüfung (DIN 19528):</strong>
                <p className="text-xs mt-0.5 text-slate-500">
                  Im Zuge der Mantelverordnung 2023 massiv aufgewertet. Repräsentiert die realistische Freisetzungsdynamik besser als das statische Schütteln. Wasser sickert kontinuierlich von unten nach oben durch eine vertikal präparierte Materialsäule. Die Auswertung erfolgt fraktioniert nach dem Flüssigkeits-Feststoff-Verhältnis (L/S 2 bis L/S 4).
                </p>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/30">
            <h4 className="font-bold text-slate-900 mb-2">Gips, Sulfat &amp; die biologische Gefahrenkette</h4>
            <p className="text-slate-700 leading-relaxed mb-3">
              Der hohe Sulfatgehalt in Gipsplatten und Gipsfaserplatten stellt den Erd- und Deponiebau vor erhebliche chemisch-biologische Probleme:
            </p>
            <ul className="list-decimal pl-4 space-y-2 text-slate-600 font-medium">
              <li>
                <strong>Gipsdeponierungsverbot auf DK 0:</strong> Da DK 0 Deponien keine dichten geotechnischen Barrieren oder Sickerwasserreinigungen haben, führt die freie Auswaschung von Gips zu extrem hohen Sulfatkonzentrationen im Grundwasser.
              </li>
              <li>
                <strong>Anaerobe Fäulnisgasbildung (H2S):</strong> Werden Gipsrückstände unkontrolliert mit organischen Abfallbestandteilen (z.B. Holzresten) vermischt, wandeln sulfatreduzierende Bakterien unter Luftabschluss im feuchten Deponiekörper das Sulfat in hochgiftigen, metallkorrosiven und stark riechenden <strong>Schwefelwasserstoff (H2S)</strong> um.
              </li>
              <li>
                <strong>Ausschließliche Entsorgung als Monofraktion:</strong> Gips muss am Abbruchort strikt getrennt gesammelt werden. Größere Bauteilmengen werden zur Kreislauf-Verwertung in Gipsrecyclingwerke transportiert oder sortenrein in abgeschotteten Monokompartimenten auf DK II / DK III Deponien abgelagert.
              </li>
            </ul>
          </div>
        </div>

        {/* Aufbau- und Barriereprinzip der Deponie (Multibarrierenkonzept & technischer Schichtenaufbau) */}
        <div className="border-t border-home-grau/20 pt-6 mt-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-slate-850 flex items-center gap-2">
              <Layers className="w-5 h-5 text-shiraz" />
              Aufbau- und Barriereprinzip von Deponien (§ 3-14 DepV)
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Das Schutzkonzept moderner deponietechnischer Anlagen in Deutschland basiert auf dem <strong>Multibarrierenkonzept</strong> (Sicherheitsbarrieren) sowie einem hochpräzisen, regelkonformen <strong>Schichtenaufbau</strong> an Basis und Oberfläche.
            </p>
          </div>

          {/* 1. Multibarrierenkonzept */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-md">
            <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Das Multibarrierenkonzept (Die 5 Sicherheitsbarrieren)
            </h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Durch das Ineinandergreifen von fünf voneinander unabhängigen Sicherheitsbarrieren wird gewährleistet, dass selbst bei Ausfall einzelner Komponenten (z. B. einer Dichtungsbahn) keine Schadstoffe in die Biosphäre oder das Grundwasser gelangen können.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                {
                  num: 1,
                  label: "Barriere 1: Geologie",
                  sub: "Standort & Untergrund",
                  desc: "Der geologische Untergrund fungiert als natürlicher Schadstofffänger. Er muss homogen und gering durchlässig sein (DepV Anhang 1 Tab. 1: kf ≤ 1 · 10⁻⁹ m/s bei DK I–III, kf ≤ 1 · 10⁻⁷ m/s bei DK 0) und mind. 1 m (DK III: 5 m) mächtig sein, um einen hydrogeologischen Sicherheitsabstand zum nutzbaren Grundwasserleiter zu wahren.",
                  icon: ShieldCheck,
                },
                {
                  num: 2,
                  label: "Barriere 2: Abfallkörper",
                  sub: "TOC- & Reaktivitätssperre",
                  desc: "Verbot der Ablagerung von organischen, biologisch abbaubaren Altabfällen (TOC ≤ 3% auf DK II). Dies stoppt mikrobielle Gärungen, saure Sickerwasserphasen sowie explosive Gaskonzentrationen im Kern.",
                  icon: Database,
                },
                {
                  num: 3,
                  label: "Barriere 3: Basisabdichtung",
                  sub: "Doppelte Sperre & Dränung",
                  desc: "Kombinationsabdichtung am Deponieboden: Eine mindestens 50 cm dicke, mehrlagig eingebaute mineralische Dichtung (kf ≤ 5 · 10⁻¹⁰ m/s) wirkt direkt unter einer 2,5 mm starken HDPE-Kunststoffdichtungsbahn (KDB). Kiesdräns (16/32) leiten Eluate aktiv ab.",
                  icon: Layers,
                },
                {
                  num: 4,
                  label: "Barriere 4: Oberflächenabdichtung",
                  sub: "Kapselung & Rekultivierung",
                  desc: "Nach Verfüllung erfolgt der hermetische Verschluss von oben. Ein mehrteiliges System aus Tonschicht, KDB, Entwässerungsdrän und 1m Mutterboden leitet Regenwasser ab und stoppt das Einsickern vollständig.",
                  icon: Droplets,
                },
                {
                  num: 5,
                  label: "Barriere 5: Überwachung",
                  sub: "Monitoring & Nachsorge",
                  desc: "Kontrollierter Messstellenbetrieb im An- und Abstrom des Grundwassers, Sickerwasserreinigung und Gasverbrennung/Verwertung. Die Nachsorgephase läuft jahrzehntelang bis zur behördlichen Entlassung.",
                  icon: Scale,
                }
              ].map((bar) => {
                const isSelected = activeBarrier === bar.num;
                const IconComponent = bar.icon;
                return (
                  <button
                    key={bar.num}
                    onClick={() => setActiveBarrier(bar.num)}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                              isSelected
                                ? "bg-shiraz/5 border-shiraz text-slate-900 shadow-sm ring-1 ring-shiraz/50"
                                : "bg-slate-50 border-home-grau/30 text-slate-700 hover:bg-slate-100/50"
                            }`}
                  >
                    <div className="flex justify-between items-start w-full mb-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                                isSelected ? "bg-shiraz text-white" : "bg-slate-200 text-slate-600 border border-slate-300"
                              }`}>
                        {bar.num}
                      </span>
                      <IconComponent className={`w-4 h-4 ${isSelected ? "text-shiraz" : "text-slate-400"}`} />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs leading-snug">{bar.label}</h5>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">{bar.sub}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detaillierte Beschreibung der ausgewählten Barriere */}
            {(() => {
              const selectedBar = [
                {
                  num: 1,
                  label: "Barriere 1: Geologische Barriere (Standortwahllogik)",
                  desc: "Die erste Linie der Verteidigung ist der gewählte Bodenstandort selbst. Ein erstklassiger Deponiestandort befindet sich auf natürlichen Sedimentationsbecken (z.B. dicke Ton- oder Mergeldecken). Nach DepV Anhang 1 muss diese Schicht eine hohe Adsorptionskapazität aufweisen, um Kationen (z.B. Schwermetalle) durch Ionenaustausch an die Tonminerale (z.B. Montmorillonit) zu binden, falls es im Extremfall zu einer Sickerwasser-Migration kommen sollte.",
                  norm: "§ 5 DepV sowie DepV Anhang 1 i.V.m. TA Abfall.",
                },
                {
                  num: 2,
                  label: "Barriere 2: Reaktivitätsminderung im Deponiekörper (Abfallbeschaffenheit)",
                  desc: "Bevor Müll deponiert wird, muss sein biologisches und chemisches Reaktionspotenzial kontrolliert werden. Durch das strikte Verbot unvorbehandelter organischer Siedlungsabfälle wird der Deponiekörper biologisch inert gehalten. Geringe TOC-Grenzwerte (DK 0: ≤ 1%, DK II: ≤ 3%) verhindern die Bildung hochpathogener organischer Säuren, die ansonsten mineralische Bauteile und Tonschichten angreifen und dichte Barrieren chemisch zersetzen würden.",
                  norm: "§ 6 DepV (Annahmekriterien) und Anhang 3 Grenzwerttabellen.",
                },
                {
                  num: 3,
                  label: "Barriere 3: Das deponietechnische Basisabdichtungssystem",
                  desc: "Diese Barriere trennt den kontaminierten Abfall physisch vom darunterliegenden Boden. Sie besteht aus einer Kombinationsdichtung: Auf einer extrem dichten, mehrlagig feucht gewalzten mineralischen Dichtung (Ton, Dicke d ≥ 50 cm, kf ≤ 5 · 10⁻¹⁰ m/s) liegt direkt eine hochdichte Kunststoffdichtungsbahn (KDB, d ≥ 2,5 mm, HDPE). Eine mindestens 50 cm dicke mineralische Entwässerungsschicht (DK 0: 30 cm) fängt Sickerwässer ab, bevor diese hydrostatischen Druck auf die KDB ausüben können.",
                  norm: "Anhang 1 Nr. 2 DepV (Anforderungen an die Kombinationsabdichtung).",
                },
                {
                  num: 4,
                  label: "Barriere 4: Das mehrschichtige Oberflächenabdichtungssystem",
                  desc: "Nach vollständiger Verfüllung einer Deponiezelle wird diese 'gedeckelt', um das Eindringen von Regenwasser dauerhaft zu verhindern. Ohne Regenwasser entsteht kein nennenswertes Schadstoffeluat mehr im Abfallkörper. Die Oberfläche besteht von oben nach unten aus: mind. 1 Meter Rekultivierungsboden (Mutterboden + Bepflanzung), einer Entwässerungsschicht (Geodrän/Kies) zur schnellen Zuleitung fließenden Hangwassers nach außen, einem Dichtungselement (KDB oder Bentonitmatte) und einer Gasdränschicht zur sicheren Fassung von Diffusionsgasen.",
                  norm: "Anhang 1 Nr. 2, Tab. 2 DepV (Anforderungen an das Oberflächenabdichtungssystem).",
                },
                {
                  num: 5,
                  label: "Barriere 5: Systematisches Sickerwasser- & Grundwassermonitoring (Nachsorge)",
                  desc: "Regelmäßige Beprobungen an eigens dafür errichteten Grundwassermessstellen im direkten Anstrom (Referenzwert) und im Abstrom (Leckage-Detektion) der Deponie werden vierteljährlich durchgeführt. Das Sickerwasser wird über das Basisgefälle erfasst, in Schächten gesammelt und in speziellen physikalisch-chemischen und biologischen Reinigungsanlagen aufbereitet, bevor es in Vorfluter geleitet werden darf.",
                  norm: "§ 12 - 14 DepV (Abschluss, Nachsorge und Monitoring).",
                }
              ].find(b => b.num === activeBarrier);

              if (!selectedBar) return null;

              return (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-home-grau/20 text-xs animate-in fade-in duration-200">
                  <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-shiraz inline-block"></span>
                    {selectedBar.label}
                  </h5>
                  <p className="text-slate-650 leading-relaxed font-semibold mb-2">{selectedBar.desc}</p>
                  <div className="text-xs text-slate-550 font-mono">
                    <strong className="text-slate-600">Gesetzliche Norm:</strong> {selectedBar.norm}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 2. Technischer Schichtenaufbau (Interaktiver Visualisierer) */}
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/25 pb-3 mb-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-shiraz" />
                  Geotechnischer Schichtenaufbau nach DepV Anhang 1
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vergleichen Sie den normativen Aufbau der wissenschaftlich fundierten Dichtungsschichten an der Deponiebasis und der Oberfläche.
                </p>
              </div>

              <div className="flex p-0.5 bg-slate-100 rounded-lg border border-home-grau/30 self-start md:self-center">
                <button
                  onClick={() => { setDeponieSection('basis'); setSelectedLayerIndex(1); }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            deponieSection === 'basis' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                          }`}
                >
                  Basisabdichtung
                </button>
                <button
                  onClick={() => { setDeponieSection('oberflaeche'); setSelectedLayerIndex(0); }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            deponieSection === 'oberflaeche' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                          }`}
                >
                  Oberflächenabdichtung
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Visual Layer Stack Container */}
              <div className="md:col-span-5 flex flex-col space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-1">
                  {deponieSection === 'basis' ? "➔ INNEN (ABFALLKÖRPER)" : "➔ AUSSEN (ATMOSPHÄRE)"}
                </div>

                {/* Hier loopen wir über die Layer rückwärts oder vorwärts um von dem echten Stapel zu rendern */}
                {(deponieSection === 'basis' ? [
                  {
                    index: 0,
                    name: "Abfallkörper (Deponiegut, verdichtet)",
                    thickness: "variabel",
                    color: "bg-stone-400 hover:bg-stone-500 border-stone-500 text-stone-900",
                    previewText: "Abfallkörper (DK II / DK III)"
                  },
                  {
                    index: 1,
                    name: "Sickerwasserdränschicht (Kies-Leitschicht)",
                    thickness: "≥ 50 cm",
                    color: "bg-sky-200 hover:bg-sky-300 border-sky-400 text-sky-950",
                    previewText: "Kies-Filterträgdrän (16/32, kf ≥ 1e-3)"
                  },
                  {
                    index: 2,
                    name: "HDPE-Kunststoffdichtungsbahn (KDB)",
                    thickness: "≥ 2,5 mm",
                    color: "bg-slate-950 hover:bg-slate-900 border-slate-900 text-slate-100",
                    previewText: "Kunststoffdichtungsbahn (KDB - HDPE)"
                  },
                  {
                    index: 3,
                    name: "Mineralische Tonsperre (Mehrlagig)",
                    thickness: "≥ 50 cm",
                    color: "bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800",
                    previewText: "Mineralische Dichtung (mehrlagig)"
                  },
                  {
                    index: 4,
                    name: "Geologischer Barriereuntergrund (Tonmergel)",
                    thickness: "≥ 1,0 m (DK III: ≥ 5 m)",
                    color: "bg-amber-200/50 hover:bg-amber-200/70 border-amber-300/50 text-amber-900",
                    previewText: "Natürlicher Baugrund (kf ≤ 1 · 10⁻⁹ m/s)"
                  }
                ] : [
                  {
                    index: 0,
                    name: "Rekultivierungsschicht (Mutterboden)",
                    thickness: "≥ 1,0 m",
                    color: "bg-emerald-700/80 hover:bg-emerald-700/90 border-emerald-800 text-white",
                    previewText: "Mutterboden + Bepflanzung (Frostschutz)"
                  },
                  {
                    index: 1,
                    name: "Leitdränschicht (Dränmatte / Kies)",
                    thickness: "≥ 30 cm",
                    color: "bg-sky-150 hover:bg-sky-200 border-sky-300 text-sky-900",
                    previewText: "Sicker- & Hangwasserdrän (kf ≥ 1e-3)"
                  },
                  {
                    index: 2,
                    name: "Dichtungskomponente (KDB / Ton)",
                    thickness: "KDB ≥ 2,5mm",
                    color: "bg-slate-800 hover:bg-slate-700 border-slate-900 text-slate-200",
                    previewText: "Verbunddichtung (Polymer/Bentonit)"
                  },
                  {
                    index: 3,
                    name: "Gasdränschicht (Gasschliff)",
                    thickness: "≥ 30 cm",
                    color: "bg-stone-300 hover:bg-stone-350 border-stone-400 text-stone-800",
                    previewText: "Gasleitung (Entgasungs-Sandschicht)"
                  },
                  {
                    index: 4,
                    name: "Ausgleichsschicht (Planum)",
                    thickness: "≥ 20 cm",
                    color: "bg-stone-200 hover:bg-stone-250 border-stone-300 text-stone-600",
                    previewText: "Planierte Profil-Ausgleichsschicht"
                  }
                ]).map((lay) => {
                  const isSelected = selectedLayerIndex === lay.index;
                  return (
                    <button
                      key={lay.index}
                      onClick={() => setSelectedLayerIndex(lay.index)}
                      className={`w-full py-3 px-4 rounded-xl border text-left text-xs font-bold leading-normal transition-all relative ${lay.color} ${
                                isSelected ? "ring-2 ring-shiraz ring-offset-2 scale-[1.01]" : ""
                              }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="truncate">{lay.previewText}</span>
                        <span className="text-xs bg-white/70 text-slate-900 px-1.5 py-0.5 rounded font-mono border border-black/10 flex-shrink-0">
                          {lay.thickness}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-shiraz rounded-r"></span>
                      )}
                    </button>
                  );
                })}

                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mt-1">
                  {deponieSection === 'basis' ? "➔ AUSSEN (GRUNDWASSERPFAD)" : "➔ INNEN (ABFALLKERN)"}
                </div>
              </div>

              {/* Detailbeschreibung der selektierten Schicht */}
              <div className="md:col-span-7 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 h-full flex flex-col justify-between">
                {(() => {
                  const basisLayers: Record<number, { name: string; thickness: string; material: string; requirement: string; function: string }> = {
                    0: {
                      name: "Abfallkörper (Deponiegut, verdichtet)",
                      thickness: "Variabel (Betriebsphase)",
                      material: "Mineralischer Bauschutt, Schluffe, Asche etc. der DK II / III",
                      requirement: "Einhaltung der Zuordnungswerte Anhang 3 DepV",
                      function: "Einbau und kontrollierte biologisch-physikalische Verdichtung des Abfalls zur Vermeidung von späteren großflächigen Sackungen."
                    },
                    1: {
                      name: "Sickerwasserdränschicht (Kiesfilter)",
                      thickness: "≥ 50 cm (DK I–III; DK 0: ≥ 30 cm)",
                      material: "Grobkies (Körnung 16/32), karbonatarm (< 10% CaCO3)",
                      requirement: "Durchlässigkeit kf ≥ 1 · 10⁻³ m/s nach DepV",
                      function: "Rasche Erfassung und schadlose Ableitung von Sickerwasser zur Vermeidung von hydrostatischem Druck auf das empfindliche Abdichtungssystem."
                    },
                    2: {
                      name: "HDPE-Kunststoffdichtungsbahn (KDB)",
                      thickness: "≥ 2,5 mm",
                      material: "PE-HD (Polyethylen hoher Dichte) mit BAM-Zulassung",
                      requirement: "Heißluft- oder Extruderschweißung, vollständige geoelektrische Lecksuchprüfung, Schutz durch schwere Geotextil-Schutzvliese (GRK 5)",
                      function: "Die primäre, absolut wasserdichte stoffliche Barriere gegen den Durchstrom und die Diffusion schadstoffbelasteter Wässer."
                    },
                    3: {
                      name: "Mineralische Tonsperre (Kombinationsdichtung)",
                      thickness: "≥ 50 cm (mehrlagig eingebaut)",
                      material: "Spezialtone (Silt / Ton im Verbund)",
                      requirement: "kf ≤ 5 · 10⁻¹⁰ m/s nach Einbau und Walzenverdichtung (Proctor-Dichte ≥ 95%)",
                      function: "Kombinationsdichtung im hohlraumfreien Direktverbund mit der darüberliegenden KDB zur geotechnischen Selbstdichtung durch Quellung bei eventuellen Mikrorissen der Bahn."
                    },
                    4: {
                      name: "Geologischer Barriereuntergrund (Natürliche Barriere)",
                      thickness: "≥ 1,0 m (DK III: ≥ 5 m)",
                      material: "Homogener Fest- oder Lockergesteinskörper (z.B. Tonmergel, feiner Ton)",
                      requirement: "kf ≤ 1 · 10⁻⁹ m/s bei DK I–III (DK 0: ≤ 1 · 10⁻⁷ m/s); fehlende Mächtigkeit darf durch technische Maßnahmen ergänzt werden (DepV Anhang 1 Tab. 1)",
                      function: "Letzter massiver Schutz des lokalen Wasserspiegels durch hohes chemisch-physikalisches Schadstoff-Rückhalte- und Absorptionsvermögen geologischer Massivschichten."
                    }
                  };

                  const oberflaecheLayers: Record<number, { name: string; thickness: string; material: string; requirement: string; function: string }> = {
                    0: {
                      name: "Rekultivierungsschicht (Mutterboden)",
                      thickness: "≥ 1,0 m",
                      material: "Humusreicher Bodenaushub, wurzelfähiges Substrat",
                      requirement: "Vermeidung tiefwurzelnder Gehölze nach Bepflanzungsordnung (Dichtungsschutz)",
                      function: "Sichert ein stabiles Pflanzenwachstum als Erosionsschutz, schützt das Dichtungssystem vor winterlichem Frost/Dürre und speichert Regenwasser zur Verdunstung."
                    },
                    1: {
                      name: "Leitdränschicht (Oberflächendränung)",
                      thickness: "≥ 30 cm",
                      material: "Grobkies oder geosynthetische Dränmatte / Dränelemente",
                      requirement: "Durchlässigkeit kf ≥ 1 · 10⁻³ m/s",
                      function: "Zügiges horizontales Ableiten des durch den Oberboden sickernden Niederschlagswassers, damit kein Stauwasser über der Dichtungsschicht entsteht."
                    },
                    2: {
                      name: "Dichtungselement (KDB & Tonverbund)",
                      thickness: "KDB ≥ 2,5 mm und/oder Tonschicht",
                      material: "PE-HD Folie o. geosynthetische Tonsubstratbahn (Bento)",
                      requirement: "Zulassung nach Bundesanstalt für Materialforschung (BAM)",
                      function: "Verhindert verlässlich und dauerhaft das Einsickern von Oberflächen- bzw. Regenwasser in den darunterliegenden Deponiekörper, um so die Sickerwasserbildung im Kern zu stoppen."
                    },
                    3: {
                      name: "Gasdränschicht (Gasschliff)",
                      thickness: "≥ 30 cm",
                      material: "Sand oder feinkörniger Kies (kf ≥ 1 · 10⁻⁴ m/s)",
                      requirement: "Erhalt der Porenstruktur zur unbeeinträchtigten Gasströmung zur Absaugung",
                      function: "Sammelt aufsteigendes Deponiegas (Methan, Kohlendioxid) flächig unter der Dichtung ab und leitet es kontrolliert zu den Gasbrunnen für die BHKW-Verwertung."
                    },
                    4: {
                      name: "Ausgleichsschicht (Planum)",
                      thickness: "≥ 20 cm",
                      material: "Mineralstoffe (z.B. schluffarmer Sand, aufbereitetes RC-Material)",
                      requirement: "Lagestabilität und Verformungsausgleich",
                      function: "Gleicht lokale Verformungen des Abfallkörpers aus, schützt das Gassystem vor Müllkantendurchbrüchen und stellt ein geordnetes Mindestgefälle von 5% her."
                    }
                  };

                  const activeLayer = deponieSection === 'basis' ? basisLayers[selectedLayerIndex] : oberflaecheLayers[selectedLayerIndex];
                  if (!activeLayer) return null;

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-home-grau/25 pb-2">
                        <span className="text-xs font-bold text-shiraz uppercase tracking-wider">
                          {deponieSection === 'basis' ? `Basis-Schicht ${formatDeWert(selectedLayerIndex + 1)}` : `Oberflächen-Schicht ${formatDeWert(selectedLayerIndex + 1)}`}
                        </span>
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          Dicke: {activeLayer.thickness}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-extrabold text-slate-850 leading-tight">
                          {activeLayer.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          Regelstoff: <span className="text-slate-700">{activeLayer.material}</span>
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-xs">
                          <strong className="text-slate-800 block mb-1">🔍 Geotechnische Hauptfunktion:</strong>
                          <span className="text-slate-600 leading-relaxed font-semibold">{activeLayer.function}</span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-xs">
                          <strong className="text-slate-800 block mb-1">⚖️ Gesetzliche Mindestanforderung (DepV Anhang 1):</strong>
                          <span className="text-slate-550 font-mono leading-relaxed font-semibold">{activeLayer.requirement}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="mt-5 pt-3 border-t border-home-grau/20 flex items-center gap-1.5 text-xs text-slate-400">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>Klicken Sie auf eine Schicht im linken Stapel, um die hydraulischen Eigenschaften und materialtechnischen Parameter einzusehen.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
