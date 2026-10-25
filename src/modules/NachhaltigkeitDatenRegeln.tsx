import React, { useState } from 'react';
import { 
  Scale, 
  BarChart3, 
  Globe, 
  ShieldCheck, 
  Building2, 
  Layers, 
  QrCode, 
  RefreshCw,
  BookOpen,
  Library,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { useTabContext } from '@/src/contexts/TabContext';
import { ALL_17_SDGS } from './nachhaltigkeitdatenregeln/daten';
import { DefinitionenTab } from './nachhaltigkeitdatenregeln/DefinitionenTab';

export type DatenRegelnTab = 
  | 'definitionen'
  | 'kennzahlen' 
  | 'klimapolitik' 
  | 'regulatorik' 
  | 'deklarationen' 
  | 'national';

export default function NachhaltigkeitDatenRegeln() {
  const { setActiveTab: setGlobalTab } = useTabContext();
  const [activeTab, setActiveTab] = useState<DatenRegelnTab>('kennzahlen');
  const [selectedSdg, setSelectedSdg] = useState<number>(11);
  const [selectedTaxonomyGoal, setSelectedTaxonomyGoal] = useState<number>(1);
  const [interactiveMasse, setInteractiveMasse] = useState<number>(1000); // Tonnen Bauschutt

  // Calculation for waste recycling potential
  const calculatedRcBeton = formatDeZahl(interactiveMasse * 0.65, 0);
  const calculatedUnterbau = formatDeZahl(interactiveMasse * 0.25, 0);
  const calculatedDeponie = formatDeZahl(interactiveMasse * 0.10, 0);
  const savedCo2Tons = formatDeZahl(interactiveMasse * 0.045, 1);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 font-normal">
      {/* Central Header & Teaser Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Scale className="text-shiraz h-6 w-6" />
              Nachhaltigkeit: Daten &amp; Regeln
            </h2>
            <p className="text-xs text-text-main/70 mt-1">
              Globale Umweltkennzahlen, UN-SDGs, EU-Taxonomie, EPBD 2024/1275, EPD, Digitaler Produktpass (DPP) &amp; deutsches Baurecht
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap">
            Stand: 2025 / 2026
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed mb-6">
          <p>
            Das Bau- und Immobilienwesen steht im Zentrum der globalen Umwelt- und Klimapolitik. 
            Dieses Modul bündelt alle relevanten <strong>statistischen Kennzahlen (THG-Emissionen, Ressourcenabbau, Abfallströme)</strong>, 
            internationale Abkommen und Leitlinien (<strong>UN-Klimakonferenzen, SDGs</strong>), 
            europäische Richtlinien (<strong>EU-Taxonomie, EPBD 2024/1275, CSRD</strong>), 
            zirkuläre Deklarationssysteme (<strong>EPD nach DIN EN 15804+A2, Digitaler Produktpass DPP, Madaster</strong>) 
            sowie das geltende nationale Gesetzesgefüge (<strong>GModG (vormals GEG), QNG, EBV, KrWG und das Gebäudetyp-E-Vorhaben</strong>).
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-1 border-b border-home-grau/20">
          <button aria-pressed={activeTab === 'definitionen'}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'definitionen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('definitionen')}
          >
            <BookOpen size={16} /> 1. Definitionen &amp; Leitprinzipien
          </button>

          <button aria-pressed={activeTab === 'kennzahlen'}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'kennzahlen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('kennzahlen')}
          >
            <BarChart3 size={16} /> 2. Anteile &amp; Stoffströme
          </button>

          <button aria-pressed={activeTab === 'klimapolitik'}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'klimapolitik'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('klimapolitik')}
          >
            <Globe size={16} /> 3. Klimakonferenzen &amp; SDGs
          </button>

          <button aria-pressed={activeTab === 'regulatorik'}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'regulatorik'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('regulatorik')}
          >
            <Building2 size={16} /> 4. EU-Taxonomie &amp; EPBD
          </button>

          <button aria-pressed={activeTab === 'deklarationen'}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'deklarationen'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('deklarationen')}
          >
            <QrCode size={16} /> 5. EPD, DPP &amp; Materialpass
          </button>

          <button aria-pressed={activeTab === 'national'}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'national'
                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('national')}
          >
            <ShieldCheck size={16} /> 6. Deutsches Baurecht (GModG, QNG, EBV, Gebäudetyp E)
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DEFINITIONEN: NACHHALTIGKEIT (ALLGEMEIN) & NACHHALTIGES BAUEN      */}
      {/* ========================================================================= */}
      {activeTab === 'definitionen' && (
        <DefinitionenTab />
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ANTEILE & STOFFSTRÖME DES BAUWESENS                                */}
      {/* ========================================================================= */}
      {activeTab === 'kennzahlen' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Key Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Treibhausgase (THG)</span>
                <strong className="text-3xl font-extrabold text-shiraz block mt-1">~40 %</strong>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">der globalen energiebed. CO₂-Emissionen</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                Davon ca. 28 % aus dem laufenden Gebäudebetrieb (Heizung, Warmwasser, Kühlung) und ca. 11–12 % als <em>graue Emissionen</em> aus der Baustoffherstellung.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ressourcen &amp; Rohstoffe</span>
                <strong className="text-3xl font-extrabold text-slate-900 block mt-1">&gt; 50 %</strong>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">des weltweiten Rohstoffverbrauchs</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                Massenrohstoffe Sand, Kies, Kalkstein, Tone, Gips und Natursteine übersteigen global das Fördervolumen aller anderen Wirtschaftszweige zusammen.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Abfallaufkommen (Deutschland)</span>
                <strong className="text-3xl font-extrabold text-amber-700 block mt-1">~55 %</strong>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">des gesamten deutschen Abfalls</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                Mit rund <strong>220 bis 230 Millionen Tonnen</strong> jährlich stellen Bau- und Abbruchabfälle den mit Abstand größten nationalen Abfallstrom dar.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Flächeninanspruchnahme</span>
                <strong className="text-3xl font-extrabold text-emerald-700 block mt-1">~52 ha/d</strong>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">täglicher Flächenverbrauch (DE)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                Siedlungs- und Verkehrsfläche wächst täglich. Ziel der Bundes-Nachhaltigkeitsstrategie: Reduktion auf unter <strong>30 ha/Tag</strong> bis 2030 (Netto-Null bis 2050).
              </p>
            </div>
          </div>

          {/* Deep Dive Section: Der Stoffstrom des Bauens */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Zusammensetzung der 220–230 Mio. Tonnen Bauabfälle in Deutschland
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Datenquelle: Umweltbundesamt (UBA) &amp; Bundesverband Baustoffe – Steine und Erden (BBS)
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">
                Kreislaufwirtschafts-Potenzial
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold text-slate-900">1. Bodenaushub</strong>
                    <span className="text-xs font-mono font-bold text-shiraz">~130 Mio. t</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    Größte Einzelfraktion (ca. 58 % der Bauabfälle). Häufig Verfüllung in Tagebauen oder Deponien, statt hochwertiger Wiederaufbereitung im Tiefbau.
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">EBV-Klasse: BM-0 bis BM-F3</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold text-slate-900">2. Bauschutt</strong>
                    <span className="text-xs font-mono font-bold text-shiraz">~60 Mio. t</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    Beton, Ziegel, Fliesen, Keramik. Wird heute zu ca. 80 % zu RC-Schotter für ungebundene Tragschichten im Straßenbau „downgecycelt“.
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">EBV-Klasse: RC-1 bis RC-3</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold text-slate-900">3. Straßenaufbruch</strong>
                    <span className="text-xs font-mono font-bold text-shiraz">~15–20 Mio. t</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    Asphalt und Schotter. Hohe stoffliche Recyclingquote (oft &gt; 90 % als Heißmischgut), problematisch sind historische teer-/PAK-haltige Schichten.
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">EBV-Klasse: RC-Asphalt</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold text-slate-900">4. Baustellenabfälle &amp; Gips</strong>
                    <span className="text-xs font-mono font-bold text-shiraz">~15 Mio. t</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    Gemischte Fraktionen, Dämmstoffe, Holz, Metalle, Gipsplatten. Gipsabfälle müssen sulfatbedingt getrennt werden (Gips-zu-Gips-Recycling).
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">GewAbfV Trennpflicht</span>
              </div>
            </div>

            {/* Interactive Recycling Impact Calculator */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 mt-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <RefreshCw size={14} className="text-emerald-700" />
                  Interaktiver Stoffstrom-Rechner: Urban Mining Potenzial
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  Eingabe: {formatDeWert(interactiveMasse)} Tonnen Bauschutt
                </span>
              </div>

              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={interactiveMasse}
                onChange={(e) => setInteractiveMasse(parseInt(e.target.value))}
                className="w-full h-1 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg border border-emerald-150 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">Hochwertiger R-Beton (Typ 1/2):</span>
                  <strong className="text-sm font-mono font-bold text-emerald-900">{calculatedRcBeton} t</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5">als Gesteinskörnung</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-150 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">Tragschichten / Unterbau:</span>
                  <strong className="text-sm font-mono font-bold text-slate-800">{calculatedUnterbau} t</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Frostschutz / Wege</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-150 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">Restfraktion (Deponie):</span>
                  <strong className="text-sm font-mono font-bold text-amber-700">{calculatedDeponie} t</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Feinanteile / Störstoffe</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-150 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">Eingespartes Primär-CO₂:</span>
                  <strong className="text-sm font-mono font-bold text-emerald-700">~{savedCo2Tons} t CO₂e</strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5">vermiedene Transporte/Abbau</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KLIMAKONFERENZEN & UN-SDGS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'klimapolitik' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Timeline of International Milestones */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Die internationale Klimadiplomatie und ihre Auswirkung auf das Bauen
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Von der UN-Klimarahmenkonvention (UNFCCC) bis zum Pariser 1,5 °C-Ziel.</p>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 py-2">
              {[
                {
                  year: '1987',
                  title: 'Brundtland-Bericht („Our Common Future“)',
                  desc: 'Formulierung des Drei-Säulen-Modells der Nachhaltigkeit (Ökologie, Ökonomie, Soziales). Grundsatz: Bedürfnisse der Gegenwart befriedigen, ohne die Möglichkeiten zukünftiger Generationen zu gefährden.'
                },
                {
                  year: '1992',
                  title: 'UN-Erdgipfel in Rio de Janeiro (Agenda 21)',
                  desc: 'Verabschiedung der Klimarahmenkonvention (UNFCCC) und der Agenda 21. Startschuss für nationale Nachhaltigkeitsstrategien; in Deutschland folgte 2001 der erste Leitfaden Nachhaltiges Bauen des Bundes.'
                },
                {
                  year: '1997',
                  title: 'Kyoto-Protokoll (COP 3)',
                  desc: 'Erstmals völkerrechtlich verbindliche Reduktionsziele für Treibhausgase in Industrieländern. Einführung der Marktmechanismen (Emissionszertifikatehandel).'
                },
                {
                  year: '2015',
                  title: 'Pariser Klimaschutzabkommen (COP 21)',
                  desc: 'Völkerrechtliche Verpflichtung zur Begrenzung der globalen Erwärmung auf deutlich unter 2,0 °C, möglichst 1,5 °C gegenüber vorindustriellen Werten. Grundlage für den CRREM-Dekarbonisierungspfad im Gebäudesektor.'
                },
                {
                  year: '2019',
                  title: 'European Green Deal',
                  desc: 'Fahrplan der EU-Kommission zur Transformation Europas zum ersten klimaneutralen Kontinent bis 2050. Start der „Renovation Wave“ (Renovierungswelle zur Verdopplung der Sanierungsrate).'
                },
                {
                  year: '2023 / 2024',
                  title: 'Dubai COP 28 & Novelle der EPBD (EU 2024/1275)',
                  desc: 'Historischer Konsens zur Abkehr von fossilen Brennstoffen („Transitioning away from fossil fuels“). Gesetzliche Festschreibung von Zero Emission Buildings (ZEB) im EU-Recht.'
                }
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-shiraz group-hover:bg-shiraz transition-colors" />
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-mono font-bold text-shiraz">{item.year}</span>
                    <strong className="text-xs font-bold text-slate-900">{item.title}</strong>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive UN Sustainable Development Goals (SDGs) for Construction */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Die 17 UN-Nachhaltigkeitsziele (SDGs) im Bauingenieurwesen
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Wählen Sie ein SDG, um die konkreten baupraktischen Handlungsfelder anzuzeigen.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold">
                UN Agenda 2030
              </span>
            </div>

            {/* Legend for Construction Relevance */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-home-grau/20">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded border border-red-500 bg-red-50 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                </span>
                <span className="text-slate-800">
                  <strong className="text-red-600 font-bold">Dünner roter Rand:</strong> Direkte Kern- &amp; Praxisrelevanz für das Bauwesen, Baustoffe &amp; Planung (9 von 17 SDGs)
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <span className="w-4 h-4 rounded border border-slate-200 bg-white shrink-0"></span>
                <span>Grauer Rand: Übergreifende globale Entwicklungsziele</span>
              </div>
            </div>

            {/* All 17 SDGs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {ALL_17_SDGS.map((sdg) => {
                const isSelected = selectedSdg === sdg.num;
                return (
                  <button
                    key={sdg.num}
                    type="button"
                    onClick={() => setSelectedSdg(sdg.num)}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      sdg.bauRelevant
                        ? 'border border-red-500 shadow-2xs'
                        : 'border border-slate-200 shadow-2xs'
                    } ${
                      isSelected
                        ? sdg.bauRelevant
                          ? 'bg-shiraz text-white border-red-600 ring-2 ring-red-400/40 shadow-xs'
                          : 'bg-shiraz/80 text-white border-shiraz shadow-xs'
                        : sdg.bauRelevant
                          ? 'bg-white hover:bg-red-50/50 text-slate-800'
                          : 'bg-slate-50/70 hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center w-full">
                      <span className={`w-5 h-5 rounded ${sdg.badgeBg} text-white flex items-center justify-center font-mono font-bold text-[10px]`}>
                        {sdg.num}
                      </span>
                    </div>
                    <span className="font-bold text-[11px] leading-tight line-clamp-2">
                      {sdg.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SDG Detail Content Card */}
            {(() => {
              const currentSdg = ALL_17_SDGS.find(s => s.num === selectedSdg) || ALL_17_SDGS[10];
              return (
                <div className={`p-5 rounded-xl border text-xs leading-relaxed transition-all ${
                  currentSdg.bauRelevant 
                    ? 'border-red-400 bg-red-50/20' 
                    : 'border-slate-200 bg-slate-50/70'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3 mb-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md ${currentSdg.badgeBg} text-white flex items-center justify-center font-mono font-bold text-xs`}>
                        {currentSdg.num}
                      </span>
                      <span>{currentSdg.fullName}</span>
                    </h4>
                    {currentSdg.bauRelevant ? (
                      <span className="self-start sm:self-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        {currentSdg.relevanceLabel || 'Direkte Kernrelevanz für das Bauwesen'}
                      </span>
                    ) : (
                      <span className="self-start sm:self-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200/80 text-slate-600">
                        Sektorübergreifendes Rahmenziel
                      </span>
                    )}
                  </div>

                  <p className="italic text-slate-500 mb-2">
                    UN-Leitsatz: &bdquo;{currentSdg.englishTitle}&ldquo;
                  </p>

                  <p className="text-slate-800 leading-relaxed mb-3">
                    <strong>Baupraxis-Relevanz:</strong> {currentSdg.baupraxis}
                  </p>

                  {currentSdg.measures.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <strong className="text-[11px] text-slate-700 block mb-1">
                        Konkrete Handlungsfelder &amp; Maßnahmen im Bauwesen:
                      </strong>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                        {currentSdg.measures.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EU-TAXONOMIE & EPBD                                                */}
      {/* ========================================================================= */}
      {activeTab === 'regulatorik' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Quick jump to comprehensive Rechtsrahmen-Kompendium */}
          <div className="bg-white border border-home-grau/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-bold text-shiraz uppercase tracking-wider flex items-center gap-1.5">
                <Scale size={15} /> Neu: Vollständiges Rechtsrahmen- &amp; Hierarchie-Kompendium
              </span>
              <p className="text-xs text-text-main/80 leading-relaxed max-w-2xl">
                Hierarchische 5-Ebenen-Systematik aller 21 Rechtsakte (Green Deal, EU-Klimagesetz, Fit for 55, BauPVO 2024, EPBD, ESPR, CBAM, EU-ETS I/II, GEG, Gebäudetyp E u.v.m.) mit interaktiver Zeitleiste, Synopse-Matrix und Stichtags-Filtern.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGlobalTab('oekobilanz_lca')}
              className="px-4 py-2.5 bg-shiraz text-white rounded-xl text-xs font-bold hover:bg-shiraz/90 transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-sm self-start sm:self-center"
            >
              Zum Rechtsrahmen-Kompendium <ArrowRight size={14} />
            </button>
          </div>

          {/* EU-Taxonomie Overview */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  EU-Taxonomie-Verordnung (EU 2020/852) im Bausektor
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Das EU-Klassifikationssystem für ökologisch nachhaltige Wirtschaftsaktivitäten und Green Finance.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold">
                Taxonomie-Konformität
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Damit ein Bau- oder Immobilienprojekt als „taxonomiekonform“ eingestuft wird, muss es einen 
              <strong> wesentlichen Beitrag (*Substantial Contribution*)</strong> zu mindestens einem der sechs EU-Umweltziele leisten und 
              gleichzeitig das Prinzip <strong>*Do No Significant Harm (DNSH)*</strong> (keine wesentliche Beeinträchtigung der übrigen fünf Ziele) strikt einhalten:
            </p>

            {/* 6 Environmental Goals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 1, title: '1. Klimaschutz (Climate Mitigation)', desc: 'Neubau: Primärenergiebedarf mind. 10 % unter NZEB/GEG. Bei Gebäuden > 5 000 m² zusätzlich Berechnung und Offenlegung des Lebenszyklus-GWP (Delegierte VO (EU) 2021/2139, Anhang I, 7.1).' },
                { id: 2, title: '2. Anpassung an Klimawandel (Adaptation)', desc: 'Klimarisiko- und Vulnerabilitätsanalyse (Hitze, Hochwasser, Sturm) über 30 Jahre; Umsetzung physischer Anpassungsmaßnahmen.' },
                { id: 3, title: '3. Wasser- & Meeresressourcen', desc: 'Wassersparende Armaturen (Durchflussbegrenzer, Grauwassernutzung); Schutz vor Schadstoffeinträgen in Grundwasser.' },
                { id: 4, title: '4. Übergang zur Kreislaufwirtschaft', desc: 'Mindestens 70 % der nicht gefährlichen Bau- und Abbruchabfälle müssen stofflich wiederverwendet oder recycelt werden (Design for Deconstruction).' },
                { id: 5, title: '5. Vermeidung von Umweltverschmutzung', desc: 'Strikter Ausschluss gefährlicher Stoffe (Asbest, FCKW, SVHC nach REACH, schädliche Weichmacher und Biozide in Putzen).' },
                { id: 6, title: '6. Schutz von Biodiversität & Ökosystemen', desc: 'Bauen nur auf vorbelasteten/ausgewiesenen Flächen; Ausschluss von Schutzgebieten, Mooren und wertvollen Agrarflächen.' }
              ].map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedTaxonomyGoal(goal.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedTaxonomyGoal === goal.id
                      ? 'border-shiraz bg-shiraz/5 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <strong className={`block text-xs font-bold ${selectedTaxonomyGoal === goal.id ? 'text-shiraz' : 'text-slate-900'}`}>
                    {goal.title}
                  </strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{goal.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <span>Bedeutung für Projektentwickler &amp; Banken:</span>
              <strong className="font-bold text-shiraz">Taxonomiequote (CapEx/OpEx) bestimmt Zinssätze und ESG-Fonds-Fähigkeit</strong>
            </div>
          </div>

          {/* EPBD Novelle (EU 2024/1275) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Die neue EU-Gebäuderichtlinie (EPBD 2024/1275): Roadmap bis 2050
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Inkrafttreten im Mai 2024 mit zwingender Transformation im nationalen GEG.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold">
                EPBD Novelle 2024
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 block uppercase">Stufe 1 (ab 2028)</span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1">Öffentliche Nullemissionsgebäude</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Alle neuen Gebäude im Eigentum oder in der Nutzung öffentlicher Einrichtungen müssen als <strong>Zero Emission Buildings (ZEB)</strong> errichtet werden.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-900 mt-3 pt-2 border-t border-blue-200">Vorbildfunktion der öffentlichen Hand</span>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 block uppercase">Stufe 2 (ab 2030)</span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1">ZEB &amp; Whole-Life Carbon für alle Neubauten</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Ausnahmslos alle neuen Gebäude müssen Nullemissionsgebäude sein. Pflicht zur Ermittlung und Ausweisung des <strong>Lebenszyklus-GWP</strong> im Energieausweis!
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-900 mt-3 pt-2 border-t border-blue-200">GWP-Grenzen im Bauantrag</span>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 block uppercase">Fossil-Ausstieg (2025–2040)</span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1">Heizungs-Dekarbonisierung</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Ab <strong>2025</strong> keine staatlichen Subventionen mehr für eigenständige fossile Kessel. 
                    Bis spätestens <strong>2040</strong> vollständiger Ausstieg aus fossilen Brennstoffen zur Gebäudeheizung.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-900 mt-3 pt-2 border-t border-blue-200">Verbot von Gas-/Ölheizungen</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EPD, DIGITALER PRODUKTPASS & MATERIALPASS                          */}
      {/* ========================================================================= */}
      {activeTab === 'deklarationen' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Umweltproduktdeklarationen (EPD) nach DIN EN 15804+A2
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Typ-III-Umweltdeklarationen nach ISO 14025 als mathematische Datenbasis der Gebäude-Ökobilanz.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">
                DIN EN 15804+A2
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
                <strong className="text-xs font-bold text-slate-900 block">Die 4 normativen GWP-Kernindikatoren:</strong>
                <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong className="text-slate-800">GWP-total:</strong> Summenwert aller Treibhausgasemissionen und -senken.</li>
                  <li><strong className="text-slate-800">GWP-fossil:</strong> Emissionen aus Verbrennung fossiler Brennstoffe und Klinkerbrennprozessen.</li>
                  <li><strong className="text-slate-800">GWP-biogenic:</strong> CO₂-Aufnahme im Pflanzenwachstum (als negativer Wert verbucht) und thermische Freisetzung in C3/C4.</li>
                  <li><strong className="text-slate-800">GWP-luluc:</strong> Treibhauspotenzial infolge von Landnutzung und Landnutzungsänderung (*Land use &amp; land-use change*).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
                <strong className="text-xs font-bold text-slate-900 block">Generische vs. Spezifische EPDs:</strong>
                <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong className="text-slate-800">Generisch (ÖKOBAUDAT):</strong> Durchschnittswerte für frühe Entwurfsphasen (LPH 1–3). Im QNG/BNB mit +10 % Sicherheitsaufschlag belegt!</li>
                  <li><strong className="text-slate-800">Herstellerspezifisch (z.B. IBU):</strong> Geprüfte Primärdaten eines konkreten Zement- oder Holzwerks ohne Sicherheitsaufschlag; zwingend für Endzertifizierung.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Digitaler Produktpass (DPP) & Madaster */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Digitaler Produktpass (DPP) &amp; Gebäude-Materialpass
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rechtsrahmen: EU-Ökodesign-Verordnung (ESPR 2024) und novellierte Bauprodukteverordnung (CPR 2024).
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-50 text-purple-800 rounded font-bold">
                ESPR &amp; CPR
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-purple-150 bg-purple-50/50 flex flex-col justify-between">
                <div>
                  <QrCode size={20} className="text-purple-700 mb-2" />
                  <strong className="text-xs font-bold text-slate-900 block">Digital Product Passport (DPP)</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Jedes Bauprodukt erhält einen maschinenlesbaren Datenträger (z.B. QR-Code). Ermöglicht die Rückverfolgbarkeit von Inhaltsstoffen, Rezyklatanteilen, Demontageanleitungen und CO₂-Fußabdruck über die gesamte Lieferkette.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-900 mt-3 pt-2 border-t border-purple-200">Rechtspflicht nach EU-Ökodesign</span>
              </div>

              <div className="p-4 rounded-xl border border-purple-150 bg-purple-50/50 flex flex-col justify-between">
                <div>
                  <Building2 size={20} className="text-purple-700 mb-2" />
                  <strong className="text-xs font-bold text-slate-900 block">Gebäude-Materialpass (Madaster)</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Dokumentiert Art, Masse, Einbauort und Lösbarkeit aller Bauteile eines Gebäudes. Berechnet den <strong>Circularity Index (CI)</strong> und den monetären Restwert der Materialien am Lebensende.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-900 mt-3 pt-2 border-t border-purple-200">Grundlage für Urban Mining</span>
              </div>

              <div className="p-4 rounded-xl border border-purple-150 bg-purple-50/50 flex flex-col justify-between">
                <div>
                  <RefreshCw size={20} className="text-purple-700 mb-2" />
                  <strong className="text-xs font-bold text-slate-900 block">Design for Disassembly</strong>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Konstruieren mit trennbaren mechanischen Verbindungen (Verschrauben, Stecken) statt vollflächiger chemischer Verklebung. Ermöglicht sortenreinen Rückbau ohne Downcycling.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-900 mt-3 pt-2 border-t border-purple-200">Zirkularitätsgrad &gt; 80 %</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DEUTSCHES BAURECHT (GModG, QNG, EBV, Gebäudetyp E)                          */}
      {/* ========================================================================= */}
      {activeTab === 'national' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
            <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Die fünf Säulen des deutschen Nachhaltigkeits-Baurechts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vom Gebäudemodernisierungsgesetz (GModG, vormals GEG) über die Ersatzbaustoffverordnung bis zum Gebäudetyp-E-Vorhaben.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">
                Bundesrecht
              </span>
            </div>

            <div className="space-y-4">
              {/* GEG */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900">1. Gebäudemodernisierungsgesetz (GModG, vormals GEG 2024)</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Energie</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Regelt den primärenergetischen Effizienzhausstandard (EH 55 als Neubaustandard) und die <strong>65 %-Erneuerbare-Energien-Vorgabe</strong> für neu eingebaute Heizungsanlagen (Kopplung an die kommunale Wärmeplanung).
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Max. Transmissionswärmeverlust</span>
                  <strong className="text-xs font-mono font-bold text-slate-800">H'T-Grenzwerte</strong>
                </div>
              </div>

              {/* QNG */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900">2. Qualitätssiegel Nachhaltiges Gebäude (QNG)</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Förderung</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Staatliches Gütesiegel des BMWSB für zinsgünstige KfW-Förderdarlehen (Klimafreundlicher Neubau KFN) und degressive AfA (5 %). 
                    Grenzwerte: <strong>QNG-Plus (<InlineMath math="\le 24\,\text{kg CO}_2\text{e}/(\text{m}^2\cdot\text{a})" />)</strong> und <strong>QNG-Premium (<InlineMath math="\le 20\,\text{kg CO}_2\text{e}/(\text{m}^2_{\text{NRF}}\cdot\text{a})" />)</strong> für Wohngebäude (WG23) über 50 Jahre Betrachtungszeitraum.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Nachweis-Zeithorizont</span>
                  <strong className="text-xs font-mono font-bold text-emerald-700">50 Jahre</strong>
                </div>
              </div>

              {/* EBV */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900">3. Ersatzbaustoffverordnung (EBV seit 01.08.2023)</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Kreislauf</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Bundesweit harmonisierte Qualitätsanforderungen für mineralische Ersatzbaustoffe (RC-1 bis RC-3, Bodenmaterial BM-0 bis BM-F3, Gleisschotter). 
                    Regelt Grundwasserschutz und Kataster-Anzeigepflicht nach § 25 EBV bei Einbaumengen ab <strong>250 m³</strong>.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Schwellenwert Kataster</span>
                  <strong className="text-xs font-mono font-bold text-amber-800">&ge; 250 m³</strong>
                </div>
              </div>

              {/* KrWG */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900">4. Kreislaufwirtschaftsgesetz (KrWG)</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">Hierarchie</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Verbindliche 5-stufige Abfallhierarchie: 1. Vermeidung &gt; 2. Vorbereitung zur Wiederverwendung &gt; 3. Recycling &gt; 4. sonstige Verwertung &gt; 5. Beseitigung (Deponierung als Ultima Ratio).
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Grundsatz</span>
                  <strong className="text-xs font-mono font-bold text-purple-800">Vermeidung vor Beseitigung</strong>
                </div>
              </div>

              {/* Gebäudetyp E */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-slate-900">5. Gebäudetyp E (Gesetzesvorhaben)</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">Suffizienz</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Soll fachkundigen Baupartnern das rechtlich belastbare Abweichen von reinen Komfort- und Ausstattungsnormen ohne Sachmangelrisiko nach § 633 BGB ermöglichen. Der Entwurf von 2024 (BT-Drs. 20/13959) ist mit der 20. Wahlperiode erledigt; nach Eckpunkten vom 20.11.2025 befindet sich ein neuer Gesetzentwurf in der Ressortabstimmung, ist aber noch nicht veröffentlicht (Stand 10/2026). 
                    Grundlegende öffentlich-rechtliche Schutzziele (Standsicherheit, Brandschutz, Gesundheit, Schall- und Wärmeschutz) bleiben gewahrt.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Kabinett Nov. 2024</span>
                  <strong className="text-xs font-mono font-bold text-rose-800">Einfaches Bauen</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: EU-Taxonomie – Primärenergie-Kriterium für einen Neubau"
        zielGleichung="Q_{P} \le 0{,}90 \cdot Q_{P,\text{NZEB}}"
        schritte={[
          { titel: 'NZEB-Schwelle', erklaerung: 'In Deutschland entspricht der Niedrigstenergiegebäude-Standard der Neubauanforderung nach GModG § 15 (0,55 · Referenzgebäude). Angenommen: zulässiger Wert 40 kWh/(m²a).', formel: 'Q_{P,\\text{NZEB}} = 40\\,\\text{kWh/(m}^2\\text{a)}' },
          { titel: 'Taxonomie-Schwelle', erklaerung: 'Neubau, Klimaschutz-Kriterium: mindestens 10 % unter NZEB:', formel: 'Q_{P,\\text{Tax}} = 0{,}90 \\cdot 40 = 36\\,\\text{kWh/(m}^2\\text{a)}' },
          { titel: 'Prüfung', erklaerung: 'Planungswert 34 kWh/(m²a):', formel: '34 \\le 36 \\Rightarrow \\text{Kriterium erfüllt}' }
        ]}
        ergebnisHinweis="Für Gebäude über 5 000 m² ist zusätzlich das Lebenszyklus-GWP zu berechnen und offenzulegen; außerdem gelten Luftdichtheits- bzw. Thermografie-Nachweise und die DNSH-Kriterien."
        normQuelle="Delegierte VO (EU) 2021/2139, Anhang I, Abschnitt 7.1 (Stand manuell prüfen)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: CRREM-Pfad – wann wird ein Bürogebäude „stranded“?"
        zielGleichung="I_{\text{Ziel}}(t) = I_{2020} - \frac{I_{2020} - I_{2030}}{10} \cdot (t - 2020)"
        schritte={[
          { titel: 'Pfad (Lehrwerte)', erklaerung: 'Linear zwischen 52 kg CO₂e/(m²a) im Jahr 2020 und 18 kg CO₂e/(m²a) im Jahr 2030:', formel: 'I_{\\text{Ziel}}(2026) = 52 - 3{,}4 \\cdot 6 = 31{,}6\\,\\text{kg CO}_2\\text{e/(m}^2\\text{a)}' },
          { titel: 'Ist-Intensität', erklaerung: 'Betriebsemissionen des Gebäudes:', formel: 'I_{\\text{Ist}} = 32{,}0 > 31{,}6' },
          { titel: 'Misalignment Year', erklaerung: 'Ohne Maßnahmen liegt das Gebäude bereits 2026 über dem Pfad; eine Senkung auf 20 kg CO₂e/(m²a) verschiebt den Schnittpunkt:', formel: '52 - 3{,}4 \\cdot (t - 2020) = 20 \\Rightarrow t \\approx 2029{,}4' }
        ]}
        ergebnisHinweis="CRREM-Pfade sind länder- und nutzungsspezifisch; für Investitionsentscheidungen sind die aktuellen veröffentlichten Pfade zu verwenden, nicht diese Lehrwerte."
        normQuelle="CRREM-Methodik (Lehrbeispiel)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="nachhaltigkeit_daten_regeln" />

      {/* Standardized ModuleFooter according to Styleguide */}
      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 7 Nachhaltigkeit: QNG, EPBD, Taxonomie, ETS II, Gebäudetyp E und GModG auf Rechtsstand Oktober 2026 geprüft; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Ziele für nachhaltige Entwicklung (SDGs)', url: 'https://de.wikipedia.org/wiki/Ziele_f%C3%BCr_nachhaltige_Entwicklung' },
          { title: 'EU-Taxonomie', url: 'https://de.wikipedia.org/wiki/EU-Taxonomie' },
          { title: 'Richtlinie über die Gesamtenergieeffizienz von Gebäuden (EPBD)' },
          { title: 'Umweltproduktdeklaration (EPD)' },
          { title: 'Ersatzbaustoffverordnung (EBV)', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' }
        ]}
        literatur={[
          'Hegger, M.; Auch-Schwelk, V.; Fuchs, M.; Rosenkranz, T.: Baustoff Atlas. München: Edition Detail 2005',
          'Klöpffer, W.; Grahl, B.: Ökobilanz (LCA) – Ein Leitfaden für Ausbildung und Beruf. Weinheim: Wiley-VCH 2009',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Bundesministerium des Innern, für Bau und Heimat (BMI) (Hrsg.): Leitfaden Nachhaltiges Bauen – Zukunftsfähiges Planen, Bauen und Betreiben von Gebäuden. Stand Januar 2019. Berlin 2019',
          'Nagler, F.; Jarmer, T.; Niemann, A. et al.: Einfach Bauen – Ganzheitliche Strategien für energieeffizientes, einfaches Bauen. Untersuchung der Wechselwirkung von Raum, Technik, Material und Konstruktion. Stuttgart: Fraunhofer IRB 2019 (Forschungsinitiative Zukunft Bau F 3151)'
        ]}
        regelwerke={[
          { title: 'DIN EN 15643:2021-12 (Nachhaltigkeit von Bauwerken – Allgemeine Rahmenbedingungen zur Bewertung von Gebäuden und Ingenieurbauwerken)' },
          { title: 'ISO 15392:2019 (Nachhaltiges Bauen – Allgemeine Grundsätze)' },
          { title: 'EPBD – Richtlinie (EU) 2024/1275 (Neufassung; Nullemissionsgebäude ab 2028/2030, Lebenszyklus-GWP Art. 7)', url: 'https://eur-lex.europa.eu/' },
          { title: 'EU-Taxonomie-Verordnung (EU) 2020/852 mit Delegierter VO (EU) 2021/2139 (Klimaschutz-Kriterien)', url: 'https://eur-lex.europa.eu/' },
          { title: 'DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarationen)' },
          { title: 'DIN EN 15978:2026-09 (Bewertung der Umweltqualität von Gebäuden; ersetzt 2012-10)' },
          { title: 'Gebäudemodernisierungsgesetz (GModG, seit 29.07.2026; vormals GEG)', url: 'https://www.gesetze-im-internet.de/geg/' },
          { title: 'Ersatzbaustoffverordnung (EBV, in Kraft seit 01.08.2023; Novelle in Vorbereitung)', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' }
        ]}
        formeln={[
          {
            formel: 'GWP_{\\text{Gebäude}} = \\sum_{i} m_i \\cdot GWP_{\\text{A1-A3},i} + \\sum_{t=1}^{50} E_t \\cdot f_{\\text{CO2},t} \\quad [\\text{kg CO}_2\\text{-eq}]',
            erklaerung: 'Vereinfachte Lebenszyklus-Treibhausgasbilanz über 50 Jahre (QNG, EPBD) mit Herstellung (A1–A3) und Betrieb (B6); vollständig zusätzlich Austausch (B4) und Lebensende (C3/C4).',
            quelle: 'DIN EN 15978 / QNG'
          },
          {
            formel: '\\text{MCI} = 1 - \\text{LFI} \\cdot \\frac{0{,}9}{X}, \\quad X = \\frac{L}{L_{av}} \\cdot \\frac{U}{U_{av}}',
            erklaerung: 'Material Circularity Indicator: LFI = Linear Flow Index (Anteil linearer Stoffflüsse aus Primärrohstoff und Abfall), X = Nutzungsfaktor aus Lebensdauer L und Nutzungsintensität U relativ zum Branchendurchschnitt. Der Madaster-Zirkularitätsindex baut auf diesem Ansatz auf.',
            quelle: 'Ellen MacArthur Foundation / Granta Design: Material Circularity Indicator'
          },
          {
            formel: '\\text{GHG-Intensität} = \\frac{\\sum_{j} E_j \\cdot f_{\\text{CO2},j}}{\\text{NFA}} \\le \\text{Target}_{\\text{CRREM}}(t) \\quad [\\text{kg CO}_2\\text{e/(m}^2_{\\text{NFA}}\\cdot\\text{a})]',
            erklaerung: 'CRREM-Dekarbonisierungspfad: Zulässige flächenbezogene Treibhausgasemissionen des Gebäudebetriebs pro Jahr im Pariser 1,5°C-Ziel bis zum Zielwert 0 im Jahr 2050.',
            quelle: 'CRREM v2 / EU-Taxonomie'
          }
        ]}
      />
    </div>
  );
}
