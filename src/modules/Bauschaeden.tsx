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
  Lightbulb,
  Copy,
  Check,
  RotateCcw,
  FileSignature,
  Paperclip,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

type SchadTab = 'recht' | 'schriftverkehr' | 'normen' | 'gutachter' | 'haftung' | 'kleb_dicht';

export default function Bauschaeden() {
  const [activeSubTab, setActiveSubTab] = useState<SchadTab>('recht');

  // Schriftverkehr-States
  const [noticeType, setNoticeType] = useState<'bedenken' | 'behinderung' | 'mangel' | 'nachtrag'>('bedenken');
  const [senderName, setSenderName] = useState('Ingenieurbüro Dr.-Ing. M. Huber');
  const [recipientName, setRecipientName] = useState('Bauwerksgesellschaft Nord GmbH & Co. KG');
  const [projectName, setProjectName] = useState('TH Augsburg - Modernisierung Trakt D / Raum D1.05');
  const [affectedTrade, setAffectedTrade] = useState('Bodenbelagsarbeiten (Gewerk 036) – Vorleistung Estrich/Betonboden');
  const [noticeDetail, setNoticeDetail] = useState('Die Rohbetondecke weist an diversen Stellen eine Restfeuchte von über 3,8 CM-% auf.');
  const [consequenceText, setConsequenceText] = useState('Gefahr von Blasenbildung, Haftungsverlust der Grundierung und Ablösungen des Designguss-Bodenbelags.');
  const [deadlineDate, setDeadlineDate] = useState('25.10.2026');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(getLetterContent());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleReset = () => {
    setSenderName('Ingenieurbüro Dr.-Ing. M. Huber');
    setRecipientName('Bauwerksgesellschaft Nord GmbH & Co. KG');
    setProjectName('TH Augsburg - Modernisierung Trakt D / Raum D1.05');
    if (noticeType === 'bedenken') {
      setAffectedTrade('Bodenbelagsarbeiten (Gewerk 036) – Vorleistung Estrich/Betonboden');
      setNoticeDetail('Die Rohbetondecke weist an diversen Stellen eine Restfeuchte von über 3,8 CM-% auf.');
      setConsequenceText('Gefahr von Blasenbildung, Haftungsverlust der Grundierung und Ablösungen des Designguss-Bodenbelags.');
    } else if (noticeType === 'behinderung') {
      setAffectedTrade('Estrich- und Bodenbelagsarbeiten (Gewerk 024)');
      setNoticeDetail('Vorgewerk Heizungsinstallation hat die Fußbodenheizung nicht abgedrückt und fertiges Trocknungs-Aufheizprotokoll fehlt.');
      setConsequenceText('Baustelle steht still; nachfolgende Belagslegearbeiten können nicht aufgenommen werden; Verzug im Gesamtterminplan.');
    } else if (noticeType === 'mangel') {
      setAffectedTrade('Außenputzarbeiten - Westfassade');
      setNoticeDetail('Feine Haarrisse entlang der horizontalen Arbeitsfugen im Oberputz sowie Feuchtigkeitsränder am Sockelbereich.');
      setConsequenceText('Nacherfüllung / Sanierung durch fachgerechtes Aufbringen einer rissüberbrückenden Beschichtung.');
    } else {
      setAffectedTrade('Zusätzlicher mineralischer Brandschutzputz der GK-Wände');
      setNoticeDetail('Bauaufsichtliche geänderte Anordnung zur Brandschutzauflage F90 statt der geplanten F60 Brandwand.');
      setConsequenceText('Kostenaufwand ca. 4.250,- EUR netto für Brandschutzverkleidung; Arbeitszeitverlängerung von 3 Arbeitstagen.');
    }
  };

  const handleTypeChange = (type: 'bedenken' | 'behinderung' | 'mangel' | 'nachtrag') => {
    setNoticeType(type);
    if (type === 'bedenken') {
      setAffectedTrade('Bodenbelagsarbeiten (Gewerk 036) – Vorleistung Estrich/Betonboden');
      setNoticeDetail('Die Rohbetondecke weist an diversen Stellen eine Restfeuchte von über 3,8 CM-% auf.');
      setConsequenceText('Gefahr von Blasenbildung, Haftungsverlust der Grundierung und Ablösungen des Designguss-Bodenbelags.');
    } else if (type === 'behinderung') {
      setAffectedTrade('Estrich- und Bodenbelagsarbeiten (Gewerk 024)');
      setNoticeDetail('Vorgewerk Heizungsinstallation hat die Fußbodenheizung nicht abgedrückt und fertiges Trocknungs-Aufheizprotokoll fehlt.');
      setConsequenceText('Baustelle steht still; nachfolgende Belagslegearbeiten können nicht aufgenommen werden; Verzug im Gesamtterminplan.');
    } else if (type === 'mangel') {
      setAffectedTrade('Außenputzarbeiten - Westfassade');
      setNoticeDetail('Feine Haarrisse entlang der horizontalen Arbeitsfugen im Oberputz sowie Feuchtigkeitsränder am Sockelbereich.');
      setConsequenceText('Beseitigung aller Risse und Feuchtigkeitsschäden entsprechend WTA-Richtlinien und Neuaufbau Sockelbereich.');
    } else {
      setAffectedTrade('Zusätzlicher mineralischer Brandschutzputz der GK-Wände');
      setNoticeDetail('Bauaufsichtliche geänderte Anordnung zur Brandschutzauflage F90 statt der geplanten F60 Brandwand.');
      setConsequenceText('Kostenaufwand ca. 4.250,- EUR netto für Brandschutzverkleidung; Arbeitszeitverlängerung von 3 Arbeitstagen.');
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
    { id: 'recht', label: 'Definitionen & Recht', icon: Scale, desc: 'Mangel vs. Schaden, Gewährleistung, Fristen & Beweislast' },
    { id: 'schriftverkehr', label: 'Formular- & VOB-Schriftverkehr', icon: FileText, desc: 'Mängelrüge, Behinderungs- und Bedenkenanzeige nach VOB/B & BGB' },
    { id: 'normen', label: 'Normen & Technikstufen', icon: BookOpen, desc: 'Anerkannte Regeln vs. Stand der Technik, Relevanz von DIN-Normen' },
    { id: 'gutachter', label: 'Sachverständigenwesen', icon: Search, desc: 'Gutachtertypen, Qualifikationsstufen und rechtliche Verfahrensarten' },
    { id: 'haftung', label: 'Rollen & Haftung am Bau', icon: Users, desc: 'Rechte/Pflichten der Akteure sowie Bauversicherungen' },
    { id: 'kleb_dicht', label: 'Kleb- & Dichtstoff-Schäden', icon: Paperclip, desc: 'Anwendungstipps, Fehlerquellen, Alterungsmechanismen & typische Schadensbilder' },
  ] as const;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <FileWarning className="text-shiraz animate-pulse" /> Bauschäden: Technische und rechtliche Grundlagen
          </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Juristische Definitionen, Entwicklungsstufen der Technik, Baurecht und typische Gefährdungs- und Schadensbilder.
          </p>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p className="leading-relaxed">
            Ein Bauschaden ist eine Verschlechterung des Gebäudezustands, die durch mangelhafte Planung, Materialfehler, Ausführungsfehler oder äußere Einflüsse verursacht wird. Um Bauschäden richtig einzuordnen und rechtlich zu verfolgen, ist die Unterscheidung zwischen <strong>Schaden</strong> und <strong>Mangel</strong> essenziell.
          </p>
        </div>

        {/* Dynamic Multi-Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 border-b border-home-grau/30 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id);
                }}
                className={`py-3 px-2 rounded-xl border text-center flex flex-col items-center justify-between gap-1.5 transition-all ${
                  isActive 
                    ? 'bg-shiraz/5 border-shiraz text-shiraz shadow-sm ring-1 ring-shiraz/20' 
                    : 'bg-stone-50/50 border-home-grau/30 hover:bg-stone-50 hover:border-home-grau/40 text-text-main/80'
                }`}
                title={tab.desc}
              >
                <Icon size={18} className={isActive ? 'text-shiraz animate-bounce' : 'text-text-main/60'} />
                <span className="font-bold text-xs sm:text-xs tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab-Inhalte */}
        <div className="mt-2">
          
          {/* Tab 1: Rechtliche Grundlagen */}
          {activeSubTab === 'recht' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Mangel vs. Schaden */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <AlertCircle className="text-shiraz shrink-0" size={18} />
                    Mangel vs. Schaden
                  </h3>
                  <div className="space-y-3 text-sm text-slate-800 leading-relaxed">
                    <p>
                      <strong>Der Baumangel (Ursache - BGB § 633):</strong> Ein Mangel liegt vor, wenn die Ist-Beschaffenheit des Werks von der vertraglichen Soll-Beschaffenheit abweicht. Das Werk hat nicht die vereinbarte Beschaffenheit oder die für den gewöhnlichen Gebrauch übliche Beschaffenheit (z.B. Abdichtung im Fundament gar nicht erst eingebaut).
                    </p>
                    <p>
                      <strong>Der Bauschaden (Wirkung):</strong> Der Schaden ist die tatsächliche physikalische Verschlechterung und nachteilige Folge eines Mangels (z.B. nasser Keller, Schimmelbildung an den Wänden).
                    </p>
                    <div className="p-3 bg-shiraz/5 border-l-2 border-shiraz rounded text-xs text-text-main">
                      <span className="font-bold text-shiraz">Praxis-Tipp:</span> Nicht jeder Mangel führt sofort zu einem sichtbaren Schaden. Dennoch besteht bereits bei Entdeckung eines reinen Mangels ein Mängelbeseitigungsanspruch, um Folgeschäden präventiv abzuwenden.
                    </div>
                  </div>
                </div>

                {/* Gewährleistung vs. Garantie */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <ShieldCheck className="text-shiraz shrink-0" size={18} />
                    Gewährleistung vs. Garantie
                  </h3>
                  <div className="space-y-3 text-sm text-slate-800 leading-relaxed">
                    <div className="bg-white p-3 rounded border border-home-grau/30">
                      <span className="font-bold text-slate-900 block mb-1">Gewährleistung (Gesetzlicher Mängelanspruch)</span>
                      Aus Werkvertragsrecht (BGB/VOB). Der Auftragnehmer muss gesetzlich verschuldensunabhängig dafür einstehen, dass das Werk bei Abnahme frei von Sachmängeln ist. Es ist ein einklagbares, hartes Recht.
                    </div>
                    <div className="bg-white p-3 rounded border border-home-grau/30">
                      <span className="font-bold text-slate-900 block mb-1">Garantie (Freiwillige Zusage)</span>
                      Zusätzliche, zivilrechtliche Willenserklärung (meist vom Produkthersteller, z.B. dacheindeckendes Ziegelwerk garantiert 30 Jahre Frostbeständigkeit). Erstreckt sich unabhängig von der Abnahmesituation über einen definierten Zeitraum.
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Verjährung */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <Clock className="text-shiraz shrink-0" size={18} />
                    Verjährungsfristen von Mängelansprüchen
                  </h3>
                  <p className="text-sm text-slate-800 mb-3 leading-relaxed">
                    Die Frist beginnt grundsätzlich mit der förmlichen oder stillschweigenden <strong>Abnahme</strong>. Nach Verjährungseintritt sind Nacherfüllungsansprüche ausgeschlossen.
                  </p>
                  <table className="w-full text-sm text-slate-800 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-left">
                        <th className="p-2 border border-home-grau/30 font-semibold">Basis</th>
                        <th className="p-2 border border-home-grau/30 font-semibold">Dauer &amp; Bereich</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border border-home-grau/30 font-medium">BGB (§ 634a)</td>
                        <td className="p-2 border border-home-grau/30"><strong>5 Jahre</strong> für Bauwerke und damit fest verbundene Materialien.</td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="p-2 border border-home-grau/30 font-medium">VOB/B (§ 13)</td>
                        <td className="p-2 border border-home-grau/30"><strong>4 Jahre</strong> für Bauwerke nach § 13 Abs. 4 Nr. 1 VOB/B, sofern nichts anderes vereinbart. Eine schriftliche Mängelrüge setzt nach § 13 Abs. 5 Nr. 1 eine neue 2-Jahres-Frist in Gang (nicht vor Ablauf der Regelfrist).</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-home-grau/30 font-medium">Arglistige Täuschung</td>
                        <td className="p-2 border border-home-grau/30 text-shiraz font-medium"><strong>Regelverjährung</strong> nach §§ 195, 199 BGB (3 Jahre ab Schluss des Jahres der Kenntnis, Höchstfristen § 199 Abs. 3/4), bei Bauwerken jedoch nicht vor Ablauf der 5-Jahres-Frist (§ 634a Abs. 3 Satz 2 BGB).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Beweislast & Mängelrüge */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <Scale className="text-shiraz shrink-0" size={18} />
                    Beweislast und Mängelrüge
                  </h3>
                  <ul className="list-disc pl-5 space-y-2.5 text-sm text-slate-800 leading-relaxed">
                    <li>
                      <strong>Vor der Abnahme:</strong> Der Bauunternehmer trägt das Risiko und muss bei Streitigkeiten die lückenlose Mangelfreiheit seiner Arbeiten vertraglich nachweisen.
                    </li>
                    <li>
                      <strong>Nach der Abnahme (Beweislastumkehr):</strong> Mit Vollzug der Abnahme geht das Werk in die Obhut des Bauherrn über. Ab diesem Tag muss der Bauherr nachweisen, dass der gerügte Mangel bereits bei Abnahme im Keim verborgen lag.
                    </li>
                    <li>
                      <strong>Mängelrüge-Verfahren:</strong> Beim BGB-Vertrag ist die Mängelanzeige formfrei (Textform aus Beweisgründen dringend empfohlen); beim VOB/B-Vertrag ist für die Wirkungen des § 13 Abs. 5 VOB/B die Schriftform erforderlich. Der Bauherr setzt eine <strong>angemessene Frist zur Nacherfüllung</strong>; Sekundärrechte (Selbstvornahme § 637, Rücktritt, Minderung, Schadensersatz) setzen grundsätzlich deren erfolglosen Ablauf voraus.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Aktuelle Rechtsprechung & Bau-Trends (BGH 2018 & Gebäudetyp E) */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-base text-slate-900 mb-2 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                  <Gavel className="text-shiraz shrink-0" size={18} />
                  Aktuelle Rechtsprechung &amp; Trends im Baurecht (Wichtig für die Praxis)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="font-bold text-shiraz flex items-center gap-1.5 uppercase text-xs tracking-wide">
                      🛑 BGH, Urt. v. 22.02.2018 – VII ZR 46/17: keine fiktiven Mängelbeseitigungskosten
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      Der Bundesgerichtshof (BGH) hat im Jahr 2018 seine langjährige Rechtsprechung grundlegend geändert (Az. VII ZR 46/17). Zuvor konnten Bauherren Mängelbeseitigungskosten auf Basis von Kostenvoranschlägen fiktiv abrechnen und das Geld anderweitig behalten.
                    </p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-150 leading-relaxed">
                      <strong>Neue Regelung:</strong> Schadenersatz wegen eines Baumangels kann im Werkvertragsrecht (BGB) nicht mehr anhand der voraussichtlichen (fiktiven) Reparaturkosten verlangt werden. Dem Bauherrn stehen nun drei Wege offen:
                      <ul className="list-disc pl-4 mt-1.5 space-y-1">
                        <li><strong>Vorschussanspruch:</strong> Anforderung eines zweckgebundenen Vorab-Vorschusses zur tatsächlichen Behebung des Mangels (Abrechnungspflicht nach Durchführung!).</li>
                        <li><strong>Minderung:</strong> Geltendmachung des Wertverlusts des Objekts durch den verbleibenden Mangel.</li>
                        <li><strong>Nachträgliche Abrechnung:</strong> Mangel erst beheben lassen und dann Erstattung der konkret angefallenen (IST) Kosten fordern.</li>
                        <li className="list-none -ml-4 mt-1 text-slate-500">Hinweis: Im Kaufrecht hält der V. Zivilsenat an der fiktiven Abrechnung fest (BGH, V ZR 33/19).</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="font-bold text-[#A3113E] flex items-center gap-1.5 uppercase text-xs tracking-wide">
                      🏗️ Gebäudetyp E: "Einfaches Bauen" (Gesetzgebungsstand 2026)
                    </span>
                    <p className="text-xs text-slate-850 leading-relaxed">
                      Die bayerische Initiative (Pilotprojekte, Abweichungen nach Art. 63 BayBO) und der Bundesgesetzentwurf zum <strong>Gebäudetyp E</strong> (E wie "Einfach" oder "Experimentell") zielen darauf ab, das Bauen bezahlbarer zu machen. Der Kabinettsentwurf vom 06.11.2024 entfiel mit dem Ende der 20. Wahlperiode; am 20.11.2025 legten BMJV und BMWSB Eckpunkte vor; ein im Juli 2026 angekündigter neuer Gesetzentwurf befindet sich noch in der Ressortabstimmung und ist nicht veröffentlicht; ein Gesetz ist nicht in Kraft (Stand 10/2026). 
                    </p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-150 leading-relaxed">
                      <strong>Rechtlicher Hintergrund:</strong> Bislang wird standardmäßig verlangt, dass Wohngebäude allen Komfort-DIN-Normen vollumfänglich entsprechen (z.B. Schallschutz, Steckdosenanzahl, etc.), da diese als "Anerkannte Regeln der Technik" gelten. Eine nicht vereinbarte Abweichung ist daher ein Mangel, auch ohne Schaden.
                      <p className="mt-1.5">
                        <strong>Ziel der Neuregelung:</strong> Vertragspartner sollen einfacher von reinen Komfortstandards abweichen können, sofern die <strong>Standsicherheit, der Brandschutz und elementare Sicherheitsstandards</strong> unberührt bleiben. Schon heute zulässig ist eine ausdrückliche, informierte Vereinbarung einer Abweichung von den a. R. d. T. (ständige BGH-Rechtsprechung).
                      </p>
                    </div>
                  </div>
                </div>
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
                  <h3 className="text-xl font-bold text-text-main flex items-center gap-2">Interaktives VOB-Anzeigen- &amp; Schriftverkehrscenter</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Schnittstellendisziplin am Bau: Schriftliche Anzeigen sind im VOB/B-Vertrag keine bürokratische Schikane, sondern oft die einzige Möglichkeit zur <strong>Vermeidung von Haftungsansprüchen</strong>, <strong>Verlängerung von Bauzeiten</strong> oder <strong>Erhalt von Vergütungsansprüchen</strong>. Wählen Sie unten ein Dokument aus, passen Sie die Parameter an, und erhalten Sie ein rechtlich belastbares Musterschreiben nach DIN 5008 für Ihr Bautagebuch!
          </p>
        </div>
                </div>
              </div>

              {/* Grid: 1. Dok-Auswahl & Editor | 2. Brief-Vorschau */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Linke Spalte (Dokumenttyp + Editor-Inputs) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  
                  {/* Dok-Typ-Karten */}
                  <div className="bg-white border border-home-grau/30 rounded-xl p-4 shadow-sm">
                    <span className="text-xs font-bold text-text-main/60 uppercase tracking-wider block mb-3">
                      1. Schriftverkehr-Typ wählen (VOB/B &amp; BGB)
                    </span>
                    
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
                          <span className={`block font-bold text-xs ${noticeType === 'bedenken' ? 'text-shiraz' : 'text-text-main'}`}>
                            Bedenkenanmeldung (§ 4 Abs. 3 VOB/B)
                          </span>
                          <span className="text-xs text-text-main/60 block mt-0.5 leading-snug">
                            Schützt den Auftragnehmer bei Ausführungsmängeln durch ungeeignete Vorgaben/Vorstoffe dritter Gewerke vor der Haftung.
                          </span>
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
                          <span className={`block font-bold text-xs ${noticeType === 'behinderung' ? 'text-shiraz' : 'text-text-main'}`}>
                            Behinderungsanzeige (§ 6 Abs. 1 VOB/B)
                          </span>
                          <span className="text-xs text-text-main/60 block mt-0.5 leading-snug">
                            Sichert Fristverlängerungen und schützt vor Vertragsstrafen, wenn Vorarbeiten stocken oder Pläne fehlen.
                          </span>
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
                          <span className={`block font-bold text-xs ${noticeType === 'mangel' ? 'text-shiraz' : 'text-text-main'}`}>
                            Mängelrüge / Mängelanzeige (§ 13 VOB/B)
                          </span>
                          <span className="text-xs text-text-main/60 block mt-0.5 leading-snug">
                            Fordert den Vertragspartner unter Fristsetzung zur Nachbesserung im Rahmen der Gewährleistung auf.
                          </span>
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
                          <span className={`block font-bold text-xs ${noticeType === 'nachtrag' ? 'text-shiraz' : 'text-text-main'}`}>
                            Nachtragsanzeige / Mehrkosten (§ 2 VOB/B)
                          </span>
                          <span className="text-xs text-text-main/60 block mt-0.5 leading-snug">
                            Kündigt rechtsverbindlich Mehrkosten und Ansprüche auf Zusatzvergütung für Planänderungen vor Ausführung an.
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Interaktiver Editor */}
                  <div className="bg-white border border-home-grau/30 rounded-xl p-4 shadow-sm flex flex-col gap-3.5">
                    <div className="flex justify-between items-center border-b border-home-grau/30 pb-2">
                      <span className="text-xs font-bold text-text-main/60 uppercase tracking-wider">
                        2. Brief-Parameter anpassen
                      </span>
                      <button 
                        onClick={handleReset}
                        className="text-text-main/50 hover:text-shiraz transition-all text-xs font-medium flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-home-grau/15"
                        title="Beispiel-Standardwerte wiederherstellen"
                      >
                        <RotateCcw size={11} /> Zurücksetzen
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-text-main/70">Bauvorhaben / Projektname:</label>
                        <input aria-label="Bauvorhaben / Projektname" 
                          type="text" 
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className="px-2.5 py-1.5 border border-home-grau/30 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-shiraz/40 text-text-main"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-text-main/70">Aussteller / Absender:</label>
                          <input aria-label="Aussteller / Absender" 
                            type="text" 
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="px-2.5 py-1.5 border border-home-grau/30 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-shiraz/40 text-text-main"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-text-main/70">Empfänger / Gegner:</label>
                          <input aria-label="Empfänger / Gegner" 
                            type="text" 
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="px-2.5 py-1.5 border border-home-grau/30 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-shiraz/40 text-text-main"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-text-main/70">Gegenstand / Betroffenes Gewerk:</label>
                        <input aria-label="Gegenstand / Betroffenes Gewerk" 
                          type="text" 
                          value={affectedTrade}
                          onChange={(e) => setAffectedTrade(e.target.value)}
                          className="px-2.5 py-1.5 border border-home-grau/30 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-shiraz/40 text-text-main"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-text-main/70 text-text-main">
                          {noticeType === 'bedenken' && 'Konkrete Beanstandung / Bedenkengrund:'}
                          {noticeType === 'behinderung' && 'Grund der Behinderung (Störung):'}
                          {noticeType === 'mangel' && 'Genaue Mängelbeschreibung (Abweichung Ist-Soll):'}
                          {noticeType === 'nachtrag' && 'Detailbeschreibung der Zusatzleistung:'}
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
                          {noticeType === 'bedenken' && 'Erwartete technische Schadensfolge:'}
                          {noticeType === 'behinderung' && 'Organisatorische Auswirkung:'}
                          {noticeType === 'mangel' && 'Geforderte Sanierungsart / Nacherfüllung:'}
                          {noticeType === 'nachtrag' && 'Kostenabschätzung / zeitlicher Mehraufwand:'}
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
                          {noticeType === 'mangel' ? 'Mängelbeseitigungs-Frist (Datum):' : 'Datum der Anordnung / Frist-Referenz:'}
                        </label>
                        <input 
                          type="text" 
                          value={deadlineDate}
                          onChange={(e) => setDeadlineDate(e.target.value)}
                          className="px-2.5 py-1.5 border border-home-grau/30 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-shiraz/40 text-text-main"
                          placeholder="z.B. 15.06.2026"
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
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                          Live DIN 5008-Entwurfsvorschau · Mustertext (keine Rechtsberatung)
                        </span>
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
                        {copySuccess ? 'Kopiert!' : 'Brieftext kopieren'}
                      </button>
                    </div>

                    <div className="p-6 bg-[#f8fafc] border-b border-home-grau/15 font-mono text-xs sm:text-xs text-stone-900 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all max-h-[440px] overflow-y-auto">
                      {getLetterContent()}
                    </div>

                    <div className="p-3 bg-stone-100/50 text-xs text-text-main/60 flex items-center justify-between gap-2">
                      <span>⚠️ Der Briefentwurf stellt keine einzelfallbezogene Rechtsberatung dar.</span>
                      <span className="font-bold text-shiraz">VOB Entwurf</span>
                    </div>
                  </div>

                  {/* VOB/B Rechtlicher Praxistipp */}
                  <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl flex gap-3 text-sm text-slate-800 leading-relaxed">
                    <AlertTriangle className="text-amber-700 shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                      <strong className="font-bold text-amber-950 block mb-1">
                        Die 3 folgenschwersten Fehler bei VOB-Anzeigen:
                      </strong>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-2.5 text-xs text-amber-900">
                        <div className="bg-white/85 p-2.5 rounded border border-amber-100">
                          <strong className="block text-amber-950">1. Nur per SMS / WhatsApp?</strong>
                          <p className="text-xs text-slate-700 leading-normal mt-1">
                            § 6 Abs. 1 VOB/B verlangt eine <strong>schriftliche Behinderungsanzeige</strong>; ohne Anzeige wird die Behinderung nur bei Offenkundigkeit berücksichtigt. Senden Sie wichtige Anzeigen daher vorab digital und zusätzlich nachweisbar (z. B. Einschreiben).
                          </p>
                        </div>
                        <div className="bg-white/85 p-2.5 rounded border border-amber-100">
                          <strong className="block text-amber-950">2. Adressat: Nur der Architekt?</strong>
                          <p className="text-xs text-slate-700 leading-normal mt-1">
                            Der Architekt ist Sachwalter des Bauherrn, aber <strong>ohne Vollmacht nicht rechtsgeschäftlich vertretungsbefugt</strong> (z. B. für Fristen oder Nachträge). Schicken Sie Anzeigen <strong>immer</strong> auch direkt an den Bauherrn (AG).
                          </p>
                        </div>
                        <div className="bg-white/85 p-2.5 rounded border border-amber-100">
                          <strong className="block text-amber-950">3. Zu ungenaue Mängelbeschreibung?</strong>
                          <p className="text-xs text-slate-700 leading-normal mt-1">
                            Eine Anzeige muss <strong>unverzüglich</strong> abgegeben werden und die <strong>Auswirkungen konkret lokalisieren</strong> sowie quantifizieren (z.B. genaue Angabe über Bauteile und Verzugsdauer).
                          </p>
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
                  <BookOpen className="text-shiraz" shrink-0="true" size={20} />
                  Die drei Entwicklungsstufen der Technik im Baurecht
                </h3>
                <p className="text-sm text-slate-800 mb-4 leading-relaxed">
                  Die juristische Bewertung eines Baumangels stützt sich maßgeblich auf die Einstufung der betroffenen Bauweise in eine von drei technischen Reifegradstufen:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-800 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col gap-2">
                    <div className="font-bold text-shiraz border-b border-shiraz/10 pb-2">1. Stand der Wissenschaft</div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Ebene der theoretischen Grundlagen und brandaktuellen Forschungsergebnisse. Keine oder minimale praktische Langzeiterfahrungen vorhanden. Muss im Standardhochbau rechtlich <strong>nicht</strong> eingehalten werden, es sei denn, es wurde vertraglich explizit vereinbart (Premium-Detaillösung) oder ein Spezialgesetz verlangt es (z. B. Atomrecht; Produkthaftung: Stand von Wissenschaft und Technikheitsrelevant.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col gap-2">
                    <div className="font-bold text-slate-800 border-b border-home-grau/30 pb-2">2. Stand der Technik</div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Der wissenschaftlich begründete, fortschrittlichste Entwicklungsstand, der in der Praxis erfolgreich erprobt wurde und dessen Eignung als zuverlässig gesichert gilt. Wichtig vor allem in sicherheitskritischen Gewerken wie dem Brandschutz oder bei ökologischem Immissionsschutz.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-shiraz/20 shadow-sm relative flex flex-col gap-2">
                    <div className="absolute -top-3 right-2 bg-shiraz text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                      Schuldbestandteil
                    </div>
                    <div className="font-bold text-shiraz border-b border-shiraz/10 pb-2">3. Anerkannte Regeln der Technik</div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Die Standardstufe am Bau (a.R.d.T.). Es handelt sich um theoretisch wissenschaftlich als richtig anerkannte Grundsätze, die von der breiten Mehrheit der Fachpraktiker angewandt und als bewährt eingestuft werden. Der Unternehmer schuldet sie mangels abweichender, informierter Vereinbarung als <strong>Mindeststandard</strong> (maßgeblich: Zeitpunkt der Abnahme).
                    </p>
                  </div>
                </div>

                <div className="bg-rose-50/40 border border-shiraz/20 p-4 rounded-xl flex gap-3 text-sm text-slate-800 leading-relaxed">
                  <AlertTriangle className="text-shiraz shrink-0 mt-0.5" size={18} />
                  <div>
                    <strong className="font-bold text-slate-900 block mb-1">Achtung: Die DIN-Haftungsfalle für Ingenieure</strong>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      DIN-Normen und Richtlinien sind private Regelwerke ohne Rechtsnormcharakter. Verordnungen sind dagegen Recht; über die MVV TB / VV TB eingeführte Technische Baubestimmungen sind bauaufsichtlich verbindlich. Es gilt zwar die richterliche Vermutungswirkung, dass eine eingehaltene DIN-Norm den a.R.d.T. entspricht.
                      <br />
                      <strong>Jedoch:</strong> Hat sich die Praxis weiterentwickelt, während die Norm veraltet ist, haftet der Planer/Unternehmer trotz "DIN-Konformität", sofern die DIN-Vorgabe hinter den tatsächlichen anerkannten Regeln der Technik zurückbleibt!
                    </p>
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
                    <Search className="text-shiraz shrink-0" size={18} />
                    Das Sachverständigenwesen & Gutachtertypen
                  </h3>
                  <p className="text-sm text-slate-800 mb-3 leading-relaxed">
                    Die Bezeichnung "Gutachter" oder "Sachverständiger" ist rechtlich ungeschützt. Umso wichtiger ist die Form der Validierung und Zertifizierung:
                  </p>
                  <div className="space-y-3.5 text-sm text-slate-800">
                    <div className="border-l-2 border-shiraz pl-3">
                      <strong className="text-slate-900">1. Öffentlich bestellt und vereidigt (ö.b.u.v.):</strong>
                      <p className="text-xs text-slate-600 mt-1">
                        Durch eine öffentlich-rechtliche Institution (z. B. Ingenieurkammer, IHK) rigoros auf Fachkompetenz und persönliche Eignung geprüft. Gerichte sollen nach § 404 Abs. 3 ZPO vorrangig öffentlich bestellte Sachverständige heranziehen.
                      </p>
                    </div>
                    <div className="border-l-2 border-home-grau/30 pl-3">
                      <strong className="text-slate-900">2. Zertifiziert nach DIN EN ISO/IEC 17024:</strong>
                      <p className="text-xs text-slate-600 mt-1">
                        International anerkannter Qualifikationsnachweis. Personenbezogene Zertifizierung, die ständige Weiterbildung und Rezertifizierungen erfordert. In der Praxis werden auch zertifizierte Sachverständige von Gerichten beauftragt; die gesetzliche Vorrangregel des § 404 Abs. 3 ZPO gilt aber nur für öffentlich bestellte.
                      </p>
                    </div>
                    <div className="border-l-2 border-home-grau/30 pl-3">
                      <strong className="text-slate-900">3. Prüfsachverständige / staatlich anerkannte Sachverständige:</strong>
                      <p className="text-xs text-slate-600 mt-1">
                        Freiberuflich tätige, nach Landesrecht (z. B. PrüfVBau in Bayern) behördlich anerkannte Personen, die bauordnungsrechtliche Nachweise prüfen und bescheinigen (Standsicherheit, Brandschutz, technische Anlagen).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verfahrensarten */}
                <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                  <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <Gavel className="text-shiraz shrink-0" size={18} />
                    Verfahrensarten vor Gericht
                  </h3>
                  <p className="text-sm text-slate-800 mb-3 leading-relaxed">
                    Je nach Auftraggeber entfaltet ein Gutachten im Prozessrecht völlig unterschiedliche Wirkung:
                  </p>
                  <div className="space-y-3 text-sm text-slate-800">
                    <div className="bg-white p-3 rounded border border-home-grau/30">
                      <strong className="text-slate-900 block">Privatgutachten</strong>
                      Einseitig von einer Partei beauftragt und finanziert. Gilt zivilprozessual nicht als neutrales Beweismittel, sondern als reiner, parteiischer "qualifizierter Sachvortrag".
                    </div>
                    <div className="bg-white p-3 rounded border border-home-grau/30">
                      <strong className="text-slate-900 block">Gerichtsgutachten</strong>
                      Vom Richter über einen Beweisbeschluss direkt an einen neutralen Sachverständigen übertragen. Dient dem Gericht als unmittelbare Urteilshilfe.
                    </div>
                    <div className="bg-white p-3 rounded border-2 border-shiraz/20">
                      <strong className="text-slate-900 block flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-shiraz rounded-full animate-ping"></span>
                        Selbstständiges Beweisverfahren
                      </strong>
                      Verfahren nach §§ 485 ff. ZPO zur Beweissicherung; es hemmt die Verjährung (§ 204 Abs. 1 Nr. 7 BGB). Es dient der Zustandsfeststellung (z. B. bei fortschreitender Rissbildung oder bevor Bauteile abgerissen/überbaut werden), um langwierige Hauptprozessblockaden abzuwenden.
                    </div>
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
                  <Users className="text-shiraz shrink-0" size={18} />
                  Rechte, Pflichten &amp; Rollen am Bau
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-800">
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col gap-1">
                    <h4 className="font-bold text-slate-900 border-b pb-1.5 mb-1.5 flex items-center gap-1">
                      <Gavel size={14} className="text-shiraz" /> Bauherr
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Zentraler Vertragspartner und Besteller. Ist verpflichtet, den Baugrund zu stellen und (sofern mängelfrei) die Abnahme zu erklären sowie den Werklohn zu entrichten. Besitzt das uneingeschränkte Hausrecht auf der Baustelle.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col gap-1">
                    <h4 className="font-bold text-slate-900 border-b pb-1.5 mb-1.5 flex items-center gap-1">
                      <Gavel size={14} className="text-shiraz" /> Planer / Architekt
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Schuldet eine mangelfreie, genehmigungsfähige und ausführbare Werkplanung streng nach den a.R.d.T. Haftet für Fehler seiner Leistung; für die Tragwerksplanung haftet primär der Tragwerksplaner. Bei Überwachungsfehlern haftet er gesamtschuldnerisch mit dem Unternehmer (vorrangige Inanspruchnahme des Unternehmers nach § 650t BGB).
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col gap-1">
                    <h4 className="font-bold text-slate-900 border-b pb-1.5 mb-1.5 flex items-center gap-1">
                      <Gavel size={14} className="text-shiraz" /> Bauunternehmer
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Werkvertraglich verpflichtet zur absolut physischen Mangelfreiheit des vertraglich vereinbarten Werks. 
                      <strong className="block text-shiraz mt-1 font-semibold">Kritische Pflicht:</strong> Prüf- und Hinweispflicht. Er muss die Vorleistungen anderer Handwerker und Vorgaben des Planers vor Ausführung sorgfältig prüfen und bei Fehlern sofort schriftlich warnen (Bedenkenanmeldung).
                    </p>
                  </div>
                </div>
              </div>

              {/* Versicherungen am Bau */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl animate-in fade-in duration-300">
                <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="text-shiraz shrink-0" size={18} />
                  Haftungsdeckung &amp; Risiko-Absicherung am Bau
                </h3>
                <p className="text-sm text-slate-800 mb-4 leading-relaxed">
                  Die Abwicklung von Bauschäden ist stark an den Versicherungsschutz gekoppelt. Es gilt hier die fundamentale Unterscheidung zwischen dem Vermögensschaden durch eine mangelhafte Ausführung (reine Gewährleistung) und dem Dritt- oder Sachschaden:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-800">
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-950 border-b border-home-grau/30 pb-2 mb-2">
                        Bauleistungs-Versicherung
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-xs">
                        Schützt Bauherr und Unternehmer während der Bauzeit bis zur Abnahme vor <strong>unvorhergesehenen Sachschäden</strong> am Objekt, z. B. durch Unwetter, Vandalismus, Diebstahl fest eingebauter Teile oder unvorhergesehene Baugrundereignisse.
                      </p>
                    </div>
                    <p className="mt-3 text-xs text-shiraz font-bold bg-rose-50/40 p-1.5 rounded border border-shiraz/10">
                      ⚠️ Schließt Baumängel (Schlechte Ausführung / Pfusch) komplett aus!
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-950 border-b border-home-grau/30 pb-2 mb-2">
                        Bauherrenhaftpflicht
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-xs">
                        Deckt die gesetzlichen Haftpflichtrisiken des Besitzers ab. Tritt ein, wenn <strong>Dritte im unmittelbaren Umkreis der Baustelle geschädigt werden</strong> (z.B. mangelnde Verkehrssicherungspflicht wie unbeleuchtete Grube führt zu Passantensturz).
                      </p>
                    </div>
                    <p className="mt-3 text-xs text-slate-700 font-bold bg-slate-50 p-1.5 rounded border border-home-grau/30 text-center">
                      Existenzsicherung für Bauherren
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-950 border-b border-home-grau/30 pb-2 mb-2">
                        Planer-Berufshaftpflicht
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-xs">
                        Sichert den Architekten oder bauaufsichtsführenden Ingenieur gegen Ansprüche ab, die aus <strong>groben Planungsfehlern oder unzureichender Bauoberleitung</strong> resultieren. In fast allen Bauteams Voraussetzung für Planaufträge.
                      </p>
                    </div>
                    <p className="mt-3 text-xs text-slate-700 font-bold bg-slate-50 p-1.5 rounded border border-home-grau/30 text-center">
                      Pflicht für Kammermitglieder (Architekten-/Ingenieurgesetze der Länder)
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-950 border-b border-home-grau/30 pb-2 mb-2">
                        Unternehmer-Haftpflicht
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-xs">
                        Sichert das Bauunternehmen bei Drittschäden und <strong>Mängelfolgeschäden</strong> ab (z.B. Handwerker bohrt versehentlich Wasserleitung an, Wasser flutet fertiges Nachbargeschoss).
                      </p>
                    </div>
                    <p className="mt-3 text-xs text-shiraz font-bold bg-rose-50/40 p-1.5 rounded border border-shiraz/10">
                      ⚠️ Das eigene Gewerk nachzubessern (die vertragliche Pflicht), ist NIE haftpflichtversichert!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Kleb- & Dichtstoff-Schäden */}
          {activeSubTab === 'kleb_dicht' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header Box mit Praxis-Relevanz */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/30 pb-3 mb-4">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Paperclip className="text-shiraz shrink-0" size={20} />
                    Kleb- und Dichtstoffe: Praxisleitfaden &amp; Bauschadensprävention
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-shiraz/10 text-shiraz border border-shiraz/20 self-start sm:self-auto">
                    DIN 18540 • DIN EN 15651 • IVD-Merkblätter
                  </span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">
                  Fugendichtstoffe und Bauklebstoffe gehören zu den am höchsten beanspruchten Baustoffen der Gebäudehülle und des Innenausbaus. Sie müssen gleichzeitig permanente thermische Bauwerksbewegungen aufnehmen, chemisch an unterschiedlichen Substraten haften und Witterungs-, UV- sowie Feuchtigkeitseinflüssen trotzen. <strong>Ein großer Teil der Fugen- und Klebeschäden entsteht nicht durch Materialversagen, sondern durch Planungs- und Verarbeitungsfehler!</strong>
                </p>
              </div>

              {/* Sektion 1: Anwendungstipps für die Baustellenpraxis */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                  <Lightbulb className="text-shiraz shrink-0" size={18} />
                  1. Anwendungstipps für eine mangelfreie Ausführung (Best Practice)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-shiraz border-b border-shiraz/10 pb-1.5 mb-2">
                        <CheckCircle2 size={15} /> 1. Untergrundprüfung
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Trocken, tragfähig, trennmittelfrei:</strong> Beton und mineralische Untergründe müssen saugfähig und frei von Schalöl, Zementschlämme oder Staub sein. Feuchtigkeitsgrenzen strikt beachten (z.B. &lt; 4 CM-% bei Beton für Reaktionsharze).
                      </p>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 bg-off-white p-1.5 rounded border border-home-grau/20">
                      Tipp: Abreißtest / Gitterschnitt vorab anlegen
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-shiraz border-b border-shiraz/10 pb-1.5 mb-2">
                        <CheckCircle2 size={15} /> 2. Primer &amp; Haftbrücken
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Systemgerechte Voranstriche:</strong> Poröse mineralische Flanken verlangen filmbildende Tiefengrundierungen/Primer; dichte Metalle und Kunststoffe benötigen silanhaltige Haftvermittler oder Reiniger (Cleaner) zum Entfetten.
                      </p>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 bg-off-white p-1.5 rounded border border-home-grau/20">
                      Ablüftezeiten (5–30 min) zwingend einhalten!
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-shiraz border-b border-shiraz/10 pb-1.5 mb-2">
                        <CheckCircle2 size={15} /> 3. Fugendimensionierung
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Geometrie:</strong> Zuordnung Fugenbreite ↔ Dichtstoffdicke nach Tabelle DIN 18540 (Außenwandfugen, Mindestbreite 10 mm). Faustregel (IVD): <span className="font-semibold">b ≤ 10 mm: b : t ≈ 1 : 1</span>, <span className="font-semibold">b &gt; 10 mm: b : t ≈ 2 : 1</span> (z. B. 20 mm Breite &rarr; 10 mm Tiefe).
                      </p>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 bg-off-white p-1.5 rounded border border-home-grau/20">
                      Verhindert unzulässige Dehnungsspitzen
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-shiraz border-b border-shiraz/10 pb-1.5 mb-2">
                        <CheckCircle2 size={15} /> 4. Hinterfüllung &amp; Glätten
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Zweiflankenhaftung sichern:</strong> Geschlossenzellige PE-Rundschnüre (ca. 25% überdimensioniert) stauchungsfrei einbringen. Abglätten nur mit neutralem, herstellergeprüftem Glättmittel ohne Spülmittelzusätze!
                      </p>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 bg-off-white p-1.5 rounded border border-home-grau/20">
                      Keine scharfen Werkzeuge zum Eindrücken nutzen
                    </div>
                  </div>
                </div>
              </div>

              {/* Sektion 2: Häufige Fehlerquellen */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                  <AlertTriangle className="text-shiraz shrink-0" size={18} />
                  2. Häufige Fehlerquellen in Planung und Ausführung
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-lg border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 border-b border-rose-100 pb-1.5 mb-2">
                        <XCircle size={16} /> Dreiflankenhaftung (Klassischer Kardinalfehler)
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Wird die Fuge ohne Hinterfüllung bis auf den Fugenboden ausgespritzt, haftet die Masse an <strong>drei Seiten</strong> (beide Flanken + Boden). Bei temperaturbedingter Bauteilöffnung kann sich der Dichtstoff nicht elastisch einschnüren – es entstehen extrem hohe multiaxiale Spannungsspitzen, die unweigerlich zu Flankenabriss oder Mitteltrennung führen.
                      </p>
                    </div>
                    <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-900 font-semibold">
                      Prävention: PE-Rundschnur oder PE-Antihaftfolie am Grund!
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 border-b border-rose-100 pb-1.5 mb-2">
                        <XCircle size={16} /> Taupunktunterschreitung &amp; Feuchtefilm
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Applikation bei hoher Luftfeuchte oder auf noch feuchtem Untergrund (Morgentau, nach Regen). Der mikroskopisch feine Wasserfilm verhindert die molekulare Benetzung des Substrats vollständig. Die Masse härtet scheinbar normal aus, löst sich aber beim ersten Zugversuch wie ein Abziehkaugummi rückstandslos ab.
                      </p>
                    </div>
                    <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-900 font-semibold">
                      Prävention: Oberflächentemperatur mind. 3 °C über Taupunkt!
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 border-b border-rose-100 pb-1.5 mb-2">
                        <XCircle size={16} /> Falsche Polymerwahl &amp; Randzonenverschmutzung
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Verwendung von Standard-Essig-Silikonen (acetatvernetzend) auf saugenden Natursteinen (Granit, Marmor). Die austretende Essigsäure und ungebundenes Weichmacheröl wandern kapillar in den Stein und erzeugen unumkehrbare dunkle "Ölränder" (Randzonenverschmutzung / Weichmacherwanderung).
                      </p>
                    </div>
                    <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-900 font-semibold">
                      Prävention: Nur weichmacherfreie Natursteinsilikone (neutralvernetzend)!
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 border-b border-rose-100 pb-1.5 mb-2">
                        <XCircle size={16} /> Überschreitung der offenen Zeit / Hautbildung
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Wird die Dichtstofffuge nach dem Einbringen zu spät geglättet oder ein Klebstoff erst nach Beginn der Hautbildungszeit (Skinning) gefügt, kann der Klebstoff die Gegenfläche nicht mehr molekular benetzen. Es verbleibt eine lose Scheinverbindung mit extrem mangelhafter Haftfestigkeit.
                      </p>
                    </div>
                    <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-900 font-semibold">
                      Prävention: Nur meterweise vorgehen; Glätten &lt; 10 min!
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 border-b border-rose-100 pb-1.5 mb-2">
                        <XCircle size={16} /> Hausmittel als Glättmittel (Spülmittel-Effekt)
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Verwendung handelsüblicher Geschirrspülmittel als Abglättwasser. Die enthaltenen Tenside und Fette waschen Dichtstoffbestandteile an der Oberfläche aus, hinterlassen Schlieren auf den Flanken, verhindern ein Nachbessern und fördern massiv Schimmelbildung und Verfärbungen.
                      </p>
                    </div>
                    <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-900 font-semibold">
                      Prävention: Ausschließlich abgestimmte Systemglättmittel nutzen!
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 border-b border-rose-100 pb-1.5 mb-2">
                        <XCircle size={16} /> Unzureichende Fugenbreite (Überdehnung)
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Fugenbreite zu schmal bemessen (z.B. nur 4–5 mm an Fassadenfertigteilen). Bei jahreszeitlichen Temperaturwechseln (&Delta;T ≈ 60 K) dehnen sich Betonplatten um mehrere Millimeter aus. Die zulässige Gesamtverformung (ZGV) von meist 20–25 % wird drastisch überschritten (&gt; 50 % Dehnbeanspruchung).
                      </p>
                    </div>
                    <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-[11px] text-rose-900 font-semibold">
                      Prävention: Thermische Längenänderung rechnerisch dimensionieren!
                    </div>
                  </div>
                </div>
              </div>

              {/* Sektion 3: Alterungsmechanismen von Polymeren */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                  <Clock className="text-shiraz shrink-0" size={18} />
                  3. Alterungsmechanismen &amp; chemisch-physikalische Zersetzung
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Polymernetzwerke von Dicht- und Klebstoffen unterliegen im Lebenszyklus irreversiblen Alterungsprozessen. Diese führen zu Versprödung, Elastizitätsverlust, Volumenverlust oder Gefügeerweichung:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <span className="font-bold text-shiraz block text-xs">☀️ Photooxidation (UV-Strahlung)</span>
                    <p className="text-slate-700 leading-relaxed">
                      Kurzwellige UV-Photonen spalten kovalente Bindungen der Polymerhauptkette (z.B. C-C- oder C-N-Bindungen bei PU). Radikalreaktionen führen zu Kettenabbrüchen, Kreidung der Oberfläche und Mikrorissbildung.
                    </p>
                    <span className="text-[11px] text-slate-500 block">Silikone (Si-O-Bindung) sind extrem UV-stabil; Polyurethane mäßig; Acrylate bedingt.</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <span className="font-bold text-shiraz block text-xs">💧 Hydrolytischer Abbau (Feuchte)</span>
                    <p className="text-slate-700 leading-relaxed">
                      Permanente Wassereinwirkung spaltet hydrolyseempfindliche Ester- oder Urethangruppen im Polymerrückgrat. Führt zum Verlust von Vernetzungspunkten, Nachlassen der Kohäsion und Erweichen der Masse.
                    </p>
                    <span className="text-[11px] text-slate-500 block">Kritisch bei stehendem Wasser in Boden- und Flachdachfugen ohne Gefälle.</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <span className="font-bold text-shiraz block text-xs">🌡️ Weichmacher-Migration &amp; Verflüchtigung</span>
                    <p className="text-slate-700 leading-relaxed">
                      Niedermolekulare Weichmacher diffundieren bei sommerlichen Temperaturen an die Oberfläche und verdampfen oder wandern in poröse Nachbarbaustoffe ab.
                    </p>
                    <span className="text-[11px] text-slate-500 block">Folge: Massiver Volumenschwund, Erhöhung des E-Moduls (Versprödung) und Rissbildung.</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-home-grau/30 space-y-1.5">
                    <span className="font-bold text-shiraz block text-xs">🦠 Mikrobieller Befall (Schimmelbildung)</span>
                    <p className="text-slate-700 leading-relaxed">
                      In Feuchträumen nutzen Pilzsporen Seifenreste, Hautschuppen und verbrauchte Fungizide als Nährboden. Das Myzel wächst in die Poren ein und zersetzt Weichmacherbestandteile bio-chemisch.
                    </p>
                    <span className="text-[11px] text-slate-500 block">Fungizide Zusätze werden mit der Zeit ausgewaschen; Silikonfugen in Nassbereichen sind daher Wartungsfugen.</span>
                  </div>
                </div>
              </div>

              {/* Sektion 4: Typische Schadensbilder & Diagnostik */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2">
                  <FileWarning className="text-shiraz shrink-0" size={18} />
                  4. Typische Schadensbilder im Gutachterfokus (Ursachen &amp; Sanierung)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Schadensbild 1 */}
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
                        <span className="font-bold text-slate-900 text-sm">Flankenabriss (Adhäsionsbruch)</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                          häufigstes Schadensbild
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Erscheinungsbild:</strong> Der Dichtstoffstrang löst sich bandförmig von einer oder beiden Fugenflanken ab, bleibt in sich aber elastisch und unbeschädigt.
                      </p>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Hauptursachen:</strong> Fehlender oder ungeeigneter Primer, staubiger oder feuchter Untergrund bei Einbau, Tauwasserbeschlag, unzureichender Anpressdruck beim Glätten, Dreiflankenhaftung.
                      </p>
                    </div>
                    <div className="mt-3 p-2 bg-off-white rounded border border-home-grau/30 text-[11px] text-slate-800">
                      <strong>Sanierung:</strong> Komplett herausschneiden, Flanken mechanisch anschleifen/fräsen, neuer Primer, PE-Rundschnur, normgerecht neu verfugen.
                    </div>
                  </div>

                  {/* Schadensbild 2 */}
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
                        <span className="font-bold text-slate-900 text-sm">Kohäsionsbruch (Mittenriss / Materialriss)</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          häufig
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Erscheinungsbild:</strong> Längsriss mittig im Dichtstoffquerschnitt. Die Haftung an beiden Fugenflanken ist intakt, das Dichtstoffgefüge selbst ist gerissen.
                      </p>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Hauptursachen:</strong> Fuge zu schmal dimensioniert (Überdehnung über ZGV), Dichtstoff zu dünn aufgetragen (Sollbruchstelle) oder Dichtstoff durch UV/Alterung vollkommen versprödet.
                      </p>
                    </div>
                    <div className="mt-3 p-2 bg-off-white rounded border border-home-grau/30 text-[11px] text-slate-800">
                      <strong>Sanierung:</strong> Rechnerische Fugenbreite prüfen; ggf. Fuge aufweiten (Ausschneiden und Aufweiten), hochdehnfähigen Dichtstoff (Klasse 25LM) einbringen.
                    </div>
                  </div>

                  {/* Schadensbild 3 */}
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
                        <span className="font-bold text-slate-900 text-sm">Blasenbildung &amp; Aufschäumen</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          Polyurethan / 2K
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Erscheinungsbild:</strong> Sichtbare Poren, Blasen oder Schwammstruktur im Dichtstoffkern oder an der Oberfläche nach der Aushärtung.
                      </p>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Hauptursachen:</strong> Feuchtigkeit im mineralischen Porengefüge reagiert mit Isocyanat-Gruppen (Polyurethan) unter CO₂-Gasbildung (<span className="font-mono">R-NCO + H₂O &rarr; R-NH₂ + CO₂ &uarr;</span>). Starke Sonneneinstrahlung bei frischer Fuge treibt Luft aus Poren.
                      </p>
                    </div>
                    <div className="mt-3 p-2 bg-off-white rounded border border-home-grau/30 text-[11px] text-slate-800">
                      <strong>Sanierung:</strong> Aufgeschäumtes Material vollständig entfernen, Untergrund intensiv trocknen, feuchtigkeitstolerante MS-Polymere oder Epoxid-Absperrprimer einsetzen.
                    </div>
                  </div>

                  {/* Schadensbild 4 */}
                  <div className="bg-white p-4 rounded-lg border border-home-grau/30 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
                        <span className="font-bold text-slate-900 text-sm">Randzonenverschmutzung &amp; Verfärbung</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                          Naturstein / Fassade
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Erscheinungsbild:</strong> Dunkle, feucht wirkende Ränder beidseitig der Fuge auf Granit-, Sandstein- oder Marmorplatten, die sich nicht abwaschen lassen.
                      </p>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Hauptursachen:</strong> Nicht weichmacherfreie Silikone; Weichmacher und freie Silikonöle diffundieren in das Kapillarsystem des Natursteins und binden Schmutzpartikel unumkehrbar.
                      </p>
                    </div>
                    <div className="mt-3 p-2 bg-off-white rounded border border-home-grau/30 text-[11px] text-slate-800">
                      <strong>Sanierung:</strong> Meist irreparabel! Chemische Kompressenpasten können Weichmacher teilweise rücksaugen; oft ist nur Plattenaustausch wirksam.
                    </div>
                  </div>
                </div>

                {/* Wartungsfugen-Rechtshinweis */}
                <div className="bg-rose-50/40 border border-shiraz/25 p-4 rounded-xl flex gap-3 text-xs text-slate-800 leading-relaxed mt-2">
                  <AlertTriangle className="text-shiraz shrink-0 mt-0.5" size={18} />
                  <div>
                    <strong className="font-bold text-slate-900 block mb-1">
                      Juristischer Hinweis nach DIN 52460 &amp; VOB/B: Der Mythos der „Wartungsfuge“
                    </strong>
                    <p className="text-slate-700 leading-relaxed">
                      Häufig deklarieren Verarbeiter Silikonfugen pauschal als „Wartungsfugen“, um jegliche Gewährleistung nach VOB/B oder BGB abzuwehren.
                      <br />
                      <strong>Rechtliche Realität:</strong> Ob eine Fuge Wartungsfuge ist, richtet sich nach Vertrag und Beanspruchung; eine Wartungsfuge entbindet nicht von der Haftung für Ausführungsmängel, und der Unternehmer muss über den Wartungsbedarf aufklären. Nach DIN 52460 ist eine Wartungsfuge nur eine solche, die starken chemischen, thermischen oder mechanischen Belastungen ausgesetzt ist und deren Dichtstoff planmäßig vor Ablauf der bauüblichen Verjährungsfrist erneuert werden muss (z.B. in gewerblichen Großküchen, Schwimmbädern, Kläranlagen). <strong>Im normalen Wohnungsbau (z.B. Bad-Eckfuge) schützt die Bezeichnung „Wartungsfuge“ den Handwerker NICHT vor der 5-jährigen Gewährleistungspflicht für mangelhafte Ausführung!</strong>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Verjährung von Mängelansprüchen beim BGB- und beim VOB/B-Vertrag"
        zielGleichung="t_{Ende} = t_{Abnahme} + T"
        schritte={[
          { titel: 'BGB-Bauvertrag', erklaerung: 'Abnahme am 15. März 2021; Bauwerk: fünf Jahre (§ 634a Abs. 1 Nr. 2 BGB).', formel: 't_{Ende} = \\text{15. März 2026}' },
          { titel: 'VOB/B-Vertrag', erklaerung: 'Regelfrist für Bauwerke vier Jahre (§ 13 Abs. 4 Nr. 1 VOB/B):', formel: 't_{Ende} = \\text{15. März 2025}' },
          { titel: 'Schriftliche Mängelrüge', erklaerung: 'Zugang des schriftlichen Mängelbeseitigungsverlangens am 10. Januar 2025: Für diesen Mangel läuft eine neue Frist von zwei Jahren, nicht vor Ablauf der Regelfrist (§ 13 Abs. 5 Nr. 1 VOB/B).', formel: 't_{Ende,Mangel} = \\text{10. Januar 2027}' }
        ]}
        ergebnisHinweis="Die Fristen gelten, soweit nichts anderes vereinbart ist; Hemmung (z. B. selbständiges Beweisverfahren, § 204 Abs. 1 Nr. 7 BGB) und Arglist (§ 634a Abs. 3 BGB) verlängern sie. Keine Rechtsberatung – Einzelfälle juristisch prüfen."
        normQuelle="BGB §§ 634a, 204; VOB/B (Fassung 2016) § 13"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Mindestbreite einer elastischen Fassadenfuge"
        zielGleichung="b_{erf} = \frac{L \cdot \alpha_T \cdot \Delta T}{ZGV}"
        schritte={[
          { titel: 'Längenänderung', erklaerung: 'Betonfertigteil L = 6,0 m, α_T = 10 · 10⁻⁶ 1/K, Temperaturspanne der Bauteiloberfläche ΔT = 80 K:', formel: '\\Delta L = 6\\,000 \\cdot 10 \\cdot 10^{-6} \\cdot 80 = 4{,}8\\,\\text{mm}' },
          { titel: 'Dichtstoffklasse', erklaerung: 'Zulässige Gesamtverformung eines Dichtstoffs der Klasse 25LM:', formel: 'ZGV = 25\\,\\%' },
          { titel: 'Fugenbreite', erklaerung: 'Erforderliche Breite:', formel: 'b_{erf} = \\frac{4{,}8}{0{,}25} = 19{,}2\\,\\text{mm} \\Rightarrow 20\\,\\text{mm}' }
        ]}
        ergebnisHinweis="Zu schmale Fugen überdehnen den Dichtstoff und reißen ab – ein häufiger Bauschaden an Fassaden. Fugentiefe und Hinterfüllung nach DIN 18540 festlegen."
        normQuelle="DIN 18540; DIN EN 15651-1"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bauschaeden" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 11 Mängel & Schäden: BGB-/VOB/B-Fristen (VOB/B 2016 weiterhin gültig), Normausgaben geprüft; keine Rechtsberatung; fachliche Freigabe durch den Autor ausstehend)"
        weblinks={[
          { title: "BGB - Bürgerliches Gesetzbuch (Werkvertragsrecht)", url: "https://www.gesetze-im-internet.de/bgb/BJNR001950896.html#BJNR001950896BJNG005802377" },
          { title: "WTA e.V. - Wissenschaftlich-Technische Arbeitsgemeinschaft", url: "https://www.wta-gmbh.de" },
          { title: "IVD - Industrieverband Dichtstoffe e.V. (Merkblätter)", url: "https://www.ivd-ev.de" }
        ]} 
        wikipedia={[
          { title: "Baumangel", url: "https://de.wikipedia.org/wiki/Baumangel" },
          { title: "Anerkannte Regeln der Technik", url: "https://de.wikipedia.org/wiki/Anerkannte_Regeln_der_Technik" },
          { title: "Dichtstoff", url: "https://de.wikipedia.org/wiki/Dichtstoff" },
          { title: "Klebstoff", url: "https://de.wikipedia.org/wiki/Klebstoff" },
          { title: "Rissbreite" }
        ]} 
        literatur={[
          'Oswald, R.; Abel, R.: Hinzunehmende Unregelmäßigkeiten bei Gebäuden. Springer Vieweg',
          'Zimmermann, G. (Hrsg.): Bauschadens-Sammlung. Fraunhofer IRB Verlag',
          'Frössel, F.: Mauerwerkstrockenlegung und Kellersanierung. Fraunhofer IRB Verlag',
          'WTA-Merkblattsammlung: Bauwerksabdichtung und Denkmalpflege',
          'IVD-Merkblatt Nr. 1: Abdichtung von Bodenfugen mit elastischen Dichtstoffen',
          'IVD-Merkblatt Nr. 3: Konstruktive Ausführung und Abdichtung von Fugen im Sanitärbereich'
        ]} 
        regelwerke={[
          { title: 'DIN 18540 (Abdichten von Außenwandfugen im Hochbau mit elastischen Dichtstoffen)' },
          { title: 'DIN EN 15651 (Fugendichtstoffe für nicht tragende Anwendungen in Gebäuden)' },
          { title: 'DIN 52460 (Fugen- und Glasabdichtung - Begriffe)' },
          { title: 'DIN 18533-1 bis -3:2026-06 (Abdichtung von erdberührten Bauteilen)' },
          { title: 'DIN 18195:2025-12 (Abdichtung von Bauwerken - Begriffe)' },
          { title: 'WTA-Merkblatt 4-6 (Nachträgliches Abdichten erdberührter Bauteile)', url: 'https://www.wta-gmbh.de/' },
          { title: 'DIN EN 1992-1-1 / NA (Eurocode 2: Anforderung w_max = 0,2 bis 0,4 mm)' }
        ]} 
        formeln={[
          {
            formel: 'w_k = s_{r,\\text{max}} \\cdot (\\varepsilon_{sm} - \\varepsilon_{cm}) \\le w_{\\text{lim}}',
            erklaerung: 'Charakteristische Rissbreite wk nach Eurocode 2: Produkt aus maximalem Rissabstand sr,max und Dehnungsdifferenz zwischen Bewehrungsstahl und Betonmatrix (Grenzwert w_lim meist 0,20 bis 0,40 mm).',
            quelle: 'DIN EN 1992-1-1 Gl. 7.8'
          },
          {
            formel: 'b_{\\text{erf}} = \\frac{\\Delta L}{\\text{ZGV}} = \\frac{L \\cdot \\alpha_T \\cdot \\Delta T}{\\text{ZGV}}',
            erklaerung: 'Erforderliche Mindestfugenbreite elastischer Fugen: Ermittelt aus thermischer Längenänderung Delta L der angrenzenden Bauteile und der zulässigen Gesamtverformung (ZGV des Dichtstoffs nach Klasse, z. B. 25 % für 25LM/25HM nach DIN EN ISO 11600 bzw. DIN EN 15651-1) zuzüglich Herstell- und Montagetoleranzen.',
            quelle: 'DIN 18540 / DIN EN 15651-1'
          },
          {
            formel: 'q_w = k_f \\cdot i = k_f \\cdot \\frac{\\Delta h}{L}',
            erklaerung: 'Darcysches Filtergesetz für Durchfeuchtungsvorgänge im Erdreich/Porengefüge: Filtergeschwindigkeit q_w aus Durchlässigkeitsbeiwert k_f und hydraulischem Gefälle i.',
            quelle: 'DIN EN ISO 17892-11 (früher DIN 18130-1) / Bauphysik'
          }
        ]} 
      />
    </div>
  );
}
