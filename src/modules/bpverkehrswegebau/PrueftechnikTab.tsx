// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { formatDeZahl } from '@/src/utils/numberFormat';
import React from 'react';
import { InlineMath } from 'react-katex';
import { Calculator, CheckCircle2 } from 'lucide-react';

export interface PrueftechnikTabProps {
  asphaltMischung: { gesteinAnteil: number; bitumenAnteil: number; rhoGestein: number; rhoBitumen: number; raumdichteMischung: number; };
  luftPorenErrechnet: { maxDichte: string; luftporen: string; isOk: boolean; };
  setAsphaltMischung: React.Dispatch<React.SetStateAction<{ gesteinAnteil: number; bitumenAnteil: number; rhoGestein: number; rhoBitumen: number; raumdichteMischung: number; }>>;
}

export default function PrueftechnikTab({ asphaltMischung, luftPorenErrechnet, setAsphaltMischung }: PrueftechnikTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Marshall-Verfahren */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-700" /> Prüftechnik im Labor
          </h3>
          
          <div className="space-y-4 text-xs text-text-main/75 leading-relaxed">
            <div>
              <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1">Marshall-Stabilität und -Fließwert (DIN EN 12697-34)</h5>
              <p>
                Mischproben werden mit dem Standard-Marshall-Hammer typischerweise mit 2x50 Schlägen im Zylinder verdichtet. 
                Anschließend wird der Probekörper bei 60 °C (kritische Sommertemperatur) bis zum Bruch beansprucht. Die Maximalkraft ist die <strong>Marshall-Stabilität</strong>, die Verformung der <strong>Fließwert (in mm)</strong>. In Deutschland dienen Marshall-Probekörper vor allem zur Bestimmung von Raumdichte und Hohlraumgehalt.
              </p>
            </div>

            <div className="border-t border-zinc-100 pt-3">
              <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1">Spurbildungsversuch / Wheel-Tracking (DIN EN 12697-22)</h5>
              <p>
                Simuliert die Spurinnenbildung unter schweren Radlasten. Ein Prüfrad überrollt eine Asphaltplatte (DIN EN 12697-22, z. B. 20.000 Überrollungen bei 50 °C oder 60 °C). Die gemessene Profiltiefe (Spurrinne in %) ist das Maß für die hochtemperierte Standfestigkeit.
              </p>
            </div>
          </div>
        </div>

        {/* Interaktive Berechnungen (Hohlraum / Dichte) */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calculator size={16} className="text-shiraz" /> Interaktiver Hohlraumrechner & Rice-Maximaldichte
          </h3>
          <p className="text-xs text-text-main/70 leading-relaxed mb-4">
            Studentische Übungsrechnung: Bestimmen Sie den Hohlraumgehalt eines Asphaltprobekörpers. Zu viel Hohlraum fördert Alterung und Wassereintritt, zu wenig führt zu Spurrinnen und Bindemittelanreicherung an der Oberfläche (Grenzwerte im Rechner: Lehrwerte).
          </p>

          <div className="space-y-4">
            
            {/* Gesteinsanteil */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span>Bitumengehalt (<InlineMath math="B" />):</span>
                <span className="font-mono text-xs">{formatDeZahl(asphaltMischung.bitumenAnteil, 1)} M.-% (Gestein: {formatDeZahl(asphaltMischung.gesteinAnteil, 1)} M.-%)</span>
              </div>
              <input 
                type="range" 
                min="3.0" 
                max="9.0" 
                step="0.1"
                value={asphaltMischung.bitumenAnteil}
                onChange={(e) => {
                  const bit = parseFloat(e.target.value);
                  setAsphaltMischung(prev => ({
                    ...prev,
                    bitumenAnteil: bit,
                    gesteinAnteil: 100 - bit
                  }));
                }}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Raumdichte */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span>Gemessene Raumdichte (<InlineMath math="\rho_r" /> / Bulk Density):</span>
                <span className="font-mono text-xs">{formatDeZahl(asphaltMischung.raumdichteMischung, 2)} g/cm³</span>
              </div>
              <input 
                type="range" 
                min="2.20" 
                max="2.55" 
                step="0.01"
                value={asphaltMischung.raumdichteMischung}
                onChange={(e) => {
                  const rd = parseFloat(e.target.value);
                  setAsphaltMischung(prev => ({
                    ...prev,
                    raumdichteMischung: rd
                  }));
                }}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Ergebnisse Rechner */}
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2 mt-4">
              <div className="grid grid-cols-2 text-xs font-mono">
                <div>Theor. Hohlraumfreie Dichte:</div>
                <div className="text-right font-extrabold text-zinc-800">{luftPorenErrechnet.maxDichte} g/cm³</div>
              </div>
              <div className="grid grid-cols-2 text-xs font-mono border-t border-zinc-200/50 pt-2">
                <div className="font-bold">Errechneter Luftporengehalt (<InlineMath math="V_u" />):</div>
                <div className="text-right font-extrabold text-lg text-zinc-900">{formatDeZahl(Number(luftPorenErrechnet.luftporen), 2)} Vol.-%</div>
              </div>

              <div className="mt-2 text-[10.5px] border-t border-zinc-250 pt-2">
                {luftPorenErrechnet.isOk ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    ✓ Konform (ZTV Asphalt-StB Zielbereich 1,5 - 4,5% für Deckschichten eingehalten!)
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1">
                    ✗ Nicht konform für Deckschichten ({parseFloat(luftPorenErrechnet.luftporen) < 1.5 ? 'zu dicht – Gefahr von Bindemittelanreicherung und Spurrinnen' : 'zu offen – Gefahr von Wassereintritt und Frostschäden'})
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
