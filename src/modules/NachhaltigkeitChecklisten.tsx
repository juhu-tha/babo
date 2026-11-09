import type { LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import { 
  Building2, 
  Leaf, 
  Zap, 
  RefreshCw, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/nachhaltigkeitchecklisten/NachhaltigkeitChecklisten.json';
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
  planning: {
    id: 'planning',
    title: inhalt.werte.t1TragwerksplanungVorentwurf,
    description: inhalt.werte.frühzeitigeWeichenstellungenImVorentwurf,
    icon: Building2,
    items: [
      {
        id: 'plan_1',
        task: inhalt.werte.tragwerksUndQuerschnittsoptimierung,
        description: inhalt.werte.wurdeDasStatischeSystem,
        ref: 'LNB & BNB',
        status: 'mandatory'
      },
      {
        id: 'plan_2',
        task: inhalt.werte.klinkerarmutZementsubstitution,
        description: inhalt.werte.erfolgtDerEinsatzVon,
        ref: inhalt.werte.dinEn1971,
        status: 'critical'
      },
      {
        id: 'plan_3',
        task: inhalt.werte.integrationNachwachsenderRohstoffeNawaro,
        description: inhalt.werte.prüfungObNichtTragende,
        ref: inhalt.werte.qngAnforderungenKfw40,
        status: 'mandatory'
      },
      {
        id: 'plan_4',
        task: inhalt.werte.rückbaufreundlicheFügungDesignFor,
        description: inhalt.werte.sindVerbindungspunkteMechanischLösbar,
        ref: inhalt.werte.dinEnIso20887,
        status: 'recommended'
      }
    ]
  },
  chemistry: {
    id: 'chemistry',
    title: inhalt.werte.t2BauchemieSchadstoffvermeidung,
    description: inhalt.werte.vorgabeEmissionsarmerBauprodukteUnd,
    icon: Leaf,
    items: [
      {
        id: 'ausschreibung_1',
        task: inhalt.werte.qualitätsstufe4FürInnenwandbeschichtunge,
        description: inhalt.werte.werdenFürInnenwandbeschichtungenFarben,
        ref: inhalt.werte.qngSteckbrief313Anhang,
        status: 'critical'
      },
      {
        id: 'ausschreibung_2',
        task: inhalt.werte.ausschlussHalogenierterTreibmittelIn,
        description: inhalt.werte.wirdInDerLeistungsbeschreibung,
        ref: inhalt.werte.qngSteckbrief313Anhang2,
        status: 'critical'
      },
      {
        id: 'ausschreibung_3',
        task: inhalt.werte.schadstoffarmeKlebstoffeDichtstoffe,
        description: inhalt.werte.einsatzVonSchadstofffreienWeichmacher,
        ref: inhalt.werte.qngSteckbrief313,
        status: 'mandatory'
      },
      {
        id: 'ausschreibung_4',
        task: inhalt.werte.formaldehydklassenImInnenausbau,
        description: inhalt.werte.wirdSpezifiziertDassHolzwerkstoffe,
        ref: inhalt.werte.dinEn16516Chemverbotsv,
        status: 'mandatory'
      }
    ]
  },
  operation: {
    id: 'operation',
    title: inhalt.werte.t3EnergieTechnikBetrieb,
    description: inhalt.werte.systemischeOptimierungDerBauphysik,
    icon: Zap,
    items: [
      {
        id: 'betrieb_1',
        task: inhalt.werte.systemischeOptimierungDerGebäudehülle,
        description: inhalt.werte.erzielenAlleAußenbauteileHervorragende,
        ref: inhalt.werte.gmodgVormalsGegKfw,
        status: 'mandatory'
      },
      {
        id: 'betrieb_2',
        task: inhalt.werte.fossilfreieHocheffizienteWärmeversorgung,
        description: inhalt.werte.wurdenVerbrennungsheizungenGasÖl,
        ref: inhalt.werte.gmodgVormalsGegBeg,
        status: 'critical'
      },
      {
        id: 'betrieb_3',
        task: inhalt.werte.lüftungsanlageMitHocheffektiverWärmerück,
        description: inhalt.werte.istEineKontrollierteMechanische,
        ref: inhalt.werte.dinEn13141Passivhaus,
        status: 'mandatory'
      },
      {
        id: 'betrieb_4',
        task: inhalt.werte.pvGroßanlageBatteriespeicherKombination,
        description: inhalt.werte.ermittlungDesTheoretischenStromertrags,
        ref: inhalt.werte.dinV18599Qng,
        status: 'mandatory'
      }
    ]
  },
  circularity: {
    id: 'circularity',
    title: inhalt.werte.t4RückbauKreislaufwirtschaft,
    description: inhalt.werte.konsequenteAusrichtungAufRessourcenschon,
    icon: RefreshCw,
    items: [
      {
        id: 'kreislauf_1',
        task: inhalt.werte.bimBasierterCircularityMaterialpass,
        description: inhalt.werte.wurdeImZugeDer,
        ref: inhalt.werte.gebäuderessourcenpassMaterialpassProdukt,
        status: 'recommended'
      },
      {
        id: 'kreislauf_2',
        task: inhalt.werte.einsatzVonRecyclingBeton,
        description: inhalt.werte.werdenFürDieBauteile,
        ref: 'DAfStb-Richtlinie',
        status: 'mandatory'
      },
      {
        id: 'kreislauf_3',
        task: inhalt.werte.sortenreineTrennbarkeitAnWdvs,
        description: inhalt.werte.befürwortungMechanischVerdübelterDämmsys,
        ref: inhalt.werte.vdi6210Rückbaubarkeit,
        status: 'mandatory'
      },
      {
        id: 'kreislauf_4',
        task: inhalt.werte.mineralischeErsatzbaustoffeEbvKonformitä,
        description: inhalt.werte.werdenAnfallendeMineralischeBaustoffe,
        ref: inhalt.werte.ersatzbaustoffverordnungEbv,
        status: 'mandatory'
      }
    ]
  }
};

export default function NachhaltigkeitChecklisten() {
  const [activeSubTab, setActiveSubTab] = useState<string>('planning');
  const currentSection = INITIAL_CHECKLISTS[activeSubTab];

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-300">
      
      {/* Header Info-Bereich */}
      <div className="bg-white text-text-main rounded-2xl p-6 border border-home-grau/30 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <Leaf className="text-shiraz" /><MdText text={inhalt.texte.checklistenNachhaltigesBauenQng} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.stufenweiseQualitätssicherungZurErreichu} /></p>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <ReiterLeiste label="Checkliste" className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {Object.values(INITIAL_CHECKLISTS).map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSubTab === sec.id;

          return (
            <button {...alsReiter(isActive, 'nachhaltigkeit-checkliste', sec.id)}
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
      <div {...reiterPanel('nachhaltigkeit-checkliste', activeSubTab)} className="bg-white rounded-xl border border-home-grau/20 shadow-xs overflow-hidden min-h-[350px] flex flex-col justify-between">
        
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
                badgeStyle = 'bg-rose-50/50 text-shiraz border-rose-100/40';
                badgeLabel = inhalt.werte.kritischVetoPunkt;
              } else if (item.status === 'mandatory') {
                borderStyle = 'border-home-grau/20 border-l-2 border-l-amber-500/80';
                badgeStyle = 'bg-amber-50/50 text-amber-700 border-amber-100/40';
                badgeLabel = inhalt.werte.hoheRelevanz;
              } else {
                borderStyle = 'border-home-grau/20 border-l-2 border-l-emerald-500/80';
                badgeStyle = 'bg-emerald-50/50 text-emerald-700 border-emerald-100/40';
                badgeLabel = inhalt.werte.präzisierungEmpfohlen;
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

                  {/* Prüfgrundlage */}
                  <div className="flex sm:flex-col justify-between items-end gap-1 text-xs font-mono tracking-tight sm:border-l sm:border-home-grau/10 sm:pl-3 shrink-0 pt-1.5 sm:pt-0">
                    <div className="text-left sm:text-right font-light">
                      <span className="text-home-grau/65 font-bold block text-xs uppercase tracking-wider">Prüfgrundlage</span>
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
              <p className="font-normal text-home-grau/80"><MdText text={inhalt.texte.dieseChecklistenDienenAls} /></p>
            </div>
            <div className="flex gap-1">
              <a 
                href="https://www.nachhaltigesbauen.de" 
                target="_blank" 
                rel="no-referrer"
                className="px-1.5 py-0.5 bg-white hover:bg-off-white border border-home-grau/20 text-text-main rounded font-bold flex items-center gap-0.5 transition-all cursor-pointer text-xs"
              >
                LNB Portal <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Module Footer Links */}
      <ModuleFooter 
        wikipedia={[
          { title: inhalt.werte.nachhaltigesBauen, url: 'https://de.wikipedia.org/wiki/Nachhaltiges_Bauen' },
          { title: 'Gebäudeenergiegesetz' },
          { title: 'Kreislaufwirtschaft', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaft' },
          { title: inhalt.werte.graueEnergie, url: 'https://de.wikipedia.org/wiki/Graue_Energie' }
        ]}
        regelwerke={inhalt.daten["NachhaltigkeitChecklisten.regelwerke"]}
        literatur={inhalt.daten["NachhaltigkeitChecklisten.literatur"]} 
        formeln={inhalt.daten["NachhaltigkeitChecklisten.formeln"]}
      />

    </div>
  );
}
