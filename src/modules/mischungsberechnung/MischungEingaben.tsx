import type { Hinweis } from '@/src/calc/plausibilitaet';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { fzLehrannahme } from '@/src/calc/mischung';
import { rezepturen, BAUTEILE, allExpClasses, EXPOSITIONSKLASSEN, zementData, festigkeitsklassen, KONSISTENZ_DATA } from './daten';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { Radar } from 'react-chartjs-2';
import { Slider } from '@/src/components/ui/Slider';
import { Droplets, AlertTriangle, Wind, Scale, CheckCircle2 } from 'lucide-react';
import { DIN1045_2 } from '@/src/data/normParams';
import React from 'react';
import { NachErstemBild } from '@/src/components/ui/NachErstemBild';
import inhalt from '@/content/mischungsberechnung/MischungEingaben.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

interface MischungEingabenProps {
  applyWalzSandReduction: () => void;
  bauteil: string;
  biochar: number;
  deltaGesteinMasse: number;
  deltaLuftVol: number;
  empfohleneSandReduktion: number;
  expClasses: string[];
  f04: number;
  f1632: number;
  f48: number;
  f816: number;
  fa: number;
  feinanteilSand: number;
  festigkeitsVerlustLP: number;
  feuchte04: number;
  feuchte1632: number;
  feuchte48: number;
  feuchte816: number;
  feuchteBiochar: number;
  groesstkorn: 8 | 16 | 32;
  handleBauteilChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleGroesstkornChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleRezepturChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  hues: number;
  isFraktionenOk: boolean;
  isLpActive: boolean;
  kBiochar: number;
  kFa: number;
  kKsm: number;
  kSf: number;
  konsistenz: string;
  kornArt: "rund" | "gebrochen";
  lpOption: "auto" | "mit_lp" | "ohne_lp";
  luft: number;
  minLpNorm: 4 | 5.5 | 4.5;
  ppFaser: number;
  results: { wasserTrocken: number; zugabewasser: number; wasserAusGestein: number; wasserAusBiochar: number; kernwasser: number; volZement: number; volFa: number; volSf: number; volKsm: number; volBiochar: number; volZM: number; volLuft: number; volGestein: number; volStahlfaser: number; volPpFaser: number; volFasernGesamt: number; masseGesteinTrocken: number; m04_tr: number; m48_tr: number; m816_tr: number; m1632_tr: number; m04_feucht: number; m48_feucht: number; m816_feucht: number; m1632_feucht: number; biochar_feucht: number; frischbetonRohdichte: number; wz: number; wzEq: number; wbWert: number; volLeim: number; co2Zement: number; co2Fa: number; co2Sf: number; co2Ksm: number; co2Biochar: number; co2Gestein: number; co2Wasser: number; co2ZM: number; co2Stahlfaser: number; co2PpFaser: number; co2FasernGesamt: number; co2Gesamt: number; reqMaxWz: number; reqMinZ: number; reqMinC: string; reqMinCover: number; reqMaxZement: number; isWzOk: boolean; xf4OhneLp: boolean; isZOk: boolean; isMaxZOk: boolean; radarChartData: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string; borderColor: string; borderWidth: number; pointBackgroundColor: string; }[]; }; estimatedWater: number; maxFa: number; anrechenbarFa: number; maxSf: number; anrechenbarSf: number; mehlkornAusSand: number; mehlkornGesamt: number; maxMehlkornText: string; isMehlkornOk: boolean; hasXFoderXM: boolean; lpWaterReduction: number; isLpActive: boolean; hinweise: Hinweis[]; };
  rezeptur: string;
  rhoGestein: number;
  sandFraktion: "0/4" | "0/2";
  setBiochar: React.Dispatch<React.SetStateAction<number>>;
  setF04: React.Dispatch<React.SetStateAction<number>>;
  setF1632: React.Dispatch<React.SetStateAction<number>>;
  setF48: React.Dispatch<React.SetStateAction<number>>;
  setF816: React.Dispatch<React.SetStateAction<number>>;
  setFa: React.Dispatch<React.SetStateAction<number>>;
  setFeinanteilSand: React.Dispatch<React.SetStateAction<number>>;
  setFeuchte04: React.Dispatch<React.SetStateAction<number>>;
  setFeuchte1632: React.Dispatch<React.SetStateAction<number>>;
  setFeuchte48: React.Dispatch<React.SetStateAction<number>>;
  setFeuchte816: React.Dispatch<React.SetStateAction<number>>;
  setFeuchteBiochar: React.Dispatch<React.SetStateAction<number>>;
  setKBiochar: React.Dispatch<React.SetStateAction<number>>;
  setKKsm: React.Dispatch<React.SetStateAction<number>>;
  setKonsistenz: React.Dispatch<React.SetStateAction<string>>;
  setKornArt: React.Dispatch<React.SetStateAction<"rund" | "gebrochen">>;
  setKsm: React.Dispatch<React.SetStateAction<number>>;
  setLpOption: React.Dispatch<React.SetStateAction<"auto" | "mit_lp" | "ohne_lp">>;
  setLuft: React.Dispatch<React.SetStateAction<number>>;
  setPpFaser: React.Dispatch<React.SetStateAction<number>>;
  setRhoGestein: React.Dispatch<React.SetStateAction<number>>;
  setSandFraktion: React.Dispatch<React.SetStateAction<"0/4" | "0/2">>;
  setSf: React.Dispatch<React.SetStateAction<number>>;
  setStahlfaser: React.Dispatch<React.SetStateAction<number>>;
  setWa04: React.Dispatch<React.SetStateAction<number>>;
  setWa1632: React.Dispatch<React.SetStateAction<number>>;
  setWa48: React.Dispatch<React.SetStateAction<number>>;
  setWa816: React.Dispatch<React.SetStateAction<number>>;
  setWaBiochar: React.Dispatch<React.SetStateAction<number>>;
  setWasser: React.Dispatch<React.SetStateAction<number>>;
  setZement: React.Dispatch<React.SetStateAction<number>>;
  setZementArt: React.Dispatch<React.SetStateAction<string>>;
  setZementFestigkeit: React.Dispatch<React.SetStateAction<string>>;
  setZusatzmittel: React.Dispatch<React.SetStateAction<number>>;
  sf: number;
  stahlfaser: number;
  sumFraktionen: number;
  toggleExpClass: (cls: string) => void;
  wa04: number;
  wa1632: number;
  wa48: number;
  wa816: number;
  waBiochar: number;
  wasser: number;
  wasserEinsparungLP: number;
  zement: number;
  zementArt: string;
  zementFestigkeit: string;
  zusatzmittel: number;
}

export default function MischungEingaben({ applyWalzSandReduction, bauteil, biochar, deltaGesteinMasse, deltaLuftVol, empfohleneSandReduktion, expClasses, f04, f1632, f48, f816, fa, feinanteilSand, festigkeitsVerlustLP, feuchte04, feuchte1632, feuchte48, feuchte816, feuchteBiochar, groesstkorn, handleBauteilChange, handleGroesstkornChange, handleRezepturChange, hues, isFraktionenOk, isLpActive, kBiochar, kFa, kKsm, kSf, konsistenz, kornArt, lpOption, luft, minLpNorm, ppFaser, results, rezeptur, rhoGestein, sandFraktion, setBiochar, setF04, setF1632, setF48, setF816, setFa, setFeinanteilSand, setFeuchte04, setFeuchte1632, setFeuchte48, setFeuchte816, setFeuchteBiochar, setKBiochar, setKKsm, setKonsistenz, setKornArt, setKsm, setLpOption, setLuft, setPpFaser, setRhoGestein, setSandFraktion, setSf, setStahlfaser, setWa04, setWa1632, setWa48, setWa816, setWaBiochar, setWasser, setZement, setZementArt, setZementFestigkeit, setZusatzmittel, sf, stahlfaser, sumFraktionen, toggleExpClass, wa04, wa1632, wa48, wa816, waBiochar, wasser, wasserEinsparungLP, zement, zementArt, zementFestigkeit, zusatzmittel }: MischungEingabenProps) {
  return (
    <div className="flex flex-col gap-6">

      {/* Mobil liegen schon die ersten Karten unterhalb des Bildausschnitts → nach dem ersten Bild, je Karte eine
          Task (TBT 04.11.2026); in der vorgerenderten Seite stehen sie weiter (statisch) */}
      <NachErstemBild minHoehe="7.5rem" statisch>
      {/* Vorgegebene Rezepturen */}
      <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
        <h3 className="font-semibold mb-4 text-text-main flex items-center gap-2">
          <label htmlFor="rezeptur-select"><MdText text={inhalt.texte.vorgegebeneRezepturen} /></label>
          <InfoTooltip text={inhalt.werte.wählenSieEineVordefinierte} />
        </h3>
        <div>
          <select 
            id="rezeptur-select"
            aria-label={inhalt.werte.vorgegebeneRezepturen}
            value={rezeptur} 
            onChange={handleRezepturChange}
            className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
          >
            <option value="manuell">Manuelle Eingabe</option>
            {Object.keys(rezepturen).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
      </NachErstemBild>

      <NachErstemBild minHoehe="46rem" statisch>
      {/* Expositionsklassen & Bauteil */}
      <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
        <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.expositionsklassenBauteil} /></h3>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="bauteil-select" className="block text-sm font-medium text-text-main mb-1">Bauteil-Voreinstellung</label>
            <InfoTooltip text={inhalt.werte.vordefinierteParameterFürTypische} />
          </div>
          <select 
            id="bauteil-select"
            aria-label="Bauteil-Voreinstellung"
            value={bauteil} 
            onChange={handleBauteilChange}
            className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
          >
            {BAUTEILE.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="flex border-b border-home-grau/30 overflow-x-auto">
          {allExpClasses.map(cls => (
            <div key={cls} className="relative group">
              <button
                type="button"
                onClick={() => toggleExpClass(cls)}
                aria-pressed={expClasses.includes(cls)}
                aria-describedby={`expklasse-hinweis-${cls}`}
                className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors ${
                        expClasses.includes(cls) 
                          ? 'bg-shiraz text-white border-shiraz' 
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:border-shiraz/50'
                      }`}
              >
                {cls}
              </button>
              <div id={`expklasse-hinweis-${cls}`} role="tooltip" className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block group-focus-within:block w-48 bg-gray-900 text-white text-xs rounded p-2 z-10 text-center pointer-events-none">
                {EXPOSITIONSKLASSEN[cls].desc}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Normative Anforderungen */}
        {expClasses.length > 0 && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
            <div className="font-semibold mb-2 text-text-main"><MdText text={inhalt.texte.anforderungenDinEn206} /></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-center">
              <div className="bg-off-white p-2 rounded">
                <div className="text-xs text-text-main/60"><MdText text={inhalt.texte.maxWZEq} /></div>
                <div className="font-bold">{formatDeZahl(results.reqMaxWz, 2)}</div>
              </div>
              <div className="bg-off-white p-2 rounded">
                <div className="text-xs text-text-main/60">min. Zement</div>
                <div className="font-bold">{formatDeWert(results.reqMinZ)} kg</div>
              </div>
              <div className="bg-off-white p-2 rounded">
                <div className="text-xs text-text-main/60"><MdText text={inhalt.texte.minFestigkeit} /></div>
                <div className="font-bold">{results.reqMinC}</div>
              </div>
              <div className="bg-off-white p-2 rounded">
                <div className="text-xs text-text-main/60"><MdText text={inhalt.texte.minDeckung} /></div>
                <div className="font-bold">{results.reqMinCover > 0 ? `${formatDeWert(results.reqMinCover)} mm` : '-'}</div>
              </div>
              <div className="bg-off-white p-2 rounded">
                <div className="text-xs text-text-main/60">max. Zement</div>
                <div className="font-bold">{results.reqMaxZement !== Infinity ? `${formatDeWert(results.reqMaxZement)} kg` : '-'}</div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-text-main mb-2 text-center">Beanspruchungsprofil</h4>
              <div className="w-full max-w-xs mx-auto aspect-square">
                <Radar 
                  data={results.radarChartData} 
                  options={{
                    scales: {
                      r: {
                        min: 0,
                        max: 4,
                        ticks: { stepSize: 1, display: false },
                        grid: { color: 'rgba(0,0,0,0.1)' },
                        pointLabels: { font: { size: 10 } }
                      }
                    },
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false
                  }} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
      </NachErstemBild>

      <NachErstemBild minHoehe="40rem">
      {/* Zement & Wasser */}
      <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
        <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.zementWasser} /></h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="zementart-select" className="block text-sm font-medium text-text-main mb-1">Zementart</label>
              <InfoTooltip text={inhalt.werte.artDesVerwendetenZements} />
            </div>
            <select 
              id="zementart-select"
              aria-label="Zementart"
              value={zementArt} 
              onChange={(e) => setZementArt(e.target.value)}
              className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
            >
              {Object.keys(zementData).map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="zementfestigkeit-select" className="block text-sm font-medium text-text-main mb-1 flex items-center gap-2">
              Festigkeitsklasse
              <InfoTooltip text={inhalt.werte.nNormaleErhärtungR} />
            </label>
            <select 
              id="zementfestigkeit-select"
              aria-label="Festigkeitsklasse"
              value={zementFestigkeit} 
              onChange={(e) => setZementFestigkeit(e.target.value)}
              className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
            >
              {festigkeitsklassen.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
        <Slider label={inhalt.werte.zementgehaltZ} info={inhalt.werte.masseDesZementsPro} min={200} max={500} step={5} value={zement} unit="kg/m3" onChange={(e) => setZement(Number(e.target.value))} />
        <div className="mt-4">
          <Slider  label="Wasser" 
            min={100} max={250} step={1} 
            value={wasser} unit="kg/m³" 
            onChange={(e) => setWasser(Number(e.target.value))} 
          />

          <div className="mt-6 p-4 bg-white rounded-xl border border-home-grau/30 shadow-sm">
            <h4 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
              <Droplets size={16} className="text-blue-500" /><MdText text={inhalt.texte.wasseranspruchAbschätzen} /></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="konsistenz-select" className="block text-xs font-medium text-text-main/80 mb-1">Konsistenzklasse</label>
                <select 
                  id="konsistenz-select"
                  aria-label="Konsistenzklasse"
                  value={konsistenz} 
                  onChange={(e) => setKonsistenz(e.target.value)}
                  className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50 text-sm"
                >
                  {Object.entries(KONSISTENZ_DATA).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-xs text-text-main/80 mb-1"><MdText text={inhalt.texte.geschätzterBedarfFürDmax} />{groesstkorn}mm):</div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-blue-600">{formatDeWert(results.estimatedWater)} kg/m³</span>
                  <button 
                    onClick={() => setWasser(results.estimatedWater)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors border border-blue-200"
                  >
                    Übernehmen
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-text-main/60 mt-3"><MdText text={inhalt.texte.derWasseranspruchHängtMaßgeblich} /></p>
          </div>

          {results.xf4OhneLp && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-200">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <div><MdText text={inhalt.texte.achtungXf4IstNach} /></div>
            </div>
          )}

          {!results.isWzOk && !results.xf4OhneLp && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-200">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <div><MdText text={inhalt.texte.achtungDerWZ} />{formatDeZahl(results.wzEq, 2)}<MdText text={inhalt.texte.überschreitetDenFürDie} />{formatDeZahl(results.reqMaxWz, 2)}.
              </div>
            </div>
          )}

          {!results.isZOk && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-200">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <div><MdText text={inhalt.texte.achtungDerZementgehaltVon} />{formatDeWert(zement)}<MdText text={inhalt.texte.kgMUnterschreitetDen} />{formatDeWert(results.reqMinZ)} kg/m³.
              </div>
            </div>
          )}

          {!results.isMaxZOk && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-200">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <div><MdText text={inhalt.texte.achtungDerZementgehaltVon2} />{formatDeWert(zement)}<MdText text={inhalt.texte.kgMÜberschreitetDen} />{formatDeWert(results.reqMaxZement)}<MdText text={inhalt.texte.kgMGefahrEiner} /></div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-home-grau/10">
            <div className="flex items-center gap-2">
              <label htmlFor="ziel-druckfestigkeit-select" className="block text-sm font-medium text-text-main mb-1"><MdText text={inhalt.texte.zielDruckfestigkeitBeton} /></label>
              <InfoTooltip text={inhalt.werte.angestrebteDruckfestigkeitDesBetons} />
            </div>
            <select 
              id="ziel-druckfestigkeit-select"
              aria-label={inhalt.werte.zielDruckfestigkeitBeton}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'C20/25') setWasser(zement * 0.65);
                else if (val === 'C25/30') setWasser(zement * 0.60);
                else if (val === 'C30/37') setWasser(zement * 0.55);
                else if (val === 'C35/45') setWasser(zement * 0.50);
                else if (val === 'C40/50') setWasser(zement * 0.45);
                else if (val === 'C45/55') setWasser(zement * 0.40);
                else if (val === 'C50/60') setWasser(zement * 0.35);
              }}
              className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50 text-sm"
            >
              <option value="">Manuell gewählt</option>
              <option value="C20/25">C20/25 (w/z ≈ 0,65)</option>
              <option value="C25/30">C25/30 (w/z ≈ 0,60)</option>
              <option value="C30/37">C30/37 (w/z ≈ 0,55)</option>
              <option value="C35/45">C35/45 (w/z ≈ 0,50)</option>
              <option value="C40/50">C40/50 (w/z ≈ 0,45)</option>
              <option value="C45/55">C45/55 (w/z ≈ 0,40)</option>
              <option value="C50/60">C50/60 (w/z ≈ 0,35)</option>
            </select>
            {results.reqMinC && (
              <div className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.minGefordertDurchExpositionsklassen} /><strong>{results.reqMinC}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
      </NachErstemBild>

      <NachErstemBild minHoehe="30rem">
      {/* Zusatzstoffe */}
      <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
        <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.betonzusatzstoffeKWertAnsatz} /></h3>

        {/* Flugasche */}
        <div className="grid grid-cols-2 gap-4 items-end mt-4">
          <div>
            <Slider label={inhalt.werte.flugascheFa} info={inhalt.werte.mengeAnZugegebenerFlugasche} min={0} max={150} step={5} value={fa} unit="kg/m3" onChange={(e) => setFa(Number(e.target.value))} />
            {fa > results.maxFa && (
              <div className="text-xs text-torch-red mt-1"><MdText text={inhalt.texte.anrechenbarMax} />{formatDeZahl(results.maxFa, 0)} kg/m³ bei {formatDeWert(zement)} kg/m³ {zementArt})
              </div>
            )}
            {fa > 0 && fzLehrannahme(zementArt) && (
              <div className="text-xs text-home-grau mt-1">{inhalt.werte.fzLehrannahme}</div>
            )}
          </div>
          <div className="flex flex-col gap-2 pdf-parameter">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-text-main">k-Wert FA</label>
                <InfoTooltip text={inhalt.werte.nachTypIiFlugasche} />
              </div>
              <span className="text-sm font-bold text-shiraz">{formatDeWert(kFa)} -</span>
            </div>
            <div className="text-xs text-home-grau"><MdText text={inhalt.texte.nachDin10452} />{formatDeWert(DIN1045_2.kFlugasche)}</div>
          </div>
        </div>

        {/* Silikastaub */}
        <div className="grid grid-cols-2 gap-4 items-end mt-4">
          <div>
            <Slider label={inhalt.werte.silikastaubSf} info={inhalt.werte.mengeAnZugegebenemSilikastaub} min={0} max={50} step={1} value={sf} unit="kg/m3" onChange={(e) => setSf(Number(e.target.value))} />
            {sf > results.maxSf && (
              <div className="text-xs text-torch-red mt-1"><MdText text={inhalt.texte.anrechenbarMax2} />{formatDeZahl(results.maxSf, 0)} kg/m³ bei {formatDeWert(zement)}<MdText text={inhalt.texte.kgMZement} /></div>
            )}
          </div>
          <div className="flex flex-col gap-2 pdf-parameter">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-text-main">k-Wert SF</label>
                <InfoTooltip text={inhalt.werte.nachDin10452} />
              </div>
              <span className="text-sm font-bold text-shiraz">{formatDeZahl(kSf, 1)} -</span>
            </div>
            <div className="text-xs text-home-grau"><MdText text={inhalt.texte.din104522023} /></div>
          </div>
        </div>

        {/* Hüttensandmehl (HüS) */}
        <div className="grid grid-cols-2 gap-4 items-end mt-4">
          <div>
            <Slider 
              label={inhalt.werte.hüttensandmehlHüs} 
              info={inhalt.werte.granulierteHochofenschlackeNachDin} 
              min={0} 
              max={200} 
              step={5} 
              value={hues} 
              unit="kg/m³" 
              onChange={(e) => setKsm(Number(e.target.value))} 
            />
            {hues > 0 && (
              <div className="text-xs text-shiraz mt-1"><MdText text={inhalt.texte.latentHydraulischDichte2} />{formatDeZahl((hues / 2.9), 1)} dm³)
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 pdf-parameter">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-text-main">k-Wert HüS</label>
                <InfoTooltip text={inhalt.werte.hüttensandmehlTypIiDin} />
              </div>
              <span className="text-sm font-bold text-shiraz">{formatDeZahl(kKsm, 1)} -</span>
            </div>
            <Slider 
              label="" 
              info="" 
              min={0.0} 
              max={0.8} 
              step={0.1} 
              value={kKsm} 
              unit="-" 
              onChange={(e) => setKKsm(Number(e.target.value))} 
            />
            <div className="text-xs text-home-grau">{inhalt.werte.kWertHuesLehrannahme}</div>
          </div>
        </div>

        {/* Pflanzenkohle (Biochar) */}
        <div className="grid grid-cols-2 gap-4 items-end mt-4">
          <div>
            <Slider 
              label={inhalt.werte.pflanzenkohleBiochar} 
              info={inhalt.werte.biocharBindetDauerhaftCo2} 
              min={0} 
              max={50} 
              step={1} 
              value={biochar} 
              unit="kg/m³" 
              onChange={(e) => setBiochar(Number(e.target.value))} 
            />
          </div>
          <div className="flex flex-col gap-2 pdf-parameter">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-text-main"><MdText text={inhalt.texte.kWertBiochar} /></label>
                <InfoTooltip text={inhalt.werte.pflanzenkohleBiocharAktuellKein} />
              </div>
              <span className="text-sm font-bold text-shiraz">{formatDeZahl(kBiochar, 1)} -</span>
            </div>
            <Slider 
              label="" 
              info="" 
              min={-1.0} 
              max={1.0} 
              step={0.1} 
              value={kBiochar} 
              unit="-" 
              onChange={(e) => setKBiochar(Number(e.target.value))} 
            />
          </div>
        </div>
        {biochar > 0 && (
          <div className="grid grid-cols-2 gap-4 items-end mt-4 p-3 bg-white rounded-lg border border-home-grau/30">
            <Slider label={inhalt.werte.gesamtfeuchteBiochar} info={inhalt.werte.gesamterWassergehaltDerPflanzenkohle} min={0} max={100} step={1} value={feuchteBiochar} unit="M.-%" onChange={(e) => setFeuchteBiochar(Number(e.target.value))} />
            <Slider label={inhalt.werte.wasserbedarfWaBiochar}  min={0} max={100} step={1} value={waBiochar} unit="M.-%" onChange={(e) => setWaBiochar(Number(e.target.value))} />
          </div>
        )}

      </div>
      </NachErstemBild>

      <NachErstemBild minHoehe="40rem">
      {/* Zusatzmittel & Luft (inkl. LP-Beton Automatik) */}
      <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
        <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.zusatzmittelLuftLpBeton} /></h3>
        <Slider label={inhalt.werte.zusatzmittelFmLp} info={inhalt.werte.mengeAnFließmittelOder} min={0} max={10} step={0.1} value={zusatzmittel} unit="kg/m3" onChange={(e) => setZusatzmittel(Number(e.target.value))} />
        <div className="mt-4">
          <Slider label="Luftporengehalt" min={0} max={10} step={0.5} value={luft} unit="Vol.-%" onChange={(e) => setLuft(Number(e.target.value))} />
        </div>

        {/* LP-Beton Steuerung & Konsequenzen für Gesteinskörnung & Mischung */}
        <div className="mt-4 pt-4 border-t border-home-grau/20 flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Wind size={16} className="text-shiraz" />
              <span className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.lpBetonAutomatikGesteinsfolgen} /></span>
              <InfoTooltip text={inhalt.werte.automatischeBerücksichtigungVonKünstlich} />
            </div>

            {/* Modus-Wähler */}
            <AuswahlGruppe label="LP-Modus" className="flex bg-white p-1 rounded-lg border border-home-grau/30 text-xs">
              <button {...alsOption(lpOption === 'auto')}
                type="button"
                onClick={() => setLpOption('auto')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                        lpOption === 'auto' 
                          ? 'bg-shiraz text-white shadow-xs font-bold' 
                          : 'text-text-main/70 hover:text-text-main'
                      }`}
              >
                Auto-Erkennung
              </button>
              <button {...alsOption(lpOption === 'mit_lp')}
                type="button"
                onClick={() => {
                  setLpOption('mit_lp');
                  if (luft < minLpNorm) setLuft(minLpNorm);
                }}
                className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                        lpOption === 'mit_lp' 
                          ? 'bg-shiraz text-white shadow-xs font-bold' 
                          : 'text-text-main/70 hover:text-text-main'
                      }`}
              >
                Mit LP
              </button>
              <button {...alsOption(lpOption === 'ohne_lp')}
                type="button"
                onClick={() => setLpOption('ohne_lp')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                        lpOption === 'ohne_lp' 
                          ? 'bg-shiraz text-white shadow-xs font-bold' 
                          : 'text-text-main/70 hover:text-text-main'
                      }`}
              >
                Ohne LP
              </button>
            </AuswahlGruppe>
          </div>

          {/* Status Badge & Normative Info */}
          <div className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  isLpActive 
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isLpActive ? 'bg-blue-600 animate-pulse' : 'bg-slate-400'}`} />
              <span>
                <strong>Status:</strong> {isLpActive ? inhalt.werte.lpBetonAktivFrost : inhalt.werte.normalbetonVerdichtungsporen}
              </span>
            </div>
            {isLpActive && (
              <div className="font-mono text-blue-800 font-medium"><MdText text={inhalt.texte.din10452Mindestluftgehalt} />{groesstkorn} mm: <strong>≥ {formatDeZahl(minLpNorm, 1)} Vol.-%</strong>
              </div>
            )}
          </div>

          {/* Warnung bei Unterschreitung des Mindestluftgehalts */}
          {isLpActive && luft < minLpNorm && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-red-800">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <span><MdText text={inhalt.texte.achtungDerEingestellteLuftgehalt} />{formatDeZahl(luft, 1)}<MdText text={inhalt.texte.volUnterschreitetDenNormativen} />{formatDeZahl(minLpNorm, 1)}<MdText text={inhalt.texte.volFürDmax} />{groesstkorn}<MdText text={inhalt.texte.mmNachDin1045} /></span>
              </div>
              <button
                type="button"
                onClick={() => setLuft(minLpNorm)}
                className="px-2.5 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-all text-xs whitespace-nowrap self-end sm:self-auto cursor-pointer"
              >
                Auf {formatDeZahl(minLpNorm, 1)} % anpassen
              </button>
            </div>
          )}

          {/* 4 Konsequenzen-Karten für Gesteinskörnung & Mischung */}
          {isLpActive && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Karte 1: Gesteinsvolumenverdrängung */}
              <div className="bg-white p-3 rounded-lg border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xs text-text-main flex items-center justify-between">
                    <span><MdText text={inhalt.texte.t1Gesteinsverdrängung} /></span>
                    <span className="text-shiraz font-mono font-bold">-{formatDeZahl(deltaLuftVol, 1)} dm³</span>
                  </div>
                  <p className="text-[11px] text-text-main/70 mt-1 leading-snug"><MdText text={inhalt.texte.zusätzlicheMikroluftporenVerdrängenIm} /></p>
                </div>
                <div className="mt-2 text-xs font-mono font-semibold text-text-main bg-off-white/80 p-1.5 rounded"><MdText text={inhalt.texte.gesteinsmasseSinktUm} /><strong>-{formatDeZahl(deltaGesteinMasse, 1)} kg/m³</strong>
                </div>
              </div>

              {/* Karte 2: Sandanteilsreduktion nach Walz */}
              <div className="bg-white p-3 rounded-lg border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xs text-text-main flex items-center justify-between">
                    <span><MdText text={inhalt.texte.t2SandanteilWalzRegel} /></span>
                    <span className="text-shiraz font-mono font-bold">-{formatDeWert(empfohleneSandReduktion)}% Sand</span>
                  </div>
                  <p className="text-[11px] text-text-main/70 mt-1 leading-snug"><MdText text={inhalt.texte.mikroluftporenWirkenWieFeinsandkugeln} /></p>
                </div>
                <div className="mt-2 flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={applyWalzSandReduction}
                    disabled={empfohleneSandReduktion <= 0}
                    className="w-full px-2 py-1 bg-shiraz/10 hover:bg-shiraz text-shiraz hover:text-white rounded text-[11px] font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Scale size={12} />
                    <span><MdText text={inhalt.texte.sandreduktionAnwenden} />{formatDeWert(empfohleneSandReduktion)}%)</span>
                  </button>
                </div>
              </div>

              {/* Karte 3: Wasseranspruch (Kugellagereffekt) */}
              <div className="bg-white p-3 rounded-lg border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xs text-text-main flex items-center justify-between">
                    <span><MdText text={inhalt.texte.t3Wasseranspruch} /></span>
                    <span className="text-green-700 font-mono font-bold">-{formatDeZahl(wasserEinsparungLP, 1)} L/m³</span>
                  </div>
                  <p className="text-[11px] text-text-main/70 mt-1 leading-snug"><MdText text={inhalt.texte.dieSphärischenLuftporenVerbessern} /></p>
                </div>
                <div className="mt-2 text-[11px] text-green-800 bg-green-50/70 p-1.5 rounded font-medium"><MdText text={inhalt.texte.wasserersparnisFürKonsistenz} />{konsistenz}: ca. <strong>{formatDeZahl(wasserEinsparungLP, 1)} Liter/m³</strong>
                </div>
              </div>

              {/* Karte 4: Festigkeitsabschlag & Norm-Kompensation */}
              <div className="bg-white p-3 rounded-lg border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xs text-text-main flex items-center justify-between">
                    <span><MdText text={inhalt.texte.t4Festigkeitseinfluss} /></span>
                    <span className="text-orange-700 font-mono font-bold">−{formatDeZahl(festigkeitsVerlustLP, 0)} %</span>
                  </div>
                  <p className="text-[11px] text-text-main/70 mt-1 leading-snug"><MdText text={inhalt.texte.jedesVolLuftporenKostet} /></p>
                </div>
                <div className="mt-2 text-[11px] text-orange-900 bg-orange-50/70 p-1.5 rounded font-medium"><MdText text={inhalt.texte.xf2Xf3C2530} /></div>
              </div>
            </div>
          )}
        </div>
      </div>
      </NachErstemBild>

      <NachErstemBild minHoehe="40rem">
      {/* Faserbewehrung (Metall & Kunststoff) */}
      <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-main flex items-center gap-1.5">
            <span><MdText text={inhalt.texte.faserbewehrungMetallPp} /></span>
            <InfoTooltip text={inhalt.werte.faserzugabeNachDinEn} />
          </h3>
          {(stahlfaser > 0 || ppFaser > 0) && (
            <span className="text-[11px] font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full">
              {formatDeZahl(results.volFasernGesamt, 2)}<MdText text={inhalt.texte.dmMStoffraum} /></span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Slider 
              label={inhalt.werte.stahlfasernMetallfasern} 
              info={inhalt.werte.dosierungVonStahlfasernNach} 
              min={0} 
              max={80} 
              step={2} 
              value={stahlfaser} 
              unit="kg/m³" 
              onChange={(e) => setStahlfaser(Number(e.target.value))} 
            />
            <div className="text-[10px] text-text-main/60 mt-1 flex justify-between font-mono">
              <span><MdText text={inhalt.texte.t0KgOhneSf} /></span>
              <span className="text-shiraz"><MdText text={inhalt.texte.industrieboden30Kg} /></span>
              <span>80 kg</span>
            </div>
          </div>

          <div>
            <Slider 
              label={inhalt.werte.ppFasernPolypropylen} 
              info={inhalt.werte.dosierungVonPolymerPp} 
              min={0} 
              max={8.0} 
              step={0.1} 
              value={ppFaser} 
              unit="kg/m³" 
              onChange={(e) => setPpFaser(Number(e.target.value))} 
            />
            <div className="text-[10px] text-text-main/60 mt-1 flex justify-between font-mono">
              <span><MdText text={inhalt.texte.t0KgOhnePp} /></span>
              <span className="text-shiraz"><MdText text={inhalt.texte.brandschutzRisse15} /></span>
              <span>8 kg</span>
            </div>
          </div>
        </div>

        {(stahlfaser > 0 || ppFaser > 0) && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-home-grau/25 text-xs text-text-main/80 space-y-1">
            <div className="font-semibold text-text-main flex items-center gap-1.5">
              <span className="text-shiraz"><MdText text={inhalt.texte.faserwirksamkeitRegelwerk} /></span>
            </div>
            <div className="text-[11px] leading-relaxed space-y-1">
              {stahlfaser > 0 && (
                <p>
                  • <strong><MdText text={inhalt.texte.stahlfasern} />{formatDeWert(stahlfaser)} kg/m³):</strong> Beanspruchen {formatDeZahl(results.volStahlfaser, 2)}<MdText text={inhalt.texte.dmStoffraumvolumenDichte7} /></p>
              )}
              {ppFaser > 0 && (
                <p>
                  • <strong>PP-Fasern ({formatDeZahl(ppFaser, 1)} kg/m³):</strong> Beanspruchen {formatDeZahl(results.volPpFaser, 2)}<MdText text={inhalt.texte.dmStoffraumvolumenDichte0} /></p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gesteinskörnung & Feuchte */}
      <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
        <h3 className="font-semibold mb-4 text-text-main flex items-center justify-between"><MdText text={inhalt.texte.gesteinskörnungFeuchte} />{!isFraktionenOk && (
            <span className="text-red-500 text-xs flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
              <AlertTriangle size={14} /> Summe: {formatDeZahl(sumFraktionen, 1)}<MdText text={inhalt.texte.muss100Sein} /></span>
          )}
          {isFraktionenOk && (
            <span className="text-green-600 text-xs flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
              <CheckCircle2 size={14} /> Summe: 100%
            </span>
          )}
        </h3>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="groesstkorn-select" className="block text-sm font-medium text-text-main mb-1"><MdText text={inhalt.texte.größtkornDmax} /></label>
              <InfoTooltip text={inhalt.werte.maximalerKorndurchmesserDerGesteinskörnu} />
            </div>
            <select 
              id="groesstkorn-select"
              aria-label={inhalt.werte.größtkornDmax}
              value={groesstkorn} 
              onChange={handleGroesstkornChange}
              className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
            >
              <option value={8}>8 mm</option>
              <option value={16}>16 mm</option>
              <option value={32}>32 mm</option>
            </select>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="kornart-select" className="block text-sm font-medium text-text-main mb-1">Kornform</label>
              <InfoTooltip text={inhalt.werte.formDerGesteinskörner} />
            </div>
            <select 
              id="kornart-select"
              aria-label="Kornform"
              value={kornArt} 
              onChange={(e) => setKornArt(e.target.value as 'rund' | 'gebrochen')}
              className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
            >
              <option value="rund">Rundkorn (Kies)</option>
              <option value="gebrochen">Gebrochen (Splitt)</option>
            </select>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="sandfraktion-select" className="block text-sm font-medium text-text-main mb-1">Sandfraktion</label>
              <InfoTooltip text={inhalt.werte.anteilDerFeinenGesteinskörnung} />
            </div>
            <select 
              id="sandfraktion-select"
              aria-label="Sandfraktion"
              value={sandFraktion} 
              onChange={(e) => setSandFraktion(e.target.value as '0/4' | '0/2')}
              className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
            >
              <option value="0/4">0/4 und 4/8</option>
              <option value="0/2">0/2 und 2/8</option>
            </select>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Slider label={inhalt.werte.rohdichteGestein} info={inhalt.werte.normalbeton265Kg} min={0.5} max={3.0} step={0.05} value={rhoGestein} unit="kg/dm3" onChange={(e) => setRhoGestein(Number(e.target.value))} />
          <Slider label={`Feinanteil im Sand (${sandFraktion})`} info={inhalt.werte.sogenanntesMehlkornKorngröße0} min={0} max={15} step={0.5} value={feinanteilSand} unit="M.-%" onChange={(e) => setFeinanteilSand(Number(e.target.value))} />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="bg-white p-3 rounded-lg border border-home-grau/30">
            <Slider label={`Fraktion ${sandFraktion === '0/4' ? '0/4' : '0/2'}`} info={inhalt.werte.gewichtsanteilDesSandsAn} min={0} max={100} step={1} value={f04} unit="M.-%" onChange={(e) => setF04(Number(e.target.value))} />
            <div className="mt-3 pt-3 border-t border-home-grau/10">
              <Slider label="Gesamtfeuchte" info={inhalt.werte.gesamterWassergehaltDerGesteinskörnung} min={0} max={30} step={0.1} value={feuchte04} unit="M.-%" onChange={(e) => setFeuchte04(Number(e.target.value))} />
              <div className="mt-2"><Slider label={inhalt.werte.kernfeuchteWa} info={inhalt.werte.durchAbsorptionImKorninneren} min={0} max={30} step={0.1} value={wa04} unit="M.-%" onChange={(e) => setWa04(Number(e.target.value))} /></div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-home-grau/30">
            <Slider info={inhalt.werte.gewichtsanteilDerFeinenKiesfraktion} label={`Fraktion ${sandFraktion === '0/4' ? '4/8' : '2/8'}`} min={0} max={100} step={1} value={f48} unit="M.-%" onChange={(e) => setF48(Number(e.target.value))} />
            <div className="mt-3 pt-3 border-t border-home-grau/10">
              <Slider label="Gesamtfeuchte" info={inhalt.werte.gesamterWassergehaltDerKiesfraktion} min={0} max={30} step={0.1} value={feuchte48} unit="M.-%" onChange={(e) => setFeuchte48(Number(e.target.value))} />
              <div className="mt-2"><Slider label={inhalt.werte.kernfeuchteWa2} info={inhalt.werte.wasseraufnahmeWa24BeiNegativer} min={0} max={30} step={0.1} value={wa48} unit="M.-%" onChange={(e) => setWa48(Number(e.target.value))} /></div>
            </div>
          </div>
          {groesstkorn >= 16 && (
            <div className="bg-white p-3 rounded-lg border border-home-grau/30">
              <Slider label={inhalt.werte.fraktion816} info={inhalt.werte.gewichtsanteilDerGrobenKiesfraktion} min={0} max={100} step={1} value={f816} unit="M.-%" onChange={(e) => setF816(Number(e.target.value))} />
              <div className="mt-3 pt-3 border-t border-home-grau/10">
                <Slider label="Gesamtfeuchte" info={inhalt.werte.gesamterWassergehaltDerGesteinskörnung2} min={0} max={30} step={0.1} value={feuchte816} unit="M.-%" onChange={(e) => setFeuchte816(Number(e.target.value))} />
                <div className="mt-2"><Slider label={inhalt.werte.kernfeuchteWa3} info={inhalt.werte.durchAbsorptionImKorninneren2} min={0} max={30} step={0.1} value={wa816} unit="M.-%" onChange={(e) => setWa816(Number(e.target.value))} /></div>
              </div>
            </div>
          )}
          {groesstkorn >= 32 && (
            <div className="bg-white p-3 rounded-lg border border-home-grau/30">
              <Slider label={inhalt.werte.fraktion1632} info={inhalt.werte.gewichtsanteilDerSehrGroben} min={0} max={100} step={1} value={f1632} unit="M.-%" onChange={(e) => setF1632(Number(e.target.value))} />
              <div className="mt-3 pt-3 border-t border-home-grau/10">
                <Slider label="Gesamtfeuchte" info={inhalt.werte.gesamterWassergehaltDerFraktion} min={0} max={30} step={0.1} value={feuchte1632} unit="M.-%" onChange={(e) => setFeuchte1632(Number(e.target.value))} />
                <div className="mt-2"><Slider label={inhalt.werte.kernfeuchteWa4} info={inhalt.werte.wasseraufnahmeWa24DerFraktion} min={0} max={30} step={0.1} value={wa1632} unit="M.-%" onChange={(e) => setWa1632(Number(e.target.value))} /></div>
              </div>
            </div>
          )}
        </div>
      </div>
      </NachErstemBild>

    </div>
  );
}
