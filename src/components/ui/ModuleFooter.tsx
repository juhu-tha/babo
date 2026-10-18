import React, { useState } from 'react';
import { useTabContext } from '@/src/contexts/TabContext';
import { ShieldAlert, Scale, X } from 'lucide-react';
import { BookOpen, FileText, Calculator, Globe, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { FormulaText } from './FormulaText';
import { BlockMath } from 'react-katex';
import { getNormById, NormRecord } from '@/src/data/centralNormenRegistry';
import { resolveBibReference } from '@/src/data/bibliography';

interface ModuleFooterProps {
  /**
   * List of norms: can be a registry ID (e.g. 'DIN_EN_206'), a plain string, or an object with title and optional url.
   */
  regelwerke?: (string | { title: string; url?: string })[];
  /**
   * Convenience array of norm IDs directly looked up in the central registry
   */
  normIds?: string[];
  literatur?: string[];
  formeln?: { formel: string; erklaerung: string; quelle?: string }[];
  wikipedia?: { title: string; url: string }[];
  weblinks?: { title: string; url: string }[];
  /**
   * Revision date according to P22 requirement 4. Default: "nicht geprüft"
   */
  lastReviewed?: string;
  /**
   * Hide formula block if on meta/study/general pages according to P24 requirement 3
   */
  hideFormeln?: boolean;
}

export function ModuleFooter({
  regelwerke = [],
  normIds = [],
  literatur = [],
  formeln = [],
  wikipedia = [],
  weblinks = [],
  lastReviewed = 'nicht geprüft',
  hideFormeln = false
}: ModuleFooterProps) {
  const { setActiveTab } = useTabContext();
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  // Resolve all norms (both from normIds and regelwerke items)
  const resolvedRegelwerke: { title: string; url?: string; code?: string; status?: NormRecord['status'] }[] = [];

  // First process direct normIds
  normIds.forEach(id => {
    const record = getNormById(id);
    if (record) {
      resolvedRegelwerke.push({
        title: `${record.code} (${record.title})`,
        url: record.url,
        code: record.code,
        status: record.status
      });
    } else {
      resolvedRegelwerke.push({ title: id });
    }
  });

  // Then process regelwerke entries
  regelwerke.forEach(item => {
    if (typeof item === 'string') {
      const record = getNormById(item);
      if (record) {
        resolvedRegelwerke.push({
          title: `${record.code} (${record.title})`,
          url: record.url,
          code: record.code,
          status: record.status
        });
      } else {
        resolvedRegelwerke.push({ title: item });
      }
    } else {
      resolvedRegelwerke.push(item);
    }
  });

  // Resolve and filter literature: only verified entries (P21)
  const verifiedLiteratur: string[] = [];
  const seenBib = new Set<string>();

  literatur.forEach(item => {
    const resolved = resolveBibReference(item);
    if (resolved && !seenBib.has(resolved)) {
      seenBib.add(resolved);
      verifiedLiteratur.push(resolved);
    }
  });

  // Max 2 Wikipedia links per module (P21 point 6)
  const limitedWikipedia = (wikipedia || []).slice(0, 2);

  const hasRegelwerke = resolvedRegelwerke.length > 0;
  const hasLiteratur = verifiedLiteratur.length > 0 || (weblinks && weblinks.length > 0);
  const hasWikipedia = limitedWikipedia.length > 0;
  const hasFormeln = !hideFormeln && formeln && formeln.length > 0;

  if (!hasRegelwerke && !hasLiteratur && !hasWikipedia && !hasFormeln) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col mt-8 gap-6">
      {(hasRegelwerke || hasLiteratur || hasWikipedia) && (
        <div className={`grid grid-cols-1 ${hasRegelwerke && (hasLiteratur || hasWikipedia) ? 'md:grid-cols-2' : ''} gap-8`}>
          {hasRegelwerke && (
            <div>
              <h3 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
                <FileText size={20} className="text-shiraz" />
                Regelwerke &amp; Normen
              </h3>
              <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1.5">
                {resolvedRegelwerke.map((item, idx) => (
                  <li key={idx} className="leading-snug">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-shiraz hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        <FormulaText text={item.title} />
                        <ArrowUpRight size={12} className="opacity-70 shrink-0" />
                      </a>
                    ) : (
                      <FormulaText text={item.title} />
                    )}
                    {item.status === 'in_ueberarbeitung' && (
                      <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-shiraz/10 text-shiraz border border-shiraz/20">
                        In Überarbeitung
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(hasLiteratur || hasWikipedia) && (
            <div className="flex flex-col gap-5">
              {hasLiteratur && (
                <div>
                  <h3 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
                    <BookOpen size={20} className="text-shiraz" />
                    Literatur &amp; Vertiefung
                  </h3>
                  <ul className="list-disc list-inside text-sm text-text-main/80 space-y-1">
                    {verifiedLiteratur.map((item, idx) => (
                      <li key={idx}><FormulaText text={item} /></li>
                    ))}
                    {weblinks.map((item, idx) => (
                      <li key={`weblink-${idx}`}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline inline-flex items-center gap-1">
                          <Globe size={14} className="opacity-70" />
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Wikipedia-Links in eigenem Block: Zum Einstieg (nicht zitierfähig), max. 2 (P21) */}
              {hasWikipedia && (
                <div className="bg-off-white/80 p-3.5 rounded-xl border border-home-grau/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/70 mb-2 flex items-center gap-1.5">
                    <Globe size={13} className="text-shiraz" />
                    Zum Einstieg (nicht zitierfähig)
                  </h4>
                  <ul className="space-y-1 text-xs text-text-main/80">
                    {limitedWikipedia.map((item, idx) => (
                      <li key={`wiki-${idx}`}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-shiraz hover:underline inline-flex items-center gap-1"
                        >
                          <ArrowUpRight size={11} className="opacity-70" />
                          Wikipedia: {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {hasFormeln && (
        <div className={`mt-2 ${hasRegelwerke || hasLiteratur || hasWikipedia ? 'pt-6 border-t border-home-grau/20' : ''}`}>
          <h3 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
            <Calculator size={20} className="text-shiraz" />
            Verwendete Formeln &amp; Parameter
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {formeln.map((item, idx) => (
              <div key={idx} className="bg-off-white p-4 rounded-lg border border-home-grau/20">
                <div className="text-shiraz mb-2 overflow-x-auto">
                  <BlockMath math={item.formel} />
                </div>
                <FormulaText text={item.erklaerung} className="text-sm text-text-main/80 whitespace-pre-line block" />
                {item.quelle && (
                  <div className="mt-2 text-xs text-text-main/60 italic border-t border-home-grau/10 pt-2">
                    Quelle: <FormulaText text={item.quelle} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aktualitäts- & Revisions-Leiste nach P22 Anforderung 4 */}
      {/* Permanenter Ingenieur-Disclaimer & Rechtliche Pflichtangaben (DDG / DSGVO / BayBO / MVV TB) */}
      <div className="pt-4 border-t border-home-grau/20 flex flex-col gap-3 text-xs">
        {/* Haftungsausschluss Banner */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-start sm:items-center gap-2 text-[11px] leading-relaxed font-medium">
            <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Akademischer Vorbemessungs- &amp; Lehrhinweis:</strong> Alle Inhalte und Berechnungstools dienen ausschließlich Lehr- und wissenschaftlichen Vorbemessungszwecken. Ergebnisse ersetzen keinen bauaufsichtlichen Nachweis nach MVV TB / BayBO / MBO.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowDisclaimerModal(true)}
            className="text-[11px] font-bold text-shiraz hover:underline whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            Haftungsausschluss lesen →
          </button>
        </div>

        {/* Footer Meta Row: Stand, Prüfung, Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-text-main/65 text-[11px]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-shiraz shrink-0" />
            <span>Inhaltlich zuletzt geprüft: {lastReviewed} (Normenstand 2026)</span>
          </div>
          <div className="flex items-center gap-3 font-medium flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('impressum')}
              className="text-text-main/70 hover:text-shiraz hover:underline cursor-pointer"
            >
              Impressum (§ 5 DDG)
            </button>
            <span className="text-text-main/30">•</span>
            <button
              type="button"
              onClick={() => setActiveTab('datenschutz')}
              className="text-text-main/70 hover:text-shiraz hover:underline cursor-pointer"
            >
              Datenschutz (DSGVO)
            </button>
            <span className="text-text-main/30">•</span>
            <a
              href="mailto:juergen.huber@tha.de?subject=Aktualisierungsmeldung%20Norm%2FLink%20BaustoffBoard"
              className="text-shiraz hover:underline font-bold whitespace-nowrap"
            >
              Norm / Link melden →
            </a>
          </div>
        </div>
      </div>

      {/* Engineering Disclaimer Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-home-grau/30 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-text-main">
                <ShieldAlert size={20} className="text-shiraz" />
                Wichtiger Hinweis zur Haftung (Engineering Disclaimer)
              </div>
              <button
                type="button"
                onClick={() => setShowDisclaimerModal(false)}
                className="p-1 text-slate-400 hover:text-text-main rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/15 text-xs text-text-main/80 leading-relaxed space-y-2">
              <p className="font-medium text-slate-900">
                &bdquo;Wichtiger Hinweis zur Haftung: Alle auf dem BaustoffBoard bereitgestellten Informationen, Richtwerte, Datenbanken, Checklisten und interaktiven Berechnungsmodule (insb. zu Tragwerksplanung, Betontechnologie, Bauphysik, Chloriddiffusion und Instandsetzung) dienen ausschließlich akademischen Lehr-, Forschungs- und unverbindlichen Vorbemessungszwecken. Sie ersetzen in keinem Fall eine projektbezogene Baugrund-, Baustoff- oder Schadstoffuntersuchung, eine bauaufsichtlich geprüfte statische Berechnung, einen bauphysikalischen Nachweis oder eine Fachplanung durch einen Sachkundigen Planer (SKP) im Sinne der jeweiligen Landesbauordnung (BayBO / MBO) und der Technischen Baubestimmungen (MVV TB). Jegliche Haftung für unmittelbare oder mittelbare Schäden aus der Anwendung der Tools im Bau- oder Planungsbetrieb ist ausgeschlossen.&ldquo;
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDisclaimerModal(false)}
                className="px-4 py-2 bg-shiraz text-white font-bold text-xs rounded-xl shadow-xs hover:bg-shiraz/90 cursor-pointer"
              >
                Verstanden &amp; Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
