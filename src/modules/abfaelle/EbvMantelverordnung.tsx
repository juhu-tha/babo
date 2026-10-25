import { Recycle, Scale, Layers, Check, AlertCircle, X, FileSignature } from 'lucide-react';
import React from 'react';

interface EbvMantelverordnungProps {
  ebvEinbauweise: string;
  ebvGrundwasser: string;
  ebvMaterial: string;
  ebvSchutzgebiet: string;
  ebvVolumen: string;
  evaluateEBV: () => { status: "allowed" | "restricted" | "forbidden"; message: string; conditions: string[]; anzeige: string; };
  setEbvEinbauweise: React.Dispatch<React.SetStateAction<string>>;
  setEbvGrundwasser: React.Dispatch<React.SetStateAction<string>>;
  setEbvMaterial: React.Dispatch<React.SetStateAction<string>>;
  setEbvSchutzgebiet: React.Dispatch<React.SetStateAction<string>>;
  setEbvVolumen: React.Dispatch<React.SetStateAction<string>>;
}

export default function EbvMantelverordnung({ ebvEinbauweise, ebvGrundwasser, ebvMaterial, ebvSchutzgebiet, ebvVolumen, evaluateEBV, setEbvEinbauweise, setEbvGrundwasser, setEbvMaterial, setEbvSchutzgebiet, setEbvVolumen }: EbvMantelverordnungProps) {
  return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div className="border-b border-home-grau/30 pb-4">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Recycle className="w-7 h-7 text-teal-600" />
            Ersatzbaustoffverordnung (EBV)
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Die seit dem <strong>1. August 2023</strong> bundeseinheitlich geltende Verordnung (Teil der Mantelverordnung für Ersatzbaustoffe und Bodenschutz) regelt die Herstellung, Güteüberwachung und den Einbau von mineralischen Ersatzbaustoffen (MEB).
          </p>
        </div>

        {/* Systemwechsel Banner */}
        <div className="bg-slate-100 hover:bg-slate-100/90 transition-all p-5 rounded-xl border border-home-grau/30 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Scale className="w-5 h-5 text-slate-600" />
            Historischer Systemwechsel: Deutschlandweit einheitlich
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Die EBV hat die unzähligen, regional stark abweichenden Regelungen der Bundesländer (darunter vor allem die veraltete <strong>LAGA-Mitteilung 20 (LAGA M20)</strong> für den technischen Einbau) vollständig abgelöst. Sie schafft endlich Rechtssicherheit für Recyclingbetriebe, Bauunternehmer, Behörden und Schutzzonen-Planer. Einbauvorgaben hängen nun nicht mehr von regionalen Erlassen ab, sondern sind bundeseinheitlich in standardisierten <strong>Einbaumatrizen</strong> definiert.
          </p>
        </div>

        {/* Mantelverordnung Gesamtgefüge */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-6">
          <div>
            <h4 className="font-bold text-slate-950 mb-1 flex items-center gap-2 text-base">
              <Scale className="w-5 h-5 text-indigo-600" />
              Die Mantelverordnung (MaV) im Gesamtgefüge
            </h4>
            <p className="text-xs text-slate-500">
              Die "Mantelverordnung für Ersatzbaustoffe und Bodenschutz" (Musterverordnung verkündet 2021, bundesweit bindend seit 1. August 2023) ist das größte umwelt- und baurechtliche Gesetzgebungswerk der letzten Jahrzehnte. Sie ist als "Mantel" konzipiert, der vier Kernverordnungen umschließt und ineinander verzahnt:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-teal-50/55 border border-teal-100 flex flex-col justify-between">
              <div>
                <div className="font-extrabold text-teal-800 mb-1.5 uppercase tracking-wider text-xs">Artikel 1</div>
                <h5 className="font-bold text-teal-950 mb-2 leading-snug">Ersatzbaustoffverordnung (EBV)</h5>
                <p className="text-slate-600 leading-relaxed">
                  Regelt bundesweit einheitlich die Herstellung, Güteüberwachung (QUBA, WPK, Fremdüberwachung) und den technischen Einbau von mineralischen Ersatzbaustoffen (MEB) in Straßen, Wegen, Schienenwegen und Erdbaubauwerken.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/55 border border-rose-100 flex flex-col justify-between">
              <div>
                <div className="font-extrabold text-rose-800 mb-1.5 uppercase tracking-wider text-xs">Artikel 2</div>
                <h5 className="font-bold text-rose-950 mb-2 leading-snug">Neufassung der BBodSchV</h5>
                <p className="text-slate-600 leading-relaxed">
                  Regelt die Verwertung von Bodenmaterial <strong>außerhalb</strong> von technischen Bauwerken (z. B. zur Rekultivierung, in Landschaftsbauwerke oder für Geländeauffüllungen) sowie die Sanierung von Altlasten.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100/55 border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider text-xs">Zugehörige Novelle</div>
                <h5 className="font-bold text-slate-950 mb-2 leading-snug">Deponieverordnung (DepV)</h5>
                <p className="text-slate-600 leading-relaxed">
                  Passt die deponierechtlichen Zuordnungswerte und Annahmeparameter an die neuen analytischen Bestimmungen (z. B. Säulenperkolation) der EBV an, um Entsorgungskreisläufe lückenlos abzustimmen.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/55 border border-blue-100 flex flex-col justify-between">
              <div>
                <div className="font-extrabold text-blue-800 mb-1.5 uppercase tracking-wider text-xs">Zugehörige Novelle</div>
                <h5 className="font-bold text-blue-950 mb-2 leading-snug">Gewerbeabfallverordnung (GewAbfV)</h5>
                <p className="text-slate-600 leading-relaxed">
                  Verschärft die Pflicht zur getrennten Sammlung von gewerblichen Bau- und Abbruchabfällen direkt an der Anfallstelle auf der Baustelle (§ 8 GewAbfV: zehn Fraktionen; eine feste Mindestquote gibt es für Bauabfälle nicht – die 90-%-Getrenntsammlungsquote des § 4 Abs. 3 betrifft gewerbliche Siedlungsabfälle).
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-home-grau/30 pt-4">
            <h5 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider">Gegenüberstellung: Rechtlicher Quantensprung</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-home-grau/30">
                <div className="font-bold text-slate-800 mb-1">Vor dem 01. August 2023:</div>
                <ul className="space-y-1.5 text-slate-600 font-medium font-semibold">
                  <li>❌ <strong className="text-slate-800 font-bold">LAGA M20:</strong> Kein Gesetz, sondern nur eine Länder-Arbeitsgemeinschafts-Richtlinie mit verfahrenstechnischen Spielräumen.</li>
                  <li>❌ <strong className="text-slate-800 font-bold">Flickenteppich:</strong> 16 Bundesländer hatten eigene, sich widersprechende Verwertungsrichtlinien und Zulassungsbescheide.</li>
                  <li>❌ <strong className="text-slate-800 font-bold">Haftungsangst:</strong> Da recycelter Bauschutt rechtlich unlösbar an den Status "Abfall" gekoppelt war, scheuten Bauherren das Einbaurisiko.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-home-grau/30">
                <div className="font-bold text-slate-800 mb-1">Seit dem 01. August 2023 (MaV):</div>
                <ul className="space-y-1.5 text-slate-600 font-medium font-semibold">
                  <li>✓ <strong className="text-slate-800 font-bold">Bundesrecht:</strong> Ein einheitliches Gesetz bricht ungleiches Länderrecht. Volle Akzeptanz bei länderübergreifenden Projekten.</li>
                  <li>✓ <strong className="text-slate-800 font-bold">Produktstatus (§ 12 KrWG):</strong> Erstmalige gesetzlich verankerte Entlassung überwachter Sekundärbaustoffe aus dem Abfallregime.</li>
                  <li>✓ <strong className="text-slate-800 font-bold">Katasterpflicht:</strong> Größere Wiedereinbaumaßnahmen (ab 250 m³) sind rechtlich belastbar behördenregistriert (Sicherheit für nachfolgende Baueigentümer).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Materialklassen-Katalog */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-shiraz" />
            Güteklassen & Materialarten (MEB)
          </h4>
          <p className="text-sm text-slate-600 mb-2">
            Mineralische Ersatzbaustoffe werden anhand anspruchsvoller Analytik (Haufwerksbeprobung nach PN 98, Eluat- und Feststoffprüfungen) in präzise Güteklassen eingestuft. Jede Klasse hat Grenzwerte für Leitfähigkeit, pH-Wert, Sulfat, Chlorid sowie Schwermetalle und organische Schadstoffe (PAK, Kohlenwasserstoffe):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs">
              <span className="inline-block px-2.5 py-1 text-xs font-bold rounded bg-slate-100 text-slate-800 mb-2 border border-home-grau/30">Bodenmaterial & Baggergut</span>
              <ul className="space-y-1 text-xs text-slate-600 font-medium font-semibold">
                <li>• <strong className="text-slate-800">BM-0 / BG-0:</strong> Unbelastetes, naturbelassenes Material.</li>
                <li>• <strong className="text-slate-800">BM-0* / BG-0*:</strong> Geringfügig verändert, bodenähnlich.</li>
                <li>• <strong className="text-slate-800">BM-F1 / BG-F1:</strong> Eingeschränkter offener Einbau im Erdbau.</li>
                <li>• <strong className="text-slate-800">BM-F2 / BG-F2:</strong> Technisch gesicherter Einbau (versiegelt).</li>
                <li>• <strong className="text-slate-800">BM-F3 / BG-F3:</strong> Stark umschlossene technische Bauwerke.</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs">
              <span className="inline-block px-2.5 py-1 text-xs font-bold rounded bg-slate-100 text-slate-800 mb-2 border border-home-grau/30">Recycling & Gleisschotter</span>
              <ul className="space-y-1 text-xs text-slate-600 font-medium font-semibold">
                <li>• <strong className="text-slate-800">RC-1:</strong> Hochwertige Recyclingbaustoffe (z.B. Beton- o. Asphalt-Brechsand). Vielfach einsetzbar.</li>
                <li>• <strong className="text-slate-800">RC-2:</strong> Mittlerer Belastungsgrad. Regelhaft nur unter versiegelten Deckschichten (Asphalt/Beton).</li>
                <li>• <strong className="text-slate-800">RC-3:</strong> Höhere Gehalte. Nur in stark geschützten technischen Bauwerken im Straßenbau.</li>
                <li>• <strong className="text-slate-800">GS-0 bis GS-F3:</strong> Aufbereiteter Gleisschotter.</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs">
              <span className="inline-block px-2.5 py-1 text-xs font-bold rounded bg-slate-100 text-slate-800 mb-2 border border-home-grau/30">Slags, Aschen & Co.</span>
              <ul className="space-y-1 text-xs text-slate-600 font-medium font-semibold">
                <li>• <strong className="text-slate-800">HMVA-1 / HMVA-2:</strong> Hausmüllverbrennungsaschelite. Streng kontrollierte Einbindung in dichte Tragschichten.</li>
                <li>• <strong className="text-slate-800">SWS-1 bis SWS-3:</strong> Aufbereitete Schlacken aus der Stahlgewinnung (Stahlwerksschlacke).</li>
                <li>• <strong className="text-slate-800">HOS / MHS / KUP:</strong> Hochofen-, Metallhütten- und Kupferschlacken.</li>
              </ul>
            </div>
          </div>
        </div>

         {/* EBV-EINBAU-KONFIGURATOR (Interactive Applet Element) */}
        <div className="bg-slate-100 border border-home-grau/30 p-6 rounded-2xl space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Scale className="text-shiraz w-5 h-5" />
              Interaktiver EBV-Einbau-Konfigurator (Einbaumatrix)
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Geben Sie die Parameter Ihres geplanten Bauvorhabens ein, um die Zulässigkeit des Materials, eventuelle Schutzauflagen und die Anzeigepflichten gemäß der bundeseinheitlichen Einbautabelle zu ermitteln.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls Column */}
            <div className="lg:col-span-7 space-y-4">
              {/* Materialauswahl */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">1. Material & Güteklasse (MEB)</label>
                <select aria-label="1. Material & Güteklasse (MEB)" 
                  value={ebvMaterial} 
                  onChange={(e) => setEbvMaterial(e.target.value)} 
                  className="w-full bg-white text-slate-800 border border-home-grau/30 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="bm0">Bodenmaterial BM-0 / Baggergut BG-0 (vollst. unbelastet)</option>
                  <option value="bm0_star">Bodenmaterial BM-0* / Baggergut BG-0* (Schadstoffvorkommen minimal)</option>
                  <option value="rc1">Recycling-Baustoff RC-1 / Gleisschotter GS-1 (sehr gut aufbereitet)</option>
                  <option value="bm_f1">Bodenmaterial BM-F1 / Baggergut BG-F1 (leicht belasteter Erdaushub)</option>
                  <option value="rc2">Recycling-Baustoff RC-2 / Gleisschotter GS-2 (mittlere Eluatbelastung)</option>
                  <option value="bm_f2">Bodenmaterial BM-F2 / Hausmüllverbrennungsasche HMVA-1</option>
                  <option value="rc3">Recycling-Baustoff RC-3 / Bodenmaterial BM-F3 / HMVA-2</option>
                </select>
              </div>

              {/* Wasserschutzgebiet */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">2. Wasserschutzgebiet (Grundwasserschutzbereich)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ausserhalb', label: 'Kein Wasserschutzgebiet' },
                    { id: 'wsg_3', label: 'Zone III / III B' },
                    { id: 'wsg_1_2', label: 'Zone I / II / III A' }
                  ].map((z) => (
                    <button aria-pressed={ebvSchutzgebiet === z.id}
                      key={z.id}
                      type="button"
                      onClick={() => setEbvSchutzgebiet(z.id)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                              ebvSchutzgebiet === z.id
                                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                                : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                            }`}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hydrogeologie */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold">
                  3. Hydrogeologie (Natürlicher Bodenschutz & Deckschicht)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button aria-pressed={ebvGrundwasser === 'deckschicht_ja'}
                    type="button"
                    onClick={() => setEbvGrundwasser('deckschicht_ja')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all flex flex-col justify-start leading-tight ${
                            ebvGrundwasser === 'deckschicht_ja'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                  >
                    <span className="font-bold">Günstige Deckschicht</span>
                    <span className="text-xs opacity-90 mt-0.5 font-semibold">Lehm/Ton vorhanden, Abstand &gt; 1,5m</span>
                  </button>
                  <button aria-pressed={ebvGrundwasser === 'deckschicht_nein'}
                    type="button"
                    onClick={() => setEbvGrundwasser('deckschicht_nein')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all flex flex-col justify-start leading-tight ${
                            ebvGrundwasser === 'deckschicht_nein'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                  >
                    <span className="font-bold">Ungünstige Verhältnisse</span>
                    <span className="text-xs opacity-90 mt-0.5 font-semibold">Sandig/Kiesig oder Grundwasser &lt; 1,5m</span>
                  </button>
                </div>
              </div>

              {/* Einbauweise */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold">4. Einbausituation / Bauweise</label>
                <div className="grid grid-cols-2 gap-2">
                  <button aria-pressed={ebvEinbauweise === 'versiegelt'}
                    type="button"
                    onClick={() => setEbvEinbauweise('versiegelt')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all flex flex-col justify-start leading-tight ${
                            ebvEinbauweise === 'versiegelt'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                  >
                    <span className="font-bold">Bautechnische Sicherung</span>
                    <span className="text-xs opacity-90 mt-0.5 font-semibold">Unter dichten Decken (Asphalt/Beton/Pflaster)</span>
                  </button>
                  <button aria-pressed={ebvEinbauweise === 'offen'}
                    type="button"
                    onClick={() => setEbvEinbauweise('offen')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all flex flex-col justify-start leading-tight ${
                            ebvEinbauweise === 'offen'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                  >
                    <span className="font-bold">Offene Bauweise</span>
                    <span className="text-xs opacity-90 mt-0.5 font-semibold font-semibold">Wegebau, Lärmschutzwälle (wasserleitend)</span>
                  </button>
                </div>
              </div>

              {/* Menge/Einbauvolumen */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold">5. Einbauvolumen (Meldepflicht nach § 22)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button aria-pressed={ebvVolumen === 'unter_250'}
                    type="button"
                    onClick={() => setEbvVolumen('unter_250')}
                    className={`py-2 px-3 text-center rounded-lg text-xs font-semibold border transition-all ${
                            ebvVolumen === 'unter_250'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                  >
                    Kleinsteinbau (&lt; 250 m³)
                  </button>
                  <button aria-pressed={ebvVolumen === 'ab_250'}
                    type="button"
                    onClick={() => setEbvVolumen('ab_250')}
                    className={`py-2 px-3 text-center rounded-lg text-xs font-semibold border transition-all ${
                            ebvVolumen === 'ab_250'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                  >
                    Großbaustelle (≥ 250 m³)
                  </button>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-5 flex flex-col">
              {(() => {
                const verdict = evaluateEBV();
                return (
                  <div className={`p-5 rounded-2xl border flex-1 flex flex-col justify-between transition-all duration-350 shadow-xs ${
                          verdict.status === 'allowed'
                            ? 'bg-slate-50 text-slate-900 border-home-grau/30'
                            : verdict.status === 'restricted'
                            ? 'bg-slate-50 text-slate-900 border-home-grau/30'
                            : 'bg-shiraz/5 text-slate-950 border-shiraz/20'
                        }`}>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 font-black uppercase text-xs tracking-widest">
                          {verdict.status === 'allowed' ? (
                            <Check className="w-5 h-5 text-emerald-600 font-bold" />
                          ) : verdict.status === 'restricted' ? (
                            <AlertCircle className="w-5 h-5 text-amber-600 font-bold" />
                          ) : (
                            <X className="w-5 h-5 text-shiraz font-bold" />
                          )}
                          Rechtliches Urteil
                        </div>
                        <div className="text-xl font-extrabold mt-1">
                          {verdict.message}
                        </div>
                      </div>

                      <div className="border-t border-dashed border-home-grau/30 pt-3">
                        <span className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Einbaubedingungen & Restriktionen:</span>
                        <ul className="space-y-1.5 text-xs font-semibold leading-relaxed">
                          {verdict.conditions.map((cond, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-teal-600 mt-0.5">•</span>
                              <span>{cond}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="border-t border-home-grau/30 pt-3 mt-4 text-xs font-bold leading-normal">
                      <span className="block text-xs uppercase font-black text-slate-700 mb-1">Meldungspflicht (§ 22 EBV):</span>
                      {verdict.anzeige}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Anzeigepflicht & Kataster */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
              <FileSignature className="w-5 h-5 text-slate-600" />
              Katasterregelung & Anzeigepflicht (§ 22 Gesetz)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Um die langfristige Umweltverträglichkeit zu gewährleisten, führt der Gesetzgeber mit der EBV erstmalig das verbindliche <strong>Ersatzbaustoffkataster</strong> für technische Einbauten über der Geringfügigkeitsschwelle ein:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li>
                <strong>Die 250 m³ Bagatellgrenze:</strong> Wenn der Gesamteinbau aller mineralischen Ersatzbaustoffe (MEB) an einer Baustelle <strong>250 Kubikmeter</strong> erreicht oder überschreitet, unterliegt das Bauwerk der Meldepflicht beim zuständigen Landesamt/LRA.
              </li>
              <li>
                <strong>Fristen & Ablauf:</strong>
                <br />
                • <strong className="text-slate-800">Voranzeige:</strong> Spätestens <strong>4 Wochen</strong> vor Baubeginn (inkl. Probenbericht, Deckblatt-Daten, geplante Tonnasche).
                <br />
                • <strong className="text-slate-800">Abschlussanzeige:</strong> Binnen <strong>2 Wochen</strong> nach Abschluss des Einbaus mit der tatsächlich verbauten Endkubatur.
              </li>
              <li>
                <strong>Archivierungspflichten:</strong> Die zuständigen Unteren Umweltschutzbehörden führen das Kataster elektronisch und archivieren die Daten für einen Zeitraum von <strong>120 Jahren</strong>! Grundeigentümer müssen ihre Lieferscheine und Dokumentationen über die Betriebsdauer des Bauwerks (mind. <strong>30 bis 40 Jahre</strong>) sorgfältig aufbewahren und beim Verkauf an Nachfolder übertragen.
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
              <FileSignature className="w-5 h-5 text-slate-600" />
              Lieferscheine & Deckblatt-Pflicht
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Für jedes antransportierte MEB-Material muss dem Fuhrunternehmer ein rechtsverbindlicher Lieferschein sowie ein standardisiertes <strong>Deckblatt</strong> mitgegeben werden. Die lückenlose Transportverfolgung ist zentraler Bestandteil der Bundesverordnung:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li>
                <strong>Präzise Koordinaten:</strong> Das Deckblatt muss die genaue geografische Lage (GPS-Daten, Flurstücksnummer), die Einbautiefe und das genaue Anwendungsgebiet des technischen Bauwerks enthalten.
              </li>
              <li>
                <strong>Unterschriftspflicht:</strong> Bauherr und Lieferant müssen einander die Eignung des Stoffes für die gegebene hydrogeologische Einbaumatrix schriftlich zusichern.
              </li>
              <li>
                <strong>Übergabe an den Eigentümer:</strong> Sämtliche Deckblätter und Lieferscheine sind nach Bauende dem Grundstückseigentümer als grundbuchrelevante Dokumente zu übergeben. Sie sind die Absicherung gegen spätere Altlasten-Ansprüche der Behörden.
              </li>
            </ul>
          </div>
        </div>

        {/* QUBA / Güteüberwachung */}
        <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl flex flex-col md:flex-row gap-4 items-start">
          <div className="bg-shiraz text-white p-3 rounded-lg">
            <Recycle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Güteüberwachung, QUBA-Siegel & Produktstatus (Ende der Abfalleigenschaft)</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Ersatzbaustoffe müssen einer werkseigene Produktionskontrolle (WPK) sowie regelmäßigen staatlich beaufsichtigten Fremdüberwachungen unterzogen werden. Zertifizierte Hersteller von Ersatzbaustoffen sind berechtigt, das <strong>QUBA-Zertifikat</strong> (Qualitätssicherung Sekundärbaustoffe) zu führen. 
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mt-1 font-semibold">
              Mit Erreichung des QUBA-Gütezeichens weist das Material eine derartig hohe stoffliche Reinheit auf, dass bestimmte Klassen (z.B. hochwertiges RC-1 Material) direkt das <strong>Ende der Abfalleigenschaft (§ 5 KrWG)</strong> erreichen und rechtlich wieder als <strong>reguläres Produkt (Produktstatus)</strong> eingestuft werden. Dies erleichtert Transportvereinbarungen, gewerbliche Ausschreibungen und mindert Haftungsrisiken drastisch.
            </p>
            <div className="mt-3 bg-white p-3 rounded-lg border border-home-grau/20 text-xs text-slate-600 space-y-1.5">
              <span className="font-bold text-slate-800">Die 4 kumulativen Voraussetzungen für das Abfallende gem. § 5 Abs. 1 KrWG:</span>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li>
                  <strong>Zweckbestimmung:</strong> Der Stoff oder Gegenstand wird für bestimmte Zwecke verwendet (z. B. technisches Bauwerk).
                </li>
                <li>
                  <strong>Marktfähigkeit:</strong> Es besteht ein Markt oder eine Nachfrage nach ihm (Käuferinteresse an RC-Materialien).
                </li>
                <li>
                  <strong>Technisches Recht &amp; Produktkonformität:</strong> Er erfüllt sämtliche geltenden technischen Anforderungen, Normen (z. B. DIN EN-Standards für Tragschichten) und Rechtsvorschriften.
                </li>
                <li>
                  <strong>Schadlosigkeit:</strong> Seine Verwendung führt insgesamt nicht zu schädlichen Auswirkungen auf Mensch oder Umwelt (Schwellenwerte der EBV und BBodSchV werden eingehalten).
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
}
