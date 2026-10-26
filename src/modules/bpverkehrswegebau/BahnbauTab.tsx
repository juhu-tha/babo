// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Calculator, Train } from 'lucide-react';
import inhalt from '@/content/bpverkehrswegebau/BahnbauTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { schienenTemperatur, type GleisStatus } from '@/src/calc/verkehrswegebau';

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
            <Train size={16} className="text-shiraz" /><MdText text={inhalt.texte.systemkomponentenTrassierungImBahnbau} /></h3>
          
          <div className="space-y-4 text-xs text-text-main/75 leading-relaxed">
            <div>
              <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1"><MdText text={inhalt.texte.gleisschotterDinEn13450} /></h5>
              <p><MdText text={inhalt.texte.derKlassischeSchotteroberbauVerteilt} /></p>
            </div>

            <div>
              <h5 className="font-extrabold text-[#A3113E] text-xs uppercase font-mono mb-1"><MdText text={inhalt.texte.festeFahrbahnSlabTrack} /></h5>
              <p><MdText text={inhalt.texte.aufHochgeschwindigkeitsstreckenWirdHäufi} /></p>
              <ul className="list-disc pl-4 mt-1.5 space-y-1 text-[11px]">
                <li><MdText text={inhalt.texte.vorteilHoheLagestabilitätUnd} /></li>
                <li><MdText text={inhalt.texte.nachteilHoheInvestitionskostenSchwierige} /></li>
              </ul>
            </div>

            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
              <h5 className="font-bold text-zinc-800 text-xs mb-1"><MdText text={inhalt.texte.uic60Schienenprofil} /></h5>
              <p className="text-[11px]"><MdText text={inhalt.texte.dasSchienenprofilUic60} /></p>
            </div>
          </div>
        </div>

        {/* Interaktiver Gleissicherungs-Rechner */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calculator size={16} className="text-shiraz" /><MdText text={inhalt.texte.interaktivesLaborThermischeEigenspannung} /></h3>
          <p className="text-xs text-text-main/70 leading-relaxed mb-4"><MdText text={inhalt.texte.dasKontinuierlichVerschweißteGleis} /></p>

          <div className="space-y-4">
            {/* Schienentemperatur */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span><MdText text={inhalt.texte.aktuelleSchienentemperaturTSchiene} /></span>
                <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(schieneTemp)} °C</span>
              </div>
              <div className="text-[10px] text-zinc-500 mb-1"><MdText text={inhalt.texte.imSommerKönnenAbsorbierende} /></div>
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
                <span><MdText text={inhalt.texte.herstellungsNeutralisationstemperaturTNe} /></span>
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
              <label className="block text-xs font-semibold text-text-main"><MdText text={inhalt.texte.oberbaubettungQuerverschiebewiderstandQV} /></label>
              <select aria-label={inhalt.werte.oberbaubettungQuerverschiebewiderstandQV} 
                value={bettungstyp}
                onChange={(e) => setBettungstyp(e.target.value as "schotter_mager" | "schotter_gut" | "feste_fahrbahn")}
                className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white"
              >
                <option value="schotter_mager">Schotterbett (mangelhaft verdichtet / kein Schotterkopf): Knickgrenze σ = 90 MPa</option>
                <option value="schotter_gut">Schotterbett (solide nach ZTV, voller Schotterkopf): Knickgrenze σ = 135 MPa</option>
                <option value="feste_fahrbahn">Feste Fahrbahn (Betonplattenbauweise): Knickfest gegen Verwerfung</option>
              </select>
            </div>

            {/* Berechnungsausgabe */}
            {(() => {
              // Rechenkern src/calc/verkehrswegebau.ts: σ_T = E·α_T·ΔT (E = 210 000 N/mm², α_T = 1,2·10⁻⁵ 1/K), F = σ_T·A (60E1: 7686 mm²)
              const gleis = schienenTemperatur(schieneTemp, neutralTemp, bettungstyp);
              const deltaT = gleis.deltaT;
              const sigma_T = gleis.sigmaT; // in MPa
              const force_per_rail_kN = gleis.kraftSchieneKn; // in kN
              const force_total_track_kN = gleis.kraftGleisKn; // Gleislängskraft (2 Schienen)

              const STATUS: Record<GleisStatus, [string, string]> = {
                zugKritisch: [inhalt.werte.kritischeZugspannungErhöhteGefahr, "text-rose-700 bg-rose-50 border-rose-200"],
                zug: [inhalt.werte.zugspannungsbereichWinterbetriebSchienen, "text-emerald-700 bg-emerald-50 border-emerald-100"],
                festeFahrbahn: [inhalt.werte.formstabileVerankerungFesteFahrbahn, "text-emerald-700 bg-emerald-50 border-emerald-100"],
                verwerfung: [inhalt.werte.akuteGefahrVonGleisverwerfung, "text-rose-700 bg-rose-50 border-rose-200"],
                erhoeht: [inhalt.werte.erhöhtesRisikoGeringerQuerverschiebesich, "text-amber-700 bg-amber-50 border-amber-200"],
                unkritisch: [inhalt.werte.thermischeEigenspannungUnkritischAusreic, "text-emerald-700 bg-emerald-50 border-emerald-100"],
              };
              const [statusMsg, statusColorClass] = STATUS[gleis.status];

              return (
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3 mt-4 text-xs">
                  <div className="grid grid-cols-2 font-mono gap-y-1">
                    <div className="text-zinc-500 font-bold"><MdText text={inhalt.texte.temperaturdifferenzT} /></div>
                    <div className="text-right font-extrabold text-zinc-900">{deltaT > 0 ? `+${formatDeWert(deltaT)}` : deltaT} K</div>
                    
                    <div className="text-zinc-500 font-bold"><MdText text={inhalt.texte.eigenspannungT} /></div>
                    <div className={`text-right font-extrabold ${sigma_T >= 0 ? 'text-rose-800' : 'text-blue-800'}`}>
                      {formatDeZahl(sigma_T, 2)} MPa {(sigma_T >= 0 ? '(Druck)' : '(Zug)')}
                    </div>

                    <div className="text-zinc-500 font-bold"><MdText text={inhalt.texte.längskraftProSchiene} /></div>
                    <div className="text-right font-bold text-zinc-700">{formatDeZahl(force_per_rail_kN, 1)} kN</div>

                    <div className="text-zinc-500 font-bold"><MdText text={inhalt.texte.gleislängskraft2Schienen} /></div>
                    <div className="text-right font-extrabold text-zinc-950">{formatDeZahl(force_total_track_kN, 1)} kN</div>
                  </div>

                  {/* Formel-Dokumentation */}
                  <div className="text-[10px] text-zinc-400 bg-white p-2 rounded border border-zinc-150 font-mono"><MdText text={inhalt.texte.berechnungsformelTET} /></div>

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
