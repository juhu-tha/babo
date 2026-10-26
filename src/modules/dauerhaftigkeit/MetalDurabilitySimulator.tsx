// Ausgelagert aus src/modules/Dauerhaftigkeit.tsx (AP 5.2)
import { useState } from 'react';
import { Layers, Zap, AlertTriangle, Check, AlertCircle } from 'lucide-react';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import inhalt from '@/content/dauerhaftigkeit/MetalDurabilitySimulator.json';
import { MdText } from '@/src/components/inhalt/MdText';

export function MetalDurabilitySimulator() {
  const [targetClass, setTargetClass] = useState<string>('C3');
  const [years, setYears] = useState<number>(15);
  const [showMetalPath, setShowMetalPath] = useState<boolean>(false);
  
  // Bimetall State
  const [metalA, setMetalA] = useState<string>('verzinkt'); // großflächige Platte
  const [metalB, setMetalB] = useState<string>('edelstahl'); // Schraube
  const [environment, setEnvironment] = useState<string>('moist'); // Feuchtespeicher

  // ISO 12944 corrosion category values inside unalloyed steel & zinc (micro-meter layer loss in year 1)
  const isoData: Record<string, { label: string; steelLoss: number; zincLoss: number; desc: string }> = inhalt.daten["MetalDurabilitySimulator.isoData"];

  const chosen = isoData[targetClass] || isoData.C3;
  const totalSteelLoss = chosen.steelLoss * years;
  const totalZincLoss = chosen.zincLoss * years;

  // Galvanic connections ratings matrix
  const getBimetalRating = () => {
    if (environment === 'dry') {
      return {
        label: 'Unbedenklich',
        color: 'bg-slate-50 border-home-grau/30 text-slate-800',
        icon: Check,
        desc: inhalt.werte.inTrockenenInnenbereichenFindet
      };
    }

    if (metalA === metalB) {
      return {
        label: 'Unbedenklich',
        color: 'bg-slate-50 border-home-grau/30 text-slate-800',
        icon: Check,
        desc: inhalt.werte.homogeneVerbindungAusIdentischen
      };
    }

    // Small screw/fastener is Metal B, large plate/component is Metal A.
    // RULE 1: Stainless steel fastener (Edelstahl B) in large Zinc, Aluminium, or Baustahl
    if (metalB === 'edelstahl') {
      return {
        label: inhalt.werte.geringesBisMäßigesRisiko,
        color: 'bg-slate-100/50 border-home-grau/30 text-slate-800',
        icon: AlertCircle,
        desc: inhalt.werte.klassischeMontageausnahmeDasEdle
      };
    }

    // RULE 2: Copper fastener (Kupfer B) in anything unnoble
    if (metalB === 'kupfer') {
      return {
        label: inhalt.werte.kritischesRisikoAbsolutesNo,
        color: 'bg-rose-50 border-shiraz/20 text-slate-900',
        icon: AlertTriangle,
        desc: inhalt.werte.schraubverbindungVerbotenDasEdle
      };
    }

    // RULE 3: Unnoble fastener in stainless steel components (Large stainless plate, small regular iron screw)
    if (metalA === 'edelstahl' && (metalB === 'baustahl' || metalB === 'verzinkt')) {
      return {
        label: inhalt.werte.extremesVersagensrisikoSichererBruch,
        color: 'bg-rose-50 border-shiraz/35 text-shiraz font-bold',
        icon: AlertTriangle,
        desc: inhalt.werte.gefährlicheKonstellationDieUnedle
      };
    }

    // Aluminum fastener on copper
    if (metalA === 'kupfer' && metalB === 'aluminium') {
      return {
        label: inhalt.werte.kritischesRisikoNoGo,
        color: 'bg-rose-50 border-shiraz/30 text-slate-950',
        icon: AlertTriangle,
        desc: inhalt.werte.aluminiumNieteOderSchrauben
      };
    }

    // Baustahl fastener in Verzinkt / Aluminium
    return {
      label: inhalt.werte.mäßigesRisiko,
      color: 'bg-slate-100/70 border-home-grau/30 text-slate-800',
      icon: AlertCircle,
      desc: inhalt.werte.mäßigePotentialdifferenzUnverzinkteStahl
    };
  };

  const rating = getBimetalRating();
  const RatingIcon = rating.icon;

  return (
    <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm mt-6 space-y-6">
      
      {/* Teil 1: Abtragsraten nach ISO 12944 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Layers className="text-shiraz w-5 h-5" />
          <h4 className="font-bold text-slate-850 text-sm sm:text-base"><MdText text={inhalt.texte.dinEnIso12944} /></h4>
        </div>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed"><MdText text={inhalt.texte.stahlUndZinkKorrodieren} /></p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          <div className="space-y-3.5">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider"><MdText text={inhalt.texte.luftreinheitsKlasseIso12944} /></span>
              <select aria-label={inhalt.werte.luftreinheitsKlasseIso12944}
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-800"
              >
                {Object.keys(isoData).map((k) => (
                  <option key={k} value={k}>{isoData[k].label}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Betrachtungszeitraum</span>
                <span className="font-mono text-slate-900 font-bold">{years} Jahre</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="w-full accent-shiraz"
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-50 border border-home-grau/30 p-4 rounded-xl flex flex-col gap-3">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider"><MdText text={inhalt.texte.gerechneterSubstanzverlust} /></span>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-2.5 rounded border border-home-grau/30 text-center">
                <span className="text-xs block text-slate-500 font-semibold mb-0.5"><MdText text={inhalt.texte.baustahlUnlegiert} /></span>
                <span className="text-base font-black text-shiraz font-mono">
                  {formatDeZahl(totalSteelLoss / 1000, 3)} mm
                </span>
                <span className="text-xs text-slate-400 block mt-0.5 font-mono">({formatDeWert(totalSteelLoss)} μm Verlust)</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-home-grau/30 text-center">
                <span className="text-xs block text-slate-500 font-semibold mb-0.5">Zinkbeschichtung</span>
                <span className="text-base font-black text-slate-700 font-mono">
                  {formatDeZahl(totalZincLoss, 1)} μm
                </span>
                <span className="text-xs text-slate-400 block mt-0.5 font-mono">({formatDeZahl(80 / chosen.zincLoss, 0)}<MdText text={inhalt.texte.aSchutzzeitBei80} /></span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-normal italic">
              * {chosen.desc}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-home-grau/30" />

      {/* Teil 2: Bimetall / Galvanischer Prüfer */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="text-shiraz w-5 h-5" />
          <h4 className="font-bold text-slate-850 text-sm sm:text-base"><MdText text={inhalt.texte.bimetallVerträglichkeitsPrüferDin} /></h4>
        </div>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed"><MdText text={inhalt.texte.wirdEinEdleresMetall} /></p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider"><MdText text={inhalt.texte.großteilZBBlech} /></span>
              <select aria-label={inhalt.werte.großteilZBBlech}
                value={metalA}
                onChange={(e) => setMetalA(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-800"
              >
                <option value="baustahl">Unlegierter Baustahl</option>
                <option value="verzinkt">Feuerverzinkter Stahl</option>
                <option value="aluminium">Aluminium</option>
                <option value="kupfer">Kupfer</option>
                <option value="edelstahl">Edelstahl</option>
              </select>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider"><MdText text={inhalt.texte.verbindungsmittelSchraubeNiet} /></span>
              <select aria-label={inhalt.werte.verbindungsmittelSchraubeNiet}
                value={metalB}
                onChange={(e) => setMetalB(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-800"
              >
                <option value="baustahl">Baustahlschraube</option>
                <option value="verzinkt">Verzinkte Schraube</option>
                <option value="aluminium">Aluminiumschraube</option>
                <option value="kupfer">Kupfernagel / Kupferschraube</option>
                <option value="edelstahl">Edelstahlschraube (A2/A4)</option>
              </select>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider"><MdText text={inhalt.texte.feuchtigkeitUmgebung} /></span>
              <select aria-label={inhalt.werte.feuchtigkeitUmgebung}
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-home-grau/30 rounded-lg text-slate-800"
              >
                <option value="dry">Trockener Innenraum (C1)</option>
                <option value="moist">Standard-Aussenbereich (C3)</option>
                <option value="marine">Nassraum / Salznebel (C4/C5)</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Montage-Freigabebewertung</span>
            <div className={`p-4 rounded-xl border flex gap-3 ${rating.color}`}>
              <div className="shrink-0 pt-0.5">
                <RatingIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wide">
                  {rating.label}
                </p>
                <p className="text-xs leading-relaxed">
                  {rating.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible calculation path */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <button
          onClick={() => setShowMetalPath(!showMetalPath)}
          className="text-xs font-bold text-shiraz hover:text-shiraz/80 flex items-center gap-1.5 cursor-pointer transition-all focus:outline-none"
        >
          <span>{showMetalPath ? inhalt.werte.formelnKorrosionsschritteAusblenden : inhalt.werte.formelnInteraktiverKorrosionswegSchritt}</span>
        </button>
        {showMetalPath && (
          <div className="mt-3 bg-stone-50 border border-slate-200 rounded-xl p-4 space-y-4 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2">
            <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <span><MdText text={inhalt.texte.korrosionsschritteGalvanischerLeitfaden} /></span>
            </h5>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <p className="font-semibold text-slate-850"><MdText text={inhalt.texte.schritt1RechnerischerAbtrag} />{formatDeWert(totalSteelLoss)} μm)</p>
                <p className="text-slate-650 leading-relaxed"><MdText text={inhalt.texte.nachDinEnIso} /><strong>{targetClass}</strong><MdText text={inhalt.texte.beträgtDieserImErsten} />{formatDeWert(chosen.steelLoss)} μm/a. Über {years}<MdText text={inhalt.texte.jahreRechnetManLinear} /></p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-slate-800 font-bold my-1 text-xs">
                  d_loss = {formatDeWert(chosen.steelLoss)} μm/a · {years} Jahre = {formatDeWert(totalSteelLoss)} μm ({formatDeZahl(totalSteelLoss / 1000, 3)} mm)
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-850"><MdText text={inhalt.texte.schritt2RechnerischerZinkabtrag} />{formatDeWert(totalZincLoss)} μm)</p>
                <p className="text-slate-500 leading-relaxed"><MdText text={inhalt.texte.zinkBesitztEineErheblich} />{formatDeWert(chosen.zincLoss)}<MdText text={inhalt.texte.mABeiEiner} /></p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-center text-slate-800 font-bold my-1 text-xs"><MdText text={inhalt.texte.tSchutz80M} />{formatDeZahl(chosen.zincLoss, 1)} μm/a = {formatDeZahl(80 / chosen.zincLoss, 1)}<MdText text={inhalt.texte.jahreSchutzdauer} /></div>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-850"><MdText text={inhalt.texte.schritt3BimetallVerbindung} /></p>
                <p className="text-slate-650 leading-relaxed text-xs"><MdText text={inhalt.texte.dasRisikoAusKontaktkorrosion} /></p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-850"><MdText text={inhalt.texte.schritt4KorrosionsminderndeVorkehrungen} /></p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                  <li><MdText text={inhalt.texte.galvanischeEntkopplungVerwendungNicht} /></li>
                  <li><MdText text={inhalt.texte.katodischeOpferbarrierenEinsatzOpferbere} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
