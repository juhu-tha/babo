const fs = require('fs');

let content = fs.readFileSync('src/modules/Kreislaufwirtschaft.tsx', 'utf-8');

const additions = `
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Building2 className="text-shiraz" /> Anfallende Baustoffmassen & Verwertungswege
        </h2>
        <p className="text-sm text-text-main/80">
          Bau- und Abbruchabfälle stellen mit über 50 % des Bruttoabfallaufkommens (über 200 Mio. Tonnen jährlich) in Deutschland den größten Abfallstrom dar.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/20">
            <h4 className="font-bold text-home-prim mb-2">Bodenaushub (Boden / Steine)</h4>
            <div className="text-lg font-bold text-text-main mb-1">ca. 130 Mio. t / Jahr</div>
            <p className="text-sm text-text-main/80"><strong>Verwertungswege:</strong> Vorrangig Verfüllung von Abgrabungen, Deponiebau, Landschaftsbau.</p>
          </div>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/20">
            <h4 className="font-bold text-home-prim mb-2">Bauschutt (Mineralisch)</h4>
            <div className="text-lg font-bold text-text-main mb-1">ca. 60 Mio. t / Jahr</div>
            <p className="text-sm text-text-main/80"><strong>Verwertungswege:</strong> Recyclingbaustoffe (Straßenbauunterbau), Anteilig für R-Beton. Viel Downcycling.</p>
          </div>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/20">
            <h4 className="font-bold text-home-prim mb-2">Straßenaufbruch (Asphalt)</h4>
            <div className="text-lg font-bold text-text-main mb-1">ca. 20 Mio. t / Jahr</div>
            <p className="text-sm text-text-main/80"><strong>Verwertungswege:</strong> Asphaltrecycling (sehr hohe Quote an direkter Wiederverwertung im Mischgut).</p>
          </div>
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 lg:col-span-3">
            <h4 className="font-bold text-home-prim mb-2">Sonstige Bauabfälle (Gips, Holz, Kunststoffe, Metalle)</h4>
            <div className="text-lg font-bold text-text-main mb-1">ca. 15 Mio. t / Jahr</div>
            <p className="text-sm text-text-main/80"><strong>Verwertungswege:</strong> Metalle (vollständiges Recycling), Holz/Kunststoffe (oft energetische Verwertung bzgl. Verunreinigungen), Gips (teilweise Gipsrecycling-Anlagen).</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Calculator className="text-shiraz" /> Aufbereitungsverfahren nach Materialien
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl">
            <h4 className="font-bold text-stone-800 mb-2 border-b border-stone-200 pb-2">Mineralische Baustoffe (Beton, Mauerwerk)</h4>
            <ul className="text-sm text-text-main/80 space-y-2">
              <li><strong>Verfahren:</strong> Brechen (Backenbrecher, Prallmühle), Sieben, Sichten (Trennen durch Luftstrom), sensorgestützte Sortierung, ggf. Waschen.</li>
              <li><strong>Verwertungsquote:</strong> Sehr hoch (&gt; 90 %), jedoch findet überwiegend <em>Downcycling</em> statt (Schottertragschichten im Straßenbau). Zirkulär wäre hochwertiges Recycling als Gesteinskörnung für R-Beton (Hochbau).</li>
            </ul>
          </div>
          <div className="bg-slate-100 border border-slate-300 p-4 rounded-xl">
            <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-300 pb-2">Metalle (Stahlbeton, Alu, Profilbahnen)</h4>
            <ul className="text-sm text-text-main/80 space-y-2">
              <li><strong>Verfahren:</strong> Magnetabscheidung (Eisenmetalle), Wirbelstromabscheidung (NE-Metalle wie Aluminium/Kupfer), Shreddern, anschließendes Umschmelzen im Elektrolichtbogenofen (Elektrostahl).</li>
              <li><strong>Verwertungsquote:</strong> Nahe 100 %. Metalle lassen sich praktisch ohne Qualitätsverlust unendlich oft recyceln.</li>
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
            <h4 className="font-bold text-amber-900 mb-2 border-b border-amber-200 pb-2">Bauholz & Holzwerkstoffe</h4>
            <ul className="text-sm text-text-main/80 space-y-2">
              <li><strong>Verfahren:</strong> Schreddern, Altholzverordnung (Klassifizierung A I bis A IV je nach Schadstoffbelastung).</li>
              <li><strong>Verwertungsquote:</strong> Hohe Erfassung, aber stark limitiertes stoffliches Recycling (z.B. Nutzung für Spanplatten nur bei A I / A II). Behandeltes Holz (A III / A IV) wird fast ausschließlich <em>energetisch verwertet</em> (Biomasseheizkraftwerke).</li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <h4 className="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-2">Kunststoffe & Dämmstoffe</h4>
            <ul className="text-sm text-text-main/80 space-y-2">
              <li><strong>Verfahren:</strong> Zerkleinerung, Extrusion (werkstofflich), Auflösung (z.B. CreaSolv für EPS), oder Müllverbrennung (thermisch).</li>
              <li><strong>Verwertungsquote:</strong> Im Baubereich oft gering bzgl. werkstofflichem Recycling, da Kunststoffe oft als Verbundmaterialien (z.B. WDVS, geklebte Bodenbeläge) vorliegen oder mit Brandschutzmitteln kontaminiert sind. Meist noch energetische Verwertung.</li>
            </ul>
          </div>
        </div>
      </div>
<ModuleFooter`;

content = content.replace('<ModuleFooter', additions);

fs.writeFileSync('src/modules/Kreislaufwirtschaft.tsx', content, 'utf-8');
