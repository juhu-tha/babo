import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { Leaf, Award, ShieldCheck, Factory, Flame, Star, Percent, BookOpen } from 'lucide-react';

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
    (umweltScore * 0.35) +
    (sozialesScore * 0.15) +
    (oekonomieScore * 0.10) +
    (supplyChainScore * 0.30)
  );

  // Lehrannahme: Gewichtung und Schwellen vereinfacht – nicht aus dem CSC Technical Manual übernommen
  let achievedLevel = 'Keine Zertifizierung';
  let levelColor = 'bg-stone-100 text-stone-500 border-stone-200';
  let badgeColor = 'bg-stone-300';

  if (weightedScore >= 80 && supplyChainScore >= 60) {
    achievedLevel = 'Platin (Exzellente Nachhaltigkeit)';
    levelColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    badgeColor = 'bg-emerald-500';
  } else if (weightedScore >= 60 && supplyChainScore >= 50) {
    achievedLevel = 'Gold (Hohe Nachhaltigkeit)';
    levelColor = 'bg-amber-50 text-amber-800 border-amber-300';
    badgeColor = 'bg-amber-500';
  } else if (weightedScore >= 50 && supplyChainScore >= 40) {
    achievedLevel = 'Silber (Gute Nachhaltigkeit)';
    levelColor = 'bg-slate-100 text-slate-800 border-slate-300';
    badgeColor = 'bg-slate-400';
  } else if (weightedScore >= 35) {
    achievedLevel = 'Bronze (Basis-Nachhaltigkeit)';
    levelColor = 'bg-amber-100/50 text-amber-700 border-amber-200';
    badgeColor = 'bg-amber-600';
  }

  return (
    <div className="flex flex-col gap-8 font-normal">
      
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
          <Leaf className="text-shiraz" /> CSC-Zertifizierung (Concrete Sustainability Council)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed mb-6">
          <p className="mb-3">
            Das <strong>Concrete Sustainability Council (CSC)</strong> hat ein internationales Zertifizierungssystem für Beton, Zement und Gesteinskörnungen etabliert. Es bewertet die Dimensionen der CSR (Corporate Social Responsibility) entlang der gesamten Wertschöpfungskette.
          </p>
          <p>
            In modernen Ausschreibungen ist die CSC-Zertifizierung oft der Schlüssel, um Nachweise in Gebäudezertifizierungen (z. B. <strong>DGNB, BREEAM</strong>) zu erbringen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-stone-50 p-5 rounded-xl border border-home-grau/25">
            <h3 className="font-bold text-shiraz mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Factory className="w-4 h-4 text-stone-600" /> Systemgrenzen: Wer wird zertifiziert?
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-text-main/80 leading-normal">
              <li><strong>Transportbetonwerke:</strong> Herstellung des Endprodukts nahe am Einsatzort.</li>
              <li><strong>Zementwerke / Bindemittelwerke:</strong> Wichtig wegen der hohen CO₂-Emissionen beim Klinkerbrand.</li>
              <li><strong>Gesteinskörnungen (Aggregates):</strong> Kies-, Sand- und Gesteinschotterwerke bezüglich lokaler Biodiversität und Abbaurichtlinien.</li>
              <li><strong>Wichtig:</strong> Zertifiziert wird immer die <strong>Produktionsstätte</strong> als Ganzes, nicht das singuläre Bauteil selbst.</li>
            </ul>
          </section>

          <section className="bg-stone-50 p-5 rounded-xl border border-home-grau/25">
            <h3 className="font-bold text-shiraz mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-stone-600" /> Die Fünf Bewertungskategorien
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-text-main/80 leading-normal">
              <li><strong>Management (Gewichtung 10 % – Lehrannahme):</strong> Qualitätsmanagementsysteme, Compliance-Sicherheit, Ethikrichtlinie gegen Bestechung.</li>
              <li><strong>Umwelt (Gewichtung 35 % – Lehrannahme):</strong> CO₂-Minderungsziele, gezieltes Energie- und Wasserkreislauf-Management, Renaturierung von Abbauflächen.</li>
              <li><strong>Soziales (Gewichtung 15 % – Lehrannahme):</strong> Arbeitssicherheit (z. B. ISO 45001), fairer Lohn, aktive Einbindung der Nachbarschaft am Produktionsstandort.</li>
              <li><strong>Ökonomie (Gewichtung 10 % – Lehrannahme):</strong> Korruptionsprävention, regionales Wirtschaften, finanzielle Zukunftssicherung.</li>
              <li><strong>Lieferkette (Gewichtung 30 % – Lehrannahme):</strong> Zertifizierung der Klinker-, Gips- und Zuschlagslieferwerke.</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Interactive CSC Estimator & Score Calculator */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="text-xl font-bold text-text-main mb-2 flex items-center gap-2">
          <Percent className="text-shiraz w-5 h-5" /> CSC-Stufen-Rechner (Lehrmodell)
        </h3>
        <p className="text-xs text-text-main/60 mb-6 leading-relaxed">
          Nutzen Sie diese interaktive Simulation, um nachzuvollziehen, wie die CSC-Kriterien gewichtet werden und welche Anforderungen an die Lieferkette (Supply Chain) gestellt werden, um höhere Zertifikate wie Gold oder Platin zu erreichen. <strong>Gewichtung und Schwellen sind Lehrannahmen</strong>; maßgebend ist das CSC Technical Manual. Belegt sind die Stufen Bronze bis Platin und die Anteile der Credits: Betonwerk 60 %, Zementwerk 25 %, Gesteinskörnung 15 % (Baunetz Wissen).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sliders Input Segment (Left Column) */}
          <div className="lg:col-span-7 bg-stone-50 p-5 rounded-xl border border-home-grau/25 space-y-5">
            <h4 className="text-xs font-bold text-text-main uppercase tracking-wider border-b pb-2 border-home-grau/15">
              Erfüllungsgrad der einzelnen Säulen (%)
            </h4>

            {/* slider 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span>1. Management-Systeme (Gewichtung 10 % – Lehrannahme)</span>
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
                <span>2. Umwelt &amp; CO₂ (Gewichtung 35 % – Lehrannahme)</span>
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
                <span>3. Soziale Standards (Gewichtung 15 % – Lehrannahme)</span>
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
                <span>4. Regionale Ökonomie (Gewichtung 10 % – Lehrannahme)</span>
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
                <span>5. Nachhaltige Lieferkette / Sourcing (Gewichtung 30 % – Lehrannahme)</span>
                <span className="font-mono text-shiraz">{formatDeWert(supplyChainScore)}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={supplyChainScore} 
                onChange={(e) => setSupplyChainScore(Number(e.target.value))}
                className="w-full accent-shiraz cursor-pointer"
              />
              <p className="text-[10px] text-text-main/50 leading-tight">
                ⚠️ <strong>Achtung:</strong> Die Lieferketten-Säule steuert die K.O.-Kriterien. Ohne nachweislich zertifizierte Vorlieferanten (Zementwerk) kann trotz hoher Punktzahl kein Platin oder Gold erzielt werden.
              </p>
            </div>
          </div>

          {/* Results Output Badging (Right Column) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-stone-50 p-6 rounded-xl border border-home-grau/25 h-full flex flex-col justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-text-main/40 uppercase tracking-wider block">Kalkuliertes Gesamtergebnis</span>
                
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-extrabold font-mono text-shiraz">{formatDeZahl(weightedScore, 1)}%</span>
                  <span className="text-xs text-text-main/50">Gesamt-Score-Punkte</span>
                </div>

                <div className="mt-4 pt-4 border-t border-home-grau/15 space-y-2 text-xs">
                  <div className="flex justify-between text-text-main/70">
                    <span>Mindestanforderung erfüllt?</span>
                    <strong className="text-emerald-700">Ja (≥ 35%)</strong>
                  </div>
                  <div className="flex justify-between text-text-main/70">
                    <span>Zertifikat Liefertketten-Klassifizierung:</span>
                    <span className="font-mono font-bold">
                      {supplyChainScore >= 60 ? 'Stufe Platin-Freigabe' : supplyChainScore >= 50 ? 'Stufe Gold-Freigabe' : supplyChainScore >= 40 ? 'Stufe Silber-Freigabe' : 'Bronze-Freigabe'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphical Medal Output */}
              <div className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center ${levelColor}`}>
                <Award size={36} className="text-shiraz mb-2" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-main/40">Erreichtes CSC-Zertifikat</span>
                <span className="text-sm font-extrabold mt-1">{achievedLevel}</span>
              </div>

              <div className="text-[10px] text-text-main/60 bg-white p-3 rounded-lg border border-home-grau/15 leading-relaxed">
                ℹ️ <strong>Lehrannahme:</strong><br />
                • Bronze ab 35% • Silber ab 50% (Lieferkette ≥ 40%)<br />
                • Gold ab 60% (Lieferkette ≥ 50%) • Platin ab 80% (Lieferkette ≥ 60%)
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* R-Modul & CO2-Modul Sonderzertifikate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
            <Star className="text-shiraz w-5 h-5" /> CSC R-Modul (Recyclingbeton)
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-xs text-text-main/80 leading-relaxed">
            <li>Eingeführt im Juni 2020 für Beton mit rezyklierter Gesteinskörnung.</li>
            <li>Voraussetzung: RC-Gesteinskörnung <strong>ab 10 %</strong> (weitere Abstufungen manuell prüfen).</li>
            <li>DGNB: Anrechnung im Kriterium ENV1.3, Qualitätsstufe 2.2 (zertifizierte Sekundärrohstoffe), Stand 2021.</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
            <Flame className="text-shiraz w-5 h-5" /> CSC CO₂-Modul
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-xs text-text-main/80 leading-relaxed">
            <li>Vier Klassen: <strong>30 / 40 / 50 / 60 %</strong> weniger Treibhausgasemissionen (kg CO₂e je m³ Beton) gegenüber einem regionalen Referenzwert.</li>
            <li>Voraussetzungen: Werk mindestens CSC Silber, mindestens 75 % CSC-zertifizierter Zement in der Lieferkette, Monitoring der Emissionen, dokumentierte WPK.</li>
            <li>Anrechnung in QNG/KfW-Förderung: manuell prüfen.</li>
          </ul>
        </section>

      </div>

      {/* Value in Green Building systems (DGNB, LEED, BREEAM) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
          <BookOpen className="text-shiraz w-5 h-5" /> Relevanz in Gebäudezertifizierungen
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-xs text-text-main/80 leading-relaxed">
          <li><strong>DGNB:</strong> CSC Silber und Gold werden im Kriterium „Verantwortungsbewusste Ressourcengewinnung“ (ENV1.3) in Qualitätsstufe 1.2 anerkannt (Stand 2018); das R-Modul in Qualitätsstufe 2.2 (Stand 2021).</li>
          <li><strong>BREEAM:</strong> CSC ist seit 2018 als Responsible-Sourcing-System anerkannt.</li>
          <li><strong>LEED:</strong> Anerkennung war 2018 noch offen – aktuellen Stand manuell prüfen.</li>
        </ul>
      </div>

    </div>
  );
}
