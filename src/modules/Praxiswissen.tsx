import React, { useState, useEffect } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
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
          tip: "Kollisionsprüfung im BIM-Modell oder 2D/3D-Plangegenüberstellung durchführen. Bei Schachtmaßen die Dämmdicken der Rohrleitungen (z. B. nach GEG bzw. DIN 1988-200) und Montagetoleranzen von Anfang an einplanen. Schlitze und TGA-Durchbrüche rechtzeitig vom Statiker im Schalplan freigeben lassen!"
        },
        {
          id: "pl_hoai_2",
          title: "Wassereinwirkungsklasse nach DIN 18533 festlegen",
          description: "Prüfung des Bodengutachtens auf den Bemessungswasserstand (HGW - Höchster Grundwasserstand). Ist mit Bodenfeuchte und nicht drückendem Wasser (W1-E) oder mit drückendem Wasser (W2.1-E: mäßige Einwirkung, Eintauchtiefe ≤ 3 m) zu rechnen?",
          standard: "DIN 18533-1",
          important: true,
          tip: "Die Abdichtung wird in der Regel mindestens 15 cm über die Geländeoberfläche geführt. An barrierefreien Übergängen sind geringere Anschlusshöhen nur mit Sondermaßnahmen möglich (z. B. Entwässerungsrinne mit Gitterrost, Gefälle, Überdachung). Details mit DIN 18533-1 bzw. DIN 18531 und der Flachdachrichtlinie abstimmen (Fundstelle manuell prüfen)."
        },
        {
          id: "pl_hoai_3",
          title: "Fugenplanung und WU-Richtlinie abstimmen",
          description: "Planung von Arbeits- und Sollrissfugen bei WU-Betonkonstruktionen (Weiße Wanne). Festlegung der Fugenbänder, Quelldichtungen oder Injektionsschläuche im Plan.",
          standard: "DAfStb-WU-Richtlinie (2017-12)",
          tip: "Fugenabdichtungen nach Herstellerangaben bzw. abP einbauen und lagesicher befestigen. Zwischen Fugenband und Bewehrung so viel Platz lassen, dass der Beton einwandfrei verdichtet werden kann; Einbindetiefen nach Systemnachweis."
        },
        {
          id: "pl_hoai_4",
          title: "Normenkonforme Brandschutzanforderungen (DIN EN 13501-2)",
          description: "Festlegung der Feuerwiderstandsklassen von tragenden Bauteilen (z.B. R90, REI120) und Abstimmung mit der geforderten Mindestbauteildicke sowie Betondeckung.",
          standard: "DIN EN 1992-1-2 / DIN 4102-4",
          tip: "Für R90-Stützen hängt das Mindestachsmaß a nach DIN EN 1992-1-2, Tabelle 5.2a, vom Ausnutzungsgrad μ_fi ab: z. B. bei μ_fi = 0,5 und mehrseitiger Brandbeanspruchung b/a = 300/45 mm oder 400/38 mm. Werte stets im Normtext mit NA prüfen."
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
          tip: "Definieren Sie exakte funktionale Parameter (z.B. Bemessungswert der Wärmeleitfähigkeit λ ≤ 0,035 W/(m·K) nach DIN 4108-4, Schalldämm-Maß Rw ≥ 52 dB), an denen eine Gleichwertigkeit gemessen wird."
        },
        {
          id: "pl_lv_2",
          title: "Expositionsklassen von Beton exakt ausschreiben",
          description: "Spezifizierung aller relevanten Expositionsklassen (z.B. XC4, XD3, XF4) anstelle von pauschalen Festigkeitsvorgaben. Keine unnötig hohen Klassen wählen, das treibt Zementgehalt und Rissrisiko hoch.",
          standard: "DIN 1045-2 / DIN EN 206",
          tip: "Für erdberührte Gründungsbauteile ohne betonangreifendes Grundwasser genügt meist XC2 (nach DIN 1045-2:2008 min. C16/20, w/z ≤ 0,75); nur bei Frostbeanspruchung kommt XF1 hinzu (C25/30, w/z ≤ 0,60). Maßgebend ist die strengste Klasse; Werte der Ausgabe 2023-08 prüfen. Ein Ausschreiben von XF4 ohne Tausalzkontakt zieht unnötige Luftporenbildner nach sich."
        },
        {
          id: "pl_lv_3",
          title: "Nachbehandlungsklassen im Beton-LV vorgeben",
          description: "Ausschreibung der erforderlichen Nachbehandlungsdauer oder Nachbehandlungsklasse (z.B. NB2, NB3 oder NB4). Dies verhindert Streitigkeiten über die Kosten für Abdeckfolien oder Curing-Mittel.",
          standard: "DIN EN 13670 / DIN 1045-3",
          important: false,
          tip: "Festigkeitsentwicklung (schnell, mittel, langsam) im LV angeben. Nachbehandlungsklasse 2 nach DIN EN 13670 verlangt einen Schutz vor Austrocknung, bis 35 % der charakteristischen Druckfestigkeit erreicht sind (Klasse 3: 50 %, Klasse 4: 70 %)."
        },
        {
          id: "pl_lv_4",
          title: "Verträglichkeit von Kontaktschichten (z.B. Bitumen & XPS)",
          description: "Sicherstellung, dass sich berührende Materialien chemisch verträglich sind. Lösungsmittelhaltige Bitumenvoranstriche greifen extrudierten Polystyrolschaum (XPS) an!",
          tip: "Vorschreiben von zweikomponentiger, kunststoffmodifizierter Bitumendickbeschichtung (PMBC - früher KMB) nach DIN 18533 oder flexiblen polymermodifizierten Dickbeschichtungen (FPD) vor, die lösemittelfrei sind. Verträglichkeit mit XPS durch Herstellerangaben bestätigen lassen."
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
          tip: "Für Bauprodukte ohne abZ, abP oder ETA ist eine Zustimmung im Einzelfall (ZiE), für nicht geregelte Bauarten eine vorhabenbezogene Bauartgenehmigung (vBG) bei der obersten Bauaufsichtsbehörde des Landes (bzw. der von ihr bestimmten Stelle) zu beantragen. Mehrere Monate Vorlauf und Versuche einplanen."
        },
        {
          id: "pl_bst_2",
          title: "Sichtbetonklasse (SB 1 bis SB 4) festlegen",
          description: "Eindeutige Spezifikation der Sichtbetonklasse nach DBV/VDZ-Sichtbetonmerkblatt. Angabe von Textur, Fugenschnitt, Schalhautklasse, Schalhautalterung und Farbtongleichmäßigkeit im Entwurf.",
          standard: "DBV/VDZ-Merkblatt Sichtbeton (Ausgabe manuell prüfen)",
          tip: "SB3 (hohe Anforderungen) und SB4 (besonders hohe Anforderungen) erfordern eine gesonderte Leistungsbeschreibung für Schalungshaut (z.B. sägerau, glatte saugende/nicht-saugende Platten) und eine vertraglich vereinbarte Erprobungsfläche, die Schalung, Einbau und Abmessungen des späteren Bauteils abbildet."
        },
        {
          id: "pl_bst_3",
          title: "Nachhaltigkeitsanforderungen (GWP / LCA) im LV forcieren",
          description: "Vorgabe von CO₂-Grenzwerten (GWP-Wert in kg CO₂-eq/m³) für Tragwerksbetone und Primärbauteile. Spezifikation der EPD-Nachweise.",
          standard: "DGNB / QNG-Schnittstelle / EPD",
          tip: "Für massige Innenbauteile CEM III/A (36–65 % Hüttensand nach DIN EN 197-1) oder klinkerreduzierte Zemente (z. B. CEM II/B-M, CEM II/C-M nach DIN EN 197-5) zulassen. Das senkt die Hydratationswärme und je nach Klinkeranteil das GWP des Zements deutlich; Werte über EPD nachweisen lassen."
        },
        {
          id: "pl_bst_4",
          title: "Materialverträglichkeit & Korrosionsschutz (Holz/Metall/Gips)",
          description: "Sicherstellung der Materialverträglichkeit zur Verhinderung von Kontaktkorrosion. Keine ungeschützten Stahlelemente in Verbindung mit gipshaltigen Putzen oder gerbstoffreichen Hölzern (z.B. Eiche).",
          standard: "DIN EN ISO 14713 / DIN 68800",
          important: true,
          tip: "Stahlbauteile im feuchtigkeitsbelasteten Verbund mit Eichenholz müssen aus Edelstahl A4 (Werkstoff-Nr. 1.4401/1.4404) bestehen. Gerbsäure und der niedrige pH-Wert von Eiche beschleunigen den Abtrag von Zinküberzügen erheblich."
        }
      ]
    }
  ],
  traps: [
    {
      title: "Fehlender Hinweis auf Mindestfestigkeit bei Untergründen",
      consequence: "Der Estrichleger bringt den Fließestrich auf einen zu weichen Betonuntergrund auf. Es kommt zu massiven Schalenrissen und Hohlstellen.",
      avoid: "Immer die geforderte Untergrund-Abreißfestigkeit (z. B. Mittelwert ≥ 1,5 N/mm² für Beschichtungen) im LV festlegen und vor Verlegung prüfen lassen."
    },
    {
      title: "Veraltete Normbezüge im LV",
      consequence: "Bieter bieten veraltete Baustoffe oder unzulässige Konstruktionen an. Das LV ist rechtlich angreifbar.",
      avoid: "Prüfen Sie regelmäßig Ihre Standardleistungsbücher (STLB-Bau) und vermeiden Sie das ungeprüfte Kopieren alter Projekt-LVs."
    }
  ],
  professionalTip: "Erstellen Sie am Ende von Phase 3 eine exakte Schnittstellen-Matrix aller beteiligten Planer (Tragwerk, TGA, Bauphysik, Brandschutz) und lassen Sie diese schriftlich vom Bauherrn freigeben. Nachträgliche geometrische Änderungen an Rohbauteilen kosten ein Vielfaches einer rechtzeitigen Planungskorrektur."
};

const DATA_BAULEITUNG: TabContent = {
  title: "Bauleitung & Baustelle",
  tagline: "Qualitätssicherung vor Ort, Abnahmeprozesse und rechtlich belastbare Dokumentation",
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
          description: "Prüfung: Entspricht der gelieferte Beton exakt der statischen Vorgabe (C-Klasse, Expositionsklassen, Größtkorn, Konsistenz)? Zeitpunkt der ersten Wasserzugabe prüfen: Fahrmischerbeton in der Regel spätestens 90 Min danach entladen (abweichende Vereinbarungen, z. B. mit Verzögerer, beachten).",
          standard: "DIN EN 206 / DIN 1045-2",
          important: true,
          tip: "Lieferscheine lückenlos sammeln und mit Bauteilzuordnung (z.B. 'Decke über 1.OG, Takt 2') im Archiv ablegen. Wichtig für die spätere Konformitätskontrolle!"
        },
        {
          id: "bl_bet_2",
          title: "Nachträgliches Baustellenwasser unterbinden",
          description: "Das illegale Hinzufügen von Wasser zur Verbesserung der Fließfähigkeit erhöht den Wasser-Zement-Wert (w/z) dramatisch und beschädigt Festigkeit, Frostbeständigkeit und Karbonatisierungswiderstand.",
          important: true,
          tip: "Bei 300 kg/m³ Zement erhöhen 10 l Wasser je m³ den w/z-Wert um rund 0,03 – das kann die Druckfestigkeit um grob 3 bis 5 N/mm² mindern. Konsistenzanpassungen nur mit Fließmittel nach Vorgabe des Lieferwerks und Dokumentation auf dem Lieferschein."
        },
        {
          id: "bl_bet_3",
          title: "Konsistenzprüfung (Ausbreitversuch)",
          description: "Regelmäßige Durchführung des Ausbreitmaß-Versuchs bei großen Betonagen oder begründetem Verdacht auf geänderte Konsistenz.",
          standard: "DIN EN 12350-5",
          tip: "Prüfhäufigkeit nach DIN 1045-3 (Überwachungsklasse): Augenschein bei jeder Lieferung, Prüfung beim ersten Einbringen und in Zweifelsfällen. Klasse F3 entspricht 420 bis 480 mm Ausbreitmaß; liegt der Wert außerhalb der Klasse (Grenzabweichungen nach DIN EN 206), Beton nicht einbauen und Lieferwerk informieren."
        },
        {
          id: "bl_bet_4",
          title: "Nachbehandlung sofort einleiten",
          description: "Sicherstellung, dass der Beton unmittelbar nach dem Abziehen vor Austrocknung, Wind, Sonne und Frost geschützt wird (Folie, Curing-Lack oder Feuchthalten).",
          standard: "DIN EN 13670 / DIN 1045-3",
          important: true,
          tip: "Mindestdauer der Nachbehandlung nach DIN 1045-3 abhängig von Festigkeitsentwicklung und Oberflächentemperatur festlegen. Unter +5 °C verlangsamt sich die Hydratation stark – Wärmeschutz (Thermomatten, Einhausung) vorsehen und die Nachbehandlung entsprechend verlängern."
        },
        {
          id: "bl_bet_5",
          title: "Frischbetontemperatur & Luftporengehalt (Luftporentopf)",
          description: "Messung der Betontemperatur (Soll: min. +5 °C, bei Kälte min. +10 °C, max. +30 °C im Sommer) und Überprüfung des Luftporengehalts bei LP-Betonen (Expositionsklassen XF2 / XF4).",
          standard: "DIN EN 12350-7",
          important: true,
          tip: "Bei Beton mit künstlichen Luftporen (z. B. für Verkehrsflächen oder Brückenkappen) muss der Luftporengehalt sofort am Mischer mit dem 8-Liter-Druckausgleichstopf gemessen werden. Der Mindestmittelwert hängt vom Größtkorn ab (z. B. 4,5 Vol.-% bei 16 mm nach DIN 1045-2). Unterschreitung führt zu irreparablen Frost-Tausalz-Schäden!"
        },
        {
          id: "bl_bet_6",
          title: "Probekörperherstellung (Würfel/Zylinder) & Baustellenlagerung",
          description: "Herstellung von Prüfkörpern (Würfel 150 mm oder Zylinder 150/300 mm) zur Festigkeitsüberprüfung im Alter von 28 Tagen (DIN EN 12390-1 und -2).",
          standard: "DIN EN 12390-2",
          important: true,
          tip: "Gefahr von Scheinergebnissen: Die Würfel lagern nach dem lagenweisen Verdichten mindestens 16 Stunden, höchstens 3 Tage erschütterungsfrei und geschützt bei 20 ± 5 °C in der Form. Danach Transport ins Labor und Lagerung nach DIN EN 12390-2 (Wasserlagerung 20 ± 2 °C oder Verfahren nach nationalem Anhang)."
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
          description: "Kontrolle der verlegten Abstandshalter (Spacers) für die untere, obere und seitliche Bewehrung. Anzahl und Abstand nach DBV-Merkblatt (abhängig vom Stabdurchmesser) und passende Höhe.",
          standard: "DBV-Merkblätter 'Abstandhalter' und 'Unterstützungen' / DIN EN 1992-1-1",
          important: true,
          tip: "Für Sichtbeton oder WU-Bauteile ausschließlich Faserzement- oder Kunststoff-Einzelabstandshalter einsetzen. Die Betondeckung c_nom = c_min + Δc_dev (in Deutschland i. d. R. Δc_dev = 15 mm, bei XC1 10 mm) muss am verlegten Stahl mit der Prüflehre nachgemessen und dokumentiert werden!"
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
          tip: "Die Übergreifungslänge l_0 hängt von Ø, Betonfestigkeit, Verbundbedingung, Ausnutzung und Stoßanteil ab. Beispiel Ø 12, C25/30, guter Verbund, volle Ausnutzung: l_b,rqd ≈ 48 cm; mit α_6 = 1,4 bis 1,5 ergibt sich l_0 ≈ 68 bis 72 cm. Maßgebend ist der Bewehrungsplan."
        },
        {
          id: "bl_bew_4",
          title: "Einbauteile (Einbautöpfe, Ankerschienen) sichern",
          description: "Kontrolle, ob alle Ankerschienen, Blitzschutzdrähte und TGA-Rohre lagestabil befestigt sind, damit sie beim Rütteln des Betons nicht verrutschen.",
          tip: "Fundamenterder bzw. Funktionspotentialausgleichsleiter nach DIN 18014: Der Durchgangswiderstand muss vor dem Betonieren vom Elektrofachbetrieb gemessen und mit einem Prüfprotokoll (Widerstand R < 0,2 Ohm) übergeben werden."
        }
      ]
    },
    {
      id: "recht_doku",
      title: "Bauvertragsrecht & Baustellendokumentation",
      description: "Rechtlich belastbares Handeln nach VOB/B und BGB im stressigen Baustellenalltag.",
      items: [
        {
          id: "bl_rec_1",
          title: "Lückenloses Bautagebuch führen",
          description: "Tägliche Erfassung von: Wetter (Temperatur min/max zur Beurteilung von Frost/Hitzeeinfluss), Mannschaftsstärke, eingesetzten Geräten, Baufortschritt und empfangenen Anweisungen.",
          standard: "HOAI 2021 Anlage 10, Lph 8 (Dokumentation des Bauablaufs)",
          important: true,
          tip: "Fotodokumentation mit Datum, Uhrzeit und Bauteilverortung anlegen. Machen Sie Detailfotos von verdeckten Bauteilen (z.B. Fußbodenheizungsrohre, Grundleitungsverlegungen) stets vor dem Verfüllen oder Betonieren."
        },
        {
          id: "bl_rec_2",
          title: "Behinderungsanzeige rechtzeitig stellen",
          description: "Sobald Vorleistungen anderer Gewerke fehlen oder Pläne unvollständig sind, muss dem Bauherrn unverzüglich eine schriftliche Behinderungsanzeige zugehen.",
          standard: "§ 6 Abs. 1 VOB/B",
          important: true,
          tip: "Verlassen Sie sich nicht auf mündliche Absprachen beim Jour fixe! Die Behinderungsanzeige muss schriftlich erfolgen und nachweisbar zugehen; ohne Anzeige werden Behinderungen nur berücksichtigt, wenn sie offenkundig sind. Benennen Sie exakt das betroffene Gewerk und verzögerte Kalendertage im Bauzeitenplan."
        },
        {
          id: "bl_rec_3",
          title: "Bedenkenanmeldung (Hinweispflicht)",
          description: "Hat das ausführende Unternehmen Bedenken gegen die vorgesehene Art der Ausführung, gegen gelieferte Stoffe oder Bauteile oder gegen Leistungen anderer Unternehmer, muss es diese dem Auftraggeber unverzüglich, möglichst vor Beginn der Arbeiten, schriftlich mitteilen.",
          standard: "§ 4 Abs. 3 VOB/B",
          important: true,
          tip: "Die Bedenkenanmeldung muss vor Ausführung der Arbeiten detailliert und für den Bauherrn (auch als Laien) verständlich begründet werden. Wird die Anmeldung unterlassen, haftet der Auftragnehmer für daraus folgende Mängel; mit ordnungsgemäßer Mitteilung wird er nach § 13 Abs. 3 VOB/B frei."
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
          description: "Zerstörende Prüfung des Estrichs mittels Calciumcarbid-Methode (CM) vor dem Verlegen von feuchteempfindlichen Bodenbelägen (Parkett, PVC). Elektronische Messgeräte liefern nur Orientierungswerte und ersetzen die CM-Messung als Nachweis nicht.",
          standard: "VOB/C DIN 18365 / DIN 18356; Herstellerangaben",
          important: true,
          tip: "Übliche Belegreife-Grenzwerte bei Zementestrich unbeheizt: ≤ 2,0 CM-%, beheizt: ≤ 1,8 CM-%. Bei Calciumsulfatestrich (Anhydrit) unbeheizt und beheizt: ≤ 0,5 CM-% bzw. ≤ 0,3 CM-%. Die Einwaage beträgt je nach Typ exakt 50 g oder 100 g."
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
          standard: "DIN EN 1995-1-1/NA / DIN 68800-2 / DIN EN 13183-2",
          tip: "Tragende Hölzer werden mit höchstens 20 % Holzfeuchte eingebaut; für beheizte Innenräume ist eine Einbaufeuchte nahe der späteren Ausgleichsfeuchte (etwa 9–15 %) anzustreben. Zu feuchtes Holz schwindet im Trocknungsprozess unkontrolliert und begünstigt holzzerstörende Pilze."
        },
        {
          id: "bl_bsp_4",
          title: "Lagerungskontrolle empfindlicher Baustoffe",
          description: "Trockene und frostfreie Lagerung im Baustellenlager. Zementsäcke auf Paletten lagern, nicht direkt auf dem feuchten Betonboden. Haltbarkeitsdatum prüfen (Chromatarmut!). Dichtstoffe temperiert lagern.",
          important: true,
          tip: "Zementfreie Putze und Dispersionskleber weisen Frostempfindlichkeit auf. Trockensackware altert durch Luftfeuchte, die Wirksamkeit des Chromatreduzierers ist nur bis zum auf dem Sack angegebenen Datum gewährleistet (REACH, Anhang XVII Nr. 47)."
        }
      ]
    }
  ],
  traps: [
    {
      title: "Ausführung ohne freigegebene Pläne",
      consequence: "Es wird nach Entwurfsplänen gebaut. Spätere Statikänderungen erfordern aufwändige, extrem teure Abbruch- oder Verstärkungsmaßnahmen.",
      avoid: "Geben Sie niemals mündliche Betonierfreigaben, wenn keine gestempelten Ausführungspläne mit dem Vermerk 'Zur Ausführung freigegeben' vorliegen."
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
          tip: "Die Sandfeuchte schwankt witterungsbedingt stark. Bei z. B. 4 % Oberflächenfeuchte (bezogen auf die Trockenmasse) im 0/2-Sand müssen bei einer Soll-Dosierung von 1000 kg Sand exakt 40 kg freie Feuchte vom Soll-Anmachwasser abgezogen und der Sand-Einwaage zugeschlagen werden (Kompensationsrechner)."
        },
        {
          id: "pr_wpk_2",
          title: "Waagen- und Dosierkalibrierung",
          description: "Regelmäßige Überprüfung und Kalibrierung der Zement-, Wasser- und Zusatzmittelwaagen zur Vermeidung von Fehlmischungen.",
          standard: "DIN EN 206 (Dosiergenauigkeit) / DIN 1045-2",
          important: true,
          tip: "Nach DIN EN 206 (Tabelle zur Dosiergenauigkeit) gelten ±3 % für Zement, Wasser, die Gesamtmenge der Gesteinskörnung und Zusatzstoffe über 5 % des Zementgehalts sowie ±5 % für Zusatzmittel und Zusatzstoffe bis 5 % (Werte am Normtext prüfen)."
        },
        {
          id: "pr_wpk_3",
          title: "Probekörper-Herstellung & Prüfung",
          description: "Tägliches Herstellen von Würfeln (150 mm) oder Zylindern, ordnungsgemäße Lagerung im Wasserbad bei (20 ± 2) °C oder in der Feuchtkammer bei ≥ 95 % r. F. (DIN EN 12390-2) und Prüfung nach 28 Tagen.",
          standard: "DIN EN 12390-2",
          tip: "Die Probekörper lagern mindestens 16 Stunden, höchstens 3 Tage erschütterungsfrei bei 20 ± 5 °C in der Form. Danach Ausschalen und Lagerung bei 20 ± 2 °C im Wasser bzw. nach dem im nationalen Anhang zugelassenen Verfahren bis zur Prüfung."
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
          tip: "Die Leistungserklärung (nach neuer BauPVO: Leistungs- und Konformitätserklärung) ist dem Abnehmer elektronisch oder auf Papier bereitzustellen; Erklärung und technische Dokumentation sind nach VO (EU) 305/2011 mindestens 10 Jahre aufzubewahren."
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
          tip: "Bei tragenden Bauteilen (z.B. Deckenplatten im System 2+) führt eine notifizierte Stelle (Überwachungsstelle) die Erstinspektion des Werkes sowie die laufende Überwachung der WPK (Häufigkeit nach hEN, häufig 1- bis 2-mal jährlich) durch und stellt das Konformitätszertifikat aus."
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
          tip: "Ein exzessiver Auftrag von Trennmittel führt zur Bildung von 'Öltaschen'. Dies verursacht dunkle, mehlige Verfärbungen und unregelmäßige Poren am erhärteten Sichtbeton. Trennmittel dünn nach Herstellerangabe auftragen (Größenordnung 10 bis 20 ml/m²)."
        },
        {
          id: "pr_ff_2",
          title: "Prävention von Delayed Ettringite Formation (DEF)",
          description: "Bei Wärmebehandlung / Dampfhärtung von Fertigteilen darf die Bauteiltemperatur an keiner Stelle 60-65°C überschreiten, um eine spätere, zerstörende Ettringitbildung im erhärteten Beton bei Feuchtigkeitszutritt zu verhindern.",
          standard: "DAfStb-Richtlinie Wärmebehandlung von Beton",
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
          standard: "DAfStb-Richtlinie (2010) / DIN 1045-2:2023-08",
          tip: "Die zulässigen Anteile rezyklierter Gesteinskörnung > 2 mm hängen von Typ, Expositions- und Feuchtigkeitsklasse ab (nach DAfStb-Richtlinie für Typ 1 etwa 25 bis 45 Vol.-%, für Typ 2 etwa 25 bis 35 Vol.-%). Die maßgebende Tabelle der geltenden Regel prüfen; die Erstprüfung bleibt erforderlich."
        },
        {
          id: "pr_bta_4",
          title: "Bitumen-Viskosität & Schaumbitumen im Asphaltmischwerk",
          description: "Überwachung der Erhitzungstemperaturen zur Verhinderung einer Alterung (Oxidationsverhärtung) des Bitumens im Lagertank und während des Mischens.",
          standard: "TL Asphalt-StB / DIN EN 12591",
          important: true,
          tip: "Die Mischguttemperaturen liegen je nach Bitumensorte (z. B. 70/100, 50/70) etwa zwischen 140 °C und 190 °C; die Höchstwerte nach TL Asphalt-StB sind einzuhalten. Überhitzung beschleunigt die thermo-oxidative Alterung und Versprödung."
        }
      ]
    }
  ],
  traps: [
    {
      title: "Mangelhafte Feuchtemessung der Gesteinskörnung",
      consequence: "An regnerischen Tagen wird deutlich zu viel Wasser dosiert. Der w/z-Wert schnellt in die Höhe, die 28-Tage-Druckfestigkeit der Baureihe bricht ein.",
      avoid: "Sichern Sie die tägliche Kalibrierung der Mikrowellensonden in den Sandbunkern und führen Sie regelmäßig Darrproben (Ofentrocknung) zur Kontrolle durch."
    },
    {
      title: "Ausbleiben der Fremdüberwachung",
      consequence: "Das Werk verliert sein Ü-Zeichen oder die CE-Zertifizierung. Ein sofortiger Lieferstopp für zertifizierungspflichtige Baustellen droht.",
      avoid: "Führen Sie die vorgeschriebene Dokumentation für die Überwachungsstelle absolut lückenlos und planmäßig."
    }
  ],
  professionalTip: "Führen Sie im Werk ein aktives Fehlermanagement-System (FMEA) ein. Fehler in der Rezeptierung oder Beschädigungen beim Entschalen von Fertigteilen kosten ein Vielfaches, wenn sie erst auf der Baustelle vom Kunden bemängelt und zurückgewiesen werden."
};

const DATA_KARRIERE: TabContent = {
  title: "Karrierestart & Soft Skills",
  tagline: "Die ersten 100 Tage im Ingenieursberuf - Kommunikation und persönliche Schutzausrüstung",
  icon: <GraduationCap size={28} className="text-shiraz" />,
  themeColor: "shiraz",
  intro: "Der Übergang von der Hochschule in die Berufspraxis ist ein Meilenstein. Neben hervorragendem baustofflichen Fachwissen entscheiden vor allem Kommunikationsstärke, Durchsetzungsvermögen und rechtliche Umsicht über Ihren Erfolg.",
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
          tip: "Senden Sie nach jedem Telefonat oder Vor-Ort-Gespräch sofort eine kurze Bestätigungs-E-Mail: 'Dokumentation des Gesprächs vom [Datum] um [Uhrzeit]: Zur Absicherung unserer Absprache halte ich fest, dass...'."
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
          tip: "Arbeitsschutz: ArbSchG, BaustellV (Pflichten des Bauherrn, SiGeKo) und DGUV Vorschrift 38 'Bauarbeiten'. Als Aufsichtführende/r tragen Sie Verantwortung für die Einhaltung der Unfallverhütungsvorschriften. Legen Sie sich für unangemeldete Begehungen immer ein ungenutztes Reserve-Set PSA in den PKW."
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
          standard: "Baukammerngesetze der Länder (z. B. BauKaG Bayern)",
          tip: "Kammermitglieder sind nach den Baukammerngesetzen zur beruflichen Fortbildung verpflichtet; Umfang und Nachweis regeln die Fort- und Weiterbildungsordnungen der jeweiligen Kammer (z. B. Bayerische Ingenieurekammer-Bau). Für Listen wie Tragwerksplaner oder Prüfsachverständige gelten zusätzliche Anforderungen."
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
          description: "Nachweis erweiterter betontechnologischer Kenntnisse. Nach DIN 1045-3 muss bei Beton der Überwachungsklassen 2 und 3 die ständige Betonprüfstelle von einer entsprechend qualifizierten Person (E-Schein) geleitet werden.",
          standard: "DIN 1045-3 / Ausbildungsbeirat beim DBV",
          important: true,
          tip: "Lehrgänge mit Prüfung bieten vom Ausbildungsbeirat anerkannte Bildungsträger an (z. B. Bauindustrie- und Betonverbände, VDZ-Akademie). Zulassungsvoraussetzungen und Dauer beim jeweiligen Träger prüfen."
        },
        {
          id: "ka_qua_2",
          title: "SIVV-Schein (Schützen, Instandsetzen, Verbinden und Verstärken von Beton)",
          description: "Der Goldstandard für Bauleiter und Poliere in der Betoninstandhaltung von Ingenieurbauwerken (ZTV-ING), Parkhäusern und Tiefgaragen.",
          standard: "TR Instandhaltung / DAfStb-Instandhaltungs-Richtlinie / ZTV-ING",
          important: true,
          tip: "Jeder ausführende Fachbetrieb bei der Sanierung von Brücken oder Parkhäusern muss nach den einschlägigen Regelwerken qualifiziertes Führungspersonal mit SIVV-Schein (Ausbildungsbeirat 'Schutz und Instandsetzung im Betonbau' beim DBV) einsetzen. Zugelassen werden u. a. Bauingenieurinnen und -ingenieure mit mindestens einem Jahr einschlägiger Praxis. Regeln zur Auffrischung beim Ausbildungsbeirat prüfen."
        },
        {
          id: "ka_qua_3",
          title: "Fachingenieur Bauwerkserhaltung & Bauschadensgutachter",
          description: "Vertiefte Qualifikation im Schnittbereich von ZfP (zerstörungsfreie Prüfung), Bauchemie, Bauphysik und juristischer Beweissicherung (z. B. Lehrgänge von Kammern, IFS, TÜV oder Hochschulen wie das Zertifikatsprogramm 'Ausbau und Bestand' der THA).",
          standard: "VDI 6200 / WTA",
          tip: "Experten für Schadensanalytik (z. B. Chloridinduzierte Lochfraßkorrosion, AKR, Holzschwamm) sind bundesweit gefragt, etwa als Sachverständige oder Sonderfachleute."
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
      avoid: "Schauen Sie bei Sicherheitsmängeln niemals weg! Stellen Sie die Gefahr ab, sprechen Sie Polier und – falls bestellt – den SiGeKo sofort an und dokumentieren Sie den Vorfall."
    }
  ],
  professionalTip: "Legen Sie sich in den ersten Wochen ein persönliches Notizbuch (analog oder digital) an. Notieren Sie sich täglich Abkürzungen, Fachbegriffe und Namen von Zulieferern. Das zeigt Initiative, Lernbereitschaft und strukturiertes Arbeiten."
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
                      <strong>So vermeiden Sie es:</strong> {trap.avoid}
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
                  <span><strong>VOB Teile A, B &amp; C:</strong> Vergabe bei öffentlichen Aufträgen; VOB/B gilt nur bei Vereinbarung.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-shiraz font-mono font-bold">•</span>
                  <span><strong>BGB Werkvertragsrecht:</strong> Gesetzliche Auffangordnung bei Mängeln und Kündigungen.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-shiraz font-mono font-bold">•</span>
                  <span><strong>DIN EN 206 &amp; DIN 1045-2/-3:</strong> Festlegung, Herstellung und Ausführung von Beton.</span>
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

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      {activeTab === 'planung' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Nennmaß der Betondeckung für ein Außenbauteil"
        zielGleichung="c_{nom} = c_{min} + \Delta c_{dev},\quad c_{min} = \max(c_{min,b};\ c_{min,dur};\ 10\,\text{mm})"
        schritte={[
          { titel: 'Dauerhaftigkeit', erklaerung: 'Außenwand, Expositionsklasse XC4, nach DIN EN 1992-1-1/NA:', formel: 'c_{min,dur} = 25\\,\\text{mm}' },
          { titel: 'Verbund', erklaerung: 'Stabdurchmesser 12 mm:', formel: 'c_{min} = \\max(12;\\ 25;\\ 10) = 25\\,\\text{mm}' },
          { titel: 'Vorhaltemaß', erklaerung: 'In Deutschland in der Regel 15 mm:', formel: 'c_{nom} = 25 + 15 = 40\\,\\text{mm}' }
        ]}
        ergebnisHinweis="c_nom gehört in Ausschreibung und Bewehrungsplan; die Abstandhalter werden nach c_nom bestellt. Bei XD- oder XS-Klassen und Brandschutzanforderungen kann ein größerer Wert maßgebend werden."
        normQuelle="DIN EN 1992-1-1 mit NA, Abschnitt 4.4"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Gleichwertigkeit eines Dämmstoffs im LV prüfen"
        zielGleichung="R = \frac{d}{\lambda},\quad d_{erf} = R_{soll} \cdot \lambda_{alt}"
        schritte={[
          { titel: 'Leitprodukt', erklaerung: 'Ausgeschrieben: 160 mm Dämmung mit λ = 0,035 W/(mK):', formel: 'R_{soll} = \\frac{0{,}160}{0{,}035} = 4{,}57\\,\\text{m}^2\\text{K/W}' },
          { titel: 'Alternativangebot', erklaerung: 'Angeboten wird ein Produkt mit λ = 0,040 W/(mK):', formel: 'd_{erf} = 4{,}57 \\cdot 0{,}040 = 0{,}183\\,\\text{m}' },
          { titel: 'Bewertung', erklaerung: 'Gleichwertig nur mit rund 18 cm Dicke – Folgen für Anschlüsse und Fensterlaibung prüfen:', formel: 'd_{erf} \\approx 18\\,\\text{cm} > 16\\,\\text{cm}' }
        ]}
        ergebnisHinweis="Gleichwertigkeit wird an den im LV festgelegten Leistungsmerkmalen gemessen (hier Wärmedurchlasswiderstand mit Bemessungswert λ), nicht am Produktnamen."
        normQuelle="§ 7 Abs. 2 VOB/A; DIN 4108-4"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="px_planung" />
        </>
      )}
      {activeTab === 'bauleitung' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Wirkung unzulässiger Wasserzugabe am Fahrmischer"
        zielGleichung="(w/z)_{neu} = \frac{w + \Delta w}{z}"
        schritte={[
          { titel: 'Soll-Rezeptur', erklaerung: 'z = 300 kg/m³, w = 165 kg/m³:', formel: 'w/z = \\frac{165}{300} = 0{,}55' },
          { titel: 'Zugabe', erklaerung: 'Der Fahrer gibt 10 l Wasser je m³ zu:', formel: '(w/z)_{neu} = \\frac{175}{300} = 0{,}58' },
          { titel: 'Bewertung', erklaerung: 'Für XC4 gilt nach DIN 1045-2:2008 ein Höchstwert von 0,60; die Reserve ist fast aufgebraucht:', formel: '0{,}58 \\to 0{,}60' }
        ]}
        ergebnisHinweis="Schon kleine Wassermengen verbrauchen die Rezepturreserve und mindern Festigkeit und Dauerhaftigkeit. Konsistenz nur mit Fließmittel nach Vorgabe des Lieferwerks anpassen und dokumentieren."
        normQuelle="DIN EN 206; DIN 1045-2"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Grundwert der Verankerungslänge bei der Bewehrungsabnahme"
        zielGleichung="l_{b,rqd} = \frac{\varnothing}{4} \cdot \frac{\sigma_{sd}}{f_{bd}}"
        schritte={[
          { titel: 'Verbundspannung', erklaerung: 'C25/30, guter Verbund: f_ctd = 1,8/1,5 = 1,2 N/mm²:', formel: 'f_{bd} = 2{,}25 \\cdot 1{,}0 \\cdot 1{,}0 \\cdot 1{,}2 = 2{,}7\\,\\text{N/mm}^2' },
          { titel: 'Grundwert', erklaerung: 'Ø 12 mm, volle Ausnutzung σ_sd = 435 N/mm²:', formel: 'l_{b,rqd} = \\frac{12}{4} \\cdot \\frac{435}{2{,}7} = 483\\,\\text{mm}' },
          { titel: 'Übergreifung', erklaerung: 'Stoßanteil über 50 %, α_6 = 1,5 (übrige Beiwerte 1,0):', formel: 'l_0 = 1{,}5 \\cdot 483 = 725\\,\\text{mm}' }
        ]}
        ergebnisHinweis="Bei der Abnahme wird die im Bewehrungsplan angegebene Länge kontrolliert; die Handrechnung dient zur Plausibilisierung. Mäßiger Verbund (obere Lage dicker Decken) erhöht den Wert deutlich."
        normQuelle="DIN EN 1992-1-1 mit NA, Abschnitte 8.4 und 8.7"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="px_bauleitung" />
        </>
      )}
      {activeTab === 'produktion' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Feuchtekorrektur bei der Sanddosierung"
        zielGleichung="m_{feucht} = m_{tr}(1 + u),\quad w_{Zugabe} = w_{soll} - u \cdot m_{tr}"
        schritte={[
          { titel: 'Feuchte Einwaage', erklaerung: 'Sollmenge trocken 1 000 kg, Oberflächenfeuchte u = 4 %:', formel: 'm_{feucht} = 1\\,000 \\cdot 1{,}04 = 1\\,040\\,\\text{kg}' },
          { titel: 'Wasser', erklaerung: 'Sollwasser 165 kg; mit dem Sand kommen 40 kg Wasser:', formel: 'w_{Zugabe} = 165 - 40 = 125\\,\\text{kg}' },
          { titel: 'Fehler ohne Korrektur', erklaerung: 'Würde die Feuchte ignoriert, stiege der w/z-Wert bei z = 300 kg:', formel: '\\frac{165 + 40}{300} = 0{,}68 \\text{ statt } 0{,}55' }
        ]}
        ergebnisHinweis="Die Oberflächenfeuchte muss auf die Trockenmasse bezogen und von der Kernfeuchte (Wasseraufnahme) unterschieden werden. Feuchtesonden regelmäßig mit Darrproben kalibrieren."
        normQuelle="DIN EN 206; DIN EN 1097-5"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Konformitätsnachweis der Druckfestigkeit bei Erstherstellung"
        zielGleichung="f_{cm} \ge f_{ck} + 4,\quad f_{ci} \ge f_{ck} - 4"
        schritte={[
          { titel: 'Ergebnisse', erklaerung: 'C30/37, drei Würfel nach 28 Tagen in N/mm²:', formel: 'f_{c1} = 41,\\ f_{c2} = 39,\\ f_{c3} = 43' },
          { titel: 'Kriterium 1', erklaerung: 'Mittelwert:', formel: 'f_{cm} = 41{,}0 \\ge 37 + 4 = 41\\ \\checkmark' },
          { titel: 'Kriterium 2', erklaerung: 'Kleinster Einzelwert:', formel: 'f_{ci,min} = 39 \\ge 37 - 4 = 33\\ \\checkmark' }
        ]}
        ergebnisHinweis="Beide Kriterien sind erfüllt, Kriterium 1 aber ohne Reserve. Bei stetiger Herstellung (n ≥ 15) gilt stattdessen f_cm ≥ f_ck + 1,48 σ."
        normQuelle="DIN EN 206, Konformitätskriterien für die Druckfestigkeit"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="px_produktion" />
        </>
      )}
      {activeTab === 'karriere' && (
        <>
      <FormulaDerivationBox
        title="Beispiel 1: Angebotspreis aus Herstellkosten"
        zielGleichung="K_{Angebot} = (S_{Herstell} + AGK) \cdot (1 + W_G)"
        schritte={[
          { titel: 'Herstellkosten', erklaerung: 'Einzelkosten der Teilleistungen und Baustellengemeinkosten:', formel: 'S_{Herstell} = 100\\,000\\ \\text{€}' },
          { titel: 'Allgemeine Geschäftskosten', erklaerung: 'Zuschlag 9 %:', formel: 'AGK = 0{,}09 \\cdot 100\\,000 = 9\\,000\\ \\text{€}' },
          { titel: 'Wagnis und Gewinn', erklaerung: 'Zuschlag 5 %:', formel: 'K = 109\\,000 \\cdot 1{,}05 = 114\\,450\\ \\text{€}' }
        ]}
        ergebnisHinweis="Zuschlagssätze sind unternehmensspezifisch und hier Lehrwerte. Wer Nachträge beurteilt, muss die Urkalkulation lesen können."
        normQuelle="Baubetriebliche Kalkulation (KLR Bau)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Lohnkosten einer Mauerwerksleistung"
        zielGleichung="K_L = A \cdot AW \cdot ML"
        schritte={[
          { titel: 'Menge', erklaerung: '250 m² Mauerwerk:', formel: 'A = 250\\,\\text{m}^2' },
          { titel: 'Aufwandswert', erklaerung: '0,8 h/m² (Lehrwert):', formel: 't = 250 \\cdot 0{,}8 = 200\\,\\text{h}' },
          { titel: 'Mittellohn', erklaerung: '30 €/h (Lehrwert):', formel: 'K_L = 200 \\cdot 30 = 6\\,000\\ \\text{€}' }
        ]}
        ergebnisHinweis="Aufwandswerte und Mittellohn stammen aus eigenen Nachkalkulationen; der Vergleich von Soll- und Ist-Stunden im Bautagebuch zeigt früh, ob ein Los aus dem Ruder läuft."
        normQuelle="Baubetriebliche Kalkulation; Lehrbeispiel"
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="px_karriere" />
        </>
      )}

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 15 Praxiswissen: Normbezüge (DIN 1045-2/-3:2023-08, DIN EN 206, EN 12390-2, DIN 18014, HOAI 2021, VOB/B 2016), Bauvertragsrecht und Qualifikationen geprüft; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Leistungsbild HOAI', url: 'https://de.wikipedia.org/wiki/Honorarordnung_f%C3%BCr_Architekten_und_Ingenieure#Leistungsbild' },
          { title: 'VOB/B - Vergabe- und Vertragsordnung', url: 'https://de.wikipedia.org/wiki/Vergabe-_und_Vertragsordnung_f%C3%BCr_Bauleistungen' },
          { title: 'EU-Bauproduktenverordnung', url: 'https://de.wikipedia.org/wiki/Bauproduktenverordnung' },
          { title: 'Betonieren', url: 'https://de.wikipedia.org/wiki/Betonieren' }
        ]}
        literatur={[
          'Kochendörfer, B.; Liebchen, J. H.; Viering, M. G. (2018): Bau-Projekt-Management: Grundlagen und Vorgehensweisen (5. Auflage, Springer Vieweg)',
          'Wendehorst Baustoffkunde. Wiesbaden: Springer Vieweg (aktuelle Auflage)',
          'Schach, R.; Schubert, H. (2019): Baustelleneinrichtung: Handbuch für Planung und Ausführung (Springer Vieweg)',
          'Deutscher Beton- und Bautechnik-Verein E.V. (DBV): DBV-Sammelmappe Merkblätter und Leitfäden'
        ]}
        regelwerke={[
          { title: 'DIN 1045-3:2023-08 (Tragwerke aus Beton – Bauausführung)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+1045-3' },
          { title: 'DIN EN 206:2021-06 und DIN 1045-2:2023-08 (Beton – Festlegung, Eigenschaften, Herstellung)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+1045-2' },
          { title: 'DAfStb-Richtlinie Wasserundurchlässige Bauwerke aus Beton (WU-Richtlinie), 2017-12', url: 'https://www.dinmedia.de/de/technische-regel/dafstb-wasserundurchlaessige-bauwerke/283927896' },
          { title: 'VOB/B 2016 (Allgemeine Vertragsbedingungen für die Ausführung von Bauleistungen)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=VOB%2FB' },
          { title: 'DIN 18533 (Abdichtung von erdberührten Bauteilen)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+18533' }
        ]}
        formeln={[
          {
            formel: 't_{\\text{Entladen}} - t_{\\text{Wasserzugabe}} \\le 90\\,\\text{min}',
            erklaerung: 'Übliche Höchstdauer zwischen erster Wasserzugabe und Entladen bei Fahrmischerbeton; Abweichungen (z. B. mit Verzögerer) müssen vereinbart werden.',
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
