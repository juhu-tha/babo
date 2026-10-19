import React, { useState } from 'react';
import { MessageSquare, Send, AlertCircle, Lightbulb, ThumbsUp, ClipboardCheck, Star } from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

function EvaluierungContent() {
  const [ratings, setRatings] = useState({
    inhalte: 0,
    umfang: 0,
    verstaendlichkeit: 0,
    nutzen: 0,
    design: 0,
    interaktivitaet: 0,
    performance: 0,
    motivation: 0,
  });
  const [freitext, setFreitext] = useState('');

  const handleRating = (key: string, value: number) => {
    setRatings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent('Evaluierung Baustoff-Dashboard');
    const body = encodeURIComponent(
      `Bewertung durch Studierende:\n\n` +
      `Inhalte: ${ratings.inhalte}/5\n` +
      `Umfang: ${ratings.umfang}/5\n` +
      `Verständlichkeit: ${ratings.verstaendlichkeit}/5\n` +
      `Nutzen/Praxisrelevanz: ${ratings.nutzen}/5\n` +
      `Bedienbarkeit & Design: ${ratings.design}/5\n` +
      `Interaktive Elemente & Rechner: ${ratings.interaktivitaet}/5\n` +
      `Stabilität & Struktur: ${ratings.performance}/5\n` +
      `Lernmotivation & Spaß: ${ratings.motivation}/5\n\n` +
      `Weiteres Feedback/Freitext:\n${freitext}`
    );
    
    window.location.href = `mailto:juergen.huber@tha.de?subject=${subject}&body=${body}`;
  };

  const renderStars = (key: keyof typeof ratings) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRating(key, star)}
            className={`p-1 transition-colors ${ratings[key as keyof typeof ratings] >= star ? 'text-yellow-500' : 'text-home-grau/30 hover:text-yellow-300'}`}
          >
            <Star size={24} fill={ratings[key as keyof typeof ratings] >= star ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
        <p>
          Ihre Meinung ist uns wichtig! Bitte bewerten Sie die folgenden Aspekte des Dashboards (1 Stern = sehr schlecht, 5 Sterne = sehr gut). 
          Die Ergebnisse werden per E-Mail an juergen.huber@tha.de gesendet.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 bg-off-white rounded-xl border border-home-grau/20">
          <label className="text-sm font-bold text-text-main flex items-center gap-2">
            Qualität der Inhalte
            <InfoTooltip text="Wie bewerten Sie die fachliche Korrektheit und Tiefe?" />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('inhalte')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2">
            Vollständigkeit
            <InfoTooltip text="Ist das Thema des Moduls fachlich vollständig abgebildet?" />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('umfang')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2">
            Verständlichkeit
            <InfoTooltip text="Ist die Bedienung intuitiv und sind die Erklärungen klar und verständlich?" />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('verstaendlichkeit')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2">
            Nutzen & Praxisrelevanz
            <InfoTooltip text="Hilft Ihnen dieses Tool beim Lernen und Verstehen für Studium und Baupraxis?" />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('nutzen')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2">
            Bedienbarkeit & Design
            <InfoTooltip text="Wie ansprechend und intuitiv ist das Dashboard gestaltet?" />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('design')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2">
            Interaktive Elemente
            <InfoTooltip text="Wie hilfreich sind die Rechner, Slider, Simulatoren und Diagramme?" />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('interaktivitaet')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2">
            Konsistenz & Struktur
            <InfoTooltip text="Ist das Modul in sich logisch aufgebaut? Sind alle notwendigen Informationen zum Verständnis in anderen Modulen vorhanden?" />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('performance')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2">
            Lernmotivation & Spaß
            <InfoTooltip text="Motiviert das Dashboard, sich mit den Inhalten zu beschäftigen?" />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('motivation')}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="freitext" className="text-sm font-bold text-text-main">Weiteres Feedback (optional)</label>
          <textarea
            id="freitext"
            value={freitext}
            onChange={(e) => setFreitext(e.target.value)}
            placeholder="Was gefällt Ihnen besonders gut? Was könnte verbessert werden?"
            rows={4}
            className="p-3 rounded-xl border border-home-grau/30 bg-off-white focus:outline-none focus:border-shiraz focus:ring-1 focus:ring-shiraz transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 bg-shiraz text-white p-4 rounded-xl font-bold hover:bg-torch-red transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={Object.values(ratings).some(v => v === 0)}
        >
          <Send size={20} />
          <span>Ergebnisse absenden</span>
        </button>
      </form>
    </div>
  );
}

function FeedbackContent() {
  const [type, setType] = useState('fehler');
  const [message, setMessage] = useState('');
  const [module, setModule] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let subjectType = 'Fehler gefunden';
    if (type === 'idee') subjectType = 'Ergänzungsvorschlag';
    if (type === 'lob') subjectType = 'Lob';
    
    const finalMessage = (type === 'lob' && !message) 
      ? 'Ganz großartiges Tool - Vielen Dank für die Umsetzung und Betreuung :)' 
      : message;

    const subject = encodeURIComponent(`Feedback Baustoff-Dashboard: ${subjectType}`);
    const body = encodeURIComponent(`Modul: ${module}\n\nNachricht:\n${finalMessage}`);
    
    // Open default mail client
    window.location.href = `mailto:juergen.huber@tha.de?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
        <p>
          Haben Sie einen Fehler gefunden oder eine Idee, wie das Dashboard verbessert werden kann? 
          Nutzen Sie dieses Formular, um direkt eine E-Mail an Jürgen Huber (juergen.huber@tha.de) zu generieren.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2"><label className="text-sm font-bold text-text-main">Art des Feedbacks</label><InfoTooltip text="Parameter zur Anpassung der Berechnung." /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setType('fehler')}
              className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                type === 'fehler' 
                  ? 'border-torch-red bg-torch-red/5 text-torch-red' 
                  : 'border-home-grau/30 bg-white text-text-main/70 hover:border-home-grau'
              }`}
            >
              <AlertCircle size={18} />
              <span>Fehler melden</span>
            </button>
            <button
              type="button"
              onClick={() => setType('idee')}
              className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                type === 'idee' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                  : 'border-home-grau/30 bg-white text-text-main/70 hover:border-home-grau'
              }`}
            >
              <Lightbulb size={18} />
              <span>Ergänzung vorschlagen</span>
            </button>
            <button
              type="button"
              onClick={() => setType('lob')}
              className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                type === 'lob' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-home-grau/30 bg-white text-text-main/70 hover:border-home-grau'
              }`}
            >
              <ThumbsUp size={18} />
              <span>Lob</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2"><label htmlFor="module" className="text-sm font-bold text-text-main">Betroffenes Modul (optional)</label><InfoTooltip text="Parameter zur Anpassung der Berechnung." /></div>
          <input
            id="module"
            type="text"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            placeholder="z.B. Zementchemie, EPD, ..."
            className="p-3 rounded-xl border border-home-grau/30 bg-off-white focus:outline-none focus:border-shiraz focus:ring-1 focus:ring-shiraz transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2"><label htmlFor="message" className="text-sm font-bold text-text-main">Ihre Nachricht</label><InfoTooltip text="Parameter zur Anpassung der Berechnung." /></div>
          <textarea
            id="message"
            required={type !== 'lob'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={type === 'fehler' ? 'Beschreiben Sie den Fehler möglichst genau...' : type === 'lob' ? 'Ganz großartiges Tool - Vielen Dank für die Umsetzung und Betreuung :)' : 'Welches Thema oder welche Funktion fehlt Ihnen?'}
            rows={5}
            className="p-3 rounded-xl border border-home-grau/30 bg-off-white focus:outline-none focus:border-shiraz focus:ring-1 focus:ring-shiraz transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 bg-shiraz text-white p-4 rounded-xl font-bold hover:bg-torch-red transition-colors flex items-center justify-center gap-2"
        >
          <Send size={20} />
          <span>E-Mail vorbereiten</span>
        </button>
      </form>
    </div>
  );
}

export default function Feedback() {
  const [activeTab, setActiveTab] = useState<'feedback' | 'evaluierung'>('feedback');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between border-b border-home-grau/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
              <MessageSquare size={24} />
            </div>
            <h2 className="text-xl font-bold text-text-main">Feedback & Evaluierung</h2>
          </div>
        </div>

        <div className="flex gap-4 mb-2">
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors ${activeTab === 'feedback' ? 'bg-shiraz text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Feedback
          </button>
          <button
            onClick={() => setActiveTab('evaluierung')}
            className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors ${activeTab === 'evaluierung' ? 'bg-shiraz text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Evaluierung Tool
          </button>
        </div>

        {activeTab === 'feedback' ? <FeedbackContent /> : <EvaluierungContent />}
      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Evaluation', url: 'https://de.wikipedia.org/wiki/Evaluation' },
          { title: 'Qualitätsmanagement', url: 'https://de.wikipedia.org/wiki/Qualit%C3%A4tsmanagement' },
          { title: 'Empirische Sozialforschung', url: 'https://de.wikipedia.org/wiki/Empirische_Sozialforschung' }
        ]}
        literatur={[
          'Kromrey, H.; Roose, J.; Strübing, J. (2016): Empirische Sozialforschung (13. Auflage, UTB / UVK)',
          'Wissenschaftsrat: Empfehlungen zur Qualitätsverbesserung von Lehre und Studium an deutschen Hochschulen',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'Bayerisches Hochschulinnovationsgesetz (BayHIG - Art. 18 Evaluation und Qualitätssicherung)', url: 'https://www.gesetze-bayern.de/' },
          { title: 'DIN EN ISO 9001:2015 (Qualitätsmanagementsysteme - Anforderungen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+9001' },
          { title: 'DIN EN ISO 9004:2018 (Qualitätsmanagement - Leitfaden zum Erreichen nachhaltigen Erfolgs)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+9004' }
        ]}
        hideFormeln={true}
      />
    </div>
  );
}
