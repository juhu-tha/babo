import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { 
  FileSearch, SplitSquareHorizontal, LayoutGrid, Scale, AlertTriangle, 
  GitMerge, ArrowRight, Wrench, Layers, Target, Info, 
  Disc, Sliders, CheckCircle2, MapPin, Gauge 
} from 'lucide-react';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

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
            Um die Eigenschaften eines großen Haufwerks (z. B. mineralische Ersatzbaustoffe, Gesteinskörnung, Bauabfälle, Erdaushub) repräsentativ beurteilen zu können, muss die Probenahme planmäßig und normgerecht erfolgen. Zufällige oder unsachgemäße Probenahmen führen zu verfälschten Ergebnissen (z. B. Entmischung beim Schütten, wo große Körner nach außen rollen). Dies ist besonders kritisch bei der Klassifizierung nach der <strong>Ersatzbaustoffverordnung (EBV, in Kraft seit 01.08.2023)</strong> – die Probenahme hat nach § 8 EBV gemäß <strong>LAGA PN 98</strong> zu erfolgen (DIN 19698-1/-2 darf ergänzend herangezogen werden), da Fehler in der Beprobung zu massiven Fehleinschätzungen der Materialwerte und Entsorgungskosten führen.
              </p>

              <h4 className="font-bold text-home-prim mt-6 mb-2">Die "Proben-Hierarchie"</h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-4 bg-off-white border border-home-grau/30 rounded-xl">
                  <div className="font-bold text-text-main mb-1 text-sm animate-in">1. Einzelprobe / Stichprobe</div>
                  <p className="text-xs text-text-main/70 leading-relaxed">Eine Menge an Material, die in einem einzigen Durchgang (z. B. mit Schaufel oder Bohrgestänge) punktuell entnommen wurde.
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
                  <p className="text-xs text-text-main/70 leading-relaxed">Die kleine Fraktion (oft nur wenige Gramm bis wenige Kilogramm), die konkret in das Prüfverfahren (z. B. Eluatherstellung nach DIN 19529) gegeben wird.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-home-grau/10 pt-6">
              <h3 className="text-lg font-bold text-home-prim flex items-center gap-2 mb-2">
                <GitMerge className="text-shiraz" size={20} /> Der korrekte Prozessablauf (z. B. nach LAGA PN 98)
              </h3>
              <p className="text-sm text-text-main/80 mb-4">
                Besonders bei der Entsorgung von Boden, Bauschutt und dekontaminationspflichtigen Materialien müssen repräsentative Proben erstellt werden. Wer einfach nur eine Schaufel von der Oberfläche des Haufwerks kratzt, erhält kein verwertbares Ergebnis: Die Deklaration ist angreifbar, und Fehleinstufungen verursachen erhebliche Mehrkosten bei Verwertung oder Entsorgung.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-start text-sm">
                  <div className="bg-shiraz/10 text-shiraz font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <div className="leading-relaxed"><strong>Vorabbegehung &amp; Rasterung:</strong> Das Haufwerk (z. B. 500 m³ Bodenaushub) wird in Teilmengen (Lose) untergeteilt und gedanklich gerastert. Auffällige Zonen (z. B. Öl-Geruch oder schwarze Färbungen) werden sofort separiert (Hot-Spot-Beprobung).</div>
                </div>
                <div className="flex gap-3 items-start text-sm">
                  <div className="bg-shiraz/10 text-shiraz font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <div className="leading-relaxed"><strong>Stichprobenentnahme (Einzelproben):</strong> Mit geeignetem Gerät (z. B. Radlader für tiefe Schichten, Handbohrstock) werden über das Haufwerk verteilt (Tiefenprofil beachten!) eine vordefinierte Anzahl an Einzelproben entnommen (Anzahl nach LAGA PN 98 abhängig vom Haufwerksvolumen).</div>
                </div>
                <div className="flex gap-3 items-start text-sm">
                  <div className="bg-shiraz/10 text-shiraz font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">3</div>
                  <div className="leading-relaxed"><strong>Homogenisierung zur Sammelprobe:</strong> Die Einzelproben werden in einer Wanne oder auf Planen intensiv durchmischt. Grobe Stücke werden zerkleinert; die Probenvorbehandlung im Labor richtet sich nach DIN 19747.</div>
                </div>
                <div className="flex gap-3 items-start text-sm">
                  <div className="bg-shiraz/10 text-shiraz font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">4</div>
                  <div className="leading-relaxed"><strong>Probenteiler (Laborprobe erstellen):</strong> Da die Sammelprobe meist viel zu groß ist (z. B. 20 kg), muss sie durch normgerechte Probenteilung (DIN EN 932-2) auf die vom Labor benötigte Menge (z. B. 3–5 kg) verkleinert werden.</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex gap-3 text-orange-900">
                <AlertTriangle className="shrink-0 text-orange-500" />
                <p className="text-sm leading-relaxed">
                  <strong>Vorsicht bei leichtflüchtigen Schadstoffen (z. B. LHKW, BTEX, Naphthalin):</strong> Hier darf <em>nicht</em> intensiv gemischt oder homogenisiert werden, da die Schadstoffe sonst ausgasen und die Laboranalyse fälschlicherweise "sauberes" Material anzeigt! In diesen Fällen werden die Einzelproben direkt gasdicht in Probengläser (z. B. mit Septum bzw. Methanolvorlage) gefüllt. Die meisten PAK sind dagegen schwerflüchtig und werden regulär über die Sammelprobe erfasst.
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
                    <li>Sehr genau und normgerecht (DIN EN 932-2) für rolliges / trockenes Material.</li>
                    <li>Die Schachtbreite muss deutlich größer als das Größtkorn sein; das Mindestverhältnis und die Gerätegrößen legt DIN EN 932-2 fest.</li>
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
            Im Gegensatz zur lockeren Schüttgutbeprobung erfordert die Bauwerksprüfung an stehenden Bauteilen (z. B. Brücken, Stützwänden, Parkhäusern) ein zerstörungsarmes, materialtechnisches Vorgehen. Die Schonung der tragenden Substanz, die regelmäßige Überprüfung der Standsicherheit (VDI 6200) sowie die zuverlässige Lokalisierung von Schadensfronten (Karbonatisierungstiefe, Chlorideintragstiefe) stehen im Mittelpunkt.
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
                        { id: 'pier', label: 'Brückenpfeiler', exp: 'Spritzwasser / Karbonatisierung' },
                        { id: 'deck', label: 'Parkdeck-Platte', exp: 'Hoher Chlorideintrag' },
                        { id: 'wall', label: 'Kellerwand', exp: 'Feuchte & bauschädliche Salze' },
                        { id: 'balcony', label: 'Balkonplatte', exp: 'Karbonatisierung / Betondeckung' }
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
                        recommendPoints = 'Orientierungswert: 4–6 Probestellen je Pfeiler';
                        locations = 'Spritzwasserbereich (ca. 0–1,5 m über Gelände bzw. Fahrbahn), unberegnete, trockene Flächen (dort schreitet die Karbonatisierung am schnellsten fort).';
                        prepSteps = 'Bewehrungsscan mit Covermeter zwingend vorab, Entfernung von Streusalzkrusten trocken mit Drahtbürste.';
                      } else if (elemType === 'deck') {
                        recommendPoints = 'Orientierungswert: 6–8 Probestellen je Fahrgassenabschnitt';
                        locations = 'Tiefpunkte im Gefälle, Entwässerungsrinnen, Fugenübergänge, Risszonen über den Stützen und Stützenfüße.';
                        prepSteps = 'Entfernen der OS-Dichtungsbeschichtung mittels Fräse/Schleifwerkzeug im Durchmesser von ca. 150 mm.';
                      } else if (elemType === 'wall') {
                        recommendPoints = 'Orientierungswert: 3 Stellen je Wandachse';
                        locations = 'Horizontaldichtungsebene, erdberührende Sockelbereiche (Dränagewasser-Einfluss), Rissverläufe.';
                        prepSteps = 'Abklopfen hohler Putzschichten; getrennte Beprobung von Mörtelfuge und Ziegelkörper, um Verfälschungen auszuschließen.';
                      } else {
                        recommendPoints = 'Orientierungswert: 3 Probestellen';
                        locations = 'Balkonschnittkante (Tropfnasen-Bereich), freibewitterte Hauptfläche, Einspannungsquerschnitt am Wandanschluss.';
                        prepSteps = 'Messung der tatsächlichen Betondeckung; Karbonatisierungstiefe an frischer Bruch- oder Spaltfläche mit Phenolphthalein-Lösung bestimmen.';
                      }

                      return (
                        <div className="bg-white border border-home-grau/30 rounded-lg p-3 space-y-2.5 text-xs text-slate-705">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Empfohlene Probenanzahl (Lehr-Richtwert – maßgebend ist der objektspezifische Prüfplan):</span>
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
                        <strong>Die Dreifach-Regel (d ≥ 3 · D_max):</strong> Ist der Kerndurchmesser kleiner als das Dreifache des Größtkorns der Gesteinskörnung, wirken einzelne große Körner im schmalen Zylinder wie Störkörper – die Ergebnisse streuen stark. Regelkerne haben d = 100 mm oder 150 mm; kleinere Kerne (z. B. 50 mm) lässt DIN EN 13791 nur mit erhöhter Probenanzahl zu.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">2</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Schlankheitseinfluss (h/d-Verhältnis):</strong> Die Stahlplatten der Prüfpresse behindern die Querdehnung des Betonkerns an den Endflächen durch Reibung. Bei kurzen Kernen (h/d = 1) stützt dieser Effekt den Kern weitgehend; das Ergebnis entspricht nach DIN EN 13791 einer In-situ-<em>Würfel</em>druckfestigkeit. Erst bei h/d = 2 herrscht im Mittelbereich ein nahezu einachsiger Spannungszustand – das Ergebnis entspricht der In-situ-<em>Zylinder</em>druckfestigkeit.
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
                      <select aria-label="Maximales Gesteinskorn (D_max)" 
                        className="w-full bg-white border border-home-grau/30 rounded p-1.5 font-mono text-slate-805 text-xs"
                        value={dMax} 
                        onChange={(e) => setDMax(Number(e.target.value))}
                      >
                        <option value="8">8 mm (z.B. Estrich / Feinkorn)</option>
                        <option value="16">16 mm (Standard-Beton)</option>
                        <option value="22">22 mm (Konstruktionsbeton, grobe Sieblinie)</option>
                        <option value="32">32 mm (Grobkorn, z. B. Massenbeton)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Geplanter Bohrkern-Durchmesser (d):</label>
                      <select aria-label="Geplanter Bohrkern-Durchmesser (d)" 
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
                      <select aria-label="Gewonnene Prüf-Höhe (h)" 
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
                      // Umrechnung auf h/d = 2 (Literaturansatz ASTM C42/C42M, Tabelle der Korrekturfaktoren;
                      // DIN EN 13791 regelt nur h/d = 1 (→ Würfel) und h/d = 2 (→ Zylinder)).
                      const astmStuetz: [number, number][] = [[1.0, 0.87], [1.25, 0.93], [1.5, 0.96], [1.75, 0.98], [2.0, 1.0]];
                      let correctionFactor = NaN;
                      if (lambda >= 1.0 && lambda <= 2.0) {
                        for (let i = 0; i < astmStuetz.length - 1; i++) {
                          const [l0, k0] = astmStuetz[i];
                          const [l1, k1] = astmStuetz[i + 1];
                          if (lambda >= l0 && lambda <= l1) {
                            correctionFactor = k0 + (k1 - k0) * (lambda - l0) / (l1 - l0);
                            break;
                          }
                        }
                      }

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
                                ({lambda === 1.0 ? 'entspricht Würfel (DIN EN 13791)' : lambda === 2.0 ? 'entspricht Zylinder (DIN EN 13791)' : lambda < 1.0 ? 'zu kurz – nicht prüfbar' : lambda > 2.0 ? 'zu lang – auf h/d = 2 kürzen' : 'Zwischenwert – Umrechnung nötig'})
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block font-bold leading-none">Umrechnungsfaktor:</span>
                              <strong className="font-mono text-xs text-indigo-700 block mt-1">{formatDeZahl(correctionFactor, 3)}</strong>
                              <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">auf h/d = 2 (Literaturansatz ASTM C42; nur für 1 ≤ h/d ≤ 2)</span>
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
                        <strong>Verschleppungsverbot &amp; Stufenbohrung:</strong> Wird ein Bohrloch tiefer getrieben, rieselt hochbelastetes Bohrmehl von der Oberfläche hinab. Bei der stufenweisen Probe (z. B. in Tiefenstufen von 10 mm) muss vor jedem tieferen Schritt das Loch penibelst staubfrei ausgesaugt und die Bohrkrone abgebürstet werden (Vermeidung von Verschleppungsfehlern).
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">✔</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Ausreichende Probenmenge (Richtwert ≥ 5 g je Tiefenstufe):</strong> Für die nasschemische Bestimmung des Chloridgehalts (Aufschluss mit Salpetersäure und Titration nach DIN EN 14629, z. B. potentiometrisch oder nach Volhard) muss genügend Bohrmehl vorliegen; die konkrete Mindestmenge legt das Prüflabor fest. Bei geringen Bohrdurchmessern müssen daher mehrere benachbarte Löcher für denselben Tiefenbereich vereinigt werden.
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
                        <span className="text-shiraz font-mono font-bold">{formatDeWert(numHoles)} Löcher</span>
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
                              Die gewonnene Menge liegt unter dem hier angesetzten Richtwert von 5 g. Es sollte der Bohrdurchmesser vergrößert oder mehr Löcher vereinigt werden, um repräsentative Zementsteingehalte zu sichern.
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
                Der Rückprallhammer (Schmidt-Hammer, DIN EN 12504-2) dient vor allem der schnellen, zerstörungsfreien Beurteilung der Gleichmäßigkeit des Betons; eine Festigkeitsschätzung ist nur über eine Kalibrierung an Bohrkernen nach DIN EN 13791 zulässig. Die gemessene Härte (Rebound-Wert R) reagiert jedoch hochsensibel auf Oberflächenstörungen.
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
                        <strong>Der Karbonatisierungsfehler (Karbonatisierungshaut):</strong> Atmosphärisches CO₂ wandelt Calciumhydroxid in der Randzone in Calciumcarbonat (CaCO₃) um. Die dichtere, härtere Randzone erhöht den Rückprallwert – bei älterem Beton mit tiefer Karbonatisierung wird die Festigkeit ohne Kalibrierung deutlich überschätzt. Die Prüffläche wird nach DIN EN 12504-2 nur mit einem Schleifstein geglättet; die Karbonatisierungsschicht bleibt dabei erhalten. Deshalb wird die Karbonatisierungstiefe mitgemessen und der Einfluss über Vergleichsbohrkerne (DIN EN 13791) erfasst.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">▲</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Winkelkorrektur (Gravitations-Einfluss):</strong> Die Schwerkraft wirkt auf den zurückprallenden Schlagbolzen. Schlägt man senkrecht nach unten (Bodenplatte), muss die Masse gegen die Schwerkraft zurückprallen – der Wert fällt zu <em>niedrig</em> aus, die Korrektur ist positiv. Gegen eine Decke (nach oben) unterstützt die Schwerkraft den Rückprall – der Wert fällt zu <em>hoch</em> aus, die Korrektur ist negativ. Die Korrekturwerte sind gerätespezifisch (Bedienungsanleitung des Herstellers); bei Kalibrierung nach DIN EN 13791 wird in derselben Schlagrichtung kalibriert.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-shiraz/10 text-shiraz font-bold rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">▲</div>
                      <p className="text-xs text-text-main/80 leading-relaxed">
                        <strong>Messfeld &amp; Auswertung nach DIN EN 12504-2:</strong> Ein einzelner Schlag hat keine Aussagekraft. Je Prüffläche (ca. 300 mm × 300 mm) werden mindestens 9 Schläge mit mindestens 25 mm Abstand zueinander und zum Rand ausgeführt. Kennwert ist der <strong>Median</strong>. Weichen mehr als 20 % der Einzelwerte um mehr als 25 % vom Median ab, wird die gesamte Messreihe verworfen. Schläge, die eine oberflächennahe Pore eindrücken, werden nicht gewertet.
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
                        <span>Rohwert Rückprall (Median R):</span>
                        <span className="text-shiraz font-mono font-bold">{formatDeWert(rawR)} Skt.</span>
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
                      // Winkelkorrektur: typische Herstellerwerte für Schmidt-Hammer Typ N (gerätespezifisch!),
                      // linear interpoliert zwischen R = 20 und R = 60.
                      // Nach unten (−90°): Rückprall gegen die Schwerkraft → R zu niedrig → Korrektur positiv.
                      // Nach oben (+90°): Rückprall mit der Schwerkraft → R zu hoch → Korrektur negativ.
                      const rKlemm = Math.min(60, Math.max(20, rawR));
                      const interpol = (a20: number, a60: number) => a20 + (a60 - a20) * (rKlemm - 20) / 40;
                      let angleCorr = 0;
                      if (impactAngle === -90) angleCorr = interpol(3.4, 1.7);
                      else if (impactAngle === 90) angleCorr = interpol(-5.4, -2.3);

                      // Karbonatisierung: Lehrmodell (−0,15 Skt. je mm, max. −6 Skt.). Kein Normansatz –
                      // in der Praxis wird der Einfluss über Vergleichsbohrkerne (DIN EN 13791) kalibriert.
                      let carbCorr = carbX > 0 ? -0.15 * carbX : 0;
                      if (carbCorr < -6.0) carbCorr = -6.0;

                      const finalR = rawR + angleCorr + carbCorr;
                      // Festigkeitsschätzung: lineare Lehr-Näherung f ≈ 1,4·R − 20 (nicht normativ).
                      const rawEstStr = Math.max(10, (rawR * 1.4) - 20);
                      const finalEstStr = Math.max(10, (finalR * 1.4) - 20);

                      return (
                        <div className="p-3 bg-white border border-home-grau/30 rounded-lg space-y-2 mt-2 leading-relaxed text-[11px] text-slate-700">
                          <div className="flex justify-between items-center pb-1 border-b border-home-grau/30 text-shiraz font-bold">
                            <span>Ergebnis-Klassifizierung:</span>
                            <span className="font-mono text-slate-900 font-bold text-xs">
                              R korr. = {formatDeZahl(finalR, 1)}
                            </span>
                          </div>
                          <div className="space-y-1 text-slate-600 text-[10px]">
                            <div className="flex justify-between">
                              <span>Korrektur Karbonatisierung (Lehrmodell):</span>
                              <strong className="font-semibold text-rose-800">{formatDeZahl(carbCorr, 1)} Skt.</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Korrektur Winkel (Herstellerrichtwert):</span>
                              <strong className="font-semibold text-indigo-800">{angleCorr > 0 ? `+${formatDeZahl(angleCorr, 1)}` : formatDeZahl(angleCorr, 1)} Skt.</strong>
                            </div>
                            <div className="flex justify-between border-t border-home-grau/30 pt-1 text-[11px] text-slate-850">
                              <span className="font-bold">Schätzung aus Rohwert (Lehr-Näherung):</span>
                              <span className="font-mono text-red-650 font-bold">~{formatDeZahl(rawEstStr, 0)} MPa</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-850">
                              <span className="font-bold">Schätzung aus korrigiertem R (Lehr-Näherung):</span>
                              <span className="font-mono text-emerald-700 font-bold">~{formatDeZahl(finalEstStr, 0)} MPa</span>
                            </div>
                          </div>
                          <p className="text-[9.5px] text-slate-500 leading-tight pt-1">
                            Lehrmodell: Winkelkorrektur nach typischen Herstellertabellen, Karbonatisierungsabzug und Festigkeitsgerade sind didaktische Näherungen. Eine belastbare Festigkeitsaussage ist nur mit einer Beziehung aus Vergleichsbohrkernen nach DIN EN 13791 möglich.
                          </p>
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

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <div className="flex flex-col gap-6">
        <FormulaDerivationBox
          title="Beispiel 1: Reicht das Bohrmehl einer Tiefenstufe für die Chloridanalyse?"
          zielGleichung="m = n \cdot \pi \cdot \left(\frac{D_b}{2}\right)^2 \cdot \Delta z \cdot \rho"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Parkdeckstütze, Bohrdurchmesser D_b = 16 mm, Tiefenstufe Δz = 10 mm, Rohdichte des Bohrmehls als Beton ρ ≈ 2,2 g/cm³, Richtwert des Labors: mindestens 5 g je Stufe.', formel: 'D_b = 1{,}6\\,\\text{cm},\\quad \\Delta z = 1{,}0\\,\\text{cm}' },
            { titel: 'Volumen je Bohrloch', erklaerung: 'Zylindervolumen der Tiefenstufe:', formel: 'V = \\pi \\cdot 0{,}8^2 \\cdot 1{,}0 = 2{,}01\\,\\text{cm}^3' },
            { titel: 'Masse je Bohrloch', erklaerung: 'Ein einzelnes Loch liefert zu wenig Material:', formel: 'm_1 = 2{,}01 \\cdot 2{,}2 = 4{,}42\\,\\text{g} < 5\\,\\text{g}' },
            { titel: 'Zwei Bohrlöcher vereinigen', erklaerung: 'Das Bohrmehl zweier benachbarter Löcher derselben Tiefenstufe wird zu einer Probe vereinigt:', formel: 'm_2 = 2 \\cdot 4{,}42 = 8{,}85\\,\\text{g} \\geq 5\\,\\text{g}' }
          ]}
          ergebnisHinweis="Jede Tiefenstufe braucht zwei vereinigte Bohrungen. Zwischen den Stufen das Loch aussaugen, sonst verschleppt hochbelastetes Mehl aus der Randzone in die tieferen Proben."
          normQuelle="DIN EN 14629:2007-06 (Chloridbestimmung); Mengenrichtwert laborabhängig"
        />
        <FormulaDerivationBox
          title="Beispiel 2: Bohrkern mit h/d = 1,5 auf Zylinderfestigkeit umrechnen"
          zielGleichung="f_{c,\,h/d=2} = k(\lambda) \cdot f_{core},\quad \lambda = h/d"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Bohrkern aus einer Decke, d = 100 mm, nach dem Planschleifen h = 150 mm, Größtkorn D_max = 16 mm, gemessene Bruchspannung f_core = 35,0 N/mm².', formel: 'd \\geq 3 \\cdot D_{max} = 48\\,\\text{mm} \\;\\checkmark' },
            { titel: 'Schlankheit', erklaerung: 'Der Kern liegt zwischen den beiden in DIN EN 13791 geregelten Fällen h/d = 1 (Würfel) und h/d = 2 (Zylinder):', formel: '\\lambda = \\frac{150}{100} = 1{,}5' },
            { titel: 'Korrekturfaktor', erklaerung: 'Literaturansatz ASTM C42 für die Umrechnung auf h/d = 2:', formel: 'k(1{,}5) = 0{,}96' },
            { titel: 'Ergebnis', erklaerung: 'Gleichwertige Zylinderdruckfestigkeit dieses einen Kerns:', formel: 'f_{c,\\,h/d=2} = 0{,}96 \\cdot 35{,}0 = 33{,}6\\,\\text{N/mm}^2' }
          ]}
          ergebnisHinweis="Ein Einzelkern ist kein Festigkeitsnachweis. Die charakteristische In-situ-Festigkeit wird nach DIN EN 13791 aus mehreren Kernen eines Prüfbereichs statistisch ermittelt."
          normQuelle="DIN EN 12504-1:2021-02, DIN EN 13791:2020-02; Faktor k nach ASTM C42/C42M (Literaturansatz)"
        />
        <FormulaDerivationBox
          title="Beispiel 3: Rückprallwert an einer Deckenunterseite korrigieren"
          zielGleichung="R_{korr} = R_{Median} + \Delta R_{\alpha}"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Prüffläche an einer Deckenunterseite, Schlagrichtung nach oben (α = +90°), Median aus 9 gültigen Schlägen: R = 36.', formel: 'R_{Median} = 36' },
            { titel: 'Richtung der Korrektur', erklaerung: 'Nach oben unterstützt die Schwerkraft den Rückprall – der Wert ist zu hoch, die Korrektur also negativ.', formel: '\\Delta R_{\\alpha} < 0' },
            { titel: 'Korrekturwert (Herstellertabelle, interpoliert)', erklaerung: 'Typische Werte Typ N: −5,4 bei R = 20 und −2,3 bei R = 60:', formel: '\\Delta R_{\\alpha} = -5{,}4 + 3{,}1 \\cdot \\frac{36-20}{40} = -4{,}2' },
            { titel: 'Ergebnis', erklaerung: 'Auf horizontale Schlagrichtung bezogener Rückprallwert:', formel: 'R_{korr} = 36 - 4{,}2 = 31{,}8' }
          ]}
          ergebnisHinweis="Die Korrekturwerte sind gerätespezifisch. Für eine Festigkeitsaussage wird R mit Vergleichsbohrkernen derselben Bauteile kalibriert (DIN EN 13791)."
          normQuelle="DIN EN 12504-2:2021-10 (Durchführung, Median); Korrekturwerte nach Herstellerangaben"
        />
      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="probenahme" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Probenahme', url: 'https://de.wikipedia.org/wiki/Probenahme' },
          { title: 'Bauwerksdiagnostik', url: 'https://de.wikipedia.org/wiki/Bauwerksdiagnostik' },
          { title: 'Rückprallhammer', url: 'https://de.wikipedia.org/wiki/R%C3%BCckprallhammer' }
        ]}
        literatur={[
          'Ersatzbaustoffverordnung (EBV) vom 09.07.2021 (BGBl. I S. 2598), in Kraft seit 01.08.2023 – § 8 Probenahme',
          'LAGA PN 98: Richtlinie für das Vorgehen bei physikalischen, chemischen und biologischen Untersuchungen im Zusammenhang mit der Verwertung/Beseitigung von Abfällen (Stand Mai 2019)',
          'ASTM C42/C42M: Standard Test Method for Obtaining and Testing Drilled Cores and Sawed Beams of Concrete (Korrekturfaktoren für h/d < 2)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'Ersatzbaustoffverordnung (EBV) – § 8 Probenahme und Probenaufbereitung', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/__8.html' },
          { title: 'LAGA PN 98 (Beprobung von Haufwerken - Richtlinie für das Vorgehen)', url: 'https://www.laga-online.de/' },
          { title: 'DIN 19698-1:2014-05 / DIN 19698-2:2016-12 (Probenahme von festen und stichfesten Materialien)' },
          { title: 'DIN 19747:2009-07 (Probenvorbehandlung, -vorbereitung und -aufarbeitung)' },
          { title: 'DIN EN 932-1:1996-11 / DIN EN 932-2:1999-03 (Gesteinskörnungen – Probenahme; Einengen von Laboratoriumsproben)' },
          { title: 'DIN 19528:2009-01 (Elution von Feststoffen – Perkolationsverfahren) / DIN 19529:2015-12 (Schüttelverfahren W/F = 2 l/kg)' },
          { title: 'DIN EN 12504-1:2021-02 (Prüfung von Beton in Bauwerken - Teil 1: Bohrkernproben)' },
          { title: 'DIN EN 12504-2:2021-10 (Prüfung von Beton in Bauwerken - Teil 2: Bestimmung der Rückprallzahl)' },
          { title: 'DIN EN 13791:2020-02 + A20:2022-04 (Bewertung der Druckfestigkeit von Beton in Bauwerken)' },
          { title: 'DIN EN 14629:2007-06 (Bestimmung des Chloridgehalts in Festbeton)' }
        ]}
        formeln={[
          {
            formel: 'd_{\\text{Kern}} \\ge 3 \\cdot D_{\\text{max}}',
            erklaerung: 'Geometrische Mindestanforderung an den Bohrkerndurchmesser d_Kern bezogen auf das Größtkorn D_max der Gesteinskörnung zur Begrenzung der Streuung.',
            quelle: 'Fachregel; vgl. DIN EN 12504-1 / DIN EN 13791'
          },
          {
            formel: 'f_{c,\\,h/d=2} = k(\\lambda) \\cdot f_{\\text{core}},\\quad \\lambda = h/d,\\; k(1{,}0) = 0{,}87 \\ldots k(2{,}0) = 1{,}00',
            erklaerung: 'Umrechnung der Bohrkernfestigkeit f_core mit Schlankheit 1 ≤ h/d ≤ 2 auf die gleichwertige Festigkeit eines Kerns mit h/d = 2. DIN EN 13791 ordnet h/d = 1 der Würfel- und h/d = 2 der Zylinderdruckfestigkeit zu; Zwischenwerte nach Literaturansatz.',
            quelle: 'ASTM C42/C42M; DIN EN 13791:2020-02'
          },
          {
            formel: 'm = n \\cdot \\pi \\cdot (D_b/2)^2 \\cdot \\Delta z \\cdot \\rho',
            erklaerung: 'Bohrmehlmasse je Tiefenstufe aus n vereinigten Bohrungen mit Durchmesser D_b, Stufenhöhe Δz und Rohdichte ρ.',
            quelle: 'Geometrie; Probenahme nach DIN EN 14629'
          }
        ]}
        lastReviewed="Oktober 2026 (AP 4 Labor: Probenahme nach EBV § 8/LAGA PN 98, Bohrkerne, Chloridbeprobung und Rückprallprüfung gegen DIN EN 12504-1/-2, DIN EN 13791 und DIN EN 14629 geprüft; fachliche Freigabe durch den Autor ausstehend)"
      />
    </div>
  );
}
