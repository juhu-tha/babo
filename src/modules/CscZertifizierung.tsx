import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { Leaf, Award, ShieldCheck, Factory, Flame, Star, Percent, BookOpen } from 'lucide-react';
import inhalt from '@/content/csczertifizierung/CscZertifizierung.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function CscZertifizierung() {
  // State for Interactive CSC Estimator
  const [managementScore, setManagementScore] = useState<number>(80); // 0-100%
  const [umweltScore, setUmweltScore] = useState<number>(70); // 0-100%
  const [sozialesScore, setSozialesScore] = useState<number>(90); // 0-100%
  const [oekonomieScore, setOekonomieScore] = useState<number>(85); // 0-100%
  const [supplyChainScore, setSupplyChainScore] = useState<number>(60); // 0-100%

  // weighting of CSC Categories in Final Score
  // Management: 10%, Umwelt: 35%, Soziales: 15%, Ökonomie: 10%, Lieferkette: 30%
  const weightedScore = (
    (managementScore * 0.10) +
    (umweltScore * 0.35) + // Gewichtung Lehrannahme
    (sozialesScore * 0.15) + // Gewichtung Lehrannahme
    (oekonomieScore * 0.10) +
    (supplyChainScore * 0.30) // Gewichtung Lehrannahme
  );

  // Lehrannahme: Gewichtung und Schwellen vereinfacht – nicht aus dem CSC Technical Manual übernommen
  let achievedLevel = inhalt.werte.keineZertifizierung;
  let levelColor = 'bg-stone-100 text-stone-500 border-stone-200';
  let badgeColor = 'bg-stone-300';

  if (weightedScore >= 80 && supplyChainScore >= 60) {
    achievedLevel = inhalt.werte.platinExzellenteNachhaltigkeit;
    levelColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    badgeColor = 'bg-emerald-500';
  } else if (weightedScore >= 60 && supplyChainScore >= 50) {
    achievedLevel = inhalt.werte.goldHoheNachhaltigkeit;
    levelColor = 'bg-amber-50 text-amber-800 border-amber-300';
    badgeColor = 'bg-amber-500';
  } else if (weightedScore >= 50 && supplyChainScore >= 40) {
    achievedLevel = inhalt.werte.silberGuteNachhaltigkeit;
    levelColor = 'bg-slate-100 text-slate-800 border-slate-300';
    badgeColor = 'bg-slate-400';
  } else if (weightedScore >= 35) {
    achievedLevel = inhalt.werte.bronzeBasisNachhaltigkeit;
    levelColor = 'bg-amber-100/50 text-amber-700 border-amber-200';
    badgeColor = 'bg-amber-600';
  }

  return (
    <div className="flex flex-col gap-8 font-normal">
      
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
          <Leaf className="text-shiraz" /><MdText text={inhalt.texte.cscZertifizierungConcreteSustainability} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed mb-6">
          <p className="mb-3"><MdText text={inhalt.texte.dasConcreteSustainabilityCouncil} /></p>
          <p><MdText text={inhalt.texte.inModernenAusschreibungenIst} /></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-stone-50 p-5 rounded-xl border border-home-grau/25">
            <h3 className="font-bold text-shiraz mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Factory className="w-4 h-4 text-stone-600" /><MdText text={inhalt.texte.systemgrenzenWerWirdZertifiziert} /></h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-text-main/80 leading-normal">
              <li><MdText text={inhalt.texte.transportbetonwerkeHerstellungDesEndprod} /></li>
              <li><MdText text={inhalt.texte.zementwerkeBindemittelwerkeWichtigWegen} /></li>
              <li><MdText text={inhalt.texte.gesteinskörnungenAggregatesKiesSand} /></li>
              <li><MdText text={inhalt.texte.wichtigZertifiziertWirdImmer} /></li>
            </ul>
          </section>

          <section className="bg-stone-50 p-5 rounded-xl border border-home-grau/25">
            <h3 className="font-bold text-shiraz mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-stone-600" /><MdText text={inhalt.texte.dieFünfBewertungskategorien} /></h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-text-main/80 leading-normal">
              <li><MdText text={inhalt.texte.managementGewichtung10Lehrannahme} /></li>
              <li><MdText text={inhalt.texte.umweltGewichtung35Lehrannahme} /></li>
              <li><MdText text={inhalt.texte.sozialesGewichtung15Lehrannahme} /></li>
              <li><MdText text={inhalt.texte.ökonomieGewichtung10Lehrannahme} /></li>
              <li><MdText text={inhalt.texte.lieferketteGewichtung30Lehrannahme} /></li>
            </ul>
          </section>
        </div>
      </div>

      {/* Interactive CSC Estimator & Score Calculator */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="text-xl font-bold text-text-main mb-2 flex items-center gap-2">
          <Percent className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.cscStufenRechnerLehrmodell} /></h3>
        <p className="text-xs text-text-main/60 mb-6 leading-relaxed"><MdText text={inhalt.texte.nutzenSieDieseInteraktive} /></p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sliders Input Segment (Left Column) */}
          <div className="lg:col-span-7 bg-stone-50 p-5 rounded-xl border border-home-grau/25 space-y-5">
            <h4 className="text-xs font-bold text-text-main uppercase tracking-wider border-b pb-2 border-home-grau/15"><MdText text={inhalt.texte.erfüllungsgradDerEinzelnenSäulen} /></h4>

            {/* slider 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span><MdText text={inhalt.texte.t1ManagementSystemeGewichtung} /></span>
                <span className="font-mono text-shiraz">{formatDeWert(managementScore)}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={managementScore} 
                onChange={(e) => setManagementScore(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>

            {/* slider 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span><MdText text={inhalt.texte.t2UmweltCoGewichtung} /></span>
                <span className="font-mono text-shiraz">{formatDeWert(umweltScore)}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={umweltScore} 
                onChange={(e) => setUmweltScore(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>

            {/* slider 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span><MdText text={inhalt.texte.t3SozialeStandardsGewichtung} /></span>
                <span className="font-mono text-shiraz">{formatDeWert(sozialesScore)}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={sozialesScore} 
                onChange={(e) => setSozialesScore(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>

            {/* slider 4 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span><MdText text={inhalt.texte.t4RegionaleÖkonomieGewichtung} /></span>
                <span className="font-mono text-shiraz">{formatDeWert(oekonomieScore)}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={oekonomieScore} 
                onChange={(e) => setOekonomieScore(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
            </div>

            {/* slider 5 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span><MdText text={inhalt.texte.t5NachhaltigeLieferketteSourcing} /></span>
                <span className="font-mono text-shiraz">{formatDeWert(supplyChainScore)}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={supplyChainScore} 
                onChange={(e) => setSupplyChainScore(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
              <p className="text-[10px] text-text-main/50 leading-tight"><MdText text={inhalt.texte.achtungDieLieferkettenSäule} /></p>
            </div>
          </div>

          {/* Results Output Badging (Right Column) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-stone-50 p-6 rounded-xl border border-home-grau/25 h-full flex flex-col justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-text-main/40 uppercase tracking-wider block"><MdText text={inhalt.texte.kalkuliertesGesamtergebnis} /></span>
                
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-extrabold font-mono text-shiraz">{formatDeZahl(weightedScore, 1)}%</span>
                  <span className="text-xs text-text-main/50">Gesamt-Score-Punkte</span>
                </div>

                <div className="mt-4 pt-4 border-t border-home-grau/15 space-y-2 text-xs">
                  <div className="flex justify-between text-text-main/70">
                    <span><MdText text={inhalt.texte.mindestanforderungErfüllt} /></span>
                    <strong className="text-emerald-700">Ja (≥ 35%)</strong>
                  </div>
                  <div className="flex justify-between text-text-main/70">
                    <span><MdText text={inhalt.texte.zertifikatLiefertkettenKlassifizierung} /></span>
                    <span className="font-mono font-bold">
                      {supplyChainScore >= 60 ? inhalt.werte.stufePlatinFreigabe : supplyChainScore >= 50 ? inhalt.werte.stufeGoldFreigabe : supplyChainScore >= 40 ? inhalt.werte.stufeSilberFreigabe : 'Bronze-Freigabe'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphical Medal Output */}
              <div className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center ${levelColor}`}>
                <Award size={36} className="text-shiraz mb-2" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-main/40"><MdText text={inhalt.texte.erreichtesCscZertifikat} /></span>
                <span className="text-sm font-extrabold mt-1">{achievedLevel}</span>
              </div>

              <div className="text-[10px] text-text-main/60 bg-white p-3 rounded-lg border border-home-grau/15 leading-relaxed"><MdText text={inhalt.texte.lehrannahmeBrBronzeAb} /></div>
            </div>
          </div>

        </div>
      </div>

      {/* R-Modul & CO2-Modul Sonderzertifikate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
            <Star className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.cscRModulRecyclingbeton} /></h3>
          <ul className="list-disc pl-5 space-y-2 text-xs text-text-main/80 leading-relaxed">
            <li><MdText text={inhalt.texte.eingeführtImJuni2020} /></li>
            <li><MdText text={inhalt.texte.voraussetzungRcGesteinskörnungAb} /></li>
            <li><MdText text={inhalt.texte.dgnbAnrechnungImKriterium} /></li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
            <Flame className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.cscCoModul} /></h3>
          <ul className="list-disc pl-5 space-y-2 text-xs text-text-main/80 leading-relaxed">
            <li><MdText text={inhalt.texte.vierKlassen3040} /></li>
            <li><MdText text={inhalt.texte.voraussetzungenWerkMindestensCsc} /></li>
            <li><MdText text={inhalt.texte.anrechnungInQngKfw} /></li>
          </ul>
        </section>

      </div>

      {/* Value in Green Building systems (DGNB, LEED, BREEAM) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
          <BookOpen className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.relevanzInGebäudezertifizierungen} /></h3>
        <ul className="list-disc pl-5 space-y-2 text-xs text-text-main/80 leading-relaxed">
          <li><MdText text={inhalt.texte.dgnbCscSilberUnd} /></li>
          <li><MdText text={inhalt.texte.breeamCscIstSeit} /></li>
          <li><MdText text={inhalt.texte.leedAnerkennungWar2018} /></li>
        </ul>
      </div>

    </div>
  );
}
