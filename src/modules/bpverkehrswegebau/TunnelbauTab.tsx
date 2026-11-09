// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Calculator, HardHat } from 'lucide-react';
import inhalt from '@/content/bpverkehrswegebau/TunnelbauTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { spritzbetonRing } from '@/src/calc/verkehrswegebau';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

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
            <HardHat size={16} className="text-shiraz" /><MdText text={inhalt.texte.zyklischerVortriebDieNeue} /></h3>
          
          <div className="space-y-4 text-xs text-text-main/75 leading-relaxed">
            <div>
              <h4 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1 wie-h5"><MdText text={inhalt.texte.dasPrinzipDerNöt} /></h4>
              <p><MdText text={inhalt.texte.dieNeueÖsterreichischeTunnelbauweise} /></p>
              <p className="mt-1.5"><MdText text={inhalt.texte.direktNachDemMechanischen} /></p>
            </div>

            <div>
              <h4 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1 wie-h5"><MdText text={inhalt.texte.frühfestigkeitsklassenBeiSpritzbeton} /></h4>
              <p><MdText text={inhalt.texte.nachDerRichtlinieSpritzbeton} /></p>
              <ul className="list-disc pl-4 mt-1.5 space-y-1 text-[11px]">
                <li><MdText text={inhalt.texte.klasseJ1GeringeFrühfestigkeit} /></li>
                <li><MdText text={inhalt.texte.klasseJ2HöhereFrühfestigkeit} /></li>
                <li><MdText text={inhalt.texte.klasseJ3SehrHohe} /></li>
              </ul>
            </div>

            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
              <h4 className="font-bold text-zinc-800 text-xs mb-1 wie-h5"><MdText text={inhalt.texte.vortriebsverfahrenImVergleich} /></h4>
              <p className="text-[11px]"><MdText text={inhalt.texte.währendDieNötFlexibel} /></p>
            </div>
          </div>
        </div>

        {/* Interaktiver Spritzbeton Rechner */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calculator size={16} className="text-shiraz" /><MdText text={inhalt.texte.statischeVordimensionierungDerSpritzbeto} /></h3>
          <p className="text-xs text-text-main/70 leading-relaxed mb-4"><MdText text={inhalt.texte.lehrmodellMitDerKesselformel} /></p>

          <div className="space-y-4">
            {/* Tunnelradius */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span><MdText text={inhalt.texte.vortriebsAussenradiusR} /></span>
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
                <span><MdText text={inhalt.texte.gebirgsdruckPGRadialspannung} /></span>
                <span className="font-mono text-xs text-shiraz font-bold">{formatDeZahl(gebirgsdruck, 2)} MPa</span>
              </div>
              <div className="text-[10px] text-zinc-500 mb-1"><MdText text={inhalt.texte.hinweis010Mpa} /></div>
              <input aria-label={inhalt.werte.hinweis010Mpa} 
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
                <span><MdText text={inhalt.texte.sicherungsdickeD} /></span>
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
              <label className="block text-xs font-semibold text-text-main"><MdText text={inhalt.texte.betonfestigkeitsklasseSpritzbeton} /></label>
              <select aria-label={inhalt.werte.betonfestigkeitsklasseSpritzbeton} 
                value={betonKlasse}
                onChange={(e) => setBetonKlasse(e.target.value as "C25/30" | "C20/25" | "C30/37")}
                className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white"
              >
                <option value="C20/25">C20/25 (zylindrische Festigkeit f_ck = 20 MPa)</option>
                <option value="C25/30">C25/30 (zylindrische Festigkeit f_ck = 25 MPa)</option>
                <option value="C30/37">C30/37 (zylindrische Festigkeit f_ck = 30 MPa)</option>
              </select>
            </div>

            {/* Ergebnisse Statik */}
            {(() => {
              let f_ck = 25;
              if (betonKlasse === 'C20/25') f_ck = 20;
              else if (betonKlasse === 'C30/37') f_ck = 30;

              // Rechenkern src/calc/verkehrswegebau.ts: Kesselformel σ = p·R/d, f_cd = α_cc·f_ck/γ_c (γ_c = 1,5 vorübergehend, α_cc = 0,85)
              const ring = spritzbetonRing(tunnelRadius, gebirgsdruck, spritzbetonDicke, f_ck);
              const sigma_ring = ring.sigmaRing; // in MPa
              const f_cd = ring.fcd; // in MPa
              const utilization = ring.ausnutzung;
              const isSafe = ring.ok;

              return (
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3 mt-4 text-xs font-sans">
                  <ErgebnisAnsage text={kurzzeile(ansageWert('Ringdruckspannung', sigma_ring, 2, 'MPa'), ansageWert('f_cd', f_cd, 2, 'MPa'), ansageWert('Auslastung', utilization, 1, '%'), Number.isFinite(utilization) && (isSafe ? 'Nachweis erfüllt' : 'Nachweis nicht erfüllt'))} />
                  <div className="grid grid-cols-2 font-mono gap-y-1">
                    <div className="text-zinc-500 font-bold"><MdText text={inhalt.texte.ringdruckkraftNRing} /></div>
                    <div className="text-right font-bold text-zinc-950">{formatDeZahl(ring.ringKraftKnM, 1)} kN/m</div>

                    <div className="text-zinc-500 font-bold"><MdText text={inhalt.texte.ringdruckspannungRing} /></div>
                    <div className="text-right font-extrabold text-shiraz">{formatDeZahl(sigma_ring, 2)} MPa</div>

                    <div className="text-zinc-500 font-bold"><MdText text={inhalt.texte.bemessungsfestigkeitFCdTemp} /></div>
                    <div className="text-right font-bold text-emerald-800">{formatDeZahl(f_cd, 2)} MPa</div>

                    <div className="text-zinc-500 font-bold"><MdText text={inhalt.texte.auslastungsgrad} /></div>
                    <div className={`text-right font-extrabold ${isSafe ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {formatDeZahl(utilization, 1)} %
                    </div>
                  </div>

                  {/* Formel-Dokumentation */}
                  <div className="text-[10px] text-zinc-400 bg-white p-2 rounded border border-zinc-150 font-mono leading-relaxed"><MdText text={inhalt.texte.ringnormalspannungsformelRingPG} /></div>

                  {/* Status Alert */}
                  <div className={`p-2.5 rounded-lg border text-[11px] font-semibold leading-relaxed ${
                    isSafe ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    {isSafe ? (
                      <span><MdText text={inhalt.texte.imLehrmodellAusreichendDie} /></span>
                    ) : (
                      <span><MdText text={inhalt.texte.imLehrmodellNichtAusreichend} /></span>
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
