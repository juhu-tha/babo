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
import inhalt from '@/content/thesenprojekte/ThesenProjekte.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
    program: inhalt.werte.bauingenieurwesenBEng,
    topicType: 'master',
    area: inhalt.werte.bauenImBestand,
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
      program: inhalt.werte.bauingenieurwesenBEng2,
      topicType: 'master',
      area: inhalt.werte.bauenImBestand2,
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
              <GraduationCap size={12} className="text-shiraz" /><MdText text={inhalt.texte.akademischeArbeiten} /></span>
            <h2 className="text-lg md:text-2xl font-bold tracking-tight text-text-main"><MdText text={inhalt.texte.thesenSemesterprojekte} /></h2>
            <p className="text-home-grau text-sm leading-relaxed font-normal"><MdText text={inhalt.texte.hierFindenSieInformationen} /></p>
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
                <h2 className="text-xl font-bold text-text-main flex items-center gap-2 flex-wrap"><MdText text={inhalt.texte.thesenUndSemesterprojekteBei} /><span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/50 text-xs font-bold uppercase tracking-wider rounded"><MdText text={inhalt.texte.betreuungAktiv} /></span>
                </h2>
                <div className="h-[1px] bg-home-grau/10 my-4" />
                
                <p className="text-sm text-text-main/85 leading-relaxed mb-6"><MdText text={inhalt.texte.akademischeArbeitenBachelorMasterthesis} /></p>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-main/50 flex items-center gap-1.5 border-b border-home-grau/10 pb-2">
                    <GraduationCap size={14} className="text-shiraz" /><MdText text={inhalt.texte.fachdisziplinenForschungsschwerpunkteFür} /></h3>

                  <div className="grid grid-cols-1 gap-4">
                    {inhalt.daten.ThesenProjekte.map((fach, fIdx) => (
                      <div key={fIdx} className="p-4 bg-off-white border border-home-grau/10 rounded-xl flex flex-col gap-2 hover:border-shiraz/35 hover:bg-white duration-200 shadow-2xs">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-sm text-text-main tracking-tight">{fach.title}</h4>
                          <span className="text-xs bg-white text-home-grau border border-home-grau/10 font-bold px-2 py-0.5 rounded">Forschung</span>
                        </div>
                        <p className="text-sm text-text-main/80 font-medium leading-relaxed">{fach.focus}</p>
                        <p className="text-xs text-home-grau leading-relaxed italic"><strong className="font-semibold not-italic text-home-grau">Thesis-Themenbeispiele:</strong> {fach.examples}</p>
                        
                        <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-home-grau/10">
                          <span className="text-xs uppercase font-bold text-home-grau/65"><MdText text={inhalt.texte.verwandteModule} /></span>
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
              <ClipboardList size={20} className="text-home-grau" /><MdText text={inhalt.texte.ablaufAnforderungenAllgemeineLeitlinien} /></h2>
            <p className="text-sm text-home-grau leading-relaxed mb-6"><MdText text={inhalt.texte.eineWissenschaftlicheAbschlussarbeitOder} /></p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-off-white border border-home-grau/15 flex items-center justify-center font-bold text-xs text-home-grau shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-main wie-h4"><MdText text={inhalt.texte.themenfindungExpos} /></h3>
                  <p className="text-xs text-home-grau mt-1 leading-relaxed"><MdText text={inhalt.texte.egalObEigenesWunschthema} /></p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-off-white border border-home-grau/15 flex items-center justify-center font-bold text-xs text-home-grau shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-main wie-h4"><MdText text={inhalt.texte.anmeldungBetreuungsvereinbarung} /></h3>
                  <p className="text-xs text-home-grau mt-1 leading-relaxed"><MdText text={inhalt.texte.formalerStartDurchAnmeldung} /></p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-off-white border border-home-grau/15 flex items-center justify-center font-bold text-xs text-home-grau shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-main wie-h4"><MdText text={inhalt.texte.durchführungLiteratursichtung} /></h3>
                  <p className="text-xs text-home-grau mt-1 leading-relaxed"><MdText text={inhalt.texte.nutzungDerHochschulbibliothekEinschlägig} /></p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-off-white border border-home-grau/15 flex items-center justify-center font-bold text-xs text-home-grau shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-main wie-h4"><MdText text={inhalt.texte.kolloquiumPräsentation} /></h3>
                  <p className="text-xs text-home-grau mt-1 leading-relaxed"><MdText text={inhalt.texte.mündlicheVerteidigungDerErarbeiteten} /></p>
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
              <Mail size={16} className="text-shiraz" /><MdText text={inhalt.texte.kontaktBetreuung} /></h3>
            <div className="bg-off-white p-4 rounded-xl border border-home-grau/10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 block mb-0.5"><MdText text={inhalt.texte.studiengangsleiterLehrgebiete} /></span>
              <h4 className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.profDrIngHuber} /></h4>
              <p className="text-xs text-home-grau mt-0.5"><MdText text={inhalt.texte.fakultätFürArchitekturUnd} /></p>
              <div className="h-[1px] bg-home-grau/10 my-2.5" />
              <p className="text-xs text-home-grau/90 leading-relaxed"><MdText text={inhalt.texte.fragenZurEignungIhres} /></p>
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
              <h3 className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.thesenInteresseBekunden} /></h3>
            </div>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <p className="text-xs text-home-grau/90 leading-relaxed"><MdText text={inhalt.texte.tragenSieSichUnverbindlich} /></p>
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-bold text-home-grau">Name</label>
                  <div className="relative">
                    <User size={12} className="absolute left-3 top-3 text-home-grau/55" />
                    <input 
                      type="text" 
                      required
                      placeholder={inhalt.werte.ihrVorUndNachname}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full text-xs p-2.5 pl-8 border border-home-grau/25 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-shiraz/40 bg-white text-text-main"
                    />
                  </div>
                </div>
 
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-bold text-home-grau"><MdText text={inhalt.texte.eMailTha} /></label>
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
                  <select aria-label="Studiengang" 
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
                  <label className="text-xs uppercase font-bold text-home-grau"><MdText text={inhalt.texte.fachdisziplinForschungsschwerpunkt} /></label>
                  <select aria-label={inhalt.werte.fachdisziplinForschungsschwerpunkt} 
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
                  <label className="text-xs uppercase font-bold text-home-grau"><MdText text={inhalt.texte.artDerArbeit} /></label>
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
                  <label className="text-xs uppercase font-bold text-home-grau"><MdText text={inhalt.texte.ungefähresWunschthemaNotiz} /></label>
                  <textarea 
                    rows={3}
                    placeholder={inhalt.werte.eigeneThemenideeOderBevorzugte}
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
                  {loading ? inhalt.werte.sendeAnfrage : inhalt.werte.interesseÜbermitteln}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4 gap-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xs">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950"><MdText text={inhalt.texte.interesseVorgemerkt} /></h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed"><MdText text={inhalt.texte.vielenDank} /><strong>{formData.name}</strong><MdText text={inhalt.texte.ihreAnfrageZumWunschgebiet} /></p>
                </div>
                <button 
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-white border border-home-grau/20 hover:bg-off-white text-text-main rounded-lg text-xs font-semibold transition-colors mt-2"
                ><MdText text={inhalt.texte.neuesFormularAusfüllen} /></button>
              </div>
            )}
          </div>

        </div>

      </div>

      <ModuleFooter 
        weblinks={inhalt.daten["ThesenProjekte.weblinks"]}
        wikipedia={[
          { title: inhalt.werte.wissenschaftlicheArbeit, url: 'https://de.wikipedia.org/wiki/Wissenschaftliche_Arbeit' },
          { title: 'Baustoffkunde', url: 'https://de.wikipedia.org/wiki/Baustoffkunde' },
          { title: 'Bauingenieurwesen', url: 'https://de.wikipedia.org/wiki/Bauingenieurwesen' }
        ]}
        literatur={inhalt.daten["ThesenProjekte.literatur"]}
        regelwerke={inhalt.daten["ThesenProjekte.regelwerke"]}
        formeln={inhalt.daten["ThesenProjekte.formeln"]}
      />
    </div>
  );
}
