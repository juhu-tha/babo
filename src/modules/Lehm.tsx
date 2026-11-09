import type { TooltipItem } from 'chart.js';
import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { BookOpen } from 'lucide-react';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import inhalt from '@/content/lehm/Lehm.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { lehmSchaetzmodell } from '@/src/calc/lehm';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';
function Pie({ data }: { data: { datasets: { data: number[] }[] }; options?: unknown }) {
  return (
    <div className="text-center font-semibold text-xs text-stone-650 bg-stone-100 p-2 rounded-xl">
      Zusammensetzungsdiagramm
      <div className="flex gap-2 justify-center mt-2 text-[10px] font-normal">
        <span className="flex items-center gap-1">🟢 Ton: {formatDeZahl(data.datasets[0].data[0], 1)}%</span>
        <span className="flex items-center gap-1">🟡 Schluff: {formatDeZahl(data.datasets[0].data[1], 1)}%</span>
        <span className="flex items-center gap-1"><MdText text={inhalt.texte.sandKies} />{formatDeZahl(data.datasets[0].data[2], 1)}%</span>
      </div>
    </div>
  );
}
// Fix and replace standard chart.js Pie import to prevent compile issues on node.js

export default function Lehm() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'bemessung' | 'steckbrief' | 'bentonit'>('steckbrief');
  const [ton, setTon] = useState(15);
  const [schluff, setSchluff] = useState(35);
  const [sand, setSand] = useState(50);
  const [wasser, setWasser] = useState(12);

  // Lehrmodell Stampflehm im Kern src/calc/lehm.ts (Umsetzung 29.10.2026, T5-LE-1)
  const results = useMemo(() => lehmSchaetzmodell({ ton, schluff, sand, wasser }), [ton, schluff, sand, wasser]);
  const tonNorm = results.tonProzent, schluffNorm = results.schluffProzent, sandNorm = results.sandProzent;

  const chartData = useMemo(() => {
    return {
      labels: ['Ton', 'Schluff', 'Sand/Kies'],
      datasets: [
        {
          data: [tonNorm, schluffNorm, sandNorm],
          backgroundColor: [
            '#8B4513', // SaddleBrown for Ton
            '#D2B48C', // Tan for Schluff
            '#F4A460', // SandyBrown for Sand
          ],
          borderColor: [
            '#ffffff',
            '#ffffff',
            '#ffffff',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [tonNorm, schluffNorm, sandNorm]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'pie'>) {
            return `${context.label}: ${formatDeZahl(context.parsed, 1)}%`;
          }
        }
      }
    },
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.lehmbauStampflehm} /></h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.lehmIstEinerDer} /></p>
        </div>

        <ModuleTabs
          label={inhalt.werte.reiterBereiche}
          tabs={[
            { id: 'steckbrief' as const, label: 'Baustoff-Steckbrief', icon: BookOpen },
            { id: 'grundlagen' as const, label: inhalt.texte.grundlagenZusammensetzung },
            { id: 'bemessung' as const, label: inhalt.texte.bemessungNeueNorm },
            { id: 'bentonit' as const, label: inhalt.texte.bentonitTonmineral },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="flex flex-col gap-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6"
        >
        <div className="flex flex-col gap-6">

        {activeTab === 'grundlagen' && (
          <div className="animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
              <p><MdText text={inhalt.texte.lehmIstEinÖkologischer} /></p>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <Slider label={inhalt.werte.tonanteilBindemittel} info={inhalt.werte.anteilAnTonIm} min={5} max={40} step={1} value={ton} unit="Teile" onChange={(e) => setTon(Number(e.target.value))} />
              <div className="mt-4"><Slider label="Schluffanteil"  min={10} max={60} step={1} value={schluff} unit="Teile" onChange={(e) => setSchluff(Number(e.target.value))} /></div>
              <div className="mt-4"><Slider label="Sand/Kies-Anteil" info={inhalt.werte.anteilAnSandUnd} min={20} max={80} step={1} value={sand} unit="Teile" onChange={(e) => setSand(Number(e.target.value))} /></div>
              <div className="mt-4"><Slider label={inhalt.werte.herstellfeuchteWassergehalt}  min={5} max={25} step={1} value={wasser} unit="%" onChange={(e) => setWasser(Number(e.target.value))} /></div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-shiraz text-white p-6 rounded-xl shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90"><MdText text={inhalt.texte.eigenschaftenGrobeSchätzungLehrmodell} /></h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1"><div className="text-white/70 text-sm">Trockenrohdichte</div><div className="text-2xl font-bold">{formatDeZahl(results.rohdichte, 0)} kg/m³</div></div>
                <div className="col-span-2 sm:col-span-1"><div className="text-white/70 text-sm">Druckfestigkeit</div><div className="text-2xl font-bold">{formatDeZahl(results.druckfestigkeit, 1)} MPa</div></div>
                <div className="col-span-2 sm:col-span-1"><div className="text-white/70 text-sm"><MdText text={inhalt.texte.linearesSchwindmaß} /></div><div className="text-2xl font-bold">{formatDeZahl(results.schwinden, 1)} %</div></div>
                <div className="col-span-2 sm:col-span-1"><div className="text-white/70 text-sm">Wärmeleitfähigkeit <FormulaText text="\lambda" /></div><div className="text-2xl font-bold">{formatDeZahl(results.lambda, 2)} W/(mK)</div></div>
                <div className="col-span-2"><div className="text-white/70 text-sm"><MdText text={inhalt.texte.sorptionsfähigkeitFeuchtepuffer} /></div><div className="text-2xl font-bold">{formatDeZahl(results.sorption, 1)} g/m²</div></div>
              </div>
            </div>
            <EingabeHinweise hinweise={results.hinweise} />
            <ErgebnisAnsage text={kurzzeile(ansageWert('Trockenrohdichte', results.rohdichte, 0, 'kg/m³'), ansageWert('Druckfestigkeit', results.druckfestigkeit, 1, 'MPa'), ansageWert('Schwindmaß', results.schwinden, 1, '%'), ansageWert('λ', results.lambda, 2, 'W/(mK)'))} />
            
            <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Zusammensetzung</h3>
              <div className="h-[250px] w-full flex justify-center">
                <div className="w-[250px] h-[250px]">
                  <Pie data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Schematische Darstellung */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm mt-6">
              <h3 className="font-semibold mb-4 text-text-main"><MdText text={inhalt.texte.schematischeDarstellungLehmstruktur} /></h3>
              <div className="flex flex-col items-center bg-off-white rounded-lg border border-home-grau/30 p-4">
                <svg role="img" aria-label="Schematische Darstellung: Lehmstruktur" width="100%" height="160" viewBox="0 0 450 160">
                  {/* Sand/Kies (Gerüst) */}
                  <circle cx="100" cy="80" r="30" fill="#F4A460" stroke="#d97706" strokeWidth="2" />
                  <circle cx="170" cy="60" r="25" fill="#F4A460" stroke="#d97706" strokeWidth="2" />
                  <circle cx="150" cy="120" r="20" fill="#F4A460" stroke="#d97706" strokeWidth="2" />
                  <circle cx="220" cy="90" r="35" fill="#F4A460" stroke="#d97706" strokeWidth="2" />
                  <circle cx="280" cy="50" r="20" fill="#F4A460" stroke="#d97706" strokeWidth="2" />
                  <circle cx="300" cy="110" r="25" fill="#F4A460" stroke="#d97706" strokeWidth="2" />
                  
                  {/* Schluff (Füller) */}
                  <circle cx="140" cy="85" r="8" fill="#D2B48C" />
                  <circle cx="190" cy="130" r="10" fill="#D2B48C" />
                  <circle cx="260" cy="85" r="7" fill="#D2B48C" />
                  <circle cx="200" cy="45" r="9" fill="#D2B48C" />
                  <circle cx="110" cy="125" r="6" fill="#D2B48C" />
                  <circle cx="330" cy="80" r="8" fill="#D2B48C" />

                  {/* Ton (Bindemittel) */}
                  <path d="M 120 60 Q 140 40 160 70 T 180 100 T 200 70 T 240 60 T 260 100 T 280 80" fill="none" stroke="#8B4513" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
                  <path d="M 100 110 Q 120 130 140 100 T 170 110 T 200 130 T 230 120 T 270 130 T 310 100" fill="none" stroke="#8B4513" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
                  <path d="M 130 80 Q 150 90 170 80 T 210 90 T 250 80 T 290 90" fill="none" stroke="#8B4513" strokeWidth="6" strokeLinecap="round" opacity="0.8" />

                  {/* Legende */}
                  <g transform="translate(350, 40)">
                    <circle cx="0" cy="0" r="6" fill="#F4A460" stroke="#d97706" />
                    <text x="15" y="4" fontSize="10" fill="#1e293b">Sand/Kies</text>
                    <circle cx="0" cy="20" r="6" fill="#D2B48C" />
                    <text x="15" y="24" fontSize="10" fill="#1e293b">Schluff</text>
                    <line x1="-6" y1="40" x2="6" y2="40" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
                    <text x="15" y="44" fontSize="10" fill="#1e293b">Ton (Binder)</text>
                  </g>
                </svg>
                <div className="text-xs text-text-main/70 text-center mt-2"><MdText text={inhalt.texte.sandUndKiesBilden} /></div>
              </div>
            </div>
          </div>
        </div>
        </div>
        )}

        {activeTab === 'bemessung' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.bemessungNachNeuerNorm} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-shiraz"><MdText text={inhalt.texte.wesentlicheKonzepteDerDin} /></h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/80">
                  <li><MdText text={inhalt.texte.anwendungsDruckfestigkeitsklassenLehmste} /></li>
                  <li><MdText text={inhalt.texte.formatMörtelDieTragfähigkeit} /></li>
                  <li><MdText text={inhalt.texte.schwindenSetzungDaLehm} /></li>
                  <li><MdText text={inhalt.texte.feuchteschutzKonstruktiverWitterungsschu} /></li>
                </ul>
              </div>

               <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-home-prim">Anwendungsbereiche</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li><MdText text={inhalt.texte.tragendesMauerwerkInGebäuden} /></li>
                  <li><MdText text={inhalt.texte.innentrennwändeUndAusfachungenZ} /></li>
                  <li><MdText text={inhalt.texte.ausführungAlsEinsteinmauerwerkOder} /></li>
                  <li><MdText text={inhalt.texte.durchDieProduktnormenDin} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="lehmbau" />
          </div>
        )}

        {activeTab === 'bentonit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.bentonitIstEinTonmineralgemisch} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2">Eigenschaften</h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.quellvermögenKannEinVielfaches} /></li>
                  <li><MdText text={inhalt.texte.thixotropieBentonitsuspensionenVerhalten} /></li>
                  <li><MdText text={inhalt.texte.dichtwirkungImGequollenenZustand} /></li>
                  <li><MdText text={inhalt.texte.kationenaustauschkapazitätKannSchadstoff} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-shiraz text-lg mb-2"><MdText text={inhalt.texte.anwendungenImBauwesen} /></h3>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
                  <li><MdText text={inhalt.texte.spezialtiefbauStützflüssigkeitStabilisie} /></li>
                  <li><MdText text={inhalt.texte.abdichtungWeißeWanneBraune} /></li>
                  <li><MdText text={inhalt.texte.deponiebauAlsMineralischeBasisabdichtung} /></li>
                  <li><MdText text={inhalt.texte.tunnelbauAlsSchmiermittelBeim} /></li>
                </ul>
              </div>
            </div>
          </div>
        )}
        </div>
        </ModuleTabs>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielTrocknungswasserEinesL}
          zielGleichung="m_W = A \cdot d \cdot \rho_d \cdot (u_0 - u_{eq})"
          normQuelle={inhalt.werte.massenbilanzFeuchtegehalteAlsLehrannahme}
          schritte={inhalt.daten["Lehm.schritte"]}
          ergebnisHinweis={inhalt.werte.lehmputzeTrocknenNurPhysikalisch}
        />
      </div>

      <ModulTest moduleId="lehm" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Lehmbau', url: 'https://de.wikipedia.org/wiki/Lehmbau' },
          { title: 'Stampflehm', url: 'https://de.wikipedia.org/wiki/Stampflehm' }
        ]}
        literatur={inhalt.daten["Lehm.literatur"]}
        regelwerke={inhalt.daten["Lehm.regelwerke"]}
        formeln={inhalt.daten["Lehm.formeln"]}
      />
    </div>
  );
}
