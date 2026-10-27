import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Timer, Activity, Layers, Clock, Sliders } from 'lucide-react';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/kriechenschwinden/KriechenSchwinden.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { kriechSchwindModell, kriechSchwindVerlauf, relaxationsVerlauf, stuetzenVerformung, STUETZE_LEHRWERTE, type Zementklasse, type Relaxationsklasse } from '@/src/calc/kriechenSchwinden';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Rechnung: src/calc/kriechenSchwinden.ts (DIN EN 1992-1-1, 3.1.4, 3.3.2 und Anhang B), geprüft in tests/kriechenSchwinden.test.ts

const REITER = [
  { id: 'beton', label: 'Beton', icon: Activity },
  { id: 'stahl', label: 'Spannstahl', icon: Layers },
  { id: 'rheologie', label: inhalt.texte.rheologieSäulenverformung, icon: Sliders },
] as const;

export default function KriechenSchwinden() {
  // Eingebettet in Hydratation & Folgen: Quellenblock dort zentral
  const { activeTab: aktiverReiter } = useTabContext();
  const eingebettet = aktiverReiter === 'hydratation_folgen';
  const [material, setMaterial] = useState<'beton' | 'stahl' | 'rheologie'>('beton');

  // Beton States
  const [fck, setFck] = useState(30);
  const [rh, setRh] = useState(50);
  const [h0, setH0] = useState(200);
  const [t0, setT0] = useState(28);
  const [zementArt, setZementArt] = useState<Zementklasse>('N');
  const [ts, setTs] = useState(7);

  // Stahl States
  const [sigmaRatio, setSigmaRatio] = useState(0.7);
  const [stahlKlasse, setStahlKlasse] = useState<Relaxationsklasse>('2'); // 1: Draht, 2: Litze, 3: Stab

  const calculateBeton = () => {
    const m = kriechSchwindModell({ fck, rh, h0, t0, ts, zement: zementArt });
    const v = kriechSchwindVerlauf(m);
    return {
      labels: v.zeitpunkte, creepData: v.kriechzahl, shrinkageData: v.trocknung, autogenData: v.autogen,
      totalShrinkData: v.gesamt, relaxationData: v.eModulWirksam, Ecm: m.Ecm, m,
    };
  };

  // Relaxation von Spannstahl nach DIN EN 1992-1-1, 3.3.2 (Gl. 3.28–3.30), Zeitpunkte in Stunden
  const calculateStahl = () => {
    const r = relaxationsVerlauf(stahlKlasse, sigmaRatio);
    return { labels: r.zeitpunkteH, relaxationData: r.verlustProzent, hinweise: r.hinweise };
  };

  const renderBeton = () => {
    const { labels, creepData, shrinkageData, autogenData, totalShrinkData, relaxationData, Ecm, m } = calculateBeton();

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.eingabeparameterBeton} /></h2>
      

            
            <Slider info={inhalt.werte.charakteristischeZylinderdruckfestigkeit}
              label={<FormulaText text={inhalt.werte.betondruckfestigkeitFCk} />}
              min={12} max={90} step={1}
              value={fck} unit="MPa"
              
              onChange={(e) => setFck(Number(e.target.value))}
            />
            
            <Slider info={inhalt.werte.umgebungsfeuchteImJahresmittelBspw}
              label={<FormulaText text={inhalt.werte.relativeLuftfeuchtigkeitRh} />}
              min={20} max={100} step={5}
              value={rh} unit="%"
              
              onChange={(e) => setRh(Number(e.target.value))}
            />
            
            <Slider info={inhalt.werte.wirksameQuerschnittsdickeH0}
              label={<FormulaText text={inhalt.werte.wirksameBauteildickeH0} />}
              min={50} max={1000} step={10}
              value={h0} unit="mm"
              
              onChange={(e) => setH0(Number(e.target.value))}
            />

            <Slider info={inhalt.werte.betonalterZumZeitpunktDer}
              label={<FormulaText text={inhalt.werte.belastungsalterT0} />}
              min={1} max={365} step={1}
              value={t0} unit="Tage"
              
              onChange={(e) => setT0(Number(e.target.value))}
            />

            <Slider info={inhalt.werte.endeDerNachbehandlungBeginn}
              label={<FormulaText text={inhalt.werte.trocknungsbeginnTS} />}
              min={1} max={28} step={1}
              value={ts} unit="Tage"
              onChange={(e) => setTs(Number(e.target.value))}
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main">Zementklasse</label><InfoTooltip text={inhalt.werte.sLangsamNNormal} /></div>
              </div>
              <select aria-label="Zementklasse" 
                className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                value={zementArt}
                onChange={(e) => setZementArt(e.target.value as Zementklasse)}
              >
                <option value="S">Klasse S (langsam)</option>
                <option value="N">Klasse N (normal)</option>
                <option value="R">Klasse R (schnell)</option>
              </select>
            </div>
            <EingabeHinweise hinweise={m.hinweise} />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-home-grau/30"><span className="text-text-main/60 block"><MdText text={inhalt.texte.t10000DT} /></span><strong className="font-mono text-shiraz text-base">{formatDeZahl(creepData[creepData.length - 1], 2)}</strong></div>
              <div className="bg-white p-3 rounded-xl border border-home-grau/30"><span className="text-text-main/60 block"><MdText text={inhalt.texte.cd10000D} /></span><strong className="font-mono text-base">{formatDeZahl(shrinkageData[shrinkageData.length - 1], 0)} µm/m</strong></div>
              <div className="bg-white p-3 rounded-xl border border-home-grau/30"><span className="text-text-main/60 block">ε_ca,∞</span><strong className="font-mono text-base">{formatDeZahl(m.epsCaInf * 1e6, 0)} µm/m</strong></div>
              <div className="bg-white p-3 rounded-xl border border-home-grau/30"><span className="text-text-main/60 block"><MdText text={inhalt.texte.kHCd0} /></span><strong className="font-mono text-base">{formatDeZahl(m.kh, 2)} · {formatDeZahl(m.epsCd0 * 1e6, 0)}</strong></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[300px]">
                <h2 className="text-lg font-bold text-text-main mb-2"><FormulaText text="Kriechzahl \varphi(t, t_0)" /></h2>
                <div className="flex-1 relative w-full h-full">
                  <Line 
                    data={{
                      labels,
                      datasets: [{
                        label: inhalt.werte.kriechzahl,
                        data: creepData,
                        borderColor: '#A3113E',
                        borderWidth: 2,
                        pointRadius: 0,
                      }]
                    }} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { type: 'logarithmic', title: { display: true, text: inhalt.werte.betonalterTTage }, min: 1 },
                        y: { min: 0, title: { display: true, text: inhalt.werte.kriechzahl2 } }
                      },
                      plugins: { legend: { display: false } }
                    }} 
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[300px]">
                <h2 className="text-lg font-bold text-text-main mb-2"><FormulaText text={inhalt.werte.schwindenCsCdCa} /></h2>
                <div className="flex-1 relative w-full h-full">
                  <Line 
                    data={{
                      labels,
                      datasets: [
                        { label: inhalt.werte.trocknungsschwindenCd, data: shrinkageData, borderColor: '#0e558c', borderWidth: 2, pointRadius: 0 },
                        { label: inhalt.werte.autogenesSchwindenCa, data: autogenData, borderColor: '#a855f7', borderWidth: 2, pointRadius: 0, borderDash: [4, 3] },
                        { label: inhalt.werte.gesamtschwindenCs, data: totalShrinkData, borderColor: '#0f172a', borderWidth: 2.5, pointRadius: 0 }
                      ]
                    }} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { type: 'logarithmic', title: { display: true, text: inhalt.werte.betonalterTTage2 }, min: 1 },
                        y: { min: 0, title: { display: true, text: inhalt.werte.schwinddehnungMM } }
                      },
                      plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } }
                    }} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[300px]">
              <h2 className="text-lg font-bold text-text-main mb-2"><FormulaText text={inhalt.werte.wirksamerEModulE} /></h2>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={{
                    labels,
                    datasets: [{
                      label: inhalt.werte.wirksamerEModulEc,
                      data: relaxationData,
                      borderColor: '#10b981',
                      borderWidth: 2,
                      pointRadius: 0,
                    }]
                  }} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { type: 'logarithmic', title: { display: true, text: inhalt.werte.betonalterTTage3 }, min: 1 },
                      y: { min: 0, max: Ecm * 1.1, title: { display: true, text: inhalt.werte.modulRMpa } }
                    },
                    plugins: { legend: { display: false } }
                  }} 
                />
              </div>
              <p className="text-xs text-text-main/70 mt-2"><MdText text={inhalt.texte.fürVerformungenUnterDauerlast} /><FormulaText text="E_{c,eff} = E_{cm} / (1 + \varphi(t, t_0))" /><MdText text={inhalt.texte.angesetztFürZwangsspannungenRelaxation} /><FormulaText text="E_{cm} / (1 + \rho \varphi)" /><MdText text={inhalt.texte.mitDemRelaxationsbeiwert0} /></p>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungKriechenSchwinden} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kriechen */}
                <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                  <div className="text-sm font-bold mb-2"><MdText text={inhalt.texte.kriechenUnterLast} /></div>
                  <svg width="100%" height="100" viewBox="0 0 200 100">
                    {/* t=0 */}
                    <rect x="20" y="20" width="60" height="60" fill="#cbd5e1" stroke="#94a3b8" />
                    <path d="M 50 20 L 50 5" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)" />
                    <text x="50" y="95" fontSize="10" fill="#64748b" textAnchor="middle">t = t_0</text>
                    
                    {/* Pfeil */}
                    <path d="M 90 50 L 110 50" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-gray)" />
                    
                    {/* t=inf */}
                    <rect x="120" y="30" width="60" height="50" fill="#94a3b8" stroke="#64748b" />
                    <path d="M 150 30 L 150 15" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)" />
                    <text x="150" y="95" fontSize="10" fill="#64748b" textAnchor="middle">t = ∞</text>
                    
                    {/* Verformung */}
                    <path d="M 185 20 L 185 30" stroke="#3b82f6" strokeWidth="1" markerStart="url(#arrow-blue)" markerEnd="url(#arrow-blue)" />
                    <text x="190" y="28" fontSize="10" fill="#3b82f6">Δl</text>
                  </svg>
                  <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.zusätzlicheVerformungBeiKonstanter} /></div>
                </div>

                {/* Schwinden */}
                <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                  <div className="text-sm font-bold mb-2"><MdText text={inhalt.texte.schwindenOhneLast} /></div>
                  <svg width="100%" height="100" viewBox="0 0 200 100">
                    {/* t=0 */}
                    <rect x="20" y="20" width="60" height="60" fill="#cbd5e1" stroke="#94a3b8" />
                    <text x="50" y="95" fontSize="10" fill="#64748b" textAnchor="middle">t = 0 (feucht)</text>
                    
                    {/* Pfeil */}
                    <path d="M 90 50 L 110 50" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-gray)" />
                    <path d="M 100 40 Q 110 20 120 30" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" markerEnd="url(#arrow-blue)" />
                    <text x="110" y="20" fontSize="8" fill="#3b82f6">H₂O</text>

                    {/* t=inf */}
                    <rect x="125" y="25" width="50" height="50" fill="#94a3b8" stroke="#64748b" />
                    <text x="150" y="95" fontSize="10" fill="#64748b" textAnchor="middle">t = ∞ (trocken)</text>

                    <defs>
                      <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                      </marker>
                      <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                      </marker>
                      <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                      </marker>
                    </defs>
                  </svg>
                  <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.volumenverringerungDurchFeuchtigkeitsabg} /></div>
                </div>
              </div>
            </div>

            {/* --- Neu: Detaillierte Darstellung aller 5 Schwindarten --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="font-bold text-lg text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
                <span>🌊</span><MdText text={inhalt.texte.die5ArtenDes} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.unterSchwindenVerstehtMan} /></p>
        </div>

              <div className="grid grid-cols-1 gap-4 mt-1">
                {/* 1. Plastisches Schwinden */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.t1PlastischesSchwindenKapillarschwinden} /></span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[9px] font-bold"><MdText text={inhalt.texte.stadiumFrischbeton} /></span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1"><MdText text={inhalt.texte.ursacheTrittInDen} /></p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans"><MdText text={inhalt.texte.gegenmaßnahmeFrühzeitigeNachbehandlungAb} /></p>
                </div>

                {/* 2. Autogenes Schwinden */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.t2AutogenesSchwindenSelbstaustrocknung} /></span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[9px] font-bold"><MdText text={inhalt.texte.stadiumErsteTageWochen} /></span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1"><MdText text={inhalt.texte.ursacheSelbstaustrocknungDieHydratation} /></p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans"><MdText text={inhalt.texte.gegenmaßnahmeInnereNachbehandlungMit} /></p>
                </div>

                {/* 3. Trocknungsschwinden */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.t3TrocknungsschwindenDryingShrinkage} /></span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-[9px] font-bold"><MdText text={inhalt.texte.stadiumLangzeitJahre} /></span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1"><MdText text={inhalt.texte.ursacheLangsameAbgabeVon} /></p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans"><MdText text={inhalt.texte.gegenmaßnahmeGeringerZementleimUnd} /></p>
                </div>

                {/* 4. Chemische Schrumpfung */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.t4ChemischesSchwindenSchrumpfen} /></span>
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono text-[9px] font-bold"><MdText text={inhalt.texte.stadiumPermanentAktiv} /></span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1"><MdText text={inhalt.texte.ursacheDieHydratationsprodukteNehmen} /></p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans"><MdText text={inhalt.texte.gegenmaßnahmeNichtVermeidbarDie} /></p>
                </div>

                {/* 5. Karbonatisierungsschwinden */}
                <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.t5Karbonatisierungsschwinden} /></span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[9px] font-bold"><MdText text={inhalt.texte.stadiumLangzeitJahrzehnte} /></span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] pt-1"><MdText text={inhalt.texte.ursacheChemischeUmwandlungDes} /></p>
                  <p className="text-[10px] text-emerald-800 leading-relaxed pt-1 font-sans"><MdText text={inhalt.texte.gegenmaßnahmeDichterBetonNiedriger} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 mt-6">
          <FormulaDerivationBox
            title={inhalt.werte.anwendungsbeispielEndkriechzahlUndEndsch}
            zielGleichung="\varphi_0 = \varphi_{RH} \cdot \beta(f_{cm}) \cdot \beta(t_0), \quad \varepsilon_{cs,\infty} = k_h \cdot \varepsilon_{cd,0} + \varepsilon_{ca,\infty}"
            normQuelle={inhalt.werte.dinEn19921}
            schritte={inhalt.daten["renderBeton.schritte"]}
            ergebnisHinweis={inhalt.werte.eineStützeUnterC}
          />
        </div>

        <ModulTest moduleId="kriechen_schwinden" />

        {!eingebettet && (
<ModuleFooter weblinks={[{ title: inhalt.werte.betonWikiKriechen, url: "https://beton.wiki/index.php?title=Kriechen" }, { title: inhalt.werte.zementMerkblätterÜbersicht, url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }, { title: inhalt.werte.betonWikiSchwinden, url: "https://beton.wiki/index.php?title=Schwinden" }]} 
          wikipedia={[
                { title: inhalt.werte.kriechenWerkstoffe, url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
                { title: inhalt.werte.schwindenBeton, url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' }
              ]}
              regelwerke={inhalt.daten["renderBeton.regelwerke"]}
          literatur={inhalt.daten["renderBeton.literatur"]}
          formeln={inhalt.daten["renderBeton.formeln"]}
        />
)}
      </>
    );
  };

  const renderStahl = () => {
    const { labels, relaxationData, hinweise: stahlHinweise } = calculateStahl();

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.eingabeparameterSpannstahl} /></h2>
            
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.kriechenUndSchwindenSpielen} /></p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2"><label className="text-sm font-medium text-text-main"><MdText text={inhalt.texte.spannstahlklasseRelaxationsverhalten} /></label><InfoTooltip text={inhalt.werte.klassifizierungDesSpannstahlsNach} /></div>
              <select aria-label={inhalt.werte.spannstahlklasseRelaxationsverhalten} 
                className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
                value={stahlKlasse}
                onChange={(e) => setStahlKlasse(e.target.value as Relaxationsklasse)}
              >
                <option value="1">Klasse 1: Draht/Litze (normale Relaxation)</option>
                <option value="2">Klasse 2: Draht/Litze (niedrige Relaxation)</option>
                <option value="3">Klasse 3: warmgewalzte Stäbe</option>
              </select>
            </div>

            <Slider info={inhalt.werte.verhältnisDerEingetragenenVorspannung}
              label={<FormulaText text="Spannungsniveau (\sigma_{pi} / f_{pk})" />}
              min={0.4} max={0.8} step={0.05}
              value={sigmaRatio} unit="-"
              
              onChange={(e) => setSigmaRatio(Number(e.target.value))}
            />
            <EingabeHinweise hinweise={stahlHinweise} />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[400px]">
              <h2 className="text-xl font-bold text-text-main mb-2"><FormulaText text="Relaxationsverlust \Delta\sigma_{pr} / \sigma_{pi}" /></h2>
              <div className="flex-1 relative w-full h-full">
                <Line 
                  data={{
                    labels,
                    datasets: [{
                      label: inhalt.werte.spannungsverlust,
                      data: relaxationData,
                      borderColor: '#10b981',
                      borderWidth: 2,
                      pointRadius: 4,
                      pointBackgroundColor: '#10b981'
                    }]
                  }} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { type: 'logarithmic', title: { display: true, text: inhalt.werte.zeitTStunden } },
                      y: { min: 0, title: { display: true, text: inhalt.werte.spannungsverlust2 } }
                    },
                    plugins: { 
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => `Verlust: ${formatDeZahl(context.parsed.y, 2)}%`
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>

        {!eingebettet && (
<ModuleFooter 
          wikipedia={[
                { title: inhalt.werte.kriechenWerkstoffe2, url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
                { title: inhalt.werte.schwindenBeton2, url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' }
              ]}
              regelwerke={inhalt.daten["renderStahl.regelwerke"]}
          literatur={inhalt.daten["renderStahl.literatur"]}
          formeln={inhalt.daten["renderStahl.formeln"]}
        />
)}
      </>
    );
  };

  const renderRheologieSimulator = () => {
    // Current simulation time points
    const simDays = [
      { label: inhalt.werte.tStartLast, days: t0 },
      { label: '90 Tage', days: 90 },
      { label: inhalt.werte.t1Jahr365D, days: 365 },
      { label: inhalt.werte.t5Jahre1825D, days: 1825 },
      { label: inhalt.werte.t30Jahre10950D, days: 10950 },
      { label: inhalt.werte.t50Jahre18250D, days: 18250 },
    ];

    const m = kriechSchwindModell({ fck, rh, h0, t0, ts, zement: zementArt });
    const Ecm = m.Ecm;
    const sigmaC = STUETZE_LEHRWERTE.sigmaC; // MPa Dauerlastspannung (Lehrannahme)
    const L0_mm = STUETZE_LEHRWERTE.laengeMm; // 3 m Stützenhöhe
    const calcStateAt = (days: number) => stuetzenVerformung(m, days, sigmaC, L0_mm);

    const currentState = calcStateAt(simDays[timeIndex].days);

    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p><MdText text={inhalt.texte.rheologischerMechanismusStützenverformun} /></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/20 pb-2">
                <Clock size={16} className="text-shiraz" /><MdText text={inhalt.texte.t1BetrachtungszeitraumT} /></h3>

              {/* Time Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-text-main"><MdText text={inhalt.texte.standzeitDesTragwerks} /></span>
                  <span className="font-mono font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded text-xs">
                    {simDays[timeIndex].label}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={1}
                  value={timeIndex}
                  onChange={(e) => setTimeIndex(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                />
                <div className="flex justify-between text-[10px] text-text-main/60 font-mono">
                  <span>t₀</span>
                  <span>90 d</span>
                  <span>1 a</span>
                  <span>5 a</span>
                  <span>30 a</span>
                  <span>50 a</span>
                </div>
              </div>

              {/* Quick Time Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {simDays.map((sd, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTimeIndex(idx)}
                    className={`py-1.5 px-2 text-[11px] rounded-lg border font-medium transition-all cursor-pointer ${
                      timeIndex === idx
                        ? 'bg-shiraz text-white border-shiraz shadow-xs font-bold'
                        : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100'
                    }`}
                  >
                    {sd.label.split(' ')[0]} {sd.label.split(' ')[1] || ''}
                  </button>
                ))}
              </div>

              {/* Base Parameters Overview */}
              <div className="pt-3 border-t border-home-grau/20 space-y-2 text-xs">
                <span className="font-bold text-text-main block"><MdText text={inhalt.texte.randbedingungenDerStütze} /></span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-off-white p-2 rounded-lg border border-home-grau/20">
                    <span className="text-text-main/60 block"><MdText text={inhalt.texte.stützenhöheL} /></span>
                    <strong className="font-mono text-text-main"><MdText text={inhalt.texte.t3000Mm3} /></strong>
                  </div>
                  <div className="bg-off-white p-2 rounded-lg border border-home-grau/20">
                    <span className="text-text-main/60 block"><MdText text={inhalt.texte.dauerlastC} /></span>
                    <strong className="font-mono text-text-main"><MdText text={inhalt.texte.t85MpaLehrannahme} /></strong>
                  </div>
                  <div className="bg-off-white p-2 rounded-lg border border-home-grau/20">
                    <span className="text-text-main/60 block"><MdText text={inhalt.texte.eModulEcm} /></span>
                    <strong className="font-mono text-text-main">{formatDeZahl(Ecm, 0)} MPa</strong>
                  </div>
                  <div className="bg-off-white p-2 rounded-lg border border-home-grau/20">
                    <span className="text-text-main/60 block"><MdText text={inhalt.texte.luftfeuchteRh} /></span>
                    <strong className="font-mono text-text-main">{formatDeWert(rh)} %</strong>
                  </div>
                </div>
              </div>

              {/* Live Deformation Readouts */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-home-grau/20">
                <div className="bg-blue-50/80 p-2.5 rounded-xl border border-blue-200">
                  <span className="text-[10px] uppercase font-bold text-blue-900 block"><MdText text={inhalt.texte.elastischLEl} /></span>
                  <span className="text-lg font-mono font-bold text-blue-700">
                    {formatDeZahl(currentState.dL_el, 2)} mm
                  </span>
                  <span className="text-[9px] text-blue-900/70 block"><MdText text={inhalt.texte.spontanBeiLastbeginn} /></span>
                </div>

                <div className="bg-rose-50/80 p-2.5 rounded-xl border border-rose-200">
                  <span className="text-[10px] uppercase font-bold text-rose-900 block"><MdText text={inhalt.texte.kriechenLCr} /></span>
                  <span className="text-lg font-mono font-bold text-shiraz">
                    {formatDeZahl(currentState.dL_cr, 2)} mm
                  </span>
                  <span className="text-[9px] text-rose-900/70 block">φ = {formatDeZahl(currentState.phiT, 2)}</span>
                </div>

                <div className="bg-purple-50/80 p-2.5 rounded-xl border border-purple-200">
                  <span className="text-[10px] uppercase font-bold text-purple-900 block"><MdText text={inhalt.texte.schwindenLCs} /></span>
                  <span className="text-lg font-mono font-bold text-purple-700">
                    {formatDeZahl(currentState.dL_cs, 2)} mm
                  </span>
                  <span className="text-[9px] text-purple-900/70 block">Lastunabhängig</span>
                </div>

                <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-300">
                  <span className="text-[10px] uppercase font-bold text-emerald-900 block">Gesamtstauchung</span>
                  <span className="text-lg font-mono font-bold text-emerald-800">
                    {formatDeZahl(currentState.dL_tot, 2)} mm
                  </span>
                  <span className="text-[9px] text-emerald-900/70 block">ΔL_tot = {formatDeZahl((currentState.dL_tot / L0_mm * 1000), 2)} ‰</span>
                </div>
              </div>

            </div>
          </div>

          {/* Visualization Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-full">
              
              <div className="flex items-center justify-between pb-3 border-b border-home-grau/20 mb-3">
                <div>
                  <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                    <Layers size={18} className="text-shiraz" /><MdText text={inhalt.texte.t2PhysischerSäulenvergleichRheologisches} /></h3>
                  <span className="text-xs text-text-main/70 font-medium"><MdText text={inhalt.texte.belasteteStützeKriechenSchwinden} /></span>
                </div>
                <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200"><MdText text={inhalt.texte.maßstabVerformung25Überhöht} /></span>
              </div>

              {/* Visual SVG Canvas */}
              <div className="relative w-full aspect-4/3 max-h-[380px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 540 380" className="select-none">
                  <defs>
                    <linearGradient id="columnGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="50%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>

                    <linearGradient id="pressGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="50%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                  </defs>

                  {/* Ceiling/Load distribution beam */}
                  <rect x="20" y="20" width="500" height="18" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
                  <text x="270" y="33" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Tragwerksebene (Deckenauflager)
                  </text>

                  {/* Floor slab bottom */}
                  <rect x="20" y="340" width="500" height="24" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
                  <text x="270" y="356" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Fundament / Rohbeton-Bodenplatte
                  </text>

                  {/* LEFT: Loaded Column (Kriechen + Schwinden + Elastizität) */}
                  {(() => {
                    const baseTopY = 80;
                    const baseHeight = 260;
                    // Visual displacement exaggerated 20x for clarity
                    const visualDef = currentState.dL_tot * 6.0;
                    const loadedTopY = baseTopY + visualDef;
                    const loadedHeight = baseHeight - visualDef;

                    return (
                      <g transform="translate(60, 0)">
                        {/* Hydraulic Jack Piston pressing down */}
                        <rect x="18" y="38" width="44" height={loadedTopY - 38} fill="url(#pressGrad)" stroke="#475569" strokeWidth="1" />
                        
                        {/* Hydraulic Platen */}
                        <rect x="10" y={loadedTopY - 8} width="60" height="8" rx="1.5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />

                        {/* Force Arrow N */}
                        <path d="M 40 42 L 40 70" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow)" />
                        <text x="56" y="58" fill="#ef4444" fontSize="11" fontWeight="bold">N (8,5 MPa)</text>

                        {/* Stütze Original Height Ghost Outline */}
                        <rect x="10" y={baseTopY} width="60" height={baseHeight} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

                        {/* Compressed Column Body */}
                        <rect x="10" y={loadedTopY} width="60" height={loadedHeight} fill="url(#columnGrad)" stroke="#0f172a" strokeWidth="2" rx="2" />

                        {/* Shortening delta marker */}
                        <line x1="74" y1={baseTopY} x2="74" y2={loadedTopY} stroke="#38bdf8" strokeWidth="2" />
                        <line x1="71" y1={baseTopY} x2="77" y2={baseTopY} stroke="#38bdf8" strokeWidth="2" />
                        <line x1="71" y1={loadedTopY} x2="77" y2={loadedTopY} stroke="#38bdf8" strokeWidth="2" />
                        <text x="82" y={baseTopY + visualDef / 2 + 4} fill="#38bdf8" fontSize="10" fontWeight="bold">
                          - {formatDeZahl(currentState.dL_tot, 2)} mm
                        </text>

                        {/* Label under Column */}
                        <text x="40" y="330" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Stütze unter Dauerlast
                        </text>
                        <text x="40" y="318" fill="#cbd5e1" fontSize="9" textAnchor="middle">
                          (Elast. + Kriech. + Schwind.)
                        </text>
                      </g>
                    );
                  })()}

                  {/* CENTER: Rheological Model (Maxwell / Kelvin-Voigt) */}
                  <g transform="translate(230, 65)">
                    <rect x="0" y="0" width="130" height="260" rx="8" fill="#0f172a" stroke="#334155" opacity="0.9" />
                    <text x="65" y="20" fill="#fde047" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Rheologisches Modell
                    </text>

                    {/* Spring 1 (Hooke Element E1) */}
                    <text x="65" y="42" fill="#93c5fd" fontSize="9" textAnchor="middle">Feder E₁ (Elastizität)</text>
                    <path d="M 65 48 L 55 54 L 75 62 L 55 70 L 75 78 L 65 84" fill="none" stroke="#60a5fa" strokeWidth="2" />

                    {/* Series connector to Kelvin-Voigt body */}
                    <line x1="65" y1="84" x2="65" y2="105" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="30" y1="105" x2="100" y2="105" stroke="#cbd5e1" strokeWidth="2" />

                    {/* Parallel branch Left: Spring E2 */}
                    <line x1="40" y1="105" x2="40" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
                    <path d="M 40 120 L 32 126 L 48 134 L 32 142 L 48 150 L 40 156" fill="none" stroke="#f472b6" strokeWidth="2" />
                    <line x1="40" y1="156" x2="40" y2="175" stroke="#cbd5e1" strokeWidth="1.5" />
                    <text x="40" y="190" fill="#f472b6" fontSize="8" textAnchor="middle">Feder E₂</text>

                    {/* Parallel branch Right: Dashpot eta (Dämpfer) */}
                    <line x1="90" y1="105" x2="90" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
                    {/* Cylinder housing */}
                    <path d="M 80 125 L 80 155 L 100 155 L 100 125" fill="none" stroke="#38bdf8" strokeWidth="2" />
                    {/* Dashpot Oil Fluid */}
                    <rect x="82" y="138" width="16" height="15" fill="#0284c7" opacity="0.6" />
                    {/* Piston Plate moving inside */}
                    <line x1="84" y1={130 + (currentState.phiT / 3.0) * 12} x2="96" y2={130 + (currentState.phiT / 3.0) * 12} stroke="#f8fafc" strokeWidth="3" />
                    <line x1="90" y1="120" x2="90" y2={130 + (currentState.phiT / 3.0) * 12} stroke="#f8fafc" strokeWidth="2" />
                    <line x1="90" y1="155" x2="90" y2="175" stroke="#cbd5e1" strokeWidth="1.5" />
                    <text x="90" y="190" fill="#38bdf8" fontSize="8" textAnchor="middle">Dämpfer η</text>

                    {/* Rejoining lower bar */}
                    <line x1="30" y1="175" x2="100" y2="175" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="65" y1="175" x2="65" y2="200" stroke="#cbd5e1" strokeWidth="2" />

                    <text x="65" y="222" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Kelvin-Voigt-Körper
                    </text>
                    <text x="65" y="235" fill="#94a3b8" fontSize="8" textAnchor="middle">
                      (Viskoelastisches Kriechen)
                    </text>
                  </g>

                  {/* RIGHT: Unloaded Shrinkage Prism (Reines Schwinden ΔL_cs) */}
                  {(() => {
                    const baseTopY = 80;
                    const baseHeight = 260;
                    const visualDef = currentState.dL_cs * 6.0;
                    const shrinkTopY = baseTopY + visualDef;
                    const shrinkHeight = baseHeight - visualDef;

                    return (
                      <g transform="translate(420, 0)">
                        {/* No external load/jack above */}
                        <text x="30" y="58" fill="#a855f7" fontSize="10" fontWeight="bold" textAnchor="middle">Lastfrei (N = 0)</text>

                        {/* Original Height Ghost Outline */}
                        <rect x="10" y={baseTopY} width="40" height={baseHeight} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

                        {/* Shrunken Prism Body */}
                        <rect x="10" y={shrinkTopY} width="40" height={shrinkHeight} fill="#64748b" stroke="#0f172a" strokeWidth="2" rx="2" />

                        {/* Evaporating Moisture Water Vapor squiggly arrows */}
                        <path d="M 0 140 Q -8 130 0 120" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.7" />
                        <path d="M 60 170 Q 68 160 60 150" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.7" />
                        <text x="30" y="195" fill="#38bdf8" fontSize="9" textAnchor="middle">H₂O ↑</text>

                        {/* Shortening delta marker */}
                        <line x1="56" y1={baseTopY} x2="56" y2={shrinkTopY} stroke="#c084fc" strokeWidth="2" />
                        <line x1="53" y1={baseTopY} x2="59" y2={baseTopY} stroke="#c084fc" strokeWidth="2" />
                        <line x1="53" y1={shrinkTopY} x2="59" y2={shrinkTopY} stroke="#c084fc" strokeWidth="2" />
                        <text x="64" y={baseTopY + visualDef / 2 + 4} fill="#c084fc" fontSize="9" fontWeight="bold">
                          - {formatDeZahl(currentState.dL_cs, 2)} mm
                        </text>

                        {/* Label under Prism */}
                        <text x="30" y="330" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Schwindprisma
                        </text>
                        <text x="30" y="318" fill="#c084fc" fontSize="9" textAnchor="middle">
                          (Trocknungs- + autogenes Schwinden)
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Formula & Mechanistic Footer */}
              <div className="mt-3 p-3 bg-off-white rounded-xl border border-home-grau/25 text-xs text-text-main/80 space-y-1">
                <span className="font-bold text-text-main block"><MdText text={inhalt.texte.überlagerungDerVerformungsanteileDin} /></span>
                <div className="overflow-x-auto py-0.5" role="region" aria-label="Formel Gesamtverformung (horizontal scrollbar)" tabIndex={0}>
                  <InlineMath math="\varepsilon_{\text{tot}}(t) = \varepsilon_{\text{el}} + \varepsilon_{\text{cr}}(t, t_0) + \varepsilon_{\text{cs}}(t) = \frac{\sigma_c}{E_{\text{cm}}} \cdot \left[1 + \varphi(t, t_0)\right] + \varepsilon_{\text{cs}}(t)" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {!eingebettet && (
<ModuleFooter 
          wikipedia={[
            { title: inhalt.werte.kriechenWerkstoffe3, url: 'https://de.wikipedia.org/wiki/Kriechen_(Werkstoffe)' },
            { title: inhalt.werte.schwindenBeton3, url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' },
            { title: 'Kelvin-Voigt-Modell', url: 'https://de.wikipedia.org/wiki/Kelvin-Voigt-Modell' }
          ]}
          regelwerke={inhalt.daten["renderRheologieSimulator.regelwerke"]}
          literatur={inhalt.daten["renderRheologieSimulator.literatur"]}
          formeln={inhalt.daten["renderRheologieSimulator.formeln"]}
        />
)}
      </div>
    );
  };

  const [timeIndex, setTimeIndex] = useState(2); // for rheologie simulator

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in slide-in-from-left duration-200">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Timer className="text-shiraz" /><MdText text={inhalt.texte.kriechenSchwindenRelaxation} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.verformungsverhaltenVonBetonKriechen} /></p>
        </div>

      </div>

      <ModuleTabs label="Werkstoff" tabs={REITER} aktiv={material} onWechsel={setMaterial} className="[&>[role=tablist]]:mb-6">
      {material === 'beton' && renderBeton()}
      {material === 'stahl' && renderStahl()}
      {material === 'rheologie' && renderRheologieSimulator()}
      </ModuleTabs>
    </div>
  );
}
