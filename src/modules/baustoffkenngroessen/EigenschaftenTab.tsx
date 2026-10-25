// Ausgelagert aus src/modules/Baustoffkenngroessen.tsx (AP 5.2)
import React from 'react';
import { Layers } from 'lucide-react';
import { InlineMath } from 'react-katex';

export interface EigenschaftenTabProps {
  selectedMaterial: 'holz' | 'beton' | 'stahl' | 'glas' | 'mauerwerk' | 'asphalt';
  setSelectedMaterial: React.Dispatch<React.SetStateAction<'holz' | 'beton' | 'stahl' | 'glas' | 'mauerwerk' | 'asphalt'>>;
}

export default function EigenschaftenTab({ selectedMaterial, setSelectedMaterial }: EigenschaftenTabProps) {
  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in" id="tab-eigenschaften-container">
      {/* Sektion 1: Interaktive Material-Klassifizierung */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Layers className="text-shiraz" size={18} /> Interaktive Material-Klassifizierung
          </h3>
    <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
      <p>
        Wählen Sie einen Baustoff aus, um die grundlegenden Gefügestrukturen, Richtungsabhängigkeiten (Isotropie/Anisotropie), Homogenitätsgrade und das rheologische Verformungsverhalten anhand wissenschaftlicher Kennwerte zu analysieren.
      </p>
    </div>

        {/* Material Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(['holz', 'beton', 'stahl', 'glas', 'mauerwerk', 'asphalt'] as const).map((mat) => {
            const names = {
              holz: '🌲 Holz',
              beton: '🪨 Normalbeton',
              stahl: '🏗️ Baustahl',
              glas: '💎 Floatglas',
              mauerwerk: '🧱 Mauerwerk',
              asphalt: '🛣️ Asphalt'
            };
            const isSelected = selectedMaterial === mat;
            return (
              <button
                key={mat}
                id={`btn-mat-${mat}`}
                onClick={() => setSelectedMaterial(mat)}
                className={`py-3 px-2 rounded-xl text-xs font-bold font-sans border transition-all text-center ${
                  isSelected
                    ? 'bg-shiraz text-white border-shiraz shadow-md scale-[1.02]'
                    : 'bg-slate-50 border-home-grau/30 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {names[mat]}
              </button>
            );
          })}
        </div>

        {/* Dynamic material profile render */}
        {(() => {
          const spec = {
            holz: {
              name: 'Fichtenholz (Picea abies)',
              description: 'Naturbaustoff aus organischen Fasern (Zellulose, Lignin) mit ausgeprägter anisotrop-röhrenförmiger Zellstruktur.',
              isotropy: 'Anisotrop (Orthotrop)',
              isotropyBadge: 'bg-rose-50 text-rose-700 border-rose-200',
              isotropyDesc: 'Zeigt in den drei Achsenachsen (axial/Faserrichtung, radial und tangential) völlig unterschiedliche physikalische Profile. Das E-Modul parallel zur Faser ist um ein Vielfaches höher (ca. 11.000 MPa) als quer zur Faser (ca. 300 - 450 MPa). Schwinden parallel ist vernachlässigbar (< 0,1 %), während es tangential ca. 8 % erreicht.',
              homogeneity: 'Stark Heterogen',
              homogeneityBadge: 'bg-amber-50 text-amber-700 border-amber-200',
              homogeneityDesc: 'Charakterisiert durch natürliches Wachstum: Jahresringgrenzen (Frühholz vs. Spätholz), Astansätze, Kern-/Splintholzanteile und Markstrahlen führen zu ortsabhängigen Dichteunterschieden im Millimetermaßstab.',
              rheology: 'Viskoelastisch mit Sorptionsbindung',
              rheologyBadge: 'bg-blue-50 text-blue-700 border-blue-200',
              rheologyDesc: 'Verformt sich unter Dauerlast über die Zeit (zeitabhängiges viskoses Kriechen). Die Kriechrate ist stark gekoppelt an hygrische Wechsel (De- und Adsorption), bekannt als mechano-sorptiver Effekt.',
              example: 'Ein massiver Holzbinder biegt sich im Dachwerk über Jahrzehnte hinweg langsam viskös durch (Kriechen). Bei Querzugspannung bricht das Holz schlagartig ohne Vorwarnung längs auf, da die radialen Bindekräfte minimal sind.',
              norm: 'Entwurf nach DIN EN 1995-1-1 (Eurocode 5), Holzbeständigkeit nach DIN 68800.',
              test: 'Visuelle Festigkeitssortierung nach DIN 4074-1 bzw. maschinelle Sortierung nach DIN EN 14081; Prüfung der Festigkeitswerte nach DIN EN 408.'
            },
            beton: {
              name: 'Normalbeton (z. B. C25/30)',
              description: 'Künstlicher Verbundbaustoff aus mineralischen Zuschlägen, hydraulischem Bindemittel (Zementstein) und Mikroporen.',
              isotropy: 'Quasi-Isotrop (im ungerissenen Zustand)',
              isotropyBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              isotropyDesc: 'Solange keine Risse auftreten (Zustand I) und die Gesteinskörnung regellos verteilt ist, sind die Druckfestigkeiten in alle Raumrichtungen identisch. Nach Rissbildung oder bei einseitiger schlaffer Stahlbewehrung wandelt sich das System in ein hochgradig anisotropes Verhalten.',
              homogeneity: 'Stark Heterogen',
              homogeneityBadge: 'bg-amber-50 text-amber-700 border-amber-200',
              homogeneityDesc: 'Zweiphasensytem aus Zementmatrix, Gesteinskörnung und der porösen Übergangszone (ITZ: Interfacial Transition Zone). Eigenschaften unterliegen starken Größeneffekten des Probekörpers (Maßstabseffekt).',
              rheology: 'Elastisch & plasto-viskos (Kriechen & Schwinden)',
              rheologyBadge: 'bg-blue-50 text-blue-700 border-blue-200',
              rheologyDesc: 'Zeigt bei Kurzzeitbelastung elastisches Rückfederungsverhalten. Unter Dauerlast kriecht Beton erheblich (Zementsteingel fließt um). Das Schwinden (Feuchteabgabe an die Umwelt) erzeugt zusätzliche zeitabhängige Schwindstauchungen.',
              example: 'Die Druckstützen im Untergeschoss stauchen sich in den ersten Jahren merklich ein. Das Tragwerk kriecht infolge permanenter Eigenlasten und schwindet gleichzeitig durch die fortschreitende Austrocknung.',
              norm: 'Konstruktion nach DIN EN 1992-1-1 (Eurocode 2) und Herstellungsnorm DIN EN 206 / DIN 1045-2.',
              test: 'Zerstörende Druckprüfung von Würfeln (150 mm Kantenlänge) nach DIN EN 12390-3 im Alter von 28 Tagen; Lagerung nach DIN EN 12390-2 (in Deutschland meist Trockenlagerung nach Anhang NA mit Umrechnung auf Wasserlagerung).'
            },
            stahl: {
              name: 'Baustahl (z. B. S235J0)',
              description: 'Metallischer Legierungswerkstoff mit fein-polykristallinem, metallogefüglichem Kristallgitter.',
              isotropy: 'Isotrop',
              isotropyBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              isotropyDesc: 'Durch die regellose Richtungsverteilung der mikroskopischen Metallkörner verhalten sich alle Festigkeiten, Elastizitätsmoduln (<InlineMath math="E \\approx 210\\,000" /> MPa) und Querdehnzahlen (<InlineMath math="\\nu \\approx 0{,}3" />) in allen drei Raumachsen praktisch identisch (Walztexturen bewirken nur geringe Unterschiede).',
              homogeneity: 'Homogen (makroskopisch)',
              homogeneityBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              homogeneityDesc: 'Auf der makroskopischen Ebene sind alle physikalischen Eigenschaften homogen im gesamten Profilquerschnitt verteilt. Es gibt keine ausgeprägten Phasengrenzflächen im Zentimetermaßstab.',
              rheology: 'Linear-elastisch / ideal-plastisch',
              rheologyBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
              rheologyDesc: 'Folgt bis zur ausgeprägten Streckgrenze streng dem Hooke\'schen Gesetz (<InlineMath math="\\sigma = E \\cdot \\varepsilon" />). Nach Erreichen der Streckgrenze fließt der Stahl stark plastisch unter Verfestigung bis zum Dehnungsbruch. Zeitabhängiges Raumtemperaturkriechen ist vernachlässigbar.',
              example: 'Ein stählerner Walzträger fängt Deckeneigenlasten elastisch ab. Bei extremer mechanischer Überlastung biegt er sich massiv plastisch durch, ohne sofort zu zerreißen (Duktilitätsvorteil der Stahlbauweise).',
              norm: 'Tragwerksentwurf nach DIN EN 1993-1-1 (Eurocode 3) und Stahlspezifikation nach DIN EN 10025.',
              test: 'Zugversuch an normierten Flach- oder Rundproben zur Bestimmung der Dehngrenze und Bruchdehnung nach DIN EN ISO 6892-1.'
            },
            glas: {
              name: 'Kalknatron-Floatglas',
              description: 'Anorganisches, amorphes Schmelzprodukt ohne weitreichende kristalline Ordnung.',
              isotropy: 'Vollkommen Isotrop',
              isotropyBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              isotropyDesc: 'Wegen der ungeordneten, nicht-kristallinen Atomanordnung besitzt Fensterglas in alle Achsenrichtungen exakt dieselben physikalischen, spannungsoptischen und elastischen Eigenschaften.',
              homogeneity: 'Homogen',
              homogeneityBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              homogeneityDesc: 'Makroskopisch homogen: Der Floatprozess erzeugt ein einphasiges, amorphes Gefüge ohne Körner oder Phasengrenzen. Die Festigkeit wird aber von mikroskopischen Oberflächendefekten (Griffith-Risse) bestimmt – deshalb streut sie stark.',
              rheology: 'Rein linear-elastisch & extrem spröde',
              rheologyBadge: 'bg-rose-50 text-rose-700 border-rose-200',
              rheologyDesc: 'Zeigt bis zum eigentlichen Bruch keinerlei plastisches Fließen oder Dehnkriechen. Es verwindet sich absolut linear und federt schadensfrei zurück, bricht jedoch bei Überschreiten der Oberflächenzugfestigkeit schlagartig.',
              example: 'Eine Schaufensterscheibe hält hohen Windböen rein elastisch stand. Ein auftreffender Kieselstein erzeugt Mikrorisse; wird die kritische Risszähigkeit lokal überschritten, erfolgt unverzüglich der Sprödbruch.',
              norm: 'Bemessung im Bauwesen nach DIN 18008-1 bis 6 (Glas im Bauwesen).',
              test: 'Doppelring-Biegeversuch zur Bestimmung der Biegefestigkeit nach DIN EN 1288-2 bzw. -5.'
            },
            mauerwerk: {
              name: 'Mauerwerk (Ziegel mitsamt Mörtelfuge)',
              description: 'Anorganischer Verbundwerkstoff aus vorgefertigten Bausteinen und plastisch applizierten Lagerfugenmörteln.',
              isotropy: 'Stark Anisotrop',
              isotropyBadge: 'bg-rose-50 text-rose-700 border-rose-200',
              isotropyDesc: 'Besitzt extreme Richtungsabhängigkeiten. Die vertikale Tragfähigkeit senkrecht zur horizontalen Mörtellagerfuge ist hoch. Horizontalschub oder Parallelbeanspruchungen führen sehr früh zu Gleitfugenrissen oder Ziegelscheren.',
              homogeneity: 'Extrem Heterogen',
              homogeneityBadge: 'bg-amber-50 text-amber-700 border-amber-200',
              homogeneityDesc: 'Zwei sehr unterschiedliche Materialien – Mauerstein (höhere Festigkeit und Steifigkeit) und Fugenmörtel (meist geringere Steifigkeit, stärkere Querdehnung) – sind über den Haftverbund miteinander verbunden.',
              rheology: 'Nichtlinear-elastisch mit Fugenstauchungskriechen',
              rheologyBadge: 'bg-blue-50 text-blue-700 border-blue-200',
              rheologyDesc: 'Das Verformungsverhalten ist nichtlinear und stark von den Fugeneigenschaften abhängig. Der plastische Fugenanteil unterliegt unter kontinuierlicher Auflast signifikanten Setzungen und Stauchungen.',
              example: 'Ein Ziegelpfeiler fängt vertikale Deckenkräfte sehr steif ab. Bei einer seitlich einwirkenden Windböe gleiten die Ziegel auf den Lagerfugen ab, wenn die Haftscherfestigkeit überschritten wird.',
              norm: 'Bemessung nach DIN EN 1996-1-1 (Eurocode 6); Mauersteine nach DIN EN 771-1 mit DIN 20000-401 (Ziegel).',
              test: 'Bestimmung der Mauerwerksdruckfestigkeit an Prüfkörpern (Wandabschnitten) nach DIN EN 1052-1; Haftscherfestigkeit nach DIN EN 1052-3.'
            },
            asphalt: {
              name: 'Asphalttragschicht (z. B. AC 32 TN)',
              description: 'Viskoelastisches Mehrphasengemisch aus bruchrauher Gesteinskörnung, Gesteinsmehl (Filler) und dem Bindemittel Bitumen.',
              isotropy: 'Isotrop (makroskopisch nach Verdichtung)',
              isotropyBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              isotropyDesc: 'Nach dem profilgerechten Einbau und der Verdichtung durch Walzen sind die mechanischen Steifigkeiten in alle horizontalen und vertikalen Tragachsen im Wesentlichen identisch.',
              homogeneity: 'Heterogen',
              homogeneityBadge: 'bg-amber-50 text-amber-700 border-amber-200',
              homogeneityDesc: 'Körnung und viskoses Bitumensystem bilden eine grobe Korn-Matrix mit messbaren Hohlraumvolumenanteilen. Die Eigenschaften hängen extrem von der lokalen Korngrößenmischung ab.',
              rheology: 'Thermisch hochviskos & thermoelastisch (Viskoelastisch)',
              rheologyBadge: 'bg-blue-50 text-blue-700 border-blue-200',
              rheologyDesc: 'Zentrales mechanisches Verhalten ist stark temperatur- und frequenzabhängig (Lastwechselrate). Bei Winterkälte (-15°C) verhält sich Asphalt spröde und elastisch. Bei Hitze (>40°C) wird er plastisch-weich und fließt viskös.',
              example: 'Im Winter fängt der Asphalt Erschütterungen elastisch ab, neigt aber bei Frost zu Kälterissen. Im warmen Sommer verformt sich der Fahrbahnbelag durch stehende Lastschwerpunkte plastisch dauerhaft zu Spurrinnen.',
              norm: 'Asphaltmischgut nach DIN EN 13108 mit TL Asphalt-StB; Schichtdicken nach RStO.',
              test: 'Spurbildungsversuch im Wasserbad/Luft zur Bestimmung der Verformungsbeständigkeit am Spurbildungsgerät nach DIN EN 12697-22.'
            }
          }[selectedMaterial];

          return (
            <div className="p-5 sm:p-6 bg-slate-50 border border-home-grau/30 rounded-2xl flex flex-col gap-5 animate-fade-in" id="material-profile-card">
              <div className="border-b border-home-grau/30 pb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Ausgewählter Baustoff-Steckbrief:</span>
                <h4 className="text-lg sm:text-xl font-bold text-slate-800">{spec.name}</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 italic">{spec.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Richtungsabhängigkeit */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Richtungsabhängigkeit</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${spec.isotropyBadge}`}>{spec.isotropy}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{spec.isotropyDesc}</p>
                  </div>
                </div>

                {/* Homogenitätsgrad */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Gefügestruktur</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${spec.homogeneityBadge}`}>{spec.homogeneity}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{spec.homogeneityDesc}</p>
                  </div>
                </div>

                {/* Rheologische Einordnung */}
                <div className="bg-white p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Verformungsverhalten</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${spec.rheologyBadge}`}>{spec.rheology}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{spec.rheologyDesc}</p>
                  </div>
                </div>
              </div>

              {/* Praktisches Beispiel & Wissenschaftliche Prüfung */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-home-grau/30 text-xs">
                <div className="space-y-1 bg-white/70 p-3.5 rounded-xl border border-home-grau/30">
                  <strong className="text-slate-800 flex items-center gap-1.5">💡 Praxisbeispiel im Tragwerkskontext:</strong>
                  <p className="text-slate-600 leading-relaxed">{spec.example}</p>
                </div>
                <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-home-grau/30">
                  <div>
                    <strong className="text-slate-800 flex items-center gap-1.5">📋 Zugelassenes Prüfverfahren:</strong>
                    <p className="text-slate-600 leading-relaxed text-[11px] mt-0.5">{spec.test}</p>
                  </div>
                  <div className="pt-1.5 border-t border-home-grau/30 text-[10.5px]">
                    <span className="font-bold text-slate-700">Normatives Regelwerk:</span> <span className="text-slate-600 font-mono">{spec.norm}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Sektion 2: Wissenschaftliche Theorie-DeepDives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        
        {/* Box 1: Isotropie vs. Anisotropie */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between" id="card-isotropie-anisotropie">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <span className="p-1 bg-sky-50 text-sky-600 rounded-md text-xs">A / I</span> Isotropie vs. Anisotropie (Richtungsverhalten)
            </h3>
            <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
              Die <strong>Isotropie</strong> (griechisch <i>isos</i> „gleich“ und <i>tropos</i> „Richtung“) besagt, dass die werkstofflichen Kennwerte (Festigkeiten, Wärmeleitfähigkeiten, Verformungen) richtungsunabhängig sind.
            </p>
            <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
              Die <strong>Anisotropie</strong> beschreibt das direkte Gegenteil: Die Kennwerte hängen signifikant von der Beanspruchungsrichtung ab. Holz ist hierbei ein klassisches orthotropes System mit ausgeprägter Längs- (Faser), Radial- und Tangentialausrichtung.
            </p>

            {/* Ein kleiner schematischer SVG-Visualizer */}
            <div className="bg-slate-50 text-slate-800 p-4 rounded-xl space-y-3 font-sans text-xs border border-home-grau/30">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Grafisches Richtungs-Schema:</span>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="border border-home-grau/30 p-2.5 rounded-lg bg-white shadow-sm space-y-2">
                  <span className="font-bold text-emerald-700">Isotrop (z. B. Stahl)</span>
                  <div className="flex justify-center py-2">
                    <svg className="w-16 h-16" viewBox="0 0 100 100">
                      {/* Circle indicating same properties in all angles */}
                      <circle cx="50" cy="50" r="30" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx="50" cy="50" r="2" fill="#334155" />
                      <path d="M50,10 L50,90 M10,50 L90,50 M22,22 L78,78 M22,78 L78,22" stroke="#cbd5e1" strokeWidth="1" />
                      {/* Arrows representing equal forces */}
                      <path d="M50,20 L50,15 M50,80 L50,85 M20,50 L15,50 M80,50 L85,50" stroke="#334155" strokeWidth="2" markerEnd="arrow" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">E-Modul <InlineMath math="E_x \equiv E_y \equiv E_z" /></p>
                </div>

                <div className="border border-home-grau/30 p-2.5 rounded-lg bg-white shadow-sm space-y-2">
                  <span className="font-bold text-rose-700">Anisotrop (z. B. Holz)</span>
                  <div className="flex justify-center py-2">
                    <svg className="w-16 h-16" viewBox="0 0 100 100">
                      {/* Ellipse indicating directionality */}
                      <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="#A3113E" strokeWidth="2" strokeDasharray="3 3" transform="rotate(-30 50 50)" />
                      <circle cx="50" cy="50" r="2" fill="#A3113E" />
                      {/* Fiber direction lines */}
                      <path d="M10,25 L90,65 M15,35 L95,75 M5,15 L85,55" stroke="#A3113E" strokeWidth="1.5" strokeOpacity="0.4" />
                      <path d="M30,35 L70,55" stroke="#A3113E" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">E-Modul <InlineMath math="E_{||} \gg E_{\perp}" /></p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600 mt-5">
            <p><strong>Zentrales Prüfverfahren:</strong> Nachweis der richtungsabhängigen Festigkeiten nach <strong>DIN EN 408</strong> (Druck- und Biegeprüfungen parallel und senkrecht zur Hauptfaserrichtung).</p>
            <p><strong>Praxisrelevanz:</strong> Bauteile aus Brettschichtholz (BSH) müssen an Tragknoten so angeordnet werden, dass keine unzulässigen Querzugspannungen senkrecht zur Faser entstehen, da Holz dort kaum Last abtragen kann.</p>
          </div>
        </div>

        {/* Box 2: Homogenität vs. Heterogenität */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between" id="card-homogenitaet-heterogenitaet">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <span className="p-1 bg-amber-50 text-amber-600 rounded-md text-xs">H / H</span> Homogenität vs. Heterogenität (Struktur)
            </h3>
            <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
              Ein Werkstoff ist <strong>homogen</strong> (griechisch <i>homogenēs</i> „gleichartig“), wenn seine stoffliche Zusammensetzung und alle Materialkennwerte an jedem beliebigen Ort des Bauteils vollkommen identisch sind. Ein idealer Einkristall oder reiner Kohlenstoffstahl erfüllt diese Anforderung auf makroskopischer Ebene.
            </p>
            <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed">
              Ein <strong>heterogener</strong> Baustoff besitzt eine ungleichmäßige Phasen- oder stoffliche Verteilung. Gesteine, Beton oder Verbundwerkstoffe weisen extreme mikro- und makroskopische Heterogenitäten aus Matrix, Poren und Aggregaten auf. Die Kennwerte hängen herkunftsmäßig stark vom untersuchten Volumen ab (REV-Prinzip).
            </p>

            {/* Homogeneity Illustration */}
            <div className="bg-slate-50 text-slate-800 p-4 rounded-xl space-y-3 font-sans text-xs border border-home-grau/30">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Gefüge-Phasen-Schema:</span>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="border border-home-grau/30 p-2.5 rounded-lg bg-white shadow-sm space-y-2">
                  <span className="font-bold text-emerald-700">Homogen Gefüge (z. B. Glas)</span>
                  <div className="flex justify-center py-2">
                    <svg className="w-16 h-16" viewBox="0 0 100 100">
                      {/* Smooth evenly-spaced small dots representing molecules */}
                      <rect x="15" y="15" width="70" height="70" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                      <g fill="#334155" opacity="0.8">
                        <circle cx="25" cy="25" r="2" /><circle cx="35" cy="25" r="2" /><circle cx="45" cy="25" r="2" /><circle cx="55" cy="25" r="2" /><circle cx="65" cy="25" r="2" /><circle cx="75" cy="25" r="2" />
                        <circle cx="25" cy="40" r="2" /><circle cx="35" cy="40" r="2" /><circle cx="45" cy="40" r="2" /><circle cx="55" cy="40" r="2" /><circle cx="65" cy="40" r="2" /><circle cx="75" cy="40" r="2" />
                        <circle cx="25" cy="55" r="2" /><circle cx="35" cy="55" r="2" /><circle cx="45" cy="55" r="2" /><circle cx="55" cy="55" r="2" /><circle cx="65" cy="55" r="2" /><circle cx="75" cy="55" r="2" />
                        <circle cx="25" cy="70" r="2" /><circle cx="35" cy="70" r="2" /><circle cx="45" cy="70" r="2" /><circle cx="55" cy="70" r="2" /><circle cx="65" cy="70" r="2" /><circle cx="75" cy="70" r="2" />
                      </g>
                    </svg>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">Phasenreinheit, konstante Werkstoffdichte <InlineMath math="\rho(x,y,z) = C" /></p>
                </div>

                <div className="border border-home-grau/30 p-2.5 rounded-lg bg-white shadow-sm space-y-2">
                  <span className="font-bold text-rose-700">Heterogen Gefüge (z. B. Beton)</span>
                  <div className="flex justify-center py-2">
                    <svg className="w-16 h-16" viewBox="0 0 100 100">
                      {/* Multi-phase structure with various particle sizes and pores */}
                      <rect x="15" y="15" width="70" height="70" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                      {/* Stone Aggregates */}
                      <polygon points="25,30 40,22 45,35 30,38" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                      <polygon points="55,50 70,45 75,60 60,65" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                      <circle cx="25" cy="65" r="8" fill="#cbd5e1" />
                      {/* Pores */}
                      <circle cx="50" cy="25" r="3" fill="#A3113E" stroke="#A3113E" strokeWidth="0.5" />
                      <circle cx="40" cy="55" r="4.5" fill="#A3113E" stroke="#A3113E" strokeWidth="0.5" />
                      <circle cx="72" cy="28" r="2" fill="#A3113E" />
                      {/* Mortar matrix */}
                      <path d="M15,15 L85,85" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 2" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">Mehrphasig (Korn matrix, Zementleim &amp; Poren)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600 mt-5">
            <p><strong>Bauseitige Konsequenz:</strong> Zur statistischen Absicherung heterogener Verbundbaustoffe regelt die <strong>DIN EN 206</strong> weitreichende Konformitätskriterien für Betonprüfergebnisse via Standardabweichungen.</p>
            <p><strong>Wichtig für Rechenverfahren:</strong> In Rechenmodellen wird das heterogene Gefüge zur Vereinfachung näherungsweise verschmiert homogenisiert modelliert (effektive Medienberechnung).</p>
          </div>
        </div>

      </div>

      {/* Sektion 3: Elastizität, Plastizität & Fließverhalten */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <span className="p-1 bg-red-50 text-red-650 rounded-md text-xs">R</span> Rheologisches Dehnverhalten &amp; Viskositäten
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 text-shiraz">1. Elastizität</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Beschreibt die Eigenschaft eines Materials, sich unter Belastung zu verformen und nach Entlastung <strong>vollständig und unverzögert</strong> in seine ursprüngliche geometrische Ausgangslage zurückzukehren.
              </p>
            </div>
            <div className="font-mono text-[10px] bg-white p-2 border border-home-grau/30 rounded mt-3 text-slate-500">
              Hookesches Gesetz:<br />
              <InlineMath math="\sigma = E \cdot \varepsilon" /> (linear-elastisch)<br />
              Beispiel: Federstahl, Glas
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 text-shiraz">2. Plastizität</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Beschreibt die Fähigkeit, nach Überschreiten einer materialabhängigen Grenzspannung (Fließ- oder Dehngrenze) irreversible, <strong>bleibende Verformungen</strong> ohne Rissbildung oder Sprödbruch zu erfahren.
              </p>
            </div>
            <div className="font-mono text-[10px] bg-white p-2 border border-home-grau/30 rounded mt-3 text-slate-500">
              Fließkriterium:<br />
              <InlineMath math="\sigma \ge f_y" /> (bleibende Verformung)<br />
              Beispiel: Kaltgeformter Bewehrungsstahl
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 text-shiraz">3. Viskoelastizität</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eine temperatur- und zeitabhängige Kombination aus elastischem Federungsverhalten und viskosem, trägem Fließen. Sie verursacht <strong>Kriechen</strong> unter konstanter Last und <strong>Relaxation</strong> unter konstanter Verformung. (Schwinden ist dagegen ein lastunabhängiger, hygrischer Vorgang.)
              </p>
            </div>
            <div className="font-mono text-[10px] bg-white p-2 border border-home-grau/30 rounded mt-3 text-slate-500">
              Kriechverformung (Zementstein):<br />
              <InlineMath math="\varepsilon(t) = \varepsilon_{el} \cdot (1 + \varphi(t))" /><br />
              Beispiel: Bitumenbindemittel, PMMA
            </div>
          </div>

        </div>

        <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl text-xs space-y-1.5 text-slate-600">
          <span className="font-bold text-slate-800">Prüfverfahren der Elastizität / Plastizität:</span>
          <p className="leading-relaxed">
            Bestimmung der Elastizitätsmoduln über statische Spannungs-Dehnungs-Kurven im zerstörenden Einaxial-Zugversuch (nach DIN EN ISO 6892-1) oder zerstörungsfreie akustische Eignungsprüfungen (Eigenfrequenzverfahren). Das Fließverhalten wird bei Fluiden mit Rotationsviskosimetern (nach DIN EN ISO 3219) charakterisiert.
          </p>
        </div>
      </div>
    </div>
  );
}
