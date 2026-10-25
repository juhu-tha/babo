import type { Dispatch, SetStateAction } from 'react';
import { Scale, Calculator, Info, Settings, CheckCircle2 } from 'lucide-react';
import { formatDeZahl } from '@/src/utils/numberFormat';

export interface BegriffeTabProps {
  setSelectedTool: Dispatch<SetStateAction<"meterstab" | "messschieber" | "laser" | "risslupe" | "nivellier">>;
  setToolInputValue: Dispatch<SetStateAction<number>>;
  selectedTool: "meterstab" | "messschieber" | "laser" | "risslupe" | "nivellier";
  toolInputValue: number;
}

export function BegriffeTab({ setSelectedTool, setToolInputValue, selectedTool, toolInputValue }: BegriffeTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
      <Settings className="text-shiraz" size={20} /> Kalibrieren, Justieren, Eichen vergleichen
    </h2>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p>
        Im alltäglichen Laborbetrieb werden diese drei Begriffe fälschlicherweise oft synonym verwendet. 
          Sie bezeichnen jedoch grundlegend verschiedene physikalische und rechtliche Handlungen an einer Prüfeinrichtung (z. B. Betonpresse oder Rückprallhammer).
      </p>
    </div>
    
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* Kalibrieren */}
          <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 hover:bg-white transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">Kalibrieren</span>
                <span className="text-[10px] text-slate-400 font-mono">Kein Eingriff</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans">Zusammenhang ermitteln</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans">
                Ermitteln der Messabweichung zwischen dem angezeigten Wert des Prüfgeräts und dem bekannten Wert eines höherwertigen, rückgeführten Normals (Bezugswert). 
                Der gemessene Wert wird in einem <strong>Kalibrierschein</strong> protokolliert.
              </p>
              <blockquote className="border-l-2 border-shiraz/40 pl-2.5 text-[11px] text-slate-600 italic mt-3 font-sans">
                Beispiel: Kalibrierung des Kraftmesssystems einer Betonprüfmaschine mit rückgeführten Referenz-Kraftaufnehmern nach DIN EN ISO 7500-1 (für Betonprüfmaschinen nach DIN EN 12390-4 mindestens Klasse 1).
              </blockquote>
            </div>
            <div className="mt-4 pt-3.5 border-t border-home-grau/30 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <CheckCircle2 size={12} className="text-emerald-500" /> Dokumentiert systematische Abweichung.
            </div>
          </div>
    
          {/* Justieren */}
          <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 hover:bg-white transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">Justieren</span>
                <span className="text-[10px] text-slate-400 font-mono">Geräte-Eingriff</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans">Sollwertharmonisierung</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans">
                Einstellen oder Abgleichen eines Messgeräts, um die systematische Abweichung so gering wie möglich zu halten. Typischerweise wird das Gerät 
                hierbei bleibend verändert. Dieser Vorgang ist nach einer unzulässigen Kalibrierungsabweichung notwendig.
              </p>
              <blockquote className="border-l-2 border-shiraz/40 pl-2.5 text-[11px] text-slate-600 italic mt-3 font-sans">
                Beispiel: Programmieren und Justieren des Nullpunkts oder Steigungsfaktors im elektronischen Verstärker der Prüfmaschine zur Reduktion systematischer Anzeigefehler.
              </blockquote>
            </div>
            <div className="mt-4 pt-3.5 border-t border-home-grau/30 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <CheckCircle2 size={12} className="text-blue-500" /> Verändert das Geräteverhalten dauerhaft.
            </div>
          </div>
    
          {/* Eichen */}
          <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50 hover:bg-white transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">Eichen</span>
                <span className="text-[10px] text-slate-400 font-mono">Gesetzliche Pflicht</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2.5 font-sans">Amtliche Prüfung</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans">
                Gesetzlich vorgeschriebene Prüfung und Kennzeichnung eines verwendeten Messgeräts durch die Eichbehörde des Landes (oder eine staatlich anerkannte Prüfstelle) nach Mess- und Eichgesetz. 
                Pflicht gilt u. a. im geschäftlichen Verkehr (Abrechnung nach Messwert) sowie im amtlichen, Medizin- und Umweltbereich.
              </p>
              <blockquote className="border-l-2 border-shiraz/40 pl-2.5 text-[11px] text-slate-600 italic mt-3 font-sans">
                Beispiel: Eichung der Fahrzeugwaage eines Kies- oder Transportbetonwerks, über die Lieferungen nach Gewicht abgerechnet werden. Die Dosierwaagen der Mischanlage werden dagegen im Rahmen der Produktionskontrolle nach DIN EN 206 kalibriert.
              </blockquote>
            </div>
            <div className="mt-4 pt-3.5 border-t border-home-grau/30 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <CheckCircle2 size={12} className="text-amber-500" /> Eichmarke mit Ablauf der Eichfrist, Sicherungsplomben.
            </div>
          </div>
    
        </div>
      </div>
    
      {/* Table Comparison Overview */}
      <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-900 mb-3 font-sans">Direkter Kriterien-Vergleich</h3>
        <table className="min-w-full text-xs text-left text-slate-700">
          <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 border-b border-home-grau/30">
            <tr>
              <th className="py-2.5 px-3">Eigenschaft / Kriterium</th>
              <th className="py-2.5 px-3">Kalibrieren</th>
              <th className="py-2.5 px-3">Justieren</th>
              <th className="py-2.5 px-3">Eichen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            <tr>
              <td className="py-2.5 px-3 font-semibold text-slate-800">Eingriff am Messgerät?</td>
              <td className="py-2.5 px-3 text-slate-600">Nein (nur Ermittlung und Dokumentation)</td>
              <td className="py-2.5 px-3 text-slate-600 font-semibold text-blue-700">Ja (mechanische/elektronische Justage)</td>
              <td className="py-2.5 px-3 text-slate-600">Eventuell (falls Justage während Eichung nötig)</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-slate-800">Wer darf es durchführen?</td>
              <td className="py-2.5 px-3 text-slate-600">Beliebige geschulte Stelle (DAkkS-Labor empfohlen)</td>
              <td className="py-2.5 px-3 text-slate-600">Prüfgerät-Betreiber, Service-Techniker des Herstellers</td>
              <td className="py-2.5 px-3 text-slate-600 font-semibold text-amber-700">Eichbehörde oder staatlich anerkannte Prüfstelle</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-slate-800">Rechtliche bzw. normative Grundlage</td>
              <td className="py-2.5 px-3 text-slate-600">Vertrag/QM: DIN EN ISO 9001, DIN EN ISO/IEC 17025; Prüfnormen (z. B. DIN EN ISO 7500-1)</td>
              <td className="py-2.5 px-3 text-slate-600">Nutzer-Spezifikation, Hersteller-Wartungshandbuch</td>
              <td className="py-2.5 px-3 text-slate-600 font-semibold text-amber-700">Mess- und Eichgesetz (MessEG) / MessEV</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-slate-800">Resultat / Beleg</td>
              <td className="py-2.5 px-3 text-slate-600">Kalibrierschein (Messwerte &amp; -unsicherheiten)</td>
              <td className="py-2.5 px-3 text-slate-600">Gerät ist &quot;sollwertjustiert&quot; (Justierprotokoll)</td>
              <td className="py-2.5 px-3 text-slate-600">Eichmarke; Neugeräte: Konformitätsbewertung mit CE- und Metrologie-Kennzeichnung (MessEG)</td>
            </tr>
          </tbody>
        </table>
      </div>
    
      {/* Sektion: Genauigkeit von Messverfahren im Bauwesen */}
      <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 font-sans">
          <Scale size={20} className="text-indigo-600" /> Genauigkeit &amp; Toleranzgrenzen gängiger Messverfahren
        </h3>
        <p className="text-slate-600 text-xs leading-relaxed max-w-4xl mb-6 font-sans">
          Jedes Messverfahren unterliegt systematischen und zufälligen Unsicherheiten. Im Baubetrieb und Labor hängen zulässige Toleranzen stark vom eingesetzten Werkzeug und den Normvorgaben ab. Wählen Sie ein Instrument aus, um dessen messtechnische Kenngrößen und die typischen Fehlerquellen auf der Baustelle zu visualisieren.
        </p>
    
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Linkes Menü: Messgeräte */}
          <div className="lg:col-span-4 space-y-2">
            {[
              { id: 'meterstab', label: 'Zollstock / Meterstab', sub: 'EU-Genauigkeitsklasse II (MID)' },
              { id: 'messschieber', label: 'Messschieber (Schieblehre)', sub: 'DIN EN ISO 13385-1' },
              { id: 'laser', label: 'Laser-Entfernungsmesser', sub: 'ISO 16331-1' },
              { id: 'risslupe', label: 'Risslupe & Rissmikroskop', sub: 'Schadensdiagnostik' },
              { id: 'nivellier', label: 'Baunivellier (optisch/digital)', sub: 'DIN ISO 17123-2' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTool(t.id as any);
                  // Default values fitted to the tool range
                  if (t.id === 'meterstab') setToolInputValue(2000);
                  else if (t.id === 'messschieber') setToolInputValue(120);
                  else if (t.id === 'laser') setToolInputValue(15000);
                  else if (t.id === 'risslupe') setToolInputValue(0.3);
                  else if (t.id === 'nivellier') setToolInputValue(50000);
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedTool === t.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                        : 'border-home-grau/30 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
              >
                <div className="font-bold text-xs">{t.label}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.sub}</div>
              </button>
            ))}
          </div>
    
          {/* Detail-Panel auf der rechten Seite */}
          <div className="lg:col-span-8 border border-home-grau/30 rounded-xl p-5 bg-slate-50/40 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-home-grau/30 pb-3 mb-4 font-sans">
                <span className="text-sm font-bold text-slate-900">
                  {selectedTool === 'meterstab' && 'Meterstab (z. B. Holz-Gliedermaßstab) & Rollbandmaß'}
                  {selectedTool === 'messschieber' && 'Taschenmessschieber (Schieblehre)'}
                  {selectedTool === 'laser' && 'Hand-Laserentfernungsmesser (Distanzer)'}
                  {selectedTool === 'risslupe' && 'Präzisions-Risslupe & Taschenmikroskop'}
                  {selectedTool === 'nivellier' && 'Optisch-mechanisches Bau-Nivelliergerät'}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200 py-0.5 px-2 rounded">
                  {selectedTool === 'meterstab' && 'Toleranzklasse II'}
                  {selectedTool === 'messschieber' && 'DIN EN ISO 13385-1'}
                  {selectedTool === 'laser' && 'ISO 16331-1'}
                  {selectedTool === 'risslupe' && 'ZfP-Methodik'}
                  {selectedTool === 'nivellier' && 'DIN ISO 17123-2'}
                </span>
              </div>
    
              <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Auflösung / Ablesbarkeit</span>
                  <strong className="text-slate-800 text-xs mt-0.5 block">
                    {selectedTool === 'meterstab' && '1,0 mm (Skalenteilung)'}
                    {selectedTool === 'messschieber' && '0,05 mm (analog mit Nonius) / 0,01 mm (digital)'}
                    {selectedTool === 'laser' && '1,0 mm (interne Rundung / Digitalanzeige)'}
                    {selectedTool === 'risslupe' && '0,05 mm (Messskala) / 0,02 mm schätzbar'}
                    {selectedTool === 'nivellier' && '0,5 mm bis 1,0 mm (Ablesung an Nivellierlatte)'}
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Fehlergrenze (typisch)</span>
                  <strong className="text-slate-800 text-xs mt-0.5 block font-mono">
                    {selectedTool === 'meterstab' && '±(0,3 + 0,2 · L) mm  [L in m], Klasse II'}
                    {selectedTool === 'messschieber' && '±0,03 mm (bis 100 mm) / ±0,05 mm (bis 200 mm), Herstellerangabe'}
                    {selectedTool === 'laser' && '±(1,0 + 0,05 · L) mm  [L in m], Herstellerangabe'}
                    {selectedTool === 'risslupe' && '±0,05 mm (Ablesegrenze der Skala)'}
                    {selectedTool === 'nivellier' && '1,5 mm Standardabweichung je km Doppelnivellement'}
                  </strong>
                </div>
              </div>
    
              {/* Interaktiver Toleranz-Rechner */}
              <div className="bg-indigo-50/40 border border-indigo-150/60 rounded-lg p-4 mb-4">
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Calculator size={14} className="text-indigo-600" />
                  Interaktiver Toleranz-Schätzer
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {selectedTool === 'meterstab' && 'Ziel-Messlänge (mm):'}
                      {selectedTool === 'messschieber' && 'Zylinderdurchmesser d (mm):'}
                      {selectedTool === 'laser' && 'Raumdiagonale L (mm):'}
                      {selectedTool === 'risslupe' && 'Rissbreite w (mm):'}
                      {selectedTool === 'nivellier' && 'Entfernung zur Nivellierlatte (mm):'}
                    </label>
                    <input
                      type="number" min="0"
                      step={selectedTool === 'risslupe' ? '0.05' : '10'}
                      value={toolInputValue}
                      onChange={(e) => setToolInputValue(Math.max(0.01, parseFloat(e.target.value) || 0))}
                      className="w-full bg-white border border-home-grau/30 rounded px-2.5 py-1 text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="bg-white p-2.5 rounded border border-indigo-100 flex flex-col justify-center">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Fehlergrenze bzw. Standardabweichung</span>
                    <span className="text-xs font-mono font-extrabold text-indigo-700">
                      {selectedTool === 'meterstab' && (
                        <>± {formatDeZahl((0.3 + 0.2 * (toolInputValue / 1000)), 2)} mm</>
                      )}
                      {selectedTool === 'messschieber' && (
                        <>{toolInputValue <= 100 ? '± 0,03' : '± 0,05'} mm</>
                      )}
                      {selectedTool === 'laser' && (
                        <>± {formatDeZahl((1.0 + 0.05 * (toolInputValue / 1000)), 2)} mm</>
                      )}
                      {selectedTool === 'risslupe' && (
                        <>± 0,05 mm</>
                      )}
                      {selectedTool === 'nivellier' && (
                        <>± {formatDeZahl(Math.max(0.5, 1.5 * Math.sqrt((toolInputValue / 1000) / 1000)), 2)} mm</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
    
              <div className="space-y-2 font-sans">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Häufige Fehlerquellen im Baubetrieb:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-[11px] text-slate-600">
                  {selectedTool === 'meterstab' && (
                    <>
                      <li><strong>Parallaxenfehler:</strong> Schiefes Ablesen von oben/unten verändert das Maß optisch.</li>
                      <li><strong>Gelenkverschleiß:</strong> Abgenutzte Federgelenke erzeugen Spiel von bis zu 1–2 mm.</li>
                      <li><strong>Thermisches Verhalten:</strong> Holz dehnt sich bei Feuchte aus, Metall z. B. bei Hitze.</li>
                      <li><strong>Geneigte Messlinie:</strong> Schräglage des Maßstabs verlängert das Messergebnis künstlich.</li>
                    </>
                  )}
                  {selectedTool === 'messschieber' && (
                    <>
                      <li><strong>Verkanteter Messschenkel:</strong> Führt zu Kippen und verfälscht Dicken nach oben.</li>
                      <li><strong>Messdruck:</strong> Überhöhter Handdruck biegt die Digitalschenkel auf (Mikrometerbereich).</li>
                      <li><strong>Schmutzpartikel:</strong> Betonstaub oder Trennmittel blockieren die feste Anlage.</li>
                      <li><strong>Abgenutzte Schneiden:</strong> Rundung der Kontaktflächen durch häufigen Gebrauch.</li>
                    </>
                  )}
                  {selectedTool === 'laser' && (
                    <>
                      <li><strong>Zieloberfläche:</strong> Strukturierter Spritzbeton streut das Signal, was Phasen stört.</li>
                      <li><strong>Lufteinfluss:</strong> Starker Baustaub oder Rauch dämpft oder reflektiert den Laserstrahl.</li>
                      <li><strong>Ausrichtungszittern:</strong> Freihandmessungen bei Entfernungen ab ca. 15 m erhöhen Abweichung.</li>
                      <li><strong>Fremdlicht:</strong> Direkte Sonneneinstrahlung überlagert die Empfangsoptik.</li>
                    </>
                  )}
                  {selectedTool === 'risslupe' && (
                    <>
                      <li><strong>Schattenwurf:</strong> Schlecht ausgeleuchtete Risse verfälschen die visuelle Breite.</li>
                      <li><strong>Schrägaufsicht:</strong> Kippen der Lupe führt zu optischen Verzerrungen (scheinbare Verschmälerung).</li>
                      <li><strong>Subjektiver Fehler:</strong> Schätzen zwischen 0,05-mm-Skalenschritten je nach Prüfer.</li>
                      <li><strong>Verschmutzung:</strong> Ausgebrochene Risskanten (Krater) täuschen über wahren Spalt hinweg.</li>
                    </>
                  )}
                  {selectedTool === 'nivellier' && (
                    <>
                      <li><strong>Dosenlibelle:</strong> Fehljustierung oder schlampige Horizontierung führt zu Neigungsfehlern.</li>
                      <li><strong>Messlatten-Kippung:</strong> Schräg stehende Latten vergrößern den Höhenwert drastisch.</li>
                      <li><strong>Refraktion / Flimmern:</strong> Flirrende Hitze über Asphalt lenkt den Zielstrahl wellig ab.</li>
                      <li><strong>Vibrationen:</strong> Baustellenverkehr (z. B. Walzen) bringt das Kompensatorsystem zum Schwingen.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
    
            <div className="mt-4 pt-3.5 border-t border-home-grau/30 text-[10px] text-slate-500 font-sans leading-relaxed flex items-center gap-1.5">
              <Info size={12} className="text-slate-400 shrink-0" />
              <span>
                <strong>Einsatzgebiet &amp; Relevanz:</strong>{' '}
                {selectedTool === 'meterstab' && 'Standardmäßig verwendet für grobe Raumkontrollen und Maßtoleranzen im Hochbau nach DIN 18202.'}
                {selectedTool === 'messschieber' && 'Unerlässlich im Labor für die Maßkontrolle von Probekörpern (DIN EN 12390-1), Stabdurchmesser und Bohrkern-Durchmesser (DIN EN 12504-1).'}
                {selectedTool === 'laser' && 'Gut geeignet für verformungsgerechte Aufmaße im Bestand, Gebäudeaufmaße und schnelles Einmessen von Prüfgittern.'}
                {selectedTool === 'risslupe' && 'Wichtiges Handwerkszeug bei Bauzustandsanalysen, Abnahme von Spannbetonbauteilen und Beweissicherungen.'}
                {selectedTool === 'nivellier' && 'Bestandteil von Deformationsmessungen, Durchbiegungsversuchen auf Baustellen und Abnahmeprüfungen.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
