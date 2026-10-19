import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Factory, Truck, Waves, ArrowRight, AlertTriangle, Settings, Combine } from 'lucide-react';

export default function HerstellungEinbau() {
  return (
    <div className="flex flex-col gap-8">
      {/* 1. Herstellung & Transport */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Factory size={24} />
          </div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">Herstellung & Transport</h2>
      

        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Beton wird meist als <strong>Transportbeton</strong> in stationären Mischanlagen industriell hergestellt und durch Fahrmischer (Trommelmischer) zur Baustelle transportiert. Seltener wird <strong>Baustellenbeton</strong> direkt vor Ort gemischt. 
            Während des Transports wird die Mischtrommel langsam gedreht (Agitieren), um ein Entmischen zu verhindern. Eine Zugabe von Wasser auf der Baustelle ist grundsätzlich untersagt, da dies den w/z-Wert und somit die Festigkeit und Dauerhaftigkeit zerstört. Lediglich Fließmittel darf unter strengen Vorgaben vom Fahrpersonal nachdosiert werden.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-home-grau/30 rounded-xl bg-white">
             <h3 className="font-bold text-text-main flex items-center gap-2 mb-2"><Truck size={18} className="text-shiraz"/> Transport & Fahrmischer</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Regelmäßige maximale Transportzeit von der Wasserzugabe im Werk bis zum vollständigen Einbau: <strong>90 Minuten</strong>.
          </p>
        </div>
             <p className="text-sm text-text-main/70"><strong>Mischwirkung im Fahrmischer:</strong> Fortwährendes Mischen oder längere Standzeiten (Agitieren) wirken sich auf den Beton aus. So kann beispielsweise der künstliche Luftporengehalt bei LP-Beton durch das stetige Mischen und die Reibung (Herausschlagen der Poren) stark absinken.</p>
          </div>
          <div className="p-4 border border-home-grau/30 rounded-xl bg-white">
             <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><Combine size={18} className="text-shiraz"/> Mischen</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Zwangsmischer gewährleisten eine starke Homogenisierung. Empfohlene Mischzeiten: 30 bis 90 Sekunden (bei komplexen HPC- oder SCC-Betonen teils deutlich länger).
          </p>
        </div>
             <p className="text-sm text-text-main/70"><strong>Überwachung:</strong> Der Mischprozess und die Betonviskosität werden über die <em>Leistungsaufnahme der Mischermotoren</em> überwacht. Eine abflachende Wirkstromkurve signalisiert die vollständige Homogenisierung.</p>
          </div>
        </div>
      </div>

      {/* 2. Pumpen von Beton (aus Pumpbeton.tsx integriert) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 border-2 border-shiraz text-shiraz rounded-lg">
            <Waves size={24} />
          </div>
          <h2 className="text-2xl font-bold text-text-main">Einbauverfahren: Pumpen von Beton</h2>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Das Fördern von Beton mittels Autobetonpumpen ist heute die Standardmethode für den Höhen- und Weitertransport auf vielen Baustellen. 
            Damit der Beton pumpbar ist, muss er spezielle rheologische Eigenschaften aufweisen. 
            Das Kernprinzip des Pumpens beruht auf der Ausbildung einer <strong>Gleitschicht</strong> (Schmierfilm) an der Rohrwandung.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gleitschicht & Mechanismus */}
          <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
            <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
              <ArrowRight className="text-shiraz" size={20} />
              Wirkprinzip: Die Gleitschicht
            </h3>
            <p className="text-sm text-text-main/80 mb-4">
              Beim Pumpen bewegt sich der Beton als kompakter "Pfropfen" (Plug-Flow) durch das Förderrohr. 
              Die Reibung entsteht fast ausschließlich in einer 1-3 mm dünnen Schicht an der Rohrwandung.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
              <li><strong>Zusammensetzung:</strong> Die Gleitschicht besteht aus Wasser, Zement und feinsten Sandpartikeln (Zementleim/Mörtel).</li>
              <li><strong>Entstehung:</strong> Durch den Pumpdruck wird Wasser und Leim an die Rohrwandung gepresst (Scherinduzierte Partikelmigration).</li>
              <li><strong>Bedeutung:</strong> Ohne intakte Gleitschicht kommt es zu extrem hoher Reibung und zum "Stopfer" (Blockade).</li>
            </ul>
          </div>

          {/* Anforderungen an den Beton */}
          <div className="border border-home-grau/30 rounded-xl p-5 bg-white">
            <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
              <Settings className="text-shiraz" size={20} />
              Anforderungen an die Rezeptur
            </h3>
            <p className="text-sm text-text-main/80 mb-4">
              Nicht jeder Beton ist pumpbar. Die Mischung muss stabil sein und darf unter Druck nicht entmischen oder ausbluten.
            </p>
            <ul className="list-disc list-inside text-sm text-text-main/70 space-y-2">
              <li><strong>Mehlkorngehalt:</strong> Ausreichend Feinstoffe (zwingend erforderlich für die Gleitschichtbildung, oft &gt; 350-400 kg/m³).</li>
              <li><strong>Kornzusammensetzung:</strong> Eine stetige Sieblinie ist optimal. Ausfallkörnungen neigen eher zum Entmischen.</li>
              <li><strong>Konsistenz:</strong> Meist F3 bis F5 (weich bis fließfähig). Zu steifer Beton ist schwer ansaugbar, zu flüssiger Beton blutet/entmischt.</li>
              <li><strong>Wasserhaltevermögen:</strong> Der Beton darf das Wasser unter Druck nicht abgeben.</li>
              <li><strong>Hochfester Beton (HPC):</strong> Besitzt einen sehr niedrigen w/z-Wert und extrem hohe dynamische Viskosität (sehr "klebrig"). Um diesen zu pumpen, sind sehr hohe Pumpdrücke notwendig, weshalb der Anlagenverschleiß stark zunimmt.</li>
            </ul>
          </div>
        </div>

        {/* Risiken und Probleme */}
        <div className="mt-2 border border-shiraz/20 bg-off-white rounded-xl p-5">
          <h3 className="font-bold text-shiraz text-lg mb-3 flex items-center gap-2">
            <AlertTriangle size={20} />
            Typische Probleme beim Pumpen (Stopfer)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-shiraz/10 shadow-sm">
              <h4 className="font-bold text-text-main text-sm mb-1">Verbluten (Bleeding)</h4>
              <p className="text-xs text-text-main/70">
                Wasser wird herausgepresst und fließt vorweg. Zurück bleibt ein trockener, unpumpbarer Kies-Sand-Pfropfen.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-shiraz/10 shadow-sm">
              <h4 className="font-bold text-text-main text-sm mb-1">Anpumpen (Schmieren)</h4>
              <p className="text-xs text-text-main/70">
                Vorlaufmörtel fehlt, wodurch das trockene Rohr dem ersten Beton das Wasser entleert und es zur Blockade kommt.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-shiraz/10 shadow-sm">
              <h4 className="font-bold text-text-main text-sm mb-1">Rohrleitungs-Geometrie</h4>
              <p className="text-xs text-text-main/70">
                Enge Bögen oder undichte Kupplungen führen zu Wasserverlust und Druckpeaks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Verdichten und Einbau */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-text-main">Einbau & Verdichtung</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-4">
             <p className="text-sm text-text-main/80">
               Nachdem der Beton in die Schalung eingebracht wurde, muss er verdichtet werden, um die eingeschlossene Verdichtungsluft aus der Misch- und Transportphase fast vollständig auszutreiben. Dies verbessert die Dichtigkeit, Festigkeit und den Verbund zum Bewehrungsstahl.
             </p>
             <ul className="list-disc list-inside text-sm text-text-main/70 space-y-1">
               <li><strong>Flaschenrüttler (Innenrüttler):</strong> Das gängigste Verfahren. Der Rüttler wird schnell eingeführt und langsam herausgezogen.</li>
               <li><strong>Außenrüttler (Schalungsrüttler):</strong> Direkt an der Schalung befestigt, oft im Fertigteilwerk oder bei eng bewehrten Bauteilen.</li>
               <li><strong>Rüttelbohlen:</strong> Zum Abziehen und Verdichten von oben (z. B. bei Sohlplatten oder Decken).</li>
             </ul>
           </div>
           
           <div className="bg-home-grau/5 rounded-xl border border-home-grau/30 p-5">
              <h3 className="font-bold text-text-main text-sm mb-2 text-shiraz">Achtung: Fehler beim Verdichten</h3>
              <ul className="space-y-3">
                <li className="text-xs text-text-main/70 flex gap-2"><ArrowRight size={14} className="shrink-0 text-shiraz mt-0.5" /> <strong>Überrütteln (Sedimentation & Bluten):</strong> Zu langes Rütteln führt zum Entmischen. Grobe Körner sinken ab (Sedimentation), während Wasser und Zementschlämme an die Oberfläche aufsteigen (Bluten). Die wasserreiche Schicht an der Oberfläche besitzt keine Festigkeit und neigt zu Rissen/Abplatzungen.</li>
                <li className="text-xs text-text-main/70 flex gap-2"><ArrowRight size={14} className="shrink-0 text-shiraz mt-0.5" /> <strong>Unterrütteln:</strong> Lufteinschlüsse bleiben im Beton, die Festigkeit sinkt massiv, offene Poren an der Oberfläche (Lunker).</li>
                <li className="text-xs text-text-main/70 flex gap-2"><ArrowRight size={14} className="shrink-0 text-shiraz mt-0.5" /> <strong>Eigenfließen:</strong> Beton darf nicht mit dem Rüttler "gezogen" oder "geschoben" werden, dies entmischt ihn.</li>
              </ul>
           </div>
        </div>
      </div>

      <ModuleFooter weblinks={[
          { title: "Beton.wiki: Betonherstellung", url: "https://beton.wiki/index.php?title=Betonherstellung" }, 
          { title: "Zement-Merkblatt B7: Bereiten und Verarbeiten von Beton", url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" }, 
          { title: "Beton.wiki: Betonieren", url: "https://beton.wiki/index.php?title=Betonieren" },
          { title: "Verein Deutscher Zementwerke (VDZ): Zement-Taschenbuch", url: "https://www.vdz-online.de/publikationen/zement-taschenbuch" }
        ]} 
        wikipedia={[
          { title: 'Transportbeton', url: 'https://de.wikipedia.org/wiki/Transportbeton' },
          { title: 'Pumpbeton', url: 'https://de.wikipedia.org/wiki/Pumpbeton' },
          { title: 'Betonmischer', url: 'https://de.wikipedia.org/wiki/Betonmischer' }
        ]}
        regelwerke={[
          { title: 'DIN EN 206 / DIN 1045-2 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+206' },
          { title: 'DIN 1045-3 (Tragwerke aus Beton - Bauausführung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1045-3' },
          { title: 'DBV-Merkblatt Pumpbeton', url: 'https://www.betonverein.de/' }
        ]}
        literatur={[
          'Lohmeyer, G.; Ebeling, K. (2019): Betonböden für Hallen und Freiflächen (Werner Verlag)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
            formel: 'p_{\\text{Förder}} = \\frac{2 \\cdot \\tau_0 \\cdot L}{R} + \\frac{8 \\cdot \\mu_p \\cdot v \\cdot L}{R^2} + \\rho \\cdot g \\cdot H',
            erklaerung: 'Förderdruckbedarf für Betonpumpen nach Bingham-Modell: Abhängig von Fließgrenze tau_0, plastischer Viskosität mu_p, Rohrleitungsradius R, Länge L und Förderhöhe H.',
            quelle: 'DBV-Merkblatt Pumpbeton'
          },
          {
            formel: 'w/z = \\frac{m_w}{m_z + k \\cdot m_z\'} \\le (w/z)_{\\text{max}}',
            erklaerung: 'Äquivalenter Wasserzementwert nach DIN EN 206 unter Berücksichtigung von Zusatzstoffen des Typs II (Flugasche k = 0.40, Silikastaub k = 1.0/2.0).',
            quelle: 'DIN EN 206 Abs. 5.2.5.2'
          }
        ]}
      />
    </div>
  );
}
