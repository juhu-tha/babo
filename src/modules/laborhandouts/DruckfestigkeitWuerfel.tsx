import React from 'react';
import { Box } from 'lucide-react';
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import { zahlAus } from '@/src/utils/handoutExport';
import { druckpruefung } from '@/src/calc/laborversuche';
import { VersuchsHandout, Kennwert, type AuswertungsAnsicht } from '@/src/components/handout/VersuchsHandout';
import type { ProtokollStand } from '@/src/components/handout/handoutTypen';
import { DRUCK_HANDOUT } from '@/src/data/laborhandouts/druckfestigkeit';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

const th = 'p-2 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2 text-xs text-text-main/85 border-b border-home-grau/15 font-mono';

function auswerten(stand: ProtokollStand): AuswertungsAnsicht {
  const trocken = stand.kopf.lagerung === 'trocken';
  const ziel = stand.kopf.ziel ?? '';
  const zeilen = stand.zeilen
    .map(z => ({ nr: z.nr?.trim() || '–', a: zahlAus(z.a), b: zahlAus(z.b), h: zahlAus(z.h), m: zahlAus(z.m), F: zahlAus(z.F) }))
    .filter(w => Number.isFinite(w.a) && Number.isFinite(w.b) && Number.isFinite(w.F));
  const erg = druckpruefung({ wuerfel: zeilen, trocken, zielklasse: ziel });
  const tex = formatDeTeX;
  const w0 = zeilen[0];
  const e0 = erg.werte[0];

  const ergebnisse = erg.gueltig ? [
    { label: 'Lagerung', wert: trocken ? `Trockenlagerung, umgerechnet mit Faktor ${formatDeZahl(erg.faktor, 2)}` : 'Wasserlagerung' },
    { label: 'Mittelwert f_cm (Würfel)', wert: `${formatDeZahl(erg.fcm, 1)} MPa (n = ${erg.werte.length}, s = ${formatDeZahl(erg.s, 1)} MPa)` },
    { label: 'kleinster Einzelwert f_ci', wert: `${formatDeZahl(erg.fmin, 1)} MPa` },
    { label: 'erreichte Klasse (Lehrvereinfachung)', wert: erg.erreicht },
    ...(erg.ziel ? [{ label: `Zielklasse ${erg.ziel.name}`, wert: erg.ziel.krit1 && erg.ziel.krit2 ? 'Kriterien erfüllt' : 'Kriterien nicht erfüllt' }] : []),
  ] : [];

  const inhalt = (
    <div className="flex flex-col gap-5">
      <EingabeHinweise hinweise={erg.hinweise} />
      {erg.gueltig && w0 && e0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kennwert label="f_cm (Würfel)" wert={formatDeZahl(erg.fcm, 1)} einheit="MPa" />
            <Kennwert label="f_ci,min" wert={formatDeZahl(erg.fmin, 1)} einheit="MPa" />
            <Kennwert label="Standardabweichung s" wert={formatDeZahl(erg.s, 1)} einheit="MPa" />
            <Kennwert label="erreichte Klasse" wert={erg.erreicht} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[520px]">
              <caption className="text-left text-sm font-bold text-text-main pb-2">Ergebnisse je Würfel</caption>
              <thead><tr><th scope="col" className={th}>Würfel</th><th scope="col" className={th}>A_c in mm²</th><th scope="col" className={th}>f_c in MPa</th><th scope="col" className={th}>f_c,cube in MPa</th><th scope="col" className={th}>Rohdichte in kg/m³</th></tr></thead>
              <tbody>
                {erg.werte.map((w, i) => (
                  <tr key={i}>
                    <th scope="row" className={td}>{zeilen[i].nr}</th>
                    <td className={td}>{formatDeZahl(w.flaeche, 0)}</td>
                    <td className={td}>{formatDeZahl(w.fc, 1)}</td>
                    <td className={td}>{formatDeZahl(w.fcCube, 1)}</td>
                    <td className={td}>{formatDeZahl(w.rohdichte, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {erg.ziel && (
            <div className={`p-4 rounded-xl border text-sm leading-relaxed ${erg.ziel.krit1 && erg.ziel.krit2 ? 'border-emerald-300 bg-emerald-50' : 'border-rose-300 bg-rose-50'}`}>
              <p>
                Zielklasse <strong>{erg.ziel.name}</strong> (f_ck,cube = {formatDeZahl(erg.ziel.cube, 0)} MPa):
                {' '}Kriterium 1 f_cm ≥ {formatDeZahl(erg.ziel.cube + 4, 0)} MPa {erg.ziel.krit1 ? 'erfüllt' : 'nicht erfüllt'},
                {' '}Kriterium 2 f_ci ≥ {formatDeZahl(erg.ziel.cube - 4, 0)} MPa {erg.ziel.krit2 ? 'erfüllt' : 'nicht erfüllt'}.
              </p>
              <p className="text-[11px] text-text-main/70 mt-1.5">Lehrvereinfachung nach den Kriterien für die Erstherstellung (n = 3) der DIN EN 206 / DIN 1045-2 – keine Konformitätsbewertung einer Produktion.</p>
            </div>
          )}
          <FormulaDerivationBox
            live
            title={`Ihr Rechenweg: Würfel ${w0.nr} und Klasse`}
            zielGleichung="f_c = \frac{F}{A_c}, \qquad f_{cm} \ge f_{ck,cube} + 4, \quad f_{ci} \ge f_{ck,cube} - 4"
            schritte={[
              {
                titel: 'Druckfläche',
                erklaerung: 'Gemessene Kantenlängen statt Nennmaß:',
                formel: `A_c = ${tex(w0.a, 1)} \\cdot ${tex(w0.b, 1)} = ${tex(e0.flaeche, 0)}\\,\\text{mm}^2`,
              },
              {
                titel: 'Druckfestigkeit',
                erklaerung: 'Höchstkraft in N durch die Fläche, auf 0,1 MPa gerundet:',
                formel: `f_c = \\frac{${tex(w0.F, 1)} \\cdot 1000}{${tex(e0.flaeche, 0)}} = ${tex(e0.fc, 1)}\\,\\text{MPa}`,
              },
              {
                titel: 'Lagerung',
                erklaerung: trocken ? 'Trockenlagerung → Umrechnung auf Wasserlagerung:' : 'Wasserlagerung (Referenz), keine Umrechnung:',
                formel: trocken ? `f_{c,cube} = ${tex(erg.faktor, 2)} \\cdot ${tex(e0.fc, 1)} = ${tex(e0.fcCube, 1)}\\,\\text{MPa}` : `f_{c,cube} = f_c = ${tex(e0.fcCube, 1)}\\,\\text{MPa}`,
              },
              {
                titel: 'Mittelwert und kleinster Wert',
                erklaerung: `${erg.werte.length} Würfel:`,
                formel: `f_{cm} = ${tex(erg.fcm, 1)}\\,\\text{MPa}, \\quad f_{ci,min} = ${tex(erg.fmin, 1)}\\,\\text{MPa}`,
              },
              {
                titel: 'Klassenzuordnung (Lehrvereinfachung)',
                erklaerung: 'Höchste Klasse, deren beide Kriterien erfüllt sind:',
                formel: `\\text{${erg.erreicht}}${erg.ziel ? `, \\quad \\text{Ziel ${erg.ziel.name}: } ${tex(erg.fcm, 1)} ${erg.ziel.krit1 ? '\\ge' : '<'} ${tex(erg.ziel.cube + 4, 0)}, \\; ${tex(erg.fmin, 1)} ${erg.ziel.krit2 ? '\\ge' : '<'} ${tex(erg.ziel.cube - 4, 0)}` : ''}`,
              },
            ]}
            ergebnisHinweis="Für die Konformität einer laufenden Produktion gelten andere Kriterien (u. a. mit Standardabweichung und mindestens 15 Ergebnissen)."
            normQuelle="DIN EN 12390-3:2019-10; Umrechnung nach DIN EN 12390-2:2019-10, nationaler Anhang; Kriterien nach DIN EN 206 / DIN 1045-2 (vereinfacht)"
          />
        </>
      )}
    </div>
  );
  return { inhalt, ergebnisse };
}

export default function DruckfestigkeitWuerfel() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Box className="w-5 h-5 text-shiraz" aria-hidden="true" /> Versuchs-Handout: Druckfestigkeit an Würfeln
          </h2>
          <p className="text-xs text-text-main/70 font-mono mt-1">
            Prüfung nach DIN EN 12390-3, Umrechnung der Lagerung, vereinfachte Klassenzuordnung nach DIN EN 206 / DIN 1045-2
          </p>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed">
          Die Würfeldruckfestigkeit ist der wichtigste Kennwert des Festbetons. Der Versuch verbindet die Herstellung der Probekörper mit der Prüfung und einer ersten Einordnung in die Festigkeitsklassen – die eigentliche Konformitätskontrolle bleibt dem Modul Festbeton (Statistik) vorbehalten.
        </p>
        <VersuchsHandout daten={DRUCK_HANDOUT} auswertung={auswerten} />
        <Querverweis ziel="festbeton_statistik" titel="Konformität einer Produktion" linkText="Zum Modul Festbeton (Statistik)">
          <p>Die Kriterien 1 und 2 für Erst- und Dauerproduktion mit Standardabweichung behandelt das Modul Festbeton (Statistik).</p>
        </Querverweis>
      </div>

      <ModulTest moduleId="labor_druckfestigkeit" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 6.4: Handout neu erstellt; Pilot im Labor und fachliche Freigabe ausstehend)"
        wikipedia={[
          { title: 'Druckfestigkeit', url: 'https://de.wikipedia.org/wiki/Druckfestigkeit' },
          { title: 'Festigkeitsklasse (Beton)', url: 'https://de.wikipedia.org/wiki/Festigkeitsklasse_(Beton)' },
        ]}
        literatur={[
          'Verein Deutscher Zementwerke (Hrsg.): Zement-Taschenbuch. Düsseldorf: Verlag Bau+Technik (jeweils aktuelle Ausgabe)',
          'Neville, A. M.: Properties of Concrete. 5. Aufl. Harlow: Pearson 2011',
        ]}
        regelwerke={[
          'DIN_EN_12390_2',
          'DIN_EN_12390_3',
          'DIN_EN_206',
        ]}
        formeln={[
          { formel: 'f_c = F / A_c', erklaerung: 'Druckfestigkeit, auf 0,1 MPa gerundet.', quelle: 'DIN EN 12390-3:2019-10' },
          { formel: 'f_{c,cube} = 0{,}92 \\cdot f_{c,dry}', erklaerung: 'Umrechnung trocken gelagerter Würfel auf Wasserlagerung (Normalbeton bis C50/60; darüber 0,95).' },
          { formel: 'f_{cm} \\ge f_{ck} + 4, \\; f_{ci} \\ge f_{ck} - 4', erklaerung: 'Kriterien für die Erstherstellung (n = 3), hier als Lehrvereinfachung.', quelle: 'DIN EN 206' },
        ]}
      />
    </div>
  );
}
