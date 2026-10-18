import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InlineMath, BlockMath } from 'react-katex';
import {
  Sparkles,
  Rocket,
  Compass,
  FileCheck,
  FlaskConical,
  Award,
  Layers,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  Leaf,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Target,
  BarChart3,
  Scale
} from 'lucide-react';

interface InnovationPreset {
  id: string;
  name: string;
  category: string;
  trlCurrent: number;
  description: string;
  advantages: string[];
  bottlenecks: string[];
  regulationPath: string;
  foerderung: string;
}

const PRESETS: InnovationPreset[] = [
  {
    id: 'carbonbeton',
    name: 'Carbonbeton & Textilbewehrung',
    category: 'Hochleistungs-Verbundwerkstoffe',
    trlCurrent: 8,
    description: 'Ersatz von korrosionsanfälligem Betonstahl durch nichtrostende Carbon- oder Basaltfasergitter mit Epoxid- oder mineralischer Matrix. Ermöglicht schlanke Bauteile mit nur 10–15 mm Betondeckung.',
    advantages: [
      'Gewichtsersparnis bis zu 50 %, massive CO₂-Reduktion durch Materialeinsparung',
      'Vollständige Korrosionsfreiheit gegenüber Tausalzen (keine Lochfraßkorrosion)',
      'Zugfestigkeit der Carbonfaser (bis zu 3.000 MPa) ca. 6-mal höher als B500B'
    ],
    bottlenecks: [
      'Geringere Bruchdehnung (sprödes Versagen ohne ausgeprägte Fließzone)',
      'Brandverhalten organischer Tränkungsmittel (Matrixabbau ab ca. 150 °C)',
      'Recycling und Trennung der Carbonfasern am Lebensende (Szenario C)'
    ],
    regulationPath: 'Allgemeine bauaufsichtliche Zulassungen (abZ) und aBG für Einzelsysteme (z. B. TUDALIT, Solidian) beim DIBt; Normungsentwurf DIN 1045-100 in Vorbereitung.',
    foerderung: 'BMBF Zwanzig20 "C³ – Carbon Concrete Composite", Zukunft Bau'
  },
  {
    id: 'geopolymer',
    name: 'Geopolymere & Alkalisch aktivierte Bindemittel (AAM)',
    category: 'Zementfreie / Klinkereffiziente Bindemittel',
    trlCurrent: 6,
    description: 'Bindemittel auf Basis von Alumosilikaten (kalzinierte Tone, Hüttensand, Flugaschen), die mit alkalischen Aktivatoren (Wasserglas, Natronlauge) polykondensieren – ohne Portlandzementklinker.',
    advantages: [
      'Bis zu 75 % weniger CO₂-Emissionen im Vergleich zu reinem CEM I',
      'Extrem hohe Säure- und Sulfatbeständigkeit (z. B. im Abwasserbereich / Biogas)',
      'Hervorragende thermische Beständigkeit bis 1.000 °C'
    ],
    bottlenecks: [
      'Handhabung hochalkalischer Aktivatorlösungen im Transportbetonwerk (Arbeitsschutz)',
      'Stark schwankende Reaktivität regionaler Rohstoffe und Schwindneigung',
      'Fehlende Langzeitdaten zur Passivierung von herkömmlichem Betonstahl'
    ],
    regulationPath: 'Vorhabenbezogene Bauartgenehmigungen (vBG) und Zustimmung im Einzelfall (ZiE); erste DIBt-Zulassungen für Betonfertigteile im Tiefbau.',
    foerderung: 'Zukunft Bau (BBSR), Horizon Europe, ZIM'
  },
  {
    id: 'myzelium',
    name: 'Myzel-Baustoffe & Pilz-Biokomposite',
    category: 'Zirkuläre Bio-Baustoffe',
    trlCurrent: 5,
    description: 'Pilzmyzel (z. B. Ganoderma lucidum), das auf landwirtschaftlichen Reststoffen (Hanfschäben, Sägemehl, Stroh) wächst und diese zu druckfesten, formstabilen Dämm- und Akustikelementen verfilzt.',
    advantages: [
      '100 % biobasiert, vollständig kompostierbar (Cradle-to-Cradle Gold-Potenzial)',
      'Sehr gute Wärmeleitfähigkeit (λ ≈ 0,038 bis 0,042 W/(mK))',
      'Natürlicher Brandschutz durch Chitinanteile in den Zellwänden (Klasse B2 / B1)'
    ],
    bottlenecks: [
      'Feuchteempfindlichkeit im ungeschützten Außenbereich (Gefahr von Schimmelwachstum)',
      'Standardisierung von Rohstoffchargen bei biologischen Wachstumsprozessen',
      'Inaktivierung des Myzels (Hitzebehandlung) erfordert genaue Prozesskontrolle'
    ],
    regulationPath: 'Aktuell als Dämmstoff über Einzelprüfungen nach DIN EN 13162 / EAD in Vorbereitung; Einsatz primär im Trocken- und Innenausbau.',
    foerderung: 'BMBF Bioökonomie, DBU (Deutsche Bundesstiftung Umwelt), EU EIC'
  },
  {
    id: 'biobeton',
    name: 'Bakteriell selbstheilender Beton (Bio-Beton)',
    category: 'Smarte Werkstoffe & Bionik',
    trlCurrent: 7,
    description: 'Verkapselte Sporen von alkaliphilen Bodenbakterien (z. B. Bacillus pseudofirmus) zusammen mit Nährstoffen (Calciumlactat). Bei Rissbildung und Wassereintritt dichten die Bakterien Risse bis 0,8 mm durch mikrobiell induzierte Calcitfällung (MICP) autonom ab.',
    advantages: [
      'Drastische Verlängerung der Bauwerkslebensdauer im Tief-, Wasser- und Tunnelbau',
      'Verringerung von Instandhaltungs- und Sanierungskosten um bis zu 60 %',
      'Konstruktive Reduktion der rechnerischen Rissbreitenbeschränkung (wk nach EC2)'
    ],
    bottlenecks: [
      'Überlebensrate der Sporen unter hohem mechanischem Mischdruck und hohem pH-Wert (> 12,5)',
      'Kostenaufschlag gegenüber Standardbetonzusatzmitteln',
      'Reaktionskinetik benötigt einige Wochen Feuchtekontakt zur vollständigen Heilung'
    ],
    regulationPath: 'Zulassung als Betonzusatzmittel nach DIN EN 934-2 bzw. mit abZ/aBG für WU-Betonkonstruktionen (Wasserundurchlässige Bauwerke).',
    foerderung: 'Horizon Europe, TU Delft Spin-off-Programme, Zukunft Bau'
  },
  {
    id: 'ccu_beton',
    name: 'CO₂-Mineralisierung & Sequestrierter Beton (CCU)',
    category: 'Dekarbonisierung & Carbon Capture',
    trlCurrent: 8,
    description: 'Injektion von industriell abgeschiedenem CO₂ in Frischbeton oder in aufbereitetes Betonabbruchgranulat. Das CO₂ reagiert mit Calciumhydroxid dauerhaft zu nanokristallinem Calciumcarbonat (CaCO₃).',
    advantages: [
      'Dauerhafte thermodynamische Bindung von bis zu 15 kg CO₂ pro Tonne Rezyklat',
      'Erhöhung der Frühfestigkeit und Druckfestigkeit um 10–15 %',
      'Schließt den CO₂-Kreislauf des Kalkbrennens direkt im Sekundärbaustoff'
    ],
    bottlenecks: [
      'Logistik und Bereitstellung von verflüssigtem CO₂ auf dem Recyclinghof / Betonwerk',
      'Investitionskosten für Druck- oder Begasungskammern',
      'Normative Anrechnung der negativen Emissionen in der Ökobilanz (EN 15804 Modul D/A1)'
    ],
    regulationPath: 'Bereits großtechnisch zugelassen in den USA und Europa (z. B. Neustark, CarbonCure); Konformitätsnachweise nach DIN EN 206 / DIN 1045-2.',
    foerderung: 'Klimaschutzverträge (BMWK), Innovation Fund (EU), Zukunft Bau'
  }
];

export default function BpInnovationen() {
  const [activeTab, setActiveTab] = useState<'ueberblick' | 'trl' | 'forschung' | 'werkstoffe' | 'zulassung' | 'rechner'>('ueberblick');
  const [selectedTrlLevel, setSelectedTrlLevel] = useState<number>(4);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('carbonbeton');

  // Interactive Rechner State
  const [userConceptValid, setUserConceptValid] = useState<boolean>(true);
  const [userLabVerified, setUserLabVerified] = useState<boolean>(true);
  const [userScaleUp, setUserScaleUp] = useState<boolean>(false);
  const [userPilotField, setUserPilotField] = useState<boolean>(false);
  const [userZulassung, setUserZulassung] = useState<boolean>(false);
  const [userSerialProduction, setUserSerialProduction] = useState<boolean>(false);

  const calculateUserTrl = (): number => {
    if (userSerialProduction && userZulassung) return 9;
    if (userZulassung) return 8;
    if (userPilotField) return 7;
    if (userScaleUp) return 6;
    if (userLabVerified) return 4;
    if (userConceptValid) return 2;
    return 1;
  };

  const currentTrl = calculateUserTrl();

  const selectedPreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* 1. HEADER CONTAINER gemäß Styleguide */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Sparkles className="text-shiraz" size={24} />
              <span>Bauprodukt-Innovationen, F&amp;E &amp; Technology Readiness Level</span>
            </h2>
            <p className="text-xs text-text-main/60 mt-1">
              Forschung, Entwicklung (F&amp;E) und Reifegradbewertung (TRL 1–9) neuartiger Baustoffe von der Laboridee bis zur DIBt-Zulassung
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1.5 bg-shiraz/10 text-shiraz rounded-xl text-xs font-bold border border-shiraz/20 flex items-center gap-1.5">
              <Rocket size={14} /> F&amp;E Roadmap
            </span>
          </div>
        </div>

        {/* Teaser Box */}
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Die Transformation der Bauwirtschaft zur <strong>Klimaneutralität (Net-Zero 2045)</strong> und zur echten <strong>Kreislaufwirtschaft</strong> erfordert 
            einen beispiellosen Innovationsschub. Ob klinkereffiziente Bindemittel, Carbonbeton, biobasierte Myzel-Dämmstoffe oder CO₂-mineralisierte Rezyklate: 
            Baustoffinnovationen bewegen sich in einem hochregulierten Spannungsfeld zwischen <strong>akademischer Grundlagenforschung</strong>, 
            <strong>normativer Konformitätsprüfung (TRL 1–9)</strong> und den strengen <strong>Sicherheitsnachweisen der Musterbauordnung (MBO / DIBt)</strong>.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button
            onClick={() => setActiveTab('ueberblick')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'ueberblick'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Compass size={16} /> a) Innovation &amp; Transformation
          </button>
          <button
            onClick={() => setActiveTab('trl')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'trl'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <BarChart3 size={16} /> b) TRL-Skala (1–9) im Bauwesen
          </button>
          <button
            onClick={() => setActiveTab('forschung')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'forschung'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <FlaskConical size={16} /> c) F&amp;E-Landschaft &amp; Förderung
          </button>
          <button
            onClick={() => setActiveTab('werkstoffe')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'werkstoffe'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Layers size={16} /> d) Zukunftswerkstoffe im Portrait
          </button>
          <button
            onClick={() => setActiveTab('zulassung')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zulassung'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <FileCheck size={16} /> e) Zulassungswege (DIBt / ETA)
          </button>
          <button
            onClick={() => setActiveTab('rechner')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'rechner'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Target size={16} /> f) Interaktiver TRL-Rechner
          </button>
        </div>

        {/* ---------------- TAB 1: UEBERBLICK ---------------- */}
        {activeTab === 'ueberblick' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-text-main text-base">Der Dekarbonisierungsdruck</h3>
                <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                  Die Zement- und Betonindustrie ist für rund <strong>8 % der weltweiten Treibhausgasemissionen</strong> verantwortlich. 
                  Bis 2045 muss die Bauwirtschaft nach dem Bundes-Klimaschutzgesetz (KSG) bilanziell treibhausgasneutral wirtschaften. 
                  Inkrementelle Optimierungen genügen nicht mehr – gefordert sind fundamentale <strong>Werkstoff- und Technologieinnovationen</strong>.
                </p>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-text-main text-base">Das "Tal des Todes" im Bauwesen</h3>
                <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                  Viele vielversprechende Baustoffe scheitern beim Übergang von <strong>TRL 4 (Laborversuch)</strong> zu <strong>TRL 7/8 (bauaufsichtliche Zulassung)</strong>. 
                  Gründe sind extrem hohe Kosten für Bauteilversuche, langwierige Prüfverfahren (3–5 Jahre), 
                  strikte persönliche Haftungsrisiken der Planer nach BGB/VOB sowie fehlende Standardisierung in den Eurocodes.
                </p>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-shiraz/10 text-shiraz flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-text-main text-base">Die Zirkularitäts-Wende</h3>
                <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                  Mit dem Inkrafttreten der <strong>Ersatzbaustoffverordnung (EBV)</strong> und der Neufassung der <strong>EU-Bauprodukteverordnung (CPR)</strong> rücken 
                  der Digitale Produktpass (DPP), Rezyklatanteile und die sortenreine Demontierbarkeit in den Fokus. 
                  Innovation bedeutet heute: Entwickle Baustoffe, die nicht nur halten, sondern am Lebensende wieder zu Primärrohstoffen werden.
                </p>
              </div>
            </div>

            {/* Strukturierte Tabelle: Barrieren vs. Enabler */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Scale className="text-shiraz" size={18} />
                <span>Spannungsfeld im Bauprodukt-Markt: Hemmnisse vs. Treiber</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <th className="p-3">Kategorie</th>
                      <th className="p-3 text-red-700">Hemmnisse &amp; Barrieren</th>
                      <th className="p-3 text-green-700">Treiber &amp; Innovations-Enabler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-bold text-slate-800">Baurecht &amp; Normung</td>
                      <td className="p-3 text-slate-600">Konservative DIN EN-Normen, langwierige Zulassungsverfahren (abZ/aBG bis zu 4 Jahre), hohe Prüfkosten.</td>
                      <td className="p-3 text-slate-600">Reallabor-Gesetze, Experimentierklauseln in den Landesbauordnungen (z. B. Gebäudetyps E), DIBt-Fast-Track für Nachhaltigkeit.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800">Haftung &amp; Versicherung</td>
                      <td className="p-3 text-slate-600">Planer und Statiker haften für 30 Jahre bei Mängeln; Berufshaftpflichtversicherer fordern anerkannte Regeln der Technik.</td>
                      <td className="p-3 text-slate-600">Vorhabenbezogene Bauartgenehmigungen (vBG), herstellergestützte Systemgarantien und Zertifikate durch akkreditierte Prüfstellen (BAM, Fraunhofer).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800">Wirtschaftlichkeit</td>
                      <td className="p-3 text-slate-600">Hohe Erstinvestitionen für Skalierung; fossile Standardbaustoffe sind subventioniert oder verfügen über abgeschriebene Großanlagen.</td>
                      <td className="p-3 text-slate-600">Steigende CO₂-Preise im EU-ETS, ESG-Kriterien bei Bankkrediten, Bepreisung des Grauen Kohlenstoffs (LCA) bei Gebäudezertifizierungen (DGNB, QNG).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800">Lieferkette &amp; Handwerk</td>
                      <td className="p-3 text-slate-600">Mangelnde Erfahrung auf der Baustelle; Verarbeiter greifen aus Gewohnheit auf bekannte Standardmischungen zurück.</td>
                      <td className="p-3 text-slate-600">Plug-and-Play-Fertigteile, werkseitige Vorkonfektionierung, digitale Einbauanleitungen und Schulungsinitiativen der Hersteller.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: TRL-SKALA ---------------- */}
        {activeTab === 'trl' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <BarChart3 className="text-shiraz" size={18} />
                <span>Die 9 Technology Readiness Levels (TRL) nach NASA / EU Horizon Europe für Bauprodukte</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                Die TRL-Skala (ursprünglich von der NASA in den 1970er Jahren entwickelt und heute von der Europäischen Kommission 
                nach <strong>DIN EN ISO 16290</strong> standardisiert) misst den technischen Reifegrad einer Innovation auf einer Skala von 1 bis 9. 
                Im Bauwesen unterscheidet man drei übergeordnete Abschnitte: <strong>Forschung (TRL 1–3)</strong>, 
                <strong>Entwicklung &amp; Prototyp (TRL 4–6)</strong> sowie <strong>Zulassung &amp; Marktreife (TRL 7–9)</strong>.
              </p>
            </div>

            {/* Interaktiver TRL-Wähler */}
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
                const isSelected = selectedTrlLevel === lvl;
                const phaseColor = lvl <= 3 ? 'border-amber-400' : lvl <= 6 ? 'border-blue-400' : 'border-green-500';
                return (
                  <button
                    key={lvl}
                    onClick={() => setSelectedTrlLevel(lvl)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-shiraz text-white border-shiraz shadow-md scale-105 ring-2 ring-shiraz/20'
                        : `bg-white hover:bg-slate-50 text-text-main border-slate-200 ${phaseColor}`
                    }`}
                  >
                    <span className="text-xs uppercase font-mono tracking-wider opacity-70">Level</span>
                    <span className="text-lg font-black">{lvl}</span>
                  </button>
                );
              })}
            </div>

            {/* Detaillierte Box für den ausgewählten TRL */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-shiraz text-white rounded-lg font-black text-sm">
                    TRL {selectedTrlLevel}
                  </span>
                  <h4 className="font-bold text-base text-slate-800">
                    {selectedTrlLevel === 1 && 'Grundlegende Prinzipien beobachtet und beschrieben'}
                    {selectedTrlLevel === 2 && 'Technologiekonzept und/oder Anwendung formuliert'}
                    {selectedTrlLevel === 3 && 'Experimenteller Nachweis des Konzepts (Proof of Concept)'}
                    {selectedTrlLevel === 4 && 'Technologie im Laboratorium validiert (Lab Scale)'}
                    {selectedTrlLevel === 5 && 'Technologie in relevanter Umgebung validiert (Pilotversuch)'}
                    {selectedTrlLevel === 6 && 'Technologie in relevanter Umgebung demonstriert (Prototyp)'}
                    {selectedTrlLevel === 7 && 'Demonstration des Systems im Einsatzbereich (Reallabor / ZiE)'}
                    {selectedTrlLevel === 8 && 'System komplett, geprüft und qualifiziert (abZ / ETA / aBG)'}
                    {selectedTrlLevel === 9 && 'Tatsächliches System im Praxiseinsatz bewährt (Serienproduktion)'}
                  </h4>
                </div>
                <span className={`text-xxs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  selectedTrlLevel <= 3 
                    ? 'bg-amber-100 text-amber-900' 
                    : selectedTrlLevel <= 6 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-green-100 text-green-900'
                }`}>
                  {selectedTrlLevel <= 3 ? 'Phase I: Grundlagenforschung' : selectedTrlLevel <= 6 ? 'Phase II: Angewandte F&E' : 'Phase III: Marktreife & Normung'}
                </span>
              </div>

              {/* Bauspezifische Übersetzung */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 bg-off-white p-4 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block uppercase tracking-wide text-xxs">
                    Was bedeutet das konkret auf der Baustelle / im Baustofflabor?
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedTrlLevel === 1 && 'Literaturrecherchen, theoretische thermodynamische Simulationen von Bindemitteln, atomistische Kristallisationsmodelle (z. B. C-S-H-Phasenwachstum) im Reagenzglas.'}
                    {selectedTrlLevel === 2 && 'Formulierung konkreter Baustoff-Rezepturen (z. B. "Kalzinierter Ton aus Bayern + Wasserglas als klinkerarmer Zementersatz"). Erste theoretische Patentanmeldungen.'}
                    {selectedTrlLevel === 3 && 'Herstellung erster kleiner Mörtelprismen (40 × 40 × 160 mm). Messung von Früh- und 28-Tage-Druckfestigkeit im Universitätslabor. Erste qualitative Machbarkeitsbestätigung.'}
                    {selectedTrlLevel === 4 && 'Systematische Prüfreihen nach Norm (DIN EN 196, DIN EN 12390). Kalorimetrie, Schwindmessungen, Frost-Tau-Widerstand und Karbonatisierungstests. Werkstoffkennwerte statistisch erfasst.'}
                    {selectedTrlLevel === 5 && 'Hochskalierung vom Laborrührwerk auf den 1-m³-Mischer im Transportbetonwerk. Prüfung von Pumpfähigkeit, Verarbeitbarkeitszeit (90 Minuten) und Konsistenzverlust bei Sommer-/Wintertemperaturen.'}
                    {selectedTrlLevel === 6 && 'Herstellung realer Bauteile im Werk (z. B. eine 6 m lange Spannbetonplatte oder 100 m² Fassadenelemente). Belastungsversuche bis zum Bruch unter realistischen Randbedingungen.'}
                    {selectedTrlLevel === 7 && 'Einbau des Baustoffs in ein reales Referenzgebäude über eine "Zustimmung im Einzelfall" (ZiE) oder vorhabenbezogene Bauartgenehmigung (vBG). Installation von Sensoren zur Langzeitüberwachung.'}
                    {selectedTrlLevel === 8 && 'Erteilung der allgemeinen bauaufsichtlichen Zulassung (abZ) oder aBG durch das DIBt oder European Technical Assessment (ETA). Alle Prüfzeugnisse akkreditierter Institute liegen vor.'}
                    {selectedTrlLevel === 9 && 'Das Bauprodukt ist regulär im Baustofffachhandel gelistet, besitzt ein CE-Zeichen, eine Leistungserklärung (DoP) und wird in Standard-Ausschreibungstexten nach VOB/A genannt.'}
                  </p>
                </div>

                <div className="space-y-2 bg-off-white p-4 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block uppercase tracking-wide text-xxs">
                    Typische Förderprogramme &amp; Akteure
                  </span>
                  <div className="text-slate-600 leading-relaxed space-y-1">
                    {selectedTrlLevel <= 3 && (
                      <>
                        <p>• <strong>Förderer:</strong> DFG (Deutsche Forschungsgemeinschaft), EU Horizon Europe (Pillar 1 - ERC / Marie Curie).</p>
                        <p>• <strong>Akteure:</strong> Universitäten, Max-Planck-Institute, BAM (Bundesanstalt für Materialforschung).</p>
                        <p>• <strong>Kostenrahmen:</strong> 50.000 – 300.000 € (überwiegend Personalmittel für Doktoranden / Postdocs).</p>
                      </>
                    )}
                    {selectedTrlLevel >= 4 && selectedTrlLevel <= 6 && (
                      <>
                        <p>• <strong>Förderer:</strong> Zukunft Bau (BBSR), ZIM (Zentrales Innovationsprogramm Mittelstand), KMU-innovativ.</p>
                        <p>• <strong>Akteure:</strong> Fraunhofer-Institute (IBP, WKI), industrielle F&amp;E-Abteilungen, Zement- und Bauchemie-KMU.</p>
                        <p>• <strong>Kostenrahmen:</strong> 300.000 – 2.000.000 € (Pilotanlagen, Prüfkörper, Versuchsserien).</p>
                      </>
                    )}
                    {selectedTrlLevel >= 7 && (
                      <>
                        <p>• <strong>Förderer:</strong> EU Innovation Fund, BMWK Klimaschutzverträge, Reallabore der Energiewende.</p>
                        <p>• <strong>Akteure:</strong> DIBt, MPA (Materialprüfanstalten), Baukonzerne, Generalübernehmer, Investoren.</p>
                        <p>• <strong>Kostenrahmen:</strong> 1.000.000 – 10.000.000+ € (Zulassungsprüfungen, Brandprüfungen, Industrieanlagen).</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: FORSCHUNG & ENTWICKLUNG ---------------- */}
        {activeTab === 'forschung' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box 1: Die F&E-Phasen im Bauwesen */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <FlaskConical className="text-shiraz" size={18} />
                  <span>Phasenmodell eines Baustoff-F&amp;E-Projekts</span>
                </h4>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-800 block mb-1">Phase 1: Synthese &amp; Rezepturoptimierung</strong>
                    Reaktionskinetik, Partikelgrößenverteilung (Sieblinie), rheologische Modellierung (Viskosität, Fließgrenze nach Bingham).
                  </div>
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-800 block mb-1">Phase 2: Dauerhaftigkeits- &amp; Alterungsprüfungen</strong>
                    Klimakammern, Frost-Tau-Wechsel (CDF-Test nach CEN/TS 12390-9), Schnellkarbonatisierung unter 1–2 % CO₂, Sulfatwiderstand.
                  </div>
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-800 block mb-1">Phase 3: Brandschutz- &amp; Toxikologieprüfung</strong>
                    Brandprüfung im Großofen (DIN EN 1363 / DIN EN 13501), Rauchgasentwicklung, Ausgasung flüchtiger organischer Verbindungen (VOC nach AgBB).
                  </div>
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-800 block mb-1">Phase 4: Ökobilanzierung (LCA) &amp; EPD-Erstellung</strong>
                    Berechnung von GWP (Global Warming Potential), PE-NR (Primärenergie nicht erneuerbar) über den Lebenszyklus A1–A3, C1–C4 und D nach DIN EN 15804.
                  </div>
                </div>
              </div>

              {/* Box 2: Fördermittellandschaft */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Award className="text-shiraz" size={18} />
                  <span>Zentrale Fördermittelgeber für Bau-Innovationen</span>
                </h4>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-slate-800">Zukunft Bau (BBSR / BMWSB)</strong>
                      <span className="text-xxs px-2 py-0.5 bg-shiraz/10 text-shiraz rounded-full font-bold">Standard für Baustoffe</span>
                    </div>
                    Förderung von angewandter Forschung im Hoch- und Ingenieurbau. Schwerpunkte: Klimagerechtes Bauen, zirkuläre Baustoffe, Digitalisierung und Holzbau.
                  </div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-slate-800">ZIM – Zentrales Innovationsprogramm Mittelstand</strong>
                      <span className="text-xxs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold">BMWK</span>
                    </div>
                    Förderung marktnaher FuE-Kooperationsprojekte zwischen mittelständischen Bauprodukt-Herstellern und Forschungsinstituten (bis zu 550.000 € Zuschuss pro Partner).
                  </div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-slate-800">Horizon Europe – Built4People Partnership</strong>
                      <span className="text-xxs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">EU-Leitinitiative</span>
                    </div>
                    Multinationale Konsortien zur Dekarbonisierung des europäischen Gebäudebestands. Fokus auf Industrialisierung, Vorfertigung und CO₂-negative Materialien.
                  </div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-slate-800">Deutsche Bundesstiftung Umwelt (DBU)</strong>
                      <span className="text-xxs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-bold">Umwelt &amp; Natur</span>
                    </div>
                    Modellprojekte zum Schutz von Ressourcen, Ersatz von Primärrohstoffen (z. B. Kies/Sand durch Lehm, Hanf, Myzel) und Schadstoffvermeidung.
                  </div>
                </div>
              </div>

            </div>

            {/* Patentierung vs. Normung */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb size={16} className="text-shiraz" />
                <span>Strategisches Dilemma: Patentrecht vs. Normung im Bauingenieurwesen</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Während in der Elektronik- oder Pharmabranche Patente 20 Jahre lang Monopolrenditen sichern, gilt im Bauwesen eine Besonderheit: 
                <strong>Öffentliche Auftraggeber dürfen nach VOB/A § 7 keine geschützten Markennamen oder patentierte Alleinstellungsmerkmale ausschreiben</strong>, 
                es sei denn, es existiert keine andere marktreife Lösung. Hersteller innovativer Baustoffe müssen daher eine zweigleisige Strategie fahren: 
                Verfahrenspatente für die chemische Herstellung sichern, gleichzeitig aber zügig auf <strong>offene Normung (z. B. DIN SPEC, DIN EN)</strong> 
                oder DIBt-Zulassungen hinwirken, damit Planer die Technologie rechtssicher in Leistungsverzeichnisse aufnehmen können.
              </p>
            </div>
          </div>
        )}

        {/* ---------------- TAB 4: ZUKUNFTSWERKSTOFFE ---------------- */}
        {activeTab === 'werkstoffe' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Preset Selector */}
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    selectedPresetId === preset.id
                      ? 'bg-shiraz text-white border-shiraz shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles size={14} />
                  <span>{preset.name}</span>
                  <span className={`ml-1 px-1.5 py-0.2 rounded-full text-xxs font-mono ${
                    selectedPresetId === preset.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    TRL {preset.trlCurrent}
                  </span>
                </button>
              ))}
            </div>

            {/* Detailkarte des ausgewählten Werkstoffs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-slate-900">{selectedPreset.name}</h3>
                    <span className="px-2.5 py-0.5 bg-shiraz/10 text-shiraz rounded-full text-xs font-bold">
                      TRL {selectedPreset.trlCurrent} / 9
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{selectedPreset.category}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-off-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <Award size={14} className="text-shiraz" />
                  <span>Förderung: {selectedPreset.foerderung}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-normal bg-off-white p-4 rounded-xl border border-slate-200">
                {selectedPreset.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vorteile */}
                <div className="p-4 bg-green-50/70 border border-green-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-xs text-green-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <CheckCircle2 size={16} className="text-green-600" /> Bautechnische Vorteile &amp; Impact
                  </h4>
                  <ul className="text-xs text-green-800 space-y-1.5 font-normal">
                    {selectedPreset.advantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-green-600 font-bold">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hemmnisse / Bottlenecks */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertTriangle size={16} className="text-amber-600" /> Kritische Flaschenhälse &amp; F&amp;E-Bedarf
                  </h4>
                  <ul className="text-xs text-amber-800 space-y-1.5 font-normal">
                    {selectedPreset.bottlenecks.map((bot, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{bot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Zulassungspfad */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileCheck size={16} className="text-shiraz" /> Aktueller bauaufsichtlicher Zulassungsstatus:
                </span>
                <p className="text-slate-600 leading-relaxed font-normal">
                  {selectedPreset.regulationPath}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 5: ZULASSUNG (DIBt / ETA) ---------------- */}
        {activeTab === 'zulassung' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <Building2 className="text-shiraz" size={18} />
                <span>Vom Laborversuch zur Baustelle: Das deutsche und europäische Zulassungssystem</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                Im deutschen Bauordnungsrecht (Musterbauordnung MBO § 17 ff.) darf ein Bauprodukt nur verwendet werden, 
                wenn es entweder einer harmonisierten europäischen Norm (hEN) oder einer nationalen DIN-Norm entspricht, 
                oder wenn seine Verwendbarkeit durch einen <strong>bauaufsichtlichen Verwendbarkeitsnachweis</strong> nachgewiesen ist.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box: Nationale Nachweise (DIBt) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">DE</span>
                  <h4 className="font-bold text-sm text-slate-800">Nationale Nachweise über das DIBt</h4>
                </div>
                
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1">abZ – Allgemeine bauaufsichtliche Zulassung</strong>
                    Bezieht sich auf das <strong>Bauprodukt selbst</strong> (z. B. einen neuartigen Faserverbundwerkstoff oder ein Zementzusatzmittel). 
                    Geregelt durch das Deutsche Institut für Bautechnik (DIBt). Gültigkeit meist 5 Jahre.
                  </div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1">aBG – Allgemeine Bauartgenehmigung</strong>
                    Bezieht sich auf das <strong>Zusammenfügen von Bauprodukten zu Bauarten</strong> (z. B. Bemessung und Verankerung von Carbonbeton-Trägern nach MBO § 16a). 
                    Wird seit 2017 zwingend getrennt von der abZ erteilt.
                  </div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1">ZiE / vBG – Zustimmung im Einzelfall</strong>
                    Für ein <strong>konkretes Bauvorhaben</strong> bei der obersten Bauaufsicht des jeweiligen Bundeslandes. 
                    Ideal für Pilotbauwerke und Reallabore (TRL 7), bevor eine teure bundesweite abZ beantragt wird.
                  </div>
                </div>
              </div>

              {/* Box: Europäische Nachweise (EOTA / CPR) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg font-bold text-xs">EU</span>
                  <h4 className="font-bold text-sm text-slate-800">Europäische Schiene (EOTA / CPR)</h4>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1">EAD – European Assessment Document</strong>
                    Die harmonisierte europäische Bewertungsrichtlinie, die erarbeitet wird, wenn für ein neuartiges Produkt noch keine hEN existiert.
                  </div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1">ETA – European Technical Assessment</strong>
                    Europäische Technische Bewertung auf Basis eines EAD. Ermöglicht die Anbringung der <strong>CE-Kennzeichnung</strong> 
                    und den freien Warenverkehr in allen 27 EU-Mitgliedsstaaten.
                  </div>

                  <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                    <strong className="text-slate-900 block mb-1">AVCP-Systeme (1+, 1, 2+, 3, 4)</strong>
                    Festlegung, ob eine notifizierte Stelle (Notified Body) die werkseigene Produktionskontrolle (WPK) überwachen muss 
                    (bei tragenden Bauteilen meist AVCP 1 oder 1+).
                  </div>
                </div>
              </div>

            </div>

            {/* Typischer Zeit- und Kostenplan */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={16} className="text-shiraz" />
                <span>Typischer Zulassungs-Fahrplan für eine Baustoff-Innovation</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                  <span className="font-bold text-shiraz block">Monat 1–6</span>
                  Antragstellung beim DIBt, Festlegung des Prüfprogramms (Prüfplan durch Sachverständigenausschuss).
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                  <span className="font-bold text-shiraz block">Monat 7–24</span>
                  Durchführung aller statischen, dynamischen, Brand- und Alterungsprüfungen an akkreditierten MPAs.
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                  <span className="font-bold text-shiraz block">Monat 25–30</span>
                  Begutachtung der Prüfberichte im DIBt-Ausschuss, Erarbeitung des Zulassungsentwurfs, WPK-Einrichtung.
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-slate-200">
                  <span className="font-bold text-green-700 block">Monat 31+</span>
                  Erteilung der abZ / aBG, Veröffentlichung im DIBt-Register, Start der regulären Vermarktung (TRL 8/9).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 6: INTERAKTIVER TRL-RECHNER ---------------- */}
        {activeTab === 'rechner' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <Target className="text-shiraz" size={18} />
                <span>Interaktiver Reifegrad-Check: Ermitteln Sie den TRL Ihres Bauprodukt-Projekts</span>
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                Beantworten Sie die folgenden Fragen entlang der Entwicklungskette eines Baustoffs, 
                um den aktuellen Reifegrad (TRL 1–9), den nächsten technischen Meilenstein und passende Förderprogramme zu berechnen.
              </p>
            </div>

            {/* Checkbox-Grid */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                Projektkriterien (Zutreffendes ankreuzen):
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-off-white cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={userConceptValid}
                    onChange={(e) => setUserConceptValid(e.target.checked)}
                    className="mt-0.5 accent-shiraz w-4 h-4 rounded"
                  />
                  <div>
                    <strong className="text-slate-800 block">1. Konzept &amp; Rezeptur formuliert (TRL 2+)</strong>
                    <span className="text-slate-500">Das theoretische Wirkprinzip und die Rohstoffbasis sind wissenschaftlich fundiert definiert.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-off-white cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={userLabVerified}
                    onChange={(e) => setUserLabVerified(e.target.checked)}
                    className="mt-0.5 accent-shiraz w-4 h-4 rounded"
                  />
                  <div>
                    <strong className="text-slate-800 block">2. Im Laboratorium validiert (TRL 4+)</strong>
                    <span className="text-slate-500">Standardisierte Prüfkörper (z. B. Prismen) haben Festigkeits- und Dauerhaftigkeitstests bestanden.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-off-white cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={userScaleUp}
                    onChange={(e) => setUserScaleUp(e.target.checked)}
                    className="mt-0.5 accent-shiraz w-4 h-4 rounded"
                  />
                  <div>
                    <strong className="text-slate-800 block">3. Technischer Scale-Up im Werk (TRL 6+)</strong>
                    <span className="text-slate-500">Das Material wurde in industriellen Mischern in realistischer Losgröße (ab 1 m³) erfolgreich hergestellt.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-off-white cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={userPilotField}
                    onChange={(e) => setUserPilotField(e.target.checked)}
                    className="mt-0.5 accent-shiraz w-4 h-4 rounded"
                  />
                  <div>
                    <strong className="text-slate-800 block">4. Prototyp / Pilotbauwerk errichtet (TRL 7+)</strong>
                    <span className="text-slate-500">Der Baustoff wurde in einem realen Reallabor oder Pilotgebäude (z. B. via ZiE/vBG) erfolgreich eingebaut.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-off-white cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={userZulassung}
                    onChange={(e) => setUserZulassung(e.target.checked)}
                    className="mt-0.5 accent-shiraz w-4 h-4 rounded"
                  />
                  <div>
                    <strong className="text-slate-800 block">5. Bauaufsichtliche Zulassung liegt vor (TRL 8+)</strong>
                    <span className="text-slate-500">Eine gültige abZ / aBG des DIBt oder eine europäische ETA mit CE-Kennzeichnung ist vorhanden.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-off-white cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={userSerialProduction}
                    onChange={(e) => setUserSerialProduction(e.target.checked)}
                    className="mt-0.5 accent-shiraz w-4 h-4 rounded"
                  />
                  <div>
                    <strong className="text-slate-800 block">6. Serienproduktion &amp; Markteinsatz (TRL 9)</strong>
                    <span className="text-slate-500">Das Produkt ist regulär lieferbar, in VOB-Ausschreibungen etabliert und besitzt eine WPK nach AVCP.</span>
                  </div>
                </label>

              </div>
            </div>

            {/* Auswertung & Cockpit */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-shiraz text-white flex items-center justify-center font-black text-2xl shadow-sm">
                    {currentTrl}
                  </div>
                  <div>
                    <span className="text-xxs uppercase tracking-wider font-bold text-slate-400">Errechneter Reifegrad</span>
                    <h4 className="font-extrabold text-lg text-slate-900">
                      Technology Readiness Level {currentTrl} von 9
                    </h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    currentTrl <= 3 ? 'bg-amber-100 text-amber-900' : currentTrl <= 6 ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'
                  }`}>
                    {currentTrl <= 3 ? 'Grundlagenforschung' : currentTrl <= 6 ? 'Angewandte Prototypen-Phase' : 'Zulassung & Vermarktung'}
                  </span>
                </div>
              </div>

              {/* Analyse & Handlungsempfehlungen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-off-white rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 block uppercase tracking-wide text-xxs flex items-center gap-1.5">
                    <ArrowRight size={14} className="text-shiraz" /> Nächster technologischer Flaschenhals
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {currentTrl < 4 && 'Führen Sie genormte Reihenprüfungen an Mörtel- und Betonprismen durch. Priorisieren Sie Langzeitparameter wie Schwinden, Karbonatisierung und Chloridmigration, um Investoren von der Dauerhaftigkeit zu überzeugen.'}
                    {currentTrl >= 4 && currentTrl < 6 && 'Verlassen Sie die Labormischung. Testen Sie das Material in einem realen Betonwerk unter Schwankungen der Zuschlagsfeuchte und logistischer Verarbeitbarkeit von mindestens 90 Minuten.'}
                    {currentTrl >= 6 && currentTrl < 8 && 'Bauen Sie ein Pilotprojekt über eine Zustimmung im Einzelfall (ZiE) oder vorhabenbezogene Bauartgenehmigung (vBG). Reichen Sie gleichzeitig den Zulassungsantrag beim DIBt ein.'}
                    {currentTrl >= 8 && 'Skalieren Sie das Vertriebsnetzwerk und etablieren Sie die werkseigene Produktionskontrolle (WPK). Initiieren Sie die Aufnahme in die relevanten DIN-Normenausschüsse.'}
                  </p>
                </div>

                <div className="p-4 bg-off-white rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 block uppercase tracking-wide text-xxs flex items-center gap-1.5">
                    <Award size={14} className="text-shiraz" /> Empfohlene Förderschiene
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {currentTrl <= 3 && 'DFG-Sachbeihilfe, EXIST-Forschungstransfer (für akademische Ausgründungen), EU Marie-Curie.'}
                    {currentTrl >= 4 && currentTrl <= 6 && 'Zukunft Bau (BBSR-Forschungsförderung), BMWK ZIM-Kooperationsprojekte, KMU-innovativ.'}
                    {currentTrl >= 7 && 'EU Innovation Fund, BMWK Klimaschutzverträge, InvestEU, industrielle Pilotbau-Zuschüsse der Bundesländer.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 2. STANDARDISIERTER FOOTER GEMÄSS STYLEGUIDE */}
      <ModuleFooter
        wikipedia={[
          { title: 'Technology Readiness Level', url: 'https://de.wikipedia.org/wiki/Technology_Readiness_Level' },
          { title: 'Carbonbeton', url: 'https://de.wikipedia.org/wiki/Carbonbeton' },
          { title: 'Geopolymer', url: 'https://de.wikipedia.org/wiki/Geopolymer' },
          { title: 'Deutsches Institut für Bautechnik (DIBt)', url: 'https://de.wikipedia.org/wiki/Deutsches_Institut_f%C3%BCr_Bautechnik' },
          { title: 'Bauprodukteverordnung', url: 'https://de.wikipedia.org/wiki/Bauprodukteverordnung' },
          { title: 'Zukunft Bau', url: 'https://de.wikipedia.org/wiki/Zukunft_Bau' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Springer Vieweg 2011',
          'Curbach, M.; Scheerer, S. et al.: Carbonbeton – Werkstoff, Konstruktion, Bemessung. Berlin: Ernst & Sohn 2022',
          'Davidovits, J.: Geopolymer Chemistry and Applications. 5th ed., Saint-Quentin: Institut Géopolymère 2020',
          'DIBt: Leitfaden für nationale und europäische Verwendbarkeitsnachweise für Bauprodukte. Berlin: DIBt Mitteilungen 2023',
          'BBSR (Hrsg.): Zukunft Bau – Forschungsförderung für die Baupraxis. Berichte Band 45, Bonn 2024'
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 16290 (Raumfahrtsysteme – Definition der Technology Readiness Levels (TRL) und Beurteilungskriterien)', url: 'https://www.dinmedia.de/' },
          { title: 'Musterbauordnung (MBO) § 17 bis 25 (Verwendbarkeitsnachweise, abZ, aBG und Ü-Zeichen)', url: 'https://www.bauministerkonferenz.de/' },
          { title: 'EU-Verordnung 2024/1100 (Bauprodukteverordnung CPR Revision zur Kreislaufwirtschaft)', url: 'https://eur-lex.europa.eu/' },
          { title: 'DIN EN 15804 (Nachhaltigkeit von Bauwerken – Umweltproduktdeklarationen EPD)', url: 'https://www.dinmedia.de/' }
        ]}
        formeln={[
          {
            formel: 'c_{\\text{min}} = \\max\\{c_{\\text{min,dur}}; \\, c_{\\text{min,b}}; \\, 10\\,\\text{mm}\\} - \\Delta c_{\\text{dur},\\gamma}',
            erklaerung: 'Mindestbetondeckung nach Eurocode 2: Bei nichtrostender Carbon- oder Textilbewehrung entfällt der Korrosionsanteil c_min,dur, sodass c_min auf bis zu 10–15 mm reduziert werden kann.',
            quelle: 'DIN EN 1992-1-1 / DIBt-Zulassungen Carbonbeton'
          },
          {
            formel: 'M_n(-\\text{Si-O-Al-O-})_n \\cdot w\\,\\text{H}_2\\text{O}',
            erklaerung: 'Strukturformel von Polysialat-Geopolymeren (Alumosilikat-Netzwerk) durch alkalische Aktivierung von Puzzolanen ohne Calciumsilikathydrat (C-S-H).',
            quelle: 'Davidovits Geopolymer Model'
          },
          {
            formel: '\\text{Ca(OH)}_2 + \\text{CO}_2 \\longrightarrow \\text{CaCO}_3 + \\text{H}_2\\text{O} \\quad [\\Delta H = -74\\,\\text{kJ/mol}]',
            erklaerung: 'Thermodynamisch irreversible Mineralisierung von Kohlendioxid in recyceltem Betonstein zu stabilem Calcit (CCU-Verfahren).',
            quelle: 'DIN EN 206 / RILEM TC-281'
          }
        ]}
      />
    </div>
  );
}
