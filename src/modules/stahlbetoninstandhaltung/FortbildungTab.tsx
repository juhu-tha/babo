// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import { Wrench, AlertTriangle, Activity, BookOpen } from 'lucide-react';

export default function FortbildungTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white border-y border-r border-l-4 border-amber-500 border-home-grau/20 p-4 rounded-xl">
        <h3 className="font-bold text-amber-800 flex items-center gap-2">
          <AlertTriangle size={20} />
          Qualifikationsanforderungen in der Betoninstandsetzung
        </h3>
        <p className="text-amber-900 mt-2 text-sm">
          Die Instandsetzung von Betonbauteilen erfordert spezielles Fachwissen, da Fehler schwerwiegende Folgen für die Standsicherheit und Dauerhaftigkeit haben können. Deshalb schreiben die relevanten Regelwerke besondere Qualifikationen für Planung und Ausführung vor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30">
          <h4 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
            <BookOpen className="text-shiraz" size={20} />
            SKP (Sachkundiger Planer)
          </h4>
          <p className="text-sm text-text-main mb-4">
            <strong>Sachkundiger Planer für Schutz und Instandsetzung von Betonbauteilen</strong>
            <br /><br />
            Die Planung und Überwachung von Instandsetzungsmaßnahmen darf nach TR Instandhaltung nur von sachkundigen Planern durchgeführt werden. Der SKP ist verantwortlich für:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-home-grau">
            <li>Ermittlung des Ist-Zustandes und der Schadensursachen</li>
            <li>Erstellung des Instandsetzungskonzepts</li>
            <li>Auswahl geeigneter Stoffe und Systeme (z.B. OS-Systeme, PCC)</li>
            <li>Bauüberwachung und Qualitätssicherung</li>
          </ul>
          <div className="mt-4 p-3 bg-off-white rounded-lg text-xs text-text-main border border-home-grau/10">
            <strong>Zugangsvoraussetzungen:</strong> I.d.R. abgeschlossenes Ingenieurstudium (Bauwesen) sowie Nachweis besonderer Kenntnisse durch Prüfung oder Zusatzausbildung.
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30">
          <h4 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
            <Wrench className="text-shiraz" size={20} />
            SIVV-Schein
          </h4>
          <p className="text-sm text-text-main mb-4">
            <strong>Schützen, Instandsetzen, Verbinden und Verstärken von Betonbauteilen</strong>
            <br /><br />
            Fachkräfte in den ausführenden Unternehmen müssen nachweislich über die notwendigen verarbeitungstechnischen Kenntnisse verfügen. Der SIVV-Schein richtet sich primär an das Baustellenpersonal:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-home-grau">
            <li>Untergrundvorbereitung und -prüfung</li>
            <li>Verarbeitung von Instandsetzungsmörteln (z.B. PCC, SPCC)</li>
            <li>Applikation von Oberflächenschutzsystemen</li>
            <li>Risiko- und Fehlerminimierung auf der Baustelle</li>
          </ul>
          <div className="mt-4 p-3 bg-off-white rounded-lg text-xs text-text-main border border-home-grau/10">
            <strong>Regelwerk:</strong> Nach TR Instandhaltung (bzw. DAfStb) ist der SIVV-Schein für das Aufsichtspersonal (Vorarbeiter, Poliere) auf der Baustelle vorgeschrieben.
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30 md:col-span-2">
          <h4 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
            <Activity className="text-shiraz" size={20} />
            Weitere Qualifikationen & Qualitätssicherung
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-off-white p-4 rounded-lg">
              <strong className="text-text-main block mb-1">E-Schein (Erweiterte betontechnologische Kenntnisse)</strong>
              <p className="text-home-grau">Berechtigt u.a. zur Überwachung von Beton der Überwachungsklassen 2 und 3. Erforderlich für den verantwortlichen Fachingenieur in Transportbetonwerken und Bauunternehmen.</p>
            </div>
            <div className="bg-off-white p-4 rounded-lg">
              <strong className="text-text-main block mb-1">Düsenführerschein (SPCC / Spritzbeton)</strong>
              <p className="text-home-grau">Spezieller Nachweis für das Personal, das den Spritzbeton oder Spritzmörtel an der Düse aufträgt (oft zwingend erforderlich bei Verstärkungsmaßnahmen).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
