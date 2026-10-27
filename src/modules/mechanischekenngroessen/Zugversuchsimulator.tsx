import { Sliders, Clock, Activity } from 'lucide-react';
import { MATERIALIEN } from './daten';
import { formatDeWert, formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import type { Dispatch, SetStateAction } from 'react';
import type { MaterialData } from './daten';
import inhalt from '@/content/mechanischekenngroessen/Zugversuchsimulator.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

interface ZugversuchsimulatorProps {
  breiteMm: number;
  durchmesserMm: number;
  handleSelectMaterial: (key: string) => void;
  hoeheMm: number;
  kraftKn: number;
  kriechZahl: number;
  lastArt: "zug" | "druck";
  mat: MaterialData;
  materialKey: string;
  querschnittTyp: "rund" | "rechteck";
  schwindMassPromille: number;
  setBreiteMm: Dispatch<SetStateAction<number>>;
  setDurchmesserMm: Dispatch<SetStateAction<number>>;
  setHoeheMm: Dispatch<SetStateAction<number>>;
  setKraftKn: Dispatch<SetStateAction<number>>;
  setKriechZahl: Dispatch<SetStateAction<number>>;
  setLastArt: Dispatch<SetStateAction<"zug" | "druck">>;
  setQuerschnittTyp: Dispatch<SetStateAction<"rund" | "rechteck">>;
  setSchwindMassPromille: Dispatch<SetStateAction<number>>;
  setStabLaengeM: Dispatch<SetStateAction<number>>;
  sim: { A0_mm2: number; d0_mm: number; I_mm4: number; I_y_mm4: number; I_z_mm4: number; I_min_mm4: number; EA_kN: number; EA_MN: number; EI_kNm2: number; EI_min_kNm2: number; federsteifigkeit_kN_m: number; biegedurchbiegung_mm: number; sigma: number; absSigma: number; zulSpannung: number; fliessGrenze: number; auslastungFestigkeit: number; auslastungFliess: number; isSproede: boolean; isPlastisch: boolean; isVersagt: boolean; F_K_kN: number; knickAuslastung: number; isKnickGefaehrdet: boolean; epsilon: number; epsilonPromille: number; epsilonProzent: number; deltaL_mm: number; endLaenge_mm: number; epsilonQ: number; deltaD_mm: number; endD_mm: number; U_Joule: number; G_MPa: number; K_MPa: number; effEModulKriechen: number; deltaL_kriechen_mm: number; deltaL_elastisch_plus_kriechen_mm: number; deltaL_schwinden_mm: number; deltaL_gesamt_mm: number; endLaengeGesamt_mm: number; masse_kg: number; };
  stabLaengeM: number;
}

export default function Zugversuchsimulator({ breiteMm, durchmesserMm, handleSelectMaterial, hoeheMm, kraftKn, kriechZahl, lastArt, mat, materialKey, querschnittTyp, schwindMassPromille, setBreiteMm, setDurchmesserMm, setHoeheMm, setKraftKn, setKriechZahl, setLastArt, setQuerschnittTyp, setSchwindMassPromille, setStabLaengeM, sim, stabLaengeM }: ZugversuchsimulatorProps) {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">

        {/* Controls (5 Spalten) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                <Sliders size={16} className="text-shiraz" /> Prüfstand-Parameter
              </h3>
              <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">
                {mat.name}
              </span>
            </div>

            {/* Werkstoff-Wahl */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-text-main"><MdText text={inhalt.texte.werkstoffAuswählen} /></label>
                {mat.phiKriechen === 0 && (
                  <span className="text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.kriechenSchwinden0} /></span>
                )}
              </div>
              <select
                value={materialKey}
                onChange={(e) => handleSelectMaterial(e.target.value)}
                className="w-full p-2.5 border border-home-grau/30 rounded-xl bg-off-white text-xs font-semibold focus:ring-2 focus:ring-shiraz outline-none cursor-pointer"
              >
                {Object.values(MATERIALIEN).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (E = {formatDeWert(m.E)} MPa, ν = {formatDeWert(m.nu)})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-text-main/70 italic">{mat.beschreibung}</p>
            </div>

            {/* Belastungsart: Zug oder Druck */}
            <div className="space-y-1.5 pt-2 border-t border-home-grau/20">
              <label className="text-xs font-bold text-text-main block">Belastungsrichtung:</label>
              <AuswahlGruppe label="Belastungsrichtung" className="grid grid-cols-2 gap-2">
                <button {...alsOption(lastArt === 'zug')}
                  onClick={() => setLastArt('zug')}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      lastArt === 'zug' ? 'bg-shiraz text-white border-shiraz shadow' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'
                    }`}
                ><MdText text={inhalt.texte.zugspannung} /></button>
                <button {...alsOption(lastArt === 'druck')}
                  onClick={() => setLastArt('druck')}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      lastArt === 'druck' ? 'bg-shiraz text-white border-shiraz shadow' : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'
                    }`}
                ><MdText text={inhalt.texte.druckspannung} /></button>
              </AuswahlGruppe>
            </div>

            {/* Kraft Slider */}
            <Slider
              label={<FormulaText text={inhalt.werte.normalkraftF} />}
              min={5}
              max={500}
              step={5}
              value={kraftKn}
              unit="kN"
              info={inhalt.werte.aufDenStabAxial}
              onChange={(e) => setKraftKn(Number(e.target.value))}
            />

            {/* Stablänge */}
            <Slider
              label={<FormulaText text={inhalt.werte.stablängeL0} />}
              min={0.5}
              max={10.0}
              step={0.5}
              value={stabLaengeM}
              unit="m"
              onChange={(e) => setStabLaengeM(Number(e.target.value))}
            />

            {/* Euler-Knicklast Hinweis bei Druck */}
            {lastArt === 'druck' && (
              <div className={`p-2.5 rounded-xl border text-xs flex justify-between items-center ${
                  sim.isKnickGefaehrdet 
                    ? 'bg-red-50 text-red-900 border-red-300' 
                    : sim.knickAuslastung > 75 
                    ? 'bg-amber-50 text-amber-900 border-amber-300' 
                    : 'bg-slate-50 text-slate-800 border-slate-200'
                }`}>
                <div>
                  <span className="font-bold block"><MdText text={inhalt.texte.eulerKnicklastFk1} /></span>
                  <span className="text-[10px] text-text-main/70">I_min = {formatDeZahl((sim.I_min_mm4 / 1e4), 1)} cm⁴</span>
                </div>
                <div className="text-right">
                  <span className={`font-mono font-bold text-sm ${sim.isKnickGefaehrdet ? 'text-red-700 font-extrabold' : ''}`}>
                    {formatDeZahl(sim.F_K_kN, 1)} kN
                  </span>
                  <span className="block text-[10px] font-mono">
                    (Auslastung: {formatDeZahl(sim.knickAuslastung, 0)} %)
                  </span>
                </div>
              </div>
            )}

            {/* Querschnittsform */}
            <div className="space-y-2 pt-2 border-t border-home-grau/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-text-main">Querschnittsgeometrie:</span>
                <AuswahlGruppe label="Querschnittsgeometrie" className="flex gap-2">
                  <button {...alsOption(querschnittTyp === 'rund')}
                    onClick={() => setQuerschnittTyp('rund')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold border cursor-pointer ${
                        querschnittTyp === 'rund' ? 'bg-slate-700 text-white' : 'bg-off-white text-slate-700'
                      }`}
                  ><MdText text={inhalt.texte.kreisstab} /></button>
                  <button {...alsOption(querschnittTyp === 'rechteck')}
                    onClick={() => setQuerschnittTyp('rechteck')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold border cursor-pointer ${
                        querschnittTyp === 'rechteck' ? 'bg-slate-700 text-white' : 'bg-off-white text-slate-700'
                      }`}
                  ><MdText text={inhalt.texte.rechteckBH} /></button>
                </AuswahlGruppe>
              </div>

              {querschnittTyp === 'rund' ? (
                <Slider
                  label={<FormulaText text={inhalt.werte.durchmesserD0} />}
                  min={10}
                  max={120}
                  step={2}
                  value={durchmesserMm}
                  unit="mm"
                  onChange={(e) => setDurchmesserMm(Number(e.target.value))}
                />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Slider
                    label="Breite b"
                    min={10}
                    max={150}
                    step={5}
                    value={breiteMm}
                    unit="mm"
                    onChange={(e) => setBreiteMm(Number(e.target.value))}
                  />
                  <Slider
                    label="Höhe h"
                    min={10}
                    max={150}
                    step={5}
                    value={hoeheMm}
                    unit="mm"
                    onChange={(e) => setHoeheMm(Number(e.target.value))}
                  />
                </div>
              )}
            </div>

            {/* Kriechzahl & Schwinden Slider */}
            <div className="space-y-3 pt-3 border-t border-home-grau/20 bg-off-white p-3 rounded-xl border">
              <div className="text-xs font-bold text-text-main flex items-center gap-1.5">
                <Clock size={14} className="text-shiraz" /><MdText text={inhalt.texte.langzeiteffekteKriechenSchwinden} /></div>
              <Slider
                label={inhalt.werte.kriechzahl}
                min={0.0}
                max={4.0}
                step={0.1}
                value={kriechZahl}
                unit="-"
                info={inhalt.werte.verhältnisDerKriechverformungZur}
                onChange={(e) => setKriechZahl(Number(e.target.value))}
              />
              <Slider
                label={inhalt.werte.endschwindmaßCs}
                min={0.0}
                max={1.0}
                step={0.05}
                value={schwindMassPromille}
                unit="‰"
                info={inhalt.werte.lastfreieVerkürzungDurchAustrocknung}
                onChange={(e) => setSchwindMassPromille(Number(e.target.value))}
              />
            </div>

            {/* Result Badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-home-grau/20">
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block">Spannung σ</span>
                <span className={`text-lg font-mono font-bold ${sim.isVersagt ? 'text-red-600' : sim.isPlastisch ? 'text-amber-600' : 'text-shiraz'}`}>
                  {sim.sigma > 0 ? '+' : ''}{formatDeZahl(sim.sigma, 1)} MPa
                </span>
                <span className="text-[9px] text-text-main/70 block">
                  Grenz: {formatDeWert(sim.zulSpannung)} MPa ({formatDeZahl(sim.auslastungFestigkeit, 0)} %)
                </span>
              </div>

              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/20">
                <span className="text-[10px] uppercase font-bold text-text-main/60 block"><MdText text={inhalt.texte.dehnungEl} /></span>
                <span className="text-lg font-mono font-bold text-text-main">
                  {sim.epsilonPromille > 0 ? '+' : ''}{formatDeZahl(sim.epsilonPromille, 2)} ‰
                </span>
                <span className="text-[9px] text-text-main/70 block">({formatDeZahl((sim.epsilonProzent), 3)} %)</span>
              </div>
            </div>

            {/* Status Warning with Buckling & Brittle Fracture checks */}
            <div className={`p-3 rounded-xl border text-xs text-center font-bold ${
                sim.isKnickGefaehrdet
                  ? 'bg-red-100 text-red-900 border-red-300 animate-pulse'
                  : sim.isVersagt
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : sim.isPlastisch
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}>
              {sim.isKnickGefaehrdet ? (
                `STABILITÄTSVERSAGEN DURCH BIEGEKNICKEN! Euler-Knicklast FK = ${formatDeZahl(sim.F_K_kN, 1)} kN überschritten (Knickauslastung: ${formatDeZahl(sim.knickAuslastung, 0)} %). Der Druckstab knickt seitlich aus, bevor die Druckfestigkeit erreicht wird!`
              ) : sim.isVersagt ? (
                sim.isSproede && lastArt === 'zug'
                  ? `SPRÖDBRUCH! Zugfestigkeit fctm (${formatDeWert(sim.zulSpannung)} MPa) überschritten. Werkstoff reißt schlagartig ohne plastische Fließzone ab!`
                  : `BRUCHVERSAGEN! Grenzfestigkeit (${formatDeWert(sim.zulSpannung)} MPa) überschritten.`
              ) : sim.isPlastisch ? (
                `PLASTISCHES FLIEßEN! Streckgrenze fy (${formatDeWert(sim.fliessGrenze)} MPa) überschritten (Fließauslastung: ${formatDeZahl(sim.auslastungFliess, 0)} %)`
              ) : (
                `Linear-elastisch tragfähig (Auslastung: ${formatDeZahl(sim.auslastungFestigkeit, 0)} %${lastArt === 'druck' ? `, Knickauslastung: ${formatDeZahl(sim.knickAuslastung, 0)} %` : ''})`
              )}
            </div>

          </div>
        </div>

        {/* Visualization (7 Spalten) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">

            <div className="flex items-center justify-between pb-3 border-b border-home-grau/20 mb-3">
              <div>
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <Activity size={18} className="text-shiraz" /><MdText text={inhalt.texte.stabverformungQuerdehnung} /></h3>
                <span className="text-xs text-text-main/70 font-medium">
                  ΔL_el = {sim.deltaL_mm > 0 ? '+' : ''}{formatDeZahl(sim.deltaL_mm, 2)}<MdText text={inhalt.texte.mmEinschnürungD} />{sim.deltaD_mm > 0 ? '+' : ''}{formatDeZahl((sim.deltaD_mm * 1000), 1)} µm
                </span>
              </div>
              <span className="text-[11px] font-mono bg-off-white text-slate-700 px-2.5 py-1 rounded border border-home-grau/20">
                U = {formatDeZahl(sim.U_Joule, 2)} J
              </span>
            </div>

            {/* 2D Technical SVG Visualization with White Background */}
            <div className="relative w-full aspect-16/9 max-h-[360px] bg-white rounded-xl overflow-hidden border border-home-grau/30 shadow-sm flex items-center justify-center p-2">
              <svg width="100%" height="100%" viewBox="0 0 520 280" className="select-none">
                <defs>
                  <pattern id="gridMech" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridMech)" />

                {/* Lagerung Links (Feste Einspannung) */}
                <g transform="translate(60, 140)">
                  <rect x="-16" y="-60" width="16" height="120" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
                  {[-50, -35, -20, -5, 10, 25, 40, 55].map((y, i) => (
                    <line key={i} x1="-16" y1={y} x2="-26" y2={y + 10} stroke="#64748b" strokeWidth="1.5" />
                  ))}
                  <line x1="0" y1="-70" x2="0" y2="70" stroke="#1e293b" strokeWidth="3" />
                </g>

                {/* Parameter für Deformation */}
                {(() => {
                  const originX = 60;
                  const originY = 140;
                  const baseWidth = 320;
                  const baseHeight = 50;

                  const visualDeltaL = Math.max(-50, Math.min(80, sim.deltaL_mm * 15));
                  const currentWidth = baseWidth + visualDeltaL;

                  const visualDeltaH = -Math.sign(visualDeltaL) * Math.min(18, Math.abs(visualDeltaL) * 0.35);
                  const currentHeight = Math.max(16, baseHeight + visualDeltaH);

                  return (
                    <g>
                      {/* Ursprünglicher Stabkontur */}
                      <rect
                        x={originX}
                        y={originY - baseHeight / 2}
                        width={baseWidth}
                        height={baseHeight}
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                        strokeDasharray="5 4"
                        rx="2"
                      />
                      <text x={originX + baseWidth / 2} y={originY - baseHeight / 2 - 8} fill="#94a3b8" fontSize="10" textAnchor="middle" className="font-mono">
                        Ausgangszustand: L0 = {formatDeZahl(stabLaengeM, 1)} m, d0 = {formatDeZahl(sim.d0_mm, 0)} mm
                      </text>

                      {/* Verformter Stab */}
                      <rect
                        x={originX}
                        y={originY - currentHeight / 2}
                        width={currentWidth}
                        height={currentHeight}
                        fill={sim.isVersagt ? 'rgba(239, 68, 68, 0.15)' : sim.isPlastisch ? 'rgba(245, 158, 11, 0.15)' : 'rgba(163, 17, 62, 0.12)'}
                        stroke={sim.isVersagt ? '#dc2626' : sim.isPlastisch ? '#d97706' : '#A3113E'}
                        strokeWidth={sim.isPlastisch ? 3 : 2}
                        rx="3"
                      />

                      {/* Kraftpfeile am rechten Stabende */}
                      <g transform={`translate(${originX + currentWidth}, ${originY})`}>
                        {lastArt === 'zug' ? (
                          <>
                            <line x1="0" y1="0" x2="45" y2="0" stroke="#dc2626" strokeWidth="3" />
                            <polygon points="45,0 35,-5 35,5" fill="#dc2626" />
                            <text x="50" y="4" fill="#dc2626" fontSize="12" fontWeight="bold">
                              +F = {formatDeWert(kraftKn)} kN
                            </text>
                          </>
                        ) : (
                          <>
                            <line x1="50" y1="0" x2="5" y2="0" stroke="#b45309" strokeWidth="3" />
                            <polygon points="5,0 15,-5 15,5" fill="#b45309" />
                            <text x="55" y="4" fill="#b45309" fontSize="12" fontWeight="bold">
                              -F = {formatDeWert(kraftKn)} kN
                            </text>
                          </>
                        )}
                      </g>

                      {/* Längenänderung Maßlinie unten */}
                      <g transform={`translate(${originX}, ${originY + baseHeight / 2 + 25})`}>
                        <line x1="0" y1="0" x2={currentWidth} y2="0" stroke="#475569" strokeWidth="1.5" />
                        <line x1="0" y1="-5" x2="0" y2="5" stroke="#475569" strokeWidth="1.5" />
                        <line x1={currentWidth} y1="-5" x2={currentWidth} y2="5" stroke="#475569" strokeWidth="1.5" />

                        <text x={currentWidth / 2} y="15" fill="#334155" fontSize="11" fontWeight="bold" textAnchor="middle">
                          L = {formatDeZahl(sim.endLaenge_mm, 1)} mm (ΔL_el = {sim.deltaL_mm > 0 ? '+' : ''}{formatDeZahl(sim.deltaL_mm, 2)} mm)
                        </text>
                      </g>

                      {/* Querkontraktion Indikator-Pfeile */}
                      {Math.abs(visualDeltaH) > 1.5 && (
                        <g transform={`translate(${originX + currentWidth / 2}, ${originY})`}>
                          {lastArt === 'zug' ? (
                            <>
                              <line x1="0" y1={-baseHeight / 2} x2="0" y2={-currentHeight / 2} stroke="#b45309" strokeWidth="1.5" />
                              <line x1="0" y1={baseHeight / 2} x2="0" y2={currentHeight / 2} stroke="#b45309" strokeWidth="1.5" />
                              <text x="8" y="3" fill="#b45309" fontSize="9" fontWeight="bold" className="font-mono">
                                -Δd = {formatDeZahl((sim.deltaD_mm * 1000), 0)} µm
                              </text>
                            </>
                          ) : (
                            <>
                              <line x1="0" y1={-currentHeight / 2} x2="0" y2={-baseHeight / 2} stroke="#0284c7" strokeWidth="1.5" />
                              <line x1="0" y1={currentHeight / 2} x2="0" y2={baseHeight / 2} stroke="#0284c7" strokeWidth="1.5" />
                              <text x="8" y="3" fill="#0284c7" fontSize="9" fontWeight="bold" className="font-mono">
                                +Δd = {formatDeZahl((Math.abs(sim.deltaD_mm) * 1000), 0)} µm
                              </text>
                            </>
                          )}
                        </g>
                      )}
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Steifigkeits- & Rheologie-Cockpit Live */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-center">
                <span className="text-[10px] text-text-main/60 uppercase block font-bold"><MdText text={inhalt.texte.dehnsteifigkeitEa} /></span>
                <span className="font-mono font-bold text-shiraz">{formatDeZahl(sim.EA_MN, 2)} MN</span>
              </div>
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-center">
                <span className="text-[10px] text-text-main/60 uppercase block font-bold"><MdText text={inhalt.texte.biegesteifigkeitEi} /></span>
                <span className="font-mono font-bold text-shiraz">{formatDeZahl(sim.EI_kNm2, 2)} kNm²</span>
              </div>
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-center">
                <span className="text-[10px] text-text-main/60 uppercase block font-bold"><MdText text={inhalt.texte.langzeitLKriechen} /></span>
                <span className="font-mono font-bold text-blue-700">
                  {sim.deltaL_kriechen_mm > 0 ? '+' : ''}{formatDeZahl(sim.deltaL_kriechen_mm, 2)} mm
                </span>
              </div>
              <div className="bg-off-white p-2.5 rounded-xl border border-home-grau/25 text-center">
                <span className="text-[10px] text-text-main/60 uppercase block font-bold">Schwindverkürzung</span>
                <span className="font-mono font-bold text-amber-700">{formatDeZahl(sim.deltaL_schwinden_mm, 2)} mm</span>
              </div>
            </div>

            {/* Gesamtverformungs-Banner */}
            <div className="p-3 bg-off-white rounded-xl border border-home-grau/30 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-text-main block"><MdText text={inhalt.texte.gesamtverformungNachKriechenSchwinden} /></span>
                <span className="text-[10px] text-text-main/70"><MdText text={inhalt.texte.lGesLEl} />{sim.deltaL_mm > 0 ? '+' : ''}{formatDeZahl(sim.deltaL_mm, 2)}<MdText text={inhalt.texte.mmLKriech} />{sim.deltaL_kriechen_mm > 0 ? '+' : ''}{formatDeZahl(sim.deltaL_kriechen_mm, 2)}<MdText text={inhalt.texte.mmLSchwind} />{formatDeZahl(sim.deltaL_schwinden_mm, 2)} mm)
                </span>
              </div>
              <div className="font-mono font-bold text-sm bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-text-main shadow-xs">
                ΔL_ges = {sim.deltaL_gesamt_mm > 0 ? '+' : ''}{formatDeZahl(sim.deltaL_gesamt_mm, 2)} mm (L_end = {formatDeZahl(sim.endLaengeGesamt_mm, 1)} mm)
              </div>
            </div>

          </div>
        </div>

        {/* Live-Rechenweg (AP 3.7) mit den aktuellen Simulator-Eingaben */}
        <div className="lg:col-span-12">
          <FormulaDerivationBox
            live
            title={`Ihr Rechenweg: ${lastArt === 'zug' ? 'Zugstab' : 'Druckstab'} aus ${mat.name}`}
            zielGleichung="\Delta L_{ges} = \frac{F \cdot L_0}{E \cdot A_0} \cdot (1 + \varphi) - \varepsilon_{cs} \cdot L_0"
            schritte={[
              {
                titel: 'Querschnittsfläche',
                erklaerung: querschnittTyp === 'rund' ? `Kreisquerschnitt mit d = ${formatDeZahl(durchmesserMm, 0)} mm:` : `Rechteckquerschnitt ${formatDeZahl(breiteMm, 0)} × ${formatDeZahl(hoeheMm, 0)} mm:`,
                formel: querschnittTyp === 'rund'
                  ? `A_0 = \\frac{\\pi \\cdot ${formatDeTeX(durchmesserMm, 0)}^2}{4} = ${formatDeTeX(sim.A0_mm2, 1)}\\,\\text{mm}^2`
                  : `A_0 = ${formatDeTeX(breiteMm, 0)} \\cdot ${formatDeTeX(hoeheMm, 0)} = ${formatDeTeX(sim.A0_mm2, 1)}\\,\\text{mm}^2`
              },
              {
                titel: 'Normalspannung',
                erklaerung: `Kraft in N geteilt durch die Fläche (${lastArt === 'zug' ? 'Zug positiv' : inhalt.werte.druckNegativ}):`,
                formel: `\\sigma = \\frac{F}{A_0} = \\frac{${formatDeTeX((lastArt === 'zug' ? 1 : -1) * kraftKn * 1000, 0)}}{${formatDeTeX(sim.A0_mm2, 1)}} = ${formatDeTeX(sim.sigma, 1)}\\,\\text{MPa}`
              },
              {
                titel: inhalt.werte.elastischeDehnungHooke,
                erklaerung: `Mit dem E-Modul E = ${formatDeZahl(mat.E, 0)} MPa:`,
                formel: `\\varepsilon = \\frac{${formatDeTeX(sim.sigma, 1)}}{${formatDeTeX(mat.E, 0)}} = ${formatDeTeX(sim.epsilonPromille, 2)}\\,\\text{\\char8240}`
              },
              {
                titel: inhalt.werte.elastischeLängenänderung,
                erklaerung: `Dehnung mal Ausgangslänge L₀ = ${formatDeZahl(stabLaengeM * 1000, 0)} mm:`,
                formel: `\\Delta L_{el} = ${formatDeTeX(sim.epsilonPromille, 2)} \\cdot 10^{-3} \\cdot ${formatDeTeX(stabLaengeM * 1000, 0)} = ${formatDeTeX(sim.deltaL_mm, 2)}\\,\\text{mm}`
              },
              {
                titel: inhalt.werte.kriechenUndSchwinden,
                erklaerung: `Kriechzahl φ = ${formatDeZahl(kriechZahl, 1)} vergrößert die elastische Verformung, das Schwindmaß ${formatDeZahl(schwindMassPromille, 2)} ‰ verkürzt den Stab lastunabhängig:`,
                formel: `\\Delta L_{ges} = ${formatDeTeX(sim.deltaL_mm, 2)} \\cdot (1 + ${formatDeTeX(kriechZahl, 1)}) - ${formatDeTeX(schwindMassPromille, 2)} \\cdot 10^{-3} \\cdot ${formatDeTeX(stabLaengeM * 1000, 0)} = ${formatDeTeX(sim.deltaL_gesamt_mm, 2)}\\,\\text{mm}`
              }
            ]}
            ergebnisHinweis={inhalt.werte.linearElastischesModellAußerhalb}
            normQuelle={inhalt.werte.technischeMechanikKriechenSchwinden}
          />
        </div>

      </div>
    );
}
