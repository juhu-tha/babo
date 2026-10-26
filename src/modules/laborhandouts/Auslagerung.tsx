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
      <EingabeHinweise hinweise={[...gesamt.hinweise.filter(h => h.stufe === 'fehler' || h.feld !== 'proben'), ...(unvollstaendig ? [{ stufe: 'warnung' as const, text: 'Unvollständige Zeilen (Maße oder Massen fehlen) werden nicht ausgewertet.' }] : [])]} />
      {gesamt.gueltig && erste && z0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {gueltige.map(g => (
              <Kennwert key={g.medium} label={`${g.medium} (n = ${g.erg.werte.length})`} wert={formatDeZahl(g.erg.mittelVKorr, 1)} einheit="µm/a" />
            ))}
          </div>
          {gueltige.some(g => g.erg.werte.length < 3) && <EingabeHinweise hinweise={[{ stufe: 'warnung', text: 'Mindestens ein Medium hat weniger als drei Parallelproben – keine belastbare Streuungsangabe.' }]} />}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[640px]">
              <caption className="text-left text-sm font-bold text-text-main pb-2">Auswertung je Probe</caption>
              <thead>
                <tr>
                  <th scope="col" className={th}>Probe</th><th scope="col" className={th}>Medium</th><th scope="col" className={th}>A in cm²</th>
                  <th scope="col" className={th}>Δm in g</th><th scope="col" className={th}>r in g/(m²·d)</th><th scope="col" className={th}>v in µm/a</th><th scope="col" className={th}>Abtrag in µm</th>
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
              <caption className="text-left text-sm font-bold text-text-main pb-2">Mittelwerte je Medium</caption>
              <thead><tr><th scope="col" className={th}>Medium</th><th scope="col" className={th}>n</th><th scope="col" className={th}>v̄ in µm/a</th><th scope="col" className={th}>s in µm/a</th><th scope="col" className={th}>r̄ in g/(m²·d)</th></tr></thead>
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
                titel: 'Oberfläche des Stabs',
                erklaerung: 'Mantel und zwei Stirnflächen, Umrechnung mm² → cm²:',
                formel: `A = \\frac{\\pi \\cdot ${tex(z0.d, 1)} \\cdot ${tex(z0.l, 1)} + 2 \\cdot \\pi \\cdot ${tex(z0.d, 1)}^2/4}{100} = ${tex(erste.flaeche, 2)}\\,\\text{cm}^2`,
              },
              {
                titel: 'Korrigierter Massenverlust',
                erklaerung: 'Masse vorher minus Masse nach dem Beizen minus Blindwert:',
                formel: `\\Delta m = ${tex(z0.m0, 3)} - ${tex(z0.m1, 3)} - ${tex(blind, 3)} = ${tex(erste.dm, 3)}\\,\\text{g}`,
              },
              {
                titel: 'Massenverlustrate',
                erklaerung: 'Bezogen auf Fläche (cm² → m²) und Dauer:',
                formel: `r = \\frac{${tex(erste.dm, 3)}}{${tex(erste.flaeche / 1e4, 5)} \\cdot ${tex(tage, 0)}} = ${tex(erste.rate, 3)}\\,\\tfrac{\\text{g}}{\\text{m}^2 \\cdot \\text{d}}`,
              },
              {
                titel: 'Abtragsrate',
                erklaerung: 'Volumenverlust je Fläche ergibt die Dicke (cm → µm), hochgerechnet auf ein Jahr:',
                formel: `v_{korr} = \\frac{${tex(erste.dm, 3)}}{${tex(rho, 2)} \\cdot ${tex(erste.flaeche, 2)}} \\cdot 10^4 \\cdot \\frac{365}{${tex(tage, 0)}} = ${tex(erste.vKorr, 1)}\\,\\tfrac{\\mu\\text{m}}{\\text{a}}`,
              },
            ]}
            ergebnisHinweis="Gleichwertig zur Form K · Δm/(A · t · ρ) mit K = 8,76 · 10⁷ für µm/a, t in Stunden. Die Rate setzt gleichmäßigen Abtrag voraus."
            normQuelle="Auswertung nach ASTM G1/G31 (Leitfaden); Beizen nach DIN EN ISO 8407:2025-08"
          />
        </>
      )}
    </div>
  );
  return { inhalt, ergebnisse };
}

export default function Auslagerung() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Clock className="w-5 h-5 text-shiraz" aria-hidden="true" /> Versuchs-Handout: 4-Wochen-Auslagerungsversuch
          </h2>
          <p className="text-xs text-text-main/70 font-mono mt-1">
            Massenverlust und Abtragsrate von Betonstahl in alkalischen und chloridhaltigen Medien – Gravimetrie mit Blindprobe
          </p>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed">
          Der Auslagerungsversuch ergänzt die Potentialmessung: Das Potential zeigt, <em>ob</em> der Stahl aktiv korrodiert, der Massenverlust zeigt, <em>wie viel</em> Metall verloren geht. Die Werte sind Vergleichswerte für die gewählten Medien und lassen sich nicht unmittelbar auf Stahl im Beton übertragen.
        </p>
        <VersuchsHandout daten={AUSLAGERUNG_HANDOUT} auswertung={auswerten} />
        <Querverweis ziel="labor_potentialmessung" titel="Paralleler Versuch" linkText="Zum Handout Potentialmessung">
          <p>Proben aus derselben Charge eignen sich für die Potentialmessung mit schrittweiser NaCl-Zugabe – so lassen sich Potentialabfall und Massenverlust vergleichen.</p>
        </Querverweis>
      </div>

      <ModulTest moduleId="labor_auslagerung" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 6.4: Handout neu erstellt; Pilot im Labor und fachliche Freigabe ausstehend)"
        wikipedia={[
          { title: 'Korrosion', url: 'https://de.wikipedia.org/wiki/Korrosion' },
          { title: 'Lochfraßkorrosion', url: 'https://de.wikipedia.org/wiki/Lochfra%C3%9Fkorrosion' },
        ]}
        literatur={[
          'Kaesche, H.: Die Korrosion der Metalle. 3. Aufl. Berlin: Springer 1990',
          'Raupach, M.; Orlowsky, J.: Erhaltung von Betonbauwerken. Wiesbaden: Vieweg+Teubner 2008',
          'Bertolini, L.; Elsener, B.; Pedeferri, P.; Redaelli, E.; Polder, R.: Corrosion of Steel in Concrete. 2. Aufl. Weinheim: Wiley-VCH 2013',
        ]}
        regelwerke={[
          'DIN_EN_ISO_8407',
          { title: 'ASTM G1 (Standard Practice for Preparing, Cleaning, and Evaluating Corrosion Test Specimens)' },
          { title: 'ASTM G31 (Guide for Laboratory Immersion Corrosion Testing of Metals)' },
          { title: 'DIN EN ISO 8044 (Korrosion von Metallen und Legierungen - Grundbegriffe)' },
        ]}
        formeln={[
          { formel: '\\Delta m = m_0 - m_1 - m_{Blind}', erklaerung: 'Massenverlust durch Korrosion, korrigiert um den Beizabtrag der Blindprobe.' },
          { formel: 'r = \\Delta m / (A \\cdot t)', erklaerung: 'Massenverlustrate in g/(m²·d).' },
          { formel: 'v_{korr} = \\frac{\\Delta m}{\\rho A} \\cdot 10^4 \\cdot \\frac{365}{t}', erklaerung: 'gleichmäßige Abtragsrate in µm/a (A in cm², ρ in g/cm³, t in Tagen).', quelle: 'ASTM G1' },
        ]}
      />
    </div>
  );
}
