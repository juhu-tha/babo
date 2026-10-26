import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { FlaskConical, Droplets, ShieldAlert, Activity, Paintbrush, Shield, Snowflake, ArrowRight, AlertTriangle, Sliders, Sparkles, Paperclip } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Slider } from '@/src/components/ui/Slider';
import { Line } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { BlockMath, InlineMath } from 'react-katex';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import inhalt from '@/content/bauchemie/Bauchemie.json';
import { MdText } from '@/src/components/inhalt/MdText';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Bauchemie: React.FC = () => {
  const [activeTab, setActiveTab ] = useState<'grundlagen' | 'zusatzmittel' | 'angriffe' | 'salze' | 'oberflaechenschutz' | 'korrosionsschutz' | 'kleben_dichten'>('grundlagen');

  // Korrosion State (AKR)
  const [alkaliContent, setAlkaliContent] = useState(3.0); // kg/m3
  const [moisture, setMoisture] = useState(80); // %

  // Stellmittel & Rheologie State
  const [stellmittelConc, setStellmittelConc] = useState(0.8); // in % (0.0 to 2.0%)
  const [currentShear, setCurrentShear] = useState(15.0); // in s^-1 (Scherrate)

  // Dynamic Rheology Simulator calculations
  const rheologyResults = useMemo(() => {
    const shearRates = [0.1, 1, 5, 10, 20, 30, 50, 70, 90, 100];
    
    // Viscosity model with Stellmittel: base viscosity is 1.5, added viscosity decays with shear rate (shear-thinning)
    const viscosityWithStellmittel = shearRates.map(s => {
      const added = stellmittelConc * 90 / (Math.pow(s, 0.72) + 0.25);
      return Math.round((1.5 + added) * 10) / 10;
    });

    const viscosityWithoutStellmittel = shearRates.map(() => 2.0); // Simple Newtonian slurry

    // Current viscosity based on currentShear slider
    const currentAdded = stellmittelConc * 90 / (Math.pow(currentShear, 0.72) + 0.25);
    const currentViscosity = Math.round((1.5 + currentAdded) * 10) / 10;

    // Evaluate application state
    let stateMessage = "";
    let stateColor = "";
    let statusClass = "";

    if (currentShear < 5) {
      // RESTING STATE (Standfestigkeit)
      if (stellmittelConc < 0.4) {
        stateMessage = inhalt.werte.flieseRutschtAbPutz;
        stateColor = "text-rose-700 bg-rose-50 border-rose-200 shadow-rose-100";
        statusClass = inhalt.werte.kritischesAbrutschen;
      } else if (stellmittelConc >= 0.4 && stellmittelConc <= 1.5) {
        stateMessage = inhalt.werte.hervorragendeStandfestigkeitDasStellmitt;
        stateColor = "text-emerald-700 bg-emerald-50 border-emerald-200 shadow-emerald-100";
        statusClass = inhalt.werte.sichererStand;
      } else {
        stateMessage = inhalt.werte.übersteiftDerMörtelHat;
        stateColor = "text-amber-700 bg-amber-50 border-amber-200 shadow-amber-100";
        statusClass = "Überdosiert!";
      }
    } else {
      // SHEARING STATE (Verarbeitung unter Kraftaufwand)
      const forceRequired = currentViscosity > 15 ? "hoch (" + formatDeZahl(currentViscosity, 1) + " Pa·s)" : currentViscosity < 4 ? "sehr leicht (" + formatDeZahl(currentViscosity, 1) + " Pa·s)" : "optimal (" + formatDeZahl(currentViscosity, 1) + " Pa·s)";
      if (stellmittelConc < 0.4) {
        stateMessage = inhalt.werte.sehrLeichtzügigVerliertBeim;
        stateColor = "text-blue-700 bg-blue-50 border-blue-200 shadow-blue-100";
        statusClass = inhalt.werte.keineZahnung;
      } else if (stellmittelConc >= 0.4 && stellmittelConc <= 1.5) {
        stateMessage = `Sehr gute Scherentzähung! Das Verstreichen geht leicht von der Hand (${forceRequired}). Kellensteg steht perfekt.`;
        stateColor = "text-emerald-700 bg-emerald-50 border-emerald-200 shadow-emerald-100";
        statusClass = inhalt.werte.perfekteVerarbeitung;
      } else {
        stateMessage = `Scherverdünnung unzureichend! Der Kraftaufwand beim Aufziehen ist sehr hoch, Viskosität ${forceRequired}. Schwer verarbeitbar.`;
        stateColor = "text-amber-700 bg-amber-50 border-amber-200 shadow-amber-100";
        statusClass = "Sehr zäh!";
      }
    }

    return {
      shearRates,
      viscosityWithStellmittel,
      viscosityWithoutStellmittel,
      currentViscosity,
      stateMessage,
      stateColor,
      statusClass
    };
  }, [stellmittelConc, currentShear]);

  const rheologyChartData = {
    labels: rheologyResults.shearRates.map(s => `${formatDeWert(s)} s⁻¹`),
    datasets: [
      {
        label: inhalt.werte.mörtelMitRheologieStellmittel,
        data: rheologyResults.viscosityWithStellmittel,
        borderColor: '#881235',
        backgroundColor: 'rgba(153, 27, 27, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: inhalt.werte.referenzSlurryOhneStellmittel,
        data: rheologyResults.viscosityWithoutStellmittel,
        borderColor: '#475569',
        borderDash: [5, 5],
        tension: 0,
        fill: false,
      }
    ]
  };

  const akrData = {
    labels: Array.from({ length: 20 }, (_, i) => i + 1),
    datasets: [
      {
        label: inhalt.werte.dehnungDurchAkrMm,
        data: Array.from({ length: 20 }, (_, i) => {
          const t = i + 1;
          // Simplified AKR expansion model
          const k = (alkaliContent / 5) * (moisture > 80 ? (moisture / 100) : 0.1);
          return k * Math.log(t + 1);
        }),
        borderColor: '#A3113E',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const karbonatisierungData = {
    labels: [0, 5, 10, 25, 50, 100],
    datasets: [
      { label: inhalt.werte.wZ060, data: [0, 5, 10, 25, 50, 100].map(t => 4 * Math.sqrt(t)), borderColor: '#A3113E', tension: 0.4 },
      { label: inhalt.werte.wZ050, data: [0, 5, 10, 25, 50, 100].map(t => 2 * Math.sqrt(t)), borderColor: '#64748b', tension: 0.4 },
      { label: inhalt.werte.wZ040, data: [0, 5, 10, 25, 50, 100].map(t => 0.5 * Math.sqrt(t)), borderColor: '#475569', tension: 0.4 },
    ]
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <FlaskConical className="text-shiraz" /> Bauchemie
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieBauchemieBefasstSich} /></p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button aria-pressed={activeTab === 'grundlagen'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'grundlagen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('grundlagen')}
          >
            <Activity size={16} /><MdText text={inhalt.texte.chemischeGrundlagen} /></button>
          <button aria-pressed={activeTab === 'zusatzmittel'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zusatzmittel' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zusatzmittel')}
          >
            <Droplets size={16} /> Betonzusatzmittel
          </button>
          <button aria-pressed={activeTab === 'angriffe'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'angriffe' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('angriffe')}
          >
            <ShieldAlert size={16} /><MdText text={inhalt.texte.chemischeAngriffe} /></button>
          <button aria-pressed={activeTab === 'salze'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'salze' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('salze')}
          >
            <Snowflake size={16} /><MdText text={inhalt.texte.bauschädlicheSalze} /></button>
          <button aria-pressed={activeTab === 'oberflaechenschutz'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'oberflaechenschutz' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('oberflaechenschutz')}
          >
            <Paintbrush size={16} /> Oberflächenschutz
          </button>
          <button aria-pressed={activeTab === 'korrosionsschutz'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'korrosionsschutz' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('korrosionsschutz')}
          >
            <Shield size={16} /> Korrosionsschutz
          </button>
          <button aria-pressed={activeTab === 'kleben_dichten'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'kleben_dichten' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('kleben_dichten')}
          >
            <Paperclip size={16} /><MdText text={inhalt.texte.klebenDichtenGrundlagen} /></button>
        </div>
      </div>

      {activeTab === 'grundlagen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.bindungsartenImBauwesen} /></h3>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.dieEigenschaftenVonBaustoffen} /></p>
              <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
                <li><MdText text={inhalt.texte.ionenbindungSalzbindungElektrostatischeA} /></li>
                <li><MdText text={inhalt.texte.atombindungKovalenteBindungGemeinsame} /></li>
                <li><MdText text={inhalt.texte.metallischeBindungAtomrümpfePositive} /></li>
                <li><MdText text={inhalt.texte.intermolekulareKräfteVanDer} /></li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.phWertPassivierung} /></h3>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.derPhWertIst} /></p>
              <div className="bg-off-white p-4 rounded-lg border border-home-grau/30 text-center">
                <BlockMath math="pH = -\log_{10}(a_{H^+})" />
              </div>
              
              <div className="mt-2">
                <h4 className="font-bold text-sm text-text-main mb-2"><MdText text={inhalt.texte.phSkalaBeton} /></h4>
                <div className="relative h-12 w-full rounded-full overflow-hidden flex text-xs font-bold text-white shadow-inner">
                  <div className="bg-torch-red flex items-center justify-center" style={{ width: '42.8%' }}><MdText text={inhalt.texte.säureangriffPh6} /></div>
                  <div className="bg-amber-500 flex items-center justify-center" style={{ width: '21.4%' }}><MdText text={inhalt.texte.karbonatisiertPh69} /></div>
                  <div className="bg-emerald-500 flex items-center justify-center" style={{ width: '35.8%' }}><MdText text={inhalt.texte.alkalischPh9Passivschicht} /></div>
                </div>
                <div className="flex justify-between text-xs text-text-main/60 mt-1 px-2">
                  <span>0</span>
                  <span>6</span>
                  <span>9</span>
                  <span>14</span>
                </div>
              </div>

              <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2 mt-2">
                <li><MdText text={inhalt.texte.porenlösungDurchGelösteAlkalihydroxide} /></li>
                <li><MdText text={inhalt.texte.passivierungInDiesemHochalkalischen} /></li>
                <li><MdText text={inhalt.texte.depassivierungSinktDerPh} /></li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.thermischeGefügebildungDieSinterung} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.beimSinternVerdichtenSich} /></p>
              <div className="space-y-3 text-xs text-text-main/80">
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.t1ZementklinkerSinterung1450} /></span>
                  <p className="leading-relaxed"><MdText text={inhalt.texte.imIndustriellenDrehrohrofenErreicht} /><span className="block font-mono font-bold mt-1 text-slate-700"><MdText text={inhalt.texte.alitCSTricalciumsilicat} /></span>
                  </p>
                </div>
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.t2TonkeramikZiegelsinterung900} /></span>
                  <p className="leading-relaxed"><MdText text={inhalt.texte.beimZiegelbrandWirdZunächst} /></p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.dasRückgratDesMassivbaus} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.trifftZementAufAnmachwasser} /></p>
              
              <div className="bg-off-white p-3 rounded-lg border border-home-grau/30 text-center text-xs">
                <span className="font-bold block mb-1 text-slate-700"><MdText text={inhalt.texte.vereinfachteHydratationsformelVonAlit} /></span>
                <BlockMath math="2\ Ca_3SiO_5 + 6\ H_2O \rightarrow 3\ CaO \cdot 2\ SiO_2 \cdot 3\ H_2O + 3\ Ca(OH)_2" />
                <span className="text-[10px] text-text-main/60 block mt-1"><MdText text={inhalt.texte.ausAlitEntstehtCsh} /></span>
              </div>

              <div className="space-y-2 text-xs text-text-main/80">
                <div className="p-3.5 bg-[#fcf8f2] rounded-xl border border-stone-200/50">
                  <h4 className="font-bold text-[#A3113E] uppercase tracking-wide text-[10px] mb-1 font-mono"><MdText text={inhalt.texte.dieGelPorenArchitektur} /></h4>
                  <p className="leading-relaxed"><MdText text={inhalt.texte.cshGeleBildenEine} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'zusatzmittel' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.verflüssigendeZusatzmittel} /></h3>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.dieseZusatzmittelReduzierenDen} /></p>
              <ul className="list-disc list-inside text-sm text-text-main/80 space-y-4">
                <li><MdText text={inhalt.texte.betonverflüssigerBvBrChemie} /></li>
                <li><MdText text={inhalt.texte.fließmittelFmBrChemie} /></li>
              </ul>

              <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <h4 className="text-[10px] font-bold mb-4 text-center"><MdText text={inhalt.texte.elektrostatischeAbstoßungBv} /></h4>
                  <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 rounded-full bg-home-grau/40 flex items-center justify-center relative border-2 border-dashed border-torch-red">
                      <span className="absolute -top-3 text-torch-red font-bold">-</span>
                      <span className="absolute -bottom-3 text-torch-red font-bold">-</span>
                      <span className="absolute -left-3 text-torch-red font-bold">-</span>
                      <span className="absolute -right-3 text-torch-red font-bold">-</span>
                    </div>
                    <div className="flex items-center text-torch-red font-bold">↔</div>
                    <div className="w-10 h-10 rounded-full bg-home-grau/40 flex items-center justify-center relative border-2 border-dashed border-torch-red">
                      <span className="absolute -top-3 text-torch-red font-bold">-</span>
                      <span className="absolute -bottom-3 text-torch-red font-bold">-</span>
                      <span className="absolute -left-3 text-torch-red font-bold">-</span>
                      <span className="absolute -right-3 text-torch-red font-bold">-</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="text-[10px] font-bold mb-4 text-center"><MdText text={inhalt.texte.sterischeHinderungPce} /></h4>
                  <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 rounded-full bg-home-grau/40 flex items-center justify-center relative">
                      <div className="absolute -top-3 -right-3 text-shiraz font-bold">〰</div>
                      <div className="absolute -bottom-3 -left-3 text-shiraz font-bold">〰</div>
                      <div className="absolute top-0 -left-4 text-shiraz font-bold">〰</div>
                    </div>
                    <div className="flex items-center text-shiraz font-bold">↔</div>
                    <div className="w-10 h-10 rounded-full bg-home-grau/40 flex items-center justify-center relative">
                      <div className="absolute -top-3 -left-3 text-shiraz font-bold">〰</div>
                      <div className="absolute -bottom-3 -right-3 text-shiraz font-bold">〰</div>
                      <div className="absolute top-0 -right-4 text-shiraz font-bold">〰</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.weitereWichtigeZusatzmittel} /></h3>
              <ul className="list-disc list-inside text-sm text-text-main/80 space-y-4">
                <li><MdText text={inhalt.texte.luftporenbildnerLpBrChemie} /></li>
                <li><MdText text={inhalt.texte.verzögererVzBrChemie} /></li>
                <li><MdText text={inhalt.texte.beschleunigerBeBrChemie} /></li>
                <li><MdText text={inhalt.texte.dichtungsmittelDmBrChemie} /></li>
                <li><MdText text={inhalt.texte.schwindreduziererSraBrChemie} /></li>
              </ul>
            </div>
          </div>

          {/* Spezial-Bauchemie: Stellmittel & Trockenmörtel-Additive */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <Sparkles className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.spezialBauchemieMörtelPutz} /></h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.imVergleichZuStandardkonstruktionen} /></p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <span className="font-bold text-sm text-shiraz"><MdText text={inhalt.texte.t1StellmittelRheologieadditiveThixotropie} /></span>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.hauptvertreterPyrogeneKieselsäurenAerosi} /><span className="block my-1" /><MdText text={inhalt.texte.wirkungsweiseDieseHochdispersenPartikel} /></p>
              </div>
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <span className="font-bold text-sm text-shiraz"><MdText text={inhalt.texte.t2WasserrückhaltemittelVerdickungsmittel} /></span>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.hauptvertreterCelluloseetherMhecMethylhy} /><span className="block my-1" /><MdText text={inhalt.texte.wirkungsweiseQuellfähigePolysaccharidder} /></p>
              </div>
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <span className="font-bold text-sm text-shiraz"><MdText text={inhalt.texte.t3RedispergierbaresKunststoffpulverDisper} /></span>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.hauptvertreterCopolymereAufBasis} /><span className="block my-1" /><MdText text={inhalt.texte.wirkungsweiseDiesesSprühgetrocknetePolym} /></p>
              </div>
            </div>
          </div>

          {/* Rheologie-Additiv-Simulator */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <div className="border-b border-home-grau/30 pb-2 flex flex-col gap-1">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Sliders className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.rheologieAdditivSimulatorStrukturviskosi} /></h3>
              <p className="text-xs text-text-main/60"><MdText text={inhalt.texte.experimentierenSieMitDer} /></p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Controls Column */}
              <div className="lg:col-span-5 flex flex-col gap-5 bg-off-white p-4 rounded-xl border border-home-grau/20">
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-text-main flex items-center justify-between">
                    <span><MdText text={inhalt.texte.stellmittelKonzentrationZB} /></span>
                    <span className="text-shiraz font-mono font-bold text-sm">{formatDeZahl(stellmittelConc, 1)} %</span>
                  </h4>
                  <p className="text-[11px] text-text-main/60 leading-normal"><MdText text={inhalt.texte.erhöhtDieViskositätIm} /></p>
                  <input 
                    type="range"
                    min="0.0"
                    max="2.0"
                    step="0.1"
                    value={stellmittelConc}
                    onChange={(e) => setStellmittelConc(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <div className="flex justify-between text-[10px] text-text-main/40 font-mono">
                    <span><MdText text={inhalt.texte.t00FlüssigeSuppe} /></span>
                    <span><MdText text={inhalt.texte.t10Standfest} /></span>
                    <span><MdText text={inhalt.texte.t20Übersteift} /></span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-text-main flex items-center justify-between">
                    <span><MdText text={inhalt.texte.auswirkendeScherrateEinwirkkraft} /></span>
                    <span className="text-shiraz font-mono font-bold text-sm">{formatDeZahl(currentShear, 0)} s⁻¹</span>
                  </h4>
                  <p className="text-[11px] text-text-main/60 leading-normal"><MdText text={inhalt.texte.scherrateSimuliertÄußereKräfte} /></p>
                  <input 
                    type="range"
                    min="0.1"
                    max="100.0"
                    step="1.0"
                    value={currentShear}
                    onChange={(e) => setCurrentShear(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <div className="flex justify-between text-[10px] text-text-main/40 font-mono">
                    <span><MdText text={inhalt.texte.t01Stillstand} /></span>
                    <span>50 (Rühren)</span>
                    <span><MdText text={inhalt.texte.t100Kellenaufzug} /></span>
                  </div>
                </div>

                {/* Status Indicator Panel */}
                <div className={`p-4 rounded-lg border flex flex-col gap-1 shadow-sm transition-all duration-300 ${rheologyResults.stateColor}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider">Status: {rheologyResults.statusClass}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white shadow-sm">
                      {currentShear < 5 ? "Ruhezustand" : "Scherspannung"}
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed">
                    {rheologyResults.stateMessage}
                  </p>
                  <div className="text-[11px] font-mono mt-2 pt-2 border-t border-current/10 flex justify-between">
                    <span><MdText text={inhalt.texte.wirksameViskosität} /></span>
                    <span className="font-bold">{formatDeZahl(rheologyResults.currentViscosity, 1)} Pa·s</span>
                  </div>
                </div>
              </div>

              {/* Chart Column */}
              <div className="lg:col-span-7 flex flex-col gap-2">
                <h4 className="text-xs font-bold text-text-main/70 uppercase tracking-wider font-mono"><MdText text={inhalt.texte.viskositätsverlaufInAbhängigkeitVon} /></h4>
                <div className="h-[280px] bg-off-white p-3 border border-home-grau/20 rounded-xl relative">
                  <Line 
                    data={rheologyChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: { display: true, text: inhalt.werte.scherrateS, font: { size: 10, weight: 'bold' } },
                          grid: { color: 'rgba(0,0,0,0.03)' }
                        },
                        y: {
                          title: { display: true, text: inhalt.werte.viskositätPaS, font: { size: 10, weight: 'bold' } },
                          min: 0,
                          max: Math.max(10, Math.ceil(Math.max(...rheologyResults.viscosityWithStellmittel) / 10) * 10),
                          grid: { color: 'rgba(0,0,0,0.03)' }
                        }
                      },
                      plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
                      }
                    }}
                  />
                  {/* Highlight current state marker */}
                  <div className="absolute top-4 right-4 bg-white/95 border border-home-grau/30 shadow-sm rounded-lg px-2 py-1 text-[10px] font-mono flex flex-col gap-0.5">
                    <div>γ = {formatDeZahl(currentShear, 0)} s⁻¹</div>
                    <div className="font-bold text-shiraz">η ≈ {formatDeZahl(rheologyResults.currentViscosity, 1)} Pa·s</div>
                  </div>
                </div>
                <p className="text-[10px] text-text-main/50 italic leading-normal text-center select-none"><MdText text={inhalt.texte.hinweisPseudoplastischesScherentzähendes} /></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'angriffe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.lösendeAngriffe} /></h3>
            
            <h4 className="font-bold text-shiraz mt-2">Säureangriff</h4>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.säurenReagierenMitDen} /></p>
            <div className="bg-off-white p-2 rounded-lg border border-home-grau/30 text-center mb-2">
              <BlockMath math="Ca(OH)_2 + 2 HCl \rightarrow CaCl_2 + 2 H_2O" />
            </div>
            <p className="text-xs text-text-main/80 mb-4"><MdText text={inhalt.texte.beispielSalzsäureLöstPortlandit} /></p>

            <h4 className="font-bold text-shiraz mt-2"><MdText text={inhalt.texte.weichesWasserKohlensäureangriff} /></h4>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.kalklösendeKohlensäureÜberschüssigesCo} /></p>
            <div className="bg-off-white p-2 rounded-lg border border-home-grau/30 text-center mb-2">
              <BlockMath math="CaCO_3 + CO_2 + H_2O \rightleftharpoons Ca(HCO_3)_2" />
            </div>
            <p className="text-xs text-text-main/80"><MdText text={inhalt.texte.dieserProzessFührtZur} /></p>

            <h4 className="font-bold text-shiraz mt-4">Karbonatisierung</h4>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.kohlendioxidAusDerLuft} /></p>
            <div className="bg-off-white p-2 rounded-lg border border-home-grau/30 text-center mb-2">
              <BlockMath math="Ca(OH)_2 + CO_2 \rightarrow CaCO_3 + H_2O" />
            </div>
            <div className="mt-2 border border-home-grau/30 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-sm text-text-main mb-2"><MdText text={inhalt.texte.karbonatisierungstiefeDKK} /></h4>
              <div className="h-40 w-full">
                <Line 
                  data={karbonatisierungData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { title: { display: true, text: inhalt.werte.tiefeDKMm } },
                      x: { title: { display: true, text: inhalt.werte.zeitTJahre } }
                    },
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.treibendeAngriffe} /></h3>
            
            <h4 className="font-bold text-shiraz mt-2">Sulfattreiben</h4>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.sulfationenAusBodenOder} /></p>

            <h4 className="font-bold text-shiraz mt-4"><MdText text={inhalt.texte.alkaliKieselsäureReaktionAkr} /></h4>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.reaktionZwischenAlkalihydroxidenNa} /></p>
            <div className="space-y-4 mt-2">
              <Slider 
                label={inhalt.werte.alkaligehaltNaOÄquivalent}
                info={inhalt.werte.alkaligehaltNaOÄquivalent2}
                min={1.0} max={5.0} step={0.1}
                value={alkaliContent} unit="kg/m³"
                onChange={(e) => setAlkaliContent(Number(e.target.value))}
              />
              <Slider 
                label="Feuchtigkeit"
                info={inhalt.werte.feuchtigkeitParameter}
                min={50} max={100} step={5}
                value={moisture} unit="%"
                onChange={(e) => setMoisture(Number(e.target.value))}
              />
            </div>
            <div className="h-[200px] relative mt-4">
              <Line 
                data={akrData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { title: { display: true, text: inhalt.werte.zeitJahre } },
                    y: { title: { display: true, text: inhalt.werte.dehnungMmM }, min: 0, max: 5 }
                  },
                  plugins: { legend: { position: 'top' } }
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'salze' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.herkunftUndArten} /></h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.leichtLöslicheSalzeWerden} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><MdText text={inhalt.texte.chlorideTausalzMeerwasserSehr} /></li>
              <li><MdText text={inhalt.texte.nitrateFäkalienLandwirtschaftEbenfalls} /></li>
              <li><MdText text={inhalt.texte.sulfateGipsSaurerRegen} /></li>
            </ul>

            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white flex flex-col items-center">
              <h4 className="text-sm font-bold mb-4 text-center"><MdText text={inhalt.texte.kristallisationsdruckInDerPore} /></h4>
              <div className="relative w-32 h-32 bg-home-grau/20 rounded-full flex items-center justify-center overflow-hidden border-4 border-home-grau">
                <div className="absolute inset-0 border-[8px] border-home-grau rounded-full"></div>
                <div className="w-20 h-20 bg-white/90 border-2 border-blue-300 rotate-45 flex items-center justify-center shadow-lg relative">
                   <ArrowRight className="text-torch-red absolute -top-5 -right-5 rotate-[-45deg]" size={20}/>
                   <ArrowRight className="text-torch-red absolute -bottom-5 -left-5 rotate-[135deg]" size={20}/>
                   <span className="text-[10px] font-bold text-blue-800 -rotate-45">Salzkristall</span>
                </div>
              </div>
              <span className="text-xs mt-4 text-text-main/80 font-medium text-center"><MdText text={inhalt.texte.wachsenderSalzkristallSprengtDas} /></span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.schädigungsmechanismenSanierung} /></h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.dieSchädigungErfolgtPrimär} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><MdText text={inhalt.texte.kristallisationsdruckSalzeKristallisiere} /></li>
              <li><MdText text={inhalt.texte.hydratationsdruckSalzeNehmenKristallwass} /></li>
              <li><MdText text={inhalt.texte.hygroskopizitätSalzeNehmenFeuchtigkeit} /></li>
            </ul>
            <div className="mt-2 p-4 bg-off-white rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-sm mb-2">Sanierungsansätze</h4>
              <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.sanierputzsystemeWtaMerkblatt2} /></p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'oberflaechenschutz' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Hydrophobierung</h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.eineWasserabweisendeHydrophobeAusrüstung} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
              <li><MdText text={inhalt.texte.wirkstoffeSilaneSiloxaneSiliconharze} /></li>
              <li><MdText text={inhalt.texte.wirkprinzipDieMoleküleDringen} /></li>
              <li><MdText text={inhalt.texte.anwendungSchlagregenschutzFürFassaden} /></li>
            </ul>

            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white flex justify-around items-end h-32">
               <div className="flex flex-col items-center">
                 <div className="relative w-20 h-10 border-b-4 border-home-grau flex items-end justify-center">
                    <div className="w-16 h-4 bg-blue-400/80 rounded-t-full" style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}></div>
                 </div>
                 <span className="text-[10px] mt-2 font-bold text-text-main"><MdText text={inhalt.texte.unbehandelt90} /></span>
               </div>
               <div className="flex flex-col items-center">
                 <div className="relative w-20 h-10 border-b-4 border-home-grau flex items-end justify-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full mb-[-4px] shadow-sm"></div>
                 </div>
                 <span className="text-[10px] mt-2 font-bold text-text-main"><MdText text={inhalt.texte.hydrophobiert90} /></span>
               </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Imprägnierung</h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.porenfüllendeBehandlungZurVerfestigung} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
              <li><MdText text={inhalt.texte.wirkstoffeNiedrigviskoseEpoxidharzeEp} /></li>
              <li><MdText text={inhalt.texte.wirkprinzipDasHarzDringt} /></li>
              <li><MdText text={inhalt.texte.anwendungStaubbindungAufIndustrieböden} /></li>
            </ul>
            
            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white flex justify-center items-center h-32">
              <div className="relative w-40 h-20 border border-home-grau bg-home-grau/10 flex flex-col justify-end overflow-hidden">
                <div className="absolute top-0 w-full h-[2px] bg-home-grau"></div>
                <div className="flex justify-around w-full items-start h-full pt-[2px]">
                  <div className="w-3 h-12 bg-amber-500/80 rounded-b-full"></div>
                  <div className="w-2 h-8 bg-amber-500/80 rounded-b-full mt-1"></div>
                  <div className="w-4 h-16 bg-amber-500/80 rounded-b-full"></div>
                  <div className="w-2 h-10 bg-amber-500/80 rounded-b-full mt-2"></div>
                </div>
                <span className="absolute bottom-1 left-2 text-[10px] font-bold text-text-main/60">Beton/Estrich</span>
                <span className="absolute top-2 right-2 text-[10px] font-bold text-amber-700 bg-white/90 px-1 py-0.5 rounded shadow-sm"><MdText text={inhalt.texte.harzInPoren} /></span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Beschichtung</h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.schichtbildenderAuftragAufDie} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
              <li><MdText text={inhalt.texte.wirkstoffeEpoxidharzeEpFür} /></li>
              <li><MdText text={inhalt.texte.wirkprinzipBildungEinesDurchgehenden} /></li>
              <li><MdText text={inhalt.texte.anwendungParkhausbeschichtungenIndustrie} /></li>
            </ul>
            
            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white flex justify-center items-center h-32">
              <div className="relative w-40 h-20 border border-home-grau bg-home-grau/10 flex flex-col justify-end overflow-hidden rounded-t-[4px]">
                <div className="absolute top-0 w-full h-4 bg-emerald-500/80 border-b-2 border-emerald-700/50 shadow-sm z-10 flex items-center justify-center">
                   <span className="text-[9px] font-bold text-white drop-shadow-md"><MdText text={inhalt.texte.geschlossenerFilm} /></span>
                </div>
                <div className="flex justify-around w-full items-start h-full pt-4">
                  <div className="w-3 h-12 border-l border-r border-b border-home-grau/30 rounded-b-full bg-white/50"></div>
                  <div className="w-2 h-8 border-l border-r border-b border-home-grau/30 rounded-b-full bg-white/50 mt-1"></div>
                  <div className="w-4 h-16 border-l border-r border-b border-home-grau/30 rounded-b-full bg-white/50"></div>
                  <div className="w-2 h-6 border-l border-r border-b border-home-grau/30 rounded-b-full bg-white/50 mt-2"></div>
                </div>
                 <span className="absolute bottom-1 left-2 text-[10px] font-bold text-text-main/60">Beton/Estrich</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'korrosionsschutz' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.korrosionsschutzFürMetalle} /></h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.derSchutzVonStahl} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><MdText text={inhalt.texte.bimetallkorrosionKontaktkorrosionVermeid} /></li>
              <li><MdText text={inhalt.texte.passiverKorrosionsschutzTrennungDes} /></li>
              <li><MdText text={inhalt.texte.metallischerÜberzugFeuerverzinkenDin} /></li>
            </ul>

            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-stone-50">
               <h4 className="font-bold text-sm text-text-main mb-2"><MdText text={inhalt.texte.elektrochemischeSpannungsreihe} /></h4>
               <p className="text-xs text-text-main/80 mb-2"><MdText text={inhalt.texte.standardpotenzialeGegenNormalwasserstoff} /></p>
               <div className="flex flex-col gap-1 text-xs">
                 <div className="flex justify-between items-center bg-gray-200 p-1.5 rounded text-gray-800"><span className="font-bold"><MdText text={inhalt.texte.magnesiumMg} /></span><span><MdText text={inhalt.texte.t237VOpferanode} /></span></div>
                 <div className="flex justify-between items-center bg-gray-300 p-1.5 rounded text-gray-800"><span className="font-bold"><MdText text={inhalt.texte.aluminiumAl} /></span><span><MdText text={inhalt.texte.t166VPraktisch} /></span></div>
                 <div className="flex justify-between items-center bg-slate-300 p-1.5 rounded text-slate-800"><span className="font-bold">Zink (Zn)</span><span><MdText text={inhalt.texte.t076VVerzinkung} /></span></div>
                 <div className="flex justify-between items-center bg-zinc-400 p-1.5 rounded text-white"><span className="font-bold">Eisen (Fe)</span><span><MdText text={inhalt.texte.t044VBaustahl} /></span></div>
                 <div className="flex justify-between items-center bg-orange-200 p-1.5 rounded text-orange-900 border border-orange-300"><span className="font-bold">Kupfer (Cu)</span><span><MdText text={inhalt.texte.t034VSehr} /></span></div>
               </div>
               <p className="text-xs text-shiraz mt-2 font-bold flex items-center gap-1"><AlertTriangle size={12}/><MdText text={inhalt.texte.regelInFließrichtungDes} /></p>
            </div>

            <div className="mt-6 border border-home-grau/30 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-sm text-text-main mb-4 text-center"><MdText text={inhalt.texte.elektrochemischeKorrosionszelle} /></h4>
              <div className="flex items-center justify-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-torch-red/20 border-2 border-torch-red flex items-center justify-center text-torch-red font-bold text-xs">Anode</div>
                  <span className="text-[10px] mt-1 text-center leading-tight"><MdText text={inhalt.texte.feFe2eBr} /></span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-shiraz font-bold text-[10px]">
                    <span>2e⁻</span>
                    <ArrowRight size={14} />
                  </div>
                  <div className="h-6 w-20 border-b-4 border-home-grau mt-1 relative">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-blue-500 font-bold flex items-center gap-1 whitespace-nowrap">
                      <Droplets size={10} /> Elektrolyt
                    </div>
                  </div>
                  <div className="text-[10px] text-text-main/60 mt-1">Stahl</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-700 font-bold text-xs">Kathode</div>
                  <span className="text-[10px] mt-1 text-center leading-tight"><MdText text={inhalt.texte.oHO2e} /></span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.korrosionsschutzImStahlbeton} /></h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.derPrimäreSchutzDer} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><MdText text={inhalt.texte.kathodischerKorrosionsschutzKksAnlegen} /></li>
              <li><MdText text={inhalt.texte.korrosionsinhibitorenChemischeZusätzeOft} /></li>
              <li><MdText text={inhalt.texte.alternativeBewehrungEinsatzVon} /></li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Holzschutz</h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.schutzVonHolzVor} /></p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><MdText text={inhalt.texte.baulicherHolzschutzVorrangigKonstruktive} /></li>
              <li><MdText text={inhalt.texte.chemischerHolzschutzEinbringenVon} /></li>
              <li><MdText text={inhalt.texte.holzmodifizierungVeränderungDerZellwands} /></li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'kleben_dichten' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Einleitung / Definitionsblock */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <Paperclip className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.grundlagenDesKlebensDichtens} /></h3>
            <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.klebenUndDichtenSind} /></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20">
                <span className="font-bold text-sm text-shiraz block mb-1"><MdText text={inhalt.texte.klebenDinEn923} /></span>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.verbindungZweierFügeteileSubstrate} /></p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20">
                <span className="font-bold text-sm text-shiraz block mb-1"><MdText text={inhalt.texte.dichtenDinEn15651} /></span>
                <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.schließenVonFugenRissen} /></p>
              </div>
            </div>
          </div>

          {/* 1. Adhäsion, Kohäsion & Benetzung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.adhäsionKohäsion} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieTragfähigkeitJederKleb} /></p>
              <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
                <li><MdText text={inhalt.texte.adhäsionGrenzflächenhaftungHaftkräfteZwi} /></li>
                <li><MdText text={inhalt.texte.kohäsionInnereFestigkeitInnere} /></li>
              </ul>

              <div className="mt-2 p-3.5 bg-[#fcf8f2] rounded-xl border border-stone-200/50">
                <span className="font-bold text-[#A3113E] uppercase tracking-wide text-[10px] mb-1 font-mono block"><MdText text={inhalt.texte.bruchmechanischeVersagensbilder} /></span>
                <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/30">
                    <span className="font-bold text-emerald-700 block text-xs"><MdText text={inhalt.texte.kohäsionsbruchCf} /></span>
                    <p className="text-[11px] text-text-main/70 mt-1"><MdText text={inhalt.texte.bruchImInnerenDes} /></p>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/30">
                    <span className="font-bold text-rose-700 block text-xs"><MdText text={inhalt.texte.adhäsionsbruchAf} /></span>
                    <p className="text-[11px] text-text-main/70 mt-1"><MdText text={inhalt.texte.ablösungAnDerGrenzfläche} /></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.oberflächenenergieBenetzbarkeit} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.voraussetzungFürAdhäsionIst} /></p>
              
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center">
                <span className="font-bold text-xs text-text-main/80 block mb-1"><MdText text={inhalt.texte.youngscheGleichungDesKontaktwinkels} /></span>
                <BlockMath math="\sigma_{S} = \sigma_{SL} + \sigma_{L} \cdot \cos(\theta)" />
                <span className="text-[11px] text-text-main/60 block mt-1"><MdText text={inhalt.texte.sigmaSFreieOberflächenenergie} /></span>
              </div>

              <div className="space-y-2 text-xs text-text-main/80">
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-emerald-700 block mb-1"><MdText text={inhalt.texte.guteBenetzungTheta90} /></span>
                  <p className="leading-relaxed"><MdText text={inhalt.texte.trittAufWennDie} /></p>
                </div>
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-rose-700 block mb-1"><MdText text={inhalt.texte.schlechteKeineBenetzungTheta} /></span>
                  <p className="leading-relaxed"><MdText text={inhalt.texte.niedrigenergetischeUnpolareKunststoffePe} /></p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Erhärtungsmechanismen & Polymerchemie */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.erhärtungsmechanismenVonKlebDichtstoffen} /></h3>
            <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.derÜbergangVomVerarbeitungsfähigen} /></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white flex flex-col gap-2">
                <span className="font-bold text-sm text-shiraz"><MdText text={inhalt.texte.aPhysikalischAbbindendOhne} /></span>
                <ul className="list-disc list-inside text-xs text-text-main/80 space-y-2 mt-1">
                  <li><MdText text={inhalt.texte.lösemittelDispersionsklebstoffeErhärtung} /></li>
                  <li><MdText text={inhalt.texte.schmelzklebstoffeHotmelts100Festkörper} /></li>
                  <li><MdText text={inhalt.texte.kontaktklebstoffeBeidseitigerAuftragAblü} /></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white flex flex-col gap-2">
                <span className="font-bold text-sm text-shiraz"><MdText text={inhalt.texte.bChemischReagierendPolymerisation} /></span>
                <ul className="list-disc list-inside text-xs text-text-main/80 space-y-2 mt-1">
                  <li><MdText text={inhalt.texte.t1kFeuchtigkeitsvernetzendReagierenMit} /></li>
                  <li><MdText text={inhalt.texte.t2KomponentenSysteme2k} /></li>
                  <li><MdText text={inhalt.texte.mineralischHydraulischZementäreFliesenkl} /></li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Wichtigste bauchemische Polymer- & Dichtstoffbasen */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.hauptPolymerklassenImBauwesen} /></h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/40 bg-off-white">
                    <th className="p-3 font-bold text-text-main">Basis</th>
                    <th className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.chemischeNatur} /></th>
                    <th className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.charakteristischeEigenschaften} /></th>
                    <th className="p-3 font-bold text-text-main"><MdText text={inhalt.texte.typischeBauAnwendungen} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz whitespace-nowrap"><MdText text={inhalt.texte.silikonPolysiloxan} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.anorganischesSiORückgrat} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.hervorragendeUvOzonWitterungsbeständigke} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.sanitärfugenFungizidGlasFassadenbau} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz whitespace-nowrap"><MdText text={inhalt.texte.polyurethanPur} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.reaktionVonPolyolenMit} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.hoheZugWeiterreißfestigkeitSehr} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.bodenfugenInIndustriehallenDin} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz whitespace-nowrap"><MdText text={inhalt.texte.msPolymerSmp} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.silanmodifiziertePolymerePolyetherRückgr} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.isocyanatLösemittelfreiGeruchlosBreites} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.universelleElastischeMontagekleberFassad} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz whitespace-nowrap"><MdText text={inhalt.texte.epoxidharzEp} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.t2kReaktionsharzBisphenolA} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.extremHoheKohäsionsScherfestigkeit} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.kraftschlüssigeRissverpressungDinEn} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz whitespace-nowrap"><MdText text={inhalt.texte.acrylatDispersion} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.wässrigePolyacrylEmulsionPhysikalisch} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.plastoelastischDehnfähigkeitCa7} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.innenbereichsfugenTrockenbauDeckenanschl} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Fugengeometrie & 3-Flanken-Haftung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.fugendimensionierungDreiflankenhaftung} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.elastischeDichtstoffeDürfenSich} /></p>
              
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex flex-col gap-1">
                <span className="font-bold flex items-center gap-1.5 text-rose-900">
                  <AlertTriangle size={15} /><MdText text={inhalt.texte.vermeidungDerDreiflankenhaftungSchlüssel} /></span>
                <p className="leading-relaxed"><MdText text={inhalt.texte.haftetDerDichtstoffAn} /></p>
                <p className="font-bold mt-1 text-rose-900"><MdText text={inhalt.texte.abhilfeEinbringenEinerGeschlossenzellige} /></p>
              </div>

              <div className="text-xs text-text-main/80 space-y-2">
                <h4 className="font-bold text-text-main text-xs"><MdText text={inhalt.texte.fugenbreitenZuTiefenVerhältnis} /></h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><MdText text={inhalt.texte.fürFugenbreitenBLe} /></li>
                  <li><MdText text={inhalt.texte.fürFugenbreitenB10} /></li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.wichtigeNormenPrüfungen} /></h3>
              <p className="text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.zurQualitätssicherungUndBemessung} /></p>
              
              <div className="space-y-3 text-xs text-text-main/80">
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.dinEn15651Fugendichtstoffe} /></span>
                  <p className="leading-relaxed"><MdText text={inhalt.texte.teil1FassadenelementeTeil} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.dinEn12004Mörtel} /></span>
                  <p className="leading-relaxed"><MdText text={inhalt.texte.klassenkürzelCZementärD} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.dinEn204Beanspruchungsgruppen} /></span>
                  <p className="leading-relaxed"><MdText text={inhalt.texte.klassenD1BisD4} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANWENDUNG (Stufe 3 des Lehrpfads) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.anwendungBauchemieInZahlen} /></h3>
        <FormulaDerivationBox
          title={inhalt.werte.beispiel1WannErreicht}
          zielGleichung="d_k = K \cdot \sqrt{t} \;\Rightarrow\; t = \left(\frac{c}{K}\right)^2"
          schritte={inhalt.daten["Bauchemie.schritte"]}
          ergebnisHinweis={inhalt.werte.wurzelTGesetzDoppelte}
          normQuelle={inhalt.werte.dinEn19921}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel2WieViel}
          zielGleichung="Ca(OH)_2 + CO_2 \rightarrow CaCO_3 + H_2O"
          schritte={inhalt.daten["Bauchemie.schritte_2"]}
          normQuelle={inhalt.werte.stöchiometrieDinEn16757}
        />
      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bauchemie" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Bauchemie', url: 'https://de.wikipedia.org/wiki/Bauchemie' },
          { title: 'Klebstoff', url: 'https://de.wikipedia.org/wiki/Klebstoff' },
          { title: 'Dichtstoff', url: 'https://de.wikipedia.org/wiki/Dichtstoff' },
          { title: 'Betonzusatzmittel', url: 'https://de.wikipedia.org/wiki/Betonzusatzmittel' },
          { title: 'Oberflächenschutzsystem', url: 'https://de.wikipedia.org/wiki/Oberfl%C3%A4chenschutzsystem' },
          { title: 'Passivierung', url: 'https://de.wikipedia.org/wiki/Passivierung' }
        ]}
        literatur={inhalt.daten["Bauchemie.literatur"]}
        regelwerke={inhalt.daten["Bauchemie.regelwerke"]}
        formeln={inhalt.daten["Bauchemie.formeln"]}
        lastReviewed={inhalt.werte.oktober2026Ap3}
      />
    </div>
  );
} 