import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function LeitfadenEpdKonzepte() {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Schritt 1 von 5</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">
            Grundkonzept &amp; EPD-Wahl (Generische vs. Spezifische Deklarationen)
          </h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Der Einstieg in jede Ökobilanzierung (LCA) verlangt den Zugriff auf validierte Umweltproduktdeklarationen (<strong>EPD - Environmental Product Declarations</strong>) gemäß DIN EN 15804. EPDs bündeln alle quantifizierten Umweltwirkungen eines Baustoffs über dessen Lebenszyklus. Für Studierende ist das Verständnis der zwei EPD-Haupttypen von eminentem Wert:
        </p>

        {/* Comparative Matrix table */}
        <div className="border border-home-grau/30 rounded-xl overflow-hidden shadow-2xs">
          <div className="bg-slate-50 p-2.5 border-b border-home-grau/20 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase text-slate-800 tracking-wide">
            <div>Kriterium</div>
            <div>Generische EPD (z.B. ÖKOBAUDAT)</div>
            <div>Spezifische hersteller-EPD</div>
          </div>

          {[
            {
              krit: 'Datengrundlage',
              gen: 'Branchenmittelschnitte & theoretische Mittelwerte eines Wirtschaftszweiges.',
              spec: 'Gemessene, auditierte Primärdaten eines konkreten Zement-, Ziegel- oder Sägewerks.'
            },
            {
              krit: 'Sicherheitsbeiwert (QNG/DGNB)',
              gen: '⚠️ Unvorteilhafter Aufschlag (+10% auf GWP etc.) zum Ausgleich von Qualitätsschwankungen.',
              spec: '✅ 0% Zuschlag (reale Werte). Führt rechnerisch zu deutlich besseren Gebäude-Ökobilanzen.'
            },
            {
              krit: 'Nutzen für Planer',
              gen: 'Hervorragend in der frühen Entwurfsphase (LPH 1-3), falls Hersteller noch unklar sind.',
              spec: 'Unerlässlich für die detaillierte Ausführungsplanung und das schlussendliche QNG-Audit.'
            },
            {
              krit: 'Innovationswirkung',
              gen: 'Trägt keine marktverändernde Wirkung, zementiert den Ist-Mittelzustand.',
              spec: 'Belohnt CO₂-effiziente Werke (z.B. CO2-arme Klinker, regenerative Werksenergie).'
            }
          ].map((row, r_idx) => (
            <div key={r_idx} className="p-3 grid grid-cols-3 gap-2 text-xs border-b border-stone-100 last:border-0 hover:bg-slate-50/50 transition-colors">
              <div className="font-bold text-slate-900 text-[11px]">{row.krit}</div>
              <div className="text-slate-600 leading-relaxed text-[11px]">{row.gen}</div>
              <div className="text-emerald-950 leading-relaxed text-[11px]">{row.spec}</div>
            </div>
          ))}
        </div>

        {/* PCR Explanation Panel (Product Category Rules) */}
        <div className="bg-emerald-50/15 border border-emerald-100 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-800">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <strong className="text-xs font-black uppercase tracking-wider font-mono">
              Exkurs: Was sind PCR (Product Category Rules)?
            </strong>
          </div>
          <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
            Eine <strong>EPD</strong> darf nicht willkürlich berechnet werden. Hier kommen die <strong>PCR (Produktkategorieregeln)</strong> ins Spiel. PCR sind standardisierte Regelwerke (meist basierend auf <strong>DIN EN 15804</strong>), die definieren, wie Ökobilanzen für bestimmte Baustoffklassen berechnet werden müssen, um deren EPDs überhaupt vergleichbar zu machen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] mt-1">
            <div className="bg-white/60 p-2.5 rounded border border-stone-200/50 space-y-1">
              <span className="font-extrabold text-emerald-900 block font-mono">Part A: Allgemeine Rechenregeln</span>
              <p className="text-slate-500 leading-normal font-normal font-sans">
                Gilt übergreifend für alle Bauprodukte. Definiert Ökobilanz-Grundregeln, anzuwendende Lebenszyklusmodule (A1-D), Gutschriftverfahren und Datenqualität.
              </p>
            </div>
            <div className="bg-white/60 p-2.5 rounded border border-stone-200/50 space-y-1">
              <span className="font-extrabold text-emerald-900 block font-mono">Part B: Spezifische Baustoffklasse</span>
              <p className="text-slate-500 leading-normal font-normal font-sans">
                Gilt für eine konkrete Produktgruppe (z. B. mineralische Dämmstoffe, Betonbauteile, Bauhölzer). Regelt die exakte deklarierte Einheit und stoffspezifische Szenarien.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
          {/* DIN EN 15804+A2 Kernindikatoren */}
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-1.5">
              <strong className="text-xs text-text-main font-bold">DIN EN 15804+A2 Pflicht-Kernindikatoren</strong>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">ÖKOBAUDAT Standard</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 bg-white rounded border border-home-grau/15">
                <span className="font-bold text-shiraz font-mono block">GWP-total</span>
                <span className="text-[10px] text-text-main/70">Gesamtes Erderwärmungspotenzial (fossil + biogen + LULUC)</span>
              </div>
              <div className="p-2 bg-white rounded border border-home-grau/15">
                <span className="font-bold text-text-main font-mono block">GWP-fossil</span>
                <span className="text-[10px] text-text-main/70">Fossile Treibhausgasemissionen aus Brennstoffen/Prozessen</span>
              </div>
              <div className="p-2 bg-white rounded border border-home-grau/15">
                <span className="font-bold text-emerald-700 font-mono block">GWP-biogenic</span>
                <span className="text-[10px] text-text-main/70">Biogener Kohlenstoff (temporäre CO₂-Speicherung in Holz/Nawaro)</span>
              </div>
              <div className="p-2 bg-white rounded border border-home-grau/15">
                <span className="font-bold text-indigo-700 font-mono block">PENRT</span>
                <span className="text-[10px] text-text-main/70">Total nicht-erneuerbare Primärenergie [MJ]</span>
              </div>
              <div className="p-2 bg-white rounded border border-home-grau/15">
                <span className="font-bold text-amber-700 font-mono block">PERT</span>
                <span className="text-[10px] text-text-main/70">Total erneuerbare Primärenergie [MJ]</span>
              </div>
              <div className="p-2 bg-white rounded border border-home-grau/15">
                <span className="font-bold text-slate-700 font-mono block">ÖKOBAUDAT</span>
                <span className="text-[10px] text-text-main/70">Verbindliche Bundesplattform des BMWSB für QNG-Berechnungen</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-amber-950 leading-relaxed">
            <strong className="font-bold block mb-1">Akademischer Praxistipp für die Thesis:</strong>
            Beginnen Sie im Vorentwurf mit generischen EPDs der nationalen <strong>ÖKOBAUDAT</strong>-Datenbank (gemäß DIN EN 15804+A2). Demonstrieren Sie Optimierungskompetenz, indem Sie im Hauptentwurf gezielt emissionsarme Hersteller-EPDs (z.B. für CO₂-reduzierten Beton oder zertifizierten Holzbau) substituieren und die GWP-Senkung quantifizieren!
          </div>
        </div>
      </div>
    );
}
