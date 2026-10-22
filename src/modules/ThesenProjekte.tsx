import React, { useState } from 'react';
import { 
  FileText, 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  Send, 
  Mail, 
  User,
  CheckCircle,
  ClipboardList
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

interface ContactForm {
  name: string;
  email: string;
  matrikelNumber: string;
  program: string;
  topicType: 'bachelor' | 'master' | 'project' | 'other';
  area: string;
  ownProposal: string;
  vorkenntnisse: string;
}

export default function ThesenProjekte() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    matrikelNumber: '',
    program: 'Bauingenieurwesen (B.Eng.)',
    topicType: 'master',
    area: 'Bauen im Bestand',
    ownProposal: '',
    vorkenntnisse: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate real action
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      matrikelNumber: '',
      program: 'Bauingenieurwesen (B.Eng.)',
      topicType: 'master',
      area: 'Bauen im Bestand',
      ownProposal: '',
      vorkenntnisse: ''
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full mt-4">
      
      {/* Upper Hero Welcome Panel */}
      <div className="bg-white text-text-main rounded-2xl p-6 md:p-8 border border-home-grau/20 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-shiraz/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-off-white rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="flex flex-col gap-2.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-off-white border border-home-grau/10 rounded text-xs font-bold uppercase tracking-wider text-home-grau self-start">
              <GraduationCap size={12} className="text-shiraz" />
              Akademische Arbeiten
            </span>
            <h2 className="text-lg md:text-2xl font-bold tracking-tight text-text-main">
              Thesen &amp; Semesterprojekte
            </h2>
            <p className="text-home-grau text-sm leading-relaxed font-normal">
              Hier finden Sie Informationen zu Abschlussarbeiten (Bachelor/Master) sowie semesterbegleitenden Projektarbeiten am Institut für Bau und Immobilie (ibi) der THA unter der Betreuung von Prof. Huber.
            </p>
          </div>
          <div className="hidden lg:flex w-16 h-16 bg-off-white border border-home-grau/10 rounded-xl items-center justify-center text-text-main shrink-0">
            <FileText size={28} className="text-shiraz" />
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Main Info and Status */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main TBA Status Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-home-grau/20 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-shiraz/10 rounded-xl flex items-center justify-center text-shiraz shrink-0 mt-0.5">
                <Sparkles size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-text-main flex items-center gap-2 flex-wrap">
                  Thesen und Semesterprojekte bei Prof. Huber
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/50 text-xs font-bold uppercase tracking-wider rounded">
                    Betreuung Aktiv
                  </span>
                </h2>
                <div className="h-[1px] bg-home-grau/10 my-4" />
                
                <p className="text-sm text-text-main/85 leading-relaxed mb-6">
                  Akademische Arbeiten (Bachelor- / Masterthesis) und Semesterprojekte unter der wissenschaftlichen Betreuung von <strong>Prof. Dr.-Ing. Jürgen Huber</strong> orientieren sich eng an dessen Lehrveranstaltungen und Forschungsaktivitäten. Nachfolgend finden Sie die zentralen <strong>Fachdisziplinen</strong> aus dem Curriculum der TH Augsburg zusammen mit beispielhaften Fragestellungen und Verweisen auf die interaktiven Berechnungsmodule dieses Boards zur zeitlichen und fachlichen Vorbereitung.
                </p>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-main/50 flex items-center gap-1.5 border-b border-home-grau/10 pb-2">
                    <GraduationCap size={14} className="text-shiraz" />
                    Fachdisziplinen &amp; Forschungsschwerpunkte für Abschlussarbeiten:
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        title: '1. Baustoffkunde & Werkstoffkunde',
                        focus: 'Untersuchung physikalisch-mechanischer Eigenschaften sowie Entwicklung CO₂-reduzierter Bindemittel.',
                        examples: 'Druckfestigkeitsentwicklung von Öko-Zementen, Einfluss von Zusatzmitteln auf das Hydratationsverhalten, E-Modul-Bestimmung im Baustofflabor.',
                        modules: ['Biegezugversuch', 'Hydratation', 'E-Modul', 'Zementchemie', 'Messen & Prüfen']
                      },
                      {
                        title: '2. Recycling, Abfälle & Altlasten',
                        focus: 'Schließung von Materialkreisläufen, Ressourceneffizienz und der gesetzeskonforme Rückbau von Tragstrukturen.',
                        examples: 'Qualitätskontrolle von Recycling-Zuschlagstoffen (RC-Beton), Verwertung mineralischer Abbruchabfälle, Schadstoffentfrachtung im Bestand.',
                        modules: ['Kreislaufwirtschaft', 'Rückbau', 'Schadstoffe']
                      },
                      {
                        title: '3. Stahlbetoninstandhaltung',
                        focus: 'Diagnostik und Ertüchtigung geschädigter Stahlbetonbauteile zur Lebenszyklusverlängerung.',
                        examples: 'Carbonatisierungstiefe & Chloridinduzierte Korrosion, Deponierungs- und Monitoringkonzepte, Instandsetzungsplanung nach DAfStb-Richtlinie.',
                        modules: ['Korrosion', 'Zustandsbewertung']
                      },
                      {
                        title: '4. Bauen im Bestand',
                        focus: 'Bauwerksanalytik, Zustandserfassung und Traglastbewertung historischer Konstruktionen.',
                        examples: 'Zerstörungsfreie Materialprüfung (NDT) vor Ort, Bestimmung historischer Materialkennwerte, Sanierungskonzepte für Mauerwerksbauten.',
                        modules: ['Bestand', 'Bauwerkserfassung', 'Historische Materialkennwerte']
                      },
                      {
                        title: '5. Bauschäden & Bauschadensanalyse',
                        focus: 'Ursachenforschung bei Bauteilmängeln und bauphysikalischen Schädigungsmechanismen.',
                        examples: 'Holzzerstörende Pilze und Holzkorrosion, Rissursachen und Rissbreitenbeschränkung unter Zwangbeanspruchung, Feuchtetransport in Putzen und Mörteln.',
                        modules: ['Bauschäden', 'Holzkorrosion', 'Rissbreite', 'Zwang', 'Putze & Mörtel']
                      },
                      {
                        title: '6. Nachhaltiges Bauen & Klimaschutz',
                        focus: 'Ökobilanzierung (LCA), Erfassung grauer Energie und Konformitätsprüfungen für Zertifizierungen.',
                        examples: 'Gebäude-Ökobilanzierung nach QNG- und DGNB-Kriterien, Nutzen spezifischer Produkt-EPDs im Vergleich zu Generischen ÖKOBAUDAT-Sicherheitsbeiwerten.',
                        modules: ['Nachhaltigkeit', 'LCA & EPD-Leitfaden']
                      },
                      {
                        title: '7. Beton- und Spannbetonbau',
                        focus: 'Optimierung von Hochleistungs-Betonsystemen und Bemessung unter mechanischer Beanspruchung.',
                        examples: 'Fließfähigkeit von Ultra-High Performance Concrete (UHPC), Bruchverhalten von Faserbeton, Biegebemessung und Verankerungslängen carbonbewehrter Bauteile.',
                        modules: ['UHPC', 'Carbonbeton', 'Faserbeton', 'Biegebemessung', 'Verankerungslänge']
                      }
                    ].map((fach, fIdx) => (
                      <div key={fIdx} className="p-4 bg-off-white border border-home-grau/10 rounded-xl flex flex-col gap-2 hover:border-shiraz/35 hover:bg-white duration-200 shadow-2xs">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-sm text-text-main tracking-tight">{fach.title}</h4>
                          <span className="text-xs bg-white text-home-grau border border-home-grau/10 font-bold px-2 py-0.5 rounded">Forschung</span>
                        </div>
                        <p className="text-sm text-text-main/80 font-medium leading-relaxed">{fach.focus}</p>
                        <p className="text-xs text-home-grau leading-relaxed italic"><strong className="font-semibold not-italic text-home-grau">Thesis-Themenbeispiele:</strong> {fach.examples}</p>
                        
                        <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-home-grau/10">
                          <span className="text-xs uppercase font-bold text-home-grau/65">Verwandte Module:</span>
                          {fach.modules.map((m, mIdx) => (
                            <span key={mIdx} className="px-2 py-0.5 bg-shiraz/5 border border-shiraz/10 text-shiraz text-xs font-bold rounded">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines on "How to prepare a thesis with Prof. Huber" (Polished Helpful content) */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-home-grau/20 shadow-xs">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2 mb-4">
              <ClipboardList size={20} className="text-home-grau" />
              Ablauf &amp; Anforderungen (Allgemeine Leitlinien)
            </h2>
            <p className="text-sm text-home-grau leading-relaxed mb-6">
              Eine wissenschaftliche Abschlussarbeit oder Projektarbeit verlangt neben hohem persönlichem Engagement ein strukturiertes Vorgehen. Zur optimalen Orientierung dienen folgende Phasen und Standards:
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-off-white border border-home-grau/15 flex items-center justify-center font-bold text-xs text-home-grau shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">Themenfindung &amp; Exposé</h4>
                  <p className="text-xs text-home-grau mt-1 leading-relaxed">
                    Egal ob eigenes Wunschthema (z.B. aus der Praxis / Werkstudententätigkeit) oder ein ausgeschriebenes Thema: Sie erstellen zunächst ein 2-3 seitiges Exposé mit Zielsetzung, Methodik und Zeitplan.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-off-white border border-home-grau/15 flex items-center justify-center font-bold text-xs text-home-grau shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">Anmeldung &amp; Betreuungsvereinbarung</h4>
                  <p className="text-xs text-home-grau mt-1 leading-relaxed">
                    Formaler Start durch Anmeldung beim Prüfungsamt der THA. Festlegung von Erst- und Zweitprüfer:in nach Prüfungsordnung (z. B. Prof. Huber); Praxispartner können die fachliche Betreuung übernehmen.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-off-white border border-home-grau/15 flex items-center justify-center font-bold text-xs text-home-grau shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">Durchführung &amp; Literatursichtung</h4>
                  <p className="text-xs text-home-grau mt-1 leading-relaxed">
                    Nutzung der Hochschulbibliothek, einschlägiger Fachportale und Regelwerke. Bei experimentellen Arbeiten: Laborplanung und Abstimmung mit den Laboringenieuren.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-off-white border border-home-grau/15 flex items-center justify-center font-bold text-xs text-home-grau shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">Kolloquium / Präsentation</h4>
                  <p className="text-xs text-home-grau mt-1 leading-relaxed">
                    Mündliche Verteidigung der erarbeiteten Ergebnisse im Rahmen eines Kolloquiums an der Hochschule.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Mini interactive interest form / Contact */}
        <div className="flex flex-col gap-6">

          {/* Contact Information */}
          <div className="bg-white border border-home-grau/20 shadow-xs p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main tracking-tight flex items-center gap-2">
              <Mail size={16} className="text-shiraz" />
              Kontakt &amp; Betreuung
            </h3>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
                Studiengangsleiter / Lehrgebiete
              </span>
              <h4 className="text-sm font-bold text-text-main">Prof. Dr.-Ing. Huber</h4>
              <p className="text-xs text-home-grau mt-0.5">Fakultät für Architektur und Bauwesen</p>
              <div className="h-[1px] bg-home-grau/10 my-2.5" />
              <p className="text-xs text-home-grau/90 leading-relaxed">
                Fragen zur Eignung Ihres praxisbezogenen Themas oder Initiativbewerbungen richten Sie bitte per E-Mail oder über das nebenstehende Formular direkt an uns.
              </p>
              <a 
                href="mailto:juergen.huber@tha.de" 
                className="inline-flex items-center gap-1.5 mt-3 text-xs text-shiraz font-semibold hover:underline"
              >
                <span>juergen.huber@tha.de</span>
              </a>
            </div>
          </div>
 
          {/* Form for Initiativ-Interesse / Vorreservierung */}
          <div className="bg-white p-6 rounded-2xl border border-home-grau/20 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-home-grau/10">
              <BookOpen size={16} className="text-shiraz" />
              <h3 className="text-sm font-bold text-text-main">
                Thesen-Interesse bekunden
              </h3>
            </div>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <p className="text-xs text-home-grau/90 leading-relaxed">
                  Tragen Sie sich unverbindlich mit Ihrem Wunschgebiet ein. Prof. Huber wird sich bezüglich der Realisierbarkeit melden.
                </p>
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-bold text-home-grau">Name</label>
                  <div className="relative">
                    <User size={12} className="absolute left-3 top-3 text-home-grau/55" />
                    <input 
                      type="text" 
                      required
                      placeholder="Ihr Vor- und Nachname"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full text-xs p-2.5 pl-8 border border-home-grau/25 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-shiraz/40 bg-white text-text-main"
                    />
                  </div>
                </div>
 
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-bold text-home-grau">E-Mail (THA)</label>
                  <div className="relative">
                    <Mail size={12} className="absolute left-3 top-3 text-home-grau/55" />
                    <input 
                      type="email" 
                      required
                      placeholder="nachname@hs-augsburg.de"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full text-xs p-2.5 pl-8 border border-home-grau/25 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-shiraz/40 bg-white text-text-main"
                    />
                  </div>
                </div>
 
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-bold text-home-grau">Studiengang</label>
                  <select 
                    value={formData.program}
                    onChange={(e) => setFormData({...formData, program: e.target.value})}
                    className="w-full text-xs p-2.5 border border-home-grau/25 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-shiraz/40 bg-white text-text-main"
                  >
                    <option>Bauingenieurwesen (B.Eng.)</option>
                    <option>Master Bauingenieurwesen (M.Eng.)</option>
                    <option>Master Projektmanagement (M.Eng.)</option>
                    <option>Fachingenieur Zertifikatsstudiengänge</option>
                    <option>Anderer Studiengang / Extern</option>
                  </select>
                </div>
 
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-bold text-home-grau">Fachdisziplin / Forschungsschwerpunkt</label>
                  <select 
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    className="w-full text-xs p-2.5 border border-home-grau/25 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-shiraz/40 bg-white text-text-main"
                  >
                    <option>1. Baustoffkunde &amp; Werkstoffkunde</option>
                    <option>2. Recycling, Abfälle &amp; Altlasten</option>
                    <option>3. Stahlbetoninstandhaltung</option>
                    <option>4. Bauen im Bestand</option>
                    <option>5. Bauschäden &amp; Bauschadensanalyse</option>
                    <option>6. Nachhaltiges Bauen &amp; Klimaschutz</option>
                    <option>7. Beton- und Spannbetonbau</option>
                  </select>
                </div>
 
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-bold text-home-grau">Art der Arbeit</label>
                  <div className="flex gap-2 text-xs text-text-main">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name="topicType" 
                        checked={formData.topicType === 'master'} 
                        onChange={() => setFormData({...formData, topicType: 'master'})} 
                      />
                      <span>Master</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name="topicType" 
                        checked={formData.topicType === 'bachelor'} 
                        onChange={() => setFormData({...formData, topicType: 'bachelor'})} 
                      />
                      <span>Bachelor</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name="topicType" 
                        checked={formData.topicType === 'project'} 
                        onChange={() => setFormData({...formData, topicType: 'project'})} 
                      />
                      <span>Semesterprojekt</span>
                    </label>
                  </div>
                </div>
 
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-bold text-home-grau">Ungefähres Wunschthema / Notiz</label>
                  <textarea 
                    rows={3}
                    placeholder="Eigene Themenidee oder bevorzugte Baustoffe / Laborthemen..."
                    value={formData.ownProposal}
                    onChange={(e) => setFormData({...formData, ownProposal: e.target.value})}
                    className="w-full text-xs p-2.5 border border-home-grau/25 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-shiraz/40 bg-white text-text-main resize-none"
                  />
                </div>
 
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 bg-shiraz text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-shiraz/90 transition-all cursor-pointer ${loading ? 'opacity-70' : ''}`}
                >
                  <Send size={12} />
                  {loading ? 'Sende Anfrage...' : 'Interesse übermitteln'}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4 gap-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xs">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Interesse vorgemerkt!</h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Vielen Dank, <strong>{formData.name}</strong>. Ihre Anfrage zum Wunschgebiet wurde simuliert und erfolgreich registriert. Prof. Dr.-Ing. Huber freut sich auf neue innovative Fragestellungen!
                  </p>
                </div>
                <button 
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-white border border-home-grau/20 hover:bg-off-white text-text-main rounded-lg text-xs font-semibold transition-colors mt-2"
                >
                  Neues Formular ausfüllen
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      <ModuleFooter 
        weblinks={[
          { title: 'THA_ibi – Institut für Bau und Immobilie', url: 'https://www.tha.de/ibi' },
          { title: 'Fakultät für Architektur und Bauwesen - Technische Hochschule Augsburg', url: 'https://www.tha.de/hochschule/fakultaet/ab/' }
        ]}
        wikipedia={[
          { title: 'Wissenschaftliche Arbeit', url: 'https://de.wikipedia.org/wiki/Wissenschaftliche_Arbeit' },
          { title: 'Baustoffkunde', url: 'https://de.wikipedia.org/wiki/Baustoffkunde' },
          { title: 'Bauingenieurwesen', url: 'https://de.wikipedia.org/wiki/Bauingenieurwesen' }
        ]}
        literatur={[
          'Karmasin, M.; Ribing, R. (2019): Die Gestaltung wissenschaftlicher Arbeiten (Facultas / UTB)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'Leitfaden zur Anfertigung wissenschaftlicher Abschlussarbeiten der THA', url: 'https://www.tha.de/' },
          { title: 'Gute wissenschaftliche Praxis (DFG-Kodex)', url: 'https://www.dfg.de/de/grundlagen-themen/grundlagen-und-prinzipien-der-foerderung/gwp' }
        ]}
        formeln={[
          {
            formel: 'CP = \\sum_{i=1}^n ECTS_i = 180 \\quad (\\text{Bachelor}) \\;\\lor\\; 90\\,\\text{bzw. } 120 \\quad (\\text{Master})',
            erklaerung: 'Credit-Point-Struktur akademischer Studiengänge an der Fakultät für Architektur und Bauwesen der TH Augsburg.',
            quelle: 'SPO THA'
          }
        ]}
      />
    </div>
  );
}
