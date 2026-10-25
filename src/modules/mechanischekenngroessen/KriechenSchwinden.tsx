import { Clock, Activity, Timer, Layers, Sliders, Scale } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import { Slider } from '@/src/components/ui/Slider';
import KriechModellDiagramm from './KriechModellDiagramm';
import type { Dispatch, SetStateAction } from 'react';

interface KriechenSchwindenProps {
  rheoModus: "relaxieren" | "kriechen";
  rheoTauSec: number;
  rheoWert0: number;
  setRheoModus: Dispatch<SetStateAction<"relaxieren" | "kriechen">>;
  setRheoTauSec: Dispatch<SetStateAction<number>>;
  setRheoWert0: Dispatch<SetStateAction<number>>;
}

export default function KriechenSchwinden({ rheoModus, rheoTauSec, rheoWert0, setRheoModus, setRheoTauSec, setRheoWert0 }: KriechenSchwindenProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Box 1: Kriechen */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-home-grau/20 mb-3">
                <h3 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                  <Clock className="text-shiraz" size={17} /> 1. Kriechen (Creep)
                </h3>
                <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                  σ = konst.
                </span>
              </div>

              <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                <strong>Kriechen</strong> ist die zeitabhängige <em>Zunahme der Verformung</em> unter einer 
                dauerhaft wirkenden, konstanten mechanischen Spannung.
              </p>

              <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 mb-3 text-xs space-y-1">
                <div className="font-bold text-text-main">Gesamtdehnung nach Zeit t:</div>
                <BlockMath math="\varepsilon(t) = \varepsilon_{\text{el}} \cdot \left[ 1 + \varphi(t, t_0) \right]" />
                <div className="font-bold text-text-main pt-1">Effektiver Langzeit-E-Modul:</div>
                <BlockMath math="E_{c,\text{eff}} = \frac{E_{cm}}{1 + \varphi(t, t_0)}" />
              </div>

              <div className="text-[11px] text-text-main/75 space-y-1">
                <div><strong>Ursache &amp; Folgen:</strong></div>
                <p>
                  Im Zementstein führt die Wanderung des adsorbierten Wassers in den C-S-H-Gelen zum Gleiten der Gelpartikel. 
                  Folge: Stützensenkungen und bis zu <strong>3-fache Langzeitdurchbiegungen</strong> von Betonplatten!
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-home-grau/20 text-[10px] text-slate-500 font-mono">
              Typische Kriechzahl Beton: φ ≈ 1,5 bis 3,0 (DIN EN 1992-1-1)
            </div>
          </div>

          {/* Box 2: Schwinden */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-home-grau/20 mb-3">
                <h3 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                  <Activity className="text-amber-600" size={17} /> 2. Schwinden (Shrinkage)
                </h3>
                <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                  σ = 0 (lastfrei)
                </span>
              </div>

              <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                <strong>Schwinden</strong> ist die <em>lastunabhängige Volumenverringerung</em> eines Werkstoffs 
                infolge Feuchtigkeitsabgabe an die Umwelt und innerer chemischer Reaktionen.
              </p>

              <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 mb-3 text-xs space-y-1">
                <div className="font-bold text-text-main">Gesamtschwinddehnung:</div>
                <BlockMath math="\varepsilon_{\text{cs}} = \varepsilon_{\text{cd}} + \varepsilon_{\text{ca}}" />
                <div className="text-[10px] text-slate-600 font-mono">
                  εcd: Trocknungsschwinden (Diffusionsvorgang)<br />
                  εca: Autogenes Schwinden (Hydratationskontraktion)
                </div>
              </div>

              <div className="text-[11px] text-text-main/75 space-y-1">
                <div><strong>Zwang &amp; Rissbildung:</strong></div>
                <p>
                  Wird das freie Schwinden behindert (z. B. Bodenplatte auf festem Grund), entstehen massive 
                  Zugspannungen: <InlineMath math="\sigma_z = E \cdot \varepsilon_{\text{cs}}" />. Übersteigt <InlineMath math="\sigma_z" /> die 
                  Zugfestigkeit <InlineMath math="f_{ct}" />, bilden sich Schwindrisse.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-home-grau/20 text-[10px] text-slate-500 font-mono">
              Endschwindmaß Beton: εcs,∞ ≈ -0,30 bis -0,60 ‰ (-0,3 bis -0,6 mm/m)
            </div>
          </div>

          {/* Box 3: Relaxation */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-home-grau/20 mb-3">
                <h3 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                  <Timer className="text-purple-600" size={17} /> 3. Relaxation (Stress Relaxation)
                </h3>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                  ε = konst.
                </span>
              </div>

              <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                <strong>Relaxation</strong> ist der zeitabhängige <em>Abbau von mechanischer Spannung</em> 
                bei konstant gehaltener äußerer Verformung (Dehnung <InlineMath math="\varepsilon_0 = \text{konst.}" />).
              </p>

              <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 mb-3 text-xs space-y-1">
                <div className="font-bold text-text-main">Spannungsverlauf (Maxwell-Element):</div>
                <BlockMath math="\sigma(t) = \sigma_0 \cdot \exp\left(-\frac{t}{\tau_{\text{rel}}}\right)" />
                <div className="text-[10px] text-slate-600 font-mono">
                  Relaxationszeit: τ = η / E (Verhältnis Viskosität zu Steifigkeit)
                </div>
              </div>

              <div className="text-[11px] text-text-main/75 space-y-1">
                <div><strong>Praxisbeispiele:</strong></div>
                <ul className="list-disc list-inside space-y-0.5 pl-0.5">
                  <li><strong>Spannbeton:</strong> Vorspanndrähte verlieren durch Relaxation über 50 Jahre ca. 4–8 % ihrer Anfangsspannung.</li>
                  <li><strong>Fugendichtstoffe:</strong> Polymerabdichtungen entspannen sich, um Reißkräfte abzubauen.</li>
                  <li><strong>Vorgespannte Schrauben:</strong> Setzen und Relaxation erfordern Nachziehen.</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-home-grau/20 text-[10px] text-slate-500 font-mono">
              Spannstahl-Klassen nach EC2: Klasse 1 (Draht), Klasse 2 (Litze sehr niedrig), Klasse 3 (Stab)
            </div>
          </div>

        </div>

        {/* Rheologische Ersatzmodelle */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <Layers className="text-shiraz" size={18} /> Rheologische Ersatzmodelle (Feder &amp; Dämpfer)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
              <div className="font-bold text-text-main">1. Hooke-Körper (Feder)</div>
              <div className="text-[11px] font-mono text-shiraz">σ = E · ε</div>
              <p className="text-[11px] text-text-main/75">
                Rein elastisch, verzögerungsfrei, vollkommen reversibel. Keine Energieverluste.
              </p>
            </div>

            <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
              <div className="font-bold text-text-main">2. Newton-Körper (Dämpfer)</div>
              <div className="text-[11px] font-mono text-shiraz">σ = η · (dε/dt)</div>
              <p className="text-[11px] text-text-main/75">
                Rein viskose Flüssigkeit. Die Spannung hängt von der Dehngeschwindigkeit ab. Keine reversible Rückstellung.
              </p>
            </div>

            <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
              <div className="font-bold text-text-main">3. Maxwell-Modell (Reihe)</div>
              <div className="text-[11px] font-mono text-shiraz">Feder + Dämpfer in Reihe</div>
              <p className="text-[11px] text-text-main/75">
                Grundmodell für <strong>Spannungsrelaxation</strong>. Bei Dehnungssprung relaxiert die Spannung exponentiell gegen 0.
              </p>
            </div>

            <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
              <div className="font-bold text-text-main">4. Kelvin-Voigt (Parallel)</div>
              <div className="text-[11px] font-mono text-shiraz">Feder + Dämpfer parallel</div>
              <p className="text-[11px] text-text-main/75">
                Grundmodell für <strong>verzögerte Elastizität (Kriechen)</strong>. Verformung nähert sich asymptotisch dem Hooke-Wert.
              </p>
            </div>
          </div>

          {/* INTERAKTIVER RHEOLOGIE-SIMULATOR: KRIECHEN VS. RELAXIEREN */}
          <div className="mt-6 pt-5 border-t border-home-grau/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sliders className="text-shiraz" size={17} />
                <h4 className="text-sm font-bold text-text-main uppercase tracking-wider">
                  Live-Simulator Rheologischer Modelle: Kriechen &amp; Relaxieren
                </h4>
              </div>

              {/* Umschalter: Relaxieren vs. Kriechen */}
              <div className="flex bg-off-white p-1 rounded-xl border border-home-grau/30 gap-1 text-xs">
                <button aria-pressed={rheoModus === 'relaxieren'}
                  onClick={() => setRheoModus('relaxieren')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      rheoModus === 'relaxieren'
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'text-text-main/70 hover:text-text-main hover:bg-white'
                    }`}
                >
                  <Timer size={14} /> 1. Relaxieren (ε = konst.)
                </button>
                <button aria-pressed={rheoModus === 'kriechen'}
                  onClick={() => setRheoModus('kriechen')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      rheoModus === 'kriechen'
                        ? 'bg-shiraz text-white shadow-sm'
                        : 'text-text-main/70 hover:text-text-main hover:bg-white'
                    }`}
                >
                  <Clock size={14} /> 2. Kriechen (σ = konst.)
                </button>
              </div>
            </div>

            {/* Slider & Berechnungen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-off-white p-4 rounded-xl border border-home-grau/25">
              <Slider
                label={rheoModus === 'relaxieren' ? "Anfangsspannung σ₀" : "Dauerlastspannung σ₀"}
                min={2}
                max={50}
                step={1}
                value={rheoWert0}
                unit="MPa"
                info={rheoModus === 'relaxieren' ? "Ausgangsspannung beim Dehnungssprung ε₀ = σ₀ / E." : "Konstant wirkende Dauerlastspannung."}
                onChange={(e) => setRheoWert0(Number(e.target.value))}
              />
              <Slider
                label={rheoModus === 'relaxieren' ? "Relaxationszeit τ = η / E" : "Retardationszeit τ = η / E"}
                min={0.5}
                max={8.0}
                step={0.5}
                value={rheoTauSec}
                unit="s"
                info="Verhältnis von Viskosität zu Steifigkeit. Gibt die Zeit bis zum Abfall auf 1/e ≈ 36,8 % bzw. Erreichen von 63,2 % an."
                onChange={(e) => setRheoTauSec(Number(e.target.value))}
              />
            </div>

            {/* Live SVG Diagramm der Ersatzmodelle */}
            {<KriechModellDiagramm rheoModus={rheoModus} rheoTauSec={rheoTauSec} rheoWert0={rheoWert0} />}
          </div>
        </div>

        {/* KRIECHEN BEI UNTERSCHIEDLICHEN BAUSTOFFEN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
          <div className="border-b border-home-grau/20 pb-3">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Scale className="text-shiraz" size={18} /> Kriechen bei unterschiedlichen Werkstoffen (Normative Kennwerte &amp; Mechanismen)
            </h3>
            <p className="text-xs text-text-main/70 mt-1">
              Kriechen tritt keineswegs nur bei Beton auf. Nahezu alle Festkörper zeigen unter Dauerlast viskoelastische Verformungen, 
              jedoch bei völlig unterschiedlichen Temperaturen, Zeiträumen und mikrophysikalischen Prozessen.
            </p>
          </div>

          {/* 6 Werkstoff-Karten für Kriechen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">

            {/* 1. Beton & Zementstein */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-shiraz text-sm">Beton &amp; Zementstein</span>
                  <span className="font-mono text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">EC2 / DIN EN 1992</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">
                  Kriechzahl <InlineMath math="\varphi(t, t_0) \approx 1{,}5 \text{ bis } 3{,}5" />
                </div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2">
                  <strong>Mechanismus:</strong> Gleiten der Schichtstrukturen in den Calciumsilicathydrat-Phasen (C-S-H) unter Wanderung des 
                  adsorbierten Zeolithwassers.
                </p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div>• <strong>Grundkriechen (Basic Creep):</strong> Unter Feuchteisolierung (reines Scherdehnen).</div>
                  <div>• <strong>Trocknungskriechen (Pickett-Effekt):</strong> Beschleunigtes Kriechen durch gleichzeitige Feuchteabgabe.</div>
                  <div>• <strong>Berechnungsansatz:</strong> <InlineMath math="E_{c,\text{eff}} = E_{cm} / (1 + \varphi)" /> führt zu 3-facher Plattendurchbiegung.</div>
                </div>
              </div>
            </div>

            {/* 2. Holz & Holzwerkstoffe */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-800 text-sm">Holz &amp; Holzwerkstoffe</span>
                  <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">EC5 / DIN EN 1995</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">
                  Verformungsbeiwert <InlineMath math="k_{\text{def}} = 0{,}60 \text{ bis } 2{,}00" />
                </div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2">
                  <strong>Mechanismus:</strong> Fließen der amorphen Lignin- und Hemicellulose-Matrix zwischen den hochfesten Cellulose-Fibrillen.
                </p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div>• <strong>Nutzungsklassen:</strong> NKL 1 (Innenraum): <InlineMath math="k_{\text{def}} = 0{,}60" />; NKL 2: <InlineMath math="k_{\text{def}} = 0{,}80" />; NKL 3 (Freiland): <InlineMath math="k_{\text{def}} = 2{,}00" />!</div>
                  <div>• <strong>Mechanosorptives Kriechen:</strong> Wechselnde Feuchtezyklen unter Last vervielfachen das Kriechmaß drastisch.</div>
                  <div>• <strong>Endverformung:</strong> <InlineMath math="u_{\text{fin}} = u_{\text{inst}} \cdot (1 + k_{\text{def}})" />.</div>
                </div>
              </div>
            </div>

            {/* 3. Mauerwerk */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-orange-700 text-sm">Mauerwerk &amp; Mörtel</span>
                  <span className="font-mono text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold">EC6 / DIN EN 1996</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">
                  Endkriechzahl <InlineMath math="\Phi_{\infty} \approx 0{,}5 \text{ bis } 3{,}0" />
                </div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2">
                  <strong>Mechanismus:</strong> Kriechverformungen finden fast ausschließlich in den kalk- und zementgebundenen 
                  Lagerfugen (Mörtelbett) statt; Steine selbst kriechen werkstoffabhängig.
                </p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div>• <strong>Mauerziegel (MZI):</strong> <InlineMath math="\Phi_{\infty} \approx 0{,}5 \text{ bis } 1{,}5" /> (geringes Kriechen).</div>
                  <div>• <strong>Kalksandstein (KS):</strong> <InlineMath math="\Phi_{\infty} \approx 1{,}0 \text{ bis } 2{,}0" />.</div>
                  <div>• <strong>Porenbeton (PB) &amp; Leichtbeton:</strong> <InlineMath math="\Phi_{\infty} \approx 1{,}5 \text{ bis } 3{,}0" />.</div>
                </div>
              </div>
            </div>

            {/* 4. Baustahl & Metalle */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 text-sm">Baustahl &amp; Metalle</span>
                  <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">EC3 / DIN EN 1993</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">
                  Raumtemperatur: <InlineMath math="\varphi \approx 0" /> | Brand: Hochtemperaturkriechen
                </div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2">
                  <strong>Mechanismus:</strong> Bei <InlineMath math="T < 0{,}3 \cdot T_m" /> (&lt; 350 °C) ist Kriechen von Stahl vernachlässigbar. 
                  Im Brandfall (<InlineMath math="T > 400-500^\circ\text{C}" />) klettern Versetzungen diffusionsgesteuert über Hindernisse.
                </p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div>• <strong>Phasen:</strong> 1. Primäres, 2. Stationäres (sekundäres), 3. Tertiäres Kriechen bis zum Kriechbruch.</div>
                  <div>• <strong>Spannstahl-Relaxation:</strong> Hochfeste Drähte/Litzen entspannen sich isotherm um 2,5–8 % unter Dauerspannung.</div>
                </div>
              </div>
            </div>

            {/* 5. Kunststoffe & Elastomere */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-purple-700 text-sm">Kunststoffe &amp; Polymere</span>
                  <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">DIN EN ISO 899</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">
                  Kriechmodul <InlineMath math="E_c(t) = \frac{\sigma_0}{\varepsilon(t)} \ll E_0" />
                </div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2">
                  <strong>Mechanismus:</strong> Polymerketten entknäueln und gleiten bereits bei <strong>Raumtemperatur (20 °C)</strong> aneinander ab, 
                  da viele Kunststoffe (PE, PP, PVC, EPDM) nahe ihrer Glasübergangstemperatur betrieben werden.
                </p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div>• <strong>Praxis:</strong> Rohre, Dichtungsbahnen, Elastomer-Brückenlager verlieren bis zu 70 % ihrer elastischen Steifigkeit!</div>
                  <div>• <strong>Auslegung:</strong> Nachweis muss stets mit dem zeitabhängigen Kriechmodul <InlineMath math="E_c(50\text{ a})" /> erfolgen.</div>
                </div>
              </div>
            </div>

            {/* 6. Boden & Glas / CFK */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-teal-800 text-sm">Böden &amp; Glas / CFK</span>
                  <span className="font-mono text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">EC7 / DIN 1054 / DIN 18008</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">
                  Boden: Sekundäre Setzung | Glas: <InlineMath math="\varphi = 0" />
                </div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2">
                  <strong>Boden:</strong> Nach Abschluss der primären Porenwasserkonsolidation gleiten Tonpartikel viskos weiter 
                  (Kriechbeiwert <InlineMath math="C_\alpha = \Delta e / \Delta \log t" />).
                </p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div>• <strong>Bauglas:</strong> Absolut kriechfrei bis 500 °C. Dauerlast führt zu statischer Ermüdung (unterkritisches Risswachstum).</div>
                  <div>• <strong>CFK:</strong> Kohlenstofffasern sind kriechfrei; Kriechzahl der Lamelle <InlineMath math="\varphi < 0{,}05" />.</div>
                </div>
              </div>
            </div>

          </div>

          {/* Übersichtstabelle Werkstoff-Kriechen */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/30">
                <tr>
                  <th className="p-2.5">Werkstoff</th>
                  <th className="p-2.5">Kriechneigung bei 20 °C</th>
                  <th className="p-2.5">Normativer Kennwert</th>
                  <th className="p-2.5">Mikrophysikalische Ursache</th>
                  <th className="p-2.5">Praxis-Relevanz im Bauwesen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20 text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-shiraz">Beton (C30/37)</td>
                  <td className="p-2.5 text-red-700 font-semibold">Sehr hoch</td>
                  <td className="p-2.5 font-mono">φ(∞, t0) ≈ 1,5 – 3,0 (EC2)</td>
                  <td className="p-2.5">Wasserumlagerung in C-S-H-Gelporen, Schichtenverschiebung</td>
                  <td className="p-2.5">Verdreifachung der Deckendurchbiegung, Stützensenkungen</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-800">Holz (C24)</td>
                  <td className="p-2.5 text-amber-700 font-semibold">Hoch (stark feuchteabhängig)</td>
                  <td className="p-2.5 font-mono">k_def = 0,6 bis 2,0 (EC5)</td>
                  <td className="p-2.5">Viskoelastisches Fließen von Lignin &amp; Hemicellulose, mechanosorptiv</td>
                  <td className="p-2.5">Große Dach- &amp; Deckendurchbiegungen, NKL-Abstufung maßgebend</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-orange-700">Mauerwerk</td>
                  <td className="p-2.5 text-orange-700 font-semibold">Mittel bis hoch</td>
                  <td className="p-2.5 font-mono">Φ_∞ ≈ 0,5 bis 3,0 (EC6)</td>
                  <td className="p-2.5">Mörtelfugenkriechen, Gesteinsleimstauchung (PB, KS)</td>
                  <td className="p-2.5">Setzungen in tragenden Wandpfeilern, Rissbildung an Deckenanschlüssen</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-800">Baustahl (S235/S355)</td>
                  <td className="p-2.5 text-slate-500 font-semibold">Keine (bei T &lt; 350 °C)</td>
                  <td className="p-2.5 font-mono">φ = 0 (EC3)</td>
                  <td className="p-2.5">Atomgitter stabil, Versetzungsklettern erst ab ca. 450 °C aktiviert</td>
                  <td className="p-2.5">Kriechsicher bei Raumklima; Versagen erst im Brandfall</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-purple-700">Kunststoffe (PE/PVC)</td>
                  <td className="p-2.5 text-red-700 font-semibold">Extrem hoch</td>
                  <td className="p-2.5 font-mono">Ec(t) = σ0 / ε(t) (ISO 899)</td>
                  <td className="p-2.5">Entknäuelung &amp; viskoses Gleiten der Makromolekülketten</td>
                  <td className="p-2.5">Ovalisierung von Kunststoffrohren, Nachlassen von Dichtpressung</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-teal-800">Ton- &amp; Schluffboden</td>
                  <td className="p-2.5 text-amber-700 font-semibold">Hoch (über Jahrzehnte)</td>
                  <td className="p-2.5 font-mono">C_α = Δe / Δlog t (EC7)</td>
                  <td className="p-2.5">Viskose Umlagerung von Tonmineralplättchen nach Konsolidation</td>
                  <td className="p-2.5">Langzeitsenkung von Großbauwerken (z. B. Frankfurter Hochhäuser)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-700">Bauglas</td>
                  <td className="p-2.5 text-emerald-700 font-semibold">Keine (φ = 0)</td>
                  <td className="p-2.5 font-mono">φ = 0 (DIN 18008)</td>
                  <td className="p-2.5">Amorphes Silicatnetzwerk starr unterhalb Tg (~530 °C)</td>
                  <td className="p-2.5">Keine Verformungszunahme; statische Ermüdung (Risswachstum)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* UMFASSENDE SYSTEMATIK ALLER SCHWINDARTEN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
          <div className="border-b border-home-grau/20 pb-3">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Activity className="text-shiraz" size={18} /> Systematik aller Schwindarten im Bauwesen &amp; der Baustoffkunde
            </h3>
            <p className="text-xs text-text-main/70 mt-1">
              Schwinden ist die lastunabhängige Volumenverminderung eines Baustoffs. Im Betonbau und in der Werkstoffkunde 
              wird nach Ursache, Zeitfenster, Feuchteverlauf und Schadensmechanismus zwischen <strong>sechs eigenständigen Schwindarten</strong> unterschieden.
            </p>
          </div>

          {/* Die 6 Schwindarten im Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">

            {/* 1. Frühschwinden */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-shiraz text-sm">1. Frühschwinden (Plastisches Schwinden)</span>
                  <span className="font-mono text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">0 – 24 h</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">Kapillarschwinden / Schrumpfen</div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5">
                  Verdunstet Wasser von der noch ungeschützten Frischbetonoberfläche schneller als Porenwasser durch Bluten nachsteigt 
                  (<InlineMath math="E > 0{,}5\text{ bis }1{,}0\text{ kg/(m}^2\text{h)}" /> durch Wind, Sonneneinstrahlung, trockene Luft), 
                  entstehen in den Kapillaren Menisken mit extremen <strong>Kapillarunterdrücken</strong>.
                </p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><strong>Schadensbild:</strong> Klaffende, unregelmäßige Risse im noch plastischen Gefüge (oft netzartig oder parallel über Bewehrungseisen).</div>
                  <div><strong>Gegenmaßnahmen:</strong> Unverzügliches Abdecken mit Folien, Curing-Filme, Wassernebel, PP-Fasern.</div>
                </div>
              </div>
            </div>

            {/* 2. Autogenes Schwinden */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-700 text-sm">2. Autogenes Schwinden</span>
                  <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">1 d – 28 d</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">Selbsttrocknungsschwinden</div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5">
                  Findet <strong>ohne jeden Feuchtigkeitsaustausch mit der Umwelt</strong> statt. Durch die fortschreitende chemische Hydratation 
                  des Zements wird das innere Kapillarwasser verbraucht. Die innere relative Porenfeuchte sinkt 
                  (<em>Self-Desiccation</em> auf &lt; 80 % RH), was das Gelgerüst zusammenzieht.
                </p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><strong>Relevanz:</strong> Extrem dominant bei dichten Hochleistungsbetonen, UHPC und Betonen mit sehr niedrigem <InlineMath math="w/z < 0{,}40" />.</div>
                  <div><strong>Gegenmaßnahmen:</strong> Innere Nachbehandlung (SAP – superabsorbierende Polymere, feuchte Blähton-Leichtsande).</div>
                </div>
              </div>
            </div>

            {/* 3. Trocknungsschwinden */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-blue-700 text-sm">3. Trocknungsschwinden</span>
                  <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Monate – Jahre</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">Klassisches Diffusionsschwinden</div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5">
                  Diffusionsbedingte Abgabe von physikalisch adsorbiertem Wasser aus den C-S-H-Gelporen an eine trockenere Umgebung 
                  bis zum thermodynamischen Feuchtegleichgewicht.
                </p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><strong>Größenordnung:</strong> Typisch <InlineMath math="\varepsilon_{\text{cd},\infty} \approx -0{,}30 \text{ bis } -0{,}60 \text{ ‰}" /> (0,3–0,6 mm/m).</div>
                  <div><strong>Einflussfaktoren:</strong> Relative Luftfeuchte <InlineMath math="RH" />, Bauteildicke <InlineMath math="h_0 = 2A_c / u" />, Zementleimvolumen.</div>
                </div>
              </div>
            </div>

            {/* 4. Karbonatisierungsschwinden */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-purple-700 text-sm">4. Karbonatisierungsschwinden</span>
                  <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">Jahre – Jahrzehnte</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">Chemische Reaktion mit atmosphärischem CO₂</div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5">
                  Reaktion von gasförmigem <InlineMath math="\text{CO}_2" /> mit Calciumhydroxid (Portlandit): 
                  <InlineMath math="\text{Ca(OH)}_2 + \text{CO}_2 \rightarrow \text{CaCO}_3 + \text{H}_2\text{O}" />. 
                  Trotz Calcit-Bildung führt die Auflösung tragender Portlanditkristalle und C-S-H-Umlagerung zu zusätzlicher irreversibler Kontraktion.
                </p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><strong>Besonderheit:</strong> Maximaler Effekt bei 50–70 % relativer Luftfeuchte. Vergrößert oberflächennahe Schwindspannungen um bis zu 30 %.</div>
                </div>
              </div>
            </div>

            {/* 5. Thermisches Schwinden */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-emerald-700 text-sm">5. Thermisches Schwinden</span>
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">1 d – 7 d</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">Abkühlungskontraktion nach Wärmespitze</div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5">
                  Die exotherme Zementhydratation setzt <InlineMath math="300-500\text{ kJ/kg}" /> Wärme frei (Bauteilkerne bis &gt; 60 °C). 
                  Beim anschließenden Auskühlen zieht sich der Beton zusammen: <InlineMath math="\Delta \varepsilon_{\text{th}} = \alpha_T \cdot \Delta T" />.
                </p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><strong>Rissursache:</strong> Bei <InlineMath math="\Delta T = 30\text{ K}" /> beträgt <InlineMath math="\Delta \varepsilon_{\text{th}} \approx -0{,}30 \text{ ‰}" /> – das Dreifache der Betonzugdehnung!</div>
                  <div><strong>Gegenmaßnahmen:</strong> LH-Zemente (CEM III), Frischbetonkühlung, Schalungsdämmung.</div>
                </div>
              </div>
            </div>

            {/* 6. Chemische Kontraktion */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 text-sm">6. Chemische Kontraktion</span>
                  <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">Molekulare Ebene</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">Le-Chatelier-Kontraktion</div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5">
                  Das spezifische Volumen der Hydratphasen (C-S-H, Portlandit, Ettringit) ist um ca. <strong>8 bis 10 Vol.-% kleiner</strong> als 
                  das summierte Ausgangsvolumen von Zementklinker und flüssigem Wasser.
                </p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><strong>Auswirkung:</strong> Vor dem Erstarren äußere Leimschrumpfung; nach dem Erstarren Entstehung von innerem Porenunterdruck und Ursprung des autogenen Schwindens.</div>
                </div>
              </div>
            </div>

          </div>

          {/* Übersichtstabelle */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/30">
                <tr>
                  <th className="p-2.5">Schwindart</th>
                  <th className="p-2.5">Zeitpunkt</th>
                  <th className="p-2.5">Feuchtefluss</th>
                  <th className="p-2.5">Physikalisch-chemischer Mechanismus</th>
                  <th className="p-2.5">Gegenmaßnahmen auf der Baustelle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20 text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-shiraz">Frühschwinden (Plastisch)</td>
                  <td className="p-2.5 font-mono">0–24 Stunden</td>
                  <td className="p-2.5">Wasserverlust nach außen</td>
                  <td className="p-2.5">Meniskenbildung in Kapillaren, Kapillardruck &gt; Zementleimzugfestigkeit</td>
                  <td className="p-2.5">Sofortiges Abdecken mit Folien, Curing-Film, PP-Fasern, Windschutz</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-700">Autogenes Schwinden</td>
                  <td className="p-2.5 font-mono">1–28 Tage</td>
                  <td className="p-2.5">Kein Feuchtefluss nach außen (isoliert)</td>
                  <td className="p-2.5">Selbsttrocknung durch chemischen Wasserverbrauch (w/z &lt; 0,40)</td>
                  <td className="p-2.5">Internal Curing (SAP, gesättigter Blähton), Schwindreduzierer (SRA)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-blue-700">Trocknungsschwinden</td>
                  <td className="p-2.5 font-mono">Monate bis Jahre</td>
                  <td className="p-2.5">Wasserabgabe an Umwelt</td>
                  <td className="p-2.5">Gelporenwasser-Diffusion bis zur Gleichgewichtsfeuchte</td>
                  <td className="p-2.5">Niedriger Zementleimgehalt, steife Gesteinskörnung, DIN EN 1992-1-1 Nachbehandlung</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-purple-700">Karbonatisierungsschwinden</td>
                  <td className="p-2.5 font-mono">Jahre</td>
                  <td className="p-2.5">CO₂-Aufnahme aus Luft</td>
                  <td className="p-2.5">Auflösung von Ca(OH)₂ und Umlagerung der C-S-H-Gelstruktur</td>
                  <td className="p-2.5">Dichtes Betongefüge, ausreichende Betondeckung c_nom nach DIN 1045-2</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-700">Thermisches Schwinden</td>
                  <td className="p-2.5 font-mono">1–7 Tage</td>
                  <td className="p-2.5">Wärmeabgabe nach außen</td>
                  <td className="p-2.5">Längenkontraktion beim Abkühlen des erhärteten Betons (Δε = αT · ΔT)</td>
                  <td className="p-2.5">LH-Zemente (CEM III/B), Schalungsdämmung (ΔT &lt; 15 K Kern-Schale)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-800">Chemische Kontraktion</td>
                  <td className="p-2.5 font-mono">Stunden bis Tage</td>
                  <td className="p-2.5">Innerer Prozess</td>
                  <td className="p-2.5">Le-Chatelier: Molvolumen Hydratphasen &lt; Molvolumen Klinker + Wasser</td>
                  <td className="p-2.5">Thermodynamisch nicht verhinderbar; steuert autogenes Schwinden</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Schwinden anderer Baustoffe: Holz, Ton, Metalle */}
          <div className="pt-2 border-t border-home-grau/20">
            <h4 className="text-xs font-bold text-text-main mb-2">
              Schwindverhalten bei anderen Werkstoffen (Holz, Ton &amp; Metalle):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-text-main/80">
              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-1">
                <div className="font-bold text-text-main">Holz (Hygroskopisches Schwinden):</div>
                <p className="text-[10px] leading-relaxed">
                  Tritt ausschließlich <strong>unterhalb des Fasersättigungsbereichs</strong> (<InlineMath math="u_{\text{FS}} \approx 28-32\,\%" />) auf. 
                  Extrem anisotrop:
                </p>
                <div className="font-mono text-[10px] text-slate-700">
                  • Längs zur Faser: α_l ≈ 0,1 – 0,3 % (vernachlässigbar)<br />
                  • Radial (Jahrringe quer): α_r ≈ 3 – 5 %<br />
                  • Tangential (Jahrringe längs): α_t ≈ 6 – 10 % (Rissursache!)
                </div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-1">
                <div className="font-bold text-text-main">Mauerziegel &amp; Lehm:</div>
                <p className="text-[10px] leading-relaxed">
                  <strong>Tonschwinden:</strong> Wasserfilme zwischen den Schichtgittermineralen (Montmorillonit, Illit) verdunsten. 
                  Ungebrannter Lehm schwindet um 2–8 %. Gebrannte Ziegel schwinden nicht mehr, sondern zeigen stattdessen langfristiges <strong>Feuchtequellen</strong>!
                </p>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-1">
                <div className="font-bold text-text-main">Metalle &amp; Polymere:</div>
                <p className="text-[10px] leading-relaxed">
                  <strong>Erstarrungsschrumpf:</strong> Phasenübergang flüssig zu fest (Gießereitechnik, Stahlguss ca. 1–2 %). 
                  Im Festkörper existiert nur rein <strong>thermisches Schwinden/Dehnen</strong> (<InlineMath math="\Delta L = L_0 \cdot \alpha_T \cdot \Delta T" />).
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
}
