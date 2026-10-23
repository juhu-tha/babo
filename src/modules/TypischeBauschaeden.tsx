import React, { useState } from 'react';
import { 
  FileWarning, 
  ChevronRight, 
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Activity,
  Layers,
  Wrench
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';

type TypSchadTab = 'feuchtigkeit' | 'risse' | 'korrosion' | 'unvertraeglichkeiten' | 'tief_ingenieurbau' | 'analysator';

export default function TypischeBauschaeden() {
  const { typischeBauschaedenSubTab } = useTabContext();
  // Startkategorie aus Querverweisen (z. B. Fallakten in „Große Materialschäden“)
  const [activeSubTab, setActiveSubTab] = useState<TypSchadTab>(typischeBauschaedenSubTab ?? 'feuchtigkeit');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const tabs = [
    { id: 'feuchtigkeit', label: 'Feuchtigkeit & Schimmel', icon: Droplets, desc: 'Feuchtigkeitseintritte, kapillare Effekte, Abdichtungsversagen & Schimmel' },
    { id: 'risse', label: 'Risse & Verformungen', icon: Activity, desc: 'Schwindrisse, Setzungsrisse, thermische Spannungen & Fugenabrisse' },
    { id: 'korrosion', label: 'Korrosion & Betonschäden', icon: Layers, desc: 'Karbonatisierung, Chlorideintrag, Frost-Tau-Wechsel & "Betonkrebs" (AKR)' },
    { id: 'unvertraeglichkeiten', label: 'Unverträglichkeiten (Neu)', icon: AlertTriangle, desc: 'Gipstreiben, Kontakkorrosion, Fließregel-Verletzungen, Gerbstoffe & Weichmacher' },
    { id: 'tief_ingenieurbau', label: 'Tief- & Ingenieurbau', icon: Wrench, desc: 'Schäden an Brücken, Tunneln, Baugruben, Stützwänden & Tiefgründungen' },
    { id: 'analysator', label: 'Szenarien-Analysator', icon: Lightbulb, desc: 'Interaktiver Bau-Szenarien-Analysator mit Haftungsberechnung' },
  ] as const;

  // Practical scenarios for the Interactive Checker
  const scenarios = [
    {
      id: 'feuchter_keller',
      title: 'Feuchtigkeit im Keller (2 Jahre alter Neubau)',
      category: 'Feuchtigkeit & Schimmel',
      description: 'An der erdberührten Kellerwand eines jungen Wohngebäudes treten nasse Flecken und abplatzender Putz auf. Ein Gutachten zeigt: Es wurde keine ausreichende Abdichtung nach DIN 18533 eingeplant und der Lastfall "Drückendes Wasser" fälschlicherweise ignoriert.',
      status: 'Mangel mit folgendem Sachschaden (Baumangel & Bauschaden)',
      responsibility: 'Planungsfehler: Primär haftet der Planer für fehlerhafte Grundlagenermittlung; bei erkennbaren Planungsfehlern besteht ggf. eine Mithaftung des Unternehmers (Verletzung der Prüf- und Hinweispflicht), Quote im Einzelfall.',
      insurance: 'Planer-Berufshaftpflichtversicherung für den Architekten. Das ausführende Bauunternehmen haftet im Rahmen des Werkvertragsrechts für die Nachbesserung (dies ist vertragliche Hauptleistung und wird NICHT von der Handwerkerhaftpflicht gedeckt).',
      remedy: 'Nachträgliche Schleierinjektion (WTA 4-6) oder Außenaufgrabung zur Erneuerung der Vertikalabdichtung. Kosten: massiv.'
    },
    {
      id: 'rissiger_putz',
      title: 'Putzrisse über Porenbetonmauerwerk',
      category: 'Risse im Mauerwerk/Putz',
      description: 'Im Außenputz zeichnen sich stufenförmige Risse entlang der Blocksteinfugen ab. Ursache ist das Schwindverhalten des sehr feucht gelieferten Porenbetons und das Weglassen eines dringend nötigen Armierungsgewebes im Außenputz.',
      status: 'Baumangel (Verstoß gegen anerkannte Regeln der Technik / Herstellerspezifikationen)',
      responsibility: 'Ausführungsfehler des Gipserbetriebs (Verputzen auf unzureichend ausgetrocknetem Untergrund ohne Gewebeeinlage) und Bauleitungsfehler des Architekten (ungenügende Detailüberwachung).',
      insurance: 'Selbstzahler oder Gewährleistungsbürgschaft. Die Unternehmer-Haftpflicht deckt den Mangel selbst nicht ab. Falls der Riss zu Feuchteschäden führt, träfe das die Haftpflicht für den Folgeschaden.',
      remedy: 'Rissüberbrückendes Gewebe spachteln, elastische Rissarmierung und Neuaufbau der Endbeschichtung.'
    },
    {
      id: 'frost_balkon',
      title: 'Frostabplatzungen an einer Balkonkante',
      category: 'Korrosion & Betonabplatzungen',
      description: 'An einer freien Balkonkante bröckelt Beton ab; brauner Rost schimmert durch. Der Beton besaß einen w/z-Wert von 0,65 (statt höchstens 0,55 mit Luftporen bzw. 0,50 ohne Luftporen für XF3 – hohe Wassersättigung ohne Taumittel – nach DIN 1045-2, Tab. F.2.1). Ohne Tropfkante drang dauerhaft Wasser ein.',
      status: 'Schwerwiegender Mangel mit akuter Beeinträchtigung der Dauerhaftigkeit (Rostsprengung)',
      responsibility: 'Ausführungsfehler des Betonwerks (falsche Betongüte geliefert) und des Unternehmers (falsch verbaut + Tropfprofil weggelassen).',
      insurance: 'Eigensanierung durch das Bauunternehmen während der Verjährungsfrist (5 Jahre nach BGB).',
      remedy: 'Mechanische Betonreprofilierung, Sandstrahlen der Bewehrungseisen, Korrosionsschutzbeschichtung und Ausbildung einer wirksamen Tropfkante.'
    },
    {
      id: 'estrich_abriss',
      title: 'Dehnfugenabriss im Industrie-Fließestrich',
      category: 'Risse & Bewegungsfugen',
      description: 'In einer Logistikhalle bricht der Fließestrich an den Feldgrenzen aus. Es wurde versäumt, die nach Estrichart, Beheizung und Feldgeometrie erforderlichen Bewegungsfugen anzuordnen … Sanierung: Scheinfugen nachschneiden, Wildrisse mit Epoxidharz und Wellenverbindern (Estrichklammern) verharzen. Schwere Gabelstapler tragen zusätzlich hohe dynamische Horizontallasten ein.',
      status: 'Planungsmangel (Klassischer Koordinationsfehler im Fugenplan)',
      responsibility: 'Planer für fehlenden Fugenplan und Estrichleger, falls dieser nicht schriftlich Bedenken angemeldet hat (Prüf- und Hinweispflicht verfehlt).',
      insurance: 'Berufshaftpflicht des planenden Ingenieurbüros (Tragwerksplanung/Objektplanung).',
      remedy: 'Nachträgliches Einschneiden von Scheinfugen, Verharzen der Wildrisse mit Epoxidharz und gewellten Wellenverbindern (Estrichklammern).'
    },
    {
      id: 'gips_estrich_ausblühung',
      title: 'Gipstreiben durch Calciumsulfat auf nasser Betondecke',
      category: 'Materialunverträglichkeiten',
      description: 'In einem Bad wurde gipshaltiger Estrich / Spachtelmasse direkt auf eine junge, feuchte Betondecke ohne trennende Grundierung aufgebracht. Durch langanhaltende Restfeuchte bildeten sich massive, treibende Minerale (Ettringit- und Thaumasitbildung) mit pustelartigen Wölbungen und Gefügezerfall.',
      status: 'Ausführungsmangel (Schwere Missachtung baustofflicher Unverträglichkeiten)',
      responsibility: 'Bodenleger/Estrichleger wegen fehlender Feuchtigkeitsmessung (CM-Messung) der Betondecke und mangelhafter Untergrundvorbereitung (Sperrgrundierung weggelassen).',
      insurance: 'Betriebshaftpflicht des ausführenden Estrichlegerbetriebs greift für Folgeschäden an den Fliesen; die reine Mängelbeseitigung am Estrich ist Selbstzahlerleistung.',
      remedy: 'Vollständiger Abtrag des befallenen Sulfatestrichs, Abschleifen und intensives Trocknen des Betonuntergrundes, Aufbringen einer zementbeständigen Epoxidharz-Grundierung mit Quarzsand-Abstreuung, Neuaufbau mit zementärer Ausgleichsmasse.'
    },
    {
      id: 'regenrinne_kontaktkorrosion',
      title: 'Lochfraß durch Kontaktkorrosion im Flachdach',
      category: 'Materialunverträglichkeiten',
      description: 'Es wurde eine neue Kupferdachrinne installiert. Unmittelbar oberhalb befinden sich verzinkte Stahlblech-Abdeckungen. Bei Regen fließen kupferionenhaltige Wassertropfen auf das Basismetall (Zink). Innerhalb eines Jahres kam es zu rasantem Lochfraß (Bimetallkorrosion/Fließregelverletzung).',
      status: 'Planungs- und Ausführungsfehler (Verstoß gegen DIN 18339 / Fachregeln des Klempnerhandwerks)',
      responsibility: 'Klempner bzw. Dachdecker (gemeinschaftliche Haftung mit dem Planer für fehlende Werkstattplanung und bauphysikalische Koordinationsfehler).',
      insurance: 'Unternehmer-Haftpflicht für Sachschäden (Durchfeuchtung infolge der zerstörten Rinne). Der Rinnenaustausch selbst muss die Firma eigenständig finanzieren.',
      remedy: 'Austausch des unedleren Bauteils, strikte Trennung der Metalle durch Kunststoffzwischenlagen oder Verwendung von Edelstahl/Aluminium ohne Werkstoffübergänge.'
    },
    {
      id: 'bruecke_chloridschaden',
      title: 'Pfeiler- und Lagerfugenkorrosion einer Autobahnbrücke (XF4/XD3)',
      category: 'Tief- & Ingenieurbau',
      description: 'Bei einer Brückenprüfung nach DIN 1076 werden an Pfeilerköpfen gravierende Betonabplatzungen und völlig durchgerostete Spannglieder entdeckt. Die Brückenentwässerung war verstopft, wodurch chloridbelastetes Tausalzwasser jahrzehntelang ungehindert auf den Beton und die Lagerkonstruktion einwirken konnte.',
      status: 'Kritischer Bauschaden – Standsicherheit umgehend durch Fachplaner beurteilen lassen',
      responsibility: 'Wartungs- und Unterhaltspflichtverletzung des Baulastträgers (Kommune oder Autobahngesellschaft) sowie Ausführungsfehler bei der Fugenabdichtung.',
      insurance: 'Keine klassische private Versicherungsdeckung. Die Sanierung erfolgt vollumfänglich aus öffentlichen Haushaltsmitteln des Baulastträgers.',
      remedy: 'Sofortige Teilsperrung oder Tonnagebeschränkung. Hydrodynamischer Betonabtrag (HDW), Reprofilierung mit Spritzbeton und Erneuerung der Fahrbahnübergänge.'
    },
    {
      id: 'baugrube_ankerversagen',
      title: 'Versagen einer Ankerlage im Spundwandverbau einer tiefen Baugrube',
      category: 'Tief- & Ingenieurbau',
      description: 'Während des Aushubs einer tiefen innerstädtischen Baugrube verformt sich der Spundwandkopf unzulässig um 15 cm. Ein Verpressanker im bindigen Tonboden ist aus dem Verpresskörper gezogen worden, da die geotechnische Baugrundanalyse unvollständig war und die freie Ankerstrecke falsch ausgelegt wurde.',
      status: 'Planungsmangel mit katastrophalem Havarierisiko für Nachbarbebauungen',
      responsibility: 'Planungsfehler des Geotechnikers/Fachplaners sowie mangelhafte Qualitätsüberwachung der Ankerprüfung (Abnahmeprüfung nach DIN EN 1537 nicht korrekt dokumentiert).',
      insurance: 'Berufshaftpflichtversicherung des planenden Ingenieurbüros bzw. des Fachgeologen.',
      remedy: 'Sofortiger Aushubstopp und Rückverfüllung/Böschungsankopplung. Einbringen von Notsteifen oder einer zusätzlichen Ankerlage unter engmaschigem geodätischem Monitoring.'
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <FileWarning className="text-shiraz animate-pulse" /> Typische Bauschäden & Schadensbilder
          </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Detailliertes Fachwissen zu physikalisch-chemischen Mechanismen, Diagnostik und Schadensgruppen am Bau.
          </p>
        </div>

        {/* Dynamic Multi-Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 border-b border-home-grau/30 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id);
                }}
                className={`py-3 px-2 rounded-xl border text-center flex flex-col items-center justify-between gap-1.5 transition-all ${
                  isActive 
                    ? 'bg-shiraz/5 border-shiraz text-shiraz shadow-sm ring-1 ring-shiraz/20' 
                    : 'bg-slate-50/50 border-home-grau/30 hover:bg-slate-50 hover:border-home-grau/30 text-slate-700'
                }`}
                title={tab.desc}
              >
                <Icon size={18} className={isActive ? 'text-shiraz animate-bounce' : 'text-slate-500'} />
                <span className="font-bold text-xs md:text-sm tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="mt-2 text-sm text-text-main">

          {/* Tab 1: Feuchtigkeit & Schimmel */}
          {activeSubTab === 'feuchtigkeit' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <Droplets opacity={0.8} /> Feuchtigkeitseintritt & Mechanismen
                  </h3>
                  <div className="space-y-2.5 text-sm leading-relaxed text-slate-800">
                    <div>
                      <strong className="text-slate-950">1. Aufsteigende Feuchtigkeit & Kapillartransport:</strong>
                      <p className="mt-0.5 text-slate-700">
                        Mangelhafte oder fehlende horizontale Querschnittsabdichtung (DIN 18533). Durch das Kapillarporensystem saugt poröses Mauerwerk Grund- und Schichtenwasser entgegen der Schwerkraft nach oben:
                      </p>
                      <div className="bg-white p-2 rounded-lg border border-home-grau/25 text-xs my-1.5 font-mono">
                        <span className="text-slate-600 block text-[11px] font-sans mb-0.5">Kapillare Steighöhe nach Jurin:</span>
                        <BlockMath math="h = \frac{2 \cdot \sigma \cdot \cos\theta}{\rho \cdot g \cdot r}" />
                        <span className="text-[10px] text-slate-500 font-sans block mt-1">
                          Mit Oberflächenspannung <InlineMath math="\sigma" />, Kontaktwinkel <InlineMath math="\theta" />, Dichte <InlineMath math="\rho" />, Erdbeschleunigung <InlineMath math="g" /> und Kapillarradius <InlineMath math="r" />. Je feiner die Poren (z.B. Ziegel- und Mörtelporen), desto höher die theoretische kapillare Steighöhe (mehrere Meter); in der Praxis begrenzt die Verdunstung sie meist auf 0,5–1,5 m über Gelände.
                        </span>
                      </div>
                    </div>
                    <div>
                      <strong className="text-slate-950">2. Querdurchfeuchtung & hydrostatischer Druck:</strong>
                      <p className="mt-0.5 text-slate-700">
                        Versagen der vertikalen Bauwerksabdichtung (DIN 18533: W2.1-E mäßige Einwirkung ≤ 3 m Eintauchtiefe, W2.2-E hohe Einwirkung &gt; 3 m; W1-E = Bodenfeuchte und nicht drückendes Wasser). Bei anstehendem drückendem Wasser wirkt hydrostatischer Druck <InlineMath math="p = \rho \cdot g \cdot h" />, der ungesicherte Fugen, Kiesnester und Risse penetriert.
                      </p>
                    </div>
                    <div>
                      <strong className="text-slate-950">3. Hygroskopische Feuchte & Salzsprengung:</strong>
                      <p className="mt-0.5 text-slate-700">
                        Mit dem Wasser transportierte bauschädliche Salze (Chloride, Nitrate, Sulfate) reichern sich an der Verdunstungszone an. Bei Kristallisation (z.B. Mirabilit <InlineMath math="\text{Na}_2\text{SO}_4 \cdot 10\,\text{H}_2\text{O}" />) entsteht ein Kristallisationsdruck <InlineMath math="\sigma_k > 10\,\text{MPa}" />, der Putz und Ziegel sprengt.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <AlertTriangle size={18} /> Tauwasser, Kältebrücken & Schimmel
                  </h3>
                  <div className="space-y-2.5 text-sm leading-relaxed text-slate-800">
                    <div>
                      <strong className="text-slate-950">Temperaturfaktor <InlineMath math="f_{Rsi}" /> (DIN 4108-2):</strong>
                      <p className="mt-0.5 text-slate-700">
                        Geometrische oder konstruktive Wärmebrücken senken die raumseitige Wandoberflächentemperatur <InlineMath math="\theta_{si}" /> ab. Der Mindestwärmeschutz verlangt zwingend:
                      </p>
                      <div className="bg-white p-2 rounded-lg border border-home-grau/25 text-xs my-1.5 font-mono">
                        <BlockMath math="f_{Rsi} = \frac{\theta_{si} - \theta_e}{\theta_i - \theta_e} \ge 0{,}70" />
                        <span className="text-[10px] text-slate-500 font-sans block mt-1">
                          Bei Normrandbedingungen (<InlineMath math="\theta_i = 20\,^{\circ}\text{C}" />, <InlineMath math="\theta_e = -5\,^{\circ}\text{C}" />) muss <InlineMath math="\theta_{si} \ge 12{,}6\,^{\circ}\text{C}" /> betragen, um das 80%-Schimmelkriterium zu verhindern.
                        </span>
                      </div>
                    </div>
                    <div>
                      <strong className="text-slate-950">Dampfdiffusion nach Glaser (DIN 4108-3):</strong>
                      <p className="mt-0.5 text-slate-700">
                        Wasserdampfteildruck <InlineMath math="p_v" /> vs. Sättigungsdampfdruck <InlineMath math="p_{sat}" />. Trifft der Teildruck auf die Sättigungslinie im Bauteilinneren, fällt schädliches Tauwasser aus (<InlineMath math="m_w" />). Nach DIN 4108-3 darf die Tauwassermasse maximal <InlineMath math="1{,}0\,\text{kg/m}^2" /> betragen und muss in der sommerlichen Verdunstungsperiode vollständig austrocknen.
                      </p>
                    </div>
                    <div className="bg-rose-50/50 p-3 rounded-lg border border-shiraz/20 font-medium text-slate-900 text-xs leading-relaxed">
                      ⚠️ <strong>Schimmelpilzkriterium:</strong> Schimmelpilzmyzelien keimen bereits ab einer relativen Grenzflächenfeuchte von <InlineMath math="\varphi_{si} \ge 80\,\%" /> (Wasseraktivität <InlineMath math="a_w \ge 0{,}80" />) – lange vor sichtbarem Kondensatausfall!
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-shiraz"></span> Messtechnik, Sensorik & Schadensdiagnostik in der Praxis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30">
                    <strong className="text-shiraz block mb-1">Darr-Methode (Gravimetrie nach DIN EN ISO 12570)</strong>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      Zerstörendes, justitiables Referenzverfahren: Materialprobe entnehmen, gravimetrisch wägen (<InlineMath math="m_{\text{feucht}}" />), bei 105 °C dörren bis zur Gewichtskonstanz (<InlineMath math="m_{\text{trocken}}" />). Feuchtegehalt <InlineMath math="u = (m_f - m_t)/m_t \cdot 100\,\%" />.
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30">
                    <strong className="text-shiraz block mb-1">CM-Verfahren (Calciumcarbid-Methode)</strong>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      Chemische Umsetzung von Porenwasser mit Calciumcarbid: <InlineMath math="\text{CaC}_2 + 2\,\text{H}_2\text{O} \rightarrow \text{Ca(OH)}_2 + \text{C}_2\text{H}_2 \uparrow" />. Der Manometerdruck des Acetylengases bestimmt die Verlegereife von Estrichen (z.B. Zementestrich ≤ 2,0 CM-%).
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30">
                    <strong className="text-shiraz block mb-1">Dielektrische / Mikrowellen-Sensorik</strong>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      Zerstörungsfreie Hochfrequenz-Messung der Permittivität (<InlineMath math="\varepsilon_r" /> von Wasser ≈ 80 vs. Baustoffmatrix ≈ 3–5). Ermöglicht flächige Feuchtekartierungen in Schichten bis 30 cm Tiefe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Risse & Verformungen */}
          {activeSubTab === 'risse' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
                  <Activity className="text-shiraz" /> Ursachen von Risserscheinungen & Bruchmechanik
                </h3>
                <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                  Baustoffe verändern ihr Volumen durch Hydratationswärme, Feuchtigkeitsabgabe, Temperatur und Lastspannungen. Wird diese freie Verformung behindert (Zwangsspannungen), entstehen Zugspannungen <InlineMath math="\sigma_{ct}" />. Überschreiten diese die Zugfestigkeit <InlineMath math="f_{ct}" />, reißt das Bauteil.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1">
                    <span className="font-bold text-shiraz uppercase text-xs tracking-wide">1. Schwinden (DIN EN 1992-1-1)</span>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      Gesamtschwinddehnung <InlineMath math="\varepsilon_{cs} = \varepsilon_{cd} + \varepsilon_{ca}" />: Austrocknungsschwinden (<InlineMath math="\varepsilon_{cd}" />) und autogenes Schwinden (<InlineMath math="\varepsilon_{ca}" />) im jungen Beton. Zwangskraft <InlineMath math="N_{zw} = \varepsilon_{cs} \cdot E_c \cdot A_c" /> erzeugt Trennrisse.
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1">
                    <span className="font-bold text-shiraz uppercase text-xs tracking-wide">2. Quellen & Treibreaktionen</span>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      Volumenzunahme durch chemische Kristallisation (z.B. Ettringit- oder Thaumasittreiben, Freikalklöschen). Sprengdrücke überwinden die Matrixfestigkeit und führen zu netzartiger Zerrüttung.
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1">
                    <span className="font-bold text-shiraz uppercase text-xs tracking-wide">3. Baugrundsetzung</span>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      Differenzielle Setzungen <InlineMath math="\Delta s" /> erzeugen Schub- und Biegemomente. Typisches Schadensmerkmal: 45°-Schrägrisse im Mauerwerk an Fensteröffnungen und Pfeilern.
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1">
                    <span className="font-bold text-shiraz uppercase text-xs tracking-wide">4. Temperaturzwang</span>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      Dehnung <InlineMath math="\Delta L = \alpha_T \cdot L \cdot \Delta T" />. Bei behinderter Dehnung entstehen thermische Zwangspannungen <InlineMath math="\sigma = E \cdot \alpha_T \cdot \Delta T" />. Typisch bei Massenbeton und langen Brüstungen.
                    </p>
                  </div>
                </div>

                {/* Lineare Elastische Bruchmechanik (LEBM) Box */}
                <div className="mt-4 bg-white p-4 rounded-xl border border-home-grau/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs text-slate-950 flex items-center gap-1.5 font-bold">
                      🔬 Bruchmechanische Rissfortschrittsbedingung (Griffith / Irwin)
                    </strong>
                    <span className="text-[11px] font-mono text-shiraz bg-rose-50 px-2 py-0.5 rounded border border-shiraz/20 font-semibold">
                      K_I ≥ K_Ic
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bei vorhandenen Mikrorissen oder Kerben (wie beim Einsturz der Silver Bridge) entscheidet die Spannungsintensität <InlineMath math="K_I" /> an der Rissspitze über Stabilität oder katastrophalen Sprödbruch:
                  </p>
                  <div className="bg-[#FCFAF7] border border-home-grau/20 p-2.5 rounded-lg text-xs font-mono text-center">
                    <BlockMath math="K_I = Y \cdot \sigma \cdot \sqrt{\pi \cdot a} \quad \ge \quad K_{Ic} \quad \Longrightarrow \quad \text{Instabiler Gewaltbruch ohne plastische Vorwarnung}" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                    <div><strong className="text-slate-800">Spannung <InlineMath math="\sigma" />:</strong> Nennspannung im Querschnitt.</div>
                    <div><strong className="text-slate-800">Risslänge <InlineMath math="a" />:</strong> Tiefe des Anrisses / Kerbe.</div>
                    <div><strong className="text-slate-800">Bruchzähigkeit <InlineMath math="K_{Ic}" />:</strong> Werkstoffkennwert (Temperaturabhängig!).</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Einteilung nach Rissbreite (praxisübliche Orientierungswerte, vgl. DBV-Merkblatt Begrenzung der Rissbildung / TR Instandhaltung des DIBt)</h4>
                  <table className="w-full text-sm text-slate-800 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-home-grau/30 text-left">
                        <th className="p-2">Rissbreite <InlineMath math="w_r" /></th>
                        <th className="p-2">Bedeutung</th>
                        <th className="p-2">Maßnahmenrelevanz</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-home-grau/30">
                        <td className="p-2 font-mono text-slate-700">&lt; 0,1 mm</td>
                        <td className="p-2">Haarrisse</td>
                        <td className="p-2">Meist unkritisch / kosmetisch. Wasserunwirksam im Beton.</td>
                      </tr>
                      <tr className="border-b border-home-grau/30">
                        <td className="p-2 font-mono text-shiraz">&gt;= 0,1 - 0,3 mm</td>
                        <td className="p-2">Feine Risse</td>
                        <td className="p-2">Im Außenbereich wegen Frostgefahr und Bewehrungskorrosion zu beobachten.</td>
                      </tr>
                      <tr className="border-b border-home-grau/30">
                        <td className="p-2 font-mono text-shiraz font-semibold">0,3 - 1,0 mm</td>
                        <td className="p-2">Konstruktionsrisse</td>
                        <td className="p-2">Statisch-konstruktive Ursachenprüfung zwingend erforderlich. Abdichtung gefährdet.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-shiraz font-bold">&gt; 1,0 mm</td>
                        <td className="p-2 font-bold">Gefügerisse / Klaffende Risse</td>
                        <td className="p-2 text-shiraz font-bold">Ursache und Tragwirkung umgehend durch Fachplaner klären (keine automatische Gefahr im Verzug).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Überwachung & Sanierungsbündnisse</h4>
                  <div className="space-y-3 text-sm text-slate-800 leading-relaxed">
                    <p>
                      <strong>Rissgipsmarke (Klassiker):</strong> Über dem Riss wird eine dünne Gipsplakette aufgetragen. Zerreißt der Gips, ist der Riss dynamisch aktiv ("lebendig"). Bleibt er ganz, ist die Bewegung abgeklungen ("tot").
                    </p>
                    <p>
                      <strong>Rissbreitenlineal:</strong> Transparente Karte mit Strichstärken zum präzisen Abgleich der Oberflächenbreite.
                    </p>
                    <div className="p-3 bg-white rounded border border-home-grau/30 text-sm">
                      <strong>💡 Sanierungsmethodik bei ruhendem Riss:</strong> Kraftschlüssiges Verbinden ruhender, trockener oder feuchter Risse mit EP (Tränkung/Injektion); begrenzt dehnfähiges Verbinden oder Abdichten wasserführender Risse mit PUR bzw. Acrylatgel; Zementleim/-suspension (ZL/ZS) bei breiteren Rissen (TR Instandhaltung / DIN EN 1504-5).
                    </div>
                  </div>
                </div>
              </div>

              {/* TECHNOLOGICAL REHABILITATION: RISSVERPRESSUNG & CARBONLAMELLEN */}
              <div className="bg-white p-5 rounded-2xl border border-home-grau/30 space-y-6">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 border-b border-home-grau/20 pb-2">
                  🛠️ Bauphysikalische Ertüchtigung: Rissverpressung &amp; Carbonlamellen (CFK)
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Teil 1: Rissinjektion / Rissverpressung */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/25 space-y-3">
                      <h4 className="font-bold text-sm text-shiraz flex items-center gap-2">
                        💧 1. Rissinjektion &amp; Rissverpressung (DIN EN 1504-5)
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Die Rissinjektion hat zum Ziel, die Barrierewirkung des Betons gegenüber Schadstoffen wiederherzustellen (Füllen/Abdichten) oder das Bauteil wieder kraftschlüssig zu verbinden (Zusammenhalt).
                      </p>

                      {/* Spaltströmung (ebener Spalt) */}
                      <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs my-2">
                        <strong className="block text-slate-900 mb-1">Durchfluss im Riss (laminare Spaltströmung):</strong>
                        <p className="text-[11px] text-slate-500 leading-tight mb-2">
                          Der Volumenstrom <InlineMath math="Q" /> des Injektionsstoffs im Risskanal hängt stark von der Rissbreite <InlineMath math="w" />, der Risslänge <InlineMath math="b" />, der dynamischen Viskosität <InlineMath math="\eta" />, dem Druckunterschied <InlineMath math="\Delta p" /> und dem Fließweg <InlineMath math="L" /> ab:
                        </p>
                        <BlockMath math="Q = \frac{w^3 \cdot b \cdot \Delta p}{12 \cdot \eta \cdot L}" />
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Das bedeutet: Bei einer Halbierung der Rissbreite <InlineMath math="w" /> sinkt der Zufluss bei gleichem Druck auf <InlineMath math="1/8" />. Feine Risse benötigen daher extrem niedrigviskose Epoxidharze.
                        </span>
                      </div>

                      {/* Tabelle Wirkungsarten */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-white border-b border-home-grau/30 text-slate-700 font-bold">
                              <th className="p-1.5">Füllstoff (Kürzel)</th>
                              <th className="p-1.5">Eigenschaft</th>
                              <th className="p-1.5">Zweck / Anwendung</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            <tr>
                              <td className="p-1.5 font-bold font-mono text-shiraz">Epoxidharz (EP)</td>
                              <td className="p-1.5 text-slate-600">Sehr hohe Zug-/Druckfestigkeit, starr</td>
                              <td className="p-1.5">Kraftschlüssiges Verbinden ruhender, trockener oder feuchter Risse.</td>
                            </tr>
                            <tr>
                              <td className="p-1.5 font-bold font-mono text-shiraz">Polyurethan (PUR)</td>
                              <td className="p-1.5 text-slate-600">Elastisch, schäumt bei Wasserkontakt</td>
                              <td className="p-1.5">Begrenzt dehnfähiges Verbinden bzw. Abdichten wasserführender Risse.</td>
                            </tr>
                            <tr>
                              <td className="p-1.5 font-bold font-mono text-shiraz">Zementsuspens. (ZS)</td>
                              <td className="p-1.5 text-slate-600">Mineralisch, starr, füllstark</td>
                              <td className="p-1.5">Füllen breiter Risse (&gt; 0,8 mm) &amp; Hohlräume.</td>
                            </tr>
                            <tr>
                              <td className="p-1.5 font-bold font-mono text-shiraz">Acrylatgel (GEL)</td>
                              <td className="p-1.5 text-slate-600">Extrem dünnflüssig, quellfähig</td>
                              <td className="p-1.5">Schleierinjektion &amp; Hintergelfüllung.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Ausführungsschritte */}
                      <div className="border-t border-home-grau/20 pt-2 mt-2">
                        <strong className="text-xs text-slate-800 block mb-1">⚙️ Verfahrensschritte der Rissinjektion (Hochdruck)</strong>
                        <ol className="list-decimal pl-4 text-[11px] text-slate-600 space-y-1">
                          <li><strong>Reinigung &amp; Vorbereitung:</strong> Rissflanken mechanisch säubern, Rissoberfläche staubfrei abblasen.</li>
                          <li><strong>Packerbohrung:</strong> Bohren von Bohrkanälen versetzt im 45°-Winkel zum Riss (Abstand ca. halbe Bauteildicke), so dass der Riss mittig geschnitten wird.</li>
                          <li><strong>Setzen der Packer:</strong> Einschrauben von Metall-Hochdruckpackern (Injektionsventilen).</li>
                          <li><strong>Verdämmung:</strong> Rissspalt an der Oberfläche mit zementärem oder Harz-Spachtel versiegeln, damit das Injektionsgut nicht unkontrolliert austritt.</li>
                          <li><strong>Injektion:</strong> Einspritzen von unten nach oben (bzw. von einer Seite zur anderen), bis der Füllstoff aus dem nächsten, noch offenen Packer quillt. Nachdruck-Phase zur Sättigung halten.</li>
                          <li><strong>Nachbereitung:</strong> Nach Aushärtung Packer abschlagen, Bohrlöcher mineralisch reprofilieren.</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Teil 2: Ertüchtigung mittels Carbonlamellen */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/25 space-y-3">
                      <h4 className="font-bold text-sm text-shiraz flex items-center gap-2">
                        📐 2. Tragwerksverstärkung mit CFK-Carbonlamellen
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Wenn die Biege- oder Querkraftbeanspruchung eines Bauteils nachträglich steigt (z. B. durch Umnutzung, höhere Verkehrslasten oder korrosionsbedingter Querschnittsschwächung), können extrem zugfeste Kohlenstofffaser-Laminate (Carbonlamellen) aufgeklebt werden.
                      </p>

                      {/* Verbundnachweis Formel */}
                      <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs my-2">
                        <strong className="block text-slate-900 mb-1">Verbundnachweis am Lamellenende (Endverankerung):</strong>
                        <p className="text-[11px] text-slate-500 leading-tight mb-2">
                          Um ein schlagartiges Abplatzen der Lamellenenden vor dem Erreichen der CFK-Zugfestigkeit zu verhindern, ist die Verbundkraft am Lamellenende zu begrenzen. Die maßgebenden Gleichungen (Endverankerung, Zwischenrisselemente) enthält die DAfStb-Richtlinie „Verstärken von Betonbauteilen mit geklebter Bewehrung“ (2012); vereinfachte Grundform:
                        </p>
                        <BlockMath math="\tau_{bd} \propto k_b \cdot \sqrt{f_{cm} \cdot f_{ctm}}" />
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Hierbei ist <InlineMath math="k_b" /> ein Beiwert zur Lamellenbreite, <InlineMath math="f_{ck}" /> die Zylinderdruckfestigkeit des Betons und <InlineMath math="f_{ctm}" /> die mittlere Betonzugfestigkeit, welche die eigentliche Schwachstelle darstellt.
                        </span>
                      </div>

                      {/* Technische Merkmale von Carbonfaser CFK */}
                      <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs text-slate-700 space-y-2">
                        <strong className="text-xs text-slate-950 block">Sehr gute Materialeigenschaften (Vorteile):</strong>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                          <div>
                            <span className="text-slate-400 block">Zug-E-Modul:</span>
                            <strong className="text-slate-800 font-mono">165.000 - 210.000 N/mm²</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Zugfestigkeit:</span>
                            <strong className="text-slate-800 font-mono">&gt; 2.500 - 3.000 N/mm²</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Eigengewicht:</span>
                            <strong className="text-slate-800">Extrem gering (~1,6 g/cm³)</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Korrosion:</span>
                            <strong className="text-emerald-700">100% korrosionsbeständig</strong>
                          </div>
                        </div>
                      </div>

                      {/* Einbau & Konstruktive Regeln */}
                      <div className="border-t border-home-grau/20 pt-2 mt-2">
                        <strong className="text-xs text-slate-800 block mb-1">⚙️ Arbeitsverfahren zur CFK-Lamellenverstärkung</strong>
                        <ol className="list-decimal pl-4 text-[11px] text-slate-600 space-y-1">
                          <li><strong>Untergrundprüfung (Zwingend):</strong> Prüfung der Beton-Abreißfestigkeit (mind. <InlineMath math="1{,}5 \text{ N/mm}^2" />). Zu schwacher Beton reißt flächig ab!</li>
                          <li><strong>Vorbereitung (Kugelstrahlen/Schleifen):</strong> Die Betonoberfläche wird gefräst, kugelgestrahlt oder geschliffen, um die Zementhaut zu entfernen und Gesteinskörnungen freizulegen.</li>
                          <li><strong>Applikation Epoxidkleber:</strong> Auftrag eines thixotropen (pastösen) Epoxidharzklebstoffes auf den Beton und auf die Carbonlamelle (dachprofilartig aufgespachtelt, um Lufteinschlüsse zu vermeiden).</li>
                          <li><strong>Andrücken der Lamelle:</strong> Lamelle von Hand positionieren und mit einer Gummirolle gleichmäßig andrücken, bis der überschüssige Kleber an den Seiten gleichmäßig herausquillt.</li>
                          <li><strong>Sicherung &amp; Brandschutz:</strong> Bei Brandbeanspruchung Schutzverkleidungen (z.B. Brandschutzplatten) anbringen, da der Epoxidharzkleber ab ca. 55-80°C seine Festigkeit verliert (Glasübergangstemperatur).</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Didaktische Zusammenfassung */}
                <div className="p-3.5 bg-rose-50/40 border border-shiraz/20 rounded-xl text-xs text-slate-800 leading-relaxed space-y-1.5">
                  <span className="font-bold text-shiraz block">💡 Ingenieurtechnischer Vergleich: Rissinjektion vs. Klebearmierung</span>
                  <p>
                    Während die <strong>Rissverpressung</strong> die innere Integrität des Querschnitts und den Korrosionsschutz wiederherstellt, fungiert die <strong>Carbonfaserverstärkung</strong> als äußere mechanische Zuggurt-Ertüchtigung. Beide Verfahren ergänzen sich hervorragend bei der Althaus- und Infrastruktursanierung (z.B. Brückenpfeiler, Hallenbinder).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Bewehrungskorrosion & Betonschäden */}
          {activeSubTab === 'korrosion' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Carbonatisierung */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    🛡️ Karbonatisierung & Passivierungsverlust
                  </h3>
                  <div className="space-y-2.5 text-sm text-slate-800 leading-relaxed">
                    <p>
                      Stahl im unbeschädigten Beton ist durch das hochalkalische Porenwasser (<InlineMath math="\text{pH} \ge 12{,}6" /> durch gelöstes Calciumhydroxid <InlineMath math="\text{Ca(OH)}_2" />) thermodynamisch passiviert. Es bildet sich eine nur wenige Nanometer dicke Passivschicht aus Eisenoxiden bzw. -hydroxiden (u. a. Fe₃O₄ und <InlineMath math="\gamma\text{-Fe}_2\text{O}_3" />).
                    </p>
                    <p>
                      <strong>Karbonatisierungsfront &amp; Wurzel-t-Gesetz:</strong> Diffundierendes atmosphärisches <InlineMath math="\text{CO}_2" /> neutralisiert das Alkali:
                    </p>
                    <div className="bg-white border border-home-grau/25 p-2.5 rounded-lg text-xs leading-relaxed text-slate-800 text-center my-1.5 font-mono">
                      <BlockMath math="\text{Ca(OH)}_2 + \text{CO}_2 \longrightarrow \text{CaCO}_3 \downarrow + \text{H}_2\text{O} \quad (\text{pH sinkt auf } \le 8{,}5)" />
                    </div>
                    <div className="bg-[#FCFAF7] border border-home-grau/20 p-2.5 rounded-lg text-xs text-slate-700">
                      <span className="font-semibold block text-slate-900 mb-0.5">Fortschritt nach dem √t-Gesetz (aus dem Fick’schen Gesetz mit wandernder Reaktionsfront abgeleitet):</span>
                      <BlockMath math="x_c(t) = k_{\text{carb}} \cdot \sqrt{t}" />
                      <span className="text-[10px] text-slate-500 block">
                        Dabei ist <InlineMath math="k_{\text{carb}}" /> der Karbonatisierungsbeiwert (abhängig von w/z-Wert, Porosität und Umgebungsfeuchte 50–70% r.F.). Sobald <InlineMath math="x_c \ge c_{\text{nom}}" /> (Betondeckung), beginnt Muldenkorrosion.
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">
                      <strong>Rostexpansion:</strong> Die Eisenoxidhydrate (<InlineMath math="\text{Fe(OH)}_3, \text{FeOOH}" />) besitzen je nach Oxid/Hydroxid das 2- bis 6-fache Volumen des Ausgangsstahls. Der entstehende Sprengdruck übersteigt die Betonzugfestigkeit um ein Vielfaches und sprengt die Betondeckung ab.
                    </p>
                  </div>
                </div>

                {/* Lochfrasskorrosion durch Chloride */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    🧪 Chlorideintrag & Lochfraßkorrosion (Pitting)
                  </h3>
                  <div className="space-y-2.5 text-sm text-slate-800 leading-relaxed">
                    <p>
                      Ausgelöst durch de-icing Tausalze (<InlineMath math="\text{NaCl, CaCl}_2" />) an Brückenkappen, Parkdecks oder mariner Gischt (Expositionsklassen XD1–XD3 / XS1–XS3).
                    </p>
                    <p>
                      <strong>Katalytische Autokatalyse:</strong> Freie Chlorid-Ionen (<InlineMath math="\text{Cl}^-" />) wandern durch das Porenwasser und durchstoßen die Passivschicht lokal selbst bei <InlineMath math="\text{pH} > 12{,}5" />:
                    </p>
                    <div className="bg-white border border-home-grau/25 p-2.5 rounded-lg text-xs leading-relaxed text-slate-800 text-center my-1.5 font-mono">
                      <BlockMath math="\text{Fe} + 2\,\text{Cl}^- \longrightarrow \text{FeCl}_2 + 2\,e^- \quad \xrightarrow{+\text{H}_2\text{O}} \quad \text{Fe(OH)}_2 + 2\,\text{H}^+ + 2\,\text{Cl}^-" />
                    </div>
                    <div className="bg-rose-50/50 p-2.5 rounded-lg border border-shiraz/25 text-xs text-slate-800 leading-relaxed">
                      <strong>Korrosionsauslösender Chloridgehalt (Anhaltswert, kein Normwert):</strong>
                      <BlockMath math="c_{\text{krit}} \approx 0{,}5\,\% \text{ Cl}^- \text{ bezogen auf Zementmasse}" />
                      <span className="text-[10px] text-slate-600 block mt-0.5">
                        Weder EC2 noch DIN EN 206 nennen einen „kritischen Chloridgehalt“; DIN EN 206 / DIN 1045-2 begrenzen nur den Chloridgehalt bei der Herstellung (Stahlbeton Cl 0,40, Spannbeton Cl 0,20 M.-% bez. Zement). Im Bestand bewertet ein sachkundiger Planer im Einzelfall (Feuchte, Karbonatisierung, Potentialfeld). Für Spannstahl gibt es keinen gesicherten Grenzwert – Chloride an Spanngliedern sind immer kritisch.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spannungsrisskorrosion (SpRK) & AKR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SpRK */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    ⚡ Wasserstoffinduzierte Spannungsrisskorrosion (SpRK)
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed text-slate-800">
                    <p>
                      Gefürchtetster Schadensmechanismus im Spannbetonbau (wasserstoffinduziert, Chloride sind keine Voraussetzung; maßgebliche Ursache beim Teileinsturz der <strong>Carolabrücke Dresden</strong> 2024. Der Teileinsturz der Kongresshalle Berlin 1980 war dagegen Korrosion bei mangelhafter Verpressung, keine SpRK).
                    </p>
                    <p>
                      <strong>Voraussetzungen (Schadens-Trias):</strong>
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      <li><strong>Werkstoff:</strong> Höchstzugfester, spannungsempfindlicher Stahl (insb. vergütete Stähle wie Hennigsdorfer Spannstahl St 140/160 (DDR), Neptun N 40 und Sigma oval; gefährdete Stähle und Herstellzeiträume nach der Handlungsanweisung SpRK, BMVBS 2011).</li>
                      <li><strong>Mechanische Spannung:</strong> Hohe statische Vorspannung (<InlineMath math="\sigma \ge 0{,}6 \cdot f_{pk}" />).</li>
                      <li><strong>Elektrochemisches Milieu:</strong> Unvollständige Hüllrohrverpressung, Feuchtezutritt, Chloride und kathodische Wasserstoffentwicklung.</li>
                    </ul>
                    <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 font-mono text-center my-1 text-[11px]">
                      <BlockMath math="\text{H}^+ + e^- \longrightarrow \text{H}_{\text{ad}} \quad \longrightarrow \quad \text{H}_{\text{abs}} \text{ (Diffundiert ins Stahlgitter)}" />
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Atomarer Wasserstoff sammelt sich an Korngrenzen und Rissspitzen im Gitter, blockiert Versetzungen und senkt die Kohäsionsenergie drastisch ab &rarr; <strong>Makroskopischer Sprödbruch ohne jede Vorwarnung!</strong>
                    </p>
                  </div>
                </div>

                {/* AKR */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <span className="w-2.5 h-2.5 bg-shiraz rounded-full"></span> Alkali-Kieselsäure-Reaktion (AKR) - "Betonkrebs"
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed text-slate-800">
                    <p>
                      Chemischer Zerstörungsmechanismus in massiven, feuchtigkeitsbeanspruchten Außenbauteilen (Autobahndecken, Betonschwellen wie beim <strong>Eisenbahnunfall von Burgrain</strong>).
                    </p>
                    <p>
                      <strong>Reaktionsablauf:</strong> Alkalihydroxide (<InlineMath math="\text{Na}^+, \text{K}^+, \text{OH}^-" />) aus dem Zementstein lösen amorphe Kieselsäure (<InlineMath math="\text{SiO}_2" />) aus reaktiven Gesteinskörnungen (Flint, Opalsandstein):
                    </p>
                    <div className="bg-white p-2.5 rounded-lg border border-home-grau/20 font-mono text-center my-1 text-[11px]">
                      <BlockMath math="\equiv\!\text{Si-O-Si}\!\equiv \;+\; 2\,\text{OH}^- \longrightarrow 2\,(\equiv\!\text{Si-O}^-) + \text{H}_2\text{O}" />
                    </div>
                    <p className="text-slate-700">
                      Das entstehende Alkali-Silikat-Gel bindet hygroskopisch Wasser und expandiert massiv. Der innere Quelldruck übersteigt die Betonzugfestigkeit (<InlineMath math="p_{\text{quell}} > f_{ctm} \approx 3\text{--}5\,\text{MPa}" />), erzeugt netzartige Landkartenrisse und zerstört die Tragsicherheit.
                    </p>
                    <div className="bg-[#FCFAF7] p-2 rounded border border-home-grau/25 text-[11px] text-slate-600">
                      <strong>Prävention (DAfStb Alkali-Richtlinie):</strong> Verwendung von NA-Zementen (Low-Alkali, <InlineMath math="\text{Na}_2\text{O}_{\text{äq}} \le 0{,}60\,\%" />) und Eignungsprüfung der Gesteinskörnung (Klassen E I bis E III-S).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Unverträglichkeiten (Materialunverträglichkeiten) */}
          {activeSubTab === 'unvertraeglichkeiten' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl">
                <p className="text-sm text-shiraz font-semibold leading-relaxed">
                  <strong>Definition:</strong> Chemische oder elektrochemische Triebreaktionen und Korrosionserscheinungen, die entstehen, wenn verschiedene eigentlich gängige Baustoffe unüberlegt kombiniert werden und sich gegenseitig schädigen oder zerstören.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Gipstreiben / Ettringit */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-shiraz flex items-center gap-1.5 border-b border-home-grau/30 pb-1.5">
                      💥 Gipshaltige Stoffe in Zement/Beton (Sulfattreiben / Thaumasit)
                    </h3>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      Wird Gips (Calciumsulfat-Dihydrat <InlineMath math="\text{CaSO}_4 \cdot 2\,\text{H}_2\text{O}" />) feuchtem Zementmörtel, Beton oder mineralischem Putz ausgesetzt, läuft die gefürchtete mineralische Triebreaktion ab:
                    </p>
                    <div className="bg-white p-2.5 rounded border border-home-grau/25 text-xs font-mono">
                      <span className="font-bold text-slate-900 block text-[11px] mb-1">Sekundäre Ettringitbildung (Volumenzunahme ≈ +130 bis +168 %):</span>
                      <BlockMath math="\text{C}_3\text{A}\cdot\text{CaSO}_4\cdot 12\,\text{H}_2\text{O} + 2\,\text{Ca}^{2+} + 2\,\text{SO}_4^{2-} + 20\,\text{H}_2\text{O} \longrightarrow \text{C}_3\text{A}\cdot 3\,\text{CaSO}_4\cdot 32\,\text{H}_2\text{O}" />
                      <span className="text-[10px] text-slate-600 font-sans block mt-1">
                        Nadelförmige Ettringitkristalle (<InlineMath math="\text{AFt-Phase}" />) wachsen im erstarrten Zementsteingefüge und bauen Expansionsdrücke von &gt; 15 MPa auf. Bei tiefen Temperaturen (&lt; 10 °C) und Karbonatzutritt droht zudem <strong>Thaumasittreiben</strong>, das die C-S-H-Phasen komplett zerstört.
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs bg-rose-50/50 text-slate-900 p-2.5 rounded border border-shiraz/25 font-semibold">
                    📍 <strong>Praxis-Regel (Putz: DIN EN 13914-1 / DIN 18550-1; Sulfatangriff auf Beton: DIN EN 206 / DIN 1045-2, XA):</strong> Verwenden Sie niemals Elektrikergips als Schnellfixierer für Installationen im Außenbereich oder unter Zement-/Kalkzementputzen. Gips und Zement sind in Feuchtbereichen strikt unverträglich!
                  </div>
                </div>

                {/* 2. Kontaktkorrosion */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-shiraz flex items-center gap-1.5 border-b border-home-grau/30 pb-1.5">
                      🧫 Galvanische Kontaktkorrosion (DIN EN ISO 8044) & Fließregel
                    </h3>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      Kommen zwei Metalle mit unterschiedlichem Normalpotential (<InlineMath math="E^0" />) in Berührung und werden durch einen Feuchtefilm (Elektrolyt) verbunden, entsteht ein kurzgeschlossenes Lokalelement:
                    </p>
                    <div className="bg-white p-2.5 rounded border border-home-grau/25 text-xs">
                      <span className="font-semibold block text-slate-900 text-[11px] mb-1">Spannungsreihe im Bauwesen (Standardpotentiale gegen SHE):</span>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-700">
                        <div>Aluminium: <InlineMath math="E^0 = -1{,}66\,\text{V}" /></div>
                        <div>Zink: <InlineMath math="E^0 = -0{,}76\,\text{V}" /></div>
                        <div>Baustahl (Fe): <InlineMath math="E^0 = -0{,}44\,\text{V}" /></div>
                        <div>Kupfer: <InlineMath math="E^0 = +0{,}34\,\text{V}" /></div>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-600 leading-relaxed font-sans">
                        Zellspannung <InlineMath math="\Delta E = E_{\text{Kathode}} - E_{\text{Anode}} > 0{,}2\,\text{V}" /> gilt als grobe Orientierung für eine relevante Kontaktkorrosion des unedleren Partners (<InlineMath math="\text{Zn} \rightarrow \text{Zn}^{2+} + 2e^-" />). Maßgeblich sind die praktische Spannungsreihe im jeweiligen Elektrolyten und das Flächenverhältnis Kathode/Anode (kleine Anode an großer Kathode ist besonders ungünstig).
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-700 italic leading-relaxed">
                      <strong>Die Fließregel am Bau (Fachregeln des Klempnerhandwerks, ZVSHK; DIN 18339)::</strong> Regenwasser darf niemals von edleren Metallen (z.B. Kupfer-Dachrinnen) auf nachfolgende unedlere Bauteile (z.B. Titanzink-Verblechungen, verzinkte Geländer) ablaufen. Gelöste <InlineMath math="\text{Cu}^{2+}" />-Ionen zementieren auf der Zinkoberfläche und fressen binnen Monaten Löcher ins Blech.
                    </p>
                  </div>
                  <div className="mt-3 text-xs bg-white text-slate-800 p-2.5 rounded border border-home-grau/30 font-semibold">
                    📍 <strong>Praxis-Regel:</strong> Metalle elektrisch isolieren (EPDM-Zulagen, Kunststoffunterlegscheiben) oder Befestigungen durchgängig in Edelstahl A4 (V4A) ausführen.
                  </div>
                </div>

                {/* 3. Holzinhaltsstoffe */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-shiraz flex items-center gap-1.5 border-b border-home-grau/30 pb-1.5">
                      🪵 Holzinhaltsstoffe (Gerbsäuren / Tannine) im Holzbau
                    </h3>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      Eichen-, Edelkastanien-, Robinien- und Lärchenhölzer weisen hohe Gehalte an hydrolysierbaren Gallotanninen und Ellagitanninen auf (<InlineMath math="\text{pH} \approx 3{,}0\text{--}4{,}5" />).
                    </p>
                    <div className="bg-white p-2.5 rounded border border-home-grau/25 text-xs text-slate-700 space-y-1">
                      <p>
                        <strong>Chemische Reaktion:</strong> Gelöste Eisenionen (<InlineMath math="\text{Fe}^{2+}/\text{Fe}^{3+}" />) reagieren mit Phenolgruppen der Gerbstoffe zu tiefschwarzen Eisen(III)-Tannat-Komplexen (bekannt als Eisengallustinte).
                      </p>
                      <p>
                        <strong>Konstruktive Schäden:</strong> Neben bleibenden Schwarzverfärbungen der Fassade wird die Zinkschicht von Standard-Verzinkungen durch die Säure im Feuchtemilieu rasch abgebeizt, gefolgt von schwerem Querschnittsverlust der Nägel und Holzschrauben.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs bg-white text-slate-800 p-2.5 rounded border border-home-grau/30 font-semibold">
                    📍 <strong>Praxis-Regel (DIN EN 1995-1-1 / Eurocode 5):</strong> Für gerbsäurereiche Hölzer im Außenbereich (Nutzungsklasse 2 und 3) werden bei Feuchte Verbindungsmittel aus nichtrostendem Stahl (z. B. 1.4401/1.4571) empfohlen; die Korrosionsschutzanforderungen ergeben sich aus DIN EN 1995-1-1, Tab. 4.1, und den Zulassungen der Verbindungsmittel.
                  </div>
                </div>

                {/* 4. Weichmacher-Migration */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-shiraz flex items-center gap-1.5 border-b border-home-grau/30 pb-1.5">
                      🧪 Weichmacher-Migration (Kunststoff vs. Bitumen / EPS)
                    </h3>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      Phänomen des Stofftransports niedermolekularer Ester-Weichmacher (z.B. Phthalate wie DEHP/DINP) aus Weich-PVC in lipophile, unpolare Kontaktschichten wie Bitumenbahnen oder Polystyrol (EPS/XPS):
                    </p>
                    <div className="bg-white p-2.5 rounded border border-home-grau/25 text-xs text-slate-750 space-y-1">
                      <p>
                        <strong>Versprödung der Dichtungsbahn:</strong> Durch die Diffusion verarmt die PVC-P-Dachbahn an Weichmacher. Die Glasübergangstemperatur steigt, die Bahn schrumpft unter hoher Zugspannung und reißt bei Frostbelastung spröde auf.
                      </p>
                      <p>
                        <strong>Lösungseffekt:</strong> Im Gegenzug quillt und erweicht das Bitumen oder die Polystyroldämmung schmilzt an den Kontaktstellen ein.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs bg-white text-slate-800 p-2.5 rounded border border-home-grau/30 font-semibold">
                    📍 <strong>Praxis-Regel (DIN 18531 / Flachdachrichtlinie):</strong> Direkten Kontakt strikt vermeiden! Trennlagen aus Glasvlies (<InlineMath math="\ge 120\,\text{g/m}^2" />) oder synthetischem Schutzvlies (<InlineMath math="\ge 300\,\text{g/m}^2" />) als Diffusionsbarriere zwischenlegen.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab 5: Tief- & Ingenieurbau */}
          {activeSubTab === 'tief_ingenieurbau' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Ingenieurbau (Brücken & Tunnel) */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    🌉 Ingenieurbau: Brücken & Tunnel (DIN EN 1992-2 / ZTV-ING)
                  </h3>
                  
                  <div className="space-y-3.5 text-sm text-slate-800 leading-relaxed">
                    <div>
                      <strong className="block text-slate-900">1. Chlorid-induzierte Lochfraßkorrosion & Schollenabplatzung (XD3 / XF4):</strong>
                      <p className="mt-0.5 text-slate-700 text-xs">
                        Infolge undichter Fahrbahnübergänge oder verstopfter Brückenabläufe dringt tausalzreiches Schmelzwasser direkt zu Koppelfugen, Brückenlagern und Spanngliedern vor. Ohne Deckschichtschutz bilden sich Makroelemente mit Korrosionsstromdichten von <InlineMath math="i_{\text{corr}} > 10\,\mu\text{A/cm}^2" /> (über 0,1 mm Querschnittsverlust pro Jahr!).
                      </p>
                    </div>

                    <div>
                      <strong className="block text-slate-900">2. Kappen-Abplatzungen & Frost-Tausalz-Widerstand (DIN EN 12390-9 / CDF-Test):</strong>
                      <p className="mt-0.5 text-slate-700 text-xs">
                        Brückenkappen unterliegen Frost-Tau-Wechseln mit Tausalzeinwirkung (XF4). Gefrierendes Wasser expandiert um ≈ +9 Vol.-%. Ohne Mikroluftporen (LP-Beton mit Abstandsfaktor <InlineMath math="L \le 0{,}20\,\text{mm}" /> nach Powers) entsteht ein hydrostatischer Abpressdruck im Zementstein:
                      </p>
                      <div className="bg-white p-2 rounded border border-home-grau/25 text-xs font-mono my-1">
                        <BlockMath math="L \le 0{,}20\,\text{mm} \quad \text{und Luftgehalt im Frischbeton } \ge 4{,}0\text{--}5{,}5\,\% \quad \Longrightarrow \text{ Frost-Tausalz-Beständigkeit}" />
                      </div>
                    </div>

                    <div>
                      <strong className="block text-slate-900">3. Sinterbildung & Biogene Schwefelsäurekorrosion (BSK) im Tunnel:</strong>
                      <p className="mt-0.5 text-slate-700 text-xs">
                        Kalklösendes Bergwasser reagiert mit Calciumhydroxid im Spritzbeton (<InlineMath math="\text{Ca(OH)}_2 + \text{CO}_2 \rightarrow \text{CaCO}_3" />) und verstopft Drainagerohre mit harten Calcit-Sintern. Im Abwasser- und Tunnelsumpfbereich oxidieren <em>Thiobacillus</em>-Bakterien Schwefelwasserstoff (<InlineMath math="\text{H}_2\text{S}" />) zu reiner Schwefelsäure (<InlineMath math="\text{H}_2\text{SO}_4" />), was Zementstein im Säureangriff (<InlineMath math="\text{pH} < 2" />) auflöst.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Geotechnik & Tiefbau (Baugruben & Gründungen) */}
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
                  <h3 className="font-bold text-base text-shiraz flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    🏗️ Geotechnik: Baugruben & Gründungen
                  </h3>

                  <div className="space-y-3.5 text-sm text-slate-800 leading-relaxed">
                    <div>
                      <strong className="block text-slate-900">1. Hydrologischer / Hydraulischer Grundbruch (Heaving):</strong>
                      <p className="mt-0.5 text-slate-700 font-sans">
                        Wenn die nach oben gerichtete Strömungskraft des zuströmenden Grundwassers am Fuß einer unvollständig abgeriegelten Baugrube das Eigengewicht des anstehenden Bodens übersteigt.
                      </p>
                      <div className="mt-2 bg-white p-2.5 rounded border border-home-grau/30 text-xs">
                        <span className="font-semibold block mb-1 text-slate-800">Nachweis HYD nach DIN EN 1997-1 (Eurocode 7) mit NA:</span>
                        <BlockMath math="S_{dst,k} \cdot \gamma_{H} \le G'_{stb,k} \cdot \gamma_{G,stb}" />
                        <span className="text-slate-500 block mt-1 leading-normal">
                          Strömungskraft <InlineMath math="S" /> (aus dem hydraulischen Gefälle <InlineMath math="i" />) gegen das Gewicht des Bodens unter Auftrieb <InlineMath math="G'" />, jeweils mit Teilsicherheitsbeiwerten nach DIN EN 1997-1/NA bzw. DIN 1054.
                        </span>
                      </div>
                    </div>

                    <div>
                      <strong className="block text-slate-900">2. Pfahlkopf- & Bohrpfahlerstellungsfehler:</strong>
                      <p className="mt-0.5 text-slate-700">
                        Beim Betonieren von Tiefgründungen (Bohrpfählen) unter Wasser wird die oberste Betonschicht mit Bohrschlamm und Stützflüssigkeit verunreinigt und ist minderfest (Kopfbeton). Wird diese "Sperrschicht" nach dem Aushärten nicht fachgerecht mechanisch abgestemmt (bis auf gesunden, tragfähigen Betonquerschnitt), entstehen folgenschwere Schwachstellen in der Lastübertragung.
                      </p>
                      <div className="mt-2 bg-white p-2.5 rounded border border-home-grau/30 text-xs text-slate-500">
                        <strong className="text-slate-700 block">Grenzzustand der Tragfähigkeit (Bohrpfahl):</strong>
                        <BlockMath math="R_{c,d} = \frac{R_{b,k}}{\gamma_b} + \frac{R_{s,k}}{\gamma_s}" />
                        <span className="block mt-1 leading-normal">
                          Dabei repräsentiert <InlineMath math="R_{b,k}" /> den charakteristischen Spitzenwiderstand, <InlineMath math="R_{s,k}" /> die Mantelreibung und <InlineMath math="\gamma" /> die Teilsicherheitsbeiwerte nach Eurocode.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Diagnostik & Monitoring im Ingenieurbau */}
              <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                  🔍 Diagnostik & zerstörungsfreie Prüfverfahren (ZfP)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <strong className="text-shiraz block">Potenzialfeldmessung (Half-Cell)</strong>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      Misst die elektrochemische Spannung einer Kupferelektrode auf der Betonoberfläche. Dadurch können von Lochfraßkorrosion befallene oder de-passivierte Bewehrungsstähle großflächig, zerstörungsfrei und punktgenau im Fahrbahnbereich lokalisiert werden.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <strong className="text-shiraz block">Ultraschall-Echoverfahren</strong>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      Schallwellen werden eingeleitet und empfangen. Durch Laufzeitunterschiede lassen sich Fehlstellen, Kiesnester im tiefen Betonquerschnitt, Hohlräume in Hüllrohren von Vorspannungen oder die genaue Bauteildicke zerstörungsfrei ermitteln.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <strong className="text-shiraz block">Brückenmonitoring nach DIN 1076</strong>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      Überwachung der Ingenieurbauwerke im Zuge von Straßen und Wegen nach DIN 1076 (Ausgabe 2026-01, ersetzt 1999-11): Hauptprüfung alle 6 Jahre, einfache Prüfung 3 Jahre nach der Hauptprüfung, Besichtigung jährlich (sofern keine H/E), laufende Beobachtung in der Regel zweimal jährlich, Sonderprüfung anlassbezogen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Interaktiver Bau-Szenarien-Analysator */}
          {activeSubTab === 'analysator' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-50 border border-home-grau/30 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4 border-b border-home-grau/30 pb-3">
                  <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg"><Lightbulb size={18} /></span>
                  <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                      Interaktiver Bau-Szenarien-Analysator
                    </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Entdecken Sie typische Bauschäden und bauchemische Unverträglichkeiten aus der Sachverständigenpraxis.
          </p>
        </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Selector List */}
                  <div className="lg:col-span-5 flex flex-col gap-2">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1 block">Wählen Sie einen Fall aus:</span>
                    {scenarios.map((scen) => (
                      <button
                        key={scen.id}
                        onClick={() => setSelectedScenario(scen.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm flex justify-between items-center gap-2 ${
                          selectedScenario === scen.id
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white border-home-grau/30 hover:bg-slate-100 text-slate-850'
                        }`}
                      >
                        <div className="flex flex-col gap-1 min-w-0 pr-2">
                          <span className={`text-xs uppercase font-bold tracking-wider ${selectedScenario === scen.id ? 'text-white/85' : 'text-shiraz'}`}>{scen.category}</span>
                          <span className="font-bold truncate">{scen.title}</span>
                        </div>
                        <ChevronRight size={14} className="shrink-0" />
                      </button>
                    ))}
                  </div>

                  {/* Detail Output Container */}
                  <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col justify-center">
                    {selectedScenario ? (
                      (() => {
                        const activeVal = scenarios.find(s => s.id === selectedScenario)!;
                        return (
                          <div className="space-y-4 animate-in fade-in duration-300">
                            <div>
                              <span className="text-sm font-bold text-shiraz uppercase tracking-widest">{activeVal.category}</span>
                              <h4 className="font-bold text-base text-slate-900 leading-tight mt-0.5">{activeVal.title}</h4>
                            </div>

                            <div className="text-sm text-slate-800 bg-slate-50 p-3.5 rounded-lg border border-home-grau/30 leading-relaxed italic">
                              "{activeVal.description}"
                            </div>

                            <div className="grid grid-cols-1 gap-3.5 text-sm text-slate-800 leading-relaxed font-normal">
                              <div>
                                <span className="font-semibold text-slate-900 block border-b pb-1">📄 Juristischer Status / Relevanz</span>
                                <span className="text-slate-700 block mt-1">{activeVal.status}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-shiraz block border-b pb-1">👤 Verantwortlicher Bauakteur</span>
                                <span className="text-slate-700 block mt-1">{activeVal.responsibility}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 block border-b pb-1">🛡️ Zuständige Bau-Versicherungsdeckung</span>
                                <span className="text-slate-700 block mt-1">{activeVal.insurance}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 block border-b pb-1">🛠️ Technische Sanierungsmethode</span>
                                <span className="text-slate-700 block mt-1">{activeVal.remedy}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-center py-8 text-slate-400 flex flex-col items-center justify-center gap-2">
                        <HelpCircle size={36} className="text-slate-300 animate-bounce" />
                        <span className="font-bold text-sm text-slate-900">Kein Schaden-Szenario ausgewählt</span>
                        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                          Wählen Sie links eines der realitätsnahen Schadensbilder oder materialchemischen Verträglichkeitskonflikte aus, um den bauchemischen Teufelskreis aufzudecken.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Rechnerische Rissbreite einer Stahlbetonwand"
        zielGleichung="w_k = s_{r,max} \cdot (\varepsilon_{sm} - \varepsilon_{cm})"
        schritte={[
          { titel: 'Rissabstand', erklaerung: 'Maximaler Rissabstand aus der Bemessung:', formel: 's_{r,max} = 200\\,\\text{mm}' },
          { titel: 'Dehnungsdifferenz', erklaerung: 'Mittlere Dehnungsdifferenz zwischen Stahl und Beton:', formel: '\\varepsilon_{sm} - \\varepsilon_{cm} = 0{,}60\\,\\text{‰}' },
          { titel: 'Rissbreite', erklaerung: 'Einsetzen und Vergleich mit w_max = 0,3 mm (XC4):', formel: 'w_k = 200 \\cdot 0{,}0006 = 0{,}12\\,\\text{mm} \\le 0{,}3\\,\\text{mm}' }
        ]}
        ergebnisHinweis="Gemessene Risse im Bestand sind mit dem Rechenwert nur bedingt vergleichbar; entscheidend ist die Ursache (Last, Zwang, Schwinden) und ob der Riss sich bewegt."
        normQuelle="DIN EN 1992-1-1 + NA, 7.3.4"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Kritische Risslänge bei sprödem Versagen"
        zielGleichung="a_c = \frac{1}{\pi}\left(\frac{K_{Ic}}{Y \cdot \sigma}\right)^2"
        schritte={[
          { titel: 'Spannungsintensität', erklaerung: 'Randriss a = 10 mm, σ = 150 MPa, Y = 1,12:', formel: 'K_I = 1{,}12 \\cdot 150 \\cdot \\sqrt{\\pi \\cdot 0{,}010} = 29{,}8\\,\\text{MPa}\\sqrt{\\text{m}}' },
          { titel: 'Vergleich', erklaerung: 'Bruchzähigkeit K_Ic = 50 MPa√m:', formel: '29{,}8 < 50 \\Rightarrow \\text{stabil}' },
          { titel: 'Kritische Risslänge', erklaerung: 'Umstellen nach a:', formel: 'a_c = \\frac{1}{\\pi}\\left(\\frac{50}{168}\\right)^2 = 0{,}028\\,\\text{m} = 28\\,\\text{mm}' }
        ]}
        ergebnisHinweis="Bei tiefen Temperaturen sinkt K_Ic vieler Stähle stark – dann reichen schon Risse von wenigen Millimetern (vgl. Silver Bridge 1967)."
        normQuelle="Irwin (1957); ISO 12135"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="schadensbilder" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 11 Mängel & Schäden: DIN 1076:2026-01, Rissbreiten, Bruchmechanik und Quellen geprüft; fachliche Freigabe durch den Autor ausstehend)"
        weblinks={[
          { title: "WTA e.V. (Wissenschaftlich-Technische Arbeitsgemeinschaft)", url: "https://www.wta-gmbh.de/" },
          { title: "DIN 18533 - Bauwerksabdichtungen", url: "https://www.din.de/" },
          { title: "BASt - Bundesanstalt für Straßenwesen (Brückenprüfung)", url: "https://www.bast.de/" }
        ]} 
        wikipedia={[
          { title: "Bauschaden", url: "https://de.wikipedia.org/wiki/Bauschaden" },
          { title: "Ettringit", url: "https://de.wikipedia.org/wiki/Ettringit" },
          { title: "Alkali-Kieselsäure-Reaktion", url: "https://de.wikipedia.org/wiki/Alkali-Kiesels%C3%A4ure-Reaktion" },
          { title: "Bimetallkorrosion", url: "https://de.wikipedia.org/wiki/Bimetallkorrosion" },
          { title: "Spannungsrisskorrosion", url: "https://de.wikipedia.org/wiki/Spannungsrisskorrosion" }
        ]} 
        literatur={[
          'Zimmermann, G. (Hrsg.): Bauschadens-Sammlung. Fraunhofer IRB Verlag',
          'Oswald, R.; Abel, R.: Hinzunehmende Unregelmäßigkeiten bei Gebäuden. Springer Vieweg',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Raupach, M.; Orlowsky, J.: Erhaltung von Betonbauwerken. Wiesbaden: Vieweg+Teubner (aktuelle Auflage)',
          'Aachener Bausachverständigentage (Tagungsbände, AIBau). Wiesbaden: Springer Vieweg (jährlich)'
        ]} 
        regelwerke={[
          { title: 'DIN 18533 (Abdichtung von erdberührten Bauteilen)' },
          { title: 'DIN EN 1992-1-1 / Eurocode 2 (Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken)' },
          { title: 'DIN 1076:2026-01 (Ingenieurbauwerke im Zuge von Straßen und Wegen – Überwachung und Prüfung)' },
          { title: 'Deutscher Ausschuss für Stahlbeton (DAfStb): Vorbeugende Maßnahmen gegen schädigende Alkalireaktion im Beton (Alkali-Richtlinie), Ausgabe 2013-10', url: 'https://www.dafstb.de/' },
          { title: 'WTA-Merkblatt 4-6: Nachträgliches Abdichten erdberührter Bauteile', url: 'https://www.wta-gmbh.de/' }
        ]} 
        formeln={[
          {
            formel: '3\\,\\text{CaO}\\cdot\\text{Al}_2\\text{O}_3\\cdot\\text{CaSO}_4\\cdot 12\\,\\text{H}_2\\text{O} + 2\\,\\text{Ca}^{2+} + 2\\,\\text{SO}_4^{2-} + 20\\,\\text{H}_2\\text{O} \\longrightarrow 3\\,\\text{CaO}\\cdot\\text{Al}_2\\text{O}_3\\cdot 3\\,\\text{CaSO}_4\\cdot 32\\,\\text{H}_2\\text{O}',
            erklaerung: 'Sulfattreiben (sekundäre Ettringitbildung): Umwandlung von Monosulfat in Trisulfat (Ettringit) unter massiver Volumenvergrößerung (ca. +130 bis +168 %), die zu Gefügesprengung führt.',
            quelle: 'Wendehorst Baustoffkunde'
          },
          {
            formel: 'K_I = Y \\cdot \\sigma \\cdot \\sqrt{\\pi \\cdot a} \\ge K_{Ic}',
            erklaerung: 'Bruchmechanisches Bruchkriterium nach Irwin: Überschreitet der Spannungsintensitätsfaktor KI den kritischen Werkstoffwert KIc (Bruchzähigkeit), kommt es zum instabilen, schlagartigen Sprödbruch.',
            quelle: 'Irwin (1957); Bruchmechanik-Grundlagen / ISO 12135'
          },
          {
            formel: '\\text{Ca(OH)}_2 + \\text{CO}_2 \\longrightarrow \\text{CaCO}_3 \\downarrow + \\text{H}_2\\text{O} \\quad \\implies x_c(t) = k_{\\text{carb}} \\cdot \\sqrt{t}',
            erklaerung: 'Depassivierung durch Karbonatisierung: Wurzel-t-Diffusionsgesetz der Karbonatisierungsfront und Absinken des Porenwasser-pH-Werts von über 12,5 auf unter 9.',
            quelle: 'DIN EN 1992-1-1 / DAfStb'
          },
          {
            formel: '\\Delta V_{\\text{ASR}} \\propto c_{(\\text{Na}^+, \\text{K}^+)} \\cdot c_{(\\text{reaktive Kieselsäure})} \\implies \\sigma_{\\text{Spren}} > f_{\\text{ctm}}',
            erklaerung: 'Alkali-Kieselsäure-Reaktion (AKR / Betonkrebs): Quellfähiges Alkali-Kieselsäure-Gel erzeugt Sprengdrücke oberhalb der Betonzugfestigkeit, was zur Netzrissbildung und Ausblühungen führt.',
            quelle: 'DAfStb Alkali-Richtlinie'
          }
        ]} 
      />
    </div>
  );
}
