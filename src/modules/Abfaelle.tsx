import React, { useState } from 'react';
import { Trash2, Recycle, AlertTriangle, ShieldCheck, Layers, List, Database, LucideIcon, Search, FileSignature, BookOpen, ArrowRight, HelpCircle, ClipboardList } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import type { AbfallGruppe, AbfallTab, SchemaCard } from './abfaelle/daten';
import AvvSchluessel from './abfaelle/AvvSchluessel';
import EbvMantelverordnung from './abfaelle/EbvMantelverordnung';
import Deponie from './abfaelle/Deponie';
import Altlasten from './abfaelle/Altlasten';
import LagaPn98 from './abfaelle/LagaPn98';
import Checklisten from './abfaelle/Checklisten';
import inhalt from '@/content/abfaelle/Abfaelle.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Abfaelle() {
  const [activeTab, setActiveTab ] = useState<AbfallTab>('schema');
  const [activeChecklistSubTab, setActiveChecklistSubTab] = useState<'einstufung' | 'mineralik' | 'rueckbau' | 'deponie' | 'probenahme' | 'gefahrstoffe'>('einstufung');

  // EBV-Einbau-Konfigurator State
  const [ebvMaterial, setEbvMaterial] = useState<string>('rc1');
  const [ebvSchutzgebiet, setEbvSchutzgebiet] = useState<string>('ausserhalb');
  const [ebvGrundwasser, setEbvGrundwasser] = useState<string>('deckschicht_ja');
  const [ebvEinbauweise, setEbvEinbauweise] = useState<string>('versiegelt');
  const [ebvVolumen, setEbvVolumen] = useState<string>('unter_250');

  // DepV interactive calculator states
  const [depVSelectedParam, setDepVSelectedParam] = useState<string>('toc');
  const [depVInputValue, setDepVInputValue] = useState<number>(0.5);
  const [deponieSection, setDeponieSection] = useState<'basis' | 'oberflaeche'>('basis');
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(1);
  const [activeBarrier, setActiveBarrier] = useState<number>(3);

  // BBodSchV interactive checker states
  const [bbodWirkungspfad, setBbodWirkungspfad] = useState<string>('mensch');
  const [bbodNutzungsart, setBbodNutzungsart] = useState<string>('wohngebiet');

  // LAGA PN 98 interactive calculator states
  const [pnVolume, setPnVolume] = useState<number>(120);
  const [pnMaterialState, setPnMaterialState] = useState<'homogen' | 'heterogen'>('heterogen');
  const [pnGrainSize, setPnGrainSize] = useState<string>('32');

  const tabs: { id: AbfallTab; label: string; icon: LucideIcon }[] = [
    { id: 'schema', label: inhalt.werte.wegweiserWannWasWie, icon: BookOpen },
    { id: 'hierarchie', label: inhalt.werte.krwgHierarchie, icon: Layers },
    { id: 'avv', label: inhalt.werte.avvAbfallarten, icon: List },
    { id: 'ebv', label: inhalt.werte.ersatzbaustoffvEbv, icon: Recycle },
    { id: 'deponie', label: inhalt.werte.deponieDepv, icon: Database },
    { id: 'altholz', label: 'Altholzverordnung', icon: Recycle },
    { id: 'altlasten', label: inhalt.werte.altlastenBbodschg, icon: AlertTriangle },
    { id: 'rueckbau', label: inhalt.werte.rückbauVerwertung, icon: ShieldCheck },
    { id: 'eanv', label: inhalt.werte.nachweiseEanv, icon: FileSignature },
    { id: 'pn98', label: inhalt.werte.probenahmePn98, icon: Search },
    { id: 'checklisten', label: 'Praxis-Checklisten', icon: ClipboardList }
  ];
  // AP 3.8: höchstens 7 Reiter je Leiste – die 11 Bereiche sind zu 7 Themengruppen gebündelt;
  // innerhalb einer Gruppe wählt eine zweite Reiterleiste den Bereich (activeTab bleibt der Bereich).
  const gruppen: { id: AbfallGruppe; label: string; icon: LucideIcon; bereiche: AbfallTab[] }[] = [
    { id: 'wegweiser', label: 'Wegweiser', icon: BookOpen, bereiche: ['schema'] },
    { id: 'recht', label: 'KrWG & AVV', icon: Layers, bereiche: ['hierarchie', 'avv'] },
    { id: 'verwertung', label: inhalt.werte.verwertungEbvAltholz, icon: Recycle, bereiche: ['ebv', 'altholz'] },
    { id: 'deponie', label: inhalt.werte.deponieDepv2, icon: Database, bereiche: ['deponie'] },
    { id: 'altlasten', label: inhalt.werte.altlastenBbodschg2, icon: AlertTriangle, bereiche: ['altlasten'] },
    { id: 'rueckbau', label: inhalt.werte.rückbauEanvPn98, icon: ShieldCheck, bereiche: ['rueckbau', 'eanv', 'pn98'] },
    { id: 'checklisten', label: 'Praxis-Checklisten', icon: ClipboardList, bereiche: ['checklisten'] }
  ];
  const aktiveGruppe = gruppen.find(g => g.bereiche.includes(activeTab)) ?? gruppen[0];
  const unterReiter = aktiveGruppe.bereiche.length > 1
    ? tabs.filter(t => aktiveGruppe.bereiche.includes(t.id))
    : null;
  const schemaCards: SchemaCard[] = [
    {
      id: 'hierarchie',
      title: inhalt.werte.krwgAbfallhierarchie,
      category: 'Kreislaufwirtschaft',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: Layers,
      wann: inhalt.werte.ganzAmAnfangProjektplanung,
      was: inhalt.werte.grundsätzlicherUmgangMitAllen,
      wie: inhalt.werte.einhaltungDer5Stufigen,
      wozu: inhalt.werte.maximierungDerStofflichenWiederverwertun
    },
    {
      id: 'avv',
      title: inhalt.werte.avvAbfallarten2,
      category: 'Klassifizierung',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: List,
      wann: inhalt.werte.vorUndWährendDer,
      was: inhalt.werte.exakteEuropaweitGültigeAbfallklassifizie,
      wie: inhalt.werte.zuordnungNachHerkunftArt,
      wozu: inhalt.werte.eindeutigeUndRechtlichBelastbare
    },
    {
      id: 'ebv',
      title: inhalt.werte.ersatzbaustoffverordnungEbv,
      category: inhalt.werte.verwertungMineralik,
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: Recycle,
      wann: inhalt.werte.beimWiedereinbauMineralischerBaustoffe,
      was: inhalt.werte.recyclingBaustoffeRcBodenmaterial,
      wie: inhalt.werte.einordnungInGüteklassenZ,
      wozu: inhalt.werte.schutzDesBodensUnd
    },
    {
      id: 'deponie',
      title: inhalt.werte.deponieklassenDepv,
      category: 'Beseitigung',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: Database,
      wann: inhalt.werte.erstNachweislichNachAusschluss,
      was: inhalt.werte.endgültigZuBeseitigendeMineralische,
      wie: inhalt.werte.zuordnungUndEluattestsFür,
      wozu: inhalt.werte.dauerhafterSichererUndKontrollierter
    },
    {
      id: 'altholz',
      title: 'Altholzverordnung',
      category: 'Holzabfall',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: Recycle,
      wann: inhalt.werte.beiEntkernungAbbruchUnd,
      was: inhalt.werte.alleBauhölzerUndVerleimten,
      wie: inhalt.werte.sortierungInVierSchadstoffklassen,
      wozu: inhalt.werte.schutzDerKreislaufprodukteVor
    },
    {
      id: 'altlasten',
      title: inhalt.werte.altlastenBodenschutz,
      category: 'Boden/Sanierung',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: AlertTriangle,
      wann: inhalt.werte.beimBauenImBestand,
      was: inhalt.werte.bodenverunreinigungenUndAltablagerungenM,
      wie: inhalt.werte.stufenweiseErkundungHistorischOrientiere,
      wozu: inhalt.werte.schutzDerWirkungspfadeMensch
    },
    {
      id: 'rueckbau',
      title: inhalt.werte.rückbauVerwertung2,
      category: 'Rückbaupraxis',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: ShieldCheck,
      wann: inhalt.werte.vorDemPhysischenGebäudeabbruch,
      was: inhalt.werte.bestandsgebäudeMitsamtAllerBaustoffe,
      wie: inhalt.werte.schadstoffkatasterVdi6202Erstellen,
      wozu: inhalt.werte.erzielungSortenreinerAbbruchfraktionenFü
    },
    {
      id: 'eanv',
      title: inhalt.werte.nachweiseEanv2,
      category: inhalt.werte.rechtNachweise,
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: FileSignature,
      wann: inhalt.werte.vorUndWährendDer2,
      was: inhalt.werte.gesetzlichÜberwachungspflichtigeAbfälleZ,
      wie: inhalt.werte.vollelektronischesVerfahrenSignierungÜbe,
      wozu: inhalt.werte.lückenloseFälschungssichereUndStaatlich
    },
    {
      id: 'pn98',
      title: inhalt.werte.probenahmePn982,
      category: inhalt.werte.analytikProbenahme,
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: Search,
      wann: inhalt.werte.vorDerEntsorgungsDeklaration,
      was: inhalt.werte.haufwerkeBauschutthaldenOderUnberührter,
      wie: inhalt.werte.repräsentativeBeprobungNachVerbindlichem,
      wozu: inhalt.werte.chemischRechtlichBelastbareEinstufung
    },
    {
      id: 'checklisten',
      title: inhalt.werte.digitaleChecklisten,
      category: 'Praxis-Tools',
      colorClass: 'bg-shiraz/5 hover:bg-shiraz/10 hover:border-shiraz/50',
      borderColorClass: 'border-shiraz/20',
      badgeColorClass: 'bg-shiraz/10 text-shiraz border border-shiraz/25',
      labelColorClass: 'text-shiraz font-semibold',
      icon: ClipboardList,
      wann: inhalt.werte.inAllenProjektphasenZur,
      was: inhalt.werte.kompaktePraxisChecklistenFür,
      wie: inhalt.werte.stufenweiseAbarbeitungUndPrüfung,
      wozu: inhalt.werte.vermeidungVonFehlernSenkung
    }
  ];

  const evaluateEBV = () => {
    let status: 'allowed' | 'restricted' | 'forbidden' = 'allowed';
    let message = '';
    const conditions: string[] = [];
    let anzeige = inhalt.werte.keineAnzeigepflichtNach22;

    if (ebvVolumen === 'ab_250') {
      // Auswahl „rc3“ = RC-3 / BM-F3 / HMVA-2 (alle nach § 22 Abs. 1 anzeigepflichtig); „bm_f2“ = BM-F2 / HMVA-1 (§ 20 Abs. 1 Nr. 2)
      if (ebvMaterial === 'rc3' || ebvMaterial === 'bm_f3') {
        anzeige = inhalt.werte.anzeigepflichtigNach22Ebv;
      } else if (ebvMaterial === 'bm_f2') {
        anzeige = inhalt.werte.bmF2Hmva1Anzeige;
      } else {
        anzeige = inhalt.werte.keineMengenabhängigeAnzeigepflichtNach;
      }
    }

    if (ebvSchutzgebiet === 'wsg_1_2') {
      if (ebvMaterial === 'bm0' || ebvMaterial === 'bg0') {
        status = 'restricted';
        message = inhalt.werte.zoneIVerbotenZone;
        conditions.push(inhalt.werte.inZoneIIst);
      } else {
        status = 'forbidden';
        message = inhalt.werte.strengstensVerboten;
        conditions.push(inhalt.werte.inZoneIIst2);
      }
    }
    else if (ebvSchutzgebiet === 'wsg_3') {
      if (ebvMaterial === 'bm0' || ebvMaterial === 'bg0') {
        status = 'allowed';
        message = 'Zulässig.';
        conditions.push(inhalt.werte.einbauInBodenanlagenUnbedenklich);
      } else if (ebvMaterial === 'bm0_star' || ebvMaterial === 'rc1' || ebvMaterial === 'gs_f1') {
        if (ebvEinbauweise === 'offen') {
          status = 'forbidden';
          message = inhalt.werte.verbotenOffenerUnversiegelterEinbau;
          conditions.push(inhalt.werte.inZoneIiiA);
        } else {
          status = 'restricted';
          message = inhalt.werte.zulässigUnterStrengenHydrogeologischen;
          conditions.push(inhalt.werte.günstigeGrundwasserdeckschichtSickerstre);
          conditions.push(inhalt.werte.dieBodenartDerDeckschicht);
        }
      } else {
        status = 'forbidden';
        message = inhalt.werte.weitgehendUnzulässigNurNach;
        conditions.push(inhalt.werte.höherBelasteteKlassenSind);
      }
    }
    else {
      if (ebvMaterial === 'bm0' || ebvMaterial === 'bg0') {
        status = 'allowed';
        message = inhalt.werte.uneingeschränktZulässig;
        conditions.push(inhalt.werte.derWerkstoffBesitztProduktstatus);
      } else if (ebvMaterial === 'bm0_star' || ebvMaterial === 'rc1' || ebvMaterial === 'gs_f1') {
        if (ebvEinbauweise === 'offen') {
          if (ebvGrundwasser === 'deckschicht_nein') {
            status = 'restricted';
            message = inhalt.werte.zulässigUnterSchutzauflagen;
            conditions.push(inhalt.werte.ohneGünstigeDeckschichtGelten);
          } else {
            status = 'allowed';
            message = 'Zulässig.';
            conditions.push(inhalt.werte.günstigeGrundwasserdeckschichtSickerstre2);
          }
        } else {
          status = 'allowed';
          message = 'Zulässig.';
          conditions.push(inhalt.werte.einbauUnterDichtenPflaster);
        }
      } else if (ebvMaterial === 'bm_f1' || ebvMaterial === 'bg_f1') {
        if (ebvEinbauweise === 'offen') {
          status = 'restricted';
          message = inhalt.werte.eingeschränktZulässig;
          conditions.push(inhalt.werte.nurBeiGünstigerGrundwasserdeckschicht);
          conditions.push(inhalt.werte.nichtGestattetInSandigen);
        } else {
          status = 'allowed';
          message = 'Zulässig.';
          conditions.push(inhalt.werte.einsetzbarAlsFrostschutzOder);
        }
      } else if (ebvMaterial === 'rc2' || ebvMaterial === 'gs_f2') {
        if (ebvEinbauweise === 'offen') {
          status = 'forbidden';
          message = inhalt.werte.verbotenOffenerEinbauVon;
          conditions.push(inhalt.werte.rc2BenötigtZwingend);
        } else {
          status = 'restricted';
          message = inhalt.werte.zulässigMitBautechnischemSchutz;
          conditions.push(inhalt.werte.derEinbauMussMit);
          conditions.push(inhalt.werte.grundwasserdeckschichtUndEinbauweiseNach);
        }
      } else if (ebvMaterial === 'bm_f2') {
        if (ebvEinbauweise === 'offen') {
          status = 'forbidden';
          message = inhalt.werte.verbotenDieErhöhteSulfat;
        } else {
          status = 'restricted';
          message = inhalt.werte.zulässigBeiTechnischerVersiegelung;
          conditions.push(inhalt.werte.einbaufähigAlsTragschichtUnter);
          conditions.push(inhalt.werte.derHerstellerMussEin);
        }
      } else if (ebvMaterial === 'rc3' || ebvMaterial === 'bm_f3') {
        if (ebvEinbauweise === 'offen') {
          status = 'forbidden';
          message = inhalt.werte.strengstensVerboten2;
          conditions.push(inhalt.werte.dasMaterialWeistErhebliche);
        } else {
          status = 'restricted';
          message = inhalt.werte.eingeschränktZulässigUmschließung;
          conditions.push(inhalt.werte.ausschließlichInBautechnischVollständig);
          conditions.push(inhalt.werte.günstigeGrundwasserdeckschichtErforderli);
          conditions.push(inhalt.werte.ab250MGesamtvolumen);
        }
      }
    }

    return { status, message, conditions, anzeige };
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Trash2 className="text-shiraz" /><MdText text={inhalt.texte.abfälleAltlastenImBauwesen} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.umgangMitBauUnd} /></p>
        </div>

        {/* Tabs Navigation (AP 3.8: 7 Themengruppen, ggf. zweite Ebene) */}
        <ModuleTabs
          label={inhalt.werte.themenAbfälleUndAltlasten}
          tabs={gruppen}
          aktiv={aktiveGruppe.id}
          onWechsel={(id) => setActiveTab(gruppen.find(g => g.id === id)!.bereiche[0])}
          variante="kachel"
          className="[&>[role=tablist]]:p-4 [&>[role=tablist]]:bg-slate-50/50 dark:[&>[role=tablist]]:bg-slate-800/40 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:border [&>[role=tablist]]:border-home-grau/30 lg:[&>[role=tablist]]:grid-cols-4"
        >
        <div className="p-6">
          <UnterReiter tabs={unterReiter} aktiv={activeTab} onWechsel={setActiveTab} label={`Bereiche: ${aktiveGruppe.label}`}>
          
          {/* Schema (Wegweiser) */}
          {activeTab === 'schema' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.derAbfallAltlastenWegweiser} /></h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Die Entsorgungs-, Verwertungs- und Sanierungsprozesse im Bauwesen folgen strengen gesetzlichen Regelwerken. Dieses Schema bietet Ihnen eine schnelle Orientierungsmatrix. 
                  <strong><MdText text={inhalt.texte.klickenSieAufEine} /></strong>, um direkt in das entsprechende Detailmodul zu springen.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemaCards.map((card) => {
                  const CardIcon = card.icon;
                  return (
                    <div 
                      key={card.id}
                      onClick={() => setActiveTab(card.id)}
                      className={`p-5 rounded-2xl border ${card.borderColorClass} ${card.colorClass} transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${card.badgeColorClass}`}>
                            {card.category}
                          </span>
                          <CardIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        
                        <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-1.5">
                          {card.title}
                        </h4>

                        <div className="space-y-3.5 text-xs text-gray-700">
                          <div>
                            <span className={`block text-xs uppercase tracking-wider mb-0.5 ${card.labelColorClass}`}><MdText text={inhalt.texte.wannAnlassPhase} /></span>
                            <p className="text-gray-600 leading-relaxed font-medium">{card.wann}</p>
                          </div>
                          <div>
                            <span className={`block text-xs uppercase tracking-wider mb-0.5 ${card.labelColorClass}`}><MdText text={inhalt.texte.wasGegenstandRegelung} /></span>
                            <p className="text-gray-600 leading-relaxed font-medium">{card.was}</p>
                          </div>
                          <div>
                            <span className={`block text-xs uppercase tracking-wider mb-0.5 ${card.labelColorClass}`}><MdText text={inhalt.texte.wieVorgehenInstrument} /></span>
                            <p className="text-gray-600 leading-relaxed font-medium">{card.wie}</p>
                          </div>
                          <div>
                            <span className={`block text-xs uppercase tracking-wider mb-0.5 ${card.labelColorClass}`}><MdText text={inhalt.texte.wozuZielSchutzzweck} /></span>
                            <p className="text-gray-600 leading-relaxed font-medium">{card.wozu}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-home-grau/30 flex justify-end">
                        <span className="text-xs font-bold text-shiraz hover:underline flex items-center gap-1"><MdText text={inhalt.texte.direktZumThema} /><ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hierarchie */}
          {activeTab === 'hierarchie' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.kreislaufwirtschaftsgesetzKrwgGewabfv} /></h3>
              <p className="text-gray-700 font-normal"><MdText text={inhalt.texte.dasKrwgGibtEine} /></p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold border-b pb-2 text-slate-900"><MdText text={inhalt.texte.t5StufigeAbfallhierarchie} /></h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-slate-100 p-3 rounded-xl border border-home-grau/30">
                      <h4 className="font-bold text-slate-800 mb-1 text-sm"><MdText text={inhalt.texte.t1Vermeidung} /></h4>
                      <p className="text-xs text-slate-600"><MdText text={inhalt.texte.dieBesteMaßnahmeErreicht} /></p>
                    </div>
                    <div className="bg-slate-50/90 p-3 rounded-xl border border-home-grau/30">
                      <h4 className="font-bold text-slate-800 mb-1 text-sm"><MdText text={inhalt.texte.t2VorbereitungZurWiederverwendung} /></h4>
                      <p className="text-xs text-slate-600"><MdText text={inhalt.texte.bauteileStahlträgerZiegelOhne} /></p>
                    </div>
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-home-grau/30">
                      <h4 className="font-bold text-slate-800 mb-1 text-sm"><MdText text={inhalt.texte.t3RecyclingStofflicheVerwertung} /></h4>
                      <p className="text-xs text-slate-600"><MdText text={inhalt.texte.aufbereitungZBBetonabbruch} /></p>
                    </div>
                    <div className="bg-slate-50/50 p-3 rounded-xl border border-home-grau/30">
                      <h4 className="font-bold text-slate-800 mb-1 text-sm"><MdText text={inhalt.texte.t4SonstigeVerwertung} /></h4>
                      <p className="text-xs text-slate-600"><MdText text={inhalt.texte.meistEnergetischeVerwertungVerbrennung} /></p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-home-grau/30 text-slate-500">
                      <h4 className="font-bold text-slate-700 mb-1 text-sm"><MdText text={inhalt.texte.t5Beseitigung} /></h4>
                      <p className="text-xs text-slate-500"><MdText text={inhalt.texte.dauerhafteAblagerungDeponieVon} /></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold border-b pb-2 text-slate-900"><MdText text={inhalt.texte.getrenntsammelpflichtGewabfv} /></h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 h-[calc(100%-2.5rem)]">
                    <p className="text-sm text-slate-800 mb-3 font-normal"><MdText text={inhalt.texte.umStufe2Und} /></p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 font-medium">
                      <li>Glas</li>
                      <li>Kunststoff</li>
                      <li>Metalle</li>
                      <li>Holz</li>
                      <li>Dämmmaterial</li>
                      <li>Bitumengemische</li>
                      <li><MdText text={inhalt.texte.baustoffeAufGipsbasis} /></li>
                      <li>Beton</li>
                      <li>Ziegel</li>
                      <li><MdText text={inhalt.texte.fliesenZiegelUndKeramik} /></li>
                    </ul>
                    <p className="text-sm text-slate-800 mt-4 bg-white/60 p-2 rounded font-normal"><MdText text={inhalt.texte.ausnahmenNurWennDie} /></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AVV */}
          {activeTab === 'avv' && <AvvSchluessel />}

          {/* EBV */}
          {activeTab === 'ebv' && <EbvMantelverordnung ebvEinbauweise={ebvEinbauweise} ebvGrundwasser={ebvGrundwasser} ebvMaterial={ebvMaterial} ebvSchutzgebiet={ebvSchutzgebiet} ebvVolumen={ebvVolumen} evaluateEBV={evaluateEBV} setEbvEinbauweise={setEbvEinbauweise} setEbvGrundwasser={setEbvGrundwasser} setEbvMaterial={setEbvMaterial} setEbvSchutzgebiet={setEbvSchutzgebiet} setEbvVolumen={setEbvVolumen} />}

          {/* Altholz */}
          {activeTab === 'altholz' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Recycle className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.altholzverordnungAltholzv} /></h3>
              <p className="text-gray-700"><MdText text={inhalt.texte.dieAltholzverordnungAltholzvRegelt} /></p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-slate-800 mb-2"><MdText text={inhalt.texte.dieAltholzkategorien} /></h4>
                  <ul className="space-y-3 text-sm text-slate-700 font-semibold">
                    <li>
                      <strong className="text-slate-900"><MdText text={inhalt.texte.aINaturbelassenesHolz} /></strong><MdText text={inhalt.texte.nurMechanischBearbeitetKeine} /></li>
                    <li>
                      <strong className="text-slate-900"><MdText text={inhalt.texte.aIiVerleimtesGestrichenes} /></strong><MdText text={inhalt.texte.ohneHalogenorganischeVerbindungenIm} /></li>
                    <li>
                      <strong className="text-slate-900"><MdText text={inhalt.texte.aIiiHolzMit} /></strong><MdText text={inhalt.texte.mitPvcBeschichtungLackiert} /></li>
                    <li>
                      <strong className="text-shiraz"><MdText text={inhalt.texte.aIvSchadstoffbelastetesAltholz} /></strong><MdText text={inhalt.texte.mitHolzschutzmittelnBehandeltGilt} /></li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2"><MdText text={inhalt.texte.besonderheitenImAbbruch} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.pcbAltholzAb50} /></li>
                    <li><MdText text={inhalt.texte.vermischungsverbotAltholzDerKategorie} /></li>
                    <li><MdText text={inhalt.texte.beprobungWennDieHerkunft} /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Deponie */}
          {activeTab === 'deponie' && <Deponie activeBarrier={activeBarrier} depVInputValue={depVInputValue} depVSelectedParam={depVSelectedParam} deponieSection={deponieSection} selectedLayerIndex={selectedLayerIndex} setActiveBarrier={setActiveBarrier} setDepVInputValue={setDepVInputValue} setDepVSelectedParam={setDepVSelectedParam} setDeponieSection={setDeponieSection} setSelectedLayerIndex={setSelectedLayerIndex} />}

          {/* Altlasten */}
          {activeTab === 'altlasten' && <Altlasten bbodNutzungsart={bbodNutzungsart} setBbodNutzungsart={setBbodNutzungsart} />}

          {/* Rückbau */}
          {activeTab === 'rueckbau' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /><MdText text={inhalt.texte.selektiverRückbauVerwertungspraxis} /></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200">
                  <h4 className="font-bold text-indigo-800 mb-3"><MdText text={inhalt.texte.dieVorbereitungsphase} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-indigo-900">
                    <li><MdText text={inhalt.texte.gebäudeschadstoffkatasterDieVdiRichtlini} /></li>
                    <li><MdText text={inhalt.texte.schadstoffsanierungErstMüssenAsbest} /></li>
                    <li><MdText text={inhalt.texte.entkernungAusbauVonFenstern} /></li>
                  </ul>
                </div>
                <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200">
                  <h4 className="font-bold text-indigo-800 mb-3"><MdText text={inhalt.texte.derMineralischeRückbau} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-indigo-900">
                    <li><MdText text={inhalt.texte.zerkleinerungSortierungEinsatzVon} /></li>
                    <li><MdText text={inhalt.texte.aufbereitungsanlageBrecheranlagenBackenb} /></li>
                    <li><MdText text={inhalt.texte.siebungTrennungInNorm} /></li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h4 className="font-bold text-shiraz flex gap-2 items-center mb-3"><MdText text={inhalt.texte.vomBauschuttZumR} /></h4>
                <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.rezyklierteGesteinskörnungenKönnenNormge} /></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <h5 className="font-bold text-black mb-1"><MdText text={inhalt.texte.typ1Betonsplitt} /></h5>
                    <p><MdText text={inhalt.texte.mind90ReinerBeton} /></p>
                  </div>
                  <div>
                    <h5 className="font-bold text-black mb-1"><MdText text={inhalt.texte.typ2Bauwerksbruch} /></h5>
                    <p><MdText text={inhalt.texte.ziegelreicherBauschuttErheblichRestrikti} /></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nachweise (eANV) */}
          {activeTab === 'eanv' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-gray-700" /><MdText text={inhalt.texte.elektronischesAbfallnachweisverfahrenEan} /></h3>
              <p className="text-gray-700"><MdText text={inhalt.texte.dieNachweisverordnungNachwvRegelt} /></p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                  <h4 className="font-bold text-shiraz mb-3"><MdText text={inhalt.texte.dieWichtigstenAkteure} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.erzeugerDerBauherrBzw} /></li>
                    <li><MdText text={inhalt.texte.befördererDasTransportunternehmenLogisti} /></li>
                    <li><MdText text={inhalt.texte.entsorgerDieDeponieOder} /></li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                  <h4 className="font-bold text-shiraz mb-3">Dokumenten-Arten</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.entsorgungsnachweisEnEineVorabprüfung} /></li>
                    <li><MdText text={inhalt.texte.begleitscheinBgsBegleitetDen} /></li>
                    <li><MdText text={inhalt.texte.übernahmescheinÜnsWirdBeim} /></li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-gray-400 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-gray-800 mb-1"><MdText text={inhalt.texte.registerpflicht49Krwg} /></h4>
                <p className="text-sm text-gray-700"><MdText text={inhalt.texte.sowohlErzeugerBefördererAls} /></p>
              </div>
            </div>
          )}

          {/* Probenahme LAGA PN 98 */}
          {activeTab === 'pn98' && <LagaPn98 pnGrainSize={pnGrainSize} pnMaterialState={pnMaterialState} pnVolume={pnVolume} setPnGrainSize={setPnGrainSize} setPnMaterialState={setPnMaterialState} setPnVolume={setPnVolume} />}

          {/* Checklisten */}
          {activeTab === 'checklisten' && <Checklisten activeChecklistSubTab={activeChecklistSubTab} setActiveChecklistSubTab={setActiveChecklistSubTab} />}
          </UnterReiter>
        </div>
        </ModuleTabs>
      </div>
    
      {/* Central ModuleFooter rendered dynamically based on activeTab */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1DeponieklasseFür}
        zielGleichung="DK = \min\{k \mid c_j \le Z_{j,k} \;\forall j\}"
        schritte={inhalt.daten["Abfaelle.schritte"]}
        ergebnisHinweis={inhalt.werte.maßgebendIstDerUngünstigste}
        normQuelle={inhalt.werte.depvAnhang3Nr}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2AnzeigepflichtNach}
        zielGleichung="V_{ges} = A \cdot d \ge 250\,\text{m}^3 \Rightarrow \text{Voranzeige}"
        schritte={inhalt.daten["Abfaelle.schritte_2"]}
        ergebnisHinweis={inhalt.werte.unabhängigVonDerMenge}
        normQuelle={inhalt.werte.ersatzbaustoffv192022}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="abfaelle" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap9} 
        wikipedia={
          activeTab === 'altholz'
            ? [{ title: 'Altholzverordnung', url: 'https://de.wikipedia.org/wiki/Altholzverordnung' }]
            : activeTab === 'hierarchie'
            ? [{ title: 'Abfallhierarchie', url: 'https://de.wikipedia.org/wiki/Abfallhierarchie' }]
            : activeTab === 'avv'
            ? [{ title: 'Abfallverzeichnis-Verordnung', url: 'https://de.wikipedia.org/wiki/Abfallverzeichnis-Verordnung' }]
            : activeTab === 'ebv'
            ? [{ title: 'Ersatzbaustoffverordnung', url: 'https://de.wikipedia.org/wiki/Ersatzbaustoffverordnung' }]
            : activeTab === 'deponie'
            ? [{ title: 'Deponie', url: 'https://de.wikipedia.org/wiki/Deponie' }]
            : activeTab === 'altlasten'
            ? [{ title: 'Altlast', url: 'https://de.wikipedia.org/wiki/Altlast' }]
            : activeTab === 'rueckbau'
            ? [{ title: 'Rückbau', url: 'https://de.wikipedia.org/wiki/Rückbau' }]
            : activeTab === 'eanv'
            ? [{ title: inhalt.werte.elektronischesAbfallnachweisverfahren, url: 'https://de.wikipedia.org/wiki/Elektronisches_Abfallnachweisverfahren' }]
            : activeTab === 'pn98'
            ? [{ title: 'Probenahme', url: 'https://de.wikipedia.org/wiki/Probenahme' }]
            : [
                { title: 'Kreislaufwirtschaftsgesetz', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaftsgesetz' },
                { title: 'Bundes-Bodenschutzgesetz', url: 'https://de.wikipedia.org/wiki/Bundes-Bodenschutzgesetz' }
              ]
        }
        regelwerke={inhalt.daten["Abfaelle.regelwerke"]}
        literatur={inhalt.daten["Abfaelle.literatur"]}
        formeln={inhalt.daten["Abfaelle.formeln"]}
      />
    </div>
  );
}

/** Zweite Reiterebene (AP 3.8): nur wenn die aktive Gruppe mehrere Bereiche bündelt. */
function UnterReiter({ tabs, aktiv, onWechsel, label, children }: {
  tabs: { id: AbfallTab; label: string; icon: LucideIcon }[] | null;
  aktiv: AbfallTab;
  onWechsel: (id: AbfallTab) => void;
  label: string;
  children: React.ReactNode;
}) {
  if (!tabs) return <>{children}</>;
  return (
    <ModuleTabs label={label} tabs={tabs} aktiv={aktiv} onWechsel={onWechsel} className="[&>[role=tablist]]:mb-6 [&>[role=tablist]]:pb-4 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">
      {children}
    </ModuleTabs>
  );
}
