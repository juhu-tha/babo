import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  Landmark, Hammer, Scale, Coins, 
  ShieldAlert, Check, TrendingUp, AlertTriangle, BookOpen, Info
} from 'lucide-react';

export default function Denkmalpflege() {
  const [activeSubTab, setActiveSubTab] = useState<'allgemeines' | 'baydschg' | 'bauphysik' | 'ablauf'>('allgemeines');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-6 border-b border-home-grau/30 pb-6">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Landmark className="text-shiraz" size={24} /> Denkmalschutz, Denkmalpflege & Bayerisches Baurecht
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Wissenschaftliche und bautechnische Standards historischer Bausubstanz, rechtliche Fundamente des 
            Bayerischen Denkmalschutzgesetzes (BayDSchG), anerkannte Sanierungskonzepte nach WTA sowie wirtschaftliche Steuerung durch Sonder-AfA.
          </p>
        </div>
        </div>

        {/* Dynamic Sub-Navigation Grid */}
        <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-2xl mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'allgemeines' as const, label: 'Grundlagen & Charta', sub: 'Definitionen, Werte & Charta von Venedig', icon: Landmark },
              { id: 'baydschg' as const, label: 'Fokus Bayern (BayDSchG)', sub: 'Deklaratorisches Prinzip, Art. 6, Schatzregal', icon: Scale },
              { id: 'bauphysik' as const, label: 'Bauphysik & Innendämmung', sub: 'GEG-Befreiungen, WTA-Vorgaben & Kalk', icon: Hammer },
              { id: 'ablauf' as const, label: 'Behörden & Steuern', sub: 'Genehmigungen & Sonder-AfA (§ 7i EStG)', icon: Coins }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-start gap-1.5 text-left h-full cursor-pointer group ${
                    isActive 
                      ? 'bg-shiraz border-shiraz text-white shadow-md shadow-rose-100' 
                      : 'bg-white border-home-grau/30 hover:bg-slate-100 text-slate-700 hover:border-home-grau/30 hover:shadow-sm'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'bg-rose-50 text-shiraz group-hover:bg-rose-100 transition-colors'}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-xs font-bold leading-tight mt-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {tab.label}
                  </span>
                  <span className={`text-xs leading-tight ${isActive ? 'text-rose-100/90' : 'text-slate-500'}`}>
                    {tab.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content area */}
        <div className="space-y-6">

          {/* Sub-Tab 1: Allgemeines */}
          {activeSubTab === 'allgemeines' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl flex flex-col md:flex-row gap-5">
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Info size={16} className="text-shiraz" /> Was unterscheidet Schutz und Pflege?
                  </h3>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    Im Baualltag werden Denkmalschutz und Denkmalpflege oft synonym verwendet, beschreiben aber zwei völlig eigenständige Säulen:
                  </p>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5">
                    <li>
                      <strong>Denkmalschutz (Hoheitlich):</strong> Die rechtliche Ebene, verankert in den Denkmalschutzgesetzen der Länder. Sie umfasst Verbote, Nutzungsauflagen und Genehmigungsverfahren zur Gefahrenabwehr.
                    </li>
                    <li>
                      <strong>Denkmalpflege (Wissenschaftlich/Praktisch):</strong> Die handwerkliche und wissenschaftliche Erhaltung. Das Ziel ist es, Schäden fachgerecht zu beheben, den bauzeitlichen Zustand zu analysieren und ein Gebäude im Detail materiell und visuell zu bewahren.
                    </li>
                  </ul>
                </div>
                <div className="md:w-px md:bg-slate-200 self-stretch"></div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-slate-900 text-sm">Die drei Denkmalkategorien</h3>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                      <strong className="text-slate-800">1. Baudenkmal:</strong> Bauliche Anlagen, deren Erhalt wegen geschichtlicher, künstlerischer oder städtebaulicher Relevanz im öffentlichen Interesse steht. Betrifft Außenhüllen und Innenstrukturen (z.B. Treppenläufe, Vertäfelungen).
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                      <strong className="text-slate-800">2. Ensemble (Gesamtanlage):</strong> Ein zusammenhängendes Stadt- oder Straßenbild (z.B. Altstadtgassen, historische Vororte). Einzelgebäude müssen hierbei keine Denkmale sein, das Gesamterscheinungsbild steht aber unter Schutz.
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                      <strong className="text-slate-800">3. Bodendenkmal:</strong> Archäologische Güter im Boden (Siedlungsgruben, mittelalterliche Fundamente, Gräber). Treten meist unerwartet bei Erdarbeiten zutage.
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-home-grau/30 rounded-2xl p-5 space-y-4 shadow-sm bg-white">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-shiraz" size={20} />
                  <h4 className="font-bold text-slate-900 text-sm">Denkmalpflegerische Grundsätze (u. a. Charta von Venedig 1964, Art. 9–12)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Die 1964 verabschiedete Charta von Venedig ist die international anerkannte Leitlinie der Denkmalpflege. Reversibilität und Materialverträglichkeit sind später formulierte Fachgrundsätze, die auf ihr aufbauen:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-home-grau/30 flex gap-3">
                    <span className="text-shiraz font-mono font-bold text-xs mt-0.5">I.</span>
                    <div>
                      <strong className="text-slate-800 text-xs block mb-1">Erhalt der Originalsubstanz</strong>
                      <p className="text-xs text-slate-600 leading-normal">
                        Jedes Fragment des Originals ist unwiederbringlich geschichtlicher Zeuge. Konservieren (Erhalt & Sichern) steht grundsätzlich vor Restaurieren (Ergänzen oder kosmetisch Verändern).
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-home-grau/30 flex gap-3">
                    <span className="text-shiraz font-mono font-bold text-xs mt-0.5">II.</span>
                    <div>
                      <strong className="text-slate-800 text-xs block mb-1">Materialverträglichkeit (späterer Fachgrundsatz, nicht Wortlaut der Charta)</strong>
                      <p className="text-xs text-slate-600 leading-normal">
                        Neue Baustoffe müssen materialtechnisch und chemisch mit dem historischen Gefüge kompatibel sein (z.B. weicher Luftkalk statt harter Zementmischungen bei antiken Ziegeln).
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-home-grau/30 flex gap-3">
                    <span className="text-shiraz font-mono font-bold text-xs mt-0.5">III.</span>
                    <div>
                      <strong className="text-slate-800 text-xs block mb-1">Reversibilität</strong>
                      <p className="text-xs text-slate-600 leading-normal">
                        Denkmalgerechte Eingriffe sollten bei Bedarf wieder rückgängig gemacht werden können (reversibel sein), ohne die dahinterliegende historische Substanz dauerhaft zu beschädigen.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-home-grau/30 flex gap-3">
                    <span className="text-shiraz font-mono font-bold text-xs mt-0.5">IV.</span>
                    <div>
                      <strong className="text-slate-800 text-xs block mb-1">Erkennbarkeit von Ergänzungen</strong>
                      <p className="text-xs text-slate-600 leading-normal">
                        Fehlende Teile dürfen ersetzt werden, um das Denkmal statisch oder formal zu sichern. Ergänzungen müssen sich jedoch dezent als Zeugen unserer heutigen Epoche abheben und dürfen nicht historisierend fälschen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Fokus Bayern (BayDSchG) */}
          {activeSubTab === 'baydschg' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              
              {/* Highlight Banner: Das Deklaratorische Prinzip */}
              <div className="bg-rose-50/50 border border-rose-200/60 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-rose-100 rounded-lg text-shiraz">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Das Deklaratorische Prinzip (Art. 2 BayDSchG)</h3>
                    <span className="text-xs text-shiraz font-semibold tracking-wider uppercase block">HOCHPRÄZISES LANDESRECHT IN GANZ BAYERN</span>
                  </div>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed md:pr-4">
                  <p className="mb-2">
                    Ob die Eintragung in die Denkmalliste <strong>nachrichtlich (deklaratorisch)</strong> oder <strong>konstitutiv</strong> wirkt (Schutz erst ab Bescheid), regelt das jeweilige Landesdenkmalschutzgesetz. In Bayern gilt das nachrichtliche System: Ein Baudenkmal ist auch ohne Listeneintrag geschützt. 
                  </p>
                  <p className="bg-white p-3 rounded-xl border border-rose-100 text-slate-800 shadow-sm leading-relaxed">
                    <strong>Der bayerische Systemwechsel:</strong> In Bayern gilt das <strong>deklaratorische Prinzip</strong> (Art. 2 BayDSchG). Ein Gebäude ist gesetzlich geschütztes Baudenkmal, sobald es die wissenschaftlichen/historischen Anforderungen des Art. 1 erfüllt. Die <em>Bayerische Denkmalliste</em> (und damit der Denkmalatlas) ist rein nachrichtlich! 
                  </p>
                  <p className="mt-2 text-rose-800 font-medium">
                    ⚠️ Planungsrisiko: Findet ein Architekt im Zuge eines Umbaus bauhistorisch hochbedeutende Fachwerkreste in einer alten Scheune, die nicht gelistet ist, greift der volle Denkmalschutz sofort kraft Gesetzes. Unerlaubtes Abreißen ist eine Ordnungswidrigkeit nach Art. 20 BayDSchG mit hohem Bußgeld; strafrechtlich kann § 304 StGB greifen.
                  </p>
                </div>
              </div>

              {/* Erlaubnispflicht & Umgebungsschutz */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-3 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-mono font-bold">Art. 6 Abs. 1 BayDSchG</span>
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Erlaubnispflichten am Baudenkmal</h4>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Sämtliche Eingriffe, Sanierungen, Umnutzungen oder bauliche Änderungen bedürfen der vorherigen und schriftlichen <strong>Denkmalschutzrechtlichen Erlaubnis</strong> durch die Untere Denkmalschutzbehörde. 
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Wird das Bauvorhaben baugenehmigungspflichtig, entscheidet die Bauaufsichtsbehörde im Baugenehmigungsverfahren über die denkmalrechtliche Erlaubnis mit (BayDSchG, Erlaubnisverfahren – Artikel in der geltenden Fassung prüfen).
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2 text-xs text-slate-500 rounded border border-home-grau/30 mt-2">
                     Beispiel: Austausch historischer Kastenfenster gegen Kunststofffenster ohne Erlaubnis führt zu hohem Bußgeld und Rückbauverpflichtung.
                  </div>
                </div>

                <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-3 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-mono font-bold">Art. 6 BayDSchG (Umgebung) – Absatz prüfen</span>
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Der Umgebungsschutz</h4>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Der Schutzbereich endet in Bayern nicht an der Grundstücksgrenze des Denkmals! Auch wer in der <strong>Nähe von Baudenkmälern</strong> neue bauliche Anlagen errichten oder verändern will, benötigt eine Genehmigung.
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Das Kriterium ist die Beeinträchtigung des "prägenden Erscheinungsbildes" des gesetzlich geschützten Nachbarn.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2 text-xs text-slate-500 rounded border border-home-grau/30 mt-2">
                     Beispiel: Die Errichtung eines modernen Flachdach-Gewerberiegels in direkter Achse zu einem barocken Schlossgarten erfordert eine Umgebungsschutz-Prüfung.
                  </div>
                </div>

              </div>

              {/* Fundmeldungen & Das bayerische Schatzregal */}
              <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-amber-600" size={18} />
                  <h4 className="font-bold text-slate-800 text-sm">Archäologischer Fund beim Aushub: Fundmeldung &amp; Baustopp (Art. 7 u. 8)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tritt im Rahmen von Erdarbeiten (z.B. Gründung Einfamilienhaus oder Industriebau) ein möglicher historischer Fund (Mauerreste, Tonscherben, Fundamente) zutage, ordnet das Gesetz folgendes Prozedere an:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/30">
                    <span className="font-bold text-slate-950 block mb-1">1. Stop &amp; Absichern</span>
                    Der Archäologie-Befund muss unverzüglich gesichert werden. Die Erdarbeiten an dieser Fundstelle sind einzustellen.
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/30">
                    <span className="font-bold text-slate-950 block mb-1">2. Sofortige Meldung</span>
                    Anzeige des Fundes bei der Unteren Denkmalschutzbehörde (Landratsamt) oder direkt beim BLfD.
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/30">
                    <span className="font-bold text-slate-950 block mb-1">3. Wartezeit (Art. 8 Abs. 2)</span>
                    Die Fundstelle muss unverändert bleiben. Diese Pflicht erlischt nach einer Woche, oder sobald die Denkmalbehörde den Fund dokumentiert und freigegeben hat.
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-home-grau/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded uppercase">Rechtsänderung</span>
                    <h5 className="font-bold text-slate-800 text-xs">Änderung Juli 2023: Einführung des bayerischen Schatzregals (heute Art. 9 BayDSchG)</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Jahrzehntelang war Bayern das einzige deutsche Bundesland ohne ein vollständiges staatliches Eigentumsrecht an Bodenschätzen (Schatzregal). Es galt die römische <em>Hadrianische Teilung</em> (Fund gehört zu 50% dem Finder und 50% dem Grundstückseigentümer). 
                  </p>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-home-grau/30 mt-2 leading-relaxed">
                    Zum <strong>1. Juli 2023</strong> wurde das bayerische Schatzregal in Kraft gesetzt (heute Art. 9 BayDSchG). Bewegliche Bodendenkmäler, die herrenlos oder so lange verborgen waren, dass ihr Eigentümer nicht mehr zu ermitteln ist, werden <strong>mit der Entdeckung Eigentum des Freistaates Bayern</strong>. Grundeigentümer und Finder können eine Entschädigung bzw. Belohnung erhalten (nicht bei geringwertigen oder unrechtmäßigen Funden).
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* Sub-Tab 3: Sanierung & Bauphysik */}
          {activeSubTab === 'bauphysik' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GEG Befreiung */}
                <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-3 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="text-emerald-600" size={16} /> § 105 GModG (vormals GEG)
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Das Gebäudemodernisierungsgesetz (vormals GEG) stellt Anforderungen an Änderungen und Nachrüstungen im Bestand (§§ 35, 36). Gemäß <strong>§ 105 GModG (vormals GEG)</strong> kann bei Baudenkmälern und sonstiger besonders erhaltenswerter Bausubstanz von den Anforderungen abgewichen werden, soweit deren Erfüllung die Substanz oder das Erscheinungsbild beeinträchtigt oder zu unverhältnismäßigem Aufwand führt (Kann-Regelung, keine automatische Befreiung).
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Eine Pflicht zur Durchführung energetischer Verbesserungen (z.B. Dachbodendämmung, Fassadendämmung) entfällt, wenn die Maßnahme das äußere Erscheinungsbild unzumutbar verzerrt oder die Substanz schädigt.
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-800 text-xs leading-relaxed">
                    <strong>Tipp für Energieberater:</strong> Bei förderfähigen Sanierungen für Denkmäler gelten verringerte energetische Anforderungen der KfW/BAFA (&quot;Effizienzhaus Denkmal&quot;).
                  </div>
                </div>

                {/* Materialverträglichkeit */}
                <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-3 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="text-rose-600" size={16} /> Materialverträglichkeit &amp; Putzschäden
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Ein Hauptgrund für Schäden bei der Denkmalsanierung ist die fehlerhafte Materialwahl. Die Härte und Diffusionsdichte moderner Zementputze, Sanierputze mit hohem Zementanteil oder dichter Kunstharzfarben schädigen historisches Sichtmauerwerk nachhaltig.
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Da Feuchtigkeit nicht abtrocknen kann und Zementsalze Kristallisierungsdrücke aufbauen, platzt der weichere historische Backstein oder Tuffstein unter Frostbelastung großflächig weg.
                    </p>
                  </div>
                  <div className="p-3 bg-rose-50/40 border border-rose-100 rounded-xl text-rose-800 text-xs leading-relaxed">
                    <strong>Das Gebot:</strong> Verwendung elastischerer, hoch diffusionsoffener Bindemittel wie <strong>Luftkalkputz</strong>, <strong>natürlich hydraulischer Kalk (NHL, DIN EN 459-1), Trasskalk</strong> und pigmentierter <strong>Silikatfarben</strong>.
                  </div>
                </div>
              </div>

              {/* Innendämmung und WTA Richtlinien */}
              <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-4 shadow-sm">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Hammer size={18} className="text-shiraz animate-bounce" /> Innendämmung nach WTA (Richtlinie 6-4 / 6-5)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Da Außendämmungen (WDVS) wegen Denkmalschutzauflagen fast ausnahmslos unzulässig sind, bleibt nur die <strong>Innendämmung</strong>. Aus bauphysikalischer Sicht birgt diese das höchste Schadenspotenzial. Der Taupunkt wandert nach innen. Kondensat reichert sich hinter der Dämmung an.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-home-grau/30">
                  <h5 className="font-bold text-slate-800 text-xs">Zwei bewährte Systemprinzipien:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-900">
                    <div className="bg-white p-3 rounded-lg border border-home-grau/30 space-y-1">
                      <span className="text-rose-700 block font-bold">1. Kapillaraktive, dampfoffene Systeme:</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        Wirkt ohne Dampfbremse. Verwendet werden <strong>Calciumsilikatplatten</strong> oder Dämmputze aus Luftkalk/Perlite. Kondensat, das bei extremem Frost ausfällt, wird kapillar von den Platten aufgenommen und bei Erwärmung schadlos wieder in den Raum verdunstet.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-home-grau/30 space-y-1">
                      <span className="text-rose-700 block font-bold">2. Holzweichfaserplatten in Lehmbettung:</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        Kapillaraktives, diffusionsoffenes, sorptionsfähiges System. Der <strong>Lehmunterputz</strong> gleicht unebene historische Wände vollflächig aus. Dies vermeidet schädliche Hohlräume zwischen Dämmplatte und altem Mauerwerk (Gefahr von Konvektion &amp; stehendem Wasser).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-xs bg-slate-100/50 p-2.5 rounded text-amber-950 font-medium">
                  <strong>WTA-Vorschrift:</strong> Die WTA-Merkblätter fordern für Innendämmungen grundsätzlich den Nachweis der Schadensfreiheit, entweder über vereinfachte tabellarische Kriterien oder mittels instationärer hygrothermischer Simulation (z.B. mit der Software DELPHIN oder WUFI).
                </div>
              </div>

            </div>
          )}

          {/* Sub-Tab 4: Behörden & Steuern */}
          {activeSubTab === 'ablauf' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              
              {/* Dreistufigkeit in Bayern */}
              <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-4 shadow-sm">
                <h4 className="font-bold text-slate-800 text-sm">Das denkmalpflegerische Dreistufen-System im Freistaat</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Wie fast der gesamte deutsche Föderalismus ist auch der bayerische Denkmalschutz dreistufig organisiert. Für Sie als Planer ist die Kenntnis der Zuständigkeiten elementar:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-slate-900">
                  <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl space-y-1">
                    <span className="text-slate-400 font-bold block text-xs uppercase">1. Oberste Behörde</span>
                    <strong className="text-slate-900 block font-bold">Staatsministerium</strong>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Bayerisches Staatsministerium für Wissenschaft und Kunst. Gibt Richtlinien vor und entscheidet über landesweite Verordnungen.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl space-y-1">
                    <span className="text-shiraz font-bold block text-xs uppercase">2. Fachbehörde</span>
                    <strong className="text-slate-900 block font-bold">BLfD (Landesamt)</strong>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      <strong>Bayerisches Landesamt für Denkmalpflege</strong> (Sitz in München; Dienststellen auf Schloss Seehof bei Bamberg, Regensburg und Thierhaupten). Das wissenschaftliche Beratungsgremium. Führt die Denkmalliste und den Denkmalatlas, hat jedoch keine ausführende Polizeigewalt.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl space-y-1">
                    <span className="text-slate-400 font-bold block text-xs uppercase">3. Untere Behörde</span>
                    <strong className="text-slate-900 block font-bold">Landratsamt / Stadtverwaltung</strong>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Die Vollzugsbehörde. Ansprechpartner für Bauanträge, Erlaubnisse nach Art. 6 BayDSchG und steuerliche Bescheinigungen. Sie holt im Verfahren die Stellungnahme des BLfD ein.
                    </p>
                  </div>
                </div>
              </div>

              {/* Steuerliche Denkmalabschreibung */}
              <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-shiraz animate-pulse" size={18} />
                  <h4 className="font-bold text-slate-800 text-sm">Die Sonder-AfA des Einkommensteuergesetzes (EStG): Der Finanzierungsmotor</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Die Sanierung historischer Gebäude verursacht häufig erhebliche Mehrkosten. Zum Ausgleich bietet das deutsche Steuerrecht durch die steuerliche Erleichterung (§§ 7i, 10f EStG) einen enormen Hebel.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                    <div className="space-y-1">
                      <strong className="text-xs text-slate-950 block">§ 7i EStG — Vermietung &amp; Betrieb</strong>
                      <span className="text-shiraz font-bold text-sm block">12 Jahre lang Abschreibung (100% der Kosten)</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Kapitalanleger können alle für den Erhalt erforderlichen und mit der Denkmalbehörde abgestimmten Sanierungsaufwendungen in den ersten 8 Jahren mit je <strong>9%</strong> und in den folgenden 4 Jahren mit je <strong>7%</strong> steuerlich voll absetzen.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                    <div className="space-y-1">
                      <strong className="text-xs text-slate-950 block">§ 10f EStG — Eigennutzung</strong>
                      <span className="text-shiraz font-bold text-sm block">10 Jahre lang Abschreibung (90% der Kosten)</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Wer das Denkmal selbst bewohnt, kann 10 Jahre lang jährlich je <strong>9%</strong> (insgesamt 90%) der begünstigten Aufwendungen als Sonderausgaben geltend machen – begünstigt sind nur Maßnahmen, die nach Art und Umfang zur Erhaltung erforderlich sind, mit Bescheinigung der Denkmalbehörde.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 text-xs text-rose-900 leading-relaxed">
                  <strong>Wichtige Frist:</strong> Steuervorteile unterliegen strenger Abstimmungspflicht. Alle Baumaßnahmen müssen <strong>vor Beginn</strong> in einer schriftlichen Vereinbarung (Abstimmung) mit der Denkmalbehörde festgelegt werden. Nachträglich beantragte oder bereits gestartete Maßnahmen sind von der Steuerbescheinigung rechtlich zwingend ausgeschlossen!
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
      
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Kristallisationsdruck von Halit nach Correns"
        zielGleichung="p = \frac{R \cdot T}{V_m} \cdot \ln\frac{c}{c_s}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Natriumchlorid (Halit), molares Volumen V_m = 27,0 cm³/mol, T = 293 K, Übersättigung c/c_s = 2:', formel: 'R \\cdot T = 8{,}314 \\cdot 293 = 2\\,437\\,\\text{J/mol}' },
          { titel: 'Kristallisationsdruck', erklaerung: 'Einsetzen in die Correns-Gleichung:', formel: 'p = \\frac{2\\,437}{27{,}0 \\cdot 10^{-6}} \\cdot \\ln 2 = 9{,}0 \\cdot 10^{7} \\cdot 0{,}693 = 62\\,\\text{MPa}' },
          { titel: 'Vergleich', erklaerung: 'Zugfestigkeit historischer Ziegel oder Sandsteine liegt bei etwa 1 bis 5 MPa:', formel: 'p \\gg f_t' }
        ]}
        ergebnisHinweis="Schon geringe Übersättigungen erzeugen theoretisch Drücke weit über der Steinfestigkeit; real begrenzen Porengröße und Kristallisationsort den Druck. Salzreduzierung (Kompressen) und Sanierputze nach WTA-Merkblatt 2-9 sind daher Teil jeder Denkmalinstandsetzung."
        normQuelle="Correns (1949); WTA-Merkblatt 2-9 (Sanierputzsysteme)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Denkmalverträgliche Innendämmung einer Fachwerkwand"
        zielGleichung="U_{neu} = \frac{1}{1/U_{alt} + d/\lambda}"
        schritte={[
          { titel: 'Gegeben', erklaerung: 'Fachwerkwand mit Lehmausfachung U_alt = 1,20 W/(m²K); 4 cm Holzfaser-Lehm-System (λ = 0,045 W/(mK)), diffusionsoffen und kapillaraktiv.', formel: 'R_D = \\frac{0{,}04}{0{,}045} = 0{,}89\\,\\text{m}^2\\text{K/W}' },
          { titel: 'Neuer U-Wert', erklaerung: 'Halbierung der Verluste bei geringer Dicke:', formel: 'U_{neu} = \\frac{1}{0{,}833 + 0{,}89} = 0{,}58\\,\\text{W/(m}^2\\text{K)}' },
          { titel: 'Rechtlicher Rahmen', erklaerung: 'Der Höchstwert 0,24 W/(m²K) ist ohne Substanzverlust nicht erreichbar; § 105 GModG erlaubt die Abweichung, die Denkmalschutzbehörde ist einzubinden.', formel: '0{,}58 > 0{,}24 \\Rightarrow \\text{Abweichung nach § 105 GModG}' }
        ]}
        ergebnisHinweis="Bei Fachwerk sind Schlagregenbelastung und Anschlussfugen zwischen Holz und Gefach entscheidend; WTA-Merkblatt 8-1 und ein hygrothermischer Nachweis (WTA 6-5) sind zu beachten."
        normQuelle="GModG § 105; WTA-Merkblätter 6-4, 6-5, 8-1"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="denkmalpflege" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 8 Bestand: § 105 GModG, Salzkristallisation und Innendämmung geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        weblinks={[
          { title: "WTA e.V. Wissenschaftlich-Technische Arbeitsgemeinschaft für Bauwerkserhaltung", url: "https://www.wta-gmbh.de/" },
          { title: "Bayerisches Landesamt für Denkmalpflege (BLfD)", url: "https://www.blfd.bayern.de/" }
        ]}
        wikipedia={[
          { title: "Bayerisches Denkmalschutzgesetz", url: "https://de.wikipedia.org/wiki/Bayerisches_Denkmalschutzgesetz" },
          { title: "Bayerisches Landesamt für Denkmalpflege", url: "https://de.wikipedia.org/wiki/Bayerisches_Landesamt_f%C3%BCr_Denkmalpflege" },
          { title: "Schatzregal", url: "https://de.wikipedia.org/wiki/Schatzregal" },
          { title: "Charta von Venedig", url: "https://de.wikipedia.org/wiki/Charta_von_Venedig" }
        ]} 
        literatur={[
          "Eberl, W.; Martin, D.; Spennemann, J.: Bayerisches Denkmalschutzgesetz – Kommentar. Stuttgart: Kohlhammer (aktuelle Auflage; Angaben manuell prüfen)",
          "WTA-Merkblatt 6-4: Innendämmung nach WTA: Planungsleitfaden",
          "WTA-Merkblatt 2-9: Sanierputzsysteme"
        ]} 
        regelwerke={[
          { title: "Bayerisches Denkmalschutzgesetz (BayDSchG; in anderen Ländern gilt das jeweilige Landesdenkmalschutzgesetz)", url: "https://www.gesetze-bayern.de/Content/Document/BayDSchG" },
          { title: "Gebäudemodernisierungsgesetz (GModG, vormals GEG) – § 105 Baudenkmäler und sonstige besonders erhaltenswerte Bausubstanz", url: "https://www.gesetze-im-internet.de/geg/__105.html" },
          { title: "Bayerische Bauordnung (BayBO) - Konzentrationswirkung", url: "https://www.gesetze-bayern.de/Content/Document/BayBO" }
        ]} 
        formeln={[
          {
            formel: 'p_{\\text{krist}} = \\frac{R \\cdot T}{V_m} \\cdot \\ln\\left(\\frac{c}{c_{\\text{sat}}}\\right) \\le \\sigma_{\\text{Zug,Stein}}',
            erklaerung: 'Kristallisationsdruck p_krist von Schadsalzen (z.B. Natriumsulfat: Thenardit/Mirabilit) in Porenräumen: Übersteigt der Druck die Zugfestigkeit des Steins, kommt es zu Absandungen und Schalenbildung.',
            quelle: 'WTA / Correns-Gleichung'
          },
          {
            formel: 'U_{\\text{eff}} = \\frac{1}{R_{si} + \\sum \\frac{d_i}{\\lambda_i} + R_{\\text{Dämm}} + R_{se}}',
            erklaerung: 'U-Wert bei denkmalgerechter Innendämmung. WTA-Merkblatt 6-4 nennt keinen Höchst-U-Wert; maßgebend ist der Feuchtenachweis (Grenzschicht, Tauwasser, Rücktrocknung).',
            quelle: 'WTA-Merkblatt 6-4'
          }
        ]} 
      />
    </div>
  );
}
