import { Globe, ShieldCheck, Building2, Layers, RefreshCw, BookOpen, Library, Target, Clock } from 'lucide-react';

export interface DefinitionenTabProps {

}

export function DefinitionenTab({  }: DefinitionenTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Einführung & Leitbild */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-shiraz/10 text-shiraz">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-main">
              Terminologische &amp; Technische Begriffsbestimmungen
            </h3>
            <p className="text-xs text-text-main/70">
              Wissenschaftliche Herleitung, völkerrechtliche Meilensteine und ingenieurtechnische Normierung (DIN EN 15643, DIN EN 15978, Leitfaden Nachhaltiges Bauen)
            </p>
          </div>
        </div>
    
        <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 text-xs text-text-main/80 leading-relaxed mb-6">
          <p>
            Der Begriff <strong>„Nachhaltigkeit“</strong> entstammt historisch der sächsischen Forstwirtschaft (Hans Carl von Carlowitz, 1713) 
            und wurde über den <strong>Brundtland-Bericht (1987)</strong> und die <strong>Rio-Deklaration (1992)</strong> völkerrechtlich verankert. 
            Im Bauwesen wandelt sich die Definition von einer rein philosophisch-ethischen Leitlinie zu einem 
            <strong> quantifizierbaren, normativ geregelten Ingenieuransatz</strong>: Nachhaltiges Bauen umfasst die integrale Optimierung aller 
            Schutzgüter über den vollständigen Lebenszyklus (Rohstoffgewinnung bis Rezyklierung) auf Basis reproduzierbarer Messgrößen 
            (Ökobilanzierung nach DIN EN 15978, Lebenszykluskosten LCC nach ISO 15686-5 bzw. DIN EN 16627 und soziokulturelle Kriterien nach DIN EN 15643).
          </p>
        </div>
    
        {/* SEKTION 1: NACHHALTIGKEIT (ALLGEMEIN) */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Globe className="text-shiraz w-5 h-5" />
              1. Nachhaltigkeit (Allgemeine Definition)
            </h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
              Generelle Definition &amp; Systemtheorie
            </span>
          </div>
    
          {/* Box: Wortlaut Brundtland */}
          <div className="p-4 rounded-xl border border-shiraz/20 bg-shiraz/5">
            <span className="text-[10px] uppercase font-bold text-shiraz tracking-wider block mb-1">
              Völkerrechtliche Leitdefinition (WCED 1987 / UN General Assembly)
            </span>
            <blockquote className="text-xs sm:text-sm italic font-medium text-text-main leading-relaxed">
              „Nachhaltige Entwicklung ist eine Entwicklung, die den Bedürfnissen der heutigen Generation entspricht, 
              ohne die Möglichkeiten künftiger Generationen zu gefährden, ihre eigenen Bedürfnisse zu befriedigen.“
            </blockquote>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-shiraz/15 text-[11px] text-text-main/70">
              <span><strong>Quelle:</strong> UN World Commission on Environment and Development (Brundtland-Bericht „Our Common Future“, 1987, Kap. 2)</span>
              <span className="font-mono">Resolution 42/187 der UN-Generalversammlung</span>
            </div>
          </div>
    
          {/* Historie & 3-Säulen-Modell */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
              <h5 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-700" />
                Historischer forstwirtschaftlicher Ursprung
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed mb-2">
                Geprägt von <strong>Hans Carl von Carlowitz (1713)</strong> in seinem Werk <em>„Sylvicultura Oeconomica“</em>: 
                Es darf in einem Waldgebiet immer nur so viel Holz geschlagen werden, wie durch planmäßige Aufforstung 
                kontinuierlich nachwachsen kann.
              </p>
              <p className="text-[11px] text-text-main/70">
                <strong>Ingenieurmäßige Übertragung:</strong> Entnahmerate erneuerbarer Ressourcen darf Regenerationsrate nicht übersteigen; 
                Schadstoffemissionen dürfen Assimilationskapazität der Biosphäre nicht überschreiten (Herman Daly, 1990).
              </p>
            </div>
    
            <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
              <h5 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-700" />
                Das klassische 3-Säulen-Modell &amp; Grenzen des Wachstums
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed mb-2">
                Gleichrangigkeit von <strong>Ökologie</strong> (Erhalt der natürlichen Lebensgrundlagen), 
                <strong>Ökonomie</strong> (dauerhafte Tragfähigkeit und Wohlstand) und 
                <strong>Sozialem</strong> (Verteilungsgerechtigkeit, Gesundheit, Menschenwürde).
              </p>
              <p className="text-[11px] text-text-main/70">
                <strong>Quelle:</strong> Enquete-Kommission des Deutschen Bundestages „Schutz des Menschen und der Umwelt“ (1998); 
                Meadows et al.: „The Limits to Growth“ (Club of Rome, 1972).
              </p>
            </div>
          </div>
    
          {/* Planetare Belastungsgrenzen (Planetary Boundaries) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-off-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <strong className="text-xs font-bold text-text-main flex items-center gap-2">
                <Target className="w-4 h-4 text-shiraz" />
                Systemgrenzen: Konzept der planetaren Grenzen (Planetary Boundaries)
              </strong>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                Rockström et al. (2009) / Richardson et al. (2023)
              </span>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Nachhaltigkeit bedeutet zwingend das Einhalten des <em>„Safe Operating Space“</em> der Menschheit. 
              Von den 9 definierten Erdsystemgrenzen sind aktuell 6 überschritten (Klimawandel, Biosphärenintegrität, Landnutzungsänderung, 
              Süßwassernutzung, biogeochemische Kreisläufe N/P sowie Einbringung neuartiger Stoffe). 
              Das Bauwesen ist an mindestens 5 dieser Überschreitungen als primärer Verursacher beteiligt.
            </p>
          </div>
    
          {/* Die drei Umsetzungsstrategien */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
            <strong className="text-xs font-bold text-text-main block mb-2">
              Die drei operationellen Grundstrategien nach Huber (1995) &amp; v. Weizsäcker:
            </strong>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-off-white border border-home-grau/20">
                <strong className="text-shiraz block font-bold mb-1">1. Effizienz</strong>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Verbesserung des Verhältnisses von Nutzen zu Ressourceneinsatz (z. B. höherfeste Betone mit weniger Zementmasse, Wärmedämmung, LED-Licht).
                </p>
              </div>
              <div className="p-3 rounded-lg bg-off-white border border-home-grau/20">
                <strong className="text-shiraz block font-bold mb-1">2. Konsistenz</strong>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Einklang anthropogener Stoffströme mit biogeochemischen Kreisläufen; abfallfreie Zirkularität (Cradle-to-Cradle, nachwachsende Rohstoffe, 100 % Recycling).
                </p>
              </div>
              <div className="p-3 rounded-lg bg-off-white border border-home-grau/20">
                <strong className="text-shiraz block font-bold mb-1">3. Suffizienz</strong>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Hinterfragen des Bedarfs und Begrenzung des Verbrauchs auf das Notwendige (Reduktion von Wohnfläche pro Kopf, Umbau statt Neubau, Verzicht auf TGA-Überfrachtung).
                </p>
              </div>
            </div>
          </div>
        </div>
    
        {/* SEKTION 2: NACHHALTIGES BAUEN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Building2 className="text-shiraz w-5 h-5" />
              2. Nachhaltiges Bauen (Fachspezifische Ingenieurdefinition)
            </h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-shiraz/10 text-shiraz font-semibold">
              Normierte Ingenieurdisziplin
            </span>
          </div>
    
          {/* Normative Definition nach DIN EN 15643 & BMWSB Leitfaden */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
            <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider block mb-1">
              Normative Begriffsbestimmung (DIN EN 15643 / Leitfaden Nachhaltiges Bauen)
            </span>
            <blockquote className="text-xs sm:text-sm font-medium text-text-main leading-relaxed">
              „Nachhaltiges Bauen ist die zielgerichtete Konzeption, Planung, Errichtung, Nutzung, Instandhaltung und der Rückbau 
              von baulichen Anlagen derart, dass über deren gesamten Lebenszyklus hinweg der Verbrauch an Energie und Ressourcen minimiert, 
              die Umweltwirkungen auf ein zukunftsverträgliches Maß begrenzt, die Lebenszykluskosten optimiert und die gesellschaftlichen 
              sowie gesundheitlichen Anforderungen an Behaglichkeit, Sicherheit und Funktionalität vollumfänglich erfüllt werden.“
            </blockquote>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-blue-200/60 text-[11px] text-text-main/70">
              <span><strong>Quellen:</strong> DIN EN 15643 (Nachhaltigkeit von Bauwerken – Allgemeine Grundsätze); BMWSB Leitfaden Nachhaltiges Bauen (2021)</span>
              <span className="font-mono">DIN EN ISO 15392 (Allgemeine Grundsätze im Hoch- und Tiefbau)</span>
            </div>
          </div>
    
          {/* Die 3 Schutzziele & Bewertungsdimensionen im Bauwesen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-home-grau/20 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider">1. Ökologische Qualität</strong>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">LCA</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Schutz der globalen und lokalen Umwelt sowie Schonung natürlicher Ressourcen über alle Lebenszyklusphasen.
                </p>
                <ul className="text-[11px] text-text-main/70 space-y-1.5 list-disc list-inside">
                  <li><strong>Treibhauspotenzial (GWP)</strong> nach DIN EN 15978 / 15804</li>
                  <li><strong>Graue Energie / Embodied Carbon</strong> (A1–A5)</li>
                  <li><strong>Ressourceninanspruchnahme:</strong> Primärenergie (PENRT/PERE), Süßwasserverbrauch</li>
                  <li><strong>Flächeninanspruchnahme</strong> &amp; Versiegelung</li>
                  <li><strong>Zirkularität &amp; Rückbaubarkeit</strong> (Design for Disassembly)</li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                Referenz: ÖKOBAUDAT / EPD nach DIN EN 15804+A2
              </div>
            </div>
    
            <div className="p-4 rounded-2xl bg-white border border-home-grau/20 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider">2. Ökonomische Qualität</strong>
                  <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">LCC</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Optimierung der Gesamtwirtschaftlichkeit über den Lebenszyklus; Abkehr von rein investitionskostengetriebener Planung.
                </p>
                <ul className="text-[11px] text-text-main/70 space-y-1.5 list-disc list-inside">
                  <li><strong>Lebenszykluskosten (LCC)</strong> nach ISO 15686-5, DIN EN 16627 &amp; DIN 18960</li>
                  <li><strong>Herstellungskosten (KG 300/400)</strong> vs. Betriebs- &amp; Instandhaltungskosten</li>
                  <li><strong>Wertstabilität &amp; Drittverwendungsfähigkeit:</strong> Umnutzungsflexibilität</li>
                  <li><strong>Risikoabsicherung:</strong> Vermeidung von <em>Stranded Assets</em> (CRREM-Pfad)</li>
                  <li><strong>Restwert von Sekundärbaustoffen:</strong> Gebäude als Materialbank</li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                Referenz: DIN 18960 / Barwertmethode (NPV)
              </div>
            </div>
    
            <div className="p-4 rounded-2xl bg-white border border-home-grau/20 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider">3. Soziokulturelle &amp; Funktionale Qualität</strong>
                  <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">Komfort</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Sicherung von Gesundheit, Behaglichkeit und Leistungsfähigkeit der Nutzer sowie baukulturelle Integration.
                </p>
                <ul className="text-[11px] text-text-main/70 space-y-1.5 list-disc list-inside">
                  <li><strong>Gesundheit &amp; Innenraumhygiene:</strong> VOC-Begrenzung (AgBB-Schema), Radon</li>
                  <li><strong>Thermischer Komfort</strong> (Sommerlicher Wärmeschutz DIN 4108-2)</li>
                  <li><strong>Visueller Komfort:</strong> Tageslichtquotient (DIN EN 17037)</li>
                  <li><strong>Akustischer Komfort:</strong> Schallschutz (DIN 4109) &amp; Raumakustik (DIN 18041)</li>
                  <li><strong>Barrierefreiheit</strong> (DIN 18040-1/2) &amp; baukulturelle Gestaltqualität</li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                Referenz: DIN EN 16309 / ASR A3.6 / DIN 18040
              </div>
            </div>
          </div>
    
          {/* Querschnittsqualitäten: Technische Qualität & Prozessqualität */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
              <strong className="text-xs font-bold text-text-main flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-shiraz" />
                Technische Qualität (Querschnittskriterium)
              </strong>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Tragsicherheit, Brandschutz (DIN 4102 / DIN EN 13501), Schall- und Feuchteschutz (DIN 4108-3), 
                Dauerhaftigkeit und Robustheit von Konstruktionen sowie Reinigungs- und Instandhaltungsfreundlichkeit.
              </p>
            </div>
    
            <div className="p-4 rounded-xl border border-home-grau/20 bg-white">
              <strong className="text-xs font-bold text-text-main flex items-center gap-2 mb-1">
                <RefreshCw className="w-4 h-4 text-shiraz" />
                Prozessqualität (Integrale Planung)
              </strong>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Integrale Planung aller Fachdisziplinen von Leistungsphase 0/1 an, BIM-gestützte Materialnachverfolgung, 
                strukturierte Baustellenabwicklung, Monitoring und Qualitätssicherung bei Inbetriebnahme (Inbetriebnahmemanagement).
              </p>
            </div>
          </div>
    
          {/* Differenzierungs-Matrix: Konventionell vs. Nachhaltig */}
          <div className="overflow-x-auto rounded-xl border border-home-grau/20">
            <table className="w-full text-xs text-left">
              <thead className="bg-off-white text-text-main border-b border-home-grau/20">
                <tr>
                  <th className="p-3 font-bold">Kriterium</th>
                  <th className="p-3 font-bold text-slate-600">Konventionelles Bauen</th>
                  <th className="p-3 font-bold text-shiraz">Nachhaltiges Bauen (Stand der Technik)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/10 bg-white text-text-main/80">
                <tr>
                  <td className="p-3 font-semibold text-text-main">Betrachtungszeitraum</td>
                  <td className="p-3">Errichtung / Übergabe (Investitionskosten KG 300/400)</td>
                  <td className="p-3 font-medium text-text-main">Gesamter Lebenszyklus (50–100 Jahre: Herstellung, Betrieb, Nachnutzung)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text-main">Klimabilanz</td>
                  <td className="p-3">Fokus nur auf Betriebsenergie (GEG-Primärenergiebedarf)</td>
                  <td className="p-3 font-medium text-text-main">Ganzheitliche Ökobilanz: Embodied Carbon (A1–A5) + Operational Carbon (B1–B7)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text-main">Baustoffauswahl</td>
                  <td className="p-3">Preis, einfache Verarbeitbarkeit, lineare Entsorgung</td>
                  <td className="p-3 font-medium text-text-main">Zirkularität, Schadstofffreiheit (AgBB), EPD-Deklaration, sortenreine Lösbarkeit</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text-main">Gebäudebestand</td>
                  <td className="p-3">Abriss und Neubau als Standardreflex</td>
                  <td className="p-3 font-medium text-text-main">Bestandserhalt als Primärstrategie (Erhalt der gebundenen grauen Energie)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text-main">Lebenszyklusende</td>
                  <td className="p-3">Deponierung oder Downcycling im Straßenunterbau</td>
                  <td className="p-3 font-medium text-text-main">Urban Mining, selektiver Rückbau, Re-Use von Bauteilen, geschlossenes Recycling</td>
                </tr>
              </tbody>
            </table>
          </div>
    
          {/* Fundierte Quellenübersicht */}
          <div className="p-4 rounded-xl border border-slate-200 bg-off-white text-xs space-y-2">
            <strong className="text-text-main font-bold flex items-center gap-1.5">
              <Library className="w-4 h-4 text-shiraz" />
              Maßgebliche wissenschaftliche &amp; normative Quellenangaben:
            </strong>
            <ul className="text-[11px] text-text-main/70 space-y-1 list-disc list-inside">
              <li><strong>Brundtland-Bericht:</strong> World Commission on Environment and Development (WCED): <em>Our Common Future</em>, Oxford University Press, 1987.</li>
              <li><strong>DIN EN 15643:2021-12:</strong> <em>Nachhaltigkeit von Bauwerken – Rahmenbedingungen für die Bewertung von Gebäuden und Ingenieurbauwerken</em>. Beuth Verlag, Berlin.</li>
              <li><strong>DIN EN 15978:2026-09:</strong> <em>Nachhaltigkeit von Bauwerken – Bewertung der Umweltqualität von Gebäuden – Methodik</em> (ersetzt DIN EN 15978:2012-10). DIN Media.</li>
              <li><strong>DIN EN ISO 15392:2020-05:</strong> <em>Nachhaltigkeit im Hoch- und Tiefbau – Allgemeine Grundsätze</em> (ISO 15392:2019).</li>
              <li><strong>BMWSB (Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen):</strong> <em>Leitfaden Nachhaltiges Bauen – Zukunftsfähiges Planen, Bauen und Betreiben von Gebäuden</em>, Berlin, 2021.</li>
              <li><strong>Rockström, J. et al. / Richardson, K. et al.:</strong> <em>Earth beyond six of nine planetary boundaries</em>, Science Advances 9 (37), 2023.</li>
              <li><strong>Carlowitz, H. C. v.:</strong> <em>Sylvicultura Oeconomica, oder haußwirthliche Nachricht und Naturmäßige Anweisung zur Wilden Baum-Zucht</em>, Leipzig, 1713.</li>
              <li><strong>Daly, H. E.:</strong> <em>Toward some operational principles of sustainable development</em>, Ecological Economics 2 (1), 1990, S. 1–6.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
