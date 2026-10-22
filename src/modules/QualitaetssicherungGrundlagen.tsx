import React from 'react';
import { ClipboardCheck, FileText, Beaker, Truck, ShieldCheck, UserCheck, Eye } from 'lucide-react';

export default function QualitaetssicherungGrundlagen() {
  return (
    <div className="flex flex-col gap-8">
      

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
          <ClipboardCheck className="text-shiraz" /> Qualitätssicherung auf der Baustelle (QS)
        </h2>
        
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30">
            <p>
              Eine umfassende Qualitätssicherung auf der Baustelle ist essenziell, um sicherzustellen, dass der gelieferte Beton den Anforderungen entspricht und fachgerecht eingebaut sowie nachbehandelt wird.
            </p>
          </div>

          <section>
            <h3 className="text-lg font-bold text-home-prim mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-shiraz" /> Wareneingangskontrolle
            </h3>
            <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/80">
              <p className="mb-2">Bei der Ankunft des Fahrmischers auf der Baustelle muss der Lieferschein sorgfältig geprüft werden. Wichtige Checks umfassen:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Stimmen die <strong>Expositionsklassen</strong> auf dem Lieferschein mit den Vorgaben des Tragwerksplaners überein?</li>
                <li>Ist die korrekte <strong>Druckfestigkeitsklasse</strong> geliefert worden (z.B. C25/30)?</li>
                <li>Entsprechen <strong>Konsistenzklasse</strong> (z.B. F3, F4) und <strong>Größtkorn</strong> (z.B. 16 mm, 32 mm) der Bestellung?</li>
                <li>Kann der Fahrmischer spätestens <strong>90 Minuten nach der ersten Wasserzugabe</strong> entladen werden (DIN 1045-2; abweichende Vereinbarung nur mit Verzögerer)?</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-home-prim mb-4 flex items-center gap-2">
              <Beaker className="w-5 h-5 text-shiraz" /> Bauwerksprüfungen vor Ort
            </h3>
            <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/80">
              <p className="mb-2">Vor und während des Betonierens sind Frischbetonprüfungen direkt auf der Baustelle durchzuführen:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Ausbreitmaß:</strong> Überprüfung der Konsistenz (Verarbeitbarkeit) mittels Ausbreittisch.</li>
                <li><strong>Lufttopf:</strong> Messung des Luftgehalts, besonders wichtig bei LP-Beton (Luftporenbeton) für Frost-Tausalz-Widerstand (XF4).</li>
                <li><strong>Temperaturmessung:</strong> Kontrolle der Frischbetontemperatur (z.B. um sicherzustellen, dass der Beton im Sommer nicht zu warm und im Winter nicht zu kalt ist).</li>
                <li><strong>Probekörperherstellung:</strong> Herstellen von Prüfwürfeln (meist 150x150x150 mm) für Festbetonprüfungen im Labor nach 28 Tagen zur Bestätigung der Druckfestigkeitsklasse.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-home-prim mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-shiraz" /> Protokollierung &amp; Dokumentation
            </h3>
            <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/80">
              <p className="mb-2">Die vollständige und korrekte Dokumentation ist ein zentraler Bestandteil der Qualitätssicherung, nicht zuletzt aus Nachweis- und Gewährleistungsgründen:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Betonierprotokolle:</strong> Dokumentieren die genauen Umstände des Betoniervorgangs, wie z.B. Bauteil, Lieferscheinnummern, Einbauzeiten, Witterungsbedingungen, Prüfergebnisse der Frischbetonprüfungen und Unterschriften der Verantwortlichen.</li>
                <li><strong>Nachbehandlungstagebücher:</strong> Erfassen die durchgeführten Maßnahmen zur Nachbehandlung (z.B. Abdecken mit Folie, Einsprühen mit Curing-Mittel) sowie die Dauer, abhängig vom Bauteil, den Expositionsklassen und dem Wetter (inkl. Temperatur- und Feuchtigkeitsverlauf).</li>
              </ul>
            </div>
          </section>

          {/* New Section: Fremdüberwachung und deren Aufgaben */}
          <section className="mt-4 border-t border-home-grau/20 pt-6">
            <h3 className="text-lg font-bold text-home-prim mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-shiraz" /> Fremdüberwachung auf der Baustelle (Aufgaben &amp; Pflichten)
            </h3>
            
            <div className="bg-emerald-50/40 p-5 rounded-xl border border-emerald-500/20 text-sm text-emerald-950 mb-6 leading-relaxed">
              <p className="mb-2">
                Während die <strong>Eigenüberwachung (Selbstkontrolle)</strong> kontinuierlich bei jedem Betoniergang durch das ausführende Bauunternehmen (Polier, Bauleiter) durchgeführt wird, fordert DIN 1045-3 (bauaufsichtlich eingeführt) für die <strong>Überwachungsklassen ÜK 2 und ÜK 3</strong> zusätzlich eine unabhängige <strong>Fremdüberwachung</strong>.
              </p>
              <p className="text-xs text-opacity-90">
                Diese anerkannte Fremdüberwachungsstelle (z. B. akkreditierte Prüfinstitute, Güteschutzgemeinschaften oder der BÜV) entlastet Bauherren und Behörden.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80">
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/25 space-y-2">
                <h4 className="font-bold text-shiraz uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                  <Eye className="w-3.5 h-3.5" /> 1. Unangekündigte Baustellenbegehungen
                </h4>
                <p className="leading-relaxed">
                  Die Fremdüberwachung führt in regelmäßigen Zyklen (je nach Baustellengröße und ÜK-Klassierung) <strong>unangekündigte Vor-Ort-Inspektionen</strong> während der aktiven Betonierphase durch, um die tatsächlichen Einbaubedingungen unabhängig zu bewerten.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/25 space-y-2">
                <h4 className="font-bold text-shiraz uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                  <Beaker className="w-3.5 h-3.5" /> 2. Unabhängige Probennahme &amp; Labormessung
                </h4>
                <p className="leading-relaxed">
                  Zusätzlich zu den Proben des Bauunternehmens fertigen die Fremdprüfer eigene unabhängige <strong>Prüfwürfel (Bohrkerne/Probekörper)</strong> an. Sie prüfen im eigenen Labor das Luftporenvolumen, das Ausbreitmaß und die tatsächliche 28-Tage-Druckfestigkeit.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/25 space-y-2">
                <h4 className="font-bold text-shiraz uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                  <ClipboardCheck className="w-3.5 h-3.5" /> 3. Auditierung der Eigenbewertungs-Unterlagen
                </h4>
                <p className="leading-relaxed">
                  Konsequente Prüfung des vollständigen <strong>Bautagebuchs</strong>, der Baustellen-Betonierprotokolle, der Lieferscheine und der lückenlos geführten Nachbehandlungstagebücher auf formelle Korrektheit und Plausibilität.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/25 space-y-2">
                <h4 className="font-bold text-shiraz uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                  <UserCheck className="w-3.5 h-3.5" /> 4. Überprüfung des Personals &amp; Gerätschaften
                </h4>
                <p className="leading-relaxed">
                  Kontrolle, ob der verantwortliche Betonierpolier die geforderte betontechnische Fachkunde (üblicher Nachweis: <strong>"E-Schein" / Beton-Führerschein</strong>) besitzt, und ob Verdichtungsgeräte (Rüttelflaschen) in ausreichender Stückzahl und Leistung einsatzbereit sind.
                </p>
              </div>
            </div>

            <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-1.5">
              <strong className="text-amber-800 flex items-center gap-1.5">
                💡 Konsequenz bei festgestellten Mängeln:
              </strong>
              <p className="text-stone-700 leading-relaxed">
                Stellt die Fremdüberwachungsstelle gravierende Abweichungen fest (z.B. mangelhafte Nachbehandlung im Sommer, unzulässige Wasserzugabe vor Ort oder fehlende Würfelnachweise), ist sie verpflichtet, den Mangel im offiziellen Überwachungsbericht festzuhalten. Dies kann zu Maßnahmen der Bauaufsicht bis hin zur Einstellung der Arbeiten oder zur Nichtabnahme des gesamten Bauwerks führen.
              </p>
            </div>
          </section>
        </div>
      </div>

    </div>
  );
}
