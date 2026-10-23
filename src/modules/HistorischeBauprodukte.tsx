import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import 'katex/dist/katex.min.css';
import { 
  Layers, 
  BookOpen, 
  Info, 
  Calendar,
  Search,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';

interface HistoricProduct {
  id: string;
  name: string;
  epochId: 'vorkrieg' | 'nachkrieg' | 'spaetmoderne' | 'moderne';
  epochLabel: string;
  years: string;
  composition: string;
  application: string;
  characteristics: string;
  riskClass: 'none' | 'low' | 'medium' | 'high';
  riskDetail?: string;
  actionDetail?: string;
}

const HISTORIC_PRODUCTS: HistoricProduct[] = [
  // --- VORKRIEGSZEIT & HISTORISCHER BESTAND (BIS 1945) ---
  {
    id: 'roman_cement',
    name: 'Römischer Zement (Roman Cement)',
    epochId: 'vorkrieg',
    epochLabel: 'Vorkriegszeit / Historisch',
    years: 'bis 1945',
    composition: 'Natürlicher tonhaltiger Mergelstein (Mergelkalk), gebrannt bei relativ niedrigen Temperaturen (~900 - 1100 °C) ohne Sinterung.',
    application: 'Zierelemente, Fassadenstuck, Ornamentguss, schnellhärtende Reparaturmörtel für Wasserbauten.',
    characteristics: 'Sehr schnelle Erstarrungszeit (oft < 15 Minuten), warme ockergelbe bis rotbraune Eigenfarbe, gute Witterungsbeständigkeit und moderate Festigkeiten.',
    riskClass: 'none'
  },
  {
    id: 'gusseisen',
    name: 'Gusseisen (Grauguss)',
    epochId: 'vorkrieg',
    epochLabel: 'Vorkriegszeit / Historisch',
    years: 'bis 1945',
    composition: 'Eisen-Kohlenstoff-Legierung mit hohem Kohlenstoffgehalt (> 2,0 % bis 4,0 %) und Siliziumanteilen, im flüssigen Zustand vergossen.',
    application: 'Historische Stützen, gusseiserne Gewölbe- und Hallenkonstruktionen (z.B. Bahnhofshallen, Fabriken), Brückenträger des 19. Jahrhunderts.',
    characteristics: 'Hohe Druckfestigkeit, aber sehr geringe Zugfestigkeit und hohe Sprödigkeit. Nicht schmiedbar, nicht schweißbar. Zeigt hervorragende Fließfähigkeit beim Guss.',
    riskClass: 'low',
    riskDetail: 'Gefahr des plötzlichen Sprödbruchs ohne Vorwarnung bei Überlastung oder ungleichmäßigen Zugspannungen.',
    actionDetail: 'Zugspannungszonen sind konstruktiv zu vermeiden. Sanierung durch Umhüllung mit zugfesten Werkstoffen oder Entlastungsträgern.'
  },
  {
    id: 'schweisseisen',
    name: 'Schweißeisen / Puddelstahl',
    epochId: 'vorkrieg',
    epochLabel: 'Vorkriegszeit / Historisch',
    years: 'bis 1945',
    composition: 'Eisen mit extrem niedrigem Kohlenstoffgehalt (< 0,1 %), mechanisch eingewalzten Schlackefasern durch wiederholtes Falten und Schmieden.',
    application: 'Decken-I-Träger (preußische Kappen), Schienen, genietete Fachwerkträger, historische Brücken und Türme (z. B. Eiffelturm, 1889), Maueranker.',
    characteristics: 'Hervorragend schmiedbar und feuerschweißbar, jedoch nicht thermisch härtbar. Zeigt ein ausgeprägt anisotropes Fasergefüge (ähnlich Holz) und guten natürlichen Korrosionswiderstand.',
    riskClass: 'low',
    riskDetail: 'Schichtung des Fasergefüges kann bei eindringender Feuchtigkeit zu Delamination (Blätterrost) führen. Schlecht schweißbar mit modernen Schmelzschweißverfahren.',
    actionDetail: 'Korrosionsschutz intakt halten. Konstruktive Verbindungen im Sanierungsfall bevorzugt nieten, schrauben oder mit Spezialverfahren schweißen.'
  },
  {
    id: 'flussstahl_historisch',
    name: 'Historischer Flussstahl (SM-Stahl / Thomas-Stahl alt)',
    epochId: 'vorkrieg',
    epochLabel: 'Vorkriegszeit / Historisch',
    years: 'bis 1945',
    composition: 'Im Siemens-Martin-Verfahren (SM) oder Bessemer-Verfahren hergestellter kohlenstoffarmer Baustahl (Kohlenstoffgehalt < 0,22 %).',
    application: 'Walzprofile (I-Träger, U-Träger), genietete Blechträger, historische Stützen, Gitterträger, Brückenbauten.',
    characteristics: 'Zähes Materialverhalten im Vergleich zu Gusseisen. Gut schmiedbar und warm verformbar, mechanische Kennwerte (Streckgrenze ca. 220-240 N/mm²) ähnlich modernem S235 Baustahl.',
    riskClass: 'low',
    riskDetail: 'Je nach Herstellungsverfahren (insb. unberuhigt vergossener Stahl) können erhebliche Seigerungszonen mit Kernanreicherungen von Schwefel und Phosphor vorliegen. Erhöhte Korrosionsneigung in diesen Zonen.',
    actionDetail: 'Vor Sanierungs- oder Schweißarbeiten Span- oder Materialproben für die chemische Analyse (Kohlenstoffäquivalent, P, N, S) entnehmen. Im Zweifelsfall mechanische Schraub- oder Klemmverbindungen vorziehen.'
  },
  {
    id: 'reichsformat_ziegel',
    name: 'Mauerziegel im Reichsformat',
    epochId: 'vorkrieg',
    epochLabel: 'Vorkriegszeit / Historisch',
    years: 'bis 1945',
    composition: 'Gebrannter Ton oder Lehm ohne künstliche Porenbildner, genormt auf das Reichsformat (25,0 cm x 12,0 cm x 6,5 cm).',
    application: 'Tragendes Mauerwerk, Außenwände, Gewölbebauten, Kellerwände, historische Schornsteine.',
    characteristics: 'Hohe Rohdichte (ca. 1,8 - 2,0 kg/dm³), hohe Druckfestigkeiten (oft 10 bis über 20 N/mm²), kapillaraktiv und hochgradig diffusionsoffen.',
    riskClass: 'none',
    riskDetail: 'Keine chemischen Schadstoffe. Gefahr von Frostschäden bei ungenügendem Brenngrad (Weichbrandziegel im Außenbereich) oder durch bauwerksschädigende Salze (Nitrate, Sulfate) bei aufsteigender Feuchte.',
    actionDetail: 'Feuchtigkeits- und Salzgehalt analysieren. Fehlstellen substanzschonend mit restauratorischen Kalkmörteln ausbessern. Niemals starre, absperrende Zementputze im Denkmalschutz auftragen.'
  },
  {
    id: 'holzzement_dach',
    name: 'Holzzement-Deckung (Frühes Flachdach)',
    epochId: 'vorkrieg',
    epochLabel: 'Vorkriegszeit / Historisch',
    years: 'bis 1945',
    composition: 'Mehrlagige Pappen- und Papierabdichtung, verklebt mit Steinkohlenteer oder Holzteer, abgedeckt mit einer verdichteten Schüttung aus Kies, Sand und Kalkmörtel.',
    application: 'Flachdächer von historischen Fabriken, Industriegebäuden, Villen und frühen Wohnblocks.',
    characteristics: 'Sehr zähes, alterungsbeständiges Abdichtungssystem. Der Teer diente als Hydrophobierungsmittel, die Kiesschüttung schützte vor Funkenflug und UV-Strahlung.',
    riskClass: 'high',
    riskDetail: 'Enthält extrem hohe Konzentrationen an krebserregenden Polyzyklischen Aromatischen Kohlenwasserstoffen (PAK) durch den verwendeten Steinkohlenteer.',
    actionDetail: 'Rückbau und Abbruch dürfen nur unter strengem Atemschutz und Vollschutz nach DGUV Regel 101-004 (ehemals BGR 128) erfolgen. Teerhaltiges Material muss als gefährlicher Abfall thermisch entsorgt werden.'
  },
  {
    id: 'kork_daemm_bitumen',
    name: 'Bituminierte/Teerimprägnierte Korkplatten',
    epochId: 'vorkrieg',
    epochLabel: 'Vorkriegszeit / Historisch',
    years: 'bis 1945',
    composition: 'Natürliches Korkschrot, gepresst und unter Verwendung von Steinkohlenteerpech, Bitumen oder Naturharzen als Heißkleber gebunden.',
    application: 'Wärmedämmung für Kühlhäuser, Deckenisolierung in Brauereien, frühe Flachdachdämmungen, Trittschallschutz.',
    characteristics: 'Dunkelbraune bis pechschwarze Platten, hervorragende Dämmwirkung, extrem verrottungsfest und wasserabweisend durch die Teer- oder Bitumenimprägnierung.',
    riskClass: 'medium',
    riskDetail: 'Bei teergebundenen Korkplatten extrem hohe Belastung mit krebserregenden PAK. Schadstoffe können in die Raumluft ausgasen oder bei Feuchteeintrag ins Grundwasser ausgewaschen werden.',
    actionDetail: 'Probenahme zur Unterscheidung zwischen unbedenklichem Bitumen und teerhaltigem Pech durchführen. Teerhaltige Platten staubfrei zurückbauen (Vollschutz) und fachgerecht entsorgen.'
  },
  {
    id: 'bleirohre_sanitaer',
    name: 'Blei-Trinkwasserleitungen',
    epochId: 'vorkrieg',
    epochLabel: 'Vorkriegszeit / Historisch',
    years: 'bis 1973',
    composition: 'Weiches, duktiles Blei-Metall, meist nahtlos gezogen, teils mit Lötnähten.',
    application: 'Trinkwasser-Steigleitungen, Hausanschlussleitungen und Etagenverteilungen in Wohngebäuden vor 1973.',
    characteristics: 'Hervorragende mechanische Verformbarkeit (leicht biegbar), extrem korrosionsbeständig und langlebig durch die Bildung einer unlöslichen Bleicarbonat-Schutzschicht im Rohrinneren.',
    riskClass: 'high',
    riskDetail: 'Auswaschung von toxischem Blei in das Trinkwasser (insb. bei saurem/weichem Wasser, nach langen Standzeiten oder bei Beschädigung der Schutzschicht). Führt zu chronischer Bleivergiftung (Saturnismus) mit schwerwiegenden Schäden des Zentralnervensystems, der Nieren und der Blutbildung.',
    actionDetail: 'Trinkwasseranalyse veranlassen. Nach § 17 TrinkwV (2023) mussten Bleileitungen bis 12.01.2026 entfernt oder stillgelegt werden (Fristverlängerung auf Antrag nur in Ausnahmefällen; bei Eigentümerwechsel Frist von einem Jahr nach Übergang). Grenzwert Blei 0,010 mg/l, ab 12.01.2028 0,005 mg/l. Austausch gegen Kupfer, Edelstahl oder zugelassene Kunststoff-/Verbundrohre.'
  },
  {
    id: 'kupferschlackesteine_pflaster',
    name: 'Kupferschlacke-Pflastersteine (Mansfelder Platten)',
    epochId: 'vorkrieg',
    epochLabel: 'Vorkriegszeit / Historisch',
    years: 'bis 1945',
    composition: 'Silikatisches Schmelzprodukt (Kupferschlacke) aus der pyrometallurgischen Kupfergewinnung, im flüssigen Zustand in Formen gegossen.',
    application: 'Pflasterung von Straßen, Rinnsteinen, Einfahrten, Hofbepflasterungen und Gehwegrändern.',
    characteristics: 'Pechschwarz bis dunkelblau glänzend, extrem hohe Druck- und Abriebfestigkeit, absolut witterungs- und frostbeständig. Besitzt jedoch bei Nässe oder Frost eine extrem geringe Griffigkeit und hohe Rutschgefahr.',
    riskClass: 'low',
    riskDetail: 'Enthält herstellungsbedingt erhebliche Gehalte an Schwermetallen (Blei, Kupfer, Zink, Arsen) in glasig-silikatisch gebundener Form sowie eine geringe radioaktive Eigenstrahlung (Uran- und Thoriumspuren). Keine akute Freisetzung bei intaktem Pflastergefüge.',
    actionDetail: 'Mechanische Bearbeitung (Sägen, Schleifen) nur unter Wasserzufuhr oder mit H-Klasse-Staubabsaugung und FFP3-Atemschutz durchführen, um Einatmung schwermetallhaltiger Stäube zu verhindern. Bei Abbruch getrennt erfassen und verwerten.'
  },
  {
    id: 'luftkalk',
    name: 'Historischer Luftkalkmörtel',
    epochId: 'vorkrieg',
    epochLabel: 'Vorkriegszeit / Historisch',
    years: 'bis 1945',
    composition: 'Calciumhydroxid (gelöschter Baukalk) gemischt mit quarzitischen Sanden, ohne hydraulische Zuschläge.',
    application: 'Mauermörtel und Putze an Altbauten, Denkmälern und historischen Kirchen.',
    characteristics: 'Sehr elastisch, niedriger E-Modul, hohe Wasserdampfdiffusionsfähigkeit. Erhärtet extrem langsam ausschließlich über die Carbonatisierung (CO₂-Aufnahme).',
    riskClass: 'none'
  },
  {
    id: 'rabitz',
    name: 'Rabitz-System (Drahtputz)',
    epochId: 'vorkrieg',
    epochLabel: 'Vorkriegszeit / Historisch',
    years: 'bis 1945',
    composition: 'Trägergewebe aus (verzinktem) Eisendraht (Rabitzgewebe), in das Gips-, Kalk- oder Kalkzementmörtel direkt eingedrückt wird. Schilfmatten als Putzträger gehören dagegen zum Schilfrohrputz (eigenes System).',
    application: 'Abgehängte Decken, feuerhemmende Trägerverkleidungen, geschwungene Gewölbe-Imitationen.',
    characteristics: 'Ermöglichte den Übergang zu leichten, fugenlosen Unterdeckenkonstruktionen.',
    riskClass: 'low',
    riskDetail: 'Substanzrisiko durch fortschreitende Drahtkorrosion bei erhöhter Feuchte. Führt im schlimmsten Fall zum plötzlichen, flächigen Herabstürzen schwerer Deckenputzteile.',
    actionDetail: 'Tragfähigkeit und Rostbefall der Aufhängekonstruktionen mittels Endoskopie prüfen. Ggf. Entlastungsanker setzen oder kontrollierter Rückbau.'
  },
  {
    id: 'linoleum_alt',
    name: 'Klassisches Linoleum (Korklinoleum)',
    epochId: 'vorkrieg',
    epochLabel: 'Vorkriegszeit / Historisch',
    years: 'bis 1945',
    composition: 'Oxidiertes Leinöl (Linoxyn), Naturharze (Kolophonium, Kauri-Harz), Kork- und Holzmehl als Füllstoffe, aufgewalzt auf ein stabiles Trägergewebe aus Jute.',
    application: 'Flächiger Bodenbelag in historischen Schulen, Krankenhäusern, Verwaltungsbauten und Wohngebäuden.',
    characteristics: 'Fußwarm, elastisch, schallmindernd, schwer entflammbar und von Natur aus antibakteriell. Besitzt einen typischen Leinölgeruch.',
    riskClass: 'none',
    riskDetail: 'Keine chemischen Schadstoffe. Jedoch empfindlich gegen stehende Feuchtigkeit und stark alkalische Reinigungsmittel, die das Bindemittel zersetzen.',
    actionDetail: 'Nur feucht wischen, nicht nass stehen lassen. Alkalische Reiniger (pH > 9) strikt vermeiden; stattdessen pH-neutrale Pflegemittel verwenden.'
  },

  // --- NACHKRIEGSZEIT & WIEDERAUFBAU (1945-1969) ---
  {
    id: 'isteg_stahl',
    name: 'Isteg-Stahl (Zweistab-Betonstahl)',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1945 - 1960',
    composition: 'Zwei kalt miteinander verdrillte Rundstähle aus weichem Kohlenstoffstahl ohne Querrippen.',
    application: 'Bewehrungsstahl für Deckenplatten, Balkontragwerke und Brückenelemente der frühen Nachkriegsjahre.',
    characteristics: 'Durch die Kaltverdrillung (Reckgradverfestigung) wird die Streckgrenze auf ca. 300 - 340 N/mm² gesteigert. Die Verbundwirkung erfolgt rein mechanisch durch die schraubenförmige Geometrie.',
    riskClass: 'medium',
    riskDetail: 'Aufgrund der glatten Staboberfläche ohne Querrippen ist der Gleitwiderstand im Beton geringer. Bei fortgeschrittener Karbonatisierung des Betons bricht der Verbund rasant zusammen, was zu plötzlichem Tragversagen führt.',
    actionDetail: 'Bei statischen Nachrechnungen im Bestand sind reduzierte Grenzwerte der Verbundspannung anzusetzen. Feuchteeintrag und Rissbreiten an tragenden Bauteilen streng überwachen.'
  },
  {
    id: 'torstahl_gerippt',
    name: 'Torstahl (Kaltgerippter Torsionsstahl)',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1950 - 1980',
    composition: 'Warmgewalzter Betonstahl mit schrägen Längs- und Querrippen, der im kalten Zustand axial verdreht (verwunden) wurde.',
    application: 'Standard-Bewehrung für schlaff bewehrte Tragwerke aller Art im Hoch-, Tief- und Industriebau.',
    characteristics: 'Erreicht hohe Streckgrenzen von 400 N/mm² (Torstahl 40) bis 500 N/mm² (Torstahl 50). Sehr guter mechanischer Verbund mit dem Beton. Weist jedoch eine geringere Bruchdehnung auf als moderner Betonstahl.',
    riskClass: 'low',
    riskDetail: 'Die Kaltverfestigung geht bei starker Erwärmung (z.B. über 400 °C beim Schweißen oder Brand) verloren. Es tritt eine sofortige Gefügeerweichung und ein eklatanter Festigkeitsverlust auf.',
    actionDetail: 'Schweißarbeiten an historischem Torstahl sind im Sanierungsfall grundsätzlich verboten oder erfordern Sondergutachten. Verstärkungen bevorzugt mechanisch (Klemmen/Dübeln) oder über CFK-Lamellen ausführen.'
  },
  {
    id: 'thomas_stahl',
    name: 'Thomas-Stahl (Windgefrischter Profilstahl)',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1945 - 1970',
    composition: 'Im Thomas-Konverter durch Einblasen von Luft gefrischter Baustahl. Weist einen verfahrensbedingt hohen Stickstoff- (N > 0,008 %) und Phosphorgehalt (P > 0,05 %) auf.',
    application: 'Stahlprofile (I-Träger, U-Träger, Winkelprofile) in Hallenkonstruktionen, Brücken, historischen Fachwerkbauten und Deckenabfangungen.',
    characteristics: 'Gute statische Tragfähigkeit im ungestörten Zustand (Streckgrenze ca. 220-245 N/mm²), jedoch sprödanfällig unter dynamischer Last.',
    riskClass: 'medium',
    riskDetail: 'Extreme Anfälligkeit für Alterungsversprödung über die Jahrzehnte. Hoher Stickstoff- und Phosphorgehalt sowie Seigerungen führen zu Alterungsversprödung und eingeschränkter Schweißeignung.',
    actionDetail: 'Das Schweißen von Thomas-Stahl ist für tragende Anschlüsse unzulässig. Nachträgliche Ertüchtigungen müssen zwingend über Schraub- oder Nietverbindungen erfolgen. Vermeidung von Stoß- und Schlagbelastung.'
  },
  {
    id: 'truemmerbeton',
    name: 'Trümmerbeton / Klinkerbeton',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1945 - 1969',
    composition: 'Zementleim mit Zuschlägen aus gebrochenem Ziegelschutt, Trümmersplitt und Mörtelresten aus kriegszerstörten Gebäuden.',
    application: 'In-situ gegossene Wände, Hohlblocksteine, Fundamente und Deckenkonstruktionen der frühen Nachkriegsjahre.',
    characteristics: 'Hohe Porosität, stark schwankende Rohdichte und Festigkeitseigenschaften. Oft hohes kapillares Saugen und mäßiger Frostwiderstand.',
    riskClass: 'medium',
    riskDetail: 'Erhöhte Gefahr von sulfatinduziertem Treiben (Gips-Treiben) durch Gipsputzreste im Trümmersplitt. Schlechter Carbonatisierungsschutz für Bewehrungsstähle.',
    actionDetail: 'Bauteilfeuchtigkeit minimieren. Korrosionsschutz der Bewehrung prüfen (Bewehrungsüberdeckung ist oft mangelhaft) und ggf. instandsetzen.'
  },
  {
    id: 'huettenstein',
    name: 'Hüttensteine & Schlackenbetonblock',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1945 - 1969',
    composition: 'Granulierte Hochofenschlacke (Hüttensand) und Flugasche, gebunden mit Zement oder Kalkhydrat, zu Voll- oder Hohlblocksteinen gepresst.',
    application: 'Mauerwerk für tragende und nichttragende Innen- und Außenwände, insbesondere in Bergbau- und Industrieregionen.',
    characteristics: 'Gute Wärmedämmung und Schalldämmung, geringes Gewicht. Neigt jedoch zu nennenswertem Feuchtigkeits- und Schwindverhalten.',
    riskClass: 'none'
  },
  {
    id: 'schwemmstein',
    name: 'Bimsbeton-Schwemmsteine',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1945 - 1969',
    composition: 'Natürlicher poröser Vulkankies (Bims) gebunden mit geringen Anteilen an Portlandzement oder Luftkalk, kaltgepresst.',
    application: 'Ausfachung von Fachwerkbauten, wärmedämmende zweischalige Außenwände, leichte Innenwände.',
    characteristics: 'Sehr geringe Rohdichte (0,6 - 0,9 kg/dm³), sehr gute natürliche Wärmedämmung, sehr hohe kapillare Saugfähigkeit bei geringer Druckfestigkeit.',
    riskClass: 'none'
  },
  {
    id: 'eternit_asbest',
    name: 'Asbestzement / Eternit-Dachplatten',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1945 - 1969',
    composition: 'Portlandzement mit ca. 10 - 15 % mineralischen Asbestfasern (Chrysotil, vereinzelt Krokydolith) zur zug- und biegefesten Armierung.',
    application: 'Weit verbreitete Dacheindeckungen (Wellasbest), hinterlüftete Außenwandbekleidungen, Fensterbänke.',
    characteristics: 'Extrem witterungsbeständig, frostfest, unbrennbar, säureresistent und mechanisch hoch belastbar bei gleichzeitig sehr geringem Materialgewicht.',
    riskClass: 'high',
    riskDetail: 'Freisetzung lungengängiger, stark karzinogener Asbestfasern bei mechanischer Einwirkung (Bohren, Sägen, Brechen, Schleifen) oder durch natürliche Erosion gealterter Oberflächen.',
    actionDetail: 'Abbruch- und Instandhaltungsarbeiten unterliegen strengen behördlichen Schutzbestimmungen nach TRGS 519. Verbot von Hochdruckreinigern oder trockenem Schleifen.'
  },
  {
    id: 'asbest_rohre',
    name: 'Asbestzement-Rohre (Druck- & Abwasserleitung)',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1945 - 1969',
    composition: 'Faserzementmatrix mit ca. 12 - 15 % fest eingebundenem Asbest (Chrysotil und Krokydolith) als mechanische Armierung.',
    application: 'Kanalisationsrohre, Entwässerungsleitungen, Trinkwasserdruckrohrleitungen, Lüftungskanäle und Kaminzüge.',
    characteristics: 'Extrem glatte Innenflächen, hervorragende hydraulische Strömungsleitung, korrosionsbeständig gegen saure Böden und aggressive Abwässer, sprödes Bruchverhalten bei Erdbewegungen.',
    riskClass: 'high',
    riskDetail: 'Sehr hohes Freisetzungspotenzial von krebserregenden Fasern bei Trennarbeiten oder mechanischem Abtrag. Bei Trinkwasserleitungen besteht zudem das Risiko des Materialabtrags bei kalkaggressivem Wasser.',
    actionDetail: 'Rückbau im Erdreich nur durch Fachfirmen unter Beachtung der TRGS 519. Rohre sollten idealerweise zerstörungsfrei freigelegt und im Ganzen entnommen werden. Mechanische Bearbeitung im Bestand verboten.'
  },
  {
    id: 'glasbausteine',
    name: 'Glasbausteine (Dickglas-Hohlkörper)',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1945 - 1969',
    composition: 'Zwei zusammengeschmolzene Halbschalen aus dickem Pressglas mit evakuiertem Innenraum (Teilvakuum).',
    application: 'Lichtbänder in Treppenhäusern, Fluren, Industriebauten und Badezimmern.',
    characteristics: 'Lichtdurchlässig, aber blickdicht. Bietet mäßigen Schallschutz, jedoch extrem schlechte U-Werte (hohe Wärmeverluste).',
    riskClass: 'none',
    riskDetail: 'Keine Materialschadstoffe. Aus energetischer Sicht jedoch massive Wärmebrücke, führt zu Kondensatbildung am Randverbund und Schimmelgefahr in angrenzenden Bauteilen.',
    actionDetail: 'Bei energetischen Sanierungen durch hochdämmende Glaskonstruktionen oder moderne Pfosten-Riegel-Fassaden ersetzen.'
  },
  {
    id: 'plexiglas_pmma_alt',
    name: 'Frühes Plexiglas / PMMA (Acrylglas)',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1945 - 1969',
    composition: 'Polymethylmethacrylat (PMMA), ein synthetischer, transparenter thermoplastischer Kunststoff.',
    application: 'Lichtkuppeln auf Flachdächern, Industrieverglasungen, gewölbte Vordächer, Gewächshäuser.',
    characteristics: 'Sehr hohe Lichttransmission (> 92 %), halbes Gewicht von Glas. Frühe Generationen neigen unter UV-Strahlung und Witterungseinflüssen zu starker Vergilbung, Trübung und mikroskopischer Rissbildung (Crazing). Besitzt eine hohe thermische Längendehnung (α ≈ 70 · 10⁻⁶ K⁻¹, ca. 3-mal höher als Aluminium).',
    riskClass: 'low',
    riskDetail: 'Starke Versprödung führt zu Hagelempfindlichkeit und Verlust der Durchsturzsicherheit auf Dächern. Hohe Dehnungsspannungen können zu Rissen an Befestigungspunkten führen.',
    actionDetail: 'Regelmäßige Prüfung auf Trübungen und Risse. Bei Begehung von Flachdächern sind alte Lichtkuppeln aus PMMA als nicht durchsturzsicher einzustufen und abzusichern.'
  },
  {
    id: 'alu_profile_alt',
    name: 'Aluminium-Strangpressprofile (ungedämmt)',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1945 - 1969',
    composition: 'Aluminium-Magnesium-Silizium-Legierungen (AlMgSi), durch Strangpressen geformt, teilweise eloxiert (Anodisation).',
    application: 'Schaufensteranlagen, Fensterrahmen, Vorhangfassaden (Curtain Walls), Verkleidungsprofile.',
    characteristics: 'Sehr leicht, witterungsbeständig durch die natürliche oder künstlich verstärkte Oxidschicht. Besitzt jedoch keinerlei thermische Trennung (Vollaluminium-Profile).',
    riskClass: 'low',
    riskDetail: 'Extreme Kältebrücke führt zu starkem Tauwasserausfall an der Innenseite, was Korrosion an Anschlüssen und Schimmelbildung begünstigt. Aluminium korrodiert rasant (Lochfraß) bei direktem Kontakt mit feuchtem, alkalischem Zement- oder Kalkmörtel.',
    actionDetail: 'Aluminiumprofile konstruktiv von alkalischen Mörteln trennen (Dichtbänder). Bei energetischen Sanierungen ist ein vollständiger Austausch gegen thermisch getrennte Mehrkammer-Profile zwingend erforderlich.'
  },
  {
    id: 'gitterziegel_nachkrieg',
    name: 'Frühe Hochloch- & Gitterziegel',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1950 - 1975',
    composition: 'Stranggepresster Ton mit rasterförmig angeordneten Hochlöchern senkrecht zur Lagerfläche, ohne Luftporenbildner gebrannt.',
    application: 'Tragendes und nichttragendes Außenmauerwerk, Ausfachungen, Innenwände im Geschosswohnungsbau.',
    characteristics: 'Rohdichte ca. 1,0 - 1,4 kg/dm³. Verbesserter Wärmeschutz durch ruhende Luftsäulen im Ziegelinneren im Vergleich zu historischen Vollziegeln. Die Querzugfestigkeit ist konstruktionsbedingt stark reduziert.',
    riskClass: 'none',
    riskDetail: 'Keine Schadstoffe. Hohe Sprödigkeit führt zu starker Neigung zu Steinausbrüchen bei nachträglichen Installationen (Schlitzen/Fräsen) oder bei Schlag- und Bohrbelastung.',
    actionDetail: 'Nachträgliche Verankerungen im Mauerwerk dürfen keinesfalls schlagend gebohrt werden. Stattdessen sind Drehbohrer und Injektionsklebeanker mit Siebhülsen zu verwenden.'
  },
  {
    id: 'schiefer_kunst_asbest',
    name: 'Asbesthaltiger Kunstschiefer (Fassadenplatten)',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1950 - 1990',
    composition: 'Gepresster Portlandzement mit ca. 12 % Asbestfasern (vorwiegend Chrysotil) und schwarzem Eisenoxid-Farbpigment.',
    application: 'Schuppenbekleidungen an Giebeln, Fassadenverkleidungen im Einfamilienhausbau, Dacheindeckungen als Naturschiefer-Ersatz.',
    characteristics: 'Sehr geringe Plattendicke (ca. 4-6 mm) bei enormer Festigkeit, witterungsbeständig, elastisch und extrem langlebig. Optisch schwer von echtem Schiefer zu unterscheiden.',
    riskClass: 'high',
    riskDetail: 'Starkes Gefahrenpotential durch allmähliche Oberflächenverwitterung und Auswaschung der Zementmatrix. Mechanisches Bearbeiten (Sägen/Bohren) führt zu massiver Faserbelastung.',
    actionDetail: 'Oberflächenbearbeitung, Beschichtung oder Reinigung mittels Hochdruckreiniger ist behördlich verboten. Sanierung durch vollständigen, zerstörungsfreien Rückbau unter TRGS 519.'
  },
  {
    id: 'gipskarton_asbest_brandschutz',
    name: 'Asbesthaltige Brandschutz-Gipskartonplatten',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1960 - 1980',
    composition: 'Gipskern umhüllt von einer festen Kartonage. Gipskartonplatten selbst waren in der Regel asbestfrei; im Brandschutz wurden jedoch häufig schwach gebundene Asbest-Leichtbauplatten (z. B. Promabest, Neptunit; siehe Steckbrief Asbest-Leichtbauplatten) mit deutlich höheren Asbestgehalten eingesetzt, teils kombiniert mit Gipskarton. Materialprobe zwingend.',
    application: 'Ummantelung von Stahlstützen, Holzträgern, Deckenunterbeplankungen in Fluchtwegen, Brandschutzwände.',
    characteristics: 'Ermöglichte extrem leichte F30- und F90-Konstruktionen im Trockenbau, wies hohe Biegesteifigkeit auf.',
    riskClass: 'high',
    riskDetail: 'Asbestfasern liegen hier in einer schwach gebundenen Matrix vor. Jegliche Beschädigung, Bohrung oder Stoßeinwirkung setzt krebserregende Fasern in hoher Zahl direkt in den Innenraum frei.',
    actionDetail: 'Sanierung und Abbruch dürfen ausschließlich unter staubdichter Einhausung, Unterdruckhaltung und Vollschutz nach TRGS 519 durchgeführt werden. Platten im Ganzen ausbauen und staubdicht verpacken.'
  },
  {
    id: 'strohbauplatte_solomit',
    name: 'Strohbauplatten (Leichtbauplatten / Solomit)',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1945 - 1970',
    composition: 'Mechanisch stark gepresstes Roggen- oder Weizenstroh, mit verzinktem Eisendraht klammerartig geheftet, teils mit Gipsputz oder Lehmbeschichtung versehen.',
    application: 'Nichttragende leichte Trennwände, Putzträgerplatten an Decken, Dämmplatten im Dachausbau.',
    characteristics: 'Hervorragende Schalldämmeigenschaften und gute Wärmedämmung. Aufgrund der dichten Strohpressung überraschend schwer entflammbar (Sauerstoffmangel im Bauteilkern). Extrem feuchtigkeitsempfindlich.',
    riskClass: 'low',
    riskDetail: 'Bei Feuchtigkeitsbelastung drohen rapide Schimmelpilzbildung, Fäulnis und starker Schädlingsbefall. Beim Rückbau entsteht eine extreme Staubbelastung durch Stroh- und Gipsfeinstaub.',
    actionDetail: 'Bauteile absolut trocken halten. Bei feuchten Wänden ist ein vollständiger, großzügiger Rückbau zwingend erforderlich. Beim Abbruch Atemschutzmaske (mindestens FFP3) tragen.'
  },
  {
    id: 'kmf_alt',
    name: 'Künstliche Mineralfasern - Alt (Alte Mineralwolle)',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: 'vor 1996 hergestellt (Einbau bis 06/2000 möglich)',
    composition: 'Synthetisch hergestellte glasige Silikatfasern (Glas- oder Steinwolle) mit hohem Gehalt an Natrium-, Kalium- und Erdalkalioxiden, Phenol-Formaldehydharz als Bindemittel.',
    application: 'Zwischensparrendämmung im Dach, Trittschallplatten unter Estrich, Isolierung von Rohrleitungen und Heizungsrohren, Akustikdecken.',
    characteristics: 'Gelbe, grüne oder bräunliche weiche Dämmmatten, hochelastisch, unbrennbar, sehr guter Wärmeschutz.',
    riskClass: 'high',
    riskDetail: 'Die Fasern weisen eine kritische Geometrie auf (Länge > 5 µm, Durchmesser < 3 µm) und sind im Lungengewebe extrem biobeständig. In Deutschland nach TRGS 905/521 als krebserzeugend eingestuft (Kanzerogenitätsindex KI < 40); die IARC stuft Glas- und Steinwolle seit 2001 in Gruppe 3 ein.',
    actionDetail: 'Sanierung und Rückbau unterliegen der TRGS 521. Fasern müssen vor Bewegung mit Staubbindemitteln benetzt werden. Entsorgung staubdicht verpackt in speziellen Mineralfaser-Bigbags. FFP3-Atemschutz und Einwegschutzanzug tragen.'
  },
  {
    id: 'vinyl_asbest_flexplatten',
    name: 'Vinyl-Asbest-Fliesen & Cushion-Vinyl',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1955 - 1985',
    composition: 'Polyvinylchlorid (PVC) homogen gefüllt mit bis zu 15 % Chrysotil-Asbestfasern und Weichmachern. Teils mit unterseitiger grauer, hoch asbesthaltiger Pappe als Träger (Cushion-Vinyl).',
    application: 'Fußbodenbeläge in stark beanspruchten Bereichen wie öffentlichen Fluren, Schulen, Küchen und Krankenhäusern.',
    characteristics: 'Extrem verschleißfest, zäh-elastisch, säurebeständig, wasserdicht, pflegeleicht. Flexplatten sind spröde und brechen bei Biegung mit glatten Kanten.',
    riskClass: 'high',
    riskDetail: 'Vinyl-Asbest-Fliesen sind fest gebunden (Asbest wird erst bei grober mechanischer Einwirkung wie Brechen, Fräsen oder Abschleifen frei). Cushion-Vinyl-Beläge haben jedoch eine schwach gebundene unterseitige Asbestpappe, die extrem leicht bei Bewegung oder Abziehen riesige Fasermengen freisetzt.',
    actionDetail: 'Kein unkontrolliertes Herausreißen, Abschaben oder Schleifen von Bodenbelägen dieser Epoche! Sanierung und Ausbau dürfen ausschließlich nach TRGS 519 (Asbestsanierung) im Unterdruckverfahren oder mittels anerkannten staubarmen Verfahren erfolgen.'
  },
  {
    id: 'teer_parkettkleber_schwarz',
    name: 'Teer- & Pech-Parkettkleber (Schwarzkleber)',
    epochId: 'nachkrieg',
    epochLabel: 'Nachkriegszeit & Wiederaufbau',
    years: '1945 - 1970',
    composition: 'Steinkohlenteerpech, oft vermischt mit Naturasphalt, Bitumen und mineralischen/organischen Füllstoffen (teilweise auch mit Asbestfasern zur Viskositätssteuerung).',
    application: 'Vollflächige Verklebung von Stabparkett, Mosaikparkett, Holzpflastern und frühen Estrichunterlagen.',
    characteristics: 'Pechschwarze bis dunkelbraune, zäh-plastische, geruchlose Klebstoffschicht direkt auf dem Zement- oder Gussasphalt-Unterbau. Extrem feuchtigkeitsresistent, bakterienfest und alterungsbeständig.',
    riskClass: 'high',
    riskDetail: 'Enthält extrem hohe Gehalte an krebserregenden Polyzyklischen Aromatischen Kohlenwasserstoffen (PAK) (z.B. Benzo[a]pyren). Die Schadstoffe können durch Fugen ausgasen. Häufig zusätzlich mit Asbest belastet.',
    actionDetail: 'Probenahme auf PAK und Asbest zwingend vor Bodenarbeiten. Sanierung (Abfräsen) im Schwarzbereich unter Unterdruck, Vollschutz und Atemschutz nach DGUV Regel 101-004 und TRGS 519 (bei Asbest). Entsorgung als gefährlicher teerhaltiger Abfall.'
  },

  // --- SPÄTMODERNE & PLATTENBAU (1970-1989) ---
  {
    id: 'spannstahl_hennigsdorfer',
    name: 'Hennigsdorfer Spannstahl (St 140/160)',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1970 - 1989',
    composition: 'Ölschlussvergüteter Spannstahl (St 140/160) mit Silizium- und Manganlegierung, hergestellt im VEB Qualitäts- und Edelstahlkombinat Hennigsdorf (DDR).',
    application: 'Spannbetonträger, HP-Schalenelemente, vorgefertigte Deckenplatten im DDR-Wohnungsbau (WBS 70, P2) und Industriebau.',
    characteristics: 'Extrem hohe Zugfestigkeit (Streckgrenze ca. 1400 N/mm²), jedoch hochgradig empfindlich gegenüber korrosiven Angriffen und Gitterfehlern durch Wasserstoffdiffusion.',
    riskClass: 'high',
    riskDetail: 'Massive Gefahr von plötzlichem, ankündigungslosem Sprödbruch durch Spannungsrisskorrosion (SpRK). Feuchtigkeitseintritt durch undichte Dächer oder unvollständig verpresste Hüllrohre kann wasserstoffinduzierte Spannungsrisskorrosion auslösen; die Schädigung kann bereits in der Bauzeit angelegt sein (vgl. Teileinsturz der Carolabrücke Dresden, September 2024).',
    actionDetail: 'Bauwerksprüfung und Feuchteüberwachung; bei Brücken Nachweis des Ankündigungsverhaltens nach der Handlungsanweisung Spannungsrisskorrosion (BMVBS 2011), im Hochbau in Anlehnung daran. Bei Rissbildung oder Feuchtigkeitsschäden ist eine sofortige mechanische Abfangung oder Deckenunterstützung einzurichten.'
  },
  {
    id: 'porenbeton',
    name: 'Porenbeton (Ytong-Plansteine / Gasbeton)',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1970 - 1989',
    composition: 'Fein gemahlener Quarzsand, Kalk und/oder Zement, Wasser und Alupulver als Treibmittel. Im Autoklav hydrothermal gehärtet.',
    application: 'Massives wärmedämmendes Außenmauerwerk, leichte Trennwände, Decken- und Dachplatten.',
    characteristics: 'Extrem leichte Verarbeitung (sägbar), homogene Rohdichte (0,35 - 0,65 kg/dm³), sehr gute Wärmedämmung durch mikroskopische Luftporen bei isotropen Festigkeitseigenschaften.',
    riskClass: 'none'
  },
  {
    id: 'kalksandstein',
    name: 'Kalksandstein (KS-Sichtmauerwerk)',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1970 - 1989',
    composition: 'Mischung aus Kalkhydrat (ca. 7 %) und kieselsäurereichem Quarzsand (ca. 93 %), gepresst und im Autoklav hydrothermal gehärtet.',
    application: 'Tragende Innenwände, zweischaliges Verblendmauerwerk, Kellerwände.',
    characteristics: 'Sehr hohe Rohdichte und Druckfestigkeit, sehr gute Schalldämmung und hohe Maßhaltigkeit. Keine nennenswerten Wärmedämmeigenschaften.',
    riskClass: 'none'
  },
  {
    id: 'gipsfaserplatten',
    name: 'Gipsfaserplatten (Fermacell)',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1970 - 1989',
    composition: 'Homogenes Gemisch aus Naturgips oder REA-Gips und rezyklierten Papierfasern (Cellulose), ohne Kartonumhüllung hochdruckgepresst.',
    application: 'Trockenbauwände, Dachgeschossausbau, Brandschutzbekleidungen, Fußboden-Estrich-Elemente.',
    characteristics: 'Deutlich höhere Biegezugfestigkeit, Stoßfestigkeit und Oberflächenhärte als klassischer Gipskarton. Zudem feuchtraumgeeignet und nichtbrennbar (Baustoffklasse A2-s1,d0 nach DIN EN 13501-1).',
    riskClass: 'none'
  },
  {
    id: 'spannbetontraeger',
    name: 'Spannbeton / Fertigteil-Binder',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1970 - 1989',
    composition: 'Hochfester Konstruktionsbeton bewehrt mit hochfesten, mechanisch vorgespannten Stählen (Spannstahl).',
    application: 'Dachträger für weitgespannte Industriehallen, Decken-Hohlplatten (Spannbeton-Hohlplatten), Brückenträger.',
    characteristics: 'Ermöglicht extrem schlanke Bauteilquerschnitte bei enormen Spannweiten, da der Beton durch die Vorspannung rein auf Druck beansprucht wird.',
    riskClass: 'low',
    riskDetail: 'Gefahr von Spannungsrisskorrosion bei älteren Spannstählen (z.B. Hennigsdorfer Spannstahl in der DDR) bei Feuchteeintrag.',
    actionDetail: 'Regelmäßige visuelle Bauwerksprüfung, Rissmonitoring und ZfP-Ultraschalluntersuchungen der Spannglieder. Feuchteschutz zwingend aufrechterhalten.'
  },
  {
    id: 'magnesit_steinholz',
    name: 'Magnesitestrich / Steinholz-Böden',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1970 - 1989',
    composition: 'Kaustisches Magnesiumoxid vermischt mit wässriger Magnesiumchloridlösung (Sorelzement) und Holzmehl oder Holzspänen als Füllstoff.',
    application: 'Fugenlose Fußböden in Industriehallen, Werkstätten, Kellern und Wohnräumen.',
    characteristics: 'Geringes Eigengewicht, elastisch, fußwarm, trittsicher und ölbeständig. Allerdings extrem empfindlich gegenüber anhaltender Feuchte.',
    riskClass: 'low',
    riskDetail: 'Bei Feuchtigkeitseinfluss dissoziiert das Magnesiumchlorid. Die gelösten Chloride wirken stark korrosiv auf eingebettete Stahlleitungen und Bewehrung im angrenzenden Beton.',
    actionDetail: 'Trocken halten. Bei Sanierung Feuchtemessung durchführen; keinesfalls mit diffusionsdichten Beschichtungen absperren, wenn darunter Feuchtquellen liegen.'
  },
  {
    id: 'fckw_pur_hartschaum',
    name: 'FCKW-haltiger PUR-Hartschaum',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1970 - 1989',
    composition: 'Polyurethan-Hartschaum (PUR), aufgeschäumt mit Fluorchlorkohlenwasserstoffen (FCKW, vorwiegend R11 / R12) als Zellgas.',
    application: 'Aufdachdämmungen, Steildachdämmungen, Flachdachisolierungen, Sandwichpaneele im Hallenbau, Rohrleitungsschalen.',
    characteristics: 'Sehr gute thermische Isolationswirkung (λ ≈ 0,022 – 0,026 W/(m·K)), sehr geringes Raumgewicht, formstabil, beständig gegen Fäulnis.',
    riskClass: 'medium',
    riskDetail: 'Enthält ozonschädigende FCKW-Zellgase, die bei Zerstörung oder mechanischer Zerkleinerung freigesetzt werden. Im Brandfall entstehen hochgiftige Pyrolysegase (u.a. Blausäure HCN und Isocyanate).',
    actionDetail: 'Sanierung und Abbruch müssen zerstörungsfrei und ohne mechanisches Schreddern erfolgen. Einstufung als gefährlicher Abfall. Getrennte Entsorgung in speziellen Verbrennungsanlagen zur thermischen Zerstörung der FCKW-Verbindungen.'
  },
  {
    id: 'heraklith_tektalan',
    name: 'Holzwolle-Mehrschichtplatten (Tektalan)',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1970 - 1989',
    composition: 'Dreischichtige Verbundplatte mit beidseitigen Deckschichten aus mineralisch gebundener Holzwolle und einem Kern aus EPS oder Mineralwolle.',
    application: 'Wärmedämmung und Schallschutz an Decken und Wänden, insbesondere in Kellergängen, Tiefgaragen und als verlorene Schalung.',
    characteristics: 'Hervorragende Putzhaftung, mechanisch hoch belastbar, schallabsorbierend und brandhemmend. Kernschicht aus EPS oder Mineralwolle sorgt für die eigentliche Dämmwirkung.',
    riskClass: 'low',
    riskDetail: 'Bei Platten vor 1990 kann der EPS-Kern mit dem Flammschutzmittel HBCD belastet sein, oder die Mineralwolle-Schicht besteht aus krebserregenden alten künstlichen Mineralfasern (KMF).',
    actionDetail: 'Prüfung der Kernschicht vor dem Rückbau. Bei KMF-Kernen Rückbau unter Vollschutz nach TRGS 521 vornehmen.'
  },
  {
    id: 'poroton_ziegel',
    name: 'Porosierte Hochlochziegel (Poroton)',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: 'seit den 1960er Jahren',
    composition: 'Feiner Ton vermischt mit organischen Porenbildnern (wie expandiertem Polystyrol-Granulat oder Sägemehl). Die Porenbildner verbrennen beim Ziegelbrand rückstandslos und hinterlassen mikroskopische wärmedämmende Poren im Scherben.',
    application: 'Monolithisches einschaliges Außenmauerwerk für hocheffiziente Wohn- und Bürogebäude.',
    characteristics: 'Niedrige Rohdichte (ca. 0,6 - 0,8 kg/dm³), sehr gute thermische Dämmwirkung bei gleichzeitig hoher kapillarer Feuchtetransportfähigkeit. Mechanisch spröde, mäßige Schalldämmung.',
    riskClass: 'none',
    riskDetail: 'Keine Schadstoffe. Erhöhte Rissempfindlichkeit im Putzgefüge bei ungeeigneten, zu harten Außenputzen. Geringe Ausziehwiderstände für Dübel.',
    actionDetail: 'Putzsysteme müssen elastisch und spannungsarm eingestellt sein (Leichtputze). Dübelmontagen ausschließlich mit zugelassenen Porenbeton- bzw. Lochstein-Spezialdübeln ausführen.'
  },
  {
    id: 'urea_formal_schaum',
    name: 'Urea-Formaldehyd-Ortschaum (UF-Schaum)',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1970 - 1990',
    composition: 'Harnstoff-Formaldehyd-Kunstharz, das unter Zusatz eines Katalysators und Treibmittels direkt vor Ort flüssig aufgeschäumt wird.',
    application: 'Nachträgliche Einblas- bzw. Kerndämmung von zweischaligem Mauerwerk, Verfüllung von unzugänglichen Hohlräumen und Schächten.',
    characteristics: 'Sehr leichter, weißer, feinzelliger Schaum mit gipsähnlicher Konsistenz im gehärteten Zustand. Besitzt eine mäßige thermische Leitfähigkeit, schrumpft jedoch im Laufe der Zeit nennenswert.',
    riskClass: 'medium',
    riskDetail: 'Durch hydrolytische Spaltung des Harzes bei Feuchtigkeit wird über Jahrzehnte krebserregendes Formaldehyd-Gas freigesetzt. Der Schaum versprödet extrem und zerfällt bei Erschütterung zu lungengängigem Feinstaub.',
    actionDetail: 'Raumluft-Messung auf Formaldehyd veranlassen. UF-Schaum im Sanierungsfall durch vorsichtiges Absaugen oder manuellen Ausbau vollständig aus den Hohlräumen entfernen. Innenwandfugen luftdicht absperren.'
  },
  {
    id: 'bitumenwellplatte',
    name: 'Bitumen-Wellplatten (Dachwellplatte)',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1970 - 1995',
    composition: 'Gepresste organische Zellstoff- und Altpapierfasern, unter Vakuum mit heißem Bitumen vollflächig getränkt und in Wellform gepresst.',
    application: 'Einfache Dacheindeckungen für Schuppen, Garagen, landwirtschaftliche Hallen, Holzlager, Giebelverkleidungen.',
    characteristics: 'Sehr geringes Eigengewicht (ca. 3 kg/m²), extrem kostengünstig, leicht zu sägen und zu nageln. Beständig gegen verdünnte Säuren, neigt jedoch unter thermischer Belastung zur plastischen Verformung.',
    riskClass: 'low',
    riskDetail: 'Zwar asbestfrei, doch ältere Platten (vor 1990) können teerhaltige Klebe- und Deckbeschichtungen mit gesundheitsgefährdendem PAK-Anteil aufweisen. Bei Überhitzung (Sonneneinstrahlung) kommt es zur Erweichung und Geruchsentwicklung.',
    actionDetail: 'Platten trocken schneiden verboten (Staubschutz). Laboranalyse auf PAK veranlassen. Entsorgung als gefährlicher bituminierter Baustoff, getrennt von asbestfreiem Mischabfall.'
  },
  {
    id: 'pcb_fugendicht_thiokol',
    name: 'PCB-haltige Fugendichtungsmassen (Thiokol)',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1970 - 1980',
    composition: 'Elastische, meist zweikomponentige Fugendichtstoffe auf Polysulfid-Basis (Handelsname oft Thiokol), die mit Polychlorierten Biphenylen (PCB, ca. 10 - 30 %) als Weichmacher versetzt wurden.',
    application: 'Dehnungsfugen im Betonfertigteilbau (Plattenbauten), Anschlussfugen von Fenstern/Türen, Fugen an Außenfassaden.',
    characteristics: 'Dauerelastisch, hervorragend alterungs- und witterungsbeständig, meist grau, braun oder schwarz gefärbt. Besitzt eine zähe, gummiartige Haptik.',
    riskClass: 'high',
    riskDetail: 'PCB gast kontinuierlich aus, kontaminiert dauerhaft die Innenraumluft und migriert tief in angrenzende mineralische Baustoffe (Flankenmigration in den Beton). PCB ist krebserregend, schädigt das Immunsystem, das Nervensystem und ist stark fortpflanzungsgefährdend.',
    actionDetail: 'Raumluft- und Substanzanalysen veranlassen. Sanierung (Entfernung) darf nur durch zertifizierte Fachbetriebe unter Unterdruck und Vollschutz erfolgen. Mechanisches Herausschneiden ohne Hitzeeinwirkung (kein Schweißen/Brennen!). Kontaminierte Betonflanken müssen abgefräst werden.'
  },
  {
    id: 'pcp_lindan_holzschutz',
    name: 'Schadstoffbelastete Holzschutzmittel (PCP & Lindan)',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1965 - 1989',
    composition: 'Chemische Holzschutzmittel gelöst in organischen Lösemitteln oder Ölen, mit Pentachlorphenol (PCP) als Fungizid und Lindan als Insektizid (z.B. Xylamon).',
    application: 'Großflächiger vorbeugender und bekämpfender Holzschutz für Dachstühle, tragende Deckenbalken, Holzfassaden und innere Holzbekleidungen.',
    characteristics: 'Zieht tief in das Holzgefüge ein. Verursacht einen typischen, muffigen und chemischen Geruch, der sich auch nach Jahrzehnten auf Textilien und Einrichtungsgegenstände überträgt ("Dachbodengeruch").',
    riskClass: 'high',
    riskDetail: 'PCP und Lindan dunsten permanent aus und reichern sich stark im Hausstaub an. PCP enthält verfahrensbedingt hochgiftige Verunreinigungen an Dioxinen und Furanen. Beide Stoffe wirken leberschädigend, krebserregend, neurotoxisch und schwächen das Immunsystem.',
    actionDetail: 'Hausstaub-, Holz- und Raumluftuntersuchung durchführen. Sanierung durch Demontage belasteter Hölzer (unter FFP3-Atemschutz) oder luftdichte Maskierung mittels bauaufsichtlich zugelassener schadstoffundurchlässiger Polyurethan-Lacke (PU-Beschichtung).'
  },
  {
    id: 'sokalit_asbest_ddr',
    name: 'DDR-Leichtbauplatten Sokalit & Baufan',
    epochId: 'spaetmoderne',
    epochLabel: 'Spätmoderne & Plattenbau',
    years: '1970 - 1989',
    composition: 'Gips- oder mineralisch gebundene Leichtbauplatten unter Zugabe von Papierfasern, Zellstoff und ca. 10 - 20 % krebserregenden Asbestfasern (vorwiegend Chrysotil).',
    application: 'DDR-Systembauten (z.B. WBS 70) für Innenwände, Lüftungskanäle, Wandverkleidungen, Heizkörpernischen und Kabeltrassen.',
    characteristics: 'Sehr geringe Rohdichte, feuerhemmend, leicht zu sägen, nageln und bohren. Die Oberfläche besitzt eine leicht faserige und weiche Textur.',
    riskClass: 'high',
    riskDetail: 'Besitzt eine schwache bis mittelfeste Faserbindung. Bereits bei geringen mechanischen Einwirkungen (Einschlagen von Nägeln, Bohren für Dübel, Beschädigungen) werden extrem hohe Mengen lungengängiger Asbestfasern in die Raumluft freigesetzt.',
    actionDetail: 'Absolutes Bohr- und Bearbeitungsverbot! Kennzeichnung im Bestand erforderlich. Sanierung durch staubfreien Ausbau im Ganzen unter Vollschutz und Unterdruckhaltung nach den Richtlinien der TRGS 519.'
  },

  // --- MODERNE & ÖKOLOGISCHER WANDEL (AB 1990) ---
  {
    id: 'faserzement_modern',
    name: 'Asbestfreie Faserzementplatten (Eternit neu)',
    epochId: 'moderne',
    epochLabel: 'Moderne & Ökologischer Wandel',
    years: 'ab 1990',
    composition: 'Portlandzement bewehrt mit synthetischen organischen Fasern (Polyvinylalkohol-Fasern / PVA) und Prozessfasern aus Cellulose.',
    application: 'Moderne vorgehängte hinterlüftete Fassaden (VHF), Dacheindeckungen, Balkonbekleidungen.',
    characteristics: 'Absolut asbestfrei, gesundheitlich völlig unbedenklich. Behält alle Vorteile der Witterungsbeständigkeit, Unbrennbarkeit (Klasse A) und Langlebigkeit bei.',
    riskClass: 'none'
  },
  {
    id: 'faserzement_rohr_neu',
    name: 'Faserzementrohre (asbestfrei)',
    epochId: 'moderne',
    epochLabel: 'Moderne & Ökologischer Wandel',
    years: 'ab 1990',
    composition: 'Homogenes Gemisch aus Zementleim und synthetischen PVA-Fasern sowie hochaufgeschlossenen Cellulose-Armierungsfasern.',
    application: 'Lüftungsleitungen, Abwasserkanäle, Kabelschutzrohre im Erdreich, Schornstein-Innenrohre.',
    characteristics: 'Frei von gesundheitsgefährdendem Asbest. Hohe mechanische Festigkeit, hervorragende Korrosionsbeständigkeit gegenüber häuslichem Abwasser, alterungsbeständig und formstabil.',
    riskClass: 'none',
    riskDetail: 'Keine Schadstoffrisiken. Mechanisch jedoch spröder als moderne Polymerrohre (z.B. PE-HD) oder duktile Gussrohre, daher empfindlich gegenüber Punktlasten im Grabenbau.',
    actionDetail: 'Beim Einbau im Erdreich auf ein homogenes, steinfreies Sandbett achten, um Punktlasten und daraus resultierende Spannungsrisse zu vermeiden.'
  },
  {
    id: 'holzweichfaser',
    name: 'Holzweichfaser-Dämmplatten (HFD)',
    epochId: 'moderne',
    epochLabel: 'Moderne & Ökologischer Wandel',
    years: 'ab 1990',
    composition: 'Aus Nadelholz gewonnenes Holzfasergewebe, verfilzt und unter Druck mit holzeigenem Lignin oder unbedenklichen PUR-Harzen gebunden.',
    application: 'Aufsparrendämmung, Innendämmung von Außenwänden, Putzträgerplatten für ökologische WDVS.',
    characteristics: 'Sehr guter sommerlicher Wärmeschutz durch sehr hohe spezifische Wärmekapazität, diffusionsoffen und sorptionsfähig, hervorragende Ökobilanz.',
    riskClass: 'none'
  },
  {
    id: 'brettsperrholz',
    name: 'Brettsperrholz (BSP / CLT)',
    epochId: 'moderne',
    epochLabel: 'Moderne & Ökologischer Wandel',
    years: 'ab 1990',
    composition: 'Mehrschichtig rechtwinklig kreuzweise verklebte Massivholzbretter (meist Fichte, Tanne oder Kiefer).',
    application: 'Tragende Wand-, Decken- und Dachsegmente im mehrgeschossigen Holz- und Hybridbau.',
    characteristics: 'Extrem hohe statische Belastbarkeit bei geringem Eigengewicht. Hohe Formstabilität und Dimensionsgenauigkeit durch die kreuzweise Absperrung.',
    riskClass: 'none'
  },
  {
    id: 'eps_daemmung',
    name: 'EPS-Hartschaumplatten (Styropor)',
    epochId: 'moderne',
    epochLabel: 'Moderne & Ökologischer Wandel',
    years: 'ab 1990',
    composition: 'Expandiertes Polystyrol (EPS), bis ca. 2015 unter Verwendung des mittlerweile verbotenen bromierten Flammschutzmittels HBCD gefertigt.',
    application: 'Wärmedämmverbundsysteme (WDVS), Trittschalldämmung, Flachdächer.',
    characteristics: 'Sehr leicht, kostengünstig, sehr gute Dämmleistung, verrottungsfest.',
    riskClass: 'medium',
    riskDetail: 'Bei Alt-EPS-Platten (vor 2015) hohe HBCD-Belastung (PBT-Stoff). Bei Brand entstehen toxische bromierte Dioxine/Furane.',
    actionDetail: 'HBCD-haltige Dämmstoffe sind POP-haltige Abfälle (POP-Abfall-Überwachungs-Verordnung 2017): getrennt sammeln, Nachweispflicht, thermische Behandlung in Anlagen mit Rauchgasreinigung. Sie gelten nicht pauschal als gefährlicher Abfall.'
  },
  {
    id: 'alu_verbundplatten',
    name: 'Aluminium-Verbundplatten (Alucobond-Typ)',
    epochId: 'moderne',
    epochLabel: 'Moderne & Ökologischer Wandel',
    years: 'ab 1990',
    composition: 'Sandwichstruktur bestehend aus zwei dünnen Aluminium-Deckblechen (ca. 0,5 mm) und einem Kern aus Polyethylen (PE) oder mineralisch gefüllten Kunststoffen.',
    application: 'Vorgehängte hinterlüftete Fassadenbekleidungen (VHF), Attika- und Balkonverkleidungen, Deckenuntersichten.',
    characteristics: 'Extrem plan, hervorragendes Verhältnis von Steifigkeit zu Eigengewicht, witterungsbeständig, schall- und schwingungsdämpfend. Leicht mechanisch formbar (Biege- und Fräskanttechnik).',
    riskClass: 'medium',
    riskDetail: 'Fassadenplatten der ersten Generationen mit reinem PE-Kern weisen eine extrem schlechte Brandschutzklasse auf (Klasse B2 - normalentflammbar). Im Brandfall schmilzt das Aluminium und der brennende PE-Kern tropft rasant ab, was zu einer extrem schnellen Brandausbreitung an der Fassade führt (Kamin-Effekt).',
    actionDetail: 'Im Zuge von Sanierungen oder baulichen Erweiterungen ist die Brandschutzklassifizierung des Kerns zu prüfen. Bei Hochhäusern oder Sonderbauten dürfen Platten mit brennbarem PE-Kern nicht mehr verbaut werden; sie müssen zwingend durch Platten mit mineralisch gefülltem oder nicht brennbarem Kern (z.B. Alucobond Plus oder A2) ersetzt werden.'
  }
];

export default function HistorischeBauprodukte() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEpoch, setSelectedEpoch] = useState<'all' | 'vorkrieg' | 'nachkrieg' | 'spaetmoderne' | 'moderne'>('nachkrieg');
  const [activeTab, setActiveTab] = useState<'steckbrief'>('steckbrief');

  const filteredProducts = useMemo(() => {
    return HISTORIC_PRODUCTS.filter((prod) => {
      const matchesSearch = 
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.composition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.application.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.characteristics.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEpoch = selectedEpoch === 'all' || prod.epochId === selectedEpoch;

      return matchesSearch && matchesEpoch;
    });
  }, [searchTerm, selectedEpoch]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Intro Header Card following styleguide */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 id="hist-bauprodukte-title" className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" size={24} /> Historische Bauprodukte nach Epochen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed font-light">
          <p>
            Im Altbestand konfrontieren uns Tragwerke und Bauteile mit Werkstoffen und Bauprodukten, die in heutigen Normen nicht mehr abgebildet sind. Zur systematischen Diagnostik ordnen wir diese Produkte nach ihrer historischen Entstehungsepoche ein. Der Schwerpunkt liegt dabei auf der Nachkriegszeit bis heute, mit Fokus auf die charakteristischen Werkstoffeigenschaften, mechanische und chemische Kenngrößen sowie deren ingenieurtechnische Besonderheiten im Bestand.
          </p>
        </div>
      </div>

      {/* Tab Navigation conforming to instructions: "nur reiter material-steckbriefe" */}
      <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 -mb-4">
        <button
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
            activeTab === 'steckbrief' 
              ? 'bg-shiraz text-white border-shiraz shadow-md' 
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
          }`}
          onClick={() => setActiveTab('steckbrief')}
        >
          <BookOpen size={16} /> Material-Steckbriefe
        </button>
      </div>

      {/* Epoch Navigation System within Steckbriefe */}
      {activeTab === 'steckbrief' && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          <div className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-5">
            
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={14} className="text-shiraz" /> Historische Einordnung (Epoche wählen)
              </h3>
              <p className="text-xs text-slate-500 font-light">
                Wählen Sie eine Epoche, um die damals typischerweise verwendeten Bauprodukte, deren Materialkennwerte sowie bautechnischen Verhaltensweisen anzuzeigen.
              </p>
            </div>

            {/* Horizontal Navigation Buttons */}
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'all', label: 'Alle Epochen', desc: 'Gesamtkatalog' },
                { id: 'vorkrieg', label: 'Vorkriegszeit / Historisch', desc: 'bis 1945' },
                { id: 'nachkrieg', label: 'Nachkriegszeit & Wiederaufbau', desc: '1945 - 1969 (Fokus)' },
                { id: 'spaetmoderne', label: 'Spätmoderne & Plattenbau', desc: '1970 - 1989 (Fokus)' },
                { id: 'moderne', label: 'Moderne & Öko-Wandel', desc: 'ab 1990' }
              ].map((epoch) => (
                <button
                  key={epoch.id}
                  onClick={() => setSelectedEpoch(epoch.id as any)}
                  className={`px-4 py-3 rounded-xl font-bold text-xs transition-all border flex flex-col gap-0.5 items-start cursor-pointer w-full sm:w-auto min-w-[140px] text-left ${
                    selectedEpoch === epoch.id
                      ? 'bg-shiraz text-white border-shiraz shadow-md'
                      : 'bg-white text-text-main border-home-grau/25 hover:bg-slate-50 hover:border-home-grau/40'
                  }`}
                >
                  <span>{epoch.label}</span>
                  <span className={`text-[9px] font-mono font-medium block ${selectedEpoch === epoch.id ? 'text-white/80' : 'text-slate-500'}`}>
                    {epoch.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Search input inside epoch panel */}
            <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Produkt, Inhaltsstoffe oder Anwendung suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs p-2.5 pl-9 rounded-xl border border-home-grau/30 focus:border-shiraz focus:ring-1 focus:ring-shiraz focus:outline-none bg-white text-text-main"
                />
                <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
              <div className="text-[10px] text-slate-500 font-mono italic">
                Gefundene Produkte in dieser Auswahl: {filteredProducts.length}
              </div>
            </div>

          </div>

          {/* Material Steckbriefe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Informational Diagnostics banner */}
            <div className="md:col-span-2 bg-[#fcf8f2] border border-amber-100 p-4 rounded-xl flex items-start gap-3">
              <Info className="text-amber-800 shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-amber-900 leading-relaxed font-light">
                <strong>Baubiologische &amp; Konstruktive Diagnostik im Bestand:</strong> 
                <p className="mt-1">
                  Im Zuge des Wiederaufbaus und der nachfolgenden Industrialisierung des Bauens wurden tausende chemisch modifizierte Zusatzstoffe und Verkleidungen eingebracht. Bei einer Sanierung im Bestand ist eine genaue Kenntnis der jeweiligen Bauphase unerlässlich, um Schäden an Mensch und Tragwerk zu vermeiden.
                </p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="md:col-span-2 bg-white p-12 rounded-2xl border border-home-grau/30 text-center text-slate-400 text-xs">
                Keine historischen Bauprodukte gefunden, die den Such- und Filterkriterien entsprechen.
              </div>
            ) : (
              filteredProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 hover:shadow-md hover:border-shiraz/30 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2 border-b border-home-grau/10 pb-3">
                      <div>
                        <h3 className="font-extrabold text-text-main text-base group-hover:text-shiraz transition-colors">
                          {prod.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9px] font-mono font-bold uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {prod.epochLabel}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-shiraz bg-shiraz/5 border border-shiraz/10 px-2.5 py-1 rounded-md shrink-0">
                        {prod.years}
                      </span>
                    </div>

                    <div className="space-y-3.5 text-xs text-text-main/80 leading-relaxed font-light">
                      <p>
                        <strong className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-0.5">Zusammensetzung &amp; Inhaltsstoffe:</strong> 
                        {prod.composition}
                      </p>
                      <p>
                        <strong className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-0.5">Typische Einbauorte:</strong> 
                        {prod.application}
                      </p>
                      <p>
                        <strong className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-0.5">Eigenschaften &amp; Gefüge:</strong> 
                        {prod.characteristics}
                      </p>
                    </div>
                  </div>

                  {/* Conditionally display risk warning details */}
                  {prod.riskClass !== 'none' && (
                    <div className={`mt-5 p-4 rounded-xl border text-xs space-y-2 ${
                      prod.riskClass === 'high' 
                        ? 'bg-red-50/50 border-red-200/60 text-red-950' 
                        : prod.riskClass === 'medium'
                        ? 'bg-amber-50/50 border-amber-200/60 text-amber-950'
                        : 'bg-blue-50/50 border-blue-200/60 text-blue-950'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider">
                        <ShieldAlert className={prod.riskClass === 'high' ? 'text-red-700' : 'text-amber-700'} size={14} />
                        <span>Bautechnische Gefahren, Risiken &amp; Schadstoffe:</span>
                      </div>
                      <p className="font-light leading-relaxed">{prod.riskDetail}</p>
                      
                      {prod.actionDetail && (
                        <div className="pt-2 border-t border-red-200/45">
                          <strong className="font-bold text-[10px] tracking-wider uppercase block mb-0.5">Instandhaltung, Prüfung &amp; Sanierungsmethode:</strong>
                          <p className="font-light leading-relaxed text-slate-700">{prod.actionDetail}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {prod.riskClass === 'none' && (
                    <div className="mt-5 p-3.5 bg-green-50/45 border border-green-150 text-green-950 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle className="text-green-700 shrink-0" size={14} />
                      <span className="font-light">
                        <strong>Klassisches Bauprodukt:</strong> Weitgehend unbedenklich. Geeignet für Standard-Instandhaltung und substanzschonende Sanierung im Denkmalbestand.
                      </span>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* standard module footer conforming to styleguide */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: PCB-Raumluftmessung bewerten"
        zielGleichung="c_{PCB} \;\text{vs.}\; 300 \;\text{bzw.}\; 3\,000\,\text{ng/m}^3"
        schritte={[
          { titel: 'Messwert', erklaerung: 'Schule aus den 1970er Jahren, dauerelastische Fugenmassen; Gesamt-PCB in der Raumluft:', formel: 'c_{PCB} = 1\\,400\\,\\text{ng/m}^3' },
          { titel: 'Bewertung', erklaerung: 'PCB-Richtlinie: unter 300 ng/m³ langfristig tolerabel (Zielwert), über 3 000 ng/m³ unverzüglich Maßnahmen:', formel: '300 < 1\\,400 < 3\\,000\\,\\text{ng/m}^3' },
          { titel: 'Folgerung', erklaerung: 'Quellen ermitteln, mittelfristig sanieren, bis dahin regelmäßig lüften und Kontrollmessungen durchführen.', formel: '\\text{Sanierung mittelfristig}' }
        ]}
        ergebnisHinweis="Für dioxinähnliche PCB und die Gesamtbewertung gelten zusätzliche Kriterien der Länder; die Richtlinie ist bauaufsichtlich über die Länder eingeführt."
        normQuelle="PCB-Richtlinie, Fassung September 1994 (MVV TB 2025/1, lfd. Nr. A 3.2.4 mit Anlage A 3.2/1)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Bleiwerte im Trinkwasser eines Altbaus"
        zielGleichung="c_{Pb} \le 10\,\mu\text{g/l}"
        schritte={[
          { titel: 'Messung', erklaerung: 'Gestaffelte Stagnationsprobe in einem Gründerzeithaus mit Bleileitungen:', formel: 'c_{Pb} = 25\\,\\mu\\text{g/l}' },
          { titel: 'Grenzwert', erklaerung: 'Trinkwasserverordnung 2023:', formel: '25 > 10\\,\\mu\\text{g/l} \\Rightarrow \\text{Überschreitung}' },
          { titel: 'Maßnahme', erklaerung: 'Bleileitungen waren bis 12.01.2026 zu entfernen oder stillzulegen; der Betreiber muss Nutzer informieren.', formel: '\\text{Austausch der Leitungen}' }
        ]}
        ergebnisHinweis="Ab 12.01.2028 sinkt der Grenzwert nach TrinkwV (Anlage 2 Teil II) von 10 auf 5 µg/l; die EU-Trinkwasserrichtlinie verlangt dies erst bis 2036. Bleileitungen finden sich vor allem in Altbauten; ihre Verbreitung ist regional sehr unterschiedlich."
        normQuelle="TrinkwV 2023, § 17 Abs. 1 (Entfernung/Stilllegung) und Abs. 5 (Information der Verbraucher)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="historische_bauprodukte" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 8 Bestand: Schadstoff-Richtwerte und Regelwerke geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Bimsbeton', url: 'https://de.wikipedia.org/wiki/Bims' },
          { title: 'Porenbeton', url: 'https://de.wikipedia.org/wiki/Porenbeton' },
          { title: 'Kalksandstein', url: 'https://de.wikipedia.org/wiki/Kalksandstein' },
          { title: 'Gipsfaserplatte', url: 'https://de.wikipedia.org/wiki/Gipsfaserplatte' },
          { title: 'Brettsperrholz', url: 'https://de.wikipedia.org/wiki/Brettsperrholz' },
          { title: 'Faserzement', url: 'https://de.wikipedia.org/wiki/Faserzement' },
          { title: 'Thomas-Verfahren', url: 'https://de.wikipedia.org/wiki/Thomas-Verfahren' },
          { title: 'Spannungsrisskorrosion', url: 'https://de.wikipedia.org/wiki/Spannungsrisskorrosion' },
          { title: 'Polychlorierte Biphenyle', url: 'https://de.wikipedia.org/wiki/Polychlorierte_Biphenyle' },
          { title: 'Pentachlorphenol', url: 'https://de.wikipedia.org/wiki/Pentachlorphenol' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Bauwerkserhaltung im Denkmal- und Altbaubestand (WTA-Wissenschaftlich-Technische Arbeitsgemeinschaft)'
        ]}
        regelwerke={[
          { title: 'DIN EN 771-4 (Festlegungen für Mauersteine - Teil 4: Porenbetonsteine)' },
          { title: 'DIN EN 771-2 (Festlegungen für Mauersteine - Teil 2: Kalksandsteine)' },
          { title: 'DIN EN 12467 (Faserzement-Flachplatten - Produktspezifikation und Prüfverfahren)' },
          { title: 'GefStoffV (Novelle 12/2024): Erkundungspflicht des Veranlassers bei Gebäuden mit Baubeginn vor 31.10.1993', url: 'https://www.gesetze-im-internet.de/gefstoffv_2010/' },
          { title: 'TRGS 519 (Technische Regeln für Gefahrstoffe - Asbest: Abbruch-, Sanierungs- oder Instandhaltungsarbeiten)', url: 'https://www.baua.de/' },
          { title: 'VDI 6202 Blatt 1 (Schadstoffbelastete bauliche und technische Anlagen – Abbruch-, Sanierungs- und Instandhaltungsarbeiten)', url: 'https://www.vdi.de/' },
          { title: 'Trinkwasserverordnung 2023, § 17 (Bleileitungen: Entfernung bzw. Stilllegung bis 12.01.2026; Fristverlängerung nach Abs. 2/3 möglich)', url: 'https://www.gesetze-im-internet.de/trinkwv_2023/' },
          { title: 'TRGS 521 (Abbruch, Sanierung und Instandhaltung mit alten Mineralfasern)', url: 'https://www.baua.de/' },
          { title: 'PCP-Richtlinie (Richtlinie für die Bewertung und Sanierung Pentachlorphenol-belasteter Baustoffe)' },
          { title: 'PCB-Richtlinie (Richtlinie für die Bewertung und Sanierung PCB-belasteter Baustoffe)' }
        ]}
        formeln={[
          {
            formel: '5\\text{Ca(OH)}_2 + 6\\text{SiO}_2 + 5\\text{H}_2\\text{O} \\xrightarrow{\\text{Autoklav, } \\approx 200^{\\circ}\\text{C}} \\text{Ca}_5\\text{Si}_6\\text{O}_{16}(\\text{OH})_2 \\cdot 4\\text{H}_2\\text{O}',
            erklaerung: 'Hydrothermale Bildungsreaktion von kristallinem Tobermorit (C-S-H Phase) im Autoklav bei der Herstellung von Porenbeton und Kalksandsteinen.',
            quelle: 'Baustoffchemie-Lehrbuch'
          },
          {
            formel: '2\\text{Al} + 2\\text{OH}^- + 6\\text{H}_2\\text{O} \\rightarrow 2[\\text{Al(OH)}_4]^- + 3\\text{H}_2 \\uparrow',
            erklaerung: 'Alkali-Angriff auf ungeschütztes Aluminium. Bei Kontakt mit stark alkalischen Substanzen (wie frischem Beton- oder Zementmörtel, pH-Wert > 12,5) löst sich die Passivschicht auf und es kommt zu rasanter Wasserstoffentwicklung.',
            quelle: 'Korrosionsverhalten von Metallen'
          },
          {
            formel: '\\text{Pb} + \\text{CO}_2 + \\frac{1}{2}\\text{O}_2 \\rightarrow \\text{PbCO}_3 \\text{ (Blei(II)-carbonat-Schutzschicht)}',
            erklaerung: 'Bildung einer dichten und schwer löslichen Passivierungsschicht aus Bleicarbonat im Inneren von Bleitrinkwasserleitungen durch gelöste Kohlensäure im harten Trinkwasser. Schützt vor unkontrollierter Bleiionenfreisetzung.',
            quelle: 'Korrosionschemie Trinkwasser'
          },
          {
            formel: '\\text{(C}_2\\text{H}_3\\text{Cl)}_n \\xrightarrow{\\Delta \\text{ / } h\\nu} (\\text{C}_2\\text{H}_2)_n + n \\text{ HCl} \\uparrow',
            erklaerung: 'Thermischer oder UV-induzierter Abbau (Dehydrochlorierung) von Polyvinylchlorid (PVC), z.B. in alten Flexplatten. Die Abspaltung von Chlorwasserstoff führt zur Verfärbung, Versprödung und Freisetzung saurer korrosiver Dämpfe.',
            quelle: 'Kunststofftechnik'
          },
          {
            formel: '\\text{(C}_5\\text{O}_2\\text{H}_8)_n \\xrightarrow{h\\nu \\text{ / } \\Delta} n \\text{ C}_5\\text{O}_2\\text{H}_8 \\text{ (Monomer)}',
            erklaerung: 'Thermischer- und UV-induzierter Abbau (Depolymerisation) von Polymethylmethacrylat (Plexiglas/PMMA). Der Kettenabbau führt zu Versprödung, Haarissbildung und Festigkeitsverlust.',
            quelle: 'Kunststoffchemie'
          },
          {
            formel: '\\text{Fe} + 2\\text{H}^+ \\rightarrow \\text{Fe}^{2+} + 2\\text{H}_{\\text{ad}} \\rightarrow 2\\text{H}_{\\text{abs}} \\text{ (Gefügepenetration)}',
            erklaerung: 'Wasserstoffaufnahme und -diffusion in das Kristallgitter hochfester Stähle (z.B. Hennigsdorfer Spannstahl). Führt unter ständiger Zugspannung zur gefürchteten Wasserstoffversprödung und schlagartigem Sprödbruch (Spannungsrisskorrosion).',
            quelle: 'Metallphysik & Korrosion'
          },
          {
            formel: '3\\text{CaO}\\cdot\\text{Al}_2\\text{O}_3 \\cdot 3\\text{CaSO}_4 \\cdot 32\\text{H}_2\\text{O} \\text{ (Ettringit-Treiben)}',
            erklaerung: 'Mineralspezifische Expansionsreaktion (sulfatinduziertes Ettringit-Treiben) im Trümmerbeton. Bei Feuchteeintrag reagieren Gipsreste aus kriegszerstörtem Gipsputz mit den Aluminiumhydraten des Zements, was zu enormer Volumenvergrößerung und Gefügesprengung führt.',
            quelle: 'Betonschadensanalytik'
          }
        ]}
      />
    </div>
  );
}
