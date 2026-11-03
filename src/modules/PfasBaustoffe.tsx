import React, { useMemo, useState } from 'react';
import { Droplets, Building2, Scale, Hammer, FlaskConical, Calculator, ShieldCheck } from 'lucide-react';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Slider } from '@/src/components/ui/Slider';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { formatDeZahl, formatDeTeX, formatDeGanzzahl } from '@/src/utils/numberFormat';
import { pfasSummenbewertung, ersatzwert, PFAS20, PFAS4, PFAS_GRENZWERTE, type PfasId, type BgAnsatz, type PfasSumme } from '@/src/calc/pfas';
import inhalt from '@/content/pfasbaustoffe/PfasBaustoffe.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

type Reiter = 'einfuehrung' | 'vorkommen' | 'regulierung' | 'rueckbau' | 'analytik' | 'rechner';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: inhalt.werte.wasSindPfas, icon: Droplets },
  { id: 'vorkommen', label: inhalt.werte.pfasInBaustoffen, icon: Building2 },
  { id: 'regulierung', label: 'Regulierung', icon: Scale },
  { id: 'rueckbau', label: inhalt.werte.rückbauEntsorgung, icon: Hammer },
  { id: 'analytik', label: 'Analytik', icon: FlaskConical },
  { id: 'rechner', label: inhalt.werte.rechnerPfasSummen, icon: Calculator },
];

const karte = 'bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm';
const box = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const zelle = 'p-2 border border-home-grau/30';

/** Beispielprobe (Lehrbeispiel, Grundwasser im Abstrom einer Löschübungsfläche, fiktiv) in ng/l; fehlend = < BG */
const BEISPIEL: Partial<Record<PfasId, number>> = { PFBA: 12, PFPeA: 8, PFHxA: 15, PFHpA: 4, PFOA: 9, PFNA: 2, PFBS: 10, PFHxS: 6, PFOS: 11 };
const startText = (): Record<PfasId, string> =>
  Object.fromEntries(PFAS20.map(s => [s.id, BEISPIEL[s.id] !== undefined ? formatDeZahl(BEISPIEL[s.id], 1) : ''])) as Record<PfasId, string>;

// Voreinstellung nach TrinkwV Anlage 2 Teil I (Werte unter der BG bleiben unberücksichtigt); BG/2 und BG als konservative Varianten
const ANSATZ_TEXT: Readonly<Record<BgAnsatz, string>> = { null: '< BG = 0 (TrinkwV)', halb: '< BG = BG/2 (konservativ)', voll: '< BG = BG (ungünstigste Annahme)' };

function SummenKachel({ titel, s, ab }: { titel: string; s: PfasSumme; ab: string }) {
  const farbe = !Number.isFinite(s.summe) ? 'bg-off-white border-home-grau/30' : s.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900';
  return (
    <div className={`p-3 rounded-xl border ${farbe}`}>
      <div className="text-xs flex items-center gap-1"><ShieldCheck size={14} aria-hidden="true" /> {titel} (Grenzwert {formatDeZahl(s.grenzwert, 0)} ng/l ab {ab})</div>
      <div className="text-lg font-bold">{formatDeZahl(s.summe, 1)} ng/l – {formatDeZahl(s.eta * 100, 0)} %</div>
      <div className="text-xs">Spanne {formatDeZahl(s.unten, 1)} bis {formatDeZahl(s.oben, 1)} ng/l · {s.ok ? 'eingehalten' : 'überschritten'}{s.uneindeutig ? inhalt.werte.nichtEindeutig : ''}</div>
    </div>
  );
}

export default function PfasBaustoffe() {
  const [tab, setTab] = useState<Reiter>('einfuehrung');

  const [text, setText] = useState<Record<PfasId, string>>(startText);
  const [bg, setBg] = useState(1);
  const [ansatz, setAnsatz] = useState<BgAnsatz>('null');

  const werte = useMemo(() => Object.fromEntries(PFAS20.map(s => {
    const t = text[s.id].trim();
    return [s.id, t === '' || t.startsWith('<') ? null : Number(t.replace(',', '.'))];
  })) as Record<PfasId, number | null>, [text]);

  const erg = useMemo(() => pfasSummenbewertung({ werte, bg, ansatz }), [werte, bg, ansatz]);
  const gueltig = Number.isFinite(erg.pfas20.summe);
  const tex = (v: number, d = 1) => formatDeTeX(v, d);
  const ew = ersatzwert(bg, ansatz);
  const summandenTeX = (ids: readonly PfasId[]) => {
    const gem = ids.filter(id => werte[id] !== null).map(id => tex(werte[id] as number));
    const n = ids.filter(id => werte[id] === null).length;
    return [...gem, ...(n > 0 ? [`${n} \\cdot ${tex(ew, 2)}`] : [])].join(' + ') || '0';
  };

  const liveSchritte = gueltig ? [
    {
      titel: inhalt.werte.werteUnterDerBestimmungsgrenze,
      erklaerung: `${formatDeGanzzahl(erg.pfas20.nKleinerBg)} von 20 Stoffen liegen unter der Bestimmungsgrenze BG = ${formatDeZahl(bg, 1)} ng/l. Gewählter Ansatz: ${ANSATZ_TEXT[ansatz]}.`,
      formel: `c_{<BG} = ${tex(ew, 2)}\\,\\text{ng/l}`,
    },
    {
      titel: inhalt.werte.summePfas20,
      erklaerung: inhalt.werte.alle20PerfluoralkylcarbonUnd,
      formel: `\\Sigma_{20} = ${summandenTeX(PFAS20.map(s => s.id))} = ${tex(erg.pfas20.summe)}\\,\\text{ng/l}`,
    },
    {
      titel: inhalt.werte.summePfas4,
      erklaerung: inhalt.werte.pfoaPfnaPfhxsUnd,
      formel: `\\Sigma_{4} = ${summandenTeX(PFAS4)} = ${tex(erg.pfas4.summe)}\\,\\text{ng/l}`,
    },
    {
      titel: inhalt.werte.vergleichMitDenGrenzwerten,
      erklaerung: erg.pfas20.ok && erg.pfas4.ok ? inhalt.werte.beideSummenLiegenUnter : inhalt.werte.mindestensEineSummeÜberschreitet,
      formel: `\\eta_{20} = \\frac{${tex(erg.pfas20.summe)}}{${PFAS_GRENZWERTE.pfas20}} = ${tex(erg.pfas20.eta, 2)} ${erg.pfas20.ok ? '\\le' : '>'} 1, \\quad \\eta_{4} = \\frac{${tex(erg.pfas4.summe)}}{${PFAS_GRENZWERTE.pfas4}} = ${tex(erg.pfas4.eta, 2)} ${erg.pfas4.ok ? '\\le' : '>'} 1`,
    },
    {
      titel: inhalt.werte.spanneDurchDieBestimmungsgrenze,
      erklaerung: erg.pfas20.uneindeutig || erg.pfas4.uneindeutig ? inhalt.werte.derGrenzwertLiegtInnerhalb : inhalt.werte.derGrenzwertLiegtAußerhalb,
      formel: `\\Sigma_{20} \\in [${tex(erg.pfas20.unten)};\\ ${tex(erg.pfas20.oben)}], \\quad \\Sigma_{4} \\in [${tex(erg.pfas4.unten)};\\ ${tex(erg.pfas4.oben)}]\\,\\text{ng/l}`,
    },
  ] : inhalt.daten.PfasBaustoffe;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Droplets className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.pfasInBaustoffen} /></h2>
        <p className={box}><MdText text={inhalt.texte.perUndPolyfluorierteAlkylsubstanzen} /></p>
        <div className="p-4 rounded-xl border border-sky-200 bg-sky-50 text-sm text-sky-950 leading-relaxed" role="note"><MdText text={inhalt.texte.projekthinweisPfasInBaustoffen} /></div>

        <ModuleTabs label={inhalt.werte.bereicheDesModulsPfas} tabs={REITER} aktiv={tab} onWechsel={setTab}>
          {tab === 'einfuehrung' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.definitionUndStoffgruppen} /></h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.definitionOecd2021Pfas} /></li>
                  <li><MdText text={inhalt.texte.perfluoralkylsäurenPfaaCarbonsäurenPfca} /></li>
                  <li><MdText text={inhalt.texte.vorläuferPräkursorenZB} /></li>
                  <li><MdText text={inhalt.texte.polymereFluorpolymereMitFluorierter} /></li>
                </ul>
              </div>
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.warumEwigkeitschemikalien} /></h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.cFBindungDie} /></li>
                  <li><MdText text={inhalt.texte.mobilitätKurzkettigePfasC4} /></li>
                  <li><MdText text={inhalt.texte.gesundheitDieEuropäischeBehörde} /></li>
                </ul>
                <Querverweis ziel="schadstoffe" titel={inhalt.werte.weitereGebäudeschadstoffe} linkText={inhalt.werte.zumModulSchadUnd} className="mt-4">{inhalt.werte.asbestPakPcbUnd}</Querverweis>
              </div>
            </div>
          )}

          {tab === 'vorkommen' && (
            <div className="flex flex-col gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-1"><MdText text={inhalt.texte.woPfasImBauwesen} /></h3>
                <p className="text-xs text-text-main/70 mb-3"><MdText text={inhalt.texte.übersichtNachAnwendungenOb} /></p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse min-w-[640px]">
                    <thead><tr className="bg-off-white text-left"><th className={zelle}>Anwendung</th><th className={zelle}>PFAS-Typ</th><th className={zelle}>Funktion</th><th className={zelle}>Freisetzung</th></tr></thead>
                    <tbody>
                      <tr><td className={`${zelle} font-semibold`}><MdText text={inhalt.texte.beschichtungenCoilCoatingVon} /></td><td className={zelle}><MdText text={inhalt.texte.fluorpolymerePvdfFluorierteAdditive} /></td><td className={zelle}><MdText text={inhalt.texte.witterungsUndUvBeständigkeit} /></td><td className={zelle}><MdText text={inhalt.texte.geringImGebrauchAbrieb} /></td></tr>
                      <tr><td className={`${zelle} font-semibold`}><MdText text={inhalt.texte.imprägnierungenUndAntiGraffiti} /></td><td className={zelle}><MdText text={inhalt.texte.seitenkettenFluoriertePolymereFluortensi} /></td><td className={zelle}><MdText text={inhalt.texte.ölWasserUndSchmutzabweisend} /></td><td className={zelle}><MdText text={inhalt.texte.auswaschungAbbauZuPfaa} /></td></tr>
                      <tr><td className={`${zelle} font-semibold`}><MdText text={inhalt.texte.farbenLackeKlebstoffe} /></td><td className={zelle}><MdText text={inhalt.texte.fluortensideNetzUndVerlaufsmittel} /></td><td className={zelle}><MdText text={inhalt.texte.benetzungOberflächengüte} /></td><td className={zelle}><MdText text={inhalt.texte.geringeGehalteAuswaschung} /></td></tr>
                      <tr><td className={`${zelle} font-semibold`}><MdText text={inhalt.texte.dichtstoffeUndDichtungen} /></td><td className={zelle}><MdText text={inhalt.texte.ptfeBänderFluorelastomereFkm} /></td><td className={zelle}><MdText text={inhalt.texte.chemischeUndThermischeBeständigkeit} /></td><td className={zelle}><MdText text={inhalt.texte.geringImGebrauchEntsorgung} /></td></tr>
                      <tr><td className={`${zelle} font-semibold`}><MdText text={inhalt.texte.membranenUndFolien} /></td><td className={zelle}><MdText text={inhalt.texte.ptfeBeschichteteGlasgewebeEtfe} /></td><td className={zelle}><MdText text={inhalt.texte.dauerhaftigkeitSelbstreinigungLichtdurch} /></td><td className={zelle}><MdText text={inhalt.texte.geringImGebrauchBrand} /></td></tr>
                      <tr><td className={`${zelle} font-semibold`}><MdText text={inhalt.texte.kabelUndTechnischeGebäudeausrüstung} /></td><td className={zelle}><MdText text={inhalt.texte.fluorpolymereFepPtfe} /></td><td className={zelle}><MdText text={inhalt.texte.isolierungBrandverhalten} /></td><td className={zelle}><MdText text={inhalt.texte.entsorgungBrand} /></td></tr>
                      <tr><td className={`${zelle} font-semibold`}><MdText text={inhalt.texte.brandschutzWasserfilmbildendeLöschschäum} /></td><td className={zelle}><MdText text={inhalt.texte.fluortensideFrüherPfosSpäter} /></td><td className={zelle}><MdText text={inhalt.texte.schnellesLöschenVonFlüssigkeitsbränden} /></td><td className={zelle}><MdText text={inhalt.texte.direktInBodenUnd} /></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Löschschaum-Altlasten</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><MdText text={inhalt.texte.typischeStandorteFeuerwehrübungsflächenF} /></li>
                    <li><MdText text={inhalt.texte.bauteileBetonUndEstrich} /></li>
                    <li><MdText text={inhalt.texte.bodenUndGrundwasserKurzkettige} /></li>
                  </ul>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.industrielleBausubstanz} /></h3>
                  <p className="text-sm text-text-main/85"><MdText text={inhalt.texte.inGalvanikbetriebenPfosAls} /></p>
                  <Querverweis ziel="membranen_etfe" titel={inhalt.werte.fluorpolymereImMembranbau} linkText={inhalt.werte.zumModulMembranenEtfe} className="mt-4">{inhalt.werte.aufbauUndEigenschaftenVon}</Querverweis>
                </div>
              </div>
            </div>
          )}

          {tab === 'regulierung' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.stoffrechtEuUndInternational} /></h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.stockholmerÜbereinkommenPopVerordnung} /></li>
                  <li><MdText text={inhalt.texte.reachBeschränkungenAnhangXvii} /></li>
                  <li><MdText text={inhalt.texte.universellerPfasBeschränkungsvorschlagDe} /></li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-1">Trinkwasser</h3>
                  <p className="text-xs text-text-main/70 mb-3"><MdText text={inhalt.texte.trinkwasserverordnungTrinkwvVom20} /></p>
                  <table className="w-full text-xs border-collapse">
                    <thead><tr className="bg-off-white text-left"><th className={zelle}>Parameter</th><th className={zelle}>Grenzwert</th><th className={zelle}>gilt ab</th></tr></thead>
                    <tbody>
                      <tr><td className={zelle}><MdText text={inhalt.texte.summePfas2020} /></td><td className={zelle}><MdText text={inhalt.texte.t01GL} /></td><td className={zelle}>12.01.2026</td></tr>
                      <tr><td className={zelle}><MdText text={inhalt.texte.summePfas4Pfoa} /></td><td className={zelle}><MdText text={inhalt.texte.t002GL} /></td><td className={zelle}>12.01.2028</td></tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-text-main/70 mt-3"><MdText text={inhalt.texte.dieEuTrinkwasserrichtlinieKennt} /></p>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.bodenGrundwasserAbfall} /></h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><MdText text={inhalt.texte.leitfadenZurPfasBewertung} /></li>
                    <li><MdText text={inhalt.texte.popAbfälleAbfälleDie} /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'rueckbau' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.konsequenzenFürRückbauUnd} /></h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.erkundenNutzungsgeschichteAuswertenLösch} /></li>
                  <li><MdText text={inhalt.texte.beprobenBauschuttEstrichBeton} /></li>
                  <li><MdText text={inhalt.texte.trennenBelasteteBauteileSelektiv} /></li>
                  <li><MdText text={inhalt.texte.entsorgenBelastetesMaterialDarf} /></li>
                  <li><MdText text={inhalt.texte.wasserSchützenBaugrubenUnd} /></li>
                </ol>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Fluorpolymer-Bauteile</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><MdText text={inhalt.texte.pvdfBeschichteteBlechePtfe} /></li>
                    <li><MdText text={inhalt.texte.beiUnvollständigerVerbrennungKönnen} /></li>
                    <li><MdText text={inhalt.texte.beschichteteMetallblecheWerdenIm} /></li>
                  </ul>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Arbeitsschutz</h3>
                  <p className="text-sm text-text-main/85"><MdText text={inhalt.texte.beimAbbruchBelasteterBauteile} /></p>
                  <Querverweis ziel="rueckbau" titel={inhalt.werte.selektiverRückbau} linkText={inhalt.werte.zumModulRückbauMaterial} className="mt-4">{inhalt.werte.rückbaukonzeptSchadstofferkundungUndSele}</Querverweis>
                </div>
              </div>
            </div>
          )}

          {tab === 'analytik' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.einzelstoffanalytikTargetAnalytik} /></h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><MdText text={inhalt.texte.verfahrenAnreicherungÜberFestphasenextra} /></li>
                  <li><MdText text={inhalt.texte.normenWasserNachDin} /></li>
                  <li><MdText text={inhalt.texte.empfindlichkeitBestimmungsgrenzenJeEinze} /></li>
                  <li><MdText text={inhalt.texte.grenzeGemessenWirdNur} /></li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3"><MdText text={inhalt.texte.summenparameterUndVorläufer} /></h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><MdText text={inhalt.texte.aofEofAdsorbierbaresBzw} /></li>
                    <li><MdText text={inhalt.texte.topAssayOxidationDer} /></li>
                  </ul>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Probenahme</h3>
                  <p className="text-sm text-text-main/85"><MdText text={inhalt.texte.pfasSindInVielen} /></p>
                  <Querverweis ziel="analytik" titel={inhalt.werte.analytischeGrundlagen} linkText={inhalt.werte.zumModulAnalytik} className="mt-4">{inhalt.werte.chromatographieMassenspektrometrieUndPro}</Querverweis>
                </div>
              </div>
            </div>
          )}

          {tab === 'rechner' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className="flex flex-col gap-4">
                <CalculatorDisclaimerBanner className="my-1" customText={inhalt.werte.lehrrechnerSummenbildungNachTrinkwv} />
                <div className={box}>
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">Bestimmungsgrenze</h3>
                  <Slider label={inhalt.werte.bestimmungsgrenzeBgJeEinzelstoff} min={0.1} max={20} step={0.1} value={bg} unit="ng/l" onChange={e => setBg(Number(e.target.value))} />
                  <AuswahlGruppe className="flex flex-wrap gap-2 mt-3" aria-label={inhalt.werte.ansatzDerWerteUnter}>
                    {(['null', 'halb', 'voll'] as const).map(a => (
                      <button key={a} type="button" {...alsOption(ansatz === a)} onClick={() => setAnsatz(a)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${ansatz === a ? 'bg-shiraz text-white border-shiraz' : 'bg-white border-home-grau/30'}`}>
                        {ANSATZ_TEXT[a]}
                      </button>
                    ))}
                  </AuswahlGruppe>
                  <p className="text-[11px] text-text-main/70 mt-2 leading-relaxed"><MdText text={inhalt.werte.ansatzHinweisTrinkwv} /></p>
                </div>
                <div className={box}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.messwerteInNgL} /></h3>
                    <button type="button" onClick={() => setText(startText())} className="px-2 py-1 rounded-md text-xs border border-home-grau/30 bg-white cursor-pointer"><MdText text={inhalt.texte.beispielLaden} /></button>
                  </div>
                  <p className="text-xs text-text-main/70 mb-3"><MdText text={inhalt.texte.leeresFeldOderBg} /></p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PFAS20.map(s => (
                      <label key={s.id} className="flex flex-col text-xs">
                        <span className={PFAS4.includes(s.id) ? 'font-bold text-shiraz' : 'text-text-main/80'} title={`${s.name} (C${s.c})`}>{s.id}</span>
                        <input type="text" inputMode="decimal" value={text[s.id]} placeholder="< BG" aria-label={`${s.name} in ng/l`}
                          onChange={e => setText(t => ({ ...t, [s.id]: e.target.value }))}
                          className="mt-0.5 p-1.5 border border-home-grau rounded-md bg-white text-sm" />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Ergebnis</h3>
                  {gueltig ? (
                    <div className="flex flex-col gap-3">
                      <SummenKachel titel={inhalt.werte.summePfas202} s={erg.pfas20} ab="12.01.2026" />
                      <SummenKachel titel={inhalt.werte.summePfas42} s={erg.pfas4} ab="12.01.2028" />
                      <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white text-sm"><MdText text={inhalt.texte.anteilKurzkettigerPfasC4} /><strong>{formatDeZahl(erg.anteilKurzkettig * 100, 0)} %</strong><MdText text={inhalt.texte.stoffeBg} />{formatDeZahl(erg.pfas20.nKleinerBg, 0)} von 20
                      </div>
                    </div>
                  ) : <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.keineBerechnungMöglich} /></p>}
                  <EingabeHinweise hinweise={erg.hinweise} />
                </div>
                <FormulaDerivationBox
                  live
                  title={`Ihr Rechenweg: Summenbewertung PFAS-20 und PFAS-4 (BG = ${formatDeZahl(bg, 1)} ng/l)`}
                  zielGleichung="\Sigma_{20} = \sum_{i=1}^{20} c_i \le 100\,\text{ng/l}, \quad \Sigma_{4} = c_{PFOA} + c_{PFNA} + c_{PFHxS} + c_{PFOS} \le 20\,\text{ng/l}"
                  schritte={liveSchritte}
                  ergebnisHinweis={inhalt.werte.eineProbeKannPfas}
                  normQuelle={inhalt.werte.trinkwv2023Anlage2}
                />
              </div>
            </div>
          )}
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIELE */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1MischungVon}
        zielGleichung="c_{Misch} = \frac{Q_1 c_1 + Q_2 c_2}{Q_1 + Q_2}"
        schritte={inhalt.daten["PfasBaustoffe.schritte"]}
        ergebnisHinweis={inhalt.werte.mindestens36DesRohwassers}
        normQuelle={inhalt.werte.mischungsrechnungMassenbilanzGrenzwertNa}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2EluatAus}
        zielGleichung="E = c_{Eluat} \cdot \frac{V}{m}"
        schritte={inhalt.daten["PfasBaustoffe.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dieFreigesetzteMasseWirkt}
        normQuelle={inhalt.werte.elutionNachDin19529}
      />

      <ModulTest moduleId="pfas_baustoffe" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026NeuErstellt}
        wikipedia={[
          { title: inhalt.werte.perUndPolyfluorierteAlkylverbindungen, url: 'https://de.wikipedia.org/wiki/Per-_und_polyfluorierte_Alkylverbindungen' },
        ]}
        weblinks={[
          inhalt.daten["PfasBaustoffe.weblinks.0"],
          { title: inhalt.werte.echaPerAndPolyfluoroalkyl, url: 'https://echa.europa.eu/hot-topics/perfluoroalkyl-chemicals-pfas' },
          { title: inhalt.werte.bmuvLeitfadenZurPfas, url: 'https://www.bundesumweltministerium.de/fileadmin/Daten_BMU/Download_PDF/Bodenschutz/pfas_leitfaden_bf.pdf' },
        ]}
        literatur={inhalt.daten["PfasBaustoffe.literatur"]}
        regelwerke={inhalt.daten["PfasBaustoffe.regelwerke"]}
        formeln={inhalt.daten["PfasBaustoffe.formeln"]}
      />
    </div>
  );
}
