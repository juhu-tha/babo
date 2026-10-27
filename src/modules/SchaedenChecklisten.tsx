import type { LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import {
  TrendingDown,
  ShieldAlert,
  Camera,
  Activity,
  FileWarning
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/schaedenchecklisten/SchaedenChecklisten.json';
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
  aufnahme: {
    id: 'aufnahme',
    title: inhalt.werte.t1SchadensdiagnoseBauaufnahme,
    description: inhalt.werte.vorbereitungDokumentationDesSchadensausm,
    icon: TrendingDown,
    items: [
      {
        id: 'auf-0',
        task: inhalt.werte.unterlagenVorabSichten,
        description: inhalt.werte.bauwerksbuchBestandspläneStatikFrühere,
        ref: inhalt.werte.vdi6200Bauwerksbuch,
        status: 'mandatory'
      },
      {
        id: 'auf-00',
        task: inhalt.werte.arbeitsschutzUndSchadstoffverdachtVor,
        description: inhalt.werte.beiBaujahrVor1993,
        ref: inhalt.werte.gefstoffvTrgs519524,
        status: 'critical'
      },
      {
        id: 'auf-000',
        task: 'Sofortmaßnahmen-Check',
        description: inhalt.werte.verkehrssicherungBeiHerabfallendenTeilen,
        ref: inhalt.werte.t823BgbLbo,
        status: 'critical'
      },
      {
        id: 'auf-1',
        task: inhalt.werte.risskartierungRissbreitenmessung,
        description: inhalt.werte.vollständigeGrafischeAufzeichnungAller,
        ref: inhalt.werte.trInstandhaltungDibt,
        status: 'critical'
      },
      {
        id: 'auf-1b',
        task: inhalt.werte.fotodokumentationMitRandbedingungen,
        description: inhalt.werte.fotosMitMaßstabDatum,
        ref: 'Sachverständigenpraxis',
        status: 'mandatory'
      },
      {
        id: 'auf-2',
        task: inhalt.werte.hohlstellenUndAbplatzungsortung,
        description: inhalt.werte.abklopfenDerBetonoberflächeMit,
        ref: inhalt.werte.trInstandhaltungDin1076,
        status: 'mandatory'
      },
      {
        id: 'auf-3',
        task: inhalt.werte.karbonatisierungstiefeMesstechnischBeurt,
        description: inhalt.werte.auftragenEinerPhenolphthaleinLösung,
        ref: inhalt.werte.dinEn14630,
        status: 'critical'
      },
      {
        id: 'auf-4',
        task: 'Chloridprofil-Bohrmehlanalyse',
        description: inhalt.werte.schichtenweisesAbbohrenVonBetonmehl,
        ref: inhalt.werte.dinEn14629Tr,
        status: 'critical'
      },
      {
        id: 'auf-5',
        task: 'Feuchtemessung',
        description: inhalt.werte.zerstörungsfreieMessungAlsVorscan,
        ref: inhalt.werte.dinEnIso12570,
        status: 'mandatory'
      },
      {
        id: 'auf-6',
        task: inhalt.werte.verformungsUndDurchbiegungsmessung,
        description: inhalt.werte.nivellementOderTachymetrieAn,
        ref: inhalt.werte.vermessungVdi6200,
        status: 'recommended'
      },
      {
        id: 'auf-7',
        task: inhalt.werte.probenahmeMitProtokoll,
        description: inhalt.werte.probenahmeprotokollOrtTiefeVerfahren,
        ref: inhalt.werte.dinEn125041,
        status: 'mandatory'
      }
    ]
  },
  diagnostik: {
    id: 'diagnostik',
    title: inhalt.werte.t2ZerstörungsfreiePrüfungSensorik,
    description: inhalt.werte.messtechnischeTiefenanalyseUndRissüberwa,
    icon: Activity,
    items: [
      {
        id: 'diag-1',
        task: inhalt.werte.potentialfeldmessungZurKorrosionsortung,
        description: inhalt.werte.zerstörungsfreieLokalisierungAktiverBewe,
        ref: inhalt.werte.dgzfpMerkblattB03,
        status: 'critical'
      },
      {
        id: 'diag-2a',
        task: inhalt.werte.rissmarkenQualitativ,
        description: inhalt.werte.gipsmarkenOderGlasplättchenZeigen,
        ref: 'Sachverständigenpraxis',
        status: 'recommended'
      },
      {
        id: 'diag-2',
        task: inhalt.werte.rissmonitoreLvdtMitTemperaturmessung,
        description: inhalt.werte.induktiveWegaufnehmerOderRissmonitore,
        ref: inhalt.werte.vdi6200Bauwerksmonitoring,
        status: 'mandatory'
      },
      {
        id: 'diag-3',
        task: inhalt.werte.bohrwiderstandsmessungResistographBeiHol,
        description: inhalt.werte.prüfungVerdeckterHolzfäuleIn,
        ref: inhalt.werte.din688004Verfahren,
        status: 'mandatory'
      },
      {
        id: 'diag-4',
        task: inhalt.werte.endoskopischeHohlrauminspektion,
        description: inhalt.werte.minimalinvasiveOptischeUntersuchungVon,
        ref: inhalt.werte.dgzfpMerkblattB06,
        status: 'recommended'
      }
    ]
  },
  beweissicherung: {
    id: 'beweissicherung',
    title: inhalt.werte.t3BeweissicherungSchadenskataster,
    description: inhalt.werte.beweissicherndeDokumentationNachVob,
    icon: Camera,
    items: [
      {
        id: 'bew-1',
        task: inhalt.werte.strukturiertesSchadenskatasterAnlegen,
        description: inhalt.werte.tabellarischeErfassungAllerMängel,
        ref: inhalt.werte.vobB4Abs,
        status: 'critical'
      },
      {
        id: 'bew-2',
        task: inhalt.werte.beweissicherungVorNachbarbebauung,
        description: inhalt.werte.vollständigeVisuelleUndMesstechnische,
        ref: inhalt.werte.din4123Din4150,
        status: 'critical'
      },
      {
        id: 'bew-3',
        task: inhalt.werte.abgrenzungPlanungsVsAusführungsfehler,
        description: inhalt.werte.fachlichePrüfungObDer,
        ref: inhalt.werte.bgb633VobB,
        status: 'mandatory'
      },
      {
        id: 'bew-4',
        task: inhalt.werte.ursachenhypothesenUndAbgrenzung,
        description: inhalt.werte.ursachenhypothesenDokumentierenUndMangel,
        ref: 'Oswald/Abel',
        status: 'mandatory'
      }
    ]
  },
  standsicherheit: {
    id: 'standsicherheit',
    title: inhalt.werte.t4StandsicherheitsbewertungVdi6200,
    description: inhalt.werte.bewertungDesBauwerkszustandsUnd,
    icon: ShieldAlert,
    items: [
      {
        id: 'st-1',
        task: inhalt.werte.bewertungUndZustandsnoteDokumentieren,
        description: inhalt.werte.bewertungUndZustandsnoteNach,
        ref: inhalt.werte.vdi6200Blatt1,
        status: 'critical'
      },
      {
        id: 'st-2',
        task: inhalt.werte.sofortigeNotsicherungVeranlassen,
        description: inhalt.werte.beiGefahrFürLeib,
        ref: inhalt.werte.lboGefahrenabwehr,
        status: 'critical'
      },
      {
        id: 'st-3',
        task: inhalt.werte.verkehrssicherheitsprüfungProtokollieren,
        description: inhalt.werte.prüfberichtMitFristsetzungFür,
        ref: inhalt.werte.vdi6200RüvArgebau,
        status: 'mandatory'
      }
    ]
  }
};

export default function SchaedenChecklisten() {
  const [activeSubTab, setActiveSubTab] = useState<string>('aufnahme');
  const currentSection = INITIAL_CHECKLISTS[activeSubTab];

  return (
    <div className="flex flex-col gap-6 w-full py-4 animate-in fade-in duration-300">
      
      {/* Header Info-Bereich */}
      <div className="bg-white text-text-main rounded-2xl p-6 border border-home-grau/30 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <FileWarning className="text-shiraz" /><MdText text={inhalt.texte.checklistenBauschadensdiagnostikBauaufna} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.systematischePrüflistenFürSachverständig} /></p>
        </div>

        {/* Sub-Tabs Selector */}
        <ReiterLeiste label="Checkliste" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          {Object.values(INITIAL_CHECKLISTS).map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSubTab === sec.id;

            return (
              <button {...alsReiter(isActive, 'schaeden-checkliste', sec.id)}
                key={sec.id}
                onClick={() => setActiveSubTab(sec.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-shiraz'} />
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-text-main'}`}>
                    {sec.title.split('. ')[1]}
                  </span>
                </div>
                <span className={`text-[11px] line-clamp-1 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                  {sec.description}
                </span>
              </button>
            );
          })}
        </ReiterLeiste>
      </div>

      {/* Items Section */}
      <div {...reiterPanel('schaeden-checkliste', activeSubTab)} className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">{currentSection.title}</h3>
            <p className="text-xs text-slate-500">{currentSection.description}</p>
          </div>
          <span className="text-xs font-mono bg-off-white px-2.5 py-1 rounded border border-home-grau/30 text-slate-600">
            {currentSection.items.length} Prüfpunkte
          </span>
        </div>

        <div className="space-y-3">
          {currentSection.items.map((item) => (
            <div key={item.id} className="p-4 bg-off-white rounded-xl border border-home-grau/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'critical' ? 'bg-rose-100 text-rose-800' :
                    item.status === 'mandatory' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status === 'critical' ? inhalt.werte.kritischZwingend :
                     item.status === 'mandatory' ? 'Standard' : 'Empfohlen'}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{item.task}</h4>
                </div>
                <p className="text-slate-700 leading-relaxed max-w-3xl">{item.description}</p>
              </div>

              <div className="shrink-0 text-right sm:text-right">
                <span className="text-[11px] font-mono bg-white px-2.5 py-1 rounded border border-home-grau/30 text-slate-600 inline-block">
                  {item.ref}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1IstDer}
        zielGleichung="\dot{w} = \frac{w_2 - w_1}{\Delta t}"
        schritte={inhalt.daten["SchaedenChecklisten.schritte"]}
        ergebnisHinweis={inhalt.werte.messungenÜberMindestensEinen}
        normQuelle={inhalt.werte.trInstandhaltungDibtDbv}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2FeuchtegehaltEiner}
        zielGleichung="u_m = \frac{m_f - m_d}{m_d} \cdot 100\,\%"
        schritte={inhalt.daten["SchaedenChecklisten.schritte_2"]}
        ergebnisHinweis={inhalt.werte.erstDerDurchfeuchtungsgradErlaubt}
        normQuelle={inhalt.werte.wtaMerkblatt411}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="schaeden_checklisten" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap11}
        wikipedia={[
          { title: "Bauschaden", url: "https://de.wikipedia.org/wiki/Bauschaden" },
          { title: inhalt.werte.zerstörungsfreiePrüfungImBauwesen, url: "https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Pr%C3%BCfung_im_Bauwesen" }
        ]}
        literatur={inhalt.daten["SchaedenChecklisten.literatur"]}
        regelwerke={inhalt.daten["SchaedenChecklisten.regelwerke"]}
        formeln={[]}
      />
    </div>
  );
}
