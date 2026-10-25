import React, { useState } from 'react';
import { 
  Layers, 
  Trees, 
  Shield, 
  Box, 
  TrendingUp, 
  Wrench, 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Hammer, 
  RefreshCw
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

interface InstandsetzungMaterialienProps {
  initialMaterial?: 'holz' | 'metalle' | 'kunststoffe' | 'asphalt' | 'mauerwerk';
}

export default function InstandsetzungMaterialien({ initialMaterial = 'holz' }: InstandsetzungMaterialienProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<'holz' | 'metalle' | 'kunststoffe' | 'asphalt' | 'mauerwerk'>(initialMaterial);
  const [activeSubSection, setActiveSubSection] = useState<'uebersicht' | 'schutz' | 'instandsetzung' | 'praxis'>('uebersicht');

  return (
    <div className="flex flex-col gap-6 w-full py-4 animate-in fade-in duration-300">
      
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Layers className="text-shiraz" size={24} /> Schutz &amp; Instandsetzung nach Materialien
            </h2>
            <p className="text-xs text-text-main/70 mt-1">
              Werkstoffspezifische Schutz- und Sanierungsverfahren für Holz, Metalle, Kunststoffe, Asphalt und Mauerwerk
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-shiraz/10 text-shiraz border border-shiraz/20 self-start md:self-auto">
            DIN 68800 • DIN EN ISO 12944 • DVS 2207 • ZTV BEA-StB • WTA
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p>
            Jeder Baustoff unterliegt werkstoffspezifischen Degradationsmechanismen und verlangt maßgeschneiderte Schutz- und Instandsetzungstechnologien. 
            Während bei <strong>Holz</strong> der konstruktive Feuchteschutz (DIN 68800-2) vor Pilzbefall schützt und Altschäden mit Holzprothesen statisch saniert werden, erfordert <strong>Stahl</strong> präzise Oberflächenentrostungen (Sa 2 ½) und Duplex-Beschichtungssysteme nach DIN EN ISO 12944. 
            Bei <strong>Kunststoffen</strong> stehen Schweißverfahren nach DVS und UV-Stabilisatoren im Fokus, während <strong>Asphalt</strong> durch Heißverguss, DSK/DSH-V-Dünnschichten und Deckenerneuerungen nach ZTV BEA-StB instandgesetzt wird.
          </p>
        </div>

        {/* Material Selector Bar */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-home-grau/20 mt-4">
          <button
            onClick={() => { setSelectedMaterial('holz'); setActiveSubSection('uebersicht'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              selectedMaterial === 'holz'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Trees size={16} /> Holz (DIN 68800)
          </button>
          <button
            onClick={() => { setSelectedMaterial('metalle'); setActiveSubSection('uebersicht'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              selectedMaterial === 'metalle'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Shield size={16} /> Metalle &amp; Stahl (ISO 12944)
          </button>
          <button
            onClick={() => { setSelectedMaterial('kunststoffe'); setActiveSubSection('uebersicht'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              selectedMaterial === 'kunststoffe'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Box size={16} /> Kunststoffe &amp; Fugen (DVS / DIN 18540)
          </button>
          <button
            onClick={() => { setSelectedMaterial('asphalt'); setActiveSubSection('uebersicht'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              selectedMaterial === 'asphalt'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <TrendingUp size={16} /> Asphalt &amp; Bitumen (ZTV BEA-StB)
          </button>
          <button
            onClick={() => { setSelectedMaterial('mauerwerk'); setActiveSubSection('uebersicht'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              selectedMaterial === 'mauerwerk'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Wrench size={16} /> Mauerwerk &amp; Naturstein (WTA)
          </button>
        </div>
      </div>

      {/* Sub-Section Tabs within the Selected Material */}
      <div className="flex gap-2 border-b border-home-grau/30 pb-2">
        <button aria-pressed={activeSubSection === 'uebersicht'}
          onClick={() => setActiveSubSection('uebersicht')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubSection === 'uebersicht'
              ? 'bg-text-main text-white'
              : 'bg-white text-slate-700 border border-home-grau/30 hover:bg-off-white'
          }`}
        >
          Übersicht &amp; Schadensmechanismen
        </button>
        <button aria-pressed={activeSubSection === 'schutz'}
          onClick={() => setActiveSubSection('schutz')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubSection === 'schutz'
              ? 'bg-text-main text-white'
              : 'bg-white text-slate-700 border border-home-grau/30 hover:bg-off-white'
          }`}
        >
          Präventiver Schutz
        </button>
        <button aria-pressed={activeSubSection === 'instandsetzung'}
          onClick={() => setActiveSubSection('instandsetzung')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubSection === 'instandsetzung'
              ? 'bg-text-main text-white'
              : 'bg-white text-slate-700 border border-home-grau/30 hover:bg-off-white'
          }`}
        >
          Instandsetzung &amp; Sanierung
        </button>
        <button aria-pressed={activeSubSection === 'praxis'}
          onClick={() => setActiveSubSection('praxis')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubSection === 'praxis'
              ? 'bg-text-main text-white'
              : 'bg-white text-slate-700 border border-home-grau/30 hover:bg-off-white'
          }`}
        >
          Praxiswissen &amp; Schadensfälle
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MATERIAL 1: HOLZ */}
      {/* ========================================================================= */}
      {selectedMaterial === 'holz' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {activeSubSection === 'uebersicht' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Trees className="text-shiraz" size={20} /> Holzschutz &amp; Holzinstandsetzung (DIN 68800)
                </h3>
                <span className="text-xs font-mono bg-off-white px-2 py-1 rounded border border-home-grau/30 text-slate-600">
                  Gebrauchsklassen GK 0 bis GK 5
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Als organischer, anisotrop-hygroskopischer Naturbaustoff unterliegt Holz biologischem Abbau durch holzzerstörende Pilze (Basidiomyceten wie Braunfäule, Weißfäule, Moderfäule) und tierische Holzschädlinge (Insekten wie Hausbock <em>Hylotrupes bajulus</em>, Gewöhnlicher Nagekäfer). 
                Entscheidender Aktivierungsparameter ist die <strong>Holzfeuchte <InlineMath math="u" /></strong>: Pilzwachstum setzt erst bei anhaltender Holzfeuchte <InlineMath math="u > 20\%" /> ein (Fasersättigungsgrenze <InlineMath math="\approx 28\text{ bis }30\%" />).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">Pilzbefall (Braunfäule &amp; Hausschwamm)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Abbau von Cellulose und Hemicellulose führt zu dramatischem Festigkeitsverlust und dem charakteristischen <em>Würfelbruch</em>. Gefährlichster Vertreter: Echter Hausschwamm (<em>Serpula lacrymans</em>), dessen Myzelien meterweit durch Mauerwerk wachsen und Wasser transportieren.
                  </p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">Insektenbefall (Hausbock &amp; Anobien)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Larven fressen verborgene Gänge im Splintholz von Nadelhölzern. Von außen sind oft nur wenige Millimeter große Ausfluglöcher und feines Bohrmehl sichtbar, während das Innengefüge bereits statisch zerstört ist.
                  </p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">Verwitterung &amp; UV-Photooxidation</strong>
                  <p className="text-slate-700 leading-relaxed">
                    UV-Strahlung spaltet das Bindeglied Lignin in wasserlösliche Abbauprodukte, die durch Regen ausgewaschen werden. Die Oberfläche vergraut und fasert aus (Abtrag <InlineMath math="\approx 1\text{ bis }2\text{ mm pro Jahrzehnt}" />).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'schutz' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3">
                Präventiver Holzschutz nach DIN 68800
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">1. Baulich-konstruktiver Holzschutz (DIN 68800-2) – Vorrangprinzip!</strong>
                  <p className="text-slate-700 leading-relaxed mb-2">
                    Nach DIN 68800-2 hat der bauliche Holzschutz absolute Priorität. Ziel ist die Einstufung in <strong>Gebrauchsklasse GK 0</strong>, wodurch chemischer Holzschutz überflüssig wird:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Dachüberstände zum Schutz der Fassaden vor Schlagregen</li>
                    <li>Sockelabstand von mindestens 30 cm zum Gelände (mind. 15 cm bei Spritzwasserschutz durch Kiesbett)</li>
                    <li>Hinterlüftung von Holzfassaden (mind. 20 mm Querschnitt)</li>
                    <li>Schutz des Hirnholzes durch Abdeckungen oder Abschrägung (<InlineMath math="\ge 15^\circ" />)</li>
                    <li>Dampfdiffusionsoffene Schichtaufbauten zur Vermeidung von Tauwasserausfall</li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">2. Chemischer Holzschutz (DIN 68800-3)</strong>
                  <p className="text-slate-700 leading-relaxed mb-2">
                    Nur zulässig, wenn Gefährdung vorliegt (GK 1 bis GK 4) und konstruktive Maßnahmen allein nicht ausreichen:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Kesseldruckimprägnierung (KDI):</strong> Vakuum-Druck-Verfahren zur Einbringung wasserlöslicher Kupfer- oder Borsalze bis in den Kern von Splintholz. Standard bei Erdkontakt (GK 4, Masten, Terrassenlager).</li>
                    <li><strong>Wirkstoffprüfung:</strong> Zertifizierte Holzschutzmittel mit RAL-Gütezeichen (Prüfprädikate Iv = Insekten vorbeugend, P = Pilze vorbeugend, W = Witterungsbeständig).</li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">3. Modifizierte Hölzer &amp; Dauerhaftigkeitsklassen (DIN EN 350)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Einsatz von Hölzern mit natürlicher Dauerhaftigkeit (Klasse 1: Robinie, Teak; Klasse 2: Eiche, Lärche) oder technisch modifizierten Hölzern:
                    <br />• <em>Thermoholz (TMT):</em> Thermische Behandlung bei 180–220 °C zerstört Hydroxylgruppen; Feuchteaufnahme sinkt um 50 %.
                    <br />• <em>Acetyliertes Holz (Accoya):</em> Veresterung freier OH-Gruppen mit Essigsäureanhydrid; extreme Dimensionsstabilität und Pilzresistenz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'instandsetzung' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3">
                Instandsetzungsverfahren für geschädigte Holztragwerke
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Flame size={14} className="text-shiraz" /> Bekämpfender Holzschutz (DIN 68800-4)
                  </strong>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Bekämpfung Echter Hausschwamm:</strong> Befallenes Holz muss mindestens <strong>1,0 Meter</strong> über den sichtbaren Befall hinaus abgesägt und entsorgt werden. Angrenzendes Mauerwerk muss abgeflämmt, Fugen ausgekratzt und mit Schwammsperrmitteln (Bohrlochinjektion) behandelt werden.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Heißluftverfahren gegen Insekten:</strong> Bauteilerwärmung mittels Hochleistungsgebläsen auf mindestens <strong>55 °C im Holzkern über 60 Minuten</strong> führt zur Denaturierung des Eiweißes aller Entwicklungsstadien (Eier, Larven, Käfer) ohne Gifteinsatz.
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Hammer size={14} className="text-shiraz" /> Statische Instandsetzung &amp; Holzprothesen
                  </strong>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Balkenkopf-Sanierung:</strong> Morsche Balkenköpfe in Außenwänden werden gesundgeschnitten. Ersatz durch Passstücke aus Vollholz/BSH, kraftschlüssig verbunden durch:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Eingeklebte Gewindestangen aus Edelstahl oder GFK/CFK-Stäben mit Epoxidharz</li>
                    <li>Seitliche Stahllaschen oder aufgeschraubte BSH-Verstärkungslaschen</li>
                    <li>Epoxidharz-Holzersatzmassen für lokale Ausflickungen an denkmalgeschützten Zierprofilen</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Schub- &amp; Biegeverstärkung:</strong> Einschrauben von Vollgewindeschrauben im <InlineMath math="45^\circ" />-Winkel zur Aufnahme von Querzug- und Schubspannungen.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'praxis' && (
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-shiraz" size={16} /> Häufiger Praxisfehler: Luftdichtes Einpacken von Holzbalkenköpfen
              </h4>
              <p className="text-slate-800 leading-relaxed">
                <strong>Schadensbild:</strong> Bei der energetischen Sanierung alter Holzbalkendecken werden Balkenköpfe im Auflagerbereich oft mit Bitumenbahnen oder Folien allseitig eingepackt, um sie vor Feuchte aus der Außenwand zu schützen.
              </p>
              <p className="text-slate-800 leading-relaxed">
                <strong>Fatale Folge:</strong> Raumseitig eindringende Feuchte oder Baurestfeuchte kann durch die diffusionsdichte Folie nicht mehr nach oben oder seitlich austrocknen. Es bildet sich ein Mikroklima mit <InlineMath math="u > 30\%" />, das innerhalb von 3 bis 5 Jahren zur vollständigen Zerstörung des Balkenkopfs durch Kellerschwamm oder Hausschwamm führt.
              </p>
              <p className="text-slate-800 leading-relaxed">
                <strong>Fachgerechte Sanierung:</strong> Stirn- und Längsseiten des Holzbalkenkopfs müssen <strong>hinterlüftet</strong> bleiben (mindestens 2 cm Luftspalt zur Wand). Nur die Unterseite erhält eine kapillarbrechende Unterlage (z. B. Bitumendachpappe auf dem Mauerwerk).
              </p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MATERIAL 2: METALLE & STAHL */}
      {/* ========================================================================= */}
      {selectedMaterial === 'metalle' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {activeSubSection === 'uebersicht' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Shield className="text-shiraz" size={20} /> Metallschutz &amp; Korrosionsschutz (DIN EN ISO 12944)
                </h3>
                <span className="text-xs font-mono bg-off-white px-2 py-1 rounded border border-home-grau/30 text-slate-600">
                  Klassen C1 bis CX • ISO 8501-1
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Ungeschützter Baustahl korrodiert in Gegenwart von Feuchtigkeit und Sauerstoff durch elektrochemische Oxidation: 
                <InlineMath math="4\text{Fe} + 3\text{O}_2 + 6\text{H}_2\text{O} \rightarrow 4\text{Fe(OH)}_3" />. 
                Die atmosphärische Korrosivität richtet sich nach der relativen Luftfeuchte (<InlineMath math="> 60\%" />), der Benetzungsdauer sowie den Luftverunreinigungen (<InlineMath math="\text{SO}_2" /> im Industrieklima, <InlineMath math="\text{Cl}^-" /> im Küstenklima).
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-off-white border-b border-home-grau/30 text-slate-800">
                      <th className="p-2.5 font-bold">Kategorie (ISO 12944-2)</th>
                      <th className="p-2.5 font-bold">Korrosivitätsniveau</th>
                      <th className="p-2.5 font-bold">Typische Umgebung</th>
                      <th className="p-2.5 font-bold">Zinkabtrag [µm/a]</th>
                      <th className="p-2.5 font-bold">Stahlabtrag [µm/a]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20 text-slate-700">
                    <tr>
                      <td className="p-2.5 font-bold text-blue-700">C1</td>
                      <td className="p-2.5">Sehr gering</td>
                      <td className="p-2.5">Innenräume beheizt (Büros, Schulen)</td>
                      <td className="p-2.5">&lt; 0,1</td>
                      <td className="p-2.5">&le; 1,3</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-blue-700">C2</td>
                      <td className="p-2.5">Gering</td>
                      <td className="p-2.5">Unbeheizte Gebäude (Lagerhallen, Sporthallen)</td>
                      <td className="p-2.5">0,1 bis 0,7</td>
                      <td className="p-2.5">&gt; 1,3 bis 25</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-amber-700">C3</td>
                      <td className="p-2.5">Mäßig</td>
                      <td className="p-2.5">Stadt- und Industrieatmosphäre mit mäßigem SO₂</td>
                      <td className="p-2.5">0,7 bis 2,1</td>
                      <td className="p-2.5">&gt; 25 bis 50</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-rose-700">C4</td>
                      <td className="p-2.5">Stark</td>
                      <td className="p-2.5">Industriegebiete, Küstenbereiche mit mäßiger Salzbelastung</td>
                      <td className="p-2.5">2,1 bis 4,2</td>
                      <td className="p-2.5">&gt; 50 bis 80</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-rose-700">C5</td>
                      <td className="p-2.5">Sehr stark</td>
                      <td className="p-2.5">Industrie mit hoher Feuchte, Küsten mit hoher Salzlast</td>
                      <td className="p-2.5">4,2 bis 8,4</td>
                      <td className="p-2.5">&gt; 80 bis 200</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-purple-700">CX</td>
                      <td className="p-2.5">Extrem</td>
                      <td className="p-2.5">Offshore, Spritzwasserzonen, Tunnels mit Tausalznebel</td>
                      <td className="p-2.5">&gt; 8,4 bis 25</td>
                      <td className="p-2.5">&gt; 200 bis 700</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubSection === 'schutz' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3">
                Korrosionsschutzsysteme nach DIN EN ISO 12944
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">1. Oberflächenvorbereitung nach ISO 8501-1 (Grundvoraussetzung!)</strong>
                  <p className="text-slate-700 leading-relaxed mb-2">
                    Ohne einwandfreie Entrostung versagt jedes Lacksystem vorzeitig:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Sa 2 ½ (Sehr gründliches Strahlen):</strong> Nahezu metallisch blank. Zunder, Rost und Fremdkörper werden so gründlich entfernt, dass nur noch schattenhafte Flecken sichtbar sind. <em>Industrieller Mindeststandard!</em></li>
                    <li><strong>Sa 3 (Optisch reines Metall):</strong> Völlig freie, silbrig glänzende Oberfläche für höchste Beanspruchung.</li>
                    <li><strong>Rauheit (DIN EN ISO 8503):</strong> Mittlere Rauheit (Rz 40–80 µm) sichert die mechanische Verankerung.</li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">2. Mehrschichtige Beschichtungssysteme (Typischer Schichtaufbau)</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Grundbeschichtung (60–80 µm):</strong> Zinkstaubhaltiges Epoxidharz (EP-Zinkstaub). Zink opfert sich galvanisch bei Beschädigung (aktiver kathodischer Schutz).</li>
                    <li><strong>Zwischenbeschichtung (80–160 µm):</strong> Epoxidharz mit Eisenglimmer (MIOX). Die plättchenförmigen Schuppen lagern sich parallel zur Oberfläche an ("Schuppenpanzer") und verlängern den Diffusionsweg für Wasser und Ionen drastisch.</li>
                    <li><strong>Deckbeschichtung (60–80 µm):</strong> Polyurethan (2K-PUR) für sehr gute UV-Stabilität, Kreidungsresistenz und Farbtonbeständigkeit.</li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">3. Schutzdauerbereiche nach DIN EN ISO 12944-1 (Ausgabe 2019-01)</strong>
                  <p className="text-slate-700 leading-relaxed mb-2">
                    Die Neufassung der Normenreihe definiert vier statt der früheren drei Schutzdauerklassen bis zur ersten grundlegenden Instandsetzung:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-white p-2 rounded border border-home-grau/25">
                      <span className="font-bold text-slate-800 text-xs block">L (Gering)</span>
                      <span className="text-[11px] text-slate-500 font-mono">bis 7 Jahre</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-home-grau/25">
                      <span className="font-bold text-slate-800 text-xs block">M (Mäßig)</span>
                      <span className="text-[11px] text-slate-500 font-mono">7 bis 15 Jahre</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-home-grau/25">
                      <span className="font-bold text-slate-800 text-xs block">H (Hoch)</span>
                      <span className="text-[11px] text-slate-500 font-mono">15 bis 25 Jahre</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-shiraz/30 bg-rose-50/20">
                      <span className="font-bold text-shiraz text-xs block">VH (Sehr hoch)</span>
                      <span className="text-[11px] text-shiraz font-mono font-bold">&gt; 25 Jahre (neu)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">4. Duplex-Systeme (Feuerverzinkung + Beschichtung)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Kombination aus Stückverzinkung nach DIN EN ISO 1461 (Zinkauflage 70–150 µm) und nachfolgender organischer Beschichtung. 
                    Der Synergie-Faktor beträgt <InlineMath math="S = 1{,}2\text{ bis }2{,}5" />: Die Gesamtschutzdauer ist wesentlich länger als die Summe der Einzelschutzdauern (<InlineMath math="t_{\text{ges}} = S \cdot (t_{\text{Zink}} + t_{\text{Lack}})" />). Vor dem Beschichten ist Sweep-Strahlen zwingend!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'instandsetzung' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3">
                Instandsetzung und Verstärkung geschädigter Stahltragwerke
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <RefreshCw size={14} className="text-shiraz" /> Altanstrichsanierung nach ISO 4628
                  </strong>
                  <p className="text-slate-700 leading-relaxed">
                    Ermittlung des Rostgrads nach DIN EN ISO 4628-3 (Ri 0 = rostfrei bis Ri 5 = &gt; 40 % Rostfläche):
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Ri 1 bis Ri 3 (&lt; 1 % Rost):</strong> Partielles Ausbessern. Lokales Strahlen auf P Sa 2 ½, Grundieren und 1–2 Gesamtlackierungen.</li>
                    <li><strong>Ri 4 bis Ri 5 (&gt; 1 % Rost / Enthaftung):</strong> Totalabtrag des Altsystems. Vollständiges Sandstrahlen auf Sa 2 ½ und kompletter Neuaufbau des Beschichtungssystems.</li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Wrench size={14} className="text-shiraz" /> Statische Ertüchtigung von Stahlbauteilen
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Querschnittsverlust durch Lochfraß:</strong> Anschweißen von Aussteifungs- und Verstärkungslamellen unter Berücksichtigung des Schweißbarkeitsäquivalents (<InlineMath math="\text{CEV} \le 0{,}45" />). Vorwärmung erforderlich!</li>
                    <li><strong>Ermüdungsrisse:</strong> Setzen von <em>Entlastungsbohrungen</em> am Rissende zur Reduktion der Spannungsspitze, Ausschleifen des Risses (V-Naht) und Reparaturschweißung mit WIG/MAG.</li>
                    <li><strong>Nietensanierung:</strong> Gelockerte oder durchgerostete Niete werden ausgebohrt und durch hochfeste vorgespannte Schrauben (HV-Schrauben nach DIN EN 14399) ersetzt.</li>
                    <li><strong>CFK-Lamellenverstärkung:</strong> Aufkleben hochmoduliger Kohlenstofffaserlamellen zur Entlastung ermüdungsbeanspruchter Brückenträger.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'praxis' && (
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-shiraz" size={16} /> Häufiger Praxisfehler: Taupunktunterschreitung bei der Lackierung
              </h4>
              <p className="text-slate-800 leading-relaxed">
                <strong>Ursache:</strong> Beim Beschichten von Stahl auf Baustellen wird der Mindestabstand zwischen Stahloberflächentemperatur <InlineMath math="T_{\text{Stahl}}" /> und der Taupunkttemperatur <InlineMath math="T_{\text{Tau}}" /> nicht eingehalten.
              </p>
              <p className="text-slate-800 leading-relaxed">
                <strong>Anforderung DIN EN ISO 12944-7:</strong> Die Stahloberflächentemperatur muss während des gesamten Strahl- und Beschichtungsvorgangs mindestens <strong>3 °C (3 Kelvin) über dem Taupunkt</strong> liegen (<InlineMath math="T_{\text{Stahl}} \ge T_{\text{Tau}} + 3\text{ K}" />), und die relative Luftfeuchte darf <InlineMath math="85\%" /> nicht überschreiten.
              </p>
              <p className="text-slate-800 leading-relaxed">
                <strong>Schadensfolge:</strong> Ein unsichtbarer mikroskopischer Kondensatfilm auf dem frisch gestrahlten Stahl verhindert die Benetzung. Es kommt nach 6 bis 18 Monaten zu großflächiger Blasenbildung (Osmoseblasen) und partiellem Enthaftungsabriss.
              </p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MATERIAL 3: KUNSTSTOFFE & FUGEN */}
      {/* ========================================================================= */}
      {selectedMaterial === 'kunststoffe' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {activeSubSection === 'uebersicht' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Box className="text-shiraz" size={20} /> Schutz &amp; Instandsetzung von Kunststoffen &amp; Dichtstoffen
                </h3>
                <span className="text-xs font-mono bg-off-white px-2 py-1 rounded border border-home-grau/30 text-slate-600">
                  DIN 18540 • DVS 2207 / 2208 • DIN EN 15651
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Kunststoffe im Bauwesen (Flachdachbahnen wie PVC-P, FPO/TPO, EPDM; PE-HD-Rohre, Dichtstoffe wie Silikon, Polyurethan, MS-Polymer) unterliegen Alterung durch <strong>UV-Strahlung, Sauerstoff, thermische Wechsellasten und Weichmacherverlust</strong>. 
                Die Hauptfolgen sind Kettenspaltung, Versprödung, Schrumpfung und Rissbildung.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">Photooxidation &amp; Versprödung</strong>
                  <p className="text-slate-700 leading-relaxed">
                    UV-Quanten spalten C-C-Kettenbindungen. Sauerstoffradikale bilden Hydroperoxide. Der E-Modul steigt sprunghaft an; der Kunststoff verliert seine Dehnbarkeit und bricht bei thermischer Dehnung.
                  </p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">Weichmachermigration</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Niedermolekulare Weichmacher (Phthalate in Weich-PVC) wandern an die Oberfläche oder diffundieren in Kontaktmaterialien (Bitumen, EPS-Dämmung). Die Bahn schrumpft und reißt an den Befestigern aus.
                  </p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">Spannungsrisskorrosion (ESC)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Gleichzeitige Einwirkung mechanischer Zugspannungen und aggressiver Medien (Tenside, Fette) führt bei amorphen Thermoplasten zu sprödem Versagen ohne plastische Vorverformung.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'schutz' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3">
                Präventive Schutzmaßnahmen für Bauwerkspolymere
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">1. UV- und Alterungsstabilisierung (Compoundierung)</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Ruß (Carbon Black):</strong> Fein disperser Ruß (2,0 bis 2,5 M.-%) in PE-HD-Dichtungsbahnen und Rohren absorbiert UV-Strahlung vollständig und leitet sie als Wärme ab. Lebensdauer &gt; 50 Jahre.</li>
                    <li><strong>HALS-Lichtschutzmittel (Hindered Amine Light Stabilizers):</strong> Radikalfänger im Kunststoff fangen intermediäre Peroxidradikale ab und regenerieren sich kontinuierlich im <em>Denisov-Zyklus</em>.</li>
                    <li><strong>UV-Absorber:</strong> Hydroxyphenylbenztriazole wandeln UV-Licht photochemisch in unschädliche Wärme um.</li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">2. Weichmacherschutz &amp; Trennlagen</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Bei Verlegung von PVC-P-Dichtungsbahnen auf Bitumen oder Polystyrol-Hartschaum (EPS/XPS) muss zwingend eine <strong>Trennlage aus Glasvlies (mind. 120 g/m²) oder Polyestervlies (mind. 300 g/m²)</strong> eingebaut werden. Ohne Trennlage entzieht das Bitumen dem PVC die Weichmacher, was zur sofortigen Versprödung und Verhärtung führt.
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">3. Konstruktive Fugenplanung (DIN 18540)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Sicherung der <strong>Zweiflankenhaftung</strong> durch geschlossenzellige PE-Hinterfüllschnüre. Ein Fugendichtstoff darf niemals am Fugenboden haften (Dreiflankenhaftung erzeugt unzulässige multiaxiale Zugspannungen und führt zum Flankenabriss).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'instandsetzung' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3">
                Sanierungsverfahren für Kunststoffe, Dichtungsbahnen und Rohrleitungen
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Flame size={14} className="text-shiraz" /> Thermoplastisches Kunststoffschweißen (DVS 2207 / 2208)
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Warmgasziehschweißen (WZ):</strong> Fügen von Reparaturflicken auf thermoplastischen Bahnen (PVC, FPO, PE) mittels Heißluftfön und Andrückrolle. Nahtüberdeckung mind. 50 mm.</li>
                    <li><strong>Heizelementschweißen (HS / Spiegelschweißen):</strong> Stumpfschweißen von PE-HD-Rohren nach planparallelem Hobeln unter definiertem Anpressdruck.</li>
                    <li><strong>Heizwendelschweißen (HM):</strong> Aufschieben von Reparaturmuffen mit integriertem Heizdraht; Verschmelzen durch computergesteuerten Stromimpuls.</li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Wrench size={14} className="text-shiraz" /> Flüssigkunststoff- &amp; Inliner-Sanierung
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Flüssigkunststoff-Überarbeitung (PMMA / 2K-PUR):</strong> Vollflächig vliesarmierte Beschichtung über undichten Dachanschlüssen, Gullys und Lichtkuppeln. Nahtlose, hochflexible Einbindung komplizierter Geometrien.</li>
                    <li><strong>Fugensanierung:</strong> Altdichtstoff restlos herausschneiden, Flanken mechanisch abschleifen, Primerauftrag, neue PE-Rundschnur und Neuverfugung mit modifiziertem Silikon oder MS-Polymer.</li>
                    <li><strong>Schlauchrelining (Kanalrohrinstandsetzung):</strong> Einziehen eines harzgetränkten Textilschlauchs (Polyester- oder Vinylesterharz) in das Altrohr und Aushärtung mittels UV-Lichtkette (grabenlose Kanalsanierung).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'praxis' && (
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-shiraz" size={16} /> Häufiger Praxisfehler: Schweißen auf verschmutzten, oxidierten Bahnen
              </h4>
              <p className="text-slate-800 leading-relaxed">
                <strong>Problem:</strong> Bei der Instandsetzung älterer FPO- oder PE-Flachdachbahnen wird ein neuer Reparaturflicken direkt auf die bewitterte Altbahn aufgeschweißt.
              </p>
              <p className="text-slate-800 leading-relaxed">
                <strong>Schadensursache:</strong> Durch langjährige UV-Einwirkung hat sich auf der Altbahn eine mikroskopische Photooxidationsschicht gebildet, auf der Polymerketten keine Diffusion mehr eingehen können. Die Schweißnaht besitzt keinerlei Schälfestigkeit und reißt beim ersten Windsturm ab.
              </p>
              <p className="text-slate-800 leading-relaxed">
                <strong>Fachgerechtes Vorgehen nach DVS:</strong> Die Altbahn muss im Nahtbereich mit Spezialreiniger gereinigt und anschließend <strong>mechanisch abgekratzt oder angeschliffen werden</strong>, um unverbrauchte, schweißfähige Polymerschichten freizulegen. Erst danach darf die Heißluftverschweißung mit Andrückrolle erfolgen.
              </p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MATERIAL 4: ASPHALT & BITUMEN */}
      {/* ========================================================================= */}
      {selectedMaterial === 'asphalt' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {activeSubSection === 'uebersicht' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <TrendingUp className="text-shiraz" size={20} /> Schutz &amp; Erhaltung von Asphaltbefestigungen (ZTV BEA-StB)
                </h3>
                <span className="text-xs font-mono bg-off-white px-2 py-1 rounded border border-home-grau/30 text-slate-600">
                  RStO 12/24 • ZTV Fug-StB • TL Bitumen
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Asphalt ist ein thermoviskoelastischer Verbundwerkstoff aus Gesteinskörnungen und dem viskoelastischen Bindemittel Bitumen. 
                Unter dem kombinierten Einfluss von Verkehrsbelastung (Schwerlastachsen), Sauerstoff, UV-Licht und Temperaturschwankungen altert das Bitumen durch <strong>Oxidation und Verlust flüchtiger Maltene</strong>. 
                Der Asphaltenanteil steigt an, die Nadelpenetration sinkt, und der Erweichungspunkt Ring und Kugel (<InlineMath math="T_{\text{RuK}}" />) steigt.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">Spurrinnen &amp; Verformung</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Bei hohen Sommertemperaturen sinkt die Viskosität des Bitumens. Wiederholte Schwerlastüberrollungen führen zu plastischer Nachverdichtung und seitlichem Materialaufwurf in den Rollspuren.
                  </p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">Ermüdungsrisse (Netzrisse)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Alterungsbedingte Versprödung führt bei winterlichen Zugspannungen zur Bildung von Mikrorissen, die sich unter Last zu charakteristischen "Krokodilhaut"-Netzrissen zusammenschließen.
                  </p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">Schlaglöcher &amp; Frostaufbrüche</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Wasser dringt über Risse in den Schichtenverbund ein. Bei Frost-Tau-Wechseln sprengt das Eis das Korngerüst auf; der Verkehr walkt die losen Gesteinskörner heraus.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'schutz' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3">
                Präventive Schutzmaßnahmen für Asphaltbeläge
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">1. SAMI-Schichten (Stress Absorbing Membrane Interlayer)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Elastomermodifizierte Bitumenschicht (oft mit Vliesarmierung), die vor dem Einbau der Asphaltdeckschicht aufgerollt wird. Sie baut Scherspannungen elastisch ab und verhindert, dass Risse aus dem Unterbau (z. B. Fugen von Betonfahrbahnen oder Zementstabilisierungen) in die Deckschicht durchschlagen (Reflexionsrisse).
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">2. Oberflächenbehandlungen (OB nach ZTV BEA-StB)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Aufspritzen einer polymermodifizierten Bitumenemulsion (z. B. C60BP5-S) und direktes Abstreuen mit Edelsplitt (z. B. 2/5 oder 5/8 mm) mit anschließendem Einwalzen mit Gummiradwalzen. Versiegelt die Poren gealterter Deckschichten und stellt die Griffigkeit wieder her.
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">3. Bitumen-Verjüngungsmittel (Rejuvenators)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Sprühlösungen auf Basis spezieller aromatischer Pflanzen- oder Mineralöle. Sie dringen bis zu 10 mm in den Asphalt ein, reichern die verarmte Maltenphase wieder an und senken den Versprödungspunkt um mehrere Grad Celsius.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'instandsetzung' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3">
                Instandsetzungsverfahren nach ZTV BEA-StB
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Wrench size={14} className="text-shiraz" /> Rissesanierung &amp; kleinflächige Reparaturen
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Rissheißverguss (ZTV Fug-StB):</strong> Aufweiten des Risses auf mind. 10–15 mm Breite, Heißluftlanzen-Reinigung (&gt; 150 °C zum Trocknen und Anwärmen der Flanken), Voranstrich und Verfüllen mit polymermodifizierter Bitumenheißvergussmasse. Abstreuen mit Brechsand.</li>
                    <li><strong>Schlaglochsanierung:</strong> Kaltmischgut ist nur ein <em>Notbehelf</em> für den Winter! Dauerhafte Reparatur verlangt: Rechtwinkliges Ausschneiden der Ränder, Grundieren mit Bitumenemulsion, Heißasphalteinbau (AC 8 / AC 11) aus dem Thermocontainer und maschinelle Verdichtung.</li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <RefreshCw size={14} className="text-shiraz" /> Großflächige Deckenerneuerung &amp; Dünnschichten
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>DSK (Dünne Schichten im Kalteinbau):</strong> Kalt verarbeiteter Mikroasphalt aus Edelsplitt, Zement, Wasser und Polymerbitumen-Emulsion. Einbau in Schichtdicken von 8–15 mm bei voller Verkehrsfreigabe nach 30 Minuten.</li>
                    <li><strong>Kaltfräsen &amp; Deckschichterneuerung:</strong> Abfräsen der obersten 4 cm (Deckschicht) und profilgerechter Neueinbau eines Splittmastixasphalts (SMA 11 S) oder Asphaltbetons (AC 11 D S) nach Anspritzen mit Bitumenemulsion (Schichtenverbund nach ZTV Asphalt-StB).</li>
                    <li><strong>In-situ-Heißrecycling (Repave/Remix):</strong> Erwärmen des Altbelags mit Infrarotstrahlern, Auflockern mit Zinken, Zudosieren von Neubitumen/Splitt und sofortiges Wiedereinbauen in einem Arbeitsgang.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'praxis' && (
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-shiraz" size={16} /> Häufiger Praxisfehler: Mangelhafter Schichtenverbund beim Asphalteinbau
              </h4>
              <p className="text-slate-800 leading-relaxed">
                <strong>Schadensbild:</strong> Nach 2 bis 4 Jahren schiebt sich die Asphaltdeckschicht vor Kreuzungen wellenförmig auf ("Wellblechbildung") oder platzt großflächig ab.
              </p>
              <p className="text-slate-800 leading-relaxed">
                <strong>Ursache:</strong> Vor dem Einbau der neuen Deckschicht wurde die Unterlage nicht ausreichend gekehrt oder die Bitumenemulsion zum Anspritzen wurde ungleichmäßig dosiert (Vorgabe: <InlineMath math="150\text{ bis }250\text{ g/m}^2" /> Restbindemittel). Zudem wurde der Asphalt eingebaut, bevor die Emulsion vollständig "gebrochen" (Wasser verdampft) war.
              </p>
              <p className="text-slate-800 leading-relaxed">
                <strong>Qualitätsprüfung:</strong> Nach ZTV Asphalt-StB muss der Schichtenverbund an Bohrkernen mittels <strong>Schichtenverbundprüfung nach Leutner</strong> nachgewiesen werden. Die dynamische Scherkraft muss mindestens <InlineMath math="15\text{ kN}" /> erreichen.
              </p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MATERIAL 5: MAUERWERK & NATURSTEIN */}
      {/* ========================================================================= */}
      {selectedMaterial === 'mauerwerk' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {activeSubSection === 'uebersicht' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Wrench className="text-shiraz" size={20} /> Schutz &amp; Instandsetzung von Mauerwerk &amp; Naturstein
                </h3>
                <span className="text-xs font-mono bg-off-white px-2 py-1 rounded border border-home-grau/30 text-slate-600">
                  WTA-Merkblätter Reihe 2 &amp; 4 • DIN 18533
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Mauerwerks- und Natursteinbauten (Ziegel, Sandstein, Kalkstein, Tuff) leiden primär unter <strong>aufsteigender Feuchtigkeit und bauschädlichen Salzen</strong> (Chloride, Nitrate, Sulfate). 
                Beim Verdunsten des Wassers kristallisieren die Salze im oberflächennahen Porenraum. Der <strong>Kristallisationsdruck</strong> (<InlineMath math="\sigma_{\text{krist}} \le 200\text{ MPa}" />) übersteigt die Zugfestigkeit des Steins (<InlineMath math="f_{\text{ct}} \approx 1\text{ bis }5\text{ MPa}" />) um ein Vielfaches und sprengt die Steinoberfläche ab.
              </p>
            </div>
          )}

          {activeSubSection === 'schutz' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3">
                Präventiver Schutz von historischem Mauerwerk und Naturstein
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">1. Hydrophobierung mit Alkylalkoxysilanen</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Eindringtiefe mindestens 3 bis 5 mm. Schützt Fassaden vor eindringendem Schlagregen, erhält aber die Diffusionsfähigkeit für Wasserdampf. <em>Wichtig:</em> Niemals auf salzbelasteten Untergründen anwenden, da die Salzverdunstungsfront hinter die hydrophobierte Schicht verlagert wird und großflächige Schalenabplatzungen verursacht!
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1">2. Konservierung mit Kieselsäureester (KSE)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Bei mürben, absandenden Natursteinen (z. B. Schilfsandstein): Tränkung mit monomeren Kieselsäureestern. Durch Reaktion mit Porenwasser hydrolysiert das Molekül und scheidet amorphes Siliziumdioxid-Gel (<InlineMath math="\text{SiO}_2 \cdot n\text{H}_2\text{O}" />) ab, das das Steingefüge mineralisch wieder verfestigt, ohne Poren zu verstopfen.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'instandsetzung' && (
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3">
                Instandsetzungsverfahren nach WTA
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Droplets size={14} className="text-shiraz" /> Nachträgliche Horizontalsperren (WTA 4-10)
                  </strong>
                  <p className="text-slate-700 leading-relaxed">
                    Bohrlöcher (<InlineMath math="\varnothing 12\text{ bis }16\text{ mm}" /> im Abstand von 10–12 cm) in die Lagerfuge einbringen. Injektion von:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Silan-Cremes (drucklos):</strong> Hochkonzentrierte Creme wandert durch Kapillarkräfte und Spreitvermögen selbst bei Durchfeuchtungsgraden bis 95 % tief ins Mauerwerk und bildet eine dauerhafte wasserabweisende Sperrschicht.</li>
                    <li><strong>Mikroemulsionen (Niederdruckinjektion):</strong> Kontrolliertes Einbringen über Packer bei stark zerklüftetem Mauerwerk.</li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Layers size={14} className="text-shiraz" /> Sanierputzsysteme &amp; Rissverankerung
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Sanierputz nach WTA-Merkblatt 2-9:</strong> Hochporöser Putzmörtel mit Gesamtporenvolumen <InlineMath math="\ge 40\text{ Vol.-\%}" />. Er nimmt Salzlösungen kapillar auf; das Wasser verdunstet im Putzinneren, und die Salze kristallisieren schadlos in den Poren aus, ohne die Wandoberfläche zu zerstören.</li>
                    <li><strong>Spiralanker-Systeme:</strong> Helikale Edelstahl-Zuganker werden in geschädigte Lagerfugen eingefräst und mit thixotropem Zementquellmörtel verpresst, um Mauerwerksrisse kraftschlüssig zu überbrücken und den Mauerwerksverbund wiederherzustellen.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'praxis' && (
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-shiraz" size={16} /> Häufiger Praxisfehler: Zementputz auf salzbelastetem Feuchtmauerwerk
              </h4>
              <p className="text-slate-800 leading-relaxed">
                <strong>Fehler:</strong> Auf feuchtem, salzbelastetem Altziegelmauerwerk wird ein dichter, starrer Zementputz aufgetragen, um die Feuchte "einzusperren".
              </p>
              <p className="text-slate-800 leading-relaxed">
                <strong>Fatale Folge:</strong> Zementputz besitzt einen sehr hohen Diffusionswiderstand. Die aufsteigende Feuchte steigt im Mauerwerk kapillar noch höher auf (teilweise bis ins 1. OG). Hinter dem dichten Putz reichern sich Salze an; der Kristallisationsdruck sprengt nach 2 bis 3 Wintern den Putz mitsamt den Ziegelstirnen ab.
              </p>
              <p className="text-slate-800 leading-relaxed">
                <strong>Lösung:</strong> Altputz mindestens 80 cm über die Schadensgrenze abschlagen, Fugen 2 cm tief auskratzen, Mauerwerk trocken bürsten, WTA-zertifizierten Sanierputz aufbringen und Horizontalsperre herstellen.
              </p>
            </div>
          )}

        </div>
      )}

      {/* ModuleFooter */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Schutzdauer eines Duplex-Systems"
        zielGleichung="t_{Duplex} = S \cdot (t_{Zn} + t_{Lack})"
        schritte={[
          { titel: 'Zinkschicht', erklaerung: '85 µm Feuerverzinkung in C4 (Zinkabtrag bis 4,2 µm/a):', formel: 't_{Zn} = 85 / 4{,}2 \\approx 20\\,\\text{a}' },
          { titel: 'Beschichtung', erklaerung: 'Erwartete Schutzdauer der Beschichtung allein (Lehrwert):', formel: 't_{Lack} = 10\\,\\text{a}' },
          { titel: 'Synergie', erklaerung: 'Synergiefaktor nach Literatur 1,2 bis 2,5; gewählt 1,5:', formel: 't_{Duplex} = 1{,}5 \\cdot (20 + 10) = 45\\,\\text{a}' }
        ]}
        ergebnisHinweis="Der Synergieeffekt entsteht, weil die Beschichtung die Zinkkorrosion bremst und das Zink Unterrostung an Fehlstellen verhindert."
        normQuelle="DIN EN ISO 9223:2012-05; DIN EN ISO 14713-1; DIN EN ISO 12944-5"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Resttragfähigkeit eines angefaulten Holzbalkens"
        zielGleichung="\frac{W_{Rest}}{W_0} = \frac{b_r \cdot h_r^2}{b \cdot h^2}"
        schritte={[
          { titel: 'Ausgangsquerschnitt', erklaerung: 'Balken b/h = 160/220 mm:', formel: 'W_0 = \\frac{160 \\cdot 220^2}{6} = 1\\,290\\,667\\,\\text{mm}^3' },
          { titel: 'Restquerschnitt', erklaerung: 'Braunfäule seitlich je 30 mm und unten 30 mm abgetragen: b_r = 100 mm, h_r = 190 mm.', formel: 'W_{Rest} = \\frac{100 \\cdot 190^2}{6} = 601\\,667\\,\\text{mm}^3' },
          { titel: 'Verhältnis', erklaerung: 'Verbleibende Biegetragfähigkeit:', formel: '\\frac{601\\,667}{1\\,290\\,667} = 0{,}47 = 47\\,\\%' }
        ]}
        ergebnisHinweis="Schon 3 cm Fäule ringsum halbieren die Biegetragfähigkeit. Vor der Sanierung nach DIN 68800-4 Feuchteursache beseitigen und den gesunden Restquerschnitt durch Bohrwiderstandsmessung bestimmen."
        normQuelle="DIN 68800-4:2020-12; DIN EN 1995-1-1"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="instandsetzung_materialien" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 12 Schutz & Instandsetzung: Holz-, Metall- und Mauerwerksinstandsetzung, Normausgaben und Quellen geprüft; fachliche Freigabe durch den Autor ausstehend)"
        weblinks={[
          { title: "WTA e.V. - Wissenschaftlich-Technische Arbeitsgemeinschaft für Bauwerkserhaltung", url: "https://www.wta-international.org" },
          { title: "DVS - Deutscher Verband für Schweißen und verwandte Verfahren", url: "https://www.dvs-home.de" },
          { title: "FGSV - Forschungsgesellschaft für Straßen- und Verkehrswesen", url: "https://www.fgsv.de" }
        ]}
        wikipedia={[
          { title: "Holzschutz", url: "https://de.wikipedia.org/wiki/Holzschutz" },
          { title: "Korrosionsschutz", url: "https://de.wikipedia.org/wiki/Korrosionsschutz" },
          { title: "Asphalt", url: "https://de.wikipedia.org/wiki/Asphalt" },
          { title: "Sanierputz", url: "https://de.wikipedia.org/wiki/Sanierputz" }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Gross, D.; Seelig, T.: Bruchmechanik – Mit einer Einführung in die Mikromechanik. Berlin: Springer Vieweg (aktuelle Auflage)',
          'Stahr, M. (Hrsg.): Bausanierung – Erkennen und Beheben von Bauschäden. Wiesbaden: Springer Vieweg (aktuelle Auflage)'
        ]}
        regelwerke={[
          { title: 'DIN 68800 (Holzschutz; Teil 1:2019-06, Teil 2:2022-02, Teil 3:2020-03, Teil 4:2020-12)' },
          { title: 'DIN EN ISO 12944 (Korrosionsschutz von Stahlbauten durch Beschichtungssysteme)' },
          { title: 'DVS 2207 / DVS 2208 (Schweißen von thermoplastischen Kunststoffen)', url: 'https://www.dvs-regelwerk.de/' },
          { title: 'ZTV BEA-StB (Zusätzliche Technische Vertragsbedingungen für die Erhaltung von Asphaltbefestigungen)', url: 'https://www.fgsv-verlag.de/' },
          { title: 'WTA-Merkblatt 2-9-20/D (Sanierputzsysteme) & 4-10 (Injektionsverfahren gegen kapillaren Feuchtetransport)', url: 'https://www.wta-international.org/' }
        ]}
        formeln={[
          {
            formel: 'S = \\frac{t_{\\text{Duplex}}}{t_{\\text{Zink}} + t_{\\text{Lack}}} = 1{,}2 \\text{ bis } 2{,}5',
            erklaerung: 'Synergiefaktor S von Duplex-Systemen (Feuerverzinkung + Beschichtung; Literaturwerte, vgl. DIN EN ISO 14713-1 und DIN EN ISO 12944-5): Die Gesamtschutzdauer übersteigt die algebraische Summe der Einzelschutzdauern durch gegenseitigen Schutz vor Weißrost und Unterrostung.',
            quelle: 'DIN EN ISO 14713-1 / DIN EN ISO 12944-5'
          },
          {
            formel: 'u = \\frac{m_w - m_0}{m_0} \\cdot 100\\% \\le 20\\%',
            erklaerung: 'Kritische Holzfeuchte u (Darrprobe nach DIN EN 13183-1): Masse des enthaltenen Wassers bezogen auf die Trockenmasse m₀. Ab u > 20 % (insbesondere bei u > 28-30 % Fasersättigung) setzt das destruktive Wachstum holzzerstörender Pilze ein.',
            quelle: 'DIN 68800-1'
          },
          {
            formel: 'b_{\\text{erf}} = \\frac{\\Delta l_{\\text{therm}} + \\Delta l_{\\text{hydr}}}{\\varepsilon_{\\text{zul}}} + \\text{Toleranz}',
            erklaerung: 'Erforderliche Fugenbreite für elastische Fugendichtstoffe nach DIN 18540: Verhältnis der Gesamtfugenbewegung zur zulässigen Gesamtverformung ε_zul (typisch 20-25 % bei Silikon/PU) zzgl. Fertigungstoleranzen.',
            quelle: 'DIN 18540 / IVD-Merkblatt'
          }
        ]}
      />
    </div>
  );
}
