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
import inhaltJson from '@/content/laborhandouts/FrischbetonHandout.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
    { label: inhaltJson.werte.ausbreitmaßMittel, wert: `${formatDeZahl(erg.mittelF, 0)} mm, Klasse ${erg.werte.map(w => w.klasse).join(' / ')}` },
    { label: inhaltJson.werte.frischbetonrohdichteMittel, wert: `${formatDeZahl(erg.mittelRohdichte, 0)} kg/m³` },
    { label: inhaltJson.werte.luftgehaltACMittel, wert: `${formatDeZahl(erg.mittelLuft, 1)} %` },
  ] : [];

  const inhalt = (
    <div className="flex flex-col gap-5">
      <EingabeHinweise hinweise={[...erg.hinweise, ...(voll.length < proben.length ? [{ stufe: 'warnung' as const, text: inhaltJson.werte.unvollständigeZeilenWerdenNicht }] : [])]} />
      {erg.gueltig && p0 && w0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kennwert label={inhaltJson.werte.ausbreitmaßF} wert={formatDeZahl(erg.mittelF, 0)} einheit="mm" />
            <Kennwert label={inhaltJson.werte.klasse1Probe} wert={w0.klasse} />
            <Kennwert label="Rohdichte D" wert={formatDeZahl(erg.mittelRohdichte, 0)} einheit="kg/m³" />
            <Kennwert label={inhaltJson.werte.luftgehaltAC} wert={formatDeZahl(erg.mittelLuft, 1)} einheit="%" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[560px]">
              <caption className="text-left text-sm font-bold text-text-main pb-2"><MdText text={inhaltJson.texte.ergebnisseJeProbe} /></caption>
              <thead><tr><th scope="col" className={th}>Probe</th><th scope="col" className={th}>f in mm</th><th scope="col" className={th}>Klasse</th><th scope="col" className={th}>D in kg/m³</th><th scope="col" className={th}>A_c in %</th><th scope="col" className={th}><MdText text={inhaltJson.texte.luftAusRohdichteIn} /></th></tr></thead>
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
              <caption className="text-left text-sm font-bold text-text-main pb-2"><MdText text={inhaltJson.texte.ausbreitmaßklassenNachDinEn} /></caption>
              <thead><tr>{AUSBREITKLASSEN.map(k => <th key={k.id} scope="col" className={th}>{k.id}</th>)}</tr></thead>
              <tbody><tr>{AUSBREITKLASSEN.map(k => <td key={k.id} className={`${td} ${k.id === w0.klasse ? 'bg-shiraz/10 font-bold' : ''}`}>{k.min === 0 ? `≤ ${formatDeZahl(k.max, 0)}` : Number.isFinite(k.max) ? `${formatDeZahl(k.min, 0)} – ${formatDeZahl(k.max, 0)}` : `≥ ${formatDeZahl(k.min, 0)}`} mm</td>)}</tr></tbody>
            </table>
          </div>
          <FormulaDerivationBox
            live
            title={inhaltJson.werte.ihrRechenwegProbe1}
            zielGleichung="f = \frac{d_1 + d_2}{2}, \quad D = \frac{m_2 - m_1}{V}, \quad A_c = A_1 - G"
            schritte={[
              {
                titel: 'Ausbreitmaß',
                erklaerung: inhaltJson.werte.mittelDerBeidenDurchmesser,
                formel: `f = \\frac{${tex(p0.d1, 0)} + ${tex(p0.d2, 0)}}{2} = ${tex((p0.d1 + p0.d2) / 2, 1)} \\approx ${tex(w0.f, 0)}\\,\\text{mm} \\;\\Rightarrow\\; ${w0.klasse}`,
              },
              {
                titel: 'Frischbetonrohdichte',
                erklaerung: inhaltJson.werte.masseDesVerdichtetenBetons,
                formel: `D = \\frac{${tex(p0.mVoll, 3)} - ${tex(p0.mLeer, 3)}}{${tex(p0.vol / 1000, 4)}} = ${tex((p0.mVoll - p0.mLeer) / p0.vol * 1000, 1)} \\approx ${tex(w0.rohdichte, 0)}\\,\\tfrac{\\text{kg}}{\\text{m}^3}`,
              },
              {
                titel: 'Luftgehalt',
                erklaerung: inhaltJson.werte.ablesewertMinusKorrekturfaktorDer,
                formel: `A_c = ${tex(p0.a1, 1)} - ${tex(p0.g, 1)} = ${tex(w0.luft, 1)}\\,\\%`,
              },
              {
                titel: inhaltJson.werte.gegenprobeÜberDieRohdichte,
                erklaerung: inhaltJson.werte.luftporenfreieSollRohdichteAus,
                formel: `A \\approx \\left(1 - \\frac{${tex(w0.rohdichte, 0)}}{${tex(soll, 0)}}\\right) \\cdot 100 = ${tex(w0.luftAusDichte, 1)}\\,\\%`,
              },
            ]}
            ergebnisHinweis={inhaltJson.werte.dieGegenprobeIstNur}
            normQuelle={inhaltJson.werte.dinEn123505}
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
            <Waves className="w-5 h-5 text-shiraz" aria-hidden="true" /><MdText text={inhaltJson.texte.versuchsHandoutFrischbetonprüfungen} /></h2>
          <p className="text-xs text-text-main/70 font-mono mt-1"><MdText text={inhaltJson.texte.ausbreitmaßDinEn12350} /></p>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhaltJson.texte.dieDreiPrüfungenWerden} /></p>
        <VersuchsHandout daten={FRISCHBETON_HANDOUT} auswertung={auswerten} />
        <Querverweis ziel="frischbeton" titel={inhaltJson.werte.theorieUndVirtuelleVersuche} linkText={inhaltJson.werte.zumModulFrischbeton}>
          <p><MdText text={inhaltJson.texte.konsistenzprüfverfahrenImÜberblickRheolo} /></p>
        </Querverweis>
      </div>

      <ModulTest moduleId="labor_frischbeton" />

      <ModuleFooter
        lastReviewed={inhaltJson.werte.oktober2026Ap6}
        wikipedia={[
          { title: 'Frischbeton', url: 'https://de.wikipedia.org/wiki/Frischbeton' },
          { title: inhaltJson.werte.konsistenzBeton, url: 'https://de.wikipedia.org/wiki/Konsistenz_(Beton)' },
        ]}
        literatur={inhaltJson.daten["FrischbetonHandout.literatur"]}
        regelwerke={[
          'DIN_EN_12350_1',
          'DIN_EN_12350_5',
          'DIN_EN_12350_6',
          'DIN_EN_12350_7',
          'DIN_EN_206',
        ]}
        formeln={inhaltJson.daten["FrischbetonHandout.formeln"]}
      />
    </div>
  );
}
