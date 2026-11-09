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
import inhaltJson from '@/content/laborhandouts/DruckfestigkeitWuerfel.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

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
    { label: inhaltJson.werte.mittelwertFCmWürfel, wert: `${formatDeZahl(erg.fcm, 1)} MPa (n = ${erg.werte.length}, s = ${formatDeZahl(erg.s, 1)} MPa)` },
    { label: inhaltJson.werte.kleinsterEinzelwertFCi, wert: `${formatDeZahl(erg.fmin, 1)} MPa` },
    { label: inhaltJson.werte.erreichteKlasseLehrvereinfachung, wert: erg.erreicht },
    ...(erg.ziel ? [{ label: `Zielklasse ${erg.ziel.name}`, wert: erg.ziel.krit1 && erg.ziel.krit2 ? inhaltJson.werte.kriterienErfüllt : inhaltJson.werte.kriterienNichtErfüllt }] : []),
  ] : [];

  const inhalt = (
    <div className="flex flex-col gap-5">
      <EingabeHinweise hinweise={erg.hinweise} />
      {erg.gueltig && w0 && e0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kennwert label={inhaltJson.werte.fCmWürfel} wert={formatDeZahl(erg.fcm, 1)} einheit="MPa" />
            <Kennwert label="f_ci,min" wert={formatDeZahl(erg.fmin, 1)} einheit="MPa" />
            <Kennwert label={inhaltJson.werte.standardabweichungS} wert={formatDeZahl(erg.s, 1)} einheit="MPa" />
            <Kennwert label={inhaltJson.werte.erreichteKlasse} wert={erg.erreicht} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[520px]">
              <caption className="text-left text-sm font-bold text-text-main pb-2"><MdText text={inhaltJson.texte.ergebnisseJeWürfel} /></caption>
              <thead><tr><th scope="col" className={th}>Würfel</th><th scope="col" className={th}>A_c in mm²</th><th scope="col" className={th}>f_c in MPa</th><th scope="col" className={th}><MdText text={inhaltJson.texte.fCCubeIn} /></th><th scope="col" className={th}><MdText text={inhaltJson.texte.rohdichteInKgM} /></th></tr></thead>
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
                Zielklasse <strong>{erg.ziel.name}</strong><MdText text={inhaltJson.texte.fCkCube} />{formatDeZahl(erg.ziel.cube, 0)}<MdText text={inhaltJson.texte.mpaKriterium1F} />{formatDeZahl(erg.ziel.cube + 4, 0)} MPa {erg.ziel.krit1 ? 'erfüllt' : inhaltJson.werte.nichtErfüllt}<MdText text={inhaltJson.texte.kriterium2FCi} />{formatDeZahl(erg.ziel.cube - 4, 0)} MPa {erg.ziel.krit2 ? 'erfüllt' : inhaltJson.werte.nichtErfüllt2}.
              </p>
              <p className="text-[11px] text-text-main/70 mt-1.5"><MdText text={inhaltJson.texte.lehrvereinfachungNachDenKriterien} /></p>
            </div>
          )}
          <FormulaDerivationBox
            live
            title={`Ihr Rechenweg: Würfel ${w0.nr} und Klasse`}
            zielGleichung="f_c = \frac{F}{A_c}, \qquad f_{cm} \ge f_{ck,cube} + 4, \quad f_{ci} \ge f_{ck,cube} - 4"
            schritte={[
              {
                titel: 'Druckfläche',
                erklaerung: inhaltJson.werte.gemesseneKantenlängenStattNennmaß,
                formel: `A_c = ${tex(w0.a, 1)} \\cdot ${tex(w0.b, 1)} = ${tex(e0.flaeche, 0)}\\,\\text{mm}^2`,
              },
              {
                titel: 'Druckfestigkeit',
                erklaerung: inhaltJson.werte.höchstkraftInNDurch,
                formel: `f_c = \\frac{${tex(w0.F, 1)} \\cdot 1000}{${tex(e0.flaeche, 0)}} = ${tex(e0.fc, 1)}\\,\\text{MPa}`,
              },
              {
                titel: 'Lagerung',
                erklaerung: trocken ? inhaltJson.werte.trockenlagerungUmrechnungAufWasserlageru : inhaltJson.werte.wasserlagerungReferenzKeineUmrechnung,
                formel: trocken ? `f_{c,cube} = ${tex(erg.faktor, 2)} \\cdot ${tex(e0.fc, 1)} = ${tex(e0.fcCube, 1)}\\,\\text{MPa}` : `f_{c,cube} = f_c = ${tex(e0.fcCube, 1)}\\,\\text{MPa}`,
              },
              {
                titel: inhaltJson.werte.mittelwertUndKleinsterWert,
                erklaerung: `${erg.werte.length} Würfel:`,
                formel: `f_{cm} = ${tex(erg.fcm, 1)}\\,\\text{MPa}, \\quad f_{ci,min} = ${tex(erg.fmin, 1)}\\,\\text{MPa}`,
              },
              {
                titel: inhaltJson.werte.klassenzuordnungLehrvereinfachung,
                erklaerung: inhaltJson.werte.höchsteKlasseDerenBeide,
                formel: `\\text{${erg.erreicht}}${erg.ziel ? `, \\quad \\text{Ziel ${erg.ziel.name}: } ${tex(erg.fcm, 1)} ${erg.ziel.krit1 ? '\\ge' : '<'} ${tex(erg.ziel.cube + 4, 0)}, \\; ${tex(erg.fmin, 1)} ${erg.ziel.krit2 ? '\\ge' : '<'} ${tex(erg.ziel.cube - 4, 0)}` : ''}`,
              },
            ]}
            ergebnisHinweis={inhaltJson.werte.fürDieKonformitätEiner}
            normQuelle={inhaltJson.werte.dinEn123903}
          />
        </>
      )}
    </div>
  );
  const kz = erg.gueltig
    ? kurzzeile(ansageWert('f_cm,Würfel', erg.fcm, 1, 'MPa'), ansageWert('f_ci,min', erg.fmin, 1, 'MPa'), `Klasse ${erg.erreicht}`,
      erg.ziel && `Zielklasse ${erg.ziel.name} ${erg.ziel.krit1 && erg.ziel.krit2 ? inhaltJson.werte.kriterienErfüllt : inhaltJson.werte.kriterienNichtErfüllt}`)
    : 'f_cm,Würfel –';
  return { inhalt, ergebnisse, kurzzeile: kz };
}

export default function DruckfestigkeitWuerfel() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Box className="w-5 h-5 text-shiraz" aria-hidden="true" /><MdText text={inhaltJson.texte.versuchsHandoutDruckfestigkeitAn} /></h2>
          <p className="text-xs text-text-main/70 font-mono mt-1"><MdText text={inhaltJson.texte.prüfungNachDinEn} /></p>
        </div>
        <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhaltJson.texte.dieWürfeldruckfestigkeitIstDer} /></p>
        <VersuchsHandout daten={DRUCK_HANDOUT} auswertung={auswerten} />
        <Querverweis ebene={3} ziel="festbeton_statistik" titel={inhaltJson.werte.konformitätEinerProduktion} linkText={inhaltJson.werte.zumModulFestbetonStatistik}>
          <p><MdText text={inhaltJson.texte.dieKriterien1Und} /></p>
        </Querverweis>
      </div>

      <ModulTest moduleId="labor_druckfestigkeit" />

      <ModuleFooter
        lastReviewed={inhaltJson.werte.oktober2026Ap6}
        wikipedia={[
          { title: 'Druckfestigkeit', url: 'https://de.wikipedia.org/wiki/Druckfestigkeit' },
          { title: inhaltJson.werte.festigkeitsklasseBeton, url: 'https://de.wikipedia.org/wiki/Beton#Festigkeitsklassen' },
        ]}
        literatur={inhaltJson.daten["DruckfestigkeitWuerfel.literatur"]}
        regelwerke={[
          'DIN_EN_12390_2',
          'DIN_EN_12390_3',
          'DIN_EN_206',
        ]}
        formeln={inhaltJson.daten["DruckfestigkeitWuerfel.formeln"]}
      />
    </div>
  );
}
