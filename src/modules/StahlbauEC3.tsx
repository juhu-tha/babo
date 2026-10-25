import React, { useMemo, useState } from 'react';
import { BookOpen, Calculator, Columns, Layers, Ruler, Table2 } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import {
  ALPHA, EC3_NA_DE, KNICKLINIEN, STAHLGUETEN, WALZPROFILE, bemesseDruckstab, biegewiderstandY, chi, profil,
  type Knicklinie, type Stahlguete,
} from '@/src/calc/stahlbau';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

type Reiter = 'einfuehrung' | 'grundlagen' | 'kennwerte' | 'rechner';
const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Einführung', icon: BookOpen },
  { id: 'grundlagen', label: 'Grundlagen', icon: Layers },
  { id: 'kennwerte', label: 'Kennwerte & Tabellen', icon: Table2 },
  { id: 'rechner', label: 'Rechner Biegeknicken', icon: Calculator },
];

const KNICK_FARBE: Record<Knicklinie, string> = { a0: '#0f766e', a: '#2563eb', b: '#A3113E', c: '#d97706', d: '#475569' };
const GUETEN: Stahlguete[] = ['S235', 'S355', 'S460'];
const tex = (x: number, n: number) => formatDeTeX(x, n);

const Karte = ({ titel, children }: { titel: string; children: React.ReactNode }) => (
  <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-3">
    <h3 className="text-base font-bold text-text-main">{titel}</h3>
    <div className="text-sm text-text-main/85 leading-relaxed space-y-2">{children}</div>
  </section>
);

const Formel = ({ math }: { math: string }) => (
  <div className="p-2 bg-off-white border border-home-grau/20 rounded-lg overflow-x-auto text-center">
    <BlockMath math={math} />
  </div>
);

const th = 'px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-200';
const td = 'px-3 py-1.5 border-b border-slate-100 font-mono text-xs';

export default function StahlbauEC3() {
  const [reiter, setReiter] = useState<Reiter>('einfuehrung');

  // Rechner Biegeknicken
  const [profilName, setProfilName] = useState('HEB 200');
  const [guete, setGuete] = useState<Stahlguete>('S235');
  const [LcrY, setLcrY] = useState(4.0);
  const [LcrZ, setLcrZ] = useState(4.0);
  const [nEd, setNEd] = useState(800);
  const [autoLinie, setAutoLinie] = useState(true);
  const [linieY, setLinieY] = useState<Knicklinie>('b');
  const [linieZ, setLinieZ] = useState<Knicklinie>('c');

  const r = useMemo(() => bemesseDruckstab({
    profil: profilName, guete, LcrY, LcrZ, nEd,
    knicklinieY: autoLinie ? undefined : linieY,
    knicklinieZ: autoLinie ? undefined : linieZ,
  }), [profilName, guete, LcrY, LcrZ, nEd, autoLinie, linieY, linieZ]);

  const p = r.p ?? WALZPROFILE[0];
  const biegung = useMemo(() => biegewiderstandY(p, guete), [p, guete]);
  const m = r.massgebend === 'z' ? r.z : r.y;
  const iM = r.massgebend === 'z' ? p.iz : p.iy;
  const ok = r.ausnutzung <= 1;

  const kurven = useMemo(() => {
    const xs = Array.from({ length: 61 }, (_, k) => k * 0.05);
    return {
      datasets: [
        ...KNICKLINIEN.map(k => ({
          label: `Knicklinie ${k} (α = ${formatDeZahl(ALPHA[k], 2)})`,
          data: xs.map(x => ({ x, y: chi(x, ALPHA[k]).chi })),
          borderColor: KNICK_FARBE[k], borderWidth: 1.8, pointRadius: 0, tension: 0.2,
        })),
        {
          label: 'Ihr Stab (y- und z-Achse)',
          data: [{ x: r.y.lambdaQuer, y: r.y.chi }, { x: r.z.lambdaQuer, y: r.z.chi }],
          borderColor: '#111827', backgroundColor: '#111827', pointRadius: 6, showLine: false,
        },
      ],
    };
  }, [r]);

  const zahlFeld = (label: string, wert: number, setze: (v: number) => void, min: number, max: number, step: number, einheit: string) => (
    <label className="block">
      <span className="text-xs font-bold text-slate-700 flex justify-between">
        {label}
        <span className="font-mono text-slate-800 bg-slate-100 px-1.5 rounded">{formatDeZahl(wert, step < 1 ? 2 : 0)} {einheit}</span>
      </span>
      <input
        type="range" min={min} max={max} step={step} value={wert}
        aria-label={label}
        onChange={e => setze(Number(e.target.value))}
        className="w-full accent-shiraz cursor-pointer mt-1"
      />
    </label>
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Columns className="w-5 h-5 text-shiraz" /> Stahlbau nach Eurocode 3 – Grundlagen
        </h2>
        <p className="text-xs text-text-main/60 font-mono mt-1">
          DIN EN 1993-1-1 mit Nationalem Anhang (DE): Werkstoff, Querschnittsklassen, Zug, Biegung, Biegeknicken
        </p>
      </div>

      <ModuleTabs label="Stahlbau nach Eurocode 3: Bereiche" tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
        <div className="flex flex-col gap-6 mt-5">
          {reiter === 'einfuehrung' && (
            <>
              <Karte titel="Worum es geht">
                <p>
                  Stahltragwerke werden in Deutschland nach <strong>DIN EN 1993-1-1 (Eurocode 3)</strong> in Verbindung mit dem
                  Nationalen Anhang bemessen. Das Modul behandelt die Grundnachweise im Grenzzustand der Tragfähigkeit für
                  gewalzte I- und H-Profile: die Einstufung in <strong>Querschnittsklassen</strong>, den Zugstab, die Biegung
                  um die starke Achse und den Stabilitätsnachweis gegen <strong>Biegeknicken</strong>.
                </p>
                <p>
                  Alle Nachweise folgen dem semiprobabilistischen Sicherheitskonzept der DIN EN 1990: Die Bemessungswerte der
                  Einwirkungen dürfen die Bemessungswerte der Widerstände nicht überschreiten.
                </p>
                <Formel math="\frac{E_d}{R_d} \le 1{,}0 \quad \text{mit} \quad R_d = \frac{R_k}{\gamma_M}" />
              </Karte>
              <Karte titel="Teilsicherheitsbeiwerte nach NA (DE)">
                <ul className="list-disc pl-5 space-y-1">
                  <li><FormulaText text="$\gamma_{M0} = 1{,}0$" /> – Beanspruchbarkeit von Querschnitten (Fließen im Bruttoquerschnitt)</li>
                  <li><FormulaText text="$\gamma_{M1} = 1{,}1$" /> – Stabilitätsversagen (Biegeknicken, Biegedrillknicken); die EN empfiehlt 1,0, der deutsche NA legt 1,1 fest</li>
                  <li><FormulaText text="$\gamma_{M2} = 1{,}25$" /> – Bruch des Nettoquerschnitts unter Zug (Lochschwächung)</li>
                </ul>
                <p>
                  Der größere Beiwert beim Bruch berücksichtigt, dass das Zerreißen im Lochquerschnitt ohne Vorankündigung
                  eintritt, während Fließen im Bruttoquerschnitt mit großen, sichtbaren Verformungen verbunden ist.
                </p>
              </Karte>
              <Karte titel="Nachweisablauf in diesem Modul">
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Stahlgüte festlegen: Streckgrenze <FormulaText text="$f_y$" /> und Zugfestigkeit <FormulaText text="$f_u$" /> nach Tab. 3.1.</li>
                  <li>Querschnitt klassifizieren (Tab. 5.2): Klasse 1 bis 4 aus den c/t-Verhältnissen von Flansch und Steg.</li>
                  <li>Querschnittsnachweise: Zug (6.2.3), Druck (6.2.4), Biegung (6.2.5).</li>
                  <li>Stabilitätsnachweis Biegeknicken (6.3.1) mit dem Abminderungsbeiwert χ.</li>
                </ol>
                <p className="text-xs text-text-main/70">
                  Die zweite Eurocode-Generation (DIN EN 1993-1-1:2025-04) ist erschienen, aber noch nicht bauaufsichtlich
                  eingeführt; maßgebend bleiben DIN EN 1993-1-1:2010-12 mit A1:2014-07 und NA.
                </p>
              </Karte>
              <Querverweis ziel="knicken" titel="Ideale Knicklast nach Euler" linkText="Zum Modul Knicken (Euler)">
                <p>Die Euler-Fälle und die Knicklänge L_cr = β · l werden im Modul Knicken hergeleitet. Hier wird daraus der Bemessungswert N_b,Rd des Eurocode 3.</p>
              </Querverweis>
            </>
          )}

          {reiter === 'grundlagen' && (
            <>
              <Karte titel="1 Werkstoff">
                <p>
                  Baustahl wird für die Bemessung linear-elastisch, ideal-plastisch idealisiert. Maßgebend sind die Nennwerte
                  der Streckgrenze <FormulaText text="$f_y$" /> und der Zugfestigkeit <FormulaText text="$f_u$" /> nach
                  Tab. 3.1 (abhängig von der Erzeugnisdicke t). Für alle Baustähle gelten nach 3.2.6:
                </p>
                <Formel math="E = 210\,000\ \text{N/mm}^2, \quad G \approx 81\,000\ \text{N/mm}^2, \quad \nu = 0{,}3" />
                <p>Die Stahlgüte geht in alle Schlankheitsgrenzen über den Beiwert ε ein:</p>
                <Formel math="\varepsilon = \sqrt{\frac{235}{f_y}} \qquad (S235: 1{,}00;\ S355: 0{,}81;\ S460: 0{,}71)" />
              </Karte>
              <Karte titel="2 Querschnittsklassen">
                <p>
                  Dünnwandige, druckbeanspruchte Querschnittsteile können örtlich ausbeulen, bevor der Querschnitt seine volle
                  Tragfähigkeit erreicht. Die Querschnittsklasse beschreibt, wie weit ein Querschnitt plastiziert werden darf:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Klasse 1:</strong> plastisches Moment erreichbar, ausreichende Rotationskapazität für Fließgelenke (plastische Tragwerksberechnung).</li>
                  <li><strong>Klasse 2:</strong> plastisches Moment erreichbar, aber nur begrenzte Rotationskapazität.</li>
                  <li><strong>Klasse 3:</strong> Fließen nur in der Randfaser; elastische Querschnittswerte.</li>
                  <li><strong>Klasse 4:</strong> örtliches Beulen vor Erreichen von f_y; wirksame Querschnittswerte nach DIN EN 1993-1-5.</li>
                </ul>
                <p>
                  Eingestuft wird jedes druckbeanspruchte Teil über sein Verhältnis Breite zu Dicke c/t; die ungünstigste
                  Einstufung ergibt die Klasse des Querschnitts. Für gewalzte I-Profile gilt:
                </p>
                <Formel math="\text{Flansch (einseitig gestützt): } c = \frac{b - t_w - 2r}{2}, \qquad \text{Steg (beidseitig gestützt): } c = h - 2t_f - 2r" />
              </Karte>
              <Karte titel="3 Zugstab">
                <p>Der Bemessungswert der Zugbeanspruchbarkeit ist der kleinere Wert aus Fließen im Bruttoquerschnitt und Bruch im Nettoquerschnitt:</p>
                <Formel math="N_{t,Rd} = \min\left(N_{pl,Rd} = \frac{A \cdot f_y}{\gamma_{M0}};\ N_{u,Rd} = \frac{0{,}9 \cdot A_{net} \cdot f_u}{\gamma_{M2}}\right)" />
                <p>A_net ist die Nettoquerschnittsfläche nach Abzug der Lochflächen (bei versetzten Löchern nach 6.2.2.2).</p>
              </Karte>
              <Karte titel="4 Biegung um die starke Achse">
                <p>Der Biegewiderstand hängt von der Querschnittsklasse ab:</p>
                <Formel math="M_{c,Rd} = M_{pl,Rd} = \frac{W_{pl} \cdot f_y}{\gamma_{M0}}\ \ (\text{Kl. } 1, 2), \qquad M_{c,Rd} = M_{el,Rd} = \frac{W_{el,min} \cdot f_y}{\gamma_{M0}}\ \ (\text{Kl. } 3)" />
                <p>Bei Walzprofilen ist W_pl,y etwa 12 bis 15 % größer als W_el,y; diese plastische Reserve darf nur in den Klassen 1 und 2 genutzt werden.</p>
              </Karte>
              <Karte titel="5 Biegeknicken">
                <p>
                  Reale Druckstäbe sind nie ideal gerade und enthalten Walzeigenspannungen. Sie versagen deshalb unterhalb der
                  idealen Verzweigungslast N_cr. Der Eurocode erfasst das mit dem Abminderungsbeiwert χ, der aus dem bezogenen
                  Schlankheitsgrad und einer von fünf Knicklinien folgt:
                </p>
                <Formel math="N_{cr} = \frac{\pi^2 \cdot E \cdot I}{L_{cr}^2}, \qquad \bar\lambda = \sqrt{\frac{A \cdot f_y}{N_{cr}}} = \frac{L_{cr}}{i \cdot \lambda_1}, \qquad \lambda_1 = \pi\sqrt{\frac{E}{f_y}} = 93{,}9\,\varepsilon" />
                <Formel math="\Phi = 0{,}5\left[1 + \alpha\,(\bar\lambda - 0{,}2) + \bar\lambda^2\right], \qquad \chi = \frac{1}{\Phi + \sqrt{\Phi^2 - \bar\lambda^2}} \le 1{,}0 \quad \text{(Gl. 6.49)}" />
                <Formel math="N_{b,Rd} = \frac{\chi \cdot A \cdot f_y}{\gamma_{M1}} \quad \text{(Kl. 1–3)}, \qquad \frac{N_{Ed}}{N_{b,Rd}} \le 1{,}0" />
                <p>
                  Der Imperfektionsbeiwert α (Tab. 6.1) bildet ab, wie empfindlich ein Querschnitt auf Vorkrümmung und
                  Eigenspannungen reagiert; die Zuordnung zur Knicklinie regelt Tab. 6.2. Ist λ̄ ≤ 0,2 oder
                  N_Ed/N_cr ≤ 0,04, darf der Biegeknicknachweis entfallen (6.3.1.2(4)).
                </p>
              </Karte>
            </>
          )}

          {reiter === 'kennwerte' && (
            <>
              <Karte titel="Stahlgüten (Tab. 3.1, Erzeugnisdicke t ≤ 40 mm)">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-lg">
                    <thead><tr><th className={th}>Stahlgüte</th><th className={th}>Norm</th><th className={th}>f_y [N/mm²]</th><th className={th}>f_u [N/mm²]</th><th className={th}>ε</th></tr></thead>
                    <tbody>
                      {GUETEN.map(g => (
                        <tr key={g}>
                          <td className={td}>{g}</td><td className={td}>{STAHLGUETEN[g].norm}</td>
                          <td className={td}>{formatDeWert(STAHLGUETEN[g].fy)}</td><td className={td}>{formatDeWert(STAHLGUETEN[g].fu)}</td>
                          <td className={td}>{formatDeZahl(Math.sqrt(235 / STAHLGUETEN[g].fy), 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-text-main/70">Für 40 mm &lt; t ≤ 80 mm sind die Werte abgemindert (z. B. S235: f_y = 215 N/mm²; S355: f_y = 335 N/mm²). E = 210 000 N/mm²; γ_M0 = 1,0, γ_M1 = 1,1, γ_M2 = 1,25 (NA DE).</p>
              </Karte>
              <Karte titel="Grenzwerte c/t für Querschnittsklassen (Tab. 5.2, Auszug)">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200">
                    <thead><tr><th className={th}>Querschnittsteil</th><th className={th}>Beanspruchung</th><th className={th}>Klasse 1</th><th className={th}>Klasse 2</th><th className={th}>Klasse 3</th></tr></thead>
                    <tbody>
                      <tr><td className={td}>Steg (beidseitig gestützt)</td><td className={td}>Biegung</td><td className={td}>72ε</td><td className={td}>83ε</td><td className={td}>124ε</td></tr>
                      <tr><td className={td}>Steg (beidseitig gestützt)</td><td className={td}>Druck</td><td className={td}>33ε</td><td className={td}>38ε</td><td className={td}>42ε</td></tr>
                      <tr><td className={td}>Flansch (einseitig gestützt)</td><td className={td}>Druck</td><td className={td}>9ε</td><td className={td}>10ε</td><td className={td}>14ε</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-text-main/70">Wird der Grenzwert der Klasse 3 überschritten, liegt Klasse 4 vor. Für Stege unter Biegung und Druck gelten von der Lage der Nulllinie abhängige Grenzen (hier nicht dargestellt).</p>
              </Karte>
              <Karte titel="Knicklinien und Imperfektionsbeiwerte (Tab. 6.1, Tab. 6.2)">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200">
                    <thead><tr><th className={th}>Knicklinie</th>{KNICKLINIEN.map(k => <th key={k} className={th}>{k}</th>)}</tr></thead>
                    <tbody>
                      <tr><td className={td}>α</td>{KNICKLINIEN.map(k => <td key={k} className={td}>{formatDeZahl(ALPHA[k], 2)}</td>)}</tr>
                      <tr><td className={td}>χ bei λ̄ = 1,0</td>{KNICKLINIEN.map(k => <td key={k} className={td}>{formatDeZahl(chi(1, ALPHA[k]).chi, 3)}</td>)}</tr>
                    </tbody>
                  </table>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200">
                    <thead><tr><th className={th}>Gewalzte I-Querschnitte</th><th className={th}>Achse</th><th className={th}>S235 bis S420</th><th className={th}>S460</th></tr></thead>
                    <tbody>
                      <tr><td className={td}>h/b &gt; 1,2; t_f ≤ 40 mm</td><td className={td}>y–y / z–z</td><td className={td}>a / b</td><td className={td}>a0 / a0</td></tr>
                      <tr><td className={td}>h/b &gt; 1,2; 40 &lt; t_f ≤ 100 mm</td><td className={td}>y–y / z–z</td><td className={td}>b / c</td><td className={td}>a / a</td></tr>
                      <tr><td className={td}>h/b ≤ 1,2; t_f ≤ 100 mm</td><td className={td}>y–y / z–z</td><td className={td}>b / c</td><td className={td}>a / a</td></tr>
                      <tr><td className={td}>h/b ≤ 1,2; t_f &gt; 100 mm</td><td className={td}>y–y / z–z</td><td className={td}>d / d</td><td className={td}>c / c</td></tr>
                    </tbody>
                  </table>
                </div>
              </Karte>
              <Karte titel="Querschnittswerte der Walzprofile im Rechner">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-slate-200">
                    <thead>
                      <tr>
                        <th className={th}>Profil</th><th className={th}>h × b [mm]</th><th className={th}>t_w / t_f / r [mm]</th><th className={th}>A [cm²]</th>
                        <th className={th}>I_y [cm⁴]</th><th className={th}>W_el,y / W_pl,y [cm³]</th><th className={th}>i_y [cm]</th><th className={th}>I_z [cm⁴]</th><th className={th}>i_z [cm]</th>
                      </tr>
                    </thead>
                    <tbody>
                      {WALZPROFILE.map(q => (
                        <tr key={q.name}>
                          <td className={td}>{q.name}</td>
                          <td className={td}>{formatDeWert(q.h)} × {formatDeWert(q.b)}</td>
                          <td className={td}>{formatDeZahl(q.tw, 1)} / {formatDeZahl(q.tf, 1)} / {formatDeWert(q.r)}</td>
                          <td className={td}>{formatDeZahl(q.A, 1)}</td>
                          <td className={td}>{formatDeZahl(q.Iy, 0)}</td>
                          <td className={td}>{formatDeZahl(q.Wely, 1)} / {formatDeZahl(q.Wply, 1)}</td>
                          <td className={td}>{formatDeZahl(q.iy, 2)}</td>
                          <td className={td}>{formatDeZahl(q.Iz, 0)}</td>
                          <td className={td}>{formatDeZahl(q.iz, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-text-main/70">Querschnittswerte nach Herstellerprofiltabelle (stad.fr), A gerundet wie in den Bautabellen. Für Ausführungsplanungen gelten die Werte des Lieferwerks.</p>
              </Karte>
            </>
          )}

          {reiter === 'rechner' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><Ruler size={14} /> Eingaben</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs font-bold text-slate-700">Profil
                      <select value={profilName} onChange={e => setProfilName(e.target.value)} aria-label="Walzprofil" className="mt-1 w-full p-2 border border-slate-200 rounded-lg bg-white font-mono text-xs">
                        {WALZPROFILE.map(q => <option key={q.name} value={q.name}>{q.name}</option>)}
                      </select>
                    </label>
                    <label className="block text-xs font-bold text-slate-700">Stahlgüte
                      <select value={guete} onChange={e => setGuete(e.target.value as Stahlguete)} aria-label="Stahlgüte" className="mt-1 w-full p-2 border border-slate-200 rounded-lg bg-white font-mono text-xs">
                        {GUETEN.map(g => <option key={g} value={g}>{g} (f_y = {formatDeWert(STAHLGUETEN[g].fy)} N/mm²)</option>)}
                      </select>
                    </label>
                  </div>
                  {zahlFeld('Knicklänge L_cr,y (starke Achse)', LcrY, setLcrY, 0.5, 12, 0.25, 'm')}
                  {zahlFeld('Knicklänge L_cr,z (schwache Achse)', LcrZ, setLcrZ, 0.5, 12, 0.25, 'm')}
                  {zahlFeld('Druckkraft N_Ed', nEd, setNEd, 0, 4000, 10, 'kN')}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <input type="checkbox" checked={autoLinie} onChange={e => setAutoLinie(e.target.checked)} />
                      Knicklinien nach Tab. 6.2 zuordnen (y: {r.vorschlagY}, z: {r.vorschlagZ})
                    </label>
                    {!autoLinie && (
                      <div className="grid grid-cols-2 gap-3">
                        {([['y', linieY, setLinieY], ['z', linieZ, setLinieZ]] as const).map(([achse, wert, setze]) => (
                          <label key={achse} className="block text-xs font-bold text-slate-700">Knicklinie {achse}–{achse}
                            <select value={wert} onChange={e => setze(e.target.value as Knicklinie)} aria-label={`Knicklinie ${achse}`} className="mt-1 w-full p-2 border border-slate-200 rounded-lg bg-white font-mono text-xs">
                              {KNICKLINIEN.map(k => <option key={k} value={k}>{k} (α = {formatDeZahl(ALPHA[k], 2)})</option>)}
                            </select>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 space-y-2 text-xs">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Querschnitt {p.name}, {guete}</h3>
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <span>A = {formatDeZahl(p.A, 1)} cm²</span><span>h/b = {formatDeZahl(p.h / p.b, 2)}</span>
                    <span>i_y = {formatDeZahl(p.iy, 2)} cm</span><span>i_z = {formatDeZahl(p.iz, 2)} cm</span>
                    <span>Flansch c/t = {formatDeZahl(r.klasse?.flansch.ct ?? 0, 1)}</span><span>Steg c/t = {formatDeZahl(r.klasse?.steg.ct ?? 0, 1)}</span>
                  </div>
                  <p>
                    Querschnittsklasse unter Druck: <strong>Klasse {formatDeWert(r.klasse?.klasse ?? 0)}</strong>
                    {' '}(Flansch {formatDeWert(r.klasse?.flansch.klasse ?? 0)}, Steg {formatDeWert(r.klasse?.steg.klasse ?? 0)}; ε = {formatDeZahl(r.eps, 2)}).
                    {' '}N_c,Rd = A · f_y/γ_M0 = <strong>{formatDeZahl(r.NcRd, 1)} kN</strong>.
                  </p>
                  <p>
                    Biegung um y: Klasse {formatDeWert(biegung.klasse.klasse)}, M_pl,Rd = {formatDeZahl(biegung.MplRd, 1)} kNm,
                    {' '}M_el,Rd = {formatDeZahl(biegung.MelRd, 1)} kNm.
                  </p>
                </section>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-4">
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">Ergebnis Biegeknicken</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-slate-200">
                      <thead><tr><th className={th}>Achse</th><th className={th}>Linie</th><th className={th}>L_cr/i</th><th className={th}>N_cr [kN]</th><th className={th}>λ̄</th><th className={th}>Φ</th><th className={th}>χ</th><th className={th}>N_b,Rd [kN]</th></tr></thead>
                      <tbody>
                        {(['y', 'z'] as const).map(a => {
                          const x = r[a];
                          return (
                            <tr key={a} className={r.massgebend === a ? 'bg-shiraz/5 font-bold' : ''}>
                              <td className={td}>{a}–{a}{r.massgebend === a ? ' (maßg.)' : ''}</td>
                              <td className={td}>{x.knicklinie}</td>
                              <td className={td}>{formatDeZahl(x.lambda, 1)}</td>
                              <td className={td}>{formatDeZahl(x.Ncr, 0)}</td>
                              <td className={td}>{formatDeZahl(x.lambdaQuer, 3)}</td>
                              <td className={td}>{formatDeZahl(x.phi, 3)}</td>
                              <td className={td}>{formatDeZahl(x.chi, 3)}</td>
                              <td className={td}>{formatDeZahl(x.NbRd, 1)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className={`mt-4 p-4 rounded-xl border text-sm ${ok ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'}`} role="status">
                    <strong>{ok ? 'Nachweis erfüllt' : 'Nachweis nicht erfüllt'}:</strong>{' '}
                    N_Ed/N_b,Rd = {formatDeZahl(nEd, 0)}/{formatDeZahl(r.NbRd, 1)} = <strong>{formatDeZahl(r.ausnutzung, 2)}</strong>
                    {' '}({formatDeZahl(r.ausnutzung * 100, 0)} % Ausnutzung, maßgebend Achse {r.massgebend}–{r.massgebend})
                  </div>
                  <EingabeHinweise hinweise={r.hinweise} />
                </section>

                <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">Europäische Knicklinien χ(λ̄)</h3>
                  <div className="h-[280px] w-full relative" role="img" aria-label="Diagramm der Knicklinien a0 bis d mit den Punkten des gewählten Stabs">
                    <Line
                      data={kurven}
                      options={{
                        responsive: true, maintainAspectRatio: false, parsing: false,
                        scales: {
                          x: { type: 'linear', min: 0, max: 3, title: { display: true, text: 'bezogener Schlankheitsgrad λ̄' } },
                          y: { min: 0, max: 1.05, title: { display: true, text: 'Abminderungsbeiwert χ' } },
                        },
                        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } },
                      }}
                    />
                  </div>
                </section>

                <FormulaDerivationBox
                  live
                  title={`Ihr Rechenweg: Biegeknicken ${p.name}, ${guete}, Achse ${r.massgebend}–${r.massgebend}`}
                  zielGleichung={`N_{b,Rd} = \\frac{\\chi \\cdot A \\cdot f_y}{\\gamma_{M1}} = ${tex(r.NbRd, 1)}\\,\\text{kN}`}
                  schritte={[
                    {
                      titel: 'Bezugsschlankheit',
                      erklaerung: `Für ${guete} mit f_y = ${formatDeWert(r.fy)} N/mm² und E = 210 000 N/mm²:`,
                      formel: `\\lambda_1 = \\pi \\sqrt{\\frac{210\\,000}{${tex(r.fy, 0)}}} = ${tex(r.lambda1, 2)}`,
                    },
                    {
                      titel: 'Ideale Verzweigungslast',
                      erklaerung: `Maßgebend ist die Achse ${r.massgebend}–${r.massgebend} mit i = ${formatDeZahl(iM, 2)} cm und L_cr = ${formatDeZahl(m.Lcr, 2)} m (I = A · i²):`,
                      formel: `N_{cr} = \\frac{\\pi^2 \\cdot 210\\,000 \\cdot ${tex(p.A * 100, 0)} \\cdot ${tex(iM * 10, 1)}^2}{${tex(m.Lcr * 1000, 0)}^2} = ${tex(m.Ncr, 0)}\\,\\text{kN}`,
                    },
                    {
                      titel: 'Bezogener Schlankheitsgrad',
                      erklaerung: 'Verhältnis von plastischer Normalkraft zu Verzweigungslast:',
                      formel: `\\bar\\lambda = \\sqrt{\\frac{${tex(p.A * 100, 0)} \\cdot ${tex(r.fy, 0)}}{${tex(m.Ncr * 1000, 0)}}} = \\frac{${tex(m.lambda, 2)}}{${tex(r.lambda1, 2)}} = ${tex(m.lambdaQuer, 3)}`,
                    },
                    {
                      titel: 'Hilfswert Φ',
                      erklaerung: `Knicklinie ${m.knicklinie} mit α = ${formatDeZahl(m.alpha, 2)} (Tab. 6.1):`,
                      formel: `\\Phi = 0{,}5 \\cdot \\left[1 + ${tex(m.alpha, 2)} \\cdot (${tex(m.lambdaQuer, 3)} - 0{,}2) + ${tex(m.lambdaQuer, 3)}^2\\right] = ${tex(m.phi, 3)}`,
                    },
                    {
                      titel: 'Abminderungsbeiwert χ',
                      erklaerung: 'Gl. (6.49), höchstens 1,0:',
                      formel: `\\chi = \\frac{1}{${tex(m.phi, 3)} + \\sqrt{${tex(m.phi, 3)}^2 - ${tex(m.lambdaQuer, 3)}^2}} = ${tex(m.chi, 3)}`,
                    },
                    {
                      titel: 'Knickwiderstand und Nachweis',
                      erklaerung: `γ_M1 = 1,1 nach NA (DE); N_Ed = ${formatDeZahl(nEd, 0)} kN:`,
                      formel: `N_{b,Rd} = \\frac{${tex(m.chi, 3)} \\cdot ${tex(p.A * 100, 0)} \\cdot ${tex(r.fy, 0)}}{1{,}1} = ${tex(r.NbRd, 1)}\\,\\text{kN}, \\quad \\frac{N_{Ed}}{N_{b,Rd}} = ${tex(r.ausnutzung, 2)}`,
                    },
                  ]}
                  ergebnisHinweis="Querschnittsklasse 4 erfordert A_eff nach DIN EN 1993-1-5; Biegedrillknicken und Biegung mit Normalkraft (6.3.2, 6.3.3) sind nicht enthalten."
                  normQuelle="DIN EN 1993-1-1, 6.3.1 mit NA (DE)"
                />
              </div>
            </div>
          )}
        </div>
      </ModuleTabs>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Zugstab mit Schraubenloch – Brutto- oder Nettoquerschnitt?"
        zielGleichung="N_{t,Rd} = \min\left(\frac{A \cdot f_y}{\gamma_{M0}};\ \frac{0{,}9 \cdot A_{net} \cdot f_u}{\gamma_{M2}}\right)"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Flachstahl 120 × 10 mm, S235 (f_y = 235, f_u = 360 N/mm²), ein Loch d₀ = 22 mm im Querschnitt:', formel: 'A = 120 \\cdot 10 = 1\\,200\\,\\text{mm}^2, \\quad A_{net} = 1\\,200 - 22 \\cdot 10 = 980\\,\\text{mm}^2' },
          { titel: 'Fließen im Bruttoquerschnitt', erklaerung: 'Gl. (6.6) mit γ_M0 = 1,0:', formel: 'N_{pl,Rd} = \\frac{1\\,200 \\cdot 235}{1{,}0} = 282{,}0\\,\\text{kN}' },
          { titel: 'Bruch im Nettoquerschnitt', erklaerung: 'Gl. (6.7) mit γ_M2 = 1,25:', formel: 'N_{u,Rd} = \\frac{0{,}9 \\cdot 980 \\cdot 360}{1{,}25} = 254{,}0\\,\\text{kN}' },
          { titel: 'Ergebnis', erklaerung: 'Der kleinere Wert ist maßgebend:', formel: 'N_{t,Rd} = 254{,}0\\,\\text{kN} \\quad (N_{Ed} = 200\\,\\text{kN}: \\ 200/254{,}0 = 0{,}79)' },
        ]}
        ergebnisHinweis="Schon ein Loch macht hier den Nettoquerschnitt maßgebend, obwohl nur 18 % der Fläche fehlen: f_u/γ_M2 und der Faktor 0,9 wirken zusammen."
        normQuelle="DIN EN 1993-1-1, 6.2.3 mit NA (DE)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Biegewiderstand eines IPE 300 aus S235"
        zielGleichung="M_{c,Rd} = \frac{W_{pl,y} \cdot f_y}{\gamma_{M0}}"
        schritte={[
          { titel: 'Flansch klassifizieren', erklaerung: 'b = 150, t_w = 7,1, t_f = 10,7, r = 15 mm; ε = 1,0:', formel: 'c = \\frac{150 - 7{,}1 - 2 \\cdot 15}{2} = 56{,}5\\,\\text{mm}, \\quad \\frac{c}{t_f} = 5{,}3 \\le 9\\varepsilon \\Rightarrow \\text{Klasse 1}' },
          { titel: 'Steg klassifizieren (Biegung)', erklaerung: 'h = 300 mm:', formel: 'c = 300 - 2 \\cdot 10{,}7 - 2 \\cdot 15 = 248{,}6\\,\\text{mm}, \\quad \\frac{c}{t_w} = 35{,}0 \\le 72\\varepsilon \\Rightarrow \\text{Klasse 1}' },
          { titel: 'Plastischer Biegewiderstand', erklaerung: 'Klasse 1, W_pl,y = 628,4 cm³:', formel: 'M_{pl,Rd} = \\frac{628{,}4 \\cdot 10^3 \\cdot 235}{1{,}0} = 147{,}7\\,\\text{kNm}' },
          { titel: 'Vergleich elastisch', erklaerung: 'W_el,y = 557,1 cm³:', formel: 'M_{el,Rd} = 130{,}9\\,\\text{kNm}, \\quad \\frac{W_{pl,y}}{W_{el,y}} = 1{,}13' },
        ]}
        ergebnisHinweis="Unter reinem Druck wäre derselbe Steg (c/t = 35,0) in S235 Klasse 2, in S355 dagegen Klasse 4 (42ε = 34,2): Die Klasse hängt von Beanspruchung und Stahlgüte ab."
        normQuelle="DIN EN 1993-1-1, 5.5 und 6.2.5"
      />
      <FormulaDerivationBox
        title="Beispiel 3: Biegeknicken einer Stütze HEB 200, S235, L_cr = 4,0 m"
        zielGleichung="N_{b,Rd} = \frac{\chi \cdot A \cdot f_y}{\gamma_{M1}}"
        schritte={[
          { titel: 'Knicklinien nach Tab. 6.2', erklaerung: 'h/b = 1,0 ≤ 1,2 und t_f = 15 mm ≤ 100 mm:', formel: 'y\\text{–}y: \\ \\text{Linie b}\\ (\\alpha = 0{,}34), \\quad z\\text{–}z: \\ \\text{Linie c}\\ (\\alpha = 0{,}49)' },
          { titel: 'Schlankheit um z', erklaerung: 'i_z = 5,07 cm, λ₁ = 93,9:', formel: '\\bar\\lambda_z = \\frac{4\\,000/50{,}7}{93{,}9} = \\frac{78{,}9}{93{,}9} = 0{,}840' },
          { titel: 'Abminderungsbeiwert', erklaerung: 'Gl. (6.49):', formel: '\\Phi = 0{,}5\\,[1 + 0{,}49 \\cdot 0{,}640 + 0{,}840^2] = 1{,}010, \\quad \\chi_z = \\frac{1}{1{,}010 + \\sqrt{1{,}010^2 - 0{,}840^2}} = 0{,}637' },
          { titel: 'Knickwiderstand', erklaerung: 'A = 78,1 cm², γ_M1 = 1,1:', formel: 'N_{b,z,Rd} = \\frac{0{,}637 \\cdot 7\\,810 \\cdot 235}{1{,}1} = 1\\,063\\,\\text{kN}' },
          { titel: 'Vergleich y-Achse und Nachweis', erklaerung: 'λ̄_y = 0,499 und χ_y = 0,885 ergeben 1 476 kN; maßgebend ist z. Mit N_Ed = 800 kN:', formel: '\\frac{N_{Ed}}{N_{b,Rd}} = \\frac{800}{1\\,063} = 0{,}75 \\le 1{,}0' },
        ]}
        ergebnisHinweis="Der Querschnittswiderstand N_c,Rd = 1 835 kN wird durch das Knicken um die schwache Achse auf 58 % abgemindert."
        normQuelle="DIN EN 1993-1-1, 6.3.1 mit NA (DE)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="stahlbau_ec3" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 3.13: neues Modul; fachliche Freigabe durch den Autor ausstehend)"
        regelwerke={[
          { title: 'DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3, Teil 1-1; bauaufsichtlich eingeführt; 3.2, 5.5, 6.2, 6.3.1); neue Generation DIN EN 1993-1-1:2025-04' },
          { title: 'DIN EN 1990:2021-10 mit NA (Eurocode 0: Grundlagen der Tragwerksplanung)' },
          { title: 'DIN EN 10025-2:2019-10 (Warmgewalzte Erzeugnisse aus Baustählen – Teil 2: Unlegierte Baustähle)' },
          { title: 'DIN EN 10025-3:2019-10 (Warmgewalzte Erzeugnisse aus Baustählen – Teil 3: Normalgeglühte/normalisierend gewalzte schweißgeeignete Feinkornbaustähle)' },
        ]}
        literatur={[
          'Kindmann, R.; Krahwinkel, M.: Stahl- und Verbundkonstruktionen – Hallen-, Geschoss- und Brückenbau. 3., vollst. überarb. u. aktual. Aufl., Wiesbaden: Springer Vieweg 2016',
          'Wagenknecht, G.: Stahlbau-Praxis nach Eurocode 3. Band 1: Tragwerksplanung, Grundlagen, 6., überarb. u. erw. Aufl.; Band 2: Verbindungen und Konstruktionen, 5., überarb. u. erw. Aufl.; Band 3: Komponentenmethode, 2. Aufl. Berlin: Beuth 2021',
          'Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024',
        ]}
        weblinks={[
          { title: 'stad: Technische Daten IPE-Profile', url: 'https://www.stad.fr/en/sections-products-ranges-ipe' },
          { title: 'stad: Technische Daten HE-Profile', url: 'https://www.stad.fr/en/sections-products-ranges-he' },
        ]}
        formeln={[
          { formel: 'N_{t,Rd} = \\min\\left(\\frac{A f_y}{\\gamma_{M0}};\\ \\frac{0{,}9\\,A_{net} f_u}{\\gamma_{M2}}\\right)', erklaerung: 'Zugbeanspruchbarkeit: Fließen im Brutto- bzw. Bruch im Nettoquerschnitt; γ_M0 = 1,0, γ_M2 = 1,25.', quelle: 'DIN EN 1993-1-1, Gl. (6.6), (6.7)' },
          { formel: 'M_{c,Rd} = \\frac{W_{pl} f_y}{\\gamma_{M0}}\\ (\\text{Kl. 1, 2}); \\quad \\frac{W_{el,min} f_y}{\\gamma_{M0}}\\ (\\text{Kl. 3})', erklaerung: 'Biegewiderstand des Querschnitts in Abhängigkeit von der Querschnittsklasse.', quelle: 'DIN EN 1993-1-1, Gl. (6.13), (6.14)' },
          { formel: '\\bar\\lambda = \\sqrt{\\frac{A f_y}{N_{cr}}}, \\quad \\chi = \\frac{1}{\\Phi + \\sqrt{\\Phi^2 - \\bar\\lambda^2}}, \\quad N_{b,Rd} = \\frac{\\chi A f_y}{\\gamma_{M1}}', erklaerung: 'Biegeknicken mit Φ = 0,5·[1 + α(λ̄ − 0,2) + λ̄²], α nach Tab. 6.1, γ_M1 = 1,1 nach NA (DE).', quelle: 'DIN EN 1993-1-1, Gl. (6.47)–(6.50)' },
        ]}
      />
    </div>
  );
}
