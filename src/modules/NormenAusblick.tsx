import React, { useState } from 'react';
import { Telescope, Target, Layers, Gauge, Building2, Table2, AlertTriangle, CalendarClock } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

/**
 * Ausblick auf die neue Normengeneration im Betonbau und bei den Eurocodes (Stand Oktober 2026).
 * Alle Aussagen stützen sich auf öffentlich zugängliche Quellen (Fußzeile). Was dort nicht steht,
 * ist als „noch offen“ bzw. „unsicher“ gekennzeichnet. Maßgebend für die Bemessung bleiben die
 * bauaufsichtlich eingeführten Ausgaben (MVV TB 2025/1).
 */

type Reiter = 'warum' | 'beton' | 'erc' | 'eurocodes' | 'stand';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'warum', label: 'Warum neu?', icon: Target },
  { id: 'beton', label: 'DIN EN 206-1/-2:2026', icon: Layers },
  { id: 'erc', label: 'Expositionswiderstand (ERC)', icon: Gauge },
  { id: 'eurocodes', label: 'Eurocodes 2. Generation', icon: Building2 },
  { id: 'stand', label: 'Was gilt wann?', icon: Table2 },
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
    bereich: 'Beton: Festlegung, Eigenschaften, Herstellung, Konformität',
    heute: 'DIN EN 206:2021-06 zusammen mit DIN 1045-2:2023-08',
    neu: 'DIN EN 206-1:2026-07 und DIN EN 206-2:2026-07 (ersetzen DIN EN 206:2021-06 teilweise); EN 206-3 (Geotechnik): DIN-Ausgabe hier nicht geprüft',
    einfuehrung: <><Offen /> Setzt eine abgestimmte Neufassung von DIN 1045-2 voraus; ein Termin ist öffentlich nicht bekannt.</>,
  },
  {
    bereich: 'Eurocode 0: Grundlagen der Tragwerksplanung',
    heute: 'DIN EN 1990 (1. Generation, aktuelle DIN-Ausgabe 2021-10) mit NA',
    neu: 'EN 1990:2023 erschienen; die Deutsche Fassung führt DIN Media als „vorbestellbar“ (Ausgabedatum noch nicht genannt)',
    einfuehrung: <><Offen /> Forschungsbericht zur Anwendbarkeit (2025): Einführung „ab 2027 (Plan A)“ möglich.</>,
  },
  {
    bereich: 'Eurocode 2: Betonbau',
    heute: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04',
    neu: 'DIN EN 1992-1-1:2025-09 (Deutsche Fassung EN 1992-1-1:2023; ersetzt auch DIN EN 1992-2 und DIN EN 1992-3); neuer NA: noch offen',
    einfuehrung: <><Offen /> Fachveröffentlichung (RWTH, 2025) erwartet die Einführung 2027 einschließlich NA – keine amtliche Festlegung.</>,
  },
  {
    bereich: 'Eurocode 3: Stahlbau',
    heute: 'DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA',
    neu: 'DIN EN 1993-1-1:2025-04 (Deutsche Fassung EN 1993-1-1:2022); neuer NA: noch offen',
    einfuehrung: <Offen />,
  },
  {
    bereich: 'Eurocode 5: Holzbau',
    heute: 'DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA:2013-08',
    neu: 'DIN EN 1995-1-1:2026-09 (Deutsche Fassung EN 1995-1-1:2025); NA ausstehend',
    einfuehrung: <Offen />,
  },
];

const ZEITSTRAHL: readonly { wann: string; was: string; quelle: string }[] = [
  { wann: '2012', was: 'Normungsauftrag M/515 der EU-Kommission an CEN zur Überarbeitung und Erweiterung der Eurocodes', quelle: 'JRC' },
  { wann: '2016', was: 'Beginn der Arbeiten in CEN/TC 250', quelle: 'JRC' },
  { wann: 'bis 30.03.2026', was: 'endgültige Texte an die nationalen Normungsorganisationen (DAV)', quelle: 'JRC' },
  { wann: 'März 2026', was: 'alle vorgesehenen Teile auf CEN-Ebene veröffentlicht (74 Normteile und ergänzende Spezifikationen)', quelle: 'bauforumstahl' },
  { wann: '30.09.2027', was: 'spätester Termin für die nationale Veröffentlichung (DoP)', quelle: 'JRC' },
  { wann: '30.03.2028', was: 'Zurückziehung entgegenstehender nationaler Normen, also der 1. Generation (DoW)', quelle: 'JRC' },
];

export default function NormenAusblick() {
  const [reiter, setReiter] = useState<Reiter>('warum');

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className={`${karte} flex flex-col gap-5`}>
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Telescope className="w-5 h-5 text-shiraz" aria-hidden={true} /> Ausblick: neue Normengeneration (Beton und Eurocodes)
          </h2>
          <p className="text-xs text-text-main/60 font-mono mt-1">
            DIN EN 206-1/-2:2026, Expositionswiderstandsklassen und Eurocodes der 2. Generation – was erschienen ist und was (noch) gilt
          </p>
        </div>

        <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85 leading-relaxed flex items-start gap-2.5" role="note">
          <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-0.5" aria-hidden={true} />
          <p>
            <strong>Stand Oktober 2026:</strong> Für Bemessung und Ausführung in Deutschland gelten weiterhin die bauaufsichtlich eingeführten Ausgaben
            (MVV TB 2025/1): DIN EN 206:2021-06 mit DIN 1045-2:2023-08 und die Eurocodes der Ausgaben ab 2010-12 mit Nationalen Anhängen.
            Dieses Modul gibt einen Ausblick auf Grundlage öffentlich zugänglicher Quellen; die Normtexte selbst wurden nicht ausgewertet.
            Punkte mit <Unsicher>unsicher</Unsicher> oder <Offen /> sind öffentlich nicht belegt.
          </p>
        </div>

        <ModuleTabs label="Bereiche des Moduls Ausblick neue Normengeneration" tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
          <div className="pt-5 animate-in fade-in duration-300">
            {/* ───────────── 1. WARUM ───────────── */}
            {reiter === 'warum' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <p>
                    Die erste Eurocode-Generation wurde in Deutschland ab 2012 bauaufsichtlich eingeführt. Schon 2012 erteilte die EU-Kommission den
                    Normungsauftrag <strong>M/515</strong>, die Eurocodes zu überarbeiten und ihren Anwendungsbereich zu erweitern; CEN/TC 250 begann 2016 mit der Arbeit.
                    Parallel überarbeitete CEN/TC 104 die Betonnorm EN 206. Beide Vorhaben sind aufeinander bezogen: EN 206-1:2026 wurde an die überarbeitete EN 1992-1-1:2023 angeglichen.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Anwendbarkeit („Ease of Use“)</h3>
                    Weniger national festzulegende Parameter (NDP), mehr Harmonisierung und eine geringere Gesamtgröße waren zentrale Ziele.
                    Ein vom DIBt geförderter Forschungsbericht (2025) kommt zu dem Ergebnis, dass diese Ziele „nur teilweise erreicht“ werden.
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Erweiterter Anwendungsbereich</h3>
                    Neue Inhalte etwa für die Bewertung bestehender Tragwerke, Stahlfaserbeton, Beton mit rezyklierter Gesteinskörnung, nichtmetallische Bewehrung (EC2)
                    oder Brettsperrholz (EC5). Teile für Brücken und Behälter gingen im EC2 im Hauptteil auf.
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Leistungsbezogene Dauerhaftigkeit</h3>
                    Statt die Betondeckung allein über Expositionsklasse und Betonzusammensetzung festzulegen, soll der Widerstand des Betons über
                    <strong> Expositionswiderstandsklassen (ERC)</strong> eingehen. Das öffnet einen Weg für neue, klinkerärmere Betone, deren Widerstand durch Prüfung nachgewiesen wird.
                  </div>
                </div>
                <div className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5">Warum das für Baustoffe wichtig ist</h3>
                  <p>
                    Die bisherigen Grenzwerte für w/z-Wert, Mindestzementgehalt und Zementart beschreiben bewährte Rezepturen (deskriptives Konzept).
                    Ein leistungsbezogenes Konzept fragt dagegen, welchen Karbonatisierungs- oder Chlorideindringwiderstand der Beton tatsächlich hat.
                    Damit rücken Prüfverfahren wie die Schnellkarbonatisierung und der CO₂-Fußabdruck des Betons in den Mittelpunkt.
                  </p>
                </div>
              </div>
            )}

            {/* ───────────── 2. DIN EN 206-1/-2:2026 ───────────── */}
            {reiter === 'beton' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <p>
                    Im Juli 2026 sind <strong>DIN EN 206-1:2026-07</strong> (Teil 1: Eigenschaften, Anforderungen, werkseigene Produktionskontrolle und Bewertungskriterien für einzelne Werte)
                    und <strong>DIN EN 206-2:2026-07</strong> (Teil 2: Konformitätsbewertung und Zertifizierung) erschienen. Beide ersetzen DIN EN 206:2021-06 <em>teilweise</em>.
                    Auf europäischer Ebene ist EN 206-1:2026 seit April 2026 veröffentlicht.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Teil 1</h3>
                    Eigenschaften und Anforderungen an Beton, Ausgangsstoffe, Frisch- und Festbeton, Lieferung, werkseigene Produktionskontrolle, Bewertungskriterien für Einzelwerte.
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Teil 2</h3>
                    Alle Aspekte der Konformitätsbewertung und Zertifizierung; mit der Trennung von Teil 1 und Teil 2 wird laut Änderungsvermerk das Neutralitätsprinzip umgesetzt.
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Teil 3</h3>
                    Zusätzliche Anforderungen für Beton im Spezialtiefbau; der bisherige Anhang D (Beton für geotechnische Zwecke) wurde dorthin überführt.
                    <span className="block mt-1"><Unsicher>DIN-Ausgabe nicht geprüft</Unsicher></span>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border border-home-grau/30" role="region" aria-label="Änderungen in DIN EN 206-1:2026-07" tabIndex={0}>
                  <table className="w-full min-w-[520px] border-collapse">
                    <caption className="text-left text-xs font-bold text-text-main p-2.5">Wesentliche Änderungen laut Änderungsvermerk und öffentlicher Ankündigung</caption>
                    <thead>
                      <tr><th scope="col" className={th}>Thema</th><th scope="col" className={th}>Was öffentlich bekannt ist</th><th scope="col" className={th}>Grenze der Aussage</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row" className={`${td} font-bold`}>Bindemittel</th>
                        <td className={td}>Neue Terminologie für Bindemittel aufgenommen.</td>
                        <td className={td}><Unsicher>unsicher</Unsicher> Welche Begriffe und ob sich die Anrechnung von Zusatzstoffen (k-Wert-Ansatz) ändert, ist in den öffentlichen Texten nicht beschrieben.</td>
                      </tr>
                      <tr>
                        <th scope="row" className={`${td} font-bold`}>CO₂-Emissionen</th>
                        <td className={td}>Neuer Abschnitt 5.4 „Klassen bezüglich CO₂-Emissionen“. Im Entwurf prEN 206-1:2024 wird Beton nach der prozentualen GWP-Minderung gegenüber einem Referenzbeton gleicher Leistung (CEM I ohne Zusatzstoffe) in 10-%-Stufen von GWR 0 bis GWR 9 eingeteilt; die Klassen dürfen in Festlegung und Lieferschein angegeben werden.</td>
                        <td className={td}><Unsicher>unsicher</Unsicher> Die Einzelheiten stammen aus der Entwurfsfassung (Bericht des Zementverbands GCCA); ob die Endfassung sie unverändert enthält, ist öffentlich nicht bestätigt.</td>
                      </tr>
                      <tr>
                        <th scope="row" className={`${td} font-bold`}>Expositionswiderstand</th>
                        <td className={td}>„Öffnung für nationale Regeln zu Expositionswiderstandsklassen“ (siehe Reiter ERC).</td>
                        <td className={td}>Eigene europäische ERC-Regeln enthält die Norm nach den öffentlichen Angaben nicht.</td>
                      </tr>
                      <tr>
                        <th scope="row" className={`${td} font-bold`}>Expositionsklassen</th>
                        <td className={td}>Informative Inhalte zu den Expositionsklassen in Anhang C verschoben; XC, XD, XS, XF, XA bleiben als Einwirkungsklassen erhalten.</td>
                        <td className={td}>Die deutschen Grenzwerte stehen bis auf Weiteres in DIN 1045-2:2023-08.</td>
                      </tr>
                      <tr>
                        <th scope="row" className={`${td} font-bold`}>Struktur</th>
                        <td className={td}>Anhang M (Bestimmungen am Verwendungsort) in die Einleitung, Anhang L in den Haupttext; Angleichung an EN 1992-1-1:2023.</td>
                        <td className={td}>–</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5">Warum DIN EN 206:2021-06 noch maßgebend ist</h3>
                  <p>
                    In Deutschland wird DIN EN 206 nur zusammen mit dem nationalen Anwendungsdokument DIN 1045-2 angewendet; dort stehen etwa die Grenzwerte je Expositionsklasse.
                    Eine auf DIN EN 206-1:2026 abgestimmte Neufassung von DIN 1045-2 und deren bauaufsichtliche Einführung stehen aus. <Offen />
                  </p>
                </div>
                <Querverweis ziel="dauerhaftigkeit" titel="Heutige Regeln für Expositionsklassen und Betondeckung" linkText="Zum Modul Dauerhaftigkeit">
                  <p>Die heute geltenden Grenzwerte nach DIN 1045-2:2023-08 und die Mindestbetondeckung nach DIN EN 1992-1-1/NA behandelt das Modul Dauerhaftigkeit.</p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 3. ERC ───────────── */}
            {reiter === 'erc' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <p>
                    EN 1992-1-1:2023 führt <strong>Expositionswiderstandsklassen (ERC)</strong> ein. Sie ersetzen die bisherigen Anforderungsklassen (S1 bis S6) als Zwischenschritt
                    zur Betondeckung: Die Mindestbetondeckung für die Dauerhaftigkeit ergibt sich aus der Expositionsklasse <em>und</em> der ERC des Betons.
                    Erfasst werden die bewehrungskorrosionsrelevanten Einwirkungen Karbonatisierung (XRC) und Chlorideindringen (XRDS); Frost und chemischer Angriff nicht.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">XRC – Karbonatisierung</h3>
                    Abgeleitet aus der charakteristischen Karbonatisierungstiefe (90-%-Quantil) nach 50 Jahren unter Referenzbedingungen (400 ppm CO₂, 65 % r. F., 20 °C).
                    Die Klassenzahl hat die Dimension einer Karbonatisierungsrate in mm/√a. Klassen: XRC 0,5 – 1 – 2 – 3 – 4 – 5 – 6 – 7.
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">XRDS – Chloride</h3>
                    Abgeleitet aus der charakteristischen Chlorideindringtiefe bei einer Referenz-Chloridkonzentration. Die Klassenzahl hat die Dimension eines Diffusionskoeffizienten
                    in 10⁻¹³ m²/s. Klassen: XRDS 0,5 – 1 – 1,5 – 2 – 3 – 4 – 5 – 6 – 8 – 10.
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-home-grau/30 overflow-x-auto">
                  <BlockMath math="x_{c,50} \approx \mathrm{XRC} \cdot \sqrt{50\,\text{a}} \approx 7{,}1 \cdot \mathrm{XRC} \quad \Rightarrow \quad \mathrm{XRC}\;3:\; x_{c,50} \approx 21\,\text{mm}" />
                  <p className="text-[11px] text-text-main/70 text-center">
                    Lesebeispiel nach dem Wurzel-t-Gesetz: Eine kleinere Klassenzahl bedeutet einen höheren Karbonatisierungswiderstand.
                    <span className="ml-1"><Unsicher>Lesart, Normtext nicht eingesehen</Unsicher></span>
                  </p>
                </div>
                <div className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5">Nachweis über Prüfung</h3>
                  <p>
                    Referenzverfahren für XRC ist nach der Fachliteratur die Prüfung bei atmosphärischer CO₂-Konzentration (DIN EN 12390-10), für XRDS DIN EN 12390-11.
                    Nationale Bestimmungen dürfen das beschleunigte Verfahren nach <strong>DIN EN 12390-12</strong> (3 % CO₂) verwenden, wenn ein Umrechnungsfaktor auf natürliche
                    Bedingungen festgelegt ist. Für bewährte Betone sind auch vorab zugeordnete Klassen (Deemed-to-satisfy) vorgesehen.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Europäisch: keine gemeinsame Betonnorm für ERC</h3>
                    Eine eigene Norm EN 206-100 sollte die ERC-Anforderungen an den Beton regeln; das CEN-Projekt wurde im Juni 2024 gelöscht. Nach einem schwedischen Fachvortrag (2025)
                    fehlte der europäische Konsens, die ERC-Regeln sollen deshalb in nationale Anwendungsdokumente zu EN 206. Dazu passt die „Öffnung für nationale Regeln“ in EN 206-1:2026.
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Deutschland: Konzept in Arbeit</h3>
                    DAfStb-Heft 666 (2025) untersucht ein „deutsches ERC-Konzept“ für XC1 bis XC4. Danach erreicht die Mehrheit der untersuchten Betone XRC 5; je nach Expositionsklasse,
                    Bauteildicke und Zementart ergeben sich bis zu 22 % geringere Treibhausgasemissionen als bei den Referenzrezepturen nach DIN 1045-2.
                    <span className="block mt-1"><Unsicher>verbindliche nationale ERC-Regeln: noch offen</Unsicher></span>
                  </div>
                </div>
                <Querverweis ziel="schnellkarbonatisierung" titel="Karbonatisierungswiderstand selbst bestimmen" linkText="Zum Modul Schnellkarbonatisierung">
                  <p>
                    Das Modul Schnellkarbonatisierung ermittelt K_AC nach DIN EN 12390-12 und rechnet näherungsweise auf natürliche Bedingungen um. Das Ergebnis K_nat in mm/√a hat dieselbe
                    Dimension wie die XRC-Klassenzahl – eine Zuordnung zu einer Klasse setzt aber den national festgelegten Umrechnungsfaktor und die Prüfvorgaben voraus.
                  </p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 4. EUROCODES ───────────── */}
            {reiter === 'eurocodes' && (
              <div className="flex flex-col gap-5">
                <div className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-2 flex items-center gap-2"><CalendarClock size={16} className="text-shiraz" aria-hidden={true} /> Europäischer Zeitplan</h3>
                  <ol className="flex flex-col gap-2">
                    {ZEITSTRAHL.map(z => (
                      <li key={z.wann} className="grid grid-cols-[7.5rem_1fr] gap-3 text-xs">
                        <span className="font-bold text-shiraz">{z.wann}</span>
                        <span>{z.was} <span className="text-text-main/60">({z.quelle})</span></span>
                      </li>
                    ))}
                  </ol>
                  <p className="text-xs mt-3">
                    Zwischen der spätesten nationalen Veröffentlichung und der Zurückziehung liegt eine Koexistenzphase, in der beide Generationen nebeneinander stehen;
                    die irische Normungsorganisation NSAI spricht für ihren Zeitplan von zwölf Monaten. Nationale Anhänge müssen neu erarbeitet werden.
                  </p>
                </div>
                <div className={kasten}>
                  <h3 className="font-bold text-text-main text-sm mb-1.5">Stand in Deutschland</h3>
                  <p>
                    Die DIN-Fassungen erscheinen schrittweise (z. B. EC3-1-1 im April 2025, EC2-1-1 im September 2025, EC5-1-1 im September 2026). Bauaufsichtlich eingeführt ist nach
                    MVV TB 2025/1 weiterhin die 1. Generation. Die Zurückziehung einer DIN-Norm allein ändert daran nichts: Maßgebend für das Bauordnungsrecht ist, welche Ausgabe die
                    Technischen Baubestimmungen nennen. Bei der 1. Generation wurde das Paket aus EC 0 bis 9 zum 01.07.2012 verbindlich, nachdem Normen und Nationale Anhänge vorlagen.
                  </p>
                  <p className="mt-2">
                    Ein Forschungsbericht der Initiative Praxisgerechte Regelwerke (2025) hält die Einführung „ab 2027 (Plan A)“ für möglich; eine abschließende Bewertung sei erst nach Vorlage aller
                    finalen Nationalen Anhänge möglich. Für EC2 wird in einer Fachveröffentlichung die Einführung 2027 einschließlich NA erwartet. <Offen />
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">EC2 – DIN EN 1992-1-1:2025-09</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>vollständige technische Überarbeitung; Inhalte von EN 1992-2 (Brücken) und EN 1992-3 (Behälter) aufgenommen, neue Anhänge K bis S</li>
                      <li>Dauerhaftigkeit über Expositionswiderstandsklassen (ERC) statt Anforderungsklassen</li>
                      <li>neue, mechanisch begründete Modelle für Querkraft ohne Querkraftbewehrung und Durchstanzen</li>
                      <li>informative Anhänge u. a. zu Bestandsbewertung, Stahlfaserbeton, rezyklierter Gesteinskörnung und FVK-Bewehrung; nichtrostender Betonstahl normativ</li>
                    </ul>
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">EC5 – DIN EN 1995-1-1:2026-09</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Brettsperrholz und weitere Holzprodukte, gegliedert nach Produktgruppen mit Materialkennwerten</li>
                      <li>verbesserte Hinweise zur Dauerhaftigkeit</li>
                      <li>neue Regeln für Durchbrüche, Verstärkungen, zimmermannsmäßige Verbindungen, eingeklebte Stahlstäbe und Holzpfähle</li>
                      <li>erweiterte Querdrucknachweise, Schwingungsnachweis überarbeitet, Ermüdungsnachweis neu, Robustheit verbessert</li>
                    </ul>
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">EC0 – EN 1990:2023</h3>
                    Geänderter Ansatz für den Nachweis im Grenzzustand der Tragfähigkeit, ergänzte Festlegungen zu Robustheit, Ermüdung, geotechnischen Bauwerken, Nachhaltigkeit und
                    Zuverlässigkeitsanalyse; Anwendungsbereich um Lager erweitert. DIN-Fassung angekündigt. <Offen />
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">EC3 – DIN EN 1993-1-1:2025-04</h3>
                    Stahlsorten bis S700, elliptische Hohlprofile, neue Verfahren für Querschnitte der Klasse 3 und für den Biegedrillknicknachweis, Ablaufdiagramm zur Tragwerksberechnung.
                  </div>
                </div>
                <Querverweis ziel="sicherheitskonzept" titel="Heutiges Sicherheitskonzept" linkText="Zum Modul Eurocode-Sicherheitskonzept">
                  <p>Teilsicherheitsbeiwerte und Kombinationsregeln nach der eingeführten DIN EN 1990 mit NA behandelt das Modul Eurocode-Sicherheitskonzept.</p>
                </Querverweis>
              </div>
            )}

            {/* ───────────── 5. STAND ───────────── */}
            {reiter === 'stand' && (
              <div className="flex flex-col gap-5">
                <div className="overflow-x-auto rounded-xl border border-home-grau/30" role="region" aria-label="Übersicht: gilt heute, neu erschienen, voraussichtlich eingeführt" tabIndex={0}>
                  <table className="w-full min-w-[640px] border-collapse">
                    <caption className="text-left text-xs font-bold text-text-main p-2.5">Normenstand Oktober 2026 (Deutschland)</caption>
                    <thead>
                      <tr>
                        <th scope="col" className={th}>Bereich</th>
                        <th scope="col" className={th}>Gilt heute (bauaufsichtlich)</th>
                        <th scope="col" className={th}>Neu erschienen</th>
                        <th scope="col" className={th}>Voraussichtlich eingeführt</th>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Was heißt das für Planung und Studium?</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Nachweise weiterhin nach den eingeführten Ausgaben führen und im Bericht die Ausgabe angeben.</li>
                      <li>Neue Ausgaben nicht mit Nationalen Anhängen der alten Generation kombinieren.</li>
                      <li>Bei neuen, klinkerarmen Betonen: Karbonatisierungswiderstand früh prüfen lassen – er wird mit ERC zur Planungsgröße.</li>
                    </ul>
                  </div>
                  <div className={kachel}>
                    <h3 className="font-bold text-text-main text-sm mb-1.5">Offene Punkte (Stand dieses Moduls)</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Termin der bauaufsichtlichen Einführung (MVV TB) für EN 206-1/-2 und die Eurocodes der 2. Generation</li>
                      <li>Inhalt der neuen Nationalen Anhänge und einer Neufassung von DIN 1045-2</li>
                      <li>verbindliche deutsche ERC-Regeln und Umrechnungsfaktor für DIN EN 12390-12</li>
                      <li>Wortlaut der neuen Bindemittelbegriffe und der CO₂-Klassen in der Endfassung</li>
                    </ul>
                  </div>
                </div>
                <Querverweis ziel="regularien" titel="Wie Normen verbindlich werden" linkText="Zum Modul Regulatives & Normung">
                  <p>Den Weg von der Norm über die MVV TB in das Landesrecht und den Unterschied zwischen Norm und Technischer Baubestimmung behandelt das Modul Regulatives & Normung.</p>
                </Querverweis>
              </div>
            )}
          </div>
        </ModuleTabs>
      </div>

      <ModulTest moduleId="normen_ausblick" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (Modul neu erstellt aus öffentlichen Quellen; fachliche Freigabe durch den Autor ausstehend)"
        literatur={[
          'Andrade, C.; Izquierdo, D.: Durability and cover depth provisions in next Eurocode 2. Background modelling and calculations. Hormigón y Acero 74 (2023), Nr. 299–300, S. 19–40',
          'Hermerschmidt, W.: Wissenschaftliche Studie zur Ermittlung des CO2-Reduktionspotenzials durch das deutsche ERC-Konzept. DAfStb-Heft 666. Berlin: Beuth/DIN Media 2025',
          'Initiative Praxisgerechte Regelwerke im Bauwesen e. V.: Analyse der künftigen Eurocodes hinsichtlich der tatsächlich erreichten Verbesserung der Anwendbarkeit (Ease of Use) – Fortsetzung. Kurzbericht, Stand 06.08.2025 (IRB)',
          'GCCA – Global Cement and Concrete Association: EN 206 Clause 5.4 (prEN 206-1:2024) und GCCA Low Carbon Ratings. Bericht 2025',
          'Peterson, M.: Exponeringsresistensklasser (ERC). Vortrag Betongdagen 2025, Energiforsk',
        ]}
        regelwerke={[
          'DIN_EN_206',
          { title: 'DIN EN 206-1:2026-07 (Beton – Teil 1: Eigenschaften, Anforderungen, werkseigene Produktionskontrolle und Bewertungskriterien für einzelne Werte; bauaufsichtlich noch nicht eingeführt)' },
          { title: 'DIN EN 206-2:2026-07 (Beton – Teil 2: Konformitätsbewertung und Zertifizierung; bauaufsichtlich noch nicht eingeführt)' },
          'DIN_EN_1992_1_1',
          'DIN_EN_1993_1_1',
          'DIN_EN_1995_1_1',
          { title: 'DIN EN 1990 mit NA (1. Generation, eingeführt); EN 1990:2023 (2. Generation, DIN-Fassung angekündigt)' },
          { title: 'DIN EN 12390-12:2020-04 (Prüfung von Festbeton - Teil 12: Bestimmung des Karbonatisierungswiderstandes von Beton - Beschleunigtes Karbonatisierungsverfahren)' },
          { title: 'MVV TB 2025/1 (Muster-Verwaltungsvorschrift Technische Baubestimmungen)' },
        ]}
        weblinks={[
          { title: 'JRC: Second generation of Eurocodes (Mandat M/515, DAV, DoP, DoW)', url: 'https://eurocodes.jrc.ec.europa.eu/second-generation-eurocodes' },
          { title: 'DIN Media: DIN EN 206-1:2026-07 (Änderungsvermerk)', url: 'https://www.dinmedia.de/de/norm/din-en-206-1/399836281' },
          { title: 'DIN Media: DIN EN 206-2:2026-07 (Änderungsvermerk)', url: 'https://www.dinmedia.de/de/norm/din-en-206-2/399836378' },
          { title: 'DIN Media: DIN EN 1992-1-1:2025-09 (Änderungsvermerk)', url: 'https://www.dinmedia.de/de/norm/din-en-1992-1-1/374296420' },
          { title: 'DIN Media: DIN EN 1995-1-1:2026-09 (Änderungsvermerk)', url: 'https://www.dinmedia.de/de/norm/din-en-1995-1-1/396471004' },
          { title: 'DIN Media: DIN EN 1993-1-1:2025-04 (Änderungsvermerk)', url: 'https://www.dinmedia.de/de/norm/din-en-1993-1-1/351345321' },
          { title: 'DIN Media: DIN EN 1990 (Deutsche Fassung EN 1990:2023, vorbestellbar)', url: 'https://www.dinmedia.de/de/norm/din-en-1990/357122321' },
          { title: 'DIN Media: DAfStb-Heft 666 (deutsches ERC-Konzept)', url: 'https://www.dinmedia.de/de/fachliteratur/dafstb-heft-666/397094950' },
          { title: 'NSAI: Public consultation prEN 206-1 (Änderungsliste)', url: 'https://www.nsai.ie/about/news/public-consultation-concrete-part-1/' },
          { title: 'NSAI: 2nd Generation Eurocodes – Ireland’s adoption plan (Koexistenz)', url: 'https://www.nsai.ie/about/news/2nd-generation-eurocodes-update-on-irelands-adoption-plan/' },
          { title: 'GCCA: EN 206 Report (CO₂-Klassen GWR im Entwurf)', url: 'https://gccassociation.org/wp-content/uploads/2025/11/GCCA_EN206-Report.pdf' },
          { title: 'Genorma: CEN-Projekt EN 206-100 (ERC-Beton, gelöscht 2024)', url: 'https://genorma.com/en/standards/cen-proj-76490' },
          { title: 'The Concrete Centre: Next Generation Eurocode 2', url: 'https://concretecentre.com/News/2022/Next-Generation-Eurocode-2.aspx' },
          { title: 'RWTH Campus CBI: The second generation of Eurocode 2 in practice (2025)', url: 'https://cbi.rwth-campus.com/en/news/the-second-generation-of-eurocode-2-in-practice-opportunities-and-challenges/' },
          { title: 'IRB: Kurzbericht Ease of Use der künftigen Eurocodes (2025)', url: 'https://www.irbnet.de/daten/rswb/erg_dokument/25109000014_Kurzbericht.pdf' },
          { title: 'bauforumstahl: Eurocodes auf CEN-Ebene veröffentlicht (März 2026)', url: 'https://bauforumstahl.de/wp-content/uploads/2026/03/pressemitteilung-bauforumstahl-Eurocodes-auf-CEN-Ebene-veroeffentlicht.pdf' },
          { title: 'Energiforsk: Peterson, ERC (Betongdagen 2025)', url: 'https://energiforsk.se/media/34279/2-markus_peterson_betongdagen-2025.pdf' },
          { title: 'Fachkommission Bautechnik: Schreiben zur Einführung der Eurocodes (2010)', url: 'https://bauen-wohnen.sachsen.de/download/Schreiben_FKBT_zur_bauaufsichtlichen_Einfuehrung_des_Eurocodes.pdf' },
        ]}
        formeln={[
          { formel: 'x_{c,50} \\approx \\mathrm{XRC} \\cdot \\sqrt{50\\,\\text{a}}', erklaerung: 'Lesebeispiel: XRC-Klassenzahl als Karbonatisierungsrate in mm/√a, Tiefe nach 50 Jahren unter Referenzbedingungen (Lesart nach Andrade/Izquierdo 2023, nicht aus dem Normtext).' },
        ]}
      />
    </div>
  );
}
