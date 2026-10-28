// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InlineMath } from 'react-katex';
import { TrendingUp, AlertTriangle, Milestone } from 'lucide-react';
import { type RstoProfile } from './daten';
import inhalt from '@/content/bpverkehrswegebau/RstoRechnerTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface RstoRechnerTabProps {
  activeProfile: RstoProfile;
  bauweise: 'asphalt' | 'beton';
  belastungsKlasse: string;
  setBauweise: React.Dispatch<React.SetStateAction<'asphalt' | 'beton'>>;
  setBelastungsKlasse: React.Dispatch<React.SetStateAction<string>>;
}

export default function RstoRechnerTab({ activeProfile, bauweise, belastungsKlasse, setBauweise, setBelastungsKlasse }: RstoRechnerTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
        <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
          <Milestone size={16} className="text-shiraz" /><MdText text={inhalt.texte.grundlagenDerBemessungNach} /></h3>
        <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieRichtlinienFürDie} /></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 flex flex-col gap-5 bg-off-white p-5 rounded-xl border border-home-grau/30">
          <h4 className="font-extrabold text-sm text-text-main">Dimensionierungs-Parameter</h4>
          
          {/* Bauweise */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-text-main/70"><MdText text={inhalt.texte.t1Überbaubauweise} /></span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setBauweise('asphalt'); setBelastungsKlasse('Bk32'); }}
                className={`py-2 px-3 text-xs rounded-lg font-bold border transition-all ${
                  bauweise === 'asphalt'
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                Asphaltbauweise
              </button>
              <button
                onClick={() => { setBauweise('beton'); setBelastungsKlasse('Bk32'); }}
                className={`py-2 px-3 text-xs rounded-lg font-bold border transition-all ${
                  bauweise === 'beton'
                    ? 'bg-slate-300 text-slate-800 border-home-grau/30 shadow-sm'
                    : 'bg-white text-slate-700 border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                Betonbauweise
              </button>
            </div>
          </div>

          {/* Belastungsklasse Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-text-main/70"><MdText text={inhalt.texte.t2BelastungsklasseBK} /></span>
            <select aria-label={inhalt.werte.t2Belastungsklasse}
              value={belastungsKlasse}
              onChange={(e) => setBelastungsKlasse(e.target.value)}
              className="p-2 text-xs border border-zinc-300 rounded-md bg-white text-text-main font-semibold"
            >
              <option value="Bk100">Bk100 (z.B. Fernbahnen, Autobahnen, extreme Belastung)</option>
              <option value="Bk32">Bk32 (z.B. Bundesstraßen, vierspurige Straßen)</option>
              {bauweise === 'asphalt' && (
                <>
                  <option value="Bk10">Bk10 (z.B. Landstraßen, stark befahren)</option>
                  <option value="Bk3.2">Bk3.2 (z.B. Kreisstraßen, Busstrecken)</option>
                  <option value="Bk1.0">Bk1.0 (z.B. Erschließung, Gewerbestraßen)</option>
                  <option value="Bk0.3">Bk0.3 (z.B. Wohnstraßen, Nebenstraßen)</option>
                </>
              )}
            </select>
          </div>

          {/* Info block based on class */}
          <div className="text-xs bg-white p-4 rounded-lg border border-home-grau/10 space-y-2">
            <div className="flex items-start gap-2 text-amber-800">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-[11px] text-amber-900"><MdText text={inhalt.texte.ztvAsphaltStbHinweis} /></p>
                <p className="text-[10px] text-text-main/70 leading-relaxed mt-0.5">
                  {bauweise === 'asphalt' 
                    ? inhalt.werte.erhöhteAnforderungenAnDie
                    : inhalt.werte.querscheinfugenMitDübeln25}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Dimensioning Formula Context */}
          <div className="p-3 text-[11px] font-mono text-text-main/60 bg-white border border-home-grau/15 rounded-lg">
            <span className="font-bold text-text-main block mb-1"><MdText text={inhalt.texte.dimensionierungsformelÄquivalenz} /></span>
            <FormulaText text="B = N \cdot  f_A \cdot  f_G \cdot  f_B \cdot  t_{N}" />
            <span className="text-[10px] text-text-main/70 block mt-1"><MdText text={inhalt.texte.nMittlereTäglicheLkw} /></span>
          </div>
        </div>

        {/* Graphical representation Column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.sollAufbauNachRsto} />{bauweise === 'asphalt' ? inhalt.werte.tafel1Asphalt : inhalt.werte.tafel2Beton}
              </h5>
              <span className="text-xs bg-zinc-100 border border-zinc-200 px-2 py-1 rounded font-mono font-bold text-zinc-700">
                Gesamtdicke: {formatDeWert(activeProfile.totalThickness)} cm
              </span>
            </div>

            <p className="text-xs text-text-main/70 leading-relaxed mb-4 italic">
              {activeProfile.description}
            </p>

            {/* Profil-Stapel */}
            <div className="flex flex-col gap-1.5 border border-zinc-200/50 p-3 rounded-lg bg-zinc-50 shadow-inner">
              {activeProfile.layers.map((layer, index) => {
                // Proportionale Höhe berechnen (min 45px für Textlesbarkeit, max 120px)
                const computedHeight = Math.max(45, Math.min(120, layer.thickness * 2.8));
                return (
                  <div 
                    key={index} 
                    style={{ height: `${computedHeight}px` }}
                    className={`flex flex-col justify-center px-4 rounded border ${layer.bgClass} ${layer.borderColor} relative overflow-hidden transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer group`}
                  >
                    <div className="flex items-center justify-between z-10">
                      <span className="font-extrabold text-xs sm:text-sm tracking-wide">
                        {layer.name}
                      </span>
                      <span className="font-mono text-xs font-bold bg-black/40 text-white px-2 py-0.5 rounded">
                        h = {formatDeWert(layer.thickness)} cm
                      </span>
                    </div>
                    <span className="text-[10px] text-white/80 font-mono mt-1 opacity-90 leading-tight group-hover:opacity-100 transition-all z-10">
                      Werkstoff: {layer.material}
                    </span>
                    
                    {/* Rich-Tooltip on hover showing requirements */}
                    <div className="absolute inset-0 bg-black/95 text-white p-3 hidden group-hover:flex flex-col justify-center text-[10.5px] leading-normal transition-all duration-300">
                      <span className="font-bold text-zinc-300"><MdText text={inhalt.texte.normativeAnforderungZtvAsphalt} /></span>
                      <p className="mt-1">{layer.normRequirement}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Unterbau */}
            <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-950 flex gap-2.5">
              <TrendingUp className="text-amber-700 mt-1 shrink-0" size={16} />
              <div className="text-xs">
                <p className="font-bold"><MdText text={inhalt.texte.untergrundUnterbauPlanum} /></p>
                <p className="text-[11px] leading-relaxed mt-0.5"><MdText text={inhalt.texte.tragfähigkeitsnachweisGemäßZtvE} /><strong className="font-mono text-slate-800"><MdText text={inhalt.texte.sollwertEv245Mpa} /></strong><MdText text={inhalt.texte.istDieserWertNicht} /></p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
