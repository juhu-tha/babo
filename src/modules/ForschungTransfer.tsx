import React from 'react';
import { Landmark, FlaskConical, Building2, Microscope, GraduationCap, Mail, ArrowRight, ExternalLink } from 'lucide-react';
import { useTabContext } from '../contexts/TabContext';
import { MODUL_BY_ID, type ModulId } from '../registry/modules';

// Seite „Forschung und Transfer“ (Umsetzungsplan Phase 6, AP 6.10 Sichtbarkeit).
// Info-Seite ohne Fachinhalt (kein Prüfvermerk, siehe istFachmodul in src/data/pruefvermerke.ts).
// Inhaltsregel: nur Angaben, die auf öffentlichen Seiten der THA belegt sind, oder allgemeine
// Beschreibungen. Keine Projektpartner, Unternehmen, Fördermittelgeber, Budgets, unveröffentlichten
// Ergebnisse oder Details zu Zulassungsverfahren. Nicht belegte Angaben stehen als Platzhalter
// [Text durch Prof. Huber] und werden von Prof. Huber ersetzt oder gestrichen.

const STAND = '25.10.2026';
const FAKULTAET_URL = 'https://www.tha.de/hochschule/fakultaet/ab/';
const TTZ_URL = 'https://www.tha.de/forschung/technologietransfer/technologietransferzentren/ttz-aichach/';

/** Sichtbar markierter Platzhalter für noch zu liefernde Texte */
const Platzhalter = () => (
  <span className="italic border-b border-dashed border-current">[Text durch Prof. Huber]</span>
);

const Abschnitt = ({ id, icon: Icon, titel, children }: { id: string; icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>; titel: string; children: React.ReactNode }) => (
  <section aria-labelledby={id} className="space-y-3">
    <h3 id={id} className="text-base font-bold text-text-main flex items-center gap-2">
      <Icon size={18} className="text-shiraz shrink-0" aria-hidden /> {titel}
    </h3>
    {children}
  </section>
);

interface Thema {
  titel: string;
  text: string;
  module: readonly ModulId[];
}

// Forschungsthemen mit Verweis auf die vorhandenen Lernmodule (Beschreibungen allgemein gehalten)
const THEMEN: readonly Thema[] = [
  { titel: 'Biokohlebeton', text: 'Beton mit Pflanzenkohle als Beitrag zur Kohlenstoffspeicherung im Baustoff.', module: ['biokohlebeton'] },
  { titel: 'Schnellkarbonatisierung', text: 'Beschleunigte Karbonatisierungsprüfung zur Bewertung der Dauerhaftigkeit von Beton.', module: ['schnellkarbonatisierung'] },
  { titel: 'Altholz, NIR-Sortierung und Urban Mining', text: 'Sortierung und stoffliche Verwertung von Altholz aus dem Rückbau; Bauwerke als Rohstofflager.', module: ['altholz_urban_mining'] },
  { titel: 'PFAS in Baustoffen', text: 'Per- und polyfluorierte Alkylsubstanzen in Bauprodukten, Erkundung im Bestand und Rückbau.', module: ['pfas_baustoffe'] },
  { titel: 'Kreislaufwirtschaft und Ökobilanzierung', text: 'Stoffkreisläufe im Bauwesen, Ressourceneffizienz und Ökobilanz (LCA) von Baustoffen und Bauwerken.', module: ['kreislauf_dpp', 'ressourceneffizienz', 'oekobilanz_lca', 'lca_rechner'] },
];

const titelVon = (id: ModulId) => MODUL_BY_ID.get(id)?.baum?.titel ?? MODUL_BY_ID.get(id)?.label ?? id;

const linkKlasse = 'inline-flex items-center gap-1.5 text-shiraz font-semibold hover:underline focus-visible:underline';

const ModulLink = ({ id }: { id: ModulId }) => {
  const { setActiveTab } = useTabContext();
  return (
    <button type="button" onClick={() => setActiveTab(id)} className={`${linkKlasse} text-left min-h-6`}>
      <ArrowRight size={14} className="shrink-0" aria-hidden /> {titelVon(id)}
    </button>
  );
};

const Extern = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={linkKlasse}>
    {children} <ExternalLink size={14} className="shrink-0" aria-hidden />
    <span className="sr-only">(öffnet in neuem Fenster)</span>
  </a>
);

export default function ForschungTransfer() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Landmark className="text-shiraz shrink-0" aria-hidden /> Forschung und Transfer
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Stand: {STAND}
          </span>
        </div>

        <div className="space-y-8 text-sm text-text-main/80 leading-relaxed max-w-prose">
          <p>
            Das BaustoffBoard entsteht aus Lehre und Forschung an der Technischen Hochschule Augsburg (THA).
            Diese Seite gibt einen Überblick über das Lehrgebiet, den Bezug zum Technologietransferzentrum
            Aichach und die Forschungsthemen, zu denen es im BaustoffBoard eigene Lernmodule gibt.
          </p>

          <Abschnitt id="ft-lehrgebiet" icon={FlaskConical} titel="Lehrgebiet">
            <p>
              <strong>Werkstoffe und Stoffkreisläufe im Bauwesen</strong> – Prof. Dr.-Ing. Jürgen Huber,
              Fakultät für Architektur und Bauwesen der Technischen Hochschule Augsburg.
            </p>
            <p><Platzhalter /></p>
            <p className="font-semibold text-text-main flex items-center gap-2">
              <Microscope size={16} className="text-shiraz shrink-0" aria-hidden /> Baustofflabor
            </p>
            <p>
              Im Baustofflabor werden Baustoffe in Lehre und Forschung geprüft und untersucht. <Platzhalter />
            </p>
            <p>Hinweise zum sicheren Arbeiten im Labor: <ModulLink id="labor_sicherheit" /></p>
          </Abschnitt>

          <Abschnitt id="ft-ttz" icon={Building2} titel="Technologietransferzentrum (TTZ) Aichach">
            <p>
              Das TTZ Aichach ist ein Technologietransferzentrum der THA mit dem Schwerpunkt digitale Planung
              und Produktion im Bauwesen. Laut THA arbeitet es unter anderem zu Mauerwerksbau und digitalem
              Holzbau, ressourceneffizienten Baustoffen, additiven und digitalen Fertigungsverfahren und
              digitalen Planungswerkzeugen.
            </p>
            <ul className="list-disc list-outside space-y-1.5 pl-5">
              <li><strong>Forschung und Transfer:</strong> anwendungsnahe Forschung, deren Ergebnisse in Unternehmen und Bauprojekte überführt werden.</li>
              <li><strong>Weiterbildung:</strong> Aus- und Weiterbildungsangebote für Fachkräfte.</li>
            </ul>
            <p>Bezug des Lehrgebiets zum TTZ Aichach: <Platzhalter /></p>
            <p><Extern href={TTZ_URL}>TTZ Aichach auf tha.de</Extern></p>
          </Abschnitt>

          <Abschnitt id="ft-themen" icon={Microscope} titel="Forschungsthemen">
            <p>
              Zu den folgenden Themen bietet das BaustoffBoard Lernmodule mit Grundlagen, Rechenwegen und
              Selbsttests. Die Module vermitteln den allgemeinen Stand des Wissens; sie geben keine
              Projektergebnisse wieder.
            </p>
            <ul className="space-y-4">
              {THEMEN.map(t => (
                <li key={t.titel} className="p-4 bg-off-white rounded-xl border border-home-grau/20">
                  <p className="font-bold text-text-main">{t.titel}</p>
                  <p className="mt-1">{t.text}</p>
                  <ul className="mt-2 flex flex-col gap-1" aria-label={`Lernmodule zu ${t.titel}`}>
                    {t.module.map(id => <li key={id}><ModulLink id={id} /></li>)}
                  </ul>
                </li>
              ))}
            </ul>
          </Abschnitt>

          <Abschnitt id="ft-lehre" icon={GraduationCap} titel="Lehre">
            <p>
              Die Themen fließen in Lehrveranstaltungen der Bachelor- und Masterstudiengänge der Fakultät
              für Architektur und Bauwesen ein. <Platzhalter />
            </p>
            <p>Abschlussarbeiten und Semesterprojekte: <ModulLink id="thesen_projekte" /></p>
          </Abschnitt>

          <Abschnitt id="ft-kontakt" icon={Mail} titel="Kontakt">
            <p>
              Anfragen zu Forschung, Transfer und Abschlussarbeiten richten Sie bitte über die offiziellen
              Kontaktwege der Technischen Hochschule Augsburg an die Fakultät für Architektur und Bauwesen.
            </p>
            <p><Extern href={FAKULTAET_URL}>Fakultät für Architektur und Bauwesen auf tha.de</Extern></p>
            <p>Rechtliche Angaben zum BaustoffBoard: <ModulLink id="impressum" /></p>
          </Abschnitt>
        </div>
      </div>
    </div>
  );
}
