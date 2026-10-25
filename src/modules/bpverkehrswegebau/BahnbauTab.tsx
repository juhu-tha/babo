// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Calculator, Train } from 'lucide-react';

export interface BahnbauTabProps {
  bettungstyp: 'schotter_mager' | 'schotter_gut' | 'feste_fahrbahn';
  neutralTemp: number;
  schieneTemp: number;
  setBettungstyp: React.Dispatch<React.SetStateAction<'schotter_mager' | 'schotter_gut' | 'feste_fahrbahn'>>;
  setNeutralTemp: React.Dispatch<React.SetStateAction<number>>;
  setSchieneTemp: React.Dispatch<React.SetStateAction<number>>;
}

export default function BahnbauTab({ bettungstyp, neutralTemp, schieneTemp, setBettungstyp, setNeutralTemp, setSchieneTemp }: BahnbauTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Fachwissen Schienenoberbau */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30 space-y-4">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
            <Train size={16} className="text-shiraz" /> Systemkomponenten & Trassierung im Bahnbau
          </h3>
          
          <div className="space-y-4 text-xs text-text-main/75 leading-relaxed">
            <div>
              <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1">Gleisschotter (DIN EN 13450)</h5>
              <p>
                Der klassische Schotteroberbau verteilt die hohen Lasten der Achsen elastisch auf das Planum. Eisenbahnschotter muss aus zähelastischem Hartgestein (z. B. Basalt oder Granit) bestehen, um den hohen Schlag- und Abriebbeanspruchungen standzuhalten. Wichtigste Kriterien: 
                Flachheitskennzahl (≤ 20 %) und Widerstand gegen Schlagzertrümmerung (SZ ≤ 20 %).
              </p>
            </div>

            <div>
              <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1">Feste Fahrbahn (Slab Track)</h5>
              <p>
                Auf Hochgeschwindigkeitsstrecken wird häufig die Feste Fahrbahn eingesetzt (z. B. System Rheda 2000 oder ÖBB-PORR). Dabei entfällt der elastische Schotter; die Schwellen bzw. Stützpunkte werden in eine Betontragplatte eingebunden. 
              </p>
              <ul className="list-disc pl-4 mt-1.5 space-y-1 text-[11px]">
                <li><strong>Vorteil:</strong> Hohe Lagestabilität und geringer Instandhaltungsaufwand.</li>
                <li><strong>Nachteil:</strong> Hohe Investitionskosten, schwierige Körperschallisolation, extrem aufwendiger Rückbau bei Setzungen.</li>
              </ul>
            </div>

            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
              <h5 className="font-bold text-zinc-800 text-xs mb-1">UIC 60 Schienenprofil</h5>
              <p className="text-[11px]">
                Das Schienenprofil UIC 60 hat ein Metergewicht von 60,34 kg/m und eine Querschnittsfläche von A = 76,86 cm² (heutiges Profil 60E1: ca. 60,2 kg/m). Schienenstahl R260 hat eine Zugfestigkeit von mind. 880 N/mm²; die Schienen sind lückenlos verschweißt.
              </p>
            </div>
          </div>
        </div>

        {/* Interaktiver Gleissicherungs-Rechner */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calculator size={16} className="text-shiraz" /> Interaktives Labor: Thermische Eigenspannung & Verwerfungsrisiko
          </h3>
          <p className="text-xs text-text-main/70 leading-relaxed mb-4">
            Das kontinuierlich verschweißte Gleis (lückenloses Gleis) verhindert Stoßlücken, erzwingt jedoch bei Erwärmung Schienenlängskräfte. Berechnen Sie die statischen Zwangsspannungen und evaluieren Sie das Risiko elastischer Ausknickungen (Gleisverwerfungen).
          </p>

          <div className="space-y-4">
            {/* Schienentemperatur */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span>Aktuelle Schienentemperatur (T_Schiene):</span>
                <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(schieneTemp)} °C</span>
              </div>
              <div className="text-[10px] text-zinc-500 mb-1">Im Sommer können absorbierende Stahlschienen bis zu 25°C über der Lufttemperatur liegen!</div>
              <input 
                type="range" 
                min="-20" 
                max="60" 
                step="1"
                value={schieneTemp}
                onChange={(e) => setSchieneTemp(parseInt(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Neutralisationstemperatur */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main border-none">
                <span>Herstellungs- / Neutralisationstemperatur (T_Neutral):</span>
                <span className="font-mono text-xs">{formatDeWert(neutralTemp)} °C</span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="25" 
                step="1"
                value={neutralTemp}
                onChange={(e) => setNeutralTemp(parseInt(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Bettungstyp */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-main">Oberbaubettung & Querverschiebewiderstand (Q_vw):</label>
              <select aria-label="Oberbaubettung & Querverschiebewiderstand (Q_vw)" 
                value={bettungstyp}
                onChange={(e) => setBettungstyp(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white"
              >
                <option value="schotter_mager">Schotterbett (mangelhaft verdichtet / kein Schotterkopf): Knickgrenze σ = 90 MPa</option>
                <option value="schotter_gut">Schotterbett (solide nach ZTV, voller Schotterkopf): Knickgrenze σ = 135 MPa</option>
                <option value="feste_fahrbahn">Feste Fahrbahn (Betonplattenbauweise): Knickfest gegen Verwerfung</option>
              </select>
            </div>

            {/* Berechnungsausgabe */}
            {(() => {
              const deltaT = schieneTemp - neutralTemp;
              const E_steel = 210000; // MPa
              const alpha_T = 1.2e-5; // 1/K
              const sigma_T = E_steel * alpha_T * deltaT; // in MPa
              const area_uic60 = 7686; // mm²
              const force_per_rail_kN = (sigma_T * area_uic60) / 1000; // in kN
              const force_total_track_kN = force_per_rail_kN * 2; // Gelasierte Gleislängskraft (2 Schienen)

              let statusMsg = "";
              let statusColorClass = "";
              let knickLimit = 135;
              if (bettungstyp === 'schotter_mager') knickLimit = 90;
              else if (bettungstyp === 'feste_fahrbahn') knickLimit = 999;

              if (sigma_T < -120) {
                statusMsg = "Kritische Zugspannung! Erhöhte Gefahr von spröden Schienenbrüchen im Schweißnahtbereich bei Frost.";
                statusColorClass = "text-rose-700 bg-rose-50 border-rose-200";
              } else if (sigma_T < 0) {
                statusMsg = "Zugspannungsbereich (Winterbetrieb). Schienenkontraktion ist weitgehend stabil.";
                statusColorClass = "text-emerald-700 bg-emerald-50 border-emerald-100";
              } else if (bettungstyp === 'feste_fahrbahn') {
                statusMsg = "Formstabile Verankerung. Feste Fahrbahn verhindert elastisches Verwerfen mechanisch.";
                statusColorClass = "text-emerald-700 bg-emerald-50 border-emerald-100";
              } else if (sigma_T >= knickLimit) {
                statusMsg = "AKUTE GEFAHR VON GLEISVERWERFUNG! Die thermische Druckspannung übersteigt den Querverschiebewiderstand des Schotters. Geschwindigkeitsreduzierung bzw. Gleisüberwachung dringend erforderlich!";
                statusColorClass = "text-rose-700 bg-rose-50 border-rose-200";
              } else if (sigma_T >= knickLimit * 0.7) {
                statusMsg = "Erhöhtes Risiko. Geringer Querverschiebesicherheitsbeiwert. Schotterbettfeuchtigkeit & Flanke penibel prüfen.";
                statusColorClass = "text-amber-700 bg-amber-50 border-amber-200";
              } else {
                statusMsg = "Thermische Eigenspannung unkritisch. Ausreichend elastische Rückhaltekraft im Gleiskörper vorhanden.";
                statusColorClass = "text-emerald-700 bg-emerald-50 border-emerald-100";
              }

              return (
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3 mt-4 text-xs">
                  <div className="grid grid-cols-2 font-mono gap-y-1">
                    <div className="text-zinc-500 font-bold">Temperaturdifferenz (ΔT):</div>
                    <div className="text-right font-extrabold text-zinc-900">{deltaT > 0 ? `+${formatDeWert(deltaT)}` : deltaT} K</div>
                    
                    <div className="text-zinc-500 font-bold">Eigenspannung (σ_T):</div>
                    <div className={`text-right font-extrabold ${sigma_T >= 0 ? 'text-rose-800' : 'text-blue-800'}`}>
                      {formatDeZahl(sigma_T, 2)} MPa {(sigma_T >= 0 ? '(Druck)' : '(Zug)')}
                    </div>

                    <div className="text-zinc-500 font-bold">Längskraft pro Schiene:</div>
                    <div className="text-right font-bold text-zinc-700">{formatDeZahl(force_per_rail_kN, 1)} kN</div>

                    <div className="text-zinc-500 font-bold">Gleislängskraft (2 Schienen):</div>
                    <div className="text-right font-extrabold text-zinc-950">{formatDeZahl(force_total_track_kN, 1)} kN</div>
                  </div>

                  {/* Formel-Dokumentation */}
                  <div className="text-[10px] text-zinc-400 bg-white p-2 rounded border border-zinc-150 font-mono">
                    Berechnungsformel: σ_T = E · α_T · (T_Schiene - T_Neutral)
                    mit E = 210.000 N/mm² und α_T = 1,2 · 10⁻⁵ / K.
                  </div>

                  {/* Status Alert */}
                  <div className={`p-2.5 rounded-lg border text-[11px] font-semibold leading-relaxed ${statusColorClass}`}>
                    {statusMsg}
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
