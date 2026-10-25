import React from 'react';
import { Waves } from 'lucide-react';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { zahlAus } from '@/src/utils/handoutExport';
import { AUSBREITKLASSEN, frischbeton } from '@/src/calc/laborversuche';
import { VersuchsHandout, Kennwert, type AuswertungsAnsicht } from '@/src/components/handout/VersuchsHandout';
import type { ProtokollStand } from '@/src/components/handout/handoutTypen';
import { FRISCHBETON_HANDOUT } from '@/src/data/laborhandouts/frischbeton';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

const th = 'p-2 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2 text-xs text-text-main/85 border-b border-home-grau/15 font-mono';

function auswerten(stand: ProtokollStand): AuswertungsAnsicht {
  const soll = zahlAus(stand.kopf.soll);
  const proben = stand.zeilen
    .map(z => ({ d1: zahlAus(z.d1), d2: zahlAus(z.d2), mLeer: zahlAus(z.mLeer), mVoll: zahlAus(z.mVoll), vol: zahlAus(z.vol), a1: zahlAus(z.a1), g: zahlAus(z.g) }))
    .filter(p => [p.d1, p.d2, p.mLeer, p.mVoll, p.vol, p.a1, p.g].some(Number.isFinite));
  const voll = proben.filter(p => [p.d1, p.d2, p.mLeer, p.mVoll, p.vol, p.a1, p.g].every(Number.isFinite));
  const erg = frischbeton(proben, soll);
  const tex = formatDeTeX;
  const p0 = voll[0];
  const w0 = erg.werte[0];

  const ergebnisse = erg.gueltig ? [
    { label: 'Ausbreitmaß (Mittel)', wert: `${formatDeZahl(erg.mittelF, 0)} mm, Klasse ${erg.werte.map(w => w.klasse).join(' / ')}` },
    { label: 'Frischbetonrohdichte (Mittel)', wert: `${formatDeZahl(erg.mittelRohdichte, 0)} kg/m³` },
    { label: 'Luftgehalt A_c (Mittel)', wert: `${formatDeZahl(erg.mittelLuft, 1)} %` },
  ] : [];

  const inhalt = (
    <div className="flex flex-col gap-5">
      <EingabeHinweise hinweise={[...erg.hinweise, ...(voll.length < proben.length ? [{ stufe: 'warnung' as const, text: 'Unvollständige Zeilen werden nicht ausgewertet.' }] : [])]} />
      {erg.gueltig && p0 && w0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kennwert label="Ausbreitmaß f" wert={formatDeZahl(erg.mittelF, 0)} einheit="mm" />
            <Kennwert label="Klasse (1. Probe)" wert={w0.klasse} />
            <Kennwert label="Rohdichte D" wert={formatDeZahl(erg.mittelRohdichte, 0)} einheit="kg/m³" />
            <Kennwert label="Luftgehalt A_c" wert={formatDeZahl(erg.mittelLuft, 1)} einheit="%" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[560px]">
              <caption className="text-left text-sm font-bold text-text-main pb-2">Ergebnisse je Probe</caption>
              <thead><tr><th scope="col" className={th}>Probe</th><th scope="col" className={th}>f in mm</th><th scope="col" className={th}>Klasse</th><th scope="col" className={th}>D in kg/m³</th><th scope="col" className={th}>A_c in %</th><th scope="col" className={th}>Luft aus Rohdichte in %</th></tr></thead>
              <tbody>
                {erg.werte.map((w, i) => (
                  <tr key={i}>
                    <th scope="row" className={td}>{i + 1}</th>
                    <td className={td}>{formatDeZahl(w.f, 0)}</td>
                    <td className={td}>{w.klasse}</td>
                    <td className={td}>{formatDeZahl(w.rohdichte, 0)}</td>
                    <td className={td}>{formatDeZahl(w.luft, 1)}</td>
                    <td className={td}>{formatDeZahl(w.luftAusDichte, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[420px]">
              <caption className="text-left text-sm font-bold text-text-main pb-2">Ausbreitmaßklassen nach DIN EN 206</caption>
              <thead><tr>{AUSBREITKLASSEN.map(k => <th key={k.id} scope="col" className={th}>{k.id}</th>)}</tr></thead>
              <tbody><tr>{AUSBREITKLASSEN.map(k => <td key={k.id} className={`${td} ${k.id === w0.klasse ? 'bg-shiraz/10 font-bold' : ''}`}>{k.min === 0 ? `≤ ${formatDeZahl(k.max, 0)}` : Number.isFinite(k.max) ? `${formatDeZahl(k.min, 0)} – ${formatDeZahl(k.max, 0)}` : `≥ ${formatDeZahl(k.min, 0)}`} mm</td>)}</tr></tbody>
            </table>
          </div>
          <FormulaDerivationBox
            live
            title="Ihr Rechenweg: Probe 1"
            zielGleichung="f = \frac{d_1 + d_2}{2}, \quad D = \frac{m_2 - m_1}{V}, \quad A_c = A_1 - G"
            schritte={[
              {
                titel: 'Ausbreitmaß',
                erklaerung: 'Mittel der beiden Durchmesser, auf 10 mm gerundet:',
                formel: `f = \\frac{${tex(p0.d1, 0)} + ${tex(p0.d2, 0)}}{2} = ${tex((p0.d1 + p0.d2) / 2, 1)} \\approx ${tex(w0.f, 0)}\\,\\text{mm} \\;\\Rightarrow\\; ${w0.klasse}`,
              },
              {
                titel: 'Frischbetonrohdichte',
                erklaerung: 'Masse des verdichteten Betons durch das Behältervolumen, auf 10 kg/m³ gerundet:',
                formel: `D = \\frac{${tex(p0.mVoll, 3)} - ${tex(p0.mLeer, 3)}}{${tex(p0.vol / 1000, 4)}} = ${tex((p0.mVoll - p0.mLeer) / p0.vol * 1000, 1)} \\approx ${tex(w0.rohdichte, 0)}\\,\\tfrac{\\text{kg}}{\\text{m}^3}`,
              },
              {
                titel: 'Luftgehalt',
                erklaerung: 'Ablesewert minus Korrekturfaktor der Gesteinskörnung:',
                formel: `A_c = ${tex(p0.a1, 1)} - ${tex(p0.g, 1)} = ${tex(w0.luft, 1)}\\,\\%`,
              },
              {
                titel: 'Gegenprobe über die Rohdichte',
                erklaerung: 'Luftporenfreie Soll-Rohdichte aus dem Mischungsentwurf:',
                formel: `A \\approx \\left(1 - \\frac{${tex(w0.rohdichte, 0)}}{${tex(soll, 0)}}\\right) \\cdot 100 = ${tex(w0.luftAusDichte, 1)}\\,\\%`,
              },
            ]}
            ergebnisHinweis="Die Gegenprobe ist nur so gut wie die Soll-Rohdichte: Abweichungen im Wassergehalt oder in der Kornrohdichte verschieben sie um mehrere Zehntel Prozent."
            normQuelle="DIN EN 12350-5:2019-09, DIN EN 12350-6:2019-09, DIN EN 12350-7:2022-05; Klassen nach DIN EN 206"
          />
        </>
      )}
    </div>
  );
  return { inhalt, ergebnisse };
}

export default function FrischbetonHandout() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Waves className="w-5 h-5 text-shiraz" aria-hidden="true" /> Versuchs-Handout: Frischbetonprüfungen
          </h2>
          <p className="text-xs text-text-main/70 font-mono mt-1">
            Ausbreitmaß (DIN EN 12350-5), Frischbetonrohdichte (DIN EN 12350-6) und Luftgehalt im Druckausgleichsverfahren (DIN EN 12350-7)
          </p>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed">
          Die drei Prüfungen werden an derselben Probe direkt nacheinander ausgeführt. Sie entscheiden auf der Baustelle über die Annahme des Betons und im Labor über die Eignung eines Mischungsentwurfs.
        </p>
        <VersuchsHandout daten={FRISCHBETON_HANDOUT} auswertung={auswerten} />
        <Querverweis ziel="frischbeton" titel="Theorie und virtuelle Versuche" linkText="Zum Modul Frischbeton">
          <p>Konsistenzprüfverfahren im Überblick, Rheologie und Einflüsse auf die Verarbeitbarkeit behandelt das Modul Frischbeton.</p>
        </Querverweis>
      </div>

      <ModulTest moduleId="labor_frischbeton" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 6.4: Handout neu erstellt; Pilot im Labor und fachliche Freigabe ausstehend)"
        wikipedia={[
          { title: 'Frischbeton', url: 'https://de.wikipedia.org/wiki/Frischbeton' },
          { title: 'Konsistenz (Beton)', url: 'https://de.wikipedia.org/wiki/Konsistenz_(Beton)' },
        ]}
        literatur={[
          'Verein Deutscher Zementwerke (Hrsg.): Zement-Taschenbuch. Düsseldorf: Verlag Bau+Technik (jeweils aktuelle Ausgabe)',
          'Weigler, H.; Karl, S.: Beton – Arten, Herstellung, Eigenschaften. Berlin: Ernst & Sohn 1989',
        ]}
        regelwerke={[
          'DIN_EN_12350_1',
          'DIN_EN_12350_5',
          'DIN_EN_12350_6',
          'DIN_EN_12350_7',
          'DIN_EN_206',
        ]}
        formeln={[
          { formel: 'f = (d_1 + d_2)/2', erklaerung: 'Ausbreitmaß, auf 10 mm gerundet.', quelle: 'DIN EN 12350-5:2019-09' },
          { formel: 'D = (m_2 - m_1)/V', erklaerung: 'Frischbetonrohdichte, auf 10 kg/m³ gerundet.', quelle: 'DIN EN 12350-6:2019-09' },
          { formel: 'A_c = A_1 - G', erklaerung: 'Luftgehalt des Betons; G Korrekturfaktor der Gesteinskörnung.', quelle: 'DIN EN 12350-7:2022-05' },
        ]}
      />
    </div>
  );
}
