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
import inhalt from '@/content/bindemittel/Bindemittel.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

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
    components: inhalt.werte.nurKlinkerKBis,
    co2Reduction: inhalt.werte.referenz0CoMinderung,
    anwendungDin1045: inhalt.werte.uneingeschränktFürAlleExpositionsklassen,
    frostSuitability: inhalt.werte.sehrGutHoheFrost,
    normReference: inhalt.werte.dinEn1971
  },

  // CEM II
  {
    code: 'CEM II/A-S',
    family: 'CEM II',
    name: inhalt.werte.portlandhüttenzementTypA,
    klinkerMin: 80,
    klinkerMax: 94,
    components: inhalt.werte.hüttensandS620,
    co2Reduction: inhalt.werte.ca1018Minderung,
    anwendungDin1045: inhalt.werte.uneingeschränktFürAlleExpositionsklassen2,
    frostSuitability: inhalt.werte.sehrGutHoheDichtigkeit,
    normReference: inhalt.werte.dinEn19712
  },
  {
    code: 'CEM II/B-S',
    family: 'CEM II',
    name: inhalt.werte.portlandhüttenzementTypB,
    klinkerMin: 65,
    klinkerMax: 79,
    components: inhalt.werte.hüttensandS2135,
    co2Reduction: inhalt.werte.ca2532Minderung,
    anwendungDin1045: inhalt.werte.zulässigFürAlleExpositionsklassen,
    frostSuitability: inhalt.werte.gutLangsamereFrühfestigkeitDichte,
    normReference: inhalt.werte.dinEn19713
  },
  {
    code: 'CEM II/A-LL',
    family: 'CEM II',
    name: inhalt.werte.portlandkalksteinzementTypA,
    klinkerMin: 80,
    klinkerMax: 94,
    components: inhalt.werte.kalksteinLlToc0,
    co2Reduction: inhalt.werte.ca1018Minderung2,
    anwendungDin1045: inhalt.werte.zulässigFürInnenUnd,
    frostSuitability: inhalt.werte.gutBisMäßigFüllereffekt,
    normReference: inhalt.werte.dinEn19714
  },
  {
    code: 'CEM II/B-LL',
    family: 'CEM II',
    name: inhalt.werte.portlandkalksteinzementTypB,
    klinkerMin: 65,
    klinkerMax: 79,
    components: inhalt.werte.kalksteinLl2135,
    co2Reduction: inhalt.werte.ca2532Minderung2,
    anwendungDin1045: inhalt.werte.bevorzugtFürXc1Xc3,
    frostSuitability: inhalt.werte.mäßigNichtFürXf4,
    normReference: inhalt.werte.dinEn19715
  },
  {
    code: 'CEM II/A-V',
    family: 'CEM II',
    name: inhalt.werte.portlandflugaschezementTypA,
    klinkerMin: 80,
    klinkerMax: 94,
    components: inhalt.werte.kieselsäurereicheFlugascheV6,
    co2Reduction: inhalt.werte.ca1220Minderung,
    anwendungDin1045: inhalt.werte.zulässigFürXc1Xc4,
    frostSuitability: inhalt.werte.gutDichtetDasPorengefüge,
    normReference: inhalt.werte.dinEn19716
  },
  {
    code: inhalt.werte.cemIiAM,
    family: 'CEM II',
    name: 'Portlandkompositzement',
    klinkerMin: 65,
    klinkerMax: 94,
    components: inhalt.werte.mehrereHauptbestandteileZB,
    co2Reduction: inhalt.werte.ca1535Minderung,
    anwendungDin1045: inhalt.werte.standardzementImModernenHoch,
    frostSuitability: inhalt.werte.gutKombinationseffektAusReaktivität,
    normReference: inhalt.werte.dinEn19717
  },

  // NEUE KLINKEREFFIZIENTE ZEMENTE (DIN EN 197-5 / DIN 1045-2:2023-08)
  {
    code: 'CEM II/C-M',
    family: 'CEM II/C-M & CEM VI',
    name: inhalt.werte.portlandKompositzementKlinkereffizient,
    klinkerMin: 50,
    klinkerMax: 64,
    components: inhalt.werte.klinkersparend3650Mineralische,
    co2Reduction: inhalt.werte.ca3850Minderung,
    anwendungDin1045: inhalt.werte.zulässigNachDin1045,
    frostSuitability: inhalt.werte.sorgfältigeNachbehandlungZwingendGute,
    normReference: inhalt.werte.dinEn1975,
    isNewStandard: true
  },
  {
    code: 'CEM VI',
    family: 'CEM II/C-M & CEM VI',
    name: inhalt.werte.kompositzementHochklinkersparend,
    klinkerMin: 35,
    klinkerMax: 49,
    components: inhalt.werte.hüttensandS3159,
    co2Reduction: inhalt.werte.bisZu60Minderung,
    anwendungDin1045: inhalt.werte.neuGenormtInDin,
    frostSuitability: inhalt.werte.langsameErhärtungNiedrigeHydratationswär,
    normReference: inhalt.werte.dinEn19752,
    isNewStandard: true
  },

  // CEM III
  {
    code: 'CEM III/A',
    family: 'CEM III',
    name: inhalt.werte.hochofenzementTypA,
    klinkerMin: 35,
    klinkerMax: 64,
    components: inhalt.werte.hüttensandS3665,
    co2Reduction: inhalt.werte.ca4055Minderung,
    anwendungDin1045: inhalt.werte.sehrBreitesAnwendungsspektrumHoher,
    frostSuitability: inhalt.werte.gutBeiXf4Mit,
    normReference: inhalt.werte.dinEn19718
  },
  {
    code: 'CEM III/B',
    family: 'CEM III',
    name: inhalt.werte.hochofenzementTypB,
    klinkerMin: 20,
    klinkerMax: 34,
    components: inhalt.werte.hüttensandS6680,
    co2Reduction: inhalt.werte.ca6075Minderung,
    anwendungDin1045: inhalt.werte.hoherSulfatwiderstandGiltNaturgemäß,
    frostSuitability: inhalt.werte.langsameFestigkeitsentwicklungLängereNac,
    normReference: inhalt.werte.dinEn19719
  },
  {
    code: 'CEM III/C',
    family: 'CEM III',
    name: inhalt.werte.hochofenzementTypC,
    klinkerMin: 5,
    klinkerMax: 19,
    components: inhalt.werte.hüttensandS8195,
    co2Reduction: inhalt.werte.bisZu85Minderung,
    anwendungDin1045: inhalt.werte.extremNiedrigeHydratationswärmeVlh,
    frostSuitability: inhalt.werte.nurFürFrostfreieSpezialanwendungen,
    normReference: inhalt.werte.dinEn197110
  },

  // CEM IV & V
  {
    code: inhalt.werte.cemIvAIv,
    family: 'CEM IV & V',
    name: 'Puzzolanzement',
    klinkerMin: 45,
    klinkerMax: 89,
    components: inhalt.werte.puzzolanischeStoffeFlugascheTrass,
    co2Reduction: inhalt.werte.ca3050Minderung,
    anwendungDin1045: inhalt.werte.wasserbauMassenbetonChemischerAngriff,
    frostSuitability: inhalt.werte.mäßigInDeutschlandSeltener,
    normReference: inhalt.werte.dinEn197111
  },
  {
    code: inhalt.werte.cemVAV,
    family: 'CEM IV & V',
    name: 'Kompositzement',
    klinkerMin: 20,
    klinkerMax: 64,
    components: inhalt.werte.hüttensand1849Puzzolane,
    co2Reduction: inhalt.werte.ca5070Minderung,
    anwendungDin1045: inhalt.werte.spezialanwendungenMitGeringerWärmeentwic,
    frostSuitability: inhalt.werte.langsameErhärtung,
    normReference: inhalt.werte.dinEn197112
  }
];

// Festigkeitsklassen nach DIN EN 197-1 Tabelle 7
export const STRENGTH_CLASSES_TABLE = [
  {
    klasse: '32,5 N',
    earlyDays: '7 Tage',
    earlyStrength: '≥ 16,0 MPa',
    normStrength: inhalt.werte.t325525,
    initialSettingMin: '≥ 75 min',
    soundnessMax: '≤ 10 mm'
  },
  {
    klasse: '32,5 R',
    earlyDays: '2 Tage',
    earlyStrength: '≥ 10,0 MPa',
    normStrength: inhalt.werte.t3255252,
    initialSettingMin: '≥ 75 min',
    soundnessMax: '≤ 10 mm'
  },
  {
    klasse: '42,5 N',
    earlyDays: '2 Tage',
    earlyStrength: '≥ 10,0 MPa',
    normStrength: inhalt.werte.t425625,
    initialSettingMin: '≥ 60 min',
    soundnessMax: '≤ 10 mm'
  },
  {
    klasse: '42,5 R',
    earlyDays: '2 Tage',
    earlyStrength: '≥ 20,0 MPa',
    normStrength: inhalt.werte.t4256252,
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

const REITER = [
  { id: 'herstellung', label: inhalt.texte.herstellungEigenschaften, icon: Factory },
  { id: 'zement', label: inhalt.texte.zementHydratation, icon: Layers },
  { id: 'normzemente', label: inhalt.texte.normzementeDinEn197, icon: BookOpen },
  { id: 'zementchemie_bogue', label: 'Zementchemie', icon: Flame },
  { id: 'zusatzstoffe', label: 'Betonzusatzstoffe', icon: FlaskConical },
] as const;

export default function Bindemittel() {
  const [activeTab, setActiveTab] = useState<'herstellung' | 'zement' | 'normzemente' | 'zementchemie_bogue' | 'zusatzstoffe'>('normzemente');
  const [cementFilter, setCementFilter] = useState<string>('ALLE');

  const hydratationData = {
    labels: [0, 1, 3, 7, 14, 28],
    datasets: [
      {
        label: inhalt.werte.c3aAluminat,
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
        label: inhalt.werte.c4afFerrit,
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
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.bindemittelZusatzstoffe} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.bindemittelWieZementSind} /></p>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-xs">
            <strong className="mr-1">Lernpfad:</strong>
            {([
              ['herstellung', 'Herstellung'], ['zement', inhalt.werte.klinkerphasenHydratation], ['zementchemie_bogue', inhalt.werte.zementchemieBogueGefüge],
              ['normzemente', 'Normzemente'], ['zusatzstoffe', 'Zusatzstoffe'],
            ] as const).map(([id, label], i) => (
              <React.Fragment key={id}>
                {i > 0 && <span className="text-text-main/40">→</span>}
                <button onClick={() => setActiveTab(id)} className="underline decoration-dotted hover:text-shiraz cursor-pointer">{i + 1}. {label}</button>
              </React.Fragment>
            ))}
            <span className="text-text-main/60 ml-1"><MdText text={inhalt.texte.dieZementherstellungIstIm} /></span>
          </p>
        </div>

        <ModuleTabs label="Bereiche Bindemittel" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-6">

      {activeTab === 'herstellung' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.herstellungVonZement} /></h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.dieHerstellungVonZement} /></p>
            <ol className="list-decimal list-inside text-sm text-text-main/80 space-y-3">
              <li><MdText text={inhalt.texte.rohstoffgewinnungAufbereitungKalksteinCa} /></li>
              <li><MdText text={inhalt.texte.zyklonvorwärmerKalzinatorDasRohmehl} /></li>
              <li><MdText text={inhalt.texte.sinternImDrehrohrofenBei} /></li>
              <li><MdText text={inhalt.texte.kühlenMahlenDerKlinker} /></li>
            </ol>
            <div className="bg-torch-red/10 border border-torch-red/20 p-4 rounded-xl mt-2 text-sm text-text-main/90"><MdText text={inhalt.texte.coEmissionenDieZementherstellung} /><ul className="list-disc pl-5 mt-2 space-y-1">
                <li><MdText text={inhalt.texte.alternativeBrennstoffeBiomasseUnd} /></li>
                <li><MdText text={inhalt.texte.klinkerreduktionMehrKompositzementeCem} /></li>
                <li><MdText text={inhalt.texte.carbonCaptureCcsCcu} /></li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.eigenschaftenVonBindemitteln} /></h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.zementIstEinHydraulisches} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2 mt-2">
              <li><MdText text={inhalt.texte.hydraulischeEigenschaftEigenständigeErhä} /></li>
              <li><MdText text={inhalt.texte.mahlfeinheitJeFeinerDer} /></li>
              <li><MdText text={inhalt.texte.dichtePortlandzementHatEine} /></li>
              <li><MdText text={inhalt.texte.hydratationswärmeDurchDieExotherme} /></li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'zement' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Zementklinkerphasen</h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.portlandzementklinkerBestehtHauptsächlic} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><MdText text={inhalt.texte.alitC3sTricalciumsilicat} /></li>
              <li><MdText text={inhalt.texte.belitC2sDicalciumsilicat} /></li>
              <li><MdText text={inhalt.texte.aluminatC3aTricalciumaluminat} /></li>
              <li><MdText text={inhalt.texte.ferritC4afTetracalciumaluminatferrit} /></li>
            </ul>

            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-sm text-text-main mb-2"><MdText text={inhalt.texte.wärmeentwicklungDerKlinkerphasenSchemati} /></h4>
              <div className="h-48 w-full">
                <Line 
                  id="hydratation-chart"
                  data={hydratationData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { title: { display: true, text: inhalt.werte.hydratationswärmeJG } },
                      x: { title: { display: true, text: 'Zeit (Tage)' } }
                    },
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }
                  }} 
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.hydratationGefügebildung} /></h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.dieErhärtungDesZements} /></p>
            <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
              <p className="text-xs font-bold text-text-main mb-2"><MdText text={inhalt.texte.beispielHydratationVonAlit} /></p>
              <BlockMath math="2 C_3S + 6 H \rightarrow C_3S_2H_3 + 3 CH" />
              <p className="text-xs text-text-main/80 mt-2"><MdText text={inhalt.texte.tricalciumsilicatWasserCS} /></p>
            </div>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2 mt-2">
              <li><MdText text={inhalt.texte.cSHPhasen} /></li>
              <li><MdText text={inhalt.texte.portlanditCaOh2} /></li>
              <li><MdText text={inhalt.texte.ettringitAftPhaseEntsteht} /></li>
              <li><MdText text={inhalt.texte.monosulfatAfmPhaseEntsteht} /></li>
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
                  <h3 className="text-base sm:text-lg font-bold text-text-main"><MdText text={inhalt.texte.normzementeNachDinEn} /></h3>
                  <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.gegenüberstellungStandBetontechnischeDat} /></p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-off-white text-shiraz border border-home-grau/20 rounded-lg self-start sm:self-auto"><MdText text={inhalt.texte.din104522023} /></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-home-grau/20 space-y-1.5">
                <span className="font-bold text-slate-700 block flex items-center gap-1.5">
                  <Info size={14} className="text-slate-500" /><MdText text={inhalt.texte.standBetontechnischeDatenHeidelberg} /></span>
                <p className="text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.basierteAufDer27} /></p>
              </div>

              <div className="p-3.5 bg-shiraz/5 rounded-xl border border-shiraz/20 space-y-1.5">
                <span className="font-bold text-shiraz block flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-shiraz" /><MdText text={inhalt.texte.gültigerAktuellerNormenstandDin} /></span>
                <p className="text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.vollständigeBauaufsichtlicheAufnahmeDer} /></p>
              </div>
            </div>
          </div>

          {/* FILTERBAR & NORMZEMENT-KATALOG */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-home-grau/20">
              <div>
                <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Filter size={18} className="text-shiraz" /><MdText text={inhalt.texte.zementartenZusammensetzungNachDin} /></h4>
                <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.wählenSieEineZementfamilie} /></p>
              </div>

              <div className="flex flex-wrap gap-1 p-1 bg-off-white rounded-xl border border-home-grau/20 text-xs">
                {['ALLE', 'CEM I', 'CEM II', inhalt.werte.cemIiCM, 'CEM III', 'CEM IV & V'].map(f => (
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
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-shiraz text-white"><MdText text={inhalt.texte.neuDinEn197} /></span>
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
                        <p><MdText text={inhalt.texte.coPotenzialRichtwert} /><span className="text-emerald-800 font-bold">{cement.co2Reduction}</span></p>
                        <p><strong>Frost-Eignung:</strong> {cement.frostSuitability}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-home-grau/20 text-[11px] text-text-main/75 bg-white p-2.5 rounded-lg border border-home-grau/15">
                      <strong className="text-text-main block mb-0.5"><MdText text={inhalt.texte.anwendungKurzfassungMaßgebendSind} /></strong>
                      {cement.anwendungDin1045}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* FESTIGKEITSKLASSEN NACH DIN EN 197-1 TABELLE 7 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <ShieldCheck className="text-shiraz" size={18} /><MdText text={inhalt.texte.genormteFestigkeitsklassenNachDin} /></h4>

            <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.dieFestigkeitsklassenVonZement} /></p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-off-white text-text-main font-bold border-b border-home-grau/25">
                    <th className="p-3">Festigkeitsklasse</th>
                    <th className="p-3"><MdText text={inhalt.texte.prüfalterFrühfestigkeit} /></th>
                    <th className="p-3">Mindest-Frühfestigkeit</th>
                    <th className="p-3"><MdText text={inhalt.texte.normfestigkeit28Tage} /></th>
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
              <AlertTriangle className="text-amber-800" size={18} /><MdText text={inhalt.texte.besondereEigenschaftenNormativeZusatzbez} /></h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* SR-Zement */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="font-bold text-shiraz uppercase tracking-wider block text-[11px]"><MdText text={inhalt.texte.sulfatwiderstandSr} /></span>
                <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.sr0Sr3} /></h5>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.begrenzungDesReaktivenTricalciumaluminat} /></p>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/15 text-[11px] text-text-main/75 space-y-1">
                  <p>• <strong>SR 0:</strong> <InlineMath math="C_3A = 0\,\%" /></p>
                  <p>• <strong>SR 3:</strong> <InlineMath math="C_3A \le 3\,\%" /></p>
                  <p>• <strong>SR 5:</strong> <InlineMath math="C_3A \le 5\,\%" /></p>
                  <p><MdText text={inhalt.texte.normativePflichtAbText} /></p>
                </div>
              </div>

              {/* LH-Zement */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="font-bold text-cyan-800 uppercase tracking-wider block text-[11px]"><MdText text={inhalt.texte.hydratationswärmeLhVlh} /></span>
                <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.lowHeatVeryLow} /></h5>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.reduziertDieTemperaturspitzenUnd} /></p>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/15 text-[11px] text-text-main/75 space-y-1">
                  <p><MdText text={inhalt.texte.lhLowHeatLe} /></p>
                  <p><MdText text={inhalt.texte.vlhVeryLowHeat} /></p>
                  <p><MdText text={inhalt.texte.zementbasisTypischerweiseHüttensandreich} /></p>
                </div>
              </div>

              {/* NA-Zement */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="font-bold text-emerald-800 uppercase tracking-wider block text-[11px]"><MdText text={inhalt.texte.alkaligehaltNa} /></span>
                <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.din116410Akr} /></h5>
                <p className="text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.zementMitNiedrigemWirksamen} /></p>
                <div className="p-2.5 bg-white rounded-lg border border-home-grau/15 text-[11px] text-text-main/75 space-y-1">
                  <p><MdText text={inhalt.texte.cemICemIi} /></p>
                  <p><MdText text={inhalt.texte.cemIiBS} /></p>
                  <p><MdText text={inhalt.texte.cemIiiA36} /></p>
                  <p><MdText text={inhalt.texte.cemIiiBCem} /></p>
                  <p><MdText text={inhalt.texte.erforderlichJeNachAlkaliempfindlichkeits} /></p>
                </div>
              </div>

            </div>
          </div>

          <FormulaDerivationBox
            title={inhalt.werte.anwendungsbeispielIstDerZement}
            zielGleichung="\text{Na}_2\text{O}_{eq} = \text{Na}_2\text{O} + 0{,}658 \cdot \text{K}_2\text{O}"
            normQuelle={inhalt.werte.din1164102023}
            schritte={inhalt.daten["Bindemittel.schritte"]}
            ergebnisHinweis={inhalt.werte.derselbeAlkaligehaltIstBeim}
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
              <h3 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.inerteZusatzstoffeTypI} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieseStoffeNehmenChemisch} /></p>
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/10 text-xs text-text-main/70 mt-auto"><MdText text={inhalt.texte.typischeVertreterKalksteinmehlQuarzmehl} /></div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-extrabold mb-1"><MdText text={inhalt.texte.typIiLatent} /></div>
              <h3 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.latentHydraulischeStoffe} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.besitzenEinEigenesEigenständiges} /></p>
              <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50 text-xs text-text-main/70 mt-auto"><MdText text={inhalt.texte.typischeVertreterHüttensandGemahlene} /></div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 font-extrabold mb-1"><MdText text={inhalt.texte.typIiPuzzolanisch} /></div>
              <h3 className="font-bold text-text-main text-lg"><MdText text={inhalt.texte.puzzolanischeStoffe} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.sindSelbständigNichtHydraulisch} /></p>
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100/55 text-xs text-text-main/70 mt-auto"><MdText text={inhalt.texte.typischeVertreterSteinkohlenflugascheSil} /></div>
            </div>
          </div>

          {/* Deep Dive Chemical Reactions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h3 className="text-xl font-bold text-text-main border-b border-home-grau/30 pb-3"><MdText text={inhalt.texte.chemischesReaktionsverhaltenReaktionsmec} /></h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pozzolanic Reaction Details */}
              <div className="space-y-4">
                <div className="bg-amber-50/40 p-5 rounded-xl border border-amber-200/55 h-full flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main text-base mb-2 text-amber-900"><MdText text={inhalt.texte.t1DiePuzzolanischeReaktion} /></h4>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.beiDerPrimärenHydratation} /></p>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-4 font-normal"><MdText text={inhalt.texte.puzzolanischeZusatzstoffeWieFlugasche} /></p>
                    
                    <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 mb-3 shadow-2xs">
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-700 block mb-1"><MdText text={inhalt.texte.aKieselsäureReaktionZusätzliche} /></span>
                      <BlockMath math="\text{SiO}_2 + \text{Ca(OH)}_2 + \text{H}_2\text{O} \rightarrow \text{C-S-H} \ (x\text{CaO} \cdot y\text{SiO}_2 \cdot z\text{H}_2\text{O})" />
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 shadow-2xs">
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-700 block mb-1"><MdText text={inhalt.texte.bTonerdeReaktionZusätzliche} /></span>
                      <BlockMath math="\text{Al}_2\text{O}_3 + \text{Ca(OH)}_2 + \text{H}_2\text{O} \rightarrow \text{C-A-H} \ (x\text{CaO} \cdot y\text{Al}_2\text{O}_3 \cdot z\text{H}_2\text{O})" />
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-amber-950 font-medium bg-amber-100/30 p-3 rounded-lg border border-amber-200/35">
                    <strong className="text-amber-900 border-l-2 border-amber-600 pl-2 block mb-1">Gefügevorteil:</strong><MdText text={inhalt.texte.derAbbauDesKristallinen} /></div>
                </div>
              </div>

              {/* Latent-Hydraulic Reaction Details */}
              <div className="space-y-4">
                <div className="bg-indigo-50/40 p-5 rounded-xl border border-indigo-200/55 h-full flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main text-base mb-2 text-indigo-900"><MdText text={inhalt.texte.t2DieLatentHydraulische} /></h4>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.latentHydraulischeZusatzstoffeWie} /></p>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-4"><MdText text={inhalt.texte.umDieseBlockadeZu} /></p>

                    <div className="bg-white p-3.5 rounded-lg border border-indigo-200/80 mb-3 shadow-2xs space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 block mb-1"><MdText text={inhalt.texte.alkalischeAnregungDurchCa} /></span>
                        <p className="text-[10px] text-text-main/70 mb-1 leading-normal"><MdText text={inhalt.texte.dasBeiDerAlithydratation} /></p>
                        <BlockMath math="\text{Hüttensand-Glas} \xrightarrow{\text{pH } > 12{,}0} \text{C-S-H} + \text{C-A-S-H}" />
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-indigo-200/80 shadow-2xs">
                      <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 block mb-1"><MdText text={inhalt.texte.sulfatischeAnregungZB} /></span>
                      <p className="text-[10px] text-text-main/70 mb-1 leading-normal"><MdText text={inhalt.texte.calciumsulfatReagiertMitDen} /></p>
                      <BlockMath math="\text{Alumosilikat} + \text{CaSO}_4 + \text{H}_2\text{O} \rightarrow \text{Ettringit}" />
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-indigo-950 font-medium bg-indigo-100/30 p-3 rounded-lg border border-indigo-200/35">
                    <strong className="text-indigo-900 border-l-2 border-indigo-600 pl-2 block mb-1">Gefügevorteil:</strong><MdText text={inhalt.texte.derReaktionsfortgangIstZwar} /></div>
                </div>
              </div>
            </div>

            {/* Special Nucleation & Carboaluminate effect of Inert additives */}
            <div className="bg-stone-50 border border-home-grau/25 p-5 rounded-xl space-y-3 text-sm">
              <h4 className="font-bold text-text-main text-base flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <span className="shrink-0 text-shiraz font-mono font-bold">ℹ</span><MdText text={inhalt.texte.t3ReaktivitätsfinessenScheinbarInerter} /></h4>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.obwohlKalksteinmehlCalciumcarbonatCaco} /></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
                <div className="space-y-1 bg-white p-4 rounded-xl border border-home-grau/10">
                  <strong className="text-xs uppercase font-bold text-shiraz block"><MdText text={inhalt.texte.aBeschleunigteKeimbildungNucleation} /></strong>
                  <p className="text-[11px] text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.dieUltrafeinenKalksteinpartikelLagern} /></p>
                </div>
                <div className="space-y-1 bg-white p-4 rounded-xl border border-home-grau/10">
                  <strong className="text-xs uppercase font-bold text-shiraz block"><MdText text={inhalt.texte.bCarboaluminatchemie} /></strong>
                  <p className="text-[11px] text-text-main/75 leading-relaxed font-normal"><MdText text={inhalt.texte.karbonationenCo32} /></p>
                </div>
              </div>
            </div>
          </div>

          {/* Microstructural and Workability Effects */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-text-main border-b border-home-grau/30 pb-3"><MdText text={inhalt.texte.physischeGefügespezifischeEffekteIm} /></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/15 space-y-2">
                <strong className="text-sm text-text-main font-bold block text-shiraz"><MdText text={inhalt.texte.t1FüllereffektFillerEffect} /></strong>
                <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.zusatzstoffeFüllenPorenräumeZwischen} /></p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/15 space-y-2">
                <strong className="text-sm text-text-main font-bold block text-shiraz"><MdText text={inhalt.texte.t2Kugellagereffekt} /></strong>
                <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.kugeligePartikelWieAus} /></p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/15 space-y-2">
                <strong className="text-sm text-text-main font-bold block text-shiraz"><MdText text={inhalt.texte.t3Reaktivitätsgefälle} /></strong>
                <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.dieModeratBeigemischtenHüttensand} /></p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/15 space-y-2">
                <strong className="text-sm text-text-main font-bold block text-shiraz"><MdText text={inhalt.texte.t4KWertKonzept} /></strong>
                <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.flugascheDarfMitDem} /></p>
              </div>
            </div>
          </div>
        </div>
      )}
        </ModuleTabs>
      </div>

      <ModulTest moduleId="bindemittel" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' },
          { title: inhalt.werte.bindemittelBaustoff, url: 'https://de.wikipedia.org/wiki/Bindemittel' },
          { title: 'Betonzusatzstoff', url: 'https://de.wikipedia.org/wiki/Betonzusatzstoffe' },
          { title: 'Alkali-Kieselsäure-Reaktion', url: 'https://de.wikipedia.org/wiki/Alkali-Kiesels%C3%A4ure-Reaktion' }
        ]}
        literatur={inhalt.daten["Bindemittel.literatur"]}
        regelwerke={inhalt.daten["Bindemittel.regelwerke"]}
        formeln={inhalt.daten["Bindemittel.formeln"]}
      />
    </div>
  );
}
