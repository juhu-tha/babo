import React from 'react';
import { Layers, Droplets, ArrowDownToLine, MoveHorizontal } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';

export default function SVB() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Droplets className="text-shiraz" /> Selbstverdichtender Beton (SVB)
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Selbstverdichtender Beton (SVB, engl. SCC - Self Compacting Concrete) fließt und entlüftet allein unter dem Einfluss der Schwerkraft. 
            Er füllt komplexe Schalungen und enge Bewehrungsabstände vollständig aus, ohne dass zusätzliche dynamische Verdichtungsenergie (Rütteln) erforderlich ist.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" size={20} /> Prinzip der SVB-Mischung
          </h3>
          <p className="text-sm text-text-main/80">
            Damit der Beton nicht entmischt (Sedimentation der groben Körnung), aber dennoch extrem fließfähig ist, bedarf es einer genauen Abstimmung der Mischung:
          </p>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
            <li><strong>Hoher Mehlkorngehalt:</strong> Erhöhte Zugabe von Zement, Flugasche oder Kalksteinmehl zur Stabilisierung.</li>
            <li><strong>Leistungsstarke Fließmittel (FM):</strong> Polycarboxylatether (PCE) zur drastischen Viskositätsreduktion.</li>
            <li><strong>Angepasste Gesteinskörnung:</strong> Geringerer Größtkornanteil (meist <FormulaText text="D_{max}" /> 16 mm).</li>
            <li><strong>Ggf. Stabilisierer (ST):</strong> Um Bluten und Entmischen weiter zu reduzieren.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <MoveHorizontal className="text-shiraz" size={20} /> Prüfverfahren (Frischbeton)
          </h3>
          <p className="text-sm text-text-main/80">
            Anstelle des Ausbreitmaßes für Normalbeton, werden spezielle Methoden genutzt, um das Fließverhalten und die Blockierneigung zu prüfen:
          </p>
          <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
            <li><strong>Setzfließmaß (DIN EN 12350-8):</strong> Klassen nach DIN EN 206: SF1 550–650 mm, SF2 660–750 mm, SF3 760–850 mm. Misst die Fließfähigkeit ohne Hindernisse.</li>
            <li><strong>V-Trichter-Versuch (DIN EN 12350-9):</strong> Misst die Auslaufzeit und kennzeichnet die Viskosität.</li>
            <li><strong>Blockierring / L-Kasten (DIN EN 12350-12 / -10):</strong> Prüfen die Blockierneigung beim Fließen durch enge Bewehrung.</li>
          </ul>
        </div>
      </div>

      <div className="bg-off-white p-6 rounded-2xl border border-home-grau/30 flex gap-4 items-start">
        <ArrowDownToLine className="shrink-0 mt-1 text-shiraz" />
        <div>
          <h4 className="font-bold text-text-main mb-2">Einsatzgebiete und Vorteile</h4>
          <p className="text-sm text-text-main/80 leading-relaxed">
            Häufig eingesetzt bei sehr filigranen Sichtbetonbauteilen, extrem dichten Bewehrungsgraden oder dort, wo konventionelles Rütteln (Lärmschutzmaßnahme oder Erreichbarkeit) nicht möglich ist. Der Verzicht auf eine manuelle Verdichtung reduziert Baustellenlärm und vermindert Personalkosten, erfordert aber höchste Präzision in der Werkstatt- und Baustellenlogistik.
          </p>
        </div>
      </div>

            
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm">
        <h3 className="font-bold text-text-main mb-4">Typische Mischungszusammensetzung (pro m³, Lehrbeispiel)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[300px]">
            <thead>
              <tr className="border-b-2 border-home-grau/30 bg-off-white">
                <th className="py-2.5 px-3 text-sm font-semibold text-text-main">Komponente</th>
                <th className="py-2.5 px-3 text-sm font-semibold text-text-main text-right">Menge</th>
              </tr>
            </thead>
            <tbody>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zement (z.B. CEM I 42,5 R)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 380 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Zusatzstoff (z.B. Kalksteinmehl oder Flugasche)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 180 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Wasser (w/z ≈ 0,45; Wasser/Bindemittel ≈ 0,30)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 170 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Gesteinskörnung (optimierte Sieblinie)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">~ 1650 kg</td>
                </tr>
                <tr className="border-b border-home-grau/10 last:border-0 hover:bg-off-white transition-colors">
                  <td className="py-2 px-3 text-sm text-text-main font-medium">Hochleistungsfließmittel (PCE)</td>
                  <td className="py-2 px-3 text-sm text-text-main/70 text-right">hohe Dosierung (~ 1,5 - 2 % v. Z.)</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
