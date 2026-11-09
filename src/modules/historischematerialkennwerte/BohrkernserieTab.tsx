import React, { useMemo, useState } from 'react';
import { BlockMath } from 'react-katex';
import { AlertTriangle, ClipboardList, FlaskConical, Sigma } from 'lucide-react';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { AuswahlGruppe, alsOption } from '@/src/components/ui/Auswahlgruppe';
import { MdText } from '@/src/components/inhalt/MdText';
import { EcKennwerteVerweis } from '@/src/components/ui/EcKennwerteVerweis';
import { formatDeTeX, formatDeZahl } from '@/src/utils/numberFormat';
import {
  bohrkernserie13791, LEHRBEISPIELE_13791, KERNLAENGENFAKTOR_11, V_MIN_13791,
  type Ansatz13791, type Bezug13791,
} from '@/src/calc/bohrkernserie13791';
import inhalt from '@/content/historischematerialkennwerte/BohrkernserieTab.json';
import { ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

// Reiter „Bohrkernserie (DIN EN 13791)“ im Modul Historische Kennwerte (Ergänzung 02.11.2026).
// Rechenkern: src/calc/bohrkernserie13791.ts (nutzt insituDruckfestigkeit13791 aus bauwerksuntersuchung.ts).

const ANSAETZE: readonly { id: Ansatz13791; label: string }[] = [
  { id: 'kerne', label: inhalt.werte.ansatzKerne },
  { id: 'kleinerBereich', label: inhalt.werte.ansatzKlein },
  { id: 'indirektKerne', label: inhalt.werte.ansatzIndirekt },
];
const BEZUEGE: readonly { id: Bezug13791; label: string }[] = [
  { id: 'zylinder', label: inhalt.werte.bezugZylinder },
  { id: 'wuerfel', label: inhalt.werte.bezugWuerfel },
  { id: 'kern11', label: inhalt.werte.bezugKern11 },
];
const MASSGEBEND: Record<string, string> = {
  streuung: inhalt.werte.massgebendStreuung,
  kleinstwert: inhalt.werte.massgebendKleinstwert,
  kleinstwertBereich: inhalt.werte.massgebendKleinBereich,
  mittelBereich: inhalt.werte.massgebendMittelBereich,
};

/** Text → Zahlen; nicht lesbare Einträge werden NaN (der Kern meldet dann einen Fehler statt sie still zu verwerfen) */
const leseWerte = (t: string) => t.split(/[;\s]+/).filter(Boolean).map(x => Number(x.replace(',', '.')));
const alsText = (w: readonly number[]) => w.map(v => formatDeZahl(v, 1)).join('; ');

const START = LEHRBEISPIELE_13791[0].eingabe;

export function BohrkernserieTab() {
  const [werteText, setWerteText] = useState(alsText(START.werte));
  const [ansatz, setAnsatz] = useState<Ansatz13791>(START.ansatz);
  const [bezug, setBezug] = useState<Bezug13791>(START.bezug);
  const [durchmesser, setDurchmesser] = useState(START.durchmesserMm);
  const [groesstkorn, setGroesstkorn] = useState(START.groesstkornMm);
  const [volumen, setVolumen] = useState(START.volumenM3);
  const [mindestStreuung, setMindestStreuung] = useState(START.mindestStreuung);
  const [beispiel, setBeispiel] = useState<string | null>(LEHRBEISPIELE_13791[0].id);

  const ladeBeispiel = (id: string) => {
    const b = LEHRBEISPIELE_13791.find(x => x.id === id);
    if (!b) return;
    const e = b.eingabe;
    setWerteText(alsText(e.werte)); setAnsatz(e.ansatz); setBezug(e.bezug); setDurchmesser(e.durchmesserMm);
    setGroesstkorn(e.groesstkornMm); setVolumen(e.volumenM3); setMindestStreuung(e.mindestStreuung); setBeispiel(id);
  };
  const eigene = () => setBeispiel(null);

  const r = useMemo(() => bohrkernserie13791({
    werte: leseWerte(werteText), ansatz, bezug, durchmesserMm: durchmesser, groesstkornMm: groesstkorn, volumenM3: volumen, mindestStreuung,
  }), [werteText, ansatz, bezug, durchmesser, groesstkorn, volumen, mindestStreuung]);

  const fehler = r.hinweise.filter(h => h.stufe === 'fehler');
  const warnungen = r.hinweise.filter(h => h.stufe === 'warnung');
  const unterMindest = Number.isFinite(r.nMin) && r.n < r.nMin;
  const klasseText = r.klasse === null ? inhalt.werte.unterC8 : r.klasse;
  const fv = bezug === 'wuerfel' ? 'f_{\\mathrm{ck,cube}}' : 'f_{\\mathrm{ck}}';
  const faktorSchritt = bezug === 'kern11'
    ? [{ titel: 'Umrechnung h/d = 1 → 2', erklaerung: 'Jeder Kernwert mit dem Kernlängenfaktor multipliziert (vorläufig, Normprüfung ausstehend).', formel: `f_{\\mathrm{is}} = ${formatDeTeX(KERNLAENGENFAKTOR_11, 2)} \\cdot f_{\\mathrm{Kern},1:1}` }]
    : [];
  const schritteKerne = [
    ...faktorSchritt,
    { titel: 'Mittelwert', erklaerung: `n = ${formatDeZahl(r.n, 0)} Kerne`, formel: `f_{\\mathrm{m(n),is}} = \\frac{1}{n}\\sum f_{\\mathrm{is},i} = ${formatDeTeX(r.mittel, 2)}`, einheit: 'N/mm²' },
    { titel: 'Standardabweichung', erklaerung: mindestStreuung ? 'gemessen und Untergrenze 8 % des Mittelwerts' : 'gemessen (ohne Untergrenze)', formel: `s = ${formatDeTeX(r.s, 2)};\\; s_{\\min} = ${formatDeTeX(V_MIN_13791, 2)} \\cdot ${formatDeTeX(r.mittel, 2)} = ${formatDeTeX(r.sMin, 2)} \\;\\Rightarrow\\; s_{\\mathrm{an}} = ${formatDeTeX(r.sEff, 2)}`, einheit: 'N/mm²' },
    { titel: 'Streuungskriterium', erklaerung: `k_n für n = ${formatDeZahl(r.n, 0)}`, formel: `f_{\\mathrm{m(n),is}} - k_n \\cdot s_{\\mathrm{an}} = ${formatDeTeX(r.mittel, 2)} - ${formatDeTeX(r.kn, 2)} \\cdot ${formatDeTeX(r.sEff, 2)} = ${formatDeTeX(r.ausStreuung, 2)}`, einheit: 'N/mm²' },
    { titel: 'Kleinstwertkriterium', erklaerung: 'M nach dem kleinsten Einzelwert', formel: `f_{\\mathrm{is,lowest}} + M = ${formatDeTeX(r.kleinster, 2)} + ${formatDeTeX(r.M, 0)} = ${formatDeTeX(r.ausKleinstwert, 2)}`, einheit: 'N/mm²' },
    { titel: 'Charakteristischer Wert', erklaerung: 'kleinerer der beiden Werte', formel: `f_{\\mathrm{ck,is}} = \\min(${formatDeTeX(r.ausStreuung, 2)};\\; ${formatDeTeX(r.ausKleinstwert, 2)}) = ${formatDeTeX(r.fckIs, 2)}`, einheit: 'N/mm²' },
  ];
  const schritteKlein = [
    ...faktorSchritt,
    { titel: 'Spannweite', erklaerung: 'höchstens 15 % des Mittelwerts', formel: `\\frac{f_{\\max} - f_{\\min}}{f_{\\mathrm{m(n),is}}} = \\frac{${formatDeTeX(r.groesster, 2)} - ${formatDeTeX(r.kleinster, 2)}}{${formatDeTeX(r.mittel, 2)}} = ${formatDeTeX(r.spannweiteRel * 100, 1)}\\,\\%` },
    { titel: 'Charakteristischer Wert', erklaerung: ansatz === 'kleinerBereich' ? 'kleinster Kernwert' : 'Mittelwert der Kerne an der schwächsten Stelle', formel: `f_{\\mathrm{ck,is}} = ${formatDeTeX(r.fckIs, 2)}`, einheit: 'N/mm²' },
  ];
  const schritte = [
    ...(ansatz === 'kerne' ? schritteKerne : schritteKlein),
    { titel: 'Zuordnung', erklaerung: `${klasseText}: Verhältnis zur Klasse mindestens 0,85`, formel: `\\frac{f_{\\mathrm{ck,is}}}{${fv}} = \\frac{${formatDeTeX(r.fckIs, 2)}}{${formatDeTeX(r.fckVergleich, 0)}} = ${formatDeTeX(r.verhaeltnis, 3)} \\ge 0{,}85` },
  ];

  const feld = 'mt-1 w-full p-2 border border-home-grau/30 rounded-lg text-sm bg-white text-text-main';
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-text-main">{inhalt.texte.titel}</h3>
        <p className="text-sm text-text-main/90 leading-relaxed"><MdText text={inhalt.texte.einleitung} /></p>
        <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-900 flex gap-2" role="note">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          <p><MdText text={inhalt.texte.vorlaeufig} /></p>
        </div>
      </section>

      {/* 1 Prüfbereich und Anzahl der Proben */}
      <section className="space-y-3">
        <h4 className="text-base font-bold text-text-main flex items-center gap-2"><ClipboardList size={18} className="text-shiraz" aria-hidden="true" />{inhalt.texte.hProbenanzahl}</h4>
        <p className="text-sm text-text-main/90 leading-relaxed"><MdText text={inhalt.texte.prüfbereich} /></p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-home-grau/30 rounded-lg">
            <thead className="bg-off-white text-text-main">
              <tr><th scope="col" className="p-2 text-left">Merkmal</th><th scope="col" className="p-2 text-left">Anforderung</th><th scope="col" className="p-2 text-left">Beleg</th></tr>
            </thead>
            <tbody>
              {inhalt.daten.probenanzahl.map(z => (
                <tr key={z.merkmal} className="border-t border-home-grau/20 align-top">
                  <td className="p-2 font-semibold text-text-main"><MdText text={z.merkmal} /></td>
                  <td className="p-2 text-text-main/90"><MdText text={z.wert} /></td>
                  <td className="p-2 text-home-grau">{z.quelle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-text-main/90 leading-relaxed"><MdText text={inhalt.texte.entnahme} /></p>
        <h5 className="text-sm font-bold text-text-main">{inhalt.texte.hAnsaetze}</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {inhalt.daten.ansaetze.map(a => (
            <div key={a.titel} className="p-3 rounded-xl border border-home-grau/30 bg-off-white">
              <div className="text-xs font-bold text-shiraz mb-1">{a.titel}</div>
              <p className="text-xs text-text-main/90 leading-relaxed"><MdText text={a.text} /></p>
            </div>
          ))}
        </div>
      </section>

      {/* 2 Statistik */}
      <section className="space-y-3">
        <h4 className="text-base font-bold text-text-main flex items-center gap-2"><Sigma size={18} className="text-shiraz" aria-hidden="true" /><span><MdText text={inhalt.texte.hStatistik} /></span></h4>
        <div className="p-3 rounded-xl border border-home-grau/30 bg-white overflow-x-auto">
          <BlockMath math={'f_{\\mathrm{ck,is}} = \\min\\left(f_{\\mathrm{m(n),is}} - k_n \\cdot s;\\; f_{\\mathrm{is,lowest}} + M\\right) \\quad\\text{mit}\\quad s \\ge 0{,}08 \\cdot f_{\\mathrm{m(n),is}}'} />
        </div>
        <p className="text-sm text-text-main/90 leading-relaxed"><MdText text={inhalt.texte.statistikText} /></p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <table className="text-xs border border-home-grau/30">
            <caption className="text-left text-xs font-bold text-text-main pb-1"><i>k</i><sub>n</sub> (Student-Quantil, 5 %)</caption>
            <thead className="bg-off-white"><tr><th scope="col" className="p-1.5 text-left">n</th>{inhalt.daten.kn.map(z => <th scope="col" key={z.n} className="p-1.5">{z.n}</th>)}</tr></thead>
            <tbody><tr className="border-t border-home-grau/20"><th scope="row" className="p-1.5 text-left"><i>k</i><sub>n</sub></th>{inhalt.daten.kn.map(z => <td key={z.n} className="p-1.5 text-center font-mono">{z.k}</td>)}</tr></tbody>
          </table>
          <table className="text-xs border border-home-grau/30">
            <caption className="text-left text-xs font-bold text-text-main pb-1">Zuschlag <i>M</i> in N/mm²</caption>
            <tbody>{inhalt.daten.m.map(z => <tr key={z.bereich} className="border-t border-home-grau/20"><th scope="row" className="p-1.5 text-left font-normal"><MdText text={z.bereich} /></th><td className="p-1.5 text-center font-mono">{z.M}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="text-sm text-text-main/90 leading-relaxed"><MdText text={inhalt.texte.mindestStreuungText} /></p>
        <p className="text-sm text-text-main/90 leading-relaxed"><MdText text={inhalt.texte.zuordnungText} /></p>
        <p className="text-sm text-text-main/90 leading-relaxed"><MdText text={inhalt.texte.bezugText} /></p>
      </section>

      {/* 3 Rechner */}
      <section className="space-y-4">
        <h4 className="text-base font-bold text-text-main flex items-center gap-2"><FlaskConical size={18} className="text-shiraz" aria-hidden="true" />{inhalt.texte.hRechner}</h4>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-text-main">{inhalt.texte.lehrbeispiele}</span>
          <AuswahlGruppe label={inhalt.texte.lehrbeispiele} className="flex flex-wrap gap-2">
            {LEHRBEISPIELE_13791.map(b => (
              <button key={b.id} type="button" {...alsOption(beispiel === b.id)} onClick={() => ladeBeispiel(b.id)}
                className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${beispiel === b.id ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz'}`}>{b.titel}</button>
            ))}
            <button type="button" {...alsOption(beispiel === null)} onClick={eigene}
              className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${beispiel === null ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz'}`}>{inhalt.texte.eigeneWerte}</button>
          </AuswahlGruppe>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3 p-4 rounded-2xl border border-home-grau/30 bg-off-white">
            <label className="block text-xs text-text-main font-semibold"><MdText text={inhalt.texte.werteLabel} />
              <textarea value={werteText} onChange={e => { setWerteText(e.target.value); eigene(); }} rows={3} className={`${feld} font-mono`} />
            </label>
            <div>
              <span id="bks-ansatz" className="block text-xs text-text-main font-semibold mb-1">{inhalt.texte.ansatzLabel}</span>
              <AuswahlGruppe aria-labelledby="bks-ansatz" className="flex flex-col gap-1.5">
                {ANSAETZE.map(a => (
                  <button key={a.id} type="button" {...alsOption(ansatz === a.id)} onClick={() => { setAnsatz(a.id); eigene(); }}
                    className={`text-left px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${ansatz === a.id ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz'}`}>{a.label}</button>
                ))}
              </AuswahlGruppe>
            </div>
            <label className="block text-xs text-text-main font-semibold">{inhalt.texte.bezugLabel}
              <select value={bezug} onChange={e => { setBezug(e.target.value as Bezug13791); eigene(); }} className={feld}>
                {BEZUEGE.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className="block text-xs text-text-main font-semibold">{inhalt.texte.durchmesserLabel}
                <input type="number" min={50} step={1} value={durchmesser} onChange={e => { setDurchmesser(Number(e.target.value)); eigene(); }} className={feld} />
              </label>
              <label className="block text-xs text-text-main font-semibold"><MdText text={inhalt.texte.groesstkornLabel} />
                <input type="number" min={1} step={1} value={groesstkorn} onChange={e => { setGroesstkorn(Number(e.target.value)); eigene(); }} className={feld} />
              </label>
              <label className="block text-xs text-text-main font-semibold">{inhalt.texte.volumenLabel}
                <input type="number" min={1} step={1} value={volumen} onChange={e => { setVolumen(Number(e.target.value)); eigene(); }} className={feld} />
              </label>
            </div>
            <label className="flex items-start gap-2 text-xs text-text-main">
              <input type="checkbox" checked={mindestStreuung} disabled={ansatz !== 'kerne'} onChange={e => { setMindestStreuung(e.target.checked); eigene(); }} className="mt-0.5 accent-shiraz" />
              <span><MdText text={inhalt.texte.mindestStreuungLabel} /></span>
            </label>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {unterMindest && (
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-900 font-semibold flex gap-2" role="alert">
                <AlertTriangle size={16} className="shrink-0" aria-hidden="true" />{inhalt.texte.unterMindestanzahl}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl border border-home-grau/30 bg-white">
                <span className="block text-xs font-semibold text-home-grau"><MdText text={inhalt.texte.kerneAnzahl} /></span>
                <span className="text-base font-bold text-text-main font-mono">{formatDeZahl(r.n, 0)} ({formatDeZahl(r.nMin, 0)})</span>
              </div>
              <div className="p-3 rounded-xl border border-home-grau/30 bg-white">
                <span className="block text-xs font-semibold text-home-grau"><MdText text={inhalt.texte.mittelwert} /></span>
                <span className="text-base font-bold text-text-main font-mono">{formatDeZahl(r.mittel, 2)} N/mm²</span>
              </div>
              <div className="p-3 rounded-xl border border-home-grau/30 bg-white">
                <span className="block text-xs font-semibold text-home-grau"><MdText text={inhalt.texte.streuung} /></span>
                <span className="text-base font-bold text-text-main font-mono">{formatDeZahl(ansatz === 'kerne' ? r.sEff : r.s, 2)} N/mm²</span>
              </div>
              <div className="p-3 rounded-xl border border-shiraz/30 bg-shiraz/10">
                <span className="block text-xs font-semibold text-shiraz"><MdText text={inhalt.texte.fckis} /></span>
                <span className="text-lg font-black text-shiraz font-mono">{formatDeZahl(r.fckIs, 1)} N/mm²</span>
              </div>
              <div className="p-3 rounded-xl border border-shiraz/30 bg-shiraz/10">
                <span className="block text-xs font-semibold text-shiraz"><MdText text={inhalt.texte.klasse} /></span>
                <span className="text-lg font-black text-shiraz">{klasseText}</span>
              </div>
              <div className="p-3 rounded-xl border border-home-grau/30 bg-white">
                <span className="block text-xs font-semibold text-home-grau"><MdText text={inhalt.texte.verhaeltnis} /></span>
                <span className="text-base font-bold text-text-main font-mono">{formatDeZahl(r.verhaeltnis, 3)}</span>
              </div>
            </div>
            {r.gueltig && (
              <ul className="text-xs text-text-main/90 space-y-1">
                <li>{MASSGEBEND[r.massgebend] ?? r.massgebend}</li>
                {ansatz === 'kerne' && mindestStreuung && <li>{inhalt.texte.ohneMindest} {formatDeZahl(r.fckIsOhneMindest, 1)} N/mm²</li>}
                {r.naechsteKlasse && r.naechsteKlasse !== '–' && <li><MdText text={inhalt.texte.naechste} /> {formatDeZahl(r.naechsteGrenze, 2)} N/mm² ({r.naechsteKlasse})</li>}
              </ul>
            )}
            {fehler.length > 0 && (
              <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-xs text-red-900 space-y-1" role="alert">
                <div className="font-bold">{inhalt.texte.keinErgebnis}</div>
                {fehler.map(h => <div key={h.text}>{h.text}</div>)}
              </div>
            )}
            {warnungen.length > 0 && (
              <ul className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-900 space-y-1 list-disc pl-6">
                {warnungen.map(h => <li key={h.text}>{h.text}</li>)}
              </ul>
            )}
            <FormulaDerivationBox
              live
              kurzzeile={kurzzeile(`n = ${formatDeZahl(r.n, 0)}`, ansageWert('Mittelwert', r.mittel, 1, 'N/mm²'), ansageWert('f_ck,is', r.fckIs, 1, 'N/mm²'), klasseText)}
              title={inhalt.texte.rechenwegTitel}
              zielGleichung={`f_{\\mathrm{ck,is}} = ${formatDeTeX(r.fckIs, 2)}\\ \\mathrm{N/mm^2} \\;\\Rightarrow\\; \\text{${klasseText}}`}
              schritte={schritte}
              ergebnisHinweis={inhalt.texte.rechenwegHinweis}
              normQuelle={inhalt.werte.normQuelle}
              defaultExpanded
            />
          </div>
        </div>
      </section>

      {/* 4 Lehrbeispiele */}
      <section className="space-y-3">
        <h4 className="text-base font-bold text-text-main">{inhalt.texte.hLehrbeispiele}</h4>
        {inhalt.daten.beispiele.map(b => (
          <p key={b.id} className="text-sm text-text-main/90 leading-relaxed p-3 rounded-xl border border-home-grau/30 bg-off-white"><MdText text={b.text} /></p>
        ))}
      </section>

      {/* Rückverweis: von f_ck,is zum Bemessungswert (Modul „Kennwerte und Bemessungswerte nach Eurocode“, #316) */}
      <EcKennwerteVerweis />

      <section className="space-y-2">
        <h4 className="text-sm font-bold text-text-main">{inhalt.texte.hQuellen}</h4>
        <ul className="text-xs text-text-main/90 list-disc pl-5 space-y-1">
          {inhalt.daten.quellen.map(q => <li key={q.url}><a href={q.url} target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline">{q.title}</a></li>)}
        </ul>
      </section>
    </div>
  );
}
