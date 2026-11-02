import React from 'react';
import { Activity } from 'lucide-react';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { zahlAus } from '@/src/utils/handoutExport';
import { CL_OH_KRITISCH, E_CSE_GEGEN_SHE, M_NACL, bezugselektrode, potentialReihe, type PotentialBereich } from '@/src/calc/laborversuche';
import { VersuchsHandout, Kennwert, type AuswertungsAnsicht } from '@/src/components/handout/VersuchsHandout';
import type { ProtokollStand } from '@/src/components/handout/handoutTypen';
import { POTENTIAL_HANDOUT } from '@/src/data/laborhandouts/potentialmessung';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhaltJson from '@/content/laborhandouts/Potentialmessung.json';
import { MdText } from '@/src/components/inhalt/MdText';

const th = 'p-2 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2 text-xs text-text-main/85 border-b border-home-grau/15 font-mono';

const BEREICH_TEXT: Record<PotentialBereich, string> = {
  '–': '–', // F-1: keine Zahl → keine Einstufung
  gering: inhaltJson.werte.geringeKorrosionswahrscheinlichkeit,
  unsicher: inhaltJson.werte.unsichererBereich,
  hoch: inhaltJson.werte.hoheKorrosionswahrscheinlichkeit,
};

function auswerten(stand: ProtokollStand): AuswertungsAnsicht {
  const bezug = bezugselektrode(stand.kopf.bezug ?? '');
  const vol = zahlAus(stand.kopf.volumen);
  const pH = zahlAus(stand.kopf.ph);
  const sprung = zahlAus(stand.kopf.sprung);
  const messungen = stand.zeilen
    .map(z => ({ mNaCl: zahlAus(z.mNaCl), eMess: zahlAus(z.eMess) }))
    .filter(m => Number.isFinite(m.mNaCl) || Number.isFinite(m.eMess));
  const erg = potentialReihe({ messungen, eBezugSHE: bezug.eSHE, volumen: vol, pH, sprung });
  const tex = formatDeTeX;
  const p0 = erg.punkte[0];
  const ps = erg.sprungIndex >= 0 ? erg.punkte[erg.sprungIndex] : undefined;
  const vor = erg.sprungIndex > 0 ? erg.punkte[erg.sprungIndex - 1] : undefined;

  // Diagramm E_CSE über NaCl-Zugabe
  const B = 360, H = 210, L = 46, U = 30, O = 10, R = 12;
  const mMax = Math.max(1, ...erg.punkte.map(p => p.mNaCl)) * 1.08; // Darstellungsfaktor (Achsenreserve)
  const eMin = Math.min(-450, ...erg.punkte.map(p => p.eCSE)) - 20;
  const eMax = Math.max(0, ...erg.punkte.map(p => p.eCSE)) + 20;
  const px = (m: number) => L + m / mMax * (B - L - R);
  const py = (e: number) => O + (eMax - e) / (eMax - eMin) * (H - U - O);
  const linie = erg.punkte.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.mNaCl)} ${py(p.eCSE)}`).join(' ');

  const ergebnisse = erg.gueltig ? [
    { label: 'Bezugselektrode', wert: `${bezug.name} (+${formatDeZahl(bezug.eSHE, 0)} mV gegen SHE)` },
    { label: inhaltJson.werte.ruhepotentialNullmessung, wert: `${formatDeZahl(p0.eMess, 0)} mV gegen Bezug = ${formatDeZahl(p0.eSHE, 0)} mV SHE = ${formatDeZahl(p0.eCSE, 0)} mV CSE` },
    { label: inhaltJson.werte.hydroxidionenCOh, wert: `${formatDeZahl(erg.cOH, 4)} mol/L (pH ${formatDeZahl(pH, 2)})` },
    ps
      ? { label: inhaltJson.werte.potentialabfallDepassivierungVermutet, wert: `bei ${formatDeZahl(ps.mNaCl, 2)} g NaCl: c(Cl⁻) = ${formatDeZahl(ps.cCl, 4)} mol/L, Cl⁻/OH⁻ = ${formatDeZahl(ps.clOh, 2)}, ΔE = ${formatDeZahl(ps.delta, 0)} mV` }
      : { label: 'Potentialabfall', wert: `kein Abfall ≥ ${formatDeZahl(sprung, 0)} mV zwischen zwei Stufen` },
  ] : [];

  const inhalt = (
    <div className="flex flex-col gap-5">
      <EingabeHinweise hinweise={erg.hinweise} />
      {erg.gueltig && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kennwert label={inhaltJson.werte.ruhepotentialCse} wert={formatDeZahl(p0.eCSE, 0)} einheit="mV" />
            <Kennwert label="c(OH⁻)" wert={formatDeZahl(erg.cOH, 4)} einheit="mol/L" />
            <Kennwert label={inhaltJson.werte.abfallBeiNacl} wert={ps ? formatDeZahl(ps.mNaCl, 2) : '–'} einheit="g" />
            <Kennwert label={inhaltJson.werte.clOhBeimAbfall} wert={ps ? formatDeZahl(ps.clOh, 2) : '–'} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[460px]">
                <caption className="text-left text-sm font-bold text-text-main pb-2"><MdText text={inhaltJson.texte.umgerechneteMesswerte} /></caption>
                <thead>
                  <tr>
                    <th scope="col" className={th}>NaCl in g</th><th scope="col" className={th}>E SHE in mV</th><th scope="col" className={th}>E CSE in mV</th>
                    <th scope="col" className={th}><MdText text={inhaltJson.texte.cClInMol} /></th><th scope="col" className={th}>Cl⁻/OH⁻</th><th scope="col" className={th}><MdText text={inhaltJson.texte.bereichRichtwert} /></th>
                  </tr>
                </thead>
                <tbody>
                  {erg.punkte.map((p, i) => (
                    <tr key={i} className={i === erg.sprungIndex ? 'bg-rose-50' : undefined}>
                      <th scope="row" className={td}>{formatDeZahl(p.mNaCl, 2)}</th>
                      <td className={td}>{formatDeZahl(p.eSHE, 0)}</td>
                      <td className={td}>{formatDeZahl(p.eCSE, 0)}</td>
                      <td className={td}>{formatDeZahl(p.cCl, 4)}</td>
                      <td className={td}>{formatDeZahl(p.clOh, 2)}</td>
                      <td className={`${td} font-sans`}>{BEREICH_TEXT[p.bereich]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <figure className="flex flex-col gap-1">
              <svg viewBox={`0 0 ${B} ${H}`} className="w-full h-auto bg-off-white rounded-lg" role="img" aria-label={inhaltJson.werte.potentialGegenCseÜber}>
                <line x1={L} y1={H - U} x2={B - R} y2={H - U} stroke="#64748b" strokeWidth="1" />
                <line x1={L} y1={O} x2={L} y2={H - U} stroke="#64748b" strokeWidth="1" />
                {[-200, -350].map(g => (
                  <g key={g}>
                    <line x1={L} y1={py(g)} x2={B - R} y2={py(g)} stroke="#b45309" strokeWidth="1" strokeDasharray="5 3" />
                    <text x={B - R - 2} y={py(g) - 3} textAnchor="end" fontSize="9" fill="#92400e">{formatDeZahl(g, 0)} mV</text>
                  </g>
                ))}
                <path d={linie} fill="none" stroke="#9b1b30" strokeWidth="2" />
                {erg.punkte.map((p, i) => <circle key={i} cx={px(p.mNaCl)} cy={py(p.eCSE)} r="3.5" fill={i === erg.sprungIndex ? '#be123c' : '#0f172a'} />)}
                <text x={B - R} y={H - 8} textAnchor="end" fontSize="10" fill="#334155">NaCl kumuliert in g</text>
                <text x={4} y={H - U + 4} fontSize="9" fill="#334155">{formatDeZahl(eMin, 0)}</text>
                <text x={4} y={O + 8} fontSize="9" fill="#334155">{formatDeZahl(eMax, 0)}</text>
                <text x={L + 4} y={O + 10} fontSize="10" fill="#334155">E gegen CSE in mV</text>
              </svg>
              <figcaption className="text-[10px] text-text-main/70"><MdText text={inhaltJson.texte.gestricheltDieBereichsgrenzenNach} /></figcaption>
            </figure>
          </div>
          <div className={`p-4 rounded-xl border text-sm leading-relaxed ${ps ? 'border-rose-300 bg-rose-50' : 'border-emerald-300 bg-emerald-50'}`}>
            {ps ? (
              <p>
                Zwischen {formatDeZahl(vor?.mNaCl, 2)} g und {formatDeZahl(ps.mNaCl, 2)}<MdText text={inhaltJson.texte.gNaclFälltDas} /><strong>{formatDeZahl(-ps.delta, 0)} mV</strong><MdText text={inhaltJson.texte.eineDepassivierungIstWahrscheinlich} /><strong>{formatDeZahl(ps.clOh, 2)}</strong><MdText text={inhaltJson.texte.vorherigeStufe} />{formatDeZahl(vor?.clOh, 2)}<MdText text={inhaltJson.texte.hausmannNenntAlsRichtwert} />{formatDeZahl(CL_OH_KRITISCH, 1)}.
              </p>
            ) : <p><MdText text={inhaltJson.texte.keinPotentialabfallÜberDer} /></p>}
            <p className="text-[11px] text-text-main/70 mt-1.5"><MdText text={inhaltJson.texte.maßgebendIstDerVerlauf} /></p>
          </div>
          <FormulaDerivationBox
            live
            title={inhaltJson.werte.ihrRechenwegUmrechnungUnd}
            zielGleichung="E_{SHE} = E_{mess} + E_{Bezug}, \quad E_{CSE} = E_{SHE} - 316\,\text{mV}, \quad \frac{c_{Cl^-}}{c_{OH^-}} = \frac{m_{NaCl}/(M_{NaCl}\,V)}{10^{pH-14}}"
            schritte={[
              {
                titel: inhaltJson.werte.nullmessungAufSheUnd,
                erklaerung: `Bezugselektrode ${bezug.name} mit +${formatDeZahl(bezug.eSHE, 0)} mV gegen SHE:`,
                formel: `E_{SHE} = ${tex(p0.eMess, 0)} + ${tex(bezug.eSHE, 0)} = ${tex(p0.eSHE, 0)}\\,\\text{mV}, \\quad E_{CSE} = ${tex(p0.eSHE, 0)} - ${tex(E_CSE_GEGEN_SHE, 0)} = ${tex(p0.eCSE, 0)}\\,\\text{mV}`,
              },
              {
                titel: inhaltJson.werte.hydroxidionenAusDemPh,
                erklaerung: inhaltJson.werte.lehrvereinfachungAktivitätGleichKonzentr,
                formel: `c_{OH^-} = 10^{${tex(pH, 2)} - 14} = ${tex(erg.cOH, 4)}\\,\\tfrac{\\text{mol}}{\\text{L}}`,
              },
              ps ? {
                titel: inhaltJson.werte.chloridionenBeimPotentialabfall,
                erklaerung: `Kumulierte Zugabe ${formatDeZahl(ps.mNaCl, 2)} g NaCl in ${formatDeZahl(vol, 2)} L Lösung:`,
                formel: `c_{Cl^-} = \\frac{${tex(ps.mNaCl, 2)}}{${tex(M_NACL, 2)} \\cdot ${tex(vol, 2)}} = ${tex(ps.cCl, 4)}\\,\\tfrac{\\text{mol}}{\\text{L}}, \\quad \\frac{c_{Cl^-}}{c_{OH^-}} = \\frac{${tex(ps.cCl, 4)}}{${tex(erg.cOH, 4)}} = ${tex(ps.clOh, 2)}`,
              } : {
                titel: inhaltJson.werte.chloridionenDerLetztenStufe,
                erklaerung: inhaltJson.werte.keinSprungErkanntVerhältnis,
                formel: `\\frac{c_{Cl^-}}{c_{OH^-}} = ${tex(erg.punkte[erg.punkte.length - 1].clOh, 2)}`,
              },
              {
                titel: 'Sprungkriterium',
                erklaerung: `Depassivierung vermutet, wenn das Potential zwischen zwei Stufen um mindestens ${formatDeZahl(sprung, 0)} mV fällt:`,
                formel: ps ? `\\Delta E = ${tex(ps.eMess, 0)} - (${tex(vor?.eMess, 0)}) = ${tex(ps.delta, 0)}\\,\\text{mV} \\le -${tex(sprung, 0)}\\,\\text{mV}` : `\\Delta E > -${tex(sprung, 0)}\\,\\text{mV}\\ \\text{in allen Stufen}`,
              },
            ]}
            ergebnisHinweis={inhaltJson.werte.elektrodenpotentialeBei25C}
            normQuelle={inhaltJson.werte.bewertungNachAstmC876}
          />
        </>
      )}
    </div>
  );
  return { inhalt, ergebnisse };
}

export default function Potentialmessung() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Activity className="w-5 h-5 text-shiraz" aria-hidden="true" /><MdText text={inhaltJson.texte.versuchsHandoutPotentialmessungAn} /></h2>
          <p className="text-xs text-text-main/70 font-mono mt-1"><MdText text={inhaltJson.texte.ruhepotentialInGesättigterCa} /></p>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhaltJson.texte.dieGesättigteCalciumhydroxidlösungBildet} /></p>
        <VersuchsHandout daten={POTENTIAL_HANDOUT} auswertung={auswerten} />
        <Querverweis ziel="korrosion" titel={inhaltJson.werte.hintergrundChloridinduzierteKorrosion} linkText={inhaltJson.werte.zumModulBewehrungskorrosion}>
          <p><MdText text={inhaltJson.texte.passivierungLochfraßKritischerChloridgeh} /></p>
        </Querverweis>
      </div>

      <ModulTest moduleId="labor_potentialmessung" />

      <ModuleFooter
        lastReviewed={inhaltJson.werte.oktober2026Ap6}
        wikipedia={[
          { title: 'Bezugselektrode', url: 'https://de.wikipedia.org/wiki/Bezugselektrode' },
          { title: 'Passivierung', url: 'https://de.wikipedia.org/wiki/Passivierung' },
        ]}
        literatur={inhaltJson.daten["Potentialmessung.literatur"]}
        regelwerke={inhaltJson.daten["Potentialmessung.regelwerke"]}
        formeln={inhaltJson.daten["Potentialmessung.formeln"]}
      />
    </div>
  );
}
