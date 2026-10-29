import { History, Sparkles } from 'lucide-react';
import { formatDeZahl, formatDeTeX, formatDeWert, formatDeTeXWert } from '@/src/utils/numberFormat';
import { BlockMath, InlineMath } from 'react-katex';
import React from 'react';
import inhalt from '@/content/beispielrechnungen/RechnungBestand.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../../components/ui/Auswahlgruppe';
import { ALTBETON_ZUORDNUNG, KP_CM2_IN_N_MM2, type AltbetonKlasse, type AltbetonZuordnung } from '@/src/data/kennwerte';
import type { InsituErgebnis } from '@/src/calc/bauwerksuntersuchung';

interface RechnungBestandProps {
  bestandSubTab: "beton" | "stahl";
  altbeton: AltbetonZuordnung;
  altbetonGrenze: 'unten' | 'oben';
  setAltbetonGrenze: React.Dispatch<React.SetStateAction<'unten' | 'oben'>>;
  fckTabelle: number | null;
  klasseTabelle: string | null;
  insitu: InsituErgebnis;
  kernAnzahl: number;
  setKernAnzahl: React.Dispatch<React.SetStateAction<number>>;
  kernStreuung: number;
  setKernStreuung: React.Dispatch<React.SetStateAction<number>>;
  kernKleinster: number;
  setKernKleinster: React.Dispatch<React.SetStateAction<number>>;
  diameterStahl: number;
  f_cd_bestand: number | null;
  f_ck_final: number | null;
  f_yd_stahl: number;
  f_yk_stahl: number;
  hasPruefung: boolean;
  histBetonKlasse: AltbetonKlasse;
  histStahlKlasse: "BSt220" | "BSt420" | "BSt500";
  pruefFestigkeit: number;
  setBestandSubTab: React.Dispatch<React.SetStateAction<"beton" | "stahl">>;
  setDiameterStahl: React.Dispatch<React.SetStateAction<number>>;
  setHasPruefung: React.Dispatch<React.SetStateAction<boolean>>;
  setHistBetonKlasse: React.Dispatch<React.SetStateAction<AltbetonKlasse>>;
  setHistStahlKlasse: React.Dispatch<React.SetStateAction<"BSt220" | "BSt420" | "BSt500">>;
  setPruefFestigkeit: React.Dispatch<React.SetStateAction<number>>;
  steelArea: number;
  yieldCapacity: number;
}

const KLASSEN = Object.keys(ALTBETON_ZUORDNUNG) as AltbetonKlasse[];
const klasseText = (k: string | null) => k ?? '–';

/** Schieberegler mit Beschriftung und Wertanzeige */
function Regler({ label, wert, einheit, min, max, step, setze }: { label: string; wert: number; einheit: string; min: number; max: number; step: number; setze: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-bold">
        <span className="text-slate-700"><MdText text={label} /></span>
        <span className="text-shiraz">{formatDeWert(wert)}{einheit}</span>
      </div>
      <input type="range" aria-label={label} min={min} max={max} step={step} value={wert}
        onChange={(e) => setze(parseFloat(e.target.value))} className="w-full accent-shiraz" />
    </div>
  );
}

export default function RechnungBestand({ bestandSubTab, altbeton, altbetonGrenze, setAltbetonGrenze, fckTabelle, klasseTabelle, insitu, kernAnzahl, setKernAnzahl, kernStreuung, setKernStreuung, kernKleinster, setKernKleinster, diameterStahl, f_cd_bestand, f_ck_final, f_yd_stahl, f_yk_stahl, hasPruefung, histBetonKlasse, histStahlKlasse, pruefFestigkeit, setBestandSubTab, setDiameterStahl, setHasPruefung, setHistBetonKlasse, setHistStahlKlasse, setPruefFestigkeit, steelArea, yieldCapacity }: RechnungBestandProps) {
  const betaW = altbeton.kpCm2 * KP_CM2_IN_N_MM2;
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">
        {/* SUB-TABS */}
        <ReiterLeiste label="Beispielrechnungen Bestand" className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
          <button {...alsReiter(bestandSubTab === 'beton', 'rechnung-bestand', 'beton')}
            onClick={() => setBestandSubTab('beton')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  bestandSubTab === 'beton'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
          ><MdText text={inhalt.texte.t1HistorischerBetonDin} /></button>
          <button {...alsReiter(bestandSubTab === 'stahl', 'rechnung-bestand', 'stahl')}
            onClick={() => setBestandSubTab('stahl')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  bestandSubTab === 'stahl'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
          ><MdText text={inhalt.texte.t2HistorischerBetonstahlRu} /></button>
        </ReiterLeiste>

        {bestandSubTab === 'beton' && (
          <div {...reiterPanel('rechnung-bestand', bestandSubTab)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <History className="text-shiraz" size={16} /><MdText text={inhalt.texte.historischeBetongüteNachweisart} /></h3>

                {/* Betonklasse (T15-BS-4: B 120 … B 300, B 450/B 600 als Spannbeton) */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.historischeFestigkeitsklasseDin1045} /></label>
                  <select aria-label={inhalt.werte.historischeFestigkeitsklasseDin1045}
                    value={histBetonKlasse}
                    onChange={(e) => setHistBetonKlasse(e.target.value as AltbetonKlasse)}
                    className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    {KLASSEN.map(k => {
                      const z = ALTBETON_ZUORDNUNG[k];
                      return <option key={k} value={k}>{z.label} ({formatDeWert(z.kpCm2)} kp/cm² ≈ {formatDeZahl(z.kpCm2 * KP_CM2_IN_N_MM2, 1)} N/mm²){z.spannbeton ? ` – ${inhalt.werte.spannbetonKennzeichnung}` : ''}</option>;
                    })}
                  </select>
                  <span className="text-xxs text-slate-500 block"><MdText text={inhalt.texte.damalsGemessenAnPrüfwürfeln} /></span>
                </div>

                {!hasPruefung && !altbeton.spannbeton && (
                  <div className="space-y-2 text-xs">
                    <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.ausfuehrungsqualitaet} /></label>
                    <select aria-label={inhalt.werte.ausfuehrungsqualitaet}
                      value={altbetonGrenze}
                      onChange={(e) => setAltbetonGrenze(e.target.value as 'unten' | 'oben')}
                      className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
                    >
                      <option value="unten">{inhalt.werte.grenzeUnten}</option>
                      <option value="oben">{inhalt.werte.grenzeOben}</option>
                    </select>
                  </div>
                )}

                {/* Checkbox for testing */}
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasPruefung"
                    checked={hasPruefung}
                    onChange={(e) => setHasPruefung(e.target.checked)}
                    className="rounded accent-shiraz cursor-pointer"
                  />
                  <label htmlFor="hasPruefung" className="text-xs font-bold text-slate-700 cursor-pointer select-none"><MdText text={inhalt.texte.bauwerksprüfungDurchgeführtZerstörendeKe} /></label>
                </div>

                {hasPruefung && (
                  <div className="space-y-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-150 animate-in slide-in-from-top-2 duration-200">
                    <Regler label={inhalt.texte.kernAnzahl} wert={kernAnzahl} einheit="" min={8} max={30} step={1} setze={setKernAnzahl} />
                    <Regler label={inhalt.texte.mittlerePrüffestigkeit150mmWürfel} wert={pruefFestigkeit} einheit=" N/mm²" min={10} max={70} step={0.5} setze={setPruefFestigkeit} />
                    <Regler label={inhalt.texte.kernStreuung} wert={kernStreuung} einheit=" N/mm²" min={0} max={8} step={0.1} setze={setKernStreuung} />
                    <Regler label={inhalt.texte.kernKleinster} wert={kernKleinster} einheit=" N/mm²" min={5} max={70} step={0.5} setze={setKernKleinster} />
                    <span className="text-xxs text-slate-500 block"><MdText text={inhalt.texte.mittlererWertFCm} /></span>
                  </div>
                )}
              </div>

              {/* Gemeinsame Zuordnungstabelle (T15-BS-3) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.zuordnungstabelleTitel} /></h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600">
                        <th scope="col" className="py-1.5 pr-2 font-bold">{inhalt.werte.spalteGuete}</th>
                        <th scope="col" className="py-1.5 pr-2 font-bold">{inhalt.werte.spalteUnten}</th>
                        <th scope="col" className="py-1.5 font-bold">{inhalt.werte.spalteOben}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {KLASSEN.map(k => {
                        const z = ALTBETON_ZUORDNUNG[k];
                        return (
                          <tr key={k} className={`border-b border-slate-100 ${k === histBetonKlasse ? 'bg-shiraz/5 font-bold' : ''}`}>
                            <th scope="row" className="py-1.5 pr-2 font-bold text-slate-800">{z.label}</th>
                            {z.spannbeton ? (
                              <td colSpan={2} className="py-1.5 text-slate-600">{inhalt.werte.spannbetonKennzeichnung}</td>
                            ) : (
                              <>
                                <td className="py-1.5 pr-2">{formatDeZahl(z.fckUnten, 1)} N/mm² · {klasseText(z.klasseUnten)}</td>
                                <td className="py-1.5">{formatDeZahl(z.fckOben, 1)} N/mm² · {klasseText(z.klasseOben)}</td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xxs text-slate-500"><MdText text={inhalt.texte.zuordnungstabelleQuelle} /></p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.umrechnungNachDafstbRichtlinie} /></h3>

                <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal font-sans">
                  {!hasPruefung ? (
                    <>
                      <div><MdText text={inhalt.texte.schritt1NormierungDes} /><p className="mt-1 text-xxs"><MdText text={inhalt.texte.dieHistorischeKantenlängeVon} /></p>
                        <BlockMath math={`\\beta_{W,200} = ${formatDeTeXWert(altbeton.kpCm2)}\\,\\text{kp/cm}^2 \\cdot 0{,}0981 = \\color{#A3113E}{${formatDeTeX(betaW, 2)}} \\, \\text{N/mm}^2`} />
                      </div>
                      <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt2UmrechnungAuf} />
                        {altbeton.spannbeton || fckTabelle === null ? (
                          <p className="mt-1 text-xxs text-red-700"><MdText text={inhalt.texte.keineZuordnungSpannbeton} /></p>
                        ) : (
                          <>
                            <p className="mt-1 text-xxs"><MdText text={altbetonGrenze === 'unten' ? inhalt.texte.zuordnungUnten : inhalt.texte.zuordnungOben} /></p>
                            <BlockMath math={`f_{ck} = \\color{#A3113E}{${formatDeTeX(fckTabelle, 1)}} \\, \\text{N/mm}^2`} />
                            <p className="text-xxs"><MdText text={inhalt.texte.zuordnungKlasseTabelle} /><strong>{klasseTabelle ?? inhalt.werte.unterC8}</strong></p>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div><MdText text={inhalt.texte.schritt3EinstufungNach} /><p className="mt-1 text-xxs"><MdText text={inhalt.texte.insituFormelText} /></p>
                        <BlockMath math={`f_{ck,is} = \\min\\left(f_{m,is} - k_n \\cdot s;\\; f_{is,lowest} + M\\right)`} />
                        {insitu.gueltig ? (
                          <BlockMath math={`f_{ck,is} = \\min\\left(${formatDeTeX(pruefFestigkeit, 1)} - ${formatDeTeX(insitu.kn, 2)} \\cdot ${formatDeTeX(kernStreuung, 1)};\\; ${formatDeTeX(kernKleinster, 1)} + ${formatDeTeXWert(insitu.M)}\\right) = \\color{#A3113E}{${formatDeTeX(insitu.fckIs, 1)}} \\, \\text{N/mm}^2`} />
                        ) : (
                          <ul className="mt-1 text-xxs text-red-700 list-disc pl-4">{insitu.hinweise.filter(x => x.stufe === 'fehler').map(x => <li key={x.feld}>{x.text}</li>)}</ul>
                        )}
                      </div>
                      {insitu.gueltig && (
                        <div className="border-t border-slate-100 pt-3 bg-green-50/50 p-2.5 rounded-lg border border-green-150"><MdText text={inhalt.texte.schritt3bKlasse} /><p className="mt-1 text-xxs text-green-800">
                            {insitu.klasse ? (
                              <><InlineMath math={`f_{ck,is} = ${formatDeTeX(insitu.fckIs, 1)} \\ge 0{,}85 \\cdot f_{ck,cube} = ${formatDeTeX(0.85 * insitu.fckCube, 2)} \\, \\text{N/mm}^2`} /><MdText text={inhalt.texte.zuordnungZurFestigkeitsklasse} /><strong>{insitu.klasse}</strong> (<InlineMath math={`f_{ck} = ${insitu.fck} \\, \\text{N/mm}^2`} />)</>
                            ) : (
                              <><MdText text={inhalt.texte.zuordnungKlasseTabelle} /><strong>{inhalt.werte.unterC8}</strong></>
                            )}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt4HeutigerBemessungswert} /><p className="mt-1 text-xxs"><MdText text={inhalt.texte.derBemessungswertFürDie} /></p>
                    {f_ck_final !== null && f_cd_bestand !== null ? (
                      <BlockMath math={`f_{cd} = \\alpha_{cc} \\cdot \\frac{f_{ck}}{\\gamma_C} = 0{,}85 \\cdot \\frac{\\color{#A3113E}{${formatDeTeX(f_ck_final, 1)}}}{1{,}5} = \\color{#A3113E}{${formatDeTeX(f_cd_bestand, 2)}} \\, \\text{N/mm}^2`} />
                    ) : (
                      <p className="mt-1 text-xxs text-red-700"><MdText text={inhalt.texte.keinBemessungswert} /></p>
                    )}
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl text-xs leading-relaxed font-normal ${
                    hasPruefung ? 'bg-green-50 border border-green-200 text-green-950' : 'bg-amber-50 border border-amber-200 text-amber-950'
                  }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                  <Sparkles size={16} />
                  <span><MdText text={inhalt.texte.tragfähigkeitsPotenzialImBestand} /></span>
                </div>
                <p><MdText text={inhalt.texte.derBemessungswertDerBetondruckfestigkeit} /><strong>{f_cd_bestand !== null ? `${formatDeZahl(f_cd_bestand, 2)} N/mm²` : '–'}</strong>.
                </p>
                {hasPruefung ? (
                  <p className="text-xxs opacity-95 mt-1"><MdText text={inhalt.texte.durchDieDurchführungVon} /></p>
                ) : (
                  <p className="text-xxs opacity-95 mt-1"><MdText text={inhalt.texte.achtungOhnePhysischePrüfung} /></p>
                )}
              </div>
            </div>
          </div>
        )}

        {bestandSubTab === 'stahl' && (
          <div {...reiterPanel('rechnung-bestand', bestandSubTab)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <History className="text-shiraz" size={16} /><MdText text={inhalt.texte.historischeBetonstahlKenndaten} /></h3>

                {/* Stahlklasse Selector */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.historischeBetonstahlArt} /></label>
                  <select aria-label={inhalt.werte.historischeBetonstahlArt} 
                    value={histStahlKlasse} 
                    onChange={(e) => setHistStahlKlasse(e.target.value as "BSt220" | "BSt420" | "BSt500")}
                    className="w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs"
                  >
                    <option value="BSt220">Betonstahl I (BSt 220/340 GU) – glatt, warmgewalzt</option>
                    <option value="BSt420">Betonstahl III (BSt 420/500 RU) – gerippt, warmgewalzt (naturhart)</option>
                    <option value="BSt500">Betonstahl IV (BSt 500/550 RK) – gerippt, kaltverformt</option>
                  </select>
                </div>

                {/* Durchmesser Slider */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700"><MdText text={inhalt.texte.stabdurchmesser} /></span>
                    <span className="text-shiraz">{formatDeWert(diameterStahl)} mm</span>
                  </div>
                  <input 
                    type="range" 
                    min="6" 
                    max="32" 
                    step="2" 
                    value={diameterStahl} 
                    onChange={(e) => setDiameterStahl(parseInt(e.target.value))}
                    className="w-full accent-shiraz"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.verbundeigenschaftenZugkapazitätEurocode} /></h3>

                <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal font-sans">
                  <div><MdText text={inhalt.texte.schritt1BemessungswertDer} /><p className="mt-1 text-xxs"><MdText text={inhalt.texte.berechnungMitDemMaterialsicherheitsbeiwe} /></p>
                    <BlockMath math={`f_{yd} = \\frac{f_{yk}}{\\gamma_S} = \\frac{\\color{#A3113E}{${f_yk_stahl}}}{1{,}15} = \\color{#A3113E}{${formatDeTeX(f_yd_stahl, 1)}} \\, \\text{N/mm}^2`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt2ZugkapazitätEines} /><BlockMath math={`A_s = \\frac{\\pi \\cdot d^2}{4} = \\frac{\\pi \\cdot \\color{#A3113E}{${formatDeTeXWert(diameterStahl)}}^2}{4} = \\color{#A3113E}{${formatDeTeX(steelArea, 1)}} \\, \\text{mm}^2`} />
                    <BlockMath math={`F_{yd} = A_s \\cdot f_{yd} = \\color{#A3113E}{${formatDeTeX(steelArea, 1)}} \\cdot \\color{#A3113E}{${formatDeTeX(f_yd_stahl, 1)}} \\cdot 10^{-3} = \\color{#A3113E}{${formatDeTeX(yieldCapacity, 1)}} \\, \\text{kN}`} />
                  </div>

                  <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt3VerbundUnd} /><div className="mt-1 text-xxs leading-normal">
                      {histStahlKlasse === 'BSt220' && (
                        <div className="text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-150 space-y-1">
                          <p className="font-bold"><MdText text={inhalt.texte.achtungUnberuhigtVergossenerGlatter} /></p>
                          <p><MdText text={inhalt.texte.keineSchweißeignungSchweißenIst} /></p>
                        </div>
                      )}
                      {histStahlKlasse === 'BSt420' && (
                        <div className="text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-150 space-y-1">
                          <p className="font-bold"><MdText text={inhalt.texte.hinweisBetonstahlIiiBst} /></p>
                          <p><MdText text={inhalt.texte.schweißeignungKritischMeistUnberuhigt} /></p>
                        </div>
                      )}
                      {histStahlKlasse === 'BSt500' && (
                        <div className="text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-150 space-y-1">
                          <p className="font-bold"><MdText text={inhalt.texte.hinweisKaltverformterGerippterStahl} /></p>
                          <p><MdText text={inhalt.texte.bedingtSchweißgeeignetKaltverformterStah} /></p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
