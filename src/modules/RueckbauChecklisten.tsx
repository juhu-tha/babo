import type { LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Recycle, 
  Database,
  Building, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/rueckbauchecklisten/RueckbauChecklisten.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

// Define structures for checklists
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
  rueckbau: {
    id: 'rueckbau',
    title: inhalt.werte.t1RückbauAbbruchUrban,
    description: inhalt.werte.systematischePlanungUndUmsetzung,
    icon: Building,
    items: [
      {
        id: 'rb-1',
        task: inhalt.werte.preDemolitionAuditSchadstofferkundung,
        description: inhalt.werte.beauftragungEinesQualifiziertenBaugutach,
        ref: inhalt.werte.t5aGefstoffvTrgs519,
        status: 'critical'
      },
      {
        id: 'rb-2',
        task: inhalt.werte.schadstoffUndBauteilkatasterErstellen,
        description: inhalt.werte.lückenlosesVerzeichnisAllerVerbauten,
        ref: inhalt.werte.vdi6202Blatt1,
        status: 'critical'
      },
      {
        id: 'rb-3',
        task: inhalt.werte.abbruchgenehmigungStatischesRückbaukonze,
        description: inhalt.werte.statischeVoruntersuchungenZurStandsicher,
        ref: inhalt.werte.landesbauordnungLbo,
        status: 'mandatory'
      },
      {
        id: 'rb-4',
        task: inhalt.werte.entkernungsketteDefinierenSortenreinerAu,
        description: inhalt.werte.planungDesSelektivenRückbaus,
        ref: inhalt.werte.gewerbeabfallverordnungGewabfv8,
        status: 'mandatory'
      },
      {
        id: 'rb-5',
        task: inhalt.werte.erfassungRecycelbarerBauteileFür,
        description: inhalt.werte.sicherungErhaltenswerterBauteileZ,
        ref: inhalt.werte.krwg6AbfallhierarchieVorbereitung,
        status: 'recommended'
      },
      {
        id: 'rb-6',
        task: inhalt.werte.verwertungsberichtMassenbilanzFürBehörde,
        description: inhalt.werte.nachAbschlussDerArbeiten,
        ref: inhalt.werte.landesbauordnungUntereAbfallbehörde,
        status: 'recommended'
      }
    ]
  },
  aufbereitung: {
    id: 'aufbereitung',
    title: inhalt.werte.t2BodenMaterialaufbereitung,
    description: inhalt.werte.voraussetzungenFürDieSichere,
    icon: Recycle,
    items: [
      {
        id: 'ap-1',
        task: inhalt.werte.anzeigepflichtGenehmigungFürMobile,
        description: inhalt.werte.abstimmungDesEinsatzesDer,
        ref: inhalt.werte.bimschg4BimschvAnhang,
        status: 'critical'
      },
      {
        id: 'ap-2',
        task: inhalt.werte.technischeMaßnahmenZurStaub,
        description: inhalt.werte.installationVonWasserbedüsungssystemenAn,
        ref: inhalt.werte.taLärmTaLuft,
        status: 'mandatory'
      },
      {
        id: 'ap-3',
        task: inhalt.werte.störstoffausleseVorDerMechanischen,
        description: inhalt.werte.vorschaltungEinerHandausleseLeseband,
        ref: inhalt.werte.ersatzbaustoffverordnungEbvGüteüberwachu,
        status: 'mandatory'
      },
      {
        id: 'ap-4',
        task: inhalt.werte.güteüberwachungWerkseigeneProduktionskon,
        description: inhalt.werte.verpflichtendeErstprüfungUndRegelmäßige,
        ref: inhalt.werte.ersatzbaustoffverordnungEbvAbschnittGüte,
        status: 'mandatory'
      },
      {
        id: 'ap-5',
        task: inhalt.werte.bodensanierungAufEignungZur,
        description: inhalt.werte.beiKontaminiertenErdaushubmassenBewertun,
        ref: inhalt.werte.bbodschgBbodschv,
        status: 'mandatory'
      },
      {
        id: 'ap-6',
        task: inhalt.werte.ersatzbaustoffEinbauklassenGemHydrogeolo,
        description: inhalt.werte.abgleichDesAufbereitetenMaterials,
        ref: inhalt.werte.ersatzbaustoffv1920Und,
        status: 'critical'
      }
    ]
  },
  abfallrecht: {
    id: 'abfallrecht',
    title: inhalt.werte.t3AbfallwirtschaftRechtDeponierung,
    description: inhalt.werte.gesetzeskonformeEinstufungTransportüberw,
    icon: Database,
    items: [
      {
        id: 'ar-1',
        task: inhalt.werte.erstzuordnungNachAvvSchlüssel,
        description: inhalt.werte.einstufungDesAbfallsAnhand,
        ref: inhalt.werte.abfallverzeichnisVerordnungAvvKap,
        status: 'critical'
      },
      {
        id: 'ar-2',
        task: inhalt.werte.repräsentativeHaufwerksbeprobungNachLaga,
        description: inhalt.werte.durchführungDerBeprobungDurch,
        ref: inhalt.werte.lagaPn98Din,
        status: 'critical'
      },
      {
        id: 'ar-3',
        task: inhalt.werte.gewerbeabfallverordnungGetrennthaltungsp,
        description: inhalt.werte.strikteTrennungVonMineralischen,
        ref: 'GewAbfV § 8',
        status: 'mandatory'
      },
      {
        id: 'ar-4',
        task: inhalt.werte.elektronischesAbfallnachweisverfahrenEan,
        description: inhalt.werte.einholenVonBehördlichenErzeugernummern,
        ref: inhalt.werte.nachweisverordnungNachwv,
        status: 'critical'
      },
      {
        id: 'ar-5',
        task: inhalt.werte.grundlegendeCharakterisierungGem8,
        description: inhalt.werte.ausfüllenDesCharakterisierungsbogensDurc,
        ref: inhalt.werte.deponieverordnungDepv8,
        status: 'mandatory'
      },
      {
        id: 'ar-6',
        task: inhalt.werte.zuordnungZuDenDeponieklassen,
        description: inhalt.werte.abgleichDesSchadstoffinventarsMit,
        ref: inhalt.werte.depvAnhang3Tabelle,
        status: 'mandatory'
      }
    ]
  },
  gefahrstoffe: {
    id: 'gefahrstoffe',
    title: inhalt.werte.t4SchadstoffeGefahrstoffeArbeitsschutz,
    description: inhalt.werte.sicherheitsUndGesundheitsschutzBeim,
    icon: AlertTriangle,
    items: [
      {
        id: 'gs-1',
        task: inhalt.werte.umgangMitAsbestSachkunde,
        description: inhalt.werte.arbeitenAnAsbestDürfen,
        ref: inhalt.werte.gefahrstoffverordnungGefstoffvTrgs519,
        status: 'critical'
      },
      {
        id: 'gs-2',
        task: inhalt.werte.künstlicheMineralfasernKmfBewerten,
        description: inhalt.werte.prüfungObAlteVor,
        ref: inhalt.werte.trgs521Neufassung2026,
        status: 'mandatory'
      },
      {
        id: 'gs-3',
        task: inhalt.werte.persönlicheSchutzausrüstungPsaVorschreib,
        description: inhalt.werte.bereitstellungPartikelfiltrierenderHalbm,
        ref: inhalt.werte.trgs519521Dguv,
        status: 'critical'
      },
      {
        id: 'gs-4',
        task: inhalt.werte.einrichtenVonSchwarzWeiß,
        description: inhalt.werte.bautechnischeKapselungDerSanierungsberei,
        ref: inhalt.werte.trgs519Trgs524,
        status: 'mandatory'
      },
      {
        id: 'gs-5',
        task: inhalt.werte.fachlicheWeisungsbefugnisSigekoBestellen,
        description: inhalt.werte.bestellungEinesSicherheitsUnd,
        ref: inhalt.werte.baustellenverordnungBaustellv3,
        status: 'mandatory'
      },
      {
        id: 'gs-6',
        task: inhalt.werte.staubdichteVerpackungUndKennzeichnung,
        description: inhalt.werte.asbestzementplattenUndFaserstäubeSind,
        ref: inhalt.werte.trgs519AbfallentsorgungGefstoffv,
        status: 'critical'
      }
    ]
  }
};

export default function RueckbauChecklisten() {
  const [activeSubTab, setActiveSubTab] = useState<string>('rueckbau');
  const currentSection = INITIAL_CHECKLISTS[activeSubTab];

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-300">
      
      {/* Header Info-Bereich */}
      <div className="bg-white text-text-main rounded-2xl p-6 border border-home-grau/30 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <Recycle className="text-shiraz" /><MdText text={inhalt.texte.checklistenRückbauSchadstoffsanierung} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.rechtskonformeHandlungsleitfädenFürIngen} /><span className="text-text-main font-semibold font-mono"><MdText text={inhalt.texte.bimschgKrwgGewabfvEbv} /></span>).
          </p>
        </div>
      </div>

      {/* Sub-Tabs Selector (Button wieder highlighted mit shiraz) */}
      <ReiterLeiste label="Checkliste" className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {Object.values(INITIAL_CHECKLISTS).map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSubTab === sec.id;

          return (
            <button {...alsReiter(isActive, 'rueckbau-checkliste', sec.id)}
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
      <div {...reiterPanel('rueckbau-checkliste', activeSubTab)} className="bg-white rounded-xl border border-home-grau/20 shadow-xs overflow-hidden min-h-[350px] flex flex-col justify-between">
        
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
              // Determine subtle layout border styling based on status
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
                badgeLabel = inhalt.werte.gesetzlichVerpflichtend;
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
                      <h4 className="text-sm font-bold text-text-main leading-tight">
                        {item.task}
                      </h4>
                      <span className={`px-1 py-0.5 rounded text-xs font-bold border ${badgeStyle} font-mono tracking-wide shrink-0`}>
                        {badgeLabel}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed font-normal text-home-grau/80">
                      {item.description}
                    </p>
                  </div>

                  {/* Rechtsgrundlage Link / Text */}
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
              <p className="font-normal text-home-grau/80"><MdText text={inhalt.texte.gefahrstoffeAufSanierungsbaustellenVerla} /></p>
            </div>
            <div className="flex gap-1">
              <a 
                href="https://www.gesetze-im-internet.de/gefstoffv_2010/index.html" 
                target="_blank" 
                rel="no-referrer"
                className="px-1.5 py-0.5 bg-white hover:bg-off-white border border-home-grau/20 text-text-main rounded font-bold flex items-center gap-0.5 transition-all cursor-pointer text-xs"
              >
                GefStoffV <ExternalLink size={10} />
              </a>
              <a 
                href="https://www.gesetze-im-internet.de/ebv/index.html" 
                target="_blank" 
                rel="no-referrer"
                className="px-1.5 py-0.5 bg-white hover:bg-off-white border border-home-grau/20 text-text-main rounded font-bold flex items-center gap-0.5 transition-all cursor-pointer text-xs"
              >
                EBV <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Module Footer Links */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1ProbenanzahlFür}
        zielGleichung="n_{MP} = 10 + \left\lceil \frac{V - 600}{100} \right\rceil, \quad n_{EP} = 4 \cdot n_{MP}, \quad n_{LP} = 10 + \left\lceil \frac{V - 600}{300} \right\rceil"
        schritte={inhalt.daten["RueckbauChecklisten.schritte"]}
        ergebnisHinweis={inhalt.werte.dieWerteEntsprechenTabelle}
        normQuelle={inhalt.werte.lagaPn98Mitteilung}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2VerpackungVon}
        zielGleichung="n_{Bag} = \left\lceil \frac{A \cdot g}{m_{Bag}} \right\rceil"
        schritte={inhalt.daten["RueckbauChecklisten.schritte_2"]}
        ergebnisHinweis={inhalt.werte.plattenUnzerstörtAufnehmenNicht}
        normQuelle={inhalt.werte.gefstoffv11aTrgs519}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="rueckbau_checklisten" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap9} 
        wikipedia={[
          { title: inhalt.werte.abbruchBauwesen, url: 'https://de.wikipedia.org/wiki/Abbruch_(Bauwesen)' },
          { title: 'Asbestsanierung', url: 'https://de.wikipedia.org/wiki/Asbestsanierung' },
          { title: 'Ersatzbaustoffverordnung', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' },
          { title: 'Kreislaufwirtschaftsgesetz', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaftsgesetz' }
        ]}
        regelwerke={[
          { title: inhalt.werte.ersatzbaustoffverordnungErsatzbaustoffv2, url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' },
          inhalt.daten["RueckbauChecklisten.regelwerke.1"],
          { title: inhalt.werte.gefahrstoffverordnungGefstoffv, url: 'https://www.gesetze-im-internet.de/gefstoffv_2010/' },
          { title: inhalt.werte.trgs519AsbestZuletzt, url: 'https://www.baua.de/DE/Angebote/Regelwerk/TRGS/TRGS-519' },
          { title: inhalt.werte.gewerbeabfallverordnungGewabfv89, url: 'https://www.gesetze-im-internet.de/gewabfv_2017/' }
        ]}
        literatur={inhalt.daten["RueckbauChecklisten.literatur"]} 
        formeln={inhalt.daten["RueckbauChecklisten.formeln"]}
      />

    </div>
  );
}
