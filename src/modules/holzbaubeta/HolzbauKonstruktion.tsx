import { Layers } from 'lucide-react';

export default function HolzbauKonstruktion() {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_konstruktion">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col gap-3">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Bauweise A</span>
            <h3 className="font-extrabold text-text-main text-base">Holzrahmen- &amp; Holztafelbau</h3>
            <p className="text-xs text-text-main/70 leading-relaxed">
              Stabförmiges Tragwerk aus Konstruktionsvollholz (KVH, e = 62,5 cm Raster), das durch aussteifende Holzwerkstoffplatten (OSB, Gipsfaser) die statische Scheiben- und Trageigenschaft erhält. Dazwischen liegt die Kern-Wärmedämmung.
            </p>
            <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-100/60 mt-2">
              <strong>Einsatz:</strong> Einfamilienhäuser, hocheffiziente Passivhauswände, Aufstockungen.
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col gap-3">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Bauweise B</span>
            <h3 className="font-extrabold text-text-main text-base">Massivholzbau (BSP / CLT)</h3>
            <p className="text-xs text-text-main/70 leading-relaxed">
              Flächige, mehrschichtige Tragwerke aus kreuzweise verklebten Brettlagen (Brettsperrholz). Trägt zweiachsig als Platte oder Scheibe (Rollschub in den Querlagen beachten) und hat eine höhere Masse als Rahmenbauteile.
            </p>
            <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-100/60 mt-2">
              <strong>Einsatz:</strong> Mehrgeschossiger Wohnungsbau (Gebäudeklasse 4 &amp; 5), Schachtwände, monolithische Deckenplatten.
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col gap-3">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Bauweise C</span>
            <h3 className="font-extrabold text-text-main text-base">Holzskelettbau (Pfosten-Riegel-Bauweise)</h3>
            <p className="text-xs text-text-main/70 leading-relaxed">
              Pfosten-Riegel-System unter Verwendung von Brettschichtholz (BSH/Leimholz) für weitspannende Riegelträger und schwere Druckstützen. Die Fassadenausfachung erfolgt getrennt (großflächige Glasflächen oder eingehängte Tafelsysteme).
            </p>
            <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-100/60 mt-2">
              <strong>Einsatz:</strong> Gewerbe- und Industriebauten, Messehallen, moderne großflächige Bürogebäude.
            </div>
          </div>

        </div>

        {/* Interactive Layered Diagram for CLT Floor */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col md:flex-row gap-6">

          <div className="flex flex-col gap-4 max-w-md w-full">
            <h3 className="font-black text-text-main text-sm flex items-center gap-2">
              <Layers size={16} className="text-amber-800" /> Detailaufbau: Massivholz-Geschossdecke (dataholz.eu)
            </h3>
            <p className="text-xs text-text-main/70 leading-relaxed">
              Eine gebundene Splittschüttung (60 mm) erhöht die flächenbezogene Masse der Decke deutlich. Das verringert die im Holzbau typische tieffrequente Trittschallübertragung (&lt; 100 Hz).
            </p>

            <div className="flex flex-col gap-1.5 text-xs text-text-main/80">
              <div className="flex gap-2 items-center"><span className="w-2.5 h-2.5 bg-[#4f46e5] rounded" /> Anhydrit-Heizestrich (65 mm)</div>
              <div className="flex gap-2 items-center"><span className="w-2.5 h-2.5 bg-[#3b82f6] rounded" /> Trittschalldämmung TDPT (30 mm)</div>
              <div className="flex gap-2 items-center"><span className="w-2.5 h-2.5 bg-[#78716c] rounded" /> Gebundene schwere Tragschüttung (60 mm, Masse-Lage)</div>
              <div className="flex gap-2 items-center"><span className="w-2.5 h-2.5 bg-[#d97706] rounded" /> Brettsperrholz-Kern CLT (140 mm)</div>
            </div>
          </div>

          {/* Simulated 2D Render of Floor stack */}
          <div className="flex-grow flex flex-col gap-1 bg-off-white/50 p-4 rounded-xl border border-home-grau/25 min-h-[180px] justify-center">
            <div className="w-full bg-[#4f46e5] text-white text-[10px] font-mono p-1 text-center font-bold tracking-wider rounded-t-lg">Estrich (65 mm)</div>
            <div className="w-full bg-[#1d4ed8] text-white text-[10px] font-mono p-1.5 text-center font-bold tracking-wider">Trittschallminderung (30 mm)</div>
            <div className="w-full bg-[#78716c] text-white text-[10px] font-mono p-2.5 text-center font-bold tracking-wider">Schüttungsmasse zur Trittschall-Dämpfung (60 mm, gebunden)</div>
            <div className="w-full bg-[#b45309] text-white text-[10px] font-mono p-4 text-center font-black tracking-wider rounded-b-lg">
              BSP / CLT Brettsperrholz-Tragscheibe (140 mm 5-lagig)
              <div className="flex justify-around mt-1">
                <span className="border-t border-white/50 w-full text-[8px] italic">Sichtqualität-Unterseite</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
}
