import React from 'react';
import { Columns } from 'lucide-react';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { zahlAus } from '@/src/utils/handoutExport';
import { PRISMA, ZEMENTKLASSEN, moertelprismen } from '@/src/calc/laborversuche';
import { VersuchsHandout, Kennwert, type AuswertungsAnsicht } from '@/src/components/handout/VersuchsHandout';
import type { ProtokollStand } from '@/src/components/handout/handoutTypen';
import { MOERTEL_HANDOUT } from '@/src/data/laborhandouts/moertelprismen';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

const th = 'p-2 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2 text-xs text-text-main/85 border-b border-home-grau/15 font-mono';

function auswerten(stand: ProtokollStand): AuswertungsAnsicht {
  const alter = zahlAus(stand.kopf.alter);
  const zeilen = stand.zeilen
    .map(z => ({ prisma: z.prisma?.trim() || '–', Ff: zahlAus(z.Ff), Fc1: zahlAus(z.Fc1), Fc2: zahlAus(z.Fc2) }))
    .filter(p => [p.Ff, p.Fc1, p.Fc2].every(Number.isFinite));
  const erg = moertelprismen(zeilen, alter);
  const tex = formatDeTeX;
  const p0 = zeilen[0];
  const verworfen = erg.druck.verworfen;

  const ergebnisse = erg.gueltig ? [
    { label: 'Biegezugfestigkeit R_f (Mittel)', wert: `${formatDeZahl(erg.rfMittel, 1)} MPa` },
    { label: 'Druckfestigkeit R_c (Mittel)', wert: `${formatDeZahl(erg.druck.mittel, 1)} MPa${verworfen >= 0 ? ` (Einzelwert ${formatDeZahl(verworfen + 1, 0)} verworfen)` : ''}${erg.druck.gueltig ? '' : ' – Serie zu verwerfen'}` },
    { label: `Festigkeitsklasse nach ${formatDeZahl(alter, 0)} Tagen`, wert: erg.klasse },
  ] : [];

  const inhalt = (
    <div className="flex flex-col gap-5">
      <EingabeHinweise hinweise={erg.hinweise} />
      {erg.gueltig && p0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kennwert label="R_f (Mittel)" wert={formatDeZahl(erg.rfMittel, 1)} einheit="MPa" />
            <Kennwert label="R_c (Mittel)" wert={formatDeZahl(erg.druck.mittel, 1)} einheit="MPa" />
            <Kennwert label="Verhältnis R_c / R_f" wert={formatDeZahl(erg.druck.mittel / erg.rfMittel, 1)} />
            <Kennwert label="Klasse (28 d)" wert={erg.klasse} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[460px]">
              <caption className="text-left text-sm font-bold text-text-main pb-2">Einzelwerte</caption>
              <thead><tr><th scope="col" className={th}>Prisma</th><th scope="col" className={th}>R_f in MPa</th><th scope="col" className={th}>R_c Hälfte 1 in MPa</th><th scope="col" className={th}>R_c Hälfte 2 in MPa</th></tr></thead>
              <tbody>
                {zeilen.map((z, i) => (
                  <tr key={i}>
                    <th scope="row" className={td}>{z.prisma}</th>
                    <td className={td}>{formatDeZahl(erg.rf[i], 1)}</td>
                    {[0, 1].map(h => (
                      <td key={h} className={`${td} ${verworfen === 2 * i + h ? 'line-through text-rose-700' : ''}`}>{formatDeZahl(erg.rc[2 * i + h], 1)}{verworfen === 2 * i + h ? ' (verworfen)' : ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[360px]">
              <caption className="text-left text-sm font-bold text-text-main pb-2">Normfestigkeit nach 28 Tagen (DIN EN 197-1)</caption>
              <thead><tr><th scope="col" className={th}>Klasse</th><th scope="col" className={th}>Untergrenze in MPa</th><th scope="col" className={th}>Obergrenze in MPa</th></tr></thead>
              <tbody>{ZEMENTKLASSEN.map(k => <tr key={k.name}><th scope="row" className={td}>{k.name}</th><td className={td}>{formatDeZahl(k.min, 1)}</td><td className={td}>{Number.isFinite(k.max) ? formatDeZahl(k.max, 1) : '–'}</td></tr>)}</tbody>
            </table>
          </div>
          <FormulaDerivationBox
            live
            title={`Ihr Rechenweg: Prisma ${p0.prisma} und Mittelwerte`}
            zielGleichung="R_f = \frac{1{,}5 \cdot F_f \cdot l}{b^3}, \qquad R_c = \frac{F_c}{1600\,\text{mm}^2}"
            schritte={[
              {
                titel: 'Biegezugfestigkeit',
                erklaerung: `Stützweite l = ${formatDeZahl(PRISMA.l, 0)} mm, Seitenlänge b = ${formatDeZahl(PRISMA.b, 0)} mm, F in N:`,
                formel: `R_f = \\frac{1{,}5 \\cdot ${tex(p0.Ff * 1000, 0)} \\cdot ${tex(PRISMA.l, 0)}}{${tex(PRISMA.b, 0)}^3} = ${tex(erg.rf[0], 2)}\\,\\text{MPa}`,
              },
              {
                titel: 'Druckfestigkeit der Hälften',
                erklaerung: 'Druckfläche 40 mm × 40 mm:',
                formel: `R_{c,1} = \\frac{${tex(p0.Fc1 * 1000, 0)}}{1600} = ${tex(erg.rc[0], 2)}\\,\\text{MPa}, \\quad R_{c,2} = \\frac{${tex(p0.Fc2 * 1000, 0)}}{1600} = ${tex(erg.rc[1], 2)}\\,\\text{MPa}`,
              },
              {
                titel: '±10-%-Regel',
                erklaerung: verworfen >= 0 ? `Einzelwert ${formatDeZahl(verworfen + 1, 0)} weicht um mehr als 10 % vom Mittel aller Werte ab und wird verworfen:` : 'Alle Einzelwerte liegen innerhalb ±10 % des Mittels:',
                formel: `\\bar R_c = ${tex(erg.druck.mittel, 1)}\\,\\text{MPa}${erg.druck.gueltig ? '' : '\\quad \\text{(Serie verwerfen)}'}`,
              },
              {
                titel: 'Biegezug-Mittelwert und Klasse',
                erklaerung: 'Mittel der Biegezugwerte; Klasse nach der Untergrenze der Normfestigkeit:',
                formel: `\\bar R_f = ${tex(erg.rfMittel, 1)}\\,\\text{MPa}, \\quad \\text{Klasse: ${erg.klasse}}`,
              },
            ]}
            ergebnisHinweis="Die Norm gibt die Ergebnisse auf 0,1 MPa an. Die Anfangsfestigkeit (2 bzw. 7 Tage) unterscheidet zusätzlich die Klassen L, N und R."
            normQuelle="DIN EN 196-1:2016-11; Klassen nach DIN EN 197-1:2011-11"
          />
        </>
      )}
    </div>
  );
  return { inhalt, ergebnisse };
}

export default function Moertelprismen() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Columns className="w-5 h-5 text-shiraz" aria-hidden="true" /> Versuchs-Handout: Mörtelprismen nach DIN EN 196-1
          </h2>
          <p className="text-xs text-text-main/70 font-mono mt-1">
            Normmörtel, Prismen 40 mm × 40 mm × 160 mm, Biegezug- und Druckfestigkeit, Zuordnung zur Zementfestigkeitsklasse
          </p>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed">
          Mit dem Normmörtel wird die Festigkeit des Zements unter festgelegten Bedingungen bestimmt – unabhängig von Gesteinskörnung und Betonrezeptur. Die Prismenprüfung ist damit die Grundlage der Festigkeitsklassen 32,5, 42,5 und 52,5.
        </p>
        <VersuchsHandout daten={MOERTEL_HANDOUT} auswertung={auswerten} />
        <Querverweis ziel="bindemittel" titel="Zemente und ihre Festigkeitsentwicklung" linkText="Zum Modul Bindemittel">
          <p>Zementarten nach DIN EN 197-1, Hydratation und Festigkeitsentwicklung behandelt das Modul Bindemittel.</p>
        </Querverweis>
      </div>

      <ModulTest moduleId="labor_moertelprismen" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 6.4: Handout neu erstellt; Pilot im Labor und fachliche Freigabe ausstehend)"
        wikipedia={[
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' },
          { title: 'Normsand', url: 'https://de.wikipedia.org/wiki/Normsand' },
        ]}
        literatur={[
          'Verein Deutscher Zementwerke (Hrsg.): Zement-Taschenbuch. Düsseldorf: Verlag Bau+Technik (jeweils aktuelle Ausgabe)',
          'Locher, F. W.: Zement – Grundlagen der Herstellung und Verwendung. Düsseldorf: Verlag Bau+Technik 2000',
        ]}
        regelwerke={[
          'DIN_EN_196_1',
          'DIN_EN_197_1',
        ]}
        formeln={[
          { formel: 'R_f = \\frac{1{,}5 \\cdot F_f \\cdot l}{b^3}', erklaerung: 'Biegezugfestigkeit im Dreipunkt-Biegeversuch (l = 100 mm, b = 40 mm).', quelle: 'DIN EN 196-1:2016-11' },
          { formel: 'R_c = F_c / 1600\\,\\text{mm}^2', erklaerung: 'Druckfestigkeit an der Prismenhälfte.', quelle: 'DIN EN 196-1:2016-11' },
        ]}
      />
    </div>
  );
}
