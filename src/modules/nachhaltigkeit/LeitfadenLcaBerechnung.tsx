import { FormulaText } from '@/src/components/ui/FormulaText';
import { Globe, Building } from 'lucide-react';

export default function LeitfadenLcaBerechnung() {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Schritt 4 von 5</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">
            Berechnung der LCA-Indikatoren &amp; Umweltwirkungsklassen
          </h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Nachdem die Schichten, Massen und EPD-Charakterisierungsfaktoren bestimmt sind, wird die mathematische Akkumulation für das Bauteil durchgeführt. Hierbei müssen Sie die wichtigsten Kenngrößen unterscheiden:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-red-50/40 border border-red-100 rounded-lg">
            <strong className="text-xs text-red-900 block font-bold">GWP-fossil</strong>
            <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
              Erfasst Emissionen aus fossilen Brennstoffen (Kohle, Erdgas). Dominierender Faktor bei Zementwerksprozessen und Stahlherstellung.
            </p>
          </div>
          <div className="p-3 bg-teal-50/45 border border-teal-100 rounded-lg">
            <strong className="text-xs text-teal-900 block font-bold">GWP-biogenic</strong>
            <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
              CO₂-Speicherleistung nachwachsender Baustoffe (z.B. Holz, Stroh). Wird bei der Herstellung als negatives GWP ausgewiesen (Kohlenstoffspeicherung).
            </p>
          </div>
          <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-lg">
            <strong className="text-xs text-amber-900 block font-bold">PENRT &amp; PERE</strong>
            <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
              Primärenergieverbrauch nicht-erneuerbar / erneuerbar. Beschreibt die energetische Gesamteffizienz der Herstellungslogistik.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-stone-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Exemplarisches Rechenbeispiel (1 m² Wand):</span>
          <div className="space-y-2 text-[11px] leading-relaxed">
            <p className="font-bold text-slate-800 flex flex-wrap items-center gap-1">
              Gegeben: Schicht 16 cm EPS-Dämmung (<FormulaText text="\rho = 20\,\mathrm{kg/m^3}" />, <FormulaText text="GWP_{\mathrm{A1\text{-}A3}} = 3{,}25\,\mathrm{kg\,CO_2\text{-}eq/kg}" />)
            </p>
            <div className="bg-white p-3.5 rounded-lg border border-stone-200/60 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase self-start sm:self-auto shrink-0 font-mono">1. Masse pro m²:</span>
                <FormulaText text="M_i = d_i \cdot 1\,\mathrm{m^2} \cdot \rho_i = 0{,}16\,\mathrm{m} \cdot 1\,\mathrm{m^2} \cdot 20\,\mathrm{kg/m^3} = 3{,}2\,\mathrm{kg/m^2}" className="text-xs font-semibold text-slate-700 font-mono" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase self-start sm:self-auto shrink-0 font-mono">2. GWP A1-A3:</span>
                <FormulaText text="GWP_{\mathrm{A1\text{-}A3}} = M_i \cdot gwp_{\mathrm{fossil}} = 3{,}2\,\mathrm{kg/m^2} \cdot 3{,}25\,\mathrm{kg\,CO_2\text{-}eq/kg} = 10{,}4\,\mathrm{kg\,CO_2\text{-}eq/m^2}" className="text-xs font-semibold text-shiraz font-mono" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              Wiederholen Sie diese Summenrechnung für jede Schicht, um das Bauteil-GWP zu kollationieren, wie es im obenstehenden <strong>Wandaufbau-Konfigurator (Tab 1)</strong> automatisiert geschieht!
            </p>
          </div>
        </div>

        {/* Weitere EPD-Wirkungsindikatoren Grid */}
        <div className="bg-slate-50/50 border border-stone-150 rounded-xl p-4 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
            <Globe size={14} className="text-emerald-700" />
            Weitere ökologische EPD-Wirkungsindikatoren (DIN EN 15804)
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eine vollständige EPD deklariert neben dem klassischen Treibhauspotenzial (GWP) weitere standardisierte biogeochemische Wirkungsklassen, die in Prüfungen und Fachberichten eine Rolle spielen:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            {[
              { 
                name: 'ODP (Ozone Depletion Potential)', 
                desc: 'Spezifische Abbauwirkung halogenierter Gase auf die schützende stratosphärische Ozonschicht.', 
                unit: 'kg CFC-11-Äqv.', 
                ref: 'Relevant bei geschäumten Dämmstoffen (PUR/XPS).' 
              },
              { 
                name: 'AP (Acidification Potential)', 
                desc: 'Versauerungseffekt auf Böden und Gewässer (Saurer Regen) durch ssaure Gase wie SO2 und NOx.', 
                unit: 'kg SO₂-Äqv.', 
                ref: 'Entsteht bei Brennprozessen und Klinkerentsäuerung.' 
              },
              { 
                name: 'EP (Eutrophication Potential)', 
                desc: 'Überdüngungseffekt (Nährstoffeintrag) in Gewässern und Böden, begünstigt Algenblüten.', 
                unit: 'kg PO₄³⁻-Äqv.', 
                ref: 'Erhöht bei NaWaRo-Baustoffen durch Düngung beim Anbau.' 
              },
              { 
                name: 'POCP (Photochemical Ozone Creation)', 
                desc: 'Zunahme des bodennahen Ozons durch flüchtige organische Verbindungen und Sonnenlicht (Sommersmog).', 
                unit: 'kg C₂H₄-Äqv.', 
                ref: 'Kritisch bei lösemittelhaltigen Farben, Klebern und Harzen.' 
              }
            ].map((ind, i_idx) => (
              <div key={i_idx} className="bg-white p-3 rounded-lg border border-stone-150 flex flex-col justify-between hover:shadow-2xs transition-all">
                <div>
                  <strong className="text-[11px] text-slate-900 block font-bold leading-tight">{ind.name}</strong>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">{ind.desc}</p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-emerald-800">Einheit: {ind.unit}</span>
                  <span className="text-[9px] text-slate-400 font-mono italic">{ind.ref}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex items-start gap-3">
          <Building className="text-slate-600 shrink-0 mt-0.5" size={16} />
          <div className="text-xs text-slate-800 leading-relaxed">
            <strong className="font-bold block mb-1">Verbindung zu innovativen Baumaterialien:</strong>
            Die Einführung zerspanungsfreier Carbonbewehrungen statt Baustahl (siehe Modul <strong>Innovative Werkstoffe &bull; Carbonbeton</strong>) verringert zwar das Bauteilvolumen, bedingt aber ein sehr hohes initiales GWP bei der Kohlefaserherstellung. Studierende müssen eine Lebenszyklus-Sensitivitätsanalyse anfertigen, um zu prüfen, ab welcher Abminderung der Betonschichtstärke sich Carbonbeton ökologisch amortisiert.
          </div>
        </div>
      </div>
    );
}
