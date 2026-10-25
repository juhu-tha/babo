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

type Reiter = 'einfuehrung' | 'herstellung' | 'ziegel' | 'normen' | 'rechner' | 'nachhaltigkeit';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Einführung', icon: BookOpen },
  { id: 'herstellung', label: 'Rohstoffe & Herstellung', icon: Factory },
  { id: 'ziegel', label: 'Ziegelarten & Eigenschaften', icon: LayoutGrid },
  { id: 'normen', label: 'Normen & Fliesengruppen', icon: FileText },
  { id: 'rechner', label: 'Rechner Wasseraufnahme', icon: Calculator },
  { id: 'nachhaltigkeit', label: 'Nachhaltigkeit', icon: Recycle },
];

const karte = 'bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30';
const kasten = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const th = 'p-2.5 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2.5 text-xs text-text-main/85 border-b border-home-grau/15 align-top';

/** Beispielproben für den Rechner (Lehrwerte, keine Produktdaten) */
const PROBEN: { id: string; name: string; mt: number; mn: number; ma: number; rhoRein: number; formgebung: Formgebung }[] = [
  { id: 'hand', name: 'Handrechnung (Fliese, trockengepresst)', mt: 200, mn: 210, ma: 118, rhoRein: 2.65, formgebung: 'B' },
  { id: 'feinsteinzeug', name: 'Feinsteinzeug (trockengepresst)', mt: 500, mn: 500.4, ma: 290, rhoRein: 2.5, formgebung: 'B' },
  { id: 'steinzeug', name: 'Steinzeugfliese (trockengepresst)', mt: 400, mn: 408, ma: 230, rhoRein: 2.55, formgebung: 'B' },
  { id: 'steingut', name: 'Steingut-Wandfliese (glasiert)', mt: 300, mn: 345, ma: 170, rhoRein: 2.6, formgebung: 'B' },
  { id: 'spaltplatte', name: 'Spaltplatte (stranggepresst)', mt: 800, mn: 820, ma: 455, rhoRein: 2.6, formgebung: 'A' },
];

const GRUPPEN_FARBE: Record<string, string> = {
  Ia: 'bg-emerald-600', Ib: 'bg-emerald-400', IIa: 'bg-amber-400', IIb: 'bg-orange-500', III: 'bg-rose-600',
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
            <Flame className="w-5 h-5 text-shiraz" /> Keramik und Ziegel
          </h2>
          <p className="text-xs text-text-main/50 font-mono mt-1">
            Vom Tonmineral zum gebrannten Scherben: Herstellung, Ziegelarten, Kennwerte und Normen (DIN EN 771-1, DIN 20000-401, DIN EN 14411, DIN EN 1304)
          </p>
        </div>

        <ModuleTabs label="Bereiche des Moduls Keramik und Ziegel" tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
          <div className="pt-5 animate-in fade-in duration-300">
            {/* ───────────── 1. EINFÜHRUNG ───────────── */}
            {reiter === 'einfuehrung' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <p>
                    <strong>Keramische Werkstoffe</strong> entstehen aus tonhaltigen, mineralischen Rohstoffen, die geformt, getrocknet und gebrannt werden.
                    Beim Brand wandeln sich die Tonminerale irreversibel um: Aus dem plastischen, wasserempfindlichen Formling wird ein fester, wasserbeständiger <strong>Scherben</strong>.
                    Je nach Brenntemperatur und Rohstoff bleibt der Scherben porös (Ziegel, Steingut) oder er sintert dicht (Klinker, Steinzeug, Feinsteinzeug, Porzellan).
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Grobkeramik</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed">Gefüge mit gröberem Korn, oft farbiger Scherben: Mauer- und Dachziegel, Klinker, Spaltplatten, Steinzeugrohre. Mengenmäßig der wichtigste Bereich im Bauwesen.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Feinkeramik</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed">Feinkörnige, aufbereitete Massen: Wand- und Bodenfliesen, Feinsteinzeug, Sanitärkeramik und Porzellan. Hohe Maßhaltigkeit und glatte, oft glasierte Oberflächen.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Leitkennwert Wasseraufnahme</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed">Die Wasseraufnahme beschreibt, wie weit der Scherben gesintert ist. Sie bestimmt Frostverhalten und Verschmutzungsneigung und ist das Einteilungsmerkmal der Fliesengruppen nach DIN EN 14411.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                  <h3 className="text-sm font-bold text-text-main mb-2">Lehrpfad dieses Moduls</h3>
                  <ol className="list-decimal pl-5 space-y-1 text-xs text-text-main/80">
                    <li><strong>Rohstoffe und Herstellung:</strong> Tonminerale, Aufbereitung, Formgebung, Trocknung und Brand mit den maßgebenden Temperaturbereichen.</li>
                    <li><strong>Ziegelarten und Eigenschaften:</strong> Hintermauer-, Vormauer- und Klinkerziegel, Hochloch- und gefüllte Planziegel, Dachziegel; Rohdichte, Festigkeit, Frost, Ausblühungen, Wärmeleitfähigkeit.</li>
                    <li><strong>Normen und Fliesengruppen:</strong> Produkt- und Anwendungsnormen sowie die Gruppen A/B I bis III nach DIN EN 14411.</li>
                    <li><strong>Rechner:</strong> Wasseraufnahme, Fliesengruppe, Rohdichte und Porosität aus drei Wägungen.</li>
                    <li><strong>Nachhaltigkeit:</strong> Brennenergie, CO₂-Quellen und Wege für Ziegelbruch nach dem Rückbau.</li>
                  </ol>
                </div>
                <Querverweis ziel="mauerwerk" titel="Vom Stein zur Wand: Modul Mauerwerk" linkText="Zum Modul Mauerwerk">
                  <p>Dieses Modul behandelt den keramischen Baustoff selbst. Wie Ziegel zusammen mit Mörtel als Mauerwerk tragen, wie die Mauerwerksdruckfestigkeit nach DIN EN 1996-1-1 aus Stein- und Mörtelfestigkeit entsteht und wie Ziegel im Vergleich zu Kalksandstein und Porenbeton abschneiden, zeigt das Modul Mauerwerk.</p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 2. ROHSTOFFE & HERSTELLUNG ───────────── */}
            {reiter === 'herstellung' && (
              <div className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Rohstoffe: Tonminerale und Begleitstoffe</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Ton ist ein feinkörniges Lockergestein, dessen plastische Eigenschaften von den <strong>Tonmineralen</strong> herrühren: plättchenförmige Schichtsilikate aus Tetraeder- (SiO₄) und Oktaederschichten (Al(OH)₆). Zwischen den Plättchen angelagertes Wasser macht den Ton formbar; beim Trocknen entweicht es und der Formling schwindet.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[560px]">
                      <thead><tr><th className={th}>Tonmineral</th><th className={th}>Aufbau</th><th className={th}>Verhalten</th><th className={th}>Bedeutung</th></tr></thead>
                      <tbody>
                        <tr><td className={td}><strong>Kaolinit</strong> <FormulaText text="$\mathrm{Al_2Si_2O_5(OH)_4}$" /></td><td className={td}>Zweischichtmineral (1:1)</td><td className={td}>kaum quellfähig, mäßig plastisch, geringe Schwindung</td><td className={td}>Hauptbestandteil von Kaolin; weiß brennend, Grundlage von Porzellan und Steingut</td></tr>
                        <tr><td className={td}><strong>Illit</strong></td><td className={td}>Dreischichtmineral (2:1), Kalium zwischen den Schichten</td><td className={td}>wenig quellfähig, gut plastisch</td><td className={td}>häufig in Ziegeltonen; Kalium wirkt beim Brand als Flussmittel</td></tr>
                        <tr><td className={td}><strong>Montmorillonit</strong> (Smektit)</td><td className={td}>Dreischichtmineral (2:1) mit austauschbaren Kationen</td><td className={td}>stark quellfähig, sehr plastisch, hohe Trockenschwindung</td><td className={td}>erhöht Bindekraft, aber Rissgefahr beim Trocknen; in kleinen Anteilen erwünscht</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-text-main/80">
                    <li><strong>Quarz und Schamotte</strong> (gemahlener gebrannter Ton) magern die Masse: geringere Schwindung, schnelleres Trocknen.</li>
                    <li><strong>Feldspat und Alkalien</strong> sind Flussmittel: Sie bilden beim Brand eine Schmelzphase und senken die Sintertemperatur.</li>
                    <li><strong>Eisenoxide</strong> färben bei oxidierendem Brand rot (Hämatit); bei reduzierender Ofenatmosphäre entstehen dunkle bis bunte Farbtöne (Klinker).</li>
                    <li><strong>Calcit (Kalk)</strong> bindet das Eisen und hellt den Scherben auf (gelb brennende Tone). Grobe Kalkknollen sind schädlich: Der beim Brand entstehende Branntkalk löscht später unter Volumenzunahme und sprengt Teile ab (Kalktreiben).</li>
                    <li><strong>Porosierungsmittel</strong> wie Sägemehl, Papierfaserstoffe oder Polystyrol brennen aus und hinterlassen feine Poren: geringere Rohdichte, bessere Wärmedämmung.</li>
                  </ul>
                  <Querverweis ziel="lehm" titel="Ungebrannt: Tonminerale im Lehmbau" linkText="Zum Modul Lehm">
                    <p>Dieselben Tonminerale binden ungebrannt den Lehm. Quellen, Schwinden und Sorption ohne Brand behandelt das Modul Lehm.</p>
                  </Querverweis>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Aufbereitung und Formgebung</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Der Ton wird in der Grube gewonnen, gelagert und <strong>gemaukt</strong> (durchfeuchtet und homogenisiert), anschließend in Kollergang und Walzwerken zerkleinert, mit Magerungs- und Porosierungsmitteln gemischt und auf die Formgebungsfeuchte eingestellt.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[560px]">
                      <thead><tr><th className={th}>Verfahren</th><th className={th}>Masse</th><th className={th}>Typische Produkte</th></tr></thead>
                      <tbody>
                        <tr><td className={td}><strong>Strangpressen</strong> (Vakuumstrangpresse, Mundstück)</td><td className={td}>plastisch, entlüftet</td><td className={td}>Hochlochziegel, Vollziegel, Strangdachziegel (Biberschwanz), Spaltplatten (Gruppe A nach DIN EN 14411)</td></tr>
                        <tr><td className={td}><strong>Pressen</strong> (Revolver- oder Stempelpresse)</td><td className={td}>plastischer Strangabschnitt</td><td className={td}>Pressdachziegel (Falzziegel), Formziegel</td></tr>
                        <tr><td className={td}><strong>Trockenpressen</strong></td><td className={td}>Sprühgranulat mit geringer Restfeuchte</td><td className={td}>Wand- und Bodenfliesen, Feinsteinzeug (Gruppe B nach DIN EN 14411)</td></tr>
                        <tr><td className={td}><strong>Handform- und Formbackverfahren</strong></td><td className={td}>weich-plastisch, in Formen geworfen</td><td className={td}>Handformziegel, Wasserstrichziegel für Sichtmauerwerk</td></tr>
                        <tr><td className={td}><strong>Gießen</strong></td><td className={td}>flüssiger Schlicker in Gipsformen</td><td className={td}>Sanitärkeramik, Formteile</td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main flex items-center gap-2"><Droplets size={16} className="text-shiraz" /> Trocknung und Trockenschwindung</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Beim Trocknen verdunstet zunächst das <strong>Schwindungswasser</strong> zwischen den Tonplättchen: Die Teilchen rücken zusammen, der Formling schwindet. Sobald sich die Teilchen berühren (lederharter Zustand), entweicht nur noch Porenwasser ohne nennenswerte weitere Schwindung. Zu schnelles oder ungleichmäßiges Trocknen erzeugt Feuchte- und damit Schwindungsunterschiede zwischen Rand und Kern: Risse und Verzug sind die Folge. Moderne Kammer- und Durchlauftrockner nutzen die Abwärme aus der Kühlzone des Ofens.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                    <BlockMath math="s_T = \frac{l_0 - l_t}{l_0}, \qquad l_0 = \frac{l_{Brand}}{(1 - s_T)\,(1 - s_B)}" />
                    <p className="text-[11px] text-text-main/70 text-center">
                      <FormulaText text="$l_0$ Formmaß, $l_t$ Trockenmaß, $l_{Brand}$ Fertigmaß; $s_T$ Trocken-, $s_B$ Brennschwindung. Ziegeltone schwinden beim Trocknen linear in der Größenordnung von etwa 4 bis 8 % (Lehrwert; stark rohstoffabhängig)." />
                    </p>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main flex items-center gap-2"><Flame size={16} className="text-shiraz" /> Brand: Temperaturbereiche und Sinterung</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Gebrannt wird überwiegend im <strong>Tunnelofen</strong> (Ziegel; Vorwärm-, Brenn- und Kühlzone), Fliesen meist im <strong>Rollenofen</strong> mit kurzen Brennzeiten. Die Temperaturangaben sind Größenordnungen; sie hängen von Rohstoff, Aufheizrate und Ofenatmosphäre ab.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[560px]">
                      <thead><tr><th className={th}>Temperatur (etwa)</th><th className={th}>Vorgang</th><th className={th}>Folge für den Scherben</th></tr></thead>
                      <tbody>
                        <tr><td className={td}>bis 200 °C</td><td className={td}>Austreiben des Restwassers („Schmauchen“)</td><td className={td}>langsam aufheizen, sonst Dampfdruck und Abplatzungen</td></tr>
                        <tr><td className={td}>300 bis 600 °C</td><td className={td}>Ausbrennen organischer Bestandteile und Porosierungsmittel</td><td className={td}>Porenbildung; ausreichend Sauerstoff nötig (sonst dunkler Kern)</td></tr>
                        <tr><td className={td}>450 bis 650 °C</td><td className={td}>Abgabe des Kristallwassers der Tonminerale (Kaolinit wird zu Metakaolin)</td><td className={td}>irreversibel: der Ton ist nicht mehr plastisch – aus Ton wird Keramik</td></tr>
                        <tr><td className={td}>573 °C</td><td className={td}>Quarzumwandlung (Tief- in Hochquarz und zurück)</td><td className={td}>sprunghafte Volumenänderung; beim Abkühlen langsam durchfahren (Kühlrisse)</td></tr>
                        <tr><td className={td}>700 bis 900 °C</td><td className={td}>Zersetzung der Carbonate: <FormulaText text="$\mathrm{CaCO_3 \rightarrow CaO + CO_2}$" /></td><td className={td}>rohstoffbedingte CO₂-Freisetzung; CaO wird in Silikate eingebunden</td></tr>
                        <tr><td className={td}>ab 900 bis 1000 °C</td><td className={td}>Festkörperreaktionen, Neubildung von Silikaten (z. B. Calciumsilikate, bei tonerdereichen Massen Mullit)</td><td className={td}>Festigkeit steigt, Scherben noch porös</td></tr>
                        <tr><td className={td}>ab 1000 bis 1100 °C</td><td className={td}><strong>Sinterung:</strong> Flussmittel bilden eine Schmelze, die Poren füllt und Körner verbindet</td><td className={td}>Brennschwindung, Wasseraufnahme sinkt, Rohdichte und Festigkeit steigen</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <h4 className="text-sm font-bold text-text-main mt-2">Scherbenarten (Richtwerte der Fachliteratur)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[620px]">
                      <thead><tr><th className={th}>Scherben</th><th className={th}>Erzeugnis</th><th className={th}>Brenntemperatur (etwa)</th><th className={th}>Wasseraufnahme</th><th className={th}>Merkmale und Verwendung</th></tr></thead>
                      <tbody>
                        <tr><td className={td} rowSpan={2}><strong>porös</strong> (Irdengut)</td><td className={td}>Mauer-, Dachziegel, Terrakotta</td><td className={td}>900 bis 1100 °C</td><td className={td}>deutlich über 3 %, oft 10 bis 20 %</td><td className={td}>farbig, saugfähig; Frostwiderstand hängt von Porengefüge und Sättigung ab</td></tr>
                        <tr><td className={td}>Steingut</td><td className={td}>etwa 1000 bis 1200 °C</td><td className={td}>über 10 % (Gruppe BIII)</td><td className={td}>weißer, poröser Scherben, glasiert; Wandfliesen im Innenbereich, nicht frostbeständig</td></tr>
                        <tr><td className={td} rowSpan={4}><strong>dicht</strong> (Sinterzeug)</td><td className={td}>Klinker</td><td className={td}>1100 bis 1300 °C</td><td className={td}>gering (bis zur Sinterung gebrannt)</td><td className={td}>hohe Rohdichte und Festigkeit, frost- und chemikalienbeständig</td></tr>
                        <tr><td className={td}>Steinzeug</td><td className={td}>etwa 1150 bis 1300 °C</td><td className={td}>bis etwa 3 %</td><td className={td}>gefärbter, dichter Scherben; Bodenfliesen, Spaltplatten, Kanalrohre</td></tr>
                        <tr><td className={td}>Feinsteinzeug</td><td className={td}>etwa 1200 bis 1250 °C</td><td className={td}>≤ 0,5 % (Gruppe BIa)</td><td className={td}>feinkörnig, hoch verdichtet, trockengepresst; frostbeständig, sehr verschleißfest</td></tr>
                        <tr><td className={td}>Porzellan</td><td className={td}>etwa 1300 bis 1450 °C</td><td className={td}>nahezu 0 %</td><td className={td}>Kaolin, Quarz, Feldspat; weiß, in dünnen Schichten durchscheinend; Sanitär, Isolatoren</td></tr>
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
                        <tr><td className={td}><strong>Hintermauerziegel</strong></td><td className={td}>meist porosiert, als Voll- oder Hochlochziegel; keine besonderen Anforderungen an das Aussehen</td><td className={td}>verputztes oder bekleidetes Mauerwerk (geschützte Anwendung, P-Ziegel)</td></tr>
                        <tr><td className={td}><strong>Vormauerziegel</strong></td><td className={td}>frostwiderstandsfähig, maßhaltig, gleichmäßige Ansichtsflächen</td><td className={td}>unverputztes Sichtmauerwerk, Verblendschale (ungeschützte Anwendung, U-Ziegel)</td></tr>
                        <tr><td className={td}><strong>Klinker</strong></td><td className={td}>bis zur Sinterung gebrannt, sehr geringe Wasseraufnahme, hohe Rohdichte und Druckfestigkeit; Keramikklinker zusätzlich besonders widerstandsfähig gegen aggressive Stoffe und Abrieb (DIN 105-4)</td><td className={td}>stark beanspruchte Fassaden, Sockel, Industrie- und Kanalbau, Pflaster</td></tr>
                        <tr><td className={td}><strong>Hochlochziegel</strong></td><td className={td}>Lochung senkrecht zur Lagerfläche; das Lochbild verlängert den Wärmestrom durch die Stege</td><td className={td}>tragende Außen- und Innenwände; als Planziegel mit geschliffenen Lagerflächen im Dünnbettmörtel</td></tr>
                        <tr><td className={td}><strong>Gefüllte Planziegel</strong></td><td className={td}>Hochlochziegel, deren Kammern werkseitig mit Mineralwolle oder Perlit gefüllt sind</td><td className={td}>einschalige, hoch wärmedämmende Außenwände ohne Zusatzdämmung; Verwendung nach allgemeiner bauaufsichtlicher Zulassung bzw. Bauartgenehmigung</td></tr>
                        <tr><td className={td}><strong>Dachziegel</strong></td><td className={td}>Strangdachziegel (z. B. Biberschwanz) oder Pressdachziegel (Falzziegel); naturrot, engobiert oder glasiert</td><td className={td}>Dachdeckung; Produktnorm DIN EN 1304</td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Eigenschaften und Kennwerte</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[680px]">
                      <thead><tr><th className={th}>Eigenschaft</th><th className={th}>Bedeutung</th><th className={th}>Angabe und Prüfung</th><th className={th}>Größenordnung (Lehrwert)</th></tr></thead>
                      <tbody>
                        <tr><td className={td}><strong>Rohdichteklasse</strong></td><td className={td}>Brutto-Trockenrohdichte einschließlich Lochung in kg/dm³; niedrig für Wärmeschutz, hoch für Schallschutz und Festigkeit</td><td className={td}>Prüfung nach DIN EN 772-13; Klassen nach DIN 20000-401</td><td className={td}>etwa 0,6 (hoch wärmedämmender Hochlochziegel) bis über 2,0 (Klinker)</td></tr>
                        <tr><td className={td}><strong>Druckfestigkeit</strong></td><td className={td}>normierte mittlere Druckfestigkeit des Steins; Eingangswert der Mauerwerksfestigkeit</td><td className={td}>Prüfung nach DIN EN 772-1; Druckfestigkeitsklassen nach DIN 20000-401</td><td className={td}>Klassen z. B. 4, 6, 8, 10, 12, 16, 20, 28, 36, 48, 60 N/mm²; Klasse 12 verlangt einen Mittelwert von mindestens 15 N/mm²</td></tr>
                        <tr><td className={td}><strong>Wasseraufnahme</strong></td><td className={td}>Maß für die offene Porosität; beeinflusst Frost-, Schlagregen- und Verschmutzungsverhalten</td><td className={td}>Kaltwasseraufnahme nach DIN EN 772-21, Kochverfahren nach DIN EN 772-7; bei Fliesen DIN EN ISO 10545-3</td><td className={td}>Klinker gering, Hintermauerziegel deutlich höher</td></tr>
                        <tr><td className={td}><strong>Frostwiderstand</strong></td><td className={td}>Widerstand gegen Frost-Tau-Wechsel im wassergesättigten Zustand; entscheidend sind Porengrößenverteilung und Sättigungsgrad, nicht allein die Wasseraufnahme</td><td className={td}>Kategorien F0, F1, F2 nach DIN EN 771-1 (passive bis starke Exposition), Prüfung nach DIN EN 772-22</td><td className={td}>Sichtmauerwerk in der Regel F2</td></tr>
                        <tr><td className={td}><strong>Ausblühungen</strong></td><td className={td}>wasserlösliche Salze (Sulfate von Natrium, Kalium, Magnesium) wandern mit dem Wasser an die Oberfläche und kristallisieren dort aus; Kalkaussinterungen stammen aus dem Mörtel</td><td className={td}>Gehalt an aktiven löslichen Salzen, Kategorien S0, S1, S2 nach DIN EN 771-1 (Prüfung DIN EN 772-5)</td><td className={td}>Vorbeugen: trockene Lagerung, frisches Mauerwerk abdecken, salzarmer Mörtel</td></tr>
                        <tr><td className={td}><strong>Wärmeleitfähigkeit</strong></td><td className={td}>sinkt mit der Rohdichte, durch Lochbild und Füllung; maßgebend ist der Bemessungswert des Mauerwerks</td><td className={td}>Bemessungswerte nach DIN 4108-4 oder nach Zulassung bzw. Bauartgenehmigung</td><td className={td}>Vollziegelmauerwerk etwa 0,5 bis 0,8 W/(m·K), gefüllte Planziegel bis etwa 0,07 W/(m·K)</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-text-main/60 leading-relaxed flex items-start gap-1.5">
                    <Info size={13} className="shrink-0 mt-0.5" /> Die Größenordnungen dienen der Einordnung. Für Planung und Bemessung gelten die in der Leistungserklärung deklarierten Werte und die Anwendungsregeln der DIN 20000-401 bzw. der Zulassung.
                  </p>
                </section>

                <Querverweis ziel="mauerwerk" titel="Steinfestigkeit und Mauerwerksfestigkeit" linkText="Mauerwerksfestigkeit berechnen">
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
                  <h3 className="text-base font-bold text-text-main">Mauerziegel: Produktnorm und Anwendungsnorm</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                      <h4 className="font-bold text-text-main text-sm mb-1">DIN EN 771-1:2015-11</h4>
                      Harmonisierte europäische Produktnorm für Mauerziegel. Grundlage für Leistungserklärung und CE-Kennzeichnung: Maße und Grenzabmaße, Kategorie I oder II, Druckfestigkeit, Rohdichte, Frostwiderstand (F0 bis F2), aktive lösliche Salze (S0 bis S2), Wasseraufnahme, Wärmeleitfähigkeit und Brandverhalten. Unterschieden werden P-Ziegel (geschützte Anwendung) und U-Ziegel (ungeschützte Anwendung).
                    </div>
                    <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                      <h4 className="font-bold text-text-main text-sm mb-1">DIN 20000-401:2017-01</h4>
                      Nationale Anwendungsnorm: legt fest, welche nach DIN EN 771-1 deklarierten Leistungen für die Verwendung in Deutschland erforderlich sind (u. a. Druckfestigkeits- und Rohdichteklassen). Sie gilt für Ziegel der Kategorie I, nicht jedoch für Füllziegel, Klinker, Dünnbettverblendziegel und Mauersperrziegel. Ein Entwurf der Neufassung (DIN 20000-401:2026-11, Entwurf) liegt vor.
                    </div>
                    <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                      <h4 className="font-bold text-text-main text-sm mb-1">DIN 105-100:2012-01 (zurückgezogen) und DIN 105-4:2019-01</h4>
                      DIN 105-100 regelte Mauerziegel mit besonderen Eigenschaften (u. a. Vormauerziegel und Klinker) und ist zurückgezogen. Sie wurde durch DIN 105-4:2019-01 „Keramikklinker“ (mit Änderung A1:2021-04) und DIN 105-41:2019-01 (Konformitätsnachweis) ersetzt. In älteren Datenblättern und Ausschreibungen finden Sie die Bezüge noch häufig.
                    </div>
                    <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                      <h4 className="font-bold text-text-main text-sm mb-1">DIN EN 1304:2013-08</h4>
                      Produktnorm für Dach- und Formziegel: Begriffe und Produktspezifikationen, u. a. Maße und Form, Wasserundurchlässigkeit (Prüfung nach DIN EN 539-1), Frostwiderstand (DIN EN 539-2) und Biegetragfähigkeit (DIN EN 538).
                    </div>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Keramische Fliesen nach DIN EN 14411:2016-12</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    <FormulaText text="Fliesen werden nach der <strong>Formgebung</strong> (A stranggepresst, B trockengepresst) und nach der <strong>Wasseraufnahme</strong> $E_b$ eingeteilt. $E_b$ wird nach DIN EN ISO 10545-3:2018-06 im Kochverfahren als Massenanteil bezogen auf die Trockenmasse bestimmt." />
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[560px]">
                      <thead><tr><th className={th}>Wasseraufnahme</th><th className={th}>Gruppe I: E_b ≤ 3 %</th><th className={th}>Gruppe II: 3 % &lt; E_b ≤ 10 %</th><th className={th}>Gruppe III: E_b &gt; 10 %</th></tr></thead>
                      <tbody>
                        <tr><td className={td}><strong>A stranggepresst</strong></td><td className={td}>AIa: E_b ≤ 0,5 %<br />AIb: 0,5 % &lt; E_b ≤ 3 %</td><td className={td}>AIIa: 3 % &lt; E_b ≤ 6 %<br />AIIb: 6 % &lt; E_b ≤ 10 %<br /><span className="text-text-main/60">(jeweils Teil 1 und 2 nach weiteren Eigenschaften)</span></td><td className={td}>AIII</td></tr>
                        <tr><td className={td}><strong>B trockengepresst</strong></td><td className={td}>BIa: E_b ≤ 0,5 % (Feinsteinzeug)<br />BIb: 0,5 % &lt; E_b ≤ 3 %</td><td className={td}>BIIa: 3 % &lt; E_b ≤ 6 %<br />BIIb: 6 % &lt; E_b ≤ 10 %</td><td className={td}>BIII (glasiert, z. B. Steingut-Wandfliesen)</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed">
                    Je niedriger die Gruppe, desto dichter der Scherben: Fliesen der Gruppe I eignen sich für frostbeanspruchte Außenbeläge, Fliesen der Gruppe BIII nur für Innenwände. Die Frostbeständigkeit ist zusätzlich nach DIN EN ISO 10545-12 nachzuweisen.
                  </p>
                </section>
              </div>
            )}

            {/* ───────────── 5. RECHNER ───────────── */}
            {reiter === 'rechner' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Wägungen der Probe</h3>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-main">Beispielprobe laden</span>
                      <select
                        aria-label="Beispielprobe laden"
                        defaultValue="hand"
                        onChange={e => ladeProbe(e.target.value)}
                        className="p-2 border border-home-grau/50 rounded-lg bg-white text-sm focus:outline-none focus:border-shiraz"
                      >
                        {PROBEN.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </label>
                    {eingabe('Trockenmasse m_t (bei 110 °C bis zur Massekonstanz)', mt, setMt, 'g', '0.1')}
                    {eingabe('Nassmasse m_n (nach Kochen, oberflächentrocken)', mn, setMn, 'g', '0.1')}
                    <label className="flex items-center gap-2 text-xs font-bold text-text-main">
                      <input type="checkbox" checked={mitMa} onChange={e => setMitMa(e.target.checked)} className="accent-shiraz w-4 h-4" />
                      Unterwasserwägung vorhanden
                    </label>
                    {eingabe('Masse unter Wasser m_a', ma, setMa, 'g', '0.1', !mitMa)}
                    <label className={`flex items-center gap-2 text-xs font-bold text-text-main ${mitMa ? '' : 'opacity-40'}`}>
                      <input type="checkbox" checked={mitRein} disabled={!mitMa} onChange={e => setMitRein(e.target.checked)} className="accent-shiraz w-4 h-4" />
                      Reindichte bekannt (Gesamtporosität)
                    </label>
                    {eingabe('Reindichte des Scherbens ρ_rein', rhoRein, setRhoRein, 'g/cm³', '0.01', !(mitMa && mitRein))}
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-main">Formgebung nach DIN EN 14411</span>
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
                        <div className="text-xs text-text-main/60 font-bold uppercase tracking-wide">Gruppe DIN EN 14411</div>
                        <div className={`inline-block mt-1 px-3 py-1 rounded-lg text-white font-black text-xl ${GRUPPEN_FARBE[teil] ?? 'bg-slate-400'}`}>{erg.gruppe ?? '–'}</div>
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
                        { l: 'Rohdichte ρ_roh', w: formatDeZahl(erg.rhoRoh, 3), e: 'g/cm³' },
                        { l: 'offene Porosität', w: formatDeZahl(erg.pOffen, 2), e: '%' },
                        { l: 'Gesamtporosität', w: formatDeZahl(erg.pGes, 2), e: '%' },
                      ].map(k => (
                        <div key={k.l} className="p-3 rounded-lg border border-home-grau/30 bg-off-white">
                          <div className="text-[10px] text-text-main/60 font-bold">{k.l}</div>
                          <div className="font-mono font-bold text-text-main text-sm">{k.w} <span className="text-[10px] text-text-main/60">{k.e}</span></div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-text-main/60 leading-relaxed">
                      Die Gruppen nach DIN EN 14411 gelten für keramische Fliesen. Für Mauerziegel dient der Wert nur zum Vergleich; dort wird die Wasseraufnahme nach DIN EN 772-21 bzw. DIN EN 772-7 bestimmt.
                    </p>
                  </div>

                  <FormulaDerivationBox
                    live
                    title="Ihr Rechenweg: Wasseraufnahme, Rohdichte und Porosität"
                    zielGleichung="E_b = \frac{m_n - m_t}{m_t} \cdot 100\,\%"
                    schritte={[
                      {
                        titel: 'Wasseraufnahme',
                        erklaerung: 'Aufgenommene Wassermasse bezogen auf die Trockenmasse:',
                        formel: `E_b = \\frac{${tex(mn, 1)} - ${tex(mt, 1)}}{${tex(mt, 1)}} \\cdot 100\\,\\% = ${tex(erg.eb, 2)}\\,\\%`,
                      },
                      {
                        titel: 'Einordnung nach DIN EN 14411',
                        erklaerung: `Formgebung ${formgebung === 'A' ? 'A (stranggepresst)' : 'B (trockengepresst)'}; Grenzen 0,5 / 3 / 6 / 10 %:`,
                        formel: `E_b = ${tex(erg.eb, 2)}\\,\\% \\;\\Rightarrow\\; \\text{Gruppe ${erg.gruppe ?? '–'}}`,
                      },
                      {
                        titel: 'Volumen aus der Unterwasserwägung',
                        erklaerung: mitMa ? 'Auftrieb = verdrängtes Wasser; mit ρ_w = 1,0 g/cm³:' : 'Ohne Unterwasserwägung kann das Volumen nicht bestimmt werden.',
                        formel: mitMa ? `V = \\frac{m_n - m_a}{\\rho_w} = \\frac{${tex(mn, 1)} - ${tex(ma, 1)}}{1{,}0} = ${tex(erg.volumen, 1)}\\,\\text{cm}^3` : 'V = \\text{–}',
                      },
                      {
                        titel: 'Rohdichte und offene Porosität',
                        erklaerung: 'Trockenmasse je Volumen; wassergefülltes Porenvolumen je Volumen:',
                        formel: `\\rho_{roh} = \\frac{${tex(mt, 1)}}{${tex(erg.volumen, 1)}} = ${tex(erg.rhoRoh, 3)}\\,\\tfrac{\\text{g}}{\\text{cm}^3}, \\quad P_{offen} = \\frac{m_n - m_t}{m_n - m_a} = ${tex(erg.pOffen, 2)}\\,\\%`,
                      },
                      {
                        titel: 'Gesamtporosität',
                        erklaerung: mitMa && mitRein ? 'Aus Roh- und Reindichte; die Differenz zur offenen Porosität sind geschlossene Poren:' : 'Benötigt Unterwasserwägung und Reindichte.',
                        formel: `P_{ges} = \\left(1 - \\frac{${tex(erg.rhoRoh, 3)}}{${tex(mitRein ? rhoRein : NaN, 2)}}\\right) \\cdot 100\\,\\% = ${tex(erg.pGes, 2)}\\,\\%`,
                      },
                    ]}
                    ergebnisHinweis="Je dichter der Scherben gesintert ist, desto kleiner sind E_b und die offene Porosität und desto niedriger die Gruppe."
                    normQuelle="DIN EN ISO 10545-3:2018-06 (Prüfverfahren); DIN EN 14411:2016-12 (Gruppen)"
                  />
                </div>
              </div>
            )}

            {/* ───────────── 6. NACHHALTIGKEIT ───────────── */}
            {reiter === 'nachhaltigkeit' && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Brennenergie</h3>
                    Trocknen und Brennen bestimmen den Energiebedarf der Ziegelherstellung; Brennstoff ist überwiegend Erdgas. Tunnelöfen gewinnen Wärme aus der Kühlzone zurück und führen sie dem Trockner zu. Höhere Brenntemperaturen (Klinker, Feinsteinzeug) erhöhen den Energiebedarf je Tonne. Als Wege zur Dekarbonisierung werden elektrisch beheizte Öfen, Wasserstoff und Biogas erprobt.
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Zwei CO₂-Quellen</h3>
                    <p>Energiebedingt aus dem Brennstoff und rohstoffbedingt aus der Zersetzung von Carbonaten im Ton sowie aus ausbrennenden organischen Porosierungsmitteln. Stöchiometrisch gilt:</p>
                    <div className="my-2 overflow-x-auto"><BlockMath math="\mathrm{CaCO_3 \rightarrow CaO + CO_2}: \quad \frac{44}{100} = 0{,}44\,\text{kg}\;\mathrm{CO_2}\ \text{je kg}\ \mathrm{CaCO_3}" /></div>
                    <p>Kalkreiche Tone verursachen daher auch bei klimaneutraler Energie noch prozessbedingte Emissionen.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Ökobilanz richtig vergleichen</h3>
                    Kennwerte zum Treibhauspotenzial liefern Umwelt-Produktdeklarationen (EPD) nach DIN EN 15804 und die ÖKOBAUDAT. Verglichen wird nicht je Kilogramm, sondern je funktionaler Einheit, etwa je m² Außenwand mit gleichem U-Wert und gleicher Nutzungsdauer. Für Ziegel sprechen die lange Nutzungsdauer, die Dauerhaftigkeit von Sichtmauerwerk ohne Anstrich und die Wärmespeicherfähigkeit.
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Rückbau und Recycling von Ziegelbruch</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Wiederverwendung:</strong> Vollziegel und Klinker lassen sich nach Reinigung wieder vermauern – gut bei weichem Kalkmörtel, kaum bei Zementmörtel.</li>
                      <li><strong>Produktionsinterner Kreislauf:</strong> Bruch und Ausschuss werden gemahlen und als Magerungsmittel (Schamotte) der Rohmasse zugegeben.</li>
                      <li><strong>Ziegelsplitt und Ziegelmehl:</strong> Vegetationssubstrate (Dachbegrünung), Tennenbeläge von Sportplätzen, Wege- und Erdbau; für ungebundene Verwendungen gilt die Ersatzbaustoffverordnung (EBV, seit 1. August 2023).</li>
                      <li><strong>Rezyklierte Gesteinskörnung für Beton:</strong> Typ 1 nach DIN 1045-2 mit höchstens 10 M.-% Ziegelanteil (Rb), Typ 2 (Bauwerkssplitt) mit höchstens 30 M.-%.</li>
                      <li><strong>Störstoffe:</strong> Gipsputze (Sulfat), Dämmstofffüllungen gefüllter Ziegel und anhaftender Mörtel verschlechtern die Qualität – sortenreiner, selektiver Rückbau ist die Voraussetzung.</li>
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
          title="Beispiel 1: Ist die Bodenfliese Feinsteinzeug?"
          zielGleichung="E_b = \frac{m_n - m_t}{m_t} \cdot 100\,\% \le 0{,}5\,\% \;\Rightarrow\; \text{BIa}"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Trockengepresste Fliese, Kochverfahren nach DIN EN ISO 10545-3:', formel: 'm_t = 1\\,250{,}0\\,\\text{g}, \\quad m_n = 1\\,253{,}5\\,\\text{g}, \\quad m_a = 717{,}0\\,\\text{g}' },
            { titel: 'Wasseraufnahme', erklaerung: 'Aufgenommenes Wasser 3,5 g bezogen auf die Trockenmasse:', formel: 'E_b = \\frac{3{,}5}{1\\,250{,}0} \\cdot 100\\,\\% = 0{,}28\\,\\% \\le 0{,}5\\,\\% \\;\\Rightarrow\\; \\text{BIa (Feinsteinzeug)}' },
            { titel: 'Rohdichte und offene Porosität', erklaerung: 'Volumen aus der Unterwasserwägung:', formel: 'V = 1\\,253{,}5 - 717{,}0 = 536{,}5\\,\\text{cm}^3, \\quad \\rho_{roh} = \\frac{1\\,250{,}0}{536{,}5} = 2{,}33\\,\\tfrac{\\text{g}}{\\text{cm}^3}, \\quad P_{offen} = \\frac{3{,}5}{536{,}5} = 0{,}65\\,\\%' },
            { titel: 'Gegenprobe', erklaerung: 'Eine Fliese derselben Serie mit 7,5 g Wasseraufnahme läge bei 0,60 % und damit in Gruppe BIb:', formel: 'E_b = \\frac{7{,}5}{1\\,250{,}0} \\cdot 100\\,\\% = 0{,}60\\,\\% > 0{,}5\\,\\% \\;\\Rightarrow\\; \\text{BIb}' },
          ]}
          ergebnisHinweis="Die Gruppe hängt an wenigen Gramm: Wägegenauigkeit und vollständige Sättigung sind für die Einstufung entscheidend."
          normQuelle="DIN EN ISO 10545-3:2018-06; DIN EN 14411:2016-12"
        />
        <FormulaDerivationBox
          title="Beispiel 2: Formmaß eines Vormauerziegels im Normalformat"
          zielGleichung="l_0 = \frac{l_{Brand}}{(1 - s_T)\,(1 - s_B)}"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Fertigmaß der Länge 240 mm (NF); Trockenschwindung 6 %, Brennschwindung 2 % (Lehrwerte):', formel: 'l_{Brand} = 240\\,\\text{mm}, \\quad s_T = 0{,}06, \\quad s_B = 0{,}02' },
            { titel: 'Maß nach dem Trocknen', erklaerung: 'Der getrocknete Rohling muss die Brennschwindung vorhalten:', formel: 'l_t = \\frac{240}{1 - 0{,}02} = 244{,}90\\,\\text{mm}' },
            { titel: 'Formmaß am Mundstück', erklaerung: 'Zusätzlich die Trockenschwindung vorhalten:', formel: 'l_0 = \\frac{244{,}90}{1 - 0{,}06} = 260{,}53\\,\\text{mm}, \\quad s_{ges} = 1 - 0{,}94 \\cdot 0{,}98 = 7{,}88\\,\\%' },
            { titel: 'Empfindlichkeit', erklaerung: 'Schwindet der Scherben im Brand 3 % statt 2 %, wird der Ziegel kürzer:', formel: 'l_{Brand} = 260{,}53 \\cdot 0{,}94 \\cdot 0{,}97 = 237{,}55\\,\\text{mm} \\;(-2{,}45\\,\\text{mm})' },
          ]}
          ergebnisHinweis="Schwankende Rohstoffe und Brenntemperaturen wirken direkt auf die Maßhaltigkeit; die Grenzabmaße werden nach DIN EN 771-1 deklariert. Planziegel werden deshalb nach dem Brand geschliffen."
          normQuelle="Lehrbeispiel; Grenzabmaße nach DIN EN 771-1:2015-11"
        />
      </div>

      <ModulTest moduleId="keramik_ziegel" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 3.13: Modul neu erstellt; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Keramik', url: 'https://de.wikipedia.org/wiki/Keramik' },
          { title: 'Ziegel', url: 'https://de.wikipedia.org/wiki/Ziegel' },
          { title: 'Tonminerale', url: 'https://de.wikipedia.org/wiki/Tonminerale' },
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Salmang, H.; Scholze, H.: Keramik. 7. Aufl., hrsg. von R. Telle, Berlin/Heidelberg: Springer 2007',
        ]}
        regelwerke={[
          { title: 'DIN EN 771-1:2015-11 (Festlegungen für Mauersteine - Teil 1: Mauerziegel)' },
          { title: 'DIN 20000-401:2017-01 (Anwendung von Mauerziegeln nach DIN EN 771-1)' },
          { title: 'DIN 105-4:2019-01 (Mauerziegel - Teil 4: Keramikklinker; mit Änderung A1:2021-04)' },
          { title: 'DIN 105-100:2012-01 (Mauerziegel mit besonderen Eigenschaften; zurückgezogen, ersetzt durch DIN 105-4 und DIN 105-41)' },
          { title: 'DIN EN 14411:2016-12 (Keramische Fliesen und Platten - Definitionen, Klassifizierung, Eigenschaften, Bewertung und Überprüfung der Leistungsbeständigkeit und Kennzeichnung)' },
          { title: 'DIN EN ISO 10545-3:2018-06 (Keramische Fliesen und Platten - Teil 3: Bestimmung von Wasseraufnahme, offener Porosität, scheinbarer relativer Dichte und Rohdichte)' },
          { title: 'DIN EN 1304:2013-08 (Dach- und Formziegel - Begriffe und Produktspezifikationen)' },
          { title: 'DIN EN 1996-1-1:2013-02 (Eurocode 6: Bemessung und Konstruktion von Mauerwerksbauten)' },
        ]}
        formeln={[
          { formel: 'E_b = \\frac{m_n - m_t}{m_t} \\cdot 100\\,\\%', erklaerung: 'Wasseraufnahme im Kochverfahren, bezogen auf die Trockenmasse; Einteilungsgröße der Fliesengruppen.', quelle: 'DIN EN ISO 10545-3:2018-06' },
          { formel: '\\rho_{roh} = \\frac{m_t \\cdot \\rho_w}{m_n - m_a}, \\quad P_{offen} = \\frac{m_n - m_t}{m_n - m_a} \\cdot 100\\,\\%', erklaerung: 'Rohdichte und offene Porosität aus Trocken-, Nass- und Unterwasserwägung (Archimedes-Prinzip).', quelle: 'DIN EN ISO 10545-3:2018-06' },
          { formel: 'P_{ges} = \\left(1 - \\frac{\\rho_{roh}}{\\rho_{rein}}\\right) \\cdot 100\\,\\%', erklaerung: 'Gesamtporosität aus Roh- und Reindichte; enthält offene und geschlossene Poren.' },
          { formel: 'l_0 = \\frac{l_{Brand}}{(1 - s_T)\\,(1 - s_B)}', erklaerung: 'Formmaß des Rohlings aus Fertigmaß, Trocken- und Brennschwindung.' },
        ]}
      />
    </div>
  );
}
