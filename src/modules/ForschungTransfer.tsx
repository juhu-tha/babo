import React from 'react';
import { Landmark, FlaskConical, Building2, Microscope, GraduationCap, Mail, ArrowRight, ExternalLink, Quote } from 'lucide-react';
import { useTabContext } from '../contexts/TabContext';
import { MODUL_BY_ID, type ModulId } from '../registry/modules';
import inhalt from '@/content/forschungtransfer/ForschungTransfer.json';
import { MdText } from '@/src/components/inhalt/MdText';
// Nur die Versionsnummer aus package.json (wie in src/App.tsx, zur Build-Zeit eingesetzt)
import { version as PAKET_VERSION } from '../../package.json';
import { isoZuDe, tagIso } from '../data/stand';

// Seite „Forschung und Transfer“ (Umsetzungsplan Phase 6, AP 6.10 Sichtbarkeit).
// Info-Seite ohne Fachinhalt (kein Prüfvermerk, siehe istFachmodul in src/data/pruefvermerke.ts).
// Inhaltsregel: nur Angaben, die auf öffentlichen Seiten der THA belegt sind, oder allgemeine
// Beschreibungen. Keine Projektpartner, Unternehmen, Fördermittelgeber, Budgets, unveröffentlichten
// Ergebnisse oder Details zu Zulassungsverfahren. Texte zu Lehrgebiet, Labor, TTZ-Bezug und
// Abschlussarbeiten nach Vorgabe (27.10.2026).

const STAND = '27.10.2026';
const FAKULTAET_URL = 'https://www.tha.de/hochschule/fakultaet/ab/';
const TTZ_URL = 'https://www.tha.de/forschung/technologietransfer/technologietransferzentren/ttz-aichach/';

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

// Versuchs-Handouts der Gruppe „Labor & Auswertung“ (src/registry/modules.ts)
const HANDOUTS: readonly ModulId[] = ['labor_frischbeton', 'labor_druckfestigkeit', 'labor_moertelprismen', 'labor_potentialmessung', 'labor_auslagerung'];

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

          <Abschnitt id="ft-lehrgebiet" icon={FlaskConical} titel="Professur">
            <p><MdText text={inhalt.texte.werkstoffeUndStoffkreisläufeIm} /></p>
            <p><MdText text={inhalt.texte.schwerpunkteDesLehrgebiets} /></p>
            <p className="font-semibold text-text-main flex items-center gap-2">
              <Microscope size={16} className="text-shiraz shrink-0" aria-hidden /> Baustofflabor
            </p>
            <p><MdText text={inhalt.texte.imBaustofflaborWerdenBaustoffe} /><MdText text={inhalt.texte.laborSchwerpunkte} /></p>
            <div>
              <p><MdText text={inhalt.texte.versuchsHandoutsImBaustoffboard} /></p>
              <ul className="mt-1 flex flex-col gap-1" aria-label={inhalt.texte.versuchsHandoutsImBaustoffboard}>
                {HANDOUTS.map(id => <li key={id}><ModulLink id={id} /></li>)}
              </ul>
            </div>
            <p><MdText text={inhalt.texte.hinweiseZumSicherenArbeiten} /><MdText text={inhalt.texte.laborordnungUndSicherheitsunterweisung} /><ModulLink id="labor_sicherheit" /></p>
          </Abschnitt>

          <Abschnitt id="ft-ttz" icon={Building2} titel={inhalt.werte.technologietransferzentrumTtzAichach}>
            <p><MdText text={inhalt.texte.dasTtzAichachIst} /></p>
            <ul className="list-disc list-outside space-y-1.5 pl-5">
              <li><MdText text={inhalt.texte.forschungUndTransferAnwendungsnahe} /></li>
              <li><MdText text={inhalt.texte.weiterbildungAusUndWeiterbildungsangebot} /></li>
            </ul>
            <p><MdText text={inhalt.texte.bezugDesLehrgebietsZum} /><MdText text={inhalt.texte.profHuberIstMitglied} /></p>
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
            <p><MdText text={inhalt.texte.dieThemenFließenIn} /></p>
            <p><MdText text={inhalt.texte.abschlussarbeitenUndSemesterprojekte} /><MdText text={inhalt.texte.abschlussarbeitenLaufendMöglich} /><ModulLink id="thesen_projekte" /></p>
          </Abschnitt>

          <Abschnitt id="ft-kontakt" icon={Mail} titel="Kontakt">
            <p><MdText text={inhalt.texte.anfragenZuForschungTransfer} /></p>
            <p><MdText text={inhalt.texte.veröffentlichungenAufThaSeiten} /></p>
            <p><Extern href={FAKULTAET_URL}>{inhalt.werte.fakultätFürArchitekturUnd}</Extern></p>
            <p><MdText text={inhalt.texte.rechtlicheAngabenZumBaustoffboard} /><ModulLink id="impressum" /></p>
          </Abschnitt>

          <Abschnitt id="ft-zitieren" icon={Quote} titel="BaustoffBoard zitieren">
            <p><MdText text={inhalt.texte.zitierenEinleitung} /></p>
            <p className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-text-main">
              <MdText text={inhalt.texte.zitatVorVersion} />{PAKET_VERSION}<MdText text={`${inhalt.texte.zitatNachVersion}${isoZuDe(tagIso())}.`} />
            </p>
            <p className="text-xs"><MdText text={inhalt.texte.zitierenHinweisDatum} /></p>
          </Abschnitt>
        </div>
      </div>
    </div>
  );
}
