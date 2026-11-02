import { Settings, Sliders, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import React, { useMemo, useState } from 'react';
import inhalt from '@/content/beispielrechnungen/RechnungMauerwerk.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { bemesseWandVereinfacht, fkNA, FK_TAFEL_NA, ZETA_MW, GAMMA_M_MW, SCHLANKHEIT_MAX, type WandLage } from '@/src/calc/mauerwerk';

const FREI = 'frei';
const DICKEN = [115, 150, 175, 200, 240, 300, 365] as const;
const LAGEN: { id: WandLage; label: string }[] = [
  { id: 'zwischen', label: inhalt.werte.lageZwischen },
  { id: 'dach', label: inhalt.werte.lageDach },
  { id: 'innen', label: inhalt.werte.lageInnen },
];

/** Beispielrechnung Mauerwerk: zeigt nur an, gerechnet wird in src/calc/mauerwerk.ts (AP 4.7). */
export default function RechnungMauerwerk() {
  // Voreinstellung = Außenwand-Beispiel des KS-Merkblatts „Tragfähigkeitstafeln“ (Regressionstest tests/mauerwerk.test.ts)
  const [lage, setLage] = useState<WandLage>('zwischen');
  const [h, setH] = useState(2.5);
  const [t, setT] = useState<number>(175);
  const [aDurchT, setADurchT] = useState<1 | 0.667>(1);
  const [lf, setLf] = useState(6.0);
  const [fkWahl, setFkWahl] = useState('KSXL-12-DM');
  const [fkFrei, setFkFrei] = useState(5.0);
  const [nEd, setNEd] = useState(500);

  const tafel = fkWahl === FREI ? null : fkNA(fkWahl);
  const fk = tafel ? tafel.fk : fkFrei;
  const a = aDurchT === 1 ? t : (2 / 3) * t;
  const r = useMemo(() => bemesseWandVereinfacht({ lage, h, t, a, lf, fk, nEd }), [lage, h, t, a, lf, fk, nEd]);
  const hatErgebnis = r.nRd > 0;
  const ok = hatErgebnis && r.nachgewiesen;

  const auswahl = 'w-full p-2 mt-1 rounded-lg border border-slate-200 font-bold text-xs bg-white';
  const feld = 'space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs';

  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Settings className="text-shiraz" size={18} />
            <span><MdText text={inhalt.texte.tragfähigkeitsnachweisEinerUnbewehrtenMa} /></span>
          </h3>
          <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.wasBerechnetWirdDie} /></p>
        </div>

        {/* EINGABEN */}
        <div className="bg-slate-50/50 p-5 rounded-xl border border-home-grau/30 space-y-4">
          <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Sliders size={14} className="text-shiraz" /><MdText text={inhalt.texte.wandparameterEinstellen} /></h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`${feld} md:col-span-2`}>
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.steinfestigkeitArt} /></label>
              <select aria-label={inhalt.werte.steinfestigkeitArt} value={fkWahl} onChange={(e) => setFkWahl(e.target.value)} className={auswahl}>
                {FK_TAFEL_NA.map(e => (
                  <option key={e.id} value={e.id}>{`${e.stein}, SFK ${e.sfk}, ${e.moertel} – f_k = ${formatDeZahl(e.fk, 1)} N/mm²`}</option>
                ))}
                <option value={FREI}>{inhalt.werte.fkFreiOption}</option>
              </select>
              {fkWahl === FREI && (
                <div className="pt-1">
                  <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.freiesFk} /></label>
                  <input aria-label={inhalt.werte.freiesFk} type="range" min="1" max="20" step="0.1" value={fkFrei}
                    onChange={(e) => setFkFrei(Number(e.target.value))} className="w-full accent-shiraz" />
                  <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeZahl(fkFrei, 1)} N/mm²</div>
                </div>
              )}
            </div>

            <div className={`${feld} md:col-span-2`}>
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.wandlage} /></label>
              <select aria-label={inhalt.werte.wandlage} value={lage} onChange={(e) => setLage(e.target.value as WandLage)} className={auswahl}>
                {LAGEN.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </div>

            <div className={feld}>
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.wandhöheHM} /></label>
              <input aria-label={inhalt.werte.wandhöheM} type="range" min="2.25" max="3.60" step="0.05" value={h}
                onChange={(e) => setH(Number(e.target.value))} className="w-full accent-shiraz" />
              <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeZahl(h, 2)} m</div>
            </div>

            <div className={feld}>
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.dickeTCm} /></label>
              <select aria-label="Dicke (mm)" value={t} onChange={(e) => setT(Number(e.target.value))} className={auswahl}>
                {DICKEN.map(d => <option key={d} value={d}>{`${d} mm`}</option>)}
              </select>
            </div>

            <div className={feld}>
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.auflagertiefe} /></label>
              <select aria-label={inhalt.werte.auflagertiefe} value={aDurchT} onChange={(e) => setADurchT(Number(e.target.value) === 1 ? 1 : 0.667)} className={auswahl}>
                <option value={1}>a = t (voll aufliegend)</option>
                <option value={0.667}>a = 2/3 · t</option>
              </select>
            </div>

            <div className={feld}>
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.deckenstuetzweite} /></label>
              <input aria-label={inhalt.werte.deckenstuetzweite} type="range" min="3" max="7" step="0.25" value={lf}
                onChange={(e) => setLf(Number(e.target.value))} className="w-full accent-shiraz" disabled={lage !== 'zwischen'} />
              <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeZahl(lf, 2)} m</div>
            </div>

            <div className={`${feld} md:col-span-2 lg:col-span-4`}>
              <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.druckkraftNEdKn} /></label>
              <input aria-label={inhalt.werte.druckkraftKnM} type="range" min="30" max="1000" step="10" value={nEd}
                onChange={(e) => setNEd(Number(e.target.value))} className="w-full accent-shiraz" />
              <div className="font-mono text-xxs font-bold text-shiraz mt-1">{formatDeWert(nEd)} kN/m</div>
            </div>
          </div>
        </div>

        <EingabeHinweise hinweise={r.hinweise} />

        {/* RECHENWEG */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.vereinfachterTragfähigkeitsnachweisEuroc} /></h4>

          <div className="space-y-4 text-xs text-text-main/80 leading-relaxed font-normal">
            <div><MdText text={inhalt.texte.schritt1RechnerischeMauerwerksfestigkeit} />
              <p className="mt-1">
                {tafel ? <><MdText text={inhalt.texte.fkNaAnsatz} /> <em>{tafel.quelle}</em>.</> : <MdText text={inhalt.texte.fkFreiHinweis} />}
              </p>
              <p className="mt-1"><MdText text={inhalt.texte.derBemessungswertDerDruckfestigkeit} /></p>
              <BlockMath math={`f_d = \\frac{\\zeta \\cdot f_k}{\\gamma_M} = \\frac{${formatDeTeX(ZETA_MW, 2)} \\cdot \\color{#A3113E}{${formatDeTeX(fk, 1)}}}{${formatDeTeX(GAMMA_M_MW, 1)}} = \\color{#A3113E}{${formatDeTeX(r.fd, 2)}} \\, \\text{N/mm}^2`} />
            </div>

            <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt2WirksameSchlankheit} />
              <p className="mt-1"><MdText text={inhalt.texte.beiZweiseitigerHalterungAm} /></p>
              <p className="mt-1"><MdText text={inhalt.texte.erweiterteWandhoehe} /></p>
              <BlockMath math={`h_{ef} = \\rho_2 \\cdot h = ${formatDeTeX(r.rho2, 2)} \\cdot \\color{#A3113E}{${formatDeTeX(h, 2)}} \\, \\text{m} = ${formatDeTeX(r.hEf, 3)} \\, \\text{m}, \\qquad \\frac{h_{ef}}{t} = \\frac{${formatDeTeX(r.hEf * 1000, 0)}}{\\color{#A3113E}{${formatDeTeX(t, 0)}}} = \\color{#A3113E}{${formatDeTeX(r.schlankheit, 2)}}`} />
              <p className="mt-1"><MdText text={inhalt.texte.nachDinEn1996} /><strong className="text-shiraz">{formatDeZahl(r.schlankheit, 2)}</strong>.
                {!Number.isFinite(r.schlankheit) ? null : r.schlankheit > SCHLANKHEIT_MAX ? (
                  <span className="text-red-600 font-bold block mt-1"><MdText text={inhalt.texte.achtungWandIstZu} /></span>
                ) : (
                  <span className="text-green-700 block mt-1"><MdText text={inhalt.texte.grenzschlankheitEingehalten} /></span>
                )}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt3AbminderungsfaktorPhi} />
              <p className="mt-1"><MdText text={inhalt.texte.derAbminderungsfaktorPhiBerücksichtigt} /></p>
              <p className="mt-1"><MdText text={lage === 'zwischen' ? inhalt.texte.phi1Zwischen : lage === 'dach' ? inhalt.texte.phi1Dach : inhalt.texte.phi1Innen} /></p>
              {lage === 'zwischen' ? (
                <BlockMath math={`\\Phi_1 = \\min\\left(1{,}6 - \\frac{\\color{#A3113E}{${formatDeTeX(lf, 2)}}}{${fk >= 1.8 ? '6' : '5'}};\\; 0{,}9 \\cdot ${formatDeTeX(r.aDurchT, 3)}\\right) = ${formatDeTeX(r.phi1, 3)}`} />
              ) : (
                <BlockMath math={`\\Phi_1 = ${formatDeTeX(r.phi1, 3)}`} />
              )}
              <BlockMath math={`\\Phi_2 = 0{,}85 \\cdot \\frac{a}{t} - 0{,}0011 \\cdot \\left(\\frac{h_{ef}}{t}\\right)^2 = 0{,}85 \\cdot ${formatDeTeX(r.aDurchT, 3)} - 0{,}0011 \\cdot ${formatDeTeX(r.schlankheit, 2)}^2 = ${formatDeTeX(r.phi2, 3)}`} />
              <BlockMath math={`\\Phi = \\min(\\Phi_1;\\,\\Phi_2) = \\color{#A3113E}{${formatDeTeX(hatErgebnis ? r.phi : Math.min(r.phi1, r.phi2), 3)}} \\quad (${r.massgebend === 'phi1' ? '\\Phi_1' : '\\Phi_2'}\\text{ maßgebend})`} />
            </div>

            <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt4VertikalerTraglastwiderstand} />
              <p className="mt-1"><MdText text={inhalt.texte.derBemessungswertDerAufnehmbaren} /></p>
              <BlockMath math={`n_{Rd} = \\Phi \\cdot t \\cdot f_d = ${formatDeTeX(r.phi, 3)} \\cdot ${formatDeTeX(t, 0)} \\, \\text{mm} \\cdot ${formatDeTeX(r.fd, 2)} \\, \\text{N/mm}^2 = \\color{#A3113E}{${formatDeTeX(r.nRd, 1)}} \\, \\text{kN/m}`} />
            </div>

            <div className="border-t border-slate-100 pt-3"><MdText text={inhalt.texte.schritt5Auslastungsvergleich} />
              <BlockMath math={`\\eta = \\frac{n_{Ed}}{n_{Rd}} = \\frac{\\color{#A3113E}{${formatDeTeX(nEd, 0)}} \\, \\text{kN/m}}{\\color{#A3113E}{${formatDeTeX(r.nRd, 1)}} \\, \\text{kN/m}} = \\color{#A3113E}{${formatDeTeX(hatErgebnis ? r.eta : null, 3)}} \\le 1{,}0`} />
            </div>
          </div>
        </div>

        {/* ERGEBNIS */}
        <div className={`p-5 rounded-2xl border text-xs leading-relaxed flex flex-col md:flex-row gap-4 items-start md:items-center ${
              ok ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'
            }`}>
          <div className="p-3 rounded-xl bg-white border self-start md:self-center">
            {ok ? <CheckCircle2 className="text-green-600" size={32} /> : <AlertTriangle className="text-red-600" size={32} />}
          </div>
          <div className="space-y-1 flex-1 font-normal">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm"><MdText text={inhalt.texte.ausnutzungsgradEurocode6} /></span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-xxs tracking-wider uppercase ${ok ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                {ok ? 'Erfüllt' : inhalt.werte.nichtErfüllt}
              </span>
            </div>
            {hatErgebnis && (
              <p><MdText text={inhalt.texte.dieMauerwerkswandIstZu} /><strong>{formatDeZahl(r.eta * 100, 1)} %</strong> ausgelastet.</p>
            )}
            <p className="text-xxs opacity-90 mt-1">
              {ok ? inhalt.werte.derStandsicherheitsnachweisFürUnbewehrte : inhalt.werte.dieWandIstÜberlastet}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 text-amber-950 text-xs flex gap-2">
          <Info size={15} className="shrink-0 mt-0.5 text-amber-700" aria-hidden="true" />
          <span><MdText text={inhalt.texte.vorlaeufigHinweis} /></span>
        </div>
      </div>
    );
}
