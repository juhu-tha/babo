import React from 'react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Calculator } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/mischungsberechnunganleitung/MischungsberechnungAnleitung.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function MischungsberechnungAnleitung() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2 mb-4">
          <Calculator className="text-shiraz" /><MdText text={inhalt.texte.schrittFürSchrittAnleitung} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-8">
          <p><MdText text={inhalt.texte.dieBerechnungEinerBetonmischung} /></p>
        </div>

        <div className="space-y-8">
          {/* Schritt 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-text-main mb-2"><MdText text={inhalt.texte.anforderungenFestlegen} /></h3>
              <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
                <p className="mb-2"><MdText text={inhalt.texte.zunächstMüssenDieAnforderungen} /></p>
                <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1 ml-2">
                  <li><MdText text={inhalt.texte.expositionsklassenZBXc4} /></li>
                  <li><MdText text={inhalt.texte.druckfestigkeitsklasseZBC25} /></li>
                  <li><MdText text={inhalt.texte.konsistenzklasseZBF3} /></li>
                  <li><MdText text={inhalt.texte.größtkornZB16} /></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Schritt 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              2
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main mb-2"><MdText text={inhalt.texte.wasseranspruchAbschätzen} /></h3>
              <p className="text-text-main/80 mb-2"><MdText text={inhalt.texte.derWasseranspruchHängtMaßgeblich} /></p>
              <div className="bg-off-white p-4 rounded-lg border border-home-grau/30 text-sm text-text-main/80">
                <p className="mb-2"><MdText text={inhalt.texte.faustwerteFürKonsistenzF3} /></p>
                <ul className="list-disc list-inside ml-2">
                  <li><MdText text={inhalt.texte.größtkorn8MmCa} /></li>
                  <li><MdText text={inhalt.texte.größtkorn16MmCa} /></li>
                  <li><MdText text={inhalt.texte.größtkorn32MmCa} /></li>
                </ul>
                <p className="mt-2 text-xs italic"><MdText text={inhalt.texte.zusatzmittelZBFließmittel} /></p>
        </div>
            </div>
          </div>

          {/* Schritt 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              3
            </div>
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.zementgehaltBerechnen} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.derZementgehaltZWird} /></p>
              <div className="bg-off-white p-4 rounded-lg border border-home-grau/30 text-center font-mono text-shiraz mb-2">
                <FormulaText text="z = \frac{w}{(w/z)_{max}}" />
              </div>
              <p className="text-sm text-text-main/70"><MdText text={inhalt.texte.wichtigDerBerechneteWert} /></p>
        </div>
          </div>

          {/* Schritt 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              4
            </div>
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.stoffraumrechnungVolumenbilanz} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieSummeDerVolumina} /></p>
              <div className="bg-off-white p-4 rounded-lg border border-home-grau/30 text-center font-mono text-shiraz mb-2">
                <FormulaText text="V_{Zement} + V_{Wasser} + V_{Zusatzstoffe} + V_{Luft} + V_{Gestein} = 1000 \text{ Liter}" />
              </div>
              <p className="text-sm text-text-main/70 mb-2"><MdText text={inhalt.texte.daZementWasserUnd} /></p>
              <div className="bg-off-white p-4 rounded-lg border border-home-grau/30 text-center font-mono text-shiraz">
                <FormulaText text={inhalt.werte.vGestein1000V} />
              </div>
            </div>
          </div>

          {/* Schritt 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              5
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main mb-2"><MdText text={inhalt.texte.masseDerGesteinskörnungBerechnen} /></h3>
              <p className="text-text-main/80 mb-2"><MdText text={inhalt.texte.ausDemBerechnetenVolumen} /></p>
              <div className="bg-off-white p-4 rounded-lg border border-home-grau/30 text-center font-mono text-shiraz mb-2">
                <FormulaText text="m_{Gestein, trocken} = V_{Gestein} \cdot \rho_{Gestein}" />
              </div>
              <p className="text-sm text-text-main/70"><MdText text={inhalt.texte.dieseGesamtmasseWirdDann} /></p>
        </div>
          </div>

          {/* Schritt 6 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              6
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main mb-2">Feuchtekorrektur</h3>
              <p className="text-text-main/80 mb-2"><MdText text={inhalt.texte.inDerPraxisIst} /></p>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1 ml-2">
                <li><MdText text={inhalt.texte.einwaageGesteinFeucht} /><FormulaText text="m_{feucht} = m_{trocken} \cdot (1 + \frac{Feuchte [\%]}{100})" /></li>
                <li><strong>Zugabewasser:</strong> <FormulaText text="w_{Zugabe} = w_{gesamt} - \sum Wasser_{Gestein}" /></li>
              </ul>
            </div>
          </div>
          {/* Schritt 7 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-shiraz/10 flex items-center justify-center text-shiraz font-bold text-xl">
              7
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main mb-2"><MdText text={inhalt.texte.mehlkorngehaltÜberprüfen} /></h3>
              <p className="text-text-main/80 mb-2"><MdText text={inhalt.texte.derMehlkorngehaltAlleStoffe} /></p>
              <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1 ml-2">
                <li><MdText text={inhalt.texte.einZuNiedrigerMehlkorngehalt} /></li>
                <li><MdText text={inhalt.texte.einZuHoherMehlkorngehalt} /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Wasserzementwert', url: 'https://de.wikipedia.org/wiki/Wasserzementwert' },
          { title: 'Sieblinie', url: 'https://de.wikipedia.org/wiki/Sieblinie' }
        ]}
        literatur={inhalt.daten["MischungsberechnungAnleitung.literatur"]}
        regelwerke={inhalt.daten["MischungsberechnungAnleitung.regelwerke"]}
        formeln={inhalt.daten["MischungsberechnungAnleitung.formeln"]}
      />
    </div>
  );
}
