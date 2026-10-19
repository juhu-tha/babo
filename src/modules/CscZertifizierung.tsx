import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Leaf, Award, ShieldCheck, Factory, HelpCircle, CheckCircle, Flame, Star, Percent, BookOpen } from 'lucide-react';

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

  // Criteria according to official CSC manuals
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
            Das <strong>Concrete Sustainability Council (CSC)</strong> hat ein weltweit führendes, renommiertes Zertifizierungssystem für Beton, Zement und Gesteinskörnungen etabliert. Es bewertet lückenlos alle Dimensionen der CSR (Corporate Social Responsibility) entlang der gesamten Wertschöpfungskette.
          </p>
          <p>
            In modernen Ausschreibungen ist die CSC-Zertifizierung oft der Schlüssel, um die strengen Auflagen des <strong>Gebäude-Ökobilanzierungstargets (z.B. DGNB, LEED, BREEAM, QNG)</strong> einzuhalten und maximale Nachhaltigkeitspunkte zu sichern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-stone-50 p-5 rounded-xl border border-home-grau/25">
            <h3 className="font-bold text-shiraz mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Factory className="w-4 h-4 text-stone-600" /> Systemgrenzen: Wer wird zertifiziert?
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-text-main/80 leading-normal">
              <li><strong>Transportbetonwerke:</strong> Das eigentliche Endproduktbett am lokalen Einsatzort.</li>
              <li><strong>Zementwerke / Bindemittelwerke:</strong> Extrem wichtig wegen des hohen thermophysikalischen CO₂-Fußabdrucks beim Klinkerbrand.</li>
              <li><strong>Gesteinskörnungen (Aggregates):</strong> Kies-, Sand- und Gesteinschotterwerke bezüglich lokaler Biodiversität und Abbaurichtlinien.</li>
              <li><strong>Wichtig:</strong> Zertifiziert wird immer die <strong>Produktionsstätte</strong> als Ganzes (inklusive Logistikradius), nicht das singuläre Bauteil selbst.</li>
            </ul>
          </section>

          <section className="bg-stone-50 p-5 rounded-xl border border-home-grau/25">
            <h3 className="font-bold text-shiraz mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-stone-600" /> Die Fünf Bewertungskategorien
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-text-main/80 leading-normal">
              <li><strong>Management (Gewichtung 10%):</strong> Qualitätsmanagementsysteme, Compliance-Sicherheit, Ethikrichtlinie gegen Bestechung.</li>
              <li><strong>Umwelt (Gewichtung 35%):</strong> CO₂-Minderungsziele, gezieltes Energie- und Wasserkreislauf-Management, Renaturierung von Abbauflächen.</li>
              <li><strong>Soziales (Gewichtung 15%):</strong> Arbeitssicherheitsvorgaben (OHSAS), fairer Lohn, aktive Einbindung der Nachbarschaft am Produktionsstandort.</li>
              <li><strong>Ökonomie (Gewichtung 10%):</strong> Korruptionsprävention, regionales Wirtschaften, finanzielle Zukunftssicherung.</li>
              <li><strong>Lieferkette (Gewichtung 30%):</strong> Zertifizierung der Klinker-, Gips- und Zuschlagslieferwerke.</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Interactive CSC Estimator & Score Calculator */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="text-xl font-bold text-text-main mb-2 flex items-center gap-2">
          <Percent className="text-shiraz w-5 h-5" /> Interaktiver CSC-Stufen-Rechner (Schätzung)
        </h3>
        <p className="text-xs text-text-main/60 mb-6 leading-relaxed">
          Nutzen Sie diese interaktive Simulation, um nachzuvollziehen, wie die CSC-Kriterien gewichtet werden und welche Anforderungen an die Lieferkette (Supply Chain) gestellt werden, um höhere Zertifikate wie Gold oder Platin zu erreichen.
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
                <span>1. Management-Systeme (Gewichtung 10%)</span>
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
                <span>2. Umwelt &amp; CO₂ (Gewichtung 35%)</span>
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
                <span>3. Soziale Standards (Gewichtung 15%)</span>
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
                <span>4. Regionale Ökonomie (Gewichtung 10%)</span>
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
                <span>5. Nachhaltige Lieferkette / Sourcing (Gewichtung 30%)</span>
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
                <Award size={36} className="text-shiraz mb-2 animate-bounce" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-main/40">Erreichtes CSC-Zertifikat</span>
                <span className="text-sm font-extrabold mt-1">{achievedLevel}</span>
              </div>

              <div className="text-[10px] text-text-main/60 bg-white p-3 rounded-lg border border-home-grau/15 leading-relaxed">
                ℹ️ <strong>System-Regeln:</strong><br />
                • Bronze ab 35% • Silber ab 50% (Lieferkette ≥ 40%)<br />
                • Gold ab 60% (Lieferkette ≥ 50%) • Platin ab 80% (Lieferkette ≥ 60%)
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* R-Modul & CO2-Modul Sonderzertifikate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
              <Star className="text-shiraz w-5 h-5" /> Das CSC R-Modul (Recycling-Label)
            </h3>
            <p className="text-xs text-text-main/75 leading-relaxed mb-4">
              Als Spezialergänzung hat das CSC ein <strong>Recycling-Modul (R-Modul)</strong> eingeführt. Es fördert 
              die Kreislaufwirtschaft im Massivbau, indem es den lückenlosen stofflichen Rückfluss von Betonschutt bewertet:
            </p>
            <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/20 text-xs space-y-2">
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold">Einteilungsstufe 1 (R1):</span>
                <span className="font-mono">Mind. 10 Masse-% RC-Gesteinskörnung</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold">Einteilungsstufe 2 (R2):</span>
                <span className="font-mono">Mind. 20 Masse-% RC-Gesteinskörnung</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold">Einteilungsstufe 3 (R3):</span>
                <span className="font-mono">Mind. 30 Masse-% RC-Gesteinskörnung</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Einteilungsstufe 4 (R4):</span>
                <span className="font-mono">Mind. 40 Masse-% RC-Gesteinskörnung</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-text-main/60 bg-off-white p-2.5 rounded-lg border mt-4">
            💡 <strong>Hinweis für Planer:</strong> Das R-Label stellt sicher, dass die RC-Körnung nachweislich qualitätsüberwacht ist und aus regionalen Aufbereitungsanlagen stammt (kurze Transportwege).
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
              <Flame className="text-shiraz w-5 h-5" /> Das CSC CO₂-Modul (CO₂-Sonderlabel)
            </h3>
            <p className="text-xs text-text-main/75 leading-relaxed mb-4">
              Zusätzlich zur normalen Werkszertifizierung bewertet das <strong>CO₂-Modul</strong> (oft durch Vergabe von CO₂-Sternen visualisiert) 
              die konkrete Reduktion der Treibhausgasemissionen bei der Beton- und Zementherstellung:
            </p>
            <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/20 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-shiraz/5 text-shiraz font-bold flex items-center justify-center text-[10px]">★</span>
                <span><strong>1 Stern:</strong> Mindestens 30% Treibhausgaseinsparung gegenüber dem länderspezifischen Referenzwert.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-shiraz/5 text-shiraz font-bold flex items-center justify-center text-[10px]">★★</span>
                <span><strong>2 Sterne:</strong> Mindestens 40% CO₂-Einsparung durch Substitution von Klinkeranteilen (z.B. CEM III oder CEM IV).</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-shiraz/5 text-shiraz font-bold flex items-center justify-center text-[10px]">★★★</span>
                <span><strong>3 Sterne:</strong> Mindestens 50% CO₂-Einsparung (Erreicht nur durch technologische High-End-Anlagen oder CCUS).</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-text-main/60 bg-off-white p-2.5 rounded-lg border mt-4">
            📝 <strong>QNG-Konformität:</strong> Die Sterne-Zertifizierung wird in Deutschland direkt für das Qualitätssiegel Nachhaltiges Gebäude (QNG) und KfW-Fördergelder herangezogen.
          </div>
        </section>

      </div>

      {/* Value in Green Building systems (DGNB, LEED, BREEAM) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
          <BookOpen className="text-shiraz w-5 h-5" /> Relevanz in Green-Building-Zertifikaten (DGNB, LEED, BREEAM)
        </h3>
        <p className="text-xs text-text-main/80 mb-5 leading-relaxed">
          Das CSC-Zertifikat ist von den führenden nationalen und internationalen Zertifizierungsorganisationen offiziell anerkannt. 
          Wenn Sie Beton aus CSC-zertifizierten Lieferketten beziehen, profitieren Sie direkt von erleichterten Nachweisführungen und zusätzlichen Bonuspunkten:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-home-grau/20 text-text-main/60">
                <th className="py-2.5 font-bold uppercase tracking-wide">System</th>
                <th className="py-2.5 font-bold uppercase tracking-wide">CSC Zertifikat Silber</th>
                <th className="py-2.5 font-bold uppercase tracking-wide">CSC Zertifikat Gold / Platin</th>
                <th className="py-2.5 font-bold uppercase tracking-wide">CSC R-Modul Option</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-home-grau/10 text-text-main/80">
              <tr>
                <td className="py-3 font-bold text-shiraz">DGNB (Deutschland)</td>
                <td className="py-3">Anerkannt im Kriterium ENV1.1 % ENV1.2 als "Qualitätsstufe 1.2" (vereinfachter Herkunftsnachweis).</td>
                <td className="py-3">Maximaler anerkannter Nachweis (Qualitätsstufe 1.3 / Premiumstufe). Führt zu Bestnoten im Ökobilanz-Score.</td>
                <td className="py-3">Direkte Extrapunkte im Kreislaufwirtschafts-Zertifikat ("Zirkuläres Bauen").</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-shiraz">LEED (International)</td>
                <td className="py-3">Zählt im Standard "MR Credit: Sourcing of Raw Materials" als akkreditiertes Nachweissystem.</td>
                <td className="py-3">Volle Punktzahl ("Exemplary Performance Option") durch lückenlose Herkunftstransparenz.</td>
                <td className="py-3">Fördert den Erhalt des Credits "MR Credit: Construction and Demolition Waste Management".</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-shiraz">BREEAM (UK / Int.)</td>
                <td className="py-3">Zertifiziert nach "Tier 3" (Responsible Sourcing), was den Baustellennachweis entlastet.</td>
                <td className="py-3">Zertifiziert nach "Tier 2" oder "Tier 1" - liefert den maximalen Multiplikationsfaktor für Materialcredits.</td>
                <td className="py-3">Anrechenbar als Beitrag zur Rückbau- und Recyclingoptimierung vor Ort.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ModuleFooter 
        weblinks={[
          { title: "CSC - Concrete Sustainability Council (Offizielle Website)", url: "https://www.concretesustainabilitycouncil.com/" },
          { title: "CSC in Deutschland (BTB)", url: "https://www.transportbeton.org/nachhaltigkeit/csc-zertifizierung" },
          { title: "DGNB Anrechenbarkeit von CSC-Zertifikaten", url: "https://www.dgnb.de/" }
        ]} 
        wikipedia={[
          { title: "Concrete Sustainability Council", url: "https://de.wikipedia.org/wiki/Concrete_Sustainability_Council" },
          { title: "Nachhaltiges Bauen", url: "https://de.wikipedia.org/wiki/Nachhaltiges_Bauen" }
        ]} 
        literatur={[
          'Concrete Sustainability Council (CSC): Technical Manual - The CSC Certification System for Concrete, Cement and Aggregates',
          'Bundesverband Transportbeton (BTB): Leitfaden Nachhaltiges Bauen mit Transportbeton',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]} 
        regelwerke={[
          { title: 'CSC Certification System Version 2.1', url: 'https://www.concretesustainabilitycouncil.com/' },
          { title: 'DIN EN 15804 (Nachhaltigkeit von Bauwerken)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15804' }
        ]} 
        formeln={[
          {
            formel: '\\text{Score}_{\\text{CSC}} = \\sum_{k=1}^4 w_k \\cdot S_k \\ge 80\\% \\implies \\text{Level: Platin}',
            erklaerung: 'Gesamtscore des CSC-Zertifizierungssystems: Gewichtete Erfüllungsgrade in den 4 Kernkategorien Management (M), Umwelt (E), Soziales (S) und Wirtschaft (Econ). Stufen: Bronze (35%), Silber (50%), Gold (65%), Platin (80%).',
            quelle: 'CSC Technical Manual'
          },
          {
            formel: 'R_{\\text{Supply Chain}} = 0{,}40 \\cdot S_{\\text{Zement}} + 0{,}15 \\cdot S_{\\text{Gestein}}',
            erklaerung: 'CSC R-Modul für rezyklierte Gesteinskörnungen und nachhaltige Lieferkettengewichtung zur DGNB-Anrechnung.',
            quelle: 'CSC / DGNB Kriterium ENV1.3'
          }
        ]} 
      />
    </div>
  );
}
