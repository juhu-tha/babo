import React, { useState, useMemo } from 'react';
import { FlaskConical, Droplets, ShieldAlert, Layers, Activity, Paintbrush, Shield, Snowflake, ArrowRight, Flame, AlertTriangle, Sliders, Sparkles, Paperclip } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Slider } from '@/src/components/ui/Slider';
import { Line } from 'react-chartjs-2';
import { BlockMath, InlineMath } from 'react-katex';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Bauchemie: React.FC = () => {
  const [activeTab, setActiveTab ] = useState<'grundlagen' | 'zusatzmittel' | 'angriffe' | 'salze' | 'oberflaechenschutz' | 'korrosionsschutz' | 'kleben_dichten'>('grundlagen');

  // Korrosion State (AKR)
  const [alkaliContent, setAlkaliContent] = useState(3.0); // kg/m3
  const [moisture, setMoisture] = useState(80); // %

  // Stellmittel & Rheologie State
  const [stellmittelConc, setStellmittelConc] = useState(0.8); // in % (0.0 to 2.0%)
  const [currentShear, setCurrentShear] = useState(15.0); // in s^-1 (Scherrate)

  // Dynamic Rheology Simulator calculations
  const rheologyResults = useMemo(() => {
    const shearRates = [0.1, 1, 5, 10, 20, 30, 50, 70, 90, 100];
    
    // Viscosity model with Stellmittel: base viscosity is 1.5, added viscosity decays with shear rate (shear-thinning)
    const viscosityWithStellmittel = shearRates.map(s => {
      const added = stellmittelConc * 90 / (Math.pow(s, 0.72) + 0.25);
      return Math.round((1.5 + added) * 10) / 10;
    });

    const viscosityWithoutStellmittel = shearRates.map(() => 2.0); // Simple Newtonian slurry

    // Current viscosity based on currentShear slider
    const currentAdded = stellmittelConc * 90 / (Math.pow(currentShear, 0.72) + 0.25);
    const currentViscosity = Math.round((1.5 + currentAdded) * 10) / 10;

    // Evaluate application state
    let stateMessage = "";
    let stateColor = "";
    let statusClass = "";

    if (currentShear < 5) {
      // RESTING STATE (Standfestigkeit)
      if (stellmittelConc < 0.4) {
        stateMessage = "Fliese rutscht ab / Putz fließt ab! Zu geringe Fließgrenze im Ruhezustand (Klebematrix versagt mangels Stellmittel).";
        stateColor = "text-rose-700 bg-rose-50 border-rose-200 shadow-rose-100";
        statusClass = "Kritisches Abrutschen!";
      } else if (stellmittelConc >= 0.4 && stellmittelConc <= 1.5) {
        stateMessage = "Hervorragende Standfestigkeit! Das Stellmittel bildet im Ruhezustand ein hochelastisches Kartenhaus-Gefüge (Gel-Zustand).";
        stateColor = "text-emerald-700 bg-emerald-50 border-emerald-200 shadow-emerald-100";
        statusClass = "Sicherer Stand!";
      } else {
        stateMessage = "Übersteift! Der Mörtel hat eine extreme Fließgrenze, krümelt vom Untergrund und benetzt die Fliesenrückseite kaum.";
        stateColor = "text-amber-700 bg-amber-50 border-amber-200 shadow-amber-100";
        statusClass = "Überdosiert!";
      }
    } else {
      // SHEARING STATE (Verarbeitung unter Kraftaufwand)
      const forceRequired = currentViscosity > 15 ? "hoch (" + currentViscosity + " Pa·s)" : currentViscosity < 4 ? "sehr leicht (" + currentViscosity + " Pa·s)" : "optimal (" + currentViscosity + " Pa·s)";
      if (stellmittelConc < 0.4) {
        stateMessage = "Sehr leichtzuzügig, verliert beim Aufziehen jedoch sofort die Stegkontur der Zahnkelle und verfließt flach.";
        stateColor = "text-blue-700 bg-blue-50 border-blue-200 shadow-blue-100";
        statusClass = "Keine Zahnung!";
      } else if (stellmittelConc >= 0.4 && stellmittelConc <= 1.5) {
        stateMessage = `Exzellente Scherentzähung! Das Verstreichen geht leicht von der Hand (${forceRequired}). Kellensteg steht perfekt.`;
        stateColor = "text-emerald-700 bg-emerald-50 border-emerald-200 shadow-emerald-100";
        statusClass = "Perfekte Verarbeitung!";
      } else {
        stateMessage = `Scherausdünnung unzureichend! Bemessungskraft beim Streichen ist extrem hoch (${forceRequired} Pa·s). Schwer verarbeitbar.`;
        stateColor = "text-amber-700 bg-amber-50 border-amber-200 shadow-amber-100";
        statusClass = "Sehr zäh!";
      }
    }

    return {
      shearRates,
      viscosityWithStellmittel,
      viscosityWithoutStellmittel,
      currentViscosity,
      stateMessage,
      stateColor,
      statusClass
    };
  }, [stellmittelConc, currentShear]);

  const rheologyChartData = {
    labels: rheologyResults.shearRates.map(s => `${s} s⁻¹`),
    datasets: [
      {
        label: 'Mörtel MIT Rheologie-Stellmittel (Thixotrop)',
        data: rheologyResults.viscosityWithStellmittel,
        borderColor: '#881235',
        backgroundColor: 'rgba(153, 27, 27, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Referenz-Slurry OHNE Stellmittel (Starr/Newtonsch)',
        data: rheologyResults.viscosityWithoutStellmittel,
        borderColor: '#475569',
        borderDash: [5, 5],
        tension: 0,
        fill: false,
      }
    ]
  };

  const akrData = {
    labels: Array.from({ length: 20 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Dehnung durch AKR (mm/m)',
        data: Array.from({ length: 20 }, (_, i) => {
          const t = i + 1;
          // Simplified AKR expansion model
          const k = (alkaliContent / 5) * (moisture > 80 ? (moisture / 100) : 0.1);
          return k * Math.log(t + 1);
        }),
        borderColor: '#A3113E',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const karbonatisierungData = {
    labels: [0, 5, 10, 25, 50, 100],
    datasets: [
      { label: 'w/z = 0.60 (schlechter Beton)', data: [0, 5, 10, 25, 50, 100].map(t => 4 * Math.sqrt(t)), borderColor: '#A3113E', tension: 0.4 },
      { label: 'w/z = 0.50 (normaler Beton)', data: [0, 5, 10, 25, 50, 100].map(t => 2 * Math.sqrt(t)), borderColor: '#64748b', tension: 0.4 },
      { label: 'w/z = 0.40 (guter Beton)', data: [0, 5, 10, 25, 50, 100].map(t => 0.5 * Math.sqrt(t)), borderColor: '#475569', tension: 0.4 },
    ]
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <FlaskConical className="text-shiraz" /> Bauchemie
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Bauchemie befasst sich mit den stofflichen Grundlagen, den chemischen Reaktionen bei der Herstellung und Erhärtung von Baustoffen sowie den Mechanismen der Alterung und Schädigung. 
            Grundlage hierfür bilden Standardwerke wie <em>Benedix - Bauchemie</em> oder <em>Stark/Wicht - Dauerhaftigkeit von Beton</em>.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'grundlagen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('grundlagen')}
          >
            <Activity size={16} /> Chemische Grundlagen
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zusatzmittel' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zusatzmittel')}
          >
            <Droplets size={16} /> Betonzusatzmittel
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'angriffe' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('angriffe')}
          >
            <ShieldAlert size={16} /> Chemische Angriffe
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'salze' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('salze')}
          >
            <Snowflake size={16} /> Bauschädliche Salze
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'oberflaechenschutz' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('oberflaechenschutz')}
          >
            <Paintbrush size={16} /> Oberflächenschutz
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'korrosionsschutz' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('korrosionsschutz')}
          >
            <Shield size={16} /> Korrosionsschutz
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'kleben_dichten' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('kleben_dichten')}
          >
            <Paperclip size={16} /> Kleben &amp; Dichten (Grundlagen)
          </button>
        </div>
      </div>

      {activeTab === 'grundlagen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Bindungsarten im Bauwesen</h3>
              <p className="text-sm text-text-main/80">
                Die Eigenschaften von Baustoffen werden maßgeblich durch ihre chemischen Bindungen auf atomarer Ebene bestimmt:
              </p>
              <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
                <li><strong>Ionenbindung (Salzbindung):</strong> Elektrostatische Anziehung zwischen Kationen und Anionen. Typisch für kristalline Feststoffe wie Gips (<InlineMath math="CaSO_4" />) oder Kalkstein (<InlineMath math="CaCO_3" />). Spröde, oft wasserlöslich.</li>
                <li><strong>Atombindung (Kovalente Bindung):</strong> Gemeinsame Elektronenpaare. Sehr stark und gerichtet. Typisch für Quarz (<InlineMath math="SiO_2" />) und organische Polymere (Kunststoffe, Holz).</li>
                <li><strong>Metallische Bindung:</strong> Atomrümpfe (positive Kationen) liegen in einem Gitter, umgeben von einem frei beweglichen "Elektronengas". Diese ungerichtete Bindung ermöglicht die hohe elektrische sowie thermische Leitfähigkeit. Vor allem aber bedingt das anpassungsfähige Elektronengas die <strong>plastische Verformbarkeit (Duktilität)</strong> von Baustahl, da Kristallschichten abscheren können, ohne dass die Bindung bricht (anders als bei spröden Ionenbindungen).</li>
                <li><strong>Intermolekulare Kräfte:</strong> Van-der-Waals-Kräfte oder Wasserstoffbrückenbindungen. Schwächer, aber entscheidend für die Kohäsion von Wasser, Holzfasern oder thermoplastischen Kunststoffen.</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">pH-Wert & Passivierung</h3>
              <p className="text-sm text-text-main/80">
                Der pH-Wert ist der negative dekadische Logarithmus der Wasserstoffionen-Aktivität. Er ist zentral für die Dauerhaftigkeit von Stahlbeton.
              </p>
              <div className="bg-off-white p-4 rounded-lg border border-home-grau/30 text-center">
                <BlockMath math="pH = -\log_{10}(a_{H^+})" />
              </div>
              
              <div className="mt-2">
                <h4 className="font-bold text-sm text-text-main mb-2">pH-Skala & Beton</h4>
                <div className="relative h-12 w-full rounded-full overflow-hidden flex text-xs font-bold text-white shadow-inner">
                  <div className="bg-torch-red flex items-center justify-center" style={{ width: '42.8%' }}>Säureangriff (pH &lt; 6)</div>
                  <div className="bg-amber-500 flex items-center justify-center" style={{ width: '21.4%' }}>Karbonatisierung (pH 6-9)</div>
                  <div className="bg-emerald-500 flex items-center justify-center" style={{ width: '35.8%' }}>Passivierung (pH &gt; 9)</div>
                </div>
                <div className="flex justify-between text-xs text-text-main/60 mt-1 px-2">
                  <span>0</span>
                  <span>6</span>
                  <span>9</span>
                  <span>14</span>
                </div>
              </div>

              <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2 mt-2">
                <li><strong>Frischbeton:</strong> Durch die Lösung von Alkalien und Calciumhydroxid (<InlineMath math="Ca(OH)_2" />) entsteht ein stark alkalisches Milieu mit einem <strong>pH-Wert &gt; 12,5</strong>.</li>
                <li><strong>Passivierung:</strong> In diesem hochalkalischen Milieu bildet sich auf der Oberfläche des Bewehrungsstahls eine mikroskopisch dünne, dichte Oxidschicht (Passivschicht), die den Stahl vor Korrosion schützt.</li>
                <li><strong>Depassivierung:</strong> Sinkt der pH-Wert unter ca. 9 (z.B. durch Karbonatisierung), löst sich diese Schutzschicht auf. Bei Anwesenheit von Feuchtigkeit und Sauerstoff beginnt der Stahl zu rosten.</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Thermische Gefügebildung: Die Sinterung</h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Das Sinterverfahren ist eine thermische Oberflächenveredelung, bei der feinkörnige, mineralische Feststoffe unter hohem Druck und starker Hitzeeinwirkung (jedoch <strong>unterhalb der Schmelztemperatur</strong> der Hauptkomponenten) verdichtet und zusammengefügt werden. Triebkraft ist der Abbau freier Oberflächenenergie durch Oberflächendiffusion.
              </p>
              <div className="space-y-3 text-xs text-text-main/80">
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-shiraz block mb-1">1. Zementklinker-Sinterung (~ 1450 °C)</span>
                  <p className="leading-relaxed">
                    Im industriellen Drehrohrofen erreicht das Zementrohmehl (Kalkstein-Ton-Mischung) die Sinterzone. Hier schmilzt ein Teil der mineralischen Phasen leicht an (Tonerde und Eisenoxid bilden eine circa 20-prozentige Flussmittelschmelze aus <InlineMath math="C_3A" /> und <InlineMath math="C_4AF" />). Die Hauptphasen Branntkalk (<InlineMath math="CaO" />) und Siliciumdioxid (<InlineMath math="SiO_2" />) diffundieren festkörperchemisch ineinander. Es entstehen die hochreaktiven Klinkerminerale:
                    <span className="block font-mono font-bold mt-1 text-slate-700">
                      {"• Alit (C₃S, Tricalciumsilicat)   • Belit (C₂S, Dicalciumsilicat)"}
                    </span>
                  </p>
                </div>
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-shiraz block mb-1">2. Tonkeramik- &amp; Ziegelsinterung (900 – 1100 °C)</span>
                  <p className="leading-relaxed">
                    Beim Ziegelbrand wird zunächst das physikalisch gebundene Wasser und folgend das chemische Gitterwasser der Tonminerale (z. B. Kaolinit) ausgetrieben. Bei Erreichen der Sintergrenze bilden Flussmittel (Feldspäte, Alkalien, Eisenoxide) glasige Schmelzbrücken zwischen den Quarzkörnern. Das Gefüge schwindet (Brennschwindung); Mauerziegel bleiben porös, bei Klinker (Brand bis ca. 1.200 °C) entsteht ein dicht gesintertes, frostbeständiges Gefüge. und bilden glasige Verklebungsbrücken zwischen den härteren Quarzkörnern aus. Das Gefüge schrumpft (Brandschwindung) und verdichtet sich zu einem frostbeständigen, langlebigen Klinkerskelett.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Das Rückgrat des Massivbaus: CSH-Phasen</h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Trifft Zement auf Anmachwasser, reagieren die Klinkerphasen rasch (Hydratation). Dabei wachsen nadelartige, kristalline und amorphe Plateaustrukturen – die sogenannten <strong>Calcium-Silicat-Hydrat-Phasen (C-S-H)</strong>. Sie machen über 70% des erhärteten Zementsteins aus und sind für dessen mechanische Festigkeit und Dichtigkeit verantwortlich.
              </p>
              
              <div className="bg-off-white p-3 rounded-lg border border-home-grau/30 text-center text-xs">
                <span className="font-bold block mb-1 text-slate-700">Vereinfachte Hydratationsformel von Alit:</span>
                <BlockMath math="2\ Ca_3SiO_5 + 6\ H_2O \rightarrow 3\ CaO \cdot 2\ SiO_2 \cdot 3\ H_2O + 3\ Ca(OH)_2" />
                <span className="text-[10px] text-text-main/60 block mt-1">(Aus Alit entsteht CSH-Gel + Portlandit)</span>
              </div>

              <div className="space-y-2 text-xs text-text-main/80">
                <div className="p-3.5 bg-[#fcf8f2] rounded-xl border border-stone-200/50">
                  <h4 className="font-bold text-[#A3113E] uppercase tracking-wide text-[10px] mb-1 font-mono">Die Gel-Poren-Architektur (Treval C. Powers)</h4>
                  <p className="leading-relaxed">
                    CSH-Gele bilden eine extrem ungeordnete Schichtstruktur (ähnlich dem natürlichen Mineral Tobermorit) mit einer unvorstellbar großen inneren Oberfläche von ca. 200 m² pro Gramm. Zwischen diesen CSH-Schichten liegen winzige <strong>Gel-Poren</strong> (Breite nur ca. 1,5 bis 3 Nanometer). Die extreme Kohäsions- und Druckfestigkeit beruht nicht auf rein mechanischer Verkrallung, sondern auf den weitreichenden coulombschen Anziehungskräften (ionisch-kovalente Mischbindung) und zwischenmolekularen Anhangskräften (Van-der-Waals) zwischen diesen nanometer-nahen Schichten.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'zusatzmittel' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Verflüssigende Zusatzmittel</h3>
              <p className="text-sm text-text-main/80">
                Diese Zusatzmittel reduzieren den Wasserbedarf bei gleicher Verarbeitbarkeit oder verflüssigen den Beton bei gleichem w/z-Wert.
              </p>
              <ul className="list-disc list-inside text-sm text-text-main/80 space-y-4">
                <li>
                  <strong>Betonverflüssiger (BV):</strong> 
                  <br/><em>Chemie:</em> Ligninsulfonate, Melaminharze.
                  <br/><em>Wirkung:</em> Elektrostatische Abstoßung. Die Moleküle lagern sich an Zementpartikel an und laden diese negativ auf. Gleichnamige Ladungen stoßen sich ab.
                </li>
                <li>
                  <strong>Fließmittel (FM):</strong> 
                  <br/><em>Chemie:</em> Polycarboxylatether (PCE).
                  <br/><em>Wirkung:</em> Sterische Hinderung. Die Hauptkette adsorbiert am Zementkorn, lange Seitenketten ragen in die Porenlösung und halten die Partikel physisch auf Abstand. Sehr hohe Wasserreduktion möglich.
                </li>
              </ul>

              <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <h4 className="text-[10px] font-bold mb-4 text-center">Elektrostatische Abstoßung (BV)</h4>
                  <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 rounded-full bg-home-grau/40 flex items-center justify-center relative border-2 border-dashed border-torch-red">
                      <span className="absolute -top-3 text-torch-red font-bold">-</span>
                      <span className="absolute -bottom-3 text-torch-red font-bold">-</span>
                      <span className="absolute -left-3 text-torch-red font-bold">-</span>
                      <span className="absolute -right-3 text-torch-red font-bold">-</span>
                    </div>
                    <div className="flex items-center text-torch-red font-bold">↔</div>
                    <div className="w-10 h-10 rounded-full bg-home-grau/40 flex items-center justify-center relative border-2 border-dashed border-torch-red">
                      <span className="absolute -top-3 text-torch-red font-bold">-</span>
                      <span className="absolute -bottom-3 text-torch-red font-bold">-</span>
                      <span className="absolute -left-3 text-torch-red font-bold">-</span>
                      <span className="absolute -right-3 text-torch-red font-bold">-</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="text-[10px] font-bold mb-4 text-center">Sterische Hinderung (PCE)</h4>
                  <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 rounded-full bg-home-grau/40 flex items-center justify-center relative">
                      <div className="absolute -top-3 -right-3 text-shiraz font-bold">〰</div>
                      <div className="absolute -bottom-3 -left-3 text-shiraz font-bold">〰</div>
                      <div className="absolute top-0 -left-4 text-shiraz font-bold">〰</div>
                    </div>
                    <div className="flex items-center text-shiraz font-bold">↔</div>
                    <div className="w-10 h-10 rounded-full bg-home-grau/40 flex items-center justify-center relative">
                      <div className="absolute -top-3 -left-3 text-shiraz font-bold">〰</div>
                      <div className="absolute -bottom-3 -right-3 text-shiraz font-bold">〰</div>
                      <div className="absolute top-0 -right-4 text-shiraz font-bold">〰</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Weitere wichtige Zusatzmittel</h3>
              <ul className="list-disc list-inside text-sm text-text-main/80 space-y-4">
                <li>
                  <strong>Luftporenbildner (LP):</strong> 
                  <br/><em>Chemie:</em> Tenside (grenzflächenaktive Stoffe).
                  <br/><em>Wirkung:</em> Erzeugen mikroskopisch kleine, künstliche Luftporen (Abstandsfaktor &lt; 0.2 mm). Diese dienen als Expansionsraum für gefrierendes Wasser und erhöhen den Frost-Tausalz-Widerstand drastisch.
                </li>
                <li>
                  <strong>Verzögerer (VZ):</strong> 
                  <br/><em>Chemie:</em> Zuckerderivate, Phosphate, Fruchtsäuren.
                  <br/><em>Wirkung:</em> Adsorbieren an den Keimen der Hydratationsprodukte oder bilden Komplexe mit Calciumionen. Verzögern das Erstarren.
                </li>
                <li>
                  <strong>Beschleuniger (BE):</strong> 
                  <br/><em>Chemie:</em> Alkalifrei (Aluminiumsulfat) oder alkalihaltig (Natriumsilicat).
                  <br/><em>Wirkung:</em> Beschleunigen die C3S-Hydratation oder die Ettringitbildung. Einsatz bei Kälte oder Spritzbeton.
                </li>
                <li>
                  <strong>Dichtungsmittel (DM):</strong> 
                  <br/><em>Chemie:</em> Stearate, feinstteilige Polymere.
                  <br/><em>Wirkung:</em> Verringern die kapillare Wasseraufnahme durch Hydrophobierung der Porenwandungen oder Porenverschluss.
                </li>
                <li>
                  <strong>Schwindreduzierer (SRA):</strong> 
                  <br/><em>Chemie:</em> Glykole, Alkohole.
                  <br/><em>Wirkung:</em> Reduzieren die Oberflächenspannung des Porenwassers und verringern so die Kapillarkräfte beim Austrocknen, was das Schwinden minimiert.
                </li>
              </ul>
            </div>
          </div>

          {/* Spezial-Bauchemie: Stellmittel & Trockenmörtel-Additive */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <Sparkles className="text-shiraz h-5 w-5" /> Spezial-Bauchemie (Mörtel-, Putz- & Klebstoffadditive)
            </h3>
            <p className="text-sm text-text-main/80">
              Im Vergleich zu Standardkonstruktionen aus Ortbeton erfordern bauchemische Fertigerzeugnisse wie Fliesenkleber, Handputze, Spachtelmassen und selbstverlaufende Estriche eine hochentwickelte organisch-mineralische Formulierung.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <span className="font-bold text-sm text-shiraz">1. Stellmittel (Rheologieadditive & Thixotropiermittel)</span>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  <strong>Hauptvertreter:</strong> Pyrogene Kieselsäuren (Aerosile), Schichtsilikate (Bentonit, Attapulgit, Hectorit), modifizierte Harnstoff-Verbindungen.
                  <span className="block my-1" />
                  <strong>Wirkungsweise:</strong> Diese hochdispersen Partikel bauen im Baustoffbrei über Wasserstoffbrücken oder elektrostatische Wechselwirkungen ein reversibles, dreidimensionales Gerüst auf. Dieses erzeugt eine ausgeprägte <strong>Fließgrenze (Yield Stress)</strong>. Im Ruhezustand (z. B. Fliese an vertikaler Wand) wirkt der Mörtel starr (Gelkonsistenz, <em>Standfestigkeit</em> gegen Abrutschen). Durch mechanische Energie (Zahnkellenaufzug, Rühren) bricht das elastische Netzwerk zusammen (Sol-Zustand, Viskosität bricht ein).
                </p>
              </div>
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <span className="font-bold text-sm text-shiraz">2. Wasserrückhaltemittel (Verdickungsmittel)</span>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  <strong>Hauptvertreter:</strong> Celluloseether (MHEC – Methylhydroxyethylcellulose, MHPC – Methylhydroxypropylcellulose).
                  <span className="block my-1" />
                  <strong>Wirkungsweise:</strong> Quellfähige Polysaccharidderivate verstricken sich molekular in der Porenlösung. Durch enorme Hydratationskräfte binden sie das Anmachwasser fest. Dies verhindert das gefürchtete <strong>Aufbrennen</strong> (stark saugende Untergründe wie Porenbeton oder Ziegel entziehen dem Mörtel vorzeitig das Wasser, wodurch die Zementhydratation kollabiert). Zudem wird das Offenhalten der Mörteloberfläche (Hautbildungsschutz) geregelt.
                </p>
              </div>
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <span className="font-bold text-sm text-shiraz">3. Redispergierbares Kunststoffpulver (Dispersionspulver)</span>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  <strong>Hauptvertreter:</strong> Copolymere auf Basis von Vinylacetat-Ethylen (VAE) oder Acrylaten.
                  <span className="block my-1" />
                  <strong>Wirkungsweise:</strong> Dieses sprühgetrocknete Polymerpulver redispergiert durch Wasserzufuhr. Während des Abbindens fließen die Polymerkügelchen zusammen (Koaleszenz) und bilden ein zähelastisches Kunststoff-Filmgitter, das das starre Zementsteingefüge durchdringt. Dies steigert die <strong>Biegezugfestigkeit</strong>, dämpft Schwindrisse ab und sichert die <strong>Haftzugfestigkeit</strong> auf glatten, nicht-porösen Flächen (z. B. Fliese-auf-Fliese-Sanierung). Unverzichtbar für <em>Flexkleber</em> S1 & S2.
                </p>
              </div>
            </div>
          </div>

          {/* Rheologie-Additiv-Simulator */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <div className="border-b border-home-grau/30 pb-2 flex flex-col gap-1">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Sliders className="text-shiraz h-5 w-5" /> Rheologie-Additiv-Simulator (Strukturviskosität & Thixotropie)
              </h3>
              <p className="text-xs text-text-main/60">
                Experimentiere mit der Dosierung von Thixotropier-Stellmitteln (z.B. pyrogene Kieselsäure) und beobachte den Einfluss von Scherkräften (Mörtel auftragen vs. Stillstand an der Wand).
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Controls Column */}
              <div className="lg:col-span-5 flex flex-col gap-5 bg-off-white p-4 rounded-xl border border-home-grau/20">
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-text-main flex items-center justify-between">
                    <span>Stellmittel-Konzentration (z.B. Aerosil/MC)</span>
                    <span className="text-shiraz font-mono font-bold text-sm">{stellmittelConc.toFixed(1)} %</span>
                  </h4>
                  <p className="text-[11px] text-text-main/60 leading-normal">
                    Erhöht die Viskosität im Ruhezustand über ein reversibles Fließnetzwerk dramatischer als im fließenden Zustand.
                  </p>
                  <input 
                    type="range"
                    min="0.0"
                    max="2.0"
                    step="0.1"
                    value={stellmittelConc}
                    onChange={(e) => setStellmittelConc(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <div className="flex justify-between text-[10px] text-text-main/40 font-mono">
                    <span>0.0% (Flüssige Suppe)</span>
                    <span>1.0% (Standfest)</span>
                    <span>2.0% (Übersteift)</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-text-main flex items-center justify-between">
                    <span>Auswirkende Scherrate (Einwirkkraft)</span>
                    <span className="text-shiraz font-mono font-bold text-sm">{currentShear.toFixed(0)} s⁻¹</span>
                  </h4>
                  <p className="text-[11px] text-text-main/60 leading-normal">
                    Scherrate simuliert äußere Kräfte. &lt; 5 s⁻¹ entspricht Stillstand an der Wand (Tragfähigkeit prüfen). &gt; 15 s⁻¹ simuliert mechanisches Rühren oder Kämmen mit der Zahnkelle.
                  </p>
                  <input 
                    type="range"
                    min="0.1"
                    max="100.0"
                    step="1.0"
                    value={currentShear}
                    onChange={(e) => setCurrentShear(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                  <div className="flex justify-between text-[10px] text-text-main/40 font-mono">
                    <span>0.1 (Stillstand)</span>
                    <span>50 (Rühren)</span>
                    <span>100 (Kellenaufzug)</span>
                  </div>
                </div>

                {/* Status Indicator Panel */}
                <div className={`p-4 rounded-lg border flex flex-col gap-1 shadow-sm transition-all duration-300 ${rheologyResults.stateColor}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider">Status: {rheologyResults.statusClass}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white shadow-sm">
                      {currentShear < 5 ? "Ruhezustand" : "Scherspannung"}
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed">
                    {rheologyResults.stateMessage}
                  </p>
                  <div className="text-[11px] font-mono mt-2 pt-2 border-t border-current/10 flex justify-between">
                    <span>Wirksame Viskosität:</span>
                    <span className="font-bold">{rheologyResults.currentViscosity.toFixed(1)} Pa·s</span>
                  </div>
                </div>
              </div>

              {/* Chart Column */}
              <div className="lg:col-span-7 flex flex-col gap-2">
                <h4 className="text-xs font-bold text-text-main/70 uppercase tracking-wider font-mono">Viskositätsverlauf η in Abhängigkeit von der Scherrate γ</h4>
                <div className="h-[280px] bg-off-white p-3 border border-home-grau/20 rounded-xl relative">
                  <Line 
                    data={rheologyChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: { display: true, text: 'Scherrate γ (s⁻¹)', font: { size: 10, weight: 'bold' } },
                          grid: { color: 'rgba(0,0,0,0.03)' }
                        },
                        y: {
                          title: { display: true, text: 'Viskosität η (Pa·s)', font: { size: 10, weight: 'bold' } },
                          min: 0,
                          max: Math.max(10, Math.ceil(Math.max(...rheologyResults.viscosityWithStellmittel) / 10) * 10),
                          grid: { color: 'rgba(0,0,0,0.03)' }
                        }
                      },
                      plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
                      }
                    }}
                  />
                  {/* Highlight current state marker */}
                  <div className="absolute top-4 right-4 bg-white/95 border border-home-grau/30 shadow-sm rounded-lg px-2 py-1 text-[10px] font-mono flex flex-col gap-0.5">
                    <div>γ = {currentShear.toFixed(0)} s⁻¹</div>
                    <div className="font-bold text-shiraz">η ≈ {rheologyResults.currentViscosity.toFixed(1)} Pa·s</div>
                  </div>
                </div>
                <p className="text-[10px] text-text-main/50 italic leading-normal text-center select-none">
                  Hinweis: Pseudoplastisches (scherentzähendes) Verhalten ist für moderne bauchemische Pasten unabdingbar. Newtonsche Fluide (z. B. Wasser, dünnflüssige Öle) haben eine scherratenunabhängige Viskosität und wären als standfeste Pasten untauglich. behalten ihre Viskosität unter Last bei und wären untauglich.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'angriffe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Lösende Angriffe</h3>
            
            <h4 className="font-bold text-shiraz mt-2">Säureangriff</h4>
            <p className="text-sm text-text-main/80">
              Säuren reagieren mit den alkalischen Bestandteilen des Betons (insbesondere Portlandit <InlineMath math="Ca(OH)_2" /> und C-S-H-Phasen) zu gut löslichen Salzen, die ausgewaschen werden. Das Gefüge wird zerstört.
            </p>
            <div className="bg-off-white p-2 rounded-lg border border-home-grau/30 text-center mb-2">
              <BlockMath math="Ca(OH)_2 + 2 HCl \rightarrow CaCl_2 + 2 H_2O" />
            </div>
            <p className="text-xs text-text-main/80 mb-4">
              Beispiel: Salzsäure löst Portlandit zu leicht löslichem Calciumchlorid.
            </p>

            <h4 className="font-bold text-shiraz mt-2">Weiches Wasser (Kohlensäureangriff)</h4>
            <p className="text-sm text-text-main/80">
              Kalklösende Kohlensäure (überschüssiges <InlineMath math="CO_2" /> in weichem Wasser) wandelt schwer lösliches Calciumcarbonat in leicht lösliches Calciumhydrogencarbonat um.
            </p>
            <div className="bg-off-white p-2 rounded-lg border border-home-grau/30 text-center mb-2">
              <BlockMath math="CaCO_3 + CO_2 + H_2O \rightleftharpoons Ca(HCO_3)_2" />
            </div>
            <p className="text-xs text-text-main/80">
              Dieser Prozess führt zur langsamen Auswaschung von Bindemittel an der Betonoberfläche.
            </p>

            <h4 className="font-bold text-shiraz mt-4">Karbonatisierung</h4>
            <p className="text-sm text-text-main/80">
              Kohlendioxid aus der Luft dringt in den Beton ein und reagiert mit Portlandit zu Calciumcarbonat. Der pH-Wert sinkt von &gt;12,5 auf &lt;9.
            </p>
            <div className="bg-off-white p-2 rounded-lg border border-home-grau/30 text-center mb-2">
              <BlockMath math="Ca(OH)_2 + CO_2 \rightarrow CaCO_3 + H_2O" />
            </div>
            <div className="mt-2 border border-home-grau/30 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-sm text-text-main mb-2">Karbonatisierungstiefe (<InlineMath math="d_k = K \cdot \sqrt{t}" />)</h4>
              <div className="h-40 w-full">
                <Line 
                  data={karbonatisierungData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { title: { display: true, text: 'Tiefe d_k (mm)' } },
                      x: { title: { display: true, text: 'Zeit t (Jahre)' } }
                    },
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Treibende Angriffe</h3>
            
            <h4 className="font-bold text-shiraz mt-2">Sulfattreiben</h4>
            <p className="text-sm text-text-main/80">
              Sulfationen (aus Boden/Wasser) dringen in den Beton ein und reagieren mit den Aluminatphasen (Monosulfat, unhydratisiertes C3A) zu Ettringit (Volumenzunahme, Rissbildung); bei tiefen Temperaturen und Carbonatangebot kann zusätzlich Thaumasit aus den C-S-H-Phasen entstehen, was zur Entfestigung des Zementsteins führt.. Diese Reaktion ist mit einer starken Volumenvergrößerung verbunden und führt zu Rissbildung und Abplatzungen.
            </p>

            <h4 className="font-bold text-shiraz mt-4">Alkali-Kieselsäure-Reaktion (AKR)</h4>
            <p className="text-sm text-text-main/80">
              Reaktion zwischen Alkalien (Na, K) aus dem Porenwasser und amorpher Kieselsäure aus der Gesteinskörnung. Es entsteht ein quellfähiges Alkali-Kieselgel.
            </p>
            <div className="space-y-4 mt-2">
              <Slider 
                label="Alkaligehalt (Na₂O-Äquivalent)"
                info="Alkaligehalt (Na₂O-Äquivalent) Parameter"
                min={1.0} max={5.0} step={0.1}
                value={alkaliContent} unit="kg/m³"
                onChange={(e) => setAlkaliContent(Number(e.target.value))}
              />
              <Slider 
                label="Feuchtigkeit"
                info="Feuchtigkeit Parameter"
                min={50} max={100} step={5}
                value={moisture} unit="%"
                onChange={(e) => setMoisture(Number(e.target.value))}
              />
            </div>
            <div className="h-[200px] relative mt-4">
              <Line 
                data={akrData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { title: { display: true, text: 'Zeit (Jahre)' } },
                    y: { title: { display: true, text: 'Dehnung (mm/m)' }, min: 0, max: 5 }
                  },
                  plugins: { legend: { position: 'top' } }
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'salze' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Herkunft und Arten</h3>
            <p className="text-sm text-text-main/80">
              Leicht lösliche Salze werden durch kapillaren Wassertransport in das Bauteil (oft Mauerwerk) transportiert. Verdunstet das Wasser an der Oberfläche, reichern sich die Salze an.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><strong>Chloride (Tausalz, Meerwasser):</strong> Sehr gut wasserlöslich und extrem hygroskopisch. Halten das Mauerwerk dauerfeucht und verursachen schwere Bewehrungskorrosion in Stahlbeton.</li>
              <li><strong>Nitrate (Fäkalien, Landwirtschaft):</strong> Ebenfalls stark hygroskopisch. Treten häufig in landwirtschaftlichen Gebäuden oder an alten Stallungen auf (Mauersalpeter).</li>
              <li><strong>Sulfate (Gips, saurer Regen, Boden):</strong> Weniger hygroskopisch, verursachen aber beim Auskristallisieren (z.B. Umwandlung von Thenardit in Mirabilit) enorme Volumenvergrößerungen.</li>
            </ul>

            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white flex flex-col items-center">
              <h4 className="text-sm font-bold mb-4 text-center">Kristallisationsdruck in der Pore</h4>
              <div className="relative w-32 h-32 bg-home-grau/20 rounded-full flex items-center justify-center overflow-hidden border-4 border-home-grau">
                <div className="absolute inset-0 border-[8px] border-home-grau rounded-full"></div>
                <div className="w-20 h-20 bg-white/90 border-2 border-blue-300 rotate-45 flex items-center justify-center shadow-lg relative">
                   <ArrowRight className="text-torch-red absolute -top-5 -right-5 rotate-[-45deg]" size={20}/>
                   <ArrowRight className="text-torch-red absolute -bottom-5 -left-5 rotate-[135deg]" size={20}/>
                   <span className="text-[10px] font-bold text-blue-800 -rotate-45">Salzkristall</span>
                </div>
              </div>
              <span className="text-xs mt-4 text-text-main/80 font-medium text-center">Wachsender Salzkristall sprengt das Gefüge</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Schädigungsmechanismen & Sanierung</h3>
            <p className="text-sm text-text-main/80">
              Die Schädigung erfolgt primär durch physikalische Prozesse beim Phasenübergang der Salze.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><strong>Kristallisationsdruck:</strong> Salze kristallisieren aus einer übersättigten Lösung in den Poren aus. Der wachsende Kristall sprengt die Porenwandungen (Ausblühungen, Abplatzungen).</li>
              <li><strong>Hydratationsdruck:</strong> Salze nehmen Kristallwasser auf und ändern ihre Struktur (Volumenzunahme).</li>
              <li><strong>Hygroskopizität:</strong> Salze nehmen Feuchtigkeit aus der Luft auf. Die Wand wirkt nass, selbst ohne aufsteigende Feuchte.</li>
            </ul>
            <div className="mt-2 p-4 bg-off-white rounded-xl border border-home-grau/30">
              <h4 className="font-bold text-shiraz text-sm mb-2">Sanierungsansätze</h4>
              <p className="text-sm text-text-main/80">
                <strong>Sanierputzsysteme (WTA):</strong> Besitzen eine sehr hohe Porosität und sind wasserabweisend eingestellt. Das Wasser verdunstet <em>im</em> Putz, die Salze kristallisieren schadlos in den großen Poren aus, die Oberfläche bleibt trocken und salzfrei.<br/>
                <strong>Opferputz:</strong> Saugt Salze auf und wird nach Sättigung abgeschlagen und erneuert.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'oberflaechenschutz' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Hydrophobierung</h3>
            <p className="text-sm text-text-main/80">
              Eine wasserabweisende (hydrophobe) Ausrüstung der Baustoffoberfläche, ohne die Poren zu verschließen. Die Dampfdurchlässigkeit bleibt erhalten.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
              <li><strong>Wirkstoffe:</strong> Silane, Siloxane, Siliconharze.</li>
              <li><strong>Wirkprinzip:</strong> Die Moleküle dringen in die Kapillarporen ein und reagieren chemisch mit dem Untergrund. Die hydrophoben Alkylreste richten sich nach außen und erhöhen den Randwinkel für Wasser auf &gt; 90°.</li>
              <li><strong>Anwendung:</strong> Schlagregenschutz für Fassaden (Ziegel, Naturstein, Beton), Schutz vor Tausalzeindringen bei Brücken.</li>
            </ul>

            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white flex justify-around items-end h-32">
               <div className="flex flex-col items-center">
                 <div className="relative w-20 h-10 border-b-4 border-home-grau flex items-end justify-center">
                    <div className="w-16 h-4 bg-blue-400/80 rounded-t-full" style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}></div>
                 </div>
                 <span className="text-[10px] mt-2 font-bold text-text-main">Unbehandelt (&lt; 90°)</span>
               </div>
               <div className="flex flex-col items-center">
                 <div className="relative w-20 h-10 border-b-4 border-home-grau flex items-end justify-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full mb-[-4px] shadow-sm"></div>
                 </div>
                 <span className="text-[10px] mt-2 font-bold text-text-main">Hydrophobiert (&gt; 90°)</span>
               </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Imprägnierung</h3>
            <p className="text-sm text-text-main/80">
              Porenfüllende Behandlung zur Verfestigung der Randzone und Reduzierung der Kapillarität. Die Oberfläche wird teilweise verschlossen.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
              <li><strong>Wirkstoffe:</strong> Niedrigviskose Epoxidharze (EP), Polyurethane (PU), Acrylate.</li>
              <li><strong>Wirkprinzip:</strong> Das Harz dringt in die Poren ein und härtet dort aus. Die Festigkeit der Randzone steigt, die Saugfähigkeit sinkt.</li>
              <li><strong>Anwendung:</strong> Staubbindung auf Industrieböden, Vorbereitung für Beschichtungen (Grundierung).</li>
            </ul>
            
            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white flex justify-center items-center h-32">
              <div className="relative w-40 h-20 border border-home-grau bg-home-grau/10 flex flex-col justify-end overflow-hidden">
                <div className="absolute top-0 w-full h-[2px] bg-home-grau"></div>
                <div className="flex justify-around w-full items-start h-full pt-[2px]">
                  <div className="w-3 h-12 bg-amber-500/80 rounded-b-full"></div>
                  <div className="w-2 h-8 bg-amber-500/80 rounded-b-full mt-1"></div>
                  <div className="w-4 h-16 bg-amber-500/80 rounded-b-full"></div>
                  <div className="w-2 h-10 bg-amber-500/80 rounded-b-full mt-2"></div>
                </div>
                <span className="absolute bottom-1 left-2 text-[10px] font-bold text-text-main/60">Beton/Estrich</span>
                <span className="absolute top-2 right-2 text-[10px] font-bold text-amber-700 bg-white/90 px-1 py-0.5 rounded shadow-sm">Harz in Poren</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Beschichtung</h3>
            <p className="text-sm text-text-main/80">
              Schichtbildender Auftrag auf die Baustoffoberfläche. Poren werden vollständig verschlossen, die Oberfläche wird mechanisch und chemisch geschützt.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2">
              <li><strong>Wirkstoffe:</strong> Epoxidharze (EP) für hohe mechanische/chemische Belastung, Polyurethane (PU) für rissüberbrückende Eigenschaften, Acrylate für Witterungsschutz.</li>
              <li><strong>Wirkprinzip:</strong> Bildung eines durchgehenden, dichten Polymerfilms auf der Oberfläche.</li>
              <li><strong>Anwendung:</strong> Parkhausbeschichtungen, Industrieböden, WHG-Dichtflächen (Gewässerschutz).</li>
            </ul>
            
            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white flex justify-center items-center h-32">
              <div className="relative w-40 h-20 border border-home-grau bg-home-grau/10 flex flex-col justify-end overflow-hidden rounded-t-[4px]">
                <div className="absolute top-0 w-full h-4 bg-emerald-500/80 border-b-2 border-emerald-700/50 shadow-sm z-10 flex items-center justify-center">
                   <span className="text-[9px] font-bold text-white drop-shadow-md">Geschlossener Film</span>
                </div>
                <div className="flex justify-around w-full items-start h-full pt-4">
                  <div className="w-3 h-12 border-l border-r border-b border-home-grau/30 rounded-b-full bg-white/50"></div>
                  <div className="w-2 h-8 border-l border-r border-b border-home-grau/30 rounded-b-full bg-white/50 mt-1"></div>
                  <div className="w-4 h-16 border-l border-r border-b border-home-grau/30 rounded-b-full bg-white/50"></div>
                  <div className="w-2 h-6 border-l border-r border-b border-home-grau/30 rounded-b-full bg-white/50 mt-2"></div>
                </div>
                 <span className="absolute bottom-1 left-2 text-[10px] font-bold text-text-main/60">Beton/Estrich</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'korrosionsschutz' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Korrosionsschutz für Metalle</h3>
            <p className="text-sm text-text-main/80">
              Der Schutz von Stahl vor elektrochemischer Korrosion (Rostbildung) ist essenziell für die Dauerhaftigkeit von Tragwerken.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><strong>Bimetallkorrosion (Kontaktkorrosion) vermeiden:</strong> Direkten Kontakt unterschiedlicher Metalle (z.B. Kupfer und verzinkter Stahl) in Gegenwart eines Elektrolyten (Wasser) durch isolierende Zwischenlagen (Neopren/EPDM) verhindern. Das unedlere Metall opfert sich sonst auf (galvanisches Element).</li>
              <li><strong>Passiver Korrosionsschutz:</strong> Trennung des Metalls vom korrosiven Medium (Sauerstoff, Wasser) durch Lacke, Epoxidharz- oder Polyurethanbeschichtungen.</li>
              <li><strong>Metallischer Überzug (Feuerverzinken, DIN EN ISO 1461): Zink schützt als Barriere und zusätzlich kathodisch, da es unedler als Eisen ist; an kleinen Fehlstellen korrodiert zuerst das Zink und schützt den Stahl.:</strong> Überzug mit Zink. Zink ist unedler als Eisen und wirkt als <strong>Opferanode</strong>. Selbst bei kleinen Kratzern bis auf den Stahl korrodiert zuerst das Zink in der Umgebung und schützt den Stahl kathodisch.</li>
            </ul>

            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-stone-50">
               <h4 className="font-bold text-sm text-text-main mb-2">Elektrochemische Spannungsreihe</h4>
               <p className="text-xs text-text-main/80 mb-2">Metalle sind nach ihrem Standardpotenzial ordnbar. Je negativer (unedler) ein Metall ist, desto eher gibt es Elektronen ab (oxidiert/korrodiert). Wenn zwei Metalle leitend verbunden und nass sind, wird das unedlere zerstört.</p>
               <div className="flex flex-col gap-1 text-xs">
                 <div className="flex justify-between items-center bg-gray-200 p-1.5 rounded text-gray-800"><span className="font-bold">Magnesium (Mg)</span><span>-2,36 V (Verzehranode)</span></div>
                 <div className="flex justify-between items-center bg-gray-300 p-1.5 rounded text-gray-800"><span className="font-bold">Aluminium (Al)</span><span>-1,66 V</span></div>
                 <div className="flex justify-between items-center bg-slate-300 p-1.5 rounded text-slate-800"><span className="font-bold">Zink (Zn)</span><span>-0,76 V (Verzinkung)</span></div>
                 <div className="flex justify-between items-center bg-zinc-400 p-1.5 rounded text-white"><span className="font-bold">Eisen (Fe)</span><span>-0,44 V (Baustahl)</span></div>
                 <div className="flex justify-between items-center bg-orange-200 p-1.5 rounded text-orange-900 border border-orange-300"><span className="font-bold">Kupfer (Cu)</span><span>+0,34 V (sehr edel, greift unedle an)</span></div>
               </div>
               <p className="text-xs text-shiraz mt-2 font-bold flex items-center gap-1"><AlertTriangle size={12}/> Regel: In Fließrichtung des Wassers niemals edlere Metalle vor unedleren verbauen (z.B. Kupferrinne über Zinkrohr = Lochfraß im Zink).</p>
            </div>

            <div className="mt-6 border border-home-grau/30 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-sm text-text-main mb-4 text-center">Elektrochemische Korrosionszelle</h4>
              <div className="flex items-center justify-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-torch-red/20 border-2 border-torch-red flex items-center justify-center text-torch-red font-bold text-xs">Anode</div>
                  <span className="text-[10px] mt-1 text-center leading-tight">Fe → Fe²⁺ + 2e⁻<br/>(Auflösung)</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-shiraz font-bold text-[10px]">
                    <span>2e⁻</span>
                    <ArrowRight size={14} />
                  </div>
                  <div className="h-6 w-20 border-b-4 border-home-grau mt-1 relative">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-blue-500 font-bold flex items-center gap-1 whitespace-nowrap">
                      <Droplets size={10} /> Elektrolyt
                    </div>
                  </div>
                  <div className="text-[10px] text-text-main/60 mt-1">Stahl</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-700 font-bold text-xs">Kathode</div>
                  <span className="text-[10px] mt-1 text-center leading-tight">½O₂ + H₂O + 2e⁻ → 2OH⁻<br/>(Reduktion)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Korrosionsschutz im Stahlbeton</h3>
            <p className="text-sm text-text-main/80">
              Der primäre Schutz der Bewehrung ist die hohe Alkalität des Betons (Passivierung). Geht dieser verloren (Karbonatisierung, Chloride), sind Zusatzmaßnahmen nötig.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><strong>Kathodischer Korrosionsschutz (KKS):</strong> Anlegen einer Fremdspannung über Titan-Netzanoden, um die Bewehrung zur Kathode zu machen. Stoppt aktive Chloridkorrosion ohne kompletten Betonaustausch.</li>
              <li><strong>Korrosionsinhibitoren:</strong> Chemische Zusätze (oft auf Amin-Basis), die auf die Stahloberfläche migrieren und dort einen monomolekularen Schutzfilm bilden.</li>
              <li><strong>Alternative Bewehrung:</strong> Einsatz von epoxidharzbeschichtetem Stahl, nichtrostendem Stahl (Edelstahl) oder nicht-metallischer Bewehrung (Carbon, Glasfaser).</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Holzschutz</h3>
            <p className="text-sm text-text-main/80">
              Schutz von Holz vor biotischen (Pilze, Insekten) und abiotischen (UV-Strahlung, Feuchtigkeit) Einflüssen.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><strong>Baulicher Holzschutz (Vorrangig!):</strong> Konstruktive Maßnahmen, um Holz trocken zu halten (Dachüberstände, Tropfkanten, Vermeidung von Erdkontakt). Holzfeuchte dauerhaft &lt; 20% halten.</li>
              <li><strong>Chemischer Holzschutz:</strong> Einbringen von bioziden Wirkstoffen (Fungizide, Insektizide) durch Streichen, Tauchen oder Kesseldruckimprägnierung (KDI). Wegen Umwelt- und Gesundheitsrisiken nur anwenden, wenn baulicher Schutz nicht ausreicht.</li>
              <li><strong>Holzmodifizierung:</strong> Veränderung der Zellwandstruktur ohne Biozide, z.B. durch thermische Behandlung (Thermoholz) oder Acetylierung. Erhöht die Dauerhaftigkeit.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'kleben_dichten' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Einleitung / Definitionsblock */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2 flex items-center gap-2">
              <Paperclip className="text-shiraz h-5 w-5" /> Grundlagen des Klebens &amp; Dichtens
            </h3>
            <p className="text-sm text-text-main/80 leading-relaxed">
              Kleben und Dichten sind elementare Verbindungstechniken im modernen Bauwesen. Während beim <strong>Kleben</strong> die kraft- und formschlüssige Übertragung statischer oder dynamischer Lasten im Vordergrund steht, dient das <strong>Dichten</strong> primär dem dauerhaften Verschluss von Fugen gegen Medienübertritt (Wasser, Wasserdampf, Luft, Schall, Schadstoffe) bei gleichzeitiger Aufnahme von Bauteilbewegungen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20">
                <span className="font-bold text-sm text-shiraz block mb-1">Kleben (DIN EN 923)</span>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Verbindung zweier Fügeteile (Substrate) durch einen nichtmetallischen Werkstoff. Die Kraftübertragung erfolgt über Flächenkräfte ohne Schwächung des Bauteilquerschnitts (im Gegensatz zu Bohrungen bei Schrauben/Dübeln) und gewährleistet eine gleichmäßige Spannungsverteilung.
                </p>
              </div>
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20">
                <span className="font-bold text-sm text-shiraz block mb-1">Dichten (DIN EN 15651 / DIN 18540)</span>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Schließen von Fugen, Rissen oder Bauteilanschlüssen mit plastischen, plastoelastischen oder hochelastischen Werkstoffen. Ziel ist der dauerhafte Funktionserhalt trotz thermisch oder mechanisch bedingter Fugenbewegungen (Dehnung, Stauchung, Scherung).
                </p>
              </div>
            </div>
          </div>

          {/* 1. Adhäsion, Kohäsion & Benetzung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">
                Adhäsion &amp; Kohäsion
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Die Tragfähigkeit jeder Kleb- und Dichtstofffuge basiert auf dem Zusammenspiel zweier physikalisch-chemischer Kräfte:
              </p>
              <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
                <li>
                  <strong>Adhäsion (Grenzflächenhaftung):</strong> Haftkräfte zwischen der Klebstoffschicht und der Substratoberfläche. Sie resultieren aus mechanischer Verkrallung in Mikrorauheiten, zwischenmolekularen Kräften (Van-der-Waals-Kräfte, Dipol-Dipol-Kräfte, Wasserstoffbrücken) sowie chemischen kovalenten Bindungen (z. B. durch Silan-Haftvermittler/Primer).
                </li>
                <li>
                  <strong>Kohäsion (Innere Festigkeit):</strong> Innere Festigkeit des Kleb- bzw. Dichtstoffs selbst. Sie wird durch molekulare Kettenverschlingungen, zwischenmolekulare Anziehung und Polymerisations- bzw. Vernetzungsdichte bestimmt.
                </li>
              </ul>

              <div className="mt-2 p-3.5 bg-[#fcf8f2] rounded-xl border border-stone-200/50">
                <span className="font-bold text-[#A3113E] uppercase tracking-wide text-[10px] mb-1 font-mono block">Bruchmechanische Versagensbilder</span>
                <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/30">
                    <span className="font-bold text-emerald-700 block text-xs">Kohäsionsbruch (CF):</span>
                    <p className="text-[11px] text-text-main/70 mt-1">Bruch im Inneren des Klebstoffs. Beweis für optimale Grenzflächenadhäsion (<InlineMath math="\text{Adhäsion} > \text{Kohäsion}" />). Qualitätsziel!</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-home-grau/30">
                    <span className="font-bold text-rose-700 block text-xs">Adhäsionsbruch (AF):</span>
                    <p className="text-[11px] text-text-main/70 mt-1">Ablösung an der Grenzfläche zum Untergrund. Indiz für mangelhafte Untergrundvorbereitung, Trennmittel oder fehlenden Primer.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">
                Oberflächenenergie &amp; Benetzbarkeit
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Voraussetzung für Adhäsion ist die molekulare Annäherung (&lt; 0,5 nm). Ein Kleb- oder Dichtstoff kann nur haften, wenn er die Substratoberfläche vollständig benetzt.
              </p>
              
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 text-center">
                <span className="font-bold text-xs text-text-main/80 block mb-1">Youngsche Gleichung des Kontaktwinkels:</span>
                <BlockMath math="\sigma_{S} = \sigma_{SL} + \sigma_{L} \cdot \cos(\theta)" />
                <span className="text-[11px] text-text-main/60 block mt-1">
                  <InlineMath math="\sigma_S" />: freie Oberflächenenergie des Substrats | <InlineMath math="\sigma_L" />: Oberflächenspannung des Klebstoffs | <InlineMath math="\theta" />: Kontaktwinkel
                </span>
              </div>

              <div className="space-y-2 text-xs text-text-main/80">
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-emerald-700 block mb-1">Gute Benetzung (<InlineMath math="\theta < 90^\circ" /> bzw. <InlineMath math="\theta \to 0^\circ" />):</span>
                  <p className="leading-relaxed">
                    Tritt auf, wenn die Oberflächenenergie des Feststoffs höher ist als die Oberflächenspannung des flüssigen Klebers (<InlineMath math="\sigma_S > \sigma_L" />). Typisch für polare Substrate: Metalle, Glas, Keramik, Beton.
                  </p>
                </div>
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-rose-700 block mb-1">Schlechte / Keine Benetzung (<InlineMath math="\theta \ge 90^\circ" />):</span>
                  <p className="leading-relaxed">
                    Niedrigenergetische, unpolare Kunststoffe (PE, PP, PTFE) lassen Flüssigkeiten abperlen. Ohne Vorbehandlung (Beflammen, Koronaentladung, spezielle Primer) ist kein Klebeverbund möglich.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Erhärtungsmechanismen & Polymerchemie */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">
              Erhärtungsmechanismen von Kleb- &amp; Dichtstoffen
            </h3>
            <p className="text-sm text-text-main/80">
              Der Übergang vom verarbeitungsfähigen (flüssigen/pastösen) Zustand in den festen Endzustand erfolgt physikalisch oder chemisch vernetzend:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white flex flex-col gap-2">
                <span className="font-bold text-sm text-shiraz">A. Physikalisch abbindend (ohne chemische Reaktion)</span>
                <ul className="list-disc list-inside text-xs text-text-main/80 space-y-2 mt-1">
                  <li>
                    <strong>Lösemittel- &amp; Dispersionsklebstoffe:</strong> Erhärtung durch Verdunsten des Lösemittels oder Verdampfen/Wegschlagen des Wassers (z. B. PVAc-Holzleim DIN EN 204, Acrylat-Dichtstoffe). Begleitet von Volumenschwund!
                  </li>
                  <li>
                    <strong>Schmelzklebstoffe (Hotmelts):</strong> 100% Festkörper; thermoplastisches Aufschmelzen und rasche Verfestigung bei Abkühlung.
                  </li>
                  <li>
                    <strong>Kontaktklebstoffe:</strong> Beidseitiger Auftrag, Ablüften bis zur Klebfreie, Fügen unter hohem Druck (Soforthaftung).
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white flex flex-col gap-2">
                <span className="font-bold text-sm text-shiraz">B. Chemisch reagierend (Polymerisation, Polyaddition, Polykondensation)</span>
                <ul className="list-disc list-inside text-xs text-text-main/80 space-y-2 mt-1">
                  <li>
                    <strong>1K-feuchtigkeitsvernetzend:</strong> Reagieren mit Luftfeuchte oder Substratfeuchte (z. B. 1K-Polyurethan, Silikon, MS-Polymer/SMP). Vernetzung schreitet von außen nach innen voran (ca. 2–3 mm/24h).
                  </li>
                  <li>
                    <strong>2-Komponenten-Systeme (2K):</strong> Harz + Härter (z. B. 2K-Epoxidharz EP, 2K-Polyurethan PUR). Härten exotherm und volumenunabhängig durch (kein Feuchtigkeitszutritt erforderlich, schwindungsarm).
                  </li>
                  <li>
                    <strong>Mineralisch hydraulisch:</strong> Zementäre Fliesenkleber (Klasse C nach DIN EN 12004), oft polymermodifiziert (Kunststoffdispersion).
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Wichtigste bauchemische Polymer- & Dichtstoffbasen */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">
              Haupt-Polymerklassen im Bauwesen im Vergleich
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/40 bg-off-white">
                    <th className="p-3 font-bold text-text-main">Basis</th>
                    <th className="p-3 font-bold text-text-main">Chemische Natur</th>
                    <th className="p-3 font-bold text-text-main">Charakteristische Eigenschaften</th>
                    <th className="p-3 font-bold text-text-main">Typische Bau-Anwendungen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz whitespace-nowrap">Silikon (Polysiloxan)</td>
                    <td className="p-3">Anorganisches Si-O-Rückgrat, sauer (Acetat) oder neutral (Oxim/Alkoxy) vernetzend</td>
                    <td className="p-3">Hervorragende UV-, Ozon- &amp; Witterungsbeständigkeit, hochelastisch (bis 25% Dauerstanddehnung), nicht überstreichbar</td>
                    <td className="p-3">Sanitärfugen (fungizid), Glas- &amp; Fassadenbau, Fensteranschluss</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz whitespace-nowrap">Polyurethan (PUR)</td>
                    <td className="p-3">Reaktion von Polyolen mit Isocyanaten (<InlineMath math="-\text{N=C=O}" />)</td>
                    <td className="p-3">Hohe Zug- &amp; Weiterreißfestigkeit, exzellente mechanische Belastbarkeit, feuchtigkeitshärtend oder 2K</td>
                    <td className="p-3">Bodenfugen in Industriehallen (DIN EN 15651-4), Montagekleber, Injektionsharze gegen drückendes Wasser</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz whitespace-nowrap">MS-Polymer / SMP</td>
                    <td className="p-3">Silanmodifizierte Polymere (Polyether-Rückgrat mit endständigen Alkoxysilangruppen)</td>
                    <td className="p-3">Isocyanat- &amp; lösemittelfrei, geruchlos, breites Haftspektrum ohne Primer, überstreichbar, witterungsstabil</td>
                    <td className="p-3">Universelle elastische Montagekleber, Fassaden- und Dehnungsfugen (DIN EN 15651-1), Holzparkettklebstoffe, elastische Verklebungen im Innen- und Außenbereich (Structural Glazing nur mit dafür eigens bauaufsichtlich zugelassenen Silikonsystemen).</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz whitespace-nowrap">Epoxidharz (EP)</td>
                    <td className="p-3">2K-Reaktionsharz (Bisphenol-A/F-Epoxid + Polyamin-Härter)</td>
                    <td className="p-3">Extrem hohe Kohäsions- &amp; Scherfestigkeit, chemikalienbeständig, schwindungsarme Erhärtung, starr/spröde</td>
                    <td className="p-3">Kraftschlüssige Rissverpressung (DIN EN 1504-5), Verankerungen/Schwerlastdübel, CFK-Lamellenverklebung</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz whitespace-nowrap">Acrylat (Dispersion)</td>
                    <td className="p-3">Wässrige Polyacryl-Emulsion, physikalisch wasserverdunstend</td>
                    <td className="p-3">Plastoelastisch (Dehnfähigkeit ca. 7,5–12,5%), geruchsarm, überstreichbar, frostempfindlich bis zur Trocknung</td>
                    <td className="p-3">Innenbereichsfugen (Trockenbau, Deckenanschlüsse, Sockelleisten mit geringer Bewegung)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Fugengeometrie & 3-Flanken-Haftung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">
                Fugendimensionierung &amp; Dreiflankenhaftung
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Elastische Dichtstoffe dürfen sich bei Fugenbewegung frei verformen können. Die Einhaltung bauphysikalischer Konstruktionsregeln ist entscheidend:
              </p>
              
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex flex-col gap-1">
                <span className="font-bold flex items-center gap-1.5 text-rose-900">
                  <AlertTriangle size={15} /> Vermeidung der Dreiflankenhaftung (Schlüsselfehler!)
                </span>
                <p className="leading-relaxed">
                  Haftet der Dichtstoff an beiden Fugenflanken <em>und</em> am Fugenboden (Dreiflankenhaftung), führt eine Dehnung zu unzulässig hohen multiaxialen Spannungsspitzen im Dichtstoffkern. Folge: Abriss an den Flanken oder Längsriss im Dichtstoff.
                </p>
                <p className="font-bold mt-1 text-rose-900">
                  Abhilfe: Einbringen einer geschlossenzelligen PE-Rundschnur (Hinterfüllmaterial) oder eines Antihaft-Trennstreifens am Fugenboden!
                </p>
              </div>

              <div className="text-xs text-text-main/80 space-y-2">
                <h4 className="font-bold text-text-main text-xs">Fugenbreiten-zu-Tiefen-Verhältnis (DIN 18540):</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Für Fugenbreiten <InlineMath math="b \le 10\,\text{mm}" />: <InlineMath math="b : t \approx 1 : 1" /></li>
                  <li>Für Fugenbreiten <InlineMath math="b > 10\,\text{mm}" />: <InlineMath math="b : t \approx 2 : 1" /> (z. B. Breite 20 mm → Tiefe 10 mm)</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">
                Wichtige Normen &amp; Prüfungen
              </h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Zur Qualitätssicherung und Bemessung gelten europäische harmonisierte Normenwerke:
              </p>
              
              <div className="space-y-3 text-xs text-text-main/80">
                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-shiraz block mb-1">DIN EN 15651 – Fugendichtstoffe für nicht tragende Anwendungen</span>
                  <p className="leading-relaxed">
                    Teil 1: Fassadenelemente | Teil 2: Verglasungen | Teil 3: Sanitärbereich | Teil 4: Fußgängerwege &amp; Bodenfugen. Klassifiziert Dichtstoffe nach Dehnfähigkeit (z. B. 25LM = 25% Bewegungsaufnahme, niedriger Zugmodul / Low Modulus).
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-shiraz block mb-1">DIN EN 12004 – Mörtel und Klebstoffe für Fliesen und Platten</span>
                  <p className="leading-relaxed">
                    Klassenkürzel: <strong>C</strong> (zementär), <strong>D</strong> (Dispersionskleber), <strong>R</strong> (Reaktionsharzkleber). Zusatzanforderungen: <strong>1</strong> (Grundklasse), <strong>2</strong> (erhöhte Anforderungen), <strong>T</strong> (abrutschsicher), <strong>E</strong> (verlängerte offene Zeit), <strong>S1 / S2</strong> (Verformbarkeit / Deformierbarkeit).
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                  <span className="font-bold text-shiraz block mb-1">DIN EN 204 – Beanspruchungsgruppen für Holzklebstoffe</span>
                  <p className="leading-relaxed">
                    Klassen D1 bis D4: von trockenem Innenbereich (D1) bis hin zu direkter Bewitterung mit adäquatem Oberflächenschutz (D4).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModuleFooter 
        wikipedia={[
          { title: 'Bauchemie', url: 'https://de.wikipedia.org/wiki/Bauchemie' },
          { title: 'Klebstoff', url: 'https://de.wikipedia.org/wiki/Klebstoff' },
          { title: 'Dichtstoff', url: 'https://de.wikipedia.org/wiki/Dichtstoff' },
          { title: 'Betonzusatzmittel', url: 'https://de.wikipedia.org/wiki/Betonzusatzmittel' },
          { title: 'Oberflächenschutzsystem', url: 'https://de.wikipedia.org/wiki/Oberfl%C3%A4chenschutzsystem' },
          { title: 'Passivierung', url: 'https://de.wikipedia.org/wiki/Passivierung' }
        ]}
        literatur={[
          'Knoblauch, H.; Schneider, U. (2006): Bauchemie (6. Auflage, Werner Verlag / Wolters Kluwer)',
          'Habermann, R. (2020): Kleb- und Dichtstoffe im Bauwesen (Springer Vieweg)',
          'Plank, J. (2018): Bauchemie: Bindemittel, Zusatzmittel, Dauerhaftigkeit (TU München)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 15651-1 bis -4 (Fugendichtstoffe für nicht tragende Anwendungen in Gebäuden)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 12004-1 (Mörtel und Klebstoffe für Fliesen und Platten)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 204 (Klassifizierung von thermoplastischen Holzklebstoffen für nichttragende Anwendungen)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN 18540 (Abdichten von Außenwandfugen im Hochbau mit Fugendichtstoffen)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 934-2 (Zusatzmittel für Beton, Mörtel und Einpressmörtel)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 1504 (Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken)', url: 'https://www.dinmedia.de/' }
        ]}
        formeln={[
          {
            formel: '\\sigma_{S} = \\sigma_{SL} + \\sigma_{L} \\cdot \\cos(\\theta)',
            erklaerung: 'Youngsche Gleichung: Beschreibt das thermodynamische Gleichgewicht an der Dreiphasengrenze Festkörper-Flüssigkeit-Gas zur Bestimmung von Oberflächenenergie und Benetzbarkeit (Kontaktwinkel θ).',
            quelle: 'DIN EN 828 / Oberflächenchemie'
          },
          {
            formel: '\\text{pH} = 14 + \\log_{10}[\\text{OH}^-] \\ge 12.6 \\implies \\text{Fe} + 2\\,\\text{OH}^- \\rightarrow \\text{Fe(OH)}_2 \\rightarrow \\gamma\\text{-FeOOH (Passivschicht)}',
            erklaerung: 'Alkalische Passivierung des Bewehrungsstahls im ungestörten Betonporenwasser (hohe Konzentration an Ca(OH)2 und Alkali-Ionen verhindert Korrosion).',
            quelle: 'Bauchemie / Elektrochemie'
          },
          {
            formel: '\\text{Ca(OH)}_2 + \\text{CO}_2 \\xrightarrow{\\text{Feuchte}} \\text{CaCO}_3 + \\text{H}_2\\text{O} \\quad (\\text{pH sinkt auf } \\approx 9)',
            erklaerung: 'Karbonatisierungsreaktion des Zementsteins: Führt zur Depassivierung des Stahls und initiiert Bewehrungskorrosion bei Zutritt von Feuchtigkeit und Sauerstoff.',
            quelle: 'DIN EN 206 / DAfStb'
          }
        ]}
      />
    </div>
  );
} 