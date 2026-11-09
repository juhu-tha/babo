import React, { useMemo, useState } from 'react';
import { BookOpen, Flame, FlaskConical, Calculator, ShieldAlert, Leaf, Info, GraduationCap } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { biokohleBilanz, F_PERM_IPCC, CO2_JE_C, PK_LEHRWERT } from '@/src/calc/biokohlebeton';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/biokohlebeton/Biokohlebeton.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ZEMENT_GWP_KG } from '@/src/data/zementGwp';
import { ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

type Reiter = 'einfuehrung' | 'herstellung' | 'wirkung' | 'rechner' | 'grenzen';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Einführung', icon: BookOpen },
  { id: 'herstellung', label: inhalt.werte.pflanzenkohleHerstellungKennwerte, icon: Flame },
  { id: 'wirkung', label: inhalt.werte.wirkungImBeton, icon: FlaskConical },
  { id: 'rechner', label: inhalt.werte.rechnerCoBilanz, icon: Calculator },
  { id: 'grenzen', label: inhalt.werte.grenzenRegelwerk, icon: ShieldAlert },
];

const karte = 'bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30';
const kasten = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const th = 'p-2.5 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2.5 text-xs text-text-main/85 border-b border-home-grau/15 align-top';

/** Zementarten für das Treibhauspotenzial aus src/data/zementGwp.ts (T15-NH-3; für Nachweise EPD des Herstellers verwenden) */
const ZEMENTE = [
  { id: 'cem1', label: inhalt.werte.cemIRichtwert0, gwp: ZEMENT_GWP_KG['CEM I'] },
  { id: 'cem2', label: inhalt.werte.cemIiBRichtwert, gwp: ZEMENT_GWP_KG['CEM II/B'] },
  { id: 'cem3', label: inhalt.werte.cemIiiARichtwert, gwp: ZEMENT_GWP_KG['CEM III/A'] },
] as const;

export default function Biokohlebeton() {
  const [reiter, setReiter] = useState<Reiter>('einfuehrung');
  const [mPK, setMPK] = useState(10);
  const [cGehalt, setCGehalt] = useState<number>(PK_LEHRWERT.cGehalt);
  const [fPerm, setFPerm] = useState<number>(PK_LEHRWERT.fPerm);
  const [ePK, setEPK] = useState<number>(PK_LEHRWERT.ePK);
  const [zRef, setZRef] = useState(320);
  const [deltaZ, setDeltaZ] = useState(10);
  const [gwpZ, setGwpZ] = useState<number>(ZEMENT_GWP_KG['CEM I']);
  const [w, setW] = useState(160);
  const [wAufnahme, setWAufnahme] = useState(100);

  const erg = useMemo(
    () => biokohleBilanz({ mPK, cGehalt, fPerm, ePK, zRef, deltaZ, gwpZ, w, wAufnahme }),
    [mPK, cGehalt, fPerm, ePK, zRef, deltaZ, gwpZ, w, wAufnahme]
  );

  const zahl = (v: string) => { const x = parseFloat(v); return Number.isFinite(x) ? x : NaN; };
  const tex = (x: number, n: number) => formatDeTeX(x, n);
  /** Zementmenge, deren Treibhauspotenzial der Netto-Senke der Pflanzenkohle entspricht */
  const zAequivalent = gwpZ > 0 ? erg.nettoPK / gwpZ : NaN;
  const skala = Math.max(erg.gwpRef, 1);
  const balken = (wert: number) => `${Math.max(0, Math.min(100, wert / skala * 100))}%`;

  const eingabe = (label: string, wert: number, setze: (x: number) => void, einheit: string, schritt: string) => (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold text-text-main">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          step={schritt}
          value={Number.isFinite(wert) ? wert : ''}
          onChange={e => setze(zahl(e.target.value))}
          className="w-full p-2 border border-home-grau/50 rounded-lg bg-white text-sm font-mono focus:outline-none focus:border-shiraz"
        />
        <span className="text-xs text-text-main/60 w-20 shrink-0">{einheit}</span>
      </span>
    </label>
  );

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className={`${karte} flex flex-col gap-5`}>
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Leaf className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.biokohlebetonPflanzenkohleImBeton} /></h2>
          <p className="text-xs text-text-main/50 font-mono mt-1"><MdText text={inhalt.texte.kohlenstoffspeicherImBauteilCo} /></p>
        </div>

        <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed flex items-start gap-2.5">
          <GraduationCap size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <p><MdText text={inhalt.texte.projekthinweisPflanzenkohleImBeton} /></p>
        </div>

        <ModuleTabs label={inhalt.werte.bereicheDesModulsBiokohlebeton} tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
          <div className="pt-5 animate-in fade-in duration-300">
            {/* ───────────── 1. EINFÜHRUNG ───────────── */}
            {reiter === 'einfuehrung' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <p><MdText text={inhalt.texte.pflanzenkohleEnglBiocharEntsteht} /></p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5"><MdText text={inhalt.texte.senkeStattNurMinderung} /></h3>
                    <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.zementreduktionVermeidetEmissionenPflanz} /></p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5"><MdText text={inhalt.texte.keinBindemittel} /></h3>
                    <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.pflanzenkohleReagiertNichtHydraulisch} /></p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5"><MdText text={inhalt.texte.dosierungBegrenzt} /></h3>
                    <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.inDerLiteraturWerden} /></p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                  <h3 className="text-sm font-bold text-text-main mb-2"><MdText text={inhalt.texte.lehrpfadDiesesModuls} /></h3>
                  <ol className="list-decimal pl-5 space-y-1 text-xs text-text-main/80">
                    <li><MdText text={inhalt.texte.herstellungUndKennwertePyrolyse} /></li>
                    <li><MdText text={inhalt.texte.wirkungImBetonWasseranspruch} /></li>
                    <li><MdText text={inhalt.texte.rechnerCoBilanzJe} /></li>
                    <li><MdText text={inhalt.texte.grenzenUndRegelwerkBilanzierungsregeln} /></li>
                  </ol>
                </div>
                <Querverweis ziel="oekobilanz_lca" titel={inhalt.werte.bilanzrahmenÖkobilanzNachDin} linkText={inhalt.werte.zumModulÖkobilanz}>
                  <p><MdText text={inhalt.texte.wieBiogenerKohlenstoffIn} /></p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 2. HERSTELLUNG & KENNWERTE ───────────── */}
            {reiter === 'herstellung' && (
              <div className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Pyrolyse</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.biomasseWieHolzresteGrünschnitt} /></p>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                    <BlockMath math="m_{\mathrm{CO_2}} = m_{PK} \cdot w_C \cdot \frac{44}{12} \cdot F_{perm}" />
                    <p className="text-[11px] text-text-main/70 text-center">
                      <FormulaText text={inhalt.werte.wCKohlenstoffgehaltMassenanteil} />
                    </p>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.kennwerteRichtwerteDerFachliteratur} /></h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[620px]">
                      <thead><tr><th className={th}>Kennwert</th><th className={th}><MdText text={inhalt.texte.größenordnungRichtwert} /></th><th className={th}><MdText text={inhalt.texte.bedeutungFürBeton} /></th></tr></thead>
                      <tbody>
                        <tr><td className={td}><strong>Pyrolysetemperatur</strong></td><td className={td}><MdText text={inhalt.texte.etwa350Bis900} /></td><td className={td}><MdText text={inhalt.texte.steuertKohlenstoffgehaltStabilitätUnd} /></td></tr>
                        <tr><td className={td}><strong>Kohlenstoffgehalt</strong> <FormulaText text="$w_C$" /></td><td className={td}><MdText text={inhalt.texte.etwa50Bis90} /></td><td className={td}><MdText text={inhalt.texte.bestimmtDirektDieCo} /></td></tr>
                        <tr><td className={td}><MdText text={inhalt.texte.molaresHCVerhältnis} /></td><td className={td}><MdText text={inhalt.texte.stabilitätskriteriumNachEbcKleiner} /></td><td className={td}><MdText text={inhalt.texte.maßFürDenAnteil} /></td></tr>
                        <tr><td className={td}><strong>Wasseraufnahme</strong></td><td className={td}><MdText text={inhalt.texte.häufig100Bis300} /></td><td className={td}><MdText text={inhalt.texte.wasseranspruchUndInnereNachbehandlung} /></td></tr>
                        <tr><td className={td}><strong>Schüttdichte</strong></td><td className={td}><MdText text={inhalt.texte.geringEtwa150Bis} /></td><td className={td}><MdText text={inhalt.texte.großesVolumenJeKg} /></td></tr>
                        <tr><td className={td}><strong>pH-Wert</strong></td><td className={td}><MdText text={inhalt.texte.alkalischEtwa8Bis} /></td><td className={td}><MdText text={inhalt.texte.deutlichUnterDemPh} /></td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.permanenzWieLangeBleibt} /></h3>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.fürDieTreibhausgasinventareGibt} /></p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[420px]">
                      <thead><tr><th className={th}>Herstellung</th><th className={th}><MdText text={inhalt.texte.fPerm100Jahre} /></th></tr></thead>
                      <tbody>
                        {F_PERM_IPCC.map(f => <tr key={f.id}><td className={td}>{f.label}</td><td className={td}>{formatDeZahl(f.wert, 2)}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-text-main/60 leading-relaxed flex items-start gap-1.5">
                    <Info size={13} className="shrink-0 mt-0.5" /><MdText text={inhalt.texte.imAlkalischenSauerstoffarmenZementstein} /></p>
                </section>
              </div>
            )}

            {/* ───────────── 3. WIRKUNG IM BETON ───────────── */}
            {reiter === 'wirkung' && (
              <div className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.wasseranspruchUndPorosität} /></h3>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieOffenePorenstrukturDer} /></p>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                    <BlockMath math="w_{vor} = m_{PK} \cdot \frac{W_{PK}}{100\,\%}, \qquad \left(\frac{w}{z}\right)_{neu} = \frac{w_{eff}}{z_{ref} - \Delta z}" />
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Festigkeit</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.beiKleinenZugabenBerichten} /></p>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.karbonatisierungUndPhWert} /></h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-text-main/80 leading-relaxed">
                    <li><MdText text={inhalt.texte.diePflanzenkohleSelbstIst} /></li>
                    <li><MdText text={inhalt.texte.wirdZementDurchKohle} /></li>
                    <li><MdText text={inhalt.texte.gegenläufigKannDieInnere} /></li>
                    <li><MdText text={inhalt.texte.prüfpraxisAufDunklerMatrix} /></li>
                  </ul>
                  <Querverweis ziel="schnellkarbonatisierung" titel={inhalt.werte.karbonatisierungswiderstandPrüfen} linkText={inhalt.werte.zumModulSchnellkarbonatisierung}>
                    <p><MdText text={inhalt.texte.prüfverfahrenMit3Co} /></p>
                  </Querverweis>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.dunkleMatrixÄsthetikUnd} /></h3>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.feinGemahlenerKohlenstoffWirkt} /></p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-text-main/80">
                    <li><MdText text={inhalt.texte.kalkausblühungenUndWolkenbildungFallen} /></li>
                    <li><MdText text={inhalt.texte.dunkleOberflächenAbsorbierenMehr} /></li>
                    <li><MdText text={inhalt.texte.dieDunkleFärbungDurchzieht} /></li>
                  </ul>
                  <Querverweis ziel="sichtbeton" titel={inhalt.werte.farbtongleichmäßigkeitBeiSichtbeton} linkText={inhalt.werte.zumModulSichtbeton}>
                    <p><MdText text={inhalt.texte.anforderungenAnFarbtongleichmäßigkeitMus} /></p>
                  </Querverweis>
                </section>
              </div>
            )}

            {/* ───────────── 4. RECHNER ───────────── */}
            {reiter === 'rechner' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Pflanzenkohle</h3>
                    {eingabe(inhalt.werte.dosierungMPkTrockenmasse, mPK, setMPK, 'kg/m³', '1')}
                    {eingabe(inhalt.werte.kohlenstoffgehaltWC, cGehalt, setCGehalt, 'M.-%', '1')}
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.permanenzfaktorFPermIpcc} /></span>
                      <select
                        aria-label="Permanenzfaktor"
                        value={String(fPerm)}
                        onChange={e => setFPerm(zahl(e.target.value))}
                        className="p-2 border border-home-grau/50 rounded-lg bg-white text-sm focus:outline-none focus:border-shiraz"
                      >
                        {F_PERM_IPCC.map(f => <option key={f.id} value={String(f.wert)}>{f.label}: {formatDeZahl(f.wert, 2)}</option>)}
                        <option value="1">ohne Abschlag: 1,00</option>
                      </select>
                    </label>
                    {eingabe(inhalt.werte.herstellungsemissionEPkRichtwert, ePK, setEPK, 'kg CO₂e/kg', '0.05')}
                    {eingabe(inhalt.werte.wasseraufnahmeDerKohleW, wAufnahme, setWAufnahme, 'M.-%', '10')}
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider pt-2">Bindemittel</h3>
                    {eingabe(inhalt.werte.zementgehaltDerReferenzZ, zRef, setZRef, 'kg/m³', '5')}
                    {eingabe(inhalt.werte.zementreduktionZ0Reine, deltaZ, setDeltaZ, 'kg/m³', '5')}
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.treibhauspotenzialDesZements} /></span>
                      <select
                        aria-label="Zementart"
                        value={String(gwpZ)}
                        onChange={e => setGwpZ(zahl(e.target.value))}
                        className="p-2 border border-home-grau/50 rounded-lg bg-white text-sm focus:outline-none focus:border-shiraz"
                      >
                        {ZEMENTE.map(z => <option key={z.id} value={String(z.gwp)}>{z.label}</option>)}
                      </select>
                    </label>
                    {eingabe(inhalt.werte.wirksamerWassergehaltWEff, w, setW, 'kg/m³', '5')}
                  </div>
                  <EingabeHinweise hinweise={erg.hinweise} />
                </div>

                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs text-text-main/60 font-bold uppercase tracking-wide"><MdText text={inhalt.texte.minderungGegenüberReferenz} /></div>
                        <div className="text-3xl font-black text-shiraz font-mono">{formatDeZahl(erg.minderung, 1)} <span className="text-base">kg CO₂e/m³</span></div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-text-main/60 font-bold uppercase tracking-wide"><MdText text={inhalt.texte.bezogenAufDenZementanteil} /></div>
                        <div className="text-2xl font-black text-text-main font-mono">{formatDeZahl(erg.minderungProzent, 1)} %</div>
                      </div>
                    </div>

                    {/* Balkenvergleich je m³ */}
                    <div className="flex flex-col gap-2 text-[11px] text-text-main/80" aria-label={inhalt.werte.vergleichDerTreibhauspotenzialeJe}>
                      {[
                        { l: inhalt.werte.referenzZement, w: erg.gwpRef, f: 'bg-slate-500' },
                        { l: inhalt.werte.varianteZement, w: erg.zNeu * gwpZ, f: 'bg-slate-400' },
                        { l: inhalt.werte.herstellungPflanzenkohle, w: erg.ePK, f: 'bg-amber-500' },
                        { l: inhalt.werte.gespeichertesCoGutschrift, w: erg.co2Speicher, f: 'bg-emerald-600' },
                        { l: inhalt.werte.varianteNetto, w: erg.gwpNeu, f: 'bg-shiraz' },
                      ].map(b => (
                        <div key={b.l} className="grid grid-cols-12 items-center gap-2">
                          <span className="col-span-4">{b.l}</span>
                          <span className="col-span-6 h-4 bg-off-white rounded overflow-hidden"><span className={`block h-full ${b.f}`} style={{ width: balken(b.w) }} /></span>
                          <span className="col-span-2 font-mono text-right">{formatDeZahl(b.w, 1)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { l: inhalt.werte.coImKohlenstoff, w: formatDeZahl(erg.co2Brutto, 1), e: 'kg/m³' },
                        { l: inhalt.werte.nettoSenkeKohle, w: formatDeZahl(erg.nettoPK, 1), e: 'kg/m³' },
                        { l: inhalt.werte.entsprichtZement, w: formatDeZahl(zAequivalent, 0), e: 'kg/m³' },
                        { l: inhalt.werte.dosierungBezZement, w: formatDeZahl(erg.dosierungZ, 1), e: 'M.-%' },
                        { l: 'Vornässwasser', w: formatDeZahl(erg.wVornass, 1), e: 'kg/m³' },
                        { l: inhalt.werte.wZReferenz, w: formatDeZahl(erg.wzRef, 2), e: '' },
                        { l: inhalt.werte.wZVariante, w: formatDeZahl(erg.wzNeu, 2), e: '' },
                        { l: inhalt.werte.zementVariante, w: formatDeZahl(erg.zNeu, 0), e: 'kg/m³' },
                      ].map(k => (
                        <div key={k.l} className="p-3 rounded-lg border border-home-grau/30 bg-off-white">
                          <div className="text-[10px] text-text-main/60 font-bold">{k.l}</div>
                          <div className="font-mono font-bold text-text-main text-sm">{k.w} <span className="text-[10px] text-text-main/60">{k.e}</span></div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-text-main/60 leading-relaxed"><MdText text={inhalt.texte.bilanziertWirdNurDer} /></p>
                  </div>

                  <FormulaDerivationBox
                    live
                    kurzzeile={kurzzeile(ansageWert('Minderung gegenüber Referenz', erg.minderung, 1, 'kg CO₂e/m³'), ansageWert('bezogen auf den Zementanteil', erg.minderungProzent, 1, '%'), ansageWert('Variante netto', erg.gwpNeu, 1, 'kg CO₂e/m³'))}
                    title={inhalt.werte.ihrRechenwegCoBilanz}
                    zielGleichung="\Delta GWP = \Delta z \cdot GWP_Z + m_{PK} \cdot \left(w_C \cdot \tfrac{44}{12} \cdot F_{perm} - e_{PK}\right)"
                    schritte={[
                      {
                        titel: inhalt.werte.kohlenstoffAlsCo,
                        erklaerung: inhalt.werte.masseKohlenstoffMalVerhältnis,
                        formel: `m_{PK} \\cdot w_C \\cdot \\tfrac{44}{12} = ${tex(mPK, 1)} \\cdot ${tex(cGehalt / 100, 2)} \\cdot ${tex(CO2_JE_C, 3)} = ${tex(erg.co2Brutto, 2)}\\,\\tfrac{\\text{kg}}{\\text{m}^3}`,
                      },
                      {
                        titel: 'Permanenzabschlag',
                        erklaerung: inhalt.werte.nurDerLangfristigGebundene,
                        formel: `C_{PK} = ${tex(erg.co2Brutto, 2)} \\cdot ${tex(fPerm, 2)} = ${tex(erg.co2Speicher, 2)}\\,\\tfrac{\\text{kg}}{\\text{m}^3}`,
                      },
                      {
                        titel: inhalt.werte.herstellungsemissionAbziehen,
                        erklaerung: inhalt.werte.pyrolyseAufbereitungUndTransport,
                        formel: `C_{PK} - m_{PK} \\cdot e_{PK} = ${tex(erg.co2Speicher, 2)} - ${tex(mPK, 1)} \\cdot ${tex(ePK, 2)} = ${tex(erg.nettoPK, 2)}\\,\\tfrac{\\text{kg}}{\\text{m}^3}`,
                      },
                      {
                        titel: 'Zementreduktion',
                        erklaerung: inhalt.werte.vermiedeneEmissionDurchWeniger,
                        formel: `E_Z = \\Delta z \\cdot GWP_Z = ${tex(deltaZ, 0)} \\cdot ${tex(gwpZ, Math.abs(gwpZ * 100 - Math.round(gwpZ * 100)) > 1e-6 ? 3 : 2)} = ${tex(erg.eZement, 2)}\\,\\tfrac{\\text{kg}}{\\text{m}^3}`,
                      },
                      {
                        titel: inhalt.werte.minderungGesamt,
                        erklaerung: inhalt.werte.summeAusZementeinsparungUnd,
                        formel: `\\Delta GWP = ${tex(erg.eZement, 2)} + ${tex(erg.nettoPK, 2)} = ${tex(erg.minderung, 2)}\\,\\tfrac{\\text{kg}}{\\text{m}^3} \\;\\hat{=}\\; ${tex(erg.minderungProzent, 1)}\\,\\%\\ \\text{von}\\ ${tex(erg.gwpRef, 1)}`,
                      },
                    ]}
                    ergebnisHinweis={inhalt.werte.jeKgPflanzenkohleMit}
                    normQuelle={inhalt.werte.stöchiometriePermanenzfaktorenNachIpcc}
                  />
                </div>
              </div>
            )}

            {/* ───────────── 5. GRENZEN & REGELWERK ───────────── */}
            {reiter === 'grenzen' && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.bilanzierungÜberDenLebenszyklus} /></h3><MdText text={inhalt.texte.inEinerEpdNach} /></div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.herkunftUndQualitätDer} /></h3><MdText text={inhalt.texte.dieSenkeSetztNachhaltig} /></div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.normativeEinordnung} /></h3><MdText text={inhalt.texte.pflanzenkohleIstWederZement} /></div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.offeneFragenDerForschung} /></h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><MdText text={inhalt.texte.langzeitbeständigkeitDesKohlenstoffsIm} /></li>
                      <li><MdText text={inhalt.texte.einflussAufKarbonatisierungChlorideindri} /></li>
                      <li><MdText text={inhalt.texte.wechselwirkungMitFließmittelnUnd} /></li>
                      <li><MdText text={inhalt.texte.gleichmäßigkeitVonFestigkeitUnd} /></li>
                    </ul>
                  </div>
                </div>
                <Querverweis ziel="innovative_werkstoffe" titel={inhalt.werte.weitereEntwicklungen} linkText={inhalt.werte.zumModulEntwicklungen}>
                  <p><MdText text={inhalt.texte.geopolymereCoReduzierteBindemittel} /></p>
                </Querverweis>
              </div>
            )}
          </div>
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIEL */}
      <div className={karte}>
        <h3 className="text-base font-bold text-text-main mb-1">Beispiel</h3>
        <FormulaDerivationBox
          title={inhalt.werte.beispielWieVielZement}
          zielGleichung="z_{\ddot{a}q} = \frac{w_C \cdot \frac{44}{12} \cdot F_{perm} - e_{PK}}{GWP_Z}"
          schritte={inhalt.daten["Biokohlebeton.schritte"]}
          ergebnisHinweis={inhalt.werte.dieBilanzReagiertEmpfindlich}
          normQuelle={inhalt.werte.lehrbeispielRichtwerteNachIpcc}
        />
      </div>

      <ModulTest moduleId="biokohlebeton" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap6}
        wikipedia={[
          { title: 'Pflanzenkohle', url: 'https://de.wikipedia.org/wiki/Pflanzenkohle' },
          { title: 'Pyrolyse', url: 'https://de.wikipedia.org/wiki/Pyrolyse' },
        ]}
        literatur={inhalt.daten["Biokohlebeton.literatur"]}
        weblinks={[{ title: inhalt.werte.ebcRichtlinienÖffentlich, url: 'https://www.european-biochar.org' }]}
        regelwerke={inhalt.daten["Biokohlebeton.regelwerke"]}
        formeln={inhalt.daten["Biokohlebeton.formeln"]}
      />
    </div>
  );
}
