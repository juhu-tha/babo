import { Sparkles, CheckCircle } from 'lucide-react';

export default function AnhangPraxisbeispiele() {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 1</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">
            Durchgerechnete Praxisbeispiele &amp; Variantenstudien
          </h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Das theoretische Wissen wird durch die nachfolgenden, vollständig gelösten Berechnungsbeispiele veranschaulicht. Diese orientieren sich an realen Projektunterlagen und den QNG/BBSR-Zertifizierungsregeln.
        </p>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">BSP 1</span>
            Außenwandvergleich: Massivbau vs. Holzständerwand
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Aufgabe: Vergleich zweier Standard-Außenwandkonstruktionen für die funktionelle Einheit: <strong>1 m² Außenwand, U ≈ 0,20 W/(m²·K) über 50 Jahre</strong>, Phasen A1–A3 (Herstellungsphase).
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Variante 1 */}
            <div className="border border-stone-200 rounded-xl overflow-hidden shadow-3xs bg-white">
              <div className="bg-off-white border-b border-home-grau/20 p-3">
                <h5 className="text-xs font-bold font-mono text-text-main">Variante 1: Kalksandstein + WDVS (EPS)</h5>
                <p className="text-[10px] text-text-main/70">Schwerer Massivbau mit hervorragender Schallisolierung.</p>
              </div>
              <div className="p-3 overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse min-w-[320px]">
                  <thead>
                    <tr className="border-b border-stone-250 font-bold text-slate-700">
                      <th className="pb-1">Schicht</th>
                      <th className="pb-1 text-center">d [m]</th>
                      <th className="pb-1 text-right">Masse [kg/m²]</th>
                      <th className="pb-1 text-right">GWP-Fkt. [fossil]</th>
                      <th className="pb-1 text-right">GWP [kg CO₂]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium">Innenputz (Gips)</td>
                      <td className="py-1.5 text-center font-mono">0,010</td>
                      <td className="py-1.5 text-right font-mono">10,0</td>
                      <td className="py-1.5 text-right font-mono">0,12</td>
                      <td className="py-1.5 text-right font-mono font-medium text-red-700">1,2</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium">KS-Mauerwerk</td>
                      <td className="py-1.5 text-center font-mono">0,175</td>
                      <td className="py-1.5 text-right font-mono">315,0</td>
                      <td className="py-1.5 text-right font-mono">0,12</td>
                      <td className="py-1.5 text-right font-mono font-medium text-red-700">37,8</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium">EPS-Dämmung 032</td>
                      <td className="py-1.5 text-center font-mono">0,160</td>
                      <td className="py-1.5 text-right font-mono">2,9</td>
                      <td className="py-1.5 text-right font-mono">3,50</td>
                      <td className="py-1.5 text-right font-mono font-medium text-red-700">10,1</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium">Außenputz mineral.</td>
                      <td className="py-1.5 text-center font-mono">0,008</td>
                      <td className="py-1.5 text-right font-mono">12,8</td>
                      <td className="py-1.5 text-right font-mono">0,20</td>
                      <td className="py-1.5 text-right font-mono font-medium text-red-700">2,6</td>
                    </tr>
                    <tr className="font-bold bg-slate-50 text-slate-900 text-xs">
                      <td className="py-2 pl-1">Summe A1–A3</td>
                      <td className="py-2 text-center">-</td>
                      <td className="py-2 text-right font-mono">≈ 341 kg/m²</td>
                      <td className="py-2 text-right">-</td>
                      <td className="py-2 text-right font-mono text-red-800">51,7 kg/m²</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Variante 2 */}
            <div className="border border-stone-200 rounded-xl overflow-hidden shadow-3xs bg-white">
              <div className="bg-off-white border-b border-home-grau/20 p-3">
                <h5 className="text-xs font-bold font-mono text-text-main">Variante 2: Holzständerwand, zellulosegedämmt</h5>
                <p className="text-[10px] text-text-main/70">Biobasierte Leichtbauwand mit biogener Kohlenstoffspeicherung.</p>
              </div>
              <div className="p-3 overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse min-w-[320px]">
                  <thead>
                    <tr className="border-b border-stone-250 font-bold text-slate-700">
                      <th className="pb-1">Schicht</th>
                      <th className="pb-1 text-right">Masse [kg/m²]</th>
                      <th className="pb-1 text-right">GWP-fossil</th>
                      <th className="pb-1 text-right">GWP-biogen</th>
                      <th className="pb-1 text-right">GWP-total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium">GK-Platte 12,5 mm</td>
                      <td className="py-1.5 text-right font-mono">10,0</td>
                      <td className="py-1.5 text-right font-mono text-red-600">2,0</td>
                      <td className="py-1.5 text-right font-mono text-teal-600">≈ 0</td>
                      <td className="py-1.5 text-right font-mono">+2,0</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium">Konstruktionsholz (ant.)</td>
                      <td className="py-1.5 text-right font-mono">12,0</td>
                      <td className="py-1.5 text-right font-mono text-red-600">1,5</td>
                      <td className="py-1.5 text-right font-mono text-teal-600">-19,8</td>
                      <td className="py-1.5 text-right font-mono text-teal-800">-18,3</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium">Zellulose-Einblasdämm.</td>
                      <td className="py-1.5 text-right font-mono">11,0</td>
                      <td className="py-1.5 text-right font-mono text-red-600">0,8</td>
                      <td className="py-1.5 text-right font-mono text-teal-600">-13,2</td>
                      <td className="py-1.5 text-right font-mono text-teal-800">-12,4</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium">Holzfaserplatte 16 mm</td>
                      <td className="py-1.5 text-right font-mono">9,0</td>
                      <td className="py-1.5 text-right font-mono text-red-600">1,6</td>
                      <td className="py-1.5 text-right font-mono text-teal-600">-14,9</td>
                      <td className="py-1.5 text-right font-mono text-teal-800">-13,3</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 font-medium">Außenputz mineral.</td>
                      <td className="py-1.5 text-right font-mono">12,8</td>
                      <td className="py-1.5 text-right font-mono text-red-600">2,6</td>
                      <td className="py-1.5 text-right font-mono text-teal-600">≈ 0</td>
                      <td className="py-1.5 text-right font-mono">+2,6</td>
                    </tr>
                    <tr className="font-bold bg-emerald-50 text-emerald-950 text-xs">
                      <td className="py-2 pl-1">Summe A1–A3</td>
                      <td className="py-2 text-right font-mono">≈ 55 kg/m²</td>
                      <td className="py-2 text-right font-mono text-red-700">8,5 kg/m²</td>
                      <td className="py-2 text-right font-mono text-teal-700">-47,9 kg/m²</td>
                      <td className="py-2 text-right font-mono text-emerald-800">-39,4 kg/m²</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/30 p-4 border border-emerald-100 rounded-xl flex items-start gap-3 mt-2">
            <Sparkles className="text-emerald-700 shrink-0 mt-0.5" size={16} />
            <div className="text-[11px] text-emerald-950 leading-relaxed">
              <strong className="block font-bold mb-1">Interpretation (Wichtiger als nackte Zahlen!):</strong>
              <ol className="list-decimal pl-4 space-y-1">
                <li><strong>A1-A3 Bilanz:</strong> Variante 2 erscheint mit ≈ -39 kg CO₂-Äq./m² (GWP-total) drastisch besser als Variante 1 (51,7 kg CO₂-Äq./m²).</li>
                <li><strong>Aber (Cradle-to-Grave):</strong> Der biogene Kohlenstoff (-47,9 kg CO₂-Äq./m²) wird am Lebensende (Modul C3, thermische Verwertung) als CO₂ wieder freigesetzt. Die Treibhausgase schmälern den Vorsprung im Gesamten, wenngleich Variante 2 ökologisch überlegen bleibt.</li>
                <li><strong>Masseunterschied:</strong> 55 kg vs. 341 kg/m² entlastet Fundamente und Transportaufwände (A4/C1).</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded font-bold text-[10px]">BSP 2</span>
            Vereinfachte Gebäudeökobilanz (QNG-Nachweis)
          </h4>
          <p className="text-[11px] text-slate-650 leading-relaxed">
            <strong>Objekt:</strong> fiktives Mehrfamilienhaus „MFH Augsburg-Nord" &bull; 4 Geschosse, Massivbau, <strong>Netto-Raumfläche NRF = 1.200 m²</strong>, EH-40-Standard, Wärmepumpe, Betrachtungszeitraum 50 Jahre.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-2">
            <div className="bg-slate-50 border border-stone-200 p-3.5 rounded-xl">
              <strong className="text-xs text-slate-900 block font-bold mb-1">Schritt A: Konstruktion (A1-A3 + C3/C4)</strong>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Mengenermittlung ergibt als Summe über alle Bauteile (KG 300 + 400 Pauschale):
              </p>
              <div className="mt-2 text-[11px] font-mono space-y-1 border-t border-slate-200 pt-1.5">
                <div>KG 300 Bauteile: 540 t CO₂-Äq.</div>
                <div>KG 400 Anlagentechnik: 70 t CO₂-Äq.</div>
                <div>C3/C4 Entsorgung: 95 t CO₂-Äq.</div>
                <div className="font-bold border-t border-slate-200 pt-1 mt-1 text-slate-900">
                  Summe: 705 t CO₂ = 11,75 kg CO₂/(m²·a)
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-stone-200 p-3.5 rounded-xl">
              <strong className="text-xs text-slate-900 block font-bold mb-1">Schritt B: Ersatz (B4)</strong>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Bauteile mit einer Nutzungsdauer &lt; 50 a (Fenster, Putze, Bodenbeläge etc.) müssen im Betrachtungszeitraum saniert oder getauscht werden:
              </p>
              <div className="mt-4 text-[11px] font-mono text-slate-900 font-bold border-t border-slate-200 pt-1.5">
                Ersatzaufwand (50 Jahre): 180 t CO₂-Äq.
                <div className="font-mono text-slate-500 font-normal pt-1">
                  → 180.000 / (1200 m² * 50 a) =
                </div>
                <div className="text-shiraz">3,00 kg CO₂-eq/(m²·a)</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-stone-200 p-3.5 rounded-xl">
              <strong className="text-xs text-slate-900 block font-bold mb-1">Schritt C: Betrieb (B6)</strong>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Endenergie Strom (Heizung, Warmwasser, Hilfsstrom) aus GEG-Berechnung: 18 kWh/(m²NRF·a). Emissionsfaktor Strommix (50 a gewichtet sinkend): 0,43 kg CO₂-Äq./kWh.
              </p>
              <div className="mt-2 text-[11px] font-mono text-slate-900 font-bold border-t border-slate-200 pt-1.5">
                Stromverbrauch (B6):
                <div className="font-mono text-slate-500 font-normal pt-1">
                  → 18 kWh/m²a * 0,43 kg/kWh =
                </div>
                <div className="text-shiraz">7,74 kg CO₂-eq/(m²·a)</div>
              </div>
            </div>
          </div>

          <div className="border border-stone-200 rounded-xl overflow-hidden mt-3 max-w-2xl mx-auto shadow-2xs">
            <div className="bg-slate-100 p-2.5 border-b border-stone-200 text-xs font-bold text-slate-800">
              Schritt D: Gesamtergebnis &amp; QNG-Zertifikatsbewertung
            </div>
            <div className="p-3 bg-white space-y-3">
              <div className="grid grid-cols-3 text-xs border-b border-stone-100 pb-1.5 text-slate-500 font-bold">
                <div>Lebenszyklus-Anteil</div>
                <div className="text-center font-bold">kg CO₂-Äq./(m²NRF·a)</div>
                <div className="text-right font-bold font-mono">Prozentualer Anteil</div>
              </div>
              <div className="grid grid-cols-3 text-xs py-0.5 text-slate-800">
                <div>Herstellung + Entsorgung (A1-A3, C3-C4)</div>
                <div className="text-center font-mono font-medium">11,75</div>
                <div className="text-right font-mono text-slate-500">52 %</div>
              </div>
              <div className="grid grid-cols-3 text-xs py-0.5 text-slate-800">
                <div>Ersatzzyklus (B4)</div>
                <div className="text-center font-mono font-medium">3,00</div>
                <div className="text-right font-mono text-slate-500">13 %</div>
              </div>
              <div className="grid grid-cols-3 text-xs py-0.5 text-slate-800">
                <div>Anlagen-Betrieb (B6)</div>
                <div className="text-center font-mono font-medium">7,75</div>
                <div className="text-right font-mono text-slate-500 font-semibold">34 %</div>
              </div>
              <div className="grid grid-cols-3 text-xs font-bold pt-2 border-t border-stone-250 text-slate-900 bg-slate-50 -mx-3 -mb-3 p-3">
                <div>Lehr-Gesamtergebnis</div>
                <div className="text-center font-mono text-shiraz">22,50 kg/m²a</div>
                <div className="text-right">100 %</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50/50 border border-indigo-150 rounded-xl flex items-start gap-3">
            <CheckCircle className="text-indigo-700 shrink-0 mt-0.5" size={16} />
            <div className="text-[11px] text-indigo-950 leading-relaxed">
              <strong className="block font-bold">QNG-Plus/Premium Bewertung:</strong>
              Der Wert von <strong>22,50 kg CO₂-eq/(m²·a)</strong> liegt unter dem QNG-Plus Grenzwert von <strong>≤ 24 kg</strong>. Das Qualitätssiegel **QNG-Plus** wird somit im GWP-Kriterium erfolgreich bestanden! Um QNG-Premium (≤ 20 kg) zu ergattern, sind weitere Schichtenoptimierungen notwendig (z.B. klinkerreduzierter Zementeinsatz, stärkere Integration von Holzkonstruktionen in Außenwand/Dach).
            </div>
          </div>
        </div>
      </div>
    );
}
