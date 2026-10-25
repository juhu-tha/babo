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
import inhalt from '@/content/stahlbauec3/StahlbauEC3.json';
import { MdText } from '@/src/components/inhalt/MdText';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

type Reiter = 'einfuehrung' | 'grundlagen' | 'kennwerte' | 'rechner';
const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Einführung', icon: BookOpen },
  { id: 'grundlagen', label: 'Grundlagen', icon: Layers },
  { id: 'kennwerte', label: inhalt.werte.kennwerteTabellen, icon: Table2 },
  { id: 'rechner', label: inhalt.werte.rechnerBiegeknicken, icon: Calculator },
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
          label: inhalt.werte.ihrStabYUnd,
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
          <Columns className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.stahlbauNachEurocode3} /></h2>
        <p className="text-xs text-text-main/60 font-mono mt-1"><MdText text={inhalt.texte.dinEn19931} /></p>
      </div>

      <ModuleTabs label={inhalt.werte.stahlbauNachEurocode3} tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
        <div className="flex flex-col gap-6 mt-5">
          {reiter === 'einfuehrung' && (
            <>
              <Karte titel={inhalt.werte.worumEsGeht}>
                <p><MdText text={inhalt.texte.stahltragwerkeWerdenInDeutschland} /></p>
                <p><MdText text={inhalt.texte.alleNachweiseFolgenDem} /></p>
                <Formel math="\frac{E_d}{R_d} \le 1{,}0 \quad \text{mit} \quad R_d = \frac{R_k}{\gamma_M}" />
              </Karte>
              <Karte titel={inhalt.werte.teilsicherheitsbeiwerteNachNaDe}>
                <ul className="list-disc pl-5 space-y-1">
                  <li><FormulaText text="$\gamma_{M0} = 1{,}0$" /><MdText text={inhalt.texte.beanspruchbarkeitVonQuerschnittenFließen} /></li>
                  <li><FormulaText text="$\gamma_{M1} = 1{,}1$" /><MdText text={inhalt.texte.stabilitätsversagenBiegeknickenBiegedril} /></li>
                  <li><FormulaText text="$\gamma_{M2} = 1{,}25$" /><MdText text={inhalt.texte.bruchDesNettoquerschnittsUnter} /></li>
                </ul>
                <p><MdText text={inhalt.texte.derGrößereBeiwertBeim} /></p>
              </Karte>
              <Karte titel={inhalt.werte.nachweisablaufInDiesemModul}>
                <ol className="list-decimal pl-5 space-y-1">
                  <li><MdText text={inhalt.texte.stahlgüteFestlegenStreckgrenze} /><FormulaText text="$f_y$" /><MdText text={inhalt.texte.undZugfestigkeit} /><FormulaText text="$f_u$" /><MdText text={inhalt.texte.nachTab31} /></li>
                  <li><MdText text={inhalt.texte.querschnittKlassifizierenTab5} /></li>
                  <li><MdText text={inhalt.texte.querschnittsnachweiseZug62} /></li>
                  <li><MdText text={inhalt.texte.stabilitätsnachweisBiegeknicken63} /></li>
                </ol>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.dieZweiteEurocodeGeneration} /></p>
              </Karte>
              <Querverweis ziel="knicken" titel={inhalt.werte.idealeKnicklastNachEuler} linkText={inhalt.werte.zumModulKnickenEuler}>
                <p><MdText text={inhalt.texte.dieEulerFälleUnd} /></p>
              </Querverweis>
            </>
          )}

          {reiter === 'grundlagen' && (
            <>
              <Karte titel="1 Werkstoff">
                <p><MdText text={inhalt.texte.baustahlWirdFürDie} /><FormulaText text="$f_y$" /><MdText text={inhalt.texte.undDerZugfestigkeit} /><FormulaText text="$f_u$" /><MdText text={inhalt.texte.nachTab312} /></p>
                <Formel math="E = 210\,000\ \text{N/mm}^2, \quad G \approx 81\,000\ \text{N/mm}^2, \quad \nu = 0{,}3" />
                <p><MdText text={inhalt.texte.dieStahlgüteGehtIn} /></p>
                <Formel math="\varepsilon = \sqrt{\frac{235}{f_y}} \qquad (S235: 1{,}00;\ S355: 0{,}81;\ S460: 0{,}71)" />
              </Karte>
              <Karte titel={inhalt.werte.t2Querschnittsklassen}>
                <p><MdText text={inhalt.texte.dünnwandigeDruckbeanspruchteQuerschnitts} /></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><MdText text={inhalt.texte.klasse1PlastischesMoment} /></li>
                  <li><MdText text={inhalt.texte.klasse2PlastischesMoment} /></li>
                  <li><MdText text={inhalt.texte.klasse3FließenNur} /></li>
                  <li><MdText text={inhalt.texte.klasse4ÖrtlichesBeulen} /></li>
                </ul>
                <p><MdText text={inhalt.texte.eingestuftWirdJedesDruckbeanspruchte} /></p>
                <Formel math="\text{Flansch (einseitig gestützt): } c = \frac{b - t_w - 2r}{2}, \qquad \text{Steg (beidseitig gestützt): } c = h - 2t_f - 2r" />
              </Karte>
              <Karte titel="3 Zugstab">
                <p><MdText text={inhalt.texte.derBemessungswertDerZugbeanspruchbarkeit} /></p>
                <Formel math="N_{t,Rd} = \min\left(N_{pl,Rd} = \frac{A \cdot f_y}{\gamma_{M0}};\ N_{u,Rd} = \frac{0{,}9 \cdot A_{net} \cdot f_u}{\gamma_{M2}}\right)" />
                <p><MdText text={inhalt.texte.aNetIstDie} /></p>
              </Karte>
              <Karte titel={inhalt.werte.t4BiegungUmDie}>
                <p><MdText text={inhalt.texte.derBiegewiderstandHängtVon} /></p>
                <Formel math="M_{c,Rd} = M_{pl,Rd} = \frac{W_{pl} \cdot f_y}{\gamma_{M0}}\ \ (\text{Kl. } 1, 2), \qquad M_{c,Rd} = M_{el,Rd} = \frac{W_{el,min} \cdot f_y}{\gamma_{M0}}\ \ (\text{Kl. } 3)" />
                <p><MdText text={inhalt.texte.beiWalzprofilenIstW} /></p>
              </Karte>
              <Karte titel={inhalt.werte.t5Biegeknicken}>
                <p><MdText text={inhalt.texte.realeDruckstäbeSindNie} /></p>
                <Formel math="N_{cr} = \frac{\pi^2 \cdot E \cdot I}{L_{cr}^2}, \qquad \bar\lambda = \sqrt{\frac{A \cdot f_y}{N_{cr}}} = \frac{L_{cr}}{i \cdot \lambda_1}, \qquad \lambda_1 = \pi\sqrt{\frac{E}{f_y}} = 93{,}9\,\varepsilon" />
                <Formel math="\Phi = 0{,}5\left[1 + \alpha\,(\bar\lambda - 0{,}2) + \bar\lambda^2\right], \qquad \chi = \frac{1}{\Phi + \sqrt{\Phi^2 - \bar\lambda^2}} \le 1{,}0 \quad \text{(Gl. 6.49)}" />
                <Formel math="N_{b,Rd} = \frac{\chi \cdot A \cdot f_y}{\gamma_{M1}} \quad \text{(Kl. 1–3)}, \qquad \frac{N_{Ed}}{N_{b,Rd}} \le 1{,}0" />
                <p><MdText text={inhalt.texte.derImperfektionsbeiwertTab6} /></p>
              </Karte>
            </>
          )}

          {reiter === 'kennwerte' && (
            <>
              <Karte titel={inhalt.werte.stahlgütenTab31}>
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
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.für40MmT} /></p>
              </Karte>
              <Karte titel={inhalt.werte.grenzwerteCTFür}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200">
                    <thead><tr><th className={th}>Querschnittsteil</th><th className={th}>Beanspruchung</th><th className={th}>Klasse 1</th><th className={th}>Klasse 2</th><th className={th}>Klasse 3</th></tr></thead>
                    <tbody>
                      <tr><td className={td}><MdText text={inhalt.texte.stegBeidseitigGestützt} /></td><td className={td}>Biegung</td><td className={td}>72ε</td><td className={td}>83ε</td><td className={td}>124ε</td></tr>
                      <tr><td className={td}><MdText text={inhalt.texte.stegBeidseitigGestützt2} /></td><td className={td}>Druck</td><td className={td}>33ε</td><td className={td}>38ε</td><td className={td}>42ε</td></tr>
                      <tr><td className={td}><MdText text={inhalt.texte.flanschEinseitigGestützt} /></td><td className={td}>Druck</td><td className={td}>9ε</td><td className={td}>10ε</td><td className={td}>14ε</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.wirdDerGrenzwertDer} /></p>
              </Karte>
              <Karte titel={inhalt.werte.knicklinienUndImperfektionsbeiwerteTab}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200">
                    <thead><tr><th className={th}>Knicklinie</th>{KNICKLINIEN.map(k => <th key={k} className={th}>{k}</th>)}</tr></thead>
                    <tbody>
                      <tr><td className={td}>α</td>{KNICKLINIEN.map(k => <td key={k} className={td}>{formatDeZahl(ALPHA[k], 2)}</td>)}</tr>
                      <tr><td className={td}><MdText text={inhalt.texte.bei10} /></td>{KNICKLINIEN.map(k => <td key={k} className={td}>{formatDeZahl(chi(1, ALPHA[k]).chi, 3)}</td>)}</tr>
                    </tbody>
                  </table>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200">
                    <thead><tr><th className={th}><MdText text={inhalt.texte.gewalzteIQuerschnitte} /></th><th className={th}>Achse</th><th className={th}><MdText text={inhalt.texte.s235BisS420} /></th><th className={th}>S460</th></tr></thead>
                    <tbody>
                      <tr><td className={td}><MdText text={inhalt.texte.hB12} /></td><td className={td}>y–y / z–z</td><td className={td}>a / b</td><td className={td}>a0 / a0</td></tr>
                      <tr><td className={td}><MdText text={inhalt.texte.hB122} /></td><td className={td}>y–y / z–z</td><td className={td}>b / c</td><td className={td}>a / a</td></tr>
                      <tr><td className={td}><MdText text={inhalt.texte.hB123} /></td><td className={td}>y–y / z–z</td><td className={td}>b / c</td><td className={td}>a / a</td></tr>
                      <tr><td className={td}><MdText text={inhalt.texte.hB124} /></td><td className={td}>y–y / z–z</td><td className={td}>d / d</td><td className={td}>c / c</td></tr>
                    </tbody>
                  </table>
                </div>
              </Karte>
              <Karte titel={inhalt.werte.querschnittswerteDerWalzprofileIm}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-slate-200">
                    <thead>
                      <tr>
                        <th className={th}>Profil</th><th className={th}>h × b [mm]</th><th className={th}><MdText text={inhalt.texte.tWTF} /></th><th className={th}>A [cm²]</th>
                        <th className={th}>I_y [cm⁴]</th><th className={th}><MdText text={inhalt.texte.wElYW} /></th><th className={th}>i_y [cm]</th><th className={th}>I_z [cm⁴]</th><th className={th}>i_z [cm]</th>
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
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.querschnittswerteNachHerstellerprofiltab} /></p>
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
                  {zahlFeld(inhalt.werte.knicklängeLCrY, LcrY, setLcrY, 0.5, 12, 0.25, 'm')}
                  {zahlFeld(inhalt.werte.knicklängeLCrZ, LcrZ, setLcrZ, 0.5, 12, 0.25, 'm')}
                  {zahlFeld(inhalt.werte.druckkraftNEd, nEd, setNEd, 0, 4000, 10, 'kN')}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <input type="checkbox" checked={autoLinie} onChange={e => setAutoLinie(e.target.checked)} /><MdText text={inhalt.texte.knicklinienNachTab6} />{r.vorschlagY}, z: {r.vorschlagZ})
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
                    <span><MdText text={inhalt.texte.flanschCT} />{formatDeZahl(r.klasse?.flansch.ct ?? 0, 1)}</span><span>Steg c/t = {formatDeZahl(r.klasse?.steg.ct ?? 0, 1)}</span>
                  </div>
                  <p><MdText text={inhalt.texte.querschnittsklasseUnterDruck} /><strong>Klasse {formatDeWert(r.klasse?.klasse ?? 0)}</strong>
                    {' '}(Flansch {formatDeWert(r.klasse?.flansch.klasse ?? 0)}, Steg {formatDeWert(r.klasse?.steg.klasse ?? 0)}; ε = {formatDeZahl(r.eps, 2)}<MdText text={inhalt.texte.nCRdA} /><strong>{formatDeZahl(r.NcRd, 1)} kN</strong>.
                  </p>
                  <p><MdText text={inhalt.texte.biegungUmYKlasse} />{formatDeWert(biegung.klasse.klasse)}, M_pl,Rd = {formatDeZahl(biegung.MplRd, 1)}<MdText text={inhalt.texte.knmMElRd} />{formatDeZahl(biegung.MelRd, 1)} kNm.
                  </p>
                </section>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-4">
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3"><MdText text={inhalt.texte.ergebnisBiegeknicken} /></h3>
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
                    <strong>{ok ? inhalt.werte.nachweisErfüllt : inhalt.werte.nachweisNichtErfüllt}:</strong><MdText text={inhalt.texte.nEdNB} />{formatDeZahl(nEd, 0)}/{formatDeZahl(r.NbRd, 1)} = <strong>{formatDeZahl(r.ausnutzung, 2)}</strong>
                    {' '}({formatDeZahl(r.ausnutzung * 100, 0)}<MdText text={inhalt.texte.ausnutzungMaßgebendAchse} />{r.massgebend}–{r.massgebend})
                  </div>
                  <EingabeHinweise hinweise={r.hinweise} />
                </section>

                <section className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3"><MdText text={inhalt.texte.europäischeKnicklinien} /></h3>
                  <div className="h-[280px] w-full relative" role="img" aria-label={inhalt.werte.diagrammDerKnicklinienA0}>
                    <Line
                      data={kurven}
                      options={{
                        responsive: true, maintainAspectRatio: false, parsing: false,
                        scales: {
                          x: { type: 'linear', min: 0, max: 3, title: { display: true, text: inhalt.werte.bezogenerSchlankheitsgrad } },
                          y: { min: 0, max: 1.05, title: { display: true, text: inhalt.werte.abminderungsbeiwert } },
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
                      titel: inhalt.werte.idealeVerzweigungslast,
                      erklaerung: `Maßgebend ist die Achse ${r.massgebend}–${r.massgebend} mit i = ${formatDeZahl(iM, 2)} cm und L_cr = ${formatDeZahl(m.Lcr, 2)} m (I = A · i²):`,
                      formel: `N_{cr} = \\frac{\\pi^2 \\cdot 210\\,000 \\cdot ${tex(p.A * 100, 0)} \\cdot ${tex(iM * 10, 1)}^2}{${tex(m.Lcr * 1000, 0)}^2} = ${tex(m.Ncr, 0)}\\,\\text{kN}`,
                    },
                    {
                      titel: inhalt.werte.bezogenerSchlankheitsgrad2,
                      erklaerung: inhalt.werte.verhältnisVonPlastischerNormalkraft,
                      formel: `\\bar\\lambda = \\sqrt{\\frac{${tex(p.A * 100, 0)} \\cdot ${tex(r.fy, 0)}}{${tex(m.Ncr * 1000, 0)}}} = \\frac{${tex(m.lambda, 2)}}{${tex(r.lambda1, 2)}} = ${tex(m.lambdaQuer, 3)}`,
                    },
                    {
                      titel: 'Hilfswert Φ',
                      erklaerung: `Knicklinie ${m.knicklinie} mit α = ${formatDeZahl(m.alpha, 2)} (Tab. 6.1):`,
                      formel: `\\Phi = 0{,}5 \\cdot \\left[1 + ${tex(m.alpha, 2)} \\cdot (${tex(m.lambdaQuer, 3)} - 0{,}2) + ${tex(m.lambdaQuer, 3)}^2\\right] = ${tex(m.phi, 3)}`,
                    },
                    {
                      titel: inhalt.werte.abminderungsbeiwert2,
                      erklaerung: inhalt.werte.gl649Höchstens,
                      formel: `\\chi = \\frac{1}{${tex(m.phi, 3)} + \\sqrt{${tex(m.phi, 3)}^2 - ${tex(m.lambdaQuer, 3)}^2}} = ${tex(m.chi, 3)}`,
                    },
                    {
                      titel: inhalt.werte.knickwiderstandUndNachweis,
                      erklaerung: `γ_M1 = 1,1 nach NA (DE); N_Ed = ${formatDeZahl(nEd, 0)} kN:`,
                      formel: `N_{b,Rd} = \\frac{${tex(m.chi, 3)} \\cdot ${tex(p.A * 100, 0)} \\cdot ${tex(r.fy, 0)}}{1{,}1} = ${tex(r.NbRd, 1)}\\,\\text{kN}, \\quad \\frac{N_{Ed}}{N_{b,Rd}} = ${tex(r.ausnutzung, 2)}`,
                    },
                  ]}
                  ergebnisHinweis={inhalt.werte.querschnittsklasse4ErfordertA}
                  normQuelle={inhalt.werte.dinEn19931}
                />
              </div>
            </div>
          )}
        </div>
      </ModuleTabs>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1ZugstabMit}
        zielGleichung="N_{t,Rd} = \min\left(\frac{A \cdot f_y}{\gamma_{M0}};\ \frac{0{,}9 \cdot A_{net} \cdot f_u}{\gamma_{M2}}\right)"
        schritte={inhalt.daten["StahlbauEC3.schritte"]}
        ergebnisHinweis={inhalt.werte.schonEinLochMacht}
        normQuelle={inhalt.werte.dinEn199312}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2BiegewiderstandEines}
        zielGleichung="M_{c,Rd} = \frac{W_{pl,y} \cdot f_y}{\gamma_{M0}}"
        schritte={inhalt.daten["StahlbauEC3.schritte_2"]}
        ergebnisHinweis={inhalt.werte.unterReinemDruckWäre}
        normQuelle={inhalt.werte.dinEn199313}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel3BiegeknickenEiner}
        zielGleichung="N_{b,Rd} = \frac{\chi \cdot A \cdot f_y}{\gamma_{M1}}"
        schritte={inhalt.daten["StahlbauEC3.schritte_3"]}
        ergebnisHinweis={inhalt.werte.derQuerschnittswiderstandNC}
        normQuelle={inhalt.werte.dinEn199314}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="stahlbau_ec3" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap3}
        regelwerke={inhalt.daten["StahlbauEC3.regelwerke"]}
        literatur={inhalt.daten["StahlbauEC3.literatur"]}
        weblinks={[
          { title: inhalt.werte.stadTechnischeDatenIpe, url: 'https://www.stad.fr/en/sections-products-ranges-ipe' },
          { title: inhalt.werte.stadTechnischeDatenHe, url: 'https://www.stad.fr/en/sections-products-ranges-he' },
        ]}
        formeln={inhalt.daten["StahlbauEC3.formeln"]}
      />
    </div>
  );
}
