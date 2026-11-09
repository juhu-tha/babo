// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { formatDeZahl, formatDeWert, formatDeGanzzahl } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Calculator, Droplets } from 'lucide-react';
import inhalt from '@/content/bpverkehrswegebau/TiefbauTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { rigole, F_METHODE, type KfMethode } from '@/src/calc/verkehrswegebau';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

/** Bestimmungsmethoden des k_f-Werts (DWA-A 138-1:2024-10, f_Methode vorläufig) */
const METHODEN: readonly (readonly [KfMethode, string])[] = [
  ['feldGross', 'Feldversuch, Testgrube ≥ 1 m²'],
  ['feldKlein', 'Feldversuch, kleine Testgrube'],
  ['doppelring', 'Doppelzylinder-Infiltrometer'],
  ['openEnd', 'Open-End-Test'],
  ['laborUngestoert', 'Labor, ungestörte Probe'],
  ['sieblinie', 'Sieblinie (gestörte Probe)'],
];

export interface TiefbauTabProps {
  setTiefbauArea: React.Dispatch<React.SetStateAction<number>>;
  setTiefbauDuration: React.Dispatch<React.SetStateAction<number>>;
  setTiefbauFss: React.Dispatch<React.SetStateAction<number>>;
  setTiefbauPsi: React.Dispatch<React.SetStateAction<number>>;
  setTiefbauRain: React.Dispatch<React.SetStateAction<number>>;
  tiefbauArea: number;
  tiefbauDuration: number;
  tiefbauFss: number;
  tiefbauPsi: number;
  tiefbauRain: number;
}

export default function TiefbauTab({ setTiefbauArea, setTiefbauDuration, setTiefbauFss, setTiefbauPsi, setTiefbauRain, tiefbauArea, tiefbauDuration, tiefbauFss, tiefbauPsi, tiefbauRain }: TiefbauTabProps) {
  // DWA-A 138-1:2024-10: k_f, Korrekturfaktoren f_Ort und f_Methode, vollständige Durchsickerung (Runde 28.10.)
  const [kf, setKf] = useState<number>(1e-5);
  const [fOrt, setFOrt] = useState<number>(0.5);
  const [methode, setMethode] = useState<KfMethode>('openEnd');
  const [vollDurchsickert, setVollDurchsickert] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Intro */}
      <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Droplets className="text-shiraz" size={18} /><MdText text={inhalt.texte.tiefbauSystemtechnikUrbanDrainage} /></h3>
        <p className="text-xs text-slate-800 leading-relaxed"><MdText text={inhalt.texte.derModerneTiefbauUmfasst} /></p>
      </div>

      {/* SECTION 1: Die 10 Produktwelten des Tief- & Straßenbaus */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-main mb-4 border-b border-zinc-200 pb-1.5"><MdText text={inhalt.texte.iProduktbereicheTechnischeSysteme} /></h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Anschlusssysteme */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span><MdText text={inhalt.texte.t1AnschlusssystemeFormteile} /></span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold"><MdText text={inhalt.texte.dinEn14011} /></span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.gasUndWasserdichteEinbindungen} /></p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li><MdText text={inhalt.texte.übergangskupplungenManschettenMitEdelsta} /></li>
                <li><MdText text={inhalt.texte.sattelstückeAnschlussmuffenNachträgliche} /></li>
                <li><MdText text={inhalt.texte.abzweigElemente45Und} /></li>
              </ul>
            </div>
          </div>

          {/* 2. Drainage & Sickerleitung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span><MdText text={inhalt.texte.t2DrainageBaugrunddränung} /></span>
                <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold"><MdText text={inhalt.texte.din4095Din4262} /></span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.sicheresAbführenVonSchichten} /></p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li><MdText text={inhalt.texte.sickerrohreUndDränleitungenVollsickerroh} /></li>
                <li><MdText text={inhalt.texte.dränageschächteSpülschächteKontrollschäc} /></li>
                <li><MdText text={inhalt.texte.geoverbundstoffeDränmattenMitNoppenbahn} /></li>
              </ul>
            </div>
          </div>

          {/* 3. Regen- & Abwassersysteme */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span><MdText text={inhalt.texte.t3RegenAbwasserKanalisation} /></span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold"><MdText text={inhalt.texte.dinEn1852Din} /></span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.freispiegelleitungenZurGesichertenHydrau} /></p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li><MdText text={inhalt.texte.vollwandKanalrohrePpPvc} /></li>
                <li><MdText text={inhalt.texte.stahlbetonrohreFürSehrGroße} /></li>
                <li><MdText text={inhalt.texte.rückstauverschlüsseKlappensystemeDinEn} /></li>
              </ul>
            </div>
          </div>

          {/* 4. Funktionspflaster */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span><MdText text={inhalt.texte.t4ÖkoprofileFunktionspflaster} /></span>
                <span className="text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-mono font-bold">FGSV M-VV</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.hydraulischOptimierteBetonwarenUnd} /></p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li><MdText text={inhalt.texte.haufwerksporigeSickersteineGefügedichteB} /></li>
                <li><MdText text={inhalt.texte.pflasterMitSickerfugeSteinkonstruktionen} /></li>
                <li><MdText text={inhalt.texte.rasengittersteineHoherGrünflächenanteilF} /></li>
              </ul>
            </div>
          </div>

          {/* 5. Geotextilien */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span><MdText text={inhalt.texte.t5GeomembranenGeotextilien} /></span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold"><MdText text={inhalt.texte.dinEn13249} /></span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.polymerePlanstoffeVlieseGewebe} /></p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li><MdText text={inhalt.texte.filtervlieseMechanischVernadelteEndlosfa} /></li>
                <li><MdText text={inhalt.texte.bewehrungsGeogitterMonofileZugkonstrukti} /></li>
                <li><MdText text={inhalt.texte.bändchengewebeExtremZugfesteGewebebahnen} /></li>
              </ul>
            </div>
          </div>

          {/* 6. Hangbefestigung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span><MdText text={inhalt.texte.t6HangbefestigungAbstützungen} /></span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">Eurocode 7</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.konstruktionenZumAbfangenVon} /></p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li><MdText text={inhalt.texte.mauerscheibenLSteineMonolithische} /></li>
                <li><MdText text={inhalt.texte.gabionenSteinkörbeHochwertigVerzinkte} /></li>
                <li><MdText text={inhalt.texte.böschungsFlorgitterHohlsteineZur} /></li>
              </ul>
            </div>
          </div>

          {/* 7. Kabelschutz */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span><MdText text={inhalt.texte.t7KabelschutzLeitungsrohre} /></span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold"><MdText text={inhalt.texte.dinEn6138624} /></span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.sichereVerlegungVonStrom} /></p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li><MdText text={inhalt.texte.verbundKabelschutzrohrePeHd} /></li>
                <li><MdText text={inhalt.texte.kabelabdeckplattenHaubenWarnendeKunststo} /></li>
                <li><MdText text={inhalt.texte.mehrspartenHauseinführungenGasUnd} /></li>
              </ul>
            </div>
          </div>

          {/* 8. Linien- & Punktentwässerung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span><MdText text={inhalt.texte.t8LinienPunktentwässerung} /></span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold"><MdText text={inhalt.texte.dinEn1433Din} /></span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.schnelleEntwässerungVersiegelterUnd} /></p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li><MdText text={inhalt.texte.entwässerungsrinnenRinnenkörperAusVersch} /></li>
                <li><MdText text={inhalt.texte.hofabläufeStraßenabläufeStandardisierteP} /></li>
                <li><MdText text={inhalt.texte.schlitzrinnenExtremUnauffälligeFlächenbü} /></li>
              </ul>
            </div>
          </div>

          {/* 9. Regenwasser-Bewirtschaftung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span><MdText text={inhalt.texte.t9RegenwasserBewirtschaftung} /></span>
                <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold"><MdText text={inhalt.texte.dwaA138Dwa} /></span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.moderneRegenrückhaltungVersickerungUnd} /></p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li><MdText text={inhalt.texte.füllkörperrigolenPpSickerboxenKubische} /></li>
                <li><MdText text={inhalt.texte.regenwasserrückhaltebeckenZisternenUnter} /></li>
                <li><MdText text={inhalt.texte.koaleszenzabscheiderAbscheideanlagenFürM} /></li>
              </ul>
            </div>
          </div>

          {/* 10. Sanierungsprodukte */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span><MdText text={inhalt.texte.t10SanierungsprodukteImStraßenbau} /></span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">ZTV Fug-StB</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3"><MdText text={inhalt.texte.spezialwerkstoffeZurDauerhaftenInstandse} /></p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li><MdText text={inhalt.texte.bitumenSchmelzbänderRissbänderHeiß} /></li>
                <li><MdText text={inhalt.texte.reparaturmörtelVergussSchachtrahmenRegul} /></li>
                <li><MdText text={inhalt.texte.kaltasphaltReaktivMischgutGesteinsmischu} /></li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: Interactive Rigolen-Rechner & Schachtkomparator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-zinc-200 pt-6">
        
        {/* Rigolenberechnung (Left: Controls, Right: Result) */}
        <div className="lg:col-span-12 bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs">
          <h4 className="font-extrabold text-sm text-text-main mb-2 flex items-center gap-1.5 border-b border-zinc-100 pb-2">
            <Calculator size={16} className="text-shiraz" /><MdText text={inhalt.texte.iiInteraktivesPlanungsMuster} /></h4>
          <p className="text-xs text-text-main/70 leading-relaxed mb-4"><MdText text={inhalt.texte.dieBemessungEinesUnterirdischen} /></p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Controls */}
            <div className="md:col-span-5 bg-off-white p-4 rounded-xl border border-home-grau/20 space-y-4">
              {/* Area */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.angeschlosseneAuffangflächeAE} /></span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeWert(tiefbauArea)} m²</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="2000" 
                  step="10"
                  value={tiefbauArea}
                  onChange={(e) => setTiefbauArea(parseInt(e.target.value))}
                  className="w-full accent-shiraz" 
                />
              </div>

              {/* Runoff coeff */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.abflussbeiwert} /></span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeZahl(tiefbauPsi, 2)}</span>
                </div>
                <select 
                  value={tiefbauPsi}
                  onChange={(e) => setTiefbauPsi(parseFloat(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white"
                >
                  <option value="0.9">0,90 (Asphalt, fugenloser Beton, Metalldach)</option>
                  <option value="0.75">0,75 (Betonpflaster mit dichten Fugen)</option>
                  <option value="0.5">0,50 (Kiesbelag, Kiesdach)</option>
                  <option value="0.3">0,30 (Gründach, unbefestigter Boden)</option>
                </select>
              </div>

              {/* Rain intensity */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.bemessungsregenIntensitätRD} /></span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeWert(tiefbauRain)} l/(s·ha)</span>
                </div>
                <input 
                  type="range" 
                  min="80" 
                  max="500" 
                  step="10"
                  value={tiefbauRain}
                  onChange={(e) => setTiefbauRain(parseInt(e.target.value))}
                  className="w-full accent-shiraz" 
                />
              </div>

              {/* Duration */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main border-none">
                  <span><MdText text={inhalt.texte.regendauerTD} /></span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeWert(tiefbauDuration)} min</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="60" 
                  step="5"
                  value={tiefbauDuration}
                  onChange={(e) => setTiefbauDuration(parseInt(e.target.value))}
                  className="w-full accent-shiraz" 
                />
              </div>

              {/* Storage Type Coefficient */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main border-none">
                  <span><MdText text={inhalt.texte.sickerelementTypSpeichereffizienz} /></span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeZahl((tiefbauFss * 100), 0)}% Hohlraum</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => setTiefbauFss(0.95)}
                    className={`py-1.5 px-2 text-[11px] rounded-md font-bold border transition-all ${
                      tiefbauFss === 0.95
                        ? 'bg-shiraz text-white border-shiraz shadow-md'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    Kunststoff-Sickerbox
                  </button>
                  <button
                    onClick={() => setTiefbauFss(0.30)}
                    className={`py-1.5 px-2 text-[11px] rounded-md font-bold border transition-all ${
                      tiefbauFss === 0.30
                        ? 'bg-shiraz text-white border-shiraz shadow-md'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    Kies-/Schotterbett
                  </button>
                </div>
              </div>

              {/* Boden: k_f und Korrekturfaktoren nach DWA-A 138-1 */}
              <div className="space-y-1">
                <label htmlFor="rigole-kf" className="flex justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.rigoleKfLabel} /></span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeZahl(kf * 1e5, 1)}·10⁻⁵ m/s</span>
                </label>
                <select id="rigole-kf" value={kf} onChange={(e) => setKf(parseFloat(e.target.value))} className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white">
                  <option value="1e-4">1·10⁻⁴ m/s (Sand, kiesig)</option>
                  <option value="5e-5">5·10⁻⁵ m/s (Mittelsand)</option>
                  <option value="1e-5">1·10⁻⁵ m/s (Feinsand)</option>
                  <option value="5e-6">5·10⁻⁶ m/s (schluffiger Sand)</option>
                  <option value="1e-6">1·10⁻⁶ m/s (sandiger Schluff)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="rigole-fort" className="flex justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.rigoleFOrtLabel} /></span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeZahl(fOrt, 1)}</span>
                </label>
                <select id="rigole-fort" value={fOrt} onChange={(e) => setFOrt(parseFloat(e.target.value))} className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white">
                  <option value="0.3">0,3 (Mindestwert, z. B. ein einzelner Versuch)</option>
                  <option value="0.5">0,5</option>
                  <option value="0.7">0,7</option>
                  <option value="1">1,0 (Höchstwert, gut erkundeter homogener Boden)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="rigole-methode" className="flex justify-between text-xs font-semibold text-text-main">
                  <span><MdText text={inhalt.texte.rigoleFMethodeLabel} /></span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeZahl(F_METHODE[methode], 1)}</span>
                </label>
                <select id="rigole-methode" value={methode} onChange={(e) => setMethode(e.target.value as KfMethode)} className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white">
                  {METHODEN.map(([id, name]) => <option key={id} value={id}>{name} ({formatDeZahl(F_METHODE[id], 1)})</option>)}
                </select>
              </div>
              <label className="flex items-start gap-2 text-xs text-text-main cursor-pointer">
                <input type="checkbox" checked={vollDurchsickert} onChange={(e) => setVollDurchsickert(e.target.checked)} className="mt-0.5 accent-shiraz" />
                <span><MdText text={inhalt.texte.rigoleVollDurchsickert} /></span>
              </label>

            </div>

            {/* Calculations and visualization */}
            {(() => {
              // Rechenkern src/calc/verkehrswegebau.ts (Rigole, vereinfachtes Verfahren DWA-A 138-1:2024-10, f_Z = 1,2, Rigole 1,2 m × 0,6 m)
              const rig = rigole({ flaecheM2: tiefbauArea, psi: tiefbauPsi, regenspende: tiefbauRain, dauerMin: tiefbauDuration, speicherKoeff: tiefbauFss, kf, fOrt, fMethode: F_METHODE[methode], vollDurchsickert });
              const a_red = rig.aRed;
              const q_in = rig.qZu; // l/s
              const v_zu_m3 = rig.vZu; // m³
              const a_s = rig.aS; // m² (Sohle + Seiten + Stirn)
              const q_sicker_l_s = rig.qSicker; // l/s
              const v_sicker_m3 = rig.vSicker;
              // Bruttovolumen der Rigole (Füllkörper bzw. Kies inkl. Feststoff): V_R = L · b · h
              const v_speicher_m3 = rig.vRigole;
              const v_nutz_m3 = rig.vNutz; // speicherwirksames Porenvolumen
              const l_rig = rig.laengeM;
              const num_boxes = rig.boxen;

              return (
                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Zufluss-Details */}
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                      <span className="text-[10px] uppercase font-mono font-bold text-zinc-500"><MdText text={inhalt.texte.hydraulischerZufluss} /></span>
                      <div className="text-xl font-bold text-zinc-900 font-mono mt-1">{formatDeZahl(v_zu_m3, 2)} m³</div>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-1 w-full"><MdText text={inhalt.texte.spitzenzuflussrateQInBeträgt} /><strong className="font-mono">{formatDeZahl(q_in, 1)} l/s</strong><MdText text={inhalt.texte.überDieReduzierteAuffangfläche} />{formatDeZahl(a_red, 0)} m².
                      </p>
                    </div>

                    {/* Sicker-Details */}
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                      <span className="text-[10px] uppercase font-mono font-bold text-zinc-500">Boden-Infiltration</span>
                      <div className="text-xl font-bold text-zinc-900 font-mono mt-1">{formatDeZahl(v_sicker_m3, 3)} m³</div>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-1 w-full"><MdText text={inhalt.texte.infiltrationÜberSohleA} />{formatDeZahl(a_s, 1)}<MdText text={inhalt.texte.mBeiSandSchluff} />{formatDeZahl(rig.ki * 1e6, 1)}·10⁻⁶ m/s (f_K = {formatDeZahl(rig.fK, 2)}): <strong className="font-mono">{formatDeZahl(q_sicker_l_s, 3)} l/s</strong>.
                      </p>
                    </div>

                  </div>

                  {/* Speicher-Ergebnis */}
                  <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-shiraz"><MdText text={inhalt.texte.erforderlichesRigolenBruttovolumenV} /></span>
                        <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">{formatDeZahl(v_speicher_m3, 2)} m³</div>
                      </div>
                      <div className="text-right text-[10px] text-slate-800 font-mono">
                        <div><MdText text={inhalt.texte.dwaA138Planungsentwurf} /></div>
                        <div><MdText text={inhalt.texte.sicherheitsbeiwertFS1} /></div>
                      </div>
                    </div>

                    {/* Statisches Resultat / Empfehlung */}
                    <div className="border-t border-home-grau/30 pt-3 mt-3 text-xs leading-relaxed text-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="font-bold"><MdText text={inhalt.texte.konstruktiveEmpfehlung} /></p>
                        {tiefbauFss === 0.95 ? (
                          <p className="text-[11px] mt-0.5 text-slate-900 font-medium"><MdText text={inhalt.texte.verwendungVonPpSickerboxen} /><span className="font-mono font-bold text-slate-800">{formatDeGanzzahl(num_boxes)} Standard-Sickerboxen</span><MdText text={inhalt.texte.t024mNutzkapazitätJe} /></p>
                        ) : (
                          <p className="text-[11px] mt-0.5 text-slate-900 font-medium"><MdText text={inhalt.texte.verwendungEinesKiesgrabensKörnung} /><span className="font-mono font-bold text-slate-800">{formatDeZahl(v_speicher_m3, 1)} m³</span><MdText text={inhalt.texte.davonSpeicherwirksamPorenraumCa} /><span className="font-mono font-bold text-slate-800">{formatDeZahl(v_nutz_m3, 1)} m³</span>.
                          </p>
                        )}
                      </div>
                      <div className="font-mono text-[11px] bg-white/60 p-2.5 rounded border border-home-grau/30 flex flex-col justify-center">
                        <div>Höhe h: <span className="font-bold">0,60 m</span></div>
                        <div>Breite b: <span className="font-bold">1,20 m</span></div>
                        <div><MdText text={inhalt.texte.erforderlicheLänge} /><span className="font-bold text-slate-800">{formatDeZahl(l_rig, 2)} m</span></div>
                      </div>
                    </div>
                  </div>
                  <EingabeHinweise hinweise={rig.hinweise} />
                  <ErgebnisAnsage text={kurzzeile(ansageWert('Rigole: erforderliche Länge', l_rig, 2, 'm'), ansageWert('Zufluss', q_in, 2, 'l/s'), ansageWert('Versickerung', q_sicker_l_s, 2, 'l/s'))} />

                  {/* Formel-Herleitung */}
                  <div className="p-3 text-[10.5px] text-text-main/60 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <span className="font-bold text-text-main block mb-1"><MdText text={inhalt.texte.dwaA138Speicherbemessungsgleichung} /></span>
                    <FormulaText text="L = \frac{A_u \cdot 10^{-7} \cdot r_D - 2 \cdot b \cdot h_w \cdot k_i}{\frac{b \cdot h \cdot s_R}{D \cdot 60 \cdot f_Z} + (b + 2 h_w) \cdot k_i}, \quad k_i = f_{Ort} \cdot f_{Methode} \cdot k_f" />
                    <span className="text-[10px] block mt-1 leading-normal"><MdText text={inhalt.texte.hierbeiStehtSR} /></span>
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
