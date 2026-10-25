// Ausgelagert aus src/modules/ZfP.tsx (AP 5.2)
import React from 'react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Activity, Waves, Trees, Droplets } from 'lucide-react';

export interface HolzTabProps {
  renderEmbeddedGeraete: (tabKey: string, deviceIds: string[]) => React.JSX.Element | null;
}

export default function HolzTab({ renderEmbeddedGeraete }: HolzTabProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <Activity size={20} className="text-shiraz" /> Bohrwiderstandsmessung (Nadelbohrverfahren)
        </h3>
        <p className="text-sm text-slate-700">
          Ein dünner Bohrer (meist Ø 1,5 - 3,0 mm) wird mit konstanter Geschwindigkeit in das Holz getrieben. Der elektrische Energieaufwand (Bohrwiderstand) wird in Abhängigkeit von der Bohrtiefe aufgezeichnet.
        </p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
          <li><strong>Anwendung:</strong> Erkennung von Fäulnis, Hohlräumen, Rissen und Insektengängen im Inneren von Holzbauteilen.</li>
          <li><strong>Ergebnis:</strong> Ein Bohrprofil (Resistogramm). Intaktes Holz zeigt hohe Widerstände (mit sichtbaren Jahrringschwankungen), geschädigtes Holz zeigt starke Abfälle im Widerstand.</li>
          <li><strong>Vorteil:</strong> Quasi-zerstörungsfrei (sehr kleines Bohrloch), liefert direkte in-situ Informationen über den Restquerschnitt.</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <Waves size={20} className="text-shiraz" /> Dynamischer E-Modul (Ultraschall / Resonanz)
        </h3>
        <p className="text-sm text-slate-700">
          Bestimmung der Festigkeit und Steifigkeit von Holzbauteilen über die Ausbreitungsgeschwindigkeit von Schallwellen.
        </p>
        <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-center">
          <FormulaText text="E_{dyn} = \rho \cdot v^2" />
        </div>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
          <li><strong>Prinzip:</strong> Schall breitet sich in dichtem, gesundem Holz schneller aus als in geschädigtem oder porösem Holz.</li>
          <li><strong>Anwendung:</strong> Abschätzung der Festigkeitsklasse (Sortierung), Erkennung von inneren Schäden (Pilzbefall verringert die Schallgeschwindigkeit drastisch).</li>
          <li><strong>Hinweis:</strong> Der dynamische E-Modul ist in der Regel ca. 10-20% höher als der statische E-Modul.</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <Droplets size={20} className="text-shiraz" /> Feuchtemessung
        </h3>
        <p className="text-sm text-slate-700">
          Die Holzfeuchte ist der kritischste Parameter für die Dauerhaftigkeit (Gefahr von Pilzbefall ab ca. 20% Holzfeuchte).
        </p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
          <li><strong>Widerstandsmessung:</strong> Zwei Elektroden werden ins Holz geschlagen. Der elektrische Widerstand sinkt mit steigender Feuchtigkeit. Genau im Bereich von 6% bis 30% (Fasersättigungspunkt).</li>
          <li><strong>Kapazitive Messung:</strong> Zerstörungsfrei durch Auflegen eines Sensors. Misst die Änderung der Dielektrizitätskonstante. Gut für schnelle Rastermessungen, aber anfällig für Dichteschwankungen.</li>
          <li><strong>Darr-Methode:</strong> Zerstörend (Probenentnahme), aber das genaueste Referenzverfahren.</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <Trees size={20} className="text-shiraz" /> Dendrochronologie
        </h3>
        <p className="text-sm text-slate-700">
          Altersbestimmung von Holz anhand der charakteristischen Abfolge von breiten und schmalen Jahrringen.
        </p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
          <li><strong>Prinzip:</strong> Das Baumwachstum (Jahrringbreite) wird stark vom Klima (Temperatur, Niederschlag) des jeweiligen Jahres beeinflusst. Diese Muster sind regional einheitlich.</li>
          <li><strong>Anwendung:</strong> Exakte Datierung von historischen Dachstühlen, Fachwerkhäusern oder archäologischen Funden (oft auf das genaue Fälljahr bestimmbar).</li>
          <li><strong>Vorgehen:</strong> Entnahme eines Bohrkerns (Zuwachsbohrer), Ausmessen der Jahrringbreiten und Abgleich mit regionalen Referenzkurven (Masterchronologien).</li>
        </ul>
      </div>
      </div>
      {/* Section: Zugehörige Geräte aus Gerätepool */}
      {renderEmbeddedGeraete('holz', ['setzdehnung', 'messverstaerker', 'wegaufnehmer', 'endoskopie', 'laserscanner'])}
    </div>
  );
}
