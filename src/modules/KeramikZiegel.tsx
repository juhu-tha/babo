import React, { useMemo, useState } from 'react';
import { BookOpen, Factory, LayoutGrid, FileText, Calculator, Recycle, Flame, Droplets, Info } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { keramikKennwerte, EB_GRENZEN, type Formgebung } from '@/src/calc/keramik';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/keramikziegel/KeramikZiegel.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

type Reiter = 'einfuehrung' | 'herstellung' | 'ziegel' | 'normen' | 'rechner' | 'nachhaltigkeit';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Einführung', icon: BookOpen },
  { id: 'herstellung', label: inhalt.werte.rohstoffeHerstellung, icon: Factory },
  { id: 'ziegel', label: inhalt.werte.ziegelartenEigenschaften, icon: LayoutGrid },
  { id: 'normen', label: inhalt.werte.normenFliesengruppen, icon: FileText },
  { id: 'rechner', label: inhalt.werte.rechnerWasseraufnahme, icon: Calculator },
  { id: 'nachhaltigkeit', label: 'Nachhaltigkeit', icon: Recycle },
];

const karte = 'bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30';
const kasten = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const th = 'p-2.5 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2.5 text-xs text-text-main/85 border-b border-home-grau/15 align-top';

/** Beispielproben für den Rechner (Lehrwerte, keine Produktdaten) */
const PROBEN: { id: string; name: string; mt: number; mn: number; ma: number; rhoRein: number; formgebung: Formgebung }[] = [
  { id: 'hand', name: inhalt.werte.handrechnungFlieseTrockengepresst, mt: 200, mn: 210, ma: 118, rhoRein: 2.65, formgebung: 'B' },
  { id: 'feinsteinzeug', name: inhalt.werte.feinsteinzeugTrockengepresst, mt: 500, mn: 500.4, ma: 290, rhoRein: 2.5, formgebung: 'B' },
  { id: 'steinzeug', name: inhalt.werte.steinzeugflieseTrockengepresst, mt: 400, mn: 408, ma: 230, rhoRein: 2.55, formgebung: 'B' },
  { id: 'steingut', name: inhalt.werte.steingutWandflieseGlasiert, mt: 300, mn: 345, ma: 170, rhoRein: 2.6, formgebung: 'B' },
  { id: 'spaltplatte', name: inhalt.werte.spaltplatteStranggepresst, mt: 800, mn: 820, ma: 455, rhoRein: 2.6, formgebung: 'A' },
];

const GRUPPEN_FARBE: Record<string, string> = {
  Ia: 'bg-emerald-800', Ib: 'bg-emerald-700', IIa: 'bg-amber-600', IIb: 'bg-orange-500', III: 'bg-rose-600',
};

export default function KeramikZiegel() {
  const [reiter, setReiter] = useState<Reiter>('einfuehrung');
  const [mt, setMt] = useState(200);
  const [mn, setMn] = useState(210);
  const [ma, setMa] = useState(118);
  const [rhoRein, setRhoRein] = useState(2.65);
  const [mitMa, setMitMa] = useState(true);
  const [mitRein, setMitRein] = useState(true);
  const [formgebung, setFormgebung] = useState<Formgebung>('B');

  const erg = useMemo(
    () => keramikKennwerte({ mt, mn, ma: mitMa ? ma : undefined, rhoRein: mitMa && mitRein ? rhoRein : undefined, formgebung }),
    [mt, mn, ma, rhoRein, mitMa, mitRein, formgebung]
  );

  const ladeProbe = (id: string) => {
    const p = PROBEN.find(x => x.id === id);
    if (!p) return;
    setMt(p.mt); setMn(p.mn); setMa(p.ma); setRhoRein(p.rhoRein); setFormgebung(p.formgebung); setMitMa(true); setMitRein(true);
  };

  const zahl = (v: string) => { const x = parseFloat(v); return Number.isFinite(x) ? x : NaN; };
  const tex = (x: number, n: number) => formatDeTeX(x, n);
  const teil = erg.gruppe ? erg.gruppe.slice(1) : '';
  const skalaMax = 20;
  const markerPos = Number.isFinite(erg.eb) ? Math.min(erg.eb, skalaMax) / skalaMax * 100 : 0;

  const eingabe = (label: string, wert: number, setze: (x: number) => void, einheit: string, schritt: string, aus?: boolean) => (
    <label className={`flex flex-col gap-1 ${aus ? 'opacity-40' : ''}`}>
      <span className="text-xs font-bold text-text-main">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          step={schritt}
          value={Number.isFinite(wert) ? wert : ''}
          disabled={aus}
          onChange={e => setze(zahl(e.target.value))}
          className="w-full p-2 border border-home-grau/50 rounded-lg bg-white text-sm font-mono focus:outline-none focus:border-shiraz"
        />
        <span className="text-xs text-text-main/60 w-12 shrink-0">{einheit}</span>
      </span>
    </label>
  );

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className={`${karte} flex flex-col gap-5`}>
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Flame className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.keramikUndZiegel} /></h2>
          <p className="text-xs text-text-main/50 font-mono mt-1"><MdText text={inhalt.texte.vomTonmineralZumGebrannten} /></p>
        </div>

        <ModuleTabs label={inhalt.werte.bereicheDesModulsKeramik} tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
          <div className="pt-5 animate-in fade-in duration-300">
            {/* ───────────── 1. EINFÜHRUNG ───────────── */}
            {reiter === 'einfuehrung' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <p><MdText text={inhalt.texte.keramischeWerkstoffeEntstehenAus} /></p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Grobkeramik</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.gefügeMitGröberemKorn} /></p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Feinkeramik</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.feinkörnigeAufbereiteteMassenWand} /></p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5"><MdText text={inhalt.texte.leitkennwertWasseraufnahme} /></h3>
                    <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieWasseraufnahmeBeschreibtWie} /></p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                  <h3 className="text-sm font-bold text-text-main mb-2"><MdText text={inhalt.texte.lehrpfadDiesesModuls} /></h3>
                  <ol className="list-decimal pl-5 space-y-1 text-xs text-text-main/80">
                    <li><MdText text={inhalt.texte.rohstoffeUndHerstellungTonminerale} /></li>
                    <li><MdText text={inhalt.texte.ziegelartenUndEigenschaftenHintermauer} /></li>
                    <li><MdText text={inhalt.texte.normenUndFliesengruppenProdukt} /></li>
                    <li><MdText text={inhalt.texte.rechnerWasseraufnahmeFliesengruppeRohdic} /></li>
                    <li><MdText text={inhalt.texte.nachhaltigkeitBrennenergieCoQuellen} /></li>
                  </ol>
                </div>
                <Querverweis ziel="mauerwerk" titel={inhalt.werte.vomSteinZurWand} linkText={inhalt.werte.zumModulMauerwerk}>
                  <p><MdText text={inhalt.texte.diesesModulBehandeltDen} /></p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 2. ROHSTOFFE & HERSTELLUNG ───────────── */}
            {reiter === 'herstellung' && (
              <div className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.rohstoffeTonmineraleUndBegleitstoffe} /></h3>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.tonIstEinFeinkörniges} /></p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[560px]">
                      <thead><tr><th className={th}>Tonmineral</th><th className={th}>Aufbau</th><th className={th}>Verhalten</th><th className={th}>Bedeutung</th></tr></thead>
                      <tbody>
                        <tr><td className={td}><strong>Kaolinit</strong> <FormulaText text="$\mathrm{Al_2Si_2O_5(OH)_4}$" /></td><td className={td}><MdText text={inhalt.texte.zweischichtmineral11} /></td><td className={td}><MdText text={inhalt.texte.kaumQuellfähigMäßigPlastisch} /></td><td className={td}><MdText text={inhalt.texte.hauptbestandteilVonKaolinWeiß} /></td></tr>
                        <tr><td className={td}><strong>Illit</strong></td><td className={td}><MdText text={inhalt.texte.dreischichtmineral21Kalium} /></td><td className={td}><MdText text={inhalt.texte.wenigQuellfähigGutPlastisch} /></td><td className={td}><MdText text={inhalt.texte.häufigInZiegeltonenKalium} /></td></tr>
                        <tr><td className={td}><MdText text={inhalt.texte.montmorillonitSmektit} /></td><td className={td}><MdText text={inhalt.texte.dreischichtmineral21Mit} /></td><td className={td}><MdText text={inhalt.texte.starkQuellfähigSehrPlastisch} /></td><td className={td}><MdText text={inhalt.texte.erhöhtBindekraftAberRissgefahr} /></td></tr>
                      </tbody>
                    </table>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-text-main/80">
                    <li><MdText text={inhalt.texte.quarzUndSchamotteGemahlener} /></li>
                    <li><MdText text={inhalt.texte.feldspatUndAlkalienSind} /></li>
                    <li><MdText text={inhalt.texte.eisenoxideFärbenBeiOxidierendem} /></li>
                    <li><MdText text={inhalt.texte.calcitKalkBindetDas} /></li>
                    <li><MdText text={inhalt.texte.porosierungsmittelWieSägemehlPapierfaser} /></li>
                  </ul>
                  <Querverweis ziel="lehm" titel={inhalt.werte.ungebranntTonmineraleImLehmbau} linkText={inhalt.werte.zumModulLehm}>
                    <p><MdText text={inhalt.texte.dieselbenTonmineraleBindenUngebrannt} /></p>
                  </Querverweis>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.aufbereitungUndFormgebung} /></h3>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.derTonWirdIn} /></p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[560px]">
                      <thead><tr><th className={th}>Verfahren</th><th className={th}>Masse</th><th className={th}><MdText text={inhalt.texte.typischeProdukte} /></th></tr></thead>
                      <tbody>
                        <tr><td className={td}><MdText text={inhalt.texte.strangpressenVakuumstrangpresseMundstück} /></td><td className={td}><MdText text={inhalt.texte.plastischEntlüftet} /></td><td className={td}><MdText text={inhalt.texte.hochlochziegelVollziegelStrangdachziegel} /></td></tr>
                        <tr><td className={td}><MdText text={inhalt.texte.pressenRevolverOderStempelpresse} /></td><td className={td}><MdText text={inhalt.texte.plastischerStrangabschnitt} /></td><td className={td}><MdText text={inhalt.texte.pressdachziegelFalzziegelFormziegel} /></td></tr>
                        <tr><td className={td}><strong>Trockenpressen</strong></td><td className={td}><MdText text={inhalt.texte.sprühgranulatMitGeringerRestfeuchte} /></td><td className={td}><MdText text={inhalt.texte.wandUndBodenfliesenFeinsteinzeug} /></td></tr>
                        <tr><td className={td}><MdText text={inhalt.texte.handformUndFormbackverfahren} /></td><td className={td}><MdText text={inhalt.texte.weichPlastischInFormen} /></td><td className={td}><MdText text={inhalt.texte.handformziegelWasserstrichziegelFürSicht} /></td></tr>
                        <tr><td className={td}><strong>Gießen</strong></td><td className={td}><MdText text={inhalt.texte.flüssigerSchlickerInGipsformen} /></td><td className={td}><MdText text={inhalt.texte.sanitärkeramikFormteile} /></td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main flex items-center gap-2"><Droplets size={16} className="text-shiraz" /><MdText text={inhalt.texte.trocknungUndTrockenschwindung} /></h3>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.beimTrocknenVerdunstetZunächst} /></p>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                    <BlockMath math="s_T = \frac{l_0 - l_t}{l_0}, \qquad l_0 = \frac{l_{Brand}}{(1 - s_T)\,(1 - s_B)}" />
                    <p className="text-[11px] text-text-main/70 text-center">
                      <FormulaText text={inhalt.werte.l0FormmaßL} />
                    </p>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main flex items-center gap-2"><Flame size={16} className="text-shiraz" /><MdText text={inhalt.texte.brandTemperaturbereicheUndSinterung} /></h3>
                  <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.gebranntWirdÜberwiegendIm} /></p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[560px]">
                      <thead><tr><th className={th}><MdText text={inhalt.texte.temperaturEtwa} /></th><th className={th}>Vorgang</th><th className={th}><MdText text={inhalt.texte.folgeFürDenScherben} /></th></tr></thead>
                      <tbody>
                        <tr><td className={td}>bis 200 °C</td><td className={td}><MdText text={inhalt.texte.austreibenDesRestwassersSchmauchen} /></td><td className={td}><MdText text={inhalt.texte.langsamAufheizenSonstDampfdruck} /></td></tr>
                        <tr><td className={td}><MdText text={inhalt.texte.t300Bis600C} /></td><td className={td}><MdText text={inhalt.texte.ausbrennenOrganischerBestandteileUnd} /></td><td className={td}><MdText text={inhalt.texte.porenbildungAusreichendSauerstoffNötig} /></td></tr>
                        <tr><td className={td}><MdText text={inhalt.texte.t450Bis650C} /></td><td className={td}><MdText text={inhalt.texte.abgabeDesKristallwassersDer} /></td><td className={td}><MdText text={inhalt.texte.irreversibelDerTonIst} /></td></tr>
                        <tr><td className={td}>573 °C</td><td className={td}><MdText text={inhalt.texte.quarzumwandlungTiefInHochquarz} /></td><td className={td}><MdText text={inhalt.texte.sprunghafteVolumenänderungBeimAbkühlen} /></td></tr>
                        <tr><td className={td}><MdText text={inhalt.texte.t700Bis900C} /></td><td className={td}><MdText text={inhalt.texte.zersetzungDerCarbonate} /><FormulaText text="$\mathrm{CaCO_3 \rightarrow CaO + CO_2}$" /></td><td className={td}><MdText text={inhalt.texte.rohstoffbedingteCoFreisetzungCao} /></td></tr>
                        <tr><td className={td}><MdText text={inhalt.texte.ab900Bis1000} /></td><td className={td}><MdText text={inhalt.texte.festkörperreaktionenNeubildungVonSilikat} /></td><td className={td}><MdText text={inhalt.texte.festigkeitSteigtScherbenNoch} /></td></tr>
                        <tr><td className={td}><MdText text={inhalt.texte.ab1000Bis1100} /></td><td className={td}><MdText text={inhalt.texte.sinterungFlussmittelBildenEine} /></td><td className={td}><MdText text={inhalt.texte.brennschwindungWasseraufnahmeSinktRohdic} /></td></tr>
                      </tbody>
                    </table>
                  </div>
                  <h4 className="text-sm font-bold text-text-main mt-2"><MdText text={inhalt.texte.scherbenartenRichtwerteDerFachliteratur} /></h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[620px]">
                      <thead><tr><th className={th}>Scherben</th><th className={th}>Erzeugnis</th><th className={th}><MdText text={inhalt.texte.brenntemperaturEtwa} /></th><th className={th}>Wasseraufnahme</th><th className={th}><MdText text={inhalt.texte.merkmaleUndVerwendung} /></th></tr></thead>
                      <tbody>
                        <tr><td className={td} rowSpan={2}><MdText text={inhalt.texte.porösIrdengut} /></td><td className={td}><MdText text={inhalt.texte.mauerDachziegelTerrakotta} /></td><td className={td}><MdText text={inhalt.texte.t900Bis1100C} /></td><td className={td}><MdText text={inhalt.texte.deutlichÜber3Oft} /></td><td className={td}><MdText text={inhalt.texte.farbigSaugfähigFrostwiderstandHängt} /></td></tr>
                        <tr><td className={td}>Steingut</td><td className={td}><MdText text={inhalt.texte.etwa1000Bis1200} /></td><td className={td}><MdText text={inhalt.texte.über10GruppeBiii} /></td><td className={td}><MdText text={inhalt.texte.weißerPoröserScherbenGlasiert} /></td></tr>
                        <tr><td className={td} rowSpan={4}><MdText text={inhalt.texte.dichtSinterzeug} /></td><td className={td}>Klinker</td><td className={td}><MdText text={inhalt.texte.t1100Bis1300C} /></td><td className={td}><MdText text={inhalt.texte.geringBisZurSinterung} /></td><td className={td}><MdText text={inhalt.texte.hoheRohdichteUndFestigkeit} /></td></tr>
                        <tr><td className={td}>Steinzeug</td><td className={td}><MdText text={inhalt.texte.etwa1150Bis1300} /></td><td className={td}><MdText text={inhalt.texte.bisEtwa3} /></td><td className={td}><MdText text={inhalt.texte.gefärbterDichterScherbenBodenfliesen} /></td></tr>
                        <tr><td className={td}>Feinsteinzeug</td><td className={td}><MdText text={inhalt.texte.etwa1200Bis1250} /></td><td className={td}><MdText text={inhalt.texte.t05GruppeBia} /></td><td className={td}><MdText text={inhalt.texte.feinkörnigHochVerdichtetTrockengepresst} /></td></tr>
                        <tr><td className={td}>Porzellan</td><td className={td}><MdText text={inhalt.texte.etwa1300Bis1450} /></td><td className={td}>nahezu 0 %</td><td className={td}><MdText text={inhalt.texte.kaolinQuarzFeldspatWeiß} /></td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {/* ───────────── 3. ZIEGELARTEN & EIGENSCHAFTEN ───────────── */}
            {reiter === 'ziegel' && (
              <div className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Ziegelarten</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[620px]">
                      <thead><tr><th className={th}>Ziegelart</th><th className={th}>Kennzeichen</th><th className={th}>Einsatz</th></tr></thead>
                      <tbody>
                        <tr><td className={td}><strong>Hintermauerziegel</strong></td><td className={td}><MdText text={inhalt.texte.meistPorosiertAlsVoll} /></td><td className={td}><MdText text={inhalt.texte.verputztesOderBekleidetesMauerwerk} /></td></tr>
                        <tr><td className={td}><strong>Vormauerziegel</strong></td><td className={td}><MdText text={inhalt.texte.frostwiderstandsfähigMaßhaltigGleichmäßi} /></td><td className={td}><MdText text={inhalt.texte.unverputztesSichtmauerwerkVerblendschale} /></td></tr>
                        <tr><td className={td}><strong>Klinker</strong></td><td className={td}><MdText text={inhalt.texte.bisZurSinterungGebrannt} /></td><td className={td}><MdText text={inhalt.texte.starkBeanspruchteFassadenSockel} /></td></tr>
                        <tr><td className={td}><strong>Hochlochziegel</strong></td><td className={td}><MdText text={inhalt.texte.lochungSenkrechtZurLagerfläche} /></td><td className={td}><MdText text={inhalt.texte.tragendeAußenUndInnenwände} /></td></tr>
                        <tr><td className={td}><MdText text={inhalt.texte.gefülltePlanziegel} /></td><td className={td}><MdText text={inhalt.texte.hochlochziegelDerenKammernWerkseitig} /></td><td className={td}><MdText text={inhalt.texte.einschaligeHochWärmedämmendeAußenwände} /></td></tr>
                        <tr><td className={td}><strong>Dachziegel</strong></td><td className={td}><MdText text={inhalt.texte.strangdachziegelZBBiberschwanz} /></td><td className={td}><MdText text={inhalt.texte.dachdeckungProduktnormDinEn} /></td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.eigenschaftenUndKennwerte} /></h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[680px]">
                      <thead><tr><th className={th}>Eigenschaft</th><th className={th}>Bedeutung</th><th className={th}><MdText text={inhalt.texte.angabeUndPrüfung} /></th><th className={th}><MdText text={inhalt.texte.größenordnungLehrwert} /></th></tr></thead>
                      <tbody>
                        <tr><td className={td}><strong>Rohdichteklasse</strong></td><td className={td}><MdText text={inhalt.texte.bruttoTrockenrohdichteEinschließlichLoch} /></td><td className={td}><MdText text={inhalt.texte.prüfungNachDinEn} /></td><td className={td}><MdText text={inhalt.texte.etwa06Hoch} /></td></tr>
                        <tr><td className={td}><strong>Druckfestigkeit</strong></td><td className={td}><MdText text={inhalt.texte.normierteMittlereDruckfestigkeitDes} /></td><td className={td}><MdText text={inhalt.texte.prüfungNachDinEn2} /></td><td className={td}><MdText text={inhalt.texte.klassenZB4} /></td></tr>
                        <tr><td className={td}><strong>Wasseraufnahme</strong></td><td className={td}><MdText text={inhalt.texte.maßFürDieOffene} /></td><td className={td}><MdText text={inhalt.texte.kaltwasseraufnahmeNachDinEn} /></td><td className={td}><MdText text={inhalt.texte.klinkerGeringHintermauerziegelDeutlich} /></td></tr>
                        <tr><td className={td}><strong>Frostwiderstand</strong></td><td className={td}><MdText text={inhalt.texte.widerstandGegenFrostTau} /></td><td className={td}><MdText text={inhalt.texte.kategorienF0F1F2} /></td><td className={td}><MdText text={inhalt.texte.sichtmauerwerkInDerRegel} /></td></tr>
                        <tr><td className={td}><strong>Ausblühungen</strong></td><td className={td}><MdText text={inhalt.texte.wasserlöslicheSalzeSulfateVon} /></td><td className={td}><MdText text={inhalt.texte.gehaltAnAktivenLöslichen} /></td><td className={td}><MdText text={inhalt.texte.vorbeugenTrockeneLagerungFrisches} /></td></tr>
                        <tr><td className={td}><strong>Wärmeleitfähigkeit</strong></td><td className={td}><MdText text={inhalt.texte.sinktMitDerRohdichte} /></td><td className={td}><MdText text={inhalt.texte.bemessungswerteNachDin4108} /></td><td className={td}><MdText text={inhalt.texte.vollziegelmauerwerkEtwa05} /></td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-text-main/60 leading-relaxed flex items-start gap-1.5">
                    <Info size={13} className="shrink-0 mt-0.5" /><MdText text={inhalt.texte.dieGrößenordnungenDienenDer} /></p>
                </section>

                <Querverweis ziel="mauerwerk" titel={inhalt.werte.steinfestigkeitUndMauerwerksfestigkeit} linkText={inhalt.werte.mauerwerksfestigkeitBerechnen}>
                  <p>
                    <FormulaText text="Die Druckfestigkeit des Ziegels $f_b$ geht zusammen mit der Mörtelfestigkeit $f_m$ in die charakteristische Mauerwerksdruckfestigkeit $f_k = K \cdot f_b^{\alpha} \cdot f_m^{\beta}$ nach DIN EN 1996-1-1 ein. Den Nachweis tragender Wände finden Sie im Modul Mauerwerk." />
                  </p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 4. NORMEN & FLIESENGRUPPEN ───────────── */}
            {reiter === 'normen' && (
              <div className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.mauerziegelProduktnormUndAnwendungsnorm} /></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                      <h4 className="font-bold text-text-main text-sm mb-1"><MdText text={inhalt.texte.dinEn7711} /></h4><MdText text={inhalt.texte.harmonisierteEuropäischeProduktnormFür} /></div>
                    <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                      <h4 className="font-bold text-text-main text-sm mb-1"><MdText text={inhalt.texte.din200004012017} /></h4><MdText text={inhalt.texte.nationaleAnwendungsnormLegtFest} /></div>
                    <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                      <h4 className="font-bold text-text-main text-sm mb-1"><MdText text={inhalt.texte.din1051002012} /></h4><MdText text={inhalt.texte.din105100Regelte} /></div>
                    <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                      <h4 className="font-bold text-text-main text-sm mb-1"><MdText text={inhalt.texte.dinEn13042013} /></h4><MdText text={inhalt.texte.produktnormFürDachUnd} /></div>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.keramischeFliesenNachDin} /></h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    <FormulaText text={inhalt.werte.fliesenWerdenNachDer} />
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[560px]">
                      <thead><tr><th className={th}>Wasseraufnahme</th><th className={th}><MdText text={inhalt.texte.gruppeIEB} /></th><th className={th}><MdText text={inhalt.texte.gruppeIi3E} /></th><th className={th}><MdText text={inhalt.texte.gruppeIiiEB} /></th></tr></thead>
                      <tbody>
                        <tr><td className={td}><MdText text={inhalt.texte.aStranggepresst} /></td><td className={td}><MdText text={inhalt.texte.aiaEB0} /></td><td className={td}><MdText text={inhalt.texte.aiia3EB} /><span className="text-text-main/60"><MdText text={inhalt.texte.jeweilsTeil1Und} /></span></td><td className={td}>AIII</td></tr>
                        <tr><td className={td}><MdText text={inhalt.texte.bTrockengepresst} /></td><td className={td}><MdText text={inhalt.texte.biaEB0} /></td><td className={td}><MdText text={inhalt.texte.biia3EB} /></td><td className={td}><MdText text={inhalt.texte.biiiGlasiertZB} /></td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.jeNiedrigerDieGruppe} /></p>
                </section>
              </div>
            )}

            {/* ───────────── 5. RECHNER ───────────── */}
            {reiter === 'rechner' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.wägungenDerProbe} /></h3>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.beispielprobeLaden} /></span>
                      <select
                        aria-label={inhalt.werte.beispielprobeLaden}
                        defaultValue="hand"
                        onChange={e => ladeProbe(e.target.value)}
                        className="p-2 border border-home-grau/50 rounded-lg bg-white text-sm focus:outline-none focus:border-shiraz"
                      >
                        {PROBEN.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </label>
                    {eingabe(inhalt.werte.trockenmasseMTBei, mt, setMt, 'g', '0.1')}
                    {eingabe(inhalt.werte.nassmasseMNNach, mn, setMn, 'g', '0.1')}
                    <label className="flex items-center gap-2 text-xs font-bold text-text-main">
                      <input type="checkbox" checked={mitMa} onChange={e => setMitMa(e.target.checked)} className="accent-shiraz w-4 h-4" /><MdText text={inhalt.texte.unterwasserwägungVorhanden} /></label>
                    {eingabe(inhalt.werte.masseUnterWasserM, ma, setMa, 'g', '0.1', !mitMa)}
                    <label className={`flex items-center gap-2 text-xs font-bold text-text-main ${mitMa ? '' : 'opacity-40'}`}>
                      <input type="checkbox" checked={mitRein} disabled={!mitMa} onChange={e => setMitRein(e.target.checked)} className="accent-shiraz w-4 h-4" /><MdText text={inhalt.texte.reindichteBekanntGesamtporosität} /></label>
                    {eingabe(inhalt.werte.reindichteDesScherbensRein, rhoRein, setRhoRein, 'g/cm³', '0.01', !(mitMa && mitRein))}
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.formgebungNachDinEn} /></span>
                      <select
                        aria-label="Formgebung"
                        value={formgebung}
                        onChange={e => setFormgebung(e.target.value as Formgebung)}
                        className="p-2 border border-home-grau/50 rounded-lg bg-white text-sm focus:outline-none focus:border-shiraz"
                      >
                        <option value="B">B – trockengepresst</option>
                        <option value="A">A – stranggepresst</option>
                      </select>
                    </label>
                  </div>
                  <EingabeHinweise hinweise={erg.hinweise} />
                </div>

                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs text-text-main/60 font-bold uppercase tracking-wide">Wasseraufnahme</div>
                        <div className="text-3xl font-black text-shiraz font-mono"><FormulaText text="$E_b$" /> = {formatDeZahl(erg.eb, 2)} %</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-text-main/60 font-bold uppercase tracking-wide"><MdText text={inhalt.texte.gruppeDinEn14411} /></div>
                        <div className={`inline-block mt-1 px-3 py-1 rounded-lg text-white font-black text-xl ${GRUPPEN_FARBE[teil] ?? 'bg-slate-500'}`}>{erg.gruppe ?? '–'}</div>
                        <div className="text-xs text-text-main/70 mt-1">{erg.scherben}</div>
                      </div>
                    </div>

                    {/* Gruppenskala 0–20 % */}
                    <div aria-hidden="true">
                      <div className="relative h-6 rounded-md overflow-hidden flex">
                        {[{ von: 0, bis: 0.5, k: 'Ia' }, { von: 0.5, bis: 3, k: 'Ib' }, { von: 3, bis: 6, k: 'IIa' }, { von: 6, bis: 10, k: 'IIb' }, { von: 10, bis: skalaMax, k: 'III' }].map(g => (
                          <div key={g.k} className={`${GRUPPEN_FARBE[g.k]} h-full flex items-center justify-center text-[9px] font-bold text-white`} style={{ width: `${(g.bis - g.von) / skalaMax * 100}%` }}>
                            {g.k !== 'Ia' && g.k}
                          </div>
                        ))}
                        {erg.gueltig && <div className="absolute top-0 h-full w-1 bg-text-main shadow" style={{ left: `calc(${markerPos}% - 2px)` }} />}
                      </div>
                      <div className="relative h-4 text-[10px] text-text-main/60 font-mono mt-1">
                        <span className="absolute left-0">0 %</span>
                        {EB_GRENZEN.slice(1).map(g => (
                          <span key={g.teil} className="absolute -translate-x-1/2" style={{ left: `${g.bis / skalaMax * 100}%` }}>{formatDeZahl(g.bis, 0)}</span>
                        ))}
                        <span className="absolute right-0">≥ 20 %</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { l: 'Volumen V', w: formatDeZahl(erg.volumen, 1), e: 'cm³' },
                        { l: inhalt.werte.rohdichteRoh, w: formatDeZahl(erg.rhoRoh, 3), e: 'g/cm³' },
                        { l: inhalt.werte.offenePorosität, w: formatDeZahl(erg.pOffen, 2), e: '%' },
                        { l: 'Gesamtporosität', w: formatDeZahl(erg.pGes, 2), e: '%' },
                      ].map(k => (
                        <div key={k.l} className="p-3 rounded-lg border border-home-grau/30 bg-off-white">
                          <div className="text-[10px] text-text-main/60 font-bold">{k.l}</div>
                          <div className="font-mono font-bold text-text-main text-sm">{k.w} <span className="text-[10px] text-text-main/60">{k.e}</span></div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-text-main/60 leading-relaxed"><MdText text={inhalt.texte.dieGruppenNachDin} /></p>
                  </div>

                  <FormulaDerivationBox
                    live
                    kurzzeile={kurzzeile(ansageWert('Wasseraufnahme E_b', erg.eb, 2, '%'), `Gruppe nach DIN EN 14411 ${erg.gruppe ?? '–'}`)}
                    title={inhalt.werte.ihrRechenwegWasseraufnahmeRohdichte}
                    zielGleichung="E_b = \frac{m_n - m_t}{m_t} \cdot 100\,\%"
                    schritte={[
                      {
                        titel: 'Wasseraufnahme',
                        erklaerung: inhalt.werte.aufgenommeneWassermasseBezogenAuf,
                        formel: `E_b = \\frac{${tex(mn, 1)} - ${tex(mt, 1)}}{${tex(mt, 1)}} \\cdot 100\\,\\% = ${tex(erg.eb, 2)}\\,\\%`,
                      },
                      {
                        titel: inhalt.werte.einordnungNachDinEn,
                        erklaerung: `Formgebung ${formgebung === 'A' ? inhalt.werte.aStranggepresst : inhalt.werte.bTrockengepresst}; Grenzen 0,5 / 3 / 6 / 10 %:`,
                        formel: `E_b = ${tex(erg.eb, 2)}\\,\\% \\;\\Rightarrow\\; \\text{Gruppe ${erg.gruppe ?? '–'}}`,
                      },
                      {
                        titel: inhalt.werte.volumenAusDerUnterwasserwägung,
                        erklaerung: mitMa ? inhalt.werte.auftriebVerdrängtesWasserMit : inhalt.werte.ohneUnterwasserwägungKannDas,
                        formel: mitMa ? `V = \\frac{m_n - m_a}{\\rho_w} = \\frac{${tex(mn, 1)} - ${tex(ma, 1)}}{1{,}0} = ${tex(erg.volumen, 1)}\\,\\text{cm}^3` : 'V = \\text{–}',
                      },
                      {
                        titel: inhalt.werte.rohdichteUndOffenePorosität,
                        erklaerung: inhalt.werte.trockenmasseJeVolumenWassergefülltes,
                        formel: `\\rho_{roh} = \\frac{${tex(mt, 1)}}{${tex(erg.volumen, 1)}} = ${tex(erg.rhoRoh, 3)}\\,\\tfrac{\\text{g}}{\\text{cm}^3}, \\quad P_{offen} = \\frac{m_n - m_t}{m_n - m_a} = ${tex(erg.pOffen, 2)}\\,\\%`,
                      },
                      {
                        titel: 'Gesamtporosität',
                        erklaerung: mitMa && mitRein ? inhalt.werte.ausRohUndReindichte : inhalt.werte.benötigtUnterwasserwägungUndReindichte,
                        formel: `P_{ges} = \\left(1 - \\frac{${tex(erg.rhoRoh, 3)}}{${tex(mitRein ? rhoRein : NaN, 2)}}\\right) \\cdot 100\\,\\% = ${tex(erg.pGes, 2)}\\,\\%`,
                      },
                    ]}
                    ergebnisHinweis={inhalt.werte.jeDichterDerScherben}
                    normQuelle={inhalt.werte.dinEnIso10545}
                  />
                </div>
              </div>
            )}

            {/* ───────────── 6. NACHHALTIGKEIT ───────────── */}
            {reiter === 'nachhaltigkeit' && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Brennenergie</h3><MdText text={inhalt.texte.trocknenUndBrennenBestimmen} /></div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.zweiCoQuellen} /></h3>
                    <p><MdText text={inhalt.texte.energiebedingtAusDemBrennstoff} /></p>
                    <div className="my-2 overflow-x-auto"><BlockMath math="\mathrm{CaCO_3 \rightarrow CaO + CO_2}: \quad \frac{44}{100} = 0{,}44\,\text{kg}\;\mathrm{CO_2}\ \text{je kg}\ \mathrm{CaCO_3}" /></div>
                    <p><MdText text={inhalt.texte.kalkreicheToneVerursachenDaher} /></p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.ökobilanzRichtigVergleichen} /></h3><MdText text={inhalt.texte.kennwerteZumTreibhauspotenzialLiefern} /></div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.rückbauUndRecyclingVon} /></h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><MdText text={inhalt.texte.wiederverwendungVollziegelUndKlinker} /></li>
                      <li><MdText text={inhalt.texte.produktionsinternerKreislaufBruchUnd} /></li>
                      <li><MdText text={inhalt.texte.ziegelsplittUndZiegelmehlVegetationssubs} /></li>
                      <li><MdText text={inhalt.texte.rezyklierteGesteinskörnungFürBeton} /></li>
                      <li><MdText text={inhalt.texte.störstoffeGipsputzeSulfatDämmstofffüllun} /></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIELE */}
      <div className={karte}>
        <h3 className="text-base font-bold text-text-main mb-1">Beispiele</h3>
        <FormulaDerivationBox
          title={inhalt.werte.beispiel1IstDie}
          zielGleichung="E_b = \frac{m_n - m_t}{m_t} \cdot 100\,\% \le 0{,}5\,\% \;\Rightarrow\; \text{BIa}"
          schritte={inhalt.daten["KeramikZiegel.schritte"]}
          ergebnisHinweis={inhalt.werte.dieGruppeHängtAn}
          normQuelle={inhalt.werte.dinEnIso105452}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel2FormmaßEines}
          zielGleichung="l_0 = \frac{l_{Brand}}{(1 - s_T)\,(1 - s_B)}"
          schritte={inhalt.daten["KeramikZiegel.schritte_2"]}
          ergebnisHinweis={inhalt.werte.schwankendeRohstoffeUndBrenntemperaturen}
          normQuelle={inhalt.werte.lehrbeispielGrenzabmaßeNachDin}
        />
      </div>

      <ModulTest moduleId="keramik_ziegel" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap3}
        wikipedia={[
          { title: 'Keramik', url: 'https://de.wikipedia.org/wiki/Keramik' },
          { title: 'Ziegel', url: 'https://de.wikipedia.org/wiki/Ziegel' },
          { title: 'Tonminerale', url: 'https://de.wikipedia.org/wiki/Tonminerale' },
        ]}
        literatur={inhalt.daten["KeramikZiegel.literatur"]}
        regelwerke={inhalt.daten["KeramikZiegel.regelwerke"]}
        formeln={inhalt.daten["KeramikZiegel.formeln"]}
      />
    </div>
  );
}
