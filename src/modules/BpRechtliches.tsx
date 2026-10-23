import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  Scale, FileCheck, ShieldCheck, Factory, FileSignature, Leaf, 
  Award, HelpCircle, CheckCircle2, ClipboardCheck, Check, Globe,
  BookOpen, Users, Layers, Activity, FileText
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';

interface BpRechtlichesProps {
  isEmbedded?: boolean;
  activeSubTab?: 'grundlagen' | 'avcp' | 'begriffe' | 'normenarbeit';
}

export default function BpRechtliches({ isEmbedded = false, activeSubTab: activeSubTabProp }: BpRechtlichesProps) {
  const [localActiveSubTab, setLocalActiveSubTab] = useState<'grundlagen' | 'avcp' | 'begriffe' | 'normenarbeit'>('grundlagen');
  const { setActiveTab } = useTabContext();

  const activeSubTab = activeSubTabProp || localActiveSubTab;
  const isDirectTab = !!activeSubTabProp;

  const subTabMetadata = {
    grundlagen: {
      title: "CE vs. Ü-Zeichen & MVV TB",
      subtitle: "Rechtliche Grundlagen & Zulassungen",
      desc: "Musterbauordnung (MBO), Landesbauordnungen (LBO), Landes-Verwaltungsvorschriften Technische Baubestimmungen (MVV TB) und der historische Systemwechsel durch das EuGH-Urteil 2014.",
      icon: Scale
    },
    avcp: {
      title: "AVCP-Systeme (Überwachung)",
      subtitle: "Die fünf Bewertungs- und Überprüfungssysteme (1+, 1, 2+, 3, 4)",
      desc: "Systematik und Träger der Fremd- und Eigenüberwachung zur Vergabe von Leistungserklärungen und CE- bzw. Ü-Kennzeichnungen nach europäischen und nationalen Vorgaben.",
      icon: ShieldCheck
    },
    begriffe: {
      title: "Konformitätsbewertung & Auditierung",
      subtitle: "Die begrifflichen Säulen des staatlichen und privaten Überwachungssystems",
      desc: "Präzise juristische und technische Definitionen von Akkreditierung, Notifizierung, Auditierung, Zertifizierung, Inspektion, Prüfung und Konformitätserklärung.",
      icon: Award
    },
    normenarbeit: {
      title: "Normenarbeit im Bauwesen",
      subtitle: "Strukturen des nationalen und internationalen Normungswesens",
      desc: "Organisationsebenen (ISO, CEN, DIN), Träger, Aufgaben der Ausschüsse sowie die rechtliche Verbindlichkeit und bauordnungsrechtliche Einführung von Baunormen.",
      icon: BookOpen
    }
  };

  const meta = subTabMetadata[activeSubTab];
  const MetaIcon = meta.icon;

  return (
    <div className={isEmbedded ? "flex flex-col gap-6" : "flex flex-col gap-8"}>
      <div className={isEmbedded ? "" : "bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30"}>
        {!isEmbedded && isDirectTab && (
          <div className="flex flex-col gap-4 mb-6 border-b border-home-grau/30 pb-6">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <MetaIcon className="text-indigo-600 animate-pulse" size={24} /> {meta.title}
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            <strong className="text-stone-700 font-semibold">{meta.subtitle}:</strong> {meta.desc}
          </p>
        </div>
          </div>
        )}

        {!isEmbedded && !isDirectTab && (
          <>
            <div className="flex flex-col gap-4 mb-6 border-b border-home-grau/30 pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-text-main flex items-center gap-2 animate-in slide-in-from-left duration-200">
                    <Scale className="text-indigo-600" /> Bauprodukte: Rechtliche Grundlagen &amp; Zulassungen
                  </h2>
                </div>
              </div>
              <p className="text-xs text-text-main/70">
                Juristische Regelwerke, europäische und nationale Verwendbarkeitsnachweise, Leistungserklärungen, fünf AVCP-Klassen sowie die Struktur der nationalen &amp; überstaatlichen Normenarbeit.
              </p>
            </div>

            {/* High-End Grid-Based Button Sub-Navigation like Schadstoffe */}
            <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-2xl mb-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: 'grundlagen' as const, label: 'CE vs. Ü-Zeichen & MVV TB', sub: 'Inverkehrbringen & Verwendbarkeit', icon: Scale },
                  { id: 'avcp' as const, label: 'AVCP-Systeme', sub: 'Die 5 Stufen der Fremdüberwachung', icon: ShieldCheck },
                  { id: 'begriffe' as const, label: 'Konformitätsbewertung', sub: 'Akkreditierung bis Verifizierung', icon: Award },
                  { id: 'normenarbeit' as const, label: 'Normenarbeit im Bauwesen', sub: 'Ebenen, Träger & Aufgaben', icon: BookOpen }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setLocalActiveSubTab(tab.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-start gap-1.5 text-left h-full cursor-pointer group ${
                        isActive 
                          ? 'bg-shiraz border-shiraz text-white shadow-md' 
                          : 'bg-white border-home-grau/30 hover:bg-off-white text-slate-700 hover:shadow-sm'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/15 text-white' : 'bg-shiraz/10 text-shiraz group-hover:bg-shiraz/20 transition-colors'}`}>
                        <Icon size={18} />
                      </div>
                      <span className={`text-xs font-bold leading-tight mt-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {tab.label}
                      </span>
                      <span className={`text-[10px] leading-tight ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                        {tab.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Base Info Banner */}
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
              <p>
                Bauprodukte dürfen in Deutschland und Europa nur verwendet werden, wenn sie einen gültigen <strong>Verwendbarkeitsnachweis</strong> vorweisen. Damit soll die Standsicherheit, die Gesundheit und der Brandschutz von Gebäuden gesichert und der freie Warenverkehr im Binnenmarkt harmonisiert werden.
              </p>
            </div>
          </>
        )}

        {/* Sub-Tab 1: EU vs. National */}
        {activeSubTab === 'grundlagen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* Rechtsstand-Box BauPVO */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
              <Scale className="text-amber-800 shrink-0 mt-0.5" size={16} />
              <div>
                <strong>Rechtsstand:</strong> Seit 08.01.2026 gilt die neue Bauproduktenverordnung (EU) 2024/3110. Die bisherige Verordnung (EU) 305/2011 gilt im Rahmen einer gestaffelten Übergangsfrist weiter für Produkte, deren harmonisierte Normen (hEN) noch nicht durch neue Rechtsakte abgelöst wurden.
              </div>
            </div>

            {/* Split View: EU vs National Base Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Europäischer Rahmen */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-indigo-900 flex items-center gap-2 pb-2 border-b border-home-grau/10">
                  <FileSignature className="w-5 h-5 text-indigo-600" /> Europäischer Rahmen (BauPVO &amp; CE)
                </h3>
                
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5"><Scale size={48} /></div>
                  <h4 className="font-bold text-indigo-800 text-sm mb-2 relative z-10">Die Bauproduktenverordnung (BauPVO)</h4>
                  <p className="text-xs text-gray-700 relative z-10 mb-2 leading-relaxed">
                    Die Bauproduktenverordnung (Verordnung (EU) 2024/3110 bzw. übergangsweise (EU) Nr. 305/2011) regelt das Inverkehrbringen von Bauprodukten im europäischen Binnenmarkt. Sie schreibt eine <strong>gemeinsame technische Sprache</strong> vor. Sie regelt nicht die konkrete Gebäude-Anforderung (dies bleibt Ländersache), sondern wie die Materialleistungen deklariert werden.
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5"><FileCheck size={48} /></div>
                  <h4 className="font-bold text-indigo-800 text-sm mb-2 relative z-10">Leistungserklärung (DoP) &amp; CE-Kennzeichnung</h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-gray-700 relative z-10">
                    <li><strong>hEN (Harmonisierte Europäische Norm):</strong> Gibt es zu einem Bauprodukt eine hEN (z. B. Zement nach EN 197-1), <em>muss</em> der Hersteller nach dieser Norm produzieren und die Konformität bewerten.</li>
                    <li><strong>Leistungserklärung (DoP - Declaration of Performance):</strong> Das rechtliche Dokument des Herstellers. Darin haftet er dafür, dass das gelieferte Produkt exakt die angegebenen Eigenschaften (z.B. Festigkeitsklasse, Brandklasse) erfüllt.</li>
                    <li><strong>CE-Kennzeichen:</strong> Bestätigt das Vorliegen einer DoP. <span className="text-red-750 font-semibold">Wichtig:</span> Das CE-Zeichen ist <strong>kein</strong> pauschales Gütesiegel für hervorragende Qualität! Ein Produkt darf qualitativ "schlecht" sein, solange die geringe Leistung in der DoP ehrlich deklariert ist und für den Einbauort ausreicht.</li>
                    <li><strong>ETA (European Technical Assessment):</strong> Freiwilliger Weg zur CE-Kennzeichnung für Bauprodukte, die nicht oder nicht vollständig von einer hEN abgedeckt werden (z. B. innovative Befestigungsmittel).</li>
                  </ul>
                </div>
              </div>

              {/* Nationaler Rahmen */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-indigo-900 flex items-center gap-2 pb-2 border-b border-home-grau/10">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" /> Nationaler Sektor &amp; Brauchbarkeit (DIBt &amp; Ü-Zeichen)
                </h3>
                
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 text-xs text-text-main/80 space-y-3">
                  <p className="leading-relaxed">
                    Fällt ein Bauprodukt nicht (oder unvollständig) unter eine harmonisierte europäische Norm, greifen in Deutschland die nationalen Kennzeichnungen basierend auf der <strong>Musterbauordnung (MBO)</strong>, den <strong>Landesbauordnungen (LBO)</strong> sowie den technischen Baubestimmungen (MVV TB).
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                      <p className="font-bold text-indigo-950 text-xs">abZ / abG (Allgemeine bauaufsichtliche Zulassung / Bauartgenehmigung)</p>
                      <p className="text-[11px] text-text-main/70 mt-1">Ausgestellt durch das <strong>DIBt (Deutsches Institut für Bautechnik)</strong> für innovative, nicht genormte Produkte. Berücksichtigt die nationalen Sicherheitsanforderungen.</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                      <p className="font-bold text-indigo-950 text-xs">abP (Allgemeines bauaufsichtliches Prüfzeugnis)</p>
                      <p className="text-[11px] text-text-main/70 mt-1">Für Produkte/Bauarten mit geringerem statischen Risiko, die nach allgemein anerkannten Prüfverfahren beurteilt werden können (z. B. Verbundabdichtungen im Bad).</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                      <p className="font-bold text-indigo-950 text-xs">ZiE / vBG (Zustimmung im Einzelfall / vorhabenbezogene Bauartgenehmigung)</p>
                      <p className="text-[11px] text-text-main/70 mt-1">Erteilt durch die Oberste Bauaufsichtsbehörde des Bundeslandes für ein konkretes, einzelnes Bauprojekt. Aufwendig und nur für dieses Vorhaben gültig.</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                      <p className="font-bold text-indigo-950 text-xs">Ü-Zeichen (Übereinstimmungszeichen)</p>
                      <p className="text-[11px] text-text-main/70 mt-1">Bestätigt, dass das Produkt mit der nationalen Norm (z.B. DIN-Norm) oder dem nationalen Brauchbarkeitsnachweis (abZ, abP) voll übereinstimmt. Das deutsche Gegenstück zum CE-Zeichen für den nicht-harmonisierten Sektor.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NEU: Paradigmenwechsel - MVV TB statt Bauregellisten */}
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                  <Scale className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-main">Systemwechsel in Deutschland: MVV TB ersetzt Bauregellisten</h4>
                  <span className="text-[10px] text-indigo-600 font-mono block">RECHTSPRECHUNG UND HISTORISCHER PARADIGMENWECHSEL IM DEUTSCHEN BAURECHT</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-text-main/80">
                <div className="space-y-3">
                  <p>
                    <strong className="text-slate-900">Die historische Rolle der Bauregellisten:</strong> Bis zum Jahr 2017 regelte das DIBt im Auftrag der Länder die Brauchbarkeit von Bauprodukten über die sogenannten nationalen <em>Bauregellisten (A, B, C)</em>. Produkte mit einem europäisch genormten CE-Zeichen durften in Deutschland oft trotzdem nicht ohne eine zusätzliche nationale Begutachtung und die Vergabe des beliebten <strong>Ü-Zeichens</strong> eingebaut werden.
                  </p>
                  <p>
                    <strong className="text-slate-900">Das folgenschwere EuGH-Urteil (Rs. C-100/13):</strong> Im Oktober 2014 entschied der Europäische Gerichtshof (EuGH), dass Deutschland die freie Zirkulation von harmonisierten CE-Bauprodukten behindert. Wenn ein harmonisierter Standard (hEN) existiert, darf ein EU-Mitgliedstaat für das Inverkehrbringen <span className="text-rose-600 font-bold underline">keine zusätzlichen Produktprüfungen</span> oder nationale Zeichen wie das Ü-Zeichen erzwingen.
                  </p>
                </div>
                <div className="space-y-3">
                  <p>
                    <strong className="text-slate-900">Die Geburtsstunde der MVV TB (Ab 2017):</strong> Um deutsche Brandschutz- und Standsicherheitsstandards baukonstruktiv zu bewahren, stellten die Bauministerien das gesamte Rechtssystem grundlegend um:
                  </p>
                  <div className="bg-white border border-home-grau/30 p-3 rounded-xl space-y-1.5 shadow-sm">
                    <p className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                      <Check size={14} className="text-emerald-600" /> Regulierung des Bauwerks statt des Bauprodukts
                    </p>
                    <p className="text-[10.5px] text-text-main/70 leading-relaxed">
                      Da das Bauprodukt selbst bei Markteintritt nicht mehr national blockiert werden darf, fordert das Baurecht nun bestimmte Eigenschaften am <strong>fertigen Bauwerk (Bauwerksanforderungen)</strong>. Die <em>Muster-Verwaltungsvorschrift Technische Baubestimmungen</em> (<strong>MVV TB</strong>, bzw. in den Ländern z.B. die <em>BayTB</em> in Bayern) regelt detailliert, welche brandschutztechnischen, ökologischen und tragphysikalischen Parameter das gesamte Bauwerk einhalten muss.
                    </p>
                    <p className="text-[10.5px] text-text-main/70 leading-relaxed">
                      Der Planer/Architekt steht seither in der Pflicht, aus der europäischen <strong>Leistungserklärung (DoP)</strong> des Herstellers die deklarierten Werte auszulesen und rechnerisch nachzuweisen, dass damit die Bauwerksanforderung der MVV TB exakt erfüllt wird.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* NEU: Systematische Abgrenzung CE-Kennzeichnung vs. Ü-Zeichen */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Layers className="w-5 h-5 text-indigo-600" /> Systematische Abgrenzung: CE-Kennzeichnung vs. Ü-Zeichen
              </h3>

              <div className="bg-white rounded-xl border border-home-grau/30 shadow-sm overflow-hidden text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  {/* CE-Kennzeichnung links */}
                  <div className="p-5 space-y-3 bg-indigo-50/10">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-indigo-950 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                        Europäisch Harmonisiert: CE-Kennzeichnung
                      </h4>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[9px] uppercase tracking-wider rounded">Muster BauPVO</span>
                    </div>

                    <div className="space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
                      <p>
                        <strong>Schnittstelle:</strong> Gilt zwingend für alle Bauprodukte, die von einer harmonisierten europäischen Norm (hEN) abgedeckt werden oder für die eine Europäische Technische Bewertung (ETA) existiert.
                      </p>
                      <p>
                        <strong>Das rechtliche Kernstück (DoP):</strong> Der Hersteller erstellt die <em>Leistungserklärung (Declaration of Performance)</em>. Darin deklariert er die tatsächlichen physikalischen Eigenschaften (z. B. Wärmeleitfähigkeit, Feuerwiderstand).
                      </p>
                      <p className="bg-amber-50 text-amber-900 p-2.5 rounded-lg border border-amber-200">
                        <span className="font-bold">Kein pauschales Gütesiegel:</span> Ein CE-Zeichen sagt <strong>nicht</strong>, ob ein Baustoff pauschal &quot;gut&quot; ist. Es ist ein reines Reisepass-Prinzip (freier Handel). Ob das Produkt für die Bauwerksgegebenheiten passt, muss der Planer selbst prüfen.
                      </p>
                      <p>
                        <strong>Doppelzulassung:</strong> Zusätzliche nationale Ü-Zeichen auf europäisch geregelten Produkten sind laut EuGH <span className="font-semibold text-rose-600">rechtswidrig</span> und verboten.
                      </p>
                    </div>
                  </div>

                  {/* Ü-Zeichen rechts */}
                  <div className="p-5 space-y-3 bg-emerald-50/10">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                        National geregelt: Übereinstimmungszeichen (Ü-Zeichen)
                      </h4>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase tracking-wider rounded">MVV TB / LBO</span>
                    </div>

                    <div className="space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
                      <p>
                        <strong>Schnittstelle:</strong> Gilt ausschließlich im nicht-harmonisierten Bereich (keine europäische hEN vorhanden). Es schließt die Lücke für nationale Spezialbaustoffe und innovative Konstruktionsweisen.
                      </p>
                      <p>
                        <strong>Brauchbarkeitsnachweis:</strong> Voraussetzung für das Inbringe- und Verwendungsrecht ist ein nationaler Brauchbarkeitsnachweis (beispielsweise eine allgemeine bauaufsichtliche Zulassung <em className="text-slate-800">abZ</em> oder ein Prüfzeugnis <em className="text-slate-800">abP</em>).
                      </p>
                      <p className="bg-emerald-50 text-emerald-900 p-2.5 rounded-lg border border-emerald-200">
                        <span className="font-bold">Konformitätsversprechen:</span> Das Ü-Zeichen bestätigt dem Handwerker und der Bauaufsicht direkt und unmissverständlich, dass der Baustoff den konkreten deutschen Sicherheitsanforderungen entspricht.
                      </p>
                      <p>
                        <strong>Verantwortung:</strong> Das Produkt bringt den Nachweis direkt mit – der Planer erbringt weniger rechnerische Herleitungen als beim CE-Verfahren, muss aber die Einbaubedingungen beachten.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Green Deal & Future */}
            <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 mt-2">
              <h3 className="font-bold text-indigo-900 text-md mb-2 flex items-center gap-1.5">
                <Leaf size={18} className="text-emerald-600" /> BauPVO 2024/3110 &amp; digitaler Produktpass (DPP)
              </h3>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Mit dem Inkrafttreten der neuen Bauproduktenverordnung (EU) 2024/3110 am 08.01.2026 sowie der Ökodesign-Verordnung (ESPR) wird Nachhaltigkeit rechtlich bindende Pflicht. Hersteller müssen den <strong>CO₂-Fußabdruck</strong>, die stoffliche <strong>Kreislauffähigkeit</strong> und weitere Umweltindikatoren über standardisierte Lebenszyklusphasen im Rahmen der Leistungserklärung deklarieren. Ein <strong>digitaler Produktpass (DPP)</strong> sichert die Rückverfolgbarkeit für das Urban Mining. Die Verordnung (EU) 305/2011 gilt übergangsweise bis zum Inkrafttreten der jeweiligen produktspezifischen Rechtsakte fort.
              </p>
            </div>
          </div>
        )}

        {/* Sub-Tab 2: AVCP-Systeme zur Leistungsüberwachung */}
        {activeSubTab === 'avcp' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-sm">
              <h3 className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5Packed">
                <Factory size={18} className="text-indigo-600" />
                AVCP-Systeme (Assessment and Verification of Constancy of Performance)
              </h3>
              <p className="text-text-main/80 text-xs leading-relaxed">
                Um sicherzustellen, dass nicht nur ein optimiertes &quot;Labor-Muster&quot; die Normvorgaben einhält, sondern auch das massenproduzierte Bauteil auf der reellen Baustelle dieselben Eigenschaften aufweist, schreibt das Bauproduktenrecht klar gestaffelte AVCP-Überwachungssysteme vor (dt. <em>Systeme zur Bewertung und Überprüfung der Leistungsbeständigkeit</em>): nach VO (EU) 305/2011 Anhang V die Systeme 1+, 1, 2+, 3 und 4; nach der neuen BauPVO (EU) 2024/3110 Anhang IX zusätzlich System 3+ für die Überprüfung von Umwelt-/Nachhaltigkeitsangaben. Welches Regime gilt, hängt davon ab, unter welcher Verordnung die technische Spezifikation (hEN/EAD) erstellt wurde.
              </p>
            </div>

            {/* AVCP Comparison Matrix Table */}
            <div className="bg-white rounded-xl border border-home-grau/30 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-home-grau/30">
                <h4 className="font-bold text-sm text-text-main">Aufgabenteilung im Rahmen der AVCP-Systeme</h4>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/50 border-b border-home-grau/30 text-text-main">
                      <th className="p-3 font-bold w-[12%]">System</th>
                      <th className="p-3 font-bold w-[15%]">Sicherheitsrelevanz</th>
                      <th className="p-3 font-bold w-[30%]">Aufgaben des Herstellers (Eigenüberwachung)</th>
                      <th className="p-3 font-bold w-[33%]">Aufgaben der notifizierten Stelle (Fremdüberwachung)</th>
                      <th className="p-3 font-bold w-[10%]">Beispiele</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/10 text-text-main/80">
                    {/* System 1+ */}
                    <tr className="hover:bg-indigo-50/10">
                      <td className="p-3 font-bold text-indigo-700">System 1+</td>
                      <td className="p-3 font-semibold text-red-700">Extrem hoch</td>
                      <td className="p-3">
                        <ul className="list-disc pl-3 space-y-1">
                          <li>Werkseigene Produktionskontrolle (WPK)</li>
                          <li>Prüfung von im Werk entnommenen Proben</li>
                        </ul>
                      </td>
                      <td className="p-3 text-slate-700">
                        <ul className="list-disc pl-3 space-y-1">
                          <li className="font-semibold text-indigo-900">Bestimmung des Produkttyps (Erstprüfung)</li>
                          <li>Erstinspektion des Werkes und der WPK</li>
                          <li>Laufende Überwachung, Bewertung und Evaluierung der WPK</li>
                          <li className="font-semibold text-emerald-800">Stichprobenprüfung von vor dem Inverkehrbringen entnommenen Proben (Audit-Testing)</li>
                        </ul>
                      </td>
                      <td className="p-3 italic">Normalzement (DIN EN 197-1), Sicherheits-Einpressmörtel</td>
                    </tr>

                    {/* System 1 */}
                    <tr className="hover:bg-indigo-50/10">
                      <td className="p-3 font-bold text-indigo-700">System 1</td>
                      <td className="p-3 font-semibold text-red-600">Sehr hoch</td>
                      <td className="p-3">
                        <ul className="list-disc pl-3 space-y-1">
                          <li>WPK im Herstellerwerk</li>
                          <li>Prüfung von Proben nach festgelegtem Prüfplan</li>
                        </ul>
                      </td>
                      <td className="p-3 text-slate-700">
                        <ul className="list-disc pl-3 space-y-1">
                          <li>Bestimmung des Produkttyps (Erstprüfung)</li>
                          <li>Erstinspektion des Werkes und der WPK</li>
                          <li>Laufende Überwachung, Bewertung und Evaluierung der WPK</li>
                          <li className="list-none text-home-grau text-[10px] block font-medium">(Kein Audit-Testing der Chargen vor Auslieferung)</li>
                        </ul>
                      </td>
                      <td className="p-3 italic">Rauchwarnmelder, Feuerschutzabschlüsse, tragende Holzbauteile</td>
                    </tr>

                    {/* System 2+ */}
                    <tr className="hover:bg-indigo-50/10 bg-emerald-50/10">
                      <td className="p-3 font-bold text-indigo-700">System 2+</td>
                      <td className="p-3 font-semibold text-amber-600">Hoch (Standard Tragwerk)</td>
                      <td className="p-3">
                        <ul className="list-disc pl-3 space-y-1">
                          <li className="font-semibold text-indigo-800">Bestimmung des Produkttyps (Eigen-Erstprüfung)</li>
                          <li>WPK im Werk</li>
                          <li>Prüfung von Proben nach Prüfplan</li>
                        </ul>
                      </td>
                      <td className="p-3 text-slate-700">
                        <ul className="list-disc pl-3 space-y-1">
                          <li className="font-semibold text-indigo-900">Erstinspektion des Werkes und der WPK</li>
                          <li className="font-semibold text-indigo-900">Laufende Überwachung der WPK (Auditierung)</li>
                          <li className="list-none text-xs text-emerald-800 font-semibold">Stelle zertifiziert ausschließlich die WPK!</li>
                        </ul>
                      </td>
                      <td className="p-3 italic">Betonstahl, Transportbeton, Mauersteine (Kat. I), Brettschichtholz</td>
                    </tr>

                    {/* System 3 */}
                    <tr className="hover:bg-indigo-50/10">
                      <td className="p-3 font-bold text-indigo-700">System 3</td>
                      <td className="p-3 font-semibold text-indigo-600">Mittel</td>
                      <td className="p-3">
                        <ul className="list-disc pl-3 space-y-1">
                          <li>WPK im Werk</li>
                        </ul>
                      </td>
                      <td className="p-3 text-slate-700">
                        <ul className="list-disc pl-3 space-y-1">
                          <li className="font-semibold text-indigo-900">Bestimmung des Produkttyps (Erstprüfung) durch ein notifiziertes Prüflabor</li>
                          <li className="list-none text-home-grau text-[10px] block">(Keine Inspektion des Werks oder laufende Fremdüberwachung)</li>
                        </ul>
                      </td>
                      <td className="p-3 italic">Wärmedämmstoffe, Gipsplatten, Innenputze, Dacheindeckungen</td>
                    </tr>

                    {/* System 3+ (Neu BauPVO 2024/3110) */}
                    <tr className="hover:bg-indigo-50/10 bg-emerald-50/20">
                      <td className="p-3 font-bold text-emerald-800">
                        System 3+
                        <span className="text-[9px] block text-emerald-600 font-normal">Neu: BauPVO (EU) 2024/3110</span>
                      </td>
                      <td className="p-3 font-semibold text-emerald-700">Umwelt &amp; Nachhaltigkeit</td>
                      <td className="p-3">
                        <ul className="list-disc pl-3 space-y-1">
                          <li>WPK im Werk</li>
                          <li>Ermittlung/Berechnung der Umweltmerkmale</li>
                        </ul>
                      </td>
                      <td className="p-3 text-slate-700">
                        <ul className="list-disc pl-3 space-y-1">
                          <li className="font-semibold text-emerald-900">Bewertung der Umwelt- und Nachhaltigkeitsangaben durch notifizierte Stelle</li>
                          <li className="list-none text-home-grau text-[10px] block">(Überprüfung der Umweltmerkmale in der DoP)</li>
                        </ul>
                      </td>
                      <td className="p-3 italic">Umweltmerkmale (GWP, Ökobilanz) in der Leistungserklärung nach neuer BauPVO</td>
                    </tr>

                    {/* System 4 */}
                    <tr className="hover:bg-indigo-50/10">
                      <td className="p-3 font-bold text-indigo-700">System 4</td>
                      <td className="p-3 font-semibold text-slate-600">Gering (Herstellerselbstdeklaration)</td>
                      <td className="p-3">
                        <ul className="list-disc pl-3 space-y-1">
                          <li className="font-bold text-indigo-800">Bestimmung des Produkttyps (Erstprüfung selbst)</li>
                          <li>WPK im Werk selbst</li>
                        </ul>
                      </td>
                      <td className="p-3 text-slate-50 font-bold bg-slate-50 text-center text-home-grau flex items-center justify-center p-3 h-full">
                        Keine notifizierte Stelle erforderlich
                      </td>
                      <td className="p-3 italic">Badezimmerkeramik (Sanitär), leichte Verkleidungsplatten</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-amber-50 border-t border-amber-200 text-xs text-amber-950">
                <strong>Wichtiger Hinweis zu Beton und Spannstahl:</strong> Beton nach DIN EN 206/DIN 1045-2 und Spannstahl sind in DE nicht CE-gekennzeichnet (national: Übereinstimmungsnachweis bzw. abZ).
              </div>
            </div>

            {/* In-depth AVCP Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/30 text-xs">
                <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-1">
                  <span className="p-1 bg-indigo-100 text-indigo-700 rounded">1</span>
                  Rolle des Herstellers in allen Systemen
                </h4>
                <p className="mb-2 leading-relaxed">
                  Die <strong>WPK (Werkseigene Produktionskontrolle)</strong> bildet in JEDEM System das Fundament. Der Hersteller muss ein dokumentiertes, systematisches internes Qualitätskontrollsystem betreiben. So wird sichergestellt, dass die deklarierten Eigenschaften aller nachfolgenden Fertigungschargen nicht von dem Typenprüf-Muster abweichen. Tritt ein Produktionsfehler auf (z. B. Verfall der Kornqualität bei Mauersteinen), muss die WPK diesen detektieren und der Hersteller muss das Inverkehrbringen stoppen.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/30 text-xs">
                <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-1">
                  <span className="p-1 bg-indigo-100 text-indigo-700 rounded">2</span>
                  Rolle der Notifizierten Stelle (Fremdüberwachung)
                </h4>
                <p className="mb-2 leading-relaxed">
                  Ab System 3 wird eine neutrale europäische Überwachungs- und Prüfinstitution (ein unparteiischer und qualifizierter Dritter) eingebunden. Je niedriger die Systemnummer, desto stärker ist die notifizierte Stelle beteiligt: Sie prüft nicht nur das fertige Produkt im Brandschacht oder auf der Zugprüfmaschine (Erstprüfung), sondern auditiert das Werk, öffnet Lagerhallen, prüft die Kalibrierung der Werkswaagen und zieht zufällige Kontrollproben aus Verkaufsregalen (Audit-Testing).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab 3: Begriffe der Konformitätsbewertung */}
        {activeSubTab === 'begriffe' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200 text-sm">
              <h3 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <Award size={18} className="text-amber-700" />
                Die begrifflichen Säulen der technischen Konformitätsbewertung
              </h3>
              <p className="text-text-main/80 text-xs leading-relaxed">
                Im Bauprodukten- und Vergaberecht werden Begriffe wie Akkreditierung, Notifizierung, Zertifizierung und Verifizierung oft fälschlicherweise synonym verwendet. Jedes Wort beschreibt jedoch einen rechtlich streng definierten Verfahrensschritt innerhalb des staatlichen und europäischen Aufsichtssystems.
              </p>
            </div>

            {/* Description Grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Akkreditierung */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 font-bold text-[10px] rounded uppercase">Säule 1</span>
                    <h4 className="font-bold text-text-main text-base">Akkreditierung (Accreditation)</h4>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3">
                    Die <strong>Akkreditierung</strong> ist die staatliche Anerkennung der fachlichen, personellen und organisatorischen Kompetenz einer Institution (z. B. ein Prüflabor oder eine Produktzertifizierungsstelle), um bestimmte Konformitäts-Bewertungen durchzuführen. Es ist vereinfacht ausgedrückt die <strong>"Zertifizierung der Zertifizierer"</strong>.
                  </p>
                  <p className="text-xs text-text-main/80 bg-slate-50 p-2 rounded border border-home-grau/10">
                    <strong>Rechtliche Basis:</strong> EU-Verordnung (EG) Nr. 765/2008. In Deutschland ist dafür ausschließlich die nationale Akkreditierungsstelle <strong>DAkkS (Deutsche Akkreditierungsstelle GmbH)</strong> zuständig.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/10 flex items-center justify-between text-[11px] text-indigo-700 font-medium whitespace-nowrap">
                  <span>Beispiel: DAkkS akkreditiert MPA (Materialprüfanstalt)</span>
                  <Award size={14} />
                </div>
              </div>

              {/* Notifizierung */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded uppercase">Säule 2</span>
                    <h4 className="font-bold text-text-main text-base">Notifizierung (Notification)</h4>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3">
                    Die <strong>Notifizierung</strong> ist der Akt, mit dem ein Mitgliedstaat eine Prüf-, Überwachungs- oder Zertifizierungsstelle der EU-Kommission meldet; in Deutschland prüft und benennt das DIBt diese Stellen, eine DAkkS-Akkreditierung ist ein möglicher, aber nicht zwingender Kompetenznachweis (Konformitätsvermutung). Mit der Notifizierung erhält die Stelle die Befugnis, Aufgaben Dritter bei der Bewertung und Überprüfung der Leistungsbeständigkeit wahrzunehmen. Sie erhält eine eindeutige vierstellige Kennnummer im NANDO-Register.
                  </p>
                  <p className="text-xs text-text-main/80 bg-slate-50 p-2 rounded border border-home-grau/10">
                    <strong>Behördliche Zuständigkeit:</strong> Der Mitgliedstaat meldet die Stelle über seine notifizierende Behörde an die EU-Kommission (in Deutschland für Bauprodukte das Deutsche Institut für Bautechnik, DIBt).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/10 flex items-center justify-between text-[11px] text-indigo-700 font-medium whitespace-nowrap">
                  <span>Beispiel: DIBt notifiziert Prüf- und Zertifizierungsstelle (NANDO-Kennnummer)</span>
                  <Globe className="text-emerald-700" size={14} />
                </div>
              </div>

              {/* Zertifizierung */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 font-bold text-[10px] rounded uppercase">Säule 3</span>
                    <h4 className="font-bold text-text-main text-base">Zertifizierung (Certification)</h4>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3">
                    Die <strong>Zertifizierung</strong> ist das förmliche Konformitätsbewertungs-Verfahren, bei dem eine unparteiische dritte Stelle (eben jene notifizierte, akkreditierte Stelle) schriftlich attestiert, dass ein Bauprodukt, eine werkseigene Qualitätsüberwachung (WPK) oder das Managementsystem den deklarierten technischen Vorgaben entspricht. Sie mündet im <strong>Zertifikat</strong>.
                  </p>
                  <div className="space-y-1 text-xs text-text-main/80 bg-slate-50 p-2 rounded border border-home-grau/10">
                    <p>• <strong>Produktzertifizierung:</strong> Bestätigt Eigenschaften des Baustoffs direkt.</p>
                    <p>• <strong>Systemzertifizierung:</strong> Bestätigt das Vorliegen des Überwachungssystems (z. B. WPK bei 2+).</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/10 flex items-center justify-between text-[11px] text-indigo-700 font-medium whitespace-nowrap">
                  <span>Beispiel: Ausstellung eines Zertifikats der Leistungsbeständigkeit für einen Zement CEM I (System 1+)</span>
                  <ClipboardCheck className="text-blue-700" size={14} />
                </div>
              </div>

              {/* Verifizierung */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] rounded uppercase">Säule 4</span>
                    <h4 className="font-bold text-text-main text-base">Verifizierung (Verification)</h4>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3">
                    Die <strong>Verifizierung</strong> ist der Nachweis der Richtigkeit und Plausibilität von Daten oder rechnerischen Bilanzen auf Basis unparteiischer Prüfverfahren. Im Gegensatz zur Zertifizierung, die zyklisch den Produktionsprozess bewertet, wird hierbei ein vorliegendes Berichts-Dokument (z.B. eine Klimabilanz oder ein Ökobilanzbericht) rückwirkend auf Rechenfehler und Regelkonformität geprüft.
                  </p>
                  <p className="text-xs text-text-main/80 bg-slate-50 p-2 rounded border border-home-grau/10">
                    <strong>Schnittstelle Bauwesen:</strong> Ein zentraler Anwendungsfall der Verifizierung ist die Prüfung von EPDs: Ein unabhängiger Verifizierer des Programmbetreibers prüft die Ökobilanz nach ISO 14025 und DIN EN 15804 (keine Zulassung). Davon zu unterscheiden: Nach BauPVO (EU) 2024/3110 werden die in der Leistungserklärung anzugebenden Umweltmerkmale im System 3+ durch eine notifizierte Stelle bewertet.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/10 flex items-center justify-between text-[11px] text-indigo-700 font-medium whitespace-nowrap">
                  <span>Beispiel: Ein unabhängiger Verifizierer prüft die EPD einer Mauerziegel-Serie</span>
                  <CheckCircle2 className="text-amber-700" size={14} />
                </div>
              </div>

              {/* Auditierung */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-rose-100 text-rose-700 font-bold text-[10px] rounded uppercase">Säule 5</span>
                    <h4 className="font-bold text-text-main text-base">Auditierung (Auditing)</h4>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3">
                    Die <strong>Auditierung</strong> ist das methodisch begleitete, systematische und unabhängige Untersuchungs-Verfahren vor Ort beim Hersteller. Es dient der Bewertung, ob Organisationsprozesse, Qualitätskontrollen und Dokumentationsketten der werkseigenen Produktionskontrolle (WPK) tatsächlich wie vorgeschrieben gelebt werden.
                  </p>
                  <p className="text-xs text-text-main/80 bg-slate-50 p-2 rounded border border-home-grau/10">
                    <strong>Fremdüberwachung:</strong> Ein qualifizierter Fremdüberwacher (Auditor) besucht hierzu das Werk physisch, kontrolliert Kalibrierungen der Waagen (z. B. im Fertigteilwerk) und interviewt das Personal.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/10 flex items-center justify-between text-[11px] text-rose-700 font-medium whitespace-nowrap">
                  <span>Beispiel: Ein Auditor auditiert das Transportbetonwerk vor Ort für das Ü-Zeichen</span>
                  <FileText className="text-rose-700" size={14} />
                </div>
              </div>

            </div>

            {/* Visual Flow summary */}
            <div className="border border-indigo-100 bg-indigo-50/20 rounded-xl p-5 flex flex-col justify-between">
              <h4 className="font-bold text-xs text-indigo-900 mb-2 uppercase tracking-wide">
                Der Ablauf eines Bauprodukt-Verfahrens
              </h4>
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
                <div className="flex-1 bg-white border border-home-grau/30 p-3 rounded-lg">
                  <span className="font-bold text-indigo-700 block mb-1">Schritt 1: Kompetenznachweis</span>
                  Kompetenznachweis (DIBt-Prüfung, ggf. gestützt auf DAkkS-Akkreditierung als Konformitätsvermutung).
                </div>
                <div className="hidden md:block text-home-grau font-bold text-lg">➔</div>
                <div className="flex-1 bg-white border border-home-grau/30 p-3 rounded-lg">
                  <span className="font-bold text-indigo-700 block mb-1">Schritt 2: Notifizierung</span>
                  Der Mitgliedstaat meldet die Stelle über seine notifizierende Behörde (DIBt / BMWE) nach Brüssel; sie erhält Befugnisse und NANDO-Nummer.
                </div>
                <div className="hidden md:block text-home-grau font-bold text-lg">➔</div>
                <div className="flex-1 bg-white border border-home-grau/30 p-3 rounded-lg">
                  <span className="font-bold text-indigo-700 block mb-1">Schritt 3: Auditierung</span>
                  Unabhängige Auditoren überprüfen die Produktionsprozesse, Messgeräte und WPK direkt vor Ort.
                </div>
                <div className="hidden md:block text-home-grau font-bold text-lg">➔</div>
                <div className="flex-1 bg-white border border-home-grau/30 p-3 rounded-lg">
                  <span className="font-bold text-indigo-700 block mb-1">Schritt 4: Zertifizierung / Verifizierung</span>
                  Die Zertifizierungsstelle bewertet das Audit-Ergebnis und stellt das Zertifikat aus; EPDs verifiziert ein unabhängiger Verifizierer des Programmbetreibers.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab 4: Normenarbeit (Struktur & Aufgaben) */}
        {activeSubTab === 'normenarbeit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Intro Header */}
            <div className="bg-gradient-to-r from-slate-800 to-indigo-900 text-white p-5 rounded-xl shadow-sm border border-home-grau/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-300 font-mono text-[10px] uppercase rounded border border-indigo-400/20">Anerkannte Regeln der Technik</span>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-400" />
                  Technische Normenarbeit im Bauwesen
                </h3>
                <p className="text-xs text-indigo-100/80 leading-relaxed max-w-3xl">
                  Normen sind keine Gesetze, sondern systematische, im Konsens erarbeitete Empfehlungen privatrechtlicher Institutionen. Erst durch die gesetzliche Inbezugnahme oder baurechtliche Einführung erlangen sie bindenden Charakter im Hochbau.
                </p>
              </div>
            </div>

            {/* Structure Section */}
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-home-grau/10 mb-4">
                <Layers className="w-5 h-5 text-indigo-600" /> 1. Die Struktur der Normenorganisationen (Ebenen)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* National: DIN */}
                <div className="bg-slate-50 border border-home-grau/30 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded uppercase font-mono">National</span>
                      <span className="font-bold text-xs text-indigo-600">Deutschland</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">DIN e. V.</h4>
                    <span className="text-[11px] text-slate-500 block mb-2 italic">Deutsches Institut für Normung</span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Erstellt nationale DIN-Normen (z. B. DIN 18202 für Maßtoleranzen). Organisiert in Hunderten von Arbeitsausschüssen.
                    </p>
                    <ul className="text-[11px] text-slate-600 space-y-1.5 mt-3 pl-3 list-disc">
                      <li><strong>Spiegelausschüsse:</strong> Begleiten die europäische und internationale Normungsarbeit auf nationaler Ebene.</li>
                      <li><strong>Konsensprinzip:</strong> Beteiligung aller interessierten Kreise (Anwender, Hersteller).</li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-home-grau/30 text-[10px] text-slate-500 flex items-center gap-1.5">
                    <Activity size={12} className="text-slate-400" />
                    <span>Sitz in Berlin / Gegründet 1917</span>
                  </div>
                </div>

                {/* European: CEN */}
                <div className="bg-indigo-50/20 border border-indigo-100 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100/50 px-2 py-0.5 rounded uppercase font-mono">Europäisch</span>
                      <span className="font-bold text-xs text-indigo-600">Binnenmarkt</span>
                    </div>
                    <h4 className="font-bold text-indigo-900 text-sm mb-1.5">CEN</h4>
                    <span className="text-[11px] text-indigo-700/80 block mb-2 italic">European Committee for Standardization</span>
                    <p className="text-xs text-indigo-950/80 leading-relaxed">
                      Erstellt harmonisierte europäische Normen (hEN, z. B. DIN EN 197-1 für Zement) zwecks freiem Warenverkehr.
                    </p>
                    <ul className="text-[11px] text-indigo-900/70 space-y-1.5 mt-3 pl-3 list-disc">
                      <li><strong>Übernahmepflicht:</strong> Jede EN-Norm muss unverändert als nationale Norm (z.B. DIN EN) integriert werden.</li>
                      <li><strong>Rückzugspflicht:</strong> Entgegengesetzte nationale Standards müssen zwingend entfernt werden.</li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-indigo-100/60 text-[10px] text-indigo-700/80 flex items-center gap-1.5">
                    <Globe size={12} className="text-indigo-400" />
                    <span>34 europäische Mitgliedsländer</span>
                  </div>
                </div>

                {/* International: ISO */}
                <div className="bg-slate-50 border border-home-grau/30 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded uppercase font-mono">Global</span>
                      <span className="font-bold text-xs text-indigo-600">Weltweit</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">ISO</h4>
                    <span className="text-[11px] text-slate-500 block mb-2 italic">International Organization for Standardization</span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Etabliert weltweite Standards (z. B. ISO 14040 für Ökobilanz-LCA, ISO 9001 für QM-Systeme).
                    </p>
                    <ul className="text-[11px] text-slate-600 space-y-1.5 mt-3 pl-3 list-disc">
                      <li><strong>Wiener Vereinbarung:</strong> Vertraglich geregelte Kooperation zur Vermeidung von Doppelarbeit zwischen ISO und CEN.</li>
                      <li><strong>Globale Bilanzen:</strong> Immer wichtiger für Klimaparameter und Lieferketten.</li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-home-grau/30 text-[10px] text-slate-500 flex items-center gap-1.5">
                    <Activity size={12} className="text-slate-400" />
                    <span>Hauptsitz in Genf, Schweiz</span>
                  </div>
                </div>
              </div>

              {/* Wiener Vereinbarung Detail Callout */}
              <div className="bg-slate-100 border border-home-grau/30 p-3 rounded-xl mt-3 text-xs text-slate-705 leading-relaxed">
                <span className="font-bold text-slate-900">Die Wiener Vereinbarung (Vienna Agreement):</span> Stellt sicher, dass Normen parallel als EN ISO bzw. ISO EN entwickelt werden können. Nationale Mitglieder stimmen zeitgleich ab, wodurch internationale Harmonisierung drastisch beschleunigt wird.
              </div>
            </div>

            {/* Core Tasks Section */}
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-home-grau/10 mb-4">
                <ClipboardCheck className="w-5 h-5 text-indigo-600" /> 2. Die Kernaufgaben der Normungsarbeit
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Task 1 */}
                <div className="border border-home-grau/30 p-4 rounded-xl bg-white space-y-1.5">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg w-fit">
                    <Users size={16} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Konsensbildung</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Normen entstehen nicht im Elfenbeinturm. Sie bündeln das Fachwissen aller &quot;interessierten Kreise&quot; – also Industrie, Hochschulen, Planer, Handwerk, Verbraucherschützer und Behörden.
                  </p>
                </div>

                {/* Task 2 */}
                <div className="border border-home-grau/30 p-4 rounded-xl bg-white space-y-1.5">
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg w-fit">
                    <ShieldCheck size={16} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Sicherheits- &amp; Gesundheitsschutz</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Definition von Mindestanforderungen und Prüfverfahren, um Standsicherheit zu gewährleisten, die Brandausbreitung zu begrenzen und Schadstoffemissionen in die Innenraumluft zu begrenzen (Vorsorgeprinzip).
                  </p>
                </div>

                {/* Task 3 */}
                <div className="border border-home-grau/30 p-4 rounded-xl bg-white space-y-1.5">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg w-fit">
                    <Scale size={16} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Marktharmonisierung</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Durchsetzung einer europaweit einheitlichen technischen Sprache (z.B. einheitliche Bezeichnungen für Lastannahmen, Frosttests), damit Handelsbarrieren abgelöst werden.
                  </p>
                </div>

                {/* Task 4 */}
                <div className="border border-home-grau/30 p-4 rounded-xl bg-white space-y-1.5">
                  <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg w-fit">
                    <Leaf size={16} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Förderung der Kreislaufwirtschaft</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Integration neuartiger Recycling-Materialien (R-Beton), CO₂-armer Bindemittel und standardisierter Lebenszyklen (DIN EN 15804) zur Förderung nachhaltigen Bauens.
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Process "Der Weg zur Norm" */}
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-home-grau/10 mb-4">
                <FileText className="w-5 h-5 text-indigo-600" /> 3. Der strukturierte Ablauf der Normerstellung (&quot;Der Weg zur Norm&quot;)
              </h3>

              <div className="relative border-l border-indigo-100 pl-4 ml-3 space-y-6 text-xs">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-[13px] h-[13px] rounded-full bg-indigo-600 border-2 border-white"></div>
                  <div className="font-bold text-indigo-900 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700">Phase 1</span>
                    Initiativphase &amp; Projektvorschlag (Standardization Request)
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                    Ein Normungsantrag kann von jedem (z. B. einem Industrieverband, Forschungsinstitut oder der EU-Kommission) eingereicht werden. Voraussetzung ist ein begründeter Bedarf und gesicherte Finanzierung für das Projekt.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-[13px] h-[13px] rounded-full bg-indigo-600 border-2 border-white"></div>
                  <div className="font-bold text-indigo-900 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700">Phase 2</span>
                    Ausarbeitungsphase (Arbeitsentwurf)
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                    Ein Expertengremium im zuständigen Ausschuss erstellt den ersten technischen Arbeitsentwurf (Working Draft). Hierbei werden physikalische Parameter abgestimmt.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-[13px] h-[13px] rounded-full bg-indigo-600 border-2 border-white"></div>
                  <div className="font-bold text-indigo-900 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700">Phase 3</span>
                    Entwurfsphase &amp; Stellungnahmeverfahren (Öffentliche Umfrage)
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                    Der Norm-Entwurf (z. B. prEN oder DIN-Entwurf) wird veröffentlicht (sog. <em>Gelbdruck</em>). Jede Person darf innerhalb von 2 bis 3 Monaten über das Norm-Entwurfs-Portal online Einsprüche formulieren und Kommentare einreichen.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-[13px] h-[13px] rounded-full bg-indigo-600 border-2 border-white"></div>
                  <div className="font-bold text-indigo-900 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700">Phase 4</span>
                    Schlichtungsphase (Konsensprüfung)
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                    Der zuständige Arbeitsausschuss beurteilt alle eingegangenen Einsprüche. Sind diese begründet, wird der Entwurf überarbeitet. Falls nötig, wird das Stellungnahmeverfahren ein zweites Mal durchlaufen, bis voller technischer Konsens hergestellt ist.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-[13px] h-[13px] rounded-full bg-indigo-600 border-2 border-white"></div>
                  <div className="font-bold text-indigo-900 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700">Phase 5</span>
                    Publikation (Weißdruck)
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                    Nach Genehmigung (national) bzw. positiver Schlussabstimmung (Formal Vote) wird die Norm als Weißdruck veröffentlicht und über DIN Media vertrieben; sie bleibt ein privates Regelwerk ohne amtliche Veröffentlichung.
                  </p>
                </div>

                {/* Step 6 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-[13px] h-[13px] rounded-full bg-emerald-600 border-2 border-white"></div>
                  <div className="font-bold text-emerald-800 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-700">Phase 6</span>
                    Baurechtliche Einführung &amp; Status
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                    Eine veröffentlichte DIN-Norm begründet die widerlegbare Vermutung, die allgemein anerkannten Regeln der Technik (a.a.R.d.T.) wiederzugeben – ob sie das tatsächlich tut (theoretisch richtig und in der Praxis bewährt), ist eine Tatsachenfrage. Wird die Norm über die Verwaltungsvorschrift Technische Baubestimmungen eines Landes (Muster: MVV TB, § 85a MBO) eingeführt, ist ihre Einhaltung öffentlich-rechtlich verbindlich; den Status a.a.R.d.T. verleiht die Einführung nicht.
                  </p>
                </div>
              </div>
            </div>

            {/* Informative Grid Callout about legal binding of standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-1">
                <h5 className="font-bold text-amber-900 flex items-center gap-1">
                  <Scale size={14} className="text-amber-700" />
                  Müssen Normen immer eingehalten werden?
                </h5>
                <p className="text-amber-950/80 leading-relaxed text-[11px]">
                  Rechtlich gesehen handelt es sich bei DIN-Normen um Empfehlungen mit &quot;Angebotscharakter&quot;. Sie sind keine Gesetze. Sie werden jedoch bindend, wenn sie in Verträgen vereinbart werden (z. B. nach VOB/C), oder wenn Baurechtsbehörden sie in den Technischen Baubestimmungen anordnen. Verletzt ein Planer eine solche Norm, haftet er laut BGB im Schadensfall fast immer für mangelhafte Planung (da Abweichen von den allgemein anerkannten Regeln der Technik vermutet wird).
                </p>
              </div>

              <div className="bg-indigo-50/40 border border-indigo-100 p-4 rounded-xl text-xs space-y-1">
                <h5 className="font-bold text-indigo-900 flex items-center gap-1">
                  <HelpCircle size={14} className="text-indigo-700" />
                  Wie oft werden Normen überarbeitet?
                </h5>
                <p className="text-indigo-950/80 leading-relaxed text-[11px]">
                  Normen unterliegen der regelmäßigen Überprüfung. Spätestens <strong>alle fünf Jahre</strong> (auf DIN-Ebene) bzw. zyklisch auf europäischer Ebene wird geprüft, ob eine Norm noch den Stand der Technik abbildet oder veraltet ist. Wird Änderungsbedarf festgestellt, wird die Norm aktualisiert, neu entworfen oder durch modernere europäische hEN abgelöst.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
      
      {!isEmbedded && <ModulTest moduleId="bp_recht" />}

      {!isEmbedded && activeSubTab === 'normenarbeit' && (
        <ModuleFooter 
          wikipedia={[
            { title: "Deutsches Institut für Normung", url: "https://de.wikipedia.org/wiki/Deutsches_Institut_f%C3%BCr_Normung" },
            { title: "Europäisches Komitee für Normung", url: "https://de.wikipedia.org/wiki/Europ%C3%A4isches_Komitee_f%C3%BCr_Normung" },
            { title: "Internationale Organisation für Normung", url: "https://de.wikipedia.org/wiki/Internationale_Organisation_f%C3%BCr_Normung" },
            { title: "Stand der Technik", url: "https://de.wikipedia.org/wiki/Stand_der_Technik" }
          ]} 
          literatur={[
            "Gerhold, P.: Bauproduktenrecht in der Praxis – Von der Bauproduktleistung bis zur Baudokumentation. 2. Aufl., Köln: Rudolf Müller 2021"
          ]} 
          regelwerke={[
            { title: "DIN 820-1 (Normungsarbeit - Grundsätze)" },
            { title: "DIN EN 45020 (Normung und damit zusammenhängende Tätigkeiten - Allgemeine Begriffe)" },
            { title: "Wiener Vereinbarung ISO/CEN", url: "https://www.iso.org/vienna-agreement.html" },
            { title: "Verordnung (EU) 2024/3110 (neue BauPVO; löst VO (EU) Nr. 305/2011 schrittweise ab)", url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32024R3110" }
          ]} 
          formeln={[]} 
        />
      )}

      {!isEmbedded && activeSubTab !== 'normenarbeit' && (
        <ModuleFooter 
          wikipedia={[
            { title: "Bauproduktenverordnung", url: "https://de.wikipedia.org/wiki/Bauproduktenverordnung" },
            { title: "CE-Kennzeichnung", url: "https://de.wikipedia.org/wiki/CE-Kennzeichnung" },
            { title: "Akkreditierung (Recht)" },
            { title: "Europäische Technische Bewertung (ETA)", url: "https://de.wikipedia.org/wiki/Europ%C3%A4ische_Technische_Bewertung" }
          ]} 
          literatur={[
            "Gerhold, P.: Bauproduktenrecht in der Praxis – Von der Bauproduktleistung bis zur Baudokumentation. 2. Aufl., Köln: Rudolf Müller 2021",
            "Gerhold, P.: Neues Bauproduktenrecht in der Praxis – Bauordnung und MVV TB verstehen und anwenden. Köln: Rudolf Müller 2019"
          ]} 
          regelwerke={[
            { title: "Verordnung (EU) 2024/3110 (Bauprodukteverordnung, anwendbar seit 08.01.2026); übergangsweise Verordnung (EU) Nr. 305/2011 für Produkte unter alten harmonisierten Normen/EAD", url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32024R3110" },
            { title: "Verordnung (EG) Nr. 765/2008 (Akkreditierung und Marktüberwachung)", url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32008R0765" },
            { title: "Muster-Verwaltungsvorschrift Technische Baubestimmungen (MVV TB), aktuelle Ausgabe", url: "https://www.dibt.de/" },
            { title: "Musterbauordnung (MBO) §§ 16a–25", url: "https://www.bauministerkonferenz.de/" }
          ]} 
          formeln={[
            {
              formel: '\\text{AVCP-System} \\in \\{1+, 1, 2+, 3+, 3, 4\\} \\implies \\text{Grad der Beteiligung einer notifizierten Stelle}',
              erklaerung: 'Systeme zur Bewertung und Überprüfung der Leistungsbeständigkeit: nach VO (EU) 305/2011 Anhang V die Systeme 1+, 1, 2+, 3 und 4; nach der neuen BauPVO (EU) 2024/3110 Anhang IX zusätzlich System 3+ für die Überprüfung von Umwelt-/Nachhaltigkeitsangaben. Welches Regime gilt, hängt davon ab, unter welcher Verordnung die technische Spezifikation (hEN/EAD) erstellt wurde.',
              quelle: 'BauPVO (EU) 2024/3110 Anhang IX bzw. VO (EU) 305/2011 Anhang V'
            },
            {
              formel: '\\text{ETA} = \\text{EAD} + \\text{Leistungsbewertung} \\implies \\text{CE-Kennzeichnung für nicht harmonisierte Produkte}',
              erklaerung: 'Europäische Technische Bewertung (European Technical Assessment) auf Grundlage eines Europäischen Bewertungsdokuments (EAD) über EOTA für innovative Bauprodukte.',
              quelle: 'BauPVO (EU) 2024/3110 bzw. VO (EU) 305/2011 Art. 19 & 26'
            }
          ]} 
        />
      )}
    </div>
  );
}
