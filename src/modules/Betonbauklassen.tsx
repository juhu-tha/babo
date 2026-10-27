import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Layers, 
  Users, 
  ClipboardList, 
  Settings,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import inhalt from '@/content/betonbauklassen/Betonbauklassen.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface BauteilTemplate {
  id: string;
  name: string;
  bbqClass: 'BBQ-N' | 'BBQ-E' | 'BBQ-S';
  /** DIN 1045-3:2023-08 kennt nur noch ÜK 1 und ÜK 2 (die frühere ÜK 3 ist entfallen). */
  ueberwachungsklasse: 'ÜK 1' | 'ÜK 2';
  description: string;
  dangerLevel: string;
  phases: {
    planning: {
      action: string;
      responsible: string;
      normDetail: string;
      tip: string;
    };
    concept: {
      action: string;
      responsible: string;
      normDetail: string;
      tip: string;
    };
    kooperation: {
      action: string;
      responsible: string;
      normDetail: string;
      tip: string;
    };
    execution: {
      action: string;
      responsible: string;
      normDetail: string;
      tip: string;
    };
    curing: {
      action: string;
      responsible: string;
      normDetail: string;
      tip: string;
    };
  };
}

const BAUTEIL_TEMPLATES: BauteilTemplate[] = [
  {
    id: 'weisse_wanne',
    name: inhalt.werte.wuBodenplatteWeißeWanne,
    bbqClass: 'BBQ-E',
    ueberwachungsklasse: 'ÜK 2',
    description: inhalt.werte.bodenplatteEinesMehrfamilienhausKellers,
    dangerLevel: inhalt.werte.mittelErhöhtDichtigkeitsrisiko,
    phases: {
      planning: {
        action: inhalt.werte.festlegungVonBbqE,
        responsible: inhalt.werte.tragwerksplanerStatiker,
        normDetail: inhalt.werte.dieBbqKlasseWird,
        tip: inhalt.werte.vermeidenSieWidersprüchlicheAngaben
      },
      concept: {
        action: inhalt.werte.formulierungEinesDetailliertenBetonkonze,
        responsible: inhalt.werte.herstellerTechnologeDesZement,
        normDetail: inhalt.werte.eignungsnachweisNachDinEn,
        tip: inhalt.werte.eineFestigkeitsentwicklungÜber56
      },
      kooperation: {
        action: inhalt.werte.förmlicheDurchführungDesBbq,
        responsible: inhalt.werte.bbqKoordinatorBauleiterWerkstechniker,
        normDetail: inhalt.werte.dasProtokollDesKooperationsgesprächs,
        tip: inhalt.werte.ladeAuchDenBetonpumpen
      },
      execution: {
        action: inhalt.werte.kontinuierlicheEinbaubegleitungÜberwachu,
        responsible: inhalt.werte.ausführenderBetriebÜk2Überwachter,
        normDetail: inhalt.werte.fremdüberwachungDerBaustelleNach,
        tip: inhalt.werte.zusatzwasserDarfVorOrt
      },
      curing: {
        action: inhalt.werte.sofortigerBeginnDerNachbehandlung,
        responsible: inhalt.werte.polierBetonbauerVorOrt,
        normDetail: inhalt.werte.din10453Tabelle,
        tip: inhalt.werte.beiSommerlichenWindenTrocknet
      }
    }
  },
  {
    id: 'sichtbeton_sb4',
    name: inhalt.werte.sichtbetonstützenKlasseSb4,
    bbqClass: 'BBQ-S',
    ueberwachungsklasse: 'ÜK 2',
    description: inhalt.werte.raumhoheHochausgelasteteTragstützenEines,
    dangerLevel: inhalt.werte.sehrHochOptischerSachmangel,
    phases: {
      planning: {
        action: inhalt.werte.detailplanungMitExaktemFugen,
        responsible: inhalt.werte.tragwerksplanerArchitekt,
        normDetail: inhalt.werte.zuordnungSb4BbqS,
        tip: inhalt.werte.schreibenSieEineProbe
      },
      concept: {
        action: inhalt.werte.rezepturgestaltungMitFeinstmateriellerAb,
        responsible: inhalt.werte.herstellerQualitätsbeauftragter,
        normDetail: inhalt.werte.festlegungDesFeinanteilsNach,
        tip: inhalt.werte.dieVerwendungVonFlugasche
      },
      kooperation: {
        action: inhalt.werte.abspracheÜberSchalungsvorbereitungSpezif,
        responsible: inhalt.werte.kooperationsGremiumPlanerWerkstechniker,
        normDetail: inhalt.werte.regelungDerZulässigenKonsistenzabweichun,
        tip: inhalt.werte.tragenSieDasTrennmittel
      },
      execution: {
        action: inhalt.werte.baustellenseitigeVerdichtungMitVibration,
        responsible: inhalt.werte.betonierProfisWerkspolier,
        normDetail: inhalt.werte.fremdüberwachungDerBaustelleNach2,
        tip: inhalt.werte.durchDenEinsatzEines
      },
      curing: {
        action: inhalt.werte.konstantesBelassenInDer,
        responsible: inhalt.werte.ausbaugewerkePolier,
        normDetail: inhalt.werte.sonderNachbehandlungNachSichtbetonspezif,
        tip: inhalt.werte.verwendenSieZumSchutz
      }
    }
  },
  {
    id: 'spannbeton_binder',
    name: inhalt.werte.spannbetonHauptträgerWeitspan,
    bbqClass: 'BBQ-S',
    ueberwachungsklasse: 'ÜK 2',
    description: inhalt.werte.vorgespannterDachbinderImIndustriebau,
    dangerLevel: inhalt.werte.kritischVersagensrisikoBeiFehlerhaftem,
    phases: {
      planning: {
        action: inhalt.werte.exakteBerechnungDerVorspannkräfte,
        responsible: inhalt.werte.fachingenieurFürTragwerksplanung,
        normDetail: inhalt.werte.ük3FolgtHier,
        tip: inhalt.werte.zeichnenSieEinDreidimensionales
      },
      concept: {
        action: inhalt.werte.sonderrezepturFürHochfestenBeton,
        responsible: inhalt.werte.zentrallaborDesHerstellers,
        normDetail: inhalt.werte.prüfungDesElastizitätsmodulsDes,
        tip: inhalt.werte.dieVerwendungVonLokalem
      },
      kooperation: {
        action: inhalt.werte.erarbeitungEinesDediziertenLogistischen,
        responsible: inhalt.werte.tragwerksplanerSpannbetonspezialistWerks,
        normDetail: inhalt.werte.esIstEinObjektspezifischer,
        tip: inhalt.werte.simulierenSieDenInjektionsprozess
      },
      execution: {
        action: inhalt.werte.überwachungAllerPressenwegeUnd,
        responsible: inhalt.werte.zertifizierterSpannTechniker,
        normDetail: inhalt.werte.spannverfahrenBenötigenEineAllgemeine,
        tip: inhalt.werte.kalibrierenSieDieHydraulischen
      },
      curing: {
        action: inhalt.werte.kontrollierteWärmeOderDampfbehandlung,
        responsible: inhalt.werte.abschnittsleiterDesFertigteilwerks,
        normDetail: inhalt.werte.dinEn13369Regelt,
        tip: inhalt.werte.zeichnenSieDieTemperaturkurven
      }
    }
  },
  {
    id: 'garagen_fundament',
    name: inhalt.werte.sauberkeitsschichtFundamentstreifen,
    bbqClass: 'BBQ-N',
    ueberwachungsklasse: 'ÜK 1',
    description: inhalt.werte.unbewehrterFundamentstreifenFürEine,
    dangerLevel: inhalt.werte.sehrGeringGeringfügigeBelastungen,
    phases: {
      planning: {
        action: inhalt.werte.festlegungVonBbqN,
        responsible: inhalt.werte.entwurfsverfasserBauingenieur,
        normDetail: inhalt.werte.bbqNIstDie,
        tip: inhalt.werte.fürEinfacheBauteileGenügt
      },
      concept: {
        action: inhalt.werte.lieferungEinerNormkonformenStandard,
        responsible: 'Transportbetonwerk',
        normDetail: inhalt.werte.reguläreWerkseigeneProduktionskontrolleW,
        tip: inhalt.werte.standardrezepturenDesTypsSortenverzeichn
      },
      kooperation: {
        action: inhalt.werte.keinGesondertesKooperationsgesprächVorge,
        responsible: inhalt.werte.bauleiterWerkdisponent,
        normDetail: inhalt.werte.beiBbqNIst,
        tip: inhalt.werte.klärenSieDennochDie
      },
      execution: {
        action: inhalt.werte.standardmäßigerEinbauDurchDas,
        responsible: inhalt.werte.baustellenpolierÜk1,
        normDetail: inhalt.werte.überwachungsklasseÜk1Nach,
        tip: inhalt.werte.achtenSieDaraufDass
      },
      curing: {
        action: inhalt.werte.einfachesBesprühenMitWasser,
        responsible: inhalt.werte.maurerBetonarbeiter,
        normDetail: inhalt.werte.grundlegenderWetterschutzNachDin,
        tip: inhalt.werte.beiMilderWitterungReicht
      }
    }
  }
];

export default function Betonbauklassen() {
  const [selectedBauteilId, setSelectedBauteilId] = useState<string>('weisse_wanne');
  const [activePhase, setActivePhase] = useState<'planning' | 'concept' | 'kooperation' | 'execution' | 'curing'>('planning');

  const selectedTemplate = BAUTEIL_TEMPLATES.find(t => t.id === selectedBauteilId) || BAUTEIL_TEMPLATES[0];

  return (
    <div className="flex flex-col gap-8 font-normal">
      
      {/* DIN 1045 Standard-Update Info */}
      <div className="bg-gradient-to-r from-shiraz/5 to-shiraz/10 p-6 rounded-2xl border border-shiraz/20 flex flex-col md:flex-row gap-5 items-start">
        <div className="p-3 bg-shiraz text-white rounded-xl shadow-sm shrink-0">
          <ShieldAlert size={24} />
        </div>
        <div>
          <span className="text-xs font-bold text-shiraz tracking-wider uppercase bg-shiraz/10 px-2.5 py-1 rounded-md"><MdText text={inhalt.texte.wichtigesNormenUpdateDin} /></span>
          <h3 className="text-xl font-bold text-text-main mt-1 flex items-center gap-2"><MdText text={inhalt.texte.vomDbvMerkblattZum} /></h3>
          <p className="text-xs text-text-main/80 leading-relaxed mt-1">
            Das bisherige freiwillige DBV-Merkblatt "Betonbauqualität (BBQ)" wurde mit der Veröffentlichung der neuen 
            <strong><MdText text={inhalt.texte.din1045ReiheAusgabe} /></strong> vollumfänglich harmonisiert und als verbindlicher deutscher 
            Standard eingeführt. Neu geschaffen wurde die Überbau-Norm <strong><MdText text={inhalt.texte.din10451000Zusammenarbeit} /></strong>, die das sogenannte <strong>Kooperationsmodell</strong> verbindlich regelt.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.bbqBetonbauqualitätsklassen} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-8 leading-relaxed">
          <p><MdText text={inhalt.texte.dasBbqPlanungskonzeptVerknüpft} /></p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
          <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/25 hover:border-shiraz/20 transition-colors">
            <h3 className="font-bold text-base mb-2 text-text-main flex items-center justify-between">
              <span><MdText text={inhalt.texte.bbqNNormal} /></span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Standard</span>
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.reguläreBetonbauqualitätGiltFür} /></p>
            <ul className="list-disc list-inside mt-3 text-[11px] text-text-main/70 space-y-1">
              <li><MdText text={inhalt.texte.üblicheÜberwachungZB} /></li>
              <li><MdText text={inhalt.texte.keineGesondertenAbstimmungsrundenZwingen} /></li>
            </ul>
          </div>
          
          <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/25 hover:border-shiraz/20 transition-colors">
            <h3 className="font-bold text-base mb-2 text-text-main flex items-center justify-between">
              <span><MdText text={inhalt.texte.bbqEErhöht} /></span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Qualitätsstufe</span>
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.erhöhteBetonbauqualitätGreiftBei} /></p>
            <ul className="list-disc list-inside mt-3 text-[11px] text-text-main/70 space-y-1">
              <li><MdText text={inhalt.texte.zBSichtbetonklasseSb3} /></li>
              <li><MdText text={inhalt.texte.erhöhteDokumentationsUndQualitätssicheru} /></li>
            </ul>
          </div>
          
          <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/25 hover:border-shiraz/20 transition-colors">
            <h3 className="font-bold text-base mb-2 text-text-main flex items-center justify-between">
              <span><MdText text={inhalt.texte.bbqSSonder} /></span>
              <span className="text-[10px] font-bold text-shiraz bg-shiraz/5 px-2 py-0.5 rounded">Sonderstufe</span>
            </h3>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.sonderBetonbauqualitätGiltBei} /></p>
            <ul className="list-disc list-inside mt-3 text-[11px] text-text-main/70 space-y-1">
              <li><MdText text={inhalt.texte.zBC5567} /></li>
              <li><MdText text={inhalt.texte.objektspezifischerQualitätssicherungspla} /></li>
            </ul>
          </div>
          
        </div>
        <p className="text-[11px] text-text-main/60 mb-8"><MdText text={inhalt.texte.din104510002023} /></p>

        {/* Detailed BBQ consequences & task profiles according to DIN 1045-1000 */}
        <section className="mt-4 mb-8 bg-white p-6 rounded-2xl border border-home-grau/25 shadow-3xs">
          <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
            <ClipboardList className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.konkreteAufgabenUndAdministrative} /></h3>
          <p className="text-xs text-text-main/75 mb-6 leading-relaxed"><MdText text={inhalt.texte.dieZuweisungEinerBetonbauqualitätsklasse} /></p>

          <div className="space-y-6">
            
            {/* BBQ-N normal */}
            <div className="border-l-4 border-slate-400 pl-4 py-1">
              <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md font-mono">BBQ-N</span><MdText text={inhalt.texte.normalanforderungLückenloserStandardAbla} /></h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-[11px] text-text-main/80">
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-text-main text-[11px] mb-1"><MdText text={inhalt.texte.tragwerksplanerStatik} /></strong><MdText text={inhalt.texte.normalerEntwurfsUndPrüfbogen} /></div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-text-main text-[11px] mb-1"><MdText text={inhalt.texte.herstellerBetonwerk} /></strong><MdText text={inhalt.texte.standardmäßigeMischungsbemessungAusDem} /></div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-text-main text-[11px] mb-1"><MdText text={inhalt.texte.bauunternehmenAusführung} /></strong><MdText text={inhalt.texte.reguläreEigenüberwachungÜk1} /></div>
              </div>
            </div>

            {/* BBQ-E elevated */}
            <div className="border-l-4 border-amber-500 pl-4 py-1">
              <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                <span className="bg-amber-50 text-amber-800 text-xs px-2 py-0.5 rounded-md font-mono">BBQ-E</span><MdText text={inhalt.texte.erhöhtesAufgabenprofilKooperationszwang} /></h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-[11px] text-text-main/80">
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-amber-800 text-[11px] mb-1"><MdText text={inhalt.texte.tragwerksplanerStatik2} /></strong>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li><MdText text={inhalt.texte.rechtlicheEinbauverantwortungUndFrühzeit} /></li>
                    <li><MdText text={inhalt.texte.schnittstellenregelungUndTerminierungDes} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-amber-800 text-[11px] mb-1"><MdText text={inhalt.texte.herstellerBetonwerk2} /></strong>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li><MdText text={inhalt.texte.ausarbeitungEinesProjektspezifischenBeto} /></li>
                    <li><MdText text={inhalt.texte.teilnahmepflichtAmAbstimmungsgesprächGen} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-amber-800 text-[11px] mb-1"><MdText text={inhalt.texte.bauunternehmenAusführung2} /></strong>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li><MdText text={inhalt.texte.erstellungSchriftlicherPläneFür} /></li>
                    <li><MdText text={inhalt.texte.erweitertesBautagebuchUndObligatorische} /></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* BBQ-S special */}
            <div className="border-l-4 border-shiraz pl-4 py-1">
              <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                <span className="bg-shiraz/5 text-shiraz text-xs px-2 py-0.5 rounded-md font-mono">BBQ-S</span><MdText text={inhalt.texte.sonderprozessMitQualitätssicherungsplanK} /></h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-[11px] text-text-main/80">
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-shiraz text-[11px] mb-1"><MdText text={inhalt.texte.tragwerksplanerStatik3} /></strong>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li><MdText text={inhalt.texte.gemeinsameErstellungEinesUmfassenden} /></li>
                    <li><MdText text={inhalt.texte.bestellungEinesDezidiertenBbq} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-shiraz text-[11px] mb-1"><MdText text={inhalt.texte.herstellerBetonwerk3} /></strong>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li><MdText text={inhalt.texte.labortechnischeSonderprüfungenScherversu} /></li>
                    <li><MdText text={inhalt.texte.vorschreibenExtremEngerTemperatur} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/10">
                  <strong className="block text-shiraz text-[11px] mb-1"><MdText text={inhalt.texte.bauunternehmenAusführung3} /></strong>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li><MdText text={inhalt.texte.umfangreicheFremdüberwachungÜk3Mit} /></li>
                    <li><MdText text={inhalt.texte.pflichtZurDurchführungVon} /></li>
                  </ul>
                </div>
              </div>
            </div>


          </div>
        </section>

        {/* Das neue Kooperationsmodell */}
        <div className="bg-emerald-50/40 p-6 rounded-2xl border border-emerald-500/20 mb-8">
          <h3 className="text-base font-bold text-emerald-800 mb-3 flex items-center gap-2">
            <Users size={18} /><MdText text={inhalt.texte.dasKooperationsmodellNachDin} /></h3>
          <p className="text-xs text-emerald-950/80 leading-relaxed mb-4"><MdText text={inhalt.texte.dieElementareÄnderungIst} /></p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3.5 rounded-lg border border-emerald-500/10">
              <span className="text-[10px] font-bold text-emerald-600 block mb-1"><MdText text={inhalt.texte.t1PlanungPart1} /></span>
              <p className="text-[11px] text-emerald-950/90 leading-normal"><MdText text={inhalt.texte.derTragwerksplanerLegtDie} /></p>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-emerald-500/10">
              <span className="text-[10px] font-bold text-emerald-600 block mb-1"><MdText text={inhalt.texte.t2HerstellungPart2} /></span>
              <p className="text-[11px] text-emerald-950/90 leading-normal"><MdText text={inhalt.texte.dasTransportbetonwerkEntwirftDie} /></p>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-emerald-500/10">
              <span className="text-[10px] font-bold text-emerald-600 block mb-1"><MdText text={inhalt.texte.t3AusführungPart3} /></span>
              <p className="text-[11px] text-emerald-950/90 leading-normal"><MdText text={inhalt.texte.dasBauunternehmenSetztDie} /></p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE IMPLEMENTATION LEITFADEN - OHNE ABARBEITUNG */}
        <div className="bg-stone-50 p-6 rounded-2xl border border-home-grau/25 shadow-3xs" id="bbq-leitfaden-section">
          
          <div className="flex justify-between items-center mb-5 flex-wrap gap-2 border-b border-home-grau/20 pb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="text-shiraz" size={22} />
              <div>
                <h3 className="text-base font-bold text-text-main"><MdText text={inhalt.texte.interaktiverBbqUmsetzungsLeitfaden} /></h3>
                <p className="text-[11px] text-text-main/60"><MdText text={inhalt.texte.wählenSieEinBauteilszenario} /></p>
              </div>
            </div>
          </div>

          {/* Bauteil-Tab-Umschalter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {BAUTEIL_TEMPLATES.map(bt => {
              const isSelected = bt.id === selectedBauteilId;
              return (
                <button
                  key={bt.id}
                  onClick={() => {
                    setSelectedBauteilId(bt.id);
                    setActivePhase('planning');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-3xs cursor-pointer flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                      : 'bg-white text-text-main border-home-grau/20 hover:bg-stone-100'
                  }`}
                >
                  <Settings size={13} className={isSelected ? 'animate-spin' : ''} />
                  {bt.name}
                </button>
              );
            })}
          </div>

          <div className="bg-white p-5 rounded-xl border border-home-grau/20 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-home-grau/15 pb-3">
              <div>
                <span className="text-[10px] font-bold text-shiraz tracking-widest uppercase block mb-0.5">Szenariobezeichnung</span>
                <h4 className="text-base font-bold text-text-main">{selectedTemplate.name}</h4>
                <p className="text-xs text-text-main/70 mt-1">{selectedTemplate.description}</p>
              </div>
              <div className="flex flex-col items-end shrink-0 gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-main/60">Klasse:</span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 bg-shiraz/5 text-shiraz border border-shiraz/10 rounded-md select-none">
                    {selectedTemplate.bbqClass}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-main/60">Baustelle:</span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 bg-stone-100 text-stone-700 border border-stone-200 rounded-md select-none">
                    {selectedTemplate.ueberwachungsklasse}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
              
              {/* Left Column: Flow Phases Timeline Selector */}
              <div className="md:col-span-5 space-y-2">
                <span className="text-[10px] font-bold text-text-main/45 uppercase tracking-wide block mb-2"><MdText text={inhalt.texte.prozessschritteImKooperationsmodell} /></span>
                
                {inhalt.daten.Betonbauklassen.map(phase => {
                  const isActive = activePhase === phase.id;
                  return (
                    <button
                      key={phase.id}
                      onClick={() => setActivePhase(phase.id as typeof activePhase)}
                      className={`w-full p-3 rounded-lg border text-left flex gap-3.5 transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-shiraz text-white border-shiraz shadow-sm' 
                          : 'bg-stone-50 text-text-main border-home-grau/15 hover:bg-stone-100'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isActive ? 'bg-white text-shiraz' : 'bg-home-grau/25 text-text-main/80'
                      }`}>
                        {phase.num}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold leading-snug">{phase.title}</h5>
                        <p className={`text-[10px] ${isActive ? 'text-white/70' : 'text-text-main/50'}`}>
                          {phase.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Dynamic Phase Details Detailcard */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div className="bg-stone-50 p-5 rounded-lg border border-home-grau/20 h-full flex flex-col justify-between gap-5">
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2 border-home-grau/10 flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-shiraz uppercase tracking-wider flex items-center gap-1">
                        <FileCheck size={12} />
                        Phasen-Steckbrief
                      </span>
                      <span className="text-[10px] font-bold text-stone-500 font-mono bg-stone-200/60 px-2 py-0.5 rounded-full">
                        {activePhase === 'planning' ? 'Tragwerksplanung' : activePhase === 'concept' ? 'Herstellerwerk' : activePhase === 'kooperation' ? 'Abstimmungsphase' : activePhase === 'execution' ? 'Gussphase' : 'Festbetonphase'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[9.5px] font-bold text-text-main/40 uppercase block"><MdText text={inhalt.texte.wasIstKonkretZu} /></label>
                        <p className="text-xs text-text-main leading-relaxed font-semibold mt-1">
                          {selectedTemplate.phases[activePhase].action}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-home-grau/10">
                        <div>
                          <label className="text-[9.5px] font-bold text-text-main/40 uppercase block">Zuständigkeit:</label>
                          <span className="text-xs font-bold text-shiraz block mt-0.5">
                            👤 {selectedTemplate.phases[activePhase].responsible}
                          </span>
                        </div>
                        <div>
                          <label className="text-[9.5px] font-bold text-text-main/40 uppercase block"><MdText text={inhalt.texte.normvorgabeDin1045} /></label>
                          <span className="text-xs text-text-main/80 block mt-0.5 leading-tight">
                            📕 {selectedTemplate.phases[activePhase].normDetail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-200/40 p-3 rounded-lg text-xs">
                    <div className="font-bold text-amber-800 flex items-center gap-1">
                      <HelpCircle size={13} /><MdText text={inhalt.texte.baupraktischerInsiderTipp} /></div>
                    <p className="text-amber-900/85 text-[11px] mt-1 leading-normal italic">
                      " {selectedTemplate.phases[activePhase].tip} "
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-home-grau/20 text-xs text-text-main/70 text-center flex items-center justify-center gap-2">
            <span>💡</span>
            <span><MdText text={inhalt.texte.kooperationsvorteilDurchDiesesStrukturie} /></span>
          </div>

        </div>

        <div className="bg-shiraz/5 p-6 rounded-xl border border-shiraz/20 mt-8">
          <h3 className="text-base font-bold text-shiraz mb-2"><MdText text={inhalt.texte.zusammenhangMitÜberwachungsklassen} /></h3>
          <p className="text-xs text-text-main/80 mb-4 leading-relaxed"><MdText text={inhalt.texte.dieBetonbauqualitätsklassenBbqStehen} /></p>
          <ul className="list-disc list-inside text-xs text-text-main/80 space-y-2 leading-relaxed">
            <li><MdText text={inhalt.texte.ük1FestigkeitsklassenBis} /></li>
            <li><MdText text={inhalt.texte.ük2C3037} /></li>
          </ul>
          <p className="text-[11px] text-text-main/60 mt-3"><MdText text={inhalt.texte.zuordnungNachDin1045} /></p>
        </div>
      </div>

    </div>
  );
}
