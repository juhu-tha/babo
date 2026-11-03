import React from 'react';
import { Monitor, Code, PenTool, Calculator, Leaf, Activity, Box } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/software/Software.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Software() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Monitor className="text-shiraz" /><MdText text={inhalt.texte.softwareToolsFürStudierende} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.eineÜbersichtÜberKostenlose} /></p>
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
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.leistungsstarkesParametrisches3dCad} /></span>
            </li>
            <li>
              <a href="https://bonsaibim.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block"><MdText text={inhalt.texte.bonsaiEhemBlenderbim} /></a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.addOnFürBlender} /></span>
            </li>
            <li>
              <a href="https://www.qcad.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">QCAD</a> / <a href="https://librecad.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">LibreCAD</a>
              <span className="text-sm text-text-main/70 block mt-1"><MdText text={inhalt.texte.kostenlose2dCadAnwendungen} /></span>
            </li>
            <li>
              <strong className="text-text-main block"><MdText text={inhalt.texte.autodeskAllplanArchicadEdu} /></strong>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.dieMeistenKommerziellenAnbieter} /></span>
            </li>
          </ul>
        </div>

        {/* Statik & FEM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Activity className="text-shiraz" size={20} />
            <h3 className="text-lg font-bold text-text-main"><MdText text={inhalt.texte.statikFem} /></h3>
          </div>
          <ul className="space-y-4">
            <li>
              <a href="https://www.ftool.com.br/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">Ftool</a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.sehrEinfachesUndIntuitives} /></span>
            </li>
            <li>
              <a href="https://z88.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">Z88Aurora</a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.kostenlosesFemProgrammDer} /></span>
            </li>
            <li>
              <a href="http://www.calculix.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">CalculiX</a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.leistungsstarkesOpenSource3d} /></span>
            </li>
            <li>
              <a href="https://www.dlubal.com/de/bildung/studenten-und-schulen/kostenlose-studentenversion-anfordern-bzw-verlaengern" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block"><MdText text={inhalt.texte.dlubalRfemRstabEdu} /></a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.kostenloseStudentenversionenFürProfessio} /></span>
            </li>
          </ul>
        </div>

        {/* Mathematik & Datenanalyse */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Calculator className="text-shiraz" size={20} />
            <h3 className="text-lg font-bold text-text-main"><MdText text={inhalt.texte.mathematikNumerik} /></h3>
          </div>
          <ul className="space-y-4">
            <li>
              <a href="https://octave.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">GNU Octave</a> / <a href="https://www.scilab.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">Scilab</a>
              <span className="text-sm text-text-main/70 block mt-1"><MdText text={inhalt.texte.kostenloseAlternativenZuMatlab} /></span>
            </li>
            <li>
              <a href="https://www.python.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block"><MdText text={inhalt.texte.pythonJupyterNumpyPandas} /></a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.derStandardFürDatenanalyse} /></span>
            </li>
            <li>
              <a href="https://en.smath.com/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block"><MdText text={inhalt.texte.smathStudio} /></a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.kostenloseAlternativeZuMathcad} /></span>
            </li>
          </ul>
        </div>

        {/* LCA & Nachhaltigkeit */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Leaf className="text-shiraz" size={20} />
            <h3 className="text-lg font-bold text-text-main"><MdText text={inhalt.texte.lcaNachhaltigkeit} /></h3>
          </div>
          <ul className="space-y-4">
            <li>
              <a href="https://www.openlca.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">openLCA</a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.professionelleOpenSourceSoftware} /></span>
            </li>
            <li>
              <a href="https://www.oekobaudat.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">ÖKOBAUDAT</a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.keineSoftwareAberDie} /></span>
            </li>
            <li>
              <a href="https://www.bauteileditor.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block">eLCA</a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.kostenlosesOnlineToolDes} /></span>
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
              <a href="https://windows.lbl.gov/software/therm" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block"><MdText text={inhalt.texte.thermLbnl} /></a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.kostenloses2dWärmeübertragungsprogrammZu} /></span>
            </li>
            <li>
              <a href="https://wufi.de/de/software/wufi-pro/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block"><MdText text={inhalt.texte.wufiLightEdu} /></a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.softwareZurBerechnungDes} /></span>
            </li>
            <li>
              <a href="https://www.ubakus.de/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block"><MdText text={inhalt.texte.ubakusEhemUWert} /></a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.onlineToolZurBerechnung} /></span>
            </li>
          </ul>
        </div>

        {/* Programmierung & Tools */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-home-grau/30 pb-2">
            <Code className="text-shiraz" size={20} />
            <h3 className="text-lg font-bold text-text-main"><MdText text={inhalt.texte.programmierungTools} /></h3>
          </div>
          <ul className="space-y-4">
            <li>
              <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold block"><MdText text={inhalt.texte.visualStudioCode} /></a>
              <span className="text-sm text-text-main/70"><MdText text={inhalt.texte.derStandardEditorFür} /></span>
            </li>
            <li>
              <a href="https://dynamobim.org/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">Dynamo</a> / <a href="https://www.grasshopper3d.com/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">Grasshopper</a>
              <span className="text-sm text-text-main/70 block mt-1"><MdText text={inhalt.texte.visuelleProgrammierungFürRevit} /></span>
            </li>
            <li>
              <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold">Git</a> / <a href="https://education.github.com/pack" target="_blank" rel="noopener noreferrer" className="text-shiraz hover:underline font-bold"><MdText text={inhalt.texte.githubStudentPack} /></a>
              <span className="text-sm text-text-main/70 block mt-1"><MdText text={inhalt.texte.versionskontrolleFürCodeUnd} /></span>
            </li>
          </ul>
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Bausoftware', url: 'https://de.wikipedia.org/wiki/Bausoftware' },
          { title: 'Finite-Elemente-Methode', url: 'https://de.wikipedia.org/wiki/Finite-Elemente-Methode' },
          { title: inhalt.werte.computerAidedDesign, url: 'https://de.wikipedia.org/wiki/CAD' }
        ]}
        literatur={inhalt.daten["Software.literatur"]}
        regelwerke={inhalt.daten["Software.regelwerke"]}
        formeln={inhalt.daten["Software.formeln"]}
      />
    </div>
  );
}
