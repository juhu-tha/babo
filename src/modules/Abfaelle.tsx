import React, { useState } from 'react';
import { Trash2, Recycle, AlertTriangle, ShieldCheck, Layers, List, Database, LucideIcon, Search, FileSignature, BookOpen, ArrowRight, HelpCircle, Calendar, Check, X, AlertCircle, Scale, Droplets, Leaf, ClipboardList } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { formatDeZahl } from '@/src/utils/numberFormat';

type AbfallTab = 'schema' | 'hierarchie' | 'avv' | 'ebv' | 'deponie' | 'altlasten' | 'rueckbau' | 'eanv' | 'pn98' | 'altholz' | 'checklisten';

interface SchemaCard {
  id: AbfallTab;
  title: string;
  category: string;
  colorClass: string;
  borderColorClass: string;
  badgeColorClass: string;
  labelColorClass: string;
  icon: LucideIcon;
  wann: string;
  was: string;
  wie: string;
  wozu: string;
}

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
    { id: 'schema', label: 'Wegweiser (Wann, Was, Wie, Wozu?)', icon: BookOpen },
    { id: 'hierarchie', label: 'KrWG & Hierarchie', icon: Layers },
    { id: 'avv', label: 'AVV & Abfallarten', icon: List },
    { id: 'ebv', label: 'ErsatzbaustoffV (EBV)', icon: Recycle },
    { id: 'deponie', label: 'Deponie (DepV)', icon: Database },
    { id: 'altholz', label: 'Altholzverordnung', icon: Recycle },
    { id: 'altlasten', label: 'Altlasten (BBodSchG)', icon: AlertTriangle },
    { id: 'rueckbau', label: 'Rückbau & Verwertung', icon: ShieldCheck },
    { id: 'eanv', label: 'Nachweise (eANV)', icon: FileSignature },
    { id: 'pn98', label: 'Probenahme (PN 98)', icon: Search },
    { id: 'checklisten', label: 'Praxis-Checklisten', icon: ClipboardList }
  ];
  const schemaCards: SchemaCard[] = [
    {
      id: 'hierarchie',
      title: 'KrWG & Abfallhierarchie',
      category: 'Kreislaufwirtschaft',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: Layers,
      wann: 'Ganz am Anfang (Projektplanung, Abbruchantrag, Abfallkonzeption).',
      was: 'Grundsätzlicher Umgang mit allen anfallenden Bauabfällen und Getrennthaltungspflichten.',
      wie: 'Einhaltung der 5-stufigen Priorisierungskette & Trennung von 10 Kernfraktionen auf der Baustelle.',
      wozu: 'Maximierung der stofflichen Wiederverwertung, Abfallbeseitigung auf ein Minimum reduzieren.'
    },
    {
      id: 'avv',
      title: 'AVV & Abfallarten',
      category: 'Klassifizierung',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: List,
      wann: 'Vor und während der Einstufung und Deklaration der Abfälle für den Transport.',
      was: 'Exakte europaweit gültige Abfallklassifizierung (6-stelliger Abfallschlüssel).',
      wie: 'Zuordnung nach Herkunft/Art sowie Einstufung von gefährlichen Abfällen (Spiegel-Einträge mit *).',
      wozu: 'Eindeutige und rechtssichere rechtliche Einstufung für Transport, Abrechnung und Verwertbarkeit.'
    },
    {
      id: 'ebv',
      title: 'Ersatzbaustoffverordnung (EBV)',
      category: 'Verwertung Mineralik',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: Recycle,
      wann: 'Beim Wiedereinbau mineralischer Baustoffe (z.B. Recycling-Frostschutzschichten im Wegebau).',
      was: 'Recycling-Baustoffe (RC), Bodenmaterial (BM) sowie industrielle Schlacken und Aschen.',
      wie: 'Einordnung in Güteklassen (z.B. BM-0, RC-1) und Prüfen lokaler Rahmenbedingungen (Einbaumatrizen).',
      wozu: 'Schutz des Bodens und des Grundwassers bei gleichzeitiger Förderung nachhaltiger Recyclingbaustoffe.'
    },
    {
      id: 'deponie',
      title: 'Deponieklassen (DepV)',
      category: 'Beseitigung',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: Database,
      wann: 'Erst nachweislich nach Ausschluss aller Verwertungsmöglichkeiten (letzte Instanz).',
      was: 'Endgültig zu beseitigende mineralische und gefährliche Restabfälle.',
      wie: 'Zuordnung und Eluattests für Deponieklassen (DK 0 für unbedenklich bis DK IV unter Tage für extrem toxisch).',
      wozu: 'Dauerhafter, sicherer und kontrollierter Ausschluss schädlicher Stoffe aus der Ökosphäre.'
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
      wann: 'Bei Entkernung, Abbruch und Sanierung von Dachstühlen, Einbauten oder Zäunen.',
      was: 'Alle Bauhölzer und verleimten/beschichteten Plattenwerkstoffe.',
      wie: 'Sortierung in vier Schadstoffklassen (A I unbelastet bis A IV gefährlicher Abfall mit Holzschutzmitteln).',
      wozu: 'Schutz der Kreislaufprodukte vor Schwermetallen und organischen Schadstoffen (z.B. PCP/Lindan).'
    },
    {
      id: 'altlasten',
      title: 'Altlasten & Bodenschutz',
      category: 'Boden/Sanierung',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: AlertTriangle,
      wann: 'Beim Bauen im Bestand, Grundstückskauf oder Tiefbau auf ehemals industriell genutzten Flächen.',
      was: 'Bodenverunreinigungen und Altablagerungen mit potenzieller Umweltgefahr.',
      wie: 'Stufenweise Erkundung (Historisch -> Orientierend -> Detailanalyse -> Sanierungsplanung).',
      wozu: 'Schutz der Wirkungspfade (Mensch, Nutzpflanze, Grundwasser) und Sanierung geschädigter Böden.'
    },
    {
      id: 'rueckbau',
      title: 'Rückbau & Verwertung',
      category: 'Rückbaupraxis',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: ShieldCheck,
      wann: 'Vor dem physischen Gebäudeabbruch (Planungsphase) und während der Entkernung.',
      was: 'Bestandsgebäude mitsamt aller Baustoffe und potenzieller Schadstoffquellen.',
      wie: 'Schadstoffkataster (VDI 6202) erstellen, selektiv entkernen (Fenster, Haustechnik) und mineralischen Abbruch brechen/sieben.',
      wozu: 'Erzielung sortenreiner Abbruchfraktionen für die Produktion hochwertiger Kreislaufstoffe (z.B. R-Beton).'
    },
    {
      id: 'eanv',
      title: 'Nachweise (eANV)',
      category: 'Recht & Nachweise',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: FileSignature,
      wann: 'Vor und während des Transports gefährlicher Abfälle (Sonderabfall ab 2 Tonnen pro Jahr).',
      was: 'Gesetzlich überwachungspflichtige Abfälle (z.B. Asbest, teerhaltiger Asphalt).',
      wie: 'Vollelektronisches Verfahren: Signierung über Signaturkarten (Begleitschein, Entsorgungsnachweis).',
      wozu: 'Lückenlose, fälschungssichere und staatlich kontrollierte Überwachung des Sonderabfall-Weges.'
    },
    {
      id: 'pn98',
      title: 'Probenahme (PN 98)',
      category: 'Analytik & Probenahme',
      colorClass: 'bg-slate-50/40 hover:bg-slate-50/80 hover:border-home-grau/30',
      borderColorClass: 'border-home-grau/30',
      badgeColorClass: 'bg-slate-100 text-slate-800 border border-home-grau/30',
      labelColorClass: 'text-shiraz font-semibold',
      icon: Search,
      wann: 'Vor der Entsorgungs-Deklaration zur Absicherung der Einstufung.',
      was: 'Haufwerke (Bauschutthalden) oder unberührter anstehender Boden in Baugruben.',
      wie: 'Repräsentative Beprobung nach verbindlichem LAGA PN 98-Schema durch sachkundige Gutachter.',
      wozu: 'Chemisch rechtssichere Einstufung, wodurch Falschdeklarationen und Abweisungen an Deponietoren verhindert werden.'
    },
    {
      id: 'checklisten',
      title: 'Digitale Checklisten',
      category: 'Praxis-Tools',
      colorClass: 'bg-shiraz/5 hover:bg-shiraz/10 hover:border-shiraz/50',
      borderColorClass: 'border-shiraz/20',
      badgeColorClass: 'bg-shiraz/10 text-shiraz border border-shiraz/25',
      labelColorClass: 'text-shiraz font-semibold',
      icon: ClipboardList,
      wann: 'In allen Projektphasen zur lückenlosen Dokumentation und Qualitätssicherung.',
      was: 'Kompakte Praxis-Checklisten für Einstufung, Wiedereinbau, Rückbau, Deponierung, Probenahme und Gefahrstoffe.',
      wie: 'Stufenweise Abarbeitung und Prüfung wichtiger Meilensteine und rechtlicher Vorgaben im Ingenieursalltag.',
      wozu: 'Vermeidung von Fehlern, Senkung der Entsorgungs- und Haftungsrisiken sowie Gewährleistung maximaler Rechtssicherheit.'
    }
  ];

  const evaluateEBV = () => {
    let status: 'allowed' | 'restricted' | 'forbidden' = 'allowed';
    let message = '';
    const conditions: string[] = [];
    let anzeige = 'Keine Anzeigepflicht nach § 22 EBV (Bagatellbereich oder unbelastetes BM-0 Material).';

    if (ebvVolumen === 'ab_250') {
      if (ebvMaterial !== 'bm0' && ebvMaterial !== 'bg0') {
        anzeige = '⚠️ MELDUNGSPFLICHTIG: Überschreitung der 250 m³ Bagatellgrenze nach § 22 EBV! Eine schriftliche Voranzeige mind. 4 Wochen vor Baubeginn sowie eine Abschlussanzeige binnen 2 Wochen nach Fertigstellung sind bei der zuständigen Unteren Umweltschutzbehörde zwingend einzureichen. Eintragung in das Ersatzbaustoffkataster erfolgt behördenseitig.';
      } else {
        anzeige = 'Meldungsfrei, da es sich um unbelastetes Primärbodenmaterial (BM-0) handelt.';
      }
    }

    if (ebvSchutzgebiet === 'wsg_1_2') {
      if (ebvMaterial === 'bm0' || ebvMaterial === 'bg0') {
        status = 'restricted';
        message = 'Einbau stark eingeschränkt.';
        conditions.push('Auch unbelastetes Bodenmaterial (BM-0) darf in Wasserschutzgebieten der Zone I/II nur unter engsten materiellen Ausnahmen und behördlichen Einzelerlaubnissen der höheren Wasserbehörde eingebaut werden.');
      } else {
        status = 'forbidden';
        message = 'STRENGSTENS VERBOTEN!';
        conditions.push('In Wasserschutzgebieten der Zonen I und II ist der Einbau jeglicher mineralischer Ersatzbaustoffe (MEB) abgesehen von unbedenklichem BM-0 gesetzlich untersagt (§ 21 EBV).');
      }
    }
    else if (ebvSchutzgebiet === 'wsg_3') {
      if (ebvMaterial === 'bm0' || ebvMaterial === 'bg0') {
        status = 'allowed';
        message = 'Zulässig.';
        conditions.push('Einbau in Bodenanlagen unbedenklich (BM-0).');
      } else if (ebvMaterial === 'bm0_star' || ebvMaterial === 'rc1' || ebvMaterial === 'gs_f1') {
        if (ebvEinbauweise === 'offen') {
          status = 'forbidden';
          message = 'VERBOTEN: Offener unversiegelter Einbau in WSG-Zonen untersagt.';
          conditions.push('Zur Trinkwasserreinhaltung beabsichtigt der Gesetzgeber hier dichte, versiegelte Tragschichten.');
        } else {
          status = 'restricted';
          message = 'Zulässig unter strengen hydrogeologischen Auflagen.';
          conditions.push('Der Abstand zum höchsten zu erwartenden Grundwasserstand muss mindestens 1,5 Meter betragen.');
          conditions.push('Es muss eine lückenlose, natürliche Grundwasserdeckschicht vorhanden sein (wie Ton, Lehm).');
        }
      } else {
        status = 'forbidden';
        message = 'STRENGSTENS VERBOTEN!';
        conditions.push('Höher belastete Ersatzbaustoffe (> RC-1 bzw. > BM-0*) dürfen in keinem Fall in Wassersicherheitszonen verbaut werden (Schutzbereichsverbot).');
      }
    }
    else {
      if (ebvMaterial === 'bm0' || ebvMaterial === 'bg0') {
        status = 'allowed';
        message = 'Uneingeschränkt zulässig.';
        conditions.push('Der Werkstoff besitzt Produktstatus und ist ohne hydrogeologische/wasserrechtliche Restriktionen einbaubar.');
      } else if (ebvMaterial === 'bm0_star' || ebvMaterial === 'rc1' || ebvMaterial === 'gs_f1') {
        if (ebvEinbauweise === 'offen') {
          if (ebvGrundwasser === 'deckschicht_nein') {
            status = 'restricted';
            message = 'Zulässig unter Schutzauflagen.';
            conditions.push('Der freie Sickerweg muss einen Mindestgrundwasserabstand von 1,5 Metern einhalten, da keine bindige Deckschicht vorliegt.');
          } else {
            status = 'allowed';
            message = 'Zulässig.';
            conditions.push('Die natürliche Deckschicht schützt den hydrogeologischen Pfad. Einbauhöhe über Grundwasser >= 1,0 m ausreichend.');
          }
        } else {
          status = 'allowed';
          message = 'Zulässig.';
          conditions.push('Einbau unter dichten Pflaster-, Asphalt- oder Betondecken unkritisch.');
        }
      } else if (ebvMaterial === 'bm_f1' || ebvMaterial === 'bg_f1') {
        if (ebvEinbauweise === 'offen') {
          status = 'restricted';
          message = 'Eingeschränkt zulässig.';
          conditions.push('Nur bei gesichertem Grundwasserabstand > 1,5 m zulässig.');
          conditions.push('Nicht gestattet in sandigen Böden des Untergrundes ohne dämpfende Feinkornbarriere (Lehm/Schluff).');
        } else {
          status = 'allowed';
          message = 'Zulässig.';
          conditions.push('Einsetzbar als Frostschutz- oder Kiestragschicht im unkritischen Tief- und Straßenbau.');
        }
      } else if (ebvMaterial === 'rc2' || ebvMaterial === 'gs_f2') {
        if (ebvEinbauweise === 'offen') {
          status = 'forbidden';
          message = 'VERBOTEN: Offener Einbau von RC-2 Material ist aufgrund der Schadstoffauswaschung untersagt.';
          conditions.push('RC-2 benötigt zwingend eine technische Absperrung gegen Niederschlagswasser.');
        } else {
          status = 'restricted';
          message = 'Zulässig mit bautechnischem Schutz.';
          conditions.push('Der Einbau muss mit einer wasserundurchlässigen Deckschicht (Asphalt, Beton, dichte Bodenplatte) vollflächig überdeckt werden.');
          conditions.push('Der Grundwasserabstand muss mindestens 1,0 m betragen.');
        }
      } else if (ebvMaterial === 'bm_f2' || ebvMaterial === 'hmva1') {
        if (ebvEinbauweise === 'offen') {
          status = 'forbidden';
          message = 'VERBOTEN: Die erhöhte Sulfat- und Schwermetallbelastung verunmöglicht den offenen Einbau.';
        } else {
          status = 'restricted';
          message = 'Zulässig bei technischer Versiegelung.';
          conditions.push('Einbaufähig als Tragschicht unter der Fahrbahndecke im höherfrequentierten Straßenbau.');
          conditions.push('Der Hersteller muss ein akkreditiertes Gütesiegel (z.B. QUBA) nachweisen.');
        }
      } else if (ebvMaterial === 'rc3' || ebvMaterial === 'bm_f3' || ebvMaterial === 'hmva2') {
        if (ebvEinbauweise === 'offen') {
          status = 'forbidden';
          message = 'STRENGSTENS VERBOTEN!';
          conditions.push('Das Material weist erhebliche Belastungswerte im Eluat auf. Ein Sickerwasserkontakt mit ungeschütztem Boden ist gesetzlich verboten.');
        } else {
          status = 'restricted';
          message = 'Eingeschränkt zulässig (Umschließung).';
          conditions.push('Ausschließlich in bautehnisch vollständig umschlossenen Erdbaukörpern (z.B. gekapselt mit Bentonit-Dichtungsbahnen) erlaubt.');
          conditions.push('Grundwasserabstand von mindestens 1,5 m muss zwingend gewahrt bleiben.');
          conditions.push('Das Material ist unabhängig von der Kubatur im Kataster der zuständigen Behörde zu registrieren.');
        }
      }
    }

    return { status, message, conditions, anzeige };
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Trash2 className="text-shiraz" /> Abfälle & Altlasten im Bauwesen
          </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Umgang mit Bau- und Abbruchabfällen, Abfallarten, Deponieklassen und Recyclingpotenziale.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-home-grau/30">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center h-full cursor-pointer ${
                  isActive 
                    ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm' 
                    : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-shiraz' : 'text-slate-500'} />
                <span className="text-xs font-bold leading-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          
          {/* Schema (Wegweiser) */}
          {activeTab === 'schema' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-shiraz" />
                  Der Abfall- & Altlasten-Wegweiser (Wann, Was, Wie, Wozu?)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Die Entsorgungs-, Verwertungs- und Sanierungsprozesse im Bauwesen folgen strengen gesetzlichen Regelwerken. Dieses Schema bietet Ihnen eine schnelle Orientierungsmatrix. 
                  <strong> Klicken Sie auf eine Karte</strong>, um direkt in das entsprechende Detailmodul zu springen.
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
                            <span className={`block text-xs uppercase tracking-wider mb-0.5 ${card.labelColorClass}`}>WANN? (Anlass & Phase)</span>
                            <p className="text-gray-600 leading-relaxed font-medium">{card.wann}</p>
                          </div>
                          <div>
                            <span className={`block text-xs uppercase tracking-wider mb-0.5 ${card.labelColorClass}`}>WAS? (Gegenstand & Regelung)</span>
                            <p className="text-gray-600 leading-relaxed font-medium">{card.was}</p>
                          </div>
                          <div>
                            <span className={`block text-xs uppercase tracking-wider mb-0.5 ${card.labelColorClass}`}>WIE? (Vorgehen & Instrument)</span>
                            <p className="text-gray-600 leading-relaxed font-medium">{card.wie}</p>
                          </div>
                          <div>
                            <span className={`block text-xs uppercase tracking-wider mb-0.5 ${card.labelColorClass}`}>WOZU? (Ziel & Schutzzweck)</span>
                            <p className="text-gray-600 leading-relaxed font-medium">{card.wozu}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-home-grau/30 flex justify-end">
                        <span className="text-xs font-bold text-shiraz hover:underline flex items-center gap-1">
                          Direkt zum Thema <ArrowRight size={14} />
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
                <Layers className="w-5 h-5 text-shiraz" />
                Kreislaufwirtschaftsgesetz (KrWG) & GewAbfV
              </h3>
              <p className="text-gray-700 font-normal">
                Das KrWG gibt eine klare 5-stufige Prioritätenfolge für den Umgang mit Abfällen vor, um Ressourcen zu schonen und die Umweltbelastung zu minimieren. Die <strong>Gewerbeabfallverordnung (GewAbfV)</strong> konkretisiert dies für die Baupraxis durch strenge Getrenntsammelpflichten.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold border-b pb-2 text-slate-900">5-stufige Abfallhierarchie</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-slate-100 p-3 rounded-xl border border-home-grau/30">
                      <h4 className="font-bold text-slate-800 mb-1 text-sm">1. Vermeidung</h4>
                      <p className="text-xs text-slate-600">Die beste Maßnahme. Erreicht durch ressourcenschonende Planung, Erhalt von Bestandsgebäuden.</p>
                    </div>
                    <div className="bg-slate-50/90 p-3 rounded-xl border border-home-grau/30">
                      <h4 className="font-bold text-slate-800 mb-1 text-sm">2. Vorbereitung zur Wiederverwendung</h4>
                      <p className="text-xs text-slate-600">Bauteile (Stahlträger, Ziegel) ohne große Vorbehandlung für denselben Zweck wieder einsetzen.</p>
                    </div>
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-home-grau/30">
                      <h4 className="font-bold text-slate-800 mb-1 text-sm">3. Recycling (Stoffliche Verwertung)</h4>
                      <p className="text-xs text-slate-600">Aufbereitung (z.B. Betonabbruch zu RC-Körnung) zu neuen Baustoffen.</p>
                    </div>
                    <div className="bg-slate-50/50 p-3 rounded-xl border border-home-grau/30">
                      <h4 className="font-bold text-slate-800 mb-1 text-sm">4. Sonstige Verwertung</h4>
                      <p className="text-xs text-slate-600">Meist energetische Verwertung (Verbrennung, z.B. Altholz).</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-home-grau/30 text-slate-500">
                      <h4 className="font-bold text-slate-700 mb-1 text-sm">5. Beseitigung</h4>
                      <p className="text-xs text-slate-500">Dauerhafte Ablagerung (Deponie) von nicht verwertbaren Abfällen.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold border-b pb-2 text-slate-900">Getrenntsammelpflicht (GewAbfV)</h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 h-[calc(100%-2.5rem)]">
                    <p className="text-sm text-slate-800 mb-3 font-normal">
                      Um Stufe 2 und 3 der Hierarchie zu ermöglichen, fordert die <strong>Gewerbeabfallverordnung (§ 8 GewAbfV)</strong>, dass Bau- und Abbruchabfälle bereits auf der Baustelle <strong>getrennt erfasst</strong> werden (Pflicht zur Fraktionierung).
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 font-medium">
                      <li>Glas</li>
                      <li>Kunststoff</li>
                      <li>Metalle</li>
                      <li>Holz</li>
                      <li>Dämmmaterial</li>
                      <li>Bitumengemische</li>
                      <li>Baustoffe auf Gipsbasis</li>
                      <li>Beton</li>
                      <li>Ziegel</li>
                      <li>Fliesen, Ziegel und Keramik</li>
                    </ul>
                    <p className="text-sm text-slate-800 mt-4 bg-white/60 p-2 rounded font-normal">
                      <strong>Ausnahmen:</strong> Nur wenn die getrennte Sammlung technisch nicht möglich (z.B. extreme Platznot auf Innenstadt-Baustelle) oder wirtschaftlich nicht zumutbar ist, darf im Ausnahmefall ein <em>Baustellenabfallgemisch</em> erzeugt werden. Dies muss aber streng dokumentiert und einer Vorbehandlungsanlage (Sortieranlage) zugeführt werden.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AVV */}
          {activeTab === 'avv' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <List className="w-5 h-5 text-emerald-600" />
                Abfallarten nach AVV (Kapitel 17)
              </h3>
              <p className="text-gray-700">
                Die Abfallverzeichnis-Verordnung (AVV) klassifiziert Abfälle europaweit einheitlich mit einem 6-stelligen Abfallschlüssel. Bau- und Abbruchabfälle finden sich in <strong>Kapitel 17</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Mineralische Abfälle (17 01)</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Beton (17 01 01):</strong> Sehr gut recycelbar (RC-Körnung).</li>
                    <li><strong>Ziegel (17 01 02):</strong> Recycelbar, oft Einsatz im Erdbau oder als Vegetationssubstrat.</li>
                    <li><strong>Fliesen, Ziegel und Keramik (17 01 03):</strong> Ähnlich wie Ziegel.</li>
                    <li><strong>Gemische (17 01 07):</strong> Bauschuttgemische, aufwendiger zu recyceln als sortenreine Fraktionen.</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Holz, Glas und Kunststoff (17 02)</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Holz (17 02 01):</strong> Einteilung in Altholzkategorien (A I bis A IV). Unbehandelt (A I) ist stofflich verwertbar, behandelt (A IV) muss thermisch verwertet werden.</li>
                    <li><strong>Glas (17 02 02):</strong> Flachglas kann gut recycelt werden, wenn es sortenrein vorliegt.</li>
                    <li><strong>Kunststoff (17 02 03):</strong> Z.B. PVC-Fensterrahmen, oft werkstofflich recycelbar.</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Metalle (17 04)</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Kupfer, Bronze, Messing (17 04 01):</strong> Sehr hoher Schrottwert.</li>
                    <li><strong>Aluminium (17 04 02):</strong> Hoher Wert, energiesparendes Recycling.</li>
                    <li><strong>Eisen und Stahl (17 04 05):</strong> Bewehrungsstahl, Träger. Fast 100% Recyclingquote.</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz">Weitere wichtige Gruppen</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Bitumengemische (17 03):</strong> Strikte Trennung von teerhaltig (PAK-belastet, gefährlich) und rein bitumenhaltig (recycelbar).</li>
                    <li><strong>Boden und Steine (17 05):</strong> Größter Massenstrom. Unbelastet (17 05 04) oft zur Verfüllung genutzt.</li>
                    <li><strong>Dämmmaterial (17 06):</strong> Oft gefährlich (z.B. Asbest, alte Mineralwolle).</li>
                  </ul>
                </div>
              </div>

              {/* Spiegeleinträge */}
              <div className="mt-6 bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-shiraz" /> Spiegeleinträge (Gefährliche vs. Nicht gefährliche Abfälle)
                </h4>
                <p className="text-sm text-slate-600 mb-3">
                  Viele Abfallarten in der AVV treten als sogenannte <strong>Spiegeleinträge</strong> auf. Das bedeutet, es gibt für dieselbe Abfallart zwei Einträge: einen für die gefährliche Variante (mit Sternchen <strong>*</strong>) und einen für die nicht gefährliche Variante. Die Einstufung erfolgt anhand von Laboranalysen (Grenzwerte).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border border-home-grau/30">
                    <div className="font-bold text-shiraz mb-1">Beispiel: Gemischte Bau- und Abbruchabfälle</div>
                    <ul className="space-y-1">
                      <li><span className="font-mono font-bold">17 09 03*</span>: ... die gefährliche Stoffe enthalten.</li>
                      <li><span className="font-mono font-bold">17 09 04</span>: ... mit Ausnahme derjenigen, die unter 17 09 01, 17 09 02 und 17 09 03 fallen.</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded border border-home-grau/30">
                    <div className="font-bold text-shiraz mb-1">Beispiel: Boden und Steine</div>
                    <ul className="space-y-1">
                      <li><span className="font-mono font-bold">17 05 03*</span>: ... die gefährliche Stoffe enthalten.</li>
                      <li><span className="font-mono font-bold">17 05 04</span>: ... mit Ausnahme derjenigen, die unter 17 05 03 fallen.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Checkliste: Abfallrechtliche Einstufung */}
              <div className="mt-8 bg-slate-50/50 p-6 rounded-xl border border-home-grau/30 shadow-sm">
                <h4 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-shiraz" /> Checkliste: Korrekte abfallrechtliche Einstufung von Baustellenabfällen
                </h4>
                <p className="text-xs text-slate-600 mb-6">
                  Dieser systematische Leitfaden unterstützt Bauleiter und Umweltbeauftragte bei der rechtskonformen und haftungssicheren Klassifizierung anfallender Abfallströme auf der Baustelle gemäß KrWG, GewAbfV und AVV.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                      1
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                        Getrennthaltungspflicht prüfen (§ 8 GewAbfV)
                      </h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Klären Sie vorab, ob die Abfallfraktionen (Holz, Beton, Ziegel, Metalle, Glas, Kunststoffe, Bitumengemische) getrennt gesammelt werden können. Bei Abweichungen ist eine schriftliche Dokumentation der technischen Unmöglichkeit oder wirtschaftlichen Unzumutbarkeit zu erstellen (§ 8 Abs. 3 GewAbfV).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                      2
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                        Erstzuordnung nach AVV Kapitel 17 vornehmen
                      </h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Ordnen Sie den Abfall anhand seines Entstehungsorts und seiner Materialart einem 6-stelligen Abfallschlüssel im Kapitel 17 (z.B. <span className="font-mono bg-slate-50 border px-1 rounded font-bold text-slate-800">17 01 01</span> für Beton oder <span className="font-mono bg-slate-50 border px-1 rounded font-bold text-slate-800">17 05 04</span> für Boden/Steine) zu.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                      3
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                        Vorhandensein von Gefahrstoffen prüfen
                      </h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Prüfe, ob Hinweise auf historische Schadstoffe vorliegen (z.B. Asbest, teerhaltiger Gussasphalt, PCB-haltige Fugendichtstoffe, Holzschutzmittelhaltiges Altholz). Ziehe hierzu Schadstoffgutachten, Bestandspläne und die historische Nutzung des Bauwerks heran.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                      4
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                        Spiegeleinträge & Analyseanforderung identifizieren
                      </h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Wenn die Abfallart ein "Spiegeleintrag" ist (z.B. <span className="font-mono bg-slate-50 border px-1 rounded font-bold text-slate-800">17 05 03* / 17 05 04</span> oder <span className="font-mono bg-slate-50 border px-1 rounded font-bold text-slate-800">17 09 03* / 17 09 04</span>), veranlassen Sie rechtzeitig eine repräsentative Probenahme (z.B. nach LAGA PN 98) sowie Feststoff- und Eluat-Analysen im Fachlabor.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                      5
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                        Abfallschlüssel final festlegen & deklarieren
                      </h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Lege basierend auf den Analyseergebnissen und Grenzwerten den finalen Abfallschlüssel fest. Handelt es sich um gefährlichen Abfall (gekennzeichnet mit einem Sternchen *), greift das elektronische Abfallnachweisverfahren (eANV) mit Erzeugernummer und Entsorgungsnachweis.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-white rounded-lg border border-home-grau/30">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs ring-4 ring-slate-50">
                      6
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                        Transport und Übergabe dokumentieren
                      </h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Übergeben Sie den Abfall nur an zertifizierte Entsorgungsfachbetriebe. Archivieren Sie sämtliche Wiegescheine, Begleitscheine, Übernahmescheine und Entsorgungsverträge mindestens 5 Jahre lang im Abfallregister zur Vorlage bei Aufsichtsbehörden.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EBV */}
          {activeTab === 'ebv' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="border-b border-home-grau/30 pb-4">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Recycle className="w-7 h-7 text-teal-600" />
                  Ersatzbaustoffverordnung (EBV)
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Die seit dem <strong>1. August 2023</strong> bundeseinheitlich geltende Verordnung (Teil der Mantelverordnung für Ersatzbaustoffe und Bodenschutz) regelt die Herstellung, Güteüberwachung und den Einbau von mineralischen Ersatzbaustoffen (MEB).
                </p>
              </div>

              {/* Systemwechsel Banner */}
              <div className="bg-slate-100 hover:bg-slate-100/90 transition-all p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Scale className="w-5 h-5 text-slate-600" />
                  Historischer Systemwechsel: Deutschlandweit einheitlich
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Die EBV hat die unzähligen, regional stark abweichenden Regelungen der Bundesländer (darunter vor allem die veraltete <strong>LAGA-Mitteilung 20 (LAGA M20)</strong> für den technischen Einbau) vollständig abgelöst. Sie schafft endlich Rechtssicherheit für Recyclingbetriebe, Bauunternehmer, Behörden und Schutzzonen-Planer. Einbauvorgaben hängen nun nicht mehr von regionalen Erlassen ab, sondern sind bundeseinheitlich in standardisierten <strong>Einbaumatrizen</strong> definiert.
                </p>
              </div>

              {/* Mantelverordnung Gesamtgefüge */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-6">
                <div>
                  <h4 className="font-bold text-slate-950 mb-1 flex items-center gap-2 text-base">
                    <Scale className="w-5 h-5 text-indigo-600" />
                    Die Mantelverordnung (MaV) im Gesamtgefüge
                  </h4>
                  <p className="text-xs text-slate-500">
                    Die "Mantelverordnung für Ersatzbaustoffe und Bodenschutz" (Musterverordnung verkündet 2021, bundesweit bindend seit 1. August 2023) ist das größte umwelt- und baurechtliche Gesetzgebungswerk der letzten Jahrzehnte. Sie ist als "Mantel" konzipiert, der vier Kernverordnungen umschließt und ineinander verzahnt:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-teal-50/55 border border-teal-100 flex flex-col justify-between">
                    <div>
                      <div className="font-extrabold text-teal-800 mb-1.5 uppercase tracking-wider text-xs">Artikel 1</div>
                      <h5 className="font-bold text-teal-950 mb-2 leading-snug">Ersatzbaustoffverordnung (EBV)</h5>
                      <p className="text-slate-600 leading-relaxed">
                        Regelt bundesweit einheitlich die Herstellung, Güteüberwachung (QUBA, WPK, Fremdüberwachung) und den technischen Einbau von mineralischen Ersatzbaustoffen (MEB) in Straßen, Wegen, Schienenwegen und Erdbaubauwerken.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50/55 border border-rose-100 flex flex-col justify-between">
                    <div>
                      <div className="font-extrabold text-rose-800 mb-1.5 uppercase tracking-wider text-xs">Artikel 2</div>
                      <h5 className="font-bold text-rose-950 mb-2 leading-snug">Neufassung der BBodSchV</h5>
                      <p className="text-slate-600 leading-relaxed">
                        Regelt die Verwertung von Bodenmaterial <strong>außerhalb</strong> von technischen Bauwerken (z. B. zur Rekultivierung, in Landschaftsbauwerke oder für Geländeauffüllungen) sowie die Sanierung von Altlasten.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100/55 border border-home-grau/30 flex flex-col justify-between">
                    <div>
                      <div className="font-extrabold text-slate-705 mb-1.5 uppercase tracking-wider text-xs">Zugehörige Novelle</div>
                      <h5 className="font-bold text-slate-950 mb-2 leading-snug">Deponieverordnung (DepV)</h5>
                      <p className="text-slate-600 leading-relaxed">
                        Passt die deponierechtlichen Zuordnungswerte und Annahmeparameter an die neuen analytischen Bestimmungen (z. B. Säulenperkolation) der EBV an, um Entsorgungskreisläufe lückenlos abzustimmen.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/55 border border-blue-100 flex flex-col justify-between">
                    <div>
                      <div className="font-extrabold text-blue-800 mb-1.5 uppercase tracking-wider text-xs">Zugehörige Novelle</div>
                      <h5 className="font-bold text-blue-950 mb-2 leading-snug">Gewerbeabfallverordnung (GewAbfV)</h5>
                      <p className="text-slate-600 leading-relaxed">
                        Verschärft die Pflicht zur getrennten Sammlung von gewerblichen Bau- und Abbruchabfällen direkt an der Anfallstelle auf der Baustelle (Ziel: Getrenntsammlungsquote mind. 80%).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-home-grau/30 pt-4">
                  <h5 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider">Gegenüberstellung: Rechtlicher Quantensprung</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-home-grau/30">
                      <div className="font-bold text-slate-800 mb-1">Vor dem 01. August 2023:</div>
                      <ul className="space-y-1.5 text-slate-600 font-medium font-semibold">
                        <li>❌ <strong className="text-slate-800 font-bold">LAGA M20:</strong> Kein Gesetz, sondern nur eine Länder-Arbeitsgemeinschafts-Richtlinie mit verfahrenstechnischen Spielräumen.</li>
                        <li>❌ <strong className="text-slate-800 font-bold">Flickenteppich:</strong> 16 Bundesländer hatten eigene, sich widersprechende Verwertungsrichtlinien und Zulassungsbescheide.</li>
                        <li>❌ <strong className="text-slate-800 font-bold">Haftungsangst:</strong> Da recycelter Bauschutt rechtlich unlösbar an den Status "Abfall" gekoppelt war, scheuten Bauherren das Einbaurisiko.</li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-50 border border-home-grau/30">
                      <div className="font-bold text-slate-800 mb-1">Seit dem 01. August 2023 (MaV):</div>
                      <ul className="space-y-1.5 text-slate-600 font-medium font-semibold">
                        <li>✓ <strong className="text-slate-800 font-bold">Bundesrecht:</strong> Ein einheitliches Gesetz bricht ungleiches Länderrecht. Volle Akzeptanz bei länderübergreifenden Projekten.</li>
                        <li>✓ <strong className="text-slate-800 font-bold">Produktstatus (§ 12 KrWG):</strong> Erstmalige gesetzlich verankerte Entlassung überwachter Sekundärbaustoffe aus dem Abfallregime.</li>
                        <li>✓ <strong className="text-slate-800 font-bold">Katasterpflicht:</strong> Größere Wiedereinbaumaßnahmen (ab 250 m³) sind rechtssicher behördenregistriert (Sicherheit für nachfolgende Baueigentümer).</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Materialklassen-Katalog */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-shiraz" />
                  Güteklassen & Materialarten (MEB)
                </h4>
                <p className="text-sm text-slate-600 mb-2">
                  Mineralische Ersatzbaustoffe werden anhand anspruchsvoller Analytik (Haufwerksbeprobung nach PN 98, Eluat- und Feststoffprüfungen) in präzise Güteklassen eingestuft. Jede Klasse hat Grenzwerte für Leitfähigkeit, pH-Wert, Sulfat, Chlorid sowie Schwermetalle und organische Schadstoffe (PAK, Kohlenwasserstoffe):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold rounded bg-slate-105 text-slate-800 mb-2 border border-home-grau/30">Bodenmaterial & Baggergut</span>
                    <ul className="space-y-1 text-xs text-slate-600 font-medium font-semibold">
                      <li>• <strong className="text-slate-800">BM-0 / BG-0:</strong> Unbelastetes, naturbelassenes Material.</li>
                      <li>• <strong className="text-slate-800">BM-0* / BG-0*:</strong> Geringfügig verändert, bodenähnlich.</li>
                      <li>• <strong className="text-slate-800">BM-F1 / BG-F1:</strong> Eingeschränkter offener Einbau im Erdbau.</li>
                      <li>• <strong className="text-slate-800">BM-F2 / BG-F2:</strong> Technisch gesicherter Einbau (versiegelt).</li>
                      <li>• <strong className="text-slate-800">BM-F3 / BG-F3:</strong> Stark umschlossene technische Bauwerke.</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold rounded bg-slate-105 text-slate-800 mb-2 border border-home-grau/30">Recycling & Gleisschotter</span>
                    <ul className="space-y-1 text-xs text-slate-600 font-medium font-semibold">
                      <li>• <strong className="text-slate-800">RC-1:</strong> Hochwertige Recyclingbaustoffe (z.B. Beton- o. Asphalt-Brechsand). Vielfach einsetzbar.</li>
                      <li>• <strong className="text-slate-800">RC-2:</strong> Mittlerer Belastungsgrad. Regelhaft nur unter versiegelten Deckschichten (Asphalt/Beton).</li>
                      <li>• <strong className="text-slate-800">RC-3:</strong> Höhere Gehalte. Nur in stark geschützten technischen Bauwerken im Straßenbau.</li>
                      <li>• <strong className="text-slate-800">GS-0 bis GS-F3:</strong> Aufbereiteter Gleisschotter.</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold rounded bg-slate-105 text-slate-800 mb-2 border border-home-grau/30">Slags, Aschen & Co.</span>
                    <ul className="space-y-1 text-xs text-slate-600 font-medium font-semibold">
                      <li>• <strong className="text-slate-800">HMVA-1 / HMVA-2:</strong> Hausmüllverbrennungsaschelite. Streng kontrollierte Einbindung in dichte Tragschichten.</li>
                      <li>• <strong className="text-slate-800">SWS-1 bis SWS-3:</strong> Aufbereitete Schlacken aus der Stahlgewinnung (Stahlwerksschlacke).</li>
                      <li>• <strong className="text-slate-800">HOS / MHS / KUP:</strong> Hochofen-, Metallhütten- und Kupferschlacken.</li>
                    </ul>
                  </div>
                </div>
              </div>

               {/* EBV-EINBAU-KONFIGURATOR (Interactive Applet Element) */}
              <div className="bg-slate-100 border border-home-grau/30 p-6 rounded-2xl space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Scale className="text-shiraz w-5 h-5" />
                    Interaktiver EBV-Einbau-Konfigurator (Einbaumatrix)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Geben Sie die Parameter Ihres geplanten Bauvorhabens ein, um die Zulässigkeit des Materials, eventuelle Schutzauflagen und die Anzeigepflichten gemäß der bundeseinheitlichen Einbautabelle zu ermitteln.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Controls Column */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Materialauswahl */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">1. Material & Güteklasse (MEB)</label>
                      <select 
                        value={ebvMaterial} 
                        onChange={(e) => setEbvMaterial(e.target.value)} 
                        className="w-full bg-white text-slate-800 border border-home-grau/30 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                      >
                        <option value="bm0">Bodenmaterial BM-0 / Baggergut BG-0 (vollst. unbelastet)</option>
                        <option value="bm0_star">Bodenmaterial BM-0* / Baggergut BG-0* (Schadstoffvorkommen minimal)</option>
                        <option value="rc1">Recycling-Baustoff RC-1 / Gleisschotter GS-F1 (sehr gut aufbereitet)</option>
                        <option value="bm_f1">Bodenmaterial BM-F1 / Baggergut BG-F1 (leicht belasteter Erdaushub)</option>
                        <option value="rc2">Recycling-Baustoff RC-2 / Gleisschotter GS-F2 (mittlere Eluatbelastung)</option>
                        <option value="bm_f2">Bodenmaterial BM-F2 / Hausmüllverbrennungsasche HMVA-1</option>
                        <option value="rc3">Recycling-Baustoff RC-3 / Bodenmaterial BM-F3 / HMVA-2</option>
                      </select>
                    </div>

                    {/* Wasserschutzgebiet */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">2. Wasserschutzgebiet (Grundwasserschutzbereich)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'ausserhalb', label: 'Kein Wasserschutzgebiet' },
                          { id: 'wsg_3', label: 'Zone III / III B' },
                          { id: 'wsg_1_2', label: 'Zone I / II / III A' }
                        ].map((z) => (
                          <button
                            key={z.id}
                            type="button"
                            onClick={() => setEbvSchutzgebiet(z.id)}
                            className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                              ebvSchutzgebiet === z.id
                                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                                : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                            }`}
                          >
                            {z.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hydrogeologie */}
                    <div>
                      <label className="block text-xs font-bold text-slate-705 uppercase tracking-wider mb-1.5 font-semibold">
                        3. Hydrogeologie (Natürlicher Bodenschutz & Deckschicht)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setEbvGrundwasser('deckschicht_ja')}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all flex flex-col justify-start leading-tight ${
                            ebvGrundwasser === 'deckschicht_ja'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                        >
                          <span className="font-bold">Günstige Deckschicht</span>
                          <span className="text-xs opacity-90 mt-0.5 font-semibold">Lehm/Ton vorhanden, Abstand &gt; 1,5m</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEbvGrundwasser('deckschicht_nein')}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all flex flex-col justify-start leading-tight ${
                            ebvGrundwasser === 'deckschicht_nein'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                        >
                          <span className="font-bold">Ungünstige Verhältnisse</span>
                          <span className="text-xs opacity-90 mt-0.5 font-semibold">Sandig/Kiesig oder Grundwasser &lt; 1,5m</span>
                        </button>
                      </div>
                    </div>

                    {/* Einbauweise */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold">4. Einbausituation / Bauweise</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setEbvEinbauweise('versiegelt')}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all flex flex-col justify-start leading-tight ${
                            ebvEinbauweise === 'versiegelt'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                        >
                          <span className="font-bold">Bautechnische Sicherung</span>
                          <span className="text-xs opacity-90 mt-0.5 font-semibold">Unter dichten Decken (Asphalt/Beton/Pflaster)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEbvEinbauweise('offen')}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all flex flex-col justify-start leading-tight ${
                            ebvEinbauweise === 'offen'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                        >
                          <span className="font-bold">Offene Bauweise</span>
                          <span className="text-xs opacity-90 mt-0.5 font-semibold font-semibold">Wegebau, Lärmschutzwälle (wasserleitend)</span>
                        </button>
                      </div>
                    </div>

                    {/* Menge/Einbauvolumen */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold">5. Einbauvolumen (Meldepflicht nach § 22)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setEbvVolumen('unter_250')}
                          className={`py-2 px-3 text-center rounded-lg text-xs font-semibold border transition-all ${
                            ebvVolumen === 'unter_250'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                        >
                          Kleinsteinbau (&lt; 250 m³)
                        </button>
                        <button
                          type="button"
                          onClick={() => setEbvVolumen('ab_250')}
                          className={`py-2 px-3 text-center rounded-lg text-xs font-semibold border transition-all ${
                            ebvVolumen === 'ab_250'
                              ? 'bg-shiraz text-white border-shiraz shadow-sm'
                              : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                          }`}
                        >
                          Großbaustelle (≥ 250 m³)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results Column */}
                  <div className="lg:col-span-5 flex flex-col">
                    {(() => {
                      const verdict = evaluateEBV();
                      return (
                        <div className={`p-5 rounded-2xl border flex-1 flex flex-col justify-between transition-all duration-350 shadow-xs ${
                          verdict.status === 'allowed'
                            ? 'bg-slate-50 text-slate-900 border-home-grau/30'
                            : verdict.status === 'restricted'
                            ? 'bg-slate-50 text-slate-900 border-home-grau/30'
                            : 'bg-shiraz/5 text-slate-950 border-shiraz/20'
                        }`}>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center gap-2 font-black uppercase text-xs tracking-widest">
                                {verdict.status === 'allowed' ? (
                                  <Check className="w-5 h-5 text-emerald-600 font-bold" />
                                ) : verdict.status === 'restricted' ? (
                                  <AlertCircle className="w-5 h-5 text-amber-600 font-bold" />
                                ) : (
                                  <X className="w-5 h-5 text-shiraz font-bold" />
                                )}
                                Rechtliches Urteil
                              </div>
                              <div className="text-xl font-extrabold mt-1">
                                {verdict.message}
                              </div>
                            </div>

                            <div className="border-t border-dashed border-home-grau/30 pt-3">
                              <span className="block text-xs font-bold text-slate-705 uppercase mb-1.5">Einbaubedingungen & Restriktionen:</span>
                              <ul className="space-y-1.5 text-xs font-semibold leading-relaxed">
                                {verdict.conditions.map((cond, idx) => (
                                  <li key={idx} className="flex items-start gap-1">
                                    <span className="text-teal-600 mt-0.5">•</span>
                                    <span>{cond}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="border-t border-home-grau/30 pt-3 mt-4 text-xs font-bold leading-normal">
                            <span className="block text-xs uppercase font-black text-slate-705 mb-1">Meldungspflicht (§ 22 EBV):</span>
                            {verdict.anzeige}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Anzeigepflicht & Kataster */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <FileSignature className="w-5 h-5 text-slate-600" />
                    Katasterregelung & Anzeigepflicht (§ 22 Gesetz)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Um die langfristige Umweltverträglichkeit zu gewährleisten, führt der Gesetzgeber mit der EBV erstmalig das verbindliche <strong>Ersatzbaustoffkataster</strong> für technische Einbauten über der Geringfügigkeitsschwelle ein:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                    <li>
                      <strong>Die 250 m³ Bagatellgrenze:</strong> Wenn der Gesamteinbau aller mineralischen Ersatzbaustoffe (MEB) an einer Baustelle <strong>250 Kubikmeter</strong> erreicht oder überschreitet, unterliegt das Bauwerk der Meldepflicht beim zuständigen Landesamt/LRA.
                    </li>
                    <li>
                      <strong>Fristen & Ablauf:</strong>
                      <br />
                      • <strong className="text-slate-800">Voranzeige:</strong> Spätestens <strong>4 Wochen</strong> vor Baubeginn (inkl. Probenbericht, Deckblatt-Daten, geplante Tonnasche).
                      <br />
                      • <strong className="text-slate-800">Abschlussanzeige:</strong> Binnen <strong>2 Wochen</strong> nach Abschluss des Einbaus mit der tatsächlich verbauten Endkubatur.
                    </li>
                    <li>
                      <strong>Archivierungspflichten:</strong> Die zuständigen Unteren Umweltschutzbehörden führen das Kataster elektronisch und archivieren die Daten für einen Zeitraum von <strong>120 Jahren</strong>! Grundeigentümer müssen ihre Lieferscheine und Dokumentationen über die Betriebsdauer des Bauwerks (mind. <strong>30 bis 40 Jahre</strong>) sorgfältig aufbewahren und beim Verkauf an Nachfolder übertragen.
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <FileSignature className="w-5 h-5 text-slate-600" />
                    Lieferscheine & Deckblatt-Pflicht
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Für jedes antransportierte MEB-Material muss dem Fuhrunternehmer ein rechtsverbindlicher Lieferschein sowie ein standardisiertes <strong>Deckblatt</strong> mitgegeben werden. Die lückenlose Transportverfolgung ist zentraler Bestandteil der Bundesverordnung:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                    <li>
                      <strong>Präzise Koordinaten:</strong> Das Deckblatt muss die genaue geografische Lage (GPS-Daten, Flurstücksnummer), die Einbautiefe und das genaue Anwendungsgebiet des technischen Bauwerks enthalten.
                    </li>
                    <li>
                      <strong>Unterschriftspflicht:</strong> Bauherr und Lieferant müssen einander die Eignung des Stoffes für die gegebene hydrogeologische Einbaumatrix schriftlich zusichern.
                    </li>
                    <li>
                      <strong>Übergabe an den Eigentümer:</strong> Sämtliche Deckblätter und Lieferscheine sind nach Bauende dem Grundstückseigentümer als grundbuchrelevante Dokumente zu übergeben. Sie sind die Absicherung gegen spätere Altlasten-Ansprüche der Behörden.
                    </li>
                  </ul>
                </div>
              </div>

              {/* QUBA / Güteüberwachung */}
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl flex flex-col md:flex-row gap-4 items-start">
                <div className="bg-shiraz text-white p-3 rounded-lg">
                  <Recycle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">Güteüberwachung, QUBA-Siegel & Produktstatus (Ende der Abfalleigenschaft)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    Ersatzbaustoffe müssen einer werkseigene Produktionskontrolle (WPK) sowie regelmäßigen staatlich beaufsichtigten Fremdüberwachungen unterzogen werden. Zertifizierte Hersteller von Ersatzbaustoffen sind berechtigt, das <strong>QUBA-Zertifikat</strong> (Qualitätssicherung Sekundärbaustoffe) zu führen. 
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1 font-semibold">
                    Mit Erreichung des QUBA-Gütezeichens weist das Material eine derartig hohe stoffliche Reinheit auf, dass bestimmte Klassen (z.B. hochwertiges RC-1 Material) direkt das <strong>Ende der Abfalleigenschaft (§ 5 KrWG)</strong> erreichen und rechtlich wieder als <strong>reguläres Produkt (Produktstatus)</strong> eingestuft werden. Dies erleichtert Transportvereinbarungen, gewerbliche Ausschreibungen und mindert Haftungsrisiken drastisch.
                  </p>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-home-grau/20 text-xs text-slate-600 space-y-1.5">
                    <span className="font-bold text-slate-800">Die 4 kumulativen Voraussetzungen für das Abfallende gem. § 5 Abs. 1 KrWG:</span>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                      <li>
                        <strong>Zweckbestimmung:</strong> Der Stoff oder Gegenstand wird für bestimmte Zwecke verwendet (z. B. technisches Bauwerk).
                      </li>
                      <li>
                        <strong>Marktfähigkeit:</strong> Es besteht ein Markt oder eine Nachfrage nach ihm (Käuferinteresse an RC-Materialien).
                      </li>
                      <li>
                        <strong>Technisches Recht &amp; Produktkonformität:</strong> Er erfüllt sämtliche geltenden technischen Anforderungen, Normen (z. B. DIN EN-Standards für Tragschichten) und Rechtsvorschriften.
                      </li>
                      <li>
                        <strong>Schadlosigkeit:</strong> Seine Verwendung führt insgesamt nicht zu schädlichen Auswirkungen auf Mensch oder Umwelt (Schwellenwerte der EBV und BBodSchV werden eingehalten).
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Altholz */}
          {activeTab === 'altholz' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Recycle className="w-5 h-5 text-shiraz" />
                Altholzverordnung (AltholzV)
              </h3>
              <p className="text-gray-700">
                Die Altholzverordnung (AltholzV) regelt die stoffliche und energetische Verwertung sowie die Beseitigung von Altholz. Sie zielt darauf ab, Schadstoffe aus dem Wirtschaftskreislauf auszuschleusen und nutzbares Holz sicher zu recyceln.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-slate-800 mb-2">Die Altholzkategorien</h4>
                  <ul className="space-y-3 text-sm text-slate-700 font-semibold">
                    <li>
                      <strong className="text-slate-900">A I - Naturbelassenes Holz:</strong> Nur mechanisch bearbeitet. Keine Beschichtung, keine Verklebung. (z. B. Paletten, Massivholz). Hervorragend zur stofflichen Verwertung (Spanplattenherstellung) geeignet.
                    </li>
                    <li>
                      <strong className="text-slate-900">A II - Verleimtes, gestrichenes Holz:</strong> Ohne halogenorganische Verbindungen im Lack/Kleber, ohne Holzschutzmittel. (z. B. Möbelholz, Innentüren, Bauspanplatten). Stoffliche oder thermische Verwertung.
                    </li>
                    <li>
                      <strong className="text-slate-900">A III - Holz mit halogenorg. Verbindungen (z.B. PVC):</strong> Mit PVC-Beschichtung lackiert/beschichtet, aber ohne Holzschutzmittel. (z. B. alte Küchenmöbel mit PVC-Kanten). Meist thermische Verwertung in Biomassekraftwerken.
                    </li>
                    <li>
                      <strong className="text-shiraz">A IV - Schadstoffbelastetes Altholz:</strong> Mit Holzschutzmitteln behandelt. Gilt als <strong>gefährlicher Abfall</strong> (z. B. Konstruktionshölzer aus dem Außenbereich, Bahnschwellen). Darf <strong>nur</strong> in speziellen Anlagen verbrannt werden (thermische Beseitigung).
                    </li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-bold text-shiraz mb-2">Besonderheiten im Abbruch</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>PCB-Altholz:</strong> Ab 50 mg/kg PCB nach der PCB/PCT-Abfallverordnung als gefährlich einzustufen und separat zu vernichten. (AVV 17 02 04*).</li>
                    <li><strong>Vermischungsverbot:</strong> Altholz der Kategorie A IV darf auf der Baustelle <strong>nicht</strong> mit A I bis A III vermischt werden. Geschieht dies, gilt der gesamte Container als A IV (gefährlicher Abfall), was extrem hohe Entsorgungskosten erzwingt (und das elektronische Abfallnachweisverfahren eANV auslöst).</li>
                    <li><strong>Beprobung:</strong> Wenn die Herkunft nicht zweifelsfrei geklärt ist (z.B. alter Dachstuhl), muss durch Fachlabore analytisch bestimmt werden, ob Holzschutzmittel (PCP, Lindan) vorhanden sind.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Deponie */}
          {activeTab === 'deponie' && (() => {
            const deponieParams: Record<string, { name: string; unit: string; limits: number[]; isEluat: boolean }> = {
              toc: { name: 'TOC (Gesamter organisch gebundener Kohlenstoff)', unit: 'Masse-%', limits: [1.0, 1.0, 3.0, 6.0], isEluat: false },
              loi: { name: 'Glühverlust (Anteil an brennbaren organischen Stoffen)', unit: 'Masse-%', limits: [3.0, 3.0, 5.0, 10.0], isEluat: false },
              sulfat: { name: 'Sulfat (SO4 im Sickerwasser/Eluat)', unit: 'mg/l im Eluat', limits: [50, 1000, 4000, 5000], isEluat: true },
              chlorid: { name: 'Chlorid (Cl im Eluat)', unit: 'mg/l im Eluat', limits: [10, 1500, 4500, 25000], isEluat: true },
              pb: { name: 'Blei (Pb im Eluat)', unit: 'mg/l im Eluat', limits: [0.05, 0.2, 1.0, 5.0], isEluat: true },
              as: { name: 'Arsen (As im Eluat)', unit: 'mg/l im Eluat', limits: [0.01, 0.2, 0.5, 2.5], isEluat: true },
              cd: { name: 'Cadmium (Cd im Eluat)', unit: 'mg/l im Eluat', limits: [0.002, 0.05, 0.1, 0.5], isEluat: true },
              cu: { name: 'Kupfer (Cu im Eluat)', unit: 'mg/l im Eluat', limits: [0.05, 2.0, 5.0, 10.0], isEluat: true },
              ni: { name: 'Nickel (Ni im Eluat)', unit: 'mg/l im Eluat', limits: [0.04, 0.2, 1.0, 10.0], isEluat: true },
              zn: { name: 'Zink (Zn im Eluat)', unit: 'mg/l im Eluat', limits: [0.1, 2.0, 5.0, 20.0], isEluat: true },
              kw: { name: 'Kohlenwasserstoff-Index (KW)', unit: 'mg/kg TM (Feststoff)', limits: [500, 500, 1000, 50000], isEluat: false }
            };

            const paramInfo = deponieParams[depVSelectedParam] || deponieParams.toc;
            
            const isLte = (val: number, limit: number) => val <= limit;
            
            const dk0Allowed = isLte(depVInputValue, paramInfo.limits[0]);
            const dkIAllowed = isLte(depVInputValue, paramInfo.limits[1]);
            const dkIIAllowed = isLte(depVInputValue, paramInfo.limits[2]);
            const dkIIIAllowed = isLte(depVInputValue, paramInfo.limits[3]);

            let finalClassVerdict = '⛔ Überschreitung DK III Grenzwert: DK IV (Untertägige Einlagerung) oder Sondermüllvorbehandlung erforderlich!';
            let classColor = 'bg-shiraz/5 text-slate-900 border-shiraz/20';
            if (dk0Allowed) {
              finalClassVerdict = '💚 Unbedenklich: Geeignet für DK 0 (sowie DK I, DK II, DK III)';
              classColor = 'bg-slate-50 text-slate-800 border-home-grau/30';
            } else if (dkIAllowed) {
              finalClassVerdict = '✓ Zulässig ab Deponieklasse DK I (sowie DK II, DK III)';
              classColor = 'bg-slate-50 text-slate-800 border-home-grau/30';
            } else if (dkIIAllowed) {
              finalClassVerdict = '⚠️ Erhöht: Zulässig ab Deponieklasse DK II (sowie DK III)';
              classColor = 'bg-slate-50 text-slate-800 border-home-grau/30';
            } else if (dkIIIAllowed) {
              finalClassVerdict = '🚨 Gefährlich / Stark Belastet: Zulässig erst ab Deponieklasse DK III (Sondermüll)';
              classColor = 'bg-slate-50 text-slate-800 border-home-grau/30';
            }

            return (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="border-b border-home-grau/30 pb-4">
                  <h3 className="text-2xl font-bold text-slate-850 flex items-center gap-2">
                    <Database className="w-6 h-6 text-shiraz" />
                    Deponieverordnung (DepV) &amp; Zuordnungsanalyse
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Mineralische Abfälle, die nicht verwertet werden können (z.B. fehlendes Recycling-Potential, Überschreitung der EBV-Werte), müssen deponiert werden. Die DepV teilt Deponien in 5 Klassen ein, basierend auf Schadstoffpotential und Auslaugverhalten.
                  </p>
                </div>

                {/* Deponieklassen Übersicht */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                    <div>
                      <span className="font-extrabold text-slate-600 uppercase text-xs tracking-wider">DK 0</span>
                      <h4 className="font-bold text-slate-800 mb-2 mt-0.5">Inertabfalldeponie</h4>
                      <p className="text-slate-600 leading-relaxed">Für unbelastete, inerte Bauabfälle, die sich chemisch, biologisch und physikalisch nicht verändern.</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-home-grau/30 font-medium text-xs text-slate-700">Beispiel: Reiner Boden, Kiese.</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                    <div>
                      <span className="font-extrabold text-slate-550 uppercase text-xs tracking-wider font-semibold">DK I</span>
                      <h4 className="font-bold text-slate-800 mb-2 mt-0.5">Nicht-gefährlich (Gering)</h4>
                      <p className="text-slate-600 leading-relaxed">Gering belastete mineralische Baustoffe mit sehr moderaten Abdichtungsbarrieren.</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-home-grau/30 font-medium text-xs text-slate-700">Beispiel: Leicht kontaminierter Schutt.</div>
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                    <div>
                      <span className="font-extrabold text-slate-550 uppercase text-xs tracking-wider font-semibold">DK II</span>
                      <h4 className="font-bold text-slate-805 mb-2 mt-0.5">Hausmüllähnlich (Mäßig)</h4>
                      <p className="text-slate-600 leading-relaxed">Klassische Siedlungs- und Bauabfälle. Höhere Anforderungen an Sickerwassererfassung und Basisabdichtungen.</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-home-grau/30 font-medium text-xs text-slate-705">Beispiel: Belastete Schlacken, Gipsbauteile.</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                    <div>
                      <span className="font-extrabold text-slate-600 uppercase text-xs tracking-wider font-semibold">DK III</span>
                      <h4 className="font-bold text-slate-800 mb-2 mt-0.5">Sondermülldeponie</h4>
                      <p className="text-slate-650 leading-relaxed font-semibold">Überwachungspflichtige, gefährliche Abfälle. Extreme Sicherheitsstandards und doppelte Barrieren.</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-home-grau/30 font-medium text-xs text-slate-700">Beispiel: Asbestplatten, teerige Bahnen.</div>
                  </div>

                  <div className="bg-shiraz/5 p-4 rounded-xl border border-shiraz/20 flex flex-col justify-between">
                    <div>
                      <span className="font-extrabold text-shiraz uppercase text-xs tracking-wider font-semibold">DK IV</span>
                      <h4 className="font-bold text-slate-900 mb-2 mt-0.5">Untertagedeponie</h4>
                      <p className="text-slate-700 leading-relaxed">Dauerhafte Kapselung in tiefen geologischen Steinsalz-Formationen, isoliert von Biosphäre.</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-shiraz/10 font-medium text-xs text-shiraz font-bold">Beispiel: Filtrieraschen, hochtoxische Schluffe.</div>
                  </div>
                </div>

                {/* Interactive Limit Checker */}
                <div className="p-5 rounded-2xl bg-white border border-home-grau/30 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Interactive DepV Grenzwert-Prüfer</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Wählen Sie einen Analysenwert aus dem Laborprüfbericht (Eluat oder Feststoff), um die Mindest-Deponieklasse (nach DepV Anhang 3) sofort zu bestimmen.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Parameter / Schadstoff:</label>
                        <select
                          className="w-full text-xs font-mono bg-slate-50 border border-home-grau/30 rounded-lg p-2 outline-none focus:border-home-grau/30"
                          value={depVSelectedParam}
                          onChange={(e) => {
                            setDepVSelectedParam(e.target.value);
                            setDepVInputValue(deponieParams[e.target.value].limits[0]);
                          }}
                        >
                          {Object.entries(deponieParams).map(([key, data]) => (
                            <option key={key} value={key}>{data.name} ({data.unit})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex justify-between">
                          <span>Labor-Analysenwert:</span>
                          <span className="font-mono text-slate-500 font-bold">{paramInfo.unit}</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step={paramInfo.limits[0] < 1 ? "0.001" : "0.5"}
                            min="0"
                            className="w-full text-xs font-mono bg-slate-50 border border-home-grau/30 rounded-lg p-2.5 outline-none focus:border-home-grau/30"
                            value={depVInputValue}
                            onChange={(e) => setDepVInputValue(Math.max(0, parseFloat(e.target.value) || 0))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border text-xs font-bold leading-relaxed ${classColor}`}>
                      {finalClassVerdict}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Gesetzliche Grenzwerte im Vergleich ({paramInfo.unit})</h5>
                    
                    <div className="space-y-3.5">
                      {paramInfo.limits.map((lim, idx) => {
                        const classes = [
                          { label: 'DK 0 (Inert)', desc: 'Unbelastete Boden- und Bauschuttfraktionen', color: 'bg-slate-100', text: 'text-slate-800' },
                          { label: 'DK I (Sehr gering)', desc: 'Leicht mineralisch belastete Stoffe', color: 'bg-slate-100', text: 'text-slate-705' },
                          { label: 'DK II (Mäßig)', desc: 'Regelfall für gemischte Bauabfälle', color: 'bg-slate-100', text: 'text-slate-705 font-medium' },
                          { label: 'DK III (Sondermüll)', desc: 'Überwachungspflichtiger Gift- & Sonderabfall', color: 'bg-slate-150', text: 'text-slate-800 font-bold' }
                        ];
                        const cls = classes[idx];
                        const isOk = depVInputValue <= lim;

                        return (
                          <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${isOk ? 'bg-slate-50 border-home-grau/30' : 'bg-shiraz/5 border-shiraz/10 opacity-80'}`}>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${cls.color} ${cls.text} border border-home-grau/30`}>{cls.label}</span>
                                <span className="font-bold text-slate-800">C ≤ {lim} {paramInfo.unit}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{cls.desc}</p>
                            </div>
                            <div>
                              {isOk ? (
                                <span className="px-2 py-1 text-xs font-bold rounded bg-slate-100 text-slate-800 border border-home-grau/30">✓ Einhaltbar</span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-bold rounded bg-shiraz/15 text-shiraz border border-shiraz/35">❌ Überschritten</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-xs text-slate-400 italic">
                      ℹ️ <strong>Wichtiger Hinweis:</strong> In der Praxis werden nach DepV Anhang 3 über 40 Parameter zeitgleich analysiert. Überschreitet auch nur ein einziger Parameter den Grenzwert (z.B. hohe TOC-Werte durch Holzspäne oder hoher Sulfatwert durch Gips), stuft dies den gesamten Abfallkörper unweigerlich in die nächsthöhere Klasse ein!
                    </p>
                  </div>
                </div>

                {/* Analytical and biological background */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/30">
                    <h4 className="font-bold text-slate-900 mb-2">Analytische Nachweisverfahren &amp; Eluatherstellung</h4>
                    <ul className="space-y-3 text-slate-650 leading-relaxed font-medium">
                      <li>
                        <strong className="text-slate-800">Schüttelversuch (DIN EN 12457-4):</strong>
                        <p className="text-xs mt-0.5 text-slate-500">Das Standard-Laborverfahren zur Bestimmung wasserlöslicher Stoffe. Der mechanisch zerkleinerte Feststoff wird im Gewichtsverhältnis 1:10 (1 kg Probe auf 10 Liter entionisiertes Wasser) über 24 Stunden rotatorisch geschüttelt. Die anschließende Membranfiltration liefert das "Eluat", das chemisch analysiert wird.</p>
                      </li>
                      <li>
                        <strong className="text-slate-850">Säulenperkolationsprüfung (DIN 19528):</strong>
                        <p className="text-xs mt-0.5 text-slate-500">
                          Im Zuge der Mantelverordnung 2023 massiv aufgewertet. Repräsentiert die realistische Freisetzungsdynamik besser als das statische Schütteln. Wasser sickert kontinuierlich von unten nach oben durch eine vertikal präparierte Materialsäule. Die Auswertung erfolgt fraktioniert nach dem Flüssigkeits-Feststoff-Verhältnis (L/S 2 bis L/S 4).
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-home-grau/30">
                    <h4 className="font-bold text-slate-900 mb-2">Gips, Sulfat &amp; die biologische Gefahrenkette</h4>
                    <p className="text-slate-700 leading-relaxed mb-3">
                      Der hohe Sulfatgehalt in Gipskarton- und Gipsfaserplatten (z. B. Rigips als Beispiel) stellt den Erd- und Deponiebau vor erhebliche chemisch-biologische Probleme:
                    </p>
                    <ul className="list-decimal pl-4 space-y-2 text-slate-600 font-medium">
                      <li>
                        <strong>Gipsdeponierungsverbot auf DK 0:</strong> Da DK 0 Deponien keine dichten geotechnischen Barrieren oder Sickerwasserreinigungen haben, führt die freie Auswaschung von Gips zu extrem hohen Sulfatkonzentrationen im Grundwasser.
                      </li>
                      <li>
                        <strong>Anaerobe Fäulnisgasbildung (H2S):</strong> Werden Gipsrückstände unkontrolliert mit organischen Abfallbestandteilen (z.B. Holzresten) vermischt, wandeln sulfatreduzierende Bakterien unter Luftabschluss im feuchten Deponiekörper das Sulfat in hochgiftigen, metallkorrosiven und stark riechenden <strong>Schwefelwasserstoff (H2S)</strong> um.
                      </li>
                      <li>
                        <strong>Ausschließliche Entsorgung als Monofraktion:</strong> Gips muss am Abbruchort strikt getrennt gesammelt werden. Größere Bauteilmengen werden zur Kreislauf-Verwertung in Gipsrecyclingwerke transportiert oder sortenrein in abgeschotteten Monokompartimenten auf DK II / DK III Deponien abgelagert.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Aufbau- und Barriereprinzip der Deponie (Multibarrierenkonzept & technischer Schichtenaufbau) */}
                <div className="border-t border-home-grau/20 pt-6 mt-8 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-850 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-shiraz" />
                      Aufbau- und Barriereprinzip von Deponien (§ 3-14 DepV)
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Das Schutzkonzept moderner deponietechnischer Anlagen in Deutschland basiert auf dem <strong>Multibarrierenkonzept</strong> (Sicherheitsbarrieren) sowie einem hochpräzisen, regelkonformen <strong>Schichtenaufbau</strong> an Basis und Oberfläche.
                    </p>
                  </div>

                  {/* 1. Multibarrierenkonzept */}
                  <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-md">
                    <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Das Multibarrierenkonzept (Die 5 Sicherheitsbarrieren)
                    </h4>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      Durch das Ineinandergreifen von fünf voneinander unabhängigen Sicherheitsbarrieren wird gewährleistet, dass selbst bei Ausfall einzelner Komponenten (z. B. einer Dichtungsbahn) keine Schadstoffe in die Biosphäre oder das Grundwasser gelangen können.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {[
                        {
                          num: 1,
                          label: "Barriere 1: Geologie",
                          sub: "Standort & Untergrund",
                          desc: "Der geologische Untergrund fungiert als natürlicher Schadstofffänger. Er muss homogen, gering durchlässig (kf ≤ 1e-7 m/s) und mind. 1m mächtig sein, um einen hydrogeologischen Sicherheitsabstand zum nutzbaren Grundwasserleiter zu wahren.",
                          icon: ShieldCheck,
                        },
                        {
                          num: 2,
                          label: "Barriere 2: Abfallkörper",
                          sub: "TOC- & Reaktivitätssperre",
                          desc: "Verbot der Ablagerung von organischen, biologisch abbaubaren Altabfällen (TOC ≤ 3% auf DK II). Dies stoppt mikrobielle Gärungen, saure Sickerwasserphasen sowie explosive Gaskonzentrationen im Kern.",
                          icon: Database,
                        },
                        {
                          num: 3,
                          label: "Barriere 3: Basisabdichtung",
                          sub: "Doppelte Sperre & Dränung",
                          desc: "Kombinationsabdichtung am Deponieboden: Eine mindestens 75 cm dichte mineralische Tonschicht wirkt direkt unter einer 2,5 mm starken HDPE-Kunststoffdichtungsbahn (KDB). Kiesdräns (16/32) leiten Eluate aktiv ab.",
                          icon: Layers,
                        },
                        {
                          num: 4,
                          label: "Barriere 4: Oberflächenabdichtung",
                          sub: "Kapselung & Rekultivierung",
                          desc: "Nach Verfüllung erfolgt der hermetische Verschluss von oben. Ein mehrteiliges System aus Tonschicht, KDB, Entwässerungsdrän und 1m Mutterboden leitet Regenwasser ab und stoppt das Einsickern vollständig.",
                          icon: Droplets,
                        },
                        {
                          num: 5,
                          label: "Barriere 5: Überwachung",
                          sub: "Monitoring & Nachsorge",
                          desc: "Kontrollierter Messstellenbetrieb im An- und Abstrom des Grundwassers, Sickerwasserreinigung und Gasverbrennung/Verwertung. Die Nachsorgephase läuft jahrzehntelang bis zur behördlichen Entlassung.",
                          icon: Scale,
                        }
                      ].map((bar) => {
                        const isSelected = activeBarrier === bar.num;
                        const IconComponent = bar.icon;
                        return (
                          <button
                            key={bar.num}
                            onClick={() => setActiveBarrier(bar.num)}
                            className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                              isSelected
                                ? "bg-shiraz/5 border-shiraz text-slate-900 shadow-sm ring-1 ring-shiraz/50"
                                : "bg-slate-50 border-home-grau/30 text-slate-700 hover:bg-slate-100/50"
                            }`}
                          >
                            <div className="flex justify-between items-start w-full mb-3">
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                                isSelected ? "bg-shiraz text-white" : "bg-slate-200 text-slate-600 border border-slate-300"
                              }`}>
                                {bar.num}
                              </span>
                              <IconComponent className={`w-4 h-4 ${isSelected ? "text-shiraz" : "text-slate-400"}`} />
                            </div>
                            <div>
                              <h5 className="font-bold text-xs leading-snug">{bar.label}</h5>
                              <span className="text-xs text-slate-500 font-medium block mt-0.5">{bar.sub}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Detaillierte Beschreibung der ausgewählten Barriere */}
                    {(() => {
                      const selectedBar = [
                        {
                          num: 1,
                          label: "Barriere 1: Geologische Barriere (Standortwahllogik)",
                          desc: "Die erste Linie der Verteidigung ist der gewählte Bodenstandort selbst. Ein erstklassiger Deponiestandort befindet sich auf natürlichen Sedimentationsbecken (z.B. dicke Ton- oder Mergeldecken). Nach DepV Anhang 1 muss diese Schicht eine hohe Adsorptionskapazität aufweisen, um Kationen (z.B. Schwermetalle) durch Ionenaustausch an die Tonminerale (z.B. Montmorillonit) zu binden, falls es im Extremfall zu einer Sickerwasser-Migration kommen sollte.",
                          norm: "§ 5 DepV sowie DepV Anhang 1 i.V.m. TA Abfall.",
                        },
                        {
                          num: 2,
                          label: "Barriere 2: Reaktivitätsminderung im Deponiekörper (Abfallbeschaffenheit)",
                          desc: "Bevor Müll deponiert wird, muss sein biologisches und chemisches Reaktionspotenzial kontrolliert werden. Durch das strikte Verbot unvorbehandelter organischer Siedlungsabfälle wird der Deponiekörper biologisch inert gehalten. Geringe TOC-Grenzwerte (DK 0: ≤ 1%, DK II: ≤ 3%) verhindern die Bildung hochpathogener organischer Säuren, die ansonsten mineralische Bauteile und Tonschichten angreifen und dichte Barrieren chemisch zersetzen würden.",
                          norm: "§ 6 DepV (Annahmekriterien) und Anhang 3 Grenzwerttabellen.",
                        },
                        {
                          num: 3,
                          label: "Barriere 3: Das deponietechnische Basisabdichtungssystem",
                          desc: "Diese Barriere trennt den kontaminierten Abfall physisch vom darunterliegenden Boden. Sie besteht aus einer Kombinationsdichtung: Auf einer extrem dichten, dreilagig feucht gewalzten mineralischen Dichtung (Ton, Dicke d ≥ 75 cm, kf ≤ 5 · 10⁻¹⁰ m/s) liegt direkt eine hochdichte Kunststoffdichtungsbahn (KDB, d ≥ 2,5 mm, HDPE). Ein 30 cm hoher Kiesfilter fängt Sickerwässer ab, bevor diese hydrostatischen Druck auf die KDB ausüben können.",
                          norm: "Anhang 1 Nr. 2 DepV (Anforderungen an die Kombinationsabdichtung).",
                        },
                        {
                          num: 4,
                          label: "Barriere 4: Das mehrschichtige Oberflächenabdichtungssystem",
                          desc: "Nach vollständiger Verfüllung einer Deponiezelle wird diese 'gedeckelt', um das Eindringen von Regenwasser dauerhaft zu verhindern. Ohne Regenwasser entsteht kein nennenswertes Schadstoffeluat mehr im Abfallkörper. Die Oberfläche besteht von oben nach unten aus: mind. 1 Meter Rekultivierungsboden (Mutterboden + Bepflanzung), einer Entwässerungsschicht (Geodrän/Kies) zur schnellen Zuleitung fließenden Hangwassers nach außen, einem Dichtungselement (KDB oder Bentonitmatte) und einer Gasdränschicht zur sicheren Fassung von Diffusionsgasen.",
                          norm: "Anhang 1 Nr. 3 DepV (Anforderungen an das Oberflächenabdichtungssystem).",
                        },
                        {
                          num: 5,
                          label: "Barriere 5: Systematisches Sickerwasser- & Grundwassermonitoring (Nachsorge)",
                          desc: "Regelmäßige Beprobungen an eigens dafür errichteten Grundwassermessstellen im direkten Anstrom (Referenzwert) und im Abstrom (Leckage-Detektion) der Deponie werden vierteljährlich durchgeführt. Das Sickerwasser wird über das Basisgefälle erfasst, in Schächten gesammelt und in speziellen physikalisch-chemischen und biologischen Reinigungsanlagen aufbereitet, bevor es in Vorfluter geleitet werden darf.",
                          norm: "§ 12 - 14 DepV (Abschluss, Nachsorge und Monitoring).",
                        }
                      ].find(b => b.num === activeBarrier);

                      if (!selectedBar) return null;

                      return (
                        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-home-grau/20 text-xs animate-in fade-in duration-200">
                          <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-shiraz inline-block"></span>
                            {selectedBar.label}
                          </h5>
                          <p className="text-slate-650 leading-relaxed font-semibold mb-2">{selectedBar.desc}</p>
                          <div className="text-xs text-slate-550 font-mono">
                            <strong className="text-slate-600">Gesetzliche Norm:</strong> {selectedBar.norm}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* 2. Technischer Schichtenaufbau (Interaktiver Visualisierer) */}
                  <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/25 pb-3 mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-shiraz" />
                          Geotechnischer Schichtenaufbau nach DepV Anhang 1
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Vergleiche den normativen Aufbau der wissenschaftlich fundierten Dichtungsschichten an der Deponiebasis und der Oberfläche.
                        </p>
                      </div>
                      
                      <div className="flex p-0.5 bg-slate-100 rounded-lg border border-home-grau/30 self-start md:self-center">
                        <button
                          onClick={() => { setDeponieSection('basis'); setSelectedLayerIndex(1); }}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            deponieSection === 'basis' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Basisabdichtung
                        </button>
                        <button
                          onClick={() => { setDeponieSection('oberflaeche'); setSelectedLayerIndex(0); }}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            deponieSection === 'oberflaeche' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Oberflächenabdichtung
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Visual Layer Stack Container */}
                      <div className="md:col-span-5 flex flex-col space-y-1">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-1">
                          {deponieSection === 'basis' ? "➔ INNEN (ABFALLKÖRPER)" : "➔ AUSSEN (ATMOSPHÄRE)"}
                        </div>

                        {/* Hier loopen wir über die Layer rückwärts oder vorwärts um von dem echten Stapel zu rendern */}
                        {(deponieSection === 'basis' ? [
                          {
                            index: 0,
                            name: "Abfallkörper (Deponiegut, verdichtet)",
                            thickness: "variabel",
                            color: "bg-stone-400 hover:bg-stone-500 border-stone-500 text-stone-900",
                            previewText: "Abfallkörper (DK II / DK III)"
                          },
                          {
                            index: 1,
                            name: "Sickerwasserdränschicht (Kies-Leitschicht)",
                            thickness: "≥ 30 cm",
                            color: "bg-sky-200 hover:bg-sky-300 border-sky-400 text-sky-950",
                            previewText: "Kies-Filterträgdrän (16/32, kf ≥ 1e-3)"
                          },
                          {
                            index: 2,
                            name: "HDPE-Kunststoffdichtungsbahn (KDB)",
                            thickness: "≥ 2.5 mm",
                            color: "bg-slate-950 hover:bg-slate-900 border-slate-900 text-slate-100",
                            previewText: "Kunststoffdichtungsbahn (KDB - HDPE)"
                          },
                          {
                            index: 3,
                            name: "Mineralische Tonsperre (Mehrlagig)",
                            thickness: "≥ 75 cm",
                            color: "bg-amber-100 hover:bg-amber-205 border-amber-300 text-amber-800",
                            previewText: "Ton-Kombinationsabdichtung (3 x 25cm)"
                          },
                          {
                            index: 4,
                            name: "Geologischer Barriereuntergrund (Tonmergel)",
                            thickness: "≥ 1.0 m",
                            color: "bg-amber-200/50 hover:bg-amber-200/70 border-amber-300/50 text-amber-900",
                            previewText: "Natürlicher Baugrund (kf ≤ 1e-7 m/s)"
                          }
                        ] : [
                          {
                            index: 0,
                            name: "Rekultivierungsschicht (Mutterboden)",
                            thickness: "≥ 1.0 m",
                            color: "bg-emerald-700/80 hover:bg-emerald-700/90 border-emerald-800 text-white",
                            previewText: "Mutterboden + Bepflanzung (Frostschutz)"
                          },
                          {
                            index: 1,
                            name: "Leitdränschicht (Dränmatte / Kies)",
                            thickness: "≥ 30 cm",
                            color: "bg-sky-150 hover:bg-sky-200 border-sky-300 text-sky-900",
                            previewText: "Sicker- & Hangwasserdrän (kf ≥ 1e-3)"
                          },
                          {
                            index: 2,
                            name: "Dichtungskomponente (KDB / Ton)",
                            thickness: "KDB ≥ 2.5mm",
                            color: "bg-slate-800 hover:bg-slate-700 border-slate-900 text-slate-200",
                            previewText: "Verbunddichtung (Polymer/Bentonit)"
                          },
                          {
                            index: 3,
                            name: "Gasdränschicht (Gasschliff)",
                            thickness: "≥ 30 cm",
                            color: "bg-stone-305 hover:bg-stone-350 border-stone-400 text-stone-800",
                            previewText: "Gasleitung (Entgasungs-Sandschicht)"
                          },
                          {
                            index: 4,
                            name: "Ausgleichsschicht (Planum)",
                            thickness: "≥ 20 cm",
                            color: "bg-stone-200 hover:bg-stone-250 border-stone-300 text-stone-600",
                            previewText: "Planierte Profil-Ausgleichsschicht"
                          }
                        ]).map((lay) => {
                          const isSelected = selectedLayerIndex === lay.index;
                          return (
                            <button
                              key={lay.index}
                              onClick={() => setSelectedLayerIndex(lay.index)}
                              className={`w-full py-3 px-4 rounded-xl border text-left text-xs font-bold leading-normal transition-all relative ${lay.color} ${
                                isSelected ? "ring-2 ring-shiraz ring-offset-2 scale-[1.01]" : ""
                              }`}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="truncate">{lay.previewText}</span>
                                <span className="text-xs bg-white/70 text-slate-900 px-1.5 py-0.5 rounded font-mono border border-black/10 flex-shrink-0">
                                  {lay.thickness}
                                </span>
                              </div>
                              {isSelected && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-shiraz rounded-r"></span>
                              )}
                            </button>
                          );
                        })}

                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mt-1">
                          {deponieSection === 'basis' ? "➔ AUSSEN (GRUNDWASSERPFAD)" : "➔ INNEN (ABFALLKERN)"}
                        </div>
                      </div>

                      {/* Detailbeschreibung der selektierten Schicht */}
                      <div className="md:col-span-7 bg-slate-50 p-5 rounded-2xl border border-home-grau/30 h-full flex flex-col justify-between">
                        {(() => {
                          const basisLayers: Record<number, { name: string; thickness: string; material: string; requirement: string; function: string }> = {
                            0: {
                              name: "Abfallkörper (Deponiegut, verdichtet)",
                              thickness: "Variabel (Betriebsphase)",
                              material: "Mineralischer Bauschutt, Schluffe, Asche etc. der DK II / III",
                              requirement: "Einhaltung der Zuordnungswerte Anhang 3 DepV",
                              function: "Einbau und kontrollierte biologisch-physikalische Verdichtung des Abfalls zur Vermeidung von späteren großflächigen Sackungen."
                            },
                            1: {
                              name: "Sickerwasserdränschicht (Kiesfilter)",
                              thickness: "≥ 30 cm",
                              material: "Grobkies (Körnung 16/32), karbonatarm (< 10% CaCO3)",
                              requirement: "Durchlässigkeit kf ≥ 1 · 10⁻³ m/s nach DepV",
                              function: "Rasche Erfassung und schadlose Ableitung von Sickerwasser zur Vermeidung von hydrostatischem Druck auf das empfindliche Abdichtungssystem."
                            },
                            2: {
                              name: "HDPE-Kunststoffdichtungsbahn (KDB)",
                              thickness: "≥ 2.5 mm",
                              material: "PE-HD (Polyethylen hoher Dichte) mit BAM-Zulassung",
                              requirement: "Heißluft- oder Extruderschweißung, vollständige geoelektrische Lecksuchprüfung, Schutz durch schwere Geotextil-Schutzvliese (GRK 5)",
                              function: "Die primäre, absolut wasserdichte stoffliche Barriere gegen den Durchstrom und die Diffusion schadstoffbelasteter Wässer."
                            },
                            3: {
                              name: "Mineralische Tonsperre (Kombinationsdichtung)",
                              thickness: "≥ 75 cm (3 Lagen à 25 cm)",
                              material: "Spezialtone (Silt / Ton im Verbund)",
                              requirement: "kf ≤ 5 · 10⁻¹⁰ m/s nach Einbau und Walzenverdichtung (Proctor-Dichte ≥ 95%)",
                              function: "Kombinationsdichtung im hohlraumfreien Direktverbund mit der darüberliegenden KDB zur geotechnischen Selbstdichtung durch Quellung bei eventuellen Mikrorissen der Bahn."
                            },
                            4: {
                              name: "Geologischer Barriereuntergrund (Natürliche Barriere)",
                              thickness: "≥ 1.0 m",
                              material: "Homogener Fest- oder Lockergesteinskörper (z.B. Tonmergel, feiner Ton)",
                              requirement: "kf ≤ 1 · 10⁻⁷ m/s (oder ersetzende gleichwertige technische Barriere)",
                              function: "Letzter massiver Schutz des lokalen Wasserspiegels durch hohes chemisch-physikalisches Schadstoff-Rückhalte- und Absorptionsvermögen geologischer Massivschichten."
                            }
                          };

                          const oberflaecheLayers: Record<number, { name: string; thickness: string; material: string; requirement: string; function: string }> = {
                            0: {
                              name: "Rekultivierungsschicht (Mutterboden)",
                              thickness: "≥ 1.0 m",
                              material: "Humusreicher Bodenaushub, wurzelfähiges Substrat",
                              requirement: "Vermeidung tiefwurzelnder Gehölze nach Bepflanzungsordnung (Dichtungsschutz)",
                              function: "Sichert ein stabiles Pflanzenwachstum als Erosionsschutz, schützt das Dichtungssystem vor winterlichem Frost/Dürre und speichert Regenwasser zur Verdunstung."
                            },
                            1: {
                              name: "Leitdränschicht (Oberflächendränung)",
                              thickness: "≥ 30 cm",
                              material: "Grobkies oder geosynthetische Dränmatte / Dränelemente",
                              requirement: "Durchlässigkeit kf ≥ 1 · 10⁻³ m/s",
                              function: "Zügiges horizontales Ableiten des durch den Oberboden sickernden Niederschlagswassers, damit kein Stauwasser über der Dichtungsschicht entsteht."
                            },
                            2: {
                              name: "Dichtungselement (KDB & Tonverbund)",
                              thickness: "KDB ≥ 2.5 mm und/oder Tonschicht",
                              material: "PE-HD Folie o. geosynthetische Tonsubstratbahn (Bento)",
                              requirement: "Zulassung nach Bundesanstalt für Materialforschung (BAM)",
                              function: "Verhindert verlässlich und dauerhaft das Einsickern von Oberflächen- bzw. Regenwasser in den darunterliegenden Deponiekörper, um so die Sickerwasserbildung im Kern zu stoppen."
                            },
                            3: {
                              name: "Gasdränschicht (Gasschliff)",
                              thickness: "≥ 30 cm",
                              material: "Sand oder feinkörniger Kies (kf ≥ 1 · 10⁻⁴ m/s)",
                              requirement: "Erhalt der Porenstruktur zur unbeeinträchtigten Gasströmung zur Absaugung",
                              function: "Sammelt aufsteigendes Deponiegas (Methan, Kohlendioxid) flächig unter der Dichtung ab und leitet es kontrolliert zu den Gasbrunnen für die BHKW-Verwertung."
                            },
                            4: {
                              name: "Ausgleichsschicht (Planum)",
                              thickness: "≥ 20 cm",
                              material: "Mineralstoffe (z.B. schluffarmer Sand, aufbereitetes RC-Material)",
                              requirement: "Lagestabilität und Verformungsausgleich",
                              function: "Gleicht lokale Verformungen des Abfallkörpers aus, schützt das Gassystem vor Müllkantendurchbrüchen und stellt ein geordnetes Mindestgefälle von 5% her."
                            }
                          };

                          const activeLayer = deponieSection === 'basis' ? basisLayers[selectedLayerIndex] : oberflaecheLayers[selectedLayerIndex];
                          if (!activeLayer) return null;

                          return (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-home-grau/25 pb-2">
                                <span className="text-xs font-bold text-shiraz uppercase tracking-wider">
                                  {deponieSection === 'basis' ? `Basis-Schicht ${selectedLayerIndex + 1}` : `Oberflächen-Schicht ${selectedLayerIndex + 1}`}
                                </span>
                                <span className="text-xs font-bold text-slate-500 font-mono">
                                  Dicke: {activeLayer.thickness}
                                </span>
                              </div>

                              <div>
                                <h4 className="text-base font-extrabold text-slate-850 leading-tight">
                                  {activeLayer.name}
                                </h4>
                                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                  Regelstoff: <span className="text-slate-700">{activeLayer.material}</span>
                                </p>
                              </div>

                              <div className="space-y-3">
                                <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-xs">
                                  <strong className="text-slate-800 block mb-1">🔍 Geotechnische Hauptfunktion:</strong>
                                  <span className="text-slate-600 leading-relaxed font-semibold">{activeLayer.function}</span>
                                </div>

                                <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-xs">
                                  <strong className="text-slate-800 block mb-1">⚖️ Gesetzliche Mindestanforderung (DepV Anhang 1):</strong>
                                  <span className="text-slate-550 font-mono leading-relaxed font-semibold">{activeLayer.requirement}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        <div className="mt-5 pt-3 border-t border-home-grau/20 flex items-center gap-1.5 text-xs text-slate-400">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          <span>Klicke auf eine Schicht im linken Stapel, um die hydraulischen Eigenschaften und materialtechnischen Parameter einzusehen.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Altlasten */}
          {activeTab === 'altlasten' && (() => {
            const bbodData: Record<string, { title: string; unit: string; values: Record<string, number> }> = {
              spielplatz: {
                title: 'Wirkpfad Boden-Mensch: Kinderspielplätze',
                unit: 'mg/kg TM (Trockenmasse im Feststoff)',
                values: { 'Arsen (As)': 25, 'Blei (Pb)': 200, 'Cadmium (Cd)': 2, 'Chrom (Cr)': 100, 'Nickel (Ni)': 70, 'Quecksilber (Hg)': 10, 'Benzo(a)pyren': 2 }
              },
              wohngebiet: {
                title: 'Wirkpfad Boden-Mensch: Wohngebiete (Gärten etc.)',
                unit: 'mg/kg TM (Trockenmasse im Feststoff)',
                values: { 'Arsen (As)': 50, 'Blei (Pb)': 400, 'Cadmium (Cd)': 10, 'Chrom (Cr)': 200, 'Nickel (Ni)': 140, 'Quecksilber (Hg)': 20, 'Benzo(a)pyren': 4 }
              },
              park: {
                title: 'Wirkpfad Boden-Mensch: Park- und Freizeitanlagen',
                unit: 'mg/kg TM (Trockenmasse im Feststoff)',
                values: { 'Arsen (As)': 125, 'Blei (Pb)': 1000, 'Cadmium (Cd)': 50, 'Chrom (Cr)': 500, 'Nickel (Ni)': 350, 'Quecksilber (Hg)': 70, 'Benzo(a)pyren': 10 }
              },
              industrie: {
                title: 'Wirkpfad Boden-Mensch: Industrie- und Gewerbeflächen',
                unit: 'mg/kg TM (Trockenmasse im Feststoff)',
                values: { 'Arsen (As)': 140, 'Blei (Pb)': 2000, 'Cadmium (Cd)': 60, 'Chrom (Cr)': 1000, 'Nickel (Ni)': 900, 'Quecksilber (Hg)': 80, 'Benzo(a)pyren': 12 }
              },
              grundwasser: {
                title: 'Wirkpfad Boden-Grundwasser: Sickerwasserpfad (Universal)',
                unit: 'µg/l im Eluat / Sickerwasser',
                values: { 'Arsen (As)': 10, 'Blei (Pb)': 10, 'Cadmium (Cd)': 0.5, 'Chrom (Cr-Gesamt)': 50, 'Nickel (Ni)': 20, 'Quecksilber (Hg)': 0.2, 'PFAS (Summe 4)': 0.1 }
              },
              nutzpflanze: {
                title: 'Wirkpfad Boden-Nutzpflanze: Landwirtschaft / Nutzgärten',
                unit: 'mg/kg TM (Pflanzenverfügbare Fraktion)',
                values: { 'Cadmium (Cd)': 0.1, 'Blei (Pb)': 0.1, 'Quecksilber (Hg)': 1.0 }
              }
            };

            const selectedBbod = bbodData[bbodNutzungsart] || bbodData.wohngebiet;

            return (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="border-b border-home-grau/30 pb-4">
                  <h3 className="text-2xl font-bold text-slate-850 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-shiraz" />
                    Altlasten &amp; Bodenschutz (BBodSchG / BBodSchV)
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Das Bundes-Bodenschutzgesetz (BBodSchG) schützt den Boden vor schädlichen Veränderungen, regelt die Sanierung kontaminierter Altstandorte und setzt strenge Grenzen für Belastungen nach dem Wirkungspfad-Prinzip.
                  </p>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 shadow-sm relative mb-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-shiraz mb-2 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4" /> Die 3 gesetzlichen Wirkungspfade
                      </h4>
                      <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                        Schadstoffe im Boden werden nicht isoliert betrachtet, sondern stets bezogen auf konkrete "Wirkpfade" (Wege, auf denen Lebewesen oder das Grundwasser gefährdet werden) bewertet:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 font-semibold font-medium">
                        <li><strong>Boden-Mensch:</strong> Direkter Kontakt, Verschlucken von kontaminierter Erde (z.B. Kleinkinder auf Spielplätzen), Einatmen belasteter Staubpartikel.</li>
                        <li><strong>Boden-Nutzpflanze:</strong> Schadstofftransfer aus dem Boden in die Nutzpflanzenwurzel (Gefahr in der landwirtschaftlichen Nahrungskette).</li>
                        <li><strong>Boden-Grundwasser:</strong> Schadstoffauswaschung durch Niederschlagswasser durch den Bodenkörper ins nutzbare Grundwasser (Sickerwasserprognose).</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                        <Scale className="w-4 h-4 text-slate-500" /> Prüf- vs. Maßnahmenwerte
                      </h4>
                      <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                        Die Verordnung unterscheidet scharf zwischen zwei Bewertungsschwellen:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 leading-relaxed font-semibold font-medium">
                        <li>
                          <strong className="text-slate-800">Prüfwerte (Triggers):</strong> Bei Überschreitung besteht ein "Altlastenverdacht". Die Behörde fordert zwingend weiterführende Detailuntersuchungen (z.B. qualifizierte Tiefenbohrungen).
                        </li>
                        <li>
                          <strong className="text-shiraz">Maßnahmenwerte (Action Limits):</strong> Bei Überschreitung besteht unmittelbare Gefahr für die Gesundheit oder das Grundwasser. Es besteht sofortiger, gesetzlicher Handlungsbedarf (Sanierung, Kapselung, Absperrung oder Nutzungsbeschränkung).
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Interactive BBodSchV Prüfwerte Selector */}
                <div className="p-5 bg-white border border-home-grau/30 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">BBodSchV Prüfwerte-Katalog</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Nutzen Sie den interaktiven Pfad-Checker, um die gesetzlichen Prüfwerte nach der novellierten Bundes-Bodenschutzverordnung (BBodSchV, gültig seit 01.08.2023) abzurufen.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Szenario / Nutzungspfad:</label>
                        <select
                          className="w-full text-xs font-mono bg-slate-50 border border-home-grau/30 rounded-lg p-2.5 outline-none focus:border-home-grau/30"
                          value={bbodNutzungsart}
                          onChange={(e) => setBbodNutzungsart(e.target.value)}
                        >
                          <option value="spielplatz">Boden-Mensch: Kinderspielplätze</option>
                          <option value="wohngebiet">Boden-Mensch: Wohngebiete</option>
                          <option value="park">Boden-Mensch: Park- und Freizeitanlagen</option>
                          <option value="industrie">Boden-Mensch: Industrie- und Gewerbeflächen</option>
                          <option value="grundwasser">Boden-Grundwasser: Sickerwasserpfad</option>
                          <option value="nutzpflanze">Boden-Nutzpflanze: Landwirtschaft / Gärten</option>
                        </select>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-xs text-slate-500">
                        📌 <strong>Wirkungspfad-Logik:</strong> Die Werte für Kinderspielplätze sind extrem niedrig angesetzt, da Kleinkinder beim Spielen Schmutz oral aufnehmen ("Pica-Verhalten"). Für Gewerbeflächen gelten bis zu 10-fach höhere Grenzwerte.
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <div className="border-b border-home-grau/30 pb-2 flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">{selectedBbod.title}</span>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-500">{selectedBbod.unit}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(selectedBbod.values).map(([contaminant, value]) => (
                        <div key={contaminant} className="p-3 bg-slate-50/50 rounded-xl border border-home-grau/30 flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-700">{contaminant}</span>
                          <span className="font-mono font-extrabold text-slate-900 bg-white border border-home-grau/30 px-2.5 py-1 rounded shadow-xs">≤ {value}</span>
                        </div>
                      ))}
                    </div>

                    {bbodNutzungsart === 'grundwasser' && (
                      <div className="mt-3 p-3 bg-indigo-50 border border-indigo-150 rounded-xl text-xs text-indigo-900 leading-relaxed font-semibold">
                        🌱 <strong>PFAS-Meilenstein 2023:</strong> Unter der novellierten BBodSchV sind die per- und polyfluorierten Alkylsubstanzen (PFAS, "Ewigkeitschemikalien") erstmals explizit mit einem bundeseinheitlichen Eluatprüfwert von 0.1 µg/l für die Summe aus vier Hauptverbindungen (PFOA, PFOS, PFHxS, PFNA) gesetzlich geregelt. Dies bürdet Bauherren erhebliche Erkundungspflichten auf.
                      </div>
                    )}
                  </div>
                </div>

                {/* Physikalischer Bodenschutz */}
                <div className="p-5 bg-white border border-home-grau/30 rounded-2xl shadow-md space-y-4">
                  <h4 className="font-bold text-slate-950 text-sm flex items-center gap-11.5">
                    <Leaf className="w-5 h-5 text-emerald-600 inline mr-2" />
                    Physikalischer Bodenschutz auf Baustellen (§ 17 BBodSchV)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Neben der chemischen Schadstoffbelastung verpflichtet das modernisierte Bodenschutzrecht Planer und Ausführende zu einem sorgsamen Umgang mit der Bodenstruktur selbst. Schwere Erdbewegungsmaschinen können irreversible Zerstörungen im Bodengefüge (Verdichtung, Scherspannungen) anrichten.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 space-y-2 border border-home-grau/30">
                      <h5 className="font-bold text-slate-900">1. Vermeidung von Bodenschäden (Konstruktive Maßnahmen)</h5>
                      <ul className="space-y-1.5 text-slate-600 font-medium">
                        <li>• <strong className="text-slate-800">Bodendruck reduzieren:</strong> Verwendung von Kettenlaufwerken, Breitreifen im Niederdruckbereich (≤ 0.8 bar) oder Baggermatten aus Hartholz.</li>
                        <li>• <strong className="text-slate-800">Hydrologische Grenzwerte einhalten:</strong> Keine Befahrung von weichen, schluffigen oder tonigen Böden im feuchten Zustand (pF-Wert ≤ 1.8 oder Saugspannung beachten).</li>
                        <li>• <strong className="text-slate-800">Mutterbodenschutz:</strong> Abtrag des Oberbodens (Mutterboden) vor Baubeginn und sachgemäße Lagerung in Mieten (≤ 2 m Höhe, Belüftung bewahren) zur Erhaltung der Mikrobiologie.</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 space-y-2 border border-home-grau/30">
                      <h5 className="font-bold text-slate-900">2. Bodenkundliche Baubegleitung (BBB) Pflicht</h5>
                      <ul className="space-y-1.5 text-slate-600 font-medium">
                        <li>• <strong className="text-slate-800">Wann erforderlich?</strong> Gesetzlich empfohlen und oft baurechtlich erzwungen bei Bauvorhaben mit Bodenbewegungen ≥ 3.000 m³ oder auf sensiblem Agrarland.</li>
                        <li>• <strong className="text-slate-800">Aufgabe der BBB:</strong> Freigabe von Fahrtrassen, Festlegen von temperatur- und feuchtigkeitsbedingten Erdbaupausen (z. B. Baustopp bei Staunässe), Qualitätskontrolle bei der Rekultivierung.</li>
                        <li>• <strong className="text-slate-800">Wiederherstellungspflicht:</strong> Nach Bauabschluss muss verdichtetes Gelände im Unterboden tiefengelockert werden, bevor der Oberboden schonend aufgetragen wird.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-xl mb-6">
                  <h4 className="font-bold text-indigo-900 mb-2">Bodenmaterialklassen: Z-Klassen &amp; BM-Klassen</h4>
                  <p className="text-sm text-indigo-900 mb-3 leading-relaxed">
                    Boden und Bauabfälle werden für ihre Verwertung oder Entsorgung je nach Schadstoffbelastung klassifiziert. Dies ist extrem wichtig für die Vergabe von Erdarbeiten:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-indigo-100">
                      <h5 className="font-bold text-indigo-800 text-sm mb-1">ErsatzbaustoffV (aktuell): BM-Klassen</h5>
                      <p className="text-xs text-indigo-900 mb-2">
                         Nach der (seit Aug 2023 gültigen) Ersatzbaustoffverordnung (EBV) wird Bodenmaterial ("BM") in neue Güteklassen eingeteilt:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-xs text-indigo-900">
                        <li><strong className="text-indigo-800 font-bold">BM-0 / BM-0*:</strong> Unbelastetes bis geringfügig verändertes Bodenmaterial (z.B. vergleichbar mit Sandkastensand). Sehr hohe Verwertbarkeit ohne Einschränkungen.</li>
                        <li><strong className="text-indigo-800 font-bold">BM-F1:</strong> Bodenmaterial mit etwas mehr Feinkorn und sehr leichten Belastungen. In bestimmten Bauweisen frei verwendbar.</li>
                        <li><strong className="text-indigo-800 font-bold">BM-F2 / BM-F3:</strong> Zunehmende Schadstoffgehalte, erfordern oft bautechnischen Grundwasserschutz beim Wiedereinbau.</li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-indigo-100">
                      <h5 className="font-bold text-indigo-800 text-sm mb-1">LAGA M20 (Historisch / Bodenverwertung): Z-Klassen</h5>
                      <p className="text-xs text-indigo-900 mb-2">
                        Lange Zeit das Standardwerk. Viele Ausschreibungen und Deponien referenzieren oft noch die "Zuordnungswerte" (Z-Klassen) der alten LAGA M20:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-xs text-indigo-900">
                        <li><strong className="text-indigo-800 font-bold">Z 0 / Z 0 *:</strong> Uneingeschränkt verwertbar (unbelasteter Erdaushub).</li>
                        <li><strong className="text-indigo-800 font-bold">Z 1.1 / Z 1.2:</strong> Eingeschränkt verwertbarer Boden (mit technischen Sicherungsmaßnahmen nutzbar, z.B. unter Asphalt).</li>
                        <li><strong className="text-indigo-800 font-bold">Z 2:</strong> Eingeschränkt verwertbar mit definierten technischen Sicherungen, höhere Belastungen.</li>
                        <li><strong className="text-indigo-800 font-bold">&gt; Z 2:</strong> Meist Deponierung auf DK I bis DK III oder thermische/biologische Bodenaufbereitung nötig.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-1.5">
                    <Scale className="w-5 h-5 text-slate-600" /> Stufenweiser Ablauf der Altlastenbearbeitung
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-home-grau/30 flex flex-col justify-between">
                      <div>
                        <div className="text-shiraz font-bold text-xl mb-1">1.</div>
                        <div className="font-bold text-xs mb-1.5">Historische Erkundung</div>
                        <div className="text-xs text-gray-600 leading-relaxed">Recherche in Bauakten, Archiven und Luftbildern: Gab es Bombenabwürfe? War hier eine chemische Reinigung, alte Gerberei oder Tankstelle?</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-home-grau/30 flex flex-col justify-between">
                      <div>
                        <div className="text-shiraz font-bold text-xl mb-1">2.</div>
                        <div className="font-bold text-xs mb-1.5">Orientierende Untersuchung</div>
                        <div className="text-xs text-gray-600 leading-relaxed font-semibold">Erste Bohrungen (Rammkerness-Schürfe) und Laboranalysen. Bestätigt sich der Altlastenverdacht? Sind Prüfwerte (Trigger-Werte) überschritten?</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-home-grau/30 flex flex-col justify-between">
                      <div>
                        <div className="text-shiraz font-bold text-xl mb-1">3.</div>
                        <div className="font-bold text-xs mb-1.5">Detailuntersuchung</div>
                        <div className="text-xs text-gray-600 leading-relaxed font-semibold">Exakte 3D-Abgrenzung des Kontaminationsherds (Schadstofffahne). Fundierte Gefährdungsabschätzung (Sickerwasserprognose, Grundwassermonitoring).</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-home-grau/30 flex flex-col justify-between">
                      <div>
                        <div className="text-shiraz font-bold text-xl mb-1">4.</div>
                        <div className="font-bold text-xs mb-1.5">Sanierung / Sicherung</div>
                        <div className="text-xs text-gray-600 leading-relaxed font-semibold">Bodenaustausch (Aushub/Verfüllung), Bodenluftabsaugung, Pump-and-Treat (Wasserreinigung) oder Einkapselung (Spundwände/Versiegelung).</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Rückbau */}
          {activeTab === 'rueckbau' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                Selektiver Rückbau & Verwertungspraxis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200">
                  <h4 className="font-bold text-indigo-800 mb-3">Die Vorbereitungsphase</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-indigo-900">
                    <li><strong>Gebäudeschadstoffkataster:</strong> Die VDI-Richtlinie 6202 fordert eine systematische Untersuchung <em>vor</em> dem Rückbau. Sonst extreme Nachtrags- und Stillstandrisiken!</li>
                    <li><strong>Schadstoffsanierung:</strong> Erst müssen Asbest, PAK, PCB etc. durch Spezialfirmen fachgerecht ausgebaut werden (Schwarz-Weiß-Bereiche).</li>
                    <li><strong>Entkernung:</strong> Ausbau von Fenstern, Türen, Haustechnik, Kabeln, Bodenbelägen und Dämmstoffen. Das Gebäude wird auf den "mineralischen Rohbau" abisoliert.</li>
                  </ul>
                </div>
                <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200">
                  <h4 className="font-bold text-indigo-800 mb-3">Der mineralische Rückbau</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-indigo-900">
                    <li><strong>Zerkleinerung & Sortierung:</strong> Einsatz von Abbruchzangen (Longfront-Bagger). Sortenreine Trennung (Ziegel vs. Beton) direkt auf der Baustelle anstreben.</li>
                    <li><strong>Aufbereitungsanlage:</strong> Brecheranlagen (Backenbrecher/Prallmühle) zerkleinern den Beton. Magnetabscheider sortieren den Bewehrungsstahl aus. Windsichter entfernen Störstoffe (Plastikfetzen, Holzreste).</li>
                    <li><strong>Siebung:</strong> Trennung in Norm-Körnungen (z.B. Sand 0/4, Kies 4/8, 8/16, 16/32).</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h4 className="font-bold text-shiraz flex gap-2 items-center mb-3">
                   Vom Bauschutt zum R-Beton
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  Rezyklierte Gesteinskörnungen können normgerecht zur Herstellung von neuem Konstruktionsbeton genutzt werden (DIN EN 206 / DIN 1045-2 / DAfStb-Richtlinie).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <h5 className="font-bold text-black mb-1">Typ 1 (Betonsplitt)</h5>
                    <p>Mind. 90% reiner Beton/Trockenmauermörtel. Max. RC-Anteil (Austausch in grober Körnung) liegt je nach Expositionsklasse bei bis zu 45%.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-black mb-1">Typ 2 (Bauwerksbruch)</h5>
                    <p>Ziegelreicher Bauschutt. Erheblich restriktiverer Einsatz: Deutlich höhere Wasseraufnahme, geringere Festigkeit. Max. Austausch ca. 25-35%.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nachweise (eANV) */}
          {activeTab === 'eanv' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-gray-700" />
                Elektronisches Abfallnachweisverfahren (eANV)
              </h3>
              <p className="text-gray-700">
                Die Nachweisverordnung (NachwV) regelt die Überwachung der Entsorgung von <strong>gefährlichen Abfällen</strong>. Um eine lückenlose Kontrolle zu gewährleisten, erfolgt dies papierlos über das eANV (ZKS-Abfall).
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                  <h4 className="font-bold text-shiraz mb-3">Die wichtigsten Akteure</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Erzeuger:</strong> Der Bauherr bzw. die ausführende Baufirma. Ab 2 t gefährlichem Abfall pro Jahr wird eine Erzeugernummer der Behörde benötigt.</li>
                    <li><strong>Beförderer:</strong> Das Transportunternehmen (Logistik). Benötigt eine Beförderernummer.</li>
                    <li><strong>Entsorger:</strong> Die Deponie oder Behandlungsanlage. Benötigt eine Entsorgernummer.</li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                  <h4 className="font-bold text-shiraz mb-3">Dokumenten-Arten</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Entsorgungsnachweis (EN):</strong> Eine Vorabprüfung. Der Entsorger prüft die Laboranalysen und bestätigt, dass er den Abfall annehmen darf. Die Behörde muss ggf. zustimmen.</li>
                    <li><strong>Begleitschein (BGS):</strong> Begleitet den tatsächlichen Transport. Erzeuger, Beförderer und Entsorger müssen ihn nacheinander elektronisch signieren (Qualifizierte elektronische Signatur - QeS mittels Signaturkarte).</li>
                    <li><strong>Übernahmeschein (ÜNS):</strong> Wird beim Sammelentsorgungsverfahren (z.B. Kleinmengen) genutzt.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-gray-400 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-gray-800 mb-1">Registerpflicht (§ 49 KrWG)</h4>
                <p className="text-sm text-gray-700">
                  Sowohl Erzeuger, Beförderer als auch Entsorger müssen Register über die abgewickelten gefährlichen Abfälle führen und diese Unterlagen mindestens 3 Jahre (bei Entsorgern länger) aufbewahren und den Umweltbehörden auf Verlangen vorlegen.
                </p>
              </div>
            </div>
          )}

          {/* Probenahme LAGA PN 98 */}
          {activeTab === 'pn98' && (() => {
            // Calculate LAGA PN 98 limits dynamically
            let einzelproben = 4;
            let mischproben = 1;

            if (pnMaterialState === 'homogen') {
              if (pnVolume <= 30) {
                einzelproben = 4;
                mischproben = 1;
              } else if (pnVolume <= 100) {
                einzelproben = 6;
                mischproben = 1;
              } else if (pnVolume <= 500) {
                einzelproben = 12;
                mischproben = 1;
              } else if (pnVolume <= 1000) {
                einzelproben = 18;
                mischproben = 1;
              } else {
                const multi = Math.ceil((pnVolume - 1000) / 1000);
                einzelproben = 18 + multi * 6;
                mischproben = 1 + multi;
              }
            } else {
              // heterogen
              if (pnVolume <= 30) {
                einzelproben = 10;
                mischproben = 1;
              } else if (pnVolume <= 100) {
                einzelproben = 15;
                mischproben = 1;
              } else if (pnVolume <= 500) {
                einzelproben = 30;
                mischproben = 2;
              } else if (pnVolume <= 1000) {
                einzelproben = 45;
                mischproben = 3;
              } else {
                const multi = Math.ceil((pnVolume - 1000) / 1000);
                einzelproben = 45 + multi * 15;
                mischproben = 3 + multi;
              }
            }

            // Container size constraints based on grain size
            let minVolEinzel = 5.0;
            let minVolVerbund = 10.0;
            let grainLabel = 'Grobkörnig (bis 32 mm)';

            if (pnGrainSize === '2') {
              minVolEinzel = 0.5;
              minVolVerbund = 2.0;
              grainLabel = 'Sehr feinkörnig (≤ 2 mm)';
            } else if (pnGrainSize === '8') {
              minVolEinzel = 1.0;
              minVolVerbund = 4.0;
              grainLabel = 'Feinkörnig (≤ 8 mm)';
            } else if (pnGrainSize === '16') {
              minVolEinzel = 1.5;
              minVolVerbund = 6.0;
              grainLabel = 'Mittelkörnig (≤ 16 mm)';
            } else if (pnGrainSize === '32') {
              minVolEinzel = 5.0;
              minVolVerbund = 10.0;
              grainLabel = 'Grobkörnig (≤ 32 mm)';
            } else if (pnGrainSize === '63') {
              minVolEinzel = 10.0;
              minVolVerbund = 20.0;
              grainLabel = 'Sehr grobkörnig (≤ 63 mm)';
            } else if (pnGrainSize === '120') {
              minVolEinzel = 20.0;
              minVolVerbund = 40.0;
              grainLabel = 'Blockig / Stückig (> 63 mm)';
            }

            return (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="border-b border-home-grau/30 pb-4">
                  <h3 className="text-2xl font-bold text-slate-850 flex items-center gap-2">
                    <Search className="w-6 h-6 text-emerald-600" />
                    Probenahme nach LAGA PN 98 &amp; DIN 19698
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Bauabfall- und Bodendeklarationen erfordern repräsentative Sammelanalysen von Haufwerken (Haufwerksbeprobung) nach bundeseinheitlichen Standards, um Fehlentsorgungen und Haftungskonsequenzen auszuschließen.
                  </p>
                </div>

                {/* Calculator Grid */}
                <div className="p-5 bg-white border border-home-grau/30 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Controls Column */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Interaktiver Beprobungsplaner</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Berechnen Sie das offizielle Probenahmeschema nach der LAGA PN 98 Richtline sowie DIN 19698-1 für Haufwerke.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">1. Haufwerksvolumen (m³):</label>
                        <input
                          type="number"
                          min="1"
                          max="20000"
                          className="w-full text-xs font-mono bg-slate-50 border border-home-grau/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                          value={pnVolume}
                          onChange={(e) => setPnVolume(Math.max(1, parseInt(e.target.value) || 0))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">2. Homogenität des Materials:</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPnMaterialState('homogen')}
                            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              pnMaterialState === 'homogen'
                                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                                : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                            }`}
                          >
                            Homogen
                            <span className="block text-xs opacity-80 font-normal mt-0.5">(z.B. reiner Asphalt, Sand)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPnMaterialState('heterogen')}
                            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              pnMaterialState === 'heterogen'
                                ? 'bg-shiraz text-white border-shiraz shadow-sm'
                                : 'bg-white text-slate-700 border-home-grau/30 hover:bg-slate-50'
                            }`}
                          >
                            Heterogen
                            <span className="block text-xs opacity-80 font-normal mt-0.5">(z.B. Bauschutt, Hausmüll)</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">3. Größtkorn d (mm):</label>
                        <select
                          className="w-full text-xs bg-slate-50 border border-home-grau/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                          value={pnGrainSize}
                          onChange={(e) => setPnGrainSize(e.target.value)}
                        >
                          <option value="2">Sand / Feinmaterial (d ≤ 2 mm)</option>
                          <option value="8">Feinkorn / Siebschutt (d ≤ 8 mm)</option>
                          <option value="16">Splitt / mittlerer Schutt (d ≤ 16 mm)</option>
                          <option value="32">Regelfall Bauschutt-Brechergut (d ≤ 32 mm)</option>
                          <option value="63">Grobmaterial / Bahnschotter (d ≤ 63 mm)</option>
                          <option value="120">Blockig / Ungebrochen / Massiv (d &gt; 63 mm)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Results Column */}
                  <div className="md:col-span-2 space-y-4">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Vorgeschriebener Beprobungsumfang (Tabelle 2 LAGA)</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Card 1: Einzelproben */}
                      <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black text-slate-500 uppercase">Anzahl Einzelproben (EP)</span>
                          <div className="text-3xl font-extrabold text-emerald-800 mt-1">{einzelproben}</div>
                          <p className="text-xs text-slate-500 mt-1 leading-normal">
                            Einzelproben müssen gleichmäßig verteilt über drei Dimensionen (oben, mitte, unten, tief im Haldenkörper) entnommen werden.
                          </p>
                        </div>
                      </div>

                      {/* Card 2: Mischproben */}
                      <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black text-slate-500 uppercase">Labor- / Mischproben (MP)</span>
                          <div className="text-3xl font-extrabold text-emerald-800 mt-1">{mischproben}</div>
                          <p className="text-xs text-slate-500 mt-1 leading-normal">
                            Die EP werden zu {mischproben} repräsentativen Mischprobe(n) vereint und anschließend fachgerecht homogenisiert.
                          </p>
                        </div>
                      </div>

                      {/* Card 3: Mindestvolumen Einzelprobe */}
                      <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black text-slate-500 uppercase">Mindestvolumen je Einzelprobe</span>
                          <div className="text-2xl font-extrabold text-slate-800 mt-1">{minVolEinzel} Liter <span className="text-xs font-semibold text-slate-500">({minVolEinzel} kg)</span></div>
                          <p className="text-xs text-slate-500 mt-1 leading-normal">
                            Abhängig vom Größtkorn. Zu geringe Probemengen verletzen das Repräsentativitätsgebot der LAGA Richtlinie.
                          </p>
                        </div>
                      </div>

                      {/* Card 4: Mindestvolumen Verbundprobe */}
                      <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black text-slate-500 uppercase">Laborproben-Sollvolumen</span>
                          <div className="text-2xl font-extrabold text-slate-800 mt-1">{minVolVerbund} Liter <span className="text-xs font-semibold text-slate-500">({minVolVerbund} kg)</span></div>
                          <p className="text-xs text-slate-500 mt-1 leading-normal">
                            Mindestvolumen der laborbereiten Probe nach Homogenisierung (mittels Kegel- &amp; Viertelmethode oder Probenteiler).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-150 text-xs leading-relaxed text-emerald-950 font-semibold">
                      📋 <strong className="text-emerald-900 leading-normal">Gesamtbilanz für {pnVolume} m³ ({pnMaterialState}):</strong> Es müssen mindestens <strong>{einzelproben} Einzelproben</strong> à <strong>{minVolEinzel} l</strong> gezogen werden. Das Gesamtgewicht des Beprobungsvorganges im Feld liegt somit bei mindestens <strong>{formatDeZahl(einzelproben * minVolEinzel, 1)} Litern / kg</strong> mineralischem Probengut, um daraus die <strong>{mischproben} Laborprobe(n)</strong> zu speisen.
                    </div>
                  </div>
                </div>

                {/* Legal and methodological guidance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                      <Scale className="w-4 h-4 text-slate-500" />
                      Entscheidende Abgrenzung: LAGA PN 98 vs. DIN 19698
                    </h4>
                    <p className="text-slate-600">
                      In Ausschreibungen und Prüfberichten herrscht oft Verwirrung über die geltenden Normen. Unter der <strong>Mantelverordnung 2023</strong> ist die Lage vom Gesetzgeber klarer geregelt worden:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600 font-semibold">
                      <li>
                        <strong>Geltungsbereich Boden &amp; Ersatzbaustoffe (§ 14 BBodSchV):</strong> Beprobungen von anstehendem Boden, Bodenaushub und Boden-Ersatzbaustoffen (unter BBodSchV bzw. EBV) verlangen zwingend die Anwendung der <strong>DIN 19698-1</strong> (Grundregeln) und <strong>DIN 19698-2</strong> (Spezifische Parameter). Das LAGA PN 98 Regelwerk bleibt historisches Fundament, wird aber im Bodenschutzrecht formell durch DIN abgelöst.
                      </li>
                      <li>
                        <strong>Geltungsbereich Bauschutt &amp; Deponien (§ 6 DepV):</strong> Bauschuttfraktionen und Zuordnungsanalysen mineralischer Abfälle zur Deponierung stützen sich nach wie vor auf den Vollzug der <strong>LAGA PN 98</strong> in Kombination mit landsspezifischen Richtlinien des Landesamtes für Umwelt (z.B. Bayern, Thüringen, Hessen).
                      </li>
                      <li>
                        <strong>Die Probenahmestrategie:</strong> Beide Normen fordern für Haufwerke das systematische Abtragen oder Durchstechen mittels Baggerschaufeln und weisen oberflächliche Entnahmen (Randbeprobungen) scharf zurück.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 space-y-3">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Landesrecht &amp; Erleichterte Probenahmen
                    </h4>
                    <p className="text-slate-600">
                      Um kleine Baustellen vor übertriebenen Laborkosten zu schützen, haben viele Landesämter für Umwelt (LfU) Ausnahmeregeln erlassen:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600 font-semibold">
                      <li>
                        <strong>Bayerisches Landesamt für Umwelt (LfU Bayern):</strong> Erbaushubhaufen von Kleinstbauvorhaben im privaten Bereich können bei Volumina <strong>&lt; 50 m³</strong> oft vereinfacht mit 2 bis 3 Mischproben ohne vollumfängliches PN 98 Raster deklariert werden, sofern kein Altlastverdacht (Vornutzung) besteht.
                      </li>
                      <li>
                        <strong>Das "Vierteln &amp; Schaufeln"-Verfahren:</strong> Zur Verkleinerung und Homogenisierung wird der Haufwerks-Gesamtauszug kegelförmig aufgeschüttet, in vier Quadranten geteilt, wovon zwei gegenüberliegende Viertel verworfen werden. Dieser Vorgang wird wiederholt, bis das Sollvolumen der Laborflaschen erreicht ist.
                      </li>
                      <li>
                        <strong>Gefahrenquelle Falschbeprobung:</strong> Gerichtlich anerkannte Beweissicherungsverfahren scheitern fast ausnahmslos an Fehlern beim Beprobungsprotokoll oder fehlenden Sachkundenachweisen der Probenehmer.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Checklisten */}
          {activeTab === 'checklisten' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-slate-50 p-5 rounded-2xl border border-home-grau/30">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <ClipboardList className="w-5 h-5 text-shiraz" />
                  Praxis-Checklisten für Abfälle, Altlasten und Rückbau
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Kompakte und rechtssichere Handlungsanleitungen für die Baustellenpraxis. Wählen Sie unten ein Thema aus, um die detaillierte Checkliste für anfallende Prozesse anzuzeigen.
                </p>
              </div>

              {/* Sub-Tabs / Reiter */}
              <div className="flex flex-wrap gap-2 border-b border-home-grau/20 pb-4">
                {[
                  { id: 'einstufung', label: '1. Abfalleinstufung', icon: List, desc: 'KrWG / AVV / GewAbfV' },
                  { id: 'mineralik', label: '2. Ersatzbaustoffe', icon: Recycle, desc: 'EBV / Einbau' },
                  { id: 'rueckbau', label: '3. Rückbau-Audit', icon: ShieldCheck, desc: 'VDI 6202 / Abbruch' },
                  { id: 'deponie', label: '4. Deponierung', icon: Database, desc: 'DepV / DK-Zuordnung' },
                  { id: 'probenahme', label: '5. Probenahme', icon: Search, desc: 'LAGA PN 98 / DIN 19698' },
                  { id: 'gefahrstoffe', label: '6. Gefahrstoffe & PSA', icon: AlertTriangle, desc: 'TRGS 519 / 521 / 524' }
                ].map((subTab) => {
                  const Icon = subTab.icon;
                  const isActive = activeChecklistSubTab === subTab.id;
                  return (
                    <button
                      key={subTab.id}
                      onClick={() => setActiveChecklistSubTab(subTab.id as any)}
                      className={`flex-1 min-w-[150px] p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-shiraz/5 border-shiraz shadow-sm ring-1 ring-shiraz/35'
                          : 'bg-white border-home-grau/30 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <Icon size={16} className={isActive ? 'text-shiraz' : 'text-slate-500'} />
                        <span className={`text-xs font-bold ${isActive ? 'text-shiraz' : 'text-slate-800'}`}>
                          {subTab.label}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 block leading-tight font-medium">
                        {subTab.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Checklist Content */}
              <div className="bg-white rounded-2xl border border-home-grau/30 p-6 space-y-6">
                {activeChecklistSubTab === 'einstufung' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Scale className="text-shiraz w-5 h-5" /> Leitfaden zur rechtssicheren Abfalleinstufung (§ 3, 5, 8 KrWG &amp; AVV)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Rechtliche Zuordnung, Bestimmung gefährlicher/nicht gefährlicher Abfälle und Voraussetzungen für das Erreichen des Produktstatus (Abfallende).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          step: 1,
                          title: 'Getrennthaltung prüfen (§ 8 GewAbfV)',
                          desc: 'Sammeln Sie sämtliche Abbruch- und Bauabfälle (Beton, Ziegel, Fliesen, Holz, Glas, Kunststoffe, Metalle, Bitumengemische) strikt getrennt vor Ort. Falls dies technisch unmöglich oder wirtschaftlich unzumutbar ist, erstelle ein lückenloses Abfall-Getrennthaltungsprotokoll (§ 8 Abs. 3 GewAbfV) zur Vorlage bei der Kreisbehörde.',
                          ref: 'Gewerbeabfallverordnung § 8'
                        },
                        {
                          step: 2,
                          title: 'Erstzuordnung nach Herkunft (AVV Kap. 17)',
                          desc: 'Suchen Sie die zutreffende Abfallbezeichnung im Kapitel 17 (Bau- und Abbruchabfälle inklusive Baustellenaushub) der Abfallverzeichnis-Verordnung heraus. Nutzen Sie z. B. 17 01 01 für reinen Beton, 17 01 02 für Ziegel oder 17 05 04 für Bodenaushub.',
                          ref: 'AVV Anhang 1 Kapitel 17'
                        },
                        {
                          step: 3,
                          title: 'Prüfung auf historische / verdeckte Schadstoffe',
                          desc: 'Bewerten Sie Schadstoffrisiken anhand des Baujahres des Gebäudes (Asbest-Verdacht vor 1993, KMF-Verdacht vor 2000, Teer-Verdacht im Straßenbau bei alten Asphaltbelägen) und recherchieren Sie die historische Nutzung des Grundstücks im Altlastenkataster.',
                          ref: 'VDI 6202 Blatt 1'
                        },
                        {
                          step: 4,
                          title: 'Identifikation von Spiegeleinträgen',
                          desc: 'Analysieren Sie, ob Ihre Abfallfraktion als Spiegeleintrag deklariert ist (z.B. gefährlich: 17 05 03* vs. nicht gefährlich: 17 05 04 für Boden). Ist dies der Fall, müssen chemische Laborprüfungen angestrengt werden, um die Unterschreitung der Gefährlichkeitskriterien zu belegen.',
                          ref: 'AVV Einleitung Abs. 2 / Bmuv'
                        },
                        {
                          step: 5,
                          title: 'Prüfung der kumulativen Voraussetzungen des Abfallendes (§ 5 KrWG)',
                          desc: 'Kann das Material die Abfalleigenschaft verlieren und Produktstatus erlangen? Prüfe: 1) Zweckbestimmung (Nutzung für Wegebau o.ä.), 2) Marktnachfrage, 3) Erfüllung aller technischen Normen (z.B. Frostschutz nach TL BuB), 4) Unbedenklichkeit für Mensch und Umwelt (EBV-Konformität).',
                          ref: 'Kreislaufwirtschaftsgesetz § 5 (1)'
                        },
                        {
                          step: 6,
                          title: 'Dokumentation & Nachweisführung über das eANV',
                          desc: 'Handelt es sich um einen gefährlichen Abfall (mit * markiert), muss das elektronische Abfallnachweisverfahren genutzt werden. Generieren Sie behördliche Erzeugernummern, Entsorgungsnachweise sowie Begleit- oder Übernahmescheine und archivieren Sie diese 5 Jahre im Abfallregister.',
                          ref: 'Nachweisverordnung (NachwV) § 4'
                        }
                      ].map((item) => (
                        <div key={item.step} className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 hover:border-shiraz/20 transition-all flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs font-mono">
                                {item.step}
                              </span>
                              <h5 className="font-bold text-slate-900 text-xs">
                                {item.title}
                              </h5>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                              {item.desc}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono font-medium text-slate-400">
                            <span>Status: Beachtungspflichtig</span>
                            <span className="text-shiraz">{item.ref}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeChecklistSubTab === 'mineralik' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Recycle className="text-shiraz w-5 h-5" /> Qualitätssicherung &amp; Wiedereinbau mineralischer Ersatzbaustoffe (EBV)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Voraussetzungen für den rechtskonformen Wiedereinbau von güteüberwachten Recycling-Baustoffen (RC) und Bodenmaterialien (BM).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          step: 1,
                          title: 'Güteüberwachung des RC-Herstellers absichern',
                          desc: 'Stelle sicher, dass der Sekundärbaustoff aus einer gemäß EBV zugelassenen Brech- und Siebanlage stammt. Fordern Sie das aktuelle QUBA-Gütezeichen (Qualitätssicherung Sekundärbaustoffe) oder das landesspezifische QRB-Zertifikat an.',
                          ref: 'EBV § 4 - § 11'
                        },
                        {
                          step: 2,
                          title: 'Konformitätszertifikat & Laborwerte prüfen',
                          desc: 'Sichten Sie die werkseigene Produktionskontrolle (WPK) und die Fremdüberwachungsberichte des Herstellers. Vergleiche die deklarierte Materialklasse (z.B. RC-1, RC-2 oder BM-0) mitsamt den Laboranalysen.',
                          ref: 'EBV Anhang 1 Tabellen'
                        },
                        {
                          step: 3,
                          title: 'Standortbezogene Schutzgebiete abgleichen',
                          desc: 'Überprüfen Sie, ob sich der geplante Einbauort außerhalb von empfindlichen Wasserschutzgebieten (WSG Zone I, II, III/IIIA), Heilquellenschutzgebieten oder Überschwemmungsgebieten befindet. In Zone I und II gilt ein generelles Anwendungsverbote für alle MEB.',
                          ref: 'EBV § 19 & Anhang 2'
                        },
                        {
                          step: 4,
                          title: 'Mindestabstand zum Grundwasser (HGW) sicherstellen',
                          desc: 'Ermitteln Sie den höchsten Grundwasserstand (HGW). Bei Verbau von RC-1/BM-1 ist ein Sicherheitsabstand von mindestens 1,0 m einzuhalten. Bei offener (unversiegelter) Bauweise ohne dichte Deckschicht gelten andere Grenzwerte.',
                          ref: 'EBV § 20'
                        },
                        {
                          step: 5,
                          title: 'Bautechnische Eignung & Verdichtungsgüte nachweisen',
                          desc: 'Stelle sicher, dass das RC-Gemisch die mechanischen Anforderungen der TL Gestein-StB erfüllt (z.B. Frostbeständigkeit, Tragfähigkeit). Prüfe nach Einbau den Verdichtungsgrad mittels Plattendruckversuchen (Soll-Wert: Ev2 ≥ 120 MN/m² bei Tragschichten).',
                          ref: 'ZTV SoB-StB / DIN EN 13285'
                        },
                        {
                          step: 6,
                          title: 'Kataster- & Voranzeigepflicht prüfen (§ 22 EBV)',
                          desc: 'Liegt die geplante Einbaumenge über 250 m³? Wenn ja, sende eine Voranzeige mindestens 4 Wochen vor Baubeginn an die zuständige Untere Umweltbehörde. Reichen Sie im Nachgang die Abschlussanzeige (Ersatzbaustoffkataster) ein.',
                          ref: 'EBV § 22 (Bauherrenpflicht)'
                        }
                      ].map((item) => (
                        <div key={item.step} className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 hover:border-shiraz/20 transition-all flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs font-mono">
                                {item.step}
                              </span>
                              <h5 className="font-bold text-slate-900 text-xs">
                                {item.title}
                              </h5>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                              {item.desc}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono font-medium text-slate-400">
                            <span>Status: Beachtungspflichtig</span>
                            <span className="text-shiraz">{item.ref}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeChecklistSubTab === 'rueckbau' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="text-shiraz w-5 h-5" /> Selektiver Rückbau &amp; Pre-Demolition-Audit (VDI 6202 Blatt 1)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Systematischer Projektablauf für Abbruch-, Entkernungs- und Rückbaumaßnahmen zur Maximierung der RC-Baustoffqualitäten und zum Schutz der Gesundheit.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          step: 1,
                          title: 'Historische Recherche des Baukörpers',
                          desc: 'Werten Sie alte Pläne, statische Nachweise und das Baulastenverzeichnis aus. Klären Sie das Baujahr (Verdacht auf asbest- und teerhaltige Baustoffe bei Objekten mit Errichtung vor 1993, KMF-Fasern vor 2000). Analysiere die gewerbliche Vornutzung (Reinigung, Galvanik, Tankstelle).',
                          ref: 'VDI 6202 Blatt 1 Abs. 5.1'
                        },
                        {
                          step: 2,
                          title: 'Visuelle Bestandserundung (Schadstoff-Audit)',
                          desc: 'Lassen Sie das Gebäude im Vorfeld des Umbaues oder Abbruches durch einen zertifizierten Sachverständigen begehen. Markieren Sie verdächtige Bauteile (Fugenmassen, Brandschutzklappen, Fliesenkleber, Putze, künstliche Mineralwollen, Altholz im Außenbereich).',
                          ref: 'GefStoffV / ArbSchG'
                        },
                        {
                          step: 3,
                          title: 'Probenahme- und Analytikplan (VDI 3866 / 3876)',
                          desc: 'Lege ein systematisches Raster zur Probenentnahme fest. Führe gezielte Laboranalysen an Putzen, Klebern und Spachtelmassen (REM-EDX Analysen auf Asbest nach VDI 3866 Blatt 5) sowie nasschemische Aufschlüsse für PAK, CPS, PCP und Schwermetalle durch.',
                          ref: 'VDI 3866 / DIN EN ISO 16000-9'
                        },
                        {
                          step: 4,
                          title: 'Erstellung des Schadstoff- &amp; Bauteilkatasters',
                          desc: 'Zusammenfassung aller Fundorte, Schadstoffqualitäten sowie Mengenschätzungen in einem fälschungssicheren Gutachten. Formulieren Sie spezifische Entsorgungs- und Rückbauvorgaben für die ausführenden Unternehmen und lege Entsorgungswege fest.',
                          ref: 'VDI 6202 Blatt 1 Abs. 6'
                        },
                        {
                          step: 5,
                          title: 'Sortenreiner Rückbau &amp; Entkernungskette',
                          desc: 'Demontieren Sie Störstoffe, Verbundbaustoffe, Fenster, Türen und Haustechnik vollständig vor dem Abbruch. Giftige Substanzen wie asbesthaltige Dichtungen oder HBCD-haltige Dämmplatten müssen in abgeriegelten Schutzbereichen demontiert werden, bevor mechanische Baggerarbeiten an der mineralischen Haupttragstruktur starten.',
                          ref: 'GewAbfV § 8 / TRGS 519'
                        },
                        {
                          step: 6,
                          title: 'Verwertungsbericht &amp; Behördenfreigabe',
                          desc: 'Erstelle nach Abschluss der Abbrucharbeiten eine Massenbilanz mitsamt Entsorgungsbelegen und Wiegescheinen. Lege diesen Verwertungsbericht der zuständigen Bauordnungsbehörde/Umweltbehörde zur abschließenden Entlastung des Bauherrn vor.',
                          ref: 'LBO / KrWG Abfallregister'
                        }
                      ].map((item) => (
                        <div key={item.step} className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 hover:border-shiraz/20 transition-all flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs font-mono">
                                {item.step}
                              </span>
                              <h5 className="font-bold text-slate-900 text-xs">
                                {item.title}
                              </h5>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                              {item.desc}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono font-medium text-slate-400">
                            <span>Status: Beachtungspflichtig</span>
                            <span className="text-shiraz">{item.ref}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeChecklistSubTab === 'deponie' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Database className="text-shiraz w-5 h-5" /> Deponierungsverfahren &amp; Deklarationsgrundlagen (DepV)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Ablaufplanung zur rechtskonformen Annahme und Ablagerung ungenutzter Abfallmassen auf deponietechnischen Anlagen (DK 0 bis DK IV).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          step: 1,
                          title: 'Verwertungsausschluss formell prüfen &amp; begründen',
                          desc: 'Dokumentiere pflichtbewusst, dass eine stoffliche (z.B. Brechanlage) oder energetische Verwertung aus technischen Gründen unmöglich oder wegen unverhältnismäßiger Mehrkosten unzumutbar ist. Deponierung ist gesetzlich die allerletzte Entsorgungsstufe.',
                          ref: 'KrWG § 6 Abfallhierarchie'
                        },
                        {
                          step: 2,
                          title: 'Grundlegende Charakterisierung (§ 8 DepV)',
                          desc: 'Der Abfallerzeuger muss die rechtlichen Stammdaten des Abfalls schriftlich niederlegen. Dazu gehören: Herkunftsort, Genese, AVV-Schlüssel, Masse, physikalische Beschaffenheit, Geruch, Farbe und potenzielle Schadstoffrisiken.',
                          ref: 'DepV § 8 / Anhang 3'
                        },
                        {
                          step: 3,
                          title: 'Repräsentative Deklarationsanalytik veranlassen',
                          desc: 'Lassen Sie Feststoffe und Eluate durch ein dafür zugelassenes Prüflabor nasschemisch analysieren. Wichtige Leitparameter der Zuordnungsanalytik sind: Kohlenwasserstoffe (KW-Index), TOC, Glühverlust, Arsen, Blei, Cadmium, Kupfer, Zink, Chlorid, Sulfat und Fluorid.',
                          ref: 'DepV Anhang 3 Tabelle 2'
                        },
                        {
                          step: 4,
                          title: 'Einstufung in Deponieklassen (DK 0 bis DK IV)',
                          desc: 'Vergleiche die Messwerte mit den Zuordnungswerten der DepV: DK 0 (unbelasteter Inertabfall), DK I (oberirdisch, geringe Belastung), DK II (Hausmüll, typischer schwerer Bauschutt), DK III (gefährlicher Industrieabfall), DK IV (Sonderabfälle, unter Tage).',
                          ref: 'DepV Anhang 3 Tabelle 2'
                        },
                        {
                          step: 5,
                          title: 'Annahmeverfahren &amp; Entsorgungszusage',
                          desc: 'Reichen Sie den Charakterisierungsbogen und die Analyseberichte beim Deponiebetreiber ein. Nach Einzelfallprüfung stellt die Deponie den "Bestätigungsschein" mitsamt der Zuweisung der konkreten Ablade- und Einbaustelle aus.',
                          ref: 'DepV § 8 Abs. 4'
                        },
                        {
                          step: 6,
                          title: 'Eingangskontrolle &amp; Identitätsprüfung am Deponietor',
                          desc: 'Jede LKW-Ladung wird am Deponietor visuell geprüft (Geruch, Fremdstoffanteil), gewogen und der Begleitschein elektronisch quittiert. Der Betreiber zieht unangekündigt Stichproben zur Absicherung ("Rückstellproben" für min. 1 Monat).',
                          ref: 'DepV § 12'
                        }
                      ].map((item) => (
                        <div key={item.step} className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 hover:border-shiraz/20 transition-all flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs font-mono">
                                {item.step}
                              </span>
                              <h5 className="font-bold text-slate-900 text-xs">
                                {item.title}
                              </h5>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                              {item.desc}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono font-medium text-slate-400">
                            <span>Status: Beachtungspflichtig</span>
                            <span className="text-shiraz">{item.ref}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeChecklistSubTab === 'probenahme' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Search className="text-shiraz w-5 h-5" /> Repräsentative Probenahme (LAGA PN 98 / DIN 19698)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Sicherstellung der Repräsentativität bei der Feld-Beprobung von Haufwerken, Schütthalden und anstehenden Bodenschichten.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          step: 1,
                          title: 'Probenahmestrategie &amp; Untersuchungsziele definieren',
                          desc: 'Erstelle vorab einen schriftlichen Probenahmeplan. Bestimme das Ziel der Untersuchung (z.B. Schadstoffbewertung gemäß BBodSchV oder Entsorgungsdeklaration) und definiere die Analyse-Kennwerte im Labor.',
                          ref: 'DIN 19698-1 / LAGA PN 98'
                        },
                        {
                          step: 2,
                          title: 'Haufwerksvolumen schätzen &amp; Beprobungszahl ermitteln',
                          desc: 'Schätzen Sie das Volumen (V) des zu prüfenden Haufwerks ein. Ermitteln Sie die Zahl der erforderlichen Einzelproben (EP) und Mischproben (MP). (Z.B. bis 30 m³: 4 EP, 1 MP; bis 100 m³: 6 EP, 1 MP; bis 500 m³: 10 EP, 2 MP gemäß LAGA Tabelle 2).',
                          ref: 'LAGA PN 98 Tabelle 2'
                        },
                        {
                          step: 3,
                          title: 'Sachkundeprüfung &amp; Probenahmeausrüstung',
                          desc: 'Beauftragen Sie ausschließlich Fachpersonal mit zertifiziertem Sachkundenachweis nach LAGA PN 98 / DIN ISO. Stelle kontaminationsfreies Werkzeug (Spaten, Schaufeln aus Edelstahl) sowie sterile Probenbehälter (Weithals-Glasflaschen für Organik, PE-Beutel für Schwermetalle) bereit.',
                          ref: 'DGUV-Regel 101-004 / LAGA'
                        },
                        {
                          step: 4,
                          title: 'Einzelproben (EP) im Feld entnehmen',
                          desc: 'Entnimm die Einzelproben gleichmäßig über das gesamte Haufwerksvolumen verteilt (oben, mitte, unten, tief im Haldenkörper). Verwende ggf. einen Minibagger, um tiefe Schichten aufzuschließen. Kratzen Sie oberflächlich verwitterte Außenzonen (ca. 10 cm Tiefe) ab und verwerfen Sie diese.',
                          ref: 'DIN 19698-1 Abs. 7.4'
                        },
                        {
                          step: 5,
                          title: 'Sorgfältige Homogenisierung &amp; Probenverjüngung',
                          desc: 'Vereinen Sie die Einzelproben auf einer sauberen und chemisch inerten Plane zu einer Verbundprobe. Nutzen Sie Verteilmethoden (Kegeln, Vierteln und Kreuz-Vierteln), um das Probenvolumen für das Prüflabor repräsentativ zu reduzieren.',
                          ref: 'LAGA PN 98 Anhänge / DIN 19698'
                        },
                        {
                          step: 6,
                          title: 'Protokollierung &amp; gekühlter Transport',
                          desc: 'Dokumentiere jeden Probenahmeschritt detailliert in einem schriftlichen, fälschungssicheren Feldprotokoll (inkl. Halden-Skizzen, Höhenangaben, Probenahmedatum, Fotos und GPS-Koordinaten). Sichern Sie die Kühlung der Proben während des Transports zum akkreditierten Umweltlabor.',
                          ref: 'DIN 19698-1 Abs. 8'
                        }
                      ].map((item) => (
                        <div key={item.step} className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 hover:border-shiraz/20 transition-all flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs font-mono">
                                {item.step}
                              </span>
                              <h5 className="font-bold text-slate-900 text-xs">
                                {item.title}
                              </h5>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                              {item.desc}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono font-medium text-slate-400">
                            <span>Status: Beachtungspflichtig</span>
                            <span className="text-shiraz">{item.ref}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeChecklistSubTab === 'gefahrstoffe' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="text-shiraz w-5 h-5" /> Gefahrstoffe, Arbeitsschutz &amp; PSA (Asbest, KMF, PCB)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Sicherheitstechnische Schutzmaßnahmen, behördliche Anzeigepflichten und Entsorgungserfordernisse im Umgang mit toxischen Bauststoffen auf Sanierungsbaustellen.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          step: 1,
                          title: 'Gefahrstoff-Identifikation im Bestand',
                          desc: 'Lokalisieren Sie kritische Schadstoffe im Bestand: Liegt Asbest vor (z. B. asbesthaltige Dichtungen, Fliesenkleber)? Gibt es künstliche Mineralfasern (KMF) ohne Nachweis der Biosolubilität? Sind Teerkleber unter Parkett oder polychlorierte Biphenyle (PCB) in Dehnungsfugen vorhanden?',
                          ref: 'GefStoffV Anhang II'
                        },
                        {
                          step: 2,
                          title: 'Gefährdungsbeurteilung &amp; behördliche Arbeitsanzeige',
                          desc: 'Erstelle vor Ausführungsbeginn eine Gefährdungsbeurteilung. Bei Asbestsanierungen (TRGS 519) oder Arbeiten in kontaminierten Bereichen (TRGS 524) ist die Baustelle mindestens 14 Tage vor Arbeitsbeginn der Gewerbeaufsicht und der Berufsgenossenschaft (BG BAU) anzuzeigen.',
                          ref: 'GefStoffV / TRGS 519 Abs. 3'
                        },
                        {
                          step: 3,
                          title: 'Personelle Sachkunde &amp; Fachbetriebsnachweis',
                          desc: 'Für Sanierungsarbeiten müssen sachkundige Aufsichtspersonen benannt werden. Stelle sicher, dass für Asbestarbeiten die Sachkunde nach TRGS 519 (Anlage 3 für Großbaustellen, Anlage 4 für Arbeiten geringen Umfanges) und für kontaminierte Bereiche nach TRGS 524 vorliegt.',
                          ref: 'TRGS 519 Abs. 2.7 / TRGS 524'
                        },
                        {
                          step: 4,
                          title: 'Einrichtung von Sicherheitsbereichen &amp; Schutzstufen',
                          desc: 'Richten Sie staubdichte Abschottungen (Schwarz-Weiß-Bereiche) mit Unterdruckanlagen und Schleusen ein, um eine Faserverschleppung in unbelastete Gebäudeteile auszuschließen. Verhindern Sie Staubbildung durch permanentes Befeuchten oder Absaugen.',
                          ref: 'TRGS 519 Abs. 7'
                        },
                        {
                          step: 5,
                          title: 'Persönliche Schutzausrüstung (PSA) bereitstellen',
                          desc: 'Rüsten Sie sämtliche im Arbeitsbereich tätige Mitarbeiter mit partikelfiltrierendem Atemschutz (min. Halbmasken mit P3-Filter oder gebläseunterstützte Vollhauben), staubdichten Einweg-Schutzanzügen (Typ 5/6, z. B. Tyvek), dichten Schutzbrillen und Handschuhen aus.',
                          ref: 'TRGS 519 Abs. 9 / TRGS 521'
                        },
                        {
                          step: 6,
                          title: 'Verpackung, Kennzeichnung &amp; eANV-Transport',
                          desc: 'Verpacken Sie kontaminierte Massen direkt an der Arbeitsstelle in staubdichte, zugelassene Big-Bags oder Platten-Bags, die mit dem offiziellen Asbest-Warnzeichen ("a"-Symbol) bedruckt sind. Deklarieren Sie das Material als gefährlichen Abfall.',
                          ref: 'GefStoffV § 8 / TRGS 519 Abs. 14'
                        }
                      ].map((item) => (
                        <div key={item.step} className="p-4 bg-slate-50 rounded-xl border border-home-grau/20 hover:border-shiraz/20 transition-all flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-xs font-mono">
                                {item.step}
                              </span>
                              <h5 className="font-bold text-slate-900 text-xs text-shiraz-900">
                                {item.title}
                              </h5>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                              {item.desc}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono font-medium text-slate-400">
                            <span>Status: Beachtungspflichtig</span>
                            <span className="text-shiraz">{item.ref}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    
      {/* Central ModuleFooter rendered dynamically based on activeTab */}
      <ModuleFooter 
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
            ? [{ title: 'Elektronisches Abfallnachweisverfahren', url: 'https://de.wikipedia.org/wiki/Elektronisches_Abfallnachweisverfahren' }]
            : activeTab === 'pn98'
            ? [{ title: 'Probenahme', url: 'https://de.wikipedia.org/wiki/Probenahme' }]
            : [
                { title: 'Kreislaufwirtschaftsgesetz', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaftsgesetz' },
                { title: 'Bundes-Bodenschutzgesetz', url: 'https://de.wikipedia.org/wiki/Bundes-Bodenschutzgesetz' }
              ]
        }
        regelwerke={[
          { title: 'Kreislaufwirtschaftsgesetz (KrWG § 14 Quoten)', url: 'https://www.gesetze-im-internet.de/krwg/' },
          { title: 'Ersatzbaustoffverordnung (ErsatzbaustoffV)', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' },
          { title: 'Deponieverordnung (DepV)', url: 'https://www.gesetze-im-internet.de/depv_2009/' },
          { title: 'Gewerbeabfallverordnung (GewAbfV)', url: 'https://www.gesetze-im-internet.de/gewabfv_2017/' },
          { title: 'LAGA PN 98 (Richtlinie für das Vorgehen bei physikalischen, chemischen und biologischen Untersuchungen im Zusammenhang mit der Verwertung/Beseitigung von Abfällen)', url: 'https://www.laga-online.de/' }
        ]}
        literatur={[
          'Kranert, M.; Cord-Landwehr, K. (2017): Einführung in die Abfallwirtschaft (Springer Vieweg)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'LAGA: Mitteilungen der Bund/Länder-Arbeitsgemeinschaft Abfall'
        ]}
        formeln={[
          {
            formel: 'Q_{\\text{Verwertung}} = \\frac{m_{\\text{Recycling}} + m_{\\text{Verfüllung}}}{m_{\\text{mineralischer Bauabfall gesamt}}} \\ge 70\\%',
            erklaerung: 'Gesetzliche Verwertungsquote für mineralische Bau- und Abbruchabfälle nach § 14 Abs. 3 KrWG.',
            quelle: 'KrWG § 14 Abs. 3'
          },
          {
            formel: 'n = 2 \\cdot \\sqrt[3]{V} \\implies \\text{Mindestanzahl der Einzelproben nach LAGA PN 98}',
            erklaerung: 'Stichprobengröße bei der Haufwerksbeprobung nach LAGA PN 98 in Abhängigkeit vom Haufwerksvolumen V [m³] zur repräsentativen Schadstoffanalytik.',
            quelle: 'LAGA PN 98'
          },
          {
            formel: 'c_{\\text{Eluat}} \\le \\text{Grenzwert}_{\\text{DK 0 / DK I / DK II}} \\quad [\\text{mg/l}]',
            erklaerung: 'Zuordnungswerte für Deponieklassen (DK 0 Inertabfall, DK I/II Hausmüll/Gewerbeabfall, DK III Sondermüll) nach DepV Anhang 3.',
            quelle: 'DepV Anhang 3'
          }
        ]}
      />
    </div>
  );
}
