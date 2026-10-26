import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { MessageSquare, Send, AlertCircle, Lightbulb, ThumbsUp, Star } from 'lucide-react';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/feedback/Feedback.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

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
    
    const subject = encodeURIComponent(inhalt.werte.evaluierungBaustoffDashboard);
    const body = encodeURIComponent(
      `Bewertung durch Studierende:\n\n` +
      `Inhalte: ${formatDeWert(ratings.inhalte)}/5\n` +
      `Umfang: ${formatDeWert(ratings.umfang)}/5\n` +
      `Verständlichkeit: ${formatDeWert(ratings.verstaendlichkeit)}/5\n` +
      `Nutzen/Praxisrelevanz: ${formatDeWert(ratings.nutzen)}/5\n` +
      `Bedienbarkeit & Design: ${formatDeWert(ratings.design)}/5\n` +
      `Interaktive Elemente & Rechner: ${formatDeWert(ratings.interaktivitaet)}/5\n` +
      `Stabilität & Struktur: ${formatDeWert(ratings.performance)}/5\n` +
      `Lernmotivation & Spaß: ${formatDeWert(ratings.motivation)}/5\n\n` +
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
        <p><MdText text={inhalt.texte.ihreMeinungIstUns} /></p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 bg-off-white rounded-xl border border-home-grau/20">
          <label className="text-sm font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.qualitätDerInhalte} /><InfoTooltip text={inhalt.werte.wieBewertenSieDie} />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('inhalte')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2">
            Vollständigkeit
            <InfoTooltip text={inhalt.werte.istDasThemaDes} />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('umfang')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2">
            Verständlichkeit
            <InfoTooltip text={inhalt.werte.istDieBedienungIntuitiv} />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('verstaendlichkeit')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.nutzenPraxisrelevanz} /><InfoTooltip text={inhalt.werte.hilftIhnenDiesesTool} />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('nutzen')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.bedienbarkeitDesign} /><InfoTooltip text={inhalt.werte.wieAnsprechendUndIntuitiv} />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('design')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.interaktiveElemente} /><InfoTooltip text={inhalt.werte.wieHilfreichSindDie} />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('interaktivitaet')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.konsistenzStruktur} /><InfoTooltip text={inhalt.werte.istDasModulIn} />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('performance')}
          </div>
          
          <label className="text-sm font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.lernmotivationSpaß} /><InfoTooltip text={inhalt.werte.motiviertDasDashboardSich} />
          </label>
          <div className="flex sm:justify-end">
            {renderStars('motivation')}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="freitext" className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.weiteresFeedbackOptional} /></label>
          <textarea
            id="freitext"
            value={freitext}
            onChange={(e) => setFreitext(e.target.value)}
            placeholder={inhalt.werte.wasGefälltIhnenBesonders}
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
          <span><MdText text={inhalt.texte.ergebnisseAbsenden} /></span>
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
    
    let subjectType = inhalt.werte.fehlerGefunden;
    if (type === 'idee') subjectType = 'Ergänzungsvorschlag';
    if (type === 'lob') subjectType = 'Lob';
    
    const finalMessage = (type === 'lob' && !message) 
      ? inhalt.werte.ganzGroßartigesToolVielen 
      : message;

    const subject = encodeURIComponent(`Feedback Baustoff-Dashboard: ${subjectType}`);
    const body = encodeURIComponent(`Modul: ${module}\n\nNachricht:\n${finalMessage}`);
    
    // Open default mail client
    window.location.href = `mailto:juergen.huber@tha.de?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
        <p><MdText text={inhalt.texte.habenSieEinenFehler} /></p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2"><label className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.artDesFeedbacks} /></label><InfoTooltip text={inhalt.werte.parameterZurAnpassungDer} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button aria-pressed={type === 'fehler'}
              type="button"
              onClick={() => setType('fehler')}
              className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                type === 'fehler' 
                  ? 'border-torch-red bg-torch-red/5 text-torch-red' 
                  : 'border-home-grau/30 bg-white text-text-main/70 hover:border-home-grau'
              }`}
            >
              <AlertCircle size={18} />
              <span><MdText text={inhalt.texte.fehlerMelden} /></span>
            </button>
            <button aria-pressed={type === 'idee'}
              type="button"
              onClick={() => setType('idee')}
              className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                type === 'idee' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                  : 'border-home-grau/30 bg-white text-text-main/70 hover:border-home-grau'
              }`}
            >
              <Lightbulb size={18} />
              <span><MdText text={inhalt.texte.ergänzungVorschlagen} /></span>
            </button>
            <button aria-pressed={type === 'lob'}
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
          <div className="flex items-center gap-2"><label htmlFor="module" className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.betroffenesModulOptional} /></label><InfoTooltip text={inhalt.werte.parameterZurAnpassungDer2} /></div>
          <input
            id="module"
            type="text"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            placeholder={inhalt.werte.zBZementchemieEpd}
            className="p-3 rounded-xl border border-home-grau/30 bg-off-white focus:outline-none focus:border-shiraz focus:ring-1 focus:ring-shiraz transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2"><label htmlFor="message" className="text-sm font-bold text-text-main"><MdText text={inhalt.texte.ihreNachricht} /></label><InfoTooltip text={inhalt.werte.parameterZurAnpassungDer3} /></div>
          <textarea
            id="message"
            required={type !== 'lob'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={type === 'fehler' ? inhalt.werte.beschreibenSieDenFehler : type === 'lob' ? inhalt.werte.ganzGroßartigesToolVielen2 : inhalt.werte.welchesThemaOderWelche}
            rows={5}
            className="p-3 rounded-xl border border-home-grau/30 bg-off-white focus:outline-none focus:border-shiraz focus:ring-1 focus:ring-shiraz transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 bg-shiraz text-white p-4 rounded-xl font-bold hover:bg-torch-red transition-colors flex items-center justify-center gap-2"
        >
          <Send size={20} />
          <span><MdText text={inhalt.texte.eMailVorbereiten} /></span>
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
            <h2 className="text-xl font-bold text-text-main"><MdText text={inhalt.texte.feedbackEvaluierung} /></h2>
          </div>
        </div>

        <ModuleTabs
          label={inhalt.werte.bereicheFeedback}
          tabs={[
            { id: 'feedback' as const, label: 'Feedback' },
            { id: 'evaluierung' as const, label: inhalt.texte.evaluierungTool },
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="flex flex-col gap-6"
        >
          {activeTab === 'feedback' ? <FeedbackContent /> : <EvaluierungContent />}
        </ModuleTabs>
      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Evaluation', url: 'https://de.wikipedia.org/wiki/Evaluation' },
          { title: 'Qualitätsmanagement', url: 'https://de.wikipedia.org/wiki/Qualit%C3%A4tsmanagement' },
          { title: inhalt.werte.empirischeSozialforschung, url: 'https://de.wikipedia.org/wiki/Empirische_Sozialforschung' }
        ]}
        literatur={inhalt.daten["Feedback.literatur"]}
        regelwerke={inhalt.daten["Feedback.regelwerke"]}
        hideFormeln={true}
      />
    </div>
  );
}
