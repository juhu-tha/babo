// Ausgelagert aus src/modules/ki/KiUeberblick.tsx (AP 5.2)
import { Cpu, Bot, Workflow, Boxes, Compass } from 'lucide-react';

export default function AusblickTab() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Compass className="text-shiraz" size={20} />
          Blick nach vorn: Wie sieht das Bauingenieurwesen 2030+ aus?
        </h3>
        <p className="text-xs text-text-main/70">
          Vier Schlüsseltechnologien, die das Planen und Bauen im kommenden Jahrzehnt grundlegend transformieren:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <Cpu size={16} />
            </span>
            <h4 className="font-bold text-sm text-text-main">Physics-Informed Neural Networks (PINNs)</h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Bisherige KI lernt nur aus Daten – oft entgegen den Gesetzen der Physik. <strong>PINNs</strong> betten fundamentale Differentialgleichungen (Elastizitätstheorie, Navier-Stokes, Wärmeleitung) direkt in die Verlustfunktion des Netzes ein.
          </p>
          <div className="text-[11px] text-text-main/70 bg-white p-2.5 rounded-lg border border-home-grau/20">
            <strong>Effekt:</strong> FEM-Simulationen und dynamische Erdbebenanalysen, die früher Tage auf Servern rechneten, laufen künftig in Millisekunden auf dem Tablet.
          </div>
        </div>

        <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Bot size={16} />
            </span>
            <h4 className="font-bold text-sm text-text-main">Autonome Baustellenrobotik & 3D-Druck</h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Der 3D-Betondruck leidet heute noch an schwankenden rheologischen Eigenschaften (z.B. Temperatur- und Feuchteeinfluss beim Abbinden). KI-Regelkreise messen den Frischbetondruck und die Viskosität an der Düse in Echtzeit und regeln Beschleunigerzusätze mikrosekundengenau nach.
          </p>
          <div className="text-[11px] text-text-main/70 bg-white p-2.5 rounded-lg border border-home-grau/20">
            <strong>Effekt:</strong> Fehlerfreier Freiform-Betondruck ohne Schalung für filigrane, materialsparende Deckenstrukturen.
          </div>
        </div>

        <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-100 text-purple-800 rounded-lg">
              <Workflow size={16} />
            </span>
            <h4 className="font-bold text-sm text-text-main">Multimodale Agenten-Schwärme</h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Spezialisierte KI-Agenten arbeiten Hand in Hand: Ein Agent liest das Baugrundgutachten, ein zweiter modelliert die Gründung im BIM-Modell, ein dritter prüft die Konformität mit dem Bebauungsplan und ein vierter berechnet die Ökobilanz (LCA / CO₂-Äquivalente).
          </p>
          <div className="text-[11px] text-text-main/70 bg-white p-2.5 rounded-lg border border-home-grau/20">
            <strong>Effekt:</strong> Der Vorentwurf beschleunigt sich von Monaten auf wenige Tage; Ingenieure fokussieren sich auf kreative Variantenentscheidungen.
          </div>
        </div>

        <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Boxes size={16} />
            </span>
            <h4 className="font-bold text-sm text-text-main">Zirkuläres Bauen & Urban Mining</h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Vor dem Rückbau eines Bestandsgebäudes erfasst ein KI-gestützter Laserscan automatisch alle wiederverwendbaren Bauteile (Stahlträger, Mauerziegel, Fenster). Die KI gleicht Maße und Tragfähigkeiten automatisch mit einer Bauteilbörse für Neubauten ab.
          </p>
          <div className="text-[11px] text-text-main/70 bg-white p-2.5 rounded-lg border border-home-grau/20">
            <strong>Effekt:</strong> Direkte Wiederverwendung (Re-Use) statt energieintensivem Downcycling.
          </div>
        </div>
      </div>
    </div>
  );
}
