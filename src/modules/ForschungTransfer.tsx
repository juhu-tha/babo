import React from 'react';
import { Landmark, FlaskConical, Building2, Microscope, GraduationCap, Mail, ArrowRight, ExternalLink } from 'lucide-react';
import { useTabContext } from '../contexts/TabContext';
import { MODUL_BY_ID, type ModulId } from '../registry/modules';
import inhalt from '@/content/forschungtransfer/ForschungTransfer.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
  <span className="italic border-b border-dashed border-current"><MdText text={inhalt.texte.textDurchProfHuber} /></span>
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
  { titel: 'Biokohlebeton', text: inhalt.werte.betonMitPflanzenkohleAls, module: ['biokohlebeton'] },
  { titel: 'Schnellkarbonatisierung', text: inhalt.werte.beschleunigteKarbonatisierungsprüfungZur, module: ['schnellkarbonatisierung'] },
  { titel: inhalt.werte.altholzNirSortierungUnd, text: inhalt.werte.sortierungUndStofflicheVerwertung, module: ['altholz_urban_mining'] },
  { titel: inhalt.werte.pfasInBaustoffen, text: inhalt.werte.perUndPolyfluorierteAlkylsubstanzen, module: ['pfas_baustoffe'] },
  { titel: inhalt.werte.kreislaufwirtschaftUndÖkobilanzierung, text: inhalt.werte.stoffkreisläufeImBauwesenRessourceneffiz, module: ['kreislauf_dpp', 'ressourceneffizienz', 'oekobilanz_lca', 'lca_rechner'] },
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
    <span className="sr-only"><MdText text={inhalt.texte.öffnetInNeuemFenster} /></span>
  </a>
);

export default function ForschungTransfer() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Landmark className="text-shiraz shrink-0" aria-hidden /><MdText text={inhalt.texte.forschungUndTransfer} /></h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Stand: {STAND}
          </span>
        </div>

        <div className="space-y-8 text-sm text-text-main/80 leading-relaxed max-w-prose">
          <p><MdText text={inhalt.texte.dasBaustoffboardEntstehtAus} /></p>

          <Abschnitt id="ft-lehrgebiet" icon={FlaskConical} titel="Lehrgebiet">
            <p><MdText text={inhalt.texte.werkstoffeUndStoffkreisläufeIm} /></p>
            <p><Platzhalter /></p>
            <p className="font-semibold text-text-main flex items-center gap-2">
              <Microscope size={16} className="text-shiraz shrink-0" aria-hidden /> Baustofflabor
            </p>
            <p><MdText text={inhalt.texte.imBaustofflaborWerdenBaustoffe} /><Platzhalter />
            </p>
            <p><MdText text={inhalt.texte.hinweiseZumSicherenArbeiten} /><ModulLink id="labor_sicherheit" /></p>
          </Abschnitt>

          <Abschnitt id="ft-ttz" icon={Building2} titel={inhalt.werte.technologietransferzentrumTtzAichach}>
            <p><MdText text={inhalt.texte.dasTtzAichachIst} /></p>
            <ul className="list-disc list-outside space-y-1.5 pl-5">
              <li><MdText text={inhalt.texte.forschungUndTransferAnwendungsnahe} /></li>
              <li><MdText text={inhalt.texte.weiterbildungAusUndWeiterbildungsangebot} /></li>
            </ul>
            <p><MdText text={inhalt.texte.bezugDesLehrgebietsZum} /><Platzhalter /></p>
            <p><Extern href={TTZ_URL}>{inhalt.werte.ttzAichachAufTha}</Extern></p>
          </Abschnitt>

          <Abschnitt id="ft-themen" icon={Microscope} titel="Forschungsthemen">
            <p><MdText text={inhalt.texte.zuDenFolgendenThemen} /></p>
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
            <p><MdText text={inhalt.texte.dieThemenFließenIn} /><Platzhalter />
            </p>
            <p><MdText text={inhalt.texte.abschlussarbeitenUndSemesterprojekte} /><ModulLink id="thesen_projekte" /></p>
          </Abschnitt>

          <Abschnitt id="ft-kontakt" icon={Mail} titel="Kontakt">
            <p><MdText text={inhalt.texte.anfragenZuForschungTransfer} /></p>
            <p><Extern href={FAKULTAET_URL}>{inhalt.werte.fakultätFürArchitekturUnd}</Extern></p>
            <p><MdText text={inhalt.texte.rechtlicheAngabenZumBaustoffboard} /><ModulLink id="impressum" /></p>
          </Abschnitt>
        </div>
      </div>
    </div>
  );
}
