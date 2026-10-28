// CBAM-Rechner mit Jahresschalter 2026–2034 (Runde 28.10.); Rechenkern src/calc/cbam.ts
import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { formatDeZahl } from '@/src/utils/numberFormat';
import inhalt from '@/content/nachhaltigkeit/CbamRechner.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Slider } from '@/src/components/ui/Slider';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';
import { cbamKosten, cbamJahrespfad, CBAM_JAHRE, CBAM_FAKTOR, CBAM_BENCHMARK, type CbamJahr, type CbamWare } from '@/src/calc/cbam';

const WAREN: readonly (readonly [CbamWare, string])[] = [
  ['zementGrau', 'Grauer Portlandzement (KN 2523 29 00)'],
  ['klinkerGrau', 'Grauer Zementklinker (KN 2523 10 00)'],
  ['zementWeiss', 'Weißer Portlandzement (KN 2523 21 00)'],
];
const prozent = (x: number) => `${formatDeZahl(x * 100, 1)} %`;

export default function CbamRechner() {
  const [jahr, setJahr] = useState<CbamJahr>(2026);
  const [ware, setWare] = useState<CbamWare>('zementGrau');
  const [mengeT, setMengeT] = useState<number>(1000);
  const [emissionen, setEmissionen] = useState<number>(0.8);
  const [preisCbam, setPreisCbam] = useState<number>(80);
  const [preisHerkunft, setPreisHerkunft] = useState<number>(0);
  const eingabe = { mengeT, emissionen, benchmark: CBAM_BENCHMARK[ware], preisCbam, preisHerkunft };
  const r = cbamKosten({ ...eingabe, jahr });
  const pfad = cbamJahrespfad(eingabe);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-text-main flex items-center gap-2"><Calculator className="text-shiraz" size={22} /><MdText text={inhalt.texte.titel} /></h2>
        <p className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30"><MdText text={inhalt.texte.einleitung} /></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
          <div>
            <span className="block text-xs font-bold text-slate-900 mb-2"><MdText text={inhalt.texte.jahrLabel} /></span>
            <AuswahlGruppe label="Einfuhrjahr" className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CBAM_JAHRE.map(j => (
                <button key={j} {...alsOption(jahr === j)} onClick={() => setJahr(j)}
                  className={`px-2 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${jahr === j ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'}`}>
                  {j}<span className="block text-[10px] font-mono font-normal">{prozent(CBAM_FAKTOR[j])}</span>
                </button>
              ))}
            </AuswahlGruppe>
          </div>
          <div>
            <label htmlFor="cbam-ware" className="block text-xs font-bold text-slate-900 mb-2"><MdText text={inhalt.texte.wareLabel} /></label>
            <select id="cbam-ware" value={ware} onChange={e => setWare(e.target.value as CbamWare)} className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white">
              {WAREN.map(([id, name]) => <option key={id} value={id}>{name}: BM = {formatDeZahl(CBAM_BENCHMARK[id], 3)} t CO₂e/t</option>)}
            </select>
          </div>
          <Slider id="cbam-menge" label={inhalt.texte.mengeLabel} unit="t" min={100} max={20000} step={100} value={mengeT} onChange={e => setMengeT(Number(e.target.value))} />
          <Slider id="cbam-emissionen" label={inhalt.texte.emissionenLabel} unit="t CO₂e/t" min={0.4} max={1.6} step={0.01} value={emissionen} onChange={e => setEmissionen(Number(e.target.value))} />
          <Slider id="cbam-preis" label={inhalt.texte.preisLabel} unit="€/t CO₂e" min={20} max={200} step={1} value={preisCbam} onChange={e => setPreisCbam(Number(e.target.value))} />
          <Slider id="cbam-herkunft" label={inhalt.texte.herkunftLabel} unit="€/t CO₂e" min={0} max={100} step={1} value={preisHerkunft} onChange={e => setPreisHerkunft(Number(e.target.value))} />
        </div>

        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30">
            <span className="text-[10px] uppercase font-mono font-bold text-shiraz"><MdText text={inhalt.texte.ergebnisKosten} /> {jahr}</span>
            <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">{formatDeZahl(r.kosten, 0)} €</div>
            <div className="text-xs text-slate-700 font-mono mt-1">{formatDeZahl(r.kostenJeT, 2)} €/t Ware</div>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs text-slate-800">
              <div><dt className="text-[10px] text-slate-600"><MdText text={inhalt.texte.ergebnisZertifikate} /></dt><dd className="font-mono font-bold">{formatDeZahl(r.zertifikate, 1)} t CO₂e</dd></div>
              <div><dt className="text-[10px] text-slate-600"><MdText text={inhalt.texte.ergebnisAnpassung} /></dt><dd className="font-mono font-bold">{formatDeZahl(r.sefa, 3)} t CO₂e/t</dd></div>
              <div><dt className="text-[10px] text-slate-600"><MdText text={inhalt.texte.ergebnisAnteil} /></dt><dd className="font-mono font-bold">{prozent(r.anteilEndzustand)}</dd></div>
            </dl>
          </div>
          <EingabeHinweise hinweise={r.hinweise} />

          <div className="bg-white p-4 rounded-2xl border border-home-grau/30 overflow-x-auto">
            <h3 className="font-bold text-sm text-slate-900 mb-2"><MdText text={inhalt.texte.pfadTitel} /></h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-mono text-[10px] uppercase">
                  <th className="py-1.5">{inhalt.texte.pfadSpalteJahr}</th>
                  <th className="py-1.5">{inhalt.texte.pfadSpalteFaktor}</th>
                  <th className="py-1.5 text-right">{inhalt.texte.pfadSpalteKosten}</th>
                  <th className="py-1.5 text-right">{inhalt.texte.pfadSpalteJeT}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {pfad.map(p => (
                  <tr key={p.jahr} className={p.jahr === jahr ? 'bg-shiraz/5 font-bold' : ''}>
                    <td className="py-1.5">{p.jahr}</td>
                    <td className="py-1.5 font-mono">{prozent(p.faktor)}</td>
                    <td className="py-1.5 font-mono text-right">{formatDeZahl(p.kosten, 0)} €</td>
                    <td className="py-1.5 font-mono text-right">{formatDeZahl(p.kostenJeT, 2)} €/t</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 text-[11px] text-text-main/70 bg-zinc-50 border border-zinc-200 rounded-lg">
            <span className="font-bold text-text-main block mb-1"><MdText text={inhalt.texte.formelTitel} /></span>
            <FormulaText text="K = M \cdot \max\left(0;\, e - \text{CBAM}_j \cdot \text{CSCF} \cdot BM\right) \cdot P_{CBAM} - M \cdot e \cdot P_H \;\ge 0" />
            <span className="block mt-1 leading-normal"><MdText text={inhalt.texte.formelErklaerung} /></span>
            <span className="block mt-1 leading-normal text-[10px]"><MdText text={inhalt.texte.quellen} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}
