import React, { useMemo, useState } from 'react';
import { Recycle, Layers, ScanLine, AlertTriangle, Building2, Calculator } from 'lucide-react';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Slider } from '@/src/components/ui/Slider';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { sortierbilanz, ALTHOLZ_KATEGORIEN, KATEGORIE_NAME, ZIEL_STOFFLICH, type AltholzKategorie } from '@/src/calc/altholz';
import inhalt from '@/content/altholzurbanmining/AltholzUrbanMining.json';
import { MdText } from '@/src/components/inhalt/MdText';

type Reiter = 'einfuehrung' | 'kategorien' | 'nir' | 'grenzen' | 'urbanmining' | 'rechner';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Einführung', icon: Recycle },
  { id: 'kategorien', label: inhalt.werte.altholzvKategorien, icon: Layers },
  { id: 'nir', label: 'NIR-Sortierung', icon: ScanLine },
  { id: 'grenzen', label: inhalt.werte.grenzenDerSensorik, icon: AlertTriangle },
  { id: 'urbanmining', label: inhalt.werte.urbanMiningKataster, icon: Building2 },
  { id: 'rechner', label: inhalt.werte.rechnerSortierbilanz, icon: Calculator },
];

const karte = 'bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm';
const box = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const zelle = 'p-2 border border-home-grau/30';

/** Kategorien nach § 2 AltholzV mit typischen Beispielen (Anhang III, Regelzuordnung) */
const KATEGORIEN = [
  { k: 'A I', def: inhalt.werte.naturbelassenesOderLediglichMechanisch, bsp: inhalt.werte.palettenAusVollholzKabeltrommeln, weg: inhalt.werte.stofflichHolzwerkstoffeOderEnergetisch },
  { k: 'A II', def: inhalt.werte.verleimtesGestrichenesBeschichtetesLacki, bsp: inhalt.werte.spanplattenUndMöbelresteOhne, weg: inhalt.werte.stofflichHolzwerkstoffeOderEnergetisch2 },
  { k: 'A III', def: inhalt.werte.altholzMitHalogenorganischenVerbindungen, bsp: inhalt.werte.pvcBeschichteteMöbelteileUnd, weg: inhalt.werte.stofflichNurNachWeitgehender },
  { k: 'A IV', def: inhalt.werte.mitHolzschutzmittelnBehandeltesAltholz, bsp: inhalt.werte.bahnschwellenLeitungsmastenHopfenstangen, weg: inhalt.werte.energetischInAnlagenNach },
] as const;

/** Anhang II AltholzV: Grenzwerte für Holzhackschnitzel und -späne zur Herstellung von Holzwerkstoffen [mg/kg TM] */
const ANHANG2 = [
  ['Arsen', 2], ['Blei', 30], ['Cadmium', 2], ['Chrom', 30], ['Kupfer', 20], ['Quecksilber', 0.4],
  ['Chlor', 600], ['Fluor', 100], [inhalt.werte.pentachlorphenolPcp, 3], [inhalt.werte.polychlorierteBiphenylePcb, 5],
] as const;

const FARBE: Readonly<Record<AltholzKategorie, string>> = { AI: '#15803d', AII: '#65a30d', AIII: '#d97706', AIV: '#A3113E' };

/** Balken der beiden Ausgangslinien mit Anteilen je Kategorie */
function LinienBalken({ stroeme, linie, gesamt }: { stroeme: { kategorie: AltholzKategorie; inStofflich: number; inEnergetisch: number }[]; linie: 'st' | 'en'; gesamt: number }) {
  const summe = stroeme.reduce((s, x) => s + (linie === 'st' ? x.inStofflich : x.inEnergetisch), 0);
  return (
    <div>
      <div className="flex justify-between text-xs text-text-main/70 mb-1">
        <span>{linie === 'st' ? inhalt.werte.stofflicheLinieZielA : inhalt.werte.energetischeLinieZielA}</span>
        <span>{formatDeZahl(summe, 2)} t</span>
      </div>
      <div className="flex h-5 rounded-md overflow-hidden border border-home-grau/30 bg-off-white" style={{ width: `${gesamt > 0 ? Math.max(4, (summe / gesamt) * 100) : 4}%` }}
        role="img" aria-label={`${linie === 'st' ? 'Stoffliche' : 'Energetische'} Linie mit ${formatDeZahl(summe, 2)} t`}>
        {stroeme.map(x => {
          const m = linie === 'st' ? x.inStofflich : x.inEnergetisch;
          return summe > 0 && m > 0 ? <div key={x.kategorie} style={{ width: `${(m / summe) * 100}%`, background: FARBE[x.kategorie] }} title={`${KATEGORIE_NAME[x.kategorie]}: ${formatDeZahl(m, 2)} t`} /> : null;
        })}
      </div>
    </div>
  );
}

export default function AltholzUrbanMining() {
  const [tab, setTab] = useState<Reiter>('einfuehrung');

  const [masse, setMasse] = useState<Record<AltholzKategorie, number>>({ AI: 15, AII: 45, AIII: 15, AIV: 25 });
  const [ausbringen, setAusbringen] = useState<Record<AltholzKategorie, number>>({ AI: 95, AII: 90, AIII: 85, AIV: 95 });

  const erg = useMemo(() => sortierbilanz({
    masse,
    ausbringen: { AI: ausbringen.AI / 100, AII: ausbringen.AII / 100, AIII: ausbringen.AIII / 100, AIV: ausbringen.AIV / 100 },
  }), [masse, ausbringen]);

  const gueltig = Number.isFinite(erg.mSt);
  const tex = (v: number, d = 2) => formatDeTeX(v, d);
  const pct = (v: number, d = 1) => formatDeTeX(v * 100, d);
  const st = (k: AltholzKategorie) => erg.stroeme.find(x => x.kategorie === k);

  const liveSchritte = gueltig ? [
    {
      titel: 'Eingangsmasse',
      erklaerung: inhalt.werte.summeDerTatsächlichAngelieferten,
      formel: `M_{in} = ${ALTHOLZ_KATEGORIEN.map(k => tex(masse[k], 1)).join(' + ')} = ${tex(erg.mIn)}\\,\\text{t}`,
    },
    {
      titel: inhalt.werte.masseDerStofflichenLinie,
      erklaerung: inhalt.werte.richtigGelenktesAI,
      formel: `M_{st} = \\underbrace{${tex(ausbringen.AI / 100)} \\cdot ${tex(masse.AI, 1)} + ${tex(ausbringen.AII / 100)} \\cdot ${tex(masse.AII, 1)}}_{\\text{A I, A II richtig}} + \\underbrace{${tex(1 - ausbringen.AIII / 100)} \\cdot ${tex(masse.AIII, 1)} + ${tex(1 - ausbringen.AIV / 100)} \\cdot ${tex(masse.AIV, 1)}}_{\\text{A III, A IV fehlsortiert}} = ${tex(erg.mSt)}\\,\\text{t}`,
    },
    {
      titel: 'Fehlsortierquote',
      erklaerung: inhalt.werte.alleMassenDieIn,
      formel: `q_F = \\frac{\\sum_k (1 - a_k)\\, m_k}{M_{in}} = \\frac{${tex(erg.mFehl)}}{${tex(erg.mIn)}} = ${pct(erg.qFehl)}\\,\\%`,
    },
    {
      titel: inhalt.werte.reinheitUndAIv,
      erklaerung: erg.mSt > 0 ? inhalt.werte.anteilRichtigSortiertenHolzes : inhalt.werte.dieStofflicheLinieIst,
      formel: erg.mSt > 0
        ? `R_{st} = \\frac{${tex((st('AI')?.inStofflich ?? 0) + (st('AII')?.inStofflich ?? 0))}}{${tex(erg.mSt)}} = ${pct(erg.reinheitSt)}\\,\\%, \\quad w_{A\\,IV} = \\frac{${tex(st('AIV')?.inStofflich ?? 0)}}{${tex(erg.mSt)}} = ${pct(erg.anteilAIVSt, 2)}\\,\\%`
        : 'M_{st} = 0',
    },
    {
      titel: inhalt.werte.stofflicheVerwertungsquote,
      erklaerung: inhalt.werte.nurRichtigSortiertesA,
      formel: `q_{st} = \\frac{${tex((st('AI')?.inStofflich ?? 0) + (st('AII')?.inStofflich ?? 0))}}{${tex(erg.mIn)}} = ${pct(erg.qSt)}\\,\\% \\quad (q_{st,max} = ${pct(erg.qStMax)}\\,\\%)`,
    },
  ] : inhalt.daten.AltholzUrbanMining;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Recycle className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.altholzNirSortierungUnd} /></h2>
        <p className={box}><MdText text={inhalt.texte.holzAusRückbauSperrmüll} /></p>
        <div className="p-4 rounded-xl border border-sky-200 bg-sky-50 text-sm text-sky-950 leading-relaxed" role="note"><MdText text={inhalt.texte.projekthinweisDieSensorgestützteSortieru} /></div>

        <ModuleTabs label={inhalt.werte.bereicheDesModulsAltholz} tabs={REITER} aktiv={tab} onWechsel={setTab}>
          {tab === 'einfuehrung' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.altholzAlsStoffstrom} /></h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.mengeInDeutschlandFallen} /></li>
                  <li><MdText text={inhalt.texte.verwertungswegeEtwaEinFünftel} /></li>
                  <li><MdText text={inhalt.texte.abfallhierarchieDasKreislaufwirtschaftsg} /></li>
                  <li><MdText text={inhalt.texte.kaskadennutzungHolzWirdMöglichst} /></li>
                </ul>
              </div>
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.warumSortieren} /></h3>
                <div className="flex flex-col gap-3 text-sm text-text-main/85">
                  <div className={box}><MdText text={inhalt.texte.qualitätHolzwerkstoffwerkeDürfenNur} /></div>
                  <div className={box}><MdText text={inhalt.texte.rechtAltholzDerKategorie} /></div>
                  <div className={box}><MdText text={inhalt.texte.wirtschaftJeReinerDie} /></div>
                </div>
                <Querverweis ziel="abfaelle" titel={inhalt.werte.abfallrechtImÜberblick} linkText={inhalt.werte.zumModulAbfälleAltlasten} className="mt-4">{inhalt.werte.avvSchlüsselAbfallhierarchieUnd}</Querverweis>
              </div>
            </div>
          )}

          {tab === 'kategorien' && (
            <div className="flex flex-col gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-1"><MdText text={inhalt.texte.altholzkategorienNach2Altholzv} /></h3>
                <p className="text-xs text-text-main/70 mb-3"><MdText text={inhalt.texte.definitionenSinngemäßNach2} /></p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse min-w-[680px]">
                    <thead><tr className="bg-off-white text-left"><th className={zelle}>Kategorie</th><th className={zelle}>Definition</th><th className={zelle}><MdText text={inhalt.texte.typischeBeispiele} /></th><th className={zelle}>Verwertung</th></tr></thead>
                    <tbody>
                      {KATEGORIEN.map(z => (
                        <tr key={z.k}><td className={`${zelle} font-bold`}>{z.k}</td><td className={zelle}>{z.def}</td><td className={zelle}>{z.bsp}</td><td className={zelle}>{z.weg}</td></tr>
                      ))}
                      <tr><td className={`${zelle} font-bold`}>PCB-Altholz</td><td className={zelle}><MdText text={inhalt.texte.altholzDasPcbIm} /></td><td className={zelle}><MdText text={inhalt.texte.zBMitPcb} /></td><td className={zelle}><MdText text={inhalt.texte.beseitigungNachPcbPct} /></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-1"><MdText text={inhalt.texte.grenzwerteFürHolzwerkstoffeAnhang} /></h3>
                  <p className="text-xs text-text-main/70 mb-3"><MdText text={inhalt.texte.holzhackschnitzelUndHolzspäneZur} /></p>
                  <table className="w-full text-xs border-collapse">
                    <thead><tr className="bg-off-white text-left"><th className={zelle}>Stoff</th><th className={zelle}><MdText text={inhalt.texte.grenzwertInMgKg} /></th></tr></thead>
                    <tbody>{ANHANG2.map(([s, w]) => <tr key={s}><td className={zelle}>{s}</td><td className={zelle}>{formatDeZahl(w, w < 1 ? 1 : 0)}</td></tr>)}</tbody>
                  </table>
                </div>
                <div className="flex flex-col gap-6">
                  <div className={karte}>
                    <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.pflichtenImÜberblick} /></h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                      <li><MdText text={inhalt.texte.zuordnungDerBesitzerOrdnet} /></li>
                      <li><MdText text={inhalt.texte.getrennthaltungAIvUnd} /></li>
                      <li><MdText text={inhalt.texte.stofflicheVerwertungZulässigFür} /></li>
                      <li><MdText text={inhalt.texte.energetischeVerwertungAIii} /></li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-950 leading-relaxed">
                    <h3 className="font-bold mb-2"><MdText text={inhalt.texte.novelleDerAltholzvStand} /></h3>
                    <p className="mb-2"><MdText text={inhalt.texte.dieAltholzvVom15} /></p>
                    <p><MdText text={inhalt.texte.einInkrafttretenDerNovelle} /></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'nir' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.prinzipDerNirSpektroskopie} /></h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.spektralbereichNahesInfrarotUmfasst} /></li>
                  <li><MdText text={inhalt.texte.wechselwirkungImNirLiegen} /></li>
                  <li><MdText text={inhalt.texte.holzCelluloseHemicellulosenUnd} /></li>
                  <li><MdText text={inhalt.texte.holzfremdeStoffeBindemittelMit} /></li>
                </ul>
                <Querverweis ziel="analytik" titel={inhalt.werte.spektroskopischeVerfahren} linkText={inhalt.werte.zumModulAnalytik} className="mt-4">{inhalt.werte.weitereAnalyseverfahrenWieRöntgenfluores}</Querverweis>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.ablaufDerSensorgestütztenSortierung} /></h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-text-main/85">
                    <li><MdText text={inhalt.texte.aufbereitungVorzerkleinernAbtrennenVon} /></li>
                    <li><MdText text={inhalt.texte.messungEineHyperspektralkameraNimmt} /></li>
                    <li><MdText text={inhalt.texte.auswertungVorverarbeitungDerSpektren} /></li>
                    <li><MdText text={inhalt.texte.ausschleusungErkannteStückeWerden} /></li>
                  </ol>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.kennzahlenEinerSortierung} /></h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><MdText text={inhalt.texte.ausbringenEinerKategorieAnteil} /></li>
                    <li><MdText text={inhalt.texte.reinheitEinerAusgangsfraktionAnteil} /></li>
                    <li><MdText text={inhalt.texte.fehlsortierquoteFehlgelenkteMasseBezogen} /></li>
                  </ul>
                  <p className="text-xs text-text-main/70 mt-3"><MdText text={inhalt.texte.ausbringenUndReinheitStehen} /></p>
                </div>
              </div>
            </div>
          )}

          {tab === 'grenzen' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.wasNirNichtSieht} /></h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.nurDieOberflächeNir} /></li>
                  <li><MdText text={inhalt.texte.anorganischeHolzschutzmittelSalzeAuf} /></li>
                  <li><MdText text={inhalt.texte.geringeKonzentrationenOrganischeWirkstof} /></li>
                  <li><MdText text={inhalt.texte.störgrößenFeuchteÜberlagertDie} /></li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.folgerungenFürDiePraxis} /></h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><MdText text={inhalt.texte.sensorgestützteSortierungErgänztEingangs} /></li>
                    <li><MdText text={inhalt.texte.dieKategorieHängtAuch} /></li>
                    <li><MdText text={inhalt.texte.klassifikatorenSindNurSo} /></li>
                    <li><MdText text={inhalt.texte.kombinierteSensorikNirRfa} /></li>
                  </ul>
                </div>
                <Querverweis ziel="holzkorrosion" titel={inhalt.werte.holzschutzUndHolzschutzmittel} linkText={inhalt.werte.zumModulHolzkorrosion}>{inhalt.werte.welcheHolzschutzmittelFrüherEingesetzt}</Querverweis>
              </div>
            </div>
          )}

          {tab === 'urbanmining' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.urbanMiningDieStadt} /></h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.anthropogenesLagerNachSchätzungen} /></li>
                  <li><MdText text={inhalt.texte.leitgedankeBauwerkeWerdenAls} /></li>
                  <li><MdText text={inhalt.texte.holzImLagerDachstühle} /></li>
                  <li><MdText text={inhalt.texte.kohlenstoffHolzBestehtZu} /></li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Materialkataster</h3>
                  <p className="text-sm text-text-main/85 mb-3"><MdText text={inhalt.texte.einMaterialkatasterErfasstWelche} /></p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><MdText text={inhalt.texte.bottomUpGebäudeMaterialpass} /></li>
                    <li><MdText text={inhalt.texte.topDownQuartierStadt} /></li>
                  </ul>
                  <div className="bg-off-white rounded-xl border border-home-grau/30 p-3 mt-3 text-sm text-text-main/85"><MdText text={inhalt.texte.abschätzungMBgfSub} /></div>
                </div>
                <Querverweis ziel="materialpaesse" titel="Materialpässe" linkText={inhalt.werte.zumModulMaterialpässe}>{inhalt.werte.aufbauUndInhalteDigitaler}</Querverweis>
              </div>
            </div>
          )}

          {tab === 'rechner' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className="flex flex-col gap-4">
                <CalculatorDisclaimerBanner className="my-1" customText={inhalt.werte.lehrrechnerVereinfachtesZweiLinien} />
                <div className={box}>
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3"><MdText text={inhalt.texte.eingangMasseJeTatsächlicher} /></h3>
                  <div className="flex flex-col gap-4">
                    {ALTHOLZ_KATEGORIEN.map(k => (
                      <Slider key={k} label={`Masse ${KATEGORIE_NAME[k]}`} min={0} max={100} step={1} value={masse[k]} unit="t"
                        onChange={e => setMasse(m => ({ ...m, [k]: Number(e.target.value) }))} />
                    ))}
                  </div>
                </div>
                <div className={box}>
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3"><MdText text={inhalt.texte.sortiererAusbringenInDie} /></h3>
                  <div className="flex flex-col gap-4">
                    {ALTHOLZ_KATEGORIEN.map(k => (
                      <Slider key={k} label={`Ausbringen ${KATEGORIE_NAME[k]}`} info={ZIEL_STOFFLICH[k] ? inhalt.werte.ziellinieStofflichHolzwerkstoffe : inhalt.werte.ziellinieEnergetisch17Bimschv}
                        min={0} max={100} step={1} value={ausbringen[k]} unit="%"
                        onChange={e => setAusbringen(a => ({ ...a, [k]: Number(e.target.value) }))} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Ergebnis</h3>
                  {gueltig ? (
                    <>
                      <div className="flex flex-col gap-3 mb-4">
                        <LinienBalken stroeme={erg.stroeme} linie="st" gesamt={erg.mIn} />
                        <LinienBalken stroeme={erg.stroeme} linie="en" gesamt={erg.mIn} />
                        <div className="flex flex-wrap gap-3 text-xs text-text-main/75">
                          {ALTHOLZ_KATEGORIEN.map(k => <span key={k} className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm" style={{ background: FARBE[k] }} aria-hidden="true" />{KATEGORIE_NAME[k]}</span>)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70"><MdText text={inhalt.texte.stofflicheVerwertungsquoteQSt} /></div><div className="text-lg font-bold text-shiraz">{formatDeZahl(erg.qSt * 100, 1)} %</div><div className="text-xs text-text-main/70">höchstens {formatDeZahl(erg.qStMax * 100, 1)} %</div></div>
                        <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70"><MdText text={inhalt.texte.fehlsortierquoteQF} /></div><div className="text-lg font-bold">{formatDeZahl(erg.qFehl * 100, 1)} %</div><div className="text-xs text-text-main/70">{formatDeZahl(erg.mFehl, 2)}<MdText text={inhalt.texte.tFehlgelenkt} /></div></div>
                        <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70"><MdText text={inhalt.texte.reinheitStofflicheLinie} /></div><div className="text-lg font-bold">{erg.mSt > 0 ? `${formatDeZahl(erg.reinheitSt * 100, 1)} %` : '–'}</div></div>
                        <div className={`p-3 rounded-xl border ${erg.anteilAIVSt > 0.005 ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}><div className="text-xs"><MdText text={inhalt.texte.aIvInDer} /></div><div className="text-lg font-bold">{formatDeZahl(erg.anteilAIVSt * 100, 2)} %</div></div>
                      </div>
                      <div className="overflow-x-auto mt-4">
                        <table className="w-full text-xs border-collapse">
                          <thead><tr className="bg-off-white text-left"><th className={zelle}>Kategorie</th><th className={zelle}><MdText text={inhalt.texte.eingangInT} /></th><th className={zelle}><MdText text={inhalt.texte.stofflichInT} /></th><th className={zelle}><MdText text={inhalt.texte.energetischInT} /></th><th className={zelle}><MdText text={inhalt.texte.fehlsortiertInT} /></th></tr></thead>
                          <tbody>
                            {erg.stroeme.map(x => (
                              <tr key={x.kategorie}><td className={`${zelle} font-semibold`}>{KATEGORIE_NAME[x.kategorie]}</td><td className={zelle}>{formatDeZahl(x.m, 2)}</td><td className={zelle}>{formatDeZahl(x.inStofflich, 2)}</td><td className={zelle}>{formatDeZahl(x.inEnergetisch, 2)}</td><td className={zelle}>{formatDeZahl(x.fehl, 2)}</td></tr>
                            ))}
                            <tr className="font-bold"><td className={zelle}>Summe</td><td className={zelle}>{formatDeZahl(erg.mIn, 2)}</td><td className={zelle}>{formatDeZahl(erg.mSt, 2)}</td><td className={zelle}>{formatDeZahl(erg.mEn, 2)}</td><td className={zelle}>{formatDeZahl(erg.mFehl, 2)}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.keineBerechnungMöglich} /></p>}
                  <EingabeHinweise hinweise={erg.hinweise} />
                </div>
                <FormulaDerivationBox
                  live
                  title={`Ihr Rechenweg: Sortierbilanz für ${formatDeZahl(erg.mIn, 1)} t Altholz`}
                  zielGleichung="q_{st} = \frac{\sum_{A\,I,\,A\,II} a_k\, m_k}{M_{in}}, \quad q_F = \frac{\sum_k (1 - a_k)\, m_k}{M_{in}}"
                  schritte={liveSchritte}
                  ergebnisHinweis={inhalt.werte.schonWenigeProzentFehlgelenktes}
                  normQuelle={inhalt.werte.massenbilanzErhaltungDerMasse}
                />
              </div>
            </div>
          )}
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIELE */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1WirkungEiner}
        zielGleichung="w_{A\,IV} = \frac{(1 - a_{IV})\, m_{IV}}{M_{st}}"
        schritte={inhalt.daten["AltholzUrbanMining.schritte"]}
        ergebnisHinweis={inhalt.werte.eineNachsortierungSenktDen}
        normQuelle={inhalt.werte.massenbilanzAusbringenDerZweiten}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2HolzpotenzialEines}
        zielGleichung="m = \sum_i \text{BGF}_i \cdot \text{MI}_i"
        schritte={inhalt.daten["AltholzUrbanMining.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dasKatasterLiefertGrößenordnungen}
        normQuelle={inhalt.werte.topDownAbschätzungMit}
      />

      <ModulTest moduleId="altholz_urban_mining" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026NeuErstellt}
        wikipedia={[
          { title: 'Altholzverordnung', url: 'https://de.wikipedia.org/wiki/Altholzverordnung' },
          { title: 'Nahinfrarotspektroskopie', url: 'https://de.wikipedia.org/wiki/Nahinfrarotspektroskopie' },
        ]}
        weblinks={[
          inhalt.daten["AltholzUrbanMining.weblinks.0"],
          { title: inhalt.werte.umweltbundesamtDasAnthropogeneLager, url: 'https://www.umweltbundesamt.de/themen/abfall-ressourcen/abfallwirtschaft/urban-mining/das-anthropogene-lager' },
        ]}
        literatur={inhalt.daten["AltholzUrbanMining.literatur"]}
        regelwerke={inhalt.daten["AltholzUrbanMining.regelwerke"]}
        formeln={inhalt.daten["AltholzUrbanMining.formeln"]}
      />
    </div>
  );
}
