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
    { id: 'schema', label: 'Wegweiser (Wann, Was, Wie, Wozu)', icon: BookOpen },
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
  // AP 3.8: höchstens 7 Reiter je Leiste – die 11 Bereiche sind zu 7 Themengruppen gebündelt;
  // innerhalb einer Gruppe wählt eine zweite Reiterleiste den Bereich (activeTab bleibt der Bereich).
  const gruppen: { id: AbfallGruppe; label: string; icon: LucideIcon; bereiche: AbfallTab[] }[] = [
    { id: 'wegweiser', label: 'Wegweiser', icon: BookOpen, bereiche: ['schema'] },
    { id: 'recht', label: 'KrWG & AVV', icon: Layers, bereiche: ['hierarchie', 'avv'] },
    { id: 'verwertung', label: 'Verwertung (EBV, Altholz)', icon: Recycle, bereiche: ['ebv', 'altholz'] },
    { id: 'deponie', label: 'Deponie (DepV)', icon: Database, bereiche: ['deponie'] },
    { id: 'altlasten', label: 'Altlasten (BBodSchG)', icon: AlertTriangle, bereiche: ['altlasten'] },
    { id: 'rueckbau', label: 'Rückbau, eANV & PN 98', icon: ShieldCheck, bereiche: ['rueckbau', 'eanv', 'pn98'] },
    { id: 'checklisten', label: 'Praxis-Checklisten', icon: ClipboardList, bereiche: ['checklisten'] }
  ];
  const aktiveGruppe = gruppen.find(g => g.bereiche.includes(activeTab)) ?? gruppen[0];
  const unterReiter = aktiveGruppe.bereiche.length > 1
    ? tabs.filter(t => aktiveGruppe.bereiche.includes(t.id))
    : null;
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
      wozu: 'Eindeutige und rechtlich belastbare Einstufung für Transport, Abrechnung und Verwertbarkeit.'
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
      wann: 'Vor und während der Entsorgung gefährlicher Abfälle (Kleinmengen bis 2 t/a sind vom Entsorgungsnachweis befreit, § 2 Abs. 2 NachwV).',
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
      wozu: 'Chemisch rechtlich belastbare Einstufung, wodurch Falschdeklarationen und Abweisungen an Deponietoren verhindert werden.'
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
    let anzeige = 'Keine Anzeigepflicht nach § 22 EBV für diese Kombination (Anzeigepflicht nur für RC-3, BM-F3, BG-F3 und bestimmte Schlacken/Aschen ab Mengenschwelle sowie für Einbau in Schutzgebieten).';

    if (ebvVolumen === 'ab_250') {
      if (ebvMaterial === 'rc3' || ebvMaterial === 'bm_f3' || ebvMaterial === 'hmva2' || ebvMaterial === 'hmva1') {
        anzeige = '⚠️ ANZEIGEPFLICHTIG nach § 22 EBV (Gesamtvolumen ≥ 250 m³; HMVA-1 bereits ab 50 m³): Voranzeige mindestens vier Wochen vor Beginn des Einbaus nach Muster Anlage 8 sowie Abschlussanzeige nach Fertigstellung (Ermittlung binnen zwei Wochen) bei der zuständigen Behörde. Die Behörde führt ein Kataster.';
      } else {
        anzeige = 'Keine mengenabhängige Anzeigepflicht nach § 22 Abs. 1 EBV für diese Materialklasse (Ausnahme: Einbau in Schutzgebieten, § 22 Abs. 2).';
      }
    }

    if (ebvSchutzgebiet === 'wsg_1_2') {
      if (ebvMaterial === 'bm0' || ebvMaterial === 'bg0') {
        status = 'restricted';
        message = 'Zone I: verboten – Zone II: zulässig.';
        conditions.push('In Zone I ist jeder Einbau mineralischer Ersatzbaustoffe verboten; in Zone II sind nur BM-0, BG-0, GS-0 und Schmelzkammergranulat (SKG) sowie deren Gemische zulässig (§ 19 Abs. 6 EBV). Wasserrechtliche Schutzgebietsverordnungen haben Vorrang.');
      } else {
        status = 'forbidden';
        message = 'STRENGSTENS VERBOTEN!';
        conditions.push('In Zone I ist jeder Einbau verboten, in Zone II sind nur BM-0, BG-0, GS-0 und SKG zulässig (§ 19 Abs. 6 EBV).');
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
          conditions.push('In Zone III A/III B sind nur die in Anlage 2 EBV für Wasserschutzgebiete ausgewiesenen Einbauweisen zulässig; offene Bauweisen sind für die meisten Klassen dort nicht vorgesehen (Einbautabelle prüfen).');
        } else {
          status = 'restricted';
          message = 'Zulässig unter strengen hydrogeologischen Auflagen.';
          conditions.push('Günstige Grundwasserdeckschicht: Sickerstrecke über dem höchsten zu erwartenden Grundwasserstand > 1 m zuzüglich 0,5 m Sicherheitsabstand (§ 19 Abs. 8 EBV).');
          conditions.push('Die Bodenart der Deckschicht (Sand, Lehm/Schluff/Ton) bestimmt nach Anlage 2 EBV, welche Einbauweise zulässig ist.');
        }
      } else {
        status = 'forbidden';
        message = 'Weitgehend unzulässig – nur nach Einbautabelle.';
        conditions.push('Höher belastete Klassen sind in Zone III A/III B nur in wenigen, in Anlage 2 EBV ausdrücklich zugelassenen (gebundenen bzw. abgedeckten) Einbauweisen möglich; in Karst- und stark klüftigen Gebieten sind RC-3, BM-F3, BG-F3 und GS-3 verboten (§ 19 Abs. 7). Die Lehrlogik stuft dies vereinfacht als unzulässig ein.');
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
            conditions.push('Ohne günstige Deckschicht gelten die Spalten „ungünstig“ der Einbautabellen; für RC-1, BM-0* u. a. ist eine Sickerstrecke von mindestens 0,1 bis 1 m zuzüglich 0,5 m Sicherheitsabstand nachzuweisen (§ 19 Abs. 8 EBV).');
          } else {
            status = 'allowed';
            message = 'Zulässig.';
            conditions.push('Günstige Grundwasserdeckschicht: Sickerstrecke > 1 m zuzüglich 0,5 m Sicherheitsabstand (§ 19 Abs. 8 EBV).');
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
          conditions.push('Nur bei günstiger Grundwasserdeckschicht (Sickerstrecke > 1 m + 0,5 m Sicherheitsabstand) in den nach Anlage 2 zulässigen Einbauweisen.');
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
          conditions.push('Grundwasserdeckschicht und Einbauweise nach Anlage 2 EBV prüfen (Sicherheitsabstand 0,5 m zusätzlich zur Sickerstrecke).');
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
          conditions.push('Ausschließlich in bautechnisch vollständig umschlossenen Erdbaukörpern (z.B. gekapselt mit Bentonit-Dichtungsbahnen) erlaubt.');
          conditions.push('Günstige Grundwasserdeckschicht erforderlich; in Karst- und stark klüftigen Gebieten unzulässig (§ 19 Abs. 7 EBV).');
          conditions.push('Ab 250 m³ Gesamtvolumen anzeigepflichtig (§ 22 Abs. 1 EBV); die Behörde führt ein Kataster.');
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

        {/* Tabs Navigation (AP 3.8: 7 Themengruppen, ggf. zweite Ebene) */}
        <ModuleTabs
          label="Themen Abfälle und Altlasten"
          tabs={gruppen}
          aktiv={aktiveGruppe.id}
          onWechsel={(id) => setActiveTab(gruppen.find(g => g.id === id)!.bereiche[0])}
          variante="kachel"
          className="[&>[role=tablist]]:p-4 [&>[role=tablist]]:bg-slate-50/50 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:border [&>[role=tablist]]:border-home-grau/30 lg:[&>[role=tablist]]:grid-cols-4"
        >
        <div className="p-6">
          <UnterReiter tabs={unterReiter} aktiv={activeTab} onWechsel={setActiveTab} label={`Bereiche: ${aktiveGruppe.label}`}>
          
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
          {activeTab === 'avv' && <AvvSchluessel />}

          {/* EBV */}
          {activeTab === 'ebv' && <EbvMantelverordnung ebvEinbauweise={ebvEinbauweise} ebvGrundwasser={ebvGrundwasser} ebvMaterial={ebvMaterial} ebvSchutzgebiet={ebvSchutzgebiet} ebvVolumen={ebvVolumen} evaluateEBV={evaluateEBV} setEbvEinbauweise={setEbvEinbauweise} setEbvGrundwasser={setEbvGrundwasser} setEbvMaterial={setEbvMaterial} setEbvSchutzgebiet={setEbvSchutzgebiet} setEbvVolumen={setEbvVolumen} />}

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
          {activeTab === 'deponie' && <Deponie activeBarrier={activeBarrier} depVInputValue={depVInputValue} depVSelectedParam={depVSelectedParam} deponieSection={deponieSection} selectedLayerIndex={selectedLayerIndex} setActiveBarrier={setActiveBarrier} setDepVInputValue={setDepVInputValue} setDepVSelectedParam={setDepVSelectedParam} setDeponieSection={setDeponieSection} setSelectedLayerIndex={setSelectedLayerIndex} />}

          {/* Altlasten */}
          {activeTab === 'altlasten' && <Altlasten bbodNutzungsart={bbodNutzungsart} setBbodNutzungsart={setBbodNutzungsart} />}

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
                  Sowohl Erzeuger, Beförderer als auch Entsorger müssen Register über die abgewickelten gefährlichen Abfälle führen und diese Unterlagen mindestens 3 Jahre (§ 25 NachwV; bei Entsorgungsanlagen ggf. länger nach Zulassungsbescheid) aufbewahren und den Umweltbehörden auf Verlangen vorlegen.
                </p>
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
        title="Beispiel 1: Deponieklasse für einen Bauschutt aus der Zuordnungsanalyse"
        zielGleichung="DK = \min\{k \mid c_j \le Z_{j,k} \;\forall j\}"
        schritte={[
          { titel: 'Analysenwerte', erklaerung: 'Eluat: Sulfat 1 450 mg/l, Chlorid 120 mg/l, Blei 0,08 mg/l; Feststoff: TOC 0,6 M.-%, Glühverlust 2,4 M.-%.', formel: '\\text{SO}_4^{2-} = 1\\,450\\,\\text{mg/l}' },
          { titel: 'Vergleich DK 0', erklaerung: 'Sulfat 1 450 > 100 mg/l, Chlorid 120 > 80 mg/l, Blei 0,08 > 0,05 mg/l:', formel: '\\text{DK 0 nicht eingehalten}' },
          { titel: 'Vergleich DK I', erklaerung: 'Sulfat ≤ 2 000, Chlorid ≤ 1 500, Blei ≤ 0,2 mg/l, TOC ≤ 1, Glühverlust ≤ 3 M.-%:', formel: '\\Rightarrow \\text{Deponieklasse I}' }
        ]}
        ergebnisHinweis="Maßgebend ist der ungünstigste Parameter. Die Fußnoten zu Anhang 3 Tabelle 2 (z. B. Sulfat bei DK 0) und Einzelfallregelungen nach Nr. 2 sind zu beachten. Vor der Deponierung ist die Verwertung nach EBV zu prüfen."
        normQuelle="DepV Anhang 3 Nr. 2, Tabelle 2"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Anzeigepflicht nach § 22 EBV für RC-3 im Straßenunterbau"
        zielGleichung="V_{ges} = A \cdot d \ge 250\,\text{m}^3 \Rightarrow \text{Voranzeige}"
        schritte={[
          { titel: 'Volumen', erklaerung: 'Tragschicht unter Asphalt, Fläche 1 200 m², Dicke 0,25 m, Material RC-3:', formel: 'V_{ges} = 1\\,200 \\cdot 0{,}25 = 300\\,\\text{m}^3' },
          { titel: 'Schwellenwert', erklaerung: 'Für RC-3, BM-F3 und BG-F3 sowie bestimmte Schlacken gilt die Anzeigepflicht ab 250 m³:', formel: '300 \\ge 250 \\Rightarrow \\text{anzeigepflichtig}' },
          { titel: 'Fristen', erklaerung: 'Voranzeige vier Wochen vor Beginn, Abschlussanzeige nach Fertigstellung:', formel: 't_{Vor} = -4\\,\\text{Wochen}, \\; t_{Abschl} \\le +2\\,\\text{Wochen}' }
        ]}
        ergebnisHinweis="Unabhängig von der Menge ist in Wasser- und Heilquellenschutzgebieten eine Voranzeige erforderlich (§ 22 Abs. 2). Die Zulässigkeit der Einbauweise selbst ergibt sich aus Anlage 2 EBV und der Grundwasserdeckschicht (§ 19)."
        normQuelle="ErsatzbaustoffV §§ 19, 20, 22"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="abfaelle" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 9 Rückbau & Schadstoffe: DepV-Zuordnungswerte, EBV §§ 19/22, LAGA PN 98 Tabelle 2, KrWG § 14 geprüft; fachliche Freigabe durch den Autor ausstehend)" 
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
          { title: 'Ersatzbaustoffverordnung (ErsatzbaustoffV), in Kraft seit 01.08.2023; Novelle im Referentenentwurf 08/2026', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' },
          { title: 'Deponieverordnung (DepV)', url: 'https://www.gesetze-im-internet.de/depv_2009/' },
          { title: 'Gewerbeabfallverordnung (GewAbfV)', url: 'https://www.gesetze-im-internet.de/gewabfv_2017/' },
          { title: 'LAGA PN 98 (Richtlinie für das Vorgehen bei physikalischen, chemischen und biologischen Untersuchungen im Zusammenhang mit der Verwertung/Beseitigung von Abfällen)', url: 'https://www.laga-online.de/' }
        ]}
        literatur={[
          'Kranert, M. (Hrsg.): Einführung in die Kreislaufwirtschaft. 5. Aufl., Wiesbaden: Springer Vieweg 2017',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'LAGA: Mitteilungen der Bund/Länder-Arbeitsgemeinschaft Abfall'
        ]}
        formeln={[
          {
            formel: 'Q_{\\text{Verwertung}} = \\frac{m_{\\text{Wiederverwendung}} + m_{\\text{Recycling}} + m_{\\text{Verfüllung}}}{m_{\\text{Bau- und Abbruchabfall}}} \\ge 70\\,\\%',
            erklaerung: 'Nationales Ziel nach § 14 Abs. 3 KrWG für nicht gefährliche Bau- und Abbruchabfälle ohne natürlich vorkommende Materialien (AVV 17 05 04); Verfüllung zählt mit. Keine projektbezogene Pflichtquote.',
            quelle: 'KrWG § 14 Abs. 3'
          },
          {
            formel: 'n_{MP} = 10 + \\left\\lceil \\frac{V - 600}{100} \\right\\rceil, \\quad n_{EP} = 4 \\cdot n_{MP} \\quad (V > 600\\,\\text{m}^3)',
            erklaerung: 'Mindestanzahl der Misch- und Einzelproben nach LAGA PN 98 Tabelle 2 für Haufwerke über 600 m³ (bis 600 m³ tabelliert: 2 bis 10 Mischproben).',
            quelle: 'LAGA PN 98, Tabelle 2'
          },
          {
            formel: 'c_{\\text{Eluat}} \\le \\text{Grenzwert}_{\\text{DK 0 / DK I / DK II}} \\quad [\\text{mg/l}]',
            erklaerung: 'Zuordnungswerte für Deponieklassen nach DepV Anhang 3 Tabelle 2 (DK 0 Inertabfall, DK I gering belastete mineralische Abfälle, DK II höher belastete bzw. vorbehandelte Abfälle, DK III gefährliche Abfälle; DK IV Untertagedeponie).',
            quelle: 'DepV Anhang 3'
          }
        ]}
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
