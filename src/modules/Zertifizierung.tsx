import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { Award, CheckCircle2, Leaf, Building, Users, Zap, Settings, ShieldCheck, Trees, Calculator, Building2, Activity, RefreshCw } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SYSTEMS = [
  {
    id: 'dgnb',
    name: 'DGNB',
    fullName: 'Deutsche Gesellschaft für Nachhaltiges Bauen',
    origin: 'Deutschland',
    focus: 'Ganzheitlicher Ansatz (Ökologie, Ökonomie, Soziokulturelles gleichgewichtet)',
    icon: <Award className="text-blue-600" size={24} />,
    color: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-800',
    criteria: [
      { name: 'Ökologische Qualität', weight: 22.5, icon: <Leaf size={16} /> },
      { name: 'Ökonomische Qualität', weight: 22.5, icon: <Building size={16} /> },
      { name: 'Soziokulturelle & funktionale Qualität', weight: 22.5, icon: <Users size={16} /> },
      { name: 'Technische Qualität', weight: 15.0, icon: <Settings size={16} /> },
      { name: 'Prozessqualität', weight: 12.5, icon: <Zap size={16} /> },
      { name: 'Standortqualität', weight: 5.0, icon: <ShieldCheck size={16} /> }
    ],
    description: 'Das DGNB System (Deutsche Gesellschaft für Nachhaltiges Bauen) betrachtet den gesamten Gebäudelebenszyklus und bewertet die Gesamtperformance eines Projekts statt einzelner Maßnahmen. Es gilt als eines der fortschrittlichsten Systeme weltweit, da es Ökologie, Ökonomie und soziokulturelle Aspekte gleichwertig gewichtet. Die Zertifizierung erfolgt in Platin, Gold, Silber oder Bronze und erfordert eine umfassende Lebenszyklusanalyse (LCA) sowie Lebenszykluskostenrechnung (LCC).',
    example: 'Ein neuer Bürokomplex in Holz-Hybrid-Bauweise strebt DGNB Platin an. Durch ressourcenschonende Materialien (Ökologie), flexible Grundrisse für lange Nutzungsdauer und niedrige Betriebskosten (Ökonomie) sowie Barrierefreiheit und hohem Nutzerkomfort (Soziokulturell) erzielt das Projekt in allen Hauptkategorien Spitzenwerte.',
    link: 'https://www.dgnb.de/de/'
  },
  {
    id: 'bnb',
    name: 'BNB',
    fullName: 'Bewertungssystem Nachhaltiges Bauen',
    origin: 'Deutschland (Staatlich)',
    focus: 'Bundesbauten, ganzheitliche Bewertung ähnlich DGNB',
    icon: <Building className="text-teal-600" size={24} />,
    color: 'bg-teal-50 border-teal-200',
    textColor: 'text-teal-800',
    criteria: [
      { name: 'Ökologische Qualität', weight: 22.5, icon: <Leaf size={16} /> },
      { name: 'Ökonomische Qualität', weight: 22.5, icon: <Building size={16} /> },
      { name: 'Soziokulturelle & funktionale Qualität', weight: 22.5, icon: <Users size={16} /> },
      { name: 'Technische Qualität', weight: 22.5, icon: <Settings size={16} /> },
      { name: 'Prozessqualität', weight: 10.0, icon: <Zap size={16} /> },
      { name: 'Standortmerkmale', weight: 0.0, icon: <ShieldCheck size={16} /> }
    ],
    description: 'Das BNB (Bewertungssystem Nachhaltiges Bauen) ist das System des Bundes für Bundesbauten. Es ist eng mit dem DGNB-System verwandt, aber speziell auf die Anforderungen öffentlicher Bauherren zugeschnitten. Es wird verpflichtend bei Bundesbaumaßnahmen angewendet und legt großen Wert auf die ganzheitliche Betrachtung von Qualität und Lebenszykluskosten, um die Vorbildfunktion der öffentlichen Hand zu erfüllen.',
    example: 'Neubau eines Finanzamtes: Das Gebäude muss zwingend nach BNB zertifiziert werden (mindestens Silber). Der Fokus liegt stark auf den Lebenszykluskosten der nächsten 50 Jahre (LCC) und einer robusten, wartungsarmen technischen Qualität, da der Bund das Gebäude langfristig selbst nutzt und betreibt.',
    link: 'https://www.bnb-nachhaltigesbauen.de/'
  },
  {
    id: 'qng',
    name: 'QNG',
    fullName: 'Qualitätssiegel Nachhaltiges Gebäude',
    origin: 'Deutschland (Staatlich)',
    focus: 'Voraussetzung für staatliche Förderung (KFN/WEF)',
    icon: <ShieldCheck className="text-shiraz" size={24} />,
    color: 'bg-shiraz/5 border-shiraz/20',
    textColor: 'text-shiraz',
    criteria: [
      { name: 'Treibhausgasemissionen (LCA)', weight: 30, icon: <Leaf size={16} /> },
      { name: 'Primärenergiebedarf (LCA)', weight: 20, icon: <Zap size={16} /> },
      { name: 'Nachhaltige Materialgewinnung', weight: 20, icon: <Building size={16} /> },
      { name: 'Schadstoffvermeidung', weight: 15, icon: <ShieldCheck size={16} /> },
      { name: 'Barrierefreiheit', weight: 15, icon: <Users size={16} /> }
    ],
    description: 'Das QNG (Qualitätssiegel Nachhaltiges Gebäude) ist das staatliche Gütesiegel des Bundesbauministeriums (BMWSB). Es bildet die verpflichtende Grundlage für die Bundesförderung für effiziente Gebäude (BEG) sowie für klimafreundliche Neubauten (KFN/WEF) durch die KfW. Das Siegel existiert in den Varianten PLUS und PREMIUM. QNG ist kein eigenständiges Zertifizierungssystem, sondern knüpft an bestehende Systeme (wie DGNB, BNB, NaWoh oder BiRN) an. Es definiert harte, nicht verhandelbare K.O.-Kriterien: Strenge Grenzwerte für Treibhausgasemissionen im Gebäudelebenszyklus (LCA), Vorgaben zur nachhaltigen Materialgewinnung (Holz), und strenge Anforderungen an die Schadstoffvermeidung in Bauprodukten (Schadstoffmatrix nach QNG).',
    example: 'Eine Baugemeinschaft plant ein ressourcenschonendes Mehrfamilienhaus und beantragt KfW-Kredite für "Klimafreundlichen Neubau (KFN)". Um den Kredit zu erhalten, muss QNG PLUS erreicht werden. Absolutes K.O.-Kriterium ist dabei der Nachweis, dass der Treibhausgasausstoß über den gesamten Lebenszyklus unter 24 kg CO₂-Äqv./(m²a) bleibt.',
    link: 'https://www.qng.info/'
  },
  {
    id: 'leed',
    name: 'LEED',
    fullName: 'Leadership in Energy and Environmental Design',
    origin: 'USA',
    focus: 'Energieeffizienz, Wasserersparnis, Materialwahl',
    icon: <Leaf className="text-green-600" size={24} />,
    color: 'bg-green-50 border-green-200',
    textColor: 'text-green-800',
    criteria: [
      { name: 'Energie & Atmosphäre', weight: 33, icon: <Zap size={16} /> },
      { name: 'Standort & Verkehr', weight: 16, icon: <Building size={16} /> },
      { name: 'Innenraumqualität', weight: 16, icon: <Users size={16} /> },
      { name: 'Materialien & Ressourcen', weight: 13, icon: <Settings size={16} /> },
      { name: 'Wassereffizienz', weight: 11, icon: <Leaf size={16} /> },
      { name: 'Innovation & Regionale Priorität', weight: 11, icon: <Award size={16} /> }
    ],
    description: 'LEED (Leadership in Energy and Environmental Design) ist das vom U.S. Green Building Council entwickelte und international am weitesten verbreitete Zertifizierungssystem. Es arbeitet mit einem flexiblen Punktesystem und ist besonders bei internationalen Investoren sehr gefragt. Der Fokus liegt stark auf Energieeffizienz, Wassereinsparung und der Reduzierung von CO2-Emissionen, während ökonomische Lebenszykluskosten weniger stark gewichtet werden als bei der DGNB.',
    example: 'Ein internationaler Investor lässt in Frankfurt einen Wolkenkratzer errichten. Um das Gebäude für globale Tech-Konzerne als Mieter attraktiv zu machen, strebt der Investor das "LEED Platinum"-Zertifikat an. Kernpunkte sind u.A. die Nutzung von Regenwasser zur Toilettenspülung (Wassereffizienz) und exzellente Anbindung an den ÖPNV (Standort & Verkehr).',
    link: 'https://www.usgbc.org/leed'
  },
  {
    id: 'breeam',
    name: 'BREEAM',
    fullName: 'Building Research Establishment Environmental Assessment Methodology',
    origin: 'Großbritannien',
    focus: 'Management, Gesundheit, Energie, Transport',
    icon: <Building className="text-orange-600" size={24} />,
    color: 'bg-orange-50 border-orange-200',
    textColor: 'text-orange-800',
    criteria: [
      { name: 'Energie', weight: 19, icon: <Zap size={16} /> },
      { name: 'Gesundheit & Wohlbefinden', weight: 15, icon: <Users size={16} /> },
      { name: 'Materialien', weight: 12.5, icon: <Settings size={16} /> },
      { name: 'Management', weight: 12, icon: <ShieldCheck size={16} /> },
      { name: 'Landnutzung & Ökologie', weight: 10, icon: <Leaf size={16} /> },
      { name: 'Sonstige (Wasser, Transport, etc.)', weight: 31.5, icon: <Building size={16} /> }
    ],
    description: 'BREEAM (Building Research Establishment Environmental Assessment Methodology) ist das älteste Zertifizierungssystem (seit 1990) und stammt aus Großbritannien. Es zeichnet sich durch eine sehr detaillierte und wissenschaftlich fundierte Bewertungsmethodik aus. Es ist weltweit stark verbreitet und bewertet Gebäude in Kategorien wie Management, Gesundheit, Energie, Transport, Wasser, Materialien und Ökologie. Die Zertifikatsstufen reichen von "Pass" bis "Outstanding".',
    example: 'Ein großes Logistikzentrum wird nach BREEAM "Excellent" gebaut. Der Fokus liegt auf strengem Baustellen-Management (Minimierung von Bauabfall), dem Erhalt lokaler Biodiversität (ökologische Ausgleichsflächen am Standort) sowie einer effizienten Energieversorgung (Photovoltaik auf den großen Dachflächen).',
    link: 'https://breeam.com/'
  },
  {
    id: 'well',
    name: 'WELL',
    fullName: 'WELL Building Standard',
    origin: 'USA / International',
    focus: 'Gesundheit, Komfort und Wohlbefinden der Gebäudenutzer',
    icon: <Activity className="text-rose-600" size={24} />,
    color: 'bg-rose-50 border-rose-200',
    textColor: 'text-rose-800',
    criteria: [
      { name: 'Luft & Wasser', weight: 20, icon: <Leaf size={16} /> },
      { name: 'Ernährung & Licht', weight: 20, icon: <Zap size={16} /> },
      { name: 'Bewegung & thermischer Komfort', weight: 20, icon: <Activity size={16} /> },
      { name: 'Geist & Gemeinschaft', weight: 20, icon: <Users size={16} /> },
      { name: 'Materialien & Innovation', weight: 20, icon: <Settings size={16} /> }
    ],
    description: 'Der WELL Building Standard fokussiert sich im Gegensatz zu anderen Zertifizierungen fast ausschließlich auf den Menschen und sein Wohlbefinden im Gebäude. Er verbindet Best Practices im Design und Konstruktion mit evidenzbasierter medizinischer und wissenschaftlicher Forschung – das Gebäude wird als Mittel zur Gesundheitsförderung betrachtet.',
    example: 'Das neue Hauptquartier eines Softwareunternehmens strebt die "WELL Gold"-Zertifizierung an. Im Fokus stehen nicht in erster Linie die CO2-Emissionen des Betons, sondern die Luftqualität (strenge Filter), Beleuchtung (an den Biorhythmus angepasstes Kunstlicht, sogenanntes Human Centric Lighting), gesundes Kantinenessen und die Förderung von Bewegung der Mitarbeiter.',
    link: 'https://www.wellcertified.com/'
  },
  {
    id: 'birn',
    name: 'BiRN',
    fullName: 'Bau-Institut für Ressourceneffizientes und Nachhaltiges Bauen (BNK/BNG)',
    origin: 'Deutschland',
    focus: 'Nachhaltigkeit speziell für Wohngebäude (Basis für QNG-Förderung)',
    icon: <Building2 className="text-teal-600" size={24} />,
    color: 'bg-teal-50 border-teal-200',
    textColor: 'text-teal-800',
    criteria: [
      { name: 'Soziokulturelle & funktionale Qualität', weight: 33.3, icon: <Users size={16} /> },
      { name: 'Ökonomische Qualität', weight: 33.3, icon: <Calculator size={16} /> },
      { name: 'Ökologische Qualität', weight: 33.3, icon: <Leaf size={16} /> }
    ],
    description: 'BiRN (Bau-Institut für Ressourceneffizientes und Nachhaltiges Bauen) bietet die Zertifizierungssysteme BNK (Nachhaltiger Kleinwohnhausbau) und BNG (Nachhaltiger Geschosswohnungsbau). Diese Systeme sind speziell auf den Wohnungsbau zugeschnitten. Sie dienen als eine der maßgeblichen Nachweismethoden zur Erlangung des vom Bund geforderten "Qualitätssiegel Nachhaltiges Gebäude (QNG)", welches Voraussetzung für zinsgünstige KfW-Förderkredite ist.',
    example: 'Für den Bau eines Einfamilienhauses (EFH) wählt die Baufamilie das "BNK"-Zertifizierungssystem des BiRN. Der Auditor prüft u.a. die Ökobilanz des kleinen Hauses, den thermischen Komfort im Sommer und stellt sicher, dass am Ende das QNG-Siegel für das zinsgünstige KfW-Darlehen vergeben werden kann.',
    link: 'https://www.bau-irn.com/'
  }
];

export default function Zertifizierung() {
  const [activeTab, setActiveTab] = useState<'systeme' | 'beispiele'>('systeme');
  const [activeSystem, setActiveSystem] = useState(SYSTEMS[0].id);
  const [beispieleSubTab, setBeispieleSubTab] = useState<'dgnb' | 'bnb' | 'qng' | 'birn'>('dgnb');

  // DGNB Score and State
  const [dgnbScore, setDgnbScore] = useState<number>(80);
  const [dgnbBaukultur, setDgnbBaukultur] = useState<boolean>(false);

  const selectedSystem = SYSTEMS.find(s => s.id === activeSystem) || SYSTEMS[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3 mb-2 px-2">
        <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
          <Award size={24} />
        </div>
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          Gebäudezertifizierung
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Nachhaltigkeitszertifikate (DGNB, LEED, BREEAM, BNB, BiRN) bewerten die ökologische, ökonomische und soziale Qualität von Bauwerken im gesamten Lebenszyklus.
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'systeme' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('systeme')}
        >
          <Award size={16} /> Zertifizierungssysteme
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'beispiele' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('beispiele')}
        >
          <Activity size={16} /> Beispiele (DGNB, BNB, QNG &amp; BiRN)
        </button>
      </div>

        {activeTab === 'systeme' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Nachhaltigkeitssiegel machen die Qualität von Gebäuden messbar und vergleichbar. 
                Sie bewerten nicht nur die Ökologie, sondern auch ökonomische und soziokulturelle Aspekte. 
                Wählen Sie ein System aus, um dessen Schwerpunkte und Kriterien kennenzulernen.
              </p>
            </div>

            {/* System Selector */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {SYSTEMS.map((system) => (
            <button
              key={system.id}
              onClick={() => setActiveSystem(system.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeSystem === system.id 
                  ? `${system.color} shadow-sm ring-2 ring-shiraz/20` 
                  : 'bg-white border-home-grau/30 hover:bg-off-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {system.icon}
                <span className={`font-bold ${activeSystem === system.id ? system.textColor : 'text-text-main'}`}>
                  {system.name}
                </span>
              </div>
              <div className="text-xs text-text-main/60 line-clamp-2">
                {system.origin}
              </div>
            </button>
          ))}
        </div>

        {/* System Details */}
        <div className={`mt-4 p-6 rounded-2xl border ${selectedSystem.color}`}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              <h3 className={`text-2xl font-bold ${selectedSystem.textColor} mb-1`}>
                  {selectedSystem.name}
                </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            {selectedSystem.fullName}
          </p>
        </div>
              
              <p className="text-text-main/80 leading-relaxed text-sm">
                {selectedSystem.description}
              </p>

              {('example' in selectedSystem) && selectedSystem.example && (
                <div className={`p-4 rounded-xl mt-4 ${selectedSystem.color}`}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                    Praxisbeispiel
                  </p>
                  <p className={`text-sm leading-relaxed ${selectedSystem.textColor}`}>
                    {selectedSystem.example}
                  </p>
                </div>
              )}

              {selectedSystem.link && (
                <a 
                  href={selectedSystem.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-sm font-bold ${selectedSystem.textColor} hover:underline mt-2`}
                >
                  Offizielle Website <Award size={14} />
                </a>
              )}

              <div className="bg-white/60 p-4 rounded-xl mt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-text-main/50 block mb-1">
                  Hauptfokus
                </span>
                <span className="text-sm font-medium text-text-main">
                  {selectedSystem.focus}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <h4 className="font-bold text-text-main mb-4 text-sm uppercase tracking-wider">
                Gewichtung der Kriterien
              </h4>
              <div className="flex-1 relative min-h-[250px]">
                <Bar 
                  data={{
                    labels: selectedSystem.criteria.map(c => c.name),
                    datasets: [{
                      label: 'Gewichtung (%)',
                      data: selectedSystem.criteria.map(c => c.weight),
                      backgroundColor: selectedSystem.id === 'qng' ? '#ff0350' : 
                                       selectedSystem.id === 'dgnb' ? '#2563eb' : 
                                       selectedSystem.id === 'bnb' ? '#0d9488' : 
                                       selectedSystem.id === 'leed' ? '#16a34a' : '#ea580c',
                      borderRadius: 4,
                    }]
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.raw}%`
                        }
                      }
                    },
                    scales: {
                      x: {
                        min: 0,
                        max: 40,
                        title: { display: true, text: 'Gewichtung (%)' }
                      },
                      y: {
                        ticks: {
                          font: { size: 11 }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive DGNB Award Levels Card (Only visible if activeSystem === 'dgnb') */}
        {activeSystem === 'dgnb' && (
          <div className="mt-6 p-6 rounded-2xl bg-white border border-home-grau/30 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <Award className="text-blue-600 animate-bounce" size={28} />
              <h3 className="text-xl font-bold text-text-main flex items-center gap-2">DGNB Auszeichnungsstufen &amp; Grenzwerte</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Interaktive Erprobung der Zertifizierungsklassen (Bronze, Silber, Gold, Platin, Diamant) und deren Mindesterfüllungsgrade
          </p>
        </div>
            </div>

            {/* Interactive Trial Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Sliders and Inputs */}
              <div className="lg:col-span-7 bg-stone-50/50 p-5 rounded-xl border border-home-grau/30 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-text-main flex items-center gap-2">
                      Gesamterfüllungsgrad (DGNB Score)
                    </span>
                    <span className="text-lg font-black font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                      {formatDeWert(dgnbScore)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={dgnbScore}
                    onChange={(e) => setDgnbScore(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-home-grau/20 rounded-lg cursor-pointer"
                  />
                  <div className="grid grid-cols-5 gap-1 text-[10px] text-center text-text-main/50 font-semibold mt-2">
                    <div>Kein (0-34%)</div>
                    <div>Bronze (35%)</div>
                    <div>Silber (50%)</div>
                    <div>Gold (65%)</div>
                    <div>Platin (80%)</div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-home-grau/15 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="dgnbBaukultur"
                    checked={dgnbBaukultur}
                    onChange={(e) => setDgnbBaukultur(e.target.checked)}
                    className="mt-1 accent-indigo-600 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <label htmlFor="dgnbBaukultur" className="text-xs font-bold text-text-main cursor-pointer block">
                      Herausragende gestalterische &amp; architektonische Qualität (Baukultur)
                    </label>
                    <span className="text-[11px] text-text-main/60 block leading-normal mt-0.5">
                      Voraussetzung für die Zusatz-Auszeichnung <strong>DGNB Diamant</strong>. Erfordert zusätzlich mindestens ein reguläres Zertifikat in Gold oder Platin (≥ 65% Score) sowie die positive Begutachtung durch eine unabhängige Expertenkommission.
                    </span>
                  </div>
                </div>

                {/* Educational table of limit parameters */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-text-main/40 uppercase tracking-wider block">Übersicht aller DGNB-Bewertungsstufen:</span>
                  <div className="overflow-hidden border border-home-grau/30 rounded-lg text-xs bg-white">
                    <div className="grid grid-cols-12 gap-1 p-2 bg-stone-100 font-bold border-b border-home-grau/30 text-text-main">
                      <div className="col-span-3">Auszeichnung</div>
                      <div className="col-span-3 text-center">Gesamt-Soll</div>
                      <div className="col-span-3 text-center">Mindest-Teil</div>
                      <div className="col-span-3">Zusatzbedingungen</div>
                    </div>
                    {[
                      { name: 'Platin', limit: '≥ 80 %', subLimit: '≥ 65 %', cond: '', color: 'text-slate-800 font-bold' },
                      { name: 'Gold', limit: '≥ 65 %', subLimit: '≥ 50 %', cond: '', color: 'text-amber-700 font-bold' },
                      { name: 'Silber', limit: '≥ 50 %', subLimit: '≥ 35 %', cond: 'Standard im DGNB-System', color: 'text-stone-600 font-bold' },
                      { name: 'Bronze', limit: '≥ 35 %', subLimit: '≥ 35 %', cond: 'Nur Bestand, Innenräume', color: 'text-orange-700 font-bold' },
                      { name: 'Diamant', limit: '≥ 65 %', subLimit: 'N/A', cond: 'Herausragende Baukultur', color: 'text-indigo-700 font-bold' },
                    ].map((row, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-1 p-2 border-b border-home-grau/10 last:border-0 items-center text-[11px]">
                        <div className={`col-span-3 ${row.color}`}>{row.name}</div>
                        <div className="col-span-3 text-center font-mono font-semibold">{row.limit}</div>
                        <div className="col-span-3 text-center font-mono text-text-main/60">{row.subLimit}</div>
                        <div className="col-span-3 text-text-main/70">{row.cond}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Simulation output card */}
              {(() => {
                const status = (() => {
                  let baseAward = 'Kein Zertifikat';
                  let minGroupRequired = '0%';
                  let bgCol = 'bg-stone-100 text-text-main/70 border-stone-300';
                  let badge = 'bg-stone-200 text-stone-700';
                  let desc = 'Der Gesamterfüllungsgrad liegt unter 35 %. Um ein DGNB-Zertifikat zu erhalten, muss eine Mindestperformance von 35 % erbracht werden.';

                  if (dgnbScore >= 80) {
                    baseAward = 'Platin';
                    minGroupRequired = '65%';
                    bgCol = 'bg-slate-50 border-home-grau/30';
                    badge = 'bg-slate-600 text-white';
                    desc = 'Höchstmögliches DGNB-Lebenszyklus-Zertifikat. Bestätigt einen exzellenten Ganzheitsansatz mit minimaler Ressourcenbelastung und herausragender ökonomischer Zukunftsfähigkeit.';
                  } else if (dgnbScore >= 65) {
                    baseAward = 'Gold';
                    minGroupRequired = '50%';
                    bgCol = 'bg-amber-50 border-amber-200';
                    badge = 'bg-amber-500 text-white';
                    desc = 'Bestätigt einen sehr hohen, zukunftsweisenden Nachhaltigkeitsstandard mit deutlicher Übererfüllung gesetzlicher Mindestanforderungen.';
                  } else if (dgnbScore >= 50) {
                    baseAward = 'Silber';
                    minGroupRequired = '35%';
                    bgCol = 'bg-stone-50 border-stone-200';
                    badge = 'bg-stone-500 text-white';
                    desc = 'Guter, ausgewogener und normüberschreitender Standard in allen wesentlichen Nachhaltigkeitsbereichen.';
                  } else if (dgnbScore >= 35) {
                    baseAward = 'Bronze';
                    minGroupRequired = '35%';
                    bgCol = 'bg-orange-50 border-orange-200';
                    badge = 'bg-orange-500 text-white';
                    desc = 'Sicherung grundlegender ökologischer und technischer Qualitäten. Nach den Bestimmungen von 2018 ist diese Stufe exklusiv für Bestandsbauten, Baudenkmale oder den Innenausbau anwendbar.';
                  }

                  if (dgnbBaukultur && dgnbScore >= 65) {
                    return {
                      award: `${baseAward} & DIAMANT`,
                      badge: 'bg-indigo-600 text-white border border-indigo-500 animate-pulse',
                      bgCol: 'bg-indigo-50/75 border-indigo-200',
                      minGroupRequired,
                      desc: `Inklusive Auszeichnung für herausragende Gestaltungsqualität und Baukultur! Neben dem Erreichen von ${baseAward} (≥ 65 % Score) bescheinigt die Diamant-Prämierung eine exzeptionelle architektonische Meisterleistung.`
                    };
                  }

                  return { award: baseAward, badge, bgCol, minGroupRequired, desc };
                })();

                return (
                  <div className={`lg:col-span-5 flex flex-col justify-between border rounded-xl p-5 ${status.bgCol} space-y-4`}>
                    <div className="space-y-4">
                      <span className="text-xs font-bold uppercase text-text-main/50 tracking-wider block">Simuliertes Auszeichnungsergebnis</span>
                      
                      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-home-grau/15 text-center shadow-xs">
                        <span className="text-[10px] font-bold text-text-main/50 uppercase tracking-widest">Zertifikstatus</span>
                        <div className="text-2xl font-black text-text-main mt-1.5 uppercase font-mono tracking-tight leading-none">{status.award}</div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold mt-2.5 ${status.badge}`}>
                          {status.award === 'Kein Zertifikat' ? 'Ungenügend' : 'Zertifiziert'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 bg-white rounded-lg border border-home-grau/10">
                            <span className="text-[10px] text-text-main/50 block font-bold uppercase">Gesamtscore</span>
                            <span className="text-lg font-bold text-text-main font-mono">{formatDeWert(dgnbScore)}%</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-home-grau/10">
                            <span className="text-[10px] text-text-main/50 block font-bold uppercase">Mindest-Teilerfüllung</span>
                            <span className="text-lg font-bold text-text-main font-mono">{status.minGroupRequired}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-white/70 rounded-lg text-[11px] text-text-main/80 leading-relaxed border border-home-grau/10 font-normal">
                          {status.desc}
                        </div>
                      </div>
                    </div>

                    {/* Progress representation bar for limits */}
                    <div className="pt-4 border-t border-home-grau/10 space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] text-text-main/50 font-bold uppercase">
                        <span>Bronze (35%)</span>
                        <span>Silber (50%)</span>
                        <span>Gold (65%)</span>
                        <span>Platin (80%)</span>
                      </div>
                      <div className="relative h-2.5 bg-home-grau/10 rounded-full overflow-hidden">
                        {/* Markers inside track */}
                        <div className="absolute inset-y-0 left-[35%] w-[1px] bg-white z-10" />
                        <div className="absolute inset-y-0 left-[50%] w-[1px] bg-white z-10" />
                        <div className="absolute inset-y-0 left-[65%] w-[1px] bg-white z-10" />
                        <div className="absolute inset-y-0 left-[80%] w-[1px] bg-white z-10" />
                        
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 via-stone-400 via-amber-400 to-indigo-600 transition-all duration-300"
                          style={{ width: `${dgnbScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>
        )}

          {/* General Certification Info Card: Beteiligte, Vorgehensweise, Kosten, Nutzen */}
          <div className="p-6 rounded-2xl bg-white border border-home-grau/30 shadow-sm space-y-6 mt-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 border-b border-home-grau/20 pb-3">
              <Users className="text-shiraz animate-pulse" size={24} />
              <div>
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  Systembeteiligte, Vorgehensweise, Kosten &amp; Nutzen im Zertifizierungsprozess
                </h3>
                <p className="text-xs text-text-main/60">
                  Wichtige Informationen für die universitäre Ausbildung und Praxis der Gebäudezertifizierung
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1: Systembeteiligte */}
              <div className="bg-stone-50/50 p-5 rounded-xl border border-home-grau/15 space-y-3">
                <h4 className="font-bold text-sm text-text-main flex items-center gap-2 uppercase tracking-wider text-shiraz">
                  <Users size={16} /> 1. Systembeteiligte (Akteure)
                </h4>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Die erfolgreiche Abwicklung einer Gebäudezertifizierung erfordert das reibungslose Zusammenspiel verschiedener Schlüsselakteure:
                </p>
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/10">
                    <strong className="block text-text-main">A. Der Bauherr (Auftraggeber)</strong>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block mt-0.5">
                      Tritt als Initiator und Entscheidungsträger auf. Er beauftragt das Audit, legt strategische Nachhaltigkeitsziele fest und profitiert von zinsgünstigen Krediten (z.B. KfW) oder einer langfristigen Asset-Wertsteigerung.
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/10">
                    <strong className="block text-text-main">B. Der lizensierte Auditor bzw. BNB-Koordinator</strong>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block mt-0.5">
                      Die zentrale Schnittstelle. Er besitzt eine offizielle Ausbildung und Lizenz der jeweiligen Systemträger (DGNB, BiRN, etc.). Er berät das Planungsteam, führt Berechnungen (z.B. LCA/LCC) durch, prüft Baustoffe und reicht die Dokumentation ein.
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/10">
                    <strong className="block text-text-main">C. Die Zertifizierungsstelle (Konformitätsprüfer)</strong>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block mt-0.5">
                      Eine unabhängige Zertifizierungsgesellschaft (z. B. DGNB GmbH, BBSR für BNB, BiRN GbR). Sie prüft die vom Auditor eingereichten Nachweise auf Vollständigkeit und Konformität mit dem Regelwerk und stellt das offizielle Zertifikat aus.
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/10">
                    <strong className="block text-text-main">D. Fachplaner, Bauleiter &amp; Produkthersteller</strong>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block mt-0.5">
                      Zulieferer der Nachweisdaten. Architekten, Bauphysiker, TGA-Planer und Statiker liefern Pläne und Berechnungen. Ausführende Firmen dokumentieren eingebaute Bauprodukte, während Hersteller Umweltproduktdeklarationen (EPDs) und Sicherheitsdatenblätter bereitstellen.
                    </span>
                  </div>
                </div>
              </div>

              {/* Column 2: Kosten */}
              <div className="bg-stone-50/50 p-5 rounded-xl border border-home-grau/15 space-y-3">
                <h4 className="font-bold text-sm text-text-main flex items-center gap-2 uppercase tracking-wider text-shiraz">
                  <Calculator size={16} /> 2. Kostenstrukturen der Zertifizierung
                </h4>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Die monetäre Bewertung gliedert sich in direkte Zertifizierungsgebühren, Dienstleistungskosten und bauliche Mehrkosten:
                </p>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                    <div className="flex justify-between items-center border-b border-home-grau/10 pb-1.5 mb-1.55">
                      <span className="font-bold text-text-main">A. Zertifizierungsgebühren (Vergabestelle)</span>
                      <span className="font-mono text-xs font-semibold text-shiraz">ca. 1.500 € – 15.000 €+</span>
                    </div>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block">
                      Gebühren, die direkt an die Zertifizierungsstelle (z.B. DGNB GmbH) für die Konformitätsprüfung und Vergabe überwiesen werden. Die exakte Höhe richtet sich nach der Bruttogrundfläche (BGF) des Gebäudes sowie einer eventuellen Mitgliedschaft im Verein.
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                    <div className="flex justify-between items-center border-b border-home-grau/10 pb-1.5 mb-1.5">
                      <span className="font-bold text-text-main">B. Honorar für Auditor &amp; Sonderfachplaner</span>
                      <span className="font-mono text-xs font-semibold text-shiraz">ca. 10.000 € – 45.000 €+</span>
                    </div>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block">
                      Dienstleistungshonorar des lizensierten Auditors für die fachliche Begleitung, Dokumentation und Einreichung. Hinzu kommen ggf. Kosten für Simulationsberechnungen (z.B. thermische Simulation, Tageslichtsimulation, detaillierte LCA/LCC).
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                    <div className="flex justify-between items-center border-b border-home-grau/10 pb-1.5 mb-1.5">
                      <span className="font-bold text-text-main">C. Bauliche &amp; planerische Mehrkosten</span>
                      <span className="font-mono text-xs font-semibold text-shiraz">ca. 1 % – 5 % der Baukosten</span>
                    </div>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block">
                      Aufwendungen für höherwertige Baustoffe (z.B. schadstoffarme Lacke, zertifiziertes Holz, RC-Beton), verbesserte Mess- und Regelungstechnik, aufwendigere integrale Planungsprozesse sowie strenge Qualitäts- und Überwachungsprüfungen auf der Baustelle.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vorgehensweise (Phasen) */}
            <div className="bg-stone-50/50 p-5 rounded-xl border border-home-grau/15 space-y-4">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2 uppercase tracking-wider text-shiraz">
                <Leaf size={16} /> 3. Klassische Vorgehensweise (Prozessphasen)
              </h4>
              <p className="text-xs text-text-main/70 leading-relaxed">
                Die Zertifizierung ist ein baubegleitender, integraler Prozess, der sich in fünf distinkte Phasen gliedert:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { phase: '1. Zieldefinition & Pre-Check', desc: 'Frühzeitige Abstimmung (LPH 1-2). Erstellung einer Machbarkeitsmatrix (Pre-Assessment) und offizielle Projektregistrierung beim Systemträger.' },
                  { phase: '2. Planungsbegleitendes Audit', desc: 'Während der Entwurf- und Ausführungsplanung (LPH 3-5). Optimierung der Energiekonzepte, Lebenszyklusanalysen und Schadstoffplanung (Pre-Zertifikat optional).' },
                  { phase: '3. Baustellen-Überwachung', desc: 'Überwachung der Rohbau- und Ausbauphase. Konsequenter Abgleich aller gelieferten Baustoff-Chargen mit der Schadstoffanforderungsmatrix.' },
                  { phase: '4. Dokumentensammlung', desc: 'Zusammenstellung aller abschließenden Nachweise nach LPH 8. Durchführung von Luftwechselmessungen, VOC-Analysen und Erstellung des finalen Auditberichts.' },
                  { phase: '5. Prüfung & Zertifikat', desc: 'Einreichung durch den Auditor. Die Zertifizierungsstelle prüft alle Nachweise auf Konformität (Gegenprüfung) und erteilt das offizielle Zertifikat.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-home-grau/10 relative">
                    <div className="absolute top-2 right-2 bg-shiraz/10 text-shiraz text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <strong className="block text-[11px] text-text-main mb-1.5 pr-6 leading-tight font-bold">{item.phase}</strong>
                    <p className="text-[10px] text-text-main/60 leading-normal">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutzen */}
            <div className="bg-stone-50/50 p-5 rounded-xl border border-home-grau/15 space-y-3">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2 uppercase tracking-wider text-shiraz">
                <CheckCircle2 size={16} /> 4. Mehrdimensionaler Nutzen (Mehrwert)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                  <strong className="block text-text-main mb-1 font-bold text-slate-800">Finanzieller Nutzen</strong>
                  <span className="text-text-main/70 text-[11px] leading-relaxed block">
                    Zwingende Voraussetzung für staatliche Förderungen der KfW nach dem QNG-Standard. Wertsteigerung der Immobilie bei Verkauf/Vermietung ("Green Premium") und Absicherung gegen Wertverluste ("Stranded Assets").
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                  <strong className="block text-text-main mb-1 font-bold text-slate-800">Betriebliche Optimierung</strong>
                  <span className="text-text-main/70 text-[11px] leading-relaxed block">
                    Massiv reduzierte Energiekosten während der Betriebsphase durch hocheffiziente Anlagentechnik und baulichen Wärmeschutz. Erhöhte Flexibilität und Anpassbarkeit mindern zukünftige Umbaukosten.
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                  <strong className="block text-text-main mb-1 font-bold text-slate-800">Ökologische Entlastung</strong>
                  <span className="text-text-main/70 text-[11px] leading-relaxed block">
                    Gezielte Absenkung der CO₂e-Emmissionen über die Herstellungs-, Betriebs- und Rückbauphase hinweg. Hohe Verwertungsquoten durch konsequente Berücksichtigung von Zirkularitäts- und Demontagekonzepten.
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                  <strong className="block text-text-main mb-1 font-bold text-slate-800">Gesundheit &amp; Wohlbefinden</strong>
                  <span className="text-text-main/70 text-[11px] leading-relaxed block">
                    nachgewiesene Einhaltung von Schadstoff-Grenzwerten durch Messungen im Innenraum durch strenge VOC- und Formaldehyd-Messungen. Exzellente raumklimatische Bedingungen, hoher visueller und thermischer Komfort steigern die Leistungsfähigkeit der Nutzer.
                  </span>
                </div>
              </div>
            </div>
          </div>

                </div>
        )}

        {activeTab === 'beispiele' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Inner Sub-Tab Selector */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
              {[
                { id: 'dgnb' as const, label: '1. DGNB Zertifikat', badge: 'Privat & Öffentlicher Markt' },
                { id: 'bnb' as const, label: '2. BNB Bewertung', badge: 'Pflicht für Bundesbauten' },
                { id: 'qng' as const, label: '3. QNG Gütesiegel', badge: 'Basis für Bundesförderung' },
                { id: 'birn' as const, label: '4. BiRN (BNK / BNG)', badge: 'Spezifisch Wohnungsbau' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setBeispieleSubTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex flex-col justify-start items-start gap-0.5 border shadow-sm cursor-pointer min-w-[170px] ${
                    beispieleSubTab === tab.id
                      ? 'bg-shiraz text-white border-shiraz shadow-sm'
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                  }`}
                >
                  <span className="font-bold text-[11px]">{tab.label}</span>
                  <span className={`text-[9px] font-normal ${beispieleSubTab === tab.id ? 'text-white/80' : 'text-text-main/50'}`}>
                    {tab.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Inner Sub-Tabs Containers */}
            {beispieleSubTab === 'dgnb' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
                <div className="lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
                  <div className="flex justify-between items-start border-b border-home-grau/20 pb-3">
                    <div>
                      <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <Award className="text-blue-600" size={22} /> DGNB System (Deutsche Gesellschaft für Nachhaltiges Bauen)
                      </h3>
                      <p className="text-xs text-text-main/60 mt-0.5">Der marktführende Standard im deutschsprachigen Raum für ganzheitliche Nachhaltigkeitsbewertung</p>
                    </div>
                    <a href="https://www.dgnb.de/de" target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 shrink-0">
                      dgnb.de <Award size={12} />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 flex flex-col gap-1.5 font-sans">
                      <strong className="font-bold text-blue-900 uppercase tracking-wide text-[10px]">Wann / Zielgruppe</strong>
                      <p className="text-text-main/80 leading-normal">
                        Privatwirtschaftliche und öffentliche Projekte jeder Größenordnung (Büros, Wohngebäude, Quartiere, Bildungsbauten, Industriebauten). Ideal für Investoren, die internationale Standards (Heuristik) mit maximaler deutscher Qualitätsprüfung anstreben.
                      </p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]">Was wird gefordert?</strong>
                      <p className="text-text-main/80 leading-normal">
                        Gleichwertige Gewichtung von <strong>Ökologie</strong>, <strong>Ökonomie</strong> und <strong>Soziokulturellen / funktionale Kriterien</strong> (jeweils 22,5%). Ergänzt durch Technik (15%), Prozesse (12,5%) und Standort (5%). Lebenszyklusanalysen und Lebenszykluskostenrechnung über 50 Jahre sind zwingend.
                      </p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]">Auszeichnungsstufen</strong>
                      <ul className="text-text-main/80 space-y-1 list-disc list-inside">
                        <li><strong>Platin:</strong> Gesamterfüllung ≥ 80%</li>
                        <li><strong>Gold:</strong> Gesamterfüllung ≥ 65%</li>
                        <li><strong>Silber:</strong> Gesamterfüllung ≥ 50%</li>
                        <li><strong>Bronze:</strong> ≥ 35% (nur Bestandsbauten)</li>
                        <li><strong>Diamant:</strong> Für herausragende gestalterische Baukultur</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs mt-2 border-t border-home-grau/10 pt-4">
                    <h4 className="font-bold text-text-main text-sm">Prüfungs- und Nachweisdetails für Studierende</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1">Was genau ist nachzuweisen?</strong>
                          <ul className="space-y-1 text-text-main/70 list-disc list-inside text-[11px] leading-relaxed">
                            <li><strong>Ökobilanzierung (LCA):</strong> Berechnung des GWP (Treibhauspotential), ODP, AP, EP über die Lebenszyklusphasen A1-A3, B4, C3-C4, D gem. DIN EN 15978.</li>
                            <li><strong>Lebenszykluskosten (LCC):</strong> Dynamische Rechnungsverfahren über 50 Jahre zur Ermittlung der Barwerte von Herstellungs- und Nutzungskosten (Zinsen, Inflation) gem. DIN 18960.</li>
                            <li><strong>Innenraumluftqualität:</strong> Durchführung von Schadstoffmessungen (TVOC, Formaldehyd) maximal 4 Wochen nach Fertigstellung.</li>
                            <li><strong>Demontage- &amp; Zirkularitätsnachweis:</strong> Aufschlüsselung der Baustoffe nach Trennbarkeit (Design for Disassembly) und Angabe zirkulärer Materialanteile.</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1">Von wem sind die Nachweise zu erbringen?</strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed">
                            Der <strong>lizensierte DGNB Auditor</strong> koordiniert den Gesamtprozess und führt LCA/LCC Berechnungen durch. Fachplaner (Bauphysiker, TGA-Planer, Architekt, Akustiker) liefern normative Einzelnachweise. Ausführende Handwerksfirmen müssen Einhaltung der Produktspezifikationen (Schadstofffreiheit) dokumentieren und Herstellererklärungen zuliefern.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1">Wer ist systembeteiligt im Ablauf?</strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed">
                            Der <strong>Bauherr</strong> (Auftraggeber), der <strong>DGNB Auditor</strong> (führt die baubegleitende Bewertung durch) und die <strong>DGNB GmbH Geschäftsstelle</strong> in Stuttgart, welche nach einer zweistufigen Konformitätsprüfung (Konformitätsstelle) die begehrten Plaketten und Urkunden ausstellt.
                          </p>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl flex flex-col gap-1.5">
                          <strong className="block text-text-main font-bold text-blue-900 border-b border-blue-100 pb-1">Normative Grundlagen</strong>
                          <span className="text-[11px] text-text-main/75 block">
                            DGNB Kriterienkatalog Version 2018 (und die aktuelle Version 2023), DIN EN 15978 (Nachhaltigkeit von Bauwerken – Bewertung der ökologischen Qualität von Gebäuden), DIN EN 15643 (Ganzheitliche Bewertungsmethode), Landesbauordnungen (für Barrierefreiheit).
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {beispieleSubTab === 'bnb' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
                <div className="lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
                  <div className="flex justify-between items-start border-b border-home-grau/20 pb-3">
                    <div>
                      <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <Building className="text-teal-600" size={22} /> BNB System (Bewertungssystem Nachhaltiges Bauen)
                      </h3>
                      <p className="text-xs text-text-main/60 mt-0.5">Das offizielle nachhaltige Bewertungssystem des Bundes für zwingende Anwendung bei Bundesbauten</p>
                    </div>
                    <a href="https://www.bnb-nachhaltigesbauen.de/de" target="_blank" rel="noreferrer" className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1 shrink-0">
                      bnb-nachhaltigesbauen.de <Award size={12} />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-100 flex flex-col gap-1.5">
                      <strong className="font-bold text-teal-900 uppercase tracking-wide text-[10px]">Wann / Zielgruppe</strong>
                      <p className="text-text-main/80 leading-normal">
                        <strong>Pflicht</strong> für alle Baumaßnahmen des Bundes (Neubau, Erweiterungen, Sanierungen) mit geschätzten Baukosten &gt; 2 Mio. € (gemäß RBBau Leitfaden). Auch viele Landesbauten nutzen BNB. Gilt v.a. für Verwaltungs-, Unterrichts- und Laborgebäude.
                      </p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]">Was wird gefordert?</strong>
                      <p className="text-text-main/80 leading-normal">
                        Umfassender Nachhaltigkeitsansatz über 5 Hauptbereiche: Ökologische, Ökonomische, Soziokulturelle &amp; Funktionale, Technische, sowie Prozessqualität. Die Standortmerkmale werden separat bewertet. Keine Übergewichtung einzelner Kriterien, sondern Systemstabilität steht im Fokus.
                      </p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]">Auszeichnungsstufen</strong>
                      <ul className="text-text-main/80 space-y-1 list-disc list-inside">
                        <li><strong>Gold:</strong> Gesamterfüllung ≥ 80% (sehr anspruchsvoll)</li>
                        <li><strong>Silber:</strong> Gesamterfüllung ≥ 65% (Standard für Bundesbauten)</li>
                        <li><strong>Bronze:</strong> Gesamterfüllung ≥ 50%</li>
                        <li>*Wichtig:* Unterschreiten einzelner Mindesterfüllungsgrade in Kernkriterien führt zum K.O. der gesamten Bewertung.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs mt-2 border-t border-home-grau/10 pt-4">
                    <h4 className="font-bold text-text-main text-sm">Prüfungs- und Nachweisdetails für Studierende</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1">Was genau ist nachzuweisen?</strong>
                          <ul className="space-y-1 text-text-main/70 list-disc list-inside text-[11px] leading-relaxed">
                            <li><strong>Ökobilanzierung (LCA) nach BBSR-Regeln:</strong> Ermittlung des Treibhausgasausstoßes und Primärenergiebedarfes über 50 Jahre Lebenszyklus.</li>
                            <li><strong>Wirtschaftlichkeitsberechnung (LCC):</strong> Vollständige Lebenszykluskostenrechnung über 50 Jahre nach BBSR-Rechenvorgaben.</li>
                            <li><strong>Reinigungs- und Instandhaltungsfreundlichkeit:</strong> Detailliertes Reinigungskonzept mit Angabe der Materialbeständigkeiten.</li>
                            <li><strong>Rückbau- &amp; Recyclingfreundlichkeit deklarieren:</strong> Nachweis der Baustofftrennbarkeit und Schadstofffreiheit.</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1">Von wem sind die Nachweise zu erbringen?</strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed">
                            Der <strong>BNB-Koordinator</strong> (oft ein Architekt oder Ingenieur aus der zuständigen staatlichen Bauverwaltung oder ein externer Fachberater für Nachhaltiges Bauen) führt die Systemprüfungen durch. Das gesamte Planungsteam, die herstellenden Betriebe und die Bauleitung erarbeiten die notwendigen Materialnachweise.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1">Wer ist systembeteiligt im Ablauf?</strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed">
                            Der <strong>Bund als Bauherr</strong> (vertreten durch das Fachreferat im Bundesbauministerium), der <strong>BNB-Koordinator</strong>, die <strong>staatliche Bauverwaltung</strong> (z.B. staatliche Bauämter) und die <strong>Geschäftsstelle Nachhaltiges Bauen im Bundesinstitut für Bau-, Stadt- und Raumforschung (BBSR)</strong>, welche als systemunabhängige Konformitätsprüfungsstelle fungiert.
                          </p>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl flex flex-col gap-1.5">
                          <strong className="block text-text-main font-bold text-teal-900 border-b border-teal-100 pb-1">Normative Grundlagen</strong>
                          <span className="text-[11px] text-text-main/75 block">
                            Leitfaden Nachhaltiges Bauen des Bundes, BNB-Systemhandbücher (BBSR), RBBau (Richtlinien für die Durchführung von Bauaufgaben des Bundes), DIN V 18599 (Energieeffizienznachweise).
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {beispieleSubTab === 'qng' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
                <div className="lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
                  <div className="flex justify-between items-start border-b border-home-grau/20 pb-3">
                    <div>
                      <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <CheckCircle2 className="text-shiraz" size={22} /> QNG (Qualitätssiegel Nachhaltiges Gebäude)
                      </h3>
                      <p className="text-xs text-text-main/60 mt-0.5">Das obligatorische staatliche Gütesiegel des Bundesbauministeriums - DIE Eintrittskarte für KfW-Förderkredite</p>
                    </div>
                    <a href="https://www.qng.info" target="_blank" rel="noreferrer" className="text-xs font-bold text-shiraz hover:underline flex items-center gap-1 shrink-0">
                      qng.info <Award size={12} />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    <div className="p-4 bg-shiraz/5 rounded-xl border border-shiraz/10 flex flex-col gap-1.5">
                      <strong className="font-bold text-shiraz uppercase tracking-wide text-[10px]">Wann / Zielgruppe</strong>
                      <p className="text-text-main/80 leading-normal">
                        Private Bauherren, Genossenschaften, Kommunen und Gewerbetreibende, die Fördermittel der KfW im Rahmen der Programme "Klimafreundlicher Neubau" (KFN/WEF) in Anspruch nehmen wollen. Ohne QNG-Zertifikat ist diese attraktive Zinsförderung nicht möglich!
                      </p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]">Was wird gefordert?</strong>
                      <p className="text-text-main/80 leading-normal">
                        Es ist kein eigenständiges Kriteriensystem, sondern definiert <strong>strenge K.O.-Kriterien</strong>, eingefügt in anerkannte Basissysteme (z.B. DGNB, BiRN, bnb, NaWoh). Zu den K.O.-Kriterien gehören harte limits für Treibhausgase (LCA), zertifizierte Holzgewinnung und eine rigorose Matrix zur Schadstoffvermeidung.
                      </p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]">Auszeichnungsstufen (Siegel)</strong>
                      <ul className="text-text-main/80 space-y-1.5">
                        <li><strong>QNG-PLUS (Standard):</strong> Erfüllung aller allgemeinen harten Anforderungen und Grenzwert von ≤ 24 kg CO₂-Äqv./(m²a) über den Gebäude-Lebenszyklus.</li>
                        <li><strong>QNG-PREMIUM (Exzellent):</strong> Verschärfte Grenzwerte und extrem rigorose Ökobilanz mit max. ≤ 20 kg CO₂-Äqv./(m²a) über den Lebenszyklus.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs mt-2 border-t border-home-grau/10 pt-4">
                    <h4 className="font-bold text-text-main text-sm">Prüfungs- und Nachweisdetails für Studierende</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1">Was genau ist nachzuweisen? (Grenzwerte &amp; K.O.)</strong>
                          <ul className="space-y-1 text-text-main/70 list-disc list-inside text-[11px] leading-relaxed">
                            <li><strong>Schadstoffmatrix (QNG-Anhang 4):</strong> Voller lückenloser Nachweis für alle eingesetzten Farben, Lacke, Dichtstoffe, Bodenkleber, TGA-Dichtmassen und PU-Schäume auf der Baustelle gem. Schadstoff-Steckbrief 313.</li>
                            <li><strong>Nachhaltige Holzbeschaffung:</strong> Mindestens 80% (Plus) oder 90% (Premium) des verbauten Holzes und Holzwerkstoffe müssen FSC- oder PEFC-zertifiziert sein. Vollständige Chain-of-Custody (Lieferschein) bis zum Zimmerer.</li>
                            <li><strong>Lüftungskonzept &amp; sommerlicher Wärmeschutz:</strong> Nachweis der Nutzergesundheit und sommerlichen Behaglichkeit gem. DIN 1946-6 und DIN 4108-2.</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1">Von wem sind die Nachweise zu erbringen?</strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed">
                            Der <strong>QNG-Auditor</strong> führt die Berechnungen und Prüfungen durch. Die <strong>Bauplanung</strong> optimiert die LCA-Massen im Vorfeld. Die <strong>ausführenden Handwerker</strong> müssen vor Verarbeitung JEDES Produkts die Freigabe des Auditors einholen (Produkttreffblatt-Verfahren) und Einbaufotos sowie Rechnungen mit Herstellerbestätigungen lückenlos einreichen.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1">Wer ist systembeteiligt im Ablauf?</strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed">
                            Der <strong>Bauherr</strong> (Kreditnehmer), der spezialisierte <strong>QNG Auditor</strong>, ein registriertes Bewertungssystem-Institut (z.B. DGNB, BiRN, bnb, NaWoh) als Prüfungsorgan und das <strong>BMWSB (Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen)</strong> als oberste Siegelvergabestelle, die das offizielle QNG-Prüfsiegel zuteilt.
                          </p>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl flex flex-col gap-1.5">
                          <strong className="block text-text-main font-bold text-shiraz border-b border-rose-100 pb-1">Normative Grundlagen</strong>
                          <span className="text-[11px] text-text-main/75 block">
                            QNG-Handbuch (aktuelle Version) des BMWSB nebst technischen Anlagen (Dokument Anhang 3 zur Ökobilanz und Anhang 4 zur Schadstoffvermeidung), Bundesfördersatzungen der KfW, Chemikalien-Verordnung, REACH-Verordnungen für Chemikalien/SVHC-Stoffe.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {beispieleSubTab === 'birn' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
                <div className="lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
                  <div className="flex justify-between items-start border-b border-home-grau/20 pb-3">
                    <div>
                      <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <Building2 className="text-teal-600" size={22} /> BiRN System (Bau-Institut für Ressourceneffizientes und Nachhaltiges Bauen)
                      </h3>
                      <p className="text-xs text-text-main/60 mt-0.5">Spezialisierte Nachhaltigkeitsbewertung im Wohnungsbau (BNK für Kleinwohnhäuser &amp; BNG für Geschosswohnungsbau)</p>
                    </div>
                    <a href="https://bau-irn.com" target="_blank" rel="noreferrer" className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1 shrink-0">
                      bau-irn.com <Award size={12} />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-100 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-teal-900 uppercase tracking-wide text-[10px]">Wann / Zielgruppe</strong>
                      <p className="text-text-main/80 leading-normal">
                        Private Hausbauer (Einfamilienhäuser, Doppelhäuser, Reihenhäuser) mit dem <strong>BNK-System</strong> sowie Bauträger und Fertighaushersteller im mehrgeschossigen Wohnungsbau mit dem <strong>BNG-System</strong>. Bietet eine kostengünstige, pragmatische und schlanke Systemalternative zur schnellen Absicherung der QNG-Förderfähigkeit.
                      </p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]">Was wird gefordert?</strong>
                      <p className="text-text-main/80 leading-normal">
                        Schlanker, fokussierter Kriterienkatalog, der auf die realen Rahmenbedingungen des privaten Wohnbaus abgestimmt ist. Bewertet werden Ökologie (Ökobilanz), Ökonomie (Lebenszykluskosten), soziokulturelle Aspekte (Sonnenschutz, Flexibilität), sowie baurechtliche und prozessuale Qualitäten.
                      </p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]">Auszeichnungsstufen</strong>
                      <ul className="text-text-main/80 space-y-1 list-disc list-inside">
                        <li><strong>Exzellent:</strong> Gesamterfüllung ≥ 80% (inkl. QNG-Premium)</li>
                        <li><strong>Sehr Gut:</strong> Gesamterfüllung ≥ 65% (inkl. QNG-Plus)</li>
                        <li><strong>Gut:</strong> Gesamterfüllung ≥ 50%</li>
                        <li>Bietet vereinfachte Berechnungsassistenten und direkte Kombination mit dem staatlichen QNG-Gütesiegel für KfW-Zuschüsse.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs mt-2 border-t border-home-grau/10 pt-4">
                    <h4 className="font-bold text-text-main text-sm">Prüfungs- und Nachweisdetails für Studierende</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1">Was genau ist nachzuweisen? (Fokus auf Nawaro)</strong>
                          <ul className="space-y-1 text-text-main/70 list-disc list-inside text-[11px] leading-relaxed">
                            <li><strong>Ökobilanz (LCA):</strong> Vereinfachte Berechnung des Treibhausgaspotenzials des gesamten Hauses über 50 Jahre nach QNG-LCA-Rechenregeln.</li>
                            <li><strong>Schadstoffüberwachung im Wohnbau:</strong> Sicherheitsdatenblätter für sämtliche Innenausbau-Bauprodukte müssen lückenlos vorliegen (Kleber, Wandfarben, Laminat, Holzdielen).</li>
                            <li><strong>Nutzung nachwachsender Rohstoffe (NAWARO):</strong> Erfassung des Volumens an nachwachsenden Werkstoffen (z.B. Holzträger, Zellulosedämmung, Hanfwellplatten), da BiRN diese gänzlich fördert.</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1">Von wem sind die Nachweise zu erbringen?</strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed">
                            Der lizensierte <strong>BNK/BNG-Auditor</strong> (oftmals freischaffende Architekten oder zertifizierte Energieberater) erarbeitet den Auditbericht und führt das QNG-Verfahren durch. Der Fertighaushersteller oder die Holzbau-Firma liefert alle Werkpläne und Produktnachweispapiere. Der Bauherr dokumentiert die korrekte Fertigstellung.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1">Wer ist systembeteiligt im Ablauf?</strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed">
                            Die <strong>Baufamilie</strong> (Bauherr), der <strong>lizenzierte BNK-Auditor</strong>, die <strong>Zertifizierungsstelle des BiRN e.V. / BiRN GbR</strong> zur Vergabe des BNK/BNG-Prüfsiegels und schlussendlich der Bund (BMWSB) zur Freigabe der QNG-Zertifikatsdaten an die KfW-Bank zur Kreditfreigabe.
                          </p>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl flex flex-col gap-1.5">
                          <strong className="block text-text-main font-bold text-teal-900 border-b border-teal-100 pb-1">Normative Grundlagen</strong>
                          <span className="text-[11px] text-text-main/75 block">
                            BNK Version 2.0 (Bewertungssystem Nachhaltiger Kleinwohnungsbau), BNG (Geschosswohnungsbau), QNG-Standards für Wohngebäude, DIN V 18599 (Energieerfassung), Vergabeordnung (VOB/B).
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="text-lg font-bold text-text-main mb-4">Warum zertifizieren?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <CheckCircle2 className="text-shiraz shrink-0" size={20} />
            <div>
              <h4 className="font-bold text-text-main text-sm mb-1">Qualitätssicherung</h4>
              <p className="text-xs text-text-main/70">Der Zertifizierungsprozess zwingt alle Planungsbeteiligten zu einer integralen Planung und dokumentiert die Bauqualität.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="text-shiraz shrink-0" size={20} />
            <div>
              <h4 className="font-bold text-text-main text-sm mb-1">Wertsteigerung</h4>
              <p className="text-xs text-text-main/70">Zertifizierte Gebäude erzielen oft höhere Mieten, haben geringere Leerstandsquoten und einen höheren Wiederverkaufswert.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="text-shiraz shrink-0" size={20} />
            <div>
              <h4 className="font-bold text-text-main text-sm mb-1">Förderungen (z.B. QNG)</h4>
              <p className="text-xs text-text-main/70">In Deutschland ist das QNG-Siegel oft zwingende Voraussetzung für zinsgünstige KfW-Kredite und staatliche Zuschüsse.</p>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Zertifizierung', url: 'https://de.wikipedia.org/wiki/Zertifizierung' },
          { title: 'Deutsche Gesellschaft für Nachhaltiges Bauen', url: 'https://de.wikipedia.org/wiki/Deutsche_Gesellschaft_f%C3%BCr_Nachhaltiges_Bauen' },
          { title: 'Leadership in Energy and Environmental Design', url: 'https://de.wikipedia.org/wiki/Leadership_in_Energy_and_Environmental_Design' }
        ]}
        literatur={[
          'Bauer, M.; Mösle, P.; Schwarz, M. (2013): Green Building: Konzepte für eine nachhaltige Architektur (Callwey)',
          'DGNB e.V.: Kriterienkatalog Neubau Gebäude (aktuelle Version, Stuttgart)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DGNB System Kriterienkatalog Gebäude Neubau', url: 'https://www.dgnb.de/' },
          { title: 'QNG Handbuch: Qualitätssiegel Nachhaltiges Gebäude', url: 'https://www.qng.info/' },
          { title: 'DIN EN 15643 (Nachhaltigkeit von Bauwerken - Bewertung der Nachhaltigkeit von Gebäuden)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15643' }
        ]}
        formeln={[
          {
            formel: '\\text{GEG}_{\\text{DGNB}} = \\sum_{i=1}^6 W_i \\cdot E_i \\ge 80\\% \\implies \\text{Zertifikat: Platin}',
            erklaerung: 'DGNB-Gesamterfüllungsgrad aus den 6 Themenfeldern Ökologie (22,5%), Ökonomie (22,5%), Soziokulturelles (22,5%), Technik (15%), Prozess (12,5%) und Standort (5%). Platin ab 80%, Gold ab 65%, Silber ab 50%.',
            quelle: 'DGNB Kriterienkatalog'
          },
          {
            formel: 'LCA_{\\text{QNG}} = \\text{GWP}_{100,\\text{Konstr}} + \\text{GWP}_{100,\\text{Nutzung}} \\le \\text{Grenzwert}_{\\text{QNG-Plus}}',
            erklaerung: 'Treibhausgasbilanzierung nach QNG-Anforderungsprofil für Wohngebäude zur Erlangung von KfW-Förderdarlehen.',
            quelle: 'QNG Steckbrief 3.1.1'
          }
        ]}
      />
    </div>
  );
} 