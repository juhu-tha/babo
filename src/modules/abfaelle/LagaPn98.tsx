import { Search, Scale, AlertTriangle } from 'lucide-react';
import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import React from 'react';
import inhalt from '@/content/abfaelle/LagaPn98.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { pn98Probenzahl } from '@/src/calc/probenahme';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

interface LagaPn98Props {
  pnGrainSize: string;
  pnMaterialState: "homogen" | "heterogen";
  pnVolume: number;
  setPnGrainSize: React.Dispatch<React.SetStateAction<string>>;
  setPnMaterialState: React.Dispatch<React.SetStateAction<"homogen" | "heterogen">>;
  setPnVolume: React.Dispatch<React.SetStateAction<number>>;
}

export default function LagaPn98({ pnGrainSize, pnMaterialState, pnVolume, setPnGrainSize, setPnMaterialState, setPnVolume }: LagaPn98Props) {
    // Calculate LAGA PN 98 limits dynamically
    // LAGA PN 98 (Mitteilung 32), Tabelle 2: Mindestanzahl Einzel-, Misch- und Laborproben
    // (gilt unabhängig von der Homogenität; Reduktion nur bei dokumentierter Vorkenntnis zulässig)
    // Rechenkern src/calc/probenahme.ts (gleiche Tabelle wie im Modul Boden-Materialaufbereitung)
    const proben = pn98Probenzahl(pnVolume);
    const mischproben = proben.mischproben;
    let laborproben = proben.laborproben;
    const einzelproben = proben.einzelproben;
    if (pnMaterialState === 'heterogen') {
      // Heterogenes Material: Tabellenwerte sind Mindestwerte; ggf. Teilmengen bilden (keine Reduktion)
      laborproben = mischproben;
    }

    // Container size constraints based on grain size
    // LAGA PN 98, Tabelle 3: Mindestvolumen Einzel-/Laborprobe nach Größtkorn
    let minVolEinzel = 2.0;
    let minVolVerbund = 4.0;
    let grainLabel = inhalt.werte.grobkörnig20D50;

    if (pnGrainSize === '2') {
      minVolEinzel = 0.5;
      minVolVerbund = 1.0;
      grainLabel = inhalt.werte.feinkörnigD2Mm;
    } else if (pnGrainSize === '8' || pnGrainSize === '16') {
      minVolEinzel = 1.0;
      minVolVerbund = 2.0;
      grainLabel = inhalt.werte.mittelkörnig2D20;
    } else if (pnGrainSize === '32') {
      minVolEinzel = 2.0;
      minVolVerbund = 4.0;
      grainLabel = inhalt.werte.grobkörnig20D502;
    } else if (pnGrainSize === '63') {
      minVolEinzel = 5.0;
      minVolVerbund = 10.0;
      grainLabel = inhalt.werte.sehrGrobkörnig50D;
    } else if (pnGrainSize === '120') {
      minVolEinzel = 5.0;
      minVolVerbund = 10.0;
      grainLabel = inhalt.werte.stückigD120Mm;
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div className="border-b border-home-grau/30 pb-4">
          <h3 className="text-2xl font-bold text-slate-850 flex items-center gap-2">
            <Search className="w-6 h-6 text-emerald-600" /><MdText text={inhalt.texte.probenahmeNachLagaPn} /></h3>
          <p className="text-slate-500 text-sm mt-1"><MdText text={inhalt.texte.bauabfallUndBodendeklarationenErfordern} /></p>
        </div>

        {/* Calculator Grid */}
        <div className="p-5 bg-white border border-home-grau/30 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1"><MdText text={inhalt.texte.interaktiverBeprobungsplaner} /></h4>
              <p className="text-xs text-slate-500 leading-relaxed"><MdText text={inhalt.texte.berechnenSieDasOffizielle} /></p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"><MdText text={inhalt.texte.t1HaufwerksvolumenM} /></label>
                <input aria-label={inhalt.werte.t1HaufwerksvolumenM}
                  type="number"
                  min="1"
                  max="20000"
                  className="w-full text-xs font-mono bg-slate-50 border border-home-grau/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  value={pnVolume}
                  onChange={(e) => setPnVolume(Math.max(1, parseInt(e.target.value) || 0))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"><MdText text={inhalt.texte.t2HomogenitätDesMaterials} /></label>
                <AuswahlGruppe label="Homogenität des Materials" className="grid grid-cols-2 gap-2">
                  <button {...alsOption(pnMaterialState === 'homogen')}
                    type="button"
                    onClick={() => setPnMaterialState('homogen')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              pnMaterialState === 'homogen'
                                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                                : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                            }`}
                  >
                    Homogen
                    <span className="block text-xs opacity-80 font-normal mt-0.5"><MdText text={inhalt.texte.zBReinerAsphalt} /></span>
                  </button>
                  <button {...alsOption(pnMaterialState === 'heterogen')}
                    type="button"
                    onClick={() => setPnMaterialState('heterogen')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              pnMaterialState === 'heterogen'
                                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                                : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                            }`}
                  >
                    Heterogen
                    <span className="block text-xs opacity-80 font-normal mt-0.5"><MdText text={inhalt.texte.zBBauschuttHausmüll} /></span>
                  </button>
                </AuswahlGruppe>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"><MdText text={inhalt.texte.t3GrößtkornDMm} /></label>
                <select aria-label={inhalt.werte.t3GrößtkornDMm}
                  className="w-full text-xs bg-slate-50 border border-home-grau/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                  value={pnGrainSize}
                  onChange={(e) => setPnGrainSize(e.target.value)}
                >
                  <option value="2">Sand / Feinmaterial (d ≤ 2 mm)</option>
                  <option value="8">Feinkorn / Siebschutt (d ≤ 8 mm)</option>
                  <option value="16">Splitt / mittlerer Schutt (d ≤ 16 mm)</option>
                  <option value="32">Regelfall Bauschutt-Brechergut (d ≤ 32 mm)</option>
                  <option value="63">Grobmaterial / Bahnschotter (50 &lt; d ≤ 120 mm)</option>
                  <option value="120">Stückig / Ungebrochen (d &gt; 120 mm)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider"><MdText text={inhalt.texte.vorgeschriebenerBeprobungsumfangTabelle2} /></h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Einzelproben */}
              <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-500 uppercase"><MdText text={inhalt.texte.anzahlEinzelprobenEp} /></span>
                  <div className="text-3xl font-extrabold text-emerald-800 mt-1">{formatDeWert(einzelproben)}</div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal"><MdText text={inhalt.texte.einzelprobenMüssenGleichmäßigVerteilt} /></p>
                </div>
              </div>

              {/* Card 2: Mischproben */}
              <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-500 uppercase"><MdText text={inhalt.texte.laborMischprobenMp} /></span>
                  <div className="text-3xl font-extrabold text-emerald-800 mt-1">{formatDeWert(mischproben)}</div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal"><MdText text={inhalt.texte.dieEpWerdenZu} />{formatDeWert(mischproben)}<MdText text={inhalt.texte.repräsentativenMischprobeNVereint} /></p>
                </div>
              </div>

              {/* Card 3: Mindestvolumen Einzelprobe */}
              <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-500 uppercase"><MdText text={inhalt.texte.mindestvolumenJeEinzelprobe} /></span>
                  <div className="text-2xl font-extrabold text-slate-800 mt-1">{formatDeWert(minVolEinzel)} Liter <span className="text-xs font-semibold text-slate-500">(≈ {formatDeZahl(minVolEinzel * 1.6, 1)}<MdText text={inhalt.texte.kgBei16} /></span></div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal"><MdText text={inhalt.texte.abhängigVomGrößtkornZu} /></p>
                </div>
              </div>

              {/* Card 4: Mindestvolumen Verbundprobe */}
              <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-500 uppercase">Laborproben-Sollvolumen</span>
                  <div className="text-2xl font-extrabold text-slate-800 mt-1">{formatDeWert(minVolVerbund)} Liter <span className="text-xs font-semibold text-slate-500">(Laborprobe; {formatDeWert(laborproben)} Laborproben)</span></div>
                  <p className="text-xs text-slate-500 mt-1 leading-normal"><MdText text={inhalt.texte.mindestvolumenDerLaborbereitenProbe} /></p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-150 text-xs leading-relaxed text-emerald-950 font-semibold">
              📋 <strong className="text-emerald-900 leading-normal"><MdText text={inhalt.texte.gesamtbilanzFür} />{formatDeWert(pnVolume)} m³ ({pnMaterialState}):</strong><MdText text={inhalt.texte.esMüssenMindestens} /><strong>{formatDeWert(einzelproben)} Einzelproben</strong> à <strong>{formatDeWert(minVolEinzel)} l</strong><MdText text={inhalt.texte.gezogenWerdenDasGesamtgewicht} /><strong>{formatDeZahl(einzelproben * minVolEinzel, 1)} Litern</strong><MdText text={inhalt.texte.mineralischemProbengutUmDaraus} /><strong>{formatDeWert(mischproben)} Laborprobe(n)</strong> zu speisen.
            </div>
          </div>
        </div>

        {/* Legal and methodological guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-wider">
              <Scale className="w-4 h-4 text-slate-500" /><MdText text={inhalt.texte.entscheidendeAbgrenzungLagaPn} /></h4>
            <p className="text-slate-600"><MdText text={inhalt.texte.inAusschreibungenUndPrüfberichten} /></p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600 font-semibold">
              <li><MdText text={inhalt.texte.geltungsbereichBodenErsatzbaustoffeBbods} /></li>
              <li><MdText text={inhalt.texte.geltungsbereichBauschuttDeponienDepv} /></li>
              <li><MdText text={inhalt.texte.dieProbenahmestrategieBeideNormen} /></li>
            </ul>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" /><MdText text={inhalt.texte.landesrechtErleichterteProbenahmen} /></h4>
            <p className="text-slate-600"><MdText text={inhalt.texte.umKleineBaustellenVor} /></p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600 font-semibold">
              <li><MdText text={inhalt.texte.bayerischesLandesamtFürUmwelt} /></li>
              <li><MdText text={inhalt.texte.dasViertelnSchaufelnVerfahren} /></li>
              <li><MdText text={inhalt.texte.gefahrenquelleFalschbeprobungHäufigeUrsa} /></li>
            </ul>
          </div>
        </div>
      </div>
    );
}
