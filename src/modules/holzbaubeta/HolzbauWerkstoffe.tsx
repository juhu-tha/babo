import { Table, Search, Droplets } from 'lucide-react';
import { woodMaterials } from './daten';
import { formatDeWert, formatDeTeXWert, formatDeZahl } from '@/src/utils/numberFormat';
import { InlineMath } from 'react-katex';
import type { Dispatch, SetStateAction } from 'react';
import type { DataholzConstruction } from './daten';
import inhalt from '@/content/holzbaubeta/HolzbauWerkstoffe.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

interface HolzbauWerkstoffeProps {
  activeConstruction: DataholzConstruction;
  dbSearch: string;
  dbTypeFilter: string;
  filteredConstructions: DataholzConstruction[];
  selectedConst: string;
  setDbSearch: Dispatch<SetStateAction<string>>;
  setDbTypeFilter: Dispatch<SetStateAction<string>>;
  setSelectedConst: Dispatch<SetStateAction<string>>;
  setShreB: Dispatch<SetStateAction<number>>;
  setShreBDir: Dispatch<SetStateAction<string>>;
  setShreH: Dispatch<SetStateAction<number>>;
  setShreHDir: Dispatch<SetStateAction<string>>;
  setShreUEnd: Dispatch<SetStateAction<number>>;
  setShreUStart: Dispatch<SetStateAction<number>>;
  setShreWoodType: Dispatch<SetStateAction<string>>;
  shreB: number;
  shreBDir: string;
  shreH: number;
  shreHDir: string;
  shreUEnd: number;
  shreUStart: number;
  shreWoodType: string;
  shrinkResults: { coeffs: { radial: number; tangential: number; longitudinal: number; label: string; }; deltaU: number; alpha_b: number; alpha_h: number; deltaB: number; deltaH: number; finalB: number; finalH: number; isShrink: boolean; isSwell: boolean; isNoChange: boolean; };
}

export default function HolzbauWerkstoffe({ activeConstruction, dbSearch, dbTypeFilter, filteredConstructions, selectedConst, setDbSearch, setDbTypeFilter, setSelectedConst, setShreB, setShreBDir, setShreH, setShreHDir, setShreUEnd, setShreUStart, setShreWoodType, shreB, shreBDir, shreH, shreHDir, shreUEnd, shreUStart, shreWoodType, shrinkResults }: HolzbauWerkstoffeProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_materials">

        {/* Section: Standard Timber Grades */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-black text-text-main text-base flex items-center gap-2 border-b border-home-grau/20 pb-2">
            <Table size={18} className="text-amber-800" /><MdText text={inhalt.texte.charakteristischeFestigkeitswerteNachDin} /></h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-home-grau/5 border-b border-home-grau/20">
                  <th className="py-2.5 px-3 font-semibold text-text-main">Klasse</th>
                  <th className="py-2.5 px-3 font-semibold text-text-main">Materialtyp</th>
                  <th className="py-2.5 px-3 font-semibold text-emerald-800"><MdText text={inhalt.texte.fMKBiegung} /></th>
                  <th className="py-2.5 px-3 font-semibold text-text-main"><MdText text={inhalt.texte.fT0K} /></th>
                  <th className="py-2.5 px-3 font-semibold text-text-main"><MdText text={inhalt.texte.fC0K} /></th>
                  <th className="py-2.5 px-3 font-semibold text-text-main"><MdText text={inhalt.texte.fVKScheren} /></th>
                  <th className="py-2.5 px-3 font-semibold text-text-main"><MdText text={inhalt.texte.e0MeanE} /></th>
                  <th className="py-2.5 px-3 font-semibold text-text-main"><MdText text={inhalt.texte.kCharakt} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/10">
                {woodMaterials.map(m => (
                  <tr key={m.class} className="hover:bg-off-white/50">
                    <td className="py-2 px-3 font-bold text-text-main font-mono">{m.class}</td>
                    <td className="py-2 px-3 text-text-main/80 font-medium">{m.type}</td>
                    <td className="py-2 px-3 font-bold text-emerald-700 font-mono">{formatDeWert(m.f_mk)} N/mm²</td>
                    <td className="py-2 px-3 font-mono text-text-main/70">{formatDeWert(m.f_t0k)} N/mm²</td>
                    <td className="py-2 px-3 font-mono text-text-main/70">{formatDeWert(m.f_c0k)} N/mm²</td>
                    <td className="py-2 px-3 font-mono text-text-main/70">{formatDeWert(m.f_vk)} N/mm²</td>
                    <td className="py-2 px-3 font-mono text-text-main/70">{formatDeWert(m.E_0mean)} N/mm²</td>
                    <td className="py-2 px-3 font-mono text-text-main/70">{formatDeWert(m.rho_k)} kg/m³</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-text-main/50 leading-relaxed font-medium"><MdText text={inhalt.texte.hinweisCharakteristischeWerte5} /></p>
        </div>

        {/* Section: dataholz.eu Explorer */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-black text-amber-800 tracking-wider">Planungs-Tool</span>
              <span className="text-[10px] font-bold text-emerald-700 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100"><MdText text={inhalt.texte.dataholzEuLizenzStandard} /></span>
            </div>
            <h3 className="font-extrabold text-text-main text-base mt-1"><MdText text={inhalt.texte.interaktiverDataholzEuBauteilexplorer} /></h3>
            <p className="text-xs text-text-main/70 leading-relaxed mt-1"><MdText text={inhalt.texte.beispielaufbautenZurLehreAngelehnt} /></p>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-off-white p-3.5 rounded-xl border border-home-grau/20">
            <AuswahlGruppe label="Filter Bauteil" className="flex flex-wrap gap-2">
              <button {...alsOption(dbTypeFilter === 'all')}
                onClick={() => setDbTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbTypeFilter === 'all' 
                      ? 'bg-shiraz text-white border-shiraz' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
              ><MdText text={inhalt.texte.alleBauteile} /></button>
              <button {...alsOption(dbTypeFilter === 'Aussenwand')}
                onClick={() => setDbTypeFilter('Aussenwand')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbTypeFilter === 'Aussenwand' 
                      ? 'bg-shiraz text-white border-shiraz' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
              >
                Außenwände
              </button>
              <button {...alsOption(dbTypeFilter === 'Decke')}
                onClick={() => setDbTypeFilter('Decke')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbTypeFilter === 'Decke' 
                      ? 'bg-shiraz text-white border-shiraz' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
              >
                Geschossdecken
              </button>
              <button {...alsOption(dbTypeFilter === 'Dach')}
                onClick={() => setDbTypeFilter('Dach')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    dbTypeFilter === 'Dach' 
                      ? 'bg-shiraz text-white border-shiraz' 
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-home-grau/10'
                  }`}
              >
                Dächer
              </button>
            </AuswahlGruppe>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-home-grau" />
              <input
                type="text"
                placeholder={inhalt.werte.aufbautenFiltern}
                value={dbSearch}
                onChange={(e) => setDbSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1 border border-home-grau/30 rounded-lg text-text-main bg-white"
              />
            </div>
          </div>

          {/* Split Details view */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Item Buttons (span 5) */}
            <AuswahlGruppe label="Konstruktion" className="lg:col-span-5 flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2">
              {filteredConstructions.map(c => (
                <button {...alsOption(selectedConst === c.id)}
                  key={c.id}
                  onClick={() => setSelectedConst(c.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                      selectedConst === c.id
                        ? 'bg-amber-50/50 border-amber-600 ring-1 ring-amber-600 shadow-xs'
                        : 'bg-white border-home-grau/25 hover:border-home-grau/40'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-text-main leading-tight">{c.name}</span>
                    <span className="text-[8px] font-black uppercase text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                      {c.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-main/60 line-clamp-1">{c.structure}</p>
                  <div className="flex justify-between items-center text-[10px] text-text-main/40 mt-1 font-mono font-medium">
                    <span>U-Wert: {formatDeWert(c.uValue)} W/(m²K)</span>
                    <span>Brand: {c.fireClass}</span>
                  </div>
                </button>
              ))}
            </AuswahlGruppe>

            {/* Right Detail Sheet (span 7) */}
            <div className="lg:col-span-7 bg-off-white p-5 rounded-xl border border-home-grau/35 flex flex-col gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider"><MdText text={inhalt.texte.schnittaufbauUndBauphysikalischeParamete} /></span>
                <h4 className="font-extrabold text-sm text-text-main mt-0.5">{activeConstruction.name}</h4>
                <p className="text-xs text-text-main/60 leading-normal mt-1">{activeConstruction.structure}</p>
              </div>

              {/* Rating blocks */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-xs text-center">
                  <span className="text-[9px] text-text-main/40 font-bold block"><MdText text={inhalt.texte.wärmeschutzU} /></span>
                  <span className="font-mono text-xs font-black text-emerald-700 block mt-0.5">{formatDeWert(activeConstruction.uValue)} W/(m²K)</span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-xs text-center">
                  <span className="text-[9px] text-text-main/40 font-bold block">Brandschutzklasse</span>
                  <span className="font-mono text-xs font-black text-rose-700 block mt-0.5">{activeConstruction.fireClass}</span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 shadow-xs text-center">
                  <span className="text-[9px] text-text-main/40 font-bold block"><MdText text={inhalt.texte.schallschutzRw} /></span>
                  <span className="font-mono text-xs font-black text-blue-700 block mt-0.5">{formatDeWert(activeConstruction.soundRating)} dB</span>
                </div>
              </div>

              {/* Layer configurations List */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-text-main/50"><MdText text={inhalt.texte.schichtenverlaufVonAußenNach} /></span>
                <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {activeConstruction.components.map((layer, index) => (
                    <div key={index} className="flex gap-2 text-xs bg-white p-2 rounded border border-home-grau/10">
                      <span className="w-5 h-5 bg-home-grau/10 rounded font-mono font-bold text-[10px] flex items-center justify-center text-text-main/70 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-text-main/80 leading-normal">{layer}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* NEW INTERACTIVE: Hygroskopie & Dimensionsänderung Rechner */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
          <div>
            <span className="text-xs uppercase font-black text-amber-800 tracking-wider"><MdText text={inhalt.texte.werkstoffprüfungHolzphysik} /></span>
            <h3 className="font-extrabold text-text-main text-base mt-1 flex items-center gap-2">
              <Droplets size={20} className="text-blue-600" /><MdText text={inhalt.texte.holzfeuchteSchwindQuellverhaltenRechner} /></h3>
            <p className="text-xs text-text-main/70 leading-relaxed mt-1"><MdText text={inhalt.texte.holzIstEinHygroskopischer} /></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Parameter Inputs (span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-4 bg-off-white p-4 rounded-xl border border-home-grau/20">
              <h4 className="font-bold text-xs uppercase tracking-wider text-text-main">Eingabeparameter</h4>

              {/* Species Select */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.hölzerHolzart} /></label>
                <select aria-label={inhalt.werte.hölzerHolzart}
                  value={shreWoodType}
                  onChange={(e) => setShreWoodType(e.target.value)}
                  className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                >
                  <option value="fichte">Fichte / Tanne (Standard Nadelholz)</option>
                  <option value="kiefer">Kiefer</option>
                  <option value="laerche">Lärche (Beliebt im Außenbereich)</option>
                  <option value="buche">Buche (Sehr starkes Quellen/Schwinden)</option>
                  <option value="eiche">Eiche (Träges Feuchteverhalten)</option>
                </select>
              </div>

              {/* Moisture values slider or numeric */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.anfangsfeuchteU} /></label>
                  <input aria-label={inhalt.werte.anfangsfeuchteU}
                    type="number"
                    min="0"
                    max="40"
                    value={shreUStart}
                    onChange={(e) => setShreUStart(Math.max(0, parseInt(e.target.value) || 0))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.zielEndfeuchteU} /></label>
                  <input aria-label={inhalt.werte.zielEndfeuchteU}
                    type="number"
                    min="0"
                    max="40"
                    value={shreUEnd}
                    onChange={(e) => setShreUEnd(Math.max(0, parseInt(e.target.value) || 0))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white font-bold"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.breiteBMm} /></label>
                  <input aria-label={inhalt.werte.breiteBMm}
                    type="number" min="0"
                    value={shreB}
                    onChange={(e) => setShreB(Math.max(1, parseInt(e.target.value) || 0))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main">Höhe h (mm)</label>
                  <input aria-label="Höhe h (mm)"
                    type="number" min="0"
                    value={shreH}
                    onChange={(e) => setShreH(Math.max(1, parseInt(e.target.value) || 0))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white font-semibold"
                  />
                </div>
              </div>

              {/* Ring structure orientations */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.ringausrichtBreite} /></label>
                  <select aria-label={inhalt.werte.ringausrichtBreite}
                    value={shreBDir}
                    onChange={(e) => setShreBDir(e.target.value)}
                    className="border border-home-grau/30 bg-white text-xs p-1.5 rounded-lg text-text-main"
                  >
                    <option value="radial">Radial stehend (gering)</option>
                    <option value="tangential">Tangential liegend (stark)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.ringausrichtHöhe} /></label>
                  <select aria-label={inhalt.werte.ringausrichtHöhe}
                    value={shreHDir}
                    onChange={(e) => setShreHDir(e.target.value)}
                    className="border border-home-grau/30 bg-white text-xs p-1.5 rounded-lg text-text-main"
                  >
                    <option value="radial">Radial stehend (gering)</option>
                    <option value="tangential">Tangential liegend (stark)</option>
                    <option value="longitudinal">Longitudinal / Axial (kaum)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Outputs and 2D Visualizer (span 7) */}
            <div className="lg:col-span-7 bg-blue-50/20 border border-blue-200/50 p-5 rounded-xl flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block mb-1">Berechnungsergebnisse</span>
                <p className="text-xs text-text-main/80 font-semibold mb-2"><MdText text={inhalt.texte.berechneteKennwerteFür} /><span className="text-amber-800 font-bold">{shrinkResults.coeffs.label}</span>:
                </p>

                <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-home-grau/15">
                  <div className="text-xs">
                    <span className="text-text-main/50 font-bold block text-[10px] uppercase"><MdText text={inhalt.texte.schwindkoeffizienten} /></span>
                    <div>&bull; Breite (<span className="font-mono text-[11px] font-bold">{shreBDir}</span>): <span className="font-mono font-bold">{formatDeWert(shrinkResults.alpha_b)}%</span></div>
                    <div>&bull; Höhe (<span className="font-mono text-[11px] font-bold">{shreHDir}</span>): <span className="font-mono font-bold">{formatDeWert(shrinkResults.alpha_h)}%</span></div>
                  </div>
                  <div className="text-xs border-l border-home-grau/10 pl-3">
                    <span className="text-text-main/50 font-bold block text-[10px] uppercase">Feuchteänderung:</span>
                    <div className="font-medium text-text-main">
                      <span className="font-mono font-bold text-blue-800">{formatDeWert(shreUStart)}%</span> zu <span className="font-mono font-bold text-blue-800">{formatDeWert(shreUEnd)}%</span> (<InlineMath math={`\\Delta u = ${formatDeTeXWert(shrinkResults.deltaU)}\\%`} />)
                    </div>
                    {(shreUStart > 30 || shreUEnd > 30) ? (
                      <span className="text-[9px] text-amber-700 bg-amber-50 px-1 rounded block leading-tight mt-1"><MdText text={inhalt.texte.überFasersättigung30Erfolgt} /></span>
                    ) : null}
                  </div>
                </div>

                <ErgebnisAnsage text={kurzzeile(ansageWert('Änderung Breite', shrinkResults.deltaB, 2, 'mm'), ansageWert('neue Breite', shrinkResults.finalB, 1, 'mm'), ansageWert('Änderung Höhe', shrinkResults.deltaH, 2, 'mm'), ansageWert('neue Höhe', shrinkResults.finalH, 1, 'mm'))} />
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-white p-3 rounded-lg border border-home-grau/10 text-center">
                    <span className="text-[10px] text-text-main/50 font-black block"><MdText text={inhalt.texte.änderungBreiteB} /></span>
                    <span className={`text-sm font-mono font-black ${shrinkResults.deltaB < 0 ? 'text-rose-700' : shrinkResults.deltaB > 0 ? 'text-emerald-700' : 'text-stone-500'}`}>
                      {formatDeZahl(shrinkResults.deltaB, 2)} mm
                    </span>
                    <span className="text-[10px] text-text-main/40 block mt-0.5">({formatDeZahl(shrinkResults.finalB, 1)} mm)</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-home-grau/10 text-center">
                    <span className="text-[10px] text-text-main/50 font-black block"><MdText text={inhalt.texte.änderungHöheH} /></span>
                    <span className={`text-sm font-mono font-black ${shrinkResults.deltaH < 0 ? 'text-rose-700' : shrinkResults.deltaH > 0 ? 'text-emerald-700' : 'text-stone-500'}`}>
                      {formatDeZahl(shrinkResults.deltaH, 2)} mm
                    </span>
                    <span className="text-[10px] text-text-main/40 block mt-0.5">({formatDeZahl(shrinkResults.finalH, 1)} mm)</span>
                  </div>
                </div>
              </div>

              {/* 2D Contour Visualizer representing wood cells contraction */}
              <div className="border border-home-grau/20 bg-white p-4 rounded-xl flex flex-col items-center justify-center gap-2">
                <span className="text-[9px] text-text-main/40 font-bold uppercase tracking-wider block"><MdText text={inhalt.texte.maßstabsbereinigte2dQuerschnittsänderung} /></span>

                {/* Visualizer SVG */}
                <div className="relative w-44 h-28 border border-dashed border-stone-300 rounded flex items-center justify-center bg-stone-50/50">
                  {/* Reference (original dim, gray outline) */}
                  <div className="absolute w-[80px] h-[60px] border-2 border-stone-400 bg-transparent opacity-20 block rounded" />

                  {/* Actual/Final dim (colored block) */}
                  <div 
                    className={`border-2 duration-300 rounded transition-all ${
                        shrinkResults.isShrink 
                          ? 'bg-rose-50 border-rose-600 shadow-sm' 
                          : shrinkResults.isSwell 
                          ? 'bg-emerald-50 border-emerald-600 shadow-sm' 
                          : 'bg-stone-100 border-stone-600'
                      }`}
                    style={{
                      width: `${Math.max(10, 80 * (shrinkResults.finalB / (shreB || 1)))}px`,
                      height: `${Math.max(10, 60 * (shrinkResults.finalH / (shreH || 1)))}px`
                    }}
                  />

                  {/* Quick indicator arrows */}
                  <span className="absolute bottom-[2px] right-2 text-[9px] font-mono font-bold text-text-main/50">
                    Original: {formatDeWert(shreB)}x{formatDeWert(shreH)}
                  </span>
                </div>

                <p className="text-[10px] text-text-main/70 text-center italic leading-tight">
                  {shrinkResults.isShrink ? (
                    <span className="text-rose-800 font-bold"><MdText text={inhalt.texte.dasHolzSchwindetEs} /></span>
                  ) : shrinkResults.isSwell ? (
                    <span className="text-emerald-800 font-bold"><MdText text={inhalt.texte.dasHolzQuilltAuf} /></span>
                  ) : (
                    <span><MdText text={inhalt.texte.keineDimensionsänderungGleichgewicht} /></span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
}
