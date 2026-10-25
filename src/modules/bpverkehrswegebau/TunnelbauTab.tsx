// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Calculator, HardHat } from 'lucide-react';

export interface TunnelbauTabProps {
  betonKlasse: 'C20/25' | 'C25/30' | 'C30/37';
  gebirgsdruck: number;
  setBetonKlasse: React.Dispatch<React.SetStateAction<'C20/25' | 'C25/30' | 'C30/37'>>;
  setGebirgsdruck: React.Dispatch<React.SetStateAction<number>>;
  setSpritzbetonDicke: React.Dispatch<React.SetStateAction<number>>;
  setTunnelRadius: React.Dispatch<React.SetStateAction<number>>;
  spritzbetonDicke: number;
  tunnelRadius: number;
}

export default function TunnelbauTab({ betonKlasse, gebirgsdruck, setBetonKlasse, setGebirgsdruck, setSpritzbetonDicke, setTunnelRadius, spritzbetonDicke, tunnelRadius }: TunnelbauTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tunnelbau Fachwissen */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30 space-y-4">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
            <HardHat size={16} className="text-shiraz" /> Zyklischer Vortrieb & Die Neue Österreichische Tunnelbauweise
          </h3>
          
          <div className="space-y-4 text-xs text-text-main/75 leading-relaxed">
            <div>
              <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1">Das Prinzip der NÖT (NATM)</h5>
              <p>
                Die <strong>Neue Österreichische Tunnelbauweise (NÖT)</strong> prägte maßgebend die Entwicklung des modernen Tunnelbaus. Das Hauptprinzip besagt, dass das umgebende Gebirge nicht nur als belastende Masse betrachtet werden darf, sondern selbst als <strong>tragendes Bauteil (Gewölbe)</strong> herangezogen werden muss.
              </p>
              <p className="mt-1.5">
                Direkt nach dem mechanischen Abschlag oder der Sprengung werden kontrollierte radiale Verformungen des Gebirges zugelassen, um die Spannungsspitzen abzubauen. Anschliessend wird die Tunneldecke durch eine spritzbare Betonschale, Felsanker und Gitterträger sekundenschnell abgedichtet und verbaut.
              </p>
            </div>

            <div>
              <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1">Frühfestigkeitsklassen bei Spritzbeton</h5>
              <p>
                Nach der Richtlinie Spritzbeton werden zur Gewährleistung des Arbeitsschutzes direkt nach dem Aufspritzen Einstufungen vorgenommen:
              </p>
              <ul className="list-disc pl-4 mt-1.5 space-y-1 text-[11px]">
                <li><strong>Klasse J1:</strong> Geringe Frühfestigkeit – für dünne Lagen auf trockenem Untergrund ohne besondere Anforderungen.</li>
                <li><strong>Klasse J2:</strong> Höhere Frühfestigkeit – für dickere Lagen, auch über Kopf, und bei Wasserandrang.</li>
                <li><strong>Klasse J3:</strong> Sehr hohe Frühfestigkeit – bei stark wasserführendem oder nachbrüchigem Gebirge (mehr Staub und Rückprall).</li>
              </ul>
            </div>

            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
              <h5 className="font-bold text-zinc-800 text-xs mb-1">Vortriebsverfahren im Vergleich</h5>
              <p className="text-[11px]">
                Während die NÖT flexibel auf wechselnde Geologien (Felswechsel, Störungszonen) reagieren kann, eignet sich der <strong>Schildvortrieb mit Tunnelbohrmaschinen (TBM)</strong> vor allem bei langen Tunnelstrecken in gleichartigem Baugrund aufgrund der vollautomatisierten Einbringung von Betonfertigteil-Tübbingen.
              </p>
            </div>
          </div>
        </div>

        {/* Interaktiver Spritzbeton Rechner */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calculator size={16} className="text-shiraz" /> Statische Vordimensionierung der Spritzbetonsicherung
          </h3>
          <p className="text-xs text-text-main/70 leading-relaxed mb-4">
            Lehrmodell: Mit der Kesselformel (σ = p · r / d) lässt sich die Ringdruckspannung einer Spritzbetonschale unter angenommenem radialem Gebirgsdruck abschätzen. Eine echte Bemessung erfordert gebirgsmechanische Nachweise.
          </p>

          <div className="space-y-4">
            {/* Tunnelradius */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span>Vortriebs-Aussenradius (R):</span>
                <span className="font-mono text-xs text-shiraz font-bold">{formatDeZahl(tunnelRadius, 1)} m</span>
              </div>
              <input 
                type="range" 
                min="3.0" 
                max="8.0" 
                step="0.1"
                value={tunnelRadius}
                onChange={(e) => setTunnelRadius(parseFloat(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Radialer Gebirgsdruck */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span>Gebirgsdruck (p_g / Radialspannung):</span>
                <span className="font-mono text-xs text-shiraz font-bold">{formatDeZahl(gebirgsdruck, 2)} MPa</span>
              </div>
              <div className="text-[10px] text-zinc-500 mb-1">Hinweis: 0,10 MPa ≈ 10 t/m² vertikale Auflast.</div>
              <input aria-label="Hinweis: 0,10 MPa ≈ 10 t/m² vertikale Auflast." 
                type="range" 
                min="0.05" 
                max="0.50" 
                step="0.01"
                value={gebirgsdruck}
                onChange={(e) => setGebirgsdruck(parseFloat(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Spritzbetondicke */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span>Sicherungsdicke (d):</span>
                <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(spritzbetonDicke)} cm</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="35" 
                step="1"
                value={spritzbetonDicke}
                onChange={(e) => setSpritzbetonDicke(parseInt(e.target.value))}
                className="w-full accent-shiraz" 
              />
            </div>

            {/* Betonfestigkeitsklasse */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-main">Betonfestigkeitsklasse (Spritzbeton):</label>
              <select aria-label="Betonfestigkeitsklasse (Spritzbeton)" 
                value={betonKlasse}
                onChange={(e) => setBetonKlasse(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white"
              >
                <option value="C20/25">C20/25 (zylindrische Festigkeit f_ck = 20 MPa)</option>
                <option value="C25/30">C25/30 (zylindrische Festigkeit f_ck = 25 MPa)</option>
                <option value="C30/37">C30/37 (zylindrische Festigkeit f_ck = 30 MPa)</option>
              </select>
            </div>

            {/* Ergebnisse Statik */}
            {(() => {
              const d_meters = spritzbetonDicke / 100; // cm -> m
              const sigma_ring = (gebirgsdruck * tunnelRadius) / d_meters; // in MPa
              
              let f_ck = 25;
              if (betonKlasse === 'C20/25') f_ck = 20;
              else if (betonKlasse === 'C30/37') f_ck = 30;

              // Temporärer Bemessungswert f_cd nach EC2 (vereinfacht für Bauzustand): f_cd = α_cc * f_ck / γ_c
              const gamma_c = 1.3; // Temporärer Zustand im Tunnelbau
              const alpha_cc = 0.85; 
              const f_cd = (alpha_cc * f_ck) / gamma_c; // in MPa
              const utilization = (sigma_ring / f_cd) * 100;
              const isSafe = utilization <= 100;

              return (
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3 mt-4 text-xs font-sans">
                  <div className="grid grid-cols-2 font-mono gap-y-1">
                    <div className="text-zinc-500 font-bold">Ringdruckkraft (N_ring):</div>
                    <div className="text-right font-bold text-zinc-950">{formatDeZahl((gebirgsdruck * tunnelRadius * 1000), 1)} kN/m</div>

                    <div className="text-zinc-500 font-bold">Ringdruckspannung (σ_Ring):</div>
                    <div className="text-right font-extrabold text-shiraz">{formatDeZahl(sigma_ring, 2)} MPa</div>

                    <div className="text-zinc-500 font-bold">Bemessungsfestigkeit (f_cd,temp):</div>
                    <div className="text-right font-bold text-emerald-800">{formatDeZahl(f_cd, 2)} MPa</div>

                    <div className="text-zinc-500 font-bold">Auslastungsgrad (η):</div>
                    <div className={`text-right font-extrabold ${isSafe ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {formatDeZahl(utilization, 1)} %
                    </div>
                  </div>

                  {/* Formel-Dokumentation */}
                  <div className="text-[10px] text-zinc-400 bg-white p-2 rounded border border-zinc-150 font-mono leading-relaxed">
                    Ringnormalspannungsformel: σ_Ring = (p_g · R) / d
                    Teilsicherheitsbeiwert Bauzustand: γ_c = 1,3 (Lehrannahme)
                  </div>

                  {/* Status Alert */}
                  <div className={`p-2.5 rounded-lg border text-[11px] font-semibold leading-relaxed ${
                    isSafe ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    {isSafe ? (
                      <span>✓ Im Lehrmodell ausreichend: Die Ringdruckspannung liegt unter dem Bemessungswert der Spritzbetonfestigkeit.</span>
                    ) : (
                      <span>✗ Im Lehrmodell nicht ausreichend: Die Ringdruckspannung übersteigt den Bemessungswert. Erhöhen Sie die Dicke oder die Festigkeitsklasse.</span>
                    )}
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
