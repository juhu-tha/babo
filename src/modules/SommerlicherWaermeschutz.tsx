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

type Reiter = 'einfuehrung' | 'grundlagen' | 'kennwerte' | 'rechner' | 'beispiele';
const REITER = [
  { id: 'einfuehrung' as const, label: 'Einführung', icon: Sun },
  { id: 'grundlagen' as const, label: 'Grundlagen', icon: BookOpen },
  { id: 'kennwerte' as const, label: 'Kennwerte & Tabellen', icon: Table2 },
  { id: 'rechner' as const, label: 'Rechner', icon: Calculator },
  { id: 'beispiele' as const, label: 'Beispiele', icon: ClipboardList },
];

const NUTZUNG_NAME: Record<Nutzung, string> = { wohn: 'Wohngebäude', nichtwohn: 'Nichtwohngebäude' };
const BAUART_NAME: Record<Bauart, string> = { leicht: 'leicht', mittel: 'mittel', schwer: 'schwer' };
const NL_NAME: Record<Nachtlueftung, string> = { ohne: 'ohne', erhoeht: 'erhöht (n ≥ 2 h⁻¹)', hoch: 'hoch (n ≥ 5 h⁻¹)' };
const REGION_NAME: Record<Klimaregion, string> = { A: 'A – sommerkühl', B: 'B – gemäßigt', C: 'C – sommerheiß' };

interface FensterZeile extends Fenster { id: string }
const STANDARD_FENSTER: FensterZeile[] = [
  { id: 'f1', name: 'Fenster Süd', A: 6, g: 0.59, scheiben: 2, orientierung: 'S', neigung: 90, schutz: 'rollladen_34' },
  { id: 'f2', name: 'Fenster West', A: 5, g: 0.59, scheiben: 2, orientierung: 'W', neigung: 90, schutz: 'rollladen_34' },
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
          <Sun className="w-5 h-5 text-shiraz" aria-hidden="true" /> Sommerlicher Wärmeschutz (DIN 4108-2)
        </h2>
        <p className="text-xs text-text-main/60 font-mono mt-1">
          Sonneneintragskennwert-Verfahren nach DIN 4108-2:2013-02, Abschnitt 8 – Anforderung nach § 14 GModG (vormals GEG)
        </p>
        <p className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          Neubauten müssen so geplant werden, dass sich Aufenthaltsräume im Sommer ohne Klimaanlage nicht unzumutbar aufheizen.
          Der Nachweis vergleicht den <strong>vorhandenen Sonneneintragskennwert</strong> des kritischen Raums mit einem
          <strong> zulässigen Wert</strong>, der von Klimaregion, Bauart, Nachtlüftung und Fenstereigenschaften abhängt.
        </p>
      </div>

      <ModuleTabs label="Bereiche Sommerlicher Wärmeschutz" tabs={REITER} aktiv={reiter} onWechsel={setReiter}
        className="[&>[role=tablist]]:mb-5">

        {reiter === 'einfuehrung' && (
          <div className="space-y-5">
            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2">Ziel und rechtliche Anforderung</h3>
              <div className="text-sm text-text-main/85 leading-relaxed space-y-2">
                <p>
                  Nach <strong>§ 14 Abs. 1 GModG</strong> (bis 28.07.2026 Gebäudeenergiegesetz GEG) ist ein zu errichtendes Gebäude so auszuführen,
                  dass der Sonneneintrag durch einen ausreichenden baulichen sommerlichen Wärmeschutz begrenzt wird. Die Anforderungen an die
                  Tageslichtversorgung bleiben unberührt.
                </p>
                <p>
                  Ausreichend ist der sommerliche Wärmeschutz nach <strong>§ 14 Abs. 2</strong>, wenn die Anforderungen nach DIN 4108-2:2013-02,
                  Abschnitt 8, eingehalten sind: Der nach 8.3.2 bestimmte Sonneneintragskennwert darf den zulässigen Wert nach 8.3.3 nicht überschreiten.
                  Alternativ erlaubt <strong>Abs. 3</strong> eine thermische Gebäudesimulation nach 8.4; die Übertemperaturgradstunden nach Tab. 9 dürfen dann
                  nicht überschritten werden. Nach <strong>Abs. 5</strong> entfallen die Berechnungen unter den Voraussetzungen von Abschnitt 8.2.2.
                </p>
                <p>
                  Wird ein Wohngebäude mit Kühlanlage über die Simulation nachgewiesen, sind nach <strong>Abs. 4</strong> bauliche Maßnahmen nach
                  DIN 4108-2, Abschnitt 4.3, vorzusehen, soweit sich die Investitionen über eingesparte Kühlenergie innerhalb der üblichen Nutzungsdauer erwirtschaften.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { t: '1 · Nachweisverzicht', d: 'Kleiner Fensterflächenanteil nach Tab. 6 oder Wohnraum mit außenliegendem Sonnenschutz (35-%-Regel, 8.2.2).' },
                { t: '2 · Sonneneintragskennwerte', d: 'Handrechenverfahren nach 8.3 für den kritischen Raum: $S_{vorh} \\le S_{zul}$.' },
                { t: '3 · Thermische Simulation', d: 'Dynamische Gebäudesimulation nach 8.4: Übertemperaturgradstunden unter dem Anforderungswert der Tab. 9.' },
              ].map(k => (
                <div key={k.t} className="p-4 rounded-xl border border-home-grau/30 bg-off-white text-sm">
                  <div className="font-bold text-shiraz mb-1">{k.t}</div>
                  <p className="text-text-main/80 text-xs leading-relaxed"><FormulaText text={k.d} /></p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-950 leading-relaxed flex gap-2">
              <Info size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Normenstand:</strong> § 14 GModG verweist ausdrücklich auf DIN 4108-2:2013-02. Die Neuausgabe DIN 4108-2:2026-05 ist erschienen
                und gliedert den sommerlichen Wärmeschutz neu (Sonneneintragskennwerte, Simulation und Abminderungsfaktoren in eigenen Abschnitten).
                Alle Werte dieses Moduls folgen der Ausgabe 2013-02; vor einer Anwendung nach der Neuausgabe sind Tabellen und Abschnittsnummern abzugleichen.
              </span>
            </div>
            <Querverweis ziel="bauphysik" titel="Phasenverschiebung und Temperaturamplitudendämpfung → Modul Bauphysik" linkText="Zum Modul Bauphysik">
              <p>Die Trägheit einzelner Bauteile (Phasenverschiebung, TAV) beschreibt das Modul Bauphysik. Sie ist <strong>kein</strong> Kriterium des Nachweises nach DIN 4108-2: Maßgebend sind Sonneneintrag, Speichermasse des Raums und Lüftung.</p>
            </Querverweis>
          </div>
        )}

        {reiter === 'grundlagen' && (
          <div className="space-y-5">
            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2">Vorhandener Sonneneintragskennwert</h3>
              <BlockMath math="S_{vorh} = \frac{\sum_j A_{w,j} \cdot g_{tot,j}}{A_G}, \qquad g_{tot} = g \cdot F_C" />
              <ul className="text-sm text-text-main/85 leading-relaxed list-disc pl-5 space-y-1 mt-2">
                <li><FormulaText text="$A_{w,j}$: Fensterfläche (lichtes Rohbaumaß) des Fensters j in m²" /></li>
                <li><FormulaText text="$g$: Gesamtenergiedurchlassgrad der Verglasung (senkrechter Strahlungseinfall, Herstellerangabe)" /></li>
                <li><FormulaText text="$F_C$: Abminderungsfaktor der fest installierten Sonnenschutzvorrichtung nach Tab. 7; alternativ ein produktspezifischer Wert für $g_{tot}$ (z. B. nach DIN EN 14501 bzw. DIN EN ISO 52022)" /></li>
                <li><FormulaText text="$A_G$: Nettogrundfläche des Raums aus den lichten Raummaßen; bei sehr tiefen Räumen ist die Raumtiefe auf das Dreifache der lichten Raumhöhe begrenzt" /></li>
              </ul>
              <p className="text-sm text-text-main/80 mt-3">
                Nachzuweisen ist der <strong>kritische Raum</strong> an der Fassade – in der Regel ein Raum mit großem Fensterflächenanteil, Fenstern
                nach zwei oder mehr Richtungen (Südost, Südwest) oder mit Dachflächenfenstern. Ist er nachgewiesen, gelten die übrigen Räume als erfüllt.
              </p>
            </div>
            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2">Zulässiger Sonneneintragskennwert</h3>
              <BlockMath math="S_{zul} = \sum_x S_x = S_1 + S_2 + S_3 + S_4 + S_5 + S_6" />
              <p className="text-sm text-text-main/85 leading-relaxed">
                Die anteiligen Kennwerte nach Tab. 8 bilden die Einflüsse ab: <FormulaText text="$S_1$" /> Klimaregion, Bauart und Nachtlüftung;
                <FormulaText text=" $S_2$" /> Korrektur für den grundflächenbezogenen Fensterflächenanteil (S1 gilt für etwa 25 %);
                <FormulaText text=" $S_3$" /> Sonnenschutzglas; <FormulaText text=" $S_4$" /> geneigte Fenster; <FormulaText text=" $S_5$" /> Nordorientierung oder
                dauernde Eigenverschattung; <FormulaText text=" $S_6$" /> passive Kühlung. Bei unterschiedlichen Fenstern eines Raums dürfen die Anteile
                flächenanteilig ermittelt werden.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className={karte}>
                <h4 className="font-bold text-text-main mb-2 text-sm">Sommerklimaregionen A, B, C</h4>
                <p className="text-xs text-text-main/85 leading-relaxed">
                  Die Karte in Abschnitt 8.1 teilt Deutschland nach Lufttemperatur und Solarstrahlung in drei Regionen. Jeder Region ist ein
                  Bezugswert der Innentemperatur zugeordnet: A sommerkühl {formatDeZahl(BEZUGSTEMPERATUR.A, 0)} °C, B gemäßigt {formatDeZahl(BEZUGSTEMPERATUR.B, 0)} °C,
                  C sommerheiß {formatDeZahl(BEZUGSTEMPERATUR.C, 0)} °C. Die höheren Bezugswerte berücksichtigen die Gewöhnung der Menschen an das regionale Sommerklima.
                  Ist die Zuordnung nicht eindeutig, gilt die höhere Region (B statt A, C statt A oder B).
                </p>
              </div>
              <div className={karte}>
                <h4 className="font-bold text-text-main mb-2 text-sm">Bauart und wirksame Wärmespeicherfähigkeit</h4>
                <p className="text-xs text-text-main/85 leading-relaxed">
                  Speicherfähige Bauteile nehmen tagsüber Wärme auf und geben sie nachts ab. Eingestuft wird über
                  <FormulaText text=" $C_{wirk}/A_G$" />: leicht unter 50, mittel 50 bis 130, schwer über 130 Wh/(m²K). Angerechnet werden nur raumnahe
                  Schichten (Außenbauteile höchstens die inneren 10 cm, nur bis zur ersten Dämmschicht). Pauschal <strong>mittel</strong> bei
                  Stahlbetondecke und massiven Bauteilen mit gemittelter Rohdichte ≥ 600 kg/m³, <strong>schwer</strong> ab 1.600 kg/m³ – jeweils ohne
                  Innendämmung, abgehängte Decke und Räume über 4,5 m Höhe. Ohne Nachweis gilt <strong>leicht</strong>.
                </p>
              </div>
              <div className={karte}>
                <h4 className="font-bold text-text-main mb-2 text-sm">Nachtlüftung und passive Kühlung</h4>
                <p className="text-xs text-text-main/85 leading-relaxed">
                  Nächtliches Lüften entlädt die Speichermasse. <strong>Erhöhte</strong> Nachtlüftung (n ≥ 2 h⁻¹, zweite Nachthälfte) darf bei
                  Wohnnutzung in der Regel angesetzt werden, ebenso mit einer entsprechend ausgelegten Lüftungsanlage. <strong>Hohe</strong>
                  Nachtlüftung (n ≥ 5 h⁻¹) setzt geschossübergreifende Querlüftung (Atrium, Treppenhaus, Galerie) oder eine passende Anlage voraus.
                  <strong> Passive Kühlung</strong> (S6) meint Systeme, die nur Energie für den Transport des Kühlmediums benötigen, etwa Bauteilaktivierung mit Erdreich.
                </p>
              </div>
            </div>
            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2">Thermische Gebäudesimulation (Abschnitt 8.4)</h3>
              <p className="text-sm text-text-main/85 leading-relaxed">
                Für Räume, auf die das vereinfachte Verfahren nicht passt (Doppelfassaden, transparente Wärmedämmung, Hallen, mehrgeschossige offene
                Räume) oder um Spielräume auszuloten, wird mit einem dynamischen Simulationsprogramm und dem Testreferenzjahr der Region gerechnet.
                Ausgewertet werden die <strong>Übertemperaturgradstunden</strong>: Für jede Stunde der Anwesenheitszeit wird die Überschreitung der
                operativen Raumtemperatur über den Bezugswert der Region aufsummiert. Zulässig sind nach Tab. 9 höchstens
                {' '}{formatDeZahl(UEBERTEMPERATURGRADSTUNDEN.wohn, 0)} Kh/a für Wohngebäude und {formatDeZahl(UEBERTEMPERATURGRADSTUNDEN.nichtwohn, 0)} Kh/a für Nichtwohngebäude.
              </p>
              <BlockMath math="\sum_{t} \max\left(0;\; \theta_{op}(t) - \theta_{b,op}\right) \cdot 1\,\text{h} \;\le\; 1\,200\,\text{Kh/a (Wohnen)}" />
              <p className="text-xs text-text-main/70">
                Beispiel: 1.200 Kh/a entsprechen 1.200 Stunden mit 1 K oder 300 Stunden mit 4 K über dem Bezugswert.
              </p>
            </div>
            <Querverweis ziel="feuchteschutz" titel="Winterlicher Wärme- und Feuchteschutz → Modul Feuchteschutz" linkText="Zum Modul Feuchteschutz">
              <p>DIN 4108-2 regelt neben dem Sommerfall den Mindestwärmeschutz im Winter (Temperaturfaktor, 80-%-Schimmelkriterium). Taupunkt, Schimmelgrenze und Glaser-Verfahren rechnet das Modul Feuchteschutz.</p>
            </Querverweis>
          </div>
        )}

        {reiter === 'kennwerte' && (
          <div className="space-y-5">
            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2">Tab. 6 – Fensterflächenanteil, bis zu dem der Nachweis entfallen kann</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead><tr className="bg-off-white text-left"><th className="p-2 border">Neigung gegenüber der Horizontalen</th><th className="p-2 border">Orientierung</th><th className="p-2 border text-right">f_WG</th></tr></thead>
                  <tbody>
                    <tr><td className="p-2 border" rowSpan={2}>über 60° bis 90°</td><td className="p-2 border">Nordwest über Süd bis Nordost</td><td className="p-2 border text-right">10 %</td></tr>
                    <tr><td className="p-2 border">alle anderen Nordorientierungen</td><td className="p-2 border text-right">15 %</td></tr>
                    <tr><td className="p-2 border">von 0° bis 60°</td><td className="p-2 border">alle Orientierungen</td><td className="p-2 border text-right">7 %</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-text-main/75 mt-2 leading-relaxed">
                <FormulaText text="$f_{WG} = A_W / A_G$" /> mit der Summe aller Fensterflächen des Raums; bei Fenstern unterschiedlicher Orientierung gilt der kleinere Grenzwert.
                Zusätzlich entfällt der Nachweis nach 8.2.2 bei <strong>Wohnnutzung</strong>, wenn der kritische Raum höchstens 35 % Fensterflächenanteil hat und seine
                Ost-, Süd- und Westfenster außenliegenden Sonnenschutz mit <FormulaText text="$F_C \le 0{,}30$" /> (Glas g &gt; 0,40) bzw.
                <FormulaText text=" $F_C \le 0{,}35$" /> (g ≤ 0,40) haben – praktisch Rollläden oder Raffstores.
              </p>
            </div>

            <div className={karte}>
              <h3 className="font-bold text-text-main mb-2">Tab. 7 – Anhaltswerte für Abminderungsfaktoren F_C</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-off-white text-left">
                      <th className="p-2 border">Sonnenschutzvorrichtung (fest installiert)</th>
                      <th className="p-2 border text-right">g ≤ 0,40 zweifach (Sonnenschutzglas)</th>
                      <th className="p-2 border text-right">g &gt; 0,40 dreifach</th>
                      <th className="p-2 border text-right">g &gt; 0,40 zweifach</th>
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
              <h3 className="font-bold text-text-main mb-2">Tab. 8 – Anteilige Sonneneintragskennwerte S_x</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-off-white">
                      <th className="p-2 border text-left" rowSpan={2}>S1: Nachtlüftung</th><th className="p-2 border text-left" rowSpan={2}>Bauart</th>
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
              <p className="text-[11px] text-text-main/60 mt-3">
                Wiedergabe nach KALKSANDSTEIN-Planungshandbuch, Kap. 11 (Tafel 3) und TR Sonnenschutz des BVRS (Tabelle 3); maßgebend ist der Normtext DIN 4108-2:2013-02, Tab. 8.
              </p>
            </div>
          </div>
        )}

        {reiter === 'rechner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-5">
              <div className={`${karte} space-y-3`}>
                <h3 className="font-bold text-text-main text-sm">Gebäude und Raum</h3>
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
                  <label className="flex flex-col gap-1 font-semibold text-slate-700">Nettogrundfläche A_G [m²]
                    <input type="number" min="1" step="0.5" className={feld} value={Number.isFinite(AG) ? AG : ''} onChange={e => setAG(zahl(e.target.value))} />
                  </label>
                  <label className="flex items-center gap-2 font-semibold text-slate-700 mt-5">
                    <input type="checkbox" checked={passiv} onChange={e => setPassiv(e.target.checked)} className="accent-shiraz" /> Passive Kühlung (S6)
                  </label>
                </div>
              </div>

              <div className={`${karte} space-y-3`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-text-main text-sm">Fenster des kritischen Raums</h3>
                  <button type="button" onClick={neuesFenster} className="px-3 py-1.5 bg-shiraz text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer">
                    <Plus size={14} aria-hidden="true" /> Fenster hinzufügen
                  </button>
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
                        <label className="flex flex-col gap-0.5 text-slate-600 flex-1 min-w-[14rem]">Sonnenschutz (Tab. 7)
                          <select className={feld} value={f.schutz} onChange={e => aendere(i, { schutz: e.target.value })}>
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
                <p className="text-[11px] text-text-main/60">
                  Neigung 90° = senkrechtes Fassadenfenster; bis 60° zählt ein Fenster als geneigt (Dachflächenfenster). F_C-Spalte nach g und Scheibenzahl.
                </p>
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
                    <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${erg.erfuellt ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'}`} role="status">
                      {erg.erfuellt ? <CheckCircle size={16} className="text-emerald-600 shrink-0" aria-hidden="true" /> : <AlertTriangle size={16} className="text-red-600 shrink-0" aria-hidden="true" />}
                      <span>
                        <strong>{erg.erfuellt ? 'Nachweis erfüllt' : 'Nachweis nicht erfüllt'}:</strong>{' '}
                        S_vorh = {z3(erg.Svorh)} {erg.erfuellt ? '≤' : '>'} S_zul = {z3(erg.Szul)}.
                        {!erg.erfuellt && ' Wirksam sind außenliegender Sonnenschutz, kleinere oder anders orientierte Fenster, mehr Speichermasse und Nachtlüftung.'}
                      </span>
                    </div>
                    <table className="w-full text-xs">
                      <tbody>
                        {[
                          ['f_{WG}', erg.fWG, 'Fensterfläche / Grundfläche'],
                          ['S_1', erg.S1, `${NUTZUNG_NAME[nutzung]}, Region ${region}, ${BAUART_NAME[bauart]}, Nachtlüftung ${NL_NAME[nachtlueftung]}`],
                          ['S_2', erg.S2, 'Fensterflächenanteil'],
                          ['S_3', erg.S3, `Sonnenschutzglas (Anteil ${formatDeZahl(erg.fSSG * 100, 0)} %)`],
                          ['S_4', erg.S4, `geneigte Fenster (f_neig = ${formatDeZahl(erg.fNeig, 2)})`],
                          ['S_5', erg.S5, `Nord/verschattet (f_nord = ${formatDeZahl(erg.fNord, 2)})`],
                          ['S_6', erg.S6, passiv ? 'passive Kühlung' : 'keine passive Kühlung'],
                        ].map(([s, v, t]) => (
                          <tr key={s as string} className="border-b border-slate-100">
                            <td className="py-1 pr-2"><FormulaText text={`$${s}$`} /></td>
                            <td className="py-1 pr-2 font-mono text-right">{z3(v as number)}</td>
                            <td className="py-1 text-[10.5px] text-slate-500">{t as string}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className={`p-3 rounded-xl border text-xs ${erg.verzicht.entbehrlich ? 'bg-sky-50 border-sky-200 text-sky-950' : 'bg-off-white border-home-grau/30 text-text-main/80'}`}>
                      <strong>Nachweisverzicht nach 8.2.2:</strong>{' '}
                      Tab. 6: f_WG = {formatDeZahl(erg.fWG * 100, 1)} % {erg.verzicht.tab6 ? '≤' : '>'} {formatDeZahl(erg.verzicht.grenzeTab6 * 100, 0)} %
                      {' · '}35-%-Regel: {erg.verzicht.wohn35 ? 'erfüllt' : nutzung === 'wohn' ? 'nicht erfüllt' : 'nur für Wohnnutzung'}.
                      {erg.verzicht.entbehrlich ? ' Die Berechnung wäre entbehrlich.' : ' Der rechnerische Nachweis ist zu führen.'}
                    </div>
                  </>
                )}
              </div>

              <FormulaDerivationBox
                live
                title="Ihr Rechenweg: Sonneneintragskennwerte"
                zielGleichung="S_{vorh} \le S_{zul} = \sum S_x"
                schritte={[
                  { titel: 'Gesamtenergiedurchlassgrad mit Sonnenschutz', erklaerung: `g_tot = g · F_C für ${erg.fenster.length} Fenster (F_C nach Tab. 7):`, formel: gtotTeX },
                  { titel: 'Vorhandener Sonneneintragskennwert', erklaerung: `Summe über alle Fenster, bezogen auf A_G = ${formatDeZahl(AG, 1)} m²:`, formel: `S_{vorh} = \\frac{${summeTeX}}{${t2(AG)}} = ${t3(erg.Svorh)}` },
                  { titel: 'Grundflächenbezogener Fensterflächenanteil', erklaerung: 'Summe der Fensterflächen geteilt durch die Nettogrundfläche:', formel: `f_{WG} = \\frac{${t2(erg.AW)}}{${t2(AG)}} = ${t3(erg.fWG)}` },
                  { titel: 'Anteilskennwerte S1 und S2', erklaerung: `S1 aus Tab. 8 (${NUTZUNG_NAME[nutzung]}, Region ${region}, Bauart ${BAUART_NAME[bauart]}, Nachtlüftung ${NL_NAME[nachtlueftung]}); S2 korrigiert den Fensterflächenanteil:`, formel: `S_1 = ${t3(erg.S1)}, \\quad S_2 = ${t3(a2)} - ${t3(b2)} \\cdot ${t3(erg.fWG)} = ${t3(erg.S2)}` },
                  { titel: 'Anteilskennwerte S3 bis S6', erklaerung: 'Sonnenschutzglas (flächenanteilig), geneigte Fenster, Nordorientierung bzw. Eigenverschattung, passive Kühlung:', formel: `\\begin{gathered} S_3 = 0{,}03 \\cdot ${t2(erg.fSSG)} = ${t3(erg.S3)}, \\quad S_4 = -0{,}035 \\cdot ${t2(erg.fNeig)} = ${t3(erg.S4)} \\\\ S_5 = 0{,}10 \\cdot ${t2(erg.fNord)} = ${t3(erg.S5)}, \\quad S_6 = ${t3(erg.S6)} \\end{gathered}` },
                  { titel: 'Nachweis', erklaerung: erg.erfuellt ? 'Der vorhandene Wert hält den zulässigen ein:' : 'Der vorhandene Wert überschreitet den zulässigen:', formel: `S_{zul} = ${t3(erg.Szul)} \\;\\Rightarrow\\; S_{vorh} = ${t3(erg.Svorh)} ${erg.erfuellt ? '\\le' : '>'} S_{zul}` },
                ]}
                ergebnisHinweis="Der Nachweis gilt für den kritischen Raum; maßgebend sind die Tabellenwerte der DIN 4108-2 bzw. produktspezifische g_tot-Werte."
                normQuelle="DIN 4108-2:2013-02, 8.3, Tab. 7 und 8; § 14 GModG"
              />
            </div>
          </div>
        )}

        {reiter === 'beispiele' && (
          <div className="space-y-4">
            <FormulaDerivationBox
              title="Beispiel 1: Wohnzimmer mit großer Südverglasung (Region B)"
              zielGleichung="S_{vorh} = \frac{A_w \cdot g \cdot F_C}{A_G} \le S_{zul}"
              defaultExpanded
              schritte={[
                { titel: 'Eingangswerte', erklaerung: 'Wohnzimmer 5 × 5 m (A_G = 25 m²), Fensterfläche 11 m² (f_WG = 0,44), Zweifach-Wärmeschutzglas g = 0,59, Rollladen ¾ geschlossen; mittlere Bauart, erhöhte Nachtlüftung, Region B.', formel: 'F_C = 0{,}30 \\;\\Rightarrow\\; g_{tot} = 0{,}59 \\cdot 0{,}30 = 0{,}177' },
                { titel: 'Vorhandener Kennwert', erklaerung: 'Fensterfläche mal g_tot, bezogen auf die Grundfläche:', formel: 'S_{vorh} = \\frac{11 \\cdot 0{,}177}{25} = 0{,}078' },
                { titel: 'Zulässiger Kennwert', erklaerung: 'S1 aus Tab. 8 (Wohnen, B, mittel, erhöhte Nachtlüftung); S2 mit f_WG = 0,44; S3 bis S6 entfallen:', formel: 'S_{zul} = 0{,}103 + (0{,}060 - 0{,}231 \\cdot 0{,}44) = 0{,}103 - 0{,}042 = 0{,}061' },
                { titel: 'Bewertung', erklaerung: 'Der Nachweis ist nicht erfüllt; auch die 35-%-Regel greift nicht (f_WG = 44 %).', formel: 'S_{vorh} = 0{,}078 > S_{zul} = 0{,}061' },
                { titel: 'Verbesserung', erklaerung: 'Raffstore mit 45°-Lamellen (F_C = 0,25) und schwere Bauart (Stahlbetondecke, Kalksandstein):', formel: 'S_{vorh} = \\frac{11 \\cdot 0{,}59 \\cdot 0{,}25}{25} = 0{,}065 \\le S_{zul} = 0{,}113 - 0{,}042 = 0{,}071' },
              ]}
              ergebnisHinweis="Sonnenschutz allein senkt S_vorh nur auf 0,065 – erst zusammen mit mehr Speichermasse wird der Nachweis erfüllt. Hohe Nachtlüftung (S1 = 0,152) hätte ebenfalls genügt."
              normQuelle="DIN 4108-2:2013-02, Tab. 7 und 8; Rechengang nach TR Sonnenschutz (BVRS, 2024), Beispiel 3.5.2"
            />
            <FormulaDerivationBox
              title="Beispiel 2: Dachgeschoss in Holzbauweise mit Dachflächenfenster"
              zielGleichung="S_4 = -0{,}035 \cdot f_{neig}"
              schritte={[
                { titel: 'Eingangswerte', erklaerung: 'Kinderzimmer A_G = 14 m², leichte Bauart, erhöhte Nachtlüftung, Region B. Dachflächenfenster Süd 1,5 m² (45°, Dreifachglas g = 0,50, Außenrollladen ¾: F_C = 0,30); Giebelfenster West 1,2 m² ohne Sonnenschutz.', formel: 'g_{tot,1} = 0{,}50 \\cdot 0{,}30 = 0{,}150, \\quad g_{tot,2} = 0{,}50' },
                { titel: 'Vorhandener Kennwert', erklaerung: 'Beide Fenster zusammen:', formel: 'S_{vorh} = \\frac{1{,}5 \\cdot 0{,}150 + 1{,}2 \\cdot 0{,}50}{14} = \\frac{0{,}825}{14} = 0{,}059' },
                { titel: 'Nachweisverzicht?', erklaerung: 'Mit Dachflächenfenster gilt nach Tab. 6 die Grenze 7 %; das Westfenster hat keinen Außenschutz, die 35-%-Regel greift nicht.', formel: 'f_{WG} = \\frac{2{,}7}{14} = 0{,}193 > 0{,}07' },
                { titel: 'Anteilskennwerte', erklaerung: 'S1 (Wohnen, B, leicht, erhöht) = 0,088; S2 mit f_WG; S4 mit dem Anteil geneigter Fenster f_neig = 1,5 / 2,7 = 0,556:', formel: 'S_2 = 0{,}060 - 0{,}231 \\cdot 0{,}193 = 0{,}015, \\quad S_4 = -0{,}035 \\cdot 0{,}556 = -0{,}019' },
                { titel: 'Nachweis', erklaerung: 'Summe der Anteile und Vergleich:', formel: 'S_{zul} = 0{,}088 + 0{,}015 - 0{,}019 = 0{,}084 \\ge S_{vorh} = 0{,}059' },
              ]}
              ergebnisHinweis="Erfüllt dank kleinem Fensterflächenanteil und Nachtlüftung. Ohne Nachtlüftung (S1 = 0,056) wäre S_zul = 0,052 < 0,059 – im Holzbau entscheidet die Lüftung."
              normQuelle="DIN 4108-2:2013-02, 8.2.2, Tab. 6 bis 8"
            />
          </div>
        )}
      </ModuleTabs>

      <ModulTest moduleId="sommerlicher_waermeschutz" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 3.13 neu erstellt; Tabellenwerte gegen zwei Sekundärquellen geprüft, Abgleich mit DIN 4108-2:2026-05 und fachliche Freigabe durch den Autor ausstehend)"
        regelwerke={[
          { title: 'DIN 4108-2:2026-05 (Wärmeschutz und Energie-Einsparung in Gebäuden – Teil 2: Wärmeschutz – Anforderungen, Berechnungsverfahren und Hinweise für Planung und Ausführung; sommerlicher Wärmeschutz neu gegliedert, Werte dieses Moduls noch nicht abgeglichen)' },
          { title: 'DIN 4108-2:2013-02 (Vorgängerausgabe „Mindestanforderungen an den Wärmeschutz“; Abschnitt 8 mit Tab. 6 bis 9, in § 14 GModG in Bezug genommen)' },
          { title: 'Gebäudemodernisierungsgesetz (GModG, vormals GEG), § 14 Sommerlicher Wärmeschutz', url: 'https://www.gesetze-im-internet.de/geg/__14.html' },
        ]}
        literatur={[
          'Bundesverband Rollladen + Sonnenschutz e. V. (Hrsg.): TR Sonnenschutz – Nachweisverfahren, Energieeinsparung, Tageslichtversorgung. Ausgabe April 2024, Bonn',
          'Bundesverband Kalksandsteinindustrie e. V. (Hrsg.): KALKSANDSTEIN – Planungshandbuch, Kapitel 11 „Sommerlicher Wärmeschutz“. Stand 01/2018',
        ]}
        weblinks={[
          { title: 'BVRS: TR Sonnenschutz (PDF, April 2024)', url: 'https://rs-fachverband.de/wp-content/uploads/2025/04/TR-Sonnenschutz-April-2024.pdf' },
          { title: 'KALKSANDSTEIN-Planungshandbuch, Kap. 11 Sommerlicher Wärmeschutz (PDF)', url: 'https://www.kalksandstein.de/media/08_downloadcenter/12_pka_7_kap11_sommerlicher-waermeschutz_de.pdf' },
        ]}
        formeln={[
          { formel: 'S_{vorh} = \\frac{\\sum_j A_{w,j} \\cdot g_{tot,j}}{A_G}', erklaerung: 'Vorhandener Sonneneintragskennwert des kritischen Raums; A_w Fensterfläche, g_tot Gesamtenergiedurchlassgrad einschließlich Sonnenschutz, A_G Nettogrundfläche.', quelle: 'DIN 4108-2:2013-02, 8.3.2' },
          { formel: 'g_{tot} = g \\cdot F_C', erklaerung: 'Gesamtenergiedurchlassgrad mit Sonnenschutz; F_C Abminderungsfaktor der fest installierten Sonnenschutzvorrichtung.', quelle: 'DIN 4108-2:2013-02, Tab. 7' },
          { formel: 'S_{zul} = \\sum_x S_x, \\quad S_2 = a - b \\cdot f_{WG}', erklaerung: 'Zulässiger Sonneneintragskennwert als Summe der anteiligen Kennwerte S1 bis S6; f_WG grundflächenbezogener Fensterflächenanteil.', quelle: 'DIN 4108-2:2013-02, 8.3.3, Tab. 8' },
        ]}
      />
    </div>
  );
}
