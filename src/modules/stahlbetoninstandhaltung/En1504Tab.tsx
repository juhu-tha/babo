// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import { Shield, Wrench, Droplets, Layers } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { BlockMath } from 'react-katex';
import { formatDeWert } from '@/src/utils/numberFormat';
import { en1504Prinzipien } from './daten';

export default function En1504Tab() {
  return (
    <div className="space-y-6">
      <div className="bg-white border-y border-r border-l-4 border-emerald-500 border-home-grau/20 p-4 rounded-xl">
        <h3 className="font-bold text-emerald-800 flex items-center gap-2">
          <Shield size={20} />
          DIN EN 1504 (Produkte und Systeme für den Schutz und die Instandsetzung)
        </h3>
        <p className="text-emerald-900 mt-2 text-sm">
          <FormulaText text="Die europäische Normenreihe DIN EN 1504 definiert 11 Prinzipien für den Schutz und die Instandsetzung von Betontragwerken. Prinzipien 1-6 beziehen sich auf Betonschäden, Prinzipien 7-11 auf Bewehrungskorrosion." />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {en1504Prinzipien.map((prinzip) => (
          <div key={prinzip.id} className="bg-white p-5 rounded-xl shadow-sm border border-home-grau/30 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-shiraz/5 flex items-center justify-center font-bold text-shiraz shrink-0 border border-shiraz/10">
                  {formatDeWert(prinzip.id)}
                </div>
                <div>
                  <span className="text-xs font-bold text-home-grau uppercase tracking-wider">{prinzip.code}</span>
                  <h4 className="font-bold text-text-main leading-tight">{prinzip.name}</h4>
                </div>
              </div>
              <p className="text-sm text-text-main/90 mb-4 bg-off-white p-3 rounded-lg border border-home-grau/10 min-h-[70px] flex items-center"><FormulaText text={prinzip.desc} /></p>
            </div>
            
            {/* Examples Section */}
            <div className="mt-2 border-t border-home-grau/30 pt-3">
              <span className="text-xs font-bold text-shiraz uppercase tracking-wider block mb-2">Instandsetzungsverfahren:</span>
              <ul className="list-disc pl-4 space-y-1.5">
                {prinzip.examples.map((ex, exIdx) => (
                  <li key={exIdx} className="text-xs text-text-main leading-relaxed">
                    <FormulaText text={ex} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED FOCUS SECTION: RISSINJEKTION & CARBONLAMELLEN */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6 mt-6">
        <h3 className="font-extrabold text-lg text-slate-950 flex items-center gap-2 border-b border-home-grau/20 pb-3">
          <Wrench className="text-shiraz" size={22} />
          Fokus-Sanierungsverfahren: Rissinjektion &amp; Carbonfaser-Ertüchtigung
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. RISSINJEKTION */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/25 space-y-4">
            <h4 className="font-bold text-sm text-shiraz flex items-center gap-2 border-b border-slate-100 pb-2">
              <Droplets size={18} /> Rissinjektion &amp; Rissverpressung (DIN EN 1504-5)
            </h4>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Risse im Beton beeinträchtigen entweder die Dauerhaftigkeit (Zutritt von Chloriden und Sauerstoff zur Bewehrung) oder die Standsicherheit. Die Injektion füllt den Risshohlraum dauerhaft aus.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/15 space-y-1">
                <span className="font-bold text-xs text-slate-900 block">Klassifizierung der Injektionsstoffe (Füllgüter):</span>
                <ul className="text-[11px] text-text-main/95 space-y-2 leading-relaxed">
                  <li>
                    <strong>F (Kraftschlüssiges Füllen / Kraftübertragend):</strong> Epoxidharze (EP) besitzen enorme Haft- und Zugfestigkeiten. Sie übertragen Zug- und Druckspannungen und stellen den Bauteilverbund wieder her (f_ct,EP &gt; 15 N/mm²).
                  </li>
                  <li>
                    <strong>D (Dehnfähiges Füllen / Abdichtend):</strong> Polyurethane (PUR). Ideal für bewegte Risse. Sie reagieren bei Wasserkontakt unter leichter Schaumbildung und dichten das Bauteil dauerhaft elastisch ab.
                  </li>
                  <li>
                    <strong>S (Quellfähiges Füllen):</strong> Acrylatgele. Werden vor allem für flächige Mauerwerksabdichtungen (Schleierinjektion) verwendet.
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/15 space-y-1">
                <span className="font-bold text-xs text-slate-900 block">Mechanische Strömungsbeziehung (Hagen-Poiseuille):</span>
                <p className="text-[11px] text-text-main/85 leading-relaxed">
                  Die Fließgeschwindigkeit des Injektionsharzes im Riss ist umgekehrt proportional zur dynamischen Viskosität (&eta;) und quadratisch abhängig von der Rissbreite (w). Feine Risse (w &lt; 0,2 mm) erfordern Viskositäten von &eta; &lt; 100 mPa·s und hohe Verpressdrücke.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="font-semibold text-xs text-slate-950 block mb-1.5">⚙️ Baustellenpraxis &amp; Qualitätssicherung:</span>
                <ol className="list-decimal pl-4 text-[11px] text-text-main/80 space-y-1">
                  <li><strong>Packersetzung:</strong> Bohrpacker werden abwechselnd links und rechts des Risses unter einem Winkel von 45° gesetzt, um den Riss im Bauteilinneren zu kreuzen.</li>
                  <li><strong>Verdämmung:</strong> Der Rissspalt im Sichtbereich wird zugegipst oder mit Epoxidharz zugespachtelt, damit das Harz beim Verpressen nicht austritt.</li>
                  <li><strong>Verpressung:</strong> Von unten nach oben verpressen, bis das material am nächsten Packer austritt.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* 2. CARBONLAMELLEN */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/25 space-y-4">
            <h4 className="font-bold text-sm text-shiraz flex items-center gap-2 border-b border-slate-100 pb-2">
              <Layers size={18} /> Tragwerksertüchtigung mit Carbonlamellen (CFK)
            </h4>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Einführung höherer Lasten oder Korrosionsschäden verlangen oft eine Erhöhung des Bewehrungsquerschnitts. Kohlenstofffaserverstärkte Kunststoffe (CFK) bieten eine hochfeste, leichte Alternative zur klassischen Stahlbetonverstärkung.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/15 space-y-1.5">
                <span className="font-bold text-xs text-slate-900 block">Klassifizierung &amp; Anwendungstechnologien:</span>
                <ul className="text-[11px] text-text-main/95 space-y-2 leading-relaxed">
                  <li>
                    <strong>Aufgeklebte Lamellen (Aussen):</strong> CFK-Lamellen werden mittels Epoxidharzkleber direkt auf die vorbehandelte Beton-Zugzone geklebt. Typisch bei Deckenbalken zur Biegemomenterhöhung.
                  </li>
                  <li>
                    <strong>In Schlitze eingeklebte Lamellen (Schlitzlamellen):</strong> Schlitze werden ca. 15-25 mm tief in den Beton gefräst. Kohlenstoff-Streifen werden hochkant eingeschlitzt und verklebt. Bietet extrem guten Verbund und ist brandschutztechnisch geschützter.
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/15 space-y-1">
                <span className="font-bold text-xs text-slate-900 block">Bruchmechanischer Grenznachweis (Verbundbruch):</span>
                <p className="text-[11px] text-text-main/85 leading-relaxed">
                  Die hohe Zugfestigkeit des CFK (ca. 3.000 N/mm²) kann nur ausgenutzt werden, wenn kein Schälbruch eintritt. Der Verbundversatz wird limitiert durch die maximale Verankerungskraft (F_bd), welche stark von der Betonzugfestigkeit abhängt:
                  <div className="bg-white p-2 rounded border border-home-grau/15 text-center my-1">
                    <BlockMath math="F_{bd} = b_f \cdot \sqrt{2 \cdot E_f \cdot t_f \cdot G_{cbd}}" />
                  </div>
                  Wobei G_cbd die spezifische Verbundenergie und E_f der Elastizitätsmodul des Materials sind. Die Betonoberflächen-Abreißfestigkeit muss zwingend ≥ 1,5 N/mm² betragen.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="font-semibold text-xs text-slate-950 block mb-1.5">🛡️ Brandschutz &amp; Einschränkung:</span>
                <p className="text-[11px] text-text-main/80 leading-relaxed">
                  Epoxidharz-Klebstoffe sind hitzeempfindlich. Ab ca. 55-80°C (Glasübergangstemperatur T_g) verliert der Kleber seine Wirksamkeit. Daher müssen CFK-Systeme im Hochbau fast immer mit Brandschutzdecken oder dämmschichtbildenden Beschichtungen geschützt werden.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Didaktische Zusammenfassung */}
        <div className="p-3.5 bg-rose-50/40 border border-shiraz/20 rounded-xl text-xs text-slate-800 leading-relaxed">
          <span className="font-bold text-shiraz block">💡 Zusammenfassung für den Bauingenieur:</span>
          Die Kombination aus <strong>Rissinjektion</strong> (Beseitigung innerer Schwachstellen, Wiederherstellung Korrosionsschutz) und der Applikation von <strong>Carbonlamellen</strong> (Tragfähigkeitsertüchtigung im Zuggurt) ermöglicht ressourcenschonendes Bauen im Bestand ohne nennenswerte Bauwerkshöhenminderungen oder Eigengewichtserhöhung.
        </div>
      </div>
    </div>
  );
}
