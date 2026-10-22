import { formatDeZahl, formatDeTeX, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, LogarithmicScale, RadialLinearScale, Filler } from 'chart.js';
import { Pie, Line, Radar } from 'react-chartjs-2';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { AlertTriangle, CheckCircle2, ShieldAlert, Droplets, Calculator, Layers, Activity, BookOpen, Wind, Scale } from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { DIN1045_2 } from '@/src/data/normParams';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LogarithmicScale, PointElement, LineElement, RadialLinearScale, Filler);

import MischungsberechnungAnleitung from './MischungsberechnungAnleitung';
import Packungsdichte from './Packungsdichte';
import GepruefteBeispieleSection, { BenchmarkData } from '@/src/components/mischung/GepruefteBeispieleSection';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';

const zementData: Record<string, { co2: number, rho: number }> = {
  'CEM I': { co2: 0.85, rho: 3.1 },
  'CEM II/A': { co2: 0.75, rho: 3.05 },
  'CEM II/B': { co2: 0.65, rho: 3.0 },
  'CEM II/S': { co2: 0.65, rho: 3.0 },
  'CEM II/C-M': { co2: 0.55, rho: 3.0 }, // DIN EN 197-5 (klinkereffizienter Portlandkompositzement)
  'CEM III/A': { co2: 0.45, rho: 2.95 },
  'CEM III/B': { co2: 0.35, rho: 2.9 },
  'CEM IV': { co2: 0.50, rho: 2.9 },
  'CEM V': { co2: 0.40, rho: 2.9 },
  'CEM VI': { co2: 0.40, rho: 2.95 }, // DIN EN 197-5 (Kompositzement)
};

const festigkeitsklassen = ['32.5 N', '32.5 R', '42.5 N', '42.5 R', '52.5 N', '52.5 R'];

const KONSISTENZ_DATA: Record<string, { label: string, waterMod: number }> = {
  'C0': { label: 'C0 (sehr steif)', waterMod: -40 },
  'C1': { label: 'C1 (steif)', waterMod: -30 },
  'C2': { label: 'C2 (plastisch)', waterMod: -15 },
  'C3': { label: 'C3 (weich)', waterMod: 0 },
  'F1': { label: 'F1 (steif)', waterMod: -30 },
  'F2': { label: 'F2 (plastisch)', waterMod: -15 },
  'F3': { label: 'F3 (weich - Standard)', waterMod: 0 },
  'F4': { label: 'F4 (sehr weich)', waterMod: 15 },
  'F5': { label: 'F5 (fließfähig)', waterMod: 30 },
  'F6': { label: 'F6 (sehr fließfähig)', waterMod: 45 },
};

const KORN_WATER_BASE: Record<number, number> = {
  8: 210,
  16: 190,
  32: 175
};

const BAUTEILE = [
  { id: 'manuell', name: 'Manuelle Eingabe', description: 'Wählen Sie die Expositionsklassen manuell aus.', classes: [] },
  // Innenbauteile
  { id: 'innen_trocken', name: 'Innenbauteil (trocken)', description: 'Bauteile in geschlossenen Gebäuden mit normaler Luftfeuchte (z.B. Wohnzimmerdecke, Innenwand).', classes: ['XC1'] },
  { id: 'innen_feucht', name: 'Innenbauteil (Feuchtraum)', description: 'Bauteile in Feuchträumen (z.B. gewerbliche Küchen, Bäder, Hallenbäder).', classes: ['XC3'] },

  // Außenbauteile
  { id: 'aussen_geschuetzt', name: 'Außenbauteil (vor Regen geschützt)', description: 'Bauteile im Freien, die vor direktem Niederschlag geschützt sind (z.B. offene Hallen, unter Vordächern).', classes: ['XC3'] },
  { id: 'aussen_beregnet', name: 'Außenbauteil (direkt beregnet)', description: 'Bauteile im Freien, die direktem Niederschlag ausgesetzt sind (z.B. Fassaden, Balkone).', classes: ['XC4', 'XF1'] },

  // Fundamente & Wasser
  { id: 'fundament', name: 'Fundament (im Erdreich)', description: 'Bauteile, die ständig im Erdreich oder Wasser liegen (ohne Frost).', classes: ['XC2'] },
  { id: 'fundament_chemie', name: 'Fundament (schwach angreifendes Grundwasser)', description: 'Gründungsbauteile in Böden oder Grundwasser mit schwachem chemischem Angriff (z.B. Sulfattreiben).', classes: ['XC2', 'XA1'] },
  { id: 'wasserbehaelter_offen', name: 'Offener Wasserbehälter (Süßwasser)', description: 'Wasserbecken im Freien, die Frost ausgesetzt sind, aber keinem Tausalz.', classes: ['XC4', 'XF3'] },
  { id: 'solebad', name: 'Solebad / Thermalbad', description: 'Schwimmbecken mit chloridhaltigem Wasser (ohne Frost).', classes: ['XC2', 'XD2'] },

  // Verkehr & Tausalz
  { id: 'parkhaus', name: 'Parkhausdeck / Tiefgarage', description: 'Bauteile, die mit chloridhaltigem Wasser (Tausalz) in Kontakt kommen.', classes: ['XC3', 'XD3', 'XF2'] },
  { id: 'brueckenkappe', name: 'Brückenkappe / Spritzwasserbereich', description: 'Bauteile an Straßen, die starkem Tausalzsprühnebel und Frost ausgesetzt sind.', classes: ['XC4', 'XD3', 'XF4'] },
  { id: 'fahrbahndecke', name: 'Fahrbahndecke (Straße)', description: 'Betonfahrbahnen mit Frost-Tausalz-Beanspruchung und mechanischem Verschleiß.', classes: ['XC4', 'XD3', 'XF4', 'XM2'] },

  // Industrie & Landwirtschaft
  { id: 'klaeranlage', name: 'Kläranlage / Güllebehälter', description: 'Bauteile, die mäßigem chemischem Angriff durch Abwasser oder Gülle ausgesetzt sind.', classes: ['XC4', 'XA2'] },
  { id: 'industrie_stark', name: 'Industrieanlage (starker chem. Angriff)', description: 'Bauteile, die stark angreifenden chemischen Substanzen ausgesetzt sind (z.B. Säurebecken).', classes: ['XC4', 'XA3'] },
  { id: 'industrieboden', name: 'Industrieboden (Staplerverkehr)', description: 'Böden in Industriehallen mit mechanischer Beanspruchung (z.B. Gabelstapler mit luft- oder vulkollanbereiften Rädern).', classes: ['XC3', 'XM2'] },
  { id: 'industrieboden_ketten', name: 'Industrieboden (Kettenfahrzeuge)', description: 'Böden mit sehr starker mechanischer Beanspruchung (z.B. Kettenfahrzeuge, Stahlrollen).', classes: ['XC3', 'XM3'] },

  // Meerwasser
  { id: 'meer_kueste', name: 'Außenbauteil in Küstennähe', description: 'Bauteile, die salzhaltiger Luft ausgesetzt sind (ohne direkten Wasserkontakt).', classes: ['XC4', 'XS1'] },
  { id: 'meer_unterwasser', name: 'Hafenanlage (ständig unter Wasser)', description: 'Bauteile in Meerwasser, die ständig unter Wasser liegen.', classes: ['XC2', 'XS2'] },
  { id: 'meer_tide', name: 'Hafenanlage (Tidebereich)', description: 'Bauteile in der Wechsel- oder Spritzwasserzone von Meerwasser, zusätzlich Frost ausgesetzt.', classes: ['XC4', 'XS3', 'XF4'] }
];

const EXPOSITIONSKLASSEN: Record<string, { name: string, desc: string, wZ: number, minFestigkeit: string, minZement: number, minFestigkeitNum: number, cMin?: number, maxZement?: number }> = {
  'XC1': { name: 'Karbonatisierung: Trocken oder ständig nass', desc: 'Innenräume mit üblicher Luftfeuchte, oder ständig unter Wasser.', wZ: 0.75, minFestigkeit: 'C16/20', minZement: 240, minFestigkeitNum: 16, cMin: 15 },
  'XC2': { name: 'Karbonatisierung: Nass, selten trocken', desc: 'Teile von Wasserbehältern, Gründungsbauteile im feuchten Erdreich.', wZ: 0.65, minFestigkeit: 'C20/25', minZement: 240, minFestigkeitNum: 20, cMin: 25 },
  'XC3': { name: 'Karbonatisierung: Mäßige Feuchte', desc: 'Innenräume mit hoher Luftfeuchte, offene Hallen.', wZ: 0.65, minFestigkeit: 'C20/25', minZement: 260, minFestigkeitNum: 20, cMin: 20 },
  'XC4': { name: 'Karbonatisierung: Wechselnd nass und trocken', desc: 'Außenbauteile mit direkter Beregnung.', wZ: 0.60, minFestigkeit: 'C25/30', minZement: 280, minFestigkeitNum: 25, cMin: 25 },
  
  'XD1': { name: 'Chloride: Mäßige Feuchte', desc: 'Bauteile im Sprühnebelbereich von Verkehrsflächen.', wZ: 0.55, minFestigkeit: 'C30/37', minZement: 300, minFestigkeitNum: 30, cMin: 30 },
  'XD2': { name: 'Chloride: Nass, selten trocken', desc: 'Solebäder, Bauteile, die chloridhaltigen Wässern ausgesetzt sind.', wZ: 0.50, minFestigkeit: 'C35/45', minZement: 320, minFestigkeitNum: 35, cMin: 40 },
  'XD3': { name: 'Chloride: Wechselnd nass und trocken', desc: 'Parkdecks, Brückenkappen, Spritzwasserbereiche.', wZ: 0.45, minFestigkeit: 'C35/45', minZement: 320, minFestigkeitNum: 35, cMin: 40 },
  
  'XS1': { name: 'Meerwasser: Salzhaltige Luft', desc: 'Außenbauteile in Küstennähe.', wZ: 0.55, minFestigkeit: 'C30/37', minZement: 300, minFestigkeitNum: 30, cMin: 30 },
  'XS2': { name: 'Meerwasser: Unter Wasser', desc: 'Bauteile in Hafenanlagen, die ständig unter Wasser liegen.', wZ: 0.50, minFestigkeit: 'C35/45', minZement: 320, minFestigkeitNum: 35, cMin: 40 },
  'XS3': { name: 'Meerwasser: Tidebereiche', desc: 'Bauteile in der Spritzwasser- oder Wechselzone von Meerwasser.', wZ: 0.45, minFestigkeit: 'C35/45', minZement: 320, minFestigkeitNum: 35, cMin: 40 },
  
  'XF1': { name: 'Frost: Mäßige Wassersättigung, ohne Taumittel', desc: 'Außenbauteile (Fassaden).', wZ: 0.60, minFestigkeit: 'C25/30', minZement: 280, minFestigkeitNum: 25 },
  'XF2': { name: 'Frost: Mäßige Wassersättigung, mit Taumittel', desc: 'Bauteile im Sprühnebelbereich von tausalzbehandelten Straßen.', wZ: 0.50, minFestigkeit: 'C35/45 (oder C25/30 mit LP)', minZement: 320, minFestigkeitNum: 35 },
  'XF3': { name: 'Frost: Hohe Wassersättigung, ohne Taumittel', desc: 'Offene Wasserbehälter, Bauteile in der Wasserwechselzone (Süßwasser).', wZ: 0.55, minFestigkeit: 'C35/45 (oder C25/30 mit LP)', minZement: 320, minFestigkeitNum: 35 },
  'XF4': { name: 'Frost: Hohe Wassersättigung, mit Taumittel', desc: 'Straßendecken, Brückenkappen, Räumflächen.', wZ: 0.50, minFestigkeit: 'C30/37 (mit LP)', minZement: 320, minFestigkeitNum: 30 },
  
  'XA1': { name: 'Chem. Angriff: Schwach', desc: 'Behälter für schwach angreifende Wässer/Böden.', wZ: 0.60, minFestigkeit: 'C25/30', minZement: 280, minFestigkeitNum: 25 },
  'XA2': { name: 'Chem. Angriff: Mäßig', desc: 'Kläranlagen, Güllebehälter.', wZ: 0.50, minFestigkeit: 'C35/45', minZement: 320, minFestigkeitNum: 35 },
  'XA3': { name: 'Chem. Angriff: Stark', desc: 'Industrieanlagen mit starkem chemischen Angriff.', wZ: 0.45, minFestigkeit: 'C35/45', minZement: 320, minFestigkeitNum: 35 },
  
  'XM1': { name: 'Verschleiß: Mäßig', desc: 'Böden in Wohn- und Bürogebäuden.', wZ: 0.55, minFestigkeit: 'C30/37', minZement: 300, minFestigkeitNum: 30, maxZement: 360 },
  'XM2': { name: 'Verschleiß: Stark', desc: 'Industrieböden mit Staplerverkehr.', wZ: 0.45, minFestigkeit: 'C35/45', minZement: 320, minFestigkeitNum: 35, maxZement: 360 },
  'XM3': { name: 'Verschleiß: Sehr stark', desc: 'Böden mit Kettenfahrzeugen.', wZ: 0.45, minFestigkeit: 'C35/45', minZement: 320, minFestigkeitNum: 35, maxZement: 360 },
};

const allExpClasses = Object.keys(EXPOSITIONSKLASSEN);

type Rezeptur = {
  name: string;
  zementArt: string;
  zementFestigkeit: string;
  zement: number;
  wz: number;
  fa: number;
  sf: number;
  hues: number;
  zusatzmittel: number;
  luft: number;
  groesstkorn: 8 | 16 | 32;
  f04: number;
  f48: number;
  f816: number;
  f1632: number;
  stahlfaser?: number;
  ppFaser?: number;
};

const rezepturen: Record<string, Rezeptur> = {
  'Hochbau (Standard)': {
    name: 'Hochbau (Standard)', zementArt: 'CEM II/A', zementFestigkeit: '32.5 R', zement: 300, wz: 0.60, fa: 0, sf: 0, hues: 0, zusatzmittel: 0, luft: 2.0, groesstkorn: 16, f04: 45, f48: 20, f816: 35, f1632: 0, stahlfaser: 0, ppFaser: 0
  },
  'Stahlfaserbeton (Industrieboden)': {
    name: 'Stahlfaserbeton (Industrieboden)', zementArt: 'CEM I', zementFestigkeit: '42.5 N', zement: 340, wz: 0.48, fa: 40, sf: 0, hues: 0, zusatzmittel: 2.5, luft: 1.5, groesstkorn: 16, f04: 45, f48: 25, f816: 30, f1632: 0, stahlfaser: 35, ppFaser: 0
  },
  'Tunnelbeton (Brandschutz PP-Faser)': {
    name: 'Tunnelbeton (Brandschutz PP-Faser)', zementArt: 'CEM I', zementFestigkeit: '42.5 R', zement: 360, wz: 0.44, fa: 50, sf: 0, hues: 0, zusatzmittel: 3.5, luft: 2.0, groesstkorn: 16, f04: 45, f48: 20, f816: 35, f1632: 0, stahlfaser: 0, ppFaser: 1.5
  },
  'Ingenieurbau (Brücke)': {
    name: 'Ingenieurbau (Brücke)', zementArt: 'CEM I', zementFestigkeit: '42.5 N', zement: 340, wz: 0.45, fa: 0, sf: 0, hues: 0, zusatzmittel: 2, luft: 2.0, groesstkorn: 32, f04: 35, f48: 15, f816: 20, f1632: 30, stahlfaser: 0, ppFaser: 0
  },
  'Bohrpfahl': {
    name: 'Bohrpfahl', zementArt: 'CEM III/A', zementFestigkeit: '32.5 N', zement: 380, wz: 0.55, fa: 0, sf: 0, hues: 0, zusatzmittel: 3, luft: 2.0, groesstkorn: 16, f04: 45, f48: 20, f816: 35, f1632: 0, stahlfaser: 0, ppFaser: 0
  },
  'Massenbeton': {
    name: 'Massenbeton', zementArt: 'CEM III/B', zementFestigkeit: '32.5 N', zement: 280, wz: 0.55, fa: 0, sf: 0, hues: 0, zusatzmittel: 0, luft: 2.0, groesstkorn: 32, f04: 35, f48: 15, f816: 20, f1632: 30, stahlfaser: 0, ppFaser: 0
  },
  'Spritzbeton': {
    name: 'Spritzbeton', zementArt: 'CEM I', zementFestigkeit: '42.5 R', zement: 400, wz: 0.45, fa: 0, sf: 0, hues: 0, zusatzmittel: 4, luft: 2.0, groesstkorn: 8, f04: 60, f48: 40, f816: 0, f1632: 0, stahlfaser: 40, ppFaser: 0
  },
  'Straßendecken': {
    name: 'Straßendecken', zementArt: 'CEM I', zementFestigkeit: '42.5 N', zement: 350, wz: 0.45, fa: 0, sf: 0, hues: 0, zusatzmittel: 1, luft: 4.5, groesstkorn: 32, f04: 30, f48: 15, f816: 25, f1632: 30, stahlfaser: 0, ppFaser: 0
  },
  'SVB (Selbstverdichtend)': {
    name: 'SVB (Selbstverdichtend)', zementArt: 'CEM I', zementFestigkeit: '42.5 R', zement: 380, wz: 0.40, fa: 100, sf: 0, hues: 0, zusatzmittel: 6, luft: 2.0, groesstkorn: 16, f04: 50, f48: 20, f816: 30, f1632: 0, stahlfaser: 0, ppFaser: 0
  },
  'Leichtbeton (LC20/22)': {
    name: 'Leichtbeton (LC20/22)', zementArt: 'CEM I', zementFestigkeit: '42.5 N', zement: 350, wz: 0.50, fa: 0, sf: 0, hues: 0, zusatzmittel: 3, luft: 3.0, groesstkorn: 16, f04: 40, f48: 30, f816: 30, f1632: 0, stahlfaser: 0, ppFaser: 0
  },
  'Infraleichtbeton (ILC)': {
    name: 'Infraleichtbeton (ILC)', zementArt: 'CEM I', zementFestigkeit: '52.5 R', zement: 400, wz: 0.45, fa: 0, sf: 30, hues: 0, zusatzmittel: 5, luft: 4.0, groesstkorn: 16, f04: 30, f48: 35, f816: 35, f1632: 0, stahlfaser: 0, ppFaser: 0
  },
  'UHPC': {
    name: 'UHPC', zementArt: 'CEM I', zementFestigkeit: '52.5 R', zement: 700, wz: 0.20, fa: 0, sf: 150, hues: 0, zusatzmittel: 20, luft: 1.5, groesstkorn: 8, f04: 100, f48: 0, f816: 0, f1632: 0, stahlfaser: 120, ppFaser: 0
  }
};


const FEUCHTIGKEITSKLASSEN = [
  { id: 'WO', name: 'WO (Trocken)', desc: 'Beton, der nach dem Austrocknen während der Nutzung trocken bleibt (z.B. Innenräume).' },
  { id: 'WF', name: 'WF (Feucht)', desc: 'Beton, der häufig oder lange feucht ist (z.B. ungeschützte Außenbauteile).' },
  { id: 'WA', name: 'WA (Feucht + Alkalien)', desc: 'Beton, der häufig feucht ist und externe Alkalien aufnimmt (z.B. Tausalzbereiche).' },
  { id: 'WS', name: 'WS (Feucht + Alkalien + Dynamisch)', desc: 'Wie WA, aber mit starker dynamischer mechanischer Beanspruchung (z.B. Betondecken auf Straßen).' }
];

function GrenzwerteSection() {
  return (
    <div className="flex flex-col gap-8 mt-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          Grenzwerte (DIN EN 206 / DIN 1045-2) <br/><span className="text-sm font-normal text-text-main/70">Quelle: betontechnische-daten.de u.a.</span>
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Dieser Abschnitt bietet übersichtliche Tabellen für die betontechnologischen Grenzwerte, Feuchtigkeits- und Konsistenzklassen (äquivalent zu den Tabellenwerken bekannter Zementhersteller).
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
             <h3 className="font-bold text-lg mb-3">Feuchtigkeitsklassen (AKR)</h3>
             <ul className="space-y-3">
               {FEUCHTIGKEITSKLASSEN.map(f => (
                 <li key={f.id} className="text-sm">
                   <strong className="text-text-main">{f.name}</strong> 
                   <div className="text-text-main/70">{f.desc}</div>
                 </li>
               ))}
             </ul>
          </div>
          
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
             <h3 className="font-bold text-lg mb-3">Konsistenzklassen</h3>
             <div className="text-sm text-text-main/80 mb-2">Die Konsistenz wird über Verdichtungsmaß (C) oder Ausbreitmaß (F) definiert:</div>
             <ul className="space-y-1 text-sm text-text-main/80">
               <li><strong>C0 (V ≥ 1,46) / F1 (A ≤ 340):</strong> Sehr steif / steif</li>
               <li><strong>C1 (V 1.45-1.26) / F2 (A 350-410):</strong> Steif / plastisch</li>
               <li><strong>C2 (V 1.25-1.11) / F3 (A 420-480):</strong> Weich (Standard im Hochbau)</li>
               <li><strong>C3 (V 1.10-1.04) / F4 (A 490-550):</strong> Sehr weich</li>
               <li><strong>F5 (A 560-620) / F6 (A ≥ 630):</strong> Fließfähig / sehr fließfähig</li>
             </ul>
          </div>
        </div>
        
        <div className="mt-6 bg-off-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-lg mb-3">Ausgewählte Expositionsklassen (LP-Beton vs. Normalbeton)</h3>
          <p className="text-sm text-text-main/80 mb-4">
            Besonders im Frostbereich (XF2, XF3, XF4) unterscheiden sich die Anforderungen stark, je nachdem ob künstliche Luftporenbildner (LP) eingesetzt werden.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-home-grau/30">
                  <th className="py-2 px-2">Klasse</th>
                  <th className="py-2 px-2">Ausführung</th>
                  <th className="py-2 px-2">max. w/z</th>
                  <th className="py-2 px-2">min. Festigkeit</th>
                  <th className="py-2 px-2">min. Zement (kg/m³)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-home-grau/10">
                  <td className="py-2 px-2 font-bold" rowSpan={2}>XF2 / XF3</td>
                  <td className="py-2 px-2">ohne LP</td>
                  <td className="py-2 px-2">0,50 / 0.55</td>
                  <td className="py-2 px-2">C35/45</td>
                  <td className="py-2 px-2">320</td>
                </tr>
                <tr className="border-b border-home-grau/30 bg-white">
                  <td className="py-2 px-2">mit LP (min. 4,0%)</td>
                  <td className="py-2 px-2">0,55</td>
                  <td className="py-2 px-2">C25/30</td>
                  <td className="py-2 px-2">300</td>
                </tr>
                <tr className="border-b border-home-grau/10">
                  <td className="py-2 px-2 font-bold" rowSpan={2}>XF4</td>
                  <td className="py-2 px-2">ohne LP</td>
                  <td className="py-2 px-2">0,45</td>
                  <td className="py-2 px-2">C50/60</td>
                  <td className="py-2 px-2">340</td>
                </tr>
                <tr className="border-b border-home-grau/30 bg-white">
                  <td className="py-2 px-2">mit LP (min. 4,0%)</td>
                  <td className="py-2 px-2">0,50</td>
                  <td className="py-2 px-2">C30/37</td>
                  <td className="py-2 px-2">320</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-main/60 mt-3">
            Hinweis: Bei Gesteinskörnung Dmax = 16 mm erhöht sich der erforderliche Mindestzementgehalt teils um ~20 kg/m³ und bei Dmax = 8 mm um ~40 kg/m³.
          </p>
        </div>
      </div>
    </div>
  );
}


function WalzKurvenSection() {
  const [wzWert, setWzWert] = useState(0.50);
  const [zementKlasse, setZementKlasse] = useState(42.5);

  const chartData = useMemo(() => {
    const wzValues = [];
    for (let i = 0.35; i <= 0.8; i += 0.05) {
      wzValues.push(i);
    }

    const calcStrength = (wz: number, klasse: number) => {
      let A = 100;
      if (klasse === 42.5) A = 120;
      if (klasse === 52.5) A = 140;
      return A / Math.pow(5, wz);
    };

    return {
      labels: wzValues.map(v => v.toFixed(2)),
      datasets: [
        {
          label: 'CEM 32.5',
          data: wzValues.map(wz => calcStrength(wz, 32.5)),
          borderColor: zementKlasse === 32.5 ? '#A3113E' : '#cbd5e1',
          borderWidth: zementKlasse === 32.5 ? 3 : 2,
          borderDash: zementKlasse === 32.5 ? [] : [5, 5],
          tension: 0.4,
          pointRadius: zementKlasse === 32.5 ? 4 : 0,
        },
        {
          label: 'CEM 42.5',
          data: wzValues.map(wz => calcStrength(wz, 42.5)),
          borderColor: zementKlasse === 42.5 ? '#A3113E' : '#cbd5e1',
          borderWidth: zementKlasse === 42.5 ? 3 : 2,
          borderDash: zementKlasse === 42.5 ? [] : [5, 5],
          tension: 0.4,
          pointRadius: zementKlasse === 42.5 ? 4 : 0,
        },
        {
          label: 'CEM 52.5',
          data: wzValues.map(wz => calcStrength(wz, 52.5)),
          borderColor: zementKlasse === 52.5 ? '#A3113E' : '#cbd5e1',
          borderWidth: zementKlasse === 52.5 ? 3 : 2,
          borderDash: zementKlasse === 52.5 ? [] : [5, 5],
          tension: 0.4,
          pointRadius: zementKlasse === 52.5 ? 4 : 0,
        }
      ]
    };
  }, [zementKlasse]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Druckfestigkeit f_cm (N/mm²)',
          font: { family: 'Work Sans', weight: 'bold' as const }
        },
        min: 10,
        max: 90,
      },
      x: {
        title: {
          display: true,
          text: 'Wasserzementwert (w/z)',
          font: { family: 'Work Sans', weight: 'bold' as const }
        }
      }
    },
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${formatDeZahl(context.parsed.y, 1)} N/mm²`
        }
      }
    }
  };

  const currentStrength = useMemo(() => {
    let A = 100;
    if (zementKlasse === 42.5) A = 120;
    if (zementKlasse === 52.5) A = 140;
    return A / Math.pow(5, wzWert);
  }, [wzWert, zementKlasse]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
      <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main">Walz-Kurven</h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Walz-Kurven beschreiben den empirischen Zusammenhang zwischen dem Wasserzementwert (w/z) und der zu erwartenden Druckfestigkeit des Betons für verschiedene Zementfestigkeitsklassen. Ein niedrigerer w/z-Wert führt zu einer höheren Festigkeit.
          </p>
        </div>

        <Slider
          label="Wasserzementwert (w/z)"
          min={0.35} max={0.80} step={0.01}
          value={wzWert} unit=""
          info="Massenverhältnis von wirksamem Wasser zu Zement. Maßgeblich für die Porosität und damit die Festigkeit des Zementsteins."
          onChange={(e) => setWzWert(Number(e.target.value))}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2"><label htmlFor="walzkurve-festigkeit" className="text-sm font-medium text-text-main">Zementfestigkeitsklasse</label><InfoTooltip text="Normfestigkeit des Zements nach 28 Tagen." /></div>
            <InfoTooltip text="Normdruckfestigkeit des Zements nach 28 Tagen (z.B. 32.5, 42.5, 52,5 MPa)." />
          </div>
          <select 
            id="walzkurve-festigkeit"
            aria-label="Zementfestigkeitsklasse"
            className="p-2 border border-home-grau rounded-md bg-off-white focus:outline-none focus:border-shiraz"
            value={zementKlasse}
            onChange={(e) => setZementKlasse(Number(e.target.value))}
          >
            <option value={32.5}>CEM 32.5</option>
            <option value={42.5}>CEM 42.5</option>
            <option value={52.5}>CEM 52.5</option>
          </select>
        </div>

        <div className="mt-4 p-4 bg-off-white rounded-xl border border-shiraz/20">
          <h3 className="text-sm font-bold text-shiraz mb-2">Erwartete mittlere Druckfestigkeit</h3>
          <div className="text-3xl font-bold text-shiraz">{formatDeZahl(currentStrength, 1)} <span className="text-lg font-normal">MPa</span></div>
          <div className="text-sm text-shiraz/80 mt-1"><FormulaText text="f_{cm} bei 28 Tagen" /></div>
        </div>
      </div>

      <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col h-[500px]">
        <h2 className="text-xl font-bold text-text-main mb-2">Abhängigkeit der Festigkeit vom w/z-Wert</h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            <FormulaText text="Darstellung nach dem Gesetz von Abrams: f_c = A / B^{w/z}. Die hervorgehobene Kurve entspricht der gewählten Zementklasse." />
          </p>
        </div>
        
        <div className="flex-1 relative w-full h-full">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}

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
  const [kSf, setKSf] = useState(DIN1045_2.kSilikastaub);
  const [kKsm, setKKsm] = useState(0.4); // Typisch für HüS nach abZ / DAfStb (DIN 1045-2)
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
    setRezeptur('manuell');
    setActiveTab('berechnung');
  };

  const results = useMemo(() => {
    // Massen (trocken)
    const wasserTrocken = wasser;
    
    // Normative Kappungsgrenzen (DIN 1045-2)
    let maxFaFactor = 0;
    if (zementArt === 'CEM I' || zementArt === 'CEM II/A') maxFaFactor = 0.33;
    else if (zementArt === 'CEM II/B') maxFaFactor = 0.25;
    
    // Für Flugasche (FA)
    const maxFa = maxFaFactor * zement;
    const anrechenbarFa = Math.min(fa, maxFa);
    
    // Für Silikastaub (SF)
    const maxSf = 0.11 * zement;
    const anrechenbarSf = Math.min(sf, maxSf);
    
    const anrechenbarKsm = hues; // Vereinfacht ohne harte Kappung
    const anrechenbarBiochar = biochar;
    
    // Volumina (dm³/m³)
    const volZement = zement / zementData[zementArt].rho;
    const volFa = fa > 0 ? fa / 2.2 : 0;
    const volSf = sf > 0 ? sf / 2.2 : 0;
    const volKsm = hues > 0 ? hues / 2.9 : 0;
    const volBiochar = biochar > 0 ? biochar / 1.5 : 0; // Annahme Rohdichte Biochar ca. 1.5 kg/dm³
    const volZM = zusatzmittel > 0 ? zusatzmittel / 1.05 : 0;
    const volLuft = luft * 10;

    // Faservolumina (dm³/m³) - DIN EN 14889-1 & 2
    const volStahlfaser = stahlfaser > 0 ? stahlfaser / 7.85 : 0; // rho = 7.85 kg/dm³
    const volPpFaser = ppFaser > 0 ? ppFaser / 0.91 : 0; // rho = 0.91 kg/dm³
    const volFasernGesamt = volStahlfaser + volPpFaser;
    
    // Gestein (trocken)
    const volGestein = 1000 - volZement - (wasserTrocken / 1.0) - volFa - volSf - volKsm - volBiochar - volZM - volLuft - volFasernGesamt;
    const masseGesteinTrocken = volGestein * rhoGestein; // rhoGestein variabel
    
    // Fraktionen (trocken)
    const m04_tr = masseGesteinTrocken * (f04 / 100);
    const m48_tr = masseGesteinTrocken * (f48 / 100);
    const m816_tr = masseGesteinTrocken * (f816 / 100);
    const m1632_tr = masseGesteinTrocken * (f1632 / 100);

    // Oberflächenfeuchte (wirksam für Zugabewasser) - kann negativ sein (Wasserbedarf)
    const ws04 = feuchte04 - wa04;
    const ws48 = feuchte48 - wa48;
    const ws816 = feuchte816 - wa816;
    const ws1632 = feuchte1632 - wa1632;
    const wsBiochar = feuchteBiochar - waBiochar;

    // Feuchte Gestein (nur Oberflächenfeuchte reduziert das Zugabewasser, negativer Wert erhöht es)
    const wasserAusGestein = m04_tr * (ws04/100) + m48_tr * (ws48/100) + m816_tr * (ws816/100) + m1632_tr * (ws1632/100);
    const wasserAusBiochar = biochar * (wsBiochar/100);
    
    // Zugabewasser
    const zugabewasser = wasserTrocken - wasserAusGestein - wasserAusBiochar;

    // Feuchte Massen Gestein (Gesamtfeuchte für die Waage)
    const m04_feucht = m04_tr * (1 + feuchte04/100);
    const m48_feucht = m48_tr * (1 + feuchte48/100);
    const m816_feucht = m816_tr * (1 + feuchte816/100);
    const m1632_feucht = m1632_tr * (1 + feuchte1632/100);
    const biochar_feucht = biochar * (1 + feuchteBiochar/100);

    // Äquivalenter w/z-Wert & w/b-Wert
    const wz = wasserTrocken / zement;
    const wzEq = wasserTrocken / (zement + kFa * anrechenbarFa + kSf * anrechenbarSf + kKsm * anrechenbarKsm + kBiochar * anrechenbarBiochar);
    const wbWert = wasserTrocken / (zement + fa + sf + hues + biochar); // reiner Wasser-Bindemittel-Wert ohne k-Faktoren

    // Mehlkorngehalt berechnen (Zement + Zusatzstoffe + Gesteinsfeinanteile <= 0.125 mm)
    const mehlkornAusSand = m04_tr * (feinanteilSand / 100);
    const mehlkornGesamt = zement + fa + sf + hues + biochar + mehlkornAusSand;
    
    // Mehlkornprüfung nur bei XF oder XM relevant nach DIN 1045-2 (Tabelle 13: Höchstzulässiger Mehlkorngehalt)
    const hasXFoderXM = expClasses.some(c => c.startsWith('XF') || c.startsWith('XM'));
    // Grenzwerte DIN 1045-2: d_g = 8 mm -> 500 kg/m³, d_g = 16 mm -> 450 kg/m³, d_g = 32 mm -> 400 kg/m³ (bei Zementgehalt ≤ 400 kg/m³)
    const maxMehlkornWert = groesstkorn <= 8 ? 500 : groesstkorn <= 16 ? 450 : 400;
    const maxMehlkornText = `${maxMehlkornWert} kg/m³ (DIN 1045-2 Tab. 13)`;
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

    const masseGesamtTrocken = zement + wasserTrocken + fa + sf + hues + biochar + zusatzmittel + stahlfaser + ppFaser + masseGesteinTrocken;
    const frischbetonRohdichte = masseGesamtTrocken / 1000; // kg/dm³

    const volLeim = volZement + (wasserTrocken / 1.0) + volFa + volSf + volKsm + volBiochar + volZM;

    // Limits prüfen
    let reqMaxWz = 1.0;
    let reqMinZ = 0;
    let reqMinC = '';
    let reqMinCover = 0;
    let reqMaxZement = Infinity;

    const scores = { XC: 0, XD_XS: 0, XF: 0, XA: 0, XM: 0 };

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
            clsWz = 0.55;
            clsMinZ = 320;
            clsMinC = 'C35/45';
            clsMinFestNum = 35;
          } else if (cls === 'XF4') {
            clsWz = 0.45;
            clsMinZ = 340;
            clsMinC = 'C50/60 (ohne LP)';
            clsMinFestNum = 50;
          }
        }

        // Größtkornkorrektur des Mindestzementgehalts nach DIN 1045-2:
        // Bei Dmax = 16 mm: +20 kg/m³
        // Bei Dmax = 8 mm: +40 kg/m³
        if (groesstkorn === 16) clsMinZ += 20;
        else if (groesstkorn === 8) clsMinZ += 40;

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

    const isWzOk = wzEq <= reqMaxWz;
    const isZOk = zement >= reqMinZ;
    const isMaxZOk = reqMaxZement === Infinity || zement <= reqMaxZement;

    const lpWaterReduction = isLpActive ? Math.max(0, (luft - 1.5) * 2.5) : 0;
    const estimatedWater = Math.max(130, Math.round(KORN_WATER_BASE[groesstkorn] + KONSISTENZ_DATA[konsistenz].waterMod - lpWaterReduction));

    const radarChartData = {
      labels: ['Karbonatisierung (XC)', 'Chloride (XD/XS)', 'Frost (XF)', 'Chemie (XA)', 'Verschleiß (XM)'],
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
      reqMaxWz, reqMinZ, reqMinC, reqMinCover, reqMaxZement, isWzOk, isZOk, isMaxZOk, radarChartData, estimatedWater,
      maxFa, anrechenbarFa, maxSf, anrechenbarSf,
      mehlkornAusSand, mehlkornGesamt, maxMehlkornText, isMehlkornOk, hasXFoderXM,
      lpWaterReduction, isLpActive
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

  // Sieblinien Chart Data
  const dmax = groesstkorn;
  let labels: number[] = [];
  let dataIst = [];
  let dataA = [];
  let dataB = [];
  let dataC = [];

  if (dmax === 32) {
    labels = [0.125, 4, 8, 16, 32];
    dataIst = [0, f04, f04 + f48, f04 + f48 + f816, f04 + f48 + f816 + f1632];
    dataA = [0, 28, 40, 57, 100];
    dataB = [0, 40, 57, 71, 100];
    dataC = [0, 57, 71, 85, 100];
  } else if (dmax === 16) {
    labels = [0.125, 4, 8, 16];
    dataIst = [0, f04, f04 + f48, f04 + f48 + f816];
    dataA = [0, 35, 50, 100];
    dataB = [0, 50, 71, 100];
    dataC = [0, 71, 85, 100];
  } else {
    labels = [0.125, 4, 8];
    dataIst = [0, f04, f04 + f48];
    dataA = [0, 50, 100];
    dataB = [0, 71, 100];
    dataC = [0, 85, 100];
  }

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
      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'grenzwerte' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('grenzwerte')}
        >
          <ShieldAlert size={16} /> Grenzwerte &amp; Klassen
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'berechnung' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('berechnung')}
        >
          <Calculator size={16} /> Berechnung
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'beispiele' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('beispiele')}
        >
          <BookOpen size={16} /> Geprüfte Beispielrechnungen
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'walzkurven' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('walzkurven')}
        >
          <Activity size={16} /> Walz-Kurven
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'packungsdichte' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('packungsdichte')}
        >
          <Layers size={16} /> Packungsdichte
        </button>
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'anleitung' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('anleitung')}
        >
          <BookOpen size={16} /> Anleitung
        </button>
      </div>

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
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            Mischungsberechnung &amp; Betonrezeptur
            <InfoTooltip text="Berechnung der volumetrischen Zusammensetzung, Rezeptur mit Gesteinsfeuchte und detailliertem CO2-Fußabdruck." />
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300">
            Berechnet nach DIN EN 1992-1-1 + NA (DE)
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 my-4">
          <p>
            Die Mischungsberechnung (Stoffraumrechnung) ermittelt die Volumina aller Betonbestandteile, die zusammen genau 1 m³ (1000 dm³) ergeben müssen. Hierbei werden auch Zusatzstoffe (mit k-Wert-Ansatz), die Gesteinsfeuchte (für das Zugabewasser) und der detaillierte CO₂-Fußabdruck berücksichtigt. Zudem wird geprüft, ob die normativen Grenzwerte für Zementgehalt und w/z-Wert eingehalten werden.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            
            {/* Vorgegebene Rezepturen */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main flex items-center gap-2">
                <label htmlFor="rezeptur-select">Vorgegebene Rezepturen</label>
                <InfoTooltip text="Wählen Sie eine vordefinierte Rezeptur für spezifische Anwendungen aus." />
              </h3>
              <div>
                <select 
                  id="rezeptur-select"
                  aria-label="Vorgegebene Rezepturen"
                  value={rezeptur} 
                  onChange={handleRezepturChange}
                  className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
                >
                  <option value="manuell">Manuelle Eingabe</option>
                  {Object.keys(rezepturen).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expositionsklassen & Bauteil */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Expositionsklassen & Bauteil</h3>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="bauteil-select" className="block text-sm font-medium text-text-main mb-1">Bauteil-Voreinstellung</label>
                  <InfoTooltip text="Vordefinierte Parameter für typische Bauteile." />
                </div>
                <select 
                  id="bauteil-select"
                  aria-label="Bauteil-Voreinstellung"
                  value={bauteil} 
                  onChange={handleBauteilChange}
                  className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
                >
                  {BAUTEILE.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex border-b border-home-grau/30 overflow-x-auto">
                {allExpClasses.map(cls => (
                  <div key={cls} className="relative group">
                    <button
                      onClick={() => toggleExpClass(cls)}
                      className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors ${
                        expClasses.includes(cls) 
                          ? 'bg-shiraz text-white border-shiraz' 
                          : 'bg-white text-text-main/70 border-home-grau/30 hover:border-shiraz/50'
                      }`}
                    >
                      {cls}
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded p-2 z-10 text-center pointer-events-none">
                      {EXPOSITIONSKLASSEN[cls].desc}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Normative Anforderungen */}
              {expClasses.length > 0 && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-home-grau/30 text-sm">
                  <div className="font-semibold mb-2 text-text-main">Anforderungen (DIN EN 206):</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-center">
                    <div className="bg-off-white p-2 rounded">
                      <div className="text-xs text-text-main/60">max. (w/z)eq</div>
                      <div className="font-bold">{formatDeZahl(results.reqMaxWz, 2)}</div>
                    </div>
                    <div className="bg-off-white p-2 rounded">
                      <div className="text-xs text-text-main/60">min. Zement</div>
                      <div className="font-bold">{formatDeWert(results.reqMinZ)} kg</div>
                    </div>
                    <div className="bg-off-white p-2 rounded">
                      <div className="text-xs text-text-main/60">min. Festigkeit</div>
                      <div className="font-bold">{results.reqMinC}</div>
                    </div>
                    <div className="bg-off-white p-2 rounded">
                      <div className="text-xs text-text-main/60">min. Deckung</div>
                      <div className="font-bold">{results.reqMinCover > 0 ? `${formatDeWert(results.reqMinCover)} mm` : '-'}</div>
                    </div>
                    <div className="bg-off-white p-2 rounded">
                      <div className="text-xs text-text-main/60">max. Zement</div>
                      <div className="font-bold">{results.reqMaxZement !== Infinity ? `${formatDeWert(results.reqMaxZement)} kg` : '-'}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-text-main mb-2 text-center">Beanspruchungsprofil</h4>
                    <div className="w-full max-w-xs mx-auto aspect-square">
                      <Radar 
                        data={results.radarChartData} 
                        options={{
                          scales: {
                            r: {
                              min: 0,
                              max: 4,
                              ticks: { stepSize: 1, display: false },
                              grid: { color: 'rgba(0,0,0,0.1)' },
                              pointLabels: { font: { size: 10 } }
                            }
                          },
                          plugins: { legend: { display: false } },
                          maintainAspectRatio: false
                        }} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Zement & Wasser */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Zement & Wasser</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="zementart-select" className="block text-sm font-medium text-text-main mb-1">Zementart</label>
                    <InfoTooltip text="Art des verwendeten Zements (z.B. CEM I, CEM II)." />
                  </div>
                  <select 
                    id="zementart-select"
                    aria-label="Zementart"
                    value={zementArt} 
                    onChange={(e) => setZementArt(e.target.value)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
                  >
                    {Object.keys(zementData).map(z => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="zementfestigkeit-select" className="block text-sm font-medium text-text-main mb-1 flex items-center gap-2">
                    Festigkeitsklasse
                    <InfoTooltip text="N = normale Erhärtung, R = schnelle Erhärtung (rapid)" />
                  </label>
                  <select 
                    id="zementfestigkeit-select"
                    aria-label="Festigkeitsklasse"
                    value={zementFestigkeit} 
                    onChange={(e) => setZementFestigkeit(e.target.value)}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
                  >
                    {festigkeitsklassen.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Slider label="Zementgehalt z" info="Masse des Zements pro Kubikmeter Beton." min={200} max={500} step={5} value={zement} unit="kg/m3" onChange={(e) => setZement(Number(e.target.value))} />
              <div className="mt-4">
                <Slider  label="Wasser" 
                  min={100} max={250} step={1} 
                  value={wasser} unit="kg/m³" 
                  onChange={(e) => setWasser(Number(e.target.value))} 
                />
                
                <div className="mt-6 p-4 bg-white rounded-xl border border-home-grau/30 shadow-sm">
                  <h4 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
                    <Droplets size={16} className="text-blue-500" />
                    Wasseranspruch abschätzen
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div>
                      <label htmlFor="konsistenz-select" className="block text-xs font-medium text-text-main/80 mb-1">Konsistenzklasse</label>
                      <select 
                        id="konsistenz-select"
                        aria-label="Konsistenzklasse"
                        value={konsistenz} 
                        onChange={(e) => setKonsistenz(e.target.value)}
                        className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50 text-sm"
                      >
                        {Object.entries(KONSISTENZ_DATA).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="text-xs text-text-main/80 mb-1">Geschätzter Bedarf (für Dmax {groesstkorn}mm):</div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-blue-600">{formatDeWert(results.estimatedWater)} kg/m³</span>
                        <button 
                          onClick={() => setWasser(results.estimatedWater)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors border border-blue-200"
                        >
                          Übernehmen
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-text-main/60 mt-3">
                    Der Wasseranspruch hängt maßgeblich vom Größtkorn und der gewünschten Konsistenz ab. Zusatzmittel (z.B. Fließmittel) können den tatsächlichen Wasserbedarf deutlich reduzieren.
                  </p>
                </div>

                {!results.isWzOk && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-200">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    <div>
                      <strong>Achtung:</strong> Der (w/z)eq-Wert von {formatDeZahl(results.wzEq, 2)} überschreitet den für die gewählten Expositionsklassen zulässigen Maximalwert von {formatDeZahl(results.reqMaxWz, 2)}.
                    </div>
                  </div>
                )}
                
                {!results.isZOk && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-200">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    <div>
                      <strong>Achtung:</strong> Der Zementgehalt von {formatDeWert(zement)} kg/m³ unterschreitet den für die gewählten Expositionsklassen geforderten Mindestwert von {formatDeWert(results.reqMinZ)} kg/m³.
                    </div>
                  </div>
                )}

                {!results.isMaxZOk && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-200">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    <div>
                      <strong>Achtung:</strong> Der Zementgehalt von {formatDeWert(zement)} kg/m³ überschreitet den für die gewählte Verschleißklasse (XM) empfohlenen Maximalwert von {formatDeWert(results.reqMaxZement)} kg/m³ (Gefahr einer abriebanfälligen Zementleimschicht).
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-home-grau/10">
                  <div className="flex items-center gap-2">
                    <label htmlFor="ziel-druckfestigkeit-select" className="block text-sm font-medium text-text-main mb-1">Ziel-Druckfestigkeit (Beton)</label>
                    <InfoTooltip text="Angestrebte Druckfestigkeit des Betons nach 28 Tagen." />
                  </div>
                  <select 
                    id="ziel-druckfestigkeit-select"
                    aria-label="Ziel-Druckfestigkeit (Beton)"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'C20/25') setWasser(zement * 0.65);
                      else if (val === 'C25/30') setWasser(zement * 0.60);
                      else if (val === 'C30/37') setWasser(zement * 0.55);
                      else if (val === 'C35/45') setWasser(zement * 0.50);
                      else if (val === 'C40/50') setWasser(zement * 0.45);
                      else if (val === 'C45/55') setWasser(zement * 0.40);
                      else if (val === 'C50/60') setWasser(zement * 0.35);
                    }}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50 text-sm"
                  >
                    <option value="">Manuell gewählt</option>
                    <option value="C20/25">C20/25 (w/z ≈ 0,65)</option>
                    <option value="C25/30">C25/30 (w/z ≈ 0,60)</option>
                    <option value="C30/37">C30/37 (w/z ≈ 0,55)</option>
                    <option value="C35/45">C35/45 (w/z ≈ 0,50)</option>
                    <option value="C40/50">C40/50 (w/z ≈ 0,45)</option>
                    <option value="C45/55">C45/55 (w/z ≈ 0,40)</option>
                    <option value="C50/60">C50/60 (w/z ≈ 0,35)</option>
                  </select>
                  {results.reqMinC && (
                    <div className="text-xs text-text-main/60 mt-1">
                      Min. gefordert durch Expositionsklassen: <strong>{results.reqMinC}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Zusatzstoffe */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Betonzusatzstoffe (k-Wert-Ansatz)</h3>
              
              {/* Flugasche */}
              <div className="grid grid-cols-2 gap-4 items-end mt-4">
                <div>
                  <Slider label="Flugasche (FA)" info="Menge an zugegebener Flugasche." min={0} max={150} step={5} value={fa} unit="kg/m3" onChange={(e) => setFa(Number(e.target.value))} />
                  {fa > results.maxFa && (
                    <div className="text-xs text-torch-red mt-1">
                      (Anrechenbar max. {formatDeZahl(results.maxFa, 0)} kg/m³ bei {formatDeWert(zement)} kg/m³ {zementArt})
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 pdf-parameter">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-text-main">k-Wert FA</label>
                      <InfoTooltip text="Nach Typ II: Flugasche üblicherweise 0.4 (DIN 1045-2). Für Unterwasserbeton nach DAfStb max. 0.7." />
                    </div>
                    <span className="text-sm font-bold text-shiraz">{formatDeWert(kFa)} -</span>
                  </div>
                  <div className="text-xs text-home-grau">Nach DIN 1045-2: k = {formatDeWert(DIN1045_2.kFlugasche)}</div>
                </div>
              </div>

              {/* Silikastaub */}
              <div className="grid grid-cols-2 gap-4 items-end mt-4">
                <div>
                  <Slider label="Silikastaub (SF)" info="Menge an zugegebenem Silikastaub." min={0} max={50} step={1} value={sf} unit="kg/m3" onChange={(e) => setSf(Number(e.target.value))} />
                  {sf > results.maxSf && (
                    <div className="text-xs text-torch-red mt-1">
                      (Anrechenbar max. {formatDeZahl(results.maxSf, 0)} kg/m³ bei {formatDeWert(zement)} kg/m³ Zement)
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 pdf-parameter">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-text-main">k-Wert SF</label>
                      <InfoTooltip text="DIN EN 206 nennt 2.0 als Empfehlung, in Deutschland gilt nach DIN 1045-2 k = 1.0" />
                    </div>
                    <span className="text-sm font-bold text-shiraz">1,0 -</span>
                  </div>
                  <div className="text-xs text-home-grau">In Deutschland gilt nach DIN 1045-2 k = 1,0</div>
                </div>
              </div>

              {/* Hüttensandmehl (HüS) */}
              <div className="grid grid-cols-2 gap-4 items-end mt-4">
                <div>
                  <Slider 
                    label="Hüttensandmehl (HüS)" 
                    info="Granulierte Hochofenschlacke nach DIN EN 15167-1. Latent-hydraulischer Zusatzstoff zur Dämpfung der Hydratationswärme und für hohen Sulfatwiderstand." 
                    min={0} 
                    max={200} 
                    step={5} 
                    value={hues} 
                    unit="kg/m³" 
                    onChange={(e) => setKsm(Number(e.target.value))} 
                  />
                  {hues > 0 && (
                    <div className="text-xs text-shiraz mt-1">
                      (Latent-hydraulisch: Dichte 2,90 kg/dm³, V_HüS = {formatDeZahl((hues / 2.9), 1)} dm³)
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 pdf-parameter">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-text-main">k-Wert HüS</label>
                      <InfoTooltip text="Hüttensandmehl Typ II (DIN EN 15167-1 / DIN 1045-2). Anrechnung auf w/z-Wert und Mindestzementgehalt in Deutschland nach bauaufsichtlicher Zulassung bzw. Kombinationskonzept (typisch k = 0,4 bis 0,6)." />
                    </div>
                    <span className="text-sm font-bold text-shiraz">{formatDeZahl(kKsm, 1)} -</span>
                  </div>
                  <Slider 
                    label="" 
                    info="" 
                    min={0.0} 
                    max={0.8} 
                    step={0.1} 
                    value={kKsm} 
                    unit="-" 
                    onChange={(e) => setKKsm(Number(e.target.value))} 
                  />
                </div>
              </div>

              {/* Pflanzenkohle (Biochar) */}
              <div className="grid grid-cols-2 gap-4 items-end mt-4">
                <div>
                  <Slider 
                    label="Pflanzenkohle (Biochar)" 
                    info="Biochar bindet dauerhaft CO2 im Beton (ca. -2,5 kg CO2 pro kg Biochar) und dient als hochfeiner Zusatzstoff." 
                    min={0} 
                    max={50} 
                    step={1} 
                    value={biochar} 
                    unit="kg/m³" 
                    onChange={(e) => setBiochar(Number(e.target.value))} 
                  />
                </div>
                <div className="flex flex-col gap-2 pdf-parameter">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-text-main">k-Wert Biochar</label>
                      <InfoTooltip text="Pflanzenkohle (Biochar): Aktuell kein generischer k-Wert in DIN 1045-2 festgelegt. Eine Anrechnung auf Mindestzement und w/z-Wert bedarf in Deutschland einer abZ/aBG. In wissenschaftlichen Studien liegt der Wirksamkeitsfaktor k typischerweise zwischen 0,0 (inerter Füllstoff) und 0,2–0,3 (heterogene Keimbildungseffekte bei Feinstmahlung). Negative k-Werte bilden Festigkeitsverluste bei unkompensierter Zementsubstitution ab." />
                    </div>
                    <span className="text-sm font-bold text-shiraz">{formatDeZahl(kBiochar, 1)} -</span>
                  </div>
                  <Slider 
                    label="" 
                    info="" 
                    min={-1.0} 
                    max={1.0} 
                    step={0.1} 
                    value={kBiochar} 
                    unit="-" 
                    onChange={(e) => setKBiochar(Number(e.target.value))} 
                  />
                </div>
              </div>
              {biochar > 0 && (
                <div className="grid grid-cols-2 gap-4 items-end mt-4 p-3 bg-white rounded-lg border border-home-grau/30">
                  <Slider label="Gesamtfeuchte Biochar" info="Gesamter Wassergehalt der Pflanzenkohle." min={0} max={100} step={1} value={feuchteBiochar} unit="M.-%" onChange={(e) => setFeuchteBiochar(Number(e.target.value))} />
                  <Slider label="Wasserbedarf (WA) Biochar"  min={0} max={100} step={1} value={waBiochar} unit="M.-%" onChange={(e) => setWaBiochar(Number(e.target.value))} />
                </div>
              )}

            </div>

            {/* Zusatzmittel & Luft (inkl. LP-Beton Automatik) */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main">Zusatzmittel &amp; Luft (LP-Beton)</h3>
              <Slider label="Zusatzmittel (FM/LP)" info="Menge an Fließmittel oder Luftporenbildner." min={0} max={10} step={0.1} value={zusatzmittel} unit="kg/m3" onChange={(e) => setZusatzmittel(Number(e.target.value))} />
              <div className="mt-4">
                <Slider label="Luftporengehalt" min={0} max={10} step={0.5} value={luft} unit="Vol.-%" onChange={(e) => setLuft(Number(e.target.value))} />
              </div>

              {/* LP-Beton Steuerung & Konsequenzen für Gesteinskörnung & Mischung */}
              <div className="mt-4 pt-4 border-t border-home-grau/20 flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Wind size={16} className="text-shiraz" />
                    <span className="text-sm font-bold text-text-main">LP-Beton Automatik &amp; Gesteinsfolgen</span>
                    <InfoTooltip text="Automatische Berücksichtigung von künstlich eingebrachten Mikroluftporen nach DIN 1045-2 Tabelle F.2.2. Künstliche Luftporen verdrängen Gesteinsvolumen im Stoffraum, wirken wie Feinstsand (Walz'sche Regel) und senken den Wasseranspruch durch den Kugellagereffekt." />
                  </div>
                  
                  {/* Modus-Wähler */}
                  <div className="flex bg-white p-1 rounded-lg border border-home-grau/30 text-xs">
                    <button
                      type="button"
                      onClick={() => setLpOption('auto')}
                      className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                        lpOption === 'auto' 
                          ? 'bg-shiraz text-white shadow-xs font-bold' 
                          : 'text-text-main/70 hover:text-text-main'
                      }`}
                    >
                      Auto-Erkennung
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLpOption('mit_lp');
                        if (luft < minLpNorm) setLuft(minLpNorm);
                      }}
                      className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                        lpOption === 'mit_lp' 
                          ? 'bg-shiraz text-white shadow-xs font-bold' 
                          : 'text-text-main/70 hover:text-text-main'
                      }`}
                    >
                      Mit LP
                    </button>
                    <button
                      type="button"
                      onClick={() => setLpOption('ohne_lp')}
                      className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                        lpOption === 'ohne_lp' 
                          ? 'bg-shiraz text-white shadow-xs font-bold' 
                          : 'text-text-main/70 hover:text-text-main'
                      }`}
                    >
                      Ohne LP
                    </button>
                  </div>
                </div>

                {/* Status Badge & Normative Info */}
                <div className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  isLpActive 
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isLpActive ? 'bg-blue-600 animate-pulse' : 'bg-slate-400'}`} />
                    <span>
                      <strong>Status:</strong> {isLpActive ? 'LP-Beton aktiv (Frost-Tausalz-Konzept)' : 'Normalbeton (Verdichtungsporen)'}
                    </span>
                  </div>
                  {isLpActive && (
                    <div className="font-mono text-blue-800 font-medium">
                      DIN 1045-2 Mindestluftgehalt für Dmax {groesstkorn} mm: <strong>≥ {formatDeZahl(minLpNorm, 1)} Vol.-%</strong>
                    </div>
                  )}
                </div>

                {/* Warnung bei Unterschreitung des Mindestluftgehalts */}
                {isLpActive && luft < minLpNorm && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-red-800">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Achtung:</strong> Der eingestellte Luftgehalt ({formatDeZahl(luft, 1)} Vol.-%) unterschreitet den normativen Mindestluftgehalt ({formatDeZahl(minLpNorm, 1)} Vol.-% für Dmax = {groesstkorn} mm nach DIN 1045-2 Tabelle F.2.2)!
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLuft(minLpNorm)}
                      className="px-2.5 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-all text-xs whitespace-nowrap self-end sm:self-auto cursor-pointer"
                    >
                      Auf {formatDeZahl(minLpNorm, 1)} % anpassen
                    </button>
                  </div>
                )}

                {/* 4 Konsequenzen-Karten für Gesteinskörnung & Mischung */}
                {isLpActive && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* Karte 1: Gesteinsvolumenverdrängung */}
                    <div className="bg-white p-3 rounded-lg border border-home-grau/25 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-xs text-text-main flex items-center justify-between">
                          <span>1. Gesteinsverdrängung</span>
                          <span className="text-shiraz font-mono font-bold">-{formatDeZahl(deltaLuftVol, 1)} dm³</span>
                        </div>
                        <p className="text-[11px] text-text-main/70 mt-1 leading-snug">
                          Zusätzliche Mikroluftporen verdrängen im 1000-dm³-Stoffraum direkt Gesteinskörnung:
                        </p>
                      </div>
                      <div className="mt-2 text-xs font-mono font-semibold text-text-main bg-off-white/80 p-1.5 rounded">
                        Gesteinsmasse sinkt um <strong>-{formatDeZahl(deltaGesteinMasse, 1)} kg/m³</strong>
                      </div>
                    </div>

                    {/* Karte 2: Sandanteilsreduktion nach Walz */}
                    <div className="bg-white p-3 rounded-lg border border-home-grau/25 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-xs text-text-main flex items-center justify-between">
                          <span>2. Sandanteil (Walz-Regel)</span>
                          <span className="text-shiraz font-mono font-bold">-{formatDeWert(empfohleneSandReduktion)}% Sand</span>
                        </div>
                        <p className="text-[11px] text-text-main/70 mt-1 leading-snug">
                          Mikroluftporen wirken wie Feinsandkugeln („Kugellagereffekt“). Ohne Korrektur wird der Beton übermörtelt.
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={applyWalzSandReduction}
                          disabled={empfohleneSandReduktion <= 0}
                          className="w-full px-2 py-1 bg-shiraz/10 hover:bg-shiraz text-shiraz hover:text-white rounded text-[11px] font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Scale size={12} />
                          <span>Sandreduktion anwenden (-{formatDeWert(empfohleneSandReduktion)}%)</span>
                        </button>
                      </div>
                    </div>

                    {/* Karte 3: Wasseranspruch (Kugellagereffekt) */}
                    <div className="bg-white p-3 rounded-lg border border-home-grau/25 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-xs text-text-main flex items-center justify-between">
                          <span>3. Wasseranspruch</span>
                          <span className="text-green-700 font-mono font-bold">-{formatDeZahl(wasserEinsparungLP, 1)} L/m³</span>
                        </div>
                        <p className="text-[11px] text-text-main/70 mt-1 leading-snug">
                          Die sphärischen Luftporen verbessern die Gleitfähigkeit der Gesteinskörner und verringern das Bluten (Bleeding).
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-green-800 bg-green-50/70 p-1.5 rounded font-medium">
                        Wasserersparnis für Konsistenz {konsistenz}: ca. <strong>{formatDeZahl(wasserEinsparungLP, 1)} Liter/m³</strong>
                      </div>
                    </div>

                    {/* Karte 4: Festigkeitsabschlag & Norm-Kompensation */}
                    <div className="bg-white p-3 rounded-lg border border-home-grau/25 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-xs text-text-main flex items-center justify-between">
                          <span>4. Festigkeitseinfluss</span>
                          <span className="text-orange-700 font-mono font-bold">-{formatDeZahl(festigkeitsVerlustLP, 0)} MPa</span>
                        </div>
                        <p className="text-[11px] text-text-main/70 mt-1 leading-snug">
                          Jedes Vol.-% Luftporen kostet ca. 4 MPa Festigkeit. DIN 1045-2 kompensiert dies normativ:
                        </p>
                      </div>
                      <div className="mt-2 text-[11px] text-orange-900 bg-orange-50/70 p-1.5 rounded font-medium">
                        XF2/XF3: <strong>C25/30</strong> statt C35/45; XF4: <strong>C30/37</strong> statt C50/60
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Faserbewehrung (Metall & Kunststoff) */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-main flex items-center gap-1.5">
                  <span>Faserbewehrung (Metall &amp; PP)</span>
                  <InfoTooltip text="Faserzugabe nach DIN EN 14889-1 (Stahlfasern / Metall) und DIN EN 14889-2 (Polymerfasern / PP). Fasern verdrängen entsprechend ihrer Dichte Gesteinsvolumen im Stoffraum." />
                </h3>
                {(stahlfaser > 0 || ppFaser > 0) && (
                  <span className="text-[11px] font-bold text-shiraz bg-shiraz/10 px-2.5 py-0.5 rounded-full">
                    {formatDeZahl(results.volFasernGesamt, 2)} dm³/m³ Stoffraum
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Slider 
                    label="Stahlfasern / Metallfasern" 
                    info="Dosierung von Stahlfasern nach DIN EN 14889-1 (Dichte ca. 7,85 kg/dm³). Typisch für Industrieböden und Spritzbeton: 20 bis 45 kg/m³, hochbeansprucht bis 80 kg/m³." 
                    min={0} 
                    max={80} 
                    step={2} 
                    value={stahlfaser} 
                    unit="kg/m³" 
                    onChange={(e) => setStahlfaser(Number(e.target.value))} 
                  />
                  <div className="text-[10px] text-text-main/60 mt-1 flex justify-between font-mono">
                    <span>0 kg (ohne SF)</span>
                    <span className="text-shiraz">Industrieboden: ~30 kg</span>
                    <span>80 kg</span>
                  </div>
                </div>

                <div>
                  <Slider 
                    label="PP-Fasern (Polypropylen)" 
                    info="Dosierung von Polymer-/PP-Fasern nach DIN EN 14889-2 (Dichte ca. 0,91 kg/dm³). Mikrofasern gegen Schwindrisse & Brandabplatzungen (Tunnelbau nach ZTV-ING): 0,9 bis 2,0 kg/m³. Makrofasern statisch: 3 bis 7 kg/m³." 
                    min={0} 
                    max={8.0} 
                    step={0.1} 
                    value={ppFaser} 
                    unit="kg/m³" 
                    onChange={(e) => setPpFaser(Number(e.target.value))} 
                  />
                  <div className="text-[10px] text-text-main/60 mt-1 flex justify-between font-mono">
                    <span>0 kg (ohne PP)</span>
                    <span className="text-shiraz">Brandschutz / Risse: 1,5 kg</span>
                    <span>8 kg</span>
                  </div>
                </div>
              </div>

              {(stahlfaser > 0 || ppFaser > 0) && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-home-grau/25 text-xs text-text-main/80 space-y-1">
                  <div className="font-semibold text-text-main flex items-center gap-1.5">
                    <span className="text-shiraz">Faserwirksamkeit &amp; Regelwerk:</span>
                  </div>
                  <div className="text-[11px] leading-relaxed space-y-1">
                    {stahlfaser > 0 && (
                      <p>
                        • <strong>Stahlfasern ({formatDeWert(stahlfaser)} kg/m³):</strong> Beanspruchen {formatDeZahl(results.volStahlfaser, 2)} dm³ Stoffraumvolumen (Dichte 7,85 kg/dm³). Erhöhen die Biegezug- und Nachrisszugfestigkeit nach der DAfStb-Richtlinie „Stahlfaserbeton“ (z. B. Leistungsklassen L1,2/1,2).
                      </p>
                    )}
                    {ppFaser > 0 && (
                      <p>
                        • <strong>PP-Fasern ({formatDeZahl(ppFaser, 1)} kg/m³):</strong> Beanspruchen {formatDeZahl(results.volPpFaser, 2)} dm³ Stoffraumvolumen (Dichte 0,91 kg/dm³). Schmelzen im Brandfall bei ~165 °C, bilden Entlastungskanäle gegen Porenwasserdampfdruck und verhindern explosionsartige Betonabplatzungen (ZTV-ING Teil 5).
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Gesteinskörnung & Feuchte */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main flex items-center justify-between">
                Gesteinskörnung & Feuchte
                {!isFraktionenOk && (
                  <span className="text-red-500 text-xs flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
                    <AlertTriangle size={14} /> Summe: {formatDeZahl(sumFraktionen, 1)}% (muss 100% sein)
                  </span>
                )}
                {isFraktionenOk && (
                  <span className="text-green-600 text-xs flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                    <CheckCircle2 size={14} /> Summe: 100%
                  </span>
                )}
              </h3>
              
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="groesstkorn-select" className="block text-sm font-medium text-text-main mb-1">Größtkorn (Dmax)</label>
                    <InfoTooltip text="Maximaler Korndurchmesser der Gesteinskörnung." />
                  </div>
                  <select 
                    id="groesstkorn-select"
                    aria-label="Größtkorn (Dmax)"
                    value={groesstkorn} 
                    onChange={handleGroesstkornChange}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
                  >
                    <option value={8}>8 mm</option>
                    <option value={16}>16 mm</option>
                    <option value={32}>32 mm</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="kornart-select" className="block text-sm font-medium text-text-main mb-1">Kornform</label>
                    <InfoTooltip text="Form der Gesteinskörner." />
                  </div>
                  <select 
                    id="kornart-select"
                    aria-label="Kornform"
                    value={kornArt} 
                    onChange={(e) => setKornArt(e.target.value as 'rund' | 'gebrochen')}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
                  >
                    <option value="rund">Rundkorn (Kies)</option>
                    <option value="gebrochen">Gebrochen (Splitt)</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="sandfraktion-select" className="block text-sm font-medium text-text-main mb-1">Sandfraktion</label>
                    <InfoTooltip text="Anteil der feinen Gesteinskörnung." />
                  </div>
                  <select 
                    id="sandfraktion-select"
                    aria-label="Sandfraktion"
                    value={sandFraktion} 
                    onChange={(e) => setSandFraktion(e.target.value as '0/4' | '0/2')}
                    className="w-full p-2 border border-home-grau/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-middle-blue/50"
                  >
                    <option value="0/4">0/4 und 4/8</option>
                    <option value="0/2">0/2 und 2/8</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Slider label="Rohdichte Gestein" info="Normalbeton: ~2,65 kg/dm3. Leichtbeton: < 2,0 kg/dm3" min={0.5} max={3.0} step={0.05} value={rhoGestein} unit="kg/dm3" onChange={(e) => setRhoGestein(Number(e.target.value))} />
                <Slider label={`Feinanteil im Sand (${sandFraktion})`} info="Sogenanntes 'Mehlkorn' (Korngröße ≤ 0,125 mm) aus der Gesteinskörnung. Erlaubte Mehlkorngehalte im Beton sind durch DIN 1045-2 begrenzt." min={0} max={15} step={0.5} value={feinanteilSand} unit="M.-%" onChange={(e) => setFeinanteilSand(Number(e.target.value))} />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                  <Slider label={`Fraktion ${sandFraktion === '0/4' ? '0/4' : '0/2'}`} info="Gewichtsanteil des Sands an der Gesamtmischung der Gesteinskörnung." min={0} max={100} step={1} value={f04} unit="M.-%" onChange={(e) => setF04(Number(e.target.value))} />
                  <div className="mt-3 pt-3 border-t border-home-grau/10">
                    <Slider label="Gesamtfeuchte" info="Gesamter Wassergehalt der Gesteinskörnung." min={0} max={30} step={0.1} value={feuchte04} unit="M.-%" onChange={(e) => setFeuchte04(Number(e.target.value))} />
                    <div className="mt-2"><Slider label="Kernfeuchte (WA)" info="Durch Absorption im Korninneren physikalisch gebundenes Wasser." min={0} max={30} step={0.1} value={wa04} unit="M.-%" onChange={(e) => setWa04(Number(e.target.value))} /></div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                  <Slider info="Gewichtsanteil der feinen Kiesfraktion an der Gesamtmischung der Gesteinskörnung." label={`Fraktion ${sandFraktion === '0/4' ? '4/8' : '2/8'}`} min={0} max={100} step={1} value={f48} unit="M.-%" onChange={(e) => setF48(Number(e.target.value))} />
                  <div className="mt-3 pt-3 border-t border-home-grau/10">
                    <Slider label="Gesamtfeuchte" info="Gesamter Wassergehalt der Kiesfraktion." min={0} max={30} step={0.1} value={feuchte48} unit="M.-%" onChange={(e) => setFeuchte48(Number(e.target.value))} />
                    <div className="mt-2"><Slider label="Kernfeuchte (WA)" info="Wasseraufnahme (WA24). Bei negativer Oberflächenfeuchte (trockenes Korn) erhöht sich das Zugabewasser." min={0} max={30} step={0.1} value={wa48} unit="M.-%" onChange={(e) => setWa48(Number(e.target.value))} /></div>
                  </div>
                </div>
                {groesstkorn >= 16 && (
                  <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                    <Slider label="Fraktion 8/16" info="Gewichtsanteil der groben Kiesfraktion (8 bis 16 mm) an der Gesteinskörnung." min={0} max={100} step={1} value={f816} unit="M.-%" onChange={(e) => setF816(Number(e.target.value))} />
                    <div className="mt-3 pt-3 border-t border-home-grau/10">
                      <Slider label="Gesamtfeuchte" info="Gesamter Wassergehalt der Gesteinskörnung." min={0} max={30} step={0.1} value={feuchte816} unit="M.-%" onChange={(e) => setFeuchte816(Number(e.target.value))} />
                      <div className="mt-2"><Slider label="Kernfeuchte (WA)" info="Durch Absorption im Korninneren physikalisch gebundenes Wasser der Fraktion 8/16." min={0} max={30} step={0.1} value={wa816} unit="M.-%" onChange={(e) => setWa816(Number(e.target.value))} /></div>
                    </div>
                  </div>
                )}
                {groesstkorn >= 32 && (
                  <div className="bg-white p-3 rounded-lg border border-home-grau/30">
                    <Slider label="Fraktion 16/32" info="Gewichtsanteil der sehr groben Kiesfraktion (16 bis 32 mm) an der Gesteinskörnung." min={0} max={100} step={1} value={f1632} unit="M.-%" onChange={(e) => setF1632(Number(e.target.value))} />
                    <div className="mt-3 pt-3 border-t border-home-grau/10">
                      <Slider label="Gesamtfeuchte" info="Gesamter Wassergehalt der Fraktion 16/32." min={0} max={30} step={0.1} value={feuchte1632} unit="M.-%" onChange={(e) => setFeuchte1632(Number(e.target.value))} />
                      <div className="mt-2"><Slider label="Kernfeuchte (WA)" info="Wasseraufnahme (WA24) der Fraktion 16/32. Bei negativer Oberflächenfeuchte erhöht sich das Zugabewasser." min={0} max={30} step={0.1} value={wa1632} unit="M.-%" onChange={(e) => setWa1632(Number(e.target.value))} /></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-shiraz text-white p-6 rounded-xl shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90"><FormulaText text="Ergebnisse (pro m³ Beton)" /></h3>
              
              {/* Prüfungen */}
              {expClasses.length > 0 && (
                <div className="mb-6 space-y-2">
                  <div className={`p-3 rounded flex items-center gap-3 ${results.isWzOk ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                    {results.isWzOk ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                    <div>
                      <div className="font-bold text-sm">w/z-Wert Prüfung</div>
                      <div className="text-xs opacity-80">Ist: {formatDeZahl(results.wzEq, 2)} | Max: {formatDeZahl(results.reqMaxWz, 2)}</div>
                    </div>
                  </div>
                  <div className={`p-3 rounded flex items-center gap-3 ${results.isZOk ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                    {results.isZOk ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                    <div>
                      <div className="font-bold text-sm">Zementgehalt Prüfung</div>
                      <div className="text-xs opacity-80">Ist: {formatDeWert(zement)} kg | Min: {formatDeWert(results.reqMinZ)} kg</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mehlkornprüfung nur anzeigen, wenn XF oder XM gewählt ist */}
              {results.hasXFoderXM && (
                <div className="mb-6 space-y-2">
                  <div className={`p-3 rounded flex items-center gap-3 border ${results.isMehlkornOk ? 'bg-white/10 text-white border-white/20' : 'bg-rose-500/20 text-rose-100 border-rose-400/40'}`}>
                    {results.isMehlkornOk ? (
                      <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle size={20} className="text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-sm">Mehlkorngehalt Prüfung (≤ 0,125 mm)</div>
                      <div className="text-xs opacity-90">
                        Ist: {formatDeZahl(results.mehlkornGesamt, 0)} kg/m³ | Zulässig: {results.maxMehlkornText}
                        {!results.isMehlkornOk && ' (Grenzwert überschritten!)'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <div className="text-white/70 text-sm">Zugabewasser</div>
                  <div className="text-2xl font-bold">{formatDeZahl(results.zugabewasser, 1)} Liter</div>
                  <div className="text-xs text-white/50 mt-1">({formatDeZahl(results.wasserAusGestein, 1)} L aus Gestein{biochar > 0 ? `, ${formatDeZahl(results.wasserAusBiochar, 1)} L aus Biochar` : ''})</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm">Leimvolumen</div>
                  <div className="text-2xl font-bold"><FormulaText text={`${formatDeTeX(results.volLeim, 1)} \\text{ dm}^3`} /></div>
                </div>
                <div>
                  <div className="text-white/70 text-sm flex items-center gap-1">
                    w/z-Wert
                  </div>
                  <div className="text-2xl font-bold">{formatDeZahl(results.wz, 2)}</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm flex items-center gap-1">
                    Äquivalenter (w/z)eq
                  </div>
                  <div className="text-2xl font-bold">{formatDeZahl(results.wzEq, 2)}</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm flex items-center gap-1">
                    w/b-Wert
                    <InfoTooltip text="Wasser-Bindemittel-Wert (reines Massenverhältnis ohne k-Faktoren)" />
                  </div>
                  <div className="text-2xl font-bold">{formatDeZahl(results.wbWert, 2)}</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm flex items-center gap-1">
                    Frischbetonrohdichte
                  </div>
                  <div className="text-2xl font-bold"><FormulaText text={`${formatDeTeX((results.frischbetonRohdichte * 1000), 0)} \\text{ kg/m}^3`} /></div>
                </div>
                <div>
                  <div className="text-white/70 text-sm flex items-center gap-1">
                    Luftporenvolumen (LP)
                    <InfoTooltip text="Künstlich eingetragenes oder verbleibendes Luftporenvolumen im Beton." />
                  </div>
                  <div className="text-2xl font-bold">{formatDeZahl(results.volLuft, 1)} dm³</div>
                  <div className="text-xs text-white/50 mt-1">({formatDeZahl(luft, 1)} Vol.-% der Mischung)</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm flex items-center gap-1">
                    Gesteinsvolumen
                    <InfoTooltip text="Das rechnerische Restvolumen für die Gesteinskörnung." />
                  </div>
                  <div className="text-2xl font-bold"><FormulaText text={`${formatDeTeX(results.volGestein, 1)} \\text{ dm}^3`} /></div>
                  <div className="text-xs text-white/50 mt-1">({formatDeZahl((results.volGestein / 10), 1)} Vol.-% der Mischung)</div>
                </div>
              </div>

              {/* Detaillierte Live-Rechnung (Stoffraumrechnung) */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90 text-yellow-300">Live-Stoffraumrechnung (Volumenbilanz):</h4>
                <div className="bg-white/10 p-3 rounded-lg text-xs font-mono space-y-2 text-white">
                  <div className="flex justify-between items-center text-white/90 border-b border-white/10 pb-1.5 font-bold">
                    <span>1000 dm³ = V_Gestein + V_Zement + V_Wasser + V_Stoffe + V_ZM + V_Luft + V_Fasern</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>V_Zement:</span> <span>{formatDeZahl(results.volZement, 1)} dm³</span>
                    </div>
                    <div className="flex justify-between">
                      <span>V_Wasser (trocken):</span> <span>{formatDeZahl((results.wasserTrocken / 1.0), 1)} dm³</span>
                    </div>
                    {(results.volFa + results.volSf + results.volKsm + results.volBiochar) > 0 && (
                      <div className="flex justify-between">
                        <span>V_Zusatzstoffe:</span> <span>{formatDeZahl((results.volFa + results.volSf + results.volKsm + results.volBiochar), 1)} dm³</span>
                      </div>
                    )}
                    {results.volZM > 0 && (
                      <div className="flex justify-between">
                        <span>V_Zusatzmittel:</span> <span>{formatDeZahl(results.volZM, 1)} dm³</span>
                      </div>
                    )}
                    {results.volFasernGesamt > 0 && (
                      <div className="flex justify-between text-yellow-200 font-semibold">
                        <span>V_Fasern (SF: {formatDeZahl(results.volStahlfaser, 2)} dm³, PP: {formatDeZahl(results.volPpFaser, 2)} dm³):</span> <span>{formatDeZahl(results.volFasernGesamt, 2)} dm³</span>
                      </div>
                    )}
                    <div className="flex justify-between text-yellow-300 font-semibold border-b border-white/10 pb-1">
                      <span>V_Luftporen (Luftgehalt):</span> <span>{formatDeZahl(results.volLuft, 1)} dm³ ({formatDeZahl(luft, 1)} Vol.-%)</span>
                    </div>
                    <div className="flex justify-between pt-1 font-bold text-green-300">
                      <span>Restvolumen V_Gestein:</span> <span>{formatDeZahl(results.volGestein, 1)} dm³</span>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-white/75 mt-2 leading-normal">
                  Berechnungsformel: <span className="italic font-serif">V_Gestein = 1000 - (V_Zement + V_Wasser + V_Zusatzstoffe + V_Zusatzmittel + V_Luft + V_Fasern)</span>
                </div>
              </div>
            </div>

            {/* CO2 Box */}
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-green-800"><FormulaText text="CO_2-Fußabdruck (GWP)" /></h3>
              <div className="text-3xl font-bold text-green-700"><FormulaText text={`${formatDeTeX(results.co2Gesamt, 0)} \\text{ kg CO}_2\\text{-Äq.}`} /></div>
              <div className="text-sm text-green-600 mb-4"><FormulaText text="pro m³ Beton" /></div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-green-800/80">
                <div className="flex justify-between border-b border-green-200/50 pb-1">
                  <span>Zement ({zementArt}):</span> <span className="font-medium">{formatDeZahl(results.co2Zement, 1)} kg</span>
                </div>
                <div className="flex justify-between border-b border-green-200/50 pb-1">
                  <span>Gestein:</span> <span className="font-medium">{formatDeZahl(results.co2Gestein, 1)} kg</span>
                </div>
                {(fa > 0 || sf > 0 || hues > 0 || biochar > 0) && (
                  <div className="flex justify-between border-b border-green-200/50 pb-1">
                    <span>Zusatzstoffe:</span> <span className="font-medium">{formatDeZahl((results.co2Fa + results.co2Sf + results.co2Ksm + results.co2Biochar), 1)} kg</span>
                  </div>
                )}
                {results.co2FasernGesamt > 0 && (
                  <div className="flex justify-between border-b border-green-200/50 pb-1">
                    <span>Fasern (SF/PP):</span> <span className="font-medium">{formatDeZahl(results.co2FasernGesamt, 1)} kg</span>
                  </div>
                )}
                {zusatzmittel > 0 && (
                  <div className="flex justify-between border-b border-green-200/50 pb-1">
                    <span>Zusatzmittel:</span> <span className="font-medium">{formatDeZahl(results.co2ZM, 1)} kg</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-green-200/50 pb-1">
                  <span>Wasser:</span> <span className="font-medium">{formatDeZahl(results.co2Wasser, 1)} kg</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main"><FormulaText text="Volumenanteile (\text{dm}^3/\text{m}^3)" /></h3>
              <div className="h-[250px] mb-6">
                <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
              </div>
              
              {/* Schematische Darstellung des 1m³ Würfels */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-text-main mb-2">Schematischer 1m³ Block</h4>
                <div className="w-full h-16 rounded-lg overflow-hidden flex border border-home-grau/30">
                  <div 
                    style={{ width: `${(results.volGestein / 1000) * 100}%` }} 
                    className="bg-stone-400 flex items-center justify-center text-xs text-white font-medium"
                    title={`Gestein: ${formatDeZahl(results.volGestein, 1)} dm³`}
                  >
                    {results.volGestein > 100 && 'Gestein'}
                  </div>
                  <div 
                    style={{ width: `${((results.volZement + results.volFa + results.volSf + results.volKsm + results.volBiochar) / 1000) * 100}%` }} 
                    className="bg-slate-400 flex items-center justify-center text-xs text-white font-medium"
                    title={`Bindemittel: ${formatDeZahl((results.volZement + results.volFa + results.volSf + results.volKsm + results.volBiochar), 1)} dm³`}
                  >
                    {(results.volZement + results.volFa + results.volSf + results.volKsm + results.volBiochar) > 100 && 'Bindemittel'}
                  </div>
                  <div 
                    style={{ width: `${(results.wasserTrocken / 1000) * 100}%` }} 
                    className="bg-blue-400 flex items-center justify-center text-xs text-white font-medium"
                    title={`Wasser: ${formatDeZahl(results.wasserTrocken, 1)} dm³`}
                  >
                    {results.wasserTrocken > 50 && 'Wasser'}
                  </div>
                  {results.volFasernGesamt > 0 && (
                    <div 
                      style={{ width: `${(results.volFasernGesamt / 1000) * 100}%` }} 
                      className="bg-shiraz flex items-center justify-center text-[10px] text-white font-bold"
                      title={`Fasern (Stahl/PP): ${formatDeZahl(results.volFasernGesamt, 2)} dm³`}
                    >
                      {results.volFasernGesamt > 3 && 'Fasern'}
                    </div>
                  )}
                  <div 
                    style={{ width: `${(results.volLuft / 1000) * 100}%` }} 
                    className="bg-sky-200 flex items-center justify-center text-xs text-sky-800 font-medium"
                    title={`Luft: ${formatDeZahl(results.volLuft, 1)} dm³`}
                  >
                    {results.volLuft > 30 && 'Luft'}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-text-main/60 mt-1">
                  <span>0 dm³</span>
                  <span>1000 dm³</span>
                </div>
              </div>
            </div>

            {/* Sieblinien Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
              <h3 className="font-semibold mb-4 text-text-main flex items-center gap-2">
                Sieblinie (Dmax = {dmax} mm)
                <InfoTooltip text="Vergleich der aktuellen Gesteinszusammensetzung mit den Regelsieblinien A, B und C nach DIN 1045-2." />
              </h3>
              <div className="h-[300px]">
                <Line 
                  data={lineChartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      y: { min: 0, max: 100, title: { display: true, text: 'Siebdurchgang in M.-%' } },
                      x: { 
                        type: 'logarithmic', 
                        title: { display: true, text: 'Siebweite in mm' },
                        min: 0.125,
                        max: dmax,
                        ticks: {
                          callback: function(value) {
                            if (value === 0.125) return '0';
                            return value;
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
            
            {/* Detail-Tabelle Rezeptur */}
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 overflow-x-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <h3 className="font-semibold text-text-main"><FormulaText text="Betonrezeptur" /></h3>
                <div className="flex items-center gap-2 max-w-[250px]">
                  <label htmlFor="beton-menge-liter" className="text-sm font-medium text-text-main shrink-0">Für Menge (Liter):</label>
                  <input 
                    id="beton-menge-liter"
                    aria-label="Für Menge in Litern"
                    type="number" 
                    value={betonMengeL} 
                    onChange={(e) => setBetonMengeL(Math.max(1, Number(e.target.value)))} 
                    className="w-24 p-1.5 text-sm border border-home-grau/30 rounded bg-white focus:outline-none focus:ring-1 focus:ring-middle-blue/50 text-right" 
                    min="1"
                  />
                </div>
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-home-grau/30 align-bottom">
                    <th className="pb-2 font-semibold">Komponente</th>
                    <th className="pb-2 font-semibold text-right">Masse trocken <br/><span className="text-xs font-normal opacity-70">pro m³ (kg)</span></th>
                    <th className="pb-2 font-semibold text-right">Feuchte <br/><span className="text-xs font-normal opacity-70">(%)</span></th>
                    <th className="pb-2 font-semibold text-right">Einwaage feucht <br/><span className="text-xs font-normal opacity-70">pro m³ (kg/L)</span></th>
                    <th className="pb-2 font-semibold text-right text-shiraz bg-off-white px-2 rounded-t-md">Einwaage feucht <br/><span className="text-xs font-normal opacity-70">für {formatDeWert(betonMengeL)} L (kg/L)</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/10">
                  <tr>
                    <td className="py-2">Zement ({zementArt} {zementFestigkeit})</td>
                    <td className="py-2 text-right">{formatDeZahl(zement, 1)}</td>
                    <td className="py-2 text-right">-</td>
                    <td className="py-2 text-right font-bold">{formatDeZahl(zement, 1)} kg</td>
                    <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((zement * betonMengeL / 1000), 2)} kg</td>
                  </tr>
                  {fa > 0 && (
                    <tr>
                      <td className="py-2">Flugasche</td>
                      <td className="py-2 text-right">{formatDeZahl(fa, 1)}</td>
                      <td className="py-2 text-right">-</td>
                      <td className="py-2 text-right font-bold">{formatDeZahl(fa, 1)} kg</td>
                      <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((fa * betonMengeL / 1000), 2)} kg</td>
                    </tr>
                  )}
                  {sf > 0 && (
                    <tr>
                      <td className="py-2">Silikastaub</td>
                      <td className="py-2 text-right">{formatDeZahl(sf, 1)}</td>
                      <td className="py-2 text-right">-</td>
                      <td className="py-2 text-right font-bold">{formatDeZahl(sf, 1)} kg</td>
                      <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((sf * betonMengeL / 1000), 2)} kg</td>
                    </tr>
                  )}
                  {hues > 0 && (
                    <tr>
                      <td className="py-2">Hüttensandmehl</td>
                      <td className="py-2 text-right">{formatDeZahl(hues, 1)}</td>
                      <td className="py-2 text-right">-</td>
                      <td className="py-2 text-right font-bold">{formatDeZahl(hues, 1)} kg</td>
                      <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((hues * betonMengeL / 1000), 2)} kg</td>
                    </tr>
                  )}
                  {biochar > 0 && (
                    <tr>
                      <td className="py-2">Pflanzenkohle (Biochar)</td>
                      <td className="py-2 text-right">{formatDeZahl(biochar, 1)}</td>
                      <td className="py-2 text-right">{formatDeZahl(feuchteBiochar, 1)}</td>
                      <td className="py-2 text-right font-bold">{formatDeZahl(results.biochar_feucht, 1)} kg</td>
                      <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((results.biochar_feucht * betonMengeL / 1000), 2)} kg</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2">Gestein 0/4</td>
                    <td className="py-2 text-right">{formatDeZahl(results.m04_tr, 1)}</td>
                    <td className="py-2 text-right">{formatDeZahl(feuchte04, 1)}</td>
                    <td className="py-2 text-right font-bold">{formatDeZahl(results.m04_feucht, 1)} kg</td>
                    <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((results.m04_feucht * betonMengeL / 1000), 2)} kg</td>
                  </tr>
                  <tr>
                    <td className="py-2">Gestein 4/8</td>
                    <td className="py-2 text-right">{formatDeZahl(results.m48_tr, 1)}</td>
                    <td className="py-2 text-right">{formatDeZahl(feuchte48, 1)}</td>
                    <td className="py-2 text-right font-bold">{formatDeZahl(results.m48_feucht, 1)} kg</td>
                    <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((results.m48_feucht * betonMengeL / 1000), 2)} kg</td>
                  </tr>
                  {dmax >= 16 && (
                    <tr>
                      <td className="py-2">Gestein 8/16</td>
                      <td className="py-2 text-right">{formatDeZahl(results.m816_tr, 1)}</td>
                      <td className="py-2 text-right">{formatDeZahl(feuchte816, 1)}</td>
                      <td className="py-2 text-right font-bold">{formatDeZahl(results.m816_feucht, 1)} kg</td>
                      <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((results.m816_feucht * betonMengeL / 1000), 2)} kg</td>
                    </tr>
                  )}
                  {dmax >= 32 && (
                    <tr>
                      <td className="py-2">Gestein 16/32</td>
                      <td className="py-2 text-right">{formatDeZahl(results.m1632_tr, 1)}</td>
                      <td className="py-2 text-right">{formatDeZahl(feuchte1632, 1)}</td>
                      <td className="py-2 text-right font-bold">{formatDeZahl(results.m1632_feucht, 1)} kg</td>
                      <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((results.m1632_feucht * betonMengeL / 1000), 2)} kg</td>
                    </tr>
                  )}
                  {zusatzmittel > 0 && (
                    <tr>
                      <td className="py-2">Zusatzmittel</td>
                      <td className="py-2 text-right">{formatDeZahl(zusatzmittel, 1)}</td>
                      <td className="py-2 text-right">-</td>
                      <td className="py-2 text-right font-bold">{formatDeZahl(zusatzmittel, 1)} kg</td>
                      <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((zusatzmittel * betonMengeL / 1000), 2)} kg</td>
                    </tr>
                  )}
                  {stahlfaser > 0 && (
                    <tr>
                      <td className="py-2">Stahlfasern / Metallfasern (DIN EN 14889-1)</td>
                      <td className="py-2 text-right">{formatDeZahl(stahlfaser, 1)}</td>
                      <td className="py-2 text-right">-</td>
                      <td className="py-2 text-right font-bold">{formatDeZahl(stahlfaser, 1)} kg</td>
                      <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((stahlfaser * betonMengeL / 1000), 2)} kg</td>
                    </tr>
                  )}
                  {ppFaser > 0 && (
                    <tr>
                      <td className="py-2">Polypropylenfasern (PP) (DIN EN 14889-2)</td>
                      <td className="py-2 text-right">{formatDeZahl(ppFaser, 2)}</td>
                      <td className="py-2 text-right">-</td>
                      <td className="py-2 text-right font-bold">{formatDeZahl(ppFaser, 2)} kg</td>
                      <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((ppFaser * betonMengeL / 1000), 3)} kg</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 flex items-center gap-1">
                      <span>Luftporen (Luftgehalt)</span>
                      <InfoTooltip text="Luftporen nehmen Raum im Stoffraumgefüge ein, weisen jedoch kein nennenswertes hydrostatisches Gewicht auf." />
                    </td>
                    <td className="py-2 text-right text-slate-400">0,0 <span className="text-[10px] text-slate-400">(Vol: {formatDeZahl(results.volLuft, 1)} dm³)</span></td>
                    <td className="py-2 text-right">-</td>
                    <td className="py-2 text-right font-bold text-slate-600">{formatDeZahl(luft, 1)} Vol.-%</td>
                    <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((results.volLuft * betonMengeL / 1000), 2)} L <span className="text-[10px] font-normal text-shiraz/70">(Vol.)</span></td>
                  </tr>
                  <tr className="bg-home-grau/5">
                    <td className="py-2">Gesamtwasser</td>
                    <td className="py-2 text-right">{formatDeZahl(results.wasserTrocken, 1)}</td>
                    <td className="py-2 text-right">-</td>
                    <td className="py-2 text-right text-home-grau">davon aus Gestein: {formatDeZahl(results.wasserAusGestein, 1)} L</td>
                    <td className="py-2 text-right text-shiraz/70 bg-off-white px-2">daraus: {formatDeZahl((results.wasserAusGestein * betonMengeL / 1000), 2)} L</td>
                  </tr>
                  <tr className="border-t-2 border-home-grau/30 font-bold text-shiraz">
                    <td className="py-2">Zugabewasser</td>
                    <td className="py-2 text-right">-</td>
                    <td className="py-2 text-right">-</td>
                    <td className="py-2 text-right">{formatDeZahl(results.zugabewasser, 1)} Liter</td>
                    <td className="py-2 text-right bg-shiraz/10 px-2 rounded-b-md">{formatDeZahl((results.zugabewasser * betonMengeL / 1000), 2)} Liter</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
      )}

      {activeTab === 'packungsdichte' && (
        <Packungsdichte />
      )}
      {activeTab === 'anleitung' && (
        <MischungsberechnungAnleitung />
      )}
    
      <CalculatorDisclaimerBanner className="my-2" />
      <ModuleFooter 
        weblinks={[
          { title: "Beton.wiki: Mischungsberechnung", url: "https://beton.wiki/index.php?title=Mischungsberechnung" }, 
          { title: "Zement-Merkblatt B12: Entwurf und Herstellung von Beton", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }, 
          { title: "Beton.wiki: Mischungsentwurf", url: "https://beton.wiki/index.php?title=Mischungsentwurf" }, 
          { title: "Zement-Merkblätter Übersicht", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }
        ]} 
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Stoffraumrechnung' }
        ]}
        literatur={[
          'Grübl, P.; Weigler, H.; Karl, S. (2001): Beton - Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
          'Verein Deutscher Zementwerke (VDZ): Zement-Taschenbuch (52. Auflage, Verlag Bau+Technik)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Tragwerke aus Beton: Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN EN 14889-1:2006-11 (Stahlfasern) & DIN EN 14889-2:2006-11 (Polymerfasern für Beton)' },
          { title: 'DAfStb-Richtlinie: Stahlfaserbeton:2021-06', url: 'https://www.dafstb.de/' },
          { title: 'DIN EN 197-1:2014-07 & DIN EN 197-5:2021-05 (Zement)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197' },
          { title: 'DIN EN 12620:2008-07 (Gesteinskörnungen für Beton)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12620' },
          { title: 'DAfStb-Richtlinie: Massige Bauteile aus Beton:2010-04', url: 'https://www.dafstb.de/' }
        ]}
        formeln={[
          {
            formel: 'V_{ges} = \\frac{z}{\\rho_z} + \\frac{w_{eff}}{\\rho_w} + \\frac{g}{\\rho_g} + \\frac{f}{\\rho_f} + \\frac{zm}{\\rho_{zm}} + \\frac{m_{\\text{faser}}}{\\rho_{\\text{faser}}} + v_l = 1000\\,\\text{dm}^3',
            erklaerung: 'Stoffraumgleichung für 1 m³ Beton nach DIN EN 206:2021-06 / DIN 1045-2:2023-08: Summe der Feststoffvolumina (Zement z, Gestein g, Zusatzstoff f, Zusatzmittel zm, Fasern) sowie wirksamem Wasser weff und Eigenluftgehalt vl.',
            quelle: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 / DIN EN 14889:2006-11'
          },
          {
            formel: 'w/z_{eq} = \\frac{w_{eff}}{z + k \\cdot f}',
            erklaerung: 'Äquivalenter Wasserzementwert (w/z)eq unter Anrechnung von Zusatzstoffen (z.B. Flugasche mit k = 0,4 oder Silikastaub mit k = 1,0 nach DIN 1045-2:2023-08; der Wert k = 2,0 ist eine EC-Empfehlung und in DE nicht zulässig).',
            quelle: 'DIN 1045-2:2023-08 / DIN EN 206:2021-06'
          },
          {
            formel: 'w_{zugabe} = w_{eff} - \\sum \\left( g_i \\cdot \\frac{h_i}{100} \\right)',
            erklaerung: 'Tatsächlich beizumischendes Zugabewasser unter Abzug der in der feuchten Gesteinskörnung bereits enthaltenen Eigenfeuchte hi [%].',
            quelle: 'DIN 1045-2:2023-08 / DBV-Merkblatt Beton'
          }
        ]}
      />
    </div>
  );
} 