// Ausgelagert aus src/modules/Baustoffkenngroessen.tsx (AP 5.2)
import React from 'react';
import { Layers } from 'lucide-react';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/baustoffkenngroessen/EigenschaftenTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface EigenschaftenTabProps {
  selectedMaterial: 'holz' | 'beton' | 'stahl' | 'glas' | 'mauerwerk' | 'asphalt';
  setSelectedMaterial: React.Dispatch<React.SetStateAction<'holz' | 'beton' | 'stahl' | 'glas' | 'mauerwerk' | 'asphalt'>>;
}

export default function EigenschaftenTab({ selectedMaterial, setSelectedMaterial }: EigenschaftenTabProps) {
  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in" id="tab-eigenschaften-container">
      {/* Sektion 1: Interaktive Material-Klassifizierung */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" size={18} /><MdText text={inhalt.texte.interaktiveMaterialKlassifizierung} /></h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p><MdText text={inhalt.texte.wählenSieEinenBaustoff} /></p>
    </div>

        {/* Material Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(['holz', 'beton', 'stahl', 'glas', 'mauerwerk', 'asphalt'] as const).map((mat) => {
            const names = {
              holz: '🌲 Holz',
              beton: inhalt.werte.normalbeton,
              stahl: inhalt.werte.baustahl,
              glas: inhalt.werte.floatglas,
              mauerwerk: inhalt.werte.mauerwerk,
              asphalt: '🛣️ Asphalt'
            };
            const isSelected = selectedMaterial === mat;
            return (
              <button
                key={mat}
                id={`btn-mat-${mat}`}
                onClick={() => setSelectedMaterial(mat)}
                className={`py-3 px-2 rounded-xl text-xs font-bold font-sans border transition-all text-center ${
                  isSelected
                    ? 'bg-shiraz text-white border-shiraz shadow-md scale-[1.02]'
                    : 'bg-slate-50 border-home-grau/30 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {names[mat]}
              </button>
            );
          })}
        </div>

        {/* Dynamic material profile render */}
        {(() => {
          const spec = inhalt.daten.EigenschaftenTab[selectedMaterial];

          return (
            <div className="p-5 sm:p-6 bg-slate-50 border border-home-grau/30 rounded-2xl flex flex-col gap-5 animate-fade-in" id="material-profile-card">
              <div className="border-b border-home-grau/30 pb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400"><MdText text={inhalt.texte.ausgewählterBaustoffSteckbrief} /></span>
                <h4 className="text-lg sm:text-xl font-bold text-slate-800">{spec.name}</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 italic">{spec.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Richtungsabhängigkeit */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Richtungsabhängigkeit</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${spec.isotropyBadge}`}>{spec.isotropy}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{spec.isotropyDesc}</p>
                  </div>
                </div>

                {/* Homogenitätsgrad */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Gefügestruktur</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${spec.homogeneityBadge}`}>{spec.homogeneity}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{spec.homogeneityDesc}</p>
                  </div>
                </div>

                {/* Rheologische Einordnung */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Verformungsverhalten</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${spec.rheologyBadge}`}>{spec.rheology}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{spec.rheologyDesc}</p>
                  </div>
                </div>
              </div>

              {/* Praktisches Beispiel & Wissenschaftliche Prüfung */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-home-grau/30 text-xs">
                <div className="space-y-1 bg-white/70 p-3.5 rounded-xl border border-home-grau/30">
                  <strong className="text-slate-800 flex items-center gap-1.5"><MdText text={inhalt.texte.praxisbeispielImTragwerkskontext} /></strong>
                  <p className="text-slate-600 leading-relaxed">{spec.example}</p>
                </div>
                <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-home-grau/30">
                  <div>
                    <strong className="text-slate-800 flex items-center gap-1.5"><MdText text={inhalt.texte.zugelassenesPrüfverfahren} /></strong>
                    <p className="text-slate-600 leading-relaxed text-[11px] mt-0.5">{spec.test}</p>
                  </div>
                  <div className="pt-1.5 border-t border-home-grau/30 text-[10.5px]">
                    <span className="font-bold text-slate-700"><MdText text={inhalt.texte.normativesRegelwerk} /></span> <span className="text-slate-600 font-mono">{spec.norm}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Sektion 2: Wissenschaftliche Theorie-DeepDives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        
        {/* Box 1: Isotropie vs. Anisotropie */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between" id="card-isotropie-anisotropie">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <span className="p-1 bg-sky-50 text-sky-600 rounded-md text-xs">A / I</span><MdText text={inhalt.texte.isotropieVsAnisotropieRichtungsverhalten} /></h3>
            <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieIsotropieGriechisch} /><i>isos</i><MdText text={inhalt.texte.gleichUnd} /><i>tropos</i><MdText text={inhalt.texte.richtungBesagtDassDie} /></p>
            <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieAnisotropieBeschreibtDas} /></p>

            {/* Ein kleiner schematischer SVG-Visualizer */}
            <div className="bg-slate-50 text-slate-800 p-4 rounded-xl space-y-3 font-sans text-xs border border-home-grau/30">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase"><MdText text={inhalt.texte.grafischesRichtungsSchema} /></span>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="border border-home-grau/30 p-2.5 rounded-lg bg-white shadow-sm space-y-2">
                  <span className="font-bold text-emerald-700"><MdText text={inhalt.texte.isotropZBStahl} /></span>
                  <div className="flex justify-center py-2">
                    <svg className="w-16 h-16" viewBox="0 0 100 100">
                      {/* Circle indicating same properties in all angles */}
                      <circle cx="50" cy="50" r="30" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx="50" cy="50" r="2" fill="#334155" />
                      <path d="M50,10 L50,90 M10,50 L90,50 M22,22 L78,78 M22,78 L78,22" stroke="#cbd5e1" strokeWidth="1" />
                      {/* Arrows representing equal forces */}
                      <path d="M50,20 L50,15 M50,80 L50,85 M20,50 L15,50 M80,50 L85,50" stroke="#334155" strokeWidth="2" markerEnd="arrow" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">E-Modul <InlineMath math="E_x \equiv E_y \equiv E_z" /></p>
                </div>

                <div className="border border-home-grau/30 p-2.5 rounded-lg bg-white shadow-sm space-y-2">
                  <span className="font-bold text-rose-700"><MdText text={inhalt.texte.anisotropZBHolz} /></span>
                  <div className="flex justify-center py-2">
                    <svg className="w-16 h-16" viewBox="0 0 100 100">
                      {/* Ellipse indicating directionality */}
                      <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="#A3113E" strokeWidth="2" strokeDasharray="3 3" transform="rotate(-30 50 50)" />
                      <circle cx="50" cy="50" r="2" fill="#A3113E" />
                      {/* Fiber direction lines */}
                      <path d="M10,25 L90,65 M15,35 L95,75 M5,15 L85,55" stroke="#A3113E" strokeWidth="1.5" strokeOpacity="0.4" />
                      <path d="M30,35 L70,55" stroke="#A3113E" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">E-Modul <InlineMath math="E_{||} \gg E_{\perp}" /></p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600 mt-5">
            <p><MdText text={inhalt.texte.zentralesPrüfverfahrenNachweisDer} /></p>
            <p><MdText text={inhalt.texte.praxisrelevanzBauteileAusBrettschichthol} /></p>
          </div>
        </div>

        {/* Box 2: Homogenität vs. Heterogenität */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between" id="card-homogenitaet-heterogenitaet">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <span className="p-1 bg-amber-50 text-amber-600 rounded-md text-xs">H / H</span><MdText text={inhalt.texte.homogenitätVsHeterogenitätStruktur} /></h3>
            <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.einWerkstoffIstHomogen} /><i>homogenēs</i><MdText text={inhalt.texte.gleichartigWennSeineStoffliche} /></p>
            <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.einHeterogenerBaustoffBesitzt} /></p>

            {/* Homogeneity Illustration */}
            <div className="bg-slate-50 text-slate-800 p-4 rounded-xl space-y-3 font-sans text-xs border border-home-grau/30">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Gefüge-Phasen-Schema:</span>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="border border-home-grau/30 p-2.5 rounded-lg bg-white shadow-sm space-y-2">
                  <span className="font-bold text-emerald-700"><MdText text={inhalt.texte.homogenGefügeZB} /></span>
                  <div className="flex justify-center py-2">
                    <svg className="w-16 h-16" viewBox="0 0 100 100">
                      {/* Smooth evenly-spaced small dots representing molecules */}
                      <rect x="15" y="15" width="70" height="70" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                      <g fill="#334155" opacity="0.8">
                        <circle cx="25" cy="25" r="2" /><circle cx="35" cy="25" r="2" /><circle cx="45" cy="25" r="2" /><circle cx="55" cy="25" r="2" /><circle cx="65" cy="25" r="2" /><circle cx="75" cy="25" r="2" />
                        <circle cx="25" cy="40" r="2" /><circle cx="35" cy="40" r="2" /><circle cx="45" cy="40" r="2" /><circle cx="55" cy="40" r="2" /><circle cx="65" cy="40" r="2" /><circle cx="75" cy="40" r="2" />
                        <circle cx="25" cy="55" r="2" /><circle cx="35" cy="55" r="2" /><circle cx="45" cy="55" r="2" /><circle cx="55" cy="55" r="2" /><circle cx="65" cy="55" r="2" /><circle cx="75" cy="55" r="2" />
                        <circle cx="25" cy="70" r="2" /><circle cx="35" cy="70" r="2" /><circle cx="45" cy="70" r="2" /><circle cx="55" cy="70" r="2" /><circle cx="65" cy="70" r="2" /><circle cx="75" cy="70" r="2" />
                      </g>
                    </svg>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight"><MdText text={inhalt.texte.phasenreinheitKonstanteWerkstoffdichteRh} /></p>
                </div>

                <div className="border border-home-grau/30 p-2.5 rounded-lg bg-white shadow-sm space-y-2">
                  <span className="font-bold text-rose-700"><MdText text={inhalt.texte.heterogenGefügeZB} /></span>
                  <div className="flex justify-center py-2">
                    <svg className="w-16 h-16" viewBox="0 0 100 100">
                      {/* Multi-phase structure with various particle sizes and pores */}
                      <rect x="15" y="15" width="70" height="70" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                      {/* Stone Aggregates */}
                      <polygon points="25,30 40,22 45,35 30,38" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                      <polygon points="55,50 70,45 75,60 60,65" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                      <circle cx="25" cy="65" r="8" fill="#cbd5e1" />
                      {/* Pores */}
                      <circle cx="50" cy="25" r="3" fill="#A3113E" stroke="#A3113E" strokeWidth="0.5" />
                      <circle cx="40" cy="55" r="4.5" fill="#A3113E" stroke="#A3113E" strokeWidth="0.5" />
                      <circle cx="72" cy="28" r="2" fill="#A3113E" />
                      {/* Mortar matrix */}
                      <path d="M15,15 L85,85" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 2" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight"><MdText text={inhalt.texte.mehrphasigKornMatrixZementleim} /></p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600 mt-5">
            <p><MdText text={inhalt.texte.bauseitigeKonsequenzZurStatistischen} /></p>
            <p><MdText text={inhalt.texte.wichtigFürRechenverfahrenIn} /></p>
          </div>
        </div>

      </div>

      {/* Sektion 3: Elastizität, Plastizität & Fließverhalten */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <span className="p-1 bg-red-50 text-red-650 rounded-md text-xs">R</span><MdText text={inhalt.texte.rheologischesDehnverhaltenViskositäten} /></h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 text-shiraz"><MdText text={inhalt.texte.t1Elastizität} /></h4>
              <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.beschreibtDieEigenschaftEines} /></p>
            </div>
            <div className="font-mono text-[10px] bg-white p-2 border border-home-grau/30 rounded mt-3 text-slate-500"><MdText text={inhalt.texte.hookeschesGesetzBrSigma} /></div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 text-shiraz"><MdText text={inhalt.texte.t2Plastizität} /></h4>
              <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.beschreibtDieFähigkeitNach} /></p>
            </div>
            <div className="font-mono text-[10px] bg-white p-2 border border-home-grau/30 rounded mt-3 text-slate-500"><MdText text={inhalt.texte.fließkriteriumBrSigmaGe} /></div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 text-shiraz"><MdText text={inhalt.texte.t3Viskoelastizität} /></h4>
              <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.eineTemperaturUndZeitabhängige} /></p>
            </div>
            <div className="font-mono text-[10px] bg-white p-2 border border-home-grau/30 rounded mt-3 text-slate-500"><MdText text={inhalt.texte.kriechverformungZementsteinBrVarepsilon} /></div>
          </div>

        </div>

        <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600">
          <span className="font-bold text-slate-800"><MdText text={inhalt.texte.prüfverfahrenDerElastizitätPlastizität} /></span>
          <p className="leading-relaxed"><MdText text={inhalt.texte.bestimmungDerElastizitätsmodulnÜber} /></p>
        </div>
      </div>
    </div>
  );
}
