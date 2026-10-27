import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ShieldCheck, Server, Database, Cookie, Mail, Lock, UserCheck, Sparkles, BarChart3, MessageSquareHeart } from 'lucide-react';
import { SPEICHER_REGISTER } from '@/src/data/speicherRegister';

// Stand und Inhalt mit dem Datenschutzbeauftragten der THA abstimmen (Umsetzungsplan Phase 1, AP 1.3).
// Die Tabelle der Speicherorte kommt aus src/data/speicherRegister.ts und wird per Test vollständig gehalten.

const Abschnitt = ({ icon: Icon, titel, children }: { icon: React.ComponentType<{ size?: number; className?: string }>; titel: string; children: React.ReactNode }) => (
  <section className="space-y-2">
    <h3 className="text-base font-bold text-text-main flex items-center gap-2">
      <Icon size={18} className="text-shiraz" /> {titel}
    </h3>
    {children}
  </section>
);

export default function Datenschutz() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <ShieldCheck className="text-shiraz" /> Datenschutzerklärung
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Stand: Oktober 2026
          </span>
        </div>

        <div className="space-y-6 text-sm text-text-main/80 leading-relaxed max-w-prose">
          <Abschnitt icon={UserCheck} titel="1. Verantwortliche Stelle und Datenschutzbeauftragter">
            <p>
              Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Webanwendung im Sinne der
              Datenschutz-Grundverordnung (DSGVO) und des Bayerischen Datenschutzgesetzes (BayDSG) ist die
              Technische Hochschule Augsburg (THA), eine Körperschaft des öffentlichen Rechts, vertreten durch
              den Präsidenten.
            </p>
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs sm:text-sm">
              <p className="font-bold text-text-main">Technische Hochschule Augsburg</p>
              <p>An der Hochschule 1 · 86161 Augsburg</p>
              <p className="pt-2">Fachlich verantwortlich für das BaustoffBoard: Prof. Dr.-Ing. Jürgen Huber, Fakultät für Architektur und Bauwesen</p>
              <p>E-Mail: <a href="mailto:juergen.huber@tha.de" className="text-shiraz hover:underline">juergen.huber@tha.de</a></p>
            </div>
            <p className="text-xs text-text-main/70 pt-1">
              Behördlicher Datenschutzbeauftragter der THA: An der Hochschule 1 · 86161 Augsburg ·
              E-Mail: <a href="mailto:datenschutz@tha.de" className="text-shiraz hover:underline">datenschutz@tha.de</a>
            </p>
          </Abschnitt>

          <Abschnitt icon={Server} titel="2. Bereitstellung (Hosting) und Server-Protokolle">
            <p>
              Die Anwendung wird über Google AI Studio auf der Container-Plattform Google Cloud Run bereitgestellt
              (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland, bzw. Google LLC, USA).
              Eine Verarbeitung in Drittländern, insbesondere in den USA, ist nicht auszuschließen. Google LLC ist
              nach dem EU-US Data Privacy Framework zertifiziert; dafür besteht ein Angemessenheitsbeschluss der
              Europäischen Kommission (Art. 45 DSGVO).
            </p>
            <p>Beim Aufruf erfasst die Plattform automatisch technische Protokolldaten:</p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-2">
              <li>IP-Adresse des aufrufenden Geräts</li>
              <li>Datum und Uhrzeit des Abrufs</li>
              <li>aufgerufene Adresse und Statuscode</li>
              <li>übertragene Datenmenge</li>
              <li>Browser und Betriebssystem (User-Agent)</li>
            </ul>
            {/* OFFEN (Gutachten 27.10.2026, mit dem DSB abzustimmen – hier bewusst NICHT ergänzt):
                konkrete Speicherdauer der Cloud-Run-Protokolle und Google als Auftragsverarbeiter
                (Cloud Data Processing Addendum). Formulierungsvorschlag: docs/entwuerfe/datenschutz-ergaenzungen.md */}
            <p className="text-xs text-text-main/70">
              Zweck ist der sichere und stabile Betrieb, etwa die Abwehr von Angriffen. Rechtsgrundlage ist
              Art. 6 Abs. 1 lit. e DSGVO i. V. m. Art. 4 BayDSG. Die Protokolle werden nach den Vorgaben der
              Plattform gelöscht und nicht mit anderen Daten zusammengeführt.
            </p>
            <p className="text-xs text-text-main/70">
              Zum Schutz vor Missbrauch zählt der Server Anfragen je IP-Adresse für höchstens eine Stunde im
              Arbeitsspeicher (Anfragebegrenzung). Diese Zählung wird nicht gespeichert und bei jedem Neustart
              verworfen. Der Besuchszähler erfasst nur die Anzahl der Seitenaufrufe, ohne Bezug zu einer Person.
            </p>
          </Abschnitt>

          {/* KI-Funktion abgeschaltet (src/data/kiSchalter.ts, Entscheidung 27.10.2026). Text für eine spätere
              Reaktivierung (mit DSB abzustimmen): docs/entwuerfe/datenschutz-ergaenzungen.md, Abschnitt 4. */}
          <Abschnitt icon={Sparkles} titel="3. KI-Prompt-Generator">
            <p>
              Die KI-Funktion (Anbindung an das Sprachmodell Google Gemini) ist derzeit abgeschaltet. Es werden
              keine Daten an Google Gemini übermittelt; unser Server nimmt keine KI-Anfragen an.
            </p>
            <p className="text-xs text-text-main/70">
              Der Prompt-Generator im Modul „KI im Bauwesen“ arbeitet vollständig in Ihrem Browser. Wenn Sie einen
              kopierten Prompt in einem KI-Dienst Ihrer Wahl verwenden, gelten dafür dessen Datenschutzbestimmungen.
            </p>
          </Abschnitt>

          <Abschnitt icon={BarChart3} titel="4. Live-Abstimmungen in Lehrveranstaltungen">
            <p>
              Bei Live-Abstimmungen speichert der Server nur die abgegebene Antwort und eine zufällige Kennung im
              Cookie <code className="font-mono text-xs">bb_voter</code>, damit jedes Gerät nur einmal abstimmt.
              Ein Bezug zu Ihrer Person wird nicht hergestellt. Die Ergebnisse liegen nur im Arbeitsspeicher des
              Servers und gehen bei einem Neustart verloren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. e DSGVO
              i. V. m. Art. 2 BayHIG (Lehre); das Cookie ist technisch notwendig (§ 25 Abs. 2 Nr. 2 TDDDG).
            </p>
          </Abschnitt>

          <Abschnitt icon={MessageSquareHeart} titel="5. Anonymer Kurzfragebogen">
            <p>
              Höchstens einmal je Semester bittet die Anwendung um eine freiwillige Rückmeldung: fünf Aussagen mit
              fünfstufiger Skala und ein optionaler Kommentar mit höchstens 500 Zeichen. Sie können den Fragebogen
              ohne Nachteile schließen. Übermittelt werden nur Ihre Bewertungen und – falls Sie ihn schreiben – der
              Kommentar, und zwar nur, wenn Sie auf „Absenden“ klicken.
            </p>
            <p>
              Der Server speichert die Bewertungen nicht als Einzelantworten, sondern zählt nur, wie oft jeder Wert je
              Aussage und Semester gewählt wurde. Kommentare werden ohne Zeitpunkt, ohne IP-Adresse, ohne
              Browserangaben und ohne Verbindung zu den Bewertungen abgelegt; ihre Reihenfolge wird zufällig gemischt.
              Es werden keine Cookies gesetzt. Zum Schutz vor Missbrauch zählt der Server die Anfragen je IP-Adresse
              höchstens eine Stunde lang im Arbeitsspeicher (siehe 2.); diese Zählung wird nicht gespeichert.
              Schreiben Sie bitte keine Namen oder anderen personenbezogenen Angaben in den Kommentar.
            </p>
            <p className="text-xs text-text-main/70">
              Im Browser wird unter <code className="font-mono text-xs">bb_kurzfragebogen</code> nur das Semester
              vermerkt, in dem der Fragebogen angezeigt wurde, damit er nicht erneut erscheint (siehe 8.).
              Zweck ist die Qualitätssicherung der Lehre; soweit dabei überhaupt personenbezogene Daten anfallen, ist
              Rechtsgrundlage Art. 6 Abs. 1 lit. e DSGVO i. V. m. Art. 2 BayHIG. Die Ergebnisse sehen nur die
              Lehrenden im Administrationsbereich. Sie liegen in einer Datei auf dem Server, werden gelöscht, sobald sie
              für die Auswertung nicht mehr benötigt werden, und gehen technisch bedingt auch bei einem Neustart des
              Servers verloren.
            </p>
          </Abschnitt>

          <Abschnitt icon={Cookie} titel="6. Cookies und Übersetzung">
            <p>
              Die Anwendung verwendet <strong>keine Tracking-, Marketing- oder Analyse-Cookies</strong> und bindet
              keine Analysedienste ein. Die Plattform setzt ein technisches Cookie für die Lastverteilung
              (<code className="font-mono text-xs">GAESA</code>), das keine Nutzerprofile speichert.
            </p>
            <p>
              <strong>Optionale Übersetzung (Google Translate):</strong> Erst wenn Sie die Übersetzung aktivieren,
              wird das Cookie <code className="font-mono text-xs">googtrans</code> gesetzt und das Skript des
              Übersetzungsdienstes von Google LLC (USA) geladen. Dabei werden Ihre IP-Adresse und die Seiteninhalte
              an Google übertragen. Rechtsgrundlage ist Ihre Einwilligung durch das Aktivieren
              (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG).
            </p>
          </Abschnitt>

          <Abschnitt icon={Lock} titel="7. Berechnungen im Browser">
            <p>
              Alle Berechnungen, zum Beispiel Mischungsberechnungen, U-Wert- und Glaser-Nachweise oder
              Bemessungen, laufen ausschließlich in Ihrem Browser. Eingaben in Rechnern werden nicht an den
              Server übertragen. Ausnahmen sind nur die unter 3. bis 5. beschriebenen Funktionen.
            </p>
          </Abschnitt>

          <Abschnitt icon={Database} titel="8. Speicherung im Browser und Cookies">
            <p>
              Einstellungen und Lernstände speichert die Anwendung nur in Ihrem Browser. Sie werden nicht an den
              Server übertragen. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG, weil die Speicherung für die von Ihnen
              gewünschten Funktionen erforderlich ist. Sie können die Daten jederzeit über die Browsereinstellungen
              („Websitedaten löschen“) entfernen. Vollständige Übersicht:
            </p>
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Übersicht der Speicherorte">
              <table className="w-full text-left text-xs border border-home-grau/20 rounded-lg">
                <thead className="bg-off-white border-b border-home-grau/20">
                  <tr>
                    <th scope="col" className="p-2.5 font-bold">Name</th>
                    <th scope="col" className="p-2.5 font-bold">Ort</th>
                    <th scope="col" className="p-2.5 font-bold">Zweck</th>
                    <th scope="col" className="p-2.5 font-bold">Speicherdauer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/15">
                  {SPEICHER_REGISTER.map(e => (
                    <tr key={e.schluessel}>
                      <td className="p-2.5 font-mono">{e.schluessel}</td>
                      <td className="p-2.5">{e.ort}</td>
                      <td className="p-2.5">{e.zweck}</td>
                      <td className="p-2.5">{e.dauer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Abschnitt>

          <Abschnitt icon={Mail} titel="9. Kontakt per E-Mail">
            <p>
              Feedback und Fehlermeldungen senden Sie über Ihr eigenes E-Mail-Programm. Wir verarbeiten Ihre
              Angaben nur zur Bearbeitung der Anfrage (Art. 6 Abs. 1 lit. e DSGVO i. V. m. Art. 4 BayDSG) und
              löschen sie, wenn sie dafür nicht mehr benötigt werden.
            </p>
          </Abschnitt>

          <Abschnitt icon={Lock} titel="10. Ihre Rechte">
            <p>Sie haben nach Art. 15 bis 21 DSGVO das Recht auf</p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-2">
              <li>Auskunft über die zu Ihnen verarbeiteten Daten,</li>
              <li>Berichtigung und Löschung,</li>
              <li>Einschränkung der Verarbeitung,</li>
              <li>Widerspruch gegen die Verarbeitung und</li>
              <li>Datenübertragbarkeit.</li>
            </ul>
            <p>Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO).</p>
          </Abschnitt>

          <Abschnitt icon={ShieldCheck} titel="11. Beschwerderecht">
            <p>
              Sie können sich bei der zuständigen Aufsichtsbehörde für bayerische öffentliche Stellen beschweren:
            </p>
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-xs">
              <p className="font-bold">Der Bayerische Landesbeauftragte für den Datenschutz (BayLfD)</p>
              <p>Wagmüllerstraße 18 · 80538 München</p>
              <p>Web: <a href="https://www.datenschutz-bayern.de" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline">www.datenschutz-bayern.de</a></p>
            </div>
          </Abschnitt>
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Datenschutz-Grundverordnung', url: 'https://de.wikipedia.org/wiki/Datenschutz-Grundverordnung' }
        ]}
        regelwerke={[
          { title: 'EU-DSGVO (Datenschutz-Grundverordnung Art. 12-21)', url: 'https://eur-lex.europa.eu/' },
          { title: 'Bayerisches Datenschutzgesetz (BayDSG)', url: 'https://www.gesetze-bayern.de/' }
        ]}
        hideFormeln={true}
      />
    </div>
  );
}
