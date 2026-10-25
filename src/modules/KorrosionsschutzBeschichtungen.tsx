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

type Reiter = 'einfuehrung' | 'grundlagen' | 'verzinkung' | 'kennwerte' | 'rechner' | 'beispiele';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Einführung', icon: BookOpen },
  { id: 'grundlagen', label: 'Beschichtungssysteme', icon: Layers },
  { id: 'verzinkung', label: 'Verzinken & Duplex', icon: Flame },
  { id: 'kennwerte', label: 'Kennwerte & Tabellen', icon: Table2 },
  { id: 'rechner', label: 'Rechner Schutzdauer', icon: Calculator },
  { id: 'beispiele', label: 'Beispiele', icon: ClipboardCheck },
];

const TEILE = [
  { teil: '1', titel: 'Allgemeine Einleitung', inhalt: 'Geltungsbereich, Begriffe, Schutzdauerklassen L bis VH' },
  { teil: '2', titel: 'Einteilung der Umgebungsbedingungen', inhalt: 'Korrosivitätskategorien C1 bis CX (Atmosphäre), Im1 bis Im4 (Wasser, Erdreich)' },
  { teil: '3', titel: 'Grundregeln zur Gestaltung', inhalt: 'Korrosionsschutzgerechtes Konstruieren: Zugänglichkeit, Spalte, Kanten, Wassersäcke, Kontaktkorrosion' },
  { teil: '4', titel: 'Arten von Oberflächen und Oberflächenvorbereitung', inhalt: 'Rostgrade, Vorbereitungsverfahren, Bezug auf DIN EN ISO 8501 bis 8503' },
  { teil: '5', titel: 'Beschichtungssysteme', inhalt: 'Bindemitteltypen, Systemtabellen je Kategorie und Schutzdauer, Sollschichtdicken (NDFT)' },
  { teil: '6', titel: 'Laborprüfungen zur Bewertung von Beschichtungssystemen', inhalt: 'Künstliche Alterung (u. a. Salzsprühnebel, Kondenswasser) als Eignungsnachweis' },
  { teil: '7', titel: 'Ausführung und Überwachung der Beschichtungsarbeiten', inhalt: 'Verarbeitungsbedingungen, Schichtdickenmessung, Kontrollflächen' },
  { teil: '8', titel: 'Erarbeitung von Spezifikationen für Erstschutz und Instandsetzung', inhalt: 'Leistungsbeschreibung, Projektablauf, Dokumentation' },
  { teil: '9', titel: 'Beschichtungssysteme und Laborprüfverfahren für Offshore- und vergleichbare Bauwerke', inhalt: 'Systeme für CX und Im4, erweiterte Prüfungen' },
];

const BINDEMITTEL = [
  { kurz: 'EP', name: 'Epoxidharz (2K)', rolle: 'Grund- und Zwischenbeschichtung', text: 'Sehr gute Haftung, Chemikalien- und Wasserbeständigkeit; kreidet unter UV-Strahlung, daher selten als Deckbeschichtung im Freien.' },
  { kurz: 'PUR', name: 'Polyurethan (2K, aliphatisch)', rolle: 'Deckbeschichtung', text: 'Witterungs-, UV- und farbtonstabil; schützt die darunterliegenden EP-Schichten vor Abbau.' },
  { kurz: 'AY', name: 'Acrylharz', rolle: 'Grund- bis Deckbeschichtung', text: 'Physikalisch trocknend, häufig wasserverdünnbar; für geringere Belastungen und kurze Systeme.' },
  { kurz: 'ESI', name: 'Ethylsilikat mit Zinkstaub', rolle: 'Grundbeschichtung', text: 'Anorganisch, zinkstaubreich; kathodische Schutzwirkung, hohe Abrieb- und Temperaturbeständigkeit; härtet mit Luftfeuchte aus.' },
  { kurz: 'Zn (R)', name: 'Zinkstaubreiche Grundbeschichtung', rolle: 'Grundbeschichtung', text: 'Kennzeichnung in DIN EN ISO 12944-5 für Grundbeschichtungen mit hohem Zinkstaubanteil (z. B. EP- oder ESI-Bindemittel); das Zink wirkt an Fehlstellen als Opferanode.' },
];

const IM = [
  { k: 'Im1', umgebung: 'Süßwasser', beispiel: 'Flussbauten, Wasserkraftwerke' },
  { k: 'Im2', umgebung: 'Meer- oder Brackwasser ohne kathodischen Schutz', beispiel: 'Eingetauchte Bauwerke ohne KKS, z. B. Hafenbereiche mit Schleusentoren, Molen' },
  { k: 'Im3', umgebung: 'Erdreich', beispiel: 'Behälter im Erdreich, Stahlspundwände, Stahlrohre' },
  { k: 'Im4', umgebung: 'Meer- oder Brackwasser mit kathodischem Schutz', beispiel: 'Eingetauchte Bauwerke mit KKS, z. B. Offshore-Bauwerke' },
];

const ROSTGRADE = [
  { g: 'A', text: 'Stahloberfläche weitgehend mit festhaftendem Zunder bedeckt, kaum Rost' },
  { g: 'B', text: 'Beginnender Rost, der Zunder blättert ab' },
  { g: 'C', text: 'Zunder weggerostet oder abschabbar, wenige Rostnarben sichtbar' },
  { g: 'D', text: 'Zunder weggerostet, verbreitet Rostnarben (Lochfraß) sichtbar' },
];

const VORBEREITUNG = [
  { g: 'Sa 1', text: 'Leichtes Strahlen: lose Walzhaut, loser Rost und lose Beschichtungen entfernt.' },
  { g: 'Sa 2', text: 'Gründliches Strahlen: nahezu alle Walzhaut, Rost und Beschichtungen entfernt; Reste festhaftend.' },
  { g: 'Sa 2½', text: 'Sehr gründliches Strahlen: frei von sichtbarem Öl, Fett, Schmutz, Walzhaut, Rost und Beschichtungen; Reste nur als leichte punkt- oder streifenförmige Schattierungen.' },
  { g: 'Sa 3', text: 'Strahlen bis zum optisch reinen Stahl: einheitliche metallische Farbe.' },
  { g: 'St 2 / St 3', text: 'Hand- bzw. maschinelle Entrostung (Bürsten, Schleifen); St 3 gründlicher mit metallischem Glanz.' },
];

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
  const jahre = (x: number | null) => (x === null ? 'nach oben offen' : `${formatDeZahl(x, 1)} Jahre`);
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
          <ShieldCheck className="w-5 h-5 text-shiraz" aria-hidden="true" />
          Korrosionsschutz durch Beschichtungen
        </h2>
        <p className="text-xs text-text-main/50 font-mono mt-1">
          DIN EN ISO 12944 Teile 1 bis 9 • DIN EN ISO 8501-1 • DIN EN ISO 1461 • DIN EN ISO 2409 • DIN EN ISO 4624
        </p>
        <p className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          Unlegierter Baustahl rostet an der Atmosphäre, sobald Feuchte und Sauerstoff einwirken. Beschichtungen und Zinküberzüge trennen den Stahl von diesem
          Elektrolyten oder schützen ihn kathodisch. Das Modul führt von der Einstufung der Umgebung über Oberflächenvorbereitung und Schichtaufbau bis zur
          Abschätzung der Schutzdauer einer Feuerverzinkung und eines Duplex-Systems.
        </p>
      </div>

      <ModuleTabs label="Bereiche des Moduls Korrosionsschutz" tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
        <div className="mt-6 flex flex-col gap-6">

          {reiter === 'einfuehrung' && (
            <>
              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main">Wirkprinzipien des Korrosionsschutzes</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Barrierewirkung (passiv):</strong> Die Beschichtung behindert den Zutritt von Wasser, Sauerstoff und Ionen (Chlorid, Sulfat). Plättchenförmige Pigmente wie Eisenglimmer verlängern den Diffusionsweg.</li>
                  <li><strong>Kathodische Schutzwirkung (aktiv):</strong> Zink ist unedler als Eisen und löst sich an Fehlstellen bevorzugt auf (Opferanode). So wirken Zinküberzüge und zinkstaubreiche Grundbeschichtungen.</li>
                  <li><strong>Inhibierung:</strong> Korrosionsschutzpigmente verlangsamen die Teilreaktionen an der Stahloberfläche.</li>
                </ul>
                <p>
                  Die Normenreihe DIN EN ISO 12944 gilt für Stahlbauten aus unlegiertem oder niedriglegiertem Stahl mit mindestens 3 mm Dicke, die nach einem
                  Festigkeitsnachweis bemessen werden. Sie regelt den Weg von der Umgebung über Gestaltung und Oberflächenvorbereitung bis zum Beschichtungssystem und zu
                  dessen Ausführung und Prüfung.
                </p>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30">
                <h3 className="font-bold text-base text-text-main mb-3">Die neun Teile der DIN EN ISO 12944</h3>
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
                <h3 className="font-bold text-base text-text-main">Schutzdauerklassen nach DIN EN ISO 12944-1</h3>
                <p className="text-sm text-text-main/80 leading-relaxed">
                  Die Schutzdauer ist die erwartete Zeit bis zur ersten Teilerneuerung des Beschichtungssystems. Sie ist ein Planungswert und ausdrücklich keine Gewährleistungsfrist.
                </p>
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

              <Querverweis ziel="metallkorrosion" titel="Elektrochemische Grundlagen" linkText="Zum Modul Metallkorrosion">
                Anode, Kathode, Spannungsreihe und die Korrosionsarten (Flächen-, Loch-, Spalt- und Kontaktkorrosion) sind im Modul Metallkorrosion erklärt. Dieses Modul baut darauf auf.
              </Querverweis>
            </>
          )}

          {reiter === 'grundlagen' && (
            <>
              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main">1. Oberflächenvorbereitung nach DIN EN ISO 8501-1</h3>
                <p>
                  Die Haftung und damit die Schutzdauer eines Beschichtungssystems hängen entscheidend vom Untergrund ab. DIN EN ISO 8501-1 beschreibt mit fotografischen
                  Vergleichsmustern den Ausgangszustand (Rostgrade A bis D) und den erreichten Vorbereitungsgrad.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">Rostgrade (Ausgangszustand)</h4>
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
                <p className="text-xs">
                  <strong>Sa 2½</strong> ist der übliche Vorbereitungsgrad für hochwertige Systeme auf Stahl. Zusätzlich sind die Rauheit (Rauheitsvergleichsmuster nach
                  DIN EN ISO 8503) sowie Staub und lösliche Salze (DIN EN ISO 8502) zu beachten. Beschichtet wird nur bei ausreichendem Abstand der Stahltemperatur zum
                  Taupunkt; in der Praxis gilt meist mindestens 3 K über dem Taupunkt, maßgebend sind DIN EN ISO 12944-7 und das Datenblatt des Herstellers.
                </p>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main">2. Aufbau eines Beschichtungssystems</h3>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-home-grau/25 bg-off-white"><strong className="block text-shiraz mb-1">Grundbeschichtung</strong>Haftung auf dem Stahl, aktiver Schutz durch Zinkstaub oder Korrosionsschutzpigmente.</div>
                  <div className="p-3 rounded-xl border border-home-grau/25 bg-off-white"><strong className="block text-shiraz mb-1">Zwischenbeschichtung</strong>Schichtdicke und Barrierewirkung, oft mit Eisenglimmer; Haftbrücke zur Deckschicht.</div>
                  <div className="p-3 rounded-xl border border-home-grau/25 bg-off-white"><strong className="block text-shiraz mb-1">Deckbeschichtung</strong>Witterungs- und UV-Schutz, Farbton, mechanische und chemische Beständigkeit.</div>
                </div>
                <h4 className="font-bold text-text-main pt-2">Bindemittel nach DIN EN ISO 12944-5</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead><tr className="bg-off-white border-b border-home-grau/30"><th className="p-2 font-bold">Kürzel</th><th className="p-2 font-bold">Bindemittel</th><th className="p-2 font-bold">Typische Rolle</th><th className="p-2 font-bold">Eigenschaften</th></tr></thead>
                    <tbody className="divide-y divide-home-grau/20">
                      {BINDEMITTEL.map(b => (
                        <tr key={b.kurz}><td className="p-2 font-bold text-shiraz whitespace-nowrap">{b.kurz}</td><td className="p-2 font-semibold">{b.name}</td><td className="p-2">{b.rolle}</td><td className="p-2 text-slate-600">{b.text}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-600">
                  DIN EN ISO 12944-5 nennt außerdem Polyaspartat (PAS) und Polysiloxan (PS). Welche Kombination für eine Kategorie und Schutzdauer geeignet ist, entnehmen Sie den Systemtabellen der Norm
                  oder einem nach DIN EN ISO 12944-6 bzw. -9 geprüften Herstellersystem.
                </p>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main">3. Sollschichtdicke (NDFT)</h3>
                <p>
                  Die <strong>Sollschichtdicke NDFT</strong> (nominal dry film thickness) ist die festgelegte Trockenschichtdicke je Schicht und für das Gesamtsystem.
                  Die Gesamtdicke ist die Summe der Einzelschichten:
                </p>
                <div className="p-2 bg-off-white rounded-lg border border-home-grau/20 text-center overflow-x-auto">
                  <BlockMath math="\text{NDFT}_{ges} = \sum_i \text{NDFT}_i" />
                </div>
                <p className="text-xs">
                  Lehrbeispiel eines dreischichtigen Systems: EP-Zinkstaub 60 µm + EP-Eisenglimmer 120 µm + PUR-Deckbeschichtung 60 µm = 240 µm. Abnahmeregel
                  nach DIN EN ISO 12944-5 und -7, sofern nichts anderes vereinbart: Einzelwerte unter NDFT sind zulässig, wenn sie mindestens 80 % der NDFT betragen und
                  höchstens 20 % aller Messwerte unter NDFT liegen. Eine Höchstschichtdicke ist zu vereinbaren, da zu dicke Schichten zu Rissen und Enthaftung neigen.
                </p>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main">4. Prüfung und Abnahme</h3>
                <div className="grid md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-home-grau/25 bg-off-white space-y-1">
                    <strong className="block text-shiraz">Schichtdickenmessung</strong>
                    <p>Zerstörungsfrei magnetinduktiv bzw. mit Wirbelstrom nach DIN EN ISO 2808; auf gestrahlten (rauen) Flächen mit Korrekturwert nach ISO 19840. Für Zinküberzüge gelten die Messregeln der DIN EN ISO 1461.</p>
                  </div>
                  <div className="p-3 rounded-xl border border-home-grau/25 bg-off-white space-y-1">
                    <strong className="block text-shiraz">Gitterschnitt (DIN EN ISO 2409)</strong>
                    <p>Gitter aus sechs Schnitten je Richtung bis auf den Untergrund, Abreißen mit Klebeband, Einstufung von 0 (kein Abplatzen) bis 5. Schnittabstand auf harten Untergründen: 1 mm bis 60 µm, 2 mm von 61 bis 120 µm, 3 mm von 121 bis 250 µm; für dickere Systeme ungeeignet.</p>
                  </div>
                  <div className="p-3 rounded-xl border border-home-grau/25 bg-off-white space-y-1">
                    <strong className="block text-shiraz">Haftabzug (DIN EN ISO 4624)</strong>
                    <p>Prüfstempel aufkleben, senkrecht abziehen, Abreißfestigkeit aus Kraft und Stempelfläche. Anzugeben ist zusätzlich das Bruchbild: Adhäsionsbruch zwischen Schichten, Kohäsionsbruch in einer Schicht oder Bruch im Klebstoff.</p>
                  </div>
                </div>
                <div className="p-2 bg-off-white rounded-lg border border-home-grau/20 text-center overflow-x-auto">
                  <BlockMath math="\sigma = \frac{F}{A} = \frac{4\,F}{\pi\,d^2} \qquad \text{z. B. } \frac{4 \cdot 1\,900\,\text{N}}{\pi \cdot (20\,\text{mm})^2} = 6{,}0\,\text{MPa}" />
                </div>
              </section>
            </>
          )}

          {reiter === 'verzinkung' && (
            <>
              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main">Feuerverzinken nach DIN EN ISO 1461 (Stückverzinken)</h3>
                <p>
                  Das gereinigte und gebeizte Bauteil wird in schmelzflüssiges Zink getaucht (etwa 450 °C). Es entstehen Eisen-Zink-Legierungsschichten mit einer
                  äußeren Reinzinkschicht, die metallurgisch mit dem Stahl verbunden sind. Die Schichtdicke steigt mit der Stahldicke und hängt von der Stahlzusammensetzung
                  ab (vor allem Silicium und Phosphor).
                </p>
                <p>
                  Zink schützt doppelt: als Barriere, die selbst langsam abgetragen wird, und kathodisch an Kratzern und Schnittkanten. Auf frisch verzinkten Flächen kann
                  sich bei Kondensation Weißrost bilden; die schützende Deckschicht aus Zinkcarbonat entsteht erst bei Wechsel von Befeuchtung und Trocknung.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <caption className="text-left text-xs font-bold text-slate-600 mb-1">Mindestwerte der Zinküberzugsdicke (Teile nicht geschleudert)</caption>
                    <thead><tr className="bg-off-white border-b border-home-grau/30"><th className="p-2 font-bold">Stahldicke</th><th className="p-2 font-bold">örtlich [µm]</th><th className="p-2 font-bold">Durchschnitt [µm]</th></tr></thead>
                    <tbody className="divide-y divide-home-grau/20">
                      {ZINK_1461.map(z => <tr key={z.bereich}><td className="p-2 font-semibold">{z.bereich}</td><td className="p-2">{formatDeZahl(z.oertlich, 0)}</td><td className="p-2 font-bold">{formatDeZahl(z.mittel, 0)}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main">Duplex-System: Feuerverzinkung plus Beschichtung</h3>
                <p>
                  Beim Duplex-System wird die Feuerverzinkung zusätzlich beschichtet. Die Beschichtung bremst den Zinkabtrag, das Zink verhindert an Fehlstellen
                  der Beschichtung die Unterrostung. Die Schutzdauer ist deshalb größer als die Summe der Einzelschutzdauern:
                </p>
                <div className="p-2 bg-off-white rounded-lg border border-home-grau/20 text-center overflow-x-auto">
                  <BlockMath math="t_{D} = f \cdot (t_{Zn} + t_{B}), \qquad f \approx 1{,}2 \text{ bis } 2{,}5" />
                </div>
                <p className="text-xs">
                  Der Synergiefaktor f ist ein Erfahrungswert aus der Literatur und keine Normgröße: Das Institut Feuerverzinken nennt 1,2 bis 2, Fachveröffentlichungen
                  bis 2,5. Voraussetzung ist eine fachgerechte Vorbereitung der Zinkoberfläche (z. B. Sweep-Strahlen nach DIN EN ISO 12944-4) und ein für verzinkten Stahl
                  geeignetes System nach DIN EN ISO 12944-5.
                </p>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main flex items-center gap-2"><AlertTriangle size={16} className="text-amber-600" aria-hidden="true" /> Kontaktkorrosion</h3>
                <p>
                  Berühren sich zwei Metalle mit unterschiedlichem Potential in Gegenwart eines Elektrolyten, korrodiert das unedlere Metall verstärkt. Maßgebend ist neben der
                  Potentialdifferenz das <strong>Flächenverhältnis</strong>: Eine kleine Anode an einer großen Kathode wird rasch abgetragen.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Ungünstig:</strong> Verzinkte Schrauben in einem Blech aus nichtrostendem Stahl – die kleine Zinkfläche der Schraube schützt die große edle Fläche und wird schnell verbraucht.</li>
                  <li><strong>Meist unkritisch an der Atmosphäre:</strong> Schrauben aus nichtrostendem Stahl in verzinktem Blech – die große Anode verteilt den Abtrag.</li>
                  <li><strong>Gegenmaßnahmen:</strong> Trennung durch isolierende Scheiben und Hülsen, Elektrolyt fernhalten (konstruktiv nach DIN EN ISO 12944-3), bei Beschichtung vor allem das edlere Metall beschichten, damit Fehlstellen keine kleinen Anoden bilden.</li>
                </ul>
              </section>

              <Querverweis ziel="stahl" titel="Werkstoff Stahl" linkText="Zum Modul Stahl">
                Stahlsorten, Gefüge und Festigkeiten der Baustähle sowie die Bezeichnung nach DIN EN 10025 finden Sie im Modul Stahl.
              </Querverweis>
            </>
          )}

          {reiter === 'kennwerte' && (
            <>
              <section className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-3">
                <h3 className="font-bold text-base text-text-main">Korrosivitätskategorien der Atmosphäre (DIN EN ISO 12944-2)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dickenabnahme im ersten Jahr der Auslagerung für unlegierten Stahl und Zink; die Werte stimmen mit DIN EN ISO 9223 überein. Die Beispiele dienen der Orientierung,
                  im Zweifel ist die Kategorie durch Messung (Probeblech) oder aus Umweltdaten nach DIN EN ISO 9223 zu bestimmen.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse min-w-[640px]">
                    <thead><tr className="bg-off-white border-b border-home-grau/30">
                      <th className="p-2 font-bold">Kat.</th><th className="p-2 font-bold">Korrosivität</th><th className="p-2 font-bold">Beispiel außen</th><th className="p-2 font-bold">Beispiel innen</th>
                      <th className="p-2 font-bold whitespace-nowrap">Stahl [µm/a]</th><th className="p-2 font-bold whitespace-nowrap">Zink [µm/a]</th>
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
                <h3 className="font-bold text-base text-text-main">Kategorien für Wasser und Erdreich</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead><tr className="bg-off-white border-b border-home-grau/30"><th className="p-2 font-bold">Kat.</th><th className="p-2 font-bold">Umgebung</th><th className="p-2 font-bold">Beispiele</th></tr></thead>
                    <tbody className="divide-y divide-home-grau/20">
                      {IM.map(i => <tr key={i.k}><td className="p-2 font-black text-shiraz">{i.k}</td><td className="p-2 font-semibold">{i.umgebung}</td><td className="p-2 text-slate-600">{i.beispiel}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-600">Für Im-Kategorien gibt die Norm keine Abtragsraten an; die Systemwahl stützt sich auf Laborprüfungen nach DIN EN ISO 12944-6 bzw. -9.</p>
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
                      <button type="button" onClick={() => setDZn(erg.mindest1461!.mittel)} className="text-[11px] text-shiraz font-semibold underline cursor-pointer">
                        Mindest-Durchschnittswert nach DIN EN ISO 1461 übernehmen ({formatDeZahl(erg.mindest1461.mittel, 0)} µm)
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700"><label htmlFor="ks-dzn">Zinkschichtdicke d_Zn</label><span className="font-mono">{formatDeZahl(dZn, 0)} µm</span></div>
                    <input id="ks-dzn" type="range" min="20" max="300" step="5" value={dZn} onChange={e => setDZn(Number(e.target.value))} className="w-full accent-shiraz" />
                  </div>

                  <label className="block text-xs font-bold text-slate-700">
                    Gewünschte Schutzdauerklasse
                    <select value={ziel} onChange={e => setZiel(e.target.value as Schutzdauerklasse)} className="mt-1 w-full p-2 border border-slate-200 rounded-lg bg-white text-sm">
                      {KLASSEN.map(k => <option key={k} value={k}>{k} – {SCHUTZDAUER[k].name} ({SCHUTZDAUER[k].text})</option>)}
                    </select>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={duplex} onChange={e => setDuplex(e.target.checked)} className="accent-shiraz" />
                    Duplex-System (zusätzliche Beschichtung)
                  </label>
                  {duplex && (
                    <div className="space-y-3 pl-5 border-l-2 border-shiraz/20">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700"><label htmlFor="ks-tb">Schutzdauer der Beschichtung allein t_B</label><span className="font-mono">{formatDeZahl(tB, 0)} Jahre</span></div>
                        <input id="ks-tb" type="range" min="0" max="40" step="1" value={tB} onChange={e => setTB(Number(e.target.value))} className="w-full accent-shiraz" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700"><label htmlFor="ks-f">Synergiefaktor f (Literaturwert)</label><span className="font-mono">{formatDeZahl(f, 1)}</span></div>
                        <input id="ks-f" type="range" min="1" max="3" step="0.1" value={f} onChange={e => setF(Number(e.target.value))} className="w-full accent-shiraz" />
                        <p className="text-[10px] text-slate-500">Literaturspanne {formatDeZahl(SYNERGIE_SPANNE[0], 1)} bis {formatDeZahl(SYNERGIE_SPANNE[1], 1)}; kein Normwert, Lehrannahme.</p>
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
                          <div className="text-[10px] uppercase font-bold text-slate-500">{duplex ? 'Duplex ungünstig' : 'Zink ungünstig'}</div>
                          <div className="text-lg font-black font-mono text-slate-900">{jahre(erg.tDuplexMin)}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] uppercase font-bold text-slate-500">{duplex ? 'Duplex günstig' : 'Zink günstig'}</div>
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
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">Schutzdauer je Kategorie bei {formatDeZahl(dZn, 0)} µm{duplex ? ' (Duplex)' : ''}</h4>
                    <div className="space-y-1.5" aria-label="Balkendiagramm der Schutzdauer je Korrosivitätskategorie">
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
                      <p className="text-[10px] text-slate-500">Skala 0 bis {formatDeZahl(SKALA, 0)} Jahre; Klassengrenzen bei 7, 15 und 25 Jahren.</p>
                    </div>
                  </div>
                </div>
              </section>

              {erg.gueltig && (
                <FormulaDerivationBox
                  live
                  title="Ihr Rechenweg: Schutzdauer der Zinkschicht"
                  zielGleichung="t_{Zn} = \frac{d_{Zn}}{r_{corr,Zn}}"
                  schritte={[
                    {
                      titel: 'Abtragsrate der Kategorie',
                      erklaerung: `Zinkabtrag im ersten Jahr für ${kategorie} nach DIN EN ISO 9223 bzw. DIN EN ISO 12944-2:`,
                      formel: `r_{corr,Zn} = ${tex(erg.rMin, 1)} \\text{ bis } ${tex(erg.rMax, 1)}\\,\\mu\\text{m/a}`,
                    },
                    {
                      titel: 'Ungünstige Schutzdauer',
                      erklaerung: `Zinkschicht ${formatDeZahl(dZn, 0)} µm geteilt durch die obere Abtragsrate:`,
                      formel: `t_{Zn,min} = \\frac{${tex(dZn, 0)}}{${tex(erg.rMax, 1)}} = ${tex(erg.tMin, 1)}\\,\\text{a}`,
                    },
                    {
                      titel: 'Günstige Schutzdauer',
                      erklaerung: erg.tMax === null ? 'In C1 ist die untere Abtragsrate praktisch null; die Schutzdauer ist nach oben offen.' : 'Mit der unteren Abtragsrate:',
                      formel: erg.tMax === null ? `t_{Zn,max} \\to \\infty` : `t_{Zn,max} = \\frac{${tex(dZn, 0)}}{${tex(erg.rMin, 1)}} = ${tex(erg.tMax, 1)}\\,\\text{a}`,
                    },
                    ...(duplex ? [{
                      titel: 'Duplex-System',
                      erklaerung: `Beschichtung ${formatDeZahl(tB, 0)} Jahre, Synergiefaktor f = ${formatDeZahl(f, 1)} (Literaturwert):`,
                      formel: `t_{D,min} = ${tex(f, 1)} \\cdot (${tex(erg.tMin, 1)} + ${tex(tB, 0)}) = ${tex(erg.tDuplexMin, 1)}\\,\\text{a}`,
                    }] : []),
                    {
                      titel: 'Vergleich mit der Schutzdauerklasse',
                      erklaerung: `Gefordert ist ${ziel} (${SCHUTZDAUER[ziel].text}); maßgebend ist der ungünstige Wert:`,
                      formel: `t_{min} = ${tex(erg.tMassgebend, 1)}\\,\\text{a} \\;\\Rightarrow\\; \\text{Klasse } ${erg.klasseUnguenstig} \\;(${erg.bewertung === 'erfuellt' ? '\\text{erfüllt}' : '\\text{nicht sicher erfüllt}'})`,
                    },
                  ]}
                  ergebnisHinweis="Lineares Lehrmodell mit Erstjahresraten; Zink korrodiert in den Folgejahren meist etwas langsamer (DIN EN ISO 9224)."
                  normQuelle="DIN EN ISO 9223:2012-05; DIN EN ISO 12944-1:2019-01; DIN EN ISO 1461:2022-12"
                />
              )}
            </>
          )}

          {reiter === 'beispiele' && (
            <>
              <FormulaDerivationBox
                title="Beispiel 1: Feuerverzinkte Hallenstütze in Stadtatmosphäre (C3)"
                zielGleichung="t_{Zn} = \frac{d_{Zn}}{r_{corr,Zn}}"
                schritte={[
                  { titel: 'Schichtdicke', erklaerung: 'Walzprofil mit 10 mm Stegdicke, also Stahl > 6 mm: Mindest-Durchschnittswert nach DIN EN ISO 1461:', formel: 'd_{Zn} = 85\\,\\mu\\text{m}' },
                  { titel: 'Abtragsrate', erklaerung: 'Kategorie C3: Zinkabtrag 0,7 bis 2,1 µm/a.', formel: 'r_{corr,Zn} = 0{,}7 \\text{ bis } 2{,}1\\,\\mu\\text{m/a}' },
                  { titel: 'Schutzdauer', erklaerung: 'Ungünstig mit der oberen, günstig mit der unteren Rate:', formel: 't_{Zn} = \\frac{85}{2{,}1} = 40{,}5\\,\\text{a} \\quad \\text{bis} \\quad \\frac{85}{0{,}7} = 121{,}4\\,\\text{a}' },
                  { titel: 'Einstufung', erklaerung: 'Schon der ungünstige Wert liegt über 25 Jahren:', formel: 't_{Zn,min} = 40{,}5\\,\\text{a} > 25\\,\\text{a} \\;\\Rightarrow\\; \\text{VH}' },
                ]}
                ergebnisHinweis="In C3 erreicht eine normgerechte Feuerverzinkung ohne Beschichtung die Schutzdauerklasse VH."
                normQuelle="DIN EN ISO 1461:2022-12; DIN EN ISO 9223:2012-05; DIN EN ISO 12944-1:2019-01"
              />
              <FormulaDerivationBox
                title="Beispiel 2: Geländer an der Küste (C5) – reicht Zink oder braucht es Duplex?"
                zielGleichung="t_{D} = f \cdot (t_{Zn} + t_{B})"
                schritte={[
                  { titel: 'Zink allein', erklaerung: '85 µm in C5 (Zinkabtrag 4,2 bis 8,4 µm/a):', formel: 't_{Zn} = \\frac{85}{8{,}4} = 10{,}1\\,\\text{a} \\quad \\text{bis} \\quad \\frac{85}{4{,}2} = 20{,}2\\,\\text{a}' },
                  { titel: 'Bewertung', erklaerung: 'Gefordert ist VH (mehr als 25 Jahre). Ungünstig ergibt sich nur Klasse M:', formel: '10{,}1\\,\\text{a} \\le 15\\,\\text{a} \\;\\Rightarrow\\; \\text{M} < \\text{VH}' },
                  { titel: 'Duplex-System', erklaerung: 'Zusätzliche Beschichtung mit 10 Jahren Eigenschutzdauer (Lehrwert), Synergiefaktor 1,5 (Literaturwert):', formel: 't_{D,min} = 1{,}5 \\cdot (10{,}1 + 10) = 30{,}2\\,\\text{a} > 25\\,\\text{a} \\;\\Rightarrow\\; \\text{VH}' },
                ]}
                ergebnisHinweis="Erst das Duplex-System erreicht VH. Mit f = 1,2 ergäbe sich 24,1 a und damit nur Klasse H – der Faktor ist objektbezogen zu begründen."
                normQuelle="DIN EN ISO 9223:2012-05; DIN EN ISO 12944-1:2019-01; Synergiefaktor nach Literatur"
              />
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed">
                <h3 className="font-bold text-base text-text-main mb-2">Merksätze</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Erst die Umgebung einstufen (C1 bis CX, Im1 bis Im4), dann die Schutzdauer festlegen, dann das System wählen.</li>
                  <li>Ohne Oberflächenvorbereitung, in der Regel Sa 2½, versagt auch ein dickes System vorzeitig.</li>
                  <li>Die Schutzdauer einer Zinkschicht wächst linear mit der Schichtdicke und sinkt mit der Abtragsrate der Kategorie.</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </ModuleTabs>

      <ModulTest moduleId="korrosionsschutz_beschichtungen" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (Modul neu erstellt; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Korrosionsschutz', url: 'https://de.wikipedia.org/wiki/Korrosionsschutz' },
          { title: 'Feuerverzinken', url: 'https://de.wikipedia.org/wiki/Feuerverzinken' },
        ]}
        literatur={[
          'Institut Feuerverzinken GmbH: Arbeitsblatt F2 – DIN EN ISO 1461. Düsseldorf, Stand 08/2025',
          'Düren-Rost, P.: Duplex-Systeme – Erkenntnisse aus Praxis und Forschung. GAV-Forschungskolloquium, Hannover, 17.10.2023',
          'Kaesche, H.: Die Korrosion der Metalle. 3. Aufl., Berlin: Springer 1990',
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 12944-1:2019-01 (Beschichtungsstoffe – Korrosionsschutz von Stahlbauten durch Beschichtungssysteme – Teil 1: Allgemeine Einleitung)' },
          { title: 'DIN EN ISO 12944-2:2018-04 (Teil 2: Einteilung der Umgebungsbedingungen)' },
          { title: 'DIN EN ISO 12944-5:2020-03 (Teil 5: Beschichtungssysteme)' },
          { title: 'DIN EN ISO 12944 Teile 3, 4 und 6 bis 9 (Gestaltung, Oberflächenvorbereitung, Laborprüfungen, Ausführung, Spezifikation, Offshore; DIN-Ausgaben 2018)' },
          { title: 'DIN EN ISO 8501-1:2007-12 (Vorbereitung von Stahloberflächen – Visuelle Beurteilung der Oberflächenreinheit – Teil 1: Rostgrade und Oberflächenvorbereitungsgrade)' },
          { title: 'DIN EN ISO 9223:2012-05 (Korrosion von Metallen und Legierungen – Korrosivität von Atmosphären – Klassifizierung, Bestimmung und Abschätzung)' },
          { title: 'DIN EN ISO 1461:2022-12 (Durch Feuerverzinken auf Stahl aufgebrachte Zinküberzüge (Stückverzinken) – Anforderungen und Prüfungen)' },
          { title: 'DIN EN ISO 14713-1 (Zinküberzüge – Leitfäden und Empfehlungen zum Schutz von Eisen- und Stahlkonstruktionen vor Korrosion – Teil 1; ISO 14713-1:2017)' },
          { title: 'DIN EN ISO 2409:2020-12 (Beschichtungsstoffe – Gitterschnittprüfung)' },
          { title: 'DIN EN ISO 4624:2023-09 (Beschichtungsstoffe – Abreißversuch zur Bestimmung der Haftfestigkeit)' },
        ]}
        formeln={[
          { formel: 't_{Zn} = \\frac{d_{Zn}}{r_{corr,Zn}}', erklaerung: 'Schutzdauer einer Zinkschicht [a] aus Schichtdicke d_Zn [µm] und Zinkabtragsrate r_corr,Zn [µm/a] der Korrosivitätskategorie (lineares Lehrmodell).', quelle: 'DIN EN ISO 9223:2012-05; DIN EN ISO 14713-1' },
          { formel: 't_{D} = f \\cdot (t_{Zn} + t_{B})', erklaerung: 'Schutzdauer eines Duplex-Systems mit Synergiefaktor f ≈ 1,2 bis 2,5 (Literaturwert, nicht genormt) und Schutzdauer t_B der Beschichtung allein.', quelle: 'Institut Feuerverzinken (2023); Fachliteratur' },
          { formel: '\\sigma = \\frac{4\\,F}{\\pi\\,d^2}', erklaerung: 'Abreißfestigkeit [MPa] beim Haftabzugsversuch aus Abreißkraft F [N] und Stempeldurchmesser d [mm].', quelle: 'DIN EN ISO 4624:2023-09' },
        ]}
      />
    </div>
  );
}
