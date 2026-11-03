import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { Award, CheckCircle2, Leaf, Building, Users, Zap, Settings, ShieldCheck, Calculator, Building2, Activity, Landmark } from 'lucide-react';
import { KfnFoerderung } from './zertifizierung/KfnFoerderung';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Bar } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import inhalt from '@/content/zertifizierung/Zertifizierung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

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
    fullName: inhalt.werte.deutscheGesellschaftFürNachhaltiges,
    origin: 'Deutschland',
    focus: inhalt.werte.ganzheitlicherAnsatzÖkologieÖkonomie,
    icon: <Award className="text-blue-600" size={24} />,
    color: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-800',
    criteria: [
      { name: inhalt.werte.ökologischeQualität, weight: 22.5, icon: <Leaf size={16} /> },
      { name: inhalt.werte.ökonomischeQualität, weight: 22.5, icon: <Building size={16} /> },
      { name: inhalt.werte.soziokulturelleFunktionaleQualität, weight: 22.5, icon: <Users size={16} /> },
      { name: inhalt.werte.technischeQualität, weight: 15.0, icon: <Settings size={16} /> },
      { name: 'Prozessqualität', weight: 12.5, icon: <Zap size={16} /> },
      { name: 'Standortqualität', weight: 5.0, icon: <ShieldCheck size={16} /> }
    ],
    description: inhalt.werte.dasDgnbSystemDeutsche,
    example: inhalt.werte.einNeuerBürokomplexIn,
    link: 'https://www.dgnb.de/de/'
  },
  {
    id: 'bnb',
    name: 'BNB',
    fullName: inhalt.werte.bewertungssystemNachhaltigesBauen,
    origin: inhalt.werte.deutschlandStaatlich,
    focus: inhalt.werte.bundesbautenGanzheitlicheBewertungÄhnlic,
    icon: <Building className="text-teal-600" size={24} />,
    color: 'bg-teal-50 border-teal-200',
    textColor: 'text-teal-800',
    criteria: [
      { name: inhalt.werte.ökologischeQualität2, weight: 22.5, icon: <Leaf size={16} /> },
      { name: inhalt.werte.ökonomischeQualität2, weight: 22.5, icon: <Building size={16} /> },
      { name: inhalt.werte.soziokulturelleFunktionaleQualität2, weight: 22.5, icon: <Users size={16} /> },
      { name: inhalt.werte.technischeQualität2, weight: 22.5, icon: <Settings size={16} /> },
      { name: 'Prozessqualität', weight: 10.0, icon: <Zap size={16} /> },
      { name: 'Standortmerkmale', weight: 0.0, icon: <ShieldCheck size={16} /> }
    ],
    description: inhalt.werte.dasBnbBewertungssystemNachhaltiges,
    example: inhalt.werte.neubauEinesFinanzamtesDas,
    link: 'https://www.bnb-nachhaltigesbauen.de/'
  },
  {
    id: 'qng',
    name: 'QNG',
    fullName: inhalt.werte.qualitätssiegelNachhaltigesGebäude,
    origin: inhalt.werte.deutschlandStaatlich2,
    focus: inhalt.werte.voraussetzungFürStaatlicheFörderung,
    icon: <ShieldCheck className="text-shiraz" size={24} />,
    color: 'bg-shiraz/5 border-shiraz/20',
    textColor: 'text-shiraz',
    criteria: [
      { name: inhalt.werte.treibhausgasemissionenLca, weight: 30, icon: <Leaf size={16} /> },
      { name: inhalt.werte.primärenergiebedarfLca, weight: 20, icon: <Zap size={16} /> },
      { name: inhalt.werte.nachhaltigeMaterialgewinnung, weight: 20, icon: <Building size={16} /> },
      { name: 'Schadstoffvermeidung', weight: 15, icon: <ShieldCheck size={16} /> },
      { name: 'Barrierefreiheit', weight: 15, icon: <Users size={16} /> }
    ],
    description: inhalt.werte.dasQngQualitätssiegelNachhaltiges,
    example: inhalt.werte.eineBaugemeinschaftPlantEin,
    link: 'https://www.qng.info/'
  },
  {
    id: 'leed',
    name: 'LEED',
    fullName: inhalt.werte.leadershipInEnergyAnd,
    origin: 'USA',
    focus: inhalt.werte.energieeffizienzWasserersparnisMaterialw,
    icon: <Leaf className="text-green-600" size={24} />,
    color: 'bg-green-50 border-green-200',
    textColor: 'text-green-800',
    criteria: [
      { name: inhalt.werte.energieAtmosphäre, weight: 33, icon: <Zap size={16} /> },
      { name: inhalt.werte.standortVerkehr, weight: 16, icon: <Building size={16} /> },
      { name: 'Innenraumqualität', weight: 16, icon: <Users size={16} /> },
      { name: inhalt.werte.materialienRessourcen, weight: 13, icon: <Settings size={16} /> },
      { name: 'Wassereffizienz', weight: 11, icon: <Leaf size={16} /> },
      { name: inhalt.werte.innovationRegionalePriorität, weight: 11, icon: <Award size={16} /> }
    ],
    description: inhalt.werte.leedLeadershipInEnergy,
    example: inhalt.werte.einInternationalerInvestorLässt,
    link: 'https://www.usgbc.org/leed'
  },
  {
    id: 'breeam',
    name: 'BREEAM',
    fullName: inhalt.werte.buildingResearchEstablishmentEnvironment,
    origin: 'Großbritannien',
    focus: inhalt.werte.managementGesundheitEnergieTransport,
    icon: <Building className="text-orange-600" size={24} />,
    color: 'bg-orange-50 border-orange-200',
    textColor: 'text-orange-800',
    criteria: [
      { name: 'Energie', weight: 19, icon: <Zap size={16} /> },
      { name: inhalt.werte.gesundheitWohlbefinden, weight: 15, icon: <Users size={16} /> },
      { name: 'Materialien', weight: 12.5, icon: <Settings size={16} /> },
      { name: 'Management', weight: 12, icon: <ShieldCheck size={16} /> },
      { name: inhalt.werte.landnutzungÖkologie, weight: 10, icon: <Leaf size={16} /> },
      { name: inhalt.werte.sonstigeWasserTransportEtc, weight: 31.5, icon: <Building size={16} /> }
    ],
    description: inhalt.werte.breeamBuildingResearchEstablishment,
    example: inhalt.werte.einGroßesLogistikzentrumWird,
    link: 'https://breeam.com/'
  },
  {
    id: 'well',
    name: 'WELL',
    fullName: inhalt.werte.wellBuildingStandard,
    origin: inhalt.werte.usaInternational,
    focus: inhalt.werte.gesundheitKomfortUndWohlbefinden,
    icon: <Activity className="text-rose-600" size={24} />,
    color: 'bg-rose-50 border-rose-200',
    textColor: 'text-rose-800',
    criteria: [
      { name: inhalt.werte.luftWasser, weight: 20, icon: <Leaf size={16} /> },
      { name: inhalt.werte.ernährungLicht, weight: 20, icon: <Zap size={16} /> },
      { name: inhalt.werte.bewegungThermischerKomfort, weight: 20, icon: <Activity size={16} /> },
      { name: inhalt.werte.geistGemeinschaft, weight: 20, icon: <Users size={16} /> },
      { name: inhalt.werte.materialienInnovation, weight: 20, icon: <Settings size={16} /> }
    ],
    description: inhalt.werte.derWellBuildingStandard,
    example: inhalt.werte.dasNeueHauptquartierEines,
    link: 'https://www.wellcertified.com/'
  },
  {
    id: 'birn',
    name: 'BiRN',
    fullName: inhalt.werte.bauInstitutFürRessourceneffizientes,
    origin: 'Deutschland',
    focus: inhalt.werte.nachhaltigkeitSpeziellFürWohngebäude,
    icon: <Building2 className="text-teal-600" size={24} />,
    color: 'bg-teal-50 border-teal-200',
    textColor: 'text-teal-800',
    criteria: [
      { name: inhalt.werte.soziokulturelleFunktionaleQualität3, weight: 33.3, icon: <Users size={16} /> },
      { name: inhalt.werte.ökonomischeQualität3, weight: 33.3, icon: <Calculator size={16} /> },
      { name: inhalt.werte.ökologischeQualität3, weight: 33.3, icon: <Leaf size={16} /> }
    ],
    description: inhalt.werte.birnBauInstitutFür,
    example: inhalt.werte.fürDenBauEines,
    link: 'https://bau-irn.com/'
  }
];

export default function Zertifizierung() {
  const [activeTab, setActiveTab] = useState<'systeme' | 'beispiele' | 'kfn'>('systeme');
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
          Zertifizierungen und Förderungen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.nachhaltigkeitszertifikateDgnbLeedBreeam} /></p>
        </div>
      </div>
      
      <ReiterLeiste label="Bereiche Zertifizierung" className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button {...alsReiter(activeTab === 'systeme', 'zert-bereich', 'systeme')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'systeme' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('systeme')}
        >
          <Award size={16} /> Zertifizierungssysteme
        </button>
        <button {...alsReiter(activeTab === 'beispiele', 'zert-bereich', 'beispiele')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'beispiele' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('beispiele')}
        >
          <Activity size={16} /><MdText text={inhalt.texte.beispieleDgnbBnbQng} /></button>
        <button {...alsReiter(activeTab === 'kfn', 'zert-bereich', 'kfn')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'kfn'
              ? 'bg-shiraz text-white border-shiraz shadow-md'
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('kfn')}
        >
          <Landmark size={16} /> Förderung: Klimafreundlicher Neubau
        </button>
      </ReiterLeiste>

        {activeTab === 'kfn' && (
          <div {...reiterPanel('zert-bereich', activeTab)} className="animate-in fade-in duration-300">
            <KfnFoerderung />
          </div>
        )}

        {activeTab === 'systeme' && (
          <div {...reiterPanel('zert-bereich', activeTab)} className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.nachhaltigkeitssiegelMachenDieQualität} /></p>
            </div>

            {/* System Selector */}
            <AuswahlGruppe label="Zertifizierungssystem" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {SYSTEMS.map((system) => (
            <button {...alsOption(activeSystem === system.id)}
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
        </AuswahlGruppe>

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
                ><MdText text={inhalt.texte.offizielleWebsite} /><Award size={14} />
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
              <h4 className="font-bold text-text-main mb-4 text-sm uppercase tracking-wider"><MdText text={inhalt.texte.gewichtungDerKriterien} /></h4>
              <div className="flex-1 relative min-h-[250px]">
                <Bar 
                  data={{
                    labels: selectedSystem.criteria.map(c => c.name),
                    datasets: [{
                      label: inhalt.werte.gewichtung,
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
                        title: { display: true, text: inhalt.werte.gewichtung2 }
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
              <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.dgnbAuszeichnungsstufenGrenzwerte} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.interaktiveErprobungDerZertifizierungskl} /></p>
        </div>
            </div>

            {/* Interactive Trial Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Sliders and Inputs */}
              <div className="lg:col-span-7 bg-stone-50/50 p-5 rounded-xl border border-home-grau/30 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.gesamterfüllungsgradDgnbScore} /></span>
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
                    <div><MdText text={inhalt.texte.kein034} /></div>
                    <div><MdText text={inhalt.texte.bronze35} /></div>
                    <div><MdText text={inhalt.texte.silber50} /></div>
                    <div>Gold (65%)</div>
                    <div><MdText text={inhalt.texte.platin80} /></div>
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
                    <label htmlFor="dgnbBaukultur" className="text-xs font-bold text-text-main cursor-pointer block"><MdText text={inhalt.texte.herausragendeGestalterischeArchitektonis} /></label>
                    <span className="text-[11px] text-text-main/60 block leading-normal mt-0.5"><MdText text={inhalt.texte.voraussetzungFürDieZusatz} /></span>
                  </div>
                </div>

                {/* Educational table of limit parameters */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-text-main/40 uppercase tracking-wider block"><MdText text={inhalt.texte.übersichtAllerDgnbBewertungsstufen} /></span>
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
                      { name: 'Silber', limit: '≥ 50 %', subLimit: '≥ 35 %', cond: inhalt.werte.standardImDgnbSystem, color: 'text-stone-600 font-bold' },
                      { name: 'Bronze', limit: '≥ 35 %', subLimit: '≥ 35 %', cond: inhalt.werte.nurBestandInnenräume, color: 'text-orange-700 font-bold' },
                      { name: 'Diamant', limit: '≥ 65 %', subLimit: 'N/A', cond: inhalt.werte.herausragendeBaukultur, color: 'text-indigo-700 font-bold' },
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
                  let baseAward = inhalt.werte.keinZertifikat;
                  let minGroupRequired = '0%';
                  let bgCol = 'bg-stone-100 text-text-main/70 border-stone-300';
                  let badge = 'bg-stone-200 text-stone-700';
                  let desc = inhalt.werte.derGesamterfüllungsgradLiegtUnter;

                  if (dgnbScore >= 80) {
                    baseAward = 'Platin';
                    minGroupRequired = '65%';
                    bgCol = 'bg-slate-50 border-home-grau/30';
                    badge = 'bg-slate-600 text-white';
                    desc = inhalt.werte.höchstmöglichesDgnbLebenszyklusZertifika;
                  } else if (dgnbScore >= 65) {
                    baseAward = 'Gold';
                    minGroupRequired = '50%';
                    bgCol = 'bg-amber-50 border-amber-200';
                    badge = 'bg-amber-500 text-white';
                    desc = inhalt.werte.bestätigtEinenSehrHohen;
                  } else if (dgnbScore >= 50) {
                    baseAward = 'Silber';
                    minGroupRequired = '35%';
                    bgCol = 'bg-stone-50 border-stone-200';
                    badge = 'bg-stone-500 text-white';
                    desc = inhalt.werte.guterAusgewogenerUndNormüberschreitender;
                  } else if (dgnbScore >= 35) {
                    baseAward = 'Bronze';
                    minGroupRequired = '35%';
                    bgCol = 'bg-orange-50 border-orange-200';
                    badge = 'bg-orange-500 text-white';
                    desc = inhalt.werte.sicherungGrundlegenderÖkologischerUnd;
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
                      <span className="text-xs font-bold uppercase text-text-main/50 tracking-wider block"><MdText text={inhalt.texte.simuliertesAuszeichnungsergebnis} /></span>
                      
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
                        <span><MdText text={inhalt.texte.bronze352} /></span>
                        <span><MdText text={inhalt.texte.silber502} /></span>
                        <span>Gold (65%)</span>
                        <span><MdText text={inhalt.texte.platin802} /></span>
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
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.systembeteiligteVorgehensweiseKostenNutz} /></h3>
                <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.wichtigeInformationenFürDie} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1: Systembeteiligte */}
              <div className="bg-stone-50/50 p-5 rounded-xl border border-home-grau/15 space-y-3">
                <h4 className="font-bold text-sm text-text-main flex items-center gap-2 uppercase tracking-wider text-shiraz">
                  <Users size={16} /><MdText text={inhalt.texte.t1SystembeteiligteAkteure} /></h4>
                <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.dieErfolgreicheAbwicklungEiner} /></p>
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/10">
                    <strong className="block text-text-main"><MdText text={inhalt.texte.aDerBauherrAuftraggeber} /></strong>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block mt-0.5"><MdText text={inhalt.texte.trittAlsInitiatorUnd} /></span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/10">
                    <strong className="block text-text-main"><MdText text={inhalt.texte.bDerLizensierteAuditor} /></strong>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block mt-0.5"><MdText text={inhalt.texte.dieZentraleSchnittstelleEr} /></span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/10">
                    <strong className="block text-text-main"><MdText text={inhalt.texte.cDieZertifizierungsstelleKonformitätsprü} /></strong>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block mt-0.5"><MdText text={inhalt.texte.eineUnabhängigeZertifizierungsgesellscha} /></span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/10">
                    <strong className="block text-text-main"><MdText text={inhalt.texte.dFachplanerBauleiterProdukthersteller} /></strong>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block mt-0.5"><MdText text={inhalt.texte.zuliefererDerNachweisdatenArchitekten} /></span>
                  </div>
                </div>
              </div>

              {/* Column 2: Kosten */}
              <div className="bg-stone-50/50 p-5 rounded-xl border border-home-grau/15 space-y-3">
                <h4 className="font-bold text-sm text-text-main flex items-center gap-2 uppercase tracking-wider text-shiraz">
                  <Calculator size={16} /><MdText text={inhalt.texte.t2KostenstrukturenDerZertifizierung} /></h4>
                <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.dieMonetäreBewertungGliedert} /></p>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                    <div className="flex justify-between items-center border-b border-home-grau/10 pb-1.5 mb-1.55">
                      <span className="font-bold text-text-main"><MdText text={inhalt.texte.aZertifizierungsgebührenVergabestelle} /></span>
                      <span className="font-mono text-xs font-semibold text-shiraz"><MdText text={inhalt.texte.ca150015} /></span>
                    </div>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block"><MdText text={inhalt.texte.gebührenDieDirektAn} /></span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                    <div className="flex justify-between items-center border-b border-home-grau/10 pb-1.5 mb-1.5">
                      <span className="font-bold text-text-main"><MdText text={inhalt.texte.bHonorarFürAuditor} /></span>
                      <span className="font-mono text-xs font-semibold text-shiraz"><MdText text={inhalt.texte.ca1000045} /></span>
                    </div>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block"><MdText text={inhalt.texte.dienstleistungshonorarDesLizensiertenAud} /></span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                    <div className="flex justify-between items-center border-b border-home-grau/10 pb-1.5 mb-1.5">
                      <span className="font-bold text-text-main"><MdText text={inhalt.texte.cBaulichePlanerischeMehrkosten} /></span>
                      <span className="font-mono text-xs font-semibold text-shiraz"><MdText text={inhalt.texte.ca15Der} /></span>
                    </div>
                    <span className="text-text-main/70 text-[11px] leading-relaxed block"><MdText text={inhalt.texte.aufwendungenFürHöherwertigeBaustoffe} /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vorgehensweise (Phasen) */}
            <div className="bg-stone-50/50 p-5 rounded-xl border border-home-grau/15 space-y-4">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2 uppercase tracking-wider text-shiraz">
                <Leaf size={16} /><MdText text={inhalt.texte.t3KlassischeVorgehensweiseProzessphasen} /></h4>
              <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.dieZertifizierungIstEin} /></p>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {inhalt.daten.Zertifizierung.map((item, idx) => (
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
                <CheckCircle2 size={16} /><MdText text={inhalt.texte.t4MehrdimensionalerNutzenMehrwert} /></h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                  <strong className="block text-text-main mb-1 font-bold text-slate-800"><MdText text={inhalt.texte.finanziellerNutzen} /></strong>
                  <span className="text-text-main/70 text-[11px] leading-relaxed block"><MdText text={inhalt.texte.zwingendeVoraussetzungFürStaatliche} /></span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                  <strong className="block text-text-main mb-1 font-bold text-slate-800"><MdText text={inhalt.texte.betrieblicheOptimierung} /></strong>
                  <span className="text-text-main/70 text-[11px] leading-relaxed block"><MdText text={inhalt.texte.massivReduzierteEnergiekostenWährend} /></span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                  <strong className="block text-text-main mb-1 font-bold text-slate-800"><MdText text={inhalt.texte.ökologischeEntlastung} /></strong>
                  <span className="text-text-main/70 text-[11px] leading-relaxed block"><MdText text={inhalt.texte.gezielteAbsenkungDerCo} /></span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                  <strong className="block text-text-main mb-1 font-bold text-slate-800"><MdText text={inhalt.texte.gesundheitWohlbefinden} /></strong>
                  <span className="text-text-main/70 text-[11px] leading-relaxed block"><MdText text={inhalt.texte.nachgewieseneEinhaltungVonSchadstoff} /></span>
                </div>
              </div>
            </div>
          </div>

                </div>
        )}

        {activeTab === 'beispiele' && (
          <div {...reiterPanel('zert-bereich', activeTab)} className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Inner Sub-Tab Selector */}
            <ReiterLeiste label="Beispiele" className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
              {[
                { id: 'dgnb' as const, label: inhalt.werte.t1DgnbZertifikat, badge: inhalt.werte.privatÖffentlicherMarkt },
                { id: 'bnb' as const, label: inhalt.werte.t2BnbBewertung, badge: inhalt.werte.pflichtFürBundesbauten },
                { id: 'qng' as const, label: inhalt.werte.t3QngGütesiegel, badge: inhalt.werte.basisFürBundesförderung },
                { id: 'birn' as const, label: inhalt.werte.t4BirnBnkBng, badge: inhalt.werte.spezifischWohnungsbau }
              ].map((tab) => (
                <button {...alsReiter(beispieleSubTab === tab.id, 'zert-beispiel', tab.id)}
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
            </ReiterLeiste>

            {/* Inner Sub-Tabs Containers */}
            {beispieleSubTab === 'dgnb' && (
              <div {...reiterPanel('zert-beispiel', beispieleSubTab)} className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
                <div className="lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
                  <div className="flex justify-between items-start border-b border-home-grau/20 pb-3">
                    <div>
                      <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <Award className="text-blue-600" size={22} /><MdText text={inhalt.texte.dgnbSystemDeutscheGesellschaft} /></h3>
                      <p className="text-xs text-text-main/60 mt-0.5"><MdText text={inhalt.texte.derMarktführendeStandardIm} /></p>
                    </div>
                    <a href="https://www.dgnb.de/de" target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 shrink-0">
                      dgnb.de <Award size={12} />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 flex flex-col gap-1.5 font-sans">
                      <strong className="font-bold text-blue-900 uppercase tracking-wide text-[10px]"><MdText text={inhalt.texte.wannZielgruppe} /></strong>
                      <p className="text-text-main/80 leading-normal"><MdText text={inhalt.texte.privatwirtschaftlicheUndÖffentlicheProje} /></p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]"><MdText text={inhalt.texte.wasWirdGefordert} /></strong>
                      <p className="text-text-main/80 leading-normal"><MdText text={inhalt.texte.gleichwertigeGewichtungVonÖkologie} /></p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]">Auszeichnungsstufen</strong>
                      <ul className="text-text-main/80 space-y-1 list-disc list-inside">
                        <li><MdText text={inhalt.texte.platinGesamterfüllung80} /></li>
                        <li><MdText text={inhalt.texte.goldGesamterfüllung65} /></li>
                        <li><MdText text={inhalt.texte.silberGesamterfüllung50} /></li>
                        <li><MdText text={inhalt.texte.bronze35NurBestandsbauten} /></li>
                        <li><MdText text={inhalt.texte.diamantFürHerausragendeGestalterische} /></li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs mt-2 border-t border-home-grau/10 pt-4">
                    <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.prüfungsUndNachweisdetailsFür} /></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1"><MdText text={inhalt.texte.wasGenauIstNachzuweisen} /></strong>
                          <ul className="space-y-1 text-text-main/70 list-disc list-inside text-[11px] leading-relaxed">
                            <li><MdText text={inhalt.texte.ökobilanzierungLcaBerechnungDes} /></li>
                            <li><MdText text={inhalt.texte.lebenszykluskostenLccDynamischeRechnungs} /></li>
                            <li><MdText text={inhalt.texte.innenraumluftqualitätDurchführungVonScha} /></li>
                            <li><MdText text={inhalt.texte.demontageZirkularitätsnachweisAufschlüss} /></li>
                          </ul>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1"><MdText text={inhalt.texte.vonWemSindDie} /></strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.derLizensierteDgnbAuditor} /></p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1"><MdText text={inhalt.texte.werIstSystembeteiligtIm} /></strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.derBauherrAuftraggeberDer} /></p>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl flex flex-col gap-1.5">
                          <strong className="block text-text-main font-bold text-blue-900 border-b border-blue-100 pb-1"><MdText text={inhalt.texte.normativeGrundlagen} /></strong>
                          <span className="text-[11px] text-text-main/75 block"><MdText text={inhalt.texte.dgnbKriterienkatalogVersion2018} /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {beispieleSubTab === 'bnb' && (
              <div {...reiterPanel('zert-beispiel', beispieleSubTab)} className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
                <div className="lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
                  <div className="flex justify-between items-start border-b border-home-grau/20 pb-3">
                    <div>
                      <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <Building className="text-teal-600" size={22} /><MdText text={inhalt.texte.bnbSystemBewertungssystemNachhaltiges} /></h3>
                      <p className="text-xs text-text-main/60 mt-0.5"><MdText text={inhalt.texte.dasOffizielleNachhaltigeBewertungssystem} /></p>
                    </div>
                    <a href="https://www.bnb-nachhaltigesbauen.de/" target="_blank" rel="noreferrer" className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1 shrink-0">
                      bnb-nachhaltigesbauen.de <Award size={12} />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-100 flex flex-col gap-1.5">
                      <strong className="font-bold text-teal-900 uppercase tracking-wide text-[10px]"><MdText text={inhalt.texte.wannZielgruppe2} /></strong>
                      <p className="text-text-main/80 leading-normal"><MdText text={inhalt.texte.pflichtFürAlleBaumaßnahmen} /></p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]"><MdText text={inhalt.texte.wasWirdGefordert2} /></strong>
                      <p className="text-text-main/80 leading-normal"><MdText text={inhalt.texte.umfassenderNachhaltigkeitsansatzÜber5} /></p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]">Auszeichnungsstufen</strong>
                      <ul className="text-text-main/80 space-y-1 list-disc list-inside">
                        <li><MdText text={inhalt.texte.goldGesamterfüllung80Sehr} /></li>
                        <li><MdText text={inhalt.texte.silberGesamterfüllung65Standard} /></li>
                        <li><MdText text={inhalt.texte.bronzeGesamterfüllung50} /></li>
                        <li><MdText text={inhalt.texte.wichtigUnterschreitenEinzelnerMindesterf} /></li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs mt-2 border-t border-home-grau/10 pt-4">
                    <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.prüfungsUndNachweisdetailsFür2} /></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1"><MdText text={inhalt.texte.wasGenauIstNachzuweisen2} /></strong>
                          <ul className="space-y-1 text-text-main/70 list-disc list-inside text-[11px] leading-relaxed">
                            <li><MdText text={inhalt.texte.ökobilanzierungLcaNachBbsr} /></li>
                            <li><MdText text={inhalt.texte.wirtschaftlichkeitsberechnungLccVollstän} /></li>
                            <li><MdText text={inhalt.texte.reinigungsUndInstandhaltungsfreundlichke} /></li>
                            <li><MdText text={inhalt.texte.rückbauRecyclingfreundlichkeitDeklariere} /></li>
                          </ul>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1"><MdText text={inhalt.texte.vonWemSindDie2} /></strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.derBnbKoordinatorOft} /></p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1"><MdText text={inhalt.texte.werIstSystembeteiligtIm2} /></strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.derBundAlsBauherr} /></p>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl flex flex-col gap-1.5">
                          <strong className="block text-text-main font-bold text-teal-900 border-b border-teal-100 pb-1"><MdText text={inhalt.texte.normativeGrundlagen2} /></strong>
                          <span className="text-[11px] text-text-main/75 block"><MdText text={inhalt.texte.leitfadenNachhaltigesBauenDes} /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {beispieleSubTab === 'qng' && (
              <div {...reiterPanel('zert-beispiel', beispieleSubTab)} className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
                <div className="lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
                  <div className="flex justify-between items-start border-b border-home-grau/20 pb-3">
                    <div>
                      <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <CheckCircle2 className="text-shiraz" size={22} /><MdText text={inhalt.texte.qngQualitätssiegelNachhaltigesGebäude} /></h3>
                      <p className="text-xs text-text-main/60 mt-0.5"><MdText text={inhalt.texte.dasObligatorischeStaatlicheGütesiegel} /></p>
                    </div>
                    <a href="https://www.qng.info" target="_blank" rel="noreferrer" className="text-xs font-bold text-shiraz hover:underline flex items-center gap-1 shrink-0">
                      qng.info <Award size={12} />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    <div className="p-4 bg-shiraz/5 rounded-xl border border-shiraz/10 flex flex-col gap-1.5">
                      <strong className="font-bold text-shiraz uppercase tracking-wide text-[10px]"><MdText text={inhalt.texte.wannZielgruppe3} /></strong>
                      <p className="text-text-main/80 leading-normal"><MdText text={inhalt.texte.privateBauherrenGenossenschaftenKommunen} /></p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]"><MdText text={inhalt.texte.wasWirdGefordert3} /></strong>
                      <p className="text-text-main/80 leading-normal"><MdText text={inhalt.texte.esIstKeinEigenständiges} /></p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]"><MdText text={inhalt.texte.auszeichnungsstufenSiegel} /></strong>
                      <ul className="text-text-main/80 space-y-1.5">
                        <li><MdText text={inhalt.texte.qngPlusStandardErfüllung} /></li>
                        <li><MdText text={inhalt.texte.qngPremiumExzellentVerschärfte} /></li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs mt-2 border-t border-home-grau/10 pt-4">
                    <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.prüfungsUndNachweisdetailsFür3} /></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1"><MdText text={inhalt.texte.wasGenauIstNachzuweisen3} /></strong>
                          <ul className="space-y-1 text-text-main/70 list-disc list-inside text-[11px] leading-relaxed">
                            <li><MdText text={inhalt.texte.schadstoffmatrixQngAnhang4} /></li>
                            <li><MdText text={inhalt.texte.nachhaltigeHolzbeschaffungMindestens80} /></li>
                            <li><MdText text={inhalt.texte.lüftungskonzeptSommerlicherWärmeschutzNa} /></li>
                          </ul>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1"><MdText text={inhalt.texte.vonWemSindDie3} /></strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.derQngAuditorFührt} /></p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1"><MdText text={inhalt.texte.werIstSystembeteiligtIm3} /></strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.derBauherrKreditnehmerDer} /></p>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl flex flex-col gap-1.5">
                          <strong className="block text-text-main font-bold text-shiraz border-b border-rose-100 pb-1"><MdText text={inhalt.texte.normativeGrundlagen3} /></strong>
                          <span className="text-[11px] text-text-main/75 block"><MdText text={inhalt.texte.qngHandbuchAktuelleVersion} /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {beispieleSubTab === 'birn' && (
              <div {...reiterPanel('zert-beispiel', beispieleSubTab)} className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
                <div className="lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
                  <div className="flex justify-between items-start border-b border-home-grau/20 pb-3">
                    <div>
                      <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <Building2 className="text-teal-600" size={22} /><MdText text={inhalt.texte.birnSystemBauInstitut} /></h3>
                      <p className="text-xs text-text-main/60 mt-0.5"><MdText text={inhalt.texte.spezialisierteNachhaltigkeitsbewertungIm} /></p>
                    </div>
                    <a href="https://bau-irn.com" target="_blank" rel="noreferrer" className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1 shrink-0">
                      bau-irn.com <Award size={12} />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-100 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-teal-900 uppercase tracking-wide text-[10px]"><MdText text={inhalt.texte.wannZielgruppe4} /></strong>
                      <p className="text-text-main/80 leading-normal"><MdText text={inhalt.texte.privateHausbauerEinfamilienhäuserDoppelh} /></p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]"><MdText text={inhalt.texte.wasWirdGefordert4} /></strong>
                      <p className="text-text-main/80 leading-normal"><MdText text={inhalt.texte.schlankerFokussierterKriterienkatalogDer} /></p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/15 flex flex-col gap-1.5 flex-1">
                      <strong className="font-bold text-text-main/80 uppercase tracking-wide text-[10px]">Auszeichnungsstufen</strong>
                      <ul className="text-text-main/80 space-y-1 list-disc list-inside">
                        <li><MdText text={inhalt.texte.exzellentGesamterfüllung80Inkl} /></li>
                        <li><MdText text={inhalt.texte.sehrGutGesamterfüllung65} /></li>
                        <li><MdText text={inhalt.texte.gutGesamterfüllung50} /></li>
                        <li><MdText text={inhalt.texte.bietetVereinfachteBerechnungsassistenten} /></li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs mt-2 border-t border-home-grau/10 pt-4">
                    <h4 className="font-bold text-text-main text-sm"><MdText text={inhalt.texte.prüfungsUndNachweisdetailsFür4} /></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1"><MdText text={inhalt.texte.wasGenauIstNachzuweisen4} /></strong>
                          <ul className="space-y-1 text-text-main/70 list-disc list-inside text-[11px] leading-relaxed">
                            <li><MdText text={inhalt.texte.ökobilanzLcaVereinfachteBerechnung} /></li>
                            <li><MdText text={inhalt.texte.schadstoffüberwachungImWohnbauSicherheit} /></li>
                            <li><MdText text={inhalt.texte.nutzungNachwachsenderRohstoffeNawaro} /></li>
                          </ul>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1"><MdText text={inhalt.texte.vonWemSindDie4} /></strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.derLizensierteBnkBng} /></p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl">
                          <strong className="block text-text-main font-bold mb-1"><MdText text={inhalt.texte.werIstSystembeteiligtIm4} /></strong>
                          <p className="text-text-main/70 text-[11px] leading-relaxed"><MdText text={inhalt.texte.dieBaufamilieBauherrDer} /></p>
                        </div>
                        <div className="p-3 bg-white border border-home-grau/15 rounded-xl flex flex-col gap-1.5">
                          <strong className="block text-text-main font-bold text-teal-900 border-b border-teal-100 pb-1"><MdText text={inhalt.texte.normativeGrundlagen4} /></strong>
                          <span className="text-[11px] text-text-main/75 block"><MdText text={inhalt.texte.bnkVersion20} /></span>
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
        <h3 className="text-lg font-bold text-text-main mb-4"><MdText text={inhalt.texte.warumZertifizieren} /></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <CheckCircle2 className="text-shiraz shrink-0" size={20} />
            <div>
              <h4 className="font-bold text-text-main text-sm mb-1">Qualitätssicherung</h4>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.derZertifizierungsprozessZwingtAlle} /></p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="text-shiraz shrink-0" size={20} />
            <div>
              <h4 className="font-bold text-text-main text-sm mb-1">Wertsteigerung</h4>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.zertifizierteGebäudeErzielenOft} /></p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="text-shiraz shrink-0" size={20} />
            <div>
              <h4 className="font-bold text-text-main text-sm mb-1"><MdText text={inhalt.texte.förderungenZBQng} /></h4>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.inDeutschlandIstDas} /></p>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Zertifizierung', url: 'https://de.wikipedia.org/wiki/Zertifizierung' },
          { title: inhalt.werte.deutscheGesellschaftFürNachhaltiges2, url: 'https://de.wikipedia.org/wiki/Deutsche_Gesellschaft_f%C3%BCr_Nachhaltiges_Bauen' },
          { title: inhalt.werte.leadershipInEnergyAnd2, url: 'https://de.wikipedia.org/wiki/Leadership_in_Energy_and_Environmental_Design' }
        ]}
        literatur={inhalt.daten["Zertifizierung.literatur"]}
        regelwerke={inhalt.daten["Zertifizierung.regelwerke"]}
        formeln={inhalt.daten["Zertifizierung.formeln"]}
      />
    </div>
  );
} 