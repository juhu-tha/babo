import React, { useMemo, useState } from 'react';
import { BookOpen, Flame, FlaskConical, Calculator, ShieldAlert, Leaf, Info, GraduationCap } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { biokohleBilanz, F_PERM_IPCC, CO2_JE_C } from '@/src/calc/biokohlebeton';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

type Reiter = 'einfuehrung' | 'herstellung' | 'wirkung' | 'rechner' | 'grenzen';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Einführung', icon: BookOpen },
  { id: 'herstellung', label: 'Pflanzenkohle: Herstellung & Kennwerte', icon: Flame },
  { id: 'wirkung', label: 'Wirkung im Beton', icon: FlaskConical },
  { id: 'rechner', label: 'Rechner CO₂-Bilanz', icon: Calculator },
  { id: 'grenzen', label: 'Grenzen & Regelwerk', icon: ShieldAlert },
];

const karte = 'bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30';
const kasten = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const th = 'p-2.5 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2.5 text-xs text-text-main/85 border-b border-home-grau/15 align-top';

/** Zementarten für das Treibhauspotenzial (Richtwerte der Größenordnung; für Nachweise EPD des Herstellers verwenden) */
const ZEMENTE = [
  { id: 'cem1', label: 'CEM I (Richtwert 0,80 kg CO₂e/kg)', gwp: 0.8 },
  { id: 'cem2', label: 'CEM II/B (Richtwert 0,65 kg CO₂e/kg)', gwp: 0.65 },
  { id: 'cem3', label: 'CEM III/A (Richtwert 0,45 kg CO₂e/kg)', gwp: 0.45 },
] as const;

export default function Biokohlebeton() {
  const [reiter, setReiter] = useState<Reiter>('einfuehrung');
  const [mPK, setMPK] = useState(10);
  const [cGehalt, setCGehalt] = useState(80);
  const [fPerm, setFPerm] = useState(0.8);
  const [ePK, setEPK] = useState(0.3);
  const [zRef, setZRef] = useState(320);
  const [deltaZ, setDeltaZ] = useState(10);
  const [gwpZ, setGwpZ] = useState(0.8);
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
            <Leaf className="w-5 h-5 text-shiraz" /> Biokohlebeton – Pflanzenkohle im Beton
          </h2>
          <p className="text-xs text-text-main/50 font-mono mt-1">
            Kohlenstoffspeicher im Bauteil: CO₂-Bilanz, Wasseranspruch, Karbonatisierung und dunkle Matrix (Stand der öffentlichen Literatur)
          </p>
        </div>

        <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed flex items-start gap-2.5">
          <GraduationCap size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Projekthinweis:</strong> Pflanzenkohle im Beton ist ein Forschungsthema an der TH Augsburg und im TTZ Aichach.
            Dieses Modul gibt ausschließlich den öffentlich zugänglichen Stand von Normung und Fachliteratur wieder; Zahlenangaben sind als Richtwerte gekennzeichnet und ersetzen keine Eignungsprüfung.
          </p>
        </div>

        <ModuleTabs label="Bereiche des Moduls Biokohlebeton" tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
          <div className="pt-5 animate-in fade-in duration-300">
            {/* ───────────── 1. EINFÜHRUNG ───────────── */}
            {reiter === 'einfuehrung' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <p>
                    <strong>Pflanzenkohle</strong> (engl. <em>biochar</em>) entsteht durch Pyrolyse von Biomasse unter weitgehendem Sauerstoffausschluss.
                    Der Kohlenstoff, den die Pflanze beim Wachstum als CO₂ aus der Atmosphäre aufgenommen hat, liegt danach in einer sehr beständigen, aromatischen Struktur vor.
                    Wird diese Kohle in Beton eingebunden, entsteht ein <strong>Kohlenstoffspeicher im Bauteil</strong> – solange der Kohlenstoff auch am Lebensende nicht verbrannt oder abgebaut wird.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Senke statt nur Minderung</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed">Zementreduktion vermeidet Emissionen. Pflanzenkohle entzieht der Atmosphäre zusätzlich CO₂ – beides lässt sich in einer Bilanz je m³ vergleichen.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Kein Bindemittel</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed">Pflanzenkohle reagiert nicht hydraulisch oder puzzolanisch. Sie wirkt als feiner, poröser Füller, der Wasser speichert und die Matrix dunkel färbt.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                    <h3 className="text-sm font-bold text-text-main mb-1.5">Dosierung begrenzt</h3>
                    <p className="text-xs text-text-main/80 leading-relaxed">In der Literatur werden meist wenige Massenprozent bezogen auf den Zement untersucht; höhere Gehalte erhöhen Wasseranspruch und Porosität und senken die Festigkeit.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-home-grau/30 bg-white">
                  <h3 className="text-sm font-bold text-text-main mb-2">Lehrpfad dieses Moduls</h3>
                  <ol className="list-decimal pl-5 space-y-1 text-xs text-text-main/80">
                    <li><strong>Herstellung und Kennwerte:</strong> Pyrolyse, Kohlenstoffgehalt, Stabilität (H/C-Verhältnis) und Permanenz.</li>
                    <li><strong>Wirkung im Beton:</strong> Wasseranspruch, Porosität, Festigkeit, Karbonatisierung und pH-Wert, dunkle Matrix.</li>
                    <li><strong>Rechner:</strong> CO₂-Bilanz je m³ aus gespeichertem Kohlenstoff, Herstellungsemission und Zementreduktion.</li>
                    <li><strong>Grenzen und Regelwerk:</strong> Bilanzierungsregeln, Nachweise und offene Fragen.</li>
                  </ol>
                </div>
                <Querverweis ziel="oekobilanz_lca" titel="Bilanzrahmen: Ökobilanz nach DIN EN 15804" linkText="Zum Modul Ökobilanz">
                  <p>Wie biogener Kohlenstoff in Umwelt-Produktdeklarationen über die Module A bis C geführt wird und warum ein Speicher erst über den gesamten Lebenszyklus zählt, erläutert das Modul Ökobilanz (LCA).</p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 2. HERSTELLUNG & KENNWERTE ───────────── */}
            {reiter === 'herstellung' && (
              <div className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Pyrolyse</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Biomasse wie Holzreste, Grünschnitt, Spelzen oder Gärreste wird unter Sauerstoffmangel erhitzt. Dabei entweichen Wasser und flüchtige Bestandteile als Pyrolysegas und -öl; zurück bleibt ein kohlenstoffreicher, hochporöser Feststoff.
                    Das Gas wird in Anlagen üblicherweise verbrannt und liefert die Prozesswärme. Höhere Pyrolysetemperaturen ergeben einen höheren Kohlenstoffgehalt, ein kleineres H/C-Verhältnis und damit eine stabilere Kohle, aber eine geringere Ausbeute.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                    <BlockMath math="m_{\mathrm{CO_2}} = m_{PK} \cdot w_C \cdot \frac{44}{12} \cdot F_{perm}" />
                    <p className="text-[11px] text-text-main/70 text-center">
                      <FormulaText text="$w_C$ Kohlenstoffgehalt (Massenanteil), $44/12 = 3{,}67$ Verhältnis der molaren Massen von CO₂ und C, $F_{perm}$ Anteil des Kohlenstoffs, der langfristig gebunden bleibt." />
                    </p>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Kennwerte (Richtwerte der Fachliteratur)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[620px]">
                      <thead><tr><th className={th}>Kennwert</th><th className={th}>Größenordnung (Richtwert)</th><th className={th}>Bedeutung für Beton</th></tr></thead>
                      <tbody>
                        <tr><td className={td}><strong>Pyrolysetemperatur</strong></td><td className={td}>etwa 350 bis 900 °C</td><td className={td}>steuert Kohlenstoffgehalt, Stabilität und Porenstruktur</td></tr>
                        <tr><td className={td}><strong>Kohlenstoffgehalt</strong> <FormulaText text="$w_C$" /></td><td className={td}>etwa 50 bis 90 M.-% der Trockenmasse; Pflanzenkohle nach den EBC-Richtlinien mindestens 50 M.-%</td><td className={td}>bestimmt direkt die CO₂-Speichermenge je kg</td></tr>
                        <tr><td className={td}><strong>Molares H/C-Verhältnis</strong></td><td className={td}>Stabilitätskriterium nach EBC: kleiner 0,7</td><td className={td}>Maß für den Anteil beständiger aromatischer Strukturen</td></tr>
                        <tr><td className={td}><strong>Wasseraufnahme</strong></td><td className={td}>häufig 100 bis 300 M.-% (stark von Rohstoff und Mahlfeinheit abhängig)</td><td className={td}>Wasseranspruch und innere Nachbehandlung</td></tr>
                        <tr><td className={td}><strong>Schüttdichte</strong></td><td className={td}>gering, etwa 150 bis 400 kg/m³</td><td className={td}>großes Volumen je kg; Staubentwicklung beim Dosieren</td></tr>
                        <tr><td className={td}><strong>pH-Wert</strong></td><td className={td}>alkalisch, etwa 8 bis 10</td><td className={td}>deutlich unter dem pH-Wert der Porenlösung (etwa 12,5 bis 13,5)</td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Permanenz: wie lange bleibt der Kohlenstoff gebunden?</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Für die Treibhausgasinventare gibt das IPCC (2019 Refinement) Permanenzfaktoren an – den Anteil des Kohlenstoffs, der nach 100 Jahren im Boden noch vorhanden ist. Für Beton liegen keine eigenen Normwerte vor; die Faktoren werden im Rechner daher als Richtwerte verwendet.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[420px]">
                      <thead><tr><th className={th}>Herstellung</th><th className={th}>F_perm (100 Jahre)</th></tr></thead>
                      <tbody>
                        {F_PERM_IPCC.map(f => <tr key={f.id}><td className={td}>{f.label}</td><td className={td}>{formatDeZahl(f.wert, 2)}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-text-main/60 leading-relaxed flex items-start gap-1.5">
                    <Info size={13} className="shrink-0 mt-0.5" /> Im alkalischen, sauerstoffarmen Zementstein ist ein langsamerer Abbau als im Boden plausibel, aber nicht allgemein belegt. Entscheidend ist außerdem das Lebensende: Wird Betonbruch als Gesteinskörnung wiederverwendet, bleibt der Kohlenstoff gebunden; wird er thermisch behandelt, geht der Speicher verloren.
                  </p>
                </section>
              </div>
            )}

            {/* ───────────── 3. WIRKUNG IM BETON ───────────── */}
            {reiter === 'wirkung' && (
              <div className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Wasseranspruch und Porosität</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Die offene Porenstruktur der Kohle saugt Anmachwasser auf. Ungesättigt zugegeben, entzieht sie dem Frischbeton Wasser: Die Konsistenz steift an, der wirksame w/z-Wert sinkt unkontrolliert. Üblich ist deshalb, die Kohle <strong>vorzunässen</strong> oder das aufgesaugte Wasser als Zusatzwasser zu berücksichtigen, das nicht zum Wirkwasser zählt.
                    Das gespeicherte Wasser kann später als <strong>innere Nachbehandlung</strong> wirken und das Schwinden mindern. Gleichzeitig bringt die Kohle zusätzliche Poren in das Gefüge.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                    <BlockMath math="w_{vor} = m_{PK} \cdot \frac{W_{PK}}{100\,\%}, \qquad \left(\frac{w}{z}\right)_{neu} = \frac{w_{eff}}{z_{ref} - \Delta z}" />
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Festigkeit</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Bei kleinen Zugaben berichten Studien teils unveränderte oder leicht erhöhte Druckfestigkeiten (Füllereffekt, innere Nachbehandlung, Keimbildung), bei höheren Gehalten deutliche Verluste durch zusätzliche Porosität und den geringeren Bindemittelanteil. Die Grenze hängt von Rohstoff, Mahlfeinheit und Vornässung ab und ist im Einzelfall durch Eignungsprüfungen zu bestimmen.
                  </p>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Karbonatisierung und pH-Wert</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-text-main/80 leading-relaxed">
                    <li>Die Pflanzenkohle selbst ist alkalisch, liegt aber unter dem pH-Wert der Porenlösung. Den Korrosionsschutz der Bewehrung liefert weiterhin allein das Calciumhydroxid des Zementsteins.</li>
                    <li><strong>Wird Zement durch Kohle ersetzt</strong>, sinkt die Menge an karbonatisierbarem Calciumhydroxid (Pufferkapazität). Zusätzliche Poren erleichtern die CO₂-Diffusion. Beides spricht für eine schnellere Karbonatisierung.</li>
                    <li>Gegenläufig kann die innere Nachbehandlung das Gefüge verdichten. Die Literaturbefunde sind uneinheitlich – der Karbonatisierungswiderstand ist daher je Rezeptur zu prüfen, etwa im Schnellverfahren nach DIN EN 12390-12.</li>
                    <li><strong>Prüfpraxis:</strong> Auf dunkler Matrix ist der Farbumschlag von Phenolphthalein schwer abzulesen. Frische Bruchflächen, gute Beleuchtung und eine Fotodokumentation helfen.</li>
                  </ul>
                  <Querverweis ziel="schnellkarbonatisierung" titel="Karbonatisierungswiderstand prüfen" linkText="Zum Modul Schnellkarbonatisierung">
                    <p>Prüfverfahren mit 3 % CO₂, Auswertung des Karbonatisierungskoeffizienten aus Messwerten und eine Prognose gegenüber der Betondeckung zeigt das Modul Schnellkarbonatisierung nach DIN EN 12390-12.</p>
                  </Querverweis>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-text-main">Dunkle Matrix: Ästhetik und Pigmentwirkung</h3>
                  <p className="text-sm text-text-main/80 leading-relaxed">
                    Fein gemahlener Kohlenstoff wirkt wie ein Schwarzpigment: Schon geringe Dosierungen färben den Zementstein grau bis anthrazit. Das wird gestalterisch genutzt, verlangt bei Sichtbeton aber eine konstante Dosierung, Mahlfeinheit und Mischzeit, damit der Farbton gleichmäßig bleibt. Pflanzenkohle ist kein Pigment nach DIN EN 12878; ihre Farbwirkung und -beständigkeit sind daher projektbezogen zu bemustern.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-text-main/80">
                    <li>Kalkausblühungen und Wolkenbildung fallen auf dunklem Grund stärker auf.</li>
                    <li>Dunkle Oberflächen absorbieren mehr Sonnenstrahlung: höhere Oberflächentemperaturen und Temperaturspannungen in besonnten Bauteilen.</li>
                    <li>Die dunkle Färbung durchzieht den gesamten Querschnitt – anders als eine Lasur bleibt sie bei Abrieb erhalten.</li>
                  </ul>
                  <Querverweis ziel="sichtbeton" titel="Farbtongleichmäßigkeit bei Sichtbeton" linkText="Zum Modul Sichtbeton">
                    <p>Anforderungen an Farbtongleichmäßigkeit, Musterflächen und Sichtbetonklassen SB 1 bis SB 4 behandelt das Modul Sichtbeton.</p>
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
                    {eingabe('Dosierung m_PK (Trockenmasse)', mPK, setMPK, 'kg/m³', '1')}
                    {eingabe('Kohlenstoffgehalt w_C', cGehalt, setCGehalt, 'M.-%', '1')}
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-main">Permanenzfaktor F_perm (IPCC-Richtwert)</span>
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
                    {eingabe('Herstellungsemission e_PK (Richtwert)', ePK, setEPK, 'kg CO₂e/kg', '0.05')}
                    {eingabe('Wasseraufnahme der Kohle W_PK', wAufnahme, setWAufnahme, 'M.-%', '10')}
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider pt-2">Bindemittel</h3>
                    {eingabe('Zementgehalt der Referenz z_ref', zRef, setZRef, 'kg/m³', '5')}
                    {eingabe('Zementreduktion Δz (0 = reine Zugabe)', deltaZ, setDeltaZ, 'kg/m³', '5')}
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-text-main">Treibhauspotenzial des Zements</span>
                      <select
                        aria-label="Zementart"
                        value={String(gwpZ)}
                        onChange={e => setGwpZ(zahl(e.target.value))}
                        className="p-2 border border-home-grau/50 rounded-lg bg-white text-sm focus:outline-none focus:border-shiraz"
                      >
                        {ZEMENTE.map(z => <option key={z.id} value={String(z.gwp)}>{z.label}</option>)}
                      </select>
                    </label>
                    {eingabe('Wirksamer Wassergehalt w_eff', w, setW, 'kg/m³', '5')}
                  </div>
                  <EingabeHinweise hinweise={erg.hinweise} />
                </div>

                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs text-text-main/60 font-bold uppercase tracking-wide">Minderung gegenüber Referenz</div>
                        <div className="text-3xl font-black text-shiraz font-mono">{formatDeZahl(erg.minderung, 1)} <span className="text-base">kg CO₂e/m³</span></div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-text-main/60 font-bold uppercase tracking-wide">bezogen auf den Zementanteil</div>
                        <div className="text-2xl font-black text-text-main font-mono">{formatDeZahl(erg.minderungProzent, 1)} %</div>
                      </div>
                    </div>

                    {/* Balkenvergleich je m³ */}
                    <div className="flex flex-col gap-2 text-[11px] text-text-main/80" aria-label="Vergleich der Treibhauspotenziale je m³">
                      {[
                        { l: 'Referenz: Zement', w: erg.gwpRef, f: 'bg-slate-500' },
                        { l: 'Variante: Zement', w: erg.zNeu * gwpZ, f: 'bg-slate-400' },
                        { l: 'Herstellung Pflanzenkohle', w: erg.ePK, f: 'bg-amber-500' },
                        { l: 'gespeichertes CO₂ (Gutschrift)', w: erg.co2Speicher, f: 'bg-emerald-600' },
                        { l: 'Variante netto', w: erg.gwpNeu, f: 'bg-shiraz' },
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
                        { l: 'CO₂ im Kohlenstoff', w: formatDeZahl(erg.co2Brutto, 1), e: 'kg/m³' },
                        { l: 'Netto-Senke Kohle', w: formatDeZahl(erg.nettoPK, 1), e: 'kg/m³' },
                        { l: 'entspricht Zement', w: formatDeZahl(zAequivalent, 0), e: 'kg/m³' },
                        { l: 'Dosierung bez. Zement', w: formatDeZahl(erg.dosierungZ, 1), e: 'M.-%' },
                        { l: 'Vornässwasser', w: formatDeZahl(erg.wVornass, 1), e: 'kg/m³' },
                        { l: 'w/z Referenz', w: formatDeZahl(erg.wzRef, 2), e: '' },
                        { l: 'w/z Variante', w: formatDeZahl(erg.wzNeu, 2), e: '' },
                        { l: 'Zement Variante', w: formatDeZahl(erg.zNeu, 0), e: 'kg/m³' },
                      ].map(k => (
                        <div key={k.l} className="p-3 rounded-lg border border-home-grau/30 bg-off-white">
                          <div className="text-[10px] text-text-main/60 font-bold">{k.l}</div>
                          <div className="font-mono font-bold text-text-main text-sm">{k.w} <span className="text-[10px] text-text-main/60">{k.e}</span></div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-text-main/60 leading-relaxed">
                      Bilanziert wird nur der Zement- und Pflanzenkohleanteil je m³ (Lehrmodell). Gesteinskörnung, Transport, Nutzung und Lebensende fehlen; für Nachweise sind EPD-Daten nach DIN EN 15804 und die Festigkeit der geänderten Rezeptur maßgebend.
                    </p>
                  </div>

                  <FormulaDerivationBox
                    live
                    title="Ihr Rechenweg: CO₂-Bilanz je m³ Beton"
                    zielGleichung="\Delta GWP = \Delta z \cdot GWP_Z + m_{PK} \cdot \left(w_C \cdot \tfrac{44}{12} \cdot F_{perm} - e_{PK}\right)"
                    schritte={[
                      {
                        titel: 'Kohlenstoff als CO₂',
                        erklaerung: 'Masse Kohlenstoff mal Verhältnis der molaren Massen 44/12:',
                        formel: `m_{PK} \\cdot w_C \\cdot \\tfrac{44}{12} = ${tex(mPK, 1)} \\cdot ${tex(cGehalt / 100, 2)} \\cdot ${tex(CO2_JE_C, 3)} = ${tex(erg.co2Brutto, 2)}\\,\\tfrac{\\text{kg}}{\\text{m}^3}`,
                      },
                      {
                        titel: 'Permanenzabschlag',
                        erklaerung: 'Nur der langfristig gebundene Anteil wird angerechnet:',
                        formel: `C_{PK} = ${tex(erg.co2Brutto, 2)} \\cdot ${tex(fPerm, 2)} = ${tex(erg.co2Speicher, 2)}\\,\\tfrac{\\text{kg}}{\\text{m}^3}`,
                      },
                      {
                        titel: 'Herstellungsemission abziehen',
                        erklaerung: 'Pyrolyse, Aufbereitung und Transport der Kohle (Richtwert):',
                        formel: `C_{PK} - m_{PK} \\cdot e_{PK} = ${tex(erg.co2Speicher, 2)} - ${tex(mPK, 1)} \\cdot ${tex(ePK, 2)} = ${tex(erg.nettoPK, 2)}\\,\\tfrac{\\text{kg}}{\\text{m}^3}`,
                      },
                      {
                        titel: 'Zementreduktion',
                        erklaerung: 'Vermiedene Emission durch weniger Zement:',
                        formel: `E_Z = \\Delta z \\cdot GWP_Z = ${tex(deltaZ, 0)} \\cdot ${tex(gwpZ, 2)} = ${tex(erg.eZement, 2)}\\,\\tfrac{\\text{kg}}{\\text{m}^3}`,
                      },
                      {
                        titel: 'Minderung gesamt',
                        erklaerung: 'Summe aus Zementeinsparung und Netto-Senke, bezogen auf den Zementanteil der Referenz:',
                        formel: `\\Delta GWP = ${tex(erg.eZement, 2)} + ${tex(erg.nettoPK, 2)} = ${tex(erg.minderung, 2)}\\,\\tfrac{\\text{kg}}{\\text{m}^3} \\;\\hat{=}\\; ${tex(erg.minderungProzent, 1)}\\,\\%\\ \\text{von}\\ ${tex(erg.gwpRef, 1)}`,
                      },
                    ]}
                    ergebnisHinweis="Je kg Pflanzenkohle mit 80 % Kohlenstoff werden rechnerisch rund 2,9 kg CO₂ gebunden – vor Permanenzabschlag und Herstellungsemission."
                    normQuelle="Stöchiometrie; Permanenzfaktoren nach IPCC 2019 Refinement (Richtwerte); Bilanzrahmen DIN EN 15804"
                  />
                </div>
              </div>
            )}

            {/* ───────────── 5. GRENZEN & REGELWERK ───────────── */}
            {reiter === 'grenzen' && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Bilanzierung über den Lebenszyklus</h3>
                    In einer EPD nach DIN EN 15804 wird biogener Kohlenstoff bei der Herstellung als Aufnahme (negativ) und am Lebensende als Abgabe ausgewiesen, wenn er dort freigesetzt wird. Eine dauerhafte Senke ergibt sich nur, wenn der Kohlenstoff auch nach dem Rückbau gebunden bleibt. Die Gutschrift im Rechner entspricht daher einer Annahme über das Lebensende.
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Herkunft und Qualität der Kohle</h3>
                    Die Senke setzt nachhaltig erzeugte Biomasse voraus, die nicht mit Nahrungsmitteln oder dem Humusaufbau im Boden konkurriert. Pflanzenkohle kann Schadstoffe wie polyzyklische aromatische Kohlenwasserstoffe (PAK) enthalten; Zertifizierungsrichtlinien wie die EBC-Richtlinien legen dafür Grenzwerte fest.
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Normative Einordnung</h3>
                    Pflanzenkohle ist weder Zement nach DIN EN 197-1 noch ein Betonzusatzstoff mit k-Wert nach DIN EN 206 und DIN 1045-2. Sie wird bei w/z-Wert und Mindestzementgehalt nicht angerechnet. Für nicht genormte Ausgangsstoffe kann bei bauaufsichtlich relevanter Verwendung eine allgemeine bauaufsichtliche Zulassung (abZ) oder eine Zustimmung im Einzelfall (ZiE) erforderlich sein.
                  </div>
                  <div className="p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed">
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Offene Fragen der Forschung</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Langzeitbeständigkeit des Kohlenstoffs im Zementstein und nach dem Recycling.</li>
                      <li>Einfluss auf Karbonatisierung, Chlorideindringen und Frostwiderstand je Rezeptur.</li>
                      <li>Wechselwirkung mit Fließmitteln und Luftporenbildnern (Adsorption an der großen Oberfläche).</li>
                      <li>Gleichmäßigkeit von Festigkeit und Farbton bei schwankender Kohlequalität.</li>
                    </ul>
                  </div>
                </div>
                <Querverweis ziel="innovative_werkstoffe" titel="Weitere Entwicklungen" linkText="Zum Modul Entwicklungen">
                  <p>Geopolymere, CO₂-reduzierte Bindemittel und weitere Ansätze zur CO₂-Senke im Bauwesen sind im Modul Entwicklungen zusammengestellt.</p>
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
          title="Beispiel: Wie viel Zement „ersetzt“ 1 kg Pflanzenkohle in der Bilanz?"
          zielGleichung="z_{\ddot{a}q} = \frac{w_C \cdot \frac{44}{12} \cdot F_{perm} - e_{PK}}{GWP_Z}"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Kohle mit 80 % Kohlenstoff, F_perm = 0,80, Herstellung 0,3 kg CO₂e/kg; CEM I mit 0,80 kg CO₂e/kg (Richtwerte):', formel: 'w_C = 0{,}80, \\quad F_{perm} = 0{,}80, \\quad e_{PK} = 0{,}3, \\quad GWP_Z = 0{,}80' },
            { titel: 'Netto-Senke je kg Kohle', erklaerung: 'Gespeichertes CO₂ abzüglich Herstellung:', formel: '0{,}80 \\cdot 3{,}667 \\cdot 0{,}80 - 0{,}3 = 2{,}347 - 0{,}3 = 2{,}05\\,\\text{kg CO}_2' },
            { titel: 'Äquivalente Zementmenge', erklaerung: 'Netto-Senke geteilt durch das Treibhauspotenzial des Zements:', formel: 'z_{\\ddot{a}q} = \\frac{2{,}05}{0{,}80} = 2{,}56\\,\\text{kg Zement je kg Kohle}' },
            { titel: 'Einordnung', erklaerung: '10 kg/m³ Pflanzenkohle wirken in der Bilanz wie rund 26 kg/m³ weniger CEM I – ohne den Mindestzementgehalt zu berühren:', formel: '10 \\cdot 2{,}05 = 20{,}5\\,\\tfrac{\\text{kg CO}_2}{\\text{m}^3} \\approx 25{,}6\\,\\tfrac{\\text{kg}}{\\text{m}^3}\\ \\text{CEM I}' },
          ]}
          ergebnisHinweis="Die Bilanz reagiert empfindlich auf F_perm und e_PK. Ohne Permanenzabschlag und mit kleiner Herstellungsemission verdoppelt sich die Wirkung beinahe – deshalb sind die Annahmen offenzulegen."
          normQuelle="Lehrbeispiel; Richtwerte nach IPCC 2019 Refinement und Fachliteratur"
        />
      </div>

      <ModulTest moduleId="biokohlebeton" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 6.2: Modul neu erstellt; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Pflanzenkohle', url: 'https://de.wikipedia.org/wiki/Pflanzenkohle' },
          { title: 'Pyrolyse', url: 'https://de.wikipedia.org/wiki/Pyrolyse' },
        ]}
        literatur={[
          'Lehmann, J.; Joseph, S. (Hrsg.): Biochar for Environmental Management – Science, Technology and Implementation. 2. Aufl., London: Routledge 2015',
          'IPCC: 2019 Refinement to the 2006 IPCC Guidelines for National Greenhouse Gas Inventories, Vol. 4, Kap. 2, Appendix 4 (Biochar). Genf: IPCC 2019',
          'Gupta, S.; Kua, H. W.: Factors determining the potential of biochar as a carbon capturing and sequestering construction material: critical review. Journal of Materials in Civil Engineering 29 (2017) 9, 04017086',
          'Gupta, S.; Kua, H. W.; Low, C. Y.: Use of biochar as carbon sequestering additive in cement mortar. Cement and Concrete Composites 87 (2018), S. 110–129',
          'European Biochar Certificate (EBC): Guidelines for a Sustainable Production of Biochar. Laufend fortgeschriebene, öffentlich zugängliche Richtlinie',
        ]}
        weblinks={[{ title: 'EBC-Richtlinien (öffentlich)', url: 'https://www.european-biochar.org' }]}
        regelwerke={[
          'DIN_EN_206',
          'DIN_EN_15804',
          { title: 'DIN EN 197-1:2011-11 (Zement - Teil 1: Zusammensetzung, Anforderungen und Konformitätskriterien von Normalzement)' },
          { title: 'DIN EN 12390-12:2020-04 (Prüfung von Festbeton - Teil 12: Bestimmung des Karbonatisierungswiderstandes von Beton - Beschleunigtes Karbonatisierungsverfahren)' },
        ]}
        formeln={[
          { formel: 'm_{\\mathrm{CO_2}} = m_{PK} \\cdot w_C \\cdot \\frac{44}{12} \\cdot F_{perm}', erklaerung: 'Im Kohlenstoff der Pflanzenkohle gebundenes CO₂ mit Permanenzabschlag.', quelle: 'Stöchiometrie; F_perm nach IPCC 2019 Refinement' },
          { formel: '\\Delta GWP = \\Delta z \\cdot GWP_Z + m_{PK} \\cdot \\left(w_C \\cdot \\tfrac{44}{12} \\cdot F_{perm} - e_{PK}\\right)', erklaerung: 'Minderung des Treibhauspotenzials je m³ aus Zementreduktion und Netto-Senke der Pflanzenkohle (Lehrmodell).' },
          { formel: 'w_{vor} = m_{PK} \\cdot W_{PK}', erklaerung: 'Vornässwasser aus der Wasseraufnahme der Kohle; zählt nicht zum wirksamen Wasser.' },
        ]}
      />
    </div>
  );
}
