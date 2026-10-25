import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Mail, MapPin, Building2, User, Link as LinkIcon, FileText, Globe } from 'lucide-react';
import { LIZENZ_AKTIV, IMPRESSUM_URHEBERRECHT_OFFEN } from '@/src/data/lizenzTexte';

export default function Impressum() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <User className="text-shiraz" /> Impressum gemäß § 5 DDG &amp; § 18 MStV
            </h2>
            <p className="text-xs text-text-main/70 mt-1">
              Gesetzliche Pflichtangaben nach dem Digitale-Dienste-Gesetz (DDG) und dem Medienstaatsvertrag (MStV)
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap self-start sm:self-auto">
            Stand 2026
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-300">
          <div className="flex-1 space-y-4 text-text-main/80">
            <div>
              <h3 className="font-bold text-lg text-home-prim">Prof. Dr.-Ing. Jürgen Huber</h3>
              <p className="text-shiraz font-medium">Professor für Werkstoffe und Stoffkreisläufe im Bauwesen</p>
              <p className="text-sm mt-2 font-medium">Interaktive Lern- und Wissensplattform für Baustoffkunde, Werkstoffmechanik, Bauen im Bestand, Kreislaufwirtschaft, Nachhaltiges Bauen & Co.</p>
            </div>
            
            <div className="space-y-3 mt-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-home-prim/70 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Technische Hochschule Augsburg (THA)</p>
                  <p className="text-xs text-text-main/80">Körperschaft des öffentlichen Rechts / Staatliche Hochschule</p>
                  <p className="text-xs text-text-main/70">Fakultät für Architektur und Bauwesen</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-home-prim/70 shrink-0 mt-0.5" />
                <div>
                  <p>An der Hochschule 1</p>
                  <p>86161 Augsburg</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-home-prim/70 shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:juergen.huber@tha.de" className="hover:text-shiraz transition-colors">
                    juergen.huber@tha.de
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-home-prim/70 shrink-0 mt-0.5" />
                <div>
                  <span className="text-text-main/80 font-mono text-xs">
                    Tel.: +49 (0) 821 5586-0 (Zentrale THA) · Fakultät Architektur und Bauwesen
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <LinkIcon className="w-5 h-5 text-home-prim/70 shrink-0 mt-0.5" />
                <div>
                  <a href="https://www.tha.de/hochschule/fakultaet/ab/kontakt/juergen-huber/" target="_blank" rel="noopener noreferrer" className="hover:text-shiraz transition-colors">
                    Profil an der Technischen Hochschule Augsburg (THA)
                  </a>
                </div>
              </div>
            </div>

            {/* Academic Context & Lehrausrichtung block */}
            <div className="mt-6 bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 text-xs sm:text-sm text-text-main/80">
              <div className="p-3 bg-off-white dark:bg-slate-800 border border-home-grau/25 dark:border-slate-700 rounded-lg text-text-main/80 dark:text-slate-300 text-xs">
                <strong>Art des Angebots:</strong> Wissenschaftliches Lehr- und Transferportal zur digitalen Unterstützung von Lehre und Studium im Fachbereich Bauingenieurwesen an der Technischen Hochschule Augsburg.
              </div>
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">Hintergrund &amp; Lehrausrichtung</h4>
              <p className="leading-relaxed">
                Dieses interaktive Werkzeug basiert auf den wissenschaftlichen und praxisorientierten Lehrveranstaltungen von <strong>Prof. Dr.-Ing. Jürgen Huber</strong> an der <strong>Technischen Hochschule Augsburg (THA)</strong> in den folgenden Fachdisziplinen:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-bold text-shiraz mb-1.5 uppercase tracking-wider text-[11px]">Integrierte Lehrgebiete:</h5>
                  <ul className="list-disc list-inside space-y-1 text-xs pl-1 font-medium">
                    <li>Baustoffkunde / Werkstoffkunde</li>
                    <li>Recycling, Abfälle, Altlasten</li>
                    <li>Stahlbetoninstandhaltung</li>
                    <li>Bauen im Bestand</li>
                    <li>Bauschäden</li>
                    <li>Nachhaltiges Bauen</li>
                    <li>Beton- und Spannbetonbau</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-shiraz mb-1.5 uppercase tracking-wider text-[11px]">In den Studiengängen:</h5>
                  <ul className="list-disc list-inside space-y-1 text-xs pl-1 font-medium">
                    <li>Bauingenieurwesen</li>
                    <li>Architektur</li>
                    <li>Energieeffizientes Planen und Bauen</li>
                    <li>Digitaler Baumeister</li>
                    <li>Nachhaltigkeitsmanagement</li>
                    <li>Rettungsingenieurwesen</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Legal Evaluation and Sufficiency Check / Haftungsausschluss */}
            <div className="mt-8 pt-6 border-t border-home-grau/20 space-y-4 text-xs text-text-main/70">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-1.5 pt-2">
                <FileText size={16} className="text-shiraz" />
                Rechtliche Hinweise &amp; Angaben gemäß § 5 DDG / § 18 MStV
              </h4>
              
              <p>
                <strong>Diensteanbieter gemäß § 5 DDG:</strong> Technische Hochschule Augsburg (THA), Fakultät für Architektur und Bauwesen, An der Hochschule 1, 86161 Augsburg. Die THA ist eine Körperschaft des öffentlichen Rechts und zugleich staatliche Einrichtung des Freistaats Bayern. Sie wird gesetzlich vertreten durch den Präsidenten, Prof. Dr. Dr. h. c. Gordon Thomas Rohrmair.
              </p>

              <p>
                <strong>Zuständige Aufsichtsbehörde:</strong> Bayerisches Staatsministerium für Wissenschaft und Kunst, Salvatorstraße 2, 80333 München.
              </p>

              <p>
                <strong>Inhaltlich Verantwortlicher gemäß § 18 Abs. 2 MStV:</strong> Prof. Dr.-Ing. Jürgen Huber, Technische Hochschule Augsburg, Fakultät für Architektur und Bauwesen, An der Hochschule 1, 86161 Augsburg (E-Mail: juergen.huber@tha.de).
              </p>

              <p>
                <strong>Haftung für Inhalte:</strong> Die Inhalte dieser Webanwendung (Lern- und Rechenmodule, Kennwerte, Aufgaben) wurden mit größtmöglicher Sorgfalt erstellt. Sie dienen ausschließlich Lehr- und Informationszwecken im Rahmen des Studiums und der wissenschaftlichen Weiterbildung. Eine Gewähr für die Richtigkeit, Vollständigkeit, Aktualität und Eignung der Berechnungen für reale baupraktische Anwendungsfälle wird ausdrücklich nicht übernommen.
              </p>
              
              <p>
                <strong>Haftung für Links:</strong> Diese Anwendung enthält Links zu externen Webseiten Dritter. Auf deren Inhalte haben wir keinen Einfluss; deshalb distanzieren wir uns hiermit ausdrücklich von den Inhalten aller verlinkten Seiten und übernehmen für diese Fremdinhalte keine Gewähr. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
              
              <p>
                <strong>Urheberrecht &amp; Normenzitate:</strong>{' '}
                {/* AP 6.8: offener Lizenztext erst nach THA-Freigabe (src/data/lizenz.ts) */}
                {LIZENZ_AKTIV ? IMPRESSUM_URHEBERRECHT_OFFEN : <>Die auf dieser Seite bereitgestellten Inhalte, Diagramme, interaktiven Berechnungsmodule und Grafiken unterliegen dem deutschen Urheberrecht. Vervielfältigungen, Bearbeitungen, Verbreitungen und Verwertungen außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des Autors. DIN, EN, ISO, Eurocode und DIBt sind eingetragene Bezeichnungen bzw. Markenzeichen der jeweiligen Normungsorganisationen. Ihre Nennung sowie der Verweis auf Berechnungsformeln und Grenzwerte erfolgt ausschließlich zu wissenschaftlichen Lehr-, Erläuterungs- und Belegzwecken gemäß § 51 UrhG (Zitatrecht).</>}
              </p>
            </div>

          </div>
        </div>
      </div>
      
      <ModuleFooter 
        wikipedia={[
          { title: 'Digitale-Dienste-Gesetz', url: 'https://de.wikipedia.org/wiki/Digitale-Dienste-Gesetz' },
          { title: 'Datenschutz-Grundverordnung', url: 'https://de.wikipedia.org/wiki/Datenschutz-Grundverordnung' }
        ]} 
        literatur={[
          'Spindler, G.; Schuster, F. (2021): Recht der elektronischen Medien: Kommentar (C.H. Beck)',
          'Kühling, J.; Buchner, B.: DS-GVO / BDSG: Kommentar (C.H. Beck)'
        ]} 
        regelwerke={[
          { title: 'Digitale-Dienste-Gesetz (DDG § 5 Allgemeine Informationspflichten)', url: 'https://www.gesetze-im-internet.de/ddg/' },
          { title: 'Medienstaatsvertrag (MStV § 18)', url: 'https://www.die-medienanstalten.de/' },
          { title: 'Datenschutz-Grundverordnung (EU-DSGVO Art. 13 & 14)', url: 'https://eur-lex.europa.eu/' }
        ]}
        hideFormeln={true}
      />
    </div>
  );
}
