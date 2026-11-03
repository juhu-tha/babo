import React, { useState } from 'react';
import { 
  BookOpen, 
  AlertCircle, 
  ShieldCheck, 
  FileWarning, 
  Clock, 
  Users, 
  Gavel, 
  Scale, 
  Search,
  FileText,
  AlertTriangle,
  Copy,
  Check,
  RotateCcw,
  FileSignature,
  ArrowRight
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/bauschaeden/Bauschaeden.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { useTabContext } from '@/src/contexts/TabContext';

type SchadTab = 'recht' | 'schriftverkehr' | 'normen' | 'gutachter' | 'haftung';

export default function Bauschaeden() {
  const { setActiveTab, setTypischeBauschaedenSubTab } = useTabContext();
  const [activeSubTab, setActiveSubTab] = useState<SchadTab>('recht');

  // Schriftverkehr-States
  const [noticeType, setNoticeType] = useState<'bedenken' | 'behinderung' | 'mangel' | 'nachtrag'>('bedenken');
  const [senderName, setSenderName] = useState(inhalt.werte.musterAbsender);
  const [recipientName, setRecipientName] = useState(inhalt.werte.musterEmpfaenger);
  const [projectName, setProjectName] = useState(inhalt.werte.musterObjekt);
  const [affectedTrade, setAffectedTrade] = useState(inhalt.werte.bodenbelagsarbeitenGewerk036Vorleistung);
  const [noticeDetail, setNoticeDetail] = useState(inhalt.werte.dieRohbetondeckeWeistAn);
  const [consequenceText, setConsequenceText] = useState(inhalt.werte.gefahrVonBlasenbildungHaftungsverlust);
  const [deadlineDate, setDeadlineDate] = useState('25.10.2026');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(getLetterContent());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleReset = () => {
    setSenderName(inhalt.werte.musterAbsender2);
    setRecipientName(inhalt.werte.musterEmpfaenger2);
    setProjectName(inhalt.werte.musterObjekt2);
    if (noticeType === 'bedenken') {
      setAffectedTrade(inhalt.werte.bodenbelagsarbeitenGewerk036Vorleistung2);
      setNoticeDetail(inhalt.werte.dieRohbetondeckeWeistAn2);
      setConsequenceText(inhalt.werte.gefahrVonBlasenbildungHaftungsverlust2);
    } else if (noticeType === 'behinderung') {
      setAffectedTrade(inhalt.werte.estrichUndBodenbelagsarbeitenGewerk);
      setNoticeDetail(inhalt.werte.vorgewerkHeizungsinstallationHatDie);
      setConsequenceText(inhalt.werte.baustelleStehtStillNachfolgende);
    } else if (noticeType === 'mangel') {
      setAffectedTrade(inhalt.werte.außenputzarbeitenWestfassade);
      setNoticeDetail(inhalt.werte.feineHaarrisseEntlangDer);
      setConsequenceText(inhalt.werte.nacherfüllungSanierungDurchFachgerechtes);
    } else {
      setAffectedTrade(inhalt.werte.zusätzlicherMineralischerBrandschutzputz);
      setNoticeDetail(inhalt.werte.bauaufsichtlicheGeänderteAnordnungZur);
      setConsequenceText(inhalt.werte.kostenaufwandCa4250);
    }
  };

  const handleTypeChange = (type: 'bedenken' | 'behinderung' | 'mangel' | 'nachtrag') => {
    setNoticeType(type);
    if (type === 'bedenken') {
      setAffectedTrade(inhalt.werte.bodenbelagsarbeitenGewerk036Vorleistung3);
      setNoticeDetail(inhalt.werte.dieRohbetondeckeWeistAn3);
      setConsequenceText(inhalt.werte.gefahrVonBlasenbildungHaftungsverlust3);
    } else if (type === 'behinderung') {
      setAffectedTrade(inhalt.werte.estrichUndBodenbelagsarbeitenGewerk2);
      setNoticeDetail(inhalt.werte.vorgewerkHeizungsinstallationHatDie2);
      setConsequenceText(inhalt.werte.baustelleStehtStillNachfolgende2);
    } else if (type === 'mangel') {
      setAffectedTrade(inhalt.werte.außenputzarbeitenWestfassade2);
      setNoticeDetail(inhalt.werte.feineHaarrisseEntlangDer2);
      setConsequenceText(inhalt.werte.beseitigungAllerRisseUnd);
    } else {
      setAffectedTrade(inhalt.werte.zusätzlicherMineralischerBrandschutzputz2);
      setNoticeDetail(inhalt.werte.bauaufsichtlicheGeänderteAnordnungZur2);
      setConsequenceText(inhalt.werte.kostenaufwandCa42502);
    }
  };

  const getLetterContent = () => {
    switch (noticeType) {
      case 'bedenken':
        return `Ingenieurbüro / Absender:
${senderName}

An: ${recipientName}

Betreff: Bedenkenanmeldung gemäß § 4 Abs. 3 VOB/B
Bauvorhaben: ${projectName}
Datum: ${new Date().toLocaleDateString('de-DE')}

Sehr geehrte Damen und Herren,

hiermit melden wir gemäß § 4 Abs. 3 VOB/B unverzüglich und vor Beginn unserer Leistungsstufe form- und fristgerecht Bedenken gegen die vorgesehene Art der Ausführung an.

1. Betroffenes Gewerk / Vorleistung:
   ${affectedTrade}

2. Technische Beanstandung (Grund):
   ${noticeDetail}

3. Absehbare Schadensfolge bei Ausführung:
   ${consequenceText}

Durch diese Fehlerhaftigkeit ist die fachgerechte, mangelfreie Leistungserbringung im Sinne von § 13 VOB/B nachweislich gefährdet. Wir bitten Sie als Auftraggeber, diese Bedenken umgehend – ggf. unter Einbeziehung Ihrer Fachplaner – zu prüfen und uns eine entsprechende schriftliche Anordnung zukommen zu lassen.

Sollte die Leistung entgegen diesen Bedenken auf Ihre Anordnung ausgeführt werden, sind wir nach § 13 Abs. 3 VOB/B von der Mängelhaftung für die hier dargestellten Folgen frei.

Mit freundlichen Grüßen,
${senderName}`;

      case 'behinderung':
        return `Ingenieurbüro / Absender:
${senderName}

An: ${recipientName}

Betreff: Behinderungsanzeige gemäß § 6 Abs. 1 VOB/B / § 642 BGB
Bauvorhaben: ${projectName}
Datum: ${new Date().toLocaleDateString('de-DE')}

Sehr geehrte Damen und Herren,

gemäß § 6 Abs. 1 VOB/B zeigen wir Ihnen hiermit unverzüglich und schriftlich an, dass wir an der ordnungsgemäßen Ausführung unserer vertraglich vereinbarten Leistungen gehindert sind.

1. Art und Ursache der Behinderung:
   ${noticeDetail}

2. Betroffener Bau- und Ausführungsbereich:
   ${affectedTrade}

3. Absehbare zeitliche & organisatorische Folgen:
   ${consequenceText}

Die Ausführung ist ab dem heutigen Tage im betroffenen Bereich vollständig eingestellt bzw. verzögert sich massiv. Wir können unsere Arbeiten erst dann fortsetzen bzw. aufnehmen, wenn die Hinderungsgründe beseitigt sind.

Wir weisen darauf hin, dass die vertraglichen Ausführungsfristen sich mindestens um den Zeitraum dieser Behinderung verlängern (§ 6 Abs. 2 VOB/B). Zudem behalten wir uns die Geltendmachung von zusätzlichen Stillstandkosten (§ 6 Abs. 6 VOB/B) sowie das Recht auf Entschädigung nach § 642 BGB ausdrücklich vor.

Mit freundlichen Grüßen,
${senderName}`;

      case 'mangel':
        return `Ingenieurbüro / Absender:
${senderName}

An: ${recipientName}

Betreff: Mängelrüge & Aufforderung zur Mängelbeseitigung gemäß § 13 Abs. 5 VOB/B
Bauvorhaben: ${projectName}
Datum: ${new Date().toLocaleDateString('de-DE')}

Sehr geehrte Damen und Herren,

im Rahmen der vertraglichen Gewährleistung rügen wir hiermit folgenden bautechnischen Mangel an Ihrer Werkleistung form- und fristgerecht:

1. Beschreibung des gerügten Mangels:
   ${noticeDetail}

2. Betroffenes Bauteil / Gewerk / Ort:
   ${affectedTrade}

3. Fristsetzung zur ordnungsgemäßen Nacherfüllung:
   Wir fordern Sie auf, diesen Mangel sowie alle damit verbundenen Folgeschäden unverzüglich und fachmännisch nach den anerkannten Regeln der Technik zu beseitigen.
   Als angemessene Frist zur vollständigen Mängelbeseitigung setzen wir Ihnen folgenden Termin:

   >>> FERTIGSTELLUNG BIS ZUM: ${deadlineDate} <<<

Sollte diese Frist fruchtlos verstreichen, werden wir nach unserer Wahl Sekundärrechte gemäß § 13 Abs. 5 VOB/B geltend machen (Zustimmung zur Ersatzvornahme auf Ihre Kosten, Minderung des Werklohns oder Schadenersatz). Zudem weisen wir darauf hin, dass mit Abnahme der Mängelbeseitigung eine neue Gewährleistungsfrist von 2 Jahren für die betroffenen Teile in Kraft tritt.

Mit freundlichen Grüßen,
${senderName}`;

      case 'nachtrag':
        return `Ingenieurbüro / Absender:
${senderName}

An: ${recipientName}

Betreff: Nachtragsankündigung und Mehrkostenanzeige gemäß § 2 Abs. 6 VOB/B
Bauvorhaben: ${projectName}
Datum: ${new Date().toLocaleDateString('de-DE')}

Sehr geehrte Damen und Herren,

mit Bezug auf Ihre geänderten Vorgaben kündigen wir hiermit form- und fristgerecht einen Nachtrag für zusätzliche bzw. geänderte Leistungen vor deren Weiterausführung an.

1. Nachtragsleistung (Gegenstand):
   ${affectedTrade}

2. Begründung der Leistungsabweichung zum Hauptvertrag:
   ${noticeDetail}

3. Kostenschätzung und Bauzeitliche Auswirkungen:
   ${consequenceText}
   Anordnung erging mit Datum vom: ${deadlineDate}

Gemäß § 2 Abs. 6 VOB/B kündigen wir hiermit vor Beginn der Ausführung dieser Leistungen unseren Anspruch auf zusätzliche Vergütung an. Wir bitten um kurzfristige schriftliche Freigabe oder Erteilung einer entsprechenden schriftlichen Anweisung, bevor wir die Ausführung aufnehmen.

Mit freundlichen Grüßen,
${senderName}`;
      default:
        return '';
    }
  };

  const tabs = [
    { id: 'recht', label: inhalt.werte.definitionenRecht, icon: Scale, desc: inhalt.werte.mangelVsSchadenGewährleistung },
    { id: 'schriftverkehr', label: inhalt.werte.formularVobSchriftverkehr, icon: FileText, desc: inhalt.werte.mängelrügeBehinderungsUndBedenkenanzeige },
    { id: 'normen', label: inhalt.werte.normenTechnikstufen, icon: BookOpen, desc: inhalt.werte.anerkannteRegelnVsStand },
    { id: 'gutachter', label: 'Sachverständigenwesen', icon: Search, desc: inhalt.werte.gutachtertypenQualifikationsstufenUndRec },
    { id: 'haftung', label: inhalt.werte.rollenHaftungAmBau, icon: Users, desc: inhalt.werte.rechtePflichtenDerAkteure },
  ] as const;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <FileWarning className="text-shiraz animate-pulse" /><MdText text={inhalt.texte.bauschädenTechnischeUndRechtliche} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.juristischeDefinitionenEntwicklungsstufe} /></p>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p className="leading-relaxed"><MdText text={inhalt.texte.einBauschadenIstEine} /></p>
        </div>

        {/* Reiter (Z53: ModuleTabs; die Kurzbeschreibung des aktiven Reiters steht sichtbar über dem Inhalt) */}
        <ModuleTabs label="Bereiche zu Bauschäden" tabs={tabs} aktiv={activeSubTab} onWechsel={setActiveSubTab} variante="kachel" className="flex flex-col gap-4 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/30 [&>[role=tablist]]:pb-4">
        <p className="text-xs text-text-main/70">{tabs.find(t => t.id === activeSubTab)?.desc}</p>

        {/* Tab-Inhalte */}
        <div className="mt-2">
          
          {/* Tab 1: Rechtliche Grundlagen */}
          {activeSubTab === 'recht' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Mangel vs. Schaden */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <AlertCircle className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.mangelVsSchaden} /></h3>
                  <div className="space-y-3 text-sm text-slate-800 leading-relaxed">
                    <p><MdText text={inhalt.texte.derBaumangelUrsacheBgb} /></p>
                    <p><MdText text={inhalt.texte.derBauschadenWirkungDer} /></p>
                    <div className="p-3 bg-shiraz/5 border-l-2 border-shiraz rounded text-xs text-text-main">
                      <span className="font-bold text-shiraz">Praxis-Tipp:</span><MdText text={inhalt.texte.nichtJederMangelFührt} /></div>
                  </div>
                </div>

                {/* Gewährleistung vs. Garantie */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <ShieldCheck className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.gewährleistungVsGarantie} /></h3>
                  <div className="space-y-3 text-sm text-slate-800 leading-relaxed">
                    <div className="bg-white p-3 rounded border border-home-grau/30">
                      <span className="font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.gewährleistungGesetzlicherMängelanspruch} /></span><MdText text={inhalt.texte.ausWerkvertragsrechtBgbVob} /></div>
                    <div className="bg-white p-3 rounded border border-home-grau/30">
                      <span className="font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.garantieFreiwilligeZusage} /></span><MdText text={inhalt.texte.zusätzlicheZivilrechtlicheWillenserkläru} /></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Verjährung */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <Clock className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.verjährungsfristenVonMängelansprüchen} /></h3>
                  <p className="text-sm text-slate-800 mb-3 leading-relaxed"><MdText text={inhalt.texte.dieFristBeginntGrundsätzlich} /></p>
                  <table className="w-full text-sm text-slate-800 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-left">
                        <th className="p-2 border border-home-grau/30 font-semibold">Basis</th>
                        <th className="p-2 border border-home-grau/30 font-semibold"><MdText text={inhalt.texte.dauerBereich} /></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border border-home-grau/30 font-medium"><MdText text={inhalt.texte.bgb634a} /></td>
                        <td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.t5JahreFürBauwerke} /></td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="p-2 border border-home-grau/30 font-medium"><MdText text={inhalt.texte.vobB13} /></td>
                        <td className="p-2 border border-home-grau/30"><MdText text={inhalt.texte.t4JahreFürBauwerke} /></td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-home-grau/30 font-medium"><MdText text={inhalt.texte.arglistigeTäuschung} /></td>
                        <td className="p-2 border border-home-grau/30 text-shiraz font-medium"><MdText text={inhalt.texte.regelverjährungNach195199} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Beweislast & Mängelrüge */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <Scale className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.beweislastUndMängelrüge} /></h3>
                  <ul className="list-disc pl-5 space-y-2.5 text-sm text-slate-800 leading-relaxed">
                    <li><MdText text={inhalt.texte.vorDerAbnahmeDer} /></li>
                    <li><MdText text={inhalt.texte.nachDerAbnahmeBeweislastumkehr} /></li>
                    <li><MdText text={inhalt.texte.mängelrügeVerfahrenBeimBgb} /></li>
                  </ul>
                </div>
              </div>

              {/* Aktuelle Rechtsprechung & Bau-Trends (BGH 2018 & Gebäudetyp E) */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-base text-slate-900 mb-2 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                  <Gavel className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.aktuelleRechtsprechungTrendsIm} /></h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="font-bold text-shiraz flex items-center gap-1.5 uppercase text-xs tracking-wide"><MdText text={inhalt.texte.bghUrtV22} /></span>
                    <p className="text-xs text-slate-800 leading-relaxed"><MdText text={inhalt.texte.derBundesgerichtshofBghHat} /></p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-150 leading-relaxed"><MdText text={inhalt.texte.neueRegelungSchadenersatzWegen} /><ul className="list-disc pl-4 mt-1.5 space-y-1">
                        <li><MdText text={inhalt.texte.vorschussanspruchAnforderungEinesZweckge} /></li>
                        <li><MdText text={inhalt.texte.minderungGeltendmachungDesWertverlusts} /></li>
                        <li><MdText text={inhalt.texte.nachträglicheAbrechnungMangelErst} /></li>
                        <li className="list-none -ml-4 mt-1 text-slate-500"><MdText text={inhalt.texte.hinweisImKaufrechtHält} /></li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="font-bold text-[#A3113E] flex items-center gap-1.5 uppercase text-xs tracking-wide"><MdText text={inhalt.texte.gebäudetypEEinfachesBauen} /></span>
                    <p className="text-xs text-slate-850 leading-relaxed"><MdText text={inhalt.texte.dieBayerischeInitiativePilotprojekte} /></p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-150 leading-relaxed"><MdText text={inhalt.texte.rechtlicherHintergrundBislangWird} /><p className="mt-1.5"><MdText text={inhalt.texte.zielDerNeuregelungVertragspartner} /></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verweis: Kleb- und Dichtstoffschäden stehen im Schadensatlas (Umbau 02.11.2026) */}
              <div className="bg-off-white border border-home-grau/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm text-text-main/80 leading-relaxed">
                  <strong className="block font-bold text-text-main"><MdText text={inhalt.texte.verweisKlebDichtTitel} /></strong>
                  <MdText text={inhalt.texte.verweisKlebDichtText} />
                </div>
                <button
                  type="button"
                  onClick={() => { setTypischeBauschaedenSubTab('kleb_dicht'); setActiveTab('schadensbilder'); }}
                  className="px-4 py-2 bg-shiraz text-white rounded-xl text-xs font-bold hover:bg-shiraz/90 transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  <span>{inhalt.werte.verweisKlebDichtKnopf}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Tab: Formular- & VOB-Schriftverkehr */}
          {activeSubTab === 'schriftverkehr' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Einleitung */}
              <div className="bg-gradient-to-r from-shiraz/5 via-stone-50 to-stone-100/50 p-5 rounded-xl border border-home-grau/25">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="p-3 bg-white rounded-lg border border-home-grau/30 shadow-sm shrink-0">
                    <FileSignature className="text-shiraz" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.interaktivesVobAnzeigenSchriftverkehrsce} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.schnittstellendisziplinAmBauSchriftliche} /></p>
        </div>
                </div>
              </div>

              {/* Grid: 1. Dok-Auswahl & Editor | 2. Brief-Vorschau */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Linke Spalte (Dokumenttyp + Editor-Inputs) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  
                  {/* Dok-Typ-Karten */}
                  <div className="bg-white border border-home-grau/30 rounded-xl p-4 shadow-sm">
                    <span className="text-xs font-bold text-text-main/60 uppercase tracking-wider block mb-3"><MdText text={inhalt.texte.t1SchriftverkehrTypWählen} /></span>
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleTypeChange('bedenken')}
                        className={`flex items-start gap-4 p-3 rounded-lg border text-left transition-all w-full ${
                          noticeType === 'bedenken' 
                            ? 'bg-shiraz/5 border-shiraz/45 ring-1 ring-shiraz/10 shadow-sm' 
                            : 'hover:bg-slate-50 border-home-grau/15 bg-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded mt-0.5 shrink-0 ${noticeType === 'bedenken' ? 'bg-shiraz text-white' : 'bg-slate-100 text-text-main/50'}`}>
                          <AlertTriangle size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`block font-bold text-xs ${noticeType === 'bedenken' ? 'text-shiraz' : 'text-text-main'}`}><MdText text={inhalt.texte.bedenkenanmeldung4Abs3} /></span>
                          <span className="text-xs text-text-main/60 block mt-0.5 leading-snug"><MdText text={inhalt.texte.schütztDenAuftragnehmerBei} /></span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleTypeChange('behinderung')}
                        className={`flex items-start gap-4 p-3 rounded-lg border text-left transition-all w-full ${
                          noticeType === 'behinderung' 
                            ? 'bg-shiraz/5 border-shiraz/45 ring-1 ring-shiraz/10 shadow-sm' 
                            : 'hover:bg-slate-50 border-home-grau/15 bg-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded mt-0.5 shrink-0 ${noticeType === 'behinderung' ? 'bg-shiraz text-white' : 'bg-slate-100 text-text-main/50'}`}>
                          <Clock size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`block font-bold text-xs ${noticeType === 'behinderung' ? 'text-shiraz' : 'text-text-main'}`}><MdText text={inhalt.texte.behinderungsanzeige6Abs1} /></span>
                          <span className="text-xs text-text-main/60 block mt-0.5 leading-snug"><MdText text={inhalt.texte.sichertFristverlängerungenUndSchützt} /></span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleTypeChange('mangel')}
                        className={`flex items-start gap-4 p-3 rounded-lg border text-left transition-all w-full ${
                          noticeType === 'mangel' 
                            ? 'bg-shiraz/5 border-shiraz/45 ring-1 ring-shiraz/10 shadow-sm' 
                            : 'hover:bg-slate-50 border-home-grau/15 bg-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded mt-0.5 shrink-0 ${noticeType === 'mangel' ? 'bg-shiraz text-white' : 'bg-slate-100 text-text-main/50'}`}>
                          <AlertCircle size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`block font-bold text-xs ${noticeType === 'mangel' ? 'text-shiraz' : 'text-text-main'}`}><MdText text={inhalt.texte.mängelrügeMängelanzeige13Vob} /></span>
                          <span className="text-xs text-text-main/60 block mt-0.5 leading-snug"><MdText text={inhalt.texte.fordertDenVertragspartnerUnter} /></span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleTypeChange('nachtrag')}
                        className={`flex items-start gap-4 p-3 rounded-lg border text-left transition-all w-full ${
                          noticeType === 'nachtrag' 
                            ? 'bg-shiraz/5 border-shiraz/45 ring-1 ring-shiraz/10 shadow-sm' 
                            : 'hover:bg-slate-50 border-home-grau/15 bg-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded mt-0.5 shrink-0 ${noticeType === 'nachtrag' ? 'bg-shiraz text-white' : 'bg-slate-100 text-text-main/50'}`}>
                          <FileText size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`block font-bold text-xs ${noticeType === 'nachtrag' ? 'text-shiraz' : 'text-text-main'}`}><MdText text={inhalt.texte.nachtragsanzeigeMehrkosten2Vob} /></span>
                          <span className="text-xs text-text-main/60 block mt-0.5 leading-snug"><MdText text={inhalt.texte.kündigtRechtsverbindlichMehrkostenUnd} /></span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Interaktiver Editor */}
                  <div className="bg-white border border-home-grau/30 rounded-xl p-4 shadow-sm flex flex-col gap-3.5">
                    <div className="flex justify-between items-center border-b border-home-grau/30 pb-2">
                      <span className="text-xs font-bold text-text-main/60 uppercase tracking-wider"><MdText text={inhalt.texte.t2BriefParameterAnpassen} /></span>
                      <button 
                        onClick={handleReset}
                        className="text-text-main/50 hover:text-shiraz transition-all text-xs font-medium flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-home-grau/15"
                        title={inhalt.werte.beispielStandardwerteWiederherstellen}
                      >
                        <RotateCcw size={11} /> Zurücksetzen
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-text-main/70"><MdText text={inhalt.texte.bauvorhabenProjektname} /></label>
                        <input aria-label={inhalt.werte.bauvorhabenProjektname} 
                          type="text" 
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className="px-2.5 py-1.5 border border-home-grau/30 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-shiraz/40 text-text-main"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-text-main/70"><MdText text={inhalt.texte.ausstellerAbsender} /></label>
                          <input aria-label={inhalt.werte.ausstellerAbsender} 
                            type="text" 
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="px-2.5 py-1.5 border border-home-grau/30 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-shiraz/40 text-text-main"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-text-main/70"><MdText text={inhalt.texte.empfängerGegner} /></label>
                          <input aria-label={inhalt.werte.empfängerGegner} 
                            type="text" 
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="px-2.5 py-1.5 border border-home-grau/30 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-shiraz/40 text-text-main"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-text-main/70"><MdText text={inhalt.texte.gegenstandBetroffenesGewerk} /></label>
                        <input aria-label={inhalt.werte.gegenstandBetroffenesGewerk} 
                          type="text" 
                          value={affectedTrade}
                          onChange={(e) => setAffectedTrade(e.target.value)}
                          className="px-2.5 py-1.5 border border-home-grau/30 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-shiraz/40 text-text-main"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-text-main/70 text-text-main">
                          {noticeType === 'bedenken' && inhalt.werte.konkreteBeanstandungBedenkengrund}
                          {noticeType === 'behinderung' && inhalt.werte.grundDerBehinderungStörung}
                          {noticeType === 'mangel' && inhalt.werte.genaueMängelbeschreibungAbweichungIst}
                          {noticeType === 'nachtrag' && inhalt.werte.detailbeschreibungDerZusatzleistung}
                        </label>
                        <textarea 
                          rows={2}
                          value={noticeDetail}
                          onChange={(e) => setNoticeDetail(e.target.value)}
                          className="px-2.5 py-1.5 border border-home-grau/30 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-shiraz/40 resize-none text-text-main"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-text-main/70">
                          {noticeType === 'bedenken' && inhalt.werte.erwarteteTechnischeSchadensfolge}
                          {noticeType === 'behinderung' && inhalt.werte.organisatorischeAuswirkung}
                          {noticeType === 'mangel' && inhalt.werte.geforderteSanierungsartNacherfüllung}
                          {noticeType === 'nachtrag' && inhalt.werte.kostenabschätzungZeitlicherMehraufwand}
                        </label>
                        <textarea 
                          rows={2}
                          value={consequenceText}
                          onChange={(e) => setConsequenceText(e.target.value)}
                          className="px-2.5 py-1.5 border border-home-grau/30 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-shiraz/40 resize-none text-text-main"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-text-main/70">
                          {noticeType === 'mangel' ? inhalt.werte.mängelbeseitigungsFristDatum : inhalt.werte.datumDerAnordnungFrist}
                        </label>
                        <input 
                          type="text" 
                          value={deadlineDate}
                          onChange={(e) => setDeadlineDate(e.target.value)}
                          className="px-2.5 py-1.5 border border-home-grau/30 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-shiraz/40 text-text-main"
                          placeholder={inhalt.werte.zB1506}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rechte Spalte (Vorschaufenster & Rechtliche Einordnung) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  
                  {/* Brief-Vorschau */}
                  <div className="bg-white border border-home-grau/35 rounded-xl shadow-md relative overflow-hidden flex flex-col">
                    <div className="border-b border-home-grau/25 p-3.5 flex justify-between items-center bg-stone-50">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide"><MdText text={inhalt.texte.liveDin5008Entwurfsvorschau} /></span>
                      </div>
                      
                      <button
                        onClick={handleCopy}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                          copySuccess 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-shiraz text-white hover:bg-shiraz/90 active:scale-95'
                        }`}
                      >
                        {copySuccess ? <Check size={14} /> : <Copy size={13} />}
                        {copySuccess ? 'Kopiert!' : inhalt.werte.brieftextKopieren}
                      </button>
                    </div>

                    <div className="p-6 bg-[#f8fafc] border-b border-home-grau/15 font-mono text-xs sm:text-xs text-stone-900 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all max-h-[440px] overflow-y-auto">
                      {getLetterContent()}
                    </div>

                    <div className="p-3 bg-stone-100/50 text-xs text-text-main/60 flex items-center justify-between gap-2">
                      <span><MdText text={inhalt.texte.derBriefentwurfStelltKeine} /></span>
                      <span className="font-bold text-shiraz">VOB Entwurf</span>
                    </div>
                  </div>

                  {/* VOB/B Rechtlicher Praxistipp */}
                  <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl flex gap-3 text-sm text-slate-800 leading-relaxed">
                    <AlertTriangle className="text-amber-700 shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                      <strong className="font-bold text-amber-950 block mb-1"><MdText text={inhalt.texte.die3FolgenschwerstenFehler} /></strong>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-2.5 text-xs text-amber-900">
                        <div className="bg-white/85 p-2.5 rounded border border-amber-100">
                          <strong className="block text-amber-950"><MdText text={inhalt.texte.t1NurPerSms} /></strong>
                          <p className="text-xs text-slate-700 leading-normal mt-1"><MdText text={inhalt.texte.t6Abs1Vob} /></p>
                        </div>
                        <div className="bg-white/85 p-2.5 rounded border border-amber-100">
                          <strong className="block text-amber-950"><MdText text={inhalt.texte.t2AdressatNurDer} /></strong>
                          <p className="text-xs text-slate-700 leading-normal mt-1"><MdText text={inhalt.texte.derArchitektIstSachwalter} /></p>
                        </div>
                        <div className="bg-white/85 p-2.5 rounded border border-amber-100">
                          <strong className="block text-amber-950"><MdText text={inhalt.texte.t3ZuUngenaueMängelbeschreibung} /></strong>
                          <p className="text-xs text-slate-700 leading-normal mt-1"><MdText text={inhalt.texte.eineAnzeigeMussUnverzüglich} /></p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Tab 2: Normen & Stufen */}
          {activeSubTab === 'normen' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="text-shiraz" shrink-0="true" size={20} /><MdText text={inhalt.texte.dieDreiEntwicklungsstufenDer} /></h3>
                <p className="text-sm text-slate-800 mb-4 leading-relaxed"><MdText text={inhalt.texte.dieJuristischeBewertungEines} /></p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-800 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col gap-2">
                    <div className="font-bold text-shiraz border-b border-shiraz/10 pb-2"><MdText text={inhalt.texte.t1StandDerWissenschaft} /></div>
                    <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.ebeneDerTheoretischenGrundlagen} /></p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col gap-2">
                    <div className="font-bold text-slate-800 border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.t2StandDerTechnik} /></div>
                    <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.derWissenschaftlichBegründeteFortschritt} /></p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-shiraz/20 shadow-sm relative flex flex-col gap-2">
                    <div className="absolute -top-3 right-2 bg-shiraz text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                      Schuldbestandteil
                    </div>
                    <div className="font-bold text-shiraz border-b border-shiraz/10 pb-2"><MdText text={inhalt.texte.t3AnerkannteRegelnDer} /></div>
                    <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dieStandardstufeAmBau} /></p>
                  </div>
                </div>

                <div className="bg-rose-50/40 border border-shiraz/20 p-4 rounded-xl flex gap-3 text-sm text-slate-800 leading-relaxed">
                  <AlertTriangle className="text-shiraz shrink-0 mt-0.5" size={18} />
                  <div>
                    <strong className="font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.achtungDieDinHaftungsfalle} /></strong>
                    <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.dinNormenUndRichtlinien} /></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Sachverständigenwesen */}
          {activeSubTab === 'gutachter' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Sachverständigenwesen */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <Search className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.dasSachverständigenwesenGutachtertypen} /></h3>
                  <p className="text-sm text-slate-800 mb-3 leading-relaxed"><MdText text={inhalt.texte.dieBezeichnungGutachterOder} /></p>
                  <div className="space-y-3.5 text-sm text-slate-800">
                    <div className="border-l-2 border-shiraz pl-3">
                      <strong className="text-slate-900"><MdText text={inhalt.texte.t1ÖffentlichBestelltUnd} /></strong>
                      <p className="text-xs text-slate-600 mt-1"><MdText text={inhalt.texte.durchEineÖffentlichRechtliche} /></p>
                    </div>
                    <div className="border-l-2 border-home-grau/30 pl-3">
                      <strong className="text-slate-900"><MdText text={inhalt.texte.t2ZertifiziertNachDin} /></strong>
                      <p className="text-xs text-slate-600 mt-1"><MdText text={inhalt.texte.internationalAnerkannterQualifikationsna} /></p>
                    </div>
                    <div className="border-l-2 border-home-grau/30 pl-3">
                      <strong className="text-slate-900"><MdText text={inhalt.texte.t3PrüfsachverständigeStaatlichAnerkannte} /></strong>
                      <p className="text-xs text-slate-600 mt-1"><MdText text={inhalt.texte.freiberuflichTätigeNachLandesrecht} /></p>
                    </div>
                  </div>
                </div>

                {/* Verfahrensarten */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <Gavel className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.verfahrensartenVorGericht} /></h3>
                  <p className="text-sm text-slate-800 mb-3 leading-relaxed"><MdText text={inhalt.texte.jeNachAuftraggeberEntfaltet} /></p>
                  <div className="space-y-3 text-sm text-slate-800">
                    <div className="bg-white p-3 rounded border border-home-grau/30">
                      <strong className="text-slate-900 block">Privatgutachten</strong><MdText text={inhalt.texte.einseitigVonEinerPartei} /></div>
                    <div className="bg-white p-3 rounded border border-home-grau/30">
                      <strong className="text-slate-900 block">Gerichtsgutachten</strong><MdText text={inhalt.texte.vomRichterÜberEinen} /></div>
                    <div className="bg-white p-3 rounded border-2 border-shiraz/20">
                      <strong className="text-slate-900 block flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-shiraz rounded-full animate-ping"></span><MdText text={inhalt.texte.selbstständigesBeweisverfahren} /></strong><MdText text={inhalt.texte.verfahrenNach485Ff} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Rollen & Haftung */}
          {activeSubTab === 'haftung' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Rechte und Pflichten */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
                  <Users className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.rechtePflichtenRollenAm} /></h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-800">
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col gap-1">
                    <h4 className="font-bold text-slate-900 border-b pb-1.5 mb-1.5 flex items-center gap-1">
                      <Gavel size={14} className="text-shiraz" /> Bauherr
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.zentralerVertragspartnerUndBesteller} /></p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col gap-1">
                    <h4 className="font-bold text-slate-900 border-b pb-1.5 mb-1.5 flex items-center gap-1">
                      <Gavel size={14} className="text-shiraz" /><MdText text={inhalt.texte.planerArchitekt} /></h4>
                    <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.schuldetEineMangelfreieGenehmigungsfähig} /></p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col gap-1">
                    <h4 className="font-bold text-slate-900 border-b pb-1.5 mb-1.5 flex items-center gap-1">
                      <Gavel size={14} className="text-shiraz" /> Bauunternehmer
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.werkvertraglichVerpflichtetZurAbsolut} /><strong className="block text-shiraz mt-1 font-semibold"><MdText text={inhalt.texte.kritischePflicht} /></strong><MdText text={inhalt.texte.prüfUndHinweispflichtEr} /></p>
                  </div>
                </div>
              </div>

              {/* Versicherungen am Bau */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl animate-in fade-in duration-300">
                <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.haftungsdeckungRisikoAbsicherungAm} /></h3>
                <p className="text-sm text-slate-800 mb-4 leading-relaxed"><MdText text={inhalt.texte.dieAbwicklungVonBauschäden} /></p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-800">
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-950 border-b border-home-grau/30 pb-2 mb-2">
                        Bauleistungs-Versicherung
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-xs"><MdText text={inhalt.texte.schütztBauherrUndUnternehmer} /></p>
                    </div>
                    <p className="mt-3 text-xs text-shiraz font-bold bg-rose-50/40 p-1.5 rounded border border-shiraz/10"><MdText text={inhalt.texte.schließtBaumängelSchlechteAusführung} /></p>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-950 border-b border-home-grau/30 pb-2 mb-2">
                        Bauherrenhaftpflicht
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-xs"><MdText text={inhalt.texte.decktDieGesetzlichenHaftpflichtrisiken} /></p>
                    </div>
                    <p className="mt-3 text-xs text-slate-700 font-bold bg-slate-50 p-1.5 rounded border border-home-grau/30 text-center"><MdText text={inhalt.texte.existenzsicherungFürBauherren} /></p>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-950 border-b border-home-grau/30 pb-2 mb-2">
                        Planer-Berufshaftpflicht
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-xs"><MdText text={inhalt.texte.sichertDenArchitektenOder} /></p>
                    </div>
                    <p className="mt-3 text-xs text-slate-700 font-bold bg-slate-50 p-1.5 rounded border border-home-grau/30 text-center"><MdText text={inhalt.texte.pflichtFürKammermitgliederArchitekten} /></p>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-950 border-b border-home-grau/30 pb-2 mb-2">
                        Unternehmer-Haftpflicht
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-xs"><MdText text={inhalt.texte.sichertDasBauunternehmenBei} /></p>
                    </div>
                    <p className="mt-3 text-xs text-shiraz font-bold bg-rose-50/40 p-1.5 rounded border border-shiraz/10"><MdText text={inhalt.texte.dasEigeneGewerkNachzubessern} /></p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1VerjährungVon}
        zielGleichung="t_{Ende} = t_{Abnahme} + T"
        schritte={inhalt.daten["Bauschaeden.schritte"]}
        ergebnisHinweis={inhalt.werte.dieFristenGeltenSoweit}
        normQuelle={inhalt.werte.bgb634a204Vob}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bauschaeden" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap11}
        weblinks={inhalt.daten["Bauschaeden.weblinks"]} 
        wikipedia={[
          { title: "Baumangel", url: "https://de.wikipedia.org/wiki/Baumangel" },
          { title: inhalt.werte.anerkannteRegelnDerTechnik, url: "https://de.wikipedia.org/wiki/Anerkannte_Regeln_der_Technik" },
          { title: "Rissbreite" }
        ]} 
        literatur={inhalt.daten["Bauschaeden.literatur"]} 
        regelwerke={inhalt.daten["Bauschaeden.regelwerke"]} 
        formeln={inhalt.daten["Bauschaeden.formeln"]} 
      />
    </div>
  );
}
