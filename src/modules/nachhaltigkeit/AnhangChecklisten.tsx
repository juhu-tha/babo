import { AlertTriangle } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface AnhangChecklistenProps {
  checklistState: Record<string, boolean>;
  setChecklistState: Dispatch<SetStateAction<Record<string, boolean>>>;
}

export default function AnhangChecklisten({ checklistState, setChecklistState }: AnhangChecklistenProps) {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 2</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">
            Checklisten &amp; Klausurklassiker (Fehlerprävention)
          </h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Studienerfolge hängen meist davon ab, systematische Ungenauigkeiten auszuschließen. Verwenden Sie diese interaktiven Checklisten für Ihre Seminar- und Klausurausarbeitungen.
        </p>

        <div className="space-y-3.5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5">
            ✓ Checkliste Produktökobilanz / EPD-Nutzung
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {[
              { id: 'epd_1', text: 'Deklarierte Einheit exakt notiert und auf Projektbezug umgerechnet (1 kg ≠ 1 m³ ≠ 1 m²)' },
              { id: 'epd_2', text: 'Normfassung prüfen (EN 15804+A1 und +A2 nicht vermischen!)' },
              { id: 'epd_3', text: 'Datensatztyp (spezifisch vs. repräsentativ) und Bezugsjahr im Beiblatt dokumentieren' },
              { id: 'epd_4', text: 'GWP-fossil und GWP-biogenic getrennt ausgewiesen und bilanziert (unfreiwilliges Greenwashing vermieden)' },
              { id: 'epd_5', text: 'Szenarien (Transportdistanzen A4, Nutzungsdauer RSL, EoL C/D) auf Projektpassung geprüft' },
              { id: 'epd_6', text: 'Nutzeffekt Modul D streng getrennt ausgewiesen und nicht unzulässig in Summen A-C eingerechnet' }
            ].map((item) => (
              <label 
                key={item.id} 
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all select-none ${
                            checklistState[item.id] 
                              ? 'bg-emerald-50/40 border-emerald-300 text-slate-800' 
                              : 'bg-slate-50/50 border-stone-200/80 text-slate-600 hover:bg-slate-50'
                          }`}
              >
                <input 
                  type="checkbox" 
                  checked={!!checklistState[item.id]} 
                  onChange={() => setChecklistState(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className="mt-1 accent-emerald-600 rounded shadow-inner"
                />
                <span className="text-[11px] leading-relaxed font-medium">{item.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3.5 pt-4 border-t border-stone-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5">
            ✓ Checkliste Gebäudeökobilanz (QNG)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {[
              { id: 'qng_1', text: 'Grundflächenbezug: Netto-Raumfläche NRF(R) nach DIN 277:2021-08 ermittelt (Nicht NGF oder Wohnfläche!)' },
              { id: 'qng_2', text: 'Betrachtungszeitraum einheitlich auf 50 Jahre festgesetzt' },
              { id: 'qng_3', text: 'Lebenszyklusmodule A1-A3, B4, B6, C3, C4 und D getrennt bilanziert' },
              { id: 'qng_4', text: 'Mengengerüst vollständig: Kostengruppe 300 (Bauwerk) u. Kostengruppe 400 (Haustechnik Pauschale) nach DIN 276 erfasst' },
              { id: 'qng_5', text: 'ÖKOBAUDAT-Datensätze regelkonform gewählt und deren UUID-Kennungen dokumentiert' },
              { id: 'qng_6', text: 'Nutzungsdauern (RSL) nach BBSR-Tabelle richtig eingepflegt und Ersatzzyklen für B4 kalkuliert' },
              { id: 'qng_7', text: 'Betrieblicher Energiebedarf (B6) exakt aus GEG-Zertifikat (DIN V 18599) überführt' },
              { id: 'qng_8', text: 'Das errechnete CO₂-Gesamtergebnis plausibilisiert (Zahlenwerte kg/m²a mit Benchmarks abgeglichen)' }
            ].map((item) => (
              <label 
                key={item.id} 
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all select-none ${
                            checklistState[item.id] 
                              ? 'bg-emerald-50/40 border-emerald-300 text-slate-800' 
                              : 'bg-slate-50/50 border-stone-200/80 text-slate-600 hover:bg-slate-50'
                          }`}
              >
                <input 
                  type="checkbox" 
                  checked={!!checklistState[item.id]} 
                  onChange={() => setChecklistState(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className="mt-1 accent-emerald-600 rounded shadow-inner"
                />
                <span className="text-[11px] leading-relaxed font-medium">{item.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h4 className="text-xs font-bold text-red-950 uppercase tracking-widest flex items-center gap-1.5">
            <AlertTriangle size={15} className="text-red-700" /> DIE 12 HÄUFIGSTEN FEHLEINGABEN (PRAXISKREISE &amp; EXAMEN)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              { 
                no: '1', 
                title: 'Datensätze mischen', 
                err: 'Datensätze der Normversionen EN 15804+A1 und +A2 werden fälschlich addiert.', 
                sol: 'GWP-Indikatoren sind nicht deckungsgleich. Niemals Datensätze unterschiedlicher Normgenerationen mischen.' 
              },
              { 
                no: '2', 
                title: 'Falsche Bezugsfläche', 
                err: 'Nutzung der Netto-Grundfläche (NGF) oder Reinen Wohnfläche als Basis.', 
                sol: 'Das QNG verlangt die Netto-Raumfläche NRF(R) nach DIN 277:2021-08.' 
              },
              { 
                no: '3', 
                title: 'Einheitenfehler', 
                err: 'GWP-Faktoren (kg CO2-eq/kg) werden direkt mit Bauteilvolumen (m³) multipliziert, ohne die Rohdichte einzurechnen.', 
                sol: 'Stets den Dichteabgleich durchführen: Masse = Volumen * Rohdichte.' 
              },
              { 
                no: '4', 
                title: 'Einberechnen des Moduls D', 
                err: 'Ökologische Recycling-Gutschriften (Modul D) werden in die GWP-Gesamtsumme A-C hineingerechnet.', 
                sol: 'Gutschriften außerhalb der Systemgrenzen müssen als separater Posten deklariert werden!' 
              },
              { 
                no: '5', 
                title: 'Biogenen Kohlenstoff ignorieren', 
                err: 'Vergleich von Holzbaustoffen rein im Modul A1-A3, ohne die Freisetzung im Modul C3/C4 zu bilanzieren.', 
                sol: 'Holz bindet CO₂ im Wachstum (A1-A3 negativ), gibt dieses aber bei Verbrennung/EoL (C3) wieder frei (Netto-Effekt ≈ 0).' 
              },
              { 
                no: '6', 
                title: 'Instandhaltung (B4) vergessen', 
                err: 'Dichtungsschichten, Verputze oder mechanische Klimateile werden mit 50 Jahren Lebensdauer fehlerfrei durchgeschleust.', 
                sol: 'Nutzeffekt-Intervalle nach BBSR-Tabelle abbilden (z. B. Heizkessel RSL 20 a: zwei Austausche nach 20 und 40 Jahren im Betrachtungszeitraum von 50 Jahren).' 
              },
              { 
                no: '7', 
                title: 'Ungleiche funktionale Einheit', 
                err: 'Konkurrierende Tragwerkswände (Beton vs. Holz) werden ohne denselben Schall- und Brandschutzeffekt berechnet.', 
                sol: 'Niemals reine Stoffmengen vergleichen, sondern gleichwertige bauphysikalische Gesamtbauteile!' 
              },
              { 
                no: '8', 
                title: 'Veraltete Datenbestände', 
                err: 'Nutzung nicht regelkonform, veralteter ÖKOBAUDAT-Uraltversionen für neue Nachweise.', 
                sol: 'Nutzen Sie für QNG-konforme Audits immer die aktuell freigegebene BBSR-Rechenwert-Generiktabelle.' 
              },
              { 
                no: '9', 
                title: 'Kategorien aufaddieren', 
                err: 'Wirkungswerte verschiedener Wirkungskategorien (z.B. kg CO₂-eq + kg SO₂-eq) werden zu einem einzigen Gesamtwert aufsummiert.', 
                sol: 'Es ist physikalisch unmöglich und methodisch unzulässig, unterschiedliche Umweltwirkungen zu addieren.' 
              },
              { 
                no: '10', 
                title: 'Unvollständige Mengenermittlung', 
                err: 'Fehlende Erfassung der Technischen Anlagen (Kostengruppe 400) oder doppelte Bilanzierung von Putzen.', 
                sol: 'Sicherstellen, dass alle Konstruktionsbereiche nach DIN 276 vollständig und überschneidungsfrei vorliegen.' 
              },
              { 
                no: '11', 
                title: 'EPD-Szenarien blind übernehmen', 
                err: 'Spezifische Hersteller-EPD-Transportdistanzen ungeprüft in die Gebäudeermittlung einrechnen.', 
                sol: 'Die Standardvorgaben des QNG-Handbuchs (z.B. Pauschalen für Transportdistanzen) müssen vorrangig genutzt werden.' 
              },
              { 
                no: '12', 
                title: 'Scheingenauigkeit', 
                err: 'Ergebnisdeklarationen mit 3 bis 4 Nachkommastellen bei einer inhärenten Datenunsicherheit von ±30 %.', 
                sol: 'Runden Sie Ihre Endergebnisse sinngemäß auf eine Nachkommastelle, um eine realistische Präzision zu suggerieren.' 
              }
            ].map((item) => (
              <div key={item.no} className="bg-slate-50/50 p-4 rounded-xl border border-stone-200 flex gap-3">
                <span className="w-6 h-6 bg-red-100 border border-red-250 text-red-800 font-bold font-mono text-xs rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  {item.no}
                </span>
                <div className="space-y-1">
                  <strong className="text-xs font-bold text-slate-900 block">{item.title}</strong>
                  <div className="text-[10px] text-red-950 font-medium leading-relaxed bg-red-50/30 p-1.5 rounded border border-red-100">
                    <span className="font-bold">Typischer Fehler:</span> {item.err}
                  </div>
                  <div className="text-[10px] text-emerald-950 font-medium leading-relaxed bg-emerald-50/30 p-1.5 rounded border border-emerald-100">
                    <span className="font-bold">Richtige Lösung:</span> {item.sol}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
