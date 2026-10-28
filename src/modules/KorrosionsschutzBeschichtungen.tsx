import React, { useMemo, useState } from 'react';
import { BookOpen, Layers, Flame, Table2, Calculator, ClipboardCheck, ShieldCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import {
  zinkSchutzdauer, KORROSIVITAET, KATEGORIEN, SCHUTZDAUER, KLASSEN, ZINK_1461, SYNERGIE_SPANNE,
  type Kategorie, type Schutzdauerklasse,
} from '@/src/calc/korrosionsschutz';
import inhaltJson from '@/content/korrosionsschutzbeschichtungen/KorrosionsschutzBeschichtungen.json';
import { MdText } from '@/src/components/inhalt/MdText';

type Reiter = 'einfuehrung' | 'grundlagen' | 'verzinkung' | 'kennwerte' | 'rechner' | 'beispiele';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Einführung', icon: BookOpen },
  { id: 'grundlagen', label: 'Beschichtungssysteme', icon: Layers },
  { id: 'verzinkung', label: inhaltJson.werte.verzinkenDuplex, icon: Flame },
  { id: 'kennwerte', label: inhaltJson.werte.kennwerteTabellen, icon: Table2 },
  { id: 'rechner', label: inhaltJson.werte.rechnerSchutzdauer, icon: Calculator },
  { id: 'beispiele', label: 'Beispiele', icon: ClipboardCheck },
];

const TEILE = inhaltJson.daten.TEILE;

const BINDEMITTEL = inhaltJson.daten.BINDEMITTEL;

const IM = inhaltJson.daten.IM;

const ROSTGRADE = inhaltJson.daten.ROSTGRADE;

const VORBEREITUNG = inhaltJson.daten.VORBEREITUNG;

const klasseFarbe: Record<Schutzdauerklasse, string> = { L: 'bg-rose-100 text-rose-900', M: 'bg-amber-100 text-amber-900', H: 'bg-sky-100 text-sky-900', VH: 'bg-emerald-100 text-emerald-900' };

export default function KorrosionsschutzBeschichtungen({ startReiter = 'einfuehrung' }: { startReiter?: Reiter }) {
  const [reiter, setReiter] = useState<Reiter>(startReiter);

  // Rechner-Eingaben
  const [kategorie, setKategorie] = useState<Kategorie>('C4');
  const [stahlDicke, setStahlDicke] = useState(10);
  const [dZn, setDZn] = useState(85);
  const [ziel, setZiel] = useState<Schutzdauerklasse>('H');
  const [duplex, setDuplex] = useState(false);
  const [tB, setTB] = useState(10);
  const [f, setF] = useState(1.5);

  const erg = useMemo(() => zinkSchutzdauer({ dZn, kategorie, ziel, duplex, tBeschichtung: tB, synergie: f, stahlDickeMm: stahlDicke }),
    [dZn, kategorie, ziel, duplex, tB, f, stahlDicke]);
  const alle = useMemo(() => KATEGORIEN.map(k => ({ k, r: zinkSchutzdauer({ dZn, kategorie: k, ziel, duplex, tBeschichtung: tB, synergie: f }) })),
    [dZn, ziel, duplex, tB, f]);

  const tex = (x: number, n = 1) => formatDeTeX(x, n);
  const jahre = (x: number | null) => (x === null ? inhaltJson.werte.nachObenOffen : `${formatDeZahl(x, 1)} Jahre`);
  const kat = KORROSIVITAET[kategorie];
  const SKALA = 100; // Jahre, Darstellungsgrenze der Balken

  const bewertungText = {
    erfuellt: `Die Schutzdauerklasse ${ziel} (${SCHUTZDAUER[ziel].text}) wird auch bei ungünstiger Abtragsrate erreicht.`,
    grenzwertig: `Die Schutzdauerklasse ${ziel} wird nur bei günstiger Abtragsrate erreicht; ungünstig ergibt sich Klasse ${erg.klasseUnguenstig}. Schicht erhöhen oder Duplex-System wählen.`,
    nicht_erfuellt: `Die Schutzdauerklasse ${ziel} wird auch im günstigen Fall nicht erreicht (höchstens Klasse ${erg.klasseGuenstig}).`,
  }[erg.bewertung];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-shiraz" aria-hidden="true" /><MdText text={inhaltJson.texte.korrosionsschutzDurchBeschichtungen} /></h2>
        <p className="text-xs text-text-main/50 font-mono mt-1"><MdText text={inhaltJson.texte.dinEnIso12944} /></p>
        <p className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed"><MdText text={inhaltJson.texte.unlegierterBaustahlRostetAn} /></p>
      </div>

      <ModuleTabs label={inhaltJson.werte.bereicheDesModulsKorrosionsschutz} tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
        <div className="mt-6 flex flex-col gap-6">

          {reiter === 'einfuehrung' && (
            <>
              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main"><MdText text={inhaltJson.texte.wirkprinzipienDesKorrosionsschutzes} /></h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><MdText text={inhaltJson.texte.barrierewirkungPassivDieBeschichtung} /></li>
                  <li><MdText text={inhaltJson.texte.kathodischeSchutzwirkungAktivZink} /></li>
                  <li><MdText text={inhaltJson.texte.inhibierungKorrosionsschutzpigmenteVerla} /></li>
                </ul>
                <p><MdText text={inhaltJson.texte.dieNormenreiheDinEn} /></p>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30">
                <h3 className="font-bold text-base text-text-main mb-3"><MdText text={inhaltJson.texte.dieNeunTeileDer} /></h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead><tr className="bg-off-white border-b border-home-grau/30"><th className="p-2 font-bold">Teil</th><th className="p-2 font-bold">Titel</th><th className="p-2 font-bold">Kerninhalt</th></tr></thead>
                    <tbody className="divide-y divide-home-grau/20">
                      {TEILE.map(t => (
                        <tr key={t.teil}><td className="p-2 font-bold text-shiraz">{t.teil}</td><td className="p-2 font-semibold">{t.titel}</td><td className="p-2 text-slate-600">{t.inhalt}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
                <h3 className="font-bold text-base text-text-main"><MdText text={inhaltJson.texte.schutzdauerklassenNachDinEn} /></h3>
                <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhaltJson.texte.dieSchutzdauerIstDie} /></p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  {KLASSEN.map(k => (
                    <div key={k} className={`p-3 rounded-xl border border-home-grau/25 ${klasseFarbe[k]}`}>
                      <span className="font-black text-lg block">{k}</span>
                      <span className="text-xs font-semibold block">{SCHUTZDAUER[k].name}</span>
                      <span className="text-[11px] font-mono">{SCHUTZDAUER[k].text}</span>
                    </div>
                  ))}
                </div>
              </section>

              <Querverweis ziel="metallkorrosion" titel={inhaltJson.werte.elektrochemischeGrundlagen} linkText={inhaltJson.werte.zumModulMetallkorrosion}>{inhaltJson.werte.anodeKathodeSpannungsreiheUnd}</Querverweis>
            </>
          )}

          {reiter === 'grundlagen' && (
            <>
              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main"><MdText text={inhaltJson.texte.t1OberflächenvorbereitungNachDin} /></h3>
                <p><MdText text={inhaltJson.texte.dieHaftungUndDamit} /></p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2"><MdText text={inhaltJson.texte.rostgradeAusgangszustand} /></h4>
                    <ul className="space-y-1 text-xs">
                      {ROSTGRADE.map(r => <li key={r.g}><strong className="text-shiraz">{r.g}:</strong> {r.text}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">Vorbereitungsgrade</h4>
                    <ul className="space-y-1 text-xs">
                      {VORBEREITUNG.map(v => <li key={v.g} className={v.g === 'Sa 2½' ? 'bg-shiraz/5 rounded p-1' : ''}><strong className="text-shiraz">{v.g}:</strong> {v.text}</li>)}
                    </ul>
                  </div>
                </div>
                <p className="text-xs"><MdText text={inhaltJson.texte.sa2IstDer} /></p>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main"><MdText text={inhaltJson.texte.t2AufbauEinesBeschichtungssystems} /></h3>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-home-grau/25 bg-off-white"><strong className="block text-shiraz mb-1">Grundbeschichtung</strong><MdText text={inhaltJson.texte.haftungAufDemStahl} /></div>
                  <div className="p-3 rounded-xl border border-home-grau/25 bg-off-white"><strong className="block text-shiraz mb-1">Zwischenbeschichtung</strong><MdText text={inhaltJson.texte.schichtdickeUndBarrierewirkungOft} /></div>
                  <div className="p-3 rounded-xl border border-home-grau/25 bg-off-white"><strong className="block text-shiraz mb-1">Deckbeschichtung</strong><MdText text={inhaltJson.texte.witterungsUndUvSchutz} /></div>
                </div>
                <h4 className="font-bold text-text-main pt-2"><MdText text={inhaltJson.texte.bindemittelNachDinEn} /></h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead><tr className="bg-off-white border-b border-home-grau/30"><th className="p-2 font-bold">Kürzel</th><th className="p-2 font-bold">Bindemittel</th><th className="p-2 font-bold"><MdText text={inhaltJson.texte.typischeRolle} /></th><th className="p-2 font-bold">Eigenschaften</th></tr></thead>
                    <tbody className="divide-y divide-home-grau/20">
                      {BINDEMITTEL.map(b => (
                        <tr key={b.kurz}><td className="p-2 font-bold text-shiraz whitespace-nowrap">{b.kurz}</td><td className="p-2 font-semibold">{b.name}</td><td className="p-2">{b.rolle}</td><td className="p-2 text-slate-600">{b.text}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-600"><MdText text={inhaltJson.texte.dinEnIso129442} /></p>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main"><MdText text={inhaltJson.texte.t3SollschichtdickeNdft} /></h3>
                <p><MdText text={inhaltJson.texte.dieSollschichtdickeNdftNominal} /></p>
                <div className="p-2 bg-off-white rounded-lg border border-home-grau/20 text-center overflow-x-auto">
                  <BlockMath math="\text{NDFT}_{ges} = \sum_i \text{NDFT}_i" />
                </div>
                <p className="text-xs"><MdText text={inhaltJson.texte.lehrbeispielEinesDreischichtigenSystems} /></p>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main"><MdText text={inhaltJson.texte.t4PrüfungUndAbnahme} /></h3>
                <div className="grid md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-home-grau/25 bg-off-white space-y-1">
                    <strong className="block text-shiraz">Schichtdickenmessung</strong>
                    <p><MdText text={inhaltJson.texte.zerstörungsfreiMagnetinduktivBzwMit} /></p>
                  </div>
                  <div className="p-3 rounded-xl border border-home-grau/25 bg-off-white space-y-1">
                    <strong className="block text-shiraz"><MdText text={inhaltJson.texte.gitterschnittDinEnIso} /></strong>
                    <p><MdText text={inhaltJson.texte.gitterAusSechsSchnitten} /></p>
                  </div>
                  <div className="p-3 rounded-xl border border-home-grau/25 bg-off-white space-y-1">
                    <strong className="block text-shiraz"><MdText text={inhaltJson.texte.haftabzugDinEnIso} /></strong>
                    <p><MdText text={inhaltJson.texte.prüfstempelAufklebenSenkrechtAbziehen} /></p>
                  </div>
                </div>
                <div className="p-2 bg-off-white rounded-lg border border-home-grau/20 text-center overflow-x-auto">
                  <BlockMath math="\sigma = \frac{F}{A} = \frac{4\,F}{\pi\,d^2} \qquad \text{z. B. } \frac{4 \cdot 1900\,\text{N}}{\pi \cdot (20\,\text{mm})^2} = 6{,}0\,\text{MPa}" />
                </div>
              </section>
            </>
          )}

          {reiter === 'verzinkung' && (
            <>
              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main"><MdText text={inhaltJson.texte.feuerverzinkenNachDinEn} /></h3>
                <p><MdText text={inhaltJson.texte.dasGereinigteUndGebeizte} /></p>
                <p><MdText text={inhaltJson.texte.zinkSchütztDoppeltAls} /></p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <caption className="text-left text-xs font-bold text-slate-600 mb-1"><MdText text={inhaltJson.texte.mindestwerteDerZinküberzugsdickeTeile} /></caption>
                    <thead><tr className="bg-off-white border-b border-home-grau/30"><th className="p-2 font-bold">Stahldicke</th><th className="p-2 font-bold"><MdText text={inhaltJson.texte.örtlichM} /></th><th className="p-2 font-bold"><MdText text={inhaltJson.texte.durchschnittM} /></th></tr></thead>
                    <tbody className="divide-y divide-home-grau/20">
                      {ZINK_1461.map(z => <tr key={z.bereich}><td className="p-2 font-semibold">{z.bereich}</td><td className="p-2">{formatDeZahl(z.oertlich, 0)}</td><td className="p-2 font-bold">{formatDeZahl(z.mittel, 0)}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main"><MdText text={inhaltJson.texte.duplexSystemFeuerverzinkungPlus} /></h3>
                <p><MdText text={inhaltJson.texte.beimDuplexSystemWird} /></p>
                <div className="p-2 bg-off-white rounded-lg border border-home-grau/20 text-center overflow-x-auto">
                  <BlockMath math="t_{D} = f \cdot (t_{Zn} + t_{B}), \qquad f \approx 1{,}2 \text{ bis } 2{,}5" />
                </div>
                <p className="text-xs"><MdText text={inhaltJson.texte.derSynergiefaktorFIst} /></p>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main flex items-center gap-2"><AlertTriangle size={16} className="text-amber-600" aria-hidden="true" /> Kontaktkorrosion</h3>
                <p><MdText text={inhaltJson.texte.berührenSichZweiMetalle} /></p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><MdText text={inhaltJson.texte.ungünstigVerzinkteSchraubenIn} /></li>
                  <li><MdText text={inhaltJson.texte.meistUnkritischAnDer} /></li>
                  <li><MdText text={inhaltJson.texte.gegenmaßnahmenTrennungDurchIsolierende} /></li>
                </ul>
              </section>

              <Querverweis ziel="stahl" titel={inhaltJson.werte.werkstoffStahl} linkText={inhaltJson.werte.zumModulStahl}>{inhaltJson.werte.stahlsortenGefügeUndFestigkeiten}</Querverweis>
            </>
          )}

          {reiter === 'kennwerte' && (
            <>
              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
                <h3 className="font-bold text-base text-text-main"><MdText text={inhaltJson.texte.korrosivitätskategorienDerAtmosphäreDin} /></h3>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhaltJson.texte.dickenabnahmeImErstenJahr} /></p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse min-w-[640px]">
                    <thead><tr className="bg-off-white border-b border-home-grau/30">
                      <th className="p-2 font-bold">Kat.</th><th className="p-2 font-bold">Korrosivität</th><th className="p-2 font-bold"><MdText text={inhaltJson.texte.beispielAußen} /></th><th className="p-2 font-bold"><MdText text={inhaltJson.texte.beispielInnen} /></th>
                      <th className="p-2 font-bold whitespace-nowrap"><MdText text={inhaltJson.texte.stahlMA} /></th><th className="p-2 font-bold whitespace-nowrap">Zink [µm/a]</th>
                    </tr></thead>
                    <tbody className="divide-y divide-home-grau/20">
                      {KATEGORIEN.map(k => {
                        const d = KORROSIVITAET[k];
                        const sp = (a: readonly [number, number]) => a[0] === 0 ? `≤ ${formatDeZahl(a[1], 1)}` : `> ${formatDeZahl(a[0], 1)} bis ${formatDeZahl(a[1], 1)}`;
                        return (
                          <tr key={k}>
                            <td className="p-2 font-black text-shiraz">{k}</td><td className="p-2">{d.stufe}</td><td className="p-2 text-slate-600">{d.aussen}</td><td className="p-2 text-slate-600">{d.innen}</td>
                            <td className="p-2 font-mono whitespace-nowrap">{sp(d.stahl)}</td><td className="p-2 font-mono whitespace-nowrap">{sp(d.zink)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
                <h3 className="font-bold text-base text-text-main"><MdText text={inhaltJson.texte.kategorienFürWasserUnd} /></h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead><tr className="bg-off-white border-b border-home-grau/30"><th className="p-2 font-bold">Kat.</th><th className="p-2 font-bold">Umgebung</th><th className="p-2 font-bold">Beispiele</th></tr></thead>
                    <tbody className="divide-y divide-home-grau/20">
                      {IM.map(i => <tr key={i.k}><td className="p-2 font-black text-shiraz">{i.k}</td><td className="p-2 font-semibold">{i.umgebung}</td><td className="p-2 text-slate-600">{i.beispiel}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-600"><MdText text={inhaltJson.texte.fürImKategorienGibt} /></p>
              </section>
            </>
          )}

          {reiter === 'rechner' && (
            <>
              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-base text-text-main">Eingaben</h3>
                  <label className="block text-xs font-bold text-slate-700">
                    Korrosivitätskategorie
                    <select value={kategorie} onChange={e => setKategorie(e.target.value as Kategorie)} className="mt-1 w-full p-2 border border-slate-200 rounded-lg bg-white text-sm">
                      {KATEGORIEN.map(k => <option key={k} value={k}>{k} – {KORROSIVITAET[k].stufe}</option>)}
                    </select>
                  </label>
                  <p className="text-[11px] text-slate-500 -mt-2">{kat.aussen !== '–' ? `Außen: ${kat.aussen}. ` : ''}Innen: {kat.innen}.</p>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700"><label htmlFor="ks-stahl">Stahldicke</label><span className="font-mono">{formatDeZahl(stahlDicke, 1)} mm</span></div>
                    <input id="ks-stahl" type="range" min="1" max="30" step="0.5" value={stahlDicke} onChange={e => setStahlDicke(Number(e.target.value))} className="w-full accent-shiraz" />
                    {erg.mindest1461 && (
                      <button type="button" onClick={() => setDZn(erg.mindest1461!.mittel)} className="text-[11px] text-shiraz font-semibold underline cursor-pointer"><MdText text={inhaltJson.texte.mindestDurchschnittswertNachDin} />{formatDeZahl(erg.mindest1461.mittel, 0)} µm)
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700"><label htmlFor="ks-dzn"><MdText text={inhaltJson.texte.zinkschichtdickeDZn} /></label><span className="font-mono">{formatDeZahl(dZn, 0)} µm</span></div>
                    <input id="ks-dzn" type="range" min="20" max="300" step="5" value={dZn} onChange={e => setDZn(Number(e.target.value))} className="w-full accent-shiraz" />
                  </div>

                  <label className="block text-xs font-bold text-slate-700"><MdText text={inhaltJson.texte.gewünschteSchutzdauerklasse} /><select value={ziel} onChange={e => setZiel(e.target.value as Schutzdauerklasse)} className="mt-1 w-full p-2 border border-slate-200 rounded-lg bg-white text-sm">
                      {KLASSEN.map(k => <option key={k} value={k}>{k} – {SCHUTZDAUER[k].name} ({SCHUTZDAUER[k].text})</option>)}
                    </select>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={duplex} onChange={e => setDuplex(e.target.checked)} className="accent-shiraz" /><MdText text={inhaltJson.texte.duplexSystemZusätzlicheBeschichtung} /></label>
                  {duplex && (
                    <div className="space-y-3 pl-5 border-l-2 border-shiraz/20">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700"><label htmlFor="ks-tb"><MdText text={inhaltJson.texte.schutzdauerDerBeschichtungAllein} /></label><span className="font-mono">{formatDeZahl(tB, 0)} Jahre</span></div>
                        <input id="ks-tb" type="range" min="0" max="40" step="1" value={tB} onChange={e => setTB(Number(e.target.value))} className="w-full accent-shiraz" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700"><label htmlFor="ks-f"><MdText text={inhaltJson.texte.synergiefaktorFLiteraturwert} /></label><span className="font-mono">{formatDeZahl(f, 1)}</span></div>
                        <input id="ks-f" type="range" min="1" max="3" step="0.1" value={f} onChange={e => setF(Number(e.target.value))} className="w-full accent-shiraz" />
                        <p className="text-[10px] text-slate-500">Literaturspanne {formatDeZahl(SYNERGIE_SPANNE[0], 1)} bis {formatDeZahl(SYNERGIE_SPANNE[1], 1)}<MdText text={inhaltJson.texte.keinNormwertLehrannahme} /></p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-base text-text-main">Ergebnis</h3>
                  {erg.gueltig && (
                    <>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] uppercase font-bold text-slate-500">{duplex ? inhaltJson.werte.duplexUngünstig : inhaltJson.werte.zinkUngünstig}</div>
                          <div className="text-lg font-black font-mono text-slate-900">{jahre(erg.tDuplexMin)}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] uppercase font-bold text-slate-500">{duplex ? inhaltJson.werte.duplexGünstig : inhaltJson.werte.zinkGünstig}</div>
                          <div className="text-lg font-black font-mono text-slate-900">{jahre(erg.tDuplexMax)}</div>
                        </div>
                      </div>
                      <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${erg.bewertung === 'erfuellt' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : erg.bewertung === 'grenzwertig' ? 'bg-amber-50 border-amber-200 text-amber-950' : 'bg-red-50 border-red-200 text-red-950'}`} role="status">
                        {erg.bewertung === 'erfuellt' ? <CheckCircle size={18} className="text-emerald-600 shrink-0" aria-hidden="true" /> : erg.bewertung === 'grenzwertig' ? <AlertTriangle size={18} className="text-amber-600 shrink-0" aria-hidden="true" /> : <XCircle size={18} className="text-red-600 shrink-0" aria-hidden="true" />}
                        <p><strong>Klasse {erg.klasseUnguenstig}{erg.klasseGuenstig !== erg.klasseUnguenstig ? ` bis ${erg.klasseGuenstig}` : ''}.</strong> {bewertungText}</p>
                      </div>
                    </>
                  )}
                  <EingabeHinweise hinweise={erg.hinweise} />

                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2"><MdText text={inhaltJson.texte.schutzdauerJeKategorieBei} />{formatDeZahl(dZn, 0)} µm{duplex ? ' (Duplex)' : ''}</h4>
                    <div className="space-y-1.5" aria-label={inhaltJson.werte.balkendiagrammDerSchutzdauerJe}>
                      {alle.map(({ k, r }) => {
                        const a = Math.min(r.tDuplexMin, SKALA), b = r.tDuplexMax === null ? SKALA : Math.min(r.tDuplexMax, SKALA);
                        return (
                          <div key={k} className="flex items-center gap-2 text-[11px]">
                            <span className={`w-7 font-bold ${k === kategorie ? 'text-shiraz' : 'text-slate-600'}`}>{k}</span>
                            <div className="relative flex-1 h-4 bg-slate-100 rounded">
                              <div className={`absolute h-4 rounded ${k === kategorie ? 'bg-shiraz/70' : 'bg-slate-400/60'}`} style={{ left: `${Math.min((a / SKALA) * 100, 99.2)}%`, width: `${Math.max(((b - a) / SKALA) * 100, 0.8)}%` }} />
                            </div>
                            <span className="w-28 text-right font-mono text-slate-600">{formatDeZahl(r.tDuplexMin, 0)} – {r.tDuplexMax === null ? '∞' : formatDeZahl(r.tDuplexMax, 0)} a</span>
                          </div>
                        );
                      })}
                      <p className="text-[10px] text-slate-500">Skala 0 bis {formatDeZahl(SKALA, 0)}<MdText text={inhaltJson.texte.jahreKlassengrenzenBei7} /></p>
                    </div>
                  </div>
                </div>
              </section>

              {erg.gueltig && (
                <FormulaDerivationBox
                  live
                  title={inhaltJson.werte.ihrRechenwegSchutzdauerDer}
                  zielGleichung="t_{Zn} = \frac{d_{Zn}}{r_{corr,Zn}}"
                  schritte={[
                    {
                      titel: inhaltJson.werte.abtragsrateDerKategorie,
                      erklaerung: `Zinkabtrag im ersten Jahr für ${kategorie} nach DIN EN ISO 9223 bzw. DIN EN ISO 12944-2:`,
                      formel: `r_{corr,Zn} = ${tex(erg.rMin, 1)} \\text{ bis } ${tex(erg.rMax, 1)}\\,\\mu\\text{m/a}`,
                    },
                    {
                      titel: inhaltJson.werte.ungünstigeSchutzdauer,
                      erklaerung: `Zinkschicht ${formatDeZahl(dZn, 0)} µm geteilt durch die obere Abtragsrate:`,
                      formel: `t_{Zn,min} = \\frac{${tex(dZn, 0)}}{${tex(erg.rMax, 1)}} = ${tex(erg.tMin, 1)}\\,\\text{a}`,
                    },
                    {
                      titel: inhaltJson.werte.günstigeSchutzdauer,
                      erklaerung: erg.tMax === null ? inhaltJson.werte.inC1IstDie : inhaltJson.werte.mitDerUnterenAbtragsrate,
                      formel: erg.tMax === null ? `t_{Zn,max} \\to \\infty` : `t_{Zn,max} = \\frac{${tex(dZn, 0)}}{${tex(erg.rMin, 1)}} = ${tex(erg.tMax, 1)}\\,\\text{a}`,
                    },
                    ...(duplex ? [{
                      titel: 'Duplex-System',
                      erklaerung: `Beschichtung ${formatDeZahl(tB, 0)} Jahre, Synergiefaktor f = ${formatDeZahl(f, 1)} (Literaturwert):`,
                      formel: `t_{D,min} = ${tex(f, 1)} \\cdot (${tex(erg.tMin, 1)} + ${tex(tB, 0)}) = ${tex(erg.tDuplexMin, 1)}\\,\\text{a}`,
                    }] : []),
                    {
                      titel: inhaltJson.werte.vergleichMitDerSchutzdauerklasse,
                      erklaerung: `Gefordert ist ${ziel} (${SCHUTZDAUER[ziel].text}); maßgebend ist der ungünstige Wert:`,
                      formel: `t_{min} = ${tex(erg.tMassgebend, 1)}\\,\\text{a} \\;\\Rightarrow\\; \\text{Klasse } ${erg.klasseUnguenstig} \\;(${erg.bewertung === 'erfuellt' ? '\\text{erfüllt}' : '\\text{nicht sicher erfüllt}'})`,
                    },
                  ]}
                  ergebnisHinweis={inhaltJson.werte.linearesLehrmodellMitErstjahresraten}
                  normQuelle={inhaltJson.werte.dinEnIso9223}
                />
              )}
            </>
          )}

          {reiter === 'beispiele' && (
            <>
              <FormulaDerivationBox
                title={inhaltJson.werte.beispiel1FeuerverzinkteHallenstütze}
                zielGleichung="t_{Zn} = \frac{d_{Zn}}{r_{corr,Zn}}"
                schritte={inhaltJson.daten["KorrosionsschutzBeschichtungen.schritte"]}
                ergebnisHinweis={inhaltJson.werte.inC3ErreichtEine}
                normQuelle={inhaltJson.werte.dinEnIso1461}
              />
              <FormulaDerivationBox
                title={inhaltJson.werte.beispiel2GeländerAn}
                zielGleichung="t_{D} = f \cdot (t_{Zn} + t_{B})"
                schritte={inhaltJson.daten["KorrosionsschutzBeschichtungen.schritte_2"]}
                ergebnisHinweis={inhaltJson.werte.erstDasDuplexSystem}
                normQuelle={inhaltJson.werte.dinEnIso92232}
              />
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main mb-2">Merksätze</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><MdText text={inhaltJson.texte.erstDieUmgebungEinstufen} /></li>
                  <li><MdText text={inhaltJson.texte.ohneOberflächenvorbereitungInDer} /></li>
                  <li><MdText text={inhaltJson.texte.dieSchutzdauerEinerZinkschicht} /></li>
                </ul>
              </div>
            </>
          )}
        </div>
      </ModuleTabs>

      <ModulTest moduleId="korrosionsschutz_beschichtungen" />

      <ModuleFooter
        lastReviewed={inhaltJson.werte.oktober2026ModulNeu}
        wikipedia={[
          { title: 'Korrosionsschutz', url: 'https://de.wikipedia.org/wiki/Korrosionsschutz' },
          { title: 'Feuerverzinken', url: 'https://de.wikipedia.org/wiki/Feuerverzinken' },
        ]}
        literatur={inhaltJson.daten["KorrosionsschutzBeschichtungen.literatur"]}
        regelwerke={inhaltJson.daten["KorrosionsschutzBeschichtungen.regelwerke"]}
        formeln={inhaltJson.daten["KorrosionsschutzBeschichtungen.formeln"]}
      />
    </div>
  );
}
