import { ArrowRight, ExternalLink, Compass } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface AnhangDatenbankenProps {
  activeEcoDb: "oekobaudat" | "dgnb" | "ibu" | "wecobis";
  setActiveEcoDb: Dispatch<SetStateAction<"oekobaudat" | "dgnb" | "ibu" | "wecobis">>;
}

export default function AnhangDatenbanken({ activeEcoDb, setActiveEcoDb }: AnhangDatenbankenProps) {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 4</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">
            Öko-Datenbanken &amp; Nachweisportale (QNG, DGNB, IBU &amp; ÖKOBAUDAT)
          </h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Die Durchführung präziser Produkt- und Gebäudeökobilanzen setzt den verlässlichen Zugriff auf validierte Stammdaten voraus. In Deutschland stützt sich die Nachweisführung für das staatliche <strong>QNG (Qualitätssiegel Nachhaltiges Gebäude)</strong> sowie für private Zertifizierungssysteme (wie <strong>DGNB</strong>) auf ein aufeinander abgestimmtes Geflecht aus herstellerunabhängigen Datenbanken und herstellerspezifischen EPD-Schnittstellen.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Database 1: ÖKOBAUDAT */}
          <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${activeEcoDb === 'oekobaudat' ? 'bg-emerald-50/30 border-emerald-400' : 'bg-white border-stone-200 hover:bg-slate-50'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase rounded">ÖKOBAUDAT (BBSR)</span>
              <button onClick={() => setActiveEcoDb('oekobaudat')} className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                Details ansehen <ArrowRight size={10} />
              </button>
            </div>
            <strong className="text-xs font-bold text-slate-900">Bundesreferenzdatenbank für Ökobilanzierung</strong>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              Die vom BBSR bereitgestellte Datenbank ist die gesetzlich vorgeschriebene Rechenwertbasis für alle BNB- und QNG-Gebäudebilanzierungen in Deutschland. Sie enthält verifizierte generische und produktspezifische Stoffdatensätze.
            </p>
            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-sans leading-normal">
              <li><strong>Identifikation:</strong> Jeder Baustoff besitzt eine eindeutige 32-gestellige <strong>UUID</strong>.</li>
              <li><strong>Datenstruktur:</strong> XML-Formatierung nach dem internationalen <strong>ILCD+EPD-Standard</strong>.</li>
              <li><strong>Normative Basis:</strong> Enthält LCA-Wirkungsindikatoren nach <strong>DIN EN 15804+A1 u. +A2</strong>.</li>
            </ul>
            <a href="https://www.oekobaudat.de" target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1 self-start mt-1">
              oekobaudat.de <ExternalLink size={11} />
            </a>
          </div>

          {/* Database 2: DGNB Navigator */}
          <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${activeEcoDb === 'dgnb' ? 'bg-emerald-50/30 border-emerald-400' : 'bg-white border-stone-200 hover:bg-slate-50'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold text-[9px] uppercase rounded">DGNB Navigator e.V.</span>
              <button onClick={() => setActiveEcoDb('dgnb')} className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                Details ansehen <ArrowRight size={10} />
              </button>
            </div>
            <strong className="text-xs font-bold text-slate-900">Brücke zwischen EPDs &amp; Bewertungssystemen</strong>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              Die Online-Plattform der Deutschen Gesellschaft für Nachhaltiges Bauen (DGNB) verbindet herstellerspezifische Kennwerte direkt mit den ökologischen, ökonomischen und gesundheitlichen Kriterien der DGNB-Zertifizierung.
            </p>
            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-sans leading-normal">
              <li><strong>DGNB Navigator Code:</strong> Einheitlicher Bezeichner zur automatisierten Eingabe in Auditierungs-Tools.</li>
              <li><strong>Fokus Schadstofffreiheit:</strong> Deklariert direkt die Erfüllung der lokalen Umwelt-Risiken (QS4-Zulassung).</li>
              <li><strong>Kreislauffähigkeit:</strong> Listet konkrete Rückbaufähigkeits- und Materialpässe (Circular Economy).</li>
            </ul>
            <a href="https://www.dgnb-navigator.de" target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1 self-start mt-1">
              dgnb-navigator.de <ExternalLink size={11} />
            </a>
          </div>

          {/* Database 3: IBU.data / IBU e.V. */}
          <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${activeEcoDb === 'ibu' ? 'bg-emerald-50/30 border-emerald-400' : 'bg-white border-stone-200 hover:bg-slate-50'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[9px] uppercase rounded">IBU.data (IBU e.V.)</span>
              <button onClick={() => setActiveEcoDb('ibu')} className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                Details ansehen <ArrowRight size={10} />
              </button>
            </div>
            <strong className="text-xs font-bold text-slate-900">Das offizielle EPD-Herstellerportal</strong>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              Das Institut Bauen und Umwelt e.V. (IBU) ist der führende EPD-Programmhalter in Deutschland. IBU.data ist das digitale Portal, das diese verifizierten Typ-III-Umweltdeklarationen maschinenlesbar im XML-Format bereitstellt.
            </p>
            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-sans leading-normal">
              <li><strong>PCR-Kontrolle:</strong> Gewährleistet einheitliche Produktbewertungsregeln (Part A und B).</li>
              <li><strong>Datenfilter:</strong> Filterung nach spezifischen Baustoffen, Rohdichten und GWP-Faktoren.</li>
              <li><strong>Vollständigkeit:</strong> Primäre EPDs enthalten Modul A1-A3, B1-B7, C1-C4 und D (Kreislaufpotenzial).</li>
            </ul>
            <a href="https://ibu-epd.com" target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1 self-start mt-1">
              ibu-epd.com <ExternalLink size={11} />
            </a>
          </div>

          {/* Database 4: WECOBIS / LNID */}
          <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${activeEcoDb === 'wecobis' ? 'bg-emerald-50/30 border-emerald-400' : 'bg-white border-stone-200 hover:bg-slate-50'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold text-[9px] uppercase rounded">WECOBIS (BBSR)</span>
              <button onClick={() => setActiveEcoDb('wecobis')} className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                Details ansehen <ArrowRight size={10} />
              </button>
            </div>
            <strong className="text-xs font-bold text-slate-900">Ökologisches Produktinformationssystem</strong>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              Gemeinsames Informationsportal des Bundes und der Bayerischen Architektenkammer zu bauökologischen Aspekten, Schadstoffemissionen (VOC) und Nachbehandlungen.
            </p>
            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-sans leading-normal">
              <li><strong>Interaktive Planungshilfen:</strong> Listet Vor- und Nachteile sowie VOC-Prüfkriterien strukturierter Stoffgruppen.</li>
              <li><strong>QNG-Schnittstelle:</strong> Leitfaden zur Erlangung der Schadstoff-Qualitätsstufen QS3 und QS4.</li>
              <li><strong>Lebenszyklus-Betrachtung:</strong> Beschreibt ökologische Relevanz von der Rohstoffgewinnung bis zur Deponie.</li>
            </ul>
            <a href="https://www.wecobis.de" target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1 self-start mt-1">
              wecobis.de <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Dynamic scenario display based on active database click */}
        <div className="bg-slate-50/60 p-5 rounded-2xl border border-home-grau/30 shadow-2xs space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2 border-b border-stone-200 pb-2 animate-in fade-in">
            <Compass size={14} className="text-shiraz" /> Interaktiver Praxis-Fahrplan zur gewählten Datenbank:
          </h4>

          {activeEcoDb === 'oekobaudat' && (
            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
              <p>
                <strong>Anwendungsfall in Arbeitsentwürfen (eLCA / BNB-Konformität):</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-emerald-900 block font-mono">1. UUID-Mapping in BIM</span>
                  <p className="text-slate-500 leading-relaxed">
                    Um die Bauteilflächen einer Wand im 3D-BIM-Modell automatisch mit der ÖKOBAUDAT zu verknüpfen, liest eLCA die spezifische <strong>UUID</strong> aus. Beispiel-UUID für Kalksandstein: <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono text-purple-700">8d94e77d-7c25-4fc1-aee4-20b6697b0a8f</code>.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-emerald-900 block font-mono">2. Anrechnung QNG-Sicherheitszuschlag</span>
                  <p className="text-slate-500 leading-relaxed">
                    In der ÖKOBAUDAT können Sie nach <strong>generischen</strong> Datensätzen filtern. Achtung: Das QNG verlangt bei generischen Daten einen pauschalen **Sicherheitsaufschlag von +10 %** auf alle Wirkungskategorien, um Datenunsicherheiten abzufedern.
                  </p>
                </div>
              </div>
              <div className="bg-emerald-50/20 border-l-4 border-emerald-500 p-3 rounded-r-lg text-[10.5px] text-emerald-950">
                <span className="font-bold">Akademischer Nachweistipp:</span> Versuchen Sie stets, durch den Nachweis spezifischer Hersteller-EPDs (wie sie in IBU.data gelistet sind) die generischen Datensätze zu ersetzen. Dies mindert den rechnerischen GWP-Wert Ihres Gebäudes um signifikante Prozentpunkte und sichert somit leichter die KfW-KFN-Förderkredite!
              </div>
            </div>
          )}

          {activeEcoDb === 'dgnb' && (
            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
              <p>
                <strong>Anwendungsfall in Projekten (Zertifikatsbewertung nach System DGNB):</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-emerald-950 block font-mono">1. Produktdeklarationen im Navigator</span>
                  <p className="text-slate-500 leading-relaxed font-sans">
                    Hersteller registrieren ihre Produkte im DGNB Navigator und erhalten eine spezifische Registrierungsnummer (z. B. <strong>DGNB-Code: AX85G2</strong>). Damit werden alle Nachhaltigkeitsdatenblätter für Auditoren direkt importierbar gemacht.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-emerald-950 block font-mono">2. Kriterium ENV 1.2 (Risiken lokale Umwelt)</span>
                  <p className="text-slate-500 leading-relaxed font-sans">
                    Der Navigator deklariert, in welche <strong>Qualitätsstufe</strong> (QS1 bis QS4) ein Bauteil im Bereich VOC, Halogene oder Schwermetalle einzuordnen ist. Dies ist unabdingbar für die soziokulturelle Punktebewertung.
                  </p>
                </div>
              </div>
              <div className="bg-sky-50/20 border-l-4 border-sky-500 p-3 rounded-r-lg text-[10.5px] text-sky-950">
                <span className="font-bold">Regelung für die Praxis:</span> Der DGNB Navigator verknüpft Ökobilanzierung und Bauchemie. Er stellt sicher, dass ein Baustoff im Betrieb frei von umweltgefährdenden Inhaltsstoffen bleibt und fordert im Rahmen der Kreislaufwirtschaft klare Rückbauprofile der Lieferanten ein.
              </div>
            </div>
          )}

          {activeEcoDb === 'ibu' && (
            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
              <p>
                <strong>Anwendungsfall (Ausstellung und Überprüfung von EPDs dritter Hersteller):</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-amber-950 block font-mono">1. Aufbau von herstellereigenen EPDs</span>
                  <p className="text-slate-500 leading-relaxed font-sans">
                    Die Hersteller ermitteln die Lebenszyklusdaten im eigenen Werk nach den standardisierten <strong>IBU-Produktkategorieregeln (PCR)</strong>. Ein unabhängiger dritter Prüfer verifiziert diese Zahlen, bevor die EPD veröffentlicht wird.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-amber-950 block font-mono">2. Auslesen von Lebenszyklusmodulen</span>
                  <p className="text-slate-500 leading-relaxed font-sans">
                    In der herstellereigenen IBU-EPD (als PDF) befinden sich strukturierte Tabellen. Der Planer liest dort herstellerspezifische Kennwerte wie GWP-fossil in Modul A1–A3 ab und vergleicht diese direkt mit den Bundes-Durchschnittswerten.
                  </p>
                </div>
              </div>
              <div className="bg-amber-50/20 border-l-4 border-amber-500 p-3 rounded-r-lg text-[10.5px] text-amber-950">
                <span className="font-bold">Bedeutung im Lebensende:</span> EPDs enthalten in Modul C3/C4 ökologische Daten zur thermischen Entsorgung (wichtig bei Biomasse) und in Modul D konkrete Gutschriften über das Kreislaufpotenzial durch thermische oder materielle Substitutionen.
              </div>
            </div>
          )}

          {activeEcoDb === 'wecobis' && (
            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
              <p>
                <strong>Anwendungsfall (Schadstoffvermeidung und VOC-Grenzwerte nach QNG):</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-rose-950 block font-mono">1. Bauökologisches Materialscreening</span>
                  <p className="text-slate-500 leading-relaxed font-sans">
                    Architekten suchen vor Ausschreibungen in WECOBIS gezielt nach Stoffgruppen (z.B. Abdichtungen auf Bitumen- oder Polymerbasis). WECOBIS listet die gesundheitlichen Einflüsse im gesamten Einbau- und Verarbeitungsfenster auf.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-1.5">
                  <span className="font-bold text-rose-950 block font-mono">2. Einhaltung des QNG-Steckbriefs 313</span>
                  <p className="text-slate-500 leading-relaxed font-sans">
                    Um für Kredite die höchste Qualitätsstufe QS4 nachzuweisen, liefert WECOBIS konkrete Leitfäden und Klauseln für Textausschreibungen im Leistungsverzeichnis (LV), wie z.B. geforderte Emissionszertifikate (EMICODE EC1).
                  </p>
                </div>
              </div>
              <div className="bg-rose-50/20 border-l-4 border-rose-500 p-3 rounded-r-lg text-[10.5px] text-rose-950">
                <span className="font-bold">Verbindung der Module:</span> Nutzen Sie WECOBIS parallel zu den Modul-Steckbriefen für das handwerkliche Verständnis auf Baustellen, um unerwünschte Bauschäden und gesundheitsschädliche Belastungen von Planungsbeginn an auszuschließen.
              </div>
            </div>
          )}
        </div>
      </div>
    );
}
