// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { Layers } from 'lucide-react';

export default function VergleichTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
        <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2">
          Asphaltmischgut & Betonoberbau im Vergleich
        </h3>
        <p className="text-xs text-text-main/80 leading-relaxed">
          Asphalt im Straßenbau ist ein heiß gemischtes Verbundmaterial aus <strong>Füller</strong> (Gesteinsmehl &lt; 0,063 mm), <strong>Feiner/Grober Gesteinskörnung</strong> und <strong>Bitumen</strong>. Die Struktur unterscheidet sich fundamental nach Traggerüst und Beanspruchung:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Asphaltbeton */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-500 uppercase font-mono">EN 13108-1</span>
              <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-extrabold font-sans">Klassiker</span>
            </div>
            <h4 className="font-bold text-base text-zinc-800 mb-1">Asphaltbeton (AC)</h4>
            <p className="text-xs text-text-main/70 leading-relaxed explanation-box">
              Gestuftes Korngerüst mit kontinuierlicher Sieblinie. Die Hohlräume sind fast komplett mit Bitumen gefüllt. Universell einsetzbar in allen Schichten (Deck-, Binder-, Tragschicht). Hoher Verformungswiderstand durch Korn-Scherfestigkeit.
            </p>
          </div>
          <div className="border-t border-zinc-100 pt-3 mt-3 text-[11px] text-zinc-600 font-mono">
            <div>Hohlraum: <span className="text-zinc-900 font-semibold">1,5 - 4,5 %</span></div>
            <div>Bitumen: <span className="text-zinc-900 font-semibold">ca. 5 - 6 M.-%</span></div>
          </div>
        </div>

        {/* Splittmastixasphalt */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-500 uppercase font-mono">EN 13108-5</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-extrabold font-sans">High-Quality</span>
            </div>
            <h4 className="font-bold text-base text-zinc-800 mb-1">Splittmastix (SMA)</h4>
            <p className="text-xs text-text-main/70 leading-relaxed explanation-box">
              Ausfallkörnung mit Splittgerüst (Splitt-an-Splitt-Abstützung). Der Hohlraum ist mit reichlich Mastix (Füller + Bitumen + <strong>Zellulosefasern als Stabilisator</strong> gegen Ablaufen von Bitumen) gefüllt. Sehr widerstandsfähig gegen Verformung unter Schwerverkehr.
            </p>
          </div>
          <div className="border-t border-zinc-100 pt-3 mt-3 text-[11px] text-zinc-600 font-mono">
            <div>Hohlraum: <span className="text-zinc-900 font-semibold">3,0 - 4,0 %</span></div>
            <div>Bitumen: <span className="text-zinc-900 font-semibold">ca. 6,5 - 7,5 M.-%</span></div>
          </div>
        </div>

        {/* Gussasphalt */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-500 uppercase font-mono">EN 13108-6</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold font-sans">Walzfrei</span>
            </div>
            <h4 className="font-bold text-base text-zinc-800 mb-1">Gussasphalt (MA)</h4>
            <p className="text-xs text-text-main/70 leading-relaxed explanation-box">
              Hohlraumfreies Mischgut. Bitumenmengen sind so ausgelegt, dass sie alle Hohlräume vollkommen überfüllen. Heiß fließbar einbaubar und <strong>benötigt kein Walzen</strong>. Nach dem Gießen wird Splitt zur Erreichung der Griffigkeit aufgestreut.
            </p>
          </div>
          <div className="border-t border-zinc-100 pt-3 mt-3 text-[11px] text-zinc-600 font-mono">
            <div>Hohlraum: <span className="text-zinc-900 font-semibold">völlig dicht (~0%)</span></div>
            <div>Bitumen: <span className="text-zinc-900 font-semibold">ca. 7,5 - 8,5 M.-%</span></div>
          </div>
        </div>

        {/* Offenporiger Asphalt */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-500 uppercase font-mono">EN 13108-7</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-extrabold font-sans">Akustik</span>
            </div>
            <h4 className="font-bold text-base text-zinc-800 mb-1">Flüsterasphalt (PA)</h4>
            <p className="text-xs text-text-main/70 leading-relaxed explanation-box">
              Sehr hoher, zusammenhängender Hohlraumgehalt. Wasser läuft durch die Struktur direkt nach unten ab (kein Aquaplaning). Das schallabsorbierende System verringert Reifen-Fahrbahn-Geräusche um bis zu 5 dB(A). Neigt jedoch zu schnellerer Alterung.
            </p>
          </div>
          <div className="border-t border-zinc-100 pt-3 mt-3 text-[11px] text-zinc-600 font-mono">
            <div>Hohlraum: <span className="text-zinc-900 font-semibold">≥ 22,0 Vol.-%</span></div>
            <div>Bitumen: <span className="text-zinc-900 font-semibold">ca. 5,5 - 6,5 M.-%</span></div>
          </div>
        </div>
      </div>

      {/* Tragschichten ungebunden vs. gebunden */}
      <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs">
        <h4 className="font-extrabold text-sm text-text-main mb-3 uppercase tracking-wider flex items-center gap-2">
          <Layers size={16} /> Untere Tragschichten & Ungebundene Bauweisen
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80 leading-relaxed">
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <h5 className="font-bold text-zinc-800 mb-1 flex items-center gap-1">
              <span>🪨 Schottertragschicht (STS) / Frostschutz (FSS)</span>
            </h5>
            <p className="mt-1">
              Trägt Lasten rein über granulare Verzahnung ab. Wichtigste Kriterien nach TL Gestein-StB: <strong>Widerstand gegen Zertrümmerung / Schlagfestigkeit</strong> (SZ/LA-Index) und Frostbeständigkeit. 
              Korngrößengemische meist 0/32 oder 0/45 mm. Einbau muss optimal feucht erfolgen, um Entmischung zu vermeiden.
            </p>
          </div>
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-1">
              <span>🧱 Zementstabilisierung / HGT & Verfestigung</span>
            </h5>
            <p className="mt-1">
              <strong>Hydraulisch gebundene Tragschichten (HGT)</strong>: Gemisch aus Gesteinskörnungen, Zement und Wasser. Geringe Zugfestigkeit, Neigung zu Schwind- und Temperaturrissen. Unter Asphalt wird die HGT gekerbt, damit sich Risse nicht unkontrolliert in den Asphalt durchpausen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
