// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import React from 'react';
import { Sliders, GitCommit } from 'lucide-react';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import inhalt from '@/content/stahlbetoninstandhaltung/RissinjektionTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

export interface RissinjektionTabProps {
  bauteilDicke: number;
  crackActivity: 'ruhend' | 'dynamisch';
  crackMoisture: 'trocken' | 'feucht' | 'drueckend';
  crackWidth: number;
  injektionsZiel: 'kraftschluessig' | 'dehnfaehig' | 'abdichtend';
  rissStats: { harzTyp: string; harzKlasse: string; detailVerfahren: string; maxPressureBar: number; packerSpacingMm: number; };
  setBauteilDicke: React.Dispatch<React.SetStateAction<number>>;
  setCrackActivity: React.Dispatch<React.SetStateAction<'ruhend' | 'dynamisch'>>;
  setCrackMoisture: React.Dispatch<React.SetStateAction<'trocken' | 'feucht' | 'drueckend'>>;
  setCrackWidth: React.Dispatch<React.SetStateAction<number>>;
  setInjektionsZiel: React.Dispatch<React.SetStateAction<'kraftschluessig' | 'dehnfaehig' | 'abdichtend'>>;
}

export default function RissinjektionTab({ bauteilDicke, crackActivity, crackMoisture, crackWidth, injektionsZiel, rissStats, setBauteilDicke, setCrackActivity, setCrackMoisture, setCrackWidth, setInjektionsZiel }: RissinjektionTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border-y border-r border-l-4 border-shiraz border-home-grau/20 p-5 rounded-xl shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-home-grau/20">
          <h3 className="font-bold text-shiraz flex items-center gap-2 text-base">
            <GitCommit size={20} /><MdText text={inhalt.texte.rissinjektionImStahlbetonbauDin} /></h3>
          <span className="text-xs font-mono font-bold text-slate-500 bg-off-white px-2.5 py-1 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.prinzip1PiPrinzip} /></span>
        </div>
        <p className="text-text-main/80 text-xs mt-3 leading-relaxed"><MdText text={inhalt.texte.dasFüllenVonRissen} /></p>
      </div>

      {/* Interactive Injection Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Inputs Column */}
        <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/25 shadow-xs space-y-4 text-xs font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-home-grau/20">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sliders size={14} className="text-shiraz" /><MdText text={inhalt.texte.rissdiagnostikParameter} /></span>
            <span className="text-[10px] text-slate-500 font-mono">Befundaufnahme</span>
          </div>

          {/* Injektionsziel */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5"><MdText text={inhalt.texte.t1PrimäresInjektionsziel} /></label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'kraftschluessig', label: inhalt.werte.kraftschlüssigF, desc: 'Zug/Druck' },
                { id: 'dehnfaehig', label: inhalt.werte.dehnfähigD, desc: 'Bewegt' },
                { id: 'abdichtend', label: inhalt.werte.quellfähigS, desc: 'Schleier' }
              ].map((target) => (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => setInjektionsZiel(target.id as "kraftschluessig" | "dehnfaehig" | "abdichtend")}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    injektionsZiel === target.id 
                      ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs' 
                      : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[11px] font-bold">{target.label}</div>
                  <div className={`text-[9px] ${injektionsZiel === target.id ? 'text-white/80' : 'text-slate-400'}`}>{target.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Rissdynamik */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5"><MdText text={inhalt.texte.t2KinetikDerRissbewegung} /></label>
            <AuswahlGruppe label="Rissdynamik" className="grid grid-cols-2 gap-2">
              <button {...alsOption(crackActivity === 'ruhend')}
                type="button"
                onClick={() => setCrackActivity('ruhend')}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  crackActivity === 'ruhend' 
                    ? 'bg-shiraz text-white border-shiraz font-bold' 
                    : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-100'
                }`}
              ><MdText text={inhalt.texte.ruhenderRissW0} /></button>
              <button {...alsOption(crackActivity === 'dynamisch')}
                type="button"
                onClick={() => setCrackActivity('dynamisch')}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  crackActivity === 'dynamisch' 
                    ? 'bg-shiraz text-white border-shiraz font-bold' 
                    : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-100'
                }`}
              ><MdText text={inhalt.texte.dynamischBewegtW0} /></button>
            </AuswahlGruppe>
          </div>

          {/* Feuchtezustand */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5"><MdText text={inhalt.texte.t3FeuchtegradImRissquerschnitt} /></label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'trocken', label: 'Trocken' },
                { id: 'feucht', label: 'Mattfeucht' },
                { id: 'drueckend', label: inhalt.werte.drückendWasser }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCrackMoisture(m.id as "feucht" | "trocken" | "drueckend")}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    crackMoisture === m.id 
                      ? 'bg-blue-600 text-white border-blue-600 font-bold' 
                      : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[11px]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rissbreite w Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-800"><MdText text={inhalt.texte.t4RissbreiteW} /></label>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                {formatDeZahl(crackWidth, 2)} mm
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.05"
              value={crackWidth}
              onChange={(e) => setCrackWidth(parseFloat(e.target.value))}
              className="w-full accent-shiraz cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span><MdText text={inhalt.texte.t010MmHaarriss} /></span>
              <span><MdText text={inhalt.texte.t050MmTrennrisse} /></span>
              <span><MdText text={inhalt.texte.t150MmKlaffend} /></span>
            </div>
          </div>

          {/* Bauteildicke h Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-800"><MdText text={inhalt.texte.t5BauteildickeH} /></label>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-home-grau/30">
                {formatDeWert(bauteilDicke)} mm
              </span>
            </div>
            <input
              type="range"
              min="150"
              max="800"
              step="50"
              value={bauteilDicke}
              onChange={(e) => setBauteilDicke(parseInt(e.target.value, 10))}
              className="w-full accent-shiraz cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span><MdText text={inhalt.texte.t150MmWandDecke} /></span>
              <span><MdText text={inhalt.texte.t400MmBodenplatte} /></span>
              <span><MdText text={inhalt.texte.t800MmMassivbau} /></span>
            </div>
          </div>
        </div>

        {/* Output & SVG Visualization Column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Result Card */}
          <div className="p-5 rounded-2xl bg-white border border-home-grau/30 shadow-xs space-y-4">
            <ErgebnisAnsage text={kurzzeile(rissStats.harzTyp, ansageWert('Packerabstand etwa', rissStats.packerSpacingMm, 'frei', 'mm'), ansageWert('Verpressdruck höchstens', rissStats.maxPressureBar, 'frei', 'bar'))} />
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-shiraz block"><MdText text={inhalt.texte.technologischerInjektionsplan} /></span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {rissStats.harzTyp}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-800">
                {rissStats.harzKlasse}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-off-white p-3.5 rounded-xl border border-home-grau/20">
              {rissStats.detailVerfahren}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20">
                <span className="text-[10px] text-slate-500 uppercase font-bold block"><MdText text={inhalt.texte.packerAbstandL} /></span>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  ≈ {formatDeWert(rissStats.packerSpacingMm)} mm
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5"><MdText text={inhalt.texte.regelLH2} /></span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20">
                <span className="text-[10px] text-slate-500 uppercase font-bold block"><MdText text={inhalt.texte.zulVerpressdruckPMax} /></span>
                <div className="text-lg font-bold font-mono text-blue-700 mt-0.5">
                  ≤ {formatDeWert(rissStats.maxPressureBar)} bar
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5"><MdText text={inhalt.texte.schutzVorHydrofraktur} /></span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-home-grau/20">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Bohrloch-Winkel</span>
                <div className="text-lg font-bold font-mono text-emerald-700 mt-0.5"><MdText text={inhalt.texte.t45ZurRissebene} /></div>
                <span className="text-[10px] text-slate-400 block mt-0.5"><MdText text={inhalt.texte.wechselseitigVersetzt} /></span>
              </div>
            </div>
          </div>

          {/* SVG Visual of Crack Injection */}
          <div className="bg-white border border-home-grau/30 rounded-2xl p-4 flex flex-col items-center justify-center text-text-main relative overflow-hidden shadow-xs">
            <div className="w-full flex items-center justify-between pb-2 border-b border-home-grau/20 text-xs font-mono text-slate-700">
              <span className="font-bold"><MdText text={inhalt.texte.prinzipschnittHochdruckRissinjektionMit} /></span>
              <span className="text-emerald-700 font-bold"><MdText text={inhalt.texte.ztvIngDinEn} /></span>
            </div>

            <svg role="img" aria-label="Prinzipschnitt: Hochdruck-Rissinjektion mit Schraubpackern" width="100%" height="220" viewBox="0 0 540 220" className="select-none mt-2">
              {/* Concrete Cross-Section */}
              <rect x="20" y="30" width="500" height="150" fill="#f8fafc" stroke="#64748b" strokeWidth="2" rx="4" />
              <text x="35" y="50" fill="#475569" fontSize="10" fontWeight="bold">Betonbauteil (h = {formatDeWert(bauteilDicke)} mm)</text>

              {/* Crack Line */}
              <path
                d="M 270 30 Q 265 70 273 110 T 268 180"
                fill="none"
                stroke={crackMoisture === 'drueckend' ? '#475569' : crackActivity === 'dynamisch' ? '#475569' : '#A3113E'}
                strokeWidth={Math.max(2, crackWidth * 4)}
              />

              {/* Surface Verdämmung (Sealing Spachtel) */}
              <rect x="250" y="24" width="40" height="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
              <text x="270" y="19" fill="#475569" fontSize="9" textAnchor="middle" fontWeight="bold">Oberflächenverdämmung</text>

              {/* Left Packer (drilled at 45 deg) */}
              <g transform="translate(195, 105) rotate(-45)">
                <rect x="-4" y="-30" width="8" height="55" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                {/* Packer head outside */}
                <circle cx="0" cy="-30" r="5" fill="#A3113E" />
                <line x1="0" y1="-30" x2="-35" y2="-40" stroke="#A3113E" strokeWidth="1.5" />
                <text x="-40" y="-42" fill="#A3113E" fontSize="9" textAnchor="end" fontWeight="bold">Packer 1 (45°)</text>
              </g>

              {/* Right Packer (drilled at 45 deg from opposite side) */}
              <g transform="translate(345, 105) rotate(45)">
                <rect x="-4" y="-30" width="8" height="55" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                <circle cx="0" cy="-30" r="5" fill="#475569" />
                <line x1="0" y1="-30" x2="35" y2="-40" stroke="#475569" strokeWidth="1.5" />
                <text x="40" y="-42" fill="#334155" fontSize="9" fontWeight="bold">Packer 2 (versetzt)</text>
              </g>

              {/* Resin flow aura at crack intersection */}
              <circle cx="270" cy="110" r="18" fill="rgba(225, 29, 72, 0.15)" className="animate-pulse" />
              <circle cx="270" cy="110" r="4" fill="#A3113E" />

              {/* Distance arrow between packers */}
              <line x1="210" y1="195" x2="330" y2="195" stroke="#64748b" strokeWidth="1.5" />
              <text x="270" y="210" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                Abstand &Delta;l ≈ {formatDeWert(rissStats.packerSpacingMm)} mm
              </text>
            </svg>

            <div className="w-full flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
              <span><MdText text={inhalt.texte.harzflussVonUntenNach} /></span>
              <span><MdText text={inhalt.texte.nachinjektionBisBlasenfreierAustritt} /></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
