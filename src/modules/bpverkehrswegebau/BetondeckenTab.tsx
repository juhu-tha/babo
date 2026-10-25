// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Layers, Calculator, AlertTriangle, Milestone, Droplets } from 'lucide-react';

export interface BetondeckenTabProps {
  betonAchslast: number;
  betonAggregate: 'quarz' | 'kalk' | 'basalt';
  betonBettung: number;
  betonCementAlkali: 'low' | 'high';
  betonFreshAir: number;
  betonFugenAbstand: number;
  betonMaxAggregateSize: 22 | 32;
  betonShowAKRDetails: boolean;
  betonSlabThickness: number;
  setBetonAchslast: React.Dispatch<React.SetStateAction<number>>;
  setBetonAggregate: React.Dispatch<React.SetStateAction<'quarz' | 'kalk' | 'basalt'>>;
  setBetonBettung: React.Dispatch<React.SetStateAction<number>>;
  setBetonCementAlkali: React.Dispatch<React.SetStateAction<'low' | 'high'>>;
  setBetonFreshAir: React.Dispatch<React.SetStateAction<number>>;
  setBetonFugenAbstand: React.Dispatch<React.SetStateAction<number>>;
  setBetonMaxAggregateSize: React.Dispatch<React.SetStateAction<22 | 32>>;
  setBetonShowAKRDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setBetonSlabThickness: React.Dispatch<React.SetStateAction<number>>;
}

export default function BetondeckenTab({ betonAchslast, betonAggregate, betonBettung, betonCementAlkali, betonFreshAir, betonFugenAbstand, betonMaxAggregateSize, betonShowAKRDetails, betonSlabThickness, setBetonAchslast, setBetonAggregate, setBetonBettung, setBetonCementAlkali, setBetonFreshAir, setBetonFugenAbstand, setBetonMaxAggregateSize, setBetonShowAKRDetails, setBetonSlabThickness }: BetondeckenTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Academic Briefing banner */}
      <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
        <h3 className="font-bold text-text-main text-sm uppercase tracking-wider flex items-center gap-2">
          <Layers size={16} className="text-shiraz" />
          Fahrbahndecken aus Beton nach ZTV Beton-StB &amp; RLaO
        </h3>
        <p className="text-xs text-text-main/80 leading-relaxed">
          Fahrbahndecken aus Beton (starre Befestigungen) haben eine hohe Tragfähigkeit und bilden <strong>keine Spurrinnen durch plastische Verformung</strong>. Sie erreichen oft Nutzungsdauern von <span className="font-bold">mehr als 30 Jahren</span>. 
          Die konstruktiven Kriterien für Autobahnen und Bundesstraßen sind in den <strong>Zusätzlichen Technischen Vertragsbedingungen für Fahrbahndecken aus Beton (ZTV Beton-StB)</strong> sowie in den <strong>RDO Beton</strong> (Richtlinien für die rechnerische Dimensionierung von Betondecken) verankert.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1 text-[11px]">
          <div className="bg-white p-2.5 rounded border border-zinc-200">
            <span className="font-bold text-shiraz block">Betonfestigkeit</span>
            Standardmäßig <strong>C30/37</strong> (Biegezugprüfung m_fct,sp ≥ 4,5 MPa).
          </div>
          <div className="bg-white p-2.5 rounded border border-zinc-200">
            <span className="font-bold text-shiraz block">Expositionsklassen</span>
            <strong>XF4 &amp; XM2</strong> (sehr hoher Frost-Tausalz- &amp; mechanischer Verschleiß-Widerstand).
          </div>
          <div className="bg-white p-2.5 rounded border border-zinc-200">
            <span className="font-bold text-shiraz block">Oberflächentextur</span>
            Waschbeton-Struktur (Erzeugung eines rauen Freilegens des Edelsplitts zur Lärmreduktion).
          </div>
          <div className="bg-white p-2.5 rounded border border-zinc-200">
            <span className="font-bold text-shiraz block">Wassereinfluss</span>
            Gefährdung durch <strong>Alkali-Kieselsäure-Reaktion (AKR)</strong> bei reaktivem Quarz und Tausalz.
          </div>
        </div>
      </div>

      {/* Main Interactive Screen layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interaktive Bemessung */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Panel 1: Plattendicken-Dimensionierer (Westergaard) */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-text-main flex items-center gap-1 border-b border-zinc-100 pb-2">
              <Calculator size={15} className="text-shiraz" />
              1. Plattenstärken-Prüfer (elastischer Halbraum nach Westergaard)
            </h4>
            <p className="text-[11px] text-gray-500 leading-normal">
              Berechnet die kritische Biegezugspannung am unbelasteten Plattenrand (kritischster Lastfall im Fugenkantenbereich) nach der klassischen Westergaard-Gleichung für den Plattenrand (Lehrmodell).
            </p>

            <div className="space-y-4">
              {/* Plattendicke h */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span>Deckendicke (h):</span>
                  <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(betonSlabThickness)} cm</span>
                </div>
                <input 
                  type="range" 
                  min="18" 
                  max="35" 
                  step="1"
                  value={betonSlabThickness}
                  onChange={(e) => setBetonSlabThickness(parseInt(e.target.value))}
                  className="w-full accent-shiraz" 
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Typisch Bk0.3: 18-20 cm</span>
                  <span>Autobahn Bk100: 28-30 cm/WASH-Beton</span>
                </div>
              </div>

              {/* Belastungsklasse & Achslast P */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span>Bemessungs-Achsübergang (P_achse):</span>
                  <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(betonAchslast)} kN</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="180" 
                  step="5"
                  value={betonAchslast}
                  onChange={(e) => setBetonAchslast(parseInt(e.target.value))}
                  className="w-full accent-shiraz" 
                />
                <div className="text-[10px] text-zinc-500">
                  Radlast (P_rad) = P_achse / 2 = {formatDeZahl((betonAchslast / 2), 0)} kN. Typisches Lkw-Rad für Dimensionierungen.
                </div>
              </div>

              {/* Bettungsmodul k */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span>Bettungsmodul des Unterbaus (k-Wert):</span>
                  <span className="font-mono text-xs text-shiraz font-bold">{formatDeWert(betonBettung)} MN/m³</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="150" 
                  step="5"
                  value={betonBettung}
                  onChange={(e) => setBetonBettung(parseInt(e.target.value))}
                  className="w-full accent-shiraz" 
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Erdbau (weich): 30 MN/m³</span>
                  <span>Stabile HGT/Zement: 100-120 MN/m³</span>
                </div>
              </div>

              {/* Berechnung output */}
              {(() => {
                const E_conc = 34000; // MPa or N/mm²
                const nu_conc = 0.2; // Poisson ratio
                const h_mm = betonSlabThickness * 10;
                const P_wheel_N = (betonAchslast / 2) * 1000; // in Newtons
                const k_N_mm3 = betonBettung * 1e-3; // MN/m³ to N/mm³

                // Radius of relative stiffness l [mm]
                const l_mm = Math.pow((E_conc * Math.pow(h_mm, 3)) / (12 * (1 - Math.pow(nu_conc, 2)) * k_N_mm3), 0.25);
                
                // Equivalent contact radius r [mm] assuming tire pressure of 0.8 MPa
                const r_mm = Math.sqrt(P_wheel_N / (0.8 * Math.PI));

                // Westergaard Randbiegespannung sigma_e [MPa]
                // sigma_e = 0.572 * (P / h^2) * [4 * log10(l / r) + 0.359]
                const log_val = Math.log10(l_mm / r_mm);
                const sigma_e = (0.572 * P_wheel_N / Math.pow(h_mm, 2)) * (4 * log_val + 0.359);

                // Grenzspannungsprüfung
                // C30/37 Biegezug-Charakteristik = 4.5 MPa. Dauerfestigkeitsfaktor unter zyklischer Autobahnbelastung = 2.0 -> zulässig ca. 2.25 MPa
                const allowed_sigma = 2.25; 
                const isThicknessOK = sigma_e <= allowed_sigma;
                const ratio = (sigma_e / allowed_sigma) * 100;

                return (
                  <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-lg space-y-3 mt-3 text-xs">
                    <h5 className="font-bold text-zinc-800">Spannungsermittlung nach Westergaard-Theorie:</h5>
                    <div className="grid grid-cols-2 font-mono gap-y-1 text-[11px]">
                      <div className="text-zinc-500">Radaufstandsfläche (r_t):</div>
                      <div className="text-right text-zinc-800">ø {formatDeZahl((r_mm * 2 / 10), 1)} cm (r = {formatDeZahl(r_mm, 0)} mm)</div>
                      
                      <div className="text-zinc-500">Elastische Steifigkeitslänge (l):</div>
                      <div className="text-right text-zinc-800">{formatDeZahl((l_mm / 10), 1)} cm (l = {formatDeZahl(l_mm, 0)} mm)</div>

                      <div className="text-zinc-500">Berechnete Dehnspannung (σ_e):</div>
                      <div className="text-right text-shiraz font-black">{formatDeZahl(sigma_e, 2)} N/mm² (MPa)</div>

                      <div className="text-zinc-500">Zul. Dehnspannung (Dauerlast):</div>
                      <div className="text-right text-emerald-800 font-bold">{formatDeZahl(allowed_sigma, 2)} N/mm²</div>

                      <div className="text-zinc-500">Ausnutzungsgrad (η_Biege):</div>
                      <div className={`text-right font-black ${isThicknessOK ? 'text-emerald-700' : 'text-red-700'}`}>{formatDeZahl(ratio, 1)} %</div>
                    </div>

                    <div className={`p-2 rounded border text-[11px] leading-relaxed ${
                      isThicknessOK ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                      {isThicknessOK ? (
                        <span>✓ <strong>Dimensionierung ausreichend!</strong> Die Betondecke mit d = {formatDeWert(betonSlabThickness)} cm hält den Dauer-Biegezugspannungen der Lkw-Verkehrslast stand.</span>
                      ) : (
                        <span>✗ <strong>MANGELHAFT (Bruchgefahr):</strong> Die Randspannung übersteigt die angesetzte Biegezugfestigkeit – Rissgefahr. Erhöhen Sie d oder verbessern Sie die Bettung (k-Wert).</span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Panel 2: LP-Frischbetongehalts-Rechner */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-text-main flex items-center gap-1.5 border-b border-zinc-100 pb-2">
              <Droplets size={15} className="text-shiraz" />
              2. Frost-Tausalz-LP-Prüfer (ZTV Beton-StB)
            </h4>
            <p className="text-[11px] text-gray-500 leading-normal">
              Fahrbahndecken erhalten künstliche Mikroluftporen (LP-Mittel), die den Druck gefrierenden Wassers abbauen. Die Mindest-LP-Gehälter hängen vom Größtkorn ab (Grenzwerte im Rechner: Lehrwerte, maßgebend ZTV Beton-StB).
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">Maximales Größtkorn:</label>
                  <select aria-label="Maximales Größtkorn" 
                    value={betonMaxAggregateSize}
                    onChange={(e) => setBetonMaxAggregateSize(parseInt(e.target.value) as any)}
                    className="w-full text-xs p-2 rounded-lg border border-zinc-200 font-sans"
                  >
                    <option value="32">GK 32 mm (Max. Korn 32)</option>
                    <option value="22">GK 22 mm (Max. Korn 22)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-main mb-1">Gemessener Luftporenhintergrund:</label>
                  <div className="flex items-center gap-2">
                    <input aria-label="Gemessener Luftporenhintergrund" 
                      type="number" 
                      step="0.1"
                      min="2"
                      max="10"
                      value={betonFreshAir}
                      onChange={(e) => setBetonFreshAir(parseFloat(e.target.value) || 2)}
                      className="w-20 text-xs p-1.5 border rounded"
                    />
                    <span className="text-xs font-mono font-bold">% Vol.</span>
                  </div>
                </div>
              </div>

              {/* LP Analysis output */}
              {(() => {
                const reqMin = betonMaxAggregateSize === 32 ? 4.0 : 4.5;
                const reqMax = betonMaxAggregateSize === 32 ? 6.5 : 7.0;
                const isLpOK = betonFreshAir >= reqMin && betonFreshAir <= reqMax;
                
                let lpMsg = "";
                let lpColor = "";
                let strengthLoss = 0;

                if (betonFreshAir > reqMax) {
                  strengthLoss = (betonFreshAir - reqMin) * 4.5; // assume 4.5% loss per 1% extra air
                  lpMsg = `⚠ Luftporengehalt über ${formatDeWert(reqMax)} %: Die Festigkeit sinkt (Faustregel ca. 4–5 % je 1 % Luft über dem Mindestwert von ${formatDeWert(reqMin)} %; hier rund ${formatDeZahl(strengthLoss, 0)} %).`;
                  lpColor = "bg-amber-50 text-amber-800 border-amber-200";
                } else if (betonFreshAir < reqMin) {
                  lpMsg = `✗ Luftporengehalt zu niedrig (${formatDeWert(betonFreshAir)} % < ${formatDeWert(reqMin)} %): unzureichender Frost-Tausalz-Widerstand, Abwitterung möglich.`;
                  lpColor = "bg-red-50 text-red-800 border-red-200";
                } else {
                  lpMsg = `✓ Im Sollbereich (${formatDeWert(reqMin)}–${formatDeWert(reqMax)} %, Lehrwerte).`;
                  lpColor = "bg-emerald-50 text-emerald-800 border-emerald-100";
                }

                return (
                  <div className={`p-3 rounded-lg border space-y-1.5 text-xs ${lpColor}`}>
                    <div className="font-bold flex justify-between items-center">
                      <span>Soll-LP-Bereich für GK {betonMaxAggregateSize}:</span>
                      <span className="font-mono">{formatDeWert(reqMin)}% bis {formatDeWert(reqMax)}%</span>
                    </div>
                    <p className="leading-relaxed text-[11px] font-sans">
                      {lpMsg}
                    </p>
                  </div>
                );
              })()}

            </div>
          </div>

        </div>

        {/* Right Column: Fugen & AKR-Screening */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Panel 3: Fugen-Dimensionierung (Joint Config) */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-text-main flex items-center gap-1.5 border-b border-zinc-100 pb-2">
              <Milestone size={15} className="text-shiraz" />
              3. Fugengeometrie &amp; Bewehrungsbedarf
            </h4>
            <p className="text-[11px] text-gray-500 leading-normal">
              Fahrstreifendecken im Straßenbau werden thermisch bedingt segmentiert. Zu lange unbewehrte Platten reißen unkontrolliert.
            </p>

            <div className="space-y-4">
              {/* Fugenabstand L */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span>Längsabstand der Scheinfugen (Plattenlänge L):</span>
                  <span className="font-mono text-xs text-shiraz font-bold">{formatDeZahl(betonFugenAbstand, 1)} m</span>
                </div>
                <input 
                  type="range" 
                  min="3.0" 
                  max="7.0" 
                  step="0.1"
                  value={betonFugenAbstand}
                  onChange={(e) => setBetonFugenAbstand(parseFloat(e.target.value))}
                  className="w-full accent-shiraz" 
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>ZTV Standard: ≤ 5,0 m</span>
                  <span>Kritischer Baufehler: &gt; 5,0 m</span>
                </div>
              </div>

              {/* Fugen und Beiwert Checks */}
              {(() => {
                const maxAllowedL = Math.min(25 * (betonSlabThickness / 100), 5.0);
                const isFugenOK = betonFugenAbstand <= maxAllowedL;
                
                // Calculate requirements (Dowels and tie bars) for joint
                // Transverse Joint (Querfuge): Spacing of dowels ø 25 is 25 cm. For typical 3.75m lanes:
                const dowelCount = Math.floor(3.75 / 0.25);
                // Longitudinal Joint (Längsfuge): spacing 1.5m -> Tie bars per slab length
                const tieBarCount = Math.max(3, Math.floor(betonFugenAbstand / 1.5) + 1);

                return (
                  <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-lg space-y-3 text-xs">
                    <div className={`p-2.5 rounded border text-[11px] leading-relaxed ${
                      isFugenOK ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-red-200'
                    }`}>
                      {isFugenOK ? (
                        <span>✓ <strong>Fugenabstand konform:</strong> L = {formatDeZahl(betonFugenAbstand, 1)} m ist kleiner als das Maximum von {formatDeZahl(maxAllowedL, 2)} m (Lehrannahme: ≤ 25·h und ≤ 5,0 m).</span>
                      ) : (
                        <span>✗ <strong>Rissgefahr:</strong> L = {formatDeZahl(betonFugenAbstand, 1)} m übersteigt den rechnerischen Grenzwert ({formatDeZahl(maxAllowedL, 2)} m) für unbewehrte Platten – unkontrollierte Querrisse sind zu erwarten.</span>
                      )}
                    </div>

                    <div className="border-t border-zinc-200 pt-2.5 space-y-1.5 font-sans">
                      <span className="font-bold text-zinc-700 block text-xs">Konstruktive Fugenausführung pro Platte (ZTV):</span>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-650 font-sans">
                        <li>Querscheinfugen: <strong>{dowelCount}x Runddübel (ø 25 mm, l = 500 mm)</strong> auf Dübelkörben. Sie übertragen Querkräfte und verhindern Stufenbildung an den Fugen.</li>
                        <li>Längsscheinfugen: <strong>{tieBarCount}x profilierte Anker (ø 20 mm, l = 800 mm)</strong> zur Verhinderung von Längskampf-Auseinanderdriften der Spurplatten.</li>
                      </ul>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

          {/* Panel 4: Alkali-Kieselsäure-Reaktion (AKR) / Betonkrebs */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-[#A3113E] flex items-center gap-1.5 border-b border-zinc-100 pb-2 font-sans">
              <AlertTriangle size={15} />
              4. Alkali-Kieselsäure-Reaktion (AKR) Screening
            </h4>
            <p className="text-[11px] text-gray-500 leading-normal">
              Die zerstörerische AKR ("Betonkrebs") tritt auf, wenn amorphe Kieselsäuren in der Gesteinskörnung mit Alkalien aus dem Zement unter Wassereinfluss (Sprühnebel + Tausalz) ein quellfähiges Alkalisilikatgel bilden. Dies zersprengt den Beton von innen.
            </p>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-text-main mb-1">Gesteinskörnung (Edelsplitt):</label>
                  <select aria-label="Gesteinskörnung (Edelsplitt)" 
                    value={betonAggregate}
                    onChange={(e) => setBetonAggregate(e.target.value as any)}
                    className="w-full text-xs p-2 rounded border border-zinc-200 bg-white"
                  >
                    <option value="quarz">Quarzhaltiger Kies / Opalsand (hochreaktiv)</option>
                    <option value="kalk">Reiner Kalkstein (E1 - unbedenklich)</option>
                    <option value="basalt">Geprüfter Basalt / Granit (reaktionsarm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-main mb-1">Alkaligehalt des Zements:</label>
                  <select aria-label="Alkaligehalt des Zements" 
                    value={betonCementAlkali}
                    onChange={(e) => setBetonCementAlkali(e.target.value as any)}
                    className="w-full text-xs p-1.5 rounded border border-zinc-200 bg-white"
                  >
                    <option value="high">Standard CEM I (Na2O_eq ≥ 0,60%)</option>
                    <option value="low">NA-Zement (Na2O_eq &lt; 0,60% / Low Alkali)</option>
                  </select>
                </div>
              </div>

              {/* Screening Analysis */}
              {(() => {
                let riskTitle = "";
                let riskColor = "";
                let riskAdvice = "";

                if (betonAggregate === 'quarz') {
                  if (betonCementAlkali === 'high') {
                    riskTitle = "AKUTES SCHADENSRISIKO (Betonkrebs-Gefahr EXTREM HOCH!)";
                    riskColor = "bg-red-50 text-red-800 border-red-200";
                    riskAdvice = "Alkaliempfindliche Gesteinskörnung mit üblichem Zement und Tausalzzufuhr (Feuchtigkeitsklasse WS): hohes AKR-Risiko, Schäden können nach einigen Jahren auftreten. Unzulässig ohne Gutachten bzw. Maßnahmen nach Alkali-Richtlinie, TL Beton-StB und den jeweils aktuellen ARS (WS ist nicht Teil der DIN 1045-2).";
                  } else {
                    riskTitle = "Mäßiges Risiko (Beherrscht durch NA-Zement)";
                    riskColor = "bg-amber-50 text-amber-800 border-amber-200";
                    riskAdvice = "Ein Zement mit niedrigem wirksamen Alkaligehalt (NA-Zement, Na2O-Äquivalent ≤ 0,60 %) senkt den Alkalieintrag aus dem Zement. Bei Feuchtigkeitsklasse WS bleibt äußere Alkalizufuhr durch Tausalz – Gesteinskörnung muss geprüft sein.";
                  }
                } else {
                  riskTitle = "Geringes AKR-Risiko";
                  riskColor = "bg-emerald-50 text-emerald-800 border-emerald-100";
                  riskAdvice = "Gesteinskörnungen der Alkaliempfindlichkeitsklasse E I (z. B. viele Kalksteine) gelten als unbedenklich. Fahrbahndecken gehören stets zur Feuchtigkeitsklasse WS.";
                }

                return (
                  <div className={`p-3 rounded-lg border space-y-1.5 font-sans ${riskColor}`}>
                    <div className="font-bold uppercase tracking-wider text-[10px] block">AKR-Evaluierungsstufe:</div>
                    <div className="font-extrabold text-[12px]">{riskTitle}</div>
                    <p className="text-[11px] leading-relaxed">
                      {riskAdvice}
                    </p>
                    <div className="pt-1.5">
                      <button 
                        type="button" 
                        onClick={() => setBetonShowAKRDetails(!betonShowAKRDetails)}
                        className="text-[10px] font-bold underline hover:opacity-80 cursor-pointer"
                      >
                        {betonShowAKRDetails ? 'Zusammenfassung ausblenden' : 'Technische Erläuterungen einblenden...'}
                      </button>
                      {betonShowAKRDetails && (
                        <div className="mt-2 text-[10px] bg-white/60 p-2 rounded border border-current leading-relaxed space-y-1 leading-normal">
                          <div><strong>Chemismus der AKR:</strong></div>
                          <div>1. Gelbildungsverfahren: SiO_2 (Gesteinskörnung) + 2 NaOH (Zement) + H_2O → Na_2SiO_3·H_2O (Alkaligel)</div>
                          <div>2. Volumendehnung: Das Gel zieht im Frost-Tausalz-Zyklus kapillares Wasser an und quillt massiv auf.</div>
                          <div>3. Zerrüttung: Überschreitet der Spaltdruck die Zugfestigkeit des Betons (ca. 3,0 MPa), zerreißt das monolithische Aggregatgefüge netzartig.</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
