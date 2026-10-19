import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { 
  FileSearch, SplitSquareHorizontal, LayoutGrid, Scale, AlertTriangle, 
  GitMerge, ArrowRight, Hammer, Wrench, Layers, Target, Grid, Info, 
  Disc, Sliders, CheckCircle2, MapPin, Gauge 
} from 'lucide-react';
import React, { useState } from 'react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function Probenahme() {
  const [activeTab, setActiveTab] = useState<'haufwerk' | 'diagnostik'>('haufwerk');

  // Diagnostics Tab sub-navigation for principles explorer
  const [selectedDiagTopic, setSelectedDiagTopic] = useState<'vorbereitung' | 'bohrkerne' | 'chloride' | 'rueckprall'>('vorbereitung');

  // Interactive Bohrkerne states
  const [dMax, setDMax] = useState<number>(32); // Max aggregate size: 8, 16, 22, 32 mm
  const [coreD, setCoreD] = useState<number>(100); // Core diameter: 50, 75, 100, 150 mm
  const [coreH, setCoreH] = useState<number>(100); // Core height: 50, 75, 100, 150, 200 mm
  const [measuredFCore, setMeasuredFCore] = useState<number>(35); // Measured compression strength in MPa

  // Interactive Chloride states
  const [drillD, setDrillD] = useState<number>(12); // Drill diameter in mm: 10, 12, 16, 20
  const [layerD, setLayerD] = useState<number>(10); // Layer thickness in mm: 5, 10, 15, 20
  const [numHoles, setNumHoles] = useState<number>(3); // Unified holes to merge

  // Interactive Rebound hammer states
  const [rawR, setRawR] = useState<number>(38); // Raw rebound value
  const [carbX, setCarbX] = useState<number>(15); // Carbonation depth in mm
  const [impactAngle, setImpactAngle] = useState<number>(0); // Angle: -90 (downwards/deck), 0 (horizontal/wall), 90 (upwards/ceiling)

  // Interactive Vorbereitung states
  const [elemType, setElemType] = useState<'deck' | 'pier' | 'wall' | 'balcony'>('pier');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col gap-1 mb-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <FileSearch className="text-shiraz" /> Probenahme &amp; Erkundung
          </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Präzise Materialentnahme, Probenteilung und baukritische Bestandsdiagnostik
          </p>
        </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6 px-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 border shadow-sm cursor-pointer ${
              activeTab === 'haufwerk' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('haufwerk')}
          >
            Haufwerke &amp; Schüttgüter
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 border shadow-sm cursor-pointer ${
              activeTab === 'diagnostik' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
            onClick={() => setActiveTab('diagnostik')}
          >
            Bauwerksdiagnostik im Bestand
          </button>
        </div>

        {activeTab === 'haufwerk' ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Grundlagen der Beprobung</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Um die Eigenschaften eines großen Haufwerks (z. B. mineralische Ersatzbaustoffe, Gesteinskörnung, Bauabfälle, Erdaushub) repräsentativ beurteilen zu können, muss die Probenahme planmäßig und normgerecht erfolgen. Zufällige oder unsachgemäße Probenahmen führen zu verfälschten Ergebnissen (z. B. Entmischung beim Schütten, wo große Körner nach außen rollen). Dies ist besonders kritisch bei der Klassifizierung nach der <strong>Ersatzbaustoffverordnung (EBV, in Kraft seit 01.08.2023)</strong> bzw. LAGA PN 98 / DIN 19698-1, da Fehler in der Beprobung zu massiven Fehleinschätzungen der Materialwerte und Entsorgungskosten führen.
              </p>

              <h4 className="font-bold text-home-prim mt-6 mb-2">Die "Proben-Hierarchie"</h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-4 bg-off-white border border-home-grau/30 rounded-xl">
                  <div className="font-bold text-text-main mb-1 text-sm animate-in">1. Einzelprobe / Stichprobe</div>
                  <p className="text-xs text-text-main/70 leading-relaxed">Eine Menge an Material, die in einem einzigen Durchgang (z.b. mit Schaufel oder Bohrgestänge) punktuell entnommen wurde.
          </p>
        </div>
                <div className="p-4 bg-off-white border border-home-grau/30 rounded-xl relative">
                  <ArrowRight className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-home-grau/40" size={16} />
                  <div className="font-bold text-text-main mb-1 text-sm">2. Sammelprobe</div>
                  <p className="text-xs text-text-main/70 leading-relaxed">Entsteht durch das homogene Vermischen mehrerer repräsentativer Einzelproben aus verschiedenen Haufwerksbereichen.</p>
                </div>
                <div className="p-4 bg-off-white border border-home-grau/30 rounded-xl relative">
                  <ArrowRight className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-home-grau/40" size={16} />
                  <div className="font-bold text-text-main mb-1 text-sm">3. Laborprobe</div>
                  <p className="text-xs text-text-main/70 leading-relaxed">Eine durch normgerechte "Probenteilung" verkleinerte Teilmenge der Sammelprobe, die ans Prüflabor geht.</p>
                </div>
                <div className="p-4 bg-off-white border border-home-grau/30 rounded-xl relative">
                  <ArrowRight className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-home-grau/40" size={16} />
                  <div className="font-bold text-text-main mb-1 text-sm">4. Messprobe oder Prüfprobe</div>
                  <p className="text-xs text-text-main/70 leading-relaxed">Die kleine Fraktion (Oft nur wenige Gramm), die konkret in das Prüfgerät (z.B. Eluat-Analyse) gegeben wird.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <GitMerge className="text-shiraz" size={20} /> Der korrekte Prozessablauf (z. B. nach LAGA PN 98)
              </h3>
              <p className="text-sm text-text-main/80 mb-4">
                Besonders bei der Entsorgung von Boden, Bauschutt und dekontaminationspflichtigen Materialien müssen repräsentative Proben erstellt werden. Wer einfach nur eine Schaufel von der Oberfläche des Haufwerks kratzt, macht sich strafbar oder ruiniert wirtschaftliche Kalkulationen.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-start text-sm">
                  <div className="bg-shiraz/10 text-shiraz font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <div className="leading-relaxed"><strong>Vorabbegehung &amp; Rasterung:</strong> Das Haufwerk (z. B. 500 m³ Bodenaushub) wird in Teilmengen (Lose) untergeteilt und gedanklich gerastert. Auffällige Zonen (z.b. Öl-Geruch oder schwarze Färbungen) werden sofort separiert (Hot-Spot-Beprobung).</div>
                </div>
                <div className="flex gap-3 items-start text-sm">
                  <div className="bg-shiraz/10 text-shiraz font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <div className="leading-relaxed"><strong>Stichprobenentnahme (Einzelproben):</strong> Mit geeignetem Gerät (z. B. Radlader für tiefe Schichten, Handbohrstock) werden über das Haufwerk verteilt (Tiefenprofil beachten!) eine vordefinierte Anzahl an Einzelproben entnommen (z. B. 20 Einstiche).</div>
                </div>
                <div className="flex gap-3 items-start text-sm">
                  <div className="bg-shiraz/10 text-shiraz font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">3</div>
                  <div className="leading-relaxed"><strong>Homogenisierung zur Sammelprobe:</strong> Die Einzelproben werden in einer Wanne oder auf Planen intensiv durchmischt. Klobige Stücke werden zerkleinert. Das Material muss absolut homogen durchmischt sein.</div>
                </div>
                <div className="flex gap-3 items-start text-sm">
                  <div className="bg-shiraz/10 text-shiraz font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">4</div>
                  <div className="leading-relaxed"><strong>Probenteiler (Laborprobe erstellen):</strong> Da die Sammelprobe meist viel zu groß ist (z. B. 20 kg), muss sie durch normgerechte Probenteilung auf die vom Labor benötigte Menge (z. B. 3-5 kg) verkleinert werden.</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex gap-3 text-orange-900">
                <AlertTriangle className="shrink-0 text-orange-500" />
                <p className="text-sm leading-relaxed">
                  <strong>Vorsicht bei leichtflüchtigen Schadstoffen (z.B. PAK, LHKW):</strong> Hier darf <em>nicht</em> intensiv gemischt oder homogenisiert werden, da die Schadstoffe sonst ausgasen und die Laboranalyse fälschlicherweise "sauberes" Material anzeigt! In diesen Fällen werden die Einzelproben direkt gasdicht in Probengläser (z.B. mit Septum) gefüllt.
                </p>
              </div>
            </div>

            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <SplitSquareHorizontal className="text-shiraz" size={20} /> Probenteilungsverfahren
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4">
                Die Entnahmemenge (Sammelprobe) muss repräsentativ verkleinert werden. Keinesfalls darf einfach unstrukturiert weggenommen werden, da sich Material bei der Handhabung entmischt. Grobe Steine rollen nach außen, Feinstkorn bleibt in der Mitte.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4 pb-4">
                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-3">
                    <LayoutGrid size={18} /> Riffelkasten (Riffelbombe)
                  </h4>
                  <p className="text-sm text-text-main/80 mb-3 leading-relaxed">
                    Ein Gerät mit abwechselnd nach links und rechts geneigten Schächten. Wenn das Material oben gleichmäßig eingeschüttet wird, teilt es sich exakt in zwei Hälften (in zwei Auffangschalen).
                  </p>
                  <ul className="list-disc pl-5 text-sm text-text-main/80 space-y-1">
                    <li>Halbiert die Probe schrittweise (100% → 50% → 25% usw.)</li>
                    <li>Sehr genau und normgerecht für rolliges / trockenes Material.</li>
                    <li>Die Schachtbreite muss mind. das 3-fache des Größtkorns betragen.</li>
                  </ul>
                </div>
                
                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-3">
                    <Scale size={18} /> Kegeln und Vierteln
                  </h4>
                  <p className="text-sm text-text-main/80 mb-3 leading-relaxed">
                    Ein manuelles Verfahren: Die Sammelprobe wird auf einer sauberen Fläche zu einem Kegel aufgeschüttet. Der Kegel wird flachgedrückt und kreuzweise in 4 gleich große Viertel geteilt.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-text-main/80 space-y-1">
                    <li>Zwei diagonal gegenüberliegende Viertel werden verworfen.</li>
                    <li>Die verbleibenden zwei Viertel werden neu gemischt und der Vorgang wiederholt, bis die Zielmenge erreicht ist.</li>
                    <li>Gut für leicht feuchte oder bindige (klebrige) Materialien, wo Riffelkästen verstopfen.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Grundlagen der Bauwerksdiagnostik</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Im Gegensatz zur lockeren Schüttgutbeprobung erfordert die Bauwerksprüfung an stehenden Bauteilen (z. B. Brücken, Stützwänden, Parkhäusern) ein zerstörungsarmes, materialtechnisches Vorgehen. Der Schutz der tragenden Substanz (VDI 6200) sowie die unfehlbare Lokalisierung von Schadensfronten (Karbonatisierungstiefe, Chlorideintragstiefe) stehen im Mittelpunkt.
          </p>
        </div>

            {/* Section 1: Vorbereitung & Entnahmeorte */}
            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <MapPin className="text-shiraz" size={20} /> 1. Entnahmeorte &amp; Vorbereitung der Prüfstellen
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4">
                Um repräsentative und unverschleierte Schadensindikatoren zu generieren, muss die Wahl und physische Aufbereitung der Prüfstelle nach strengen Kriterien stattfinden. Willkürliche Stichproben bergen die Gefahr, gravierende, lokal begrenzte Schäden (Hot-Spots) zu übersehen oder umgekehrt singuläre Mängel überzubewerten.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4 pb-4">
                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <Wrench size={18} /> Praxisregeln der Probenstellung
                  </h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="bg-shiraz/15 text-shiraz font-bold rounded-md w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">A</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Sondierungspflicht vor jedem Eingriff:</strong> Vor jeder Tiefbohrung oder Kernentnahme muss die Bewehrung mittels deckungsmessender Wirbelstromprüfung (Covermeter) oder Georadar exakt geortet werden. Dies verhindert eine statisch irreversible Beschädigung der Zug- und Querkraftbewehrung und schützt die Bohrkronen.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/15 text-shiraz font-bold rounded-md w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">B</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Trockene Oberflächen-Säuberung:</strong> Fremdschichten wie Bitumenbahnen, Fliesen, Spachtelmassen oder Farbanstriche müssen rückstandslos abgetragen werden. Hierbei darf <strong>kein Wasser</strong> zur Kühlung verwendet werden, da dies an der Oberfläche angelagerte Salze (Chloride) auswaschen oder tiefenmäßig verlagern würde.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/15 text-shiraz font-bold rounded-md w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">C</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Systematische Schad- vs. Referenzstellen:</strong> Prüfungen müssen planmäßig in den am stärksten belasteten Bereichen erfolgen (z.B. Deckenfugen unter Tausalzeintrag, Spritzwasserbereich der Säulenfüße) und durch &quot;trockene&quot;, geschützte Referenzstellen abgeglichen werden, um Alterungs- von Schadprozessen abzugrenzen.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <MapPin size={18} /> Entnahme-Taktik nach Bauteiltyp
                  </h4>
                  <div className="space-y-3.5">
                    <label className="block text-xs font-bold text-slate-700">Wählen Sie Ihr Bauteil zur Analyse:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'pier', label: 'Brückenpfeiler', exp: 'Splash zone / Carbonation' },
                        { id: 'deck', label: 'Parkdeck-Platte', exp: 'Severe chlorides' },
                        { id: 'wall', label: 'Kellerwand', exp: 'Moisture & Ground salt' },
                        { id: 'balcony', label: 'Balkonplatte', exp: 'Carbonation / Concrete cover' }
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setElemType(b.id as any)}
                          className={`p-2 rounded-lg border text-left transition-all ${
                            elemType === b.id 
                              ? 'bg-shiraz/10 border-shiraz font-bold' 
                              : 'bg-white border-home-grau/30 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xs font-bold block">{b.label}</span>
                          <span className="text-[9.5px] text-slate-500 block font-normal mt-0.5 leading-tight">{b.exp}</span>
                        </button>
                      ))}
                    </div>

                    {(() => {
                      let recommendPoints = '';
                      let locations = '';
                      let prepSteps = '';
                      if (elemType === 'pier') {
                        recommendPoints = 'Mindestens 4-6 Probestellen';
                        locations = 'Bereich Spritzwasserkanal (0-1,5m über Terrain), unberegnete Unterseiten (Carbonatisierungs-Hotspot).';
                        prepSteps = 'Bewehrungsscan mit Covermeter zwingend vorab, Entfernung von Streusalzkrusten trocken mit Drahtbürste.';
                      } else if (elemType === 'deck') {
                        recommendPoints = 'Mindestens 6-8 Probestellen pro Fahrgassenabschnitt';
                        locations = 'Tiefpunkte im Gefälle, Entwässerungsrinnen, Thermische Fugenübergänge, Risszonen am Stützenkopf.';
                        prepSteps = 'Entfernen der OS-Dichtungsbeschichtung mittels Fräse/Schleifwerkzeug im Durchmesser von ca. 150 mm.';
                      } else if (elemType === 'wall') {
                        recommendPoints = 'Mindestens 3 Stellen pro Wandachse';
                        locations = 'Horizontaldichtungsebene, erdberührende Sockelbereiche (Dränagewasser-Einfluss), Rissverläufe.';
                        prepSteps = 'Abklopfen hohler Putzschichten; getrennte Beprobung von Mörtelfuge und Ziegelkörper, um Verfälschungen auszuschließen.';
                      } else {
                        recommendPoints = 'Mindestens 3 Probestellen';
                        locations = 'Balkonschnittkante (Tropfnasen-Bereich), freibewitterte Hauptfläche, Einspannungsquerschnitt am Wandanschluss.';
                        prepSteps = 'Sondierung der tatsächlichen geringen Betondeckung, vorsichtiger Meißelabstich zur Feststellung der Karbonatisierung.';
                      }

                      return (
                        <div className="bg-white border border-home-grau/30 rounded-lg p-3 space-y-2.5 text-xs text-slate-705">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Empfohlene Probenanzahl:</span>
                            <strong className="text-slate-950 mt-0.5 block">{recommendPoints}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Kritische Entnahmeorte:</span>
                            <span className="block mt-0.5 leading-relaxed text-slate-600">{locations}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Präparations-Arbeitsschritte:</span>
                            <span className="block mt-0.5 leading-relaxed text-slate-600">{prepSteps}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Bohrkerne */}
            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <Layers className="text-shiraz" size={20} /> 2. Bohrkerne: Geometrie &amp; Größtkorn-Effekt
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4">
                Bohrkerne werden meist nass aus der Tragstruktur ausgeschnitten, um im Labor die Druckfestigkeit prüfen zu lassen. Die Gültigkeit der Ergebnisse hängt jedoch elementar vom geometrischen Zusammenspiel aus Bohrkerndurchmesser (d) und dem Größtkorn der Gesteinskörnung (D_max) ab.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4 pb-4">
                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <Disc size={18} /> Statische &amp; geometrische Anforderungen
                  </h4>
                  <div className="space-y-3.5">
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">1</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Die Dreifach-Regel (d ≥ 3 · D_max):</strong> Ist der Kerndurchmesser kleiner als das Dreifache des nominalen Größtkorns der Gesteinskörnung, treten beim Belastungsversuch unnatürliche Spannungskonzentrationen auf. Einzelne große Kieselsteine verhalten sich im schmalen Zylinder wie starre Fremdkörper, was zu extremer Streuung und Verfälschung der Festigkeit nach unten führt.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">2</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Schlankheitseinfluss (h/d-Verhältnis):</strong> Die Stahlplatten der Prüfpresse behindern die Querdehnung des Betonkerns an den Endflächen durch Reibung. Bei kurzen Kernen (h/d ≈ 1) stützt dieser Effekt den Kern weitgehend, was zu Überhöhung führt (Würfeldruckfestigkeit). Erst bei langen Zylindern (h/d = 2) herrscht im Mittelbereich ein reiner einachsiger Spannungszustand (Zylinderdruckfestigkeit).
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">3</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Sofortige Hohlraumverfüllung:</strong> Die verbleibenden Bohrlöcher müssen nach der Entnahme umgehend statisch kraftschlüssig mit schrumpffreiem PCC-Vergussmörtel gleicher oder höherer Festigkeitsklasse mineralisch verschlossen werden, um mechanische Schwachstellen und Eintrittspfade für CO₂ zu blockieren.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <Sliders size={18} /> Kern-Geometrie &amp; Aggregatprüfer
                  </h4>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Maximales Gesteinskorn (D_max):</label>
                      <select 
                        className="w-full bg-white border border-home-grau/30 rounded p-1.5 font-mono text-slate-805 text-xs"
                        value={dMax} 
                        onChange={(e) => setDMax(Number(e.target.value))}
                      >
                        <option value="8">8 mm (z.B. Estrich / Feinkorn)</option>
                        <option value="16">16 mm (Standard-Beton)</option>
                        <option value="22">22 mm (Grobbahn-Beton)</option>
                        <option value="32">32 mm (Sehr grober Massenbeton)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Geplanter Bohrkern-Durchmesser (d):</label>
                      <select 
                        className="w-full bg-white border border-home-grau/30 rounded p-1.5 font-mono text-slate-805 text-xs"
                        value={coreD} 
                        onChange={(e) => setCoreD(Number(e.target.value))}
                      >
                        <option value="50">50 mm (Dünner Kern)</option>
                        <option value="75">75 mm (Mittlerer Kern)</option>
                        <option value="100">100 mm (Standardkern)</option>
                        <option value="150">150 mm (Großer Kern)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Gewonnene Prüf-Höhe (h):</label>
                      <select 
                        className="w-full bg-white border border-home-grau/30 rounded p-1.5 font-mono text-slate-805 text-xs"
                        value={coreH} 
                        onChange={(e) => setCoreH(Number(e.target.value))}
                      >
                        <option value="50">50 mm</option>
                        <option value="75">75 mm</option>
                        <option value="100">100 mm</option>
                        <option value="150">150 mm</option>
                        <option value="200">200 mm</option>
                      </select>
                    </div>

                    {(() => {
                      const tripleRequired = 3 * dMax;
                      const passesAgg = coreD >= tripleRequired;
                      const lambda = coreH / coreD;
                      let correctionFactor = 1.5 / (0.3 + 1.2 / lambda);
                      if (correctionFactor > 1.25) correctionFactor = 1.25;
                      if (correctionFactor < 0.85) correctionFactor = 0.85;

                      return (
                        <div className="bg-white p-3 rounded-lg border border-home-grau/30 space-y-2.5 mt-2 leading-relaxed text-[11px] text-slate-705">
                          <div className="flex justify-between items-center pb-1 border-b border-home-grau/30">
                            <span className="font-bold">Größtkorn-Prüfung:</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${passesAgg ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                              {passesAgg ? '✔ Valide' : '⚠ Nicht repräsentativ'}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[10px] leading-tight">
                            Für D_max = {formatDeWert(dMax)} mm muss der Bohrdurchmesser d ≥ {formatDeWert(tripleRequired)} mm betragen. Ihr Kern hat d = {formatDeWert(coreD)} mm.
                          </p>
                          <div className="pt-1.5 border-t border-home-grau/30 grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[9px] text-slate-400 block font-bold leading-none">Schlankheit λ = h/d:</span>
                              <strong className="font-mono text-xs block mt-1">{formatDeZahl(lambda, 2)}</strong>
                              <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">
                                ({lambda === 1.0 ? 'Würfelform' : lambda === 2.0 ? 'Zylinderform' : 'Gezerrte Geometrie'})
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block font-bold leading-none">Umrechnungsfaktor:</span>
                              <strong className="font-mono text-xs text-indigo-700 block mt-1">{formatDeZahl(correctionFactor, 3)}</strong>
                              <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">nach DIN EN 12504-1</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Chloride */}
            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <Target className="text-shiraz" size={20} /> 3. Chloridbeprobung: Statistische Absicherung &amp; Profilgenauigkeit
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4">
                Der Eintritt von chloridhaltigem Tausalz erfolgt sehr heterogen über Fehlstellen, Haarrisse und Kiesnester. Daher ist eine statistisch dichte und streng verunreinigungsfreie Probenahme ein absolutes Muss, um folgenschwere Fehlentscheidungen bei der Instandsetzungsplanung zu verhindern.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4 pb-4">
                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <CheckCircle2 size={18} /> Laborpräparierte Qualitätssicherung
                  </h4>
                  <div className="space-y-3.5">
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">✔</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Fülle der Probestellen (Min. 3 bis 5 Stellen):</strong> Ein einzelner Bohrmehlabstich ist statistisch wertlos. Zur Bewertung eines homogenen Traggliedabschnitts (z. B. einer Parkdeckstütze) müssen mindestens 3, besser 5 separate Beprobungsstellen untersucht werden. Andernfalls verfälscht das zufällige Treffen eines chloridfreien Quarzkieses den Wert fälschlicherweise gegen Null.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">✔</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Verschleppungsverbot &amp; Stufenbohrung:</strong> Wird ein Bohrloch tiefer getrieben, rieselt hochbelastetes Bohrmehl von der Oberfläche hinab. Bei der stufenweisen Probe (z.B. alle und exakt 10 mm) muss vor jedem tieferen Schritt das Loch penibelst staubfrei ausgesaugt und die Bohrkrone abgebürstet werden (Vermeidung von Verschleppungsfehlern).
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">✔</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Erforderliches Mindestprobengewicht (Min. 5g - 10g):</strong> Für die quantitative nasschemische Laboranalyse (z.B. argentometrische Titration nach Charpentier-Volhard) müssen mindestens 5g Zementstein-reichen Bohrmehls vorliegen. Bei geringen Bohrdurchmessern müssen daher mehrere benachbarte Löcher für denselben Tiefenbereich vereinigt werden.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <Sliders size={18} /> Gewichtsertrags-Kalkulator
                  </h4>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Bohrdurchmesser (D_b):</span>
                        <span className="text-shiraz font-mono font-bold">{formatDeWert(drillD)} mm</span>
                      </div>
                      <input
                        type="range" min="10" max="25" step="1"
                        value={drillD} onChange={(e) => setDrillD(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Schicht-Intervall (dz):</span>
                        <span className="text-shiraz font-mono font-bold">{formatDeWert(layerD)} mm</span>
                      </div>
                      <input
                        type="range" min="5" max="20" step="5"
                        value={layerD} onChange={(e) => setLayerD(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Vereinigte Bohrungen (N):</span>
                        <span className="text-shiraz font-mono font-bold">{numHoles} Löcher</span>
                      </div>
                      <input
                        type="range" min="1" max="5" step="1"
                        value={numHoles} onChange={(e) => setNumHoles(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    {(() => {
                      const radiusCm = drillD / 2 / 10;
                      const heightCm = layerD / 10;
                      const volumeOnem3 = Math.PI * Math.pow(radiusCm, 2) * heightCm;
                      const densityGcm3 = 2.2;
                      const weightPerHole = volumeOnem3 * densityGcm3;
                      const totalWeight = weightPerHole * numHoles;
                      const isValidWeight = totalWeight >= 5.0;

                      return (
                        <div className="p-3 bg-white border border-home-grau/30 rounded-lg space-y-2 mt-2 leading-normal text-[11px] text-slate-700">
                          <div className="flex justify-between items-center pb-1 border-b border-home-grau/30">
                            <span className="font-bold">Ausbeute Bohrmehl:</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isValidWeight ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {isValidWeight ? '✔ Menge ausreichend' : '⚠ Zu gering (< 5 g)'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[9px] text-slate-400 block font-bold leading-none">Menge pro Loch:</span>
                              <strong className="font-mono text-xs block mt-1">{formatDeZahl(weightPerHole, 2)} g</strong>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block font-bold leading-none">Gesamtgewicht:</span>
                              <strong className={`font-mono text-xs block mt-1 ${isValidWeight ? 'text-emerald-700' : 'text-red-650 font-bold'}`}>{formatDeZahl(totalWeight, 2)} g</strong>
                            </div>
                          </div>
                          {!isValidWeight && (
                            <p className="text-[9.5px] text-red-500 font-medium leading-tight pt-1">
                              Die gewonnene Menge liegt unter dem nasschemischen Analyselimit von 5 g. Es sollte der Bohrdurchmesser vergrößert oder mehr Löcher vereinigt werden, um repräsentative Zementsteingehalte zu sichern.
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Rückprallhammer */}
            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <Gauge className="text-shiraz" size={20} /> 4. Rückprallhammer: Untergrundpräparation &amp; Korrekturen
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed mb-4">
                Der Schmidt-Rückprallhammer dient der schnellen, zerstörungsfreien Abschätzung der Beton-Gleichmäßigkeit und Druckfestigkeit im Bestand. Die gemessene Härte (Rebound-Wert R) reagiert jedoch hochsensibel auf Oberflächenstörungen.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4 pb-4">
                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <AlertTriangle size={18} className="text-shiraz" /> Fehlerquellen &amp; Stoßwinkelkorrektur
                  </h4>
                  <div className="space-y-3.5">
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">▲</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Der fatale Karbonatisierungsfehler (Karbonatisierungshaut):</strong> Atmosphärisches CO₂ wandelt weiches Calciumhydroxid an der Betonoberfläche in hartes Calciumcarbonat (CaCO₃) um. Diese dichte Sinterschicht bläht den Rückprall-Index künstlich auf. Die gemessene Festigkeit kann dadurch <strong>um bis zu 50 % höher</strong> erscheinen als die wahre Kernfestigkeit im Inneren! Vor dem Test muss die Karbonatisierungstiefe gemessen und die Oberfläche an der Prüfstelle zwingend mindestens 5–10 mm blank geschliffen werden.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">▲</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Winkelkorrektur (Gravitations-Einfluss):</strong> Die Erdbeschleunigung wirkt auf die innere Masse des Hammers ein. Schlägt man senkrecht nach unten (Bodenplatte), beschleunigt die Schwerkraft die Schlagmasse mit, was den Wert scheinbar erhöht. Schlägt man gegen eine Decke (nach oben), bremst die Schwerkraft. Die Auswertung darf nur mit korrigierten Kurvenscharen (Winkelkorrekturen nach EN 13791) erfolgen.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">▲</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Grid-Impacts &amp; Ausreißer-Filterung:</strong> Ein einzelner Schlag hat keine Aussagekraft. Stets muss ein dichtes Feld (z.B. 10x10 cm mit mind. 9 bis 12 Einschlägen) gewählt werden. Ein Einzelschlag auf ein großes Kieselstein-Aggregat führt zu einem Ausreißer nach oben; ein Schlag auf einen Porenhohlraum bricht ein. Ausreißer außerhalb der Standardabweichung müssen statistisch gelöscht werden.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-home-grau/30 rounded-xl bg-off-white space-y-4">
                  <h4 className="font-bold text-home-prim flex items-center gap-2 mb-2">
                    <Sliders size={18} /> Karbonatisierungs- &amp; Winkeljustierung
                  </h4>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Rohwert Rückprall (R_raw):</span>
                        <span className="text-shiraz font-mono font-bold">{formatDeWert(rawR)} Skl.</span>
                      </div>
                      <input
                        type="range" min="20" max="55" step="1"
                        value={rawR} onChange={(e) => setRawR(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Karbonatisierungs-Tiefe (x_CO₂):</span>
                        <span className="text-shiraz font-mono font-bold">{formatDeWert(carbX)} mm</span>
                      </div>
                      <input
                        type="range" min="0" max="40" step="1"
                        value={carbX} onChange={(e) => setCarbX(Number(e.target.value))}
                        className="w-full accent-shiraz"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Schlagrichtung / Einbauwinkel (α):</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { value: -90, label: 'Boden (-90°)' },
                          { value: 0, label: 'Wand (0°)' },
                          { value: 90, label: 'Decke (+90°)' }
                        ].map((a) => (
                          <button
                            key={a.value}
                            type="button"
                            onClick={() => setImpactAngle(a.value)}
                            className={`p-1.5 text-[10px] font-bold rounded border text-center transition-all ${
                              impactAngle === a.value 
                                ? 'bg-shiraz text-white border-shiraz font-bold' 
                                : 'bg-white border-home-grau/30 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {(() => {
                      let angleCorr = 0;
                      if (impactAngle === -90) angleCorr = -2.5;
                      else if (impactAngle === 90) angleCorr = 3.2;

                      let carbCorr = carbX > 0 ? -0.15 * carbX : 0;
                      if (carbCorr < -6.0) carbCorr = -6.0;

                      const finalR = rawR + angleCorr + carbCorr;
                      const rawEstStr = Math.max(10, (rawR * 1.4) - 20);
                      const finalEstStr = Math.max(10, (finalR * 1.4) - 20);

                      return (
                        <div className="p-3 bg-white border border-home-grau/30 rounded-lg space-y-2 mt-2 leading-relaxed text-[11px] text-slate-700">
                          <div className="flex justify-between items-center pb-1 border-b border-home-grau/30 text-shiraz font-bold">
                            <span>Ergebnis-Klassifizierung:</span>
                            <span className="font-mono text-slate-900 font-bold text-xs">
                              True R = {formatDeZahl(finalR, 1)}
                            </span>
                          </div>
                          <div className="space-y-1 text-slate-600 text-[10px]">
                            <div className="flex justify-between">
                              <span>Korrektur Karbonatisierung:</span>
                              <strong className="font-semibold text-rose-800">{formatDeZahl(carbCorr, 1)} Skl.</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Korrektur Winkel (Schwerkraft):</span>
                              <strong className="font-semibold text-indigo-800">{angleCorr > 0 ? `+${formatDeZahl(angleCorr, 1)}` : formatDeZahl(angleCorr, 1)} Skl.</strong>
                            </div>
                            <div className="flex justify-between border-t border-home-grau/30 pt-1 text-[11px] text-slate-850">
                              <span className="font-bold">Scheinbare Festigkeit (Roh):</span>
                              <span className="font-mono text-red-650 font-bold">~{formatDeZahl(rawEstStr, 0)} MPa</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-850">
                              <span className="font-bold">Tatsächliche Festigkeit (Korrigiert):</span>
                              <span className="font-mono text-emerald-700 font-bold">~{formatDeZahl(finalEstStr, 0)} MPa</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-orange-50/60 border border-orange-200 rounded-xl flex gap-3 text-orange-950">
              <Info className="shrink-0 text-orange-500 mt-0.5" />
              <p className="text-sm leading-relaxed">
                <strong>Merksatz der Diagnostik:</strong> Auswertungsmethoden an Bauwerken unterliegen immer statistischen Einflüssen. Ein einzelnes Testergebnis besitzt keine normative Aussagekraft. Durch Mehrfachbeprobung und konsequente Fehlerbereinigung (Schleifen, Absaugen) werden verfälschte Beurteilungen effektiv ausgeschlossen.
              </p>
            </div>
          </div>
        )}
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Probenahme', url: 'https://de.wikipedia.org/wiki/Probenahme' },
          { title: 'Bauwerksdiagnostik', url: 'https://de.wikipedia.org/wiki/Bauwerksdiagnostik' },
          { title: 'Betonprüfhammer', url: 'https://de.wikipedia.org/wiki/Betonpr%C3%BCfhammer' }
        ]}
        literatur={[
          'Ersatzbaustoffverordnung (EBV) - Verordnung über Anforderungen an den Einbau von mineralischen Ersatzbaustoffen in technische Bauwerke (BGBl. I)',
          'LAGA PN 98: Richtlinie für das Vorgehen bei physikalischen, chemischen und biologischen Untersuchungen im Zusammenhang mit der Verwertung/Beseitigung von Abfällen',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'Ersatzbaustoffverordnung (EBV) 2023 - Anhang 1: Probenahme', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' },
          { title: 'LAGA PN 98 (Beprobung von Haufwerken - Richtlinie für das Vorgehen)', url: 'https://www.laga-online.de/' },
          { title: 'DIN 19698-1:2014-05 (Untersuchung von Feststoffen - Probenahme aus Haufwerken)', url: 'https://www.dinmedia.de/de/suche?q=DIN+19698-1' },
          { title: 'DIN 19528:2009-01 (Eluierungsverfahren für anorganische Schadstoffe)', url: 'https://www.dinmedia.de/de/suche?q=DIN+19528' },
          { title: 'DIN EN 12504-1:2021-04 (Prüfung von Beton in Bauwerken - Teil 1: Bohrkernproben)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12504-1' },
          { title: 'DIN EN 12504-2:2021-11 (Prüfung von Beton in Bauwerken - Teil 2: Bestimmung der Rückprallzahl)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12504-2' },
          { title: 'DIN EN 13791:2020-02 (Bewertung der Druckfestigkeit von Beton in Bauwerken)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13791' }
        ]}
        formeln={[
          {
            formel: 'd_{\\text{Kern}} \\ge 3 \\cdot d_{\\text{max}}',
            erklaerung: 'Prüftechnische geometrische Mindestanforderung an den Bohrkerndurchmesser d_Kern bezüglich des maximalen Überkorns d_max der Gesteinskörnung zur Vermeidung von Festigkeitsstörungen.',
            quelle: 'DIN EN 12504-1:2021-04'
          },
          {
            formel: 'f_{\\text{is}} = 0{,}85 \\cdot f_{\\text{core}} \\cdot K_{\\text{h}} \\cdot K_{\\text{d}}',
            erklaerung: 'In-situ-Zylinderdruckfestigkeit f_is konvertiert aus der gemessenen Bohrkernfestigkeit f_core unter Berücksichtigung von Höhenfaktor K_h und Durchmesserfaktor K_d.',
            quelle: 'DIN EN 13791:2020-02'
          }
        ]}
      />
    </div>
  );
}
