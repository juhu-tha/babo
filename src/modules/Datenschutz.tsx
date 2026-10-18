import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ShieldCheck, Server, Database, Cookie, Mail, Lock, UserCheck, AlertTriangle } from 'lucide-react';

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

        <div className="space-y-6 text-sm text-text-main/80 leading-relaxed">
          {/* 1. Verantwortlicher */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <UserCheck size={18} className="text-shiraz" /> 1. Verantwortlicher &amp; Datenschutzbeauftragter
            </h3>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Webseite im Sinne der Datenschutz-Grundverordnung (DSGVO) und des Bayerischen Datenschutzgesetzes (BayDSG) ist:
            </p>
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs sm:text-sm">
              <p className="font-bold text-text-main">Prof. Dr.-Ing. Jürgen Huber</p>
              <p>Technische Hochschule Augsburg · Fakultät für Architektur und Bauwesen</p>
              <p>An der Hochschule 1 · 86161 Augsburg</p>
              <p>E-Mail: <a href="mailto:juergen.huber@tha.de" className="text-shiraz hover:underline">juergen.huber@tha.de</a></p>
            </div>
            <p className="text-xs text-text-main/70 pt-1">
              Behördlicher Datenschutzbeauftragter der Technischen Hochschule Augsburg:<br />
              Technische Hochschule Augsburg · Der Datenschutzbeauftragte · An der Hochschule 1 · 86161 Augsburg<br />
              E-Mail: <a href="mailto:datenschutz@tha.de" className="text-shiraz hover:underline">datenschutz@tha.de</a>
            </p>
          </section>

          {/* 2. Hosting & Bereitstellung */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Server size={18} className="text-shiraz" /> 2. Hosting und Server-Logfiles
            </h3>
            <p>
              Diese Webanwendung wird über eine skalierbare Cloud-Container-Infrastruktur (Google Cloud Platform / Cloud Run) in Rechenzentren innerhalb der Europäischen Union betrieben.
            </p>
            <p>
              Beim Aufruf dieser Website erfasst der Webserver des Hosting-Anbieters automatisiert technische Protokolldaten (Server-Logfiles). Hierzu gehören u. a.:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-2">
              <li>IP-Adresse des zugreifenden Endgeräts (anonymisiert oder gekürzt gemäß Anbieter-Sicherheitsrichtlinie)</li>
              <li>Datum und Uhrzeit des Abrufs samt Zeitzone</li>
              <li>Aufgerufene URL und HTTP-Statuscode</li>
              <li>Übertragene Datenmenge in Bytes</li>
              <li>User-Agent (Browsertyp, Version und Betriebssystem)</li>
            </ul>
            <p className="text-xs text-text-main/70">
              Rechtsgrundlage für die temporäre Erfassung der Server-Logfiles ist Art. 6 Abs. 1 lit. f DSGVO zur Gewährleistung der Betriebssicherheit, Stabilität und Abwehr böswilliger Angriffe (DDoS).
            </p>
          </section>

          {/* 3. Cookies */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Cookie size={18} className="text-shiraz" /> 3. Cookies &amp; Externe Funktionen
            </h3>
            <p>
              Diese Anwendung verwendet grundsätzlich <strong>keine Tracking-, Marketing- oder Analyse-Cookies</strong>.
            </p>
            <p>
              Aus technischen Gründen können folgende Cookies relevant sein:
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-xs">
                <p><strong>Cookie &quot;GAESA&quot;:</strong> Technisches Session-/Routing-Cookie des Hosters zur sicheren Lastverteilung und Anbindung der Bereitstellungsumgebung. Es speichert keine persönlichen Nutzerprofile.</p>
              </div>
              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-xs">
                <p><strong>Optionale Tiefenübersetzung (Google Translate):</strong> Für internationale Studierende bietet die Anwendung eine optionale Übersetzungsfunktion. Diese wird erst bei aktiver Betätigung des Nutzers („Translate Deep Content“) aktiviert. Dabei wird ein temporäres Präferenz-Cookie (<code className="font-mono">googtrans</code>) gesetzt und das Skript des Google-Übersetzungsdienstes (Google LLC, USA) nachgeladen. Hierbei wird die IP-Adresse an Google übertragen. Rechtsgrundlage ist die aktive Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 25 Abs. 1 TDDDG.</p>
              </div>
            </div>
          </section>

          {/* 3b. Client-Side Berechnungsarchitektur & Keine Speicherung von Projektdaten */}
          <section className="space-y-2 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
            <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <Lock size={18} className="text-emerald-700" /> Reine Client-Side Berechnungen (Keine Server-Datenspeicherung)
            </h3>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              Alle auf dem BaustoffBoard durchgeführten Berechnungen (z. B. Mischungsberechnungen, U-Wert-Nachweise, Glaser-Verfahren, 
              Eurocode-2-Stahlbetonbemessungen, Fick-II-Chloriddiffusionen oder Schadensanalysen) erfolgen 
              <strong>vollständig und ausschließlich lokal im Browser auf Ihrem Endgerät (Client-Side Execution)</strong>. 
              Es werden zu keinem Zeitpunkt Projekt- oder Berechnungsdaten an externe Server übertragen, in Datenbanken persistiert 
              oder serverseitig ausgewertet. Das Hosting über Google Cloud Run dient rein der statischen Bereitstellung 
              der Webapplikation.
            </p>
          </section>

          {/* 4. Lokale Speicherung im Browser (localStorage) */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Database size={18} className="text-shiraz" /> 4. Lokale Datenspeicherung (localStorage)
            </h3>
            <p>
              Eingaben und Einstellungen bleiben ausschließlich in Ihrem Browser (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">localStorage</code>) gespeichert und werden nicht an unsere Server übertragen. Folgende Schlüssel werden zu didaktischen und ergonomischen Zwecken verwendet:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-home-grau/20 rounded-lg">
                <thead className="bg-off-white border-b border-home-grau/20">
                  <tr>
                    <th className="p-2.5 font-bold">Schlüssel</th>
                    <th className="p-2.5 font-bold">Zweck</th>
                    <th className="p-2.5 font-bold">Speicherdauer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/15">
                  <tr>
                    <td className="p-2.5 font-mono">baustoffboard_favorites</td>
                    <td className="p-2.5">Speicherung persönlicher Favoriten-Module für schnellen Zugriff</td>
                    <td className="p-2.5">Bis zur manuellen Löschung im Browser</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono">baustoffboard_recent</td>
                    <td className="p-2.5">Zuletzt besuchte Module zur nahtlosen Fortführung des Lernens</td>
                    <td className="p-2.5">Bis zur manuellen Löschung im Browser</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono">baustoffboard_theme</td>
                    <td className="p-2.5">Dunkel- / Hellmodus-Präferenz (Theme)</td>
                    <td className="p-2.5">Bis zur manuellen Löschung im Browser</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono">baustoffboard_lang</td>
                    <td className="p-2.5">Gewählte Sprache (Deutsch / Englisch)</td>
                    <td className="p-2.5">Bis zur manuellen Löschung im Browser</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono">baustoffboard_a11y</td>
                    <td className="p-2.5">Barrierefreiheits-Einstellungen (Schriftgröße, Kontrastmodus)</td>
                    <td className="p-2.5">Bis zur manuellen Löschung im Browser</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-main/70">
              Sie können diese Daten jederzeit in den Einstellungen Ihres Webbrowsers (Browser-Cache / Website-Daten) vollständig löschen.
            </p>
          </section>

          {/* 5. Kontaktaufnahme & Feedback */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Mail size={18} className="text-shiraz" /> 5. E-Mail-Feedback
            </h3>
            <p>
              Wenn Sie per E-Mail Kontakt aufnehmen (z. B. für Fehlermeldungen oder inhaltliche Fragen), werden Ihre Angaben inklusive der angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. e DSGVO i. V. m. dem Bayerischen Hochschulinnovationsgesetz (BayHIG) bzw. Art. 6 Abs. 1 lit. b DSGVO.
            </p>
          </section>

          {/* 6. Rechte der betroffenen Personen */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Lock size={18} className="text-shiraz" /> 6. Ihre Rechte
            </h3>
            <p>
              Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen (Art. 15 bis 21 DSGVO) jederzeit das Recht auf:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-2">
              <li>Auskunft über Ihre bei uns verarbeiteten personenbezogenen Daten</li>
              <li>Berichtigung unrichtiger oder Vervollständigung unvollständiger Daten</li>
              <li>Löschung Ihrer bei uns gespeicherten Daten</li>
              <li>Einschränkung der Datenverarbeitung</li>
              <li>Widerspruch gegen die Verarbeitung Ihrer Daten</li>
              <li>Datenübertragbarkeit</li>
            </ul>
          </section>

          {/* 7. Beschwerderecht */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <ShieldCheck size={18} className="text-shiraz" /> 7. Beschwerderecht bei der Aufsichtsbehörde
            </h3>
            <p>
              Im Falle datenschutzrechtlicher Verstöße steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Zuständige Aufsichtsbehörde für bayerische Hochschulen ist:
            </p>
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-xs">
              <p className="font-bold">Der Bayerische Landesbeauftragte für den Datenschutz (BayLfD)</p>
              <p>Wagmüllerstraße 18 · 80538 München</p>
              <p>Web: <a href="https://www.datenschutz-bayern.de" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline">www.datenschutz-bayern.de</a></p>
            </div>
          </section>
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
