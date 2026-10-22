import React from 'react';
import { Monitor, Code, PenTool, Calculator, Leaf, Activity, Box } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function Software() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Monitor className="text-shiraz" /> Software & Tools für Studierende
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Eine Übersicht über kostenlose und Open-Source-Software (FOSS) sowie für Studierende frei verfügbare Werkzeuge im Bauingenieurwesen.
            Diese Tools eignen sich hervorragend für das Studium, Projektarbeiten und erste berufliche Schritte.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CAD & BIM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <PenTool className="text-shiraz" size={20} />
            <h3 className="text-lg font-bold text-text-main">CAD & BIM</h3>
          </div>
          <ul className="space-y-4">
            <li>
              <a href="https://www.freecad.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">FreeCAD</a>
              <span className="text-sm text-text-main/70">Leistungsstarkes parametrisches 3D-CAD-System (Open Source). Eignet sich für Konstruktion und Architektur.</span>
            </li>
            <li>
              <a href="https://bonsaibim.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">Bonsai (ehem. BlenderBIM)</a>
              <span className="text-sm text-text-main/70">Add-on für Blender zur Erstellung, Bearbeitung und Analyse von IFC-Modellen (OpenBIM).</span>
            </li>
            <li>
              <a href="https://www.qcad.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">QCAD</a> / <a href="https://librecad.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">LibreCAD</a>
              <span className="text-sm text-text-main/70 block mt-1">Kostenlose 2D-CAD-Anwendungen, ideal für einfache Grundrisse und Detailzeichnungen.</span>
            </li>
            <li>
              <strong className="text-text-main block">Autodesk / Allplan / Archicad (Edu)</strong>
              <span className="text-sm text-text-main/70">Die meisten kommerziellen Anbieter bieten kostenlose Studentenversionen ihrer Flaggschiff-Produkte an.</span>
            </li>
          </ul>
        </div>

        {/* Statik & FEM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Activity className="text-shiraz" size={20} />
            <h3 className="text-lg font-bold text-text-main">Statik & FEM</h3>
          </div>
          <ul className="space-y-4">
            <li>
              <a href="https://www.ftool.com.br/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">Ftool</a>
              <span className="text-sm text-text-main/70">Sehr einfaches und intuitives 2D-Rahmenanalyse-Programm. Perfekt für die Baustatik-Grundlagen.</span>
            </li>
            <li>
              <a href="https://www.z88.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">Z88Aurora</a>
              <span className="text-sm text-text-main/70">Kostenloses FEM-Programm der Uni Bayreuth für lineare und nichtlineare Berechnungen.</span>
            </li>
            <li>
              <a href="http://www.calculix.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">CalculiX</a>
              <span className="text-sm text-text-main/70">Leistungsstarkes Open-Source 3D-FEM-Paket (ähnlich Abaqus).</span>
            </li>
            <li>
              <a href="https://www.dlubal.com/de/bildung/studenten-und-schulen/kostenlose-studentenversion-anfordern-bzw-verlaengern" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">Dlubal RFEM / RSTAB (Edu)</a>
              <span className="text-sm text-text-main/70">Kostenlose Studentenversionen für professionelle 3D-Stabwerks- und Flächenberechnungen.</span>
            </li>
          </ul>
        </div>

        {/* Mathematik & Datenanalyse */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Calculator className="text-shiraz" size={20} />
            <h3 className="text-lg font-bold text-text-main">Mathematik & Numerik</h3>
          </div>
          <ul className="space-y-4">
            <li>
              <a href="https://octave.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">GNU Octave</a> / <a href="https://www.scilab.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">Scilab</a>
              <span className="text-sm text-text-main/70 block mt-1">Kostenlose Alternativen zu MATLAB für numerische Berechnungen und Matrizenoperationen.</span>
            </li>
            <li>
              <a href="https://www.python.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">Python (Jupyter, NumPy, Pandas)</a>
              <span className="text-sm text-text-main/70">Der Standard für Datenanalyse und Automatisierung. Sehr nützlich für parametrisches Design und Auswertungen.</span>
            </li>
            <li>
              <a href="https://en.smath.com/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">SMath Studio</a>
              <span className="text-sm text-text-main/70">Kostenlose Alternative zu Mathcad. Ermöglicht Berechnungen auf einem "virtuellen Blatt Papier" inkl. Einheitenprüfung.</span>
            </li>
          </ul>
        </div>

        {/* LCA & Nachhaltigkeit */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Leaf className="text-shiraz" size={20} />
            <h3 className="text-lg font-bold text-text-main">LCA & Nachhaltigkeit</h3>
          </div>
          <ul className="space-y-4">
            <li>
              <a href="https://www.openlca.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">openLCA</a>
              <span className="text-sm text-text-main/70">Professionelle Open-Source-Software für Ökobilanzierung (LCA) und Nachhaltigkeitsbewertung.</span>
            </li>
            <li>
              <a href="https://www.oekobaudat.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">ÖKOBAUDAT</a>
              <span className="text-sm text-text-main/70">Keine Software, aber die zentrale (kostenlose) Datenbank des Bundes für Ökobilanzdaten von Bauprodukten.</span>
            </li>
            <li>
              <a href="https://www.bauteileditor.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">eLCA</a>
              <span className="text-sm text-text-main/70">Kostenloses Online-Tool des BBSR zur Erstellung von Gebäudeökobilanzen.</span>
            </li>
          </ul>
        </div>

        {/* Bauphysik */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Box className="text-shiraz" size={20} />
            <h3 className="text-lg font-bold text-text-main">Bauphysik</h3>
          </div>
          <ul className="space-y-4">
            <li>
              <a href="https://windows.lbl.gov/software/therm" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">Therm (LBNL)</a>
              <span className="text-sm text-text-main/70">Kostenloses 2D-Wärmeübertragungsprogramm zur Berechnung von Wärmebrücken.</span>
            </li>
            <li>
              <a href="https://wufi.de/de/software/wufi-pro/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">WUFI (Light/Edu)</a>
              <span className="text-sm text-text-main/70">Software zur Berechnung des gekoppelten Wärme- und Feuchtetransports (Fraunhofer IBP).</span>
            </li>
            <li>
              <a href="https://www.ubakus.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">Ubakus (ehem. U-Wert-Rechner)</a>
              <span className="text-sm text-text-main/70">Online-Tool zur Berechnung von U-Werten und Feuchteschutz (für private/studentische Nutzung oft ausreichend).</span>
            </li>
          </ul>
        </div>

        {/* Programmierung & Tools */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Code className="text-shiraz" size={20} />
            <h3 className="text-lg font-bold text-text-main">Programmierung & Tools</h3>
          </div>
          <ul className="space-y-4">
            <li>
              <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">Visual Studio Code</a>
              <span className="text-sm text-text-main/70">Der Standard-Editor für Programmierung (Python, C++, Web).</span>
            </li>
            <li>
              <a href="https://dynamobim.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">Dynamo</a> / <a href="https://www.grasshopper3d.com/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">Grasshopper</a>
              <span className="text-sm text-text-main/70 block mt-1">Visuelle Programmierung für Revit bzw. Rhino. Essenziell für parametrisches Design (oft in Edu-Lizenzen enthalten).</span>
            </li>
            <li>
              <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">Git</a> / <a href="https://education.github.com/pack" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">GitHub (Student Pack)</a>
              <span className="text-sm text-text-main/70 block mt-1">Versionskontrolle für Code und Textdokumente (LaTeX). GitHub bietet ein kostenloses Student Developer Pack.</span>
            </li>
          </ul>
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Bausoftware', url: 'https://de.wikipedia.org/wiki/Bausoftware' },
          { title: 'Finite-Elemente-Methode', url: 'https://de.wikipedia.org/wiki/Finite-Elemente-Methode' },
          { title: 'Computer-aided design', url: 'https://de.wikipedia.org/wiki/Computer-aided_design' }
        ]}
        literatur={[
          'Borrmann, A. et al.: Handbuch Building Information Modeling: Digitales Planen, Bauen und Betreiben (Springer Vieweg)',
          'Barth, C.; Rustler, W.: Praxis der Finite-Elemente-Methode im Bauwesen (Bauwerk Verlag)'
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 19650 (Organisation und Digitalisierung von Informationen zu Bauwerken)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+ISO+19650' },
          { title: 'VDI 2552 Blatt 1 (Building Information Modeling – Grundlagen)', url: 'https://www.vdi.de/richtlinien' }
        ]}
        formeln={[
          {
            formel: '\\mathbf{K} \\cdot \\mathbf{u} = \\mathbf{F}',
            erklaerung: 'Grundgleichung linear-elastischer Finite-Elemente-Berechnungen (FEM) in baustatischen Softwaresystemen mit Gesamtsteifigkeitsmatrix K, Knotenverschiebungsvektor u und Belastungsvektor F.',
            quelle: 'Numerische Strukturmechanik'
          }
        ]}
      />
    </div>
  );
}
