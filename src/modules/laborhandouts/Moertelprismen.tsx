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
import inhaltJson from '@/content/laborhandouts/Moertelprismen.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
    { label: inhaltJson.werte.biegezugfestigkeitRFMittel, wert: `${formatDeZahl(erg.rfMittel, 1)} MPa` },
    { label: inhaltJson.werte.druckfestigkeitRCMittel, wert: `${formatDeZahl(erg.druck.mittel, 1)} MPa${verworfen >= 0 ? ` (Einzelwert ${formatDeZahl(verworfen + 1, 0)} verworfen)` : ''}${erg.druck.gueltig ? '' : inhaltJson.werte.serieZuVerwerfen}` },
    { label: `Festigkeitsklasse nach ${formatDeZahl(alter, 0)} Tagen`, wert: erg.klasse },
  ] : [];

  const inhalt = (
    <div className="flex flex-col gap-5">
      <EingabeHinweise hinweise={erg.hinweise} />
      {erg.gueltig && p0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kennwert label={inhaltJson.werte.rFMittel} wert={formatDeZahl(erg.rfMittel, 1)} einheit="MPa" />
            <Kennwert label={inhaltJson.werte.rCMittel} wert={formatDeZahl(erg.druck.mittel, 1)} einheit="MPa" />
            <Kennwert label={inhaltJson.werte.verhältnisRCR} wert={formatDeZahl(erg.druck.mittel / erg.rfMittel, 1)} />
            <Kennwert label={inhaltJson.werte.klasse28D} wert={erg.klasse} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[460px]">
              <caption className="text-left text-sm font-bold text-text-main pb-2">Einzelwerte</caption>
              <thead><tr><th scope="col" className={th}>Prisma</th><th scope="col" className={th}>R_f in MPa</th><th scope="col" className={th}><MdText text={inhaltJson.texte.rCHälfte1} /></th><th scope="col" className={th}><MdText text={inhaltJson.texte.rCHälfte2} /></th></tr></thead>
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
              <caption className="text-left text-sm font-bold text-text-main pb-2"><MdText text={inhaltJson.texte.normfestigkeitNach28Tagen} /></caption>
              <thead><tr><th scope="col" className={th}>Klasse</th><th scope="col" className={th}><MdText text={inhaltJson.texte.untergrenzeInMpa} /></th><th scope="col" className={th}><MdText text={inhaltJson.texte.obergrenzeInMpa} /></th></tr></thead>
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
                titel: inhaltJson.werte.druckfestigkeitDerHälften,
                erklaerung: inhaltJson.werte.druckfläche40Mm40,
                formel: `R_{c,1} = \\frac{${tex(p0.Fc1 * 1000, 0)}}{1600} = ${tex(erg.rc[0], 2)}\\,\\text{MPa}, \\quad R_{c,2} = \\frac{${tex(p0.Fc2 * 1000, 0)}}{1600} = ${tex(erg.rc[1], 2)}\\,\\text{MPa}`,
              },
              {
                titel: '±10-%-Regel',
                erklaerung: verworfen >= 0 ? `Einzelwert ${formatDeZahl(verworfen + 1, 0)} weicht um mehr als 10 % vom Mittel aller Werte ab und wird verworfen:` : inhaltJson.werte.alleEinzelwerteLiegenInnerhalb,
                formel: `\\bar R_c = ${tex(erg.druck.mittel, 1)}\\,\\text{MPa}${erg.druck.gueltig ? '' : '\\quad \\text{(Serie verwerfen)}'}`,
              },
              {
                titel: inhaltJson.werte.biegezugMittelwertUndKlasse,
                erklaerung: inhaltJson.werte.mittelDerBiegezugwerteKlasse,
                formel: `\\bar R_f = ${tex(erg.rfMittel, 1)}\\,\\text{MPa}, \\quad \\text{Klasse: ${erg.klasse}}`,
              },
            ]}
            ergebnisHinweis={inhaltJson.werte.dieNormGibtDie}
            normQuelle={inhaltJson.werte.dinEn1961}
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
            <Columns className="w-5 h-5 text-shiraz" aria-hidden="true" /><MdText text={inhaltJson.texte.versuchsHandoutMörtelprismenNach} /></h2>
          <p className="text-xs text-text-main/70 font-mono mt-1"><MdText text={inhaltJson.texte.normmörtelPrismen40Mm} /></p>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhaltJson.texte.mitDemNormmörtelWird} /></p>
        <VersuchsHandout daten={MOERTEL_HANDOUT} auswertung={auswerten} />
        <Querverweis ziel="bindemittel" titel={inhaltJson.werte.zementeUndIhreFestigkeitsentwicklung} linkText={inhaltJson.werte.zumModulBindemittel}>
          <p><MdText text={inhaltJson.texte.zementartenNachDinEn} /></p>
        </Querverweis>
      </div>

      <ModulTest moduleId="labor_moertelprismen" />

      <ModuleFooter
        lastReviewed={inhaltJson.werte.oktober2026Ap6}
        wikipedia={[
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' },
          { title: 'Normsand', url: 'https://de.wikipedia.org/wiki/Normsand' },
        ]}
        literatur={inhaltJson.daten["Moertelprismen.literatur"]}
        regelwerke={[
          'DIN_EN_196_1',
          'DIN_EN_197_1',
        ]}
        formeln={inhaltJson.daten["Moertelprismen.formeln"]}
      />
    </div>
  );
}
