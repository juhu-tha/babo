import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Accessibility, ClipboardCheck, AlertTriangle, Mail, Scale } from 'lucide-react';

// Erklärung zur Barrierefreiheit nach Art. 13 BayBGG i. V. m. § 11 BayDiV und Richtlinie (EU) 2016/2102
// (Umsetzungsplan Phase 1, AP 1.4). Liste der Mängel nach jeder Prüfung aktualisieren (Phase 2, AP 2.1).

const STAND = '23.10.2026';

const Abschnitt = ({ icon: Icon, titel, children }: { icon: React.ComponentType<{ size?: number; className?: string }>; titel: string; children: React.ReactNode }) => (
  <section className="space-y-2">
    <h3 className="text-base font-bold text-text-main flex items-center gap-2">
      <Icon size={18} className="text-shiraz" /> {titel}
    </h3>
    {children}
  </section>
);

export default function Barrierefreiheit() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Accessibility className="text-shiraz" /> Erklärung zur Barrierefreiheit
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Stand: {STAND}
          </span>
        </div>

        <div className="space-y-6 text-sm text-text-main/80 leading-relaxed max-w-prose">
          <p>
            Die Technische Hochschule Augsburg ist bemüht, ihre Webangebote im Einklang mit Art. 13 des Bayerischen
            Behindertengleichstellungsgesetzes (BayBGG) und der Bayerischen Digitalverordnung (BayDiV) barrierefrei
            zugänglich zu machen. Diese Erklärung gilt für die Webanwendung BaustoffBoard (baustoffboard.de).
          </p>

          <Abschnitt icon={ClipboardCheck} titel="Stand der Vereinbarkeit mit den Anforderungen">
            <p>
              Die Webanwendung ist mit den Anforderungen der Barrierefreien-Informationstechnik-Verordnung (BITV 2.0)
              bzw. der harmonisierten Norm EN 301 549 (WCAG 2.1, Stufe AA) <strong>teilweise vereinbar</strong>.
              Die unten aufgeführten Inhalte sind nicht barrierefrei. Die Mängel werden nach dem veröffentlichten
              Umsetzungsplan bis Januar 2027 behoben.
            </p>
          </Abschnitt>

          <Abschnitt icon={AlertTriangle} titel="Nicht barrierefreie Inhalte">
            <ul className="list-disc list-outside space-y-1.5 pl-5">
              <li>Bei einigen Schaltflächen stimmt der für Screenreader hinterlegte Name nicht mit der sichtbaren Beschriftung überein; auf Mobilgeräten fehlt bei einzelnen Symbol-Schaltflächen ein Name.</li>
              <li>Einzelne Texte und Ergebnisfelder erreichen nicht das geforderte Kontrastverhältnis, insbesondere im Dunkelmodus von Rechnern.</li>
              <li>Ein Link zum Überspringen der Navigation fehlt; Hauptüberschrift und Hauptbereich sind auf einer Seite mehrfach ausgezeichnet.</li>
              <li>Ausgeklappte und eingeklappte Menügruppen werden Screenreadern nicht mitgeteilt; das geschlossene Menü ist auf Mobilgeräten noch per Tastatur erreichbar.</li>
              <li>Auf schmalen Bildschirmen (unter 400 px) werden Teile der Kopfzeile und einzelne Tabellen und Diagramme abgeschnitten; einige Bedienelemente sind kleiner als 24 × 24 Pixel.</li>
              <li>Diagramme und interaktive Grafiken haben teilweise keine gleichwertige Textalternative.</li>
              <li>Die Suche findet nur Menüeinträge, nicht den Inhalt der Module.</li>
            </ul>
          </Abschnitt>

          <Abschnitt icon={ClipboardCheck} titel="Erstellung dieser Erklärung">
            <p>
              Diese Erklärung wurde am {STAND} erstellt. Grundlage ist eine Selbstbewertung: eine automatisierte
              Prüfung mit axe-core auf 13 repräsentativen Seiten in Desktop- und Mobilansicht, jeweils im Hell- und
              Dunkelmodus, ergänzt um eine manuelle Prüfung der Tastaturbedienung.
            </p>
          </Abschnitt>

          <Abschnitt icon={Mail} titel="Feedback und Kontakt">
            <p>
              Sind Ihnen Mängel beim barrierefreien Zugang aufgefallen? Dann melden Sie sich gern, wir antworten
              innerhalb von sechs Wochen. Auf Wunsch stellen wir Inhalte auch in einer barrierefreien Form zur Verfügung.
            </p>
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs sm:text-sm">
              <p className="font-bold text-text-main">Prof. Dr.-Ing. Jürgen Huber</p>
              <p>Technische Hochschule Augsburg · An der Hochschule 1 · 86161 Augsburg</p>
              <p>E-Mail: <a href="mailto:juergen.huber@tha.de?subject=Barrierefreiheit%20BaustoffBoard" className="text-shiraz hover:underline">juergen.huber@tha.de</a></p>
            </div>
          </Abschnitt>

          <Abschnitt icon={Scale} titel="Durchsetzungsverfahren">
            <p>
              Wenn Sie auf Ihre Rückmeldung keine zufriedenstellende Antwort erhalten, können Sie sich an die
              Durchsetzungsstelle wenden und eine Prüfung nach § 11 BayDiV beantragen:
            </p>
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs sm:text-sm">
              <p className="font-bold text-text-main">Landesamt für Digitalisierung, Breitband und Vermessung</p>
              <p>IT-Dienstleistungszentrum des Freistaats Bayern</p>
              <p>Durchsetzungs- und Überwachungsstelle für barrierefreie Informationstechnik</p>
              <p>St.-Martin-Straße 47 · 81541 München</p>
              <p>E-Mail: <a href="mailto:bitv@bayern.de" className="text-shiraz hover:underline">bitv@bayern.de</a></p>
              <p>Web: <a href="https://www.ldbv.bayern.de/digitalisierung/bitv.html" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline">www.ldbv.bayern.de/digitalisierung/bitv.html</a></p>
            </div>
          </Abschnitt>
        </div>
      </div>

      <ModuleFooter
        regelwerke={[
          { title: 'Richtlinie (EU) 2016/2102 über den barrierefreien Zugang zu Websites öffentlicher Stellen', url: 'https://eur-lex.europa.eu/eli/dir/2016/2102/oj' },
          { title: 'Bayerisches Behindertengleichstellungsgesetz (BayBGG), Art. 13', url: 'https://www.gesetze-bayern.de/Content/Document/BayBGG' },
          { title: 'Bayerische Digitalverordnung (BayDiV)', url: 'https://www.gesetze-bayern.de/Content/Document/BayDiV' },
          { title: 'EN 301 549 V3.2.1 (2021-03) Barrierefreiheitsanforderungen für IKT-Produkte und -Dienstleistungen' }
        ]}
        hideFormeln={true}
      />
    </div>
  );
}
