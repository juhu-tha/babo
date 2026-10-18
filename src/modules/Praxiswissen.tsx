import React, { useState, useEffect } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { useTabContext } from '@/src/contexts/TabContext';
import { 
  ClipboardCheck, 
  Wrench, 
  Factory, 
  GraduationCap, 
  AlertOctagon, 
  FileText, 
  Scale, 
  HelpCircle, 
  Check, 
  Download, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  FileCheck, 
  HardHat, 
  MessageCircle, 
  Award,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  important?: boolean;
  standard?: string;
  tip?: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
}

interface TabContent {
  title: string;
  tagline: string;
  icon: React.ReactNode;
  themeColor: string;
  intro: string;
  sections: Section[];
  traps: { title: string; consequence: string; avoid: string }[];
  professionalTip: string;
}

const DATA_PLANUNG: TabContent = {
  title: "Planung & Ausschreibung",
  tagline: "Sichere LV-Erstellung, Normenkonformität und Vermeidung teurer Nachträge",
  icon: <ClipboardCheck size={28} className="text-shiraz" />,
  themeColor: "shiraz",
  intro: "Der Erfolg eines Bauvorhabens wird in der Planungsphase zementiert. Fehler im Leistungsverzeichnis (LV) oder eine mangelhafte Koordinierung der Schnittstellen führen unweigerlich zu Bauzeitverzögerungen und kostspieligen Nachträgen (Nachtragsmanagement).",
  sections: [
    {
      id: "hoai_phasen",
      title: "HOAI-Schnittstellen (Phasen 3, 5 & 6)",
      description: "Qualitätssicherung beim Übergang von der Entwurfs- zur Ausführungsplanung und Vergabevorbereitung.",
      items: [
        {
          id: "pl_hoai_1",
          title: "Schnittstellenprüfung Statik vs. Architektur",
          description: "Abgleich der Tragwerksplanung mit der Ausführungsplanung der Architektur. Passen Deckendurchbrüche, Schachtabmessungen und Stützenpositionen exakt zusammen?",
          important: true,
          tip: "Kollisionsprüfung im BIM-Modell oder 2D/3D-Plangegenüberstellung durchführen. Schachtmindestmaße zwingend um min. 5 cm Toleranz vergrößern für gedämmte Rohrleitungen nach DIN 1988-200. Schlitze und TGA-Durchbrüche rechtzeitig vom Statiker im Schalplan freigeben lassen!"
        },
        {
          id: "pl_hoai_2",
          title: "Wassereinwirkungsklasse nach DIN 18533 festlegen",
          description: "Prüfung des Bodengutachtens auf den Bemessungswasserstand (HGW - Höchster Grundwasserstand). Ist mit drückendem Wasser (W2.1-E) oder mäßiger Feuchte (W1.1-E) zu kalkulieren?",
          standard: "DIN 18533-1",
          important: true,
          tip: "Anforderungshöhe von 15 cm über Geländeoberkante (GOK) für barrierefreie Schwellen darf auf 5 cm reduziert werden, sofern durch Gitterroste und zusätzliche Entwässerungsrinnen nach DIN 18533-1 Abs. 5.1.1.2 ein rückstaufreies Abfließen gesichert ist."
        },
        {
          id: "pl_hoai_3",
          title: "Fugenplanung und WU-Richtlinie abstimmen",
          description: "Planung von Arbeits- und Sollrissfugen bei WU-Betonkonstruktionen (Weiße Wanne). Festlegung der Fugenbänder, Quelldichtungen oder Injektionsschläuche im Plan.",
          standard: "WU-Richtlinie des DAfStb",
          tip: "Ausführung nach DBV-Merkblatt 'Fugen'. Bei Arbeitsfugenbändern ist eine allseitige Einbautiefe von min. 5 cm zur nächsten Bewehrungslage zu fordern, um Fehlstellen beim Verdichten zu verhindern."
        },
        {
          id: "pl_hoai_4",
          title: "Normenkonforme Brandschutzanforderungen (DIN EN 13501-2)",
          description: "Festlegung der Feuerwiderstandsklassen von tragenden Bauteilen (z.B. R90, REI120) und Abstimmung mit der geforderten Mindestbauteildicke sowie Betondeckung.",
          standard: "DIN EN 1992-1-2 / DIN 4102-4",
          tip: "Für R90-Bauteile (Stahlbetonstützen) ist das Mindestachsmaß 'a' nach Tabelle 5.2a der DIN EN 1992-1-2 bei vierseitiger Brandbeanspruchung auf min. 35 mm (mit Mindeststützenbreite b = 300 mm) auszulegen."
        }
      ]
    },
    {
      id: "lv_erstellung",
      title: "LV-Ausschreibung & Baustoffwahl",
      description: "Präzise Baustoffbeschreibungen im Leistungsverzeichnis zur Gewährleistung rechtlicher und technischer Sicherheit.",
      items: [
        {
          id: "pl_lv_1",
          title: "Leitprodukt & Gleichwertigkeitsklausel (VOB/A)",
          description: "Bei Produktvorgaben im öffentlichen Bau muss zwingend der Zusatz 'oder gleichwertig' beigefügt werden. Kriterien für Gleichwertigkeit müssen eindeutig im LV benannt sein.",
          standard: "§ 7 Abs. 2 VOB/A",
          important: true,
          tip: "Definiere exakte funktionale Parameter (z.B. Bemessungswert der Wärmeleitfähigkeit λ ≤ 0,035 W/(m·K) nach DIN 4108-4, Schalldämm-Maß Rw ≥ 52 dB), an denen eine Gleichwertigkeit gemessen wird."
        },
        {
          id: "pl_lv_2",
          title: "Expositionsklassen von Beton exakt ausschreiben",
          description: "Spezifizierung aller relevanten Expositionsklassen (z.B. XC4, XD3, XF4) anstelle von pauschalen Festigkeitsvorgaben. Keine unnötig hohen Klassen wählen, das treibt Zementgehalt und Rissrisiko hoch.",
          standard: "DIN 1045-2 / DIN EN 206",
          tip: "Für normale erdberührte Gründungskörper ohne betonaggressive Wässer ist XC2 / XF1 ausreichend (Mindestklasse C25/30, max. w/z = 0,60). Ein Ausschreiben von XF4 ohne Tausalzkontakt zieht unnötige Luftporenbildner nach sich."
        },
        {
          id: "pl_lv_3",
          title: "Nachbehandlungsklassen im Beton-LV vorgeben",
          description: "Ausschreibung der erforderlichen Nachbehandlungsdauer oder Nachbehandlungsklasse (z.B. NB2, NB3 oder NB4). Dies verhindert Streitigkeiten über die Kosten für Abdeckfolien oder Curing-Mittel.",
          standard: "DIN EN 13670 / DIN 1045-3",
          important: false,
          tip: "Durchschnittliche Festigkeitsentwicklung beschreiben (z.B. 'mittlere Festigkeitsentwicklung' bei mäßigem Hydratationsgrad). NB2 fordert ein Absichern des Betons vor Austrocknung, bis dieser 35 % der charakteristischen 28-Tage-Druckfestigkeit erreicht hat."
        },
        {
          id: "pl_lv_4",
          title: "Verträglichkeit von Kontaktschichten (z.B. Bitumen & XPS)",
          description: "Sicherstellung, dass sich berührende Materialien chemisch verträglich sind. Lösungsmittelhaltige Bitumenvoranstriche greifen extrudierten Polystyrolschaum (XPS) an!",
          tip: "Vorschreiben von zweikomponentiger, kunststoffmodifizierter Bitumendickbeschichtung (PMBC - früher KMB) nach DIN 18533 oder einkomponentigen Polyurenthan-Reaktivabdichtungen (FPD), die absolut lösemittelfrei eingestellt sind."
        }
      ]
    },
    {
      id: "baustoff_spezifikationen",
      title: "Baustoffspezifikation, Zulassungen & Nachhaltigkeit",
      description: "Schnittstelle Baustofftechnologie: Richtige Berücksichtigung von Nachweisen, Zulassungen und Regelwerken.",
      items: [
        {
          id: "pl_bst_1",
          title: "abZ (allgemeine bauaufsichtliche Zulassung) vs. vBG (vorhabenbezogene Bauartgenehmigung)",
          description: "Prüfung innovativer Baustoffe (z.B. Carbonbeton, Recycling-Kunststoffe oder neuartige Dämmstoffe) auf baurechtliche Verwendbarkeit. Liegt eine abZ oder ETA (Europäische Technische Bewertung) vor?",
          standard: "LBO / DIBt",
          important: true,
          tip: "Gibt es für ein Tragwerksprodukt weder abZ noch ETA, muss der Antrag auf vorhabenbezogene Bauartgenehmigung (vBG) min. 6 Monate vor geplantem Verbau bei der Obersten Bauaufsichtsbehörde der Bundeslandes eingereicht werden."
        },
        {
          id: "pl_bst_2",
          title: "Sichtbetonklasse (SB 1 bis SB 4) festlegen",
          description: "Eindeutige Spezifikation der Sichtbetonklasse nach DBV/VDZ-Sichtbetonmerkblatt. Angabe von Textur, Fugenschnitt, Schalhautklasse, Schalhautalterung und Farbtongleichmäßigkeit im Entwurf.",
          standard: "DBV/VDZ-Sichtbetonmerkblatt 2015",
          tip: "SB3 (hohe Anforderungen) und SB4 (besonders hohe Anforderungen) erfordern eine gesonderte Leistungsbeschreibung für Schalungshaut (z.B. sägerau, glatte saugende/nicht-saugende Platten) und zwingend eine ca. 2x2m große Vorab-Erprobungsfläche vor Ort."
        },
        {
          id: "pl_bst_3",
          title: "Nachhaltigkeitsanforderungen (GWP / LCA) im LV forcieren",
          description: "Vorgabe von CO₂-Grenzwerten (GWP-Wert in kg CO₂-eq/m³) für Tragwerksbetone und Primärbauteile. Spezifikation der EPD-Nachweise.",
          standard: "DGNB / QNG-Schnittstelle / EPD",
          tip: "Schreiben Sie für massige Innenbauteile CEM III/A-Zemente (Hüttensandzement mit min. 35-65 % Hüttensandgehalt) oder CO₂-reduzierte Zemente (CEM II/B-M oder CEM II-C) vor. Das senkt den Hydratationsgipfel und verringert das GWP um über 40 %."
        },
        {
          id: "pl_bst_4",
          title: "Materialverträglichkeit & Korrosionsschutz (Holz/Metall/Gips)",
          description: "Sicherstellung der Materialverträglichkeit zur Verhinderung von Kontaktkorrosion. Keine ungeschützten Stahlelemente in Verbindung mit gipshaltigen Putzen oder gerbstoffreichen Hölzern (z.B. Eiche).",
          standard: "DIN EN ISO 14713 / DIN 68800",
          important: true,
          tip: "Stahlbauteile im feuchtigkeitsbelasteten Verbund mit Eichenholz müssen aus Edelstahl A4 (Werkstoff-Nr. 1.4401/1.4404) bestehen. Gerbsäure zerstört normalen feuerverzinkten Stahl (Zinkschichtdicke ≤ 50 µm) innerhalb kürzester Zeit."
        }
      ]
    }
  ],
  traps: [
    {
      title: "Fehlender Hinweis auf Mindestfestigkeit bei Untergründen",
      consequence: "Der Estrichleger bringt den Fließestrich auf einen zu weichen Betonuntergrund auf. Es kommt zu massiven Schalenrissen und Hohlstellen.",
      avoid: "Immer die geforderte Untergrund-Abreißfestigkeit (z.B. min. 1,5 N/mm² für Industrieböden) im LV festlegen und vor Verlegung prüfen lassen."
    },
    {
      title: "Veraltete Normbezüge im LV",
      consequence: "Bieter bieten veraltete Baustoffe oder unzulässige Konstruktionen an. Das LV ist rechtlich angreifbar.",
      avoid: "Prüfe regelmäßig deine Standardleistungsbücher (STLB-Bau) und vermeide das ungeprüfte Kopieren alter Projekt-LVs."
    }
  ],
  professionalTip: "Erstelle am Ende von Phase 3 eine exakte Schnittstellen-Matrix aller beteiligten Planer (Tragwerk, TGA, Bauphysik, Brandschutz) und lassen Sie diese schriftlich vom Bauherrn freigeben. Nachträgliche geometrische Änderungen an Rohbauteilen kosten im Schnitt das Fünffache der ursprünglichen Planungskosten!"
};

const DATA_BAULEITUNG: TabContent = {
  title: "Bauleitung & Baustelle",
  tagline: "Qualitätssicherung vor Ort, Abnahmeprozesse und rechtssichere Dokumentation",
  icon: <Wrench size={28} className="text-shiraz" />,
  themeColor: "shiraz",
  intro: "Die Baustelle verzeiht keine Nachlässigkeiten. Als Bauleiter/in sind Sie Sachwalter des Bauherrn. Sie müssen die Ausführung vor Ort auf Übereinstimmung mit Plänen, Baugenehmigung und den Regeln der Technik überwachen.",
  sections: [
    {
      id: "betonannahme",
      title: "Betonannahme & Frischbetonkontrolle",
      description: "Worauf Sie beim Eintreffen der Fahrmischer zwingend achten müssen, bevor der Beton gepumpt wird.",
      items: [
        {
          id: "bl_bet_1",
          title: "Lieferscheinkontrolle auf Vollständigkeit",
          description: "Prüfung: Entspricht der gelieferte Beton exakt der statischen Vorgabe (C-Klasse, Expositionsklassen, Größtkorn, Konsistenz)? Verarbeitungszeit prüfen (max. 90-120 Min ab Abfahrt Werk).",
          standard: "DIN EN 206 / DIN 1045-2",
          important: true,
          tip: "Lieferscheine lückenlos sammeln und mit Bauteilzuordnung (z.B. 'Decke über 1.OG, Takt 2') im Archiv ablegen. Wichtig für die spätere Konformitätskontrolle!"
        },
        {
          id: "bl_bet_2",
          title: "Nachträgliches Baustellenwasser unterbinden",
          description: "Das illegale Hinzufügen von Wasser zur Verbesserung der Fließfähigkeit erhöht den Wasser-Zement-Wert (w/z) dramatisch und beschädigt Festigkeit, Frostbeständigkeit und Karbonatisierungswiderstand.",
          important: true,
          tip: "Jeder Liter unberechtigt zugegebenes Wasser erhöht den w/z-Wert der Mischung um ca. 0,02, was die 28-Tage-Zylinderdruckfestigkeit um rund 3 bis 5 N/mm² mindert. Konsistenzänderungen dürfen nur durch zertifizierte Zugabe von Fließmittel (FM) erfolgen."
        },
        {
          id: "bl_bet_3",
          title: "Konsistenzprüfung (Ausbreitversuch)",
          description: "Regelmäßige Durchführung des Ausbreitmaß-Versuchs bei großen Betonagen oder begründetem Verdacht auf geänderte Konsistenz.",
          standard: "DIN EN 12350-5",
          tip: "Führe den Ausbreitversuch bei der ersten Lieferung eines Bauteils und danach bei jeder 50 m³ Charge durch. Ein Sollwert von F3 entspricht einem Ausbreitmaß von 420 bis 480 mm. Weicht der Ist-Wert um mehr als 30 mm ab, ist der Mischer abzuweisen."
        },
        {
          id: "bl_bet_4",
          title: "Nachbehandlung sofort einleiten",
          description: "Sicherstellung, dass der Beton unmittelbar nach dem Abziehen vor Austrocknung, Wind, Sonne und Frost geschützt wird (Folie, Curing-Lack oder Feuchthalten).",
          standard: "DIN EN 13670 / DIN 1045-3",
          important: true,
          tip: "Nachbehandlung nach Klasse NB2 (Dauer min. 2 bis 4 Tage je nach Festigkeitsentwicklung des Betons und Außentemperatur) veranlassen. Bei Bauteilkern-Temperaturen unter +5 °C ist die Hydratation gehemmt, hier sind zwingend Thermomatten vorzuschreiben."
        },
        {
          id: "bl_bet_5",
          title: "Frischbetontemperatur & Luftporengehalt (Luftporentopf)",
          description: "Messung der Betontemperatur (Soll: min. +5 °C, bei Kälte min. +10 °C, max. +30 °C im Sommer) und Überprüfung des Luftporengehalts bei LP-Betonen (Expositionsklassen XF2 / XF4).",
          standard: "DIN EN 12350-7",
          important: true,
          tip: "Bei Beton mit künstlichen Luftporen (z. B. für Verkehrsflächen oder Brückenkappen) muss der Luftporengehalt sofort am Mischer mit dem 8-Liter-Druckausgleichstopf gemessen werden. Sollwert meist 4,0 bis 6,0 Vol.-%. Unterschreitung führt zu irreparablen Frost-Tausalz-Schäden!"
        },
        {
          id: "bl_bet_6",
          title: "Probekörperherstellung (Würfel/Zylinder) & Baustellenlagerung",
          description: "Herstellung von Prüfkörpern (Würfel 150 mm oder Zylinder 150/300 mm) zur Festigkeitsüberprüfung im Alter von 28 Tagen (DIN EN 12390-1 und -2).",
          standard: "DIN EN 12390-2",
          important: true,
          tip: "Gefahr von Scheinergebnissen: Die Würfel müssen nach 2-lagigem Einfüllen und Rütteln/Stochern für die ersten 24 bis 48 Stunden auf der Baustelle geschützt vor Erschütterung und Kälte bei 20 ± 5 °C gelagert werden. Danach sofortiger Transport ins Labor zur feuchten Wasserbadlagerung (20 ± 2 °C)."
        }
      ]
    },
    {
      id: "bewehrung",
      title: "Bewehrungsabnahme",
      description: "Prüfpunkte vor der betonseitigen Freigabe (Bewehrungsabnahme ist eine der wichtigsten Haftungs-Schnittstellen!).",
      items: [
        {
          id: "bl_bew_1",
          title: "Abstandshalter & Mindestbetondeckung",
          description: "Kontrolle der verlegten Abstandshalter (Spacers) für die untere, obere und seitliche Bewehrung. Richtige Anzahl (Richtwert: min. 4 Stk/m² bei Decken) und Materialstärke.",
          standard: "DBV-Merkblatt 'Unterstützungen' / Eurocode 2",
          important: true,
          tip: "Für Sichtbeton oder WU-Bauteile ausschließlich Faserzement- oder Kunststoff-Einzelabstandshalter einsetzen. Die Betondeckung c_nom (meist c_min + 10 mm Toleranz) muss am nackten Stahl mit der Prüflehre nachgemessen und dokumentiert werden!"
        },
        {
          id: "bl_bew_2",
          title: "Sauberkeit der Stähle prüfen",
          description: "Die Bewehrung muss frei von schalungsölartigen Trennmitteln, losem Blätterrost, Schmutz, Fett, Eis oder Schnee sein, um den Verbund zum Beton nicht zu gefährden.",
          important: true,
          tip: "Leichter, festsitzender rötlicher Anflugrost behindert den Verbund nicht (er verbessert ihn oft geringfügig). Blättriger Schuppenrost, Eisansatz oder Trennmittelflecken müssen vor Betonage per Drahtbürste oder Heißdampf gereinigt werden."
        },
        {
          id: "bl_bew_3",
          title: "Verankerungs- und Übergreifungslängen abgleichen",
          description: "Prüfung der Stoßbereiche der Bewehrungsmatten und -stäbe. Sind genügend Übergreifungslängen nach Statik-Bewehrungsplan vorhanden (z.B. min. 40-50d)?",
          standard: "DIN EN 1992-1-1 (Eurocode 2)",
          important: true,
          tip: "Die Mindestübergreifungslänge l_0 ist abhängig vom Stabdurchmesser Ø und der Betonfestigkeitsklasse. Bei einem Stabdurchmesser von 12 mm und gutem Verbundbereich (z.B. Decke unten) liegt l_0 in der Regel bei min. 45 bis 55 cm."
        },
        {
          id: "bl_bew_4",
          title: "Einbauteile (Einbautöpfe, Ankerschienen) sichern",
          description: "Kontrolle, ob alle Ankerschienen, Blitzschutzdrähte und TGA-Rohre lagestabil befestigt sind, damit sie beim Rütteln des Betons nicht verrutschen.",
          tip: "Potentialausgleich und Fundamenterder nach DIN 18015: Der Durchgangswiderstand muss vor dem Betonieren vom Elektrofachbetrieb gemessen und mit einem Prüfprotokoll (Widerstand R < 0,2 Ohm) übergeben werden."
        }
      ]
    },
    {
      id: "recht_doku",
      title: "Bauvertragsrecht & Baustellendokumentation",
      description: "Rechtssicheres Handeln nach VOB/B und BGB im stressigen Baustellenalltag.",
      items: [
        {
          id: "bl_rec_1",
          title: "Lückenloses Bautagebuch führen",
          description: "Tägliche Erfassung von: Wetter (Temperatur min/max zur Beurteilung von Frost/Hitzeeinfluss), Mannschaftsstärke, eingesetzten Geräten, Baufortschritt und empfangenen Anweisungen.",
          standard: "HOAI Leistungsbild Lph 8 / DIN 18550",
          important: true,
          tip: "Fotodokumentation mit Datum, Uhrzeit und Bauteilverortung anlegen. Machen Sie Detailfotos von verdeckten Bauteilen (z.B. Fußbodenheizungsrohre, Grundleitungsverlegungen) stets vor dem Verfüllen oder Betonieren."
        },
        {
          id: "bl_rec_2",
          title: "Behinderungsanzeige rechtzeitig stellen",
          description: "Sobald Vorleistungen anderer Gewerke fehlen oder Pläne unvollständig sind, muss dem Bauherrn unverzüglich eine schriftliche Behinderungsanzeige zugehen.",
          standard: "§ 6 Abs. 1 VOB/B",
          important: true,
          tip: "Vergiss mündliche Absprachen beim Jour Fixe! Eine Behinderungsanzeige muss zwingend schriftlich ergehen (z.B. per Einschreiben oder Boten). Benennen Sie exakt das betroffene Gewerk und verzögerte Kalendertage im Bauzeitenplan."
        },
        {
          id: "bl_rec_3",
          title: "Bedenkenanmeldung (Hinweispflicht)",
          description: "Wenn Sie als ausführendes Unternehmen bemerken, dass die geplante Konstruktion oder der Untergrund der Bauherrschaft fehlerhaft ist, müssen Sie zwingend schriftlich Bedenken anmelden.",
          standard: "§ 4 Abs. 3 VOB/B",
          important: true,
          tip: "Die Bedenkenanmeldung muss vor Ausführung der Arbeiten detailliert und für den Bauherrn (auch als Laien) verständlich begründet werden. Wird die Anmeldung unterlassen, haftet der Auftragnehmer vollständig für Folgeschäden."
        }
      ]
    },
    {
      id: "baustoffpruefung_baustelle",
      title: "Baustoffprüfungen & Schnelltests vor Ort",
      description: "Prüfmethoden auf der Baustelle zur Qualitätsabsicherung vor der Weiterverarbeitung von Baustoffen.",
      items: [
        {
          id: "bl_bsp_1",
          title: "Bodenfeuchtemessung (CM-Messung) für Belegreife",
          description: "Zerstörende Prüfung des Estrichs mittels Calciumcarbid-Methode (CM) vor dem Verlegen von feuchteempfindlichen Bodenbelägen (Parkett, PVC). Die bloße elektronische Widerstandsmessung ist nicht gerichtsverwertbar!",
          standard: "DIN 18560-1",
          important: true,
          tip: "Belegreife-Grenzwerte bei Zementestrich unbeheizt: ≤ 2,0 CM-%, beheizt: ≤ 1,8 CM-%. Bei Calciumsulfatestrich (Anhydrit) unbeheizt und beheizt: ≤ 0,5 CM-% bzw. ≤ 0,3 CM-%. Die Einwaage beträgt je nach Typ exakt 50 g oder 100 g."
        },
        {
          id: "bl_bsp_2",
          title: "Haftzugprüfung (Abreißfestigkeit) für Beschichtungen",
          description: "Prüfung des Betonuntergrunds bei Altbauteninstandsetzungen, Verbundestrichen oder PCC-Beschichtungen. Der Untergrund muss tragfähig und frei von Zementschlämmen/Sinterschichten sein.",
          standard: "DIN EN 1542 / DAfStb-Instandsetzungsrichtlinie",
          tip: "Für übliche Bodenbeschichtungen ist eine Oberflächenzugfestigkeit im Mittel von ≥ 1,5 N/mm² (kleinster Einzelwert ≥ 1,0 N/mm²) nachzuweisen, ermittelt durch das Aufkleben von 50 mm Prüfscheiben und vertikalem Abzug."
        },
        {
          id: "bl_bsp_3",
          title: "Holzfeuchtemessung bei tragenden Holzbauteilen",
          description: "Messung der Holzfeuchtigkeit mittels Einstech-Widerstandsmessgerät vor dem Einbau oder dem Beplanken mit Dampfbremsen.",
          standard: "DIN 1052 / DIN EN 1995-1-1",
          tip: "Die Einbaufeuchte tragender Hölzer im Hochbau darf im Mittel maximal 20 % betragen (optimal < 15 % im beheizten Innenbereich). Zu feuchtes Holz schwindet im Trocknungsprozess unkontrolliert und begünstigt holzzerstörende Pilze."
        },
        {
          id: "bl_bsp_4",
          title: "Lagerungskontrolle empfindlicher Baustoffe",
          description: "Trockene und frostfreie Lagerung im Baustellenlager. Zementsäcke auf Paletten lagern, nicht direkt auf dem feuchten Betonboden. Haltbarkeitsdatum prüfen (Chromatarmut!). Dichtstoffe temperiert lagern.",
          important: true,
          tip: "Zementfreie Putze und Dispersionskleber weisen Frostempfindlichkeit auf. Trockensackware altert durch Luftfeuchte, die Wirksamkeit der Chromatreduzierer verfällt meist nach 6 Monaten trockener Lagerung (EG-Richtlinie 2003/53/EG)."
        }
      ]
    }
  ],
  traps: [
    {
      title: "Ausführung ohne freigegebene Pläne",
      consequence: "Es wird nach Entwurfsplänen gebaut. Spätere Statikänderungen erfordern aufwändige, extrem teure Abbruch- oder Verstärkungsmaßnahmen.",
      avoid: "Gib niemals mündliche Betonierfreigaben, wenn keine gestempelten Ausführungspläne mit dem Vermerk 'Zur Ausführung freigegeben' vorliegen."
    },
    {
      title: "Übersehen von Schlechtwetter-Vorgaben",
      consequence: "Mauerwerksmörtel gefriert bei -3°C nachts, Estrich trocknet bei Zugluft zu rasch aus und schüsselt irreparabel.",
      avoid: "Betonieren Sie nicht bei Bauteiltemperaturen unter +5°C ohne Winterbaumaßnahmen (Vorwärmen, Abdecken)."
    }
  ],
  professionalTip: "In der Bauleitung werden Sie mitunter vor Herausforderungen gestellt ('Das haben wir schon immer so gemacht!'). Bleiben Sie stets ruhig und höflich, argumentieren Sie sachlich auf Basis der Ausführungspläne und Normen. Setzen Sie sich im Zweifel nie über die Tragwerksplanung hinweg."
};

const DATA_PRODUKTION: TabContent = {
  title: "Produktherstellung & QS",
  tagline: "Werkseigene Produktionskontrolle (WPK), CE-Zeichen und Qualitätssicherung",
  icon: <Factory size={28} className="text-shiraz" />,
  themeColor: "shiraz",
  intro: "In den Herstellerwerken für Betonwaren, Transportbeton, Asphalt und Mörtelprodukte entscheidet die Präzision der Dosierungsanlagen über die Güte des Endproduktes. Eine lückenlose werkseigene Produktionskontrolle ist gesetzliche Pflicht u.a. nach der EU-Bauproduktenverordnung (BauPVO).",
  sections: [
    {
      id: "wpk_prozesse",
      title: "Werkseigene Produktionskontrolle (WPK)",
      description: "Kernprozesse zur Einhaltung der Produktgrenzwerte und Konformitätsstufen.",
      items: [
        {
          id: "pr_wpk_1",
          title: "Eingangskontrolle der Rohstoffe",
          description: "Überprüfung der Bindemittel-Zertifikate, Feuchtemessung der Gesteinskörnungen (Kompensation des Eigenfeuchte-Wasseranteils in der Dosieranlage), Sieblinienanalyse der Zuschläge.",
          standard: "DIN EN 12620 / DIN 1045-2",
          important: true,
          tip: "Die Sandfeuchte schwankt witterungsbedingt stark. Bei z. B. 4 % Eigenfeuchtigkeit im 0/2-Sand müssen bei einer Soll-Dosierung von 1000 kg Sand exakt 40 kg freie Feuchte vom Soll-Anmachwasser abgezogen und der Sand-Einwaage zugeschlagen werden (Kompensationsrechner)."
        },
        {
          id: "pr_wpk_2",
          title: "Waagen- und Dosierkalibrierung",
          description: "Regelmäßige Überprüfung und Eichung der Zement-, Wasser- und Zusatzmittelwaagen zur Vermeidung von Fehlmischungen.",
          standard: "DIN EN ISO 9001 / DIN EN 206 Abs. 9.7",
          important: true,
          tip: "Die zulässigen Dosiertoleranzen bei Beton herstellen liegen laut DIN EN 206 bei maximal ±3 % für Gesteinskörnungen und Zusatzstoffe sowie maximal ±2 % für gesetzlich überwachte Mengen an Zement, Wasser und Zusatzmitteln (FM, BV)."
        },
        {
          id: "pr_wpk_3",
          title: "Probekörper-Herstellung & Prüfung",
          description: "Tägliches Herstellen von Würfeln (150 mm) oder Zylindern, ordnungsgemäße Lagerung im Wasserbad bei (20 ± 2) °C oder in der Feuchtkammer bei ≥ 95 % r. F. (DIN EN 12390-2) und Prüfung nach 28 Tagen.",
          standard: "DIN EN 12390-2",
          tip: "Die Probekörper müssen für die ersten 20 bis 24 Stunden bei +20 ±5 °C erschütterungsfrei im Werk lagern. Danach werden die Probekörper ausgeschalt, es folgt lückenlose Wasserbad-Lagerung bei exakt +20 ±2 °C bis zum Erreichen des 28. Prüftages."
        }
      ]
    },
    {
      id: "ce_kennzeichnung",
      title: "BauPVO, DoP & CE-Konformität",
      description: "Rechtliche Voraussetzungen für das Inverkehrbringen von Bauprodukten im europäischen Binnenmarkt.",
      items: [
        {
          id: "pr_ce_1",
          title: "Leistungserklärung (Declaration of Performance - DoP)",
          description: "Der Hersteller muss für jedes harmonisierte Bauprodukt eine DoP erstellen, in der die wesentlichen Leistungsmerkmale (z.B. Druckfestigkeit, Wärmeleitfähigkeit) deklariert sind.",
          standard: "BauPVO (EU) 2024/3110 (anwendbar seit 08.01.2026); für bestehende hEN gilt übergangsweise noch VO (EU) 305/2011",
          important: true,
          tip: "Die Leistungserklärung (DoP) ist dem Abnehmer zwingend elektronisch oder in gedruckter Form bereitzustellen und muss für einen Zeitraum von mindestens 10 Jahren ab dem Zeitpunkt des Inverkehrbringens archiviert werden."
        },
        {
          id: "pr_ce_2",
          title: "CE-Kennzeichnung anbringen",
          description: "Prüfung, ob das CE-Symbol vorschriftsmäßig auf der Verpackung, dem Etikett oder den Begleitdokumenten angebracht ist, inkl. Kennnummer der notifizierten Stelle.",
          important: true,
          tip: "Das CE-Kennzeichen ist die formale Bestätigung des Herstellers, dass das Produkt den deklarierten Eigenschaften in der DoP entspricht. Fehlt es, darf das Bauteil rechtlich nicht auf der Baustelle eingebaut werden."
        },
        {
          id: "pr_ce_3",
          title: "System-Konformitätsbewertung",
          description: "Kenntnis über das geforderte System der Bewertung und Überprüfung der Leistungsbeständigkeit (System 1+, 1, 2+, 3, 4). Wann ist ein externer Zertifizierer zwingend erforderlich?",
          standard: "Anhang V der BauPVO",
          tip: "Bei tragenden Bauteilen (z.B. Deckenplatten im System 2+) führt eine notifizierte Stelle (Überwachungsstelle) die Erstinspektion des Werkes sowie die laufende WPK-Drittüberwachung (meist 2x jährlich) durch und stellt das Konformitätszertifikat aus."
        }
      ]
    },
    {
      id: "fehler_fertigteil",
      title: "Feinschliff & Fehlervermeidung bei Fertigteilen",
      description: "Qualitätskriterien für Sichtbeton-Fertigteile, Architekturbeton und Verbundbauteile.",
      items: [
        {
          id: "pr_ff_1",
          title: "Lunker- und Porenvermeidung",
          description: "Optimierung der Schalungsreinigung und des Schalölauftrags (hauchdünn!). Anpassung der Rüttelenergie und Schütthöhe zur Verhinderung von Luftblasen an der Schalwand.",
          important: false,
          tip: "Ein exzessiver Auftrag von Trennmittel führt zur Bildung von 'Öltaschen'. Dies verursacht dunkle, mehlige Verfärbungen und unregelmäßige Poren am erhärteten Sichtbeton. Solltrennmittelauftrag: hauchdünne 10 bis 20 ml/m²."
        },
        {
          id: "pr_ff_2",
          title: "Prävention von Delayed Ettringite Formation (DEF)",
          description: "Bei Wärmebehandlung / Dampfhärtung von Fertigteilen darf die Bauteiltemperatur an keiner Stelle 60-65°C überschreiten, um eine spätere, zerstörende Ettringitbildung im erhärteten Beton bei Feuchtigkeitszutritt zu verhindern.",
          standard: "DAfStb-Richtlinie Wärmebehandlung",
          important: true,
          tip: "Übersteigt die Kerntemperatur während der Schnellhärtung +60 °C bis +65 °C, zersetzt sich das primäre Ettringit. Unter Feuchtebelastung im Außenbereich dehnt sich dieses später als Sekundärettringit im dichten Betongefüge aus und sprengt dieses (Spättreibschaden)."
        }
      ]
    },
    {
      id: "produktion_beton_asphalt",
      title: "Präzisions-Baustofftechnologie & Transportbetonwerk-QS",
      description: "Prozessüberwachung im Transportbetonwerk, Fertigteilwerk oder Asphaltmischwerk nach chemisch-physikalischen Kriterien.",
      items: [
        {
          id: "pr_bta_1",
          title: "Zement- und Bindemitteltemperatur überwachen",
          description: "Zement aus Silozügen kann Temperaturen von über 70°C haben. Dies beschleunigt die Hydratation enorm, führt zu unkontrollierbarem Konsistenzverlust, erhöht die Viskosität des Leims und das thermische Rissrisiko.",
          standard: "DIN EN 206 / DIN 1045-2",
          tip: "Frisch angelieferter Zement mit einer Temperatur von >65 °C beschleunigt das Erstarren ungemein. Hier muss die Frischbetontemperatur (Sollwert: maximal +30 °C) durch kühles Anmachwasser oder Schuppeneis-Beimischungen kompensiert werden."
        },
        {
          id: "pr_bta_2",
          title: "Korngrößenverteilung & Sieblinienschwankung im Labor",
          description: "Tägliche Dichtemessungen und Feuchteprüfungen der feinen Sandfraktionen. Sofortiger Ausgleich von Unter- oder Überkorn durch Anpassung der gravimetrischen Wiegeanteile in der Mischanlagen-Steuerung.",
          standard: "DIN EN 933-1",
          important: true,
          tip: "Ein plötzlicher Anstieg der staubfeinen Kornfraktion (< 0,063 mm) erhöht die spezifische Oberfläche im Zementleim enorm, steigert den Wasseranspruch der Mischung und kann folglich die Festigkeit durch ansteigenden w/z-Wert absinken lassen."
        },
        {
          id: "pr_bta_3",
          title: "Substitutionsraten von Recycling-Baustoffen (RC-Splitt)",
          description: "Strikte Einhaltung der maximal zulässigen Substitutionsraten bei der Zumischung von rezyklierten Gesteinskörnungen (Typ 1 und Typ 2 nach DAfStb-Richtlinie) zur Einhaltung der Betoneigenschaften.",
          standard: "DAfStb-Richtlinie RC-Beton 2010",
          tip: "Bei Typ 1 (rc-Betonsplitt) sind im Anwendungsbereich der trockenen Innenbauteile (XC1, XC2) bis zu 35 Vol.-% Substitution der groben Gesteinskörnung (>2 mm) ohne vertiefte Eignungsprüfung statisch unbedenklich."
        },
        {
          id: "pr_bta_4",
          title: "Bitumen-Viskosität & Schaumbitumen im Asphaltmischwerk",
          description: "Überwachung der Erhitzungstemperaturen zur Verhinderung einer Alterung (Oxidationsverhärtung) des Bitumens im Lagertank und während des Mischens.",
          standard: "TL Asphalt-StB / DIN EN 12591",
          important: true,
          tip: "Die Mischtemperatur für Straßenbaubitumen liegt je nach Typ (z.B. 50/70 oder 70/100) exakt bei +140 °C bis +180 °C. Eine thermische Überhitzung von >190 °C führt zur vorzeitigen thermo-oxidativen Alterung und Versprödung des Asphalts."
        }
      ]
    }
  ],
  traps: [
    {
      title: "Mangelhafte Feuchtemessung der Gesteinskörnung",
      consequence: "An regnerischen Tagen wird deutlich zu viel Wasser dosiert. Der w/z-Wert schnellt in die Höhe, die 28-Tage-Druckfestigkeit der Baureihe bricht ein.",
      avoid: "Sichern Sie die tägliche Kalibrierung der Mikrowellensonden in den Sandbunkern und führe regelmäßige CM-Gegenmessungen durch."
    },
    {
      title: "Ausbleiben der Fremdüberwachung",
      consequence: "Das Werk verliert sein Ü-Zeichen oder die CE-Zertifizierung. Ein sofortiger Lieferstopp für zertifizierungspflichtige Baustellen droht.",
      avoid: "Führe die vorgeschriebene Dokumentation für die Überwachungsstelle absolut lückenlos und planmäßig."
    }
  ],
  professionalTip: "Führe im Werk ein aktives Fehlermanagement-System (FMEA) ein. Fehler in der Rezeptierung oder Beschädigungen beim Entschalen von Fertigteilen kosten ein Vielfaches, wenn sie erst auf der Baustelle vom Kunden bemängelt und zurückgewiesen werden."
};

const DATA_KARRIERE: TabContent = {
  title: "Karrierestart & Soft Skills",
  tagline: "Die ersten 100 Tage im Ingenieursberuf - Kommunikation und persönliche Schutzausrüstung",
  icon: <GraduationCap size={28} className="text-shiraz" />,
  themeColor: "shiraz",
  intro: "Der Übergang von der Hochschule in die Berufspraxis ist ein Meilenstein. Neben hervorragendem baustofflichen Fachwissen entscheiden vor allem Kommunikationsstärke, Durchsetzungsvermögen und rechtliche Umsicht über deinen Erfolg.",
  sections: [
    {
      id: "kommunikation",
      title: "Professionelle Kommunikation am Bau",
      description: "Erfolgreicher Umgang mit Auftraggebern, Polieren und Nachunternehmern.",
      items: [
        {
          id: "ka_kom_2",
          title: "Schriftlichkeitsgebot konsequent umsetzen",
          description: "Wichtige Zusagen, Freigaben, Leistungsänderungen oder Mängelabsprachen immer per Mail oder Protokoll schriftlich bestätigen. 'Wer schreibt, der bleibt!'",
          important: true,
          tip: "Sende nach jedem Telefonat oder Vor-Ort-Gespräch sofort eine kurze Bestätigungs-E-Mail: 'Dokumentation des Gesprächs vom [Datum] um [Uhrzeit]: Zur Absicherung unserer Absprache halte ich fest, dass...'."
        },
        {
          id: "ka_kom_3",
          title: "Umgang mit Konflikten und Claims",
          description: "Mängel sachlich, unaufgeregt aber bestimmt ansprechen. Nicht emotional werden, sondern stets auf Basis der vertraglich vereinbarten Leistung und Normen argumentieren.",
          important: false,
          tip: "Bei Behauptungen unberechtigter Mehrkosten immer zuerst verweisen auf: 'Die vertraglich geschuldete Beschaffenheit nach Leistungsbeschreibung'. Fordern Sie jeden Claim schriftlich unter Angabe der exakten Anspruchsgrundlage ein."
        }
      ]
    },
    {
      id: "sicherheit_psa",
      title: "Arbeitsschutz & Erste Schritte",
      description: "Ihre persönliche Sicherheit und rechtliche Absicherung im neuen Job.",
      items: [
        {
          id: "ka_sec_1",
          title: "Vollständige PSA (Persönliche Schutzausrüstung)",
          description: "Betreten Sie eine Baustelle niemals ohne: Sicherheitsschuhe S3 (durchtrittsicher), Schutzhelm, Warnweste. Je nach Tätigkeit Schutzbrille, Gehörschutz oder Handschuhe.",
          important: true,
          tip: "Schnittstelle Baustellenverordnung (BaustellV): Als Bauleiter haften Sie mit für die Einhaltung der Unfallverhütungsvorschriften (UVV). Lege sich für unangemeldete Begehungen immer ein ungenutztes Reserve-Set PSA in den PKW."
        },
        {
          id: "ka_sec_2",
          title: "Haftung & Berufshaftpflicht klären",
          description: "Klären Sie mit Ihrem Arbeitgeber ab, in welchem Umfang Sie über das Unternehmen haftpflichtversichert sind (z.B. bei Planungsfehlern oder Freigaben).",
          important: true,
          standard: "Ingenieurkammer-Richtlinien",
          tip: "Prüfen Sie in Ihrer Anstellungsvereinbarung die Haftungsfreistellung im Innenverhältnis. Bei grober Fahrlässigkeit greift der gesetzliche Arbeitnehmer-Haftungsschutz nur sehr eingeschränkt."
        },
        {
          id: "ka_sec_3",
          title: "Fortbildungspflicht im Blick behalten",
          description: "Planen Sie frühzeitig Ihre fachliche Weiterbildung, um Ihre Karrierechancen zu steigern.",
          standard: "Ingenieurkammergesetz (BauKaG / LBO)",
          tip: "Als eingetragener Bauvorlageberechtigter oder Tragwerksplaner sind Sie per Gesetz (z.B. § 3 BauKaG NRW) verpflichtet, jährlich mindestens 8 bis 16 Unterrichtsstunden an staatlich anerkannten Fachfortbildungen nachzuweisen."
        }
      ]
    },
    {
      id: "baustoff_zertifikate",
      title: "Baustoff-Qualifikationen & Fachtitel (E-Schein, SIVV)",
      description: "Spezialisierte bauchemische und betontechnologische Scheine, die im Bauingenieurwesen den Karriere- und Gehaltssprung beschleunigen.",
      items: [
        {
          id: "ka_qua_1",
          title: "Der Betontechnologe (Erweiterte betontechnologische Kenntnisse / E-Schein)",
          description: "Zertifikatslehrgang nach DIN 1045-2 / DBV für die Überwachungsklassen 2 und 3 (ÜK2 / ÜK3). Zwingend vorgeschrieben für Bauleiter bei anspruchsvollen Betonagen (Brücken, Hochhäuser, WU-Konstruktionen, Spannbeton).",
          standard: "DIN 1045-2 / DBV",
          important: true,
          tip: "Voraussetzung: Abgeschlossenes Bauingenieur-Studium oder Baustoffprüfer-Prüfung + 1 Jahr Baustellenerfahrung. Der 2-wöchige Lehrgang an der Ausbildungsbeirat-Stelle (z. B. VDZ / TU München) berechtigt zur betontechnologischen Eigenüberwachung."
        },
        {
          id: "ka_qua_2",
          title: "SIVV-Schein (Schützen, Instandsetzen, Verbinden und Verstärken von Beton)",
          description: "Der Goldstandard für Bauleiter und Poliere in der Betoninstandhaltung von Ingenieurbauwerken (ZTV-ING), Parkhäusern und Tiefgaragen.",
          standard: "DAfStb-Instandsetzungsrichtlinie",
          important: true,
          tip: "Jeder ausführende Fachbetrieb bei der Sanierung von Brücken oder Parkhäusern muss auf der Baustelle zwingend eine Fachkraft mit gültigem SIVV-Schein nachweisen. Der Schein muss alle 3 Jahre durch Fortbildungslehrgänge verlängert werden."
        },
        {
          id: "ka_qua_3",
          title: "Fachingenieur Bauwerkserhaltung & Bauschadensgutachter",
          description: "Vertiefte Qualifikation im Schnittbereich von ZfP (zerstörungsfreie Prüfung), Bauchemie, Bauphysik und juristischer Beweissicherung (z. B. nach IFS / TÜV / ibi an der THA).",
          standard: "VDI 6200 / WTA",
          tip: "Experten für Schadensanalytik (z. B. Chloridinduzierte Lochfraßkorrosion, AKR, Holzschwamm) sind bundesweit extrem gefragt und erzielen als Sachverständige und Sonderfachleute Spitzenhonorare."
        }
      ]
    }
  ],
  traps: [
    {
      title: "Mündliche Freigaben unter Zeitdruck",
      consequence: "Ein Bauteil wird betoniert, bevor die geänderte Statik vorliegt. Es kommt zu Rissen, Sie haften für die Freigabe ohne Berechtigung.",
      avoid: "Lassen Sie sich Freigaben immer schriftlich oder per Stempel/Unterschrift auf dem Plan bestätigen."
    },
    {
      title: "Ignorieren von Sicherheitsverstößen auf der Baustelle",
      consequence: "Ein Arbeiter stürzt auf Ihrer Baustelle ohne Absturzsicherung ab. Als verantwortlicher Bauleiter geraten Sie ins Visier der Staatsanwaltschaft.",
      avoid: "Schaue bei Sicherheitsmängeln niemals weg! Sprechen Sie den Polier oder Sicherheitsbeauftragten (SiGeKo) sofort an und dokumentiere den Vorfall."
    }
  ],
  professionalTip: "Lege sich in den ersten Wochen ein persönliches Notizbuch (analog oder digital) an. Notieren Sie sich täglich Abkürzungen, Fachbegriffe und Namen von Zulieferern. Das zeigt Initiative, Lernbereitschaft und strukturiertes Arbeiten."
};

export default function Praxiswissen() {
  const { activeTab: globalActiveTab, setActiveTab: setGlobalActiveTab } = useTabContext();
  
  const activeTab = React.useMemo(() => {
    if (globalActiveTab === 'px_bauleitung') return 'bauleitung';
    if (globalActiveTab === 'px_produktion') return 'produktion';
    if (globalActiveTab === 'px_karriere') return 'karriere';
    return 'planung';
  }, [globalActiveTab]);

  const setActiveTab = (tab: 'planung' | 'bauleitung' | 'produktion' | 'karriere') => {
    if (tab === 'planung') setGlobalActiveTab('px_planung');
    else if (tab === 'bauleitung') setGlobalActiveTab('px_bauleitung');
    else if (tab === 'produktion') setGlobalActiveTab('px_produktion');
    else if (tab === 'karriere') setGlobalActiveTab('px_karriere');
  };

  const currentData = React.useMemo(() => {
    switch (activeTab) {
      case 'planung': return DATA_PLANUNG;
      case 'bauleitung': return DATA_BAULEITUNG;
      case 'produktion': return DATA_PRODUKTION;
      case 'karriere': return DATA_KARRIERE;
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        
        {/* HEADER BLOCK */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-home-grau/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-shiraz/10 rounded-xl text-shiraz">
              <Award size={32} />
            </div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                Praxiswissen &amp; Bau-Checklisten
              </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Praxisnahe Leitfäden, Schnittstellenprüfungen, Abnahme-Checklisten und Soft-Skills für Absolventen
          </p>
        </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-home-grau/30 mb-6 overflow-x-auto pb-px">
          {[
            { id: 'planung', label: 'Planung & Ausschreibung', icon: <ClipboardCheck size={16} /> },
            { id: 'bauleitung', label: 'Bauleitung & Baustelle', icon: <Wrench size={16} /> },
            { id: 'produktion', label: 'Produktherstellung & QS', icon: <Factory size={16} /> },
            { id: 'karriere', label: 'Karrierestart & Soft Skills', icon: <GraduationCap size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all duration-150 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-shiraz text-shiraz bg-shiraz/5'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-home-grau/30'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN BODY LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: CHECKLIST ENGINE */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {currentData.icon}
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">{currentData.title}</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            {currentData.tagline}
          </p>
        </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-4 border border-home-grau/30 rounded-xl">
                {currentData.intro}
              </p>
            </div>

            {/* CHECKLIST SECTIONS */}
            {currentData.sections.map((section) => (
              <div key={section.id} className="space-y-3 bg-white border border-home-grau/30 p-5 rounded-2xl">
                <div className="flex items-center justify-between border-b border-home-grau/30 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{section.title}</h4>
                    <p className="text-xs text-slate-500">{section.description}</p>
                  </div>
                </div>

                {/* ITEMS REPEATER */}
                <div className="divide-y divide-home-grau/10">
                  {section.items.map((item) => {
                    return (
                      <div 
                        key={item.id} 
                        className="py-3.5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 shrink-0 text-shiraz">
                            <span className="w-1.5 h-1.5 rounded-full bg-shiraz block"></span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-slate-900">
                                {item.title}
                              </span>
                              {item.standard && (
                                <span className="text-xs font-mono font-bold uppercase bg-slate-50 text-slate-700 border border-home-grau/30 px-1.5 py-0.5 rounded shrink-0">
                                  {item.standard}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-slate-705 leading-relaxed mt-1">
                              {item.description}
                            </p>

                            {/* ALWAYS VISIBLE PRACTICE TIPS */}
                            {item.tip && (
                              <div className="mt-2.5 p-3 bg-slate-50 border border-home-grau/30 rounded-lg space-y-2">
                                <div className="text-xs sm:text-sm text-slate-800 flex gap-1.5 font-medium">
                                  <Info size={14} className="text-shiraz shrink-0 mt-0.5" />
                                  <span><strong>Praxis-Tipp:</strong> {item.tip}</span>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT PANEL: EXPOSURE TO TRAPS, RED ZONES & PRO TIPS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* TRAPS / FEHLER UND KONSEQUENZEN */}
            <div className="bg-rose-50/40 border border-shiraz/20 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-shiraz/10 pb-2">
                <AlertOctagon className="text-shiraz" size={20} />
                <span className="text-xs font-bold uppercase tracking-wider text-shiraz block font-bold">
                  Klassische Anfängerfehler
                </span>
              </div>
              
              <div className="space-y-5">
                {currentData.traps.map((trap, index) => (
                  <div key={index} className="space-y-1.5">
                    <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1">
                      <span className="shrink-0 text-shiraz font-bold">&#9888;</span> {trap.title}
                    </h5>
                    <p className="text-sm text-slate-705 leading-relaxed pl-3 border-l-2 border-shiraz/30">
                      <strong>Die Folge:</strong> {trap.consequence}
                    </p>
                    <p className="text-sm text-slate-705 leading-relaxed pl-3 border-l-2 border-home-grau/30">
                      <strong>So vermeide es:</strong> {trap.avoid}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* GOLDEN RULE / PROFESSOR'S TIP */}
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-home-grau/30 pb-2">
                <BookOpen size={16} className="text-shiraz" />
                <span>Professoren-Tipp für den Einstieg</span>
              </div>
              <p className="text-sm text-slate-750 leading-relaxed italic font-medium">
                &ldquo;{currentData.professionalTip}&rdquo;
              </p>
            </div>

            {/* STANDARDS / LEGAL BOUNDS BRIEF */}
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl space-y-3 text-sm">
              <span className="font-bold text-slate-900 block border-b border-home-grau/30 pb-2 text-sm">
                Grundlegende Regelwerke
              </span>
              <div className="space-y-2 text-sm text-slate-800 font-medium">
                <div className="flex items-start gap-1.5">
                  <span className="text-shiraz font-mono font-bold">•</span>
                  <span><strong>VOB Teile A, B &amp; C:</strong> Fundament aller Bauverträge in Deutschland.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-shiraz font-mono font-bold">•</span>
                  <span><strong>BGB Werkvertragsrecht:</strong> Gesetzliche Auffangordnung bei Mängeln und Kündigungen.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-shiraz font-mono font-bold">•</span>
                  <span><strong>DIN 1045 &amp; EN 206:</strong> Das absolute Regel-Duo der Betonkonstruktion.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* INTERAKTIVE MITTEL-NAVIGATION FÜR SCHNELLEN REITERWECHSEL */}
        <div className="border-t border-home-grau/30 mt-8 pt-6 flex flex-wrap items-center justify-between gap-4">
          {activeTab !== 'planung' ? (
            <button
              onClick={() => {
                if (activeTab === 'bauleitung') setActiveTab('planung');
                else if (activeTab === 'produktion') setActiveTab('bauleitung');
                else if (activeTab === 'karriere') setActiveTab('produktion');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-3 border border-home-grau/30 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold rounded-xl text-sm transition-all shadow-sm"
              type="button"
            >
              &larr; Vorheriger Schritt:{' '}
              {activeTab === 'bauleitung' && 'Planung & Ausschreibung'}
              {activeTab === 'produktion' && 'Bauleitung & Baustelle'}
              {activeTab === 'karriere' && 'Produktherstellung & QS'}
            </button>
          ) : (
            <div />
          )}

          {activeTab !== 'karriere' ? (
            <button
              onClick={() => {
                if (activeTab === 'planung') setActiveTab('bauleitung');
                else if (activeTab === 'bauleitung') setActiveTab('produktion');
                else if (activeTab === 'produktion') setActiveTab('karriere');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-shiraz text-white hover:bg-shiraz/90 font-bold rounded-xl text-sm transition-all shadow-md ml-auto"
              type="button"
            >
              Nächster Schritt:{' '}
              {activeTab === 'planung' && 'Bauleitung & Baustelle'}
              {activeTab === 'bauleitung' && 'Produktherstellung & QS'}
              {activeTab === 'produktion' && 'Karrierestart & Soft Skills'}{' '}
              &rarr;
            </button>
          ) : (
            <div />
          )}
        </div>

      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Leistungsbild HOAI', url: 'https://de.wikipedia.org/wiki/Honorarordnung_f%C3%BCr_Architekten_und_Ingenieure#Leistungsbild' },
          { title: 'VOB/B - Vergabe- und Vertragsordnung', url: 'https://de.wikipedia.org/wiki/Vergabe-_und_Vertragsordnung_f%C3%BCr_Bauleistungen' },
          { title: 'EU-Bauproduktenverordnung', url: 'https://de.wikipedia.org/wiki/Bauproduktenverordnung' },
          { title: 'Betonieren', url: 'https://de.wikipedia.org/wiki/Betonieren' }
        ]}
        literatur={[
          'Kochendörfer, R.; Liebchen, J. H.; Viering, M. G. (2018): Bau-Projekt-Management: Grundlagen und Vorgehensweisen (5. Auflage, Springer Vieweg)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Schach, R.; Schubert, H. (2019): Baustelleneinrichtung: Handbuch für Planung und Ausführung (Springer Vieweg)',
          'Deutscher Beton- und Bautechnik-Verein E.V. (DBV): DBV-Sammelmappe Merkblätter und Leitfäden'
        ]}
        regelwerke={[
          { title: 'DIN 1045-3 (Beton, Stahlbeton und Spannbeton - Bauausführung)', url: 'https://www.dinmedia.de/' },
          { title: 'DAfStb-Richtlinie Wasserundurchlässige Baukörper aus Beton (WU-Richtlinie)', url: 'https://www.dafstb.de/' },
          { title: 'DIN 18533 (Abdichtung von erdberührten Bauteilen)', url: 'https://www.dinmedia.de/' }
        ]}
        formeln={[
          {
            formel: 't_{\\text{offen}} = t_{\\text{Erstarrungsbeginn}} - t_{\\text{Mischen}} \\ge 90\\,\\text{min}',
            erklaerung: 'Verarbeitbarkeitsdauer von Frischbeton nach Zugabe des Anmachwassers: Richtwert für Transport- und Einbauzeit bis zum Rüttelvorgang zur Vermeidung von Kaltfugen.',
            quelle: 'DIN EN 206 / DIN 1045-3'
          },
          {
            formel: 'v_{\\text{Betonier}} = \\frac{h_b}{t_b} \\le \\frac{h_{\\text{max}}}{t_{\\text{Erstarrung}}} \\quad [\\text{m/h}]',
            erklaerung: 'Betoniergeschwindigkeit zur Bemessung des maximalen Frischbetondrucks auf vertikale Schalungen nach DIN 18218.',
            quelle: 'DIN 18218'
          }
        ]}
      />
    </div>
  );
}
