import type { LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  History,
  Compass,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/bestandchecklisten/BestandChecklisten.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

interface ChecklistItem {
  id: string;
  task: string;
  description: string;
  ref: string;
  status: 'critical' | 'mandatory' | 'recommended';
}

interface ChecklistSection {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: ChecklistItem[];
}

const INITIAL_CHECKLISTS: Record<string, ChecklistSection> = {
  recherche: {
    id: 'recherche',
    title: inhalt.werte.t1ArchivrechercheVoruntersuchung,
    description: inhalt.werte.systematischeErhebungHistorischerPlan,
    icon: History,
    items: [
      {
        id: 'rec-1',
        task: inhalt.werte.bauakteneinsichtAltstatikSicherung,
        description: inhalt.werte.vollständigeSichtungDerBestandsakten,
        ref: inhalt.werte.lboVdi6200,
        status: 'critical'
      },
      {
        id: 'rec-2',
        task: inhalt.werte.klärungDesDenkmalschutzstatusUdb,
        description: inhalt.werte.anfrageBeiDerUnteren,
        ref: inhalt.werte.denkmalschutzgesetzDschg,
        status: 'critical'
      },
      {
        id: 'rec-3',
        task: inhalt.werte.historischeErkundungDesStandorts,
        description: inhalt.werte.rechercheBezüglichFrühererIndustrieller,
        ref: inhalt.werte.landesrechtAhKmr,
        status: 'mandatory'
      },
      {
        id: 'rec-4',
        task: inhalt.werte.nutzungsgeschichteUndSchadstoffverdachtE,
        description: inhalt.werte.erfassungFrühererVerwendungenZ,
        ref: inhalt.werte.vdi6202Blatt1,
        status: 'mandatory'
      },
      {
        id: 'rec-5',
        task: inhalt.werte.schadstofferkundungVorEingriffen,
        description: inhalt.werte.beiGebäudenMitBaubeginn,
        ref: inhalt.werte.gefstoffv5aTrgs519,
        status: 'mandatory'
      }
    ]
  },
  erfassung: {
    id: 'erfassung',
    title: inhalt.werte.t2BauwerkserfassungBauaufnahme,
    description: inhalt.werte.zustandserfassungUndAufmaßZur,
    icon: Compass,
    items: [
      {
        id: 'erf-1',
        task: inhalt.werte.bauaufnahmeGenauigkeitsstufeFestlegen,
        description: inhalt.werte.festlegungDerGenauigkeitsstufeDer,
        ref: inhalt.werte.vdiVde2634Verband,
        status: 'mandatory'
      },
      {
        id: 'erf-2',
        task: inhalt.werte.t3dLaserscanningVerformungsgetreuesAufmaß,
        description: inhalt.werte.durchführungEinerDigitalenBestandserfass,
        ref: inhalt.werte.din187101Verformungsgetreues,
        status: 'recommended'
      },
      {
        id: 'erf-3',
        task: inhalt.werte.bauteilschichtenKonstruktionsprinzipienK,
        description: inhalt.werte.lokalisierungUndZuordnungVon,
        ref: inhalt.werte.iso13822En1990,
        status: 'critical'
      },
      {
        id: 'erf-4',
        task: inhalt.werte.baugrundUndGründungsuntersuchungAnstoßen,
        description: inhalt.werte.prüfungDerFundamenteDurch,
        ref: inhalt.werte.din4020Eurocode7,
        status: 'critical'
      }
    ]
  },
  diagnostik: {
    id: 'diagnostik',
    title: inhalt.werte.t3BauwerksdiagnostikZfp,
    description: inhalt.werte.zerstörungsfreieUndZerstörungsarmePrüfun,
    icon: Search,
    items: [
      {
        id: 'dia-1',
        task: inhalt.werte.bewehrungsortungBetondeckungsmessung,
        description: inhalt.werte.zerstörungsfreieBestimmungDerLage,
        ref: inhalt.werte.dbvMerkblattBetondeckungUnd,
        status: 'mandatory'
      },
      {
        id: 'dia-2',
        task: inhalt.werte.carbonatisierungstiefeChloridprofilErmit,
        description: inhalt.werte.indikatorprüfungMitPhenolphthaleinAn,
        ref: inhalt.werte.dinEn14630Din,
        status: 'critical'
      },
      {
        id: 'dia-3',
        task: inhalt.werte.zerstörungsfreiePrüfungDerMauerwerks,
        description: inhalt.werte.zerstörungsfreieBzwZerstörungsarmeFestig,
        ref: inhalt.werte.dinEn125042,
        status: 'recommended'
      },
      {
        id: 'dia-4',
        task: inhalt.werte.feuchtemessungenAnKritischenBauteilen,
        description: inhalt.werte.bestimmungDerMaterialfeuchteZ,
        ref: inhalt.werte.wtaMerkblatt45,
        status: 'mandatory'
      }
    ]
  },
  standsicherheit: {
    id: 'standsicherheit',
    title: inhalt.werte.t4NachrechnungTragfähigkeitsnachweis,
    description: inhalt.werte.bewertungDerRechnerischenStandsicherheit,
    icon: Building2,
    items: [
      {
        id: 'st-1',
        task: inhalt.werte.nachrechnungNachDerNachrechnungsrichtlin,
        description: inhalt.werte.rechnerischeÜberprüfungBestehenderBrücke,
        ref: inhalt.werte.nachrechnungsrichtlinieDinEn1990,
        status: 'critical'
      },
      {
        id: 'st-2',
        task: inhalt.werte.sicherheitskonzeptImBestandAnwenden,
        description: inhalt.werte.nutzungVonModifiziertenTeilsicherheitsbe,
        ref: inhalt.werte.iso13822EurocodeBestandskonzept,
        status: 'critical'
      },
      {
        id: 'st-3',
        task: inhalt.werte.bestimmungVonIstFestigkeitsklassen,
        description: inhalt.werte.rückrechnungDerCharakteristischenBeton,
        ref: inhalt.werte.dinEn13791Din,
        status: 'mandatory'
      },
      {
        id: 'st-4',
        task: inhalt.werte.abstimmungErgänzenderInstandsetzungsmaßn,
        description: inhalt.werte.konzipierungVonVerstärkungsmaßnahmenZ,
        ref: inhalt.werte.trInstandhaltungAbz,
        status: 'recommended'
      },
      {
        id: 'st-5',
        task: inhalt.werte.ankündigungsverhaltenBeiSprkGefährdetem,
        description: inhalt.werte.beiSpannbetonMitSpannungsrisskorrosionsg,
        ref: inhalt.werte.handlungsanweisungSprk2011,
        status: 'critical'
      }
    ]
  }
};

export default function BestandChecklisten() {
  const [activeSubTab, setActiveSubTab] = useState<string>('recherche');
  const currentSection = INITIAL_CHECKLISTS[activeSubTab];

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-300">
      
      {/* Header Info-Bereich */}
      <div className="bg-white text-text-main rounded-2xl p-6 border border-home-grau/30 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <Building2 className="text-shiraz" /><MdText text={inhalt.texte.checklistenBauenImBestand} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.stufenweiseQualitätssicherungUndDiagnost} /></p>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <ReiterLeiste label="Checkliste" className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {Object.values(INITIAL_CHECKLISTS).map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSubTab === sec.id;

          return (
            <button {...alsReiter(isActive, 'bestand-checkliste', sec.id)}
              key={sec.id}
              onClick={() => setActiveSubTab(sec.id)}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-shiraz/5 border-shiraz ring-1 ring-shiraz/25'
                  : 'bg-white border-home-grau/20 hover:border-home-grau/40 hover:bg-off-white'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1 rounded ${isActive ? 'bg-shiraz/10 text-shiraz' : 'bg-off-white text-home-grau'}`}>
                    <Icon size={12} />
                  </div>
                  <span className={`text-xs font-mono leading-none tracking-wider font-bold ${isActive ? 'text-shiraz' : 'text-home-grau/60'}`}>
                    KATEGORIE
                  </span>
                </div>
                <h3 className={`font-bold text-sm tracking-tight ${isActive ? 'text-text-main' : 'text-home-grau'}`}>
                  {sec.title.split('. ')[1]}
                </h3>
              </div>
            </button>
          );
        })}
      </ReiterLeiste>

      {/* Main Checklist Card & Controls */}
      <div {...reiterPanel('bestand-checkliste', activeSubTab)} className="bg-white rounded-xl border border-home-grau/20 shadow-xs overflow-hidden min-h-[350px] flex flex-col justify-between">
        
        {/* Section Title */}
        <div className="p-4 border-b border-home-grau/10 bg-off-white/50">
          <h2 className="text-sm font-bold text-text-main">
            {currentSection.title}
          </h2>
          <p className="text-sm text-home-grau leading-normal max-w-xl font-normal mt-0.5">
            {currentSection.description}
          </p>
        </div>

        {/* Checklist List View */}
        <div className="p-4 space-y-2.5 flex-grow">
          <div className="grid grid-cols-1 gap-2.5">
            {currentSection.items.map((item, index) => {
              let borderStyle = 'border-home-grau/20';
              let badgeStyle = '';
              let badgeLabel = '';
              
              if (item.status === 'critical') {
                borderStyle = 'border-home-grau/20 border-l-2 border-l-rose-500/80';
                badgeStyle = 'bg-rose-50/50 text-rose-700 border-rose-100/40';
                badgeLabel = inhalt.werte.kritischHaftungsrelevant;
              } else if (item.status === 'mandatory') {
                borderStyle = 'border-home-grau/20 border-l-2 border-l-amber-500/80';
                badgeStyle = 'bg-amber-50/50 text-amber-700 border-amber-100/40';
                badgeLabel = 'Pflichtpunkt';
              } else {
                borderStyle = 'border-home-grau/20 border-l-2 border-l-emerald-500/80';
                badgeStyle = 'bg-emerald-50/50 text-emerald-700 border-emerald-100/40';
                badgeLabel = inhalt.werte.standDerTechnik;
              }

              return (
                <div 
                  key={item.id}
                  className={`p-3 rounded-lg border bg-white flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 hover:shadow-xs transition-shadow duration-100 ${borderStyle}`}
                >
                  <div className="space-y-1.5 flex-1 pr-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-home-grau/50">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <h3 className="text-sm font-bold text-text-main leading-tight wie-h4">
                        {item.task}
                      </h3>
                      <span className={`px-1 py-0.5 rounded text-xs font-bold border ${badgeStyle} font-mono tracking-wide shrink-0`}>
                        {badgeLabel}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed font-normal text-home-grau/80">
                      {item.description}
                    </p>
                  </div>

                  {/* Rechtsgrundlage */}
                  <div className="flex sm:flex-col justify-between items-end gap-1 text-xs font-mono tracking-tight sm:border-l sm:border-home-grau/10 sm:pl-3 shrink-0 pt-1.5 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-home-grau/60 font-bold block text-xs uppercase tracking-wider">Rechtsgrundlage</span>
                      <span className="text-text-main font-bold bg-off-white px-1.5 py-0.5 rounded border border-home-grau/10 block max-w-max sm:ml-auto text-xs mt-0.5">
                        {item.ref}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Small Context Assistance Block */}
        <div className="p-3 border-t border-home-grau/10 bg-off-white/40 rounded-b-xl">
          <div className="flex flex-col md:flex-row gap-2.5 justify-between items-center text-xs text-home-grau">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-home-grau/60 shrink-0" />
              <p className="font-normal text-home-grau/80"><MdText text={inhalt.texte.fehlendeStatikUnterlagenNehmen} /></p>
            </div>
            <div className="flex gap-1">
              <a 
                href="https://www.gesetze-im-internet.de/geg/index.html" 
                target="_blank" 
                rel="no-referrer"
                className="px-1.5 py-0.5 bg-white hover:bg-off-white border border-home-grau/20 text-text-main rounded font-bold flex items-center gap-0.5 transition-all cursor-pointer text-xs"
              > GModG <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Module Footer Links */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1ChloridgehaltAus}
        zielGleichung="Cl_{Z} = Cl_{B} \cdot \frac{\rho_B}{z}"
        schritte={inhalt.daten["BestandChecklisten.schritte"]}
        ergebnisHinweis={inhalt.werte.istDerZementgehaltUnbekannt}
        normQuelle={inhalt.werte.dinEn14629Tr}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2MaterialfeuchteNach}
        zielGleichung="u = \frac{m_f - m_{tr}}{m_{tr}} \cdot 100\,\%"
        schritte={inhalt.daten["BestandChecklisten.schritte_2"]}
        ergebnisHinweis={inhalt.werte.fürDieBewertungIst}
        normQuelle={inhalt.werte.wtaMerkblatt452}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="bestand_checklisten" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap8} 
        wikipedia={[
          { title: inhalt.werte.bauenImBestand, url: 'https://de.wikipedia.org/wiki/Bauen_im_Bestand' },
          { title: 'Bauaufnahme', url: 'https://de.wikipedia.org/wiki/Bauaufnahme' },
          { title: inhalt.werte.zerstörungsfreiePrüfungImBauwesen, url: 'https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Pr%C3%BCfung_im_Bauwesen' }
        ]}
        regelwerke={inhalt.daten["BestandChecklisten.regelwerke"]}
        literatur={inhalt.daten["BestandChecklisten.literatur"]} 
        formeln={inhalt.daten["BestandChecklisten.formeln"]}
      />

    </div>
  );
}
