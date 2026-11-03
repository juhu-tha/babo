import React, { useState } from 'react';
import { Telescope, Target, Layers, Gauge, Building2, Table2, AlertTriangle, CalendarClock } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/normenausblick/NormenAusblick.json';
import { MdText } from '@/src/components/inhalt/MdText';

/**
 * Ausblick auf die neue Normengeneration im Betonbau und bei den Eurocodes (Stand November 2026).
 * Alle Aussagen stützen sich auf öffentlich zugängliche Quellen (Fußzeile). Was dort nicht steht,
 * ist als „noch offen“ bzw. „unsicher“ gekennzeichnet. Maßgebend für die Bemessung bleiben die
 * bauaufsichtlich eingeführten Ausgaben (MVV TB 2025/1).
 */

type Reiter = 'warum' | 'beton' | 'erc' | 'eurocodes' | 'stand';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'warum', label: 'Warum neu?', icon: Target },
  { id: 'beton', label: inhalt.werte.dinEn2061, icon: Layers },
  { id: 'erc', label: inhalt.werte.expositionswiderstandErc, icon: Gauge },
  { id: 'eurocodes', label: inhalt.werte.eurocodes2Generation, icon: Building2 },
  { id: 'stand', label: inhalt.werte.wasGiltWann, icon: Table2 },
];

const karte = 'bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30';
const kasten = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const kachel = 'p-4 rounded-xl border border-home-grau/30 bg-white text-xs text-text-main/80 leading-relaxed';
const th = 'p-2.5 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white align-bottom';
const td = 'p-2.5 text-xs text-text-main/85 border-b border-home-grau/15 align-top';

/** Kennzeichnung für Aussagen, die öffentlich nicht (vollständig) belegt sind */
function Unsicher({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[11px] font-bold whitespace-nowrap">
      <AlertTriangle size={11} aria-hidden={true} /> {children}
    </span>
  );
}
const Offen = () => <Unsicher>noch offen</Unsicher>;

interface Zeile { bereich: string; heute: React.ReactNode; neu: React.ReactNode; einfuehrung: React.ReactNode }

const STAND: readonly Zeile[] = [
  {
    bereich: inhalt.werte.betonFestlegungEigenschaftenHerstellung,
    heute: inhalt.werte.dinEn2062021,
    neu: inhalt.werte.dinEn20612,
    einfuehrung: <><Offen /><MdText text={inhalt.texte.setztEineAbgestimmteNeufassung} /></>,
  },
  {
    bereich: inhalt.werte.eurocode0GrundlagenDer,
    heute: inhalt.werte.dinEn19901,
    neu: inhalt.werte.en19902023Erschienen,
    einfuehrung: <><Offen /><MdText text={inhalt.texte.forschungsberichtZurAnwendbarkeit2025} /></>,
  },
  {
    bereich: inhalt.werte.eurocode2Betonbau,
    heute: inhalt.werte.dinEn19921,
    neu: inhalt.werte.dinEn199212,
    einfuehrung: <><Offen /><MdText text={inhalt.texte.fachveröffentlichungRwth2025Erwartet} /></>,
  },
  {
    bereich: inhalt.werte.eurocode3Stahlbau,
    heute: inhalt.werte.dinEn19931,
    neu: inhalt.werte.dinEn199312,
    einfuehrung: <Offen />,
  },
  {
    bereich: inhalt.werte.eurocode5Holzbau,
    heute: inhalt.werte.dinEn19951,
    neu: inhalt.werte.dinEn199512,
    einfuehrung: <Offen />,
  },
];

const ZEITSTRAHL: readonly { wann: string; was: string; quelle: string }[] = inhalt.daten.ZEITSTRAHL;

/** Entwürfe und Normungsprojekte (Stand November 2026, docs/pruefung/normausgaben-2026-11.md) */
const ENTWUERFE: readonly { was: string; art: string; gegenstand: string; quelle: string }[] = inhalt.daten.ENTWUERFE;

export default function NormenAusblick() {
  const [reiter, setReiter] = useState<Reiter>('warum');

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className={`${karte} flex flex-col gap-5`}>
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Telescope className="w-5 h-5 text-shiraz" aria-hidden={true} /><MdText text={inhalt.texte.ausblickNeueNormengenerationBeton} /></h2>
          <p className="text-xs text-text-main/60 font-mono mt-1"><MdText text={inhalt.texte.dinEn2061} /></p>
        </div>

        <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed flex items-start gap-2.5" role="note">
          <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-0.5" aria-hidden={true} />
          <p><MdText text={inhalt.texte.standNovember2026Für} /><Unsicher>unsicher</Unsicher> oder <Offen /><MdText text={inhalt.texte.sindÖffentlichNichtBelegt} /></p>
        </div>

        <ModuleTabs label={inhalt.werte.bereicheDesModulsAusblick} tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
          <div className="pt-5 animate-in fade-in duration-300">
            {/* ───────────── 1. WARUM ───────────── */}
            {reiter === 'warum' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <p><MdText text={inhalt.texte.dieErsteEurocodeGeneration} /></p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.anwendbarkeitEaseOfUse} /></h3><MdText text={inhalt.texte.wenigerNationalFestzulegendeParameter} /></div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.erweiterterAnwendungsbereich} /></h3><MdText text={inhalt.texte.neueInhalteEtwaFür} /></div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.leistungsbezogeneDauerhaftigkeit} /></h3>
                    Statt die Betondeckung allein über Expositionsklasse und Betonzusammensetzung festzulegen, soll der Widerstand des Betons über
                    <strong><MdText text={inhalt.texte.expositionswiderstandsklassenErc} /></strong> eingehen. Das öffnet einen Weg für neue, klinkerärmere Betone, deren Widerstand durch Prüfung nachgewiesen wird.
                  </div>
                </div>
                <div className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.warumDasFürBaustoffe} /></h3>
                  <p><MdText text={inhalt.texte.dieBisherigenGrenzwerteFür} /></p>
                </div>
              </div>
            )}

            {/* ───────────── 2. DIN EN 206-1/-2:2026 ───────────── */}
            {reiter === 'beton' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <p><MdText text={inhalt.texte.imJuli2026Sind} /></p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Teil 1</h3><MdText text={inhalt.texte.eigenschaftenUndAnforderungenAn} /></div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Teil 2</h3><MdText text={inhalt.texte.alleAspekteDerKonformitätsbewertung} /></div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Teil 3</h3><MdText text={inhalt.texte.zusätzlicheAnforderungenFürBeton} /><span className="block mt-1"><Unsicher>{inhalt.werte.dinAusgabeNichtGeprüft}</Unsicher></span>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border border-home-grau/30" role="region" aria-label={inhalt.werte.änderungenInDinEn} tabIndex={0}>
                  <table className="w-full min-w-[520px] border-collapse">
                    <caption className="text-left text-xs font-bold text-text-main p-2.5"><MdText text={inhalt.texte.wesentlicheÄnderungenLautÄnderungsvermer} /></caption>
                    <thead>
                      <tr><th scope="col" className={th}>Thema</th><th scope="col" className={th}><MdText text={inhalt.texte.wasÖffentlichBekanntIst} /></th><th scope="col" className={th}><MdText text={inhalt.texte.grenzeDerAussage} /></th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row" className={`${td} font-bold`}>Bindemittel</th>
                        <td className={td}><MdText text={inhalt.texte.neueTerminologieFürBindemittel} /></td>
                        <td className={td}><Unsicher>unsicher</Unsicher><MdText text={inhalt.texte.welcheBegriffeUndOb} /></td>
                      </tr>
                      <tr>
                        <th scope="row" className={`${td} font-bold`}>CO₂-Emissionen</th>
                        <td className={td}><MdText text={inhalt.texte.neuerAbschnitt54} /></td>
                        <td className={td}><Unsicher>unsicher</Unsicher><MdText text={inhalt.texte.dieEinzelheitenStammenAus} /></td>
                      </tr>
                      <tr>
                        <th scope="row" className={`${td} font-bold`}>Expositionswiderstand</th>
                        <td className={td}><MdText text={inhalt.texte.öffnungFürNationaleRegeln} /></td>
                        <td className={td}><MdText text={inhalt.texte.eigeneEuropäischeErcRegeln} /></td>
                      </tr>
                      <tr>
                        <th scope="row" className={`${td} font-bold`}>Expositionsklassen</th>
                        <td className={td}><MdText text={inhalt.texte.informativeInhalteZuDen} /></td>
                        <td className={td}><MdText text={inhalt.texte.dieDeutschenGrenzwerteStehen} /></td>
                      </tr>
                      <tr>
                        <th scope="row" className={`${td} font-bold`}>Struktur</th>
                        <td className={td}><MdText text={inhalt.texte.anhangMBestimmungenAm} /></td>
                        <td className={td}>–</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.warumDinEn206} /></h3>
                  <p><MdText text={inhalt.texte.inDeutschlandWirdDin} /><Offen />
                  </p>
                </div>
                <Querverweis ziel="dauerhaftigkeit" titel={inhalt.werte.heutigeRegelnFürExpositionsklassen} linkText={inhalt.werte.zumModulDauerhaftigkeit}>
                  <p><MdText text={inhalt.texte.dieHeuteGeltendenGrenzwerte} /></p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 3. ERC ───────────── */}
            {reiter === 'erc' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <p><MdText text={inhalt.texte.en199211} /></p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.xrcKarbonatisierung} /></h3><MdText text={inhalt.texte.abgeleitetAusDerCharakteristischen} /></div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.xrdsChloride} /></h3><MdText text={inhalt.texte.abgeleitetAusDerCharakteristischen2} /></div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                  <BlockMath math="x_{c,50} \approx \mathrm{XRC} \cdot \sqrt{50\,\text{a}} \approx 7{,}1 \cdot \mathrm{XRC} \quad \Rightarrow \quad \mathrm{XRC}\;3:\; x_{c,50} \approx 21\,\text{mm}" />
                  <p className="text-[11px] text-text-main/70 text-center"><MdText text={inhalt.texte.lesebeispielNachDemWurzel} /><span className="ml-1"><Unsicher>{inhalt.werte.lesartNormtextNichtEingesehen}</Unsicher></span>
                  </p>
                </div>
                <div className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.nachweisÜberPrüfung} /></h3>
                  <p><MdText text={inhalt.texte.referenzverfahrenFürXrcIst} /></p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.europäischKeineGemeinsameBetonnorm} /></h3><MdText text={inhalt.texte.eineEigeneNormEn} /></div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.deutschlandKonzeptInArbeit} /></h3><MdText text={inhalt.texte.dafstbHeft6662025} /><span className="block mt-1"><Unsicher>{inhalt.werte.verbindlicheNationaleErcRegeln}</Unsicher></span>
                  </div>
                </div>
                <Querverweis ziel="schnellkarbonatisierung" titel={inhalt.werte.karbonatisierungswiderstandSelbstBestimm} linkText={inhalt.werte.zumModulSchnellkarbonatisierung}>
                  <p><MdText text={inhalt.texte.dasModulSchnellkarbonatisierungErmittelt} /></p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 4. EUROCODES ───────────── */}
            {reiter === 'eurocodes' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-2 flex items-center gap-2"><CalendarClock size={16} className="text-shiraz" aria-hidden={true} /><MdText text={inhalt.texte.europäischerZeitplan} /></h3>
                  <ol className="flex flex-col gap-2">
                    {ZEITSTRAHL.map(z => (
                      <li key={z.wann} className="grid grid-cols-[7.5rem_1fr] gap-3 text-xs">
                        <span className="font-bold text-shiraz">{z.wann}</span>
                        <span>{z.was} <span className="text-text-main/60">({z.quelle})</span></span>
                      </li>
                    ))}
                  </ol>
                  <p className="text-xs mt-3"><MdText text={inhalt.texte.zwischenDerSpätestenNationalen} /></p>
                </div>
                <div className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.standInDeutschland} /></h3>
                  <p><MdText text={inhalt.texte.dieDinFassungenErscheinen} /></p>
                  <p className="mt-2"><MdText text={inhalt.texte.einForschungsberichtDerInitiative} /><Offen />
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.ec2DinEn1992} /></h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><MdText text={inhalt.texte.vollständigeTechnischeÜberarbeitungInhal} /></li>
                      <li><MdText text={inhalt.texte.dauerhaftigkeitÜberExpositionswiderstand} /></li>
                      <li><MdText text={inhalt.texte.neueMechanischBegründeteModelle} /></li>
                      <li><MdText text={inhalt.texte.informativeAnhängeUA} /></li>
                    </ul>
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.ec5DinEn1995} /></h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><MdText text={inhalt.texte.brettsperrholzUndWeitereHolzprodukte} /></li>
                      <li><MdText text={inhalt.texte.verbesserteHinweiseZurDauerhaftigkeit} /></li>
                      <li><MdText text={inhalt.texte.neueRegelnFürDurchbrüche} /></li>
                      <li><MdText text={inhalt.texte.erweiterteQuerdrucknachweiseSchwingungsn} /></li>
                    </ul>
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.ec0En19902023} /></h3><MdText text={inhalt.texte.geänderterAnsatzFürDen} /><Offen />
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.ec3DinEn1993} /></h3><MdText text={inhalt.texte.stahlsortenBisS700Elliptische} /></div>
                </div>
                <Querverweis ziel="sicherheitskonzept" titel={inhalt.werte.heutigesSicherheitskonzept} linkText={inhalt.werte.zumModulEurocodeSicherheitskonzept}>
                  <p><MdText text={inhalt.texte.teilsicherheitsbeiwerteUndKombinationsre} /></p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 5. STAND ───────────── */}
            {reiter === 'stand' && (
              <div className="flex flex-col gap-5">
                <div className="overflow-x-auto rounded-xl border border-home-grau/30" role="region" aria-label={inhalt.werte.übersichtGiltHeuteNeu} tabIndex={0}>
                  <table className="w-full min-w-[640px] border-collapse">
                    <caption className="text-left text-xs font-bold text-text-main p-2.5"><MdText text={inhalt.texte.normenstandNovember2026Deutschland} /></caption>
                    <thead>
                      <tr>
                        <th scope="col" className={th}>Bereich</th>
                        <th scope="col" className={th}><MdText text={inhalt.texte.giltHeuteBauaufsichtlich} /></th>
                        <th scope="col" className={th}><MdText text={inhalt.texte.neuErschienen} /></th>
                        <th scope="col" className={th}><MdText text={inhalt.texte.voraussichtlichEingeführt} /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {STAND.map(z => (
                        <tr key={z.bereich}>
                          <th scope="row" className={`${td} font-bold`}>{z.bereich}</th>
                          <td className={td}>{z.heute}</td>
                          <td className={td}>{z.neu}</td>
                          <td className={td}>{z.einfuehrung}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="overflow-x-auto rounded-xl border border-home-grau/30" role="region" aria-label={inhalt.texte.entwürfeUndProjekteStand} tabIndex={0}>
                  <table className="w-full min-w-[640px] border-collapse">
                    <caption className="text-left text-xs font-bold text-text-main p-2.5"><MdText text={inhalt.texte.entwürfeUndProjekteStand} /></caption>
                    <thead>
                      <tr>
                        <th scope="col" className={th}>Dokument</th>
                        <th scope="col" className={th}>Art</th>
                        <th scope="col" className={th}>Inhalt</th>
                        <th scope="col" className={th}>Quelle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ENTWUERFE.map(e => (
                        <tr key={e.was}>
                          <th scope="row" className={`${td} font-bold whitespace-nowrap`}>{e.was}</th>
                          <td className={td}>{e.art}</td>
                          <td className={td}>{e.gegenstand}</td>
                          <td className={td}>{e.quelle}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-text-main/70 p-2.5"><MdText text={inhalt.texte.entwürfeÄndernNichts} /></p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.wasHeißtDasFür} /></h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><MdText text={inhalt.texte.nachweiseWeiterhinNachDen} /></li>
                      <li><MdText text={inhalt.texte.neueAusgabenNichtMit} /></li>
                      <li><MdText text={inhalt.texte.beiNeuenKlinkerarmenBetonen} /></li>
                    </ul>
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5"><MdText text={inhalt.texte.offenePunkteStandDieses} /></h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><MdText text={inhalt.texte.terminDerBauaufsichtlichenEinführung} /></li>
                      <li><MdText text={inhalt.texte.veröffentlichungMvvTb20261} /></li>
                      <li><MdText text={inhalt.texte.inhaltDerNeuenNationalen} /></li>
                      <li><MdText text={inhalt.texte.verbindlicheDeutscheErcRegeln} /></li>
                      <li><MdText text={inhalt.texte.wortlautDerNeuenBindemittelbegriffe} /></li>
                    </ul>
                  </div>
                </div>
                <Querverweis ziel="regularien" titel={inhalt.werte.wieNormenVerbindlichWerden} linkText={inhalt.werte.zumModulRegulativesNormung}>
                  <p><MdText text={inhalt.texte.denWegVonDer} /></p>
                </Querverweis>
              </div>
            )}
          </div>
        </ModuleTabs>
      </div>

      <ModulTest moduleId="normen_ausblick" />

      <ModuleFooter
        lastReviewed={inhalt.werte.november2026Aktualisiert}
        literatur={inhalt.daten["NormenAusblick.literatur"]}
        regelwerke={inhalt.daten["NormenAusblick.regelwerke"]}
        weblinks={[
          inhalt.daten["NormenAusblick.weblinks.0"],
          { title: inhalt.werte.dinMediaDinEn, url: 'https://www.dinmedia.de/de/norm/din-en-206-1/399836281' },
          { title: inhalt.werte.dinMediaDinEn2, url: 'https://www.dinmedia.de/de/norm/din-en-206-2/399836378' },
          { title: inhalt.werte.dinMediaDinEn3, url: 'https://www.dinmedia.de/de/norm/din-en-1992-1-1/374296420' },
          { title: inhalt.werte.dinMediaDinEn4, url: 'https://www.dinmedia.de/de/norm/din-en-1995-1-1/396471004' },
          { title: inhalt.werte.dinMediaDinEn5, url: 'https://www.dinmedia.de/de/norm/din-en-1993-1-1/351345321' },
          inhalt.daten["NormenAusblick.weblinks.6"],
          { title: inhalt.werte.dinProjektDin10452A1, url: 'https://www.din.de/en/wdc-proj:din21:404330876' },
          { title: inhalt.werte.dinEntwurfEc2Na1, url: 'https://www.din.de/en/wdc-beuth:din21:392741740' },
          { title: inhalt.werte.dinEntwurfEc2A1, url: 'https://www.din.de/en/getting-involved/standards-committees/nabau/drafts/wdc-beuth:din21:403144094' },
          { title: inhalt.werte.trisMvvTb20261, url: 'https://technical-regulation-information-system.ec.europa.eu/en/notification/28201' },
          { title: inhalt.werte.dinMediaDafstbHeft, url: 'https://www.dinmedia.de/de/fachliteratur/dafstb-heft-666/397094950' },
          { title: inhalt.werte.nsaiPublicConsultationPren, url: 'https://www.nsai.ie/about/news/public-consultation-concrete-part-1/' },
          { title: inhalt.werte.nsai2ndGenerationEurocodes, url: 'https://www.nsai.ie/about/news/2nd-generation-eurocodes-update-on-irelands-adoption-plan/' },
          { title: inhalt.werte.gccaEn206Report, url: 'https://gccassociation.org/wp-content/uploads/2025/11/GCCA_EN206-Report.pdf' },
          inhalt.daten["NormenAusblick.weblinks.11"],
          { title: inhalt.werte.theConcreteCentreNext, url: 'https://concretecentre.com/News/2022/Next-Generation-Eurocode-2.aspx' },
          { title: inhalt.werte.rwthCampusCbiThe, url: 'https://cbi.rwth-campus.com/en/news/the-second-generation-of-eurocode-2-in-practice-opportunities-and-challenges/' },
          { title: inhalt.werte.irbKurzberichtEaseOf, url: 'https://www.irbnet.de/daten/rswb/erg_dokument/25109000014_Kurzbericht.pdf' },
          { title: inhalt.werte.bauforumstahlEurocodesAufCen, url: 'https://bauforumstahl.de/wp-content/uploads/2026/03/pressemitteilung-bauforumstahl-Eurocodes-auf-CEN-Ebene-veroeffentlicht.pdf' },
          { title: inhalt.werte.energiforskPetersonErcBetongdagen, url: 'https://energiforsk.se/media/34279/2-markus_peterson_betongdagen-2025.pdf' },
          { title: inhalt.werte.fachkommissionBautechnikSchreibenZur, url: 'https://www.bauen-wohnen.sachsen.de/download/Schreiben_FKBT_zur_bauaufsichtlichen_Einfuehrung_des_Eurocodes.pdf' },
        ]}
        formeln={inhalt.daten["NormenAusblick.formeln"]}
      />
    </div>
  );
}
