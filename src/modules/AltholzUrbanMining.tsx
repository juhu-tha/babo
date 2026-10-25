import React, { useMemo, useState } from 'react';
import { Recycle, Layers, ScanLine, AlertTriangle, Building2, Calculator } from 'lucide-react';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Slider } from '@/src/components/ui/Slider';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { sortierbilanz, ALTHOLZ_KATEGORIEN, KATEGORIE_NAME, ZIEL_STOFFLICH, type AltholzKategorie } from '@/src/calc/altholz';

type Reiter = 'einfuehrung' | 'kategorien' | 'nir' | 'grenzen' | 'urbanmining' | 'rechner';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'einfuehrung', label: 'Einführung', icon: Recycle },
  { id: 'kategorien', label: 'AltholzV & Kategorien', icon: Layers },
  { id: 'nir', label: 'NIR-Sortierung', icon: ScanLine },
  { id: 'grenzen', label: 'Grenzen der Sensorik', icon: AlertTriangle },
  { id: 'urbanmining', label: 'Urban Mining & Kataster', icon: Building2 },
  { id: 'rechner', label: 'Rechner Sortierbilanz', icon: Calculator },
];

const karte = 'bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm';
const box = 'bg-off-white p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/85 leading-relaxed';
const zelle = 'p-2 border border-home-grau/30';

/** Kategorien nach § 2 AltholzV mit typischen Beispielen (Anhang III, Regelzuordnung) */
const KATEGORIEN = [
  { k: 'A I', def: 'naturbelassenes oder lediglich mechanisch bearbeitetes Altholz, das bei seiner Verwendung nicht mehr als unerheblich mit holzfremden Stoffen verunreinigt wurde', bsp: 'Paletten aus Vollholz, Kabeltrommeln aus Vollholz, Verschnitt und Abschnitte aus unbehandeltem Vollholz', weg: 'stofflich (Holzwerkstoffe) oder energetisch' },
  { k: 'A II', def: 'verleimtes, gestrichenes, beschichtetes, lackiertes oder anderweitig behandeltes Altholz ohne halogenorganische Verbindungen in der Beschichtung und ohne Holzschutzmittel', bsp: 'Spanplatten- und Möbelreste ohne PVC, Dielen und Bretterschalungen aus dem Innenausbau ohne schädliche Verunreinigungen', weg: 'stofflich (Holzwerkstoffe) oder energetisch' },
  { k: 'A III', def: 'Altholz mit halogenorganischen Verbindungen in der Beschichtung ohne Holzschutzmittel', bsp: 'PVC-beschichtete Möbelteile und Platten, Sperrmüllholz (Gemisch)', weg: 'stofflich nur nach weitgehender Entfernung der Beschichtung, sonst energetisch (17. BImSchV)' },
  { k: 'A IV', def: 'mit Holzschutzmitteln behandeltes Altholz sowie sonstiges Altholz, das aufgrund seiner Schadstoffbelastung nicht A I bis A III zugeordnet werden kann, ausgenommen PCB-Altholz', bsp: 'Bahnschwellen, Leitungsmasten, Hopfenstangen, Rebpfähle; Fenster, Außentüren und imprägnierte Konstruktionshölzer aus dem Außenbereich', weg: 'energetisch in Anlagen nach 17. BImSchV oder Beseitigung; gefährlicher Abfall (AVV 17 02 04*)' },
] as const;

/** Anhang II AltholzV: Grenzwerte für Holzhackschnitzel und -späne zur Herstellung von Holzwerkstoffen [mg/kg TM] */
const ANHANG2 = [
  ['Arsen', 2], ['Blei', 30], ['Cadmium', 2], ['Chrom', 30], ['Kupfer', 20], ['Quecksilber', 0.4],
  ['Chlor', 600], ['Fluor', 100], ['Pentachlorphenol (PCP)', 3], ['Polychlorierte Biphenyle (PCB)', 5],
] as const;

const FARBE: Readonly<Record<AltholzKategorie, string>> = { AI: '#15803d', AII: '#65a30d', AIII: '#d97706', AIV: '#A3113E' };

/** Balken der beiden Ausgangslinien mit Anteilen je Kategorie */
function LinienBalken({ stroeme, linie, gesamt }: { stroeme: { kategorie: AltholzKategorie; inStofflich: number; inEnergetisch: number }[]; linie: 'st' | 'en'; gesamt: number }) {
  const summe = stroeme.reduce((s, x) => s + (linie === 'st' ? x.inStofflich : x.inEnergetisch), 0);
  return (
    <div>
      <div className="flex justify-between text-xs text-text-main/70 mb-1">
        <span>{linie === 'st' ? 'stoffliche Linie (Ziel A I/A II)' : 'energetische Linie (Ziel A III/A IV)'}</span>
        <span>{formatDeZahl(summe, 2)} t</span>
      </div>
      <div className="flex h-5 rounded-md overflow-hidden border border-home-grau/30 bg-off-white" style={{ width: `${gesamt > 0 ? Math.max(4, (summe / gesamt) * 100) : 4}%` }}
        role="img" aria-label={`${linie === 'st' ? 'Stoffliche' : 'Energetische'} Linie mit ${formatDeZahl(summe, 2)} t`}>
        {stroeme.map(x => {
          const m = linie === 'st' ? x.inStofflich : x.inEnergetisch;
          return summe > 0 && m > 0 ? <div key={x.kategorie} style={{ width: `${(m / summe) * 100}%`, background: FARBE[x.kategorie] }} title={`${KATEGORIE_NAME[x.kategorie]}: ${formatDeZahl(m, 2)} t`} /> : null;
        })}
      </div>
    </div>
  );
}

export default function AltholzUrbanMining() {
  const [tab, setTab] = useState<Reiter>('einfuehrung');

  const [masse, setMasse] = useState<Record<AltholzKategorie, number>>({ AI: 15, AII: 45, AIII: 15, AIV: 25 });
  const [ausbringen, setAusbringen] = useState<Record<AltholzKategorie, number>>({ AI: 95, AII: 90, AIII: 85, AIV: 95 });

  const erg = useMemo(() => sortierbilanz({
    masse,
    ausbringen: { AI: ausbringen.AI / 100, AII: ausbringen.AII / 100, AIII: ausbringen.AIII / 100, AIV: ausbringen.AIV / 100 },
  }), [masse, ausbringen]);

  const gueltig = Number.isFinite(erg.mSt);
  const tex = (v: number, d = 2) => formatDeTeX(v, d);
  const pct = (v: number, d = 1) => formatDeTeX(v * 100, d);
  const st = (k: AltholzKategorie) => erg.stroeme.find(x => x.kategorie === k);

  const liveSchritte = gueltig ? [
    {
      titel: 'Eingangsmasse',
      erklaerung: 'Summe der tatsächlich angelieferten Kategorien:',
      formel: `M_{in} = ${ALTHOLZ_KATEGORIEN.map(k => tex(masse[k], 1)).join(' + ')} = ${tex(erg.mIn)}\\,\\text{t}`,
    },
    {
      titel: 'Masse der stofflichen Linie',
      erklaerung: 'Richtig gelenktes A I/A II plus fehlgelenktes A III/A IV:',
      formel: `M_{st} = \\underbrace{${tex(ausbringen.AI / 100)} \\cdot ${tex(masse.AI, 1)} + ${tex(ausbringen.AII / 100)} \\cdot ${tex(masse.AII, 1)}}_{\\text{A I, A II richtig}} + \\underbrace{${tex(1 - ausbringen.AIII / 100)} \\cdot ${tex(masse.AIII, 1)} + ${tex(1 - ausbringen.AIV / 100)} \\cdot ${tex(masse.AIV, 1)}}_{\\text{A III, A IV fehlsortiert}} = ${tex(erg.mSt)}\\,\\text{t}`,
    },
    {
      titel: 'Fehlsortierquote',
      erklaerung: 'Alle Massen, die in der jeweils falschen Linie landen, bezogen auf den Eingang:',
      formel: `q_F = \\frac{\\sum_k (1 - a_k)\\, m_k}{M_{in}} = \\frac{${tex(erg.mFehl)}}{${tex(erg.mIn)}} = ${pct(erg.qFehl)}\\,\\%`,
    },
    {
      titel: 'Reinheit und A-IV-Anteil der stofflichen Linie',
      erklaerung: erg.mSt > 0 ? 'Anteil richtig sortierten Holzes und Anteil holzschutzmittelbehandelten Holzes im Strom zur Holzwerkstoffherstellung:' : 'Die stoffliche Linie ist leer.',
      formel: erg.mSt > 0
        ? `R_{st} = \\frac{${tex((st('AI')?.inStofflich ?? 0) + (st('AII')?.inStofflich ?? 0))}}{${tex(erg.mSt)}} = ${pct(erg.reinheitSt)}\\,\\%, \\quad w_{A\\,IV} = \\frac{${tex(st('AIV')?.inStofflich ?? 0)}}{${tex(erg.mSt)}} = ${pct(erg.anteilAIVSt, 2)}\\,\\%`
        : 'M_{st} = 0',
    },
    {
      titel: 'Stoffliche Verwertungsquote',
      erklaerung: 'Nur richtig sortiertes A I/A II zählt; der Höchstwert bei idealer Sortierung ist der Anteil A I + A II im Eingang:',
      formel: `q_{st} = \\frac{${tex((st('AI')?.inStofflich ?? 0) + (st('AII')?.inStofflich ?? 0))}}{${tex(erg.mIn)}} = ${pct(erg.qSt)}\\,\\% \\quad (q_{st,max} = ${pct(erg.qStMax)}\\,\\%)`,
    },
  ] : [{ titel: 'Keine Berechnung', erklaerung: 'Die Eingaben sind unzulässig – siehe Hinweise im Rechner.' }];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Recycle className="text-shiraz" aria-hidden="true" /> Altholz-NIR-Sortierung und Urban Mining
        </h2>
        <p className={box}>
          Holz aus Rückbau, Sperrmüll und Gewerbe ist ein Sekundärrohstoff – aber nur, wenn es sortenrein und schadstoffarm vorliegt. Das Modul führt von den Altholzkategorien der Altholzverordnung über das Prinzip der Nahinfrarot-Spektroskopie (NIR) zur sensorgestützten Sortierung, zeigt deren Grenzen und ordnet beides in den Gedanken des Urban Mining und der Materialkataster ein. Mit dem Rechner stellen Sie die Massenbilanz einer Sortieranlage auf.
        </p>
        <div className="p-4 rounded-xl border border-sky-200 bg-sky-50 text-sm text-sky-950 leading-relaxed" role="note">
          <strong>Projekthinweis:</strong> Die sensorgestützte Sortierung von Altholz und das Urban Mining sind Forschungsthemen an der Technischen Hochschule Augsburg bzw. im TTZ Aichach. Dieses Modul gibt ausschließlich den öffentlich zugänglichen Stand von Recht, Normung und Fachliteratur wieder; Zahlenangaben ohne Normbezug sind Richtwerte.
        </div>

        <ModuleTabs label="Bereiche des Moduls Altholz-NIR-Sortierung und Urban Mining" tabs={REITER} aktiv={tab} onWechsel={setTab}>
          {tab === 'einfuehrung' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Altholz als Stoffstrom</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>Menge:</strong> In Deutschland fallen jährlich rund 8 Mio. t Altholz an (Richtwert, Verbandsangabe). Bau- und Abbruchholz, Verpackungen (Paletten), Möbel und Sperrmüll sind die Hauptquellen.</li>
                  <li><strong>Verwertungswege:</strong> Etwa ein Fünftel wird stofflich verwertet – fast ausschließlich zu Spanplatten. Der größere Teil geht in die energetische Verwertung in Altholzkraftwerken und Feuerungsanlagen (Richtwert).</li>
                  <li><strong>Abfallhierarchie:</strong> Das Kreislaufwirtschaftsgesetz (§ 6 KrWG) stellt Vermeidung, Vorbereitung zur Wiederverwendung und Recycling vor die energetische Verwertung. Die geltende AltholzV stellt stoffliche und energetische Verwertung dagegen noch gleichrangig nebeneinander.</li>
                  <li><strong>Kaskadennutzung:</strong> Holz wird möglichst lange stofflich genutzt – Wiederverwendung von Balken, dann Holzwerkstoffe, zuletzt Energie. Jede stoffliche Runde hält den im Holz gebundenen Kohlenstoff länger im Bestand.</li>
                </ul>
              </div>
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Warum sortieren?</h3>
                <div className="flex flex-col gap-3 text-sm text-text-main/85">
                  <div className={box}><strong>Qualität:</strong> Holzwerkstoffwerke dürfen nur Hackschnitzel und Späne einsetzen, die die Grenzwerte des Anhangs II AltholzV einhalten. Bereits wenige mit Holzschutzmitteln behandelte Stücke können eine Charge unbrauchbar machen.</div>
                  <div className={box}><strong>Recht:</strong> Altholz der Kategorie A IV ist gefährlicher Abfall; vermischt mit A I bis A III gilt das gesamte Gemisch als A IV.</div>
                  <div className={box}><strong>Wirtschaft:</strong> Je reiner die stoffliche Fraktion, desto höher ihr Wert. Sensorgestützte Sortierung soll die händische Sortierung ergänzen und Fehlsortierungen verringern.</div>
                </div>
                <Querverweis ziel="abfaelle" titel="Abfallrecht im Überblick" linkText="Zum Modul Abfälle & Altlasten" className="mt-4">
                  AVV-Schlüssel, Abfallhierarchie und die Grundzüge der Altholzverordnung finden Sie im Modul Abfälle & Altlasten.
                </Querverweis>
              </div>
            </div>
          )}

          {tab === 'kategorien' && (
            <div className="flex flex-col gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-1">Altholzkategorien nach § 2 AltholzV</h3>
                <p className="text-xs text-text-main/70 mb-3">Definitionen sinngemäß nach § 2 Nr. 4 AltholzV; Beispiele nach der Regelzuordnung in Anhang III. Im Zweifel ist die höhere Kategorie maßgebend.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse min-w-[680px]">
                    <thead><tr className="bg-off-white text-left"><th className={zelle}>Kategorie</th><th className={zelle}>Definition</th><th className={zelle}>Typische Beispiele</th><th className={zelle}>Verwertung</th></tr></thead>
                    <tbody>
                      {KATEGORIEN.map(z => (
                        <tr key={z.k}><td className={`${zelle} font-bold`}>{z.k}</td><td className={zelle}>{z.def}</td><td className={zelle}>{z.bsp}</td><td className={zelle}>{z.weg}</td></tr>
                      ))}
                      <tr><td className={`${zelle} font-bold`}>PCB-Altholz</td><td className={zelle}>Altholz, das PCB im Sinne der PCB/PCT-Abfallverordnung enthält</td><td className={zelle}>z. B. mit PCB-haltigen Mitteln behandelte Dämm- und Schallschutzplatten</td><td className={zelle}>Beseitigung nach PCB/PCT-Abfallverordnung</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-1">Grenzwerte für Holzwerkstoffe (Anhang II)</h3>
                  <p className="text-xs text-text-main/70 mb-3">Holzhackschnitzel und Holzspäne zur Herstellung von Holzwerkstoffen, in mg/kg Trockenmasse. Eingehalten, wenn der gleitende Mittelwert der letzten vier Untersuchungen den Grenzwert nicht überschreitet und kein Einzelwert ihn um mehr als 25 % übersteigt.</p>
                  <table className="w-full text-xs border-collapse">
                    <thead><tr className="bg-off-white text-left"><th className={zelle}>Stoff</th><th className={zelle}>Grenzwert in mg/kg TM</th></tr></thead>
                    <tbody>{ANHANG2.map(([s, w]) => <tr key={s}><td className={zelle}>{s}</td><td className={zelle}>{formatDeZahl(w, w < 1 ? 1 : 0)}</td></tr>)}</tbody>
                  </table>
                </div>
                <div className="flex flex-col gap-6">
                  <div className={karte}>
                    <h3 className="font-bold text-text-main mb-3">Pflichten im Überblick</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                      <li><strong>Zuordnung:</strong> Der Besitzer ordnet Altholz einer Kategorie zu; bei Bau- und Abbruchholz hilft die Regelzuordnung des Anhangs III.</li>
                      <li><strong>Getrennthaltung:</strong> A IV und PCB-Altholz sind von den übrigen Kategorien getrennt zu halten. Die Gewerbeabfallverordnung verlangt zudem die getrennte Sammlung von Holz bei Bau- und Abbruchabfällen.</li>
                      <li><strong>Stoffliche Verwertung:</strong> zulässig für A I und A II; A III nur, wenn Lacke und Beschichtungen vorher oder bei der Aufbereitung weitgehend entfernt werden. A IV ist von der Holzwerkstoffherstellung ausgeschlossen.</li>
                      <li><strong>Energetische Verwertung:</strong> A III und A IV nur in Anlagen nach der 17. BImSchV.</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-950 leading-relaxed">
                    <h3 className="font-bold mb-2">Novelle der AltholzV – Stand unsicher</h3>
                    <p className="mb-2">Die AltholzV vom 15. August 2002 (zuletzt geändert 2020) wird seit Jahren überarbeitet. Ein Diskussionsentwurf des Bundesumweltministeriums von 2020 sah u. a. vor: Aufbereitung allen Altholzes vor der Verwertung, Vorrang der stofflichen Verwertung für A I mit Recyclingquoten, Zuordnung von Sperrmüll-Holzgemischen zu A III und angepasste Grenzwerte in Anhang II. 2024 kündigte das Ministerium einen Referentenentwurf für die folgende Legislaturperiode an.</p>
                    <p><strong>Ein Inkrafttreten der Novelle ist nach dem Stand der Recherche (Oktober 2026) nicht bekannt.</strong> Maßgebend ist die geltende Fassung; vor Verwendung in Lehre oder Praxis den aktuellen Stand prüfen.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'nir' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Prinzip der NIR-Spektroskopie</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>Spektralbereich:</strong> Nahes Infrarot umfasst Wellenlängen ab rund 780 nm (nach ISO 20473 bis 3 µm). Sortiersysteme arbeiten typischerweise im Bereich von etwa 900 bis 1.700 nm oder bis 2.500 nm (Richtwerte, je nach Detektor).</li>
                  <li><strong>Wechselwirkung:</strong> Im NIR liegen Ober- und Kombinationsschwingungen von C–H-, O–H- und N–H-Bindungen. Die Probe absorbiert je nach chemischem Aufbau bei charakteristischen Wellenlängen – das reflektierte Spektrum ist ein „Fingerabdruck“ der Oberfläche.</li>
                  <li><strong>Holz:</strong> Cellulose, Hemicellulosen und Lignin prägen das Spektrum von Vollholz; Wasser absorbiert stark (Banden um 1.450 nm und 1.940 nm).</li>
                  <li><strong>Holzfremde Stoffe:</strong> Bindemittel mit N–H-Gruppen (Harnstoff- und Melaminharze in Holzwerkstoffen), Lacke auf Acrylat- oder Polyurethanbasis und PVC-Beschichtungen erzeugen eigene Banden. Daran lassen sich Vollholz, Holzwerkstoffe sowie beschichtete und kunststoffbeschichtete Teile unterscheiden.</li>
                </ul>
                <Querverweis ziel="analytik" titel="Spektroskopische Verfahren" linkText="Zum Modul Analytik" className="mt-4">
                  Weitere Analyseverfahren wie Röntgenfluoreszenz und Infrarotspektroskopie im Labor behandelt das Modul Analytik.
                </Querverweis>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Ablauf der sensorgestützten Sortierung</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-text-main/85">
                    <li><strong>Aufbereitung:</strong> Vorzerkleinern, Abtrennen von Metallen (Magnet, Wirbelstrom) und Feinanteil; die Stücke werden auf einem schnellen Förderband vereinzelt.</li>
                    <li><strong>Messung:</strong> Eine Hyperspektralkamera nimmt Zeile für Zeile ein Spektrum je Bildpunkt auf; eine breitbandige Lichtquelle beleuchtet das Band.</li>
                    <li><strong>Auswertung:</strong> Vorverarbeitung der Spektren (z. B. Normierung, Ableitung) und Klassifizierung mit chemometrischen Verfahren oder maschinellem Lernen, trainiert an Referenzproben bekannter Kategorie.</li>
                    <li><strong>Ausschleusung:</strong> Erkannte Stücke werden am Bandende durch Druckluftdüsen aus der Flugbahn geblasen. Mehrere Sortierstufen nacheinander erhöhen die Reinheit.</li>
                  </ol>
                </div>
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Kennzahlen einer Sortierung</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><strong>Ausbringen</strong> einer Kategorie: Anteil ihrer Masse, der in der richtigen Ziellinie ankommt.</li>
                    <li><strong>Reinheit</strong> einer Ausgangsfraktion: Anteil der Zielkategorien an deren Masse.</li>
                    <li><strong>Fehlsortierquote:</strong> fehlgelenkte Masse bezogen auf den Eingang.</li>
                  </ul>
                  <p className="text-xs text-text-main/70 mt-3">Ausbringen und Reinheit stehen im Zielkonflikt: Wer streng aussortiert, erhält eine reine, aber kleinere stoffliche Fraktion.</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'grenzen' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Was NIR nicht sieht</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>Nur die Oberfläche:</strong> NIR-Strahlung dringt in Holz nur wenige Millimeter ein (Richtwert). Eine tief eingebrachte Kesseldruckimprägnierung unter einem späteren Anstrich bleibt verborgen.</li>
                  <li><strong>Anorganische Holzschutzmittel:</strong> Salze auf Basis von Kupfer, Chrom, Arsen oder Bor zeigen kaum eigene NIR-Banden. Hierfür werden elementanalytische Sensoren wie Röntgenfluoreszenz (RFA) oder laserinduzierte Plasmaspektroskopie (LIBS) ergänzt.</li>
                  <li><strong>Geringe Konzentrationen:</strong> Organische Wirkstoffe wie PCP oder Lindan wirken schon im mg/kg-Bereich; die NIR-Erkennung arbeitet dagegen eher im Prozentbereich (Richtwert). Grenzwerte nach Anhang II lassen sich nur im Labor nachweisen.</li>
                  <li><strong>Störgrößen:</strong> Feuchte überlagert die Banden, dunkle, verrußte oder verschmutzte Oberflächen liefern schwache Spektren, sich überlappende Stücke und Feinanteil verfälschen die Zuordnung.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Folgerungen für die Praxis</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li>Sensorgestützte Sortierung <strong>ergänzt</strong> Eingangskontrolle, Sichtprüfung und Laboranalytik, sie ersetzt sie nicht.</li>
                    <li>Die Kategorie hängt auch von der <strong>Herkunft</strong> ab (Anhang III): Holz aus dem Außenbereich gilt regelmäßig als A IV, auch wenn die Oberfläche unauffällig ist. Herkunftsinformationen aus dem Rückbau sind daher wertvoll.</li>
                    <li>Klassifikatoren sind nur so gut wie ihre <strong>Trainingsdaten</strong>; neue Beschichtungen oder Holzwerkstoffe erfordern ein Nachkalibrieren.</li>
                    <li>Kombinierte Sensorik (NIR, RFA, Farbkamera) und mehrstufige Sortierung verbessern die Reinheit, kosten aber Durchsatz.</li>
                  </ul>
                </div>
                <Querverweis ziel="holzkorrosion" titel="Holzschutz und Holzschutzmittel" linkText="Zum Modul Holzkorrosion">
                  Welche Holzschutzmittel früher eingesetzt wurden und wie sie wirken, beschreibt das Modul zur Holzkorrosion und zum Holzschutz.
                </Querverweis>
              </div>
            </div>
          )}

          {tab === 'urbanmining' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className={karte}>
                <h3 className="font-bold text-text-main mb-3">Urban Mining – die Stadt als Rohstofflager</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                  <li><strong>Anthropogenes Lager:</strong> Nach Schätzungen des Umweltbundesamts waren in Deutschland 2010 rund 51,7 Mrd. t Material in Gebäuden, Infrastruktur und langlebigen Gütern gebunden – davon etwa 55 % in Gebäuden und 44 % in Infrastruktur. Das Lager wächst netto um rund 0,8 Mrd. t pro Jahr, etwa 10 t je Einwohner.</li>
                  <li><strong>Leitgedanke:</strong> Bauwerke werden als künftige Rohstoffquelle betrachtet. Urban Mining plant den Rückgewinn schon beim Neubau mit und erschließt die Bestände beim Rückbau gezielt.</li>
                  <li><strong>Holz im Lager:</strong> Dachstühle, Holzbalkendecken, Fußböden und Holzbauten enthalten große Mengen Holz, häufig mit unbekannter Behandlung. Die Wiederverwendung tragender Hölzer setzt eine Prüfung von Zustand, Festigkeit und Holzschutzmittelbelastung voraus.</li>
                  <li><strong>Kohlenstoff:</strong> Holz besteht zu rund der Hälfte seiner Trockenmasse aus Kohlenstoff; 1 t darrtrockenes Holz entspricht etwa 1,8 t CO₂ (Richtwert). Kaskadennutzung verlängert diese Speicherung.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Materialkataster</h3>
                  <p className="text-sm text-text-main/85 mb-3">Ein Materialkataster erfasst, welche Baustoffe in welcher Menge und Qualität wo verbaut sind. Zwei Wege ergänzen sich:</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-text-main/85">
                    <li><strong>Bottom-up (Gebäude):</strong> Materialpass oder Gebäuderessourcenpass aus Planung, BIM-Modell oder Bestandsaufnahme; enthält Mengen, Einbauorte, Verbindungen und Schadstoffe.</li>
                    <li><strong>Top-down (Quartier, Stadt):</strong> Gebäudebestand aus Geodaten (Grundfläche, Höhe, Baujahr, Nutzung) mal typologiebezogener Materialintensität in kg/m² Bruttogrundfläche. So lassen sich künftige Rückbaumengen abschätzen.</li>
                  </ul>
                  <div className="bg-off-white rounded-xl border border-home-grau/30 p-3 mt-3 text-sm text-text-main/85">
                    Abschätzung: <em>m</em> = Σ BGF<sub>i</sub> · MI<sub>i</sub> (BGF Bruttogrundfläche, MI Materialintensität je Gebäudetyp und Baustoff). Die Materialintensitäten streuen stark und sind als Richtwerte zu behandeln.
                  </div>
                </div>
                <Querverweis ziel="materialpaesse" titel="Materialpässe" linkText="Zum Modul Materialpässe">
                  Aufbau und Inhalte digitaler Material- und Gebäuderessourcenpässe werden im Modul Materialpässe behandelt; den selektiven Rückbau beschreibt das Modul Rückbau & Material.
                </Querverweis>
              </div>
            </div>
          )}

          {tab === 'rechner' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in duration-300">
              <div className="flex flex-col gap-4">
                <CalculatorDisclaimerBanner className="my-1" customText="Lehrrechner: vereinfachtes Zwei-Linien-Modell einer Sortieranlage. Ausbringen und Warnschwellen sind Lehrannahmen, keine Anlagen- oder Grenzwerte." />
                <div className={box}>
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">Eingang: Masse je tatsächlicher Kategorie</h3>
                  <div className="flex flex-col gap-4">
                    {ALTHOLZ_KATEGORIEN.map(k => (
                      <Slider key={k} label={`Masse ${KATEGORIE_NAME[k]}`} min={0} max={100} step={1} value={masse[k]} unit="t"
                        onChange={e => setMasse(m => ({ ...m, [k]: Number(e.target.value) }))} />
                    ))}
                  </div>
                </div>
                <div className={box}>
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">Sortierer: Ausbringen in die Ziellinie</h3>
                  <div className="flex flex-col gap-4">
                    {ALTHOLZ_KATEGORIEN.map(k => (
                      <Slider key={k} label={`Ausbringen ${KATEGORIE_NAME[k]}`} info={ZIEL_STOFFLICH[k] ? 'Ziellinie: stofflich (Holzwerkstoffe).' : 'Ziellinie: energetisch (17. BImSchV).'}
                        min={0} max={100} step={1} value={ausbringen[k]} unit="%"
                        onChange={e => setAusbringen(a => ({ ...a, [k]: Number(e.target.value) }))} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className={karte}>
                  <h3 className="font-bold text-text-main mb-3">Ergebnis</h3>
                  {gueltig ? (
                    <>
                      <div className="flex flex-col gap-3 mb-4">
                        <LinienBalken stroeme={erg.stroeme} linie="st" gesamt={erg.mIn} />
                        <LinienBalken stroeme={erg.stroeme} linie="en" gesamt={erg.mIn} />
                        <div className="flex flex-wrap gap-3 text-xs text-text-main/75">
                          {ALTHOLZ_KATEGORIEN.map(k => <span key={k} className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm" style={{ background: FARBE[k] }} aria-hidden="true" />{KATEGORIE_NAME[k]}</span>)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70">stoffliche Verwertungsquote q_st</div><div className="text-lg font-bold text-shiraz">{formatDeZahl(erg.qSt * 100, 1)} %</div><div className="text-xs text-text-main/70">höchstens {formatDeZahl(erg.qStMax * 100, 1)} %</div></div>
                        <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70">Fehlsortierquote q_F</div><div className="text-lg font-bold">{formatDeZahl(erg.qFehl * 100, 1)} %</div><div className="text-xs text-text-main/70">{formatDeZahl(erg.mFehl, 2)} t fehlgelenkt</div></div>
                        <div className="p-3 rounded-xl border border-home-grau/30 bg-off-white"><div className="text-xs text-text-main/70">Reinheit stoffliche Linie</div><div className="text-lg font-bold">{erg.mSt > 0 ? `${formatDeZahl(erg.reinheitSt * 100, 1)} %` : '–'}</div></div>
                        <div className={`p-3 rounded-xl border ${erg.anteilAIVSt > 0.005 ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}><div className="text-xs">A IV in der stofflichen Linie</div><div className="text-lg font-bold">{formatDeZahl(erg.anteilAIVSt * 100, 2)} %</div></div>
                      </div>
                      <div className="overflow-x-auto mt-4">
                        <table className="w-full text-xs border-collapse">
                          <thead><tr className="bg-off-white text-left"><th className={zelle}>Kategorie</th><th className={zelle}>Eingang in t</th><th className={zelle}>stofflich in t</th><th className={zelle}>energetisch in t</th><th className={zelle}>fehlsortiert in t</th></tr></thead>
                          <tbody>
                            {erg.stroeme.map(x => (
                              <tr key={x.kategorie}><td className={`${zelle} font-semibold`}>{KATEGORIE_NAME[x.kategorie]}</td><td className={zelle}>{formatDeZahl(x.m, 2)}</td><td className={zelle}>{formatDeZahl(x.inStofflich, 2)}</td><td className={zelle}>{formatDeZahl(x.inEnergetisch, 2)}</td><td className={zelle}>{formatDeZahl(x.fehl, 2)}</td></tr>
                            ))}
                            <tr className="font-bold"><td className={zelle}>Summe</td><td className={zelle}>{formatDeZahl(erg.mIn, 2)}</td><td className={zelle}>{formatDeZahl(erg.mSt, 2)}</td><td className={zelle}>{formatDeZahl(erg.mEn, 2)}</td><td className={zelle}>{formatDeZahl(erg.mFehl, 2)}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : <p className="text-sm text-text-main/80">Keine Berechnung möglich.</p>}
                  <EingabeHinweise hinweise={erg.hinweise} />
                </div>
                <FormulaDerivationBox
                  live
                  title={`Ihr Rechenweg: Sortierbilanz für ${formatDeZahl(erg.mIn, 1)} t Altholz`}
                  zielGleichung="q_{st} = \frac{\sum_{A\,I,\,A\,II} a_k\, m_k}{M_{in}}, \quad q_F = \frac{\sum_k (1 - a_k)\, m_k}{M_{in}}"
                  schritte={liveSchritte}
                  ergebnisHinweis="Schon wenige Prozent fehlgelenktes A IV verschlechtern die Qualität der stofflichen Fraktion stärker, als ein etwas geringeres Ausbringen bei A II die Quote mindert."
                  normQuelle="Massenbilanz (Erhaltung der Masse); Kategorien nach § 2 AltholzV; Ausbringen und Warnschwellen als Lehrannahmen"
                />
              </div>
            </div>
          )}
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIELE */}
      <FormulaDerivationBox
        title="Beispiel 1: Wirkung einer zweiten Sortierstufe auf den A-IV-Anteil"
        zielGleichung="w_{A\,IV} = \frac{(1 - a_{IV})\, m_{IV}}{M_{st}}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Stoffliche Linie nach der ersten Stufe (Beispiel im Rechner): 58,25 t, davon 1,25 t A IV. Eine zweite NIR-Stufe lenkt 90 % des verbliebenen A IV aus (Lehrannahme) und verliert dabei 2 % des richtig sortierten A I/A II.', formel: 'M_{st} = 58{,}25\\,\\text{t}, \\quad m_{IV,st} = 1{,}25\\,\\text{t}' },
          { titel: 'A IV nach Stufe 2', erklaerung: 'Rest an A IV und neue Masse der stofflichen Linie (A III bleibt unverändert):', formel: 'm_{IV} = 0{,}10 \\cdot 1{,}25 = 0{,}125\\,\\text{t}; \\quad M_{st} = 0{,}98 \\cdot 54{,}75 + 2{,}25 + 0{,}125 = 56{,}03\\,\\text{t}' },
          { titel: 'Anteil A IV', erklaerung: 'Vergleich vor und nach der zweiten Stufe:', formel: 'w_{A\\,IV} = \\frac{1{,}25}{58{,}25} = 2{,}15\\,\\% \\;\\Rightarrow\\; \\frac{0{,}125}{56{,}03} = 0{,}22\\,\\%' },
        ]}
        ergebnisHinweis="Eine Nachsortierung senkt den A-IV-Anteil um eine Größenordnung und kostet nur rund 1,1 t stoffliches Material. Ob die Grenzwerte nach Anhang II eingehalten sind, zeigt erst die Analyse der Hackschnitzel."
        normQuelle="Massenbilanz; Ausbringen der zweiten Stufe als Lehrannahme"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Holzpotenzial eines Quartiers aus dem Materialkataster"
        zielGleichung="m = \sum_i \text{BGF}_i \cdot \text{MI}_i"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Quartier mit 40 Mehrfamilienhäusern der 1950er-Jahre zu je 900 m² BGF. Angenommene Materialintensität Holz (Dachstuhl, Holzbalkendecken, Fußböden): 60 kg/m² BGF (Lehrannahme).', formel: '\\text{BGF} = 40 \\cdot 900 = 36\\,000\\,\\text{m}^2, \\quad \\text{MI} = 60\\,\\text{kg/m}^2' },
          { titel: 'Holzmasse im Lager', erklaerung: 'Produkt aus Fläche und Materialintensität:', formel: 'm = 36\\,000 \\cdot 60 = 2\\,160\\,000\\,\\text{kg} = 2\\,160\\,\\text{t}' },
          { titel: 'Stofflich verwertbarer Anteil', erklaerung: 'Angenommen: 40 % A IV (Dachstuhl mit Holzschutzmittel), 60 % A I/A II. Bei q_st = 90 % des Potenzials:', formel: 'm_{st} = 2\\,160 \\cdot 0{,}60 \\cdot 0{,}90 \\approx 1\\,166\\,\\text{t}' },
        ]}
        ergebnisHinweis="Das Kataster liefert Größenordnungen für die Planung von Rückbau und Aufbereitung. Die tatsächliche Kategorie ergibt sich erst aus Schadstofferkundung und Sortierung."
        normQuelle="Top-down-Abschätzung mit Materialintensitäten (Lehrannahmen)"
      />

      <ModulTest moduleId="altholz_urban_mining" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (neu erstellt, AP 6.2 (c); fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Altholzverordnung', url: 'https://de.wikipedia.org/wiki/Altholzverordnung' },
          { title: 'Nahinfrarotspektroskopie', url: 'https://de.wikipedia.org/wiki/Nahinfrarotspektroskopie' },
        ]}
        weblinks={[
          { title: 'Altholzverordnung (AltholzV) – Gesetze im Internet', url: 'https://www.gesetze-im-internet.de/altholzv/' },
          { title: 'Umweltbundesamt: Das anthropogene Lager', url: 'https://www.umweltbundesamt.de/themen/abfall-ressourcen/abfallwirtschaft/urban-mining/das-anthropogene-lager' },
        ]}
        literatur={[
          'Umweltbundesamt (Hrsg.): Urban Mining – Ressourcenschonung im Anthropozän. Dessau-Roßlau: UBA 2017',
          'Siesler, H. W.; Ozaki, Y.; Kawata, S.; Heise, H. M. (Hrsg.): Near-Infrared Spectroscopy – Principles, Instruments, Applications. Weinheim: Wiley-VCH 2002',
          'Brunner, P. H.; Rechberger, H.: Handbook of Material Flow Analysis. 2. Aufl. Boca Raton: CRC Press 2016',
          'Baccini, P.; Brunner, P. H.: Metabolism of the Anthroposphere. 2. Aufl. Cambridge (MA): MIT Press 2012',
        ]}
        regelwerke={[
          { title: 'AltholzV – Verordnung über Anforderungen an die Verwertung und Beseitigung von Altholz vom 15.08.2002, zuletzt geändert 2020' },
          { title: 'KrWG – Kreislaufwirtschaftsgesetz (Abfallhierarchie § 6)' },
          { title: 'GewAbfV – Gewerbeabfallverordnung (getrennte Sammlung von Bau- und Abbruchabfällen)' },
          { title: 'AVV – Abfallverzeichnis-Verordnung (17 02 01 Holz, 17 02 04* gefährliche Stoffe enthaltendes Holz)' },
          { title: 'PCB/PCT-Abfallverordnung' },
          { title: '17. BImSchV – Verordnung über die Verbrennung und die Mitverbrennung von Abfällen' },
          { title: 'ISO 20473:2007 (Optics and photonics – Spectral bands)' },
        ]}
        formeln={[
          { formel: 'M_{st} = \\sum_{A\\,I,\\,A\\,II} a_k m_k + \\sum_{A\\,III,\\,A\\,IV} (1 - a_k) m_k', erklaerung: 'Masse der stofflichen Linie aus den Kategoriemassen m_k und dem Ausbringen a_k in die jeweilige Ziellinie.', quelle: 'Massenbilanz' },
          { formel: 'q_F = \\frac{\\sum_k (1 - a_k) m_k}{M_{in}}, \\quad q_{st} = \\frac{\\sum_{A\\,I,\\,A\\,II} a_k m_k}{M_{in}}', erklaerung: 'Fehlsortierquote und stoffliche Verwertungsquote bezogen auf die Eingangsmasse.', quelle: 'Massenbilanz' },
          { formel: 'm = \\sum_i \\text{BGF}_i \\cdot \\text{MI}_i', erklaerung: 'Top-down-Abschätzung eines Materiallagers aus Bruttogrundfläche und Materialintensität je Gebäudetyp.', quelle: 'Materialflussanalyse' },
        ]}
      />
    </div>
  );
}
