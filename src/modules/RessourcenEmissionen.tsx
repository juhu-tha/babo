import React from 'react';
import { Leaf, Factory, Droplets, Zap, Activity } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function RessourcenEmissionen() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Factory className="text-shiraz" /> Produktionsbedingte Ressourcenverbräuche & Emissionen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Die Baustoffherstellung ist hochgradig energie- und ressourcenintensiv. Insbesondere die Zement- und Stahlproduktion verursachen erhebliche Treibhausgasemissionen (CO₂). Dieses Modul gibt einen Überblick über die wesentlichen Verbräuche, Emissionen und technologischen Ansätze zur Reduktion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col items-center text-center">
            <Zap className="text-amber-500 w-10 h-10 mb-3" />
            <h3 className="font-bold text-lg mb-2">Energieverbrauch</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der Sinterprozess (z. B. beim Klinkerbrennen bei 1450 °C oder im Hochofen) erfordert enorme Mengen an thermischer Energie. Die Zementindustrie verantwortet ca. 2 % bis 3 % des weltweiten Primärenergiebedarfs.
          </p>
        </div>
          </div>
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col items-center text-center">
            <Activity className="text-shiraz w-10 h-10 mb-3" />
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">CO₂-Emissionen</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Neben brennstoffbedingten Emissionen machen vor allem rohstoffbedingte (prozessbedingte) Emissionen durch die Entsäuerung von Kalkstein (CaCO₃ → CaO + CO₂) den Löwenanteil des CO₂-Fußabdrucks aus. Weltweit steht Zement für ca. 8 % der CO₂-Emissionen.
          </p>
        </div>
          </div>
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col items-center text-center">
            <Droplets className="text-blue-500 w-10 h-10 mb-3" />
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Ressourcen & Wasser</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Sand, Kies, Kalkstein und Tonminerale werden weltweit in Milliarden Tonnen abgebaut. Zudem ist ein hoher Wasserverbrauch beim Anmischen (Zementhydratation), zur Staubbindung und bei der Gesteinswaschung unvermeidlich.
          </p>
        </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-text-main mt-8 mb-4">Emissionsvergleich wesentlicher Baustoffe</h3>
        <div className="overflow-x-auto bg-white rounded-xl border border-home-grau/30 shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-off-white border-b-2 border-home-grau/30">
                <th className="p-3 font-bold">Baustoff</th>
                <th className="p-3 font-bold">Herstellungsprozess</th>
                <th className="p-3 font-bold">Typisches GWP (kg CO₂-Äq./kg)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-home-grau/10">
                <td className="p-3 font-bold text-shiraz">Portlandzementklinker</td>
                <td className="p-3 text-text-main/80">Brennen von Kalkstein & Ton (1450°C), Mahlen</td>
                <td className="p-3 font-mono">~ 0,85</td>
              </tr>
              <tr className="border-b border-home-grau/10 bg-off-white/30">
                <td className="p-3 font-bold text-shiraz">Baustahl (Primär)</td>
                <td className="p-3 text-text-main/80">Eisenerzreduktion im Hochofen (BOF)</td>
                <td className="p-3 font-mono">~ 2,00 - 2,50</td>
              </tr>
              <tr className="border-b border-home-grau/10">
                <td className="p-3 font-bold">Baustahl (Sekundär)</td>
                <td className="p-3 text-text-main/80">Schrottschmelze im Elektrolichtbogenofen (EAF)</td>
                <td className="p-3 font-mono">~ 0,40 - 0,60</td>
              </tr>
              <tr className="border-b border-home-grau/10 bg-off-white/30">
                <td className="p-3 font-bold">Aluminium (Primär)</td>
                <td className="p-3 text-text-main/80">Bauxit-Abbau, Schmelzflusselektrolyse (hoher Strombedarf)</td>
                <td className="p-3 font-mono">~ 14,00 - 20,00</td>
              </tr>
              <tr className="border-b border-home-grau/10">
                <td className="p-3 font-bold">Konstruktionsvollholz</td>
                <td className="p-3 text-text-main/80">Holzeinschlag, Sägen, technische Trocknung (ohne biogenes CO₂)</td>
                <td className="p-3 font-mono">~ 0,10 - 0,15</td>
              </tr>
              <tr className="border-b border-home-grau/10 bg-off-white/30">
                <td className="p-3 font-bold">Mauerziegel</td>
                <td className="p-3 text-text-main/80">Tone & Lehm formen, Brennen (ca. 1000°C)</td>
                <td className="p-3 font-mono">~ 0,20 - 0,30</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">Gesteinskörnung (Natürlich)</td>
                <td className="p-3 text-text-main/80">Abbau, Brechen, Klassieren</td>
                <td className="p-3 font-mono">~ 0,005 - 0,01</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-main/50 mt-2 text-right">Werte sind indikativ und schwanken nach Herstellungswerk und Energiemix (basierend z.B. auf ÖKOBAUDAT).</p>

        <h3 className="text-xl font-bold text-text-main mt-8 mb-4">Dekarbonisierungsstrategien (Beispiel Zement & Beton)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-home-grau/30 p-4 rounded-xl bg-off-white">
            <h4 className="font-bold text-shiraz">1. Klinkereffizienz (Klinkerersatz)</h4>
            <p className="text-sm text-text-main/80 mt-1">
              Ersetzen von CO₂-intensivem Klinker durch Zumahlstoffe wie Hüttensandmehl (HSM), Steinkohlenflugasche (SFA) oder calcinierte Tone. Nutzung von Kompositzementen (CEM II, CEM III, CEM VI) anstelle von reinem Portlandzement (CEM I).
            </p>
          </div>
          <div className="border border-home-grau/30 p-4 rounded-xl bg-off-white">
            <h4 className="font-bold text-shiraz">2. Alternative Brennstoffe</h4>
            <p className="text-sm text-text-main/80 mt-1">
              Austausch fossiler Brennstoffe (Kohle, Koks) in den Drehrohröfen durch Ersatzbrennstoffe (EBS) wie zerkleinerte Altreifen, Altholz, Lösungsmittel oder Klärschlamm. Dadurch sinken die brennstoffbedingten Emissionen.
            </p>
          </div>
          <div className="border border-home-grau/30 p-4 rounded-xl bg-off-white">
            <h4 className="font-bold text-shiraz">3. CCUS (Carbon Capture, Utilization & Storage)</h4>
            <p className="text-sm text-text-main/80 mt-1">
              Da rund zwei Drittel der Emissionen chemisch bedingt sind (Kalzinierung des Kalksteins), bleibt nur die Abscheidung des CO₂ am Schornstein (z.B. Aminwäsche) und dessen Lagerung (CCS) in alten Gasfeldern oder Nutzung für Treibstoffe (CCU).
            </p>
          </div>
          <div className="border border-home-grau/30 p-4 rounded-xl bg-off-white">
            <h4 className="font-bold text-shiraz">4. Betoneffizienz & Recycling</h4>
            <p className="text-sm text-text-main/80 mt-1">
              Materialgerechtes, schlankes Konstruieren (verbaute Masse reduzieren). Schließen von Stoffkreisläufen durch den Einsatz von rezyklierter Gesteinskörnung (RC-Beton), um primäre Kies- und Sandvorkommen zu schonen.
            </p>
          </div>
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Kohlendioxid-Emission', url: 'https://de.wikipedia.org/wiki/Kohlendioxid-Emission' },
          { title: 'Treibhauspotenzial', url: 'https://de.wikipedia.org/wiki/Treibhauspotenzial' },
          { title: 'Ressourceneffizienz', url: 'https://de.wikipedia.org/wiki/Ressourceneffizienz' }
        ]}
        literatur={[
          'Wendehorst Baustoffkunde, 27. Auflage, Vieweg+Teubner 2011',
          'VDI-Zentrum Ressourceneffizienz: Kennzahlen und Indikatoren zur Ressourceneffizienz im Hochbau.',
          'Umweltbundesamt (UBA): ÖKOBAUDAT Leitfaden - Datenbasis für die Ökobilanzierung von Bauwerken.'
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 14040/44 (Umweltmanagement - Ökobilanz - Grundsätze und Rahmenbedingungen)', url: 'https://www.din.de' },
          { title: 'DIN EN 15804 (Nachhaltigkeit von Bauwerken - Umweltproduktdeklarationen)', url: 'https://www.din.de' }
        ]}
        formeln={[
          {
            formel: "\\text{GWP} = \\sum_{i} m_i \\cdot \\text{GWP}_{i} \\quad [\\text{kg CO}_2\\text{-Äq}]",
            erklaerung: "Global Warming Potential (Treibhauspotenzial) als Summe aller emittierten Treibhausgase multipliziert mit ihrem jeweiligen CO2-Äquivalenzfaktor.",
            quelle: "DIN EN 15804"
          },
          {
            formel: "\\text{PE}_{\\text{Gesamt}} = \\text{PENRT} + \\text{PERT} \\quad [\\text{MJ}]",
            erklaerung: "Gesamtprimärenergiebedarf als Summe aus nicht-erneuerbarer (PENRT) und erneuerbarer Primärenergie (PERT).",
            quelle: "DIN EN ISO 14040"
          }
        ]}
      />
    </div>
  );
}
