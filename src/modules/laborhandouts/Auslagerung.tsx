import React from 'react';
import { Clock } from 'lucide-react';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { zahlAus } from '@/src/utils/handoutExport';
import { auslagerung, type AuslagerungsErgebnis } from '@/src/calc/laborversuche';
import { VersuchsHandout, Kennwert, type AuswertungsAnsicht } from '@/src/components/handout/VersuchsHandout';
import type { ProtokollStand } from '@/src/components/handout/handoutTypen';
import { AUSLAGERUNG_HANDOUT } from '@/src/data/laborhandouts/auslagerung';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhaltJson from '@/content/laborhandouts/Auslagerung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

const th = 'p-2 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2 text-xs text-text-main/85 border-b border-home-grau/15 font-mono';

interface Gruppe { medium: string; erg: AuslagerungsErgebnis }

function auswerten(stand: ProtokollStand): AuswertungsAnsicht {
  const tage = zahlAus(stand.kopf.tage);
  const rho = zahlAus(stand.kopf.rho);
  const blind = zahlAus(stand.kopf.blind);
  const zeilen = stand.zeilen
    .map(z => ({ probe: z.probe?.trim() || '–', medium: z.medium?.trim() || 'ohne Angabe', d: zahlAus(z.d), l: zahlAus(z.l), m0: zahlAus(z.m0), m1: zahlAus(z.m1) }))
    .filter(z => [z.d, z.l, z.m0, z.m1].every(Number.isFinite));
  const unvollstaendig = stand.zeilen.some(z => ['d', 'l', 'm0', 'm1'].some(k => (z[k] ?? '').trim() !== '') && !['d', 'l', 'm0', 'm1'].every(k => Number.isFinite(zahlAus(z[k]))));
  const medien = [...new Set(zeilen.map(z => z.medium))];
  const gruppen: Gruppe[] = medien.map(medium => ({ medium, erg: auslagerung({ proben: zeilen.filter(z => z.medium === medium), tage, rho, blind }) }));
  const gesamt = auslagerung({ proben: zeilen, tage, rho, blind });
  const gueltige = gruppen.filter(g => g.erg.gueltig);
  const tex = formatDeTeX;
  const erste = gesamt.gueltig ? gesamt.werte[0] : undefined;
  const z0 = zeilen[0];

  const ergebnisse = gueltige.flatMap(g => [
    { label: `${g.medium}: mittlere Abtragsrate`, wert: `${formatDeZahl(g.erg.mittelVKorr, 1)} µm/a${Number.isFinite(g.erg.sVKorr) ? ` (s = ${formatDeZahl(g.erg.sVKorr, 1)} µm/a, n = ${g.erg.werte.length})` : ` (n = ${g.erg.werte.length})`}` },
    { label: `${g.medium}: Massenverlustrate`, wert: `${formatDeZahl(g.erg.mittelRate, 3)} g/(m²·d)` },
  ]);

  const inhalt = (
    <div className="flex flex-col gap-5">
      <EingabeHinweise hinweise={[...gesamt.hinweise.filter(h => h.stufe === 'fehler' || h.feld !== 'proben'), ...(unvollstaendig ? [{ stufe: 'warnung' as const, text: inhaltJson.werte.unvollständigeZeilenMaßeOder }] : [])]} />
      {gesamt.gueltig && erste && z0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {gueltige.map(g => (
              <Kennwert key={g.medium} label={`${g.medium} (n = ${g.erg.werte.length})`} wert={formatDeZahl(g.erg.mittelVKorr, 1)} einheit="µm/a" />
            ))}
          </div>
          {gueltige.some(g => g.erg.werte.length < 3) && <EingabeHinweise hinweise={[{ stufe: 'warnung', text: inhaltJson.werte.mindestensEinMediumHat }]} />}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[640px]">
              <caption className="text-left text-sm font-bold text-text-main pb-2"><MdText text={inhaltJson.texte.auswertungJeProbe} /></caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>Probe</th><th scope="col" className={th}>Medium</th><th scope="col" className={th}>A in cm²</th>
                  <th scope="col" className={th}>Δm in g</th><th scope="col" className={th}><MdText text={inhaltJson.texte.rInGM} /></th><th scope="col" className={th}>v in µm/a</th><th scope="col" className={th}><MdText text={inhaltJson.texte.abtragInM} /></th>
                </tr>
              </thead>
              <tbody>
                {zeilen.map((z, i) => {
                  const w = gesamt.werte[i];
                  return (
                    <tr key={i}>
                      <th scope="row" className={td}>{z.probe}</th>
                      <td className={`${td} font-sans`}>{z.medium}</td>
                      <td className={td}>{formatDeZahl(w?.flaeche, 2)}</td>
                      <td className={td}>{formatDeZahl(w?.dm, 3)}</td>
                      <td className={td}>{formatDeZahl(w?.rate, 3)}</td>
                      <td className={td}>{formatDeZahl(w?.vKorr, 1)}</td>
                      <td className={td}>{formatDeZahl(w?.abtrag, 2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[480px]">
              <caption className="text-left text-sm font-bold text-text-main pb-2"><MdText text={inhaltJson.texte.mittelwerteJeMedium} /></caption>
              <thead><tr><th scope="col" className={th}>Medium</th><th scope="col" className={th}>n</th><th scope="col" className={th}>v̄ in µm/a</th><th scope="col" className={th}>s in µm/a</th><th scope="col" className={th}><MdText text={inhaltJson.texte.rInGM2} /></th></tr></thead>
              <tbody>
                {gueltige.map(g => (
                  <tr key={g.medium}>
                    <th scope="row" className={`${td} font-sans`}>{g.medium}</th>
                    <td className={td}>{formatDeZahl(g.erg.werte.length, 0)}</td>
                    <td className={td}>{formatDeZahl(g.erg.mittelVKorr, 1)}</td>
                    <td className={td}>{formatDeZahl(g.erg.sVKorr, 1)}</td>
                    <td className={td}>{formatDeZahl(g.erg.mittelRate, 3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <FormulaDerivationBox
            live
            title={`Ihr Rechenweg: Probe ${z0.probe}`}
            zielGleichung="v_{korr} = \frac{\Delta m}{\rho \cdot A} \cdot 10^4 \cdot \frac{365}{t} \quad \left[\tfrac{\mu\text{m}}{\text{a}}\right]"
            schritte={[
              {
                titel: inhaltJson.werte.oberflächeDesStabs,
                erklaerung: inhaltJson.werte.mantelUndZweiStirnflächen,
                formel: `A = \\frac{\\pi \\cdot ${tex(z0.d, 1)} \\cdot ${tex(z0.l, 1)} + 2 \\cdot \\pi \\cdot ${tex(z0.d, 1)}^2/4}{100} = ${tex(erste.flaeche, 2)}\\,\\text{cm}^2`,
              },
              {
                titel: inhaltJson.werte.korrigierterMassenverlust,
                erklaerung: inhaltJson.werte.masseVorherMinusMasse,
                formel: `\\Delta m = ${tex(z0.m0, 3)} - ${tex(z0.m1, 3)} - ${tex(blind, 3)} = ${tex(erste.dm, 3)}\\,\\text{g}`,
              },
              {
                titel: 'Massenverlustrate',
                erklaerung: inhaltJson.werte.bezogenAufFlächeCm,
                formel: `r = \\frac{${tex(erste.dm, 3)}}{${tex(erste.flaeche / 1e4, 5)} \\cdot ${tex(tage, 0)}} = ${tex(erste.rate, 3)}\\,\\tfrac{\\text{g}}{\\text{m}^2 \\cdot \\text{d}}`,
              },
              {
                titel: 'Abtragsrate',
                erklaerung: inhaltJson.werte.volumenverlustJeFlächeErgibt,
                formel: `v_{korr} = \\frac{${tex(erste.dm, 3)}}{${tex(rho, 2)} \\cdot ${tex(erste.flaeche, 2)}} \\cdot 10^4 \\cdot \\frac{365}{${tex(tage, 0)}} = ${tex(erste.vKorr, 1)}\\,\\tfrac{\\mu\\text{m}}{\\text{a}}`,
              },
            ]}
            ergebnisHinweis={inhaltJson.werte.gleichwertigZurFormK}
            normQuelle={inhaltJson.werte.auswertungNachAstmG1}
          />
        </>
      )}
    </div>
  );
  const kz = gueltige.length
    ? gueltige.map(g => kurzzeile(`${g.medium}: ${ansageWert('mittlere Abtragsrate', g.erg.mittelVKorr, 1, 'µm/a')}`, ansageWert('Massenverlustrate', g.erg.mittelRate, 3, 'g/(m²·d)'))).join('; ')
    : 'mittlere Abtragsrate –';
  return { inhalt, ergebnisse, kurzzeile: kz };
}

export default function Auslagerung() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Clock className="w-5 h-5 text-shiraz" aria-hidden="true" /><MdText text={inhaltJson.texte.versuchsHandout4Wochen} /></h2>
          <p className="text-xs text-text-main/70 font-mono mt-1"><MdText text={inhaltJson.texte.massenverlustUndAbtragsrateVon} /></p>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhaltJson.texte.derAuslagerungsversuchErgänztDie} /></p>
        <VersuchsHandout daten={AUSLAGERUNG_HANDOUT} auswertung={auswerten} />
        <Querverweis ziel="labor_potentialmessung" titel={inhaltJson.werte.parallelerVersuch} linkText={inhaltJson.werte.zumHandoutPotentialmessung}>
          <p><MdText text={inhaltJson.texte.probenAusDerselbenCharge} /></p>
        </Querverweis>
      </div>

      <ModulTest moduleId="labor_auslagerung" />

      <ModuleFooter
        lastReviewed={inhaltJson.werte.oktober2026Ap6}
        wikipedia={[
          { title: 'Korrosion', url: 'https://de.wikipedia.org/wiki/Korrosion' },
          { title: 'Lochfraßkorrosion', url: 'https://de.wikipedia.org/wiki/Lochfra%C3%9Fkorrosion' },
        ]}
        literatur={inhaltJson.daten["Auslagerung.literatur"]}
        regelwerke={inhaltJson.daten["Auslagerung.regelwerke"]}
        formeln={inhaltJson.daten["Auslagerung.formeln"]}
      />
    </div>
  );
}
