import React, { useMemo, useState } from 'react';
import { Sun, BookOpen, Table2, Calculator, ClipboardList, Plus, Trash2, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import {
  sonneneintrag, fcAusTabelle, SONNENSCHUTZ, S1_TABELLE, S2_KOEFF, S6_PASSIV, ORIENTIERUNGEN, ORIENTIERUNG_NAME,
  BEZUGSTEMPERATUR, UEBERTEMPERATURGRADSTUNDEN, type Fenster, type Nutzung, type Klimaregion, type Bauart, type Nachtlueftung, type Orientierung,
} from '@/src/calc/sommerWaermeschutz';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

type Reiter = 'einfuehrung' | 'grundlagen' | 'kennwerte' | 'rechner' | 'beispiele';
const REITER = [
  { id: 'einfuehrung' as const, label: 'Einführung', icon: Sun },
  { id: 'grundlagen' as const, label: 'Grundlagen', icon: BookOpen },
  { id: 'kennwerte' as const, label: inhalt.werte.kennwerteTabellen, icon: Table2 },
  { id: 'rechner' as const, label: 'Rechner', icon: Calculator },
  { id: 'beispiele' as const, label: 'Beispiele', icon: ClipboardList },
];

const NUTZUNG_NAME: Record<Nutzung, string> = { wohn: 'Wohngebäude', nichtwohn: 'Nichtwohngebäude' };
const BAUART_NAME: Record<Bauart, string> = { leicht: 'leicht', mittel: 'mittel', schwer: 'schwer' };
const NL_NAME: Record<Nachtlueftung, string> = { ohne: 'ohne', erhoeht: inhalt.werte.erhöhtN2H, hoch: inhalt.werte.hochN5H };
const REGION_NAME: Record<Klimaregion, string> = { A: inhalt.werte.aSommerkühl, B: inhalt.werte.bGemäßigt, C: inhalt.werte.cSommerheiß };

interface FensterZeile extends Fenster { id: string }
const STANDARD_FENSTER: FensterZeile[] = [
  { id: 'f1', name: 'Fenster Süd', A: 6, g: 0.59, scheiben: 2, orientierung: 'S', neigung: 90, schutz: 'rollladen_34' },
  { id: 'f2', name: inhalt.werte.fensterWest, A: 5, g: 0.59, scheiben: 2, orientierung: 'W', neigung: 90, schutz: 'rollladen_34' },
];

const karte = 'bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30';
const feld = 'w-full text-xs p-1.5 border border-slate-200 bg-white rounded-lg text-slate-800';
const z3 = (x: number) => formatDeZahl(x, 3);
const t3 = (x: number) => formatDeTeX(x, 3);
const t2 = (x: number) => formatDeTeX(x, 2);

export default function SommerlicherWaermeschutz() {
  const [reiter, setReiter] = useState<Reiter>('einfuehrung');
  const [nutzung, setNutzung] = useState<Nutzung>('wohn');
  const [region, setRegion] = useState<Klimaregion>('B');
  const [bauart, setBauart] = useState<Bauart>('mittel');
  const [nachtlueftung, setNachtlueftung] = useState<Nachtlueftung>('erhoeht');
  const [passiv, setPassiv] = useState(false);
  const [AG, setAG] = useState(25);
  const [fenster, setFenster] = useState<FensterZeile[]>(STANDARD_FENSTER);

  const erg = useMemo(
    () => sonneneintrag({ nutzung, region, bauart, nachtlueftung, passiveKuehlung: passiv, AG, fenster }),
    [nutzung, region, bauart, nachtlueftung, passiv, AG, fenster],
  );

  const aendere = (i: number, teil: Partial<Fenster>) => setFenster(fs => fs.map((f, j) => (j === i ? { ...f, ...teil } : f)));
  const zahl = (s: string) => (s.trim() === '' ? NaN : parseFloat(s.replace(',', '.')));
  const neuesFenster = () => setFenster(fs => [...fs, { id: `f${Date.now()}`, name: `Fenster ${fs.length + 1}`, A: 2, g: 0.5, scheiben: 3, orientierung: 'O', neigung: 90, schutz: 'raffstore_45' }]);

  // Live-Rechenweg (aktuelle Eingaben)
  const gtotTeX = erg.gueltig
    ? `\\begin{gathered} ${erg.fenster.map((f, i) => `g_{tot,${i + 1}} = ${t2(f.g)} \\cdot ${t2(f.fc)} = ${t3(f.gtot)}`).join(' \\\\ ')} \\end{gathered}`
    : '\\text{–}';
  const summeTeX = erg.gueltig ? erg.fenster.map(f => `${t2(f.A)} \\cdot ${t3(f.gtot)}`).join(' + ') : '\\text{–}';
  const { a: a2, b: b2 } = S2_KOEFF[nutzung];

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className={karte}>
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Sun className="w-5 h-5 text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.sommerlicherWärmeschutzDin4108} /></h2>
        <p className="text-xs text-text-main/60 font-mono mt-1"><MdText text={inhalt.texte.sonneneintragskennwertVerfahrenNachDin} /></p>
        <p className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          Neubauten müssen so geplant werden, dass sich Aufenthaltsräume im Sommer ohne Klimaanlage nicht unzumutbar aufheizen.
          Der Nachweis vergleicht den <strong><MdText text={inhalt.texte.vorhandenenSonneneintragskennwert} /></strong> des kritischen Raums mit einem
          <strong><MdText text={inhalt.texte.zulässigenWert} /></strong>, der von Klimaregion, Bauart, Nachtlüftung und Fenstereigenschaften abhängt.
        </p>
      </div>

      <ModuleTabs label={inhalt.werte.bereicheSommerlicherWärmeschutz} tabs={REITER} aktiv={reiter} onWechsel={setReiter}
        className="[&>[role=tablist]]:mb-5">

        {reiter === 'einfuehrung' && (
          <div className="space-y-5">
            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.zielUndRechtlicheAnforderung} /></h3>
              <div className="text-sm text-text-main/85 leading-relaxed space-y-2">
                <p><MdText text={inhalt.texte.nach14Abs1} /></p>
                <p><MdText text={inhalt.texte.ausreichendIstDerSommerliche} /></p>
                <p><MdText text={inhalt.texte.wirdEinWohngebäudeMit} /></p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {inhalt.daten.SommerlicherWaermeschutz.map(k => (
                <div key={k.t} className="p-4 rounded-xl border border-home-grau/30 bg-off-white text-sm">
                  <div className="font-bold text-shiraz mb-1">{k.t}</div>
                  <p className="text-text-main/80 text-xs leading-relaxed"><FormulaText text={k.d} /></p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-950 leading-relaxed flex gap-2">
              <Info size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
              <span><MdText text={inhalt.texte.normenstand14GmodgVerweist} /></span>
            </div>
            <Querverweis ziel="bauphysik" titel={inhalt.werte.phasenverschiebungUndTemperaturamplitude} linkText={inhalt.werte.zumModulBauphysik}>
              <p><MdText text={inhalt.texte.dieTrägheitEinzelnerBauteile} /></p>
            </Querverweis>
          </div>
        )}

        {reiter === 'grundlagen' && (
          <div className="space-y-5">
            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.vorhandenerSonneneintragskennwert} /></h3>
              <BlockMath math="S_{vorh} = \frac{\sum_j A_{w,j} \cdot g_{tot,j}}{A_G}, \qquad g_{tot} = g \cdot F_C" />
              <ul className="text-sm text-text-main/85 leading-relaxed list-disc pl-5 space-y-1 mt-2">
                <li><FormulaText text={inhalt.werte.aWJFensterfläche} /></li>
                <li><FormulaText text={inhalt.werte.gGesamtenergiedurchlassgradDerVerglasung} /></li>
                <li><FormulaText text={inhalt.werte.fCAbminderungsfaktorDer} /></li>
                <li><FormulaText text={inhalt.werte.aGNettogrundflächeDes} /></li>
              </ul>
              <p className="text-sm text-text-main/80 mt-3"><MdText text={inhalt.texte.nachzuweisenIstDerKritische} /></p>
            </div>
            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.zulässigerSonneneintragskennwert} /></h3>
              <BlockMath math="S_{zul} = \sum_x S_x = S_1 + S_2 + S_3 + S_4 + S_5 + S_6" />
              <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.dieAnteiligenKennwerteNach} /><FormulaText text="$S_1$" /><MdText text={inhalt.texte.klimaregionBauartUndNachtlüftung} /><FormulaText text=" $S_2$" /><MdText text={inhalt.texte.korrekturFürDenGrundflächenbezogenen} /><FormulaText text=" $S_3$" /> Sonnenschutzglas; <FormulaText text=" $S_4$" /><MdText text={inhalt.texte.geneigteFenster} /><FormulaText text=" $S_5$" /><MdText text={inhalt.texte.nordorientierungOderDauerndeEigenverscha} /><FormulaText text=" $S_6$" /><MdText text={inhalt.texte.passiveKühlungBeiUnterschiedlichen} /></p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className={karte}>
                <h4 className="font-bold text-text-main mb-2 text-sm"><MdText text={inhalt.texte.sommerklimaregionenABC} /></h4>
                <p className="text-xs text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.dieKarteInAbschnitt} />{formatDeZahl(BEZUGSTEMPERATUR.A, 0)}<MdText text={inhalt.texte.cBGemäßigt} />{formatDeZahl(BEZUGSTEMPERATUR.B, 0)}<MdText text={inhalt.texte.cCSommerheiß} />{formatDeZahl(BEZUGSTEMPERATUR.C, 0)}<MdText text={inhalt.texte.cDieHöherenBezugswerte} /></p>
              </div>
              <div className={karte}>
                <h4 className="font-bold text-text-main mb-2 text-sm"><MdText text={inhalt.texte.bauartUndWirksameWärmespeicherfähigkeit} /></h4>
                <p className="text-xs text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.speicherfähigeBauteileNehmenTagsüber} /><FormulaText text=" $C_{wirk}/A_G$" /><MdText text={inhalt.texte.leichtUnter50Mittel} /></p>
              </div>
              <div className={karte}>
                <h4 className="font-bold text-text-main mb-2 text-sm"><MdText text={inhalt.texte.nachtlüftungUndPassiveKühlung} /></h4>
                <p className="text-xs text-text-main/85 leading-relaxed">
                  Nächtliches Lüften entlädt die Speichermasse. <strong>Erhöhte</strong> Nachtlüftung (n ≥ 2 h⁻¹, zweite Nachthälfte) darf bei
                  Wohnnutzung in der Regel angesetzt werden, ebenso mit einer entsprechend ausgelegten Lüftungsanlage. <strong>Hohe</strong>
                  Nachtlüftung (n ≥ 5 h⁻¹) setzt geschossübergreifende Querlüftung (Atrium, Treppenhaus, Galerie) oder eine passende Anlage voraus.
                  <strong><MdText text={inhalt.texte.passiveKühlung} /></strong> (S6) meint Systeme, die nur Energie für den Transport des Kühlmediums benötigen, etwa Bauteilaktivierung mit Erdreich.
                </p>
              </div>
            </div>
            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.thermischeGebäudesimulationAbschnitt8} /></h3>
              <p className="text-sm text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.fürRäumeAufDie} />{formatDeZahl(UEBERTEMPERATURGRADSTUNDEN.wohn, 0)}<MdText text={inhalt.texte.khAFürWohngebäude} />{formatDeZahl(UEBERTEMPERATURGRADSTUNDEN.nichtwohn, 0)}<MdText text={inhalt.texte.khAFürNichtwohngebäude} /></p>
              <BlockMath math="\sum_{t} \max\left(0;\; \theta_{op}(t) - \theta_{b,op}\right) \cdot 1\,\text{h} \;\le\; 1200\,\text{Kh/a (Wohnen)}" />
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.beispiel1200Kh} /></p>
            </div>
            <Querverweis ziel="feuchteschutz" titel={inhalt.werte.winterlicherWärmeUndFeuchteschutz} linkText={inhalt.werte.zumModulFeuchteschutz}>
              <p><MdText text={inhalt.texte.din41082Regelt} /></p>
            </Querverweis>
          </div>
        )}

        {reiter === 'kennwerte' && (
          <div className="space-y-5">
            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.tab6FensterflächenanteilBis} /></h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead><tr className="bg-off-white text-left"><th className="p-2 border"><MdText text={inhalt.texte.neigungGegenüberDerHorizontalen} /></th><th className="p-2 border">Orientierung</th><th className="p-2 border text-right">f_WG</th></tr></thead>
                  <tbody>
                    <tr><td className="p-2 border" rowSpan={2}><MdText text={inhalt.texte.über60Bis90} /></td><td className="p-2 border"><MdText text={inhalt.texte.nordwestÜberSüdBis} /></td><td className="p-2 border text-right">10 %</td></tr>
                    <tr><td className="p-2 border"><MdText text={inhalt.texte.alleAnderenNordorientierungen} /></td><td className="p-2 border text-right">15 %</td></tr>
                    <tr><td className="p-2 border"><MdText text={inhalt.texte.von0Bis60} /></td><td className="p-2 border"><MdText text={inhalt.texte.alleOrientierungen} /></td><td className="p-2 border text-right">7 %</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-text-main/75 mt-2 leading-relaxed">
                <FormulaText text={inhalt.werte.fWgAW} /><MdText text={inhalt.texte.mitDerSummeAller} /><FormulaText text="$F_C \le 0{,}30$" /><MdText text={inhalt.texte.glasG040} /><FormulaText text=" $F_C \le 0{,}35$" /><MdText text={inhalt.texte.g040Haben} /></p>
            </div>

            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.tab7AnhaltswerteFür} /></h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-off-white text-left">
                      <th className="p-2 border"><MdText text={inhalt.texte.sonnenschutzvorrichtungFestInstalliert} /></th>
                      <th className="p-2 border text-right"><MdText text={inhalt.texte.g040Zweifach} /></th>
                      <th className="p-2 border text-right"><MdText text={inhalt.texte.g040Dreifach} /></th>
                      <th className="p-2 border text-right"><MdText text={inhalt.texte.g040Zweifach2} /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {SONNENSCHUTZ.map(z => (
                      <tr key={z.id} className={z.nurInfo ? 'text-text-main/50' : ''}>
                        <td className="p-2 border">{z.name}</td>
                        {z.fc.map((v, i) => <td key={i} className="p-2 border text-right font-mono">{formatDeZahl(v, 2)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-text-main/75 mt-2 leading-relaxed">
                Dekorative Vorhänge zählen nicht als Sonnenschutz. Werte für geschlossene Rollläden und 10°-Lamellen dienen nur der Information – der Raum wäre
                verdunkelt. Für innenliegenden Schutz empfiehlt die Norm eine genaue Ermittlung. Vordächer und Markisen allgemein gelten nur, wenn keine direkte
                Besonnung des Fensters erfolgt (u. a. Abdeckwinkel ≥ 50° bei Südorientierung).
                <strong> Hinweis:</strong> Bei innenliegendem Schutz geben Sekundärquellen die Spalten zwei- und dreifach unterschiedlich wieder; der Normtext ist maßgebend.
              </p>
            </div>

            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2"><MdText text={inhalt.texte.tab8AnteiligeSonneneintragskennwerte} /></h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-off-white">
                      <th className="p-2 border text-left" rowSpan={2}><MdText text={inhalt.texte.s1Nachtlüftung} /></th><th className="p-2 border text-left" rowSpan={2}>Bauart</th>
                      <th className="p-2 border" colSpan={3}>Wohngebäude</th><th className="p-2 border" colSpan={3}>Nichtwohngebäude</th>
                    </tr>
                    <tr className="bg-off-white">{['A', 'B', 'C', 'A', 'B', 'C'].map((r, i) => <th key={i} className="p-2 border">{r}</th>)}</tr>
                  </thead>
                  <tbody>
                    {(['ohne', 'erhoeht', 'hoch'] as const).flatMap(nl => (['leicht', 'mittel', 'schwer'] as const).map((ba, k) => (
                      <tr key={nl + ba}>
                        {k === 0 && <td className="p-2 border" rowSpan={3}>{NL_NAME[nl]}</td>}
                        <td className="p-2 border">{BAUART_NAME[ba]}</td>
                        {(['wohn', 'nichtwohn'] as const).flatMap(n => (['A', 'B', 'C'] as const).map(r => (
                          <td key={n + r} className="p-2 border text-right font-mono">{z3(S1_TABELLE[n][r][nl][ba])}</td>
                        )))}
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs text-text-main/85">
                <div className="p-3 rounded-xl bg-off-white border border-home-grau/30"><FormulaText text="$S_2 = a - b \cdot f_{WG}$: Wohngebäude $a = 0{,}060$, $b = 0{,}231$; Nichtwohngebäude $a = 0{,}030$, $b = 0{,}115$" /></div>
                <div className="p-3 rounded-xl bg-off-white border border-home-grau/30"><FormulaText text="$S_3 = 0{,}03$ bei Sonnenschutzglas mit $g \le 0{,}40$" /></div>
                <div className="p-3 rounded-xl bg-off-white border border-home-grau/30"><FormulaText text="$S_4 = -0{,}035 \cdot f_{neig}$ für Fenster mit 0° bis 60° Neigung, $f_{neig} = A_{W,neig}/A_{W,ges}$" /></div>
                <div className="p-3 rounded-xl bg-off-white border border-home-grau/30"><FormulaText text="$S_5 = +0{,}10 \cdot f_{nord}$ für Nord-, Nordost-, Nordwestfenster über 60° Neigung und dauernd eigenverschattete Fenster, $f_{nord} = A_{W,nord}/A_{W,ges}$" /></div>
                <div className="p-3 rounded-xl bg-off-white border border-home-grau/30 md:col-span-2">
                  <FormulaText text={`$S_6$ (passive Kühlung): leicht ${formatDeZahl(S6_PASSIV.leicht, 2)}, mittel ${formatDeZahl(S6_PASSIV.mittel, 2)}, schwer ${formatDeZahl(S6_PASSIV.schwer, 2)}`} />
                </div>
              </div>
              <p className="text-[11px] text-text-main/60 mt-3"><MdText text={inhalt.texte.wiedergabeNachKalksandsteinPlanungshandb} /></p>
            </div>
          </div>
        )}

        {reiter === 'rechner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-5">
              <div className={`${karte} space-y-3`}>
                <h3 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.gebäudeUndRaum} /></h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <label className="flex flex-col gap-1 font-semibold text-slate-700">Nutzung
                    <select className={feld} value={nutzung} onChange={e => setNutzung(e.target.value as Nutzung)}>
                      {(['wohn', 'nichtwohn'] as const).map(n => <option key={n} value={n}>{NUTZUNG_NAME[n]}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 font-semibold text-slate-700">Sommerklimaregion
                    <select className={feld} value={region} onChange={e => setRegion(e.target.value as Klimaregion)}>
                      {(['A', 'B', 'C'] as const).map(r => <option key={r} value={r}>{REGION_NAME[r]}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 font-semibold text-slate-700">Bauart
                    <select className={feld} value={bauart} onChange={e => setBauart(e.target.value as Bauart)}>
                      {(['leicht', 'mittel', 'schwer'] as const).map(b => <option key={b} value={b}>{BAUART_NAME[b]}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 font-semibold text-slate-700">Nachtlüftung
                    <select className={feld} value={nachtlueftung} onChange={e => setNachtlueftung(e.target.value as Nachtlueftung)}>
                      {(['ohne', 'erhoeht', 'hoch'] as const).map(n => <option key={n} value={n}>{NL_NAME[n]}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 font-semibold text-slate-700"><MdText text={inhalt.texte.nettogrundflächeAGM} /><input type="number" min="1" step="0.5" className={feld} value={Number.isFinite(AG) ? AG : ''} onChange={e => setAG(zahl(e.target.value))} />
                  </label>
                  <label className="flex items-center gap-2 font-semibold text-slate-700 mt-5">
                    <input type="checkbox" checked={passiv} onChange={e => setPassiv(e.target.checked)} className="accent-shiraz" /><MdText text={inhalt.texte.passiveKühlungS6} /></label>
                </div>
              </div>

              <div className={`${karte} space-y-3`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.fensterDesKritischenRaums} /></h3>
                  <button type="button" onClick={neuesFenster} className="px-3 py-1.5 bg-shiraz text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer">
                    <Plus size={14} aria-hidden="true" /><MdText text={inhalt.texte.fensterHinzufügen} /></button>
                </div>
                {fenster.map((f, i) => {
                  const fc = fcAusTabelle(f.schutz, f.g, f.scheiben);
                  return (
                    <div key={f.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <input aria-label={`Bezeichnung Fenster ${i + 1}`} className={`${feld} font-bold`} value={f.name ?? ''} onChange={e => aendere(i, { name: e.target.value })} />
                        <button type="button" onClick={() => setFenster(fs => fs.filter((_, j) => j !== i))} className="p-1.5 text-slate-500 hover:text-red-600 cursor-pointer" aria-label={`Fenster ${i + 1} entfernen`}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px]">
                        <label className="flex flex-col gap-0.5 text-slate-600">A_w [m²]
                          <input type="number" min="0" step="0.1" className={feld} value={Number.isFinite(f.A) ? f.A : ''} onChange={e => aendere(i, { A: zahl(e.target.value) })} />
                        </label>
                        <label className="flex flex-col gap-0.5 text-slate-600">g [–]
                          <input type="number" min="0.1" max="0.9" step="0.01" className={feld} value={Number.isFinite(f.g) ? f.g : ''} onChange={e => aendere(i, { g: zahl(e.target.value) })} />
                        </label>
                        <label className="flex flex-col gap-0.5 text-slate-600">Verglasung
                          <select className={feld} value={f.scheiben} onChange={e => aendere(i, { scheiben: Number(e.target.value) as 2 | 3 })}>
                            <option value={2}>zweifach</option><option value={3}>dreifach</option>
                          </select>
                        </label>
                        <label className="flex flex-col gap-0.5 text-slate-600">Orientierung
                          <select className={feld} value={f.orientierung} onChange={e => aendere(i, { orientierung: e.target.value as Orientierung })}>
                            {ORIENTIERUNGEN.map(o => <option key={o} value={o}>{ORIENTIERUNG_NAME[o]}</option>)}
                          </select>
                        </label>
                        <label className="flex flex-col gap-0.5 text-slate-600">Neigung [°]
                          <input type="number" min="0" max="90" step="5" className={feld} value={Number.isFinite(f.neigung) ? f.neigung : ''} onChange={e => aendere(i, { neigung: zahl(e.target.value) })} />
                        </label>
                      </div>
                      <div className="flex flex-wrap items-end gap-x-3 gap-y-2 text-[11px]">
                        <label className="flex flex-col gap-0.5 text-slate-600 flex-1 min-w-[14rem]"><MdText text={inhalt.texte.sonnenschutzTab7} /><select className={feld} value={f.schutz} onChange={e => aendere(i, { schutz: e.target.value })}>
                            {SONNENSCHUTZ.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                          </select>
                        </label>
                        <label className="flex items-center gap-1.5 text-slate-600 whitespace-nowrap pb-1.5">
                          <input type="checkbox" checked={!!f.verschattet} onChange={e => aendere(i, { verschattet: e.target.checked })} className="accent-shiraz" /> eigenverschattet
                        </label>
                        <div className="font-mono font-bold text-slate-800 whitespace-nowrap pb-1.5">
                          F_C = {formatDeZahl(fc, 2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <p className="text-[11px] text-text-main/60"><MdText text={inhalt.texte.neigung90SenkrechtesFassadenfenster} /></p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className={`${karte} space-y-3`}>
                <h3 className="font-bold text-text-main text-sm">Ergebnis</h3>
                <EingabeHinweise hinweise={erg.hinweise} />
                {erg.gueltig && (
                  <>
                    <div className="space-y-2">
                      {[
                        { l: 'S_vorh', v: erg.Svorh, c: erg.erfuellt ? 'bg-emerald-600' : 'bg-red-600' },
                        { l: 'S_zul', v: erg.Szul, c: 'bg-slate-500' },
                      ].map(x => {
                        const max = Math.max(erg.Svorh, erg.Szul, 0.01);
                        return (
                          <div key={x.l}>
                            <div className="flex justify-between text-xs font-bold text-slate-700"><FormulaText text={`$${x.l.replace('_', '_{')}}$`} /><span className="font-mono">{z3(x.v)}</span></div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${x.c}`} style={{ width: `${Math.max(0, x.v / max) * 100}%` }} /></div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${erg.erfuellt ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'}`}>
                      {erg.erfuellt ? <CheckCircle size={16} className="text-emerald-600 shrink-0" aria-hidden="true" /> : <AlertTriangle size={16} className="text-red-600 shrink-0" aria-hidden="true" />}
                      <span>
                        <strong>{erg.erfuellt ? inhalt.werte.nachweisErfüllt : inhalt.werte.nachweisNichtErfüllt}:</strong>{' '}
                        S_vorh = {z3(erg.Svorh)} {erg.erfuellt ? '≤' : '>'} S_zul = {z3(erg.Szul)}.
                        {!erg.erfuellt && inhalt.werte.wirksamSindAußenliegenderSonnenschutz}
                      </span>
                    </div>
                    <table className="w-full text-xs">
                      <tbody>
                        {[
                          ['f_{WG}', erg.fWG, inhalt.werte.fensterflächeGrundfläche],
                          ['S_1', erg.S1, `${NUTZUNG_NAME[nutzung]}, Region ${region}, ${BAUART_NAME[bauart]}, Nachtlüftung ${NL_NAME[nachtlueftung]}`],
                          ['S_2', erg.S2, 'Fensterflächenanteil'],
                          ['S_3', erg.S3, `Sonnenschutzglas (Anteil ${formatDeZahl(erg.fSSG * 100, 0)} %)`],
                          ['S_4', erg.S4, `geneigte Fenster (f_neig = ${formatDeZahl(erg.fNeig, 2)})`],
                          ['S_5', erg.S5, `Nord/verschattet (f_nord = ${formatDeZahl(erg.fNord, 2)})`],
                          ['S_6', erg.S6, passiv ? inhalt.werte.passiveKühlung : inhalt.werte.keinePassiveKühlung],
                        ].map(([s, v, t]) => (
                          <tr key={s as string} className="border-b border-slate-100">
                            <td className="py-1 pr-2"><FormulaText text={`$${s}$`} /></td>
                            <td className="py-1 pr-2 font-mono text-right">{z3(v as number)}</td>
                            <td className="py-1 text-[10.5px] text-slate-500">{t as string}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className={`p-3 rounded-xl border text-xs ${erg.verzicht.entbehrlich ? 'bg-sky-50 border-sky-200 text-sky-950' : 'bg-off-white border-home-grau/30 text-text-main/80'}`}><MdText text={inhalt.texte.nachweisverzichtNach82} />{formatDeZahl(erg.fWG * 100, 1)} % {erg.verzicht.tab6 ? '≤' : '>'} {formatDeZahl(erg.verzicht.grenzeTab6 * 100, 0)}<MdText text={inhalt.texte.t35Regel} />{erg.verzicht.wohn35 ? 'erfüllt' : nutzung === 'wohn' ? inhalt.werte.nichtErfüllt : inhalt.werte.nurFürWohnnutzung}.
                      {erg.verzicht.entbehrlich ? inhalt.werte.dieBerechnungWäreEntbehrlich : inhalt.werte.derRechnerischeNachweisIst}
                    </div>
                  </>
                )}
              </div>

              <FormulaDerivationBox
                live
                kurzzeile={erg.gueltig ? kurzzeile(ansageWert('S_vorh', erg.Svorh, 3), ansageWert('S_zul', erg.Szul, 3), erg.erfuellt ? inhalt.werte.nachweisErfüllt : inhalt.werte.nachweisNichtErfüllt) : 'S_vorh –'}
                title={inhalt.werte.ihrRechenwegSonneneintragskennwerte}
                zielGleichung="S_{vorh} \le S_{zul} = \sum S_x"
                schritte={[
                  { titel: inhalt.werte.gesamtenergiedurchlassgradMitSonnenschut, erklaerung: `g_tot = g · F_C für ${erg.fenster.length} Fenster (F_C nach Tab. 7):`, formel: gtotTeX },
                  { titel: inhalt.werte.vorhandenerSonneneintragskennwert, erklaerung: `Summe über alle Fenster, bezogen auf A_G = ${formatDeZahl(AG, 1)} m²:`, formel: `S_{vorh} = \\frac{${summeTeX}}{${t2(AG)}} = ${t3(erg.Svorh)}` },
                  { titel: inhalt.werte.grundflächenbezogenerFensterflächenantei, erklaerung: inhalt.werte.summeDerFensterflächenGeteilt, formel: `f_{WG} = \\frac{${t2(erg.AW)}}{${t2(AG)}} = ${t3(erg.fWG)}` },
                  { titel: inhalt.werte.anteilskennwerteS1UndS2, erklaerung: `S1 aus Tab. 8 (${NUTZUNG_NAME[nutzung]}, Region ${region}, Bauart ${BAUART_NAME[bauart]}, Nachtlüftung ${NL_NAME[nachtlueftung]}); S2 korrigiert den Fensterflächenanteil:`, formel: `S_1 = ${t3(erg.S1)}, \\quad S_2 = ${t3(a2)} - ${t3(b2)} \\cdot ${t3(erg.fWG)} = ${t3(erg.S2)}` },
                  { titel: inhalt.werte.anteilskennwerteS3BisS6, erklaerung: inhalt.werte.sonnenschutzglasFlächenanteiligGeneigteF, formel: `\\begin{gathered} S_3 = 0{,}03 \\cdot ${t2(erg.fSSG)} = ${t3(erg.S3)}, \\quad S_4 = -0{,}035 \\cdot ${t2(erg.fNeig)} = ${t3(erg.S4)} \\\\ S_5 = 0{,}10 \\cdot ${t2(erg.fNord)} = ${t3(erg.S5)}, \\quad S_6 = ${t3(erg.S6)} \\end{gathered}` },
                  { titel: 'Nachweis', erklaerung: erg.erfuellt ? inhalt.werte.derVorhandeneWertHält : inhalt.werte.derVorhandeneWertÜberschreitet, formel: `S_{zul} = ${t3(erg.Szul)} \\;\\Rightarrow\\; S_{vorh} = ${t3(erg.Svorh)} ${erg.erfuellt ? '\\le' : '>'} S_{zul}` },
                ]}
                ergebnisHinweis={inhalt.werte.derNachweisGiltFür}
                normQuelle={inhalt.werte.din410822013}
              />
            </div>
          </div>
        )}

        {reiter === 'beispiele' && (
          <div className="space-y-4">
            <FormulaDerivationBox
              title={inhalt.werte.beispiel1WohnzimmerMit}
              zielGleichung="S_{vorh} = \frac{A_w \cdot g \cdot F_C}{A_G} \le S_{zul}"
              defaultExpanded
              schritte={inhalt.daten["SommerlicherWaermeschutz.schritte"]}
              ergebnisHinweis={inhalt.werte.sonnenschutzAlleinSenktS}
              normQuelle={inhalt.werte.din4108220132}
            />
            <FormulaDerivationBox
              title={inhalt.werte.beispiel2DachgeschossIn}
              zielGleichung="S_4 = -0{,}035 \cdot f_{neig}"
              schritte={inhalt.daten["SommerlicherWaermeschutz.schritte_2"]}
              ergebnisHinweis={inhalt.werte.erfülltDankKleinemFensterflächenanteil}
              normQuelle={inhalt.werte.din4108220133}
            />
          </div>
        )}
      </ModuleTabs>

      <ModulTest moduleId="sommerlicher_waermeschutz" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap3}
        regelwerke={inhalt.daten["SommerlicherWaermeschutz.regelwerke"]}
        literatur={inhalt.daten["SommerlicherWaermeschutz.literatur"]}
        weblinks={[
          { title: inhalt.werte.bvrsTrSonnenschutzPdf, url: 'https://rs-fachverband.de/wp-content/uploads/2025/04/TR-Sonnenschutz-April-2024.pdf' },
          { title: inhalt.werte.kalksandsteinPlanungshandbuchKap11, url: 'https://www.kalksandstein.de/media/08_downloadcenter/12_pka_7_kap11_sommerlicher-waermeschutz_de.pdf' },
        ]}
        formeln={inhalt.daten["SommerlicherWaermeschutz.formeln"]}
      />
    </div>
  );
}
