import React, { useState } from 'react';
import { useTabContext } from '@/src/contexts/TabContext';
import { 
  Building2, 
  ShieldAlert, 
  Layers, 
  BookOpen, 
  Search, 
  Scale,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { BlockMath } from 'react-katex';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { DAMAGE_CASES } from './materialschaedengross/daten';

export default function MaterialSchaedenGross() {
  const { setActiveTab, setTypischeBauschaedenSubTab } = useTabContext();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('bad_reichenhall');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'alle' | 'bruecken' | 'hallen' | 'infrastruktur' | 'hochbau'>('alle');
  const [searchQuery, setSearchQuery] = useState('');

  const currentCase = DAMAGE_CASES.find(c => c.id === selectedCaseId) || DAMAGE_CASES[0];

  const filteredCases = DAMAGE_CASES.filter(c => {
    const matchesCat = activeCategoryFilter === 'alle' || c.category === activeCategoryFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.keyMaterialMechanism.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.structureType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-shiraz/10 text-shiraz rounded-xl">
              <ShieldAlert size={26} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                Große materialbedingte Bauschäden &amp; Einstürze
              </h2>
              <p className="text-xs text-text-main/70">
                Forensische Schadensanalyse historischer Großschadensfälle: Projektdaten, Werkstoffmechanismen, Historie, Ursachen &amp; normative Konsequenzen
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button aria-pressed={activeCategoryFilter === 'alle'}
              onClick={() => setActiveCategoryFilter('alle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'alle'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
              }`}
            >
              Alle ({DAMAGE_CASES.length})
            </button>
            <button aria-pressed={activeCategoryFilter === 'bruecken'}
              onClick={() => setActiveCategoryFilter('bruecken')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'bruecken'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
              }`}
            >
              Brücken ({DAMAGE_CASES.filter(c => c.category === 'bruecken').length})
            </button>
            <button aria-pressed={activeCategoryFilter === 'infrastruktur'}
              onClick={() => setActiveCategoryFilter('infrastruktur')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'infrastruktur'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
              }`}
            >
              Infrastruktur &amp; Schiene ({DAMAGE_CASES.filter(c => c.category === 'infrastruktur').length})
            </button>
            <button aria-pressed={activeCategoryFilter === 'hallen'}
              onClick={() => setActiveCategoryFilter('hallen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'hallen'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
              }`}
            >
              Hallen ({DAMAGE_CASES.filter(c => c.category === 'hallen').length})
            </button>
            <button aria-pressed={activeCategoryFilter === 'hochbau'}
              onClick={() => setActiveCategoryFilter('hochbau')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'hochbau'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
              }`}
            >
              Hochbau ({DAMAGE_CASES.filter(c => c.category === 'hochbau').length})
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-text-main/40" size={16} />
            <input
              type="text"
              placeholder="Fallakte durchsuchen (z.B. Bahnschwellen, AKR, Leim, Spannungsrisskorrosion, Carolabrücke, Stava)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-off-white border border-home-grau/30 rounded-xl text-xs text-text-main placeholder:text-text-main/50 focus:outline-none focus:border-shiraz/50"
            />
          </div>
        </div>

        {/* Introduction Quote / Banner */}
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 leading-relaxed">
          <p>
            Große Einstürze und Strukturversagen der Bau- und Verkehrsgeschichte sind selten das Resultat eines einzelnen Versehens. Nahezu ausnahmslos handelt es sich um das verhängnisvolle Zusammenspiel von <strong>materialbedingter Degradation</strong> (z.B. Alkali-Kieselsäure-Reaktion im Beton, Spannungsrisskorrosion, Hydrolyse von Leimfugen, Verflüssigung unter Porenwasserdruck), <strong>bauphysikalischer oder statischer Fehlkonzeption</strong>, <strong>fehlender System-Redundanz</strong> und <strong>Lücken in der periodischen Bauwerksüberwachung</strong>.
          </p>
        </div>

        {/* Case Study Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {filteredCases.map(cs => {
            const isSelected = cs.id === currentCase.id;
            return (
              <div
                key={cs.id}
                onClick={() => setSelectedCaseId(cs.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                  isSelected 
                    ? 'bg-shiraz text-white border-shiraz shadow-md' 
                    : 'bg-white hover:bg-slate-50 border-home-grau/30 text-text-main hover:border-shiraz/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-80 mb-1">
                    <span>{cs.year}</span>
                    <span className="uppercase tracking-wider font-bold">{cs.category}</span>
                  </div>
                  <h4 className="font-bold text-xs leading-snug line-clamp-2 mb-1.5">
                    {cs.name}
                  </h4>
                  <p className={`text-[11px] line-clamp-2 ${isSelected ? 'text-white/80' : 'text-text-main/70'}`}>
                    {cs.location}
                  </p>
                </div>
                <div className={`mt-3 pt-2 border-t text-[10px] font-semibold flex items-center justify-between ${
                  isSelected ? 'border-white/20 text-white' : 'border-home-grau/20 text-shiraz'
                }`}>
                  <span>Fallakte öffnen</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Case Study Detail View */}
        <div className="bg-slate-50/60 rounded-2xl border border-home-grau/30 p-6 flex flex-col gap-6">
          {/* Header of the Active Case */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-home-grau/20">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-shiraz text-white">
                  Jahr {currentCase.year}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-home-grau/30 text-text-main">
                  {currentCase.location}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-shiraz border border-shiraz/20">
                  {currentCase.projectData.opferZahlen}
                </span>
              </div>
              <h3 className="text-2xl font-black text-text-main">
                {currentCase.name}
              </h3>
              <p className="text-sm font-medium text-shiraz mt-0.5">
                {currentCase.subTitle}
              </p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-home-grau/20 shadow-2xs max-w-sm">
              <span className="text-[10px] uppercase font-bold text-text-main/60 block mb-1">
                Kritischer Werkstoffmechanismus
              </span>
              <div className="text-xs font-bold text-text-main leading-snug">
                <FormulaText text={currentCase.keyMaterialMechanism} />
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-4 bg-white rounded-xl border border-home-grau/20 text-xs text-text-main/80 leading-relaxed shadow-2xs">
            <FormulaText text={currentCase.summary} />
          </div>

          {/* 1. Projektdaten & Kenngrößen */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-2xs">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <Building2 size={16} className="text-shiraz" /> Projektdaten &amp; Bauwerkskenngrößen
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-off-white/80 rounded-lg border border-home-grau/20">
                <span className="text-[10px] text-text-main/60 font-semibold block uppercase">Baujahr &amp; Schadenszeitpunkt</span>
                <p className="font-bold text-text-main mt-0.5">{currentCase.projectData.baujahr} / {currentCase.projectData.schadensdatum}</p>
              </div>
              <div className="p-3 bg-off-white/80 rounded-lg border border-home-grau/20">
                <span className="text-[10px] text-text-main/60 font-semibold block uppercase">Tragwerkstyp &amp; Abmessungen</span>
                <p className="font-bold text-text-main mt-0.5">{currentCase.projectData.tragwerkstyp}</p>
                <p className="text-[11px] text-text-main/70 mt-1">{currentCase.projectData.spannweiteAbmessungen}</p>
              </div>
              <div className="p-3 bg-off-white/80 rounded-lg border border-home-grau/20">
                <span className="text-[10px] text-text-main/60 font-semibold block uppercase">Beteiligte Werkstoffe</span>
                <ul className="mt-1 space-y-0.5 font-semibold text-text-main list-disc list-inside">
                  {currentCase.projectData.beteiligteBaustoffe.map((m, i) => (
                    <li key={i} className="text-[11px]">{m}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-off-white/80 rounded-lg border border-home-grau/20">
                <span className="text-[10px] text-text-main/60 font-semibold block uppercase">Schadensausmaß &amp; Verluste</span>
                <p className="font-bold text-shiraz mt-0.5">{currentCase.projectData.opferZahlen}</p>
                <p className="text-[11px] text-text-main/70 mt-1">{currentCase.projectData.gesamtschaden}</p>
              </div>
            </div>
          </div>

          {/* 2. Historie & Schadensverlauf */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-2xs">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <Clock size={16} className="text-shiraz" /> Historie &amp; Schadenschronologie
            </h4>
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-home-grau/30">
              {currentCase.historie.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-7">
                  <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-shiraz border-2 border-white shadow-2xs" />
                  <div className="p-3.5 bg-off-white/60 rounded-xl border border-home-grau/20 w-full text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-text-main text-xs">{step.phase}</span>
                      <span className="font-mono text-[10px] font-bold text-shiraz bg-white px-2 py-0.5 rounded border border-home-grau/20">
                        {step.zeitraum}
                      </span>
                    </div>
                    <div className="text-text-main/80 leading-relaxed">
                      <FormulaText text={step.details} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Physikalische & Materialbedingte Schadensursachen */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-2xs">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <Layers size={16} className="text-shiraz" /> Materialmechanische &amp; Ingenieurtechnische Schadensursachen
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCase.ursachen.map((u, i) => (
                <div key={i} className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/40 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-text-main text-xs">{u.titel}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        u.kategorie === 'Material/Werkstoff' 
                          ? 'bg-rose-100 text-shiraz' 
                          : u.kategorie === 'Planung/Statik'
                          ? 'bg-amber-100 text-amber-900'
                          : u.kategorie === 'Ausführung'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {u.kategorie}
                      </span>
                    </div>
                    <div className="text-text-main/80 leading-relaxed mb-3">
                      <FormulaText text={u.beschreibung} />
                    </div>
                  </div>

                  {u.formelOrMechanismus && (
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-center font-serif text-xs">
                      <BlockMath math={u.formelOrMechanismus} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. Folgen & Normative Konsequenzen */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-2xs">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <Scale size={16} className="text-shiraz" /> Folgen &amp; Normative Konsequenzen für die Baupraxis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {currentCase.folgen.map((f, i) => (
                <div key={i} className="p-3.5 bg-off-white/80 rounded-xl border border-home-grau/20 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-text-main text-xs block mb-1.5">{f.bereich}</span>
                    <p className="text-text-main/80 leading-relaxed mb-3">{f.auswirkung}</p>
                  </div>
                  <div className="pt-2 border-t border-home-grau/20">
                    <span className="text-[10px] text-text-main/60 block font-semibold uppercase">Relevantes Regelwerk</span>
                    <div className="font-mono text-[11px] font-bold text-shiraz mt-0.5">
                      <FormulaText text={f.normativeKonsequenz} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Lessons Learned / Wichtigste Ingenieur-Erkenntnisse */}
          <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/20 shadow-2xs">
            <h4 className="text-sm font-bold text-shiraz flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} /> Fundamentale Lehren für Bauingenieure &amp; Werkstoffprüfer
            </h4>
            <ul className="space-y-1.5 text-xs text-text-main/80 list-disc list-inside">
              {currentCase.lessonsLearned.map((ll, i) => (
                <li key={i} className="leading-relaxed">
                  <strong><FormulaText text={ll} /></strong>
                </li>
              ))}
            </ul>
          </div>

          {/* 6. Querverweis & Vertiefung im Fachmodul 'Typische Bauschäden' */}
          {currentCase.typischeBauschaedenLink && (
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-shiraz/10 to-transparent border border-shiraz/25 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-shiraz text-white">
                    Fachwissen-Verknüpfung
                  </span>
                  <strong className="text-xs text-text-main">
                    Verwandter Schadensmechanismus in: Typische Bauschäden
                  </strong>
                </div>
                <p className="text-xs text-text-main/80 font-medium">
                  {currentCase.typischeBauschaedenLink.description}
                </p>
              </div>
              <button
                onClick={() => {
                  setTypischeBauschaedenSubTab(currentCase.typischeBauschaedenLink!.subTab);
                  setActiveTab('schadensbilder');
                }}
                className="px-4 py-2 bg-shiraz text-white rounded-xl text-xs font-bold hover:bg-shiraz/90 transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                <span>Zu &bdquo;{currentCase.typischeBauschaedenLink.label}&ldquo; wechseln</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* 7. Fachquellen, Untersuchungsberichte & Gutachten */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-2xs">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <BookOpen size={16} className="text-shiraz" /> Relevante Fachquellen, Gutachten &amp; Untersuchungsberichte
            </h4>
            {currentCase.quellenlage && (
              <p className="text-xs text-text-main/80 mb-3 leading-relaxed">
                <strong>Quellenlage:</strong> {currentCase.quellenlage}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentCase.sources.map((s, i) => (
                <div key={i} className="p-3 bg-off-white/80 rounded-xl border border-home-grau/20 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <strong className="text-text-main leading-snug font-semibold">{s.title}</strong>
                      {s.url && (
                        <a 
                          href={s.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-shiraz hover:underline shrink-0 p-0.5"
                          title="Quelle extern öffnen"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-shiraz block mb-1">
                      {s.institutionOrAuthor}
                    </span>
                    <p className="text-[11px] text-text-main/70 leading-relaxed">
                      {s.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Standardisierter ModuleFooter nach Styleguide */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Kritische Rissgröße in einem Stahlbauteil bei Kälte"
        zielGleichung="a_c = \frac{1}{\pi}\left(\frac{K_{Ic}}{Y \cdot \sigma}\right)^2"
        schritte={[
          { titel: 'Werkstoff', erklaerung: 'Älterer Baustahl bei Frost mit geringer Bruchzähigkeit (Lehrwert):', formel: 'K_{Ic} = 30\\,\\text{MPa}\\sqrt{\\text{m}}' },
          { titel: 'Beanspruchung', erklaerung: 'Nennspannung im Bauteil 300 MPa, Randriss (Y = 1,12):', formel: 'Y \\cdot \\sigma = 336\\,\\text{MPa}' },
          { titel: 'Kritischer Riss', erklaerung: 'Einsetzen:', formel: 'a_c = \\frac{1}{\\pi}\\left(\\frac{30}{336}\\right)^2 = 0{,}0025\\,\\text{m} = 2{,}5\\,\\text{mm}' }
        ]}
        ergebnisHinweis="Ein Riss von wenigen Millimetern genügt – visuell kaum auffindbar. Ohne Redundanz (Silver Bridge 1967) führt das Versagen eines Glieds zum Gesamteinsturz."
        normQuelle="Irwin (1957); NTSB-Bericht Silver Bridge (1970)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Lastverdopplung durch geänderte Anschlussausbildung (Hyatt Regency 1981)"
        zielGleichung="F_{Mutter,ist} = 2 \cdot F_{Mutter,plan}"
        schritte={[
          { titel: 'Planung', erklaerung: 'Durchlaufende Hängestange: Jede Mutter unter einem Steg trägt nur dessen Last P.', formel: 'F_{plan} = P' },
          { titel: 'Ausführung', erklaerung: 'Zwei versetzte Stangen: Die Mutter am oberen Steg trägt dessen Last und die des unteren Stegs.', formel: 'F_{ist} = P + P = 2P' },
          { titel: 'Folge', erklaerung: 'Bei P = 90 kN (Lehrwert):', formel: 'F_{ist} = 180\\,\\text{kN} \\text{ statt } 90\\,\\text{kN}' }
        ]}
        ergebnisHinweis="Die unscheinbare Detailänderung verdoppelte die Beanspruchung des Kastenträgeranschlusses; schon die ursprüngliche Planung erfüllte die Anforderungen der Bauordnung nach dem NBS-Bericht nicht vollständig."
        normQuelle="NBS BSS 143 (1982)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="material_schaeden_gross" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 11 Mängel & Schäden: Fallchronologien, Opferzahlen und Quellen geprüft; nicht verifizierbare Gutachtenangaben neutralisiert; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Alkali-Kieselsäure-Reaktion', url: 'https://de.wikipedia.org/wiki/Alkali-Kiesels%C3%A4ure-Reaktion' },
          { title: 'Eisenbahnunfall von Burgrain (Garmisch-Partenkirchen)', url: 'https://de.wikipedia.org/wiki/Eisenbahnunfall_von_Burgrain' },
          { title: 'Hyatt-Regency-Einsturz (Kansas City)' },
          { title: 'Katastrophe von Stava (Dammbruch)' },
          { title: 'Schiersteiner Brücke (Havarie)', url: 'https://de.wikipedia.org/wiki/Schiersteiner_Br%C3%BCcke' },
          { title: 'Einsturz der Eishalle Bad Reichenhall' },
          { title: 'Polcevera-Viadukt (Ponte Morandi)', url: 'https://de.wikipedia.org/wiki/Polcevera-Viadukt' },
          { title: 'Carolabrücke (Dresden)', url: 'https://de.wikipedia.org/wiki/Carolabr%C3%BCcke_(Dresden)' },
          { title: 'Silver Bridge', url: 'https://de.wikipedia.org/wiki/Silver_Bridge' },
          { title: 'Kongresshalle (Berlin)', url: 'https://de.wikipedia.org/wiki/Haus_der_Kulturen_der_Welt' },
          { title: 'Reichsbrücke', url: 'https://de.wikipedia.org/wiki/Reichsbr%C3%BCcke' }
        ]}
        literatur={[
          'Bundesstelle für Eisenbahnunfalluntersuchung (BEU): Untersuchungsbericht zum Zugunglück bei Burgrain 2022 (AKR an Spannbetonschwellen)',
          'Deutscher Ausschuss für Stahlbeton (DAfStb): Richtlinie Vorbeugende Maßnahmen gegen schädigende Alkalireaktion im Beton (Alkali-Richtlinie), Ausgabe 2013-10',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'National Bureau of Standards (NBS): Investigation of the Kansas City Hyatt Regency Walkways Collapse. NBS Building Science Series 143, 1982',
          'Schlaich, J.; Kordina, K.; Engell, H.-J.: Teileinsturz der Kongresshalle Berlin – Schadensursachen. Zusammenfassendes Gutachten. Beton- und Stahlbetonbau 75 (1980) H. 12, S. 281–294',
          'N. N.: Gutachten zu den Ursachen des Einsturzes der Eissporthalle in Bad Reichenhall vorgelegt. Bautechnik 83 (2006) H. 9, S. 667–668; Voormann, F.; Pfeifer, M.: Die Kämpf-Stegträger der Eissporthalle Bad Reichenhall – Eine typische Holzkonstruktion der 1950er und 1960er Jahre? Bautechnik 84 (2007) H. 1, S. 1–7; BGH, Urteil vom 12.01.2010 – 1 StR 272/09',
          'Petroski, H. (1994): Design Paradigms: Case Histories of Error and Judgment in Engineering (Cambridge University Press)'
        ]}
        regelwerke={[
          { title: 'DAfStb-Alkali-Richtlinie (Alkalireaktion im Beton), Ausgabe 2013-10', url: 'https://www.dafstb.de/' },
          { title: 'VDI 6200 (Standsicherheit von Bauwerken - Regelmäßige Überprüfung)', url: 'https://www.vdi.de/richtlinien/details/vdi-6200-standsicherheit-von-bauwerken-regelmaessige-ueberpruefung' },
          { title: 'DIN 1076:2026-01 (Ingenieurbauwerke im Zuge von Straßen und Wegen – Überwachung und Prüfung)' },
          { title: 'DIN EN 12620 (Gesteinskörnungen für Beton)' },
          { title: 'DIN EN 1995-1-1 / Eurocode 5 (Bemessung und Konstruktion von Holzbauten)' },
          { title: 'DIN EN 1992-2 / Eurocode 2 (Betonbrücken - Bemessungs- und Konstruktionsregeln)' }
        ]}
        formeln={[
          {
            formel: 'Na_2O_{äq} = \\%Na_2O + 0{,}658 \\cdot \\%K_2O \\le 0{,}60\\% \\quad (\\text{NA-Zement})',
            erklaerung: 'Äquivalenter Natriumoxidgehalt von Zementen nach DIN EN 197 / DAfStb-Alkali-Richtlinie. Niedrigalkalische Zemente (NA-Zemente) begrenzen das Risiko schädigender Alkali-Kieselsäure-Reaktionen. Der Grenzwert 0,60 % gilt allgemein; für hüttensandreiche Zemente nennt DIN 1164-10 höhere Grenzwerte (z. B. CEM II/B-S ≤ 0,70 %, CEM III/A ≤ 0,95 bzw. 1,10 %, CEM III/B und III/C ≤ 2,00 %).',
            quelle: 'DIN 1164-10 & DAfStb-Alkali-Richtlinie'
          },
          {
            formel: 'K_I = Y \\cdot \\sigma \\cdot \\sqrt{\\pi a} \\ge K_{Ic} \\quad [\\text{MPa}\\sqrt{\\text{m}}]',
            erklaerung: 'Bruchkriterium der linearen elastischen Bruchmechanik (LEBM): Ein instabiler Sprödbruch tritt ein, wenn die Spannungsintensität an der Rissspitze die kritische Bruchzähigkeit KIc des Werkstoffs überschreitet (z. B. Silver Bridge).',
            quelle: 'Griffith-Irwin Bruchmechanik'
          },
          {
            formel: '\\tau_f = c\' + (\\sigma - u) \\cdot \\tan\\varphi\' \\xrightarrow{u \\rightarrow \\sigma} \\tau_f \\approx 0',
            erklaerung: 'Mohr-Coulomb-Bruchkriterium mit effektiven Scherparametern c′, φ′ unter Porenwasserüberdruck u (Scherverflüssigung / Static Liquefaction): Steigt der Porenwasserdruck bis zur Normalspannung an, fällt die effektive Scherfestigkeit auf null (Dammbruch Stava).',
            quelle: 'Terzaghi / Bodenmechanik'
          },
          {
            formel: '-\\text{NH}-\\text{CH}_2-\\text{NH}- + \\text{H}_2\\text{O} \\xrightarrow{\\text{H}^+, \\, T} -\\text{NH}_2 + \\text{HCHO} + \\text{H}_2\\text{N}-',
            erklaerung: 'Säurekatalysierte Hydrolyse von Harnstoff-Formaldehyd-Harzen (UF-Leimen) unter Einwirkung permanenter Feuchte und Kondenswasserbildung (Bad Reichenhall).',
            quelle: 'Bauchemie der Polymerklebstoffe'
          }
        ]}
      />
    </div>
  );
}
