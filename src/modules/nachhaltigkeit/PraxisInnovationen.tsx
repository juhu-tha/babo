import { HardHat, Landmark, FileText, Recycle, Layers, Building, FileSpreadsheet, BookOpen } from 'lucide-react';
import PraxisGebaeudetypE from './PraxisGebaeudetypE';
import { InlineMath } from 'react-katex';
import type { Dispatch, SetStateAction } from 'react';

interface PraxisInnovationenProps {
  praxisCategory: "gebaeudetyp_e" | "urban_mining" | "lehmbau" | "holz_hybrid";
  setPraxisCategory: Dispatch<SetStateAction<"gebaeudetyp_e" | "urban_mining" | "lehmbau" | "holz_hybrid">>;
}

export default function PraxisInnovationen({ praxisCategory, setPraxisCategory }: PraxisInnovationenProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">

        {/* Header Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-shiraz/10 border border-shiraz/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-shiraz self-start">
            <HardHat size={12} className="text-shiraz" />
            Bauwende in der Praxis &bull; Suffizienz &bull; Zirkularität
          </span>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Landmark className="text-shiraz" size={24} /> Praxis, Suffizienz &amp; Gebäudetyp E
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p>
              Überregulierung abbauen, Materialkreisläufe schließen und robuste Baustoffe einsetzen: Erkunden Sie das Forschungsprojekt &bdquo;Einfach Bauen&ldquo; (TU München), das neue Gebäudetyp-E-Gesetz (&sect; 650o BGB), Urban Mining (Rathaus Korbach), tragenden Lehmbau nach DIN 18940 und Großholzbau-Leuchttürme.
            </p>
          </div>
        </div>

        {/* Subnavigation Tabs for Praxis */}
        <div className="flex flex-wrap gap-2 border-b border-home-grau/20 pb-3">
          {[
            { id: 'gebaeudetyp_e', label: '1. Gebäudetyp E & Einfach Bauen', icon: FileText, desc: 'Gesetzesvorhaben & Bad Aibling' },
            { id: 'urban_mining', label: '2. Urban Mining & Materialpässe', icon: Recycle, desc: 'Rathaus Korbach & Neues Museum' },
            { id: 'lehmbau', label: '3. Tragender Lehmbau (DIN 18940)', icon: Layers, desc: 'Normenreihe 2023 & SFK 3' },
            { id: 'holz_hybrid', label: '4. Holz- & Hybrid-Leuchttürme', icon: Building, desc: 'Timber Pioneer, Prinz-Eugen-Park & Diedorf' }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = praxisCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setPraxisCategory(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
                    isActive
                      ? 'bg-shiraz text-white border-shiraz shadow-sm'
                      : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                  }`}
              >
                <TabIcon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Subcategory Content 1: Gebäudetyp E & Einfach Bauen */}
        {praxisCategory === 'gebaeudetyp_e' && <PraxisGebaeudetypE />}

        {/* Subcategory Content 2: Urban Mining & Materialpässe */}
        {praxisCategory === 'urban_mining' && (
          <div className="space-y-6 animate-in fade-in duration-200">

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
              <div className="border-b border-home-grau/20 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">
                  Urban Mining, Re-Use &amp; Digitale Materialpässe
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Das Bauwerk als temporäres Rohstofflager für zukünftige Baustoffgenerationen.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Fallbeispiel Rathaus Korbach */}
                <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/60 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Pionierprojekt Hessen
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">60 % Re-Use</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Rathaus Korbach: In-situ Recycling</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Beim Abbruch des Rathauserweiterungsbaus aus den 1970er-Jahren wurde die Bausubstanz im Vorfeld detailliert auditiert und schadstoffbereinigt. Der anfallende mineralische Bauschutt wurde direkt <strong>vor Ort gebrochen, aufbereitet und als RC-Gesteinskörnung für den Neubau verwendet</strong>.
                  </p>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 font-medium">
                    <li>Vermeidung von Hunderten LKW-Transporten zur Deponie</li>
                    <li>Erfolgreicher Einsatz von R-Beton (Typ 1 / Typ 2 nach DIN 1045-2)</li>
                    <li>Vorbildcharakter für kommunale Ausschreibungen nach KrWG</li>
                  </ul>
                </div>

                {/* Fallbeispiel Neues Museum Berlin */}
                <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/60 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      Kulturerbe &amp; Zirkularität
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">375.000 Ziegel</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Neues Museum Berlin (David Chipperfield)</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Beim denkmalgerechten Wiederaufbau des kriegszerstörten Museums wurden rund <strong>375.000 historische Mauerziegel</strong> aus Trümmern geborgen, manuell vom Mörtel befreit und in den neuen Mauerschalen erneut vermauert.
                  </p>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 font-medium">
                    <li>Höchste Ressourcenschonung durch echtes Component-Re-Use</li>
                    <li>Verbindung historischer Bausubstanz mit zeitgenössischer Architektur</li>
                    <li>Null Graue Energie für die Ziegelherstellung</li>
                  </ul>
                </div>

              </div>

              {/* Materialpässe & Madaster Box */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet className="text-blue-700 shrink-0 mt-0.5" size={20} />
                  <div className="text-xs text-blue-950 leading-relaxed">
                    <strong className="block font-bold mb-0.5">Digitale Materialpässe &amp; Madaster-Plattform:</strong>
                    Der Materialpass dokumentiert Art, Masse, Einbauort und Lösbarkeit aller Baustoffe eines Gebäudes. Er ermittelt den <strong>Circularity Index (CI)</strong> und den monetären Restwert der Materialien am Lebensende – die Voraussetzung für DGNB-Zusatzpunkte und zirkuläres Bauen ohne chemische Verbundkleber.
                  </div>
                </div>
                <span className="shrink-0 px-3 py-1 bg-blue-700 text-white font-bold rounded-lg text-xs">
                  Design for Disassembly
                </span>
              </div>

            </div>

          </div>
        )}

        {/* Subcategory Content 3: Tragender Lehmbau nach DIN 18940 */}
        {praxisCategory === 'lehmbau' && (
          <div className="space-y-6 animate-in fade-in duration-200">

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
              <div className="border-b border-home-grau/20 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Tragender Lehmbau nach DIN 18940:2023-06
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Konstruktion, Bemessung und Ausführung von tragendem Lehmsteinmauerwerk bis Gebäudeklasse 4.</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                  DIN 18940
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: Normdetails (7-cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Mit der Veröffentlichung der <strong>DIN 18940 im Juni 2023</strong> erhielt der Lehmbau nach über 50 Jahren erstmals wieder eine vollwertige bauaufsichtliche Bemessungsgrundlage in Deutschland. Die Norm ist eng an das Sicherheitskonzept des <strong>Eurocode 6 (DIN EN 1996)</strong> angelehnt und ermöglicht den mehrgeschossigen Wohnungsbau bis zu einer Gebäudehöhe von 13 Metern.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-home-grau/25 bg-slate-50">
                      <strong className="text-xs font-bold text-slate-900 block mb-1">Schlanke Wandstärken:</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Statt der früher üblichen 24 oder 36,5 cm lässt die DIN 18940 tragende Wandstärken bereits <strong>ab 17,5 cm</strong> zu (bei entsprechender Steindruckfestigkeitsklasse).
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-home-grau/25 bg-slate-50">
                      <strong className="text-xs font-bold text-slate-900 block mb-1">Druckfestigkeitsklasse SFK 3:</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Für tragendes Mauerwerk sind Lehmsteine nach DIN 18945 mindestens der Klasse <strong>SFK 3 (<InlineMath math="f_{\text{St}} \ge 3{,}5\text{ N/mm}^2" />)</strong> erforderlich.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-home-grau/25 bg-slate-50">
                      <strong className="text-xs font-bold text-slate-900 block mb-1">Brandschutz Klasse A1:</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Mineralische Lehmbaustoffe sind rein anorganisch und erreichen die <strong>Brandklasse A1 (nicht brennbar)</strong> sowie Feuerwiderstand <strong>REI 30 bis REI 90</strong>.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-home-grau/25 bg-slate-50">
                      <strong className="text-xs font-bold text-slate-900 block mb-1">100 % Zirkulär (C2C):</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Lehm bindet physikalisch durch Tonmineralien (keine chemische Hydratation). Durch Wasserzugabe ist er beliebig oft rezyklierbar – null Brennenergie.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                    <span>Ökobilanz-Effekt gegenüber gebrannten Ziegeln:</span>
                    <strong className="font-mono font-bold text-emerald-800 text-sm">-85 % bis -90 % Primärenergie (PENRT)</strong>
                  </div>
                </div>

                {/* Right: Normenmatrix Lehmbau (5-cols) */}
                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={14} className="text-shiraz" />
                    Die Deutsche Lehmbau-Normenfamilie
                  </h4>
                  <div className="text-[11px] space-y-2 text-slate-700">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-slate-950 block font-mono">DIN 18940:2023-06</strong>
                      <span>Tragendes Lehmsteinmauerwerk – Konstruktion, Bemessung und Ausführung</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-slate-950 block font-mono">DIN 18945:2018-12</strong>
                      <span>Lehmsteine – Begriffe, Anforderungen und Prüfverfahren</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-slate-950 block font-mono">DIN 18946:2018-12</strong>
                      <span>Lehmmauermörtel – Begriffe, Anforderungen und Prüfverfahren</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-slate-950 block font-mono">DIN 18947:2018-12</strong>
                      <span>Lehmputzmörtel – Begriffe, Anforderungen und Prüfverfahren</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-slate-950 block font-mono">DIN 18948:2018-12</strong>
                      <span>Lehmplatten – Begriffe, Anforderungen und Prüfverfahren</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Subcategory Content 4: Holz- & Hybrid-Leuchttürme */}
        {praxisCategory === 'holz_hybrid' && (
          <div className="space-y-6 animate-in fade-in duration-200">

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
              <div className="border-b border-home-grau/20 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">
                  Großmaßstäblicher Holz- &amp; Holz-Hybridbau
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Herausragende Ingenieurbauwerke und ökologische Mustersiedlungen in Deutschland.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Prinz-Eugen-Park München */}
                <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded self-start">
                      München &bull; 30 Hektar
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">Prinz-Eugen-Park (Ökologische Mustersiedlung)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Die derzeit größte zusammenhängende Holzbausiedlung Deutschlands mit <strong>570 bis 600 Wohneinheiten</strong>. 
                      Vom mehrgeschossigen Atriumhaus bis zu 7-geschossigen Holzhybridbauten mit hohem Vorfertigungsgrad.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-2 font-bold">
                    Vorzeigeprojekt für kommunalen Klimaschutz
                  </div>
                </div>

                {/* Timber Pioneer Frankfurt */}
                <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded self-start">
                      Frankfurt &bull; 14.100 m² BGF
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">Timber Pioneer (Europaviertel)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Erstes Holz-Hybrid-Bürogebäude Frankfurts. 1.800 m³ Holz binden dauerhaft ca. <strong>1.800 t CO₂</strong>. 
                      Mit nur <strong>300 kg/m²</strong> ist die Tragstruktur 57 % leichter als ein Massivbau (ca. 700 kg/m²). Ausgezeichnet mit DGNB Gold.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-2 font-bold">
                    57 % Gewichtsersparnis bei Decken
                  </div>
                </div>

                {/* Schmuttertal-Gymnasium Diedorf */}
                <div className="border border-home-grau/30 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded self-start">
                      Diedorf &bull; Plusenergiehaus
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">Schmuttertal-Gymnasium (Nagler &amp; Kaufmann)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Vier Baukörper in modularer Holz-Skelettbauweise mit Holz-Beton-Verbunddecken und Aufdachdämmung im Landschaftsschutzgebiet. 
                      Erzeugt mehr Energie als es verbraucht; von der DBU mit <strong>1,1 Mio. Euro</strong> gefördert.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-2 font-bold">
                    Architektur-Vorbild für Schulbauten
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    );
}
