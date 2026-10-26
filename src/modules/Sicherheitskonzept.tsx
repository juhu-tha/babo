import { formatDeZahl, formatDeTeX, formatDeTeXWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, AlertTriangle, CheckCircle2, Calculator, Shield, Activity } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/sicherheitskonzept/Sicherheitskonzept.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

const REITER = [
  { id: 'eurocodes', label: inhalt.texte.dieEurocodesÜbersicht, icon: Shield },
  { id: 'prinzip', label: inhalt.texte.prinzipTeilsicherheitsbeiwerte, icon: Activity },
  { id: 'lastermittlung', label: inhalt.texte.interaktiveLastermittlungGl6, icon: Calculator },
] as const;

export default function Sicherheitskonzept() {
  const [activeTab, setActiveTab ] = useState<'eurocodes' | 'prinzip' | 'lastermittlung'>('eurocodes');
  const [gk, setGk] = useState(10);
  const [qk1, setQk1] = useState(5);
  const [qk2, setQk2] = useState(3);
  const [psi0_1, setPsi0_1] = useState(0.7); // e.g. gathering areas
  const [psi0_2, setPsi0_2] = useState(0.6); // e.g. wind
  
  const [gammaG, setGammaG] = useState(1.35);
  const [gammaQ, setGammaQ] = useState(1.50);

  const ed = gammaG * gk + gammaQ * qk1 + gammaQ * psi0_2 * qk2;

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER CARD ACCORDING TO SPECS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ShieldAlert className="text-shiraz" /><MdText text={inhalt.texte.grundlagenDerTragwerksplanungEc} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dasSemiprobabilistischeSicherheitskonzep} /></p>
        </div>

      </div>

      <ModuleTabs label="Bereiche Sicherheitskonzept" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:mb-8">
      {/* TAB CONTENT */}
      {activeTab === 'eurocodes' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.dieTeileDerEurocodes} /></h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.eurocode0DinEn} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.grundlagenDerTragwerksplanungSicherheits} /></p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.eurocode1DinEn} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.einwirkungenAufTragwerkeEigengewicht} /></p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.eurocode2DinEn} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.bemessungUndKonstruktionVon} /></p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.eurocode3DinEn} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.bemessungUndKonstruktionVon2} /></p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.eurocode4DinEn} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.bemessungUndKonstruktionVon3} /></p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.eurocode5DinEn} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.bemessungUndKonstruktionVon4} /></p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.eurocode6DinEn} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.bemessungUndKonstruktionVon5} /></p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.eurocode7DinEn} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.entwurfBerechnungUndBemessung} /></p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.eurocode8DinEn} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.auslegungVonBauwerkenGegen} /></p>
            </div>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz mb-1"><MdText text={inhalt.texte.eurocode9DinEn} /></h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.bemessungUndKonstruktionVon6} /></p>
            </div>
          </div>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col gap-2">
            <p><MdText text={inhalt.texte.geltendeFassungInDeutschland} /></p>
            <p><MdText text={inhalt.texte.zweiteEurocodeGenerationCen} /></p>
          </div>
        </div>
      )}

      {activeTab === 'prinzip' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-lg font-bold text-text-main mb-4 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.sicherheitskonzeptEc0} /></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Einwirkungen (E) */}
              <div className="bg-white p-6 rounded-xl border-t-4 border-t-red-500 border-x border-b border-home-grau/25 shadow-xs">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2 text-red-700">
                  <AlertTriangle size={20} /><MdText text={inhalt.texte.einwirkungenE} /></h3>
                <p className="text-sm text-red-800/90 mb-4"><MdText text={inhalt.texte.kräfteOderVerformungenDie} /></p>
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded border border-red-100">
                    <div className="font-semibold text-red-900 text-sm mb-1"><MdText text={inhalt.texte.charakteristischerWert} /><FormulaText text="E_k" />)</div>
                    <div className="text-xs text-red-850"><MdText text={inhalt.texte.ständigeEinwirkungenInDer} /></div>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="text-red-300 rotate-90 md:rotate-0" />
                  </div>
                  <div className="bg-white p-3 rounded border border-red-200 shadow-sm">
                    <div className="font-semibold text-red-900 text-sm mb-1"><MdText text={inhalt.texte.bemessungswert} /><FormulaText text="E_d" />)</div>
                    <div className="text-xs text-red-850 mb-2">
                      <FormulaText text="F_d = \gamma_F \cdot \psi \cdot F_k" /><MdText text={inhalt.texte.vereinfachtTeilsicherheitsbeiwert} /><FormulaText text="\gamma_F" /><MdText text={inhalt.texte.beiBegleiteinwirkungenKombinationsbeiwer} /><FormulaText text="\psi" />)
                    </div>
                  </div>
                </div>
              </div>

              {/* Widerstand (R) */}
              <div className="bg-white p-6 rounded-xl border-t-4 border-t-emerald-500 border-x border-b border-home-grau/25 shadow-xs">
                <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 size={20} /><MdText text={inhalt.texte.widerstandR} /></h3>
                <p className="text-sm text-green-800/90 mb-4"><MdText text={inhalt.texte.fähigkeitDesBauteilsDen} /></p>
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded border border-green-100">
                    <div className="font-semibold text-green-900 text-sm mb-1"><MdText text={inhalt.texte.charakteristischerWert2} /><FormulaText text="R_k" />)</div>
                    <div className="text-xs text-green-850"><MdText text={inhalt.texte.t5FraktilwertDerGrundgesamtheit} /><FormulaText text="f_{ck}" />).
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="text-green-300 rotate-90 md:rotate-0" />
                  </div>
                  <div className="bg-white p-3 rounded border border-green-200 shadow-sm">
                    <div className="font-semibold text-green-900 text-sm mb-1"><MdText text={inhalt.texte.bemessungswert2} /><FormulaText text="R_d" />)</div>
                    <div className="text-xs text-green-850 mb-2">
                      <FormulaText text="R_d = R_k / \gamma_M" /> (Teilsicherheitsbeiwert <FormulaText text="\gamma_M" /><MdText text={inhalt.texte.fürMaterialUndModellunsicherheiten} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fcf8f2] p-6 rounded-2xl shadow-sm border border-home-grau/30 text-center">
            <h3 className="text-lg font-bold text-shiraz mb-2"><MdText text={inhalt.texte.fundamentaleNachweisbedingung} /></h3>
            <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.derBemessungswertDerEinwirkungen} /></p>
            <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-sm border border-shiraz/30 font-mono text-xl text-shiraz">
              <FormulaText text="E_d \le R_d" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 overflow-x-auto">
            <h3 className="text-lg font-bold text-text-main mb-4 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.teilsicherheitsbeiwerteImÜberblickStändi} /></h3>
            <table className="w-full text-sm text-left min-w-[560px]">
              <thead className="bg-home-grau/10 text-text-main">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Seite</th>
                  <th className="px-4 py-2">Größe</th>
                  <th className="px-4 py-2">Beiwert</th>
                  <th className="px-4 py-2 rounded-tr-lg">Regelwerk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20">
                <tr className="hover:bg-home-grau/5"><td className="px-4 py-2 font-bold">Einwirkung</td><td className="px-4 py-2"><MdText text={inhalt.texte.ständigUngünstigGünstig} /></td><td className="px-4 py-2"><FormulaText text="\gamma_G = 1{,}35 \;/\; 1{,}00" /></td><td className="px-4 py-2"><MdText text={inhalt.texte.dinEn1990Na} /></td></tr>
                <tr className="hover:bg-home-grau/5"><td className="px-4 py-2 font-bold">Einwirkung</td><td className="px-4 py-2"><MdText text={inhalt.texte.veränderlichUngünstigGünstig} /></td><td className="px-4 py-2"><FormulaText text="\gamma_Q = 1{,}50 \;/\; 0" /></td><td className="px-4 py-2"><MdText text={inhalt.texte.dinEn1990Na2} /></td></tr>
                <tr className="hover:bg-home-grau/5"><td className="px-4 py-2 font-bold">Widerstand</td><td className="px-4 py-2"><MdText text={inhalt.texte.betonBetonstahl} /></td><td className="px-4 py-2"><FormulaText text="\gamma_C = 1{,}50 \;/\; \gamma_S = 1{,}15" /></td><td className="px-4 py-2"><MdText text={inhalt.texte.dinEn19921} /></td></tr>
                <tr className="hover:bg-home-grau/5"><td className="px-4 py-2 font-bold">Widerstand</td><td className="px-4 py-2"><MdText text={inhalt.texte.baustahlQuerschnitt} /></td><td className="px-4 py-2"><FormulaText text="\gamma_{M0} = 1{,}00" /></td><td className="px-4 py-2"><MdText text={inhalt.texte.dinEn19931} /></td></tr>
                <tr className="hover:bg-home-grau/5"><td className="px-4 py-2 font-bold">Widerstand</td><td className="px-4 py-2"><MdText text={inhalt.texte.vollholzBrettschichtholz} /></td><td className="px-4 py-2"><FormulaText text="\gamma_M = 1{,}30" /></td><td className="px-4 py-2"><MdText text={inhalt.texte.dinEn19951} /></td></tr>
              </tbody>
            </table>
            <p className="text-xs text-text-main/70 mt-3">Kombinationsbeiwerte <FormulaText text="\psi_0" /><MdText text={inhalt.texte.nachDinEn1990} /></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <div className="border border-home-grau/25 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.grenzzuständeLimitStates} /></h4>
              <ul className="text-xs text-text-main/80 space-y-2 list-disc pl-4">
                <li><MdText text={inhalt.texte.tragfähigkeitUlsEquLagesicherheit} /></li>
                <li><MdText text={inhalt.texte.gebrauchstauglichkeitSlsBegrenzungVon} /></li>
              </ul>
            </div>
            <div className="border border-home-grau/25 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-text-main mb-2">Bemessungssituationen</h4>
              <ul className="text-xs text-text-main/80 space-y-2 list-disc pl-4">
                <li><MdText text={inhalt.texte.ständigNormalerNutzungszustandÜber} /></li>
                <li><MdText text={inhalt.texte.vorübergehendBefristeteUmständeZ} /></li>
                <li><MdText text={inhalt.texte.außergewöhnlichSelteneGefährdungsbedingu} /></li>
                <li><MdText text={inhalt.texte.erdbebenSeismischeExtrembeanspruchung} /></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lastermittlung' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.interaktiveLastermittlungGl62} /></h3>
          <p className="text-sm text-text-main/80 mb-2"><MdText text={inhalt.texte.berechnungDesBemessungswertesDer} /><FormulaText text="E_d" /><MdText text={inhalt.texte.fürEineStändigeSituation} /><FormulaText text="K_{FI}" /><MdText text={inhalt.texte.dieLeitEinwirkungWird} /><FormulaText text="\gamma_Q \cdot Q_{k,1}" /><MdText text={inhalt.texte.weitereVeränderlicheEinwirkungenWerden} /><FormulaText text="\psi_0" /> abgemindert.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Slider
                label={inhalt.werte.ständigeEinwirkungGK} min={0} max={50} step={1}
                value={gk} unit=" kN"
                onChange={(e) => setGk(Number(e.target.value))}
              />
              <Slider
                label={inhalt.werte.veränderlicheLeitEinwQ} min={0} max={50} step={1}
                value={qk1} unit=" kN"
                onChange={(e) => setQk1(Number(e.target.value))}
              />
              <Slider
                label={inhalt.werte.weitereVeränderlicheEinwQ} min={0} max={50} step={1}
                value={qk2} unit=" kN"
                onChange={(e) => setQk2(Number(e.target.value))}
              />
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.gStändigeEinwirkung} /></label>
                  <select aria-label={inhalt.werte.gStändigeEinwirkung} 
                    className="p-2 border border-home-grau rounded-md bg-off-white text-sm focus:outline-none focus:border-shiraz"
                    value={gammaG}
                    onChange={(e) => setGammaG(Number(e.target.value))}
                  >
                    <option value={1.35}>1,35 (ungünstig wirkend)</option>
                    <option value={1.0}>1,00 (günstig wirkend, z. B. gegen Abheben)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.beiwertFürQK} /></label>
                  <select aria-label={inhalt.werte.beiwertFürQK} 
                    className="p-2 border border-home-grau rounded-md bg-off-white text-sm focus:outline-none focus:border-shiraz"
                    value={psi0_2}
                    onChange={(e) => setPsi0_2(Number(e.target.value))}
                  >
                    <option value={0.7}>0,7 (Nutzlast Kat. A–D; Schnee über NN + 1000 m)</option>
                    <option value={0.6}>0,6 (Wind; Temperatur)</option>
                    <option value={0.5}>0,5 (Schnee bis NN + 1000 m)</option>
                    <option value={1.0}>1,0 (Nutzlast Kat. E – Lagerflächen)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-off-white border border-home-grau/50 rounded-xl p-6">
              <h4 className="font-bold text-text-main mb-4 flex items-center gap-2">
                <Calculator size={18} /> Berechnung <FormulaText text="E_d" />
              </h4>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-text-main/70">Ständig: <FormulaText text={`\\gamma_G \\cdot G_k = ${formatDeTeX(gammaG, 2)} \\cdot ${formatDeTeXWert(gk)}`} /></span>
                  <span>{formatDeZahl((gammaG * gk), 2)} kN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/70">Leit-Einw: <FormulaText text={`\\gamma_Q \\cdot Q_{k,1} = ${formatDeTeX(gammaQ, 2)} \\cdot ${formatDeTeXWert(qk1)}`} /></span>
                  <span>{formatDeZahl((gammaQ * qk1), 2)} kN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-main/70">Weitere: <FormulaText text={`\\gamma_Q \\cdot \\psi_0 \\cdot Q_{k,2} = ${formatDeTeX(gammaQ, 2)} \\cdot ${formatDeTeXWert(psi0_2)} \\cdot ${formatDeTeXWert(qk2)}`} /></span>
                  <span>{formatDeZahl((gammaQ * psi0_2 * qk2), 2)} kN</span>
                </div>
                <hr className="border-home-grau/50" />
                <div className="flex justify-between text-shiraz font-bold text-lg pt-2">
                  <span><FormulaText text="E_d" /> =</span>
                  <span>{formatDeZahl(ed, 2)} kN</span>
                </div>
              </div>
              
              <div className="mt-6 bg-white p-3 rounded-lg border border-home-grau/25">
                <div className="text-[10px] text-text-main/70 mb-1"><MdText text={inhalt.texte.gleichung610} /></div>
                <div className="text-xs font-mono overflow-x-auto text-center p-2 text-shiraz leading-normal">
                  <FormulaText text="E_d = \sum_{j \ge 1} \gamma_{G,j} G_{k,j} + \gamma_{Q,1} Q_{k,1} + \sum_{i > 1} \gamma_{Q,i} \psi_{0,i} Q_{k,i}" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </ModuleTabs>

      {/* ANWENDUNG (Stufe 3 des Lehrpfads) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.anwendungVollständigerNachweisE} /></h3>
        <FormulaDerivationBox
          title={inhalt.werte.beispiel1InnenstützeIm}
          zielGleichung="N_{Ed} \le N_{Rd}"
          schritte={inhalt.daten["Sicherheitskonzept.schritte"]}
          ergebnisHinweis={inhalt.werte.vereinfachtesLehrbeispielOhneBewehrung}
          normQuelle={inhalt.werte.dinEn1990Na}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel2LeichtdachUnter}
          zielGleichung="E_d = \gamma_{G,inf} \cdot G_k + \gamma_Q \cdot W_k"
          schritte={inhalt.daten["Sicherheitskonzept.schritte_2"]}
          ergebnisHinweis={inhalt.werte.dieBefestigungMuss1}
          normQuelle={inhalt.werte.dinEn1990Na2}
        />
      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="sicherheitskonzept" />

      {/* FOOTER */}
      <ModuleFooter 
        wikipedia={[
          { title: 'Eurocode', url: 'https://de.wikipedia.org/wiki/Eurocode' },
          { title: 'Teilsicherheitskonzept', url: 'https://de.wikipedia.org/wiki/Teilsicherheitskonzept' },
          { title: 'Grenzzustand' }
        ]}
        literatur={inhalt.daten["Sicherheitskonzept.literatur"]}
        regelwerke={inhalt.daten["Sicherheitskonzept.regelwerke"]}
        formeln={inhalt.daten["Sicherheitskonzept.formeln"]}
        lastReviewed={inhalt.werte.oktober2026Ap3}
      />
    </div>
  );
}
