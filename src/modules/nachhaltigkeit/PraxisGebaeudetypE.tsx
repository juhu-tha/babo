import { Scale, BookOpen, CheckCircle2 } from 'lucide-react';

export default function PraxisGebaeudetypE() {
  return (
      <div className="space-y-6 animate-in fade-in duration-200">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Forschungsprojekt &bdquo;Einfach Bauen&ldquo; &amp; Das Gebäudetyp-E-Vorhaben
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Befreiung von Komfortnormen zugunsten robuster, bezahlbarer und langlebiger Architektur.</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-rose-50 text-shiraz border border-rose-200">
              Kabinettsbeschluss Nov. 2024
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left: Das juristische Problem und das Gebäudetyp-E-Vorhaben */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Scale size={14} className="text-shiraz" />
                Der angestrebte juristische Paradigmenwechsel
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Bislang galt im deutschen Bauvertragsrecht (&sect; 633 BGB) die strikte Vermutung, dass jede Abweichung von den <strong>&bdquo;anerkannten Regeln der Technik&ldquo; (aRdT)</strong> einen Sachmangel begründet. Da DIN-Normen zunehmend reine Komfort- und Ausstattungsansprüche festschreiben (z.B. Schallschutzstufen, Raumautomation, extreme Steckdosenzahlen), führte dies zu einer Kosten- und Fehler-Explosion.
              </p>
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                <strong className="block font-bold text-amber-900 mb-1">Kern des Gebäudetyp-E-Vorhabens (Stand Oktober 2026: noch kein Gesetz):</strong>
                Der Regierungsentwurf von 2024 (BT-Drs. 20/13959, u. a. § 650a Abs. 3/4 und § 650o BGB-E) ist mit Ablauf der 20. Wahlperiode erledigt; BMJ und BMWSB haben im November 2025 Eckpunkte für einen neuen Entwurf vorgelegt. Ziel: Fachkundige Vertragsparteien sollen im Bauvertrag wirksam vereinbaren können, von reinen <em>Komfort- und Ausstattungsnormen</em> abzuweichen. Dies soll keinen Mangel begründen, <strong>solange die öffentlich-rechtlichen Schutzziele gewahrt bleiben:</strong>
                <ul className="list-disc pl-4 mt-1.5 space-y-0.5 font-medium text-[11px]">
                  <li>Standsicherheit (Statik &amp; Tragfähigkeit nach Eurocodes)</li>
                  <li>Brandschutz (Rettungswege, Brandwände, Baustoffklassen)</li>
                  <li>Gesundheitsschutz &amp; primäre Hygiene</li>
                  <li>Elementarer Schall- und Wärmeschutz</li>
                </ul>
              </div>
            </div>

            {/* Right: Forschung "Einfach Bauen" TU München */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={14} className="text-shiraz" />
                Forschungshaus Bad Aibling (TUM / Florian Nagler &amp; Thomas Auer)
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                An der TU München untersuchten die Lehrstühle von Prof. Florian Nagler und Prof. Thomas Auer an drei realisierten Forschungshäusern in Bad Aibling (Massivholz, Dämmbeton und hochdämmender Ziegel) das Prinzip des <strong>monolithischen, einschichtigen Bauens</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <strong className="text-xs font-bold text-slate-900 block">Monolithik</strong>
                  <span className="text-[10px] text-slate-500">Verzicht auf Mehrschicht-Verbund und verklebte WDVS</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <strong className="text-xs font-bold text-slate-900 block">Low-Tech TGA</strong>
                  <span className="text-[10px] text-slate-500">Natürliche Fensterlüftung statt wartungsintensiver Automation</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <strong className="text-xs font-bold text-slate-900 block">Speichermasse</strong>
                  <span className="text-[10px] text-slate-500">Thermische Trägheit puffert Temperaturspitzen im Sommer</span>
                </div>
              </div>
            </div>

          </div>

          {/* Practical Savings Levers Table */}
          <div className="mt-4 pt-4 border-t border-home-grau/20">
            <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Konkrete Einsparpotenziale in Pilotprojekten (z.B. Bayern / IGEWO Augsburg 54 WE):
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-home-grau/25 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase">
                  <tr>
                    <th className="p-3 border-b border-home-grau/20">Gewerk / Bauteil</th>
                    <th className="p-3 border-b border-home-grau/20">Konventioneller Komfortstandard</th>
                    <th className="p-3 border-b border-home-grau/20">Gebäudetyp E / Suffiziente Praxis</th>
                    <th className="p-3 border-b border-home-grau/20 text-emerald-800">Ressourcen- &amp; Kosteneffekt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-[11px]">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">Deckenaufbauten</td>
                    <td className="p-3 text-slate-600">Schwimmender Nassestrich auf Trittschalldämmung (DIN 4109 Komfort)</td>
                    <td className="p-3 text-slate-800">Direkt sichtbare Holzbalkendecke ohne Nassestrich</td>
                    <td className="p-3 font-bold text-emerald-700">-4 bis 6 Wochen Trocknungszeit, erhebliche Material- und Gewichtsersparnis</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">Betondecken</td>
                    <td className="p-3 text-slate-600">22–24 cm Dicke zur Übererfüllung von Schallschutznormen</td>
                    <td className="p-3 text-slate-800">18–20 cm (strikte statische Mindestdicke nach Eurocode 2)</td>
                    <td className="p-3 font-bold text-emerald-700">15–20 % Zement- und Beton-Einsparung (GWP-Minderung)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">Elektroinstallation</td>
                    <td className="p-3 text-slate-600">DIN 18015 (Mindestanzahl: 4–5 Steckdosen pro Zimmer, Leerrohre)</td>
                    <td className="p-3 text-slate-800">Nutzerangepasste, schlanke Leitungsführung</td>
                    <td className="p-3 font-bold text-emerald-700">30 % weniger Kupfer- und Kunststoffleitungen in Wänden</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">Fenster &amp; Fassade</td>
                    <td className="p-3 text-slate-600">Elektrisch gesteuerte Raffstores mit Windwächtern und Sensorik</td>
                    <td className="p-3 text-slate-800">Konstruktiv verschattende Vordächer und manuelle Holz-Klappläden</td>
                    <td className="p-3 font-bold text-emerald-700">Wartungsfrei, null Ausfallrisiko, 100 % recyclingfähig</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    );
}
