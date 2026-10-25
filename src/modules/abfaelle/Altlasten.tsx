import { AlertTriangle, Scale, Leaf } from 'lucide-react';
import { formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';

interface AltlastenProps {
  bbodNutzungsart: string;
  setBbodNutzungsart: React.Dispatch<React.SetStateAction<string>>;
}

export default function Altlasten({ bbodNutzungsart, setBbodNutzungsart }: AltlastenProps) {
    const bbodData: Record<string, { title: string; unit: string; values: Record<string, number> }> = {
      spielplatz: {
        title: 'Wirkpfad Boden-Mensch: Kinderspielplätze',
        unit: 'mg/kg TM (Trockenmasse im Feststoff)',
        values: { 'Arsen (As)': 25, 'Blei (Pb)': 200, 'Cadmium (Cd)': 2, 'Chrom (Cr)': 100, 'Nickel (Ni)': 70, 'Quecksilber (Hg)': 10, 'Benzo(a)pyren': 2 }
      },
      wohngebiet: {
        title: 'Wirkpfad Boden-Mensch: Wohngebiete (Gärten etc.)',
        unit: 'mg/kg TM (Trockenmasse im Feststoff)',
        values: { 'Arsen (As)': 50, 'Blei (Pb)': 400, 'Cadmium (Cd)': 10, 'Chrom (Cr)': 200, 'Nickel (Ni)': 140, 'Quecksilber (Hg)': 20, 'Benzo(a)pyren': 4 }
      },
      park: {
        title: 'Wirkpfad Boden-Mensch: Park- und Freizeitanlagen',
        unit: 'mg/kg TM (Trockenmasse im Feststoff)',
        values: { 'Arsen (As)': 125, 'Blei (Pb)': 1000, 'Cadmium (Cd)': 50, 'Chrom (Cr)': 500, 'Nickel (Ni)': 350, 'Quecksilber (Hg)': 70, 'Benzo(a)pyren': 10 }
      },
      industrie: {
        title: 'Wirkpfad Boden-Mensch: Industrie- und Gewerbeflächen',
        unit: 'mg/kg TM (Trockenmasse im Feststoff)',
        values: { 'Arsen (As)': 140, 'Blei (Pb)': 2000, 'Cadmium (Cd)': 60, 'Chrom (Cr)': 1000, 'Nickel (Ni)': 900, 'Quecksilber (Hg)': 80, 'Benzo(a)pyren': 12 }
      },
      grundwasser: {
        title: 'Wirkpfad Boden-Grundwasser: Sickerwasserpfad (Universal)',
        unit: 'µg/l im Eluat / Sickerwasser',
        values: { 'Arsen (As)': 10, 'Blei (Pb)': 10, 'Cadmium (Cd)': 0.5, 'Chrom (Cr-Gesamt)': 50, 'Nickel (Ni)': 20, 'Quecksilber (Hg)': 0.2, 'PFAS (Summe 4)': 0.1 }
      },
      nutzpflanze: {
        title: 'Wirkpfad Boden-Nutzpflanze: Landwirtschaft / Nutzgärten',
        unit: 'mg/kg TM (Pflanzenverfügbare Fraktion)',
        values: { 'Cadmium (Cd)': 0.1, 'Blei (Pb)': 0.1, 'Quecksilber (Hg)': 1.0 }
      }
    };

    const selectedBbod = bbodData[bbodNutzungsart] || bbodData.wohngebiet;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <div className="border-b border-home-grau/30 pb-4">
          <h3 className="text-2xl font-bold text-slate-850 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-shiraz" />
            Altlasten &amp; Bodenschutz (BBodSchG / BBodSchV)
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Das Bundes-Bodenschutzgesetz (BBodSchG) schützt den Boden vor schädlichen Veränderungen, regelt die Sanierung kontaminierter Altstandorte und setzt strenge Grenzen für Belastungen nach dem Wirkungspfad-Prinzip.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative mb-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-shiraz mb-2 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Die 3 gesetzlichen Wirkungspfade
              </h4>
              <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                Schadstoffe im Boden werden nicht isoliert betrachtet, sondern stets bezogen auf konkrete "Wirkpfade" (Wege, auf denen Lebewesen oder das Grundwasser gefährdet werden) bewertet:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 font-semibold font-medium">
                <li><strong>Boden-Mensch:</strong> Direkter Kontakt, Verschlucken von kontaminierter Erde (z.B. Kleinkinder auf Spielplätzen), Einatmen belasteter Staubpartikel.</li>
                <li><strong>Boden-Nutzpflanze:</strong> Schadstofftransfer aus dem Boden in die Nutzpflanzenwurzel (Gefahr in der landwirtschaftlichen Nahrungskette).</li>
                <li><strong>Boden-Grundwasser:</strong> Schadstoffauswaschung durch Niederschlagswasser durch den Bodenkörper ins nutzbare Grundwasser (Sickerwasserprognose).</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <Scale className="w-4 h-4 text-slate-500" /> Prüf- vs. Maßnahmenwerte
              </h4>
              <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                Die Verordnung unterscheidet scharf zwischen zwei Bewertungsschwellen:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 leading-relaxed font-semibold font-medium">
                <li>
                  <strong className="text-slate-800">Prüfwerte (Triggers):</strong> Bei Überschreitung besteht ein "Altlastenverdacht". Die Behörde fordert zwingend weiterführende Detailuntersuchungen (z.B. qualifizierte Tiefenbohrungen).
                </li>
                <li>
                  <strong className="text-shiraz">Maßnahmenwerte (Action Limits):</strong> Bei Überschreitung besteht unmittelbare Gefahr für die Gesundheit oder das Grundwasser. Es besteht sofortiger, gesetzlicher Handlungsbedarf (Sanierung, Kapselung, Absperrung oder Nutzungsbeschränkung).
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive BBodSchV Prüfwerte Selector */}
        <div className="p-5 bg-white border border-home-grau/30 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">BBodSchV Prüfwerte-Katalog</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nutzen Sie den interaktiven Pfad-Checker, um die gesetzlichen Prüfwerte nach der novellierten Bundes-Bodenschutzverordnung (BBodSchV, gültig seit 01.08.2023) abzurufen.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Szenario / Nutzungspfad:</label>
                <select aria-label="Szenario / Nutzungspfad"
                  className="w-full text-xs font-mono bg-slate-50 border border-home-grau/30 rounded-lg p-2.5 outline-none focus:border-home-grau/30"
                  value={bbodNutzungsart}
                  onChange={(e) => setBbodNutzungsart(e.target.value)}
                >
                  <option value="spielplatz">Boden-Mensch: Kinderspielplätze</option>
                  <option value="wohngebiet">Boden-Mensch: Wohngebiete</option>
                  <option value="park">Boden-Mensch: Park- und Freizeitanlagen</option>
                  <option value="industrie">Boden-Mensch: Industrie- und Gewerbeflächen</option>
                  <option value="grundwasser">Boden-Grundwasser: Sickerwasserpfad</option>
                  <option value="nutzpflanze">Boden-Nutzpflanze: Landwirtschaft / Gärten</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-xs text-slate-500">
                📌 <strong>Wirkungspfad-Logik:</strong> Die Werte für Kinderspielplätze sind extrem niedrig angesetzt, da Kleinkinder beim Spielen Schmutz oral aufnehmen ("Pica-Verhalten"). Für Gewerbeflächen gelten bis zu 10-fach höhere Grenzwerte.
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="border-b border-home-grau/30 pb-2 flex justify-between items-center">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">{selectedBbod.title}</span>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-500">{selectedBbod.unit}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(selectedBbod.values).map(([contaminant, value]) => (
                <div key={contaminant} className="p-3 bg-slate-50/50 rounded-xl border border-home-grau/30 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{contaminant}</span>
                  <span className="font-mono font-extrabold text-slate-900 bg-white border border-home-grau/30 px-2.5 py-1 rounded shadow-xs">≤ {formatDeWert(value)}</span>
                </div>
              ))}
            </div>

            {bbodNutzungsart === 'grundwasser' && (
              <div className="mt-3 p-3 bg-indigo-50 border border-indigo-150 rounded-xl text-xs text-indigo-900 leading-relaxed font-semibold">
                🌱 <strong>PFAS-Meilenstein 2023:</strong> Unter der novellierten BBodSchV sind die per- und polyfluorierten Alkylsubstanzen (PFAS, "Ewigkeitschemikalien") erstmals explizit mit einem bundeseinheitlichen Eluatprüfwert von 0.1 µg/l für die Summe aus vier Hauptverbindungen (PFOA, PFOS, PFHxS, PFNA) gesetzlich geregelt. Dies bürdet Bauherren erhebliche Erkundungspflichten auf.
              </div>
            )}
          </div>
        </div>

        {/* Physikalischer Bodenschutz */}
        <div className="p-5 bg-white border border-home-grau/30 rounded-2xl shadow-md space-y-4">
          <h4 className="font-bold text-slate-950 text-sm flex items-center gap-11.5">
            <Leaf className="w-5 h-5 text-emerald-600 inline mr-2" />
            Physikalischer Bodenschutz auf Baustellen (§ 17 BBodSchV)
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Neben der chemischen Schadstoffbelastung verpflichtet das modernisierte Bodenschutzrecht Planer und Ausführende zu einem sorgsamen Umgang mit der Bodenstruktur selbst. Schwere Erdbewegungsmaschinen können irreversible Zerstörungen im Bodengefüge (Verdichtung, Scherspannungen) anrichten.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 space-y-2 border border-home-grau/30">
              <h5 className="font-bold text-slate-900">1. Vermeidung von Bodenschäden (Konstruktive Maßnahmen)</h5>
              <ul className="space-y-1.5 text-slate-600 font-medium">
                <li>• <strong className="text-slate-800">Bodendruck reduzieren:</strong> Verwendung von Kettenlaufwerken, Breitreifen im Niederdruckbereich (≤ 0,8 bar) oder Baggermatten aus Hartholz.</li>
                <li>• <strong className="text-slate-800">Hydrologische Grenzwerte einhalten:</strong> Keine Befahrung von weichen, schluffigen oder tonigen Böden im feuchten Zustand (pF-Wert ≤ 1,8 oder Saugspannung beachten).</li>
                <li>• <strong className="text-slate-800">Mutterbodenschutz:</strong> Abtrag des Oberbodens (Mutterboden) vor Baubeginn und sachgemäße Lagerung in Mieten (≤ 2 m Höhe, Belüftung bewahren) zur Erhaltung der Mikrobiologie.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 space-y-2 border border-home-grau/30">
              <h5 className="font-bold text-slate-900">2. Bodenkundliche Baubegleitung (BBB) Pflicht</h5>
              <ul className="space-y-1.5 text-slate-600 font-medium">
                <li>• <strong className="text-slate-800">Wann erforderlich?</strong> Gesetzlich empfohlen und oft baurechtlich erzwungen bei Bauvorhaben mit Bodenbewegungen ≥ 3.000 m³ oder auf sensiblem Agrarland.</li>
                <li>• <strong className="text-slate-800">Aufgabe der BBB:</strong> Freigabe von Fahrtrassen, Festlegen von temperatur- und feuchtigkeitsbedingten Erdbaupausen (z. B. Baustopp bei Staunässe), Qualitätskontrolle bei der Rekultivierung.</li>
                <li>• <strong className="text-slate-800">Wiederherstellungspflicht:</strong> Nach Bauabschluss muss verdichtetes Gelände im Unterboden tiefengelockert werden, bevor der Oberboden schonend aufgetragen wird.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-xl mb-6">
          <h4 className="font-bold text-indigo-900 mb-2">Bodenmaterialklassen: Z-Klassen &amp; BM-Klassen</h4>
          <p className="text-sm text-indigo-900 mb-3 leading-relaxed">
            Boden und Bauabfälle werden für ihre Verwertung oder Entsorgung je nach Schadstoffbelastung klassifiziert. Dies ist extrem wichtig für die Vergabe von Erdarbeiten:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-indigo-100">
              <h5 className="font-bold text-indigo-800 text-sm mb-1">ErsatzbaustoffV (aktuell): BM-Klassen</h5>
              <p className="text-xs text-indigo-900 mb-2">
                 Nach der (seit Aug 2023 gültigen) Ersatzbaustoffverordnung (EBV) wird Bodenmaterial ("BM") in neue Güteklassen eingeteilt:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-indigo-900">
                <li><strong className="text-indigo-800 font-bold">BM-0 / BM-0*:</strong> Unbelastetes bis geringfügig verändertes Bodenmaterial (z.B. vergleichbar mit Sandkastensand). Sehr hohe Verwertbarkeit ohne Einschränkungen.</li>
                <li><strong className="text-indigo-800 font-bold">BM-F1:</strong> Bodenmaterial mit etwas mehr Feinkorn und sehr leichten Belastungen. In bestimmten Bauweisen frei verwendbar.</li>
                <li><strong className="text-indigo-800 font-bold">BM-F2 / BM-F3:</strong> Zunehmende Schadstoffgehalte, erfordern oft bautechnischen Grundwasserschutz beim Wiedereinbau.</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded-lg border border-indigo-100">
              <h5 className="font-bold text-indigo-800 text-sm mb-1">LAGA M20 (Historisch / Bodenverwertung): Z-Klassen</h5>
              <p className="text-xs text-indigo-900 mb-2">
                Lange Zeit das Standardwerk. Viele Ausschreibungen und Deponien referenzieren oft noch die "Zuordnungswerte" (Z-Klassen) der alten LAGA M20:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-indigo-900">
                <li><strong className="text-indigo-800 font-bold">Z 0 / Z 0 *:</strong> Uneingeschränkt verwertbar (unbelasteter Erdaushub).</li>
                <li><strong className="text-indigo-800 font-bold">Z 1.1 / Z 1.2:</strong> Eingeschränkt verwertbarer Boden (mit technischen Sicherungsmaßnahmen nutzbar, z.B. unter Asphalt).</li>
                <li><strong className="text-indigo-800 font-bold">Z 2:</strong> Eingeschränkt verwertbar mit definierten technischen Sicherungen, höhere Belastungen.</li>
                <li><strong className="text-indigo-800 font-bold">&gt; Z 2:</strong> Meist Deponierung auf DK I bis DK III oder thermische/biologische Bodenaufbereitung nötig.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-1.5">
            <Scale className="w-5 h-5 text-slate-600" /> Stufenweiser Ablauf der Altlastenbearbeitung
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="text-shiraz font-bold text-xl mb-1">1.</div>
                <div className="font-bold text-xs mb-1.5">Historische Erkundung</div>
                <div className="text-xs text-gray-600 leading-relaxed">Recherche in Bauakten, Archiven und Luftbildern: Gab es Bombenabwürfe? War hier eine chemische Reinigung, alte Gerberei oder Tankstelle?</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="text-shiraz font-bold text-xl mb-1">2.</div>
                <div className="font-bold text-xs mb-1.5">Orientierende Untersuchung</div>
                <div className="text-xs text-gray-600 leading-relaxed font-semibold">Erste Bohrungen (Rammkerness-Schürfe) und Laboranalysen. Bestätigt sich der Altlastenverdacht? Sind Prüfwerte (Trigger-Werte) überschritten?</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="text-shiraz font-bold text-xl mb-1">3.</div>
                <div className="font-bold text-xs mb-1.5">Detailuntersuchung</div>
                <div className="text-xs text-gray-600 leading-relaxed font-semibold">Exakte 3D-Abgrenzung des Kontaminationsherds (Schadstofffahne). Fundierte Gefährdungsabschätzung (Sickerwasserprognose, Grundwassermonitoring).</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <div className="text-shiraz font-bold text-xl mb-1">4.</div>
                <div className="font-bold text-xs mb-1.5">Sanierung / Sicherung</div>
                <div className="text-xs text-gray-600 leading-relaxed font-semibold">Bodenaustausch (Aushub/Verfüllung), Bodenluftabsaugung, Pump-and-Treat (Wasserreinigung) oder Einkapselung (Spundwände/Versiegelung).</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
