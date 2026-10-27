import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { maxFaFaktor, stoffraum, REGELSIEBLINIEN, istSieblinie } from '@/src/calc/mischung';
import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, LogarithmicScale, RadialLinearScale, Filler } from 'chart.js';
import '@/src/lib/chartSetup';
import { ShieldAlert, Calculator, Layers, Activity, BookOpen } from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { DIN1045_2 } from '@/src/data/normParams';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LogarithmicScale, PointElement, LineElement, RadialLinearScale, Filler);

import MischungsberechnungAnleitung from './MischungsberechnungAnleitung';
import Packungsdichte from './Packungsdichte';
import GepruefteBeispieleSection, { BenchmarkData } from '@/src/components/mischung/GepruefteBeispieleSection';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';
import { NachErstemBild } from '@/src/components/ui/NachErstemBild';
import { zementData, KONSISTENZ_DATA, KORN_WATER_BASE, BAUTEILE, EXPOSITIONSKLASSEN, rezepturen } from './mischungsberechnung/daten';
import { GrenzwerteSection } from './mischungsberechnung/GrenzwerteSection';
import { WalzKurvenSection } from './mischungsberechnung/WalzKurvenSection';
import MischungEingaben from './mischungsberechnung/MischungEingaben';
import MischungErgebnisse from './mischungsberechnung/MischungErgebnisse';
import inhalt from '@/content/mischungsberechnung/Mischungsberechnung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

const REITER = [
  { id: 'grenzwerte', label: inhalt.texte.grenzwerteKlassen, icon: ShieldAlert },
  { id: 'berechnung', label: 'Berechnung', icon: Calculator },
  { id: 'beispiele', label: inhalt.texte.geprüfteBeispielrechnungen, icon: BookOpen },
  { id: 'walzkurven', label: 'Walz-Kurven', icon: Activity },
  { id: 'packungsdichte', label: 'Packungsdichte', icon: Layers },
  { id: 'anleitung', label: 'Anleitung', icon: BookOpen },
] as const;

export default function Mischungsberechnung() {
  const [activeTab, setActiveTab] = useState<'berechnung' | 'anleitung' | 'walzkurven' | 'grenzwerte' | 'packungsdichte' | 'beispiele'>('berechnung');

  // Zement
  const [zementArt, setZementArt] = useState('CEM I');
  const [zementFestigkeit, setZementFestigkeit] = useState('42.5 R');
  const [zement, setZement] = useState(320); // kg/m³
  const [wasser, setWasser] = useState(160); // kg/m³
  const [konsistenz, setKonsistenz] = useState('F3');

  // Zusatzstoffe
  const [fa, setFa] = useState(0); // Flugasche
  const [sf, setSf] = useState(0); // Silikastaub
  const [hues, setKsm] = useState(0); // Hüttensandmehl
  const [biochar, setBiochar] = useState(0); // Pflanzenkohle (Biochar)
  const [waBiochar, setWaBiochar] = useState(30.0); // Wasseraufnahme Biochar in M.-%
  const [feuchteBiochar, setFeuchteBiochar] = useState(0.0); // Gesamtfeuchte Biochar in M.-%
  
  // k-Werte aus zentraler Registry (DIN 1045-2)
  const [kFa, setKFa] = useState(DIN1045_2.kFlugasche);
  const [kSf, setKSf] = useState(1.0); // DIN 1045-2:2023-08, 5.2.5.2.3: k = 1,0 (s ≤ 0,11·z); bei XF2/XF4 keine Anrechnung
  const [kKsm, setKKsm] = useState(0.4); // Lehrannahme: in DE nur mit allgemeiner bauaufsichtlicher Zulassung
  const [kBiochar, setKBiochar] = useState(0.0); // Aktuell kein normativer k-Wert für Biochar

  // Fasern (DIN EN 14889-1 & DIN EN 14889-2)
  const [stahlfaser, setStahlfaser] = useState(0); // kg/m³ Stahlfasern, rho = 7.85 kg/dm³
  const [ppFaser, setPpFaser] = useState(0); // kg/m³ Polypropylenfasern, rho = 0.91 kg/dm³

  // Zusatzmittel & Luft (inkl. LP-Beton Automatik)
  const [zusatzmittel, setZusatzmittel] = useState(0); // kg/m³
  const [luft, setLuft] = useState(2.0); // Vol.-%
  const [lpOption, setLpOption] = useState<'auto' | 'mit_lp' | 'ohne_lp'>('auto');

  // Gesteinskörnung Fraktionen (M.-%)
  const [groesstkorn, setGroesstkorn] = useState<8 | 16 | 32>(32);
  const [sandFraktion, setSandFraktion] = useState<'0/4' | '0/2'>('0/4');
  const [feinanteilSand, setFeinanteilSand] = useState(3.0); // Mehlkorngehalt im Sand (<= 0.125 mm) in M.-%
  const [kornArt, setKornArt] = useState<'rund' | 'gebrochen'>('rund');
  const [f04, setF04] = useState(40);
  const [f48, setF48] = useState(20);
  const [f816, setF816] = useState(20);
  const [f1632, setF1632] = useState(20);

  // Gesteinseigenschaften
  const [rhoGestein, setRhoGestein] = useState(2.65); // kg/dm³

  // Feuchte (Gesamtfeuchte)
  const [feuchte04, setFeuchte04] = useState(3.0);
  const [feuchte48, setFeuchte48] = useState(1.0);
  const [feuchte816, setFeuchte816] = useState(0.5);
  const [feuchte1632, setFeuchte1632] = useState(0.5);

  // Kernfeuchte (Wasseraufnahme WA24)
  const [wa04, setWa04] = useState(0.5);
  const [wa48, setWa48] = useState(0.5);
  const [wa816, setWa816] = useState(0.5);
  const [wa1632, setWa1632] = useState(0.5);

  // Betonmenge für konkrete Einwaage
  const [betonMengeL, setBetonMengeL] = useState(25); // Liter

  // Expositionsklassen & Bauteil
  const [rezeptur, setRezeptur] = useState('manuell');
  const [bauteil, setBauteil] = useState('manuell');
  const [expClasses, setExpClasses] = useState<string[]>(['XC1']);

  const handleRezepturChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setRezeptur(val);
    if (val !== 'manuell') {
      const r = rezepturen[val];
      setZementArt(r.zementArt);
      setZementFestigkeit(r.zementFestigkeit);
      setZement(r.zement);
      setWasser(r.zement * r.wz);
      setFa(r.fa);
      setSf(r.sf);
      setKsm(r.hues);
      setBiochar(0);
      setStahlfaser(r.stahlfaser || 0);
      setPpFaser(r.ppFaser || 0);
      setZusatzmittel(r.zusatzmittel);
      setLuft(r.luft);
      setGroesstkorn(r.groesstkorn);
      setF04(r.f04);
      setF48(r.f48);
      setF816(r.f816);
      setF1632(r.f1632);
      
      if (val === 'Leichtbeton (LC20/22)') {
        setRhoGestein(1.5);
        setWa04(12.0); setWa48(15.0); setWa816(15.0); setWa1632(15.0);
      } else if (val === 'Infraleichtbeton (ILC)') {
        setRhoGestein(0.9);
        setWa04(15.0); setWa48(20.0); setWa816(20.0); setWa1632(20.0);
      } else {
        setRhoGestein(2.65);
        setWa04(0.5); setWa48(0.5); setWa816(0.5); setWa1632(0.5);
      }
    }
  };

  const handleGroesstkornChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value) as 8 | 16 | 32;
    setGroesstkorn(val);
    if (val === 8) {
      setF04(55);
      setF48(45);
      setF816(0);
      setF1632(0);
    } else if (val === 16) {
      setF04(45);
      setF48(25);
      setF816(30);
      setF1632(0);
    } else if (val === 32) {
      setF04(40);
      setF48(20);
      setF816(20);
      setF1632(20);
    }
  };

  const handleBauteilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBauteil(val);
    if (val !== 'manuell') {
      const selected = BAUTEILE.find(b => b.id === val);
      if (selected) {
        setExpClasses(selected.classes);
      }
    }
  };

  const toggleExpClass = (cls: string) => {
    setBauteil('manuell');
    setExpClasses(prev => 
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    );
  };

  const sumFraktionen = f04 + f48 + f816 + f1632;
  const isFraktionenOk = Math.abs(sumFraktionen - 100) < 0.1;

  // LP-Beton Automatik & Konsequenzen (DIN 1045-2 / DIN EN 206)
  const hasXF4 = expClasses.includes('XF4');
  const hasXF23 = expClasses.includes('XF2') || expClasses.includes('XF3');

  const isLpActive = useMemo(() => {
    if (lpOption === 'mit_lp') return true;
    if (lpOption === 'ohne_lp') return false;
    // 'auto' mode:
    if (hasXF4) return true; // XF4 erfordert zwingend LP nach DIN 1045-2
    if (hasXF23 && (luft >= 3.5 || zusatzmittel > 0 || rezeptur === 'Straßendecken')) return true;
    if (luft >= 3.5) return true;
    return false;
  }, [lpOption, hasXF4, hasXF23, luft, zusatzmittel, rezeptur]);

  const minLpNorm = useMemo(() => {
    if (groesstkorn === 8) return 5.5;
    if (groesstkorn === 16) return 4.5;
    return 4.0; // Dmax 32 mm nach DIN 1045-2 Tabelle F.2.2
  }, [groesstkorn]);

  const deltaLuftVol = Math.max(0, (luft - 1.5) * 10); // dm³/m³ Verdrängungsvolumen im Stoffraum
  const deltaGesteinMasse = deltaLuftVol * rhoGestein; // kg/m³ Masseverlust Gestein
  const empfohleneSandReduktion = Math.max(0, Math.round((luft - 1.5) * 1.0)); // M.-% Sandreduktion nach Walz
  const wasserEinsparungLP = isLpActive ? Math.max(0, (luft - 1.5) * 2.5) : 0; // L/m³
  const festigkeitsVerlustLP = isLpActive ? Math.max(0, (luft - 1.5) * 4.0) : 0; // MPa

  const applyWalzSandReduction = () => {
    if (empfohleneSandReduktion <= 0) return;
    const targetF04 = Math.max(25, f04 - empfohleneSandReduktion);
    const diff = f04 - targetF04;
    if (diff <= 0) return;
    setF04(targetF04);
    if (groesstkorn === 32) {
      const h1 = Math.floor(diff / 2);
      const h2 = diff - h1;
      setF816(prev => prev + h1);
      setF1632(prev => prev + h2);
    } else if (groesstkorn === 16) {
      setF816(prev => prev + diff);
    } else {
      setF48(prev => prev + diff);
    }
  };

  const handleLoadBenchmark = (b: BenchmarkData) => {
    setZementArt(b.zementArt);
    setZementFestigkeit(b.zementFestigkeit);
    setZement(b.zement);
    setWasser(b.wasser);
    setKonsistenz(b.konsistenz);
    setFa(b.fa);
    setSf(b.sf);
    setKsm(b.hues);
    setBiochar(b.biochar || 0);
    setStahlfaser(b.stahlfaser || 0);
    setPpFaser(b.ppFaser || 0);
    setZusatzmittel(b.zusatzmittel);
    setLuft(b.luft);
    setGroesstkorn(b.groesstkorn);
    setSandFraktion(b.sandFraktion || '0/4');
    setF04(b.f04);
    setF48(b.f48);
    setF816(b.f816);
    setF1632(b.f1632);
    setFeuchte04(b.feuchte04);
    setFeuchte48(b.feuchte48);
    setFeuchte816(b.feuchte816);
    setFeuchte1632(b.feuchte1632);
    setWa04(b.wa04);
    setWa48(b.wa48);
    setWa816(b.wa816);
    setWa1632(b.wa1632);
    setExpClasses(b.expClasses);
    setLpOption(b.lpSetting || 'auto');
    setRhoGestein(b.rhoGestein ?? 2.65);
    setRezeptur('manuell');
    setActiveTab('berechnung');
  };

  const results = useMemo(() => {
    // Stoffraumrechnung und w/z-Wert aus dem Rechenkern src/calc/mischung.ts
    const wasserTrocken = wasser;
    const sr = stoffraum({
      zement, rhoZement: zementData[zementArt].rho, wasser, fa, sf, hues, biochar, zusatzmittel, luft, stahlfaser, ppFaser, rhoGestein,
      fraktionen: [
        { anteil: f04, feuchte: feuchte04, wa: wa04 }, { anteil: f48, feuchte: feuchte48, wa: wa48 },
        { anteil: f816, feuchte: feuchte816, wa: wa816 }, { anteil: f1632, feuchte: feuchte1632, wa: wa1632 },
      ],
      biocharFeuchte: feuchteBiochar, biocharWa: waBiochar,
      k: { fa: kFa, sf: kSf, hues: kKsm, biochar: kBiochar }, maxFaFaktor: maxFaFaktor(zementArt), zementArt,
    });
    const { maxFa, anrechenbarFa, maxSf, anrechenbarSf, volGestein, wasserAusGestein, wasserAusBiochar, zugabewasser } = sr;
    const { zement: volZement, fa: volFa, sf: volSf, hues: volKsm, biochar: volBiochar, zusatzmittel: volZM, luft: volLuft, stahlfaser: volStahlfaser, ppFaser: volPpFaser } = sr.vol;
    const volFasernGesamt = volStahlfaser + volPpFaser;
    const masseGesteinTrocken = sr.masseGestein;
    const [m04_tr, m48_tr, m816_tr, m1632_tr] = sr.fraktionen.map(f => f.trocken);
    const [m04_feucht, m48_feucht, m816_feucht, m1632_feucht] = sr.fraktionen.map(f => f.feucht);
    const biochar_feucht = sr.biocharFeucht;
    const wz = sr.wz;
    const wzEq = sr.wzEq;
    const wbWert = sr.wb;

    // Mehlkorngehalt berechnen (Zement + Zusatzstoffe + Gesteinsfeinanteile <= 0.125 mm)
    const mehlkornAusSand = m04_tr * (feinanteilSand / 100);
    const mehlkornGesamt = zement + fa + sf + hues + biochar + mehlkornAusSand;
    
    // Mehlkornprüfung nur bei XF oder XM relevant nach DIN 1045-2 (Tabelle 13: Höchstzulässiger Mehlkorngehalt)
    const hasXFoderXM = expClasses.some(c => c.startsWith('XF') || c.startsWith('XM'));
    // Grenzwerte DIN 1045-2: d_g = 8 mm -> 500 kg/m³, d_g = 16 mm -> 450 kg/m³, d_g = 32 mm -> 400 kg/m³ (bei Zementgehalt ≤ 400 kg/m³)
    // DIN 1045-2 Tab. F.4.1 (bis C50/60, XF/XM): z ≤ 300 → 400, z ≥ 350 → 450 kg/m³, dazwischen linear
    const maxMehlkornWert = zement <= 300 ? 400 : zement >= 350 ? 450 : 400 + (zement - 300);
    const maxMehlkornText = `${formatDeWert(maxMehlkornWert)} kg/m³ (DIN 1045-2:2008-08, Tab. F.4.1; in der Ausgabe 2023-08 entfallen, dort Mindest-Leimvolumen)`;
    const isMehlkornOk = mehlkornGesamt <= maxMehlkornWert;

    // CO2 Berechnung (Detailliert)
    const co2Zement = zement * zementData[zementArt].co2;
    const co2Fa = fa * 0.01;
    const co2Sf = sf * 0.02;
    const co2Ksm = hues * 0.03;
    const co2Biochar = biochar * -2.5; // Biochar speichert CO2 (negative Emissionen, ca. -2.5 kg CO2 pro kg)
    const co2Gestein = masseGesteinTrocken * 0.003; // ca. 3 kg CO2 pro Tonne Gestein
    const co2Wasser = wasserTrocken * 0.0003; // ca. 0.3 kg CO2 pro m³ Wasser
    const co2ZM = zusatzmittel * 1.5; // ca. 1.5 kg CO2 pro kg ZM
    const co2Stahlfaser = stahlfaser * 1.90; // ca. 1.9 kg CO2 pro kg Stahlfaser (DIN EN 15804)
    const co2PpFaser = ppFaser * 2.10; // ca. 2.1 kg CO2 pro kg PP-Faser
    const co2FasernGesamt = co2Stahlfaser + co2PpFaser;
    const co2Gesamt = co2Zement + co2Fa + co2Sf + co2Ksm + co2Biochar + co2Gestein + co2Wasser + co2ZM + co2FasernGesamt;

    const frischbetonRohdichte = sr.rohdichte; // kg/dm³

    const volLeim = sr.volLeim;

    // Limits prüfen
    let reqMaxWz = 1.0;
    let reqMinZ = 0;
    let reqMinC = '';
    let reqMinCover = 0;
    let reqMaxZement = Infinity;

    const scores = { XC: 0, XD_XS: 0, XF: 0, XA: 0, XM: 0 };

    let xf4OhneLp = false;
    expClasses.forEach(cls => {
      const data = EXPOSITIONSKLASSEN[cls];
      if (data) {
        let clsWz = data.wZ;
        let clsMinZ = data.minZement;
        let clsMinC = data.minFestigkeit;
        let clsMinFestNum = data.minFestigkeitNum;

        // LP-Beton Besonderheiten für Frostklassen nach DIN 1045-2:
        if (isLpActive) {
          if (cls === 'XF2' || cls === 'XF3') {
            clsWz = 0.55;
            clsMinZ = 300;
            clsMinC = 'C25/30';
            clsMinFestNum = 25;
          } else if (cls === 'XF4') {
            clsWz = 0.50;
            clsMinZ = 320;
            clsMinC = 'C30/37';
            clsMinFestNum = 30;
          }
        } else {
          if (cls === 'XF2') {
            clsWz = 0.50;
            clsMinZ = 320;
            clsMinC = 'C35/45';
            clsMinFestNum = 35;
          } else if (cls === 'XF3') {
            clsWz = 0.50;
            clsMinZ = 320;
            clsMinC = 'C35/45';
            clsMinFestNum = 35;
          } else if (cls === 'XF4') {
            // DIN 1045-2:2023-08 regelt XF4 nur als LP-Beton – ohne LP kein Nachweis möglich
            xf4OhneLp = true;
            clsWz = 0.50;
            clsMinZ = 320;
            clsMinC = inhalt.werte.c3037NurMit;
            clsMinFestNum = 30;
          }
        }

        // DIN 1045-2 sieht keinen Zuschlag für Größtkorn 8/16 mm vor (nur −30 kg/m³ bei 63 mm, hier nicht wählbar).

        if (clsWz < reqMaxWz) reqMaxWz = clsWz;
        if (clsMinZ > reqMinZ) reqMinZ = clsMinZ;
        if (data.cMin && data.cMin > reqMinCover) reqMinCover = data.cMin;
        if (data.maxZement && data.maxZement < reqMaxZement) reqMaxZement = data.maxZement;

        const festNum = parseInt(clsMinC.split('/')[0].replace('C', '').split(' ')[0] || '0');
        const currentReqNum = reqMinC ? parseInt(reqMinC.split('/')[0].replace('C', '').split(' ')[0] || '0') : 0;
        if (!reqMinC || festNum > currentReqNum) {
          reqMinC = clsMinC;
        }

        // Radar Chart Scores
        if (cls.startsWith('XC')) scores.XC = Math.max(scores.XC, parseInt(cls[2]));
        if (cls.startsWith('XD') || cls.startsWith('XS')) scores.XD_XS = Math.max(scores.XD_XS, parseInt(cls[2]));
        if (cls.startsWith('XF')) scores.XF = Math.max(scores.XF, parseInt(cls[2]));
        if (cls.startsWith('XA')) scores.XA = Math.max(scores.XA, parseInt(cls[2]));
        if (cls.startsWith('XM')) scores.XM = Math.max(scores.XM, parseInt(cls[2]));
      }
    });

    const isWzOk = wzEq <= reqMaxWz && !xf4OhneLp;
    const isZOk = zement >= reqMinZ;
    const isMaxZOk = reqMaxZement === Infinity || zement <= reqMaxZement;

    const lpWaterReduction = isLpActive ? Math.max(0, (luft - 1.5) * 2.5) : 0;
    const estimatedWater = Math.max(130, Math.round(KORN_WATER_BASE[groesstkorn] + KONSISTENZ_DATA[konsistenz].waterMod - lpWaterReduction));

    const radarChartData = {
      labels: [inhalt.werte.karbonatisierungXc, inhalt.werte.chlorideXdXs, 'Frost (XF)', 'Chemie (XA)', inhalt.werte.verschleißXm],
      datasets: [
        {
          label: 'Beanspruchungsintensität',
          data: [scores.XC, scores.XD_XS, scores.XF, scores.XA, scores.XM],
          backgroundColor: 'rgba(255, 3, 80, 0.2)',
          borderColor: '#A3113E',
          borderWidth: 2,
          pointBackgroundColor: '#A3113E',
        }],
    };

    return {
      wasserTrocken, zugabewasser, wasserAusGestein, wasserAusBiochar,
      volZement, volFa, volSf, volKsm, volBiochar, volZM, volLuft, volGestein,
      volStahlfaser, volPpFaser, volFasernGesamt,
      masseGesteinTrocken, m04_tr, m48_tr, m816_tr, m1632_tr,
      m04_feucht, m48_feucht, m816_feucht, m1632_feucht, biochar_feucht,
      frischbetonRohdichte, wz, wzEq, wbWert, volLeim,
      co2Zement, co2Fa, co2Sf, co2Ksm, co2Biochar, co2Gestein, co2Wasser, co2ZM,
      co2Stahlfaser, co2PpFaser, co2FasernGesamt, co2Gesamt,
      reqMaxWz, reqMinZ, reqMinC, reqMinCover, reqMaxZement, isWzOk, xf4OhneLp, isZOk, isMaxZOk, radarChartData, estimatedWater,
      maxFa, anrechenbarFa, maxSf, anrechenbarSf,
      mehlkornAusSand, mehlkornGesamt, maxMehlkornText, isMehlkornOk, hasXFoderXM,
      lpWaterReduction, isLpActive, hinweise: sr.hinweise
    };
  }, [zementArt, zement, wasser, fa, sf, hues, biochar, kFa, kSf, kKsm, kBiochar, zusatzmittel, luft, stahlfaser, ppFaser, f04, f48, f816, f1632, feuchte04, feuchte48, feuchte816, feuchte1632, wa04, wa48, wa816, wa1632, expClasses, rhoGestein, waBiochar, feuchteBiochar, groesstkorn, konsistenz, feinanteilSand, isLpActive]);

  const pieLabels = ['Zement', 'Wasser', 'Zusatzstoffe', 'Zusatzmittel', 'Luftporen', 'Gesteinskörnung'];
  const pieValues = [
    results.volZement, 
    results.wasserTrocken, 
    results.volFa + results.volSf + results.volKsm + results.volBiochar, 
    results.volZM, 
    results.volLuft, 
    results.volGestein
  ];
  const pieColors = ['#64748b', '#475569', '#94a3b8', '#64748b', '#f1f5f9', '#cbd5e1'];

  if (results.volFasernGesamt > 0) {
    pieLabels.push('Fasern');
    pieValues.push(results.volFasernGesamt);
    pieColors.push('#A3113E');
  }

  const pieChartData = {
    labels: pieLabels,
    datasets: [{
      data: pieValues,
      backgroundColor: pieColors,
    }]
  };

  // Sieblinien Chart Data – Regelsieblinien und Ist-Linie aus src/calc/mischung.ts (Lehrbuchwerte, vorläufig F-Freigabe)
  const dmax = groesstkorn;
  const regel = REGELSIEBLINIEN[dmax];
  const ist = istSieblinie(dmax, { f04, f48, f816, f1632 });
  const labels: number[] = [...regel.siebe];
  // unter 4 mm ist die Ist-Linie aus den Fraktionen nicht bestimmbar → Lücke (null)
  const dataIst: (number | null)[] = regel.siebe.map(d => ist.punkte.find(p => p.sieb === d)?.durchgang ?? null);
  const dataA = [...regel.A];
  const dataB = [...regel.B];
  const dataC = [...regel.C];

  const lineChartData = {
    labels,
    datasets: [
      { label: 'Ist-Sieblinie', data: dataIst, borderColor: '#000', borderWidth: 2, fill: false, tension: 0.1 },
      { label: `Regelsieblinie A${dmax}`, data: dataA, borderColor: '#A3113E', borderDash: [5, 5], fill: false, tension: 0.1 },
      { label: `Regelsieblinie B${dmax}`, data: dataB, borderColor: '#475569', borderDash: [5, 5], fill: false, tension: 0.1 },
      { label: `Regelsieblinie C${dmax}`, data: dataC, borderColor: '#475569', borderDash: [5, 5], fill: false, tension: 0.1 }]
  };

  return (
    <div className="flex flex-col gap-8">
      <ModuleTabs label="Bereiche Mischungsberechnung" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20 [&>[role=tablist]]:mb-8">

      {activeTab === 'grenzwerte' && (
        <GrenzwerteSection />
      )}

      {activeTab === 'beispiele' && (
        <GepruefteBeispieleSection onLoadBenchmark={handleLoadBenchmark} />
      )}
      
      {activeTab === 'walzkurven' && (
        <WalzKurvenSection />
      )}

      {activeTab === 'berechnung' && (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.mischungsberechnungBetonrezeptur} /><InfoTooltip text={inhalt.werte.berechnungDerVolumetrischenZusammensetzu} />
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300"><MdText text={inhalt.texte.berechnetNachDinEn} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
          <p><MdText text={inhalt.texte.dieMischungsberechnungStoffraumrechnungE} /></p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MischungEingaben applyWalzSandReduction={applyWalzSandReduction} bauteil={bauteil} biochar={biochar} deltaGesteinMasse={deltaGesteinMasse} deltaLuftVol={deltaLuftVol} empfohleneSandReduktion={empfohleneSandReduktion} expClasses={expClasses} f04={f04} f1632={f1632} f48={f48} f816={f816} fa={fa} feinanteilSand={feinanteilSand} festigkeitsVerlustLP={festigkeitsVerlustLP} feuchte04={feuchte04} feuchte1632={feuchte1632} feuchte48={feuchte48} feuchte816={feuchte816} feuchteBiochar={feuchteBiochar} groesstkorn={groesstkorn} handleBauteilChange={handleBauteilChange} handleGroesstkornChange={handleGroesstkornChange} handleRezepturChange={handleRezepturChange} hues={hues} isFraktionenOk={isFraktionenOk} isLpActive={isLpActive} kBiochar={kBiochar} kFa={kFa} kKsm={kKsm} kSf={kSf} konsistenz={konsistenz} kornArt={kornArt} lpOption={lpOption} luft={luft} minLpNorm={minLpNorm} ppFaser={ppFaser} results={results} rezeptur={rezeptur} rhoGestein={rhoGestein} sandFraktion={sandFraktion} setBiochar={setBiochar} setF04={setF04} setF1632={setF1632} setF48={setF48} setF816={setF816} setFa={setFa} setFeinanteilSand={setFeinanteilSand} setFeuchte04={setFeuchte04} setFeuchte1632={setFeuchte1632} setFeuchte48={setFeuchte48} setFeuchte816={setFeuchte816} setFeuchteBiochar={setFeuchteBiochar} setKBiochar={setKBiochar} setKKsm={setKKsm} setKonsistenz={setKonsistenz} setKornArt={setKornArt} setKsm={setKsm} setLpOption={setLpOption} setLuft={setLuft} setPpFaser={setPpFaser} setRhoGestein={setRhoGestein} setSandFraktion={setSandFraktion} setSf={setSf} setStahlfaser={setStahlfaser} setWa04={setWa04} setWa1632={setWa1632} setWa48={setWa48} setWa816={setWa816} setWaBiochar={setWaBiochar} setWasser={setWasser} setZement={setZement} setZementArt={setZementArt} setZementFestigkeit={setZementFestigkeit} setZusatzmittel={setZusatzmittel} sf={sf} stahlfaser={stahlfaser} sumFraktionen={sumFraktionen} toggleExpClass={toggleExpClass} wa04={wa04} wa1632={wa1632} wa48={wa48} wa816={wa816} waBiochar={waBiochar} wasser={wasser} wasserEinsparungLP={wasserEinsparungLP} zement={zement} zementArt={zementArt} zementFestigkeit={zementFestigkeit} zusatzmittel={zusatzmittel} />

          <MischungErgebnisse betonMengeL={betonMengeL} biochar={biochar} dmax={dmax} expClasses={expClasses} fa={fa} feuchte04={feuchte04} feuchte1632={feuchte1632} feuchte48={feuchte48} feuchte816={feuchte816} feuchteBiochar={feuchteBiochar} hues={hues} lineChartData={lineChartData} sieblinienBereich={ist.bereich} luft={luft} pieChartData={pieChartData} ppFaser={ppFaser} results={results} rhoGestein={rhoGestein} setBetonMengeL={setBetonMengeL} sf={sf} stahlfaser={stahlfaser} zement={zement} zementArt={zementArt} zementFestigkeit={zementFestigkeit} zusatzmittel={zusatzmittel} />
        </div>

        <NachErstemBild minHoehe="12rem">
        <FormulaDerivationBox
          title={inhalt.werte.rechenwegNachweisDerGrenzwerte}
          zielGleichung="(w/z)_{eq} = \frac{w}{z + k_{FA} \cdot f + k_{SF} \cdot s + k_{HS} \cdot h + k_{PK} \cdot b} \le (w/z)_{max}"
          normQuelle={inhalt.werte.din104522023}
          schritte={(() => {
            const t = (x: number, d = 2) => formatDeZahl(x, d).replace(',', '{,}');
            return [
              { titel: inhalt.werte.t1Wasserzementwert, formel: `w/z = ${t(results.wasserTrocken, 0)} / ${t(zement, 0)} = ${t(results.wz)}`, erklaerung: inhalt.werte.wirksamerWassergehaltBezogenAuf },
              { titel: inhalt.werte.t2ÄquivalenterWasserzementwert, formel: `(w/z)_{eq} = \\frac{${t(results.wasserTrocken, 0)}}{${t(zement, 0)} + ${t(kFa, 1)} \\cdot ${t(results.anrechenbarFa, 0)} + ${t(kSf, 1)} \\cdot ${t(results.anrechenbarSf, 0)} + ${t(kKsm, 1)} \\cdot ${t(hues, 0)} + ${t(kBiochar, 1)} \\cdot ${t(biochar, 0)}} = ${t(results.wzEq)}`, erklaerung: inhalt.werte.angerechnetWerdenNurDie },
              { titel: inhalt.werte.t3MaßgebendeAnforderungen, formel: `(w/z)_{max} = ${t(results.reqMaxWz)};\\; z_{min} = ${t(results.reqMinZ, 0)}\\,\\text{kg/m}^3;\\; \\text{${results.reqMinC || '–'}}`, erklaerung: `Strengster Wert aus den gewählten Expositionsklassen (${expClasses.join(', ') || '–'}).` },
              { titel: '4. Nachweis', formel: `${t(results.wzEq)} ${results.wzEq <= results.reqMaxWz ? '\\le' : '>'} ${t(results.reqMaxWz)};\\quad ${t(zement, 0)} ${zement >= results.reqMinZ ? '\\ge' : '<'} ${t(results.reqMinZ, 0)}\\,\\text{kg/m}^3`, erklaerung: results.isWzOk && results.isZOk ? inhalt.werte.beideAnforderungenSindErfüllt : inhalt.werte.mindestensEineAnforderungIst },
            ];
          })()}
          ergebnisHinweis={inhalt.werte.derRechenwegFolgtDen}
        />
        </NachErstemBild>
      </div>
      )}

      {activeTab === 'packungsdichte' && (
        <Packungsdichte />
      )}
      {activeTab === 'anleitung' && (
        <MischungsberechnungAnleitung />
      )}
      </ModuleTabs>
    
      <CalculatorDisclaimerBanner className="my-2" />
      <ModulTest moduleId="mischungsberechnung" />

      <ModuleFooter 
        weblinks={[
          { title: inhalt.werte.betonWikiMischungsberechnung, url: "https://beton.wiki/index.php?title=Mischungsberechnung" }, 
          { title: inhalt.werte.zementMerkblattB12Entwurf, url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }, 
          { title: inhalt.werte.betonWikiMischungsentwurf, url: "https://beton.wiki/index.php?title=Mischungsentwurf" }, 
          { title: inhalt.werte.zementMerkblätterÜbersicht, url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }
        ]} 
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Stoffraumrechnung' }
        ]}
        literatur={inhalt.daten["Mischungsberechnung.literatur"]}
        regelwerke={inhalt.daten["Mischungsberechnung.regelwerke"]}
        formeln={inhalt.daten["Mischungsberechnung.formeln"]}
      />
    </div>
  );
} 