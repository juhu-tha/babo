// Ausgelagert aus src/modules/Baustoffkenngroessen.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/baustoffkenngroessen/RechenbeispieleTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface RechenbeispieleTabProps {
  deltaLA: number;
  handleSaeulenMaterialChange: (mat: 'stahl' | 'alu' | 'holz' | 'beton' | 'custom') => void;
  saeulenA: number;
  saeulenE: number;
  saeulenF: number;
  saeulenFy: number;
  saeulenL0: number;
  saeulenMaterial: 'holz' | 'beton' | 'stahl' | 'alu' | 'custom';
  setSaeulenA: React.Dispatch<React.SetStateAction<number>>;
  setSaeulenE: React.Dispatch<React.SetStateAction<number>>;
  setSaeulenF: React.Dispatch<React.SetStateAction<number>>;
  setSaeulenFy: React.Dispatch<React.SetStateAction<number>>;
  setSaeulenL0: React.Dispatch<React.SetStateAction<number>>;
  strainA: number;
  strainAPromille: number;
  stressA: number;
  utilizationA: number;
}

export default function RechenbeispieleTab({ deltaLA, handleSaeulenMaterialChange, saeulenA, saeulenE, saeulenF, saeulenFy, saeulenL0, saeulenMaterial, setSaeulenA, setSaeulenE, setSaeulenF, setSaeulenFy, setSaeulenL0, strainA, strainAPromille, stressA, utilizationA }: RechenbeispieleTabProps) {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in" id="rechenbeispiele-container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        {/* Spalte 1: Eingabeparameter */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4 lg:col-span-1">
          <h3 className="text-md font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.eingabeparameterSäule} /></h3>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider"><MdText text={inhalt.texte.materialPreset} /></label>
            <select aria-label={inhalt.werte.materialPreset} 
              className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz text-xs font-semibold"
              value={saeulenMaterial}
              onChange={(e) => handleSaeulenMaterialChange(e.target.value as "stahl" | "holz" | "beton" | "custom" | "alu")}
            >
              <option value="beton">Beton (z.B. C30/37)</option>
              <option value="stahl">Baustahl S235</option>
              <option value="alu">Aluminium EN AW</option>
              <option value="holz">Nadelholz C24</option>
              <option value="custom">Spezifisch / Benutzerdefiniert</option>
            </select>
          </div>

          <Slider label={inhalt.werte.belastungF} min={50} max={2000} step={50} value={saeulenF} unit="kN" onChange={(e) => setSaeulenF(Number(e.target.value))} />
          
          <Slider label={inhalt.werte.querschnittsflächeA} min={10} max={2500} step={10} value={saeulenA} unit="cm²" onChange={(e) => setSaeulenA(Number(e.target.value))} />
          
          <Slider label={inhalt.werte.säulenhöheL} min={1.0} max={15.0} step={0.5} value={saeulenL0} unit="m" onChange={(e) => setSaeulenL0(Number(e.target.value))} />
          
          {saeulenMaterial === 'custom' && (
            <>
              <Slider label="E-Modul (E)" min={1000} max={250000} step={1000} value={saeulenE} unit="MPa" onChange={(e) => setSaeulenE(Number(e.target.value))} />
              <Slider label={inhalt.werte.grenzfestigkeitFK} min={5} max={500} step={5} value={saeulenFy} unit="MPa" onChange={(e) => setSaeulenFy(Number(e.target.value))} />
            </>
          )}
          
          {saeulenMaterial !== 'custom' && (
            <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/30 text-xs">
              <p className="font-semibold text-slate-700"><MdText text={inhalt.texte.festgelegteMaterialempfehlungen} /></p>
              <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600">
                <li>E-Modul: <strong>{saeulenE.toLocaleString('de-DE')} MPa</strong></li>
                <li><MdText text={inhalt.texte.druckfestigkeitFCrit} /><strong>{saeulenFy.toLocaleString('de-DE')} MPa</strong></li>
              </ul>
              <p className="mt-2 text-[11px] text-slate-500"><MdText text={inhalt.texte.charakteristischeWerteOhneTeilsicherheit} /></p>
            </div>
          )}
        </div>

        {/* Spalte 2 & 3: Berechnungen & Ergebnisse */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 lg:col-span-2">
          <h3 className="text-md font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.berechnungPhysikalischeAuswertung} /></h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Spannung */}
            <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.t1NormalspannungSigma} /></span>
              <InlineMath math="\sigma = \frac{F}{A}" />
              <div className="mt-3">
                <span className="text-[11px] text-slate-500 block">Rechnung:</span>
                <code className="text-xs text-shiraz font-bold block bg-white p-2 rounded border border-home-grau/30 mt-1 flex flex-col">
                  <span>({formatDeWert(saeulenF)}<MdText text={inhalt.texte.t10N} />{formatDeWert(saeulenA)} * 100) mm²</span>
                  <span className="text-shiraz font-black text-sm mt-0.5">= {formatDeZahl(stressA, 2)} MPa</span>
                </code>
              </div>
            </div>

            {/* Dehnung */}
            <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.t2ElastischeDehnungVarepsilon} /></span>
              <InlineMath math="\varepsilon = \frac{\sigma}{E}" />
              <div className="mt-3">
                <span className="text-[11px] text-slate-500 block">Rechnung:</span>
                <code className="text-xs text-shiraz font-bold block bg-white p-2 rounded border border-home-grau/30 mt-1 flex flex-col">
                  <span>{formatDeZahl(stressA, 2)} MPa / {saeulenE.toLocaleString('de-DE')} MPa</span>
                  <span className="text-shiraz font-black text-sm mt-0.5">= {formatDeZahl(strainA, 6)} ({formatDeZahl(strainAPromille, 3)} ‰)</span>
                </code>
              </div>
            </div>

            {/* Verkürzung */}
            <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.t3GesamteVerkürzungDelta} /></span>
              <InlineMath math="\Delta l = \varepsilon \cdot l_0" />
              <div className="mt-3">
                <span className="text-[11px] text-slate-500 block">Rechnung:</span>
                <code className="text-xs text-shiraz font-bold block bg-white p-2 rounded border border-home-grau/30 mt-1 flex flex-col">
                  <span>{formatDeZahl(strainA, 6)} * {formatDeWert(saeulenL0 * 1000)} mm</span>
                  <span className="text-shiraz font-black text-sm mt-0.5">= {formatDeZahl(deltaLA, 3)} mm</span>
                </code>
              </div>
            </div>

            {/* Ausnutzung */}
            <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.t4AuslastungsgradEta} /></span>
              <InlineMath math="\eta = \frac{\sigma}{f_{crit}} \cdot 100" />
              <div className="mt-3">
                <span className="text-[11px] text-slate-500 block">Rechnung:</span>
                <code className="text-xs font-bold block bg-white p-2 rounded border border-home-grau/30 mt-1 flex flex-col" style={{ color: utilizationA > 100 ? '#A3113E' : '#475569' }}>
                  <span>({formatDeZahl(stressA, 2)} / {formatDeWert(saeulenFy)}) * 100</span>
                  <span className="font-black text-sm mt-0.5">= {formatDeZahl(utilizationA, 1)} %</span>
                </code>
              </div>
            </div>
          </div>

          {/* Grafische Zusammenfassung & Status */}
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center gap-4 justify-between mt-2 ${
            utilizationA > 100 ? 'bg-rose-50 border-rose-300' : 'bg-emerald-50 border-emerald-300'
          }`}>
            <div className="text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                Tragfähigkeitsprüfung: {utilizationA > 100 ? 'Versagen ❌' : 'Tragfähig ✓'}
              </h4>
              <p className="text-slate-600 mt-1">
                {utilizationA > 100 
                  ? `Die Beanspruchung überschreitet die materialspezifische Druckfestigkeit von ${formatDeWert(saeulenFy)} MPa. Vergrößern Sie die Säulenfläche oder verringern Sie die Tragkraft.` 
                  : inhalt.werte.dieSäuleTrägtDie}
              </p>
            </div>
            <div className="shrink-0 text-center w-full md:w-auto">
              <div className="text-3xl font-extrabold text-slate-800">{formatDeZahl(utilizationA, 0)}%</div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Ausnutzungsgrad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
