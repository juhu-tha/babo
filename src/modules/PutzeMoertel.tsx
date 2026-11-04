import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { InlineMath, BlockMath } from 'react-katex';
import { 
  Layers, Droplets, Hammer, BookOpen, Calculator, Sparkles, 
  ChevronRight, Info, ShieldCheck
} from 'lucide-react';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import inhalt from '@/content/putzemoertel/PutzeMoertel.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';
import { putzbedarf, mauermoertelNormalfuge, duennbettmoertel, type Putzart, type Wanddicke, type Steinformat } from '@/src/calc/moertelbedarf';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { ErgebnisAnsage, ansageWert, kurzzeile } from '@/src/components/ui/ErgebnisAnsage';

interface MortarProduct {
  id: string;
  name: string;
  normClass: string;
  strengthNmm2: string;
  densityKgM3: number;
  lambdaWmk: number;
  muValue: string;
  composition: string;
  advantages: string[];
  description: string;
  systemIntegration: string;
}

interface PlasterProduct {
  id: string;
  name: string;
  normClass: string;
  strengthCategory: string;
  composition: string;
  densityKgM3: number;
  lambdaWmk: number;
  muValue: string;
  thicknessMm: string;
  advantages: string[];
  description: string;
  systemIntegration: string;
}

interface BuildingSystem {
  id: string;
  type: 'mörtel' | 'putz';
  name: string;
  shirazCode: string;
  layers: string[];
  normref: string;
  advantages: string[];
  description: string;
  application: string;
}

const MORTAR_PRODUCTS: MortarProduct[] = inhalt.daten.MORTAR_PRODUCTS;

const PLASTER_PRODUCTS: PlasterProduct[] = inhalt.daten.PLASTER_PRODUCTS;

const BUILDING_SYSTEMS: BuildingSystem[] = [
  {
    id: 'planstein_sys',
    type: 'mörtel',
    name: inhalt.werte.plansteinmauerwerkSystemMitDünnbettklebe,
    shirazCode: inhalt.werte.monolithischesDünnbettmauerwerk,
    layers: [
      inhalt.werte.t1ErsteSchichtNormalmauermörtel,
      inhalt.werte.t2WandsteinPlangeschliffenerZiegel,
      inhalt.werte.t3FugenbettDünnbettmörtelDicke,
      inhalt.werte.t4StoßfugenKnirscheVermörtelungsfreie
    ],
    normref: inhalt.werte.dinEn1996Eurocode,
    advantages: [
      inhalt.werte.beseitigtMechanischHygrischeKältebrücken,
      inhalt.werte.erhöhtDieStatischeBelastbarkeit,
      inhalt.werte.reduziertDieBaufeuchtigkeitIm,
      inhalt.werte.schnellsteMontagezeitenBeiOptimaler
    ],
    description: inhalt.werte.dasFührendeMontagesystemDes,
    application: inhalt.werte.standardFürModerneMonolithische
  },
  {
    id: 'fassade_2lag_sys',
    type: 'putz',
    name: inhalt.werte.zweilagigesKlassischesAußenputzSystem,
    shirazCode: inhalt.werte.mineralischerAußenputzaufbauWeichAuf,
    layers: [
      inhalt.werte.t1UntergrundMassivesRohmauerwerk,
      inhalt.werte.t2HaftbrückeSpritzbewurfBei,
      inhalt.werte.t3UnterputzKalkZement,
      inhalt.werte.t4ZwischenbeschichtungPutzgrundierungZur,
      inhalt.werte.t5OberputzMineralischerEdelkratzputz
    ],
    normref: inhalt.werte.din185501Din,
    advantages: [
      inhalt.werte.erfülltDenElastischenVerformungsgrundsat,
      inhalt.werte.hocheffektiverSchutzVorSchlagregen,
      inhalt.werte.prächtigeMineralischeAtmunghäufigkeitGer,
      inhalt.werte.sehrLanglebigeAußenansichtOhne
    ],
    description: inhalt.werte.derTraditionellTechnischeAufbau,
    application: inhalt.werte.fassadenverputzGängigerWohnUnd
  },
  {
    id: 'wdvs_sys',
    type: 'putz',
    name: inhalt.werte.wärmedämmverbundsystemPutzsystemWdvs,
    shirazCode: inhalt.werte.hochelastischerGewebeArmierungsaufbau,
    layers: [
      inhalt.werte.t1DämmschichtEpsDämmplatten,
      inhalt.werte.t2PutzgrundlageKlebeUnd,
      inhalt.werte.t3ArmierungEingebettetesAlkaliresistentes,
      inhalt.werte.t4OberputzSilikonharzputzOder
    ],
    normref: inhalt.werte.zulassungsgebundeneWdvsSystemrichtlinien,
    advantages: [
      inhalt.werte.hochelastischerAufbauVerhindertThermisch,
      inhalt.werte.maximaleBeständigkeitGegenAlgen,
      inhalt.werte.minimaleDickenentwicklungBeiMaximalem,
      inhalt.werte.überbrücktExtremeDimensionsänderungenDer
    ],
    description: inhalt.werte.spezialbeschichtungFürWeicheDämmungen,
    application: inhalt.werte.modernisierungVonAltbautenAußendämmung
  },
  {
    id: 'sanier_wta_sys',
    type: 'putz',
    name: inhalt.werte.sanierungssystemNachWtaRichtlinie,
    shirazCode: inhalt.werte.systematischesSanierputzverfahren,
    layers: [
      inhalt.werte.t1VorbereitungSchadhaftenSalzzerstörten,
      inhalt.werte.t2TiefenreinigungFugen20,
      inhalt.werte.t3HaftbrückeSpritzbewurfNetzartig,
      inhalt.werte.t4PorenspeicherSanierputzWta
    ],
    normref: inhalt.werte.wtaMerkblatt29,
    advantages: [
      inhalt.werte.geregelteKristallisationskammerVerhinder,
      inhalt.werte.trocknetDauerhaftFeuchteKellerräume,
      inhalt.werte.sperrtGelösteSalzeSulfate,
      inhalt.werte.überbrücktRestfeuchteImFundament
    ],
    description: inhalt.werte.dasAnerkannteSpezialverfahrenFür,
    application: inhalt.werte.denkmalgeschützteSockelzonenHistorischeG
  }
];

type PutzeMoertelReiter = 'steckbrief' | 'moertel' | 'putze' | 'rechner' | 'reaktionen';
const REITER: readonly ModulTab<PutzeMoertelReiter>[] = [
  { id: 'steckbrief', label: 'Baustoff-Steckbrief', icon: BookOpen },
  { id: 'moertel', label: inhalt.texte.t1Mauermörtel.trim(), icon: Hammer },
  { id: 'putze', label: inhalt.texte.t2Putzmörtel.trim(), icon: Droplets },
  { id: 'rechner', label: inhalt.texte.t3MaterialRechner.trim(), icon: Calculator },
  { id: 'reaktionen', label: inhalt.texte.t4ErhärtungBauphysik.trim(), icon: Sparkles },
];

export default function PutzeMoertel() {
  const [activeTab, setActiveTab] = useState<PutzeMoertelReiter>('steckbrief');
  const [selectedMortarId, setSelectedMortarId] = useState<string>('normal_m5');
  const [selectedPlasterId, setSelectedPlasterId] = useState<string>('gips_gp');
  const [selectedSystemId, setSelectedSystemId] = useState<string>('planstein_sys');

  // Calculator State - Plaster
  const [plasterArea, setPlasterArea] = useState<number>(50);
  const [plasterThickness, setPlasterThickness] = useState<number>(15);
  const [plasterType, setPlasterType] = useState<string>('gips');

  // Calculator State - Masonry Normalfuge
  const [masonryArea, setMasonryArea] = useState<number>(30);
  const [wallThickness, setWallThickness] = useState<string>('24.0');
  const [brickFormat, setBrickFormat] = useState<string>('nf');

  // Calculator State - Planstein Dünnbett
  const [plansteinArea, setPlansteinArea] = useState<number>(30);
  const [plansteinThickness, setPlansteinThickness] = useState<string>('30.0');

  // Find active selections
  const activeMortar = MORTAR_PRODUCTS.find(m => m.id === selectedMortarId) || MORTAR_PRODUCTS[0];
  const activePlaster = PLASTER_PRODUCTS.find(p => p.id === selectedPlasterId) || PLASTER_PRODUCTS[0];
  const activeSystem = BUILDING_SYSTEMS.find(s => s.id === selectedSystemId) || BUILDING_SYSTEMS[0];

  // Orientierungsrechner: Rechenkern src/calc/moertelbedarf.ts (Modulprüfung Tranche 5)
  const plasterResult = putzbedarf({ flaeche: plasterArea, dickeMm: plasterThickness, art: plasterType as Putzart });
  const normalfugeResult = mauermoertelNormalfuge({ flaeche: masonryArea, wanddicke: wallThickness as Wanddicke, format: brickFormat as Steinformat });
  const plansteinResult = duennbettmoertel({ flaeche: plansteinArea, wanddickeCm: parseFloat(plansteinThickness) });

  return (
    <div className="flex flex-col gap-8">
      {/* Introduction Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.putzeMörtelUndMauerwerkssysteme} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.mörtelUndPutzsystemeBilden} /></p>
        </div>

        {/* Tab switchers */}
        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:my-6">

        {/* Tab 0: Steckbrief */}
        {activeTab === 'steckbrief' && (
          <div className="animate-in fade-in duration-300">
            <BaustoffProfil materialKey="putzemoertel" />
          </div>
        )}

        {/* Tab 1: Mörtel */}
        {activeTab === 'moertel' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Introduction info */}
            <div className="text-sm text-text-main/85 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p><MdText text={inhalt.texte.mauermörtelNachDinEn} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Product list sidebar (5 cols) */}
              <AuswahlGruppe label="Mörtelprodukt" className="lg:col-span-5 flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 select-none"><MdText text={inhalt.texte.verfügbareMauermörtelProdukteDin} /></h4>
                {MORTAR_PRODUCTS.map((prod) => (
                  <button {...alsOption(selectedMortarId === prod.id)}
                    key={prod.id}
                    id={`btn-mortar-${prod.id}`}
                    onClick={() => setSelectedMortarId(prod.id)}
                    className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      selectedMortarId === prod.id
                        ? 'bg-shiraz/5 border-shiraz text-shiraz ring-1 ring-shiraz'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold leading-tight">{prod.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">{prod.normClass}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 shrink-0" />
                  </button>
                ))}
              </AuswahlGruppe>

              {/* Detail view card (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
                <div>
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-shiraz tracking-wide font-mono block uppercase mb-1">
                        Bauproduktbeschreibung
                      </span>
                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        {activeMortar.name}
                      </h3>
                    </div>
                    <span className="text-[10px] bg-white border border-slate-200 text-slate-800 px-2 py-1 rounded font-mono font-bold shrink-0">
                      {activeMortar.normClass}
                    </span>
                  </div>

                  {/* Physical Parameters Bento Grid */}
                  <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/30 border-b border-slate-100">
                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Nenn-Druckfestigkeit</span>
                      <span className="text-[11px] font-bold text-slate-800 leading-snug block mt-1">{activeMortar.strengthNmm2}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Prüf-Rohdichte</span>
                      <span className="text-xs font-mono font-black text-slate-800 block mt-1">{formatDeWert(activeMortar.densityKgM3)} kg/m³</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase"><MdText text={inhalt.texte.wärmeleitf10} /></span>
                      <span className="text-xs font-mono font-black text-slate-800 block mt-1">{formatDeZahl(activeMortar.lambdaWmk, 2)} W/mK</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase"><MdText text={inhalt.texte.dampfDiff} /></span>
                      <span className="text-xs font-mono font-black text-slate-800 block mt-1">µ = {activeMortar.muValue}</span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="p-5 space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                        <Info size={11} className="text-slate-400" /><MdText text={inhalt.texte.charakteristischeWirkungsweise} /></h4>
                      <p className="text-slate-600 leading-relaxed">{activeMortar.description}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                        <ShieldCheck size={11} className="text-emerald-500" /><MdText text={inhalt.texte.ausgewählteKriterienVorteile} /></h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600">
                        {activeMortar.advantages.map((adv, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span className="text-[11px] leading-tight font-medium">{adv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#FCFAF7] p-3.5 rounded-xl border border-home-grau/30">
                      <h4 className="font-bold text-shiraz mb-1.5 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                        <Layers size={11} /><MdText text={inhalt.texte.stofflicheZusammensetzungBindemittel} /></h4>
                      <p className="text-slate-750 leading-relaxed text-[11.5px]">
                        {activeMortar.composition}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-1 rounded uppercase tracking-wider font-mono">System-Verbindung:</span>
                  <p className="text-[11px] font-medium text-slate-600 flex-1 leading-normal">{activeMortar.systemIntegration}</p>
                </div>
              </div>
            </div>

            {/* Norm classification info table */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 mt-2">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info size={14} className="text-shiraz" /><MdText text={inhalt.texte.druckfestigkeitsklassenVonMauermörtelnNa} /></h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px]">
                      <th className="p-2.5"><MdText text={inhalt.texte.klassenbezeichnungDinEn} /></th>
                      <th className="p-2.5"><MdText text={inhalt.texte.mindestdruckfestigkeitNMm} /></th>
                      <th className="p-2.5"><MdText text={inhalt.texte.entsprechungAlteNormDin} /></th>
                      <th className="p-2.5"><MdText text={inhalt.texte.primäreSteinanwendung} /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-slate-950">M 1</td>
                      <td className="p-2.5 font-mono">≥ 1,0</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.mörtelgruppeILuftkalk} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.historischesGurtmauerwerkNatursteinmauer} /></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-slate-950">M 2,5</td>
                      <td className="p-2.5 font-mono">≥ 2,5</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.mörtelgruppeIiKalkzement} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.aussteifungsmauerwerkeHochwärmedämmendeL} /></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-slate-950">M 5</td>
                      <td className="p-2.5 font-mono">≥ 5,0</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.mörtelgruppeIiaKalkzementStark} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.standardWohnungsbauTragendesMauerwerk} /></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-slate-950">M 10</td>
                      <td className="p-2.5 font-mono">≥ 10,0</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.mörtelgruppeIiiZementmörtel} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.starkBeanspruchtesMauerwerkKelleraußenwä} /></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-slate-950">M 20</td>
                      <td className="p-2.5 font-mono">≥ 20,0</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.mörtelgruppeIiiaZementmörtelHöhere} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.hochleistungsklinkermauernIngenieurbauwe} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Putze */}
        {activeTab === 'putze' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Introduction info */}
            <div className="text-sm text-text-main/85 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p><MdText text={inhalt.texte.putzmörtelNachDinEn} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Product list sidebar (5 cols) */}
              <AuswahlGruppe label="Putzprodukt" className="lg:col-span-5 flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 select-none"><MdText text={inhalt.texte.spezialUndStandardputzeDin} /></h4>
                {PLASTER_PRODUCTS.map((prod) => (
                  <button {...alsOption(selectedPlasterId === prod.id)}
                    key={prod.id}
                    id={`btn-plaster-${prod.id}`}
                    onClick={() => setSelectedPlasterId(prod.id)}
                    className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      selectedPlasterId === prod.id
                        ? 'bg-shiraz/5 border-shiraz text-shiraz ring-1 ring-shiraz'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold leading-tight">{prod.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">{prod.normClass}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 shrink-0" />
                  </button>
                ))}
              </AuswahlGruppe>

              {/* Detail view card (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
                <div>
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-shiraz tracking-wide font-mono block uppercase mb-1">
                        Bauproduktbeschreibung
                      </span>
                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        {activePlaster.name}
                      </h3>
                    </div>
                    <span className="text-[10px] bg-white border border-slate-200 text-slate-800 px-2 py-1 rounded font-mono font-bold shrink-0">
                      {activePlaster.normClass.split(' / ')[0]}
                    </span>
                  </div>

                  {/* Physical Parameters Bento Grid */}
                  <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/30 border-b border-slate-100">
                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Festigkeitskategorie</span>
                      <span className="text-[11px] font-bold text-slate-800 leading-snug block mt-1">{activePlaster.strengthCategory}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Trockenrohdichte</span>
                      <span className="text-xs font-mono font-black text-slate-800 block mt-1">{formatDeWert(activePlaster.densityKgM3)} kg/m³</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase"><MdText text={inhalt.texte.leitfähigkeit} /></span>
                      <span className="text-xs font-mono font-black text-slate-800 block mt-1">{formatDeZahl(activePlaster.lambdaWmk, 3)} W/mK</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Diffusion µ</span>
                      <span className="text-xs font-mono font-black text-slate-800 block mt-1">µ ≤ {activePlaster.muValue}</span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="p-5 space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                        <Info size={11} className="text-slate-400" /><MdText text={inhalt.texte.bauphysikalischeWirkungsweise} /></h4>
                      <p className="text-slate-600 leading-relaxed">{activePlaster.description}</p>
                    </div>

                    <div className="bg-[#FCFAF7] p-3.5 rounded-xl border border-home-grau/30">
                      <h4 className="font-bold text-shiraz mb-1.5 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                        <Layers size={11} /><MdText text={inhalt.texte.stofflicheZusammensetzungBindemittel2} /></h4>
                      <p className="text-slate-750 leading-relaxed text-[11.5px]">
                        {activePlaster.composition}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                        <ShieldCheck size={11} className="text-emerald-500" /><MdText text={inhalt.texte.wichtigeVerarbeitungskriterien} /></h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600">
                        {activePlaster.advantages.map((adv, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span className="text-[11px] leading-tight font-medium">{adv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-150 flex justify-between items-center text-slate-500 text-[10px]">
                      <span>Regel-Schichtdicke: <strong>{activePlaster.thicknessMm}</strong></span>
                      <span className="font-mono">Norm: {activePlaster.normClass}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <span className="text-[9px] font-bold text-shiraz bg-shiraz/10 px-2 py-1 rounded uppercase tracking-wider font-mono">Systemeinbindung:</span>
                  <p className="text-[11px] font-medium text-slate-600 flex-1 leading-normal">{activePlaster.systemIntegration}</p>
                </div>
              </div>
            </div>

            {/* Putzsysteme interactive section */}
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 mt-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers size={14} className="text-shiraz" /><MdText text={inhalt.texte.systemaufbautenDerPutzMörteltechnik} /></h3>

              <AuswahlGruppe label="Systemaufbau" className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                {BUILDING_SYSTEMS.map((sys) => (
                  <button {...alsOption(selectedSystemId === sys.id)}
                    key={sys.id}
                    id={`btn-sys-${sys.id}`}
                    onClick={() => setSelectedSystemId(sys.id)}
                    className={`p-3 text-left rounded-xl border text-xs font-bold leading-snug cursor-pointer transition-all ${
                      selectedSystemId === sys.id
                        ? 'bg-shiraz text-white border-shiraz'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sys.name.split(' (')[0]}
                  </button>
                ))}
              </AuswahlGruppe>

              {/* Active System Panel */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 block uppercase font-mono">{activeSystem.shirazCode}</span>
                  <h4 className="font-black text-slate-950 text-sm mt-0.5 mb-2">{activeSystem.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{activeSystem.description}</p>
                  
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase"><MdText text={inhalt.texte.regelwerkStandardbezug} /></span>
                    <p className="text-xs font-mono font-bold text-slate-800">{activeSystem.normref}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 block uppercase mb-1.5"><MdText text={inhalt.texte.aufbauschichtenVonInnenNach} /></span>
                    <ul className="space-y-1 text-xs">
                      {activeSystem.layers.map((layer, index) => (
                        <li key={index} className="p-2 bg-slate-50/50 rounded-lg border border-slate-100 flex items-start gap-2 text-slate-700">
                          <span className="w-5 h-5 rounded bg-shiraz/10 text-shiraz font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-[11px] font-medium leading-relaxed">{layer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-150">
                    <span className="text-[9px] font-bold text-emerald-800 block uppercase mb-1">Leistungskriterien:</span>
                    <ul className="list-inside list-disc text-[10px] space-y-0.5 text-slate-700 font-medium">
                      {activeSystem.advantages.slice(0, 3).map((vorteil, idx) => (
                        <li key={idx}>{vorteil}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Rechner */}
        {activeTab === 'rechner' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="text-sm text-text-main/85 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p><MdText text={inhalt.texte.nutzenSieDenHerstellerneutralen} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Plaster Calculator Panel (Card 1) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5 text-sm uppercase tracking-tight">
                    <Droplets size={16} className="text-shiraz" /><MdText text={inhalt.texte.t1PutzmörtelAbschätzung} /></h3>

                  <div className="space-y-4 text-xs font-medium">
                    <div>
                      <label className="text-slate-500 block mb-1"><MdText text={inhalt.texte.putzflächeM} /></label>
                      <input aria-label={inhalt.werte.putzflächeM} 
                        type="number" min="0" 
                        value={plasterArea === 0 ? '' : plasterArea}
                        onChange={(e) => setPlasterArea(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-shiraz text-slate-800 font-bold"
                      />
                      <input 
                        type="range" 
                        min="1" 
                        max="250" 
                        value={plasterArea}
                        onChange={(e) => setPlasterArea(Number(e.target.value))}
                        className="w-full h-6 mt-1.5 accent-shiraz"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1"><MdText text={inhalt.texte.schichtstärkeDMm} /></label>
                      <input aria-label={inhalt.werte.schichtstärkeDMm} 
                        type="number" min="0" 
                        value={plasterThickness === 0 ? '' : plasterThickness}
                        onChange={(e) => setPlasterThickness(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-shiraz text-slate-800 font-bold"
                      />
                      <input 
                        type="range" 
                        min="2" 
                        max="80" 
                        value={plasterThickness}
                        onChange={(e) => setPlasterThickness(Number(e.target.value))}
                        className="w-full h-6 mt-1.5 accent-shiraz"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1">Putzmörtel-Art:</label>
                      <select aria-label="Putzmörtel-Art" 
                        value={plasterType}
                        onChange={(e) => setPlasterType(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-bold focus:outline-none"
                      >
                        <option value="gips">Gipsputz (~1,1 kg / mm / m²)</option>
                        <option value="luftkalk">Luftkalkputz (~1,3 kg / mm / m²)</option>
                        <option value="kalkzement">Kalk-Zement-Leichtputz (~1,25 kg / mm / m²)</option>
                        <option value="zement">Zement-Sockelputz (~1,6 kg / mm / m²)</option>
                        <option value="sanier">Sanierputz WTA (~1,2 kg / mm / m²)</option>
                        <option value="aerogel">Aerogel-Dämmputz (~0,28 kg / mm / m²)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Trockenmischung:</span>
                    <span className="text-sm font-mono font-black text-slate-900">{formatDeWert(plasterResult.masse)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400"><MdText text={inhalt.texte.anteilSäcke25Kg} /></span>
                    <span className="text-sm font-mono font-black text-shiraz">{formatDeWert(plasterResult.saecke)} Stk.</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400"><MdText text={inhalt.texte.wasserbedarfCa} /></span>
                    <span className="text-xs font-mono font-bold text-slate-700">{formatDeWert(plasterResult.wasser)} Liter</span>
                  </div>
                </div>
                <EingabeHinweise hinweise={plasterResult.hinweise} />
                <ErgebnisAnsage text={kurzzeile(ansageWert('Putz: Trockenmischung', plasterResult.masse, 'frei', 'kg'), ansageWert('Säcke zu 25 kg', plasterResult.saecke, 'frei'), ansageWert('Wasserbedarf', plasterResult.wasser, 'frei', 'Liter'))} />
              </div>

              {/* Masonry Normalfuge Panel (Card 2) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5 text-sm uppercase tracking-tight">
                    <Hammer size={16} className="text-shiraz" /><MdText text={inhalt.texte.t2NormalfugenMörtel} /></h3>

                  <div className="space-y-4 text-xs font-medium">
                    <div>
                      <label className="text-slate-500 block mb-1"><MdText text={inhalt.texte.wandflächeM} /></label>
                      <input aria-label={inhalt.werte.wandflächeM} 
                        type="number" min="0" 
                        value={masonryArea === 0 ? '' : masonryArea}
                        onChange={(e) => setMasonryArea(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-shiraz text-slate-800 font-bold"
                      />
                      <input 
                        type="range" 
                        min="1" 
                        max="250" 
                        value={masonryArea}
                        onChange={(e) => setMasonryArea(Number(e.target.value))}
                        className="w-full h-6 mt-1.5 accent-shiraz"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1"><MdText text={inhalt.texte.mauerwerksstärkeCm} /></label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['11.5', '24.0', '30.0', '36.5'].map((dim) => (
                          <button
                            key={dim}
                            id={`btn-thick-${dim}`}
                            onClick={() => setWallThickness(dim)}
                            className={`p-2 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                              wallThickness === dim
                                ? 'bg-shiraz text-white border-shiraz'
                                : 'bg-slate-50 text-slate-750 border-slate-200'
                            }`}
                          >
                            {dim} cm
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1"><MdText text={inhalt.texte.ziegelSteinformatNf} /></label>
                      <select aria-label={inhalt.werte.ziegelSteinformatNf} 
                        value={brickFormat}
                        onChange={(e) => setBrickFormat(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-bold focus:outline-none"
                      >
                        <option value="df">Dünnformat (DF) - 240x115x52 mm</option>
                        <option value="nf">Normalformat (NF) - 240x115x71 mm</option>
                        <option value="twoDF">Zweifaches Dünnformat (2DF) - 240x115x113 mm</option>
                        <option value="hlz">Hochlochziegel (HLz/Blockformat)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Nass-Mörtelvolumen:</span>
                    <span className="text-sm font-mono font-black text-slate-900">{formatDeWert(normalfugeResult.liter)} Liter</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400"><MdText text={inhalt.texte.trockengewichtCa} /></span>
                    <span className="text-sm font-mono font-black text-slate-900">{formatDeWert(normalfugeResult.masse)} kg</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-1.5 text-shiraz">
                    <span className="text-[10px] uppercase font-bold text-slate-400"><MdText text={inhalt.texte.säcke25Kg} /></span>
                    <span className="text-sm font-mono font-black">{formatDeWert(normalfugeResult.saecke)} Stk.</span>
                  </div>
                </div>
                <EingabeHinweise hinweise={normalfugeResult.hinweise} />
                <ErgebnisAnsage text={kurzzeile(ansageWert('Mauermörtel: Nassvolumen', normalfugeResult.liter, 'frei', 'Liter'), ansageWert('Trockengewicht', normalfugeResult.masse, 'frei', 'kg'), ansageWert('Säcke zu 25 kg', normalfugeResult.saecke, 'frei'))} />
              </div>

              {/* Planstein ThinBed Calculator Panel (Card 3) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5 text-sm uppercase tracking-tight">
                    <Layers size={16} className="text-shiraz" /><MdText text={inhalt.texte.t3DünnbettkleberKleben} /></h3>

                  <div className="space-y-4 text-xs font-medium">
                    <div>
                      <label className="text-slate-500 block mb-1"><MdText text={inhalt.texte.wandflächeM2} /></label>
                      <input aria-label={inhalt.werte.wandflächeM2} 
                        type="number" min="0" 
                        value={plansteinArea === 0 ? '' : plansteinArea}
                        onChange={(e) => setPlansteinArea(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-shiraz text-slate-800 font-bold"
                      />
                      <input 
                        type="range" 
                        min="1" 
                        max="250" 
                        value={plansteinArea}
                        onChange={(e) => setPlansteinArea(Number(e.target.value))}
                        className="w-full h-6 mt-1.5 accent-shiraz"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1"><MdText text={inhalt.texte.mauerwerksstärkeCm2} /></label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['11.5', '17.5', '24.0', '30.0'].map((dim) => (
                          <button
                            key={dim}
                            id={`btn-plan-${dim}`}
                            onClick={() => setPlansteinThickness(dim)}
                            className={`p-2 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                              plansteinThickness === dim
                                ? 'bg-shiraz text-white border-shiraz'
                                : 'bg-slate-50 text-slate-750 border-slate-200'
                            }`}
                          >
                            {dim} cm
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-150 leading-relaxed text-slate-500 text-[11px]">
                      <p><MdText text={inhalt.texte.derDünnbettkleberWirdBei} /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Gesamt-Trockenbedarf:</span>
                    <span className="text-sm font-mono font-black text-slate-900">{formatDeWert(plansteinResult.masse)} kg</span>
                  </div>
                  <div className="flex justify-between items-center text-shiraz">
                    <span className="text-[10px] uppercase font-bold text-slate-400"><MdText text={inhalt.texte.anteileSäcke25Kg} /></span>
                    <span className="text-sm font-mono font-black">{formatDeWert(plansteinResult.saecke)} Stk.</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400"><MdText text={inhalt.texte.wasserbedarfCa2} /></span>
                    <span className="text-xs font-mono font-bold text-slate-700">{formatDeWert(plansteinResult.wasser)} Liter</span>
                  </div>
                </div>
                <EingabeHinweise hinweise={plansteinResult.hinweise} />
                <ErgebnisAnsage text={kurzzeile(ansageWert('Dünnbettmörtel', plansteinResult.masse, 'frei', 'kg'), ansageWert('Säcke zu 25 kg', plansteinResult.saecke, 'frei'), ansageWert('Wasserbedarf', plansteinResult.wasser, 'frei', 'Liter'))} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Reaktionen */}
        {activeTab === 'reaktionen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Intro */}
            <div className="text-sm text-text-main/85 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-2">
              <p><MdText text={inhalt.texte.dieErhärtungVonPutzen} /></p>
            </div>

            {/* Grid of physical and chemical aspects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Hydratation */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-black text-shiraz uppercase tracking-widest block flex items-center gap-1">
                  <Sparkles size={14} /><MdText text={inhalt.texte.t1HydratationHydraulischeErhärtung} /></span>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.zementgebundeneMörtelsystemeBenötigenZur} /></p>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dasCshBildetMikroskopisch} /></p>
                <div className="bg-[#FCFAF7] border border-home-grau/25 p-3 rounded-lg text-xs leading-relaxed text-slate-800">
                  <strong className="block mb-1 text-[11px] text-text-main font-bold"><MdText text={inhalt.texte.hauptgleichungStarkVereinfacht} /></strong>
                  <BlockMath math="2\,\text{Ca}_3\text{SiO}_5 + 6\,\text{H}_2\text{O} \longrightarrow 3\,\text{CaO}\cdot 2\,\text{SiO}_2\cdot 3\,\text{H}_2\text{O} + 3\,\text{Ca(OH)}_2" />
                </div>
              </div>

              {/* Box 2: Karbonatisierung */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-black text-shiraz uppercase tracking-widest block flex items-center gap-1">
                  <Sparkles size={14} /><MdText text={inhalt.texte.t2KarbonatisierungAtmosphärischeHärtung} /></span>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.reineLuftkalkputzeHärtenVollkommen} /></p>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.durchKarbonatisierungVonGelöschtem} /></p>
                <div className="bg-[#FCFAF7] border border-home-grau/25 p-3 rounded-lg text-xs leading-relaxed text-slate-800">
                  <strong className="block mb-1 text-[11px] text-text-main font-bold"><MdText text={inhalt.texte.hauptgleichungKarbonatisierung} /></strong>
                  <BlockMath math="\text{Ca(OH)}_2 + \text{CO}_2 \longrightarrow \text{CaCO}_3 + \text{H}_2\text{O}" />
                </div>
              </div>

              {/* Box 3: Künzel-Wetterschutzkriterien */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest block flex items-center gap-1 font-mono"><MdText text={inhalt.texte.dieFormelNachKünzel} /></span>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.umZuErmittelnOb} /></p>
                <div className="bg-[#FCFAF7] border border-home-grau/25 p-3 rounded-lg text-xs leading-relaxed text-slate-800 text-center">
                  <strong className="block mb-1 text-[11px] text-text-main font-bold"><MdText text={inhalt.texte.künzelKriterienpaarOptimalbereich} /></strong>
                  <BlockMath math="w \cdot s_d \le 0{,}2\,\text{kg}/(\text{m}\cdot\text{h}^{0{,}5})" />
                  <div className="mt-1 text-[11px] text-slate-600"><MdText text={inhalt.texte.wLe05} /></div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.fälltDasProduktKleiner} /></p>
              </div>

              {/* Box 4: Elastizität - "Weich auf Hart" */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest block flex items-center gap-1 font-mono"><MdText text={inhalt.texte.derWeichAufHart} /></span>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.diesesEherneGrundgesetzDer} /></p>
                <div className="bg-[#FCFAF7] border border-home-grau/25 p-3 rounded-lg text-xs leading-relaxed text-slate-800 text-center">
                  <strong className="block mb-1 text-[11px] text-text-main font-bold"><MdText text={inhalt.texte.verformungsverhältnisAbstufungDesE} /></strong>
                  <BlockMath math="E_{\text{Untergrund}} \ge E_{\text{Unterputz}} \ge E_{\text{Oberputz}}" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.istDieÄußereSchicht} /></p>
              </div>

              {/* Box 5: Wissenschaftliche Salz- & Hydrophobierungsmechanik bei Sanierputzen */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 md:col-span-2">
                <span className="text-xs font-black text-shiraz uppercase tracking-widest block flex items-center gap-1.5">
                  <Sparkles size={14} /><MdText text={inhalt.texte.t5BauschädlicheKristallisationschemieSila} /></span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
                  <div className="space-y-2">
                    <h5 className="font-extrabold text-slate-800 uppercase text-[10px] tracking-tight mb-1"><MdText text={inhalt.texte.kryptofloreszenzThermodynamischeSprengwi} /></h5>
                    <p><MdText text={inhalt.texte.wennGelösteSalzionenSulfate} /></p>
                    <div className="bg-[#FCFAF7] p-3 rounded-lg border border-home-grau/25 my-1 text-center font-mono">
                      <BlockMath math="\sigma_k = \frac{R \cdot T}{V_m} \cdot \ln\left(\frac{C}{C_0}\right) \ge 100\,\text{MPa}" />
                    </div>
                    <p><MdText text={inhalt.texte.sanierputzeLösenDiesesProblem} /></p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-extrabold text-slate-800 uppercase text-[10px] tracking-tight mb-1"><MdText text={inhalt.texte.kondensationsreaktionDerAlkylalkoxysilan} /></h5>
                    <p><MdText text={inhalt.texte.umEinKapillaresVordringen} /></p>
                    <div className="bg-[#FCFAF7] p-3 rounded-lg border border-home-grau/25 my-1 text-center font-mono">
                      <BlockMath math="\equiv\text{Si-OH} + \text{R-Si(OH)}_3 \rightarrow \, \equiv\text{Si-O-Si(OH)}_2\text{-R} + \text{H}_2\text{O}" />
                    </div>
                    <p><MdText text={inhalt.texte.derOrganischeRestText} /></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </ModuleTabs>
      </div>

      {/* Module Footer component with Literature and Wikipedia references */}
      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielBedarfAnGipsputz}
        zielGleichung="m = A \cdot d \cdot f"
        normQuelle={inhalt.werte.verbrauchsrichtwertFLtHerstellerangabe}
        schritte={inhalt.daten["PutzeMoertel.schritte"]}
        ergebnisHinweis={inhalt.werte.rund825KgBzw}
      />

      <ModulTest moduleId="putzemoertel" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Mörtel', url: 'https://de.wikipedia.org/wiki/M%C3%B6rtel' },
          { title: inhalt.werte.putzBaustoff, url: 'https://de.wikipedia.org/wiki/Putz_(Baustoff)' },
          { title: 'Kalkstein', url: 'https://de.wikipedia.org/wiki/Kalkstein' }
        ]} 
        literatur={inhalt.daten["PutzeMoertel.literatur"]} 
        regelwerke={inhalt.daten["PutzeMoertel.regelwerke"]} 
        formeln={inhalt.daten["PutzeMoertel.formeln"]} 
      />
    </div>
  );
}
