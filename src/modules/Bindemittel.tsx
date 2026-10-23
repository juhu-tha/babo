import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { Layers, Flame, Factory, FlaskConical, BookOpen, ShieldCheck, Filter, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import Zementchemie from './Zementchemie';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { BlockMath, InlineMath } from 'react-katex';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ============================================================================
// DATENBANK DER NORMZEMENTE (DIN EN 197-1 / DIN EN 197-5 / DIN 1045-2:2023-08)
// Abgleich mit "Betontechnische Daten" (Heidelberg Materials / IZB, Stand 2022)
// und Neuausgabe der aktuellen Normengeneration (DIN 1045-2:2023-08 / DIN EN 197-5)
// ============================================================================

export interface NormCement {
  code: string;
  family: 'CEM I' | 'CEM II' | 'CEM II/C-M & CEM VI' | 'CEM III' | 'CEM IV & V';
  name: string;
  klinkerMin: number;
  klinkerMax: number;
  components: string;
  co2Reduction: string;
  anwendungDin1045: string;
  frostSuitability: string;
  normReference: string;
  isNewStandard?: boolean; // Kennzeichnung neuer klinkereffizienter Zemente nach 2022
}

export const NORM_CEMENTS: NormCement[] = [
  // CEM I
  {
    code: 'CEM I',
    family: 'CEM I',
    name: 'Portlandzement',
    klinkerMin: 95,
    klinkerMax: 100,
    components: 'Nur Klinker (K) + bis zu 5 % Nebenbestandteile.',
    co2Reduction: 'Referenz (0 % CO₂-Minderung)',
    anwendungDin1045: 'Uneingeschränkt für alle Expositionsklassen zulässig.',
    frostSuitability: 'Sehr gut (hohe Frost- und Frost-Tausalz-Beständigkeit XF1–XF4).',
    normReference: 'DIN EN 197-1:2011-11 / DIN 1045-2:2023-08'
  },

  // CEM II
  {
    code: 'CEM II/A-S',
    family: 'CEM II',
    name: 'Portlandhüttenzement (Typ A)',
    klinkerMin: 80,
    klinkerMax: 94,
    components: 'Hüttensand (S): 6–20 %.',
    co2Reduction: 'ca. 10–18 % Minderung',
    anwendungDin1045: 'Uneingeschränkt für alle Expositionsklassen zulässig.',
    frostSuitability: 'Sehr gut; hohe Dichtigkeit.',
    normReference: 'DIN EN 197-1:2011-11 / DIN 1045-2'
  },
  {
    code: 'CEM II/B-S',
    family: 'CEM II',
    name: 'Portlandhüttenzement (Typ B)',
    klinkerMin: 65,
    klinkerMax: 79,
    components: 'Hüttensand (S): 21–35 %.',
    co2Reduction: 'ca. 25–32 % Minderung',
    anwendungDin1045: 'Zulässig für alle Expositionsklassen. Bei XF2/XF4 mit LP-Beton.',
    frostSuitability: 'Gut; langsamere Frühfestigkeit, dichte Endstruktur.',
    normReference: 'DIN EN 197-1:2011-11 / DIN 1045-2'
  },
  {
    code: 'CEM II/A-LL',
    family: 'CEM II',
    name: 'Portlandkalksteinzement (Typ A)',
    klinkerMin: 80,
    klinkerMax: 94,
    components: 'Kalkstein (LL, TOC ≤ 0,20 M.-%): 6–20 %.',
    co2Reduction: 'ca. 10–18 % Minderung',
    anwendungDin1045: 'Zulässig für Innen- und Außenbauteile (XC1–XC4, XF1, XA1). Bei XF4 nur mit Nachweis.',
    frostSuitability: 'Gut bis mäßig (Füllereffekt, feine Porenstruktur).',
    normReference: 'DIN EN 197-1:2011-11 / DIN 1045-2'
  },
  {
    code: 'CEM II/B-LL',
    family: 'CEM II',
    name: 'Portlandkalksteinzement (Typ B)',
    klinkerMin: 65,
    klinkerMax: 79,
    components: 'Kalkstein (LL): 21–35 %.',
    co2Reduction: 'ca. 25–32 % Minderung',
    anwendungDin1045: 'Bevorzugt für XC1–XC3 und mäßige Bewitterung. Einschränkungen bei hoher Tausalzbeaufschlagung.',
    frostSuitability: 'Mäßig (nicht für XF4 empfohlen).',
    normReference: 'DIN EN 197-1:2011-11 / DIN 1045-2'
  },
  {
    code: 'CEM II/A-V',
    family: 'CEM II',
    name: 'Portlandflugaschezement (Typ A)',
    klinkerMin: 80,
    klinkerMax: 94,
    components: 'Kieselsäurereiche Flugasche (V): 6–20 %.',
    co2Reduction: 'ca. 12–20 % Minderung',
    anwendungDin1045: 'Zulässig für XC1–XC4, XD1–XD3, XA1–XA2. Puzzolanische Nacherhärtung.',
    frostSuitability: 'Gut; dichtet das Porengefüge gegen Chloride ab.',
    normReference: 'DIN EN 197-1:2011-11 / DIN 1045-2'
  },
  {
    code: 'CEM II/A-M & B-M',
    family: 'CEM II',
    name: 'Portlandkompositzement',
    klinkerMin: 65,
    klinkerMax: 94,
    components: 'Mehrere Hauptbestandteile (z. B. S-LL, S-V, V-LL): 6–35 % Zumahlung.',
    co2Reduction: 'ca. 15–35 % Minderung',
    anwendungDin1045: 'Standardzement im modernen Hoch- und Tiefbau.',
    frostSuitability: 'Gut (Kombinationseffekt aus Reaktivität und Füllerdichte).',
    normReference: 'DIN EN 197-1:2011-11 / DIN 1045-2'
  },

  // NEUE KLINKEREFFIZIENTE ZEMENTE (DIN EN 197-5 / DIN 1045-2:2023-08)
  {
    code: 'CEM II/C-M',
    family: 'CEM II/C-M & CEM VI',
    name: 'Portland-Kompositzement (Klinkereffizient)',
    klinkerMin: 50,
    klinkerMax: 64,
    components: 'Klinkersparend: 36–50 % mineralische Zumahlstoffe (z. B. Hüttensand S + Kalkstein LL).',
    co2Reduction: 'ca. 38–50 % Minderung (Öko-Zement)',
    anwendungDin1045: 'Zulässig nach DIN 1045-2:2023-08 für definierte Expositionsklassen (XC1–XC4, XF1, WF). Bei XF2/XF4/XD3 nur mit Anwendungsnachweis.',
    frostSuitability: 'Sorgfältige Nachbehandlung zwingend; gute Gefügedichtigkeit.',
    normReference: 'DIN EN 197-5:2021-07 & DIN 1045-2:2023-08',
    isNewStandard: true
  },
  {
    code: 'CEM VI',
    family: 'CEM II/C-M & CEM VI',
    name: 'Kompositzement (Hochklinkersparend)',
    klinkerMin: 35,
    klinkerMax: 49,
    components: 'Hüttensand (S): 31–59 % + Kalkstein (LL): 6–20 %.',
    co2Reduction: 'bis zu 60 % Minderung',
    anwendungDin1045: 'Neu genormt in DIN EN 197-5; Einsatz nach nationalem Anwendungsdokument DIN 1045-2 für CO₂-optimierte Bauteile.',
    frostSuitability: 'Langsame Erhärtung, niedrige Hydratationswärme (ideal für massige Bauteile ohne Frost).',
    normReference: 'DIN EN 197-5:2021-07 & DIN 1045-2:2023-08',
    isNewStandard: true
  },

  // CEM III
  {
    code: 'CEM III/A',
    family: 'CEM III',
    name: 'Hochofenzement (Typ A)',
    klinkerMin: 35,
    klinkerMax: 64,
    components: 'Hüttensand (S): 36–65 %.',
    co2Reduction: 'ca. 40–55 % Minderung',
    anwendungDin1045: 'Sehr breites Anwendungsspektrum. Hoher Chloridwiderstand (XD/XS), niedrige Wärme (LH).',
    frostSuitability: 'Gut (bei XF4 mit speziellem LP-Nachweis).',
    normReference: 'DIN EN 197-1:2011-11 / DIN 1045-2'
  },
  {
    code: 'CEM III/B',
    family: 'CEM III',
    name: 'Hochofenzement (Typ B)',
    klinkerMin: 20,
    klinkerMax: 34,
    components: 'Hüttensand (S): 66–80 %.',
    co2Reduction: 'ca. 60–75 % Minderung',
    anwendungDin1045: 'Hoher Sulfatwiderstand (gilt naturgemäß als SR-Zement). Ideal für Massenbeton und Wasserbau.',
    frostSuitability: 'Langsame Festigkeitsentwicklung; längere Nachbehandlung obligatorisch.',
    normReference: 'DIN EN 197-1:2011-11 / DIN 1045-2'
  },
  {
    code: 'CEM III/C',
    family: 'CEM III',
    name: 'Hochofenzement (Typ C)',
    klinkerMin: 5,
    klinkerMax: 19,
    components: 'Hüttensand (S): 81–95 %.',
    co2Reduction: 'bis zu 85 % Minderung',
    anwendungDin1045: 'Extrem niedrige Hydratationswärme (VLH), hoher chemischer Widerstand.',
    frostSuitability: 'Nur für frostfreie Spezialanwendungen (Deponiebau, Schlitzwände).',
    normReference: 'DIN EN 197-1:2011-11 / DIN 1045-2'
  },

  // CEM IV & V
  {
    code: 'CEM IV/A & IV/B',
    family: 'CEM IV & V',
    name: 'Puzzolanzement',
    klinkerMin: 45,
    klinkerMax: 89,
    components: 'Puzzolanische Stoffe (Flugasche, Trass): 11–55 %.',
    co2Reduction: 'ca. 30–50 % Minderung',
    anwendungDin1045: 'Wasserbau, Massenbeton, chemischer Angriff.',
    frostSuitability: 'Mäßig (in Deutschland seltener verwendet als CEM III).',
    normReference: 'DIN EN 197-1:2011-11'
  },
  {
    code: 'CEM V/A & V/B',
    family: 'CEM IV & V',
    name: 'Kompositzement',
    klinkerMin: 20,
    klinkerMax: 64,
    components: 'Hüttensand (18–49 %) + Puzzolane/Flugasche (18–49 %).',
    co2Reduction: 'ca. 50–70 % Minderung',
    anwendungDin1045: 'Spezialanwendungen mit geringer Wärmeentwicklung.',
    frostSuitability: 'Langsame Erhärtung.',
    normReference: 'DIN EN 197-1:2011-11'
  }
];

// Festigkeitsklassen nach DIN EN 197-1 Tabelle 7
export const STRENGTH_CLASSES_TABLE = [
  {
    klasse: '32,5 N',
    earlyDays: '7 Tage',
    earlyStrength: '≥ 16,0 MPa',
    normStrength: '32,5 – 52,5 MPa',
    initialSettingMin: '≥ 75 min',
    soundnessMax: '≤ 10 mm'
  },
  {
    klasse: '32,5 R',
    earlyDays: '2 Tage',
    earlyStrength: '≥ 10,0 MPa',
    normStrength: '32,5 – 52,5 MPa',
    initialSettingMin: '≥ 75 min',
    soundnessMax: '≤ 10 mm'
  },
  {
    klasse: '42,5 N',
    earlyDays: '2 Tage',
    earlyStrength: '≥ 10,0 MPa',
    normStrength: '42,5 – 62,5 MPa',
    initialSettingMin: '≥ 60 min',
    soundnessMax: '≤ 10 mm'
  },
  {
    klasse: '42,5 R',
    earlyDays: '2 Tage',
    earlyStrength: '≥ 20,0 MPa',
    normStrength: '42,5 – 62,5 MPa',
    initialSettingMin: '≥ 60 min',
    soundnessMax: '≤ 10 mm'
  },
  {
    klasse: '52,5 N',
    earlyDays: '2 Tage',
    earlyStrength: '≥ 20,0 MPa',
    normStrength: '≥ 52,5 MPa',
    initialSettingMin: '≥ 45 min',
    soundnessMax: '≤ 10 mm'
  },
  {
    klasse: '52,5 R',
    earlyDays: '2 Tage',
    earlyStrength: '≥ 30,0 MPa',
    normStrength: '≥ 52,5 MPa',
    initialSettingMin: '≥ 45 min',
    soundnessMax: '≤ 10 mm'
  }
];

export default function Bindemittel() {
  const [activeTab, setActiveTab] = useState<'herstellung' | 'zement' | 'normzemente' | 'zementchemie_bogue' | 'zusatzstoffe'>('normzemente');
  const [cementFilter, setCementFilter] = useState<string>('ALLE');

  const hydratationData = {
    labels: [0, 1, 3, 7, 14, 28],
    datasets: [
      {
        label: 'C3A (Aluminat)',
        data: [0, 600, 750, 820, 850, 900],
        borderColor: '#A3113E',
        tension: 0.4
      },
      {
        label: 'C3S (Alit)',
        data: [0, 150, 300, 400, 450, 500],
        borderColor: '#475569',
        tension: 0.4
      },
      {
        label: 'C4AF (Ferrit)',
        data: [0, 100, 150, 200, 250, 300],
        borderColor: '#64748b',
        tension: 0.4
      },
      {
        label: 'C2S (Belit)',
        data: [0, 10, 30, 50, 100, 200],
        borderColor: '#475569',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Bindemittel & Zusatzstoffe
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Bindemittel wie Zement sind hydraulisch erhärtende Baustoffe, die zusammen mit Wasser ein festes Gestein (Zementstein) bilden. 
            Durch die Zugabe von Betonzusatzstoffen lassen sich die Eigenschaften im Frisch- und Festbeton gezielt steuern und optimieren.
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-xs">
            <strong className="mr-1">Lernpfad:</strong>
            {([
              ['herstellung', 'Herstellung'], ['zement', 'Klinkerphasen & Hydratation'], ['zementchemie_bogue', 'Zementchemie (Bogue, Gefüge)'],
              ['normzemente', 'Normzemente'], ['zusatzstoffe', 'Zusatzstoffe'],
            ] as const).map(([id, label], i) => (
              <React.Fragment key={id}>
                {i > 0 && <span className="text-text-main/40">→</span>}
                <button onClick={() => setActiveTab(id)} className="underline decoration-dotted hover:text-shiraz cursor-pointer">{i + 1}. {label}</button>
              </React.Fragment>
            ))}
            <span className="text-text-main/60 ml-1">Die Zementherstellung ist im Reiter Grundlagen ausführlicher beschrieben.</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'herstellung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('herstellung')}
          >
            <Factory size={16} /> Herstellung &amp; Eigenschaften
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zement' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zement')}
          >
            <Layers size={16} /> Zement &amp; Hydratation
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'normzemente' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('normzemente')}
          >
            <BookOpen size={16} /> Normzemente (DIN EN 197 / DIN 1045-2)
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zementchemie_bogue' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zementchemie_bogue')}
          >
            <Flame size={16} /> Zementchemie
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zusatzstoffe' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zusatzstoffe')}
          >
            <FlaskConical size={16} /> Betonzusatzstoffe
          </button>
        </div>

      {activeTab === 'herstellung' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Herstellung von Zement</h3>
            <p className="text-sm text-text-main/80">
              Die Herstellung von Zement ist ein energie- und ressourcenintensiver Prozess, bestehend aus mehreren Phasen:
            </p>
            <ol className="list-decimal list-inside text-sm text-text-main/80 space-y-3">
              <li><strong>Rohstoffgewinnung & Aufbereitung:</strong> Abbau von Kalkstein (CaCO₃) und Ton/Mergel, anschließend Brechen und Mahlen zum Rohmehl.</li>
              <li><strong>Brennen:</strong> Erhitzen im Drehrohrofen auf ca. 1.450 °C (Sintern). Kalkstein entsäuert (CO₂ wird frei), die Mineralien verschmelzen chemisch zum Zementklinker.</li>
              <li><strong>Mahlen:</strong> Der Klinker wird stark abgekühlt und anschließend zusammen mit Gips (als Erstarrungsverzögerer) sowie möglichen weiteren Bestandteilen (Hüttensand, Flugasche) zu feinem Zement vermahlen.</li>
            </ol>
            <div className="bg-torch-red/10 border border-torch-red/20 p-4 rounded-xl mt-2 text-sm text-text-main/90">
              <strong>CO₂-Emissionen:</strong> Die Zementherstellung verursacht hohe Emissionen, teilweise brennstoffbedingt, aber überwiegend prozessbedingt durch das Entsäuern des Kalksteins (CaCO₃ → CaO + CO₂).
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Eigenschaften von Bindemitteln</h3>
            <p className="text-sm text-text-main/80">
              Zement ist ein hydraulisches Bindemittel, was bedeutet, dass er sowohl an der Luft als auch unter Wasser erhärtet und nach dem Erhärten wasserbeständig ist.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2 mt-2">
              <li><strong>Hydraulische Eigenschaft:</strong> Eigenständige Erhärtung bei Anmischen mit Wasser.</li>
              <li><strong>Mahlfeinheit:</strong> Je feiner der Zement gemahlen ist, desto schneller hydratisiert er und desto höher ist die Frühfestigkeit.</li>
              <li><strong>Dichte:</strong> Portlandzement hat eine Reindichte von ca. 3,1 bis 3,2 kg/dm³. Bei zementären Zusatzstoffen wie Flugasche oder Hüttensand liegt diese abweichend (ca. 2,2 bis 2,9 kg/dm³).</li>
              <li><strong>Hydratationswärme:</strong> Durch die exotherme Reaktion entsteht Wärme, die bei massigen Bauteilen problematisch sein kann, aber beim Winterbau nützlich ist.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'zement' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Zementklinkerphasen</h3>
            <p className="text-sm text-text-main/80">
              Portlandzementklinker besteht hauptsächlich aus vier mineralogischen Phasen (Zementchemische Kurzschreibweise: C=CaO, S=SiO₂, A=Al₂O₃, F=Fe₂O₃, H=H₂O):
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><strong>Alit (<InlineMath math="C_3S" />, Tricalciumsilicat):</strong> 50-70%. Reagiert schnell, maßgeblich für die frühe und späte Festigkeitsentwicklung. Hohe Hydratationswärme (ca. 500 J/g).</li>
              <li><strong>Belit (<InlineMath math="C_2S" />, Dicalciumsilicat):</strong> 15-30%. Reagiert langsam, trägt zur späten Festigkeit (nach 28 Tagen) bei. Geringe Hydratationswärme (ca. 250 J/g).</li>
              <li><strong>Aluminat (<InlineMath math="C_3A" />, Tricalciumaluminat):</strong> 5-10%. Reagiert extrem schnell (Flash-Set), erfordert Sulfatzugabe (Gips/Anhydrit) zur Verzögerung. Anfällig für Sulfatangriff. Sehr hohe Hydratationswärme (ca. 1350 J/g).</li>
              <li><strong>Ferrit (<InlineMath math="C_4AF" />, Tetracalciumaluminatferrit):</strong> 5-15%. Geringer Beitrag zur Festigkeit, wirkt als Flussmittel beim Brennen, gibt dem Zement die graue Farbe.</li>
            </ul>

            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-sm text-text-main mb-2">Wärmeentwicklung der Klinkerphasen (schematische Lehrkurve)</h4>
              <div className="h-48 w-full">
                <Line 
                  id="hydratation-chart"
                  data={hydratationData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { title: { display: true, text: 'Hydratationswärme (J/g)' } },
                      x: { title: { display: true, text: 'Zeit (Tage)' } }
                    },
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }
                  }} 
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Hydratation & Gefügebildung</h3>
            <p className="text-sm text-text-main/80">
              Die Erhärtung des Zements beruht auf der exothermen Reaktion der Klinkerphasen mit Wasser (Hydratation). Dabei entstehen neue, festigkeitsbildende Kristalle.
            </p>
            <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
              <p className="text-xs font-bold text-text-main mb-2">Beispiel: Hydratation von Alit</p>
              <BlockMath math="2 C_3S + 6 H \rightarrow C_3S_2H_3 + 3 CH" />
              <p className="text-xs text-text-main/80 mt-2">
                Tricalciumsilicat + Wasser → C-S-H-Gel + Calciumhydroxid (Portlandit)
              </p>
            </div>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2 mt-2">
              <li><strong>C-S-H-Phasen (Calciumsilicathydrate):</strong> Bilden ein dichtes, amorphes bis mikrokristallines Netzwerk. Sie sind der Hauptträger der Festigkeit (ca. 60-70% des Volumens).</li>
              <li><strong>Portlandit (<InlineMath math="Ca(OH)_2" />):</strong> Großkristallin, trägt kaum zur Festigkeit bei, sorgt aber für den hohen pH-Wert (Alkalidepot).</li>
              <li><strong>Ettringit (AFt-Phase):</strong> Entsteht früh aus der Reaktion von <InlineMath math="C_3A" /> mit Sulfat. Verhindert das sofortige Erstarren. Nadelige Kristalle.</li>
              <li><strong>Monosulfat (AFm-Phase):</strong> Entsteht später, wenn das Sulfat aufgebraucht ist, durch Umwandlung von Ettringit. Bei erneutem Sulfatangriff von außen kann sich wieder Ettringit bilden (sekundäre Ettringitbildung), was zu Treiberscheinungen führt.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'normzemente' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          
          {/* SYNOPSE & AKTUALITÄTSHINWEIS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-shiraz/10 text-shiraz rounded-xl">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-text-main">
                    Normzemente nach DIN EN 197-1 / DIN EN 197-5 &amp; DIN 1045-2:2023-08
                  </h3>
                  <p className="text-xs text-text-main/70">
                    Gegenüberstellung: Stand <em>Betontechnische Daten (Ausgabe 2022)</em> vs. Neuausgabe der aktuellen Normengeneration
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-off-white text-shiraz border border-home-grau/20 rounded-lg self-start sm:self-auto">
                DIN 1045-2:2023-08
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-home-grau/20 space-y-1.5">
                <span className="font-bold text-slate-700 block flex items-center gap-1.5">
                  <Info size={14} className="text-slate-500" />
                  Stand „Betontechnische Daten“ (Heidelberg Materials / IZB, 2022):
                </span>
                <p className="text-text-main/75 leading-relaxed">
                  Basierte auf der 27-Normalzement-Klassifikation nach DIN EN 197-1:2011 (CEM I bis CEM V). Zemente mit stark abgesenktem Klinkergehalt (wie CEM II/C-M) waren damals nur über allgemeine bauaufsichtliche Zulassungen (abZ) oder Vorab-Entwürfe anwendbar.
                </p>
              </div>

              <div className="p-3.5 bg-shiraz/5 rounded-xl border border-shiraz/20 space-y-1.5">
                <span className="font-bold text-shiraz block flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-shiraz" />
                  Gültiger aktueller Normenstand (DIN 1045-2:2023-08 &amp; DIN EN 197-5:2021):
                </span>
                <p className="text-text-main/85 leading-relaxed">
                  Vollständige bauaufsichtliche Aufnahme der klinkereffizienten Öko-Zemente <strong>CEM II/C-M</strong> (nur 50–64 % Klinker) und <strong>CEM VI</strong> (35–49 % Klinker) in das deutsche Regelwerk DIN 1045-2 zur Reduzierung des CO₂-Fußabdrucks im Betonbau.
                </p>
              </div>
            </div>
          </div>

          {/* FILTERBAR & NORMZEMENT-KATALOG */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-home-grau/20">
              <div>
                <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Filter size={18} className="text-shiraz" />
                  Zementarten &amp; Zusammensetzung nach DIN EN 197-1 und DIN EN 197-5
                </h4>
                <p className="text-xs text-text-main/70">Wählen Sie eine Zementfamilie zur selektiven Ansicht:</p>
              </div>

              <div className="flex flex-wrap gap-1 p-1 bg-off-white rounded-xl border border-home-grau/20 text-xs">
                {['ALLE', 'CEM I', 'CEM II', 'CEM II/C-M & CEM VI', 'CEM III', 'CEM IV & V'].map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setCementFilter(f)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      cementFilter === f
                        ? 'bg-shiraz text-white shadow-xs'
                        : 'text-text-main/70 hover:text-text-main hover:bg-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* ZEMENT-KARTEN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {NORM_CEMENTS
                .filter(c => cementFilter === 'ALLE' || c.family === cementFilter)
                .map(cement => (
                  <div 
                    key={cement.code}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                      cement.isNewStandard 
                        ? 'bg-shiraz/5 border-shiraz/30 shadow-xs' 
                        : 'bg-off-white border-home-grau/25 hover:border-home-grau/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-shiraz px-2 py-0.5 rounded bg-white border border-home-grau/20">
                          {cement.code}
                        </span>
                        {cement.isNewStandard && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-shiraz text-white">
                            Neu: DIN EN 197-5
                          </span>
                        )}
                        <span className="text-[11px] text-text-main/60 font-mono">
                          {cement.normReference.split('/')[0].trim()}
                        </span>
                      </div>
                      
                      <h5 className="font-bold text-sm text-text-main">
                        {cement.name}
                      </h5>

                      {/* Klinkeranteils-Balken */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-text-main/70">
                          <span>Klinkergehalt:</span>
                          <span className="font-bold text-text-main">{formatDeWert(cement.klinkerMin)} – {formatDeWert(cement.klinkerMax)} M.-%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-home-grau/20 overflow-hidden">
                          <div 
                            className="h-full bg-shiraz rounded-full"
                            style={{ width: `${cement.klinkerMax}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-text-main/80 space-y-1 pt-1 border-t border-home-grau/15">
                        <p><strong>Hauptbestandteile:</strong> {cement.components}</p>
                        <p><strong>CO₂-Potenzial (Richtwert):</strong> <span className="text-emerald-800 font-bold">{cement.co2Reduction}</span></p>
                        <p><strong>Frost-Eignung:</strong> {cement.frostSuitability}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-home-grau/20 text-[11px] text-text-main/75 bg-white p-2.5 rounded-lg border border-home-grau/15">
                      <strong className="text-text-main block mb-0.5">Anwendung (Kurzfassung; maßgebend sind die Anwendungstabellen der DIN 1045-2:2023-08 – manuell prüfen):</strong>
                      {cement.anwendungDin1045}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* FESTIGKEITSKLASSEN NACH DIN EN 197-1 TABELLE 7 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <ShieldCheck className="text-shiraz" size={18} />
              Genormte Festigkeitsklassen nach DIN EN 197-1
            </h4>

            <p className="text-xs text-text-main/75 leading-relaxed">
              Die Festigkeitsklassen von Zement werden an genormtem Mörtel nach DIN EN 196-1 geprüft. Der Buchstabe <strong>N</strong> steht für normale Anfangsfestigkeit (Standard), <strong>R</strong> für hohe Anfangsfestigkeit (Rapid):
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-off-white text-text-main font-bold border-b border-home-grau/25">
                    <th className="p-3">Festigkeitsklasse</th>
                    <th className="p-3">Prüfalter Frühfestigkeit</th>
                    <th className="p-3">Mindest-Frühfestigkeit</th>
                    <th className="p-3">Normfestigkeit (28 Tage)</th>
                    <th className="p-3">Erstarrungsbeginn</th>
                    <th className="p-3">Raumbeständigkeit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/15">
                  {STRENGTH_CLASSES_TABLE.map((row, idx) => (
                    <tr key={row.klasse} className={idx % 2 === 0 ? 'bg-white' : 'bg-off-white/40'}>
                      <td className="p-3 font-mono font-bold text-shiraz">{row.klasse}</td>
                      <td className="p-3 text-text-main/80">{row.earlyDays}</td>
                      <td className="p-3 font-bold text-text-main">{row.earlyStrength}</td>
                      <td className="p-3 font-mono font-bold text-emerald-800">{row.normStrength}</td>
                      <td className="p-3 text-text-main/80">{row.initialSettingMin}</td>
                      <td className="p-3 text-text-main/80">{row.soundnessMax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SONDERZEMENTE & ZUSATZBEZEICHNUNGEN */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <AlertTriangle className="text-amber-800" size={18} />
              Besondere Eigenschaften &amp; normative Zusatzbezeichnungen (DIN EN 197-1 &amp; DIN 1164-10)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* SR-Zement */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="font-bold text-shiraz uppercase tracking-wider block text-[11px]">Sulfatwiderstand (SR)</span>
                <h5 className="font-bold text-sm text-text-main">SR 0, SR 3, SR 5 &amp; CEM III</h5>
                <p className="text-text-main/80 leading-relaxed">
                  Begrenzung des reaktiven Tricalciumaluminats (<InlineMath math="C_3A" />) im Klinker zur Verhinderung von zerstörendem Sulfattreiben (Ettringitbildung).
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/15 text-[11px] text-text-main/75 space-y-1">
                  <p>• <strong>SR 0:</strong> <InlineMath math="C_3A = 0\,\%" /></p>
                  <p>• <strong>SR 3:</strong> <InlineMath math="C_3A \le 3\,\%" /></p>
                  <p>• <strong>SR 5:</strong> <InlineMath math="C_3A \le 5\,\%" /></p>
                  <p>• <strong>Normative Pflicht:</strong> Ab <InlineMath math="\text{SO}_4^{2-} > 600\text{ mg/l}" /> im Wasser (Klasse XA2/XA3 nach DIN 1045-2).</p>
                </div>
              </div>

              {/* LH-Zement */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="font-bold text-cyan-800 uppercase tracking-wider block text-[11px]">Hydratationswärme (LH / VLH)</span>
                <h5 className="font-bold text-sm text-text-main">Low Heat &amp; Very Low Heat</h5>
                <p className="text-text-main/80 leading-relaxed">
                  Reduziert die Temperaturspitzen und Temperaturgradienten in massigen Betonbauteilen (z. B. Sohlplatten &gt; 1 m, Talsperren, Wehrbauten) zur Rissvermeidung.
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/15 text-[11px] text-text-main/75 space-y-1">
                  <p>• <strong>LH (Low Heat):</strong> <InlineMath math="\le 270\text{ J/g}" /> nach 7 Tagen</p>
                  <p>• <strong>VLH (Very Low Heat):</strong> <InlineMath math="\le 220\text{ J/g}" /> nach 7 Tagen</p>
                  <p>• <strong>Zementbasis:</strong> Typischerweise hüttensandreich (CEM III/A oder CEM III/B).</p>
                </div>
              </div>

              {/* NA-Zement */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="font-bold text-emerald-800 uppercase tracking-wider block text-[11px]">Alkaligehalt (NA)</span>
                <h5 className="font-bold text-sm text-text-main">DIN 1164-10 (AKR-Schutz)</h5>
                <p className="text-text-main/80 leading-relaxed">
                  Zement mit niedrigem wirksamen Alkaligehalt (<InlineMath math="\text{Na}_2\text{O}_{\text{eq}}" />) zur Unterbindung der schädigenden Alkali-Kieselsäure-Reaktion (Betonkrebs).
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/15 text-[11px] text-text-main/75 space-y-1">
                  <p>• <strong>CEM I, CEM II (außer CEM II/B-S), CEM IV, CEM V:</strong> <InlineMath math="\text{Na}_2\text{O}_{\text{eq}} \le 0{,}60\text{ M.-\%}" /></p>
                  <p>• <strong>CEM II/B-S</strong> (21–35 % S): <InlineMath math="\le 0{,}70\text{ M.-\%}" /></p>
                  <p>• <strong>CEM III/A</strong> (36–49 % S): <InlineMath math="\le 0{,}95\text{ M.-\%}" />; (50–65 % S): <InlineMath math="\le 1{,}10\text{ M.-\%}" /></p>
                  <p>• <strong>CEM III/B, CEM III/C:</strong> <InlineMath math="\le 2{,}00\text{ M.-\%}" /></p>
                  <p>• <strong>Erforderlich:</strong> je nach Alkaliempfindlichkeitsklasse der Gesteinskörnung (E II, E III) und Feuchtigkeitsklasse nach Alkali-Richtlinie.</p>
                </div>
              </div>

            </div>
          </div>

          <FormulaDerivationBox
            title="Anwendungsbeispiel: Ist der Zement ein NA-Zement?"
            zielGleichung="\text{Na}_2\text{O}_{eq} = \text{Na}_2\text{O} + 0{,}658 \cdot \text{K}_2\text{O}"
            normQuelle="DIN 1164-10:2023-02"
            schritte={[
              { titel: '1. Gegeben (Lehrwerte)', formel: '\\text{Na}_2\\text{O} = 0{,}25\\,\\%,\\; \\text{K}_2\\text{O} = 0{,}80\\,\\%', erklaerung: 'Chemische Analyse des Zements in M.-%.' },
              { titel: '2. Na₂O-Äquivalent', formel: '\\text{Na}_2\\text{O}_{eq} = 0{,}25 + 0{,}658 \\cdot 0{,}80 = 0{,}78\\,\\%', erklaerung: 'Kalium wird über das Molmassenverhältnis in Natrium umgerechnet.' },
              { titel: '3. Als CEM I', formel: '0{,}78\\,\\% > 0{,}60\\,\\%', erklaerung: 'Kein NA-Zement.' },
              { titel: '4. Als CEM III/A mit 50–65 % Hüttensand', formel: '0{,}78\\,\\% \\le 1{,}10\\,\\%', erklaerung: 'NA-Anforderung erfüllt: Hüttensand bindet Alkalien und senkt die Porenlösungsalkalität.' },
            ]}
            ergebnisHinweis="Derselbe Alkaligehalt ist beim Portlandzement unzulässig, beim Hochofenzement CEM III/A (50–65 % S) zulässig."
          />
        </div>
      )}

      {activeTab === 'zementchemie_bogue' && (
        <div className="animate-in fade-in duration-300">
          <Zementchemie />
        </div>
      )}

      {activeTab === 'zusatzstoffe' && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          {/* Classification & Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-extrabold mb-1">
                Typ I
              </div>
              <h3 className="font-bold text-text-main text-lg">Inerte Zusatzstoffe (Typ I)</h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Diese Stoffe nehmen chemisch nahezu nicht am Hydratationsprozess teil. Sie wirken primär physikalisch über ihren Füllereffekt und stellen Kristallisationskeime bereit.
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/10 text-xs text-text-main/70 mt-auto">
                <strong>Typische Vertreter:</strong> Kalksteinmehl, Quarzmehl, Farbpigmente (z.B. Eisenoxid-Pigmente).
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-extrabold mb-1">
                Typ II (latent)
              </div>
              <h3 className="font-bold text-text-main text-lg">Latent-hydraulische Stoffe</h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Besitzen ein eigenes, eigenständiges hydraulisches Festigkeitspotenzial, reagieren allein aber extrem träge. Sie benötigen einen chemischen Anreger (Aktivator wie Portlandit), um zu hydratisieren.
              </p>
              <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50 text-xs text-text-main/70 mt-auto">
                <strong>Typische Vertreter:</strong> Hüttensand (gemahlene Hochofenschlacke / GGBS).
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 font-extrabold mb-1">
                Typ II (puzzolanisch)
              </div>
              <h3 className="font-bold text-text-main text-lg">Puzzolanische Stoffe</h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Sind selbständig nicht hydraulisch erhartend. Sie können jedoch bei Anwesenheit von Feuchtigkeit das freigesetzte Calciumhydroxid (<InlineMath math="Ca(OH)_2" />) chemisch binden und stabile C-S-H-Phasen aufbauen.
              </p>
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100/55 text-xs text-text-main/70 mt-auto">
                <strong>Typische Vertreter:</strong> Steinkohlenflugasche, Silikastaub (Microsilica), Trass, Metakaolin.
              </div>
            </div>
          </div>

          {/* Deep Dive Chemical Reactions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h3 className="text-xl font-bold text-text-main border-b border-home-grau/30 pb-3">Chemisches Reaktionsverhalten &amp; Reaktionsmechanismen</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pozzolanic Reaction Details */}
              <div className="space-y-4">
                <div className="bg-amber-50/40 p-5 rounded-xl border border-amber-200/55 h-full flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main text-base mb-2 text-amber-900">1. Die Puzzolanische Reaktion (Typ II)</h4>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                      Bei der primären Hydratation des Portlandzements (insbes. Alit <InlineMath math="C_3S" /> und Belit <InlineMath math="C_2S" />) entsteht als Nebenprodukt kristallines Calciumhydroxid (<InlineMath math="Ca(OH)_2" />, auch Portlandit oder <InlineMath math="CH" /> genannt). Portlandit ist sehr gut wasserlöslich, besitzt praktisch keine mechenische Bindekraft und bildet physikalisch-chemische Schwachstellen im Betongefüge (vor allem am Interface zur Gesteinskörnung - Interfacial Transition Zone, ITZ).
                    </p>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-4 font-normal">
                      Puzzolanische Zusatzstoffe wie <strong>Flugasche</strong> oder <strong>Silikastaub</strong> (reich an amorphem, reaktivem Siliziumdioxid <InlineMath math="SiO_2" /> und Aluminiumoxid <InlineMath math="Al_2O_3" />) reagieren im alkalischen Milieu der Porenlösung schleichend mit diesem Portlandit zu unlöslichen, festigkeitsbildenden Hydratphasen:
                    </p>
                    
                    <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 mb-3 shadow-2xs">
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-700 block mb-1">A) Kieselsäure-Reaktion (Zusätzliche C-S-H Genese):</span>
                      <BlockMath math="\text{SiO}_2 + \text{Ca(OH)}_2 + \text{H}_2\text{O} \rightarrow \text{C-S-H} \ (x\text{CaO} \cdot y\text{SiO}_2 \cdot z\text{H}_2\text{O})" />
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 shadow-2xs">
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-700 block mb-1">B) Tonerde-Reaktion (Zusätzliche C-A-H Genese):</span>
                      <BlockMath math="\text{Al}_2\text{O}_3 + \text{Ca(OH)}_2 + \text{H}_2\text{O} \rightarrow \text{C-A-H} \ (x\text{CaO} \cdot y\text{Al}_2\text{O}_3 \cdot z\text{H}_2\text{O})" />
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-amber-950 font-medium bg-amber-100/30 p-3 rounded-lg border border-amber-200/35">
                    <strong className="text-amber-900 border-l-2 border-amber-600 pl-2 block mb-1">Gefügevorteil:</strong>
                    Der Abbau des kristallinen, groben Portlandits und die Bildung von feligranem, fein verteiltem Calcium-Silikat-Hydrat (C-S-H)-Gel verdichtet das Mikrogefüge der ITZ dauerhaft. Dies verhindert kapillare Wanderwege und erhöht die Säure- und Frostbeständigkeit signifikant.
                  </div>
                </div>
              </div>

              {/* Latent-Hydraulic Reaction Details */}
              <div className="space-y-4">
                <div className="bg-indigo-50/40 p-5 rounded-xl border border-indigo-200/55 h-full flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main text-base mb-2 text-indigo-900">2. Die Latent-Hydraulische Hydratation (Typ II)</h4>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                      Latent-hydraulische Zusatzstoffe wie <strong>Hüttensand</strong> haben einen Aufbau, der dem Portlandzement ähnlicher ist, da sie bereits einen beträchtlichen Anteil an Calciumoxid (<InlineMath math="CaO" />) sowie Silicium- und Aluminiumoxid in ihrer glasartigen Schmelzstruktur tragen. Da diese Struktur jedoch im Ofen schockartig zu einer amorphen Glasschmelze erstarrt ist, bildet sich bei reinem Wasserkontakt eine dichte Alumosilikat-Passivierungsschicht aus, die den Reaktionsfortgang sofort blockiert.
                    </p>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-4">
                      Um diese Blockade zu brechen, wird eine Anregung (Breakdown des Glasnetzwerks durch Hydroxidionen) in der Porenlösung benötigt. Das Zirkulieren von Basen/Alkalien aktiviert die Schlacke:
                    </p>

                    <div className="bg-white p-3.5 rounded-lg border border-indigo-200/80 mb-3 shadow-2xs space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 block mb-1">Alkalische Anregung (durch Ca(OH)2 des Zements):</span>
                        <p className="text-[10px] text-text-main/70 mb-1 leading-normal">
                          Das bei der Alithydratation freigesetzte Portlandit liefert die nötigen Hydroxidionen (<InlineMath math="OH^-" />), um das Silikatglas-Netzwerk aufzuspalten und C-S-H Phasen freizusetzen:
                        </p>
                        <BlockMath math="\text{Hüttensand-Glas} \xrightarrow{\text{pH } > 12{,}0} \text{C-S-H} + \text{C-A-S-H}" />
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-indigo-200/80 shadow-2xs">
                      <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 block mb-1">Sulfatische Anregung (z.B. Gips/Anhydrit):</span>
                      <p className="text-[10px] text-text-main/70 mb-1 leading-normal">
                        Calciumsulfat reagiert mit den reaktiven Aluminium-Anteilen des Hüttensands zu expansivem, aber gefügestabilisierendem Ettringit:
                      </p>
                      <BlockMath math="\text{Alumosilikat} + \text{CaSO}_4 + \text{H}_2\text{O} \rightarrow \text{Ettringit}" />
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-indigo-950 font-medium bg-indigo-100/30 p-3 rounded-lg border border-indigo-200/35">
                    <strong className="text-indigo-900 border-l-2 border-indigo-600 pl-2 block mb-1">Gefügevorteil:</strong>
                    Der Reaktionsfortgang ist zwar verlangsamt, hält dafür aber extrem langfristig an. In späten Phasen (monatelang) entsteht ein hochverdichtetes Zementsteingefüge mit sehr gutem Sulfatwiderstand und minimaler Porenweite. Dies ist die Grundlage von modernen klinkerreduzierten Zementen (z.B. CEM III).
                  </div>
                </div>
              </div>
            </div>

            {/* Special Nucleation & Carboaluminate effect of Inert additives */}
            <div className="bg-stone-50 border border-home-grau/25 p-5 rounded-xl space-y-3 text-sm">
              <h4 className="font-bold text-text-main text-base flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <span className="shrink-0 text-shiraz font-mono font-bold">ℹ</span> 3. Reaktivitätsfinessen scheinbar inerter Stoffe (Typ I)
              </h4>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Obwohl <strong>Kalksteinmehl (Calciumcarbonat <InlineMath math="CaCO_3" />)</strong> traditionell als rein physikalischer Füller deklariert ist, zeigt die metallurgische Forschung, dass es eine subtile, aber wertvolle chemisch-physikalische Aktivität entfaltet:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
                <div className="space-y-1 bg-white p-4 rounded-xl border border-home-grau/10">
                  <strong className="text-xs uppercase font-bold text-shiraz block">A) Beschleunigte Keimbildung (Nucleation Effect):</strong>
                  <p className="text-[11px] text-text-main/75 leading-relaxed">
                    Die ultrafeinen Kalksteinpartikel lagern sich direkt an die Klinkerkörner an. Sie wirken als ideale Oberflächen-Kristallisationskeime, an denen sich C-S-H-Phasen bevorzugt und beschleunigt abscheiden können. Dies treibt die Hydratationsgeschwindigkeit des Zements in den ersten 24 Stunden deutlich an.
                  </p>
                </div>
                <div className="space-y-1 bg-white p-4 rounded-xl border border-home-grau/10">
                  <strong className="text-xs uppercase font-bold text-shiraz block">B) Carboaluminatchemie:</strong>
                  <p className="text-[11px] text-text-main/75 leading-relaxed font-normal">
                    Karbonationen (<InlineMath math="CO_3^{2-}" />) aus dem fein vermahlenen Kalksteinmehl reagieren geringfügig, aber signifikant mit den Aluminatkomponenten des Tricalciumaluminats (<InlineMath math="C_3A" />) im Klinker. Sie bilden stabiles Mono- und Hemicarbonat. Dadurch wird verhindert, dass sich Ettringit vorzeitig in Monosulfat umwandelt, was das Gesamtvolumen des Zementsteins leicht vergrößert und schließt so Mikroporen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Microstructural and Workability Effects */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-text-main border-b border-home-grau/30 pb-3">Physische &amp; Gefügespezifische Effekte im Beton</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/15 space-y-2">
                <strong className="text-sm text-text-main font-bold block text-shiraz">1. Füllereffekt (Filler Effect)</strong>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Zusatzstoffe füllen Porenräume zwischen den deutlich größeren Zement- und Sandkörnern aus. Das optimiert die Packungsdichte, verdrängt gebundenes Porenwasser und erhöht die Gefügedichtigkeit im erhärteten Zustand.
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/15 space-y-2">
                <strong className="text-sm text-text-main font-bold block text-shiraz">2. Kugellagereffekt</strong>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Kugelige Partikel (wie aus Steinkohlenflugasche) verringern die viskose Reibung im Frischbeton und verbessern die Fließfähigkeit und Pumpbarkeit ohne eine Erhöhung des w/z-Wertes.
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/15 space-y-2">
                <strong className="text-sm text-text-main font-bold block text-shiraz">3. Reaktivitätsgefälle</strong>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Die moderat beigemischten Hüttensand- und Flugaschepartikel strecken die Hydratationsreaktion zeitlich. Dadurch verteilt sich die Hydratationswärme rissmindernd bei dicken Betonquerschnitten.
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/15 space-y-2">
                <strong className="text-sm text-text-main font-bold block text-shiraz">4. k-Wert Konzept</strong>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Flugasche darf mit dem Anrechnungsfaktor <InlineMath math="k = 0{,}4" /> auf Mindestzementgehalt und w/z-Wert angerechnet werden. In Deutschland gilt nach DIN 1045-2:2023-08 k = 1,0 für Silikastaub (s ≤ 0,11·z); in XF2/XF4 ist nur Flugasche anrechenbar. Die Anrechnung spart Zement und verbessert die CO₂-Bilanz.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      <ModulTest moduleId="bindemittel" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' },
          { title: 'Bindemittel (Baustoff)', url: 'https://de.wikipedia.org/wiki/Bindemittel' },
          { title: 'Betonzusatzstoff', url: 'https://de.wikipedia.org/wiki/Betonzusatzstoff' },
          { title: 'Alkali-Kieselsäure-Reaktion', url: 'https://de.wikipedia.org/wiki/Alkali-Kiesels%C3%A4ure-Reaktion' }
        ]}
        literatur={[
          'Heidelberg Materials / InformationsZentrum Beton (IZB): Betontechnische Daten (Ausgabe 2022 / Folgeauflagen)',
          'Stark, J.; Wicht, B.: Zement und Kalk – Der Baustoff als Werkstoff. Basel: Birkhäuser 2000',
          'Locher, F. W.: Zement – Grundlagen der Herstellung und Verwendung. Düsseldorf: Verlag Bau+Technik 2000',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Bogue, R. H.: Calculation of the Compounds in Portland Cement. Industrial & Engineering Chemistry, Analytical Edition 1 (1929) 4, S. 192–197',
          'Taylor, H. F. W.: Cement Chemistry. 2. Aufl., London: Thomas Telford 1997'
        ]}
        regelwerke={[
          { title: 'DIN EN 197-1:2011-11 (Zement - Teil 1: Zusammensetzung, Anforderungen und Konformitätskriterien von Normalzement)' },
          { title: 'DIN EN 197-5:2021-07 (Zement - Teil 5: Portland-Kompositzement CEM II/C-M und Kompositzement CEM VI)' },
          { title: 'DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Spannbeton - Teil 2: Beton)' },
          { title: 'DIN 1164-10:2023-02 (Zement mit besonderen Eigenschaften - Teil 10: Zement mit niedrigem wirksamen Alkaligehalt NA)' },
          { title: 'DIN EN 450-1:2012-10 (Flugasche für Beton - Teil 1: Definitionen, Anforderungen und Qualitätskontrolle)' },
          { title: 'DIN EN 13263-1:2009-07 (Silikastaub für Beton - Teil 1: Definitionen, Anforderungen und Konformitätskriterien)' }
        ]}
        formeln={[
          {
            formel: '\\left(\\frac{w}{c}\\right)_{\\text{eq}} = \\frac{w}{c + k_F \\cdot f + k_S \\cdot s}',
            erklaerung: 'Äquivalenter Wasserzementwert nach DIN EN 206 / DIN 1045-2: Anrechnung von Steinkohlenflugasche (k_F = 0,40 bei CEM I) und Silikastaub (k_S = 1,0 nach DIN 1045-2:2023-08, s ≤ 0,11·z) auf den Zementgehalt c.',
            quelle: 'DIN EN 206 Tab. 15 / DIN 1045-2'
          },
          {
            formel: '2(3\\text{CaO} \\cdot \\text{SiO}_2) + 6\\text{H}_2\\text{O} \\rightarrow 3\\text{CaO} \\cdot 2\\text{SiO}_2 \\cdot 3\\text{H}_2\\text{O} + 3\\text{Ca(OH)}_2',
            erklaerung: 'Alit-Hydratation (2 C3S + 6 H -> C-S-H + 3 CH): Bildung von festigkeitsbildendem C-S-H-Gel und basischem Portlandit (pH-Puffer).',
            quelle: 'Stark/Wicht: Zementchemie'
          },
          {
            formel: '\\text{Na}_2\\text{O}_{\\text{eq}} = \\%\\text{Na}_2\\text{O} + 0{,}658 \\cdot \\%\\text{K}_2\\text{O}',
            erklaerung: 'Äquivalenter Alkaligehalt nach DIN 1164-10: Maßgeblich für NA-Zemente zum Schutz vor schädigender Alkali-Kieselsäure-Reaktion (AKR) in den Feuchteklassen WA und WS.',
            quelle: 'DIN 1164-10 / DAfStb Alkali-Richtlinie'
          }
        ]}
      />
    </div>
  );
}
