import React, { useState } from 'react';
import { Layers, Flame, Factory, FlaskConical } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import Zementchemie from './Zementchemie';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BlockMath, InlineMath } from 'react-katex';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Bindemittel() {
  const [activeTab, setActiveTab] = useState<'herstellung' | 'zement' | 'zementchemie_bogue' | 'zusatzstoffe'>('herstellung');

  const hydratationData = {
    labels: [0, 1, 3, 7, 14, 28],
    datasets: [
      {
        label: 'C3A (Aluminat)',
        data: [0, 600, 750, 820, 850, 900],
        borderColor: '#A3113E',
        tension: 0.4
      },
      {
        label: 'C3S (Alit)',
        data: [0, 150, 300, 400, 450, 500],
        borderColor: '#475569',
        tension: 0.4
      },
      {
        label: 'C4AF (Ferrit)',
        data: [0, 100, 150, 200, 250, 300],
        borderColor: '#64748b',
        tension: 0.4
      },
      {
        label: 'C2S (Belit)',
        data: [0, 10, 30, 50, 100, 200],
        borderColor: '#475569',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Bindemittel & Zusatzstoffe
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Bindemittel wie Zement sind hydraulisch erhärtende Baustoffe, die zusammen mit Wasser ein festes Gestein (Zementstein) bilden. 
            Durch die Zugabe von Betonzusatzstoffen lassen sich die Eigenschaften im Frisch- und Festbeton gezielt steuern und optimieren.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'herstellung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('herstellung')}
          >
            <Factory size={16} /> Herstellung &amp; Eigenschaften
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zement' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zement')}
          >
            <Layers size={16} /> Zement &amp; Hydratation
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zementchemie_bogue' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zementchemie_bogue')}
          >
            <Flame size={16} /> Zementchemie
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'zusatzstoffe' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('zusatzstoffe')}
          >
            <FlaskConical size={16} /> Betonzusatzstoffe
          </button>
        </div>

      {activeTab === 'herstellung' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Herstellung von Zement</h3>
            <p className="text-sm text-text-main/80">
              Die Herstellung von Zement ist ein energie- und ressourcenintensiver Prozess, bestehend aus mehreren Phasen:
            </p>
            <ol className="list-decimal list-inside text-sm text-text-main/80 space-y-3">
              <li><strong>Rohstoffgewinnung & Aufbereitung:</strong> Abbau von Kalkstein (CaCO₃) und Ton/Mergel, anschließend Brechen und Mahlen zum Rohmehl.</li>
              <li><strong>Brennen:</strong> Erhitzen im Drehrohrofen auf ca. 1.450 °C (Sintern). Kalkstein entsäuert (CO₂ wird frei), die Mineralien verschmelzen chemisch zum Zementklinker.</li>
              <li><strong>Mahlen:</strong> Der Klinker wird stark abgekühlt und anschließend zusammen mit Gips (als Erstarrungsverzögerer) sowie möglichen weiteren Bestandteilen (Hüttensand, Flugasche) zu feinem Zement vermahlen.</li>
            </ol>
            <div className="bg-torch-red/10 border border-torch-red/20 p-4 rounded-xl mt-2 text-sm text-text-main/90">
              <strong>CO₂-Emissionen:</strong> Die Zementherstellung verursacht hohe Emissionen, teilweise brennstoffbedingt, aber überwiegend prozessbedingt durch das Entsäuern des Kalksteins (CaCO₃ → CaO + CO₂).
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Eigenschaften von Bindemitteln</h3>
            <p className="text-sm text-text-main/80">
              Zement ist ein hydraulisches Bindemittel, was bedeutet, dass er sowohl an der Luft als auch unter Wasser erhärtet und nach dem Erhärten wasserbeständig ist.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2 mt-2">
              <li><strong>Hydraulische Eigenschaft:</strong> Eigenständige Erhärtung bei Anmischen mit Wasser.</li>
              <li><strong>Mahlfeinheit:</strong> Je feiner der Zement gemahlen ist, desto schneller hydratisiert er und desto höher ist die Frühfestigkeit.</li>
              <li><strong>Dichte:</strong> Portlandzement hat eine Reindichte von ca. 3,1 bis 3,2 kg/dm³. Bei zementären Zusatzstoffen wie Flugasche oder Hüttensand liegt diese abweichend (ca. 2,2 bis 2,9 kg/dm³).</li>
              <li><strong>Hydratationswärme:</strong> Durch die exotherme Reaktion entsteht Wärme, die bei massigen Bauteilen problematisch sein kann, aber beim Winterbau nützlich ist.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'zement' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Zementklinkerphasen</h3>
            <p className="text-sm text-text-main/80">
              Portlandzementklinker besteht hauptsächlich aus vier mineralogischen Phasen (Zementchemische Kurzschreibweise: C=CaO, S=SiO₂, A=Al₂O₃, F=Fe₂O₃, H=H₂O):
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-3">
              <li><strong>Alit (<InlineMath math="C_3S" />, Tricalciumsilicat):</strong> 50-70%. Reagiert schnell, maßgeblich für die frühe und späte Festigkeitsentwicklung. Hohe Hydratationswärme (ca. 500 J/g).</li>
              <li><strong>Belit (<InlineMath math="C_2S" />, Dicalciumsilicat):</strong> 15-30%. Reagiert langsam, trägt zur späten Festigkeit (nach 28 Tagen) bei. Geringe Hydratationswärme (ca. 250 J/g).</li>
              <li><strong>Aluminat (<InlineMath math="C_3A" />, Tricalciumaluminat):</strong> 5-10%. Reagiert extrem schnell (Flash-Set), erfordert Sulfatzugabe (Gips/Anhydrit) zur Verzögerung. Anfällig für Sulfatangriff. Sehr hohe Hydratationswärme (ca. 1350 J/g).</li>
              <li><strong>Ferrit (<InlineMath math="C_4AF" />, Tetracalciumaluminatferrit):</strong> 5-15%. Geringer Beitrag zur Festigkeit, wirkt als Flussmittel beim Brennen, gibt dem Zement die graue Farbe.</li>
            </ul>

            <div className="mt-4 border border-home-grau/30 rounded-xl p-4 bg-off-white">
              <h4 className="font-bold text-sm text-text-main mb-2">Wärmeentwicklung der Klinkerphasen</h4>
              <div className="h-48 w-full">
                <Line 
                  id="hydratation-chart"
                  data={hydratationData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { title: { display: true, text: 'Hydratationswärme (J/g)' } },
                      x: { title: { display: true, text: 'Zeit (Tage)' } }
                    },
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }
                  }} 
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Hydratation & Gefügebildung</h3>
            <p className="text-sm text-text-main/80">
              Die Erhärtung des Zements beruht auf der exothermen Reaktion der Klinkerphasen mit Wasser (Hydratation). Dabei entstehen neue, festigkeitsbildende Kristalle.
            </p>
            <div className="bg-off-white p-4 rounded-lg border border-home-grau/30">
              <p className="text-xs font-bold text-text-main mb-2">Beispiel: Hydratation von Alit</p>
              <BlockMath math="2 C_3S + 6 H \rightarrow C_3S_2H_3 + 3 CH" />
              <p className="text-xs text-text-main/80 mt-2">
                Tricalciumsilicat + Wasser → C-S-H-Gel + Calciumhydroxid (Portlandit)
              </p>
            </div>
            <ul className="list-disc list-inside text-sm text-text-main/80 space-y-2 mt-2">
              <li><strong>C-S-H-Phasen (Calciumsilicathydrate):</strong> Bilden ein dichtes, amorphes bis mikrokristallines Netzwerk. Sie sind der Hauptträger der Festigkeit (ca. 60-70% des Volumens).</li>
              <li><strong>Portlandit (<InlineMath math="Ca(OH)_2" />):</strong> Großkristallin, trägt kaum zur Festigkeit bei, sorgt aber für den hohen pH-Wert (Alkalidepot).</li>
              <li><strong>Ettringit (AFt-Phase):</strong> Entsteht früh aus der Reaktion von <InlineMath math="C_3A" /> mit Sulfat. Verhindert das sofortige Erstarren. Nadelige Kristalle.</li>
              <li><strong>Monosulfat (AFm-Phase):</strong> Entsteht später, wenn das Sulfat aufgebraucht ist, durch Umwandlung von Ettringit. Bei erneutem Sulfatangriff von außen kann sich wieder Ettringit bilden (sekundäre Ettringitbildung), was zu Treiberscheinungen führt.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'zementchemie_bogue' && (
        <div className="animate-in fade-in duration-300">
          <Zementchemie />
        </div>
      )}

      {activeTab === 'zusatzstoffe' && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          {/* Classification & Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-extrabold mb-1">
                Typ I
              </div>
              <h3 className="font-bold text-text-main text-lg">Inerte Zusatzstoffe (Typ I)</h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Diese Stoffe nehmen chemisch nahezu nicht am Hydratationsprozess teil. Sie wirken primär physikalisch über ihren Füllereffekt und stellen Kristallisationskeime bereit.
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/10 text-xs text-text-main/70 mt-auto">
                <strong>Typische Vertreter:</strong> Kalksteinmehl, Quarzmehl, Farbpigmente (z.B. Eisenoxid-Pigmente).
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-extrabold mb-1">
                Typ II (latent)
              </div>
              <h3 className="font-bold text-text-main text-lg">Latent-hydraulische Stoffe</h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Besitzen ein eigenes, eigenständiges hydraulisches Festigkeitspotenzial, reagieren allein aber extrem träge. Sie benötigen einen chemischen Anreger (Aktivator wie Portlandit), um zu hydratisieren.
              </p>
              <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50 text-xs text-text-main/70 mt-auto">
                <strong>Typische Vertreter:</strong> Hüttensand (gemahlene Hochofenschlacke / GGBS).
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 font-extrabold mb-1">
                Typ II (puzzolanisch)
              </div>
              <h3 className="font-bold text-text-main text-lg">Puzzolanische Stoffe</h3>
              <p className="text-sm text-text-main/80 leading-relaxed">
                Sind selbständig nicht hydraulisch erhartend. Sie können jedoch bei Anwesenheit von Feuchtigkeit das freigesetzte Calciumhydroxid (<InlineMath math="Ca(OH)_2" />) chemisch binden und stabile C-S-H-Phasen aufbauen.
              </p>
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100/55 text-xs text-text-main/70 mt-auto">
                <strong>Typische Vertreter:</strong> Steinkohlenflugasche, Silikastaub (Microsilica), Trass, Metakaolin.
              </div>
            </div>
          </div>

          {/* Deep Dive Chemical Reactions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
            <h3 className="text-xl font-bold text-text-main border-b border-home-grau/30 pb-3">Chemisches Reaktionsverhalten &amp; Reaktionsmechanismen</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pozzolanic Reaction Details */}
              <div className="space-y-4">
                <div className="bg-amber-50/40 p-5 rounded-xl border border-amber-200/55 h-full flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main text-base mb-2 text-amber-900">1. Die Puzzolanische Reaktion (Typ II)</h4>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                      Bei der primären Hydratation des Portlandzements (insbes. Alit <InlineMath math="C_3S" /> und Belit <InlineMath math="C_2S" />) entsteht als Nebenprodukt kristallines Calciumhydroxid (<InlineMath math="Ca(OH)_2" />, auch Portlandit oder <InlineMath math="CH" /> genannt). Portlandit ist sehr gut wasserlöslich, besitzt praktisch keine mechenische Bindekraft und bildet physikalisch-chemische Schwachstellen im Betongefüge (vor allem am Interface zur Gesteinskörnung - Interfacial Transition Zone, ITZ).
                    </p>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-4 font-normal">
                      Puzzolanische Zusatzstoffe wie <strong>Flugasche</strong> oder <strong>Silikastaub</strong> (reich an amorphem, reaktivem Siliziumdioxid <InlineMath math="SiO_2" /> und Aluminiumoxid <InlineMath math="Al_2O_3" />) reagieren im alkalischen Milieu der Porenlösung schleichend mit diesem Portlandit zu unlöslichen, festigkeitsbildenden Hydratphasen:
                    </p>
                    
                    <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 mb-3 shadow-2xs">
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-700 block mb-1">A) Kieselsäure-Reaktion (Zusätzliche C-S-H Genese):</span>
                      <BlockMath math="\text{SiO}_2 + \text{Ca(OH)}_2 + \text{H}_2\text{O} \rightarrow \text{C-S-H} \ (x\text{CaO} \cdot y\text{SiO}_2 \cdot z\text{H}_2\text{O})" />
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 shadow-2xs">
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-700 block mb-1">B) Tonerde-Reaktion (Zusätzliche C-A-H Genese):</span>
                      <BlockMath math="\text{Al}_2\text{O}_3 + \text{Ca(OH)}_2 + \text{H}_2\text{O} \rightarrow \text{C-A-H} \ (x\text{CaO} \cdot y\text{Al}_2\text{O}_3 \cdot z\text{H}_2\text{O})" />
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-amber-950 font-medium bg-amber-100/30 p-3 rounded-lg border border-amber-200/35">
                    <strong className="text-amber-900 border-l-2 border-amber-600 pl-2 block mb-1">Gefügevorteil:</strong>
                    Der Abbau des kristallinen, groben Portlandits und die Bildung von feligranem, fein verteiltem Calcium-Silikat-Hydrat (C-S-H)-Gel verdichtet das Mikrogefüge der ITZ dauerhaft. Dies verhindert kapillare Wanderwege und erhöht die Säure- und Frostbeständigkeit signifikant.
                  </div>
                </div>
              </div>

              {/* Latent-Hydraulic Reaction Details */}
              <div className="space-y-4">
                <div className="bg-indigo-50/40 p-5 rounded-xl border border-indigo-200/55 h-full flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main text-base mb-2 text-indigo-900">2. Die Latent-Hydraulische Hydratation (Typ II)</h4>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                      Latent-hydraulische Zusatzstoffe wie <strong>Hüttensand</strong> haben einen Aufbau, der dem Portlandzement ähnlicher ist, da sie bereits einen beträchtlichen Anteil an Calciumoxid (<InlineMath math="CaO" />) sowie Silicium- und Aluminiumoxid in ihrer glasartigen Schmelzstruktur tragen. Da diese Struktur jedoch im Ofen schockartig zu einer amorphen Glasschmelze erstarrt ist, bildet sich bei reinem Wasserkontakt eine dichte Alumosilikat-Passivierungsschicht aus, die den Reaktionsfortgang sofort blockiert.
                    </p>
                    <p className="text-xs text-text-main/80 leading-relaxed mb-4">
                      Um diese Blockade zu brechen, wird eine Anregung (Breakdown des Glasnetzwerks durch Hydroxidionen) in der Porenlösung benötigt. Das Zirkulieren von Basen/Alkalien aktiviert die Schlacke:
                    </p>

                    <div className="bg-white p-3.5 rounded-lg border border-indigo-200/80 mb-3 shadow-2xs space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 block mb-1">Alkalische Anregung (durch Ca(OH)2 des Zements):</span>
                        <p className="text-[10px] text-text-main/70 mb-1 leading-normal">
                          Das bei der Alithydratation freigesetzte Portlandit liefert die nötigen Hydroxidionen (<InlineMath math="OH^-" />), um das Silikatglas-Netzwerk aufzuspalten und C-S-H Phasen freizusetzen:
                        </p>
                        <BlockMath math="\text{Hüttensand-Glas} \xrightarrow{\text{pH } > 12{,}0} \text{C-S-H} + \text{C-A-S-H}" />
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-indigo-200/80 shadow-2xs">
                      <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 block mb-1">Sulfatische Anregung (z.B. Gips/Anhydrit):</span>
                      <p className="text-[10px] text-text-main/70 mb-1 leading-normal">
                        Calciumsulfat reagiert mit den reaktiven Aluminium-Anteilen des Hüttensands zu expansivem, aber gefügestabilisierendem Ettringit:
                      </p>
                      <BlockMath math="\text{Alumosilikat} + \text{CaSO}_4 + \text{H}_2\text{O} \rightarrow \text{Ettringit}" />
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-indigo-950 font-medium bg-indigo-100/30 p-3 rounded-lg border border-indigo-200/35">
                    <strong className="text-indigo-900 border-l-2 border-indigo-600 pl-2 block mb-1">Gefügevorteil:</strong>
                    Der Reaktionsfortgang ist zwar verlangsamt, hält dafür aber extrem langfristig an. In späten Phasen (monatelang) entsteht ein hochverdichtetes Zementsteingefüge mit exzellentem Sulfatwiderstand und minimaler Porenweite. Dies ist die Grundlage von modernen klinkerreduzierten Zementen (z.B. CEM III).
                  </div>
                </div>
              </div>
            </div>

            {/* Special Nucleation & Carboaluminate effect of Inert additives */}
            <div className="bg-stone-50 border border-home-grau/25 p-5 rounded-xl space-y-3 text-sm">
              <h4 className="font-bold text-text-main text-base flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
                <span className="shrink-0 text-shiraz font-mono font-bold">ℹ</span> 3. Reaktivitätsfinessen scheinbar inerter Stoffe (Typ I)
              </h4>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Obwohl <strong>Kalksteinmehl (Calciumcarbonat <InlineMath math="CaCO_3" />)</strong> traditionell als rein physikalischer Füller deklariert ist, zeigt die metallurgische Forschung, dass es eine subtile, aber wertvolle chemisch-physikalische Aktivität entfaltet:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
                <div className="space-y-1 bg-white p-4 rounded-xl border border-home-grau/10">
                  <strong className="text-xs uppercase font-bold text-shiraz block">A) Beschleunigte Keimbildung (Nucleation Effect):</strong>
                  <p className="text-[11px] text-text-main/75 leading-relaxed">
                    Die ultrafeinen Kalksteinpartikel lagern sich direkt an die Klinkerkörner an. Sie wirken als ideale Oberflächen-Kristallisationskeime, an denen sich C-S-H-Phasen bevorzugt und beschleunigt abscheiden können. Dies treibt die Hydratationsgeschwindigkeit des Zements in den ersten 24 Stunden deutlich an.
                  </p>
                </div>
                <div className="space-y-1 bg-white p-4 rounded-xl border border-home-grau/10">
                  <strong className="text-xs uppercase font-bold text-shiraz block">B) Carboaluminatchemie:</strong>
                  <p className="text-[11px] text-text-main/75 leading-relaxed font-normal">
                    Karbonationen (<InlineMath math="CO_3^{2-}" />) aus dem fein vermahlenen Kalksteinmehl reagieren geringfügig, aber signifikant mit den Aluminatkomponenten des Tricalciumaluminats (<InlineMath math="C_3A" />) im Klinker. Sie bilden stabiles Mono- und Hemicarbonat. Dadurch wird verhindert, dass sich Ettringit vorzeitig in Monosulfat umwandelt, was das Gesamtvolumen des Zementsteins leicht vergrößert und schließt so Mikroporen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Microstructural and Workability Effects */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-text-main border-b border-home-grau/30 pb-3">Physische &amp; Gefügespezifische Effekte im Beton</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/15 space-y-2">
                <strong className="text-sm text-text-main font-bold block text-shiraz">1. Füllereffekt (Filler Effect)</strong>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Zusatzstoffe füllen Porenräume zwischen den deutlich größeren Zement- und Sandkörnern aus. Das optimiert die Packungsdichte, verdrängt gebundenes Porenwasser und erhöht die Gefügedichtigkeit im erhärteten Zustand.
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/15 space-y-2">
                <strong className="text-sm text-text-main font-bold block text-shiraz">2. Kugellagereffekt</strong>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Kugelige Partikel (wie aus Steinkohlenflugasche) verringern die viskose Reibung im Frischbeton und verbessern die Fließfähigkeit und Pumpbarkeit ohne eine Erhöhung des w/z-Wertes.
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/15 space-y-2">
                <strong className="text-sm text-text-main font-bold block text-shiraz">3. Reaktivitätsgefälle</strong>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Die moderat beigemischten Hüttensand- und Flugaschepartikel strecken die Hydratationsreaktion zeitlich. Dadurch verteilt sich die Hydratationswärme rissmindernd bei dicken Betonquerschnitten.
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/15 space-y-2">
                <strong className="text-sm text-text-main font-bold block text-shiraz">4. k-Wert Konzept</strong>
                <p className="text-xs text-text-main/70 leading-relaxed">
                  Nach DIN EN 206 darf Flugasche mit einem Anrechnungsfaktor von <InlineMath math="k = 0{,}4" /> (bei CEM I) und Silikastaub mit <InlineMath math="k = 2{,}0" /> direkt auf den Mindestzementgehalt angerechnet werden, was die CO₂-Bilanz optimiert.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Bindemittel (Baustoff)' },
          { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' },
          { title: 'Betonzusatzstoff', url: 'https://de.wikipedia.org/wiki/Betonzusatzstoff' }
        ]}
        literatur={[
          'Stark, J.; Wicht, B. (2013): Zement und Schnellzemente - Chemie, Hydratation und Anwendung (Springer Vieweg)',
          'Locher, F. W. (2000): Zement - Herstellung und Eigenschaften (Verlag Bau+Technik)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 197-1 (Zement - Teil 1: Zusammensetzung, Anforderungen und Konformitätskriterien von Normalzement)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1' },
          { title: 'DIN EN 450-1 (Flugasche für Beton - Teil 1: Definitionen, Anforderungen und Qualitätskontrolle)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+450-1' },
          { title: 'DIN EN 13263-1 (Silikastaub für Beton - Teil 1: Definitionen, Anforderungen und Konformitätskriterien)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13263-1' }
        ]}
        formeln={[
          {
            formel: '\\left(\\frac{w}{c}\\right)_{\\text{eq}} = \\frac{w}{c + k \\cdot f}',
            erklaerung: 'Das äquivalente Wasserzementwert-Konzept (w/z-Wert) nach DIN EN 206. Erlaubt die anteilige Anrechnung aktiver Zusatzstoffe (f = Flugasche mit k = 0.4 oder Silikastaub mit k = 2.0) auf den Zementgehalt c bei festgelegtem wirksamen Wassergehalt w.',
            quelle: 'DIN EN 206'
          },
          {
            formel: '2(3\\text{CaO} \\cdot \\text{SiO}_2) + 6\\text{H}_2\\text{O} \\rightarrow 3\\text{CaO} \\cdot 2\\text{SiO}_2 \\cdot 3\\text{H}_2\\text{O} + 3\\text{Ca(OH)}_2',
            erklaerung: 'Shorthand: 2 C3S + 6 H -> C-S-H + 3 CH. Hauptreaktion der Alit-Hydratation. Es entstehen festigkeitsbildende C-S-H-Phasen und Calciumhydroxid (Portlandit), welches die Porenwasser-Alkalität (pH ≈ 12.5-13.5) sichert.',
            quelle: 'Stark/Wicht: Zementchemie'
          },
          {
            formel: '\\text{SiO}_2 + \\text{Ca(OH)}_2 + \\text{H}_2\\text{O} \\rightarrow \\text{C-S-H} \\quad (x\\text{CaO} \\cdot y\\text{SiO}_2 \\cdot z\\text{H}_2\\text{O})',
            erklaerung: 'Puzzolanische Reaktion: Reaktive amorphe Kieselsäure (z.B. aus Flugasche oder Silikastaub) bindet wasserlösliches Calciumhydroxid und bildet zusätzliches, gefügeverdichtendes C-S-H-Gel.',
            quelle: 'DIN EN 450-1'
          }
        ]}
      />
    </div>
  );
}
