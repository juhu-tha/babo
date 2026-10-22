import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Box, 
  Scissors, 
  Columns, 
  CircleDashed, 
  GitCommit,
  Layers,
  Activity,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import SpannungDehnung from './SpannungDehnung';
import Biegebemessung from './Biegebemessung';
import Querkraftbemessung from './Querkraftbemessung';
import Stuetzenbemessung from './Stuetzenbemessung';
import Durchstanzen from './Durchstanzen';
import Verankerungslaenge from './Verankerungslaenge';
import Rissbreite from './Rissbreite';
import StahlbetonNullBisHundert from './stahlbeton/StahlbetonNullBisHundert';

export type BemessungSubTab = 
  | 'null_bis_hundert'
  | 'spannung'
  | 'biegebemessung' 
  | 'querkraftbemessung' 
  | 'stuetzenbemessung' 
  | 'durchstanzen' 
  | 'verankerungslaenge'
  | 'rissbreite'
  | 'ec2_generation2';

export default function Stahlbetonbemessung({ initialTab }: { initialTab?: BemessungSubTab }) {
  const { activeTab, setActiveTab } = useTabContext();

  // Determine initial subtab based on prop, activeTab or window hash
  const getInitialSubTab = (): BemessungSubTab => {
    if (initialTab) return initialTab;
    if ((activeTab as string) === 'null_bis_hundert') return 'null_bis_hundert';
    if (activeTab === 'spannung') return 'spannung';
    if (activeTab === 'querkraftbemessung') return 'querkraftbemessung';
    if (activeTab === 'stuetzenbemessung') return 'stuetzenbemessung';
    if (activeTab === 'durchstanzen') return 'durchstanzen';
    if (activeTab === 'verankerungslaenge') return 'verankerungslaenge';
    if (activeTab === 'rissbreite') return 'rissbreite';
    if (activeTab === 'biegebemessung') return 'biegebemessung';

    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.toLowerCase().replace(/^#/, '');
      if (h.includes('0-100') || h.includes('null_bis_hundert') || h.includes('guide')) return 'null_bis_hundert';
      if (h.includes('spannung') || h.includes('dehnung')) return 'spannung';
      if (h.includes('querkraft')) return 'querkraftbemessung';
      if (h.includes('stuetz')) return 'stuetzenbemessung';
      if (h.includes('durchstanz')) return 'durchstanzen';
      if (h.includes('verankerung')) return 'verankerungslaenge';
      if (h.includes('riss')) return 'rissbreite';
      if (h.includes('bieg')) return 'biegebemessung';
    }
    return 'null_bis_hundert';
  };

  const [currentTab, setCurrentTab] = useState<BemessungSubTab>(getInitialSubTab);

  // Sync state if initialTab or activeTab changes from outside (e.g. search, quiz, cross-link)
  useEffect(() => {
    if (initialTab) setCurrentTab(initialTab);
    else if ((activeTab as string) === 'null_bis_hundert') setCurrentTab('null_bis_hundert');
    else if (activeTab === 'spannung') setCurrentTab('spannung');
    else if (activeTab === 'querkraftbemessung') setCurrentTab('querkraftbemessung');
    else if (activeTab === 'stuetzenbemessung') setCurrentTab('stuetzenbemessung');
    else if (activeTab === 'durchstanzen') setCurrentTab('durchstanzen');
    else if (activeTab === 'verankerungslaenge') setCurrentTab('verankerungslaenge');
    else if (activeTab === 'rissbreite') setCurrentTab('rissbreite');
    else if (activeTab === 'biegebemessung') setCurrentTab('biegebemessung');
  }, [initialTab, activeTab]);

  const handleTabChange = (tab: BemessungSubTab) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', `#${tab}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Central Header & Tab Selector Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Calculator className="text-shiraz h-6 w-6" />
              Stahlbeton (DIN EN 1992-1-1 / Eurocode 2)
            </h2>
            <p className="text-xs text-text-main/70 mt-1">
              Integrierte Werkstoffgesetze (Spannung-Dehnung) &amp; Bauteilbemessung nach DIN EN 1992-1-1 für Biegung, Querkraft, Stützen, Durchstanzen, Verankerung &amp; Rissbreite
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap">
            DIN EN 1992-1-1 + NA (DE)
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed mb-6">
          <p>
            Zentrales Berechnungsmodul für den Stahlbetonbau: Wählen Sie über die sieben Reiter das gewünschte 
            Thema nach DIN EN 1992-1-1 (Eurocode 2 mit deutschem Nationalen Anhang). 
            Das Modul umfasst die grundlegenden Werkstoffgesetze (Spannungs-Dehnungs-Diagramme für Beton und Betonstahl), 
            alle wesentlichen Nachweise im Grenzzustand der Tragfähigkeit (GZT: Biegung, Querkraft, 
            Stützen, Durchstanzen, Verankerungslänge) sowie im Grenzzustand der Gebrauchstauglichkeit (GZG: Rissbreitenbegrenzung 
            und Mindestbewehrung).
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-1 border-b border-home-grau/20">
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'null_bis_hundert'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('null_bis_hundert')}
          >
            <GraduationCap size={16} /> 0-100
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'spannung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('spannung')}
          >
            <Activity size={16} /> 1. Spannung-Dehnung (σ-ε)
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'biegebemessung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('biegebemessung')}
          >
            <Box size={16} /> 2. Biegebemessung
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'querkraftbemessung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('querkraftbemessung')}
          >
            <Scissors size={16} /> 3. Querkraftbemessung
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'stuetzenbemessung'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('stuetzenbemessung')}
          >
            <Columns size={16} /> 4. Stützenbemessung
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'durchstanzen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('durchstanzen')}
          >
            <CircleDashed size={16} /> 5. Durchstanzen
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'verankerungslaenge'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('verankerungslaenge')}
          >
            <GitCommit size={16} /> 6. Verankerungslänge
          </button>

          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'rissbreite'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('rissbreite')}
          >
            <Layers size={16} /> 7. Rissbreite (GZG)
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              currentTab === 'ec2_generation2'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => handleTabChange('ec2_generation2')}
          >
            <Sparkles size={16} className="text-amber-500" /> 8. Eurocode 2 (2. Generation)
          </button>
        </div>
      </div>

      {/* Render Active Sub-Module */}
      <div className="transition-all duration-200">
        {currentTab === 'null_bis_hundert' && (
          <div className="animate-in fade-in duration-200">
            <StahlbetonNullBisHundert onNavigateTab={(tab) => handleTabChange(tab)} />
          </div>
        )}

        {currentTab === 'spannung' && (
          <div className="animate-in fade-in duration-200">
            <SpannungDehnung />
          </div>
        )}

        {currentTab === 'biegebemessung' && (
          <div className="animate-in fade-in duration-200">
            <Biegebemessung />
          </div>
        )}

        {currentTab === 'querkraftbemessung' && (
          <div className="animate-in fade-in duration-200">
            <Querkraftbemessung />
          </div>
        )}

        {currentTab === 'stuetzenbemessung' && (
          <div className="animate-in fade-in duration-200">
            <Stuetzenbemessung />
          </div>
        )}

        {currentTab === 'durchstanzen' && (
          <div className="animate-in fade-in duration-200">
            <Durchstanzen />
          </div>
        )}

        {currentTab === 'verankerungslaenge' && (
          <div className="animate-in fade-in duration-200">
            <Verankerungslaenge />
          </div>
        )}

        {currentTab === 'rissbreite' && (
          <div className="animate-in fade-in duration-200">
            <Rissbreite />
          </div>
        )}
        {currentTab === 'ec2_generation2' && (
          <div className="animate-in fade-in duration-200 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Normenentwicklung &amp; Stand 2026</span>
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mt-0.5">
                  <Sparkles className="text-amber-500 h-5 w-5" />
                  2. Generation des Eurocode 2 (EN 1992-1-1:2023; bauaufsichtliche Einführung in Deutschland steht noch aus)
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Europäische Harmonisierung
              </span>
            </div>

            <p className="text-xs text-text-main/80 leading-relaxed">
              Die 2. Generation des Eurocode 2 (EN 1992-1-1:2023) führt fundamentale mechanische und 
              nachhaltigkeitsbezogene Weiterentwicklungen ein, die über die klassische Ausgabe 2004/2010 hinausgehen:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Querkraft */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">1. Geänderte Querkraftbemessung</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white rounded border border-home-grau/20 font-bold">V_Rd,c</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Ablösung des alten empirischen Ansatzes durch ein <strong>physikalisch geschlossenes Dehnungsfeldmodell (Kritische Rissöffnung / CSCT-Ansatz)</strong>. 
                  Die Querkrafttragfähigkeit von Bauteilen ohne Querkraftbewehrung berücksichtigt nun explizit den Maßstabseffekt d_dg (Größtkorn der Gesteinskörnung) 
                  und die Durchbiegungskrümmung.
                </p>
                <div className="p-2 bg-white rounded text-[11px] font-mono text-center border border-home-grau/15">
                  V_Rd,c = tau_Rd,c * b_w * d * f(d_dg, a_cs)
                </div>
              </div>

              {/* Durchstanzen */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">2. Durchstanzmodell (CSCT)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white rounded border border-home-grau/20 font-bold">V_Rd,c (Stütze)</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Vereinheitlichtes Durchstanzmodell basierend auf der <strong>Critical Shear Crack Theory (CSCT)</strong>. 
                  Der kritische Rundschnitt liegt nun bei <strong>d/2</strong> vom Stützenrand (vorher 2,0 d). Die Durchstanztragfähigkeit 
                  ist direkt an die Rotationsverformung der Platte gekoppelt.
                </p>
                <div className="p-2 bg-white rounded text-[11px] font-mono text-center border border-home-grau/15">
                  Rundschnitt: 0,5 d (statt bisher 2,0 d)
                </div>
              </div>

              {/* ERC */}
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-main">3. Expositions-Widerstand (ERC)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-bold">Exposure Resistance</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Einführung von <strong>Exposure Resistance Classes (ERC)</strong> für die performancebasierte Dauerhaftigkeitsbemessung 
                  anstelle starrer Mindestfestigkeitsklassen. Ermöglicht den gezielten Einsatz klinkerreduzierter, CO₂-armer Bindemittel 
                  bei gleichem Korrosionsschutz der Bewehrung.
                </p>
                <div className="p-2 bg-white rounded text-[11px] font-mono text-center border border-home-grau/15">
                  c_nom = c_min,dur(ERC) + Delta c_dev
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 text-xs text-text-main/80 space-y-2">
              <div className="font-bold text-text-main flex items-center gap-2">
                <Calculator size={15} className="text-shiraz" />
                Vergleichende Übergangsregelung im deutschen Bauordnungsrecht
              </div>
              <p className="text-[11px] leading-relaxed text-text-main/70">
                Die Bemessungsprogramme und Nachweise auf dieser Plattform rechnen im Regelfall mit der aktuell bauaufsichtlich über die Muster-Verwaltungsvorschrift Technische Baubestimmungen (MVV TB) verbindlich eingeführten Fassung <strong>DIN EN 1992-1-1:2011-01 + A1:2015 + DIN EN 1992-1-1/NA:2013-04</strong>. Die Neuregelungen der 2. Generation können als moderne Vergleichs- und Prognosewerte herangezogen werden.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
