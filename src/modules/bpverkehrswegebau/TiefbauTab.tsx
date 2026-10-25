// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Calculator, Droplets } from 'lucide-react';

export interface TiefbauTabProps {
  setTiefbauArea: React.Dispatch<React.SetStateAction<number>>;
  setTiefbauDuration: React.Dispatch<React.SetStateAction<number>>;
  setTiefbauFss: React.Dispatch<React.SetStateAction<number>>;
  setTiefbauPsi: React.Dispatch<React.SetStateAction<number>>;
  setTiefbauRain: React.Dispatch<React.SetStateAction<number>>;
  tiefbauArea: number;
  tiefbauDuration: number;
  tiefbauFss: number;
  tiefbauPsi: number;
  tiefbauRain: number;
}

export default function TiefbauTab({ setTiefbauArea, setTiefbauDuration, setTiefbauFss, setTiefbauPsi, setTiefbauRain, tiefbauArea, tiefbauDuration, tiefbauFss, tiefbauPsi, tiefbauRain }: TiefbauTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Intro */}
      <div className="bg-off-white p-4 rounded-xl border border-home-grau/30">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Droplets className="text-shiraz" size={18} /> Tiefbau-Systemtechnik &amp; Urban Drainage (DWA &amp; DIN)
        </h3>
        <p className="text-xs text-slate-800 leading-relaxed">
          Der moderne Tiefbau umfasst sämtliche baulichen Maßnahmen unterhalb der Erdoberfläche. Neben der Bodenstabilisierung bildet das <strong>Wassermanagement (Abflusstransport, Rückhaltung, Versickerung und Reinigung)</strong> nach <strong>DIN EN 752</strong> und den relevanten <strong>DWA-Regelwerken (z.B. DWA-A 138)</strong> das schützende Rückgrat urbaner Infrastrukturen. Die hier dargelegten Systeme decken die gesamte Palette modernen Tiefbaumaterials ab.
        </p>
      </div>

      {/* SECTION 1: Die 10 Produktwelten des Tief- & Straßenbaus */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-main mb-4 border-b border-zinc-200 pb-1.5">
          I. Produktbereiche &amp; Technische Systeme im Tief- und Straßenbau
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Anschlusssysteme */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span>1. Anschlusssysteme &amp; Formteile</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">DIN EN 1401-1</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                Gas- und wasserdichte Einbindungen und Übergänge in bestehende Rohr- und Kanalsysteme für dauerhafte Dichtigkeit bei Druckbeaufschlagung und Erdbewegungen.
              </p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li>• <strong>Übergangskupplungen:</strong> Manschetten mit Edelstahlbändern zur radial kraftschlüssigen und dichten Verbindung unterschiedlicher Rohrmaterialien (z.B. Steinzeug auf PVC).</li>
                <li>• <strong>Sattelstücke &amp; Anschlussmuffen:</strong> Nachträgliche 90°- oder 45°-Anschlüsse an bestehende Hauptkanäle ohne Rohraustausch.</li>
                <li>• <strong>Abzweig-Elemente:</strong> 45°- und 87°-Formstücke mit montagefreundlicher Steckmuffensystematik und eingelegten EPDM-Lippendichtungen.</li>
              </ul>
            </div>
          </div>

          {/* 2. Drainage & Sickerleitung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span>2. Drainage &amp; Baugrunddränung</span>
                <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">DIN 4095 / DIN 4262-1</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                Sicheres Abführen von Schichten- und Sickerwasser zur Vermeidung von hydrostatischem Druck auf Kellerwände, Fundamente und Verkehrsträger.
              </p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li>• <strong>Sickerrohre und Dränleitungen:</strong> Vollsickerrohre (TP), Teilsickerrohre (LP) mit profilierten Wassereintrittsschlitzen zur effektiven Wasseraufnahme im Straßenbau.</li>
                <li>• <strong>Dränageschächte / Spülschächte:</strong> Kontrollschächte DN 315 / 400 mit Sandfang zur Reinigung der Dränstränge durch Spülung.</li>
                <li>• <strong>Geoverbundstoffe:</strong> Dränmatten mit Noppenbahn und aufkaschiertem Filtervlies zur direkten Wanddränung an Kellergeschossen.</li>
              </ul>
            </div>
          </div>

          {/* 3. Regen- & Abwassersysteme */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span>3. Regen- &amp; Abwasser-Kanalisation</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">DIN EN 1852 / DIN EN 476</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                Freispiegelleitungen zur gesicherten hydraulischen Ableitung großer Wassermassen mit hohen Ringsteifigkeiten (S_N ≥ 8 kN/m²).
              </p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li>• <strong>Vollwand-Kanalrohre (PP/PVC):</strong> Strukturstabile Rohre (KG / KG2000) für Schwerlastbereiche (SLW 60). Extrem glatte Innenfläche zur Minimierung von Inkrustationen.</li>
                <li>• <strong>Stahlbetonrohre:</strong> Für sehr große Nennweiten (DN &gt; 1200) bei maximaler Erdauflast und statischer Beanspruchung.</li>
                <li>• <strong>Rückstauverschlüsse:</strong> Klappensysteme (DIN EN 13564) zum Schutz tiefliegender Ablaufstellen vor drückendem Abwasser aus dem Sammelkanal.</li>
              </ul>
            </div>
          </div>

          {/* 4. Funktionspflaster */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span>4. Ökoprofile &amp; Funktionspflaster</span>
                <span className="text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-mono font-bold">FGSV M-VV</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                Hydraulisch optimierte Betonwaren und Beläge zur gezielten dezentralen Versickerung auf Verkehrsflächen (Flächenentsiegelung).
              </p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li>• <strong>Haufwerksporige Sickersteine:</strong> Gefügedichte Baustoffe mit definiertem Porenvolumen, durch welche das Niederschlagswasser vertikal direkt absickert.</li>
                <li>• <strong>Pflaster mit Sickerfuge:</strong> Steinkonstruktionen mit verbreiterten Abstandshaltern (z.B. Fugenbreite ≥ 10 mm), verfüllt mit filterndem Splitt-Substrat.</li>
                <li>• <strong>Rasengittersteine:</strong> Hoher Grünflächenanteil für landwirtschaftlichen Wegebau und Parkplätze bei hoher PKW-Tragfähigkeit.</li>
              </ul>
            </div>
          </div>

          {/* 5. Geotextilien */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span>5. Geomembranen &amp; Geotextilien</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">DIN EN 13249</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                Polymere Planstoffe (Vliese, Gewebe, Gitter) zur Stabilisierung, Trennung und mechanischen Filtration im Bodenaufbau.
              </p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li>• <strong>Filtervliese:</strong> Mechanisch vernadelte Endlosfasern (Polypropylen) mit hoher Reißdehnbarkeit. Sie verhindern den Eintrag von Feinkorn in Sickerschichten (Filterstabilität).</li>
                <li>• <strong>Bewehrungs-Geogitter:</strong> Monofile Zugkonstruktionen (PET/PP) zur Erhöhung der Tragfähigkeit von ungebundenen Schotterschichten.</li>
                <li>• <strong>Bändchengewebe:</strong> Extrem zugfeste Gewebebahnen zur Trennung minderwertigen Baugrundes von der Frostschutzschicht.</li>
              </ul>
            </div>
          </div>

          {/* 6. Hangbefestigung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span>6. Hangbefestigung &amp; Abstützungen</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">Eurocode 7</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                Konstruktionen zum Abfangen von Erddruck bei Geländesprüngen, Böschungsflächen und im gestalterischen Landschaftsbau.
              </p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li>• <strong>Mauerscheiben &amp; L-Steine:</strong> Monolithische Stahlbetonbauteile nach statischer Bemessung für Lastfälle mit und ohne PKW-Auffahrgeschwindigkeiten.</li>
                <li>• <strong>Gabionen (Steinkörbe):</strong> Hochwertig verzinkte Stahlgitterkörbe zur flexiblen, wasserdurchlässigen Schwerkraft-Stützmauer-Konstruktion.</li>
                <li>• <strong>Böschungs- &amp; Florgitter:</strong> Hohlsteine zur mechanischen Sicherung von Steilhängen mit der Option zur anschließenden Begrünung.</li>
              </ul>
            </div>
          </div>

          {/* 7. Kabelschutz */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span>7. Kabelschutz- &amp; Leitungsrohre</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">DIN EN 61386-24</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                Sichere Verlegung von Strom-, Telekommunikations- und Glasfasertrassen im Erdreich mit mechanischem Schutz.
              </p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li>• <strong>Verbund-Kabelschutzrohre (PE-HD):</strong> Gewellter Außenmantel für Biegsamkeit und hohe Ringsteifigkeit, innen glatte Gleitschicht für reibungsfreien Kabeleinzug.</li>
                <li>• <strong>Kabelabdeckplatten &amp; Hauben:</strong> Warnende Kunststoffplatten zum Schutz erdverlegter Starkstromkabel vor Baggerzähnen bei späteren Tiefbauarbeiten.</li>
                <li>• <strong>Mehrsparten-Hauseinführungen:</strong> Gas- und druckwasserdichte Bündeldurchführungen durch Bodenplatten und Außenwände.</li>
              </ul>
            </div>
          </div>

          {/* 8. Linien- & Punktentwässerung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span>8. Linien- &amp; Punktentwässerung</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">DIN EN 1433 / DIN 4052</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                Schnelle Entwässerung versiegelter und geneigter Verkehrsflächen zur Vermeidung von Aquaplaning und Überflutung.
              </p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li>• <strong>Entwässerungsrinnen:</strong> Rinnenkörper aus verschleißfestem Polymerbeton oder faserarmierter Polyethylen-Verbindung. Rostaufsätze aus Sphäroguss oder Edelstahl bis Klasse F900.</li>
                <li>• <strong>Hofabläufe &amp; Straßenabläufe:</strong> Standardisierte Punktentwässerungen (Gully DN 450) mit integriertem Schlammeimer zur mechanischen Feststoff-Vorreinigung.</li>
                <li>• <strong>Schlitzrinnen:</strong> Extrem unauffällige, flächenbündige Schlitzsysteme für repräsentative Fußgänger- und Marktplatzflächen.</li>
              </ul>
            </div>
          </div>

          {/* 9. Regenwasser-Bewirtschaftung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span>9. Regenwasser-Bewirtschaftung</span>
                <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">DWA-A 138 / DWA-M 153</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                Moderne Regenrückhaltung, Versickerung und kontrollierte Einleitung zur Entlastung des urbanen Mischwassernetzes.
              </p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li>• <strong>Füllkörperrigolen (PP Sickerboxen):</strong> Kubische Netzwerkkörper mit bis zu 95% freiem Hohlvolumen. Spül- und kamerabefahrbar zur Funktionsüberwachung.</li>
                <li>• <strong>Regenwasserrückhaltebecken &amp; Zisternen:</strong> Unterirdische Staukanäle und Betongroßbehälter zur Sammlung und gedrosselten Abgabe.</li>
                <li>• <strong>Koaleszenzabscheider:</strong> Abscheideanlagen für mineralische Leichtflüssigkeiten (Öl/Benzin) zur Vorbehandlung kritischer Straßenabwässer vor Versickerung.</li>
              </ul>
            </div>
          </div>

          {/* 10. Sanierungsprodukte */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-text-main border-b border-zinc-100 pb-2 mb-3 flex items-center justify-between">
                <span>10. Sanierungsprodukte im Straßenbau</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">ZTV Fug-StB</span>
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed mb-3">
                Spezialwerkstoffe zur dauerhaften Instandsetzung von Rissen, Schlaglöchern und Schachtabdeckungen im Asphalt- und Betonstraßenbau.
              </p>
              <ul className="space-y-1.5 text-[11px] text-text-main/80">
                <li>• <strong>Bitumen-Schmelzbänder (Rissbänder):</strong> Heiß oder kalt verlegbare Anschlussbänder zur dichten Verbindung von neuem Asphalt an Ränder und Schächte (Nahtausbildung).</li>
                <li>• <strong>Reparaturmörtel &amp; Verguss:</strong> Schachtrahmen-Reguliermörtel mit sehr hoher Frühfestigkeit (frühe Verkehrsfreigabe nach Herstellerangabe).</li>
                <li>• <strong>Kaltasphalt (Reaktiv-Mischgut):</strong> Gesteinsmischung mit polymerem Bindemittel, härtet unter Feuchtigkeitseinwirkung für eilige Schadstellenbeseitigungen aus.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: Interactive Rigolen-Rechner & Schachtkomparator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-zinc-200 pt-6">
        
        {/* Rigolenberechnung (Left: Controls, Right: Result) */}
        <div className="lg:col-span-12 bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs">
          <h4 className="font-extrabold text-sm text-text-main mb-2 flex items-center gap-1.5 border-b border-zinc-100 pb-2">
            <Calculator size={16} className="text-shiraz" /> II. Interaktives Planungs-Muster: Rigolenbemessung nach DWA-A 138
          </h4>
          <p className="text-xs text-text-main/70 leading-relaxed mb-4">
            Die Bemessung eines unterirdischen Sickerelements (Rigole) basiert auf der Niederschlagsfläche A_E, dem spezifischen Spitzenregen r_D und der Infiltration in das umgebende Erdreich. Der vereinfachte Rechner schätzt das erforderliche Speichervolumen ab (Lehrmodell; Bemessung nach DWA-A 138).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Controls */}
            <div className="md:col-span-5 bg-off-white p-4 rounded-xl border border-home-grau/20 space-y-4">
              {/* Area */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span>Angeschlossene Auffangfläche (A_E):</span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeWert(tiefbauArea)} m²</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="2000" 
                  step="10"
                  value={tiefbauArea}
                  onChange={(e) => setTiefbauArea(parseInt(e.target.value))}
                  className="w-full accent-shiraz" 
                />
              </div>

              {/* Runoff coeff */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span>Abflussbeiwert (ψ):</span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeZahl(tiefbauPsi, 2)}</span>
                </div>
                <select 
                  value={tiefbauPsi}
                  onChange={(e) => setTiefbauPsi(parseFloat(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-zinc-200 bg-white"
                >
                  <option value="0.9">0,90 (Asphalt, fugenloser Beton, Metalldach)</option>
                  <option value="0.75">0,75 (Betonpflaster mit dichten Fugen)</option>
                  <option value="0.5">0,50 (Kiesbelag, Kiesdach)</option>
                  <option value="0.3">0,30 (Gründach, unbefestigter Boden)</option>
                </select>
              </div>

              {/* Rain intensity */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main">
                  <span>Bemessungsregen-Intensität (r_D):</span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeWert(tiefbauRain)} l/(s·ha)</span>
                </div>
                <input 
                  type="range" 
                  min="80" 
                  max="500" 
                  step="10"
                  value={tiefbauRain}
                  onChange={(e) => setTiefbauRain(parseInt(e.target.value))}
                  className="w-full accent-shiraz" 
                />
              </div>

              {/* Duration */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main border-none">
                  <span>Regendauer (t_d):</span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeWert(tiefbauDuration)} min</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="60" 
                  step="5"
                  value={tiefbauDuration}
                  onChange={(e) => setTiefbauDuration(parseInt(e.target.value))}
                  className="w-full accent-shiraz" 
                />
              </div>

              {/* Storage Type Coefficient */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-main border-none">
                  <span>Sickerelement Typ (Speichereffizienz):</span>
                  <span className="font-mono text-zinc-900 font-bold">{formatDeZahl((tiefbauFss * 100), 0)}% Hohlraum</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => setTiefbauFss(0.95)}
                    className={`py-1.5 px-2 text-[11px] rounded-md font-bold border transition-all ${
                      tiefbauFss === 0.95
                        ? 'bg-shiraz text-white border-shiraz shadow-md'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    Kunststoff-Sickerbox
                  </button>
                  <button
                    onClick={() => setTiefbauFss(0.30)}
                    className={`py-1.5 px-2 text-[11px] rounded-md font-bold border transition-all ${
                      tiefbauFss === 0.30
                        ? 'bg-shiraz text-white border-shiraz shadow-md'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    Kies-/Schotterbett
                  </button>
                </div>
              </div>

            </div>

            {/* Calculations and visualization */}
            {(() => {
              const a_red = (tiefbauArea * tiefbauPsi);
              const q_in = a_red * (tiefbauRain / 10000); // l/s
              const v_zu_liters = q_in * (tiefbauDuration * 60); // Liters
              const v_zu_m3 = v_zu_liters / 1000; // m³

              const k_f = 1.0e-5; // m/s (Sandiger Lehm / Feinsand)
              const a_sohle = Math.max(1.5, v_zu_m3 * 0.35); // m²
              const q_sicker_l_s = k_f * a_sohle * 1000; // l/s
              const v_sicker_liters = q_sicker_l_s * (tiefbauDuration * 60);
              const v_sicker_m3 = v_sicker_liters / 1000;

              const f_S = 1.1; // Sicherheitsbeiwert (DWA-A 138)
              // Bruttovolumen der Rigole (Füllkörper bzw. Kies inkl. Feststoff): V_R = f_S · (V_zu − V_s) / s_R
              const v_speicher_m3 = Math.max(0.1, f_S * (v_zu_m3 - v_sicker_m3) / tiefbauFss);
              const v_nutz_m3 = v_speicher_m3 * tiefbauFss; // speicherwirksames Porenvolumen
              const h_rig = 0.6;
              const b_rig = 1.2;
              const l_rig = v_speicher_m3 / (h_rig * b_rig);
              const num_boxes = Math.ceil(v_nutz_m3 / 0.24);

              return (
                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Zufluss-Details */}
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                      <span className="text-[10px] uppercase font-mono font-bold text-zinc-500">Hydraulischer Zufluss</span>
                      <div className="text-xl font-bold text-zinc-900 font-mono mt-1">{formatDeZahl(v_zu_m3, 2)} m³</div>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-1 w-full">
                        Spitzenzuflussrate Q_in beträgt <strong className="font-mono">{formatDeZahl(q_in, 1)} l/s</strong> über die reduzierte Auffangfläche A_red = {formatDeZahl(a_red, 0)} m².
                      </p>
                    </div>

                    {/* Sicker-Details */}
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                      <span className="text-[10px] uppercase font-mono font-bold text-zinc-500">Boden-Infiltration</span>
                      <div className="text-xl font-bold text-zinc-900 font-mono mt-1">{formatDeZahl(v_sicker_m3, 3)} m³</div>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-1 w-full">
                        Infiltration über Sohle (A_soh ≈ {formatDeZahl(a_sohle, 1)} m²) bei Sand/Schluff-Boden (k_f = 10⁻⁵ m/s): <strong className="font-mono">{formatDeZahl(q_sicker_l_s, 3)} l/s</strong>.
                      </p>
                    </div>

                  </div>

                  {/* Speicher-Ergebnis */}
                  <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-shiraz">Erforderliches Rigolen-Bruttovolumen (V_rig)</span>
                        <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">{formatDeZahl(v_speicher_m3, 2)} m³</div>
                      </div>
                      <div className="text-right text-[10px] text-slate-800 font-mono">
                        <div>DWA-A 138 Planungsentwurf</div>
                        <div>Sicherheitsbeiwert f_S = 1,1 integriert</div>
                      </div>
                    </div>

                    {/* Statisches Resultat / Empfehlung */}
                    <div className="border-t border-home-grau/30 pt-3 mt-3 text-xs leading-relaxed text-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="font-bold">Konstruktive Empfehlung:</p>
                        {tiefbauFss === 0.95 ? (
                          <p className="text-[11px] mt-0.5 text-slate-900 font-medium">
                            Verwendung von PP-Sickerboxen (Rigolenfüllkörper): <span className="font-mono font-bold text-slate-800">{num_boxes} Standard-Sickerboxen</span> (0,24m³ Nutzkapazität je Box) mit umhüllendem Filtervlies (Geotextil) erforderlich.
                          </p>
                        ) : (
                          <p className="text-[11px] mt-0.5 text-slate-900 font-medium">
                            Verwendung eines Kiesgrabens (Körnung 16/32, Hohlraumfaktor s_R = 0,3): Der Kieskörper benötigt ein Bruttovolumen von ca. <span className="font-mono font-bold text-slate-800">{formatDeZahl(v_speicher_m3, 1)} m³</span>, davon speicherwirksam (Porenraum) ca. <span className="font-mono font-bold text-slate-800">{formatDeZahl(v_nutz_m3, 1)} m³</span>.
                          </p>
                        )}
                      </div>
                      <div className="font-mono text-[11px] bg-white/60 p-2.5 rounded border border-home-grau/30 flex flex-col justify-center">
                        <div>Sohlentiefe: <span className="font-bold">0,60 m</span></div>
                        <div>Breite: <span className="font-bold">1,20 m</span></div>
                        <div>Erforderliche Länge: <span className="font-bold text-slate-800">{formatDeZahl(l_rig, 2)} m</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Formel-Herleitung */}
                  <div className="p-3 text-[10.5px] text-text-main/60 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <span className="font-bold text-text-main block mb-1">DWA-A 138 Speicherbemessungsgleichung:</span>
                    <FormulaText text="V_{rig} = \frac{A_{red} \cdot 10^{-7} \cdot r_D \cdot t_d \cdot 60 - A_{sohle} \cdot k_f \cdot t_d \cdot 60}{s_R}" />
                    <span className="text-[10px] block mt-1 leading-normal">
                      Hierbei steht s_R für den systembedingten Hohlraumgehalt, der bei synthetischen Füllkörperblöcken (Hohlraumboxen) bis zu 95% beträgt, wohingegen Kiesträgerbetten nur etwa 30% Hohlvolumen einbringen können.
                    </span>
                  </div>

                </div>
              );
            })()}
          </div>
        </div>

      </div>

    </div>
  );
}
