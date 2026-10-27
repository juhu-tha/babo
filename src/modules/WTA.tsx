import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { 
  FileText, 
  Building, 
  Droplets, 
  Thermometer, 
  ShieldCheck, 
  Sliders, 
  Calculator, 
  AlertTriangle, 
  Lightbulb,
  Info,
  Compass
} from 'lucide-react';
import inhalt from '@/content/wta/WTA.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

// Hygrothermal evaluation for combination of WTA horizontal barrier and interior insulation
const evaluateKombination = (
  daemmType: 'calciumsilicat' | 'holzfaser' | 'mineralschaum' | 'pur_foelie',
  sperreStatus: 'ok' | 'critical' | 'none',
  salzClass: 'low' | 'medium' | 'high',
  regenClass: 'group1' | 'group2' | 'group3'
) => {
  let score = 100; // Start with max safety points
  const criticalAlarms: string[] = [];
  const recommendations: string[] = [];
  
  // 1. Horizontalsperre check (WTA 4-10)
  if (sperreStatus === 'none') {
    score -= 50;
    criticalAlarms.push(inhalt.werte.mangelhafteHorizontalsperreZwingtKapilla);
    recommendations.push(inhalt.werte.sanierenSieZwingendZuerst);
  } else if (sperreStatus === 'critical') {
    score -= 20;
    criticalAlarms.push(inhalt.werte.erhöhteMauerwerksRestfeuchteIm);
    recommendations.push(inhalt.werte.trocknungsphaseDesMauerwerksEinplanen);
  }
  
  // 2. Salzklasse check (WTA 2-9)
  if (salzClass === 'high') {
    score -= 30;
    criticalAlarms.push(inhalt.werte.hoheSalzbeladungKlasseS3);
    recommendations.push(inhalt.werte.tragenSieZwingendVor);
  } else if (salzClass === 'medium' && daemmType !== 'calciumsilicat') {
    score -= 10;
    recommendations.push(inhalt.werte.beiMittleremSalzgehaltUnd);
  }

  // 3. Schlagregenschutz der Fassadenaußenfläche (DIN 4108-3)
  if (regenClass === 'group3') {
    score -= 25;
    criticalAlarms.push(inhalt.werte.extremerSchlagregeneintragAnDer);
    recommendations.push(inhalt.werte.bringenSieAußenEine);
  } else if (regenClass === 'group2') {
    recommendations.push(inhalt.werte.eventuellVorhandenePutzrisseAn);
  }

  // 4. Dämmstoff-Eigenschaften & Systemcharakter
  if (daemmType === 'pur_foelie') {
    score -= 40;
    criticalAlarms.push(inhalt.werte.diffusionsdichtePurSystemeMit);
    recommendations.push(inhalt.werte.wählenSieBevorzugtKapillaraktive);
  } else if (daemmType === 'calciumsilicat') {
    score += 15; // calcareous systems are highly robust
    recommendations.push(inhalt.werte.calciumsilicatBietetDieHöchste);
  } else if (daemmType === 'holzfaser') {
    if (sperreStatus !== 'ok') {
      score -= 15;
      criticalAlarms.push(inhalt.werte.organischeHolzweichfaserplattenNeigenBei);
    }
    recommendations.push(inhalt.werte.holzfaserdämmungenNurAnHygrisch);
  }

  // Border constraints for Score
  score = Math.max(0, Math.min(100, score));
  
  let ampelColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  let suitabilityLabel = inhalt.werte.hygrischUnbedenklich;
  if (score < 40) {
    ampelColor = "text-red-700 bg-red-50 border-red-350 animate-pulse";
    suitabilityLabel = inhalt.werte.sehrHohesSchadensrisikoNicht;
  } else if (score < 75) {
    ampelColor = "text-orange-700 bg-orange-50 border-orange-200";
    suitabilityLabel = inhalt.werte.bedingtWtaKonformerAufbau;
  }

  return { score, suitabilityLabel, ampelColor, criticalAlarms, recommendations };
};

type WtaReiter = 'injektion' | 'sanierputz' | 'innendaemmung' | 'pruefung' | 'kombination' | 'abdichtung_4_6';
const REITER: readonly ModulTab<WtaReiter>[] = [
  { id: 'injektion', label: inhalt.texte.wta410Horizontalsperre.trim(), icon: Droplets },
  { id: 'sanierputz', label: inhalt.texte.wta29Sanierputzsysteme.trim(), icon: Building },
  { id: 'innendaemmung', label: inhalt.texte.wta65Innendämmung.trim(), icon: Thermometer },
  { id: 'pruefung', label: inhalt.texte.qualitätsprüfungQs.trim(), icon: ShieldCheck },
  { id: 'kombination', label: inhalt.texte.kombiPlanerTab5.trim(), icon: Sliders },
  { id: 'abdichtung_4_6', label: inhalt.texte.wta46Din.trim(), icon: Compass },
];

export default function WTA() {
  const [activeTab, setActiveTab] = useState<WtaReiter>('injektion');
  
  // Tab 5: Kombination WTA-Sanierung & Innendämmung States
  const [kombiDaemm, setKombiDaemm] = useState<'calciumsilicat' | 'holzfaser' | 'mineralschaum' | 'pur_foelie'>('calciumsilicat');
  const [kombiSperre, setKombiSperre] = useState<'ok' | 'critical' | 'none'>('ok');
  const [kombiSalz, setKombiSalz] = useState<'low' | 'medium' | 'high'>('medium');
  const [kombiRegen, setKombiRegen] = useState<'group1' | 'group2' | 'group3'>('group2');

  // Configurator states
  const [wallThicknessInput, setWallThicknessInput] = useState<number>(36); // in cm
  const [moistureLevel, setMoistureLevel] = useState<number>(55); // in % Durchfeuchtungsgrad (DF)
  const [saltLoad, setSaltLoad] = useState<'low' | 'medium' | 'high'>('medium');
  const [masonryType, setMasonryType] = useState<'brick' | 'mixed' | 'hollow'>('brick');
  
  // Calculate Drilling Parameters based on WTA 4-10
  const drillDepth = Math.max(1, wallThicknessInput - 5);
  
  // Bohrlochabstand can vary based on masonry structure
  let drillSpacing = 12; // default in cm
  if (masonryType === 'mixed') {
    drillSpacing = 10;
  } else if (masonryType === 'hollow') {
    drillSpacing = 8; // tighter for hollow tile structures
  }
  
  // Recommended Bohrlochdurchmesser
  const drillDiameter = 1.2; // 12 mm for cream injection
  
  // Number of boreholes per meter
  const holesPerMeter = Math.ceil(100 / drillSpacing);
  
  // Calculate Silane-Cream Consumption with Safety-Factor 1.15
  // Vol = (pi * D^2 / 4) * L * n * 1.15 / 1000 (to get Liters)
  const singleHoleVolume = (Math.PI * Math.pow(drillDiameter, 2) / 4) * drillDepth; // cm³
  const rawTotalVolume = (singleHoleVolume * holesPerMeter) / 1000; // Liters
  const creamConsumption = rawTotalVolume * 1.15; // Liter/m with 15% safety factor
  
  // Infiltration selection logic based on WTA 4-10 moisture (DF) limits
  let injectionMethod = '';
  let maxDFAllowed = '';
  let angleSpec = '';
  let wtaClassification = '';
  let preheatRequired = false;
  
  if (moistureLevel <= 60) {
    injectionMethod = inhalt.werte.druckloseKapillareInjektionInjektionscre;
    maxDFAllowed = inhalt.werte.geeignetBisZuEinem;
    angleSpec = masonryType === 'brick' ? inhalt.werte.horizontal0Bis5 : inhalt.werte.horizontal0UnmittelbarIn;
    wtaClassification = inhalt.werte.zulässigesWtaKlassifizierungsverfahrenDr;
  } else if (moistureLevel > 60 && moistureLevel <= 95) {
    injectionMethod = inhalt.werte.druckinjektionNiederOderMitteldruckverfa;
    maxDFAllowed = inhalt.werte.grenzbereichDesFüllungsgrades60;
    angleSpec = inhalt.werte.leichtGeneigt5Bis;
    wtaClassification = inhalt.werte.zulässigesWtaKlassifizierungsverfahrenDr2;
  } else {
    injectionMethod = inhalt.werte.zweistufigesVerfahrenThermischeMechanisc;
    maxDFAllowed = inhalt.werte.kritischerFüllungsgradDf95;
    angleSpec = inhalt.werte.keinDirekterInjektionserfolgVortrocknen;
    wtaClassification = inhalt.werte.erfordertFlankierendeBautechnischeMaßnah;
    preheatRequired = true;
  }

  // WTA Plaster formulation logic based on WTA 2-9 salt limit values
  let recommendedPlasterSystem = '';
  let recommendedPlasterSpecs = '';
  let plasterThickness = '';
  const spritzbewurfCover = inhalt.werte.warzenförmigerSpritzbewurfDeckungsgradMa;
  
  if (saltLoad === 'low') {
    recommendedPlasterSystem = inhalt.werte.wtaSanierputzEinlagig;
    recommendedPlasterSpecs = inhalt.werte.sanierputzMitHohemPorenvolumen;
    plasterThickness = inhalt.werte.mindestputzdickeDP20;
  } else if (saltLoad === 'medium') {
    recommendedPlasterSystem = inhalt.werte.wtaSanierputzEinOder;
    recommendedPlasterSpecs = inhalt.werte.geeignetZurSchadensfreienSalzeinlagerung;
    plasterThickness = inhalt.werte.mindestputzdickeDP202;
  } else {
    recommendedPlasterSystem = inhalt.werte.zweilagigesPutzsystemWtaPorengrundputz;
    recommendedPlasterSpecs = inhalt.werte.zwingenderAufbauBeiHoher;
    plasterThickness = inhalt.werte.t1LagePorengrundputzD;
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-350">
      
      {/* Module Title Section */}
      <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-shiraz/5 text-shiraz rounded-xl">
            <FileText size={28} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-main"><MdText text={inhalt.texte.wtaMerkblätterBauwerkserhaltungDenkmalpf} /></h2>
            <p className="text-xs text-home-grau mt-0.5"><MdText text={inhalt.texte.anerkannteRegelnDerTechnik} /></p>
          </div>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/35 leading-relaxed"><MdText text={inhalt.texte.dieWissenschaftlichTechnischeArbeitsgeme} /></div>
      </div>

      {/* Referat Structure Overview Grid */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
          <Building className="text-shiraz shrink-0" size={20} /><MdText text={inhalt.texte.wtaReferateDieZentralen} /></h3>
        <p className="text-xs text-text-main/75 -mt-2"><MdText text={inhalt.texte.merkblätterMitDemAnspruch} /></p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xs relative overflow-hidden flex flex-col gap-1.5 hover:shadow-md transition-all">
            <div className="text-xs font-extrabold text-shiraz/60 uppercase tracking-widest">Referat 1</div>
            <h4 className="font-bold text-slate-800 text-sm"><MdText text={inhalt.texte.natursteinSteinkonservierung} /></h4>
            <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.merkblattFokusWta1} /></p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xs relative overflow-hidden flex flex-col gap-1.5 hover:shadow-md transition-all">
            <div className="text-xs font-extrabold text-shiraz/60 uppercase tracking-widest">Referat 2</div>
            <h4 className="font-bold text-slate-800 text-sm"><MdText text={inhalt.texte.oberflächentechnologieSanierputzsysteme} /></h4>
            <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.merkblattFokusWta2} /></p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xs relative overflow-hidden flex flex-col gap-1.5 hover:shadow-md transition-all">
            <div className="text-xs font-extrabold text-shiraz/60 uppercase tracking-widest">Referat 3</div>
            <h4 className="font-bold text-slate-800 text-sm"><MdText text={inhalt.texte.betonBetoninstandsetzung} /></h4>
            <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.merkblattFokusWta3} /></p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xs relative overflow-hidden flex flex-col gap-1.5 hover:shadow-md transition-all">
            <div className="text-xs font-extrabold text-shiraz/60 uppercase tracking-widest">Referat 4</div>
            <h4 className="font-bold text-slate-800 text-sm"><MdText text={inhalt.texte.mauerwerkBauwerksabdichtung} /></h4>
            <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.merkblattFokusWta4} /></p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xs relative overflow-hidden flex flex-col gap-1.5 hover:shadow-md transition-all">
            <div className="text-xs font-extrabold text-shiraz/60 uppercase tracking-widest">Referat 8</div>
            <h4 className="font-bold text-slate-800 text-sm"><MdText text={inhalt.texte.fachwerkHolzkonstruktionen} /></h4>
            <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.merkblattFokusWta8} /></p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xs relative overflow-hidden flex flex-col gap-1.5 hover:shadow-md transition-all">
            <div className="text-xs font-extrabold text-shiraz/60 uppercase tracking-widest">Referat 6</div>
            <h4 className="font-bold text-slate-800 text-sm"><MdText text={inhalt.texte.bauphysikInnendämmung} /></h4>
            <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.merkblattFokusWta6} /></p>
          </div>
        </div>
      </section>
      <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-8 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/30 [&>[role=tablist]]:pb-3">

      {activeTab === 'injektion' && (
        <section className="bg-white rounded-2xl border border-home-grau/30 shadow-md p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-home-grau/25 pb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 px-2.5 bg-shiraz text-white rounded-lg text-xs font-mono font-bold"><MdText text={inhalt.texte.wta4102} /></div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-1.5">
                <Calculator className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.interaktiverSanierungskonfiguratorWirkst} /></h3>
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: User Parameters */}
          <div className="lg:col-span-5 space-y-5 bg-stone-50/50 p-5 rounded-xl border border-home-grau/35">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b pb-1.5 border-home-grau/20"><MdText text={inhalt.texte.t1BauwerksdatenSchadenslastEingeben} /></span>

            {/* Input 1: Wall Thickness slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-text-main flex items-center gap-1"><MdText text={inhalt.texte.mauerwerkWandstärkeD} /></label>
                <span className="font-mono font-bold text-shiraz bg-white border border-home-grau/20 px-2 py-0.5 rounded shadow-3xs">{formatDeWert(wallThicknessInput)} cm</span>
              </div>
              <input 
                type="range" 
                min={11.5} 
                max={100} 
                step={0.5}
                value={wallThicknessInput} 
                onChange={(e) => setWallThicknessInput(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <p className="text-xs text-home-grau flex justify-between">
                <span><MdText text={inhalt.texte.min115Cm} /></span>
                <span><MdText text={inhalt.texte.max100CmZ} /></span>
              </p>
            </div>

            {/* Input 2: Moisture Level slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-text-main flex items-center gap-1"><MdText text={inhalt.texte.mauerwerkDurchfeuchtungsgradDfSoll} /></label>
                <span className={`font-mono font-bold bg-white border px-2 py-0.5 rounded shadow-3xs ${moistureLevel > 95 ? 'text-red-600 border-red-200 animate-pulse' : moistureLevel > 60 ? 'text-orange-600 border-orange-200' : 'text-slate-800 border-home-grau/25'}`}>
                  {formatDeWert(moistureLevel)} % DF
                </span>
              </div>
              <input 
                type="range" 
                min={5} 
                max={100} 
                step={5}
                value={moistureLevel} 
                onChange={(e) => setMoistureLevel(parseInt(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
              />
              <p className="text-xs text-home-grau flex justify-between">
                <span>Gering (5%)</span>
                <span><MdText text={inhalt.texte.kritisch95} /></span>
                <span><MdText text={inhalt.texte.porenGesättigt100} /></span>
              </p>
            </div>

            {/* Input 3: Masonry Structure Radio */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-text-main block"><MdText text={inhalt.texte.typDesMauergefüges} /></label>
              <AuswahlGruppe label="Mauergefüge" className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button {...alsOption(masonryType === 'brick')}
                  type="button"
                  onClick={() => setMasonryType('brick')}
                  className={`py-2 px-2.5 rounded-lg border font-semibold text-center transition-all ${
                    masonryType === 'brick'
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-extrabold shadow-3xs'
                      : 'bg-white border-home-grau/25 text-slate-700 hover:bg-slate-100'
                  }`}
                ><MdText text={inhalt.texte.homogenerZiegel} /></button>
                <button {...alsOption(masonryType === 'mixed')}
                  type="button"
                  onClick={() => setMasonryType('mixed')}
                  className={`py-2 px-2.5 rounded-lg border font-semibold text-center transition-all ${
                    masonryType === 'mixed'
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-extrabold shadow-3xs'
                      : 'bg-white border-home-grau/25 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Mischmauerwerk
                </button>
                <button {...alsOption(masonryType === 'hollow')}
                  type="button"
                  onClick={() => setMasonryType('hollow')}
                  className={`py-2 px-2.5 rounded-lg border font-semibold text-center transition-all ${
                    masonryType === 'hollow'
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-extrabold shadow-3xs'
                      : 'bg-white border-home-grau/25 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Hohlkammerstein
                </button>
              </AuswahlGruppe>
            </div>

            {/* Input 4: Salt level selector */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-text-main block"><MdText text={inhalt.texte.sollSalzbelastungChlorideNitrate} /></label>
              <AuswahlGruppe label="Salzbelastung" className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button {...alsOption(saltLoad === 'low')}
                  type="button"
                  onClick={() => setSaltLoad('low')}
                  className={`py-2 px-2.5 rounded-lg border font-semibold text-center transition-all ${
                    saltLoad === 'low'
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-extrabold shadow-3xs'
                      : 'bg-white border-home-grau/25 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Gering
                </button>
                <button {...alsOption(saltLoad === 'medium')}
                  type="button"
                  onClick={() => setSaltLoad('medium')}
                  className={`py-2 px-2.5 rounded-lg border font-semibold text-center transition-all ${
                    saltLoad === 'medium'
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-extrabold shadow-3xs'
                      : 'bg-white border-home-grau/25 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Mittel
                </button>
                <button {...alsOption(saltLoad === 'high')}
                  type="button"
                  onClick={() => setSaltLoad('high')}
                  className={`py-2 px-2.5 rounded-lg border font-semibold text-center transition-all ${
                    saltLoad === 'high'
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-extrabold shadow-3xs'
                      : 'bg-white border-home-grau/30 text-slate-700 hover:bg-slate-100'
                  }`}
                ><MdText text={inhalt.texte.starkKritisch} /></button>
              </AuswahlGruppe>
            </div>

            {/* WTA Infobox on Salt loading */}
            <div className="p-3 bg-white/90 border border-home-grau/25 rounded-lg text-xs leading-relaxed text-slate-700 flex gap-2">
              <Info className="text-shiraz shrink-0 mt-0.5" size={14} />
              <div><MdText text={inhalt.texte.wtaGrenzwerteSalzSalzkristallisation} /></div>
            </div>

          </div>

          {/* RIGHT COLUMN: Output & WTA Calculation */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* WTA 4-10 Boring Calculator output card */}
            <div className="bg-[#FCFAF7] border border-home-grau/35 rounded-xl shadow-xs overflow-hidden">
              <div className="bg-stone-100/70 p-3.5 border-b border-home-grau/25 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={14} className="text-shiraz" /><MdText text={inhalt.texte.t2InjektionsSteckbriefWta} /></span>
                <span className="text-xs bg-white border border-home-grau/20 px-2 py-0.5 rounded font-mono font-bold text-slate-700">WTA 4-10</span>
              </div>
              
              <div className="p-5 space-y-4 text-xs text-slate-900">
                
                {/* Method Alert */}
                <div className={`p-3.5 rounded-lg border flex gap-3 leading-relaxed items-start ${preheatRequired ? 'bg-red-50 border-red-200 text-red-950' : 'bg-white border-home-grau/20 text-slate-900'}`}>
                  <AlertTriangle className={preheatRequired ? 'text-red-600 mt-0.5 shrink-0' : 'text-shiraz mt-0.5 shrink-0'} size={18} />
                  <div>
                    <span className="font-extrabold text-[12px] block">WTA-Verfahren: {injectionMethod}</span>
                    <p className="text-xs mt-0.5">{maxDFAllowed}</p>
                  </div>
                </div>

                {/* Drilling Parameters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded border border-home-grau/20 flex flex-col justify-between">
                    <span className="text-home-grau text-xs uppercase font-bold tracking-tight"><MdText text={inhalt.texte.errechneteBohrlochtiefeTB} /></span>
                    <span className="text-xl font-mono font-black text-slate-900 mt-1">{formatDeWert(drillDepth)} cm</span>
                    <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.formelTBD} /></p>
                  </div>

                  <div className="bg-white p-3 rounded border border-home-grau/20 flex flex-col justify-between">
                    <span className="text-home-grau text-xs uppercase font-bold tracking-tight"><MdText text={inhalt.texte.maxBohrlochabstandA} /></span>
                    <span className="text-xl font-mono font-black text-slate-900 mt-1">{formatDeWert(drillSpacing)} cm</span>
                    <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.engeBohrungSichertEine} /></p>
                  </div>

                  <div className="bg-white p-3 rounded border border-home-grau/20 flex flex-col justify-between">
                    <span className="text-home-grau text-xs uppercase font-bold tracking-tight"><MdText text={inhalt.texte.bohrwinkelDurchmesserDB} /></span>
                    <span className="text-sm font-bold text-slate-800 mt-1">Durchmesser: {formatDeWert(drillDiameter * 10)} mm</span>
                    <p className="text-xs text-slate-500 mt-1">{angleSpec}</p>
                  </div>

                  <div className="bg-white p-3 rounded border border-home-grau/20 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-1 bottom-1 bg-shiraz/5 p-2 rounded-tl-lg text-xs font-black text-shiraz/30">Creme</div>
                    <span className="text-home-grau text-xs uppercase font-bold tracking-tight"><MdText text={inhalt.texte.wirkstoffbedarfSilanCremeV} /></span>
                    <span className="text-xl font-mono font-black text-shiraz mt-1">{formatDeZahl(creamConsumption, 2)} Liter / m</span>
                    <p className="text-xs text-slate-500 mt-1"><MdText text={inhalt.texte.inklusive115erSicherheitsbeiwert} /></p>
                  </div>
                </div>

                {/* Mathematical Equation presentation */}
                <div className="bg-white/80 p-3 rounded border border-home-grau/20 text-xs leading-relaxed">
                  <span className="font-bold text-slate-700 block mb-1"><MdText text={inhalt.texte.herleitungDerBedarfsformelNach} /></span>
                  <div className="bg-slate-50 p-2 rounded border border-home-grau/15 text-center text-xs text-shiraz leading-normal my-1.5 overflow-x-auto">
                    <BlockMath math="V_{\text{meter}} = \frac{100}{a} \cdot \left[ \frac{\pi \cdot D_B^2}{4} \cdot t_B \right] \cdot F_{\text{Sicherheit}} \cdot 10^{-3} \quad [\text{Liter/m}]" />
                  </div>
                  <p className="text-xs text-slate-500 text-center leading-normal"><MdText text={inhalt.texte.berechneterEinzelfüllungsinhaltProBohrlo} />{formatDeZahl(singleHoleVolume, 1)}<MdText text={inhalt.texte.cmMultipliziertMitN} />{formatDeWert(holesPerMeter)}<MdText text={inhalt.texte.bohrungenProMeter} /></p>
                </div>

                <div className="bg-amber-50/50 border border-amber-200/80 p-3 rounded-lg text-xs text-amber-900 leading-normal"><MdText text={inhalt.texte.wta410Qualitätshinweis} /></div>

              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {activeTab === 'sanierputz' && (
        <section className="bg-white rounded-2xl border border-home-grau/30 shadow-md p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-home-grau/25 pb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 px-2.5 bg-shiraz text-white rounded-lg text-xs font-mono font-bold">WTA 2-9</div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-1.5">
                <Building className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.sanierputzeSalzspeicherungWta2} /></h3>
            </div>
            <span className="text-xs text-home-grau font-mono"><MdText text={inhalt.texte.standWtaMerkblatt2} /></span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 bg-[#FCFAF7] p-5 rounded-xl border border-home-grau/35 space-y-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest block border-b pb-1.5 border-home-grau/25"><MdText text={inhalt.texte.t1SalzlastklasseWählen} /></span>
              <div className="space-y-2 text-xs">
                <label className="font-bold text-text-main block"><MdText text={inhalt.texte.bauschädlicheSalzkonzentration} /></label>
                <AuswahlGruppe label="Salzlastklasse" className="grid grid-cols-1 gap-2">
                  <button {...alsOption(saltLoad === 'low')}
                    type="button"
                    onClick={() => setSaltLoad('low')}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all flex justify-between items-center ${
                      saltLoad === 'low'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-extrabold'
                        : 'bg-white border-home-grau/25 text-slate-700'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.gering01M} /></span>
                  </button>
                  <button {...alsOption(saltLoad === 'medium')}
                    type="button"
                    onClick={() => setSaltLoad('medium')}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all flex justify-between items-center ${
                      saltLoad === 'medium'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-extrabold'
                        : 'bg-white border-home-grau/25 text-slate-700'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.mittel010} /></span>
                  </button>
                  <button {...alsOption(saltLoad === 'high')}
                    type="button"
                    onClick={() => setSaltLoad('high')}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all flex justify-between items-center ${
                      saltLoad === 'high'
                        ? 'bg-shiraz/5 border-shiraz text-shiraz font-extrabold'
                        : 'bg-white border-home-grau/25 text-slate-700'
                    }`}
                  >
                    <span><MdText text={inhalt.texte.hoch05M} /></span>
                  </button>
                </AuswahlGruppe>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-[#FCFAF7] border border-home-grau/35 rounded-xl shadow-xs overflow-hidden">
                <div className="bg-stone-100/70 p-3.5 border-b border-home-grau/25 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <Building size={14} className="text-shiraz" /><MdText text={inhalt.texte.t2PutzsystemempfehlungWtaMerkblatt} /></span>
                  <span className="text-xs bg-white border border-home-grau/20 px-2 py-0.5 rounded font-mono font-bold text-slate-700">WTA 2-9</span>
                </div>

              <div className="p-5 space-y-4 text-xs text-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-home-grau text-xs uppercase font-bold tracking-tight block"><MdText text={inhalt.texte.empfohlenesSystem} /></span>
                    <span className="font-extrabold text-shiraz text-[13px] block">{recommendedPlasterSystem}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-home-grau text-xs uppercase font-bold tracking-tight block"><MdText text={inhalt.texte.vorgeschriebenePutzdicke} /></span>
                    <span className="font-extrabold text-slate-900 text-[13px] block">{plasterThickness}</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded border border-home-grau/35 space-y-2 leading-relaxed">
                  <span className="font-bold text-slate-800 block border-b border-home-grau/20 pb-1"><MdText text={inhalt.texte.spezifikationDesSystems} /></span>
                  <p className="text-xs text-slate-700">{recommendedPlasterSpecs}</p>
                </div>

                <div className="bg-white p-3.5 rounded border border-home-grau/35 space-y-2 leading-relaxed">
                  <span className="font-bold text-slate-800 block border-b border-home-grau/20 pb-1"><MdText text={inhalt.texte.anforderungenAnSpritzbewurfUntergrund} /></span>
                  <p className="text-xs text-slate-700">{spritzbewurfCover}</p>
                  <p className="text-[11.5px] text-slate-600 border-t border-dotted border-home-grau/20 pt-1.5 font-semibold text-shiraz"><MdText text={inhalt.texte.keinKalkhaltigerGlattputzKeine} /></p>
                </div>
              </div>
            </div>

          </div>

          {/* Zusatzbereich: Wissenschaftliche Grundlagen zu Sanierputzen & Salzmechanik */}
          <div className="border-t border-home-grau/20 pt-6 space-y-6">
            <h4 className="text-sm font-black text-text-main flex items-center gap-2 uppercase tracking-wider">
              <Lightbulb className="text-shiraz shrink-0" size={16} /><MdText text={inhalt.texte.wissenschaftlicheGrundlagenWirkprinzipie} /></h4>

            {/* 2-Column Grid: Werkstofftechnik & Kristallisationsdruck */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Spalte 1: Hydrophobierung & Phasenübergang */}
              <div className="bg-[#FCFAF7] p-5 rounded-xl border border-home-grau/35 space-y-3 leading-relaxed text-slate-800">
                <span className="font-bold text-shiraz text-xs block border-b border-home-grau/25 pb-1 uppercase tracking-tight"><MdText text={inhalt.texte.t1KombinierterWirkmechanismusHydrophobier} /></span>
                <p><MdText text={inhalt.texte.imGegensatzZuHerkömmlichen} /></p>
                <p><MdText text={inhalt.texte.diesFührtZuEiner} /></p>
                <div className="p-3 bg-white rounded border border-home-grau/20 text-[11px] space-y-1">
                  <span className="font-bold text-slate-700 block"><MdText text={inhalt.texte.dampfdurchlässigkeitWassereindringtiefe} /></span>
                  <p><MdText text={inhalt.texte.derPutzBleibtFür} /></p>
                  <div className="font-mono text-center text-shiraz font-bold mt-1 text-xs">
                    <BlockMath math="w_{24} \le 0{,}2\,\text{kg/(m}^2\cdot\text{h}^{0{,}5}) \quad \text{und} \quad s_d \le 0{,}2\,\text{m}" />
                  </div>
                </div>
              </div>

              {/* Spalte 2: Salzchemie & Kristallisationsdruck */}
              <div className="bg-[#FCFAF7] p-5 rounded-xl border border-home-grau/35 space-y-3 leading-relaxed text-slate-800">
                <span className="font-bold text-shiraz text-xs block border-b border-home-grau/25 pb-1 uppercase tracking-tight"><MdText text={inhalt.texte.t2SalzchemieKristallisationsdruckSigma} /></span>
                <p><MdText text={inhalt.texte.wennSalzeVorAllem} /></p>
                <p><MdText text={inhalt.texte.derTheoretischeKristallisationsdruckWird} /></p>
                <div className="bg-off-white text-text-main p-3.5 rounded-xl border border-home-grau/30 font-mono text-[11px] my-2 text-center shadow-xs">
                  <BlockMath math="\sigma_k = \frac{R \cdot T}{V_m} \cdot \ln\left(\frac{C}{C_0}\right)" />
                  <span className="text-[10px] text-text-main/70 block mt-1 font-sans"><MdText text={inhalt.texte.rGaskonstanteTTemp} /></span>
                </div>
                <p><MdText text={inhalt.texte.dieserDruckKannWerte} /></p>
              </div>
            </div>

            {/* Vergleichstabelle Putztypen */}
            <div className="bg-white rounded-xl border border-home-grau/30 overflow-hidden shadow-xs">
              <div className="bg-stone-100/70 p-3 border-b border-home-grau/25">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-widest block"><MdText text={inhalt.texte.vergleichstabellePutzsystemeImAltbau} /></span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-home-grau/25">
                      <th className="p-2.5 font-bold text-slate-700">Kenngröße</th>
                      <th className="p-2.5 font-bold text-slate-700"><MdText text={inhalt.texte.normZementputzGpCs} /></th>
                      <th className="p-2.5 font-bold text-slate-700"><MdText text={inhalt.texte.reinerLuftkalkputzGpCs} /></th>
                      <th className="p-2.5 font-bold text-shiraz"><MdText text={inhalt.texte.wtaSanierputzTypR} /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/15 text-[11.5px] text-slate-700">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">Gesamtporosität</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.ca1520Vol} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.ca3035Vol} /></td>
                      <td className="p-2.5 font-semibold text-slate-900 bg-shiraz/5"><MdText text={inhalt.texte.t40VolExtremPorös} /></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">Porencharakter</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.feineKapillarporenSaugend} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.mittelporigBedingtKapillaraktiv} /></td>
                      <td className="p-2.5 font-semibold text-slate-900 bg-shiraz/5"><MdText text={inhalt.texte.spezifischesMakroporennetz25Luftporen} /></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800"><MdText text={inhalt.texte.kapillareWasseraufnahme} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.sehrHochSaugtFeuchtigkeit} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.mittelBisHoch} /></td>
                      <td className="p-2.5 font-semibold text-slate-900 bg-shiraz/5"><MdText text={inhalt.texte.starkHydrophobiertWasserabweisend} /></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">Salzbeständigkeit</td>
                      <td className="p-2.5 text-red-600 font-medium"><MdText text={inhalt.texte.ungenügendSprenggefahr} /></td>
                      <td className="p-2.5 text-red-600 font-medium"><MdText text={inhalt.texte.geringSalzauswaschung} /></td>
                      <td className="p-2.5 font-bold text-emerald-700 bg-shiraz/5 font-mono"><MdText text={inhalt.texte.exzellentSchadloseDepotaufnahme} /></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800"><MdText text={inhalt.texte.eModulNMm} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.ca1000015} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.ca10003} /></td>
                      <td className="p-2.5 font-semibold text-slate-900 bg-shiraz/5"><MdText text={inhalt.texte.ca20004} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ausführungsschritte nach WTA-Merkblatt 2-9 */}
            <div className="bg-[#FCFAF7] p-5 rounded-xl border border-home-grau/35 space-y-3">
              <span className="font-bold text-slate-800 text-xs block border-b border-home-grau/25 pb-1 uppercase tracking-tight"><MdText text={inhalt.texte.normgerechteHandwerklicheVerarbeitungssc} /></span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-3.5 rounded border border-home-grau/20 space-y-1">
                  <span className="font-bold text-shiraz flex items-center gap-1.5">
                    <span className="w-4 h-4 bg-shiraz text-white rounded-full font-mono text-[9px] flex items-center justify-center font-bold">1</span><MdText text={inhalt.texte.altputzabtragFugenschnitt} /></span>
                  <p className="text-slate-650 text-[11px] leading-relaxed pt-1"><MdText text={inhalt.texte.schadhafterAltputzIstBis} /></p>
                </div>

                <div className="bg-white p-3.5 rounded border border-home-grau/20 space-y-1">
                  <span className="font-bold text-shiraz flex items-center gap-1.5">
                    <span className="w-4 h-4 bg-shiraz text-white rounded-full font-mono text-[9px] flex items-center justify-center font-bold">2</span><MdText text={inhalt.texte.wtaHaftbrückeAuswurf} /></span>
                  <p className="text-slate-650 text-[11px] leading-relaxed pt-1"><MdText text={inhalt.texte.alsHaftvermittlerWirdEin} /></p>
                </div>

                <div className="bg-white p-3.5 rounded border border-home-grau/20 space-y-1">
                  <span className="font-bold text-shiraz flex items-center gap-1.5">
                    <span className="w-4 h-4 bg-shiraz text-white rounded-full font-mono text-[9px] flex items-center justify-center font-bold">3</span><MdText text={inhalt.texte.mindestputzdickenEndfinish} /></span>
                  <p className="text-slate-650 text-[11px] leading-relaxed pt-1"><MdText text={inhalt.texte.dieGesamtdickeDesSanierputzes} /></p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      )}

      {activeTab === 'innendaemmung' && (
        <section className="bg-white rounded-2xl border border-home-grau/30 shadow-md p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-home-grau/25 pb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 px-2.5 bg-shiraz text-white rounded-lg text-xs font-mono font-bold"><MdText text={inhalt.texte.wta656} /></div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-1.5">
                <Thermometer className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.bauphysikalischeInnendämmungWta6} /></h3>
            </div>
            <span className="text-xs text-home-grau font-mono"><MdText text={inhalt.texte.standWtaMerkblatt6} /></span>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-850 leading-relaxed font-semibold"><MdText text={inhalt.texte.eineAußendämmungGefährdetBei} /></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/20 space-y-2 text-xs">
                <span className="font-bold text-shiraz block"><MdText text={inhalt.texte.dasKapillaraktivDiffusionsoffeneSystem} /></span>
                <p className="leading-relaxed"><MdText text={inhalt.texte.dämmstoffeWieCalciumsilicatPlatten} /></p>
                <div className="text-xs border-t border-dotted border-home-grau/25 pt-2 mt-2 font-semibold text-text-main"><MdText text={inhalt.texte.keineDampfsperrfolienNotwendigDie} /></div>
              </div>

              <div className="bg-stone-50 p-[#faf9f6]/90 p-4 rounded-xl border border-home-grau/20 space-y-2 text-xs">
                <span className="font-bold text-shiraz block"><MdText text={inhalt.texte.wta65Simulative} /></span>
                <p className="leading-relaxed"><MdText text={inhalt.texte.lautWtaMerkblatt6} /></p>
                <div className="text-xs border-t border-dotted border-home-grau/25 pt-2 mt-2 font-semibold text-text-main"><MdText text={inhalt.texte.simulationenZBWufi} /></div>
              </div>
            </div>
          </div>
        </section>
      )}
      {activeTab === 'pruefung' && (
        <section className="bg-white rounded-2xl border border-home-grau/30 shadow-md p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-home-grau/25 pb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 px-2.5 bg-shiraz text-white rounded-lg text-xs font-mono font-bold"><MdText text={inhalt.texte.wtaQualitätsprüfung} /></div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-1.5">
                <ShieldCheck className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.prüfÜberwachungspflichtenZurBauwerkserha} /></h3>
            </div>
            <span className="text-xs text-home-grau font-mono"><MdText text={inhalt.texte.standVobBWta} /></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              <p className="leading-relaxed text-slate-800 font-semibold"><MdText text={inhalt.texte.wtaSanierungenSindHochgradig} /></p>
              
              <ul className="list-disc pl-5 text-slate-700 space-y-2.5 leading-relaxed">
                <li><MdText text={inhalt.texte.befundprüfungDesUntergrundsGenaue} /></li>
                <li><MdText text={inhalt.texte.amtlicheVerpressprotokollierungGenaueAng} /></li>
                <li><MdText text={inhalt.texte.fremdüberwachungSicherheitsSiegelNur} /></li>
              </ul>
            </div>

            {/* Interactive Protocol Formular Mock for educational value */}
            <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/25 space-y-3">
              <span className="text-xs font-bold text-slate-900 block border-b pb-1.5 border-home-grau/20"><MdText text={inhalt.texte.interaktivesVerpressprotokollFormularWta} /></span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block text-home-grau font-semibold mb-0.5">Prüfobjekt:</span>
                  <input type="text" placeholder={inhalt.werte.historischesRathausSockel} className="w-full bg-white border border-home-grau/30 rounded p-1" />
                </div>
                <div>
                  <span className="block text-home-grau font-semibold mb-0.5"><MdText text={inhalt.texte.ausführendeFirma} /></span>
                  <input type="text" placeholder={inhalt.werte.bautenschutzDenkmalbau} className="w-full bg-white border border-home-grau/30 rounded p-1" />
                </div>
                <div>
                  <span className="block text-home-grau font-semibold mb-0.5">Injektions-Wirkstoff:</span>
                  <input aria-label="Injektions-Wirkstoff" type="text" defaultValue="Silan-Creme (80% Wirkstoff)" className="w-full bg-white border border-home-grau/30 rounded p-1 text-shiraz font-semibold" />
                </div>
                <div>
                  <span className="block text-home-grau font-semibold mb-0.5"><MdText text={inhalt.texte.packerdruckMaxBar} /></span>
                  <input aria-label={inhalt.werte.packerdruckMaxBar} type="number" min="0" defaultValue={5} className="w-full bg-white border border-home-grau/30 rounded p-1 font-mono font-bold" />
                </div>
              </div>
              <p className="text-xs text-home-grau leading-tight italic"><MdText text={inhalt.texte.sichereAbnahmeDasGeführte} /></p>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'kombination' && (
        <section className="bg-white rounded-2xl border border-home-grau/30 shadow-md p-6 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-home-grau/25 pb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 px-2.5 bg-shiraz text-white rounded-lg text-xs font-mono font-bold"><MdText text={inhalt.texte.kombinatorischerBauphysikRechner} /></div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-1.5 font-sans">
                <Sliders className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.kombiPlanerWtaSanierung} /></h3>
            </div>
            <span className="text-xs text-home-grau font-mono"><MdText text={inhalt.texte.nachWtaRichtlinien6} /></span>
          </div>

          <div className="text-xs text-slate-800 bg-[#FAF9F5] p-4 border border-home-grau/25 rounded-xl leading-relaxed font-semibold"><MdText text={inhalt.texte.dieMaterialübergreifendeHerausforderungD} /></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Selection Block - 5 columns */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-4 bg-[#FCFAF7] p-5 rounded-xl border border-home-grau/35">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest block border-b pb-1.5 border-home-grau/25"><MdText text={inhalt.texte.systemParameterAbstimmen} /></span>

              {/* 1. Innendämmsystem */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-text-main block">Innendämm-System:</label>
                <select aria-label="Innendämm-System" 
                  value={kombiDaemm} 
                  onChange={(e) => setKombiDaemm(e.target.value as typeof kombiDaemm)}
                  className="w-full bg-white border border-home-grau/30 rounded-lg p-2 font-semibold"
                >
                  <option value="calciumsilicat">Calciumsilicat-Platte (kapillaraktiv, mineralisch, basisch)</option>
                  <option value="holzfaser">Holzweichfaserplatte (kapillaraktiv, organisch, Holzgut)</option>
                  <option value="mineralschaum">Mineralschaumplatte (diffusionsoffen, dämmstark, mineralisch)</option>
                  <option value="pur_foelie">PUR-Schaumplatte mit Alufolien-Dampfsperre (diffusionsdicht)</option>
                </select>
              </div>

              {/* 2. Zustand Horizontalsperre */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-text-main block"><MdText text={inhalt.texte.vorschaltHorizontalsperreWta4} /></label>
                <select aria-label={inhalt.werte.vorschaltHorizontalsperreWta4} 
                  value={kombiSperre} 
                  onChange={(e) => setKombiSperre(e.target.value as typeof kombiSperre)}
                  className="w-full bg-white border border-home-grau/30 rounded-lg p-2 font-semibold"
                >
                  <option value="ok">Funktionstüchtig &amp; unbedenklich (Mauerfeuchte DF ≤ 60%)</option>
                  <option value="critical">Vorhanden, aber Restfeuchte kritisch (DF 60% – 85%)</option>
                  <option value="none">Undicht / Keine Sperre vorhanden (DF &gt; 85% - permanent nass)</option>
                </select>
              </div>

              {/* 3. Mauerwerks-Salzbelastung */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-text-main block"><MdText text={inhalt.texte.mauerwerksSalzbelastungWta2} /></label>
                <select aria-label={inhalt.werte.mauerwerksSalzbelastungWta2} 
                  value={kombiSalz} 
                  onChange={(e) => setKombiSalz(e.target.value as typeof kombiSalz)}
                  className="w-full bg-white border border-home-grau/30 rounded-lg p-2 font-semibold"
                >
                  <option value="low">Vernachlässigbare Salzlast (WTA-Salzklasse S1)</option>
                  <option value="medium">Mäßiger Salzgehalt (WTA-Salzklasse S2)</option>
                  <option value="high">Kritische / Starke Salzkonzentration (WTA-Salzklasse S3)</option>
                </select>
              </div>

              {/* 4. Schlagregenschutz der Fassade */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-text-main block"><MdText text={inhalt.texte.schlagregenbelastungDerFassade} /></label>
                <select aria-label={inhalt.werte.schlagregenbelastungDerFassade} 
                  value={kombiRegen} 
                  onChange={(e) => setKombiRegen(e.target.value as typeof kombiRegen)}
                  className="w-full bg-white border border-home-grau/30 rounded-lg p-2 font-semibold"
                >
                  <option value="group1">Gering (Schattenlage / Wettergeschützt / Putz einwandfrei)</option>
                  <option value="group2">Mittel (Freie Stadtlage / Leichte Außenrisse korrigiert)</option>
                  <option value="group3">Sehr hoch (Freistehendes Sichtziegelmauerwerk / Wetterschlagseite)</option>
                </select>
              </div>
            </div>

            {/* Hygrothermal Evaluation output block - 7 columns */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-6">
              {(() => {
                const evalData = evaluateKombination(kombiDaemm, kombiSperre, kombiSalz, kombiRegen);

                return (
                  <div className="space-y-4">
                    {/* Suitability score meter */}
                    <div className="bg-[#FCFAF7] border border-home-grau/35 rounded-xl p-5 shadow-xs bg-white space-y-3">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-shiraz font-bold" /><MdText text={inhalt.texte.hygrothermischesKombinationsSiegel} /></span>
                        <div className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${evalData.ampelColor}`}>
                          {evalData.suitabilityLabel}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-[#FAF9F5] p-3 rounded border border-home-grau/20 text-center">
                          <span className="text-home-grau text-xs uppercase font-bold tracking-tight block">Kombi-Score</span>
                          <span className="text-3xl font-mono font-black text-slate-900 mt-1 block">{formatDeWert(evalData.score)} / 100</span>
                          <span className="text-xs text-home-grau font-semibold"><MdText text={inhalt.texte.punkteSicherheitsindex} /></span>
                        </div>

                        <div className="bg-[#FAF9F5] p-3 rounded border border-home-grau/20 text-center col-span-2 relative flex flex-col justify-between">
                          <span className="text-home-grau text-xs uppercase font-bold tracking-tight block"><MdText text={inhalt.texte.hauptratingVonWtaReferat} /></span>
                          <p className="text-xs font-bold text-slate-800 leading-snug mt-1.5">
                            {evalData.score >= 75 
                              ? inhalt.werte.aufbauGiltBauphysikalischNach 
                              : evalData.score >= 40 
                                ? inhalt.werte.mauerwerkskonditionenErfordernFlächenhaf 
                                : inhalt.werte.achtungExzessivesFeuchteschadenRisiko}
                          </p>
                        </div>
                      </div>

                      {/* Display alarms if any */}
                      {evalData.criticalAlarms.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-home-grau/15">
                          <span className="text-xs font-black text-red-750 uppercase block tracking-wider"><MdText text={inhalt.texte.dringendeGewährleistungsRisiken} /></span>
                          <div className="space-y-1.5">
                            {evalData.criticalAlarms.map((alarm, i) => (
                              <div key={i} className="flex gap-2 items-start bg-rose-50 text-rose-950 border border-rose-250 p-2.5 rounded-lg text-xs leading-relaxed">
                                <span className="text-rose-600 font-extrabold mt-0.5 shrink-0 block flex">▪</span>
                                <span>{alarm}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Display recommendations */}
                      <div className="space-y-2 pt-2 border-t border-home-grau/15">
                        <span className="text-xs font-bold text-slate-500 uppercase block tracking-wider"><MdText text={inhalt.texte.zwingendeWtaFahrplanmaßnahmenFür} /></span>
                        <ul className="space-y-1.5 list-none pl-0 text-xs">
                          {evalData.recommendations.map((rec, i) => (
                            <li key={i} className="flex gap-1.5 items-start text-slate-800 leading-relaxed font-semibold">
                              <span className="text-shiraz font-black text-[12px] shrink-0 mt-0.5">✔</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Schematic Dew Point / Condensation visualization diagram */}
                    <div className="bg-stone-50 border border-home-grau/25 rounded-xl p-4 space-y-3">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b border-home-grau/20 pb-1.5"><MdText text={inhalt.texte.hygrothermischerBaugefügeQuerschnittTaup} /></span>
                      
                      <div className="relative h-24 bg-white border border-home-grau/15 rounded-lg overflow-hidden flex" id="kombi-diagram-canvas-tab5">
                        {/* Outside section */}
                        <div className="w-2/12 bg-blue-500/5 flex items-center justify-center border-r border-dashed border-blue-300 relative text-xs text-blue-800 font-bold">
                          <span><MdText text={inhalt.texte.aussen5C} /></span>
                        </div>
                        {/* Outside render */}
                        <span className="w-[10px] bg-[#979797] block border-r border-stone-400"></span>
                        {/* Brick wall */}
                        <div className="flex-1 bg-amber-50/10 flex items-center justify-center relative font-sans text-xs text-orange-950 border-r border-dotted border-stone-300">
                          <span className="z-1 w-max font-bold"><MdText text={inhalt.texte.ziegelwand36Cm} /></span>
                          {kombiSperre !== 'ok' && (
                            <span className="absolute bottom-1 right-2 text-blue-600 animate-pulse font-bold text-[8.5px]"><MdText text={inhalt.texte.feuchteAktiv} /></span>
                          )}
                        </div>
                        {/* Bonding adhesive layer */}
                        <span className="w-[8px] bg-[#dfdcd6] block border-r border-home-grau/40"></span>
                        {/* Insulation board */}
                        <div className="w-3/12 bg-stone-100 flex items-center justify-center text-xs text-slate-800 font-semibold border-r border-solid border-stone-300 relative">
                          <span className="z-1 text-center scale-95 select-none leading-tight font-bold">{kombiDaemm === 'calciumsilicat' ? 'CaSi (6 cm)' : kombiDaemm === 'pur_foelie' ? 'PUR + Folie' : kombiDaemm === 'mineralschaum' ? 'Mineralschaum' : 'Holzfaser'}</span>
                          {/* Dewpoint marker */}
                          <div 
                            className="absolute top-0 bottom-0 w-1 bg-blue-600 transition-all duration-300"
                            style={{ 
                              left: kombiDaemm === 'pur_foelie' ? '1px' : '45%' 
                            }}
                          >
                            <span className="absolute -top-1 -left-2 text-[8px] bg-blue-600 text-white p-0.5 rounded-full font-sans scale-90">Taupunkt</span>
                          </div>
                        </div>
                        {/* Interior climate */}
                        <div className="w-2/12 bg-orange-500/5 flex items-center justify-center text-xs text-orange-850 font-bold">
                          <span><MdText text={inhalt.texte.innen20C} /></span>
                        </div>
                      </div>

                      <div className="text-xs leading-relaxed text-slate-600 italic">
                        {kombiDaemm === 'calciumsilicat' ? (
                          <p><MdText text={inhalt.texte.calciumsilicatVerlaufDerTaupunkt} /></p>
                        ) : kombiDaemm === 'pur_foelie' ? (
                          <p className="text-[#a51c1c] text-xs font-semibold"><MdText text={inhalt.texte.purFolieDampfsperrenVerlauf} /></p>
                        ) : kombiDaemm === 'holzfaser' ? (
                          <p className="text-orange-900 font-medium"><MdText text={inhalt.texte.holzfaserVerlaufKondensatinfiltrationAn} /></p>
                        ) : (
                          <p><MdText text={inhalt.texte.mineralschaumVerlaufDiffusionsoffenerMin} /></p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      {/* TAB 6: WTA 4-6 (Nachträgliche Abdichtung) & DIN 18533 */}
      {activeTab === 'abdichtung_4_6' && (
        <section className="bg-white rounded-2xl border border-home-grau/30 shadow-md p-6 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-home-grau/25 pb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 px-2.5 bg-shiraz text-white rounded-lg text-xs font-mono font-bold"><MdText text={inhalt.texte.wta46Din2} /></div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-1.5">
                <Compass className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.nachträglicheBauwerksabdichtungErdberühr} /></h3>
            </div>
            <span className="text-xs text-home-grau font-mono"><MdText text={inhalt.texte.standWta46} /></span>
          </div>

          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dasWtaMerkblatt4} /></p>
          <p className="text-[11px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.hinweisZurNeuausgabeDin} /></p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t1WassereinwirkungDin18533} /></span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-shiraz/10 text-shiraz rounded"><MdText text={inhalt.texte.w1EBisW4} /></span>
              </div>
              <ul className="text-[11px] text-text-main/70 space-y-1.5 list-disc list-inside">
                <li><MdText text={inhalt.texte.w11EBodenfeuchte} /></li>
                <li><MdText text={inhalt.texte.w12EBodenfeuchte} /></li>
                <li><MdText text={inhalt.texte.w21EMäßige} /></li>
                <li><MdText text={inhalt.texte.w22EHohe} /></li>
                <li><MdText text={inhalt.texte.w3ENichtDrückendes} /></li>
                <li><MdText text={inhalt.texte.w4ESpritzwasserUnd} /></li>
              </ul>
            </div>

            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t2SanierungsansätzeNachWta} /></span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded">Systemwahl</span>
              </div>
              <ul className="text-[11px] text-text-main/70 space-y-1.5 list-disc list-inside">
                <li><MdText text={inhalt.texte.freilegenAußenabdichtungBevorzugteLösung} /></li>
                <li><MdText text={inhalt.texte.nachträglicheInnenabdichtungNegativabdic} /></li>
                <li><MdText text={inhalt.texte.kombinationMitHorizontalsperrenDrucklose} /></li>
              </ul>
            </div>

            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.t3RaumnutzungRissklassen} /></span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded"><MdText text={inhalt.texte.rn1EBisRn3} /></span>
              </div>
              <ul className="text-[11px] text-text-main/70 space-y-1.5 list-disc list-inside">
                <li><MdText text={inhalt.texte.rn1EGeringTiefgaragen} /></li>
                <li><MdText text={inhalt.texte.rn2EÜblichKellerräume} /></li>
                <li><MdText text={inhalt.texte.rn3EHochWohnräume} /></li>
                <li><MdText text={inhalt.texte.rissüberbrückungsklassenRü1EOhne} /></li>
              </ul>
            </div>
          </div>
        </section>
      )}
      </ModuleTabs>

      {/* Module Footer (Wikipedia, Regelwerke, Literatur) aligned with WTA */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1DurchfeuchtungsgradVor}
        zielGleichung="DFG = \frac{u_m}{u_{max}}"
        schritte={inhalt.daten["WTA.schritte"]}
        ergebnisHinweis={inhalt.werte.injektionsstoffeSindNachWta}
        normQuelle={inhalt.werte.wtaMerkblatt410}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2InjektionsmittelbedarfJe}
        zielGleichung="V_{m} = \frac{100}{a} \cdot V_{Bohr} \cdot F_S"
        schritte={inhalt.daten["WTA.schritte_2"]}
        ergebnisHinweis={inhalt.werte.bohrlochabstandNeigungUndFüllmenge}
        normQuelle={inhalt.werte.wtaMerkblatt4102}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="wta" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap12} 
        weblinks={inhalt.daten["WTA.weblinks"]} 
        wikipedia={[
          { title: inhalt.werte.wissenschaftlichTechnischeArbeitsgemeins, url: "https://de.wikipedia.org/wiki/Wissenschaftlich-Technische_Arbeitsgemeinschaft_f%C3%BCr_Bauwerkserhaltung_und_Denkmalpflege" },
          { title: "Sanierputz", url: "https://de.wikipedia.org/wiki/Sanierputz" },
          { title: inhalt.werte.tränkenBauwesen }
        ]} 
        literatur={inhalt.daten["WTA.literatur"]} 
        regelwerke={inhalt.daten["WTA.regelwerke"]} 
        formeln={inhalt.daten["WTA.formeln"]} 
      />

    </div>
  );
}
