import { useState, useMemo } from 'react';
import {
  Sliders,
  Calculator,
  BookOpen,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { EC2_CONCRETE_CLASSES } from './betonkennwerte/daten';
import RechnerTab from './betonkennwerte/RechnerTab';
import TabelleTab from './betonkennwerte/TabelleTab';
import ZeitTheorieTab from './betonkennwerte/ZeitTheorieTab';
import PraxisTab from './betonkennwerte/PraxisTab';
import Ausblick2025Tab from './betonkennwerte/Ausblick2025Tab';
import TestTab from './betonkennwerte/TestTab';
import inhalt from '@/content/betonkennwerte/Betonkennwerte.json';
import { MdText } from '@/src/components/inhalt/MdText';
export { EC2_CONCRETE_CLASSES } from './betonkennwerte/daten';
export type { ConcreteClassData } from './betonkennwerte/daten';

export default function Betonkennwerte() {
  const [activeTab, setActiveTab] = useState<'rechner' | 'tabelle' | 'zeit_theorie' | 'praxis' | 'ausblick2025' | 'test'>('rechner');

  // Interactive Calculator State
  const [selectedClassIdx, setSelectedClassIdx] = useState<number>(4); // C30/37 (Default)
  const [cementClass, setCementClass] = useState<'S' | 'N' | 'R'>('N');
  const [aggregateType, setAggregateType] = useState<'quarzit' | 'kalkstein' | 'sandstein' | 'basalt'>('quarzit');
  const [relativeHumidity, setRelativeHumidity] = useState<number>(65); // %
  const [areaAc, setAreaAc] = useState<number>(0.20); // m²
  const [perimeterU, setPerimeterU] = useState<number>(1.8); // m
  const [elementHeightH, setElementHeightH] = useState<number>(300); // mm (für Biegezug f_ctm,fl)
  const [curingDaysTs, setCuringDaysTs] = useState<number>(3); // d
  const [loadingAgeT0, setLoadingAgeT0] = useState<number>(28); // d
  const [targetAgeT, setTargetAgeT] = useState<number>(18250); // 50 Jahre (18250 d)
  const [ambientTempT, setAmbientTempT] = useState<number>(20); // °C
  const [axialStressSigmaC, setAxialStressSigmaC] = useState<number>(8.0); // MPa
  const [elementLengthL, setElementLengthL] = useState<number>(12.0); // m

  // Quiz state for Tab 5
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  // Selected base class
  const baseConcrete = EC2_CONCRETE_CLASSES[selectedClassIdx];

  // ----------------------------------------------------------------------
  // DETERMINISTISCHE FORMELBERECHNUNG NACH DER REFERENZ-FORMELSAMMLUNG
  // (DIN EN 1992-1-1:2011-01 in Verbindung mit DIN EN 1992-1-1/NA:2013-04)
  // ----------------------------------------------------------------------
  const calcResults = useMemo(() => {
    const fck = baseConcrete.fck;
    
    // 1. Druckfestigkeit (Abschnitt 3.1.2 & 3.1.6)
    // f_cm = f_ck + 8 [MPa]
    const fcm = fck + 8;
    
    // Bemessungswert f_cd nach deutschem NA (alpha_cc = 0.85, gamma_c = 1.50)
    const alphaCc = 0.85;
    const gammaC = 1.50;
    const fcd = (alphaCc * fck) / gammaC;

    // Zementkoeffizient s für Festigkeitsentwicklung (Gl. 3.2):
    // 0.20 für Klasse R, 0.25 für Klasse N, 0.38 für Klasse S
    let s = 0.25;
    if (cementClass === 'S') s = 0.38;
    else if (cementClass === 'R') s = 0.20;

    // Temperaturkorrektur für Betonalter nach Anhang B.3:
    // t_T = sum( exp[ - (4000 / (273 + T) - 13.65) ] * delta_t )
    const tempFactor = Math.exp(-((4000 / (273 + ambientTempT)) - 13.65));
    const t0Temp = Math.max(0.1, loadingAgeT0 * tempFactor);
    const tTemp = Math.max(0.1, targetAgeT * tempFactor);

    // Festigkeitsentwicklung f_cm(t) = beta_cc(t) * f_cm
    const betaCcT0 = Math.exp(s * (1 - Math.sqrt(28 / t0Temp)));
    const fcmT0 = betaCcT0 * fcm;
    const fckT0 = Math.max(0, fcmT0 - 8);

    const betaCcT = Math.exp(s * (1 - Math.sqrt(28 / tTemp)));
    const fcmT = betaCcT * fcm;
    const fckT = Math.max(0, fcmT - 8);

    // 2. Zugfestigkeit (Abschnitt 3.1.2, 3.1.6 & 3.1.8)
    // f_ctm nach Tabelle 3.1:
    let fctm = 0;
    if (fck <= 50) {
      fctm = 0.30 * Math.pow(fck, 2 / 3);
    } else {
      fctm = 2.12 * Math.log(1 + fcm / 10);
    }
    const fctk005 = 0.70 * fctm;
    const fctk095 = 1.30 * fctm;
    const alphaCt = 0.85;
    const fctd = (alphaCt * fctk005) / gammaC;

    // Biegezugfestigkeit f_ctm,fl nach Gl. (3.23) mit h in mm
    const hMm = Math.max(50, elementHeightH);
    const scaleFactor = Math.max(1.0, 1.6 - hMm / 1000);
    const fctmFl = scaleFactor * fctm;

    // Spaltzugfestigkeit f_ct,sp nach Gl. (3.3): f_ctm ~ 0.90 * f_ct,sp
    const fctSp = fctm / 0.90;

    // Zeitliche Entwicklung der Zugfestigkeit nach Gl. (3.4):
    // f_ctm(t) = (beta_cc(t))^alpha * f_ctm mit alpha = 1.0 für t < 28 d, alpha = 2/3 für t >= 28 d
    const alphaExponent = targetAgeT < 28 ? 1.0 : (2 / 3);
    const fctmT = Math.pow(betaCcT, alphaExponent) * fctm;

    // 3. Elastizitätsmodul, Querdehnzahl & Schubmodul (Abschnitt 3.1.3)
    let alphaE = 1.0;
    if (aggregateType === 'basalt') alphaE = 1.2;
    else if (aggregateType === 'kalkstein') alphaE = 0.9;
    else if (aggregateType === 'sandstein') alphaE = 0.7;

    const Ecm = 22000 * Math.pow(fcm / 10, 0.3) * alphaE; // MPa
    const Ec0 = 1.05 * Ecm; // Tangentenmodul im Ursprung (Gl. Abs. 3.1.4(2))
    const EcmT0 = Math.pow(betaCcT0, 0.3) * Ecm; // E_cm(t0) nach Gl. (3.5)
    const EcmT = Math.pow(betaCcT, 0.3) * Ecm;   // E_cm(t) nach Gl. (3.5)

    // Schubmodul G_cm mit Querdehnzahl nu = 0.20 (ungerissen)
    const nuUngerissen = 0.20;
    const Gcm = Ecm / (2 * (1 + nuUngerissen)); // ~ 0.417 * E_cm

    // 4. Spannungs-Dehnungs-Linie Kennwerte (Abschnitt 3.1.5 & 3.1.7)
    // Dehnung bei Höchstspannung eps_c1 nach Tab. 3.1
    const epsC1 = Math.min(2.8, 0.7 * Math.pow(fcm, 0.31)); // ‰
    let epsCu1 = 3.5; // ‰
    if (fck > 50) {
      epsCu1 = 2.8 + 27 * Math.pow((98 - fcm) / 100, 4);
    }
    const kPlastizitaet = (1.05 * Ecm * (epsC1 / 1000)) / (fcm / 1000); // Gl. 3.14

    // Parabel-Rechteck Kennwerte nach Tab. 3.1
    let epsC2 = 2.0;
    let epsCu2 = 3.5;
    let exponentN = 2.0;
    if (fck > 50) {
      epsC2 = 2.0 + 0.085 * Math.pow(fck - 50, 0.53);
      epsCu2 = 2.6 + 35 * Math.pow((90 - fck) / 100, 4);
      exponentN = 1.4 + 23.4 * Math.pow((90 - fck) / 100, 4);
    }

    // 5. Schwinden des Betons (Abschnitt 3.1.4 & Anhang B.2)
    // Wirksame Bauteildicke h_0 = 2 * Ac / u in mm (Gl. 3.6)
    const AcMm2 = Math.max(0.001, areaAc) * 1e6;
    const uMm = Math.max(0.01, perimeterU) * 1e3;
    const h0 = Math.min(1500, Math.max(20, (2 * AcMm2) / uMm));

    // Autogenes Schwinden eps_ca(t) (Gl. 3.11 - 3.13)
    const epsCaInfty = 2.5 * Math.max(0, fck - 10) * 1e-6;
    const betaAs = 1 - Math.exp(-0.2 * Math.sqrt(Math.max(0, targetAgeT)));
    const epsCa = betaAs * epsCaInfty;

    // Trocknungsschwinden eps_cd(t, ts) (Gl. 3.9, 3.10 & B.11, B.12)
    let alphaDs1 = 4;
    let alphaDs2 = 0.12;
    if (cementClass === 'S') { alphaDs1 = 3; alphaDs2 = 0.13; }
    else if (cementClass === 'R') { alphaDs1 = 6; alphaDs2 = 0.11; }

    const RH = Math.min(100, Math.max(20, relativeHumidity));
    const betaRH = 1.55 * (1 - Math.pow(RH / 100, 3));
    const epsCd0 = 0.85 * ((220 + 110 * alphaDs1) * Math.exp(-alphaDs2 * (fcm / 10))) * 1e-6 * betaRH;

    // Geometriebeiwert k_h (Tabelle 3.3)
    let kh = 1.0;
    if (h0 <= 100) kh = 1.0;
    else if (h0 <= 200) kh = 1.0 - ((h0 - 100) / 100) * 0.15;
    else if (h0 <= 300) kh = 0.85 - ((h0 - 200) / 100) * 0.10;
    else if (h0 <= 500) kh = 0.75 - ((h0 - 300) / 200) * 0.05;
    else kh = 0.70;

    const deltaTds = Math.max(0, targetAgeT - curingDaysTs);
    const betaDs = deltaTds / (deltaTds + 0.04 * Math.sqrt(Math.pow(h0, 3)));
    const epsCd = betaDs * kh * epsCd0;

    // Gesamtschwinden eps_cs
    const epsCs = epsCd + epsCa;
    const deltaLShrinkMm = epsCs * (elementLengthL * 1000);

    // 6. Kriechen des Betons (Abschnitt 3.1.4 & Anhang B.1)
    // Feuchtebeiwert phi_RH
    let phiRH = 1.0;
    let alpha1 = 1.0;
    let alpha2 = 1.0;
    let alpha3 = 1.0;
    if (fcm <= 35) {
      phiRH = 1 + (1 - RH / 100) / (0.10 * Math.cbrt(h0));
    } else {
      alpha1 = Math.pow(35 / fcm, 0.7);
      alpha2 = Math.pow(35 / fcm, 0.2);
      alpha3 = Math.pow(35 / fcm, 0.5);
      phiRH = (1 + ((1 - RH / 100) / (0.10 * Math.cbrt(h0))) * alpha1) * alpha2;
    }

    const betaFcm = 16.8 / Math.sqrt(Math.max(1, fcm));

    // Modifiziertes Belastungsalter t_0,eff nach Gl. B.9 & B.10
    let alphaCementMod = 0;
    if (cementClass === 'S') alphaCementMod = -1;
    else if (cementClass === 'R') alphaCementMod = 1;

    const t0Eff = Math.max(
      0.5,
      t0Temp * Math.pow((9 / (2 + Math.pow(t0Temp, 1.2))) + 1, alphaCementMod)
    );
    const betaT0 = 1 / (0.1 + Math.pow(t0Eff, 0.20));

    // Grundkriechzahl phi_0
    const phi0 = phiRH * betaFcm * betaT0;

    // Zeitverlauf des Kriechens beta_c(t, t0) (Gl. B.7 & B.8)
    let betaH = 1.5 * (1 + Math.pow(0.012 * RH, 18)) * h0 + 250;
    if (fcm <= 35) {
      betaH = Math.min(1500, betaH);
    } else {
      betaH = Math.min(1500 * alpha3, 1.5 * (1 + Math.pow(0.012 * RH, 18)) * h0 + 250 * alpha3);
    }

    const deltaTcreep = Math.max(0, targetAgeT - loadingAgeT0);
    const betaC = Math.pow(deltaTcreep / (betaH + deltaTcreep), 0.3);
    const phiLinear = phi0 * betaC;

    // Nichtlineares Kriechen bei hohen Spannungen:
    // 0.45 * fck(t0) < sigma_c <= 0.60 * fck(t0) nach Gl. (3.7)
    // k_sigma = sigma_c / fck(t0)
    const stressLimitLin = 0.45 * fckT0;
    const stressLimitMax = 0.60 * fckT0;
    const isNonlinearCreep = axialStressSigmaC > stressLimitLin;
    
    let kSigma = 0;
    let phiFinal = phiLinear;
    if (fckT0 > 0) {
      kSigma = axialStressSigmaC / fckT0;
      if (isNonlinearCreep) {
        // Exponentielle Vergrößerung nach Gl. (3.7): phi_k = phi * exp( 1.5 * (k_sigma - 0.45) )
        phiFinal = phiLinear * Math.exp(1.5 * (kSigma - 0.45));
      }
    }

    // Kriechdehnung eps_cc nach Abschnitt 6:
    // eps_cc = phi * sigma_c / E_c = phi * sigma_c / (1.05 * E_cm)
    const epsCc = (phiFinal * axialStressSigmaC) / Ec0;
    const deltaLCreepMm = epsCc * (elementLengthL * 1000);

    // Effektiver E-Modul für Langzeitverformungen (Abs. 7.4.3, Gl. 7.20):
    // E_c,eff = E_cm / (1 + phi)
    const EcEff = Ecm / (1 + phiFinal);

    // Relaxierter Modul für Zwangsbeanspruchungen (rho ~ 0.8):
    const rhoRelax = 0.80;
    const EcEffZwang = Ecm / (1 + rhoRelax * phiFinal);

    // 8. 2. Generation EC2 (DIN EN 1992-1-1:2025-09) Vorab-Berechnung
    const kE2025 = 9500;
    const Ecm2025 = kE2025 * Math.pow(fcm, 1 / 3); // MPa
    const etaFc2025 = Math.min(1.0, Math.pow(40 / Math.max(1, fck), 1 / 3));

    return {
      fck,
      fcm,
      fcd,
      s,
      betaCcT0,
      fcmT0,
      fckT0,
      betaCcT,
      fcmT,
      fckT,
      fctm,
      fctk005,
      fctk095,
      fctd,
      fctmFl,
      fctSp,
      fctmT,
      alphaE,
      Ecm,
      Ec0,
      EcmT0,
      EcmT,
      Gcm,
      epsC1,
      epsCu1,
      kPlastizitaet,
      epsC2,
      epsCu2,
      exponentN,
      h0,
      kh,
      epsCd0,
      epsCd,
      epsCa,
      epsCs,
      deltaLShrinkMm,
      phi0,
      phiLinear,
      phiFinal,
      isNonlinearCreep,
      stressLimitLin,
      stressLimitMax,
      kSigma,
      epsCc,
      deltaLCreepMm,
      EcEff,
      EcEffZwang,
      Ecm2025,
      etaFc2025
    };
  }, [selectedClassIdx, cementClass, aggregateType, relativeHumidity, areaAc, perimeterU, elementHeightH, curingDaysTs, loadingAgeT0, targetAgeT, ambientTempT, axialStressSigmaC, elementLengthL, baseConcrete]);

  // Quiz-Fragen zur Überprüfung (Stufe 4 des Lehrpfads)
  const QUIZ_ITEMS = inhalt.daten["Betonkennwerte.QUIZ_ITEMS"];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-2">
      
      {/* 1. Header & Lead Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-home-grau/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-shiraz/10 text-shiraz">
                <Sliders size={22} />
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-text-main"><MdText text={inhalt.texte.betonkennwerteNachEurocode2} /></h2>
            </div>
            <p className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.vollständigeBerechnungMechanischerZeitab} /></p>
          </div>
          <div className="flex items-center gap-2 bg-off-white px-3 py-1.5 rounded-xl border border-home-grau/25 text-xs">
            <span className="font-bold text-slate-700">Normengeneration:</span>
            <span className="font-mono text-shiraz font-semibold"><MdText text={inhalt.texte.ec220112013Ec2} /></span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.dieBerechnungSämtlicherKennwerte} /></p>
        </div>

        {/* 4-Stufen-Lehrpfad Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-4 mt-2">
          <button aria-pressed={activeTab === 'rechner'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'rechner' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('rechner')}
          >
            <Calculator size={15} /><MdText text={inhalt.texte.t1InteraktiverKennwertrechner} /></button>

          <button aria-pressed={activeTab === 'tabelle'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'tabelle' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('tabelle')}
          >
            <BookOpen size={15} /><MdText text={inhalt.texte.t2Ec2Tabelle3} /></button>

          <button aria-pressed={activeTab === 'zeit_theorie'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'zeit_theorie' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('zeit_theorie')}
          >
            <Activity size={15} /><MdText text={inhalt.texte.t3ZeitverläufeTheorie} /></button>

          <button aria-pressed={activeTab === 'praxis'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'praxis' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('praxis')}
          >
            <ShieldCheck size={15} /><MdText text={inhalt.texte.t4IngenieurpraxisGzg} /></button>

          <button aria-pressed={activeTab === 'ausblick2025'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'ausblick2025' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('ausblick2025')}
          >
            <Sparkles size={15} /><MdText text={inhalt.texte.t5NeuerungenEc2Gen} /></button>

          <button aria-pressed={activeTab === 'test'}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
              activeTab === 'test' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('test')}
          >
            <CheckCircle2 size={15} /><MdText text={inhalt.texte.t6Wissenstest} /></button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: INTERAKTIVER EC2 KENNWERTRECHNER                               */}
      {/* ===================================================================== */}
      {activeTab === 'rechner' && <RechnerTab aggregateType={aggregateType} ambientTempT={ambientTempT} areaAc={areaAc} axialStressSigmaC={axialStressSigmaC} baseConcrete={baseConcrete} calcResults={calcResults} cementClass={cementClass} curingDaysTs={curingDaysTs} elementHeightH={elementHeightH} elementLengthL={elementLengthL} loadingAgeT0={loadingAgeT0} perimeterU={perimeterU} relativeHumidity={relativeHumidity} selectedClassIdx={selectedClassIdx} setAggregateType={setAggregateType} setAmbientTempT={setAmbientTempT} setAreaAc={setAreaAc} setAxialStressSigmaC={setAxialStressSigmaC} setCementClass={setCementClass} setCuringDaysTs={setCuringDaysTs} setElementHeightH={setElementHeightH} setElementLengthL={setElementLengthL} setLoadingAgeT0={setLoadingAgeT0} setPerimeterU={setPerimeterU} setRelativeHumidity={setRelativeHumidity} setSelectedClassIdx={setSelectedClassIdx} targetAgeT={targetAgeT} />}

      {/* ===================================================================== */}
      {/* TAB 2: VOLLSTÄNDIGE EC2 TABELLE 3.1 MATRIX                            */}
      {/* ===================================================================== */}
      {activeTab === 'tabelle' && <TabelleTab selectedClassIdx={selectedClassIdx} setSelectedClassIdx={setSelectedClassIdx} />}

      {/* ===================================================================== */}
      {/* TAB 3: THEORETISCHE GRUNDLAGEN & ZEITFUNKTIONEN                       */}
      {/* ===================================================================== */}
      {activeTab === 'zeit_theorie' && <ZeitTheorieTab />}

      {/* ===================================================================== */}
      {/* TAB 4: INGENIEURPRAXIS & GRENZZUSTÄNDE (GZG / GZT)                    */}
      {/* ===================================================================== */}
      {activeTab === 'praxis' && <PraxisTab />}

      {/* ===================================================================== */}
      {/* TAB 5: AUSBLICK EUROCODE 2 DER 2. GENERATION (2025/2026)              */}
      {/* ===================================================================== */}
      {activeTab === 'ausblick2025' && <Ausblick2025Tab baseConcrete={baseConcrete} calcResults={calcResults} />}

      {/* ===================================================================== */}
      {/* TAB 6: WISSENSTEST & SELBSTKONTROLLE (STUFE 4)                       */}
      {/* ===================================================================== */}
      {activeTab === 'test' && <TestTab QUIZ_ITEMS={QUIZ_ITEMS} quizAnswers={quizAnswers} setQuizAnswers={setQuizAnswers} />}

      {/* 5. Standardisierter Modul-Footer (DIN-Normen OHNE LINKS gemäß System-Direktive) */}
      <ModuleFooter 
        regelwerke={inhalt.daten["Betonkennwerte.regelwerke"]}
        literatur={inhalt.daten["Betonkennwerte.literatur"]}
        formeln={
          activeTab === 'rechner' || activeTab === 'zeit_theorie'
            ? inhalt.daten.Betonkennwerte
            : []
        }
      />
    </div>
  );
}
