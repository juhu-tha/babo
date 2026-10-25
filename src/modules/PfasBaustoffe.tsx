import React, { useMemo, useState } from 'react';
import { Droplets, Building2, Scale, Hammer, FlaskConical, Calculator, ShieldCheck } from 'lucide-react';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Slider } from '@/src/components/ui/Slider';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { pfasSummenbewertung, ersatzwert, PFAS20, PFAS4, PFAS_GRENZWERTE, type PfasId, type BgAnsatz, type PfasSumme } from '@/src/calc/pfas';

type Reiter = 'einfuehrung' | 'vorkommen' | 'regulierung' | 'rueckbau' | 'analytik' | 'rechner';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Was sind PFAS?', icon: Droplets },
  { id: 'vorkommen', label: 'PFAS in Baustoffen', icon: Building2 },
  { id: 'regulierung', label: 'Regulierung', icon: Scale },
  { id: 'rueckbau', label: 'Rückbau & Entsorgung', icon: Hammer },
  { id: 'analytik', label: 'Analytik', icon: FlaskConical },
  { id: 'rechner', label: 'Rechner PFAS-Summen', icon: Calculator },
];

const karte = 'bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm';
const box = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const zelle = 'p-2 border border-home-grau/30';

/** Beispielprobe (Lehrbeispiel, Grundwasser im Abstrom einer Löschübungsfläche, fiktiv) in ng/l; fehlend = < BG */
const BEISPIEL: Partial<Record<PfasId, number>> = { PFBA: 12, PFPeA: 8, PFHxA: 15, PFHpA: 4, PFOA: 9, PFNA: 2, PFBS: 10, PFHxS: 6, PFOS: 11 };
const startText = (): Record<PfasId, string> =>
  Object.fromEntries(PFAS20.map(s => [s.id, BEISPIEL[s.id] !== undefined ? formatDeZahl(BEISPIEL[s.id], 1) : ''])) as Record<PfasId, string>;

const ANSATZ_TEXT: Readonly<Record<BgAnsatz, string>> = { null: '< BG = 0', halb: '< BG = BG/2', voll: '< BG = BG' };

function SummenKachel({ titel, s, ab }: { titel: string; s: PfasSumme; ab: string }) {
  const farbe = !Number.isFinite(s.summe) ? 'bg-off-white border-home-grau/30' : s.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900';
  return (
    <div className={`p-3 rounded-xl border ${farbe}`}>
      <div className="text-xs flex items-center gap-1"><ShieldCheck size={14} aria-hidden="true" /> {titel} (Grenzwert {formatDeZahl(s.grenzwert, 0)} ng/l ab {ab})</div>
      <div className="text-lg font-bold">{formatDeZahl(s.summe, 1)} ng/l – {formatDeZahl(s.eta * 100, 0)} %</div>
      <div className="text-xs">Spanne {formatDeZahl(s.unten, 1)} bis {formatDeZahl(s.oben, 1)} ng/l · {s.ok ? 'eingehalten' : 'überschritten'}{s.uneindeutig ? ' (nicht eindeutig)' : ''}</div>
    </div>
  );
}

export default function PfasBaustoffe() {
  const [tab, setTab] = useState<Reiter>('einfuehrung');

  const [text, setText] = useState<Record<PfasId, string>>(startText);
  const [bg, setBg] = useState(1);
  const [ansatz, setAnsatz] = useState<BgAnsatz>('halb');

  const werte = useMemo(() => Object.fromEntries(PFAS20.map(s => {
    const t = text[s.id].trim();
    return [s.id, t === '' || t.startsWith('<') ? null : Number(t.replace(',', '.'))];
  })) as Record<PfasId, number | null>, [text]);

  const erg = useMemo(() => pfasSummenbewertung({ werte, bg, ansatz }), [werte, bg, ansatz]);
  const gueltig = Number.isFinite(erg.pfas20.summe);
  const tex = (v: number, d = 1) => formatDeTeX(v, d);
  const ew = ersatzwert(bg, ansatz);
  const summandenTeX = (ids: readonly PfasId[]) => {
    const gem = ids.filter(id => werte[id] !== null).map(id => tex(werte[id] as number));
    const n = ids.filter(id => werte[id] === null).length;
    return [...gem, ...(n > 0 ? [`${n} \\cdot ${tex(ew, 2)}`] : [])].join(' + ') || '0';
  };

  const liveSchritte = gueltig ? [
    {
      titel: 'Werte unter der Bestimmungsgrenze',
      erklaerung: `${erg.pfas20.nKleinerBg} von 20 Stoffen liegen unter der Bestimmungsgrenze BG = ${formatDeZahl(bg, 1)} ng/l. Gewählter Ansatz: ${ANSATZ_TEXT[ansatz]}.`,
      formel: `c_{<BG} = ${tex(ew, 2)}\\,\\text{ng/l}`,
    },
    {
      titel: 'Summe PFAS-20',
      erklaerung: 'Alle 20 Perfluoralkylcarbon- und -sulfonsäuren mit 4 bis 13 C-Atomen:',
      formel: `\\Sigma_{20} = ${summandenTeX(PFAS20.map(s => s.id))} = ${tex(erg.pfas20.summe)}\\,\\text{ng/l}`,
    },
    {
      titel: 'Summe PFAS-4',
      erklaerung: 'PFOA, PFNA, PFHxS und PFOS – die vier Stoffe der EFSA-Bewertung von 2020:',
      formel: `\\Sigma_{4} = ${summandenTeX(PFAS4)} = ${tex(erg.pfas4.summe)}\\,\\text{ng/l}`,
    },
    {
      titel: 'Vergleich mit den Grenzwerten der TrinkwV',
      erklaerung: erg.pfas20.ok && erg.pfas4.ok ? 'Beide Summen liegen unter dem jeweiligen Grenzwert.' : 'Mindestens eine Summe überschreitet ihren Grenzwert.',
      formel: `\\eta_{20} = \\frac{${tex(erg.pfas20.summe)}}{${PFAS_GRENZWERTE.pfas20}} = ${tex(erg.pfas20.eta, 2)} ${erg.pfas20.ok ? '\\le' : '>'} 1, \\quad \\eta_{4} = \\frac{${tex(erg.pfas4.summe)}}{${PFAS_GRENZWERTE.pfas4}} = ${tex(erg.pfas4.eta, 2)} ${erg.pfas4.ok ? '\\le' : '>'} 1`,
    },
    {
      titel: 'Spanne durch die Bestimmungsgrenze',
      erklaerung: erg.pfas20.uneindeutig || erg.pfas4.uneindeutig ? 'Der Grenzwert liegt innerhalb der Spanne – die Bewertung hängt vom Ansatz ab.' : 'Der Grenzwert liegt außerhalb der Spanne – die Bewertung ist unabhängig vom Ansatz.',
      formel: `\\Sigma_{20} \\in [${tex(erg.pfas20.unten)};\\ ${tex(erg.pfas20.oben)}], \\quad \\Sigma_{4} \\in [${tex(erg.pfas4.unten)};\\ ${tex(erg.pfas4.oben)}]\\,\\text{ng/l}`,
    },
  ] : [{ titel: 'Keine Berechnung', erklaerung: 'Die Eingaben sind unzulässig – siehe Hinweise im Rechner.' }];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Droplets className="text-shiraz" aria-hidden="true" /> PFAS in Baustoffen
        </h2>
        <p className={box}>
          Per- und polyfluorierte Alkylsubstanzen (PFAS) sind extrem beständig, wasser-, fett- und schmutzabweisend – Eigenschaften, die sie für Beschichtungen, Dichtstoffe, Membranen und Löschschäume interessant gemacht haben. Gerade ihre Beständigkeit macht sie zu einem Umwelt- und Rückbauproblem. Das Modul zeigt, wo PFAS im Bauwesen vorkommen, wie sie reguliert werden, was das für Rückbau und Entsorgung bedeutet und wie sie analysiert werden. Der Rechner bewertet eine Wasserprobe gegen die Summengrenzwerte der Trinkwasserverordnung.
        </p>
        <div className="p-4 rounded-xl border border-sky-200 bg-sky-50 text-sm text-sky-950 leading-relaxed" role="note">
          <strong>Projekthinweis:</strong> PFAS in Baustoffen und im Rückbau sind ein Forschungsthema an der Technischen Hochschule Augsburg bzw. im TTZ Aichach. Dieses Modul gibt ausschließlich den öffentlich zugänglichen Stand von Recht, Normung und Fachliteratur wieder; Zahlenangaben ohne Rechtsbezug sind Richtwerte.
        </div>

        <ModuleTabs label="Bereiche des Moduls PFAS in Baustoffen" tabs={REITER} aktiv={tab} onWechsel={setTab}>
          {tab === 'einfuehrung' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Definition und Stoffgruppen</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>Definition (OECD 2021):</strong> PFAS sind fluorierte Stoffe, die mindestens ein vollständig fluoriertes Methyl- oder Methylen-Kohlenstoffatom enthalten. Darunter fallen mehr als 10.000 Einzelstoffe.</li>
                  <li><strong>Perfluoralkylsäuren (PFAA):</strong> Carbonsäuren (PFCA, z. B. PFOA) und Sulfonsäuren (PFSA, z. B. PFOS). Sie sind die Endprodukte des Abbaus und werden in der Routineanalytik gemessen.</li>
                  <li><strong>Vorläufer (Präkursoren):</strong> z. B. Fluortelomeralkohole und -sulfonate; sie wandeln sich in der Umwelt in PFAA um.</li>
                  <li><strong>Polymere:</strong> Fluorpolymere mit fluorierter Hauptkette (PTFE, PVDF, ETFE, FEP) und Polymere mit fluorierten Seitenketten (z. B. Fluoracrylate in Imprägnierungen).</li>
                </ul>
              </div>
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Warum „Ewigkeitschemikalien“?</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>C–F-Bindung:</strong> Die Kohlenstoff-Fluor-Bindung gehört zu den stärksten Einfachbindungen der organischen Chemie. PFAA werden in der Umwelt praktisch nicht abgebaut.</li>
                  <li><strong>Mobilität:</strong> Kurzkettige PFAS (C4–C7) sind gut wasserlöslich und gelangen schnell ins Grundwasser; langkettige reichern sich stärker in Organismen an.</li>
                  <li><strong>Gesundheit:</strong> Die Europäische Behörde für Lebensmittelsicherheit (EFSA) hat 2020 für die Summe aus PFOA, PFNA, PFHxS und PFOS eine tolerierbare wöchentliche Aufnahme von 4,4 ng je kg Körpergewicht abgeleitet. Daraus leitet sich die Summe „PFAS-4“ ab.</li>
                </ul>
                <Querverweis ziel="schadstoffe" titel="Weitere Gebäudeschadstoffe" linkText="Zum Modul Schad- und Gefahrstoffe" className="mt-4">
                  Asbest, PAK, PCB und weitere Schadstoffe im Bestand sowie eine Kurzübersicht zu PFAS finden Sie im Modul Schad- und Gefahrstoffe.
                </Querverweis>
              </div>
            </div>
          )}

          {tab === 'vorkommen' && (
            <div className="flex flex-col gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-1">Wo PFAS im Bauwesen vorkommen</h3>
                <p className="text-xs text-text-main/70 mb-3">Übersicht nach Anwendungen; ob ein konkretes Produkt PFAS enthält, zeigen nur Sicherheitsdatenblatt, Herstellerangabe oder Analyse.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse min-w-[640px]">
                    <thead><tr className="bg-off-white text-left"><th className={zelle}>Anwendung</th><th className={zelle}>PFAS-Typ</th><th className={zelle}>Funktion</th><th className={zelle}>Freisetzung</th></tr></thead>
                    <tbody>
                      <tr><td className={`${zelle} font-semibold`}>Beschichtungen (Coil-Coating von Fassaden- und Dachblechen, Pulverlacke)</td><td className={zelle}>Fluorpolymere (PVDF), fluorierte Additive</td><td className={zelle}>Witterungs- und UV-Beständigkeit, Farbtonstabilität</td><td className={zelle}>gering im Gebrauch; Abrieb, Brand, Entsorgung</td></tr>
                      <tr><td className={`${zelle} font-semibold`}>Imprägnierungen und Anti-Graffiti-Systeme (Naturstein, Beton, Pflaster)</td><td className={zelle}>Seitenketten-fluorierte Polymere, Fluortenside</td><td className={zelle}>öl-, wasser- und schmutzabweisend</td><td className={zelle}>Auswaschung, Abbau zu PFAA</td></tr>
                      <tr><td className={`${zelle} font-semibold`}>Farben, Lacke, Klebstoffe</td><td className={zelle}>Fluortenside (Netz- und Verlaufsmittel)</td><td className={zelle}>Benetzung, Oberflächengüte</td><td className={zelle}>geringe Gehalte, Auswaschung</td></tr>
                      <tr><td className={`${zelle} font-semibold`}>Dichtstoffe und Dichtungen</td><td className={zelle}>PTFE-Bänder, Fluorelastomere (FKM), fluorierte Additive</td><td className={zelle}>chemische und thermische Beständigkeit, Gleitfähigkeit</td><td className={zelle}>gering im Gebrauch; Entsorgung</td></tr>
                      <tr><td className={`${zelle} font-semibold`}>Membranen und Folien</td><td className={zelle}>PTFE-beschichtete Glasgewebe, ETFE-Folien, fluorierte Deckschichten</td><td className={zelle}>Dauerhaftigkeit, Selbstreinigung, Lichtdurchlässigkeit</td><td className={zelle}>gering im Gebrauch; Brand, Entsorgung</td></tr>
                      <tr><td className={`${zelle} font-semibold`}>Kabel und technische Gebäudeausrüstung</td><td className={zelle}>Fluorpolymere (FEP, PTFE)</td><td className={zelle}>Isolierung, Brandverhalten</td><td className={zelle}>Entsorgung, Brand</td></tr>
                      <tr><td className={`${zelle} font-semibold`}>Brandschutz: wasserfilmbildende Löschschäume (AFFF)</td><td className={zelle}>Fluortenside (früher PFOS, später kurzkettige Fluortelomere)</td><td className={zelle}>schnelles Löschen von Flüssigkeitsbränden</td><td className={zelle}>direkt in Boden und Grundwasser; Altlasten</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Löschschaum-Altlasten</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><strong>Typische Standorte:</strong> Feuerwehrübungsflächen, Flughäfen, Raffinerien und Tanklager, Brandorte mit Schaumeinsatz, Standorte stationärer Schaumlöschanlagen.</li>
                    <li><strong>Bauteile:</strong> Beton und Estrich von Übungsflächen, Löschwasserrückhaltebecken und Abwasserkanälen nehmen PFAS auf und geben sie über Jahre wieder ab. Sie sind beim Rückbau als belastet zu behandeln, bis eine Analyse das Gegenteil zeigt.</li>
                    <li><strong>Boden und Grundwasser:</strong> Kurzkettige PFAS wandern weit; Grundwasserfahnen reichen oft Kilometer über den Eintragsort hinaus.</li>
                  </ul>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Industrielle Bausubstanz</h3>
                  <p className="text-sm text-text-main/85">In Galvanikbetrieben (PFOS als Netzmittel zur Sprühnebelunterdrückung), in der Papier- und Textilveredelung sowie in der Fluorchemie können Böden, Wände und Entwässerungsleitungen belastet sein. Die historische Erkundung im Rückbaukonzept sollte nach solchen Nutzungen fragen.</p>
                  <Querverweis ziel="membranen_etfe" titel="Fluorpolymere im Membranbau" linkText="Zum Modul Membranen & ETFE" className="mt-4">
                    Aufbau und Eigenschaften von PTFE/Glas-Membranen und ETFE-Folien beschreibt das Modul Membranen und ETFE-Folien.
                  </Querverweis>
                </div>
              </div>
            </div>
          )}

          {tab === 'regulierung' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Stoffrecht (EU und international)</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>Stockholmer Übereinkommen / POP-Verordnung (EU) 2019/1021:</strong> PFOS (2009), PFOA (2019) und PFHxS (2022) samt Salzen und verwandten Verbindungen sind als persistente organische Schadstoffe weitgehend verboten.</li>
                  <li><strong>REACH-Beschränkungen (Anhang XVII):</strong> u. a. langkettige Perfluorcarbonsäuren C9–C14 (Verordnung (EU) 2021/1297), PFHxA (Verordnung (EU) 2024/2462) und PFAS in Feuerlöschschäumen (Verordnung (EU) 2025/1988, in Kraft seit 23.10.2025; Summe aller PFAS ab 1 mg/l, gestaffelte Übergangsfristen je nach Anwendung).</li>
                  <li><strong>Universeller PFAS-Beschränkungsvorschlag:</strong> Deutschland, Dänemark, die Niederlande, Norwegen und Schweden haben 2023 bei der ECHA eine Beschränkung der gesamten Stoffgruppe vorgeschlagen und 2025 überarbeitet. Der Ausschuss für Risikobeurteilung (RAC) hat seine Stellungnahme im März 2026 verabschiedet; der Entwurf des Ausschusses für sozioökonomische Analyse (SEAC) war bis Mai 2026 in der Konsultation, die abschließende SEAC-Stellungnahme wird für Ende 2026 erwartet. Danach entscheidet die EU-Kommission mit den Mitgliedstaaten. <strong>Die Beschränkung ist noch nicht in Kraft;</strong> Ausnahmen und Übergangsfristen, auch für Bauprodukte, sind offen.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-1">Trinkwasser</h3>
                  <p className="text-xs text-text-main/70 mb-3">Trinkwasserverordnung (TrinkwV) vom 20.06.2023, Anlage 2 Teil I; Umsetzung der Richtlinie (EU) 2020/2184</p>
                  <table className="w-full text-xs border-collapse">
                    <thead><tr className="bg-off-white text-left"><th className={zelle}>Parameter</th><th className={zelle}>Grenzwert</th><th className={zelle}>gilt ab</th></tr></thead>
                    <tbody>
                      <tr><td className={zelle}><strong>Summe PFAS-20</strong> (20 PFCA und PFSA mit C4–C13)</td><td className={zelle}>0,1 µg/l = 100 ng/l</td><td className={zelle}>12.01.2026</td></tr>
                      <tr><td className={zelle}><strong>Summe PFAS-4</strong> (PFOA, PFNA, PFHxS, PFOS)</td><td className={zelle}>0,02 µg/l = 20 ng/l</td><td className={zelle}>12.01.2028</td></tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-text-main/70 mt-3">Die EU-Trinkwasserrichtlinie kennt daneben den Parameter „PFAS gesamt“ (0,5 µg/l), den Deutschland nicht übernommen hat.</p>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Boden, Grundwasser, Abfall</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><strong>Leitfaden zur PFAS-Bewertung (BMUV 2022):</strong> bundeseinheitliche Empfehlungen zur Bewertung von Boden- und Gewässerverunreinigungen und zur Entsorgung PFAS-haltigen Bodenmaterials; die Länder haben ihn per Erlass eingeführt.</li>
                    <li><strong>POP-Abfälle:</strong> Abfälle, die PFOS, PFOA oder PFHxS oberhalb der Konzentrationsgrenzen des Anhangs IV der POP-Verordnung enthalten, müssen so behandelt werden, dass die Stoffe zerstört werden.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'rueckbau' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Konsequenzen für Rückbau und Entsorgung</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>Erkunden:</strong> Nutzungsgeschichte auswerten (Löschübungen, Brände mit Schaumeinsatz, Galvanik, Imprägnierungen). PFAS gehören bei Verdacht in das Schadstoffkataster des Rückbaukonzepts.</li>
                  <li><strong>Beproben:</strong> Bauschutt, Estrich, Beton und Boden auf PFAS im Feststoff und im Eluat untersuchen; Ergebnis entscheidet über Verwertungsweg und Abfallschlüssel.</li>
                  <li><strong>Trennen:</strong> belastete Bauteile selektiv ausbauen und getrennt halten – eine Vermischung mit unbelastetem RC-Material verbreitet die Stoffe in neue Bauwerke.</li>
                  <li><strong>Entsorgen:</strong> Belastetes Material darf nicht als Ersatzbaustoff in offene Bauweisen gelangen. Infrage kommen Deponien mit Sickerwasserfassung und -behandlung oder eine thermische Behandlung bei hohen Temperaturen (Sonderabfallverbrennung).</li>
                  <li><strong>Wasser schützen:</strong> Baugruben- und Waschwasser aus belasteten Bereichen fassen und vor der Einleitung behandeln (z. B. Aktivkohle, Ionenaustauscher).</li>
                </ol>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Fluorpolymer-Bauteile</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li>PVDF-beschichtete Bleche, PTFE-Membranen und ETFE-Folien gelten im Gebrauch als wenig mobil. Kritisch sind Herstellung (Prozesshilfsstoffe), Brand und Entsorgung.</li>
                    <li>Bei unvollständiger Verbrennung können kurzkettige PFAS und Fluorwasserstoff entstehen; Verbrennungsanlagen brauchen ausreichende Temperatur und Rauchgasreinigung.</li>
                    <li>Beschichtete Metallbleche werden im Schrottrecycling eingeschmolzen; die Beschichtung verbrennt dabei. Die Abgasreinigung der Hütte ist maßgebend.</li>
                  </ul>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Arbeitsschutz</h3>
                  <p className="text-sm text-text-main/85">Beim Abbruch belasteter Bauteile staubarm arbeiten, Staub- und Hautkontakt vermeiden und die Gefährdungsbeurteilung nach Gefahrstoffverordnung auf PFAS erweitern.</p>
                  <Querverweis ziel="rueckbau" titel="Selektiver Rückbau" linkText="Zum Modul Rückbau & Material" className="mt-4">
                    Rückbaukonzept, Schadstofferkundung und selektiver Abbruch werden im Modul Rückbau & Material behandelt.
                  </Querverweis>
                </div>
              </div>
            </div>
          )}

          {tab === 'analytik' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Einzelstoffanalytik (Target-Analytik)</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>Verfahren:</strong> Anreicherung über Festphasenextraktion, Trennung mit Flüssigchromatographie und Detektion mit Tandem-Massenspektrometrie (LC-MS/MS).</li>
                  <li><strong>Normen:</strong> Wasser nach DIN 38407-42 bzw. ISO 21675, Schlamm, Kompost und Boden nach DIN 38414-14. Feststoffe werden zusätzlich eluiert, z. B. im Schüttelverfahren nach DIN 19529 oder im Säulenversuch nach DIN 19528.</li>
                  <li><strong>Empfindlichkeit:</strong> Bestimmungsgrenzen je Einzelstoff liegen im Wasser typischerweise bei etwa 1 ng/l (Richtwert, laborabhängig).</li>
                  <li><strong>Grenze:</strong> Gemessen wird nur, was auf der Stoffliste steht – bei über 10.000 PFAS bleibt ein großer Teil unerkannt.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Summenparameter und Vorläufer</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><strong>AOF / EOF:</strong> adsorbierbares bzw. extrahierbares organisch gebundenes Fluor, bestimmt mit Verbrennungs-Ionenchromatographie (CIC); für AOF in Wasser genormt nach DIN EN ISO 18127 (ersetzt DIN 38409-59). Erfasst auch unbekannte PFAS, aber ohne Stoffzuordnung.</li>
                    <li><strong>TOP-Assay:</strong> Oxidation der Probe wandelt Vorläufer in messbare Perfluorcarbonsäuren um; die Zunahme gegenüber der Ausgangsmessung zeigt das Vorläuferpotenzial.</li>
                  </ul>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Probenahme</h3>
                  <p className="text-sm text-text-main/85">PFAS sind in vielen Materialien des Alltags enthalten. Probenahmegeräte und Gefäße sollten PFAS-frei sein (z. B. Polypropylen oder Polyethylen statt PTFE), Blindproben dokumentieren mögliche Verschleppungen.</p>
                  <Querverweis ziel="analytik" titel="Analytische Grundlagen" linkText="Zum Modul Analytik" className="mt-4">
                    Chromatographie, Massenspektrometrie und Probenvorbereitung im Überblick finden Sie im Modul Analytik.
                  </Querverweis>
                </div>
              </div>
            </div>
          )}

          {tab === 'rechner' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className="flex flex-col gap-4">
                <CalculatorDisclaimerBanner className="my-1" customText="Lehrrechner: Summenbildung nach TrinkwV Anlage 2 Teil I. Für die amtliche Bewertung gelten die Vorgaben der TrinkwV, des Gesundheitsamts und des akkreditierten Labors." />
                <div className={box}>
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">Bestimmungsgrenze</h3>
                  <Slider label="Bestimmungsgrenze BG je Einzelstoff" min={0.1} max={20} step={0.1} value={bg} unit="ng/l" onChange={e => setBg(Number(e.target.value))} />
                  <div className="flex flex-wrap gap-2 mt-3" role="group" aria-label="Ansatz der Werte unter der Bestimmungsgrenze">
                    {(['null', 'halb', 'voll'] as const).map(a => (
                      <button key={a} type="button" aria-pressed={ansatz === a} onClick={() => setAnsatz(a)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${ansatz === a ? 'bg-shiraz text-white border-shiraz' : 'bg-white border-home-grau/30'}`}>
                        {ANSATZ_TEXT[a]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={box}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Messwerte in ng/l</h3>
                    <button type="button" onClick={() => setText(startText())} className="px-2 py-1 rounded-md text-xs border border-home-grau/30 bg-white cursor-pointer">Beispiel laden</button>
                  </div>
                  <p className="text-xs text-text-main/70 mb-3">Leeres Feld oder „&lt; BG“ = unter der Bestimmungsgrenze. Fett: Stoffe der Summe PFAS-4. Beispiel: fiktive Grundwasserprobe.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PFAS20.map(s => (
                      <label key={s.id} className="flex flex-col text-xs">
                        <span className={PFAS4.includes(s.id) ? 'font-bold text-shiraz' : 'text-text-main/80'} title={`${s.name} (C${s.c})`}>{s.id}</span>
                        <input type="text" inputMode="decimal" value={text[s.id]} placeholder="< BG" aria-label={`${s.name} in ng/l`}
                          onChange={e => setText(t => ({ ...t, [s.id]: e.target.value }))}
                          className="mt-0.5 p-1.5 border border-home-grau rounded-md bg-white text-sm" />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Ergebnis</h3>
                  {gueltig ? (
                    <div className="flex flex-col gap-3">
                      <SummenKachel titel="Summe PFAS-20" s={erg.pfas20} ab="12.01.2026" />
                      <SummenKachel titel="Summe PFAS-4" s={erg.pfas4} ab="12.01.2028" />
                      <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white text-sm">
                        Anteil kurzkettiger PFAS (C4–C7) an PFAS-20: <strong>{formatDeZahl(erg.anteilKurzkettig * 100, 0)} %</strong> · Stoffe &lt; BG: {formatDeZahl(erg.pfas20.nKleinerBg, 0)} von 20
                      </div>
                    </div>
                  ) : <p className="text-sm text-text-main/80">Keine Berechnung möglich.</p>}
                  <EingabeHinweise hinweise={erg.hinweise} />
                </div>
                <FormulaDerivationBox
                  live
                  title={`Ihr Rechenweg: Summenbewertung PFAS-20 und PFAS-4 (BG = ${formatDeZahl(bg, 1)} ng/l)`}
                  zielGleichung="\Sigma_{20} = \sum_{i=1}^{20} c_i \le 100\,\text{ng/l}, \quad \Sigma_{4} = c_{PFOA} + c_{PFNA} + c_{PFHxS} + c_{PFOS} \le 20\,\text{ng/l}"
                  schritte={liveSchritte}
                  ergebnisHinweis="Eine Probe kann PFAS-20 einhalten und PFAS-4 trotzdem überschreiten: Der strengere Grenzwert gilt für die vier gesundheitlich am besten untersuchten Stoffe."
                  normQuelle="TrinkwV 2023, Anlage 2 Teil I (Summen PFAS-20 und PFAS-4); Ansatz unter der Bestimmungsgrenze als Lehrvariante"
                />
              </div>
            </div>
          )}
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIELE */}
      <FormulaDerivationBox
        title="Beispiel 1: Mischung von Rohwässern zur Einhaltung von PFAS-4"
        zielGleichung="c_{Misch} = \frac{Q_1 c_1 + Q_2 c_2}{Q_1 + Q_2}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Brunnen 1 mit Σ PFAS-4 = 28 ng/l (Rechnerbeispiel), Brunnen 2 mit 6 ng/l. Welcher Anteil von Brunnen 2 hält ab 2028 die 20 ng/l ein?', formel: 'c_1 = 28\\,\\text{ng/l}, \\quad c_2 = 6\\,\\text{ng/l}, \\quad c_{zul} = 20\\,\\text{ng/l}' },
          { titel: 'Mischungsrechnung', erklaerung: 'Anteil x von Brunnen 2 so wählen, dass die Mischung den Grenzwert erreicht:', formel: '(1 - x) \\cdot 28 + x \\cdot 6 = 20 \\;\\Rightarrow\\; x = \\frac{28 - 20}{28 - 6} = 0{,}36' },
        ]}
        ergebnisHinweis="Mindestens 36 % des Rohwassers müssen aus dem geringer belasteten Brunnen stammen. Mischen verdünnt nur – die Fracht bleibt; dauerhaft helfen Aktivkohle, Ionenaustausch oder Umkehrosmose."
        normQuelle="Mischungsrechnung (Massenbilanz); Grenzwert nach TrinkwV Anlage 2 Teil I"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Eluat aus Betonbruch einer Löschübungsfläche"
        zielGleichung="E = c_{Eluat} \cdot \frac{V}{m}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Schüttelversuch nach DIN 19529 mit dem Wasser-Feststoff-Verhältnis 2 l/kg. Im Eluat werden 0,5 µg/l Σ PFAS gemessen (Lehrwert).', formel: '\\frac{V}{m} = 2\\,\\text{l/kg}, \\quad c_{Eluat} = 0{,}5\\,\\mu\\text{g/l}' },
          { titel: 'Freigesetzte Menge je kg', erklaerung: 'Konzentration mal Wasser-Feststoff-Verhältnis:', formel: 'E = 0{,}5 \\cdot 2 = 1{,}0\\,\\mu\\text{g/kg}' },
          { titel: 'Hochrechnung', erklaerung: 'Für 400 t Betonbruch:', formel: '1{,}0\\,\\tfrac{\\mu\\text{g}}{\\text{kg}} \\cdot 400\\,000\\,\\text{kg} = 0{,}4\\,\\text{g}' },
        ]}
        ergebnisHinweis="Die freigesetzte Masse wirkt klein – bezogen auf einen Grenzwert von 20 ng/l könnten 0,4 g aber rechnerisch 20 Mio. Liter Wasser auf den Grenzwert belasten. Belasteter Bauschutt gehört deshalb nicht in offene Bauweisen."
        normQuelle="Elution nach DIN 19529 (W/F = 2 l/kg); Eluatwert als Lehrwert"
      />

      <ModulTest moduleId="pfas_baustoffe" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (neu erstellt, AP 6.2 (d); fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Per- und polyfluorierte Alkylverbindungen', url: 'https://de.wikipedia.org/wiki/Per-_und_polyfluorierte_Alkylverbindungen' },
        ]}
        weblinks={[
          { title: 'Trinkwasserverordnung (TrinkwV) – Gesetze im Internet', url: 'https://www.gesetze-im-internet.de/trinkwv_2023/' },
          { title: 'ECHA: Per- and polyfluoroalkyl substances (PFAS)', url: 'https://echa.europa.eu/hot-topics/perfluoroalkyl-chemicals-pfas' },
          { title: 'BMUV: Leitfaden zur PFAS-Bewertung (2022)', url: 'https://www.bundesumweltministerium.de/fileadmin/Daten_BMU/Download_PDF/Bodenschutz/pfas_leitfaden_bf.pdf' },
        ]}
        literatur={[
          'OECD: Reconciling Terminology of the Universe of Per- and Polyfluoroalkyl Substances: Recommendations and Practical Guidance. Series on Risk Management No. 61. Paris: OECD Publishing 2021',
          'EFSA CONTAM Panel: Risk to human health related to the presence of perfluoroalkyl substances in food. EFSA Journal 18 (2020) 9, 6223',
          'Umweltbundesamt (Hrsg.): PFAS – Gekommen, um zu bleiben. Schwerpunkt-Magazin. Dessau-Roßlau: UBA 2020',
        ]}
        regelwerke={[
          { title: 'TrinkwV – Trinkwasserverordnung vom 20.06.2023, Anlage 2 Teil I (Summe PFAS-20, Summe PFAS-4)' },
          { title: 'Richtlinie (EU) 2020/2184 über die Qualität von Wasser für den menschlichen Gebrauch' },
          { title: 'Verordnung (EU) 2019/1021 über persistente organische Schadstoffe (POP-Verordnung)' },
          { title: 'Verordnung (EG) Nr. 1907/2006 (REACH), Anhang XVII; Beschränkungen (EU) 2021/1297, (EU) 2024/2462, (EU) 2025/1988' },
          { title: 'DIN 38407-42:2011-03 (Bestimmung ausgewählter polyfluorierter Verbindungen in Wasser mit HPLC-MS/MS)' },
          { title: 'DIN 38414-14:2011-08 (Bestimmung ausgewählter polyfluorierter Verbindungen in Schlamm, Kompost und Boden)' },
          { title: 'ISO 21675:2019 (Water quality – Determination of perfluoroalkyl and polyfluoroalkyl substances in water – LC-MS/MS)' },
          { title: 'DIN EN ISO 18127:2026-07 (adsorbierbares organisch gebundenes Fluor, Chlor, Brom und Iod mit Verbrennungs-Ionenchromatographie; ersetzt DIN 38409-59:2022-10)' },
          { title: 'DIN 19529:2015-12 (Elution von Feststoffen – Schüttelverfahren mit W/F = 2 l/kg)' },
        ]}
        formeln={[
          { formel: '\\Sigma_{20} = \\sum_{i=1}^{20} c_i \\le 0{,}1\\,\\mu\\text{g/l}', erklaerung: 'Summe der 20 Perfluoralkylcarbon- und -sulfonsäuren C4–C13 nach TrinkwV Anlage 2 Teil I.', quelle: 'TrinkwV 2023' },
          { formel: '\\Sigma_{4} = c_{PFOA} + c_{PFNA} + c_{PFHxS} + c_{PFOS} \\le 0{,}02\\,\\mu\\text{g/l}', erklaerung: 'Summe der vier PFAS der EFSA-Bewertung, Grenzwert ab 12.01.2028.', quelle: 'TrinkwV 2023' },
          { formel: 'E = c_{Eluat} \\cdot \\frac{V}{m}', erklaerung: 'Freigesetzte Stoffmenge je kg Feststoff aus der Eluatkonzentration und dem Wasser-Feststoff-Verhältnis.', quelle: 'DIN 19529' },
        ]}
      />
    </div>
  );
}
