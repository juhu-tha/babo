// Ausgelagert aus src/modules/Baustoffkenngroessen.tsx (AP 5.2)
import { formatDeZahl } from '@/src/utils/numberFormat';
import React from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { BlockMath, InlineMath } from 'react-katex';

export interface HygrischTabProps {
  masseFeucht: number;
  masseTrocken: number;
  sdDicke: number;
  sdMuWert: number;
  setMasseFeucht: React.Dispatch<React.SetStateAction<number>>;
  setMasseTrocken: React.Dispatch<React.SetStateAction<number>>;
  setSdDicke: React.Dispatch<React.SetStateAction<number>>;
  setSdMuWert: React.Dispatch<React.SetStateAction<number>>;
  setWSaugzeit: React.Dispatch<React.SetStateAction<number>>;
  setWWasseraufnahme: React.Dispatch<React.SetStateAction<number>>;
  wassergehalt: number;
  wSaugzeit: number;
  wWasseraufnahme: number;
}

export default function HygrischTab({ masseFeucht, masseTrocken, sdDicke, sdMuWert, setMasseFeucht, setMasseTrocken, setSdDicke, setSdMuWert, setWSaugzeit, setWWasseraufnahme, wassergehalt, wSaugzeit, wWasseraufnahme }: HygrischTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-fade-in">
      {/* Card 1: Feuchtegehalt */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="p-1 bg-rose-50 text-shiraz rounded-md text-xs">u</span> Feuchtegehalt
          </h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p>
        Der Feuchtegehalt beschreibt die Menge an Wasser in einem Baustoff. Er wird meist massenbezogen (Verhältnis der Wassermasse zur Trockenmasse) oder volumenbezogen angegeben.
          </p>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
            <BlockMath math="u_m = \frac{m_w - m_d}{m_d} \cdot 100" />
            <p className="text-[10px] text-slate-500 mt-2 font-mono">
              u_m = Massenbezogener Feuchtegehalt [%] | m_w = Feuchtmasse [g] | m_d = Trockenmasse [g]
            </p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
            <span className="font-bold text-indigo-950 block mb-0.5">🔢 Einfache Beispielrechnung:</span>
            Eine feuchte Steinprobe wiegt <InlineMath math="m_w = 1050 \text{ g}" />, nach Ofentrocknung wiegt sie <InlineMath math="m_d = 1000 \text{ g}" />.
            <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]">
              u_m = ((1050 g - 1000 g) / 1000 g) · 100 = (50 / 1000) · 100 = 5,00 %
            </div>
          </div>

          <div className="space-y-4">
            <Slider label="Feuchtmasse (m_w)" min={100} max={2500} step={10} value={masseFeucht} unit="g" onChange={(e) => setMasseFeucht(Number(e.target.value))} />
            <Slider label="Trockenmasse (m_d)" min={100} max={2000} step={10} value={masseTrocken} unit="g" onChange={(e) => setMasseTrocken(Number(e.target.value))} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="p-3 bg-shiraz/10 rounded-lg text-shiraz font-bold text-center text-sm">
            Massenbezogener Feuchtegehalt: {formatDeZahl(Math.max(0, wassergehalt), 2)} M.-%
          </div>
          
          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-2 text-slate-600">
            <p><strong>Norm-Prüfverfahren:</strong> Gravimetrische Bestimmung (Darrmethode) nach <strong>DIN EN ISO 12570</strong>. Trocknung bis zur Massenkonstanz, in der Regel bei 105 °C; temperaturempfindliche Stoffe (z. B. Gips, Dämmstoffe) bei 40 bzw. 70 °C.</p>
            <p><strong>Praxisanwendung:</strong> Qualitätskontrolle beim Einbau, Bauwerksdiagnostik bei Wasserschäden, Restfeuchtebeurteilung vor Estrichbelegung (CM-Messung).</p>
          </div>
        </div>
      </div>

      {/* Card 2: sd-Wert & mu-Wert */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="p-1 bg-sky-50 text-sky-600 rounded-md text-xs">s_d</span> Diffusionsäquivalente Luftschichtdicke
          </h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p>
        Der <InlineMath math="s_d" />-Wert gibt an, wie dick eine ruhende Luftschicht sein müsste, um denselben Wasserdampf-Diffusionswiderstand wie die Baustoffschicht aufzuweisen.
          </p>
          
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
            <BlockMath math="s_d = \mu \cdot d" />
            <p className="text-[10px] text-slate-500 mt-2 font-mono">
              s_d = diffusionsäquivalente Luftschichtdicke [m] | \mu = Diffusionswiderstandszahl [-] | d = Bauteildicke [m]
            </p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left mb-4">
            <span className="font-bold text-indigo-950 block mb-0.5">🔢 Einfache Beispielrechnung:</span>
            Ein Bauteil aus Beton (<InlineMath math="\mu = 130" />) hat eine Dicke von <InlineMath math="d = 20 \text{ cm} = 0{,}20 \text{ m}" />.
            <span className="block mt-1 text-[11px] text-slate-500">Hinweis: Für Normalbeton gibt DIN EN ISO 10456 bzw. DIN 4108-4 das Wertepaar <InlineMath math="\mu = 80/130" /> (feucht/trocken) an; im Nachweis ist jeweils der ungünstigere Wert anzusetzen (z. B. im Feuchteschutz-Modul 80).</span>
            <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]">
              s_d = 130 · 0,20 m = 26,0 m (äquivalenter Luftwiderstand)
            </div>
          </div>

          <div className="space-y-4">
            <Slider label="Bauteildicke (d)" min={0.001} max={1.0} step={0.001} value={sdDicke} unit="m" onChange={(e) => setSdDicke(Number(e.target.value))} />
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <label>Diffusionswiderstandszahl (μ)</label>
                <span className="text-indigo-600">{sdMuWert.toLocaleString('de-DE')} [-]</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="120000" 
                step="100" 
                value={sdMuWert} 
                onChange={(e) => setSdMuWert(Number(e.target.value))}
                className="w-full accent-shiraz"
              />
              <div className="flex gap-1.5 flex-wrap mt-1">
                <button onClick={() => { setSdMuWert(1); setSdDicke(0.14); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Mineralwolle (μ=1)</button>
                <button onClick={() => { setSdMuWert(10); setSdDicke(0.0125); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Gips (μ=10)</button>
                <button onClick={() => { setSdMuWert(130); setSdDicke(0.20); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">Beton (μ=130)</button>
                <button onClick={() => { setSdMuWert(100000); setSdDicke(0.0002); }} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700">PE-Folie (μ=10⁵)</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {(() => {
            const sdCalculated = sdMuWert * sdDicke;
            let classification = "diffusionsoffen";
            let colorClass = "bg-emerald-50 border-emerald-200 text-emerald-800";
            if (sdCalculated > 0.5 && sdCalculated < 1500) {
              classification = "diffusionshemmend";
              colorClass = "bg-amber-50 border-amber-200 text-amber-800";
            } else if (sdCalculated >= 1500) {
              classification = "diffusionsdicht (Dampfsperre)";
              colorClass = "bg-rose-50 border-rose-200 text-rose-800";
            }
            return (
              <div className={`p-3 rounded-xl border text-center font-bold text-xs space-y-1 ${colorClass}`}>
                <div>Errechneter s_d-Wert: {formatDeZahl(sdCalculated, 3)} m</div>
                <div className="uppercase text-[10px] tracking-wider">Klassifizierung nach DIN 4108-3: {classification}</div>
              </div>
            );
          })()}

          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-2 text-slate-600">
            <p><strong>Prüfverfahren:</strong> Nach <strong>DIN EN ISO 12572</strong> (Klimakammertest im Wet-Cup/Dry-Cup-Verfahren). Wasserdampfdurchgangsrate wird gravimetrisch über die Zeit erfasst.</p>
            <p><strong>Praxisrelevanz:</strong> Planung des Feuchteschutzes nach dem Glaser-Verfahren (DIN 4108-3), um schädliches Kondensat in Dach- oder Wandkonstruktionen zu minimieren.</p>
          </div>
        </div>
      </div>

      {/* Card 3: Wasseraufnahmekoeffizient (w-Wert / B-Wert) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between lg:col-span-2">
        <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <span className="p-1 bg-teal-50 text-teal-600 rounded-md text-xs">w</span> Wasseraufnahmekoeffizient &amp; Kapillarität (w-Wert / B-Wert)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
              Der Wasseraufnahmekoeffizient (<InlineMath math="w" />-Wert, früher auch als <span className="font-bold font-mono">B-Wert</span> bezeichnet) beschreibt das kapillare Saugverhalten eines Baustoffs bei direktem Flüssigwasserkontakt.
            </p>
            
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center mb-2">
              <BlockMath math="w = \frac{W_w}{\sqrt{t}}" />
              <p className="text-[10px] text-slate-500 mt-2 font-mono">
                w = Wasseraufnahmekoeffizient [kg/(m² · h^0.5)] | W_w = Wasseraufnahme [kg/m²] | t = Saugzeit [h]
              </p>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/40 text-xs text-slate-700 leading-relaxed text-left">
              <span className="font-bold text-indigo-950 block mb-0.5">🔢 Einfache Beispielrechnung:</span>
              Ein Backstein hat nach der Saugzeit <InlineMath math="t = 4 \text{ Stunden}" /> ein Flächenwassergewicht von <InlineMath math="W_w = 1{,}4 \text{ kg/m}^2" /> aufgenommen.
              <div className="font-mono mt-1 text-slate-900 bg-white/80 p-1 rounded border border-indigo-100/30 text-[11px]">
                w = 1,4 kg/m² / &radic;(4 h) = 1,4 / 2 = 0,70 kg/(m² · h^0,5)
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Slider label="Wasseraufnahme je m² Fläche (W_w)" min={0.01} max={15.0} step={0.05} value={wWasseraufnahme} unit="kg/m²" onChange={(e) => setWWasseraufnahme(Number(e.target.value))} />
              <Slider label="Saugdauer / Einwirkzeit (t)" min={1} max={120} step={1} value={wSaugzeit} unit="Stunden" onChange={(e) => setWSaugzeit(Number(e.target.value))} />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4">
            {(() => {
              const wCurrentValue = wWasseraufnahme / Math.sqrt(wSaugzeit);
              let rating = "Kapillar saugend";
              let ratingDetail = "Erhöhte kapillare Wasseraufnahme. Typisch für rohes Mauerwerk (z.B. Kalksandstein) oder ungeschützte Putze. Benötigt oft hydrophobe Oberflächenbehandlung im Außenbereich.";
              let styleClass = "bg-rose-50 border-rose-200 text-rose-800";
              
              if (wCurrentValue <= 0.5) {
                rating = "Wasserabweisend (w ≤ 0,5; zusätzlich s_d ≤ 2,0 m und w · s_d ≤ 0,2 nach DIN 4108-3)";
                ratingDetail = "Hervorragender Schlagregenschutz. Wasser perlt gut ab, kapillares Saugen ist stark unterbunden (Verwendung für Außenputze, Klinker oder hydrophobiertes Mauerwerk).";
                styleClass = "bg-emerald-50 border-emerald-200 text-emerald-800";
              } else if (wCurrentValue <= 2.0) {
                rating = "Wasserhemmend (0,5 < w ≤ 2,0)";
                ratingDetail = "Eingeschränkte kapillare Leitfähigkeit. Ein Kompromiss aus Saugaktivität und Schutz vor Durchnässung. Geeignet in mäßig regenbeanspruchten Schutzbereichen.";
                styleClass = "bg-amber-50 border-amber-200 text-amber-800";
              }

              return (
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border text-center ${styleClass}`}>
                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-85">Berechneter w-Wert / B-Wert:</div>
                    <div className="text-2xl font-black my-1">{formatDeZahl(wCurrentValue, 4)} <span className="text-xs font-normal">kg/(m² · h<sup>0,5</sup>)</span></div>
                    <div className="text-xs font-bold mt-1 uppercase tracking-wider">{rating}</div>
                    <p className="text-[11px] font-normal leading-relaxed mt-1">{ratingDetail}</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-2 text-slate-600">
                    <p className="font-bold text-slate-800">Prüfverfahren und Normenbezug:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>DIN EN ISO 15148:</strong> Kapillare Wasseraufnahme. Die Probenunterseite taucht ca. 5 mm (± 2 mm) in Wasser ein; die Massenzunahme wird über die Wurzel der Zeit aufgetragen.</li>
                      <li><strong>DIN 4108-3:</strong> Festlegung der bauphysikalischen Grenzwerte für schlagregensichere Bauteile. Für wasserabweisende Putze und Beschichtungen gilt <InlineMath math="w \le 0{,}5" />, <InlineMath math="s_d \le 2{,}0\,\text{m}" /> und <InlineMath math="w \cdot s_d \le 0{,}2\,\text{kg/(m}\cdot\text{h}^{0{,}5})" /> – eine Balance aus Regenschutz und Austrocknung (nach der Fassadenschutztheorie von Künzel strenger ≤ 0,1).</li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
