// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Layers, Calculator, AlertTriangle, Milestone, Droplets } from 'lucide-react';
import inhalt from '@/content/bpverkehrswegebau/BetondeckenTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { westergaardRand, betondeckenFugen } from '@/src/calc/verkehrswegebau';

export interface BetondeckenTabProps {
  betonAchslast: number;
  betonAggregate: 'quarz' | 'kalk' | 'basalt';
  betonBettung: number;
  betonCementAlkali: 'low' | 'high';
  betonFreshAir: number;
  betonFugenAbstand: number;
  betonMaxAggregateSize: 22 | 32;
  betonShowAKRDetails: boolean;
  betonSlabThickness: number;
  setBetonAchslast: React.Dispatch<React.SetStateAction<number>>;
  setBetonAggregate: React.Dispatch<React.SetStateAction<'quarz' | 'kalk' | 'basalt'>>;
  setBetonBettung: React.Dispatch<React.SetStateAction<number>>;
  setBetonCementAlkali: React.Dispatch<React.SetStateAction<'low' | 'high'>>;
  setBetonFreshAir: React.Dispatch<React.SetStateAction<number>>;
  setBetonFugenAbstand: React.Dispatch<React.SetStateAction<number>>;
  setBetonMaxAggregateSize: React.Dispatch<React.SetStateAction<22 | 32>>;
  setBetonShowAKRDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setBetonSlabThickness: React.Dispatch<React.SetStateAction<number>>;
}

export default function BetondeckenTab({ betonAchslast, betonAggregate, betonBettung, betonCementAlkali, betonFreshAir, betonFugenAbstand, betonMaxAggregateSize, betonShowAKRDetails, betonSlabThickness, setBetonAchslast, setBetonAggregate, setBetonBettung, setBetonCementAlkali, setBetonFreshAir, setBetonFugenAbstand, setBetonMaxAggregateSize, setBetonShowAKRDetails, setBetonSlabThickness }: BetondeckenTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Academic Briefing banner */}
      <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
        <h3 className="font-bold text-text-main text-sm uppercase tracking-wider flex items-center gap-2">
          <Layers size={16} className="text-shiraz" /><MdText text={inhalt.texte.fahrbahndeckenAusBetonNach} /></h3>
        <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.fahrbahndeckenAusBetonStarre} /><span className="font-bold"><MdText text={inhalt.texte.mehrAls30Jahren} /></span><MdText text={inhalt.texte.dieKonstruktivenKriterienFür} /></p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1 text-[11px]">
          <div className="bg-white p-2.5 rounded border border-zinc-200">
            <span className="font-bold text-shiraz block">Betonfestigkeit</span><MdText text={inhalt.texte.standardmäßigC3037Biegezugprüfung} /></div>
          <div className="bg-white p-2.5 rounded border border-zinc-200">
            <span className="font-bold text-shiraz block">Expositionsklassen</span><MdText text={inhalt.texte.xf4Xm2SehrHoher} /></div>
          <div className="bg-white p-2.5 rounded border border-zinc-200">
            <span className="font-bold text-shiraz block">Oberflächentextur</span><MdText text={inhalt.texte.waschbetonStrukturErzeugungEines} /></div>
          <div className="bg-white p-2.5 rounded border border-zinc-200">
            <span className="font-bold text-shiraz block">Wassereinfluss</span><MdText text={inhalt.texte.gefährdungDurchAlkaliKieselsäure} /></div>
        </div>
      </div>

      {/* Main Interactive Screen layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interaktive Bemessung */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Panel 1: Plattendicken-Dimensionierer (Westergaard) */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-text-main flex items-center gap-1 border-b border-zinc-100 pb-2">
              <Calculator size={15} className="text-shiraz" /><MdText text={inhalt.texte.t1PlattenstärkenPrüferElastischer} /></h4>
            <p className="text-[11px] text-gray-500 leading-normal"><MdText text={inhalt.texte.berechnetDieKritischeBiegezugspannung} /></p>

            <div className="space-y-4">
              {/* Plattendicke h */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.deckendickeH} /></span>
                  <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(betonSlabThickness)} cm</span>
                </div>
                <input 
                  type="range" 
                  min="18" 
                  max="35" 
                  step="1"
                  value={betonSlabThickness}
                  onChange={(e) => setBetonSlabThickness(parseInt(e.target.value))}
                  className="w-full accent-shiraz" 
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span><MdText text={inhalt.texte.typischBk0318} /></span>
                  <span><MdText text={inhalt.texte.autobahnBk1002830} /></span>
                </div>
              </div>

              {/* Belastungsklasse & Achslast P */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.bemessungsAchsübergangPAchse} /></span>
                  <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(betonAchslast)} kN</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="180" 
                  step="5"
                  value={betonAchslast}
                  onChange={(e) => setBetonAchslast(parseInt(e.target.value))}
                  className="w-full accent-shiraz" 
                />
                <div className="text-[10px] text-zinc-500"><MdText text={inhalt.texte.radlastPRadP} />{formatDeZahl((betonAchslast / 2), 0)}<MdText text={inhalt.texte.knTypischesLkwRad} /></div>
              </div>

              {/* Bettungsmodul k */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.bettungsmodulDesUnterbausK} /></span>
                  <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(betonBettung)} MN/m³</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="150" 
                  step="5"
                  value={betonBettung}
                  onChange={(e) => setBetonBettung(parseInt(e.target.value))}
                  className="w-full accent-shiraz" 
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span><MdText text={inhalt.texte.erdbauWeich30Mn} /></span>
                  <span><MdText text={inhalt.texte.stabileHgtZement100} /></span>
                </div>
              </div>

              {/* Berechnung output */}
              {(() => {
                // Rechenkern src/calc/verkehrswegebau.ts (Westergaard-Randspannung mit Ersatzradius b, E = 34 000 N/mm², ν = 0,15, p = 0,8 N/mm²)
                const w = westergaardRand({ dickeCm: betonSlabThickness, achslastKn: betonAchslast, bettungMNm3: betonBettung });
                const l_mm = w.lMm;
                const r_mm = w.rMm;
                const sigma_e = w.sigmaE;
                // C30/37 Biegezug-Charakteristik = 4.5 MPa. Dauerfestigkeitsfaktor unter zyklischer Autobahnbelastung = 2.0 -> zulässig ca. 2.25 MPa
                const allowed_sigma = 2.25;
                const isThicknessOK = w.ok;
                const ratio = w.ausnutzung;

                return (
                  <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-lg space-y-3 mt-3 text-xs">
                    <h5 className="font-bold text-zinc-800"><MdText text={inhalt.texte.spannungsermittlungNachWestergaardTheori} /></h5>
                    <div className="grid grid-cols-2 font-mono gap-y-1 text-[11px]">
                      <div className="text-zinc-500"><MdText text={inhalt.texte.radaufstandsflächeRT} /></div>
                      <div className="text-right text-zinc-800">ø {formatDeZahl((r_mm * 2 / 10), 1)} cm (r = {formatDeZahl(r_mm, 0)} mm)</div>
                      
                      <div className="text-zinc-500"><MdText text={inhalt.texte.elastischeSteifigkeitslängeL} /></div>
                      <div className="text-right text-zinc-800">{formatDeZahl((l_mm / 10), 1)} cm (l = {formatDeZahl(l_mm, 0)} mm)</div>

                      <div className="text-zinc-500"><MdText text={inhalt.texte.berechneteDehnspannungE} /></div>
                      <div className="text-right text-shiraz font-black">{formatDeZahl(sigma_e, 2)} N/mm² (MPa)</div>

                      <div className="text-zinc-500"><MdText text={inhalt.texte.zulDehnspannungDauerlast} /></div>
                      <div className="text-right text-emerald-800 font-bold">{formatDeZahl(allowed_sigma, 2)} N/mm²</div>

                      <div className="text-zinc-500"><MdText text={inhalt.texte.ausnutzungsgradBiege} /></div>
                      <div className={`text-right font-black ${isThicknessOK ? 'text-emerald-700' : 'text-red-700'}`}>{formatDeZahl(ratio, 1)} %</div>
                    </div>

                    <div className={`p-2 rounded border text-[11px] leading-relaxed ${
                      isThicknessOK ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                      {isThicknessOK ? (
                        <span><MdText text={inhalt.texte.dimensionierungAusreichendDieBetondecke} />{formatDeWert(betonSlabThickness)}<MdText text={inhalt.texte.cmHältDenDauer} /></span>
                      ) : (
                        <span><MdText text={inhalt.texte.mangelhaftBruchgefahrDieRandspannung} /></span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Panel 2: LP-Frischbetongehalts-Rechner */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-text-main flex items-center gap-1.5 border-b border-zinc-100 pb-2">
              <Droplets size={15} className="text-shiraz" /><MdText text={inhalt.texte.t2FrostTausalzLp} /></h4>
            <p className="text-[11px] text-gray-500 leading-normal"><MdText text={inhalt.texte.fahrbahndeckenErhaltenKünstlicheMikroluf} /></p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1"><MdText text={inhalt.texte.maximalesGrößtkorn} /></label>
                  <select aria-label={inhalt.werte.maximalesGrößtkorn} 
                    value={betonMaxAggregateSize}
                    onChange={(e) => setBetonMaxAggregateSize(parseInt(e.target.value) as 32 | 22)}
                    className="w-full text-xs p-2 rounded-lg border border-zinc-200 font-sans"
                  >
                    <option value="32">GK 32 mm (Max. Korn 32)</option>
                    <option value="22">GK 22 mm (Max. Korn 22)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1"><MdText text={inhalt.texte.gemessenerLuftporenhintergrund} /></label>
                  <div className="flex items-center gap-2">
                    <input aria-label={inhalt.werte.gemessenerLuftporenhintergrund} 
                      type="number" 
                      step="0.1"
                      min="2"
                      max="10"
                      value={betonFreshAir}
                      onChange={(e) => setBetonFreshAir(parseFloat(e.target.value) || 2)}
                      className="w-20 text-xs p-1.5 border rounded"
                    />
                    <span className="text-xs font-mono font-bold">% Vol.</span>
                  </div>
                </div>
              </div>

              {/* LP Analysis output */}
              {(() => {
                const reqMin = betonMaxAggregateSize === 32 ? 4.0 : 4.5;
                const reqMax = betonMaxAggregateSize === 32 ? 6.5 : 7.0;
                const isLpOK = betonFreshAir >= reqMin && betonFreshAir <= reqMax;
                
                let lpMsg = "";
                let lpColor = "";
                let strengthLoss = 0;

                if (betonFreshAir > reqMax) {
                  strengthLoss = (betonFreshAir - reqMin) * 4.5; // assume 4.5% loss per 1% extra air
                  lpMsg = `⚠ Luftporengehalt über ${formatDeWert(reqMax)} %: Die Festigkeit sinkt (Faustregel ca. 4–5 % je 1 % Luft über dem Mindestwert von ${formatDeWert(reqMin)} %; hier rund ${formatDeZahl(strengthLoss, 0)} %).`;
                  lpColor = "bg-amber-50 text-amber-800 border-amber-200";
                } else if (betonFreshAir < reqMin) {
                  lpMsg = `✗ Luftporengehalt zu niedrig (${formatDeWert(betonFreshAir)} % < ${formatDeWert(reqMin)} %): unzureichender Frost-Tausalz-Widerstand, Abwitterung möglich.`;
                  lpColor = "bg-red-50 text-red-800 border-red-200";
                } else {
                  lpMsg = `✓ Im Sollbereich (${formatDeWert(reqMin)}–${formatDeWert(reqMax)} %, Lehrwerte).`;
                  lpColor = "bg-emerald-50 text-emerald-800 border-emerald-100";
                }

                return (
                  <div className={`p-3 rounded-lg border space-y-1.5 text-xs ${lpColor}`}>
                    <div className="font-bold flex justify-between items-center">
                      <span><MdText text={inhalt.texte.sollLpBereichFür} />{betonMaxAggregateSize}:</span>
                      <span className="font-mono">{formatDeWert(reqMin)}% bis {formatDeWert(reqMax)}%</span>
                    </div>
                    <p className="leading-relaxed text-[11px] font-sans">
                      {lpMsg}
                    </p>
                  </div>
                );
              })()}

            </div>
          </div>

        </div>

        {/* Right Column: Fugen & AKR-Screening */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Panel 3: Fugen-Dimensionierung (Joint Config) */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-text-main flex items-center gap-1.5 border-b border-zinc-100 pb-2">
              <Milestone size={15} className="text-shiraz" /><MdText text={inhalt.texte.t3FugengeometrieBewehrungsbedarf} /></h4>
            <p className="text-[11px] text-gray-500 leading-normal"><MdText text={inhalt.texte.fahrstreifendeckenImStraßenbauWerden} /></p>

            <div className="space-y-4">
              {/* Fugenabstand L */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.längsabstandDerScheinfugenPlattenlänge} /></span>
                  <span className="font-mono text-xs text-shiraz font-bold">{formatDeZahl(betonFugenAbstand, 1)} m</span>
                </div>
                <input 
                  type="range" 
                  min="3.0" 
                  max="7.0" 
                  step="0.1"
                  value={betonFugenAbstand}
                  onChange={(e) => setBetonFugenAbstand(parseFloat(e.target.value))}
                  className="w-full accent-shiraz" 
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span><MdText text={inhalt.texte.ztvStandard50} /></span>
                  <span><MdText text={inhalt.texte.kritischerBaufehler50} /></span>
                </div>
              </div>

              {/* Fugen und Beiwert Checks */}
              {(() => {
                // Rechenkern: Fugenabstand L ≤ min(25·h; 5,0 m), Dübel Ø 25 alle 25 cm je 3,75-m-Fahrstreifen, Anker alle 1,5 m
                const fugen = betondeckenFugen(betonFugenAbstand, betonSlabThickness);
                const maxAllowedL = fugen.maxAbstandM;
                const isFugenOK = fugen.ok;
                const dowelCount = fugen.duebel;
                const tieBarCount = fugen.anker;

                return (
                  <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-lg space-y-3 text-xs">
                    <div className={`p-2.5 rounded border text-[11px] leading-relaxed ${
                      isFugenOK ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-red-200'
                    }`}>
                      {isFugenOK ? (
                        <span><MdText text={inhalt.texte.fugenabstandKonformL} />{formatDeZahl(betonFugenAbstand, 1)}<MdText text={inhalt.texte.mIstKleinerAls} />{formatDeZahl(maxAllowedL, 2)}<MdText text={inhalt.texte.mLehrannahme25H} /></span>
                      ) : (
                        <span><MdText text={inhalt.texte.rissgefahrL} />{formatDeZahl(betonFugenAbstand, 1)}<MdText text={inhalt.texte.mÜbersteigtDenRechnerischen} />{formatDeZahl(maxAllowedL, 2)}<MdText text={inhalt.texte.mFürUnbewehrtePlatten} /></span>
                      )}
                    </div>

                    <div className="border-t border-zinc-200 pt-2.5 space-y-1.5 font-sans">
                      <span className="font-bold text-zinc-700 block text-xs"><MdText text={inhalt.texte.konstruktiveFugenausführungProPlatte} /></span>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-650 font-sans">
                        <li>Querscheinfugen: <strong>{dowelCount}<MdText text={inhalt.texte.xRunddübel25Mm} /></strong><MdText text={inhalt.texte.aufDübelkörbenSieÜbertragen} /></li>
                        <li>Längsscheinfugen: <strong>{tieBarCount}<MdText text={inhalt.texte.xProfilierteAnker20} /></strong><MdText text={inhalt.texte.zurVerhinderungVonLängskampf} /></li>
                      </ul>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

          {/* Panel 4: Alkali-Kieselsäure-Reaktion (AKR) / Betonkrebs */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-[#A3113E] flex items-center gap-1.5 border-b border-zinc-100 pb-2 font-sans">
              <AlertTriangle size={15} /><MdText text={inhalt.texte.t4AlkaliKieselsäureReaktion} /></h4>
            <p className="text-[11px] text-gray-500 leading-normal"><MdText text={inhalt.texte.dieZerstörerischeAkrBetonkrebs} /></p>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-text-main mb-1"><MdText text={inhalt.texte.gesteinskörnungEdelsplitt} /></label>
                  <select aria-label={inhalt.werte.gesteinskörnungEdelsplitt} 
                    value={betonAggregate}
                    onChange={(e) => setBetonAggregate(e.target.value as "basalt" | "kalk" | "quarz")}
                    className="w-full text-xs p-2 rounded border border-zinc-200 bg-white"
                  >
                    <option value="quarz">Quarzhaltiger Kies / Opalsand (hochreaktiv)</option>
                    <option value="kalk">Reiner Kalkstein (E1 - unbedenklich)</option>
                    <option value="basalt">Geprüfter Basalt / Granit (reaktionsarm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-main mb-1"><MdText text={inhalt.texte.alkaligehaltDesZements} /></label>
                  <select aria-label={inhalt.werte.alkaligehaltDesZements} 
                    value={betonCementAlkali}
                    onChange={(e) => setBetonCementAlkali(e.target.value as "low" | "high")}
                    className="w-full text-xs p-1.5 rounded border border-zinc-200 bg-white"
                  >
                    <option value="high">Standard CEM I (Na2O_eq ≥ 0,60%)</option>
                    <option value="low">NA-Zement (Na2O_eq &lt; 0,60% / Low Alkali)</option>
                  </select>
                </div>
              </div>

              {/* Screening Analysis */}
              {(() => {
                let riskTitle = "";
                let riskColor = "";
                let riskAdvice = "";

                if (betonAggregate === 'quarz') {
                  if (betonCementAlkali === 'high') {
                    riskTitle = inhalt.werte.akutesSchadensrisikoBetonkrebsGefahr;
                    riskColor = "bg-red-50 text-red-800 border-red-200";
                    riskAdvice = inhalt.werte.alkaliempfindlicheGesteinskörnungMitÜbli;
                  } else {
                    riskTitle = inhalt.werte.mäßigesRisikoBeherrschtDurch;
                    riskColor = "bg-amber-50 text-amber-800 border-amber-200";
                    riskAdvice = inhalt.werte.einZementMitNiedrigem;
                  }
                } else {
                  riskTitle = inhalt.werte.geringesAkrRisiko;
                  riskColor = "bg-emerald-50 text-emerald-800 border-emerald-100";
                  riskAdvice = inhalt.werte.gesteinskörnungenDerAlkaliempfindlichkei;
                }

                return (
                  <div className={`p-3 rounded-lg border space-y-1.5 font-sans ${riskColor}`}>
                    <div className="font-bold uppercase tracking-wider text-[10px] block">AKR-Evaluierungsstufe:</div>
                    <div className="font-extrabold text-[12px]">{riskTitle}</div>
                    <p className="text-[11px] leading-relaxed">
                      {riskAdvice}
                    </p>
                    <div className="pt-1.5">
                      <button 
                        type="button" 
                        onClick={() => setBetonShowAKRDetails(!betonShowAKRDetails)}
                        className="text-[10px] font-bold underline hover:opacity-80 cursor-pointer"
                      >
                        {betonShowAKRDetails ? inhalt.werte.zusammenfassungAusblenden : inhalt.werte.technischeErläuterungenEinblenden}
                      </button>
                      {betonShowAKRDetails && (
                        <div className="mt-2 text-[10px] bg-white/60 p-2 rounded border border-current leading-relaxed space-y-1 leading-normal">
                          <div><MdText text={inhalt.texte.chemismusDerAkr} /></div>
                          <div><MdText text={inhalt.texte.t1GelbildungsverfahrenSio2} /></div>
                          <div><MdText text={inhalt.texte.t2VolumendehnungDasGel} /></div>
                          <div><MdText text={inhalt.texte.t3ZerrüttungÜberschreitetDer} /></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
