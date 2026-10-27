import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Accessibility, ClipboardCheck, AlertTriangle, Mail, Scale } from 'lucide-react';
import inhalt from '@/content/barrierefreiheit/Barrierefreiheit.json';
import { MdText } from '@/src/components/inhalt/MdText';

// Erklärung zur Barrierefreiheit nach Art. 14 BayBGG i. V. m. §§ 9–11 BayDiV (§ 9 Abs. 1 → § 3 Abs. 1 BITV 2.0) und Richtlinie (EU) 2016/2102
// (Umsetzungsplan Phase 1, AP 1.4). Liste der Mängel nach jeder Prüfung aktualisieren (Phase 2, AP 2.1).

const STAND = '27.10.2026';

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
            <Accessibility className="text-shiraz" /><MdText text={inhalt.texte.erklärungZurBarrierefreiheit} /></h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Stand: {STAND}
          </span>
        </div>

        <div className="space-y-6 text-sm text-text-main/80 leading-relaxed max-w-prose">
          <p><MdText text={inhalt.texte.dieTechnischeHochschuleAugsburg} /></p>

          <Abschnitt icon={ClipboardCheck} titel={inhalt.werte.standDerVereinbarkeitMit}>
            <p><MdText text={inhalt.texte.dieWebanwendungIstMit} /></p>
          </Abschnitt>

          <Abschnitt icon={AlertTriangle} titel={inhalt.werte.nichtBarrierefreieInhalte}>
            <ul className="list-disc list-outside space-y-1.5 pl-5">
              <li><MdText text={inhalt.texte.reiterleistenOhneTablist} /></li>
              <li><MdText text={inhalt.texte.diagrammeUndInteraktiveGrafiken} /></li>
              <li><MdText text={inhalt.texte.formelnMathematisch} /></li>
              <li><MdText text={inhalt.texte.nutzertestAusstehend} /></li>
            </ul>
          </Abschnitt>

          <Abschnitt icon={ClipboardCheck} titel={inhalt.werte.erstellungDieserErklärung}>
            <p><MdText text={inhalt.texte.dieseErklärungWurdeAm} />{STAND}<MdText text={inhalt.texte.erstelltGrundlageIstEine} /></p>
          </Abschnitt>

          <Abschnitt icon={Mail} titel={inhalt.werte.feedbackUndKontakt}>
            <p><MdText text={inhalt.texte.sindIhnenMängelBeim} /></p>
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs sm:text-sm">
              <p className="font-bold text-text-main"><MdText text={inhalt.texte.profDrIngJürgen} /></p>
              <p><MdText text={inhalt.texte.technischeHochschuleAugsburgAn} /></p>
              <p>E-Mail: <a href="mailto:juergen.huber@tha.de?subject=Barrierefreiheit%20BaustoffBoard" className="text-shiraz hover:underline">juergen.huber@tha.de</a></p>
            </div>
          </Abschnitt>

          <Abschnitt icon={Scale} titel="Durchsetzungsverfahren">
            <p><MdText text={inhalt.texte.wennSieAufIhre} /></p>
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs sm:text-sm">
              <p className="font-bold text-text-main"><MdText text={inhalt.texte.landesamtFürDigitalisierungBreitband} /></p>
              <p><MdText text={inhalt.texte.itDienstleistungszentrumDesFreistaats} /></p>
              <p><MdText text={inhalt.texte.durchsetzungsUndÜberwachungsstelleFür} /></p>
              <p><MdText text={inhalt.texte.stMartinStraße47} /></p>
              <p>E-Mail: <a href="mailto:bitv@bayern.de" className="text-shiraz hover:underline">bitv@bayern.de</a></p>
              <p>Web: <a href="https://www.ldbv.bayern.de/digitalisierung/bitv/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline">www.ldbv.bayern.de/digitalisierung/bitv/</a></p>
            </div>
          </Abschnitt>
        </div>
      </div>

      <ModuleFooter
        regelwerke={inhalt.daten["Barrierefreiheit.regelwerke"]}
        hideFormeln={true}
      />
    </div>
  );
}
