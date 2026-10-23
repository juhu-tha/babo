import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  History, 
  Sparkles, 
  Layers, 
  Activity, 
  Compass, 
  Wind,
  Droplet,
  Dumbbell,
  Waves,
  Mountain,
  Anchor,
  BookOpen
} from 'lucide-react';

export default function Kuriositaeten() {
  const [activeCurioTab, setActiveCurioTab] = useState<'pantheon' | 'burjkhalifa' | 'eiffel' | 'olympia' | 'uhpc' | 'selfhealing' | 'reinforcement' | 'giantconcrete' | 'gotthard' | 'seawater'>('pantheon');

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* HEADER WITH INTRO */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm" id="curio-header">
        <div className="flex items-center gap-3 mb-3">
          <History className="text-shiraz" size={28} />
          <h2 className="text-2xl font-sans font-bold tracking-tight text-slate-900">
            Bautechnische Meilensteine &amp; Historische Werkstoffkunde
          </h2>
        </div>
        <p className="text-sm text-slate-650 leading-relaxed max-w-4xl">
          Wissenschaftliche Aufbereitung baustofflicher und tragwerkstechnischer Meilensteine. Diese Dokumentation analysiert werkstoffphysikalische, chemische und statische Beanspruchungszustände anhand detaillierter ingenieurwissenschaftlicher Kennwerte und Berechnungsmodelle.
        </p>

        {/* NAVIGATION FOR REKORDE / KURIOSITÄTEN */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2 mt-6 p-1.5 bg-slate-100 rounded-xl border border-slate-200" id="curio-navigation">
          <button
            onClick={() => setActiveCurioTab('pantheon')}
            className={`px-2 py-2.5 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              activeCurioTab === 'pantheon'
                ? 'bg-shiraz text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60 hover:text-shiraz'
            }`}
          >
            <Compass size={16} />
            <span className="truncate w-full text-[11px]">Pantheon-Kuppel</span>
          </button>

          <button
            onClick={() => setActiveCurioTab('burjkhalifa')}
            className={`px-2 py-2.5 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              activeCurioTab === 'burjkhalifa'
                ? 'bg-shiraz text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60 hover:text-shiraz'
            }`}
          >
            <Droplet size={16} />
            <span className="truncate w-full text-[11px]">Burj Khalifa Rheologie</span>
          </button>

          <button
            onClick={() => setActiveCurioTab('eiffel')}
            className={`px-2 py-2.5 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              activeCurioTab === 'eiffel'
                ? 'bg-shiraz text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60 hover:text-shiraz'
            }`}
          >
            <Layers size={16} />
            <span className="truncate w-full text-[11px]">Eiffelturm-Stahl</span>
          </button>

          <button
            onClick={() => setActiveCurioTab('olympia')}
            className={`px-2 py-2.5 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              activeCurioTab === 'olympia'
                ? 'bg-shiraz text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60 hover:text-shiraz'
            }`}
          >
            <Wind size={16} />
            <span className="truncate w-full text-[11px]">Olympiadach Seilnetz</span>
          </button>

          <button
            onClick={() => setActiveCurioTab('uhpc')}
            className={`px-2 py-2.5 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              activeCurioTab === 'uhpc'
                ? 'bg-shiraz text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60 hover:text-shiraz'
            }`}
          >
            <Sparkles size={16} />
            <span className="truncate w-full text-[11px]">UHPC-Gefüge</span>
          </button>

          <button
            onClick={() => setActiveCurioTab('selfhealing')}
            className={`px-2 py-2.5 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              activeCurioTab === 'selfhealing'
                ? 'bg-shiraz text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60 hover:text-shiraz'
            }`}
          >
            <Activity size={16} />
            <span className="truncate w-full text-[11px]">Römische Rissheilung</span>
          </button>

          <button
            onClick={() => setActiveCurioTab('reinforcement')}
            className={`px-2 py-2.5 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              activeCurioTab === 'reinforcement'
                ? 'bg-shiraz text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60 hover:text-shiraz'
            }`}
          >
            <Dumbbell size={16} />
            <span className="truncate w-full text-[11px]">Verbund Monier</span>
          </button>

          <button
            onClick={() => setActiveCurioTab('giantconcrete')}
            className={`px-2 py-2.5 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              activeCurioTab === 'giantconcrete'
                ? 'bg-shiraz text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60 hover:text-shiraz'
            }`}
          >
            <Waves size={16} />
            <span className="truncate w-full text-[11px]">Massenbeton Talsperre</span>
          </button>

          <button
            onClick={() => setActiveCurioTab('gotthard')}
            className={`px-2 py-2.5 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              activeCurioTab === 'gotthard'
                ? 'bg-shiraz text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60 hover:text-shiraz'
            }`}
          >
            <Mountain size={16} />
            <span className="truncate w-full text-[11px]">Gotthard Spritzbeton</span>
          </button>

          <button
            onClick={() => setActiveCurioTab('seawater')}
            className={`px-2 py-2.5 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              activeCurioTab === 'seawater'
                ? 'bg-shiraz text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60 hover:text-shiraz'
            }`}
          >
            <Anchor size={16} />
            <span className="truncate w-full text-[11px]">Seekais Antik</span>
          </button>
        </div>
      </div>

      {/* CORE CONTENT LAYOUTS WITHOUT CALCULATORS */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[450px]" id="curio-content">
        
        {/* 1. PANTHEON ROM */}
        {activeCurioTab === 'pantheon' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🏛️</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Tragwerksanalyse des Kuppeltragwerks aus unbewehrtem Opus Caementicium — Pantheon zu Rom
                </h3>
                <p className="text-xs text-slate-550 font-mono">
                  Errichtungszeitraum: ca. 118–128 n. Chr. | Innendurchmesser: 43,30 m | Hauptwerkstoff: Opus Caementicium
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p>
                  Das Pantheon besitzt die bis heute weitestgespannte Kuppel aus unbewehrtem Beton. Mangels einer tragfähigen Zugbewehrung zur Aufnahme auftretender Ringzugspannungen beruht die Stabilität dieses Schalentragwerks maßgeblich auf einer gezielten Geometrieoptimierung und einer systematischen Rohwichteabstufung der eingesetzten Baustoffe.
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Werkstofftechnische Maßnahme: Densitätsgradierung</h4>
                  <p className="text-xs text-slate-650">
                    Die Zusammensetzung des römischen Betons (<strong>Opus Caementicium</strong>) wurde höhenabhängig graduiert. Während im Fundament- und Wandbereich hochdichte Zuschlagstoffe wie Travertin und Basaltbruch verwendet wurden, kamen im Bereich der Kuppelschale schrittweise leichtere Materialien (Tuffschutt, Ziegelbruch, Bimssand) zum Einsatz. Dies drosselt die wirkenden Trägheits- und Eigengewichtslastvektoren signifikant.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><strong>Dichte-Stufen der historischen Zuschlagsstoffe:</strong></p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-650 font-mono text-[11px]">
                    <li><strong>Kuppelbasis:</strong> Travertin &amp; Basalt (Rohwichte ≈ 2.200 - 2.400 kg/m³)</li>
                    <li><strong>Mittlere Ringsegmente:</strong> Ziegelbruch &amp; Tuffstein (Rohwichte ≈ 1.600 - 1.800 kg/m³)</li>
                    <li><strong>Kuppelkrone (Oculushöhe):</strong> Bimsstein &amp; vulkanische Aschen (Rohwichte ≈ 900 - 1.350 kg/m³)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /> Rechnerische Abschätzung der Eigenlastentlastung
                  </span>
                  <p className="text-xs text-slate-650">
                    Lehrmodell mit vereinfachten Annahmen (Volumen und Dichten gerundet, keine Bauwerksmessung): Wie stark senkt die nach oben leichter werdende Zuschlagstufung die Eigenlast?
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold">1. REF-MODELL: HOMOGENE DICHTE (BASALT):</div>
                    <div className="text-slate-600">Angenommenes Kuppelvolumen: V ≈ 4.500 m³</div>
                    <div className="text-slate-600">Referenzdichte (Basaltbeton): ρ = 2.400 kg/m³</div>
                    <div className="text-slate-800 font-bold">Gesamteigenlast: G = V × ρ = 10.800 t</div>
                    <div className="text-red-650 text-[11px] leading-tight mt-1">
                      Mechanischer Hintergrund: In einer Kuppelschale entstehen im unteren Bereich Ringzugkräfte, die der unbewehrte römische Beton kaum aufnehmen kann. Je geringer die Eigenlast im Scheitelbereich, desto kleiner diese Zugkräfte.
                    </div>

                    <div className="border-t border-slate-200 my-2 pt-2 text-emerald-800 font-bold">2. IST-MODELL: UNIFORME GRADIENTENSTUFUNG:</div>
                    <div className="text-slate-600">Volumenanteilige Massenberechnung:</div>
                    <ul className="list-disc pl-4 text-slate-600 text-[11px]">
                      <li>Unteres Drittel (1.500 m³ @ 2.400 kg/m³) = 3.600 t</li>
                      <li>Mittleres Drittel (1.500 m³ @ 1.600 kg/m³) = 2.400 t</li>
                      <li>Oberes Segment (1.500 m³ @ 950 kg/m³) = 1.425 t</li>
                    </ul>
                    <div className="text-slate-850 font-bold">Effektive Strukturmasse: G_real ≈ 7.425 t</div>
                    <div className="text-emerald-700 font-bold block text-[11px] mt-1">
                      Resultierende Massereduktion: {formatDeZahl(((10800 - 7425) / 10800 * 100), 1)}% (≈ 3.375 t Entlastung)
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 italic">
                    Die Kuppel weist tatsächlich meridionale Risse auf; sie trägt seitdem im Wesentlichen als Folge von Druckbögen auf den massiven Ring. Die leichte Scheitelzone und die Stufenringe am Fuß sind entscheidend dafür, dass sie seit rund 1.900 Jahren steht.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. BURJ KHALIFA */}
        {activeCurioTab === 'burjkhalifa' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🏢</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Rheologische Optimierung zur Hochdruck-Frischbetonförderung am Burj Khalifa
                </h3>
                <p className="text-xs text-slate-550 font-mono">
                  Pumprekord: 2008 | Vertikale Förderhöhe: 606 m (Putzmeister BSA 14000 SHP-D) | Werkstoff: hochfester Pumpbeton
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p>
                  Die vertikale Betonförderung beim Bau des Burj Khalifa repräsentiert einen rheologischen Grenzbereich. Zur Realisierung der vertikalen Distanz von 606 m in einem kontinuierlichen Pumpprozess bedurfte es einer präzise abgestimmten Transport- und Erstarrungskinematik des Werkstoffs unter ariden Klimabedingungen.
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Problemstellung: Strömungsreibung &amp; Hydratationswärme</h4>
                  <p className="text-xs text-slate-650">
                    Bei signifikanten Steighöhen akkumulieren hohe hydrostatische Drücke in den Rohrleitungen, überlagert durch wandreibungsbedingten hydrodynamischen Widerstand. Umgebungsbedingungen von über 30 °C beschleunigen gleichzeitig die Hydratation des Zements, was zu einem frühzeitigen Viskositätsanstieg (Versteifen) führt und Totalblockaden (Rohrstopfen) provozieren kann.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><strong>Eingesetzte verfahrens- und werkstofftechnologische Maßnahmen:</strong></p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-650 [list-style-type:square]">
                    <li><strong>Thermodynamische Steuerung mittels Schuppeneis:</strong> Substitution eines definierten Teiles des Zugabewassers durch kryogenes Schuppeneis, um die Frischbetontemperatur trotz hoher Lufttemperaturen deutlich abzusenken; betoniert wurde zudem bevorzugt nachts.</li>
                    <li><strong>Fließmitteloptimierung (Polycarboxylatether, PCE):</strong> Der Einsatz spezieller PCE-Fließmittel induziert sterische und elektrostatische Abstoßungskräfte zwischen den Binderpartikeln, was die Fließgrenze minimiert.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /> Ermittlung des Arbeitsförderdrucks am Fuss der Steigleitung
                  </span>
                  <p className="text-xs text-slate-650">
                    Lehrrechnung (der Reibungsbeiwert ist eine Annahme): Der Förderdruck setzt sich aus hydrostatischem Anteil und Rohrreibung zusammen:
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold">RECHNERISCHE DRUCKPROJEKTION (H = 606 m):</div>
                    <div className="text-slate-600">Förderhöhe H = 606 m; Dichte ρ = 2.400 kg/m³</div>
                    <div className="text-slate-600">Beschleunigungskonstante g = 9,81 m/s²</div>
                    <div className="text-slate-700 font-bold">1. Hydrostatischer Druckanteil P_hydro:</div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3">
                      P_hydro = (ρ × g × H) / 100.000 = 142,7 bar
                    </div>
                    <div className="text-slate-700 font-bold mt-2">2. Hydrodynamischer Reibungsdruckverlust P_reibung:</div>
                    <div className="text-slate-600">
                      Angenommener spezifischer Reibungsverlust im Förderrohr (Δp ≈ 0,11 bar/m):
                    </div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3">
                      P_reibung ≈ 606 m × 0,11 bar/m = 66,7 bar
                    </div>
                    <div className="text-slate-700 font-bold mt-2">3. Erforderlicher Arbeitsbetriebsdruck an der Pumpenkupplung:</div>
                    <div className="text-slate-900 font-bold text-sm text-[13px]">
                      P_gesamt = P_hydro + P_reibung = 209,4 bar
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 italic leading-snug">
                    Drücke dieser Größenordnung erfordern Hochdruck-Förderleitungen und eine Betonrezeptur, die über die gesamte Förderzeit pumpbar bleibt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. EIFFELTURM */}
        {activeCurioTab === 'eiffel' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🗼</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Gefügeanalyse und Korrosionsverhalten von historischem Puddeleisen am Eiffelturm
                </h3>
                <p className="text-xs text-slate-550 font-mono">
                  Errichtung: 1889 | Konstruktionswerkstoff: Puddeleisen (Schweißeisen) | Korrosionsbarriere: Anisotrope Silikatschlackefaseradern
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p>
                  Obwohl die Tragkonstruktion des Eiffelturms in Paris vollständig aus Schweißeisen besteht und seit über 135 Jahren der städtischen Atmosphäre ausgesetzt ist, weist das Tragwerk eine bemerkenswerte Langlebigkeit auf. Dies wird maßgeblich auf eine werkstoffspezifische metallurgische Barrierewirkung zurückgeführt: die unvollständig ausgetragene Silikatschlacke des <strong>Puddeleisens</strong>.
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Einfluß silikatischer Phaseneinschlüsse auf das Korrosionsverhalten</h4>
                  <p className="text-xs text-slate-650">
                    Beim heute weitgehend durch Sauerstoffblasverfahren ersetzten Puddelprozess (Frischen) wurde silikatische Schlacke im Eisenwerkstoff physikalisch eingeschlossen. Der nachfolgende Schmiede- und Walzvorgang richtete diese Schlackefilme planar in Extrusionsrichtung aus. Es entstanden mikroskopische, fadenförmige Schlackeadern im metallischen Matrixgefüge.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><strong>Mechanismus der elektrochemischen Korrosionshemmung:</strong></p>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                    Eindringende Oxidationsfronten (Sauerstoff- und Feuchtigkeitsradikale) treffen unmittelbar auf die inerten Silikatschichten. Die geometrisch anisotrope Ausrichtung dieser Phaseneinschlüsse blockiert den ungerichteten, dreidimensionalen Korrosionspfad senkrecht zur Oberfläche. Korrosionsphänomene bleiben dadurch auf oberflächennahe, plane Schichten limitiert.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /> Masserechnerische Abschätzung des Korrosionseffekts
                  </span>
                  <p className="text-xs text-slate-650">
                    Vergleichende Analyse des theoretischen versus effektiven Materialabtrags unter atmosphärischer Exposition:
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold">THEORETISCHER MASSENVERLUST (UNGESCHÜTZT):</div>
                    <div className="text-slate-650">Eisenfachwerkmasse: m_0 ≈ 7.300 t</div>
                    <div className="text-slate-650">Exponierte Außenfläche: A_exp ≈ 250.000 m²</div>
                    <div className="text-slate-650">Abtragsrate unlegierter Stahl, Kategorie C3 (DIN EN ISO 9223, erstes Jahr): bis ca. 0,05 mm/a</div>
                    
                    <div className="text-slate-700 font-bold border-t pt-2">Schadensausmaß nach 135 Jahren ohne Instandhaltung:</div>
                    <div className="text-red-650 leading-snug">
                      Lineare Hochrechnung als obere Abschätzung: Δd = 135 a × 0,05 mm/a ≈ 6,8 mm je Oberfläche (tatsächlich nimmt die Rate mit der Zeit ab).
                      Bei den dünnwandigen Profilen des Fachwerks wäre ein solcher Querschnittsverlust tragwerksrelevant.
                    </div>

                    <div className="text-emerald-800 font-bold border-t pt-2">Einfluss zyklischer Oberflächenbeschichtungen:</div>
                    <div className="text-slate-650 leading-snug">
                      Der Anstrich wird etwa alle 7 Jahre von Hand erneuert. Er ist – zusammen mit dem Schlackegefüge des Schweißeisens – der Hauptgrund für die lange Lebensdauer.
                    </div>
                    <div className="text-emerald-700 font-bold text-[11px] leading-tight mt-1">
                      Fazit: Regelmäßige Instandhaltung des Korrosionsschutzes ist wirksamer als jede Werkstoffreserve.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. OLYMPIASTADION */}
        {activeCurioTab === 'olympia' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🎪</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Tragwerksverhalten und Formfindung weitgespannter Seilnetztragwerke am Olympiadach München
                </h3>
                <p className="text-xs text-slate-550 font-mono">
                  Baujahr: 1972 | Entwurf: Behnisch &amp; Partner mit Frei Otto; Tragwerksplanung: Leonhardt und Andrä | Tragsystem: antiklastisch gekrümmtes Seilnetz
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p>
                  Das Zeltdach des Olympiastadions München repräsentiert ein wegweisendes extrem weitgespanntes Flächentragwerk. Das statische Gleichgewicht unter externen Beanspruchungen wird nicht durch biegesteife Konstruktionselemente erbracht, sondern durch die geometrisch nichtlineare, entgegengesetzte Krümmung mechanisch hochgradig vorgespannter Stahlseile.
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Numerische Formfindung mittels Seifenhaut-Gleichwertigkeit</h4>
                  <p className="text-xs text-slate-650">
                    Die Bestimmung der geometrischen Form beruhte historisch auf mechanischen Analogiemodellen (Seifenhautexperimente nach Frei Otto). Da Seifenhäute aufgrund molekularer Oberflächenwirkungen stets den Zustand einer geometrischen Minimalfläche einnehmen, spannen sie sich kräftefrei auf. Diese antiklastichen Formen (<strong>hyperbolische Paraboloide</strong>) wurden rechnerisch erfasst und auf orthogonale Seilgitter übertragen.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><strong>Tragprinzip der Antiklasticität (Sattelkrümmung):</strong></p>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                    Der räumliche Verlauf teilt sich in Tragseile (mit konkaver Krümmung zur Ableitung von Gravitationslasten wie Schnee) und orthogonale Spannseile (mit konvexer Krümmung zum Abtrag dynamischer Windsogeffekte). Die Aufprägung einer definierten Vorspannlast verleiht dem geometrisch schlaffen Seilnetz die elastische Formstabilität, die zur Einhaltung der Verformungsgrenzwerte im Sturmfall zwingend nötig ist.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /> Rechnerische Abschätzung der aerodynamischen Windwirkungen
                  </span>
                  <p className="text-xs text-slate-650">
                    Zur Beurteilung des globalen Formstabilitätszustandes wird die Windlastbelastung bei einer Orkanströmung von v = 120 km/h angesetzt:
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold">AERODYNAMISCHES LASTMODELL:</div>
                    <div className="text-slate-600">Strömungsgeschwindigkeit v = 120 km/h ≈ 33,3 m/s</div>
                    <div className="text-slate-600">Luftdichte ρ_luft = 1,25 kg/m³</div>
                    <div className="text-slate-700 font-bold mt-2">1. Geschwindigkeitsdruck q gemäß Strömungsmechanik:</div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]">
                      q = 0,5 × ρ_luft × v² = 0,5 × 1,25 × (33,3)² = 693 N/m² (≈ 0,69 kN/m²)
                    </div>
                    <div className="text-slate-750 font-bold mt-2">2. Einwirkende Linienlast F_sog an kritischen Randsektionen:</div>
                    <div className="text-slate-600">
                      Lehrrechnung mit angenommener Einflussbreite von 38,5 m (ohne Druckbeiwerte):
                    </div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]">
                      F_sog ≈ q × L_einfluß = 0,69 kN/m² × 38,5 m = 26,6 kN/m
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 italic leading-snug">
                    Die Vorspannung des Seilnetzes verhindert, dass Seile unter Windsog schlaff werden, und begrenzt Verformungen und Schwingungen – wichtig für die punktgehaltenen Acrylglasplatten der Eindeckung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. ULTRA-HOCHFESTER BETON (UHPC) */}
        {activeCurioTab === 'uhpc' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🧪</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Gefüge-Engineering und Tragmechanismen bei ultrahochfestem Beton (UHPC)
                </h3>
                <p className="text-xs text-slate-550 font-mono">
                  Technologischer Entwicklungsstand | Druckfestigkeitsbereich: &gt; 150 bis 250 MPa | Transportmechanismus: Packungsdichteoptimierung
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p>
                  Gewöhnlicher Normalbeton weist charakteristische Zylinderdruckfestigkeiten im Bereich von f_ck ≈ 20 bis 40 MPa auf. Durch systematische Optimierung der inneren Gefügedichte stieg das Leistungsspektrum moderner zementgebundener Werkstoffe signifikant an: <strong>Ultrahochfester Beton (UHPC)</strong> weist materialspezifische Druckfestigkeiten im Bereich von f_ck &gt; 200 MPa auf, was die Leistungskorridore struktureller Stahlkomponenten erreicht.
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Physikalische Füllwirkung &amp; puzzolanische Aktivität von Silikastaub</h4>
                  <p className="text-xs text-slate-650">
                    Das primäre Wirkprinzip von UHPC beruht auf der Minimierung des kapillaren und gelspezifischen Porenvolumens. Durch den gezielten Einsatz von ultrafeinem Silikastau (Silica Fume, Partikelgröße d ≈ 0,1 µm, somit ca. Faktor 100 unterhalb der mittleren Zementkorngröße) gelingt eine dichte Packungsoptimierung des Korngerüsts. Zudem wird der effektive Wasserbindemittelwert (w/b-Wert) auf Quoten unter v_wb ≈ 0,18 gedrosselt.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><strong>Rissüberbrückungsverhalten mittels Mikrostahlfaser-Dispersionsbewehrung:</strong></p>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                    Da UHPC infolge des dichten Werkstoffgefüges ein ausgeprägtes sprödes Versagensverhalten aufweist, ist die Zugabe einer dispersen Faserbewehrung (üblich etwa 1 bis 3 Vol.-% hochfeste Mikrostahlfasern) zur Duktilitätssteigerung erforderlich. Bei Rissentstehung aktivieren sich die Reibungs- und Verankerungskräfte der Fasern an den Bruchflanken, wodurch ein quasiduktiles Nachrisszugsverhalten erzielt wird.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /> Komparative statische Querschnittsbemessung
                  </span>
                  <p className="text-xs text-slate-650">
                    Vereinfachter Lehrvergleich (nur Betonquerschnitt, ohne Bewehrung und Stabilität) für eine zentrisch gedrückte Stütze mit N_Ed = 5.000 kN:
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold">1. REF-MODELL: CO-DESIGN NORMALBETON (C30/37):</div>
                    <div className="text-slate-650">Bemessungswert f_cd = 0,85 × 30 / 1,5 = 17,0 MPa (DIN EN 1992-1-1/NA)</div>
                    <div className="text-slate-650">Erforderliche geometrische Querschnittsfläche A_req:</div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]">
                      A = N_Ed / f_cd = 5.000.000 N / 17 N/mm² ≈ 294.000 mm²
                    </div>
                    <div className="text-slate-800 font-bold">Erforderlicher Kreisdurchmesser: d_0 ≈ 61 cm</div>

                    <div className="text-emerald-800 font-bold border-t pt-2">2. VERGLEICH: UHPC (f_ck = 150 MPa):</div>
                    <div className="text-slate-650">Bemessungswert f_cd = 0,85 × 150 / 1,5 = 85,0 MPa (gleiche Beiwerte angenommen; maßgebend ist die DAfStb-Richtlinie für UHFB)</div>
                    <div className="text-slate-650">Erforderliche geometrische Querschnittsfläche A_uhpc:</div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]">
                      A_uhpc = 5.000.000 N / 85 N/mm² ≈ 58.800 mm²
                    </div>
                    <div className="text-emerald-700 font-bold">Erforderlicher Kreisdurchmesser: d_uhpc ≈ 27 cm</div>
                  </div>
                  <p className="text-xs text-slate-650 italic">
                    Die erforderliche Querschnittsfläche sinkt um rund 80 %. Das ermöglicht hochpräzise, schlanke Geometrien im Hochbau, erfordert jedoch eine detaillierte Nachweisführung hinsichtlich der elastischen Stabilität (Knickversagen).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. RÖMISCHER SELBSTHEILUNGSBETON */}
        {activeCurioTab === 'selfhealing' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🐚</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Kristalline Reaktivität und autogene Bruchheilung in antikem Opus Caementicium
                </h3>
                <p className="text-xs text-slate-550 font-mono">
                  Mineralogischer Befund | Reaktionsaktivator: Ungelöschte Branntkalkaggregate (Lime Clasts) | Phasenkristallisation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p>
                  Das unbewehrte Opus Caementicium antiker römischer Ingenieurbauwerke zeugt von jahrtausendelanger mechanischer Integrität. Neuere werkstoffanalytische Befunde führen diese Alterungsbeständigkeit auf ein hochreaktives mineralisches Depot zurück: Millimetergroße, hochalkalische Kalkklumpen (<strong>Lime Clasts</strong>), die als reaktionsbereite Clusterelemente im Puzzolan-Matrixgefüge wirken und eine autogene Rissheilung induzieren.
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Verfahrenstechnisches Prinzip des "Heißmischens" (Hot Mixing)</h4>
                  <p className="text-xs text-slate-650">
                    Die Entstehung dieser reaktiven Gefügemorphologie gründet auf das direkte Einmischen von hochreaktivem ungelöschtem Branntkalk (Calciumoxid, CaO) in Kombination mit vulkanischem Puzzolanstaub unter stark exothermen Hydratationsbedingungen (Heißmischprozess). Dies verhindert das vollständige Hydratisieren des Kalks während der Erstansteifung und sichert die Einbettung von Calciumdepots.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><strong>Mehrstufige reaktive Verschlusskinematik:</strong></p>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                    Bei mikroskopischen Gefügerissen wird Feuchtigkeit kapillar in den Rissquerschnitt gesogen. Trifft das Wasser auf die darin exponierten Branntkalkclastporen, initiiert dies eine unmittelbare stoffliche Auflösung und Kalziumsättigung der Porenlösung. Durch Einzug carbonathaltigen Porenwassers kristallisiert Calcit bzw. Aragonit (CaCO3) stabil aus, was den mechanischen Querschnittswiederverschluss bewirkt.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /> Stöchiometrische Reaktionsmechanik
                  </span>
                  <p className="text-xs text-slate-650">
                    Formelmäßige Darstellung der hydratphasengestützten Aragonit-Präzipitation im Gefügerisskanal:
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-3 font-mono text-xs">
                    <div className="text-shiraz font-bold">REAKTIONSKINETIK (CaO-Puffer):</div>
                    <div>
                      <span className="text-slate-700 font-bold block">1. Auflösungsphase am feuchten Rissgrund:</span>
                      <code className="text-[11px] block bg-slate-50 p-1 border rounded text-slate-800 my-1">
                        CaO + H_2O → Ca(OH)_2 (aq) [Löschen des Kalks]
                      </code>
                    </div>
                    <div>
                      <span className="text-slate-700 font-bold block">2. Phasenfällung durch atmosphärische Carbonatisierung:</span>
                      <code className="text-[11px] block bg-slate-50 p-1 border rounded text-slate-800 my-1">
                        Ca(OH)_2 + CO_2 → CaCO_3 ↓ (s) + H_2O [Calcitpräzipitation]
                      </code>
                    </div>
                    <div className="border-t pt-2 space-y-1">
                      <div className="text-slate-650 font-bold">Wirksamkeitsspektrum der Gefügeselbstheilung:</div>
                      <div className="text-emerald-800 text-[11px]">
                        Im Versuch von Seymour et al. (Science Advances, 2023) waren Risse in heiß gemischten Proben mit Kalkklasten nach etwa <strong>zwei Wochen</strong> wasserdicht verheilt; Vergleichsproben ohne Branntkalk heilten nicht.
                      </div>
                      <div className="text-slate-600 text-[10px] italic leading-tight mt-1">
                        Zum Vergleich: Bei üblichem Portlandzementbeton ist eine autogene Selbstheilung nur für sehr feine Risse (Größenordnung 0,1 bis 0,2 mm) und unter Wasserzutritt zu erwarten.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. VERBUNDQUERSCHNITT MONIER */}
        {activeCurioTab === 'reinforcement' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">💪</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Phasenkopplung und werkstoffphysikalische Verbundwirkung des Stahlbetonquerschnitts
                </h3>
                <p className="text-xs text-slate-550 font-mono">
                  Geschichtliche Evolution: ab 1867 | Erstanmeldung: Gärtnerpatent Joseph Monier | mechanischer Verbundwirkungsgrad
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p>
                  Joseph Moniers Entwicklung des bewehrten Verbundquerschnitts entsprang dem Erfordernis, rissanfällige zementgebundene Pflanzgefäße gegen Schwind- und Zugbeanspruchungen zu stabilisieren. Die Integration eines orthogonal geflochtenen Eisendrahtgerüsts in die nasse Mörtelmatrix begründete den mechanischen und bauphysikalischen Verbundwerkstoff.
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Physikalische Koinzidenz: Die thermo-mechanische Abstimmung</h4>
                  <p className="text-xs text-slate-650">
                    Die dauerhafte Integrität eines Stahlbetonverbundquerschnitts unter variierenden Umweltspannungen beruht auf der fast identischen Ausprägung des <strong>thermischen Längenausdehnungskoeffizienten (α_t)</strong> beider Systempartner:
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 font-mono text-[11px]">
                  <p className="font-sans font-bold text-slate-800">Vergleich der Ausdehnungskoeffizienten im System:</p>
                  <div>• Festigkeitsrelevanter Bewehrungsstahl: α_t ≈ 12,0 &times; 10⁻⁶ K⁻¹</div>
                  <div>• Erhärteter Hydratphasenzementstein: α_t ≈ 10,0 bis 13,0 &times; 10⁻⁶ K⁻¹</div>
                  <p className="font-sans text-slate-650 text-[11px] mt-2">
                    Dadurch expandieren und kontrahieren die Werkstoffe in weiten Temperaturbereichen (von Frostzyklen bis zu extremer Sonnenstrahlung) synchron. Thermische Eigenspannungen an den Werkstoffgrenzflächen werden so minimiert, was mechanischen Verbundverlusten wirksam vorbeugt.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /> Beanspruchungsverhalten im Zustand II (Risszustand)
                  </span>
                  <p className="text-xs text-slate-650">
                    Beton besitzt eine geringe werkstoffspezifische Zugfestigkeit (f_ctk ≈ 10% der Druckfestigkeit f_ck). Im Zustand II wird die Lastverteilung grundlegend reallokiert:
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs text-slate-750">
                    <div className="text-shiraz font-bold">MECHANISCHER ZUSTAND II (Biegezugzone):</div>
                    <div className="text-slate-600">
                      Unter Überschreitung der Zugrissgrenze f_ctm reißt die Biegezugzone gezielt auf. Nach der Dekompressionsphase übernimmt die Stahleinlage durch Reibungsverbund- und Rippenformschluss die gesamten Biegezugspannungen des Biegungstragwerks.
                    </div>
                    
                    <div className="bg-slate-50 p-2 rounded text-[11px] leading-relaxed italic border mt-2">
                      <strong>Werkstoff-Parameter:</strong> Ein planmäßiges Rissbildungsmuster im Zustand II ist kennzeichnend für funktionsfähige Biegedesignelemente im Stahlbetonbau. Ein rissfreier Zugbereich würde auf eine grob unwirtschaftliche Überdimensionierung und mangelnde Materialauslastung verweisen.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. DREI-SCHLUCHTEN-TALSPERRE */}
        {activeCurioTab === 'giantconcrete' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🌊</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Thermisches Beanspruchungsverhalten und Hydratationssteuerung im Massenbeton der Drei-Schluchten-Talsperre
                </h3>
                <p className="text-xs text-slate-550 font-mono">
                  Fertigstellung: Staumauer 2006, Gesamtanlage 2012 | Betonvolumen: rund 27–28 Mio. m³ | Phänomen: Exotherme Hydratation &amp; aktive Rohrkühlung
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p>
                  Die Drei-Schluchten-Talsperre in China stellt bauphysikalisch extreme Anforderungen an die Hydratationssteuerung. Bei massigen Baukörpern (sogenanntem <strong>Massenbeton</strong>) besteht die kritische Herausforderung im dissipationsverzögerten Abfluss der exothermen Bindemittelreaktionswärme aus dem Bauteilkern. Dies kann zu erheblichen thermischen Zwangsspannungen führen.
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Entstehung kritischer thermischer Kern-Rand-Gradienten</h4>
                  <p className="text-xs text-slate-650">
                    Überschreitet die Temperaturdifferenz ΔT zwischen dem adiabaten Bauteilkern (ohne Kühlung deutlich über 60 °C möglich) und den kälteren Bauteilrändern den häufig verwendeten Richtwert von ΔT ≈ 20 K, kommt es infolge behinderter thermischer Verformungen zur Entstehung von inneren Zwangsspannungen. Diese überschreiten die junge Zugfestigkeit des Betons und rufen tiefe Risse hervor, welche die Dichtigkeit und mechanische Tragfähigkeit der Gewichtsstaumauer gefährden.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><strong>Verfahrenstechnologische Steuerungsmaßnahmen zur Temperaturreduktion:</strong></p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-650 [list-style-type:circle]">
                    <li><strong>Klinkerreduzierte Bindemittelrezepturen:</strong> Ersatz eines großen Teils des Portlandzements durch Flugasche zur Dämpfung der Hydratationsgeschwindigkeit und Kumulativwärmeemissionsrate.</li>
                    <li><strong>Aktive Bauteilinnenkühlung (Rohrkühlung):</strong> In die Betonierlagen eingelegte Kühlrohre zur gezielten Wärmeabfuhr während der Hydratationsfrühphase.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /> Thermodynamische Abschätzung des Temperaturpotenzials
                  </span>
                  <p className="text-xs text-slate-650">
                    Berechnung der adiabaten Erwärmung eines ungesteuerten repräsentativen Betonvolumenelements (1 m³) unter Ausschluss von Wärmeaustauschprozessen:
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold">ADIABATISCHE Peaktemperaturprojektion:</div>
                    <div className="text-slate-600">Massenanteil Bindemittel (C): 260 kg/m³</div>
                    <div className="text-slate-600">Spezifische Hydratationswärme (CEM I): Q_h = 350 kJ/kg</div>
                    <div className="text-slate-700 font-bold mt-2">1. Freigesetzte thermische Energie (Q_total):</div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]">
                      Q_total = 260 kg × 350 kJ/kg = 91.000 kJ/m³
                    </div>
                    <div className="text-slate-720 font-bold mt-2">2. Theoretischer adiabatischer Temperaturanstieg ΔT:</div>
                    <div className="text-slate-600">
                      Spezifische Wärmekapazität von Frischbeton: cp ≈ 1,0 kJ/kg·K; Rohwichte: ρ_b ≈ 2.400 kg/m³
                    </div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]">
                      ΔT = Q_total / (cp × ρ_b) = 91.000 / (1,0 × 2.400) ≈ 37,9 K
                    </div>
                    <div className="text-slate-900 border-t pt-2 font-bold leading-snug">
                      Resultierende Bauteilkerntemperatur im Sommerbetrieb:
                      Ausgangstemperatur 25 °C + 37,9 K = 62,9 °C Peak-Kerntemperatur!
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 italic">
                    Rohrkühlung, gekühlte Ausgangsstoffe und klinkerarme Bindemittel senken die Spitzentemperatur; wie stark, hängt von Lagenhöhe, Rohrabstand und Kühlwassertemperatur ab.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. GOTTHARD-TUNNEL */}
        {activeCurioTab === 'gotthard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🏔️</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Geomechanische Spannungszustände und Spritzbetonsicherung im Gotthard-Basistunnel
                </h3>
                <p className="text-xs text-slate-550 font-mono">
                  Eröffnung: 2016 | Gebirgsüberlagerung: bis zu 2.300 m | Geomechanik: druckhaftes Gebirge &amp; Konvergenzen
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p>
                  Aufgrund einer Gesteinsüberdeckung von bis zu 2.300 Metern liegt der Ausbruchsquerschnitt des Gotthard-Basistunnels unter extremen primären Spannungsfeldern. Ohne sofortige mechanische Gegenstützung führt der geostatische Druck zu plastischen Konvergenzen (Querschnittseinengungen) und irreversiblem Bruch des Gebirges.
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Erstarrungskatalyse des Spritzbetons an glatten Bruchwänden</h4>
                  <p className="text-xs text-slate-650">
                    Zur Sicherung der Firste und Ulmen im Tunnelvortrieb wird nassgemischter Spritzbeton appliziert, der über extrem rasche Erstansteifungs- und Frühfestigkeitseigenschaften verfügen muss. Dies erfordert den Einsatz hochwirksamer Erstarrungsbeschleuniger (BE), die an der Mischdüse druckluftgestützt zudosiert werden.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><strong>Chemische Wirkungsunterschiede modifizierter Beschleunigersysteme:</strong></p>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                    Historisch weit verbreitete, alkalireiche Wasserglas- oder Natriumaluminat-Beschleuniger überführten das Material zwar binnen Sekunden in feste Phasen, drosselten jedoch die langfristige Hydratphasen-Ausbildung (Hydratationsgrad) und somit die Endfestigkeit deutlich; zudem belasten sie Mineure und Grundwasser. Im Gotthard-Tunnel kamen daher modernere <strong>alkalifreie Erstarrungsbeschleuniger (auf Aluminiumsulfatbasis)</strong> zum Einsatz. Diese induzieren eine beschleunigte Ettringitbildung im Zementleim, wahren jedoch die langfristige Gefügefestigkeit.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /> Modellgestützte Ermittlung des radialen Gebirgsstützdrucks
                  </span>
                  <p className="text-xs text-slate-650">
                    Mathematische Abschätzung des primären geostatischen Spannungszustands und des erforderlichen radialen Stützdrucks p_r bei unvollständiger Mobilisierung des Gebirgstragrings:
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 font-mono text-xs">
                    <div className="text-shiraz font-bold">STATISCHES GEBIRS-LASTMODELL:</div>
                    <div className="text-slate-600">Überlagerungshöhe H = 2.000 m</div>
                    <div className="text-slate-600">Mittlere spezifische Wichte des Gesteins: &gamma; ≈ 27 kN/m³</div>
                    <div className="text-slate-700 font-bold mt-2">1. Vertikale Primärspannung des ungestörten Gebirges (&sigma;_v):</div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]">
                      &sigma;_v = H × &gamma; = 2.000 m × 27 kN/m³ = 54.000 kN/m² = 54 MPa
                    </div>
                    <div className="text-slate-700 font-bold mt-2">2. Rechnerisch erforderlicher radialer Stützdruck p_rad:</div>
                    <div className="text-slate-600">
                      Lehrannahme: Durch die Gewölbewirkung des Gebirges muss der Ausbau nur einen kleinen Bruchteil, hier angenommen 5 %, der Primärspannung aufnehmen:
                    </div>
                    <div className="text-slate-800 bg-slate-50 p-1 font-mono pl-3 text-[11px]">
                      p_rad = 0,05 × 54 MPa = 2,7 MPa
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 italic leading-snug">
                    Der tatsächliche Ausbauwiderstand ergibt sich aus Gebirgs-Ausbau-Interaktion (Kennlinienverfahren); alkalifreie Beschleuniger helfen, die geplante Spritzbetonfestigkeit zu erreichen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. RÖMISCHE SEEKAI-PUZZOLANE */}
        {activeCurioTab === 'seawater' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">⚓</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Langzeitbeständigkeit von römischem Seebeton unter mariner Exposition
                </h3>
                <p className="text-xs text-slate-550 font-mono">
                  Werkstoffalter: &gt; 2.000 Jahre | Einsatzort: Antike Hafenanlagen der Mittelmeerregion | Reaktionsprodukt: Aluminium-Tobermorit
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-sm space-y-4 leading-relaxed text-slate-800">
                <p>
                  Unter marinen Expositionsbedingungen unterliegt herkömmlicher, Portlandzement-gebundener Beton einer intensiven werkstofflichen Schädigungsdynamik. Neben der Chloridpenetration führt das Eindringen von Sulfationen zur Bildung quellfähiger Gips- und Ettringitphasen (<strong>Ettringittreiben</strong>), was zu volumenvergrößernden Treibspannungen und progressivem Gefügebruch führt.
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Puzzolanische Reaktionsinduktion durch hydrothermale Seewassermischung</h4>
                  <p className="text-xs text-slate-650">
                    Die historische Mischung beruht auf vulkanischer Puzzolanasche in Verbindung mit Kalk. Dringt salzhaltiges Meerwasser kapillar in das Porensystem ein, bewirkt die schwach alkalische Umgebung die chemische Auflösung und Mobilisierung der amorphen silikatischen Vulkanglasphasen.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p><strong>Kristallgitterbildung und Porenverriegelung mittels Aluminaten:</strong></p>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                    Der Infiltrationsprozess fördert das thermodynamische Wachstum einer raumfüllenden faserartigen Mineralkomponente: <strong>Aluminium-Tobermorit</strong> und das Zeolithmineral Phillipsit (Jackson et al., American Mineralogist, 2017). Dieses nadelförmige Kristallgitter wächst selektiv in bestehende Porenräume ein, dichtet diese schrittweise gegen stofftransportgestützte Infiltrationen ab und steigert die innere Tragstruktur im Verlaufe jahrhundertelanger Alterungsbedingungen.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                    <BookOpen size={14} className="text-shiraz" /> Komparative Degradations- und Verwitterungsanalyse
                  </span>
                  <p className="text-xs text-slate-650 leading-tight">
                    Qualitativer Vergleich unter Meerwassereinwirkung (für belastbare Abtragsraten fehlen vergleichbare Langzeitdaten):
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-3 font-mono text-xs">
                    <div>
                      <span className="text-red-650 font-bold block border-b pb-1">1. MODERNES PORTLANDBETONSYS (CEM I):</span>
                      <div className="text-[11px] text-slate-600 leading-normal mt-1">
                        Auslaugung von Calciumhydroxid [Ca(OH)_2], Sulfatangriff und Chlorideintrag schädigen Beton und Bewehrung; dagegen helfen Expositionsklassen XS, dichter Beton und ausreichende Betondeckung.
                      </div>
                      <div className="text-red-700 font-bold text-[11px] mt-1">
                        Moderne Bauwerke werden üblicherweise für 50 bis 100 Jahre Nutzungsdauer bemessen.
                      </div>
                    </div>
                    
                    <div className="border-t pt-2">
                      <span className="text-emerald-800 font-bold block border-b pb-1">2. ANTIKES OPUS CAEMENTICIUM (POZZOLAN-KLINKER):</span>
                      <div className="text-[11px] text-slate-600 leading-normal mt-1">
                        Die nachträglich gewachsenen Kristalle verzahnen das Gefüge und füllen Poren; der unbewehrte Beton kennt zudem keine Bewehrungskorrosion.
                      </div>
                      <div className="text-emerald-700 font-bold text-[11px] mt-1">
                        Ergebnis: Hafenbauten sind seit rund 2.000 Jahren erhalten.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER & REFERENCES */}
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="kuriositaeten" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 16: Fakten und Lehrrechnungen geprüft und als Lehrannahmen gekennzeichnet, Quellen ergänzt; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Pantheon (Rom)', url: 'https://de.wikipedia.org/wiki/Pantheon_(Rom)' },
          { title: 'Burj Khalifa', url: 'https://de.wikipedia.org/wiki/Burj_Khalifa' },
          { title: 'Eiffelturm und Puddelstahl-Technik', url: 'https://de.wikipedia.org/wiki/Eiffelturm' },
          { title: 'Olympiastadion München (Zeltdachkonstruktion)', url: 'https://de.wikipedia.org/wiki/Olympiastadion_M%C3%BCnchen#Zeltdachkonstruktion' },
          { title: 'Ultrahochfester Beton (UHPC)', url: 'https://de.wikipedia.org/wiki/Ultrahochfester_Beton' },
          { title: 'Opus caementicium (römischer Beton)', url: 'https://de.wikipedia.org/wiki/Opus_caementicium' },
          { title: 'Stahlbeton (Joseph Monier)', url: 'https://de.wikipedia.org/wiki/Stahlbeton' },
          { title: 'Drei-Schluchten-Talsperre', url: 'https://de.wikipedia.org/wiki/Drei-Schluchten-Talsperre' },
          { title: 'Gotthard-Basistunnel', url: 'https://de.wikipedia.org/wiki/Gotthard-Basistunnel' },
          { title: 'Tobermorit (Al-Tobermorit in Antiken Seekais)', url: 'https://de.wikipedia.org/wiki/Tobermorit' }
        ]}
        literatur={[
          'Prof. Dr.-Ing. Jürgen Huber: Baustoffkunde & Denkmäler der Bautechnik — Vorlesungsskript TH Augsburg',
          'Zhu Bofang: Thermal Stresses and Temperature Control of Mass Concrete — Butterworth-Heinemann',
          'Sauer G.: Spritzbeton im Tunnelbau — Richtlinien und baupraktische Aspekte',
          'Marie Jackson et al.: Phillipsite and Al-Tobermorite crystallization in ancient Roman harbor concrete — American Mineralogist'
        ]}
        regelwerke={[
          { title: 'DIN EN 206 / DIN 1045-2' },
          { title: 'DIN EN 1992-1-1 (Eurocode 2: Bemessung von Betonbauwerken)' },
          { title: 'DAfStb-Richtlinie Massige Bauteile aus Beton', url: 'https://www.dafstb.de' },
          { title: 'ÖBV-Richtlinie Spritzbeton (Österreichische Bautechnik Vereinigung)', url: 'https://www.bautechnik.pro' }
        ]}
        formeln={[
          {
            formel: "f = f_0 \\cdot e^{-k \\cdot p}",
            erklaerung: "Festigkeit in Abhängigkeit von der Porosität p (f_0: Festigkeit ohne Poren, k: Materialkonstante) – erklärt den Festigkeitsgewinn durch dichte Packung im UHPC.",
            quelle: "Porositäts-Festigkeits-Beziehung nach Ryshkewitch"
          },
          {
            formel: "Ca^{2+} + CO_3^{2-} \\rightarrow CaCO_3 \\downarrow",
            erklaerung: "Calcit-Präzipitationsgleichung innerhalb feuchter Rissfugen von Pozzolan-Mischungen.",
            quelle: "Thermodynamik antiker Werkstoffe"
          },
          {
            formel: "\\Delta T_{\\text{adiabat}} = \\frac{C \\cdot Q_{\\text{eff}}}{c_p \\cdot \\rho}",
            erklaerung: "Adiabatischer Temperaturanstieg im ungekühlten Massenbetonkern als Funktion der Zementhydratationsenthalpie.",
            quelle: "Thermodynamik massiger Bauteile"
          },
          {
            formel: "p_R = \\frac{f_{cd} \\cdot t}{R}",
            erklaerung: "Radialer Widerstand eines dünnen, gleichmäßig gedrückten Spritzbetonrings (Kesselformel; ohne Biegung und Gebirgsinteraktion).",
            quelle: "Tunnelbau-Grundlagen (Kesselformel)"
          },
          {
            formel: "\\sigma_v = \\gamma \\cdot H",
            erklaerung: "Vertikale Primärspannung im Gebirge aus Wichte und Überlagerungshöhe.",
            quelle: "Felsmechanik (Grundlagen)"
          }
        ]}
      />
    </div>
  );
}
